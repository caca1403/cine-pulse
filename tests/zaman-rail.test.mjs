/* ==========================================================================
   Zaman rail çekirdeği birim testleri (src/services/kesif/zamanRail.js)
   --------------------------------------------------------------------------
   Çalıştır: node --test tests/zaman-rail.test.mjs
   Ağ yok, DOM yok: `simdi` enjekte edilir, girdiler fixture.
   ========================================================================== */
import test from 'node:test';
import assert from 'node:assert/strict';
import { zamanRail, ZAMAN_RAIL_BU_HAFTA_GUN } from '../src/services/kesif/zamanRail.js';

const SIMDI = new Date('2026-10-24T12:00:00Z').getTime();

const film = (id, tarih) => ({ id, title: `Film ${id}`, release_date: tarih, media_type: 'movie' });
const dizi = (id, tarih) => ({ id, name: `Dizi ${id}`, first_air_date: tarih, media_type: 'tv' });
const gunSonrasi = (gun) => {
  const d = new Date(SIMDI); d.setUTCDate(d.getUTCDate() + gun); return d.toISOString().slice(0, 10);
};

// ----------------------------------------------------------------
// 1. Kovalar: bugün (0), bu hafta (3), yakında (12 gün)
// ----------------------------------------------------------------
test('1) kovalar: bugün/bu hafta/yakında gün farkına göre ayrılır', () => {
  const { bugun, buHafta, yakinda } = zamanRail([
    film(1, '2026-10-24'),   // bugün
    film(2, gunSonrasi(3)),  // bu hafta
    film(3, gunSonrasi(12))  // yakında
  ], SIMDI);
  assert.equal(bugun.length, 1);
  assert.equal(bugun[0].id, 1);
  assert.equal(buHafta.length, 1);
  assert.equal(buHafta[0].id, 2);
  assert.equal(yakinda.length, 1);
  assert.equal(yakinda[0].id, 3);
});

// ----------------------------------------------------------------
// 2. TMDB id tekilleştirme
// ----------------------------------------------------------------
test('2) TMDB id tekilleştirme: aynı id iki farklı tarihte tek sayılır (ilk öncekiden)', () => {
  const { bugun, buHafta, yakinda } = zamanRail([
    film(7, '2026-10-24'),
    film(7, gunSonrasi(1))
  ], SIMDI);
  const toplam = bugun.length + buHafta.length + yakinda.length;
  assert.equal(toplam, 1);
  assert.equal(bugun[0].id, 7);
});

// ----------------------------------------------------------------
// 3. Tarihsiz / geçersiz tarihli öğelerin elemesi
// ----------------------------------------------------------------
test('3) tarihsiz veya geçersiz tarihli öğeler hiçbir kola girmez', () => {
  const { bugun, buHafta, yakinda } = zamanRail([
    { id: 10, title: 'Tarihsiz' },
    { id: 11, title: 'Boş tarih', release_date: '' },
    { id: 12, title: 'Çöptür', release_date: 'not-a-date' },
    { id: 13, title: 'Geçersiz', release_date: '2026-13-99' },
    null, undefined, 'yazi'
  ], SIMDI);
  assert.equal(bugun.length + buHafta.length + yakinda.length, 0);
});

// ----------------------------------------------------------------
// 4. Sınır: 7. gün DAHİL = bu hafta; 8. gün = yakında
//    (docstring: ZAMAN_RAIL_BU_HAFTA_GUN = 7; 8. gün ve ilerisi zaten "yakında")
// ----------------------------------------------------------------
test('4) sınır: 7. gün dahil bu hafta, 8. gün ve sonrası yakında', () => {
  const { buHafta, yakinda } = zamanRail([
    film(20, gunSonrasi(7)),
    film(21, gunSonrasi(8))
  ], SIMDI);
  assert.equal(ZAMAN_RAIL_BU_HAFTA_GUN, 7);
  assert.equal(buHafta.length, 1);
  assert.equal(buHafta[0].id, 20);
  assert.equal(yakinda.length, 1);
  assert.equal(yakinda[0].id, 21);
});

// ----------------------------------------------------------------
// 5. Boş kümeler
// ----------------------------------------------------------------
test('5) boş girdi → tüm kovalar boş dizi', () => {
  assert.deepEqual(zamanRail([], SIMDI), { bugun: [], buHafta: [], yakinda: [] });
  assert.deepEqual(zamanRail(undefined), { bugun: [], buHafta: [], yakinda: [] });
});

// ----------------------------------------------------------------
// 6. `simdi` (now) enjekte edilebilir → deterministik sınıflandırma
// ----------------------------------------------------------------
test('6) simdi enjekte edilebilir: aynı öğeler farklı şimdiye göre farklı kovada', () => {
  const simdiOnOnce = new Date('2026-10-10T12:00:00Z').getTime(); // öğe 14 gün önde → yakında
  const simdiBugun = new Date('2026-10-24T12:00:00Z').getTime();   // aynı gün → bugün
  const ogeler = [film(30, '2026-10-24')];
  assert.equal(zamanRail(ogeler, simdiOnOnce).yakinda.length, 1);
  assert.equal(zamanRail(ogeler, simdiBugun).bugun.length, 1);
});

// ----------------------------------------------------------------
// 7. Geçmişteki tarih (gün farkı < 0) hiçbir kola girmez
// ----------------------------------------------------------------
test('7) geçmişteki tarih: hiçbir kova (yakında yalnız gelecektir)', () => {
  const d = new Date(SIMDI); d.setUTCDate(d.getUTCDate() - 5);
  const sonuc = zamanRail([film(40, d.toISOString().slice(0, 10))], SIMDI);
  assert.equal(sonuc.bugun.length + sonuc.buHafta.length + sonuc.yakinda.length, 0);
});

// ----------------------------------------------------------------
// 8. Tip etiketi (film/dizi) + girdinin mutasyona tutulmaması
// ----------------------------------------------------------------
test('8) _zamanTip film/dizi etiketi; girdi nesnesi bozulmaz', () => {
  const orjinalDizi = { id: 50, name: 'X', first_air_date: '2026-10-25' };
  const { buHafta } = zamanRail([
    { id: 51, title: 'F', release_date: '2026-10-25', media_type: 'movie' },
    orjinalDizi
  ], SIMDI);
  assert.equal(buHafta.length, 2);
  assert.equal(buHafta[0]._zamanTip, 'film');
  assert.equal(buHafta[1]._zamanTip, 'dizi');
  assert.equal(buHafta[1].id, 50);
  assert.equal(orjinalDizi._zamanTip, undefined); // girdi karpia uğramadı
  assert.notStrictEqual(buHafta[1], orjinalDizi); // kopya üzerinden çalışır
});
