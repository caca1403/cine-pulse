/* ==========================================================================
   CinePulse Studio - Season & Episode Selector Component
   Renders season tabs and episode cards with REAL TMDB overviews,
   instant episode click-to-play, interactive mark-as-watched toggles,
   bulk season watched actions, and halfway in-progress markers.
   ========================================================================== */

import { fetchSeasonDetails, getImageUrl, TMDB_IMAGE_SIZES, SINEFLIX_POSTER_FALLBACK } from '../services/tmdbApi.js';
import { getMediaProgress, isMediaWatched, toggleEpisodeWatched, markSeasonEpisodesWatched, isSeasonFullyWatched, setMediaHalfway } from '../services/storage.js';
import { openPlayerModal } from './PlayerModal.js';
import { showToast } from './Toast.js';

export async function renderSeasonSelector({ tvId, seriesTitle, originalTitle = '', seriesOverview = '', seasons = [], posterPath = '', backdropPath = '' }) {
  const validSeasons = seasons.filter(s => s.season_number > 0);
  if (validSeasons.length === 0 && seasons.length > 0) validSeasons.push(seasons[0]);

  const activeSeasonNumber = validSeasons.length > 0 ? validSeasons[0].season_number : 1;
  const initialEpCount = validSeasons.length > 0 ? (validSeasons[0].episode_count || 10) : 10;
  const isInitialSeasonWatched = isSeasonFullyWatched(tvId, activeSeasonNumber, initialEpCount);

  const html = `
    <div class="season-selector-wrapper">
      <div class="season-selector-header">
        <div style="display: flex; align-items: center; gap: 0.65rem;">
          <span class="rail-icon-pill" style="--rail-color: #f59e0b; width: 28px; height: 28px;">
            <i data-lucide="layers" style="width: 15px; height: 15px;"></i>
          </span>
          <h2 class="season-selector-title" style="margin: 0;">Sezonlar ve Bölümler</h2>
        </div>

        <!-- Bulk Mark Current Season Watched Button -->
        <button id="btn-mark-season-all" class="btn-secondary" style="padding: 0.45rem 1.1rem; font-size: 0.82rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.45rem; cursor: pointer; ${isInitialSeasonWatched ? 'background: rgba(16, 185, 129, 0.2); border-color: #10b981; color: #10b981;' : ''}">
          <i data-lucide="${isInitialSeasonWatched ? 'check-circle-2' : 'check-check'}" style="width: 14px; height: 14px;"></i>
          <span>${isInitialSeasonWatched ? 'Bu Sezon İzlendi' : 'Bu Sezonu İzlendi İşaretle'}</span>
        </button>
      </div>

      <!-- Luxury Segmented Season Pills Track -->
      <div class="season-pills-track" id="season-tabs-bar" style="margin-bottom: 1.5rem;">
        ${validSeasons.map(season => `
          <button class="season-pill ${season.season_number === activeSeasonNumber ? 'active' : ''}" data-season="${season.season_number}" data-ep-count="${season.episode_count || 10}">
            ${season.name || `${season.season_number}. Sezon`} <span style="opacity: 0.75; font-size: 0.72rem; margin-left: 0.2rem;">(${season.episode_count} Bölüm)</span>
          </button>
        `).join('')}
      </div>

      <div class="episodes-grid" id="episode-grid-container">
        <div style="padding: 3rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;">
          <i data-lucide="loader-2" class="spin-loader" style="width: 24px; height: 24px; margin-bottom: 0.5rem;"></i>
          <div>Bölümler yükleniyor...</div>
        </div>
      </div>
    </div>
  `;

  return {
    html,
    init: (container) => {
      if (!container) return;
      
      let currentActiveSeason = activeSeasonNumber;
      let currentEpCount = initialEpCount;

      const updateSeasonBtnVisual = () => {
        const seasonAllBtn = container.querySelector('#btn-mark-season-all');
        if (!seasonAllBtn) return;
        const isWatched = isSeasonFullyWatched(tvId, currentActiveSeason, currentEpCount);
        const span = seasonAllBtn.querySelector('span');
        const icon = seasonAllBtn.querySelector('i');
        if (span) span.textContent = isWatched ? 'Bu Sezon İzlendi' : 'Bu Sezonu İzlendi İşaretle';
        if (icon) icon.setAttribute('data-lucide', isWatched ? 'check-circle-2' : 'check-check');
        if (isWatched) {
          seasonAllBtn.style.background = 'rgba(16, 185, 129, 0.2)';
          seasonAllBtn.style.borderColor = '#10b981';
          seasonAllBtn.style.color = '#10b981';
        } else {
          seasonAllBtn.style.background = '';
          seasonAllBtn.style.borderColor = '';
          seasonAllBtn.style.color = '';
        }
        if (window.lucide) window.lucide.createIcons();
      };

      loadSeasonEpisodes(tvId, seriesTitle, seriesOverview, currentActiveSeason, container, posterPath, backdropPath, originalTitle, validSeasons, updateSeasonBtnVisual);

      container.querySelectorAll('.season-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          container.querySelectorAll('.season-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentActiveSeason = parseInt(btn.getAttribute('data-season'), 10);
          currentEpCount = parseInt(btn.getAttribute('data-ep-count'), 10) || 10;
          loadSeasonEpisodes(tvId, seriesTitle, seriesOverview, currentActiveSeason, container, posterPath, backdropPath, originalTitle, validSeasons);
          updateSeasonBtnVisual();
        });
      });

      const seasonAllBtn = container.querySelector('#btn-mark-season-all');
      if (seasonAllBtn) {
        seasonAllBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const isWatched = isSeasonFullyWatched(tvId, currentActiveSeason, currentEpCount);
          const targetWatched = !isWatched;
          markSeasonEpisodesWatched(tvId, currentActiveSeason, currentEpCount, targetWatched, {
            title: seriesTitle,
            posterPath,
            backdropPath,
            type: 'tv'
          });

          showToast(targetWatched ? `${currentActiveSeason}. Sezonun tüm bölümleri izlendi!` : `${currentActiveSeason}. Sezon izlenmedi olarak işaretlendi.`, targetWatched ? 'success' : 'info');
          
          // In-place DOM update for all visible episode cards in this season
          const gridContainer = container.querySelector('#episode-grid-container');
          if (gridContainer) {
            gridContainer.querySelectorAll('.episode-card').forEach(card => {
              const badgeEl = card.querySelector('.badge-watched-status');
              const btnEl = card.querySelector('.btn-mark-ep-watched');
              if (badgeEl) {
                badgeEl.innerHTML = `<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ`;
                badgeEl.style.background = 'var(--accent-green)';
                badgeEl.style.color = '#fff';
                badgeEl.style.display = targetWatched ? 'inline-flex' : 'none';
              }
              if (btnEl) {
                if (targetWatched) {
                  btnEl.classList.add('watched');
                  btnEl.style.background = '#10b981';
                  btnEl.style.borderColor = '#10b981';
                  btnEl.title = 'İzlendi işaretini kaldır';
                } else {
                  btnEl.classList.remove('watched');
                  btnEl.style.background = 'rgba(0,0,0,0.65)';
                  btnEl.style.borderColor = 'rgba(255,255,255,0.3)';
                  btnEl.title = 'İzlendi olarak işaretle';
                }
              }
            });
            if (window.lucide) window.lucide.createIcons();
          }

          updateSeasonBtnVisual();
        });
      }
    }
  };
}

async function loadSeasonEpisodes(tvId, seriesTitle, seriesOverview, seasonNum, container, posterPath = '', backdropPath = '', originalTitle = '', validSeasons = [], onStatusChange = null) {
  const gridContainer = container.querySelector('#episode-grid-container');
  if (!gridContainer) return;

  gridContainer.innerHTML = `<div style="padding: 3rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;"><i data-lucide="loader-2" class="spin-loader" style="width: 24px; height: 24px; margin-bottom: 0.5rem;"></i><div>${seasonNum}. Sezon bölümleri getiriliyor...</div></div>`;
  if (window.lucide) window.lucide.createIcons();

  const seasonData = await fetchSeasonDetails(tvId, seasonNum);
  if (!seasonData || !seasonData.episodes || seasonData.episodes.length === 0) {
    gridContainer.innerHTML = `<div style="padding: 3rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;">Bu sezon için bölüm verisi bulunamadı.</div>`;
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

    const isLongText = rawOverview.length > 90;
    const stillUrl = getImageUrl(ep.still_path, TMDB_IMAGE_SIZES.STILL_MEDIUM);
    const airDate = ep.air_date || '';
    const runtime = ep.runtime ? `${ep.runtime} dk` : '';

    const progress = getMediaProgress(tvId, seasonNum, epNum);
    const progressPercent = progress ? progress.progressPercent : 0;
    const isCompleted = progress ? (progress.completed || progressPercent >= 90) : false;
    const isHalfway = progress && !isCompleted && progress.currentTime > 0;

    const progressHTML = progressPercent > 0 ? `
      <div class="card-progress-bar">
        <div class="card-progress-fill" style="width: ${progressPercent}%; background: ${isCompleted ? 'var(--accent-green)' : '#fbbf24'};"></div>
      </div>
    ` : '';

    let badgeStatusHTML = '';
    if (isCompleted) {
      badgeStatusHTML = `
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.5rem; left: 0.5rem; background: var(--accent-green); z-index: 4;">
          <i data-lucide="check" style="width:11px; height:11px"></i> İZLENDİ
        </span>
      `;
    } else if (isHalfway) {
      badgeStatusHTML = `
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.5rem; left: 0.5rem; background: rgba(245, 158, 11, 0.95); color: #000; font-weight: 800; z-index: 4;">
          <i data-lucide="clock" style="width:11px; height:11px"></i> YARIDA
        </span>
      `;
    } else {
      badgeStatusHTML = `
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.5rem; left: 0.5rem; background: var(--accent-green); display: none; z-index: 4;">
          <i data-lucide="check" style="width:11px; height:11px"></i> İZLENDİ
        </span>
      `;
    }

    return `
      <div class="episode-card" data-tv-id="${tvId}" data-season="${seasonNum}" data-episode="${epNum}" data-title="${epTitle}">
        <div class="episode-thumb-wrap">
          <img src="${stillUrl}" alt="${epTitle}" loading="lazy" onerror="this.onerror=null; this.src='${SINEFLIX_POSTER_FALLBACK}';" />
          <span class="episode-number-chip">${seasonNum}x${epNum < 10 ? '0' + epNum : epNum}</span>
          ${badgeStatusHTML}
          
          <div class="episode-play-overlay">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--primary-gradient); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.6);">
              <i data-lucide="play" style="width: 20px; height: 20px; fill: #fff; color: #fff; margin-left: 2px;"></i>
            </div>
          </div>

          <!-- Top Right Action Controls: Mark Watched & Halfway -->
          <div style="position: absolute; top: 0.5rem; right: 0.5rem; display: flex; gap: 0.35rem; z-index: 5;">
            <button class="btn-mark-ep-halfway" data-tv-id="${tvId}" data-season="${seasonNum}" data-episode="${epNum}" title="Yarıda Bırakıldı (20. dk)" style="width: 28px; height: 28px; border-radius: 50%; background: ${isHalfway ? '#f59e0b' : 'rgba(0,0,0,0.65)'}; border: 1px solid ${isHalfway ? '#f59e0b' : 'rgba(255,255,255,0.3)'}; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
              <i data-lucide="clock" style="width: 13px; height: 13px;"></i>
            </button>

            <button class="btn-mark-ep-watched ${isCompleted ? 'watched' : ''}" data-tv-id="${tvId}" data-season="${seasonNum}" data-episode="${epNum}" title="${isCompleted ? 'İzlendi işaretini kaldır' : 'İzlendi olarak işaretle'}" style="width: 28px; height: 28px; border-radius: 50%; background: ${isCompleted ? '#10b981' : 'rgba(0,0,0,0.65)'}; border: 1px solid ${isCompleted ? '#10b981' : 'rgba(255,255,255,0.3)'}; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
              <i data-lucide="check" style="width: 14px; height: 14px;"></i>
            </button>
          </div>

          ${progressHTML}
        </div>

        <div class="episode-info">
          <div class="episode-header-row">
            <span class="episode-title" title="${epTitle}">${epNum}. ${epTitle}</span>
            <span class="episode-duration">${runtime || airDate}</span>
          </div>
          
          <div class="episode-overview-container">
            <div class="episode-overview ${isLongText ? 'truncated' : ''}" data-full="${rawOverview}">
              ${rawOverview}
            </div>
            ${isLongText ? `
              <button class="btn-toggle-overview" style="color: var(--primary); font-weight: 700; font-size: 0.78rem; margin-top: 0.25rem; display: inline-flex; align-items: center; gap: 0.2rem; cursor: pointer; background: none; border: none; padding: 0;">
                <span>Devamını Oku</span>
                <i data-lucide="chevron-down" style="width: 12px; height: 12px;"></i>
              </button>
            ` : ''}
          </div>

          <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: auto; padding-top: 0.45rem; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06);">
            <span>${airDate}</span>
            <span class="btn-play-episode-trigger" style="color: var(--primary); font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.25rem;">
              <span>Oynat</span>
              <i data-lucide="play" style="width: 11px; height: 11px; fill: currentColor;"></i>
            </span>
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
      const overviewEl = containerEl ? containerEl.querySelector('.episode-overview') : null;
      if (!overviewEl) return;
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
          badgeEl.innerHTML = `<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ`;
          badgeEl.style.background = 'var(--accent-green)';
          badgeEl.style.color = '#fff';
          badgeEl.style.display = isNowCompleted ? 'inline-flex' : 'none';
        }
      }
      if (typeof onStatusChange === 'function') onStatusChange();
      if (window.lucide) window.lucide.createIcons();
    });
  });

  // Attach Halfway Mark button clicks
  gridContainer.querySelectorAll('.btn-mark-ep-halfway').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const epSeason = parseInt(btn.getAttribute('data-season'), 10);
      const epNumber = parseInt(btn.getAttribute('data-episode'), 10);
      const card = btn.closest('.episode-card');

      setMediaHalfway(tvId, epSeason, epNumber, 1200, {
        title: seriesTitle,
        posterPath,
        backdropPath,
        type: 'tv',
        duration: 2700
      });

      btn.style.background = '#f59e0b';
      btn.style.borderColor = '#f59e0b';

      if (card) {
        const badgeEl = card.querySelector('.badge-watched-status');
        if (badgeEl) {
          badgeEl.innerHTML = `<i data-lucide="clock" style="width:12px; height:12px"></i> YARIDA (20:00)`;
          badgeEl.style.background = 'rgba(245, 158, 11, 0.9)';
          badgeEl.style.color = '#000';
          badgeEl.style.display = 'inline-flex';
        }
      }

      showToast(`S${epSeason} B${epNumber} 20. dakikada yarıda bırakıldı olarak işaretlendi!`, 'info');
      if (window.lucide) window.lucide.createIcons();
    });
  });

  // Attach Episode Card & Play Triggers
  gridContainer.querySelectorAll('.episode-card').forEach(card => {
    const playEpisode = (e) => {
      // Don't trigger if clicked on the action buttons
      if (e && e.target && (e.target.closest('.btn-mark-ep-watched') || e.target.closest('.btn-mark-ep-halfway') || e.target.closest('.btn-toggle-overview'))) {
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
        currentTime: startTime,
        seasonsList: validSeasons,
        maxEpisodes: seasonData.episodes ? seasonData.episodes.length : 0
      });
    };

    card.addEventListener('click', playEpisode);
    
    const thumbWrapper = card.querySelector('.episode-thumb-wrap');
    if (thumbWrapper) thumbWrapper.addEventListener('click', playEpisode);

    const playTrigger = card.querySelector('.btn-play-episode-trigger');
    if (playTrigger) playTrigger.addEventListener('click', playEpisode);
  });
}
