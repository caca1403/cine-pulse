/* ==========================================================================
   CinePulse Studio - Ultra-Smooth Infinite Scrolling View
   High-performance 80-item background pre-fetching engine for Series, Movies and Anime.
   With in-memory state preservation and zero-latency infinite scrolling.
   ========================================================================== */

import { fetchPopularSeries, fetchPopularMovies, fetchPopularAnime, fetchPopularDocumentaries } from '../services/tmdbApi.js';
import { renderMediaCard, attachMediaCardEvents } from '../components/MediaCard.js';

// Global cache per category with pre-buffered items
const popularListCache = {
  tv: { allItems: [], nextPage: 1, isExhausted: false },
  movie: { allItems: [], nextPage: 1, isExhausted: false },
  anime: { allItems: [], nextPage: 1, isExhausted: false },
  documentary: { allItems: [], nextPage: 1, isExhausted: false }
};

export async function renderPopularListView(type = 'tv') {
  if (!popularListCache[type]) {
    popularListCache[type] = { allItems: [], nextPage: 1, isExhausted: false };
  }

  const cache = popularListCache[type];
  let isFetching = false;

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

  const hasCachedItems = cache.allItems.length > 0;
  const initialCardsHTML = hasCachedItems
    ? cache.allItems.map(item => renderMediaCard(item)).join('')
    : '<div class="popular-loading-placeholder" style="grid-column: 1/-1; padding: 5rem 2rem; text-align: center; color: var(--text-muted);"><div class="spin-loader" style="width: 36px; height: 36px; border: 3px solid rgba(245,158,11,0.2); border-top-color: #f59e0b; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1.25rem;"></div><p style="font-size: 1.05rem;">Popüler içerikler hazırlanıyor...</p></div>';

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
          <p class="popular-list-sub" id="popular-count-label">Tüm zamanların popülerliğine göre akıcı olarak listeleniyor</p>
        </div>

        <!-- Media Grid -->
        <div class="media-grid" id="popular-media-grid">
          ${initialCardsHTML}
        </div>

        <!-- Smooth Scroll Sentinel / Prefetch Trigger -->
        <div id="popular-sentinel" style="min-height: 90px; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 2rem 0 5rem; color: var(--text-muted);">
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

      attachMediaCardEvents(grid);

      const updateSentinelUI = () => {
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

      // Fast 2-page batch fetcher (40 items per burst)
      const fetchNextBatch = async () => {
        if (isFetching || cache.isExhausted) return;
        isFetching = true;
        updateSentinelUI();

        try {
          const startP = cache.nextPage;
          let fetcher = fetchPopularSeries;
          if (type === 'movie') fetcher = fetchPopularMovies;
          else if (type === 'anime') fetcher = fetchPopularAnime;
          else if (type === 'documentary') fetcher = fetchPopularDocumentaries;

          // Fetch 2 pages in parallel (40 items)
          const pagesToFetch = [startP, startP + 1];
          const results = await Promise.all(pagesToFetch.map(p => fetcher(p).catch(() => [])));

          const newItems = results.flat().filter(Boolean);

          if (newItems.length === 0) {
            if (cache.nextPage >= 500) {
              cache.isExhausted = true;
            } else {
              cache.nextPage += 2;
            }
            updateSentinelUI();
            return;
          }

          // Deduplicate by ID
          const seenIds = new Set(cache.allItems.map(i => i.id));
          const uniqueItems = [];
          for (const item of newItems) {
            if (item && item.id && !seenIds.has(item.id)) {
              seenIds.add(item.id);
              uniqueItems.push(item);
            }
          }

          cache.allItems = [...cache.allItems, ...uniqueItems];
          cache.nextPage += 2;

          const newCardsHTML = uniqueItems.map(item => renderMediaCard(item)).join('');
          const placeholder = grid.querySelector('.popular-loading-placeholder');

          if (placeholder) {
            grid.innerHTML = newCardsHTML;
          } else {
            grid.insertAdjacentHTML('beforeend', newCardsHTML);
          }

          if (window.lucide) window.lucide.createIcons();

          // Auto trigger next pre-fetch if screen still has room
          setTimeout(() => {
            if (document.documentElement.scrollHeight <= window.innerHeight + 800 && !cache.isExhausted && !isFetching) {
              fetchNextBatch();
            }
          }, 50);
        } catch (err) {
          console.error('Error fetching popular batch:', err);
        } finally {
          isFetching = false;
          updateSentinelUI();
        }
      };

      // Perform initial batch load if cache is empty
      if (!hasCachedItems) {
        fetchNextBatch();
      } else {
        updateSentinelUI();
      }

      // 1. High-range IntersectionObserver (triggers 1500px in advance for zero-wait scrolling)
      let observer = null;
      if (sentinel && 'IntersectionObserver' in window) {
        observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            fetchNextBatch();
          }
        }, { rootMargin: '0px 0px 1500px 0px' });

        observer.observe(sentinel);
      }

      // 2. High-performance Window Scroll Listener (pre-fetches 1200px before bottom)
      const handleWindowScroll = () => {
        if (isFetching || cache.isExhausted) return;
        const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const windowHeight = window.innerHeight;
        const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

        if (scrollY + windowHeight >= docHeight - 1200) {
          fetchNextBatch();
        }
      };

      window.addEventListener('scroll', handleWindowScroll, { passive: true });
      window.addEventListener('touchmove', handleWindowScroll, { passive: true });
    }
  };
}
