/* ==========================================================================
   CinePulse Studio - Perfectly Aligned Responsive Glassmorphism Navbar Component
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

        <ul class="nav-links desktop-nav-links">
          <li><a href="#home" class="nav-link ${currentView === 'home' ? 'active' : ''}"><i data-lucide="home"></i><span>Ana Sayfa</span></a></li>
          <li><a href="#series" class="nav-link ${currentView === 'series' ? 'active' : ''}"><i data-lucide="tv"></i><span>Diziler</span></a></li>
          <li><a href="#movies" class="nav-link ${currentView === 'movies' ? 'active' : ''}"><i data-lucide="film"></i><span>Filmler</span></a></li>
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

          <!-- Mobile Hamburger Toggle -->
          <button id="btn-mobile-menu-toggle" class="btn-action-icon mobile-only" aria-label="Menüyü Aç">
            <i data-lucide="menu" id="icon-mobile-menu"></i>
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

      <!-- Mobile Navigation Drawer -->
      <div id="mobile-menu-drawer" class="mobile-menu-drawer glass-panel hidden">
        <div class="mobile-menu-header">
          <span class="mobile-menu-title">CinePulse Menü</span>
          <button id="btn-mobile-menu-close" class="btn-icon">
            <i data-lucide="x"></i>
          </button>
        </div>
        <ul class="mobile-nav-links">
          <li><a href="#home" class="mobile-nav-link ${currentView === 'home' ? 'active' : ''}"><i data-lucide="home"></i><span>Ana Sayfa</span></a></li>
          <li><a href="#series" class="mobile-nav-link ${currentView === 'series' ? 'active' : ''}"><i data-lucide="tv"></i><span>Diziler</span></a></li>
          <li><a href="#movies" class="mobile-nav-link ${currentView === 'movies' ? 'active' : ''}"><i data-lucide="film"></i><span>Filmler</span></a></li>
          <li><a href="#discover" class="mobile-nav-link ${currentView === 'discover' ? 'active' : ''}"><i data-lucide="compass"></i><span>Keşfet</span></a></li>
          <li><a href="#library" class="mobile-nav-link ${currentView === 'library' ? 'active' : ''}"><i data-lucide="bookmark"></i><span>Listem & Geçmiş</span></a></li>
        </ul>
      </div>
    </nav>
  `;

  return navbarHTML;
}

export function attachNavbarEvents(onNavigate) {
  const navbar = document.getElementById('main-navbar');
  const mobileDrawer = document.getElementById('mobile-menu-drawer');
  const mobileToggleBtn = document.getElementById('btn-mobile-menu-toggle');
  const mobileCloseBtn = document.getElementById('btn-mobile-menu-close');
  const mobileSearchRow = document.getElementById('mobile-search-row');
  const mobileSearchToggleBtn = document.getElementById('btn-mobile-search-toggle');
  const mobileSearchCloseBtn = document.getElementById('btn-mobile-search-close');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Mobile Menu Drawer Toggle
  if (mobileToggleBtn && mobileDrawer) {
    mobileToggleBtn.addEventListener('click', () => {
      mobileSearchRow?.classList.add('hidden');
      mobileDrawer.classList.toggle('hidden');
      if (window.lucide) window.lucide.createIcons();
    });
  }

  if (mobileCloseBtn && mobileDrawer) {
    mobileCloseBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('hidden');
    });
  }

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

  // Close drawer on link click
  mobileDrawer?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.add('hidden');
    });
  });

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
