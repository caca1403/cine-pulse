#!/usr/bin/env node
/* Kahraman çekirdeklerindeki İKİ üretim-hattı hatasını mekanik olarak onarır.
   Elle çekirdek yamalamıyoruz: iki kalıp, tüm dosyalara aynı kuralla uygulanır.

   1) INTEROP GÖLGELEMESİ (19 çekirdek: "value is not a function")
      Çözümleyici `__toESM` yardımıcısının parametresini `value` diye
      adlandırdı; modül seviyesinde ise `var value = Object.create` var.
      Bu yüzden `value(value4(value))` = `Object.create(Object.getPrototypeOf(mod))`
      olması gereken yer, MODÜL NESNESİNİ fonksiyon çağırır hâle geldi.
      Onarım: çağrılan adı açık `Object.create` yap (parametre gölgesi kalsa
      de doğru anlamsal karşılığı kullanılır).

   2) CJS KUYRUK YAZMASI (24 çekirdek: "Cannot set property getStreams … only a getter")
      Kuyruk `module.exports.getStreams = _gs` yazıyor; o nesne esbuild'in
      salt-getirici tanımlarıyla dolu → katı modda TypeError → tüm modül ölür.
      Oysa global kayıt (`globalThis.getStreams = ...`) bir satır önce zaten
      yapıldı. Onarım: CJS yazmasını tolere et (başarısız olursa global kayıt
      yeterlidir).

   Kullanım: node tools/kahraman-yamama.mjs [--dry]
*/
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), 'src', 'providers', 'cekirdekler');
const kuruCalisma = process.argv.includes('--dry');

/* 1) interop: `X != null ? X(Y(X)) : {}` → `X != null ? Object.create(Y(X)) : {}` */
const INTEROP = /\b([A-Za-z_$][\w$]*) != null \? \1\(([A-Za-z_$][\w$]*)\(\1\)\) : \{\}/g;

/* 2) CJS kuyruğu: `module.exports.<ad> = <deg>;` → try/catch */
const CJS_KUYRUK = /if \(typeof module !== "undefined" && module\.exports\) module\.exports\.([A-Za-z_$][\w$]*) = ([A-Za-z_$][\w$]*);/g;

const rapor = { interop: 0, cjs: 0, dosya: 0, degisen: 0 };
const dokunanlar = [];

for (const ad of readdirSync(KOK).filter(f => f.endsWith('.js'))) {
  const yol = path.join(KOK, ad);
  const onceki = readFileSync(yol, 'utf8');
  let metin = onceki;

  metin = metin.replace(INTEROP, (_, mod, proto) => {
    rapor.interop++;
    return `${mod} != null ? Object.create(${proto}(${mod})) : {}`;
  });

  metin = metin.replace(CJS_KUYRUK, (_, alan, deger) => {
    rapor.cjs++;
    // Global kayıt zaten yapıldı; CJS yazması yalnız CommonJS alıcısı için.
    return `if (typeof module !== "undefined" && module.exports) { try { module.exports.${alan} = ${deger}; } catch (_) {} }`;
  });

  rapor.dosya++;
  if (metin !== onceki) {
    rapor.degisen++;
    dokunanlar.push(ad);
    if (!kuruCalisma) writeFileSync(yol, metin, 'utf8');
  }
}

console.log(`${kuruCalisma ? '[dry-run] ' : ''}dosya=${rapor.dosya} degisen=${rapor.degisen} interop=${rapor.interop} cjs-kuyruk=${rapor.cjs}`);
if (kuruCalisma && dokunanlar.length) console.log('dokunulacaklar:', dokunanlar.slice(0, 12).join(', ') + (dokunanlar.length > 12 ? ' …' : ''));
