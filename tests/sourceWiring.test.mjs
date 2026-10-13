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
// Yalnızca temiz sağlayıcısı OLMAYAN kaynaklar burada listelenir. Eski
// scraper'ı silinen satırlar (sinemacc→Halcyon, dizibox→ELE) temiz kalıba
// taşındı; onların bağlantısı 1b bölümünde doğrulanıyor.
const KAYNAK_IMZALARI = [
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

console.log('\n═══ 1b) Temiz sağlayıcılar KAYIT + katalog bağlantısı ═══');
const kayit = fs.readFileSync(path.join(ROOT, 'src/providers/index.js'), 'utf8');
const TEMIZ = [
  ['hdfc', 'orion', 'Orion'], ['anizium', 'aria', 'Aria'], ['animecix', 'tera', 'Tera'],
  ['dzs', 'atlas', 'Atlas'], ['dizi77', 'corvus', 'Corvus'], ['jet', 'nimbus', 'Nimbus'],
  ['sinemacc', 'halcyon', 'Halcyon'], ['hdfd', 'bellatrix', 'Bellatrix'],
  ['d4kh', 'betelgeuse', 'Betelgeuse'], ['asy', 'aquila', 'Aquila'], ['slc', 'lyra', 'Lyra'],
  ['dyu', 'echo', 'Echo'], ['dzp', 'muhlif', 'Muhlif'], ['czgx', 'lumen', 'Lumen'],
  ['fhdf', 'sirius', 'Sirius'], ['fm', 'arcturus', 'Arcturus'], ['dzb', 'nero', 'Nero'],
];
for (const [id, dosya, kodAdi] of TEMIZ) {
  ok(fs.existsSync(path.join(ROOT, 'src/providers', `${dosya}.js`)), `src/providers/${dosya}.js mevcut`);
  ok(new RegExp(`${id}:\\s*\\(\\)\\s*=>\\s*import\\('\\./${dosya}\\.js'\\)`).test(kayit), `KAYIT: ${id} → ${dosya}.js`);
  ok(fs.readFileSync(path.join(ROOT, 'src/providers', `${dosya}.js`), 'utf8').includes(`'${kodAdi}'`),
     `  ↳ kimlik kod adı: ${kodAdi}`);
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