/* ==========================================================================
   CinePulse Studio - Eklenti Katalogu (tek doğruluk kaynağı)
   Tum sayfalardaki "Eklentiler" yonetimi buradan beslenir; toplayici
   (aggregator) taramaya buradan bakar. Kapali eklenti taranmaz, listede
   görünmez. Durum: web/APK'da localStorage, masaustunde userData'da da
   saklanir (kopru varsa).
   ========================================================================== */

import { SOURCE_FAMILIES } from './sourceLabels.js';

const PLUGINS_KEY = 'cinepulse_plugins_v1';

// id: toplayici anahtari. registry: providerRegistry'deki karsiligi (varsa).
// kinds: movie+tv / tv / movie / live disinda kisa etiketler.
export const PLUGIN_DEFS = [
  { id: 'hdfc', registry: 'hdfc', kinds: ['film', 'dizi'], desc: 'CloseLoad + Rapidrame 1080p, dublaj ve altyazı.', warn: 'Sunucu IP engelli; masaüstü uygulaması ya da cihazın kendi ağı gerekir. Sitede görünmeyebilir.' },
  { id: 'setf', registry: 'setf', kinds: ['film', 'dizi'], desc: 'SetPlay + FastPlay özel oynatıcılar.' },
  { id: 'slc', registry: 'slc', kinds: ['film', 'dizi'], desc: 'Pichive 1080p HLS, film + dizi.', warn: 'Pichive duvarlıdır; gömülü oynatılır, bazı ağlarda takılabilir.' },
  { id: 'dzl', registry: 'dzl', kinds: ['dizi'], desc: 'Pichive 1080p, dizi odaklı.', warn: 'Pichive duvarlıdır; gömülü oynatılır, bazı ağlarda takılabilir.' },
  { id: 'fhdf', registry: 'fhdf', kinds: ['film'], desc: 'RapidVid HLS, film odaklı.', warn: 'Erişimi engelli ağlarda açılmaz; alternatif dene.' },
  { id: 'wtz', registry: 'wtz', kinds: ['film'], desc: 'VidMoly/Filemoon/Pixel, film odaklı.', warn: 'Bozuk hatlar (Filemoon/Pixel) otomatik elenir.' },
  { id: 'fxs', registry: 'fxs', kinds: ['film', 'dizi'], desc: 'VidMoly + Eksenload, film + dizi.', warn: 'İmza süresi dolarsa hat yenilenir; listeyi tazele.' },
  { id: 'dzs', kinds: ['film', 'dizi'], desc: 'Çift sesli HLS, hızlı ana yayın.' },
  { id: 'snx', kinds: ['film', 'dizi'], desc: 'Doğrudan 1080p MKV/MP4 akışı.', warn: 'MKV hatlar dönüştürülerek oynatılır, başlaması sürebilir.' },
  { id: 'szd', kinds: ['dizi'], desc: 'VidMoly/Sibnet, dizi odaklı.', warn: 'Doğrulama isteyebilir; sayfa gömülü açılır, oynatıcıya kaydırılır.' },
  { id: 'dyu', kinds: ['dizi'], desc: 'FastCDN 1080p HLS.' },
  { id: 'dzy', kinds: ['film', 'dizi'], desc: 'Doğrudan 1080p HLS.' },
  { id: 'dzb', kinds: ['film', 'dizi'], desc: 'Orijinal oynatıcılı 1080p hat.' },
  { id: 'tvr', kinds: ['film', 'dizi'], desc: 'RecTV VIP 1080p HLS.', warn: 'İmza 2 dakikada bir tazelenir; takılırsa kanalı değiştir.' },
  { id: 'jet', kinds: ['film', 'dizi'], desc: 'FilmEkseni/JetFilm oynatıcıları.' },
  { id: 'hdfb', kinds: ['film'], desc: 'HDFilmizle 1080p HLS.' },
  { id: 'lookmovie', kinds: ['film', 'dizi'], desc: 'Global temiz oynatıcı.' },
  { id: 'smashy', kinds: ['film', 'dizi'], desc: 'Global gömülü oynatıcı.' },
  { id: 'twoembed', kinds: ['film', 'dizi'], desc: 'Global gömülü oynatıcı.' },
  { id: 'anizium', kinds: ['anime'], desc: '4K/1080p anime akışları.' },
  { id: 'animecix', kinds: ['anime'], desc: 'Anime + çizgi dizi kataloğu.' },
  { id: 'animetr', kinds: ['anime'], desc: 'Anime alternatif katalog.' },
  { id: 'kidsvip', kinds: ['cocuk'], desc: 'Çizgi film doğrudan akış.' },
  { id: 'dramalar', kinds: ['kisa-dizi'], desc: 'Kısa drama doğrudan CDN.' },
  { id: 'dramadizilerim', kinds: ['kisa-dizi'], desc: 'NetShort/FlexTV/DramaBox.' },
  { id: 'torrent', kinds: ['film', 'dizi'], desc: 'P2P eşler arası akış.', warn: 'Başlaması eş sayısına bağlıdır; bulamazsa bekler.' },
];

function aliasOf(def) {
  try {
    const fam = SOURCE_FAMILIES.find((f) => f.provider === registryProviderName(def) || f.prefixes.some((p) => p.startsWith(def.id + '_') || def.id.startsWith(p.replace(/_$/, ''))));
    if (fam && fam.alias !== 'Nexus') return fam.alias;
  } catch (_) {}
  return '';
}

function registryProviderName(def) {
  const map = { hdfc: 'HDFilmCehennemi', setf: 'SetFilm', slc: 'SelcukFlix', dzl: 'Dizilla', fhdf: 'FullHDFilmizlesene', wtz: 'Webteizle', fxs: 'FilmEkseni' };
  return map[def.registry || def.id] || '';
}

export function getPluginDisplay(def) {
  const alias = aliasOf(def);
  const provider = registryProviderName(def) || defaultProviderName(def.id);
  return { alias, provider };
}

function defaultProviderName(id) {
  const map = { dzs: 'Dizisol', snx: 'Sinewix', szd: 'SezonlukDizi', dyu: 'Diziyou', dzy: 'Diziyo', dzb: 'Dizibal', tvr: 'RecTV', jet: 'JetFilm', hdfb: 'HDFilmizle', lookmovie: 'LookMovie', smashy: 'SmashyStream', twoembed: '2Embed', anizium: 'Anizium', animecix: 'AnimeciX', animetr: 'AnimeTR', kidsvip: 'Kids VIP', dramalar: 'Dramalar', dramadizilerim: 'DramaDizilerim', torrent: 'Torrent P2P' };
  return map[id] || id;
}

function readStored() {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(PLUGINS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function writeStored(state) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(PLUGINS_KEY, JSON.stringify(state));
  } catch (_) {}
  try {
    const bridge = typeof window !== 'undefined' ? window.CinePulseDesktop : null;
    if (bridge && typeof bridge.storeSet === 'function') {
      bridge.storeSet('plugins', state)?.catch?.(() => {});
    }
  } catch (_) {}
}

let memState = null;

export function getPluginState() {
  if (memState) return { ...memState };
  const stored = readStored();
  const state = {};
  for (const def of PLUGIN_DEFS) {
    state[def.id] = stored && typeof stored[def.id] === 'boolean' ? stored[def.id] : true;
  }
  memState = state;
  // Masaustu userData'daki durum onceliklidir (yerel depodan bagimsiz profil).
  try {
    const bridge = typeof window !== 'undefined' ? window.CinePulseDesktop : null;
    if (bridge && typeof bridge.storeGet === 'function') {
      bridge.storeGet('plugins', null)?.then?.((remote) => {
        if (remote && typeof remote === 'object') {
          for (const def of PLUGIN_DEFS) {
            if (typeof remote[def.id] === 'boolean') memState[def.id] = remote[def.id];
          }
          writeStored(memState);
          try { window.dispatchEvent(new CustomEvent('cinepulse_plugins_changed')); } catch (_) {}
        }
      }).catch?.(() => {});
    }
  } catch (_) {}
  return { ...state };
}

export function isPluginEnabled(id) {
  try {
    const s = getPluginState();
    if (!(id in s)) return true;
    return s[id] !== false;
  } catch (_) {
    return true;
  }
}

export async function setPluginEnabled(id, on) {
  const state = getPluginState();
  if (!(id in state) && !PLUGIN_DEFS.some((d) => d.id === id)) return false;
  state[id] = on !== false;
  memState = state;
  writeStored(state);
  // Kayitli provider aynasi (varsa): eski anahtar da guncel tutulur.
  try {
    const def = PLUGIN_DEFS.find((d) => d.id === id);
    if (def?.registry) {
      const { setProviderEnabled } = await import('./providers/providerRegistry.js');
      await setProviderEnabled(def.registry, on !== false).catch(() => {});
    }
  } catch (_) {}
  try {
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cinepulse_plugins_changed', { detail: { id, enabled: on !== false } }));
  } catch (_) {}
  return true;
}

export function listPlugins() {
  const state = getPluginState();
  return PLUGIN_DEFS.map((def) => ({ ...def, ...getPluginDisplay(def), enabled: state[def.id] !== false }));
}

export function resetPluginCache() {
  memState = null;
}
