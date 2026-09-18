/* ==========================================================================
   CinePulse Studio - VIP Global Embed Source Service
   Low-ad, ultra-stable 1080p streaming embeds:
   - VidSrc.me (En kararlı normal VidSrc, TMDB destekli, multi-sub)
   - SmashyStream VIP (Resmi player.smashystream.com, multi-sub TR)
   - 2Embed VIP (Clean, instant, multi-sub TR)
   - SuperEmbed (Multi-source aggregate player)
   - EmbedSu (Hızlı CDN)
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
    ? `https://player.smashystream.com/movie/${tmdbId}`
    : `https://player.smashystream.com/tv/${tmdbId}/${sNum}/${epNum}`;

  // 3. 2Embed VIP (Multi-sub TR)
  const twoEmbedUrl = isMovie
    ? `https://www.2embed.cc/embed/${tmdbId}`
    : `https://www.2embed.cc/embedtv/${tmdbId}?s=${sNum}&e=${epNum}`;

  // 4. SuperEmbed (Multi-source aggregate player)
  const superEmbedUrl = isMovie
    ? `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1`
    : `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1&s=${sNum}&e=${epNum}`;

  // 5. EmbedSu (Hızlı CDN)
  const embedSuUrl = isMovie
    ? `https://embed.su/embed/movie/${tmdbId}`
    : `https://embed.su/embed/tv/${tmdbId}/${sNum}/${epNum}`;

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
    },
    {
      id: `twoembed_${tmdbId}_s${sNum}e${epNum}`,
      name: isMovie ? '2Embed VIP 1080p (TR Altyazı)' : `2Embed VIP S${sNum}B${epNum}`,
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
      id: `superembed_${tmdbId}_s${sNum}e${epNum}`,
      name: isMovie ? 'SuperEmbed 1080p' : `SuperEmbed S${sNum}B${epNum}`,
      displayName: 'SuperEmbed (1080p)',
      badge: '🎬 SuperEmbed',
      source: 'SuperEmbed',
      url: superEmbedUrl,
      streamUrl: superEmbedUrl,
      quality: '1080p HD',
      isHls: false,
      isDirectVideo: false,
      category: 'subtitled',
      type: 'embed',
      getUrl: () => superEmbedUrl
    },
    {
      id: `embedsu_${tmdbId}_s${sNum}e${epNum}`,
      name: isMovie ? 'EmbedSu 1080p' : `EmbedSu S${sNum}B${epNum}`,
      displayName: 'EmbedSu (1080p)',
      badge: '⚡ EmbedSu',
      source: 'EmbedSu',
      url: embedSuUrl,
      streamUrl: embedSuUrl,
      quality: '1080p HD',
      isHls: false,
      isDirectVideo: false,
      category: 'subtitled',
      type: 'embed',
      getUrl: () => embedSuUrl
    }
  ];
}

export const fetchGlobalEmbedSources = fetchSmashyStreamSources;
