/* Yeni kaynaklarin GERÇEKTEN çalıştığını doğrular (ağ üzerinden). */
import fs from 'fs';
/* Test köprüsü: kazıyıcılar /api/proxy göreli yol kullanır (masaüstünde yerel
   sidecar'a gider). Node'da göreli fetch yok, o yüzden yanı sidecar'a ekleniyor. */
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
globalThis.window = { location: { hostname: '', protocol: 'file:' }, CinePulseDesktop: { isDesktop: true } };
globalThis.atob = (s) => Buffer.from(s, 'base64').toString('binary');

let pass = 0, fail = 0;
const ok = (c, m) => { c ? (pass++, console.log(`  ✓ ${m}`)) : (fail++, console.log(`  ✗ ${m}`)); };

// ---------------------------------------------------------------- dizi77
console.log('\n═══ Corvus (temiz sağlayıcı — dizi77) ═══');
// Eski dizi77Scraper doğrudan çağrısı (isIframe/gömülü oynatıcı bekleyen) ×
// büyük temizlikle emekli edildi: dizi77 artık temiz sağlayıcı Corvus olarak
// src/providers/corvus.js'te; "iframe listelenmez" kuralı gereği yalnız
// oynatılabilir doğrudan akışlar döner.
const { coz: cozCorvus } = await import('../src/providers/corvus.js');
const cv = await cozCorvus({ type: 'tv', title: 'The Walking Dead', originalTitle: 'The Walking Dead', season: 1, episode: 1 });
const src77 = (cv && cv.sources) || [];
ok(src77.length > 0, `1.sezon 1.bolum çözüldü: ${src77.length} kaynak`);
if (src77[0]) {
  ok(/^https?:\/\//.test(src77[0].url), `akış geçerli: ${src77[0].url.slice(0, 62)}`);
  // Proje kuralı: gömülü oynatıcı LİSTELENMEZ — yalnız bizim oynatıcımızda
  // oynayan doğrudan akışlar dönülür.
  ok(src77[0].isIframe !== true, 'iframe değil (kural: gömülü oynatıcı listelenmez)');
  ok(/^Corvus\b/.test(src77[0].name || src77[0].source || ''), 'etiket kod adıyla başlıyor (anonimlik)');
}

// ---------------------------------------- Halcyon (temiz sağlayıcı — sinemacc)
console.log('\n═══ Halcyon (temiz sağlayıcı, film) ═══');
const { coz: cozHalcyon } = await import('../src/providers/halcyon.js');
const hal = await cozHalcyon({ type: 'movie', title: 'Interstellar', originalTitle: 'Interstellar', tmdbId: 157336 });
const srcH = (hal && hal.sources) || [];
ok(srcH.length > 0, `doğrudan yayın çözüldü: ${srcH.length} kaynak`);
// iframe YASAK: yalnız bizim oynatıcımızda oynayan doğrudan akışlar listelenir
ok(srcH.every((s) => !s.isIframe && s.url && !/^https?:\/\/[^/]+\/(player|embed)\//i.test(s.url)),
   'yalnız doğrudan akış (gömülü oynatıcı yok)');
// kaynak() sözleşmesi: etiket name/source alanlarında (eski `ad` alanı kalktı)
ok(srcH.every((s) => /^Halcyon\b/.test(s.name || s.source || '')), 'etiketler kod adıyla başlıyor (anonimlik)');

// ------------------------------------------------- jetfilm / filmmodu M3U
console.log('\n═══ Film M3U kaynakları (VOD) ═══');
const vod = await import('../src/services/vodM3uSources.js');
const items = fs.readFileSync('/tmp/opencode/jetfilm_tum.m3u', 'utf8');
const parsed = vod.parseVodM3u(items);
ok(parsed.length > 1000, `jetfilm ayrıştırma: ${parsed.length} film`);
ok(parsed[0] && parsed[0].url.startsWith('http'), 'yayın adresleri http');
const withUa = parsed.filter(x => x.ua).length;
ok(withUa > 0, `#EXTVLCOPT UA taşıyor: ${withUa}/${parsed.length}`);
// '#Saraitda' gibi gercek film adlari '#' ile baslayabilir; asil kontrol
// HTML ETIKETI var mi (XSS yuzeyi).
ok(parsed.every(x => !/<\/?[a-z][^>]*>/i.test(x.title)), 'başlıklarda HTML etiketi yok');

const sfilm = await vod.searchVodMovie('barbie');
ok(sfilm.length > 0, `arama "barbie": ${sfilm.length} sonuç`);
const fsrc = await vod.fetchVodSources({ title: 'Barbie', titles: [] });
ok(fsrc.length > 0, `oynatılabilir kaynak: ${fsrc.length}`);
if (fsrc[0]) {
  ok(fsrc[0].streamUrl.includes('&ua='), 'UA proxy parametresine eklendi');
  ok(fsrc[0].isDirectFile === true, 'doğrudan dosya olarak işaretli');
}

// Canlı TV'ye karışmıyor mu (dizi77/sinemacc sadece kendi modülünde)
console.log('\n═══ Canlı TV izolasyonu ═══');
const live = await import('../src/services/turkishLiveSources.js');
// Canlı TV kaynakları film/dizi listelerine KARIŞMAMALI. izlego M3U eklendi,
// bu yüzden sayı 2 değil 3; asıl kontrol film/dizi kaynaklarının burada
// görünmemesi.
const canliIds = live.LIVE_SOURCES.map((s) => s.id);
ok(!canliIds.includes('dizi77') && !canliIds.includes('sinemacc') && !canliIds.includes('vodm3u'),
   `Canlı TV'de film/dizi kaynağı yok (kaynaklar: ${canliIds.join(', ')})`);

console.log(`\n${fail === 0 ? 'TAMAM' : 'BAŞARISIZ'} — geçen: ${pass}, kalan: ${fail}`);
process.exit(fail === 0 ? 0 : 1);