/* ==========================================================================
   GELİŞMİŞ GÖMÜLÜ ÇÖZÜMLEYİCİ (v3)

   Kaynaklar ve katkıları:
     • KekikStream (keyiflerolsun) — SitePlugin/Extractor ayrımı, kalıp
       sınıfları (SecuredLink, PackedJS, BePlayer, Nonce, PlaylistAPI),
       oynatılabilirlik ölçümü, extract_recursive döngü koruması.
     • Nuvio eklenti depoları (nuvio.tr) — 113 scraper'dan çıkarılan
       yaygın teknikler: base64 gizleme, AES, nonce, POST API, data-src
       lazy load, HTML entity, X-Requested-With, packed JS.
     • CloudStream extractor geleneği — gömülü sunucu başına tek çözümleyici,
       URL deseniyle eşleştirme.
     • Buradaki ekler: reklam tuzağı filtresi, küme (visited) tabanlı sonsuz
       döngü koruması, oynatılabilirlik ölçümü kapalı kalmıyor (Kekik'te
       devre dışı bırakılmıştı), yalnızca gerçek medya kabulü.

   TASARIM: Önce ucuz ve kesin olanlar (bilinen host kalıbı → doğrudan medya),
   sonra pahalı olanlar (API çağrıları, iframe zinciri). Böylece basit
   sayfalarda tek istekte biter.
   ========================================================================== */

/* ══════════════════════════ 1. ÇEKİRDEK ══════════════════════════ */

import { akilliGet, akilliPost, nativeHttpAktifMi } from './nativeHttp.js';
import { sifreliOynaticiCoz } from './encryptedPlayer.js';

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const MEDIA_EXT = /\.(m3u8|mp4|ts|mkv|m4s|webm|mpd|m4v|mov)(\?|#|$)/i;

// Oynatıcı sayfaları reklam/bet adresleri de içerir; genelde ilk eşleşme
// onlardır ve gerçek yayını gizler.
const REKLAM_RE = /kralbet|bet[0-9]*\.|bahis|casino|poker|slot[-a-z]*\.|popunder|onclick|tracking|\/ads?\//i;

export function isDirectStream(url) {
  if (!url || !/^https?:\/\//i.test(url)) return false;
  return MEDIA_EXT.test(url);
}

function hostOf(url) {
  try { return (new URL(url).hostname || '').toLowerCase().replace(/\.$/, ''); } catch (_) { return ''; }
}

function mutlak(base, link) {
  if (!link) return '';
  try { return new URL(link, base).toString(); } catch (_) { return link; }
}

/**
 * HTML entity çözme. Sayfadaki yayın adresleri &amp; / &#38; ile kaçırılmış
 * olabiliyor; çözülmeden kullanılırsa sunucuya bozuk adres gider.
 */
function entityCoz(s) {
  if (!s || s.indexOf('&') === -1) return s;
  return s
    .replace(/&amp;/gi, '&').replace(/&#38;/g, '&').replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .replace(/&#x2F;/gi, '/').replace(/&#47;/g, '/').replace(/&sol;/gi, '/')
    .replace(/&nbsp;/gi, ' ')
    // sayısal entity'ler
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function temizle(link) {
  if (!link) return '';
  let v = entityCoz(String(link)).trim();
  // Kaçışlı eğik çizgiler (\/) yayın adreslerinde sık
  v = v.replace(/\\\//g, '/');
  if (v.startsWith('//')) v = 'https:' + v;
  return v;
}

function proxyUrl(url, ref) {
  try {
    const r = `${new URL(url).origin}/`;
    return `/api/proxy?url=${encodeURIComponent(url)}&ref=${encodeURIComponent(ref || r)}`;
  } catch (_) {
    return url;
  }
}

function isBlockedPage(body) {
  if (!body || body.length < 400) return true;
  const low = body.slice(0, 4000).toLowerCase();
  return low.includes('attention required') || low.includes('just a moment')
      || low.includes('cf-browser-verification') || low.includes('enable javascript and cookies');
}

/* ══════════════════════════ 2. İSTEK KATMANI ══════════════════════════ */

/*
 * KATMANLI GET — tek nokta hatası olmasın diye.
 *
 * CF Worker tek başına çalışsa, worker düşerse (limit, uyku, silinme)
 * TÜM Cloudflare-engelli kaynaklar bir anda ölür. O yüzden üç katman
 * sırayla denenir ve hangisinin çalıştığı öğrenilir:
 *
 *   0) doğrudan fetch  — engel yoksa en ucuzu
 *   1) CF Worker       — datacenter IP engelini aşar
 *   2) uygulama proxy  — Referer sunucu tarafında basılır
 *
 * Kademeli atlama (failover) sayesinde bir katman ölürse diğerleri devralır.
 */
const KATMAN_SAGLIK = { dogrudan: 0, worker: 0, proxy: 0, arkaArdaHata: { dogrudan: 0, worker: 0, proxy: 0 } };

function katmanNoterEt(katman, basarili) {
  if (basarili) {
    KATMAN_SAGLIK[katman]++;
    KATMAN_SAGLIK.arkaArdaHata[katman] = 0;
  } else {
    KATMAN_SAGLIK.arkaArdaHata[katman] = (KATMAN_SAGLIK.arkaArdaHata[katman] || 0) + 1;
  }
}

/** Art arda başarısız olan katmanlar listeden düşer (soğuma süresi). */
function katmanSirasi() {
  const siralar = [
    ['worker', () => workerGet],
    ['proxy', () => proxyGet],
    ['dogrudan', () => directGet]
  ];
  return siralar.filter(([ad]) => (KATMAN_SAGLIK.arkaArdaHata[ad] || 0) < 3)
    .concat(siralar.filter(([ad]) => (KATMAN_SAGLIK.arkaArdaHata[ad] || 0) >= 3));
}

async function directGet(url, ref, timeout) {
  try {
    const r = await fetch(url, {
      signal: AbortSignal.timeout(timeout),
      headers: { 'User-Agent': UA, 'Accept-Language': 'tr-TR,tr;q=0.9', ...(ref ? { Referer: ref } : {}) }
    });
    if (!r.ok) return '';
    const t = await r.text();
    return isBlockedPage(t) ? '' : t;
  } catch (_) { return ''; }
}

/** CF Worker: datacenter IP engelini aşar. */
async function workerGet(url, timeout) {
  try {
    const r = await fetch(`${CF_WORKER_PROXY}?url=${encodeURIComponent(url)}`, {
      signal: AbortSignal.timeout(timeout)
    }).catch(() => null);
    if (r && r.ok) {
      const t = await r.text();
      if (!isBlockedPage(t)) return t;
    }
  } catch (_) {}
  return '';
}

/** Uygulama proxy'si: Referer sunucu tarafında basılır. */
async function proxyGet(url, ref, timeout) {
  try {
    const r = await fetch(proxyUrl(url, ref), { signal: AbortSignal.timeout(timeout) });
    if (!r.ok) return '';
    const t = await r.text();
    return isBlockedPage(t) ? '' : t;
  } catch (_) {
    return '';
  }
}

async function getHtml(url, { ref = '', timeout = 16000 } = {}) {
  // ── Cihaz (Android): kullanıcının KENDİ IP'sinden ────────────────
  // Bu yol olmasa bütün istekler Vercel'e gider ve Vercel datacenter
  // olduğu için Türkçe kaynaklar 403/429/520 döner. CloudStream, Nuvio ve
  // KekikStream da tam olarak bu yöntemle çalışıyor.
  if (nativeHttpAktifMi()) {
    const dogrudan = await akilliGet(url, { ref, timeout });
    if (dogrudan) return dogrudan;
  }
  // ── Web / masaüstü: mevcut üç katmanlı zincir ─────────────────────
  for (const [ad, fabrika] of katmanSirasi()) {
    const sonuc = ad === 'proxy' ? await proxyGet(url, ref, timeout)
               : ad === 'worker' ? await workerGet(url, timeout)
               : await directGet(url, ref, timeout);
    katmanNoterEt(ad, Boolean(sonuc));
    if (sonuc) return sonuc;
  }
  return '';
}

async function postApi(url, body, ref, timeout = 16000) {
  // Cihazda: doğrudan cihaz IP'sinden, Referer serbestçe yazılabiliyor.
  if (nativeHttpAktifMi()) {
    const d = await akilliPost(url, body, { ref, timeout });
    if (d) return d;
  }
  try {
    const r = await fetch(proxyUrl(url, ref), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        // Bu başlık olmadan sunucu JSON yerine HTML döner.
        'X-Requested-With': 'XMLHttpRequest'
      },
      body,
      signal: AbortSignal.timeout(timeout)
    });
    if (!r.ok) return '';
    return await r.text();
  } catch (_) {
    return '';
  }
}

/* ══════════════════════════ 3. TARAMA ══════════════════════════ */

const RE = {
  sources: /["']?sources["']?\s*:\s*\[\s*\{\s*["']?(?:file|src|url)["']?\s*[:=]\s*["']([^"']+)["']/i,
  m3u8: /["']([^"']+\.m3u8[^"']*)["']/i,
  videoTag: /<video[^>]*\ssrc=["']([^"']+)["']/i,
  iframe: /<iframe[^>]*\ssrc=["']([^"']+)["']/gi,
  lazy: /(?:data-src|data-original|data-lazy-src|data-video|data-file)\s*=\s*["']([^"']+)["']/gi,
  dlApi: /fetch\(\s*["'`](\/dl\?[^"'`]+)["'`]/,
  base64Blob: /["']([A-Za-z0-9+/]{60,}={0,2})["']/g
};

/**
 * Sırayla desenleri dener. Önce gerçek medya adayı, sonra reklam olmayan
 * herhangi biri. Reklam adresi sonuç listesine giremez.
 */
function tara(html, ...desenler) {
  const adaylar = [];
  for (const d of desenler) {
    // RegExp nesnesinde desenin metni `.re` DEĞİL `.source`'dır. `.re`
    // diye okumak undefined verir ve `new RegExp(undefined, …)` boş kaynaklı
    // /(?:)/ üretir — yani bu tarama HİÇ ÇALIŞMIYORDU ve sayfadaki doğrudan
    // medya sessizce kaçıyordu (ölçüldü: kaynak boş dize dönüyordu).
    const re = d instanceof RegExp ? d : new RegExp(d.source ?? d.re ?? String(d), d.flags || '');
    const m = html.match(re);
    if (m && m[1] && m[1].length > 8) adaylar.push(temizle(m[1]));
  }
  return adaylar.find((a) => MEDIA_EXT.test(a) && !REKLAM_RE.test(a))
      || adaylar.find((a) => !REKLAM_RE.test(a))
      || '';
}

/* ══════════════════════════ 4. KALIPLAR ══════════════════════════ */

/** 4a. SecuredLink — HDPlayerSystem / player.filmizle.in ailesi */
async function kalipSecuredLink(url, ref) {
  const m = url.match(/\/(?:video|hdplayer|player|embed)\/([A-Za-z0-9_-]{8,90})/) || url.match(/[?&]data=([^&]+)/);
  if (!m) return null;
  const id = m[1];
  const base = new URL(url).origin;
  const referer = ref || `${base}/`;
  const api = `${base}/player/index.php?data=${encodeURIComponent(id)}&do=getVideo`;
  const body = `hash=${encodeURIComponent(id)}&r=${encodeURIComponent(referer)}`;
  const text = await postApi(api, body, referer);
  if (!text) return null;

  let link = '';
  if (text.trim().startsWith('{')) {
    try {
      const d = JSON.parse(text);
      link = d.securedLink || (d.hls ? d.videoSource : '') || d.videoSource || '';
    } catch (_) {}
  }
  if (!link) {
    link = tara(text,
      /["']?securedLink["']\s*:\s*["']([^"']+)["']/i,
      /["']?videoSource["']\s*:\s*["']([^"']+)["']/i);
  }
  return link && MEDIA_EXT.test(link) ? { url: temizle(link), referer } : null;
}

/** 4b. videoUrl + videoServer — SetPlay / ExPlay / FastPlay ailesi */
async function kalipVideoPlayer(url, ref) {
  const html = await getHtml(url, { ref, timeout: 16000 });
  if (!html) return null;
  const srvHam = (html.match(/videoServer["']?\s*[:=]\s*["']([^"']+)["']/i) || [])[1];
  const yolHam = (html.match(/videoUrl["']?\s*[:=]\s*["']([^"']+)["']/i) || [])[1];
  if (!srvHam || !yolHam) return null;
  const srv = temizle(srvHam).startsWith('http') ? temizle(srvHam) : mutlak(url, temizle(srvHam));
  const y0 = temizle(yolHam);
  const yol = y0.startsWith('http') ? y0 : `${srv.replace(/\/$/, '')}${y0.startsWith('/') ? y0 : `/${y0}`}`;
  const partKey = (() => { try { return new URL(url).searchParams.get('partKey') || ''; } catch (_) { return ''; } })();
  const etiket = /turkcedublaj/i.test(partKey) ? 'Türkçe Dublaj'
              : /turkcealtyazi/i.test(partKey) ? 'Türkçe Altyazı' : '';
  return { url: `${yol}${yol.includes('?') ? '&' : '?'}s=${encodeURIComponent(srv)}`, referer: ref || url, etiket };
}


/**
 * Verilen adres bir JSON API ucuysa doğrudan çağırıp yayını alır.
 * (…/dl?op=get_stream&…, …/player/index.php?data=…&do=getVideo)
 */
async function apiUrlCoz(url, ref) {
  let metin = '';
  if (/[?&]op=get_stream/i.test(url)) {
    metin = await postApi(url, '', ref, 14000);
  } else if (/[?&]do=getVideo/i.test(url)) {
    const id = (url.match(/[?&]data=([^&]+)/) || [])[1] || '';
    const base = new URL(url).origin;
    metin = await postApi(url, `hash=${encodeURIComponent(id)}&r=${encodeURIComponent(ref || `${base}/`)}`,
                          ref || `${base}/`, 14000);
  }
  if (!metin) return null;
  try {
    const d = JSON.parse(metin);
    const link = d.url || d.securedLink || d.videoSource || (d.hls ? d.videoSource : '');
    if (link && MEDIA_EXT.test(link)) {
      return { url: temizle(link), referer: ref || url, via: 'api-direct' };
    }
  } catch (_) {}
  return null;
}

/** 4c. /dl?op=get_stream — liderfilm / PlayerJS ailesi */
async function kalipDlApi(url, html) {
  const dl = html.match(RE.dlApi);
  if (!dl) return null;
  const base = new URL(url).origin;
  try {
    const r = await fetch(proxyUrl(`${base}${dl[1]}`, url), {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      signal: AbortSignal.timeout(14000)
    });
    const t = await r.text();
    if (t.trim().startsWith('{')) {
      const u = JSON.parse(t).url;
      if (u) return { url: temizle(u), referer: `${base}/` };
    }
  } catch (_) {}
  return null;
}

/** 4d. PackedJS — eval(function(p,a,c,k,e,d)) paketli oynatıcı.
 *  Tarayıcıda olduğumuz için paketi elle açmıyoruz: kodu çalıştırıp
 *  oynatıcı global'larına yapılan çağrıları yakalıyoruz. */
async function kalipPackedJs(html, baseUrl, ref) {
  const paketRe = /eval\s*\(\s*function\s*\(p,a,c,k,e,d\)[\s\S]{200,}?\.split\(['"]\\?\|['"]\)/;
  const m = html.match(paketRe);
  let bulunan = '';

  if (m) {
    const oynatici = new Proxy({}, {
      get(_, prop) {
        if (prop === Symbol.toPrimitive) return () => '';
        return (...args) => {
          for (const a of args) {
            if (typeof a === 'string' && MEDIA_EXT.test(a) && !REKLAM_RE.test(a)) bulunan = temizle(a);
          }
          return oynatici;
        };
      },
      set(_, prop, value) {
        if (typeof value === 'string' && MEDIA_EXT.test(value) && !REKLAM_RE.test(value)) bulunan = temizle(value);
        return true;
      }
    });
    try {
      // eslint-disable-next-line no-new-func
      const calistir = new Function(
        'window', 'document', 'self', 'globalThis', 'location', 'navigator', 'console',
        'player', 'jwplayer', 'videojs', 'hls', 'Hls', 'Playerjs', 'Player', 'Clappr', 'Plyr',
        m[0]
      );
      const sahte = { location: { href: baseUrl, search: '' }, document: { createElement: () => ({ style: {}, addEventListener() {} }) } };
      sahte.window = sahte; sahte.self = sahte; sahte.globalThis = sahte;
      calistir(sahte, sahte.document, sahte, sahte, sahte.location, { userAgent: UA },
        { log() {}, warn() {}, error() {} },
        oynatici, oynatici, oynatici, oynatici, oynatici, oynatici, oynatici, oynatici, oynatici);
    } catch (_) { /* paket çalışmadı, düz taramaya düşülür */ }
  }

  if (!bulunan) bulunan = tara(html, RE.sources, RE.m3u8, /["']?file["']?\s*[:=]\s*["']([^"']+)["']/i);
  if (!bulunan) return null;
  const abs = mutlak(baseUrl, bulunan);
  return MEDIA_EXT.test(abs) && !REKLAM_RE.test(abs) ? { url: abs, referer: ref || baseUrl } : null;
}

/** 4e. bePlayer — AES şifreli yapılandırma */
async function kalipBePlayer(url, ref) {
  const html = await getHtml(url, { ref, timeout: 16000 });
  if (!html) return null;
  const m = html.match(/bePlayer\(\s*['"]([^'"]+)['"]\s*,\s*['"](\{[\s\S]{0,4000}?\})['"]\s*\)/);
  if (!m) return null;

  let cozuk = '';
  try {
    const ham = JSON.parse(m[2].replace(/\\\//g, '/'));
    const k = ham.k || ham.key, iv = ham.iv, veri = ham.cipher || ham.data || ham.s;
    if (k && iv && veri) {
      const anahtar = await crypto.subtle.importKey(
        'raw', Uint8Array.from(atob(k), (c) => c.charCodeAt(0)), { name: 'AES-CBC' }, false, ['decrypt']);
      const duz = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: Uint8Array.from(atob(iv), (c) => c.charCodeAt(0)) },
        anahtar, Uint8Array.from(atob(veri), (c) => c.charCodeAt(0)));
      cozuk = new TextDecoder().decode(duz);
    }
  } catch (_) {}

  const hamUrl = cozuk
    ? (cozuk.match(/"video_location"\s*:\s*"([^"]+)"/i) || cozuk.match(/"file"\s*:\s*"([^"]+)"/i) || [])[1]
    : (html.match(/"video_location"\s*:\s*"([^"]+)"/i) || [])[1];
  if (!hamUrl) return null;
  const abs = mutlak(url, temizle(hamUrl));
  return MEDIA_EXT.test(abs) ? { url: abs, referer: ref || url, subtitles: altyazilariCikar(html, url) } : null;
}

/** 4f. Nonce + şifreli kaynak — MegaCloud / Videostr ailesi */
function nonceBul(html) {
  const dogrudan =
    html.match(/<meta[^>]+name=["']_gg_fb["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
    html.match(/<meta[^>]+name=["']nonce["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
    html.match(/window\.nonce\s*=\s*["']([^"']+)["']/i)?.[1] ||
    html.match(/(?:const|var|let)\s+nonce\s*=\s*["']([^"']+)["']/i)?.[1] ||
    html.match(/["']nonce["']\s*:\s*["']([^"']+)["']/i)?.[1] ||
    html.match(/_lk_db\s*=\s*\{\s*x:\s*["']([A-Za-z0-9]{16})["']\s*,\s*y:\s*["']([A-Za-z0-9]{16})["']\s*,\s*z:\s*["']([A-Za-z0-9]{16})["']/);
  if (Array.isArray(dogrudan)) return dogrudan[1] + dogrudan[2] + dogrudan[3];
  if (dogrudan) return dogrudan;
  return html.match(/\b[a-zA-Z0-9]{48}\b/)?.[0] || '';
}

async function kalipNonce(url, ref) {
  const html = await getHtml(url, { ref, timeout: 16000 });
  if (!html) return null;
  const nonce = nonceBul(html);
  if (!nonce) return null;
  const vid = url.split('?')[0].split('/').pop();
  const base = new URL(url).origin;
  const yol = (url.match(/(embed-\d+\/v\d+\/e-\d+)/) || [])[1] || 'embed-1/v3/e-1';
  let data = null;
  try {
    const r = await fetch(proxyUrl(`${base}/${yol}/getSources?id=${vid}&_k=${nonce}`, ref), {
      signal: AbortSignal.timeout(14000)
    });
    if (r.ok) data = await r.json();
  } catch (_) {}
  const file = data?.sources?.[0]?.file;
  return file && /\.m3u8/i.test(file) ? { url: temizle(file), referer: `${base}/` } : null;
}

/** 4g. Playlist API — file → playlist (.txt içinde HLS) */
async function kalipPlaylist(url, ref) {
  const html = await getHtml(url, { ref, timeout: 16000 });
  if (!html) return null;
  const yol = (html.match(/["']?file["']?\s*:\s*["']([^"']+)["']/i) || [])[1];
  if (!yol) return null;
  const base = new URL(url).origin;
  const t = await postApi(`${base}/${temizle(yol).replace(/^\/+/, '')}`, '', ref);
  if (!t) return null;
  const satir = t.trim().split('\n').find((s) => MEDIA_EXT.test(s) && !REKLAM_RE.test(s));
  return satir ? { url: temizle(satir), referer: `${base}/` } : null;
}

/* ══════════════════════════ 5. ALTYAZI ══════════════════════════ */

function altyazilariCikar(html, base) {
  const cikan = [];
  const ekle = (etiket, adres) => {
    if (!adres || adres.length < 8) return;
    if (/forced/i.test(etiket)) return;
    const url = mutlak(base, temizle(adres));
    if (cikan.some((c) => c.src === url)) return;
    cikan.push({ label: (etiket || 'Altyazı').trim(), src: url });
  };
  // "[TR]https://….vtt,[EN]https://….vtt" biçimi (PlayerJS)
  for (const m of html.matchAll(/\[([^\]]{1,20})\]\s*(https?:\/\/[^\s"',)\]]+)/g)) ekle(m[1], m[2]);
  // JSON track dizisi
  for (const m of html.matchAll(/"kind"\s*:\s*"(?:captions|subtitles)"[\s\S]{0,140}?"file"\s*:\s*"([^"]+)"[\s\S]{0,140}?"label"\s*:\s*"([^"]*)"/gi)) ekle(m[2] || 'Altyazı', m[1]);
  for (const m of html.matchAll(/"label"\s*:\s*"([^"]+)"[\s\S]{0,90}?"file"\s*:\s*"([^"]+\.vtt[^"]*)"/gi)) ekle(m[1], m[2]);
  return cikan;
}

/* ══════════════════════════ 6. JSON-LD / META / BASE64 ══════════════════════════ */

function jsonLdCoz(html) {
  const dugumler = [];
  for (const m of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { dugumler.push(JSON.parse(entityCoz(m[1]))); } catch (_) {}
  }
  const duz = [];
  const gez = (n) => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) { n.forEach(gez); return; }
    duz.push(n);
    for (const v of Object.values(n)) if (typeof v === 'object') gez(v);
  };
  dugumler.forEach(gez);
  for (const n of duz) {
    for (const alan of ['contentUrl', 'embedUrl', 'url']) {
      const v = temizle(n[alan]);
      if (v.length > 10 && !REKLAM_RE.test(v) && (MEDIA_EXT.test(v) || /embed|player|video|watch/i.test(v))) return v;
    }
  }
  return '';
}

function metaCoz(html, base) {
  const adaylar = [];
  for (const m of html.matchAll(/<meta[^>]+(?:property|name)=["'](?:(?:og|og:video|twitter:player):[^"']*|video)["'][^>]*content=["']([^"']+)["']/gi)) adaylar.push(temizle(m[2]));
  for (const m of html.matchAll(/<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["'](?:og:)?video[^"']*["']/gi)) adaylar.push(temizle(m[1]));
  const iyi = adaylar.find((a) => MEDIA_EXT.test(a) && !REKLAM_RE.test(a));
  return iyi ? mutlak(base, iyi) : '';
}

function base64Coz(b64) {
  try {
    let metin = atob(b64);
    if (!MEDIA_EXT.test(metin) && /^[A-Za-z0-9+/=\s]+$/.test(metin) && metin.length > 40) {
      try { const ik = atob(metin.trim()); if (/m3u8|mp4|iframe|source/i.test(ik)) metin = ik; } catch (_) {}
    }
    // 1) Doğrudan m3u8 / mp4
    const m = metin.match(/https?:\\?\/\\?\/[A-Za-z0-9._~:/?#@!$&'()*+,;=%-]+\.(?:m3u8|mp4|mkv)[A-Za-z0-9._~:/?#@!$&'()*+,;=%-]*/i);
    if (m) return temizle(m[0]);
    // 2) Çıplak bir oynatıcı adresi olabilir
    //    (<iframe src="aHR0cHM6Ly9wbGF5ZXIu…"> — sinemacc, liderfilm).
    //    Önceki sürüm yalnızca JSON alanlarını ve m3u8'i arıyordu, bu yüzden
    //    çözülen adres atılıyordu.
    const cift = metin.match(/https?:\\?\/\\?\/[A-Za-z0-9._~:/?#@!$&'()*+,;=%-]{8,200}/i);
    if (cift) {
      const dogrudan = temizle(cift[0]);
      if (/^https?:\/\//i.test(dogrudan) && !REKLAM_RE.test(dogrudan)) return dogrudan;
    }
    for (const alan of ['url', 'file', 'src', 'videoSource', 'securedLink', 'link']) {
      const f = metin.match(new RegExp(`["']?${alan}["']?\\s*[:=]\\s*["']([^"']+)["']`, 'i'));
      if (f && MEDIA_EXT.test(f[1])) return temizle(f[1]);
    }
  } catch (_) {}
  return '';
}

function base64GizliCoz(html) {
  const adaylar = [];
  for (const m of html.matchAll(/\w+\s*=\s*["']([A-Za-z0-9+/]{40,}={0,2})["']/g)) { const c = base64Coz(m[1]); if (c) adaylar.push(c); }
  for (const m of html.matchAll(RE.base64Blob)) { const c = base64Coz(m[1]); if (c) adaylar.push(c); }
  return adaylar.find((u) => MEDIA_EXT.test(u) && !REKLAM_RE.test(u)) || '';
}

function lazyCoz(html, base) {
  for (const m of html.matchAll(RE.lazy)) {
    const v = mutlak(base, temizle(m[1]));
    if (MEDIA_EXT.test(v) && !REKLAM_RE.test(v)) return v;
  }
  return '';
}

/* ══════════════════════════ 7. ANA ÇÖZÜMLEYİCİ ══════════════════════════ */

/**
 * Bir adresten yayın çözer.
 *
 * @param {string} url          gömülü/oynatıcı adresi
 * @param {string} referer      sitenin adresi (gerekli: birçok oynatıcı bunu doğrular)
 * @param {Set}    gordum       daha önce denenen adresler (döngü koruması)
 */
export async function extractEmbedStream(url, referer = '', gordum = new Set(), bitis = 0) {
  if (!url || !/^https?:\/\//i.test(url)) return null;
  if (gordum.has(url) || gordum.size > 8) return null;
  // Sert süre sınırı: çağıran (otonom çözümleyici / oynatıcı) bekletilmez.
  const kalan = bitis ? Math.max(0, bitis - Date.now()) : 0;
  if (bitis && kalan < 900) return null;
  gordum.add(url);

  if (isDirectStream(url)) {
    return { url, referer: referer || url, via: 'direct', subtitles: [] };
  }

  const ref = referer || (() => { try { return `${new URL(url).origin}/`; } catch (_) { return ''; } })();

  // Bize doğrudan bir API ucu verilmiş olabilir (ör. ".../dl?op=get_stream&view_id=…").
  // Bu durumda sayfaya gitmeye gerek yok, ucu bir kez çağırmak yeterli.
  if (/[?&]op=get_stream|[?&]do=getVideo/i.test(url)) {
    const dogrudanApi = await apiUrlCoz(url, ref);
    if (dogrudanApi) return dogrudanApi;
  }

  // ── Ucuz ve kesin olanlar önce
  const hamHtml = await getHtml(url, { ref, timeout: 16000 });
  if (!hamHtml) return null;

  // ŞİFRELİ OYNATICI: Gerçek oynatıcı HTML'i sayfada düz metin olarak
  // bulunmaz — AES şifreli bir yük olarak gömülüdür ve sayfa kendisi
  // document.write ile açar. Bu yüzden sayfada m3u8/iframe/video aramak
  // boşuna. Önce şifreyi çözüp GERÇEK içerikle devam et.
  let html = hamHtml;
  if (/document\s*\.\s*write/.test(hamHtml)) {
    const cozulmus = sifreliOynaticiCoz(hamHtml);
    if (cozulmus && /<[a-z!]/i.test(cozulmus)) html = cozulmus;
  }

  // /dl API: sayfadaki reklam adresleri "file:" olarak da geçtiği için
  // önce bu denenmeli, yoksa erken dönüş yanlış yayını yakalar.
  const dl = await kalipDlApi(url, html);
  if (dl) return { ...dl, via: 'dl-api' };


  // BASE64 KODLU iframe src — Türkçe oynatıcıların çok yaygın biçimi:
  //   <iframe src="aHR0cHM6Ly9wbGF5ZXIuZmlsbXpsZS5pbi92aWRlby9…">
  // Ham src bir adres DEĞİLDİR; çözülmeden kullanılırsa çöp adres üretilir
  // ve çözümleme sessizce başarısız olur. (sinemacc, liderfilm, window._vs)
  for (const m of html.matchAll(/<iframe[^>]*\ssrc=["']([A-Za-z0-9+/]{40,}={0,2})["']/gi)) {
    const coz = base64Coz(m[1]);
    const abs = coz ? mutlak(url, coz) : '';
    if (!abs || REKLAM_RE.test(abs)) continue;
    const ic = await extractEmbedStream(abs, url, gordum, bitis);
    if (ic && MEDIA_EXT.test(ic.url)) return { ...ic, via: `${ic.via}+base64` };
    return { url: abs, referer: ref, via: 'base64-iframe', subtitles: altyazilariCikar(html, url) };
  }

  // Sayfada doğrudan medya
  const dogrudan = tara(html, RE.sources, RE.m3u8, RE.videoTag);
  if (dogrudan) {
    const abs = mutlak(url, dogrudan);
    if (MEDIA_EXT.test(abs) && !REKLAM_RE.test(abs)) {
      return { url: abs, referer: ref, via: 'direct', subtitles: altyazilariCikar(html, url) };
    }
  }

  // ── Bilinen gömülü kalıpları
  if (bitis && Date.now() > bitis) return null;
  const sl = await kalipSecuredLink(url, ref);
  if (sl) return { ...sl, via: 'securedlink' };

  if (bitis && Date.now() > bitis) return null;
  const vp = await kalipVideoPlayer(url, ref, html);
  if (vp) return { ...vp, via: 'videoPlayer' };

  // ── Sayfa içi tarama
  const jl = jsonLdCoz(html);
  if (jl) {
    const ic = await extractEmbedStream(mutlak(url, jl), url, gordum);
    if (ic) return { ...ic, via: `${ic.via}+jsonld` };
  }

  const pj = await kalipPackedJs(html, url, ref);
  if (pj) return { ...pj, via: 'packedjs', subtitles: altyazilariCikar(html, url) };

  const b64 = base64GizliCoz(html);
  if (b64) return { url: b64, referer: ref, via: 'base64', subtitles: altyazilariCikar(html, url) };

  const mg = metaCoz(html, url);
  if (mg) return { url: mg, referer: ref, via: 'meta', subtitles: altyazilariCikar(html, url) };

  const lz = lazyCoz(html, url);
  if (lz) return { url: lz, referer: ref, via: 'lazy-src', subtitles: altyazilariCikar(html, url) };

  if (bitis && Date.now() > bitis) return null;
  const bp = await kalipBePlayer(url, ref, html);
  if (bp) return { ...bp, via: 'bePlayer' };

  if (bitis && Date.now() > bitis) return null;
  const nd = await kalipNonce(url, ref, html);
  if (nd) return { ...nd, via: 'nonce' };

  if (bitis && Date.now() > bitis) return null;
  const pl = await kalipPlaylist(url, ref, html);
  if (pl) return { ...pl, via: 'playlist-api' };

  // ── Son çare: sayfadaki TÜM iframe adresleri
  const iframeler = [];
  for (const m of html.matchAll(RE.iframe)) {
    const abs = mutlak(url, temizle(m[1]));
    if (abs && !iframeler.includes(abs)) iframeler.push(abs);
  }
  for (const src of iframeler.slice(0, 2)) {
    if (bitis && Date.now() > bitis) break;
    const ic = await extractEmbedStream(src, url, gordum, bitis);
    if (ic && MEDIA_EXT.test(ic.url)) return { ...ic, via: `${ic.via}+iframe` };
  }

  // ── SON ÇARE: gömülüyü olduğu gibi oynat ──────────────────────────
  // Doğrudan m3u8 çözülemedi (ok.ru, vidmoly, CF arkası oynatıcılar gibi).
  // Burada siteyi ÇÖZMEYE GEREK YOK: gömülü adresi iframe'de açılır ve
  // tarayıcı oynatıcıyı kendi motoruyla çalıştırır.
  //
  // "Her türden siteye erişim"in son adımı budur: çözülebilen çözülür,
  // çözülemeyen gömülü olarak oynatılır — hiçbir site tamamen erişilemez kalmaz.
  if (iframeler.length) {
    return {
      url: iframeler[0],
      referer: ref,
      via: 'iframe-oynat',
      isIframe: true,
      subtitles: altyazilariCikar(html, url)
    };
  }

  return null;
}

/** extractEmbedStream'ın takma adı — "her siteyi at" girişi. */
export const universalExtract = extractEmbedStream;

/* ══════════════════════════ 8. OYNATILABİLİRLİK ══════════════════════════ */

const oynabilirlikCache = new Map();
const OYNABILIRLIK_TTL = 10 * 60 * 1000;
const oynabilirlikLocks = new Map();

/**
 * Adresin gerçekten oynatılabilir olup olmadığını ölçer.
 * HEAD + `Range: bytes=0-2047` → videonun tamamı indirilmez.
 * KekikStream'de bu kontrol devre dışı bırakılmıştı; burada ucuz olduğu
 * için açık kalıyor ve 10 dakika önbellekle korunuyor.
 */
export async function isStreamPlayable(streamUrl, referer = '', timeout = 9000) {
  if (!streamUrl || !/^https?:\/\//i.test(streamUrl)) return false;

  const kayit = oynabilirlikCache.get(streamUrl);
  if (kayit && Date.now() - kayit.at < OYNABILIRLIK_TTL) return kayit.sonuc;

  if (oynabilirlikLocks.has(streamUrl)) {
    try { return await oynabilirlikLocks.get(streamUrl); } catch (_) { return false; }
  }

  const is = (async () => {
    if (/youtube\.com|youtu\.be/.test(streamUrl)) return true;

    const dene = async (method) => {
      try {
        const ac = new AbortController();
        const t = setTimeout(() => ac.abort(), timeout);
        const r = await fetch(proxyUrl(streamUrl, referer), {
          method, headers: { Range: 'bytes=0-2047' }, signal: ac.signal
        });
        clearTimeout(t);
        return r;
      } catch (_) { return null; }
    };

    let r = await dene('HEAD');
    if (!r || !r.ok) r = await dene('GET');
    if (!r || !r.ok) return false;

    const tur = (r.headers.get('content-type') || '').toLowerCase();
    if (/mpegurl|#extm3u/.test(tur)) return true;

    try {
      const metin = (await r.text()).slice(0, 600).toLowerCase();
      if (metin.trimStart().startsWith('#extm3u')) return true;
      if (/forbidden|unauthorized|cloudflare|not found|yasak|bulunamad|expired|no longer available|<h1/.test(metin)) return false;
      if (tur.includes('html')) return false;
    } catch (_) {}
    return true;
  })();

  oynabilirlikLocks.set(streamUrl, is);
  try {
    const sonuc = await is;
    oynabilirlikCache.set(streamUrl, { at: Date.now(), sonuc });
    if (oynabilirlikCache.size > 500) {
      const eski = [...oynabilirlikCache.entries()].sort((a, b) => a[1].at - b[1].at).slice(0, 120);
      for (const [k] of eski) oynabilirlikCache.delete(k);
    }
    return sonuc;
  } finally {
    oynabilirlikLocks.delete(streamUrl);
  }
}

/** Çoklu adresi paralel doğrular, oynatılabilirleri döner. */
export async function playableSec(adresler, referer = '') {
  const s = await Promise.all(adresler.map(async (a) =>
    (await isStreamPlayable(a.url || a, a.referer || referer)) ? a : null));
  return s.filter(Boolean);
}

/** Çözümleme katmanlarının sağlık durumu (hata ayıklama / teşhis için). */
export function katmanSagligi() {
  return {
    dogrudan: KATMAN_SAGLIK.dogrudan,
    worker: KATMAN_SAGLIK.worker,
    proxy: KATMAN_SAGLIK.proxy,
    arkaArdaHata: { ...KATMAN_SAGLIK.arkaArdaHata }
  };
}

export function onbellekTemizle() {
  oynabilirlikCache.clear();
  oynabilirlikLocks.clear();
}