/* ==========================================================================
   SineFlix Pro - Direct Sinewix Scraper Module
   Fetches direct high-speed Turkish Dubbed video streams (MP4/MKV/HLS)
   via user Cloudflare Worker Gateway.
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';
const SINEWIX_API_BASE = 'https://ydfvfdizipanel.ru/public/api';
const SINEWIX_TOKEN = '9iQNC5HQwPlaFuJDkhncJ5XTJ8feGXOJatAA';

function cleanTitleString(str) {
  if (!str) return '';
  return str
    .replace(/\s*\(\d{4}\).*/, '')
    .replace(/:\s*.*/, '')
    .trim();
}

async function performSinewixSearch(query) {
  const targetUrl = `${SINEWIX_API_BASE}/search/${encodeURIComponent(query)}/${SINEWIX_TOKEN}`;
  const proxyUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(targetUrl)}`;
  const searchRes = await fetch(proxyUrl).catch(() => null);
  if (!searchRes || !searchRes.ok) return [];
  const json = await searchRes.json().catch(() => ({}));
  return json.search || json.data || [];
}

export async function fetchSinewixSources({ type = 'tv', title = '', originalTitle = '', season = 1, episode = 1, isDub = true }) {
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

    const item = searchItems[0];
    const itemId = item.id;
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

    const extractedSources = [];

    videoList.forEach((video, idx) => {
      if (video.link && video.link.length > 10) {
        const linkLower = video.link.toLowerCase();
        const isBlockedLocker = 
          linkLower.includes('mediafire.com') ||
          linkLower.includes('mega.nz') ||
          linkLower.includes('pichive') ||
          linkLower.includes('turbobit') ||
          linkLower.includes('yadi.sk') ||
          linkLower.includes('uptobox') ||
          linkLower.includes('rapidgator') ||
          linkLower.includes('1fichier');

        if (isBlockedLocker) return;

        const isDirectVideo = 
          linkLower.includes('.mkv') || 
          linkLower.includes('.mp4') || 
          linkLower.includes('.m3u8') || 
          linkLower.includes('7862564.xyz') || 
          linkLower.includes('959565.xyz') || 
          linkLower.includes('45464654.xyz') || 
          linkLower.includes('545645.xyz') || 
          linkLower.includes('5654644.xyz');

        extractedSources.push({
          id: `snx_${video.id || idx}`,
          name: `VIP Direct Stream (${isDub ? 'Dublaj 1080p' : 'Altyazılı'})`,
          badge: '⚡ VIP 1080p',
          isDirectVideo,
          isHls: linkLower.includes('.m3u8'),
          streamUrl: video.link,
          url: video.link
        });
      }
    });

    return extractedSources;
  } catch (err) {
    console.warn('Sinewix scrape error:', err);
    return [];
  }
}
