/* ==========================================================================
   CinePulse Studio - Diziroll Scraper (TV Series Engine)
   Extracts high-speed video player embeds from diziroll.club
   Supports Turkish Dubbed (Türkçe Dublaj) & Subtitled (Türkçe Altyazılı).
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';
const DIZIROLL_BASE = 'https://diziroll.club';

async function fetchDiziroll(url, options = {}) {
  const isBrowser = typeof window !== 'undefined';
  const cleanUrl = url.startsWith('http') ? url : `${DIZIROLL_BASE}${url.startsWith('/') ? url : `/${url}`}`;

  // 1. Direct fetch (Node / Serverless)
  try {
    const res = await fetch(cleanUrl, {
      ...options,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...(options.headers || {})
      },
      signal: AbortSignal.timeout(options.timeout || 3500)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  // 2. Vercel proxy fallback
  if (isBrowser) {
    try {
      const u = new URL(cleanUrl);
      const proxyUrl = `/api/dzr${u.pathname}${u.search}`;
      const res = await fetch(proxyUrl, {
        ...options,
        signal: AbortSignal.timeout(options.timeout || 3500)
      }).catch(() => null);
      if (res && res.ok) return res;
    } catch (_) {}
  }

  // 3. Cloudflare Worker fallback
  try {
    const workerUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(cleanUrl)}`;
    const res = await fetch(workerUrl, {
      ...options,
      signal: AbortSignal.timeout(options.timeout || 4000)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  return null;
}

function toSlug(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Fetches Episode sources from Diziroll
 */
export async function fetchDizirollEpisodeSources({ titles = [], seriesTitle, originalTitle, season, episode, isDub = false }) {
  const sources = [];
  const sNum = parseInt(season, 10) || 1;
  const epNum = parseInt(episode, 10) || 1;

  const candidateQueries = new Set();
  if (Array.isArray(titles)) titles.forEach(t => t && candidateQueries.add(t));
  if (seriesTitle) candidateQueries.add(seriesTitle);
  if (originalTitle) candidateQueries.add(originalTitle);

  for (const q of candidateQueries) {
    const baseSlug = toSlug(q);
    if (!baseSlug) continue;

    const slug = isDub ? `${baseSlug}-turkce-dublaj` : baseSlug;
    const epUrl = `https://diziroll.club/dizi/${slug}/sezon-${sNum}/bolum-${epNum}`;

    try {
      const res = await fetchDiziroll(epUrl, { timeout: 3500 });
      if (!res || !res.ok) continue;

      const html = await res.text().catch(() => '');
      if (!html) continue;

      const iframeMatch = html.match(/<iframe[^>]+src="([^"]+)"/i);
      if (iframeMatch && iframeMatch[1]) {
        let iframeUrl = iframeMatch[1];
        if (iframeUrl.startsWith('//')) iframeUrl = `https:${iframeUrl}`;

        sources.push({
          id: `dzr_s${sNum}e${epNum}_${isDub ? 'dub' : 'sub'}`,
          name: isDub ? 'Diziroll VIP (TR Dublaj)' : 'Diziroll VIP (TR Altyazı)',
          displayName: 'Diziroll VIP',
          streamUrl: iframeUrl,
          url: iframeUrl,
          isHls: false,
          isDirectVideo: false,
          source: 'Diziroll',
          badge: isDub ? '⚡ Diziroll Dublaj' : '💬 Diziroll Altyazı'
        });
        break;
      }
    } catch (_) {}
  }

  return sources;
}
