/* Tür eşleme testleri.
   NEDEN VAR (ölçülen hata, 2026-10-16): uygulama anime açılışında `tur:'anime'`
   gönderiyordu; kayıt tablosunda 'anime' türü olmadığı için sağlayıcı listesi
   BOŞ dönüyor, tarama hiç başlamadan "kaynak bulunamadı" yazıyordu (kullanıcı:
   "sanki hiç taramıyor gibi"). Ayrıca anime başlık logoları proxy yolundan
   geçirilince Android ağ geçidi 501 verdiği için HİÇ gelmiyordu. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { turDestekler, kayitlar, KAYIT } from '../src/providers/kayit.js';
import { KAHRA_MAN_TURLERI } from '../src/services/kaynak/providerAggregator.js';

test('toplayıcı kapısı anime/çizgi film türlerini geçirir', () => {
  // ÖLÇÜLEN HATA: kapı yalnız movie/tv/series tanıyınca anime taraması HİÇ
  // başlamadan boş dönüyordu ("sanki hiç taramıyor gibi").
  for (const t of ['anime', 'cizgifilm', 'cartoon', 'animation', 'kids']) {
    assert.ok(KAHRA_MAN_TURLERI.has(t), `${t} toplayıcı kapısında yok`);
  }
  assert.ok(KAHRA_MAN_TURLERI.has('tv'));
  assert.ok(KAHRA_MAN_TURLERI.has('movie'));
});

test('anime türü dizi havuzunu kapsar', () => {
  assert.equal(turDestekler({ turler: ['tv'] }, 'anime'), true);
  assert.equal(turDestekler({ turler: ['tv', 'anime'] }, 'anime'), true);
  assert.equal(turDestekler({ turler: ['movie'] }, 'anime'), false, 'yalnız film kaydı animeye girmemeli');
  assert.equal(turDestekler({ turler: [] }, 'anime'), false);
});

test('series/cizgi film eşlemeleri korunur', () => {
  assert.equal(turDestekler({ turler: ['tv'] }, 'series'), true);
  assert.equal(turDestekler({ turler: ['tv'] }, 'cizgifilm'), true);
  assert.equal(turDestekler({ turler: ['movie'] }, 'cartoon'), true);
  assert.equal(turDestekler({ turler: ['tv'] }, 'movie'), false);
});

test('anime taraması boş dönmez: animeye özel çekirdekler listede', () => {
  const liste = kayitlar('anime').map(([ad]) => ad);
  assert.ok(liste.length > 10, `anime listesi çok kısa: ${liste.length}`);
  for (const beklenen of ['Nightwing', 'Supergirl', 'Poison-Ivy', 'Moon-Knight']) {
    assert.ok(liste.includes(beklenen), `${beklenen} anime listesinde yok`);
  }
});

test('anime etiketli çekirdekler turlerinde anime taşır', () => {
  for (const ad of ['Nightwing', 'Supergirl', 'Poison-Ivy', 'Moon-Knight', 'Harley-Quinn']) {
    const k = KAYIT.get(ad);
    assert.ok(k, `${ad} kaydı yok`);
    assert.ok(k.turler.includes('anime'), `${ad} turlerinde 'anime' yok`);
  }
});
