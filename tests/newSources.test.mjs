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
console.log('\n═══ dizi77.life (dizi kaynağı) ═══');
const d77 = await import('../src/services/dizi77Scraper.js');
const s77 = await d77.searchDizi77('walking');
ok(Array.isArray(s77) && s77.length > 0, `arama: ${s77.length} dizi`);
ok(s77.some(r => /walking/i.test(r.id + r.title)), 'hedef dizi listede');
const t77 = await d77.searchDizi77('the walking dead');
const target = t77.find(r => r.id === 'the-walking-dead') || t77[0];
console.log(`    → "${target.title}" (${target.url})`);
const src77 = await d77.fetchDizi77EpisodeSources(target.url, 1, 1);
ok(src77.length > 0, `1.sezon 1.bolum oynatıcı: ${src77.length} kaynak`);
if (src77[0]) {
  ok(/^https?:\/\//.test(src77[0].streamUrl), `iframe geçerli: ${src77[0].streamUrl.slice(0, 62)}`);
  ok(src77[0].isIframe === true, 'isIframe işaretli (gömülü oynatıcı)');
}

// ------------------------------------------------------------- sinemacc
console.log('\n═══ sinemacc.com (film kaynağı) ═══');
const smc = await import('../src/services/sinemaccScraper.js');
const listS = await smc.searchSinemacc('film', false);
ok(Array.isArray(listS) && listS.length > 0, `katalog: ${listS.length} film`);
if (listS[0]) console.log(`    → "${listS[0].title}" (${listS[0].url})`);
const srcS = await smc.fetchSinemaccSources({ title: listS[0]?.title || '', titles: [] });
ok(srcS.length > 0, `oynatıcı çözüldü: ${srcS.length} kaynak`);
if (srcS[0]) {
  ok(/^https?:\/\/player\./.test(srcS[0].streamUrl), `base64 çözüldü: ${srcS[0].streamUrl.slice(0, 62)}`);
}

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
ok(live.LIVE_SOURCES.length === 2, `Canlı TV kaynak sayısı hâlâ ${live.LIVE_SOURCES.length} (kral, turhan)`);

console.log(`\n${fail === 0 ? 'TAMAM' : 'BAŞARISIZ'} — geçen: ${pass}, kalan: ${fail}`);
process.exit(fail === 0 ? 0 : 1);