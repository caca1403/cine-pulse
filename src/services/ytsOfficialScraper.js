/* ==========================================================================
   CinePulse Studio - YTS Official Scraper (en.yts-official.com)
   Direct high-speed P2P streams (MP4/MKV) via MediaServer WebTorrent Engine
   Auto-integrates Turkish subtitles for every torrent hit.
   ========================================================================== */

const MEDIA_SERVER_BASE = 'http://localhost:4000';
const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

function normalizeTitle(t) {
  if (!t) return '';
  return t
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatSize(bytes) {
  if (!bytes || bytes <= 0) return '';
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  const mb = bytes / (1024 * 1024);
  return `${Math.round(mb)} MB`;
}

/**
 * Robust fetch for YTS Official API with multi-proxy fallback
 */
async function fetchYtsApi(endpoint) {
  const targetUrl = `https://en.yts-official.com/${endpoint}`;
  const isBrowser = typeof window !== 'undefined';

  // 1. Local proxy in browser
  if (isBrowser) {
    try {
      const res = await fetch(`/api/proxy?url=${encodeURIComponent(targetUrl)}`, {
        signal: AbortSignal.timeout(4500)
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.hits)) return data;
      }
    } catch (_) {}
  }

  // 2. Direct fetch (Node / Server)
  try {
    const res = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(4500)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.hits)) return data;
    }
  } catch (_) {}

  // 3. Cloudflare Worker fallback
  try {
    const res = await fetch(`${CF_WORKER_PROXY}?url=${encodeURIComponent(targetUrl)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(5000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.hits)) return data;
    }
  } catch (_) {}

  return null;
}

/**
 * Extracts and maps high-speed torrent streams from en.yts-official.com
 */
export async function fetchYtsOfficialSources({
  type = 'movie',
  tmdbId = null,
  title = '',
  originalTitle = '',
  year = null,
  season = 1,
  episode = 1,
  imdbId = null,
  isDub = false
}) {
  try {
    const isMovie = type === 'movie';
    const mode = isMovie ? 'movie' : 'tv';
    const query = normalizeTitle(originalTitle || title);
    if (!query) return [];

    const yrParam = (isMovie && year) ? `&year=${year}` : '';
    let endpoint = `?api=torrents&mode=${mode}&name=${encodeURIComponent(query)}${yrParam}&quality=all`;

    let data = await fetchYtsApi(endpoint);
    if ((!data || !Array.isArray(data.hits) || data.hits.length === 0) && yrParam) {
      endpoint = `?api=torrents&mode=${mode}&name=${encodeURIComponent(query)}&quality=all`;
      data = await fetchYtsApi(endpoint);
    }

    if (!data || !Array.isArray(data.hits) || data.hits.length === 0) {
      return [];
    }

    const hits = data.hits;
    const streams = [];

    // Turkish subtitle URL for this media
    const subUrl = imdbId 
      ? (isMovie ? `/api/subtitles?imdbId=${imdbId}` : `/api/subtitles?imdbId=${imdbId}&season=${season}&episode=${episode}`)
      : null;

    const defaultSubs = subUrl ? [{ label: 'Türkçe', src: subUrl }] : [];

    for (const hit of hits) {
      if (!hit.hash) continue;

      const rawTitle = hit.title || '';
      const lower = rawTitle.toLowerCase();

      // Series episode filtering
      if (!isMovie) {
        const sPad = season < 10 ? `0${season}` : `${season}`;
        const ePad = episode < 10 ? `0${episode}` : `${episode}`;
        // Fix: use [.\s_-] not [.\s-_] to avoid invalid regex range
        const sReg = new RegExp(`(s${sPad}|s${season}[^0-9]|season[.\\s_-]*${season})`, 'i');
        const eReg = new RegExp(`(e${ePad}|e${episode}[^0-9])`, 'i');

        // Multi-season packs (e.g. "Season 1-5" or "S01-S05") that cover our season
        const multiSeasonMatch = rawTitle.match(/season\s*(\d+)[\s_-]+(?:to[\s_-]+)?(?:s|season)?[\s_-]*(\d+)/i) ||
          rawTitle.match(/s(\d{1,2})\s*-\s*s?(\d{1,2})/i);
        const coversOurSeason = multiSeasonMatch
          ? (parseInt(multiSeasonMatch[1]) <= season && season <= parseInt(multiSeasonMatch[2]))
          : false;

        const sMatch = sReg.test(rawTitle) || coversOurSeason;
        const isSeasonPack = sMatch && /complete|all[.\s_-]?seasons|s\d{2}-s\d{2}/i.test(rawTitle);
        const eMatch = eReg.test(rawTitle);

        if (!sMatch || (!eMatch && !isSeasonPack)) {
          continue;
        }
      }

      // Quality detection
      const is4K = lower.includes('2160p') || lower.includes('4k') || lower.includes('uhd');
      const is1080 = lower.includes('1080p');
      const is720 = lower.includes('720p');
      const quality = is4K ? '4K UHD' : is1080 ? '1080p' : is720 ? '720p' : 'HD';

      // All streams originating from en.yts-official.com are YTS streams!
      const isYts = true;
      const isYtsSpecific = lower.includes('yify') || lower.includes('yts');
      const isMp4 = lower.includes('.mp4') || isYtsSpecific;

      // Filter out low quality camrips or oversized files (> 14GB)
      if (!is4K && !is1080 && !is720 && !lower.includes('bluray') && !lower.includes('web-dl') && !lower.includes('webrip')) {
        continue;
      }
      if (hit.bytes && hit.bytes > 14 * 1024 * 1024 * 1024) {
        continue;
      }

      const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      const magnetUrl = `magnet:?xt=urn:btih:${hit.hash}&dn=${encodeURIComponent(hit.title || query)}&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=wss://tracker.openwebtorrent.com&tr=wss://tracker.btorrent.xyz`;

      // Official YTS web player engine (clean direct embed)
      const ytsWebEmbedUrl = tmdbId 
        ? (isMovie ? `https://vsembed.ru/embed/movie/${tmdbId}` : `https://vsembed.ru/embed/tv/${tmdbId}/${season}-${episode}`)
        : null;

      const streamUrl = isLocal ? `${MEDIA_SERVER_BASE}/torrent/${hit.hash}` : magnetUrl;
      const sourceLabel = isYtsSpecific ? 'YTS (YIFY)' : 'YTS (Official)';

      const sizeStr = formatSize(hit.bytes);
      const sizePart = sizeStr ? `${sizeStr} • ` : '';

      const displayName = is4K 
        ? `⚡ YTS 4K UHD (${sizePart}S:${hit.seeds || 0})` 
        : `⚡ YTS ${quality} (${sizePart || (isMp4 ? 'MP4 • ' : '')}S:${hit.seeds || 0})`;

      const badge = is4K ? '⚡ YTS 4K' : `⚡ YTS ${quality}`;

      streams.push({
        id: `cp_global_yts_${hit.hash.substring(0, 10)}`,
        name: displayName,
        displayName: displayName,
        badge: badge,
        source: sourceLabel,
        url: streamUrl,
        streamUrl: streamUrl,
        magnetUrl: magnetUrl,
        embedUrl: ytsWebEmbedUrl,
        infoHash: hit.hash,
        isTorrent: true,
        quality: quality,
        isHls: false,
        isDirectVideo: isLocal,
        isYts: isYts,
        isMp4: isMp4,
        seeds: hit.seeds || 0,
        peers: hit.peers || 0,
        subtitles: defaultSubs,
        priority: isYts ? 1 : 2,
        getUrl: () => streamUrl
      });
    }

    // Sort: YTS first, then by quality (1080p, 4K, 720p), then seeds
    streams.sort((a, b) => {
      if (a.isYts && !b.isYts) return -1;
      if (!a.isYts && b.isYts) return 1;
      return (b.seeds || 0) - (a.seeds || 0);
    });

    // Deduplicate by hash and keep up to 8 top distinct releases
    const unique = [];
    const seenHashes = new Set();
    for (const s of streams) {
      if (!seenHashes.has(s.infoHash)) {
        seenHashes.add(s.infoHash);
        unique.push(s);
      }
      if (unique.length >= 8) break;
    }

    return unique;
  } catch (err) {
    console.warn('[YtsOfficialScraper] Error:', err.message);
    return [];
  }
}
