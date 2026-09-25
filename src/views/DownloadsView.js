import { deleteOfflineMedia, formatBytes, getDownloadedMediaList, getDownloadedPlaybackUrl } from '../services/offlineManager.js';
import { isNativeAndroidApp } from '../services/appUpdater.js';
import { openPlayerModal } from '../components/openPlayer.js';
import { renderIcons } from '../services/icons.js';
import { showToast } from '../components/Toast.js';

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
        <div class="downloads-list-heading"><h2>Kaydedilen içerikler</h2><span id="downloads-total">0 öğe</span></div>
        <div class="downloads-list" id="downloads-list"><div class="downloads-loading"><i data-lucide="loader-circle"></i><span>İndirilenler yükleniyor…</span></div></div>
      </section>`,
    init: container => {
      if (!isNativeAndroidApp()) return;
      const page = container.querySelector('#downloads-page');
      const list = page?.querySelector('#downloads-list');
      if (!page || !list) return;

      const updateStorage = async () => {
        try {
          const { usage = 0, quota = 0 } = await navigator.storage.estimate();
          const pct = quota ? Math.min(100, Math.round(usage / quota * 100)) : 0;
          page.querySelector('#downloads-storage-text').textContent = quota
            ? `${formatBytes(usage)} kullanılıyor · ${formatBytes(Math.max(0, quota - usage))} boş`
            : `${formatBytes(usage)} kullanılıyor`;
          page.querySelector('#downloads-storage-fill').style.width = `${pct}%`;
        } catch (_) {
          page.querySelector('#downloads-storage-text').textContent = 'Depolama bilgisi alınamadı';
        }
      };

      const render = async () => {
        const items = await getDownloadedMediaList();
        if (!page.isConnected) return;
        page.querySelector('#downloads-total').textContent = `${items.length} öğe`;
        if (!items.length) {
          list.innerHTML = `<div class="downloads-empty"><i data-lucide="cloud-download"></i><h3>Henüz içerik indirmedin</h3><p>Bir bölümü oynatıcıda açıp <b>İndir</b> düğmesine bas. İndirme ilerlemesini oradan görebilirsin.</p><a href="#home" class="downloads-browse-btn"><i data-lucide="compass"></i> İçeriklere göz at</a></div>`;
          renderIcons(list);
          return;
        }
        list.innerHTML = items.map((item, index) => `
          <article class="download-item" data-index="${index}">
            <div class="download-item-art">${item.backdrop || item.poster ? `<img src="${item.backdrop || item.poster}" alt="" loading="lazy" />` : '<i data-lucide="clapperboard"></i>'}<span><i data-lucide="check"></i> HAZIR</span></div>
            <div class="download-item-main"><h3>${item.title}</h3><p>${item.season !== null && item.episode !== null ? `Sezon ${item.season} · Bölüm ${item.episode}` : 'Film'} <b>·</b> ${formatBytes(item.sizeBytes)}</p><small>${new Date(item.downloadedAt || Date.now()).toLocaleDateString('tr-TR')} · İnternetsiz oynatılabilir</small></div>
            <button class="download-item-play" type="button" aria-label="İndirilen içeriği oynat"><i data-lucide="play"></i><span>Oynat</span></button>
            <button class="download-item-delete" type="button" aria-label="İndirilen içeriği sil"><i data-lucide="trash-2"></i></button>
          </article>`).join('');
        renderIcons(list);
        list.querySelectorAll('.download-item').forEach((row, index) => {
          const item = items[index];
          row.querySelector('.download-item-play').addEventListener('click', async event => {
            const button = event.currentTarget;
            button.disabled = true;
            try {
              const offlinePlaybackUrl = await getDownloadedPlaybackUrl(item.tmdbId, item.season, item.episode);
              if (!offlinePlaybackUrl) throw new Error('İndirilen video bulunamadı.');
              openPlayerModal({
                type: item.type === 'movie' ? 'movie' : 'tv', tmdbId: item.tmdbId, title: item.title,
                seriesTitle: item.title, season: item.season || 1, episode: item.episode || 1,
                posterPath: item.poster || '', backdropPath: item.backdrop || '', offlinePlaybackUrl,
                offlineMediaKind: item.mediaKind || 'file'
              });
            } catch (error) { showToast(error?.message || 'İndirilen içerik açılamadı.', 'error'); }
            finally { button.disabled = false; }
          });
          row.querySelector('.download-item-delete').addEventListener('click', async () => {
            if (!window.confirm(`“${item.title}” cihazdan silinsin mi?`)) return;
            await deleteOfflineMedia(item.tmdbId, item.season, item.episode);
            await render();
            await updateStorage();
            showToast('İndirilen içerik silindi.', 'success');
          });
        });
      };

      updateStorage();
      render();
      const refresh = () => { render(); updateStorage(); };
      window.addEventListener('cinepulse_offline_changed', refresh);
      renderIcons(page);
    }
  };
}
