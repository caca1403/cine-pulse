/* Çoklu site sürücüsü — zincirin doğru kurulduğunu ölçer.
   NOT: bu ağdan sunucuya giden isteklerde bu siteler Cloudflare 403
   döndürüyor, bu yüzden canlı doğrulama cihazda yapılır. Burada yanıtlar
   taklit edilir; ölçülen şey kodun doğru YÖNLENDİRMESİ. */

import { SITES, siteListesi, siteBaseUrl } from '../src/services/siteProviders.js';

globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
globalThis.window = { location: { hostname: '', protocol: 'https:' } };

let gecti = 0, kalan = 0;
function ok(kosul, ad, ek = '') {
  if (kosul) { gecti++; console.log(`  ✓ ${ad}${ek ? ' — ' + ek : ''}`); }
  else { kalan++; console.log(`  ✗ ${ad}${ek ? ' — ' + ek : ''}`); }
}

console.log('═══ çoklu site sürücüsü ═══');
ok(Object.keys(SITES).length >= 19, 'site kayıtlı', Object.keys(SITES).join(', '));

// Yanıt taklidi — her sitenin kendi arama biçimi
globalThis.fetch = async (u, o) => {
  const s = String(u);
  const metin = (t) => ({ ok: true, status: 200, text: async () => t });
  if (s.includes('siteurl.txt')) {
    return metin('hdfilmcehennemi:https://www.hdfilmcehennemi.nl\nselcukflix:https://selcukflix.app/\n');
  }
  if (s.includes('api.themoviedb.org')) return metin(JSON.stringify({ imdb_id: 'tt15239678' }));

  const dolgu = (t) => t.padEnd(320, '.');
  if (s.includes('hdfilmcehennemi.nl/search?q=')) {
    return metin(dolgu('<a href="/video/oppenheimer-2023/">Oppenheimer</a>'));
  }
  if (s.includes('hdfilmcehennemi.nl/video/')) {
    return metin(dolgu('<iframe data-src="https://o.hdcc.tv/embed/abc"></iframe>'));
  }
  if (s.includes('o.hdcc.tv/embed/abc')) {
    return metin(dolgu('<script>var p={"file":"https://cdn.hdcc.tv/hls/x.mpd/txt/master.txt"};</script>'));
  }

  if (s.includes('selcukflix.app/api/bg/searchContent')) {
    return metin(JSON.stringify({ results: [{ title: 'Oppenheimer', slug: 'oppenheimer' }] }));
  }
  if (s.includes('selcukflix.app/oppenheimer')) {
    return metin(dolgu("<script>openPlayer('https://tr.selcukflix.tv/hls/op/master.m3u8');</script>"));
  }

  if (s.includes('filmekseni.top/search/')) {
    return metin(JSON.stringify({ result: [{ title: 'Oppenheimer', slug: 'oppenheimer' }] }));
  }
  if (s.includes('vidmoly.me/embed/xyz.html')) {
    // vidmoly gömülüsü: jenerik motorun şifreli oynatıcı yolunu sınar
    return metin(dolgu('<script>var cfg={file:"https://cdn.vidmoly.tv/hls/v.m3u8"};</script>'));
  }
  if (s.includes('filmekseni.top/oppenheimer')) {
    return metin(dolgu('<iframe data-src="https://vidmoly.me/embed/xyz.html"></iframe>'));
  }
  return { ok: false, status: 404, text: async () => '' };
};

// Alan adları doğru çözülüyor mu
const b1 = await siteBaseUrl('hdfilmcehennemi');
const b2 = await siteBaseUrl('selcukflix');
const b3 = await siteBaseUrl('filmekseni');
ok(b1 === 'https://www.hdfilmcehennemi.nl/', 'hdfilmcehennemi alan adı (siteurl listesinden)', b1);
ok(b2 === 'https://selcukflix.app/', 'selcukflix alan adı (siteurl listesinden)', b2);
ok(b3 === 'https://filmekseni.top/', 'filmekseni alan adı (sabit adres)', b3);

// Her site için uçtan uca zincir
for (const [siteId, bekl] of [
  ['hdfilmcehennemi', /\.m3u8$/],
  ['selcukflix', /selcukflix\.tv/],
  ['filmekseni', /vidmoly|embed/]
]) {
  const kaynaklar = await siteListesi(siteId, { tmdbId: '872585', mediaType: 'movie', title: 'Oppenheimer' });
  const uygun = kaynaklar.filter((k) => bekl.test(k.url));
  ok(uygun.length > 0, `${siteId}: zincir tamam`,
     uygun[0] ? `${kaynaklar.length} kaynak, ilki: ${uygun[0].url.slice(0, 54)}` : `${kaynaklar.length} kaynak (m3u8 yok)`);
  ok(kaynaklar.some((k) => k.isSayfa), `${siteId}: gömülü yedek eklendi`);
}

console.log(`\nTAMAM — geçen: ${gecti}, kalan: ${kalan}`);
process.exit(kalan === 0 ? 0 : 1);