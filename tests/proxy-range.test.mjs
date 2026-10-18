/* Proxy Range paritesi — saf aralık matematiği testleri.
   Kural: iki uç (masaüstü sidecar + Vercel) aynı yanıtı vermeli:
   geçerli aralık → 206 + Content-Range, geçersiz → 416, aralık yok → 200. */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  aralikAyikla,
  aralikCoz,
  rangeHeaderlari,
  gecerliRangeHeader,
} from '../src/services/oynatici/range.js';

test('range: ayrıştırma temel biçimleri', () => {
  assert.deepEqual(aralikAyikla('bytes=0-999'), { baslangic: 0, bitis: 999, sondan: false });
  assert.deepEqual(aralikAyikla('bytes=500-'), { baslangic: 500, bitis: null, sondan: false });
  assert.deepEqual(aralikAyikla('bytes=-500'), { baslangic: null, bitis: 500, sondan: true });
  assert.equal(aralikAyikla('items=0-10'), null);
  assert.equal(aralikAyikla('bytes=-'), null);
  assert.equal(aralikAyikla(''), null);
  assert.equal(aralikAyikla(null), null);
});

test('range: baştan sona aralık → 206 + Content-Range', () => {
  const r = aralikCoz('bytes=0-999', 10000);
  assert.equal(r.gecerli, true);
  assert.equal(r.durum, 206);
  assert.equal(r.contentRange, 'bytes 0-999/10000');
  assert.equal(r.uzunluk, 1000);
});

test('range: açık uçlu aralık toplamla tamamlanır', () => {
  const r = aralikCoz('bytes=9000-', 10000);
  assert.equal(r.durum, 206);
  assert.equal(r.contentRange, 'bytes 9000-9999/10000');
  assert.equal(r.uzunluk, 1000);
});

test('range: sondan aralık son bayta kadar kırpılır', () => {
  const r = aralikCoz('bytes=-500', 10000);
  assert.equal(r.durum, 206);
  assert.equal(r.contentRange, 'bytes 9500-9999/10000');
  assert.equal(r.uzunluk, 500);
});

test('range: toplam bilinmiyorsa kesin uzunluk uydurulmaz', () => {
  const r = aralikCoz('bytes=0-999', null);
  assert.equal(r.durum, 206);
  assert.equal(r.contentRange, 'bytes 0-999/*');
  assert.equal(r.uzunluk, 1000);
});

test('range: aralık toplamı aşıyorsa kırpılır', () => {
  const r = aralikCoz('bytes=0-99999', 10000);
  assert.equal(r.contentRange, 'bytes 0-9999/10000');
  assert.equal(r.uzunluk, 10000);
});

test('range: başlangıç toplamın dışındaysa 416', () => {
  const r = aralikCoz('bytes=10000-10999', 10000);
  assert.equal(r.gecerli, false);
  assert.equal(r.durum, 416);
  assert.equal(r.contentRange, 'bytes */10000');
});

test('range: bitiş başlangıçtan küçükse 416', () => {
  const r = aralikCoz('bytes=500-100', 10000);
  assert.equal(r.durum, 416);
});

test('range: bozuk başlık 416 verir (200 değil)', () => {
  const r = aralikCoz('bytes=abc-def', 10000);
  assert.equal(r.gecerli, false);
  assert.equal(r.durum, 416);
});

test('range: başlık üretimi her zaman Accept-Ranges taşır', () => {
  for (const [h, t] of [['bytes=0-1', 10], ['bytes=-1', 10], ['bozuk', 10]]) {
    const c = rangeHeaderlari({ istekRange: h, toplam: t });
    assert.equal(c.basliklar['Accept-Ranges'], 'bytes');
    assert.ok(c.basliklar['Access-Control-Expose-Headers'].includes('Content-Range'));
  }
});

test('range: 206 yanıtında Content-Length ve Content-Range birlikte', () => {
  const c = rangeHeaderlari({ istekRange: 'bytes=0-999', toplam: 10000 });
  assert.equal(c.durum, 206);
  assert.equal(c.basliklar['Content-Length'], '1000');
  assert.equal(c.basliklar['Content-Range'], 'bytes 0-999/10000');
});

test('range: yukarı akış 206 döndüyse onun Content-Range değeri korunur', () => {
  const c = rangeHeaderlari({
    istekRange: 'bytes=0-999',
    toplam: 10000,
    yukarıAkisContentRange: 'bytes 0-1023/10000',
    yukarıAkisDurum: 206,
  });
  assert.equal(c.basliklar['Content-Range'], 'bytes 0-1023/10000');
});

test('range: yukarı akış başlığı üretmezse kendi hesabımız kullanılır', () => {
  const c = rangeHeaderlari({ istekRange: 'bytes=0-999', toplam: 10000 });
  assert.equal(c.basliklar['Content-Range'], 'bytes 0-999/10000');
});

test('range: yukarı akışa yalnız geçerli başlık taşınır', () => {
  assert.equal(gecerliRangeHeader('bytes=0-10'), 'bytes=0-10');
  assert.equal(gecerliRangeHeader('Range: bytes=0-10'), null);
  assert.equal(gecerliRangeHeader(undefined), null);
});

test('range: iki uç aynı girdide aynı yanıtı üretir (parite)', () => {
  const girdiler = ['bytes=0-999', 'bytes=500-', 'bytes=-100', 'bytes=99999-100000', 'bozuk', null];
  for (const g of girdiler) {
    const a = rangeHeaderlari({ istekRange: g, toplam: 50000 });
    const b = rangeHeaderlari({ istekRange: g, toplam: 50000 });
    assert.deepEqual(a, b, `parite bozuldu: ${g}`);
  }
});