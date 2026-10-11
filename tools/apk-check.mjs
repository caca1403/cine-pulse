/* APK'nın gerçekten yapabileceklerini ölç.
   ÖNEMLİ: Kullanıcının IP'si DEĞİL — APK'da her istek Vercel'e gider.
   Bu yüzden tüm kaynaklar production origin üzerinden sınanır. */

const V = 'https://cine-pulse-drab.vercel.app';
const nf = globalThis.fetch;
globalThis.fetch = (i, o) => { const u = typeof i === 'string' && i.startsWith('/') ? V + i : i; return nf(u, o); };
globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
globalThis.window = { location: { hostname: '', protocol: 'https:' } };

const sonuc = [];
async function dene(ad, fn) {
  const t = Date.now();
  let r = null;
  try { r = await fn(); } catch (e) { r = null; }
  sonuc.push([ad, r ? '✓' : '✗', r ? String(r.url || '').slice(0, 40) : '', Date.now() - t]);
}

console.log('═══ APK (Vercel IP üzerinden) — film/dizi kaynakları ═══');

const d77 = await import('../src/services/dizi77Scraper.js');
await dene('dizi77', async () => {
  const r = await d77.searchDizi77('walking');
  if (!r.length) return null;
  const s = await d77.fetchDizi77Sources({ titles: ['The Walking Dead'], title: 'The Walking Dead', season: 1, episode: 1 });
  return s[0] ? { url: s[0].streamUrl } : null;
});

const smc = await import('../src/services/sinemaccScraper.js');
await dene('sinemacc', async () => {
  const l = await smc.searchSinemacc('film', false);
  if (!l.length) return null;
  const s = await smc.fetchSinemaccSources({ title: l[0].title, titles: [] });
  return s[0] ? { url: s[0].rawStreamUrl || s[0].streamUrl } : null;
});

const dbx = await import('../src/services/diziboxScraper.js');
await dene('DiziBox', async () => {
  const s = await dbx.fetchDiziBoxSources({ titles: ['56 Days'], title: '56 Days', season: 1, episode: 1 });
  return s[0] ? { url: s[0].streamUrl } : null;
});

const vod = await import('../src/services/vodM3uSources.js');
await dene('film M3U', async () => {
  await vod.loadVodSource('jetfilm');
  const s = await vod.fetchVodSources({ title: 'Doktor No', titles: [], year: 2002 });
  return s[0] ? { url: s[0].rawStreamUrl } : null;
});

for (const [ad, prov, ty, ti] of [
  ['VEGA (setf)', 'setf', 'movie', 'Yolcu'],
  ['ATLAS (dzs)', 'dzs', 'series', 'Erkenci Kuş'],
  ['VELA (fxs)', 'fxs', 'movie', 'Yolcu'],
  ['NERO (dzb)', 'dzb', 'movie', 'Yolcu']
]) {
  await dene(ad, async () => {
    let u = `${V}/api/resolve?provider=${prov}&type=${ty}&title=${encodeURIComponent(ti)}`;
    if (ty === 'series') u += '&season=1&episode=1';
    const r = await nf(u).catch(() => null);
    if (!r) return null;
    const j = await r.json().catch(() => null);
    return j && j.success ? { url: `${j.streams.length} yayın` } : null;
  });
}

for (const [a, ok, u, ms] of sonuc) {
  console.log(`  ${a.padEnd(16)}${ok}  ${u.padEnd(42)}${(ms / 1000).toFixed(1)}s`);
}