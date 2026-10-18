#!/usr/bin/env node
/* Telefondaki CinePulse WebView'ına Chrome DevTools Protocol ile bağlanır.
   Böylece uygulamayı elle kullanmadan, uygulamanın KENDİ kodunu cihazda
   çalıştırıp gerçek cevapları alabiliyoruz (sorgu + ekran görüntüsü).

   Kullanım:
     node tools/cihaz-cdp.mjs "<js ifadesi>"            → sonucu JSON yazdırır
     node tools/cihaz-cdp.mjs dosya.js                  → dosyadaki ifadeyi çalıştırır
   Ortam:
     CINEPULSE_PKG   hedef paket (varsayılan com.cinepulse.studio.devtest)
*/
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ADB = '/home/cagatay/android-sdk/platform-tools/adb';
const PKG = process.env.CINEPULSE_PKG || 'com.cinepulse.studio.devtest';
const PORT = +(process.env.CINEPULSE_CDP_PORT || 9333);

const adb = (...a) => execSync(`${ADB} ${a.join(' ')}`, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();

/* ws modülünü pnpm deposundan bul (doğrudan bağımlılık değil) */
function wsYukle() {
  const require = createRequire(KOK + '/package.json');
  try { return require('ws'); } catch (_) {}
  const { execSync: ex } = require('node:child_process');
  const dizin = ex("ls -d node_modules/.pnpm/ws@*/node_modules/ws 2>/dev/null | head -1", { cwd: KOK, encoding: 'utf8' }).trim();
  if (!dizin) throw new Error('ws bulunamadi');
  return require(path.resolve(KOK, dizin));
}

export async function cdpAc({ port = PORT, pkg = PKG } = {}) {
  const pid = adb('shell', `pidof ${pkg}`).split(/\s+/)[0];
  if (!pid) throw new Error(`${pkg} calismiyor`);
  try { adb('forward', '--remove', `tcp:${port}`); } catch (_) {}
  adb('forward', `tcp:${port}`, `localabstract:webview_devtools_remote_${pid}`);
  const liste = JSON.parse(execSync(`curl -s http://127.0.0.1:${port}/json/list`, { encoding: 'utf8' }));
  // Ana uygulama kabuğunu seç — sayfa-embed kaynaklar açıkken ikinci bir
  // `page` hedefi (iframe) olabilir; onu asla seçmemeliyiz.
  const hedef = liste.find(t => t.type === 'page' && /^https:\/\/localhost\/?/.test(t.url) && t.webSocketDebuggerUrl)
    || liste.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
  if (!hedef) throw new Error('sayfa hedefi yok: ' + JSON.stringify(liste.map(t => t.type + ':' + t.url)));
  const WebSocket = wsYukle();
  const soket = new WebSocket(hedef.webSocketDebuggerUrl, { perMessageDeflate: false, maxPayload: 256 * 1024 * 1024 });
  await new Promise((c, h) => { soket.once('open', c); soket.once('error', h); });
  let id = 0;
  const bekleyen = new Map();
  const olaylar = [];
  soket.on('message', ham => {
    const m = JSON.parse(ham.toString());
    if (m.id && bekleyen.has(m.id)) { bekleyen.get(m.id)(m); bekleyen.delete(m.id); }
    else if (m.method) olaylar.push(m);
  });
  // `sure`: beklenen yanıt için üst sınır. Uzun JS işleri (örn. provider
  // taraması ~90 sn) 15 sn'lik varsayılanla "zaman asimi" yiyordu.
  const gonder = (method, params = {}, sure = 15000) => new Promise((c, h) => {
    const i = ++id;
    const timer = setTimeout(() => { if (bekleyen.has(i)) { bekleyen.delete(i); h(new Error(method + ' zaman asim')); } }, sure);
    bekleyen.set(i, m => {
      clearTimeout(timer);
      if (m.error) h(new Error(method + ': ' + JSON.stringify(m.error)));
      else c(m.result);
    });
    soket.send(JSON.stringify({ id: i, method, params }));
  });
  return {
    gonder,
    olaylar,
    soket,
    /** JS ifadesini uygulama sayfasında çalıştırır, değeri döndürür. */
    async calistir(ifade, { bekle = true } = {}) {
      const r = await gonder('Runtime.evaluate', {
        expression: `(async()=>{ try { return JSON.stringify(await (${ifade})); } catch(e) { return JSON.stringify({__hata: String(e && e.stack || e)}); } })()`,
        awaitPromise: true, returnByValue: true, timeout: 600000
      }, 300000);
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' ' + (r.exceptionDetails.exception?.description || ''));
      const ham = r.result?.value;
      try { return typeof ham === 'string' ? JSON.parse(ham) : ham; } catch (_) { return ham; }
    },
    async ekranGornu(url, dosya) {
      const fs = await import('node:fs');
      fs.writeFileSync(dosya, execSync(`${ADB} exec-out screencap -p`, { maxBuffer: 64 * 1024 * 1024 }));
      return dosya;
    },
    kapat: () => soket.close()
  };
}

/* CLI — yol Türkçe karakter içerdiği için URL'ye çevirmek gerekir */
if (import.meta.url === (await import('node:url')).pathToFileURL(process.argv[1]).href) {
  const arg = process.argv[2];
  if (!arg) { console.error('kullanım: node tools/cihaz-cdp.mjs "<js>" | dosya.js'); process.exit(1); }
  /* DOSYA MI YOKSA SATIR İÇİ İFADE Mİ? Eskiden yalnız ".js" ile biten argüman
     dosya sayılıyordu; ".mjs" uzantılı yoklama dosyaları ifade sanılıp CDP'ye
     gidiyor ve "Invalid regular expression flags" hatası veriyordu (/tmp/...
     bir regex literalı gibi ayrışıyor). Var olmayan bir yolu da anlaşılır
     biçimde reddet. */
  const dosyaMi = /\.(js|mjs|cjs)$/.test(arg) && existsSync(arg);
  if (/\.(js|mjs|cjs)$/.test(arg) && !existsSync(arg) && !arg.includes('(')) {
    console.error(`kullanım: dosya bulunamadı -> ${arg}`);
    process.exit(1);
  }
  const ifade = dosyaMi ? readFileSync(arg, 'utf8') : arg;
  const c = await cdpAc();
  try {
    const sonuc = await c.calistir(ifade);
    console.log(typeof sonuc === 'string' ? sonuc : JSON.stringify(sonuc, null, 2));
  } finally { c.kapat(); }
}
