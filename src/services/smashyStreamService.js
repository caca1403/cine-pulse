/* ==========================================================================
   CinePulse Studio - VIP Global Embed Source Service (2Embed & VidSrc)
   Permanently replaces VidLink and SmashyStream with ultra-stable 1080p:
   - 2Embed VIP: https://www.2embed.cc (Clean, instant, multi-sub TR)
   - VidSrc VIP: https://vidsrc.in (Rock-solid, zero x-frame issues)
   - VidSrc PM: https://vidsrc.pm (Fast 1080p alternative)
   ========================================================================== */

export function fetchSmashyStreamSources({ type = 'movie', tmdbId, season = 1, episode = 1 } = {}) {
  if (!tmdbId) return [];

  const isMovie = type === 'movie';
  const sNum = parseInt(season, 10) || 1;
  const epNum = parseInt(episode, 10) || 1;

  // 1. 2Embed VIP (High stability, multi-language subtitles including Turkish)
  const twoEmbedUrl = isMovie
    ? `https://www.2embed.cc/embed/${tmdbId}`
    : `https://www.2embed.cc/embedtv/${tmdbId}&s=${sNum}&e=${epNum}`;

  // 2. VidSrc VIP (Fast CDN, high reliability, multi-sub)
  const vidSrcUrl = isMovie
    ? `https://vidsrc.in/embed/movie/${tmdbId}`
    : `https://vidsrc.in/embed/tv/${tmdbId}/${sNum}/${epNum}`;

  // 3. VidSrc PM Alternative
  const vidSrcPmUrl = isMovie
    ? `https://vidsrc.pm/embed/movie/${tmdbId}`
    : `https://vidsrc.pm/embed/tv/${tmdbId}/${sNum}/${epNum}`;

  return [
    {
      id: `twoembed_${tmdbId}_s${sNum}e${epNum}`,
      name: isMovie ? '2Embed VIP 1080p (TR Altyazı)' : `2Embed VIP S${sNum}B${epNum} (TR Altyazı)`,
      displayName: '2Embed VIP (1080p HD)',
      badge: '⚡ 2Embed 1080p',
      source: '2Embed',
      url: twoEmbedUrl,
      streamUrl: twoEmbedUrl,
      quality: '1080p HD',
      isHls: false,
      isDirectVideo: false,
      category: 'subtitled',
      type: 'embed',
      getUrl: () => twoEmbedUrl
    },
    {
      id: `vidsrc_${tmdbId}_s${sNum}e${epNum}`,
      name: isMovie ? 'VidSrc VIP 1080p (Multi-Sub)' : `VidSrc VIP S${sNum}B${epNum} (Multi-Sub)`,
      displayName: 'VidSrc VIP (1080p HD)',
      badge: '🎬 VidSrc 1080p',
      source: 'VidSrc',
      url: vidSrcUrl,
      streamUrl: vidSrcUrl,
      quality: '1080p HD',
      isHls: false,
      isDirectVideo: false,
      category: 'subtitled',
      type: 'embed',
      getUrl: () => vidSrcUrl
    },
    {
      id: `vidsrc_pm_${tmdbId}_s${sNum}e${epNum}`,
      name: isMovie ? 'VidSrc Alternatif 1080p' : `VidSrc Alt S${sNum}B${epNum} (1080p)`,
      displayName: 'VidSrc Alternatif',
      badge: '⚡ VidSrc Alt',
      source: 'VidSrc PM',
      url: vidSrcPmUrl,
      streamUrl: vidSrcPmUrl,
      quality: '1080p HD',
      isHls: false,
      isDirectVideo: false,
      category: 'subtitled',
      type: 'embed',
      getUrl: () => vidSrcPmUrl
    }
  ];
}

// Named alias for semantic clarity
export const fetchGlobalEmbedSources = fetchSmashyStreamSources;
