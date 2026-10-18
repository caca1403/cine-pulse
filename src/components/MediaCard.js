import { renderIcons } from '../services/kabuk/icons.js';
/* ==========================================================================
   CinePulse Studio - Media Card Component
   Ultra-sleek, borderless luxury cards with floating gold star rating badge,
   clean typography, smart type detection, and smooth responsive hover animations.
   ========================================================================== */

import { getImageUrl, TMDB_IMAGE_SIZES, SINEFLIX_POSTER_FALLBACK, hasNonLatinCharacters, fetchMediaTrailer } from '../services/icerik/tmdbApi.js';
import { getMediaProgress, getLastWatchedEpisode, formatSecondsToTime, formatRemainingTime, isRegisteredAnimeId, registerAnimeId, getUserSettings, KNOWN_ANIME_KEYWORDS as STORAGE_ANIME_KEYWORDS } from '../services/altyapi/storage.js';
import { openPlayerModal } from './openPlayer.js';
import { showToast } from './Toast.js';
import { saveAllScrollState } from '../services/kabuk/scrollManager.js';
import { getBestBackdrop, baslikLogosu } from '../services/icerik/fanartService.js';

const KNOWN_ANIME_KEYWORDS = STORAGE_ANIME_KEYWORDS || [
  'anime', 'kimetsu', 'yaiba', 'iblis keser', 'demon slayer', 'naruto', 'boruto', 'shingeki', 'titan'
];

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
  const fallbackLandscapeUrl = backdropPath
    ? getImageUrl(backdropPath, TMDB_IMAGE_SIZES.BACKDROP_LARGE)
    : posterUrl;
  const settings = getUserSettings();
  const usesLandscapeCards = settings.cardLayout === 'landscape';
  const cardImageUrl = usesLandscapeCards ? fallbackLandscapeUrl : posterUrl;
  
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
    const prog = options.skipProgressLookup ? null : getMediaProgress(id, season, episode);
    if (prog) {
      isCompleted = prog.completed || false;
      if (!isCompleted && prog.duration > 0 && prog.currentTime > 15) {
        isContinue = true;
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

  // İzleme durumu (izlendi / devam ediyor) artık ayrı bir tam-genişlik şeritte
  // değil; meta satırında tek bir kompakt rozet. Kart bu yüzden daha kısa ve
  // derli toplu durur (tasarım v3).
  let durumRozeti = '';
  if (isCompleted) {
    durumRozeti = '<span class="card-status-chip card-status-chip--done">✓ İzlendi</span>';
  } else if (isContinue && isSeries) {
    durumRozeti = `<span class="card-status-chip card-status-chip--continue">▶ S${season}B${episode}</span>`;
  } else if (isContinue && progressPercent > 0) {
    durumRozeti = `<span class="card-status-chip card-status-chip--continue">▶ %${progressPercent}</span>`;
  }

  return `
    <div class="media-card" 
      data-id="${id}" 
      data-type="${type}" 
      data-isanime="${isAnime ? 'true' : 'false'}"
      data-title="${encodedTitle}" 
      data-originaltitle="${encodedOrigTitle}"
      data-poster="${encodedPoster}"
      data-backdrop="${encodedBackdrop}"
      data-overview="${encodeURIComponent(item.overview || '')}"
      data-year="${year}"
      data-rating="${rating}"
      data-tmdbid="${id}"
      data-mediatype="${mediaType === 'tv' || isSeries ? 'tv' : 'movie'}"
      data-isseries="${isSeries ? 'true' : 'false'}"
      data-season="${season}" 
      data-episode="${episode}" 
      data-currenttime="${currentTime}"
      data-iscontinue="${isContinue ? 'true' : 'false'}"
      tabindex="0"
      role="button"
      aria-label="${title}">
      
      <div class="card-poster-wrapper ${!backdropPath ? 'card-fanart-portrait-fallback' : ''}">
        <img 
          src="${cardImageUrl}"
          data-poster-src="${posterUrl}"
          data-backdrop-src="${fallbackLandscapeUrl}"
          alt="${title}" 
          class="card-poster-img" 
          loading="lazy" 
          decoding="async"
          onerror="this.onerror=null;this.src='${SINEFLIX_POSTER_FALLBACK}'"
        />
        
        <div class="card-glass-glow"></div>

        <!-- Hover Quick Play Overlay (yalnız masaüstünde görünür — CSS'te kapı) -->
        <div class="card-hover-overlay">
          <div class="card-play-btn-circle">
            <i data-lucide="play" style="width:20px;height:20px;fill:currentColor;margin-left:2px;"></i>
          </div>
          <span class="card-hover-action-text">${isContinue ? 'Devam Et' : 'İzle'}</span>
        </div>

        <!-- Alt gradyan: AFİŞ TEMİZ KALIR, üzerine hiçbir metin/logo basılmaz.
             Başlık ve bilgi, afişin ALTINDAKİ şeritte yaşar (kart tasarımı v2). -->
        <div class="card-bottom-cinematic-overlay" aria-hidden="true"></div>

        <!-- Progress Bar at bottom if watch in progress -->
        ${progressPercent > 0 && !isCompleted ? `
          <div class="card-progress-bar-bg">
            <div class="card-progress-bar-fill" style="width: ${progressPercent}%;"></div>
          </div>
        ` : ''}
      </div>

      <!-- Kart bilgi şeridi (v3): afişin ALTINDA tek ve derli toplu blok.
           Sıra → özel başlık logosu (varsa) → içeriğin adı (logo yoksa
           stilize "logotype") → tek satırda tür · yıl · izleme durumu ve
           sağa yaslı puan. Afişin üzerine hiçbir metin basılmaz. -->
      <div class="card-info">
        <img class="card-title-logo" alt="" aria-hidden="true" hidden />
        <h3 class="card-title" title="${title}">${title}</h3>
        <div class="card-meta">
          <span class="card-type-tag ${typeClass}">${detailedTypeLabel}</span>
          ${year ? `<span class="card-year-tag">${year}</span>` : ''}
          ${durumRozeti}
          ${rating ? `<span class="card-rating-inline" title="Puan">${rating}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

export function attachMediaCardEvents(container) {
  if (!container) return;
  // Özel başlık logoları: olay bagimlisi degil, her kart ekleme cagrisinda
  // yenilerini gozler (idempotent — gozlenen kart iki kez gozlenmez).
  kartLogolariBagla(container);
  // Card artwork is supplied by the primary TMDB response. Avoid issuing a
  // second artwork/logo lookup for every card in the home rails.
  if (container._hasMediaEventsDelegated) return;
  container._hasMediaEventsDelegated = true;
  let suppressCardNavigationUntil = 0;

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
    const isSeriesAttr = card.getAttribute('data-isseries');
    const mediaTypeAttr = card.getAttribute('data-mediatype');

    const isSeriesCard = isSeriesAttr !== null
      ? isSeriesAttr === 'true'
      : (mediaTypeAttr === 'tv' || type === 'tv');

  if (isContinue) {
      (async () => {
        try {
          await openPlayerModal({
            type: isAnime ? 'anime' : (isSeriesCard ? 'tv' : 'movie'),
            isAnime,
            isSeries: isSeriesCard,
            tmdbId: id,
            title: isSeriesCard ? `${title} - S${season}E${episode}` : title,
            seriesTitle: title,
            originalTitle: originalTitle || title,
            season: isSeriesCard ? season : undefined,
            episode: isSeriesCard ? episode : undefined,
            posterPath,
            backdropPath,
            currentTime
          });
        } catch (err) {
          console.error('[MediaCard] Devam et oynatılamadı:', err);
          showToast('İçerik açılırken bir sorun oluştu, lütfen tekrar deneyin.', 'error');
        }
      })();
    } else {
      saveAllScrollState();
      window.location.hash = `#detail?type=${isAnime ? 'anime' : type}&id=${id}`;
    }
  });

  /* ── CP-QUALITY-PACK: fragman önizlemesi tetikleyicileri ────────────────
     İmleç aygıtında hover (600 ms), dokunmatikte uzun basış (500 ms).
     Her iki tetik de kapalıyken kart tıklaması eski davranışında çalışır. */
  if (imlecAygiti()) {
    container.addEventListener('pointerover', (e) => {
      const kart = e.target.closest && e.target.closest('.media-card');
      if (!kart || hoverKart === kart) return;
      hoverKart = kart;
      if (hoverTimer) clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        hoverTimer = null;
        onizlemeGoster(kart, false);
      }, ONIZLEME.hoverGecikmeMs);
    });
    container.addEventListener('pointerout', (e) => {
      const kart = e.target.closest && e.target.closest('.media-card');
      if (!kart) return;
      if (e.relatedTarget && kart.contains(e.relatedTarget)) return; // kart içi gezinme
      if (hoverKart === kart) hoverKart = null;
      if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null; }
      if (aktifOnizleme && aktifOnizleme.kart === kart) ayrilmaZamanla();
    });
  }
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    const hedef = e.target;
    const kart = hedef.closest && hedef.closest('.media-card');
    if (!kart || (hedef.closest && hedef.closest('button'))) return;
    const p = e.touches[0];
    uzunBasisNokta = { x: p.clientX, y: p.clientY };
    if (uzunBasisTimer) clearTimeout(uzunBasisTimer);
    uzunBasisTimer = setTimeout(() => {
      uzunBasisTimer = null;
      tiklamaYutmaBitis = Date.now() + 700; // parmak kalkınca kart detaya gitmesin
      try { if (navigator.vibrate) navigator.vibrate(8); } catch (_) { /* destek yoksa sessiz */ }
      onizlemeGoster(kart, true);
    }, ONIZLEME.uzunBasisMs);
  }, { passive: true });
  const uzunBasisIptal = () => {
    if (uzunBasisTimer) { clearTimeout(uzunBasisTimer); uzunBasisTimer = null; }
    uzunBasisNokta = null;
  };
  container.addEventListener('touchmove', (e) => {
    if (!uzunBasisTimer || !uzunBasisNokta) return;
    const p = e.touches[0];
    if (Math.abs(p.clientX - uzunBasisNokta.x) > 12 || Math.abs(p.clientY - uzunBasisNokta.y) > 12) {
      uzunBasisIptal();
    }
  }, { passive: true });
  container.addEventListener('touchend', uzunBasisIptal, { passive: true });
  container.addEventListener('touchcancel', uzunBasisIptal, { passive: true });
  // Uzun basış sürerken Android bağlam menüsü önizlemeyi bozmasın.
  container.addEventListener('contextmenu', (e) => {
    if (uzunBasisTimer && e.target.closest && e.target.closest('.media-card')) e.preventDefault();
  });

}

let fanartObserver = null;

function getFanartObserver() {
  if (fanartObserver) return fanartObserver;
  if (!('IntersectionObserver' in window)) return null;
  fanartObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      fanartObserver.unobserve(entry.target);
      loadLandscapeArtwork(entry.target);
    });
  }, { rootMargin: '150px 0px' });
  return fanartObserver;
}

async function loadLandscapeArtwork(card) {
  if (!card || card.dataset.fanartState === 'loaded' || card.dataset.fanartState === 'loading') return;
  card.dataset.fanartState = 'loading';
  const img = card.querySelector('.card-poster-img');
  if (!img) return;

  try {
    const artwork = await getBestBackdrop(card.dataset.tmdbid, card.dataset.mediatype || 'movie');
    if (!card.isConnected) return;

    if (!artwork?.image && !artwork?.logo) {
      card.dataset.fanartState = 'empty';
      return;
    }

    if (artwork.image) {
      img.dataset.backdropSrc = artwork.image;
      const isLandscape = getUserSettings().cardLayout === 'landscape' || document.documentElement.classList.contains('cards-landscape');
      if (isLandscape) {
        img.src = artwork.image;
      }
    }
    // Afise icerik LOGOSU da konmaz: ozel baslik yalniz hero/detayda.

    card.dataset.fanartState = 'loaded';
  } catch (_) {
    card.dataset.fanartState = 'empty';
  }
}

/* ── Özel tasarımlı içerik başlığı (kart) ─────────────────────────────────
   Kartlarda afişin üstüne başlık YAZILMAZ; bunun yerine içeriğin resmi
   saydam logosu (TMDB → Fanart.tv) afişin altındaki gradyan scrime oturur.
   Ağır olmasın diye: yalnız görünen kartlar yüklenir, sonuç önbellekten gelir
   (getBestBackdrop localStorage + bellek önbelleği), tekrar tekrar istek atılmaz. */

let logoGozlemcisi = null;

function logoGozlemcisiniAl() {
  if (logoGozlemcisi) return logoGozlemcisi;
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return null;
  logoGozlemcisi = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const kart = entry.target;
      logoGozlemcisi.unobserve(kart);
      Promise.resolve(kartLogosunuYukle(kart)).then(() => {
        // Kullanıcı isteği: "yana kaydırdıkça kendini güncellesin". Logo
        // bulunamayan kart, kullanıcı rafta geri geldiğinde yeniden denenir
        // (isimle eşleştirme ikinci turda farklı sonuç verebilir). Sınırsız
        // deneme TMDB anahtarını 429'a sokardı: en fazla 2 ek deneme.
        const deneme = Number(kart.dataset.logoDeneme || '0');
        if (!kart.isConnected || kart.dataset.logoState !== 'bos' || deneme >= 2) return;
        kart.dataset.logoDeneme = String(deneme + 1);
        setTimeout(() => {
          if (kart.isConnected) logoGozlemcisi.observe(kart);
        }, 5000);
      });
    });
  },
  /* ÖLÇÜLEN DARBOĞAZ (2026-10-17): `900px 0px` yalnız DİKEY genişletiyordu.
     Yatay raflarda ekranın sağında duran kartlar kapsama alanına hiç
     girmiyordu → "logolar ana kartlarda görünmüyor". 1200×1200 ile hem
     birkaç ekran alttaki hem de rafın sağındaki kartlar önceden yüklenir.
     Daha geniş bir alan (1400×1800) DENENDİ ve yanlış çıktı: yüzlerce kart
     birden kuyruğa girip GÖRÜNEN kartın logosunu geciktiriyordu. Sınır:
     görünene yakın olanlar. */
  { rootMargin: '1200px 1200px' });
  return logoGozlemcisi;
}

/* Tek başlatma kilidi: dikey (viewport köklü) ve yatay (raf köklü) iki
   gözlemci aynı karta aynı anda dokunursa LOGO isteği iki kez atmasın.
   Yükleme bitince kilit açılır; mevcut 5 sn'lik yeniden deneme akışı bu
   sayede tekrar çalışabilir. */
const logoIstekleri = new WeakSet();

function kartLogosunuYukle(kart) {
  if (logoIstekleri.has(kart)) return Promise.resolve();
  logoIstekleri.add(kart);
  return Promise.resolve(kartLogosunuIc(kart)).finally(() => logoIstekleri.delete(kart));
}

async function kartLogosunuIc(kart) {
  const hedef = kart.querySelector('.card-title-logo');
  if (!hedef) {
    kart.dataset.logoState = 'yiksiz';
    return;
  }
  try {
    const coz = (deger) => {
      try { return decodeURIComponent(deger || ''); } catch (_) { return deger || ''; }
    };
    // İçeriğin adı da verilir: id altında saydam logo yoksa aynı yapımın başka
    // kaydından logo bulunur (kullanıcı isteği: "isimle eşleştir").
    const logo = await baslikLogosu(
      kart.dataset.tmdbid,
      kart.dataset.mediatype === 'tv' ? 'tv' : 'movie',
      [coz(kart.getAttribute('data-title')), coz(kart.getAttribute('data-originaltitle'))]
    );
    if (!logo || !kart.isConnected) {
      kart.dataset.logoState = 'bos';
      return;
    }
    hedef.addEventListener('load', () => {
      // Boyutu 0 olan (bozuk/SVG) yüklemeler afişi bozmasın: yazı düzeni kalır.
      if (!hedef.isConnected || !hedef.naturalWidth) return;
      hedef.hidden = false;
      kart.classList.add('card--title-logo');
      kart.dataset.logoState = 'yuklendi';
    }, { once: true });
    // Bozuk/404 logo: kart logosuz KALMAZ — adıyla eşleşen stilize başlık
    // (logotype) görünür kalır. Yeni içeriklerde isimle eşleşme daha doğru
    // sonuç verir, çünkü elde her zaman içeriğin kendi adı vardır.
    hedef.addEventListener('error', () => {
      hedef.hidden = true;
      kart.classList.remove('card--title-logo');
      kart.dataset.logoState = 'bos';
    }, { once: true });
    hedef.src = logo;
    kart.dataset.logoState = 'yukleniyor';
  } catch (_) {
    kart.dataset.logoState = 'bos';
  }
}

/** Bir kapsayıcıdaki kartlara özel başlık logolarını bağlar (idempotent). */
export function kartLogolariBagla(container = document) {
  const gozlemci = logoGozlemcisiniAl();
  if (!gozlemci) return;
  const kok = container && container.querySelectorAll ? container : document;
  const kartlar = kok.querySelectorAll('.media-card[data-tmdbid]:not([data-logo-state])');
  kartlar.forEach(kart => {
    kart.dataset.logoState = 'bekliyor';
    gozlemci.observe(kart);
    // Cihaz ölçümü (apk40): kökü viewport olan gözlemci, overflow-x rafının
    // sağa taşırdığı kartları asla "kesişiyor" saymıyor → kart sonsuza dek
    // "bekliyor" kalıyordu. Yatay kaydırılabilir atası varsa kökü o raf olan
    // ikinci bir gözlemci daha bağlanır; çift isteği logoIstekleri kilidi önler.
    const raf = yatayKaydiranAtaBul(kart);
    if (raf) {
      const yatayGozlemci = yatayLogoGozlemcisiAl(raf);
      if (yatayGozlemci) yatayGozlemci.observe(kart);
    }
  });
}

/* ── Raf içi (YATAY) logo gözlemcisi (CP-QUALITY-PACK) ──────────────────────
   - Her raf için en fazla bir gözlemci (WeakMap); kadro başı iş yok.
   - Dikey gözlemci AYNEN durur; aynı kart iki gözlemciden gelse bile
     logoIstekleri kilidi sayesinde tek istek atılır.
   - Yüklendi/artık denenecek tur kalmadı → unobserve (dikey ile tutarlı).
   - Sonsuz raf: MutationObserver yalnız o rafın childList'ini izler.
   - IntersectionObserver yoksa (çok eski WebView) sessizce hiçbir şey olmaz. */
const yatayLogoGozlemcileri = new WeakMap(); // raf → IntersectionObserver
const yatayLogoMutasyonlari = new WeakMap(); // raf → MutationObserver

function yatayKaydiranAtaBul(kart) {
  let el = kart.parentElement;
  while (el && el !== document.body) {
    if (el.classList && el.classList.contains('card-rail')) return el;
    try {
      const ovx = window.getComputedStyle(el).overflowX;
      if (ovx === 'auto' || ovx === 'scroll') return el;
    } catch (_) {
      return null;
    }
    el = el.parentElement;
  }
  return null;
}

function yatayLogoGozlemcisiAl(raf) {
  const mevcut = yatayLogoGozlemcileri.get(raf);
  if (mevcut) return mevcut;
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return null;
  const gozlemci = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const kart = entry.target;
      if (!kart.isConnected || logoIstekleri.has(kart)) return; // başka bir gözlemci yüklemeyi zaten yürütüyor
      if (kart.dataset.logoState === 'yuklendi' || kart.dataset.logoState === 'yiksiz' || kart.dataset.logoState === 'yukleniyor') {
        gozlemci.unobserve(kart);
        return;
      }
      Promise.resolve(kartLogosunuYukle(kart)).then(() => {
        // Yalnız "boş" sonuç yeniden deneme gerektirir; ortak sayaç (en fazla
        // 2 ek deneme) TMDB anahtarını 429'a sokmaz. Dikey davranışla aynı.
        if (!kart.isConnected || kart.dataset.logoState !== 'bos') { gozlemci.unobserve(kart); return; }
        const deneme = Number(kart.dataset.logoDeneme || '0');
        if (deneme >= 2) { gozlemci.unobserve(kart); return; }
        kart.dataset.logoDeneme = String(deneme + 1);
        setTimeout(() => { if (kart.isConnected) gozlemci.observe(kart); }, 5000);
      });
    });
  }, { root: raf, rootMargin: '0px 900px 0px 900px' }); // rafın sağına/soluna 900px önden yükleme
  yatayLogoGozlemcileri.set(raf, gozlemci);

  // Sonsuz raf: loadMore ile sonradan eklenen kartlar da iki gözlemciye
  // bağlanır. Yalnız bu rafın childList'i izlenir (kadro başı iş yoktur;
  // geri çağırmada DOM sorgusu sadece gerçekten kart eklendiyse yapılır).
  if ('MutationObserver' in window) {
    const mutasyon = new MutationObserver(kayitlar => {
      let kartEklendi = false;
      for (const kayit of kayitlar) {
        for (const dugum of kayit.addedNodes) {
          if (dugum.nodeType !== 1) continue;
          if ((dugum.matches && dugum.matches('.media-card[data-tmdbid]'))
            || (dugum.querySelector && dugum.querySelector('.media-card[data-tmdbid]'))) {
            kartEklendi = true;
            break;
          }
        }
        if (kartEklendi) break;
      }
      if (!kartEklendi) return;
      const dikey = logoGozlemcisiniAl();
      raf.querySelectorAll('.media-card[data-tmdbid]:not([data-logo-state])').forEach(kart => {
        kart.dataset.logoState = 'bekliyor';
        if (dikey) dikey.observe(kart);
        gozlemci.observe(kart);
      });
    });
    mutasyon.observe(raf, { childList: true });
    yatayLogoMutasyonlari.set(raf, mutasyon);
  }
  return gozlemci;
}

export function upgradeLandscapeBackdrops(container = document, forceImmediate = false) {
  const isLandscape = getUserSettings().cardLayout === 'landscape' || document.documentElement.classList.contains('cards-landscape');
  if (!isLandscape) return;

  const root = (container && container.querySelectorAll) ? container : document;
  const cards = root.querySelectorAll('.media-card[data-tmdbid]:not([data-fanart-state="loaded"])');
  if (!cards.length) return;

  if (forceImmediate) {
    cards.forEach(card => loadLandscapeArtwork(card));
    return;
  }

  const observer = getFanartObserver();
  if (!observer) {
    cards.forEach(card => loadLandscapeArtwork(card));
    return;
  }
  cards.forEach(card => observer.observe(card));
}

/* ── Kart fragman önizlemesi (CP-QUALITY-PACK) ─────────────────────────────
   Masaüstü (gerçek imleç): 600 ms hover → kartın yanında susturulmuş fragman.
   Dokunmatik: 500 ms uzun basış → ekran ortasında yüzen önizleme, ~2,5 sn
   sonra kendini kapatır. CSS iskeleti main.css'te zaten var olan
   .card-hover-video-preview ailesidir; DOM ona göre kurulur.
   Tek seferde tek önizleme; fragman/ağ yoksa sessizce çıkılır. */
const ONIZLEME = {
  hoverGecikmeMs: 600,
  uzunBasisMs: 500,
  mobilKapanmaMs: 2500,
  masaustuMaksMs: 12000,
  ayrilmaGecikmeMs: 300
};

let aktifOnizleme = null;        // { el, kart, timer }
let onizlemeKusak = 0;           // bayat async fragman sonucu koruması
let onizlemeGenelBaglandi = false;
let tiklamaYutmaBitis = 0;       // uzun basış bitiminde doğan dokunmayı yut
let hoverTimer = null;
let hoverKart = null;
let uzunBasisTimer = null;
let uzunBasisNokta = null;
let ayrilmaTimer = null;

const imlecAygiti = () => Boolean(
  window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches
);

function ayrilmaIptal() {
  if (ayrilmaTimer) { clearTimeout(ayrilmaTimer); ayrilmaTimer = null; }
  if (aktifOnizleme && aktifOnizleme.timer) { clearTimeout(aktifOnizleme.timer); aktifOnizleme.timer = null; }
}

function ayrilmaZamanla() {
  if (ayrilmaTimer) clearTimeout(ayrilmaTimer);
  ayrilmaTimer = setTimeout(onizlemeKapat, ONIZLEME.ayrilmaGecikmeMs);
}

function onizlemeKapat() {
  if (ayrilmaTimer) { clearTimeout(ayrilmaTimer); ayrilmaTimer = null; }
  if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null; }
  if (!aktifOnizleme) return;
  if (aktifOnizleme.timer) clearTimeout(aktifOnizleme.timer);
  aktifOnizleme.kart.classList.remove('preview-active');
  aktifOnizleme.el.remove();
  aktifOnizleme = null;
}

/** Rota değişiminde main.js çağırır: iframe ve kart sınıfı temizlenir. */
export function closeCardPreview() {
  if (uzunBasisTimer) { clearTimeout(uzunBasisTimer); uzunBasisTimer = null; }
  hoverKart = null;
  uzunBasisNokta = null;
  onizlemeKapat();
}

function onizlemeGenelDinleyiciler() {
  if (onizlemeGenelBaglandi) return;
  onizlemeGenelBaglandi = true;
  // Sayfa/raf kaydırma ve yeniden boyutlanma önizlemeyi düşürür (Netflix davranışı).
  window.addEventListener('scroll', () => onizlemeKapat(), { capture: true, passive: true });
  window.addEventListener('resize', () => onizlemeKapat(), { passive: true });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') onizlemeKapat(); });
  // Uzun basıştan sonra parmak kalktığında üretilen dokunma kartı detaya
  // götürmesin: capture aşamasında yakalanıp yutulur.
  document.addEventListener('click', (e) => {
    if (Date.now() < tiklamaYutmaBitis) {
      e.stopPropagation();
      e.preventDefault();
    }
  }, true);
}

async function onizlemeGoster(kart, mobil) {
  const id = kart.getAttribute('data-id');
  const tip = kart.getAttribute('data-mediatype') === 'tv' ? 'tv' : 'movie';
  if (!/^\d+$/.test(String(id))) return;          // yalnız TMDB id'leri; scraper id'lerinde TMDB videosu yok
  if (aktifOnizleme && aktifOnizleme.kart === kart) return;
  onizlemeKapat();
  const kusak = ++onizlemeKusak;

  let trailer = null;
  try {
    trailer = await fetchMediaTrailer(tip, id, '');
  } catch (_) {
    return;                                       // ağ/veri yok → sessiz çık
  }
  if (kusak !== onizlemeKusak || !kart.isConnected) return;
  if (!trailer || !trailer.key || trailer.site !== 'YouTube') return;
  if (!mobil && hoverKart !== kart) return;     // fragman yüklenirken imleç karttan ayrıldıysa açma

  const baslik = decodeURIComponent(kart.getAttribute('data-title') || '');
  const ozet = decodeURIComponent(kart.getAttribute('data-overview') || '');
  const yil = (kart.getAttribute('data-year') || '').slice(0, 4);
  const puan = kart.getAttribute('data-rating') || '';
  const backdrop = kart.getAttribute('data-backdrop') || '';

  const el = document.createElement('div');
  el.className = 'card-hover-video-preview' + (mobil ? ' is-mobile-sheet' : '');
  el.innerHTML = `
    <div class="card-preview-media">
      <span class="card-preview-badge">FRAGMAN</span>
      <button type="button" class="card-preview-close-btn" aria-label="Önizlemeyi kapat"><i data-lucide="x"></i></button>
      <div class="card-preview-cinematic-shade"></div>
    </div>
    <div class="card-preview-details">
      <div class="card-preview-copy">
        <div class="card-preview-title"></div>
        <div class="card-preview-meta">${yil ? `<span>${yil}</span>` : ''}<span>${tip === 'tv' ? 'Dizi' : 'Film'}</span>${puan ? `<span class="card-preview-match">★ ${puan}</span>` : ''}</div>
        <p class="card-preview-overview"></p>
      </div>
      <div class="card-preview-actions">
        <a class="card-preview-detail" href="#detail?type=${tip}&id=${id}"><i data-lucide="info"></i><span>Detay</span></a>
        <button type="button" class="card-preview-sound" aria-label="Sesi aç"><i data-lucide="volume-x"></i></button>
      </div>
    </div>`;
  el.querySelector('.card-preview-title').textContent = baslik;
  const ozetEl = el.querySelector('.card-preview-overview');
  if (ozet) ozetEl.textContent = ozet; else ozetEl.remove();
  const media = el.querySelector('.card-preview-media');
  if (backdrop) media.style.backgroundImage = `url('${getImageUrl(backdrop, TMDB_IMAGE_SIZES.BACKDROP_LARGE)}')`;

  const iframe = document.createElement('iframe');
  const anahtar = encodeURIComponent(trailer.key);
  iframe.src = `https://www.youtube.com/embed/${anahtar}?autoplay=1&mute=1&controls=0&loop=1&playlist=${anahtar}&playsinline=1&modestbranding=1&rel=0&disablekb=1&enablejsapi=1`;
  iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.setAttribute('aria-hidden', 'true');
  iframe.tabIndex = -1;
  media.prepend(iframe);

  onizlemeGenelDinleyiciler();
  document.body.appendChild(el);
  renderIcons(el);
  aktifOnizleme = { el, kart, timer: null };
  kart.classList.add('preview-active');

  if (!mobil) {
    el.addEventListener('pointerenter', ayrilmaIptal);
    el.addEventListener('pointerleave', ayrilmaZamanla);
    const yerlestir = () => {
      if (!kart.isConnected) { onizlemeKapat(); return; }
      const r = kart.getBoundingClientRect();
      const w = el.offsetWidth || 600;
      const h = el.offsetHeight || 240;
      let left = r.right + 12;
      if (left + w > window.innerWidth - 8) left = r.left - w - 12;
      if (left < 8) left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8));
      let top = Math.round(r.top + r.height / 2 - h / 2);
      top = Math.max(8, Math.min(top, window.innerHeight - h - 8));
      el.style.left = `${Math.round(left)}px`;
      el.style.top = `${top}px`;
    };
    yerlestir();
    requestAnimationFrame(yerlestir);
    aktifOnizleme.timer = setTimeout(onizlemeKapat, ONIZLEME.masaustuMaksMs);
  } else {
    aktifOnizleme.timer = setTimeout(onizlemeKapat, ONIZLEME.mobilKapanmaMs);
  }

  el.querySelector('.card-preview-close-btn').addEventListener('click', () => onizlemeKapat());
  el.querySelector('.card-preview-detail').addEventListener('click', () => onizlemeKapat());
  const sesBtn = el.querySelector('.card-preview-sound');
  let sesKapali = true;
  sesBtn.addEventListener('click', () => {
    sesKapali = !sesKapali;
    sesBtn.classList.toggle('is-on', !sesKapali);
    sesBtn.setAttribute('aria-label', sesKapali ? 'Sesi aç' : 'Sesi kapat');
    sesBtn.innerHTML = `<i data-lucide="${sesKapali ? 'volume-x' : 'volume-2'}"></i>`;
    renderIcons(sesBtn);
    try {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: sesKapali ? 'mute' : 'unMute', args: [] }), '*'
      );
    } catch (_) { /* ses açma desteklenmiyorsa önizleme sessiz kalmaya devam eder */ }
  });
}
