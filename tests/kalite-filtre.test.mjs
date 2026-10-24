/* Kalite filtresi — saf modül testleri.
   Kullanıcı olayı: oynatıcıda kalite seçimi yok (parite #11). Dürüst çözüm
   filtre+sıralama; sahte kalite-switch YASAK. Bu testler modülün dürüst
   tespitini, "en az bu kalite" filtreağını, sayaçları ve bozuk girdi
   toleransını sabitler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  kaliteSeviye,
  kaliteUyar,
  kaliteFiltrele,
  normalizeKaliteTercihi
} from '../src/services/icerik/kaliteFiltre.js';

const K = [
  { id: 'a', displayName: 'Atlas 4K' },
  { id: 'b', displayName: 'Atlas 1080p' },
  { id: 'c', displayName: 'Nexus 720p' },
  { id: 'd', displayName: 'Bilinmeyen Hat' } // etiket yok → 'diger'
];

test('etiketsiz kaynak "diger" sayılır, kaliteli filtreye girmez ama korunur', () => {
  assert.equal(kaliteSeviye(K[3]), 'diger');
  assert.equal(kaliteUyar(K[3], 'hepsi'), true);
  assert.equal(kaliteUyar(K[3], '720'), false); // 'diger' 720+ değildir
});

test('4k > 1080 > 720 kalite sırası (hepsi filtresi)', () => {
  const { kaynaklar } = kaliteFiltrele([K[2], K[3], K[0], K[1]], 'hepsi');
  assert.deepEqual(kaynaklar.map(s => s.id), ['a', 'b', 'c', 'd']);
});

test('filtre "1080" = 1080p+ (1080 ve 4k; 720/diger elenir)', () => {
  const { kaynaklar, bosMu } = kaliteFiltrele(K, '1080');
  assert.equal(bosMu, false);
  assert.deepEqual(kaynaklar.map(s => s.id), ['a', 'b']);
});

test('boş sonuç işareti: filtre 0 kaynak → bosMu true, liste boş', () => {
  const sadeceDusuk = [{ id: 'x', displayName: '720p' }];
  const { kaynaklar, bosMu } = kaliteFiltrele(sadeceDusuk, '4k');
  assert.equal(bosMu, true);
  assert.equal(kaynaklar.length, 0);
});

test('normalize: eski "1080p" string\'i ve diğer tercih biçimleri', () => {
  assert.equal(normalizeKaliteTercihi('1080p'), '1080');
  assert.equal(normalizeKaliteTercihi('720p'), '720');
  assert.equal(normalizeKaliteTercihi('2160p'), '4k');
  assert.equal(normalizeKaliteTercihi('4k'), '4k');
  assert.equal(normalizeKaliteTercihi('auto'), 'hepsi');
  assert.equal(normalizeKaliteTercihi('bozuk-deger'), 'hepsi');
});

test('sayaçlar tüm girdinin seviyelerini sayar', () => {
  const { sayimlar } = kaliteFiltrele(K, 'hepsi');
  assert.deepEqual(sayimlar, { '4k': 1, '1080': 1, '720': 1, 'diger': 1 });
});

test('bozuk girdi toleransı: null/non-array ve null kaynaklar çökmez', () => {
  const { kaynaklar, sayimlar } = kaliteFiltrele(null, 'hepsi');
  assert.deepEqual(kaynaklar, []);
  assert.deepEqual(sayimlar, { '4k': 0, '1080': 0, '720': 0, 'diger': 0 });
  const karmas = kaliteFiltrele([null, undefined, 42, K[0]], 'hepsi');
  assert.equal(karmas.kaynaklar.some(s => s && s.id === 'a'), true);
  assert.equal(karmas.sayimlar.diger, 3); // bozuk + etiketsiz girişler 'diger'
});

test('tercih yuvarlaması: "720" → "720+" filtresi 480p kaynak İÇERMEZ', () => {
  assert.equal(normalizeKaliteTercihi('720'), '720');
  const kaynaklar = [
    { id: 'yuksek', displayName: '1080p' },
    { id: 'dusuk', displayName: '480p' }
  ];
  const { kaynaklar: sonuc } = kaliteFiltrele(kaynaklar, null, '720'); // tercihten türet
  assert.deepEqual(sonuc.map(s => s.id), ['yuksek']); // 480p "720p+"a girmez
});

test('tercih parametresi filtre yoksa/gçersizse kullanılır', () => {
  const { kaynaklar } = kaliteFiltrele(K, undefined, '4k');
  assert.deepEqual(kaynaklar.map(s => s.id), ['a']);
});
