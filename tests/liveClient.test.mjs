/* İstemci kod yolunun gerçek çalıştırması (tarayıcı global'leri taklit edilerek).
   src/services/turkishLiveSources.js -> buildChannels -> LiveTvView eşlemesi. */

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear()
};
globalThis.window = {
  // Paketlenmiş Electron: sayfa file:// ile yuklenir → hostname boş.
  // apiUrl() bu durumda yerel sidecar'a (127.0.0.1:4000) yönlendirir.
  location: { hostname: '', protocol: 'file:', search: '', hash: '#livetv' },
  Capacitor: undefined,
  CinePulseDesktop: { isDesktop: true }
};

const svc = await import('../src/services/turkishLiveSources.js');

const t0 = Date.now();
const sources = await svc.refreshLiveSources();
console.log(`refreshLiveSources: ${Date.now() - t0}ms`);
console.log('  kaynaklar:', sources.map(s => `${s.id}=${s.count}`).join(' '));
if (!sources.length) { console.error('HATA: hicbir kaynak gelmedi'); process.exit(1); }

// "Calisan ilk acilan kaynak" varsayilani
const probe = await svc.probeLiveSources();
console.log('probe sırası   :', probe.order.join(' → '));
console.log('varsayılan    :', probe.defaultId);
console.log('kalıcı seçim  :', svc.getDefaultSourceId(svc.getAllCachedSources()));

// Ikinci cagri onbellekten gelmeli (sunucuya gitmemeli)
const t1 = Date.now();
const again = await svc.refreshLiveSources();
console.log(`ikinci çağrı    : ${Date.now() - t1}ms (onbellek)`);
console.log('  aynı kanal sayısı:', again.reduce((a, s) => a + s.channels.length, 0));

// CanliTVView ile aynı montaj
const curated = new Set(['TRT1', 'ATV', 'SHOWTV', 'NOWTV', 'STARV', 'KANALD', 'TV8']);
const norm = (n) => String(n || '').toLocaleUpperCase('tr-TR')
  .replace(/\b(?:HD|FHD|4K|KANALI)\b/g, '').replace(/[^A-ZÇĞİÖŞÜ0-9]/g, '');
const chans = svc.buildChannels(sources, { resolveLogo: () => '' })
  .filter(c => !curated.has(norm(c.name)));

console.log('\n--- montaj sonucu ---');
console.log('kanal          :', chans.length);
console.log('benzersiz id   :', new Set(chans.map(c => c.id)).size === chans.length);
console.log('yedeği olan    :', chans.filter(c => c.altStreams.length).length);
console.log('localStorage   :', (store.get('cp_live_sources_v1') || '').length, 'bayt');

const GENRES = ['sports', 'news', 'doc', 'kids', 'music', 'national'];
const badCat = chans.filter(c => !GENRES.includes(c.category));
const badId = chans.filter(c => !/^[a-z0-9_]+$/.test(c.id));
const badName = chans.filter(c => !c.name || !c.streamUrl);
console.log('bozuk kategori :', badCat.length, badCat.slice(0,3).map(c=>c.category));
console.log('bozuk id       :', badId.length);
console.log('eksik alan     :', badName.length);

// Favori anahtari olarak da kullaniliyor -> localStorage round-trip
svc.clearLiveSourceCache();
console.log('temizlik sonrası:', store.size, 'anahtar');
console.log('\nTAMAM');