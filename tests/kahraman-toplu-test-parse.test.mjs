import test from 'node:test';
import assert from 'node:assert/strict';
import { sonJsonNesnesi, satirCoz } from '../tools/kahraman-toplu-test.mjs';

/* 2026-11-13 ölçülen hata: toplu test `match(/\{[\s\S]*\}/)` ile İLK `{`yi
   alıyordu; çekirdek loglarındaki süslü parantezler final JSON'u bozuyor ve
   canlı çekirdekler "json-bozuk" görünüyordu. Bu test gerçek çıktı kalıplarını
   birebir kullanır. */

test('zatanna tarzı log satırındaki { } final JSON’u bozmaz', () => {
  const cikti = [
    '[Zatanna] TAMAMLANDI: 1 akış listelendi [ { title: "Zatanna · 1080p" } ]',
    '{',
    ' "cekirdek": "zatanna.js",',
    ' "sureMs": 12345,',
    ' "adet": 3,',
    ' "ornekler": []',
    '}',
  ].join('\n');
  assert.equal(sonJsonNesnesi(cikti).adet, 3);
});

test('spiderMan tarzı { dil: ... } logu final JSON’dan sonra gelse bile doğru nesne', () => {
  const cikti = [
    '[Spider-Man] { dil: \'Altyazılı\' }',
    '[Spider-Man] { dil: \'Dublaj\' }',
    '{',
    ' "adet": 4,',
    ' "sureMs": 9000',
    '}',
  ].join('\n');
  assert.equal(sonJsonNesnesi(cikti).adet, 4);
});

test('iç içe nesne ve metin içi süslü parantez doğru ayrışır', () => {
  const cikti = 'log { not-json }\n{"adet":2,"ornekler":[{"ad":"a{b}","url":"x"}]}';
  const o = sonJsonNesnesi(cikti);
  assert.equal(o.adet, 2);
  assert.equal(o.ornekler[0].ad, 'a{b}');
});

test('JSON yoksa null döner (TIMEOUT/sessiz sınıflandırması için)', () => {
  assert.equal(sonJsonNesnesi('[x] { bozuk: \'log\' }\n[Shazam] Geçersiz akış elendi.'), null);
});

test('satirCoz canlı sonucu okur, timeout’u ayırır', () => {
  const canli = satirCoz({ stdout: 'log { x: 1 }\n{"adet":7,"sureMs":16000}' }, 45);
  assert.deepEqual(canli, { adet: 7, sure: '16sn', hata: '' });
  const zaman = satirCoz({ stdout: '[x] takıldı', error: { code: 'ETIMEDOUT' } }, 45);
  assert.equal(zaman.hata, 'TIMEOUT>45sn');
  const sinyal = satirCoz({ stdout: '', signal: 'SIGTERM' }, 30);
  assert.equal(sinyal.hata, 'TIMEOUT>30sn');
  const bos = satirCoz({ stdout: '[x] son satır' }, 45);
  assert.equal(bos.adet, 0);
  assert.equal(bos.hata, '[x] son satır');
});
