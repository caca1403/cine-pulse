/* ==========================================================================
   CinePulse Studio - Anizium Dedicated Scraper
   Fetches 4K / 1080p Turkish Dubbed & Subtitled Anime Streams via Anizium API
   Uses authenticated user session & profile headers with direct MP4 playback
   ========================================================================== */

import { isStrictMediaTitleMatch } from './mediaMatcher.js';

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';
const TOKEN_KEY = 'hlxjl1c2w281ax473rt1ofgrvhyjvi';
const CLIENT_KEY = '16ghkdz5qnwinkyebwopbd94b49xhs';

// Authenticated session credentials
const ANIZIUM_SESSION = '035f01015659595301060601525f39060c094e03515b442d13590e1a1c405b085b55031c5c5b475d57035c5c54415a001b04071f4446';
const ANIZIUM_PROFILE = '15632429';
const ANIZIUM_USER_ID = '38534241025665';

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

function getAniziumHeaders() {
  return {
    'Cf-Control': generateCfControlToken(),
    'device': 'browser',
    'language': 'tr',
    'site': 'main',
    'user-session': ANIZIUM_SESSION,
    'user-profile': ANIZIUM_PROFILE,
    'user': ANIZIUM_USER_ID,
    'Origin': 'https://anizium.co',
    'Referer': 'https://anizium.co/'
  };
}

async function fetchAniziumApi(url, timeoutMs = 4500) {
  const isBrowser = typeof window !== 'undefined';
  const headers = getAniziumHeaders();

  // 1. Direct fetch (supported natively as Anizium reflects Access-Control-Allow-Origin)
  try {
    const res = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(timeoutMs)
    });
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data) return data;
    }
  } catch (_) {}

  // 2. CF Worker proxy fallback
  if (isBrowser) {
    try {
      const proxyUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(url)}`;
      const res = await fetch(proxyUrl, {
        headers,
        signal: AbortSignal.timeout(timeoutMs)
      });
      if (res && res.ok) {
        return await res.json().catch(() => null);
      }
    } catch (_) {}
  }

  return null;
}

/**
 * Fetches anime streaming sources from Anizium
 */
export async function fetchAniziumSources({
  titles = [],
  seriesTitle = '',
  title = '',
  originalTitle = '',
  type = 'tv',
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

  const targetSeason = parseInt(season, 10) || 1;
  const targetEpisode = parseInt(episode, 10) || 1;
  const isMovie = type === 'movie';
  const sources = [];
  const seenUrls = new Set();

  for (const query of candidateQueries) {
    try {
      const cleanQ = normalizeTitle(query);
      if (!cleanQ || cleanQ.length < 2) continue;

      // 1. Search anime catalog on Anizium
      const searchUrl = `https://api.anizium.co/page/search?value=${encodeURIComponent(cleanQ)}`;
      const searchData = await fetchAniziumApi(searchUrl, 3800);
      const list = searchData?.page?.data || searchData?.data || [];
      if (!Array.isArray(list) || list.length === 0) continue;

      for (const item of list.slice(0, 3)) {
        if (!item || !item.ID) continue;

        // Verify title match
        const itemTitle = normalizeTitle(item.name || item.name_tr || item.name_short || '');
        if (!isStrictMediaTitleMatch(itemTitle, candidateQueries)) continue;

        // 2. Query direct streaming sources from Anizium
        const sourceUrl = isMovie
          ? `https://api.anizium.co/anime/source?id=${item.ID}&site=main&plan=free&server=1`
          : `https://api.anizium.co/anime/source?id=${item.ID}&site=main&plan=free&season=${targetSeason}&episode=${targetEpisode}&server=1`;

        const srcData = await fetchAniziumApi(sourceUrl, 4200);
        if (!srcData || !srcData.success || !Array.isArray(srcData.groups) || srcData.groups.length === 0) continue;

        // Process subtitles
        const subtitles = [];
        if (Array.isArray(srcData.subtitles)) {
          for (const sub of srcData.subtitles) {
            if (sub && sub.link) {
              subtitles.push({
                label: sub.name || (sub.group === 'tr' ? 'Türkçe' : 'İngilizce'),
                src: sub.link
              });
            }
          }
        }

        // Determine audio group
        let matchedGroup = null;
        if (isDub) {
          matchedGroup = srcData.groups.find(g => g.group === 'trdub' || (g.name || '').toLowerCase().includes('türk'));
        } else {
          matchedGroup = srcData.groups.find(g => g.group === 'original' || g.group === 'trsub' || (g.name || '').toLowerCase().includes('japon'));
          if (!matchedGroup) {
            matchedGroup = srcData.groups.find(g => g.group !== 'trdub');
          }
        }

        if (!matchedGroup || !Array.isArray(matchedGroup.items) || matchedGroup.items.length === 0) continue;

        // Sort items by quality descending (4K -> 1440p -> 1080p -> 720p)
        const sortedItems = [...matchedGroup.items].sort((a, b) => (b.quality || 0) - (a.quality || 0));

        // Offer 4K (if available) and 1080p
        for (const it of sortedItems) {
          if (!it || !it.link || seenUrls.has(it.link)) continue;
          if (it.quality < 720 && sortedItems.some(x => x.quality >= 720)) continue; // skip low res if HD exists

          seenUrls.add(it.link);
          const qText = it.quality >= 2160 ? '4K' : (it.quality ? `${it.quality}p` : '1080p');
          const is4k = it.quality >= 2160;
          const labelPrefix = isMovie ? `AZ ${qText}` : `AZ ${qText} (S${targetSeason}B${targetEpisode})`;

          sources.push({
            id: `az_${item.ID}_${isMovie ? 'mov' : `s${targetSeason}e${targetEpisode}`}_${it.quality || '1080'}_${isDub ? 'dub' : 'sub'}`,
            name: `${labelPrefix} ${isDub ? 'TR Dublaj' : 'TR Altyazı'}`,
            displayName: `${labelPrefix} ${isDub ? 'TR Dublaj' : 'TR Altyazı'}`,
            badge: is4k ? `⚡ AZ 4K UHD ${isDub ? 'Dublaj' : 'Altyazı'}` : `⚡ AZ 1080p ${isDub ? 'Dublaj' : 'Altyazı'}`,
            source: 'AZ',
            url: it.link,
            streamUrl: it.link,
            quality: is4k ? '4K UHD' : (it.quality ? `${it.quality}p` : '1080p'),
            isHls: false,
            isDirectVideo: true,
            type: 'direct',
            category: isDub ? 'dubbed' : 'subtitled',
            subtitles: isDub ? [] : subtitles,
            isDub,
            getUrl: () => it.link
          });
        }

        if (sources.length > 0) break;
      }

      if (sources.length > 0) break;
    } catch (err) {
      console.warn('[Anizium Scraper] Error:', err?.message);
    }
  }

  return sources;
}
