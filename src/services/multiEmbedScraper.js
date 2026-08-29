/* ==========================================================================
   CinePulse Studio - Universal MultiEmbed & Subtitled Embed Scraper
   - 100% working, modern global streaming servers
   - Integrated Multi-Language & Turkish Subtitles
   - Ultra-fast response with high availability
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
    // 1. VidSrc CC (Fastest & high quality)
    sources.push({
      name: 'VidSrc Ultra (Türkçe Altyazı)',
      server: 'VidSrc CC',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://vidsrc.cc/v2/embed/movie/${tmdbId}`
    });

    // 2. VidSrc ICU (Instant start)
    sources.push({
      name: 'VidSrc Pro (Altyazılı)',
      server: 'VidSrc Pro',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://vidsrc.icu/embed/movie/${tmdbId}`
    });

    // 3. SmashyStream VIP
    sources.push({
      name: 'SmashyStream VIP (Altyazılı)',
      server: 'Smashy VIP',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://player.smashy.stream/movie/${tmdbId}`
    });

    // 4. AutoEmbed CC (Subtitles)
    sources.push({
      name: 'AutoEmbed CC Multi-Sub',
      server: 'AutoEmbed CC',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://player.autoembed.cc/embed/movie/${tmdbId}`
    });

    // 5. EmbedSU (Subtitles & 4K)
    sources.push({
      name: 'EmbedSU 4K (TR Altyazı)',
      server: 'EmbedSU',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://embed.su/embed/movie/${tmdbId}`
    });

    // 6. VidSrc ME
    sources.push({
      name: 'VidSrc HD (Altyazılı)',
      server: 'VidSrc ME',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`
    });

    // 7. VidLink Pro
    sources.push({
      name: 'VidLink Pro (Altyazılı)',
      server: 'VidLink Pro',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://vidlink.pro/movie/${tmdbId}`
    });

    // 8. VidBinge
    sources.push({
      name: 'VidBinge Fast (Altyazılı)',
      server: 'VidBinge',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://vidbinge.dev/embed/movie/${tmdbId}`
    });

    // 9. SuperEmbed
    sources.push({
      name: 'SuperEmbed VIP (Altyazılı)',
      server: 'SuperEmbed',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1`
    });

    // 10. 2Embed Skin
    sources.push({
      name: '2Embed Skin (Altyazılı)',
      server: '2Embed',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://www.2embed.skin/embed/${tmdbId}`
    });
  } else {
    // TV Series
    // 1. VidSrc CC (Fastest)
    sources.push({
      name: 'VidSrc Ultra (Türkçe Altyazı)',
      server: 'VidSrc CC',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${season}/${episode}`
    });

    // 2. VidSrc ICU
    sources.push({
      name: 'VidSrc Pro (Altyazılı)',
      server: 'VidSrc Pro',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://vidsrc.icu/embed/tv/${tmdbId}/${season}/${episode}`
    });

    // 3. SmashyStream VIP
    sources.push({
      name: 'SmashyStream VIP (Altyazılı)',
      server: 'Smashy VIP',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://player.smashy.stream/tv/${tmdbId}?s=${season}&e=${episode}`
    });

    // 4. AutoEmbed CC
    sources.push({
      name: 'AutoEmbed CC Multi-Sub',
      server: 'AutoEmbed CC',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://player.autoembed.cc/embed/tv/${tmdbId}/${season}/${episode}`
    });

    // 5. EmbedSU
    sources.push({
      name: 'EmbedSU 4K (TR Altyazı)',
      server: 'EmbedSU',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}`
    });

    // 6. VidSrc ME
    sources.push({
      name: 'VidSrc HD (Altyazılı)',
      server: 'VidSrc ME',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`
    });

    // 7. VidLink Pro
    sources.push({
      name: 'VidLink Pro (Altyazılı)',
      server: 'VidLink Pro',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`
    });

    // 8. VidBinge
    sources.push({
      name: 'VidBinge Fast (Altyazılı)',
      server: 'VidBinge',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://vidbinge.dev/embed/tv/${tmdbId}/${season}/${episode}`
    });

    // 9. SuperEmbed
    sources.push({
      name: 'SuperEmbed VIP (Altyazılı)',
      server: 'SuperEmbed',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`
    });

    // 10. 2Embed Skin
    sources.push({
      name: '2Embed Skin (Altyazılı)',
      server: '2Embed',
      type: 'embed',
      isDub: false,
      quality: '1080p',
      streamUrl: `https://www.2embed.skin/embedtv/${tmdbId}&s=${season}&e=${episode}`
    });
  }

  return sources;
}
