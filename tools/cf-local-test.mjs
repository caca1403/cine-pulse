// Cloudflare fonksiyon girisinin yerel dum testidir (workerd yok; Node 18
// fetch + stream ayni API'leri sagliyor). Kullanim: node tools/cf-local-test.mjs
import { onRequest } from '../functions/[[route]].js';

const BASE = 'http://localhost/';
let fail = 0;
const check = (ad, kosul, detay = '') => {
  console.log(`${kosul ? 'PASS' : 'FAIL'} ${ad}${kosul ? '' : ' <- ' + detay}`);
  if (!kosul) fail++;
};

async function istek(path, init = {}) {
  const req = new Request(BASE + path.replace(/^\//, ''), {
    ...init,
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124', ...(init.headers || {}) },
  });
  return onRequest({ request: req });
}

// 1) OPTIONS preflight (hls_proxy)
{
  const r = await istek('/api/hls_proxy?url=https%3A%2F%2Ftest-streams.mux.dev%2Fx36xhzz%2Fx36xhzz.m3u8', { method: 'OPTIONS' });
  check('OPTIONS hls_proxy 200 + CORS', r.status === 200 && r.headers.get('access-control-allow-origin') === '*', `st=${r.status}`);
}

// 2) M3U8 proxy — icerik + URI rewrite
{
  const r = await istek('/api/hls_proxy?url=https%3A%2F%2Ftest-streams.mux.dev%2Fx36xhzz%2Fx36xhzz.m3u8');
  const t = await r.text();
  check('GET m3u8 200', r.status === 200, `st=${r.status}`);
  check('m3u8 govdesi geldi', t.includes('#EXTM3U'), t.slice(0, 80));
  check('goreli URI proxyye cevrildi', !t.includes('URI="') || t.includes('/api/hls_proxy?url='), t.slice(0, 120));
}

// 3) Range akisi (Range destekli upstream) — 206 + Range basliklari
{
  const r = await istek('/api/proxy?url=https%3A%2F%2Ftest-videos.co.uk%2Fvids%2Fbigbuckbunny%2Fmp4%2Fh264%2F360%2FBig_Buck_Bunny_360_10s_1MB.mp4', { headers: { Range: 'bytes=0-1023' } });
  check('Range GET 206/200', r.status === 206 || r.status === 200, `st=${r.status}`);
  const buf = await r.arrayBuffer();
  check('Range govdesi 1KB', buf.byteLength > 0 && (r.status !== 206 || buf.byteLength === 1024), `len=${buf.byteLength}`);
}

// 4) Guvenlik: internal URL engeli
{
  const r = await istek('/api/proxy?url=http%3A%2F%2F169.254.169.254%2Flatest%2Fmeta-data%2F');
  check('meta-adres engellendi', r.status === 403, `st=${r.status}`);
}

// 5) Guvenlik header'lari fonksiyon yanitinda
{
  const r = await istek('/api/hls_proxy', { method: 'OPTIONS' });
  check('X-Content-Type-Options var', r.headers.get('x-content-type-options') === 'nosniff', String(r.headers.get('x-content-type-options')));
}

// 6) /api/resolve ctv kanal listesi (python portu)
{
  const r = await istek('/api/resolve?provider=ctv');
  const j = await r.json().catch(() => ({}));
  check('resolve ctv liste', j.success === true && Array.isArray(j.channels) && j.channels.length > 10, `n=${(j.channels || []).length}`);
}

// 7) /api/resolve dzs film akisi (python portu)
{
  const r = await istek('/api/resolve?provider=dzs&type=movie&tmdbId=155');
  const j = await r.json().catch(() => ({}));
  check('resolve dzs film', j.success === true && String(j.streamUrl || '').includes('/api/hls_proxy'), JSON.stringify(j).slice(0, 100));
}

console.log(fail === 0 ? 'TUMU-GECTI' : `${fail} BASARISIZ`);
process.exit(fail === 0 ? 0 : 1);
