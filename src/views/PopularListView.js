/* ==========================================================================
   CinePulse Studio - Pure Popular Series / Movies Grid View
   Pure popularity-ordered infinite scrolling view for Series and Movies.
   ========================================================================== */

import { fetchPopularSeries, fetchPopularMovies } from '../services/tmdbApi.js';
import { renderMediaCard, attachMediaCardEvents } from '../components/MediaCard.js';

export async function renderPopularListView(type = 'tv') {
  let currentPage = 1;
  let allItems = [];
  let isLoading = false;
  let isExhausted = false;

  const titleText = type === 'tv' ? 'Tüm Zamanların En Popüler Dizileri' : 'Tüm Zamanların En Popüler Filmleri';
  const iconName = type === 'tv' ? 'tv-2' : 'clapperboard';

  const html = `
    <div class="popular-list-view" style="padding-top: 6.5rem; padding-bottom: 4rem;">
      <div class="container">
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1.2rem;">
          <h1 style="font-size: 2.2rem; display: flex; align-items: center; gap: 0.75rem; color: #fff;">
            <i data-lucide="${iconName}" style="color: var(--primary)"></i> ${titleText}
          </h1>
          <span style="color: var(--text-muted); font-size: 0.9rem;" id="popular-count-label">Tüm zamanların oy sayısına ve genel popülerliğine göre listeleniyor</span>
        </div>

        <!-- Media Grid -->
        <div class="media-grid" id="popular-media-grid">
          <div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">İçerikler yükleniyor...</div>
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

      const loadMore = async () => {
        if (isLoading || isExhausted) return;
        isLoading = true;

        if (spinner) spinner.style.display = 'block';

        try {
          const newItems = type === 'tv' ? await fetchPopularSeries(currentPage) : await fetchPopularMovies(currentPage);
          if (spinner) spinner.style.display = 'none';

          if (!newItems || newItems.length === 0) {
            isExhausted = true;
            return;
          }

          allItems = [...allItems, ...newItems];
          grid.innerHTML = allItems.map(item => renderMediaCard(item)).join('');
          if (window.lucide) window.lucide.createIcons();
          attachMediaCardEvents(container);

          currentPage += 1;
        } catch (err) {
          console.error('Error loading popular media:', err);
          if (spinner) spinner.style.display = 'none';
        } finally {
          isLoading = false;
        }
      };

      // Initial load (Page 1)
      loadMore();

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
