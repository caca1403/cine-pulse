/* ==========================================================================
   CinePulse Studio - Comprehensive Türkçe Dublaj Belgesel Scraper
   Strictly checks DMAX, TLC, BelgeselX and Belgeselce for true documentary content.
   ========================================================================== */

import { fetchDmaxTlcSources } from './dmaxTlcScraper.js';

export async function fetchBelgeselSources({
  titles = [],
  seriesTitle = '',
  title = '',
  originalTitle = '',
  season = 1,
  episode = 1
}) {
  return await fetchDmaxTlcSources({
    titles,
    seriesTitle,
    title,
    originalTitle,
    season,
    episode,
    isDub: true
  });
}
