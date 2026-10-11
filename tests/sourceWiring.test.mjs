/* ==========================================================================
   Kaynak BAĞLAMA denetimi — ölü kod koruması

   Dizi77 ve sinemacc kazıyıcıları yazıldı, kataloga eklendi, testleri de
   doğrudan import ettikleri için GEÇTİ — ama aggregator onları hiç
   çağırmıyordu, dolayısıyla üretilen pakette hiç yoktular.

   Bu test iki şeyi doğrular:
     1) Her kaynak kazıyıcısı aggregator tarafından gerçekten çağrılıyor.
     2) Üretilen paket, o kaynağın kendine özgü imzasını İÇERİYOR
        (yani gerçekten dağıtıma giriyor).

   Yeni kaynak eklerken ikinci dosyaya (KAYNAK_IMZALARI) bir satır ekle.
   ========================================================================== */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let pass = 0, fail = 0;
const ok = (c, m) => { c ? (pass++, console.log(`  ✓ ${m}`)) : (fail++, console.log(`  ✗ ${m}`)); };

// id -> { dosya, aggregator'da çağrılan fonksiyon, pakette aranacak özgün imza }
const KAYNAK_IMZALARI = [
  { id: 'dizi77',   dosya: 'dizi77Scraper.js',   cagri: 'fetchDizi77Sources',   imza: 'https://dizi77.life' },
  { id: 'sinemacc', dosya: 'sinemaccScraper.js', cagri: 'fetchSinemaccSources', imza: 'https://sinemacc.com' },
  { id: 'vodm3u',   dosya: 'vodM3uSources.js',   cagri: 'fetchVodSources',      imza: 'patr0nq/flmS' }
];

console.log('\n═══ 1) Kaynak kazıyıcısı → aggregator bağlantısı ═══');
const agg = fs.readFileSync(path.join(ROOT, 'src/services/providerAggregator.js'), 'utf8');

for (const k of KAYNAK_IMZALARI) {
  const dosyaVar = fs.existsSync(path.join(ROOT, 'src/services', k.dosya));
  ok(dosyaVar, `${k.dosya} mevcut`);
  const importEdildi = new RegExp(`import\\s*\\{[^}]*\\b${k.cagri}\\b[^}]*\\}\\s*from\\s*'\\./${k.dosya.replace('.', '\\.')}'`).test(agg);
  ok(importEdildi, `  ↳ aggregator '${k.dosya}' dosyasını import ediyor`);
  // Çağrı sadece import'ta değil, gövdede de geçmeli.
  const cagriSayisi = (agg.match(new RegExp(`\\b${k.cagri}\\s*\\(`, 'g')) || []).length;
  ok(cagriSayisi > 0, `  ↳ '${k.cagri}()' aggregator gövdesinde ${cagriSayisi} kez çağrılıyor`);
}

console.log('\n═══ 2) Katalog kaydı → kazıyıcı eşleşmesi ═══');
const cat = fs.readFileSync(path.join(ROOT, 'src/services/pluginCatalog.js'), 'utf8');
for (const k of KAYNAK_IMZALARI) {
  const kayitli = new RegExp(`\\{\\s*id:\\s*'${k.id}'`).test(cat);
  ok(kayitli, `'${k.id}' pluginCatalog'da kayıtlı`);
  const alias = (cat.match(new RegExp(`\\b${k.id}:\\s*'([A-Za-z]+)'`)) || [])[1];
  ok(!!alias, `  ↳ anonim adı: ${alias || 'YOK'}`);
}

console.log('\n═══ 3) Üretilen paket gerçekten içeriyor mu ═══');
const distDir = path.join(ROOT, 'dist/assets');
if (!fs.existsSync(distDir)) {
  console.log('  · dist/ yok — atlandı (vite build çalıştırılmamış)');
} else {
  const paket = fs.readdirSync(distDir)
    .filter((f) => f.endsWith('.js'))
    .map((f) => fs.readFileSync(path.join(distDir, f), 'utf8'))
    .join('\n');
  for (const k of KAYNAK_IMZALARI) {
    ok(paket.includes(k.imza), `  ↳ paket "${k.imza}" imzasını içeriyor (${k.id})`);
  }
}

console.log(`\n${fail === 0 ? 'TAMAM' : 'BAŞARISIZ'} — geçen: ${pass}, kalan: ${fail}`);
process.exit(fail === 0 ? 0 : 1);