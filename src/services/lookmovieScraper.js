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
      signal: AbortSignal.timeout(5000)
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

  // Try title, fallback to originalTitle
  let hit = null;
  const candidates = [cleanQuery(title), cleanQuery(originalTitle)].filter(Boolean);
  for (const q of candidates) {
    hit = await searchLookMovie(type, q);
    if (hit && hit.slug) break;
  }

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
      signal: AbortSignal.timeout(5500)
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
      // Multi-season robust matching: scan object blocks for matching season and episode
      const blocks = html.split('{');
      for (const block of blocks) {
        if (
          (block.includes(`episode: '${epNum}'`) || block.includes(`episode: "${epNum}"`)) &&
          (block.includes(`season: '${sNum}'`) || block.includes(`season: "${sNum}"`))
        ) {
          const match = block.match(/id_episode:\s*(\d+)/);
          if (match) {
            id_episode = match[1];
            break;
          }
        }
      }

      // Regex fallback
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
      signal: AbortSignal.timeout(5500)
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

    // Extract subtitles safely (handles both string files and array formats without throwing)
    const subtitles = [];
    if (Array.isArray(accessData.subtitles)) {
      accessData.subtitles.forEach(sub => {
        if (!sub || !sub.file) return;
        const lang = (sub.language || '').toLowerCase();
        const isTr = lang.includes('turk') || (typeof sub.file === 'string' && sub.file.includes('tr_'));
        const isEn = lang.includes('eng') || (typeof sub.file === 'string' && sub.file.includes('en_'));
        if (isTr || isEn) {
          let subFileUrl = '';
          if (typeof sub.file === 'string') {
            subFileUrl = sub.file.startsWith('http') ? sub.file : `${LOOKMOVIE_BASE}${sub.file}`;
          }
          if (subFileUrl) {
            subtitles.push({
              label: isTr ? 'Türkçe (LookMovie)' : 'English (LookMovie)',
              src: `/api/proxy?url=${encodeURIComponent(subFileUrl)}&ref=${encodeURIComponent('https://lookmovie2.la/')}`
            });
          }
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
