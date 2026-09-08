/* ==========================================================================
   CinePulse Studio - Dizisol Scraper (Movies & TV Series Engine)
   Direct high-speed HLS (.m3u8) streams with Dual-Audio & Subtitles from Dizisol
   Supports instant TMDB lookup & keyword search.
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';
const DIZISOL_API_BASE = 'https://dizisol.com/api';

async function fetchDizisolApi(endpoint, options = {}) {
  const isBrowser = typeof window !== 'undefined';
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // 1. Direct fetch (Dizisol Express API supports direct CORS)
  try {
    const directUrl = `${DIZISOL_API_BASE}${cleanEndpoint}`;
    const res = await fetch(directUrl, {
      ...options,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        ...(options.headers || {})
      },
      signal: AbortSignal.timeout(options.timeout || 3500)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  // 2. Vercel / Local proxy fallback
  if (isBrowser) {
    try {
      const proxyUrl = `/api/dzs${cleanEndpoint}`;
      const res = await fetch(proxyUrl, {
        ...options,
        signal: AbortSignal.timeout(options.timeout || 3500)
      }).catch(() => null);
      if (res && res.ok) return res;
    } catch (_) {}
  }

  // 3. Cloudflare Worker fallback
  try {
    const workerUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(`${DIZISOL_API_BASE}${cleanEndpoint}`)}`;
    const res = await fetch(workerUrl, {
      ...options,
      signal: AbortSignal.timeout(options.timeout || 4000)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  return null;
}

/**
 * Searches Dizisol catalog by query
 */
export async function searchDizisol(query) {
  if (!query || typeof query !== 'string' || query.trim().length < 2) return [];

  try {
    const res = await fetchDizisolApi(`/movies/search?q=${encodeURIComponent(query.trim())}`, { timeout: 3500 });
    if (!res) return [];
    const data = await res.json().catch(() => null);
    return Array.isArray(data) ? data : [];
  } catch (_) {
    return [];
  }
}

/**
 * Extracts Movie streams from Dizisol
 */
export async function fetchDizisolMovieSources({
  titles = [],
  title = '',
  originalTitle = '',
  tmdbId = null,
  isDub = true
}) {
  try {
    let targetTmdbId = tmdbId ? Number(tmdbId) : null;

    if (!targetTmdbId) {
      const candidates = [...new Set([...titles, title, originalTitle])].filter(t => t && t.trim().length > 1);
      for (const q of candidates) {
        const results = await searchDizisol(q);
        const match = results.find(r => r.type === 'movie');
        if (match && match.tmdbId) {
          targetTmdbId = Number(match.tmdbId);
          break;
        }
      }
    }

    if (!targetTmdbId) return [];

    const res = await fetchDizisolApi(`/movies/by-tmdb/${targetTmdbId}`, { timeout: 4000 });
    if (!res) return [];

    const data = await res.json().catch(() => null);
    if (!data) return [];

    const streams = [];
    const subtitles = [];
    if (data.subtitleTr) subtitles.push({ label: 'Türkçe', src: data.subtitleTr });
    if (data.subtitleEn) subtitles.push({ label: 'İngilizce', src: data.subtitleEn });

    // Primary HLS Stream
    if (data.m3u8Url && data.m3u8Url.startsWith('http')) {
      streams.push({
        id: `dzs_mov_${targetTmdbId}_primary`,
        name: 'Dizisol 1080p (HLS)',
        displayName: 'Dizisol 1080p (HLS)',
        badge: isDub ? '⚡ TR Dublaj (Dual)' : '💬 TR Altyazı',
        source: 'Dizisol',
        url: data.m3u8Url,
        streamUrl: data.m3u8Url,
        quality: '1080p',
        isHls: true,
        isDirectVideo: true,
        type: 'hls',
        subtitles,
        isDub,
        getUrl: () => data.m3u8Url
      });
    }

    // Additional sources from Dizisol
    if (Array.isArray(data.sources)) {
      for (const s of data.sources) {
        if (!s || !s.m3u8Url || !s.m3u8Url.startsWith('http') || s.m3u8Url === data.m3u8Url) continue;
        const providerName = (s.provider || 'VIP').toUpperCase();
        const srcSubs = [];
        if (s.subtitleTr) srcSubs.push({ label: 'Türkçe', src: s.subtitleTr });
        if (s.subtitleEn) srcSubs.push({ label: 'İngilizce', src: s.subtitleEn });

        streams.push({
          id: `dzs_mov_${targetTmdbId}_${s.id || s.provider || Math.random().toString(36).substring(7)}`,
          name: `Dizisol ${providerName} 1080p`,
          displayName: `Dizisol ${providerName} 1080p`,
          badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
          source: 'Dizisol',
          url: s.m3u8Url,
          streamUrl: s.m3u8Url,
          quality: '1080p',
          isHls: true,
          isDirectVideo: true,
          type: 'hls',
          subtitles: srcSubs.length > 0 ? srcSubs : subtitles,
          isDub,
          getUrl: () => s.m3u8Url
        });
      }
    }

    return streams;
  } catch (err) {
    console.warn('[DizisolScraper] Movie error:', err);
    return [];
  }
}

/**
 * Extracts TV Episode streams from Dizisol
 */
export async function fetchDizisolEpisodeSources({
  titles = [],
  seriesTitle = '',
  originalTitle = '',
  season = 1,
  episode = 1,
  tmdbId = null,
  isDub = true
}) {
  try {
    let targetTmdbId = tmdbId ? Number(tmdbId) : null;

    if (!targetTmdbId) {
      const candidates = [...new Set([...titles, seriesTitle, originalTitle])].filter(t => t && t.trim().length > 1);
      for (const q of candidates) {
        const results = await searchDizisol(q);
        const match = results.find(r => r.type === 'tv');
        if (match && match.tmdbId) {
          targetTmdbId = Number(match.tmdbId);
          break;
        }
      }
    }

    if (!targetTmdbId) return [];

    const res = await fetchDizisolApi(`/movies/by-tmdb/${targetTmdbId}/episodes`, { timeout: 4500 });
    if (!res) return [];

    const episodes = await res.json().catch(() => null);
    if (!Array.isArray(episodes) || episodes.length === 0) return [];

    const targetEp = episodes.find(e => Number(e.season) === Number(season) && Number(e.episode) === Number(episode));
    if (!targetEp) return [];

    const streams = [];
    const subtitles = [];
    if (targetEp.subtitleTr) subtitles.push({ label: 'Türkçe', src: targetEp.subtitleTr });
    if (targetEp.subtitleEn) subtitles.push({ label: 'İngilizce', src: targetEp.subtitleEn });

    // Primary HLS Stream
    if (targetEp.m3u8Url && targetEp.m3u8Url.startsWith('http')) {
      streams.push({
        id: `dzs_tv_${targetTmdbId}_s${season}_e${episode}_primary`,
        name: `Dizisol 1080p (S${season}B${episode})`,
        displayName: `Dizisol 1080p (S${season}B${episode})`,
        badge: isDub ? '⚡ TR Dublaj (Dual)' : '💬 TR Altyazı',
        source: 'Dizisol',
        url: targetEp.m3u8Url,
        streamUrl: targetEp.m3u8Url,
        quality: '1080p',
        isHls: true,
        isDirectVideo: true,
        type: 'hls',
        subtitles,
        isDub,
        getUrl: () => targetEp.m3u8Url
      });
    }

    // Additional sources for the episode
    if (Array.isArray(targetEp.sources)) {
      for (const s of targetEp.sources) {
        if (!s || !s.m3u8Url || !s.m3u8Url.startsWith('http') || s.m3u8Url === targetEp.m3u8Url) continue;
        const providerName = (s.provider || 'VIP').toUpperCase();
        const srcSubs = [];
        if (s.subtitleTr) srcSubs.push({ label: 'Türkçe', src: s.subtitleTr });
        if (s.subtitleEn) srcSubs.push({ label: 'İngilizce', src: s.subtitleEn });

        streams.push({
          id: `dzs_tv_${targetTmdbId}_s${season}_e${episode}_${s.id || s.provider || Math.random().toString(36).substring(7)}`,
          name: `Dizisol ${providerName} (S${season}B${episode})`,
          displayName: `Dizisol ${providerName} (S${season}B${episode})`,
          badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
          source: 'Dizisol',
          url: s.m3u8Url,
          streamUrl: s.m3u8Url,
          quality: '1080p',
          isHls: true,
          isDirectVideo: true,
          type: 'hls',
          subtitles: srcSubs.length > 0 ? srcSubs : subtitles,
          isDub,
          getUrl: () => s.m3u8Url
        });
      }
    }

    return streams;
  } catch (err) {
    console.warn('[DizisolScraper] TV episode error:', err);
    return [];
  }
}
