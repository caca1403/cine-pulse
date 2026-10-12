/* ==========================================================================
   Cihaz çerez köprüsü — gizli WebView'in çerez kavanozunu HTTP katmanına taşır.

   NEDEN: Cloudflare korumalı sitelerde (Orion/HDFC, Lyra/Selcukflix,
   Arcturus/FilmMakinesi, Bellatrix, Muhlif, Cygnus) gizli WebView challenge'ı
   bir kez çözüyor ve `cf_clearance` çerezini alıyor. Ama CapacitorHttp bu
   çerezi göndermediği için HER istek challenge'ı yeniden çözüyordu; üst üste
   binince sağlayıcı zaman aşımına düşüyordu. Bu modül çerezi istek başlığına
   ekler, böylece challenge bir kez çözülür.

   Native köprü: window.CinePulseNative.getCookies(url) / setCookies(url, c)
   ========================================================================== */

function kopru() {
  try { return window.CinePulseNative || null; } catch (_) { return null; }
}

function nativeMi() {
  try { return Boolean(window.Capacitor?.isNativePlatform?.()); } catch (_) { return false; }
}

/** Ana makine için çerez başlığı (yoksa boş dize). */
export function cihazCerezHeaderi(url) {
  if (!nativeMi()) return '';
  const b = kopru();
  if (!b || typeof b.getCookies !== 'function') return '';
  try {
    const u = new URL(url);
    return b.getCookies(u.origin + '/') || '';
  } catch (_) {
    return '';
  }
}

/** Çerezleri çerezkavanozuna yazar (WebView çözümünden gelenler için yedek). */
export function cihazCerezKaydet(url, cookie) {
  if (!nativeMi() || !cookie) return;
  const b = kopru();
  if (!b || typeof b.setCookies !== 'function') return;
  try {
    const u = new URL(url);
    b.setCookies(u.origin + '/', String(cookie));
  } catch (_) {}
}

/** Aynı çerez dizesinden yalnızca cf_clearance gibi anahtarları süzer. */
export function cihazCerezVarMi(url) {
  const c = cihazCerezHeaderi(url);
  return Boolean(c && c.trim());
}
