/* ==========================================================================
   CinePulse Studio — NUVO EKLENTİ DEPOSU JS MOTORU (kullanıcı 2026-10-29:
   "Nuvio eklenti depolarının JS motorunu CinePulse'a ekle")
   --------------------------------------------------------------------------
   Nuvio (github.com/NuvioMedia/NuvioMobile, cmp-rewrite) depoları manifest.json
   içinde scrapers[] taşır; her scraper bir esbuild-CJS JS dosyasıdır ve Nuvio'da
   QuickJS üzerinde koşar. Host API sözleşmesinin kanon kaynakları (JsBindings.kt,
   PluginRuntime.kt, FetchBridge.kt, DomBridge.kt, CryptoBridge.kt) bize şunu
   söyler — bu dosya aynı sözleşmenin web/WebView karşılığıdır:

     * Modül biçimi (PluginRuntime.wrapPluginModule + JsBindings.staticCallCode):
       `module.exports.getStreams` aranır (yoksa globalThis.getStreams), çağrı
       imzası `getStreams(tmdbId, mediaType, season, episode)` — season/episode
       movie için undefined. Sonuç Promise<Stream[]>; hata → boş dizi.
     * Enjekte global'ler (JsBindings.staticPolyfillCode — birebir liste):
       SCRAPER_ID, SCRAPER_SETTINGS, TMDB_API_KEY, global/window/self aliasları,
       setTimeout/clearTimeout/setInterval/clearInterval, fetch, AbortController/
       AbortSignal, atob/btoa, URL/URLSearchParams, crypto (WebCrypto benzeri) +
       CryptoJS (native köprü), cheerio (DomBridge köprüsü), require(modül haritası),
       TextEncoder/TextDecoder, Array/Object/String polyfill'leri (bizde native).
     * require haritası (requirePolyfill): cheerio | cheerio-without-node-native |
       react-native-cheerio → cheerio; crypto-js → CryptoJS; gerisi throw.
     * fetch sözleşmesi (FetchBridge.__native_fetch): method/headers/body/
       followRedirects; yanıt {ok,status,statusText,url,body,headers}; yanıtta
       bodyBase64 de var — bizde Response native, birebir karşılığı.
     Eşzamanlılık/tavan (PluginRuntime): MAX_CONCURRENT_PLUGINS=10, 60 sn timeout.
       Biz CinePulse tarama bütçesine uyuyoruz: scraper başına 20 sn, ≤4 eşzamanlı.

   CINEPULSE'TA KARŞILIKLAR (shim matrisi):
     fetch / XHR   → enjekte edilen kopruFetch (src/providers/vekil.js) — CORS'u
                     uygulama vekilinden geçirir, CF challenge çözer. XHR arayüzü
                     aynı fetch shim'in üstünde üretilir (provider'lar dener).
     cheerio       → nuvioDom.js (WebView: natif DOMParser; Node: mini parser)
     CryptoJS      → nuvioCrypto.js (saf-JS AES-CBC/Pkcs7 + WordArray altkümesi)
     console       → ad-önekli yönlendirme ( SCRAPER > … )
     setTimeout vb → natif (her iki ortamda var)
     window/document/geçmez → sandbox parametreyle karartılır (aşağıdaki not).

   GÜVENLİK NOTU: üçüncü taraf provider JS'i `new Function` kapsamıyla koşar —
   sandbox zayıf bir sınırdır; window/document sızdırılmaz, require yalnız bilinen
   iki modülü görür. Risk kabulü: depoyu kullanıcı kendisi ekliyor (Nuvio'daki gibi).
   ========================================================================== */

import { cheerio as NUVID_CHEERIO } from './nuvioDom.js';
import { CryptoJS as NUVID_CRYPTO } from './nuvioCrypto.js';

const KOD_CACHE_ONEK = 'cp_nuvio_kod:';
const KOD_CACHE_TDL = 24 * 3600_000; // provider kodu 24 saatte bir tazelenir
export const SCRAPER_TIMEOUT_MS = 20_000; // Nuvio'nun 60 sn'si yerine CinePulse bütçesi
const MAKS_EŞZAMANLI = 4;                 // Nuvio: 10 — WebView bellek bütçesi daha sıkı

/* ── XHR shim'i: enjekte fetch üstünde XMLHttpRequest arayüzü ───────────────
   Nuvio QuickJS'e XHR vermez (yalnız fetch); provider'lar fetch kullanıyor ama
   `X-Requested-With: XMLHttpRequest` başlık değeri yaygın — arayüzün kendisini
   de sağlıyoruz ki XHR bekleyen bir depo manifesti sessiz ölmesin. Destek:
   open(method,url,async,user,pass)/setRequestHeader/send(body)/abort, status,
   statusText, responseText, responseURL, responseHeader (set-cookie düşer),
   getResponseHeader/getAllResponseHeaders, onreadystatechange+onload/onerror/
   ontimeout, timeout. */
/* Zaman aşımı sızıntısı düzeltmesi (test 2026-10-29): race sonrası bekleyen
   timer İPTAL edilmezse reddi geç kalır → unhandledRejection + 20 sn bekleme. */
function asilZamanAsimi(ms, ad) {
  let t;
  const p = new Promise((_, ret) => { t = setTimeout(() => ret(new Error(ad + ' ' + ms + 'ms')), ms); });
  p.bitiR = () => clearTimeout(t);
  return p;
}
const asilIptalEt = (p) => { try { p && typeof p.bitiR === 'function' && p.bitiR(); } catch (_) {} };

function xhrSinifi(fetchImpl) {
  return class XMLHttpRequestNuvio {
    constructor() {
      this.readyState = 0; this.status = 0; this.statusText = '';
      this.responseText = ''; this.response = ''; this.responseURL = '';
      this.timeout = 0; this.withCredentials = false; this.responseType = '';
      this._basliklar = {}; this._metod = 'GET'; this._url = ''; this._govde = null;
      this._acildi = false; this._yikildi = false; this._aborted = false;
      this.onreadystatechange = null; this.onload = null; this.onerror = null;
      this.ontimeout = null; this.onloadend = null; this.ontimeout = null;
    }
    open(metod, url, async = true) { this._metod = String(metod || 'GET').toUpperCase(); this._url = String(url); this._acildi = true; this._setState(1); }
    setRequestHeader(ad, deger) { if (ad != null) this._basliklar[String(ad)] = String(deger); }
    getAllResponseHeaders() { return Object.entries(this._yanitBasliklari || {}).map(([k, v]) => `${k}: ${v}`).join('\r\n'); }
    getResponseHeader(ad) { const k = String(ad).toLowerCase(); return (this._yanitBasliklari || {})[k === 'set-cookie' ? '\u0000' : k] ?? null; }
    overrideMimeType(_) {}
    abort() { this._aborted = true; this._ctrl?.abort(); }
    _setState(n) { this.readyState = n; try { this.onreadystatechange?.(); } catch (_) {} }
    send(govde) {
      if (!this._acildi) throw new Error('send: open() önce çağrılmalı');
      this._govde = govde ?? null;
      this._setState(2);
      this._ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const signal = this._ctrl?.signal;
      const calisma = Promise.resolve()
        .then(() => fetchImpl(this._url, {
          method: this._metod, headers: this._basliklar,
          body: this._govde != null && this._metod !== 'GET' && this._metod !== 'HEAD' ? this._govde : undefined,
          redirect: 'follow', ...(signal ? { signal } : {}),
        }))
        .then((resp) => Promise.all([
          resp.text(),
          typeof resp.headers?.forEach === 'function' ? resp.headers : new Map(Object.entries(resp.headers || {})),
          resp.url || this._url,
        ]).then(([metin, hdrs, sonUrl]) => {
          const h = {};
          if (typeof hdrs.forEach === 'function') hdrs.forEach((v, k) => { if (String(k).toLowerCase() !== 'set-cookie') h[String(k).toLowerCase()] = v; });
          else for (const [k, v] of hdrs) if (String(k).toLowerCase() !== 'set-cookie') h[String(k).toLowerCase()] = v;
          if (this._aborted || this._yikildi) return;
          this.status = resp.status || 0; this.statusText = resp.statusText || '';
          this.responseText = this.response = metin || ''; this.responseURL = sonUrl || '';
          this._yanitBasliklari = h;
          this._setState(4);
          try { this.onload?.(); } catch (_) {}
          try { this.onloadend?.(); } catch (_) {}
        }));
      let zamanlayici = null;
      const kirin = Promise.race(this.timeout > 0 ? [calisma, new Promise((_, ret) => {
        zamanlayici = setTimeout(() => ret(Object.assign(new Error('XHR timeout'), { name: 'TimeoutError' })), this.timeout);
      })] : [calisma]);
      kirin.catch((hata) => {
        if (zamanlayici) clearTimeout(zamanlayici);
        if (this._yikildi) return;
        this.status = 0; this.responseText = this.response = '';
        this._setState(4);
        try {
          if (hata?.name === 'TimeoutError') this.ontimeout?.();
          this.onerror?.(hata);
          this.onloadend?.();
        } catch (_) {}
      }).then(() => { if (zamanlayici) clearTimeout(zamanlayici); });
    }
  };
}

/* ── fetch shim'i: enjekte edilen köprüyse kopruFetch, değilse natif fetch.
   Provider'ların 3. argüman olarak `{}` yerine timeout sayısı geçtiği yerler
   var (patronDizipal `fetch(url, opts, 5e3)` — 3. argüman yok sayılır). ───── */
function fetchShimOlustur(fetchImpl) {
  return async function nuvioFetch(girdi, secenek) {
    const url = typeof girdi === 'string' ? girdi : (girdi && girdi.url) || String(girdi);
    const opts = secenek && typeof secenek === 'object' ? { ...secenek } : {};
    return fetchImpl(url, opts);
  };
}

/* ── sandbox modülü: provider JS'ini new Function kapsamıyla değerlendir.
   window/document GERÇEK nesneler olarak geçirilmez: provider kendi sandbox
   penceresini görür (Nuvio polyfill'leri window:=globalThis varsayar). */
function modulDerle(kod, ctx) {
  const { ad, fetchImpl, log } = ctx;
  // banner: Nuvio'nun staticPolyfillCode'undaki sabitler — SCRAPER ayarları
  // henüz UI'da yok, boş nesne; TMDB_API_KEY globalde tanımlıysa görünür.
  // "use strict" YOK (kullanıcı 2026-10-29): gerçek Nuvio sandbox'ı strict
  // değil; TR vendor dosyaları (Dizilla/HDF/SelcukFlix) esbuild-getter'lı
  // exports'a `_exp.getStreams = …` YAZAR — strict'te TypeError ile modülün
  // tamamı çöker, strict'siz Nuvio'daki gibi sessiz no-op olur ve satırlar akar.
  // TMDB_API_KEY yalnız dosya kendisi bildirmiyorsa tanımlanır: TR dosyaları
  // `const TMDB_API_KEY` bildirir → banner'la "zaten bildirildi" çarpışması.
  const kodMetni = String(kod);
  const dosadaTmdb = /(?:^|[\s;{}(,=:?!])(?:var|let|const)\s+TMDB_API_KEY\b/.test(kodMetni);
  const onEk = ''
    + 'var SCRAPER_ID = ' + JSON.stringify(ctx.scraperId || ad) + ';\n'
    + 'var SCRAPER_SETTINGS = {};\n'
    + (dosadaTmdb ? '' : 'var TMDB_API_KEY = (typeof globalThis !== "undefined" && globalThis.TMDB_API_KEY) || undefined;\n')
    + 'var __cpWin = { SCRAPER_ID: SCRAPER_ID, SCRAPER_SETTINGS: SCRAPER_SETTINGS };\n'
    + 'var window = __cpWin; var self = __cpWin; var global = __cpWin;\n';
  const XHR = xhrSinifi(fetchImpl);
  const konsol = {
    log: (...a) => log('log', a), info: (...a) => log('log', a),
    warn: (...a) => log('warn', a), error: (...a) => log('error', a), debug: () => {},
  };
  // require: Nuvio requirePolyfill'in birebir haritası (gerisi net throw).
  const gereksinim = (adModul) => {
    if (adModul === 'cheerio' || adModul === 'cheerio-without-node-native' || adModul === 'react-native-cheerio') return NUVID_CHEERIO;
    if (adModul === 'crypto-js') return NUVID_CRYPTO;
    throw new Error(`nuvioMotoru: modül '${adModul}' sandbox'ta yok (Nuvio haritası yalnız cheerio/crypto-js veriyor)`);
  };
  const run = new Function(
    'module', 'exports', 'require', 'fetch', 'XMLHttpRequest', 'console', 'atob', 'btoa', 'URL', 'URLSearchParams', 'TextEncoder', 'TextDecoder', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval',
    onEk + String(kod)
  );
  const modul = { exports: {} };
  const oncekiGlobal = typeof globalThis.getStreams === 'function' ? globalThis.getStreams : null;
  run(
    modul, modul.exports, gereksinim, fetchImpl, XHR, konsol,
    typeof atob === 'function' ? atob : undefined,
    typeof btoa === 'function' ? btoa : undefined,
    typeof URL !== 'undefined' ? URL : undefined,
    typeof URLSearchParams !== 'undefined' ? URLSearchParams : undefined,
    typeof TextEncoder !== 'undefined' ? TextEncoder : undefined,
    typeof TextDecoder !== 'undefined' ? TextDecoder : undefined,
    typeof setTimeout === 'function' ? setTimeout : undefined,
    typeof clearTimeout === 'function' ? clearTimeout : undefined,
    typeof setInterval === 'function' ? setInterval : undefined,
    typeof clearInterval === 'function' ? clearInterval : undefined,
  );
  let getStreams = (modul.exports && (modul.exports.getStreams || (modul.exports.default && modul.exports.default.getStreams))) || null;
  // Nuvio staticCallCode'un globalThis.getStreams yedeği: modül yükleme sırasında
  // global'e yazılmış SAĞLANICI işlevini yakala, sonra geri koy — yoksa ikinci
  // scraper bir öncekinin küreselini çağırır (vekil.js kuşak yakalama deseni).
  if (!getStreams && typeof globalThis.getStreams === 'function' && globalThis.getStreams !== oncekiGlobal) {
    getStreams = globalThis.getStreams;
  }
  if (typeof globalThis.getStreams === 'function' && globalThis.getStreams !== oncekiGlobal) {
    if (oncekiGlobal) globalThis.getStreams = oncekiGlobal; else delete globalThis.getStreams;
  }
  if (typeof getStreams !== 'function') throw new Error('getStreams bulunamadı (module.exports/getStreams)');
  return { getStreams, config: (modul.exports && modul.exports.config) || null };
}

/* ── Stream normalizasyonu: Nuvio Stream → satır ham nesnesi. Oynatılamaz
   (http(s) olmayan ya da yalnız externalUrl) → null. ────────────────────── */
export function nuvioSatiraCevir(akisi, scraper) {
  if (!akisi || typeof akisi !== 'object') return null;
  let url = typeof akisi.url === 'string' ? akisi.url.trim() : '';
  if (url && !/^https?:\/\//i.test(url)) url = '';
  if (!url) return null; // externalUrl/infoHash/şema-dışı → CinePulse oynatamaz
  const hamBaslik = String(akisi.title || akisi.name || scraper?.ad || '');
  return {
    url,
    baslik: hamBaslik.replace(/\s+/g, ' ').slice(0, 80),
    hamBaslik,
    kalite: /2160|4k/i.test(hamBaslik + ' ' + (akisi.quality || '')) ? '4K'
      : /1080/i.test(hamBaslik + ' ' + (akisi.quality || '')) ? '1080p'
      : /720/i.test(hamBaslik + ' ' + (akisi.quality || '')) ? '720p'
      : /480/i.test(hamBaslik + ' ' + (akisi.quality || '')) ? '480p' : 'auto',
    isHls: /\.m3u8(\?|#|$)/i.test(url) || /hls/i.test(String(akisi.format || '')),
    headers: akisi.headers && typeof akisi.headers === 'object' ? { ...akisi.headers } : undefined,
  };
}

/* ── Motor fabrikası ────────────────────────────────────────────────────── */
export function nuvioMotoru({ fetchImpl, yakla = 15 * 60_000 } = {}) {
  const kopruFetch = typeof fetchImpl === 'function' ? fetchImpl
    : (typeof globalThis !== 'undefined' && typeof globalThis.fetch === 'function' ? (...a) => globalThis.fetch(...a) : null);
  if (!kopruFetch) throw new Error('nuvioMotoru: fetch yok (fetchImpl enjekte edin ya da natif fetch bulunmalı)');
  const fetchShim = fetchShimOlustur((u, o) => kopruFetch(u, o));
  const kodHafiza = new Map();     // url → {t, kod} (bellek içi)
  const manifestHafiza = new Map(); // repoTabani → {t, manifest}
  /* YERLİ tohum kodları (kullanıcı 2026-10-29): APK'yla paketlenmiş sağlayıcı
     JS'leri TTL'den ve ağdan bağımsız, ölümsüz önceliktir (kodTohumla). */
  const yerliKod = new Map();      // url → kod
  function kodTohumla(url, kod) { if (url && typeof kod === 'string' && kod) yerliKod.set(url, kod); }

  const log = (ad) => (seviye, args) => {
    try {
      const metin = args.map(a => (typeof a === 'string' ? a : (() => { try { return JSON.stringify(a); } catch (_) { return String(a); } })())).join(' ').slice(0, 300);
      (seviye === 'error' ? console.error : console.warn)(`[nuvio:${ad}] ${metin}`);
    } catch (_) {}
  };

  async function getIstek(url, ms = 15000) {
    const zamanAsimi = asilZamanAsimi(ms, 'nuvio: indirme zaman aşımı ' + url);
    try {
      const yanit = await Promise.race([kopruFetch(url, { redirect: 'follow' }), zamanAsimi]);
      if (!yanit || !yanit.ok) throw new Error(`nuvio: ${yanit?.status || 0} ${url}`);
      return typeof yanit.text === 'function' ? yanit.text() : String(yanit);
    } finally { asilIptalEt(zamanAsimi); }
  }

  /** Depo manifesti: <repoTabani>/manifest.json → {ad, version, scrapers[]}. */
  async function repoManifesti(repoTabani, { taze = false } = {}) {
    const taban = String(repoTabani || '').replace(/\/manifest\.json\/?$/i, '').replace(/\/+$/, '');
    const onbellek = manifestHafiza.get(taban);
    if (!taze && onbellek && Date.now() - onbellek.t < yakla) return onbellek.manifest;
    const ham = await getIstek(`${taban}/manifest.json`, 10000);
    const m = JSON.parse(ham);
    if (!m || typeof m !== 'object' || !Array.isArray(m.scrapers) || !m.scrapers.length) {
      throw new Error('nuvio: manifest geçerli değil (scrapers[] yok)');
    }
    const manifest = {
      ad: String(m.name || 'depo').slice(0, 32),
      version: String(m.version || ''),
      scrapers: m.scrapers.filter(s => s && typeof s.filename === 'string')
        .map(s => ({
          ad: String(s.name || s.id || s.filename).slice(0, 40),
          id: String(s.id || s.filename),
          filename: String(s.filename),
          supportedTypes: Array.isArray(s.supportedTypes) ? s.supportedTypes.map(String) : ['movie', 'tv'],
          contentLanguage: Array.isArray(s.contentLanguage) ? s.contentLanguage.map(String) : [],
          enabled: s.enabled !== false,
        })),
    };
    manifestHafiza.set(taban, { t: Date.now(), manifest });
    return manifest;
  }

  /** Provider kodunu indir (24 sn bellek + 24 TDL localStorage cache). */
  async function providerKodu(repoTabani, scraper) {
    const url = `${String(repoTabani).replace(/\/+$/, '')}/${String(scraper.filename).replace(/^\/+/, '')}`;
    const yerli = yerliKod.get(url);
    if (yerli) return yerli;
    const bellek = kodHafiza.get(url);
    if (bellek && Date.now() - bellek.t < KOD_CACHE_TDL) return bellek.kod;
    let sakli = null;
    try {
      const raw = globalThis.localStorage?.getItem(KOD_CACHE_ONEK + url);
      if (raw) { const p = JSON.parse(raw);      if (p && Date.now() - p.t < KOD_CACHE_TDL && typeof p.kod === 'string') sakli = p; }
    } catch (_) {}
    if (sakli) { kodHafiza.set(url, sakli); return sakli.kod; }
    try {
      const kod = await getIstek(url, SCRAPER_TIMEOUT_MS);
      const kayit = { t: Date.now(), kod };
      kodHafiza.set(url, kayit);
      try { globalThis.localStorage?.setItem(KOD_CACHE_ONEK + url, JSON.stringify(kayit)); } catch (_) {}
      return kod;
    } catch (hata) {
      // Çevrimdışı kurtarma: süresi geçmiş önbellek olsa bile dene.
      try {
        const raw = globalThis.localStorage?.getItem(KOD_CACHE_ONEK + url);
        if (raw) { const p = JSON.parse(raw); if (p && typeof p.kod === 'string') return p.kod; }
      } catch (_) {}
      throw hata;
    }
  }

  const modulHafiza = new Map(); // scraperId → {getStreams, config} (kod değişince yeniden derlenir)

  async function scraperModulu(repoTabani, scraper) {
    const kod = await providerKodu(repoTabani, scraper);
    const anahtar = scraper.id || scraper.filename;
    const onceki = modulHafiza.get(anahtar);
    if (onceki && onceki.kod === kod) return onceki.modul;
    const modul = modulDerle(kod, { ad: scraper.ad || anahtar, scraperId: anahtar, fetchImpl: fetchShim, log: log(scraper.ad || anahtar) });
    modulHafiza.set(anahtar, { kod, modul });
    return modul;
  }

  /** Tek scraper çağrısı: hata/timeout → {hata}, yoksa ham Stream[]. */
  async function scraperCagir(repoTabani, scraper, { tmdbId, mediaType, sezon, bolum }, ms = SCRAPER_TIMEOUT_MS) {
    try {
      if (!tmdbId) throw new Error('nuvio: tmdbId gerekli (imdbId yetmez)');
      const modul = await scraperModulu(repoTabani, scraper);
      const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const cagri = Promise.resolve(modul.getStreams(String(tmdbId).replace(/^tmdb:/i, ''), mediaType, sezon ?? undefined, bolum ?? undefined));
      const zamanAsimi = asilZamanAsimi(ms, `nuvio timeout ${scraper.ad}`);
      let ham;
      try { ham = await Promise.race([cagri, zamanAsimi]); } finally { asilIptalEt(zamanAsimi); }
      if (!Array.isArray(ham)) return { hata: 'getStreams dizi döndürmedi: ' + typeof ham };
      return { streams: ham };
    } catch (hata) {
      return { hata: String(hata?.message || hata).slice(0, 200) };
    }
  }

  /** Deposun TÜM uygun scraper'larını ≤4 eşzamanlı, hata-izole çalıştırır;
      satırlar geldikçe geri çağrıya verilir. Dönen: {satir, hata[]}. */
  async function depodaAra(repoTabani, kayit, { tmdbId, mediaType, sezon, bolum }, satirGeriCagri, ms = SCRAPER_TIMEOUT_MS) {
    const uygun = (kayit?.scrapers || []).filter(s => s.enabled !== false
      && (!Array.isArray(s.supportedTypes) || !s.supportedTypes.length || s.supportedTypes.includes(mediaType)));
    let satir = 0;
    const hatalar = [];
    let sira = 0;
    const isci = async () => {
      while (sira < uygun.length) {
        const scraper = uygun[sira++];
        const sonuc = await scraperCagir(repoTabani, scraper, { tmdbId, mediaType, sezon, bolum }, ms);
        if (sonuc.hata) { hatalar.push(`${scraper.ad}: ${sonuc.hata}`); continue; }
        for (const a of sonuc.streams) {
          const s = nuvioSatiraCevir(a, scraper);
          if (!s) continue;
          satir++;
          try { satirGeriCagri(s, scraper); } catch (_) { /* tek satır hatası taramayı bozmaz */ }
        }
      }
    };
    await Promise.all(Array.from({ length: Math.max(1, Math.min(MAKS_EŞZAMANLI, uygun.length)) }, isci));
    return { satir, hatalar };
  }

  return { repoManifesti, providerKodu, scraperModulu, scraperCagir, depodaAra, fetchShim, kodTohumla };
}

export default nuvioMotoru;
