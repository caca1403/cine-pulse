import { renderIcons } from '../services/kabuk/icons.js';
import { renderMediaCard, attachMediaCardEvents } from '../components/MediaCard.js';
import {
  getGroupedWatchHistory, getCompletedWatchList, getFavorites, getWatchlist,
  filterForActiveProfile, isKidProfileActive, isItemKidSafe
} from '../services/altyapi/storage.js';
import { fetchTrending, fetchPopularSeries, fetchPopularMovies } from '../services/icerik/tmdbApi.js';
import { modeliHazirla2, gosterimKaydet, tiklamaKaydet } from '../services/kisisel/kisiselMotor.js';
import { fetchPersonalizedRows, onerilenlerdenCikar } from '../services/kisisel/recommendationEngine.js';
import '../styles/home-polish.css';

function rail(id, baslik, aciklama, ikon, renk, items) {
  if (!Array.isArray(items) || items.length < 10) return '';
  return `
    <section class="rail-section reco-row" id="${id}" aria-label="${baslik}">
      <div class="container">
        <div class="rail-header">
          <div>
            <h2 class="rail-title">
              <span class="rail-icon-pill" style="--rail-color:${renk}">
                <i data-lucide="${ikon}" aria-hidden="true"></i>
              </span>
              ${baslik}
            </h2>
            <p class="reco-row-note">${aciklama}</p>
          </div>
          <span class="reco-row-count">${Math.min(items.length, 40)} yeni yapım</span>
        </div>
        <div class="card-rail">${items.slice(0, 40).map((oge) => renderMediaCard(oge)).join('')}</div>
      </div>
    </section>
  `;
}

export function renderChannelView() {
  const isKid = isKidProfileActive();
  const gecmis = filterForActiveProfile(getGroupedWatchHistory() || []);
  const tamamlanan = filterForActiveProfile(getCompletedWatchList() || []);
  const favoriler = filterForActiveProfile(getFavorites() || []);
  const watchlist = filterForActiveProfile(getWatchlist() || []);

  return {
    html: `
      <div class="recommendation-view">
        <header class="container reco-heading">
          <span class="cp-eyebrow">ÖĞRENDİKÇE İYİLEŞİR</span>
          <h1><i data-lucide="sparkles" aria-hidden="true"></i> Öneri Merkezi</h1>
          <p>İzlediklerin, tamamladıkların, favorilerin ve gerçekten açtığın kartlar birlikte değerlendirilir. Bitirdiğin yapımlar öneri kartı olarak gösterilmez; yalnızca benzer yeni yapımları bulmaya yardım eder.</p>
          <button type="button" class="btn-secondary reco-refresh" id="reco-refresh">
            <i data-lucide="refresh-cw" aria-hidden="true"></i> Önerileri yenile
          </button>
        </header>
        <div class="container reco-status" id="reco-status" role="status" aria-live="polite">
          İzleme zevkine uygun yeni yapımlar hazırlanıyor…
        </div>
        <section class="container reco-stats" id="reco-stats" aria-label="Öneri istatistikleri" aria-live="polite"></section>
        <div id="reco-rows"></div>
      </div>
      <style>
        .reco-heading { padding-top: 2rem; padding-bottom: 1.5rem; }
        .reco-heading h1 { display:flex; align-items:center; gap:.65rem; margin:.4rem 0; font-size:clamp(1.8rem,4vw,2.7rem); }
        .reco-heading h1 svg { color:var(--primary,#dfff76); }
        .reco-heading p { max-width:76ch; color:var(--text-muted,#94a3b8); line-height:1.65; }
        .reco-refresh { display:inline-flex; align-items:center; gap:.5rem; margin-top:.5rem; }
        .reco-status { min-height:2rem; padding-bottom:1rem; color:var(--text-muted,#94a3b8); }
        .reco-row-note { margin:.25rem 0 0 2.4rem; color:var(--text-muted,#94a3b8); font-size:.82rem; }
        .reco-row-count { color:var(--text-muted,#94a3b8); font-size:.78rem; white-space:nowrap; }
        .reco-row .rail-header { align-items:flex-start; }
        .reco-stats { margin-bottom:1.2rem; }
        .reco-stats-heading { display:flex; align-items:baseline; justify-content:space-between; gap:1rem; margin-bottom:.65rem; }
        .reco-stats-heading h2 { margin:0; font-size:1rem; }
        .reco-stats-heading p { margin:0; color:var(--text-muted,#94a3b8); font-size:.78rem; }
        .reco-stats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(145px,1fr)); gap:.7rem; }
        .reco-stat { min-width:0; padding:1rem; border:1px solid var(--border-color,#ffffff18); border-radius:14px; background:linear-gradient(145deg,#ffffff0b,#ffffff03); }
        .reco-stat-label { color:var(--text-muted,#94a3b8); font-size:.76rem; letter-spacing:.04em; text-transform:uppercase; }
        .reco-stat-value { margin-top:.3rem; font-size:1.35rem; font-weight:750; font-variant-numeric:tabular-nums; }
        .reco-stat-detail { margin-top:.25rem; color:var(--text-muted,#94a3b8); font-size:.75rem; line-height:1.4; }
      </style>
    `,
    init: (container) => {
      const rows = container.querySelector('#reco-rows');
      const status = container.querySelector('#reco-status');
      const stats = container.querySelector('#reco-stats');
      if (!rows || !status || !stats) return;
      let disposed = false;
      let observer = null;
      let impressionTimers = new Map();
      const timersTemizle = () => {
        impressionTimers.forEach(clearTimeout);
        impressionTimers.clear();
        observer?.disconnect();
        observer = null;
      };
      const dispose = () => {
        disposed = true;
        timersTemizle();
        window.removeEventListener('hashchange', dispose);
        window.removeEventListener('pagehide', dispose);
      };
      window.addEventListener('hashchange', dispose, { once: true });
      window.addEventListener('pagehide', dispose, { once: true });

      const impressionsBagla = () => {
        const cards = [...rows.querySelectorAll('.reco-row .media-card[data-id]')];
        if (typeof IntersectionObserver !== 'function') {
          for (const card of cards.slice(0, 5)) {
            gosterimKaydet([{ id: card.dataset.id, type: card.dataset.type || '' }], 'ana');
          }
          return;
        }
        observer = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
              if (impressionTimers.has(entry.target)) continue;
              impressionTimers.set(entry.target, setTimeout(() => {
                if (!disposed && entry.target.isConnected) {
                  const source = entry.target.closest('.reco-row')?.id === 'reco-completed'
                    ? 'tamamlanan'
                    : entry.target.closest('.reco-row')?.id === 'reco-favorite' ? 'favoriler' : 'ana';
                  gosterimKaydet([{
                    id: entry.target.dataset.id,
                    type: entry.target.dataset.type || ''
                  }], source);
                }
                impressionTimers.delete(entry.target);
                observer?.unobserve(entry.target);
              }, 900));
            } else {
              const timer = impressionTimers.get(entry.target);
              if (timer) clearTimeout(timer);
              impressionTimers.delete(entry.target);
            }
          }
        }, { threshold: 0.5 });
        cards.forEach((card) => observer.observe(card));
      };

      const yukle = async () => {
        if (disposed) return;
        timersTemizle();
        status.textContent = 'İzleme geçmişin, beğendiğin yapımlar ve içerik ilişkileri analiz ediliyor…';
        const [trending, tv, movies] = await Promise.all([
          fetchTrending().catch(() => []),
          fetchPopularSeries().catch(() => []),
          fetchPopularMovies().catch(() => [])
        ]);
        if (disposed) return;
        const fallbackAdaylar = [...(trending || []), ...(tv || []), ...(movies || [])]
          .filter((oge) => oge && oge.id != null && (!isKid || isItemKidSafe(oge)));
        let model = null;
        try {
          model = await modeliHazirla2({ ekKayitlar: [...gecmis, ...tamamlanan, ...favoriler, ...watchlist, ...fallbackAdaylar] });
        } catch (error) {
          console.warn('[Öneri Merkezi] Yerel model hazırlanamadı; benzerlik sıralaması kullanılacak.', error);
        }
        if (disposed) return;
        const oneriler = await fetchPersonalizedRows({
          gecmis,
          tamamlanan,
          favoriler,
          watchlist,
          model,
          fallbackAdaylar,
          adet: 40,
          isKid,
          guvenliMi: isItemKidSafe
        });
        if (disposed) return;

        const elenenSayi = onerilenlerdenCikar({ gecmis, tamamlanan, favoriler, watchlist }).size;
        const auc = model?.dogrulama?.auc;
        const aucVar = auc != null && Number.isFinite(Number(auc));
        const egitilmisBilesen = [
          model?.siralayici?.egitildi,
          model?.neural?.egitildi,
          model?.bpr?.egitildi,
          model?.icerikCnn?.egitildi
        ].filter(Boolean).length;
        const istatistik = (etiket, deger, detay) => `
          <article class="reco-stat">
            <div class="reco-stat-label">${etiket}</div>
            <div class="reco-stat-value">${deger}</div>
            <div class="reco-stat-detail">${detay}</div>
          </article>
        `;
        const statsCards = [
          istatistik('Yeni filmler', oneriler.sanaOzelFilmler.length, 'Kişisel sıralamada gösterilen'),
          istatistik('Yeni diziler', oneriler.sanaOzelDiziler.length, 'İzlenmemiş adaylar arasından'),
          istatistik('Öneriden çıkarılan', elenenSayi, 'Geçmiş, tamamlanan, favori ve listendeki yapımlar'),
          istatistik('Model bileşenleri', `${egitilmisBilesen}/4`, 'Gerçek sinyallerle eğitilmiş'),
          istatistik('Doğrulama AUC', aucVar ? `${Math.round(Number(auc) * 100)}%` : 'Henüz ölçülmedi',
            aucVar ? 'Zaman ayrık doğrulama sonucu' : 'Yeterli doğrulama verisi birikmedi'),
          istatistik('Eğitim örnekleri', Number(model?.ornekSayisi) || 0, 'Kaydedilmiş gerçek kart gösterimleri')
        ].join('');
        stats.innerHTML = `
          <div class="reco-stats-heading">
            <h2>Öneri istatistikleri</h2>
            <p>Bu yenilemede üretilen gerçek aday ve model ölçümleri</p>
          </div>
          <div class="reco-stats-grid">${statsCards}</div>
        `;
        renderIcons(stats);

        rows.innerHTML = [
          rail('reco-movies', 'Sana özel filmler', 'İzleme geçmişine ve benzer içerik ilişkilerine göre sıralandı.', 'clapperboard', '#dfff76', oneriler.sanaOzelFilmler),
          rail('reco-series', 'Sana özel diziler', 'Dizi zevkine ve benzer yapım ilişkilerine göre sıralandı.', 'tv-2', '#34d399', oneriler.sanaOzelDiziler),
          tamamlanan.length
            ? rail('reco-completed', 'Bitirdiklerinden sonra', 'Tamamladıkların burada tekrar önerilmez; benzer zevklerine uyan yeni yapımlar gösterilir.', 'check-check', '#a78bfa', oneriler.tamamladiklarindanSonra)
            : '',
          favoriler.length
            ? rail('reco-favorite', 'Favorilerine yakın', 'Favorilerinden bulunan benzerliklere göre, henüz izlemediğin yapımlar.', 'heart', '#f472b6', oneriler.favorilerineGore)
            : ''
        ].join('');
        if (!rows.innerHTML) {
          status.textContent = 'Şu an izleme geçmişinle eşleşen yeterli sayıda yeni yapım bulunamadı. Birkaç kartı açıp izledikçe öneriler kişiselleşir.';
          return;
        }
        status.textContent = 'Öneriler cihazındaki izleme verilerinden üretildi. İzlemiş veya tamamlamış olduğun yapımlar sonuçlardan çıkarıldı.';
        renderIcons(rows);
        attachMediaCardEvents(rows);
        impressionsBagla();
      };

      container.querySelector('#reco-refresh')?.addEventListener('click', yukle);
      container.addEventListener('click', (event) => {
        const card = event.target?.closest?.('.reco-row .media-card[data-id]');
        if (!card) return;
        const row = card.closest('.reco-row');
        const source = row?.id === 'reco-completed' ? 'tamamlanan'
          : row?.id === 'reco-favorite' ? 'favoriler' : 'ana';
        tiklamaKaydet({ id: card.dataset.id, type: card.dataset.type || '' }, source);
      }, { capture: true });
      yukle();
    }
  };
}
