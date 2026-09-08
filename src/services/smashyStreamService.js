/* ==========================================================================
   CinePulse Studio - SmashyStream VIP Source Service (smashystream.xyz)
   Provides 1080p full multi-subbed ad-free streams based on TMDB ID:
   - TV: https://player.smashystream.com/tv/{tmdbId}?s={season}&e={episode}
   - Movie: https://player.smashystream.com/movie/{tmdbId}
   - Fallback: https://embed.smashystream.com/playere.php?tmdb={tmdbId}&season={season}&episode={episode}
   ========================================================================== */

export function fetchSmashyStreamSources({ type = 'movie', tmdbId, season = 1, episode = 1 }) {
  if (!tmdbId) return [];

  const isMovie = type === 'movie';
  const sNum = parseInt(season, 10) || 1;
  const epNum = parseInt(episode, 10) || 1;

  const playerUrl = isMovie
    ? `https://player.smashystream.com/movie/${tmdbId}`
    : `https://player.smashystream.com/tv/${tmdbId}?s=${sNum}&e=${epNum}`;

  const embedUrl = isMovie
    ? `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}`
    : `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}&season=${sNum}&episode=${epNum}`;

  return [
    {
      id: `smashy_player_${tmdbId}_s${sNum}e${epNum}`,
      name: isMovie ? 'SmashyStream 1080p (TR Altyazı)' : `SmashyStream S${sNum}B${epNum} (TR Altyazı)`,
      displayName: 'SmashyStream VIP 1080p',
      badge: '💬 Smashy Altyazı',
      source: 'SmashyStream',
      url: playerUrl,
      streamUrl: playerUrl,
      quality: '1080p HD',
      isHls: false,
      isDirectVideo: false,
      category: 'subtitled',
      getUrl: () => playerUrl
    },
    {
      id: `smashy_embed_${tmdbId}_s${sNum}e${epNum}`,
      name: isMovie ? 'SmashyStream Alternatif (TR Altyazı)' : `SmashyStream S${sNum}B${epNum} (Alternatif)`,
      displayName: 'SmashyStream Alternatif',
      badge: '💬 Smashy Altyazı',
      source: 'SmashyStream',
      url: embedUrl,
      streamUrl: embedUrl,
      quality: '1080p HD',
      isHls: false,
      isDirectVideo: false,
      category: 'subtitled',
      getUrl: () => embedUrl
    }
  ];
}
