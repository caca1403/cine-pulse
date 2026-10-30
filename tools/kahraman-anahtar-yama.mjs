#!/usr/bin/env node
/* Kahraman çekirdeklerine config TAKMA AD yedeği ekler.
   Kök neden: domains.json anahtarları takma ad (joyboy/toki/shanks…), çekirdekler
   kendi adıyla soruyor → boş harita → 0 kaynak. Yama çağrı yerine yalnız yedek
   ekler, mevcut anahtarı KORUR (cihazda hero-anahtarlı config gelirse o çalışmaya devam eder).
   Idempotent: yedek zaten varsa dokunmaz.
   Kullanım: node tools/kahraman-anahtar-yama.mjs [--dry] [dosya.js ...] */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CEKIRDEK = path.join(KOK, 'src/providers/cekirdekler');
const DRY = process.argv.includes('--dry');

/* kahraman adı → takma ad (alanlar.js satır sonu yorumlarından) */
const alanlar = readFileSync(path.join(KOK, 'src/providers/alanlar.js'), 'utf8');
const lakap = new Map();
for (const satir of alanlar.split('\n')) {
  const m = satir.match(/["']([A-Za-z-]+)["']\s*:\s*["']https?:\/\/[^"']+["']\s*,?\s*\/\/\s*([a-z0-9_-]+)/);
  if (m) lakap.set(m[1], m[2]);
}

const hedefler = process.argv.slice(2).filter(a => a.endsWith('.js'));
const dosyalar = hedefler.length ? hedefler : readdirSync(CEKIRDEK).filter(f => f.endsWith('.js'));
const rapor = [];

for (const dosya of dosyalar) {
  const yol = path.join(CEKIRDEK, dosya);
  let kod;
  try { kod = readFileSync(yol, 'utf8'); } catch { continue; }
  const ad = dosya.replace(/\.js$/, '');
  const kahraman = [...lakap.keys()].find(k => k.toLowerCase().replace(/-/g, '') === ad.toLowerCase());
  if (!kahraman) { rapor.push({ dosya, durum: 'lakap-bilinmiyor' }); continue; }
  const lak = lakap.get(kahraman);

  // await fn("Hero") → (await fn("Hero") || await fn("lakap"))
  // dosyada bu takma ad zaten soruluyorsa yama gerekmez (elle atılan yedekler dahil)
  if (kod.includes(`("${lak}")`) || kod.includes(`('${lak}')`)) { rapor.push({ dosya, durum: 'zaten-yamali', lakap: lak }); continue; }
  // Çağrı adı her çekirdekte farklı (fn, j0, ...): tek string argümanlı await'li çağrıyı yakala
  const re = new RegExp(`await\\s+([A-Za-z_$][\\w$]*)\\(\\s*["']${kahraman}["']\\s*\\)`, 'g');
  let bulundu = false, yeni = kod.replace(re, (tum, isim) => {
    bulundu = true;
    return `(await ${isim}("${kahraman}") || await ${isim}("${lak}"))`;
  });

  if (!bulundu) { rapor.push({ dosya, durum: kod.includes(`"${lak}"`) ? 'zaten-yamali' : 'cagri-yok', lakap: lak }); continue; }
  if (!DRY) writeFileSync(yol, yeni);
  rapor.push({ dosya, durum: DRY ? 'yamlanacak' : 'yamandi', lakap: lak });
}

const ozet = {};
for (const r of rapor) ozet[r.durum] = (ozet[r.durum] || 0) + 1;
console.log('ÖZET:', JSON.stringify(ozet), DRY ? '(dry-run)' : '');
for (const r of rapor.filter(x => x.durum === 'yamlanacak' || x.durum === 'yamandi' || x.durum === 'lakap-bilinmiyor'))
  console.log(`${r.durum.padEnd(14)} ${r.dosya.padEnd(22)} lakap=${r.lakap || '-'}`);
