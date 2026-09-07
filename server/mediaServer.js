/**
 * CinePulse Private Media Server
 * Runs locally on your machine, streams videos via HTTP 206 (Range requests)
 * Fully compatible with HTML5 video, multiple audio tracks, and VTT subtitles.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 4000;
const MEDIA_DIR = path.join(__dirname, '..', 'media_storage');

// Create media storage folder if not exists
if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

// MIME types
const MIME_TYPES = {
  '.mp4': 'video/mp4',
  '.mkv': 'video/x-matroska',
  '.webm': 'video/webm',
  '.m3u8': 'application/vnd.apple.mpegurl',
  '.ts': 'video/mp2t',
  '.vtt': 'text/vtt',
  '.srt': 'text/plain',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  // CORS Headers
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

  // API 1: List all videos available on this server
  if (reqUrl.pathname === '/api/list') {
    try {
      const files = fs.readdirSync(MEDIA_DIR);
      const videoFiles = files.filter(f => /\.(mp4|mkv|webm|m3u8)$/i.test(f)).map(name => {
        const stats = fs.statSync(path.join(MEDIA_DIR, name));
        return {
          name,
          sizeMb: (stats.size / (1024 * 1024)).toFixed(2),
          url: `/stream/${encodeURIComponent(name)}`
        };
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ count: videoFiles.length, videos: videoFiles }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // API 2: Video Streaming with Range Requests (Partial Content)
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
      // Parse Range Header: "bytes=start-end"
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        res.writeHead(416, {
          'Content-Range': `bytes */${fileSize}`
        });
        res.end();
        return;
      }

      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Accept-Ranges': 'bytes',
        'Content-Type': contentType,
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
    return;
  }

  // Fallback
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('CinePulse Private Media Server is running! Store videos inside /media_storage folder.');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[MediaServer] Active on http://0.0.0.0:${PORT}`);
  console.log(`[MediaServer] Media folder: ${MEDIA_DIR}`);
});
