/* ==========================================================================
   CinePulse — Derin bağlantı + paylaşım (yol haritası #15)
   --------------------------------------------------------------------------
   Şemalar:
     cinepulse://detail/tv/1396          → #detail/tv/1396
     cinepulse://detail/movie/550        → #detail/movie/550
     cinepulse://home|library|anime ...  → #home ...
   Giriş noktaları: Android MainActivity (intent), Electron (protokol +
   ikinci örnek argv'si), tarayıcı (zaten hash'li web adresiyle çalışır).
   Paylaşım adresi HER ZAMAN web biçiminde üretilir (karşı tarafta uygulama
   şart değil); QR aynı adresi kodlar.
   ========================================================================== */

const GECERLILER = new Set([
  'detail', 'series', 'cartoons', 'movies', 'anime', 'documentary',
  'kanalim', 'discover', 'library', 'showcase', 'downloads', 'dramas',
  'home', 'search'
]);

/**
 * cinepulse://… adresini uygulama hash'ine çevirir. Geçersizse '' döner.
 */
export function derinAdresCoz(adres) {
  let u = String(adres || '').trim();
  if (!u) return '';
  if (u.startsWith('cinepulse://')) u = '#' + u.slice('cinepulse://'.length);
  else if (/^https?:\/\//i.test(u)) {
    const h = u.indexOf('#');
    if (h < 0) return '';
    u = '#' + u.slice(h + 1).replace(/^\/+/, '');
  }
  if (!u.startsWith('#')) return '';
  u = '#' + u.slice(1).replace(/^\/+/, '');
  const yol = (u.slice(1).split(/[/?]/)[0] || '').toLowerCase();
  return GECERLILER.has(yol) ? u : '';
}

/** Uygulama içi hash'ten herkese açık paylaşım adresi (web biçimi).
 *  Native kabukta origin "https://localhost" olduğu için anlamsızdır; o
 *  durumda VITE_SITE_ADRESİ (ör. https://cine-pulse.vercel.app) kullanılır,
 *  tanımlı değilse '' döner ve paylaşım dürüstçe "yapılandırılmadı" der. */
export function paylasimAdresi(type, id) {
  const yol = `#/detail/${encodeURIComponent(type || 'tv')}/${encodeURIComponent(id)}`;
  let taban = '';
  try { taban = String(import.meta.env?.VITE_SITE_ADRESI || '').trim(); } catch { /* env yok */ }
  // YEREL WebView'da (https://localhost) paylaşılacak gerçek adres YOKTUR;
  // üretim web adresi (aynı SPA'yı sunan workers.dev) taban olarak kullanılır
  // — buton sessiz ölü kalmaz (kullanıcı 2026-10-29: "paylaş butonu çalışmıyor").
  if (!taban && /^(https?:\/\/)?localhost(:\d+)?$/.test(location.host)) {
    try { taban = String(import.meta.env?.VITE_API_ADRESI || '').trim() || 'https://cinepulse.cinepulse.workers.dev'; } catch { taban = 'https://cinepulse.cinepulse.workers.dev'; }
  }
  if (!taban) taban = `${location.origin}${location.pathname}`;
  return `${taban.replace(/\/+$/, '')}${yol}`;
}

/** Derin bağlantıyı uygular: hash'i kurar, router yakalar. */
export function derinBaglantiUygula(adres) {
  const hash = derinAdresCoz(adres);
  if (!hash) return false;
  if (window.location.hash === hash) {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = hash;
  }
  return true;
}
