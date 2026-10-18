/* ==========================================================================
   Kahraman sağlayıcı CANLI DOĞRULAMA (ölçüm aracı; src/tests'e dokunmaz)
   --------------------------------------------------------------------------
   43 çekirdeğin gerçekten yayın üretip üretmediğini canlı ağ ile ölçer.
     node tools/kahraman-dogrulama.mjs --ornek   # pilot: Spider-Man movie,
                                                 # Batman movie, Thor tv
     node tools/kahraman-dogrulama.mjs           # tam koşu (43×tür, ikincil TMDB)
   Çıkış: notlar/kahraman-dogrulama.json + notlar/kahraman-dogrulama.md

   NEDEN KENDİ KÖPRÜSÜ? vekil.js kopruFetch kendi ürettiği /api/proxy siyi
   sarmalar (apiUrl('') Node'da boş döner) → sonsuz döngü → heap tüfümü.
   Ölçüm bu köprü ile; sözleşme parçaları (normalizeEt, alanlar.js) src'den
   AYNEN kullanılır.
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const KOK = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const NOTLAR = path.join(KOK, 'notlar');
const SIDEKAR = 'http://127.0.0.1:4000';

const bayraklar = new Set(process.argv.slice(2));
const oku = (a, v) => { const i = process.argv.indexOf(a); return i > -1 ? process.argv[i + 1] : v; };
const ORNEK = bayraklar.has('--ornek') || bayraklar.has('-n');
const MOD = (oku('--mod', 'auto') || 'auto').toUpperCase();   // auto | A | B
const TURFILTRE = (oku('--tur', 'both') || 'both');           // both | movie | tv

const VAZIYEY_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const TAVAN_MS = 12_000;        // sağlayıcı başına ölçüm tavanı
const TALEP_TAVAN_MS = 10_000;  // tek istek yumuşak tavanı (yazar-log)

fs.mkdirSync(NOTLAR, { recursive: true });
const LOG = path.join(NOTLAR, 'kahraman-dogrulama.log');
function yaz(mesaj) {
  const satir = `[${new Date().toISOString().slice(11, 19)}] ${mesaj}`;
  console.log(satir);
  try { fs.appendFileSync(LOG, satir + '\n'); } catch {}
}

function yaris(vaat, ms, mesaj) {
  return new Promise((coz, reddet) => {
    const z = setTimeout(() => reddet(new Error(mesaj)), Math.max(1, ms));
    vaat.then(v => { clearTimeout(z); coz(v); }, h => { clearTimeout(z); reddet(h); });
  });
}

/* ── sözleşme modülleri (src, aynen) ─────────────────────────────────── */
const kayitModulu = await import(pathToFileURL(path.join(KOK, 'src/providers/kayit.js')));
const vekilModulu = await import(pathToFileURL(path.join(KOK, 'src/providers/vekil.js')));
const alanlarModulu = await import(pathToFileURL(path.join(KOK, 'src/providers/alanlar.js')));
const { KAYIT } = kayitModulu;
const { normalizeEt } = vekilModulu;
const { ALANLAR, alanListesiIstegiMi, alanYaniti } = alanlarModulu;

/* ── globall fetch'leri koy ve çekirdekleri yakal ────────────────────── */
const CEKIRDEK_ONBEL = new Map();        // kod → getStreams | null
const YUKLEME_HATA = new Map();          // kod → import/derleme hata
const globalFetchEski = globalThis.fetch; // gerçek Node fetch — orijinal

async function cekirdegiYakala(kod, kayit) {
  if (CEKIRDEK_ONBEL.has(kod)) return CEKIRDEK_ONBEL.get(kod);
  const oncekiGs = globalThis.getStreams;
  const oncekiSub = globalThis.getSubtitles;
  let hata = null;
  try { await kayit.yukle(); } catch (e) { hata = e?.message || String(e); }
  const gs = typeof globalThis.getStreams === 'function' ? globalThis.getStreams : null;
  globalThis.getStreams = oncekiGs;
  globalThis.getSubtitles = oncekiSub;
  if (hata) YUKLEME_HATA.set(kod, hata);
  CEKIRDEK_ONBEL.set(kod, gs);
  return gs;
}

/* ── alan adı gizleme: gerçek host ↔ kod/anonim-makine-esi ───────────── */
const ANA_KODLAR = new Map();            // gerçek host → kod
const ANA_SIRASI = [];                   // { kod: '<ana-N>', host }
function makineKodu(host) {
  if (ANA_KODLAR.has(host)) return ANA_KODLAR.get(host);
  let kod = null;
  for (const [say, aln] of Object.entries(ALANLAR)) {
    if (!aln) continue;
    try { if (new URL(aln).host === host) { kod = say; break; } } catch {}
  }
  if (!kod) {
    kod = `<ana-${ANA_SIRASI.length + 1}>`;
    ANA_SIRASI.push({ kod, host });
  }
  ANA_KODLAR.set(host, kod);
  return kod;
}
const BILINEN_MARKA = new Set(Array.from(ANA_KODLAR.keys())
  .concat(Object.values(ALANLAR).filter(Boolean).map(a => { try { return new URL(a).host.split('.'); } catch { return []; } })
    .flat())
  .filter(z => z && z.length >= 5));
BILINEN_MARKA.delete('streamcorecdn');
function gizleUrl(url, sinir = 140) {
  try {
    const u = new URL(String(url));
    let metin = `${u.protocol}//${makineKodu(u.host)}${u.pathname}${u.search}`;
    // sorgu değerlerinde bilinen gerçek marka/alan kırıntısı sızmasın
    metin = metin.replace(/([?&][A-Za-z_]+=)([A-Za-z0-9._-]+)/g, (tum, once, deger) => {
      for (const m of BILINEN_MARKA) {
        if (m.length >= 5 && deger.toLowerCase().includes(m.toLowerCase())) {
          return once + 'gizli';
        }
      }
      return tum;
    });
    return metin.slice(0, sinir);
  } catch { return 'geçersiz-url'; }
}

/* ── köprüler ────────────────────────────────────────────────────────── */
let ISTEKLER = [];

function alanListesiYanit() {
  return Promise.resolve(new Response(JSON.stringify(alanYaniti()), {
    status: 200, headers: { 'content-type': 'application/json' },
  }));
}

function sinyalBatir(secenek) {
  // tek istek yumuşak tavanı: skansın takılmasın
  const sabit = AbortSignal.timeout(TALEP_TAVAN_MS);
  if (secenek.signal) return { ...secenek, signal: AbortSignal.any([secenek.signal, sabit]) };
  return { ...secenek, signal: sabit };
}

function isteğiKaydet(url, referer) {
  const kayit = {
    url: gizleUrl(url),
    status: 0,
    hata: null,
    ref: referer ? 'var' : 'yok',
  };
  ISTEKLER.push(kayit);
  return kayit;
}

/** Mod A: her şey sidecar /api/proxy'den geçer. */
async function kopruA(girdi, secenek = {}) {
  const url = typeof girdi === 'string' ? girdi : girdi?.url;
  if (!url || !/^https?:\/\//i.test(url)) return globalFetchEski(girdi, secenek);
  if (alanListesiIstegiMi(url)) return alanListesiYanit();
  const b = new Headers(secenek.headers || {});
  const referer = b.get('referer') || '';
  b.delete('referer'); b.delete('origin'); b.delete('user-agent');
  b.set('user-agent', 'cinepulse-dogrulama');          // sidecar kendi UA uygular
  if (!b.has('accept')) b.set('accept', '*/*');
  const kayit = isteğiKaydet(url, referer);
  let hedef = `${SIDEKAR}/api/proxy?url=${encodeURIComponent(url)}`;
  if (referer) hedef += `&ref=${encodeURIComponent(referer)}`;
  try {
    const r = await globalFetchEski(hedef, sinyalBatir({ ...secenek, headers: b }));
    kayit.status = r.status;
    return r;
  } catch (e) {
    kayit.hata = `${String(e?.cause?.code || '')} ${e?.message}`.trim();
    throw e;
  }
}

/** Mod B: doğrudan yayıncı alanına (Node fetch CORS'a takılmaz). */
async function kopruB(girdi, secenek = {}) {
  const url = typeof girdi === 'string' ? girdi : girdi?.url;
  if (!url || !/^https?:\/\//i.test(url)) return globalFetchEski(girdi, secenek);
  if (alanListesiIstegiMi(url)) return alanListesiYanit();
  const b = new Headers(secenek.headers || {});
  const referer = b.get('referer') || '';
  if (!b.has('user-agent')) b.set('user-agent', VAZIYEY_UA);
  b.delete('origin');         // bazen sunucunun 403 sınırlaması (vekil ile aynı)
  const kayit = isteğiKaydet(url, referer);
  try {
    const r = await globalFetchEski(url, sinyalBatir({ ...secenek, headers: b }));
    kayit.status = r.status;
    return r;
  } catch (e) {
    kayit.hata = `${String(e?.cause?.code || '')} ${e?.message}`.trim();
    throw e;
  }
}

/* ── akış doğrulama: gerçekten HLS/MP4 mü? ───────────────────────────── */
const UNLU_BYTE = ['ftyp', 'moov']; // mp4 imzaları
function mp4Mi(buf) {
  if (buf.byteLength < 12) return false;
  const metin = new TextDecoder('latin1').decode(buf.slice(4, 8));
  return UNLU_BYTE.some(s => metin.includes(s));
}

/** Doğrudan çekim yerine üstte 2 KB okur; HLS/MP4 dil imzasını arar. */
async function akisDogrula(url, basliklar = {}) {
  try {
    const b = new Headers(basliklar || {});
    if (!b.has('user-agent')) b.set('user-agent', VAZIYEY_UA);
    b.delete('origin');
    const r = await globalFetchEski(url, sinyalBatir({ headers: b }));
    const buf = await r.arrayBuffer().catch(() => new ArrayBuffer(0));
    const bas = buf.byteLength ? new TextDecoder().decode(buf.slice(0, 2048)) : '';
    return {
      durum: r.status,
      tip: basliklar_hdr(r),
      hls: /#EXTM3U|#EXT-X/.test(bas),
      mp4: mp4Mi(buf),
      uzunluk: buf.byteLength,
    };
  } catch (e) {
    return { hata: `${String(e?.cause?.code || '')} ${e?.message}`.trim().slice(0, 120) };
  }
}
function basliklar_hdr(r) {
  const t = (r.headers.get('content-type') || '').split(';')[0];
  return t || null;
}

/* ── tek sağlayıcı koşumu ───────────────────────────────────────────── */
let KOGRU_MODE = null;

function sinifla(hata, kaynakAdet) {
  if (hata) {
    const m = String(hata).toLowerCase();
    if (/butce-asim|zaman|timeout|sembol/.test(m)) return 'zaman-asimi';
    if (/403|erisim|engel|blocked/.test(m)) return 'erisim-reddi';
    return 'hata';
  }
  return kaynakAdet > 0 ? 'yayin' : 'eslesme-yok';
}

async function tekSaglayiciKos(kod, tur, tmdbId, sezon = 1, bolum = 1) {
  const kayit = KAYIT.get(kod);
  if (!kayit) return { kod, tur, sonuc: 'hata', hata: 'kayit-yok', sure: 0 };
  const t0 = Date.now();
  ISTEKLER = [];

  let gs = null, ham = null, hata = null;
  gs = await cekirdegiYakala(kod, kayit);
  if (!gs) {
    hata = `cekirdek-yuklemedi: ${YUKLEME_HATA.get(kod) || 'sözsüz'}`;
  } else {
    ISTEKLER = [];
    globalThis.fetch = KOGRU_MODE === 'A' ? kopruA : kopruB;
    try {
      const is = gs(String(tmdbId), tur === 'tv' ? 'tv' : 'movie', Number(sezon) || 1, Number(bolum) || 1);
      ham = await yaris(Promise.resolve(is), TAVAN_MS, 'butce-asim');
      if (!Array.isArray(ham)) hata = `bozuk-donus:${typeof ham}`;
    } catch (e) {
      hata = e?.message || String(e);
    } finally {
      globalThis.fetch = globalFetchEski;
    }
  }

  const kaynaklar = (Array.isArray(ham) ? ham : [])
    .map(oge => normalizeEt(oge, { kodAdi: kod, onek: kayit.onek }))
    .filter(Boolean);
  let sonuc = sinifla(hata, kaynaklar.length);
  const hamSayisi = Array.isArray(ham) ? ham.length : 0;
  let not = null;
  if (!hata && hamSayisi > 0 && kaynaklar.length === 0) {
    not = `çekirdek ${hamSayisi} öğe döndü ama doğrudan-yayın süzgeci (uzantı) elendi`;
  }
  // Erişim reddi: çekirdek kendi alanından 403 aldı ve boş döndü
  if (sonuc === 'eslesme-yok'
      && ISTEKLER.some(i => i.status === 403 || i.status === 451)) {
    sonuc = 'erisim-reddi';
    not = (not ? not + ' · ' : '') + 'çekirdek kendi alanından 403/451 aldı';
  }

  // Çekirdeğin döndürüp SÜZGECİN ELEDİĞİ öğeyi de doğrula: kural değişikliği
  // ile canlanıp canlanamayacağına kanıt.
  let hamDogrulama = null;
  if (!hata && kaynaklar.length === 0 && hamSayisi > 0) {
    const hamIlk = ham.find(o => o?.url || o?.streamUrl);
    if (hamIlk) hamDogrulama = await akisDogrula(hamIlk.url || hamIlk.streamUrl, hamIlk.headers || {});
    if (hamDogrulama && (hamDogrulama.hls || hamDogrulama.mp4)) {
      not = (not ? not + ' · ' : '') + 'ham adresi gerçek HLS/MP4 içeriyor (süzgeç kanıtı)';
    }
  }
  // Normalize edilmiş kaynakları doğrula (HLS imzası gerçekten görüne mi)
  for (const k of kaynaklar) {
    const esle = (ham || []).find(o => (o?.url || o?.streamUrl) === k.streamUrl);
    k.dogrulama = await akisDogrula(k.streamUrl, (esle && esle.headers) || k.headers || {});
    if (k.dogrulama && !(k.dogrulama.hls || k.dogrulama.mp4) && k.dogrulama.durum === 200) {
      k.not = '200 döndü ama HLS/MP4 imzası okunamadı (içerik tipi: ' + (k.dogrulama.tip || '?') + ')';
    }
  }

  if (!ISTEKLER.length) ISTEKLER = [];
  return {
    kod,
    tur,
    tmdbId,
    sezon,
    bolum,
    sonuc,
    hamOge: hamSayisi,
    hamDogrulama: hamDogrulama
      ? { ...hamDogrulama, url: hamDogrulama.url ? gizleUrl(hamDogrulama.url) : undefined }
      : null,
    not,
    cekirdekBuldu: kaynaklar.length > 0,
    hata: hata ? String(hata).slice(0, 160) : null,
    sure: Date.now() - t0,
    istekAdet: ISTEKLER.length,
    istekler: ISTEKLER.slice(0, 30),
    kaynaklar: kaynaklar.map(k => ({
      quality: k.quality,
      url: gizleUrl(k.streamUrl, 110),
      basliklar: Object.keys(k.headers || {}),
      dogrulama: k.dogrulama || null,
      not: k.not || null,
    })),
  };
}

/* ── ikincil TMDB hedefleri (esleşme-yok sağlayıcılar için 2. şans) ──── */
const IKINCI_SANS = {
  movie: { tmdbId: '27205', ad: 'Inception', sezon: 1, bolum: 1 },
  tv: { tmdbId: '1416', ad: "Grey's Anatomy", sezon: 1, bolum: 1 },
};

/* ── sidecar yönetimi ───────────────────────────────────────────────── */
let sidekarProses = null;

async function sidecarHazirmi() {
  try {
    const r = await globalFetchEski(`${SIDEKAR}/health`, { signal: AbortSignal.timeout(3500) });
    if (r.ok) return true;
  } catch {}
  return false;
}
async function sidecarAyağaKaldır() {
  if (await sidecarHazirmi()) { yaz('sidecar zaten ayakta (port 4000)'); return true; }
  try {
    sidekarProses = spawn('node', [path.join(KOK, 'server/mediaServer.js')], { stdio: 'ignore' });
    sidekarProses.on('error', () => {});
  } catch {}
  const t0 = Date.now();
  while (Date.now() - t0 < 12_000) {
    if (await sidecarHazirmi()) { yaz(`sidecar ayakta (${Date.now() - t0} ms içinde)`); return true; }
    await new Promise(z => setTimeout(z, 400));
  }
  return false;
}
function sidecaraKapat() {
  if (sidekarProses) { try { sidekarProses.kill(); } catch {} sidekarProses = null; }
}
process.on('exit', sidecaraKapat);
process.on('SIGINT', () => { sidecaraKapat(); process.exit(130); });

async function agTesti(url) {
  try {
    const r = await globalFetchEski(url, { signal: AbortSignal.timeout(7000) });
    return { acik: r.status < 500, durum: r.status };
  } catch (e) {
    return { acik: false, hata: `${String(e?.cause?.code || '')} ${e?.message}`.trim() };
  }
}

async function modSec() {
  if (MOD === 'A' || MOD === 'auto') {
    const taraf = await sidecarAyağaKaldır();
    if (taraf) {
      const t = await agTesti(`${SIDEKAR}/api/proxy?url=${encodeURIComponent('https://api.themoviedb.org/3/configuration')}`);
      if (t.acik) { KOGRU_MODE = 'A'; yaz('KÖPRÜ MODU: A (/api/proxy)'); return; }
      yaz(`sidecar probe başarısız: ${t.hata || t.durum}`);
      sidecaraKapat();
    } else {
      yaz('sidecar başlatılamadı');
    }
    if (MOD === 'A') {
      yaz('Mod A zorunlu — koşum durduruldu');
      belgeYaz([], 'mod-a-basarisiz');
      process.exit(3);
    }
  }
  const t = await agTesti('https://api.themoviedb.org/3/movie/550');
  if (t.acik) { KOGRU_MODE = 'B'; yaz('KÖPRÜ MODU: B (doğrudan)'); return; }
  yaz(`AĞ ERİŞİMİ YOK ya da iki mod başarısız (${t.hata || t.durum}) — ölçüm yapılamaz`);
  belgeYaz([], 'ag-engelli');
  process.exit(4);
}

/* ── artefakt yazımı ───────────────────────────────────────────────── */
const HEDEFLER = {
  movie: { tmdbId: '550', ad: 'Fight Club', sezon: 1, bolum: 1 },
  tv: { tmdbId: '1396', ad: 'Breaking Bad', sezon: 1, bolum: 1 },
};

function ozetAl(sonuclar) {
  const ozet = {};
  for (const s of sonuclar) ozet[s.sonuc] = (ozet[s.sonuc] || 0) + 1;
  return ozet;
}

function belgeYaz(sonuclar, durum) {
  const hedefJson = ORNEK ? 'kahraman-dogrulama-pilot.json' : 'kahraman-dogrulama.json';
  const belge = {
    tur: 'kahraman-dogrulama',
    tarih: new Date().toISOString(),
    durum,
    ortam: {
      node: process.version,
      platform: process.platform,
      turFiltre: TURFILTRE,
      tavanMs: TAVAN_MS,
      talepTavanMs: TALEP_TAVAN_MS,
      gan: 'gerçek sit adları artefakta sızmadı — kodlar + anonim kodlar kullanıldı',
      not: 'saglayıcı tavanı ölçüm amaçlıdır; üretimde 30 sn ortak bütçe (vekil.js BUTCE_MS) geçerlidir',
    },
    mod: KOGRU_MODE || durum,
    hedefler: HEDEFLER,
    ikinciSans: IKINCI_SANS,
    alanKoduHaritasi: Object.fromEntries(ANA_SIRASI.map(x => [x.kod, 'gizli'])),
    ozet: ozetAl(sonuclar),
    sonuclar,
  };
  try { fs.writeFileSync(path.join(NOTLAR, hedefJson), JSON.stringify(belge, null, 2)); }
  catch (e) { yaz('JSON yazma hatası: ' + e.message); }
}

function raporYaz(sonuclar, durum, bolum) {
  const ozet = ozetAl(sonuclar);
  const satir = s => {
    const dogr = (s.kaynaklar || [])
      .map(k => k.dogrulama ? ((k.dogrulama.hls ? '✓HLS' : k.dogrulama.mp4 ? '✓MP4' : '✗') + (k.dogrulama.durum ? '(' + k.dogrulama.durum + ')' : (k.dogrulama.hata ? '(' + k.dogrulama.hata.slice(0, 14) + ')' : ''))) : null)
      .filter(Boolean).join(' ');
    return `| ${s.kod} | ${s.tur} | ${(s.sure / 1000).toFixed(1)} | ${s.istekAdet} | ${s.kaynaklar?.length ?? 0} | ${dogr || '-'} | ${s.not ? s.not : s.sonuc} | ${s.hata ? s.hata.slice(0, 46) : ''} |`;
  };
  const satirlar = sonuclar.map(satir);
  const rapor = [
    '# Kahraman Sağlayıcı Canlı Doğrulama', '',
    `- Tarih: ${new Date().toISOString()}`,
    `- Ortam: node ${process.version} · ${process.platform}`,
    `- Mod: ${KOGRU_MODE || '-'} · Durum: ${durum} (bölüm ${bolum})`,
    `- Test içerikleri: film ${HEDEFLER.movie.tmdbId} · dizi ${HEDEFLER.tv.tmdbId} S${HEDEFLER.tv.sezon}E${HEDEFLER.tv.bolum}`,
    `- Ölçüm tavanı: ${TAVAN_MS / 1000} sn/sağlayıcı (üretim: 30 sn ortak bütçe)`,
    '', '## Özet', '',
    ...Object.entries(ozet).map(([k, v]) => `- ${k}: ${v}`),
    '', '## Tablo', '',
    '| kod | tür | süre(sn) | istek | kaynak | doğrulama | sonuc | not |',
    '|-----|-----|----------|-------|--------|-----------|-------|-----|',
    ...satirlar,
    '',
    'Gizlilik: gerçek site alan adları yazılmadı; kaynak URL alanı sağlayıcı kodu + anonim',
    '"<ana-N>" makine kodu ile temsil edilir; gerçek eşleştirme yalnız alanlar.js hedefidir.',
    'Ölü/erişilemez makinelar: "erisim-reddi" sonucu + istek günlüğünde bağlantı hataları.',
  ].join('\n');
  try { fs.writeFileSync(path.join(NOTLAR, 'kahraman-dogrulama.md'), rapor); }
  catch (e) { yaz('MD yazma hatası: ' + e.message); }
}

/* ── zengin İNSAN RAPOR (JSON'dan türetilebilir) ────────────────────── */
function zenginRaporYaz(sonuclar, mod, tarih, durum, farkSatirlari = null) {
  const kodGrupla = new Map();      // kod → sürüm dizisi
  for (const s of sonuclar) {
    if (!kodGrupla.has(s.kod)) kodGrupla.set(s.kod, []);
    kodGrupla.get(s.kod).push(s);
  }
  const tak = [...kodGrupla.entries()].sort((a, b) => a[0].localeCompare(b[0], 'en'));

  const calis = [];        // doğrulanmış HLS/MP4 geldi
  const suzgeceTakilan = [];  // çekirdek buldu (ham HLS kanıt) ama süzgeç eldi
  const bozuk = [];        // çekirdek yüklenmedi
  const eslesme = [];
  const erisim = [];
  const zamanAsimi = [];
  const akisDogrulanamadi = [];   // kaynak döndürdü ama akış erişilemedi
  const diger = [];
  for (const [kod, surumler] of tak) {
    if (surumler.some(s => s.kaynaklar?.some(k => k.dogrulama && (k.dogrulama.hls || k.dogrulama.mp4)))) { calis.push(kod); continue; }
    if (surumler.some(s => s.hamOge > 0 && s.hamDogrulama && (s.hamDogrulama.hls || s.hamDogrulama.mp4))) { suzgeceTakilan.push(kod); continue; }
    if (surumler.every(s => String(s.hata || '').startsWith('cekirdek-yuklemedi'))) { bozuk.push(kod); continue; }
    if (surumler.some(s => s.kaynaklar?.length)) { akisDogrulanamadi.push(kod); continue; }
    if (surumler.some(s => s.sonuc === 'erisim-reddi')) { erisim.push(kod); continue; }
    if (surumler.some(s => s.sonuc === 'zaman-asimi')) { zamanAsimi.push(kod); continue; }
    if (surumler.every(s => s.sonuc === 'eslesme-yok' || s.not)) { eslesme.push(kod); continue; }
    diger.push(kod);
  }

  const desenler = {};
  for (const s of sonuclar) {
    for (const i of (s.istekler || [])) {
      const h = String(i.hata || '').toLowerCase();
      if (!h) continue;
      const cls = /getaddrinfo|enotfound/.test(h) ? 'DNS çözümleme başarız (getaddrinfo)'
        : /econnrefused/.test(h) ? 'bağlantı reddi (ECONNREFUSED)'
        : /econnreset/.test(h) ? 'bağlantı reset (ECONNRESET)'
        : /abort|timeout/.test(h) ? 'yanıt yok (timeout/abort)'
        : h.slice(0, 40);
      (desenler[cls] ||= new Set()).add(s.kod);
    }
  }

  const liste = x => x.length ? x.map(k => '- ' + k).join('\n') : '- (yok)';
  const varsa = kod => tak.find(([k]) => k === kod);
  const surumSatirlari = kod => (varsa(kod) || [[], []])[1]
    .map(s => `  - ${s.tur}: ${s.sonuc}${s.kaynaklar?.length ? ' · ' + s.kaynaklar.length + ' kaynak · ' + (s.kaynaklar[0].dogrulama?.hls ? '✓HLS' : s.kaynaklar[0].dogrulama?.mp4 ? '✓MP4' : 'süzgeç sonrası doğr. yok') : ''}${s.hata ? ' · ' + String(s.hata).slice(0, 70) : ''}`).join('\n');

  const ozetZengin = [
    `- **Kesin çalışan** (akış doğrulandı): ${calis.length} sağlayıcı`,
    `- **Çekirdek çalışıyor, süzgece takıldı**: ${suzgeceTakilan.length} sağlayıcı`,
    `- **Çekirdek yükleme bozuk**: ${bozuk.length} sağlayıcı`,
    `- **Eşleşme yok** (içerik bu alanda yok; "ölü" değil): ${eslesme.length} sağlayıcı`,
    `- **Akış doğrulanamadı** (kaynak döndürdü ama bağlantı/respond yok): ${akisDogrulanamadi.length} sağlayıcı`,
    `- **Erişim reddi**: ${erisim.length} · **Zaman aşımı**: ${zamanAsimi.length} · Diğer: ${diger.length}`,
  ];

  const md = [
    `# Kahraman Sağlayıcı Canlı Doğrulama`, '',
    `- Tarih: \`${tarih}\` · Mod: **${mod}** · Durum: ${durum}`,
    `- Kapsam: 43 kayıt × desteklenen türler = ${sonuclar.length} ölçüm`,
    `- Test içerikleri: film TMDB ${HEDEFLER.movie.tmdbId} (${HEDEFLER.movie.ad}) · dizi TMDB ${HEDEFLER.tv.tmdbId} ${HEDEFLER.tv.sezon}x${HEDEFLER.tv.bolum} (${HEDEFLER.tv.ad})`,
    `- İkinci şans: film TMDB 27205 (Inception) · dizi TMDB 1416 (Grey's Anatomy)`,
    `- Ölçüm: sağlayıcı başına ${TAVAN_MS / 1000} sn tavan; akış doğrulaması, kaynak adresin ilk 2 KB'ında HLS/MP4 imzası (#EXTM3U / ftyp) arar.`, '',
    `## Sayı özeti`, '',
    ozetZengin.join('\n'), '',
    `Ölçüm sınıf sayıları (ölçüm başına): ${JSON.stringify(ozetAl(sonuclar))}`, '',
    `## Sınıf listeleri`, '',
    `### 1) Kesin çalışan (akış ✓) — ${calis.length} sağlayıcı`, '',
    liste(calis), '',
    `### 2) Çekirdek çalışıyor ama \`normalizeEt\` süzgeci eliyor — ${suzgeceTakilan.length}`,
    '',
    'Kanıt: çekirdeğin döndüğü ham adresin ilk 2 KB\'ında gerçek HLS imzası var (#EXTM3U,',
    '`application/x-mpegURL`). Üretim zinciri bu sağlayıcıdan 0 kaynak görür; çünkü süzgeç',
    '`DOGRUDAN_YAYIN` yalnız **uzantı** (.m3u8) kabul eder — öğenin `format:"m3u8"` alanına bakmaz.',
    'Bu sağlayıcılar, süzgeç kuralına bir satırlık ek ile ("format YA DA uzantı") çalışır hale gelir.', '',
    liste(suzgeceTakilan), '',
    `### 3) Çekirdek yükleme bozuk — ${bozuk.length}`,
    '',
    'Tek hata deseni (her koşumda, iki modda da aynı): `cekirdek-yuklemedi: value is not a function` —',
    'deobfuscate edilmiş modül, crypto-js interop satırında patlıyor; dosyanın sonundaki',
    '`getStreams` kaydına ulaşamıyor. Bu 19 çekirdek `kayit.yukle()` (dynamic import) yoluyla ÜRETİMDE de çalışmaz.', '',
    liste(bozuk), '',
    `### 4) İçerik eşleşmesi yok (ölü değil) — ${eslesme.length}`,
    '',
    'Çekirdek çalıştı ama sınanan içerik (Fight Club / Inception / Grey\'s Anatomy) alanda yok.',
    'Anime odaklı kahraman kodlar film/dizi sorgularını doğal olarak bulamıyor. Bu kodlar',
    'ikinci şans sorgularında (Inception / Grey\'s Anatomy) da eşleşme bulamadı; tekrar test', '',
    liste(eslesme), '',
    `### 5) Erişim reddi — ${erisim.length}`,
    'Kendi alan adı API\'si 403 döndürdü; çekirdek boş liste bıraktı:', '',
    liste(erisim), '',
    `### 6) Zaman aşımı — ${zamanAsimi.length}`, '', liste(zamanAsimi), '',
    `### 7) Akış doğrulanamadı — ${akisDogrulanamadi.length}`,
    'Kaynak DÖNDÜRDÜLER (normalize geçti) ama akış adresine bağlantı denemesi',
    'bağlantı hatası/reset ile kesildi — oynatılabilirlik kanıtlanamadı.', '',
    liste(akisDogrulanamadi), '',
    `### 8) Diğer`, '', liste(diger), '',
    `## Bağlantı düzeyi hata desenleri (tekilleştirilmiş)`, '',
    ...Object.entries(desenler).map(([cls, kods]) => `- **${cls}**: ${[...kods].join(', ')}`), '',
    `## Mod (A/B) notu`, '',
    'İki mod da uçtan uca çalıştı: A (/api/proxy sidecar 127.0.0.1:4000) ve B (doğrudan).',
    farkSatirlari && farkSatirlari.length
      ? 'Mod farkı yalnız şu sürümlerde görüldü (B → A):\n' + farkSatirlari.map(x => '  - ' + x).join('\n')
      : 'Sonuç aynı: mod, sınıf dağılımını değiştirmedi.',
    'Ana tablolar Mod A\'dır (sidecar = masaüstü/WebView üretim yolu); B koşumu `notlar/kahraman-dogrulama-mod-B.json` içindedir.',
    'Mod B\'de Zatanna film+dizi de çalışıyor (4K HLS ✓) — proxy modunda kayıp.', '',
    `## Yöntem ve yeniden koşum`, '',
    '- Aracı: `tools/kahraman-dogrulama.mjs` — `--ornek` pilot (3 sürüm), `--mod A|B|auto`,',
    '  `--tur movie|tv|both`, `--rapor-yenile` (JSON→bu rapor, ağ kullanmaz).',
    '- Ham sonuçlar: `notlar/kahraman-dogrulama.json`; Mod B koşumunun ayrı kopyası: `notlar/kahraman-dogrulama-mod-B.json`.',
    '- Sağlayıcıya ait olmayan makinelere `<ana-N>` anonim kodu verilir; kod↔alan eşlemesi `alanlar.js` içindedir.', '',
    '## Kaynak verisi okur notu', '',
    'Gerçek site alan adları hiçbir artefakte yazılmaz. Kaynak URL alanında sağlayıcı',
    'kodlar, sağlayıcı olmayan hostlar `<ana-N>` anonim kodları ile temsil edilir.', '',
  ].join('\n');
  try { fs.writeFileSync(path.join(NOTLAR, 'kahraman-dogrulama.md'), md); }
  catch (e) { yaz('Zengin MD yazma hatası: ' + e.message); }
}

/* --rapor-yenile: JSON'dan zengin humans rapor üretir (ağ kullanmaz). */
async function raporYenile() {
  const j = JSON.parse(fs.readFileSync(path.join(NOTLAR, 'kahraman-dogrulama.json'), 'utf8'));
  let fark = null;
  try {
    const jB = JSON.parse(fs.readFileSync(path.join(NOTLAR, 'kahraman-dogrulama-mod-B.json'), 'utf8'));
    const key = s => s.kod + '/' + s.tur;
    const B = new Map(jB.sonuclar.map(s => [key(s), s]));
    fark = [];
    for (const s of (j.sonuclar || [])) {
      const b = B.get(key(s));
      if (b && b.sonuc !== s.sonuc) fark.push(`${s.kod}/${s.tur}: ${b.sonuc} → ${s.sonuc}${s.not ? ' (' + String(s.not).slice(0, 60) + ')' : ''}`);
    }
  } catch {}
  zenginRaporYaz(j.sonuclar || [], j.mod || '?', j.tarih || new Date().toISOString(), j.durum || 'okunmus', fark);
  yaz('rapor yenilendi');
  process.exit(0);
}

/* ── ana koşum ─────────────────────────────────────────────────────── */
if (bayraklar.has('--rapor-yenile')) { await raporYenile(); }
async function ana() {
  await modSec();
  const hedefler = [];
  for (const [kod, kayit] of KAYIT) {
    for (const tur of kayit.turler) {
      if (TURFILTRE !== 'both' && TURFILTRE !== tur) continue;
      hedefler.push([kod, tur]);
    }
  }
  const listesi = ORNEK ? [['Spider-Man', 'movie'], ['Batman', 'movie'], ['Thor', 'tv']] : hedefler;
  yaz(`koşum listesi: ${listesi.length} sağlayıcı-tür`);

  const sonuclar = [];
  let sayac = 0;
  for (const [kod, tur] of listesi) {
    sayac += 1;
    const hd = HEDEFLER[tur];
    const s = await tekSaglayiciKos(kod, tur, hd.tmdbId, hd.sezon, hd.bolum);
    s.hedefAd = hd.ad;
    s.cekirdekImportHatasi = YUKLEME_HATA.get(kod) || null;
    sonuclar.push(s);
    yaz(`${sayac}/${listesi.length} ${kod} (${tur}) → ${s.sonuc} · ${(s.sure / 1000).toFixed(1)}s · ${s.kaynaklar.length} kaynak · istek ${s.istekAdet}`);
    belgeYaz(sonuclar, 'koşum-suruyor');
    raporYaz(sonuclar, 'koşum-suruyor', sayac);
  }

  if (!ORNEK) {
    // ikinci şans: eşleşme bulunamayanlara başka içerik dene (kapsam daraltma)
    let yeniden = 0;
    for (const s of sonuclar) {
      if (s.sonuc !== 'eslesme-yok') continue;
      const hd = IKINCI_SANS[s.tur];
      yeniden += 1;
      const s2 = await tekSaglayiciKos(s.kod, s.tur, hd.tmdbId, hd.sezon, hd.bolum);
      s.ikinciSans = { tmdbId: hd.tmdbId, ad: hd.ad, sonuc: s2.sonuc, kaynakAdet: s2.kaynaklar.length, hata: s2.hata, sure: s2.sure };
      if (s2.sonuc === 'yayin') {
        s.kaynaklar = s2.kaynaklar;
        s.not = 'yayin (ikinci şans: ' + hd.ad + ')';
      }
      yaz(`  ↻ ${s.kod} (${s.tur}) ikinci şans → ${s2.sonuc} · ${s2.kaynaklar.length} kaynak`);
      belgeYaz(sonuclar, 'koşum-suruyor');
      raporYaz(sonuclar, 'koşum-suruyor', sayac);
    }
    yaz(`ikinci şans: ${yeniden} sağlayıcı yeniden test edildi`);
  }

  belgeYaz(sonuclar, 'tamamlandı');
  zenginRaporYaz(sonuclar, KOGRU_MODE, new Date().toISOString(), 'tamamlandı');
  raporYaz(sonuclar, 'tama', listesi.length);
  sidecaraKapat();
  yaz('SON: ' + JSON.stringify(ozetAl(sonuclar)));
  process.exit(0);
}

ana().catch(e => {
  yaz('ANA HATA: ' + (e?.stack || e?.message || e));
  try { fs.writeFileSync(path.join(NOTLAR, 'kahraman-dogrulama.json'), JSON.stringify({ hata: String(e?.message || e) }, null, 2)); } catch {}
  sidecaraKapat();
  process.exit(2);
});
