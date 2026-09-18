/* ==========================================================================
   CinePulse Studio - VIP Global Embed Source Service
   Only official, stable, verified embeds:
   - VidSrc.me (En kararlı normal VidSrc, TMDB destekli, multi-sub)
   - SmashyStream VIP (Resmi embed.smashystream.com, multi-sub TR)
   ========================================================================== */

export function fetchSmashyStreamSources({ type = 'movie', tmdbId, season = 1, episode = 1 } = {}) {
  if (!tmdbId) return [];

  const isMovie = type === 'movie';
  const sNum = parseInt(season, 10) || 1;
  const epNum = parseInt(episode, 10) || 1;

  // 1. VidSrc.me - Normal kararlı VidSrc (vidsrc.xyz kaldırıldı)
  const vidSrcMeUrl = isMovie
    ? `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`
    : `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${sNum}&episode=${epNum}`;

  // 2. SmashyStream VIP - Resmi SmashyStream Oynatıcısı
  const smashyUrl = isMovie
    ? `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}`
    : `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}&season=${sNum}&episode=${epNum}`;

  return [
    {
      id: `vidsrc_me_${tmdbId}_s${sNum}e${epNum}`,
      name: isMovie ? 'VidSrc 1080p (Multi-Sub)' : `VidSrc S${sNum}B${epNum}`,
      displayName: 'VidSrc (1080p HD)',
      badge: '🎬 VidSrc 1080p',
      source: 'VidSrc',
      url: vidSrcMeUrl,
      streamUrl: vidSrcMeUrl,
      quality: '1080p HD',
      isHls: false,
      isDirectVideo: false,
      category: 'subtitled',
      type: 'embed',
      getUrl: () => vidSrcMeUrl
    },
    {
      id: `smashystream_${tmdbId}_s${sNum}e${epNum}`,
      name: isMovie ? 'SmashyStream VIP (1080p)' : `SmashyStream S${sNum}B${epNum}`,
      displayName: 'SmashyStream (1080p)',
      badge: '⚡ SmashyStream',
      source: 'SmashyStream',
      url: smashyUrl,
      streamUrl: smashyUrl,
      quality: '1080p HD',
      isHls: false,
      isDirectVideo: false,
      category: 'subtitled',
      type: 'embed',
      getUrl: () => smashyUrl
    }
  ];
}

export const fetchGlobalEmbedSources = fetchSmashyStreamSources;
