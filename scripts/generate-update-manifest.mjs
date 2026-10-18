#!/usr/bin/env node
/**
 * generate-update-manifest.mjs — guncelleme manifestlerinin TEK kaynagi package.json.
 *
 * public/version.json ve public/desktop-version.json icindeki surum-bagli alanlari
 * (version, versionCode, title, indirme URL'leri, desktop alt blogu) package.json'dan
 * yeniden uretir. releaseNotes, mandatory, releaseDate gibi elle girilen alanlara
 * DOKUNMAZ (releaseDate yalnizca surum degistiginde bugune cekilir).
 *
 *   node scripts/generate-update-manifest.mjs          # yaz (release hatti her build'de calistirir)
 *   node scripts/generate-update-manifest.mjs --check  # yazmadan senkron kontrolu, uyusmazlikta exit 1
 *
 * Ciktinin adlari electron-builder artifactName kurallariyla birebir ayni olmali:
 *   win  : CinePulse-Setup-${version}.exe   (package.json > build > win.artifactName)
 *   linux: CinePulse-${version}.deb / .flatpak (build > linux.artifactName)
 *   apk  : cinepulse.apk                    (.github/workflows adimlarinin kopyaladigi ad)
 * Isteyen CINEPULSE_REPO_SLUG ile depo adresini degistirebilir.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.env.CINEPULSE_REPO_SLUG || 'caca1403/cine-pulse';
const checkOnly = process.argv.includes('--check');

const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
if (!/^\d+\.\d+\.\d+$/.test(String(pkg.version || '')) || !Number.isInteger(pkg.versionCode)) {
  console.error('package.json icinde gecerli "version" (X.Y.Z) ve tamsayi "versionCode" sart (tek kaynak).');
  process.exit(1);
}

const base = `https://github.com/${slug}/releases/download/v${pkg.version}`;
const urls = {
  downloadUrl: `${base}/cinepulse.apk`,
  githubDownloadUrl: `${base}/cinepulse.apk`,
  windowsSetupUrl: `${base}/CinePulse-Setup-${pkg.version}.exe`,
  linuxFlatpakUrl: `${base}/CinePulse-${pkg.version}.flatpak`,
  linuxDebUrl: `${base}/CinePulse-${pkg.version}.deb`,
};

const problems = [];
for (const rel of ['public/version.json', 'public/desktop-version.json']) {
  const abs = path.join(root, rel);
  const source = readFileSync(abs, 'utf8');
  const manifest = JSON.parse(source);
  const expected = { version: pkg.version, versionCode: pkg.versionCode, title: `CinePulse v${pkg.version}`, ...urls };
  if (manifest.desktop && typeof manifest.desktop === 'object') {
    expected['desktop.version'] = pkg.version;
    expected['desktop.versionCode'] = pkg.versionCode;
    for (const key of ['windowsSetupUrl', 'linuxFlatpakUrl', 'linuxDebUrl']) {
      if (key in manifest.desktop) expected[`desktop.${key}`] = urls[key];
    }
  }

  const readField = (name) => (name.startsWith('desktop.') ? manifest.desktop?.[name.slice(8)] : manifest[name]);
  const drift = Object.entries(expected)
    .filter(([name, value]) => readField(name) !== value)
    .map(([name, value]) => `${name}: "${readField(name)}" != "${value}"`);

  if (checkOnly) {
    for (const line of drift) problems.push(`${rel}: ${line}`);
    continue;
  }
  if (drift.length === 0) {
    console.log(`${rel}: package.json ile senkron, degisiklik yok.`);
    continue;
  }

  const versionChanged = manifest.version !== pkg.version;
  for (const [name, value] of Object.entries(expected)) {
    if (name.startsWith('desktop.')) manifest.desktop[name.slice(8)] = value;
    else manifest[name] = value;
  }
  if (versionChanged) manifest.releaseDate = new Date().toISOString().slice(0, 10);
  writeFileSync(abs, JSON.stringify(manifest, null, 2) + (source.endsWith('\n') ? '\n' : ''));
  console.log(`${rel}: guncellendi (${drift.length} alan${versionChanged ? ', releaseDate=bugun' : ''}).`);
}

if (checkOnly && problems.length) {
  console.error('Manifestler package.json ile SENKRON DEGIL (rapor):');
  for (const line of problems) console.error(`  - ${line}`);
  console.error('Cozum: node scripts/generate-update-manifest.mjs  (npm run manifest:sync)');
  process.exit(1);
}
if (checkOnly) console.log('Manifestler package.json ile senkron.');
