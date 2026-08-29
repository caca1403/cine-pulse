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
      mobileDrawer?.classList.add('hidden');
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

      searchTimeout = setTimeout(async () => {
        const results = await searchMulti(query);
        if (results.length === 0) {
          overlay.innerHTML = `<div style="padding: 1.2rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">Aramanızla eşleşen içerik bulunamadı.</div>`;
        } else {
          overlay.innerHTML = results.slice(0, 7).map(item => {
            const title = item.title || item.name || 'İsimsiz';
            const year = (item.release_date || item.first_air_date || '').substring(0, 4);
            const poster = getImageUrl(item.poster_path, TMDB_IMAGE_SIZES.POSTER_SMALL);
            const typeText = item.media_type === 'tv' ? 'Dizi' : 'Film';
            const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';

            return `
              <div class="search-item" data-id="${item.id}" data-type="${item.media_type}">
                <img src="${poster}" alt="${title}" loading="lazy" />
                <div class="search-item-info">
                  <span class="search-item-title">${title}</span>
                  <span class="search-item-meta">
                    <span class="type-pill">${typeText}</span>
                    <span>${year}</span>
                    <span class="rating-pill">★ ${rating}</span>
                  </span>
                </div>
              </div>
            `;
          }).join('');
        }
        overlay.classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();

        overlay.querySelectorAll('.search-item').forEach(el => {
          el.addEventListener('click', () => {
            const id = el.getAttribute('data-id');
            const type = el.getAttribute('data-type');
            overlay.classList.add('hidden');
            input.value = '';
            const mobileSearchRow = document.getElementById('mobile-search-row');
            if (mobileSearchRow) mobileSearchRow.classList.add('hidden');
            window.location.hash = `#detail?type=${type}&id=${id}`;
          });
        });
      }, 250);
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-box') && !e.target.closest('.mobile-search-row')) {
        overlay.classList.add('hidden');
      }
    });
  }
}
