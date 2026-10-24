import { renderIcons } from '../services/kabuk/icons.js';
/* ==========================================================================
   CinePulse Studio - Bildirimler & Yeni Bölüm Alarmları Merkezi
   Gerçek veri akışı: izleme listesi + son izlenen diziler → TVmaze sonraki
   bölüm bilgisi → bildirimUretici (saf modül) → DOM. Sahne/uydurma bildirim yok;
   veri yoksa dürüst boş durum gösterilir.
   ========================================================================== */

import { showToast } from './Toast.js';
import { getWatchlist, getWatchHistory } from '../services/altyapi/storage.js';
import {
  getNextEpisodeInfo,
  buildEpisodeLabel,
  formatAirDateLabel
} from '../services/icerik/tvmazeService.js';
import { bildirimUret } from '../services/icerik/bildirimUretici.js';

let activeNotificationModal = null;

const ONBELLEK_ANAHTAR = 'cinepulse_bildirim_ozet_v1';
const ONBELLEK_TTL_MS = 5 * 60 * 1000; // 5 dakika kısa önbellek
const MAKS_ARAYIS = 8; // TVmaze rate limit (20/10sn) için tarama üst sınırı

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** İzleme listesindeki ve geçmişteki dizi adaylarını toplar (kimlik bazlı tekilleşir). */
function adaylariTopla() {
  const gorulen = new Set();
  const adaylar = [];

  const ekle = (kayit) => {
    if (!kayit?.id || !kayit.title) return;
    const id = String(kayit.id);
    if (gorulen.has(id)) return;
    const tur = kayit.type;
    const diziMi = tur === 'tv' || tur === 'anime' || kayit.isSeries === true;
    if (!diziMi) return; // filmler için "sonraki bölüm" yoktur
    gorulen.add(id);
    adaylar.push({
      tmdbId: kayit.id,
      ad: kayit.title,
      yil: parseInt(String(kayit.first_air_date || kayit.release_date || '').slice(0, 4), 10) || undefined
    });
  };

  getWatchlist().forEach(ekle);
  // Geçmiş lastWatchedAt azalan sıralı → en son izlenen diziler öncelikli
  getWatchHistory().forEach(ekle);

  return adaylar.slice(0, MAKS_ARAYIS);
}

/** TVmaze'den sonraki bölüm verisini çeker, saf modüle ham aday olarak sunar. */
async function tvmazeAdaylariniGetir() {
  const adaylar = adaylariTopla();
  if (adaylar.length === 0) return [];

  const sonuclar = await Promise.all(
    adaylar.map(a => getNextEpisodeInfo({ title: a.ad, year: a.yil }))
  );

  const ham = [];
  sonuclar.forEach((info, i) => {
    const sonraki = info?.nextEpisode;
    if (!sonraki?.airstamp && !sonraki?.airdate) return;
    ham.push({
      tmdbId: adaylar[i].tmdbId,
      ad: info.showName || adaylar[i].ad,
      sonrakiHava: sonraki.airstamp || '',
      yayinTarihi: sonraki.airdate || '',
      bolumEtiketi: buildEpisodeLabel(sonraki)
    });
  });

  return bildirimUret(ham);
}

/** Okunma durumunu koruyarak gerçek listeyi localStorage'a yazar. */
function gercekListeyiKaydet(liste) {
  const okunmus = new Set(getNotifications().filter(n => n.isUnread === false).map(n => n.id));
  const kayit = liste.map(n => ({ ...n, isUnread: !okunmus.has(n.id), badge: 'YENİ BÖLÜM', type: 'tv' }));
  saveNotifications(kayit);
  return kayit;
}

/** 5 dakikalık localStorage önbelleği; tazeyse ağ yok. */
function onbellekOku() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = localStorage.getItem(ONBELLEK_ANAHTAR);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.savedAt || Date.now() - parsed.savedAt > ONBELLEK_TTL_MS) return null;
    return Array.isArray(parsed.liste) ? parsed.liste : null;
  } catch (_) {
    return null;
  }
}

function onbellekYaz(liste) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.setItem(ONBELLEK_ANAHTAR, JSON.stringify({ savedAt: Date.now(), liste }));
  } catch (_) {}
}

export function getNotifications() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = localStorage.getItem('sineflix_notifications_v1');
    const liste = raw ? JSON.parse(raw) : [];
    return Array.isArray(liste) ? liste : [];
  } catch (_) {
    return [];
  }
}

export function saveNotifications(list) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.setItem('sineflix_notifications_v1', JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('sineflix_notifications_updated'));
  } catch (_) {}
}

export function getUnreadNotificationCount() {
  const list = getNotifications();
  return list.filter(n => n.isUnread).length;
}

/** Bildirimlerin DOM metnini (başlık/mesaj/göreceli zaman) kurar — saf modül değil, sunum katmanı. */
function bildirimMetniniKur(n) {
  const tarih = formatAirDateLabel('', new Date(n.yayinZamani).toISOString());
  const bolum = n.bolumEtiketi ? `${n.bolumEtiketi} ` : '';
  return {
    title: `${n.ad} — Yeni Bölüm 📺`,
    message: `${n.ad} ${bolum}bölümü ${tarih} yayında olacak.`,
    time: tarih,
    badge: 'YENİ BÖLÜM'
  };
}

function bosDurumHTML() {
  return `
    <div class="notif-empty" style="text-align:center; padding:28px 16px; color:#94a3b8;">
      <i data-lucide="bell-off" style="width: 28px; height: 28px; color: #64748b;"></i>
      <p style="margin: 12px 0 4px; font-size: 13px; line-height: 1.5;">
        Yakında gelecek bir şey yok. Listene dizi ekle, yeni bölümler burada görünsün.
      </p>
      <button id="btn-notif-go-watchlist" class="notif-mark-read-btn" style="margin-top: 8px;">
        <i data-lucide="bookmark" style="width: 14px; height: 14px;"></i>
        <span>Listeme Git</span>
      </button>
    </div>
  `;
}

function yuklemeHTML() {
  return `
    <div class="notif-loading" style="text-align:center; padding:28px 16px; color:#94a3b8;">
      <i data-lucide="loader-circle" style="width: 22px; height: 22px; color: #dfff76;"></i>
      <p style="margin: 10px 0 0; font-size: 12.5;">Yayın takvimi kontrol ediliyor…</p>
    </div>
  `;
}

export function openNotificationCenterModal() {
  closeNotificationCenterModal();

  const modalContainer = document.createElement('div');
  modalContainer.id = 'notification-modal-root';
  modalContainer.className = 'notif-backdrop';
  document.body.appendChild(modalContainer);
  activeNotificationModal = modalContainer;

  modalContainer.innerHTML = `
    <div class="notif-dialog">
      <div class="notif-header">
        <div class="notif-title-row">
          <div class="notif-bell-icon">
            <i data-lucide="bell" style="width: 20px; height: 20px; color: #dfff76;"></i>
          </div>
          <div>
            <h3>Bildirimler & Alarmlar</h3>
            <span class="notif-subtext">Listendeki dizilerin yeni bölümleri</span>
          </div>
        </div>
        <button class="notif-close-btn" id="btn-close-notif" title="Kapat">
          <i data-lucide="x" style="width: 18px; height: 18px;"></i>
        </button>
      </div>

      <div class="notif-actions-bar">
        <button class="notif-mark-read-btn" id="btn-mark-all-read">
          <i data-lucide="check-check" style="width: 14px; height: 14px;"></i>
          <span>Tümünü Okundu İşaretle</span>
        </button>
      </div>

      <div class="notif-list" id="notif-list-body">
        ${yuklemeHTML()}
      </div>
    </div>
  `;

  renderIcons(modalContainer);

  const closeBtn = modalContainer.querySelector('#btn-close-notif');
  if (closeBtn) closeBtn.onclick = () => closeNotificationCenterModal();

  modalContainer.onclick = (e) => {
    if (e.target === modalContainer) closeNotificationCenterModal();
  };

  // Açılışta bir kez üret (önbellek tazeyse ağ yok); modal kapatıldıysa sessizce çık
  (async () => {
    let liste = onbellekOku();
    if (!liste) {
      try {
        liste = gercekListeyiKaydet(await tvmazeAdaylariniGetir());
      } catch (_) {
        liste = [];
      }
      onbellekYaz(liste);
    }
    if (modalContainer !== activeNotificationModal || !modalContainer.isConnected) return;

    const govde = modalContainer.querySelector('#notif-list-body');
    if (!govde) return;
    govde.innerHTML = liste.length
      ? liste.map(n => {
        const metin = bildirimMetniniKur(n);
        return `
          <div class="notif-item ${n.isUnread ? 'unread' : ''}" data-notif-id="${escapeHtml(n.id)}" data-tmdb-id="${escapeHtml(n.tmdbId || '')}">
            <div class="notif-item-left">
              <span class="notif-tag">${escapeHtml(n.badge || 'YENİ BÖLÜM')}</span>
              <span class="notif-time">${escapeHtml(metin.time)}</span>
            </div>
            <h4 class="notif-item-title">${escapeHtml(metin.title)}</h4>
            <p class="notif-item-msg">${escapeHtml(metin.message)}</p>
          </div>
        `;
      }).join('')
      : bosDurumHTML();

    renderIcons(modalContainer);

    const bosButon = govde.querySelector('#btn-notif-go-watchlist');
    if (bosButon) {
      bosButon.onclick = () => {
        closeNotificationCenterModal();
        window.location.hash = '#library';
      };
    }

    const markAllBtn = modalContainer.querySelector('#btn-mark-all-read');
    if (markAllBtn) {
      markAllBtn.onclick = () => {
        const updated = liste.map(n => ({ ...n, isUnread: false }));
        saveNotifications(updated);
        liste = updated;
        govde.querySelectorAll('.notif-item.unread').forEach(el => el.classList.remove('unread'));
        showToast('Tüm bildirimler okundu olarak işaretlendi', 'info');
        updateNotificationBellBadge();
      };
    }

    // Notif item click → okundu işaretle + detay sayfasına git (#livetv kaldırıldı: Canlı TV kapalı)
    govde.querySelectorAll('.notif-item').forEach(el => {
      el.onclick = () => {
        const id = el.getAttribute('data-notif-id');
        const tmdbId = el.getAttribute('data-tmdb-id');

        const updated = liste.map(n => n.id === id ? { ...n, isUnread: false } : n);
        saveNotifications(updated);
        liste = updated;
        el.classList.remove('unread');
        updateNotificationBellBadge();

        closeNotificationCenterModal();

        if (tmdbId) {
          window.location.hash = `#detail?type=tv&id=${tmdbId}`;
        }
      };
    });
  })();
}

export function closeNotificationCenterModal() {
  if (activeNotificationModal) {
    try { activeNotificationModal.remove(); } catch (_) {}
    activeNotificationModal = null;
  }
}

export function updateNotificationBellBadge() {
  const badge = document.getElementById('nav-notif-badge');
  if (!badge) return;
  const count = getUnreadNotificationCount();
  if (count > 0) {
    badge.textContent = count;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}
