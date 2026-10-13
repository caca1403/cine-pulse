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

const PLUGINS_KEY = 'cinepulse_plugins_v2';

// Her eklentinin anonim adi. Kaynak adlari arayuzde gosterilmez.
// Silinen anahtarlar (kodları kaldırıldı): dzl, wtz, hdfb, dizibox, k666.
const ALIASES = {
  hdfc: 'Orion', slc: 'Lyra', fhdf: 'Sirius',
  fxs: 'Vela', dzs: 'Atlas', snx: 'Nova',
  dyu: 'Echo', dzb: 'Nero', tvr: 'Polaris', jet: 'Nimbus',
  lookmovie: 'Halo', smashy: 'Cosmo', twoembed: 'Zenit',
  anizium: 'Aria', animecix: 'Tera', animetr: 'Kitsu', kidsvip: 'Pico',
  dramalar: 'Dora', dramadizilerim: 'Rhea', torrent: 'Hydra',
  dizi77: 'Corvus', sinemacc: 'Halcyon', vodm3u: 'Pulsar',
  czgx: 'Lumen', blgx: 'Perseus',
  // Yeni siteler — anonim kod adlariyla (site adlari arayuzde gorunmez)
  fm: 'Arcturus', dzyf: 'Regulus', vidy: 'Altair',
  hdps: 'Rigel', ksd: 'Sadr', pichive: 'Antares', vidload: 'Spica',
  vixolity: 'Almach', tauvideo: 'Nunki', pilavyer: 'Menkar',
  nxsha: 'Adhara', vidmoly: 'Zubenelgenubi', sphp: 'Alphecca',
  kwsearch: 'Mizar', filmdizi: 'Capella', rplayer: 'Denebola',
  // Not: 'ajax' anahtarı öksüzdü (öyle bir eklenti yok; ajaxSearch sitesi
  // hdfc eklentisi altında çalışır) ve 'Saiph' adını iki kez kullanıyordu.
  // Kaldırıldı; asy eklentisi 'Aquila' adını aldı.
  hdfd: 'Bellatrix', d4kh: 'Betelgeuse', vidlk: 'Toliman',
  dzp: 'Muhlif', asy: 'Aquila'
};

// id: toplayici anahtari. kinds: movie+tv / tv / movie / live disinda kisa etiket.
// (Eski `registry:` alanı kaldırıldı — providerRegistry köprüleri silindi.)
// kinds: movie+tv / tv / movie / live disinda kisa etiketler.
export const PLUGIN_DEFS = [
  { id: 'hdfc', kinds: ['film', 'dizi'], desc: '1080p, dublaj ve altyazı hatları.', warn: 'Cihazın kendi ağıyla çözülür (gizli tarayıcı penceresi); bulunamazsa bu kaynak listede görünmez.' },
  // VEGA (setf) TAMAMEN KALDIRILDI: yayınladığı adresler (fastplay master.txt)
  // sunucuda 404 dönüyordu → listede görünüyor, seçilince oynamıyordu.
  // `kapali: true` satırı bile menüde "açılabilir ölü girdi" bırakıyordu;
  // katalog satırı, ALIASES kaydı ve site bağları söküldü.
  { id: 'slc', kinds: ['film', 'dizi'], desc: '1080p HLS, film ve dizi.', warn: 'Duvar arkası hat; gömülü oynatılır, bazı ağlarda takılabilir.' },
  { id: 'fhdf', kinds: ['film'], desc: 'HLS hatları, film odaklı.', warn: 'Erişimi engelli ağlarda açılmaz; alternatif dene.' },
  { id: 'fxs', kinds: ['film', 'dizi'], desc: 'İki farklı hat, 1080p, film ve dizi.', warn: 'İmza süresi dolarsa hat yenilenir; listeyi tazele.' },
  { id: 'dzs', kinds: ['film', 'dizi'], desc: 'Çift sesli HLS, hızlı ana yayın.' },
  // SINEWIX: panel artık HER istekte taze imza istiyor (SIGNED_REQUEST_REJECTED).
  // Elimizdeki sabit hash256/imza çifti (Patron eklentisindekiyle birebir aynı)
  // 401 dönüyor; imza sırrı uygulamanın içinde. Doğru imza bulunana kadar
  // liste kirlenmesin diye varsayılan kapalı — menüden açılabilir.
  { id: 'snx', kapali: true, kinds: ['film', 'dizi'], desc: 'Panel imza doğrulamasını değiştirdi; şu an yanıt vermiyor.', warn: 'Menüden açılabilir; sağlam alternatifler çalışmaya devam eder.' },
  { id: 'dyu', kinds: ['dizi'], desc: 'Hızlı CDN, 1080p HLS.' },
  { id: 'dzb', kinds: ['film', 'dizi'], desc: 'Orijinal oynatıcılı 1080p hat.' },
  { id: 'tvr', kinds: ['film', 'dizi'], desc: 'VIP 1080p HLS; film, dizi ve canlı kanallar.', warn: 'Adres ve sürüm bilgisi sağlayıcının kendi ayar servisinden okunur; ağ engelliyse boş dönebilir.' },
  { id: 'jet', kinds: ['film', 'dizi'], desc: 'Özel oynatıcı hatları, film ve dizi.' },
  { id: 'lookmovie', kinds: ['film', 'dizi'], desc: 'Global temiz oynatıcı.' },
  { id: 'smashy', kinds: ['film', 'dizi'], desc: 'Global gömülü oynatıcı.' },
  { id: 'anizium', kinds: ['anime'], desc: '4K/1080p anime akışları.' },
  { id: 'animecix', kinds: ['anime'], desc: 'Anime ve çizgi dizi kataloğu.' },
  { id: 'animetr', kinds: ['anime'], desc: 'Anime alternatif katalog.' },
  { id: 'kidsvip', kinds: ['cocuk'], desc: 'Çizgi film doğrudan akış.' },
  { id: 'czgx', kinds: ['cocuk', 'film', 'dizi'], desc: 'Çizgi film ve aile filmleri, doğrudan HLS.' },
  // Belgesel tür anahtarı: `belgesel` (inventory.js TYPE haritasında movie↔tv
  // çiftine açılır; arayüzde tür etiketi olarak gösterilir).
  { id: 'blgx', kinds: ['belgesel', 'dizi'], desc: 'Belgesel arşivi; doğrudan mp4 hat, gömülü oynatıcı listelenmez.' },
  { id: 'dramalar', kinds: ['kisa-dizi'], desc: 'Kısa drama doğrudan CDN.' },
  { id: 'dramadizilerim', kinds: ['kisa-dizi'], desc: 'Kısa dizi başlıkları, dört ayrı hat.' },
  { id: 'torrent', kinds: ['film', 'dizi'], desc: 'P2P eşler arası akış.', warn: 'Başlaması eş sayısına bağlıdır; bulamazsa bekler.' },
  { id: 'dizi77', kinds: ['dizi'], desc: 'Bölüm bazlı dizi kataloğu, gömülü oynatıcı.' },
  { id: 'sinemacc', kinds: ['film'], desc: 'Film kataloğu, gömülü oynatıcı.' },
  { id: 'vodm3u', kinds: ['film'], desc: 'Toplu M3U kataloğu, doğrudan dosya.', warn: 'Bağımlı olduğu dış liste kataloglarında bağlantıların bir kısmı silinmiş; hat açmazsa sıradakine geçilir. Çocuk ağırlıklı bir katalogdur, her film için sonuç vermez.' },
  // Coklu site surucusunden gelen kaynaklar. Her biri menuden acilip
  // kapatilabilir; kapaliyken aggregator hic sorgulamaz.
  { id: 'fm', kinds: ['film', 'dizi'], desc: 'Alan adini izler; IMDb ile arar.' },
  { id: 'dzyf', kinds: ['film', 'dizi'], desc: 'Dizi ve film; JSON arama ucu.' },
  { id: 'hdfd', kinds: ['film', 'dizi'], desc: 'HLS hatlari; bazi hatlar engelli aglarda acilmaz.' },
  { id: 'd4kh', kinds: ['film', 'dizi'], desc: 'Yuksek cozunurluk odakli katalog.' },
  // Arama gerektirmeyen kaynaklar (adres TMDB kimliginden uretilir)
  { id: 'twoembed', kinds: ['film', 'dizi'], desc: 'Gomulu adres dogrudan uretilir; site adresi degisirse otomatik.' },
  { id: 'vidlk', kinds: ['film', 'dizi'], desc: 'Sifreli kimlikle yayin ucu; iki adimli istek.' },
  { id: 'dzp', kinds: ['film', 'dizi'], desc: 'Ajax arama ucu; bolum sayfalari cozulur.' },
  { id: 'asy', kinds: ['anime'], desc: 'Anime katalogu; sezon/bolum sayfalari cozulur.' }
];

function aliasOf(def) {
  if (ALIASES[def.id]) return ALIASES[def.id];
  try {
    const fam = SOURCE_FAMILIES.find((f) => f.prefixes.some((p) => p.startsWith(`${def.id}_`) || def.id.startsWith(p.replace(/_$/, ''))));
    // Eklenti kimligi ham basilmaz: aile bulunamazsa tarafsiz yutucu adi
    // ('Nexus') dondurulur; kullanicidaki id sizintisi 'Nexus' ile kapanir.
    if (fam && fam.alias) return fam.alias;
  } catch (_) {}
  return 'Nexus';
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
    // `kapali: true` varsayılanı: sağlayıcı yanıt vermiyorsa liste kirlenmesin
    // (kullanıcı menüden açabilir).
    state[def.id] = stored && typeof stored[def.id] === 'boolean' ? stored[def.id] : def.kapali !== true;
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
