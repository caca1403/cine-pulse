/* ==========================================================================
   Recap Card Module Tests
   ========================================================================== */
import test from 'node:test';
import assert from 'node:assert/strict';

// Mock localStorage BEFORE importing the module
const store = new Map();
globalThis.window = {
  localStorage: {
    getItem: (key) => store.get(key) || null,
    setItem: (key, value) => store.set(key, value),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
    get length() { return store.size; },
    key: (i) => Array.from(store.keys())[i] || null
  },
  dispatchEvent() {},
  addEventListener() {},
  removeEventListener() {},
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} })
};

// Also set global.window for modules that check `typeof window`
global.window = globalThis.window;

// Now import the module (after window.localStorage is set up)
const { recapKararVer, recapGorulduMu, recapGorulduIsaretle, recapStorageTemizle, kisaltMetin } = await import('../src/services/icerik/recapKarti.js');

function resetStore() {
  store.clear();
}

test.beforeEach(() => {
  resetStore();
});

// ----------------------------------------------------------------
// 1. Film → yok (isSeries false, season/episode not applicable)
// ----------------------------------------------------------------
test('1) film modunda (sezon/bolum yok) → goster: false', () => {
  const sonuc = recapKararVer({ sezon: null, bolum: null, oncekiOverview: 'test' }, {});
  assert.equal(sonuc.goster, false);
  assert.equal(sonuc.metin, '');
});

test('1b) film modunda (season=1, episode=1 ama dizi değil) → goster: false', () => {
  const sonuc = recapKararVer({ sezon: 1, bolum: 1, oncekiOverview: 'test' }, {});
  assert.equal(sonuc.goster, false);
});

// ----------------------------------------------------------------
// 2. S1B1 → yok (ilk bölümde önceki bölüm yok)
// ----------------------------------------------------------------
test('2) Sezon 1 Bölüm 1 → goster: false', () => {
  const sonuc = recapKararVer({ sezon: 1, bolum: 1, oncekiOverview: 'Önceki bölüm özeti' }, {});
  assert.equal(sonuc.goster, false);
});

// ----------------------------------------------------------------
// 3. Overview boş → yok
// ----------------------------------------------------------------
test('3) oncekiOverview boş string → goster: false', () => {
  const sonuc = recapKararVer({ sezon: 1, bolum: 2, oncekiOverview: '' }, {});
  assert.equal(sonuc.goster, false);
});

test('3b) oncekiOverview undefined → goster: false', () => {
  const sonuc = recapKararVer({ sezon: 1, bolum: 2, oncekiOverview: undefined }, {});
  assert.equal(sonuc.goster, false);
});

test('3c) oncekiOverview sadece boşluk → goster: false', () => {
  const sonuc = recapKararVer({ sezon: 1, bolum: 2, oncekiOverview: '   ' }, {});
  assert.equal(sonuc.goster, false);
});

// ----------------------------------------------------------------
// 4. Uzun metin kırpma kelime sınırında (≤220 karakter)
// ----------------------------------------------------------------
test('4) 220 karakter altındaki metin aynen döner', () => {
  const metin = 'Bu kısa bir özet metnidir.';
  const sonuc = recapKararVer({ sezon: 1, bolum: 2, oncekiOverview: metin }, {});
  assert.equal(sonuc.goster, true);
  assert.equal(sonuc.metin, metin);
});

test('4b) 220 karakteri geçen metin kelime sınırında kırpılır', () => {
  const uzunMetin = 'Bu çok uzun bir önceki bölüm özeti metnidir. '.repeat(10);
  const sonuc = recapKararVer({ sezon: 1, bolum: 2, oncekiOverview: uzunMetin }, {});
  assert.equal(sonuc.goster, true);
  assert.ok(sonuc.metin.length <= 220);
  assert.ok(sonuc.metin.endsWith('…'));
  const sonKelime = sonuc.metin.slice(0, -1).split(' ').pop();
  assert.ok(!sonKelime.endsWith('…'), 'Kelime yarıda kesilmemeli');
});

test('4c) tam 220 karakterde kırpma yapmaz', () => {
  const metin220 = 'a'.repeat(220);
  const sonuc = recapKararVer({ sezon: 1, bolum: 2, oncekiOverview: metin220 }, {});
  assert.equal(sonuc.metin.length, 220);
  assert.ok(!sonuc.metin.endsWith('…'));
});

// ----------------------------------------------------------------
// 5. Gösterildi → yok (gosterildiMi=true)
// ----------------------------------------------------------------
test('5) gosterildiMi=true → goster: false', () => {
  const sonuc = recapKararVer(
    { sezon: 1, bolum: 2, oncekiOverview: 'Önceki bölüm özeti' },
    { gosterildiMi: true }
  );
  assert.equal(sonuc.goster, false);
});

// ----------------------------------------------------------------
// 6. S2B1 VAR (sezonlar arası: önceki=S1 final)
// ----------------------------------------------------------------
test('6) Sezon 2 Bölüm 1 + önceki overview varsa → goster: true', () => {
  const sonuc = recapKararVer({
    sezon: 2,
    bolum: 1,
    oncekiOverview: 'Bu sezon 1 final özetidir.'
  }, {});
  assert.equal(sonuc.goster, true);
  assert.equal(sonuc.baslik, 'Önceki Bölüm Özeti');
  assert.ok(sonuc.metin.includes('sezon 1 final'));
});

// ----------------------------------------------------------------
// 7. Girdi mutasyonu yok (input nesnesi bozulmaz)
// ----------------------------------------------------------------
test('7) girdi nesnesi mutasyona uğramaz', () => {
  const girdi = {
    sezon: 1,
    bolum: 2,
    oncekiOverview: 'Test özeti',
    ad: 'Test Dizisi'
  };
  const girdiKopya = { ...girdi };
  recapKararVer(girdi, {});
  assert.deepEqual(girdi, girdiKopya);
});

// ----------------------------------------------------------------
// 8. localStorage entegrasyonu: recapGorulduIsaretle / recapGorulduMu
// ----------------------------------------------------------------
test('8a) recapGorulduIsaretle ve recapGorulduMu çalışır', () => {
  recapGorulduIsaretle(123, 1, 2);
  assert.equal(recapGorulduMu(123, 1, 2), true);
  assert.equal(recapGorulduMu(123, 1, 3), false);
  assert.equal(recapGorulduMu(456, 1, 2), false);
});

test('8b) 200 girdi aşınca eski yarı silinir (MAX_RECAP_ENTRIES)', () => {
  for (let i = 0; i < 210; i++) {
    recapGorulduIsaretle(100, 1, i);
  }
  assert.equal(recapGorulduMu(100, 1, 0), false);
  assert.equal(recapGorulduMu(100, 1, 50), false);
  assert.equal(recapGorulduMu(100, 1, 105), true);
  assert.equal(recapGorulduMu(100, 1, 209), true);
});

// ----------------------------------------------------------------
// 9. recapStorageTemizle çalışır
// ----------------------------------------------------------------
test('9) recapStorageTemizle storageı temizler', () => {
  recapGorulduIsaretle(123, 1, 2);
  assert.equal(recapGorulduMu(123, 1, 2), true);
  recapStorageTemizle();
  assert.equal(recapGorulduMu(123, 1, 2), false);
});

// ----------------------------------------------------------------
// 10. kisaltMetin yardımcı fonksiyonu
// ----------------------------------------------------------------
test('10a) kisaltMetin: kısa metin aynen döner', () => {
  assert.equal(kisaltMetin('Kısa'), 'Kısa');
  assert.equal(kisaltMetin(''), '');
  assert.equal(kisaltMetin(null), '');
  assert.equal(kisaltMetin(undefined), '');
});

test('10b) kisaltMetin: uzun metin kelime sınırında kırpılır', () => {
  const sonuc = kisaltMetin('Bu bir test cümlesidir ve çok uzundur', 20);
  assert.ok(sonuc.length <= 20);
  assert.ok(sonuc.endsWith('…'));
  assert.ok(!sonuc.slice(0, -1).endsWith(' '));
});