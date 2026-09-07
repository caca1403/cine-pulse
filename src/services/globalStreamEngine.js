/* ==========================================================================
   CinePulse Studio - Global Autonomous Streaming Engine
   
   TWO independent autonomous sources:
   
   1. TORRENT ENGINE: Fetches via Torrentio → streams through MediaServer 
      WebTorrent proxy (http://localhost:4000/torrent/HASH)
      
   2. VIDSRC ENGINE: Uses vidsrc.to embed API (TMDB ID based, no site 
      scraping needed, supports dubbed audio for popular content)
   
   Both work WITHOUT depending on any Turkish streaming site.
   Turkish dubbing detection for torrent sources.
   ========================================================================== */

import { fetchYtsOfficialSources } from './ytsOfficialScraper.js';

const TMDB_API_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const MEDIA_SERVER_BASE = 'http://localhost:4000';

// ============ IMDB ID Resolution ============

async function fetchImdbId(type, tmdbId) {
  if (!tmdbId) return null;
  try {
    const endpoint = type === 'movie' ? 'movie' : 'tv';
    const res = await fetch(`https://api.themoviedb.org/3/${endpoint}/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`, {
      signal: AbortSignal.timeout(4500)
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.imdb_id || null;
  } catch (_) {
    return null;
  }
}

// ============ Turkish Dubbing Detection ============

function isTurkishDubbed(title) {
  if (!title) return false;
  const lower = title.toLowerCase();
  return (
    lower.includes('dual') ||
    lower.includes('türkçe') ||
    lower.includes('turkce') ||
    lower.includes('turkish') ||
    lower.includes('tr dub') ||
    lower.includes('tr.dub') ||
    lower.includes('tur.') ||
    lower.includes('[tur]') ||
    lower.includes('(tur)') ||
    lower.includes('multi') ||
    lower.includes('multi audio') ||
    lower.includes('çift dil') ||
    lower.includes('cift dil') ||
    /\btr\b/.test(lower)
  );
}

// ============ Check if MediaServer is running ============

let cachedMediaServerState = null;
let lastMediaServerCheck = 0;

async function isMediaServerAvailable() {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return false;
  }
  const now = Date.now();
  if (cachedMediaServerState !== null && (now - lastMediaServerCheck < 30000)) {
    return cachedMediaServerState;
  }
  try {
    const res = await fetch(`${MEDIA_SERVER_BASE}/health`, { signal: AbortSignal.timeout(1500) });
    cachedMediaServerState = res.ok;
  } catch (_) {
    cachedMediaServerState = false;
  }
  lastMediaServerCheck = now;
  return cachedMediaServerState;
}

// ============ SOURCE 1: Torrent Engine (Torrentio) ============

async function fetchTorrentSources({ type, tmdbId, season, episode, isDub = false, imdbId = null }) {
  const effectiveImdbId = imdbId || await fetchImdbId(type, tmdbId);
  if (!effectiveImdbId) return [];

  const isMovie = type === 'movie';
  const subUrl = isMovie
    ? `/api/subtitles?imdbId=${effectiveImdbId}`
    : `/api/subtitles?imdbId=${effectiveImdbId}&season=${season}&episode=${episode}`;
  const defaultSubs = [{ label: 'Türkçe', src: subUrl }];
  const streamUrl = isMovie
    ? `https://torrentio.strem.fun/stream/movie/${effectiveImdbId}.json`
    : `https://torrentio.strem.fun/stream/series/${effectiveImdbId}:${season}:${episode}.json`;

  try {
    const res = await fetch(streamUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(7500)
    });

    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data.streams) || data.streams.length === 0) return [];

    const serverAvailable = await isMediaServerAvailable();
    const results = [];

    for (const stream of data.streams) {
      if (!stream.infoHash) continue;

      const fullTitle = (stream.title || stream.name || '').replace(/\n/g, ' ');
      const titleLower = fullTitle.toLowerCase();

      // Quality detection
      const is4K = titleLower.includes('2160p') || titleLower.includes('4k');
      const is1080 = titleLower.includes('1080p');
      const is720 = titleLower.includes('720p');
      const qualityLabel = is4K ? '4K UHD' : is1080 ? '1080p' : is720 ? '720p' : 'HD';

      // YTS / YIFY detection (100% web-compatible MP4 files with stereo AAC audio)
      const isYts = titleLower.includes('yts') || titleLower.includes('yify');
      const isMp4 = titleLower.includes('.mp4') || isYts;

      const isTrDub = isTurkishDubbed(fullTitle);
      if (isDub && !isTrDub) {
        continue;
      }

      // Skip low quality or camrips
      if (!is4K && !is1080 && !is720 && !titleLower.includes('bluray') && !titleLower.includes('web-dl') && !titleLower.includes('webrip')) {
        continue;
      }

      // Skip huge files (> 14GB)
      const sizeMatch = fullTitle.match(/([\d.]+)\s*GB/i);
      if (sizeMatch && parseFloat(sizeMatch[1]) > 14) continue;

      const magnetUrl = `magnet:?xt=urn:btih:${stream.infoHash}&dn=${encodeURIComponent(fullTitle)}&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=wss://tracker.openwebtorrent.com&tr=wss://tracker.btorrent.xyz`;
      const ytsWebEmbedUrl = tmdbId 
        ? (isMovie ? `https://vidsrc.mov/embed/movie/${tmdbId}` : `https://vidsrc.mov/embed/tv/${tmdbId}/${season}/${episode}`)
        : null;
      const finalStreamUrl = serverAvailable 
        ? `${MEDIA_SERVER_BASE}/torrent/${stream.infoHash}` 
        : (isTrDub ? magnetUrl : (ytsWebEmbedUrl || magnetUrl));

      const sizeStr = sizeMatch ? sizeMatch[0] : '';
      let displayName = isTrDub
        ? `🇹🇷 DUAL ${qualityLabel} (${sizeStr || 'MKV'})`
        : (isYts
            ? `⚡ YTS ${qualityLabel} (${sizeStr || 'MP4'})`
            : isMp4
              ? `⚡ Torrent ${qualityLabel} (${sizeStr || 'MP4'})`
              : `⚡ Torrent ${qualityLabel} (${sizeStr || 'MKV'})`);

      let badge = isTrDub
        ? `🇹🇷 TR Dublaj`
        : (isYts ? `⚡ YTS ${qualityLabel}` : `⚡ Torrent ${qualityLabel}`);

      results.push({
        id: `cp_global_torrent_${stream.infoHash.substring(0, 10)}`,
        name: displayName,
        displayName: displayName,
        badge,
        source: isYts ? 'YTS (YIFY)' : 'Torrentio P2P',
        url: finalStreamUrl,
        streamUrl: finalStreamUrl,
        magnetUrl: magnetUrl,
        infoHash: stream.infoHash,
        isTorrent: true,
        quality: qualityLabel,
        isHls: false,
        isDirectVideo: serverAvailable,
        isYts,
        isMp4,
        priority: isYts ? 1 : 2,
        subtitles: defaultSubs,
        getUrl: () => finalStreamUrl
      });
    }

    // Sort: YTS / MP4 first, then by quality (1080p -> 720p -> 4K)
    results.sort((a, b) => {
      if (a.isYts && !b.isYts) return -1;
      if (!a.isYts && b.isYts) return 1;
      if (a.isMp4 && !b.isMp4) return -1;
      if (!a.isMp4 && b.isMp4) return 1;
      const qOrder = { '1080p': 0, '720p': 1, '4K': 2, 'HD': 3 };
      return (qOrder[a.quality] ?? 3) - (qOrder[b.quality] ?? 3);
    });

    return results.slice(0, 4);
  } catch (_) {
    return [];
  }
}

// ============ MASTER AUTONOMOUS DISCOVERY ============

/**
 * Resolves autonomous global streams from YTS Official (en.yts-official.com) and Torrentio.
 * Fully integrates Turkish subtitles and hybrid audio support.
 */
export async function fetchGlobalAutonomousSources({
  type = 'movie',
  tmdbId = null,
  title = '',
  originalTitle = '',
  year = null,
  season = 1,
  episode = 1,
  isDub = false
}) {
  if (!tmdbId) return [];

  try {
    const imdbId = await fetchImdbId(type, tmdbId);

    // If dubbed mode: ONLY fetch genuine Turkish / DUAL torrents
    if (isDub) {
      const dubbedTorrents = await fetchTorrentSources({ type, tmdbId, season, episode, isDub: true, imdbId });
      return dubbedTorrents.map(s => ({
        ...s,
        category: 'dubbed'
      }));
    }

    // 1. Subtitled mode: Fetch from YTS Official (en.yts-official.com) and Torrentio in parallel
    const [ytsResults, torrentioResults] = await Promise.allSettled([
      fetchYtsOfficialSources({ type, tmdbId, title, originalTitle, year, season, episode, imdbId, isDub: false }),
      fetchTorrentSources({ type, tmdbId, season, episode, isDub: false, imdbId })
    ]);

    const ytsList = (ytsResults.status === 'fulfilled' && Array.isArray(ytsResults.value)) ? ytsResults.value : [];
    const tioList = (torrentioResults.status === 'fulfilled' && Array.isArray(torrentioResults.value)) ? torrentioResults.value : [];

    // 2. Merge all distinct releases from YTS and Torrentio by unique hash (up to 10 releases)
    const merged = [];
    const seenHashes = new Set();

    for (const s of [...ytsList, ...tioList]) {
      const hash = s.infoHash || s.streamUrl || s.url;
      if (hash && !seenHashes.has(hash)) {
        seenHashes.add(hash);
        merged.push(s);
      }
      if (merged.length >= 10) break;
    }

    // 4. For Subtitled mode: attach Turkish subtitle URL to every stream
    const subUrl = imdbId 
      ? (type === 'movie' ? `/api/subtitles?imdbId=${imdbId}` : `/api/subtitles?imdbId=${imdbId}&season=${season}&episode=${episode}`)
      : null;

    return merged.map(s => ({
      ...s,
      category: 'subtitled',
      subtitles: (Array.isArray(s.subtitles) && s.subtitles.length > 0)
        ? s.subtitles
        : (subUrl ? [{ label: 'Türkçe', src: subUrl }] : [])
    }));
  } catch (err) {
    console.warn('[GlobalStreamEngine] Autonomous fetch error:', err.message);
    return [];
  }
}
