import { isStrictMediaTitleMatch } from './mediaMatcher.js';
import { akilliGet, akilliPost, cihazGet, cihazPost, nativeHttpAktifMi } from './nativeHttp.js';
import { oynaticiCoz, masterUrlDuzelt, kaliteEtiketi, masterAltyazilari } from './playerDecoders.js';
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

  /* ── Kalan Patron eklentileri ─────────────────────────────────────── */
  // PatronMulti: vidlink.pro şifreli TMDB kimliği kullanıyor.
  //   1) enc-dec.app/api/enc-vidlink?text=<tmdbId>  → şifreli kimlik
  //   2) vidlink.pro/api/b/movie/<id>  ya da  /api/b/tv/<id>/<s>/<e>
  vidlink: {
    ad: 'VidLink', listeAnahtari: null,
    yedek: ['https://vidlink.pro/'],
    tur: ['film', 'dizi'],
    // İki adımlı: önce şifreleme ucu, sonra yayın ucu
    sifreliKimlik: async (tmdbId) => {
      const y = await akilliGet(`https://enc-dec.app/api/enc-vidlink?text=${encodeURIComponent(tmdbId)}`, { timeout: 8000 });
      const ham = String(y || '').trim();
      // Ölçüm 2026-10-15: uç A/B gibi bazen düz metin, bazen
      // {"status":200,"result":"AAAA…"} zarfı dönüyor. Zarfta ham gövde kimlik
      // sanılınca bozuk ID → vidlink boş/engelli yanıt → 0 kaynak. İki biçim
      // de tanınır; zarf çözülemezse eski düz-metin davranışı korunur.
      if (ham.startsWith('{')) {
        try {
          const j = JSON.parse(ham);
          const ic = String(j?.result ?? '').trim().replace(/^["']|["']$/g, '');
          if (ic) return ic;
        } catch (_) { /* düz metin varsayımına düş */ }
      }
      return ham.replace(/^["']|["']$/g, '');
    },
    ara: { yontem: 'DOGRUDAN', yol: () => '', tur: () => true },
    icerik: (u) => u
  },

  // Kalıplar Patron dosyalarından birebir alındı.
  zenit: {
    // 2embed arama YAPMAZ; TMDB kimliğinden doğrudan gömülü adresi verir.
    // Önceki hâlde `tur: () => false` her sonucu reddediyordu ve akış
    // hiç kaynak üretemiyordu.
    // Not: ölçüldü — 2embed.to şu an bağlantı vermiyor (HTTP 000).
    // Alan adı geri gelince otomatik çalışır.
    ad: 'Zenit', listeAnahtari: null,
    yedek: ['https://2embed.to/'],
    tur: ['film', 'dizi'],
    dogrudanUrl: (base, o) => (o.mediaType === 'movie'
      ? `${base}embed/movie?tmdb=${o.tmdbId}`
      : `${base}embed/tv?tmdb=${o.tmdbId}&season=${o.season}&episode=${o.episode}`),
    ara: { yontem: 'DOGRUDAN', yol: () => '', tur: () => true },
    icerik: (u) => u
  },
  dizipal: {
    ad: 'Dizipal', listeAnahtari: 'dizipal',
    yedek: ['https://dizipal2138.com/', 'https://dizipal1587.com/'],
    tur: ['dizi', 'film'],
    // Patron: `${baseUrl}/ajax-search?q=`
    ara: { yontem: 'GET', yol: (q) => `/ajax-search?q=${encodeURIComponent(q)}`, tur: () => true },
    icerik: (u) => u,
    bolum: (_h, s, e, icerikUrl) => `${icerikUrl.replace(/\/$/, '')}/sezon-${s}/bolum-${e}`
  },
  asyaanimeleri: {
    ad: 'Asya Animeleri', listeAnahtari: null,
    yedek: ['https://asyaanimeleri.top/'],
    tur: ['anime'],
    // Patron: `${MAIN_URL}/?s=${query}`
    ara: { yontem: 'GET', yol: (q) => `/?s=${encodeURIComponent(q)}`, tur: () => true },
    icerik: (u) => u,
    bolum: (_h, s, e, icerikUrl) => `${icerikUrl.replace(/\/$/, '')}/${s}-sezon-${e}-bolum`
  },

  /* ── Patron'da aktif, bizde kayıtlı olmayan iki kaynak ──────────────
     Nuvio eklentilerinde etkin, bizde hiç yoktu. Alan adı ve arama
     yolu Patron dosyalarından birebir alındı. */
  hdfilmdelisi: {
    ad: 'HDFilm Delisi', listeAnahtari: null,
    yedek: ['https://hdfilmdelisi.one/'],
    tur: ['film', 'dizi'],
    ara: { yontem: 'GET', yol: (q) => `/arama?q=${encodeURIComponent(q)}`, tur: () => true },
    icerik: (u) => u
  },
  dortkhd: {
    ad: '4KHD', listeAnahtari: null,
    yedek: ['https://4khdhub.one/'],
    tur: ['film', 'dizi'],
    ara: { yontem: 'GET', yol: (q) => `?s=${encodeURIComponent(q)}`, tur: () => true },
    icerik: (u) => u,
    bolum: (_h, s, e, icerikUrl) => `${icerikUrl.replace(/\/$/, '')}/${s}-sezon-${e}-bolum`
  },

  /* ── Patron eklentilerinden kalan iki kaynak ──────────────────────────
     17 patron eklentisinin 15'i zaten bizdeydi; bu ikisi eksikti. */
  film666: {
    ad: '666 Film', listeAnahtari: null,
    yedek: ['https://666filmizle.site/'],
    tur: ['film', 'dizi'],
    ara: { yontem: 'GET', yol: (q) => `/?s=${encodeURIComponent(q)}`, tur: (u) => /\/(?:film|dizi)\//.test(u) },
    icerik: (u) => u
  },
  dizify: {
    ad: 'Dizify', listeAnahtari: null,
    yedek: ['https://dizify.org/'],
    tur: ['film', 'dizi'],
    ara: { yontem: 'GET', yol: (q) => `/api/v1/search?q=${encodeURIComponent(q)}`, tur: () => true },
    icerik: (u) => u
  },

  /* ── izlelan sağlayıcılarından çözülenler ──────────────────────────
     45 sağlayıcının obfuscation'ı geri alındı ve arama/oynatıcı kalıpları
     çıkarıldı (site → /api/search?q= gibi). Buradaki her yapılandırma
     o çözümden geldi; tahmin yok. */
  vidy: {
    ad: 'Vidy', listeAnahtari: null, yedek: ['https://www.vidy.st/'], tur: ['film', 'dizi'],
    ara: { yontem: 'GET', yol: (q) => `/api/search?q=${encodeURIComponent(q)}`, tur: () => true },
    icerik: (u) => u
  },
  hdplayersystem: {
    ad: 'HDPlayerSystem', listeAnahtari: null, yedek: ['https://hdplayersystem.com/'], tur: ['film', 'dizi'],
    // Çözülmüş koddan: arama /?s= , dizi listesi /diziler/
    ara: { yontem: 'GET', yol: (q) => `/?s=${encodeURIComponent(q)}`, tur: () => true },
    icerik: (u) => u
  },
  ksdpictures: {
    ad: 'KSDPictures', listeAnahtari: null, yedek: ['https://ksdpictures.site/'], tur: ['film', 'dizi'],
    ara: { yontem: 'GET', yol: (q) => `/ara?q=${encodeURIComponent(q)}`, tur: () => true },
    icerik: (u) => u
  },
  pichive: {
    ad: 'Pichive', listeAnahtari: null, yedek: ['https://pichive.online/'], tur: ['film', 'dizi'],
    ara: { yontem: 'GET', yol: (q) => `/api/search?q=${encodeURIComponent(q)}`, tur: () => true },
    icerik: (u) => u
  },
  vidload: {
    ad: 'VidLoad', listeAnahtari: null, yedek: ['https://vidload.top/'], tur: ['film', 'dizi'],
    ara: { yontem: 'GET', yol: (q) => `/api/search?q=${encodeURIComponent(q)}`, tur: () => true },
    icerik: (u) => u,
    bolum: (_h, s, e, icerikUrl) => `${icerikUrl.replace(/\/$/, '')}/sezon-${s}/bolum-${e}`
  },
  vixolity: {
    ad: 'Vixolity', listeAnahtari: null, yedek: ['https://pl.vixolity.com/'], tur: ['film', 'dizi'],
    ara: { yontem: 'GET', yol: (q) => `/api/search?q=${encodeURIComponent(q)}`, tur: () => true },
    icerik: (u) => u
  },
  tauvideo: {
    ad: 'TauVideo', listeAnahtari: null, yedek: ['https://tau-video.xyz/'], tur: ['film', 'dizi'],
    ara: { yontem: 'GET', yol: (q) => `/api/search?q=${encodeURIComponent(q)}`, tur: () => true },
    icerik: (u) => u
  },
  pilavyerplay: {
    ad: 'PilavyerPlay', listeAnahtari: null, yedek: ['https://pilavyerplay.top/'], tur: ['film', 'dizi'],
    ara: { yontem: 'GET', yol: (q) => `/api/search?q=${encodeURIComponent(q)}`, tur: () => true },
    icerik: (u) => u
  },
  nxsha: {
    ad: 'Nxsha', listeAnahtari: null, yedek: ['https://nxsha.space/'], tur: ['film', 'dizi'],
    ara: { yontem: 'GET', yol: (q) => `/api/search?q=${encodeURIComponent(q)}`, tur: () => true },
    icerik: (u) => u
  },
  vidmolyNet: {
    ad: 'Vidmoly', listeAnahtari: null, yedek: ['https://vidmoly.net/'], tur: ['film', 'dizi'],
    ara: { yontem: 'GET', yol: (q) => `/page/search?value=${encodeURIComponent(q)}`, tur: () => true },
    icerik: (u) => u
  },
  searchPhp: {
    ad: 'SearchPhp', listeAnahtari: null, yedek: ['https://kizaru.tv/'], tur: ['film', 'dizi'],
    ara: { yontem: 'GET', yol: (q) => `/api/search.php?q=${encodeURIComponent(q)}`, tur: () => true },
    icerik: (u) => u
  },
  keywordSearch: {
    ad: 'KeywordSearch', listeAnahtari: null, yedek: ['https://hiriluk.tv/'], tur: ['film', 'dizi'],
    ara: { yontem: 'GET', yol: (q) => `/search?keyword=${encodeURIComponent(q)}`, tur: () => true },
    icerik: (u) => u
  },
  ajaxSearch: {
    ad: 'AjaxSearch', listeAnahtari: null, yedek: ['https://sakazuki.tv/'], tur: ['film', 'dizi'],
    // Çözülmüş koddan: /ajax (ajax-token ile birlikte)
    ara: { yontem: 'GET', yol: (q) => `/ajax?search=${encodeURIComponent(q)}`, tur: () => true },
    icerik: (u) => u
  },
  filmDiziList: {
    ad: 'FilmDiziList', listeAnahtari: null, yedek: ['https://bogard.tv/'], tur: ['film', 'dizi'],
    ara: { yontem: 'GET', yol: (q) => `/?s=${encodeURIComponent(q)}`, tur: (u) => /\/(?:dizi|film)\//.test(u) },
    icerik: (u) => u
  },
  rplayerVideo: {
    ad: 'RplayerVideo', listeAnahtari: null, yedek: ['https://kizaru.tv/'], tur: ['film', 'dizi'],
    ara: { yontem: 'GET', yol: (q) => `/search?q=${encodeURIComponent(q)}`, tur: (u) => /\/(?:video|rplayer)\//.test(u) },
    icerik: (u) => u
  },

  setfilm: {
    ad: 'SetFilm',
    listeAnahtari: null,
    // Ana adres su an BAGLANMIYOR (olculdu: HTTP 000). Patron'in paylastigi
    // oynatici adresleri yedek olarak tutulur; hangisinin yasadigi
    // adresAcikMi() ile her acilista denetlenir.
    yedek: [
      'https://www.setfilmizle.uk/',
      'https://www.setfilmizle.com/',
      'https://fastplay.mom/',
      'https://setplay.shop/'
    ],
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
const _olu = new Set();

/**
 * Alan adı gerçekten açılıyor mu?
 * Sessiz ölümleri yakalar: kaynak site adresi değiştirdiğinde ya da
 * kapandığında uygulama boş liste döndürüp nedenini söylemiyordu.
 * (Ölçüldü: SetFilm'in adresi bağlantı vermiyordu — 0 bayt, 663 ms.)
 */
async function adresAcikMi(adres) {
  try {
    const r = await fetch(adres, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': UA, Accept: 'text/html,*/*' },
      signal: AbortSignal.timeout(7000)
    });
    // Bağlantı kuruldu. 4xx/5xx bile "adres var" demektir (site kapalı olabilir).
    return r.status > 0;
  } catch (_) {
    return false;
  }
}

export async function siteBaseUrl(siteId) {
  if (_base.has(siteId)) return _base.get(siteId);
  const ayar = SITES[siteId];
  if (!ayar) return '';

  // Adres daha önce ölü çıktıysa tekrar denemeyelim (her açılışta 7 sn beklemesin).
  if (_olu.has(siteId) && Date.now() - (_sonDeneme.get(siteId) || 0) < 60000) return '';
  _olu.delete(siteId);

  const son = _sonDeneme.get(siteId) || 0;
  if (Date.now() - son < 10 * 60 * 1000) return _base.get(siteId) || ayar.yedek[0];
  _sonDeneme.set(siteId, Date.now());

  const adaylar = [];
  if (ayar.listeAnahtari) {
    try {
      const liste = await akilliGet(SITEURL_LISTESI, { timeout: 6000 });
      for (const satir of String(liste || '').split('\n')) {
        // DİKKAT: split(':') değil — adresin kendi "https:" colon'u bölünür.
        const i = satir.indexOf(':');
        if (i < 0) continue;
        if (satir.slice(0, i).trim() === ayar.listeAnahtari) {
          const u = satir.slice(i + 1).trim();
          adaylar.push(u.endsWith('/') ? u : `${u}/`);
        }
      }
    } catch (_) { /* listeye ulaşılamadı, aşağıdaki sabitlere düş */ }
  }
  adaylar.push(...ayar.yedek);

  for (const aday of [...new Set(adaylar)]) {
    if (await adresAcikMi(aday)) {
      _base.set(siteId, aday);
      return aday;
    }
    console.warn(`[siteProviders] ${siteId}: adres açılmıyor, atlanıyor → ${aday}`);
  }
  _olu.add(siteId);
  return '';
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
  // Engel sayfası gelirse bağlantı çıkarmaya çalışma (challenge HTML'inde
  // sahte href'ler olur, yanlış içerik bulunur).
  if (/just a moment|attention required|cf-browser-verification|checking your browser/i.test(String(ham).slice(0, 8000))) return [];

  const bulunanlar = [];
  const ekle = (baslik, yol) => {
    const u = mutlak(yol, base);
    if (!u || bulunanlar.some((x) => x.url === u)) return;
    if (!ayar.ara.tur(u)) return;
    bulunanlar.push({ title: baslik || '', url: u });
  };

  // JSON API (SelçukFlix, Film Ekseni)
  if (ham.trim().startsWith('{') || ham.trim().startsWith('[')) {
    try {
      const j = JSON.parse(ham);
      const liste = Array.isArray(j) ? j : (j.result || j.results || j.data || []);
      for (const it of Array.isArray(liste) ? liste : []) {
        if (!it) continue;
        const yol = it.slug || it.url || it.link || it.href;
        if (yol) ekle(it.title || it.name, yol);
      }
    } catch (_) { /* JSON değilse HTML akışına düş */ }
    if (bulunanlar.length) return bulunanlar;
  }

  // Read the label from the link itself, rather than neighbouring navigation.
  for (const m of ham.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const baslik = m[2].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const img = m[2].match(/(?:alt|title)=["']([^"']+)["']/i);
    ekle(baslik || img?.[1] || '', m[1]);
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
  tmdbId = '', imdbId = '', title = '', originalTitle = '', titles = [], mediaType = 'movie', season = 1, episode = 1
} = {}) {
  const ayar = SITES[siteId];
  if (!ayar) return [];
  if (siteId === 'dizify') {
    const { fetchDizifySources } = await import('./dizifyScraper.js');
    return fetchDizifySources({ title, originalTitle, titles, mediaType, tmdbId, season, episode });
  }
  const base = await siteBaseUrl(siteId);
  const dizi = mediaType === 'tv' || mediaType === 'series';

  let imdb = String(imdbId || '').trim();
  if (!imdb && tmdbId) imdb = await imdbIdBul(tmdbId, mediaType);

  // DOGRUDAN KİPİ: bazı siteler arama yapmaz; TMDB kimliğinden adresi
  // doğrudan üretirler (2embed gibi). Önce bu yol denenir.
  if (ayar.dogrudanUrl) {
    const ad = await siteBaseUrl(siteId);
    if (!ad) return [];
    try {
      const dogrudan = ayar.dogrudanUrl(ad, { tmdbId, imdbId, mediaType, season, episode });
      const sayfa = await istek(dogrudan, { referer: ad, timeout: 10000 });
      if (sayfa && !engelMi(sayfa)) {
        return await dogrudanKaynaklari(siteId, dogrudan, sayfa, ad);
      }
    } catch (_) {}
  }

  // Şifreli kimlik gerektiren kaynak (vidlink)
  if (ayar.sifreliKimlik) {
    const ad = await siteBaseUrl(siteId);
    if (!ad) return [];
    try {
      const kimlik = await ayar.sifreliKimlik(tmdbId);
      if (kimlik) {
        const yol = mediaType === 'movie'
          ? `/api/b/movie/${kimlik}`
          : `/api/b/tv/${kimlik}/${parseInt(season, 10) || 1}/${parseInt(episode, 10) || 1}`;
        const dogrudan = `${ad.replace(/\/$/, '')}${yol}`;
        const sayfa = await akilliGet(dogrudan, { ref: ad, timeout: 10000, headers: { Accept: 'application/json', Origin: ad.replace(/\/$/, '') } });
        return vidlinkKaynaklari(sayfa, ad);
      }
    } catch (_) {}
  }

  const hedefler = [...new Set([title, originalTitle, ...titles].filter(Boolean))];
  const terimler = [...new Set([imdb, imdb.replace(/^tt/, ''), ...hedefler].filter(Boolean))];
  let icerikUrl = '';
  for (const t of terimler) {
    const sonuc = await siteAra(siteId, t);
    const uygun = sonuc.find(x => isStrictMediaTitleMatch(x.title, hedefler))
      || sonuc.find(x => imdb && (x.url.includes(imdb) || x.title === imdb));
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
    if (!bolumUrl) return [];
    icerikUrl = bolumUrl;
  }

  const sayfa = await istek(icerikUrl, { referer: base, timeout: 10000 });
  if (!sayfa || engelMi(sayfa)) return [];

  const oynaticilar = oynaticilariCikar(sayfa, base);
  const kaynaklar = [];
  const pageMedia = oynaticiCoz(sayfa);
  if (pageMedia) kaynaklar.push({ name: ayar.ad, url: masterUrlDuzelt(pageMedia.url), referer: icerikUrl, via: `${siteId}:${pageMedia.via}` });
  if (!oynaticilar.length && !pageMedia) {
    const extracted = await extractEmbedStream(icerikUrl, base, new Set(), Date.now() + 16000, sayfa).catch(() => null);
    if (extracted?.url && !extracted.isIframe) kaynaklar.push({ ...extracted, name: ayar.ad });
  }
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
      kaynaklar.push({
        name: kaliteEtiketi(oyHtml) || oynatici.name,
        url: masterUrlDuzelt(c.url), referer: oynatici.url,
        altyazilar: masterAltyazilari(oyHtml),
        via: `${siteId}:${c.via}`
      });
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

/**
 * Aramaya gerek olmayan kaynaklar için: adres zaten biliniyor, sadece
 * sayfadaki yayını çözmek gerekiyor.
 */
async function dogrudanKaynaklari(siteId, adres, sayfa, referer) {
  const c = oynaticiCoz(sayfa);
  if (c) {
    return [{
      name: kaliteEtiketi(sayfa) || SITES[siteId].ad,
      url: masterUrlDuzelt(c.url),
      referer,
      altyazilar: masterAltyazilari(sayfa),
      via: `${siteId}:${c.via}`
    }];
  }
  // Çözülemediyse jenerik motoru dene (7 kalıp + şifreli oynatıcı +
  // base64 iframe + nonce + playlist). Doğrudan yayın bulunursa iframe
  // ASLA dönülmez — iframe yalnızca hiçbir yolla çözülemeyen adresler
  // içindir (o zaman da gizli WebView açılır).
  try {
    const g = await extractEmbedStream(adres, referer, new Set(), Date.now() + 15000, sayfa).catch(() => null);
    if (g && g.url && !g.isIframe) {
      return [{
        name: kaliteEtiketi(sayfa) || SITES[siteId].ad,
        url: masterUrlDuzelt(g.url),
        referer: g.referer || referer,
        altyazilar: masterAltyazilari(sayfa),
        via: `${siteId}:${g.via}`
      }];
    }
    // Jenerik motor iframe döndüyse bile doğrudan denemeyi bırakma:
    // sayfa gömülüsü son çaredir.
    if (g && g.url && g.isIframe) {
      return [{
        name: SITES[siteId].ad, url: g.url, referer: g.referer || referer,
        isIframe: true, via: `${siteId}:${g.via}`
      }];
    }
  } catch (_) {}
  return [{
    name: SITES[siteId].ad,
    url: adres,
    referer,
    isIframe: true,
    via: `${siteId}:gomulu`
  }];
}

/** VidLink returns JSON, never a playable iframe URL. */
export function vidlinkKaynaklari(body, referer = 'https://vidlink.pro/') {
  let data;
  try { data = JSON.parse(body); } catch (_) { return []; }
  const stream = data?.stream;
  if (!stream) return [];
  const result = [];
  const add = (url, quality) => {
    if (typeof url !== 'string' || !/^https?:\/\//i.test(url) || result.some(s => s.url === url)) return;
    result.push({ name: quality ? `VidLink ${quality}` : 'VidLink', url, referer,
      isHls: true, isDirectVideo: true, quality: quality || 'Auto',
      altyazilar: (Array.isArray(data.subtitles) ? data.subtitles : []).map(s => ({
        label: s.label || s.language || 'Altyazı', src: s.file || s.url
      })).filter(s => s.src), via: 'vidlink:json' });
  };
  for (const [quality, item] of Object.entries(stream.qualities || {})) add(item?.url, quality);
  add(stream.playlist);
  return result;
}
