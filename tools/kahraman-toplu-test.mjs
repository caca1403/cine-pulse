#!/usr/bin/env node
/* Tüm kahraman çekirdeklerini tek tek ölçer ve tablo basar.
   tools/cekirdek-test.mjs her çekirdeği AYRI sürecimde çalıştırır (globalThis
   taşmasın), burada yalnız sıraya koyuyoruz. Sıra şart: aynı anda 55 çekirdek
   ağ bandını bölüyor, yavaş bağlantıda hepsi timeout'a düşüyor.
   Kullanım: node tools/kahraman-toplu-test.mjs [--tur tv|movie] [--timeout 60] [dosya.js ...] */
import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CEKIRDEK = path.join(KOK, 'src/providers/cekirdekler');
const argv = process.argv.slice(2);
const turIdx = argv.indexOf('--tur');
const TUR = turIdx >= 0 ? argv[turIdx + 1] : 'tv';
const toIdx = argv.indexOf('--timeout');
const SANIYE = toIdx >= 0 ? Number(argv[toIdx + 1]) : 60;
const secilen = argv.filter(a => a.endsWith('.js'));
const dosyalar = secilen.length ? secilen : readdirSync(CEKIRDEK).filter(f => f.endsWith('.js'));

// tmdb kimliği: tv → Game of Thrones 1399 s1e1, movie → Fight Club 550
const KIMLIK = TUR === 'tv' ? ['1399', 'tv', '1', '1'] : ['550', 'movie'];
const satirlar = [];
for (const dosya of dosyalar) {
  const r = spawnSync('node', [path.join(KOK, 'tools/cekirdek-test.mjs'), dosya, ...KIMLIK], {
    encoding: 'utf8', timeout: SANIYE * 1000, env: { ...process.env, LC_ALL: 'C.UTF-8' }
  });
  const cikti = `${r.stdout || ''}${r.stderr || ''}`;
  let adet = 0, sure = '', hata = '';
  const j = cikti.match(/\{[\s\S]*\}/);
  if (j) { try { const o = JSON.parse(j[0]); adet = o.adet; sure = `${Math.round((o.sureMs || 0) / 1000)}sn`; } catch { hata = 'json-bozuk'; } }
  else if (r.error?.code === 'ETIMEDOUT') hata = `TIMEOUT>${SANIYE}sn`;
  else hata = cikti.split('\n').filter(Boolean).slice(-1)[0]?.slice(0, 40) || 'sessiz';
  satirlar.push({ dosya, adet, sure, hata });
  console.log(`${String(adet).padStart(3)}  ${(sure || '-').padStart(6)}  ${dosya.padEnd(22)} ${hata}`);
}
const canli = satirlar.filter(s => s.adet > 0);
console.log(`\nCANLI: ${canli.length}/${satirlar.length}  (tur=${TUR}, bütçe=${SANIYE}sn/çekirdek)`);
console.log('ÖLÜ:', satirlar.filter(s => !s.adet).map(s => s.dosya.replace('.js', '')).join(', '));
