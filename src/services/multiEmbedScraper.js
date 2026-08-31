/* ==========================================================================
   CinePulse Studio - MultiEmbed Scraper
   Fetches stable, long-running MultiEmbed (multiembed.mov) 1080p stream
   Supports Turkish Subtitles & Multi-Audio
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
    ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`
    : `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`;

  return [
    {
      id: `me_${tmdbId}_${isMovie ? 'm' : `s${season}e${episode}`}`,
      name: 'MultiEmbed VIP',
      displayName: 'MultiEmbed VIP',
      badge: isDub ? '💬 TR Dublaj/Altyazı' : '💬 TR Altyazılı',
      category: isDub ? 'dubbed' : 'subtitled',
      url: embedUrl,
      streamUrl: embedUrl,
      isDirectVideo: false,
      getUrl: () => embedUrl
    }
  ];
}
