#!/usr/bin/env node
/* ==========================================================================
   YEREL OYNATICI DOĞRULAMA — arayüz seviyesinde oyuncu açılışı + dil menüsü
   --------------------------------------------------------------------------
   yerel-dogrula.mjs veri katmanını (tarama + iz çapraz denetimi) ölçer; bu
   araç ARAYÜZÜ ölçer: detay sayfasından OYNAT'a basmak oynatıcıyı gerçekten
   açıyor mu (KAYNAKLAR sekmesi kaldırıldı — buton doğrudan oynatıcıyı açmalı),
   oynatıcı içinde dil menüsü (sesTipiBul etiketleri) görünüyor mu, ve açılış
   boyunca hiç sayfa hatası (ReferenceError vb.) çıkıyor mu?

   Kapanıştaki closure kapsam hataları (videoEl) yalnız GERÇEK tıklama
   akışında ortaya çıkar — birim testleri PlayerModal kapanışını koşamaz.

   Kullanım: node tools/yerel-oynatici-dogrula.mjs [--url http://127.0.0.1:3000/]
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
const URL_HEDEF = arg('--url', 'http://127.0.0.1:3000/');
const CDP_PORT = Number(arg('--port', '9345'));

const VAKALAR = [
  { yol: '#detail/tv/1399', ad: 'Game of Thrones', beklenenDil: true },
  { yol: '#detail/movie/550', ad: 'Fight Club', beklenenDil: true },
];

/* ── Minimal CDP istemcisi ─────────────────────────────────────────────────── */
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
  const olaylar = [];
  const saglayiciNotlari = [];
  ws.addEventListener('message', (olay) => {
    let m;
    try { m = JSON.parse(olay.data); } catch (_) { return; }
    if (m.id && bekleyen.has(m.id)) {
      const { coz, red } = bekleyen.get(m.id);
      bekleyen.delete(m.id);
      if (m.error) red(new Error(JSON.stringify(m.error)));
      else coz(m.result);
      return;
    }
    if (m.method === 'Runtime.exceptionThrown') {
      const d = m.params.exceptionDetails;
      olaylar.push('EXCEPTION: ' + String(d.exception?.description || d.text || '').slice(0, 300));
    }
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
      const metin = (m.params.args || []).map(a => a.value || a.description || '').join(' ').slice(0, 300);
      /* Sağlayıcı çekirdekleri kendi ağ/parsing hatalarını bilinçli loglar
         ("[Constantine] Hata: ..." gibi) — bunlar UYGULAMA hatası değil saha
         gürültüsüdür. Yalnız yakalanmamış JS hataları (Uncaught/ReferenceError/
         TypeError/SyntaxError) SERT hata sayılır. */
      const saglayiciGurultusu = /^\[[A-Za-z0-9_-]+\]\s*(Hata|Hata:|Error)/.test(metin)
        && !/Uncaught|ReferenceError|TypeError|SyntaxError/.test(metin);
      if (!saglayiciGurultusu) olaylar.push('console.error: ' + metin);
      else saglayiciNotlari.push(metin);
    }
  });
  const gonder = (method, params = {}, timeoutMs = 120000) => new Promise((coz, red) => {
    id += 1;
    bekleyen.set(id, { coz, red });
    ws.send(JSON.stringify({ id, method, params }));
    setTimeout(() => {
      if (bekleyen.has(id)) { bekleyen.delete(id); red(new Error(`${method} zaman aşımı`)); }
    }, timeoutMs);
  });
  return { ws, gonder, olaylar, saglayiciNotlari };
}

/* ── Electron harness (CDP'li görünmez pencere) ────────────────────────────── */
const HARNESS = path.join(KOK, 'tools/.yerel-oynatici-electron.cjs');
function harnessYaz() {
  writeFileSync(HARNESS, `
const { app, BrowserWindow } = require('electron');
const hedef = process.env.CP_YEREL_URL || 'http://127.0.0.1:3000/';
app.commandLine.appendSwitch('remote-debugging-port', process.env.CP_YEREL_PORT || '9345');
app.commandLine.appendSwitch('remote-allow-origins', '*');
app.disableHardwareAcceleration();
app.whenReady().then(() => {
  const w = new BrowserWindow({
    width: 1280, height: 860, show: false,
    webPreferences: { nodeIntegration: false, contextIsolation: true, webSecurity: false },
  });
  w.loadURL(hedef);
});
app.on('window-all-closed', () => app.quit());
`, 'utf8');
  return HARNESS;
}
async function electronBaslat() {
  const electronBin = path.join(KOK, 'node_modules/electron/dist/electron.exe');
  if (!existsSync(electronBin)) throw new Error('electron.exe yok');
  const cocuk = spawn(electronBin, [harnessYaz()], {
    cwd: KOK,
    env: { ...process.env, ELECTRON_DISABLE_SECURITY_WARNINGS: '1', CP_YEREL_URL: URL_HEDEF, CP_YEREL_PORT: String(CDP_PORT) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  for (let i = 0; i < 90; i += 1) {
    try {
      const hedefler = await cdpHedefleri();
      const sayfa = hedefler.find((t) => t.type === 'page' && /127\.0\.0\.1|localhost/.test(t.url) && t.webSocketDebuggerUrl);
      if (sayfa) return { cocuk, sayfa };
    } catch (_) { /* bekle */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  cocuk.kill('SIGKILL');
  throw new Error('Electron CDP hedefi bulunamadı');
}

const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

async function degerlendir(gonder, ifade) {
  const r = await gonder('Runtime.evaluate', { expression: ifade, returnByValue: true, awaitPromise: true }, 60000);
  if (r.exceptionDetails) return { hata: String(r.exceptionDetails.exception?.description || r.exceptionDetails.text).slice(0, 300) };
  return { deger: r.result?.value };
}

async function main() {
  console.log(`yerel oynatıcı doğrulama: ${URL_HEDEF} · ${VAKALAR.length} vaka`);
  const { cocuk, sayfa } = await electronBaslat();
  const { ws, gonder, olaylar, saglayiciNotlari } = await cdpBaglan(sayfa.webSocketDebuggerUrl);
  const sonuclar = [];
  try {
    await gonder('Runtime.enable', {}, 10000);
    await bekle(5000); // ana paket açılsın

    for (const v of VAKALAR) {
      const kayit = { ad: v.ad, yol: v.yol, sayfaHatasi: olaylar.length };
      // 1) SPA yönlendirmesi: hash rotası (main.js hashchange → route())
      await gonder('Page.navigate', { url: URL_HEDEF.replace(/\/$/, '') + '/' + v.yol }).catch(() => {});
      await bekle(2000);
      // 2) Detay sayfasının OYNAT butonunu bekle ve tıkla (doğrudan oynatıcı akışı)
      const tik = await degerlendir(gonder, `(async () => {
        const beklemek = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (fn()) return true; await new Promise(r => setTimeout(r, 400)); } return false; };
        const SEC = '#btn-play-movie, #btn-resume-series, .dt-oynat';
        const bulundu = await beklemek(() => document.querySelector(SEC), 30000);
        if (!bulundu) return { hata: 'oynat butonu bulunamadi', ozet: (document.body.innerText || '').slice(0, 140) };
        document.querySelector(SEC).click();
        return { tiklandi: true };
      })()`);
      kayit.tiklama = tik.deger || tik.hata;
      // 3) Video elemanını bekle: modal önce yükleyici gösterir, <video> kaynak
      //    çözümünün ardından oluşur (~40-60 sn kademeli tarama).
      const acilma = await degerlendir(gonder, `(async () => {
        const t0 = Date.now();
        let modalGordu = false;
        while (Date.now() - t0 < 90000) {
          if (document.getElementById('player-modal')) modalGordu = true;
          if (document.getElementById('hls-video-player')) return { acildi: modalGordu, videoVar: true, sn: Math.round((Date.now() - t0) / 1000) };
          await new Promise(r => setTimeout(r, 500));
        }
        return { acildi: modalGordu, videoVar: false, sn: 90 };
      })()`);
      kayit.oynatici = acilma.deger || acilma.hata;
      // 4) Dil etiketleri oynatıcı içi kaynak menüsünde (display:none olabilir →
      //    innerText BOŞ döner; textContent kullan). Tarama ~60 sn sürebilir.
      const dil = await degerlendir(gonder, `(async () => {
        const t0 = Date.now();
        const oku = () => {
          const modal = document.getElementById('player-modal') || document.body;
          return modal.textContent || '';
        };
        let metin = oku();
        while (Date.now() - t0 < 75000) {
          if (/Türkçe Dublaj|Orijinal \\+ Altyazı|Özgün/i.test(metin)) break;
          await new Promise(r => setTimeout(r, 2000));
          metin = oku();
        }
        return {
          modalMetri: metin.length,
          dublajEtiket: /Türkçe Dublaj/i.test(metin),
          altyaziEtiket: /Orijinal \\+ Altyazı/i.test(metin),
          ozgunEtiket: /Özgün/i.test(metin),
          kaynakMenuVar: Boolean((document.getElementById('player-modal') || document).querySelector('[id*="smart-source"], .smart-source, #smart-source-trigger')),
        };
      })()`);
      kayit.dilMenusu = dil.deger || dil.hata;
      kayit.yeniSayfaHatasi = olaylar.slice(kayit.sayfaHatasi);
      // Başarı: modal açıldı + en az bir GERÇEK dil etiketi basıldı + JS hatası yok.
      const dilGorundu = Boolean(kayit.dilMenusu?.dublajEtiket || kayit.dilMenusu?.altyaziEtiket || kayit.dilMenusu?.ozgunEtiket);
      kayit.basarili = Boolean(kayit.oynatici?.acildi) && dilGorundu && kayit.yeniSayfaHatasi.length === 0;
      sonuclar.push(kayit);
      console.log(`  ${v.ad}: tıklayış=${JSON.stringify(kayit.tiklama)} oynatıcı=${JSON.stringify(kayit.oynatici)} dil=${JSON.stringify(kayit.dilMenusu)} yeniHata=${kayit.yeniSayfaHatasi.length}`);
      for (const h of kayit.yeniSayfaHatasi.slice(0, 5)) console.log(`    HATA: ${h}`);
    }
    const ozet = {
      tarih: new Date().toISOString(), hedef: URL_HEDEF,
      toplam: sonuclar.length,
      oynaticiAcilan: sonuclar.filter((x) => x.oynatici?.acildi).length,
      hatasiz: sonuclar.filter((x) => x.basarili).length,
      sayfaHatalari: olaylar.slice(0, 20),
      saglayiciNotlari: saglayiciNotlari.slice(0, 10),
    };
    writeFileSync(path.resolve(KOK, 'notlar/yerel-oynatici-sonuc.json'), JSON.stringify({ ozet, sonuclar }, null, 1), 'utf8');
    console.log(`\nÖZET: oynatıcı açılan ${ozet.oynaticiAcilan}/${ozet.toplam} · hatasız vaka ${ozet.hatasiz}/${ozet.toplam} · küresel sayfa hatası ${olaylar.length}`);
    if (ozet.hatasiz < ozet.toplam) process.exitCode = 2;
  } finally {
    try { ws.close(); } catch (_) {}
    try { cocuk.kill('SIGKILL'); } catch (_) {}
  }
}
main().catch((h) => { console.error('YEREL OYNATICI DOĞRULAMA HATASI:', h.message || h); process.exitCode = 1; });
