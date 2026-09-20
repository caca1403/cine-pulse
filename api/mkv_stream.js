import { spawn } from 'child_process';
import { createRequire } from 'module';
import { guardNodeRequest, isSafePublicUrl } from './_security.js';

const require = createRequire(import.meta.url);

function getFfmpegPath() {
  try {
    return require('@ffmpeg-installer/ffmpeg').path;
  } catch (_) {
    return '';
  }
}

// Sinewix MKV kaynakları Chromium tabanlı tarayıcılarda doğrudan oynatılamaz.
// Bu Vercel fonksiyonu kapsayıcıyı anlık fragmented MP4'e çevirir. Video tekrar
// kodlanmaz; kaynak H.264 olduğunda ilk kare gecikmeden tarayıcıya ulaşır.
export default async function mkvStream(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET' && req.method !== 'HEAD') return res.status(405).end();
  if (guardNodeRequest(req, res, { limit: 18, bucket: 'mkv-remux' })) return;

  const origin = `https://${req.headers.host || 'localhost'}`;
  const requestUrl = new URL(req.url || '/', origin);
  const target = requestUrl.searchParams.get('url') || '';
  const referer = requestUrl.searchParams.get('ref') || 'https://ydfvfdizipanel.ru/';
  if (!target || !isSafePublicUrl(target)) return res.status(403).json({ error: 'Geçersiz video kaynağı' });

  const ffmpegPath = getFfmpegPath();
  if (!ffmpegPath) return res.status(503).json({ error: 'MKV dönüştürücü şu anda hazır değil' });

  const headers = `Referer: ${referer}\r\nUser-Agent: Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/124 Safari/537.36\r\n`;
  const args = [
    '-hide_banner', '-loglevel', 'error',
    '-headers', headers,
    '-i', target,
    '-map', '0:v:0?', '-map', '0:a:0?',
    '-c:v', 'copy', '-c:a', 'aac',
    '-movflags', 'frag_keyframe+empty_moov+default_base_moof',
    '-f', 'mp4', 'pipe:1'
  ];

  let sentHeaders = false;
  let ffmpeg;
  try {
    ffmpeg = spawn(ffmpegPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    const abort = () => {
      try { ffmpeg.kill('SIGTERM'); } catch (_) {}
    };
    req.once('close', abort);
    res.once('close', abort);

    ffmpeg.stderr.on('data', () => {});
    ffmpeg.once('error', () => {
      if (!sentHeaders && !res.writableEnded) res.status(502).json({ error: 'MKV dönüştürücü başlatılamadı' });
    });
    ffmpeg.stdout.once('data', chunk => {
      if (res.writableEnded) return;
      sentHeaders = true;
      res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Cache-Control': 'no-store',
        'Accept-Ranges': 'none',
        'X-Content-Type-Options': 'nosniff'
      });
      res.write(chunk);
      ffmpeg.stdout.pipe(res, { end: true });
    });
    ffmpeg.once('close', code => {
      if (res.writableEnded) return;
      if (!sentHeaders) return res.status(502).json({ error: `MKV kaynağı dönüştürülemedi (${code ?? 'bilinmiyor'})` });
      res.end();
    });
  } catch (_) {
    if (!res.writableEnded) res.status(500).json({ error: 'MKV dönüştürme hatası' });
  }
}
