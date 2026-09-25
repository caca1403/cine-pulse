import { renderIcons } from '../services/icons.js';
/* ==========================================================================
   CinePulse Studio – Hero Spotlight Slider
   • Touch/mouse swipe (threshold-based, no accidental taps)
   • Arrow button nav (prev / next)
   • Keyboard ← → navigation
   • Dot indicators (clickable)
   • Auto-rotate every 6 s on all screen sizes
   • Cinematic crossfade backdrop transition
   ========================================================================== */

import { getImageUrl, TMDB_IMAGE_SIZES, fetchMediaTrailer, generateCinematicOverview } from '../services/tmdbApi.js';
import { isWatchlist, toggleWatchlist, isKidProfileActive, isItemKidSafe, getUserSettings } from '../services/storage.js';
import { openTrailerModal } from './TrailerModal.js';
import { showToast } from './Toast.js';

let currentSlideIndex = 0;
let slideInterval = null;
let heroTransitionToken = 0;
const heroBackdropCache = new Map();

export function stopHeroSlider() {
  clearInterval(slideInterval);
  slideInterval = null;
  heroTransitionToken++;
}

function getHeroBackdropUrl(item) {
  const path = item?.backdrop_path || item?.poster_path;
  const size = window.innerWidth <= 768
    ? TMDB_IMAGE_SIZES.BACKDROP_LARGE
    : TMDB_IMAGE_SIZES.BACKDROP_XLARGE;
  return getImageUrl(path, size);
}

function preloadHeroBackdrop(url, priority = 'auto') {
  if (!url) return Promise.resolve(null);
  if (heroBackdropCache.has(url)) return heroBackdropCache.get(url);

  const promise = new Promise(resolve => {
    const image = new Image();
    image.decoding = 'async';
    image.fetchPriority = priority;
    image.onload = async () => {
      try { await image.decode(); } catch (_) {}
      resolve(url);
    };
    image.onerror = () => {
      heroBackdropCache.delete(url);
      resolve(null);
    };
    image.src = url;
  });
  heroBackdropCache.set(url, promise);
  return promise;
}

export function renderHeroSlider(items = []) {
  const isKid = isKidProfileActive();
  const safeItems = isKid ? items.filter(isItemKidSafe) : items;
  if (!safeItems || safeItems.length === 0) return '';

  currentSlideIndex = 0;
  const slides = safeItems.slice(0, 10);
  const featured = slides[0];

  const id = featured.id;
  const type = featured.first_air_date || featured.media_type === 'tv' ? 'tv' : 'movie';
  const title = featured.title || featured.name || 'Öne Çıkan Yapım';
  const overview = (featured.overview && featured.overview.trim().length > 15) ? featured.overview : generateCinematicOverview(featured, type);
  const backdropUrl = getHeroBackdropUrl(featured);
  const rating = featured.vote_average ? featured.vote_average.toFixed(1) : '8.8';
  const year = (featured.first_air_date || featured.release_date || '').substring(0, 4);
  const inWatchlist = isWatchlist(id);

  let preloadLink = document.getElementById('hero-backdrop-preload');
  if (!preloadLink) {
    preloadLink = document.createElement('link');
    preloadLink.id = 'hero-backdrop-preload';
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    document.head.appendChild(preloadLink);
  }
  preloadLink.href = backdropUrl;
  preloadLink.fetchPriority = 'high';
  if (window.innerWidth > 768) preloadHeroBackdrop(backdropUrl, 'high');

  return `
    <section class="hero-slider is-loading" id="hero-slider-section" aria-busy="true">
      <div class="hero-ambient-glow"></div>

      <img class="hero-backdrop" id="hero-backdrop-img" src="${backdropUrl}" alt="" loading="eager" fetchpriority="high" decoding="async" sizes="100vw" />
      <div class="hero-overlay-gradient"></div>

      <!-- Prev / Next Arrow Buttons -->
      <button class="hero-arrow hero-arrow-prev" id="hero-arrow-prev" aria-label="Önceki">
        <i data-lucide="chevron-left" style="width:22px;height:22px;"></i>
      </button>
      <button class="hero-arrow hero-arrow-next" id="hero-arrow-next" aria-label="Sonraki">
        <i data-lucide="chevron-right" style="width:22px;height:22px;"></i>
      </button>

      <div class="container">
        <div class="hero-content">
          <div class="hero-badge-row" id="hero-badge-row">
            <span class="badge badge-rating" id="hero-rating-badge">
              <i data-lucide="star" style="width:12px; height:12px; fill: currentColor"></i> ${rating} IMDb
            </span>
            <span class="badge" id="hero-year-badge">${year}</span>
            <span class="badge badge-type" id="hero-type-badge">${type === 'tv' ? 'DİZİ' : 'FİLM'}</span>
          </div>

          <h1 class="hero-title" id="hero-title-text">${title}</h1>
          <p class="hero-overview" id="hero-overview-text">${overview}</p>

          <div class="hero-actions">
            <button class="btn-primary hero-btn-play" id="hero-play-btn" data-id="${id}" data-type="${type}">
              <i data-lucide="play" style="fill: currentColor; width: 17px; height: 17px;"></i>
              <span>Hemen İzle</span>
            </button>

            <button class="btn-secondary hero-btn-trailer" id="hero-trailer-btn" data-id="${id}" data-type="${type}" title="Fragmanı İzle">
              <i data-lucide="clapperboard" style="width: 16px; height: 16px;"></i>
              <span>Fragman</span>
            </button>

            <button class="btn-secondary hero-btn-list-icon" id="hero-list-btn" data-id="${id}" data-type="${type}" title="${inWatchlist ? 'Listemden Çıkar' : 'Listeme Ekle'}">
              <i data-lucide="${inWatchlist ? 'check' : 'plus'}" style="width: 17px; height: 17px; ${inWatchlist ? 'color: var(--primary);' : ''}"></i>
            </button>
          </div>

          <!-- Dot Indicators -->
          <div class="hero-dots-wrapper" id="hero-dots-container">
            ${slides.map((_, idx) => `
              <div class="hero-dot ${idx === currentSlideIndex ? 'active' : ''}" data-index="${idx}" role="button" aria-label="Slayt ${idx + 1}"></div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

/* ==========================================================================
   Attach Events
   ========================================================================== */
export function attachHeroSliderEvents(items = []) {
  const isKid = isKidProfileActive();
  const safeItems = isKid ? items.filter(isItemKidSafe) : items;
  if (!safeItems || safeItems.length === 0) return;

  const slides = safeItems.slice(0, 10);
  currentSlideIndex = 0;

  const playBtn      = document.getElementById('hero-play-btn');
  const listBtn      = document.getElementById('hero-list-btn');
  const trailerBtn   = document.getElementById('hero-trailer-btn');
  const heroSection  = document.getElementById('hero-slider-section');
  const firstBackdrop = document.getElementById('hero-backdrop-img');
  const prevBtn      = document.getElementById('hero-arrow-prev');
  const nextBtn      = document.getElementById('hero-arrow-next');

  /* ---- reveal first slide ---- */
  const revealFirstSlide = async () => {
    if (firstBackdrop && !firstBackdrop.complete) {
      await new Promise(resolve => {
        firstBackdrop.addEventListener('load', resolve, { once: true });
        firstBackdrop.addEventListener('error', resolve, { once: true });
      });
    }
    if (firstBackdrop?.complete && firstBackdrop.naturalWidth > 0) {
      try { await firstBackdrop.decode(); } catch (_) {}
    }
    requestAnimationFrame(() => {
      if (heroSection?.isConnected) {
        heroSection.classList.remove('is-loading');
        heroSection.setAttribute('aria-busy', 'false');
      }
    });
  };
  revealFirstSlide();

  /* ---- preload upcoming backdrops ---- */
  const warmUpcoming = () => slides.slice(1, 4).forEach(item => preloadHeroBackdrop(getHeroBackdropUrl(item)));
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(warmUpcoming, { timeout: 1500 });
  } else {
    setTimeout(warmUpcoming, 500);
  }

  /* ---- trailer pre-warm ---- */
  slides.slice(0, 2).forEach(item => {
    const t = item.first_air_date || item.media_type === 'tv' ? 'tv' : 'movie';
    fetchMediaTrailer(t, item.id).catch(() => null);
  });

  /* ---- navigate helpers ---- */
  function goNext() {
    updateHeroSlide(slides[(currentSlideIndex + 1) % slides.length], (currentSlideIndex + 1) % slides.length);
    resetAutoRotate();
  }
  function goPrev() {
    updateHeroSlide(slides[(currentSlideIndex - 1 + slides.length) % slides.length], (currentSlideIndex - 1 + slides.length) % slides.length);
    resetAutoRotate();
  }

  /* ---- arrow buttons ---- */
  prevBtn?.addEventListener('click', goPrev);
  nextBtn?.addEventListener('click', goNext);

  /* ---- keyboard ---- */
  const keyHandler = (e) => {
    if (!heroSection?.isConnected) { document.removeEventListener('keydown', keyHandler); return; }
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft')  goPrev();
  };
  document.addEventListener('keydown', keyHandler);

  /* ---- touch / mouse drag swipe ---- */
  let dragStartX = null;
  let dragging = false;
  const SWIPE_THRESHOLD = 50; // px

  function onDragStart(x) { dragStartX = x; dragging = true; }
  function onDragEnd(x) {
    if (!dragging || dragStartX === null) return;
    dragging = false;
    const delta = dragStartX - x;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    delta > 0 ? goNext() : goPrev();
    dragStartX = null;
  }

  // Touch
  heroSection?.addEventListener('touchstart', e => onDragStart(e.touches[0].clientX), { passive: true });
  heroSection?.addEventListener('touchend',   e => onDragEnd(e.changedTouches[0].clientX), { passive: true });
  heroSection?.addEventListener('touchcancel', () => { dragging = false; dragStartX = null; }, { passive: true });

  // Mouse drag (desktop)
  heroSection?.addEventListener('mousedown',  e => { if (e.button === 0) onDragStart(e.clientX); });
  heroSection?.addEventListener('mouseup',    e => { if (e.button === 0) onDragEnd(e.clientX); });
  heroSection?.addEventListener('mouseleave', ()  => { dragging = false; dragStartX = null; });

  /* ---- play button ---- */
  playBtn?.addEventListener('click', () => {
    window.location.hash = `#detail?type=${playBtn.getAttribute('data-type')}&id=${playBtn.getAttribute('data-id')}`;
  });

  /* ---- trailer button ---- */
  trailerBtn?.addEventListener('click', async () => {
    if (getUserSettings().trailersEnabled === false) {
      showToast('Fragmanlar yönetici ayarlarından kapatıldı.', 'info');
      return;
    }
    const currentItem = slides[currentSlideIndex];
    if (!currentItem) return;
    const type = currentItem.first_air_date || currentItem.media_type === 'tv' ? 'tv' : 'movie';
    const originalHTML = trailerBtn.innerHTML;
    trailerBtn.innerHTML = `<i data-lucide="loader-2" class="spin-loader" style="width:17px;height:17px;"></i> <span>Yükleniyor...</span>`;
    renderIcons(trailerBtn);
    try {
      const trailerInfo = await fetchMediaTrailer(type, currentItem.id, currentItem.title || currentItem.name);
      if (trailerInfo) {
        openTrailerModal({ title: currentItem.title || currentItem.name, trailerInfo, mediaId: currentItem.id, mediaType: type });
      } else {
        showToast('Bu yapım için resmi tanıtım fragmanı bulunamadı.', 'info');
      }
    } catch (err) {
      console.error('Hero trailer error:', err);
      showToast('Fragman yüklenirken hata oluştu.', 'error');
    } finally {
      trailerBtn.innerHTML = originalHTML;
      renderIcons(trailerBtn);
    }
  });

  /* ---- watchlist button ---- */
  listBtn?.addEventListener('click', () => {
    const currentItem = slides[currentSlideIndex];
    const added = toggleWatchlist(currentItem);
    showToast(added ? 'İzleme listene eklendi!' : 'İzleme listenden çıkarıldı.', added ? 'success' : 'info');
    listBtn.title = added ? 'Listemden Çıkar' : 'Listeme Ekle';
    listBtn.innerHTML = `<i data-lucide="${added ? 'check' : 'plus'}" style="width: 17px; height: 17px; ${added ? 'color: var(--primary);' : ''}"></i>`;
    renderIcons(listBtn);
  });

  /* ---- dots ---- */
  document.querySelectorAll('.hero-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      updateHeroSlide(slides[idx], idx);
      resetAutoRotate();
    });
  });

  /* ---- auto-rotate (both mobile + desktop) ---- */
  function resetAutoRotate() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
      if (slides.length > 1) {
        const next = (currentSlideIndex + 1) % slides.length;
        updateHeroSlide(slides[next], next);
      }
    }, 6000);
  }
  resetAutoRotate();
}

/* ==========================================================================
   Update Slide (crossfade)
   ========================================================================== */
async function updateHeroSlide(item, targetSlideIndex = currentSlideIndex) {
  if (!item) return;
  if (isKidProfileActive() && !isItemKidSafe(item)) return;

  const backdropEl  = document.getElementById('hero-backdrop-img');
  const titleEl     = document.getElementById('hero-title-text');
  const overviewEl  = document.getElementById('hero-overview-text');
  const playBtn     = document.getElementById('hero-play-btn');
  const listBtn     = document.getElementById('hero-list-btn');
  const trailerBtn  = document.getElementById('hero-trailer-btn');
  const ratingBadge = document.getElementById('hero-rating-badge');
  const yearBadge   = document.getElementById('hero-year-badge');
  const typeBadge   = document.getElementById('hero-type-badge');

  const type       = item.first_air_date || item.media_type === 'tv' ? 'tv' : 'movie';
  const backdropUrl = getHeroBackdropUrl(item);
  const rating     = item.vote_average ? item.vote_average.toFixed(1) : '8.5';
  const year       = (item.first_air_date || item.release_date || '').substring(0, 4);

  const transitionToken = ++heroTransitionToken;

  if (backdropEl && backdropEl.src !== backdropUrl) {
    const loadedUrl = await preloadHeroBackdrop(backdropUrl, 'high');
    if (!loadedUrl || transitionToken !== heroTransitionToken || !backdropEl.isConnected) return;
    backdropEl.src = loadedUrl;
    try { await backdropEl.decode(); } catch (_) {}
    if (transitionToken !== heroTransitionToken || !backdropEl.isConnected) return;
  }

  currentSlideIndex = targetSlideIndex;

  const heroContent = document.querySelector('#hero-slider-section .hero-content');
  heroContent?.classList.remove('hero-content-committing');
  requestAnimationFrame(() => {
    if (heroContent?.isConnected) heroContent.classList.add('hero-content-committing');
  });

  if (titleEl) titleEl.textContent = item.title || item.name;
  const slideOverview = (item.overview && item.overview.trim().length > 15)
    ? item.overview : generateCinematicOverview(item, type);
  if (overviewEl) overviewEl.textContent = slideOverview;

  if (ratingBadge) ratingBadge.innerHTML = `<i data-lucide="star" style="width:13px;height:13px;fill:currentColor"></i> ${rating} IMDb`;
  if (yearBadge)   yearBadge.textContent = year || '2024';
  if (typeBadge)   typeBadge.textContent = type === 'tv' ? 'DİZİ' : 'FİLM';

  if (playBtn)    { playBtn.setAttribute('data-id', item.id);    playBtn.setAttribute('data-type', type); }
  if (trailerBtn) { trailerBtn.setAttribute('data-id', item.id); trailerBtn.setAttribute('data-type', type); }
  if (listBtn) {
    listBtn.setAttribute('data-id', item.id);
    listBtn.setAttribute('data-type', type);
    const inList = isWatchlist(item.id);
    listBtn.title = inList ? 'Listemden Çıkar' : 'Listeme Ekle';
    listBtn.innerHTML = `<i data-lucide="${inList ? 'check' : 'plus'}" style="width:17px;height:17px;${inList ? 'color:var(--primary);' : ''}"></i>`;
  }

  renderIcons(document.getElementById('hero-slider-section'));

  document.querySelectorAll('.hero-dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentSlideIndex);
  });
}
