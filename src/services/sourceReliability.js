const HEALTH_KEY = 'cinepulse_source_health_v1';
const LAST_SOURCE_KEY = 'cinepulse_last_source_v1';
const MAX_HEALTH_ENTRIES = 180;
const MAX_LAST_ENTRIES = 80;

function safeRead(key, fallback = {}) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '');
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch (_) {
    return fallback;
  }
}

function safeWrite(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
}

function trimEntries(value, max) {
  return Object.fromEntries(Object.entries(value)
    .sort(([, a], [, b]) => Number(b?.updatedAt || 0) - Number(a?.updatedAt || 0))
    .slice(0, max));
}

function normalize(value) {
  return String(value || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/https?:\/\/[^/]+/g, '')
    .replace(/\b\d{2,}\b/g, '')
    .replace(/[^a-z0-9çğıöşü]+/gi, ' ')
    .trim();
}

export function getBrowserProfile() {
  const ua = navigator.userAgent || '';
  const mobile = /android|iphone|ipad|ipod/i.test(ua) ? 'mobile' : 'desktop';
  const engine = /firefox/i.test(ua) ? 'firefox'
    : /safari/i.test(ua) && !/chrome|chromium|android/i.test(ua) ? 'safari'
      : /edg/i.test(ua) ? 'edge' : 'chromium';
  return `${engine}-${mobile}`;
}

export function sourceIdentity(source, category = '') {
  const provider = normalize(source?.source || source?.provider || '');
  const id = normalize(String(source?.id || '').replace(/_[a-z0-9]{5,}$/i, ''));
  const name = normalize(source?.displayName || source?.name || '');
  // Source URLs can expire. Provider + player label survives a refreshed scan.
  return `${normalize(category || source?.category)}|${provider || id}|${name || id}`;
}

export function sourceMatchesDescriptor(source, descriptor) {
  if (!source || !descriptor) return false;
  const candidate = sourceIdentity(source, descriptor.category);
  const target = sourceIdentity(descriptor, descriptor.category);
  if (candidate === target) return true;
  const candidateProvider = normalize(source.source || source.provider || '');
  const targetProvider = normalize(descriptor.provider || '');
  const candidateName = normalize(source.displayName || source.name || '');
  const targetName = normalize(descriptor.name || '');
  return Boolean(candidateProvider && targetProvider && candidateProvider === targetProvider
    && (!candidateName || !targetName || candidateName === targetName || candidateName.includes(targetName) || targetName.includes(candidateName)));
}

function healthKey(source, category) {
  return `${getBrowserProfile()}|${sourceIdentity(source, category)}`;
}

export function rankSourcesForDevice(sources, { contentKey = '', category = '' } = {}) {
  if (!Array.isArray(sources) || sources.length < 2) return Array.isArray(sources) ? sources.slice() : [];
  const health = safeRead(HEALTH_KEY);
  const last = safeRead(LAST_SOURCE_KEY)[contentKey];
  return sources.map((source, index) => {
    const record = health[healthKey(source, category)] || {};
    const lastBonus = last && sourceMatchesDescriptor(source, last) ? 1000 : 0;
    const success = Math.min(12, Number(record.successes) || 0) * 3;
    const failure = Math.min(12, Number(record.failures) || 0) * 7;
    const stalePenalty = record.lastFailureAt && Date.now() - record.lastFailureAt < 1000 * 60 * 60 * 6 ? 20 : 0;
    return { source, index, score: lastBonus + success - failure - stalePenalty };
  }).sort((a, b) => b.score - a.score || a.index - b.index).map(item => item.source);
}

export function rememberWorkingSource({ contentKey, category = '', source }) {
  if (!source) return;
  const health = safeRead(HEALTH_KEY);
  const key = healthKey(source, category);
  const old = health[key] || {};
  health[key] = {
    successes: Math.min(20, (Number(old.successes) || 0) + 1),
    failures: Math.max(0, (Number(old.failures) || 0) - 1),
    lastSuccessAt: Date.now(),
    updatedAt: Date.now()
  };
  safeWrite(HEALTH_KEY, trimEntries(health, MAX_HEALTH_ENTRIES));
  if (contentKey) {
    const last = safeRead(LAST_SOURCE_KEY);
    last[contentKey] = {
      category,
      provider: String(source.source || source.provider || ''),
      id: String(source.id || ''),
      name: String(source.displayName || source.name || ''),
      updatedAt: Date.now()
    };
    safeWrite(LAST_SOURCE_KEY, trimEntries(last, MAX_LAST_ENTRIES));
  }
}

export function rememberFailedSource({ category = '', source }) {
  if (!source) return;
  const health = safeRead(HEALTH_KEY);
  const key = healthKey(source, category);
  const old = health[key] || {};
  health[key] = {
    successes: Number(old.successes) || 0,
    failures: Math.min(20, (Number(old.failures) || 0) + 1),
    lastFailureAt: Date.now(),
    updatedAt: Date.now()
  };
  safeWrite(HEALTH_KEY, trimEntries(health, MAX_HEALTH_ENTRIES));
}
