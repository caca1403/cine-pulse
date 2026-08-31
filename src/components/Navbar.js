/* ==========================================================================
   CinePulse Studio - Apple TV+ & Netflix Luxury Navbar & Floating Dock
   ========================================================================== */

import { searchMulti, getImageUrl, TMDB_IMAGE_SIZES } from '../services/tmdbApi.js';
import { openDataManagerModal } from './DataManagerModal.js';

export function renderNavbar(currentView = 'home') {
  const navbarHTML = `
    <nav class="navbar" id="main-navbar">
      <div class="nav-container">
        <a href="#home" class="nav-brand">
          <div class="brand-logo-icon">
            <i data-lucide="clapperboard" style="width:18px; height:18px; color:#fff;"></i>
          </div>
          <span class="brand-name">Cine<span class="brand-highlight">Pulse</span></span>
        </a>

        <!-- Desktop Apple Segmented Navigation Track -->
        <ul class="nav-links desktop-nav-links">
          <li><a href="#home" class="nav-link ${currentView === 'home' ? 'active' : ''}"><i data-lucide="home"></i><span>Ana Sayfa</span></a></li>
          <li><a href="#series" class="nav-link ${currentView === 'series' ? 'active' : ''}"><i data-lucide="tv"></i><span>Diziler</span></a></li>
          <li><a href="#movies" class="nav-link ${currentView === 'movies' ? 'active' : ''}"><i data-lucide="film"></i><span>Filmler</span></a></li>
          <li><a href="#anime" class="nav-link ${currentView === 'anime' ? 'active' : ''}"><i data-lucide="sparkles"></i><span>Anime</span></a></li>
          <li><a href="#documentary" class="nav-link ${currentView === 'documentary' ? 'active' : ''}"><i data-lucide="globe"></i><span>Belgesel</span></a></li>
          <li><a href="#livetv" class="nav-link ${currentView === 'livetv' ? 'active' : ''}"><i data-lucide="radio"></i><span>Canlı TV</span></a></li>
          <li><a href="#discover" class="nav-link ${currentView === 'discover' ? 'active' : ''}"><i data-lucide="compass"></i><span>Keşfet</span></a></li>
          <li><a href="#library" class="nav-link ${currentView === 'library' ? 'active' : ''}"><i data-lucide="bookmark"></i><span>Listem</span></a></li>
        </ul>

        <div class="nav-actions">
          <!-- Mobile Live TV Quick Action Pill -->
          <a href="#livetv" class="btn-live-shortcut mobile-only ${currentView === 'livetv' ? 'active' : ''}" title="Canlı TV Yayınları">
            <span class="live-pulse-dot"></span>
            <span>CANLI</span>
          </a>

          <!-- Desktop Search Box -->
          <div class="search-box desktop-search-box">
            <i data-lucide="search" class="search-icon"></i>
            <input type="text" id="nav-search-input" class="search-input" placeholder="Dizi veya film ara..." autocomplete="off" />
            <span class="search-kbd">⌘K</span>
            <div id="search-overlay" class="search-results-overlay glass-panel hidden"></div>
          </div>

          <!-- Mobile Search Button -->
          <button id="btn-mobile-search-toggle" class="btn-action-icon mobile-only" aria-label="Arama Yap">
            <i data-lucide="search"></i>
          </button>

          <!-- Backup / Data Button -->
          <button id="btn-open-backup" class="btn-action-icon" title="Yedekleme & Veri Yönetimi">
            <i data-lucide="hard-drive-download"></i>
          </button>
        </div>
      </div>

      <!-- Full-Width Mobile Expandable Search Row -->
      <div id="mobile-search-row" class="mobile-search-row glass-panel hidden">
        <div class="mobile-search-input-wrapper">
          <i data-lucide="search" class="search-icon"></i>
          <input type="text" id="mobile-search-input" class="mobile-search-input" placeholder="Dizi veya film ara..." autocomplete="off" />
          <button id="btn-mobile-search-close" class="btn-icon">
            <i data-lucide="x"></i>
          </button>
        </div>
        <div id="mobile-search-overlay" class="search-results-overlay glass-panel hidden"></div>
      </div>
    </nav>

    <!-- Apple Cupertino Floating Glass Dock (Mobile Native Experience) -->
    <div class="apple-bottom-dock" id="mobile-bottom-dock">
      <a href="#home" class="dock-item ${currentView === 'home' ? 'active' : ''}">
        <i data-lucide="home"></i>
        <span>Ana Sayfa</span>
      </a>
      <a href="#series" class="dock-item ${currentView === 'series' ? 'active' : ''}">
        <i data-lucide="tv"></i>
        <span>Diziler</span>
      </a>
      <a href="#movies" class="dock-item ${currentView === 'movies' ? 'active' : ''}">
        <i data-lucide="film"></i>
        <span>Filmler</span>
      </a>
      <a href="#anime" class="dock-item ${currentView === 'anime' ? 'active' : ''}">
        <i data-lucide="sparkles"></i>
        <span>Anime</span>
      </a>
      <a href="#discover" class="dock-item ${currentView === 'discover' ? 'active' : ''}">
        <i data-lucide="compass"></i>
        <span>Keşfet</span>
      </a>
      <a href="#library" class="dock-item ${currentView === 'library' ? 'active' : ''}">
        <i data-lucide="bookmark"></i>
        <span>Listem</span>
      </a>
    </div>
  `;

  return navbarHTML;
}

export function attachNavbarEvents(onNavigate) {
  const navbar = document.getElementById('main-navbar');
  const mobileSearchRow = document.getElementById('mobile-search-row');
  const mobileSearchToggleBtn = document.getElementById('btn-mobile-search-toggle');
  const mobileSearchCloseBtn = document.getElementById('btn-mobile-search-close');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile Search Toggle
  if (mobileSearchToggleBtn && mobileSearchRow) {
    mobileSearchToggleBtn.addEventListener('click', () => {
      mobileSearchRow.classList.toggle('hidden');
      if (!mobileSearchRow.classList.contains('hidden')) {
        document.getElementById('mobile-search-input')?.focus();
      }
      if (window.lucide) window.lucide.createIcons();
    });
  }

  if (mobileSearchCloseBtn && mobileSearchRow) {
    mobileSearchCloseBtn.addEventListener('click', () => {
      mobileSearchRow.classList.add('hidden');
    });
  }

  const backupBtn = document.getElementById('btn-open-backup');
  if (backupBtn) {
    backupBtn.addEventListener('click', () => {
      openDataManagerModal();
    });
  }

  // Attach search handlers for both Desktop and Mobile search inputs
  setupSearchInput('nav-search-input', 'search-overlay');
  setupSearchInput('mobile-search-input', 'mobile-search-overlay');

  // Keyboard shortcut Ctrl+K / Cmd+K to focus search input
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const isMobile = window.innerWidth <= 992;
      if (isMobile && mobileSearchRow) {
        mobileSearchRow.classList.remove('hidden');
        document.getElementById('mobile-search-input')?.focus();
      } else {
        document.getElementById('nav-search-input')?.focus();
      }
    }
  });
}

function setupSearchInput(inputId, overlayId) {
  const input = document.getElementById(inputId);
  const overlay = document.getElementById(overlayId);
  let searchTimeout = null;

  if (input && overlay) {
    input.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      clearTimeout(searchTimeout);

      if (query.length < 2) {
        overlay.classList.add('hidden');
        overlay.innerHTML = '';
        return;
      }

      // Show temporary searching indicator
      overlay.innerHTML = '<div class="search-no-results" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:1rem;color:var(--text-muted);font-size:0.85rem;"><span class="tv-loading-spinner" style="width:16px;height:16px;border-width:2px;"></span> Aranıyor...</div>';
      overlay.classList.remove('hidden');

      searchTimeout = setTimeout(async () => {
        try {
          const rawData = await searchMulti(query);
          const results = Array.isArray(rawData) ? rawData.slice(0, 8) : (rawData?.results ? rawData.results.slice(0, 8) : []);

          if (!results || results.length === 0) {
            overlay.innerHTML = '<div class="search-no-results">Sonuç bulunamadı</div>';
            overlay.classList.remove('hidden');
            return;
          }

          overlay.innerHTML = results.map(item => {
            const isTv = item.media_type === 'tv' || !!item.first_air_date || (!item.release_date && !!item.name);
            const title = item.title || item.name || 'İsimsiz İçerik';
            const year = (item.release_date || item.first_air_date || '').slice(0, 4);
            const poster = getImageUrl(item.poster_path, TMDB_IMAGE_SIZES.POSTER_SMALL || TMDB_IMAGE_SIZES.POSTER_MEDIUM);
            const typeLabel = isTv ? 'Dizi' : 'Film';
            const route = `#detail?type=${isTv ? 'tv' : 'movie'}&id=${item.id}`;

            return `
              <a href="${route}" class="search-item">
                <img src="${poster}" alt="${title}" class="search-item-img" onerror="this.src='https://via.placeholder.com/45x68/1e293b/64748b?text=N/A'" />
                <div class="search-item-info">
                  <div class="search-item-title">${title}</div>
                  <div class="search-item-meta">
                    <span class="search-badge">${typeLabel}</span>
                    ${year ? `<span>${year}</span>` : ''}
                    <span class="search-rating">★ ${(item.vote_average || 0).toFixed(1)}</span>
                  </div>
                </div>
              </a>
            `;
          }).join('');

          overlay.classList.remove('hidden');

          overlay.querySelectorAll('.search-item').forEach(link => {
            link.addEventListener('click', () => {
              overlay.classList.add('hidden');
              input.value = '';
              const mobileSearchRow = document.getElementById('mobile-search-row');
              if (mobileSearchRow) mobileSearchRow.classList.add('hidden');
            });
          });
        } catch (err) {
          console.error('[Search Overlay Error]', err);
          overlay.innerHTML = '<div class="search-no-results">Arama sırasında bir hata oluştu</div>';
        }
      }, 200);
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !overlay.contains(e.target)) {
        overlay.classList.add('hidden');
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        overlay.classList.add('hidden');
        input.blur();
      }
    });
  }
}
