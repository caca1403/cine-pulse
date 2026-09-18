/**
 * CinePulse Autonomous Media Server
 * Converts torrents into direct HTTP video streams via WebTorrent.
 * Also provides a proxy endpoint for external streaming APIs.
 *
 * Endpoints:
 *   GET /torrent/:infoHash   → Streams the largest video file from the torrent
 *   GET /torrent-check/:hash → Check torrent download status
 *   GET /api/list            → Lists local videos in media_storage
 *   GET /stream/:filename    → Streams local files with Range support
 *   GET /health              → Health check
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { Readable } from 'stream';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 4000;
const MEDIA_DIR = path.join(__dirname, '..', 'media_storage');
const requestBuckets = new Map();

function isSafePublicUrl(rawUrl) {
  try {
    const parsed = new URL(String(rawUrl));
    const host = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    if (!host || host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local')) return false;
    if (host.includes('moolightlabel') || host.includes('moonlightlabel') || host.includes('vidsrc.in') || host.includes('adsterra') || host.includes('popads') || host.includes('cricketpivot') || host.includes('bohemo') || host.includes('newsboydurance')) return false;
    if (host === 'metadata.google.internal' || host === '169.254.169.254') return false;
    const ipv4 = host.split('.').map(Number);
    if (ipv4.length === 4 && ipv4.every(value => Number.isInteger(value) && value >= 0 && value <= 255)) {
      if (ipv4[0] === 0 || ipv4[0] === 10 || ipv4[0] === 127
        || (ipv4[0] === 169 && ipv4[1] === 254)
        || (ipv4[0] === 172 && ipv4[1] >= 16 && ipv4[1] <= 31)
        || (ipv4[0] === 192 && ipv4[1] === 168)
        || (ipv4[0] === 100 && ipv4[1] >= 64 && ipv4[1] <= 127)) return false;
    }
    if (host === '::1' || host === '::' || host.startsWith('fc') || host.startsWith('fd') || host.startsWith('fe80:')) return false;
    return true;
  } catch (_) {
    return false;
  }
}

function exceedsRateLimit(req, limit = 1200) {
  const ip = req.socket?.remoteAddress || 'local';
  const now = Date.now();
  const current = requestBuckets.get(ip);
  if (!current || current.resetAt <= now) {
    requestBuckets.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  current.count += 1;
  return current.count > limit;
}

if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.mp4': 'video/mp4',
  '.mkv': 'video/x-matroska',
  '.webm': 'video/webm',
  '.avi': 'video/x-msvideo',
  '.m3u8': 'application/vnd.apple.mpegurl',
  '.ts': 'video/mp2t',
  '.vtt': 'text/vtt',
  '.srt': 'text/plain',
  '.json': 'application/json'
};

// ============ WebTorrent Streaming Engine ============

let WebTorrent = null;
let wtClient = null;

async function getWTClient() {
  if (wtClient) return wtClient;
  try {
    let WebTorrentClass = null;

    // Try ESM import first (webtorrent v3+)
    try {
      const mod = await import('webtorrent');
      WebTorrentClass = mod.default || mod;
    } catch (esmErr) {
      console.warn('[MediaServer] ESM import failed, trying CJS require:', esmErr.message);
      // Fallback to CJS require (webtorrent v1.x)
      try {
        const { createRequire } = await import('module');
        const require = createRequire(import.meta.url);
        WebTorrentClass = require('webtorrent');
      } catch (cjsErr) {
        console.error('[MediaServer] CJS require also failed:', cjsErr.message);
        return null;
      }
    }

    if (!WebTorrentClass) return null;

    WebTorrent = WebTorrentClass;
    wtClient = new WebTorrent({
      maxConns: 250,        // More peer connections = faster metadata
      dht: {
        bootstrap: [
          'router.bittorrent.com:6881',
          'dht.transmissionbt.com:6881',
          'router.utorrent.com:6881'
        ]
      },
      utp: true,
      lsd: true,
      tracker: {
        announce: [
          'wss://tracker.openwebtorrent.com',
          'wss://tracker.btorrent.xyz',
          'http://tracker.opentrackr.org:1337/announce'
        ]
      }
    });

    wtClient.on('error', (err) => {
      console.error('[WebTorrent] Client error:', err.message);
    });

    console.log('[MediaServer] WebTorrent engine initialized successfully');
    return wtClient;
  } catch (err) {
    console.error('[MediaServer] WebTorrent load failed:', err.message);
    return null;
  }
}

// Pre-initialize WebTorrent on startup
getWTClient().catch(() => {});

// Active torrent cache: infoHash -> { torrent, lastAccess }
const torrentCache = new Map();
const pendingTorrents = new Map();
const TORRENT_TIMEOUT_MS = 30 * 60 * 1000;

process.on('unhandledRejection', (reason) => {
  console.warn('[MediaServer] Handled unhandled rejection:', reason?.message || reason);
});

setInterval(() => {
  const now = Date.now();
  for (const [hash, entry] of torrentCache) {
    if (now - entry.lastAccess > TORRENT_TIMEOUT_MS) {
      console.log(`[MediaServer] Cleaning up idle torrent: ${hash.substring(0, 10)}...`);
      try { entry.torrent.destroy(); } catch (_) {}
      torrentCache.delete(hash);
    }
  }
}, 5 * 60 * 1000);

function getLargestVideoFile(torrent) {
  if (!torrent || !torrent.files || torrent.files.length === 0) return null;
  const videoExts = ['.mp4', '.mkv', '.avi', '.webm', '.m4v', '.mov'];
  const videoFiles = torrent.files.filter(f => {
    const ext = path.extname(f.name).toLowerCase();
    return videoExts.includes(ext);
  });
  if (videoFiles.length === 0) return null;

  // Prefer web-native MP4 and WEBM first (plays natively in all browsers)
  const webNative = videoFiles.filter(f => ['.mp4', '.webm', '.m4v'].includes(path.extname(f.name).toLowerCase()));
  if (webNative.length > 0) {
    webNative.sort((a, b) => b.length - a.length);
    return webNative[0];
  }

  videoFiles.sort((a, b) => b.length - a.length);
  return videoFiles[0];
}

async function getTorrentVideoFile(infoHashOrMagnet) {
  const client = await getWTClient();
  if (!client) throw new Error('WebTorrent not available');

  const infoHash = infoHashOrMagnet.startsWith('magnet:')
    ? infoHashOrMagnet.match(/btih:([a-fA-F0-9]+)/)?.[1]?.toLowerCase()
    : infoHashOrMagnet.toLowerCase();

  if (!infoHash) throw new Error('Invalid infoHash');

  // Check ready cache
  if (torrentCache.has(infoHash)) {
    const entry = torrentCache.get(infoHash);
    entry.lastAccess = Date.now();
    const videoFile = getLargestVideoFile(entry.torrent);
    if (videoFile) return { torrent: entry.torrent, file: videoFile };
  }

  // Deduplicate concurrent requests for the same torrent
  if (pendingTorrents.has(infoHash)) {
    return pendingTorrents.get(infoHash);
  }

  // Check if client already has this torrent
  const existing = client.get(infoHash);
  if (existing) {
    if (existing.files && existing.files.length > 0) {
      torrentCache.set(infoHash, { torrent: existing, lastAccess: Date.now() });
      const videoFile = getLargestVideoFile(existing);
      if (videoFile) return { torrent: existing, file: videoFile };
    }
    // Existing torrent whose metadata hasn't loaded yet - wait for it
    const existingPromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        try {
          if (existing && (!existing.files || existing.files.length === 0)) existing.destroy();
        } catch (_) {}
        reject(new Error('Torrent metadata timeout (13s) - no peers found'));
      }, 13000);
      existing.once('metadata', () => {
        clearTimeout(timeout);
        torrentCache.set(infoHash, { torrent: existing, lastAccess: Date.now() });
        const videoFile = getLargestVideoFile(existing);
        if (videoFile) resolve({ torrent: existing, file: videoFile });
        else reject(new Error('No video file found in torrent'));
      });
      existing.once('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
    pendingTorrents.set(infoHash, existingPromise);
    existingPromise.catch(() => {}).finally(() => pendingTorrents.delete(infoHash));
    return existingPromise;
  }

  // Best public trackers for fast metadata resolution (WSS & HTTP first for speed)
  const trackers = [
    // === WSS TRACKERS (WebSocket - fast, reliable, bypasses ISP UDP filtering) ===
    'wss://tracker.openwebtorrent.com',
    'wss://tracker.btorrent.xyz',
    'wss://tracker.files.fm:7073/announce',
    'wss://spacetrackr.link:443/announce',
    'wss://tracker.fastcast.nz:443/announce',
    // === HTTP / HTTPS TRACKERS ===
    'http://tracker.opentrackr.org:1337/announce',
    'http://tracker.openbittorrent.com:80/announce',
    'http://open.acgnxtracker.com:80/announce',
    'http://bt.endpot.com:80/announce',
    'https://tracker.tamersunion.org:443/announce',
    'https://tracker.nanoha.org:443/announce',
    // === UDP TRACKERS (High capacity swarm) ===
    'udp://tracker.opentrackr.org:1337/announce',
    'udp://open.stealth.si:80/announce',
    'udp://tracker.openbittorrent.com:6969/announce',
    'udp://open.demonii.com:1337/announce',
    'udp://exodus.desync.com:6969/announce',
    'udp://tracker.torrent.eu.org:451/announce',
    'udp://tracker.moeking.me:6969/announce',
    'udp://explodie.org:6969/announce',
    'udp://tracker1.bt.moack.co.kr:80/announce',
    'udp://tracker.theoks.net:6969/announce',
    'udp://tracker.tiny-vps.com:6969/announce',
    'udp://tracker.auctor.tv:6969/announce',
    'udp://tracker.bittor.pw:1337/announce',
    'udp://retracker01-msk-virt.corbina.net:80/announce',
    'udp://tracker.dler.org:6969/announce',
    'udp://tracker.leechershaven.org:6969/announce',
    'udp://tracker2.dler.org:80/announce'
  ];

  const trQuery = trackers.map(t => '&tr=' + encodeURIComponent(t)).join('');
  const magnet = `magnet:?xt=urn:btih:${infoHash}${trQuery}`;

  const loadPromise = new Promise((resolve, reject) => {
    // 13 second timeout for metadata (user can't wait longer)
    const timeout = setTimeout(() => {
      try {
        const tor = client.get(infoHash);
        if (tor && (!tor.files || tor.files.length === 0)) tor.destroy();
      } catch (_) {}
      reject(new Error('Torrent metadata timeout (13s) - no peers found'));
    }, 13000);

    console.log(`[MediaServer] Adding torrent: ${infoHash.substring(0, 10)}... with ${trackers.length} trackers`);

    try {
      client.add(magnet, { 
        path: path.join(MEDIA_DIR, 'torrent_cache'),
        announce: trackers,
        maxWebConns: 50,
        skipVerification: true
      }, (torrent) => {
        clearTimeout(timeout);
        console.log(`[MediaServer] Torrent ready: ${torrent.name} (${torrent.files.length} files)`);

        torrentCache.set(infoHash, { torrent, lastAccess: Date.now() });

        const videoFile = getLargestVideoFile(torrent);
        if (!videoFile) {
          reject(new Error('No video file found in torrent'));
          return;
        }

        // Prioritize the video file, deselect others
        torrent.files.forEach(f => f.deselect());
        videoFile.select();

        console.log(`[MediaServer] Streaming: ${videoFile.name} (${(videoFile.length / 1024 / 1024).toFixed(1)} MB)`);
        resolve({ torrent, file: videoFile });
      });
    } catch (addErr) {
      clearTimeout(timeout);
      reject(new Error('Failed to add torrent: ' + addErr.message));
    }
  });

  pendingTorrents.set(infoHash, loadPromise);
  loadPromise.catch(() => {}).finally(() => pendingTorrents.delete(infoHash));
  return loadPromise;
}

// ============ HTTP Server ============

const server = http.createServer(async (req, res) => {
  const requestOrigin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', requestOrigin === 'null' ? '*' : requestOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'same-origin');

  if (exceedsRateLimit(req)) {
    res.writeHead(429, { 'Content-Type': 'application/json', 'Retry-After': '60' });
    res.end(JSON.stringify({ error: 'Too many requests' }));
    return;
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://localhost:${PORT}`);

  // ============ Health Check ============
  if (reqUrl.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      webtorrent: !!wtClient,
      activeTorrents: torrentCache.size 
    }));
    return;
  }

  // ============ General HTML/API Proxy (Bypasses browser CORS & worker dropouts) ============
  if (reqUrl.pathname === '/proxy' || reqUrl.pathname === '/api/proxy') {
    const rawTarget = reqUrl.searchParams.get('url');
    if (!rawTarget) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing url param');
      return;
    }
    try {
      const decodedTarget = decodeURIComponent(rawTarget);
      if (!isSafePublicUrl(decodedTarget)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Target blocked');
        return;
      }
      let targetOrigin = '';
      try { targetOrigin = new URL(decodedTarget).origin + '/'; } catch (_) {}

      let ref = reqUrl.searchParams.get('ref') || req.headers['x-proxy-referer'];
      if (!ref) {
        if (decodedTarget.includes('ag2m4') || decodedTarget.includes('dizibal')) {
          ref = 'https://dizibal.org/';
        } else if (decodedTarget.includes('vidmoly')) {
          ref = 'https://vidmoly.net/';
        } else if (decodedTarget.includes('sibnet.ru')) {
          ref = 'https://video.sibnet.ru/';
        } else if (decodedTarget.includes('cizgimax')) {
          ref = 'https://cizgimax.online/';
        } else {
          ref = targetOrigin;
        }
      }

      const customHeaders = {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      };
      if (ref) customHeaders['Referer'] = decodeURIComponent(ref);
      if (targetOrigin) customHeaders['Origin'] = new URL(decodedTarget).origin;
      if (req.headers['x-hdf-nonce']) customHeaders['X-HDF-Nonce'] = req.headers['x-hdf-nonce'];
      if (req.headers['x-requested-with']) customHeaders['X-Requested-With'] = req.headers['x-requested-with'];

      const upstreamRes = await fetch(decodedTarget, {
        headers: customHeaders
      });
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      const arrayBuf = await upstreamRes.arrayBuffer();
      if (!res.headersSent) {
        res.writeHead(upstreamRes.status, {
          'Content-Type': upstreamRes.headers.get('content-type') || 'text/html; charset=utf-8'
        });
      }
      res.end(Buffer.from(arrayBuf));
    } catch (err) {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
      }
      res.end(`Proxy Error: ${err.message}`);
    }
    return;
  }

  // ============ WebVTT Subtitle Proxy & Auto-Converter ============
  if (reqUrl.pathname === '/subtitles' || reqUrl.pathname === '/api/subtitles') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Content-Type', 'text/vtt; charset=utf-8');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const subUrl = reqUrl.searchParams.get('url');
    const imdbId = reqUrl.searchParams.get('imdbId');
    const tmdbId = reqUrl.searchParams.get('tmdbId');
    const titleParam = reqUrl.searchParams.get('title') || reqUrl.searchParams.get('q');
    const season = reqUrl.searchParams.get('season');
    const episode = reqUrl.searchParams.get('episode');
    const mediaType = reqUrl.searchParams.get('type') || (season ? 'tv' : 'movie');

    let targetUrl = subUrl ? decodeURIComponent(subUrl) : null;
    let explicitEncoding = null;

    function secToVttTime(seconds) {
      if (isNaN(seconds) || seconds < 0) seconds = 0;
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60);
      const ms = Math.floor((seconds % 1) * 1000);
      const pad = (num, size = 2) => String(num).padStart(size, '0');
      return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(ms, 3)}`;
    }

    function microDvdToVtt(subText) {
      const lines = subText.split(/\r?\n/);
      let fps = 23.976;
      const cues = [];

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const fpsMatch = trimmed.match(/^\{(\d+)\}\{(\d+)\}([0-9.]+)$/);
        if (fpsMatch && Number(fpsMatch[3]) > 10 && Number(fpsMatch[3]) < 120) {
          fps = parseFloat(fpsMatch[3]);
          continue;
        }

        const match = trimmed.match(/^\{(\d+)\}\{(\d+)\}(.*)$/);
        if (match) {
          const startFrame = parseInt(match[1], 10);
          const endFrame = parseInt(match[2], 10);
          let cueText = match[3];

          cueText = cueText
            .replace(/\{Y:i\}/gi, '<i>')
            .replace(/\{\/Y:i\}/gi, '</i>')
            .replace(/\{Y:b\}/gi, '<b>')
            .replace(/\{\/Y:b\}/gi, '</b>')
            .replace(/\{[^}]+\}/g, '')
            .replace(/<\/?c[^>]*>/gi, '')
            .replace(/\|/g, '\n')
            .trim();

          if (!cueText) continue;

          const startTime = secToVttTime(startFrame / fps);
          const endTime = secToVttTime(endFrame / fps);
          cues.push(`${startTime} --> ${endTime}\n${cueText}`);
        }
      }

      return 'WEBVTT\n\n' + cues.join('\n\n') + '\n';
    }

    function convertToWebVtt(rawText) {
      let text = (rawText || '').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
      if (text.startsWith('WEBVTT')) return text;
      if (/^\{\d+\}\{\d+\}/m.test(text)) {
        return microDvdToVtt(text);
      }
      text = text.replace(/.*(?:OpenSubtitles|osdb\.link|ai\.OpenSubtitles|VIP\s*üyelik).*\n?/gi, '');
      text = text.replace(/(\d{1,2}:\d{2}:\d{2})[,.](\d{3})/g, '$1.$2');
      text = text.replace(/(?:^|\n)(\d):(\d{2}:\d{2}\.\d{3})/g, '\n0$1:$2');
      return 'WEBVTT\n\n' + text.trim() + '\n';
    }

    try {
      if (!targetUrl && (imdbId || tmdbId || titleParam)) {
        let resolvedImdb = imdbId && String(imdbId).startsWith('tt') ? imdbId : null;
        let resolvedTitle = titleParam ? decodeURIComponent(titleParam) : null;

        // 1. Resolve TMDB ID -> IMDB ID & Title if needed
        const rawTmdb = tmdbId || (!String(imdbId).startsWith('tt') ? imdbId : null);
        if (rawTmdb && (!resolvedImdb || !resolvedTitle)) {
          const TMDB_KEYS = ['4e44d9029b1270a757cddc766a1bcb63', '844dba0bfd8f3a4f3799f6130ef9e335'];
          for (const key of TMDB_KEYS) {
            try {
              if (!resolvedImdb) {
                const extRes = await fetch(
                  `https://api.themoviedb.org/3/${mediaType}/${rawTmdb}/external_ids?api_key=${key}`,
                  { signal: AbortSignal.timeout(3000) }
                );
                if (extRes.ok) {
                  const extData = await extRes.json();
                  if (extData.imdb_id) resolvedImdb = extData.imdb_id;
                }
              }
              if (!resolvedTitle) {
                const detRes = await fetch(
                  `https://api.themoviedb.org/3/${mediaType}/${rawTmdb}?api_key=${key}`,
                  { signal: AbortSignal.timeout(3000) }
                );
                if (detRes.ok) {
                  const detData = await detRes.json();
                  resolvedTitle = detData.name || detData.title || detData.original_name || detData.original_title;
                }
              }
              if (resolvedImdb) break;
            } catch (_) {}
          }
        }

        // Step A: Try Stremio OpenSubtitles v3 (Fastest, pre-converted UTF-8 SRT)
        if (resolvedImdb) {
          try {
            const stremioUrl = (season && episode)
              ? `https://opensubtitles-v3.strem.io/subtitles/series/${resolvedImdb}:${season}:${episode}.json`
              : `https://opensubtitles-v3.strem.io/subtitles/movie/${resolvedImdb}.json`;
            
            const sRes = await fetch(stremioUrl, { signal: AbortSignal.timeout(4000) });
            if (sRes.ok) {
              const sData = await sRes.json();
              const trSubs = (sData.subtitles || []).filter(s => s && s.lang === 'tur' && s.url);
              if (trSubs.length > 0) {
                trSubs.sort((a, b) => {
                  const aSrt = (a.subtitleFileName || '').endsWith('.srt') ? 10 : 0;
                  const bSrt = (b.subtitleFileName || '').endsWith('.srt') ? 10 : 0;
                  return bSrt - aSrt;
                });
                targetUrl = trSubs[0].url;
                explicitEncoding = trSubs[0].SubEncoding || 'UTF-8';
              }
            }
          } catch (_) {}
        }

        // Step B: Fallback to rest.opensubtitles.org (with safe redirect and ranking)
        if (!targetUrl) {
          const cleanImdb = resolvedImdb ? String(resolvedImdb).replace(/^tt/, '') : null;
          let osCandidates = [];

          async function fetchOs(url) {
            let curr = url;
            for (let attempt = 0; attempt < 3; attempt++) {
              const r = await fetch(curr, {
                headers: { 'User-Agent': 'TemporaryUserAgent', 'Accept': 'application/json' },
                redirect: 'manual',
                signal: AbortSignal.timeout(4500)
              });
              if (r.status >= 300 && r.status < 400) {
                let loc = r.headers.get('location');
                if (loc) {
                  if (loc.startsWith('https://_/')) loc = loc.replace('https://_/', 'https://rest.opensubtitles.org/');
                  else if (loc.startsWith('/')) loc = 'https://rest.opensubtitles.org' + loc;
                  curr = loc;
                  continue;
                }
              }
              if (r.ok) return await r.json();
              return null;
            }
          }

          // B1. Try IMDB ID search
          if (cleanImdb && !cleanImdb.match(/^[0-9]{1,4}$/)) {
            const osUrl = (season && episode)
              ? `https://rest.opensubtitles.org/search/episode-${episode}/imdbid-${cleanImdb}/season-${season}/sublanguageid-tur`
              : `https://rest.opensubtitles.org/search/imdbid-${cleanImdb}/sublanguageid-tur`;
            try {
              const list = await fetchOs(osUrl);
              if (Array.isArray(list) && list.length > 0) osCandidates.push(...list);
            } catch (_) {}
          }

          // B2. Try title query search if no candidates
          if (osCandidates.length === 0 && resolvedTitle) {
            const cleanQ = encodeURIComponent(resolvedTitle.replace(/[^\w\s]/gi, ' ').trim().toLowerCase()).replace(/%20/g, '+');
            if (cleanQ) {
              const qUrl = (season && episode)
                ? `https://rest.opensubtitles.org/search/episode-${episode}/query-${cleanQ}/season-${season}/sublanguageid-tur`
                : `https://rest.opensubtitles.org/search/query-${cleanQ}/sublanguageid-tur`;
              try {
                const list = await fetchOs(qUrl);
                if (Array.isArray(list) && list.length > 0) osCandidates.push(...list);
              } catch (_) {}
            }
          }

          // Score & rank candidates
          const validCandidates = osCandidates.filter(c => c && c.SubDownloadLink);
          if (validCandidates.length > 0) {
            validCandidates.sort((a, b) => {
              const aSrt = (a.SubFormat || '').toLowerCase() === 'srt' ? 25 : 0;
              const bSrt = (b.SubFormat || '').toLowerCase() === 'srt' ? 25 : 0;
              const aForced = a.SubForeignPartsOnly === '1' ? -40 : 0;
              const bForced = b.SubForeignPartsOnly === '1' ? -40 : 0;
              const aCD = /cd\s*[2-9]/i.test(a.SubFileName || '') ? -20 : 0;
              const bCD = /cd\s*[2-9]/i.test(b.SubFileName || '') ? -20 : 0;
              const aDl = parseInt(a.SubDownloadsCnt || 0, 10);
              const bDl = parseInt(b.SubDownloadsCnt || 0, 10);
              return (bSrt + bForced + bCD + Math.min(bDl / 500, 15)) - (aSrt + aForced + aCD + Math.min(aDl / 500, 15));
            });
            targetUrl = validCandidates[0].SubDownloadLink;
            explicitEncoding = validCandidates[0].SubEncoding;
          }
        }
      }

      if (!targetUrl) {
        res.writeHead(200, { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/vtt; charset=utf-8' });
        res.end('WEBVTT\n\n');
        return;
      }

      if (!isSafePublicUrl(targetUrl)) {
        res.writeHead(200, { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/vtt; charset=utf-8' });
        res.end('WEBVTT\n\n');
        return;
      }

      const subRes = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Referer': targetUrl
        },
        signal: AbortSignal.timeout(8000)
      });

      if (!subRes.ok) {
        res.writeHead(200, { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/vtt; charset=utf-8' });
        res.end('WEBVTT\n\n');
        return;
      }

      const arrayBuf = await subRes.arrayBuffer();
      let rawBuffer = Buffer.from(arrayBuf);

      // Gunzip if gzip compressed
      if (rawBuffer.length > 2 && rawBuffer[0] === 0x1f && rawBuffer[1] === 0x8b) {
        try {
          rawBuffer = zlib.gunzipSync(rawBuffer);
        } catch (_) {}
      }

      // Check encoding: If invalid UTF-8 bytes are detected (\uFFFD), decode as windows-1254 (Turkish ANSI)
      let text = '';
      const utf8Candidate = rawBuffer.toString('utf-8');
      if (utf8Candidate.includes('\uFFFD')) {
        try {
          text = new TextDecoder('windows-1254').decode(rawBuffer);
        } catch (_) {
          text = utf8Candidate;
        }
      } else {
        text = utf8Candidate;
      }

      const vttOutput = convertToWebVtt(text);

      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/vtt; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=86400'
      });
      res.end(vttOutput);
    } catch (err) {
      res.writeHead(200, { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/vtt; charset=utf-8' });
      res.end('WEBVTT\n\n');
    }
    return;
  }

  // ============ HDFilmCehennemi Direct Stream & Subtitle Resolver ============
  if (reqUrl.pathname === '/hdfc_stream' || reqUrl.pathname === '/api/hdfc_stream') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const query = reqUrl.searchParams.get('query') || reqUrl.searchParams.get('title') || '';
    const originalTitle = reqUrl.searchParams.get('originalTitle') || '';

    if (!query && !originalTitle) {
      res.writeHead(400);
      res.end(JSON.stringify({ success: false, error: 'Query or title required' }));
      return;
    }

    const cacheKey = `${query.toLowerCase().trim()}__${originalTitle.toLowerCase().trim()}`;
    if (globalThis._hdfcCache && globalThis._hdfcCache.has(cacheKey)) {
      const cached = globalThis._hdfcCache.get(cacheKey);
      if (Date.now() - cached.time < 30 * 60 * 1000) {
        res.writeHead(200);
        res.end(JSON.stringify(cached.data));
        return;
      }
    }

    const scriptPath = path.join(__dirname, 'hdfc_extractor.py');
    const args = [scriptPath, query, originalTitle];

    execFile('python3', args, { timeout: 25000 }, (err, stdout, stderr) => {
      if (err || !stdout) {
        res.writeHead(200);
        res.end(JSON.stringify({ success: false, error: err?.message || 'Extraction failed' }));
        return;
      }
      try {
        const data = JSON.parse(stdout.trim());
        if (data.success && data.streamUrl) {
          const proxiedUrl = `/api/hls_proxy?url=${encodeURIComponent(data.streamUrl)}&ref=${encodeURIComponent('https://hdfilmcehennemi.mobi/')}`;
          const resultData = {
            success: true,
            streamUrl: proxiedUrl,
            rawStreamUrl: data.streamUrl,
            movieUrl: data.movieUrl,
            subtitles: data.subtitles || []
          };
          if (!globalThis._hdfcCache) globalThis._hdfcCache = new Map();
          globalThis._hdfcCache.set(cacheKey, { time: Date.now(), data: resultData });
          res.writeHead(200);
          res.end(JSON.stringify(resultData));
        } else {
          res.writeHead(200);
          res.end(JSON.stringify({ success: false, message: data.message || 'Stream not found' }));
        }
      } catch (parseErr) {
        res.writeHead(200);
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON output from extractor' }));
      }
    });
    return;
  }

  // ============ Dizisol API Proxy ============
  if (reqUrl.pathname.startsWith('/api/dzs') || reqUrl.pathname.startsWith('/dzs')) {
    const subPath = reqUrl.pathname.replace(/^(\/api)?\/dzs/, '') || '/';
    const targetUrl = `https://dizisol.com/api${subPath}${reqUrl.search}`;
    try {
      const upstreamRes = await fetch(targetUrl, {
        method: req.method,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': 'https://dizisol.com/',
          'Accept': 'application/json, text/plain, */*'
        }
      });
      const data = await upstreamRes.text();
      res.writeHead(upstreamRes.status, {
        'Content-Type': upstreamRes.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(data);
      return;
    } catch (err) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
      return;
    }
  }

  // ============ Live TV Dynamic Stream Resolver (DMAX, TLC) ============
  if (reqUrl.pathname === '/live_tv_stream' || reqUrl.pathname === '/api/live_tv_stream') {
    const channel = (reqUrl.searchParams.get('channel') || '').toLowerCase();
    try {
      let pageUrl = '';
      let refUrl = '';
      if (channel === 'dmax') {
        pageUrl = 'https://www.dmax.com.tr/canli-izle';
        refUrl = 'https://www.dmax.com.tr/';
      } else if (channel === 'tlc') {
        pageUrl = 'https://www.tlctv.com.tr/canli-izle';
        refUrl = 'https://www.tlctv.com.tr/';
      } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unsupported channel' }));
        return;
      }

      const now = Date.now();
      if (globalThis._liveTvCache && globalThis._liveTvCache[channel] && globalThis._liveTvCache[channel].exp > now) {
        res.writeHead(302, { 'Location': globalThis._liveTvCache[channel].url });
        res.end();
        return;
      }

      const pageRes = await fetch(pageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
        }
      });
      const html = await pageRes.text();
      const m = html.match(/daionUrl\s*:\s*['"]([^'"]+)['"]/);
      if (!m || !m[1]) {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to extract live stream URL' }));
        return;
      }
      const daionUrl = m[1];
      const proxiedUrl = `/api/hls_proxy?url=${encodeURIComponent(daionUrl)}&ref=${encodeURIComponent(refUrl)}`;

      if (!globalThis._liveTvCache) globalThis._liveTvCache = {};
      globalThis._liveTvCache[channel] = {
        url: proxiedUrl,
        exp: now + 5 * 60 * 1000
      };

      res.writeHead(302, { 'Location': proxiedUrl });
      res.end();
      return;
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
      return;
    }
  }

  // ============ HLS Proxy Endpoint (Bypasses Referer & Origin Blocks) ============
  if (reqUrl.pathname === '/hls_proxy' || reqUrl.pathname === '/api/hls_proxy') {
    const rawTarget = reqUrl.searchParams.get('url') || '';
    const ref = reqUrl.searchParams.get('ref') || 'https://x.ag2m4.cfd/';
    if (!rawTarget) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing url param');
      return;
    }

    try {
      const decodedTarget = decodeURIComponent(rawTarget);
      if (!isSafePublicUrl(decodedTarget)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Target blocked');
        return;
      }
      const upstreamHeaders = {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      };

      if (req.headers.range) {
        upstreamHeaders['Range'] = req.headers.range;
      }

      if (decodedTarget.includes('meatort') || decodedTarget.includes('lookmovie')) {
        upstreamHeaders['Referer'] = 'https://lookmovie2.la/';
      } else if (ref && !ref.includes('ag2m4')) {
        upstreamHeaders['Referer'] = ref;
        try {
          const origin = new URL(ref).origin;
          if (origin && !origin.includes('ag2m4')) upstreamHeaders['Origin'] = origin;
        } catch (_) {}
      } else {
        upstreamHeaders['Referer'] = ref;
      }

      const upstreamRes = await fetch(decodedTarget, {
        headers: upstreamHeaders
      });

      const contentType = upstreamRes.headers.get('content-type') || '';
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
      res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');

      if (decodedTarget.includes('.m3u8') || decodedTarget.includes('.txt') || contentType.includes('mpegurl') || contentType.includes('application/x-mpegURL') || contentType.includes('text/plain')) {
        const text = await upstreamRes.text();
        const baseOrigin = new URL(decodedTarget).origin;

        const rewritten = text.split('\n').map(line => {
          let currentLine = line;
          const trimmed = currentLine.trim();
          if (!trimmed) return line;

          if (trimmed.includes('URI="')) {
            currentLine = currentLine.replace(/URI="([^"]+)"/g, (m, u) => {
              let fullU;
              if (u.startsWith('http')) fullU = u;
              else if (u.startsWith('/')) fullU = `${baseOrigin}${u}`;
              else {
                const urlPath = new URL(decodedTarget).pathname;
                const lastSlash = urlPath.lastIndexOf('/');
                const dir = lastSlash !== -1 ? urlPath.substring(0, lastSlash + 1) : '/';
                fullU = `${baseOrigin}${dir}${u}`;
              }
              return `URI="/api/hls_proxy?url=${encodeURIComponent(fullU)}&ref=${encodeURIComponent(ref)}"`;
            });
          }

          if (trimmed.startsWith('#')) return currentLine;

          let fullLineUrl;
          if (trimmed.startsWith('http')) {
            fullLineUrl = trimmed;
          } else if (trimmed.startsWith('/')) {
            fullLineUrl = `${baseOrigin}${trimmed}`;
          } else {
            const urlPath = new URL(decodedTarget).pathname;
            const lastSlash = urlPath.lastIndexOf('/');
            const dir = lastSlash !== -1 ? urlPath.substring(0, lastSlash + 1) : '/';
            fullLineUrl = `${baseOrigin}${dir}${trimmed}`;
          }

          // If the segment or sub-manifest allows direct CORS (*), bypass local proxy for zero-lag streaming
          if (
            fullLineUrl.includes('dizisol.com/m3u8?u=') ||
            fullLineUrl.includes('superadjacentsoddenly.xyz') ||
            fullLineUrl.includes('photour.org') ||
            fullLineUrl.includes('cdnimages') ||
            fullLineUrl.includes('vidmixi.com/m3u')
          ) {
            return fullLineUrl;
          }

          return `/api/hls_proxy?url=${encodeURIComponent(fullLineUrl)}&ref=${encodeURIComponent(ref)}`;
        }).join('\n');

        res.writeHead(upstreamRes.status, {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache'
        });
        res.end(rewritten);
      } else {
        const headers = {
          'Content-Type': contentType || 'video/mp4',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Range, Content-Type, Authorization',
          'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges',
          'Accept-Ranges': upstreamRes.headers.get('accept-ranges') || 'bytes',
          'Cache-Control': 'public, max-age=86400, immutable'
        };
        const contentLength = upstreamRes.headers.get('content-length');
        if (contentLength) headers['Content-Length'] = contentLength;
        const contentRange = upstreamRes.headers.get('content-range');
        if (contentRange) headers['Content-Range'] = contentRange;

        res.writeHead(upstreamRes.status, headers);
        if (upstreamRes.body) {
          const stream = Readable.fromWeb(upstreamRes.body);
          stream.on('error', () => {
            if (!res.writableEnded) res.end();
          });
          req.on('close', () => {
            stream.destroy();
          });
          stream.pipe(res);
        } else {
          res.end();
        }
      }
    } catch (err) {
      console.error('[MediaServer] HLS Proxy error:', err.message);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`HLS Proxy Error: ${err.message}`);
    }
    return;
  }

  // ============ Torrent Streaming Endpoint ============
  if (reqUrl.pathname.startsWith('/torrent/')) {
    const infoHash = decodeURIComponent(reqUrl.pathname.replace('/torrent/', '')).trim().toLowerCase();
    if (!infoHash || infoHash.length < 10) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid infoHash');
      return;
    }

    try {
      const { file } = await getTorrentVideoFile(infoHash);
      const fileSize = file.length;
      const ext = path.extname(file.name).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'video/mp4';
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + 5 * 1024 * 1024, fileSize - 1);

        if (start >= fileSize) {
          res.writeHead(416, { 'Content-Range': `bytes */${fileSize}` });
          res.end();
          return;
        }

        const chunksize = (end - start) + 1;
        const stream = file.createReadStream({ start, end });

        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': contentType
        });

        stream.pipe(res);
        stream.on('error', (err) => {
          console.error('[MediaServer] Stream error:', err.message);
          if (!res.headersSent) res.writeHead(500);
          res.end();
        });
      } else {
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Accept-Ranges': 'bytes',
          'Content-Type': contentType
        });
        const stream = file.createReadStream();
        stream.pipe(res);
        stream.on('error', (err) => {
          console.error('[MediaServer] Stream error:', err.message);
          res.end();
        });
      }
    } catch (err) {
      console.error('[MediaServer] Torrent error:', err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // ============ Torrent Status Check (Non-Blocking) ============
  if (reqUrl.pathname.startsWith('/torrent-check/')) {
    const infoHash = decodeURIComponent(reqUrl.pathname.replace('/torrent-check/', '')).trim().toLowerCase();
    if (!infoHash || infoHash.length < 10) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ready: false, error: 'Invalid infoHash' }));
      return;
    }

    // If already in cache and ready, return immediately
    if (torrentCache.has(infoHash)) {
      const entry = torrentCache.get(infoHash);
      entry.lastAccess = Date.now();
      const videoFile = getLargestVideoFile(entry.torrent);
      if (videoFile) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          ready: true,
          name: entry.torrent.name,
          videoFile: videoFile.name,
          sizeMb: (videoFile.length / 1024 / 1024).toFixed(1),
          progress: (entry.torrent.progress * 100).toFixed(1) + '%',
          downloadSpeed: Math.round(entry.torrent.downloadSpeed / 1024) + ' KB/s',
          peers: entry.torrent.numPeers
        }));
        return;
      }
    }

    // Not ready yet - check if client is currently fetching peers
    const existing = wtClient ? wtClient.get(infoHash) : null;
    const currentPeers = existing ? (existing.numPeers || 0) : 0;
    const hasMetadata = Boolean(existing && existing.files && existing.files.length > 0);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      ready: hasMetadata, 
      starting: true, 
      peers: currentPeers, 
      message: currentPeers > 0 ? `${currentPeers} peer ile bağlanılıyor...` : 'Torrent başlatılıyor...' 
    }));

    // Start loading in background (fire and forget - cache will be populated)
    getTorrentVideoFile(infoHash).catch(err => {
      console.log(`[MediaServer] Background torrent load: ${err.message}`);
    });
    return;
  }

  // ============ Local File Listing ============
  if (reqUrl.pathname === '/api/list') {
    try {
      const files = fs.readdirSync(MEDIA_DIR);
      const videoFiles = files.filter(f => /\.(mp4|mkv|webm|m3u8)$/i.test(f)).map(name => {
        const stats = fs.statSync(path.join(MEDIA_DIR, name));
        return { name, sizeMb: (stats.size / (1024 * 1024)).toFixed(2), url: `/stream/${encodeURIComponent(name)}` };
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ count: videoFiles.length, videos: videoFiles }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // ============ Local File Streaming ============
  if (reqUrl.pathname.startsWith('/stream/')) {
    const filename = decodeURIComponent(reqUrl.pathname.replace('/stream/', ''));
    const filePath = path.resolve(MEDIA_DIR, filename);
    const mediaRoot = path.resolve(MEDIA_DIR) + path.sep;

    if (!filePath.startsWith(mediaRoot) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Video not found on server');
      return;
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      if (start >= fileSize) { res.writeHead(416, { 'Content-Range': `bytes */${fileSize}` }); res.end(); return; }
      const chunksize = (end - start) + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': contentType
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, { 'Content-Length': fileSize, 'Accept-Ranges': 'bytes', 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    }
    return;
  }

  // ============ Health Check ============
  if (reqUrl.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', webtorrent: !!wtClient }));
    return;
  }

  // Fallback
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'ok',
    name: 'CinePulse Autonomous Media Server',
    webtorrent: !!wtClient,
    endpoints: {
      '/torrent/:infoHash': 'Stream torrent as HTTP video',
      '/torrent-check/:infoHash': 'Check torrent status',
      '/health': 'Health check',
      '/api/list': 'List local videos',
      '/stream/:filename': 'Stream local files'
    }
  }));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[MediaServer] ✅ Active on http://127.0.0.1:${PORT}`);
  console.log(`[MediaServer] 🎬 Torrent streaming: http://localhost:${PORT}/torrent/<infoHash>`);
  console.log(`[MediaServer] 📁 Local media: ${MEDIA_DIR}`);
});
