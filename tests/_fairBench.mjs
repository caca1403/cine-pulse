/* Adil kıyaslama: SADECE gerçek gömülü oynatıcı SAYFALARI.
   Önceki turda scraper'ların gezdiği son adres seçiliyordu; o adres çoğu
   kez bir API ucuydu (youtubei/v1/player, dl?op=get_stream) veya ana
   sayfaydı. Bu kez yalnızca oynatıcı sayfası kalıplarına uyan adresler
   değerlendiriliyor. */

import fs from 'fs';
const SIDECAR = 'http://127.0.0.1:4000';
globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
globalThis.window = { location: { hostname: '', protocol: 'https:' } };
globalThis.fetch = ((nf) => (input, init) => {
  const u = typeof input === 'string' && input.startsWith('/') ? SIDECAR + input : input;
  return nf(u, init);
})(globalThis.fetch);

const ex = await import('../src/services/embedExtractors.js');

// Gerçek oynatıcı sayfası kalıpları (API uçları ve ana sayfalar hariç)
const GOMULU_SAYFA = /\/(e|embed|player|watch|stream|video)\//i;
const API_UCU = /\/api\/|youtubei\/|\.php|\?op=|\?do=|wp-json|searchcontent/i;

function sandboxKur(refBase, gunluk) {
  let son = refBase;
  return async (input, opts = {}) => {
    let u = String(input);
    if (u.startsWith('/')) u = new URL(u, son).toString();
    son = u;
    const ref = opts.headers?.Referer || new URL(u).origin + '/';
    gunluk.push(u);
    const r = await fetch(`${SIDECAR}/api/proxy?url=${encodeURIComponent(u)}&ref=${encodeURIComponent(ref)}`, {
      method: opts.method || 'GET', body: opts.body, headers: { 'X-Requested-With': 'XMLHttpRequest' }
    }).catch(() => ({ ok: false, status: 0, text: async () => '' }));
    const t = await r.text().catch(() => '');
    return { ok: r.ok, status: r.status, text: async () => t, json: async () => JSON.parse(t),
             headers: { get: () => r.headers.get?.('content-type') || 'text/html' } };
  };
}
function calistir(kod, gunluk) {
  const mod = { exports: {} };
  const sb = { module: mod, exports: mod.exports, fetch: sandboxKur('https://vidmoly.biz/', gunluk),
    console: { log() {}, warn() {}, error() {} }, require: undefined,
    setTimeout, clearTimeout, setInterval, clearInterval, AbortController,
    TextDecoder, TextEncoder, URL, URLSearchParams, Blob, Buffer,
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    btoa: (s) => Buffer.from(s, 'binary').toString('base64') };
  sb.globalThis = sb;
  new Function(...Object.keys(sb), `"use strict";\n${kod}`)(...Object.values(sb));
  return Object.keys(mod.exports).length ? mod.exports : sb;
}

const BASLIKLAR = ['Yolcu', 'Doktor No', 'The Godfather', 'Gladiator', 'Interstellar',
                  'Ucuz Taksi', 'The Office', 'Naruto', 'Doraemon'];

console.log('═'.repeat(80));
console.log('  ADİL KIYASLAMA — yalnızca gerçek gömülü oynatıcı sayfaları');
console.log('═'.repeat(80));

const adaylar = [];
for (const f of fs.readdirSync('/tmp/opencode/scrapers')) {
  const gunluk = [];
  let api;
  try { api = calistir(fs.readFileSync('/tmp/opencode/scrapers/' + f, 'utf8'), gunluk); }
  catch { continue; }
  if (typeof api.getStreams !== 'function') continue;

  const bulunan = [];
  for (const b of BASLIKLAR) {
    try {
      await Promise.race([api.getStreams(b, { type: 'movie' }),
        new Promise((_, j) => setTimeout(() => j(new Error('to')), 22000))]);
    } catch (_) {}
    for (const u of gunluk) {
      if (!u.startsWith('http')) continue;
      if (/\.(m3u8|mp4|mkv|png|jpg|webp|gif|svg|json)(\?|$)/i.test(u)) continue;
      if (API_UCU.test(u)) continue;
      if (!GOMULU_SAYFA.test(u)) continue;
      if (!bulunan.includes(u)) bulunan.push(u);
    }
    if (bulunan.length) break;
  }
  for (const u of bulunan.slice(0, 2)) {
    adaylar.push([f.replace('__', '/').replace('.js', ''), u]);
  }
}

const tekil = [...new Map(adaylar.map(([a, u]) => [u, [a, u]])).values()];
console.log(`  ${tekil.length} benzersiz gömülü sayfa bulundu\n`);

let cozulen = 0, oynayan = 0;
for (const [ad, gomulu] of tekil.slice(0, 25)) {
  let r = null;
  try { r = await ex.extractEmbedStream(gomulu, ''); } catch (_) {}
  if (r) {
    const oynar = await ex.isStreamPlayable(r.url, r.referer || '', 8000).catch(() => false);
    cozulen++; if (oynar) oynayan++;
    console.log(`  ${oynar ? '✓ OYNUYOR' : '· çözüldü '} ${ad.slice(0, 24).padEnd(25)} ${r.via.padEnd(14)} ${r.url.slice(0, 40)}`);
  } else {
    console.log(`  ✗ çözülemedi ${ad.slice(0, 24).padEnd(25)} ${gomulu.slice(0, 46)}`);
  }
}
console.log('═'.repeat(80));
console.log(`  Çözülen ${cozulen}/${tekil.length}   Oynayan ${oynayan}/${tekil.length}`);
if (cozulen) console.log(`  Katman sağlığı: ${JSON.stringify(ex.katmanSagligi().arkaArdaHata)}`);