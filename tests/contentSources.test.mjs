/* ==========================================================================
   İÇERİK TESTİ — Film/Dizi açıldığında yeni kaynaklar listede mi?

   Kazıyıcıları tek tek çağırmak yetmiyor: asıl soru, bir içeriğin oynatıcı
   penceresini açtığında uygulamanın GERÇEKTEN o kaynakları sorguladığı.
   Burada providerAggregator'ın kendi giriş noktası çağrılıyor
   (getStreamingServersProgressive) ve dönen listede yeni kaynaklar aranıyor.
   ========================================================================== */

const SIDECAR = 'http://127.0.0.1:4000';
const nativeFetch = globalThis.fetch;
globalThis.fetch = (input, init) => {
  const url = typeof input === 'string' && input.startsWith('/') ? SIDECAR + input : input;
  return nativeFetch(url, init);
};

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k)
};
globalThis.window = {
  location: { hostname: '', protocol: 'https:' },
  addEventListener() {}, removeEventListener() {}, dispatchEvent() {},
  matchMedia: () => ({ matches: false, addEventListener() {} })
};
globalThis.document = {
  addEventListener() {}, removeEventListener() {},
  querySelector: () => null, querySelectorAll: () => [],
  createElement: () => ({ style: {}, setAttribute() {}, addEventListener() {} }),
  body: { appendChild() {} }, documentElement: { style: {} }
};
globalThis.navigator = { userAgent: 'node', platform: 'node' };
const { webcrypto } = await import('node:crypto');
if (!globalThis.crypto) globalThis.crypto = webcrypto;

const { getStreamingServersProgressive } = await import('../src/services/providerAggregator.js');

let pass = 0, fail = 0;
const ok = (c, m) => { c ? (pass++, console.log(`  ✓ ${m}`)) : (fail++, console.log(`  ✗ ${m}`)); };

// onUpdate bir NESNE verir: { dubbed, subtitled, isComplete, ... }
function toplayici() {
  const bulunan = new Map();
  return {
    onUpdate: ({ dubbed = [], subtitled = [] } = {}) => {
      for (const s of [...dubbed, ...subtitled]) {
        bulunan.set(String(s.id || s.source || ''), s);
      }
    },
    sonuc: bulunan
  };
}

async function ac(opts, ms = 120000) {
  const t = toplayici();
  await Promise.race([
    getStreamingServersProgressive({ ...opts, onUpdate: t.onUpdate }),
    new Promise((r) => setTimeout(r, ms))
  ]);
  return t.sonuc;
}

// Halcyon aramasıyla kanıtlanmış başlık (newSources/sourcePlayback) —
// "Doktor No" Halcyon kataloğunda eşleşmiyor.
console.log('\n═══ FİLM — "Interstellar" (katalogda mevcut) ═══');
const film = await ac({ type: 'movie', title: 'Interstellar', year: 2014 });
console.log(`    toplam ${film.size} kaynak geldi`);
ok([...film.keys()].some((k) => k.startsWith('sinemacc_')), 'sinemacc (Halcyon) film listesinde');
ok(![...film.keys()].some((k) => k.startsWith('d77_')), 'dizi77 (Corvus) filmde çıkmıyor — doğru');

// M3U (Pulsar) kataloğu çocuk ağırlıklı; Interstellar yok ("doktor no" var —
// katalog aramasıyla ölçüldü). Bu yüzden M3U yoluna kendi başlığıyla,
// ayrı bir taramayla bakılıyor.
console.log('\n═══ FİLM — "Doktor No" (film M3U / Pulsar) ═══');
const filmM3u = await ac({ type: 'movie', title: 'Doktor No', year: 2002 }, 45000);
console.log(`    toplam ${filmM3u.size} kaynak geldi`);
ok([...filmM3u.keys()].some((k) => k.startsWith('vod_')), 'film M3U (Pulsar) film listesinde');

// Corvus kataloğunda kanıtlanmış dizi (sourcePlayback) — "56 Days" bulunamıyordu.
console.log('\n═══ DİZİ — "The Walking Dead" 1.S1.B1 ═══');
const dizi = await ac({ type: 'tv', title: 'The Walking Dead', seriesTitle: 'The Walking Dead', season: 1, episode: 1 });
console.log(`    toplam ${dizi.size} kaynak geldi`);
ok([...dizi.keys()].some((k) => k.startsWith('d77_')), 'dizi77 (Corvus) dizi listesinde');
// DiziBox ELE: dizibox.live CF 403, aynası yalnız ok.ru/gömülü oynatıcı veriyor
// → iframe yasağı gereği listelenemez. Bu satır kaybı değil, KURALI belgeler.
ok(![...dizi.keys()].some((k) => k.startsWith('dzbx_')), 'DiziBox listelenmiyor (gömülü oynatıcı yasağı)');
ok(![...dizi.keys()].some((k) => k.startsWith('sinemacc_')), 'sinemacc film kaynağı dizide çıkmıyor — doğru');

console.log(`\n${fail === 0 ? 'TAMAM' : 'BAŞARISIZ'} — geçen: ${pass}, kalan: ${fail}`);
process.exit(fail === 0 ? 0 : 1);