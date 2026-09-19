/* ==========================================================================
   CinePulse Studio - DiziBal Scraper (Movies & TV Series Engine)
   Resolves DiziBal's own AlphaStream player through its public REST API.
   ========================================================================== */

import { isStrictMediaTitleMatch } from './mediaMatcher.js';
import { apiUrl } from './apiOrigin.js';

// Use DiziBal's own player URL. Direct CDN links are short lived and reject
// requests when the browser/CDN session no longer matches (the production 403).
async function resolveDizibalPlayer(srcCode) {
  try {
    const res = await fetch(`https://dizibal.org/api/stream/embed?code=${encodeURIComponent(srcCode)}&autoplay=1`, {
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) return null;
    const json = await res.json().catch(() => null);
    if (json?.success && json.embedUrl) return json.embedUrl;
    return null;
  } catch (_) {
    return null;
  }
}

const DIZIBAL_API_BASE = 'https://dizibal.org/api';

async function fetchDizibal(endpointOrUrl, options = {}) {
  const isBrowser = typeof window !== 'undefined';
  const cleanPath = endpointOrUrl.startsWith('/') ? endpointOrUrl : `/${endpointOrUrl}`;
  const fullUrl = endpointOrUrl.startsWith('http') ? endpointOrUrl : `${DIZIBAL_API_BASE}${cleanPath}`;
  const timeoutMs = options.timeout || 3500;

  const fetchDirect = async () => {
    const res = await fetch(fullUrl, {
      ...options,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        ...(options.headers || {})
      },
      signal: AbortSignal.timeout(timeoutMs)
    });
    if (res && res.ok) return res;
    throw new Error('Direct fetch failed');
  };

  const fetchProxy = async () => {
    if (!isBrowser || endpointOrUrl.startsWith('http')) throw new Error('No proxy needed');
    const proxyUrl = apiUrl(`/api/dzb${cleanPath}`);
    const res = await fetch(proxyUrl, {
      ...options,
      signal: AbortSignal.timeout(timeoutMs)
    });
    if (res && res.ok) return res;
    throw new Error('Proxy fetch failed');
  };

  if (isBrowser && !endpointOrUrl.startsWith('http')) {
    try {
      return await Promise.any([fetchProxy(), fetchDirect()]);
    } catch (_) {
      return null;
    }
  }

  try {
    return await fetchDirect();
  } catch (_) {
    return null;
  }
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
    const res = await fetchDizibal(`/series?search=${encodeURIComponent(query.trim())}`, { timeout: 6500 });
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
      const res = await fetchDizibal(`/series/${slug}`, { timeout: 5500 });
      if (res) {
        const json = await res.json().catch(() => null);
        const resolvedTitle = json?.data?.title || json?.data?.name || json?.data?.name_tr || json?.data?.name_en || json?.data?.slug || '';
        if (json && json.success && json.data && json.data._id && isStrictMediaTitleMatch(resolvedTitle, [...candidateQueries])) {
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
        matchedSeries = results.find(item => {
          const candidateTitle = item.title || item.name || item.name_tr || item.name_en || item.slug || '';
          return isStrictMediaTitleMatch(candidateTitle, [...candidateQueries]);
        });
        if (matchedSeries) break;
      }
    }
  }

  if (!matchedSeries || !matchedSeries._id) return [];

  // Fetch season episodes
  try {
    const seasonRes = await fetchDizibal(`/series/${matchedSeries._id}/seasons/${sNum}`, { timeout: 6500 });
    if (!seasonRes) return [];
    const seasonJson = await seasonRes.json().catch(() => null);
    if (!seasonJson || !seasonJson.success || !seasonJson.data || !Array.isArray(seasonJson.data.episodes)) {
      return [];
    }

    const ep = seasonJson.data.episodes.find(e => parseInt(e.episode_number, 10) === epNum);
    if (!ep || !ep.src) return [];

    const srcCode = ep.src;

    const playerUrl = await resolveDizibalPlayer(srcCode)
      || `https://x.ag2m4.cfd/embed-${srcCode}.html?autoplay=1`;
    if (playerUrl) {
      sources.push({
        id: `dzb_player_s${sNum}e${epNum}`,
        name: isDub ? 'DP DiziBal Player (TR Dublaj)' : 'DP DiziBal Player (TR Altyazı)',
        displayName: 'DP DiziBal Player',
        streamUrl: playerUrl,
        url: playerUrl,
        subtitles: [],
        isHls: false,
        isDirectVideo: false,
        source: 'DP',
        badge: '🌐 DiziBal Orijinal Player'
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
        const resolvedTitle = json?.data?.title || json?.data?.title_tr || json?.data?.title_en || json?.data?.slug || '';
        if (json && json.success && json.data && json.data.src && isStrictMediaTitleMatch(resolvedTitle, [...candidateQueries])) {
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
        matchedMovie = results.find(item => {
          const candidateTitle = item.title || item.title_tr || item.title_en || item.slug || '';
          return isStrictMediaTitleMatch(candidateTitle, [...candidateQueries]);
        });
        if (matchedMovie) break;
      }
    }
  }

  if (!matchedMovie || !matchedMovie.src) return [];

  const srcCode = matchedMovie.src;

  const playerUrl = await resolveDizibalPlayer(srcCode)
    || `https://x.ag2m4.cfd/embed-${srcCode}.html?autoplay=1`;
  if (playerUrl) {
    sources.push({
      id: 'dzb_player_movie',
      name: isDub ? 'DP DiziBal Player (TR Dublaj)' : 'DP DiziBal Player (TR Altyazı)',
      displayName: 'DP DiziBal Player',
      streamUrl: playerUrl,
      url: playerUrl,
      subtitles: [],
      isHls: false,
      isDirectVideo: false,
      source: 'DP',
      badge: '🌐 DiziBal Orijinal Player'
    });
  }

  return sources;
}
