/* ==========================================================================
   Kaynak BAĞLAMA denetimi — ölü kod koruması (KISA DİZİ)

   Eklenti/sağlayıcı katmanı söküldü: src/providers/ (KAYIT), providerRuntime/,
   site sürücüleri ve gömülü oynatıcı çözücülerinin hepsi kaldırıldı. Kaynak
   keşfi yalnız iki kısa dizi kazıyıcısına indi.

   Bu test üç şeyi doğrular:
     1) İki kısa dizi kazıyıcısı aggregator tarafından gerçekten çağrılıyor.
     2) Kaynak id'leri anonim kod adı defterinde (sourceLabels) kayıtlı — yani
        arayüzde gerçek site adı değil kod adı görünür.
     3) Sökülen kat geri gelmedi: eski dosyalar yok ve hiçbir kaynak dosya
        onları import etmiyor.
   ========================================================================== */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let pass = 0, fail = 0;
const ok = (c, m) => { c ? (pass++, console.log(`  ✓ ${m}`)) : (fail++, console.log(`  ✗ ${m}`)); };
const oku = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

console.log('\n═══ 1) Kısa dizi kazıyıcısı → aggregator bağlantısı ═══');
const agg = oku('src/services/kaynak/providerAggregator.js');
const KAYNAKLAR = [
  { onek: 'dml_', dosya: 'kaynak/dramalarScraper.js', cagri: 'fetchDramalarEpisodeSources' },
  { onek: 'ddz_', dosya: 'kaynak/dramaDizilerimScraper.js', cagri: 'fetchDramaDizilerimEpisodeSources' }
];
for (const k of KAYNAKLAR) {
  ok(fs.existsSync(path.join(ROOT, 'src/services', k.dosya)), `src/services/${k.dosya} mevcut`);
  const yol = k.dosya.split('/').pop();
  const importEdildi = new RegExp(`import\\s*\\{[^}]*\\b${k.cagri}\\b[^}]*\\}\\s*from\\s*'\\./${yol.replace('.', '\\.')}'`).test(agg);
  ok(importEdildi, `  ↳ aggregator '${yol}' dosyasını import ediyor`);
  const cagriSayisi = (agg.match(new RegExp(`\\b${k.cagri}\\s*\\(`, 'g')) || []).length;
  ok(cagriSayisi > 0, `  ↳ '${k.cagri}()' aggregator gövdesinde ${cagriSayisi} kez çağrılıyor`);
}

console.log('\n═══ 2) Kaynak id → anonim kod adı eşleşmesi ═══');
const labels = oku('src/services/kaynak/sourceLabels.js');
for (const k of KAYNAKLAR) {
  const aile = new RegExp(`prefixes:\\s*\\[[^\\]]*'${k.onek}'`).test(labels);
  ok(aile, `'${k.onek}' öneki sourceLabels aile defterinde kayıtlı`);
  const alias = aile ? (labels.match(new RegExp(`alias:\\s*'([A-Za-z]+)'[^\\n]*prefixes:\\s*\\[[^\\]]*'${k.onek}'`)) || [])[1] : null;
  ok(!!alias, `  ↳ anonim adı: ${alias || 'YOK'}`);
}
// Etiketlerde gerçek site adı geçmesin (agregatör jenerik "Sunucu X" üretir).
ok(!/dramalar\.com|dramadizilerim\.com/.test(agg), '  ↳ aggregator etiketleri site adı taşımıyor');

console.log('\n═══ 3) Sökülen kat geri gelmedi ═══');
// src/providers/ yeniden açıldı: içinde YALNIZ kahraman sağlayıcı katmanı
// vardır (kayit.js, vekil.js, alanlar.js, cekirdekler/). ESKİ elle yazılmış
// sağlayıcılar (KAYIT listesi, providerRuntime, site sürücüleri, gömülü
// oynatıcı çözücüler) geri gelmemelidir.
const GONE = [
  'src/services/providerRuntime',
  'src/services/pluginCatalog.js', 'src/components/PluginsModal.js',
  'src/services/dizi77Scraper.js', 'src/services/dizisolScraper.js',
  'src/services/siteProviders.js', 'src/services/rectvService.js',
  'src/services/streamExtractors.js', 'src/services/sourceReliability.js',
  'src/services/sourceIntelligence.js', 'src/services/torrentStreamService.js'
];
for (const p of GONE) ok(!fs.existsSync(path.join(ROOT, p)), `${p} yok`);

// src/providers/ içinde yalnız izin verilen üç öğe olmalı
const izinsiz = [];
if (fs.existsSync(path.join(ROOT, 'src/providers'))) {
  const IZIN = new Set(['kayit.js', 'vekil.js', 'alanlar.js', 'cekirdekler', 'README.md',
    'ortakCekirdek.js', 'kodCozler.js']); // birinci taraf çekirdeklerin ortak yardımcıları (2026-10-18)
  for (const e of fs.readdirSync(path.join(ROOT, 'src/providers'), { withFileTypes: true })) {
    if (!IZIN.has(e.name)) izinsiz.push(e.name);
  }
}
ok(izinsiz.length === 0, 'src/providers yalnız kahraman katmanını içeriyor',
  izinsiz.length ? ` → ${izinsiz.join(', ')}` : '');
// eski elle yazılmış sağlayıcı modülleri geri gelmemeli
const ESKI_SAGLAYICI = /^(orion|aria|tera|atlas|corvus|nimbus|halcyon|bellatrix|betelgeuse|aquila|lyra|echo|muhlif|lumen|sirius|arcturus|nero|vela|perseus)\.js$/;
const geriGelen = fs.existsSync(path.join(ROOT, 'src/providers'))
  ? fs.readdirSync(path.join(ROOT, 'src/providers')).filter(f => ESKI_SAGLAYICI.test(f))
  : [];
ok(geriGelen.length === 0, 'eski KAYIT sağlayıcıları geri gelmedi',
  geriGelen.length ? ` → ${geriGelen.join(', ')}` : '');

// services/ gruplamasi: duz dosya kalmamali, her sey 8 grubun birinde olmali
const GRUPLAR = ['platform', 'kaynak', 'canli', 'icerik', 'dogrudan', 'oynatici', 'kabuk', 'altyapi'];
const duz = fs.readdirSync(path.join(ROOT, 'src/services')).filter(f => f.endsWith('.js'));
ok(duz.length === 0, 'src/services altında düz .js kalmadı', duz.length ? ` → ${duz.join(', ')}` : '');
const eksikGrup = GRUPLAR.filter(g => !fs.existsSync(path.join(ROOT, 'src/services', g)));
ok(eksikGrup.length === 0, 'services 8 grubun tamamı yerinde', eksikGrup.length ? ` → eksik: ${eksikGrup.join(', ')}` : '');

const OLU_IMPORT = /(providerRuntime|pluginCatalog|streamExtractors|embedExtractors|sourceReliability|sourceIntelligence|siteProviders|rectvService|pulsarCatalog|nativeHttp|dizi77Scraper|dizisolScraper|playerDecoders|encryptedPlayer)/;
const sis = [];
(function tara(dir) {
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!/node_modules|dist|android|\.git/.test(p)) tara(p); continue; }
    if (!/\.m?js$/.test(e.name) || !OLU_IMPORT.test(oku(p))) continue;
    // Yorum satırları bağ sayılmaz: yalnız import/editif satırlarına bakılır.
    const aktif = oku(p).split('\n').filter((l) => /^\s*(import|export)\b/.test(l)).join('\n');
    if (OLU_IMPORT.test(aktif)) sis.push(p);
  }
})('src');
ok(sis.length === 0, 'src altında sökülmüş modüle import yok', sis.length ? ` → ${sis.join(', ')}` : '');

// İzlemin kendi katmanı sökülmüş listeye girmemeli

console.log('\n═══ 4) Üretilen paket kısa diziyi içeriyor mu ═══');
const distDir = path.join(ROOT, 'dist/assets');
if (!fs.existsSync(distDir)) {
  console.log('  · dist/ yok — atlandı (vite build çalıştırılmamış)');
} else {
  const paket = fs.readdirSync(distDir).filter((f) => f.endsWith('.js'))
    .map((f) => fs.readFileSync(path.join(distDir, f), 'utf8')).join('\n');
  ok(paket.includes('/api/dml'), '  ↳ paket Dora kısa dizi ucunu içeriyor');
  ok(paket.includes('/api/ddz'), '  ↳ paket Rhea kısa dizi ucunu içeriyor');
  ok(!/\/api\/(dzs|snx|jet|rtv|kvip|czm|hfd|flz)\b/.test(paket), '  ↳ paket sökülmüş sağlayıcı uçlarını içermiyor');
}

console.log(`\n${fail === 0 ? 'TAMAM' : 'BAŞARISIZ'} — geçen: ${pass}, kalan: ${fail}`);
process.exit(fail === 0 ? 0 : 1);
