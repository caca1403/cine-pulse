/* ==========================================================================
   CinePulse Studio - LookMovie2.la Official Scraper
   Direct access to the real, official lookmovie2.la streaming player:
   - Movies: https://lookmovie2.la/movies/play/{slug}
   - TV Series: https://lookmovie2.la/shows/play/{slug}#s{season}-e{episode}
   ========================================================================== */

const LOOKMOVIE_BASE = 'https://lookmovie2.la';

/**
 * Normalizes title for search query
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
 * Searches lookmovie2.la official catalog
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

    // Pick closest match
    return data.result[0];
  } catch (_) {
    return null;
  }
}

/**
 * Fetches official LookMovie2.la stream source
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

  const streamUrl = isMovie
    ? `${LOOKMOVIE_BASE}/movies/play/${hit.slug}`
    : `${LOOKMOVIE_BASE}/shows/play/${hit.slug}#s${sNum}-e${epNum}`;

  return [
    {
      id: `lookmovie_official_${hit.id_show || hit.id_movie || hit.slug}_s${sNum}e${epNum}`,
      name: isMovie ? 'LookMovie2 Resmi (1080p)' : `LookMovie2 Resmi S${sNum}B${epNum}`,
      displayName: 'LookMovie2 Resmi (1080p)',
      badge: '🎬 LookMovie Resmi',
      source: 'LookMovie2',
      url: streamUrl,
      streamUrl: streamUrl,
      quality: '1080p HD',
      isHls: false,
      isDirectVideo: false,
      category: 'subtitled',
      type: 'embed',
      getUrl: () => streamUrl
    }
  ];
}
