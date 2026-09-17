/* ==========================================================================
   CinePulse Studio - SmashyStream VIP Source Service (smashystream.xyz)
   Provides 1080p multi-subbed ad-filtered streams based on TMDB ID:
   - TV: https://player.smashystream.com/tv/{tmdbId}?s={season}&e={episode}
   - Movie: https://player.smashystream.com/movie/{tmdbId}
   - Fallback: https://embed.smashystream.com/playere.php?tmdb={tmdbId}&season={season}&episode={episode}
   ========================================================================== */

export function fetchSmashyStreamSources({ type = 'movie', tmdbId, season = 1, episode = 1 } = {}) {
  if (!tmdbId) return [];

  const isMovie = type === 'movie';
  const sNum = parseInt(season, 10) || 1;
  const epNum = parseInt(episode, 10) || 1;

  const embedUrl = isMovie
    ? `https://anyembed.xyz/embed/tmdb-movie-${tmdbId}`
    : `https://anyembed.xyz/embed/tmdb-tv-${tmdbId}/${sNum}/${epNum}`;

  const altSmashyUrl = isMovie
    ? `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}`
    : `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}&season=${sNum}&episode=${epNum}`;

  const videasyUrl = isMovie
    ? `https://player.videasy.net/movie/${tmdbId}`
    : `https://player.videasy.net/tv/${tmdbId}/${sNum}/${epNum}`;

  const vidsrcUrl = isMovie
    ? `https://vidsrc.cc/v2/embed/movie/${tmdbId}`
    : `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${sNum}/${epNum}`;

  return [
    {
      id: `videasy_${tmdbId}_s${sNum}e${epNum}`,
      name: isMovie ? 'Videasy Hızlı Akış 1080p (TR Altyazı)' : `Videasy S${sNum}B${epNum} (Hızlı)`,
      displayName: 'Videasy Hızlı 1080p',
      badge: '⚡ Videasy',
      source: 'Videasy',
      url: videasyUrl,
      streamUrl: videasyUrl,
      quality: '1080p HD',
      isHls: false,
      isDirectVideo: false,
      category: 'subtitled',
      type: 'embed',
      getUrl: () => videasyUrl
    },
    {
      id: `smashy_embed_${tmdbId}_s${sNum}e${epNum}`,
      name: isMovie ? 'SmashyStream VIP 1080p (TR Altyazı)' : `SmashyStream S${sNum}B${epNum} (TR Altyazı)`,
      displayName: 'SmashyStream VIP 1080p',
      badge: '💬 Smashy VIP',
      source: 'SmashyStream',
      url: embedUrl,
      streamUrl: embedUrl,
      quality: '1080p HD',
      isHls: false,
      isDirectVideo: false,
      category: 'subtitled',
      type: 'embed',
      getUrl: () => embedUrl
    },
    {
      id: `vidsrc_${tmdbId}_s${sNum}e${epNum}`,
      name: isMovie ? 'VidSrc Global 1080p' : `VidSrc S${sNum}B${epNum}`,
      displayName: 'VidSrc Global 1080p',
      badge: '🎬 VidSrc',
      source: 'VidSrc',
      url: vidsrcUrl,
      streamUrl: vidsrcUrl,
      quality: '1080p HD',
      isHls: false,
      isDirectVideo: false,
      category: 'subtitled',
      type: 'embed',
      getUrl: () => vidsrcUrl
    },
    {
      id: `smashy_alt_${tmdbId}_s${sNum}e${epNum}`,
      name: isMovie ? 'SmashyStream Alternatif' : `SmashyStream S${sNum}B${epNum} (Alternatif)`,
      displayName: 'SmashyStream Alternatif',
      badge: '💬 Smashy Alt',
      source: 'SmashyStream',
      url: altSmashyUrl,
      streamUrl: altSmashyUrl,
      quality: '1080p HD',
      isHls: false,
      isDirectVideo: false,
      category: 'subtitled',
      type: 'embed',
      getUrl: () => altSmashyUrl
    }
  ];
}
