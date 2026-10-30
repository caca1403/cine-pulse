import test from 'node:test';
import assert from 'node:assert/strict';

/* Eklenti kaynak satırı alanları: boyut/seeder/sağlayıcı/dil/kaynak tipi. */

globalThis.localStorage = { _m: {}, getItem(k) { return this._m[k] ?? null; }, setItem(k, v) { this._m[k] = String(v); } };
globalThis.window = { addEventListener() {}, removeEventListener() {} };

const { satirDonustur, baslikAyristir, manifestAilesi, adresSiniflandir } = await import('../src/services/dogrudan/eklentiServisi.js');

test('Torrentio tam başlık: seeder, boyut, sağlayıcı, kaynak tipi ve dual', () => {
  const baslik = 'Obsession 2026 1080p DUAL BluRay x264 👤 221 💾 8.85 GB ⚙ ThePirateBay';
  const a = baslikAyristir(baslik);
  assert.equal(a.seeders, 221);
  assert.equal(a.boyut, '8.85 GB');
  assert.equal(a.boyutBayt, 8850000000);
  assert.equal(a.saglayici, 'ThePirateBay');
  assert.equal(a.kaynakTipi, 'BluRay');
  assert.deepEqual(a.diller, ['dual']);

  // Satır dönüşümü aynı alanları taşır, mevcut alanlar bozulmaz.
  const s = satirDonustur({ name: 'Torrentio\n1080p', infoHash: 'abc123', title: baslik }, { ad: 'Eklenti' }, 0);
  assert.equal(s.seeders, 221);
  assert.equal(s.boyut, '8.85 GB');
  assert.equal(s.saglayici, 'ThePirateBay');
  assert.equal(s.kaynakTipi, 'BluRay');
  assert.deepEqual(s.diller, ['dual']);
  assert.equal(s.kalite, '1080p');
  assert.ok(s.streamUrl.startsWith('magnet:?xt=urn:btih:abc123'));
});

test('işaretsiz sade başlık: alanlar null/0, patlama yok', () => {
  const s = satirDonustur({ name: 'X', url: 'https://cdn.example/v.mp4', title: 'Bir Film' }, { ad: 'X' }, 0);
  assert.equal(s.boyut, null);
  assert.equal(s.boyutBayt, 0);
  assert.equal(s.seeders, 0);
  assert.equal(s.saglayici, null);
  assert.deepEqual(s.diller, []);
  assert.equal(s.kaynakTipi, null);
  assert.equal(s.kalite, 'auto');
});

test('CloudStream tarzı "1080p | 2.1 GB": emoji olmadan boyut okunur', () => {
  const a = baslikAyristir('Film 1080p | 2.1 GB');
  assert.equal(a.boyut, '2.1 GB');
  assert.equal(a.boyutBayt, 2100000000);
  assert.equal(a.seeders, 0);
  assert.equal(a.saglayici, null);
});

test('Türkçe dublaj ipuçları tr olarak işaretlenir', () => {
  assert.deepEqual(baslikAyristir('Film 1080p TR Dublaj').diller, ['tr']);
  assert.deepEqual(baslikAyristir('Film 1080p 🇹🇷 Türkçe').diller, ['tr']);
  assert.ok(baslikAyristir('Film 1080p DUAL SUB').diller.includes('altyazi'));
});

test('manifest ailesi: stream → stremio/nuvio, scraper/manifest yok → null', () => {
  assert.equal(manifestAilesi({ resources: ['stream'] }), 'stremio');
  assert.equal(manifestAilesi({ resources: [{ name: 'stream', types: ['movie'] }] }), 'stremio');
  assert.equal(manifestAilesi({ resources: ['stream'], nuvio: true }), 'nuvio');
  assert.equal(manifestAilesi({ resources: ['catalog'] }), null);
  assert.equal(manifestAilesi({ scrapers: ['x'] }), null);
  assert.equal(manifestAilesi(null), null);
});

/* ── Madde 5 (kullanıcı 2026-10-28): bayrak çiftleri tam toplanır, diğer
   alanlar (seeders/boyut/sağlayıcı/kaynak tipi) bozulmaz. ────────────────── */

test('çok bayraklı Torrentio başlığı: tüm bayraklar başlık sırasıyla, diğer alanlar sağlam', () => {
  const baslik = 'Film 2024 1080p 🇹🇷🇬🇧🇩🇪 WEB-DL x264 👤 12 💾 2.4 GB ⚙ 1337x';
  const a = baslikAyristir(baslik);
  assert.deepEqual(a.diller, ['tr', 'gb', 'de']); // başlıktaki sıra, mükerrer yok
  assert.equal(a.seeders, 12);
  assert.equal(a.boyut, '2.4 GB');
  assert.equal(a.boyutBayt, 2400000000);
  assert.equal(a.saglayici, '1337x');
  assert.equal(a.kaynakTipi, 'WEB-DL');
});

test('DUAL+SUB karışık başlık: bayrak + kelime ipuçları sırayla ve mükerrersiz', () => {
  const baslik = 'Dizi S01E02 🇹🇷 DUAL TR Dublaj SUB 720p WEBRip 👤 5 💾 800 MB ⚙ YTS';
  const a = baslikAyristir(baslik);
  // 🇹🇷 ve 'TR Dublaj' tek 'tr' olur (mükerrer temizliği); sıra başlıktaki sıra.
  assert.deepEqual(a.diller, ['tr', 'dual', 'altyazi']);
  const s = satirDonustur({ name: 'Ekl\n720p', url: 'https://cdn.example/v.mp4', title: baslik }, { ad: 'Eklenti' }, 1);
  assert.equal(s.seeders, 5);
  assert.equal(s.boyut, '800 MB');
  assert.equal(s.boyutBayt, 800000000);
  assert.equal(s.saglayici, 'YTS');
  assert.equal(s.kaynakTipi, 'WEBRip');
  assert.equal(s.kalite, '720p');
});

test('bayraksız sade başlık: diller boş, seeders/boyut/saglayıcı alanları bozulmaz', () => {
  const baslik = 'Sade Film 1080p BluRay';
  const a = baslikAyristir(baslik);
  assert.deepEqual(a.diller, []);
  assert.equal(a.seeders, 0);
  assert.equal(a.boyut, null);
  assert.equal(a.boyutBayt, 0);
  assert.equal(a.saglayici, null);
  assert.equal(a.kaynakTipi, 'BluRay');
});

/* ── Madde E (kullanıcı 2026-10-28): yapıştırılan link sınıflandırma. ─────── */

test('link sınıflandırma: manifest, xurl, stream endpoint, cloudstream repo, geçersiz', () => {
  assert.deepEqual(adresSiniflandir('https://addon.example/manifest.json'), { tur: 'manifest', taban: 'https://addon.example' });
  assert.deepEqual(adresSiniflandir('https://addon.example'), { tur: 'manifest', taban: 'https://addon.example' });
  // XURL benzeri boot linki → gerçek manifest adresine çözülür
  const xurl = adresSiniflandir('https://boot.example/?xurl=' + encodeURIComponent('https://real.addon/manifest.json'));
  assert.deepEqual(xurl, { tur: 'manifest', taban: 'https://real.addon' });
  // Doğrudan stream endpoint'i → manifest tabanı türetilir
  assert.deepEqual(adresSiniflandir('https://host.example/prefix/stream/movie/tt123456.json'), { tur: 'manifest', taban: 'https://host.example/prefix' });
  // CloudStream repo → dürüst, neden-temelli mesaj, sessiz başarısızlık yok
  // (kullanıcı 2026-10-29: masaüstü mesajı 'desteklenmiyor' utanç mesajı değil).
  const repo = adresSiniflandir('https://repo.example/cloudstream.apk');
  assert.equal(repo.tur, 'cloudstream-repo');
  assert.match(repo.hata, /yerli katman/);
  assert.match(repo.hata, /desteklenmez/);
  assert.equal(adresSiniflandir('https://repo.example/repo.json').tur, 'cloudstream-repo');
  // .cs3 tekil eklenti ve GitHub release adresi de CloudStream ailesidir
  assert.equal(adresSiniflandir('https://github.com/Wiojelt/WioSinema/releases/download/v1.2/WioSinema.cs3').tur, 'cloudstream-repo');
  assert.equal(adresSiniflandir('https://repo.example/plugins.json').tur, 'cloudstream-repo');
  assert.equal(adresSiniflandir('not-a-url').tur, 'gecersiz');
  assert.equal(adresSiniflandir('').tur, 'bos');
});
