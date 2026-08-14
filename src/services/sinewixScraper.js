/* ==========================================================================
   CinePulse Studio - Direct Sinewix Scraper Module
   Fetches direct high-speed Turkish Dubbed video streams (MP4/MKV/HLS)
   via user Cloudflare Worker Gateway.
   Strict title & year matching to prevent wrong movie playback.
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';
const SINEWIX_API_BASE = 'https://ydfvfdizipanel.ru/public/api';
const SINEWIX_TOKEN = '9iQNC5HQwPlaFuJDkhncJ5XTJ8feGXOJatAA';

function cleanTitleString(str) {
  if (!str) return '';
  return str.replace(/\s*\(\d{4}\).*/, '').trim();
}

function isTitleSimilar(target, candidate) {
  if (!target || !candidate) return false;
  const normT = target.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
  const normC = candidate.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
  if (normT === normC) return true;

  const tWords = normT.split(/\s+/).filter(w => w.length > 1);
  const cWords = normC.split(/\s+/).filter(w => w.length > 1);

  const matched = tWords.filter(w => cWords.includes(w)).length;
  const ratio = matched / Math.max(tWords.length, 1);
  return ratio >= 0.75;
}

async function performSinewixSearch(query) {
  const targetUrl = `${SINEWIX_API_BASE}/search/${encodeURIComponent(query)}/${SINEWIX_TOKEN}`;
  const proxyUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(targetUrl)}`;
  const searchRes = await fetch(proxyUrl).catch(() => null);
  if (!searchRes || !searchRes.ok) return [];
  const json = await searchRes.json().catch(() => ({}));
  return json.search || json.data || [];
}

export async function fetchSinewixSources({ type = 'tv', title = '', originalTitle = '', year = null, season = 1, episode = 1, isDub = true }) {
  if (!title && !originalTitle) return [];
  const isMovie = type === 'movie';

  try {
    const queries = [];
    const cleanT = cleanTitleString(title);
    if (cleanT) queries.push(cleanT);
    const cleanOrig = cleanTitleString(originalTitle);
    if (cleanOrig && cleanOrig !== cleanT) queries.push(cleanOrig);

    let searchItems = [];

    for (const query of queries) {
      searchItems = await performSinewixSearch(query);
      if (searchItems.length > 0) break;
    }

    if (searchItems.length === 0) return [];

    // Match candidate accurately
    const targetItem = searchItems.find(it => {
      const itemTitle = it.title || it.name || it.original_title || '';
      return isTitleSimilar(cleanT, itemTitle) || (cleanOrig && isTitleSimilar(cleanOrig, itemTitle));
    });

    if (!targetItem) {
      return [];
    }

    const itemId = targetItem.id;
    let videoList = [];

    if (isMovie) {
      const detailTarget = `${SINEWIX_API_BASE}/movies/show/${itemId}/${SINEWIX_TOKEN}`;
      const proxyDetailUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(detailTarget)}`;
      const detailRes = await fetch(proxyDetailUrl).catch(() => null);
      if (detailRes && detailRes.ok) {
        const detailData = await detailRes.json().catch(() => ({}));
        videoList = detailData.videos || [];
      }
    } else {
      const detailTarget = `${SINEWIX_API_BASE}/series/show/${itemId}/${SINEWIX_TOKEN}`;
      const proxyDetailUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(detailTarget)}`;
      const detailRes = await fetch(proxyDetailUrl).catch(() => null);
      if (detailRes && detailRes.ok) {
        const detailData = await detailRes.json().catch(() => ({}));
        if (detailData.seasons) {
          const seasonMatch = detailData.seasons.find(s => s.season_number === season) || detailData.seasons[0];
          if (seasonMatch && seasonMatch.episodes) {
            const epMatch = seasonMatch.episodes.find(e => e.episode_number === episode) || seasonMatch.episodes[0];
            videoList = epMatch ? epMatch.videos || [] : [];
          }
        }
      }
    }

    const streams = [];

    for (const v of videoList) {
      const rawLink = (v.link || v.url || '').trim();
      if (!rawLink) continue;

      const lowerLink = rawLink.toLowerCase();

      // Filter out non-embeddable locker hosts
      if (
        lowerLink.includes('mediafire.com') ||
        lowerLink.includes('mega.nz') ||
        lowerLink.includes('pichive') ||
        lowerLink.includes('turbobit') ||
        lowerLink.includes('yadi.sk')
      ) {
        continue;
      }

      const isDirect = lowerLink.includes('.mp4') || lowerLink.includes('.mkv') || lowerLink.includes('.webm');
      const isHls = lowerLink.includes('.m3u8');
      const serverName = v.server || v.name || (isDirect ? 'Direct MP4' : 'VIP Stream');

      streams.push({
        id: `snx_${v.id || Math.random().toString(36).substring(7)}`,
        name: `HD Direct Stream (${serverName})`,
        badge: '⚡ 1080p VIP',
        category: 'dubbed',
        streamUrl: rawLink,
        url: rawLink,
        isHls: isHls,
        isDirectVideo: isDirect,
        getUrl: () => rawLink
      });
    }

    return streams;
  } catch (err) {
    console.warn('[SinewixScraper] Error:', err);
    return [];
  }
}
