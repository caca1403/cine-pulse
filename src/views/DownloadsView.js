import { deleteOfflineMedia, formatBytes, getDeviceStorageInfo, getDownloadedMediaList, getDownloadedPlaybackUrl, getOfflinePosterUrl } from '../services/offlineManager.js';
import { openPlayerModal } from '../components/openPlayer.js';
import { renderIcons } from '../services/icons.js';
import { showToast } from '../components/Toast.js';
import { getImageUrl, SINEFLIX_POSTER_FALLBACK, TMDB_IMAGE_SIZES } from '../services/tmdbApi.js';

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const episodeOrder = (a, b) => (Number(a.season) - Number(b.season)) || (Number(a.episode) - Number(b.episode));

export function renderDownloadsView() {
  return {
    html: `
      <section class="downloads-page" id="downloads-page">
        <header class="downloads-page-header">
          <div class="downloads-page-icon"><i data-lucide="download"></i></div>
          <div><span class="downloads-kicker">BU CİHAZDA</span><h1>İndirilenler</h1><p>Dizilerin ve bölümlerin çevrimdışı izlemeye hazır.</p></div>
        </header>
        <div class="downloads-storage-card">
          <div class="downloads-storage-copy"><span>Yerel depolama</span><strong id="downloads-storage-text">Kullanım hesaplanıyor…</strong></div>
          <div class="downloads-storage-track"><span id="downloads-storage-fill"></span></div>
          <small id="downloads-storage-note">İndirilen dosyalar yalnızca bu cihazda saklanır.</small>
        </div>
        <div class="downloads-list-heading"><h2>Kaydedilen diziler ve filmler</h2><span id="downloads-total">0 içerik</span></div>
        <div class="downloads-list" id="downloads-list"><div class="downloads-loading"><i data-lucide="loader-circle"></i><span>İndirilenler yükleniyor…</span></div></div>
      </section>`,
    init: container => {
      const page = container.querySelector('#downloads-page');
      const list = page?.querySelector('#downloads-list');
      if (!page || !list) return;

      const updateStorage = async () => {
        try {
          const { total = 0, free = 0, isOriginQuota = false } = await getDeviceStorageInfo();
          const used = Math.max(0, total - free);
          const pct = total ? Math.min(100, Math.round(used / total * 100)) : 0;
          page.querySelector('#downloads-storage-text').textContent = total
            ? `${formatBytes(free)} boş · ${formatBytes(total)} toplam${isOriginQuota ? ' (uygulama alanı)' : ''}`
            : 'Depolama bilgisi alınamadı';
          page.querySelector('#downloads-storage-fill').style.width = `${pct}%`;
        } catch (_) { page.querySelector('#downloads-storage-text').textContent = 'Depolama bilgisi alınamadı'; }
      };

      const play = async (item, button) => {
        button.disabled = true;
        try {
          const offlinePlaybackUrl = await getDownloadedPlaybackUrl(item.tmdbId, item.season, item.episode);
          if (!offlinePlaybackUrl) throw new Error('İndirilen video bulunamadı.');
          const isEpisode = item.season !== null && item.episode !== null;
          const seriesTitle = item.seriesTitle || item.title.replace(/\s*[·-]\s*\d+\. Sezon\s+\d+\. Bölüm\s*$/i, '');
          openPlayerModal({
            type: item.type === 'movie' ? 'movie' : 'tv', isSeries: isEpisode, isAnime: item.type === 'anime',
            tmdbId: item.tmdbId, title: item.title, seriesTitle: isEpisode ? seriesTitle : '',
            season: item.season || 1, episode: item.episode || 1,
            posterPath: item.poster || '', backdropPath: item.backdrop || '', offlinePlaybackUrl,
            offlineMediaKind: item.mediaKind || 'file'
          });
        } catch (error) { showToast(error?.message || 'İndirilen içerik açılamadı.', 'error'); }
        finally { button.disabled = false; }
      };

      const remove = async item => {
        const label = item.season !== null ? `${item.title} · S${item.season} B${item.episode}` : item.title;
        if (!window.confirm(`“${label}” cihazdan silinsin mi?`)) return;
        await deleteOfflineMedia(item.tmdbId, item.season, item.episode);
        await render();
        await updateStorage();
        showToast('İndirilen içerik silindi.', 'success');
      };

      const render = async () => {
        const items = await getDownloadedMediaList();
        if (!page.isConnected) return;
        const seriesGroups = new Map();
        const movies = [];
        for (const item of items) {
          if (item.season !== null && item.episode !== null) {
            const groupKey = String(item.tmdbId);
            if (!seriesGroups.has(groupKey)) seriesGroups.set(groupKey, []);
            seriesGroups.get(groupKey).push(item);
          } else movies.push(item);
        }
        const groups = [...seriesGroups.values()].map(episodes => ({
          title: episodes[0].seriesTitle || episodes[0].title.replace(/\s*[·-]\s*\d+\. Sezon\s+\d+\. Bölüm\s*$/i, ''), tmdbId: episodes[0].tmdbId, poster: episodes.find(ep => ep.poster)?.poster || '',
          posterCacheKey: episodes.find(ep => ep.posterCacheKey)?.posterCacheKey || `series_${episodes[0].tmdbId}`,
          backdrop: episodes.find(ep => ep.backdrop)?.backdrop || '', episodes: episodes.sort(episodeOrder),
          latest: Math.max(...episodes.map(ep => ep.downloadedAt || 0)), type: 'series'
        }));
        const content = [...groups, ...movies.map(item => ({ ...item, type: 'movie-card' }))]
          .sort((a, b) => (b.latest || b.downloadedAt || 0) - (a.latest || a.downloadedAt || 0));
        page.querySelector('#downloads-total').textContent = `${content.length} içerik · ${items.length} dosya`;
        if (!content.length) {
          list.innerHTML = `<div class="downloads-empty"><i data-lucide="cloud-download"></i><h3>Henüz içerik indirmedin</h3><p>Bir bölümü oynatıcıda açıp <b>İndir</b> düğmesine bas. İndirme ilerlemesini oradan görebilirsin.</p><a href="#home" class="downloads-browse-btn"><i data-lucide="compass"></i> İçeriklere göz at</a></div>`;
          renderIcons(list);
          return;
        }
        list.innerHTML = content.map((entry, index) => {
          const poster = escapeHtml(getImageUrl(entry.poster || '', TMDB_IMAGE_SIZES.POSTER_MEDIUM));
          const posterSource = escapeHtml(entry.poster || '');
          const posterCacheKey = escapeHtml(entry.posterCacheKey || (entry.type === 'movie-card' ? `media_${entry.key}` : ''));
          if (entry.type === 'series') {
            const downloadedBytes = entry.episodes.reduce((sum, ep) => sum + (Number(ep.sizeBytes) || 0), 0);
            const seasons = [...new Set(entry.episodes.map(ep => Number(ep.season)))].sort((a, b) => a - b);
            return `<article class="download-series-card" data-group="${index}">
              <button type="button" class="download-series-open" aria-expanded="false">
                <span class="download-series-poster"><img src="${poster || SINEFLIX_POSTER_FALLBACK}" data-offline-poster-key="${posterCacheKey}" data-offline-poster-source="${posterSource}" onerror="this.onerror=null;this.src='${SINEFLIX_POSTER_FALLBACK}'" alt="${escapeHtml(entry.title)} afişi" loading="lazy"></span>
                <span class="download-series-info"><strong>${escapeHtml(entry.title)}</strong><span>${entry.episodes.length} bölüm · ${seasons.length} sezon</span><small>${formatBytes(downloadedBytes)} · İnternetsiz izlenebilir</small><span class="download-ready-inline"><i data-lucide="check"></i> İNDİRİLDİ</span></span>
                <span class="download-series-chevron"><i data-lucide="chevron-down"></i></span>
              </button>
              <div class="download-episodes" hidden>${seasons.map(season => {
                const seasonEpisodes = entry.episodes.filter(ep => Number(ep.season) === season);
                return `<details class="download-season"><summary>Sezon ${season}<small>${seasonEpisodes.length} indirilen bölüm</small></summary><div class="download-season-list">${seasonEpisodes.map(ep => `<article class="download-episode-row" data-item-key="${escapeHtml(ep.key)}"><span class="download-episode-number">${String(ep.episode).padStart(2, '0')}</span><span class="download-episode-info"><strong>${escapeHtml(ep.title)}</strong><small>Bölüm ${ep.episode} · ${formatBytes(ep.sizeBytes)} · ${new Date(ep.downloadedAt || Date.now()).toLocaleDateString('tr-TR')}</small></span><button class="download-episode-play" type="button" aria-label="Bölüm ${ep.episode} oynat"><i data-lucide="play"></i></button><button class="download-episode-delete" type="button" aria-label="Bölüm ${ep.episode} sil"><i data-lucide="trash-2"></i></button></article>`).join('')}</div></details>`;
              }).join('')}</div>
            </article>`;
          }
          return `<article class="download-movie-card" data-item-key="${escapeHtml(entry.key)}">
            <span class="download-series-poster"><img src="${poster || SINEFLIX_POSTER_FALLBACK}" data-offline-poster-key="${posterCacheKey}" data-offline-poster-source="${posterSource}" onerror="this.onerror=null;this.src='${SINEFLIX_POSTER_FALLBACK}'" alt="${escapeHtml(entry.title)} afişi" loading="lazy"></span>
            <div class="download-series-info"><strong>${escapeHtml(entry.title)}</strong><span>Film</span><small>${formatBytes(entry.sizeBytes)} · İnternetsiz izlenebilir</small><span class="download-ready-inline"><i data-lucide="check"></i> İNDİRİLDİ</span></div>
            <div class="download-movie-actions"><button class="download-movie-play" type="button"><i data-lucide="play"></i> Oynat</button><button class="download-episode-delete" type="button" aria-label="Filmi sil"><i data-lucide="trash-2"></i></button></div>
          </article>`;
        }).join('');
        renderIcons(list);
        list.querySelectorAll('img[data-offline-poster-key]').forEach(async image => {
          const cachedPoster = await getOfflinePosterUrl(image.dataset.offlinePosterKey, image.dataset.offlinePosterSource || '');
          if (cachedPoster && image.isConnected) {
            image.onerror = null;
            image.src = cachedPoster;
          }
        });
        list.querySelectorAll('.download-series-card').forEach((card, index) => {
          const entry = content.filter(item => item.type === 'series')[index];
          const trigger = card.querySelector('.download-series-open');
          const episodes = card.querySelector('.download-episodes');
          trigger.addEventListener('click', () => {
            const open = trigger.getAttribute('aria-expanded') !== 'true';
            if (open) {
              list.querySelectorAll('.download-series-open[aria-expanded="true"]').forEach(other => {
                if (other !== trigger) {
                  other.setAttribute('aria-expanded', 'false');
                  other.closest('.download-series-card')?.querySelector('.download-episodes')?.setAttribute('hidden', '');
                }
              });
            }
            trigger.setAttribute('aria-expanded', String(open));
            episodes.hidden = !open;
          });
          card.querySelectorAll('.download-episode-row').forEach((row, epIndex) => {
            const episode = entry.episodes.find(ep => String(ep.key) === row.dataset.itemKey);
            row.querySelector('.download-episode-play').addEventListener('click', event => play(episode, event.currentTarget));
            row.querySelector('.download-episode-delete').addEventListener('click', () => remove(episode));
          });
        });
        list.querySelectorAll('.download-movie-card').forEach(card => {
          const movie = movies.find(item => String(item.key) === card.dataset.itemKey);
          card.querySelector('.download-movie-play').addEventListener('click', event => play(movie, event.currentTarget));
          card.querySelector('.download-episode-delete').addEventListener('click', () => remove(movie));
        });
      };

      updateStorage();
      render();
      window.addEventListener('cinepulse_offline_changed', () => { render(); updateStorage(); });
      renderIcons(page);
    }
  };
}
