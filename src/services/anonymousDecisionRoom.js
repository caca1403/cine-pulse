/* ==========================================================================
   CinePulse — Anonymous Decision Room transport
   Rooms use WebRTC data channels. A public WebTorrent tracker only exchanges
   connection offers; room messages travel directly between browsers and are
   kept in memory for the lifetime of the open room.
   ========================================================================== */

import TrackerClient from 'bittorrent-tracker/client';
import { Buffer as BrowserBuffer } from 'buffer';
import browserProcess from 'process/browser';

// bittorrent-tracker tarayıcı sürümü, kimlik paketlerini üretirken Buffer'ın
// global olarak bulunacağını varsayıyor. Vite Node global'lerini eklemediği
// için bu uyumluluğu yalnız oda modülü yüklendiğinde sağlıyoruz.
if (!globalThis.Buffer) globalThis.Buffer = BrowserBuffer;
if (!globalThis.process) globalThis.process = browserProcess;

const TRACKERS = [
  'wss://tracker.openwebtorrent.com',
  'wss://tracker.btorrent.xyz',
  'wss://tracker.webtorrent.dev',
  'wss://tracker.files.fm:7073/announce',
  'wss://spacetrackr.link:443/announce',
  'wss://tracker.fastcast.nz:443/announce'
];

const MAX_RECENT_MESSAGES = 160;
const ROOM_OWNER_KEY_PREFIX = 'cinepulse.decision-room.owner.';

function randomHex(byteLength = 12) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

function safeRoomCode(value = '') {
  const code = String(value).replace(/\D/g, '');
  return code.length === 6 ? code : '';
}

async function roomInfoHash(roomCode) {
  const input = new TextEncoder().encode(`cinepulse-decision-room-v1:${roomCode}`);
  const digest = await crypto.subtle.digest('SHA-256', input);
  return Array.from(new Uint8Array(digest).slice(0, 20), byte => byte.toString(16).padStart(2, '0')).join('');
}

export function createRoomCode() {
  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  return String(100000 + (value[0] % 900000));
}

export function rememberRoomOwner(roomCode) {
  const safeCode = safeRoomCode(roomCode);
  if (!safeCode) return;
  try { sessionStorage.setItem(`${ROOM_OWNER_KEY_PREFIX}${safeCode}`, '1'); } catch (_) {}
}

export function isRememberedRoomOwner(roomCode) {
  const safeCode = safeRoomCode(roomCode);
  if (!safeCode) return false;
  try { return sessionStorage.getItem(`${ROOM_OWNER_KEY_PREFIX}${safeCode}`) === '1'; } catch (_) { return false; }
}

export function getRoomCodeFromUrl() {
  try {
    return safeRoomCode(new URL(window.location.href).searchParams.get('oda') || '');
  } catch (_) {
    return '';
  }
}

export function buildRoomUrl(roomCode) {
  const url = new URL(window.location.href);
  url.searchParams.set('oda', safeRoomCode(roomCode));
  return url.toString();
}

export function removeRoomCodeFromUrl() {
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('oda');
    history.replaceState(history.state, '', url.toString());
  } catch (_) {}
}

export function createAnonymousNickname() {
  const labels = ['Sinemasever', 'Gece Kuşu', 'Patlamış Mısır', 'Film Avcısı', 'Koltuğunda'];
  const suffix = randomHex(2).toUpperCase();
  return `${labels[Math.floor(Math.random() * labels.length)]} ${suffix}`;
}

export class AnonymousDecisionRoom {
  constructor({ roomCode, nickname = createAnonymousNickname(), isHost = false }) {
    this.roomCode = safeRoomCode(roomCode);
    this.nickname = String(nickname || createAnonymousNickname()).slice(0, 30);
    this.isHost = Boolean(isHost);
    this.selfId = randomHex(10);
    this.client = null;
    this.peers = new Map();
    this.peerParticipantIds = new WeakMap();
    this.trackerPeerCount = 1;
    this.announceTimer = null;
    this.participants = new Map([[this.selfId, {
      id: this.selfId,
      nickname: this.nickname,
      role: this.isHost ? 'moderator' : 'participant'
    }]]);
    this.listeners = new Set();
    this.receivedIds = new Set();
    this.cards = [];
    this.votes = {};
    this.ratings = {};
    this.destroyed = false;
  }

  snapshot() {
    return {
      roomCode: this.roomCode,
      nickname: this.nickname,
      selfId: this.selfId,
      isHost: this.isHost,
      peerCount: this.peers.size,
      trackerPeerCount: this.trackerPeerCount,
      participants: Array.from(this.participants.values()),
      cards: this.cards,
      votes: this.votes,
      ratings: this.ratings
    };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.snapshot());
    return () => this.listeners.delete(listener);
  }

  emit() {
    const state = this.snapshot();
    this.listeners.forEach(listener => listener(state));
  }

  async connect() {
    if (!this.roomCode) throw new Error('Geçersiz oda kodu.');
    const infoHash = await roomInfoHash(this.roomCode);
    if (this.destroyed) return;

    this.client = new TrackerClient({
      infoHash,
      peerId: randomHex(20),
      announce: TRACKERS,
      port: 0,
      rtcConfig: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
      }
    });

    this.client.on('peer', peer => this.attachPeer(peer));
    this.client.on('update', data => {
      const announced = Number(data?.complete || 0) + Number(data?.incomplete || 0);
      this.trackerPeerCount = Math.max(1, announced || 1);
      this.emit();
    });
    this.client.on('warning', () => this.emit());
    // Bir tracker hata verdiğinde diğer tracker'ların çalışmasına izin ver.
    this.client.on('error', () => this.emit());
    this.client.start({ numwant: 5, left: 1 });
    // Public tracker'lar uzun duyuru aralığı verebilir. Kısa ömürlü odalarda
    // bu tekrar denemesi, sonradan katılan telefonun hızlı görünmesini sağlar.
    this.announceTimer = window.setInterval(() => {
      try { this.client?.update({ numwant: 5, left: 1 }); } catch (_) {}
    }, 15000);
    this.emit();
  }

  attachPeer(peer) {
    let peerKey = peer.id || randomHex(8);
    const onConnect = () => {
      if (this.destroyed) return;
      peerKey = peer.id || peerKey;
      this.peers.set(peerKey, peer);
      this.sendTo(peer, {
        type: 'hello',
        participant: {
          id: this.selfId,
          nickname: this.nickname,
          role: this.isHost ? 'moderator' : 'participant'
        },
        wantsState: true
      });
      this.emit();
    };
    const onData = data => this.receive(data, peer);
    const onClose = () => {
      this.peers.delete(peerKey);
      const participantId = this.peerParticipantIds.get(peer);
      if (participantId) {
        const hasAnotherConnection = Array.from(this.peers.values())
          .some(connectedPeer => this.peerParticipantIds.get(connectedPeer) === participantId);
        if (!hasAnotherConnection) this.participants.delete(participantId);
      }
      this.emit();
    };
    const onError = () => onClose();

    peer.once('connect', onConnect);
    peer.on('data', onData);
    peer.once('close', onClose);
    peer.once('error', onError);
  }

  sendTo(peer, payload) {
    try {
      if (!peer || peer.destroyed || !peer.connected) return;
      peer.send(JSON.stringify({ ...payload, id: randomHex(10), senderId: this.selfId }));
    } catch (_) {}
  }

  broadcast(payload) {
    const message = { ...payload, id: randomHex(10), senderId: this.selfId };
    this.remember(message.id);
    this.peers.forEach(peer => {
      try {
        if (!peer.destroyed && peer.connected) peer.send(JSON.stringify(message));
      } catch (_) {}
    });
  }

  remember(id) {
    this.receivedIds.add(id);
    if (this.receivedIds.size > MAX_RECENT_MESSAGES) {
      this.receivedIds.delete(this.receivedIds.values().next().value);
    }
  }

  receive(raw, sourcePeer) {
    let message;
    try {
      message = JSON.parse(typeof raw === 'string' ? raw : new TextDecoder().decode(raw));
    } catch (_) {
      return;
    }
    if (!message?.id || this.receivedIds.has(message.id) || message.senderId === this.selfId) return;
    this.remember(message.id);

    if (message.type === 'hello' && message.participant?.id) {
      this.participants.set(message.participant.id, message.participant);
      this.peerParticipantIds.set(sourcePeer, message.participant.id);
      // İlk "hello" karşılıklı olduğu için her hello'ya tekrar hello vermek,
      // iki cihaz arasında sonsuz mesaj döngüsü oluşturuyordu. Bu hem mobilde
      // kasmaya hem de bazı tarayıcılarda bağlantının kopmasına yol açıyordu.
      if (message.wantsState) {
        this.sendTo(sourcePeer, {
          type: 'hello',
          participant: {
            id: this.selfId,
            nickname: this.nickname,
            role: this.isHost ? 'moderator' : 'participant'
          }
        });
        // Listeyi yalnız oda sahibi dağıtır. Katılımcının boş ilk durumu oda
        // sahibinin adaylarını ezmemeli.
        if (this.isHost) {
          this.sendTo(sourcePeer, {
            type: 'state',
            cards: this.cards,
            votes: this.votes,
            ratings: this.ratings,
            participants: Array.from(this.participants.values())
          });
        }
      }
      this.emit();
    }

    if (message.type === 'state' && Array.isArray(message.cards) && !this.isHost) {
      this.cards = message.cards.slice(0, 12);
      this.votes = message.votes || {};
      this.ratings = message.ratings || {};
      if (Array.isArray(message.participants)) {
        message.participants.forEach(person => {
          if (person?.id && person?.nickname) this.participants.set(person.id, person);
        });
      }
      this.emit();
    }

    if (message.type === 'cards' && Array.isArray(message.cards) && !this.isHost) {
      this.cards = message.cards.slice(0, 12);
      this.votes = message.votes || {};
      this.ratings = message.ratings || {};
      this.emit();
    }

    if (message.type === 'vote' && message.cardId && message.senderId) {
      this.votes = { ...this.votes, [message.cardId]: { ...(this.votes[message.cardId] || {}), [message.senderId]: message.vote === 'yes' ? 'yes' : 'no' } };
      this.emit();
    }

    if (message.type === 'rating' && message.cardId && message.senderId) {
      const rating = Math.max(1, Math.min(5, Number(message.rating) || 0));
      if (!rating) return;
      this.ratings = { ...this.ratings, [message.cardId]: { ...(this.ratings[message.cardId] || {}), [message.senderId]: rating } };
      this.emit();
    }

    if (message.type === 'open' && message.card?.id) {
      window.location.hash = `#detail?type=${message.card.type === 'tv' ? 'tv' : 'movie'}&id=${message.card.id}`;
    }
  }

  setCards(cards) {
    if (!this.isHost) return;
    this.cards = Array.isArray(cards) ? cards.slice(0, 12) : [];
    this.votes = {};
    this.ratings = {};
    this.broadcast({ type: 'cards', cards: this.cards, votes: this.votes, ratings: this.ratings });
    this.emit();
  }

  addCard(card) {
    if (!this.isHost || !card?.id || this.cards.length >= 12 || this.cards.some(item => String(item.id) === String(card.id) && item.type === card.type)) return false;
    this.cards = [...this.cards, card];
    this.broadcast({ type: 'cards', cards: this.cards, votes: this.votes, ratings: this.ratings });
    this.emit();
    return true;
  }

  vote(cardId, vote) {
    if (!cardId) return;
    this.votes = { ...this.votes, [cardId]: { ...(this.votes[cardId] || {}), [this.selfId]: vote === 'yes' ? 'yes' : 'no' } };
    this.broadcast({ type: 'vote', cardId, vote: vote === 'yes' ? 'yes' : 'no' });
    this.emit();
  }

  rate(cardId, rating) {
    if (!cardId) return;
    const value = Math.max(1, Math.min(5, Number(rating) || 0));
    if (!value) return;
    this.ratings = { ...this.ratings, [cardId]: { ...(this.ratings[cardId] || {}), [this.selfId]: value } };
    this.broadcast({ type: 'rating', cardId, rating: value });
    this.emit();
  }

  openForEveryone(card) {
    if (!card?.id) return;
    this.broadcast({ type: 'open', card });
    window.location.hash = `#detail?type=${card.type === 'tv' ? 'tv' : 'movie'}&id=${card.id}`;
  }

  destroy() {
    this.destroyed = true;
    if (this.announceTimer) window.clearInterval(this.announceTimer);
    this.announceTimer = null;
    this.peers.forEach(peer => {
      try { peer.destroy(); } catch (_) {}
    });
    this.peers.clear();
    try { this.client?.stop(); } catch (_) {}
    try { this.client?.destroy(); } catch (_) {}
    this.listeners.clear();
  }
}
