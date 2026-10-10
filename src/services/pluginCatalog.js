/* ==========================================================================
   CinePulse Studio - Eklenti Katalogu (tek doğruluk kaynağı)
   Tüm sayfalardaki "Eklentiler" yönetimi buradan beslenir; toplayıcı
   (aggregator) taramaya buradan bakar. Kapalı eklenti taranmaz, listede
   görünmez. Durum: web/APK'da localStorage, masaüstünde userData'da da
   saklanır (kopru varsa).
   Kullanıcıya yalnızca anonim ad (Orion, Luna, Vela...) gösterilir;
   gerçek sağlayıcı adları arayüzde hiç görünmez.
   ========================================================================== */

import { SOURCE_FAMILIES } from './sourceLabels.js';

const PLUGINS_KEY = 'cinepulse_plugins_v1';

// Her eklentinin anonim adi. Kaynak adlari arayuzde gosterilmez.
const ALIASES = {
  hdfc: 'Orion', setf: 'Vega', slc: 'Lyra', dzl: 'Astra', fhdf: 'Sirius',
  wtz: 'Mira', fxs: 'Vela', dzs: 'Atlas', snx: 'Nova', szd: 'Luna',
  dyu: 'Sol', dzy: 'Echo', dzb: 'Nero', tvr: 'Polaris', jet: 'Nimbus',
  hdfb: 'Elara', lookmovie: 'Halo', smashy: 'Cosmo', twoembed: 'Zenit',
  anizium: 'Aria', animecix: 'Tera', animetr: 'Kitsu', kidsvip: 'Pico',
  dramalar: 'Dora', dramadizilerim: 'Rhea', torrent: 'Hydra'
};

// id: toplayici anahtari. registry: providerRegistry'deki karsiligi (varsa).
// kinds: movie+tv / tv / movie / live disinda kisa etiketler.
export const PLUGIN_DEFS = [
  { id: 'hdfc', registry: 'hdfc', kinds: ['film', 'dizi'], desc: '1080p, dublaj ve altyazı hatları.', warn: 'Sunucu IP engelli; masaüstü uygulaması ya da cihazın kendi ağı gerekir. Sitede görünmeyebilir.' },
  { id: 'setf', registry: 'setf', kinds: ['film', 'dizi'], desc: 'Özel oynatıcılar, 1080p.' },
  { id: 'slc', registry: 'slc', kinds: ['film', 'dizi'], desc: '1080p HLS, film ve dizi.', warn: 'Duvar arkası hat; gömülü oynatılır, bazı ağlarda takılabilir.' },
  { id: 'dzl', registry: 'dzl', kinds: ['dizi'], desc: '1080p HLS, dizi odaklı.', warn: 'Duvar arkası hat; gömülü oynatılır, bazı ağlarda takılabilir.' },
  { id: 'fhdf', registry: 'fhdf', kinds: ['film'], desc: 'HLS hatları, film odaklı.', warn: 'Erişimi engelli ağlarda açılmaz; alternatif dene.' },
  { id: 'wtz', registry: 'wtz', kinds: ['film'], desc: 'Çok hatlı seçenek, film odaklı.', warn: 'Bozuk hatlar otomatik elenir.' },
  { id: 'fxs', registry: 'fxs', kinds: ['film', 'dizi'], desc: 'İki farklı hat, 1080p, film ve dizi.', warn: 'İmza süresi dolarsa hat yenilenir; listeyi tazele.' },
  { id: 'dzs', kinds: ['film', 'dizi'], desc: 'Çift sesli HLS, hızlı ana yayın.' },
  { id: 'snx', kinds: ['film', 'dizi'], desc: 'Doğrudan 1080p MKV/MP4 akışı.', warn: 'MKV hatlar dönüştürülerek oynatılır, başlaması sürebilir.' },
  { id: 'szd', kinds: ['dizi'], desc: 'Dizi odaklı, 1080p.', warn: 'Doğrulama isteyebilir; Android ve masaüstünde yalnızca oynatıcı alanı açılır, web sürümünde bu kaynak listelenmez.' },
  { id: 'dyu', kinds: ['dizi'], desc: 'Hızlı CDN, 1080p HLS.' },
  { id: 'dzy', kinds: ['film', 'dizi'], desc: 'Doğrudan 1080p HLS.' },
  { id: 'dzb', kinds: ['film', 'dizi'], desc: 'Orijinal oynatıcılı 1080p hat.' },
  { id: 'tvr', kinds: ['film', 'dizi'], desc: 'VIP 1080p HLS.', warn: 'İmza 2 dakikada bir tazelenir; takılırsa kanalı değiştir.' },
  { id: 'jet', kinds: ['film', 'dizi'], desc: 'Özel oynatıcı hatları, film ve dizi.' },
  { id: 'hdfb', kinds: ['film'], desc: '1080p HLS, film odaklı.' },
  { id: 'lookmovie', kinds: ['film', 'dizi'], desc: 'Global temiz oynatıcı.' },
  { id: 'smashy', kinds: ['film', 'dizi'], desc: 'Global gömülü oynatıcı.' },
  { id: 'twoembed', kinds: ['film', 'dizi'], desc: 'Global gömülü oynatıcı.' },
  { id: 'anizium', kinds: ['anime'], desc: '4K/1080p anime akışları.' },
  { id: 'animecix', kinds: ['anime'], desc: 'Anime ve çizgi dizi kataloğu.' },
  { id: 'animetr', kinds: ['anime'], desc: 'Anime alternatif katalog.' },
  { id: 'kidsvip', kinds: ['cocuk'], desc: 'Çizgi film doğrudan akış.' },
  { id: 'dramalar', kinds: ['kisa-dizi'], desc: 'Kısa drama doğrudan CDN.' },
  { id: 'dramadizilerim', kinds: ['kisa-dizi'], desc: 'Kısa dizi başlıkları, dört ayrı hat.' },
  { id: 'torrent', kinds: ['film', 'dizi'], desc: 'P2P eşler arası akış.', warn: 'Başlaması eş sayısına bağlıdır; bulamazsa bekler.' },
];

function aliasOf(def) {
  if (ALIASES[def.id]) return ALIASES[def.id];
  try {
    const fam = SOURCE_FAMILIES.find((f) => f.prefixes.some((p) => p.startsWith(`${def.id}_`) || def.id.startsWith(p.replace(/_$/, ''))));
    if (fam && fam.alias !== 'Nexus') return fam.alias;
  } catch (_) {}
  return 'Nexus';
}

function registryProviderName(def) {
  const map = { hdfc: 'HDFilmCehennemi', setf: 'SetFilm', slc: 'SelcukFlix', dzl: 'Dizilla', fhdf: 'FullHDFilmizlesene', wtz: 'Webteizle', fxs: 'FilmEkseni' };
  return map[def.registry || def.id] || '';
}

/** Arayuzde yalnizca anonim ad gosterilir. */
export function getPluginDisplay(def) {
  return { alias: aliasOf(def), provider: aliasOf(def) };
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
