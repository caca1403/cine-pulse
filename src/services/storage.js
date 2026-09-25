/* ==========================================================================
   SineFlix Pro - Local Storage & Data Management Service (No-Backend)
   Handles watch history, timestamps, favorites, watchlist, item removal,
   watch analytics, remaining time, and JSON Export/Import
   ========================================================================== */

const STORAGE_KEYS = {
  WATCH_HISTORY: 'sineflix_watch_history_v1',
  FAVORITES: 'sineflix_favorites_v1',
  WATCHLIST: 'sineflix_watchlist_v1',
  USER_SETTINGS: 'sineflix_user_settings_v1',
  ANIME_IDS: 'sineflix_anime_ids_v1'
};

let _animeIdsSet = null;

export function getRegisteredAnimeIds() {
  if (_animeIdsSet) return _animeIdsSet;
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      _animeIdsSet = new Set();
      return _animeIdsSet;
    }
    const raw = localStorage.getItem(STORAGE_KEYS.ANIME_IDS);
    if (!raw) {
      _animeIdsSet = new Set();
      return _animeIdsSet;
    }
    const arr = JSON.parse(raw);
    _animeIdsSet = new Set(Array.isArray(arr) ? arr.map(String) : []);
    return _animeIdsSet;
  } catch (_) {
    _animeIdsSet = new Set();
    return _animeIdsSet;
  }
}

export function registerAnimeId(id) {
  if (!id) return;
  try {
    const set = getRegisteredAnimeIds();
    const strId = String(id);
    if (!set.has(strId)) {
      set.add(strId);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEYS.ANIME_IDS, JSON.stringify(Array.from(set)));
      }
    }
  } catch (_) {}
}

export function isRegisteredAnimeId(id) {
  if (!id) return false;
  return getRegisteredAnimeIds().has(String(id));
}


let _watchHistoryCache = null;
let _progressMapCache = null;
let _seriesLatestMapCache = null;
let _cachedGroupedHistory = null;
let _cachedContinueWatching = null;
let _cachedCompletedList = null;
let _cachedTotalWatchStats = null;
let _favoritesCache = null;
let _favoritesSet = null;
let _watchlistCache = null;
let _watchlistSet = null;
let _profilesCache = null;
let _activeProfileCache = null;
let _userSettingsCache = null;
let _blockedContentCache = null;

function invalidateDerivedHistoryCaches() {
  _cachedGroupedHistory = null;
  _cachedContinueWatching = null;
  _cachedCompletedList = null;
  _cachedTotalWatchStats = null;
}

function clearStorageCache() {
  _watchHistoryCache = null;
  _progressMapCache = null;
  _seriesLatestMapCache = null;
  invalidateDerivedHistoryCaches();
  _favoritesCache = null;
  _favoritesSet = null;
  _watchlistCache = null;
  _watchlistSet = null;
  _animeIdsSet = null;
  _profilesCache = null;
  _activeProfileCache = null;
  _userSettingsCache = null;
  _blockedContentCache = null;
}

export function getProfiles() {
  if (_profilesCache) return _profilesCache;
  const defaultProfiles = [
    { id: 'prof_1', name: 'Profilim', avatar: 'user-circle', isKid: false, color: '#f59e0b' },
    { id: 'prof_kids', name: 'Çocuk Modu 🎈', avatar: 'baby', isKid: true, color: '#38bdf8' }
  ];
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      _profilesCache = defaultProfiles;
      return _profilesCache;
    }
    const raw = localStorage.getItem('sineflix_profiles_list_v1');
    if (!raw) {
      _profilesCache = defaultProfiles;
      return _profilesCache;
    }
    let profiles = JSON.parse(raw);
    const hadCinema = profiles.some(p => p.id === 'prof_cinema');
    if (hadCinema) {
      profiles = profiles.filter(p => p.id !== 'prof_cinema');
      localStorage.setItem('sineflix_profiles_list_v1', JSON.stringify(profiles));
    }
    _profilesCache = profiles;
    return _profilesCache;
  } catch (_) {
    _profilesCache = defaultProfiles;
    return _profilesCache;
  }
}

export function saveProfiles(profilesList) {
  try {
    _profilesCache = profilesList;
    _activeProfileCache = null;
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.setItem('sineflix_profiles_list_v1', JSON.stringify(profilesList));
    window.dispatchEvent(new CustomEvent('sineflix_profiles_updated'));
  } catch (_) {}
}

export function isProfileSetupComplete() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return true;
    return localStorage.getItem('cinepulse_onboarding_completed') === 'true';
  } catch (_) {
    return true;
  }
}

export function hasCompletedProductTour() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return true;
    return localStorage.getItem('cinepulse_product_tour_completed') === 'true';
  } catch (_) {
    return true;
  }
}

export function completeProductTour() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.setItem('cinepulse_product_tour_completed', 'true');
  } catch (_) {}
}

export function completeProfileSetup({ name, avatar = 'user-circle', color = '#f59e0b', isKid = false }) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const cleanName = (name || '').trim() || (isKid ? 'Çocuk' : 'Profilim');
    let profiles = getProfiles();
    const profIndex = profiles.findIndex(p => p.id === 'prof_1');
    const updatedProfile = {
      id: 'prof_1',
      name: cleanName,
      avatar,
      color,
      isKid: Boolean(isKid)
    };
    if (profIndex !== -1) {
      profiles[profIndex] = updatedProfile;
    } else {
      profiles.unshift(updatedProfile);
    }
    saveProfiles(profiles);
    setActiveProfile('prof_1');
    localStorage.setItem('cinepulse_onboarding_completed', 'true');
    window.dispatchEvent(new CustomEvent('sineflix_profile_changed', { detail: { profileId: 'prof_1' } }));
    return updatedProfile;
  } catch (_) {
    return null;
  }
}

const DEFAULT_ADMIN_PIN = '1403';

export function getAdminPin() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return DEFAULT_ADMIN_PIN;
    return localStorage.getItem('cinepulse_admin_pin') || DEFAULT_ADMIN_PIN;
  } catch (_) {
    return DEFAULT_ADMIN_PIN;
  }
}

export function setAdminPin(newPin) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    if (!newPin || String(newPin).length < 4) return false;
    localStorage.setItem('cinepulse_admin_pin', String(newPin));
    return true;
  } catch (_) {
    return false;
  }
}

export function verifyAdminPin(pin) {
  return String(pin).trim() === getAdminPin().trim();
}

export function getBlockedContent() {
  if (_blockedContentCache) return _blockedContentCache;
  const defaultBlocked = ['clitoris', 'le clitoris', 'erotik', 'porn'];
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      _blockedContentCache = defaultBlocked;
      return defaultBlocked;
    }
    const raw = localStorage.getItem('cinepulse_blocked_content');
    if (!raw) {
      _blockedContentCache = defaultBlocked;
      return defaultBlocked;
    }
    _blockedContentCache = JSON.parse(raw);
    return _blockedContentCache;
  } catch (_) {
    _blockedContentCache = defaultBlocked;
    return defaultBlocked;
  }
}

export function addBlockedContent(entry) {
  if (!entry) return;
  const list = getBlockedContent();
  const clean = String(entry).trim().toLowerCase();
  if (!list.includes(clean)) {
    list.push(clean);
    _blockedContentCache = list;
    try {
      localStorage.setItem('cinepulse_blocked_content', JSON.stringify(list));
    } catch (_) {}
  }
}

export function removeBlockedContent(entry) {
  if (!entry) return;
  let list = getBlockedContent();
  const clean = String(entry).trim().toLowerCase();
  list = list.filter(item => String(item).toLowerCase() !== clean);
  _blockedContentCache = list;
  try {
    localStorage.setItem('cinepulse_blocked_content', JSON.stringify(list));
  } catch (_) {}
}

export function isContentBlocked(item) {
  if (!item) return false;
  const blockedList = getBlockedContent();
  const idStr = String(item.id || '');
  const text = `${item.title || ''} ${item.name || ''} ${item.original_title || ''} ${item.original_name || ''}`.toLowerCase();
  return blockedList.some(b => {
    const s = String(b).toLowerCase().trim();
    if (!s) return false;
    if (idStr === s) return true;
    return text.includes(s);
  });
}

export function getActiveProfile() {
  if (_activeProfileCache) return _activeProfileCache;
  try {
    const profiles = getProfiles();
    const activeId = (typeof window !== 'undefined' && window.localStorage)
      ? (localStorage.getItem('sineflix_active_profile_id') || 'prof_1')
      : 'prof_1';
    _activeProfileCache = profiles.find(p => p.id === activeId) || profiles[0];
    return _activeProfileCache;
  } catch (_) {
    return { id: 'prof_1', name: 'Profilim', avatar: 'user-circle', isKid: false, color: '#f59e0b' };
  }
}

export function setActiveProfile(profileId) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.setItem('sineflix_active_profile_id', profileId);
    _activeProfileCache = null;
    clearStorageCache();
    window.dispatchEvent(new CustomEvent('sineflix_profile_changed', { detail: { profileId } }));
  } catch (_) {}
}

export function isKidProfileActive() {
  return getActiveProfile()?.isKid === true;
}

/**
 * Check if a movie or series is appropriate for children
 */
export function isItemKidSafe(item) {
  if (!item) return false;
  if (item.adult === true) return false;
  if (isContentBlocked(item)) return false;

  // Mature genres to strictly block: Horror (27), Crime (80), War (10752/10768), Thriller (53), Drama (18)
  const matureGenreIds = [27, 80, 10752, 10768, 53, 18];
  const itemGenreIds = item.genre_ids || (Array.isArray(item.genres) ? item.genres.map(g => (typeof g === 'object' ? g.id : g)) : []);

  if (itemGenreIds.some(id => matureGenreIds.includes(Number(id)))) {
    return false;
  }

  // Check text content for mature keywords
  const text = `${item.title || ''} ${item.name || ''} ${item.overview || ''}`.toLowerCase();
  const blockedKeywords = [
    'cinayet', 'katil', 'vahşet', 'kanlı', 'erotik', 'dehşet', 'intikam', 'mafya',
    'uyuşturucu', 'şiddet', 'tecavüz', 'seri katil', 'katliam', 'korku', 'kan donduran',
    'murder', 'killer', 'horror', 'bloody', 'psychopath', 'terror', 'revenge',
    'savaş', 'war', 'battle', 'death', 'ölüm'
  ];

  if (blockedKeywords.some(kw => text.includes(kw))) {
    return false;
  }

  // STRICT: Must have at least one kid-safe genre: Animation (16), Family (10751), Kids (10762)
  const safeGenreIds = [16, 10751, 10762];
  const hasKidGenre = itemGenreIds.some(id => safeGenreIds.includes(Number(id)));

  return hasKidGenre;
}

/**
 * Filter an array of items according to active user profile
 */
export function filterForActiveProfile(items = []) {
  if (!Array.isArray(items)) return [];
  if (!isKidProfileActive()) return items;
  return items.filter(isItemKidSafe);
}

export function addProfile({ name, isKid = false, avatar = 'user-circle', color = '#f59e0b' }) {
  const profiles = getProfiles();
  const newProfile = {
    id: `prof_${Date.now()}`,
    name: name.trim() || 'Yeni Profil',
    avatar,
    isKid: Boolean(isKid),
    color
  };
  profiles.push(newProfile);
  saveProfiles(profiles);
  return newProfile;
}

export function deleteProfile(profileId) {
  if (profileId === 'prof_1') return false; // Prevent deleting master profile
  let profiles = getProfiles();
  profiles = profiles.filter(p => p.id !== profileId);
  saveProfiles(profiles);
  if (getActiveProfile()?.id === profileId) {
    setActiveProfile('prof_1');
  }
  return true;
}

function getNamespacedKey(key) {
  if (key === STORAGE_KEYS.WATCH_HISTORY || key === STORAGE_KEYS.FAVORITES || key === STORAGE_KEYS.WATCHLIST) {
    const profile = getActiveProfile();
    if (profile && profile.id && profile.id !== 'prof_1') {
      return `${key}_${profile.id}`;
    }
  }
  return key;
}

function getLocalItem(key, defaultValue = []) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return defaultValue;
    const namespacedKey = getNamespacedKey(key);
    const data = localStorage.getItem(namespacedKey);
    return data ? JSON.parse(data) : defaultValue;
  } catch (err) {
    return defaultValue;
  }
}

/* ==========================================================================
   IndexedDB High-Capacity Storage Bridge (Handles 10MB - 100MB+ Datasets)
   Overcomes localStorage 5MB hard limit with zero data loss & non-blocking I/O
   ========================================================================== */
const IDB_NAME = 'cinepulse_storage_v1';
const IDB_STORE = 'keyval_store';
let _idbPromise = null;

function getIDB() {
  if (_idbPromise) return _idbPromise;
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }
  _idbPromise = new Promise((resolve) => {
    try {
      const req = window.indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch (_) {
      resolve(null);
    }
  });
  return _idbPromise;
}

export async function idbGet(key) {
  try {
    const db = await getIDB();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readonly');
        const store = tx.objectStore(IDB_STORE);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result !== undefined ? req.result : null);
        req.onerror = () => resolve(null);
      } catch (_) {
        resolve(null);
      }
    });
  } catch (_) {
    return null;
  }
}

export async function idbSet(key, val) {
  try {
    const db = await getIDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        store.put(val, key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (_) {
        resolve(false);
      }
    });
  } catch (_) {
    return false;
  }
}

// Background sync from IndexedDB on startup (for high-volume 10MB - 100MB+ libraries)
async function syncFromIndexedDB() {
  if (typeof window === 'undefined' || !window.indexedDB) return;
  try {
    const namespacedKey = getNamespacedKey(STORAGE_KEYS.WATCH_HISTORY);
    const idbHistory = await idbGet(namespacedKey);
    if (Array.isArray(idbHistory) && idbHistory.length > 0) {
      const currentLen = (_watchHistoryCache && _watchHistoryCache.length) || 0;
      if (idbHistory.length >= currentLen) {
        _watchHistoryCache = idbHistory.sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
        _progressMapCache = null;
        _seriesLatestMapCache = null;
        invalidateDerivedHistoryCaches();
        window.dispatchEvent(new CustomEvent('sineflix_data_changed', { detail: { key: namespacedKey, value: _watchHistoryCache } }));
      }
    }
  } catch (_) {}
}

if (typeof window !== 'undefined') {
  setTimeout(syncFromIndexedDB, 80);
}

const _pendingDiskSaves = new Map();

function flushPendingDiskSaves() {
  if (typeof window === 'undefined') return;
  for (const [namespacedKey, item] of _pendingDiskSaves.entries()) {
    try {
      if (item.timer) clearTimeout(item.timer);
      idbSet(namespacedKey, item.value);
      if (window.localStorage) {
        localStorage.setItem(namespacedKey, JSON.stringify(item.value));
      }
    } catch (_) {}
  }
  _pendingDiskSaves.clear();
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushPendingDiskSaves);
  window.addEventListener('pagehide', flushPendingDiskSaves);
}

function setLocalItem(key, value, options = {}) {
  try {
    if (typeof window === 'undefined') return;
    const namespacedKey = getNamespacedKey(key);

    // High capacity IndexedDB storage: easily stores 10MB - 100MB+ without blocking or quota limits
    idbSet(namespacedKey, value);

    if (window.localStorage) {
      if (options.isProgressUpdate) {
        // Debounce large disk I/O writes during playback so player UI remains at 60 FPS
        if (_pendingDiskSaves.has(namespacedKey)) {
          clearTimeout(_pendingDiskSaves.get(namespacedKey).timer);
        }
        const timer = setTimeout(() => {
          try {
            localStorage.setItem(namespacedKey, JSON.stringify(value));
          } catch (e) {
            // LocalStorage 5MB quota exceeded: IndexedDB already holds the full data
          }
          _pendingDiskSaves.delete(namespacedKey);
        }, 2500);
        _pendingDiskSaves.set(namespacedKey, { timer, value });
      } else {
        if (_pendingDiskSaves.has(namespacedKey)) {
          clearTimeout(_pendingDiskSaves.get(namespacedKey).timer);
          _pendingDiskSaves.delete(namespacedKey);
        }
        try {
          localStorage.setItem(namespacedKey, JSON.stringify(value));
        } catch (e) {
          // LocalStorage 5MB quota exceeded: IndexedDB already holds the full data
        }
      }
    }

    window.dispatchEvent(new CustomEvent('sineflix_data_changed', { detail: { key: namespacedKey, value, ...options } }));
  } catch (err) {
    console.error(`Error saving ${key}:`, err);
  }
}

export const KNOWN_ANIME_KEYWORDS = [
  'anime', 'kimetsu', 'yaiba', 'iblis keser', 'demon slayer', 'naruto', 'boruto', 'shingeki', 'titan',
  'titana saldırı', 'jujutsu', 'kaisen', 'one piece', 'death note', 'bleach', 'dragon ball', 'hunter x hunter',
  'chainsaw man', 'tokyo ghoul', 'my hero academia', 'boku no hero', 'kahramanlık akademim', 'fullmetal',
  'alchemist', 'simyacı', 'sword art online', 'solo leveling', 'black clover', 'vinland saga', 'spy x family',
  'cyberpunk: edgerunners', 'haikyuu', 'one punch', 'berserk', 'mob psycho', 'overlord', 'evangelion',
  'cowboy bebop', 'code geass', 'frieren', 'dr. stone', 'blue lock', 'steins;gate', 'jojo', 'kaiju no. 8',
  'gintama', 'fairy tail', 'violet evergarden', 'hell\'s paradise', 'jigokuraku', 'dandadan', 'wind breaker',
  'mushoku tensei', 're:zero', 'delicious in dungeon', 'dungeon meshi', 'mashle', 'baki', 'hajime no ippo',
  'slamdunk', 'slam dunk', 'kuroko', 'initial d', 'great teacher onizuka', 'monster', 'dororo', 'fire force',
  'soul eater', 'noragami', 'erased', 'parasyte', 'psycho-pass', 'fate/zero', 'fate/stay', 'made in abyss',
  'your lie in april', 'shigatsu wa kimi', 'anohana', 'toradora', 'clannad', 'classroom of the elite',
  'elite sınıfı', 'no game no life', 'konosuba', 'slime datta ken', 'shield hero', 'kalkan kahramanı',
  'goblin slayer', 'akame ga kill', 'kill la kill', 'gurren lagann', 'darling in the franxx', 'promised neverland',
  'seven deadly sins', 'nanatsu no taizai', 'yedi ölümcül günah', 'tokyo revengers', 'blue exorcist',
  'ao no exorcist', 'd.gray-man', 'inuyasha', 'yu yu hakusho', 'sailor moon', 'pokemon', 'digimon',
  'yu-gi-oh', 'beyblade', 'captain tsubasa', 'tsubasa', 'record of ragnarok', 'shuumatsu no valkyrie',
  'golden kamuy', 'dorohedoro', 'pluto', 'trigun', 'hellsing', 'elfen lied', 'rurouni kenshin', 'samurai champloo',
  'fruits basket', 'horimiya', 'my dress-up darling', 'komi can\'t communicate', 'rent-a-girlfriend',
  'kaguya-sama', 'lycoris recoil', 'zom 100', 'undead unluck', 'dead mount death play', 'seraph of the end',
  'owari no seraph', 'bungo stray dogs', 'bungou stray dogs', 'assassination classroom', 'suikast sınıfı',
  'black butler', 'kuroshitsuji', 'spirited away', 'ruhların kaçışı', 'howl\'s moving castle', 'yürüyen şato',
  'my neighbor totoro', 'komşum totoro', 'princess mononoke', 'prenses mononoke', 'your name', 'kimi no na wa',
  'senin adın', 'weathering with you', 'suzume', 'a silent voice', 'sessizliğin sesi', 'koe no katachi',
  'akira', 'shangri-la frontier', 'oshi no ko', 'the eminence in shadow', 'bocchi the rock'
];

export function hasJapaneseCharacters(text) {
  if (!text) return false;
  return /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(text);
}

export function isAnimeRecord(item) {
  if (!item) return false;
  if (item.isAnime === true || item.type === 'anime' || item.media_type === 'anime') return true;
  if (item.id && isRegisteredAnimeId(item.id)) return true;

  const genreIds = item.genre_ids || (Array.isArray(item.genres) ? item.genres.map(g => (typeof g === 'object' ? g.id : g)) : []);
  const hasAnimation = genreIds.some(id => Number(id) === 16);
  const isJapanese = item.original_language === 'ja' || (Array.isArray(item.origin_country) && item.origin_country.includes('JP'));

  // 1. Animation genre + Japanese origin or language
  if (hasAnimation && isJapanese) {
    if (item.id) registerAnimeId(item.id);
    return true;
  }
  if (hasAnimation && (item.origin_country?.includes('JP') || item.original_language === 'ja')) {
    if (item.id) registerAnimeId(item.id);
    return true;
  }

  // 2. Japanese original language with animation or Japanese script
  if (item.original_language === 'ja' && (hasAnimation || hasJapaneseCharacters(item.original_name || item.original_title || item.title || item.name))) {
    if (item.id) registerAnimeId(item.id);
    return true;
  }

  // 3. Explicit anime genre name
  if (Array.isArray(item.genres)) {
    const genreNames = item.genres.map(g => (typeof g === 'object' ? g.name : String(g))).filter(Boolean);
    if (genreNames.some(n => /anime/i.test(n))) {
      if (item.id) registerAnimeId(item.id);
      return true;
    }
  }

  // 4. Scraper IDs
  if (typeof item.id === 'string' && (item.id.startsWith('ta_') || item.id.startsWith('acx_') || item.id.startsWith('tra_'))) {
    registerAnimeId(item.id);
    return true;
  }

  // 5. Known keywords
  const rawTitle = (item.title || item.name || item.original_title || item.original_name || '').toLowerCase();
  for (const kw of KNOWN_ANIME_KEYWORDS) {
    if (rawTitle.includes(kw)) {
      if (item.id) registerAnimeId(item.id);
      return true;
    }
  }

  return false;
}

export function isMovieRecord(item) {
  if (!item) return true;
  if (item.isSeries === true) return false;
  if (item.type === 'tv' || item.media_type === 'tv') return false;
  if (item.type === 'movie' || item.media_type === 'movie') return true;
  if (item.first_air_date || item.number_of_seasons || item.episodesCount || (Array.isArray(item.seasons) && item.seasons.length > 0)) return false;
  if (item.season > 1 || item.episode > 1) return false;
  if (item.release_date && !item.first_air_date) return true;
  return false;
}

/* ==========================================================================
   Watch History & Progress Management
   ========================================================================== */

export function getWatchHistory() {
  if (_watchHistoryCache) return _watchHistoryCache;
  let history = getLocalItem(STORAGE_KEYS.WATCH_HISTORY, []);
  // Keep 100% of user watch history without pruning or data loss
  _watchHistoryCache = history.sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
  return _watchHistoryCache;
}

export async function syncHistoryAnimeStatus() {
  const history = getWatchHistory();
  let hasChanges = false;
  const tmdbKey = '4e44d9029b1270a757cddc766a1bcb63';
  let networkChecks = 0;

  for (let i = 0; i < history.length; i++) {
    const item = history[i];
    if (item.isAnime || item.type === 'anime') {
      if (item.id) registerAnimeId(item.id);
      continue;
    }

    // Skip items that already have isAnime explicitly resolved
    if (item.isAnime === false && item.type !== 'anime') {
      continue;
    }

    if (isRegisteredAnimeId(item.id) || isAnimeRecord(item)) {
      item.isAnime = true;
      item.type = 'anime';
      registerAnimeId(item.id);
      hasChanges = true;
      continue;
    }

    // Cap background TMDB queries to at most 5 per session to avoid thread/network choking
    if (networkChecks < 5 && item.id && !isNaN(Number(item.id))) {
      networkChecks++;
      try {
        const res = await fetch(`https://api.themoviedb.org/3/tv/${item.id}?api_key=${tmdbKey}&language=tr-TR`);
        if (res.ok) {
          const data = await res.json();
          const isJp = data.original_language === 'ja' || (Array.isArray(data.origin_country) && data.origin_country.includes('JP'));
          const hasAnim = Array.isArray(data.genres) && data.genres.some(g => g.id === 16 || /anim/i.test(g.name));
          if (isJp && hasAnim) {
            item.isAnime = true;
            item.type = 'anime';
            item.isSeries = true;
            item.original_language = 'ja';
            registerAnimeId(item.id);
            hasChanges = true;
          }
        }
      } catch (_) {}
    }
  }

  if (hasChanges) {
    invalidateDerivedHistoryCaches();
    setLocalItem(STORAGE_KEYS.WATCH_HISTORY, history);
  }
}


function getProgressMap() {
  if (_progressMapCache) return _progressMapCache;
  const history = getWatchHistory();
  _progressMapCache = new Map();
  _seriesLatestMapCache = new Map();

  for (let i = 0; i < history.length; i++) {
    const item = history[i];
    const key = `${item.id}_${item.season || 1}_${item.episode || 1}`;
    if (!_progressMapCache.has(key)) {
      _progressMapCache.set(key, item);
    }
    const idStr = String(item.id);
    if (!_seriesLatestMapCache.has(idStr)) {
      _seriesLatestMapCache.set(idStr, item);
    }
  }
  return _progressMapCache;
}

function cleanImagePath(p) {
  if (!p || typeof p !== 'string') return '';
  let clean = p.replace(/^(undefined|null|\/undefined|\/null)$/i, '');
  if (!clean || clean.startsWith('data:') || clean.startsWith('http')) return clean;

  try {
    while (clean.includes('%')) {
      const decoded = decodeURIComponent(clean);
      if (decoded === clean) break;
      clean = decoded;
    }
  } catch (e) {}

  clean = clean.replace(/^\/+/, '/');
  if (!clean.startsWith('/')) clean = `/${clean}`;
  if (clean === '/' || clean === '/null' || clean === '/undefined') return '';
  return clean;
}

function resolveMediaImages(id, passedPoster, passedBackdrop, history = []) {
  const anyExisting = history.find(item => item.id == id && (item.posterPath || item.poster_path));
  let rawPoster = passedPoster || (anyExisting ? (anyExisting.posterPath || anyExisting.poster_path) : '');
  let rawBackdrop = passedBackdrop || (anyExisting ? (anyExisting.backdropPath || anyExisting.backdrop_path) : '');

  const resolvedPoster = cleanImagePath(rawPoster);
  const resolvedBackdrop = cleanImagePath(rawBackdrop);

  return { resolvedPoster: resolvedPoster || '', resolvedBackdrop: resolvedBackdrop || '' };
}

export function saveWatchProgress({
  id,
  title,
  posterPath,
  poster_path,
  backdropPath,
  backdrop_path,
  type,
  isAnime = false,
  isSeries = false,
  season = 1,
  episode = 1,
  currentTime = 0,
  duration = 0,
  completed = false,
  genres = [],
  genre_ids = [],
  original_language = '',
  origin_country = [],
  ...rest
}) {
  if (!id) return;

  const history = getWatchHistory();
  const existingIndex = history.findIndex(item => item.id == id && item.season == season && item.episode == episode);
  const anyExisting = history.find(item => item.id == id);
  
  // 1. Resolve Anime Status
  const isAnAnime = Boolean(
    isAnime ||
    type === 'anime' ||
    isRegisteredAnimeId(id) ||
    (existingIndex >= 0 && (history[existingIndex].isAnime || history[existingIndex].type === 'anime')) ||
    (anyExisting && (anyExisting.isAnime || anyExisting.type === 'anime')) ||
    isAnimeRecord({ id, title, type, genres, genre_ids, original_language, origin_country, ...rest })
  );

  if (isAnAnime) {
    registerAnimeId(id);
  }

  // 2. Resolve Series vs Movie Status
  const hasSeriesProps = Boolean(
    isSeries ||
    type === 'tv' ||
    rest.first_air_date ||
    rest.number_of_seasons ||
    rest.episodesCount ||
    (Array.isArray(rest.seasons) && rest.seasons.length > 0) ||
    season > 1 ||
    episode > 1 ||
    (existingIndex >= 0 && (history[existingIndex].isSeries || history[existingIndex].type === 'tv' || history[existingIndex].season > 1 || history[existingIndex].episode > 1)) ||
    (anyExisting && (anyExisting.isSeries || anyExisting.type === 'tv' || anyExisting.season > 1 || anyExisting.episode > 1))
  );

  // 3. Resolve Stored Type: 'anime' takes top precedence, then 'tv' or 'movie'
  let resolvedType = isAnAnime ? 'anime' : (hasSeriesProps ? 'tv' : 'movie');

  const { resolvedPoster, resolvedBackdrop } = resolveMediaImages(
    id,
    posterPath || poster_path,
    backdropPath || backdrop_path,
    history
  );

  const effectiveDuration = duration > 0 ? duration : (resolvedType === 'movie' ? 6600 : 3000);
  const progressPercent = effectiveDuration > 0 ? Math.min(100, Math.round((currentTime / effectiveDuration) * 100)) : 0;
  const isCompleted = completed || progressPercent >= 90;

  const record = {
    ...rest,
    id,
    title: title || (existingIndex >= 0 ? history[existingIndex].title : (anyExisting ? anyExisting.title : 'İçerik')),
    posterPath: resolvedPoster,
    poster_path: resolvedPoster,
    backdropPath: resolvedBackdrop,
    backdrop_path: resolvedBackdrop,
    type: resolvedType,
    isAnime: isAnAnime,
    isSeries: hasSeriesProps,
    genres: (genres && genres.length > 0) ? genres : (existingIndex >= 0 ? history[existingIndex].genres : (anyExisting ? anyExisting.genres : [])),
    genre_ids: (genre_ids && genre_ids.length > 0) ? genre_ids : (existingIndex >= 0 ? history[existingIndex].genre_ids : (anyExisting ? anyExisting.genre_ids : [])),
    original_language: original_language || (existingIndex >= 0 ? history[existingIndex].original_language : (anyExisting ? anyExisting.original_language : '')),
    origin_country: (origin_country && origin_country.length > 0) ? origin_country : (existingIndex >= 0 ? history[existingIndex].origin_country : (anyExisting ? anyExisting.origin_country : [])),
    season: Number(season),
    episode: Number(episode),
    currentTime: Math.round(currentTime),
    duration: Math.round(effectiveDuration),
    progressPercent,
    completed: isCompleted,
    lastWatchedAt: rest.lastWatchedAt ? Number(rest.lastWatchedAt) : Date.now()
  };

  if (existingIndex >= 0) {
    history[existingIndex] = record;
  } else {
    history.unshift(record);
  }

  history.sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
  _watchHistoryCache = history;
  if (_progressMapCache) {
    _progressMapCache.set(`${id}_${season}_${episode}`, record);
  }
  if (_seriesLatestMapCache) {
    _seriesLatestMapCache.set(String(id), record);
  }
  invalidateDerivedHistoryCaches();

  setLocalItem(STORAGE_KEYS.WATCH_HISTORY, history, { isProgressUpdate: true });
}

/**
 * Bulk save watch progress records in a single optimized pass
 */
export function saveBatchWatchProgress(items = []) {
  if (!Array.isArray(items) || items.length === 0) return;
  const history = getWatchHistory();
  const historyMap = new Map();

  for (let i = 0; i < history.length; i++) {
    const item = history[i];
    const key = `${item.id}_${item.season || 1}_${item.episode || 1}`;
    historyMap.set(key, item);
  }

  for (const item of items) {
    if (!item || !item.id) continue;
    const season = Number(item.season || 1);
    const episode = Number(item.episode || 1);
    const key = `${item.id}_${season}_${episode}`;
    const existing = historyMap.get(key);

    // If existing record is newer AND completed, and the incoming item is ALSO completed, skip
    if (existing && existing.lastWatchedAt && item.lastWatchedAt && existing.lastWatchedAt > item.lastWatchedAt && existing.completed && item.completed) {
      continue;
    }

    const isAnAnime = Boolean(
      item.isAnime ||
      item.type === 'anime' ||
      isRegisteredAnimeId(item.id) ||
      (existing && (existing.isAnime || existing.type === 'anime')) ||
      isAnimeRecord(item)
    );
    if (isAnAnime) registerAnimeId(item.id);

    const hasSeriesProps = Boolean(
      item.isSeries ||
      item.type === 'tv' ||
      item.first_air_date ||
      season > 1 ||
      episode > 1 ||
      (existing && (existing.isSeries || existing.type === 'tv'))
    );

    const resolvedType = isAnAnime ? 'anime' : (hasSeriesProps ? 'tv' : 'movie');
    const { resolvedPoster, resolvedBackdrop } = resolveMediaImages(
      item.id,
      item.posterPath || item.poster_path,
      item.backdropPath || item.backdrop_path,
      history
    );

    const effectiveDuration = item.duration > 0 ? item.duration : (resolvedType === 'movie' ? 6600 : 3000);
    const currentTime = item.currentTime !== undefined ? item.currentTime : (item.completed ? effectiveDuration : 0);
    const progressPercent = item.progressPercent !== undefined 
      ? item.progressPercent 
      : (effectiveDuration > 0 ? Math.min(100, Math.round((currentTime / effectiveDuration) * 100)) : 0);
    const isCompleted = item.completed || progressPercent >= 90;

    const record = {
      ...(existing || {}),
      ...item,
      id: item.id,
      title: item.title || existing?.title || 'İçerik',
      posterPath: resolvedPoster,
      poster_path: resolvedPoster,
      backdropPath: resolvedBackdrop,
      backdrop_path: resolvedBackdrop,
      type: resolvedType,
      isAnime: isAnAnime,
      isSeries: hasSeriesProps,
      season,
      episode,
      currentTime: Math.round(currentTime),
      duration: Math.round(effectiveDuration),
      progressPercent,
      completed: isCompleted,
      lastWatchedAt: item.lastWatchedAt ? Number(item.lastWatchedAt) : (existing?.lastWatchedAt || Date.now())
    };

    historyMap.set(key, record);
  }

  const updatedHistory = Array.from(historyMap.values()).sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
  _watchHistoryCache = updatedHistory;
  _progressMapCache = null;
  _seriesLatestMapCache = null;
  invalidateDerivedHistoryCaches();
  setLocalItem(STORAGE_KEYS.WATCH_HISTORY, updatedHistory);
}

export function removeWatchHistoryItem(id, season = 1, episode = 1) {
  let history = getWatchHistory();
  history = history.filter(item => !(item.id == id && item.season == season && item.episode == episode));
  _watchHistoryCache = history;
  if (_progressMapCache) _progressMapCache.delete(`${id}_${season}_${episode}`);
  invalidateDerivedHistoryCaches();
  setLocalItem(STORAGE_KEYS.WATCH_HISTORY, history);
}

export function removeSeriesFromHistory(id) {
  let history = getWatchHistory();
  history = history.filter(item => item.id != id);
  _watchHistoryCache = history;
  _progressMapCache = null;
  invalidateDerivedHistoryCaches();
  setLocalItem(STORAGE_KEYS.WATCH_HISTORY, history);
}

export function clearCompletedHistory() {
  let history = getWatchHistory();
  history = history.filter(item => !item.completed && item.progressPercent < 90);
  setLocalItem(STORAGE_KEYS.WATCH_HISTORY, history);
}

export function cleanTraktImportedHistory() {
  let history = getWatchHistory();
  const beforeCount = history.length;
  // Remove items added by faulty sync with dummy currentTime=1000 & duration=1000
  history = history.filter(item => !(item.currentTime === 1000 && item.duration === 1000));
  _watchHistoryCache = history;
  _progressMapCache = null;
  invalidateDerivedHistoryCaches();
  setLocalItem(STORAGE_KEYS.WATCH_HISTORY, history);
  return beforeCount - history.length;
}

export function getMediaProgress(id, season = 1, episode = 1) {
  const map = getProgressMap();
  return map.get(`${id}_${season}_${episode}`) || null;
}

export function isMediaWatched(id, season = 1, episode = 1) {
  const progress = getMediaProgress(id, season, episode);
  return !!(progress && (progress.completed || progress.progressPercent >= 90));
}

export function markEpisodeWatched(id, season = 1, episode = 1, completed = true, mediaData = {}) {
  const history = getWatchHistory();
  const existingIndex = history.findIndex(item => item.id == id && item.season == season && item.episode == episode);
  const anyExisting = history.find(item => item.id == id);

  const isAnAnime = Boolean(
    mediaData.isAnime ||
    mediaData.type === 'anime' ||
    isRegisteredAnimeId(id) ||
    (existingIndex >= 0 && (history[existingIndex].isAnime || history[existingIndex].type === 'anime')) ||
    (anyExisting && (anyExisting.isAnime || anyExisting.type === 'anime')) ||
    isAnimeRecord({ id, title: mediaData.title, ...mediaData })
  );
  if (isAnAnime) registerAnimeId(id);

  const isMovie = (mediaData.type === 'movie' && !isAnAnime);
  const duration = mediaData.duration || (isMovie ? 6600 : 3000);

  const { resolvedPoster, resolvedBackdrop } = resolveMediaImages(
    id,
    mediaData.posterPath || mediaData.poster_path,
    mediaData.backdropPath || mediaData.backdrop_path,
    history
  );

  const record = {
    id,
    title: mediaData.title || (existingIndex >= 0 ? history[existingIndex].title : 'İçerik'),
    posterPath: resolvedPoster,
    poster_path: resolvedPoster,
    backdropPath: resolvedBackdrop,
    backdrop_path: resolvedBackdrop,
    type: isAnAnime ? 'anime' : (isMovie ? 'movie' : 'tv'),
    isAnime: isAnAnime,
    isSeries: !isMovie,
    season: Number(season),
    episode: Number(episode),
    currentTime: completed ? duration : 0,
    duration: duration,
    progressPercent: completed ? 100 : 0,
    completed: !!completed,
    lastWatchedAt: Date.now()
  };

  if (existingIndex >= 0) {
    history[existingIndex] = record;
  } else {
    history.push(record);
  }

  setLocalItem(STORAGE_KEYS.WATCH_HISTORY, history);
}

export function markMediaWatched(id, completed = true, mediaData = {}) {
  markEpisodeWatched(id, 1, 1, completed, { ...mediaData, type: mediaData.type || 'movie' });
}

export function toggleEpisodeWatched(id, season = 1, episode = 1, mediaData = {}) {
  const isCurrentlyWatched = isMediaWatched(id, season, episode);
  markEpisodeWatched(id, season, episode, !isCurrentlyWatched, mediaData);
  return { completed: !isCurrentlyWatched };
}

export function markAllEpisodesWatched(seriesId, seasonsList = [], completed = true, mediaData = {}) {
  const history = getWatchHistory();
  const title = mediaData.title || 'Dizi';
  const isAnAnime = Boolean(
    mediaData.isAnime ||
    mediaData.type === 'anime' ||
    isRegisteredAnimeId(seriesId) ||
    isAnimeRecord({ id: seriesId, title })
  );
  if (isAnAnime) registerAnimeId(seriesId);

  const type = isAnAnime ? 'anime' : 'tv';
  const duration = mediaData.duration || 3000;

  const { resolvedPoster, resolvedBackdrop } = resolveMediaImages(
    seriesId,
    mediaData.posterPath || mediaData.poster_path,
    mediaData.backdropPath || mediaData.backdrop_path,
    history
  );

  for (const season of seasonsList) {
    const seasonNum = season.season_number;
    if (seasonNum === 0 && seasonsList.length > 1) continue;
    const count = season.episode_count || 10;
    for (let ep = 1; ep <= count; ep++) {
      const existingIndex = history.findIndex(item => item.id == seriesId && item.season == seasonNum && item.episode == ep);
      const record = {
        id: seriesId,
        title,
        posterPath: resolvedPoster,
        poster_path: resolvedPoster,
        backdropPath: resolvedBackdrop,
        backdrop_path: resolvedBackdrop,
        type,
        isAnime: isAnAnime,
        isSeries: true,
        season: Number(seasonNum),
        episode: ep,
        currentTime: completed ? duration : 0,
        duration: duration,
        progressPercent: completed ? 100 : 0,
        completed: !!completed,
        lastWatchedAt: Date.now()
      };
      if (existingIndex >= 0) {
        history[existingIndex] = record;
      } else {
        history.push(record);
      }
    }
  }
  setLocalItem(STORAGE_KEYS.WATCH_HISTORY, history);
}

export function markSeasonEpisodesWatched(seriesId, seasonNum, episodeCount = 10, completed = true, mediaData = {}) {
  const history = getWatchHistory();
  const title = mediaData.title || 'Dizi';
  const isAnAnime = Boolean(
    mediaData.isAnime ||
    mediaData.type === 'anime' ||
    isRegisteredAnimeId(seriesId) ||
    isAnimeRecord({ id: seriesId, title })
  );
  if (isAnAnime) registerAnimeId(seriesId);

  const type = isAnAnime ? 'anime' : 'tv';
  const duration = mediaData.duration || 3000;

  const { resolvedPoster, resolvedBackdrop } = resolveMediaImages(
    seriesId,
    mediaData.posterPath || mediaData.poster_path,
    mediaData.backdropPath || mediaData.backdrop_path,
    history
  );

  for (let ep = 1; ep <= episodeCount; ep++) {
    const existingIndex = history.findIndex(item => item.id == seriesId && item.season == seasonNum && item.episode == ep);
    const record = {
      id: seriesId,
      title,
      posterPath: resolvedPoster,
      poster_path: resolvedPoster,
      backdropPath: resolvedBackdrop,
      backdrop_path: resolvedBackdrop,
      type,
      isAnime: isAnAnime,
      isSeries: true,
      season: Number(seasonNum),
      episode: ep,
      currentTime: completed ? duration : 0,
      duration: duration,
      progressPercent: completed ? 100 : 0,
      completed: !!completed,
      lastWatchedAt: Date.now()
    };
    if (existingIndex >= 0) {
      history[existingIndex] = record;
    } else {
      history.push(record);
    }
  }
  setLocalItem(STORAGE_KEYS.WATCH_HISTORY, history);
}

export function isEntireSeriesWatched(seriesId, seasonsList = []) {
  if (!seasonsList || seasonsList.length === 0) {
    return isMediaWatched(seriesId, 1, 1);
  }
  const map = getProgressMap();
  for (const season of seasonsList) {
    const seasonNum = season.season_number;
    if (seasonNum === 0 && seasonsList.length > 1) continue;
    const count = season.episode_count || 1;
    for (let ep = 1; ep <= count; ep++) {
      const item = map.get(`${seriesId}_${seasonNum}_${ep}`);
      if (!item || (!item.completed && item.progressPercent < 90)) {
        return false;
      }
    }
  }
  return true;
}

export function isSeasonFullyWatched(seriesId, seasonNum, episodeCount = 10) {
  const map = getProgressMap();
  for (let ep = 1; ep <= episodeCount; ep++) {
    const item = map.get(`${seriesId}_${seasonNum}_${ep}`);
    if (!item || (!item.completed && item.progressPercent < 90)) {
      return false;
    }
  }
  return true;
}

export function setMediaHalfway(id, season = 1, episode = 1, currentTime = 1500, mediaData = {}) {
  const isAnAnime = Boolean(
    mediaData.isAnime ||
    mediaData.type === 'anime' ||
    isRegisteredAnimeId(id) ||
    isAnimeRecord({ id, title: mediaData.title, ...mediaData })
  );
  if (isAnAnime) registerAnimeId(id);

  const isMovie = (mediaData.type === 'movie' && !isAnAnime);
  const duration = mediaData.duration || (isMovie ? 6600 : 3000);
  const time = currentTime || Math.round(duration * 0.5);

  return saveWatchProgress({
    id,
    title: mediaData.title || 'İçerik',
    posterPath: mediaData.posterPath || mediaData.poster_path || '',
    backdropPath: mediaData.backdropPath || mediaData.backdrop_path || '',
    type: isAnAnime ? 'anime' : (isMovie ? 'movie' : 'tv'),
    isAnime: isAnAnime,
    isSeries: !isMovie,
    season,
    episode,
    currentTime: time,
    duration,
    completed: false
  });
}


export function getLastWatchedEpisode(seriesId) {
  if (!seriesId) return null;
  if (!_seriesLatestMapCache) {
    getProgressMap();
  }
  if (_seriesLatestMapCache && _seriesLatestMapCache.has(String(seriesId))) {
    return _seriesLatestMapCache.get(String(seriesId));
  }
  const history = getWatchHistory();
  return history.find(item => item.id == seriesId) || null;
}

export function formatSecondsToTime(seconds) {
  if (!seconds || seconds <= 0) return '';
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  if (min >= 60) {
    const hrs = Math.floor(min / 60);
    const remMin = min % 60;
    return `${hrs}sa ${remMin > 0 ? remMin + 'dk' : ''}`;
  }
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

export function formatRemainingTime(currentTime, duration) {
  if (!duration || duration <= 0) duration = 3000;
  const remaining = Math.max(0, duration - (currentTime || 0));
  const remMin = Math.round(remaining / 60);
  if (remMin <= 0) return 'Bitti';
  if (remMin >= 60) {
    const hrs = Math.floor(remMin / 60);
    const m = remMin % 60;
    return `${hrs}sa ${m > 0 ? m + 'dk' : ''} kaldı`;
  }
  return `${remMin} dk kaldı`;
}

export function formatTotalWatchTime(totalSeconds) {
  if (!totalSeconds || totalSeconds <= 0) return '0 dakika';
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days} gün`);
  if (hours > 0) parts.push(`${hours} saat`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes} dk`);
  return parts.join(' ');
}

export function getTotalWatchStats() {
  if (_cachedTotalWatchStats) return _cachedTotalWatchStats;
  const history = getWatchHistory();
  let totalSeconds = 0;
  let moviesCount = 0;
  let episodesCount = 0;

  for (const item of history) {
    const isMovie = isMovieRecord(item);
    const itemDuration = item.duration && item.duration > 0 ? item.duration : (isMovie ? 6600 : 3000);

    if (item.completed) {
      totalSeconds += itemDuration;
    } else if (item.currentTime > 0) {
      totalSeconds += item.currentTime;
    } else if (item.progressPercent && item.progressPercent > 0) {
      totalSeconds += Math.round((item.progressPercent / 100) * itemDuration);
    } else {
      totalSeconds += itemDuration;
    }

    if (isMovie) {
      moviesCount++;
    } else {
      episodesCount++;
    }
  }

  const formatted = formatTotalWatchTime(totalSeconds);

  _cachedTotalWatchStats = {
    totalSeconds,
    totalMinutes: Math.floor(totalSeconds / 60),
    totalHours: (totalSeconds / 3600).toFixed(1),
    formattedTotalTime: formatted,
    formattedTotal: formatted,
    moviesCount,
    totalMovies: moviesCount,
    episodesCount,
    totalEpisodes: episodesCount,
    totalEntries: history.length
  };
  return _cachedTotalWatchStats;
}



export function getContinueWatchingList() {
  if (_cachedContinueWatching) return _cachedContinueWatching;
  const history = getWatchHistory();
  const seriesMap = new Map();

  for (const item of history) {
    const id = item.id;
    if (!seriesMap.has(id)) {
      seriesMap.set(id, []);
    }
    seriesMap.get(id).push(item);
  }

  const inProgressList = [];

  for (const [id, records] of seriesMap.entries()) {
    records.sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
    const firstRecord = records[0];
    const isAnime = Boolean(firstRecord.isAnime || firstRecord.type === 'anime' || isRegisteredAnimeId(firstRecord.id) || isAnimeRecord(firstRecord));
    if (isAnime) registerAnimeId(firstRecord.id);
    const isMovie = isMovieRecord(firstRecord);

    if (isMovie) {
      const isCompleted = firstRecord.completed || firstRecord.progressPercent >= 90;
      // Exclude completed movies from Continue Watching!
      if (isCompleted) continue;

      if (firstRecord.currentTime > 0) {
        const duration = firstRecord.duration || 6600;
        const remStr = formatRemainingTime(firstRecord.currentTime, duration);
        const prefix = isAnime ? 'Anime Filmi • ' : '';

        inProgressList.push({
          ...firstRecord,
          type: isAnime ? 'anime' : 'movie',
          isAnime: isAnime,
          isSeries: false,
          subtitle: `${prefix}Kaldığın: ${formatSecondsToTime(firstRecord.currentTime)} • ${remStr}`
        });
      }
    } else {
      // Find the most recently active in-progress record if one exists
      const halfwayRecord = records.find(r => !r.completed && (r.currentTime > 0 || (r.progressPercent > 0 && r.progressPercent < 85)));
      let currentActiveSeason = halfwayRecord ? (halfwayRecord.season || 1) : (firstRecord.season || 1);

      const watchedEpNumbers = new Set();
      for (const rec of records) {
        if (rec.season === currentActiveSeason && (rec.completed || rec.progressPercent >= 85)) {
          watchedEpNumbers.add(rec.episode);
        }
      }

      let targetEp = 1;
      let isCurrentEpHalfway = false;
      let currentEpTime = 0;
      let currentRecordForDisplay = firstRecord;

      if (halfwayRecord && halfwayRecord.season === currentActiveSeason) {
        targetEp = halfwayRecord.episode || 1;
        isCurrentEpHalfway = true;
        currentEpTime = halfwayRecord.currentTime || 0;
        currentRecordForDisplay = halfwayRecord;
      } else {
        const maxPossibleEp = records.length + 50;
        while (watchedEpNumbers.has(targetEp) && targetEp <= maxPossibleEp) {
          targetEp++;
        }
        const currentInProg = records.find(r => r.season === currentActiveSeason && r.episode === targetEp);
        if (currentInProg && !currentInProg.completed && currentInProg.currentTime > 0) {
          isCurrentEpHalfway = true;
          currentEpTime = currentInProg.currentTime;
          currentRecordForDisplay = currentInProg;
        } else {
          currentEpTime = (watchedEpNumbers.size > 0 ? 0 : firstRecord.currentTime) || 0;
        }
      }

      const epDuration = (currentRecordForDisplay.duration) || 3000;
      const remStr = formatRemainingTime(currentEpTime, epDuration);

      // Check if series/season is completely finished
      const isSeriesEnded = firstRecord.status === 'Ended' || firstRecord.status === 'Canceled';
      const seasonInfo = Array.isArray(firstRecord.seasons) 
        ? firstRecord.seasons.find(s => s.season_number === currentActiveSeason) 
        : null;
      const seasonEpCount = seasonInfo?.episode_count || firstRecord.season_episodes_count;

      if (seasonEpCount && targetEp > seasonEpCount) {
        const totalSeasons = firstRecord.number_of_seasons || (Array.isArray(firstRecord.seasons) ? firstRecord.seasons.filter(s => s.season_number > 0).length : 1);
        if (currentActiveSeason < totalSeasons) {
          currentActiveSeason++;
          targetEp = 1;
        } else if (isSeriesEnded && !isCurrentEpHalfway) {
          continue;
        }
      } else if (isSeriesEnded && firstRecord.number_of_episodes && watchedEpNumbers.size >= firstRecord.number_of_episodes && !isCurrentEpHalfway) {
        continue;
      }

      const prefix = isAnime ? 'Anime Dizisi • ' : '';
      let subtitle = '';
      if (isCurrentEpHalfway && currentEpTime > 0) {
        subtitle = `${prefix}S${currentActiveSeason} B${targetEp} • Kaldığın: ${formatSecondsToTime(currentEpTime)} • ${remStr}`;
      } else if (watchedEpNumbers.size > 0 || targetEp > 1) {
        subtitle = `${prefix}S${currentActiveSeason} B${targetEp} • Sıradaki Bölüm`;
      } else if (firstRecord.currentTime > 0) {
        subtitle = `${prefix}S${currentActiveSeason} B${firstRecord.episode || 1} • Kaldığın: ${formatSecondsToTime(firstRecord.currentTime)}`;
      } else {
        subtitle = `${prefix}S${currentActiveSeason} B${targetEp} • Sıradaki Bölüm`;
      }

      inProgressList.push({
        ...firstRecord,
        ...currentRecordForDisplay,
        type: isAnime ? 'anime' : 'tv',
        isAnime: isAnime,
        isSeries: true,
        season: currentActiveSeason,
        episode: targetEp,
        currentTime: isCurrentEpHalfway ? currentEpTime : (watchedEpNumbers.size > 0 ? 0 : firstRecord.currentTime),
        subtitle
      });
    }
  }

  inProgressList.sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
  _cachedContinueWatching = inProgressList;
  return _cachedContinueWatching;
}

export function getCompletedWatchList() {
  if (_cachedCompletedList) return _cachedCompletedList;
  const history = getWatchHistory();
  const seriesMap = new Map();

  for (const item of history) {
    const id = item.id;
    if (!seriesMap.has(id)) {
      seriesMap.set(id, []);
    }
    seriesMap.get(id).push(item);
  }

  const completedList = [];

  for (const [id, records] of seriesMap.entries()) {
    records.sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
    const firstRecord = records[0];
    const isAnime = Boolean(firstRecord.isAnime || firstRecord.type === 'anime' || isRegisteredAnimeId(firstRecord.id) || isAnimeRecord(firstRecord));
    if (isAnime) registerAnimeId(firstRecord.id);
    const isMovie = isMovieRecord(firstRecord);

    if (isMovie) {
      const isCompleted = firstRecord.completed || firstRecord.progressPercent >= 90;
      if (isCompleted) {
        completedList.push({
          ...firstRecord,
          type: isAnime ? 'anime' : 'movie',
          isAnime: isAnime,
          isSeries: false,
          completed: true,
          subtitle: isAnime ? '✓ Anime Filmi İzlendi' : '✓ Film İzlendi'
        });
      }
    } else {
      const allCompleted = records.every(r => r.completed || r.progressPercent >= 85);
      if (allCompleted && records.length > 0) {
        completedList.push({
          ...firstRecord,
          type: isAnime ? 'anime' : 'tv',
          isAnime: isAnime,
          isSeries: true,
          completed: true,
          subtitle: isAnime ? `✓ ${records.length} Bölüm Anime İzlendi` : `✓ ${records.length} Bölüm İzlendi`
        });
      }
    }
  }

  completedList.sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
  _cachedCompletedList = completedList;
  return _cachedCompletedList;
}

export function getGroupedWatchHistory() {
  if (_cachedGroupedHistory) return _cachedGroupedHistory;
  const history = getWatchHistory();
  const seriesMap = new Map();

  for (const item of history) {
    const id = item.id;
    if (!seriesMap.has(id)) {
      seriesMap.set(id, []);
    }
    seriesMap.get(id).push(item);
  }

  const grouped = [];
  for (const [id, records] of seriesMap.entries()) {
    records.sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
    const latest = records[0];
    const isAnime = Boolean(latest.isAnime || latest.type === 'anime' || isRegisteredAnimeId(latest.id) || isAnimeRecord(latest));
    if (isAnime) registerAnimeId(latest.id);
    const isMovie = isMovieRecord(latest);
    const resolvedType = isAnime ? 'anime' : (isMovie ? 'movie' : 'tv');

    if (isMovie) {
      const badgePrefix = isAnime ? 'Anime Filmi • ' : '';
      grouped.push({
        ...latest,
        type: resolvedType,
        isAnime: isAnime,
        isSeries: false,
        subtitle: latest.completed ? `✓ ${badgePrefix}İzlendi` : (latest.progressPercent > 0 ? `${badgePrefix}%${latest.progressPercent} İzlendi` : badgePrefix.replace(' • ', ''))
      });
    } else {
      const watchedCount = records.filter(r => r.completed || r.progressPercent >= 85).length;
      const badgePrefix = isAnime ? 'Anime Dizisi • ' : '';
      grouped.push({
        ...latest,
        type: resolvedType,
        isAnime: isAnime,
        isSeries: true,
        subtitle: watchedCount > 0 ? `${badgePrefix}${watchedCount} Bölüm İzlendi` : `${badgePrefix}S${latest.season || 1} B${latest.episode || 1}`
      });
    }
  }

  grouped.sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
  _cachedGroupedHistory = grouped;
  return _cachedGroupedHistory;
}

export function getUnifiedContinueWatching() {
  return getContinueWatchingList();
}

/* ==========================================================================
   Favorites & Watchlist Management & Auto-Normalization
   ========================================================================== */

export function normalizeStoredItem(item) {
  if (!item) return item;
  let type = item.type;
  const isAnime = Boolean(item.isAnime || item.type === 'anime' || isRegisteredAnimeId(item.id) || isAnimeRecord(item));
  
  if (isAnime) {
    type = 'anime';
    if (item.id) registerAnimeId(item.id);
  } else if (!type || type === 'movie') {
    if (
      item.isSeries ||
      item.first_air_date ||
      item.media_type === 'tv' ||
      item.number_of_seasons ||
      item.episodesCount ||
      (!item.title && item.name)
    ) {
      type = 'tv';
    } else {
      type = type || 'movie';
    }
  }

  const isSeries = Boolean(
    item.isSeries !== undefined
      ? item.isSeries
      : (type === 'tv' || item.first_air_date || item.number_of_seasons || item.episodesCount || (item.season && item.season > 1) || (item.episode && item.episode > 1))
  );

  const poster = cleanImagePath(item.poster_path || item.posterPath || item.poster || '');
  const backdrop = cleanImagePath(item.backdrop_path || item.backdropPath || item.backdrop || '');
  return {
    ...item,
    type,
    isAnime,
    isSeries,
    poster_path: poster,
    posterPath: poster,
    backdrop_path: backdrop,
    backdropPath: backdrop
  };
}

export function getFavorites() {
  if (_favoritesCache) return _favoritesCache;
  const favs = getLocalItem(STORAGE_KEYS.FAVORITES, []);
  _favoritesCache = favs.map(normalizeStoredItem);
  _favoritesSet = new Set(_favoritesCache.map(f => String(f.id)));
  return _favoritesCache;
}

export function isFavorite(id) {
  if (!id) return false;
  if (!_favoritesSet) getFavorites();
  return _favoritesSet.has(String(id));
}

export function toggleFavorite(media) {
  if (!media || !media.id) return false;
  let favs = getFavorites();
  const index = favs.findIndex(item => item.id == media.id);
  let added = false;

  if (index >= 0) {
    favs.splice(index, 1);
  } else {
    const isAnAnime = Boolean(
      media.isAnime ||
      media.type === 'anime' ||
      isRegisteredAnimeId(media.id) ||
      isAnimeRecord(media)
    );
    if (isAnAnime) registerAnimeId(media.id);

    let resolvedType = isAnAnime ? 'anime' : media.type;
    if (!resolvedType) {
      resolvedType = (media.first_air_date || media.media_type === 'tv' || media.number_of_seasons || (!media.title && media.name)) ? 'tv' : 'movie';
    }
    const poster = media.poster_path || media.posterPath || media.poster || '';
    const backdrop = media.backdrop_path || media.backdropPath || media.backdrop || '';

    favs.unshift({
      id: media.id,
      title: media.title || media.name || 'İsimsiz',
      poster_path: poster,
      posterPath: poster,
      backdrop_path: backdrop,
      backdropPath: backdrop,
      vote_average: media.vote_average || media.voteAverage || 8.0,
      release_date: media.release_date || media.first_air_date || '',
      first_air_date: media.first_air_date || '',
      genre_ids: media.genre_ids || (Array.isArray(media.genres) ? media.genres.map(g => (typeof g === 'object' ? g.id : g)) : []),
      genres: media.genres || [],
      original_language: media.original_language || '',
      origin_country: media.origin_country || [],
      isAnime: isAnAnime,
      type: resolvedType,
      addedAt: Date.now()
    });
    added = true;
  }

  _favoritesCache = favs;
  _favoritesSet = new Set(favs.map(f => String(f.id)));
  setLocalItem(STORAGE_KEYS.FAVORITES, favs);
  return added;
}

export function removeFavorite(id) {
  let favs = getFavorites();
  favs = favs.filter(item => item.id != id);
  _favoritesCache = favs;
  _favoritesSet = new Set(favs.map(f => String(f.id)));
  setLocalItem(STORAGE_KEYS.FAVORITES, favs);
  return favs;
}

export function clearFavorites() {
  _favoritesCache = [];
  _favoritesSet = new Set();
  setLocalItem(STORAGE_KEYS.FAVORITES, []);
}

export function getWatchlist() {
  if (_watchlistCache) return _watchlistCache;
  const list = getLocalItem(STORAGE_KEYS.WATCHLIST, []);
  _watchlistCache = list.map(normalizeStoredItem);
  _watchlistSet = new Set(_watchlistCache.map(w => String(w.id)));
  return _watchlistCache;
}

export function isWatchlist(id) {
  if (!id) return false;
  if (!_watchlistSet) getWatchlist();
  return _watchlistSet.has(String(id));
}

export function toggleWatchlist(media) {
  if (!media || !media.id) return false;
  let list = getWatchlist();
  const index = list.findIndex(item => item.id == media.id);
  let added = false;

  if (index >= 0) {
    list.splice(index, 1);
  } else {
    const isAnAnime = Boolean(
      media.isAnime ||
      media.type === 'anime' ||
      isRegisteredAnimeId(media.id) ||
      isAnimeRecord(media)
    );
    if (isAnAnime) registerAnimeId(media.id);

    let resolvedType = isAnAnime ? 'anime' : media.type;
    if (!resolvedType) {
      resolvedType = (media.first_air_date || media.media_type === 'tv' || media.number_of_seasons || (!media.title && media.name)) ? 'tv' : 'movie';
    }
    const poster = media.poster_path || media.posterPath || media.poster || '';
    const backdrop = media.backdrop_path || media.backdropPath || media.backdrop || '';

    list.unshift({
      id: media.id,
      title: media.title || media.name || 'İsimsiz',
      poster_path: poster,
      posterPath: poster,
      backdrop_path: backdrop,
      backdropPath: backdrop,
      vote_average: media.vote_average || media.voteAverage || 8.0,
      release_date: media.release_date || media.first_air_date || '',
      first_air_date: media.first_air_date || '',
      genre_ids: media.genre_ids || (Array.isArray(media.genres) ? media.genres.map(g => (typeof g === 'object' ? g.id : g)) : []),
      genres: media.genres || [],
      original_language: media.original_language || '',
      origin_country: media.origin_country || [],
      isAnime: isAnAnime,
      type: resolvedType,
      addedAt: Date.now()
    });
    added = true;
  }

  setLocalItem(STORAGE_KEYS.WATCHLIST, list);
  return added;
}


export function removeWatchlist(id) {
  let list = getWatchlist();
  list = list.filter(item => item.id != id);
  setLocalItem(STORAGE_KEYS.WATCHLIST, list);
  return list;
}

export function clearWatchlist() {
  _watchlistCache = [];
  _watchlistSet = new Set();
  setLocalItem(STORAGE_KEYS.WATCHLIST, []);
}

export function clearAllWatchHistory() {
  _watchHistoryCache = [];
  _progressMapCache = new Map();
  _seriesLatestMapCache = new Map();
  invalidateDerivedHistoryCaches();
  setLocalItem(STORAGE_KEYS.WATCH_HISTORY, []);
}

export function removeEpisodeFromHistory(id, season = 1, episode = 1) {
  return removeWatchHistoryItem(id, season, episode);
}

/* ==========================================================================
   User Settings Management
   ========================================================================== */

export function getUserSettings() {
  if (_userSettingsCache) return _userSettingsCache;
  _userSettingsCache = getLocalItem(STORAGE_KEYS.USER_SETTINGS, {
    autoplayNext: true,
    preferredResolution: '1080p',
    theme: 'dark',
    subtitlesEnabled: true,
    cardLayout: 'portrait',
    hoverPreviewsEnabled: true,
    trailersEnabled: true
  });
  return _userSettingsCache;
}

export function saveUserSettings(settings) {
  const current = getUserSettings();
  _userSettingsCache = { ...current, ...settings };
  setLocalItem(STORAGE_KEYS.USER_SETTINGS, _userSettingsCache);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cinepulse_settings_changed', {
      detail: _userSettingsCache
    }));
  }
}

/* ==========================================================================
   JSON Export & Import (Backup & Restore)
   ========================================================================== */

export function exportDataAsJSON() {
  const history = getLocalItem(STORAGE_KEYS.WATCH_HISTORY, []);
  const favs = getLocalItem(STORAGE_KEYS.FAVORITES, []);
  const watch = getLocalItem(STORAGE_KEYS.WATCHLIST, []);
  const settings = getLocalItem(STORAGE_KEYS.USER_SETTINGS, {});

  const exportPayload = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    appName: 'CinePulse Studio',
    watchHistory: history,
    favorites: favs,
    watchlist: watch,
    userSettings: settings,
    data: {
      watchHistory: history,
      favorites: favs,
      watchlist: watch,
      userSettings: settings
    }
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cinepulse_yedek_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}

export function importDataFromJSON(jsonInput, mode = 'merge') {
  try {
    let parsed = null;
    if (typeof jsonInput === 'string') {
      parsed = JSON.parse(jsonInput.trim());
    } else if (typeof jsonInput === 'object' && jsonInput !== null) {
      parsed = jsonInput;
    }

    if (!parsed) {
      throw new Error('Geçersiz veya boş yedek dosyası.');
    }

    let incomingHistory = [];
    let incomingFavs = [];
    let incomingWatchlist = [];
    let incomingSettings = {};

    if (Array.isArray(parsed)) {
      incomingHistory = parsed;
    } else if (typeof parsed === 'object') {
      incomingHistory = parsed.watchHistory || parsed.data?.watchHistory || parsed.sineflix_watch_history_v1 || parsed.history || [];
      incomingFavs = parsed.favorites || parsed.data?.favorites || parsed.sineflix_favorites_v1 || [];
      incomingWatchlist = parsed.watchlist || parsed.data?.watchlist || parsed.sineflix_watchlist_v1 || [];
      incomingSettings = parsed.userSettings || parsed.data?.userSettings || parsed.sineflix_user_settings_v1 || {};
    }

    if (!Array.isArray(incomingHistory)) incomingHistory = [];
    if (!Array.isArray(incomingFavs)) incomingFavs = [];
    if (!Array.isArray(incomingWatchlist)) incomingWatchlist = [];

    if (mode === 'replace') {
      setLocalItem(STORAGE_KEYS.WATCH_HISTORY, incomingHistory);
      setLocalItem(STORAGE_KEYS.FAVORITES, incomingFavs);
      setLocalItem(STORAGE_KEYS.WATCHLIST, incomingWatchlist);
      if (incomingSettings && typeof incomingSettings === 'object') {
        setLocalItem(STORAGE_KEYS.USER_SETTINGS, incomingSettings);
      }
    } else {
      // Merge mode
      const existingHistory = getLocalItem(STORAGE_KEYS.WATCH_HISTORY, []);
      const historyMap = new Map();

      // Load existing
      existingHistory.forEach(item => {
        const key = `${item.id}_${item.season || 1}_${item.episode || 1}`;
        historyMap.set(key, item);
      });

      // Merge incoming
      incomingHistory.forEach(item => {
        const key = `${item.id}_${item.season || 1}_${item.episode || 1}`;
        if (!historyMap.has(key)) {
          historyMap.set(key, item);
        } else {
          const existing = historyMap.get(key);
          // Keep the one with latest timestamp or completed status
          if ((item.lastWatchedAt || 0) >= (existing.lastWatchedAt || 0) || item.completed) {
            historyMap.set(key, { ...existing, ...item });
          }
        }
      });

      const mergedHistory = Array.from(historyMap.values()).sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
      setLocalItem(STORAGE_KEYS.WATCH_HISTORY, mergedHistory);

      // Merge Favorites
      const existingFavs = getLocalItem(STORAGE_KEYS.FAVORITES, []);
      const favsMap = new Map();
      existingFavs.forEach(f => favsMap.set(String(f.id), f));
      incomingFavs.forEach(f => {
        if (!favsMap.has(String(f.id))) favsMap.set(String(f.id), f);
      });
      setLocalItem(STORAGE_KEYS.FAVORITES, Array.from(favsMap.values()));

      // Merge Watchlist
      const existingWatch = getLocalItem(STORAGE_KEYS.WATCHLIST, []);
      const watchMap = new Map();
      existingWatch.forEach(w => watchMap.set(String(w.id), w));
      incomingWatchlist.forEach(w => {
        if (!watchMap.has(String(w.id))) watchMap.set(String(w.id), w);
      });
      setLocalItem(STORAGE_KEYS.WATCHLIST, Array.from(watchMap.values()));

      // Merge Settings
      const existingSettings = getLocalItem(STORAGE_KEYS.USER_SETTINGS, {});
      setLocalItem(STORAGE_KEYS.USER_SETTINGS, { ...existingSettings, ...incomingSettings });
    }

    // Fire all legacy & active synchronization events
    window.dispatchEvent(new CustomEvent('sineflix_data_changed', { detail: { action: 'import' } }));
    window.dispatchEvent(new CustomEvent('cinepulse_data_changed', { detail: { action: 'import' } }));
    window.dispatchEvent(new CustomEvent('cinepulse_data_changed', { detail: { action: 'import' } }));

    return {
      success: true,
      countHistory: incomingHistory.length,
      countFavs: incomingFavs.length,
      countWatchlist: incomingWatchlist.length,
      message: `${incomingHistory.length} izleme kaydı ve ${incomingFavs.length} favori başarıyla aktarıldı.`
    };
  } catch (err) {
    console.error('Import error:', err);
    return {
      success: false,
      error: err.message,
      message: 'Yedek dosyası okunamadı: ' + err.message
    };
  }
}

export function getStorageStats() {
  const history = getWatchHistory();
  const favorites = getFavorites();
  const watchlist = getWatchlist();
  const rawData = JSON.stringify({ history, favorites, watchlist });
  const bytes = new Blob([rawData]).size;
  const kb = (bytes / 1024).toFixed(1);

  return {
    historyCount: history.length,
    favoritesCount: favorites.length,
    watchlistCount: watchlist.length,
    bytes,
    kb
  };
}

export function clearAllData() {
  clearStorageCache();
  try {
    idbSet(getNamespacedKey(STORAGE_KEYS.WATCH_HISTORY), []);
    idbSet(getNamespacedKey(STORAGE_KEYS.FAVORITES), []);
    idbSet(getNamespacedKey(STORAGE_KEYS.WATCHLIST), []);
  } catch (_) {}
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem(getNamespacedKey(STORAGE_KEYS.WATCH_HISTORY));
    localStorage.removeItem(getNamespacedKey(STORAGE_KEYS.FAVORITES));
    localStorage.removeItem(getNamespacedKey(STORAGE_KEYS.WATCHLIST));
  }
  window.dispatchEvent(new CustomEvent('sineflix_data_changed', { detail: { cleared: true } }));
}

/**
 * Auto-clean bloated localStorage entries (Brave / Chrome cache overflow protection)
 */
export function pruneOversizedStorage() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    // 1. Remove huge stale EPG caches from persistent localStorage (now using sessionStorage)
    localStorage.removeItem('cinepulse_epg_live_cache');
    localStorage.removeItem('sineflix_epg_cache_v2');

    // 2. Prune old home rail cache keys if stored in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('cinepulse_home_fast_') || key.startsWith('sineflix_home_fast_'))) {
        localStorage.removeItem(key);
      }
    }

    // 3. Cap notifications list to 25
    const notifRaw = localStorage.getItem('sineflix_notifications_v1');
    if (notifRaw) {
      try {
        const notifs = JSON.parse(notifRaw);
        if (Array.isArray(notifs) && notifs.length > 25) {
          localStorage.setItem('sineflix_notifications_v1', JSON.stringify(notifs.slice(0, 25)));
        }
      } catch (_) {}
    }
  } catch (_) {}
}

// Auto prune on module initialization
pruneOversizedStorage();
