/* Kaynak listesi NEDEN KÜÇÜLÜYOR? — her onUpdate'te sayılar kaydedilir.
   Amaç: azalma aggregator'da mı (aynı anda) yoksa PlayerModal'da mı. */

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
Object.defineProperty(globalThis, 'navigator', { value: { userAgent: 'node', platform: 'node' }, configurable: true, writable: true });
const { webcrypto } = await import('node:crypto');
if (!globalThis.crypto) globalThis.crypto = webcrypto;

const { getStreamingServersProgressive } = await import('../src/services/kaynak/providerAggregator.js');

const t0 = Date.now();
const izler = [];
const kimlikler = new Set();

console.log('\n═══ Her onUpdate gelişinde liste ═══');
const son = await getStreamingServersProgressive({
  type: 'movie',
  title: 'Amansız The Furious',
  originalTitle: 'The Furious',
  year: 2026,
  onUpdate: ({ dubbed = [], subtitled = [], isComplete = false, fromCache = false, newStream = null }) => {
    const toplam = dubbed.length + subtitled.length;
    for (const s of [...dubbed, ...subtitled]) {
      const k = String(s.id || s.source || '');
      if (!kimlikler.has(k)) { kimlikler.add(k); }
    }
    izler.push({
      ms: Date.now() - t0,
      d: dubbed.length,
      s: subtitled.length,
      toplam,
      isComplete,
      fromCache,
      yeni: newStream ? String(newStream.id || '').slice(0, 22) : ''
    });
    console.log(`  ${String(Date.now() - t0).padStart(6)}ms  dubl=${String(dubbed.length).padStart(2)}  alt=${String(subtitled.length).padStart(2)}  toplam=${String(toplam).padStart(2)}  ${isComplete ? 'TAMAM' : 'devam'}  ${fromCache ? '[önbellek]' : ''} ${newStream ? '+' + String(newStream.id || '').slice(0, 20) : ''}`);
  }
});

console.log('\n═══ Analiz ═══');
let max = 0, maxIdx = -1;
izler.forEach((g, i) => { if (g.toplam > max) { max = g.toplam; maxIdx = i; } });
console.log(`  en yüksek: ${max} (${izler[maxIdx]?.ms}ms)`);
console.log(`  final    : ${son.dubbed.length + son.subtitled.length}`);
const kuculme = izler.findIndex((g, i) => i > maxIdx && g.toplam < max);
if (kuculme !== -1) {
  console.log(`  ⚠ AZALMA: ${max} → ${izler[kuculme].toplam} @ ${izler[kuculme].ms}ms`);
  const onceki = izler[kuculme - 1];
  console.log(`    hemen önce: ${onceki.d}/${onceki.s}`);
  console.log(`    sonra    : ${izler[kuculme].d}/${izler[kuculme].s}`);
} else {
  console.log('  ✓ aggregator tarafında azalma yok');
}
console.log(`\n  toplam ${izler.length} güncelleme geldi.`);
console.log(`  benzersiz kaynak: ${kimlikler.size}`);
console.log(`  örnekler: ${[...kimlikler].slice(0, 12).join(', ')}`);