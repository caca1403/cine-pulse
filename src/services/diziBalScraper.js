/* ==========================================================================
   CinePulse Studio - Direct REST API Scraper (DiziBal)
   High-accuracy title & year matching to prevent wrong movie playback.
   ========================================================================== */

function isTitleMatch(targetTitle, candidateTitle, targetYear = null, candidateYear = null) {
  if (!targetTitle || !candidateTitle) return false;
  
  const normTarget = targetTitle.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
  const normCand = candidateTitle.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
  
  if (normTarget === normCand) return true;
  
  const targetWords = normTarget.split(/\s+/).filter(w => w.length > 1);
  const candWords = normCand.split(/\s+/).filter(w => w.length > 1);
  
  const matchCount = targetWords.filter(w => candWords.includes(w)).length;
  const ratio = matchCount / Math.max(targetWords.length, 1);
  
  if (ratio >= 0.75) {
    if (targetYear && candidateYear) {
      return Math.abs(parseInt(targetYear, 10) - parseInt(candidateYear, 10)) <= 1;
    }
    return true;
  }
  return false;
}

export async function fetchDiziBalSources({ titles = [], type = 'movie', seriesTitle = '', title = '', originalTitle = '', year = null, season = 1, episode = 1, isDub = true }) {
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
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(2000)
        }).catch(() => null);

        if (!searchRes || !searchRes.ok) continue;
        const searchJson = await searchRes.json().catch(() => null);
        const moviesList = searchJson?.data || [];
        if (moviesList.length === 0) continue;

        // Accurate match by title & year - NEVER blindly take moviesList[0]
        let targetMovie = moviesList.find(m => isTitleMatch(cleanQuery, m.title || m.name || m.slug, year, m.year || m.release_date));
        if (!targetMovie) {
          targetMovie = moviesList.find(m => isTitleMatch(rawQuery, m.title || m.name || m.slug, year, m.year || m.release_date));
        }

        if (!targetMovie) {
          continue;
        }

        const targetSlug = targetMovie.slug;

        const detailRes = await fetch(`${apiBase}/movies/${targetSlug}`, {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(2000)
        }).catch(() => null);

        if (!detailRes || !detailRes.ok) continue;
        const detailJson = await detailRes.json().catch(() => null);
        const movieData = detailJson?.data;
        if (!movieData) continue;

        const srcId = movieData.src || (movieData.streamUrl ? movieData.streamUrl.match(/embed-([^.]+)/)?.[1] : null);
        if (srcId) {
          const embedUrl = (movieData.streamUrl ? movieData.streamUrl.replace(/play\.liderfilm\.[a-z]+/i, 'x.ag2m4.cfd') : null) || `https://x.ag2m4.cfd/embed-${srcId}.html`;

          return [
            {
              id: `dbl_${movieData.slug || 'movie'}`,
              name: `Alpha Stream 1080p`,
              displayName: `Alpha Stream 1080p`,
              badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
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
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(2000)
        }).catch(() => null);

        if (!searchRes || !searchRes.ok) continue;
        const searchJson = await searchRes.json().catch(() => null);
        const seriesList = searchJson?.data || [];
        if (seriesList.length === 0) continue;

        let targetSeries = seriesList.find(s => isTitleMatch(cleanQuery, s.title || s.name || s.slug, year, s.year || s.first_air_date));
        if (!targetSeries) {
          targetSeries = seriesList.find(s => isTitleMatch(rawQuery, s.title || s.name || s.slug, year, s.year || s.first_air_date));
        }

        if (!targetSeries) {
          continue;
        }

        const seriesSlug = targetSeries.slug;

        const seasonRes = await fetch(`${apiBase}/series/${seriesSlug}/seasons/${season}`, {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(2000)
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
              name: `Alpha Stream 1080p`,
              displayName: `Alpha Stream 1080p`,
              badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
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
