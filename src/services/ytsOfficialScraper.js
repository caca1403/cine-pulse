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

    const yrParam = year ? `&year=${year}` : '';
    const endpoint = `?api=torrents&mode=${mode}&name=${encodeURIComponent(query)}${yrParam}&quality=all`;

    const data = await fetchYtsApi(endpoint);
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
        const sReg = new RegExp(`(s${sPad}|s${season}[^0-9]|season[.\\s-_]*${season})`, 'i');
        const eReg = new RegExp(`(e${ePad}|e${episode}[^0-9])`, 'i');

        const isSeasonMatch = sReg.test(rawTitle) || /complete|all.?seasons/i.test(rawTitle);
        const isEpisodeMatch = eReg.test(rawTitle) || /complete|all.?seasons/i.test(rawTitle);

        if (!isSeasonMatch || !isEpisodeMatch) {
          continue;
        }
      }

      // Quality detection
      const is4K = lower.includes('2160p') || lower.includes('4k') || lower.includes('uhd');
      const is1080 = lower.includes('1080p');
      const is720 = lower.includes('720p');
      const quality = is4K ? '4K UHD' : is1080 ? '1080p' : is720 ? '720p' : 'HD';

      const isYts = lower.includes('yify') || lower.includes('yts');
      const isMp4 = lower.includes('.mp4') || isYts;

      // Filter out low quality camrips or oversized files (> 14GB)
      if (!is4K && !is1080 && !is720 && !lower.includes('bluray') && !lower.includes('web-dl') && !lower.includes('webrip')) {
        continue;
      }
      if (hit.bytes && hit.bytes > 14 * 1024 * 1024 * 1024) {
        continue;
      }

      const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      const magnetUrl = `magnet:?xt=urn:btih:${hit.hash}&dn=${encodeURIComponent(hit.title || query)}&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=wss://tracker.openwebtorrent.com&tr=wss://tracker.btorrent.xyz`;

      // Official YTS web player engine from en.yts-official.com
      const ytsWebEmbedUrl = tmdbId 
        ? (isMovie ? `https://autoembed.co/movie/tmdb/${tmdbId}` : `https://autoembed.co/tv/tmdb/${tmdbId}/${season}/${episode}`)
        : null;

      const streamUrl = isLocal ? `${MEDIA_SERVER_BASE}/torrent/${hit.hash}` : magnetUrl;
      const sourceLabel = isYts ? 'YTS (YIFY)' : (hit.source || 'YTS P2P');

      const displayName = isYts
        ? `⚡ YTS ${quality} (${hit.title?.includes('2160p') ? '4K' : quality} • S:${hit.seeds || 0})`
        : `⚡ Torrent ${quality} (${isMp4 ? 'MP4' : 'MKV'} • S:${hit.seeds || 0})`;

      const badge = isYts ? `⚡ YTS ${quality}` : `⚡ Torrent ${quality}`;

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
