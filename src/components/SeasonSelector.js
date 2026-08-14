/* ==========================================================================
   CinePulse Studio - Season & Episode Selector Component
   Renders season tabs and episode cards with REAL TMDB overviews,
   instant episode click-to-play, interactive mark-as-watched toggles,
   and 'Devamını Oku (...)' overview expansion.
   ========================================================================== */

import { fetchSeasonDetails, getImageUrl, TMDB_IMAGE_SIZES, SINEFLIX_POSTER_FALLBACK } from '../services/tmdbApi.js';
import { getMediaProgress, isMediaWatched, toggleEpisodeWatched } from '../services/storage.js';
import { openPlayerModal } from './PlayerModal.js';
import { showToast } from './Toast.js';

export async function renderSeasonSelector({ tvId, seriesTitle, originalTitle = '', seriesOverview = '', seasons = [], posterPath = '', backdropPath = '' }) {
  const validSeasons = seasons.filter(s => s.season_number > 0);
  if (validSeasons.length === 0 && seasons.length > 0) validSeasons.push(seasons[0]);

  const activeSeasonNumber = validSeasons.length > 0 ? validSeasons[0].season_number : 1;

  const html = `
    <div class="season-container">
      <h2 class="section-title" style="margin-bottom: 1.2rem;">
        <i data-lucide="layers"></i> Sezonlar ve Bölümler
      </h2>

      <div class="season-bar" id="season-tabs-bar">
        ${validSeasons.map(season => `
          <button class="season-btn ${season.season_number === activeSeasonNumber ? 'active' : ''}" data-season="${season.season_number}">
            ${season.name || `${season.season_number}. Sezon`} (${season.episode_count} Bölüm)
          </button>
        `).join('')}
      </div>

      <div class="episode-grid" id="episode-grid-container">
        <div style="padding: 2rem; text-align: center; color: var(--text-muted);">Bölümler yükleniyor...</div>
      </div>
    </div>
  `;

  return {
    html,
    init: (container) => {
      if (!container) return;
      
      loadSeasonEpisodes(tvId, seriesTitle, seriesOverview, activeSeasonNumber, container, posterPath, backdropPath, originalTitle);

      container.querySelectorAll('.season-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          container.querySelectorAll('.season-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const seasonNum = parseInt(btn.getAttribute('data-season'), 10);
          loadSeasonEpisodes(tvId, seriesTitle, seriesOverview, seasonNum, container, posterPath, backdropPath, originalTitle);
        });
      });
    }
  };
}

async function loadSeasonEpisodes(tvId, seriesTitle, seriesOverview, seasonNum, container, posterPath = '', backdropPath = '', originalTitle = '') {
  const gridContainer = container.querySelector('#episode-grid-container');
  if (!gridContainer) return;

  gridContainer.innerHTML = `<div style="padding: 2rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;">${seasonNum}. Sezon bölümleri getiriliyor...</div>`;

  const seasonData = await fetchSeasonDetails(tvId, seasonNum);
  if (!seasonData || !seasonData.episodes || seasonData.episodes.length === 0) {
    gridContainer.innerHTML = `<div style="padding: 2rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;">Bu sezon için bölüm verisi bulunamadı.</div>`;
    return;
  }

  gridContainer.innerHTML = seasonData.episodes.map(ep => {
    const epNum = ep.episode_number;
    const epTitle = ep.name || `${epNum}. Bölüm`;
    
    // REAL TMDB Episode Overview in Turkish
    let rawOverview = ep.overview ? ep.overview.trim() : '';
    if (!rawOverview || rawOverview.length < 5) {
      if (seriesOverview && seriesOverview.length > 10) {
        rawOverview = `${epNum}. Bölüm: ${seriesOverview}`;
      } else {
        rawOverview = `${seriesTitle} ${seasonNum}. Sezon ${epNum}. Bölüm Türkçe Dublaj ve Altyazılı yüksek kalitede kesintisiz HD izle.`;
      }
    }

    const isLongText = rawOverview.length > 85;
    const stillUrl = getImageUrl(ep.still_path, TMDB_IMAGE_SIZES.STILL_MEDIUM);
    const airDate = ep.air_date || '';

    const progress = getMediaProgress(tvId, seasonNum, epNum);
    const progressPercent = progress ? progress.progressPercent : 0;
    const isCompleted = progress ? progress.completed : false;

    const progressHTML = progressPercent > 0 ? `
      <div class="card-progress-bar">
        <div class="card-progress-fill" style="width: ${progressPercent}%"></div>
      </div>
    ` : '';

    const badgeStatusHTML = isCompleted ? `
      <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.5rem; left: 0.5rem; background: var(--accent-green);">
        <i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ
      </span>
    ` : `
      <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.5rem; left: 0.5rem; background: var(--accent-green); display: none;">
        <i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ
      </span>
    `;

    return `
      <div class="episode-card" data-tv-id="${tvId}" data-season="${seasonNum}" data-episode="${epNum}" data-title="${epTitle}">
        <div class="episode-thumb-wrapper">
          <img class="episode-thumb" src="${stillUrl}" alt="${epTitle}" loading="lazy" onerror="this.onerror=null; this.src='${SINEFLIX_POSTER_FALLBACK}';" />
          <span class="episode-number-badge">${seasonNum}x${epNum < 10 ? '0' + epNum : epNum}</span>
          ${badgeStatusHTML}
          
          <!-- Interactive Mark as Watched Check Button -->
          <button class="btn-mark-ep-watched ${isCompleted ? 'watched' : ''}" data-tv-id="${tvId}" data-season="${seasonNum}" data-episode="${epNum}" title="${isCompleted ? 'İzlendi işaretini kaldır' : 'İzlendi olarak işaretle'}" style="position: absolute; top: 0.5rem; right: 0.5rem; width: 28px; height: 28px; border-radius: 50%; background: ${isCompleted ? '#10b981' : 'rgba(0,0,0,0.65)'}; border: 1px solid ${isCompleted ? '#10b981' : 'rgba(255,255,255,0.3)'}; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 5; transition: all 0.2s ease;">
            <i data-lucide="check" style="width: 14px; height: 14px;"></i>
          </button>

          ${progressHTML}
        </div>

        <div class="episode-info">
          <div class="episode-title">${epNum}. ${epTitle}</div>
          
          <div class="episode-overview-container">
            <div class="episode-overview ${isLongText ? 'truncated' : ''}" data-full="${rawOverview}">
              ${rawOverview}
            </div>
            ${isLongText ? `
              <button class="btn-toggle-overview" style="color: var(--primary); font-weight: 700; font-size: 0.82rem; margin-top: 0.35rem; display: inline-flex; align-items: center; gap: 0.25rem; cursor: pointer;">
                <span>Devamını Oku</span>
                <i data-lucide="chevron-down" style="width: 14px; height: 14px;"></i>
              </button>
            ` : ''}
          </div>

          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: auto; padding-top: 0.5rem; display: flex; align-items: center; justify-content: space-between;">
            <span>${airDate}</span>
            <span class="btn-play-episode-trigger" style="color: var(--primary); font-weight: 700; cursor: pointer;">Hemen İzle ▶</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();

  // Attach Devamını Oku (Read More) toggle handlers
  container.querySelectorAll('.btn-toggle-overview').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const containerEl = btn.closest('.episode-overview-container');
      const overviewEl = containerEl.querySelector('.episode-overview');
      const textSpan = btn.querySelector('span');
      const icon = btn.querySelector('i');

      if (overviewEl.classList.contains('truncated')) {
        overviewEl.classList.remove('truncated');
        if (textSpan) textSpan.textContent = 'Daralt';
        if (icon) icon.setAttribute('data-lucide', 'chevron-up');
      } else {
        overviewEl.classList.add('truncated');
        if (textSpan) textSpan.textContent = 'Devamını Oku';
        if (icon) icon.setAttribute('data-lucide', 'chevron-down');
      }

      if (window.lucide) window.lucide.createIcons();
    });
  });

  // Attach Mark as Watched button clicks
  gridContainer.querySelectorAll('.btn-mark-ep-watched').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const epSeason = parseInt(btn.getAttribute('data-season'), 10);
      const epNumber = parseInt(btn.getAttribute('data-episode'), 10);
      const card = btn.closest('.episode-card');

      const updated = toggleEpisodeWatched(tvId, epSeason, epNumber, {
        title: seriesTitle,
        posterPath,
        backdropPath,
        type: 'tv'
      });

      const isNowCompleted = updated.completed;
      showToast(isNowCompleted ? `S${epSeason} B${epNumber} izlendi olarak işaretlendi!` : `S${epSeason} B${epNumber} izlendi işareti kaldırıldı.`, isNowCompleted ? 'success' : 'info');

      // Update button visual
      if (isNowCompleted) {
        btn.classList.add('watched');
        btn.style.background = '#10b981';
        btn.style.borderColor = '#10b981';
        btn.title = 'İzlendi işaretini kaldır';
      } else {
        btn.classList.remove('watched');
        btn.style.background = 'rgba(0,0,0,0.65)';
        btn.style.borderColor = 'rgba(255,255,255,0.3)';
        btn.title = 'İzlendi olarak işaretle';
      }

      // Update badge visual
      if (card) {
        const badgeEl = card.querySelector('.badge-watched-status');
        if (badgeEl) {
          badgeEl.style.display = isNowCompleted ? 'inline-flex' : 'none';
        }
      }
    });
  });

  // Attach Episode Card & Play Triggers
  gridContainer.querySelectorAll('.episode-card').forEach(card => {
    const playEpisode = (e) => {
      // Don't trigger if clicked on the mark-as-watched button
      if (e && e.target && (e.target.closest('.btn-mark-ep-watched') || e.target.closest('.btn-toggle-overview'))) {
        return;
      }
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const season = parseInt(card.getAttribute('data-season'), 10);
      const episode = parseInt(card.getAttribute('data-episode'), 10);
      const epTitle = card.getAttribute('data-title');

      const historyRecord = getMediaProgress(tvId, season, episode);
      const startTime = historyRecord ? historyRecord.currentTime : 0;

      openPlayerModal({
        type: 'tv',
        tmdbId: tvId,
        title: `${seriesTitle} - S${season}E${episode}: ${epTitle}`,
        seriesTitle,
        originalTitle: originalTitle || seriesTitle,
        season,
        episode,
        posterPath,
        backdropPath,
        currentTime: startTime
      });
    };

    card.addEventListener('click', playEpisode);
    
    // Explicit trigger listeners for thumb and play button
    const thumbWrapper = card.querySelector('.episode-thumb-wrapper');
    if (thumbWrapper) thumbWrapper.addEventListener('click', playEpisode);

    const playTrigger = card.querySelector('.btn-play-episode-trigger');
    if (playTrigger) playTrigger.addEventListener('click', playEpisode);
  });
}
