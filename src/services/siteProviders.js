import { akilliGet, akilliPost, cihazGet, cihazPost, nativeHttpAktifMi } from './nativeHttp.js';
import { oynaticiCoz, masterUrlDuzelt } from './playerDecoders.js';
import { extractEmbedStream } from './embedExtractors.js';

/* ==========================================================================
   CinePulse — çoklu site sürücüsü

   Bu sitelerin çözüm mantığı, calisan kaynaklardaki eklentilerden alındı.
   Üçünün arama ucu farklı ama çerçevesi aynı:
       alan adı → (IMDb ID) → içerik sayfası → bölüm → oynatıcı → m3u8
   Bu yüzden tek sürücü + site başına yapılandırma kullanılıyor; her site için
   ayrı ~700 satırlık dosya yazmıyoruz.

   ÖNEMLİ: istekler akilliGet/akilliPost üzerinden gider. Android'de
   cihazın KENDİ IP'si kullanılır (Cloudflare datacenter IP'lerini
   engelliyor) ve Referer serbestçe yazılabilir.

   ENGEL (ölçüldü 2026-10-12): bu ağdan sunucuya giden isteklerde bu siteler
   Cloudflare 403 döndürüyor. Yani doğrulama cihazda yapılır; buradaki testler
   zincirin doğru kurulduğunu ölçer.
   ========================================================================== */

const TMDB_API_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const SITEURL_LISTESI = 'https://raw.githubusercontent.com/patr0nq/veriler/refs/heads/main/siteurl.txt';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

/* ── SİTE YAPILANDIRMALARI ──────────────────────────────────────────── */

export const SITES = {
  hdfilmcehennemi: {
    ad: 'HDFilmCehennemi',
    listeAnahtari: 'hdfilmcehennemi',
    yedek: ['https://www.hdfilmcehennemi.nl/'],
    tur: ['film', 'dizi'],
    // GET /search?q=… → içerik bağlantıları /video/{id}/
    ara: { yontem: 'GET', yol: (q) => `/search?q=${encodeURIComponent(q)}`, tur: (u) => /\/video\// },
    icerik: (u) => u,
    // Dizi: sayfadaki "N. sezon" / "N. bölüm" yazısından bölüm bağlantısı
    bolum: (html, s, e) => {
      for (const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
        const t = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        const sm = t.match(/(\d+)\.\s*sezon/i);
        const em = t.match(/(\d+)\.\s*böl/i);
        if (sm && em && +sm[1] === s && +em[1] === e) return m[1];
      }
      return '';
    }
  },

  setfilm: {
    ad: 'SetFilm',
    listeAnahtari: null,
    yedek: ['https://www.setfilmizle.uk/'],
    tur: ['film', 'dizi'],
    // WordPress araması: /?s=…
    ara: { yontem: 'GET', yol: (q) => `?s=${encodeURIComponent(q)}`, tur: (u) => /setfilmizle\.uk/.test(u) && u !== 'https://www.setfilmizle.uk/' },
    icerik: (u) => u,
    // Dizi: "N. Bölüm" / "N. Sezon" yazısından bölüm bağlantısı
    bolum: (html, s, e) => {
      for (const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
        const t = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        const sm = t.match(/(\d+)\.?\s*(?:Sezon|Season)/i);
        const em = t.match(/(\d+)\.?\s*(?:Bölüm|Episode)/i);
        if (sm && em && +sm[1] === s && +em[1] === e) return m[1];
      }
      return '';
    }
  },

  selcukflix: {
    ad: 'SelcukFlix',
    listeAnahtari: 'selcukflix',
    yedek: ['https://selcukflix.app/'],
    tur: ['film', 'dizi'],
    // JSON API, IMDb ID ile aranır
    ara: {
      yontem: 'GET',
      yol: (q) => `/api/bg/searchContent?searchterm=${encodeURIComponent(q)}`,
      tur: () => true
    },
    icerik: (u) => u,
    bolum: (_html, s, e, icerikUrl) => {
      const govde = icerikUrl.replace(/\/$/, '');
      return `${govde}-${s}-sezon-${e}-bolum-izle`;
    }
  },

  filmekseni: {
    ad: 'FilmEkseni',
    listeAnahtari: null,                       // listede yok, sabit adres
    yedek: ['https://filmekseni.top/'],
    tur: ['film', 'dizi'],
    // POST /search/ → JSON { result: [{ title, slug }] }
    ara: {
      yontem: 'POST',
      yol: () => '/search/',
      govde: (q) => ({ query: q }),
      tur: () => true
    },
    icerik: (u) => u,
    bolum: (_html, s, e, icerikUrl) => {
      const govde = icerikUrl.replace(/\/$/, '');
      return `${govde}-${s}-sezon-${e}-bolum`;
    }
  }
};

/* ── ALAN ADI ────────────────────────────────────────────────────────── */

const _base = new Map();
const _sonDeneme = new Map();

export async function siteBaseUrl(siteId) {
  if (_base.has(siteId)) return _base.get(siteId);
  const ayar = SITES[siteId];
  const son = _sonDeneme.get(siteId) || 0;
  // CF her istekte 403 verdiği için listeyi saniyede bir kez sormak yeterli.
  if (Date.now() - son < 10 * 60 * 1000) return _base.get(siteId) || ayar.yedek[0];
  _sonDeneme.set(siteId, Date.now());

  if (ayar.listeAnahtari) {
    try {
      const liste = await akilliGet(SITEURL_LISTESI, { timeout: 6000 });
      for (const satir of String(liste || '').split('\n')) {
        // DİKKAT: split(':') değil — adresin kendi "https:" colon'u bölünür.
        const i = satir.indexOf(':');
        if (i < 0) continue;
        if (satir.slice(0, i).trim() === ayar.listeAnahtari) {
          const u = satir.slice(i + 1).trim();
          _base.set(siteId, u.endsWith('/') ? u : `${u}/`);
          return _base.get(siteId);
        }
      }
    } catch (_) { /* listeye ulaşılamadı, aşağıdaki sabitlere düş */ }
  }
  _base.set(siteId, ayar.yedek[0]);
  return _base.get(siteId);
}

/* ── HTTP ────────────────────────────────────────────────────────────── */

async function istek(url, { yontem = 'GET', govde = null, referer = '', timeout = 9000 } = {}) {
  const basliklar = { Accept: '*/*', 'X-Requested-With': 'XMLHttpRequest' };
  if (yontem === 'POST') {
    basliklar['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    if (nativeHttpAktifMi()) {
      const r = await cihazPost(url, new URLSearchParams(govde || {}).toString(), { ref: referer || undefined, headers: basliklar, timeout });
      if (r.ok && r.text) return r.text;
    }
    return (await akilliPost(url, new URLSearchParams(govde || {}).toString(), { ref: referer, timeout })) || '';
  }
  if (nativeHttpAktifMi()) {
    const r = await cihazGet(url, { ref: referer || undefined, headers: basliklar, timeout });
    if (r.ok && r.text) return r.text;
  }
  return (await akilliGet(url, { ref: referer, timeout })) || '';
}

function engelMi(metin) {
  if (!metin || metin.length < 300) return true;
  const ilk = metin.slice(0, 4000).toLowerCase();
  return ilk.includes('just a moment') || ilk.includes('attention required')
      || ilk.includes('cf-browser-verification') || ilk.includes('enable javascript and cookies');
}

function mutlak(yol, taban) {
  try { return new URL(String(yol || '').trim(), taban).toString(); } catch (_) { return ''; }
}

/* ── TMDB → IMDb ─────────────────────────────────────────────────────── */

async function imdbIdBul(tmdbId, mediaType) {
  const tur = mediaType === 'movie' ? 'movie' : 'tv';
  try {
    const m = await akilliGet(
      `https://api.themoviedb.org/3/${tur}/${tmdbId}?api_key=${TMDB_API_KEY}&language=tr-TR&append_to_response=external_ids`,
      { timeout: 8000 }
    );
    const d = JSON.parse(m);
    return (d.imdb_id || d.external_ids?.imdb_id || '').trim();
  } catch (_) { return ''; }
}

/* ── ARAMA ───────────────────────────────────────────────────────────── */

async function siteAra(siteId, terim) {
  const ayar = SITES[siteId];
  const base = await siteBaseUrl(siteId);
  const url = `${base}${ayar.ara.yol(terim).replace(/^\//, '')}`;

  const ham = await istek(url, {
    yontem: ayar.ara.yontem,
    govde: ayar.ara.govde ? ayar.ara.govde(terim) : null,
    referer: base,
    timeout: 9000
  });
  if (!ham) return [];

  const bulunanlar = [];
  const ekle = (baslik, yol) => {
    const u = mutlak(yol, base);
    if (!u || bulunanlar.some((x) => x.url === u)) return;
    if (!ayar.ara.tur(u)) return;
    bulunanlar.push({ title: baslik || terim, url: u });
  };

  // JSON API (SelçukFlix, Film Ekseni)
  if (ham.trim().startsWith('{') || ham.trim().startsWith('[')) {
    try {
      const j = JSON.parse(ham);
      const liste = Array.isArray(j) ? j : (j.result || j.results || j.data || []);
      for (const it of Array.isArray(liste) ? liste : []) {
        if (!it) continue;
        const yol = it.slug || it.url || it.link || it.href;
        if (yol) ekle(it.title || it.name, yol.startsWith('/') ? `${base.replace(/\/$/, '')}${yol}` : yol);
      }
    } catch (_) { /* JSON değilse HTML akışına düş */ }
    if (bulunanlar.length) return bulunanlar;
  }

  // HTML
  for (const m of ham.matchAll(/href=["']((?:https?:\/\/[^"']*)?\/[^"'#?]+)["']/gi)) {
    const adres = mutlak(m[1], base);
    if (!adres || !ayar.ara.tur(adres)) continue;
    const baslik = (ham.slice(Math.max(0, m.index - 240), m.index).match(/>([^<>]{3,90})</g) || [])
      .pop()?.replace(/[<>]/g, '').trim();
    ekle(baslik, adres);
  }
  return bulunanlar;
}

/* ── OYNATICI TOPLAMA ────────────────────────────────────────────────── */

function oynaticilariCikar(html, taban) {
  const liste = [];
  const gorulen = new Set();
  const ekle = (yol, ad) => {
    const u = mutlak(yol, taban);
    if (!u || gorulen.has(u)) return;
    if (/youtube\.com|youtu\.be/i.test(u)) return;
    gorulen.add(u);
    liste.push({ url: u, name: ad || 'Oynatıcı' });
  };
  for (const m of html.matchAll(/<iframe\b[^>]*?(?:data-src|data-lazy-src|src)=["']([^"']+)["']/gi)) ekle(m[1], 'Varsayılan');
  for (const m of html.matchAll(/<a\b[^>]*data-video_url=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    ekle(m[1], m[2].replace(/<[^>]*>/g, '').trim() || 'Oynatıcı');
  }
  for (const m of html.matchAll(/openPlayer\s*\(\s*["']([^"']+)["']/gi)) ekle(m[1], 'Oynatıcı');
  return liste;
}

/* ── DIŞA AÇILANLAR ──────────────────────────────────────────────────── */

/**
 * Verilen siteden yayın kaynaklarını çözer.
 * @param {string} siteId     SITES anahtarı
 * @param {object} secenekler { tmdbId, mediaType, season, episode, imdbId, title }
 */
export async function siteGetirStreams(siteId, {
  tmdbId = '', imdbId = '', title = '', mediaType = 'movie', season = 1, episode = 1
} = {}) {
  const ayar = SITES[siteId];
  if (!ayar) return [];
  const base = await siteBaseUrl(siteId);
  const dizi = mediaType === 'tv' || mediaType === 'series';

  let imdb = String(imdbId || '').trim();
  if (!imdb && tmdbId) imdb = await imdbIdBul(tmdbId, mediaType);

  const terimler = [...new Set([imdb, imdb.replace(/^tt/, ''), title].filter(Boolean))];
  let icerikUrl = '';
  for (const t of terimler) {
    const sonuc = await siteAra(siteId, t);
    const uygun = sonuc[0];
    if (uygun) { icerikUrl = uygun.url; break; }
  }
  if (!icerikUrl) return [];

  // Dizi → bölüm sayfası
  if (dizi) {
    const s = parseInt(String(season), 10) || 1;
    const e = parseInt(String(episode), 10) || 1;
    const diziHtml = await istek(icerikUrl, { referer: base, timeout: 9000 });
    const bolumYolu = ayar.bolum && diziHtml && !engelMi(diziHtml)
      ? ayar.bolum(diziHtml, s, e, icerikUrl)
      : '';
    const bolumUrl = bolumYolu ? mutlak(bolumYolu, base) : '';
    icerikUrl = bolumUrl || icerikUrl;
  }

  const sayfa = await istek(icerikUrl, { referer: base, timeout: 10000 });
  if (!sayfa || engelMi(sayfa)) return [];

  const oynaticilar = oynaticilariCikar(sayfa, base);
  if (!oynaticilar.length) return [];

  const kaynaklar = [];
  for (const oynatici of oynaticilar) {
    // a) Sayfada gömülü oynatıcı çıktısı (openPlayer, file:av, master.txt…)
    const dogrudan = oynaticiCoz(sayfa);
    if (dogrudan && oynatici.url === oynaticilar[0].url) {
      kaynaklar.push({ name: oynatici.name, url: masterUrlDuzelt(dogrudan.url), referer: icerikUrl, via: `${siteId}:${dogrudan.via}` });
    }

    // b) Oynatıcı sayfasını çöz
    const oyHtml = await istek(oynatici.url, { referer: icerikUrl, timeout: 9000 });
    if (!oyHtml) continue;

    const c = oynaticiCoz(oyHtml);
    if (c) {
      kaynaklar.push({ name: oynatici.name, url: masterUrlDuzelt(c.url), referer: oynatici.url, via: `${siteId}:${c.via}` });
      continue;
    }
    // Şifreli/AES oynatıcı ve diğer kalıplar → jenerik motor
    const g = await extractEmbedStream(oynatici.url, icerikUrl).catch(() => null);
    if (g) {
      kaynaklar.push({
        name: oynatici.name,
        url: masterUrlDuzelt(g.url),
        referer: g.referer || oynatici.url,
        isIframe: Boolean(g.isIframe),
        via: `${siteId}:${g.via}`
      });
    }
  }

  if (!kaynaklar.length) return [];
  // Yayın bulunamazsa içerik sayfasının kendisi yedek olur (gömülü oynatılır).
  kaynaklar.unshift({
    name: 'Sayfa', url: icerikUrl, referer: base, isSayfa: true, via: `${siteId}:embed`
  });
  return kaynaklar;
}

/** Siteye göre kaynak listesi. */
export async function siteListesi(siteId, secenekler = {}) {
  try { return await siteGetirStreams(siteId, secenekler); } catch (_) { return []; }
}