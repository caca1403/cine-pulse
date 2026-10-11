/* ==========================================================================
   Sağlayıcı çözücü (deobfuscator) — ÖLÇÜM ARACI

   Bazı sağlayıcı dosyaları obfuscator.io ile paketlenmiş: metinler bir
   diziye gizlenip _0x131b3d(0xNNN) gibi indekslerle çağrılıyor. Bu araç
   dosyayı bir sandbox'ta çalıştırıp çözücüyü elde ediyor ve indeksleri
   gerçek metne çeviriyor.

   GÜVENLİK: dosya vm.runInContext içinde koşuyor; fetch/atob yalnızca
   stub'lanıyor, ağ erişimi ve dosya sistemi erişimi YOK. Amaç kod
   çalıştırmak değil, metinleri geri almak.

   Kullanım:
     node tools/deobfuscate.js <dosya.js>
     node tools/deobfuscate.js <klasör>       # klasördeki tüm .js
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

/** Metinleri gizlenmiş dosyanın çözücüsünü sandbox'ta çalıştırıp elde eder. */
function cozucuyuCoz(kod) {
  // "var/const/let X = _0xNNNN;" — çözücünün takma adı
  const takma = kod.match(/(?:var|const|let)\s+(_0x[0-9a-f]+)\s*=\s*(_0x[0-9a-f]+)\s*;/);
  if (!takma) return null;
  const cozucuAd = takma[2];

  const ctx = {
    console: { log() {}, warn() {}, error() {}, info() {}, debug() {} },
    // Ağ YOK
    fetch: () => Promise.resolve({ ok: false, status: 0, text: async () => '', json: async () => ({}) }),
    AbortController: class { constructor() { this.signal = {}; } abort() {} },
    AbortSignal: { timeout: () => ({}) },
    setTimeout: () => 0, clearTimeout: () => {}, setInterval: () => 0, clearInterval: () => {},
    URL, URLSearchParams, JSON, Math, Date, Object, Array, String, Number, RegExp, Error, Promise,
    Buffer,
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    parseInt, isNaN, parseFloat, encodeURIComponent, decodeURIComponent, unescape, escape,
    module: { exports: {} }, exports: {}, document: { write() {} }
  };
  ctx.globalThis = ctx;
  ctx.window = ctx;
  vm.createContext(ctx);
  try { vm.runInContext(kod, ctx, { timeout: 8000 }); } catch (_) {}

  const f = ctx[cozucuAd];
  if (typeof f !== 'function') return null;

  const metinler = new Map();
  for (let i = 0; i < 1400; i++) {
    try {
      const s = f(i);
      if (typeof s === 'string' && s && s.length < 400) metinler.set(i, s);
    } catch (_) {}
  }
  return metinler;
}

/** Bir dosyanın alan adı / yol / api kalıplarını çıkarır. */
export function dosyaCoz(dosya) {
  const kod = fs.readFileSync(dosya, 'utf8');
  const metinler = cozucuyuCoz(kod);
  if (!metinler) return null;
  const degerler = [...metinler.values()];
  return {
    dosya,
    metinSayisi: degerler.length,
    adresler: [...new Set(degerler.filter((s) => /^https?:\/\/[a-z0-9.-]+\.[a-z]{2,6}\/?$/i.test(s)))],
    yollar: [...new Set(degerler.filter((s) => /^\/[a-z0-9_/-]{2,40}$/i.test(s) && !/\.[a-z]{2,4}$/i.test(s)))].slice(0, 12),
    api: [...new Set(degerler.filter((s) => /\/api\/|search\?|\?q=|watch\?/i.test(s) && s.length < 60))].slice(0, 8)
  };
}

// Doğrudan çalıştırılırsa
if (process.argv[1] && process.argv[1].endsWith('deobfuscate.js')) {
  const hedef = process.argv[2];
  if (!hedef) {
    console.log('Kullanım: node tools/deobfuscate.js <dosya.js | klasör>');
    process.exit(1);
  }
  const dosyalar = fs.statSync(hedef).isDirectory()
    ? fs.readdirSync(hedef).filter((f) => f.endsWith('.js')).map((f) => path.join(hedef, f))
    : [hedef];
  let cozulen = 0;
  for (const d of dosyalar) {
    const r = dosyaCoz(d);
    if (!r) { console.log(`  ✗ ${path.basename(d).padEnd(18)} çözülemedi`); continue; }
    cozulen++;
    console.log(`  ✓ ${path.basename(d).padEnd(18)} ${r.metinSayisi} metin | ${r.adresler.slice(0, 2).join(' ') || '(adres yok)'}`);
    console.log(`     yollar: ${r.yollar.slice(0, 6).join(' ')}`);
  }
  console.log(`\n${cozulen}/${dosyalar.length} dosya çözüldü`);
}