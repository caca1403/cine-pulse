/* ==========================================================================
   CinePulse — MASAÜSTÜ SAĞLAYICI ROTA KÖPRÜSÜ (Electron yerel medya sunucusu)
   --------------------------------------------------------------------------
   SORUN (inceleme 2026-11-13 #2): birinci taraf çekirdekler isteklerini
   `/api/<kod>/...` göreli yoluyla atar. Android bunu native-routes.json'dan,
   web CF worker `cf/provider-routes.js` üzerinden karşılar; Electron'un yerel
   medya sunucusunda ise bu kodlar için handler YOKTU → 404 → çekirdek sessizce
   0 kaynak dönüyordu. Yani aynı çekirdek mobil/web'de çalışırken masaüstünde
   çalışmıyordu.

   ÇÖZÜM: Masaüstü de AYNI tabloyu (android/app/src/main/assets/native-routes.json)
   okur; alan güncellemesi tek yerde yapılır. `mirrors` yedeği web ile aynı
   sırayla uygulanır. Medya akışı bu yoldan GEÇMEZ (oynatma /api/hls_proxy).
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* Medya sunucusunun kendi uçları: rota tablosunda kod çakışması olsa bile
   yakalanmamalı (sonsuz yeniden yönlendirme / ikili işleyici çakışması). */
const YEREL_UCLAR = new Set([
  'imdbRating', 'trakt_token', 'xtream_panels', 'aria_key',
  'proxy', 'hls_proxy', 'stream-proxy', 'mkv_stream', 'img_proxy', 'subtitles',
  'live_tv_stream', 'live_sources', 'resolve', 'ddz', 'epg', 'fanart', 'release',
  'download_apk', 'cinepulse.apk', 'list', 'health'
]);

const TARAYICI_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

let TABLO = null;

/** Rota tablosunu (tek kaynak: Android varlığı) bir kez yükler.
 *  Paketlenmiş sürümde dosya `files` listesine eklendiği için bulunur;
 *  bulunamazsa boş tablo döner (köprü devre dışı, uygulama çalışmaya devam eder). */
export function rotaTablosunuYukle({ yol } = {}) {
  if (TABLO) return TABLO;
  const adaylar = [
    yol,
    path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'assets', 'native-routes.json'),
    path.join(__dirname, 'native-routes.json'),
  ].filter(Boolean);
  for (const aday of adaylar) {
    try {
      const veri = JSON.parse(fs.readFileSync(aday, 'utf8'));
      if (veri && typeof veri === 'object' && !Array.isArray(veri)) {
        TABLO = veri;
        return TABLO;
      }
    } catch (_) { /* sıradaki adaya geç */ }
  }
  TABLO = {};
  return TABLO;
}

/** Test/teşhis için tabloyu sıfırlar. */
export function rotaTablosunuSifirla() { TABLO = null; }

/**
 * `/api/<kod>/<yol>?<sorgu>` → { kod, konf, yol, sorgu, adaylar } | null
 * (kod tabloda yoksa ya da medya sunucusunun kendi ucuysa null).
 */
export function saglayiciRotaCoz(pathname, arama = '', tablo = null) {
  const tabloKullan = tablo || rotaTablosunuYukle();
  const m = /^\/api\/([A-Za-z0-9_-]+)(\/.*)?$/.exec(String(pathname || ''));
  if (!m) return null;
  const kod = m[1];
  if (YEREL_UCLAR.has(kod)) return null;
  if (!Object.prototype.hasOwnProperty.call(tabloKullan, kod)) return null;
  const konf = tabloKullan[kod];
  if (!konf || typeof konf.base !== 'string' || !/^https?:\/\//i.test(konf.base)) return null;
  const adaylar = [konf.base]
    .concat(Array.isArray(konf.mirrors) ? konf.mirrors : [])
    .filter((u) => typeof u === 'string' && /^https?:\/\//i.test(u));
  return { kod, konf, yol: m[2] || '', sorgu: arama || '', adaylar };
}

/** Hedef isteğin başlıklarını (çekirdeğin beklediği Referer/Origin dahil) kurar. */
export function saglayiciBasliklari(konf, ekBasliklar = {}) {
  const basliklar = {
    'User-Agent': TARAYICI_UA,
    Accept: 'text/html,application/xhtml+xml,application/json,*/*',
    'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
    ...(konf && konf.headers && typeof konf.headers === 'object' ? konf.headers : {}),
    ...(konf && konf.referer ? { Referer: konf.referer } : {}),
  };
  for (const [ad, deger] of Object.entries(ekBasliklar || {})) {
    if (!ad || deger == null) continue;
    // Host/uzunluk gibi taşıyıcı başlıklar hedefe taşınmaz.
    if (/^(host|content-length|connection|transfer-encoding)$/i.test(ad)) continue;
    basliklar[ad] = String(deger);
  }
  return basliklar;
}

/** Aday listesinde sırayla dener; çalışan tabanın index'ini döndürür. */
export async function saglayiciIstekDene({ adaylar, yol, sorgu = '', method = 'GET', basliklar, govde, fetchFn = globalThis.fetch, timeoutMs = 16000 }) {
  let sonHata = null;
  let sonCevap = null;
  let calisanIndex = 0;
  for (let i = 0; i < adaylar.length; i += 1) {
    const base = String(adaylar[i]).replace(/\/+$/, '');
    const hedefUrl = `${base}${yol.startsWith('/') || yol === '' ? yol : `/${yol}`}${sorgu}`;
    try {
      const cevap = await fetchFn(hedefUrl, {
        method,
        headers: basliklar,
        body: govde,
        redirect: 'follow',
        signal: typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
          ? AbortSignal.timeout(timeoutMs)
          : undefined,
      });
      sonCevap = cevap;
      if (cevap && cevap.status < 500) { calisanIndex = i; break; }
    } catch (hata) {
      sonHata = hata;
    }
  }
  return { cevap: sonCevap, hata: sonHata, calisanIndex };
}
