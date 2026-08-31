/* ==========================================================================
   CinePulse Studio - Universal Embed Scraper
   Working global streaming servers only (sandbox-compatible).
   Removed: 2Embed, embed.su, VidSrc (all), AutoEmbed (sandbox blocked)
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
    // 1. SmashyStream VIP (Working, fast)
    sources.push({
      name: 'SmashyStream VIP (Altyazılı)',
      server: 'Smashy VIP',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://player.smashy.stream/movie/${tmdbId}`
    });

    // 2. VidLink Pro
    sources.push({
      name: 'VidLink Pro (Altyazılı)',
      server: 'VidLink Pro',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://vidlink.pro/movie/${tmdbId}`
    });

    // 3. VidBinge
    sources.push({
      name: 'VidBinge Fast (Altyazılı)',
      server: 'VidBinge',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://vidbinge.dev/embed/movie/${tmdbId}`
    });

    // 4. SuperEmbed
    sources.push({
      name: 'SuperEmbed VIP (Altyazılı)',
      server: 'SuperEmbed',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1`
    });
  } else {
    // TV Series / Anime
    // 1. SmashyStream VIP
    sources.push({
      name: 'SmashyStream VIP (Altyazılı)',
      server: 'Smashy VIP',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://player.smashy.stream/tv/${tmdbId}?s=${season}&e=${episode}`
    });

    // 2. VidLink Pro
    sources.push({
      name: 'VidLink Pro (Altyazılı)',
      server: 'VidLink Pro',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`
    });

    // 3. VidBinge
    sources.push({
      name: 'VidBinge Fast (Altyazılı)',
      server: 'VidBinge',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://vidbinge.dev/embed/tv/${tmdbId}/${season}/${episode}`
    });

    // 4. SuperEmbed
    sources.push({
      name: 'SuperEmbed VIP (Altyazılı)',
      server: 'SuperEmbed',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`
    });
  }

  return sources;
}
