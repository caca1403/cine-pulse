/* Film Makinesi kazıyıcısı — devrede olmayan katmanların doğruluğu.

   NOT: bu ağdan sunucuya giden HER istek Cloudflare 403 alıyor, bu yüzden
   canlı doğrulama cihazda yapılır. Buradaki test, kazıyıcının zincirini
   (alan adı → IMDb → arama → oynatıcı → master.txt düzeltmesi) doğrular. */
import { fetchFilmMakinesiSources, masterUrlDuzelt } from '../src/services/filmmakinesiScraper.js';

globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
globalThis.window = { location: { hostname: '', protocol: 'https:' } };

let gecti = 0, kalan = 0;
function ok(kosul, ad, ek = '') {
  if (kosul) { gecti++; console.log(`  ✓ ${ad}${ek ? ' — ' + ek : ''}`); }
  else { kalan++; console.log(`  ✗ ${ad}${ek ? ' — ' + ek : ''}`); }
}

// DiziSol'un "filmmakinesi" yayınları bu dönüşüm olmadan 404 veriyordu.
ok(masterUrlDuzelt('https://cdn.com/a/b.mpd/txt/master.txt') === 'https://cdn.com/a/b.mpd/master.m3u8',
   'txt/master.txt → master.m3u8 dönüşümü');

globalThis.fetch = async (u) => {
  const s = String(u);
  if (s.includes('siteurl.txt')) return { ok: true, status: 200, text: async () => 'filmmakinesi:https://filmmakinesi.to/\njetfilm:https://x.com/\n' };
  if (s.includes('api.themoviedb.org')) return { ok: true, status: 200, text: async () => JSON.stringify({ imdb_id: 'tt15239678', title: 'Oppenheimer' }) };
  if (s.includes('/arama/?s=')) return { ok: true, status: 200, text: async () => '<a href="/film/oppenheimer-2023/">Oppenheimer</a>' };
  if (s.includes('/film/oppenheimer-2023/')) return { ok: true, status: 200, text: async () => '<iframe data-src="https://oyn.example/x/abc123"></iframe>' };
  if (s.includes('oyn.example/x/abc123')) return { ok: true, status: 200, text: async () => '<script>var s="https://cdn.hd/v/x.mpd/txt/master.txt";</script>' };
  return { ok: true, status: 200, text: async () => '' };
};

const kaynaklar = await fetchFilmMakinesiSources({ tmdbId: '872585', mediaType: 'movie', title: 'Oppenheimer' });
const m3u8 = kaynaklar.find((k) => /\.m3u8/.test(k.url));
ok(kaynaklar.length > 0, 'kaynak döndürüldü', `${kaynaklar.length} adet`);
ok(Boolean(m3u8), 'm3u8 çözüldü', m3u8 ? m3u8.url : 'yok');
ok(Boolean(m3u8 && m3u8.url.endsWith('/master.m3u8')), 'master.txt düzeltmesi uygulandı');
ok(kaynaklar.some((k) => k.isSayfa), 'canlı sayfa yedeği eklendi');

console.log(`\nTAMAM — geçen: ${gecti}, kalan: ${kalan}`);
process.exit(kalan === 0 ? 0 : 1);
