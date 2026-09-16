/* ==========================================================================
   CinePulse Studio - Bildirimler & Yeni Bölüm Alarmları Merkezi
   Displays new episode drops, season arrivals, and system news
   with direct one-click navigation to content.
   ========================================================================== */

import { openPlayerModal } from './PlayerModal.js';
import { showToast } from './Toast.js';

let activeNotificationModal = null;

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif_1',
    title: 'Yeni Bölüm Yayında! ⚔️',
    message: 'Kuruluş Osman 6. Sezon 1. Bölüm Full HD olarak platforma eklendi.',
    time: '12 dk önce',
    isUnread: true,
    type: 'tv',
    tmdbId: '95557',
    badge: 'YENİ BÖLÜM'
  },
  {
    id: 'notif_2',
    title: 'Özel Sinema Gösterimi 🍿',
    message: 'Dune: Çöl Gezegeni Bölüm İki - 4K Ultra HD Türkçe Dublaj & Altyazılı yayında!',
    time: '2 saat önce',
    isUnread: true,
    type: 'movie',
    tmdbId: '693134',
    badge: '4K VİZYON'
  },
  {
    id: 'notif_3',
    title: 'Yeni Anime Bölümü ⚡',
    message: 'Demon Slayer: Hashira Training Arc - Türkçe Altyazılı yeni bölüm izlenmeye hazır.',
    time: 'Dün',
    isUnread: false,
    type: 'tv',
    tmdbId: '85937',
    badge: 'ANİME'
  },
  {
    id: 'notif_4',
    title: 'Canlı TV Güncellemesi 📺',
    message: 'Elektronik Program Rehberi (EPG), PiP Mini-Player ve HLS Kalite Menüsü aktif edildi.',
    time: '2 gün önce',
    isUnread: false,
    type: 'livetv',
    badge: 'GÜNCELLEME'
  }
];

export function getNotifications() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return DEFAULT_NOTIFICATIONS;
    const raw = localStorage.getItem('sineflix_notifications_v1');
    return raw ? JSON.parse(raw) : DEFAULT_NOTIFICATIONS;
  } catch (_) {
    return DEFAULT_NOTIFICATIONS;
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

export function openNotificationCenterModal() {
  closeNotificationCenterModal();

  const modalContainer = document.createElement('div');
  modalContainer.id = 'notification-modal-root';
  modalContainer.className = 'notif-backdrop';
  document.body.appendChild(modalContainer);
  activeNotificationModal = modalContainer;

  const notifications = getNotifications();

  modalContainer.innerHTML = `
    <div class="notif-dialog">
      <div class="notif-header">
        <div class="notif-title-row">
          <div class="notif-bell-icon">
            <i data-lucide="bell" style="width: 20px; height: 20px; color: #f59e0b;"></i>
          </div>
          <div>
            <h3>Bildirimler & Alarmlar</h3>
            <span class="notif-subtext">Yeni bölüm ve yayın bildirimleri</span>
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

      <div class="notif-list">
        ${notifications.map(n => `
          <div class="notif-item ${n.isUnread ? 'unread' : ''}" data-notif-id="${n.id}" data-type="${n.type || ''}" data-tmdb-id="${n.tmdbId || ''}">
            <div class="notif-item-left">
              <span class="notif-tag">${n.badge || 'HABER'}</span>
              <span class="notif-time">${n.time}</span>
            </div>
            <h4 class="notif-item-title">${n.title}</h4>
            <p class="notif-item-msg">${n.message}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons({ el: modalContainer });

  const closeBtn = modalContainer.querySelector('#btn-close-notif');
  if (closeBtn) closeBtn.onclick = () => closeNotificationCenterModal();

  modalContainer.onclick = (e) => {
    if (e.target === modalContainer) closeNotificationCenterModal();
  };

  const markAllBtn = modalContainer.querySelector('#btn-mark-all-read');
  if (markAllBtn) {
    markAllBtn.onclick = () => {
      const updated = notifications.map(n => ({ ...n, isUnread: false }));
      saveNotifications(updated);
      modalContainer.querySelectorAll('.notif-item.unread').forEach(el => el.classList.remove('unread'));
      showToast('Tüm bildirimler okundu olarak işaretlendi', 'info');
      updateNotificationBellBadge();
    };
  }

  // Notif item click
  modalContainer.querySelectorAll('.notif-item').forEach(el => {
    el.onclick = () => {
      const id = el.getAttribute('data-notif-id');
      const type = el.getAttribute('data-type');
      const tmdbId = el.getAttribute('data-tmdb-id');

      // Mark this item as read
      const updated = notifications.map(n => n.id === id ? { ...n, isUnread: false } : n);
      saveNotifications(updated);
      el.classList.remove('unread');
      updateNotificationBellBadge();

      closeNotificationCenterModal();

      if (type === 'livetv') {
        window.location.hash = '#livetv';
      } else if (tmdbId) {
        window.location.hash = `#detail?type=${type}&id=${tmdbId}`;
      }
    };
  });
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
