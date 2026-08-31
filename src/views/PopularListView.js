/* ==========================================================================
   CinePulse Studio - Ultra-Fast Infinite Scrolling View
   Progressive 3-page parallel fetching with instant first-paint rendering.
   ========================================================================== */

import { fetchPopularSeries, fetchPopularMovies, fetchPopularAnime, fetchPopularDocumentaries } from '../services/tmdbApi.js';
import { renderMediaCard, attachMediaCardEvents } from '../components/MediaCard.js';

// In-memory cache per category — resets on each fresh view render
const popularListCache = {};

function getCache(type) {
  if (!popularListCache[type] || popularListCache[type].stale) {
    popularListCache[type] = { allItems: [], seenIds: new Set(), nextPage: 1, isExhausted: false, stale: false };
  }
  return popularListCache[type];
}

function getFetcher(type) {
  switch (type) {
    case 'movie': return fetchPopularMovies;
    case 'anime': return fetchPopularAnime;
    case 'documentary': return fetchPopularDocumentaries;
    default: return fetchPopularSeries;
  }
}

export async function renderPopularListView(type = 'tv') {
  // Mark old cache as stale so it gets reset
  if (popularListCache[type]) {
    popularListCache[type].stale = true;
  }

  const cache = getCache(type);

  const titleMap = {
    tv: ['Tüm Zamanların En Popüler Dizileri', 'tv-2'],
    movie: ['Tüm Zamanların En Popüler Filmleri', 'clapperboard'],
    anime: ['Tüm Zamanların En Popüler Animeleri', 'sparkles'],
    documentary: ['Tüm Zamanların En Çok İzlenen Belgeselleri', 'globe']
  };
  const [titleText, iconName] = titleMap[type] || titleMap.tv;

  const html = `
    <div class="popular-list-view">
      <div class="container">
        <div class="popular-list-header">
          <h1 class="popular-list-title">
            <span class="rail-icon-pill" style="--rail-color: #f59e0b; width: 32px; height: 32px; flex-shrink: 0;">
              <i data-lucide="${iconName}" style="width: 17px; height: 17px;"></i>
            </span>
            <span>${titleText}</span>
          </h1>
          <p class="popular-list-sub" id="popular-count-label">Tüm zamanların popülerliğine göre akıcı olarak listeleniyor</p>
        </div>

        <div class="media-grid" id="popular-media-grid">
          <div class="popular-loading-placeholder" style="grid-column: 1/-1; padding: 3rem 2rem; text-align: center; color: var(--text-muted);">
            <div class="spin-loader" style="width: 36px; height: 36px; border: 3px solid rgba(245,158,11,0.2); border-top-color: #f59e0b; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1.25rem;"></div>
            <p style="font-size: 1.05rem;">Popüler içerikler hazırlanıyor...</p>
          </div>
        </div>

        <div id="popular-sentinel" style="min-height: 90px; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 2rem 0 5rem; color: var(--text-muted);"></div>
      </div>
    </div>
  `;

  return {
    html,
    init: (container) => {
      if (!container) return;

      const grid = container.querySelector('#popular-media-grid');
      const sentinel = container.querySelector('#popular-sentinel');
      if (!grid) return;

      attachMediaCardEvents(grid);
      let isFetching = false;
      const fetcher = getFetcher(type);

      const updateSentinel = () => {
        if (!sentinel) return;
        if (cache.isExhausted) {
          sentinel.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">Tüm popüler içerikler listelendi.</p>`;
        } else {
          sentinel.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.6rem; color: var(--text-muted); font-size: 0.9rem;">
              <div class="spin-loader" style="width: 20px; height: 20px; border: 2px solid rgba(245,158,11,0.25); border-top-color: #f59e0b; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
              <span>Daha fazla içerik akıyor...</span>
            </div>
          `;
        }
      };

      // Append items to grid immediately as they arrive
      const appendItems = (items) => {
        if (!items || items.length === 0) return;

        const unique = [];
        for (const item of items) {
          if (item && item.id && !cache.seenIds.has(item.id)) {
            cache.seenIds.add(item.id);
            unique.push(item);
          }
        }
        if (unique.length === 0) return;

        cache.allItems.push(...unique);

        const newHTML = unique.map(item => renderMediaCard(item)).join('');
        const placeholder = grid.querySelector('.popular-loading-placeholder');
        if (placeholder) {
          grid.innerHTML = newHTML;
        } else {
          grid.insertAdjacentHTML('beforeend', newHTML);
        }
        attachMediaCardEvents(grid);
        if (window.lucide) window.lucide.createIcons();
      };

      // Progressive parallel fetch: fires all 3 pages simultaneously,
      // renders each page's results AS SOON as they arrive (no waiting for all 3)
      const fetchBatch = async (pageCount = 3) => {
        if (isFetching || cache.isExhausted) return;
        isFetching = true;
        updateSentinel();

        try {
          const startPage = cache.nextPage;
          const pages = Array.from({ length: pageCount }, (_, i) => startPage + i);
          cache.nextPage += pageCount;

          let totalNew = 0;

          // Fire all page fetches simultaneously, render each as it resolves
          const promises = pages.map(p =>
            fetcher(p)
              .then(items => {
                if (items && items.length > 0) {
                  totalNew += items.length;
                  appendItems(items);
                }
                return items;
              })
              .catch(() => [])
          );

          const results = await Promise.all(promises);
          const allItems = results.flat().filter(Boolean);

          // Only mark exhausted if TMDB returned zero results across ALL pages
          if (allItems.length === 0) {
            cache.isExhausted = true;
          }

          updateSentinel();

          // If screen still has room, auto-fetch more
          requestAnimationFrame(() => {
            if (!cache.isExhausted && document.documentElement.scrollHeight <= window.innerHeight + 600) {
              isFetching = false;
              fetchBatch(2);
              return;
            }
          });
        } catch (err) {
          console.error('Error fetching popular batch:', err);
        } finally {
          isFetching = false;
          updateSentinel();
        }
      };

      // Initial load: fetch 3 pages in parallel (60 items)
      fetchBatch(3);

      // IntersectionObserver for infinite scroll
      if (sentinel && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && !isFetching && !cache.isExhausted) {
            fetchBatch(2);
          }
        }, { rootMargin: '0px 0px 1500px 0px' });
        observer.observe(sentinel);
      }

      // Scroll-based pre-fetch fallback
      const handleScroll = () => {
        if (isFetching || cache.isExhausted) return;
        const scrollY = window.scrollY || 0;
        const windowH = window.innerHeight;
        const docH = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        if (scrollY + windowH >= docH - 1200) {
          fetchBatch(2);
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
    }
  };
}
