/* ==========================================================================
   CinePulse Studio - Direct REST API Scraper (DiziBal)
   High-accuracy title & year matching to prevent wrong movie playback.
   ========================================================================== */

function normalizeText(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isTitleMatch(targetTitle, candidateObj, targetYear = null) {
  if (!targetTitle || !candidateObj) return false;

  const candidateTitles = [
    candidateObj.title,
    candidateObj.name,
    candidateObj.name_en,
    candidateObj.name_tr,
    candidateObj.original_name,
    candidateObj.display_title_tr,
    candidateObj.display_title_en,
    candidateObj.slug
  ].filter(Boolean);

  const candidateYear = candidateObj.year || (candidateObj.release_date || candidateObj.first_air_date || '').substring(0, 4) || null;
  const normTarget = normalizeText(targetTitle);
  if (!normTarget) return false;
  const targetWords = normTarget.split(/\s+/).filter(w => w.length > 0);

  return candidateTitles.some(cand => {
    const normCand = normalizeText(cand);
    if (!normCand) return false;

    if (normTarget === normCand) {
      if (targetYear && candidateYear) {
        return Math.abs(parseInt(targetYear, 10) - parseInt(candidateYear, 10)) <= 1;
      }
      return true;
    }

    const candWords = normCand.split(/\s+/).filter(w => w.length > 0);
    const allTargetInCand = targetWords.length > 0 && targetWords.every(w => candWords.includes(w));
    const allCandInTarget = candWords.length > 0 && candWords.every(w => targetWords.includes(w));

    if (allTargetInCand || allCandInTarget) {
      if (targetYear && candidateYear) {
        return Math.abs(parseInt(targetYear, 10) - parseInt(candidateYear, 10)) <= 1;
      }
      return true;
    }
    return false;
  });
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
          signal: AbortSignal.timeout(5000)
        }).catch(() => null);

        if (!searchRes || !searchRes.ok) continue;
        const searchJson = await searchRes.json().catch(() => null);
        const moviesList = searchJson?.data || [];
        if (moviesList.length === 0) continue;

        // Accurate match by title & year - NEVER blindly take moviesList[0]
        let targetMovie = moviesList.find(m => isTitleMatch(cleanQuery, m, year));
        if (!targetMovie) {
          targetMovie = moviesList.find(m => isTitleMatch(rawQuery, m, year));
        }

        if (!targetMovie) {
          continue;
        }

        const targetSlug = targetMovie.slug;

        const detailRes = await fetch(`${apiBase}/movies/${targetSlug}`, {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(5000)
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
          signal: AbortSignal.timeout(5000)
        }).catch(() => null);

        if (!searchRes || !searchRes.ok) continue;
        const searchJson = await searchRes.json().catch(() => null);
        const seriesList = searchJson?.data || [];
        if (seriesList.length === 0) continue;

        let targetSeries = seriesList.find(s => isTitleMatch(cleanQuery, s, year));
        if (!targetSeries) {
          targetSeries = seriesList.find(s => isTitleMatch(rawQuery, s, year));
        }

        if (!targetSeries) {
          continue;
        }

        const seriesSlug = targetSeries.slug;

        const seasonRes = await fetch(`${apiBase}/series/${seriesSlug}/seasons/${season}`, {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(5000)
        }).catch(() => null);

        if (!seasonRes || !seasonRes.ok) continue;
        const seasonJson = await seasonRes.json().catch(() => null);
        const episodes = seasonJson?.data?.episodes || [];

        const targetEp = episodes.find(e => e.episode_number === parseInt(episode, 10));

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
