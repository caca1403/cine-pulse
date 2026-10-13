#!/usr/bin/env node
/* ==========================================================================
   gizli-tara.mjs — PUSH ÖNCESİ SIR KAPISI
   Kullanım:  node tools/gizli-tara.mjs
   Çıkış:     0 = temiz;  1 = sır/iz bulundu (listeyi basar, push YAPMA).
   Satır bazlı susturma: ilgili satıra  // gizli-tara:allow  yorumu ekle.
   Taranan kökler: src api server electron tools scripts tests deploy android
                   + kök js/json/html/yml dosyaları. node_modules/dist/release/
                   reports/scratch/media_storage ve .env (güvenli liman) hariç.
   ========================================================================== */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCAN_DIRS = ['src', 'api', 'server', 'electron', 'tools', 'scripts', 'tests', 'deploy', 'android', 'public'];
const ROOT_FILES = ['index.html', 'vite.config.js', 'package.json', 'vercel.json', 'capacitor.config.json'];
const SKIP_DIRS = new Set(['node_modules', 'dist', 'dist-ssr', 'release', 'reports', 'scratch', 'media_storage', '.git', '.vercel', '.opencode', '.gradle', 'build']);
const EXT = new Set(['.js', '.mjs', '.cjs', '.json', '.html', '.java', '.kt', '.ts', '.yml', '.yaml', '.sh', '.py', '.cjs']);

// Kural listesi: [ad, regex, risk notu]
const RULES = [
  ['sir-atama', /\b(session|token|secret|api[_-]?key|client[_-]?key|access[_-]?key|authorization|bearer|password|sifre|parola)[a-zA-Z0-9_-]*\s*[:=]\s*['"]([A-Za-z0-9_\-.+/=]{12,})['"]/i, 'sabit kodlu anahtar/oturum'],
  ['hex-anahtar', /['"][0-9a-f]{32,}['"]/i, 'uzun hex anahtar/imza (API anahtarı olabilir)'],
  ['oturum-baslik', /['"]user-session['"]\s*:\s*['"][A-Za-z0-9_\-.]{16,}['"]/i, 'canlı hesap oturum çerezi'],
  ['worker-relay', /https?:\/\/[a-z0-9-]+(\.[a-z0-9-]+)*\.(workers\.dev|workers\.dev)\b/i, 'Cloudflare Worker relay adresi (kendi worker’ın bile olsa env’e taşı)'],
  ['ucuncu-taraf-liste', /raw\.githubusercontent\.com\/(?!caca1403\/)[A-Za-z0-9-]+\//i, 'başkasının deposundan adres listesi/veri (tedarik zinciri riski)'],
  ['telefon', /\b0?5[0-9]{9}\b/, 'T.C. mobil telefon numarası izi'],
  ['eposta', /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.(com|net|org|dev|io|xyz|me|co)\b/, 'e-posta izi (hesap sahibi olabilir)'],
  ['der-blob', /['"][A-Za-z0-9+/=]{300,}['"]/, 'uzun base64/DER bloğu (sertifika/imza)'],
  ['vercel-canli', /process\.env\.[A-Z_]*(KEY|TOKEN|SECRET)[A-Z_]*\s*(\|\||\?{2,3})\s*['"][A-Za-z0-9_\-.]{16,}/, 'env fallback’inde gömülü canlı anahtar'],
  // PEM/PKCS#8 özel anahtar gövdesi önekleri parçalarla kurulur (tarayıcı kendini işaretlemesin)
  ['priv-key', new RegExp(['MIIE', 'vQ|MIIE', 'vg|MIIC', 'dg|LS0tLS1CRU', 'dJTi'].join('') + '|MII[A-Za-z0-9]{20,}IBADANBgk'), 'GÖMÜLÜ ÖZEL ANAHTAR (PKCS#8/PEM gövdesi) — KRİTİK'],
];
// E-posta kuralının bilinen zararsız eşleşmeleri (kütüphane/standart/hizmet adları)
const EMAIL_OK = /(example\.com|sentry|w3\.org|schema\.org|npmjs|github|@types|@license|@param|@author|@vue|@vitejs|@capacitor|@remotion|@openchamber|pixeldrain)/i;
// Depoya girmeyen derleme çıktısı: kural gürültüsü yerine kaynak temizlenir
const BUILD_ART = /[\\/]assets[\\/]public[\\/]/;

function* walk(dir) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) yield* walk(full);
    } else if (EXT.has(path.extname(e.name)) || e.name === 'Dockerfile.mkv-relay') {
      yield full;
    }
  }
}

const files = [];
for (const d of SCAN_DIRS) {
  const abs = path.join(ROOT, d);
  try { if (statSync(abs).isDirectory()) files.push(...walk(abs)); } catch {}
}
for (const f of ROOT_FILES) {
  try { if (statSync(path.join(ROOT, f)).isFile()) files.push(path.join(ROOT, f)); } catch {}
}
// .env* dosyaları: değerleri tarama (güvenli liman) ama .env.example değer içeremez
for (const f of readdirSync(ROOT).filter(n => n.startsWith('.env') && n !== '.env.example')) {
  const idx = files.indexOf(path.join(ROOT, f));
  if (idx >= 0) files.splice(idx, 1);
}

const findings = [];
for (const file of files) {
  const rel = path.relative(ROOT, file);
  if (rel === '.env.example' || rel.startsWith('.vercel') || BUILD_ART.test(rel)) continue;
  let text;
  try { text = readFileSync(file, 'utf8'); } catch { continue; }
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('gizli-tara:allow')) continue;
    // env'den okuma satırları temizdir (import.meta.env / process.env + boş fallback)
    for (const [name, re, note] of RULES) {
      const m = line.match(re);
      if (!m) continue;
      if (name === 'eposta' && EMAIL_OK.test(line)) continue;
      if (name === 'sir-atama') {
        const val = m[2] || '';
        // Depolama anahtarı adları ('cinepulse_trakt_token') düşük entropilidir: rakam yoksa atla
        if (!/[0-9]/.test(val) && !/^[A-Fa-f0-9]{16,}$/.test(val)) continue;
      }
      if ((name === 'sir-atama' || name === 'vercel-canli') && /import\.meta\.env|process\.env\.[A-Z_]+\s*(\|\|\s*['"]['"]|\?\?)/.test(line) && !/['"][A-Za-z0-9_\-.]{20,}['"]/.test(line.replace(/https?:\/\/\S+/g, ''))) continue;
      const sample = m[0].slice(0, 70) + (m[0].length > 70 ? '…' : '');
      findings.push(`${rel}:${i + 1}  [${name}]  ${sample}  → ${note}`);
    }
  }
}

// .env.example değer içermemeli (ad sözlüğü olmalı)
try {
  const ex = readFileSync(path.join(ROOT, '.env.example'), 'utf8');
  for (const [i, line] of ex.split('\n').entries()) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(\S+)/);
    if (m) findings.push(`.env.example:${i + 1}  [env-example-deger]  ${m[1]}=…  → örnekte DEĞER yazılmaz, ad yeterlidir`);
  }
} catch {}

if (findings.length === 0) {
  console.log('gizli-tara: TEMIZ — sır/iz yok. Push edilebilir.');
  process.exit(0);
}
console.error(`gizli-tara: ${findings.length} SIR/IZ BULUNDU — PUSH YAPMA:`);
for (const f of findings) console.error('  ' + f);
console.error('Not: giderilemezse satıra `// gizli-tara:allow` yorumu ekle (bilinçli istisna).');
process.exit(1);
