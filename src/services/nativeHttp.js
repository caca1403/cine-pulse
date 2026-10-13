/* ==========================================================================
   Cihaz üzerinden doğrudan HTTP katmanı

   SORUN: APK'daki bütün istekler Vercel'e gidiyor. Vercel bir datacenter
   IP'sidir (AWS). Türkçe yayın sağlayıcıları ve M3U listeleri bu IP'leri
   engelliyor:
       izlego.eu    → 429 Too Many Requests
       Cloudflare   → 520
       kanallar     → 403
   Ölçüm: aynı kaynak Vercel'den 0/20, ev IP'sinden 20/20 oynuyordu.

   ÇÖZÜM: CapacitorHttp. WebView'in içindeki tarayıcı fetch'ini atlar ve
   isteği CİHAZIN KENDİ ağ yığınından yapar — yani kullanıcının ev IP'si,
   CloudStream / Nuvio / KekikStream ile birebir aynı davranış.

   Büyük kazanç: native istek olduğu için REFERER serbestçe yazılabiliyor.
   Tarayıcı fetch'inde Referer yazmak yasaktı; bu yüzden oynatıcı siteleri
   (player.filmizle.in gibi) 404 veriyordu ve çözüm için proxy gerekiyordu.
   Artık gerek yok.

   Web sürümünde (masaüstü tarayıcı) bu katman devre dışıdır; orada hâlâ
   /api/proxy kullanılır.
   ========================================================================== */

import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { cihazCerezHeaderi } from './platform/deviceCookies.js';
import { tarayiciUA, tarayiciBasliklari } from './platform/clientProfile.js';

function nativeAndroidMi() {
  try {
    return Capacitor?.isNativePlatform?.() === true && Capacitor.getPlatform() === 'android';
  } catch (_) {
    return false;
  }
}

/** CapacitorHttp cevabı düz metne çevrilir (JSON otomatik parse edilmiş olabilir). */
function cevapMetni(r) {
  if (!r) return '';
  const d = r.data;
  if (typeof d === 'string') return d;
  if (d === undefined || d === null) return '';
  try { return JSON.stringify(d); } catch (_) { return String(d); }
}

export function nativeHttpAktifMi() {
  return nativeAndroidMi();
}

/**
 * Cihazdan GET — cihazın kendi IP'sinden.
 * @returns {Promise<{ok:boolean,status:number,text:string,headers:object}>}
 */
export async function cihazGet(url, { ref = '', headers = {}, timeout = 15000 } = {}) {
  if (!nativeAndroidMi()) return { ok: false, status: 0, text: '', headers: {} };
  const h = {
    ...tarayiciBasliklari({ Accept: headers.Accept || headers.accept || '*/*' }),
    ...headers,
  };
  if (ref) h.Referer = ref;
  // Gizli WebView'in çözdüğü Cloudflare çerezini taşı: challenge bir kez
  // çözülür, sonraki istekler engellenmez (zaman aşımının kökü buydu).
  // UA ise çerezin BAĞLI OLDUĞU parmak izidir: challenge'ı çözen WebView'in
  // UA'sı neyse o gönderilir, yoksa CF her istekte yeniden challenge sorar.
  if (!h.Cookie && !h.cookie) {
    const c = cihazCerezHeaderi(url);
    if (c) h.Cookie = c;
  }

  try {
    const r = await CapacitorHttp.get({
      url,
      headers: h,
      readTimeout: timeout,
      connectTimeout: Math.min(timeout, 8000)
    });
    return { ok: r.status >= 200 && r.status < 300, status: r.status, text: cevapMetni(r), headers: r.headers || {} };
  } catch (_) {
    return { ok: false, status: 0, text: '', headers: {} };
  }
}

/** Cihazdan POST — form gövdeli (oynatıcı API'leri çoğunlukla POST ister). */
export async function cihazPost(url, body, { ref = '', headers = {}, timeout = 15000 } = {}) {
  if (!nativeAndroidMi()) return { ok: false, status: 0, text: '', headers: {} };
  const h = {
    ...tarayiciBasliklari({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      // Bu başlık olmadan çoğu AJAX ucu JSON yerine HTML döner.
      'X-Requested-With': 'XMLHttpRequest',
    }),
    ...headers
  };
  if (ref) h.Referer = ref;
  if (!h.Cookie && !h.cookie) {
    const c = cihazCerezHeaderi(url);
    if (c) h.Cookie = c;
  }

  try {
    const r = await CapacitorHttp.post({
      url,
      data: body,
      headers: h,
      readTimeout: timeout,
      connectTimeout: Math.min(timeout, 8000)
    });
    return { ok: r.status >= 200 && r.status < 300, status: r.status, text: cevapMetni(r), headers: r.headers || {} };
  } catch (_) {
    return { ok: false, status: 0, text: '', headers: {} };
  }
}

/**
 * Akıllı GET: cihazdaysa cihazın IP'sinden, değilse mevcut proxy/worker
 * zincirinden. Böylece çağıran kod platform farkını bilmek zorunda kalmaz.
 */
const UA_MOBIL = 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36';

async function duzGet(url, { ref, timeout, headers = {} }) {
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), timeout);
    const r = await fetch(url, { signal: ac.signal, headers: { 'User-Agent': UA_MOBIL, Accept: '*/*', ...headers, ...(ref ? { Referer: ref } : {}) } });
    clearTimeout(t);
    if (!r.ok) return '';
    return await r.text();
  } catch (_) {
    return '';
  }
}

/**
 * Son çare: cihazın gizli WebView'i.
 *
 * dizibox.live, filmmakinesi.to gibi siteler Cloudflare'ın JS challenge'ını
 * kullanıyor. Bu challenge sunucudan (Vercel, CF Worker, proxy) çözüLEMEZ —
 * çözüm için gerçek bir tarayıcı motoru gerekir. Cihazdaki gizli WebView tam
 * da budur: gerçek Chromium, cihazın kendi IP'siyle.
 *
 * WebView yoksa (masaüstü tarayıcı, test) null döner; çağıran zincir devam eder.
 */
async function gizliWebViewDeneme(url, timeout) {
  // Challenge genelde ilk birkaç saniyede çözülür. Süreyi 20+ saniyeye
  // çıkarmak sağlayıcı bütçesini yiyordu; üst sınırla kısıtlıyoruz.
  // Çerez paylaşımı sayesinde aynı site için bu yol genelde BİR kez çalışır.
  const zaman = Math.min(Math.max(14000, timeout + 6000), 24000);
  // Önce Android'in gizli WebView'i, olmazsa Electron'ın gizli BrowserWindow'ı.
  // İkisi de gerçek tarayıcı motoruyla CF challenge'ını çözer; masaüstünde
  // gizli WebView olmadan bu siteler hiç açılmıyordu.
  for (const loader of [() => import('./platform/androidWebViewResolver.js'), () => import('./platform/desktopWebViewResolver.js')]) {
    try {
      const wv = await loader();
      if (!wv.hasNativeWebViewResolver?.()) continue;
      // Cihazda TEK gizli WebView var. Zaten bir çözümleme sürüyken ikinciyi
      // sıraya sokmak iki tarafı da yakıyor (sırada bekleyen iş süresi doluyor,
      // sağlayıcının tüm bütçesi gidiyordu). Meşgulse bu isteği geç düş.
      if (wv.resolverMesgulMu?.()) return '';
      const t0 = Date.now();
      let hit = await wv.resolvePageInNativeWebView(url, { timeoutMs: zaman });
      const kullanilabilir = (h) => h && !wv.looksBlocked?.(h) &&
        (String(h.text || h.html || '').trim().startsWith('{') || !!(h.html || '').trim());
      // TEK YİNELEME — ve yalnızca ilk deneme HIZLI düştüyse. İlk deneme
      // bütçesinin çoğunu yediyse ikinci deneme de yiyecek; sağlayıcının
      // zaman aşımına (30 sn) yürüyeceği için boşuna sıra kapma yok.
      if (!kullanilabilir(hit) && Date.now() - t0 < 7000) {
        const kalan = Math.min(9000, Math.max(4000, zaman - 6000));
        hit = await wv.resolvePageInNativeWebView(url, { timeoutMs: kalan });
      }
      if (!hit || wv.looksBlocked?.(hit)) continue;
      const raw = String(hit.text || '').trim();
      const body = (raw.startsWith('{') || raw.startsWith('[')) ? raw : (hit.html || raw);
      if (body) return body;
    } catch (_) { /* sonraki çözümleyiciye düş */ }
  }
  return '';
}

/**
 * Yanıt Cloudflare engel sayfası mı?
 * ÖNEMLİ: JSON API yanıtları (vidlink, TMDB) HTML değildir — onlara
 * dokunulmaz. Yalnızca HTML görünümlü kısa engel sayfaları elenir.
 */
export function engelSayfaMi(metin) {
  const t = String(metin || '');
  if (!t) return true;
  const bas = t.slice(0, 300).trimStart().toLowerCase();
  // JSON / m3u8 / düz metin API yanıtı — engel değildir
  if (bas.startsWith('{') || bas.startsWith('[') || bas.startsWith('#extm3u')) return false;
  const ilk = t.slice(0, 8000).toLowerCase();
  const IZLER = [
    'just a moment', 'attention required', 'cf-browser-verification', 'checking your browser',
    'enable javascript and cookies', 'verifying you are human', 'verify you are human',
    'challenge-platform', 'cf-chl', 'cf_chl_', 'turnstile', 'cloudflare bot',
    'you have been blocked', 'request unsuccessful', 'ddos-guard', 'security check',
    'access denied', 'error 1020', 'error code: 1020', 'sorry, you cannot access',
  ];
  const engel = IZLER.some((iz) => ilk.includes(iz));
  if (!engel && t.length > 60000) return false;
  return engel;
}

export async function akilliGet(url, { ref = '', timeout = 15000, yedekCek = null, headers = {}, webView = true } = {}) {
  // 1) Android: cihazın kendi IP'sinden (CapacitorHttp)
  if (nativeAndroidMi()) {
    const r = await cihazGet(url, { ref, timeout, headers });
    // Engel sayfası gelse bile BAŞARILI sayılmaz: zincir devam eder ve
    // gizli WebView challenge'ı çözer. Önceden challenge HTML'i geçerli
    // içerik gibi dönülüyor, arayan katman boş sonuç üretiyordu.
    if (r.ok && r.text && !engelSayfaMi(r.text)) return r.text;
  }

  // 2) Doğrudan istek (masaüstü/web: kullanıcının kendi IP'si)
  const dogrudan = await duzGet(url, { ref, timeout, headers });
  if (dogrudan && !engelSayfaMi(dogrudan)) return dogrudan;

  // 3) GİZLİ WEBVIEW — Cloudflare JS challenge için gerçek tarayıcı motoru.
  //    Önceden sadece `yedekCek` verildiğinde deniyordu; çağıranların
  //    çoğu vermediği için masaüstünde hiç devreye girmiyordu.
  //    `webView: false`: gizli WebView 10-24 saniye sürebilir. Bir sayfada
  //    BİR challenge yeter; aynı sayfanın geri kalan istekleri (oynatıcı
  //    butonları, gömülü oynatıcılar) bu pahalı yolu denemez — ölçüldü,
  //    Orion'un yavaşlığının ana nedeni buydu.
  if (webView) {
    const wv = await gizliWebViewDeneme(url, timeout);
    if (wv) return wv;
  }

  // 4) Çağıranın kendi yedeği (proxy/worker zinciri)
  if (typeof yedekCek === 'function') {
    try {
      const t = await yedekCek(url, { ref, timeout });
      if (t) return t;
    } catch (_) {}
  }
  return '';
}

/**
 * Web/Node için düz POST. `akilliPost` yalnızca Android'de çalışıyordu;
 * tarayıcıda ve testte her POST boş dönüyordu (ölçüldü: FilmEkseni araması
 * hiç sonuç vermiyordu).
 */
async function duzPost(url, body, { ref, timeout, headers = {} }) {
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), timeout);
    const r = await fetch(url, {
      method: 'POST',
      signal: ac.signal,
      headers: {
        'User-Agent': UA_MOBIL,
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        // Bu başlık olmadan çoğu AJAX ucu JSON yerine HTML döner.
        'X-Requested-With': 'XMLHttpRequest',
        ...headers,
        ...(ref ? { Referer: ref } : {})
      },
      body
    });
    clearTimeout(t);
    if (!r.ok) return '';
    return await r.text();
  } catch (_) {
    return '';
  }
}

/** Akıllı POST — cihazda cihazın IP'sinden, yoksa doğrudan istek. */
export async function akilliPost(url, body, { ref = '', timeout = 15000, yedekCek = null, headers = {} } = {}) {
  if (nativeAndroidMi()) {
    const r = await cihazPost(url, body, { ref, timeout, headers });
    if (r.ok && r.text && !engelSayfaMi(r.text)) return r.text;
  }
  if (typeof yedekCek === 'function') {
    try {
      const t = await yedekCek(url, { ref, timeout, headers });
      if (t) return t;
    } catch (_) {}
  }
  return duzPost(url, body, { ref, timeout, headers });
}
