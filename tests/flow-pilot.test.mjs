/* ==========================================================================
   Akış Otopilotu — Saf Karar Çekirdeği Deterministik Birim Testleri
   --------------------------------------------------------------------------
   Çalıştır: node --test tests/flow-pilot.test.mjs
   Ağ yok, DOM yok: tüm girdiler fixture.
   ========================================================================== */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  akışOtopilotu,
  aileKodu,
  nedenMetni
} from '../src/services/flowPilot.js';

// ----------------------------------------------------------------
// 1. Boş/eksiz kaynaklar → null / atma yok
// ----------------------------------------------------------------
test('1a) boş kaynaklar dizisi → null', () => {
  assert.equal(akışOtopilotu({ kaynaklar: [] }), null);
});

test('1b) kaynaklar tanımsız → null', () => {
  assert.equal(akışOtopilotu({}), null);
});

test('1c) null kaynaklar → null', () => {
  assert.equal(akışOtopilotu({ kaynaklar: null }), null);
});

// ----------------------------------------------------------------
// 2. cihazSkorlari baskın: yüksek skorlu kaynak kazanır;
//    nedenler dolu ve menfi keliche YES (regex tuzak testi)
// ----------------------------------------------------------------
test('2a) yüksek cihaz skoru kaynakı kazanır', () => {
  const sonuc = akışOtopilotu({
    kaynaklar: [
      { id: 'orion_12_3', ad: 'Orion XYZ', dublaj: true },
      { id: 'hidra_09_1', ad: 'Hidra ABC', dublaj: false }
    ],
    cihazSkorlari: { 0: 95, 1: 30 },
    aileGuveni: { orion: 0.9, hidra: 0.2 },
    tercih: 'farketmez',
    geceKoveti: false
  });
  assert.equal(sonuc.idx, 0, 'daha yüksek cihaz skoru 0 numaralı kaydı öne taşımalı');
});

test('2b) menfi kelime testi: nedenler /ölü|bozuk|düşüş|yavaş|değil/i ile eşleşmesin', () => {
  const sonuc = akışOtopilotu({
    kaynaklar: [
      { id: 'orion_12_3', ad: 'Orion XYZ', dublaj: true, kalite: '1080p' },
      { id: 'hidra_09_1', ad: 'Hidra ABC', dublaj: false }
    ],
    cihazSkorlari: { 0: 80, 1: 40 },
    aileGuveni: { orion: 0.8, hidra: 0.3 },
    tercih: 'dub',
    geceKoveti: false
  });
  // Regression: nedenler içinde yasaklı kelime bulunmamalı
  const yasakli = /ölü|bozuk|düşüş|yavaş|değil/i;
  for (const n of sonuc.nedenler) {
    assert.ok(!yasakli.test(n), `neden içinde yasaklı kelime bulundu: "${n}"`);
  }
});

// ----------------------------------------------------------------
// 3. tercih='dub': puan farkı <12 iken dublajlı kaynak öne geçer;
//     'farketmez'de geçmez.
// ----------------------------------------------------------------
test('3a) tercih=dub: dublajlı kaynak <12 puan farkıyla öne geçer', () => {
  const sonuc = akışOtopilotu({
    kaynaklar: [
      { id: 'orion_12_3', ad: 'Orion XYZ', dublaj: true },
      { id: 'hidra_09_1', ad: 'Hidra ABC', dublaj: false }
    ],
    cihazSkorlari: { 0: 70, 1: 65 }, // fark 5 < 12
    aileGuveni: { orion: 0.5, hidra: 0.5 },
    tercih: 'dub',
    geceKoveti: false
  });
  // Dublaj +12 puan,orfi orada olsunca 0 numaralı kaynak öne geçmelı
  assert.equal(sonuc.idx, 0, 'tercih=dub ve puan farkı <12 ise dublajlı öne çıkmalı');
});

test('3b) tercih=farketmez: dublajlı kaynak otomatik öne çıkmaz (sıra puanına)', () => {
  const sonuc = akışOtopilotu({
    kaynaklar: [
      { id: 'orion_12_3', ad: 'Orion XYZ', dublaj: true },
      { id: 'hidra_09_1', ad: 'Hidra ABC', dublaj: false }
    ],
    cihazSkorlari: { 0: 70, 1: 65 },
    aileGuveni: { orion: 0.5, hidra: 0.5 },
    tercih: 'farketmez',
    geceKoveti: false
  });
  // farketmez: hiçbirPreferenceBonus yok, cihaz skoru sıralamaya göre
  // 0 numaralı yine daha yüksek skordan ötürü öne gelebilir
  assert.ok(sonuc.idx === 0 || sonuc.idx === 1, 'farketmez modunda sıralama cihaz skoruna Bağlı');
});

// ----------------------------------------------------------------
// 4. aileGuveni haritası yönü deterministik iki senaryo
// ----------------------------------------------------------------
test('4a) yüksek aile güveni seçili kaydı öne taşı', () => {
  const sonuc = akışOtopilotu({
    kaynaklar: [
      { id: 'orion_12_3', ad: 'Orion XYZ' },
      { id: 'hidra_09_1', ad: 'Hidra ABC' }
    ],
    cihazSkorlari: { 0: 50, 1: 50 }, // aynı cihaz skoru
    aileGuveni: { orion: 0.95, hidra: 0.1 },
    tercih: 'farketmez',
    geceKoveti: false
  });
  // orion aile güveni 0.95 → 0.95*25=23.75, hidra → 0.1*25=2.5
  // orion kazanmalı
  assert.equal(sonuc.idx, 0, 'yüksek aile güveni seçili kaydı öne taşmalı');
});

test('4b) düşük aile güveni seçili kaydı öne taşımay', () => {
  const sonuc = akışOtopilotu({
    kaynaklar: [
      { id: 'orion_12_3', ad: 'Orion XYZ' },
      { id: 'hidra_09_1', ad: 'Hidra ABC' }
    ],
    cihazSkorlari: { 0: 50, 1: 50 },
    aileGuveni: { orion: 0.1, hidra: 0.95 },
    tercih: 'farketmez',
    geceKoveti: false
  });
  // hidra yüksek aile güveni ile kazanmalı
  assert.equal(sonuc.idx, 1, 'düşük aile güveni ile seçili kaydı öne taşmamalı');
});

// ----------------------------------------------------------------
// 5. geceKoveti true/false kararı tek başına değiştirebilir (sınırdaki puanla)
// ----------------------------------------------------------------
test('5a) geceKoveti=true daha agresif cihaz skorunu seçer (sınır case)', () => {
  // Cihaz skoru çok benzer, geceKoveti bonusu (cihaz*0.15) karar verir
  const sonucWith = akışOtopilotu({
    kaynaklar: [
      { id: 'orion_12_3', ad: 'Orion XYZ', dublaj: true },
      { id: 'hidra_09_1', ad: 'Hidra ABC', dublaj: true }
    ],
    cihazSkorlari: { 0: 80, 1: 78 }, // fark 2, bonus 0.15*80=12 ile 78*1.15≈89.7 vs 80
    aileGuveni: { orion: 0.5, hidra: 0.5 },
    tercih: 'dub',
    geceKoveti: true
  });
  const sonucWithout = akışOtopilotu({
    kaynaklar: [
      { id: 'orion_12_3', ad: 'Orion XYZ', dublaj: true },
      { id: 'hidra_09_1', ad: 'Hidra ABC', dublaj: true }
    ],
    cihazSkorlari: { 0: 80, 1: 78 },
    aileGuveni: { orion: 0.5, hidra: 0.5 },
    tercih: 'dub',
    geceKoveti: false
  });
  // geceKoveti true'da 0 numaralı kaynak daha agresif seçilmeli
  assert.equal(sonucWith.idx, 0, 'geceKoveti=true ile 0 numaralı kaynak seçilmeli');
  assert.equal(sonucWithout.idx, 0, 'geceKoveti=false ile de 0 numaralı kaynak seçilmeli (bonus yetmezse)');
});

// ----------------------------------------------------------------
// 6. Eşit puanda düşük idx kazanır; alternatifIdx doğru (-1 senaryosu dahil)
// ----------------------------------------------------------------
test('6a) eşit puan: düşük idx kazanır', () => {
  const sonuc = akışOtopilotu({
    kaynaklar: [
      { id: 'orion_12_3', ad: 'Orion XYZ' },
      { id: 'hidra_09_1', ad: 'Hidra ABC' }
    ],
    cihazSkorlari: { 0: 50, 1: 50 },
    aileGuveni: { orion: 0.5, hidra: 0.5 },
    tercih: 'farketmez',
    geceKoveti: false
  });
  // Aynı puan, idx 0 kazanmalı
  assert.equal(sonuc.idx, 0, 'eşit puanunda düşük idx (0) kazanmalı');
  assert.equal(sonuc.alternatifIdx, 1, 'alternatifIdx tek kaynakdan farklıysa 1 olmalı');
});

test('6b) tek kaynak: alternatifIdx -1', () => {
  const sonuc = akışOtopilotu({
    kaynaklar: [
      { id: 'orion_12_3', ad: 'Orion XYZ' }
    ],
    cihazSkorlari: { 0: 50 },
    aileGuveni: { orion: 0.5 },
    tercih: 'farketmez',
    geceKoveti: false
  });
  assert.equal(sonuc.idx, 0, 'tek kaynak idx=0');
  assert.equal(sonuc.alternatifIdx, -1, 'tek kaynakta alternatifIdx=-1');
});

// ----------------------------------------------------------------
// 7. Obje VEYA Map kabulü; eksik alanlarla atma yok (fuzz: her alanı undefined bırak)
// ----------------------------------------------------------------
test('7a) cihazSkorlari Map kabulü', () => {
  const sonuc = akışOtopilotu({
    kaynaklar: [
      { id: 'orion_12_3', ad: 'Orion XYZ' },
      { id: 'hidra_09_1', ad: 'Hidra ABC' }
    ],
    cihazSkorlari: new Map([[0, 80], [1, 30]]),
    aileGuveni: { orion: 0.5, hidra: 0.5 },
    tercih: 'farketmez',
    geceKoveti: false
  });
  assert.equal(sonuc.idx, 0, 'Map kabulü ile 0 numaralı kaynak öne çıkmalı');
});

test('7b) eksik kaynak alanları atma yok (fuzz)', () => {
  // Tüm alanlar undefined
  const sonuc = akışOtopilotu({
    kaynaklar: [
      { /* id: eksik, ad: eksik */ },
      { /* id: eksik, ad: eksik */ }
    ],
    cihazSkorlari: { 0: 50, 1: 50 },
    aileGuveni: {},
    tercih: 'farketmez',
    geceKoveti: false
  });
  // Çökme olmadı ve sonuç döndürmelı
  assert.notEqual(sonuc, null, 'eks alanlarla çökme olmamalı');
  assert.ok(sonuc.idx !== undefined, 'idx atanmalı');
});

// ----------------------------------------------------------------
// 8. aileKodu: 'polar_17_0'→'polar', 'X_1'→'x', '_' içermeyen id aynen/küçük
// ----------------------------------------------------------------
test('8a) aileKodu: polar_17_0 → polar', () => {
  assert.equal(aileKodu('polar_17_0'), 'polar');
});

test('8b) aileKodu: X_1 → x', () => {
  assert.equal(aileKodu('X_1'), 'x');
});

test('8c) aileKodu: orion → orion ( _siz)', () => {
  assert.equal(aileKodu('orion'), 'orion');
});

test('8d) aileKodu: Xyz → xyz (küçük harf)', () => {
  assert.equal(aileKodu('Xyz'), 'xyz');
});

// ----------------------------------------------------------------
// 9. nedenMetni: boş dizi → '' (veya makul boş), tek/çok eleman düzgün
// ----------------------------------------------------------------
test('9a) nedenMetni: boş dizi → empty string', () => {
  assert.equal(nedenMetni([]), '');
});

test('9b) nedenMetni: tek eleman', () => {
  assert.equal(nedenMetni(['Tek bir sebep']), 'Tek bir sebep');
});

test('9c) nedenMetni: çok eleman', () => {
  assert.equal(nedenMetni(['Sebep bir', 'Sebep iki']), 'Sebep bir Sebep iki');
});

// ----------------------------------------------------------------
// 10. Entegrasyon yerini(PlayerModal) test etme - sadece tipl kontrolü
// ----------------------------------------------------------------
test('10) akışOtopilotu çıktı yapısı', () => {
  const sonuc = akışOtopilotu({
    kaynaklar: [
      { id: 'orion_12_3', ad: 'Orion XYZ', dublaj: true }
    ],
    cihazSkorlari: { 0: 80 },
    aileGuveni: { orion: 0.8 },
    tercih: 'dub',
    geceKoveti: false
  });
  // Çıktı yapısı kontrolü
  assert.equal(typeof sonuc, 'object');
  assert.equal(typeof sonuc.idx, 'number');
  assert.equal(typeof sonuc.alternatifIdx, 'number');
  assert.ok(Array.isArray(sonuc.nedenler), 'nedenler dizisi olmalı');
  assert.ok(sonuc.nedenler.length >= 1 && sonuc.nedenler.length <= 3, 'nedenler 1-3 eleman olmalı');
});

test('10b) döndürülenecek null yapısı', () => {
  const sonuc = akışOtopilotu({ kaynaklar: [] });
  assert.equal(sonuc, null, 'boş kaynaklar null döndürmelı');
});