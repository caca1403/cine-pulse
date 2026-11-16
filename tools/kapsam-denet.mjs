/* Kapsam denetimi: videoEl (ve verilen adlar) bildirim olmadan kullanılmış mı?
   Kullanım: node tools/kapsam-denet.mjs [dosya] [ad ...]  (varsayılan: PlayerModal.js videoEl) */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const acorn = require('acorn');

const dosya = process.argv[2] || 'src/components/PlayerModal.js';
const adlar = process.argv.slice(3).length ? process.argv.slice(3) : ['videoEl'];
const src = readFileSync(dosya, 'utf8');
const kod = src.split('\n');
const ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'module', locations: true });

const hatalar = [];
function bildirir(dugum) {
  const s = new Set();
  if (dugum.type === 'FunctionDeclaration' || dugum.type === 'FunctionExpression' || dugum.type === 'ArrowFunctionExpression') {
    for (const p of dugum.params || []) {
      if (p.type === 'Identifier') s.add(p.name);
      if (p.type === 'AssignmentPattern' && p.left?.type === 'Identifier') s.add(p.left.name);
    }
  }
  return s;
}
(function gez(dugum, zincir) {
  let y = zincir;
  const t = dugum.type;
  const kapsamMi = t === 'FunctionDeclaration' || t === 'FunctionExpression' || t === 'ArrowFunctionExpression' || t === 'BlockStatement';
  if (kapsamMi) y = zincir.concat([{ node: dugum, decls: bildirir(dugum) }]);
  if (t === 'VariableDeclarator' && dugum.id?.type === 'Identifier' && adlar.includes(dugum.id.name)) {
    const kaps = y[y.length - 1];
    if (kaps) kaps.decls.add(dugum.id.name);
  }
  if (t === 'Identifier' && adlar.includes(dugum.name)) {
    const line = dugum.loc?.start?.line ?? 0;
    let bulundu = false;
    for (let i = y.length - 1; i >= 0; i--) {
      if (y[i].decls.has(dugum.name)) { bulundu = true; break; }
    }
    // Property key/callee degilse ve bulamadiysak hata raporu
    if (!bulundu) hatalar.push(`L${line}: ${(kod[line - 1] || '?').trim().slice(0, 110)}`);
  }
  for (const k of Object.keys(dugum)) {
    if (k === 'loc' || k === 'type' || k === 'start' || k === 'end') continue;
    // x.videoEl (computed olmayan property) ve { videoEl: ... } ANAHTARLARI kullanim sayilmaz
    if (t === 'MemberExpression' && k === 'property' && !dugum.computed) continue;
    if (t === 'Property' && k === 'key' && !dugum.computed) continue;
    if ((t === 'MethodDefinition' || t === 'PropertyDefinition') && k === 'key' && !dugum.computed) continue;
    const c = dugum[k];
    if (Array.isArray(c)) { for (const e of c) if (e && typeof e.type === 'string') gez(e, y); }
    else if (c && typeof c.type === 'string') gez(c, y);
  }
})(ast, []);

// Ayni adi tasiyan property erisimleri (x.videoEl) Identifier degil MemberExpression
// property'sidir (computed=false) — gez() property'lere de ugrayabilir; filtre:
const filtreli = [...new Set(hatalar)];
if (filtreli.length) { console.log('KUSKULU referanslar:'); for (const h of filtreli) console.log('  ' + h); }
else console.log(`${dosya}: ${adlar.join(', ')} — TUM referanslar kapsamda, hata yok`);
