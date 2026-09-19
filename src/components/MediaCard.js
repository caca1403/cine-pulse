import { renderIcons } from '../services/icons.js';
/* ==========================================================================
   CinePulse Studio - Media Card Component
   Ultra-sleek, borderless luxury cards with floating gold star rating badge,
   clean typography, smart type detection, and smooth responsive hover animations.
   ========================================================================== */

import { getImageUrl, TMDB_IMAGE_SIZES, SINEFLIX_POSTER_FALLBACK, hasNonLatinCharacters, fetchMediaTrailer } from '../services/tmdbApi.js';
import { getMediaProgress, getLastWatchedEpisode, formatSecondsToTime, formatRemainingTime, isRegisteredAnimeId, registerAnimeId, getUserSettings, KNOWN_ANIME_KEYWORDS as STORAGE_ANIME_KEYWORDS } from '../services/storage.js';
import { openPlayerModal } from './openPlayer.js';
import { saveAllScrollState } from '../services/scrollManager.js';
import { getBestBackdrop, prefetchBackdrops } from '../services/fanartService.js';

const KNOWN_ANIME_KEYWORDS = STORAGE_ANIME_KEYWORDS || [
  'anime', 'kimetsu', 'yaiba', 'iblis keser', 'demon slayer', 'naruto', 'boruto', 'shingeki', 'titan'
];

function escapePreviewText(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
}

function hasJapaneseCharacters(text) {
  if (!text) return false;
  return /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(text);
}

export function isAnimeItem(item) {
  if (!item) return false;
  if (item.isAnime === true || item.type === 'anime' || item.media_type === 'anime') return true;
  if (item.id && isRegisteredAnimeId(item.id)) return true;

  const genreIds = item.genre_ids || (Array.isArray(item.genres) ? item.genres.map(g => (typeof g === 'object' ? g.id : g)) : []);
  const hasAnimationGenre = genreIds.some(id => Number(id) === 16);
  const isJapanese = item.original_language === 'ja' || (Array.isArray(item.origin_country) && item.origin_country.includes('JP'));

  // 1. Animation genre + Japanese origin or language
  if (hasAnimationGenre && isJapanese) {
    if (item.id) registerAnimeId(item.id);
    return true;
  }
  if (hasAnimationGenre && (item.origin_country?.includes('JP') || item.original_language === 'ja')) {
    if (item.id) registerAnimeId(item.id);
    return true;
  }

  // 2. Japanese original language with animation or Japanese script
  if (item.original_language === 'ja' && (hasAnimationGenre || hasJapaneseCharacters(item.original_name || item.original_title || item.title || item.name))) {
    if (item.id) registerAnimeId(item.id);
    return true;
  }

  // 3. Explicit anime genre name
  if (Array.isArray(item.genres)) {
    const genreNames = item.genres.map(g => (typeof g === 'object' ? g.name : String(g))).filter(Boolean);
    if (genreNames.some(n => /anime/i.test(n))) {
      if (item.id) registerAnimeId(item.id);
      return true;
    }
  }

  // 4. Scraper IDs
  if (typeof item.id === 'string' && (item.id.startsWith('ta_') || item.id.startsWith('acx_') || item.id.startsWith('tra_'))) {
    registerAnimeId(item.id);
    return true;
  }

  // 5. Known keywords
  const rawTitle = (item.title || item.name || item.original_title || item.original_name || '').toLowerCase();
  for (const kw of KNOWN_ANIME_KEYWORDS) {
    if (rawTitle.includes(kw)) {
      if (item.id) registerAnimeId(item.id);
      return true;
    }
  }

  return false;
}


export function isSeriesItem(item) {
  if (!item) return false;
  if (
    item.first_air_date ||
    item.number_of_seasons ||
    item.episodesCount ||
    (Array.isArray(item.seasons) && item.seasons.length > 0)
  ) {
    return true;
  }
  if (item.type === 'tv' || item.media_type === 'tv') {
    return true;
  }
  if (item.type === 'movie' || item.media_type === 'movie' || (item.release_date && !item.first_air_date)) {
    return false;
  }
  return false;
}

export function determineMediaType(item) {
  if (!item) return 'movie';

  // 1. Anime Detection
  if (item.isAnime || item.type === 'anime' || isAnimeItem(item) || (item.id && isRegisteredAnimeId(item.id))) {
    return 'anime';
  }

  // 2. Documentary Detection
  if (item.type === 'documentary' || item.media_type === 'documentary') {
    return 'documentary';
  }
  const genreIds = item.genre_ids || (Array.isArray(item.genres) ? item.genres.map(g => (typeof g === 'object' ? g.id : g)) : []);
  if (genreIds.some(id => Number(id) === 99)) {
    return 'documentary';
  }

  // 3. Explicit Movie Check (Do NOT misclassify movies with progress timestamps)
  if (item.type === 'movie' || item.media_type === 'movie') {
    return 'movie';
  }

  // 4. Explicit TV Check
  if (item.type === 'tv' || item.media_type === 'tv') {
    return 'tv';
  }

  // 5. Smart Inference
  if (isSeriesItem(item)) {
    return 'tv';
  }

  return 'movie';
}

export function renderMediaCard(item, options = {}) {
  const id = item.id;
  const mediaType = determineMediaType(item);
  const isAnime = Boolean(item.isAnime || mediaType === 'anime' || isAnimeItem(item) || (item.id && isRegisteredAnimeId(item.id)));
  const isSeries = Boolean(item.isSeries !== undefined ? item.isSeries : isSeriesItem(item));
  const effectivePlayerType = isSeries ? 'tv' : 'movie';

  let rawTitle = item.title || item.name || '';
  if (!rawTitle || hasNonLatinCharacters(rawTitle)) {
    rawTitle = item.title_en || item.name_en || item.original_name || item.original_title || rawTitle || 'İsimsiz İçerik';
  }
  const title = rawTitle;
  const posterPath = item.poster_path || item.posterPath || item.poster || '';
  const backdropPath = item.backdrop_path || item.backdropPath || item.backdrop || '';
  const posterUrl = getImageUrl(posterPath, TMDB_IMAGE_SIZES.POSTER_MEDIUM);
  const backdropUrl = getImageUrl(backdropPath || posterPath, TMDB_IMAGE_SIZES.BACKDROP_LARGE);
  const usesLandscapeCards = getUserSettings().cardLayout === 'landscape';
  const cardImageUrl = usesLandscapeCards ? backdropUrl : posterUrl;
  
  // Real rating or empty
  let rawRating = item.vote_average ?? item.voteAverage ?? item.rating;
  let rating = rawRating ? Number(rawRating).toFixed(1) : '';
  if (rating === '0.0') rating = '';

  const rawDate = item.release_date || item.first_air_date || (item.year ? String(item.year) : '');
  const year = rawDate ? String(rawDate).substring(0, 4) : '';

  let progressPercent = item.progressPercent || 0;
  let season = item.season || 1;
  let episode = item.episode || 1;
  let currentTime = item.currentTime || 0;
  let isCompleted = item.completed || false;
  let isContinue = false;

  if (options.isContinueSection || (item.currentTime > 0 && !isCompleted) || (item.progressPercent > 0 && !isCompleted)) {
    isContinue = true;
  } else {
    const prog = getMediaProgress(id, season, episode);
    if (prog) {
      isCompleted = prog.completed || false;
      if (!isCompleted && prog.duration > 0 && prog.currentTime > 15) {
        progressPercent = Math.min(100, Math.round((prog.currentTime / prog.duration) * 100));
        currentTime = prog.currentTime;
        if (isSeries) {
          season = prog.season || 1;
          episode = prog.episode || 1;
        }
      }
    }
  }

  // Type Tag Labels & Styles
  let typeLabel = 'FİLM';
  let typeClass = 'type-movie';
  let detailedTypeLabel = 'Film';

  if (isAnime) {
    typeLabel = isSeries ? 'ANİME DİZİSİ' : 'ANİME FİLMİ';
    typeClass = 'type-anime';
    detailedTypeLabel = isSeries ? 'Anime Dizisi' : 'Anime Filmi';
  } else if (mediaType === 'tv' || isSeries) {
    typeLabel = 'DİZİ';
    typeClass = 'type-tv';
    detailedTypeLabel = 'Dizi';
  } else if (mediaType === 'documentary') {
    typeLabel = 'BELGESEL';
    typeClass = 'type-doc';
    detailedTypeLabel = 'Belgesel';
  }

  const originalTitle = item.original_title || item.original_name || '';
  const encodedTitle = encodeURIComponent(title);
  const encodedOrigTitle = encodeURIComponent(originalTitle);
  const encodedPoster = encodeURIComponent(posterPath || '');
  const encodedBackdrop = encodeURIComponent(backdropPath || '');
  const type = effectivePlayerType;

  return `
    <div class="media-card" 
      data-id="${id}" 
      data-type="${type}" 
      data-isanime="${isAnime ? 'true' : 'false'}"
      data-title="${encodedTitle}" 
      data-originaltitle="${encodedOrigTitle}"
      data-poster="${encodedPoster}"
      data-backdrop="${encodedBackdrop}"
      data-tmdbid="${id}"
      data-mediatype="${mediaType === 'tv' || isSeries ? 'tv' : 'movie'}"
      data-season="${season}" 
      data-episode="${episode}" 
      data-currenttime="${currentTime}"
      data-iscontinue="${isContinue ? 'true' : 'false'}"
      tabindex="0"
      role="button"
      aria-label="${title}">
      
      <div class="card-poster-wrapper">
        <img 
          src="${cardImageUrl}"
          data-poster-src="${posterUrl}"
          data-backdrop-src="${backdropUrl}"
          alt="${title}" 
          class="card-poster-img" 
          loading="lazy" 
          decoding="async"
          onerror="this.onerror=null;this.src='${SINEFLIX_POSTER_FALLBACK}'"
        />
        
        <div class="card-glass-glow"></div>

        <!-- Left Status Pill (Completed / In-Progress with actual progress) -->
        ${isCompleted ? `
          <div class="card-status-badge card-status-completed" title="Tamamlandı">
            <i data-lucide="check" style="width:10px;height:10px;stroke-width:3;"></i>
            <span>İZLENDİ</span>
          </div>
        ` : (isContinue && isSeries && (currentTime > 0 || progressPercent > 0) ? `
          <div class="card-status-badge card-status-continue" title="Kaldığın Bölüm">
            <i data-lucide="clock" style="width:10px;height:10px;"></i>
            <span>S${season} B${episode}</span>
          </div>
        ` : '')}

        <!-- Rating Pill Floating Top Right -->
        ${rating ? `
          <div class="card-rating-pill">
            <i data-lucide="star" style="width:11px;height:11px;fill:#f59e0b;stroke:#f59e0b;"></i>
            <span>${rating}</span>
          </div>
        ` : ''}

        <!-- Hover Quick Play Overlay -->
        <div class="card-hover-overlay">
          <div class="card-play-btn-circle">
            <i data-lucide="play" style="width:20px;height:20px;fill:currentColor;margin-left:2px;"></i>
          </div>
          <span class="card-hover-action-text">${isContinue ? 'İzlemeye Devam Et' : 'İncele & Oynat'}</span>
        </div>

        <!-- Progress Bar at bottom if watch in progress -->
        ${progressPercent > 0 && !isCompleted ? `
          <div class="card-progress-bar-bg">
            <div class="card-progress-bar-fill" style="width: ${progressPercent}%;"></div>
          </div>
        ` : ''}
      </div>

      <div class="card-info">
        <h3 class="card-title" title="${title}">${title}</h3>
        <div class="card-meta">
          <span class="card-type-tag ${typeClass}">${typeLabel}</span>
          ${year ? `<span class="card-year-tag">${year}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

export function attachMediaCardEvents(container) {
  if (!container || container._hasMediaEventsDelegated) return;
  container._hasMediaEventsDelegated = true;
  let suppressCardNavigationUntil = 0;

  // Upgrade backdrop images asynchronously for landscape mode (fire & forget)
  upgradeLandscapeBackdrops(container);

  container.addEventListener('click', (e) => {
    if (Date.now() < suppressCardNavigationUntil) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    // Don't trigger card navigation if delete button or other child button clicked
    if (e.target.closest('.btn-lib-delete') || e.target.closest('.btn-delete-history')) {
      return;
    }
    const card = e.target.closest('.media-card');
    if (!card) return;

    e.preventDefault();
    const id = card.getAttribute('data-id');
    const type = card.getAttribute('data-type');
    const isAnime = card.getAttribute('data-isanime') === 'true' || type === 'anime' || isRegisteredAnimeId(id);
    const season = parseInt(card.getAttribute('data-season') || '1', 10);
    const episode = parseInt(card.getAttribute('data-episode') || '1', 10);
    const currentTime = parseFloat(card.getAttribute('data-currenttime') || '0');
    const title = decodeURIComponent(card.getAttribute('data-title') || '');
    const originalTitle = decodeURIComponent(card.getAttribute('data-originaltitle') || '');
    const posterPath = card.getAttribute('data-poster') || '';
    const backdropPath = card.getAttribute('data-backdrop') || '';
    const isContinue = card.getAttribute('data-iscontinue') === 'true';

    if (isContinue && (card.closest('#continue-watching-rail') || card.closest('.continue-card-wrapper') || currentTime > 0)) {
      openPlayerModal({
        type: isAnime ? 'anime' : type,
        isAnime,
        tmdbId: id,
        title: (type === 'tv' || isAnime) ? `${title} - S${season}E${episode}` : title,
        seriesTitle: title,
        originalTitle: originalTitle || title,
        season,
        episode,
        posterPath,
        backdropPath,
        currentTime
      });
    } else {
      saveAllScrollState();
      window.location.hash = `#detail?type=${isAnime ? 'anime' : type}&id=${id}`;
    }
  });

  // Preconnect to YouTube for faster iframe loading
  if (!document.querySelector('link[rel=preconnect][href*=youtube-nocookie]')) {
    ['https://www.youtube-nocookie.com', 'https://i.ytimg.com'].forEach(origin => {
      const lnk = document.createElement('link');
      lnk.rel = 'preconnect'; lnk.href = origin; lnk.crossOrigin = 'anonymous';
      document.head.appendChild(lnk);
    });
  }

  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  const settings = getUserSettings();
  const previewsAllowed = settings.hoverPreviewsEnabled !== false && settings.trailersEnabled !== false;

  // --- Shared helper: show trailer preview popup on a card ---
  function showTrailerPreview(card, trailerPromise) {
    if (card.querySelector('.card-hover-video-preview')) return;
    let previewSoundEnabled = sessionStorage.getItem('cinepulse_preview_sound') === 'on';

    trailerPromise.then(trailer => {
      if (!trailer || !trailer.key || !trailer.key.trim()) return;
      if (!card.isConnected) return;
      // On desktop check hover is still active
      if (isFinePointer && !card.matches(':hover')) return;

      const title = decodeURIComponent(card.getAttribute('data-title') || 'Fragman');
      const typeLabel = card.querySelector('.card-type-tag')?.textContent?.trim() || '';
      const year = card.querySelector('.card-year-tag')?.textContent?.trim() || '';
      const rating = card.querySelector('.card-rating-pill span')?.textContent?.trim() || '';
      const safeKey = encodeURIComponent(trailer.key);
      const previewBox = document.createElement('div');
      previewBox.className = 'card-hover-video-preview';
      const useMobileSheet = isTouchDevice && window.innerWidth <= 700;
      if (useMobileSheet) {
        // A card-relative popover is too easy to clip behind the bottom
        // navigation on phones. Keep one compact preview sheet above it.
        document.querySelectorAll('.card-hover-video-preview').forEach(existing => {
          existing.closest?.('.media-card')?.classList.remove('preview-active');
          existing.remove();
        });
        previewBox.classList.add('is-mobile-sheet');
      }
      previewBox.innerHTML = `
        <div class="card-preview-media">
          <iframe
            src="https://www.youtube-nocookie.com/embed/${safeKey}?autoplay=1&mute=1&controls=0&disablekb=1&modestbranding=1&loop=1&playlist=${safeKey}&rel=0&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}"
            frameborder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            tabindex="-1"
            title="${escapePreviewText(title)} fragmanı">
          </iframe>
          <div class="card-preview-cinematic-shade"></div>
          <span class="card-preview-badge">FRAGMAN</span>
          ${isTouchDevice ? '<button class="card-preview-close-btn" type="button" aria-label="Kapat"><i data-lucide="x"></i></button>' : ''}
        </div>
        <div class="card-preview-details">
          <div class="card-preview-copy">
            <strong class="card-preview-title">${escapePreviewText(title)}</strong>
            <div class="card-preview-meta">
              ${rating ? `<span class="card-preview-match">${escapePreviewText(rating)} IMDb</span>` : ''}
              ${year ? `<span>${escapePreviewText(year)}</span>` : ''}
              ${typeLabel ? `<span>${escapePreviewText(typeLabel)}</span>` : ''}
            </div>
          </div>
          <div class="card-preview-actions">
            <a class="card-preview-open" href="${escapePreviewText(trailer.watchUrl || `https://www.youtube.com/watch?v=${safeKey}`)}" target="_blank" rel="noopener noreferrer" title="YouTube'da aç" aria-label="Fragmanı YouTube'da aç"><i data-lucide="external-link"></i></a>
            <button class="card-preview-sound ${previewSoundEnabled ? 'is-on' : ''}" type="button" aria-label="${previewSoundEnabled ? 'Sesi kapat' : 'Sesi aç'}" title="${previewSoundEnabled ? 'Sesi kapat' : 'Sesi aç'}">
              <i data-lucide="${previewSoundEnabled ? 'volume-2' : 'volume-x'}"></i>
            </button>
          </div>
        </div>
      `;
      if (!useMobileSheet) {
        const rect = card.getBoundingClientRect();
        const edgeTop = window.innerHeight < 520 ? 12 : 76;
        const idealPreviewWidth = Math.min(460, Math.max(390, rect.width * 2.2), window.innerWidth - 32);
        const maxWidthByHeight = Math.max(240, ((window.innerHeight - edgeTop - 94) * 16) / 9);
        const previewWidth = Math.max(240, Math.min(idealPreviewWidth, maxWidthByHeight));
        const previewHeight = (previewWidth * 9 / 16) + 82;
        const left = Math.max(16, Math.min(window.innerWidth - previewWidth - 16, rect.left + (rect.width - previewWidth) / 2));
        const top = Math.max(edgeTop, Math.min(window.innerHeight - previewHeight - 12, rect.top + (rect.height - previewHeight) / 2));
        previewBox.style.left = `${left}px`;
        previewBox.style.top = `${top}px`;
        previewBox.style.width = `${previewWidth}px`;
      }
      card.classList.add('preview-active');
      card.appendChild(previewBox);
      renderIcons();

      const iframe = previewBox.querySelector('iframe');
      // Preview actions must not trigger the card's normal detail navigation.
      previewBox.addEventListener('click', event => event.stopPropagation());
      previewBox.addEventListener('touchend', event => event.stopPropagation(), { passive: true });

      const soundBtn = previewBox.querySelector('.card-preview-sound');
      const closeBtn = previewBox.querySelector('.card-preview-close-btn');
      const sendPlayerCommand = (command, args = []) => {
        iframe?.contentWindow?.postMessage(JSON.stringify({
          event: 'command', func: command, args
        }), '*');
      };
      const applySoundState = () => {
        sendPlayerCommand(previewSoundEnabled ? 'unMute' : 'mute');
        if (previewSoundEnabled) sendPlayerCommand('setVolume', [75]);
        soundBtn.classList.toggle('is-on', previewSoundEnabled);
        soundBtn.title = previewSoundEnabled ? 'Sesi kapat' : 'Sesi aç';
        soundBtn.setAttribute('aria-label', soundBtn.title);
        soundBtn.innerHTML = `<i data-lucide="${previewSoundEnabled ? 'volume-2' : 'volume-x'}"></i>`;
        renderIcons();
      };
      const removePreview = () => {
        try { previewBox.remove(); } catch (_) {}
        card.classList.remove('preview-active');
      };
      // YouTube cross-origin iframes often skip the 'load' event — force show after 1.5s
      const forceShowTimer = window.setTimeout(() => {
        previewBox.classList.add('video-ready');
      }, 1500);
      iframe.addEventListener('load', () => {
        window.clearTimeout(forceShowTimer);
        previewBox.classList.add('video-ready');
        if (previewSoundEnabled) window.setTimeout(applySoundState, 180);
      }, { once: true });
      soundBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        previewSoundEnabled = !previewSoundEnabled;
        sessionStorage.setItem('cinepulse_preview_sound', previewSoundEnabled ? 'on' : 'off');
        applySoundState();
        window.setTimeout(applySoundState, 180);
      });
      if (closeBtn) {
        closeBtn.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          removePreview();
        });
      }
    }).catch(() => {});
  }

  // --- Desktop: hover pointer device ---
  if (isFinePointer && previewsAllowed) {
    const hoverTimers = new WeakMap();

    container.addEventListener('pointerover', (e) => {
      const card = e.target.closest('.media-card');
      if (!card) return;
      if (e.relatedTarget && card.contains(e.relatedTarget)) return;

      // Pre-fetch trailer immediately on hover intent
      const id = card.getAttribute('data-id');
      const type = card.getAttribute('data-type') || 'movie';
      const trailerPromise = fetchMediaTrailer(type === 'tv' ? 'tv' : 'movie', id);
      // Reduced from 600ms → 350ms for snappier response
      const timer = setTimeout(() => showTrailerPreview(card, trailerPromise), 350);
      hoverTimers.set(card, timer);
    });

    container.addEventListener('pointerout', (e) => {
      const card = e.target.closest('.media-card');
      if (!card) return;
      if (e.relatedTarget && card.contains(e.relatedTarget)) return;
      const timer = hoverTimers.get(card);
      if (timer) clearTimeout(timer);
      hoverTimers.delete(card);
      const preview = card.querySelector('.card-hover-video-preview');
      if (preview) {
        try { preview.remove(); } catch (_) {}
      }
      card.classList.remove('preview-active');
    });
  }

  // --- Mobile: long-press on card to show trailer preview ---
  if (isTouchDevice && previewsAllowed) {
    const LONG_PRESS_MS = 600;
    const touchSessions = new WeakMap();

    container.addEventListener('touchstart', (e) => {
      if (e.target.closest('.card-hover-video-preview')) return;
      const card = e.target.closest('.media-card');
      if (!card) return;
      const session = { opened: false, timer: null };
      const id = card.getAttribute('data-id');
      const type = card.getAttribute('data-type') || 'movie';
      const trailerPromise = fetchMediaTrailer(type === 'tv' ? 'tv' : 'movie', id);
      session.timer = setTimeout(() => {
        session.timer = null;
        session.opened = true;
        suppressCardNavigationUntil = Date.now() + 900;
        try { navigator.vibrate?.(40); } catch (_) {}
        showTrailerPreview(card, trailerPromise);
      }, LONG_PRESS_MS);
      touchSessions.set(card, session);
    }, { passive: true });

    const cancelLongPress = (e) => {
      const card = e.target.closest('.media-card');
      const session = card && touchSessions.get(card);
      if (!session) return;
      if (session.timer) clearTimeout(session.timer);
      session.timer = null;
      // Releasing the same finger that opened a preview is not a dismissal.
      // The previous handler removed the sheet immediately, so it stayed muted
      // and the user could neither see its close button nor enable audio.
      if (!session.opened || e.type !== 'touchend') touchSessions.delete(card);
    };
    container.addEventListener('touchend', cancelLongPress, { passive: true });
    container.addEventListener('touchmove', cancelLongPress, { passive: true });
    container.addEventListener('touchcancel', cancelLongPress, { passive: true });

    // Mobile preview is persistent once opened: only its visible × button
    // dismisses it. This leaves enough time to enable sound or use YouTube.
    // A new long press still replaces an older preview in showTrailerPreview.
    container.addEventListener('touchend', (e) => {
      const card = e.target.closest('.media-card');
      const session = card && touchSessions.get(card);
      if (session?.opened) touchSessions.delete(card);
    }, { passive: true });
  }
}

/**
 * Upgrades landscape card backdrop images with best-quality versions from TMDB images API.
 * Call after rendering a list of cards in landscape mode.
 * Uses smooth fade-in transition when upgrading images.
 * 
 * @param {HTMLElement} [container=document] - Container to search for cards in
 */
export async function upgradeLandscapeBackdrops(container = document) {
  const isLandscape = getUserSettings().cardLayout === 'landscape';
  if (!isLandscape) return;

  const cards = container.querySelectorAll('.media-card[data-tmdbid]');
  if (!cards.length) return;

  const BATCH_SIZE = 6; // Process N cards at a time
  const cardArray = Array.from(cards);

  for (let i = 0; i < cardArray.length; i += BATCH_SIZE) {
    const batch = cardArray.slice(i, i + BATCH_SIZE);

    await Promise.allSettled(batch.map(async (card) => {
      const tmdbId = card.dataset.tmdbid;
      const mediaType = card.dataset.mediatype || 'movie';
      if (!tmdbId) return;

      const img = card.querySelector('.card-poster-img');
      if (!img) return;

      try {
        const bestUrl = await getBestBackdrop(tmdbId, mediaType);
        if (!bestUrl || bestUrl === img.src) return;

        // Smooth swap: preload first
        const preloader = new Image();
        preloader.onload = () => {
          // Only apply if still in landscape mode and card still exists
          if (!document.documentElement.classList.contains('cards-landscape')) return;
          if (!card.isConnected) return;

          img.style.transition = 'opacity 0.3s ease';
          img.style.opacity = '0';
          setTimeout(() => {
            img.src = bestUrl;
            img.dataset.backdropSrc = bestUrl;
            img.style.opacity = '1';
          }, 150);
        };
        preloader.src = bestUrl;
      } catch (_) {}
    }));

    // Small pause between batches to avoid overwhelming the browser
    if (i + BATCH_SIZE < cardArray.length) {
      await new Promise(r => setTimeout(r, 100));
    }
  }
}
