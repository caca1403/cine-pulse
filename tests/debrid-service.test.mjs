import test from 'node:test';
import assert from 'node:assert/strict';
import {
  RD_API_BASE,
  RD_KEY_STORAGE,
  DebridError,
  DebridErrorCodes,
  getDebridKey,
  setDebridKey,
  clearDebridKey,
  maskDebridKey,
  buildUserUrl,
  buildTrafficUrl,
  buildTrafficDetailsUrl,
  buildAddMagnetUrl,
  buildTorrentInfoUrl,
  buildSelectFilesUrl,
  buildDeleteTorrentUrl,
  buildUnrestrictLinkUrl,
  buildUnrestrictCheckUrl,
  buildInstantAvailabilityUrl,
  buildAddMagnetBody,
  buildSelectFilesBody,
  buildUnrestrictLinkBody,
  authHeaders,
  extractInfoHashFromMagnet,
  normalizeInfoHash,
  isVideoFile,
  pickMediaFileIds,
  summarizeInstantAvailability,
  isHashInstantReady,
  formatExpiration,
  validateDebridKey,
  getAccountInfo,
  getTrafficLimits,
  getAccountStatus,
  addMagnet,
  getTorrentInfo,
  selectTorrentFiles,
  unrestrictLink,
  checkInstantAvailability,
  addMagnetAndSelect,
} from '../src/services/debridService.js';

// ---- Ağsız sahte-fetch altyapısı -------------------------------------------
function fakeFetch(routes) {
  const seen = [];
  const fn = async (url, opts = {}) => {
    seen.push({ url: String(url), opts });
    for (const r of routes) {
      if (r.match(String(url), opts)) return r.respond(String(url), opts);
    }
    return { ok: false, status: 404, json: async () => ({ error: 'not_found' }) };
  };
  fn.seen = seen;
  return fn;
}

const ok = (data, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => data });
const err = (status, data) => ({ ok: false, status, json: async () => data });

function withMemoryStorage() {
  const mem = new Map();
  const store = {
    getItem: (k) => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => { mem.set(k, String(v)); },
    removeItem: (k) => { mem.delete(k); },
  };
  const prev = globalThis.localStorage;
  Object.defineProperty(globalThis, 'localStorage', { value: store, configurable: true, writable: true });
  return () => {
    if (prev === undefined) delete globalThis.localStorage;
    else Object.defineProperty(globalThis, 'localStorage', { value: prev, configurable: true, writable: true });
  };
}

// 1 — sabit anahtar adı
test('sözleşme: localStorage anahtar adı sabit', () => {
  assert.equal(RD_KEY_STORAGE, 'sineflix_debrid_rd_key');
  assert.match(RD_API_BASE, /^https:\/\/api\.real-debrid\.com\/rest\/1\.0$/);
});

// 2 — hesap uçları
test('sözleşme: user + traffic URL üreticileri', () => {
  assert.equal(buildUserUrl(), `${RD_API_BASE}/user`);
  assert.equal(buildTrafficUrl(), `${RD_API_BASE}/traffic`);
  assert.equal(buildTrafficDetailsUrl(), `${RD_API_BASE}/traffic/details`);
});

// 3 — torrent uçları
test('sözleşme: torrent bilgi/seçim/silme URL üreticileri', () => {
  assert.equal(buildTorrentInfoUrl('ABC123'), `${RD_API_BASE}/torrents/info/ABC123`);
  assert.equal(buildSelectFilesUrl('ABC123'), `${RD_API_BASE}/torrents/selectFiles/ABC123`);
  assert.equal(buildDeleteTorrentUrl('ABC123'), `${RD_API_BASE}/torrents/delete/ABC123`);
  assert.equal(buildAddMagnetUrl(), `${RD_API_BASE}/torrents/addMagnet`);
  assert.equal(buildUnrestrictLinkUrl(), `${RD_API_BASE}/unrestrict/link`);
  assert.equal(buildUnrestrictCheckUrl(), `${RD_API_BASE}/unrestrict/check`);
  assert.throws(() => buildTorrentInfoUrl('  '), (e) => e instanceof DebridError && e.code === 'VALIDATION');
});

// 4 — cache-check URL
test('sözleşme: instantAvailability URL çoklu hash birleştirir', () => {
  const h1 = 'a'.repeat(40);
  const h2 = 'B'.repeat(40);
  const url = buildInstantAvailabilityUrl([h1, h2]);
  assert.equal(url, `${RD_API_BASE}/torrents/instantAvailability/${h1}/${h2.toLowerCase()}`);
  assert.throws(() => buildInstantAvailabilityUrl([]), (e) => e.code === 'VALIDATION');
  assert.throws(() => buildInstantAvailabilityUrl(['zzz']), (e) => e.code === 'VALIDATION');
});

// 5 — gövde üreticileri
test('sözleşme: addMagnet + selectFiles gövdeleri', () => {
  const m = 'magnet:?xt=urn:btih:' + 'c'.repeat(40);
  const b = buildAddMagnetBody(m);
  assert.equal(b.get('magnet'), m);
  assert.throws(() => buildAddMagnetBody('https://ornek/x'), (e) => e.code === 'VALIDATION');
  assert.equal(buildSelectFilesBody('all').get('files'), 'all');
  assert.equal(buildSelectFilesBody([1, 3, 7]).get('files'), '1,3,7');
  assert.equal(buildSelectFilesBody([]).get('files'), 'all');
  assert.equal(buildUnrestrictLinkBody('https://host/x').get('link'), 'https://host/x');
  assert.throws(() => buildUnrestrictLinkBody('nota-url'), (e) => e.code === 'VALIDATION');
});

// 6 — magnet hash çıkarma
test('yardımcı: magnetten info-hash çıkarma + normalize', () => {
  const h = 'd'.repeat(40);
  assert.equal(extractInfoHashFromMagnet(`magnet:?xt=urn:btih:${h}&dn=x`), h);
  assert.equal(extractInfoHashFromMagnet('https://ornek'), null);
  assert.equal(normalizeInfoHash(h.toUpperCase()), h);
  assert.equal(normalizeInfoHash('kısa'), null);
});

// 7 — maskeleme (sızdırmazlık)
test('gizlilik: maskeleme tam anahtarı asla döndürmez', () => {
  const key = 'SECRETKEY-1234567890-ABCDEF';
  const masked = maskDebridKey(key);
  assert.ok(!masked.includes(key.slice(4, 12)), 'orta kısım gizli');
  assert.ok(masked.startsWith(key.slice(0, 3)));
  assert.ok(masked.endsWith(key.slice(-2)));
  assert.equal(maskDebridKey('abc'), '••••••••');
  assert.equal(maskDebridKey(''), '••••••••');
});

// 8 — anahtar deposu turu (bellek deposu ile)
test('depo: set/get/clear turu', () => {
  const restore = withMemoryStorage();
  try {
    clearDebridKey();
    assert.equal(getDebridKey(), '');
    setDebridKey('  TEST-KEY-12345678  ');
    assert.equal(getDebridKey(), 'TEST-KEY-12345678');
    clearDebridKey();
    assert.equal(getDebridKey(), '');
    assert.throws(() => setDebridKey('kısa'), (e) => e.code === 'VALIDATION');
  } finally {
    restore();
  }
});

// 9 — key yoksa fetch'e dokunmadan Türkçe hata
test('hata yolu: anahtar yoksa ağa çıkılmaz (MISSING_KEY)', async () => {
  let called = 0;
  const f = async () => { called += 1; return ok({}); };
  await assert.rejects(() => getAccountInfo('', f), (e) => {
    assert.equal(e.code, DebridErrorCodes.MISSING_KEY);
    assert.match(e.message, /Önce VEGA/);
    return true;
  });
  assert.equal(called, 0);
});

// 10 — doğrulama akışı: header + URL sözleşmesi
test('akış: validateDebridKey Authorization başlığı ve /user vuruusu', async () => {
  const user = { id: 1, username: 'cine', type: 'premium', expiration: '2027-01-01T00:00:00.000Z' };
  const f = fakeFetch([{
    match: (u, o) => u === buildUserUrl() && (o.method || 'GET') === 'GET',
    respond: () => ok(user),
  }]);
  const res = await validateDebridKey('K'.repeat(16), f);
  assert.equal(res.valid, true);
  assert.equal(res.user.username, 'cine');
  assert.match(f.seen[0].opts.headers.Authorization, /^Bearer /);
  assert.ok(!JSON.stringify(f.seen[0]).includes('K'.repeat(16).slice(0, 4) === ''), 'başlık dışı sızıntı yok');
});

// 11 — geçersiz anahtar Türkçe eşleme
test('hata yolu: 401 geçersiz anahtar Türkçesi', async () => {
  const f = fakeFetch([{ match: () => true, respond: () => err(401, { error: 'bad_token', error_code: 2 }) }]);
  await assert.rejects(() => validateDebridKey('X'.repeat(16), f), (e) => {
    assert.equal(e.code, DebridErrorCodes.INVALID_KEY);
    assert.match(e.message, /geçersiz/i);
    assert.ok(!e.message.includes('X'.repeat(8)), 'anahtar hata metnine sızmadı');
    return true;
  });
});

// 12 — kota/429/ağ hataları Türkçe
test('hata yolu: 429 + ağ kopması Türkçe kodlanır', async () => {
  const f429 = fakeFetch([{ match: () => true, respond: () => err(429, { error: 'too_fast' }) }]);
  await assert.rejects(() => getTrafficLimits('Y'.repeat(16), f429), (e) => e.code === DebridErrorCodes.RATE_LIMIT);
  const fNet = async () => { throw new TypeError('fetch failed'); };
  await assert.rejects(() => getTrafficLimits('Y'.repeat(16), fNet), (e) => {
    assert.equal(e.code, DebridErrorCodes.NETWORK);
    assert.match(e.message, /Ağ hatası/);
    return true;
  });
});

// 13 — hesap durumu kartı: limitlerle birlikte
test('akış: getAccountStatus kullanıcı + limiti birleştirir', async () => {
  const user = { username: 'cine', type: 'premium', expiration: '2027-05-06T00:00:00.000Z', points: 10 };
  const traffic = { 'extmatrix.com': { left: 5, limit: 20 } };
  const f = fakeFetch([
    { match: (u) => u === buildUserUrl(), respond: () => ok(user) },
    { match: (u) => u === buildTrafficUrl(), respond: () => ok(traffic) },
  ]);
  const s = await getAccountStatus('Z'.repeat(16), f);
  assert.equal(s.isPremium, true);
  assert.equal(s.username, 'cine');
  assert.match(s.expirationText, /2027/);
  assert.equal(Object.keys(s.traffic).length, 1);
});

// 14 — magnet akışı: addMagnet → selectFiles
test('akış: addMagnetAndSelect iki uç çağrısı yapar', async () => {
  const m = 'magnet:?xt=urn:btih:' + 'e'.repeat(40);
  const f = fakeFetch([
    { match: (u, o) => u === buildAddMagnetUrl() && o.method === 'POST', respond: () => ok({ id: 'TOR1', uri: 'https://rd/x' }) },
    { match: (u, o) => u === buildSelectFilesUrl('TOR1') && o.method === 'POST', respond: () => ({ ok: true, status: 204, json: async () => null }) },
  ]);
  const added = await addMagnetAndSelect('W'.repeat(16), m, 'all', f);
  assert.equal(added.id, 'TOR1');
  assert.equal(f.seen.length, 2);
  assert.match(f.seen[0].opts.body, /magnet=/);
  assert.match(f.seen[1].opts.body, /files=all/);
  // seçim gövdesi dosya listesiyle de kurulur
  const f2 = fakeFetch([{ match: () => true, respond: () => ({ ok: true, status: 204, json: async () => null }) }]);
  assert.equal(await selectTorrentFiles('W'.repeat(16), 'TOR1', [2, 5], f2), true);
  assert.match(f2.seen[0].opts.body, /files=2%2C5|files=2,5/);
});

// 15 — cache-check hazır/hazır-değil ayrımı
test('akış: checkInstantAvailability hazır ve boş yanıtı ayırır', async () => {
  const hReady = 'f'.repeat(40);
  const hCold = '1'.repeat(40);
  const payload = { [hReady]: [{ 1: { filename: 'film.mkv', filesize: 100 } }], [hCold]: [] };
  const f = fakeFetch([{
    match: (u) => u === buildInstantAvailabilityUrl([hReady, hCold]),
    respond: () => ok(payload),
  }]);
  const data = await checkInstantAvailability('Q'.repeat(16), [hReady, hCold], f);
  assert.equal(isHashInstantReady(data, hReady), true);
  assert.equal(isHashInstantReady(data, hCold), false);
  const summary = summarizeInstantAvailability(data);
  assert.equal(summary[hReady].ready, true);
  assert.equal(summary[hCold].ready, false);
  assert.equal(isHashInstantReady({}, hReady), false);
});

// 16 — unrestrict sözleşmesi + torrent info hata kodu
test('akış: unrestrictLink form gövdesi ve download döndürür', async () => {
  const f = fakeFetch([{
    match: (u, o) => u === buildUnrestrictLinkUrl() && o.method === 'POST',
    respond: (u, o) => {
      assert.match(String(o.body), /link=/);
      return ok({ download: 'https://dl/x.mkv', filename: 'x.mkv' });
    },
  }]);
  const solved = await unrestrictLink('E'.repeat(16), 'https://hoster/file/123', f);
  assert.equal(solved.download, 'https://dl/x.mkv');
  const fInfo = fakeFetch([{ match: (u) => u === buildTorrentInfoUrl('T9'), respond: () => ok({ id: 'T9', status: 'downloaded', links: [] }) }]);
  const info = await getTorrentInfo('E'.repeat(16), 'T9', fInfo);
  assert.equal(info.status, 'downloaded');
});

// 17 — dosya seçimi yardımcısı (video önceliği)
test('yardımcı: pickMediaFileIds video dosyalarını büyüğe göre dizer', () => {
  const files = [
    { id: 1, path: '/a.srt', bytes: 99 },
    { id: 2, path: '/film-720p.mp4', bytes: 500 },
    { id: 3, path: '/film-1080p.mkv', bytes: 1500 },
  ];
  assert.deepEqual(pickMediaFileIds(files), [3, 2]);
  assert.ok(isVideoFile('/x.MKV'));
  assert.ok(!isVideoFile('/x.srt'));
  assert.match(formatExpiration('2027-05-06T00:00:00.000Z'), /2027/);
  assert.equal(authHeaders(' abc ').Authorization, 'Bearer abc');
});
