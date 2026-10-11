/* dizi77'yi SAF WEB senaryosunda dener: /api/proxy yolu kapatilir, yani
   Vercel'de oluyabilen Cloudflare engeli birebir taklit edilir.
   Kaynak yalnizca CF Worker gateway veya cihaz WebView'i ile kurtarabilir. */

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
globalThis.window = { location: { hostname: '', protocol: 'https:' }, CinePulseDesktop: { isDesktop: false } };

const nativeFetch = globalThis.fetch;
globalThis.fetch = (input, init) => {
  const url = typeof input === 'string' ? input : String(input);
  if (url.startsWith('/')) {
    // Vercel'de bu yol datacenter IP'sinden gider ve 403 doner.
    return Promise.resolve({ ok: false, status: 403, text: async () => '<html>Attention Required</html>' });
  }
  return nativeFetch(url, init);
};

const d77 = await import('../src/services/dizi77Scraper.js');

console.log('═══ dizi77 — saf web (Vercel engeli taklitli) ═══');
const list = await d77.searchDizi77('walking');
const hit = list.find((r) => r.id === 'the-walking-dead') || list[0];
console.log(`  arama sonucu: ${list.length} dizi`);
if (!hit) {
  console.log('  ✗ HİÇ DİZİ BULUNAMADI — worker yolu da çalışmıyor');
  process.exit(1);
}
console.log(`  hedef: "${hit.title}" (${hit.url})`);

const src = await d77.fetchDizi77EpisodeSources(hit.url, 1, 1);
if (!src.length) {
  console.log('  ✗ BÖLÜM OYNATICISI ALINAMADI');
  process.exit(1);
}
console.log(`  ✓ oynatıcı: ${src[0].streamUrl}`);
console.log('  ✓ dizi77 web sürümünde CF engelini aşarak çalışıyor');