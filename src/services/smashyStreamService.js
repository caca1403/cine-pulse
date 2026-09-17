/* ==========================================================================
   CinePulse Studio - SmashyStream & VidLink VIP Source Service
   Provides 1080p multi-subbed ad-free streams based on TMDB ID:
   - SmashyStream VIP: https://player.smashystream.com / https://embed.smashystream.com
   - VidLink Zero-Ad: https://vidlink.pro (Clean, fast, multi-sub)
   ========================================================================== */

export function fetchSmashyStreamSources({ type = 'movie', tmdbId, season = 1, episode = 1 } = {}) {
  if (!tmdbId) return [];

  const isMovie = type === 'movie';
  const sNum = parseInt(season, 10) || 1;
  const epNum = parseInt(episode, 10) || 1;

  const smashyPlayerUrl = isMovie
    ? `https://player.smashystream.com/movie/${tmdbId}`
    : `https://player.smashystream.com/tv/${tmdbId}?s=${sNum}&e=${epNum}`;

  const smashyEmbedUrl = isMovie
    ? `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}`
    : `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}&season=${sNum}&episode=${epNum}`;

  const vidlinkUrl = isMovie
    ? `https://vidlink.pro/movie/${tmdbId}`
    : `https://vidlink.pro/tv/${tmdbId}/${sNum}/${epNum}`;

  return [
    {
      id: `smashy_player_${tmdbId}_s${sNum}e${epNum}`,
      name: isMovie ? 'SmashyStream 1080p (TR Altyazı)' : `SmashyStream S${sNum}B${epNum} (TR Altyazı)`,
      displayName: 'SmashyStream VIP 1080p',
      badge: '💬 Smashy VIP',
      source: 'SmashyStream',
      url: smashyPlayerUrl,
      streamUrl: smashyPlayerUrl,
      quality: '1080p HD',
      isHls: false,
      isDirectVideo: false,
      category: 'subtitled',
      type: 'embed',
      getUrl: () => smashyPlayerUrl
    },
    {
      id: `smashy_embed_${tmdbId}_s${sNum}e${epNum}`,
      name: isMovie ? 'SmashyStream Alternatif (TR Altyazı)' : `SmashyStream S${sNum}B${epNum} (Alternatif)`,
      displayName: 'SmashyStream Alternatif',
      badge: '💬 Smashy Alt',
      source: 'SmashyStream',
      url: smashyEmbedUrl,
      streamUrl: smashyEmbedUrl,
      quality: '1080p HD',
      isHls: false,
      isDirectVideo: false,
      category: 'subtitled',
      type: 'embed',
      getUrl: () => smashyEmbedUrl
    },
    {
      id: `vidlink_${tmdbId}_s${sNum}e${epNum}`,
      name: isMovie ? 'VidLink Hızlı HD (0 Reklam • TR Altyazı)' : `VidLink S${sNum}B${epNum} (0 Reklam)`,
      displayName: 'VidLink VIP (0 Reklam)',
      badge: '⚡ VidLink 1080p',
      source: 'VidLink',
      url: vidlinkUrl,
      streamUrl: vidlinkUrl,
      quality: '1080p HD',
      isHls: false,
      isDirectVideo: false,
      category: 'subtitled',
      type: 'embed',
      getUrl: () => vidlinkUrl
    }
  ];
}
