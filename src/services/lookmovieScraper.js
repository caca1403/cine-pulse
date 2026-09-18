/* ==========================================================================
   CinePulse Studio - LookMovie2.la Official Direct Video Extractor
   Extracts direct HLS (.m3u8) video streams and subtitles:
   - Zero iframe clutter or website UI
   - 100% Native CinePulse HTML5 Video Player playback
   - Integrated Turkish & English subtitles
   ========================================================================== */

const LOOKMOVIE_BASE = 'https://lookmovie2.la';

/**
 * Normalizes search query
 */
function cleanQuery(t) {
  if (!t) return '';
  return t
    .replace(/\s*-\s*S\d+E\d+.*$/i, '')
    .replace(/\s*-\s*S\d+.*$/i, '')
    .replace(/\s*\(\d{4}\).*/, '')
    .trim();
}

/**
 * Searches LookMovie2 catalog
 */
async function searchLookMovie(type, query) {
  if (!query) return null;
  const endpoint = type === 'tv'
    ? `${LOOKMOVIE_BASE}/api/v1/shows/do-search/?q=${encodeURIComponent(query)}`
    : `${LOOKMOVIE_BASE}/api/v1/movies/do-search/?q=${encodeURIComponent(query)}`;

  try {
    const isBrowser = typeof window !== 'undefined';
    const fetchUrl = isBrowser
      ? `/api/proxy?url=${encodeURIComponent(endpoint)}&ref=${encodeURIComponent('https://lookmovie2.la/')}`
      : endpoint;

    const res = await fetch(fetchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://lookmovie2.la/'
      },
      signal: AbortSignal.timeout(4500)
    });

    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    if (!data || !Array.isArray(data.result) || data.result.length === 0) return null;

    return data.result[0];
  } catch (_) {
    return null;
  }
}

/**
 * Fetches direct video stream & subtitles from LookMovie2
 */
export async function fetchOfficialLookMovieSources({
  type = 'movie',
  title = '',
  originalTitle = '',
  season = 1,
  episode = 1
} = {}) {
  const isMovie = type === 'movie';
  const sNum = parseInt(season, 10) || 1;
  const epNum = parseInt(episode, 10) || 1;

  const targetQuery = cleanQuery(title || originalTitle);
  if (!targetQuery) return [];

  const hit = await searchLookMovie(type, targetQuery);
  if (!hit || !hit.slug) return [];

  try {
    const isBrowser = typeof window !== 'undefined';
    const playPageUrl = isMovie
      ? `${LOOKMOVIE_BASE}/movies/play/${hit.slug}`
      : `${LOOKMOVIE_BASE}/shows/play/${hit.slug}`;

    const fetchPageUrl = isBrowser
      ? `/api/proxy?url=${encodeURIComponent(playPageUrl)}&ref=${encodeURIComponent('https://lookmovie2.la/')}`
      : playPageUrl;

    const pageRes = await fetch(fetchPageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://lookmovie2.la/'
      },
      signal: AbortSignal.timeout(5000)
    });

    if (!pageRes.ok) return [];
    const html = await pageRes.text();

    let accessUrl = null;

    if (isMovie) {
      const idMovieMatch = html.match(/id_movie:\s*(\d+)/);
      const hashMatch = html.match(/hash:\s*["']([^"']+)["']/);
      const expiresMatch = html.match(/expires:\s*(\d+)/);

      if (!idMovieMatch || !hashMatch || !expiresMatch) return [];
      accessUrl = `${LOOKMOVIE_BASE}/api/v1/security/movie-access?id_movie=${idMovieMatch[1]}&hash=${hashMatch[1]}&expires=${expiresMatch[1]}`;
    } else {
      const hashMatch = html.match(/hash:\s*["']([^"']+)["']/);
      const expiresMatch = html.match(/expires:\s*(\d+)/);
      if (!hashMatch || !expiresMatch) return [];

      let id_episode = null;
      // Extract seasons array from show_storage
      const seasonsStart = html.indexOf("seasons: [");
      const seasonsEnd = html.indexOf("]", seasonsStart);
      if (seasonsStart !== -1 && seasonsEnd !== -1) {
        const rawSeasons = html.substring(seasonsStart + 9, seasonsEnd + 1);
        try {
          const parsed = new Function('return ' + rawSeasons)();
          const target = parsed.find(e => String(e.season) === String(sNum) && String(e.episode) === String(epNum));
          if (target) id_episode = target.id_episode;
        } catch (_) {}
      }

      // Regex fallback if needed
      if (!id_episode) {
        const epRegex = new RegExp(`episode:\\s*["']?${epNum}["']?[\\s\\S]*?id_episode:\\s*(\\d+)[\\s\\S]*?season:\\s*["']?${sNum}["']?`, 'i');
        const epMatch = html.match(epRegex);
        if (epMatch) id_episode = epMatch[1];
      }

      if (!id_episode) return [];
      accessUrl = `${LOOKMOVIE_BASE}/api/v1/security/episode-access?id_episode=${id_episode}&hash=${hashMatch[1]}&expires=${expiresMatch[1]}`;
    }

    const fetchAccessUrl = isBrowser
      ? `/api/proxy?url=${encodeURIComponent(accessUrl)}&ref=${encodeURIComponent(playPageUrl)}`
      : accessUrl;

    const accessRes = await fetch(fetchAccessUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': playPageUrl
      },
      signal: AbortSignal.timeout(5000)
    });

    if (!accessRes.ok) return [];
    const accessData = await accessRes.json().catch(() => null);
    if (!accessData || !accessData.streams) return [];

    // Select best available video stream
    const streams = accessData.streams;
    const rawStreamUrl = streams['1080p'] || streams['1080'] || streams['720p'] || streams['720'] || streams['480p'] || streams['480'] || streams['auto'] || Object.values(streams).find(v => typeof v === 'string' && v.includes('.m3u8'));

    if (!rawStreamUrl) return [];

    // Proxy the HLS stream for direct player playback
    const finalStreamUrl = `/api/hls_proxy?url=${encodeURIComponent(rawStreamUrl)}&ref=${encodeURIComponent('https://lookmovie2.la/')}`;

    // Extract subtitles
    const subtitles = [];
    if (Array.isArray(accessData.subtitles)) {
      accessData.subtitles.forEach(sub => {
        if (!sub.file) return;
        const lang = (sub.language || '').toLowerCase();
        const isTr = lang.includes('turk') || sub.file.includes('tr_');
        const isEn = lang.includes('eng') || sub.file.includes('en_');
        if (isTr || isEn) {
          const subFileUrl = sub.file.startsWith('http') ? sub.file : `${LOOKMOVIE_BASE}${sub.file}`;
          subtitles.push({
            label: isTr ? 'Türkçe (LookMovie)' : 'English (LookMovie)',
            src: `/api/proxy?url=${encodeURIComponent(subFileUrl)}&ref=${encodeURIComponent('https://lookmovie2.la/')}`
          });
        }
      });
    }

    return [
      {
        id: `lookmovie_direct_${hit.id_show || hit.id_movie || hit.slug}_s${sNum}e${epNum}`,
        name: isMovie ? 'LookMovie HLS (1080p TR Altyazı)' : `LookMovie HLS S${sNum}B${epNum} (TR Altyazı)`,
        displayName: 'LookMovie HLS (1080p)',
        badge: '🎬 LookMovie Direct',
        source: 'LookMovie',
        url: finalStreamUrl,
        streamUrl: finalStreamUrl,
        quality: '1080p HD',
        isHls: true,
        isDirectVideo: true,
        category: 'subtitled',
        subtitles: subtitles,
        getUrl: () => finalStreamUrl
      }
    ];
  } catch (_) {
    return [];
  }
}
