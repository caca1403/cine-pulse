import { renderIcons } from '../services/icons.js';
/* ==========================================================================
   CinePulse Studio - Cast & Crew Explorer Modal
   Allows users to explore an actor's/director's full filmography, biography,
   and related movies/series with direct one-click playback and navigation.
   ========================================================================== */

import { fetchPersonDetails, getImageUrl, TMDB_IMAGE_SIZES, SINEFLIX_ACTOR_FALLBACK } from '../services/tmdbApi.js';
import { renderMediaCard, attachMediaCardEvents } from './MediaCard.js';

let activeCastModal = null;

export async function openCastExplorerModal(personId, fallbackName = '', fallbackProfile = '') {
  // Remove any open cast modal
  closeCastExplorerModal();

  const modalContainer = document.createElement('div');
  modalContainer.id = 'cast-explorer-modal-root';
  modalContainer.className = 'cast-explorer-backdrop';
  document.body.appendChild(modalContainer);
  activeCastModal = modalContainer;

  // Show loading skeleton
  modalContainer.innerHTML = `
    <div class="cast-explorer-dialog">
      <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
      </button>
      <div class="cast-explorer-loading">
        <div class="cast-explorer-spinner"></div>
        <span>${fallbackName || 'Oyuncu'} bilgileri ve filmografisi yükleniyor...</span>
      </div>
    </div>
  `;
  renderIcons(modalContainer);

  const closeBtn = modalContainer.querySelector('#btn-close-cast-explorer');
  if (closeBtn) closeBtn.onclick = () => closeCastExplorerModal();
  modalContainer.onclick = (e) => {
    if (e.target === modalContainer) closeCastExplorerModal();
  };

  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      closeCastExplorerModal();
      window.removeEventListener('keydown', handleEsc);
    }
  };
  window.addEventListener('keydown', handleEsc);

  // Fetch real details
  const person = await fetchPersonDetails(personId);

  if (!person) {
    modalContainer.innerHTML = `
      <div class="cast-explorer-dialog">
        <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
          <i data-lucide="x" style="width: 20px; height: 20px;"></i>
        </button>
        <div class="cast-explorer-loading">
          <i data-lucide="alert-circle" style="width: 36px; height: 36px; color: #ef4444;"></i>
          <span>Oyuncu bilgileri alınamadı.</span>
        </div>
      </div>
    `;
    renderIcons(modalContainer);
    return;
  }

  const name = person.name || fallbackName;
  const profileUrl = person.profile_path ? getImageUrl(person.profile_path, TMDB_IMAGE_SIZES.POSTER_MEDIUM) : (fallbackProfile || SINEFLIX_ACTOR_FALLBACK);
  const birthday = person.birthday ? person.birthday.substring(0, 4) : '';
  const placeOfBirth = person.place_of_birth || '';
  const department = person.known_for_department === 'Acting' ? 'Oyuncu' : (person.known_for_department === 'Directing' ? 'Yönetmen' : (person.known_for_department || 'Sanatçı'));
  const bio = person.biography && person.biography.trim().length > 20
    ? person.biography
    : `${name}, sinema ve televizyon dünyasında yer aldığı yapımlarla tanınan başarılı bir sanatçıdır.`;

  // Parse combined credits
  const castCredits = person.combined_credits?.cast || [];
  const crewCredits = person.combined_credits?.crew || [];
  const rawCredits = [...castCredits, ...crewCredits];

  // Deduplicate by media ID
  const seenIds = new Set();
  const credits = [];
  for (const item of rawCredits) {
    if (!item || !item.id) continue;
    const mediaId = `${item.media_type || 'movie'}_${item.id}`;
    if (!seenIds.has(mediaId)) {
      seenIds.add(mediaId);
      // Filter out adult or poster-less spam
      if (item.poster_path) {
        credits.push(item);
      }
    }
  }

  // Sort by popularity and vote count
  credits.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

  const movieCount = credits.filter(c => (c.media_type === 'movie' || (!c.media_type && c.title))).length;
  const tvCount = credits.filter(c => (c.media_type === 'tv' || (!c.media_type && c.name))).length;

  modalContainer.innerHTML = `
    <div class="cast-explorer-dialog">
      <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
      </button>

      <!-- Actor Hero Header -->
      <div class="cast-explorer-header">
        <div class="cast-explorer-avatar-box">
          <img src="${profileUrl}" alt="${name}" class="cast-explorer-avatar" onerror="this.onerror=null; this.src='${SINEFLIX_ACTOR_FALLBACK}';" />
        </div>
        <div class="cast-explorer-bio-box">
          <div class="cast-explorer-name-row">
            <h2>${name}</h2>
            <span class="cast-explorer-dept-tag">${department}</span>
          </div>
          <div class="cast-explorer-meta-row">
            ${birthday ? `<span><i data-lucide="calendar" style="width:13px;height:13px;"></i> D: ${birthday}</span>` : ''}
            ${placeOfBirth ? `<span><i data-lucide="map-pin" style="width:13px;height:13px;"></i> ${placeOfBirth}</span>` : ''}
            <span><i data-lucide="film" style="width:13px;height:13px;"></i> ${credits.length} Yapım</span>
          </div>
          <p class="cast-explorer-bio-text">${bio}</p>
        </div>
      </div>

      <!-- Filmography Tabs -->
      <div class="cast-explorer-tabs">
        <button class="cast-tab-btn active" data-filter="all">Tümü (${credits.length})</button>
        <button class="cast-tab-btn" data-filter="movie">Filmler (${movieCount})</button>
        <button class="cast-tab-btn" data-filter="tv">Diziler (${tvCount})</button>
      </div>

      <!-- Media Cards Grid -->
      <div class="cast-explorer-grid" id="cast-explorer-grid">
        ${credits.map(item => renderMediaCard(item)).join('')}
      </div>
    </div>
  `;

  renderIcons(modalContainer);

  const freshCloseBtn = modalContainer.querySelector('#btn-close-cast-explorer');
  if (freshCloseBtn) freshCloseBtn.onclick = () => closeCastExplorerModal();

  const grid = modalContainer.querySelector('#cast-explorer-grid');
  if (grid) {
    attachMediaCardEvents(grid);
    // When any card inside modal is clicked, close the modal smoothly
    grid.addEventListener('click', () => {
      setTimeout(() => closeCastExplorerModal(), 150);
    });
  }

  // Tab Filtering
  const tabButtons = modalContainer.querySelectorAll('.cast-tab-btn');
  tabButtons.forEach(btn => {
    btn.onclick = () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      let filtered = credits;
      if (filter === 'movie') {
        filtered = credits.filter(c => c.media_type === 'movie' || (!c.media_type && c.title));
      } else if (filter === 'tv') {
        filtered = credits.filter(c => c.media_type === 'tv' || (!c.media_type && c.name));
      }

      if (grid) {
        grid.innerHTML = filtered.length > 0
          ? filtered.map(item => renderMediaCard(item)).join('')
          : '<div class="cast-empty-state">Bu kategoride yapım bulunamadı.</div>';
        renderIcons(grid);
      }
    };
  });
}

export function closeCastExplorerModal() {
  if (activeCastModal) {
    try { activeCastModal.remove(); } catch (_) {}
    activeCastModal = null;
  }
}
