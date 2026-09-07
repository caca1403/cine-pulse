/* ==========================================================================
   CinePulse Studio - VIP Cloud Server Database
   Allows you to define your own direct video URLs for movies and series.
   Any link you put here (Cloudflare R2, direct MP4, HLS m3u8) will show up
   as the #1 prioritized "CinePulse VIP 1080p" server in the player!
   ========================================================================== */

export const CINEPULSE_CLOUD_BASE = 'https://wild-credit-e1ae.cagatayca07.workers.dev/stream';

/**
 * Static catalog of your own hosted/custom videos.
 * Format:
 * tmdbId: {
 *   dubbed: [ { name, url, quality, isHls } ],
 *   subtitled: [ { name, url, quality, isHls, subtitles: [] } ]
 * }
 */
export const CUSTOM_MEDIA_CATALOG = {
  // Example: The Matrix (1999) - TMDB ID: 603
  603: {
    dubbed: [
      // Direct R2 or your custom URL:
      // {
      //   name: 'CinePulse VIP 1080p',
      //   url: `${CINEPULSE_CLOUD_BASE}/matrix-1999-tr-dublaj.mp4`,
      //   isDirectVideo: true
      // }
    ],
    subtitled: []
  }
};

/**
 * Checks if you have a custom uploaded video for this TMDB ID or title
 */
export async function fetchCinepulseCloudSources({ tmdbId, title, season, episode, isDub = true }) {
  const list = [];
  if (!tmdbId) return list;

  const entry = CUSTOM_MEDIA_CATALOG[tmdbId];
  if (entry) {
    const pool = isDub ? entry.dubbed : entry.subtitled;
    if (Array.isArray(pool)) {
      for (const item of pool) {
        list.push({
          id: `cp_vip_${tmdbId}_${isDub ? 'dub' : 'sub'}`,
          name: item.name || 'CinePulse VIP 1080p',
          displayName: item.name || 'CinePulse VIP 1080p',
          badge: isDub ? '👑 CinePulse VIP' : '👑 CinePulse Altyazı',
          url: item.url,
          streamUrl: item.url,
          isHls: item.isHls || item.url.includes('.m3u8'),
          isDirectVideo: item.isDirectVideo || item.url.includes('.mp4'),
          subtitles: item.subtitles || [],
          priority: 0 // HIGHEST PRIORITY
        });
      }
    }
  }

  return list;
}
