#!/usr/bin/env node
/* Release varlıklarının sha256 özetlerini public/desktop-version.json'a yazar.
   İstemci (electron/main.cjs) kurulum öncesi bu özetleri ZORUNLU sayar; özet
   yoksa ya da uyuşmazsa kurulum yapılmaz.
   Kullanım: node scripts/inject-desktop-hashes.mjs <varlık-klasörü> <manifest-yolu> */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const [assetsDir, manifestPath] = process.argv.slice(2);
if (!assetsDir || !manifestPath) {
  console.error('Kullanım: inject-desktop-hashes.mjs <varlık-klasörü> <manifest-yolu>');
  process.exit(1);
}

// Sabit adlı kopyalarla (releases/latest/download) birebir aynı adlar.
const HARITA = {
  windowsSetupSha256: 'CinePulse-Setup.exe',
  linuxDebSha256: 'CinePulse.deb',
  linuxFlatpakSha256: 'CinePulse.flatpak'
};

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
let yazilan = 0;
for (const [alan, dosya] of Object.entries(HARITA)) {
  const mutlak = path.join(assetsDir, dosya);
  if (!existsSync(mutlak)) continue;
  manifest[alan] = createHash('sha256').update(readFileSync(mutlak)).digest('hex');
  yazilan++;
}
if (!yazilan) {
  console.error('Hiç varlık bulunamadı; özet yazılmadan çıkılıyor.');
  process.exit(1);
}
const kaynak = readFileSync(manifestPath, 'utf8');
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + (kaynak.endsWith('\n') ? '\n' : ''));
console.log(`${manifestPath}: ${yazilan} sha256 alanı yazıldı.`);
