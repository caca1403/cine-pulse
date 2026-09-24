import { renderIcons } from '../services/icons.js';
/* ==========================================================================
   CinePulse Studio - Next-Gen Luxury Navigation System
   Desktop: Apple TV+ Minimalist Segmented Track & Unified Action Bar
   Mobile: visionOS Dynamic Island Dock + Floating Hub Center Orb & Glass Sheet
   ========================================================================== */

import { searchMulti, getImageUrl, TMDB_IMAGE_SIZES } from '../services/tmdbApi.js';
import { openProfileModal, triggerProfileSwitchTransition } from './ProfileModal.js';
import { getActiveProfile, setActiveProfile, getProfiles } from '../services/storage.js';
import { openNotificationCenterModal, getUnreadNotificationCount, updateNotificationBellBadge } from './NotificationCenterModal.js';
import { openDecisionRoomModal } from './DecisionRoomModal.js';

export function renderNavbar(currentView = 'home') {
  const activeProfile = getActiveProfile();
  const unreadCount = getUnreadNotificationCount();
  const isCategoriesActive = ['anime', 'cartoons', 'documentary', 'discover'].includes(currentView);

  const navbarHTML = `
    <!-- Top Universal Header -->
    <nav class="navbar" id="main-navbar">
      <div class="nav-container">
        <!-- Left: Brand Logo & Desktop Segmented Links -->
        <div class="nav-left-group">
          <a href="#home" class="nav-brand" id="nav-brand-logo" title="CinePulse Studio">
            <div class="brand-logo-icon">
              <i data-lucide="clapperboard" style="width:18px; height:18px; color:#fff;"></i>
            </div>
            <span class="brand-name">Cine<span class="brand-highlight">Pulse</span></span>
          </a>

          <!-- Desktop Apple-Style Segmented Navigation (Clean & Uncluttered) -->
          <ul class="nav-links desktop-nav-links">
            ${activeProfile.isKid ? `
              <li><a href="#home" class="nav-link ${currentView === 'home' ? 'active' : ''}">Ana Sayfa</a></li>
              <li><a href="#movies" class="nav-link ${currentView === 'movies' ? 'active' : ''}">Animasyonlar</a></li>
              <li><a href="#series" class="nav-link ${currentView === 'series' ? 'active' : ''}">Çizgi Diziler</a></li>
              <li><a href="#anime" class="nav-link ${currentView === 'anime' ? 'active' : ''}">Anime</a></li>
              <li><a href="#library" class="nav-link ${currentView === 'library' ? 'active' : ''}">Listem</a></li>
            ` : `
              <li><a href="#home" class="nav-link ${currentView === 'home' ? 'active' : ''}">Ana Sayfa</a></li>
              <li><a href="#series" class="nav-link ${currentView === 'series' ? 'active' : ''}">Diziler</a></li>
              <li><a href="#movies" class="nav-link ${currentView === 'movies' ? 'active' : ''}">Filmler</a></li>
              <li>
                <a href="#dramas" class="nav-link nav-link-dramas ${currentView === 'dramas' ? 'active' : ''}" title="ReelShort &amp; DramaBox Mini Dizileri">
                  <span>Kısa Dizi</span>
                  <span class="nav-drama-tag">REEL</span>
                </a>
              </li>

              <!-- Clean Floating Categories Dropdown -->
              <li class="nav-dropdown-item" id="nav-categories-dropdown">
                <button type="button" class="nav-link nav-dropdown-trigger ${isCategoriesActive ? 'active' : ''}" aria-expanded="false">
                  <span>Kategoriler</span>
                  <i data-lucide="chevron-down" style="width: 13px; height: 13px; margin-left: 2px;"></i>
                </button>
                <div class="nav-dropdown-menu glass-panel" id="nav-dropdown-menu">
                  <a href="#anime" class="nav-dropdown-link ${currentView === 'anime' ? 'active' : ''}">
                    <div class="dropdown-icon-box" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">
                      <i data-lucide="sparkles" style="width: 15px; height: 15px;"></i>
                    </div>
                    <div class="dropdown-link-text">
                      <span class="dropdown-link-title">Anime</span>
                      <span class="dropdown-link-sub">Popüler seriler</span>
                    </div>
                  </a>
                  <a href="#cartoons" class="nav-dropdown-link ${currentView === 'cartoons' ? 'active' : ''}">
                    <div class="dropdown-icon-box" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">
                      <i data-lucide="palette" style="width: 15px; height: 15px;"></i>
                    </div>
                    <div class="dropdown-link-text">
                      <span class="dropdown-link-title">Çizgi Diziler</span>
                      <span class="dropdown-link-sub">Nostalji &amp; Eğlence</span>
                    </div>
                  </a>
                  <a href="#documentary" class="nav-dropdown-link ${currentView === 'documentary' ? 'active' : ''}">
                    <div class="dropdown-icon-box" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">
                      <i data-lucide="book-open" style="width: 15px; height: 15px;"></i>
                    </div>
                    <div class="dropdown-link-text">
                      <span class="dropdown-link-title">Belgesel</span>
                      <span class="dropdown-link-sub">Bilim, Doğa &amp; Tarih</span>
                    </div>
                  </a>
                  <a href="#discover" class="nav-dropdown-link ${currentView === 'discover' ? 'active' : ''}">
                    <div class="dropdown-icon-box" style="background: rgba(168, 85, 247, 0.15); color: #c084fc;">
                      <i data-lucide="compass" style="width: 15px; height: 15px;"></i>
                    </div>
                    <div class="dropdown-link-text">
                      <span class="dropdown-link-title">Gelişmiş Keşfet</span>
                      <span class="dropdown-link-sub">Yıl &amp; Tür Filtreleri</span>
                    </div>
                  </a>
                </div>
              </li>

              <li><a href="#library" class="nav-link ${currentView === 'library' ? 'active' : ''}">Listem</a></li>
            `}
          </ul>
        </div>

        <!-- Right: Actions Cluster (Desktop & Mobile Adaptive) -->
        <div class="nav-actions">
          ${!activeProfile.isKid ? `
            <!-- Live TV Pill (Desktop Only) -->
            <a href="#livetv" class="btn-nav-live desktop-only ${currentView === 'livetv' ? 'active' : ''}" title="Canlı TV Yayınları">
              <span class="live-dot-pulse"></span>
              <span>CANLI</span>
            </a>

            <!-- Birlikte Seç Pill (Desktop Only) -->
            <button data-open-decision-room class="btn-nav-action-pill desktop-only" title="Arkadaşlarınla Anonim Ortak Seçim">
              <i data-lucide="users-round" style="width: 14px; height: 14px;"></i>
              <span>Birlikte</span>
            </button>
          ` : ''}

          <!-- Desktop Search Box (Smooth Expandable) -->
          <div class="search-box desktop-search-box desktop-only">
            <i data-lucide="search" class="search-icon"></i>
            <input type="text" id="nav-search-input" class="search-input" placeholder="Ara..." autocomplete="off" />
            <span class="search-kbd">⌘K</span>
            <div id="search-overlay" class="search-results-overlay glass-panel hidden"></div>
          </div>

          <!-- Notification Bell Button -->
          <button id="btn-nav-notifications" class="btn-action-icon btn-nav-bell" title="Bildirimler">
            <i data-lucide="bell" style="width: 16px; height: 16px;"></i>
            <span id="nav-notif-badge" class="nav-notif-dot ${unreadCount > 0 ? '' : 'hidden'}">${unreadCount}</span>
          </button>

          <!-- Profile Switcher Button (Compact Circular Avatar) -->
          <button id="btn-nav-profile" class="btn-nav-avatar" title="Profil: ${activeProfile.name}">
            <div class="nav-avatar-circle" style="border-color: ${activeProfile.color || '#f59e0b'}; background: ${activeProfile.color || '#f59e0b'}22;">
              <i data-lucide="${activeProfile.avatar || (activeProfile.isKid ? 'smile' : 'user')}" style="width: 16px; height: 16px; color: ${activeProfile.color || '#f59e0b'};"></i>
            </div>
          </button>

          <!-- Mobile Only: Search Trigger Icon -->
          <button id="btn-mobile-search-toggle" class="btn-action-icon mobile-only" aria-label="Arama Yap">
            <i data-lucide="search" style="width: 18px; height: 18px;"></i>
          </button>
        </div>
      </div>

      <!-- Full-Width Mobile Expandable Search Row -->
      <div id="mobile-search-row" class="mobile-search-row glass-panel hidden">
        <div class="mobile-search-input-wrapper">
          <i data-lucide="search" class="search-icon"></i>
          <input type="text" id="mobile-search-input" class="mobile-search-input" placeholder="Dizi, film veya kısa dizi ara..." autocomplete="off" />
          <button id="btn-mobile-search-close" class="btn-icon">
            <i data-lucide="x"></i>
          </button>
        </div>
        <div id="mobile-search-overlay" class="search-results-overlay glass-panel hidden"></div>
      </div>
    </nav>

    <!-- ====================================================================
         Next-Gen Mobile "Dynamic Glass Capsule" Dock
         Ultra Clean 4-Item Layout with Floating Center Glow Hub Orb
         ==================================================================== -->
    <div class="mobile-dynamic-dock" id="mobile-bottom-dock">
      <a href="#home" class="dynamic-dock-item ${currentView === 'home' ? 'active' : ''}">
        <i data-lucide="home"></i>
        <span>Ana Sayfa</span>
      </a>

      <a href="#series" class="dynamic-dock-item ${currentView === 'series' || currentView === 'movies' ? 'active' : ''}">
        <i data-lucide="tv"></i>
        <span>Diziler</span>
      </a>

      <!-- Center Super FAB: Glowing Hub Orb -->
      <button class="dynamic-dock-hub-orb" id="btn-open-mobile-hub" aria-label="Keşif &amp; Kütüphane Hub'ı">
        <div class="hub-orb-inner">
          <i data-lucide="sparkles" style="width: 20px; height: 20px; color: #fff;"></i>
        </div>
        <span class="hub-orb-label">HUB</span>
      </button>

      <a href="#discover" class="dynamic-dock-item ${currentView === 'discover' ? 'active' : ''}">
        <i data-lucide="compass"></i>
        <span>Keşfet</span>
      </a>

      <a href="#library" class="dynamic-dock-item ${currentView === 'library' ? 'active' : ''}">
        <i data-lucide="bookmark"></i>
        <span>Listem</span>
      </a>
    </div>

    <!-- ====================================================================
         Mobile "Space Hub" Bottom Glass Sheet (visionOS Style Drawer)
         Instant tactile access to Short Dramas, Live TV, Anime, etc.
         ==================================================================== -->
    <div class="mobile-hub-backdrop hidden" id="mobile-hub-backdrop">
      <div class="mobile-hub-sheet" id="mobile-hub-sheet">
        <div class="hub-sheet-handle-wrap">
          <div class="hub-sheet-handle"></div>
        </div>

        <div class="hub-sheet-header">
          <div class="hub-sheet-title-row">
            <div class="hub-sheet-icon">
              <i data-lucide="sparkles" style="width: 18px; height: 18px; color: #c084fc;"></i>
            </div>
            <div>
              <h3 class="hub-sheet-title">CinePulse Evreni</h3>
              <p class="hub-sheet-sub">Özel kategoriler, canlı yayınlar ve mini diziler</p>
            </div>
          </div>
          <button class="hub-sheet-close-btn" id="btn-close-mobile-hub">
            <i data-lucide="x" style="width: 18px; height: 18px;"></i>
          </button>
        </div>

        <!-- Hub Action Grid Cards -->
        <div class="hub-sheet-grid">
          <!-- 1. Kısa Diziler & Reels VIP -->
          <a href="#dramas" class="hub-card hub-card-featured">
            <div class="hub-card-icon" style="background: linear-gradient(135deg, #7c3aed, #ec4899);">
              <i data-lucide="clapperboard" style="width: 20px; height: 20px; color: #fff;"></i>
            </div>
            <div class="hub-card-text">
              <div class="hub-card-title-row">
                <span class="hub-card-title">Kısa Diziler</span>
                <span class="hub-pill-vip">VIP</span>
              </div>
              <span class="hub-card-sub">DramaBox &amp; ReelShort</span>
            </div>
          </a>

          <!-- 2. Canlı TV -->
          <a href="#livetv" class="hub-card">
            <div class="hub-card-icon" style="background: linear-gradient(135deg, #ef4444, #f97316);">
              <i data-lucide="tv" style="width: 20px; height: 20px; color: #fff;"></i>
            </div>
            <div class="hub-card-text">
              <div class="hub-card-title-row">
                <span class="hub-card-title">Canlı TV</span>
                <span class="hub-pill-live">CANLI</span>
              </div>
              <span class="hub-card-sub">30+ Canlı Kanal</span>
            </div>
          </a>

          <!-- 3. Filmler -->
          <a href="#movies" class="hub-card">
            <div class="hub-card-icon" style="background: linear-gradient(135deg, #3b82f6, #06b6d4);">
              <i data-lucide="film" style="width: 20px; height: 20px; color: #fff;"></i>
            </div>
            <div class="hub-card-text">
              <span class="hub-card-title">Filmler</span>
              <span class="hub-card-sub">1080p Sinema</span>
            </div>
          </a>

          <!-- 4. Anime -->
          <a href="#anime" class="hub-card">
            <div class="hub-card-icon" style="background: linear-gradient(135deg, #0284c7, #38bdf8);">
              <i data-lucide="sparkles" style="width: 20px; height: 20px; color: #fff;"></i>
            </div>
            <div class="hub-card-text">
              <span class="hub-card-title">Anime</span>
              <span class="hub-card-sub">Altyazı &amp; Dublaj</span>
            </div>
          </a>

          <!-- 5. Çizgi Diziler -->
          <a href="#cartoons" class="hub-card">
            <div class="hub-card-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
              <i data-lucide="palette" style="width: 20px; height: 20px; color: #fff;"></i>
            </div>
            <div class="hub-card-text">
              <span class="hub-card-title">Çizgi Diziler</span>
              <span class="hub-card-sub">Nostalji &amp; Çocuk</span>
            </div>
          </a>

          <!-- 6. Belgeseller -->
          <a href="#documentary" class="hub-card">
            <div class="hub-card-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
              <i data-lucide="book-open" style="width: 20px; height: 20px; color: #fff;"></i>
            </div>
            <div class="hub-card-text">
              <span class="hub-card-title">Belgesel</span>
              <span class="hub-card-sub">Doğa, Bilim &amp; Tarih</span>
            </div>
          </a>

          <!-- 7. Birlikte Seç -->
          <button data-open-decision-room class="hub-card hub-card-wide" style="text-align: left; width: 100%;">
            <div class="hub-card-icon" style="background: linear-gradient(135deg, #6366f1, #8b5cf6);">
              <i data-lucide="users-round" style="width: 20px; height: 20px; color: #fff;"></i>
            </div>
            <div class="hub-card-text">
              <span class="hub-card-title">Birlikte Seç (Ortak Karar Odası)</span>
              <span class="hub-card-sub">Arkadaşlarınla anonim oylama yap ve ortak film seç</span>
            </div>
          </button>
        </div>
      </div>
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
    decisionRoomBtn.addEventListener('click', () => {
      closeMobileHub();
      openDecisionRoomModal();
    });
  });

  // Desktop Categories Dropdown
  const catDropdown = document.getElementById('nav-categories-dropdown');
  const catTrigger = catDropdown?.querySelector('.nav-dropdown-trigger');
  const catMenu = document.getElementById('nav-dropdown-menu');
  if (catDropdown && catTrigger && catMenu) {
    catTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = catMenu.classList.toggle('open');
      catTrigger.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!catDropdown.contains(e.target)) {
        catMenu.classList.remove('open');
        catTrigger.setAttribute('aria-expanded', 'false');
      }
    });

    catMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        catMenu.classList.remove('open');
        catTrigger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ====================================================================
  // Mobile Hub Sheet Handler
  // ====================================================================
  const hubBackdrop = document.getElementById('mobile-hub-backdrop');
  const hubOpenBtn = document.getElementById('btn-open-mobile-hub');
  const hubCloseBtn = document.getElementById('btn-close-mobile-hub');

  function openMobileHub() {
    if (!hubBackdrop) return;
    hubBackdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    renderIcons(hubBackdrop);
  }

  function closeMobileHub() {
    if (!hubBackdrop) return;
    hubBackdrop.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (hubOpenBtn) {
    hubOpenBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openMobileHub();
    });
  }

  if (hubCloseBtn) {
    hubCloseBtn.addEventListener('click', closeMobileHub);
  }

  if (hubBackdrop) {
    hubBackdrop.addEventListener('click', (e) => {
      if (e.target === hubBackdrop) closeMobileHub();
    });
    hubBackdrop.querySelectorAll('.hub-card').forEach(card => {
      card.addEventListener('click', () => {
        closeMobileHub();
      });
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
  window.addEventListener('keydown', attachedSearchShortcut);
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

          const dramaSearchItemHTML = `
            <a href="#dramas?q=${encodeURIComponent(query)}" class="search-item search-item-drama" style="background: linear-gradient(135deg, rgba(88, 28, 135, 0.35), rgba(30, 27, 75, 0.55)); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 10px; margin-top: 6px; padding: 0.6rem 0.75rem;">
              <div style="width: 36px; height: 48px; border-radius: 6px; background: rgba(168, 85, 247, 0.25); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <i data-lucide="sparkles" style="width: 18px; height: 18px; color: #c084fc;"></i>
              </div>
              <div class="search-item-info">
                <div class="search-item-title" style="color: #f3e8ff; font-weight: 750;">🎭 Kısa Dizilerde Ara: "${query}"</div>
                <div class="search-item-meta">
                  <span class="search-badge" style="background: #a855f7; color: #fff;">Özel Hub</span>
                  <span style="color: #c4b5fd;">ReelShort &amp; DramaBox</span>
                </div>
              </div>
            </a>
          `;

          if (!results || results.length === 0) {
            overlay.innerHTML = `
              <div class="search-no-results" style="padding-bottom: 0.5rem;">TMDB Sonucu Bulunamadı</div>
              ${dramaSearchItemHTML}
            `;
            overlay.classList.remove('hidden');
            renderIcons(overlay);
            attachSearchClickEvents();
            return;
          }

          const tmdbItemsHTML = results.map(item => {
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

          overlay.innerHTML = `${tmdbItemsHTML}${dramaSearchItemHTML}`;
          overlay.classList.remove('hidden');
          renderIcons(overlay);
          attachSearchClickEvents();

          function attachSearchClickEvents() {
            overlay.querySelectorAll('.search-item').forEach(link => {
              link.addEventListener('click', () => {
                overlay.classList.add('hidden');
                input.value = '';
                const mobileSearchRow = document.getElementById('mobile-search-row');
                if (mobileSearchRow) mobileSearchRow.classList.add('hidden');
              });
            });
          }
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
