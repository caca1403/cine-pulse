/* ==========================================================================
   CinePulse Studio - HDFilmCehennemi Scraper & Direct Stream Engine
   Extracts direct 1080p HLS streams and official Turkish subtitles
   Bypasses Cloudflare & SAMEORIGIN without 403 Forbidden errors
   ========================================================================== */

export async function fetchHdfilmcehennemiSources({
  type = 'movie',
  tmdbId = null,
  imdbId = null,
  title = '',
  originalTitle = '',
  season = 1,
  episode = 1
} = {}) {
  const query = title || originalTitle;
  if (!query) return [];

  const sNum = parseInt(season, 10) || 1;
  const epNum = parseInt(episode, 10) || 1;
  const isMovie = type === 'movie';

  try {
    const searchTitle = cleanTitle(query);
    const searchOriginal = cleanTitle(originalTitle);

    const apiUrl = `/api/hdfc_stream?query=${encodeURIComponent(searchTitle)}&originalTitle=${encodeURIComponent(searchOriginal)}&tmdbId=${tmdbId || ''}&imdbId=${imdbId || ''}&season=${sNum}&episode=${epNum}`;
    
    const res = await fetch(apiUrl, {
      signal: AbortSignal.timeout(9000)
    }).catch(() => null);

    if (!res || !res.ok) return [];

    const data = await res.json().catch(() => null);
    if (!data || !data.success || !data.streamUrl) return [];

    const sources = [];

    // Process subtitle tracks
    const subs = [];
    if (Array.isArray(data.subtitles)) {
      for (const sub of data.subtitles) {
        if (sub.src) {
          subs.push({
            label: sub.label || 'Türkçe (HDFC)',
            src: sub.src
          });
        }
      }
    }

    // Add fallback OpenSubtitles if no Turkish sub present
    const hasTr = subs.some(s => (s.label || '').toLowerCase().includes('türk') || (s.label || '').toLowerCase().includes('tr'));
    if (!hasTr && (imdbId || tmdbId)) {
      const defaultSubUrl = isMovie
        ? `/api/subtitles?imdbId=${imdbId || tmdbId}&type=movie`
        : `/api/subtitles?imdbId=${imdbId || tmdbId}&season=${sNum}&episode=${epNum}&type=tv`;
      subs.unshift({ label: 'OpenSubtitles (Türkçe)', src: defaultSubUrl });
    }

    sources.push({
      id: `hdfc_${tmdbId || 'q'}_${isMovie ? 'movie' : `s${sNum}e${epNum}`}`,
      name: isMovie ? 'HDFilmCehennemi VIP (1080p HLS)' : `HDFilmCehennemi S${sNum}B${epNum}`,
      displayName: 'HDFilmCehennemi (1080p)',
      badge: '🔥 HDFC 1080p HLS',
      source: 'HDFilmCehennemi',
      url: data.streamUrl,
      streamUrl: data.streamUrl,
      rawStreamUrl: data.rawStreamUrl,
      movieUrl: data.movieUrl,
      quality: '1080p HD',
      isHls: true,
      isDirectVideo: true,
      category: 'subtitled',
      type: 'direct',
      subtitles: subs,
      getUrl: () => data.streamUrl
    });

    return sources;
  } catch (err) {
    console.warn('[HDFilmCehennemi Scraper] Failed to resolve:', err?.message);
    return [];
  }
}

function cleanTitle(raw) {
  if (!raw) return '';
  return raw
    .replace(/\s*-\s*S\d+E\d+.*$/i, '')
    .replace(/\s*-\s*S\d+.*$/i, '')
    .replace(/\s*-\s*\d+\.\s*Sezon.*$/i, '')
    .replace(/\s*\(\d{4}\).*/, '')
    .trim();
}
