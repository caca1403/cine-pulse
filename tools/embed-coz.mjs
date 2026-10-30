/* closeload/filmmakinesi embed çözücü: kod Metin'den qy1 türü çözücüyü ayıklar,
   sanal makinede koşturur ve jwplayer 'sources:[{file: X}]' değerini üretir.
   Ağ YOK; yalnız yerel metin çözme. */
import fs from 'node:fs';
import vm from 'node:vm';

const dosya = process.argv[2] || '/tmp/fm-embed.html';
const html = fs.readFileSync(dosya, 'utf8');

function kapanisBul(metin, acilisIndex) {
  let d = 0, j = metin.indexOf('{', acilisIndex);
  for (; j < metin.length; j++) {
    if (metin[j] === '{') d++;
    else if (metin[j] === '}') { d--; if (d === 0) return j; }
  }
  return -1;
}

/* 1) sources dosya değişkeni ve onu üreten çözücü adı */
const kaynak = html.match(/sources:\s*\[\{file:\s*(\w+)/);
if (!kaynak) { console.log(JSON.stringify({ ok: false, hata: 'sources-yok' })); process.exit(0); }
const degisken = kaynak[1];
const tanimRe = new RegExp(`(?:var\\s+)?${degisken}\\s*=\\s*(\\w+)\\(([\\s\\S]*?)\\);`, 'm');
const tanim = html.match(tanimRe);
if (!tanim) { console.log(JSON.stringify({ ok: false, hata: 'tanim-yok', degisken })); process.exit(0); }
const cozucuAd = tanim[1];

/* 2) O çözücünün tanımı — iki biçim: `function ad(` veya `var ad = function (`
   (sayfa ikisini de kullanıyor; dosyada birden çok çözücü var, adı eşlenir) */
let cozucuKod = null, fnIndex = -1;
for (const kalip of [`function\\s+${cozucuAd}\\s*\\(`, `${cozucuAd}\\s*=\\s*function\\s*\\(`]) {
  const mm = new RegExp(kalip, 'g').exec(html);
  if (mm) { fnIndex = mm.index; break; }
}
if (fnIndex < 0) { console.log(JSON.stringify({ ok: false, hata: 'cozucu-fonksiyon-yok', cozucuAd })); process.exit(0); }
const bit = kapanisBul(html, fnIndex);
cozucuKod = html.slice(fnIndex, bit + 1);
if (!cozucuKod.includes('charCodeAt')) { console.log(JSON.stringify({ ok: false, hata: 'cozucu-govdesi-beklenmedik' })); process.exit(0); }

const betik = `${cozucuKod}\n; sonuc = ${cozucuAd}(${tanim[2]});`;
const ctx = {
  console: { log() {}, warn() {}, error() {} },
  atob: (s) => Buffer.from(String(s), 'base64').toString('binary'),
  btoa: (s) => Buffer.from(String(s), 'binary').toString('base64'),
  String, Number, Math, RegExp, Array, Object, JSON,
};
// Çözücü kimi zaman window/globalThis üzerinden yardımcı çağırır; tarayıcı
// ortamı taklit edilir (ağ ve DOM YOK).
// ÖNEMLİ: bu ailedeki çözücü anahtarı `window.location.hostname`e bağlıyor —
// yanlış host verilirse çıktı bozuk olur. Host, embed adresinden türetilir.
let host = 'closeload.filmmakinesi.to';
for (const arg of process.argv.slice(3)) {
  const m = arg.match(/^--host=(.+)$/);
  if (m) host = m[1];
}
ctx.window = ctx;
ctx.self = ctx;
ctx.location = { hostname: host, host, origin: `https://${host}`, protocol: 'https:', href: `https://${host}/` };
ctx.document = { createElement: () => ({ style: {}, setAttribute() {}, appendChild() {} }) };
ctx.navigator = { userAgent: 'Mozilla/5.0' };
ctx.globalThis = ctx;
try {
  vm.createContext(ctx);
  vm.runInContext(betik, ctx, { timeout: 5000 });
  const url = String(ctx.sonuc || '');
  console.log(JSON.stringify({ ok: /^https?:/.test(url), url, cozucu: cozucuAd, degisken }));
} catch (e) {
  console.log(JSON.stringify({ ok: false, hata: String(e.message).slice(0, 200) }));
}
