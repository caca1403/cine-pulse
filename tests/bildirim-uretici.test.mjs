/* ==========================================================================
   bildirimUretici.js — Saf Bildirim Üretici Birim Testleri
   --------------------------------------------------------------------------
   Çalıştır: node --test tests/bildirim-uretici.test.mjs
   DOM/Fetch yok: tüm girdiler fixture/objedir.
   ========================================================================== */
import test from 'node:test';
import assert from 'node:assert/strict';
import { bildirimUret } from '../src/services/icerik/bildirimUretici.js';

const SIMDI = new Date('2026-10-24T12:00:00Z').getTime();
const gun = (n) => new Date(SIMDI + n * 86400000).toISOString();

// ----------------------------------------------------------------
// 1. Boş / geçersiz girdi
// ----------------------------------------------------------------

test('1) boş girdi → boş liste', () => {
  assert.deepEqual(bildirimUret([], SIMDI), []);
  assert.deepEqual(bildirimUret(undefined, SIMDI), []);
  assert.deepEqual(bildirimUret(null, SIMDI), []);
});

test('2) adsız veya tarihsiz kayıt elenir', () => {
  const liste = bildirimUret([
    { tmdbId: 1, ad: '', sonrakiHava: gun(1) },          // adsız
    { tmdbId: 2, sonrakiHava: gun(1) },                  // adsız
    { tmdbId: 3, ad: 'Dizi C' },                          // tarihsiz
    { tmdbId: 4, ad: 'Dizi D', sonrakiHava: 'bozuk-tarih' }, // geçersiz tarih
    { tmdbId: 5, ad: 'Dizi E', sonrakiHava: gun(1) }     // tek geçerli
  ], SIMDI);
  assert.equal(liste.length, 1);
  assert.equal(liste[0].ad, 'Dizi E');
});

// ----------------------------------------------------------------
// 2. Geçmiş eleme
// ----------------------------------------------------------------

test('3) geçmişte kalan yayınlar elenir, gelecekteki kalır', () => {
  const liste = bildirimUret([
    { tmdbId: 1, ad: 'Geçmiş Dizi', sonrakiHava: gun(-3) },
    { tmdbId: 2, ad: 'Şimdi', sonrakiHava: new Date(SIMDI).toISOString() }, // tam "şimdi" → eşik dışı
    { tmdbId: 3, ad: 'Gelecek Dizi', sonrakiHava: gun(2) }
  ], SIMDI);
  const ads = liste.map(n => n.ad);
  assert.ok(!ads.includes('Geçmiş Dizi'));
  assert.ok(!ads.includes('Şimdi'));
  assert.ok(ads.includes('Gelecek Dizi'));
});

// ----------------------------------------------------------------
// 3. Sıralama — yayına en yakın önce
// ----------------------------------------------------------------

test('4) en yakın yayın önce gelir (artan tarih sırası)', () => {
  const liste = bildirimUret([
    { tmdbId: 1, ad: 'Uzak', sonrakiHava: gun(10) },
    { tmdbId: 2, ad: 'Yakın', sonrakiHava: gun(1) },
    { tmdbId: 3, ad: 'Orta', sonrakiHava: gun(5) }
  ], SIMDI);
  assert.deepEqual(liste.map(n => n.ad), ['Yakın', 'Orta', 'Uzak']);
});

// ----------------------------------------------------------------
// 4. Tekilleştirme
// ----------------------------------------------------------------

test('5) aynı yapıma ait tekrarlar tekilleşir, en yakın tarih korunur', () => {
  const liste = bildirimUret([
    { tmdbId: 100, ad: 'Dizi X', sonrakiHava: gun(7) },
    { tmdbId: 100, ad: 'Dizi X', sonrakiHava: gun(2) },
    { tvmazeId: 55, ad: 'Dizi Y', sonrakiHava: gun(3) },
    { tvmazeId: 55, ad: 'Dizi Y (tekrar)', sonrakiHava: gun(4) }
  ], SIMDI);
  assert.equal(liste.length, 2);
  const x = liste.find(n => n.tmdbId === 100);
  assert.equal(x.yayinZamani, SIMDI + 2 * 86400000);
  const y = liste.find(n => n.tvmazeId === 55);
  assert.equal(y.yayinZamani, SIMDI + 3 * 86400000);
});

// ----------------------------------------------------------------
// 5. Aynı gün — ikisi de kalır, saat sırası
// ----------------------------------------------------------------

test('6) aynı gün yayınlanan iki yapım da kalır ve saate göre sıralanır', () => {
  const liste = bildirimUret([
    { tmdbId: 1, ad: 'Akşam Dizisi', sonrakiHava: '2026-10-25T21:00:00Z' },
    { tmdbId: 2, ad: 'Öğlen Dizisi', sonrakiHava: '2026-10-25T12:00:00Z' }
  ], SIMDI);
  assert.equal(liste.length, 2);
  assert.deepEqual(liste.map(n => n.ad), ['Öğlen Dizisi', 'Akşam Dizisi']);
});

// ----------------------------------------------------------------
// 6. Kimliksiz (sadece ad) kayıt
// ----------------------------------------------------------------

test('7) kimliksiz ama adlı kayıt korunur ve ada göre tekilleşir', () => {
  const liste = bildirimUret([
    { ad: 'Adsız Dizi', sonrakiHava: gun(1) },
    { ad: 'adsız dizi', sonrakiHava: gun(2) }, // aynı ad (büyük/küçük harf farkı)
    { ad: 'Başka Dizi', sonrakiHava: gun(3) }
  ], SIMDI);
  assert.equal(liste.length, 2);
  const ilk = liste.find(n => n.ad.toLocaleLowerCase('tr') === 'adsız dizi');
  assert.equal(ilk.yayinZamani, SIMDI + 1 * 86400000); // en yakın tarih korundu
  assert.equal(ilk.tmdbId, null);
});

// ----------------------------------------------------------------
// 8. Yapı: göreli metin yok, alanlar tam
// ----------------------------------------------------------------

test('8) çıktı yapılandırılmış: id/tmdbId/yayinZamani var, göreceli metin yok', () => {
  const liste = bildirimUret([
    { tmdbId: 9, ad: 'Yapı A', sonrakiHava: gun(1), bolumEtiketi: 'S2 B4' }
  ], SIMDI);
  assert.equal(liste.length, 1);
  const n = liste[0];
  assert.ok(typeof n.id === 'string' && n.id.startsWith('bildirim_'));
  assert.equal(n.tmdbId, 9);
  assert.equal(n.bolumEtiketi, 'S2 B4');
  assert.equal(typeof n.yayinZamani, 'number');
  // Göreceli Türkçe metin ("yarın", "gün kaldı") saf modülde üretilmemeli
  const birlesik = JSON.stringify(n).toLocaleLowerCase('tr');
  assert.ok(!birlesik.includes('yarın'));
  assert.ok(!birlesik.includes('kaldı'));
});

// ----------------------------------------------------------------
// 9. Limit
// ----------------------------------------------------------------

test('9) limit aşılırsa en yakın N kayıt döner', () => {
  const adaylar = Array.from({ length: 12 }, (_, i) => ({
    tmdbId: i + 1,
    ad: `Dizi ${i + 1}`,
    sonrakiHava: gun(i + 1)
  }));
  const liste = bildirimUret(adaylar, SIMDI, 5);
  assert.equal(liste.length, 5);
  assert.equal(liste[0].ad, 'Dizi 1');
  assert.equal(liste[4].ad, 'Dizi 5');
});
