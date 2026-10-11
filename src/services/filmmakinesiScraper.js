import { akilliGet, cihazGet, nativeHttpAktifMi } from './nativeHttp.js';
import { extractEmbedStream } from './embedExtractors.js';
import { oynaticiCoz, masterUrlDuzelt } from './playerDecoders.js';

/* ==========================================================================
   CinePulse — Film Makinesi kaziyicisi

   Bu kazıyıcının çözüm mantığı, çalışan Nuvio eklentisinin
   (patr0nq/nuvioaddons → providers/patronFilmMakinesi.js) akışına
   BİREBİR uyar. Farkımız: istekler `akilliGet` üzerinden gider, yani
   Android'de cihazın KENDİ IP'sinden gider (Cloudflare datacenter
   IP'lerini engelliyor) ve Referer serbestçe yazılabilir.

   AKIM
     1) siteurl.txt  → güncel alan adı (sahibi değiştirirse otomatik uyar)
     2) TMDB         → IMDb ID (başlıkla arama tutmaz, IMDb ile aranır)
     3) /arama/?s=<imdb>  → /film/… veya /dizi/… sayfası
     4) dizi ise /sezon-N/bolum-M/
     5) sayfadaki iframe / data-video_url → oynatıcı
     6) oynatıcı sayfası → decodeStreamUrl() (aşağıdaki çözücüler)

   ENGEL (ölçüldü 2026-10-12): bu ağdan sunucuya GİDEN HER istek 403
   "Just a moment" dönüyor — Cloudflare JS challenge. Yani bu kaynak
   yalnızca cihazdaki konut IP'sinden çalışır; Vercel/datacenter'dan
   doğrulanamaz. Sunucu tarafında gizli WebView'e düşülür.
   ========================================================================== */

const TMDB_API_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const SITEURL_LISTESI = 'https://raw.githubusercontent.com/patr0nq/veriler/refs/heads/main/siteurl.txt';
const BILINEN_ALAN_ADLARI = ['https://filmmakinesi.to/'];
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

/* ── 1. ALAN ADI: her seferinde güncel listeye bak ───────────────────── */

let _baseUrl = null;
let _baseDenendi = 0;

async function baseUrlCoz() {
  if (_baseUrl) return _baseUrl;
  // Aynı oturumda tekrar denemeyelim; CF her seferinde 403 döner.
  if (_baseDenendi > 0 && _baseDenendi < Date.now() + 10 * 60 * 1000) {
    return _baseUrl || BILINEN_ALAN_ADLARI[0];
  }
  _baseDenendi = Date.now();
  try {
    const liste = await akilliGet(SITEURL_LISTESI, { timeout: 6000 });
    for (const satir of String(liste || '').split('\n')) {
      // DİKKAT: `split(':')` kullanma — adresin kendi "https:" colon'u da
      // bölünür ve alan adı boş kalır. Sadece İLK colon ayırıcıdır.
      const bosluk = satir.indexOf(':');
      if (bosluk < 0) continue;
      const ad = satir.slice(0, bosluk).trim();
      const url = satir.slice(bosluk + 1).trim();
      if (ad === 'filmmakinesi' && url) {
        const temiz = url.trim().endsWith('/') ? url.trim() : `${url.trim()}/`;
        _baseUrl = temiz;
        return _baseUrl;
      }
    }
  } catch (_) { /* liste yoksa aşağıdaki sabit adresler */ }
  _baseUrl = BILINEN_ALAN_ADLARI[0];
  return _baseUrl;
}

/* ── 2. TMDB → IMDb ID ──────────────────────────────────────────────── */

async function tmdbBilgi(tmdbId, mediaType) {
  const tur = mediaType === 'movie' ? 'movie' : 'tv';
  try {
    const metin = await akilliGet(
      `https://api.themoviedb.org/3/${tur}/${tmdbId}?api_key=${TMDB_API_KEY}&language=tr-TR&append_to_response=external_ids`,
      { timeout: 8000 }
    );
    const d = JSON.parse(metin);
    return {
      imdbId: (d.imdb_id || d.external_ids?.imdb_id || '').trim(),
      baslik: (d.title || d.name || d.original_title || '').trim()
    };
  } catch (_) {
    return { imdbId: '', baslik: '' };
  }
}

/* ── ÇÖZÜCÜLER ───────────────────────────────────────────────────────── */

/* ÇÖZÜCÜLER paylaşılan modülden gelir (playerDecoders.js): paketli JS,
   şifreli diziler, openPlayer(), file:av(), charCode ve master.txt
   düzeltmesi. Böylece bu kalıplar tek yerde durur ve diğer kaynaklar da
   aynı düzeltmelerden faydalanır. */

/** Bu oynatıcı sayfasından yayın adresini çıkarır. */
function yayinCoz(html) {
  const c = oynaticiCoz(html);
  return c ? c.url : '';
}

/** `…/xyz.mpd/txt/master.txt` → `…/xyz.mpd/master.m3u8`
 *  Bu dönüşüm olmadan DiziSol'un "filmmakinesi" yayınları 404 veriyordu
 *  (ölçüldü: master.txt → 404, dönüştürülmüşü → geçerli playlist). */
export { masterUrlDuzelt };

/* ── SAYFA ÇEKİMİ ───────────────────────────────────────────────────── */

/** Cihazdaysa cihazın IP'sinden; yoksa mevcut zincirden. */
async function sayfaAl(url, referer = '', timeout = 9000) {
  if (nativeHttpAktifMi()) {
    const r = await cihazGet(url, { ref: referer || undefined, headers: { Accept: 'text/html,*/*' }, timeout });
    if (r.ok && r.text && r.text.length > 1500 && !/just a moment|attention required/i.test(r.text.slice(0, 4000))) {
      return r.text;
    }
  }
  return (await akilliGet(url, { ref: referer, timeout })) || '';
}

function mutlak(url, taban) {
  try {
    return new URL(String(url || '').trim(), taban).toString();
  } catch (_) {
    return '';
  }
}

/* ── DIŞA AÇILANLAR ──────────────────────────────────────────────────── */

/**
 * Arama: başlık ya da IMDb ID ile içerik sayfasını bulur.
 * @returns {Promise<Array<{title:string,url:string,isSeries:boolean,imdbId:string}>>}
 */
export async function searchFilmMakinesi(query, isSeries = false) {
  const base = await baseUrlCoz();
  const tm = String(query || '').trim();
  if (!tm) return [];
  const html = await sayfaAl(`${base}arama/?s=${encodeURIComponent(tm)}`, `${base}`, 9000);
  if (!html) return [];

  const sonuc = [];
  const gorulen = new Set();
  for (const m of html.matchAll(/href=["']((?:https?:\/\/[^"']*)?\/(?:film|dizi)\/[^"'#?]+)["']/gi)) {
    const url = mutlak(m[1], base);
    if (!url || gorulen.has(url)) continue;
    if (['/filmler-', '/yabanci-dizi-', '/tur/', '/ulke/'].some((s) => url.includes(s))) continue;
    gorulen.add(url);
    const baslik = (html.slice(Math.max(0, m.index - 260), m.index).match(/>([^<>]{3,90})</g) || [])
      .pop()?.replace(/[<>]/g, '').trim() || tm;
    sonuc.push({ title: baslik, url, isSeries: url.includes('/dizi/') });
  }
  return sonuc;
}

/**
 * Yayın kaynaklarını çözer.
 * @param {object} secenekler
 * @param {string} secenekler.title        başlık
 * @param {string} secenekler.imdbId       IMDb ID (varsa başlıktan üstündür)
 * @param {string} secenekler.tmdbId       TMDB ID (imdbId yoksa buradan bulunur)
 * @param {'movie'|'tv'} secenekler.mediaType
 */
export async function fetchFilmMakinesiSources({
  title = '', titles = [], imdbId = '', tmdbId = '', mediaType = 'movie', season = 1, episode = 1
} = {}) {
  const base = await baseUrlCoz();
  const dizi = mediaType === 'tv' || mediaType === 'series';

  // 1) Arama terimi: IMDb ID > başlık
  let imdb = String(imdbId || '').trim();
  if (!imdb && tmdbId) imdb = (await tmdbBilgi(tmdbId, mediaType)).imdbId;

  const adaylar = [];
  if (imdb) adaylar.push(imdb);
  if (title) adaylar.push(title);
  for (const t of titles) if (t) adaylar.push(t);

  let icerikUrl = '';
  let arananTerim = '';
  for (const terim of [...new Set(adaylar)]) {
    const bulunan = await searchFilmMakinesi(terim, dizi);
    const uygun = bulunan.find((x) => (dizi ? x.isSeries : !x.isSeries)) || bulunan[0];
    if (uygun) { icerikUrl = uygun.url; arananTerim = terim; break; }
  }
  if (!icerikUrl) return [];

  // 2) Dizi: sezon/bölüm sayfası
  if (dizi) {
    const s = parseInt(String(season), 10) || 1;
    const e = parseInt(String(episode), 10) || 1;
    const diziHtml = await sayfaAl(icerikUrl, `${base}`, 9000);
    let bolumUrl = '';
    for (const m of diziHtml.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
      const sm = m[1].match(/sezon-(\d+)\/bolum-(\d+)/i);
      if (sm && parseInt(sm[1], 10) === s && parseInt(sm[2], 10) === e) { bolumUrl = mutlak(m[1], base); break; }
    }
    if (!bolumUrl) {
      const duz = icerikUrl.replace(/\/$/, '');
      bolumUrl = `${duz}/sezon-${s}/bolum-${e}/`;
      // Gerçek adres farklıysa (tarih ekli) sayfa yeniden yönlendirir.
    }
    icerikUrl = bolumUrl;
  }

  // 3) İçerik sayfasından oynatıcıları topla
  const sayfaHtml = await sayfaAl(icerikUrl, `${base}`, 10000);
  if (!sayfaHtml) return [];

  const oynaticilar = [];
  const gorulen = new Set();
  const ekle = (u, etiket) => {
    const adres = mutlak(u, base);
    if (!adres || gorulen.has(adres)) return;
    if (/youtube\.com|youtu\.be/i.test(adres)) return;
    gorulen.add(adres);
    oynaticilar.push({ url: adres, name: etiket || 'Oynatıcı' });
  };
  for (const m of sayfaHtml.matchAll(/<iframe\b[^>]*?(?:data-src|src)=["']([^"']+)["']/gi)) ekle(m[1], 'Varsayılan');
  for (const m of sayfaHtml.matchAll(/<a\b[^>]*data-video_url=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    ekle(m[1], m[2].replace(/<[^>]*>/g, '').trim() || 'Oynatıcı');
  }
  // Son çare: şifreli oynatıcı sayfasının kendisi (sayfa oynatıcıysa)
  if (!oynaticilar.length && /\/player\//.test(icerikUrl)) ekle(icerikUrl, 'Oynatıcı');
  if (!oynaticilar.length) return [];

  const kaynaklar = [];
  for (const oynatici of oynaticilar) {
    const oynaticiHtml = await sayfaAl(oynatici.url, icerikUrl, 9000);
    if (!oynaticiHtml) continue;

    // a) Kendi çözücülerimiz
    const bulunan = yayinCoz(oynaticiHtml);
    if (bulunan) {
      kaynaklar.push({
        name: `${oynatici.name}`,
        url: masterUrlDuzelt(bulunan),
        referer: oynatici.url,
        via: 'filmmakinesi'
      });
      continue;
    }

    // b) Jenerik motor (şifreli oynatıcı, base64 iframe, 7 kalıp…)
    const c = await extractEmbedStream(oynatici.url, icerikUrl).catch(() => null);
    if (c) {
      kaynaklar.push({
        name: `${oynatici.name}`,
        url: masterUrlDuzelt(c.url),
        referer: c.referer || oynatici.url,
        isIframe: Boolean(c.isIframe),
        via: `filmmakinesi:${c.via}`
      });
    }
  }

  if (!kaynaklar.length) return [];
  kaynaklar.unshift({
    name: `${kaynaklar[0].name} (canlı sayfa)`,
    url: icerikUrl,
    referer: `${base}`,
    isSayfa: true,
    via: 'filmmakinesi:embed'
  });
  return kaynaklar;
}