/* ==========================================================================
   CinePulse Studio - Apple TV+ & Netflix Luxury Hero Spotlight Component
   Features high-impact full-bleed cinematic ambient backdrop, dynamic metadata,
   instant trailer player, direct watchlist toggle, and smooth auto-rotator.
   ========================================================================== */

import { getImageUrl, TMDB_IMAGE_SIZES, fetchMediaTrailer, generateCinematicOverview } from '../services/tmdbApi.js';
import { isWatchlist, toggleWatchlist, isKidProfileActive, isItemKidSafe, getUserSettings } from '../services/storage.js';
import { openTrailerModal } from './TrailerModal.js';
import { showToast } from './Toast.js';

let currentSlideIndex = 0;
let slideInterval = null;

function getHeroBackdropUrl(item) {
  const size = window.innerWidth <= 768
    ? TMDB_IMAGE_SIZES.BACKDROP_LARGE
    : TMDB_IMAGE_SIZES.BACKDROP_XLARGE;
  return getImageUrl(item?.backdrop_path, size);
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

  return `
    <section class="hero-slider" id="hero-slider-section">
      <div class="hero-ambient-glow"></div>

      <img class="hero-backdrop" id="hero-backdrop-img" src="${backdropUrl}" alt="" loading="eager" fetchpriority="high" decoding="async" />
      <div class="hero-overlay-gradient"></div>
      
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

          <!-- Apple TV+ Pill Carousel Indicators -->
          <div class="hero-dots-wrapper" id="hero-dots-container">
            ${slides.map((_, idx) => `
              <div class="hero-dot ${idx === currentSlideIndex ? 'active' : ''}" data-index="${idx}"></div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function attachHeroSliderEvents(items = []) {
  const isKid = isKidProfileActive();
  const safeItems = isKid ? items.filter(isItemKidSafe) : items;
  if (!safeItems || safeItems.length === 0) return;

  const slides = safeItems.slice(0, 10);
  currentSlideIndex = 0;
  const playBtn = document.getElementById('hero-play-btn');
  const listBtn = document.getElementById('hero-list-btn');
  const trailerBtn = document.getElementById('hero-trailer-btn');

  // The first image is requested with high priority. Warm upcoming slides only
  // after it has started so automatic rotations do not show an empty backdrop.
  const warmUpcomingBackdrops = () => {
    slides.slice(1, 4).forEach(item => {
      const image = new Image();
      image.decoding = 'async';
      image.src = getHeroBackdropUrl(item);
    });
  };
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(warmUpcomingBackdrops, { timeout: 1500 });
  } else {
    window.setTimeout(warmUpcomingBackdrops, 500);
  }

  // Warm the current and next trailer while the hero is visible so opening the
  // modal is normally instant without preloading every slide.
  slides.slice(0, 2).forEach(item => {
    const itemType = item.first_air_date || item.media_type === 'tv' ? 'tv' : 'movie';
    fetchMediaTrailer(itemType, item.id).catch(() => null);
  });

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      const id = playBtn.getAttribute('data-id');
      const type = playBtn.getAttribute('data-type');
      window.location.hash = `#detail?type=${type}&id=${id}`;
    });
  }

  if (trailerBtn) {
    trailerBtn.addEventListener('click', async () => {
      if (getUserSettings().trailersEnabled === false) {
        showToast('Fragmanlar yönetici ayarlarından kapatıldı.', 'info');
        return;
      }
      const currentItem = slides[currentSlideIndex];
      if (!currentItem) return;
      const type = currentItem.first_air_date || currentItem.media_type === 'tv' ? 'tv' : 'movie';
      const originalText = trailerBtn.innerHTML;
      trailerBtn.innerHTML = `<i data-lucide="loader-2" class="spin-loader" style="width:17px;height:17px;"></i> <span>Yükleniyor...</span>`;
      if (window.lucide) window.lucide.createIcons();

      try {
        const trailerInfo = await fetchMediaTrailer(type, currentItem.id);
        if (trailerInfo) {
          openTrailerModal({
            title: currentItem.title || currentItem.name,
            trailerInfo
          });
        } else {
          showToast('Bu yapım için resmi tanıtım fragmanı bulunamadı.', 'info');
        }
      } catch (err) {
        console.error('Hero trailer error:', err);
        showToast('Fragman yüklenirken hata oluştu.', 'error');
      } finally {
        trailerBtn.innerHTML = originalText;
        if (window.lucide) window.lucide.createIcons();
      }
    });
  }

  if (listBtn && slides.length > 0) {
    listBtn.addEventListener('click', () => {
      const currentItem = slides[currentSlideIndex];
      const added = toggleWatchlist(currentItem);
      showToast(added ? 'İzleme listene eklendi!' : 'İzleme listenden çıkarıldı.', added ? 'success' : 'info');
      listBtn.title = added ? 'Listemden Çıkar' : 'Listeme Ekle';
      listBtn.innerHTML = `<i data-lucide="${added ? 'check' : 'plus'}" style="width: 17px; height: 17px; ${added ? 'color: var(--primary);' : ''}"></i>`;
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // Handle dot clicks
  document.querySelectorAll('.hero-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      currentSlideIndex = idx;
      updateHeroSlide(slides[idx]);
    });
  });

  // Auto-rotator every 6 seconds for dynamic feel
  clearInterval(slideInterval);
  slideInterval = setInterval(() => {
    if (slides.length > 0) {
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      updateHeroSlide(slides[currentSlideIndex]);
    }
  }, 6000);
}

function updateHeroSlide(item) {
  if (!item) return;
  if (isKidProfileActive() && !isItemKidSafe(item)) return;
  const backdropEl = document.getElementById('hero-backdrop-img');
  const titleEl = document.getElementById('hero-title-text');
  const overviewEl = document.getElementById('hero-overview-text');
  const playBtn = document.getElementById('hero-play-btn');
  const listBtn = document.getElementById('hero-list-btn');
  const trailerBtn = document.getElementById('hero-trailer-btn');

  const ratingBadge = document.getElementById('hero-rating-badge');
  const yearBadge = document.getElementById('hero-year-badge');
  const typeBadge = document.getElementById('hero-type-badge');

  const type = item.first_air_date || item.media_type === 'tv' ? 'tv' : 'movie';
  const backdropUrl = getHeroBackdropUrl(item);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : '8.5';
  const year = (item.first_air_date || item.release_date || '').substring(0, 4);

  if (backdropEl && backdropEl.src !== backdropUrl) {
    backdropEl.dataset.pendingSrc = backdropUrl;
    const nextBackdrop = new Image();
    nextBackdrop.decoding = 'async';
    nextBackdrop.onload = () => {
      if (backdropEl.isConnected && backdropEl.dataset.pendingSrc === backdropUrl) {
        backdropEl.src = backdropUrl;
      }
    };
    nextBackdrop.src = backdropUrl;
  }
  if (titleEl) titleEl.textContent = item.title || item.name;
  const slideOverview = (item.overview && item.overview.trim().length > 15)
    ? item.overview
    : generateCinematicOverview(item, type);
  if (overviewEl) overviewEl.textContent = slideOverview;

  if (ratingBadge) ratingBadge.innerHTML = `<i data-lucide="star" style="width:13px; height:13px; fill: currentColor"></i> ${rating} IMDb`;
  if (yearBadge) yearBadge.textContent = year || '2024';
  if (typeBadge) typeBadge.textContent = type === 'tv' ? 'DİZİ' : 'FİLM';

  if (playBtn) {
    playBtn.setAttribute('data-id', item.id);
    playBtn.setAttribute('data-type', type);
  }
  if (trailerBtn) {
    trailerBtn.setAttribute('data-id', item.id);
    trailerBtn.setAttribute('data-type', type);
  }
  if (listBtn) {
    listBtn.setAttribute('data-id', item.id);
    listBtn.setAttribute('data-type', type);
    const inList = isWatchlist(item.id);
    listBtn.title = inList ? 'Listemden Çıkar' : 'Listeme Ekle';
    listBtn.innerHTML = `<i data-lucide="${inList ? 'check' : 'plus'}" style="width: 17px; height: 17px; ${inList ? 'color: var(--primary);' : ''}"></i>`;
  }

  if (window.lucide) window.lucide.createIcons();

  // Update dots
  document.querySelectorAll('.hero-dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentSlideIndex);
  });
}
