/* ==========================================================================
   CinePulse Studio - Web P2P & Torrent-Equivalent Stream Service
   100% Client-side Web Compatible (Zero localhost dependencies, works on live website):
   - Videasy VIP 1080p (Torrentio/Stremio Web Engine with Multi-Sub & TR Subtitles)
   ========================================================================== */

/**
 * Fetches reliable torrent-equivalent high-speed streams that work on the live web
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

  // Videasy VIP (Torrentio / Stremio Web Player - Very high speed, multi-sub including Turkish)
  const videasyUrl = isMovie
    ? `https://player.videasy.to/movie/${tmdbId}`
    : `https://player.videasy.to/tv/${tmdbId}/${sNum}/${epNum}`;

  const defaultSubUrl = isMovie
    ? `/api/subtitles?tmdbId=${tmdbId || ''}&title=${encodeURIComponent(title || '')}&type=movie`
    : `/api/subtitles?tmdbId=${tmdbId || ''}&title=${encodeURIComponent(title || '')}&season=${sNum}&episode=${epNum}&type=tv`;
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
    }
  ];
}
