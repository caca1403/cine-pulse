import test from 'node:test';
import assert from 'node:assert/strict';

/* Kararlı satır kimliği (kullanıcı 2026-10-29: "önbellekten gelen kaynak
   taramada yine gelebiliyor"). Kök sebep: CloudStream/Nuvio imzalı URL'leri
   her taramada yeniler — sorgu soyulmadan anahtar kararlı olmaz. */

globalThis.localStorage = { _m: {}, getItem(k) { return this._m[k] ?? null; }, setItem(k, v) { this._m[k] = String(v); } };
globalThis.window = { addEventListener() {}, removeEventListener() {} };

const { satirKimligi, onbellekYaz, onbellekten, _onbellekBosalt } = await import('../src/services/kaynak/kaynakOnbellek.js');

test('dönen imza aynı satırdır: sorgu/sas farklıysa kimlik AYNI kalır', () => {
  const a = { streamUrl: 'https://cdn.example/master.m3u8?tok=AAA&exp=1', eklentiAdi: 'WioSinema', baslik: 'WioSinema • HDF • 1080p' };
  const b = { streamUrl: 'https://cdn.example/master.m3u8?tok=ZZZ#yeni', eklentiAdi: 'WioSinema', baslik: 'WioSinema • HDF • 1080p' };
  assert.equal(satirKimligi(a), satirKimligi(b));
});

test('farklı kaynaklar birleşmez: yol, sağlayıcı veya ad farkı kimliği ayırır', () => {
  const taban = { streamUrl: 'https://cdn.example/a.m3u8', eklentiAdi: 'X', baslik: 't' };
  assert.notEqual(satirKimligi(taban), satirKimligi({ ...taban, streamUrl: 'https://cdn.example/b.m3u8' }));
  assert.notEqual(satirKimligi(taban), satirKimligi({ ...taban, eklentiAdi: 'Y' }));
  assert.notEqual(satirKimligi(taban), satirKimligi({ ...taban, baslik: 'diger' }));
});

test('önbayarak senaryosu: cache-tohum + dönen URL\'li tarama satırı YIĞILMAZ', () => {
  _onbellekBosalt();
  const anahtar = 'movie:1:s1e1';
  const tohum = { streamUrl: 'https://cdn.example/master.m3u8?tok=ESKI', source: 'Wio', baslik: 'Wio • HDF • 1080p' };
  onbellekYaz(anahtar, [{ ham: tohum, tip: 'eklenti', kimlik: satirKimligi(tohum), ekKaynak: '', kategori: '' }], false);
  // KaynakListesi'nin satırEkle mantığının çekirdeği: aynı kimlik → ikinci satır yok.
  const satirlar = [{ adres: satirKimligi(tohum) }];
  const yeniTarama = { streamUrl: 'https://cdn.example/master.m3u8?tok=YENI', source: 'Wio', baslik: 'Wio • HDF • 1080p' };
  const adres = satirKimligi(yeniTarama);
  if (!satirlar.some(x => x.adres === adres)) satirlar.push({ adres });
  assert.equal(satirlar.length, 1, 'dönen imza ikinci satır üretemez');
  // Gerçekten yeni adres → büyür (monoton kural bozulmaz).
  const baska = { streamUrl: 'https://cdn2.example/x.mp4?tok=1', source: 'Wio', baslik: 'Wio • Diger' };
  const a2 = satirKimligi(baska);
  if (!satirlar.some(x => x.adres === a2)) satirlar.push({ adres: a2 });
  assert.equal(satirlar.length, 2, 'gerçek yeni satır yine eklenir');
  _onbellekBosalt();
});

test('adresi boş satır id ile kimliklenir; ikisi de yoksa boş dönebilir', () => {
  assert.equal(satirKimligi({ id: 'nuvio:s1:x' }), 'nuvio:s1:x');
  assert.equal(satirKimligi({}), '');
});

globalThis.localStorage = { _m: {}, getItem(k) { return this._m[k] ?? null; }, setItem(k, v) { this._m[k] = String(v); } };
globalThis.window = { addEventListener() {}, removeEventListener() {} };

/* ── fetch sahtesi: external_ids + /stream sayaçlı ──────────────────────── */
const vurus = { externalIds: 0, stream: [] };
globalThis.fetch = async (url) => {
  const u = String(url);
  if (u.includes('/external_ids')) {
    vurus.externalIds++;
    // Yalnız 9001'in IMDb'si çözülebilir; 777777 kota-yanıtı gibi boş döner.
    const id = u.match(/\/(movie|tv)\/(\d+)\//);
    const cozuldi = id && id[2] === '9001';
    return { ok: true, json: async () => ({ imdb_id: cozuldi ? 'tt2300896' : null }) };
  }
  if (u.includes('/stream/')) {
    vurus.stream.push(u);
    return { ok: true, json: async () => ({ streams: [{ name: 'EklentiA', title: 'Kayıp 1080p', url: 'https://cdn.example/k.mp4' }] }) };
  }
  throw new Error('beklenmedik fetch: ' + u);
};

const { kimlikCoz, eklentilerdeAra } = await import('../src/services/dogrudan/eklentiServisi.js');

/* ── 1) Pencere yüzeyi: kanonik takma ad aynı fonksiyon ─────────────────── */
test('window.xs.resolveContentId kapının kendisidir', () => {
  assert.equal(typeof window.xs?.resolveContentId, 'function');
  assert.equal(window.xs.resolveContentId, kimlikCoz);
});

/* ── 2) bilinen IMDb: TMDB'ye HİÇ sorulmaz (kota düğümü) ────────────────── */
test('imdb hazırsa kapı TMDB external_ids çağrısı yapmaz; tv anahtarı tt…:S:E', async () => {
  const kim = await kimlikCoz({ tur: 'series', imdbId: 'tt0903747', tmdbId: 1396, sezon: 1, bolum: 2, baslik: 'Breaking Bad' });
  assert.equal(kim.imdbId, 'tt0903747');
  assert.equal(kim.tmdbId, '1396');
  assert.equal(kim.cekirdekTur, 'tv');
  assert.equal(kim.anahtar, 'tt0903747:1:2');
  assert.equal(vurus.externalIds, 0, 'imdb varken TMDB vuruşu olamaz');
});

/* ── 3) tmdb-only: çözüm BİR KEZ, sonra oturum ömürlü cache ─────────────── */
test('tmdb-only çözüm external_ids\'i bir kez çağırır; ikinci çağrı cache\'ten', async () => {
  const a = await kimlikCoz({ tur: 'movie', tmdbId: 9001, baslik: 'Kayıp' });
  assert.equal(a.imdbId, 'tt2300896');
  assert.equal(a.anahtar, 'tt2300896');
  const b = await kimlikCoz({ tur: 'movie', tmdbId: 9001, baslik: 'Kayıp' });
  assert.equal(b.imdbId, 'tt2300896');
  assert.equal(vurus.externalIds, 1, 'aynı içerik için ikinci TMDB vuruşı olamaz');
  // Regresyon (bulgu 2026-10-29): cache TÜM kimliği taşıyorsa ilk çağrının
  // sezon/bolum değeri sonraki bölüme yapışır — S1 anahtarı S2'ye sızamaz.
  const c = await kimlikCoz({ tur: 'tv', tmdbId: 9001, sezon: 2, bolum: 5, baslik: 'Kayıp' });
  assert.equal(c.anahtar, 'tt2300896:2:5');
  assert.equal(vurus.externalIds, 2, 'series:9001 ayrı anahtar — kendi bir çözümü');
  const d = await kimlikCoz({ tur: 'series', tmdbId: 9001, sezon: 3, bolum: 1 });
  assert.equal(d.anahtar, 'tt2300896:3:1');
  assert.equal(vurus.externalIds, 2, 'series çözümü cache\'ten');
});

/* ── 4) Stremio dalı anahtarı kapıdan gelir (dalda TMDB yolu kalmadı) ───── */
test('stremio dalı /stream isteğini kapının tt anahtarıyla yapar', async () => {
  localStorage.setItem('cp_eklentiler', JSON.stringify([{ url: 'https://addon.example', ad: 'A', aile: 'stremio' }]));
  const once = vurus.externalIds;
  const satirlar = [];
  const adet = await eklentilerdeAra({ tur: 'movie', tmdbId: 9001, baslik: 'Kayıp' }, (s) => satirlar.push(s));
  assert.equal(adet, 1);
  assert.equal(satirlar[0].streamUrl, 'https://cdn.example/k.mp4');
  assert.ok(vurus.stream.some(u => u.includes('/stream/movie/tt2300896.json')), 'tt anahtarıyla istenmeli: ' + vurus.stream.join(','));
  assert.equal(vurus.externalIds, once, 'kapı cache\'i sayesinde ek TMDB vuruşı olmaz');
});

/* ── 5) tv film ayrımı + yedek anahtar ──────────────────────────────────── */
test('imdb\'siz tv: anahtar tmdb:n:S:E yedeğine iner; geçersiz imdb elenir', async () => {
  const kim = await kimlikCoz({ tur: 'series', tmdbId: 777777, imdbId: 'uyduruca', sezon: 2, bolum: 3 });
  assert.equal(kim.imdbId, ''); // tt deseni olmayan değer kimlik sayılmaz
  assert.equal(kim.anahtar, 'tmdb:777777:2:3');
});
