/* ==========================================================================
   CinePulse Studio - VIP Global Embed Source Service
   Low-ad, ultra-stable 1080p streaming embeds:
   - VidSrc.me  (En kararlı, TMDB destekli, multi-sub)
   - VidSrc.xyz (Fast CDN, multi-sub TR)
   - 2Embed VIP (Clean, instant, multi-sub TR)
   - SuperEmbed  (Aggregate player, yüksek uyumluluk)
   - EmbedSu    (Yeni nesil, hızlı CDN)
   - MultiEmbed (LookMovie CDN)
   ========================================================================== */

export function fetchSmashyStreamSources({ type = 'movie', tmdbId, season = 1, episode = 1 } = {}) {
  if (!tmdbId) return [];

  const isMovie = type === 'movie';
  const sNum = parseInt(season, 10) || 1;
  const epNum = parseInt(episode, 10) || 1;

  // 1. VidSrc.me - En kararlı embed (TMDB ID direkt destekli)
  const vidSrcMeUrl = isMovie
    ? `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`
    : `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${sNum}&episode=${epNum}`;

  // 2. VidSrc.xyz (Hızlı CDN)
  const vidSrcXyzUrl = isMovie
    ? `https://vidsrc.xyz/embed/movie/${tmdbId}`
    : `https://vidsrc.xyz/embed/tv/${tmdbId}?s=${sNum}&e=${epNum}`;

  // 3. 2Embed VIP - URL formatı düzeltildi (?s= ile)
  const twoEmbedUrl = isMovie
    ? `https://www.2embed.cc/embed/${tmdbId}`
    : `https://www.2embed.cc/embedtv/${tmdbId}?s=${sNum}&e=${epNum}`;

  // 4. SuperEmbed (Multi-source aggregate player)
  const superEmbedUrl = isMovie
    ? `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1`
    : `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1&s=${sNum}&e=${epNum}`;

  // 5. EmbedSu (Yeni nesil embed player)
  const embedSuUrl = isMovie
    ? `https://embed.su/embed/movie/${tmdbId}`
    : `https://embed.su/embed/tv/${tmdbId}/${sNum}/${epNum}`;

  // 6. MultiEmbed (LookMovie CDN)
  const lookMovieUrl = isMovie
    ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`
    : `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${sNum}&e=${epNum}`;

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
      id: `vidsrc_xyz_${tmdbId}_s${sNum}e${epNum}`,
      name: isMovie ? 'VidSrc XYZ 1080p' : `VidSrc XYZ S${sNum}B${epNum}`,
      displayName: 'VidSrc XYZ (1080p)',
      badge: '⚡ VidSrc XYZ',
      source: 'VidSrc XYZ',
      url: vidSrcXyzUrl,
      streamUrl: vidSrcXyzUrl,
      quality: '1080p HD',
      isHls: false,
      isDirectVideo: false,
      category: 'subtitled',
      type: 'embed',
      getUrl: () => vidSrcXyzUrl
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
    },
    {
      id: `lookmovie_${tmdbId}_s${sNum}e${epNum}`,
      name: isMovie ? 'LookMovie VIP 1080p' : `LookMovie VIP S${sNum}B${epNum}`,
      displayName: 'LookMovie VIP (1080p HD)',
      badge: '🎬 LookMovie 1080p',
      source: 'LookMovie',
      url: lookMovieUrl,
      streamUrl: lookMovieUrl,
      quality: '1080p HD',
      isHls: false,
      isDirectVideo: false,
      category: 'subtitled',
      type: 'embed',
      getUrl: () => lookMovieUrl
    }
  ];
}

// Named alias for semantic clarity
export const fetchGlobalEmbedSources = fetchSmashyStreamSources;
