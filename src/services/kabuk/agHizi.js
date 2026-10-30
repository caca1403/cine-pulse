/* ==========================================================================
   CinePulse — YAVAŞ AĞ MODU
   --------------------------------------------------------------------------
   ÖLÇÜM (2026-10-18, cihaz): api.themoviedb.org ping'i 1.4–4 sn'ye çıkıyor
   (normal <100 ms). Sağlayıcı çekirdekleri kendi isteklerinde
   `AbortSignal.timeout(4000)` kullanıyor; RTT 1.4–4 sn olan bir ağda bu pencere
   YETMİYOR → sağlayıcılar zaman aşımına uğruyor, kaynak sayısı düşüyor
   (kullanıcı: "dün gece 30 kaynak vardı, şimdi 5" / "internet yavaşken
   taramıyor").

   ÇÖZÜM: yavaş ağ tespit edilirse `AbortSignal.timeout` TABANI yükseltilir
   (yalnız UZATILIR, kısaltılmaz) ve tarama tavanları büyür. Böylece çekirdek
   dosyalarına dokunmadan istekler yavaş ağda tamamlanabiliyor.
   ========================================================================== */

let yavas = false;

/** Kullanıcı tercihi (#8 oynatıcı/ağ ayarları): 'oto' | 'yavas' | 'normal'. */
export function agModu() {
  try {
    const v = typeof localStorage !== 'undefined' ? localStorage.getItem('cp_ag_modu') : null;
    return (v === 'yavas' || v === 'normal') ? v : 'oto';
  } catch { return 'oto'; }
}

/** Yavaş ağ modu açık mı? (vekil.js tarama tavanları bunu okur.)
 *  #8: elle seçilmiş mod otomatik ölçümü ezer — 'yavaş' zorla açar,
 *  'normal' zorla kapatır, 'oto' ölçüme kalır. */
export function yavasAgMi() {
  const mod = agModu();
  if (mod === 'yavas') return true;
  if (mod === 'normal') return false;
  if (yavas) return true;
  try { return typeof window !== 'undefined' && window.__cpYavasAg === true; } catch (_) { return false; }
}

/** Yavaş ağda istek zaman aşımı tabanı (ms). */
export const YAVAS_ZAMAN_ASIMI_MS = 15_000;

/**
 * `AbortSignal.timeout`'u, yavaş ağ modunda tabanlı sarmalar.
 * Idempotent: iki kez çağrılsa da tek sarmalama olur.
 */
function zamanAsiminiSarmala() {
  try {
    const AS = typeof AbortSignal !== 'undefined' ? AbortSignal : null;
    if (!AS || typeof AS.timeout !== 'function') return;
    if (AS.__cpSarmal || AS.timeout.__cpSarmal) return;
    const orijinal = AS.timeout;
    const sarilmis = function (ms) {
      const n = Number(ms) > 0 ? Number(ms) : 0;
      const taban = yavasAgMi() ? YAVAS_ZAMAN_ASIMI_MS : n;
      return orijinal.call(AS, Math.max(n, taban));
    };
    sarilmis.__cpSarmal = true;
    AS.timeout = sarilmis;
    try { AS.__cpSarmal = true; } catch (_) {}
  } catch (_) { /* sarmalama başarısızsa varsayılan davranış korunur */ }
}

/** Tek bir küçük isteğin gidiş-dönüşünü ölçer (ms); başarısızsa null. */
async function rttOlc() {
  const basladi = Date.now();
  try {
    const c = new AbortController();
    const zaman = setTimeout(() => { try { c.abort(); } catch (_) {} }, 20_000);
    await fetch('https://api.themoviedb.org/3/configuration?api_key=4e44d9029b1270a757cddc766a1bcb63', {
      cache: 'no-store',
      signal: c.signal
    });
    clearTimeout(zaman);
    return Date.now() - basladi;
  } catch (_) {
    return null;
  }
}

/** Ağ hızını değerlendirir ve yavaş ağ modunu (varsa) açar. */
export async function agHiziniDegerlendir() {
  try {
    zamanAsiminiSarmala();
    const mod = agModu();
    if (mod === 'yavas') { yavas = true; }
    else if (mod === 'normal') { yavas = false; }
    else {
      const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (c) {
        if (c.effectiveType === 'slow-2g' || c.effectiveType === '2g' || c.effectiveType === '3g') yavas = true;
        if (typeof c.downlink === 'number' && c.downlink > 0 && c.downlink < 1.5) yavas = true;
      }
      const rtt = await rttOlc();
      // 1.5 sn üstü RTT yavaş sayılır (mobilde normal <400 ms).
      if (typeof rtt === 'number' && rtt > 1500) yavas = true;
    }
    if (typeof window !== 'undefined') window.__cpYavasAg = yavas;
  } catch (_) {}
  return yavas;
}

/** Açılışta çağrılır: sarmalamayı hemen kur, ölçümü arka planda yap. */
export function agHiziIzle() {
  zamanAsiminiSarmala();
  try {
    agHiziniDegerlendir();
    if (typeof window !== 'undefined') {
      window.addEventListener?.('online', () => { agHiziniDegerlendir(); });
    }
  } catch (_) {}
}

/** #8: ayar değişince çağrılır — geçersiz kılma bayrağı anında uygulanır
 *  (vekil.js window.__cpYavasAg'ı doğrudan okur; ölçümü beklemez). */
export function agModunuUygula() {
  try {
    const mod = agModu();
    if (mod === 'yavas') yavas = true;
    else if (mod === 'normal') yavas = false;
    if (typeof window !== 'undefined') window.__cpYavasAg = yavas;
  } catch (_) {}
  return yavas;
}
