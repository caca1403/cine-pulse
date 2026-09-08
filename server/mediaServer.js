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
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 4000;
const MEDIA_DIR = path.join(__dirname, '..', 'media_storage');

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
    const mod = await import('webtorrent');
    WebTorrent = mod.default || mod;
    wtClient = new WebTorrent({
      // Maximum connections for faster peer discovery
      maxConns: 100,
      // Enable DHT for decentralized peer discovery
      dht: true,
      // Enable uTP for better NAT traversal
      utp: true
    });

    wtClient.on('error', (err) => {
      console.error('[WebTorrent] Client error:', err.message);
    });

    console.log('[MediaServer] WebTorrent engine initialized');
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
const TORRENT_TIMEOUT_MS = 30 * 60 * 1000;

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

  // Check cache
  if (torrentCache.has(infoHash)) {
    const entry = torrentCache.get(infoHash);
    entry.lastAccess = Date.now();
    const videoFile = getLargestVideoFile(entry.torrent);
    if (videoFile) return { torrent: entry.torrent, file: videoFile };
  }

  // Check if client already has this torrent
  const existing = client.get(infoHash);
  if (existing && existing.files && existing.files.length > 0) {
    torrentCache.set(infoHash, { torrent: existing, lastAccess: Date.now() });
    const videoFile = getLargestVideoFile(existing);
    if (videoFile) return { torrent: existing, file: videoFile };
  }

  // Comprehensive tracker list - both UDP and WebSocket for maximum connectivity
  const trackers = [
    // WebSocket trackers (work through firewalls/NAT)
    'wss://tracker.openwebtorrent.com',
    'wss://tracker.btorrent.xyz',
    'wss://tracker.files.fm:7073/announce',
    // UDP trackers (traditional, fast)
    'udp://tracker.opentrackr.org:1337/announce',
    'udp://open.stealth.si:80/announce',
    'udp://tracker.torrent.eu.org:451/announce',
    'udp://tracker.openbittorrent.com:6969/announce',
    'udp://exodus.desync.com:6969/announce',
    'udp://tracker.tiny-vps.com:6969/announce',
    'udp://open.demonii.com:1337/announce',
    'udp://tracker.moeking.me:6969/announce',
    'udp://explodie.org:6969/announce',
    'udp://tracker.theoks.net:6969/announce',
    // HTTP trackers (most compatible)
    'http://tracker.opentrackr.org:1337/announce',
    'http://tracker.openbittorrent.com:80/announce'
  ];

  const trQuery = trackers.map(t => '&tr=' + encodeURIComponent(t)).join('');
  const magnet = `magnet:?xt=urn:btih:${infoHash}${trQuery}`;

  return new Promise((resolve, reject) => {
    // 60 second timeout for metadata
    const timeout = setTimeout(() => {
      reject(new Error('Torrent metadata timeout (60s) - try again, peers may need time'));
    }, 60000);

    console.log(`[MediaServer] Adding torrent: ${infoHash.substring(0, 10)}... with ${trackers.length} trackers`);

    try {
      client.add(magnet, { 
        path: path.join(MEDIA_DIR, 'torrent_cache'),
        announce: trackers
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
}

// ============ HTTP Server ============

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');

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
      let targetOrigin = '';
      try { targetOrigin = new URL(decodedTarget).origin + '/'; } catch (_) {}

      const ref = reqUrl.searchParams.get('ref') || req.headers['x-proxy-referer'] || req.headers['referer'] || targetOrigin;

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
      res.setHeader('Access-Control-Allow-Origin', '*');
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
        res.setHeader('Access-Control-Allow-Origin', '*');
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
    const season = reqUrl.searchParams.get('season');
    const episode = reqUrl.searchParams.get('episode');

    let targetUrl = subUrl ? decodeURIComponent(subUrl) : null;

    try {
      // If imdbId is given without a direct url, search for Turkish subtitles
      if (!targetUrl && imdbId) {
        const cleanImdb = imdbId.replace(/^tt/, '');
        const osUrl = (season && episode)
          ? `https://rest.opensubtitles.org/search/episode-${episode}/imdbid-${cleanImdb}/season-${season}/sublanguageid-tur`
          : `https://rest.opensubtitles.org/search/imdbid-${cleanImdb}/sublanguageid-tur`;
        
        try {
          const osRes = await fetch(osUrl, {
            headers: { 'User-Agent': 'VLCSub 0.10.0' },
            signal: AbortSignal.timeout(3500)
          });
          if (osRes.ok) {
            const list = await osRes.json();
            if (Array.isArray(list) && list.length > 0 && list[0].SubDownloadLink) {
              targetUrl = list[0].SubDownloadLink;
            }
          }
        } catch (_) {}
      }

      if (!targetUrl) {
        res.writeHead(200, { 'Content-Type': 'text/vtt; charset=utf-8' });
        res.end('WEBVTT\n\n');
        return;
      }

      const subRes = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Referer': targetUrl
        },
        signal: AbortSignal.timeout(6000)
      });

      if (!subRes.ok) {
        res.writeHead(200, { 'Content-Type': 'text/vtt; charset=utf-8' });
        res.end('WEBVTT\n\n');
        return;
      }

      const arrayBuf = await subRes.arrayBuffer();
      let rawBuffer = Buffer.from(arrayBuf);

      // Check for gzip compression header (0x1f, 0x8b)
      if (rawBuffer.length > 2 && rawBuffer[0] === 0x1f && rawBuffer[1] === 0x8b) {
        try {
          rawBuffer = zlib.gunzipSync(rawBuffer);
        } catch (_) {}
      }

      let text = rawBuffer.toString('utf-8');

      // Convert SRT to WebVTT format if needed
      if (!text.startsWith('WEBVTT')) {
        text = 'WEBVTT\n\n' + text.replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2');
      }

      res.writeHead(200, {
        'Content-Type': 'text/vtt; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(text);
    } catch (err) {
      res.writeHead(200, { 'Content-Type': 'text/vtt; charset=utf-8' });
      res.end('WEBVTT\n\n');
    }
    return;
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
      let refOrigin = 'https://x.ag2m4.cfd';
      try { refOrigin = new URL(ref).origin; } catch (_) {}

      const upstreamRes = await fetch(decodedTarget, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': ref,
          'Origin': refOrigin
        }
      });

      const contentType = upstreamRes.headers.get('content-type') || '';
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

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
          return `/api/hls_proxy?url=${encodeURIComponent(fullLineUrl)}&ref=${encodeURIComponent(ref)}`;
        }).join('\n');

        res.writeHead(upstreamRes.status, {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(rewritten);
      } else {
        res.writeHead(upstreamRes.status, {
          'Content-Type': contentType || 'video/mp2t',
          'Access-Control-Allow-Origin': '*'
        });
        const arrayBuf = await upstreamRes.arrayBuffer();
        res.end(Buffer.from(arrayBuf));
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
    const infoHash = decodeURIComponent(reqUrl.pathname.replace('/torrent/', '')).trim();
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

  // ============ Torrent Status Check ============
  if (reqUrl.pathname.startsWith('/torrent-check/')) {
    const infoHash = decodeURIComponent(reqUrl.pathname.replace('/torrent-check/', '')).trim();
    try {
      const { torrent, file } = await getTorrentVideoFile(infoHash);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        ready: true,
        name: torrent.name,
        videoFile: file.name,
        sizeMb: (file.length / 1024 / 1024).toFixed(1),
        progress: (torrent.progress * 100).toFixed(1) + '%',
        downloadSpeed: (torrent.downloadSpeed / 1024).toFixed(0) + ' KB/s',
        peers: torrent.numPeers
      }));
    } catch (err) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ready: false, error: err.message }));
    }
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
    const filePath = path.join(MEDIA_DIR, filename);

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
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
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ status: 'ok', webtorrent: !!wtClient }));
    return;
  }

  // Fallback
  res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
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

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[MediaServer] ✅ Active on http://0.0.0.0:${PORT}`);
  console.log(`[MediaServer] 🎬 Torrent streaming: http://localhost:${PORT}/torrent/<infoHash>`);
  console.log(`[MediaServer] 📁 Local media: ${MEDIA_DIR}`);
});
