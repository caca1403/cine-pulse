/* ==========================================================================
   CinePulse Studio - TVmaze Yayın Takvimi Servisi
   - Anahtarsız ve ücretsiz bölüm takvimi kaynağı (API key gerektirmez)
   - IMDb ID ile dizi eşleştirme + "sonraki bölüm" bilgisi
   - TVmaze rate limit: en az 20 çağrı / 10 sn (IP başına) → agresif cache
   - Lisans: CC BY-SA — arayüzde kaynak olarak TVmaze'e link verilmelidir
   ========================================================================== */

const TVMAZE_BASE_URL = 'https://api.tvmaze.com';
const REQUEST_TIMEOUT_MS = 5500;
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 dakika
const STORAGE_KEY = 'cinepulse_tvmaze_cache_v1';

// In-memory + sessionStorage destekli küçük cache: { key: { savedAt, data } }
const memoryCache = new Map();

function readStorageCache() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      Object.entries(parsed).forEach(([key, entry]) => {
        if (entry?.savedAt && Date.now() - entry.savedAt < CACHE_TTL_MS) {
          memoryCache.set(key, entry);
        }
      });
    }
  } catch (_) {}
}

function persistStorageCache() {
  try {
    const out = {};
    let count = 0;
    for (const [key, entry] of memoryCache.entries()) {
      if (count++ >= 80) break;
      out[key] = entry;
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(out));
  } catch (_) {}
}

function getCached(key) {
  const entry = memoryCache.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.savedAt > CACHE_TTL_MS) {
    memoryCache.delete(key);
    return undefined;
  }
  return entry.data;
}

function setCached(key, data) {
  memoryCache.set(key, { savedAt: Date.now(), data });
  persistStorageCache();
}

export function clearTvmazeCache() {
  memoryCache.clear();
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (_) {}
}

async function tvmazeFetch(path) {
  try {
    const res = await fetch(`${TVMAZE_BASE_URL}${path}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (_) {
    // Ağ hatası / timeout / 429 → sessizce vazgeç (takvim bilgisi opsiyoneldir)
    return null;
  }
}

function normalizeTitle(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9çğıöşü ]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function titlesLikelyMatch(a, b) {
  const left = normalizeTitle(a);
  const right = normalizeTitle(b);
  if (!left || !right) return false;
  if (left === right) return true;
  return left.includes(right) || right.includes(left);
}

function normalizeEpisode(episode) {
  if (!episode) return null;
  return {
    season: episode.season ?? null,
    number: episode.number ?? null,
    name: episode.name || '',
    airdate: episode.airdate || '',
    airstamp: episode.airstamp || '',
    runtime: episode.runtime || null
  };
}

function mapStatus(status) {
  switch (status) {
    case 'Running': return 'Devam ediyor';
    case 'Ended': return 'Sonlandı';
    case 'To Be Determined': return 'Belirsiz';
    case 'In Development': return 'Yapım aşamasında';
    default: return status || '';
  }
}

/** IMDb/TVDB gibi TVmaze lookup sorgusu ile dizi kaydını bulur. */
async function fetchShowByLookup(query) {
  const cacheKey = `lookup:${query}`;
  const cached = getCached(cacheKey);
  if (cached !== undefined) return cached;

  const show = await tvmazeFetch(`/lookup/shows?${query}`);
  setCached(cacheKey, show || null);
  return show || null;
}

/** TVmaze dizi detayı + sonraki/önceki bölüm bilgisi. */
export async function getShowWithEpisodes(tvmazeId) {
  if (!tvmazeId) return null;
  const cacheKey = `show:${tvmazeId}`;
  const cached = getCached(cacheKey);
  if (cached !== undefined) return cached;

  const data = await tvmazeFetch(`/shows/${tvmazeId}?embed[]=nextepisode&embed[]=previousepisode`);
  const normalized = data
    ? {
      tvmazeId: data.id,
      name: data.name || '',
      status: data.status || '',
      statusLabel: mapStatus(data.status),
      premiered: data.premiered || '',
      officialSite: data.officialSite || '',
      thetvdbId: data.externals?.thetvdb ?? null,
      imdbId: data.externals?.imdb || '',
      nextEpisode: normalizeEpisode(data._embedded?.nextepisode),
      previousEpisode: normalizeEpisode(data._embedded?.previousepisode)
    }
    : null;

  setCached(cacheKey, normalized);
  return normalized;
}

/** IMDb ID ile dizi kaydı (tt1234567 veya çıplak rakam kabul edilir). */
export async function getShowByImdbId(imdbId) {
  const clean = String(imdbId || '').trim();
  if (!clean) return null;
  const withPrefix = clean.startsWith('tt') ? clean : `tt${clean}`;

  const lookup = await fetchShowByLookup(`imdb=${encodeURIComponent(withPrefix)}`);
  const id = lookup?.id || null;
  if (!id) return null;
  return getShowWithEpisodes(id);
}

/** TVmaze dizi kaydındaki prömiyer yılı ile istenen yıl arasındaki fark. */
function yearDistance(show, year) {
  const showYear = parseInt(String(show?.premiered || '').substring(0, 4), 10);
  const wantedYear = parseInt(String(year || ''), 10);
  if (!wantedYear || !showYear) return 0;
  return Math.abs(showYear - wantedYear);
}

/** Başlık + yıl uyumlu en iyi aday (tercihen hâlâ devam eden dizi). */
function pickBestCandidate(candidates, title, year) {
  let best = null;
  let bestScore = Infinity;
  for (const show of candidates) {
    if (!show || !titlesLikelyMatch(show.name, title)) continue;
    const dist = yearDistance(show, year);
    if (dist > 1) continue;
    const score = dist * 10 + (show.status === 'Running' ? 0 : 1);
    if (score < bestScore) {
      bestScore = score;
      best = show;
    }
  }
  return best;
}

/**
 * Başlık ile arama (IMDb ID yoksa yedek yol).
 * Önce singlesearch, tutmazsa aday havuzundan yıl/başlık uyumlu en iyi sonuç seçilir.
 */
export async function getShowByTitle(title, year) {
  const clean = String(title || '').trim();
  if (clean.length < 2) return null;

  const cacheKey = `search:${clean}:${year || ''}`;
  const cached = getCached(cacheKey);
  if (cached !== undefined) return cached;

  let match = null;

  const single = await tvmazeFetch(`/singlesearch/shows?q=${encodeURIComponent(clean)}`);
  if (single && titlesLikelyMatch(single.name, clean) && yearDistance(single, year) <= 1) {
    match = single;
  }

  if (!match) {
    const results = await tvmazeFetch(`/search/shows?q=${encodeURIComponent(clean)}`);
    const candidates = Array.isArray(results) ? results.map(r => r?.show).filter(Boolean) : [];
    match = pickBestCandidate(candidates, clean, year);
  }

  const normalized = match ? await getShowWithEpisodes(match.id) : null;
  setCached(cacheKey, normalized);
  return normalized;
}

/**
 * Detay sayfası için özet yayın bilgisi.
 * IMDb ID öncelikli, yoksa başlık + yıl ile eşleştirir.
 */
export async function getNextEpisodeInfo({ imdbId, title, year } = {}) {
  let show = await getShowByImdbId(imdbId);
  if (!show) show = await getShowByTitle(title, year);
  if (!show) return null;

  const next = show.nextEpisode;
  return {
    showName: show.name,
    statusLabel: show.statusLabel,
    officialSite: show.officialSite,
    nextEpisode: next,
    previousEpisode: show.previousEpisode,
    nextLabel: next ? buildEpisodeLabel(next) : '',
    nextAirdateLabel: next ? formatAirDateLabel(next.airdate, next.airstamp) : ''
  };
}

/**
 * Kısa bölüm etiketi.
 * - Normal diziler: "S3 B5"
 * - Yıl bazlı numaralandırma (örn. uzun soluklu animeler: season=2026): "Episode 1180"
 */
export function buildEpisodeLabel(episode) {
  if (!episode) return '';
  const hasSeason = episode.season !== null && episode.season !== undefined;
  const hasNumber = episode.number !== null && episode.number !== undefined;
  const seasonLooksLikeYear = hasSeason && episode.season >= 1900;

  if (hasSeason && !seasonLooksLikeYear && hasNumber) return `S${episode.season} B${episode.number}`;
  if (seasonLooksLikeYear && episode.name) return episode.name;
  if (hasNumber) return `B${episode.number}`;
  return episode.name || '';
}

const MONTHS_SHORT_TR = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

/** "Bugün 21:00" / "Yarın" / "3 gün sonra" / "12 Eki" biçiminde Türkçe etiket. */
export function formatAirDateLabel(airdate, airstamp) {
  const stamp = airstamp ? new Date(airstamp) : (airdate ? new Date(`${airdate}T21:00:00`) : null);
  if (!stamp || Number.isNaN(stamp.getTime())) return airdate || '';

  const now = new Date();
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dayDiff = Math.round((startOfDay(stamp) - startOfDay(now)) / 86400000);

  const timeStr = airstamp
    ? `${String(stamp.getHours()).padStart(2, '0')}:${String(stamp.getMinutes()).padStart(2, '0')}`
    : '';

  if (dayDiff < 0) return 'Yayınlandı';
  if (dayDiff === 0) return timeStr ? `Bugün ${timeStr}` : 'Bugün';
  if (dayDiff === 1) return timeStr ? `Yarın ${timeStr}` : 'Yarın';
  if (dayDiff <= 7) return `${dayDiff} gün sonra`;
  return `${stamp.getDate()} ${MONTHS_SHORT_TR[stamp.getMonth()]}`;
}

/**
 * Belirli bir gün için Türkiye'de yayınlanan bölümler.
 * Not: /schedule/web yalnızca web kanallarını verir ve TR için boş döner →
 * bu yüzden genel /schedule?country=TR ucu kullanılır (Türk dizilerini içerir).
 * (İleride "Bu akşam yayında" rayı için kullanılabilir.)
 */
export async function getTrSchedule(dateISO) {
  const day = dateISO || new Date().toISOString().substring(0, 10);
  const cacheKey = `schedule:tr:${day}`;
  const cached = getCached(cacheKey);
  if (cached !== undefined) return cached;

  let list = await tvmazeFetch(`/schedule?date=${encodeURIComponent(day)}&country=TR`);
  if (!Array.isArray(list) || list.length === 0) {
    // Yedek: web yayınları (ülke filtresi olmadan, yalnızca Türkçe yapımlar)
    const webList = await tvmazeFetch(`/schedule/web?date=${encodeURIComponent(day)}`);
    list = Array.isArray(webList)
      ? webList.filter(item => (item?.show?.language || item?._embedded?.show?.language) === 'Turkish')
      : [];
  }

  const normalized = Array.isArray(list)
    ? list.map(item => {
      // /schedule ucu show nesnesini kökte, /schedule/web ise _embedded içinde verir
      const show = item?.show || item?._embedded?.show || {};
      return {
        showName: show.name || '',
        tvmazeShowId: show.id || null,
        language: show.language || '',
        season: item?.season ?? null,
        number: item?.number ?? null,
        name: item?.name || '',
        airdate: item?.airdate || '',
        airstamp: item?.airstamp || '',
        runtime: item?.runtime || null,
        channel: show.network?.name || show.webChannel?.name || ''
      };
    }).filter(item => item.showName)
    : [];

  setCached(cacheKey, normalized);
  return normalized;
}

// Oturum başına bir kez sessionStorage cache'ini yükle
readStorageCache();
