const origin = process.env.CF_SITE || 'https://cinepulse.cinepulse.workers.dev';
/* Kalkan (worker WAF) kırpılmış UA'ları reddediyor (ölçüldü 2026-11-14:
 * 'Mozilla/5.0 Chrome/124' → /cinepulse.apk 302/403; tam Chrome UA → 200 +
 * application/vnd.android.package-archive). Test aracının UA'sı gerçek tarayıcı
 * gibi olmalı, yoksa canlı site "bozuk" gibi görünür (yanlış pozitif). */
const headers = {
  'User-Agent':
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Accept-Language': 'tr-TR,tr;q=0.9',
};
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
/* YAYILMA YARIŞI (2026-11-16 CI hatası): deploy'dan saniyeler sonra koşulduğunda
 * edge önbelleği ESKİ index.html'i sunabiliyor; o index'in işaret ettiği eski
 * hash'li paket silinmiş olduğundan duman testi 404 ile ÇÖKÜYOR (yanlış negatif:
 * site aslında sağlam). Çözüm: yerel dist'in beklenen paket adı + sürümüyle
 * sunulan sayfayı eşitle; eşleşene kadar cache-buster'la yeniden dene. */
let beklenenPaket = null;
let beklenenSurum = null;
try {
  const distIndex = path.join(KOK, 'dist', 'index.html');
  if (existsSync(distIndex)) {
    beklenenPaket = readFileSync(distIndex, 'utf8').match(/src="([^"]*assets\/index-[^"]+\.js)"/)?.[1] || null;
    beklenenSurum = JSON.parse(readFileSync(path.join(KOK, 'package.json'), 'utf8')).version;
  }
} catch { /* yerel dist yoksa (ör. uzaktan teşhis) eski davranış: yalnız erişim */ }
const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
async function check(pathAdi, status, options = {}, validate = () => true) {
  const r = await fetch(`${origin}${pathAdi}`, { ...options, headers: { ...headers, ...options.headers }, signal: AbortSignal.timeout(30000), redirect: 'manual' });
  const body = await r.text();
  if (r.status !== status || !validate(body, r)) throw new Error(`${pathAdi}: status=${r.status}, validation failed`);
  console.log(`PASS ${pathAdi}: ${r.status}`);
  return body;
}
let html = null;
let js = null;
const denemeSon = Date.now() + 120000;
for (let deneme = 1; ; deneme += 1) {
  const y = await fetch(`${origin}/?_smoke=${Date.now()}`, {
    headers, signal: AbortSignal.timeout(30000), redirect: 'manual', cache: 'no-store',
  });
  const govde = await y.text();
  if (y.status !== 200 || !govde.includes('id="app"')) {
    if (Date.now() > denemeSon) throw new Error(`/: status=${y.status}, geçersiz gövde`);
    await bekle(5000); continue;
  }
  const bulunan = govde.match(/src="([^"]*assets\/index-[^"]+\.js)"/)?.[1];
  if (!bulunan) throw new Error('Missing application bundle');
  if (beklenenPaket && bulunan !== beklenenPaket) {
    if (Date.now() > denemeSon) {
      throw new Error(`yayilma beklenen pakete ulasmadi: sunulan=${bulunan} beklenen=${beklenenPaket}`);
    }
    console.log(`bekleniyor (edge cache): sunulan=${bulunan} beklenen=${beklenenPaket} [${deneme}]`);
    await bekle(5000); continue;
  }
  html = govde; js = bulunan;
  console.log(`PASS /: ${y.status} (paket eşleşti: ${bulunan})`);
  break;
}
if (!js) throw new Error('Missing application bundle');
await check(js, 200, {}, body => body.length > 1000);
/* version.json da ayrı bir varlık: edge onu birkaç saniye eski sunabilir →
   sürüm eşleşmesini de azimli dene (yayılma penceresinde yanlış alarm olmasın). */
{
  let sonHata = null;
  for (let deneme = 0; deneme < 12; deneme += 1) {
    try {
      await check(`/version.json?_smoke=${Date.now()}`, 200, {}, body => {
        const v = JSON.parse(body).version;
        if (beklenenSurum && v !== beklenenSurum) throw new Error(`surum ${v} != ${beklenenSurum}`);
        return Boolean(v);
      });
      sonHata = null; break;
    } catch (h) { sonHata = h; await bekle(5000); }
  }
  if (sonHata) throw new Error(`/version.json: ${sonHata.message}`);
}
await check('/api/hls_proxy?url=x', 200, { method: 'OPTIONS' });
await check('/api/proxy?url=http%3A%2F%2F169.254.169.254%2Flatest%2F', 403);
// /cinepulse.apk artık 302 değil: baytlar worker üzerinden AKITILIR.
// Gövdeyi indirmeden başlıkları doğrula (80MB'lık indirme testi yapma).
{
  const r = await fetch(`${origin}/cinepulse.apk`, {
    headers, redirect: 'manual', signal: AbortSignal.timeout(30000),
  });
  try {
    if (r.status !== 200) throw new Error(`/cinepulse.apk: status=${r.status}`);
    if (!/package-archive/.test(r.headers.get('content-type') || '')) {
      throw new Error(`/cinepulse.apk: beklenmeyen content-type=${r.headers.get('content-type')}`);
    }
    console.log(`PASS /cinepulse.apk: ${r.status} (content-type=package-archive)`);
  } finally {
    try { await r.body?.cancel(); } catch { /* akış kapansın */ }
  }
}
console.log('Production smoke passed; provider playback is not covered by this test.');
