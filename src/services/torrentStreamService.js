/* ==========================================================================
   CinePulse Studio - Web P2P & Torrent-Equivalent Stream Service
   100% Client-side Web Compatible (Zero localhost dependencies, works on live website):
   - Videasy VIP 1080p (Torrentio/Stremio Web Engine with Multi-Sub & TR Subtitles)
   - VidSrc PRO 1080p (Rock-solid global CDN stream with TR Subtitles)
   - VidSrc IN 1080p (Fast-fallback global 1080p stream)
   ========================================================================== */

/**
 * Fetches 2-3 reliable torrent-equivalent high-speed streams that work on the live web
 */
export async function fetchTorrentStreamSources({
  type = 'movie',
  tmdbId = null,
  season = 1,
  episode = 1
} = {}) {
  if (!tmdbId) return [];

  const isMovie = type === 'movie';
  const sNum = parseInt(season, 10) || 1;
  const epNum = parseInt(episode, 10) || 1;

  // 1. Videasy VIP (Torrentio / Stremio Web Player - Very high speed, multi-sub including Turkish)
  const videasyUrl = isMovie
    ? `https://player.videasy.net/movie/${tmdbId}`
    : `https://player.videasy.net/tv/${tmdbId}/${sNum}/${epNum}`;

  // 2. VidSrc PRO (vidsrc.me - Direct TMDB ID support, rock solid stability)
  const vidSrcProUrl = isMovie
    ? `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`
    : `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${sNum}&episode=${epNum}`;

  // 3. VidSrc IN (vidsrc.in - High-speed backup CDN)
  const vidSrcInUrl = isMovie
    ? `https://vidsrc.in/embed/movie/${tmdbId}`
    : `https://vidsrc.in/embed/tv/${tmdbId}/${sNum}/${epNum}`;

  const defaultSubUrl = `/api/subtitles?imdbId=${tmdbId}&season=${sNum}&episode=${epNum}&type=${type}`;
  const autoSubs = [{ label: 'OpenSubtitles (Türkçe)', src: defaultSubUrl }];

  return [
    {
      id: `torrent_p2p_videasy_${tmdbId}_s${sNum}e${epNum}`,
      name: isMovie ? 'VIP Torrent Akış (1080p)' : `VIP Torrent Akış S${sNum}B${epNum}`,
      displayName: 'VIP Torrent Akış (1080p)',
      badge: '⚡ VIP Akış 1080p',
      source: 'VIP Torrent',
      url: videasyUrl,
      streamUrl: videasyUrl,
      quality: '1080p HD',
      isHls: false,
      isDirectVideo: false,
      category: 'subtitled',
      type: 'embed',
      subtitles: autoSubs,
      getUrl: () => videasyUrl
    },
    {
      id: `torrent_p2p_vidsrc_${tmdbId}_s${sNum}e${epNum}`,
      name: isMovie ? 'VIP P2P Hızlı (1080p)' : `VIP P2P Hızlı S${sNum}B${epNum}`,
      displayName: 'VIP P2P Hızlı (1080p)',
      badge: '🎬 VIP P2P 1080p',
      source: 'VIP P2P',
      url: vidSrcProUrl,
      streamUrl: vidSrcProUrl,
      quality: '1080p HD',
      isHls: false,
      isDirectVideo: false,
      category: 'subtitled',
      type: 'embed',
      subtitles: autoSubs,
      getUrl: () => vidSrcProUrl
    },
    {
      id: `torrent_p2p_vidsrcin_${tmdbId}_s${sNum}e${epNum}`,
      name: isMovie ? 'VIP P2P Yedek (1080p)' : `VIP P2P Yedek S${sNum}B${epNum}`,
      displayName: 'VIP P2P Yedek (1080p)',
      badge: '⚡ VIP Yedek 1080p',
      source: 'VIP Yedek',
      url: vidSrcInUrl,
      streamUrl: vidSrcInUrl,
      quality: '1080p HD',
      isHls: false,
      isDirectVideo: false,
      category: 'subtitled',
      type: 'embed',
      subtitles: autoSubs,
      getUrl: () => vidSrcInUrl
    }
  ];
}
