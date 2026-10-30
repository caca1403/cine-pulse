import { renderIcons } from '../services/kabuk/icons.js';
/* ==========================================================================
   CinePulse Studio - Media Detail View
   Displays full TMDB metadata, backdrop banner, season/episode list or play movie button
   Supports seamless navigation for Movies, TV Shows, Anime, and Documentaries.
   Includes movie runtime, bulk series mark-watched, season selectors, and halfway in-progress states.
   ========================================================================== */

import { fetchMediaDetails, getImageUrl, TMDB_IMAGE_SIZES, SINEFLIX_ACTOR_FALLBACK, generateCinematicOverview } from '../services/icerik/tmdbApi.js';
import { isFavorite, toggleFavorite, isWatchlist, toggleWatchlist, getLastWatchedEpisode, getMediaProgress, formatSecondsToTime, isMediaWatched, toggleEpisodeWatched, markAllEpisodesWatched, isEntireSeriesWatched, setMediaHalfway, registerAnimeId, isRegisteredAnimeId } from '../services/altyapi/storage.js';
import { renderSeasonSelector } from '../components/SeasonSelector.js';
import { kaynakListesiOlustur } from '../components/kaynakListesi.js';
import { renderMediaCard, attachMediaCardEvents, isAnimeItem } from '../components/MediaCard.js';
import { openPlayerModal } from '../components/openPlayer.js';
import { openCastExplorerModal } from '../components/CastExplorerModal.js';
import { showToast } from '../components/Toast.js';
import { getNextEpisodeInfo } from '../services/icerik/tvmazeService.js';
import { getBestBackdrop } from '../services/icerik/fanartService.js';
import { puanMetni, imdbPuaniImdbId } from '../services/icerik/imdbRating.js';
import '../styles/detail-stremio.css';
import { openTrailerModal } from './TrailerModal.js';
import '../styles/detay-ui.css';
import '../styles/kaynak-tarama.css';

const DECISION_ROOM_AUTOPLAY_KEY = 'cinepulse.decision-room.autoplay';

/* ── İçerik bayrağı (kullanıcı 2026-10-28): detay aksiyon satırındaki Bayrak
   düğmesi içeriği yerel listeye işaretler/kaldırır; sunucu yoktur. ────────── */
const BAYRAK_ANAHTARI = 'cp_bayraklar';
function bayraklariGetir() {
  try {
    const liste = JSON.parse(localStorage.getItem(BAYRAK_ANAHTARI) || '[]');
    return Array.isArray(liste) ? liste.map(String) : [];
  } catch (_) { return []; }
}
function bayrakToggle(id) {
  const liste = bayraklariGetir();
  const i = liste.indexOf(String(id));
  if (i >= 0) liste.splice(i, 1); else liste.push(String(id));
  try { localStorage.setItem(BAYRAK_ANAHTARI, JSON.stringify(liste)); } catch (_) {}
  return i < 0; // true → bayrak şimdi açık
}

function consumeDecisionRoomAutoplay(type, id) {
  try {
    const pending = JSON.parse(sessionStorage.getItem(DECISION_ROOM_AUTOPLAY_KEY) || 'null');
    sessionStorage.removeItem(DECISION_ROOM_AUTOPLAY_KEY);
    return (
      pending
      && String(pending.id) === String(id)
      && pending.type === type
      && Date.now() - Number(pending.createdAt || 0) < 15000
    ) ? pending : null;
  } catch (_) {
    return null;
  }
}

function formatMediaRuntime(minutes) {
  if (!minutes || minutes <= 0) return '';
  const hrs = Math.floor(minutes / 60);
  const remMin = minutes % 60;
  if (hrs > 0) {
    return `${hrs} sa ${remMin > 0 ? remMin + ' dk' : ''} (${minutes} dk)`;
  }
  return `${minutes} dk`;
}

/**
 * Detay ekranına özel tasarımlı içerik başlığını (logo) uygular.
 * Zincir fanartService'te: TMDB logosu → Fanart.tv (anime dahil). Logo yoksa
 * düz başlık görünür kalır; bu fonksiyon başarısız olursa arayüz etkilenmez.
 */
async function baslikLogosunuUygula(kok, tmdbId, tur) {
  try {
    const blok = kok?.querySelector?.('.detail-titleblock');
    const gorsel = kok?.querySelector?.('.detail-title-logo');
    if (!blok || !gorsel || !tmdbId) return;
    const sanat = await getBestBackdrop(tmdbId, tur === 'tv' ? 'tv' : 'movie');
    const adres = sanat?.logo;
    if (!adres || !blok.isConnected) return;
    gorsel.addEventListener('load', () => {
      if (!gorsel.isConnected) return;
      gorsel.hidden = false;
      blok.classList.add('detail-titleblock--logo');
    }, { once: true });
    gorsel.src = adres;
  } catch (_) {
    /* logosuz devam: düz başlık zaten ekranda */
  }
}

export async function renderDetailView(typeOrObj = 'tv', maybeId) {
  const type = (typeof typeOrObj === 'object' && typeOrObj !== null) ? (typeOrObj.type || 'tv') : (typeOrObj || 'tv');
  const id = (typeof typeOrObj === 'object' && typeOrObj !== null) ? typeOrObj.id : maybeId;
  let normalizedType = (type === 'series' || type === 'tv' || type === 'anime') ? 'tv' : ((type === 'movie') ? 'movie' : 'tv');
  let media = await fetchMediaDetails(normalizedType, id);

  if (!media) {
    // If not found with initial type, try the alternative type
    normalizedType = normalizedType === 'tv' ? 'movie' : 'tv';
    media = await fetchMediaDetails(normalizedType, id);
  }

  if (!media) {
    return {
      html: `<div class="container" style="padding: 10rem 0; text-align: center;"><h2>İçerik bulunamadı.</h2></div>`,
      init: () => {}
    };
  }

  const isSeries = !!(media.seasons && media.seasons.length > 0) || normalizedType === 'tv';
  const effectiveType = isSeries ? 'tv' : 'movie';
  const isAnime = isAnimeItem(media) || type === 'anime' || normalizedType === 'anime' || isRegisteredAnimeId(id);
  if (isAnime) registerAnimeId(id);

  const title = media.title || media.name || 'Detay';
  const originalTitle = media.original_title || media.original_name || '';
  const backdropUrl = getImageUrl(media.backdrop_path, TMDB_IMAGE_SIZES.BACKDROP_ORIGINAL);
  const posterUrl = getImageUrl(media.poster_path, TMDB_IMAGE_SIZES.POSTER_MEDIUM);
  // TMDB puanı GERÇEK değeriyle gösterilir; uydurma varsayılan ('8.5') kalktı
  // (kullanıcı 2026-10-29: "IMDb yazdığın puanda TMDB var — düzelt").
  const rating = media.vote_average ? Number(media.vote_average).toFixed(1) : '';
  // IMDb puanı gelmeyebilir (uç kapalı/ağ yok) → null. Eskiden doğrudan
  // .toFixed() yeniyordu ve DETAY EKRANININ TAMAMI çöküyordu.
  const imdbRating = puanMetni(media.imdbRating);
  const year = (media.first_air_date || media.release_date || '').substring(0, 4);
  const overview = (media.overview && media.overview.trim().length > 15) ? media.overview : generateCinematicOverview(media, effectiveType);
  const genres = media.genres || [];
  const movieDurationSec = media.runtime ? (media.runtime * 60) : 6600;

  const inFav = isFavorite(id);
  const inWatch = isWatchlist(id);
  const isBayrakli = bayraklariGetir().includes(String(id));

  // Watch history progress for hero button
  const lastWatchedEp = effectiveType === 'tv' ? getLastWatchedEpisode(id) : null;
  const movieProgress = effectiveType === 'movie' ? getMediaProgress(id, 1, 1) : null;
  
  // Status flags
  const isMovieWatched = effectiveType === 'movie' ? isMediaWatched(id, 1, 1) : false;
  const isSeriesAllWatched = effectiveType === 'tv' ? isEntireSeriesWatched(id, media.seasons || []) : false;
  const isCurrentWatched = effectiveType === 'movie' ? isMovieWatched : isSeriesAllWatched;

  let playButtonLabel = effectiveType === 'movie' ? 'Filmi İzle' : '1. Sezon 1. Bölümü İzle';
  if (effectiveType === 'tv' && lastWatchedEp) {
    const timeStr = formatSecondsToTime(lastWatchedEp.currentTime);
    playButtonLabel = `Devam Et <span class="play-btn-subinfo">S${lastWatchedEp.season} B${lastWatchedEp.episode}${timeStr ? ' • ' + timeStr : ''}</span>`;
  } else if (effectiveType === 'movie' && movieProgress && movieProgress.currentTime > 0) {
    const timeStr = formatSecondsToTime(movieProgress.currentTime);
    playButtonLabel = `Devam Et <span class="play-btn-subinfo">${timeStr}</span>`;
  }

  // Director & Creator details (Pentagram / MUBI Editorial Standard)
  const directors = media.credits?.crew ? media.credits.crew.filter(c => c.job === 'Director').map(d => d.name) : [];
  const creators = media.created_by ? media.created_by.map(c => c.name) : [];
  const directorName = directors.length > 0 ? directors.slice(0, 2).join(', ') : (creators.length > 0 ? creators.slice(0, 2).join(', ') : '');

  // Letterboxd 5-Star score calculation (TMDB puanı yoksa NaN değil, boş)
  const starScore = rating ? (parseFloat(rating) / 2).toFixed(1) : '';
  const starCount = Math.floor(starScore);
  const hasHalf = (starScore % 1) >= 0.4;
  const letterboxdStars = '★'.repeat(Math.min(5, starCount)) + (hasHalf && starCount < 5 ? '½' : '');

  // Full Cast list (up to 24 actors for dedicated cast tab)
  const fullCastList = media.credits && media.credits.cast ? media.credits.cast.slice(0, 24) : [];

  let seasonSelectorObj = null;
  let spoilerFreeEnabled = false;
  if (effectiveType === 'tv' && media.seasons) {
    seasonSelectorObj = await renderSeasonSelector({
      tvId: id,
      seriesTitle: title,
      originalTitle: originalTitle,
      seriesOverview: overview,
      seasons: media.seasons,
      posterPath: media.poster_path,
      backdropPath: media.backdrop_path,
      isAnime,
      spoilerFree: spoilerFreeEnabled
    });
  }

  const recommendations = media.recommendations ? media.recommendations.results.slice(0, 6) : [];

  // Kaynak sekmesi TV için sezon/bölüm seçicisi: varsayılan kaldığı yer.
  const kaynakSezon = lastWatchedEp?.season || 1;
  const kaynakBolum = lastWatchedEp?.episode || 1;
  const kaynakSezonlari = (media.seasons || []).filter(s => s.season_number > 0);
  if (kaynakSezonlari.length === 0 && (media.seasons || []).length > 0) kaynakSezonlari.push(media.seasons[0]);
  const kaynakBolumSecenekleri = (adet) => Array.from({ length: adet || 10 }, (_, i) =>
    `<option value="${i + 1}" ${i + 1 === kaynakBolum ? 'selected' : ''}>${i + 1}. Bölüm</option>`).join('');

  // Sekmeler: içerik yığılmaz. Varsayılan eski davranış — dizide bölümler, filmde oyuncular.
  const varsayilanSekme = (effectiveType === 'tv' && seasonSelectorObj) ? 'episodes' : 'cast';
  const sekmeDugmesi = (hedef, etiket) => `
    <button type="button" class="cps-sekme ${varsayilanSekme === hedef ? 'active' : ''}"
      data-tab="${hedef}" aria-pressed="${varsayilanSekme === hedef ? 'true' : 'false'}">${etiket}</button>
  `;
  const panelGizli = (hedef) => (varsayilanSekme === hedef ? '' : ' hidden');

  const watchedBtnLabel = effectiveType === 'movie'
    ? (isMovieWatched ? 'Film İzlendi' : 'İzlendi Olarak İşaretle')
    : (isSeriesAllWatched ? 'Tüm Sezonlar İzlendi' : 'Tümünü İzlendi İşaretle');

  // Extract YouTube trailers for the Netflix-style trailers preview strip (Image 2)
  const allVideos = (media.videos?.results || []).filter(v => v.site === 'YouTube');
  allVideos.sort((a, b) => {
    const typeOrder = { 'Trailer': 1, 'Teaser': 2, 'Clip': 3, 'Behind the Scenes': 4 };
    return (typeOrder[a.type] || 9) - (typeOrder[b.type] || 9);
  });
  const heroTrailers = allVideos.filter((video, index, videos) => video.key && videos.findIndex(item => item.key === video.key) === index).slice(0, 12);
  const trailerSearches = [
    { label: 'Resmi fragman ara', query: `${originalTitle || title} official trailer` },
    { label: 'Türkçe fragman ara', query: `${title} Türkçe fragman` },
    { label: 'Tanıtım ve teaser ara', query: `${originalTitle || title} official teaser` },
    { label: 'Klipleri ara', query: `${originalTitle || title} official clip` }
  ].slice(0, Math.max(0, 4 - heroTrailers.length));

  // Stremio mobil düzeni: backdrop üstte, tek sayfa dikey akış.
  const yonetmenler = (media.credits?.crew || [])
    .filter(k => k.job === 'Director')
    .map(k => ({ id: k.id, name: k.name }));
  const yazarlar = (media.credits?.crew || [])
    .filter(k => ['Writer', 'Screenplay', 'Story'].includes(k.job))
    .map(k => ({ id: k.id, name: k.name }));
  const oyuncular = (media.credits?.cast || []).slice(0, 12).map(k => ({ id: k.id, name: k.name }));
  const yaraticilar = (media.created_by || []).map(k => ({ id: k.id, name: k.name }));

  const essizKisiler = (liste) => {
    const gorulen = new Set();
    return (liste || []).filter(k => k && k.name && !gorulen.has(k.id || k.name) && gorulen.add(k.id || k.name));
  };
  const kisiCipleri = (liste) => essizKisiler(liste).slice(0, 16).map(k => `
    <button type="button" class="cps-kisi" data-person-id="${k.id || ''}" data-person-name="${k.name}" title="${k.name}">${k.name}</button>
  `).join('');

  const kisiGruplari = [
    { etiket: isSeries ? 'YARATICI' : 'YÖNETMEN', kisiler: isSeries ? yaraticilar : yonetmenler },
    { etiket: 'YÖNETMEN', kisiler: isSeries ? yonetmenler : [] },
    { etiket: 'SENARİST', kisiler: yazarlar },
    { etiket: 'OYUNCULAR', kisiler: oyuncular }
  ].map(g => ({ ...g, kisiler: essizKisiler(g.kisiler) })).filter(g => g.kisiler.length > 0);

  // YENİ DETAY ARAYÜZÜ (kullanıcı 2026-10-28): sayfa baştan yazıldı — backdrop +
  // poster kartı hero, künye, aksiyon satırı (oynat / izlendi / kaydet / favori /
  // bayrak / yarıda / paylaş), özet, tür çipleri ve sekmeler. Oyuncu artığı yok:
  // sayfada video/preview embed edilmez, fragman TrailerModal'da açılır. Eski
  // davranışlar aynı ID/sınıf kancalarıyla korundu (router, storage, sekmeler).
  const html = `
    <div class="detail-view dt-sayfa">
      <header class="dt-hero">
        <div class="dt-hero-fon" style="background-image: url('${backdropUrl}')"></div>
        <div class="dt-hero-fon-dikey-bulut" style="background-image: url('${posterUrl}')" aria-hidden="true"></div>
        <div class="dt-hero-fon-dikey" style="background-image: url('${posterUrl}')" aria-hidden="true"></div>
        <div class="dt-hero-karartma"></div>

        <div class="dt-ust-cubuk">
          <button class="dt-ikonbtn" id="btn-detail-back" title="Geri dön" aria-label="Geri dön">
            <i data-lucide="arrow-left" style="width:18px;height:18px;"></i>
          </button>
          <div class="dt-ust-cubuk-sag">
            <button class="dt-ikonbtn ${isCurrentWatched ? 'is-active' : ''}" id="btn-toggle-watched-detail" title="${watchedBtnLabel}" aria-label="${watchedBtnLabel}">
              <i data-lucide="${isCurrentWatched ? 'check-circle-2' : 'check'}" style="width:18px;height:18px;"></i>
              <span class="cps-gizli">${watchedBtnLabel}</span>
            </button>
            <button class="dt-ikonbtn ${inWatch ? 'is-active' : ''}" id="btn-toggle-watchlist" title="${inWatch ? 'Listemde' : 'Koleksiyona ekle'}" aria-label="Koleksiyon">
              <i data-lucide="${inWatch ? 'bookmark-check' : 'bookmark'}" style="width:18px;height:18px;${inWatch ? 'fill:currentColor' : ''}"></i>
              <span class="cps-gizli">${inWatch ? 'Listemde' : 'Koleksiyona ekle'}</span>
            </button>
            <button class="dt-ikonbtn" id="btn-share-detail" title="Paylaş" aria-label="Paylaş">
              <i data-lucide="share-2" style="width:18px;height:18px;"></i>
              <span class="cps-gizli">Paylaş</span>
            </button>
          </div>
        </div>

        <div class="dt-hero-ic">
          <div class="dt-bilgi">
            <div class="detail-titleblock">
              <img class="detail-title-logo" alt="" aria-hidden="true" hidden />
              <h1 class="detail-heading-title">${title}</h1>
            </div>

            <p class="dt-kunye">
              ${effectiveType === 'movie' ? 'Film' : (isAnime ? 'Anime' : 'Dizi')}${year ? ` · ${year}` : ''}${media.runtime ? ` · ${media.runtime} dk` : ''}${effectiveType === 'tv' && media.number_of_seasons ? ` · ${media.number_of_seasons} Sezon` : ''}${effectiveType === 'tv' && media.number_of_episodes ? ` · ${media.number_of_episodes} Bölüm` : ''}
            </p>

            <div class="dt-puan-satiri">
              <span class="dt-puan" id="dt-imdb-chip"${imdbRating ? '' : ' hidden'}>
                <i data-lucide="star" style="width:13px;height:13px;fill:#dfff76;color:#dfff76;"></i>
                <span id="dt-imdb-deger">${imdbRating}</span>
                <em>IMDb</em>
              </span>
              ${rating ? `<span class="dt-puan dt-puan-tmdb">
                <i data-lucide="star" style="width:13px;height:13px;fill:#01b4e4;color:#01b4e4;"></i>
                ${rating}
                <em>TMDB</em>
              </span>` : ''}
              ${starScore ? `<span class="dt-letterboxd">Letterboxd ${letterboxdStars} (${starScore})</span>` : ''}
              ${originalTitle && originalTitle !== title ? `<span class="dt-orijinal">${originalTitle}</span>` : ''}
            </div>

            ${genres.length > 0 ? `
              <div class="dt-turler">
                ${genres.slice(0, 6).map(g => `<span class="dt-tur">${g.name}</span>`).join('')}
              </div>
            ` : ''}

            <div class="dt-aksiyonlar">
              <button class="dt-oynat" id="${effectiveType === 'movie' ? 'btn-play-movie' : 'btn-resume-series'}">
                <i data-lucide="play" style="fill:currentColor;width:18px;height:18px;"></i>
                <span>${playButtonLabel}</span>
              </button>
              <button class="dt-aksiyon-cip ${inFav ? 'is-active' : ''}" id="btn-toggle-fav" title="${inFav ? 'Favorilerimde' : 'Favorilere ekle'}" aria-label="Favori">
                <i data-lucide="heart" style="width:16px;height:16px;${inFav ? 'fill:var(--primary);color:var(--primary)' : ''}"></i>
                <span>${inFav ? 'Favorilerimde' : 'Favoriler'}</span>
              </button>
              <button class="dt-aksiyon-cip ${isBayrakli ? 'is-active' : ''}" id="btn-toggle-bayrak" title="${isBayrakli ? 'Bayrağı kaldır' : 'İçeriği bayrakla'}" aria-label="Bayrakla">
                <i data-lucide="flag" style="width:16px;height:16px;${isBayrakli ? 'fill:currentColor' : ''}"></i>
                <span>Bayrak</span>
              </button>
              <button class="dt-aksiyon-cip" id="btn-mark-halfway-detail" title="Yarıda bırak" aria-label="Yarıda bırak">
                <i data-lucide="clock" style="width:16px;height:16px;"></i>
                <span>Yarıda</span>
              </button>
            </div>
            <p class="dt-oynat-alt">Aşağıdaki KAYNAKLAR sekmesinden yayın seçin; oynatıcı seçtiğiniz kaynakla açılır.</p>

            <span id="detail-next-episode-badge" class="dt-yeni-bolum" style="display:none;"></span>

            <div class="dt-ozet">
              <p class="detail-storyline ${overview.length > 160 ? 'truncated' : ''}" id="detail-storyline-text">${overview}</p>
              ${overview.length > 160 ? `
                <button class="btn-storyline-expand" id="btn-expand-storyline">
                  <span>Daha fazla</span>
                  <i data-lucide="chevron-down" style="width:14px;height:14px;"></i>
                </button>
              ` : ''}
            </div>

            ${effectiveType === 'tv' ? `
              <label class="spoiler-discovery-pill dt-spoiler">
                <input id="detail-spoiler-free-toggle" type="checkbox" />
                <i data-lucide="shield-check"></i>
                <span>Spoilersız Keşfet</span>
              </label>
            ` : ''}
          </div>
        </div>
      </header>

      <div class="dt-govde">
        <!-- Sekme çubuğu: KAYNAKLAR / BÖLÜMLER / GENEL BAKIŞ (+fragman, benzer, kadro).
             data-tab/data-panel sözleşmesi eski sekmelerle birebir aynı. -->
        <nav class="dt-sekmeler cps-sekme-cubugu" aria-label="Detay bölümleri">
          ${sekmeDugmesi('sources', 'KAYNAKLAR')}
          ${effectiveType === 'tv' && seasonSelectorObj ? sekmeDugmesi('episodes', 'BÖLÜMLER') : ''}
          ${sekmeDugmesi('overview', 'GENEL BAKIŞ')}
          ${sekmeDugmesi('trailers', 'FRAGMANLAR')}
          ${recommendations.length > 0 ? sekmeDugmesi('recommendations', 'BENZERLER') : ''}
          ${sekmeDugmesi('cast', 'OYUNCULAR')}
        </nav>

        <!-- KAYNAKLAR: kart tıklaması oynatıcıyı seçilen kaynakla açar (madde 1
             sözleşmesi init içinde: cp-landscape-gecis + taramaKarti + cp:kaynak-sayac) -->
        <section class="dt-panel cps-bolum cps-kaynaklar cps-sekme-panel" id="cps-kaynaklar" data-panel="sources"${panelGizli('sources')}>
          <div class="cps-bolum-basligi">
            <h2 class="cps-bolum-baslik">Yayın kaynakları</h2>
            <p class="cps-bolum-alt">Bir kaynak seçin; oynatıcı seçtiğiniz kaynakla açılır.</p>
          </div>

          ${effectiveType === 'tv' ? `
            <div class="kaynak-bolum-cubugu" id="kaynak-bolum-cubugu">
              <label class="kaynak-bolum-alan">
                <span>Sezon</span>
                <select id="kaynak-sezon-secim">
                  ${kaynakSezonlari.map(season => `
                    <option value="${season.season_number}" ${season.season_number === kaynakSezon ? 'selected' : ''}>${season.season_number}. Sezon</option>
                  `).join('')}
                </select>
              </label>
              <label class="kaynak-bolum-alan">
                <span>Bölüm</span>
                <select id="kaynak-bolum-secim">
                  ${kaynakBolumSecenekleri(kaynakSezonlari.find(s => s.season_number === kaynakSezon)?.episode_count)}
                </select>
              </label>
            </div>
          ` : ''}

          <div class="kaynak-liste-kok" id="kaynak-liste-kok"></div>
        </section>

        ${effectiveType === 'tv' && seasonSelectorObj ? `
          <section class="dt-panel cps-bolum cps-sekme-panel" id="cps-bolumler" data-panel="episodes"${panelGizli('episodes')}>
            ${seasonSelectorObj.html}
          </section>
        ` : ''}

        <section class="dt-panel cps-bolum cps-sekme-panel" id="cps-genel-bakis" data-panel="overview"${panelGizli('overview')}>
          <h2 class="cps-bolum-baslik">Genel bakış</h2>
          <div class="netflix-overview-pane-grid cps-bakis-izgara">
            <div class="netflix-overview-main-col">
              <h3 class="netflix-subheading">Özet & Hikaye</h3>
              <p class="netflix-full-overview">${overview || 'Bu içerik için henüz özet eklenmedi.'}</p>
              ${kisiGruplari.length > 0 ? `
                <div class="dt-kadro-chipleri">
                  ${kisiGruplari.map(g => `
                    <div class="cps-kisi-grup">
                      <h3 class="cps-kisi-etiket">${g.etiket}</h3>
                      <div class="cps-kisi-serit">${kisiCipleri(g.kisiler)}</div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>

            <div class="netflix-overview-specs-col">
              <h3 class="netflix-subheading">Teknik Detaylar</h3>
              <div class="netflix-specs-table">
                ${originalTitle ? `
                  <div class="spec-row">
                    <span class="spec-label">Orijinal Başlık</span>
                    <span class="spec-val">${originalTitle}</span>
                  </div>
                ` : ''}
                ${directorName ? `
                  <div class="spec-row">
                    <span class="spec-label">${effectiveType === 'tv' ? 'Yaratıcı' : 'Yönetmen'}</span>
                    <span class="spec-val">${directorName}</span>
                  </div>
                ` : ''}
                ${media.release_date || media.first_air_date ? `
                  <div class="spec-row">
                    <span class="spec-label">Yayın Tarihi</span>
                    <span class="spec-val">${media.release_date || media.first_air_date}</span>
                  </div>
                ` : ''}
                ${media.status ? `
                  <div class="spec-row">
                    <span class="spec-label">Yayın Durumu</span>
                    <span class="spec-val">${media.status}</span>
                  </div>
                ` : ''}
                ${media.runtime ? `
                  <div class="spec-row">
                    <span class="spec-label">Film Süresi</span>
                    <span class="spec-val">${formatMediaRuntime(media.runtime)}</span>
                  </div>
                ` : ''}
                ${media.number_of_seasons ? `
                  <div class="spec-row">
                    <span class="spec-label">Toplam Sezon</span>
                    <span class="spec-val">${media.number_of_seasons} Sezon</span>
                  </div>
                ` : ''}
                ${media.number_of_episodes ? `
                  <div class="spec-row">
                    <span class="spec-label">Toplam Bölüm</span>
                    <span class="spec-val">${media.number_of_episodes} Bölüm</span>
                  </div>
                ` : ''}
                <div class="spec-row"${imdbRating ? '' : ' style="display:none;"'}>
                  <span class="spec-label">IMDb Puanı</span>
                  <span class="spec-val" id="spec-imdb-val" style="color: #dfff76; font-weight: 750;">${imdbRating ? '★ ' + imdbRating + ' / 10' : ''}</span>
                </div>
                ${rating ? `
                <div class="spec-row">
                  <span class="spec-label">TMDB Puanı</span>
                  <span class="spec-val" style="color: #01b4e4; font-weight: 750;">★ ${rating} / 10</span>
                </div>` : ''}
                ${starScore ? `
                <div class="spec-row">
                  <span class="spec-label">Letterboxd</span>
                  <span class="spec-val" style="color: #00e054; font-weight: 750;">${letterboxdStars} (${starScore})</span>
                </div>` : ''}
              </div>
            </div>
          </div>
        </section>

        <section class="dt-panel cps-bolum cps-sekme-panel" id="cps-oyuncular" data-panel="cast"${panelGizli('cast')}>
          <div class="cps-bolum-basligi">
            <h2 class="cps-bolum-baslik">Oyuncu kadrosu</h2>
            <p class="cps-bolum-alt">Karakteri canlandıran oyuncular; filmografi için dokunun.</p>
          </div>

          ${fullCastList.length > 0 ? `
            <div class="netflix-cast-grid">
              ${fullCastList.map((actor, idx) => {
                const actorPic = actor.profile_path ? getImageUrl(actor.profile_path, TMDB_IMAGE_SIZES.POSTER_MEDIUM) : SINEFLIX_ACTOR_FALLBACK;
                const character = actor.character ? actor.character.split('/')[0].trim() : '';
                const isExtra = idx >= 12;
                return `
                  <div class="netflix-cast-card ${isExtra ? 'cast-card-hidden' : ''}" data-person-id="${actor.id}" data-person-name="${actor.name}" title="${actor.name}${character ? ' (' + character + ')' : ''} • Filmografiyi Gör">
                    <div class="netflix-cast-photo-wrap">
                      <img src="${actorPic}" alt="${actor.name}" loading="lazy" onerror="this.onerror=null; this.src='${SINEFLIX_ACTOR_FALLBACK}';" />
                      <div class="netflix-cast-card-hover">
                        <i data-lucide="sparkles" style="width:20px;height:20px;color:#fff;"></i>
                        <span>Filmografi</span>
                      </div>
                    </div>
                    <div class="netflix-cast-info">
                      <h4 class="netflix-cast-name">${actor.name}</h4>
                      ${character ? `<p class="netflix-cast-character">${character}</p>` : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            ${fullCastList.length > 12 ? `
              <div class="cps-daha-fazla">
                <button class="btn-netflix-show-more" id="btn-show-more-cast">
                  <span>Tüm Oyuncuları Göster (${fullCastList.length})</span>
                  <i data-lucide="chevron-down" style="width:16px;height:16px;"></i>
                </button>
              </div>
            ` : ''}
          ` : `
            <div class="netflix-empty-tab-state">
              <i data-lucide="user-x" style="width:40px;height:40px;color:#666;"></i>
              <p>Bu yapım için oyuncu bilgisi bulunamadı.</p>
            </div>
          `}
        </section>

        <section class="dt-panel cps-bolum cps-sekme-panel" id="cps-fragmanlar" data-panel="trailers"${panelGizli('trailers')}>
          <div class="cps-bolum-basligi">
            <h2 class="cps-bolum-baslik">Fragmanlar</h2>
            <p class="cps-bolum-alt">Resmi Türkçe ve orijinal tanıtımlar — kart, fragmanı ayrı pencerede açar.</p>
          </div>

          <div class="dt-fragman-izgara">
            ${heroTrailers.map((t, idx) => `
              <button type="button" class="dt-fragman-kart" data-video-key="${t.key}" data-video-title="${t.name || ('Fragman ' + (idx + 1))}" data-video-type="${t.type || 'Fragman'}">
                <img src="https://img.youtube.com/vi/${t.key}/mqdefault.jpg" alt="${t.name || 'Trailer'}" loading="lazy" />
                <span class="dt-fragman-ust">
                  <i data-lucide="play" style="width:16px;height:16px;fill:currentColor;"></i>
                </span>
                <span class="dt-fragman-ad">${t.name || ('Fragman ' + (idx + 1))}</span>
              </button>
            `).join('')}
            ${trailerSearches.map(search => `
              <a class="trailer-search-card" href="https://www.youtube.com/results?search_query=${encodeURIComponent(search.query)}" target="_blank" rel="noopener noreferrer" aria-label="${search.label}: YouTube'da aç">
                <i data-lucide="search" aria-hidden="true"></i>
                <span>${search.label}</span>
                <small>YouTube'da aç ↗</small>
              </a>
            `).join('')}
          </div>
        </section>

        ${recommendations.length > 0 ? `
          <section class="dt-panel cps-bolum cps-sekme-panel" id="cps-benzerler" data-panel="recommendations"${panelGizli('recommendations')}>
            <div class="cps-bolum-basligi">
              <h2 class="cps-bolum-baslik">Benzerler</h2>
              <p class="cps-bolum-alt">Bu yapımı sevenlerin beğendiği diğer içerikler.</p>
            </div>
            <div class="media-grid">
              ${recommendations.map(item => renderMediaCard(item)).join('')}
            </div>
          </section>
        ` : ''}
      </div>
    </div>
  `;
  return {
    html,
    init: (container) => {
      baslikLogosunuUygula(container, id, normalizedType);
      if (!container) return;

      // IMDb puanı gerçekten gelsin: Worker ucu boş dönerse (IMDb bot duvarı)
      // external_ids.imdb_id üzerinden okuma-proxy ile tek adımda çözülür ve
      // çip/künye DOM'u geç de olsa doldurulur. Bulunamazsa alan BOŞ kalır —
      // TMDB puanı IMDb diye ETİKETLENMEZ (kullanıcı 2026-10-29).
      if (!imdbRating) {
        const imdbId = String(media.external_ids?.imdb_id || '');
        if (/^tt\d{6,10}$/.test(imdbId)) {
          imdbPuaniImdbId(imdbId).then(p => {
            if (p === null || p === undefined) return;
            const deger = container.querySelector('#dt-imdb-deger');
            if (deger) deger.textContent = p.toFixed(1);
            const cip = container.querySelector('#dt-imdb-chip');
            if (cip) cip.hidden = false;
            const specDeger = container.querySelector('#spec-imdb-val');
            if (specDeger) {
              specDeger.textContent = `★ ${p.toFixed(1)} / 10`;
              specDeger.closest('.spec-row')?.style && (specDeger.closest('.spec-row').style.display = '');
            }
            window.lucide?.createIcons?.({ attrs: { 'stroke-width': 2 } });
          }).catch(() => { /* sessiz: puan yoksa alan boş kalır */ });
        }
      }
      let decisionRoomAutoplay = consumeDecisionRoomAutoplay(effectiveType, id);

      // ── KAYNAKLAR sekmesi (2026-10-27) ───────────────────────────────────
      // Kaynak listesi oynatıcının içinden detay sayfasına taşındı. Detay
      // açılışında HİÇBİR tarama başlamaz: baslat() yalnız sekme ilk kez
      // açıldığında çağrılır (55 çekirdek × 75 sn bütçe sayfayı dondurmasın).
      let kaynakSecimi = { sezon: kaynakSezon, bolum: kaynakBolum };

      // ── Madde 1 sözleşmesi (kullanıcı 2026-10-28) ──────────────────────────
      // Kaynak kartına tıklanınca: (1) yatay kilit İZNİ (Capacitor WebView
      // reddedebilir — asıl garanti native tarafta; yalnız iyileştirme),
      // (2) body'e cp-landscape-gecis: CSS SADECE karartma + spinner gösterir,
      // içerik döndürülmez (dokunmatik koordinatlar kaymasın), (3) openPlayerModal
      // SON parametre olarak taramaKarti alır (PlayerModal/Agent C sözleşmesi).
      // Ayrıca 500 ms'de bir kaynak sayısı 'cp:kaynak-sayac' olayıyla bildirilir;
      // ilk kareyi belirten .native-hazir sınıfı görününce, 12 sn dolunca veya
      // 'cp-native-hata' gelince sayaç VE geçiş sınıfı temizlenir (sızıntı yok).
      let sayacAraligi = null;
      let sayacUstSinir = null;
      let sayacHataDinleyici = null;
      const kaynakSayaciniDurdur = () => {
        if (sayacAraligi) { clearInterval(sayacAraligi); sayacAraligi = null; }
        if (sayacUstSinir) { clearTimeout(sayacUstSinir); sayacUstSinir = null; }
        if (sayacHataDinleyici) {
          window.removeEventListener('cp-native-hata', sayacHataDinleyici);
          sayacHataDinleyici = null;
        }
        document.body.classList.remove('cp-landscape-gecis');
      };
      const kaynakSayaciniBaslat = () => {
        kaynakSayaciniDurdur();
        document.body.classList.add('cp-landscape-gecis');
        const gonder = () => {
          window.dispatchEvent(new CustomEvent('cp:kaynak-sayac', {
            detail: { adet: kaynakListesi.kaynaklar().length, kaynakMi: true }
          }));
        };
        gonder();
        sayacAraligi = setInterval(() => {
          // Detay sayfası yönlendirmeyle söküldüyse sızıntı bırakma.
          if (!container.isConnected) { kaynakSayaciniDurdur(); return; }
          gonder();
          // native-hazir: PlayerModal sahnesine ilk kare gelince eklenen sınıf
          // (PlayerModal.js native-hazir) — ilk kare işareti.
          if (document.querySelector('.native-hazir')) kaynakSayaciniDurdur();
        }, 500);
        sayacUstSinir = setTimeout(kaynakSayaciniDurdur, 12000);
        sayacHataDinleyici = () => kaynakSayaciniDurdur();
        window.addEventListener('cp-native-hata', sayacHataDinleyici);
      };
      const kaynakListesi = kaynakListesiOlustur({
        kok: container.querySelector('#kaynak-liste-kok'),
        // Oynatıcının keşfiyle aynı tür: anime çekirdekleri öne alınsın
        // (vekil.js anime sıralaması yalnız 'anime' türünde devreye girer).
        tur: isAnime ? 'anime' : effectiveType,
        tmdbId: id,
        imdbId: media.external_ids?.imdb_id || '',
        sezon: kaynakSecimi.sezon,
        bolum: kaynakSecimi.bolum,
        baslik: title,
        orijinalBaslik: originalTitle,
        onKaynakSec: (kaynak) => {
          // Madde 1 sırası (kullanıcı 2026-10-28): 1) yatay kilit izni (yalnız
          // iyileştirme — Capacitor WebView reject edebilir, asıl garanti native),
          // 2) karartma+spinner geçiş sınıfı + kaynak sayacı, 3) oynatıcı çağrısı.
          try {
            const yonlendirme = window.screen?.orientation;
            if (yonlendirme && typeof yonlendirme.lock === 'function') {
              Promise.resolve(yonlendirme.lock('landscape')).catch(() => {});
            }
          } catch (_) { /* kilit desteklenmiyor/ reddedildi — akışı engellemez */ }
          kaynakSayaciniBaslat();
          const ortak = {
            type: isAnime ? 'anime' : effectiveType,
            isAnime,
            tmdbId: id,
            seriesTitle: title,
            originalTitle,
            posterPath: media.poster_path,
            backdropPath: media.backdrop_path,
            // Hazır havuz: oynatıcı YENİDEN tarama yapmaz, seçilen satırdan başlar.
            hazirKaynaklar: kaynakListesi.kaynaklar(),
            secilenKaynak: kaynak
          };
          const istek = effectiveType === 'movie'
            ? (() => {
              const progress = getMediaProgress(id, 1, 1);
              return {
                ...ortak,
                title,
                duration: movieDurationSec,
                currentTime: progress ? progress.currentTime : 0
              };
            })()
            : (() => {
              const { sezon, bolum } = kaynakSecimi;
              const progress = getMediaProgress(id, sezon, bolum);
              return {
                ...ortak,
                title: `${title} - S${sezon}E${bolum}`,
                season: sezon,
                episode: bolum,
                currentTime: progress ? progress.currentTime : 0,
                seasonsList: media.seasons || []
              };
            })();
          // Sözleşme: openPlayerModal'ın SON parametresi opsiyonel taramaKarti
          // {baslik, posterUrl, altBaslik, kaynakSayisi} — PlayerModal tarafını
          // Agent C uygulayacak; henüz yoksa fazladan argüman zararsızdır.
          const taramaKarti = {
            baslik: title,
            posterUrl: media.poster_path
              ? getImageUrl(media.poster_path, TMDB_IMAGE_SIZES.POSTER_SMALL)
              : '',
            altBaslik: effectiveType === 'movie'
              ? ''
              : `Sezon ${kaynakSecimi.sezon} · Bölüm ${kaynakSecimi.bolum}`,
            kaynakSayisi: kaynakListesi.kaynaklar().length
          };
          // Hata olursa mevcut yol aynen devam eder (regresyon yok); tek fark:
          // geçiş sınıfı ve sayaç burada temizlenir (sızıntı bırakma).
          Promise.resolve(openPlayerModal(istek, taramaKarti)).catch((err) => {
            console.error('[CinePulse] Kaynak açılamadı:', err);
            showToast('Oynatıcı açılırken hata oluştu, lütfen tekrar deneyin.', 'error');
            kaynakSayaciniDurdur();
          });
        }
      });

      // ── Sekmeler ─────────────────────────────────────────────────────────
      // Jenerik data-tab mekanizması: aynı data-panel'e sahip tüm bloklar
      // birlikte görünür (Kadro çipleri + Oyuncular aynı "cast" sekmesinde).
      const sekmeDugmeleri = Array.from(container.querySelectorAll('.cps-sekme-cubugu [data-tab]'));
      const sekmeCubugu = container.querySelector('.cps-sekme-cubugu');
      // Çubuk ekranın dışındaysa getir; görünürse hiç kaydırma yapma.
      const cubuguGoster = () => {
        const kutu = sekmeCubugu?.getBoundingClientRect();
        if (!kutu) return;
        if (kutu.bottom <= 0 || kutu.top >= window.innerHeight) {
          sekmeCubugu.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
      };
      const sekmeleriGec = (hedef) => {
        sekmeDugmeleri.forEach(dugme => {
          const secili = dugme.dataset.tab === hedef;
          dugme.classList.toggle('active', secili);
          dugme.setAttribute('aria-pressed', secili ? 'true' : 'false');
        });
        container.querySelectorAll('.cps-sekme-panel').forEach(panel => {
          panel.hidden = panel.dataset.panel !== hedef;
        });
        container.querySelectorAll('.cps-sekme-panel:not([hidden])').forEach(panel => renderIcons(panel));
        cubuguGoster();
      };

      // Devam Et / bölüm seçimi: KAYNAKLAR sekmesi. Çubuk ekranda ise kaydırma
      // yok — kaynak listesi sekmede hazır; yalnız hero'dan gelirken çubuk getirilir.
      const kaynaklarSekmesineGec = () => {
        sekmeleriGec('sources');
        kaynakListesi.baslat();
      };

      // Kaynak taraması yalnız KAYNAKLAR sekmesi ilk kez görünür olunca başlar.
      const kaynakBolumKok = container.querySelector('#cps-kaynaklar');
      if (kaynakBolumKok && 'IntersectionObserver' in window) {
        const gozcu = new IntersectionObserver((girdiler) => {
          if (girdiler.some(g => g.isIntersecting)) {
            kaynakListesi.baslat();
            gozcu.disconnect();
          }
        }, { rootMargin: '240px' });
        gozcu.observe(kaynakBolumKok);
      }

      sekmeDugmeleri.forEach(dugme => {
        dugme.addEventListener('click', () => {
          const hedef = dugme.dataset.tab;
          sekmeleriGec(hedef);
          if (hedef === 'sources') kaynakListesi.baslat();
        });
      });

      // Dar ekranda varsayılan sekme (filmde OYUNCULAR) çubuğun dışında kalmasın.
      // Yalnız çubuk içinde yatay kaydırılır; sayfa kaymaz.
      const aktifSekme = container.querySelector('.cps-sekme-cubugu [data-tab].active');
      if (aktifSekme) {
        const serit = aktifSekme.parentElement;
        serit.scrollLeft = aktifSekme.offsetLeft - (serit.clientWidth - aktifSekme.offsetWidth) / 2;
      }

      const kaynakSezonSecim = container.querySelector('#kaynak-sezon-secim');
      const kaynakBolumSecim = container.querySelector('#kaynak-bolum-secim');
      const bolumleriDoldur = (sezonNo, seciliBolum = 1) => {
        if (!kaynakBolumSecim) return;
        const adet = kaynakSezonlari.find(s => s.season_number === Number(sezonNo))?.episode_count || 10;
        kaynakBolumSecim.innerHTML = Array.from({ length: adet }, (_, i) =>
          `<option value="${i + 1}" ${i + 1 === Number(seciliBolum) ? 'selected' : ''}>${i + 1}. Bölüm</option>`).join('');
      };
      kaynakSezonSecim?.addEventListener('change', () => {
        kaynakSecimi = { sezon: Number(kaynakSezonSecim.value) || 1, bolum: 1 };
        bolumleriDoldur(kaynakSecimi.sezon, 1);
        kaynakListesi.bolumAyarla(kaynakSecimi.sezon, kaynakSecimi.bolum);
      });
      kaynakBolumSecim?.addEventListener('change', () => {
        kaynakSecimi.bolum = Number(kaynakBolumSecim.value) || 1;
        kaynakListesi.bolumAyarla(kaynakSecimi.sezon, kaynakSecimi.bolum);
      });

      // Bölüm kartı tıklaması (SeasonSelector) buraya bölüm bilgisi bırakır:
      // oynatıcı açılmaz, KAYNAKLAR sekmesi o bölümle açılır.
      container.addEventListener('cp:kaynak-bolum', (olay) => {
        if (!container.isConnected) return;
        const sezonNo = Number(olay.detail?.sezon) || 1;
        const bolumNo = Number(olay.detail?.bolum) || 1;
        kaynakSecimi = { sezon: sezonNo, bolum: bolumNo };
        if (kaynakSezonSecim) kaynakSezonSecim.value = String(sezonNo);
        bolumleriDoldur(sezonNo, bolumNo);
        kaynakListesi.bolumAyarla(sezonNo, bolumNo);
        kaynaklarSekmesineGec();
      });

      const backBtn = container.querySelector('#btn-detail-back');
      if (backBtn) {
        backBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (window.history.length > 1) {
            window.history.back();
          } else {
            window.location.hash = '#home';
          }
        });
      }

      if (seasonSelectorObj) seasonSelectorObj.init(container);
      const spoilerToggle = container.querySelector('#detail-spoiler-free-toggle');
      if (spoilerToggle) {
        spoilerToggle.checked = spoilerFreeEnabled;
        spoilerToggle.addEventListener('change', () => {
          spoilerFreeEnabled = spoilerToggle.checked;
          seasonSelectorObj?.setSpoilerSafe(spoilerFreeEnabled);
          showToast(spoilerFreeEnabled ? 'Spoilersız keşif açıldı. Sonraki bölüm detayları gizlendi.' : 'Spoilersız keşif kapatıldı.', 'info');
        });
      }

      const playMovieBtn = container.querySelector('#btn-play-movie');
      const openMovie = async () => {
        if (!playMovieBtn || playMovieBtn.disabled) return;
          playMovieBtn.disabled = true;
          const origHTML = playMovieBtn.innerHTML;
          playMovieBtn.innerHTML = `<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px;fill:currentColor"></i> <span>Yükleniyor...</span>`;
          renderIcons();
          try {
            const progress = getMediaProgress(id, 1, 1);
            await openPlayerModal({
              type: isAnime ? 'anime' : 'movie',
              isAnime,
              tmdbId: id,
              title: title,
              seriesTitle: title,
              originalTitle: originalTitle,
              posterPath: media.poster_path,
              backdropPath: media.backdrop_path,
              duration: movieDurationSec,
              currentTime: progress ? progress.currentTime : 0,
              roomSync: decisionRoomAutoplay ? { roomCode: decisionRoomAutoplay.roomCode, mediaId: id, type: effectiveType, season: 1, episode: 1, initialSync: decisionRoomAutoplay.initialSync || null } : null
            });
          } catch (err) {
            console.error('[CinePulse] Film oynatılamadı:', err);
            showToast('Film açılırken hata oluştu, lütfen tekrar deneyin.', 'error');
          } finally {
            playMovieBtn.disabled = false;
            playMovieBtn.innerHTML = origHTML;
            renderIcons();
          }
      };
      if (playMovieBtn) {
        // Detay sayfası oynatıcı AÇMAZ: film İzle düğmesi KAYNAKLAR sekmesine geçer.
        playMovieBtn.addEventListener('click', (event) => {
          event.preventDefault();
          kaynaklarSekmesineGec();
        });
      }

      const resumeSeriesBtn = container.querySelector('#btn-resume-series');
      const openSeries = async () => {
        if (!resumeSeriesBtn || resumeSeriesBtn.disabled) return;
          resumeSeriesBtn.disabled = true;
          const origHTML = resumeSeriesBtn.innerHTML;
          resumeSeriesBtn.innerHTML = `<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px;fill:currentColor"></i> <span>Yükleniyor...</span>`;
          renderIcons();
          try {
            const selectedByRoom = decisionRoomAutoplay;
            decisionRoomAutoplay = null;
            const lastWatched = getLastWatchedEpisode(id);
            const seasonNum = selectedByRoom?.season || (lastWatched ? lastWatched.season : 1);
            const episodeNum = selectedByRoom?.episode || (lastWatched ? lastWatched.episode : 1);
            const currentTime = selectedByRoom ? 0 : (lastWatched ? lastWatched.currentTime : 0);
            await openPlayerModal({
              type: isAnime ? 'anime' : 'tv',
              isAnime,
              tmdbId: id,
              title: `${title} - S${seasonNum}E${episodeNum}`,
              seriesTitle: title,
              originalTitle: originalTitle,
              season: seasonNum,
              episode: episodeNum,
              posterPath: media.poster_path,
              backdropPath: media.backdrop_path,
              currentTime,
              seasonsList: media.seasons || [],
              roomSync: selectedByRoom ? { roomCode: selectedByRoom.roomCode, mediaId: id, type: effectiveType, season: seasonNum, episode: episodeNum, initialSync: selectedByRoom.initialSync || null } : null
            });
          } catch (err) {
            console.error('[CinePulse] Dizi oynatılamadı:', err);
            showToast('İçerik açılırken hata oluştu, lütfen tekrar deneyin.', 'error');
          } finally {
            resumeSeriesBtn.disabled = false;
            resumeSeriesBtn.innerHTML = origHTML;
            renderIcons();
          }
      };
      if (resumeSeriesBtn) {
        // Dizide "Devam Et" de oynatıcı açmaz; KAYNAKLAR sekmesine geçer.
        resumeSeriesBtn.addEventListener('click', event => {
          event.preventDefault();
          kaynaklarSekmesineGec();
        });
      }

      // Moderatör “Birlikte Aç” dediğinde her cihaz detay sayfasına uğramadan
      // doğrudan kendi oynatıcısını açar. Olay sessionStorage'da tek kullanımlık
      // tutulur; normal detay ziyaretleri otomatik oynatılmaz.
      if (decisionRoomAutoplay) {
        // Programatik .click(), bazı mobil tarayıcılarda etkileşim olarak
        // değerlendirilmediği için hiç çalışmayabiliyor. Oynatıcı akışını
        // doğrudan çağırmak, oda sahibi içeriği açtığı anda her cihazda
        // pencerenin kesin açılmasını sağlar.
        window.setTimeout(() => {
          if (effectiveType === 'movie') openMovie();
          else openSeries();
        }, 0);
      }

      // Fragman kartları: sayfa İÇİNDE video embed kaldırıldı (oyuncu artığı
      // hissi yasak, kullanıcı 2026-10-28); kart fragmanı TrailerModal'da açar.
      container.querySelectorAll('.dt-fragman-kart').forEach(kart => {
        kart.addEventListener('click', () => {
          const videoKey = kart.getAttribute('data-video-key');
          if (!videoKey) return;
          openTrailerModal({
            title,
            trailerInfo: {
              embedUrl: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoKey)}?autoplay=1&controls=1&modestbranding=1&rel=0&playsinline=1`,
              name: kart.getAttribute('data-video-title') || 'Resmi Fragman'
            },
            mediaId: id,
            mediaType: effectiveType === 'movie' ? 'movie' : 'tv'
          });
        });
      });

      // Bayrak düğmesi: yerel işaretleme (sunucu yok), ikon dolgusu anında döner.
      const bayrakBtn = container.querySelector('#btn-toggle-bayrak');
      bayrakBtn?.addEventListener('click', () => {
        const aktif = bayrakToggle(id);
        bayrakBtn.classList.toggle('is-active', aktif);
        const ikon = bayrakBtn.querySelector('i');
        if (ikon) ikon.style.cssText = aktif
          ? 'width:16px;height:16px;fill:currentColor'
          : 'width:16px;height:16px;';
        showToast(aktif ? 'İçerik bayraklandı — tekrar dokununca kaldırılır.' : 'Bayrak kaldırıldı.', 'info');
      });

      const favBtn = container.querySelector('#btn-toggle-fav');
      if (favBtn) {
        favBtn.addEventListener('click', () => {
          const added = toggleFavorite({ ...media, type: isAnime ? 'anime' : effectiveType, isAnime, media_type: effectiveType });
          showToast(added ? 'Favorilere eklendi!' : 'Favorilerden çıkarıldı.', added ? 'success' : 'info');
          favBtn.classList.toggle('is-active', added);
          const icon = favBtn.querySelector('i');
          const text = favBtn.querySelector('span');
          if (icon && text) {
            icon.style.fill = added ? 'var(--primary)' : 'none';
            icon.style.color = added ? 'var(--primary)' : 'currentColor';
            text.textContent = added ? 'Favorilerimde' : 'Favorilere Ekle';
          }
        });
      }

      const watchBtn = container.querySelector('#btn-toggle-watchlist');
      if (watchBtn) {
        watchBtn.addEventListener('click', () => {
          const added = toggleWatchlist({ ...media, type: isAnime ? 'anime' : effectiveType, isAnime, media_type: effectiveType });
          showToast(added ? 'İzleme listesine eklendi!' : 'İzleme listesinden çıkarıldı.', added ? 'success' : 'info');
          watchBtn.classList.toggle('is-active', added);
          const icon = watchBtn.querySelector('i');
          const text = watchBtn.querySelector('span');
          if (icon && text) {
            icon.setAttribute('data-lucide', added ? 'check' : 'plus');
            renderIcons();
            text.textContent = added ? 'Listemde' : 'İzleme Listeme Ekle';
          }
        });
      }

      // Mark Watched Detail Action
      const watchedDetailBtn = container.querySelector('#btn-toggle-watched-detail');
      if (watchedDetailBtn) {
        watchedDetailBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (effectiveType === 'movie') {
            const updated = toggleEpisodeWatched(id, 1, 1, {
              title: title,
              posterPath: media.poster_path,
              backdropPath: media.backdrop_path,
              type: 'movie',
              duration: movieDurationSec
            });
            const nowWatched = updated.completed;
            showToast(nowWatched ? '✓ Film izlendi olarak işaretlendi!' : 'Film izlendi işareti kaldırıldı.', nowWatched ? 'success' : 'info');
            
            if (nowWatched) {
              watchedDetailBtn.classList.add('is-active', 'btn-watched-active');
            } else {
              watchedDetailBtn.classList.remove('is-active', 'btn-watched-active');
            }
            const movieWatchedLabel = nowWatched ? 'Film İzlendi' : 'İzlendi Olarak İşaretle';
            watchedDetailBtn.title = movieWatchedLabel;
            watchedDetailBtn.setAttribute('aria-label', movieWatchedLabel);
            watchedDetailBtn.innerHTML = `
              <i data-lucide="${nowWatched ? 'check-circle-2' : 'check'}" style="width:18px;height:18px;"></i>
              <span class="cps-gizli">${movieWatchedLabel}</span>
            `;
            renderIcons();
          } else {
            // TV / Anime / Doc Series Bulk Watched
            const currentAllWatched = isEntireSeriesWatched(id, media.seasons || []);
            const targetState = !currentAllWatched;

            markAllEpisodesWatched(id, media.seasons || [], targetState, {
              title: title,
              posterPath: media.poster_path,
              backdropPath: media.backdrop_path,
              type: isAnime ? 'anime' : 'tv',
              isAnime
            });

            showToast(targetState ? '✓ Dizinin tüm bölümleri izlendi olarak işaretlendi!' : 'Tüm bölümler izlenmedi yapıldı.', targetState ? 'success' : 'info');

            if (targetState) {
              watchedDetailBtn.classList.add('is-active', 'btn-watched-active');
            } else {
              watchedDetailBtn.classList.remove('is-active', 'btn-watched-active');
            }
            const tvWatchedLabel = targetState ? 'Tüm Sezonlar İzlendi' : 'Tümünü İzlendi İşaretle';
            watchedDetailBtn.title = tvWatchedLabel;
            watchedDetailBtn.setAttribute('aria-label', tvWatchedLabel);
            watchedDetailBtn.innerHTML = `
              <i data-lucide="${targetState ? 'check-circle-2' : 'check'}" style="width:18px;height:18px;"></i>
              <span class="cps-gizli">${tvWatchedLabel}</span>
            `;
            renderIcons();

            // Update all episode cards in DOM
            container.querySelectorAll('.episode-card').forEach(card => {
              const badgeEl = card.querySelector('.badge-watched-status');
              const btnEl = card.querySelector('.btn-mark-ep-watched');
              if (badgeEl) {
                badgeEl.innerHTML = `<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ`;
                badgeEl.style.background = 'var(--accent-green)';
                badgeEl.style.color = '#fff';
                badgeEl.style.display = targetState ? 'inline-flex' : 'none';
              }
              if (btnEl) {
                if (targetState) {
                  btnEl.classList.add('watched');
                  btnEl.style.background = '#10b981';
                  btnEl.style.borderColor = '#10b981';
                } else {
                  btnEl.classList.remove('watched');
                  btnEl.style.background = 'rgba(0,0,0,0.65)';
                  btnEl.style.borderColor = 'rgba(255,255,255,0.3)';
                }
              }
            });

            const seasonAllBtn = container.querySelector('#btn-mark-season-all');
            if (seasonAllBtn) {
              const span = seasonAllBtn.querySelector('span');
              const icon = seasonAllBtn.querySelector('i');
              if (span) span.textContent = targetState ? 'Bu Sezon İzlendi' : 'Bu Sezonu İzlendi İşaretle';
              if (icon) icon.setAttribute('data-lucide', targetState ? 'check-circle-2' : 'check-check');
              if (targetState) {
                seasonAllBtn.style.background = 'rgba(16, 185, 129, 0.2)';
                seasonAllBtn.style.borderColor = '#10b981';
                seasonAllBtn.style.color = '#10b981';
              } else {
                seasonAllBtn.style.background = '';
                seasonAllBtn.style.borderColor = '';
                seasonAllBtn.style.color = '';
              }
            }

            renderIcons();
          }
        });
      }

      // Real-time synchronization on Detail View without page refresh
      const onDetailDataChanged = (e) => {
        if (e && e.detail && e.detail.isProgressUpdate && document.getElementById('player-modal')) return;
        const isMovieWatched = effectiveType === 'movie' ? isMediaWatched(id, 1, 1) : false;
        const isSeriesAllWatched = effectiveType === 'tv' ? isEntireSeriesWatched(id, media.seasons || []) : false;
        const isWatched = effectiveType === 'movie' ? isMovieWatched : isSeriesAllWatched;

        if (watchedDetailBtn) {
          if (isWatched) {
            watchedDetailBtn.classList.add('is-active', 'btn-watched-active');
          } else {
            watchedDetailBtn.classList.remove('is-active', 'btn-watched-active');
          }
          const label = effectiveType === 'movie'
            ? (isWatched ? 'Film İzlendi' : 'İzlendi Olarak İşaretle')
            : (isWatched ? 'Tüm Sezonlar İzlendi' : 'Tümünü İzlendi İşaretle');

          watchedDetailBtn.title = label;
          watchedDetailBtn.setAttribute('aria-label', label);
          watchedDetailBtn.innerHTML = `
            <i data-lucide="${isWatched ? 'check-circle-2' : 'check'}" style="width:18px;height:18px;"></i>
            <span class="cps-gizli">${label}</span>
          `;
        }

        const playMovieBtn = container.querySelector('#btn-play-movie');
        if (playMovieBtn && effectiveType === 'movie') {
          const mp = getMediaProgress(id, 1, 1);
          if (mp && mp.currentTime > 0 && !mp.completed) {
            const timeStr = formatSecondsToTime(mp.currentTime);
            playMovieBtn.innerHTML = `<i data-lucide="play" style="fill:currentColor"></i> <span>Devam Et <span class="play-btn-subinfo">${timeStr}</span></span>`;
          }
        }

        const resumeBtn = container.querySelector('#btn-resume-series');
        if (resumeBtn && effectiveType === 'tv') {
          const lastWatched = getLastWatchedEpisode(id);
          if (lastWatched) {
            const timeStr = formatSecondsToTime(lastWatched.currentTime);
            resumeBtn.innerHTML = `<i data-lucide="play" style="fill:currentColor"></i> <span>Devam Et <span class="play-btn-subinfo">S${lastWatched.season} B${lastWatched.episode}${timeStr ? ' • ' + timeStr : ''}</span></span>`;
          }
        }

        renderIcons();
      };

      window.addEventListener('sineflix_data_changed', onDetailDataChanged);

      // Halfway in-progress button handler
      const halfwayBtn = container.querySelector('#btn-mark-halfway-detail');

      // #15: paylaşım (bağlantı + QR).
      container.querySelector('#btn-share-detail')?.addEventListener('click', async () => {
        const { openPaylasModal } = await import('../components/PaylasModal.js');
        openPaylasModal({ type: effectiveType, id, title });
      });
      if (halfwayBtn) {
        halfwayBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (effectiveType === 'movie') {
            const halfwayTime = Math.round(movieDurationSec * 0.5);
            const timeStr = formatSecondsToTime(halfwayTime);
            setMediaHalfway(id, 1, 1, halfwayTime, {
              title: title,
              posterPath: media.poster_path,
              backdropPath: media.backdrop_path,
              type: isAnime ? 'anime' : 'movie',
              isAnime,
              duration: movieDurationSec
            });
            showToast(`⏳ Film ${timeStr} dakikasında yarıda bırakıldı olarak işaretlendi!`, 'info');
            const playBtnSpan = container.querySelector('#btn-play-movie span');
            if (playBtnSpan) playBtnSpan.textContent = `Kaldığın Yerden Devam Et (${timeStr})`;
          } else {
            const seasonNum = lastWatchedEp ? lastWatchedEp.season : 1;
            const epNum = lastWatchedEp ? lastWatchedEp.episode : 1;
            setMediaHalfway(id, seasonNum, epNum, 1200, {
              title: title,
              posterPath: media.poster_path,
              backdropPath: media.backdrop_path,
              type: isAnime ? 'anime' : 'tv',
              isAnime,
              duration: 3000
            });
            showToast(`⏳ S${seasonNum} B${epNum} 20. dakikada yarıda bırakıldı olarak işaretlendi!`, 'info');
            const resumeBtnSpan = container.querySelector('#btn-resume-series span');
            if (resumeBtnSpan) resumeBtnSpan.textContent = `Kaldığın Yerden Devam Et (S${seasonNum} B${epNum} • 20:00)`;
          }
        });
      }

      // Storyline expand/collapse
      const expandBtn = container.querySelector('#btn-expand-storyline');
      const storylineEl = container.querySelector('#detail-storyline-text');
      if (expandBtn && storylineEl) {
        expandBtn.addEventListener('click', () => {
          const isExpanded = !storylineEl.classList.contains('truncated');
          storylineEl.classList.toggle('truncated');
          const span = expandBtn.querySelector('span');
          const icon = expandBtn.querySelector('i');
          if (span) span.textContent = isExpanded ? 'Daha fazla' : 'Daralt';
          if (icon) icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
        });
      }

      // Kadro çipleri -> filmografi keşfi
      container.querySelectorAll('.cps-kisi[data-person-id]').forEach(cip => {
        cip.addEventListener('click', (e) => {
          e.preventDefault();
          const personId = cip.getAttribute('data-person-id');
          if (personId) openCastExplorerModal(personId, cip.getAttribute('data-person-name'));
        });
      });

      // Netflix Cast Grid Cards Click -> Open Filmography Explorer
      container.querySelectorAll('.netflix-cast-card').forEach(card => {
        card.addEventListener('click', (e) => {
          e.preventDefault();
          const personId = card.getAttribute('data-person-id');
          const personName = card.getAttribute('data-person-name');
          if (personId) {
            openCastExplorerModal(personId, personName);
          }
        });
      });

      // Show More Cast Members Toggle
      const showMoreCastBtn = container.querySelector('#btn-show-more-cast');
      if (showMoreCastBtn) {
        showMoreCastBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const hiddenCards = container.querySelectorAll('.netflix-cast-card.cast-card-hidden');
          hiddenCards.forEach(c => c.classList.remove('cast-card-hidden'));
          showMoreCastBtn.style.display = 'none';
          renderIcons();
        });
      }

      // TVmaze yayın takvimi: "Yeni bölüm S3 B5 • 3 gün sonra" rozeti (progresif, bloklamaz)
      const nextEpisodeBadge = container.querySelector('#detail-next-episode-badge');
      if (nextEpisodeBadge && effectiveType === 'tv') {
        (async () => {
          try {
            const info = await getNextEpisodeInfo({
              imdbId: media.external_ids?.imdb_id,
              title: originalTitle || title,
              year
            });
            if (!info?.nextEpisode || !nextEpisodeBadge.isConnected) return;

            const epLabel = info.nextLabel || '';
            const dateLabel = info.nextAirdateLabel || '';
            if (!epLabel && !dateLabel) return;
            if (dateLabel === 'Yayınlandı') return; // geçmiş bölüm bilgisini gösterme

            const badgeText = [epLabel ? `Yeni bölüm ${epLabel}` : 'Yeni bölüm', dateLabel]
              .filter(Boolean)
              .join(' • ');
            nextEpisodeBadge.innerHTML = `<i data-lucide="calendar-clock" style="width:13px; height:13px"></i><span>${badgeText}</span>`;
            nextEpisodeBadge.title = `Sonraki bölüm: ${epLabel || '-'}${info.nextEpisode.name ? ' — ' + info.nextEpisode.name : ''}${dateLabel ? ' • ' + dateLabel : ''} (Kaynak: TVmaze)`;
            nextEpisodeBadge.style.display = 'inline-flex';
            renderIcons(nextEpisodeBadge);
          } catch (_) {
            // Takvim bilgisi opsiyoneldir; hata durumunda rozet gizli kalır
          }
        })();
      }

      const recGrid = container.querySelector('.media-grid');
      if (recGrid) attachMediaCardEvents(recGrid);
    }
  };
}