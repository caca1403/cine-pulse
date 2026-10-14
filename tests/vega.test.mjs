import test from 'node:test';
import assert from 'node:assert/strict';
import { adaylarSec, bolumAdresi, akislariSec } from '../src/providers/sezon.js';

// Vega (SezonlukDizi havuzu) — kimlik kapısı saf HTTP tarafında doğrulanır;
// oynatıcı çözümü cihazın gizli WebView'ına aittir (cihazda ölçülür).
const ara = (rows) => ({ status: 'success', results: { diziler: { name: 'Diziler', results: rows } } });
const satir = (title, url, imdb = 7) => ({ did: 1, title, url, imdb });

test('arama: yıl kapısı birebir; ±1 dışı ve eşleşmeyen dizi elenir', () => {
  const json = ara([
    satir('Riverdale (2001)', '/diziler/riverdale-2001.html', 5),
    satir('Riverdale (2016)', '/diziler/riverdale.html', 6.8),
    satir('The Riverdale Story (2016)', '/diziler/riverdale-story.html', 3),
  ]);
  const a = adaylarSec(json, ['Riverdale'], 2016);
  assert.equal(a.length, 1);
  assert.equal(a[0].slug, 'riverdale');
});

test('arama: hedef yıl bilinmiyorsa eşleşen tüm adaylar imdb sırasıyla gelir', () => {
  const json = ara([satir('Naruto: Shippuden (2007)', '/diziler/naruto-shippuden.html', 8.6), satir('Boruto: Naruto Next Generations (2017)', '/diziler/boruto-naruto-next-generations.html', 6.7)]);
  const a = adaylarSec(json, ['Naruto Shippuden', 'Naruto'], null);
  assert.ok(a.length >= 1);
  assert.equal(a[0].imdb, 8.6);
});

test('arama: Türkçe başlık varyantı eşleşir, yıl yoksa kapalı geçer', () => {
  const json = ara([satir('La Casa De Papel (2017)', '/diziler/la-casa-de-papel.html', 8.2)]);
  assert.equal(adaylarSec(json, ['House of Money', 'La Casa de Papel'], 2017).length, 1);
  assert.equal(adaylarSec(json, ['La Casa de Papel'], 1999).length, 0);
});

test('bölüm adresi ölçülen kalıbı kurar', () => {
  assert.equal(bolumAdresi('https://site.example', 'riverdale', 2, 7), 'https://site.example/riverdale/2-sezon-7-bolum.html');
});

test('akış seçimi: medya olmayan ve aynı taban URL tekrarları elenir', () => {
  const s = akislariSec([
    { url: 'https://cdn/x/MASTER.m3u8?token=a', headers: { 'User-Agent': 'UA' } },
    { url: 'https://cdn/x/MASTER.m3u8?token=b' },
    { url: 'https://cdn/ad.jpg' },
    { url: 'https://cdn/y/film.mp4' },
  ]);
  assert.equal(s.length, 2);
  assert.equal(s[0].url, 'https://cdn/x/MASTER.m3u8?token=a');
});
