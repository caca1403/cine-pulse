/* ==========================================================================
   SineFlix Pro - Direct REST API Scraper (Anonymous Server Labels)
   Supports multi-alias searches (English, Romaji, Turkish, TMDB)
   ========================================================================== */

export async function fetchDiziBalSources({ titles = [], type = 'movie', seriesTitle = '', title = '', originalTitle = '', season = 1, episode = 1, isDub = true }) {
  const isBrowser = typeof window !== 'undefined';
  const apiBase = isBrowser ? '/api/dbl' : 'https://dizibal.com/api';
  const isMovie = type === 'movie';

  const candidateQueries = [...new Set([
    ...titles,
    seriesTitle,
    title,
    originalTitle
  ])].filter(t => t && typeof t === 'string' && t.trim().length > 1);

  if (candidateQueries.length === 0) return [];

  for (const rawQuery of candidateQueries) {
    const cleanQuery = rawQuery.replace(/\s*\(\d{4}\).*/, '').trim();
    if (!cleanQuery) continue;

    try {
      if (isMovie) {
        const searchRes = await fetch(`${apiBase}/movies?search=${encodeURIComponent(cleanQuery)}`, {
          headers: { 'Accept': 'application/json' }
        }).catch(() => null);

        if (!searchRes || !searchRes.ok) continue;
        const searchJson = await searchRes.json().catch(() => null);
        const moviesList = searchJson?.data || [];
        if (moviesList.length === 0) continue;

        const normTarget = cleanQuery.toLowerCase().replace(/[^a-z0-9]/g, '');
        let targetMovie = moviesList.find(m => (m.title || '').toLowerCase().replace(/[^a-z0-9]/g, '') === normTarget);
        if (!targetMovie) {
          targetMovie = moviesList.find(m => (m.slug || '').toLowerCase().includes(normTarget));
        }
        if (!targetMovie) targetMovie = moviesList[0];
        const targetSlug = targetMovie.slug;

        const detailRes = await fetch(`${apiBase}/movies/${targetSlug}`, {
          headers: { 'Accept': 'application/json' }
        }).catch(() => null);

        if (!detailRes || !detailRes.ok) continue;
        const detailJson = await detailRes.json().catch(() => null);
        const movieData = detailJson?.data;
        if (!movieData) continue;

        const srcId = movieData.src || (movieData.streamUrl ? movieData.streamUrl.match(/embed-([^.]+)/)?.[1] : null);
        if (srcId) {
          const embedUrl = movieData.streamUrl || `https://x.ag2m4.cfd/embed-${srcId}.html`;

          return [
            {
              id: `dbl_${movieData.slug || 'movie'}`,
              name: `VIP Stream (${isDub ? 'Dublaj 1080p' : 'Altyazılı'})`,
              badge: '⚡ VIP 1080p',
              isHls: false,
              isDirectVideo: false,
              getUrl: () => embedUrl,
              streamUrl: embedUrl,
              url: embedUrl
            }
          ];
        }
      } else {
        const searchRes = await fetch(`${apiBase}/series?search=${encodeURIComponent(cleanQuery)}`, {
          headers: { 'Accept': 'application/json' }
        }).catch(() => null);

        if (!searchRes || !searchRes.ok) continue;
        const searchJson = await searchRes.json().catch(() => null);
        const seriesList = searchJson?.data || [];
        if (seriesList.length === 0) continue;

        const seriesSlug = seriesList[0].slug;

        const seasonRes = await fetch(`${apiBase}/series/${seriesSlug}/seasons/${season}`, {
          headers: { 'Accept': 'application/json' }
        }).catch(() => null);

        if (!seasonRes || !seasonRes.ok) continue;
        const seasonJson = await seasonRes.json().catch(() => null);
        const episodes = seasonJson?.data?.episodes || [];

        const targetEp = episodes.find(e => e.episode_number === parseInt(episode, 10)) || episodes[0];

        if (targetEp && targetEp.src) {
          const embedUrl = `https://x.ag2m4.cfd/embed-${targetEp.src}.html`;

          return [
            {
              id: `dbl_${seriesSlug}_s${season}_e${episode}`,
              name: `VIP Stream (S${season}:E${episode} ${isDub ? 'Dublaj HD' : 'Altyazılı'})`,
              badge: '⚡ VIP 1080p',
              isHls: false,
              isDirectVideo: false,
              getUrl: () => embedUrl,
              streamUrl: embedUrl,
              url: embedUrl
            }
          ];
        }
      }
    } catch (err) {
      console.warn('[DiziBalScraper] Search error:', err);
    }
  }

  return [];
}
