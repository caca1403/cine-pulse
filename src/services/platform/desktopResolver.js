/* CinePulse - Gizli WebView cozum katmani (Cloudstream WebViewResolver + Nuvio native mantigi).
 * EXE: Electron ghost window (gercek Chrome, ayni session) Cloudflare challenge'i cozer.
 * APK/Web: ghost yoksa gizli iframe ile HTML alinir (HttpOnly cookie okunamaz ama
 * statik sayfa + meta-refresh akislari icin yeterlidir).
 * Kullanim: fetchHtml basarisiz olursa sirayla ghost -> iframe denenir.
 */
import { isDesktopApp } from '../platformBridge.js';

export async function ghostResolveHtml(url, opts = {}) {
  try {
    if (!isDesktopApp()) return null;
    const bridge = typeof window !== 'undefined' ? window.CinePulseDesktop : null;
    if (!bridge || typeof bridge.ghostResolve !== 'function') return null;
    const res = await bridge.ghostResolve(url, {
      timeout: opts.timeout || 30000,
      waitAfterLoad: opts.waitAfterLoad || 2500
    });
    if (res && res.ok && res.html && res.html.length > 500) return res.html;
  } catch (_) {}
  return null;
}

export async function hiddenIframeHtml(url, timeout = 12000) {
  if (typeof document === 'undefined' || !url) return null;
  return new Promise((resolve) => {
    let done = false;
    const finish = (html) => {
      if (done) return;
      done = true;
      try { frame.remove(); } catch (_) {}
      resolve(html);
    };
    const frame = document.createElement('iframe');
    frame.setAttribute('aria-hidden', 'true');
    frame.style.cssText =
      'position:fixed;width:1px;height:1px;left:-9999px;top:-9999px;visibility:hidden;';
    const timer = setTimeout(() => finish(null), timeout);
    frame.onload = () => {
      setTimeout(() => {
        try {
          const doc = frame.contentDocument;
          const html = doc && doc.documentElement ? doc.documentElement.outerHTML : '';
          clearTimeout(timer);
          finish(html && html.length > 200 ? html : null);
        } catch (_) {
          // Cross-origin: icerik okunamaz (beklenen), cookie yine de duser.
          clearTimeout(timer);
          finish(null);
        }
      }, 2500);
    };
    frame.onerror = () => {
      clearTimeout(timer);
      finish(null);
    };
    document.documentElement.appendChild(frame);
    frame.src = url;
  });
}

/* 403 merdiveni: ghost (EXE) -> iframe (tum platformlar). HTML dondurur ya da null. */
export async function stealthFetchHtml(url, referer = '', opts = {}) {
  if (!url) return null;
  const ghost = await ghostResolveHtml(url, opts);
  if (ghost) return ghost;
  // Iframe sadece ayni-origin veya CORB'a takilmayan sayfalarda HTML verir;
  // cross-origin'da null doner, ust katman proxy'ye duser.
  try {
    const framed = await hiddenIframeHtml(url, opts.timeout || 12000);
    if (framed) return framed;
  } catch (_) {}
  return null;
}
