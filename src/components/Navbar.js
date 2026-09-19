import { renderIcons } from '../services/icons.js';
/* ==========================================================================
   CinePulse Studio - Apple TV+ & Netflix Luxury Navbar & Floating Dock
   ========================================================================== */

import { searchMulti, getImageUrl, TMDB_IMAGE_SIZES } from '../services/tmdbApi.js';
import { openProfileModal, triggerProfileSwitchTransition } from './ProfileModal.js';
import { getActiveProfile, setActiveProfile, getProfiles } from '../services/storage.js';
import { openNotificationCenterModal, getUnreadNotificationCount, updateNotificationBellBadge } from './NotificationCenterModal.js';

export function renderNavbar(currentView = 'home') {
  const activeProfile = getActiveProfile();
  const unreadCount = getUnreadNotificationCount();

  const navbarHTML = `
    <nav class="navbar" id="main-navbar">
      <div class="nav-container">
        <a href="#home" class="nav-brand" id="nav-brand-logo" title="CinePulse Studio">
          <div class="brand-logo-icon">
            <i data-lucide="clapperboard" style="width:18px; height:18px; color:#fff;"></i>
          </div>
          <span class="brand-name">Cine<span class="brand-highlight">Pulse</span></span>
        </a>

        <!-- Desktop Apple Segmented Navigation Track -->
        <ul class="nav-links desktop-nav-links">
          ${activeProfile.isKid ? `
            <li><a href="#home" class="nav-link ${currentView === 'home' ? 'active' : ''}"><i data-lucide="home"></i><span>Ana Sayfa</span></a></li>
            <li><a href="#series" title="Çizgi Diziler" class="nav-link ${currentView === 'series' ? 'active' : ''}"><i data-lucide="palette"></i><span>Çizgi Diziler</span></a></li>
            <li><a href="#movies" title="Animasyon Filmleri" class="nav-link ${currentView === 'movies' ? 'active' : ''}"><i data-lucide="clapperboard"></i><span>Animasyonlar</span></a></li>
            <li><a href="#anime" title="Anime" class="nav-link ${currentView === 'anime' ? 'active' : ''}"><i data-lucide="sparkles"></i><span>Anime</span></a></li>
            <li><a href="#library" title="Listem" class="nav-link ${currentView === 'library' ? 'active' : ''}"><i data-lucide="bookmark"></i><span>Listem</span></a></li>
          ` : `
            <li><a href="#home" class="nav-link ${currentView === 'home' ? 'active' : ''}"><i data-lucide="home"></i><span>Ana Sayfa</span></a></li>
            <li><a href="#series" title="Diziler" class="nav-link ${currentView === 'series' ? 'active' : ''}"><i data-lucide="tv"></i><span>Diziler</span></a></li>
            <li><a href="#cartoons" title="Çizgi Diziler" class="nav-link ${currentView === 'cartoons' ? 'active' : ''}"><i data-lucide="palette"></i><span>Çizgi Diziler</span></a></li>
            <li><a href="#movies" title="Filmler" class="nav-link ${currentView === 'movies' ? 'active' : ''}"><i data-lucide="clapperboard"></i><span>Filmler</span></a></li>
            <li><a href="#anime" title="Anime" class="nav-link ${currentView === 'anime' ? 'active' : ''}"><i data-lucide="sparkles"></i><span>Anime</span></a></li>
            <li><a href="#documentary" title="Belgesel" class="nav-link ${currentView === 'documentary' ? 'active' : ''}"><i data-lucide="book-open"></i><span>Belgesel</span></a></li>
            <li><a href="#discover" title="Keşfet" class="nav-link ${currentView === 'discover' ? 'active' : ''}"><i data-lucide="compass"></i><span>Keşfet</span></a></li>
            <li><a href="#library" title="Listem" class="nav-link ${currentView === 'library' ? 'active' : ''}"><i data-lucide="bookmark"></i><span>Listem</span></a></li>
          `}
        </ul>

        <div class="nav-actions">
          <!-- Live TV Quick Action Pill (hidden in kids mode) -->
          ${!activeProfile.isKid ? `
          <a href="#livetv" class="btn-live-shortcut ${currentView === 'livetv' ? 'active' : ''}" title="Canlı TV Yayınları">
            <span class="live-pulse-dot"></span>
            <span>CANLI</span>
          </a>
          <button data-open-decision-room class="btn-decision-room-shortcut" title="Arkadaşlarınla anonim ortak seçim yap">
            <i data-lucide="users-round"></i><span>Birlikte Seç</span>
          </button>
          ` : ''}

          <!-- Desktop Search Box -->
          <div class="search-box desktop-search-box">
            <i data-lucide="search" class="search-icon"></i>
            <input type="text" id="nav-search-input" class="search-input" placeholder="Ara..." autocomplete="off" />
            <span class="search-kbd">⌘K</span>
            <div id="search-overlay" class="search-results-overlay glass-panel hidden"></div>
          </div>

          <!-- Notification Bell Button -->
          <button id="btn-nav-notifications" class="btn-action-icon btn-nav-bell" title="Bildirimler &amp; Alarmlar"><i data-lucide="bell" style="width: 16px; height: 16px;"></i><span id="nav-notif-badge" class="nav-notif-dot ${unreadCount > 0 ? '' : 'hidden'}">${unreadCount}</span></button>

          <!-- Profile Switcher Button (Compact Circular Avatar) -->
          <button id="btn-nav-profile" class="btn-nav-avatar" title="Profil: ${activeProfile.name} (Değiştir / Ayarlar)">
            <div class="nav-avatar-circle" style="border-color: ${activeProfile.color || '#f59e0b'}; background: ${activeProfile.color || '#f59e0b'}22;">
              <i data-lucide="${activeProfile.avatar || (activeProfile.isKid ? 'smile' : 'user')}" style="width: 16px; height: 16px; color: ${activeProfile.color || '#f59e0b'};"></i>
            </div>
          </button>

          <!-- Mobile Search Button -->
          <button id="btn-mobile-search-toggle" class="btn-action-icon mobile-only" aria-label="Arama Yap">
            <i data-lucide="search"></i>
          </button>
          ${!activeProfile.isKid ? `
          <button data-open-decision-room class="btn-action-icon mobile-only btn-decision-room-mobile" aria-label="Birlikte Seç" title="Birlikte Seç">
            <i data-lucide="users-round"></i>
          </button>` : ''}
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
        <i data-lucide="${activeProfile.isKid ? 'palette' : 'tv'}"></i>
        <span>${activeProfile.isKid ? 'Çizgi Diziler' : 'Diziler'}</span>
      </a>
      <a href="#movies" class="dock-item ${currentView === 'movies' ? 'active' : ''}">
        <i data-lucide="clapperboard"></i>
        <span>${activeProfile.isKid ? 'Animasyonlar' : 'Filmler'}</span>
      </a>
      ${!activeProfile.isKid ? `
      <a href="#cartoons" class="dock-item ${currentView === 'cartoons' ? 'active' : ''}">
        <i data-lucide="palette"></i>
        <span>Çizgi Diziler</span>
      </a>
      <a href="#anime" class="dock-item ${currentView === 'anime' ? 'active' : ''}">
        <i data-lucide="sparkles"></i>
        <span>Anime</span>
      </a>
      <a href="#documentary" class="dock-item ${currentView === 'documentary' ? 'active' : ''}">
        <i data-lucide="book-open"></i>
        <span>Belgesel</span>
      </a>
      <a href="#discover" class="dock-item ${currentView === 'discover' ? 'active' : ''}">
        <i data-lucide="compass"></i>
        <span>Keşfet</span>
      </a>
      ` : ''}
      <a href="#library" class="dock-item ${currentView === 'library' ? 'active' : ''}">
        <i data-lucide="bookmark"></i>
        <span>Listem</span>
      </a>
    </div>
  `;

  return navbarHTML;
}

let attachedScrollHandler = null;
let attachedSearchShortcut = null;
let attachedOutsideSearchClick = false;

export function attachNavbarEvents(onNavigate) {
  const navbar = document.getElementById('main-navbar');
  const mobileSearchRow = document.getElementById('mobile-search-row');
  const mobileSearchToggleBtn = document.getElementById('btn-mobile-search-toggle');
  const mobileSearchCloseBtn = document.getElementById('btn-mobile-search-close');

  if (attachedScrollHandler) window.removeEventListener('scroll', attachedScrollHandler);
  attachedScrollHandler = () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };
  attachedScrollHandler();
  window.addEventListener('scroll', attachedScrollHandler, { passive: true });

  // Mobile Search Toggle
  if (mobileSearchToggleBtn && mobileSearchRow) {
    mobileSearchToggleBtn.addEventListener('click', () => {
      mobileSearchRow.classList.toggle('hidden');
      if (!mobileSearchRow.classList.contains('hidden')) {
        document.getElementById('mobile-search-input')?.focus();
      }
      renderIcons();
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

  const notifBtn = document.getElementById('btn-nav-notifications');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      openNotificationCenterModal();
    });
  }

  const profileBtn = document.getElementById('btn-nav-profile');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      openProfileModal();
    });
  }

  document.querySelectorAll('[data-open-decision-room]').forEach((decisionRoomBtn) => {
    decisionRoomBtn.addEventListener('click', async () => {
      const room = await import('./DecisionRoomModal.js');
      room.openDecisionRoomModal();
    });
  });

  // Kids Mode Quick Exit Pill
  const exitKidsBtn = document.getElementById('btn-exit-kids-mode');
  if (exitKidsBtn) {
    exitKidsBtn.addEventListener('click', () => {
      // Find first non-kid profile or fallback to prof_1
      const profiles = getProfiles();
      const adult = profiles.find(p => !p.isKid) || profiles[0];
      setActiveProfile(adult.id);
      triggerProfileSwitchTransition(adult);
    });
  }

  // Attach search handlers for both Desktop and Mobile search inputs
  setupSearchInput('nav-search-input', 'search-overlay');
  setupSearchInput('mobile-search-input', 'mobile-search-overlay');
  if (!attachedOutsideSearchClick) {
    attachedOutsideSearchClick = true;
    document.addEventListener('click', (event) => {
      for (const [inputId, overlayId] of [
        ['nav-search-input', 'search-overlay'],
        ['mobile-search-input', 'mobile-search-overlay']
      ]) {
        const input = document.getElementById(inputId);
        const overlay = document.getElementById(overlayId);
        if (overlay && !input?.contains(event.target) && !overlay.contains(event.target)) {
          overlay.classList.add('hidden');
        }
      }
    });
  }

  // Keyboard shortcut Ctrl+K / Cmd+K to focus search input
  if (attachedSearchShortcut) document.removeEventListener('keydown', attachedSearchShortcut);
  attachedSearchShortcut = (e) => {
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
  };
  document.addEventListener('keydown', attachedSearchShortcut);
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

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        overlay.classList.add('hidden');
        input.blur();
      }
    });
  }
}
