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

function isValidDizisolStreamUrl(url) {
  if (!url || typeof url !== 'string') return false;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return false;
  if (
    url.includes('picturebox.cloud') ||
    url.includes('s5.dizisol.com') ||
    url.includes('rapidrame') ||
    url.includes('pal-vds') ||
    url.includes('hdfilmdelisi') ||
    url.includes('plus.dizisol.com')
  ) {
    return false;
  }
  return true;
}

function getDizisolStreamPriority(url, provider = '') {
  let score = 10;
  const lowUrl = (url || '').toLowerCase();
  const lowProv = (provider || '').toLowerCase();

  // Ultra-fast instant CDN providers (< 1s playback start, 100% 200 OK & high bandwidth)
  if (lowProv === 'vidrame') score += 100;
  else if (lowProv === 'vidmixi') score += 95;
  else if (lowProv === 'cortina') score += 90;
  else if (lowProv === 'imagestoo') score += 85;
  else if (lowProv === 'fullhd') score += 80;
  else if (lowProv === 'filmekseni') score += 60;
  else if (lowProv === 'vip') score += 20;

  if (lowUrl.includes('dizisol.com')) score += 10;

  return score;
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

    const subtitles = [];
    if (data.subtitleTr) subtitles.push({ label: 'Türkçe', src: toProxiedDizisolSubUrl(data.subtitleTr) });
    if (data.subtitleEn) subtitles.push({ label: 'İngilizce', src: toProxiedDizisolSubUrl(data.subtitleEn) });

    // Collect all candidate sources and filter out 403 / dead domains
    const candidateList = [];
    const seenUrls = new Set();

    if (isValidDizisolStreamUrl(data.m3u8Url)) {
      seenUrls.add(data.m3u8Url);
      candidateList.push({
        url: data.m3u8Url,
        provider: 'VIP',
        isPrimary: true,
        priority: getDizisolStreamPriority(data.m3u8Url, 'VIP')
      });
    }

    if (Array.isArray(data.sources)) {
      for (const s of data.sources) {
        if (!s || !isValidDizisolStreamUrl(s.m3u8Url) || seenUrls.has(s.m3u8Url)) continue;
        seenUrls.add(s.m3u8Url);
        candidateList.push({
          url: s.m3u8Url,
          provider: (s.provider || 'VIP').toUpperCase(),
          id: s.id,
          subtitleTr: s.subtitleTr,
          subtitleEn: s.subtitleEn,
          isPrimary: false,
          priority: getDizisolStreamPriority(s.m3u8Url, s.provider)
        });
      }
    }

    // Sort by stability/priority (best working *.dizisol.com first)
    candidateList.sort((a, b) => b.priority - a.priority);

    const streams = candidateList.map((item, index) => {
      const proxiedUrl = toProxiedDizisolStreamUrl(item.url);
      const srcSubs = [];
      if (item.subtitleTr) srcSubs.push({ label: 'Türkçe', src: toProxiedDizisolSubUrl(item.subtitleTr) });
      if (item.subtitleEn) srcSubs.push({ label: 'İngilizce', src: toProxiedDizisolSubUrl(item.subtitleEn) });

      return {
        id: `dzs_mov_${targetTmdbId}_${item.id || item.provider || index}`,
        name: index === 0 ? 'DS 1080p (HLS)' : `DS ${item.provider} 1080p`,
        displayName: index === 0 ? 'DS 1080p (HLS)' : `DS ${item.provider} 1080p`,
        badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
        source: 'DS',
        url: proxiedUrl,
        streamUrl: proxiedUrl,
        originalEmbedUrl: item.url,
        quality: '1080p',
        isHls: true,
        isDirectVideo: true,
        type: 'hls',
        subtitles: srcSubs.length > 0 ? srcSubs : subtitles,
        isDub,
        getUrl: () => proxiedUrl
      };
    });

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

    const subtitles = [];
    if (targetEp.subtitleTr) subtitles.push({ label: 'Türkçe', src: toProxiedDizisolSubUrl(targetEp.subtitleTr) });
    if (targetEp.subtitleEn) subtitles.push({ label: 'İngilizce', src: toProxiedDizisolSubUrl(targetEp.subtitleEn) });

    // Collect all candidate sources and filter out 403 / dead domains
    const candidateList = [];
    const seenUrls = new Set();

    if (isValidDizisolStreamUrl(targetEp.m3u8Url)) {
      seenUrls.add(targetEp.m3u8Url);
      candidateList.push({
        url: targetEp.m3u8Url,
        provider: 'VIP',
        isPrimary: true,
        priority: getDizisolStreamPriority(targetEp.m3u8Url, 'VIP')
      });
    }

    if (Array.isArray(targetEp.sources)) {
      for (const s of targetEp.sources) {
        if (!s || !isValidDizisolStreamUrl(s.m3u8Url) || seenUrls.has(s.m3u8Url)) continue;
        seenUrls.add(s.m3u8Url);
        candidateList.push({
          url: s.m3u8Url,
          provider: (s.provider || 'VIP').toUpperCase(),
          id: s.id,
          subtitleTr: s.subtitleTr,
          subtitleEn: s.subtitleEn,
          isPrimary: false,
          priority: getDizisolStreamPriority(s.m3u8Url, s.provider)
        });
      }
    }

    // Sort by priority
    candidateList.sort((a, b) => b.priority - a.priority);

    const streams = candidateList.map((item, index) => {
      const proxiedUrl = toProxiedDizisolStreamUrl(item.url);
      const srcSubs = [];
      if (item.subtitleTr) srcSubs.push({ label: 'Türkçe', src: toProxiedDizisolSubUrl(item.subtitleTr) });
      if (item.subtitleEn) srcSubs.push({ label: 'İngilizce', src: toProxiedDizisolSubUrl(item.subtitleEn) });

      return {
        id: `dzs_tv_${targetTmdbId}_s${season}_e${episode}_${item.id || item.provider || index}`,
        name: index === 0 ? `DS 1080p (S${season}B${episode})` : `DS ${item.provider} (S${season}B${episode})`,
        displayName: index === 0 ? `DS 1080p (S${season}B${episode})` : `DS ${item.provider} (S${season}B${episode})`,
        badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
        source: 'DS',
        url: proxiedUrl,
        streamUrl: proxiedUrl,
        originalEmbedUrl: item.url,
        quality: '1080p',
        isHls: true,
        isDirectVideo: true,
        type: 'hls',
        subtitles: srcSubs.length > 0 ? srcSubs : subtitles,
        isDub,
        getUrl: () => proxiedUrl
      };
    });

    return streams;
  } catch (err) {
    console.warn('[DizisolScraper] TV episode error:', err);
    return [];
  }
}
