/* ==========================================================================
   CinePulse Studio - VEGA çekirdeği (Faz-1: RD REST bağdaştırıcısı)
   Temiz-oda: yalnızca kamuya açık REST sözleşmesi
   (RD API dokümantasyonundaki /rest/1.0 uçları).
   Faz-1 kapsamı: anahtar yönetimi + hesap/limit sorgusu + magnet akışı +
   cache-check. Kaynak havuzuna bağlama Faz-2'de (burada YOK).
   GİZLİLİK: anahtar YALNIZ localStorage'da (`sineflix_debrid_rd_key`) tutulur,
   ASLA sunucuya gönderilmez, ASLA loglanmaz. Tüm istekler doğrudan
   api.real-debrid.com'a Authorization: Bearer başlığıyla gider.
   ========================================================================== */

export const RD_API_BASE = 'https://api.real-debrid.com/rest/1.0';

/** localStorage anahtar adı — sabit, değiştirme. */
export const RD_KEY_STORAGE = 'sineflix_debrid_rd_key';

export const DebridErrorCodes = Object.freeze({
  MISSING_KEY: 'MISSING_KEY',
  INVALID_KEY: 'INVALID_KEY',
  EXPIRED: 'EXPIRED',
  QUOTA: 'QUOTA',
  NETWORK: 'NETWORK',
  RATE_LIMIT: 'RATE_LIMIT',
  VALIDATION: 'VALIDATION',
  API: 'API',
});

export class DebridError extends Error {
  constructor(message, code = DebridErrorCodes.API) {
    super(message);
    this.name = 'DebridError';
    this.code = code;
  }
}

const TR_MSG = Object.freeze({
  [DebridErrorCodes.MISSING_KEY]: 'Önce VEGA anahtarınızı kaydedin.',
  [DebridErrorCodes.INVALID_KEY]: 'Anahtar geçersiz veya süresi dolmuş. VEGA anahtarınızı kontrol edin.',
  [DebridErrorCodes.EXPIRED]: 'Üyelik süresi dolmuş. Hesabınızdaki premium süreyi kontrol edin.',
  [DebridErrorCodes.QUOTA]: 'Kota doldu veya günlük limit aşıldı. Daha sonra tekrar deneyin.',
  [DebridErrorCodes.NETWORK]: 'Ağ hatası: bağlantı kurulamadı. İnternetinizi kontrol edip tekrar deneyin.',
  [DebridErrorCodes.RATE_LIMIT]: 'Çok fazla istek gönderildi. Biraz bekleyip tekrar deneyin.',
  [DebridErrorCodes.API]: 'İstek başarısız oldu. Daha sonra tekrar deneyin.',
});

export function turkishMessageFor(code, fallback = '') {
  if (fallback) return fallback;
  return TR_MSG[code] || TR_MSG[DebridErrorCodes.API];
}

/* ---------------- Anahtar deposu (yalnız localStorage) ---------------- */

function getStore() {
  try {
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) return globalThis.localStorage;
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  } catch (_) { /* yoksay */ }
  return null;
}

export function getDebridKey() {
  try {
    const v = getStore()?.getItem(RD_KEY_STORAGE);
    const s = String(v ?? '').trim();
    return s || '';
  } catch (_) {
    return '';
  }
}

export function setDebridKey(key) {
  const clean = String(key ?? '').trim();
  if (!clean) {
    throw new DebridError('Anahtar boş olamaz.', DebridErrorCodes.VALIDATION);
  }
  if (clean.length < 8) {
    throw new DebridError('Anahtar çok kısa görünüyor. Kopyalarken eksik kalmış olabilir.', DebridErrorCodes.VALIDATION);
  }
  try {
    getStore()?.setItem(RD_KEY_STORAGE, clean);
  } catch (_) {
    throw new DebridError('Anahtar saklanamadı (tarayıcı deposu kapalı).', DebridErrorCodes.API);
  }
  return true;
}

export function clearDebridKey() {
  try {
    getStore()?.removeItem(RD_KEY_STORAGE);
  } catch (_) { /* sessiz */ }
  return true;
}

export function hasDebridKey() {
  return getDebridKey().length > 0;
}

/** Anahtarı maskele: ilk 3 + •••• + son 2. Kısa/boşsa tamamı maskeli. Asla tamamını döndürme. */
export function maskDebridKey(key = '') {
  const s = String(key ?? '').trim();
  if (s.length <= 6) return '••••••••';
  return `${s.slice(0, 3)}••••••${s.slice(-2)}`;
}

/* ---------------- Sözleşme üreticileri (URL + gövde) ---------------- */

export function buildUserUrl() {
  return `${RD_API_BASE}/user`;
}

export function buildTrafficUrl() {
  return `${RD_API_BASE}/traffic`;
}

export function buildTrafficDetailsUrl(start = '', end = '') {
  const q = new URLSearchParams();
  if (start) q.set('start', String(start));
  if (end) q.set('end', String(end));
  const suffix = q.toString() ? `?${q.toString()}` : '';
  return `${RD_API_BASE}/traffic/details${suffix}`;
}

export function buildAddMagnetUrl() {
  return `${RD_API_BASE}/torrents/addMagnet`;
}

export function buildTorrentInfoUrl(id) {
  const clean = String(id ?? '').trim();
  if (!clean) throw new DebridError('Torrent kimliği gerekli.', DebridErrorCodes.VALIDATION);
  return `${RD_API_BASE}/torrents/info/${encodeURIComponent(clean)}`;
}

export function buildSelectFilesUrl(id) {
  const clean = String(id ?? '').trim();
  if (!clean) throw new DebridError('Torrent kimliği gerekli.', DebridErrorCodes.VALIDATION);
  return `${RD_API_BASE}/torrents/selectFiles/${encodeURIComponent(clean)}`;
}

export function buildDeleteTorrentUrl(id) {
  const clean = String(id ?? '').trim();
  if (!clean) throw new DebridError('Torrent kimliği gerekli.', DebridErrorCodes.VALIDATION);
  return `${RD_API_BASE}/torrents/delete/${encodeURIComponent(clean)}`;
}

export function buildUnrestrictLinkUrl() {
  return `${RD_API_BASE}/unrestrict/link`;
}

export function buildUnrestrictCheckUrl() {
  return `${RD_API_BASE}/unrestrict/check`;
}

/** Örn: /torrents/instantAvailability/<hash>[/<hash2>...] — hash'ler küçük harf 40-hex. */
export function buildInstantAvailabilityUrl(hashes = []) {
  const list = (Array.isArray(hashes) ? hashes : [hashes])
    .map((h) => String(h ?? '').trim().toLowerCase())
    .filter(Boolean);
  if (!list.length) {
    throw new DebridError('En az bir torrent özeti (hash) gerekli.', DebridErrorCodes.VALIDATION);
  }
  for (const h of list) {
    if (!/^[a-f0-9]{40}$/.test(h)) {
      throw new DebridError('Hash biçimi hatalı (40 karakter hex olmalı).', DebridErrorCodes.VALIDATION);
    }
  }
  return `${RD_API_BASE}/torrents/instantAvailability/${list.map(encodeURIComponent).join('/')}`;
}

export function buildAddMagnetBody(magnet) {
  const m = String(magnet ?? '').trim();
  if (!m) throw new DebridError('Magnet bağlantısı gerekli.', DebridErrorCodes.VALIDATION);
  if (!/^magnet:\?xt=urn:btih:/i.test(m)) {
    throw new DebridError('Magnet bağlantısı geçersiz (magnet:?xt=urn:btih: ile başlamalı).', DebridErrorCodes.VALIDATION);
  }
  const body = new URLSearchParams();
  body.set('magnet', m);
  return body;
}

/** fileIds: 'all' | number[] — boş dizi 'all' sayılır (RD varsayılanı). */
export function buildSelectFilesBody(fileIds = 'all') {
  const body = new URLSearchParams();
  if (fileIds === 'all' || fileIds === undefined || fileIds === null) {
    body.set('files', 'all');
    return body;
  }
  const arr = Array.isArray(fileIds) ? fileIds : [fileIds];
  const nums = arr.map((n) => Number(n)).filter((n) => Number.isInteger(n) && n > 0);
  if (!nums.length) {
    body.set('files', 'all');
    return body;
  }
  body.set('files', nums.join(','));
  return body;
}

export function buildUnrestrictLinkBody(link, password = '') {
  const l = String(link ?? '').trim();
  if (!l || !/^https?:\/\//i.test(l)) {
    throw new DebridError('Çözülecek bağlantı geçersiz (http/https olmalı).', DebridErrorCodes.VALIDATION);
  }
  const body = new URLSearchParams();
  body.set('link', l);
  if (password) body.set('password', String(password));
  return body;
}

export function authHeaders(key) {
  const clean = String(key ?? '').trim();
  if (!clean) throw new DebridError(TR_MSG[DebridErrorCodes.MISSING_KEY], DebridErrorCodes.MISSING_KEY);
  return { Authorization: `Bearer ${clean}` };
}

/* ---------------- Yardımcılar ---------------- */

/** Magnet içinden btih hash'ini çıkarır (küçük harf) ya da null. */
export function extractInfoHashFromMagnet(magnet = '') {
  const m = String(magnet ?? '');
  const hex = m.match(/btih:([a-f0-9]{40})/i);
  if (hex) return hex[1].toLowerCase();
  const b32 = m.match(/btih:([a-z2-7]{32})/i);
  if (b32) return b32[1].toLowerCase();
  return null;
}

export function normalizeInfoHash(h = '') {
  const s = String(h ?? '').trim().toLowerCase();
  return /^[a-f0-9]{40}$/.test(s) ? s : null;
}

const VIDEO_EXT = /\.(mkv|mp4|avi|mov|m4v|webm|ts|m2ts)$/i;

export function isVideoFile(path = '') {
  return VIDEO_EXT.test(String(path ?? ''));
}

/** Torrent dosyalarından oynatılabilir adayların id listesi (büyükten küçüğe). */
export function pickMediaFileIds(files = [], { videoOnly = true } = {}) {
  if (!Array.isArray(files)) return [];
  return files
    .filter((f) => f && (videoOnly ? isVideoFile(f.path || '') : true))
    .sort((a, b) => (Number(b?.bytes) || 0) - (Number(a?.bytes) || 0))
    .map((f) => Number(f.id))
    .filter((n) => Number.isInteger(n) && n > 0);
}

/**
 * instantAvailability ham yanıtını özetler:
 * { "<hash>": [ { "1": {...}, ... }, ... ] } — boş dizi / eksik anahtar = hazır değil.
 */
export function summarizeInstantAvailability(payload = {}) {
  const out = {};
  if (!payload || typeof payload !== 'object') return out;
  for (const [hash, variants] of Object.entries(payload)) {
    const list = Array.isArray(variants) ? variants : [];
    let fileCount = 0;
    for (const v of list) {
      if (v && typeof v === 'object') fileCount += Object.keys(v).length;
    }
    out[String(hash).toLowerCase()] = { ready: fileCount > 0, fileCount, variants: list.length };
  }
  return out;
}

export function isHashInstantReady(payload = {}, hash = '') {
  const h = String(hash ?? '').trim().toLowerCase();
  if (!h || !payload || typeof payload !== 'object') return false;
  const variants = payload[h];
  if (!Array.isArray(variants) || !variants.length) return false;
  return variants.some((v) => v && typeof v === 'object' && Object.keys(v).length > 0);
}

export function formatExpiration(iso = '') {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  try {
    return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch (_) {
    return d.toISOString().slice(0, 10);
  }
}

export function formatBytes(n = 0) {
  const v = Number(n) || 0;
  if (v <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let x = v;
  while (x >= 1024 && i < units.length - 1) { x /= 1024; i += 1; }
  return `${x >= 100 ? Math.round(x) : Math.round(x * 10) / 10} ${units[i]}`;
}

/* ---------------- Hata eşleme (Türkçe, anahtar sızdırmaz) ---------------- */

function mapPayloadToCode(payload) {
  const err = String(payload?.error ?? '').toLowerCase();
  const code = Number(payload?.error_code);
  if (/bad_token|invalid_token|permission_denied|unauthorized|must_be_logged|account_locked|account_not_activated/.test(err)) {
    return DebridErrorCodes.INVALID_KEY;
  }
  if (/expired|premium.*(end|expir)|subscription/.test(err)) return DebridErrorCodes.EXPIRED;
  if (/quota|traffic.*exceed|limit.*reach|daily.*limit|too_many|service_unavailable|hoster.*temporarily/.test(err)) {
    return DebridErrorCodes.QUOTA;
  }
  if (code === 2 || code === 4 || code === 6 || code === 7) return DebridErrorCodes.INVALID_KEY;
  if (code === 37) return DebridErrorCodes.QUOTA;
  return DebridErrorCodes.API;
}

function errorFromStatus(status, payload) {
  const s = Number(status) || 0;
  if (s === 401 || s === 403) return new DebridError(TR_MSG[DebridErrorCodes.INVALID_KEY], DebridErrorCodes.INVALID_KEY);
  if (s === 429) return new DebridError(TR_MSG[DebridErrorCodes.RATE_LIMIT], DebridErrorCodes.RATE_LIMIT);
  if (s === 503) return new DebridError(TR_MSG[DebridErrorCodes.QUOTA], DebridErrorCodes.QUOTA);
  if (payload && (payload.error || payload.error_code !== undefined)) {
    const code = mapPayloadToCode(payload);
    return new DebridError(turkishMessageFor(code), code);
  }
  if (s >= 400) return new DebridError(turkishMessageFor(DebridErrorCodes.API), DebridErrorCodes.API);
  return new DebridError(turkishMessageFor(DebridErrorCodes.API), DebridErrorCodes.API);
}

function resolveFetch(fetchImpl) {
  if (typeof fetchImpl === 'function') return fetchImpl;
  const g = globalThis?.fetch;
  if (typeof g === 'function') return g.bind(globalThis);
  throw new DebridError(TR_MSG[DebridErrorCodes.NETWORK], DebridErrorCodes.NETWORK);
}

function requireKey(key) {
  const clean = String(key ?? '').trim();
  if (!clean) throw new DebridError(TR_MSG[DebridErrorCodes.MISSING_KEY], DebridErrorCodes.MISSING_KEY);
  return clean;
}

/**
 * Tek noktadan RD çağrısı. Anahtar hata nesnelerine/hata metinlerine yazılmaz.
 * @returns {Promise<any>} JSON gövde (204'te null)
 */
export async function rdRequest({ key, method = 'GET', url, bodyParams = null, fetchImpl } = {}) {
  const cleanKey = requireKey(key);
  if (!url) throw new DebridError('İstek adresi gerekli.', DebridErrorCodes.VALIDATION);
  const doFetch = resolveFetch(fetchImpl);
  const headers = { ...authHeaders(cleanKey) };
  let body = null;
  if (bodyParams instanceof URLSearchParams) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    body = bodyParams.toString();
  } else if (bodyParams != null) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(bodyParams);
  }
  let res;
  try {
    res = await doFetch(String(url), { method: String(method || 'GET').toUpperCase(), headers, body });
  } catch (_) {
    throw new DebridError(TR_MSG[DebridErrorCodes.NETWORK], DebridErrorCodes.NETWORK);
  }
  if (!res) throw new DebridError(TR_MSG[DebridErrorCodes.NETWORK], DebridErrorCodes.NETWORK);
  if (res.status === 204) return null;
  let data = null;
  try {
    data = await res.json();
  } catch (_) {
    if (!res.ok) throw errorFromStatus(res.status, null);
    return null;
  }
  if (!res.ok) throw errorFromStatus(res.status, data);
  if (data && typeof data === 'object' && (data.error || data.error_code !== undefined) && !Array.isArray(data)) {
    // Bazı uçlar 200 + error gövdesi dönebilir.
    throw errorFromStatus(res.status || 400, data);
  }
  return data;
}

/* ---------------- Hesap / limit ---------------- */

export async function getAccountInfo(key, fetchImpl) {
  return rdRequest({ key: requireKey(key), method: 'GET', url: buildUserUrl(), fetchImpl });
}

export async function getTrafficLimits(key, fetchImpl) {
  return rdRequest({ key: requireKey(key), method: 'GET', url: buildTrafficUrl(), fetchImpl });
}

/** Anahtar doğrulama: /user 200 + username/type varsa geçerli. */
export async function validateDebridKey(key, fetchImpl) {
  const clean = requireKey(key);
  const user = await getAccountInfo(clean, fetchImpl);
  const valid = Boolean(user && (user.username || user.email || user.id !== undefined));
  return { valid, user };
}

/** Hesap durumu kartı verisi: kullanıcı + limitler birlikte. */
export async function getAccountStatus(key, fetchImpl) {
  const clean = requireKey(key);
  const [user, traffic] = await Promise.all([
    getAccountInfo(clean, fetchImpl),
    getTrafficLimits(clean, fetchImpl).catch(() => ({})),
  ]);
  const type = String(user?.type || '').toLowerCase();
  return {
    user,
    traffic: traffic || {},
    username: user?.username || user?.email || '—',
    isPremium: type === 'premium',
    accountType: user?.type || '—',
    expiration: user?.expiration || '',
    expirationText: formatExpiration(user?.expiration),
    points: Number(user?.points) || 0,
  };
}

/* ---------------- Torrent akışı ---------------- */

export async function addMagnet(key, magnet, fetchImpl) {
  const clean = requireKey(key);
  const data = await rdRequest({
    key: clean, method: 'POST', url: buildAddMagnetUrl(), bodyParams: buildAddMagnetBody(magnet), fetchImpl,
  });
  if (!data?.id) throw new DebridError('Magnet eklenemedi (kimlik dönmedi).', DebridErrorCodes.API);
  return data;
}

export async function getTorrentInfo(key, id, fetchImpl) {
  return rdRequest({ key: requireKey(key), method: 'GET', url: buildTorrentInfoUrl(id), fetchImpl });
}

export async function selectTorrentFiles(key, id, fileIds = 'all', fetchImpl) {
  await rdRequest({
    key: requireKey(key), method: 'POST', url: buildSelectFilesUrl(id), bodyParams: buildSelectFilesBody(fileIds), fetchImpl,
  });
  return true;
}

export async function deleteTorrent(key, id, fetchImpl) {
  await rdRequest({ key: requireKey(key), method: 'DELETE', url: buildDeleteTorrentUrl(id), fetchImpl });
  return true;
}

/** Magnet ekle + dosya seç (Faz-1 akış çekirdeği; indirme kuyruğu burada başlar). */
export async function addMagnetAndSelect(key, magnet, fileIds = 'all', fetchImpl) {
  const added = await addMagnet(key, magnet, fetchImpl);
  await selectTorrentFiles(key, added.id, fileIds, fetchImpl);
  return added;
}

/* ---------------- Link çözme (unrestrict) ---------------- */

export async function unrestrictLink(key, link, fetchImpl, password = '') {
  const clean = requireKey(key);
  const data = await rdRequest({
    key: clean, method: 'POST', url: buildUnrestrictLinkUrl(), bodyParams: buildUnrestrictLinkBody(link, password), fetchImpl,
  });
  if (!data?.download && !data?.link) {
    throw new DebridError('Bağlantı çözülemedi.', DebridErrorCodes.API);
  }
  return data;
}

export async function checkLink(key, link, fetchImpl) {
  const clean = requireKey(key);
  return rdRequest({
    key: clean, method: 'POST', url: buildUnrestrictCheckUrl(), bodyParams: buildUnrestrictLinkBody(link), fetchImpl,
  });
}

/* ---------------- Cache-check ---------------- */

/** Hash listesi anında hazır mı? Ham RD yanıtını döndürür (ağsız test için saf özetleyiciler yukarıda). */
export async function checkInstantAvailability(key, hashes, fetchImpl) {
  const clean = requireKey(key);
  const url = buildInstantAvailabilityUrl(hashes);
  return rdRequest({ key: clean, method: 'GET', url, fetchImpl });
}

/**
 * Torrent bilgi kaydındaki RD `links` dizisini tek tek çözer.
 * Faz-2'de kaynak havuzuna bağlanacak; Faz-1 yalnızca akış fonksiyonu sunar.
 */
export async function resolveTorrentDownloadLinks(key, torrentId, { fileIds = 'all', fetchImpl } = {}) {
  const clean = requireKey(key);
  if (fileIds !== 'already-selected') {
    await selectTorrentFiles(clean, torrentId, fileIds, fetchImpl);
  }
  const info = await getTorrentInfo(clean, torrentId, fetchImpl);
  const links = Array.isArray(info?.links) ? info.links.filter(Boolean) : [];
  const out = [];
  for (const link of links) {
    const solved = await unrestrictLink(clean, link, fetchImpl);
    out.push({ sourceLink: link, ...solved });
  }
  return out;
}

export default {
  RD_API_BASE,
  RD_KEY_STORAGE,
  getDebridKey,
  setDebridKey,
  clearDebridKey,
  hasDebridKey,
  maskDebridKey,
};
