/* ==========================================================================
   CinePulse Studio - Android yerel WebView cozumleyicisi
   Cloudstream'in WebViewResolver mantiginin JS tarafi. Gizli WebView sayfayi
   gercek tarayici olarak acar (Cloudflare challenge'i cozulur), HTML ve
   cerezler geri gelir. Kapali oldugunda sessizce null doner.
   ========================================================================== */

const pending = new Map();
let seq = 0;
let handlerInstalled = false;
let queue = Promise.resolve();
const inflight = new Map();

function bridge() {
  try { return window.CinePulseWebView || null; } catch (_) { return null; }
}

function isNative() {
  try {
    return Boolean(window.Capacitor?.isNativePlatform?.());
  } catch (_) {
    return false;
  }
}

/** Bu ortamda cozumleyici var mi? */
export function hasNativeWebViewResolver() {
  try {
    const b = bridge();
    return Boolean(isNative() && b && typeof b.resolvePage === 'function');
  } catch (_) {
    return false;
  }
}

function installHandler() {
  if (handlerInstalled) return;
  handlerInstalled = true;
  try {
    window.__cinepulseWebViewResolve = (id, json) => {
      const entry = pending.get(id);
      if (!entry) return;
      pending.delete(id);
      clearTimeout(entry.timer);
      let data = null;
      try { data = typeof json === 'string' ? JSON.parse(json) : json; } catch (_) { data = null; }
      entry.resolve(data || { ok: false, challenge: true });
    };
  } catch (_) {}
}

/**
 * Sayfayi coz ve { ok, html, text, cookies, challenge, finalUrl } dondur.
 * Cozumleyici yoksa veya basarisizsa null.
 */
function dispatchPage(url, { timeoutMs = 22000, media = false, referer = '' } = {}) {
  return new Promise((resolve) => {
    const b = bridge();
    if (!b || typeof b.resolvePage !== 'function') { resolve(null); return; }
    installHandler();
    const id = `r${++seq}`;
    const timer = setTimeout(() => {
      if (pending.has(id)) { pending.delete(id); resolve(null); }
    }, Math.max(6000, timeoutMs + 6000));
    pending.set(id, { resolve, timer });
    try {
      b.resolvePage(id, String(url || ''), Math.max(6000, Math.min(45000, timeoutMs | 0)), media, String(referer || ''));
    } catch (_) {
      clearTimeout(timer);
      pending.delete(id);
      resolve(null);
    }
  });
}

/** The native resolver owns one WebView; serialize jobs and coalesce duplicates. */
let kuyrukSayac = 0;
/** Cihazda TEK gizli WebView var. Bir çözümleme sürerken ikincisi sıraya
 *  giriyor ve sırada bekleyen iş çoğunlukla süresi doluyor (resolver-queue-timeout).
 *  Sağlayıcılar bunun için "meşgul mi?" diye sorup pahalı yolu atlayabilir. */
export function resolverMesgulMu() { return kuyrukSayac > 0; }

export function resolvePageInNativeWebView(url, options = {}) {
  const key = `${Boolean(options.media)}:${options.referer || ''}:${url}`;
  if (inflight.has(key)) return inflight.get(key);
  const deadline = Date.now() + (options.timeoutMs || 22000);
  const task = queue.then(() => {
    const remaining = deadline - Date.now();
    // Sırada o kadar az süre kaldı ki bu iş hiç başlamadan ölecek — boşuna
    // yer kaplama, hemen düş.
    if (remaining < 4000) return null;
    kuyrukSayac++;
    return dispatchPage(url, { ...options, timeoutMs: remaining })
      .finally(() => { kuyrukSayac = Math.max(0, kuyrukSayac - 1); });
  });
  queue = task.catch(() => null);
  const result = task.finally(() => inflight.delete(key));
  inflight.set(key, result);
  return result;
}

/** Challenge sayfasi mi? */
export function looksBlocked(result) {
  if (!result) return true;
  if (result.challenge === true) return true;
  const sample = String(result.html || result.text || '').slice(0, 8000).toLowerCase();
  if (!sample) return true;
  return sample.includes('just a moment')
    || sample.includes('enable javascript and cookies')
    || sample.includes('challenge-platform')
    || sample.includes('attention required')
    || sample.includes('cf-chl')
    // hız limiti imzaları: challenge'tan ayrışsın (Orion raporu #5)
    || sample.includes('error code: 1015')
    || sample.includes('error 1015')
    || sample.includes('you have been rate limited')
    || sample.includes('too many requests');
}