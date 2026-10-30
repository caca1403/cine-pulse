/* Uçtan uca: sidecar → /api/live_sources → istemci kanal üretimi → proxy URL'leri
   GATE: 127.0.0.1:4000 ayakta değilse bu betik ÇÖKMEZ — "atlandı" yazar ve 0
   ile çıkar; birim test koşusu (pnpm test) dev sunucusu istemez. */
import { buildChannels } from '../src/services/canli/turkishLiveSources.js';

const BASE = process.env.LIVE_BASE || 'http://127.0.0.1:4000';

function normalizeName(name) {
  return String(name || '')
    .toLocaleUpperCase('tr-TR')
    .replace(/\b(?:HD|FHD|4K|KANALI)\b/g, '')
    .replace(/[^A-ZÇĞİÖŞÜ0-9]/g, '');
}

// LiveTvView'daki isRawMediaUrl ile birebir ayni
function isRawMediaUrl(streamUrl) {
  let url = String(streamUrl || '');
  const m = /[?&]url=([^&]+)/.exec(url);
  if (m) { try { url = decodeURIComponent(m[1]); } catch (_) {} }
  if (/\.m3u8(\?|$)/i.test(url)) return false;
  if (/\.(ts|mp4|m4v|mov|flv)(\?|$)/i.test(url)) return true;
  return !/\.[a-z0-9]{2,4}(\?|$)/i.test(url);
}

function toProxiedLiveUrl(url, headers) {
  if (!url) return '';
  let ref = '';
  if (headers && headers.ref && /^https?:\/\//i.test(headers.ref)) ref = headers.ref;
  else { try { ref = `${new URL(url).origin}/`; } catch (_) { ref = ''; } }
  const extra = [];
  if (headers && headers.ua) extra.push(`&ua=${encodeURIComponent(headers.ua)}`);
  if (headers && headers.origin) extra.push(`&origin=${encodeURIComponent(headers.origin)}`);
  return `/api/hls_proxy?url=${encodeURIComponent(url)}&ref=${encodeURIComponent(ref)}&live=1${extra.join('')}`;
}

let res;
try {
  res = await fetch(`${BASE}/api/live_sources`, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/124.0.0.0' } });
} catch (_) {
  console.log(`SKIP livePipeline: ${BASE} erişilemedi — sidecar/dev sunucusu ayakta değil (LIVE_BASE ile taşınabilir)`);
  process.exit(0);
}
if (!res.ok) { console.log(`SKIP livePipeline: live_sources HTTP ${res.status} — sunucu hazır değil`); process.exit(0); }
const data = await res.json();

const curatedNames = new Set(['TRT1','ATV','SHOWTV','NOWTV','STARV','KANALD']);
const sources = data.sources.map(s => ({ id: s.id, label: s.label, channels: s.channels }));
const chans = buildChannels(sources, { resolveLogo: () => '' })
  .filter(c => !curatedNames.has(normalizeName(c.name)))
  .map(c => ({ ...c, streamUrl: toProxiedLiveUrl(c.streamUrl, c.headers) }));

console.log(`kaynaklar      : ${sources.map(s => `${s.id}(${s.channels.length})`).join(' + ')}`);
console.log(`üretilen kanal : ${chans.length}`);
console.log(`benzersiz id   : ${new Set(chans.map(c => c.id)).size}`);
console.log(`isTs=true olan : ${chans.filter(c => c.isTs).length}`);
console.log(`UA taşıyan     : ${chans.filter(c => c.streamUrl.includes('&ua=')).length}`);
console.log(`Origin taşıyan : ${chans.filter(c => c.streamUrl.includes('&origin=')).length}`);

// buildSrcList'in oynatacagi yol belirleniyor mu?
const route = (c) => (c.isTs === true || isRawMediaUrl(c.streamUrl)) ? 'mpegts.js' : 'hls.js';
const routed = chans.reduce((a, c) => { a[route(c)] = (a[route(c)] || 0) + 1; return a; }, {});
console.log(`oynatma yolu   : ${JSON.stringify(routed)}`);

const bad = chans.filter(c => !c.name || !c.id || !/^[\w]+$/.test(c.id) || c.category === undefined);
console.log(`bozuk kanal    : ${bad.length}`);

// Kategori dagilimi (EPG GENRE_SCHEDULES anahtarlariyla eslesmeli)
const cats = chans.reduce((a, c) => { a[c.category] = (a[c.category] || 0) + 1; return a; }, {});
console.log(`kategoriler    : ${JSON.stringify(cats)}`);
const GENRES = ['sports','news','doc','kids','music','national'];
console.log(`EPG uyumlu     : ${Object.keys(cats).every(k => GENRES.includes(k))}`);

// id localStorage anahtari olarak kullaniliyor: sadece harf/rakam/alt cizgi
const badIds = chans.filter(c => !/^[a-z0-9_]+$/.test(c.id));
console.log(`geçersiz id    : ${badIds.length}`);

console.log('\n--- örnekler ---');
for (const c of chans.slice(0, 3)) console.log(` ${c.name} [${c.category}] ts=${route(c)}\n   ${c.streamUrl.slice(0, 130)}`);
const uaCh = chans.find(c => c.streamUrl.includes('&ua='));
if (uaCh) console.log(` UA kanalı: ${uaCh.name}\n   ${uaCh.streamUrl.slice(0, 190)}`);
// --- Yedek yayın (altStreams) zinciri ---
const withAlt = chans.filter(c => c.altStreams && c.altStreams.length);
console.log(`\nyedek adresi olan kanal : ${withAlt.length} / ${chans.length}`);
console.log(`toplam yedek adres      : ${chans.reduce((a,c)=>a+(c.altStreams?.length||0),0)}`);
const mixedRoute = withAlt.filter(c => route(c) !== route({ streamUrl: toProxiedLiveUrl(c.altStreams[0].url), isTs: c.altStreams[0].isTs }));
console.log(`HLS/TS karisimi (yedek farkli yol): ${mixedRoute.length}`);
const ex = withAlt[0];
if (ex) console.log(`ornek: ${ex.name} -> ${ex.altStreams.length} yedek, ilk yedek ts=${ex.altStreams[0].isTs}`);
