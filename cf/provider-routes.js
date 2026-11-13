/* ==========================================================================
   CinePulse — WEB SAĞLAYICI ROTA ÇÖZÜCÜSÜ (Cloudflare Worker)
   --------------------------------------------------------------------------
   SORUN (2026-11-13 ölçümü): birinci taraf çekirdekler sitelerine
   `/api/<kod>/...` göreli isteğiyle gider (bkz. src/providers/ortakCekirdek.js
   rotaYol). Android'de bu isteği NativeMediaGateway karşılar ve
   `android/app/src/main/assets/native-routes.json` tablosundan hedef siteyi
   bulur. Web'de ise `/api/<kod>/...` doğrudan worker'a düşüyordu ve
   `functions/[[route]].js` / `api/[...all].js` yığınının böyle bir tablosu
   YOKTU → 404 → çekirdek sessizce 0 kaynak döndürüyordu. Yani aynı çekirdek
   mobilde çalışıp web'de çalışmıyordu (parite kırığı).

   ÇÖZÜM: worker de AYNI JSON dosyasını okur (JSON import'u build sırasında
   paketlenir). Böylece alan adı güncellemesi TEK yerde yapılır
   (native-routes.json) ve hem mobil köprü hem web worker aynı anda düzelir.
   Rota tablosunun kopyası YOK; `tests/cf-saglayici-rotalari.test.mjs`
   tablonun Android varlığıyla aynı dosyadan geldiğini ve çekirdeklerin
   kullandığı her kodun tabloda bulunduğunu doğrular.

   Yalnız CORS'u aşan sunucu-taraflı fetch yapılır; medya akışı bu yoldan
   GEÇMEZ (oynatma /api/hls_proxy hattındadır). Bu yüzden yanıt gövdesi
   tamponlanabilir (JSON/HTML API yanıtları).
   ========================================================================== */

import { ROTA_TABLOSU as ROTALAR } from './provider-rotalari.js';
import { anonimJson, anonimGerekliMu } from '../api/_anonim.js';

/* Worker'ın KENDİ uçları: rota tablosunda bulunsalar bile (Android köprüsü
   bunları yerel ağ geçidine yönlendirir) burada yakalanmamalı; sonsuz
   döngü/sonsuz yeniden yönlendirme olurdu. */
const YEREL_UCLAR = new Set(['imdbRating', 'trakt_token', 'xtream_panels', 'aria_key']);

/* Worker'ın başka katmanlarının (api/[...all].js, cf/resolve.js) karşıladığı
   yollar: rota tablosunda kod çakışması olsa bile öncelik onlarda. */
const YEREL_YOLLAR = new Set([
  'proxy', 'hls_proxy', 'stream-proxy', 'mkv_stream', 'img_proxy', 'subtitles',
  'live_tv_stream', 'live_sources', 'resolve', 'ddz', 'dml', 'epg', 'fanart', 'release',
  'download_apk', 'cinepulse.apk',
]);

const TARAYICI_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

/**
 * `/api/<kod>/<yol>?<sorgu>` → { kod, konf, yol, sorgu, adaylar } | null
 * (kod rota tablosunda yoksa ya da worker'ın yerel ucuysa null).
 * `adaylar`: birincil base + varsa tablodaki `mirrors` yedekleri.
 */
export function saglayiciRotaCoz(pathname, arama = '') {
  const m = /^\/api\/([A-Za-z0-9_-]+)(\/.*)?$/.exec(String(pathname || ''));
  if (!m) return null;
  const kod = m[1];
  if (YEREL_UCLAR.has(kod) || YEREL_YOLLAR.has(kod)) return null;
  if (!Object.prototype.hasOwnProperty.call(ROTALAR, kod)) return null;
  const konf = ROTALAR[kod];
  if (!konf || typeof konf.base !== 'string' || !/^https?:\/\//i.test(konf.base)) return null;
  const adaylar = [konf.base]
    .concat(Array.isArray(konf.mirrors) ? konf.mirrors : [])
    .filter((u) => typeof u === 'string' && /^https?:\/\//i.test(u));
  return { kod, konf, yol: m[2] || '', sorgu: arama || '', adaylar };
}

/* Son ölçülen çalışan taban sırası (kod → aday index'i). Worker izoleleri
   arasında paylaşılmaz; her izolde ilk istekte birincil denenir, yedek
   çalışırsa o izolde öne alınır. Kalıcılık için KV gerekmez: hata anında
   yeniden denenebilir olması yeterli. */
const CALISAN_SIRA = new Map();

/** Rota tablosunun tamamı (test/teşhis; salt-okunur kopya). */
export function saglayiciRotalari() {
  return { ...ROTALAR };
}

/**
 * Sağlayıcı isteğini worker'dan hedef siteye taşır.
 * @returns {Promise<Response|null>} rota yoksa null (çağıran normal akışa düşer)
 */
export async function saglayiciYaniti(request, url, fetchFn = globalThis.fetch) {
  const hedef = saglayiciRotaCoz(url.pathname, url.search);
  if (!hedef) return null;

  const cors = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, HEAD, POST, OPTIONS',
    'access-control-allow-headers': 'Content-Type, Accept, Accept-Language, Range, X-Requested-With, Cf-Control, Language, Site, Device',
    'access-control-expose-headers': 'Content-Length, Content-Range, Accept-Ranges, X-Upstream-URL',
  };
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (!['GET', 'HEAD', 'POST'].includes(request.method)) {
    return new Response(JSON.stringify({ success: false, error: 'method-not-allowed' }), {
      status: 405, headers: { ...cors, 'content-type': 'application/json; charset=utf-8' },
    });
  }

  const { konf } = hedef;
  const basliklar = {
    'User-Agent': TARAYICI_UA,
    Accept: 'text/html,application/xhtml+xml,application/json,*/*',
    'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
    ...(konf.headers && typeof konf.headers === 'object' ? konf.headers : {}),
    ...(konf.referer ? { Referer: konf.referer } : {}),
  };

  let govde;
  if (request.method === 'POST') {
    try {
      const ct = request.headers.get('content-type');
      if (ct) basliklar['Content-Type'] = ct;
      govde = await request.arrayBuffer();
    } catch (_) { govde = undefined; }
  }

  /* YEDEK ALAN (2026-11-13): tablo girişinde `mirrors` varsa birincil alan
     ağ/TLS/5xx ile düşünce sıradaki denenir. Mobil ağ geçidi yalnız `base`
     okur; yedeği web tarafı uygular (aynı tablo, tek kaynak). */
  const oncekiSira = CALISAN_SIRA.get(hedef.kod) || 0;
  const adaylar = hedef.adaylar.map((url, idx) => ({ url, idx }));
  if (oncekiSira > 0 && oncekiSira < adaylar.length) {
    const secili = adaylar.splice(oncekiSira, 1)[0];
    adaylar.unshift(secili);
  }

  let cevap = null;
  let sonHata = null;
  let sonHedefUrl = '';
  for (let i = 0; i < adaylar.length; i += 1) {
    const base = String(adaylar[i].url).replace(/\/+$/, '');
    // Mobil köprüyle BİREBİR aynı birleştirme: base + (yol başına '/' garantisi) + sorgu
    const hedefUrl = `${base}${hedef.yol.startsWith('/') || hedef.yol === '' ? hedef.yol : `/${hedef.yol}`}${hedef.sorgu}`;
    sonHedefUrl = hedefUrl;
    try {
      const adayCevap = await fetchFn(hedefUrl, {
        method: request.method,
        headers: basliklar,
        body: govde,
        redirect: 'follow',
        signal: typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
          ? AbortSignal.timeout(16000)
          : undefined,
      });
      cevap = adayCevap;
      if (adayCevap && adayCevap.status < 500) {
        /* KALICI TERCİH (2026-11-13 inceleme bulgusu): başarılı adayın
           ORİJİNAL index'i saklanır. Önceki kod reorder sonrası i=0 ile
           birincili karıştırıp tercihi siliyordu → her istek ölü birincili
           yeniden 16 sn bekliyordu. Yalnız gerçek birincil (idx 0) başarılıysa
           tercih temizlenir. */
        const basariliIdx = adaylar[i].idx;
        if (basariliIdx > 0) CALISAN_SIRA.set(hedef.kod, basariliIdx);
        else CALISAN_SIRA.delete(hedef.kod);
        break;
      }
      /* 5xx alan: sıradaki adayı dene. Tüm adaylar düşerse son yanıt döner
         (çağıran gerçek durum kodunu görür; sahte 200 üretilmez). */
    } catch (hata) {
      sonHata = hata;
    }
  }

  if (!cevap) {
    return new Response(JSON.stringify({
      success: false,
      error: 'upstream-unreachable',
      detail: String(sonHata && sonHata.message || sonHata || 'tüm alan adları düştü').slice(0, 120),
    }), { status: 502, headers: { ...cors, 'content-type': 'application/json; charset=utf-8' } });
  }

  const yanitBasliklari = { ...cors };
  const ct = cevap.headers.get('content-type') || '';
  if (ct) yanitBasliklari['content-type'] = ct;
  const uzunluk = cevap.headers.get('content-length');
  if (uzunluk) yanitBasliklari['content-length'] = uzunluk;
  // Yönlendirme sonrası nihai adres teşhis için (mobil köprü X-Upstream-URL basar).
  if (cevap.url && /^https?:\/\//i.test(cevap.url)) yanitBasliklari['x-upstream-url'] = cevap.url;

  /* KURAL (2026-11-13 inceleme bulgusu): kullanıcıya görünen metinde gerçek
     site adı YOK. Eski relay (api/[...all].js + api/_anonim.js) JSON
     gövdelerdeki name/source/badge/label/provider değerlerini kod adına
     çeviriyordu; yeni worker rotası ham gövde döndürüp bu kuralı deliyordu.
     Yalnız JSON (+yalnız bilinen sağlayıcı host'ları) tamponlanır; HTML'e
     DOKUNULMAZ (çekirdekler HTML'i yapı olarak parse ediyor). */
  const jsonMu = /json/i.test(ct);
  const boyut = Number(uzunluk || 0);
  if (request.method !== 'HEAD' && jsonMu && anonimGerekliMu(sonHedefUrl) && (!boyut || boyut < 5 * 1024 * 1024)) {
    try {
      const ham = await cevap.text();
      const anonim = anonimJson(ham);
      const govde = anonim === ham ? ham : anonim;
      delete yanitBasliklari['content-length'];
      return new Response(govde, { status: cevap.status, headers: yanitBasliklari });
    } catch (_) {
      /* tamponlama başarısız → aşağıdaki ham akışa düş (akış asla kırılmaz) */
    }
  }

  return new Response(request.method === 'HEAD' ? null : cevap.body, {
    status: cevap.status,
    headers: yanitBasliklari,
  });
}
