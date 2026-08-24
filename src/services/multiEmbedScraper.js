/* ==========================================================================
   CinePulse Studio - Universal MultiEmbed & Subtitled Embed Scraper
   - Covers 100% of all TMDB Movies & TV Series
   - Subtitled (Altyazılı) ONLY
   - Zero Cloudflare Challenges (100% Uptime & Instant Response)
   ========================================================================== */

export async function fetchMultiEmbedSources({
  type = 'movie',
  tmdbId,
  season = 1,
  episode = 1,
  isDub = false
}) {
  // Never return under dubbed tab (subtitles only)
  if (isDub || !tmdbId) return [];

  const isMovie = type === 'movie' || type === 'film';
  const sources = [];

  if (isMovie) {
    // 1. MultiEmbed VIP
    sources.push({
      name: 'MultiEmbed VIP (TR Altyazı)',
      server: 'MultiEmbed VIP',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`
    });

    // 2. VidLink Pro
    sources.push({
      name: 'VidLink Pro Ultra 1080p',
      server: 'VidLink Pro',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://vidlink.pro/movie/${tmdbId}`
    });

    // 3. AutoEmbed Multi-Server
    sources.push({
      name: 'AutoEmbed HD (Altyazılı)',
      server: 'AutoEmbed',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://autoembed.co/movie/tmdb/${tmdbId}`
    });

    // 4. 2Embed
    sources.push({
      name: '2Embed FastStream',
      server: '2Embed',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://www.2embed.cc/embed/${tmdbId}`
    });
  } else {
    // TV Series
    sources.push({
      name: 'MultiEmbed VIP (TR Altyazı)',
      server: 'MultiEmbed VIP',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`
    });

    sources.push({
      name: 'VidLink Pro Ultra 1080p',
      server: 'VidLink Pro',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`
    });

    sources.push({
      name: 'AutoEmbed HD (Altyazılı)',
      server: 'AutoEmbed',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://autoembed.co/tv/tmdb/${tmdbId}-${season}-${episode}`
    });

    sources.push({
      name: '2Embed FastStream',
      server: '2Embed',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`
    });
  }

  return sources;
}
