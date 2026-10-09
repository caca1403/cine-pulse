import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import dns from 'node:dns';

// Prefer reachable IPv4 endpoints rather than waiting for failing IPv6 routes.
dns.setDefaultResultOrder('ipv4first');
const BASE = 'https://www.canlitv.you';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const cache = new Map();
const pending = new Map();
const playerIds = new Map();

const execFileAsync = promisify(execFile);
async function html(url, referer) {
  // The local network resets many HTTP/1.1 connections to this source. Curl's
  // HTTP/2 transport is available locally; serverless uses the Fetch API.
  // Curl basarisizsa dogrudan fetch'e dus (hata firlatma).
  if (!process.env.VERCEL) {
    try {
      const { stdout } = await execFileAsync('curl', ['-4', '-fsSL', '--connect-timeout', '2', '--max-time', '5', '--retry', '1', '--retry-all-errors', '--retry-delay', '0', '-A', UA, '-e', referer, url], { timeout: 11000, maxBuffer: 2 * 1024 * 1024 });
      if (stdout && stdout.length > 500) return stdout;
    } catch (_) {}
  }
  const response = await fetch(url, { headers: { 'User-Agent': UA, Referer: referer, Connection: 'close' }, signal: AbortSignal.timeout(6000) });
  if (!response.ok) throw new Error(`CanliTV HTTP ${response.status}`);
  return response.text();
}

export function parseCanliPlayer(source) {
  const file = source.match(/(?:file|src)["']?\s*[:=]\s*["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/i);
  if (file) return { url: file[1].replace(/&amp;/g, '&'), referer: BASE + '/', kind: 'hls' };
  const youtube = source.match(/https:\/\/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (youtube) return { kind: 'youtube', embedUrl: `https://www.youtube.com/embed/${youtube[1]}?autoplay=1&playsinline=1&rel=0`, videoId: youtube[1] };
  const tabii = source.match(/https:\/\/(?:www\.)?tabii\.com\/tr\/watch\/live\/([a-z0-9-]+)(?:\?[^"'<>\s]*)?/i);
  // The site delegates TRT 1 to Tabii. Use TRT's public live feed for that
  // specific route; do not treat every external watch link as an HLS source.
  if (tabii?.[1] === 'trt1') return { url: 'https://tv-trt1.medya.trt.com.tr/master.m3u8', referer: 'https://www.trt1.com.tr/', kind: 'tabii-public', externalUrl: tabii[0] };
  if (tabii) throw new Error('Bu kanal Tabii uygulamasında izlenebilir');
  const iframe = source.match(/<iframe[^>]+src=["'](https:\/\/[^"']+)["']/i);
  if (iframe) return { kind: 'embed', embedUrl: iframe[1].replace(/&amp;/g, '&') };
  const watch = source.match(/<a[^>]+href=["'](https:\/\/[^"']+)["'][^>]+title=["'][^"']*canlı yayını/i);
  if (watch) return { kind: 'external', externalUrl: watch[1].replace(/&amp;/g, '&') };
  const error = new Error('Bu kanalın oynatıcısında doğrudan yayın bulunamadı');
  error.playerHtml = source;
  throw error;
}

export async function resolveCanliChannel(slug, suppliedId = '', refresh = false) {
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error('Invalid channel');
  const cached = cache.get(slug);
  if (!refresh && cached && cached.expires > Date.now()) return cached.result;
  if (pending.has(slug)) return pending.get(slug);
  const task = (async () => {
    let id = /^\d{1,8}$/.test(String(suppliedId)) ? String(suppliedId) : playerIds.get(slug);
    const pageUrl = `${BASE}/${slug}`;
    if (!id) {
      const page = await html(pageUrl, BASE + '/');
      id = page.match(/\/player\/index\.php\?id=(\d+)/)?.[1] || page.match(/online\.php\?sayfa=(\d+)/)?.[1];
      if (!id) throw new Error('Player not found');
    }
    playerIds.set(slug, id);
    const player = await html(`${BASE}/player/index.php?id=${id}&mobile=0`, pageUrl);
    const source = parseCanliPlayer(player);
    const result = ['youtube', 'embed', 'external'].includes(source.kind) ? source : { ...source, raw: source.url, proxiedUrl: `/api/hls_proxy?url=${encodeURIComponent(source.url)}&ref=${encodeURIComponent(source.referer)}&live=1` };
    cache.set(slug, { result, expires: Date.now() + (source.kind === 'hls' ? 30000 : 120000) });
    return result;
  })();
  pending.set(slug, task);
  try { return await task; } finally { pending.delete(slug); }
}
