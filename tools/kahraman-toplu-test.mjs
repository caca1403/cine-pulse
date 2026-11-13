#!/usr/bin/env node
/* Tüm kahraman çekirdeklerini tek tek ölçer ve tablo basar.
   tools/cekirdek-test.mjs her çekirdeği AYRI süreçte çalıştırır (globalThis
   taşmasın), burada yalnız sıraya koyuyoruz. Sıra şart: aynı anda 55 çekirdek
   ağ bandını bölüyor, yavaş bağlantıda hepsi timeout'a düşüyor.
   Kullanım: node tools/kahraman-toplu-test.mjs [--tur tv|movie] [--timeout 60] [dosya.js ...] */
import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CEKIRDEK = path.join(KOK, 'src/providers/cekirdekler');

/**
 * Çekirdek çıktısındaki SON geçerli kök JSON nesnesini döndürür.
 *
 * ÖLÇÜLEN HATA (2026-11-13): eski kod `çıktı.match(/\{[\s\S]*\}/)` ile İLK
 * `{`den başlıyordu. Çekirdekler ilerleme satırlarında da süslü parantez
 * basıyor (ör. Zatanna `TAMAMLANDI: 1 akış ... [ { title: ... } ]`,
 * Spider-Man `{ dil: 'Altyazılı' }`) → eşleşme log satırının `{`sinden başlayıp
 * doğru final JSON'unu bozuyor, canlı çekirdekler "json-bozuk" görünüyordu.
 * Doğru kural: TÜM dengeli kök `{...}` bloklarını topla, SONUNCUDAN başlayarak
 * JSON.parse dene. Metin içindeki '{' '}' karakterleri için çift tırnak
 * kaçışları izlenir.
 */
export function sonJsonNesnesi(metin) {
  const kaynak = String(metin || '');
  const adaylar = [];
  let derinlik = 0;
  let bas = 0;
  let tirnak = false;
  let kacis = false;
  for (let i = 0; i < kaynak.length; i += 1) {
    const c = kaynak[i];
    if (tirnak) {
      if (kacis) kacis = false;
      else if (c === '\\') kacis = true;
      else if (c === '"') tirnak = false;
      continue;
    }
    if (c === '"') { tirnak = true; continue; }
    if (c === '{') {
      if (derinlik === 0) bas = i;
      derinlik += 1;
    } else if (c === '}') {
      if (derinlik > 0) {
        derinlik -= 1;
        if (derinlik === 0) adaylar.push(kaynak.slice(bas, i + 1));
      }
    }
  }
  // SON adaydan geriye: log satırlarındaki geçersiz `{ ... }` parçaları atlanır.
  for (let i = adaylar.length - 1; i >= 0; i -= 1) {
    try {
      const nesne = JSON.parse(adaylar[i]);
      if (nesne && typeof nesne === 'object' && !Array.isArray(nesne)) return nesne;
    } catch (_) { /* log parçası → önceki adaya geç */ }
  }
  return null;
}

/** spawnSync sonucundan {adet, sure, hata} çıkarır (test edilebilir saf işlev). */
export function satirCoz(sonuc, saniye) {
  const cikti = `${sonuc.stdout || ''}${sonuc.stderr || ''}`;
  const o = sonJsonNesnesi(cikti);
  if (o) return { adet: Number(o.adet) || 0, sure: `${Math.round((o.sureMs || 0) / 1000)}sn`, hata: '' };
  if (sonuc.error?.code === 'ETIMEDOUT' || sonuc.signal) return { adet: 0, sure: '', hata: `TIMEOUT>${saniye}sn` };
  return {
    adet: 0,
    sure: '',
    hata: cikti.split('\n').filter(Boolean).slice(-1)[0]?.slice(0, 40) || 'sessiz',
  };
}

function main() {
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
    const { adet, sure, hata } = satirCoz(r, SANIYE);
    satirlar.push({ dosya, adet, sure, hata });
    console.log(`${String(adet).padStart(3)}  ${(sure || '-').padStart(6)}  ${dosya.padEnd(22)} ${hata}`);
  }
  const canli = satirlar.filter(s => s.adet > 0);
  console.log(`\nCANLI: ${canli.length}/${satirlar.length}  (tur=${TUR}, bütçe=${SANIYE}sn/çekirdek)`);
  console.log('ÖLÜ:', satirlar.filter(s => !s.adet).map(s => s.dosya.replace('.js', '')).join(', '));
}

// Doğrudan çalıştırıldıysa tara; test tarafından import edildiyse yalnız işlevler.
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main();
