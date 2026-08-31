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
    : '<div class="popular-loading-placeholder" style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);"><div class="spin-loader" style="width: 32px; height: 32px; border: 3px solid rgba(245,158,11,0.2); border-top-color: #f59e0b; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem;"></div><p>İçerikler yükleniyor...</p></div>';

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

        <!-- Scroll Sentinel / Loader Container -->
        <div id="popular-sentinel" style="min-height: 80px; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 2.5rem 0 4rem; color: var(--text-muted);">
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

      const showLoading = () => {
        if (!sentinel) return;
        sentinel.innerHTML = `
          <div style="display: flex; align-items: center; gap: 0.75rem; color: var(--text-secondary); font-size: 0.95rem;">
            <div class="spin-loader" style="width: 24px; height: 24px; border: 3px solid rgba(245,158,11,0.2); border-top-color: #f59e0b; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            <span>Daha fazla içerik yükleniyor...</span>
          </div>
        `;
      };

      const hideLoading = () => {
        if (!sentinel) return;
        if (cache.isExhausted) {
          sentinel.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">Tüm popüler içerikler listelendi.</p>`;
        } else {
          sentinel.innerHTML = `
            <button id="btn-manual-load-more" class="btn-secondary" style="padding: 0.6rem 1.5rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.9rem; font-weight: 600; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: var(--text-primary);">
              <i data-lucide="arrow-down" style="width: 15px; height: 15px; color: #f59e0b;"></i>
              <span>Daha Fazla Yükle</span>
            </button>
          `;
          if (window.lucide) window.lucide.createIcons();
          sentinel.querySelector('#btn-manual-load-more')?.addEventListener('click', () => {
            loadMore();
          });
        }
      };

      if (hasCachedItems) {
        attachMediaCardEvents(grid);
        hideLoading();
      }

      const loadMore = async () => {
        if (isLoading || cache.isExhausted) return;
        isLoading = true;
        showLoading();

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

          if (!newItems || newItems.length === 0) {
            cache.isExhausted = true;
            hideLoading();
            return;
          }

          cache.allItems = [...cache.allItems, ...newItems];
          const newCardsHTML = newItems.map(item => renderMediaCard(item)).join('');
          
          const placeholder = grid.querySelector('.popular-loading-placeholder');
          if (placeholder) {
            grid.innerHTML = newCardsHTML;
          } else {
            grid.insertAdjacentHTML('beforeend', newCardsHTML);
          }

          if (window.lucide) window.lucide.createIcons();
          attachMediaCardEvents(grid);

          cache.currentPage += 1;
          hideLoading();

          // If content doesn't fill the screen yet (e.g. big monitor), load page 2 automatically
          setTimeout(() => {
            if (document.documentElement.scrollHeight <= window.innerHeight + 500 && !cache.isExhausted && !isLoading) {
              loadMore();
            }
          }, 150);
        } catch (err) {
          console.error('Error loading popular media:', err);
          hideLoading();
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

      // Perform initial load if cache is empty
      if (!hasCachedItems) {
        loadMore();
      }

      // 1. IntersectionObserver for smooth auto-loading on scroll
      let observer = null;
      if (sentinel && 'IntersectionObserver' in window) {
        observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            loadMore();
          }
        }, { rootMargin: '0px 0px 800px 0px' });

        observer.observe(sentinel);
      }

      // 2. Window Scroll event fallback
      const handleWindowScroll = () => {
        if (isLoading || cache.isExhausted) return;
        const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const windowHeight = window.innerHeight;
        const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

        if (scrollY + windowHeight >= docHeight - 800) {
          loadMore();
        }
      };

      window.addEventListener('scroll', handleWindowScroll, { passive: true });
      window.addEventListener('touchmove', handleWindowScroll, { passive: true });
    }
  };
}
