import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const cache = new Map();
const pending = new Map();
const CACHE_MS = 2 * 60 * 1000;

async function requestDrama(url) {
  const { stdout } = await execFileAsync('curl', [
    '-4', '-fsSL', '--connect-timeout', '2', '--max-time', '3',
    '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
    '-e', 'https://dramadizilerim.com/',
    url.href
  ], { encoding: 'buffer', maxBuffer: 4 * 1024 * 1024, timeout: 4000 });
  return { body: stdout, type: 'text/html; charset=utf-8' };
}

async function loadDrama(url) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try { return await requestDrama(url); } catch (error) { lastError = error; }
  }
  throw lastError;
}

export async function dramaDevProxy(req, res, next) {
  if (req.method !== 'GET' || !/^\/api\/ddz(?:\/|\?|$)/.test(req.url || '')) return next();
  const requestUrl = new URL(req.url, 'http://localhost');
  const sourcePath = requestUrl.pathname.replace(/^\/api\/ddz/, '') || '/';
  const sourceUrl = new URL(`${sourcePath}${requestUrl.search}`, 'https://dramadizilerim.com');
  const key = sourceUrl.href;
  const cached = cache.get(key);
  try {
    let result = cached && Date.now() - cached.time < CACHE_MS ? cached : null;
    if (!result) {
      if (!pending.has(key)) pending.set(key, loadDrama(sourceUrl).finally(() => pending.delete(key)));
      result = await pending.get(key);
      cache.set(key, { ...result, time: Date.now() });
      if (cache.size > 150) cache.delete(cache.keys().next().value);
    }
    res.setHeader('Content-Type', result.type);
    res.setHeader('Cache-Control', 'private, max-age=60');
    res.statusCode = 200;
    res.end(result.body);
  } catch (error) {
    if (cached) {
      res.setHeader('Content-Type', cached.type);
      res.statusCode = 200;
      res.end(cached.body);
      return;
    }
    console.error('[Drama dev proxy]', error.message);
    res.statusCode = 502;
    res.end('Drama source temporarily unavailable');
  }
}
