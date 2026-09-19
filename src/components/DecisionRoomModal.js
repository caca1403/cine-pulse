import { renderIcons } from '../services/icons.js';
import { fetchTrending, getImageUrl, TMDB_IMAGE_SIZES } from '../services/tmdbApi.js';
import {
  AnonymousDecisionRoom,
  buildRoomUrl,
  createRoomCode,
  createAnonymousNickname,
  getRoomCodeFromUrl,
  removeRoomCodeFromUrl
} from '../services/anonymousDecisionRoom.js';
import { showToast } from './Toast.js';

let activeRoomModal = null;
let activeRoom = null;
let unsubscribe = null;

function escapeHtml(value = '') {
  const node = document.createElement('div');
  node.textContent = String(value);
  return node.innerHTML;
}

function voteSummary(card, state) {
  const values = Object.values(state.votes[card.id] || {});
  const yes = values.filter(value => value === 'yes').length;
  const needed = Math.max(1, state.participants.length);
  return { yes, needed, matched: yes >= needed };
}

function renderRoomState(root, state, statusText = '') {
  const status = root.querySelector('#decision-room-status');
  const peers = root.querySelector('#decision-room-peers');
  const deck = root.querySelector('#decision-room-deck');
  const link = root.querySelector('#decision-room-link');
  if (status) status.textContent = statusText || (state.peerCount ? 'Arkadaşların bağlandı, oylar anlık geliyor.' : 'Oda eşleştiriliyor. Arkadaşına bağlantıyı gönder.');
  if (peers) peers.innerHTML = state.participants.map(person => `<span class="decision-room-person"><i data-lucide="circle-user-round"></i>${escapeHtml(person.nickname)}</span>`).join('');
  if (link) link.value = buildRoomUrl(state.roomCode);

  if (deck) {
    if (!state.cards.length) {
      deck.innerHTML = `<div class="decision-room-empty"><i data-lucide="sparkles"></i><strong>Adaylar hazırlanıyor</strong><span>Oda sahibi ortak izleme listesi oluşturuyor.</span></div>`;
    } else {
      deck.innerHTML = state.cards.map(card => {
        const title = card.title || card.name || 'İsimsiz içerik';
        const meta = card.type === 'tv' ? 'Dizi' : 'Film';
        const vote = voteSummary(card, state);
        const myVote = state.votes[card.id]?.[state.selfId];
        return `<article class="decision-room-card ${vote.matched ? 'matched' : ''}">
          <img src="${getImageUrl(card.poster_path, TMDB_IMAGE_SIZES.POSTER_SMALL)}" alt="" loading="lazy" />
          <div class="decision-room-card-body">
            <span>${meta} · ★ ${(Number(card.vote_average) || 0).toFixed(1)}</span>
            <strong>${escapeHtml(title)}</strong>
            <small>${vote.matched ? 'Herkes izlemek istiyor!' : `${vote.yes}/${vote.needed} kişi izlemek istiyor`}</small>
            <div class="decision-room-votes">
              <button data-room-vote="yes" data-card-id="${card.id}" class="${myVote === 'yes' ? 'active-yes' : ''}"><i data-lucide="heart"></i> İzle</button>
              <button data-room-vote="no" data-card-id="${card.id}" class="${myVote === 'no' ? 'active-no' : ''}"><i data-lucide="skip-forward"></i> Geç</button>
              ${vote.matched ? `<button data-room-open="${card.id}" class="decision-room-open"><i data-lucide="play"></i> Birlikte Aç</button>` : ''}
            </div>
          </div>
        </article>`;
      }).join('');
    }

    deck.querySelectorAll('[data-room-vote]').forEach(button => {
      button.onclick = () => activeRoom?.vote(button.dataset.cardId, button.dataset.roomVote);
    });
    deck.querySelectorAll('[data-room-open]').forEach(button => {
      button.onclick = () => {
        const card = state.cards.find(item => String(item.id) === button.dataset.roomOpen);
        if (card) activeRoom?.openForEveryone(card);
      };
    });
  }
  renderIcons(root);
}

async function loadCandidates(room, root) {
  const status = root.querySelector('#decision-room-status');
  if (status) status.textContent = 'Ortak adaylar hazırlanıyor…';
  try {
    const list = await fetchTrending('all', 'week');
    const candidates = (list || [])
      .filter(item => item?.id && (item.media_type === 'movie' || item.media_type === 'tv' || item.type === 'movie' || item.type === 'tv'))
      .slice(0, 8)
      .map(item => ({
        id: item.id,
        type: item.type || item.media_type || (item.first_air_date ? 'tv' : 'movie'),
        title: item.title,
        name: item.name,
        poster_path: item.poster_path,
        vote_average: item.vote_average
      }));
    if (!candidates.length) throw new Error('Aday bulunamadı.');
    room.setCards(candidates);
  } catch (_) {
    if (status) status.textContent = 'Adaylar şu an yüklenemedi. Biraz sonra yeniden dene.';
  }
}

export async function openDecisionRoomModal({ roomCode = getRoomCodeFromUrl() } = {}) {
  closeDecisionRoomModal(false);
  const joinedRoomCode = roomCode || createRoomCode();
  const isHost = !roomCode;
  const nickname = createAnonymousNickname();

  const root = document.createElement('div');
  root.id = 'decision-room-modal-root';
  root.className = 'decision-room-backdrop';
  document.body.appendChild(root);
  activeRoomModal = root;

  if (isHost) {
    try { history.replaceState(history.state, '', buildRoomUrl(joinedRoomCode)); } catch (_) {}
  }

  root.innerHTML = `
    <section class="decision-room-dialog" role="dialog" aria-modal="true" aria-label="Ortak Karar Odası">
      <button id="btn-close-decision-room" class="decision-room-close" aria-label="Kapat"><i data-lucide="x"></i></button>
      <header class="decision-room-header">
        <div class="decision-room-icon"><i data-lucide="users-round"></i></div>
        <div><h2>Ortak Karar Odası</h2><p>Hesapsız, anonim ve geçici ortak izleme seçimi.</p></div>
      </header>
      <div class="decision-room-privacy"><i data-lucide="shield-check"></i><span>Oda verileri kaydedilmez. Oylar yalnızca açık odadaki kişiler arasında iletilir.</span></div>
      <div class="decision-room-share">
        <label for="decision-room-link">Arkadaşına gönder</label>
        <div><input id="decision-room-link" readonly /><button id="btn-copy-decision-room"><i data-lucide="copy"></i> Kopyala</button></div>
      </div>
      <div class="decision-room-live"><span class="decision-room-live-dot"></span><span id="decision-room-status">Oda hazırlanıyor…</span></div>
      <div id="decision-room-peers" class="decision-room-peers"></div>
      <div id="decision-room-deck" class="decision-room-deck"></div>
      <footer class="decision-room-footer"><span>Takma adın: <strong>${escapeHtml(nickname)}</strong></span><button id="btn-refresh-decision-cards"><i data-lucide="refresh-cw"></i> Yeni adaylar</button></footer>
    </section>`;

  activeRoom = new AnonymousDecisionRoom({ roomCode: joinedRoomCode, nickname, isHost });
  unsubscribe = activeRoom.subscribe(state => renderRoomState(root, state));
  await activeRoom.connect();
  if (isHost) loadCandidates(activeRoom, root);

  root.querySelector('#btn-close-decision-room').onclick = () => closeDecisionRoomModal(true);
  root.addEventListener('click', event => {
    if (event.target === root) closeDecisionRoomModal(true);
  });
  root.querySelector('#btn-copy-decision-room').onclick = async () => {
    const link = root.querySelector('#decision-room-link')?.value;
    try {
      await navigator.clipboard.writeText(link);
      showToast('Oda bağlantısı kopyalandı.', 'success');
    } catch (_) {
      root.querySelector('#decision-room-link')?.select();
      document.execCommand('copy');
      showToast('Oda bağlantısı kopyalandı.', 'success');
    }
  };
  root.querySelector('#btn-refresh-decision-cards').onclick = () => loadCandidates(activeRoom, root);
  renderIcons(root);
}

export function closeDecisionRoomModal(removeLink = true) {
  unsubscribe?.();
  unsubscribe = null;
  activeRoom?.destroy();
  activeRoom = null;
  activeRoomModal?.remove();
  activeRoomModal = null;
  if (removeLink) removeRoomCodeFromUrl();
}
