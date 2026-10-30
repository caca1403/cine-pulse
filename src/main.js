import { renderSiteLogo } from './components/BrandLogo.js';
import { resolveEntryHash } from './services/kabuk/entryRoute.js';
import { applyPerfMode } from './services/kabuk/performanceMode.js';
import { agHiziIzle } from './services/kabuk/agHizi.js';
// Ilk boyamadan once agir efektleri kis (yazilimsal cizimde kasmayi onler).
applyPerfMode();
// Yavaş ağ modu: sağlayıcı istek zaman aşımı tabanını ölçüme göre ayarla.
agHiziIzle();
import './styles/navigation.css';
import './styles/collection.css';
import './styles/profile.css';
import { renderIcons } from './services/kabuk/icons.js';
/* ==========================================================================
   CinePulse Pro - Main Application Router & Entry Point
   ========================================================================== */

import { renderNavbar, attachNavbarEvents } from './components/Navbar.js';
import { closeCardPreview } from './components/MediaCard.js';
import { renderHomeView, clearHomeCache, cleanupHomeView } from './views/HomeView.js';
// Non-home views and first-run modals are loaded on demand (code splitting).
const loadView = {
  detail: () => import('./views/DetailView.js'),
  library: () => import('./views/LibraryView.js'),
  downloads: () => import('./views/DownloadsView.js'),
  discover: () => import('./views/DiscoverView.js'),
  popular: () => import('./views/PopularListView.js'),
  showcase: () => import('./views/ShowcaseView.js'),
  livetv: () => import('./views/LiveTvView.js'),
  drama: () => import('./views/DramaView.js'),
  kanalim: () => import('./views/ChannelView.js')
};
import { trackScrollState, flushScrollState, restoreAllScrollState } from './services/kabuk/scrollManager.js';
import { getUserSettings } from './services/altyapi/storage.js';
import { renderCardLayoutSwitcher, placeCardLayoutSwitcher, attachCardLayoutSwitcherEvents } from './components/CardLayoutSwitcher.js';
import { openDecisionRoomModal } from './components/DecisionRoomModal.js';
import { initTraktAutoSync } from './services/icerik/traktService.js';
import { getWatchHistory, saveWatchProgress, saveBatchWatchProgress } from './services/altyapi/storage.js';
import { initPlatformBridge, isNativeAndroidApp, isNativeAndroid, isAppPlatform, isDesktopApp, isWebPlatform } from './services/platform/platformBridge.js';

// Platform Köprüsünü Çalıştır:
// Ortam tespitine göre Web, Android veya Desktop modüllerini dinamik yükler.
const platformReady = initPlatformBridge();

// Disable browser default scroll jump on SPA hash changes
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

const app = document.getElementById('app');
document.body.classList.add('cine-discovery-theme');
document.documentElement.classList.toggle('cards-landscape', getUserSettings().cardLayout === 'landscape');

if (isAppPlatform() && typeof navigator !== 'undefined' && navigator.onLine === false && window.location.hash !== '#downloads') {
  window.location.hash = '#downloads';
}

// Record scroll position continuously
window.addEventListener('scroll', () => {
  trackScrollState();
}, { passive: true });
window.addEventListener('pagehide', flushScrollState);

/* ==========================================================================
   CP-QUALITY-PACK — Route iskeleti, geçiş animasyonu ve detay yapışkan CTA
   ========================================================================== */

/* Route iskeleti: soğuk açılışta spinner yerine gerçek düzenin iskeleti basılır.
   Saf dizedir; DOM/gözlemci maliyeti yoktur. CSS: main.css (cp-skeleton). */
function cpSkelKart() {
  return '<div class="cp-sk-card"><div class="cp-sk-poster cp-shimmer"></div><div class="cp-sk-line cp-shimmer"></div><div class="cp-sk-line short cp-shimmer"></div></div>';
}

function cpSkelRay() {
  return `<section class="cp-sk-rail container"><div class="cp-sk-line title cp-shimmer"></div><div class="cp-sk-row">${cpSkelKart().repeat(6)}</div></section>`;
}

function renderRouteSkeleton(viewName) {
  if (viewName === 'detail') {
    return `<div aria-hidden="true">
      <div class="cp-sk-backdrop cp-shimmer"></div>
      <div class="cp-sk-detail-body">
        <div class="cp-sk-line heading cp-shimmer"></div>
        <div class="cp-sk-line cp-shimmer"></div>
        <div class="cp-sk-line short cp-shimmer"></div>
        <div class="cp-sk-pill cp-shimmer"></div>
        <div class="cp-sk-line cp-shimmer"></div>
        <div class="cp-sk-line cp-shimmer"></div>
        <div class="cp-sk-line short cp-shimmer"></div>
      </div>
    </div>`;
  }
  return `<div aria-hidden="true">
    <div class="cp-sk-hero cp-shimmer"></div>
    ${cpSkelRay()}
    ${cpSkelRay()}
  </div>`;
}

/* Detay sayfası mobil yapışkan CTA: "İzle/Devam Et" düğmesini başparmak
   menzilinde tutar. DetailView.js'e dokunmadan ekrandaki gerçek düğmenin
   tıklaması yönlendirilir; düğüm göründüğünde şerit gizlenir. */
let detayCtaGozlemcisi = null;

function kapatDetayYapistirCTA() {
  if (detayCtaGozlemcisi) {
    detayCtaGozlemcisi.disconnect();
    detayCtaGozlemcisi = null;
  }
  document.querySelectorAll('.cp-sticky-cta-wrap').forEach(el => el.remove());
}

function kurDetayYapistirCTA(container) {
  kapatDetayYapistirCTA();
  if (!window.matchMedia('(max-width: 860px)').matches) return;
  const playBtn = container.querySelector('#btn-play-movie, #btn-resume-series');
  if (!playBtn) return;
  const span = playBtn.querySelector('span');
  const etiket = ((span && span.firstChild && span.firstChild.textContent) || 'İzle').trim() || 'İzle';

  const wrap = document.createElement('div');
  wrap.className = 'cp-sticky-cta-wrap';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'cp-sticky-cta';
  btn.innerHTML = '<i data-lucide="play" aria-hidden="true"></i>';
  const etiketEl = document.createElement('span');
  etiketEl.textContent = etiket;
  btn.appendChild(etiketEl);
  wrap.appendChild(btn);
  document.body.appendChild(wrap);
  renderIcons(wrap);

  btn.addEventListener('click', () => playBtn.click());

  if ('IntersectionObserver' in window) {
    detayCtaGozlemcisi = new IntersectionObserver(entries => {
      // Düğüm ekran dışına çıkınca şerit belirir; geri girince çekilir.
      btn.classList.toggle('show', !entries[0].isIntersecting);
    }, { threshold: 0 });
    detayCtaGozlemcisi.observe(playBtn);
  } else {
    btn.classList.add('show');
  }
}

let routeGeneration = 0;
async function renderRoute() {
  const generation = ++routeGeneration;
  cleanupHomeView();
  flushScrollState();
  // CP-QUALITY-PACK: önceki rota'nın önizleme iframe'i ve yapışkan CTA'sı temizlenir.
  closeCardPreview();
  kapatDetayYapistirCTA();
  // '#/detail' gibi leading-slashli girdiler eskiden ana sayfaya düşüyordu
  // (harici paylaşımlar/tarayıcı otomasyonu '#' sonrası '/' ekleyebiliyor).
  const hash = resolveEntryHash(window.location.hash.replace(/^#\/+/, '#'), isAppPlatform(), new URLSearchParams(window.location.search).has('oda'));
  const isLanding = hash === '#showcase';
  document.body.classList.toggle('cp-landing-active', isLanding);
  document.title = isLanding ? 'CinePulse — Keşfet, Seç, Devam Et' : 'CinePulse - Modern Sinema & Dizi Platformu';
  let viewName = 'home';
  let params = {};

  if (hash.startsWith('#detail')) {
    viewName = 'detail';
    if (hash.includes('?')) {
      const queryStr = hash.split('?')[1] || '';
      const urlParams = new URLSearchParams(queryStr);
      params.type = urlParams.get('type') || 'tv';
      params.id = urlParams.get('id');
    } else if (hash.includes('/')) {
      const parts = hash.split('/');
      if (parts.length >= 3) {
        params.type = parts[1] || 'tv';
        params.id = parts[2];
      } else if (parts.length === 2) {
        params.type = 'tv';
        params.id = parts[1];
      }
    }
  } else if (hash === '#series') {
    viewName = 'series';
  } else if (hash === '#cartoons') {
    viewName = 'cartoons';
  } else if (hash === '#movies') {
    viewName = 'movies';
  } else if (hash === '#anime') {
    viewName = 'anime';
  } else if (hash === '#documentary') {
    viewName = 'documentary';
  } else if (hash === '#livetv') {
    // Canlı TV geçici olarak TAMAMEN kapalı (2026-10-19) — platformdan bağımsız;
    // yeniden açılana kadar tüm girişler tanıtım/ana ekrana döner.
    try {
      sessionStorage.setItem('cp_livetv_web_block', '1');
    } catch (_) {}
    window.location.replace('#showcase');
    return;
  } else if (hash === '#kanalim') {
    viewName = 'kanalim';
  } else if (hash === '#discover') {
    viewName = 'discover';
  } else if (hash === '#library') {
    viewName = 'library';
  } else if (hash === '#showcase') {
    viewName = 'showcase';
  } else if (hash === '#downloads') {
    if (!isAppPlatform()) {
      window.location.replace('#library');
      return;
    }
    viewName = 'downloads';
  } else if (hash.startsWith('#dramas')) {
    viewName = 'dramas';
    if (hash.includes('?')) {
      const queryStr = hash.split('?')[1] || '';
      const urlParams = new URLSearchParams(queryStr);
      params.slug = urlParams.get('slug');
      params.q = urlParams.get('q');
    }
  }

  window.__popularListCleanup?.();
  window.__popularListCleanup = null;
  window.__discoverCleanup?.();
  window.__discoverCleanup = null;

  // Clean up any running live TV stream or video before routing or unmounting DOM
  if (window.__LiveTvController && typeof window.__LiveTvController.cleanup === 'function') {
    window.__LiveTvController.cleanup();
  }
  document.querySelectorAll('video, audio').forEach(el => {
    try {
      el.pause();
      el.removeAttribute('src');
      el.load();
    } catch (_) {}
  });

  // Render Navbar for regular application views
  const navbarHTML = renderNavbar(viewName);
  const cardViews = new Set(['home', 'series', 'cartoons', 'movies', 'anime', 'documentary', 'discover', 'library']);
  const cardLayoutSwitcherHTML = cardViews.has(viewName) ? renderCardLayoutSwitcher() : '';

  if (viewName === 'home' || viewName === 'detail') {
    app.innerHTML = `${navbarHTML}<main class="cp-route-skeleton cp-view-enter" aria-busy="true">${renderRouteSkeleton(viewName)}</main>`;
    attachNavbarEvents();
    renderIcons(app);
  }

  let viewResult = null;
  if (viewName === 'home') {
    viewResult = await renderHomeView();
  } else if (viewName === 'detail') {
    const { renderDetailView } = await loadView.detail();
    viewResult = await renderDetailView(params.type, params.id);
  } else if (['series', 'cartoons', 'movies', 'anime', 'documentary'].includes(viewName)) {
    const listTypes = { series: 'tv', cartoons: 'cartoon', movies: 'movie', anime: 'anime', documentary: 'documentary' };
    const { renderPopularListView } = await loadView.popular();
    viewResult = await renderPopularListView(listTypes[viewName]);
  } else if (viewName === 'livetv') {
    const { renderLiveTvView } = await loadView.livetv();
    viewResult = renderLiveTvView();
  } else if (viewName === 'discover') {
    const { renderDiscoverView } = await loadView.discover();
    viewResult = await renderDiscoverView('tv');
  } else if (viewName === 'kanalim') {
    const { renderChannelView } = await loadView.kanalim();
    viewResult = await renderChannelView();
  } else if (viewName === 'library') {
    const { renderLibraryView } = await loadView.library();
    viewResult = renderLibraryView();
  } else if (viewName === 'showcase') {
    const { renderShowcaseView } = await loadView.showcase();
    viewResult = renderShowcaseView();
  } else if (viewName === 'downloads') {
    const { renderDownloadsView } = await loadView.downloads();
    viewResult = renderDownloadsView();
  } else if (viewName === 'dramas') {
    const { renderDramaView } = await loadView.drama();
    viewResult = await renderDramaView(params.slug, params.q);
  }

  if (generation !== routeGeneration) return;
  if (isLanding) {
    app.innerHTML = viewResult.html;
    viewResult.init?.(app);
    window.scrollTo(0, 0);
    return;
  }
  app.innerHTML = `
    ${navbarHTML}
    ${cardLayoutSwitcherHTML}
    <main class="cp-view-enter" style="min-height: 85vh;">
      ${viewResult ? viewResult.html : '<h2>Sayfa Bulunamadı</h2>'}
    </main>
    
    <footer style="padding: 3rem 0; background: var(--bg-surface); border-top: 1px solid var(--border-color); margin-top: 5rem;">
      <div class="container" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
          ${renderSiteLogo('cp-footer-logo')}
          <span>Cine<span class="brand-highlight">Pulse</span></span>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-muted);">
          Sunucusuz & Üyeliksiz Dizi & Film İzleme Platformu • Yerel Önbellek & JSON Aktarım Destekli
        </div>
      </div>
    </footer>
  `;

  // Attach navbar events
  attachNavbarEvents();
  placeCardLayoutSwitcher(app);
  attachCardLayoutSwitcherEvents(app);

  // Initialize view scripts & icons
  if (viewResult && viewResult.init) {
    viewResult.init(app);
  }

  // CP-QUALITY-PACK: detay sayfasında mobil yapışkan "İzle/Devam Et" şeridi
  if (viewName === 'detail') {
    kurDetayYapistirCTA(app);
  }

  if (window.lucide) {
    renderIcons();
  }

  // Restore horizontal and vertical scroll positions
  restoreAllScrollState(hash);
  scheduleProductGuides();
}

// Router Event Listeners
/** Bir öznitelik değerini güvenli hâle getirir (hata metni DOM'a yazılırken). */
function escapeAttr(deger = '') {
  return String(deger)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

async function route() {
  await platformReady;
  const generation = routeGeneration + 1;
  try {
    await renderRoute();
  } catch (error) {
    if (generation !== routeGeneration) return;
    console.error('[Router] Sayfa yüklenemedi:', error);
    // Sebeb ekranda gösterilmez (kullanıcı için yetersiz ve çirkin), ama hata
    // sayfasının üstüne yazılır: telefondan/uzaktan teşhis mümkün olsun.
    const sebep = String((error && (error.stack || error.message)) || error || '')
      .replace(/\s+/g, ' ').slice(0, 600);
    app.innerHTML = `${renderNavbar('home')}<main class="container" role="alert" style="padding:6rem 1rem" data-route-error="${escapeAttr(sebep)}"><p>Sayfa yüklenemedi. Yeniden deneyebilirsin.</p><button class="btn btn-primary" id="btn-route-retry">Yeniden Dene</button></main>`;
    attachNavbarEvents();
    app.querySelector('#btn-route-retry')?.addEventListener('click', route);
    renderIcons(app);
  }
}

// G1: hash değişiminde kabuğa sinematik fade-up (reduced-motion'da sınıf eklenmez).
let cpRouteAnimHandle = null;
function cpRouteAnim() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (cpRouteAnimHandle) cancelAnimationFrame(cpRouteAnimHandle);
  app.classList.remove('cp-anim-in');
  void app.offsetWidth; // animasyonu yeniden başlatmak için reflow
  cpRouteAnimHandle = requestAnimationFrame(() => app.classList.add('cp-anim-in'));
}

// G1: SAFE haptik yardımcı — coarse-pointer + kullanıcı ayarıyla kapatılabilir.
// ŞİMDİLİK başakta: G4 oynatıcı kullanacak (window.cpDokun).
function cpDokun(us = 'light') {
  try {
    if (!window.matchMedia('(pointer: coarse)').matches) return;
    if (getUserSettings().hapticsEnabled === false) return;
    navigator.vibrate?.(us === 'heavy' ? 16 : 8);
  } catch (_) {}
}
window.cpDokun = cpDokun;

window.addEventListener('hashchange', () => { cpRouteAnim(); route(); });

// Keep saved videos one tap away when connectivity drops. `navigator.onLine`
// is used as a signal; downloaded playback itself remains available locally.
// Module scripts run after parsing, so one initial route is enough.
route();

// A shared room is intentionally ephemeral: the URL only identifies the live
// WebRTC rendezvous and no room record is created on the application server.
setTimeout(async () => {
  try {
    // Do this small URL check before importing the WebRTC code. It keeps the
    // room transport out of every normal page load.
    const roomCode = String(new URL(window.location.href).searchParams.get('oda') || '').replace(/\D/g, '');
    if (!/^\d{6}$/.test(roomCode)) return;
    openDecisionRoomModal({ roomCode });
  } catch (_) {}
}, 700);

// Defer profile setup and the product guide until the visitor enters the app.
let productGuidesScheduled = false;
function scheduleProductGuides() {
  if (productGuidesScheduled) return;
  productGuidesScheduled = true;
  setTimeout(async () => {
    if (document.body.classList.contains('cp-landing-active')) { productGuidesScheduled = false; return; }
    try {
      const { checkAndShowProfileOnboarding } = await import('./components/ProfileOnboardingModal.js');
      if (!document.body.classList.contains('cp-landing-active')) checkAndShowProfileOnboarding();
    } catch (_) {}
  }, 400);
  setTimeout(async () => {
    if (document.body.classList.contains('cp-landing-active')) return;
    try {
      const { checkAndShowProductTour } = await import('./components/ProductTour.js');
      if (!document.body.classList.contains('cp-landing-active')) checkAndShowProductTour();
    } catch (_) {}
  }, 1200);
}

// Keep Trakt synced on launch, after connecting, and when returning to the app.
const traktStorageMethods = { getWatchHistory, saveWatchProgress, saveBatchWatchProgress };
window.addEventListener('cinepulse_trakt_auth_changed', (event) => {
  if (event.detail?.connected) initTraktAutoSync(traktStorageMethods);
});
initTraktAutoSync(traktStorageMethods);

// Data change event listeners (Only reload whole route when backup data is imported or cleared)
const onExternalDataImport = (e) => {
  if (e && e.detail && (e.detail.action === 'import' || e.detail.cleared)) {
    route();
  }
};
window.addEventListener('sineflix_data_changed', onExternalDataImport);
window.addEventListener('cinepulse_data_changed', onExternalDataImport);

// #13 magnet: şema yakalama — dışarıdan (tarayıcı/dosya yöneticisi) gelen
// magnet: bağlantısı P2P penceresine beslenir. Android: MainActivity
// onNewIntent → __cpMagnetGeldi; masaüstü: Electron ikinci-örnek olayı.
window.__cpMagnetGeldi = (magnet) => {
  const m = String(magnet || '').trim();
  if (!m.startsWith('magnet:')) return false;
  import('./components/P2pModal.js').then(({ openP2pModal }) => {
    openP2pModal({ magnet: m });
  });
  return true;
};

// #15 derin bağlantı: cinepulse://… veya paylaşılan web adresi → rota.
// Android MainActivity semaliVeriYonlendir + Electron protokol/argv buraya verir.
window.__cpDerinBaglanti = (adres) => {
  import('./services/kabuk/derinBaglanti.js').then(({ derinBaglantiUygula }) => {
    derinBaglantiUygula(adres);
  });
  return true;
};

// #12 uygulama kilidi kapanı: kilit açıksa açılışta overlay; Java arka plan
// dönüşünde __cpKilitGoster ile hatırlatır. Web/masaüstünde köprü yok → sessiz.
import('./services/kabuk/uygulamaKilidi.js').then((m) => m.kilidiKur()).catch(() => {});

// Seamless Profile Switch Handler (Zero full page reload)
window.addEventListener('sineflix_profile_changed', async () => {
  clearHomeCache();
  await route();
});
window.addEventListener('storage', (event) => {
  if (event.key !== 'sineflix_user_settings_v1') return;
  const settings = getUserSettings();
  document.documentElement.classList.toggle('cards-landscape', settings.cardLayout === 'landscape');
  clearHomeCache();
  route();
});

/* Cihaz ölçüm kancası — yalnız VITE_DEVICE_SWEEP=1 (dev) derlemesinde yüklenir.
   Dinamik import sayesinde ÜRETİM paketine hiç girmez.
   window.__cpSag / __cpSweep / __cpSaglik → tools/cihaz-cdp.mjs çağırır. */
if (import.meta.env?.VITE_DEVICE_SWEEP === '1') {
  import('./devtools/deviceSweep.js')
    .then(m => m.kancayiKur())
    .catch(() => { /* ölçüm kancası yoksa uygulama yine çalışır */ });
}
