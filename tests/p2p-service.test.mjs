/* ==========================================================================
   p2pService saf birim testleri — ağ YOK (fetch enjekte edilir)
   Çalıştırma: node --test tests/p2p-service.test.mjs
   ========================================================================== */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  base32ToHex,
  buildCheckUrl,
  buildPlayUrl,
  classifyStatus,
  extractInfoHash,
  getP2pConsent,
  isP2pAvailable,
  isPlayableVideoName,
  pollTorrentStatus,
  setP2pConsent,
  P2P_CONSENT_KEY,
} from '../src/services/dogrudan/p2pService.js';

const HEX = 'a'.repeat(40);
const magnet = hash => `magnet:?xt=urn:btih:${hash}&dn=test&tr=udp%3A%2F%2Ftracker`;

// ---------- infoHash çıkarma ----------

test('magnet: 40 hex doğru çıkar, küçük harfe çevrilir', () => {
  const r = extractInfoHash(magnet(HEX.toUpperCase()));
  assert.equal(r.ok, true);
  assert.equal(r.hash, HEX);
});

test('çıplak 40 hex kabul edilir', () => {
  const r = extractInfoHash(HEX);
  assert.equal(r.ok, true);
  assert.equal(r.hash, HEX);
});

test('RFC4648 bilinen vektör: base32 "1234567890" → hex', () => {
  assert.equal(base32ToHex('GEZDGNBVGY3TQOJQ'), '31323334353637383930');
});

test('magnet: 32 base32 btih → 40 hex çevrilir', () => {
  // 20 baytlık örnek: 00..13 artan sayılar
  const beklenen = [...Array(20).keys()].map(i => i.toString(16).padStart(2, '0')).join('');
  // 5-bitlik grupları elle kurmak yerine: hex→base32 tersine çevrimi servis API'siyle doğrula
  const b32 = hexToBase32Test(beklenen);
  const r = extractInfoHash(magnet(b32));
  assert.equal(r.ok, true);
  assert.equal(r.hash, beklenen);
});

// Test yardımcısı: hex → base32 (servisin tersini bağımsız kurarak round-trip doğrularız)
function hexToBase32Test(hex) {
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0, value = 0, out = '';
  for (let i = 0; i < hex.length; i += 2) {
    value = (value << 8) | parseInt(hex.slice(i, i + 2), 16);
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      out += A[(value >> bits) & 31];
    }
  }
  if (bits > 0) out += A[(value << (5 - bits)) & 31];
  return out;
}

test('base32 dışı 32 karakter (8/9/0 rakamları) reddedilir', () => {
  const r = extractInfoHash('A'.repeat(28) + '8901');
  assert.equal(r.ok, false);
});

test('boş girdi Türkçe gerekçeyle reddedilir', () => {
  const r = extractInfoHash('   ');
  assert.equal(r.ok, false);
  assert.match(r.reason, /boş/i);
});

test('çöp girdi Türkçe gerekçeyle reddedilir', () => {
  const r = extractInfoHash('film izle full hd');
  assert.equal(r.ok, false);
  assert.match(r.reason, /btih/);
});

test('magnet önceliklidir: metin içinde btih aranır', () => {
  const r = extractInfoHash(`  ${magnet(HEX)}  `);
  assert.equal(r.ok, true);
  assert.equal(r.hash, HEX);
});

// ---------- URL üreticileri ----------

test('check URL :4000 sidecarına gider (node: pencere yok)', () => {
  assert.equal(buildCheckUrl(HEX), `http://127.0.0.1:4000/torrent-check/${HEX}`);
});

test('play URL :4000 sidecarına gider', () => {
  assert.equal(buildPlayUrl(HEX), `http://127.0.0.1:4000/torrent/${HEX}`);
});

// ---------- durum sınıflandırma ----------

test('ready + mp4 → playable true', () => {
  const s = classifyStatus({ ready: true, name: 'Film', videoFile: 'film.mp4', sizeMb: '700', peers: 5 });
  assert.equal(s.state, 'ready');
  assert.equal(s.playable, true);
  assert.equal(s.peers, 5);
});

test('ready + mkv → playable false (dürüst ret)', () => {
  const s = classifyStatus({ ready: true, name: 'Film', videoFile: 'buyuk_film.mkv' });
  assert.equal(s.state, 'ready');
  assert.equal(s.playable, false);
});

test('starting + peer var → connecting', () => {
  const s = classifyStatus({ ready: false, starting: true, peers: 3, message: '3 eşle bağlanılıyor...' });
  assert.equal(s.state, 'connecting');
  assert.equal(s.peers, 3);
});

test('starting + peer yok → searching', () => {
  const s = classifyStatus({ ready: false, starting: true, peers: 0 });
  assert.equal(s.state, 'searching');
});

test('hata yanıtı hata durumuna döner', () => {
  assert.equal(classifyStatus({ error: 'Invalid infoHash' }).state, 'error');
  assert.equal(classifyStatus(null).state, 'error');
});

test('uzantı oynatılabilirlik: webm/mov evet, avi/flv hayır', () => {
  assert.equal(isPlayableVideoName('a.WEBM'), true);
  assert.equal(isPlayableVideoName('a.mov'), true);
  assert.equal(isPlayableVideoName('a.avi'), false);
  assert.equal(isPlayableVideoName('a.flv'), false);
});

// ---------- yoklama döngüsü (sahte fetch) ----------

function fakeFetch(responses) {
  let n = 0;
  const calls = [];
  const fn = async (url) => {
    calls.push(url);
    const body = responses[Math.min(n, responses.length - 1)];
    n += 1;
    return { json: async () => body };
  };
  fn.calls = calls;
  return fn;
}

test('poll: searching → searching → ready döner ve güncelleme bildirir', async () => {
  const seen = [];
  const impl = fakeFetch([
    { ready: false, starting: true, peers: 0 },
    { ready: false, starting: true, peers: 2 },
    { ready: true, name: 'Denoeme', videoFile: 'x.mp4', peers: 4 },
  ]);
  const s = await pollTorrentStatus(HEX, {
    fetchImpl: impl, intervalMs: 5, timeoutMs: 2000, onUpdate: st => seen.push(st.state),
  });
  assert.equal(s.state, 'ready');
  assert.equal(s.videoFile, 'x.mp4');
  assert.deepEqual(seen, ['searching', 'connecting']);
  assert.equal(impl.calls.length, 3);
});

test('poll: önceden iptal edilmiş sinyal anında cancelled döner', async () => {
  const ac = new AbortController();
  ac.abort();
  const s = await pollTorrentStatus(HEX, { fetchImpl: fakeFetch([{ ready: true }]), signal: ac.signal });
  assert.equal(s.state, 'cancelled');
});

test('poll: ağ hataları aralıktan sonra timeout ile biter', async () => {
  const throwing = async () => { throw new Error('bağlantı yok'); };
  const s = await pollTorrentStatus(HEX, { fetchImpl: throwing, intervalMs: 5, timeoutMs: 40 });
  assert.equal(s.state, 'timeout');
});

// ---------- onay + erişilebilirlik ----------

test('onay kaydı: varsayılan yok, yazılınca okunur', () => {
  const store = new Map();
  globalThis.localStorage = {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: k => store.delete(k),
  };
  assert.equal(getP2pConsent(), false);
  assert.equal(setP2pConsent(true), true);
  assert.equal(getP2pConsent(), true);
  assert.equal(store.get(P2P_CONSENT_KEY), '1');
  delete globalThis.localStorage;
});

test('erişilebilirlik: pencere yoksa false (telefon/web motoru yok)', () => {
  assert.equal(typeof isP2pAvailable(), 'boolean');
  if (typeof window === 'undefined') assert.equal(isP2pAvailable(), false);
});
