import { renderIcons } from '../services/icons.js';
import { fetchTrending, getImageUrl, searchMulti, TMDB_IMAGE_SIZES } from '../services/tmdbApi.js';
import {
  AnonymousDecisionRoom,
  buildRoomUrl,
  createRoomCode,
  createAnonymousNickname,
  getRoomCodeFromUrl,
  isRememberedRoomOwner,
  rememberRoomOwner,
  removeRoomCodeFromUrl
} from '../services/anonymousDecisionRoom.js';
import { showToast } from './Toast.js';

let activeRoomModal = null;
let activeRoom = null;
let unsubscribe = null;
let removeSharedOpenListener = null;

function createLobby() {
  closeDecisionRoomModal(false);
  const root = document.createElement('div');
  root.className = 'decision-room-backdrop';
  document.body.appendChild(root);
  activeRoomModal = root;
  root.innerHTML = `
    <section class="decision-room-lobby" role="dialog" aria-modal="true" aria-label="Birlikte Seç">
      <button id="btn-close-decision-room" class="decision-room-close" aria-label="Kapat"><i data-lucide="x"></i></button>
      <div class="decision-room-icon"><i data-lucide="users-round"></i></div>
      <h2>Birlikte Seç</h2>
      <p>Arkadaşlarınla aynı adaylara oy verin, herkesin istediği içeriği birlikte açın.</p>
      <button id="btn-create-decision-room" class="decision-room-create"><i data-lucide="crown"></i> Moderatör Olarak Oda Oluştur</button>
      <small class="decision-room-role-note">Adayları sen yenilersin ve katılan anonim kişileri görürsün.</small>
      <div class="decision-room-join">
        <label for="decision-room-code-input">Katılımcı olarak odaya katıl</label>
        <div><input id="decision-room-code-input" inputmode="numeric" maxlength="6" placeholder="6 haneli kod" autocomplete="one-time-code" /><button id="btn-join-decision-room">Katıl</button></div>
      </div>
    </section>`;
  root.querySelector('#btn-close-decision-room').onclick = () => closeDecisionRoomModal(false);
  root.addEventListener('click', event => { if (event.target === root) closeDecisionRoomModal(false); });
  root.querySelector('#btn-create-decision-room').onclick = () => openDecisionRoomModal({ roomCode: createRoomCode(), isHost: true });
  const join = () => {
    const input = root.querySelector('#decision-room-code-input');
    const roomCode = String(input?.value || '').replace(/\D/g, '').slice(0, 6);
    if (roomCode.length !== 6) {
      input?.focus();
      showToast('6 haneli oda kodunu yaz.', 'warning');
      return;
    }
    openDecisionRoomModal({ roomCode, isHost: false });
  };
  root.querySelector('#btn-join-decision-room').onclick = join;
  root.querySelector('#decision-room-code-input').onkeydown = event => { if (event.key === 'Enter') join(); };
  renderIcons(root);
}

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

function ratingSummary(card, state) {
  const values = Object.values(state.ratings?.[card.id] || {}).map(Number).filter(value => value >= 1 && value <= 5);
  const mine = state.ratings?.[card.id]?.[state.selfId] || 0;
  const average = values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0;
  return { average, count: values.length, mine };
}

function renderRoomState(root, state, statusText = '') {
  const status = root.querySelector('#decision-room-status');
  const peers = root.querySelector('#decision-room-peers');
  const memberCount = root.querySelector('#decision-room-member-count');
  const moderatorPanel = root.querySelector('#decision-room-moderator-panel');
  const signalStatus = root.querySelector('#decision-room-signal-status');
  const deck = root.querySelector('#decision-room-deck');
  const link = root.querySelector('#decision-room-link');
  if (status) status.textContent = statusText || (state.peerCount ? 'Arkadaşların bağlandı, oylar anlık geliyor.' : 'Oda eşleştiriliyor. Arkadaşına bağlantıyı gönder.');
  const observedCount = Math.max(state.participants.length, state.trackerPeerCount || 1);
  if (memberCount) memberCount.textContent = `${observedCount} kişi`;
  if (moderatorPanel) moderatorPanel.hidden = !state.isHost;
  if (signalStatus && state.isHost) {
    signalStatus.textContent = observedCount > state.participants.length
      ? `${observedCount} kişi tracker tarafından görüldü; doğrudan bağlantı hazırlanıyor.`
      : `${observedCount} kişi aktif bağlantıda.`;
  }
  if (peers) {
    peers.innerHTML = state.isHost
      ? state.participants.map(person => `<span class="decision-room-person ${person.role === 'moderator' ? 'is-moderator' : ''}"><i data-lucide="${person.role === 'moderator' ? 'crown' : 'circle-user-round'}"></i>${escapeHtml(person.nickname)}${person.id === state.selfId ? ' (Sen)' : ''}</span>`).join('')
      : '';
  }
  if (link) link.value = buildRoomUrl(state.roomCode);

  if (deck) {
    if (!state.cards.length) {
      deck.innerHTML = `<div class="decision-room-empty"><i data-lucide="sparkles"></i><strong>Adaylar hazırlanıyor</strong><span>Oda sahibi ortak izleme listesi oluşturuyor.</span></div>`;
    } else {
      deck.innerHTML = state.cards.map(card => {
        const title = card.title || card.name || 'İsimsiz içerik';
        const meta = card.type === 'tv'
          ? `Dizi · S${Math.max(1, Number(card.season) || 1)} B${Math.max(1, Number(card.episode) || 1)}`
          : 'Film';
        const vote = voteSummary(card, state);
        const myVote = state.votes[card.id]?.[state.selfId];
        const rating = ratingSummary(card, state);
        const stars = [1, 2, 3, 4, 5].map(value => `<button data-room-rating="${value}" data-card-id="${card.id}" class="${rating.mine >= value ? 'active-star' : ''}" aria-label="${value} yıldız"><i data-lucide="star"></i></button>`).join('');
        return `<article class="decision-room-card ${vote.matched ? 'matched' : ''}">
          <img src="${getImageUrl(card.poster_path, TMDB_IMAGE_SIZES.POSTER_SMALL)}" alt="" loading="lazy" />
          <div class="decision-room-card-body">
            <span>${meta} · ★ ${(Number(card.vote_average) || 0).toFixed(1)}</span>
            <strong>${escapeHtml(title)}</strong>
            <small>${vote.matched ? 'Herkes izlemek istiyor!' : `${vote.yes}/${vote.needed} kişi izlemek istiyor`}</small>
            <div class="decision-room-rating"><span>${rating.count ? `Ortak puan ${rating.average.toFixed(1)} · ${rating.count} oy` : 'Puan ver'}</span><div>${stars}</div></div>
            <div class="decision-room-votes">
              <button data-room-vote="yes" data-card-id="${card.id}" class="${myVote === 'yes' ? 'active-yes' : ''}"><i data-lucide="heart"></i> İzle</button>
              <button data-room-vote="no" data-card-id="${card.id}" class="${myVote === 'no' ? 'active-no' : ''}"><i data-lucide="skip-forward"></i> Geç</button>
              ${vote.matched ? `<button data-room-open="${card.id}" class="decision-room-open"><i data-lucide="play"></i> Birlikte Aç</button>` : ''}
              ${state.isHost ? `<button data-room-remove="${card.id}" class="decision-room-remove" aria-label="${escapeHtml(title)} içeriğini odadan kaldır"><i data-lucide="trash-2"></i> Kaldır</button>` : ''}
            </div>
          </div>
        </article>`;
      }).join('');
    }

    deck.querySelectorAll('[data-room-vote]').forEach(button => {
      button.onclick = () => activeRoom?.vote(button.dataset.cardId, button.dataset.roomVote);
    });
    deck.querySelectorAll('[data-room-rating]').forEach(button => {
      button.onclick = () => activeRoom?.rate(button.dataset.cardId, button.dataset.roomRating);
    });
    deck.querySelectorAll('[data-room-open]').forEach(button => {
      button.onclick = () => {
        const card = state.cards.find(item => String(item.id) === button.dataset.roomOpen);
        if (card) activeRoom?.openForEveryone(card);
      };
    });
    deck.querySelectorAll('[data-room-remove]').forEach(button => {
      button.onclick = () => {
        if (activeRoom?.removeCard(button.dataset.roomRemove)) showToast('İçerik odadan kaldırıldı.', 'success');
      };
    });
  }
  renderIcons(root);
}

function toRoomCard(item) {
  return {
    id: item.id,
    type: item.type || item.media_type || (item.first_air_date ? 'tv' : 'movie'),
    title: item.title,
    name: item.name,
    poster_path: item.poster_path,
    vote_average: item.vote_average,
    season: item.type === 'tv' || item.media_type === 'tv' ? Math.max(1, Number(item.season) || 1) : null,
    episode: item.type === 'tv' || item.media_type === 'tv' ? Math.max(1, Number(item.episode) || 1) : null
  };
}

function setupModeratorContentSearch(root, room) {
  const form = root.querySelector('#decision-room-content-form');
  const input = root.querySelector('#decision-room-content-search');
  const results = root.querySelector('#decision-room-content-results');
  if (!form || !input || !results || !room.isHost) return;

  let debounceTimer = null;
  let requestId = 0;
  const runSearch = async () => {
    const query = input.value.trim();
    if (query.length < 2) {
      results.innerHTML = '';
      return;
    }
    const currentRequest = ++requestId;
    results.innerHTML = '<span class="decision-room-search-status">Aranıyor…</span>';
    const items = await searchMulti(query).catch(() => []);
    if (currentRequest !== requestId || input.value.trim() !== query) return;
    const matches = items.filter(item => item?.id && (item.type === 'movie' || item.type === 'tv')).slice(0, 5);
    results.innerHTML = matches.length ? matches.map(item => {
      const card = toRoomCard(item);
      const episodeChoice = card.type === 'tv'
        ? `<span class="decision-room-episode-choice" aria-label="Bölüm seçimi"><label>Sezon <input data-add-season type="number" min="1" value="1" inputmode="numeric" /></label><label>Bölüm <input data-add-episode type="number" min="1" value="1" inputmode="numeric" /></label></span>`
        : '';
      return `<div class="decision-room-search-result"><button type="button" data-add-room-card="${card.id}" data-add-room-type="${card.type}" title="Odaya ekle"><img src="${getImageUrl(card.poster_path, TMDB_IMAGE_SIZES.POSTER_SMALL)}" alt="" /><span><strong>${escapeHtml(card.title || card.name || 'İsimsiz içerik')}</strong><small>${card.type === 'tv' ? 'Dizi' : 'Film'} · ★ ${(Number(card.vote_average) || 0).toFixed(1)}</small></span><i data-lucide="plus"></i></button>${episodeChoice}</div>`;
    }).join('') : '<span class="decision-room-search-status">Sonuç bulunamadı.</span>';
    results.querySelectorAll('[data-add-room-card]').forEach(button => {
      button.onclick = () => {
        const item = matches.find(candidate => String(candidate.id) === button.dataset.addRoomCard && (candidate.type || candidate.media_type) === button.dataset.addRoomType);
        if (!item) return;
        const result = button.closest('.decision-room-search-result');
        const season = Number(result?.querySelector('[data-add-season]')?.value) || 1;
        const episode = Number(result?.querySelector('[data-add-episode]')?.value) || 1;
        if (room.addCard(toRoomCard({ ...item, season, episode }))) {
          input.value = '';
          results.innerHTML = '';
          showToast('İçerik odaya eklendi.', 'success');
        } else {
          showToast('Bu içerik zaten listede veya oda dolu.', 'warning');
        }
      };
    });
    renderIcons(results);
  };
  form.onsubmit = event => {
    event.preventDefault();
    window.clearTimeout(debounceTimer);
    runSearch();
  };
  input.oninput = () => {
    window.clearTimeout(debounceTimer);
    if (input.value.trim().length < 2) {
      requestId += 1;
      results.innerHTML = '';
      return;
    }
    debounceTimer = window.setTimeout(runSearch, 220);
  };
}

async function loadCandidates(room, root) {
  const status = root.querySelector('#decision-room-status');
  if (status) status.textContent = 'Ortak adaylar hazırlanıyor…';
  try {
    const list = await fetchTrending('all', 'week');
    const candidates = (list || [])
      .filter(item => item?.id && (item.media_type === 'movie' || item.media_type === 'tv' || item.type === 'movie' || item.type === 'tv'))
      .slice(0, 8)
      .map(toRoomCard);
    if (!candidates.length) throw new Error('Aday bulunamadı.');
    room.setCards(candidates);
  } catch (_) {
    if (status) status.textContent = 'Adaylar şu an yüklenemedi. Biraz sonra yeniden dene.';
  }
}

export async function openDecisionRoomModal({ roomCode = getRoomCodeFromUrl(), isHost = false } = {}) {
  if (!roomCode) {
    createLobby();
    return;
  }
  closeDecisionRoomModal(false);
  const joinedRoomCode = roomCode;
  if (isHost) rememberRoomOwner(joinedRoomCode);
  // Aynı cihazdaki moderatör sayfayı yenilese bile oda sahibi olarak kalır.
  // Davet bağlantısıyla gelen başka bir cihaz bu işareti taşımaz.
  const roomOwner = Boolean(isHost || isRememberedRoomOwner(joinedRoomCode));
  const nickname = createAnonymousNickname();

  const root = document.createElement('div');
  root.id = 'decision-room-modal-root';
  root.className = 'decision-room-backdrop';
  document.body.appendChild(root);
  activeRoomModal = root;

  if (roomOwner) {
    try { history.replaceState(history.state, '', buildRoomUrl(joinedRoomCode)); } catch (_) {}
  }

  root.innerHTML = `
    <section class="decision-room-dialog" role="dialog" aria-modal="true" aria-label="Ortak Karar Odası">
      <button id="btn-close-decision-room" class="decision-room-close" aria-label="Kapat"><i data-lucide="x"></i></button>
      <header class="decision-room-header">
        <div class="decision-room-icon"><i data-lucide="users-round"></i></div>
        <div><h2>Birlikte Seç</h2><p>Herkesin istediği içeriği birlikte bulun.</p></div>
      </header>
      <div class="decision-room-code-panel">
        <span>ODA KODU</span>
        <strong id="decision-room-code">${escapeHtml(joinedRoomCode)}</strong>
        <button id="btn-copy-decision-room"><i data-lucide="copy"></i> Kodu Kopyala</button>
        <small>Arkadaşın “Birlikte Seç” ekranında bu kodu yazsın.</small>
      </div>
      <div class="decision-room-live"><span class="decision-room-live-dot"></span><span id="decision-room-status">Oda hazırlanıyor…</span><strong id="decision-room-member-count" class="decision-room-member-count">1 kişi</strong></div>
      <section id="decision-room-moderator-panel" class="decision-room-moderator-panel" hidden>
        <div><i data-lucide="crown"></i><strong>Moderatör paneli</strong><span>Katılanlar anonim kalır; yalnızca bu odadaki takma adları görünür.</span></div>
        <small id="decision-room-signal-status" class="decision-room-signal-status">Katılım sinyali bekleniyor…</small>
        <div id="decision-room-peers" class="decision-room-peers"></div>
        <form id="decision-room-content-form" class="decision-room-content-form"><label for="decision-room-content-search">Film veya dizi ekle</label><div><input id="decision-room-content-search" minlength="2" placeholder="İçerik ara" /><button type="submit"><i data-lucide="search"></i> Ara</button></div></form>
        <div id="decision-room-content-results" class="decision-room-content-results"></div>
      </section>
      <div id="decision-room-deck" class="decision-room-deck"></div>
      <footer class="decision-room-footer"><span>Oda kapanınca oylar silinir.</span><button id="btn-refresh-decision-cards"><i data-lucide="refresh-cw"></i> Yeni adaylar</button></footer>
    </section>`;

  // Bağlantı kurulurken tracker yavaş kalırsa bile kullanıcı pencereyi hemen
  // kapatabilsin. Dinleyiciyi await sonrasına bırakmak mobilde kapatma tuşunu
  // geçici olarak tepkisiz bırakıyordu.
  const closeRoom = () => closeDecisionRoomModal(true);
  root.querySelector('#btn-close-decision-room').addEventListener('click', closeRoom);
  root.addEventListener('click', event => {
    if (event.target === root) closeRoom();
  });
  const closeForSharedPlayback = () => hideDecisionRoomModalForPlayback();
  window.addEventListener('cinepulse:decision-room-open', closeForSharedPlayback, { once: true });
  removeSharedOpenListener = () => window.removeEventListener('cinepulse:decision-room-open', closeForSharedPlayback);

  const room = new AnonymousDecisionRoom({ roomCode: joinedRoomCode, nickname, isHost: roomOwner });
  activeRoom = room;
  unsubscribe = room.subscribe(state => renderRoomState(root, state));
  await room.connect();
  // Kullanıcı bağlantı kurulurken kapattıysa artık DOM'a ya da kapatılmış
  // odaya işlem yapma.
  if (activeRoom !== room || activeRoomModal !== root) return;
  setupModeratorContentSearch(root, room);

  root.querySelector('#btn-copy-decision-room').onclick = async () => {
    try {
      await navigator.clipboard.writeText(joinedRoomCode);
      showToast('Oda kodu kopyalandı.', 'success');
    } catch (_) {
      const code = root.querySelector('#decision-room-code');
      const range = document.createRange();
      range.selectNodeContents(code);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      document.execCommand('copy');
      window.getSelection()?.removeAllRanges();
      showToast('Oda kodu kopyalandı.', 'success');
    }
  };
  root.querySelector('#btn-refresh-decision-cards').onclick = () => loadCandidates(activeRoom, root);
  renderIcons(root);
}

export function closeDecisionRoomModal(removeLink = true) {
  removeSharedOpenListener?.();
  removeSharedOpenListener = null;
  unsubscribe?.();
  unsubscribe = null;
  activeRoom?.destroy();
  activeRoom = null;
  activeRoomModal?.remove();
  activeRoomModal = null;
  if (removeLink) removeRoomCodeFromUrl();
}

// Oynatıcı açıldığında pencereyi gizliyoruz, odayı ise kapatmıyoruz. Bu
// fonksiyon aynı canlı odayı yeniden gösterir; yeniden tracker'a bağlanıp
// ikinci bir WebRTC oturumu başlatmaz.
export function returnToDecisionRoomModal() {
  if (activeRoomModal) return;
  if (!activeRoom) {
    createLobby();
    return;
  }

  const room = activeRoom;
  const root = document.createElement('div');
  root.id = 'decision-room-modal-root';
  root.className = 'decision-room-backdrop';
  document.body.appendChild(root);
  activeRoomModal = root;
  root.innerHTML = `
    <section class="decision-room-dialog" role="dialog" aria-modal="true" aria-label="Ortak Karar Odası">
      <button id="btn-close-decision-room" class="decision-room-close" aria-label="Kapat"><i data-lucide="x"></i></button>
      <header class="decision-room-header"><div class="decision-room-icon"><i data-lucide="users-round"></i></div><div><h2>Birlikte Seç</h2><p>Odan hâlâ açık. Adayları ve katılımcıları buradan gör.</p></div></header>
      <div class="decision-room-code-panel"><span>ODA KODU</span><strong id="decision-room-code">${escapeHtml(room.roomCode)}</strong><button id="btn-copy-decision-room"><i data-lucide="copy"></i> Kodu Kopyala</button><small>Arkadaşın “Birlikte Seç” ekranında bu kodu yazsın.</small></div>
      <div class="decision-room-live"><span class="decision-room-live-dot"></span><span id="decision-room-status">Odaya dönüldü.</span><strong id="decision-room-member-count" class="decision-room-member-count">1 kişi</strong></div>
      <section id="decision-room-moderator-panel" class="decision-room-moderator-panel" hidden><div><i data-lucide="crown"></i><strong>Moderatör paneli</strong><span>Katılanlar anonim kalır; yalnızca bu odadaki takma adları görünür.</span></div><small id="decision-room-signal-status" class="decision-room-signal-status"></small><div id="decision-room-peers" class="decision-room-peers"></div><form id="decision-room-content-form" class="decision-room-content-form"><label for="decision-room-content-search">Film veya dizi ekle</label><div><input id="decision-room-content-search" minlength="2" placeholder="İçerik ara" /><button type="submit"><i data-lucide="search"></i> Ara</button></div></form><div id="decision-room-content-results" class="decision-room-content-results"></div></section>
      <div id="decision-room-deck" class="decision-room-deck"></div>
      <footer class="decision-room-footer"><span>Oda kapanınca oylar silinir.</span><button id="btn-refresh-decision-cards"><i data-lucide="refresh-cw"></i> Yeni adaylar</button></footer>
    </section>`;

  const closeRoom = () => closeDecisionRoomModal(true);
  root.querySelector('#btn-close-decision-room').onclick = closeRoom;
  root.addEventListener('click', event => { if (event.target === root) closeRoom(); });
  const closeForSharedPlayback = () => hideDecisionRoomModalForPlayback();
  window.addEventListener('cinepulse:decision-room-open', closeForSharedPlayback, { once: true });
  removeSharedOpenListener = () => window.removeEventListener('cinepulse:decision-room-open', closeForSharedPlayback);
  unsubscribe = room.subscribe(state => renderRoomState(root, state));
  setupModeratorContentSearch(root, room);
  root.querySelector('#btn-copy-decision-room').onclick = async () => {
    try {
      await navigator.clipboard.writeText(room.roomCode);
      showToast('Oda kodu kopyalandı.', 'success');
    } catch (_) {
      showToast(`Oda kodu: ${room.roomCode}`, 'info');
    }
  };
  root.querySelector('#btn-refresh-decision-cards').onclick = () => loadCandidates(room, root);
  renderIcons(root);
}

function hideDecisionRoomModalForPlayback() {
  removeSharedOpenListener?.();
  removeSharedOpenListener = null;
  unsubscribe?.();
  unsubscribe = null;
  // WebRTC veri kanalı oynatıcı açıkken yaşamaya devam eder. Böylece
  // moderatörün süre, oynat/durdur ve sarma komutları diğer cihaza gider.
  activeRoomModal?.remove();
  activeRoomModal = null;
}
