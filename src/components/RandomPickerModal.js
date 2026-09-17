import { renderIcons } from '../services/icons.js';
/* ==========================================================================
   CinePulse Studio - "Ne İzlesem?" Akıllı Çark / Rastgele Öneri Modal
   Interactive smart suggestion reel with genre & rating filters,
   animated roulette shuffle, and one-click direct playback.
   ========================================================================== */

import { fetchDiscoverMedia, GENRE_MAP_MOVIE, GENRE_MAP_TV, getImageUrl, TMDB_IMAGE_SIZES } from '../services/tmdbApi.js';
import { openPlayerModal } from './openPlayer.js';
import { showToast } from './Toast.js';

let activeRandomModal = null;

const GENRE_OPTIONS = [
  { label: '🎲 Karışık / Farketmez', id: null },
  { label: '💥 Aksiyon', movie: 28, tv: 10759 },
  { label: '🚀 Bilim Kurgu & Fantastik', movie: 878, tv: 10765 },
  { label: '😂 Komedi', movie: 35, tv: 35 },
  { label: '🩸 Korku & Gerilim', movie: 27, tv: 9648 },
  { label: '🎭 Dram', movie: 18, tv: 18 },
  { label: '🕵️ Suç & Gizem', movie: 80, tv: 9648 },
  { label: '🎌 Animasyon & Anime', movie: 16, tv: 16 },
  { label: '💖 Romantik', movie: 10749, tv: 10749 },
  { label: '🌍 Belgesel', movie: 99, tv: 99 }
];

export async function openRandomPickerModal() {
  closeRandomPickerModal();

  const modalContainer = document.createElement('div');
  modalContainer.id = 'random-picker-modal-root';
  modalContainer.className = 'random-picker-backdrop';
  document.body.appendChild(modalContainer);
  activeRandomModal = modalContainer;

  let selectedType = 'all'; // 'all' | 'movie' | 'tv'
  let selectedGenreIndex = 0; // null = random/mixed
  let selectedMinRating = 7.0;

  modalContainer.innerHTML = `
    <div class="random-picker-dialog">
      <button class="random-picker-close-btn" id="btn-close-random-picker" title="Kapat">
        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
      </button>

      <!-- Modal Title -->
      <div class="random-picker-top">
        <div class="random-picker-sparkle-icon">
          <i data-lucide="dices" style="width: 28px; height: 28px; color: #f59e0b;"></i>
        </div>
        <h2>Ne İzlesem? 🍿</h2>
        <p>Kararsız mı kaldınız? Kriterlerinizi seçin, CinePulse yapay zekası sizin için en iyi yapımı önersin.</p>
      </div>

      <!-- Filters Section -->
      <div class="random-picker-filters">
        <!-- Type Selection -->
        <div class="random-filter-row">
          <label>İçerik Türü</label>
          <div class="random-pills-wrap" id="random-type-pills">
            <button class="random-pill-btn active" data-type="all">🎬 Film & Dizi</button>
            <button class="random-pill-btn" data-type="movie">🎥 Sadece Film</button>
            <button class="random-pill-btn" data-type="tv">📺 Sadece Dizi</button>
          </div>
        </div>

        <!-- Min IMDb Rating -->
        <div class="random-filter-row">
          <label>Minimum IMDb Puanı</label>
          <div class="random-pills-wrap" id="random-rating-pills">
            <button class="random-pill-btn" data-rating="0">Tümü</button>
            <button class="random-pill-btn active" data-rating="7.0">⭐ 7.0+</button>
            <button class="random-pill-btn" data-rating="7.5">⭐ 7.5+</button>
            <button class="random-pill-btn" data-rating="8.0">🏆 8.0+ (Başyapıt)</button>
          </div>
        </div>

        <!-- Genre Pills -->
        <div class="random-filter-row">
          <label>Favori Tür</label>
          <div class="random-pills-wrap" id="random-genre-pills">
            ${GENRE_OPTIONS.map((g, idx) => `
              <button class="random-pill-btn ${idx === 0 ? 'active' : ''}" data-genre-idx="${idx}">${g.label}</button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Spin / Roulette Stage -->
      <div class="random-spin-stage" id="random-spin-stage">
        <div class="random-idle-placeholder">
          <i data-lucide="sparkles" style="width: 44px; height: 44px; color: #f59e0b;"></i>
          <span>Aşağıdaki butona basarak şansınızı deneyin!</span>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="random-picker-footer">
        <button class="btn-spin-wheel" id="btn-spin-wheel">
          <i data-lucide="shuffle" style="width: 18px; height: 18px;"></i>
          <span>Rastgele Öneriyi Başlat ✨</span>
        </button>
      </div>
    </div>
  `;

  renderIcons(modalContainer);

  const closeBtn = modalContainer.querySelector('#btn-close-random-picker');
  if (closeBtn) closeBtn.onclick = () => closeRandomPickerModal();

  modalContainer.onclick = (e) => {
    if (e.target === modalContainer) closeRandomPickerModal();
  };

  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      closeRandomPickerModal();
      window.removeEventListener('keydown', handleEsc);
    }
  };
  window.addEventListener('keydown', handleEsc);

  // Wire Filter Clicks
  const typePills = modalContainer.querySelectorAll('#random-type-pills .random-pill-btn');
  typePills.forEach(btn => {
    btn.onclick = () => {
      typePills.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedType = btn.getAttribute('data-type');
    };
  });

  const ratingPills = modalContainer.querySelectorAll('#random-rating-pills .random-pill-btn');
  ratingPills.forEach(btn => {
    btn.onclick = () => {
      ratingPills.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedMinRating = parseFloat(btn.getAttribute('data-rating') || '0');
    };
  });

  const genrePills = modalContainer.querySelectorAll('#random-genre-pills .random-pill-btn');
  genrePills.forEach(btn => {
    btn.onclick = () => {
      genrePills.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedGenreIndex = parseInt(btn.getAttribute('data-genre-idx'), 10);
    };
  });

  // Spin Logic
  const spinBtn = modalContainer.querySelector('#btn-spin-wheel');
  const stage = modalContainer.querySelector('#random-spin-stage');

  const executeSpin = async () => {
    if (spinBtn) {
      spinBtn.disabled = true;
      spinBtn.classList.add('is-spinning');
    }

    // Show spinning animation in stage
    stage.innerHTML = `
      <div class="random-roulette-box">
        <div class="roulette-glow-ring"></div>
        <div class="roulette-roller" id="roulette-roller">
          <div class="roulette-reel-text">Adaylar Karıştırılıyor... 🎲</div>
        </div>
      </div>
    `;

    // Determine type for fetch
    let fetchType = selectedType;
    if (fetchType === 'all') {
      fetchType = Math.random() > 0.5 ? 'movie' : 'tv';
    }

    // Genre ID
    let genreId = null;
    const genreObj = GENRE_OPTIONS[selectedGenreIndex];
    if (genreObj) {
      genreId = fetchType === 'movie' ? genreObj.movie : genreObj.tv;
    }

    // Fetch random page from 1 to 3
    const randomPage = Math.floor(Math.random() * 3) + 1;
    const items = await fetchDiscoverMedia(fetchType, {
      genreId,
      minRating: selectedMinRating,
      page: randomPage,
      sortBy: 'popularity.desc'
    });

    // Simulate roulette shuffle with candidates
    const validItems = (items || []).filter(item => item && (item.title || item.name) && (item.poster_path || item.backdrop_path));

    if (!validItems || validItems.length === 0) {
      stage.innerHTML = `
        <div class="random-idle-placeholder">
          <i data-lucide="frown" style="width: 40px; height: 40px; color: #ef4444;"></i>
          <span>Bu kriterlere uygun yapım bulunamadı. Lütfen filtreleri gevşetip tekrar deneyin.</span>
        </div>
      `;
      renderIcons(stage);
      if (spinBtn) {
        spinBtn.disabled = false;
        spinBtn.classList.remove('is-spinning');
      }
      return;
    }

    const roller = stage.querySelector('#roulette-roller');
    const shuffleSteps = 8;
    for (let i = 0; i < shuffleSteps; i++) {
      const tempItem = validItems[Math.floor(Math.random() * validItems.length)];
      const tempTitle = tempItem.title || tempItem.name || 'Öneri Aranıyor';
      if (roller) {
        roller.innerHTML = `<div class="roulette-reel-text animate-pulse">${tempTitle}</div>`;
      }
      await new Promise(r => setTimeout(r, 120 + i * 25));
    }

    // Select winner
    const winner = validItems[Math.floor(Math.random() * validItems.length)];
    const winnerTitle = winner.title || winner.name || 'Seçilen Yapım';
    const winnerOriginalTitle = winner.original_title || winner.original_name || winnerTitle;
    const winnerPoster = getImageUrl(winner.poster_path, TMDB_IMAGE_SIZES.POSTER_MEDIUM);
    const winnerBackdrop = getImageUrl(winner.backdrop_path, TMDB_IMAGE_SIZES.BACKDROP_LARGE);
    const winnerRating = winner.vote_average ? Number(winner.vote_average).toFixed(1) : '8.0';
    const winnerYear = (winner.release_date || winner.first_air_date || '').substring(0, 4);
    const winnerOverview = winner.overview && winner.overview.trim().length > 10
      ? winner.overview
      : 'Harika bir izleme deneyimi sunan sürpriz bir öneri!';
    const winnerType = fetchType === 'movie' ? 'movie' : 'tv';

    // Reveal winner card
    stage.innerHTML = `
      <div class="random-winner-card">
        <div class="winner-poster-wrap">
          <img src="${winnerPoster}" alt="${winnerTitle}" class="winner-poster" />
          <div class="winner-rating-pill">⭐ ${winnerRating}</div>
        </div>
        <div class="winner-details-wrap">
          <div class="winner-badge-row">
            <span class="winner-tag-type">${winnerType === 'movie' ? 'FİLM' : 'DİZİ'}</span>
            ${winnerYear ? `<span class="winner-tag-year">${winnerYear}</span>` : ''}
            <span class="winner-tag-match">🎯 %98 Eşleşme</span>
          </div>
          <h3 class="winner-title">${winnerTitle}</h3>
          <p class="winner-overview">${winnerOverview}</p>
          <div class="winner-actions-row">
            <button class="winner-play-btn" id="btn-winner-play">
              <i data-lucide="play" style="width: 16px; height: 16px; fill: currentColor;"></i>
              <span>Hemen İzle</span>
            </button>
            <button class="winner-detail-btn" id="btn-winner-detail">
              <i data-lucide="info" style="width: 16px; height: 16px;"></i>
              <span>İncele</span>
            </button>
            <button class="winner-retry-btn" id="btn-winner-retry" title="Başka Öner">
              <i data-lucide="refresh-cw" style="width: 16px; height: 16px;"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    renderIcons(stage);

    // Winner play action
    const winnerPlayBtn = stage.querySelector('#btn-winner-play');
    if (winnerPlayBtn) {
      winnerPlayBtn.onclick = () => {
        closeRandomPickerModal();
        openPlayerModal({
          type: winnerType,
          tmdbId: winner.id,
          title: winnerTitle,
          originalTitle: winnerOriginalTitle,
          posterPath: winner.poster_path,
          backdropPath: winner.backdrop_path,
          season: 1,
          episode: 1
        });
      };
    }

    // Winner detail action
    const winnerDetailBtn = stage.querySelector('#btn-winner-detail');
    if (winnerDetailBtn) {
      winnerDetailBtn.onclick = () => {
        closeRandomPickerModal();
        window.location.hash = `#detail?type=${winnerType}&id=${winner.id}`;
      };
    }

    // Winner retry action
    const winnerRetryBtn = stage.querySelector('#btn-winner-retry');
    if (winnerRetryBtn) {
      winnerRetryBtn.onclick = () => {
        executeSpin();
      };
    }

    if (spinBtn) {
      spinBtn.disabled = false;
      spinBtn.classList.remove('is-spinning');
      spinBtn.innerHTML = `<i data-lucide="refresh-cw" style="width: 17px; height: 17px;"></i> <span>Başka Bir Tane Öner</span>`;
      renderIcons(spinBtn);
    }
  };

  if (spinBtn) {
    spinBtn.onclick = () => executeSpin();
  }
}

export function closeRandomPickerModal() {
  if (activeRandomModal) {
    try { activeRandomModal.remove(); } catch (_) {}
    activeRandomModal = null;
  }
}
