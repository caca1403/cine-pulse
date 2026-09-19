/* ==========================================================================
   CinePulse — Anonymous Decision Room transport
   Rooms use WebRTC data channels. A public WebTorrent tracker only exchanges
   connection offers; room messages travel directly between browsers and are
   kept in memory for the lifetime of the open room.
   ========================================================================== */

import TrackerClient from 'bittorrent-tracker/client';

const TRACKERS = [
  'wss://tracker.openwebtorrent.com',
  'wss://tracker.btorrent.xyz',
  'wss://tracker.webtorrent.dev'
];

const MAX_RECENT_MESSAGES = 160;

function randomHex(byteLength = 12) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

function safeRoomCode(value = '') {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 18);
}

async function roomInfoHash(roomCode) {
  const input = new TextEncoder().encode(`cinepulse-decision-room-v1:${roomCode}`);
  const digest = await crypto.subtle.digest('SHA-256', input);
  return Array.from(new Uint8Array(digest).slice(0, 20), byte => byte.toString(16).padStart(2, '0')).join('');
}

export function createRoomCode() {
  return randomHex(7);
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
    this.participants = new Map([[this.selfId, { id: this.selfId, nickname: this.nickname }]]);
    this.listeners = new Set();
    this.receivedIds = new Set();
    this.cards = [];
    this.votes = {};
    this.destroyed = false;
  }

  snapshot() {
    return {
      roomCode: this.roomCode,
      nickname: this.nickname,
      selfId: this.selfId,
      isHost: this.isHost,
      peerCount: this.peers.size,
      participants: Array.from(this.participants.values()),
      cards: this.cards,
      votes: this.votes
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
    this.client.on('warning', () => this.emit());
    this.client.start({ numwant: 8 });
    this.emit();
  }

  attachPeer(peer) {
    let peerKey = peer.id || randomHex(8);
    const onConnect = () => {
      if (this.destroyed) return;
      peerKey = peer.id || peerKey;
      this.peers.set(peerKey, peer);
      this.sendTo(peer, { type: 'hello', participant: { id: this.selfId, nickname: this.nickname }, wantsState: true });
      this.emit();
    };
    const onData = data => this.receive(data, peer);
    const onClose = () => {
      this.peers.delete(peerKey);
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
      this.sendTo(sourcePeer, { type: 'hello', participant: { id: this.selfId, nickname: this.nickname } });
      if (message.wantsState && this.cards.length) {
        this.sendTo(sourcePeer, { type: 'state', cards: this.cards, votes: this.votes });
      }
      this.emit();
    }

    if (message.type === 'state' && Array.isArray(message.cards)) {
      this.cards = message.cards.slice(0, 12);
      this.votes = message.votes || {};
      this.emit();
    }

    if (message.type === 'cards' && Array.isArray(message.cards)) {
      this.cards = message.cards.slice(0, 12);
      this.votes = {};
      this.emit();
    }

    if (message.type === 'vote' && message.cardId && message.senderId) {
      this.votes = { ...this.votes, [message.cardId]: { ...(this.votes[message.cardId] || {}), [message.senderId]: message.vote === 'yes' ? 'yes' : 'no' } };
      this.emit();
    }

    if (message.type === 'open' && message.card?.id) {
      window.location.hash = `#detail?type=${message.card.type === 'tv' ? 'tv' : 'movie'}&id=${message.card.id}`;
    }
  }

  setCards(cards) {
    this.cards = Array.isArray(cards) ? cards.slice(0, 12) : [];
    this.votes = {};
    this.broadcast({ type: 'cards', cards: this.cards });
    this.emit();
  }

  vote(cardId, vote) {
    if (!cardId) return;
    this.votes = { ...this.votes, [cardId]: { ...(this.votes[cardId] || {}), [this.selfId]: vote === 'yes' ? 'yes' : 'no' } };
    this.broadcast({ type: 'vote', cardId, vote: vote === 'yes' ? 'yes' : 'no' });
    this.emit();
  }

  openForEveryone(card) {
    if (!card?.id) return;
    this.broadcast({ type: 'open', card });
    window.location.hash = `#detail?type=${card.type === 'tv' ? 'tv' : 'movie'}&id=${card.id}`;
  }

  destroy() {
    this.destroyed = true;
    this.peers.forEach(peer => {
      try { peer.destroy(); } catch (_) {}
    });
    this.peers.clear();
    try { this.client?.stop(); } catch (_) {}
    try { this.client?.destroy(); } catch (_) {}
    this.listeners.clear();
  }
}
