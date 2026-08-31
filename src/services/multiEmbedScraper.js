/* ==========================================================================
   CinePulse Studio - Videasy Ultra Scraper (Universal TMDB Embed)
   Supports OpenSubtitles Turkish Subtitle integration for all Movies & Series
   ========================================================================== */

export async function fetchMultiEmbedSources({
  type = 'movie',
  tmdbId,
  season = 1,
  episode = 1,
  isDub = false
}) {
  if (!tmdbId) return [];

  const isMovie = type === 'movie';
  const embedUrl = isMovie
    ? `https://player.videasy.net/movie/${tmdbId}`
    : `https://player.videasy.net/tv/${tmdbId}/${season}/${episode}`;

  return [
    {
      id: `vds_${tmdbId}_${isMovie ? 'm' : `s${season}e${episode}`}`,
      name: 'Videasy Ultra 1080p',
      displayName: 'Videasy Ultra 1080p',
      badge: '💬 TR Altyazı (OpenSubs)',
      category: 'subtitled',
      url: embedUrl,
      streamUrl: embedUrl,
      isDirectVideo: false,
      getUrl: () => embedUrl
    }
  ];
}
