/* ==========================================================================
   CinePulse Studio - DiziBal Scraper (Movies & TV Series Engine)
   Extracts direct Alpha Stream HLS 1080p (.m3u8) streams and multi-language
   subtitles from dizibal.org public REST API & x.ag2m4.cfd player.
   ========================================================================== */

import { extractAlphaStream } from './streamExtractors.js';

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';
const DIZIBAL_API_BASE = 'https://dizibal.org/api';

async function fetchDizibal(endpointOrUrl, options = {}) {
  const isBrowser = typeof window !== 'undefined';
  const fullUrl = endpointOrUrl.startsWith('http')
    ? endpointOrUrl
    : `${DIZIBAL_API_BASE}${endpointOrUrl.startsWith('/') ? endpointOrUrl : `/${endpointOrUrl}`}`;

  // 1. Direct fetch (DiziBal Express API provides Access-Control-Allow-Origin: *)
  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        ...(options.headers || {})
      },
      signal: AbortSignal.timeout(options.timeout || 4000)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  // 2. Vercel / Local proxy fallback
  if (isBrowser && !endpointOrUrl.startsWith('http')) {
    try {
      const cleanPath = endpointOrUrl.startsWith('/') ? endpointOrUrl : `/${endpointOrUrl}`;
      const proxyUrl = `/api/dzb${cleanPath}`;
      const res = await fetch(proxyUrl, {
        ...options,
        signal: AbortSignal.timeout(options.timeout || 4000)
      }).catch(() => null);
      if (res && res.ok) return res;
    } catch (_) {}
  }

  // 3. Cloudflare Worker fallback
  try {
    const workerUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(fullUrl)}`;
    const res = await fetch(workerUrl, {
      ...options,
      signal: AbortSignal.timeout(options.timeout || 4500)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  return null;
}

function normalizeTitle(str) {
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
    .replace(/[^a-z0-9]/g, '');
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
 * Searches DiziBal series
 */
export async function searchDizibalSeries(query) {
  if (!query || typeof query !== 'string' || query.trim().length < 2) return [];
  try {
    const res = await fetchDizibal(`/series?search=${encodeURIComponent(query.trim())}`, { timeout: 3500 });
    if (!res) return [];
    const data = await res.json().catch(() => null);
    return data && Array.isArray(data.data) ? data.data : [];
  } catch (_) {
    return [];
  }
}

/**
 * Searches DiziBal movies
 */
export async function searchDizibalMovies(query) {
  if (!query || typeof query !== 'string' || query.trim().length < 2) return [];
  try {
    const res = await fetchDizibal(`/movies?search=${encodeURIComponent(query.trim())}`, { timeout: 3500 });
    if (!res) return [];
    const data = await res.json().catch(() => null);
    return data && Array.isArray(data.data) ? data.data : [];
  } catch (_) {
    return [];
  }
}

/**
 * Fetches Episode sources from DiziBal
 */
export async function fetchDizibalEpisodeSources({ titles = [], seriesTitle, originalTitle, season, episode, isDub = false }) {
  const sources = [];
  const sNum = parseInt(season, 10) || 1;
  const epNum = parseInt(episode, 10) || 1;

  const candidateQueries = new Set();
  if (Array.isArray(titles)) titles.forEach(t => t && candidateQueries.add(t));
  if (seriesTitle) candidateQueries.add(seriesTitle);
  if (originalTitle) candidateQueries.add(originalTitle);

  let matchedSeries = null;

  // Try direct slug check first (e.g. /api/series/stranger-things)
  for (const q of candidateQueries) {
    const slug = toSlug(q);
    if (!slug) continue;
    try {
      const res = await fetchDizibal(`/series/${slug}`, { timeout: 3000 });
      if (res) {
        const json = await res.json().catch(() => null);
        if (json && json.success && json.data && json.data._id) {
          matchedSeries = json.data;
          break;
        }
      }
    } catch (_) {}
  }

  // Fallback: search API
  if (!matchedSeries) {
    for (const q of candidateQueries) {
      const results = await searchDizibalSeries(q);
      if (results.length > 0) {
        const normQ = normalizeTitle(q);
        matchedSeries = results.find(item => {
          const normTitle = normalizeTitle(item.title || item.name || item.name_tr || item.name_en || '');
          const normSlug = normalizeTitle(item.slug || '');
          return normTitle.includes(normQ) || normQ.includes(normTitle) || normSlug.includes(normQ);
        }) || results[0];
        if (matchedSeries) break;
      }
    }
  }

  if (!matchedSeries || !matchedSeries._id) return [];

  // Fetch season episodes
  try {
    const seasonRes = await fetchDizibal(`/series/${matchedSeries._id}/seasons/${sNum}`, { timeout: 3500 });
    if (!seasonRes) return [];
    const seasonJson = await seasonRes.json().catch(() => null);
    if (!seasonJson || !seasonJson.success || !seasonJson.data || !Array.isArray(seasonJson.data.episodes)) {
      return [];
    }

    const ep = seasonJson.data.episodes.find(e => parseInt(e.episode_number, 10) === epNum);
    if (!ep || !ep.src) return [];

    const srcCode = ep.src;

    // 1. Get subtitles from dizibal stream metadata endpoint
    let subtitles = [];
    try {
      const metaRes = await fetchDizibal(`/stream/m3u8?code=${encodeURIComponent(srcCode)}`, { timeout: 3500 });
      if (metaRes) {
        const metaJson = await metaRes.json().catch(() => null);
        if (metaJson && Array.isArray(metaJson.subtitles)) {
          subtitles = metaJson.subtitles.map(s => {
            const rawSrc = s.url || s.file || '';
            const safeSrc = rawSrc.startsWith('http') ? `/api/proxy?url=${encodeURIComponent(rawSrc)}` : rawSrc;
            return {
              label: s.label || (s.lang === 'tr' ? 'Türkçe' : 'English'),
              srclang: s.lang || 'tr',
              src: safeSrc,
              file: safeSrc,
              kind: 'subtitles',
              default: s.lang === 'tr'
            };
          });
        }
      }
    } catch (_) {}

    // 2. Extract direct HLS via Alpha Stream embed
    const embedUrl = `https://x.ag2m4.cfd/embed-${srcCode}.html`;
    const directStream = await extractAlphaStream(embedUrl).catch(() => null);

    if (directStream && (directStream.streamUrl || directStream.url)) {
      let finalStreamUrl = directStream.streamUrl || directStream.url;
      if (finalStreamUrl.startsWith('http') && !finalStreamUrl.includes('/api/hls_proxy')) {
        finalStreamUrl = `/api/hls_proxy?url=${encodeURIComponent(finalStreamUrl)}&ref=${encodeURIComponent('https://x.ag2m4.cfd/')}`;
      }
      sources.push({
        id: `dzb_direct_s${sNum}e${epNum}`,
        name: isDub ? 'DiziBal 1080p Alpha (TR Dublaj)' : 'DiziBal 1080p Alpha (TR Altyazı)',
        displayName: 'DiziBal 1080p Alpha',
        streamUrl: finalStreamUrl,
        url: finalStreamUrl,
        subtitles: subtitles.length > 0 ? subtitles : (directStream.subtitles || []),
        isHls: true,
        isDirectVideo: true,
        source: 'DiziBal',
        badge: isDub ? '⚡ DiziBal Dublaj' : '💬 DiziBal Altyazı'
      });
    } else {
      // Fallback: embed
      sources.push({
        id: `dzb_embed_s${sNum}e${epNum}`,
        name: isDub ? 'DiziBal Alpha Player (Dublaj)' : 'DiziBal Alpha Player (Altyazı)',
        displayName: 'DiziBal Alpha Player',
        streamUrl: embedUrl,
        url: embedUrl,
        subtitles: subtitles,
        isHls: false,
        isDirectVideo: false,
        source: 'DiziBal',
        badge: '🌐 DiziBal VIP'
      });
    }
  } catch (_) {}

  return sources;
}

/**
 * Fetches Movie sources from DiziBal
 */
export async function fetchDizibalMovieSources({ titles = [], title, originalTitle, isDub = false }) {
  const sources = [];
  const candidateQueries = new Set();
  if (Array.isArray(titles)) titles.forEach(t => t && candidateQueries.add(t));
  if (title) candidateQueries.add(title);
  if (originalTitle) candidateQueries.add(originalTitle);

  let matchedMovie = null;

  // Direct slug search
  for (const q of candidateQueries) {
    const slug = toSlug(q);
    if (!slug) continue;
    try {
      const res = await fetchDizibal(`/movies/${slug}`, { timeout: 3000 });
      if (res) {
        const json = await res.json().catch(() => null);
        if (json && json.success && json.data && json.data.src) {
          matchedMovie = json.data;
          break;
        }
      }
    } catch (_) {}
  }

  // Fallback: movies search
  if (!matchedMovie) {
    for (const q of candidateQueries) {
      const results = await searchDizibalMovies(q);
      if (results.length > 0) {
        const normQ = normalizeTitle(q);
        matchedMovie = results.find(item => {
          const normTitle = normalizeTitle(item.title || item.title_tr || item.title_en || '');
          const normSlug = normalizeTitle(item.slug || '');
          return normTitle.includes(normQ) || normQ.includes(normTitle) || normSlug.includes(normQ);
        }) || results[0];
        if (matchedMovie) break;
      }
    }
  }

  if (!matchedMovie || !matchedMovie.src) return [];

  const srcCode = matchedMovie.src;

  // Subtitles
  let subtitles = [];
  try {
    const metaRes = await fetchDizibal(`/stream/m3u8?code=${encodeURIComponent(srcCode)}`, { timeout: 3500 });
    if (metaRes) {
      const metaJson = await metaRes.json().catch(() => null);
      if (metaJson && Array.isArray(metaJson.subtitles)) {
        subtitles = metaJson.subtitles.map(s => {
          const rawSrc = s.url || s.file || '';
          const safeSrc = rawSrc.startsWith('http') ? `/api/proxy?url=${encodeURIComponent(rawSrc)}` : rawSrc;
          return {
            label: s.label || (s.lang === 'tr' ? 'Türkçe' : 'English'),
            srclang: s.lang || 'tr',
            src: safeSrc,
            file: safeSrc,
            kind: 'subtitles',
            default: s.lang === 'tr'
          };
        });
      }
    }
  } catch (_) {}

  // Alpha stream direct HLS
  const embedUrl = `https://x.ag2m4.cfd/embed-${srcCode}.html`;
  const directStream = await extractAlphaStream(embedUrl).catch(() => null);

  if (directStream && (directStream.streamUrl || directStream.url)) {
    let finalStreamUrl = directStream.streamUrl || directStream.url;
    if (finalStreamUrl.startsWith('http') && !finalStreamUrl.includes('/api/hls_proxy')) {
      finalStreamUrl = `/api/hls_proxy?url=${encodeURIComponent(finalStreamUrl)}&ref=${encodeURIComponent('https://x.ag2m4.cfd/')}`;
    }
    sources.push({
      id: 'dzb_direct_movie',
      name: isDub ? 'DiziBal 1080p Alpha (TR Dublaj)' : 'DiziBal 1080p Alpha (TR Altyazı)',
      displayName: 'DiziBal 1080p Alpha',
      streamUrl: finalStreamUrl,
      url: finalStreamUrl,
      subtitles: subtitles.length > 0 ? subtitles : (directStream.subtitles || []),
      isHls: true,
      isDirectVideo: true,
      source: 'DiziBal',
      badge: isDub ? '⚡ DiziBal Dublaj' : '💬 DiziBal Altyazı'
    });
  } else {
    sources.push({
      id: 'dzb_embed_movie',
      name: isDub ? 'DiziBal Alpha Player (Dublaj)' : 'DiziBal Alpha Player (Altyazı)',
      displayName: 'DiziBal Alpha Player',
      streamUrl: embedUrl,
      url: embedUrl,
      subtitles: subtitles,
      isHls: false,
      isDirectVideo: false,
      source: 'DiziBal',
      badge: '🌐 DiziBal VIP'
    });
  }

  return sources;
}
