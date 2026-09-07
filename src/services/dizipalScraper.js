/* ==========================================================================
   CinePulse Studio - Dizipal Scraper (Movies & Series Engine)
   Direct 1080p HLS Streams & Multi-Language Subtitles from Dizipal
   Bypasses preroll ads and extracts native master.m3u8 streams.
   Includes Dynamic Domain Resolver (auto-detects dizipal1227, 1228, 1229, etc.)
   ========================================================================== */

import { extractAlphaStream } from './streamExtractors.js';

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';
const KNOWN_START_NUM = 1227;

let cachedBaseUrl = 'https://dizipal1229.com';
let lastResolvedTime = Date.now();

/**
 * Robust fetch that uses CF Worker Proxy or direct fetch to eliminate CORS
 */
async function fetchWithProxy(targetUrl, options = {}) {
  const isBrowser = typeof window !== 'undefined';
  const localProxyUrl = isBrowser
    ? `/api/proxy?url=${encodeURIComponent(targetUrl)}`
    : `http://localhost:4000/proxy?url=${encodeURIComponent(targetUrl)}`;

  // 1. Try local MediaServer proxy (instant, zero CORS, zero connection reset)
  try {
    const res = await fetch(localProxyUrl, {
      ...options,
      signal: AbortSignal.timeout(options.timeout || 3500)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  // 2. Direct fetch (Node.js or non-restricted requests)
  try {
    const res = await fetch(targetUrl, {
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

  // 3. Fallback to Cloudflare Worker proxy
  try {
    const workerUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(workerUrl, {
      ...options,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...(options.headers || {})
      },
      signal: AbortSignal.timeout(options.timeout || 4000)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  return null;
}

/**
 * Dynamically resolves the current active Dizipal domain (handles 1227, 1228, 1229, 1230...)
 */
export async function getActiveDizipalDomain(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedBaseUrl && (now - lastResolvedTime < 30 * 60 * 1000)) {
    return cachedBaseUrl;
  }

  // Check localStorage if available
  if (typeof window !== 'undefined' && window.localStorage && !forceRefresh) {
    const stored = window.localStorage.getItem('cp_dizipal_domain');
    if (stored && stored.startsWith('http')) {
      cachedBaseUrl = stored;
      lastResolvedTime = now;
      return cachedBaseUrl;
    }
  }

  // Probing candidate domains around known numbers
  const candidates = [
    'https://dizipal1229.com',
    'https://dizipal1227.com',
    'https://dizipal1230.com',
    'https://dizipal1228.com',
    'https://dizipal1231.com',
    'https://dizipal1232.com',
    'https://dizipal1233.com',
    'https://dizipal1234.com',
    'https://dizipal1235.com'
  ];

  const checkDomain = async (domain) => {
    const testRes = await fetchWithProxy(`${domain}/ara?q=a`, { timeout: 2500 });
    if (testRes && testRes.ok) {
      const text = await testRes.text().catch(() => '');
      if (text && (text.includes('dizi') || text.includes('film') || text.includes('dizipal'))) {
        return domain;
      }
    }
    throw new Error('No match');
  };

  try {
    const verified = await Promise.any(candidates.map(checkDomain));
    cachedBaseUrl = verified;
    lastResolvedTime = now;
    if (typeof window !== 'undefined' && window.localStorage) {
      try { window.localStorage.setItem('cp_dizipal_domain', verified); } catch (_) {}
    }
    console.log(`[DizipalScraper] ✅ Active Dizipal domain verified: ${verified}`);
    return verified;
  } catch (_) {}

  // Fallback if probes fail
  const fallback = 'https://dizipal1229.com';
  cachedBaseUrl = fallback;
  return fallback;
}

/**
 * Searches Dizipal for movies or series
 */
export async function searchDizipal(query) {
  if (!query || typeof query !== 'string' || query.trim().length < 2) return [];

  try {
    const baseUrl = await getActiveDizipalDomain();
    const searchUrl = `${baseUrl}/ara?q=${encodeURIComponent(query.trim())}`;
    const res = await fetchWithProxy(searchUrl, { timeout: 5000 });
    if (!res) return [];

    const html = await res.text();
    // Match any link: relative /film/slug or absolute https://dizipalXXXX.com/film/slug
    const links = [...html.matchAll(/href=["']((?:https?:\/\/[^/]+)?\/(film|dizi)\/([^"'?#]+))["']/gi)];
    const results = [];

    for (const match of links) {
      const rawUrl = match[1];
      const type = match[2]; // 'film' or 'dizi'
      const slug = match[3];

      const fullUrl = rawUrl.startsWith('http') ? rawUrl : `${baseUrl}${rawUrl}`;

      if (!results.some(r => r.url === fullUrl)) {
        results.push({
          url: fullUrl,
          type,
          slug,
          isSeries: type === 'dizi'
        });
      }
    }

    return results;
  } catch (_) {
    return [];
  }
}

/**
 * Extracts streams for a Movie on Dizipal
 */
export async function fetchDizipalMovieSources({
  titles = [],
  title = '',
  originalTitle = '',
  isDub = true
}) {
  const candidateTitles = [...new Set([...titles, title, originalTitle])].filter(t => t && typeof t === 'string' && t.trim().length > 1);
  if (candidateTitles.length === 0) return [];

  for (const query of candidateTitles) {
    const searchResults = await searchDizipal(query);
    const movieMatch = searchResults.find(r => r.type === 'film');

    if (movieMatch) {
      try {
        const pageRes = await fetchWithProxy(movieMatch.url, { timeout: 5000 });
        if (!pageRes) continue;

        const html = await pageRes.text();
        const embedMatch = html.match(/x-data=["']softPlayer\(['"](https?:\/\/[^'"]+)['"]/i);
        if (!embedMatch) continue;

        const embedUrl = embedMatch[1];
        const direct = await extractAlphaStream(embedUrl);
        if (direct && direct.url) {
          const proxiedStreamUrl = `/api/hls_proxy?url=${encodeURIComponent(direct.url)}&ref=${encodeURIComponent('https://x.ag2m4.cfd/')}`;
          return [
            {
              id: `dzp_mov_${movieMatch.slug}_${isDub ? 'dub' : 'sub'}`,
              name: 'Dizipal Direct 1080p',
              displayName: 'Dizipal Direct 1080p',
              badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
              source: 'Dizipal',
              url: proxiedStreamUrl,
              streamUrl: proxiedStreamUrl,
              originalEmbedUrl: embedUrl,
              quality: '1080p',
              isHls: true,
              isDirectVideo: true,
              type: 'hls',
              subtitles: direct.subtitles || [],
              isDub,
              getUrl: () => proxiedStreamUrl
            }
          ];
        } else if (embedUrl) {
          return [
            {
              id: `dzp_mov_${movieMatch.slug}_${isDub ? 'dub' : 'sub'}`,
              name: 'Dizipal Direct 1080p',
              displayName: 'Dizipal Direct 1080p',
              badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
              source: 'Dizipal',
              url: embedUrl,
              streamUrl: embedUrl,
              originalEmbedUrl: embedUrl,
              quality: '1080p',
              isHls: false,
              isDirectVideo: false,
              type: 'embed',
              isDub,
              getUrl: () => embedUrl
            }
          ];
        }
      } catch (_) {}
    }
  }

  return [];
}

/**
 * Extracts streams for a TV Episode on Dizipal
 */
export async function fetchDizipalEpisodeSources({
  titles = [],
  seriesTitle = '',
  originalTitle = '',
  season = 1,
  episode = 1,
  isDub = true
}) {
  const candidateTitles = [...new Set([...titles, seriesTitle, originalTitle])].filter(t => t && typeof t === 'string' && t.trim().length > 1);
  if (candidateTitles.length === 0) return [];

  for (const query of candidateTitles) {
    const searchResults = await searchDizipal(query);
    const seriesMatch = searchResults.find(r => r.type === 'dizi');

    if (seriesMatch) {
      try {
        // Construct standard episode URL format
        const episodeUrl = `${seriesMatch.url}/sezon-${season}/bolum-${episode}`;
        const pageRes = await fetchWithProxy(episodeUrl, { timeout: 5000 });
        if (!pageRes) continue;

        const html = await pageRes.text();
        const embedMatch = html.match(/x-data=["']softPlayer\(['"](https?:\/\/[^'"]+)['"]/i);
        if (!embedMatch) continue;

        const embedUrl = embedMatch[1];
        const direct = await extractAlphaStream(embedUrl);
        if (direct && direct.url) {
          const proxiedStreamUrl = `/api/hls_proxy?url=${encodeURIComponent(direct.url)}&ref=${encodeURIComponent('https://x.ag2m4.cfd/')}`;
          return [
            {
              id: `dzp_tv_${seriesMatch.slug}_s${season}_e${episode}_${isDub ? 'dub' : 'sub'}`,
              name: `Dizipal 1080p (S${season}B${episode})`,
              displayName: `Dizipal 1080p (S${season}B${episode})`,
              badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
              source: 'Dizipal',
              url: proxiedStreamUrl,
              streamUrl: proxiedStreamUrl,
              originalEmbedUrl: embedUrl,
              quality: '1080p',
              isHls: true,
              isDirectVideo: true,
              type: 'hls',
              subtitles: direct.subtitles || [],
              isDub,
              getUrl: () => proxiedStreamUrl
            }
          ];
        } else if (embedUrl) {
          return [
            {
              id: `dzp_tv_${seriesMatch.slug}_s${season}_e${episode}_${isDub ? 'dub' : 'sub'}`,
              name: `Dizipal 1080p (S${season}B${episode})`,
              displayName: `Dizipal 1080p (S${season}B${episode})`,
              badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
              source: 'Dizipal',
              url: embedUrl,
              streamUrl: embedUrl,
              originalEmbedUrl: embedUrl,
              quality: '1080p',
              isHls: false,
              isDirectVideo: false,
              type: 'embed',
              isDub,
              getUrl: () => embedUrl
            }
          ];
        }
      } catch (_) {}
    }
  }

  return [];
}
