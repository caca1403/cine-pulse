/* probeChannels(): oynatılacak AYNI proxy üzerinden sağlık denetimi. */
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k)
};
globalThis.window = { location: { hostname: '', protocol: 'file:' }, CinePulseDesktop: { isDesktop: true } };

const { buildChannels, refreshLiveSources, probeChannels } = await import('../src/services/turkishLiveSources.js');

const sources = await refreshLiveSources();
const curated = new Set(['TRT1','ATV','SHOWTV','NOWTV','STARV','KANALD','TV8','CANAL7','BEYAZTV','TEVE2','TV360','CNBCE','A2TV','TRTHABER','AHABER','NTV','TRTSPOR','HALKTV']);
const norm = (n) => String(n || '').toLocaleUpperCase('tr-TR')
  .replace(/\b(?:HD|FHD|4K|KANALI)\b/g, '').replace(/[^A-ZÇĞİÖŞÜ0-9]/g, '');

const all = buildChannels(sources, { resolveLogo: () => '' }).filter(c => !curated.has(norm(c.name)));
const candidates = all.slice(0, 48);           // HEALTH_PROBE_LIMIT ile aynı

const makeUrl = (c) => {
  let ref = '';
  if (c.headers?.ref) ref = c.headers.ref;
  else { try { ref = new URL(c.streamUrl).origin + '/'; } catch (_) {} }
  const extra = [];
  if (c.headers?.ua) extra.push(`&ua=${encodeURIComponent(c.headers.ua)}`);
  if (c.headers?.origin) extra.push(`&origin=${encodeURIComponent(c.headers.origin)}`);
  return `http://127.0.0.1:4000/api/hls_proxy?url=${encodeURIComponent(c.streamUrl)}&ref=${encodeURIComponent(ref)}&live=1${extra.join('')}`;
};

const t0 = Date.now();
const r = await probeChannels(candidates, makeUrl, { limit: 48, concurrency: 6, timeout: 7000 });
console.log(`denetim: ${Date.now() - t0}ms | ${r.tested} kanal denendi`);
console.log(`çalışan: ${r.alive.size}  ölü: ${r.dead.size}`);
console.log('\nçalışan ilk 10:', [...r.alive].slice(0, 10).map(u => u.slice(-26)).join('\n              '));
console.log('\ndenetimden sonra üst sıra:');
const rank = (c) => (r.dead.has(c.streamUrl) ? 1 : 0);
const sorted = all.map((c, i) => ({ c, i })).sort((a, b) => (rank(a.c) - rank(b.c)) || (a.i - b.i)).map(x => x.c);
console.log('  ilk 5 :', sorted.slice(0, 5).map(c => c.name).join(' | '));
console.log('  ilk 48 sonrası:', sorted.slice(48, 53).map(c => c.name).join(' | '));
const topDead = sorted.slice(0, 48).filter(c => r.dead.has(c.streamUrl));
console.log(`  üst 48 içinde kanıtlanmış ölü: ${topDead.length}`);
console.log(`  üst 48 içinde kanıtlanmış çalışan: ${48 - topDead.length}`);
console.log(`  kalıcı ölü listesi: ${[...r.dead].length} kayıt (${JSON.stringify({ at: Date.now(), dead: [...r.dead] }).length} bayt)`);
console.log(r.alive.size > 0 ? '\nTAMAM' : '\nUYARI: hiç çalışan kanal bulunamadı');