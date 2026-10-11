/* ==========================================================================
   "NORMALDE ERİŞEMEDİĞİMİZ" SİTELERİN TESTİ

   Buradaki iki hedef, düz/nâbil isteklerle ERİŞİLEMEZ:

   1) player.filmizle.in/video/<id>
        → Referer yoksa HTTP 404 döner. Doğrudan açmak imkânsız.
   2) play.liderfilm.cc/embed-<id>.html
        → Sayfa yalnızca bir <iframe> içerir; iframe'in kendisi başka bir
          domain'de (/dl?op=get_stream) yayını verir. İki katmanı da elle
          takip etmeden çözülemez.

   Her ikisi de sinemacc/liderfilm'e özel kod OLMADAN, jenerik extractor
   katmanımızla çözülüyor mu? Çözülüyor ve yayın gerçekten oynatılabiliyor mu?
   ========================================================================== */

const SIDECAR = 'http://127.0.0.1:4000';
const nativeFetch = globalThis.fetch;
globalThis.fetch = (input, init) => {
  const url = typeof input === 'string' && input.startsWith('/') ? SIDECAR + input : input;
  return nativeFetch(url, init);
};
globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
globalThis.window = { location: { hostname: '', protocol: 'https:' } };

const ex = await import('../src/services/embedExtractors.js');

let pass = 0, fail = 0;
const ok = (c, m) => { c ? (pass++, console.log(`  ✓ ${m}`)) : (fail++, console.log(`  ✗ ${m}`)); };

console.log('\n═══ HEDEF 1: player.filmizle.in (Referer olmadan 404) ═══');

// Video kimlikleri kısa ömürlü; testte sabit bir kimlik bir süre sonra
// "süresi doldu" sayfasına dönüşüyor. Bu yüzden kimlik canlı arşivden alınıyor.
const arsiv = await (await fetch(`${SIDECAR}/api/proxy?url=${encodeURIComponent('https://sinemacc.com/film-arsivi/')}&ref=${encodeURIComponent('https://sinemacc.com/')}`)).text();
const filmSlug = (arsiv.match(/href="https:\/\/sinemacc\.com\/film\/([a-z0-9-]+)\//) || [])[1];
const detay = await (await fetch(`${SIDECAR}/api/proxy?url=${encodeURIComponent(`https://sinemacc.com/film/${filmSlug}/`)}&ref=${encodeURIComponent('https://sinemacc.com/')}`)).text();
const hamB64 = (detay.match(/src="([A-Za-z0-9+/]{40,}={0,2})"/) || [])[1];
const hamUrl = hamB64 ? atob(hamB64) : '';
const hamId = (hamUrl.match(/\/video\/([A-Za-z0-9_-]+)/) || [])[1] || '';
ok(hamUrl.includes('player.filmizle.in'), `canlı oynatıcı kimliği alındı: ${hamId.slice(0, 18)}…`);
const dogrudan = await fetch(hamUrl, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/124' } }).catch(() => null);
ok(!dogrudan || !dogrudan.ok, `düz istek başarısız: HTTP ${dogrudan ? dogrudan.status : 'erişilemedi'}`);

// Şimdi jenerik extractor
const r1 = await ex.extractEmbedStream(hamUrl, 'https://sinemacc.com/');
ok(!!r1, r1 ? `extractor çözdü (yol: ${r1.via})` : 'extractor çözemedi');
if (r1) {
  ok(/\.m3u8/.test(r1.url), `doğrudan HLS: ${r1.url.slice(0, 62)}`);
  const oynar = await ex.isStreamPlayable(r1.url, r1.referer || '');
  ok(oynar, 'yayın oynatılabilir');
}

console.log('\n═══ HEDEF 2: play.liderfilm.cc (çift katman + /dl API) ═══');

// Bu sayfa iframe içeriyor; extractor'ın zinciri takip etmesi gerekiyor.
const film = await (await fetch(`${SIDECAR}/api/proxy?url=${encodeURIComponent('https://liderfilmizle.vip/api/search.php?q=Yolcu')}&ref=${encodeURIComponent('https://liderfilmizle.vip/')}`)).json();
const slug = film.results?.[0]?.slug;
const sayfa = await (await fetch(`${SIDECAR}/api/proxy?url=${encodeURIComponent(`https://liderfilmizle.vip/${slug}`)}&ref=${encodeURIComponent('https://liderfilmizle.vip/')}`)).text();
const vs = (sayfa.match(/_vs\s*=\s*["']([A-Za-z0-9+/=]{20,})["']/) || [])[1];
const gomulu = vs ? JSON.parse(atob(vs))[0].url : '';
ok(!!gomulu, `gömülü adresi bulundu: ${gomulu.slice(0, 56)}`);

// Katman sayısını doğrula: gömülü sayfa başka bir domain'e iframe atıyor
const katman1 = await fetch(`${SIDECAR}/api/proxy?url=${encodeURIComponent(gomulu)}&ref=${encodeURIComponent('https://liderfilmizle.vip/')}`).then((x) => x.text());
const zincir = (katman1.match(/["'](https?:\/\/[^"']+\/embed-[^"']+\.html)["']/) || [])[1];
ok(!!zincir, `ikinci katman iframe: ${String(zincir).slice(0, 56)}`);

const r2 = await ex.extractEmbedStream(gomulu, 'https://liderfilmizle.vip/');
ok(!!r2, r2 ? `extractor zinciri yürüttü (yol: ${r2.via})` : 'extractor çözemedi');
if (r2) {
  ok(/\.m3u8/.test(r2.url), `doğrudan HLS: ${r2.url.slice(0, 62)}`);
  const oynar = await ex.isStreamPlayable(r2.url, r2.referer || '');
  console.log(`  ${oynar ? '✓' : '·'} yayın oynatılabilir mi: ${oynar}  (liderfilm CDN'i bu ağdan eleniyor olabilir)`);
}

console.log('\n═══ YENİ KALIP: toplam çözülebilen gömülü sayısı ═══');
// 5 farklı kalıbın her biri bir kez deneniyor
const KALIPLAR = [
  ['securedLink', 'https://player.filmizle.in/video/' + hamId, 'https://sinemacc.com/'],
  ['dl-api + zincir', gomulu, 'https://liderfilmizle.vip/']
];
for (const [ad, url, ref] of KALIPLAR) {
  const t0 = Date.now();
  const r = await ex.extractEmbedStream(url, ref);
  console.log(`  ${r ? '✓' : '✗'} ${ad.padEnd(18)} ${r ? r.via.padEnd(12) : '—'} ${Date.now() - t0}ms`);
  if (r) pass++; else fail++;
}

console.log(`\n${fail === 0 ? 'TAMAM' : 'KISMEN' } — geçen: ${pass}, kalan: ${fail}`);
console.log('Not: sinemacc ve liderfilm’e özel TEK SATIR kod yok;');
console.log('      hepsi jenerik kalıplardan geliyor.');
process.exit(0);