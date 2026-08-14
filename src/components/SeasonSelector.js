/* ==========================================================================
   SineFlix Pro - Season & Episode Selector Component
   Renders season tabs and episode cards with REAL TMDB overviews & interactive 'Devamını Oku (...)' expansion
   ========================================================================== */

import { fetchSeasonDetails, getImageUrl, TMDB_IMAGE_SIZES, SINEFLIX_POSTER_FALLBACK } from '../services/tmdbApi.js';
import { getMediaProgress } from '../services/storage.js';
import { openPlayerModal } from './PlayerModal.js';

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
      
      loadSeasonEpisodes(tvId, seriesTitle, seriesOverview, activeSeasonNumber, container, posterPath, backdropPath);

      container.querySelectorAll('.season-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          container.querySelectorAll('.season-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const seasonNum = parseInt(btn.getAttribute('data-season'), 10);
          loadSeasonEpisodes(tvId, seriesTitle, seriesOverview, seasonNum, container, posterPath, backdropPath);
        });
      });
    }
  };
}

async function loadSeasonEpisodes(tvId, seriesTitle, seriesOverview, seasonNum, container, posterPath = '', backdropPath = '') {
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
      <span class="badge badge-primary" style="position: absolute; top: 0.5rem; left: 0.5rem; background: var(--accent-green);">
        <i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ
      </span>
    ` : '';

    return `
      <div class="episode-card" data-tv-id="${tvId}" data-season="${seasonNum}" data-episode="${epNum}" data-title="${epTitle}">
        <div class="episode-thumb-wrapper">
          <img class="episode-thumb" src="${stillUrl}" alt="${epTitle}" loading="lazy" onerror="this.onerror=null; this.src='${SINEFLIX_POSTER_FALLBACK}';" />
          <span class="episode-number-badge">${seasonNum}x${epNum < 10 ? '0' + epNum : epNum}</span>
          ${badgeStatusHTML}
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

  // Attach Episode Card Play Click
  gridContainer.querySelectorAll('.episode-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
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
        originalTitle,
        season,
        episode,
        posterPath,
        backdropPath,
        currentTime: startTime
      });
    });
  });
}
