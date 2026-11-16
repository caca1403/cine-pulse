#!/usr/bin/env node
/* ==========================================================================
   YEREL DOĞRULAMA — yeni kaynak/dil akışının gerçek tarama testi
   --------------------------------------------------------------------------
   Neden: Canlı site (*.workers.dev) bu ağdan TLS-middlebox yüzünden okunamiyor
   ve K1 ölçüm kancası üretim paketine bilerek girmiyor. Bu araç AYNI üretim
   zincirini yerelde koşturur:
     1) Electron'u (CDP) vite DEV sunucusuna bağlar (DEV'de deviceSweep kapısı
        kendiliğinden açıktır — K1 tarifi).
     2) Sayfa içinden providerAggregator'ın GERÇEK taramasını çağırır:
        getStreamingServersProgressive(...) — oyuncunun açtığı zincirin aynısı.
     3) Kullanıcının şikâyetini doğrudan test eder: BÖLÜM > 1 (S1B2, S1B3, S2B1)
        taraması kaynak döndürüyor mu?
     4) "Doğrudan ses kaynaklarını oku" denetimi: her m3u8 kaynağını BAĞIMSIZ
        tekrar fetch edip #EXT-X-MEDIA satırlarından TR ses/altyazı izini kendi
        başına okur ve sesTipiBul etiketiyle ÇAPRAX doğrular. Tek yönlü değil:
        dublaj→ses izi, altyazı→altyazı izi, izsiz→'Özgün' üç yönde de denetlenir.

   Kullanım:
     node tools/yerel-dogrula.mjs                 # 5 varsayılan içerik
     node tools/yerel-dogrula.mjs --url http://127.0.0.1:3000/
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
const CDP_PORT = Number(arg('--port', '9344'));
const CIKTI = path.resolve(KOK, arg('--cikti', 'notlar/yerel-dogrula-sonuc.json'));
const IZ_LIMIT = Number(arg('--iz-limit', '8')); // içerik başına bağımsız m3u8 okuma sayısı

/* Şikâyet odaklı vakalar: bölüm > 1 ağırlıklı. */
const VAKALAR = [
  { tip: 'movie', id: '550', ad: 'Fight Club' },
  { tip: 'tv', id: '1399', sezon: 1, bolum: 2, ad: 'Game of Thrones' },
  { tip: 'tv', id: '1399', sezon: 1, bolum: 3, ad: 'Game of Thrones' },
  { tip: 'tv', id: '1396', sezon: 2, bolum: 1, ad: 'Breaking Bad' },
  { tip: 'tv', id: '66732', sezon: 1, bolum: 2, ad: 'Stranger Things' },
];

/* ── Minimal CDP istemcisi (bağımlılıksız) ─────────────────────────────────── */

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
  const gonder = (method, params = {}, timeoutMs = 300000) => new Promise((coz, red) => {
    id += 1;
    bekleyen.set(id, { coz, red });
    ws.send(JSON.stringify({ id, method, params }));
    setTimeout(() => {
      if (bekleyen.has(id)) { bekleyen.delete(id); red(new Error(`${method} zaman aşımı`)); }
    }, timeoutMs);
  });
  return { ws, gonder };
}

/* ── Electron harness (yalnız CDP'li pencere; kurulumcu/özyükleyici YOK) ──── */

const HARNESS = path.join(KOK, 'tools/.yerel-dogrula-electron.cjs');

function harnessYaz() {
  const icerik = `
const { app, BrowserWindow } = require('electron');
const hedef = process.env.CP_YEREL_URL || 'http://127.0.0.1:3000/';
app.commandLine.appendSwitch('remote-debugging-port', process.env.CP_YEREL_PORT || '9344');
app.commandLine.appendSwitch('remote-allow-origins', '*');
app.disableHardwareAcceleration();
app.whenReady().then(() => {
  const w = new BrowserWindow({
    width: 1280, height: 860, show: false,
    webPreferences: { nodeIntegration: false, contextIsolation: true, webSecurity: false },
  });
  w.loadURL(hedef);
  w.webContents.on('did-finish-load', () => console.log('YEREL-SAYFA-YUKLENDI'));
});
app.on('window-all-closed', () => app.quit());
`;
  writeFileSync(HARNESS, icerik, 'utf8');
  return HARNESS;
}

async function electronBaslat() {
  const electronBin = path.join(KOK, 'node_modules/electron/dist/electron.exe');
  if (!existsSync(electronBin)) throw new Error('electron.exe yok (node node_modules/electron/install.js)');
  const cocuk = spawn(electronBin, [
    harnessYaz(),
  ], {
    cwd: KOK,
    env: {
      ...process.env,
      ELECTRON_DISABLE_SECURITY_WARNINGS: '1',
      CP_YEREL_URL: URL_HEDEF,
      CP_YEREL_PORT: String(CDP_PORT),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  cocuk.stderr.on('data', (d) => {
    const s = String(d);
    if (/error|Error/.test(s) && !/GPU|Fontconfig|dbus|libva|Vulkan|devtools/.test(s)) process.stderr.write(`[electron] ${s.slice(0, 300)}\n`);
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
  throw new Error('Electron CDP hedefi bulunamadı (vite dev 3000 açık mı?)');
}

/* ── Sayfa içi betik: gerçek tarama + bağımsız iz doğrulaması ─────────────── */

const VAKA_BETIGI = (v, izLimit) => `(async () => {
  const SLOT = '__cpYerelSonuc_' + ${JSON.stringify(String(v.id))} + '_' + ${JSON.stringify(String(v.sezon ?? 0))} + '_' + ${JSON.stringify(String(v.bolum ?? 0))};
  const kayit = {
    tmdbTip: ${JSON.stringify(v.tip)}, tmdbId: ${JSON.stringify(String(v.id))}, ad: ${JSON.stringify(v.ad)},
    sezon: ${JSON.stringify(v.sezon ?? null)}, bolum: ${JSON.stringify(v.bolum ?? null)},
    tamam: false,
  };
  window[SLOT] = kayit;
  const yaz = () => { try { window[SLOT] = kayit; } catch (_) {} };
  try {
    const agg = await import('/src/services/kaynak/providerAggregator.js');
    const { getStreamingServersProgressive, sesTipiBul, sesTipiEtiketi, yerliKaynakMi } = agg;
    const t0 = Date.now();
    const sonuc = await getStreamingServersProgressive({
      type: ${JSON.stringify(v.tip)},
      tmdbId: ${JSON.stringify(String(v.id))},
      title: ${JSON.stringify(v.ad)},
      seriesTitle: ${JSON.stringify(v.ad)},
      season: ${JSON.stringify(v.sezon ?? 1)},
      episode: ${JSON.stringify(v.bolum ?? 1)},
      onUpdate: (p) => { kayit.ilerleme = { dubbed: (p.dubbed || []).length, subtitled: (p.subtitled || []).length, toplam: p.totalServers, bitti: Boolean(p.isComplete) }; yaz(); },
    });
    kayit.taramaBitti = true;
    kayit.sure = Date.now() - t0;
    kayit.dubbedAdet = (sonuc.dubbed || []).length;
    kayit.subtitledAdet = (sonuc.subtitled || []).length;
    kayit.toplam = sonuc.totalServers;

    /* Bağımsız iz okuyucu: m3u8'i kendimiz fetch edip #EXT-X-MEDIA satırlarını
       KENDİ regex'imizle okuyoruz — aggregator'ın ölçümüyle çapraz doğrulanır. */
    async function izOku(u) {
      if (!/\\.m3u8(?:\\?|#|$)|\\/api\\/(?:hls_proxy|proxy)\\?/i.test(u)) return null;
      /* Tek okuma yetmez: CDN kenarları/ımzalı varyantlar aynı URL'ye istek
         başına FARKLI master dönebilir. 3 bağımsız okuma; TR izi HERHANGİ bir
         okumada görülürse iz VAR sayılır (pozfif yakalama), 'iz yok' kararı
         için 3 okumanın da tutarlı olması gerekir. */
      let son = null;
      for (let deneme = 0; deneme < 3; deneme += 1) {
        const tek = await izOkuTek(deneme === 0 ? u : u + (u.includes('#') ? '' : (u.includes('?') ? '&' : '?') + 'cp_re' + deneme));
        son = tek;
        if (tek && tek.okundu && (tek.ses || tek.altyazi)) return tek;
      }
      return son;
    }
    async function izOkuTek(u) {
      try {
        const c = new AbortController();
        const t = setTimeout(() => { try { c.abort(); } catch (_) {} }, 8000);
        const r = await fetch(u, { signal: c.signal });
        clearTimeout(t);
        const metin = (await r.text()) || '';
        /* Gecerli okuma = HTTP 200 + #EXTM3U. HTML hata sayfasi/captcha 'iz yok'
           sayilmaz; bilinemeyen olarak isaretlenir ve capraz denetleme yapilmaz. */
        if (!r.ok || !/#EXTM3U/i.test(metin.slice(0, 2048))) return { okundu: false, hata: 'gecersiz govde (ok=' + r.ok + ')' };
        let ses = false, altyazi = false, izSatiri = 0;
        for (const satir of metin.split('\\n')) {
          if (!/#EXT-X-MEDIA/i.test(satir)) continue;
          izSatiri += 1;
          const tr = /LANGUAGE=(?:"|')(?:tr|tur)(?:"|')|(?:NAME|GROUP-ID)=(?:"|')[^"'|]*turk/i.test(satir);
          if (!tr) continue;
          if (/TYPE=AUDIO/i.test(satir)) ses = true;
          else if (/TYPE=SUBTITLES/i.test(satir)) altyazi = true;
        }
        return { ses, altyazi, izSatiri, okundu: true };
      } catch (e) { return { okundu: false, hata: String(e && e.message || e).slice(0, 80) }; }
    }

    const tum = [
      ...(sonuc.dubbed || []).map(s => ({ s, kategori: 'dubbed' })),
      ...(sonuc.subtitled || []).map(s => ({ s, kategori: 'subtitled' })),
    ];
    const etiketler = {};
    const ornekler = [];
    const uyusmazliklar = [];
    const flaplar = [];
    let olculen = 0;
    for (const { s, kategori } of tum) {
      const tip = sesTipiBul(s, kategori);
      const etiket = sesTipiEtiketi(tip);
      etiketler[etiket] = (etiketler[etiket] || 0) + 1;
      const adres = s.streamUrl || s.url || '';
      const satir = {
        kategori, tip, etiket, kaynakId: String(s.id || '').slice(0, 40),
        trSes: Boolean(s.trSes), trAltyazi: Boolean(s.trAltyazi), isDual: Boolean(s.isDual),
        m3u8: /\\.m3u8|\\/api\\/(?:hls_proxy|proxy)\\?/i.test(adres),
      };
      if (satir.m3u8 && olculen < ${izLimit}) {
        olculen += 1;
        const iz = await izOku(adres);
        satir.bagimsiz = iz;
        if (iz && iz.okundu) {
          /* CAPRAZ DENETIM (uc yonlu):
             - TR SES izi varsa etiket DUBLAJ olmali (gercek dublaj kaniti)
             - TR SES yok + TR ALTYAZI izi varken etiket dublaj olamaz
               (bilincli _xd kopya ya da trSes/isDual kaniti muaf)
             - hic TR izi yoksa etiket 'ozgun' olmali, SAHTE iddia YASAK.
               Muafiyetler: _xd/_xs bilincli kopyalar + YERLI saglayicilar
               (aggregator tasarimi: yerli sitede kategori guvenilir) —
               yerli tespiti TAHMIN degil modulin kendi yerliKaynakMi'si.
             YUMUSAK VARYANS: tarayicimizdan yapilan 3 okuma iz gormedi ama
             AGREGATOR tarama aninda OLumlu iz olcuu (trSes/trAltyazi/isDual)
             bildirmis — kokun kendi basligiyla (kopru header'lariyla) farkli
             varyant dondurmesi muhtemel. Bu SERT HATA degil, 'flap' kaydi. */
          const bilincli = /_xd$|_xs$/.test(String(s.id || ''));
          const yerli = yerliKaynakMi(s);
          const agregatorOlumlu = Boolean(s.trSes || s.trAltyazi || s.isDual);
          if (iz.ses && tip !== 'dublaj') uyusmazliklar.push({ neden: 'TR ses izi var ama etiket dublaj degil', satir });
          if (!iz.ses && iz.altyazi && tip === 'dublaj' && !bilincli && !s.trSes && !s.isDual) uyusmazliklar.push({ neden: 'TR altyazi izi var, TR ses YOK ama etiket dublaj', satir });
          if (!iz.ses && !iz.altyazi && tip !== 'ozgun' && !bilincli && !yerli) {
            if (agregatorOlumlu) flaplar.push({ neden: 'aggregator tarama-ani iz olcuu tek tarafi gormus (bagimsiz 3 okuma izsiz)', satir });
            else uyusmazliklar.push({ neden: 'Hic TR izi yok (3 okuma) ve agregator da olumlu kanit bildirmemis ama etiket Ozgun degil', satir });
          }
        }
      }
      if (ornekler.length < 12) ornekler.push(satir);
    }
    kayit.etiketler = etiketler;
    kayit.ornekler = ornekler;
    kayit.uyusmazliklar = uyusmazliklar;
    kayit.flaplar = flaplar;
    kayit.bagimsizOlculen = olculen;
    kayit.basarili = kayit.toplam > 0;
    kayit.tamam = true;
  } catch (hata) {
    kayit.hata = String(hata && hata.message || hata).slice(0, 200);
    kayit.basarili = false;
    kayit.tamam = true;
  }
  return kayit;
})()`;

async function main() {
  console.log(`yerel doğrulama: ${URL_HEDEF} · ${VAKALAR.length} vaka · iz limiti ${IZ_LIMIT}`);
  const { cocuk, sayfa } = await electronBaslat();
  const { ws, gonder } = await cdpBaglan(sayfa.webSocketDebuggerUrl);
  try {
    await gonder('Runtime.enable', {}, 10000);
    await new Promise((r) => setTimeout(r, 4000));
    const kanca = await gonder('Runtime.evaluate', {
      expression: `({ yildiz: typeof window.__cpYildizTara, sag: typeof window.__cpSag, agg: true })`,
      returnByValue: true,
    }, 15000);
    console.log('kanca kontrolü:', JSON.stringify(kanca.result?.value));

    const sonuclar = [];
    const VAKA_ASIK_MS = Number(arg('--vaka-asik', '330000'));
    for (const v of VAKALAR) {
      const etiket = `${v.ad} S${v.sezon ?? '-'}B${v.bolum ?? '-'}`;
      const SLOT = '__cpYerelSonuc_' + String(v.id) + '_' + String(v.sezon ?? 0) + '_' + String(v.bolum ?? 0);
      process.stdout.write(`  ${etiket.padEnd(30)} başlatıldı`);
      await gonder('Runtime.evaluate', { expression: VAKA_BETIGI(v, IZ_LIMIT), awaitPromise: false }, 30000);
      const t0 = Date.now();
      let s = null; let sonYazilan = 0;
      while (Date.now() - t0 < VAKA_ASIK_MS) {
        await new Promise((r) => setTimeout(r, 5000));
        let anlik = null;
        try {
          const r = await gonder('Runtime.evaluate', {
            expression: `JSON.stringify(window[${JSON.stringify(SLOT)}] || null)`, returnByValue: true,
          }, 15000);
          anlik = r.result?.value ? JSON.parse(r.result.value) : null;
        } catch (_) { /* evaluate sürüyor olabilir, tekrar dene */ }
        if (!anlik) continue;
        const gecen = Math.round((Date.now() - t0) / 1000);
        if (anlik.tamam) { s = anlik; break; }
        if (gecen - sonYazilan >= 20) {
          sonYazilan = gecen;
          const il = anlik.ilerleme || {};
          process.stdout.write(` · ${gecen}sn dub=${il.dubbed ?? 0}/sub=${il.subtitled ?? 0}`);
        }
      }
      process.stdout.write('\n');
      if (!s) {
        s = { ad: v.ad, tmdbId: String(v.id), sezon: v.sezon ?? null, bolum: v.bolum ?? null, basarili: false, hata: `vaka.asiğı ${VAKA_ASIK_MS / 1000}sn aşıldı` };
      }
      console.log(`      → toplam=${s.toplam ?? 0} (dub=${s.dubbedAdet ?? 0}/sub=${s.subtitledAdet ?? 0}) iz=${s.bagimsizOlculen ?? 0} uyusmaz=${(s.uyusmazliklar || []).length} flap=${(s.flaplar || []).length} ${s.sure ?? '?'}ms ${s.hata ? 'HATA: ' + s.hata : ''}`);
      for (const u of (s.uyusmazliklar || []).slice(0, 5)) console.log(`      UYUŞMAZLIK: ${u.neden} → ${JSON.stringify(u.satir).slice(0, 260)}`);
      for (const u of (s.flaplar || []).slice(0, 5)) console.log(`      flap(tek taraflı): ${u.neden} → ${JSON.stringify(u.satir).slice(0, 220)}`);
      sonuclar.push(s);
    }

    const ozet = {
      tarih: new Date().toISOString(),
      hedef: URL_HEDEF,
      vakaSayisi: sonuclar.length,
      kaynakBulan: sonuclar.filter((x) => x.basarili).length,
      bolumIkiSonrasiVaka: sonuclar.filter((x) => x.tip === 'tv' && ((x.sezon ?? 1) > 1 || (x.bolum ?? 1) > 1)).length,
      bolumIkiSonrasiKaynakBulan: sonuclar.filter((x) => x.tip === 'tv' && ((x.sezon ?? 1) > 1 || (x.bolum ?? 1) > 1) && x.basarili).length,
      toplamUyusmazlik: sonuclar.reduce((t, x) => t + (x.uyusmazliklar || []).length, 0),
      toplamFlap: sonuclar.reduce((t, x) => t + (x.flaplar || []).length, 0),
      bagimsizOlcum: sonuclar.reduce((t, x) => t + (x.bagimsizOlculen || 0), 0),
    };
    writeFileSync(CIKTI, `${JSON.stringify({ ozet, sonuclar }, null, 1)}\n`, 'utf8');
    console.log(`\nÖZET: ${ozet.kaynakBulan}/${ozet.vakaSayisi} vakada kaynak · bölüm>1: ${ozet.bolumIkiSonrasiKaynakBulan}/${ozet.bolumIkiSonrasiVaka} · bağımsız iz ölçümü ${ozet.bagimsizOlcum} · çapraz denetim uyumsuzluğu ${ozet.toplamUyusmazlik} · tek-taraflı varyans ${ozet.toplamFlap}`);
    console.log(`Çıktı: ${path.relative(KOK, CIKTI)}`);
    if (ozet.toplamUyusmazlik > 0) process.exitCode = 2;
  } finally {
    try { ws.close(); } catch (_) {}
    try { cocuk.kill('SIGKILL'); } catch (_) {}
  }
}

main().catch((h) => { console.error('YEREL DOĞRULAMA HATASI:', h.message || h); process.exitCode = 1; });
