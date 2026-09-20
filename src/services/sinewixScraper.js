/* ==========================================================================
   CinePulse Studio - Direct Sinewix Scraper Module
   Fetches direct high-speed Turkish Dubbed video streams (MKV/MP4/HLS)
   Supports both Movies (/media/detail) and TV Series (/series/show).
   Triple gateway (CF Worker -> Vercel Serverless Proxy -> Direct) for 100% reliability.
   Strict title & year & type matching to prevent wrong media playback.
   ========================================================================== */

import { isStrictMediaTitleMatch } from './mediaMatcher.js';
import { apiUrl } from './apiOrigin.js';

const SINEWIX_API_BASE = 'https://ydfvfdizipanel.ru/public/api';
const SINEWIX_TOKEN = 'EuXs1Y5oXTrDpGte3E2dNDIu82LLjaoCd6om';

const SINEWIX_HEADERS = {
  'hash256': 'f4d4bc98a3fc4600e7f2c2bab7533f1f03d8a70ff03c256bb11dc57050536bd0',
  'signature': '308202c3308201aba0030201020204075cec01300d06092a864886f70d01010b050030123110300e0603550403130753696e65776978301e170d3231303932313233333334395a170d3436303931353233333334395a30123110300e0603550403130753696e6577697830820122300d06092a864886f70d01010105000382010f003082010a0282010100b0a2a1bc5c3f16f19c3b2456cfd0a6128ced9f5e2e2c4cca1a100e17b07b86256258f372e76a95a17e9e4a1c048e364835723a95e8ef6d5bdfb5694b50277c65a64f7b012fdf164e5dc93629561f6ca29b7dc82ebb3d6f3c8e8fc6795847fe331ad4a13ed6c059a83804c43d3747526d769580f3a4153752eb22dac66dd15f1582caa43305dc49f55ac7b1b89013e654d2ca8c94c30956659674cc673256c04208f09118bae14cdd72d78f9ee2aece958084a8c2e315deff45726d4fc1f18ec39569ff1abe4f36a8d01090e5f68c07c28763513b88208bcac1a6e1941f6fd8bfdd52f832098ddb2154c8f565bc5d58c7106a19e03787e75c7f34997000e3bcf30203010001a321301f301d0603551d0e04160414b545fc18e74a791d9402b53940ae38b96e9e209c300d06092a864886f70d01010b05000382010100a8a64d9e7c8b5db102af15d3caf94ff8d3e9be9008bb0021117ca2f0762e68583354b126a041bb1fb6e6308e421e4b5a71f779cde63e5d2fc5976bff966c3c4034e852c077d8e74458fbae2ec1db74b1f4082e188bf8ef7c42a44e3fbfb693bb00ee2a727096b42360ddce1bdcd3536f50c8693bcc62a7b7204bcefe2ecf1f7c820bcd63e1d7a6acc8bf6163086915fc5f607cf51bc7a8635f98bb4c65a8f24b7b5a82c7b06868f565cb0d6ac4775c4aac777536ddd1a565f990fd8cbe539185fa7aab610b7855a687a00f4e55536d72873444552c50fd10727dbf298a9be6ed6ae62148dd1de365f3729915dd31975e28a472d752ac14db3db548405cc31e1e',
  'packagename': 'com.sinewix',
  'User-Agent': 'EasyPlex (Android 14; SM-A546B; Samsung Galaxy A54 5G; tr)',
  'Accept': 'application/json'
};

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

function normalizeText(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isTitleSimilar(target, candidate, targetYear = null, candidateYear = null) {
  if (!isStrictMediaTitleMatch(candidate, [target])) return false;
  if (targetYear && candidateYear) {
    return Math.abs(parseInt(targetYear, 10) - parseInt(candidateYear, 10)) <= 1;
  }
  return true;
}

async function performSinewixRequest(endpoint) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const directTarget = `${SINEWIX_API_BASE}${cleanEndpoint}`;

  const isValidPayload = (d) => Boolean(d && (d.search || d.videos || d.seasons || d.data || d.title || d.id || Array.isArray(d)));

  // 1. Try CF Worker gateway first (bypasses Cloudflare bot detection & handles CORS directly in browser)
  try {
    const workerUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(directTarget)}`;
    const res = await fetch(workerUrl, {
      signal: AbortSignal.timeout(6000)
    }).catch(() => null);

    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (isValidPayload(data)) return data;
    }
  } catch (_) {}

  // 2. Try Local Vite / Vercel Serverless Proxy (/api/snx)
  try {
    const vercelProxyUrl = apiUrl(`/api/snx?path=${encodeURIComponent(cleanEndpoint)}`);
    const res = await fetch(vercelProxyUrl, {
      signal: AbortSignal.timeout(6000)
    }).catch(() => null);

    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (isValidPayload(data)) return data;
    }
  } catch (_) {}

  // 3. Direct backend fallback (for Node / server-side environments)
  try {
    const res = await fetch(directTarget, {
      headers: SINEWIX_HEADERS,
      signal: AbortSignal.timeout(6000)
    }).catch(() => null);

    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (isValidPayload(data)) return data;
    }
  } catch (_) {}

  return null;
}

export async function fetchSinewixSources({
  type = 'tv',
  titles = [],
  seriesTitle = '',
  title = '',
  originalTitle = '',
  year = null,
  season = 1,
  episode = 1,
  isDub = true,
  imdbId = ''
}) {
  const isMovie = type === 'movie';

  try {
    const rawQueries = [
      ...(Array.isArray(titles) ? titles : []),
      seriesTitle,
      title,
      originalTitle
    ].filter(Boolean);

    const cleanedQueries = [...new Set(
      rawQueries.map(q => q.replace(/\s*\(\d{4}\).*/, '').trim()).filter(Boolean)
    )];

    if (cleanedQueries.length === 0) return [];

    let targetItem = null;
    // APK 2.5.2 uses the IMDb episode route and no longer relies solely on
    // free-text title search. Prefer that route when an IMDb id is known.
    let directEpisodeData = null;
    if (!isMovie && imdbId) {
      const direct = await performSinewixRequest(`/search/episode-${Number(episode)}/imdbid-${encodeURIComponent(imdbId)}/season-${Number(season)}/${SINEWIX_TOKEN}`);
      if (direct && (direct.videos || direct.streams || direct.seasons || direct.data)) {
        directEpisodeData = direct;
      }
    }
    for (const q of cleanedQueries) {
      const searchData = await performSinewixRequest(`/search/${encodeURIComponent(q)}/${SINEWIX_TOKEN}`);
      const items = searchData?.search || searchData?.data || [];
      if (!Array.isArray(items) || items.length === 0) continue;

      const filteredSearchItems = items.filter(it => {
        if (isMovie) {
          return it.type === 'movie' || it.type === 'film';
        } else {
          return it.type === 'serie' || it.type === 'series' || it.type === 'tv' || it.type === 'anime';
        }
      });

      const candidatePool = filteredSearchItems.length > 0 ? filteredSearchItems : items;

      const matched = candidatePool.find(it => {
        const itemTitles = [it.title, it.name, it.original_name, it.original_title].filter(Boolean);
        const itemYear = (it.release_date || it.first_air_date || '').substring(0, 4);
        return cleanedQueries.some(candidateQuery => itemTitles.some(iTitle => isTitleSimilar(candidateQuery, iTitle, year, itemYear)));
      });

      if (matched) {
        targetItem = matched;
        break;
      }
    }

    if (!targetItem && !directEpisodeData) {
      return [];
    }

    const itemId = targetItem?.id;
    const isAnime = targetItem?.type === 'anime';
    let videoList = [];

    if (directEpisodeData) {
      videoList = directEpisodeData.videos || directEpisodeData.streams || directEpisodeData.data || [];
      if (!Array.isArray(videoList) && typeof videoList === 'object') videoList = Object.values(videoList);
    }

    if (directEpisodeData) {
      // already resolved by the APK-compatible episode endpoint
    } else if (isMovie) {
      const movieData = await performSinewixRequest(`/media/detail/${itemId}/${SINEWIX_TOKEN}`);
      videoList = movieData?.videos || [];
    } else if (isAnime) {
      // Anime uses a separate /animes/show/ endpoint with anime_season_id / anime_episode_id
      const animeData = await performSinewixRequest(`/animes/show/${itemId}/${SINEWIX_TOKEN}`);
      if (animeData?.seasons && Array.isArray(animeData.seasons)) {
        const seasonMatch = animeData.seasons.find(s => s.season_number === Number(season));
        if (seasonMatch?.episodes && Array.isArray(seasonMatch.episodes)) {
          const epMatch = seasonMatch.episodes.find(e => e.episode_number === Number(episode));
          videoList = epMatch ? epMatch.videos || [] : [];
        }
      }
    } else {
      const seriesData = await performSinewixRequest(`/series/show/${itemId}/${SINEWIX_TOKEN}`);
      if (seriesData?.seasons && Array.isArray(seriesData.seasons)) {
        const seasonMatch = seriesData.seasons.find(s => s.season_number === Number(season));
        if (seasonMatch?.episodes && Array.isArray(seasonMatch.episodes)) {
          const epMatch = seasonMatch.episodes.find(e => e.episode_number === Number(episode));
          videoList = epMatch ? epMatch.videos || [] : [];
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

      const isSubtitledVideo = lowerLink.includes('trsub') || lowerLink.includes('.sub.') || lowerLink.includes('altyazi') || (v.lang && v.lang.toLowerCase().includes('sub'));
      const isDualAudio = lowerLink.includes('dual') || lowerLink.includes('trdub') || (v.lang && (v.lang.toLowerCase().includes('dual') || v.lang.toLowerCase().includes('tr')));

      const filterLanguage = typeof isDub === 'boolean';
      if (filterLanguage && isDub && isSubtitledVideo && !isDualAudio) {
        continue;
      }

      if (filterLanguage && !isDub && !isSubtitledVideo && !isDualAudio && lowerLink.includes('dub')) {
        continue;
      }

      const isMkv = lowerLink.includes('.mkv');
      const isDirect = lowerLink.includes('.mp4') || lowerLink.includes('.webm') || isMkv;
      const isHls = lowerLink.includes('.m3u8');

      // Use high-speed proxy with HTTP Range & CORS support for instant video startup.
      // MKV files are routed through /api/mkv_stream which uses ffmpeg to remux
      // them to fragmented MP4 (copy codecs, no re-encoding). This allows Chromium
      // to play H.264+AAC streams that are packaged in a Matroska container,
      // which Chromium cannot natively open.
      const proxiedLink = rawLink.startsWith('http')
        ? (isHls
          ? apiUrl(`/api/hls_proxy?url=${encodeURIComponent(rawLink)}`)
          : isMkv
            ? apiUrl(`/api/mkv_stream?url=${encodeURIComponent(rawLink)}&ref=${encodeURIComponent('https://ydfvfdizipanel.ru/')}`)
            : isDirect
            ? apiUrl(`/api/proxy?url=${encodeURIComponent(rawLink)}&ref=${encodeURIComponent('https://ydfvfdizipanel.ru/')}`)
            : rawLink)
        : rawLink;

      const serverTitle = isDirect ? (isMkv ? 'SWX 1080p (MKV)' : 'SWX 1080p Direct') : 'SWX VIP 1080p';
      const badge = isSubtitledVideo ? '💬 TR Altyazı 1080p' : (isDualAudio ? '⚡ SWX Dual 1080p' : '⚡ SWX 1080p');
      streams.push({
        id: `snx_${v.id || Math.random().toString(36).substring(7)}`,
        name: serverTitle,
        displayName: serverTitle,
        badge,
        category: isSubtitledVideo ? 'subtitled' : (isDualAudio ? 'dubbed' : (isDub === false ? 'subtitled' : 'dubbed')),
        streamUrl: proxiedLink,
        url: proxiedLink,
        originalEmbedUrl: rawLink,
        isHls: isHls,
        isDirectVideo: true,
        isMkv: isMkv,
        source: 'SWX',
        getUrl: () => proxiedLink
      });
    }

    return streams;
  } catch (err) {
    console.warn('[SinewixScraper] Error:', err);
    return [];
  }
}
