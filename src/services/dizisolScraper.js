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

function toProxiedDizisolStreamUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const isBrowser = typeof window !== 'undefined';
  if (isBrowser) {
    return `/api/hls_proxy?url=${encodeURIComponent(rawUrl)}&ref=${encodeURIComponent('https://dizisol.com/')}`;
  }
  return rawUrl;
}

function toProxiedDizisolSubUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const isBrowser = typeof window !== 'undefined';
  if (isBrowser && rawUrl.includes('dizisol.com')) {
    return `/api/hls_proxy?url=${encodeURIComponent(rawUrl)}&ref=${encodeURIComponent('https://dizisol.com/')}`;
  }
  return rawUrl;
}

function isDizisolDubbed(item, s) {
  const combined = `${item?.title || ''} ${item?.titleTr || ''} ${item?.seriesName || ''} ${item?.sourceUrl || ''} ${s?.provider || ''} ${s?.sourceUrl || ''} ${s?.m3u8Url || ''}`.toLowerCase();
  return combined.includes('dublaj') || 
         combined.includes('trdub') || 
         combined.includes('tr-dub') || 
         combined.includes('turkce dub') || 
         combined.includes('türkçe dub') || 
         combined.includes('dual audio') ||
         combined.includes('dual-ses');
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
    if (data.subtitleTr) subtitles.push({ label: 'Türkçe', src: toProxiedDizisolSubUrl(data.subtitleTr) });
    if (data.subtitleEn) subtitles.push({ label: 'İngilizce', src: toProxiedDizisolSubUrl(data.subtitleEn) });

    const isPrimaryDubbed = isDizisolDubbed(data, null);

    // Primary HLS Stream
    if (data.m3u8Url && data.m3u8Url.startsWith('http')) {
      const shouldAddPrimary = isDub ? isPrimaryDubbed : (!isPrimaryDubbed || subtitles.length > 0);
      if (shouldAddPrimary) {
        const proxiedUrl = toProxiedDizisolStreamUrl(data.m3u8Url);
        streams.push({
          id: `dzs_mov_${targetTmdbId}_primary`,
          name: isPrimaryDubbed ? 'DS 1080p (TR Dublaj)' : 'DS 1080p (TR Altyazı)',
          displayName: 'DS 1080p (HLS)',
          badge: isPrimaryDubbed ? '⚡ TR Dublaj' : '💬 TR Altyazı',
          source: 'DS',
          url: proxiedUrl,
          streamUrl: proxiedUrl,
          originalEmbedUrl: data.m3u8Url,
          quality: '1080p',
          isHls: true,
          isDirectVideo: true,
          type: 'hls',
          subtitles,
          isDub: isPrimaryDubbed,
          getUrl: () => proxiedUrl
        });
      }
    }

    // Additional sources from Dizisol
    if (Array.isArray(data.sources)) {
      for (const s of data.sources) {
        if (!s || !s.m3u8Url || !s.m3u8Url.startsWith('http') || s.m3u8Url === data.m3u8Url) continue;
        const isSrcDubbed = isDizisolDubbed(data, s);
        if (isDub && !isSrcDubbed) continue;
        if (!isDub && isSrcDubbed && !s.subtitleTr && !s.subtitleEn) continue;

        const providerName = (s.provider || 'VIP').toUpperCase();
        const srcSubs = [];
        if (s.subtitleTr) srcSubs.push({ label: 'Türkçe', src: toProxiedDizisolSubUrl(s.subtitleTr) });
        if (s.subtitleEn) srcSubs.push({ label: 'İngilizce', src: toProxiedDizisolSubUrl(s.subtitleEn) });

        const proxiedUrl = toProxiedDizisolStreamUrl(s.m3u8Url);
        streams.push({
          id: `dzs_mov_${targetTmdbId}_${s.id || s.provider || Math.random().toString(36).substring(7)}`,
          name: isSrcDubbed ? `DS ${providerName} (TR Dublaj)` : `DS ${providerName} 1080p`,
          displayName: `DS ${providerName} 1080p`,
          badge: isSrcDubbed ? '⚡ TR Dublaj' : '💬 TR Altyazı',
          source: 'DS',
          url: proxiedUrl,
          streamUrl: proxiedUrl,
          originalEmbedUrl: s.m3u8Url,
          quality: '1080p',
          isHls: true,
          isDirectVideo: true,
          type: 'hls',
          subtitles: srcSubs.length > 0 ? srcSubs : subtitles,
          isDub: isSrcDubbed,
          getUrl: () => proxiedUrl
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
    if (targetEp.subtitleTr) subtitles.push({ label: 'Türkçe', src: toProxiedDizisolSubUrl(targetEp.subtitleTr) });
    if (targetEp.subtitleEn) subtitles.push({ label: 'İngilizce', src: toProxiedDizisolSubUrl(targetEp.subtitleEn) });

    const isPrimaryDubbed = isDizisolDubbed(targetEp, null);

    // Primary HLS Stream
    if (targetEp.m3u8Url && targetEp.m3u8Url.startsWith('http')) {
      const shouldAddPrimary = isDub ? isPrimaryDubbed : (!isPrimaryDubbed || subtitles.length > 0);
      if (shouldAddPrimary) {
        const proxiedUrl = toProxiedDizisolStreamUrl(targetEp.m3u8Url);
        streams.push({
          id: `dzs_tv_${targetTmdbId}_s${season}_e${episode}_primary`,
          name: isPrimaryDubbed ? `DS 1080p (TR Dublaj)` : `DS 1080p (S${season}B${episode})`,
          displayName: `DS 1080p (S${season}B${episode})`,
          badge: isPrimaryDubbed ? '⚡ TR Dublaj' : '💬 TR Altyazı',
          source: 'DS',
          url: proxiedUrl,
          streamUrl: proxiedUrl,
          originalEmbedUrl: targetEp.m3u8Url,
          quality: '1080p',
          isHls: true,
          isDirectVideo: true,
          type: 'hls',
          subtitles,
          isDub: isPrimaryDubbed,
          getUrl: () => proxiedUrl
        });
      }
    }

    // Additional sources for the episode
    if (Array.isArray(targetEp.sources)) {
      for (const s of targetEp.sources) {
        if (!s || !s.m3u8Url || !s.m3u8Url.startsWith('http') || s.m3u8Url === targetEp.m3u8Url) continue;
        const isSrcDubbed = isDizisolDubbed(targetEp, s);
        if (isDub && !isSrcDubbed) continue;
        if (!isDub && isSrcDubbed && !s.subtitleTr && !s.subtitleEn) continue;

        const providerName = (s.provider || 'VIP').toUpperCase();
        const srcSubs = [];
        if (s.subtitleTr) srcSubs.push({ label: 'Türkçe', src: toProxiedDizisolSubUrl(s.subtitleTr) });
        if (s.subtitleEn) srcSubs.push({ label: 'İngilizce', src: toProxiedDizisolSubUrl(s.subtitleEn) });

        const proxiedUrl = toProxiedDizisolStreamUrl(s.m3u8Url);
        streams.push({
          id: `dzs_tv_${targetTmdbId}_s${season}_e${episode}_${s.id || s.provider || Math.random().toString(36).substring(7)}`,
          name: isSrcDubbed ? `DS ${providerName} (TR Dublaj)` : `DS ${providerName} (S${season}B${episode})`,
          displayName: `DS ${providerName} (S${season}B${episode})`,
          badge: isSrcDubbed ? '⚡ TR Dublaj' : '💬 TR Altyazı',
          source: 'DS',
          url: proxiedUrl,
          streamUrl: proxiedUrl,
          originalEmbedUrl: s.m3u8Url,
          quality: '1080p',
          isHls: true,
          isDirectVideo: true,
          type: 'hls',
          subtitles: srcSubs.length > 0 ? srcSubs : subtitles,
          isDub: isSrcDubbed,
          getUrl: () => proxiedUrl
        });
      }
    }

    return streams;
  } catch (err) {
    console.warn('[DizisolScraper] TV episode error:', err);
    return [];
  }
}
