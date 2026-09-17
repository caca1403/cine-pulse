/* ==========================================================================
   CinePulse Studio - SmashyStream VIP Source Service (smashystream.xyz)
   Provides 1080p full multi-subbed ad-free streams based on TMDB ID:
   - TV: https://player.smashystream.com/tv/{tmdbId}?s={season}&e={episode}
   - Movie: https://player.smashystream.com/movie/{tmdbId}
   - Fallback: https://embed.smashystream.com/playere.php?tmdb={tmdbId}&season={season}&episode={episode}
   ========================================================================== */

export function fetchSmashyStreamSources({ type = 'movie', tmdbId, season = 1, episode = 1 } = {}) {
  // Completely disabled: Third-party ad embeds removed in favor of 100% pure P2P WebTorrent
  return [];
}
