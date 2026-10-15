/* ==========================================================================
   CinePulse Studio — P2P motor bağlayıcısı (F1, masaüstü)
   WebTorrent motoru server/mediaServer.js içinde zaten koşuyor (:4000).
   Bu modul YALNIZ üretici tarafı: magnet doğrulama, durum yoklama, URL
   üretimi ve onay kaydı. Ağ işi yapmaz — fetch enjekte edilir, böylece
   testler ağsız koşar. Türkçe UI metinleri burada tutulur.
   ========================================================================== */

import { apiUrl } from './apiOrigin.js';

// Onay anahtarı sabit — cihazda kalır, hiçbir yere gönderilmez.
export const P2P_CONSENT_KEY = 'sineflix_p2p_onay_v1';

const HEX40 = /^[0-9a-f]{40}$/;
const BASE32_32 = /^[A-Z2-7]{32}$/;
const B32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

// Tarayıcı <video> taginin dürüst çalabildikleri. MKV bilerek listede yok:
// motor onu indirir ama oynatıcı açamaz — kullanıcıya yalan söylemeyiz.
const PLAYABLE_EXT = /\.(mp4|m4v|webm|mov)$/i;

export function isP2pAvailable() {
  try {
    if (typeof window !== 'undefined' && window.CinePulseDesktop?.isDesktop === true) return true;
    if (typeof navigator !== 'undefined' && (navigator.userAgent || '').includes('CinePulseDesktop')) return true;
  } catch (_) {}
  return false;
}

// RFC4648 base32 → hex (btih base32 taşıyan magnet'ler için).
// Her 8 karakter = 5 bayt; girdi uzunluğu 8'in katı olmalı.
export function base32ToHex(input) {
  const b32 = String(input || '').trim().toUpperCase();
  if (!b32 || b32.length % 8 !== 0 || !/^[A-Z2-7]{8,}$/.test(b32)) return null;
  let bits = 0;
  let value = 0;
  let hex = '';
  for (const ch of b32) {
    value = (value << 5) | B32_ALPHABET.indexOf(ch);
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      hex += ((value >> bits) & 0xff).toString(16).padStart(2, '0');
      value &= (1 << bits) - 1;
    }
  }
  return hex;
}

// Manyetik adres ya da çıplak hash'ten 40'luk hex infoHash çıkarır.
// Dönen: { ok: true, hash } | { ok: false, reason: '<turkce>' }
export function extractInfoHash(raw) {
  const text = String(raw || '').trim();
  if (!text) return { ok: false, reason: 'Bağlantı boş — bir magnet adresi yapıştır.' };

  const magnetMatch = text.match(/btih:([a-zA-Z0-9]+)/i);
  const candidate = (magnetMatch ? magnetMatch[1] : text).toLowerCase();

  if (HEX40.test(candidate)) return { ok: true, hash: candidate };

  // 32 karakterlik base32 adayını çevir; 8/9/0/1 içeriyorsa zaten base32 olamaz.
  if (BASE32_32.test(candidate.toUpperCase())) {
    const hex = base32ToHex(candidate);
    if (hex) return { ok: true, hash: hex };
  }

  return {
    ok: false,
    reason: 'Geçersiz bilgi özeti — magnet adresinde "btih:" sonrası 40 karakterlik adres olmalı.',
  };
}

export function buildCheckUrl(infoHash) {
  return apiUrl(`/torrent-check/${String(infoHash || '').toLowerCase()}`);
}

export function buildPlayUrl(infoHash) {
  return apiUrl(`/torrent/${String(infoHash || '').toLowerCase()}`);
}

export function isPlayableVideoName(name) {
  return PLAYABLE_EXT.test(String(name || ''));
}

// mediaServer /torrent-check yanıtını UI durumuna çevirir (saf).
export function classifyStatus(json) {
  if (!json || typeof json !== 'object') {
    return { state: 'error', message: 'Sunucudan beklenmeyen yanıt.' };
  }
  if (json.error) return { state: 'error', message: String(json.error) };
  if (json.ready) {
    return {
      state: 'ready',
      name: json.name || '',
      videoFile: json.videoFile || '',
      sizeMb: json.sizeMb || '',
      progress: json.progress || '100%',
      speed: json.downloadSpeed || '',
      peers: Number(json.peers) || 0,
      playable: isPlayableVideoName(json.videoFile),
    };
  }
  const peers = Number(json.peers) || 0;
  return {
    state: peers > 0 ? 'connecting' : 'searching',
    message: json.message || (peers > 0 ? `${peers} eşle bağlanılıyor…` : 'Eş aranıyor…'),
    peers,
  };
}

// Hazır olana kadar /torrent-check yoklar. fetchImpl/enjeksiyon test içindir.
// Dönüş: classifyStatus sonucu | { state:'timeout' } | { state:'cancelled' }
export async function pollTorrentStatus(infoHash, options = {}) {
  const {
    onUpdate = null,
    signal = null,
    fetchImpl = null,
    timeoutMs = 90_000,
    intervalMs = 2_500,
  } = options;
  const doFetch = fetchImpl || ((...args) => fetch(...args));

  if (!infoHash) return { state: 'error', message: 'Geçersiz bağlantı.' };
  const url = buildCheckUrl(infoHash);
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (signal?.aborted) return { state: 'cancelled' };
    let status;
    try {
      const res = await doFetch(url);
      const json = await res.json();
      status = classifyStatus(json);
    } catch (err) {
      status = { state: 'searching', message: 'Motor sorgulanıyor…', peers: 0 };
    }
    if (status.state === 'ready') return status;
    if (status.state === 'error') return status;
    onUpdate?.(status);
    await new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, intervalMs);
      signal?.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new DOMException('aborted', 'AbortError'));
      }, { once: true });
    }).catch(() => { return { state: 'cancelled' }; });
    if (signal?.aborted) return { state: 'cancelled' };
  }
  return { state: 'timeout' };
}

// Onay kaydı — yalnız cihazda (localStorage); ağaç dışına çıkmaz.
const memoryStore = new Map();
function consentStore() {
  try {
    if (typeof localStorage !== 'undefined' && localStorage !== null) return localStorage;
  } catch (_) {}
  return {
    getItem: key => (memoryStore.has(key) ? memoryStore.get(key) : null),
    setItem: (key, value) => memoryStore.set(key, String(value)),
    removeItem: key => memoryStore.delete(key),
  };
}

export function getP2pConsent() {
  try {
    return consentStore().getItem(P2P_CONSENT_KEY) === '1';
  } catch (_) {
    return false;
  }
}

export function setP2pConsent(accepted) {
  try {
    consentStore().setItem(P2P_CONSENT_KEY, accepted ? '1' : '0');
    return true;
  } catch (_) {
    return false;
  }
}
