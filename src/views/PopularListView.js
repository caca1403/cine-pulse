/* ==========================================================================
   CinePulse Studio - Pure Popular Series / Movies Grid View
   Pure popularity-ordered infinite scrolling view for Series and Movies.
   With in-memory state preservation (persists loaded items & scroll on return).
   ========================================================================== */

import { fetchPopularSeries, fetchPopularMovies, fetchPopularAnime, fetchPopularDocumentaries } from '../services/tmdbApi.js';
import { renderMediaCard, attachMediaCardEvents } from '../components/MediaCard.js';

// Cache loaded items and pagination per category so returning from detail never resets scroll or items
const popularListCache = {
  tv: { allItems: [], currentPage: 1, isExhausted: false },
  movie: { allItems: [], currentPage: 1, isExhausted: false },
  anime: { allItems: [], currentPage: 1, isExhausted: false },
  documentary: { allItems: [], currentPage: 1, isExhausted: false }
};

export async function renderPopularListView(type = 'tv') {
  if (!popularListCache[type]) {
    popularListCache[type] = { allItems: [], currentPage: 1, isExhausted: false };
  }

  const cache = popularListCache[type];
  let isLoading = false;

  let titleText = 'Tüm Zamanların En Popüler Dizileri';
  let iconName = 'tv-2';
  if (type === 'movie') {
    titleText = 'Tüm Zamanların En Popüler Filmleri';
    iconName = 'clapperboard';
  } else if (type === 'anime') {
    titleText = 'Tüm Zamanların En Popüler Animeleri';
    iconName = 'sparkles';
  } else if (type === 'documentary') {
    titleText = 'Tüm Zamanların En Çok İzlenen Belgeselleri';
    iconName = 'globe';
  }

  // If cache has items, pre-render them so the page is instantly full-height on navigation back
  const hasCachedItems = cache.allItems.length > 0;
  const initialCardsHTML = hasCachedItems
    ? cache.allItems.map(item => renderMediaCard(item)).join('')
    : '<div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">İçerikler yükleniyor...</div>';

  const html = `
    <div class="popular-list-view">
      <div class="container">
        <!-- Header -->
        <div class="popular-list-header">
          <h1 class="popular-list-title">
            <span class="rail-icon-pill" style="--rail-color: #f59e0b; width: 32px; height: 32px; flex-shrink: 0;">
              <i data-lucide="${iconName}" style="width: 17px; height: 17px;"></i>
            </span>
            <span>${titleText}</span>
          </h1>
          <p class="popular-list-sub" id="popular-count-label">Tüm zamanların oy sayısına ve genel popülerliğine göre listeleniyor</p>
        </div>

        <!-- Media Grid -->
        <div class="media-grid" id="popular-media-grid">
          ${initialCardsHTML}
        </div>

        <!-- Scroll Sentinel / Loader -->
        <div id="popular-sentinel" style="height: 60px; display: flex; align-items: center; justify-content: center; margin-top: 2rem; color: var(--text-muted);">
          <i data-lucide="loader-2" class="spin-loader" style="width: 28px; height: 28px; display: none;"></i>
        </div>
      </div>
    </div>
  `;

  return {
    html,
    init: (container) => {
      if (!container) return;

      const grid = container.querySelector('#popular-media-grid');
      const sentinel = container.querySelector('#popular-sentinel');
      const spinner = sentinel ? sentinel.querySelector('.spin-loader') : null;

      if (hasCachedItems) {
        attachMediaCardEvents(grid);
      }

      const loadMore = async () => {
        if (isLoading || cache.isExhausted) return;
        isLoading = true;

        if (spinner) spinner.style.display = 'block';

        try {
          let newItems = [];
          if (type === 'tv') {
            newItems = await fetchPopularSeries(cache.currentPage);
          } else if (type === 'movie') {
            newItems = await fetchPopularMovies(cache.currentPage);
          } else if (type === 'anime') {
            newItems = await fetchPopularAnime(cache.currentPage);
          } else if (type === 'documentary') {
            newItems = await fetchPopularDocumentaries(cache.currentPage);
          }
          if (spinner) spinner.style.display = 'none';

          if (!newItems || newItems.length === 0) {
            cache.isExhausted = true;
            return;
          }

          cache.allItems = [...cache.allItems, ...newItems];
          const newCardsHTML = newItems.map(item => renderMediaCard(item)).join('');
          if (cache.currentPage === 1 && !hasCachedItems) {
            grid.innerHTML = newCardsHTML;
          } else {
            grid.insertAdjacentHTML('beforeend', newCardsHTML);
          }
          if (window.lucide) window.lucide.createIcons();
          attachMediaCardEvents(grid);

          cache.currentPage += 1;
        } catch (err) {
          console.error('Error loading popular media:', err);
          if (spinner) spinner.style.display = 'none';
          if (cache.currentPage === 1 && (!cache.allItems || cache.allItems.length === 0)) {
            grid.innerHTML = `
              <div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">
                <p style="margin-bottom: 0.75rem;">İçerikler yüklenirken bir sorun oluştu.</p>
                <button id="btn-retry-popular" class="btn-secondary" style="padding: 0.5rem 1.2rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
                  <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
                  <span>Tekrar Dene</span>
                </button>
              </div>
            `;
            if (window.lucide) window.lucide.createIcons();
            grid.querySelector('#btn-retry-popular')?.addEventListener('click', () => {
              loadMore();
            });
          }
        } finally {
          isLoading = false;
        }
      };

      // Only perform initial load if we don't have cached items
      if (!hasCachedItems) {
        loadMore();
      }

      // Infinite scroll with IntersectionObserver
      if (sentinel) {
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            loadMore();
          }
        }, { rootMargin: '0px 0px 400px 0px' });

        observer.observe(sentinel);
      }
    }
  };
}
