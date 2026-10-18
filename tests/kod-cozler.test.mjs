/* Darkseid çözümleyicileri (kodCozler.js) — şema aritmetiğinin gidiş-dönüş kanıtı.
   Her şema için KODLAYICI testte türetilir (çözücünün tersi); sahte m3u8 adresi
   sarılır, çözücü aynı adresi geri vermeli. Ayrıca eski sürümün bilinen vakaları. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { sifreCoz, paketCoz, b64Kaydir, beCoz, dnCoz } from '../src/providers/kodCozler.js';

const harfKaydir = (metin, shift) => metin.replace(/[a-zA-Z]/g, c => {
  const code = c.charCodeAt(0);
  const base = code <= 90 ? 65 : 97;
  return String.fromCharCode(((code - base + shift) % 26 + 26) % 26 + base);
});
const tersle = s => s.split('').reverse().join('');
const b64Kodla = s => Buffer.from(s, 'latin1').toString('base64');

/* ---- Be şeması sarmalayıcı (çözücünün birebir tersi) ---- */
function beSar(duzmetin, anahtar, ops) {
  let v1 = 0, v2 = 0;
  for (let i = 0; i < anahtar.length; i++) {
    const code = anahtar.charCodeAt(i);
    v1 = (v1 * 37 + code) % 241;
    v2 = (v2 + ((code << 1) ^ i)) & 255;
  }
  const v3 = (v1 * 3 + v2) % 256;
  const v4 = (v2 % 11) + 5;
  let v5 = ((v2 * 251 + v1) % 65519) + 1;

  let curr = v3, karisik = '';
  for (const ch of duzmetin) {
    const cc = ch.charCodeAt(0);
    curr = (curr * 5 + v4) % 256;
    const sifre = cc ^ curr;
    karisik += String.fromCharCode(sifre);
    curr = (curr + sifre) % 256; // akış ŞİFRE metin karakteriyle ilerler (çözücü gibi)
  }
  const L = karisik.length;
  const arrMap = [];
  for (let i = L - 1; i >= 1; i--) { v5 = (v5 * 97 + 41) % 65519; arrMap[i] = v5 % (i + 1); }
  const chars = karisik.split('');
  for (let i = L - 1; i >= 1; i--) { const s = arrMap[i]; const t = chars[i]; chars[i] = chars[s]; chars[s] = t; }
  let metin = chars.join('');
  for (const ch of ops) {
    if (ch === '7') metin = b64Kodla(metin);
    else if (ch === '3') metin = tersle(metin);
    else metin = harfKaydir(metin, (ch.charCodeAt(0) - 96) % 26);
  }
  // 13 parçalı dizi: rem2=11 → idx1=4 (anahtar), idx2=9 (ops); kalan 11 slot metin parçaları
  const dizi = new Array(13).fill('');
  const slotlar = [...Array(13).keys()].filter(i => i !== 4 && i !== 9);
  const parcakBoy = Math.ceil(metin.length / slotlar.length);
  slotlar.forEach((slot, j) => { dizi[slot] = metin.slice(j * parcakBoy, (j + 1) * parcakBoy); });
  dizi[4] = anahtar;
  dizi[9] = ops;
  return dizi;
}

/* ---- dn şeması sarmalayıcı ---- */
function dnSar(duzmetin, keyStr, ops) {
  let v1 = 0, v2 = 0;
  for (let i = 0; i < keyStr.length; i++) {
    const cc = keyStr.charCodeAt(i);
    v1 = (v1 * 31 + cc) % 251;
    v2 = (v2 ^ (cc + i)) & 255;
  }
  const v3 = (v1 + v2) % 256;
  const v4 = (v1 % 13) + 3;
  let v5 = ((v1 * 256 + v2) % 65521) + 1;

  let curr = v3, karisik = '';
  for (const ch of duzmetin) {
    const cc = ch.charCodeAt(0);
    curr = (curr + v4) % 256;
    const sifre = cc ^ curr;
    karisik += String.fromCharCode(sifre);
    curr = (curr + sifre) % 256; // akış ŞİFRE metin karakteriyle ilerler (çözücü gibi)
  }
  const L = karisik.length;
  const arrMap = [];
  for (let i = L - 1; i >= 1; i--) { v5 = (v5 * 75 + 74) % 65537; arrMap[i] = v5 % (i + 1); }
  const chars = karisik.split('');
  for (let i = L - 1; i >= 1; i--) { const s = arrMap[i]; const t = chars[i]; chars[i] = chars[s]; chars[s] = t; }
  let metin = chars.join('');
  for (const ch of ops) {
    if (ch === 'b') metin = b64Kodla(metin);
    else if (ch === 'v') metin = tersle(metin);
    else metin = harfKaydir(metin, (ch.charCodeAt(0) - 64) % 26);
  }
  const parcalar = [];
  const adim = Math.max(8, Math.ceil(metin.length / 4));
  for (let i = 0; i < metin.length; i += adim) parcalar.push(metin.slice(i, i + adim));
  const diziLit = `[${parcalar.map(p => JSON.stringify(p)).join(',')}]`;
  return `var _0x1 = fn(${diziLit});\nvar keyv = "${keyStr}";\nvar opsv = "${ops}";`;
}

/* ================= bilinen vakalar (eski sürüm testlerinden) ================= */

test('b64Kaydir bilinen vektörler', () => {
  assert.equal(b64Kaydir('aHR0cHM6Ly9vci5jb20vbWFzdGVyLm0zdTg='), 'https://or.com/master.m3u8');
  assert.equal(b64Kaydir('QUJDRA'), 'ABCD');
  assert.equal(b64Kaydir('aGVsbG8td29ybGQ_'), 'hello-world?'); // sondaki _ bir bayt daha üretir (bilinen davranış)
  assert.equal(b64Kaydir(''), '');
});

test('paketCoz paket açar', () => {
  const packed = `eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c])}}return p}('0:"1"',2,2,'file|https://a.b/master.m3u8'.split('|'),0,{}))`;
  assert.match(paketCoz(packed) || '', /master\.m3u8/);
});

test('sifreCoz düz m3u8 ve master.txt dönüşümü', () => {
  assert.equal(sifreCoz('<script>var x="https://cdn.example.com/hls/master.m3u8";</script>'), 'https://cdn.example.com/hls/master.m3u8');
  assert.equal(sifreCoz('<script>var x="https://cdn.example.com/txt/master.txt";</script>'), 'https://cdn.example.com/master.m3u8');
  assert.equal(sifreCoz('<script>var x="https://playmix.uno/master.m3u8";</script>'), null);
  assert.equal(sifreCoz(''), null);
});

/* ================= gidiş-dönüş (round-trip) şema kanıtları ================= */

test('Be şeması gidiş-dönüş: sifreCoz sources:[{file:V}] yolundan adresi geri verir', () => {
  const hedef = 'https://cdn.ornek.net/hls/master.m3u8';
  const dizi = beSar(hedef, 'K7x9qW2zL5mN8vR1tY4b', '7h3');
  // 1) beCoz doğrudan
  assert.equal(beCoz(dizi), hedef);
  // 2) sifreCoz ana girişi: sources + dizi-literal kolu
  const html = `<script>player = {sources:[{file:V}]}; var V = de(${JSON.stringify(dizi)});</script>`;
  const bulunan = sifreCoz(html);
  assert.equal(bulunan, hedef, `bulunan: ${bulunan}`);
});

test('Be şeması: ops varyantları (7 tek başına, 3 yok)', () => {
  const hedef = 'https://x.test/a/master.txt'; // master.txt → m3u8 dönüşümü beklenir
  const dizi = beSar('https://x.test/a/master.txt', 'B3cdE5fGh8jKlMnOpQr', '7s');
  assert.equal(beCoz(dizi), 'https://x.test/a/master.m3u8');
});

test('dn şeması gidiş-dönüş: script metninden adres geri gelir', () => {
  const hedef = 'https://cdn.dn-test.net/video/master.m3u8';
  const script = dnSar(hedef, 'QzWertYuiopLkjhGf', 'bv2');
  const bulunan = dnCoz(script);
  assert.equal(bulunan, hedef, `bulunan: ${bulunan}`);
});
