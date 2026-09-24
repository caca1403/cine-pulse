/* ==========================================================================
   CinePulse Studio - Anizium Dedicated Scraper
   Fetches 4K / 1080p Turkish Dubbed & Subtitled Anime Streams via Anizium API
   Uses authenticated Cf-Control header and direct embed player resolution
   ========================================================================== */

import { isStrictMediaTitleMatch } from './mediaMatcher.js';

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';
const TOKEN_KEY = 'hlxjl1c2w281ax473rt1ofgrvhyjvi';
const CLIENT_KEY = '16ghkdz5qnwinkyebwopbd94b49xhs';

function normalizeTitle(t) {
  if (!t) return '';
  return t
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generates Anizium's dynamic Cf-Control token based on Istanbul timezone day-of-week
 */
function generateCfControlToken() {
  try {
    const weekday = new Date().toLocaleString('en-US', {
      timeZone: 'Europe/Istanbul',
      weekday: 'long'
    }).toLowerCase();

    const key = `${TOKEN_KEY}_${weekday}`;
    const randKey = Array.from({ length: 6 }, () => (Math.random() + 1).toString(36)[2]).join('');
    const payload = JSON.stringify({ [randKey]: Date.now() });

    const enc = new TextEncoder();
    const a = enc.encode(payload);
    const i = enc.encode(key);
    const r = new Uint8Array(a.length);
    for (let o = 0; o < a.length; o++) {
      r[o] = a[o] ^ i[o % i.length];
    }
    return Array.from(r).map(n => n.toString(16).padStart(2, '0')).join('');
  } catch (_) {
    return '';
  }
}

/**
 * Fetches anime streaming sources from Anizium
 */
export async function fetchAniziumSources({
  titles = [],
  seriesTitle = '',
  title = '',
  originalTitle = '',
  season = 1,
  episode = 1,
  isDub = false
} = {}) {
  const candidateQueries = [...new Set([
    originalTitle,
    seriesTitle,
    title,
    ...titles
  ])].filter(t => t && typeof t === 'string' && t.trim().length > 1);

  if (candidateQueries.length === 0) return [];

  const token = generateCfControlToken();
  const headers = {
    'Cf-Control': token,
    'device': 'browser',
    'language': 'tr',
    'site': 'main',
    'Origin': 'https://anizium.co',
    'Referer': 'https://anizium.co/'
  };

  const sources = [];

  for (const query of candidateQueries) {
    try {
      const cleanQ = normalizeTitle(query);
      if (!cleanQ || cleanQ.length < 2) continue;

      // 1. Search anime by query or slug
      const searchUrl = `https://api.anizium.co/anime/request/search?q=${encodeURIComponent(cleanQ)}`;
      const res = await fetch(`${CF_WORKER_PROXY}?url=${encodeURIComponent(searchUrl)}`, {
        headers,
        signal: AbortSignal.timeout(4000)
      }).catch(() => null);

      if (!res || !res.ok) continue;
      const searchData = await res.json().catch(() => null);
      if (!searchData || !searchData.success || !Array.isArray(searchData.data)) continue;

      for (const item of searchData.data.slice(0, 3)) {
        if (!item || !item.ID) continue;

        // Verify title match
        const itemTitle = normalizeTitle(item.name || item.name_tr || item.name_short || '');
        if (!isStrictMediaTitleMatch(itemTitle, candidateQueries)) continue;

        // Fetch detailed anime info
        const getUrl = `https://api.anizium.co/anime/get?id=${item.ID}`;
        const getRes = await fetch(`${CF_WORKER_PROXY}?url=${encodeURIComponent(getUrl)}`, {
          headers,
          signal: AbortSignal.timeout(4500)
        }).catch(() => null);

        if (!getRes || !getRes.ok) continue;
        const animeDetail = await getRes.json().catch(() => null);
        if (!animeDetail || !animeDetail.success || !animeDetail.data) continue;

        const anime = animeDetail.data;
        const targetSeason = parseInt(season, 10) || 1;
        const targetEpisode = parseInt(episode, 10) || 1;

        // Check seasons and episodes
        const foundSeason = (anime.seasons || []).find(s => s.number === targetSeason);
        if (!foundSeason) continue;

        const foundEp = (foundSeason.episodes || []).find(e => e.number === targetEpisode);
        if (!foundEp) continue;

        // Embed player link
        const embedUrl = `https://x.anizium.co/embed?id=${anime.ID}&site=main&lang=tr&server=1&skin=art&season=${targetSeason}&episode=${targetEpisode}`;

        sources.push({
          id: `anizium_${anime.ID}_s${targetSeason}e${targetEpisode}`,
          name: `Anizium 4K/1080p VIP (S${targetSeason} B${targetEpisode})`,
          displayName: 'Anizium Player (4K/1080p)',
          badge: '⚡ Anizium 4K Dub/Altyazı',
          source: 'Anizium',
          url: embedUrl,
          streamUrl: embedUrl,
          quality: foundEp.quality ? `${foundEp.quality.toUpperCase()}` : '1080p',
          isIframe: true,
          category: isDub ? 'dubbed' : 'subtitled',
          type: 'embed',
          getUrl: () => embedUrl
        });

        // Add backup server 2 (Anizium secondary)
        const embedUrlServer2 = `https://x.anizium.co/embed?id=${anime.ID}&site=main&lang=tr&server=2&skin=art&season=${targetSeason}&episode=${targetEpisode}`;
        sources.push({
          id: `anizium_s2_${anime.ID}_s${targetSeason}e${targetEpisode}`,
          name: `Anizium Yedek Sunucu (S${targetSeason} B${targetEpisode})`,
          displayName: 'Anizium Sunucu 2',
          badge: '⚡ Anizium Sunucu 2',
          source: 'Anizium',
          url: embedUrlServer2,
          streamUrl: embedUrlServer2,
          quality: '1080p',
          isIframe: true,
          category: isDub ? 'dubbed' : 'subtitled',
          type: 'embed',
          getUrl: () => embedUrlServer2
        });

        if (sources.length > 0) break;
      }

      if (sources.length > 0) break;
    } catch (err) {
      console.warn('[Anizium Scraper] Error:', err?.message);
    }
  }

  return sources;
}
