/* Akış sağlığı + durma politikası — çevrimdışı sözleşme testleri.
   DOM yok, ağ yok, Date.now() yok: her şey argüman. */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SAGLIK,
  SAGLIK_ETIKET,
  saglikTuret,
  failoverGerekli,
  ilerlemeDurumu,
  saglikRaporu,
} from '../src/services/oynatici/streamHealth.js';
import {
  VARSAYILAN_ESIK,
  politikaUret,
  esikAl,
  beklemeEsigi,
  politikaGecerli,
} from '../src/services/oynatici/stallPolicy.js';

test('sağlık: hiç istek yoksa IDLE', () => {
  assert.equal(saglikTuret({}), SAGLIK.IDLE);
  assert.equal(saglikTuret({ istendi: false, hata: true }), SAGLIK.IDLE);
});

test('sağlık: istek atıldı ama veri yok → CONNECTING', () => {
  assert.equal(saglikTuret({ istendi: true }), SAGLIK.CONNECTING);
});

test('sağlık: veri geldi ama saat ilerlemiyor → BUFFERING', () => {
  assert.equal(saglikTuret({ istendi: true, veriVar: true }), SAGLIK.BUFFERING);
  assert.equal(saglikTuret({ istendi: true, tamponSn: 3 }), SAGLIK.BUFFERING);
});

test('sağlık: saat ilerlediyse PLAYING (duraklatma hata sayılmaz)', () => {
  assert.equal(saglikTuret({ istendi: true, saatIlerledi: true }), SAGLIK.PLAYING);
  assert.equal(saglikTuret({ istendi: true, saatIlerledi: true, paused: true }), SAGLIK.PLAYING);
});

test('sağlık: ilerleme koptu → STALLED, hata → ERROR, bitiş → ENDED', () => {
  assert.equal(saglikTuret({ istendi: true, saatIlerledi: true, donduruldu: true }), SAGLIK.STALLED);
  assert.equal(saglikTuret({ istendi: true, hata: true }), SAGLIK.ERROR);
  assert.equal(saglikTuret({ istendi: true, hata: true, kurtariliyor: true }), SAGLIK.RECOVERING);
  assert.equal(saglikTuret({ istendi: true, bitti: true }), SAGLIK.ENDED);
});

test('sağlık: öncelik sırası kalıcı (hata > bitti > dondu)', () => {
  assert.equal(saglikTuret({ istendi: true, hata: true, bitti: true }), SAGLIK.ERROR);
  assert.equal(saglikTuret({ istendi: true, bitti: true, donduruldu: true }), SAGLIK.ENDED);
  assert.equal(saglikTuret({ istendi: true, donduruldu: true, veriVar: true }), SAGLIK.STALLED);
});

test('sağlık: failover yalnız STALLED ve ERROR için', () => {
  assert.equal(failoverGerekli(SAGLIK.STALLED), true);
  assert.equal(failoverGerekli(SAGLIK.ERROR), true);
  for (const s of [SAGLIK.IDLE, SAGLIK.CONNECTING, SAGLIK.BUFFERING, SAGLIK.PLAYING,
    SAGLIK.RECOVERING, SAGLIK.ENDED]) {
    assert.equal(failoverGerekli(s), false, `${s} failover tetiklememeli`);
  }
});

test('sağlık: her durumun etiketi var ve kaynak adı taşımıyor', () => {
  for (const d of Object.values(SAGLIK)) {
    assert.ok(SAGLIK_ETIKET[d], `${d} etiketsiz`);
  }
  const rapor = saglikRaporu(SAGLIK.PLAYING, { tamponSn: 4.4, gecikmeMs: 120 });
  assert.match(rapor, /Oynatılıyor/);
  assert.match(rapor, /tampon 4s/);
});

test('ilerleme: durum makinesi deterministik (zaman argümandan gelir)', () => {
  let g = ilerlemeDurumu(null, { ilerledi: true, simdi: 1000, eşikMs: 8000 });
  assert.equal(g.saatIlerledi, true);
  assert.equal(g.sonIlerleme, 1000);

  // 8 sn geçti, ilerleme yok → dondu
  g = ilerlemeDurumu(g, { ilerledi: false, simdi: 9000, eşikMs: 8000 });
  assert.equal(g.donduruldu, true);

  // eşiğin altında → henüz donmadı
  g = ilerlemeDurumu(g, { ilerledi: false, simdi: 9500, eşikMs: 8000 });
  assert.equal(g.donduruldu, true, 'donmuş durum kendini korur');

  // tekrar ilerledi → toparlanır
  g = ilerlemeDurumu(g, { ilerledi: true, simdi: 10000, eşikMs: 8000 });
  assert.equal(g.sonIlerleme, 10000);
});

test('ilerleme: ilk çağrıda ilerleme yoksa stall ilan edilmez', () => {
  const g = ilerlemeDurumu(null, { ilerledi: false, simdi: 500, eşikMs: 100 });
  assert.equal(g.donduruldu, false);
  assert.equal(g.saatIlerledi, false);
});

test('politika: ölçülmüş varsayılanlar korunur', () => {
  const p = politikaUret();
  assert.equal(p.filmMakinesi, 8000);
  assert.equal(p.genel, 15000);
  assert.equal(p.ilkIlerleme, 20000);
  assert.equal(p.hdf, 18000);
  assert.deepEqual({ ...p }, { ...VARSAYILAN_ESIK });
});

test('politika: kaynak sınıfına göre eşik, bilinmeyende genel', () => {
  const p = politikaUret();
  assert.equal(esikAl(p, 'filmmakinesi'), 8000);
  assert.equal(esikAl(p, 'HDFilmizle'), 18000);
  assert.equal(esikAl(p, 'ds'), 15000);
  assert.equal(esikAl(p, 'bilinmeyen-sinif'), 15000);
});

test('politika: ilk ilerleme daha uzun beklenir', () => {
  const p = politikaUret();
  assert.equal(beklemeEsigi(p, 'filmmakinesi', false), 20000);
  assert.equal(beklemeEsigi(p, 'filmmakinesi', true), 8000);
});

test('politika: geçersiz değer reddedilir', () => {
  assert.equal(politikaGecerli(null), true);
  assert.equal(politikaGecerli(politikaUret()), true);
  assert.equal(politikaGecerli({ ...VARSAYILAN_ESIK, genel: 10 }), false, '1 sn altı geçersiz');
  assert.equal(politikaGecerli({ ...VARSAYILAN_ESIK, hdf: NaN }), false);
});

test('politika: özelleştirme varsayılanı bozmaz', () => {
  const ozel = politikaUret({ genel: 9000 });
  assert.equal(ozel.genel, 9000);
  assert.equal(ozel.hdf, 18000, 'verilmeyen alanlar varsayılan kalır');
  assert.equal(politikaUret().genel, 15000, 'genel politika bozulmaz');
});

test('politika: nesne dondurulmuş (kaza ile değiştirilemez)', () => {
  const p = politikaUret();
  assert.throws(() => { 'use strict'; p.genel = 1; });
});