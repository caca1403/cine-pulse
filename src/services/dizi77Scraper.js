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

function proxyUrl(url, ref) {
  try {
    const r = `${new URL(url).origin}/`;
    return `/api/proxy?url=${encodeURIComponent(url)}&ref=${encodeURIComponent(ref || r)}`;
  } catch (_) {
    return url;
  }
}

async function getHtml(url, timeout = 12000, referer = '') {
  // ── Cloudflare-first çözümleme ────────────────────────────────────────
  // dizi77.life, Vercel/datacenter IP'lerine "Attention Required" (403)
  // döndürüyor; ev/cihaz IP'sine 200. Bu yüzden önce CIHAZIN KENDİ
  // WebView'i denenir (cf_clearance cihazın ağından alınır) — Orion/hdfc
  // deseni. WebView yoksa ya da engel görünürse normal proxy'ye düşülür.
  try {
    const wv = await import('./platform/androidWebViewResolver.js');
    if (wv.hasNativeWebViewResolver()) {
      // Not: çözümleyici yalnızca timeoutMs kabul ediyor; referer WebView'de
      // sitenin kendi gezinmesinden geldiği için ayrıca gerekmiyor.
      const hit = await wv.resolvePageInNativeWebView(url, { timeoutMs: Math.max(14000, timeout + 6000) });
      if (hit && !wv.looksBlocked(hit)) {
        const raw = String(hit.text || '').trim();
        const body = (raw.startsWith('{') || raw.startsWith('[')) ? raw : (hit.html || raw);
        if (body && body.length > 2000) return body;
      }
    }
  } catch (_) {}

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(proxyUrl(url, referer), {
      signal: ctrl.signal,
      headers: { 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' }
    });
    if (!res.ok) return '';
    const body = await res.text();
    // Engel sayfası HTML'i dönebilir; kullanıcı sayfası olamayacak kadar kısa
    // ya da CF imzası taşıyorsa reddet.
    if (body.length < 2000) return '';
    const low = body.slice(0, 4000).toLowerCase();
    if (low.includes('attention required') || low.includes('just a moment')) return '';
    return body;
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