/* ==========================================================================
   CinePulse Studio - Web Platform Controller (Sadece Web / PWA'da Yüklenir)
   ========================================================================== */

import { initPwa } from '../pwaManager.js';

/* ── Web taşıma katmanı (ölçülen kopuk bağlantı, 2026-10-13) ──────────────
   Tarayıcıda fetch(), Türkçe yayın sitelerinin HTML/JSON isteklerinde CORS'a
   ölür: temiz sağlayıcıların (kit.js → akilliGet → duzGet) ve site
   sürücülerinin (siteProviders.js) mutlak adresli tüm istekleri '' döner.
   Cihazda bunu CapacitorHttp çözer; web'de tek geçit AYNI-KÖK /api/proxy
   (Vercel serverless, ACAO: *). Bu shim yalnız tarayıcıda kurulur; cihaz
   (Capacitor), masaüstü (sidecar) ve node yollarına hiç dokunmaz.

   Dokunmadığı şeyler:
     - CORS'a açık API'ler (TMDB/Trakt/Fanart/raw-github/Tera worker'ı)
     - Medya adresleri (m3u8/mp4/ts/... — oynatma katmanı zaten hls_proxy
       sarar; açık CORS'lu CDN'ler doğrudan kalsın, hız korunur)
     - data:/blob: ve aynı-kök istekler (/api/* olduğu gibi geçer) */
const ACIK_API = /(^|\.)themoviedb\.org$|(^|\.)tmdb\.org$|(^|\.)trakt\.tv$|(^|\.)fanart\.tv$|(^|\.)workers\.dev$|(^|\.)githubusercontent\.com$|(^|\.)justwatch\.com$|(^|\.)yts\.ly$/i;
const MEDYA = /\.(m3u8|mpd|mp4|mkv|webm|m4s|ts|jpg|jpeg|png|webp|gif|svg|ico|vtt|srt)(\?|#|$)/i;

export function fetchShimKur({ yerelTaban = '' } = {}) {
  if (typeof window === 'undefined' || typeof globalThis.fetch !== 'function') return false;
  if (globalThis.__cpFetchShim) return true;
  globalThis.__cpFetchShim = true;
  const gercek = globalThis.fetch.bind(globalThis);
  const kendiKoken = () => { try { return new URL(window.location.href).origin; } catch (_) { return ''; } };
  globalThis.fetch = async (girdi, secenekler) => {
    let url = typeof girdi === 'string' ? girdi : (girdi && girdi.url) || String(girdi || '');
    if (/^(data|blob):/i.test(url)) return gercek(girdi, secenekler);
    let mutlak;
    try { mutlak = new URL(url, kendiKoken() || 'http://localhost'); } catch (_) { return gercek(girdi, secenekler); }
    if (!/^https?:$/.test(mutlak.protocol)) return gercek(girdi, secenekler);
    const ayniKok = url.startsWith('/') || (kendiKoken() && mutlak.origin === kendiKoken());
    // Yerel test: göreli yollar node'da çözülmez — test koşucusu tabanı verir.
    if (ayniKok) return gercek(yerelTaban ? yerelTaban + mutlak.pathname + mutlak.search : girdi, secenekler);
    if (ACIK_API.test(mutlak.hostname) || MEDYA.test(mutlak.pathname)) return gercek(girdi, secenekler);
    // Çapraz-kök sıyırma (scraping) isteği → aynı-kök geçidi /api/proxy.
    let ref = '';
    try {
      const h = (secenekler && secenekler.headers) || (typeof girdi === 'object' && girdi && girdi.headers);
      if (h) ref = (typeof h.get === 'function' ? h.get('referer') : (h.Referer || h.referer)) || '';
    } catch (_) {}
    if (!ref) ref = `${mutlak.origin}/`;
    const opt = { ...(typeof secenekler === 'object' ? secenekler : {}) };
    if (typeof girdi === 'object' && girdi) {
      if (!opt.method && girdi.method) opt.method = girdi.method;
      if (opt.body === undefined && girdi.body != null) opt.body = girdi.body;
      if (!opt.headers && girdi.headers) opt.headers = girdi.headers;
    }
    // Referer yasaklı başlıktır; vekil query'den taşır. UA'yı vekil kendi verir.
    if (opt.headers) { try { const hh = new Headers(opt.headers); hh.delete('referer'); opt.headers = hh; } catch (_) {} }
    const hedef = `/api/proxy?url=${encodeURIComponent(mutlak.href)}&ref=${encodeURIComponent(ref)}`;
    return gercek((yerelTaban || '') + hedef, opt);
  };
  return true;
}

export async function initWebPlatform() {
  console.log('[Platform] Web / PWA ortamı etkinleştirildi.');

  // 0. Çapraz-kök scraping isteklerini /api/proxy geçidine bağla (web'de
  //    kaynak üretiminin ön koşulu — CORS kırpığı).
  try { fetchShimKur(); } catch (err) { console.warn('[Platform] fetch shim kurulamadı:', err); }

  // 1. Service Worker Kaydı ve Güncelleme Takibi
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      const workerBuild = '20260920-mobile-preview-2';
      const reloadMarker = `cinepulse-sw-reloaded-${workerBuild}`;

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (sessionStorage.getItem(reloadMarker)) return;
        sessionStorage.setItem(reloadMarker, '1');
        window.location.reload();
      });

      navigator.serviceWorker.register(`/sw.js?build=${workerBuild}`, { updateViaCache: 'none' })
        .then((registration) => registration.update())
        .catch(() => {});
    });
  }

  // 2. PWA Kurulum Olaylarını Başlat
  try {
    initPwa();
  } catch (err) {
    console.warn('[Platform] PWA başlatılamadı:', err);
  }
}
