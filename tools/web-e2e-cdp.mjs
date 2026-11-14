#!/usr/bin/env node
/* ==========================================================================
   WEB E2E — gerçek uygulamada yıldız arşivi + oynatma testi (CDP)
   --------------------------------------------------------------------------
   Neden ayrı bir "akış doğrulama" yerine GERÇEK UYGULAMA:
   Çekirdeklerin döndürdüğü akış URL'leri hamdır (token + Referer + çerez
   gerekir). Bunları tek başına curl'lemek 403/503 verir ve "akış yok" gibi
   YANLIŞ sonuç üretir. Üretim zinciri (vekil.js → köprü → headers) ancak
   uygulamanın içinden doğru çalışır.

   Bu araç:
     1) Electron'u (Chromium) CDP portuyla açar, üretim web build'ini yükler
     2) Uygulamanın KENDİ modüllerini sayfa içinde çağırır:
          · getStreamingServersProgressive(...)  → gerçek kaynak listesi
          · dublajZekasi.dublajaGoreSirala(...)  → sıralama gerçekten uygulandı mı
     3) Her başlık için sonucu toplar ve JSON yazar.

   Kullanım:
     node tools/web-e2e-cdp.mjs --limit 30
     node tools/web-e2e-cdp.mjs --limit 5 --url http://127.0.0.1:4173/
   ========================================================================== */
import { spawn } from 'node:child_process';
import { writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function arg(ad, varsayilan) {
  const i = process.argv.indexOf(ad);
  return i > -1 && process.argv[i + 1] !== undefined ? process.argv[i + 1] : varsayilan;
}

const URL_HEDEF = arg('--url', 'http://127.0.0.1:4173/');
const LIMIT = Number(arg('--limit', '30'));
const CIKTI = path.resolve(KOK, arg('--cikti', 'notlar/web-e2e-sonuc.json'));
const CDP_PORT = Number(arg('--port', '9333'));

/* Başlık listesi — yildiz-e2e-test.mjs ile aynı 30 içerik. */
const BASLIKLAR = [
  { tip: 'movie', id: '550', ad: 'Fight Club' },
  { tip: 'movie', id: '27205', ad: 'Inception' },
  { tip: 'movie', id: '157336', ad: 'Interstellar' },
  { tip: 'movie', id: '155', ad: 'The Dark Knight' },
  { tip: 'movie', id: '680', ad: 'Pulp Fiction' },
  { tip: 'movie', id: '603', ad: 'The Matrix' },
  { tip: 'movie', id: '13', ad: 'Forrest Gump' },
  { tip: 'movie', id: '238', ad: 'The Godfather' },
  { tip: 'movie', id: '424', ad: "Schindler's List" },
  { tip: 'movie', id: '98', ad: 'Gladiator' },
  { tip: 'movie', id: '299534', ad: 'Avengers: Endgame' },
  { tip: 'movie', id: '299536', ad: 'Avengers: Infinity War' },
  { tip: 'movie', id: '24428', ad: 'The Avengers' },
  { tip: 'movie', id: '76341', ad: 'Mad Max: Fury Road' },
  { tip: 'movie', id: '597', ad: 'Titanic' },
  { tip: 'movie', id: '862', ad: 'Toy Story' },
  { tip: 'movie', id: '76600', ad: 'Avatar: The Way of Water' },
  { tip: 'movie', id: '569094', ad: 'Across the Spider-Verse' },
  { tip: 'tv', id: '1399', sezon: 1, bolum: 1, ad: 'Game of Thrones' },
  { tip: 'tv', id: '1396', sezon: 1, bolum: 1, ad: 'Breaking Bad' },
  { tip: 'tv', id: '66732', sezon: 1, bolum: 1, ad: 'Stranger Things' },
  { tip: 'tv', id: '60625', sezon: 1, bolum: 1, ad: 'Rick and Morty' },
  { tip: 'tv', id: '456', sezon: 1, bolum: 1, ad: 'The Simpsons' },
  { tip: 'tv', id: '71446', sezon: 1, bolum: 1, ad: 'Money Heist' },
  { tip: 'tv', id: '82856', sezon: 1, bolum: 1, ad: 'The Mandalorian' },
  { tip: 'tv', id: '87108', sezon: 1, bolum: 1, ad: 'Chernobyl' },
  { tip: 'tv', id: '63174', sezon: 1, bolum: 1, ad: 'Lucifer' },
  { tip: 'tv', id: '1416', sezon: 1, bolum: 1, ad: "Grey's Anatomy" },
  { tip: 'tv', id: '1668', sezon: 1, bolum: 1, ad: 'Friends' },
  { tip: 'tv', id: '46648', sezon: 1, bolum: 1, ad: 'True Detective' },
];

/* ── Minimal CDP istemcisi (bağımlılıksız) ────────────────────────────────── */

async function cdpHedefleri() {
  const y = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`, { signal: AbortSignal.timeout(5000) });
  if (!y.ok) throw new Error(`CDP liste ${y.status}`);
  return y.json();
}

async function cdpBaglan(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((coz, red) => {
    ws.addEventListener('open', coz, { once: true });
    ws.addEventListener('error', red, { once: true });
    setTimeout(() => red(new Error('CDP bağlantı zaman aşımı')), 10000);
  });
  let id = 0;
  const bekleyen = new Map();
  ws.addEventListener('message', (olay) => {
    let m;
    try { m = JSON.parse(olay.data); } catch (_) { return; }
    if (m.id && bekleyen.has(m.id)) {
      const { coz, red } = bekleyen.get(m.id);
      bekleyen.delete(m.id);
      if (m.error) red(new Error(JSON.stringify(m.error)));
      else coz(m.result);
    }
  });
  const gonder = (method, params = {}) => new Promise((coz, red) => {
    id += 1;
    bekleyen.set(id, { coz, red });
    ws.send(JSON.stringify({ id, method, params }));
    setTimeout(() => {
      if (bekleyen.has(id)) { bekleyen.delete(id); red(new Error(`${method} zaman aşımı`)); }
    }, 120000);
  });
  return { ws, gonder };
}

/* ── Electron harness (uygulamayı CDP ile açan minik main) ────────────────── */

const HARNESS = path.join(KOK, 'tools/.web-e2e-electron.cjs');

function harnessYaz() {
  const icerik = `
const { app, BrowserWindow } = require('electron');
const hedef = process.env.CP_E2E_URL || 'http://127.0.0.1:4173/';
app.commandLine.appendSwitch('remote-debugging-port', process.env.CP_E2E_PORT || '9333');
app.commandLine.appendSwitch('remote-allow-origins', '*');
app.disableHardwareAcceleration();
app.whenReady().then(() => {
  const w = new BrowserWindow({
    width: 1400, height: 900, show: false,
    webPreferences: { nodeIntegration: false, contextIsolation: true, webSecurity: false },
  });
  w.loadURL(hedef);
  w.webContents.on('did-finish-load', () => console.log('E2E-SAYFA-YUKLENDI'));
});
app.on('window-all-closed', () => app.quit());
`;
  writeFileSync(HARNESS, icerik, 'utf8');
  return HARNESS;
}

async function electronBaslat() {
  const electronBin = path.join(KOK, 'node_modules/electron/dist/electron');
  if (!existsSync(electronBin)) throw new Error('electron binary yok');
  const cocuk = spawn(electronBin, [
    path.join(KOK, 'electron/main.cjs'),
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-allow-origins=*',
    '--cinepulse-software-gl',
  ], {
    cwd: KOK,
    env: {
      ...process.env,
      ELECTRON_DISABLE_SECURITY_WARNINGS: '1',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  cocuk.stderr.on('data', (d) => {
    const s = String(d);
    if (/error|Error/.test(s) && !/GPU|Fontconfig|dbus|libva|Vulkan/.test(s)) process.stderr.write(`[electron] ${s.slice(0, 300)}\n`);
  });
  // CDP hazır olana kadar bekle (ana pencere: file:// veya localhost).
  for (let i = 0; i < 60; i += 1) {
    try {
      const hedefler = await cdpHedefleri();
      const sayfa = hedefler.find((t) => t.type === 'page' && /index\.html|127\.0\.0\.1/.test(t.url) && t.webSocketDebuggerUrl);
      if (sayfa) return { cocuk, sayfa };
    } catch (_) { /* bekle */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  cocuk.kill('SIGKILL');
  throw new Error('Electron CDP hedefi bulunamadı');
}

/* ── Sayfa içi ölçüm betiği ───────────────────────────────────────────────── */

/**
 * Sayfada çalışır. Modülleri Vite'ın ürettiği chunk'lardan bulmak yerine
 * uygulamanın zaten yüklediği global kancaları kullanır. Bulunamazsa
 * dinamik import ile chunk'ı arar (dist/assets/*.js).
 */
const TEK_BASLIK_BETIGI = (b) => `(async () => {
  const kayit = {
    tmdbTip: ${JSON.stringify(b.tip)}, tmdbId: ${JSON.stringify(String(b.id))}, ad: ${JSON.stringify(b.ad)},
    sezon: ${JSON.stringify(b.sezon ?? null)}, bolum: ${JSON.stringify(b.bolum ?? null)},
  };
  try {
    const r = await window.__cpYildizTara({
      baslik: ${JSON.stringify(b.ad)},
      orijinalBaslik: ${JSON.stringify(b.ad)},
      tmdbTip: ${JSON.stringify(b.tip)},
      tmdbId: ${JSON.stringify(String(b.id))},
      sezon: ${JSON.stringify(b.sezon ?? null)},
      bolum: ${JSON.stringify(b.bolum ?? null)},
    });
    const durum = typeof window.__cpDublajDurum === 'function'
      ? window.__cpDublajDurum({
          tmdbTip: ${JSON.stringify(b.tip)}, tmdbId: ${JSON.stringify(String(b.id))},
          sezon: ${JSON.stringify(b.sezon ?? null)}, bolum: ${JSON.stringify(b.bolum ?? null)},
        })
      : null;
    const eslesmeler = Array.isArray(r?.eslesmeler) ? r.eslesmeler : [];
    kayit.sure = r?.sure ?? null;
    kayit.adaySayisi = r?.adaySayisi ?? 0;
    kayit.eslesenSayisi = r?.eslesenSayisi ?? 0;
    kayit.trDublajEtiketli = eslesmeler.filter((x) => x.dilDurumu === 'dublaj' || /dublaj/i.test(String(x.dilDurumu || ''))).length;
    kayit.kaynakDurumu = r?.kaynakDurumu || {};
    kayit.kaynaklar = eslesmeler.map((x) => ({ kaynak: x.kaynak, dilDurumu: x.dilDurumu, skor: x.skor }));
    kayit.ipucuSayisi = durum?.kaynaklar?.length ?? 0;
    kayit.basarili = kayit.eslesenSayisi > 0;
    if (r?.hata) kayit.hata = r.hata;
  } catch (hata) {
    kayit.hata = String(hata?.message || hata).slice(0, 160);
    kayit.basarili = false;
  }
  return kayit;
})()`;

async function main() {
  console.log(`web E2E: ${Math.min(LIMIT, BASLIKLAR.length)} başlık · hedef ${URL_HEDEF}`);
  const { cocuk, sayfa } = await electronBaslat();
  const { ws, gonder } = await cdpBaglan(sayfa.webSocketDebuggerUrl);
  try {
    await gonder('Runtime.enable');
    await gonder('Page.enable');

    // Uygulama açılışı ve kanca kurulumu tamamlansın.
    await new Promise((r) => setTimeout(r, 4000));

    const kancaKontrol = await gonder('Runtime.evaluate', {
      expression: `({ yildiz: typeof window.__cpYildizTara, sweep: typeof window.__cpSweep, tohum: typeof window.__cpTohumYukle, durum: typeof window.__cpDublajDurum })`,
      returnByValue: true,
    });
    console.log('kanca kontrolü:', JSON.stringify(kancaKontrol.result?.value));

    const tohumRes = await gonder('Runtime.evaluate', {
      expression: `typeof window.__cpTohumYukle === 'function' ? window.__cpTohumYukle() : null`,
      awaitPromise: true,
      returnByValue: true,
    });
    const tohumYuklenen = tohumRes.result?.value?.yuklenen ?? null;

    const hedefler = BASLIKLAR.slice(0, LIMIT);
    const sonuclar = [];
    for (const b of hedefler) {
      const r = await gonder('Runtime.evaluate', {
        expression: TEK_BASLIK_BETIGI(b),
        awaitPromise: true,
        returnByValue: true,
        timeout: 60000,
      });
      if (r.exceptionDetails) {
        sonuclar.push({ tmdbTip: b.tip, tmdbId: String(b.id), ad: b.ad, basarili: false, hata: JSON.stringify(r.exceptionDetails).slice(0, 200) });
      } else {
        const s = { ...(r.result?.value || {}), tohumYuklenen };
        sonuclar.push(s);
        const ks = Object.entries(s.kaynakDurumu || {}).map(([k, v]) => `${k.replace('star:', '')}:${v.adet ?? 0}${v.hata ? '!' : ''}`).join(' ');
        console.log(`  ${String(s.ad).padEnd(26)} es=${String(s.eslesenSayisi ?? '-').padStart(2)} tr=${String(s.trDublajEtiketli ?? '-').padStart(2)} ${s.sure ?? '-'}ms [${ks}]`);
      }
    }
    const ozet = {
      tarih: new Date().toISOString(),
      hedef: URL_HEDEF,
      baslikSayisi: sonuclar.length,
      kaynakBulunan: sonuclar.filter((s) => s.basarili).length,
      hataOlan: sonuclar.filter((s) => s.hata).length,
      trDublajEtiketliOlan: sonuclar.filter((s) => (s.trDublajEtiketli || 0) > 0).length,
      toplamEslesme: sonuclar.reduce((t, s) => t + (s.eslesenSayisi || 0), 0),
    };
    writeFileSync(CIKTI, `${JSON.stringify({ ozet, sonuclar }, null, 1)}\n`, 'utf8');
    console.log(`\nÖZET: ${ozet.kaynakBulunan}/${ozet.baslikSayisi} başlıkta eşleşme · trDublaj=${ozet.trDublajEtiketliOlan} · hata=${ozet.hataOlan} · toplam ${ozet.toplamEslesme} eşleşme`);
    for (const s of sonuclar) {
      console.log(`  ${String(s.ad).padEnd(26)} es=${String(s.eslesenSayisi ?? '-').padStart(2)} tr=${String(s.trDublajEtiketli ?? '-').padStart(2)} ipucu=${String(s.ipucuSayisi ?? '-').padStart(2)} ${s.sure ?? '-'}ms ${s.hata ? 'HATA: ' + s.hata : ''}`);
    }
    console.log(`\nçıktı: ${path.relative(KOK, CIKTI)}`);
  } finally {
    try { ws.close(); } catch (_) {}
    try { cocuk.kill('SIGKILL'); } catch (_) {}
  }
}

main().catch((h) => { console.error('WEB E2E ÇÖKTÜ:', h.message || h); process.exitCode = 1; });
