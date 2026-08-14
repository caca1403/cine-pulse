/* ==========================================================================
   SineFlix Pro - Direct REST API Scraper (Anonymous Server Labels)
   ========================================================================== */

export async function fetchDiziBalSources({ type = 'movie', seriesTitle = '', title = '', originalTitle = '', season = 1, episode = 1, isDub = true }) {
  const targetTitle = seriesTitle || title;
  if (!targetTitle && !originalTitle) return [];

  const isBrowser = typeof window !== 'undefined';
  const apiBase = isBrowser ? '/api/dbl' : 'https://dizibal.com/api';
  const isMovie = type === 'movie';

  const searchQuery = targetTitle || originalTitle;
  const cleanQuery = searchQuery.replace(/\s*\(\d{4}\).*/, '').trim();

  try {
    if (isMovie) {
      const searchRes = await fetch(`${apiBase}/movies?search=${encodeURIComponent(cleanQuery)}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!searchRes.ok) return [];
      const searchJson = await searchRes.json();
      const moviesList = searchJson.data || [];
      if (moviesList.length === 0) return [];

      const normTarget = cleanQuery.toLowerCase().replace(/[^a-z0-9]/g, '');
      let targetMovie = moviesList.find(m => (m.title || '').toLowerCase().replace(/[^a-z0-9]/g, '') === normTarget);
      if (!targetMovie) {
        targetMovie = moviesList.find(m => (m.slug || '').toLowerCase().includes(normTarget));
      }
      if (!targetMovie) targetMovie = moviesList[0];
      const targetSlug = targetMovie.slug;

      const detailRes = await fetch(`${apiBase}/movies/${targetSlug}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!detailRes.ok) return [];
      const detailJson = await detailRes.json();
      const movieData = detailJson.data;
      if (!movieData) return [];

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
      });

      if (!searchRes.ok) return [];
      const searchJson = await searchRes.json();
      const seriesList = searchJson.data || [];
      if (seriesList.length === 0) return [];

      const seriesSlug = seriesList[0].slug;

      const seasonRes = await fetch(`${apiBase}/series/${seriesSlug}/seasons/${season}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!seasonRes.ok) return [];
      const seasonJson = await seasonRes.json();
      const episodes = seasonJson.data?.episodes || [];

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
    console.error('API Scraper Error:', err);
  }

  return [];
}
