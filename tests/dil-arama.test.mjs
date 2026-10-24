import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseDilArama } from '../src/services/kesif/dilArama.js';

test('dilArama: null / boş / sadece boşluk sorguları null döner', () => {
  assert.strictEqual(parseDilArama(null), null);
  assert.strictEqual(parseDilArama(undefined), null);
  assert.strictEqual(parseDilArama(''), null);
  assert.strictEqual(parseDilArama('   '), null);
});

test('dilArama: anahtar kelime yoksa null (mevcut arama akışına dokunulmaz)', () => {
  assert.strictEqual(parseDilArama('merhaba nasılsın'), null);
  assert.strictEqual(parseDilArama('matrix'), null);
  assert.strictEqual(parseDilArama('dizi'), null);   // sadece tür, tür/yıl yok
  assert.strictEqual(parseDilArama('film'), null);
});

test('dilArama: tam cümle — türler + yılMin + sorguKalan', () => {
  const r = parseDilArama('kız arkadaşımla izleyecek keyifli romantik komedi 2020 sonrası');
  assert.ok(r, 'tanınan anahtar varsa null olamaz');
  assert.strictEqual(r.tur, null);
  assert.deepStrictEqual(r.turler, [10749, 35]);
  assert.strictEqual(r.yilMin, 2020);
  assert.strictEqual(r.yilMaks, undefined);
  assert.deepStrictEqual(r.onayEtiketleri, ['Romantik', 'Komedi']);
  assert.ok(r.sorguKalan.includes('kiz arkadasimla izleyecek keyifli'));
  assert.ok(!r.sorguKalan.includes('romantik'));
  assert.ok(!r.sorguKalan.includes('komedi'));
  assert.ok(!r.sorguKalan.includes('2020'));
});

test('dilArama: çoklu tür (aşk + komedi)', () => {
  const r = parseDilArama('aşk Komedi');
  assert.deepStrictEqual(r.turler, [10749, 35]);
  assert.deepStrictEqual(r.onayEtiketleri, ['Romantik', 'Komedi']);
});

test('dilArama: büyük/küçük harf ve türkçe karakterler ayrım yapmaz', () => {
  const a = parseDilArama('aşk Komedi');
  const b = parseDilArama('ASK KOMEDI');
  const c = parseDilArama('aŞk koMEdi');
  assert.deepStrictEqual(a.turler, b.turler);
  assert.deepStrictEqual(a.turler, c.turler);
  assert.deepStrictEqual(a.onayEtiketleri, c.onayEtiketleri);
});

test('dilArama: yıl aralığı (sonra / önce)', () => {
  const r = parseDilArama('gerilim film 2019 öncesi');
  assert.strictEqual(r.tur, 'film');
  assert.deepStrictEqual(r.turler, [53]);
  assert.strictEqual(r.yilMaks, 2019);

  const r2 = parseDilArama('2020 sonrası ve 2015 öncesi');
  assert.ok(r2);
  assert.strictEqual(r2.yilMin, 2020);
  assert.strictEqual(r2.yilMaks, 2015);
});

test("dilArama: dizi tespiti ve dizi tür id'leri (repo haritası)", () => {
  const r = parseDilArama('korku dizi');
  assert.strictEqual(r.tur, 'dizi');
  assert.deepStrictEqual(r.turler, [27]);

  const r2 = parseDilArama('aile dizi');
  assert.strictEqual(r2.tur, 'dizi');
  assert.deepStrictEqual(r2.turler, [10751]);
});

test('dilArama: bilim kurgu, belgesel ve gereksiz kelime temizliği', () => {
  assert.deepStrictEqual(parseDilArama('bilim kurgu 2010 sonrası').turler, [878]);
  assert.deepStrictEqual(parseDilArama('BİLİM KURGU').turler, [878]);
  assert.deepStrictEqual(parseDilArama('belgesel').turler, [99]);

  const r = parseDilArama('bugün akşam kız arkadaşımla izleyecek keyifli romantik komedi');
  assert.ok(r.sorguKalan.includes('bugun aksam kiz arkadasimla izleyecek keyifli'));
  assert.ok(!r.sorguKalan.includes('romantik'));
});
