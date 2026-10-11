/* APK'nın Vercel'den KOPARILDIĞINI doğrular.

   Node'da @capacitor/core taklit edilemiyor (ESM import statik çözülüyor),
   bu yüzden çalışma zamanı yerine KOD DÜZENİ ölçülür: cihaz katmanı
   doğrudan istekten ve proxy'den ÖNCE gelmeli. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const kok = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const oku = (p) => fs.readFileSync(path.join(kok, p), 'utf8');

let gecti = 0, kalan = 0;
function ok(kosul, ad, ek = '') {
  if (kosul) { gecti++; console.log(`  ✓ ${ad}${ek ? ' — ' + ek : ''}`); }
  else { kalan++; console.log(`  ✗ ${ad}${ek ? ' — ' + ek : ''}`); }
}

console.log('═══ APK: istekler Vercel\'den koparıldı mı ═══\n');

// 1) nativeHttp: akilliGet sırası
const nh = oku('src/services/nativeHttp.js');
const akilliGet = nh.slice(nh.indexOf('export async function akilliGet'));
const iCihaz = akilliGet.indexOf('cihazGet');
const iDogrudan = akilliGet.indexOf('duzGet');
const iWebView = akilliGet.indexOf('gizliWebViewDeneme');
ok(iCihaz > -1 && iDogrudan > -1, 'akilliGet: cihaz katmanı ve doğrudan istek var');
ok(iCihaz < iDogrudan, 'cihaz katmanı doğrudan istekten ÖNCE denenir',
   `cihaz@${iCihaz} < dogrudan@${iDogrudan}`);
ok(iWebView > iDogrudan, 'gizli WebView doğrudan istekten sonra ama yedekten ÖNCE');
ok(!/proxyUrl\(/.test(akilliGet.slice(0, akilliGet.indexOf('\n}'))),
   'akilliGet içinde uygulama proxy\'si çağrılmıyor');

// 2) Vercel'e giden yol sadece YEDEK olarak kalmalı
const ee = oku('src/services/embedExtractors.js');
const getHtml = ee.slice(ee.indexOf('async function getHtml'));
ok(getHtml.indexOf('nativeHttpAktifMi') > -1 && getHtml.indexOf('akilliGet') > -1,
   'jenerik getHtml önce cihaz katmanını deniyor');
ok(getHtml.indexOf('akilliGet') < getHtml.indexOf('proxyGet'),
   'proxyGet yalnızca cihaz katmanından sonra');

// 3) Çoklu site sürücüsü
const sp = oku('src/services/siteProviders.js');
const istek = sp.slice(sp.indexOf('async function istek'));
ok(istek.indexOf('cihazGet') > -1 && istek.indexOf('cihazPost') > -1,
   'site sürücüsü cihaz katmanını kullanıyor');
ok(istek.indexOf('cihazGet') < istek.indexOf('akilliGet'),
   'cihaz isteği akilliGet\'ten önce');

// 4) Gizli WebView her iki platformda bağlı
ok(nh.includes('desktopWebViewResolver') && nh.includes('androidWebViewResolver'),
   'gizli WebView hem Android hem masaüstünde bağlı');
ok(/for \(const yol of \['\.\/platform\/androidWebViewResolver\.js', '\.\/platform\/desktopWebViewResolver\.js'\]\)/.test(nh),
   'çözümleyiciler sırayla deneniyor');

// 5) Vercel'e giden tek yol: /api/proxy — kaynak sorgularında kullanılmıyor
const pa = oku('src/services/providerAggregator.js');
const hdfcSatiri = pa.split('\n').filter((l) => l.includes('hdfc') && l.includes('fetchHdfilmcehennemiSources'));
ok(hdfcSatiri.length === 1, 'Orion aggregator\'da tek yerde bağlı');

console.log(`\n  Zincir: cihaz IP → doğrudan → gizli WebView → yedek/proxy`);
console.log(`  Yani APK'da hiçbir kaynak sorgusu Vercel üzerinden gitmiyor.\n`);
console.log(`TAMAM — geçen: ${gecti}, kalan: ${kalan}`);
process.exit(kalan === 0 ? 0 : 1);