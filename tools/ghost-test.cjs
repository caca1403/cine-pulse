/* Masaüstü gizli WebView'ın Cloudflare'ı gerçekten çözüp çözmediğini ölçer.
   Electron ana süreçte çalışır (köprü orada yaşar).

   Kullanım:
     /usr/bin/cinepulse-studio  (uygulama açıkken)
     node tools/ghost-test.cjs  (main.cjs içinden çağrılır)            */

const { app, BrowserWindow, ipcMain } = require('electron');

const HEDEFLER = [
  'https://www.setfilmizle.uk/',
  'https://setfilmizle.uk/',
  'https://selcukflix.app/',
  'https://www.hdfilmcehennemi.nl/',
  'https://filmekseni.top/',
  'https://filmmakinesi.to/',
  'https://dizi77.life/',
  'https://www.sinemacc.com/'
];

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function engelMi(govde) {
  const g = String(govde || '');
  // BOS GOVDE BASARILI SAYILMAZDI: setfilmizle 0 bayt dondu ama test
  // 'cozuldu' yazdi. Sayfa en azindan gercek icerik uremeli.
  if (g.length < 1200) return true;
  const ilk = g.slice(0, 4000).toLowerCase();
  return ilk.includes('just a moment') || ilk.includes('attention required')
      || ilk.includes('cf-browser-verification') || ilk.includes('checking your browser');
}

function coz(pencere, url, ms) {
  return new Promise((cozucu) => {
    let bitti = false;
    const bitir = (sonuc) => { if (!bitti) { bitti = true; clearTimeout(z); cozucu(sonuc); } };
    const c = pencere.webContents;
    const temizle = () => {
      c.removeListener('did-finish-load', y);
      c.removeListener('did-stop-loading', y);
    };
    const y = async () => {
      // Challenge birkaç saniye daha çalışabiliyor
      const bekle = new Promise((r) => setTimeout(r, 3500));
      await bekle;
      temizle();
      try {
        const html = await c.executeJavaScript('document.documentElement.outerHTML');
        const text = await c.executeJavaScript('document.body ? document.body.innerText : ""');
        bitir({ ok: true, html: html || '', text: text || '', finalUrl: c.getURL() });
      } catch (e) { bitir({ ok: false, error: String(e.message).slice(0, 90) }); }
    };
    const z = setTimeout(() => { temizle(); bitir({ ok: false, error: 'zaman aşımı' }); }, ms);
    c.on('did-finish-load', y);
    c.on('did-stop-loading', y);
    c.loadURL(url).catch((e) => { temizle(); bitir({ ok: false, error: String(e.message).slice(0, 90) }); });
  });
}

app.whenReady().then(async () => {
  // Pencere kapanınca Electron uygulamayı kapatıyordu; ölçüm yarıda
  // kalıyordu. Kapatma davranışını geçici olarak devre dışı bırak.
  const kapatmaEngelle = () => {};
  app.on('window-all-closed', kapatmaEngelle);

  const sonuclar = [];
  for (const url of HEDEFLER) {
    const w = new BrowserWindow({
      show: false, width: 1280, height: 800,
      webPreferences: { partition: 'persist:ghost-test', images: false, javascript: true }
    });
    w.webContents.setUserAgent(UA);
    w.webContents.session.webRequest.onBeforeRequest((d, cb) => {
      const u = (d.url || '').toLowerCase();
      if (/\.(mp4|m3u8|mpd|ts|webm)(\?|$)/.test(u) || d.resourceType === 'media') return cb({ cancel: true });
      cb({});
    });
    const t = Date.now();
    const r = await coz(w, url, 25000);
    const govde = r.html || '';
    const engel = engelMi(govde);
    const baslik = (govde.match(/<title[^>]*>([^<]*)/i) || [])[1] || '';
    console.log(`  ${engel ? '✗ ENGELDE' : '✓ ÇÖZÜLDÜ'}  ${url.padEnd(32)} ${(govde.length + 'B').padStart(8)} ${(Date.now() - t + 'ms').padStart(7)}  ${baslik.slice(0, 34)}`);
    sonuclar.push({ url, engel, boyut: govde.length, baslik });
    w.destroy();
    await new Promise((r2) => setTimeout(r2, 600));
  }
  const gecen = sonuclar.filter((s) => !s.engel).length;
  console.log(`\nSONUÇ: ${gecen}/${sonuclar.length} site gizli WebView ile açıldı`);
  app.exit(0);
});