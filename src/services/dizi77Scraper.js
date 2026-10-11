import { akilliGet, cihazGet, nativeHttpAktifMi } from './nativeHttp.js';

/* ==========================================================================
   CinePulse — dizi77.life kaziyicisi (dizi odakli)

   Akis (canli dogrulanmis 2026-10-11):
     /diziler                       -> dizi linkleri (/dizi/<slug>)
     /dizi/<slug>                   -> bolum linkleri (/dizi/<slug>/sezon/N/bolum/M)
     /dizi/<slug>/sezon/N/bolum/M   -> <iframe src="https://.../player/<id>">

   Oynatici sayfasi gomulu oldugu icin yayin URL'i olarak IFRAME dondurulur;
   uygulama bunu mevcut oynatici cercevesinde acar (sezonlukdizi ile ayni
   yaklasim). Direkt m3u8 yoktur ve sayfa JS ile yuklenmez.
   ========================================================================== */

const BASE = 'https://dizi77.life';

// Jetfilm kaynaginda kullanilan CF Worker gateway. Datacenter IP'lerinden
// cikan istekleri atlayarak sitenin CF engelini gecir (canli dogrulandi:
// dizi77 /diziler uzerinden 85677 bayt, 21 dizi linki, engel imzasi yok).
const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

function proxyUrl(url, ref) {
  try {
    const r = `${new URL(url).origin}/`;
    return `/api/proxy?url=${encodeURIComponent(url)}&ref=${encodeURIComponent(ref || r)}`;
  } catch (_) {
    return url;
  }
}

// Engel sayfasi mi, yoksa gercek icerik mi? Yanit 200 olsa bile CF
// "Attention Required" HTML'i donebiliyor; boyle bir govde kabul edilmez.
function isBlockedBody(body) {
  if (!body || body.length < 2000) return true;
  const low = body.slice(0, 4000).toLowerCase();
  return low.includes('attention required') || low.includes('just a moment')
      || low.includes('cf-browser-verification') || low.includes('enable javascript and cookies');
}

async function getHtml(url, timeout = 12000, referer = '') {
  // ── 0) Cihazin kendi IP'sinden dogrudan istek (CapacitorHttp) ──────────
  // En hizli ve en ucuz yol: WebView yok, proxy yok, sunucu yok. Isteği
  // telefonun ag yiginindan atar (kullanici ev IP'si) ve Referer serbestce
  // yazilabilir. Vercel'e hic ugramaz.
  if (nativeHttpAktifMi()) {
    const r = await cihazGet(url, { ref: referer || undefined, timeout: Math.min(timeout, 10000) });
    if (r.ok && r.text && !isBlockedBody(r.text)) return r.text;
  }

  // ── 1) CIHAZIN KENDI WebView'i (cf_clearance cihazin agindan alinir) ──
  // Orion/hdfc deseni. Android ve masaustunde en guclu yol.
  try {
    const wv = await import('./platform/androidWebViewResolver.js');
    if (wv.hasNativeWebViewResolver()) {
      // Not: çözümleyici yalnızca timeoutMs kabul ediyor; referer WebView'de
      // sitenin kendi gezinmesinden geldiği için ayrıca gerekmiyor.
      const hit = await wv.resolvePageInNativeWebView(url, { timeoutMs: Math.max(14000, timeout + 6000) });
      if (hit && !wv.looksBlocked(hit)) {
        const raw = String(hit.text || '').trim();
        const body = (raw.startsWith('{') || raw.startsWith('[')) ? raw : (hit.html || raw);
        if (body && !isBlockedBody(body)) return body;
      }
    }
  } catch (_) {}

  // ── 2) CF Worker gateway ──────────────────────────────────────────────
  // Web sürümünde çalışır: istek Cloudflare ağı üzerinden gittiği için
  // datacenter IP engeli devreye girmiyor.
  try {
    const res = await fetch(`${CF_WORKER_PROXY}?url=${encodeURIComponent(url)}`, {
      signal: AbortSignal.timeout(Math.max(9000, timeout))
    }).catch(() => null);
    if (res && res.ok) {
      const body = await res.text();
      if (!isBlockedBody(body)) return body;
    }
  } catch (_) {}

  // ── 3) Uygulama proxy'si (Vercel / yerel sidecar) ──────────────────────
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(proxyUrl(url, referer), {
      signal: ctrl.signal,
      headers: { 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' }
    });
    if (!res.ok) return '';
    const body = await res.text();
    return isBlockedBody(body) ? '' : body;
  } catch (_) {
    return '';
  } finally {
    clearTimeout(timer);
  }
}

function normalize(str) {
  return String(str || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
    .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '');
}

function slugify(title) {
  return normalize(title).trim();
}

export async function searchDizi77(query) {
  if (!query || String(query).trim().length < 2) return [];
  const html = await getHtml(`${BASE}/diziler`, 14000, `${BASE}/`);
  if (!html) return [];

  const seen = new Set();
  const out = [];
  const re = /href="https:\/\/dizi77\.life\/dizi\/([a-z0-9-]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    const slug = m[1];
    if (seen.has(slug)) continue;
    seen.add(slug);
    const title = slug.split('-').map(w => w ? w[0].toUpperCase() + w.slice(1) : w).join(' ');
    out.push({ id: slug, title, url: `${BASE}/dizi/${slug}`, isSeries: true });
  }

  const q = normalize(query);
  if (!q) return out.slice(0, 60);
  const hit = out.filter(r => normalize(r.title).includes(q) || normalize(r.id).includes(q));
  return (hit.length ? hit : out).slice(0, 60);
}

/** Sezon listesi: /dizi/<slug> icindeki "sezon/N" baglantilari. */
async function listSeasons(seriesUrl) {
  const html = await getHtml(seriesUrl, 14000, `${BASE}/`);
  if (!html) return [];
  const seasons = new Map();
  const re = /href="https:\/\/dizi77\.life\/dizi\/[a-z0-9-]+\/sezon\/(\d+)(?:\/bolum\/(\d+))?/g;
  let m;
  while ((m = re.exec(html))) {
    const s = Number(m[1]);
    if (m[2]) seasons.set(s, true);
  }
  return [...seasons.keys()].sort((a, b) => a - b);
}

/**
 * Istenen bolumun oynatici iframe'ini dondurur.
 * once dogrudan URL dener, bulamazsa mevcut sezonlarda en yakin bolumu arar
 * (sitelerde bazen sezon/epizot numaralandirmasi kayar).
 */
export async function fetchDizi77EpisodeSources(seriesUrl, season = 1, episode = 1) {
  if (!seriesUrl) return [];
  const wanted = [];
  for (const s of [Number(season), Number(season) + 1, Number(season) - 1]) {
    if (s >= 1) wanted.push(s);
  }

  for (const s of wanted) {
    for (const ep of (s === Number(season) ? [Number(episode), Number(episode) + 1] : [Number(episode)])) {
      if (ep < 1) continue;
      const url = `${seriesUrl}/sezon/${s}/bolum/${ep}`;
      const html = await getHtml(url, 14000, seriesUrl);
      if (!html) continue;
      const m = html.match(/<iframe[^>]*src="(https?:\/\/[^"]+)"/i);
      if (m && m[1].length > 12) {
        return [{
          id: `d77_s${s}e${ep}`,
          title: `dizi77 • S{s}E{ep}`,
          displayName: `dizi77 S${s}B${ep}`,
          badge: `🎬 1080p gömülü`,
          source: 'dizi77',
          type: 'embed',
          isIframe: true,
          category: 'dubbed',
          url: m[1],
          streamUrl: m[1],
          embedUrl: m[1],
          rawStreamUrl: m[1],
          quality: '1080p',
          pageUrl: url
        }];
      }
    }
  }

  // Bölüm linki bulunamadıysa sezon sayfasından ilk uygun bolumu dene.
  const seasons = await listSeasons(seriesUrl);
  for (const s of seasons.slice(0, 4)) {
    const html = await getHtml(`${seriesUrl}/sezon/${s}`, 12000, seriesUrl);
    const ep = html && html.match(new RegExp(`/dizi/[a-z0-9-]+/sezon/${s}/bolum/(\\d+)`, 'i'));
    if (!ep) continue;
    const epHtml = await getHtml(`${seriesUrl}/sezon/${s}/bolum/${ep[1]}`, 12000, seriesUrl);
    const m = epHtml && epHtml.match(/<iframe[^>]*src="(https?:\/\/[^"]+)"/i);
    if (m) {
      return [{
        id: `d77_s${s}e${ep[1]}`,
        title: `dizi77 • S${s}B${ep[1]}`,
        displayName: `dizi77 S${s}B${ep[1]}`,
        badge: '🎬 1080p gömülü',
        source: 'dizi77',
        type: 'embed',
        isIframe: true,
        category: 'dubbed',
        url: m[1],
        streamUrl: m[1],
        embedUrl: m[1],
        rawStreamUrl: m[1],
        quality: '1080p',
        pageUrl: `${seriesUrl}/sezon/${s}/bolum/${ep[1]}`
      }];
    }
  }
  return [];
}
/**
 * Aggregator giris noktasi: baslik(lar)dan dizi URL'sini bulur, sonra
 * istenen bolumun oynaticisini getirir. ProviderAggregator bu tek fonksiyonu
 * cagirir; iki adimi birbirinden bagimsiz tutmak yerine burada birlestirdik
 * ki cagri noktasi yanlis parametre suresi yuzunden sessizce bos kalmasin.
 */
export async function fetchDizi77Sources({ titles = [], title = '', season = 1, episode = 1 } = {}) {
  const cands = [...new Set([...titles, title].filter((t) => t && String(t).trim().length > 1))];
  if (!cands.length) return [];

  let match = null;
  for (const c of cands) {
    const res = await searchDizi77(c);
    if (!res.length) continue;
    const nc = normalize(c);
    match = res.find((r) => normalize(r.title) === nc)
      || res.find((r) => normalize(r.title).includes(nc) || nc.includes(normalize(r.title)))
      || res[0];
    if (match) break;
  }
  if (!match) return [];

  return fetchDizi77EpisodeSources(match.url, season, episode);
}
