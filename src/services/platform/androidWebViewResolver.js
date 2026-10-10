/* ==========================================================================
   CinePulse Studio - Android yerel WebView cozumleyicisi
   Cloudstream'in WebViewResolver mantiginin JS tarafi. Gizli WebView sayfayi
   gercek tarayici olarak acar (Cloudflare challenge'i cozulur), HTML ve
   cerezler geri gelir. Kapali oldugunda sessizce null doner.
   ========================================================================== */

const pending = new Map();
let seq = 0;
let handlerInstalled = false;
let nativeBridge = null;

function bridge() {
  if (nativeBridge) return nativeBridge;
  try {
    nativeBridge = window.CinePulseWebView || null;
  } catch (_) {
    nativeBridge = null;
  }
  return nativeBridge;
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
export function resolvePageInNativeWebView(url, { timeoutMs = 22000 } = {}) {
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
      b.resolvePage(String(url || ''), Math.max(6000, Math.min(45000, timeoutMs | 0)));
    } catch (_) {
      clearTimeout(timer);
      pending.delete(id);
      resolve(null);
    }
  });
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
    || sample.includes('cf-chl');
}