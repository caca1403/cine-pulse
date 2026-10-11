#!/usr/bin/env node
/* ==========================================================================
   CinePulse Otonom Çözümleyici — komut satırı aracı

   Kendi kaynaklarımızı denemek ve "bu adres açılıyor mu?" sorusunu tek
   komutla cevaplamak için. Uygulamadaki motorun birebir aynısını kullanır
   (src/services/autoExtractor.js), yani burada tutan ile telefonda tutan
   arasında fark yoktur.

   Kullanım:
     node tools/autoextract.mjs <url> [baslik]
     node tools/autoextract.mjs --tanı <url>
     node tools/autoextract.mjs --coklu <url> <url> ...

   Örnek:
     node tools/autoextract.mjs https://diziboxizle.com/ "56 Days"
     node tools/autoextract.mjs --tanı https://www.diziboxizle.com/
   ========================================================================== */

import { otonomCoz, otonomCozIlk, siteTani } from '../src/services/autoExtractor.js';
import { isStreamPlayable } from '../src/services/embedExtractors.js';

// Node'da localStorage/window yok; nativeHttp yalnızca Android'de çalışıyor,
// burada doğrudan fetch'e düşer. Testlerde yerel sidecar'ı kullanabilmek için
// göreli /api yolları yan sidecar'a yönlendirilir.
const SIDECAR = process.env.CINEPULSE_SIDECAR || 'http://127.0.0.1:4000';
const nativeFetch = globalThis.fetch;
globalThis.fetch = (input, init) => {
  const url = typeof input === 'string' && input.startsWith('/') ? SIDECAR + input : input;
  return nativeFetch(url, init);
};
globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
globalThis.window = { location: { hostname: '', protocol: 'https:' } };

const bayt = (n) => `${(n / 1024).toFixed(0)} KB`;
const saat = (t) => `${(t / 1000).toFixed(1)}s`;

function zincleYaz(zincir, girinti = '     ') {
  if (!zincir || !zincir.length) return;
  zincir.forEach((a, i) => {
    const son = i === zincir.length - 1 ? '└' : '├';
    const detay = a.adet !== undefined ? `${a.adet} adet`
      : a.bayt !== undefined ? bayt(a.bayt)
      : a.desen || '';
    console.log(`${girinti}${son} ${a.adim.padEnd(16)} ${detay}`);
  });
}

const argv = process.argv.slice(2);
if (!argv.length) {
  console.log(`
CinePulse Otonom Çözümleyici

  node tools/autoextract.mjs <url> [baslik]
  node tools/autoextract.mjs --tanı <url>        siteyi tanı
  node tools/autoextract.mjs --coklu <url> ...   sırayla dene
`);
  process.exit(0);
}

const taniModu = argv[0] === '--tanı';
const cokluModu = argv[0] === '--coklu';
const arglar = (taniModu || cokluModu) ? argv.slice(1) : argv;
const url = arglar[0];
const baslik = arglar[1] || '';

if (!url) { console.error('URL gerekli'); process.exit(1); }

if (taniModu) {
  console.log(`\n═══ SİTE TANI: ${url} ═══`);
  const t = await siteTani(url);
  if (!t.ok) { console.log(`  ✗ ${t.hata}`); process.exit(1); }
  console.log(`  başlık        : ${t.baslik}`);
  console.log(`  WordPress     : ${t.wordpress ? 'evet' : 'hayır'}`);
  console.log(`  REST API      : ${t.wpRest ? 'var' : 'yok'}`);
  console.log(`  iframe        : ${t.iframe}`);
  console.log(`  m3u8 izi      : ${t.m3u8 ? 'var' : 'yok'}`);
  console.log(`  video etiketi : ${t.videoEtiketi ? 'var' : 'yok'}`);
  console.log(`  CF engeli     : ${t.engelMi ? 'VAR (cihaz WebView gerekir)' : 'yok'}`);
  console.log(`  bağlantı      : ${t.baglanti}   içerik sayfası: ${t.icerikSayfasi}\n`);
  process.exit(0);
}

// CLI'da düz fetch çoğu siteyi engelliyor; yan sidecar'ın /api/proxy'si
// üzerinden tekrar deniyoruz (Referer sunucu tarafında basılıyor).
const yanCek = async (url, { ref } = {}) => {
  try {
    const r = await nativeFetch(
      `${SIDECAR}/api/proxy?url=${encodeURIComponent(url)}&ref=${encodeURIComponent(ref || url)}`,
      { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/124' } }
    );
    if (!r.ok) return '';
    return await r.text();
  } catch (_) {
    return '';
  }
};

const baslangic = Date.now();
console.log(`\n═══ OTONOM ÇÖZÜMLEME ═══`);
console.log(`  hedef : ${url}`);
if (baslik) console.log(`  başlık: ${baslik}`);

// Kullanici bekleyip sonucu hic gormesin diye sure siniri: komut kendisi
// durur ve eldeki sonucu yazar.
const sonuc = cokluModu
  ? await otonomCozIlk(arglar, { baslik, yedekCek: yanCek })
  : await otonomCoz(url, { baslik, yedekCek: yanCek });

if (!sonuc) {
  console.log(`\n  ✗ ÇÖZÜLEMEDİ  (${saat(Date.now() - baslangic)})\n`);
  process.exit(1);
}


console.log(`\n  ✓ ÇÖZÜLDÜ — yöntem: ${sonuc.via}`);
console.log(`    adres : ${sonuc.url}`);
if (sonuc.referer) console.log(`    referer: ${sonuc.referer}`);

// iframe sonucu doğrudan medya değildir; tarayıcı oynatıcıyı kendi
// motoruyla çalıştırır, o yüzden aynı ölçüm uygulanmaz.
if (sonuc.isIframe) {
  console.log('    oynatma      : GÖMÜLÜ (iframe) — tarayıcı motoru açacak');
} else {
  const oynar = await isStreamPlayable(sonuc.url, sonuc.referer || '', 12000);
  console.log(`    oynatılabilir: ${oynar ? 'EVET' : 'hayır (CDN bu ağdan kapalı olabilir)'}`);
}
if (sonuc.subtitles?.length) console.log(`    altyazı: ${sonuc.subtitles.length}`);
console.log(`\n  zincir:`);
zincleYaz(sonuc.zincir);
console.log(`  süre: ${saat(Date.now() - baslangic)}\n`);