/* ==========================================================================
   CinePulse Studio - Master Stream Aggregator
   Fast, reliable Turkish & Global VIP streams:
   - Sinewix (Direct 1080p MKV/MP4 Stream)
   - RecTV VIP (Direct 1080p HLS Streams)
   - DiziBal / DP (AlphaStream 1080p HLS)
   - Dizisol / DS (Native HLS with Dual TR Audio)
   - Diziyo (1080p HLS)
   - Diziyou (FastCDN 1080p HLS)
   - HDFilmizle Best (1080p HLS)
   - SezonlukDizi (1080p VIP)
   - SetFilmizle (SetPlay/FastPlay 1080p, Movie+TvSeries cift tip)
   - SelcukFlix (Pichive 1080p HLS, Movie+TvSeries cift tip)
   - Dizilla (Pichive 1080p, TvSeries dizi-only)
   - Kids VIP / CizgiMax (Direct 1080p Sibnet for Cartoons & Animation)
   - AnimeciX / TürkAnime / AnimeTR (1080p Anime & Western Cartoons)
   - LookMovie VIP / 2Embed VIP / VidSrc VIP (Clean, low-ad 1080p embeds)
   ========================================================================== */

import { fetchAnimecixSources } from './animecixScraper.js';
import { fetchAnimeTrSources } from './animeTrScraper.js';
import { fetchDizisolMovieSources, fetchDizisolEpisodeSources } from './dizisolScraper.js';
// dizibalScraper SİLİNDİ: eski ölü scraper'dı; Dizibal yayınlarını bugün temiz
// sağlayıcı Nero (src/providers/nero.js) kendi çözüyor — dosya yalnız ithaldı.
import { fetchRecTvSources } from './rectvService.js';
import { getSourceFamily } from './sourceLabels.js';
import { zekaCeza, zekaKaydet } from './sourceIntelligence.js';
import { fetchKidsVipSources, fetchKidsVipMovieSources } from './kidsVipScraper.js';
import { fetchSmashyStreamSources } from './smashyStreamService.js';
import { fetchTorrentStreamSources } from './torrentStreamService.js';
import { fetchOfficialLookMovieSources } from './lookmovieScraper.js';
// NOT: eski hdfilmcehennemiScraper import'u kaldırıldı — hdfc'yi temiz Orion üretir.
import { fetchVodSources, loadVodSource } from './vodM3uSources.js';
import { fetchDizi77Sources } from './dizi77Scraper.js';
import { siteListesi } from './siteProviders.js';

// Coklu site surucusu: her site kendi PLUGIN_DEFS anahtariyla acilip kapaliyor.
// Arama ucu siteye gore degisiyor (GET/POST/JSON) ama cerceve ayni.
const SITE_SURUCULERI = [
  { anahtar: 'hdfc', site: 'hdfilmcehennemi' },
  { anahtar: 'slc', site: 'selcukflix' },
  // { anahtar: 'setf', site: 'setfilm' } — SİLİNDİ: yayın adresleri sunucuda
  // 404 (fastplay master.txt) → ölü kaynak; katalogdan da tamamen söküldü.
  // { anahtar: 'k666', site: 'film666' } — SİLİNDİ: adres zinciri ölü/BTK engelli.
  { anahtar: 'fxs', site: 'filmekseni' },
  // Çözülmüş sağlayıcılardan çıkan aile sunucuları (hepsi aynı API
  // kalıbını kullanıyor: /api/search?q=). Alan adları değişince
  // siteProviders.js içindeki yedek adres güncellenir.
  { anahtar: 'vidy', site: 'vidy' },
  { anahtar: 'hdps', site: 'hdplayersystem' },
  { anahtar: 'ksd', site: 'ksdpictures' },
  { anahtar: 'pichive', site: 'pichive' },
  { anahtar: 'vidload', site: 'vidload' },
  { anahtar: 'vixolity', site: 'vixolity' },
  { anahtar: 'tauvideo', site: 'tauvideo' },
  { anahtar: 'pilavyer', site: 'pilavyerplay' },
  { anahtar: 'nxsha', site: 'nxsha' },
  { anahtar: 'vidmoly', site: 'vidmolyNet' },
  { anahtar: 'sphp', site: 'searchPhp' },
  { anahtar: 'kwsearch', site: 'keywordSearch' },
  { anahtar: 'ajax', site: 'ajaxSearch' },
  { anahtar: 'filmdizi', site: 'filmDiziList' },
  { anahtar: 'rplayer', site: 'rplayerVideo' },
  // Patron eklentilerinden kalanlar — k666 SİLİNDİ (ölü/BTK zinciri, bkz. üst blok).
  { anahtar: 'dzyf', site: 'dizify' },
  // HDFilmDelisi ve 4KHD — Nuvio'da aktif, bizde kayitli degildi
  { anahtar: 'hdfd', site: 'hdfilmdelisi' },
  { anahtar: 'd4kh', site: 'dortkhd' },
  // Kalan Patron eklentileri — daha once hic bagli degildi
  { anahtar: 'twoembed', site: 'zenit' },
  { anahtar: 'dzp', site: 'dizipal' },
  { anahtar: 'asy', site: 'asyaanimeleri' },
  { anahtar: 'vidlk', site: 'vidlink' }
];

// Film M3U kataloglarının kaynak kimlikleri (tek tek yüklenir, boş olanlar atlanır).
const VOD_M3U_IDS = ['jetfilm', 'filmmodu', 'filmmakinesi', 'fhdfi'];
import { fetchAniziumSources } from './aniziumScraper.js';
import { fetchDramaDizilerimEpisodeSources } from './dramaDizilerimScraper.js';
import { fetchDramalarEpisodeSources } from './dramalarScraper.js';
import { isPluginEnabled, PLUGIN_DEFS, getPluginDisplay } from './pluginCatalog.js';

/** Eklenti kimliğinden anonim aile adı — öğrenme beyninin anahtarı.
 *  Gerçek site adı hiçbir yerde saklanmaz, sadece yıldız kodu kullanılır. */
function aileAdi(kimlik) {
  const def = PLUGIN_DEFS.find((d) => d.id === kimlik || d.registry === kimlik);
  try { return def ? getPluginDisplay(def).alias : String(kimlik || ''); } catch (_) { return String(kimlik || ''); }
}
import { isNativeCapacitor } from './apiOrigin.js';
import { prepareAndroidSources } from './providerRuntime/playback.js';
// TEMİZ KAYIT DEFTERİ — Orion/Vega/Aria/Tera/Atlas/Corvus. Batch'ten
// bağımsız yayımlanır: hangi dal çalışırsa çalışsın listede garantili olur.
import { kayitliKimlikler, saglayiciYukle } from '../providers/index.js';
import { recordProviderEvent } from './providerRuntime/diagnostics.js';

/** Temiz sağlayıcısı olan id'ler. Aynı siteyi hem temiz sağlayıcı hem de eski
 *  site sürücüsü / scraper'ı ile İKİ KEZ sorgulamamak için kullanılır
 *  (inventory.js'teki "tek kayıt defteri" kuralının masaüstü karşılığı). */
const TEMIZ_IDLER = new Set(kayitliKimlikler());

/** Basit eşzamanlılık sınırı — masaüstünde tek gizli motor ve tek hat var,
 *  18 sağlayıcıyı birden salmak listeyi yavaşlatıyordu. */
function siraliCalistir(limit) {
  let aktif = 0;
  const kuyruk = [];
  const bitir = () => {
    aktif = Math.max(0, aktif - 1);
    const sonraki = kuyruk.shift();
    if (sonraki) sonraki();
  };
  return (is) => new Promise((coz, reddet) => {
    const baslat = () => {
      aktif += 1;
      Promise.resolve()
        .then(() => is())
        .then((sonuc) => { coz(sonuc); bitir(); }, (hata) => { reddet(hata); bitir(); });
    };
    if (aktif < limit) baslat();
    else kuyruk.push(baslat);
  });
}

/** Masaüstü/web dalı için TEK temiz sağlayıcı görevi (APK dalındaki
 *  temizGorevler'in karşılığı). `mediaType` dışarıdan gelir — APK bloğundaki
 *  aynı adlı değişken bu dalda görünmez (ReferenceError tuzağı). */
async function temizSaglayiciTara({ sirasi, id, mediaType, isAnime, targetTitle, originalTitle, candidateTitles, targetYear, tmdbId, imdbId, season, episode, off, addStreams }) {
  if (off(id)) return [];
  const basladi = Date.now();
  try {
    return await sirasi(async () => {
      const mod = await saglayiciYukle(id);
      if (!mod || typeof mod.coz !== 'function') return [];
      const tipler = (mod.kimlik && mod.kimlik.mediaTypes) || [];
      if (!(tipler.includes(mediaType) || (isAnime && tipler.includes('anime')))) return [];
      const cikti = await mod.coz({
        type: mediaType, title: targetTitle, originalTitle, titles: candidateTitles,
        year: targetYear, tmdbId, imdbId, season, episode,
      });
      const hamKaynak = (cikti && cikti.sources) || [];
      zekaKaydet({ aile: aileAdi(id), olay: hamKaynak.length ? 'cozuldu' : 'bos', ms: Date.now() - basladi });
      addStreams(hamKaynak.filter(s => s.category === 'dubbed'), 'dubbed');
      addStreams(hamKaynak.filter(s => s.category !== 'dubbed'), 'subtitled');
      return hamKaynak;
    });
  } catch (_) {
    zekaKaydet({ aile: aileAdi(id), olay: 'bos', ms: Date.now() - basladi });
    return [];
  }
}

// Cache version
const CACHE_VERSION = 'v47';
const TMDB_API_KEY = '4e44d9029b1270a757cddc766a1bcb63';

// In-Memory Stream Cache for instant 0ms lookups
const streamServersCache = new Map();

function cleanTitle(raw) {
  if (!raw) return '';
  return raw
    .replace(/\s*-\s*B\d+.*$/i, '')
    .replace(/\s*-\s*Bölüm\s*\d+.*$/i, '')
    .replace(/\s*-\s*S\d+E\d+.*$/i, '')
    .replace(/\s*-\s*S\d+.*$/i, '')
    .replace(/\s*-\s*\d+\.\s*Sezon.*$/i, '')
    .replace(/\s*\(\d{4}\).*/, '')
    .replace(/\s+poster$/i, '')
    .trim();
}

function resolveCandidateTitlesSync(targetTitle, originalTitle) {
  const titles = new Set();
  if (targetTitle) {
    titles.add(targetTitle);
    titles.add(cleanTitle(targetTitle));
  }
  if (originalTitle) {
    titles.add(originalTitle);
    titles.add(cleanTitle(originalTitle));
  }

  const expanded = new Set(titles);
  for (const t of titles) {
    if (!t) continue;
    const withNums = t
      .replace(/\bpart\s+two\b/i, 'Part 2')
      .replace(/\bpart\s+three\b/i, 'Part 3')
      .replace(/\bpart\s+four\b/i, 'Part 4')
      .replace(/\bpart\s+one\b/i, 'Part 1')
      .replace(/\bbolum\s+iki\b/i, 'Bölüm 2')
      .replace(/\bbolum\s+uc\b/i, 'Bölüm 3')
      .replace(/\bpart\s+ii\b/i, 'Part 2')
      .replace(/\bpart\s+iii\b/i, 'Part 3');
    expanded.add(withNums);

    const noNums = t
      .replace(/\bPart\s+\d+\b/gi, '')
      .replace(/\bBölüm\s+\d+\b/gi, '')
      .replace(/\b(II|III|IV|V|VI)\b/g, '')
      .trim();
    if (noNums && noNums.length > 2) expanded.add(noNums);

    // Strip [Dublajlı] / (Dublajlı) prefix or suffix for cross-provider matching
    const noDub = t
      .replace(/\s*[\(\[]\s*dublajl[ıi]\s*[\)\]]\s*/gi, '')
      .replace(/\s+dublajl[ıi]$/gi, '')
      .trim();
    if (noDub && noDub.length > 2) {
      expanded.add(noDub);
      expanded.add(cleanTitle(noDub));
    }
  }

  return Array.from(expanded).filter(Boolean);
}

async function resolveCandidateTitles(type, tmdbId, targetTitle, originalTitle) {
  const immediateTitles = resolveCandidateTitlesSync(targetTitle, originalTitle);
  let detectedYear = null;
  let isAnimation = false;

  if (!tmdbId) {
    return { candidateTitles: immediateTitles, detectedYear, isAnimation };
  }

  try {
    const endpoint = type === 'movie' ? 'movie' : 'tv';
    const res = await fetch(`https://api.themoviedb.org/3/${endpoint}/${tmdbId}?api_key=${TMDB_API_KEY}&language=tr-TR`, {
      signal: AbortSignal.timeout(3500)
    });
    if (res.ok) {
      const data = await res.json();
      const trTitle = data.title || data.name;
      const origTitle = data.original_title || data.original_name;
      const releaseDate = data.release_date || data.first_air_date;
      if (releaseDate) {
        detectedYear = new Date(releaseDate).getFullYear();
      }
      if (Array.isArray(data.genres) && data.genres.some(g => g.id === 16 || (g.name || '').toLowerCase().includes('animasyon'))) {
        isAnimation = true;
      }
      if (trTitle) immediateTitles.push(trTitle, cleanTitle(trTitle));
      if (origTitle) immediateTitles.push(origTitle, cleanTitle(origTitle));
    }
  } catch (_) {}

  const deduped = Array.from(new Set(immediateTitles.map(t => (t || '').trim()).filter(Boolean)));
  return { candidateTitles: deduped, detectedYear, isAnimation };
}

function formatStreamName(s, category = '') {
  // Anonimlik: gercek site adi veya kisaltasi ASLA etikete cikmaz (eski
  // dallar "HDFilmCehennemi", "DP", "SWX", "WTZ" gibi ham adlar uretiyordu).
  // Jenerik bicim: "Sunucu <harf> <kalite> <dil>". Harf, id/url'den turetilen
  // sabit indekstir; ayni hat her seferinde ayni adi alir.
  const url = (s.url || s.streamUrl || (typeof s.getUrl === 'function' ? s.getUrl() : '') || '').toLowerCase();
  const raw = (s.displayName || s.name || '').toLowerCase();
  const id = (s.id || '').toLowerCase();
  const hay = `${raw} ${url}`;

  const kalite = /\b(?:4k|2160p)\b/.test(hay) ? '4K'
    : /\b1080p\b/.test(hay) ? '1080p'
      : /\b720p\b/.test(hay) ? '720p'
        : /\b480p\b/.test(hay) ? '480p'
          : '1080p';

  let dil = '';
  if (category === 'dubbed' || /dub(?:laj)?\b/.test(hay)) dil = 'Dublaj';
  else if (category === 'subtitled' || /altyaz[\u0131i]|\bsub\b/.test(hay)) dil = 'Altyaz\u0131';

  const seed = id || url || raw;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const harf = String.fromCharCode(65 + (hash % 26));

  return [`Sunucu ${harf}`, kalite, dil].filter(Boolean).join(' ');
}

const IKI_DIL_MUSTERISI = /dual|trdual|trdub|dublaj/i;

/** Çift dilli (Türkçe seslendirme + altyazı taşıyan) yayınları karşı dil
 *  listesinin girdisine çevirir. Yayınlayıcı katman tek yönlü çağırır. */
export function ciftDilKopyalari(eklenen, karsiKategori) {
  return (eklenen || [])
    .filter(s => s && (s.isDual || IKI_DIL_MUSTERISI.test(s.streamUrl || s.url || '')))
    .map(s => ({ ...s, id: `${s.id}_${karsiKategori === 'subtitled' ? 'xs' : 'xd'}`, category: karsiKategori }));
}

function formatStreamItem(s, category, fallbackName) {
  const streamUrl = s.streamUrl || s.url || (typeof s.getUrl === 'function' ? s.getUrl() : '') || '';
  const finalDisplayName = (formatStreamName(s, category) || fallbackName)
    .replace(/[\p{Extended_Pictographic}\p{Regional_Indicator}\uFE0F\u200D]/gu, '')
    .replace(/(?:Türkçe|TR)\s*(?:Dublaj|Altyazılı|Altyazı)|Dublaj|Altyazılı|Altyazı/gi, '')
    .replace(/\(\s*\)/g, '').replace(/\s+/g, ' ').trim();

  let badge = s.badge || (category === 'dubbed' ? '  TR Dublaj' : '  TR Altyazı');
  const lowerName = (finalDisplayName || '').toLowerCase();
  const streamId = (s.id || '').toLowerCase();
  if (streamId.startsWith('hdfc_') && lowerName.includes('rapidrame')) {
    badge = category === 'dubbed' ? '🚀 Rapidrame Dublaj 1080p' : '🚀 Rapidrame Altyazı 1080p';
  } else if (streamId.startsWith('hdfc_') && lowerName.includes('closeload')) {
    badge = category === 'dubbed' ? '⚡ CloseLoad Dublaj 1080p' : '⚡ CloseLoad Altyazı 1080p';
  } else if (lowerName.includes('hdfc') || lowerName.includes('hdfilmcehennemi')) {
    badge = category === 'dubbed' ? '🔥 HDFC Dublaj 1080p' : '🔥 HDFC Altyazı 1080p';
  } else if (lowerName.includes('dzb') || lowerName.includes('dizibal') || lowerName.includes('dp')) {
    badge = category === 'dubbed' ? '  DP Dublaj' : '  DP Altyazı';
  } else if (lowerName.includes('ds')) {
    badge = category === 'dubbed' ? '  DS Dublaj' : '  DS Altyazı';
  } else if (lowerName.includes('az ') || lowerName.includes('az 4k') || lowerName.includes('az 1080p') || lowerName.includes('anizium')) {
    badge = s.badge || (category === 'dubbed' ? '  AZ 4K Dublaj' : '  AZ 4K Altyazı');
  } else if (lowerName.includes('swx')) {
    badge = '  SWX 1080p';
  } else if (lowerName.includes('tvr')) {
    badge = '  TVR 1080p';
  } else if (lowerName.includes('lookmovie')) {
    badge = '  LookMovie 1080p';
  } else if (lowerName.includes('2embed')) {
    badge = '  2Embed 1080p';
  } else if (lowerName.includes('dramalar') || streamId.startsWith('dml_')) {
    badge = '👑 Dramalar VIP';
  } else if (lowerName.includes('dramadizilerim') || streamId.startsWith('ddz_')) {
    badge = '🎭 DDZ VIP';
  } else if (streamId.startsWith('setf_') || lowerName.includes('setplay')) {
    badge = category === 'dubbed' ? '🎬 SetPlay Dublaj 1080p' : '🎬 SetPlay Altyazı 1080p';
  } else if (lowerName.includes('fastplay')) {
    badge = category === 'dubbed' ? '⚡ FastPlay Dublaj 1080p' : '⚡ FastPlay Altyazı 1080p';
  } else if (streamId.startsWith('wtz_') || streamId.startsWith('webteizle_') || lowerName.includes('webteizle') || lowerName.includes('wtz')) {
    badge = s.badge || (category === 'dubbed' ? '🎬 WTZ Dublaj 1080p' : '🎬 WTZ Altyazı 1080p');
  } else if (streamId.startsWith('slc_') || lowerName.includes('selcuk') || lowerName.includes('pichive')) {
    badge = s.badge || (category === 'dubbed' ? '🦅 SelcukFlix Dublaj 1080p' : '🦅 SelcukFlix Altyazı 1080p');
  } else if (streamId.startsWith('dzl_') || lowerName.includes('dizilla')) {
    badge = s.badge || (category === 'dubbed' ? '🎭 Dizilla Dublaj 1080p' : '🎭 Dizilla Altyazı 1080p');
  } else if (streamId.startsWith('fhdf_') || lowerName.includes('fullhd')) {
    badge = s.badge || (category === 'dubbed' ? '🎬 FullHD Dublaj 1080p' : '🎬 FullHD Altyazı 1080p');
  }

  return {
    ...s,
    id: s.id || `stream_${Math.random().toString(36).slice(2, 9)}`,
    name: finalDisplayName,
    displayName: finalDisplayName,
    streamUrl,
    url: streamUrl,
    badge: finalDisplayName,
    category,
    isHls: Boolean(s.isHls || streamUrl.includes('.m3u8')),
    isDirectVideo: Boolean(s.isDirectVideo || s.isHls || streamUrl.includes('.m3u8') || streamUrl.includes('.mp4') || streamUrl.includes('.mkv')),
    getUrl: () => streamUrl
  };
}

function isValidStream(s) {
  if (isNativeCapacitor()) return Boolean(s?.streamUrl || s?.url);
  const urlStr = (s.url || s.streamUrl || (typeof s.getUrl === 'function' ? s.getUrl() : '') || '').toLowerCase();
  if (!urlStr || urlStr.length < 8) return false;

  const id = (s.id || '').toLowerCase();
  const raw = (s.displayName || s.name || '').toLowerCase();

  if (/filemoon|bysejikuar|bysezoxexe/.test(`${raw} ${urlStr}`)) return false;

  // Allow clean torrent_p2p_ streams from torrentStreamService
  if (id.startsWith('torrent_p2p_')) {
    return true;
  }

  // Purge any raw legacy torrent or YTS headers per user request
  if (s.isTorrent && !id.startsWith('torrent_p2p_')) {
    return false;
  }
  if (id.includes('yts') || raw.includes('yts') || urlStr.includes('yts.mx')) {
    return false;
  }

  // Pichive / Hotlinger: Cloudstream SetFilm/SelcukFlix/Dizilla birincil host'udur.
  // Direkt (proxisiz) m3u8 denemeleri CF engeline takilir, ancak
  // /api/hls_proxy uzerinden gecenler ve iframe embed'ler oynatilir.
  // Bu yuzden sadece ciplak, ne proxy ne iframe olanlari ele.
  if (urlStr.includes('pichive') || urlStr.includes('hotlinger')) {
    const isProxied = urlStr.includes('hls_proxy') || urlStr.includes('%3a%2f%2f') || urlStr.includes('%3A%2F%2F');
    const isEmbed = Boolean(s.isIframe) || (s.type === 'embed');
    if (!isProxied && !isEmbed) return false;
  }
  if ((urlStr.includes('diziyo.so') && !urlStr.includes('.m3u8'))) {
    return false;
  }

  const blocked = [
    'recaptcha',
    'media.cm',
    'cloudvideo.tv',
    'vidoza.net',
    'voe.sx',
    'hdfilmdelisi',
    'play.liderfilm'
  ];
  for (const b of blocked) {
    if (urlStr.includes(b)) return false;
  }

  return true;
}

function temelOncelikSkoru(s) {
  const url = (s.url || s.streamUrl || (typeof s.getUrl === 'function' ? s.getUrl() : '') || '').toLowerCase();
  // DOĞRUDAN YAYIN HER ZAMAN GÖMÜLÜDEN ÖNCE GELİR.
  // Sağlayıcı ne olursa olsun: bizim oynatıcıyla açılan doğrudan yayın
  // (m3u8/mp4), gömülü oynatıcıdan (iframe) önce seçilir. Gömülü yalnızca
  // hiçbir yolla çözülemeyen adresler için en sonda durur.
  const dogrudan = Boolean(s.isDirectVideo || s.isHls || /\.(m3u8|mp4|mkv|webm|m4s)(\?|#|$)/i.test(url));
  const gomulu = Boolean((s.isIframe || s.type === 'embed' || s.isSayfa) && !dogrudan);
  const ceza = gomulu ? 50 : 0;
  const raw = (s.displayName || s.name || '').toLowerCase();
  const id = (s.id || '').toLowerCase();

  // 1. HDFilmCehennemi (CloseLoad & Rapidrame - En yüksek stabilite)
  if (id.startsWith('hdfc_') || raw.includes('closeload') || raw.includes('rapidrame') || raw.includes('hdfilmcehennemi') || raw.includes('hdfc')) return 0 + ceza;

  // 1b. SetFilmizle (SetPlay & FastPlay - Özel 1080p Türk Oynatıcıları)
  if (id.startsWith('setf_') || raw.includes('setplay') || raw.includes('fastplay') || raw.includes('setfilm')) return 1 + ceza;

  // 1c. SelcukFlix (Pichive 1080p HLS - cift tip: film+dizi, Cloudstream ile birebir)
  if (id.startsWith('slc_') || raw.includes('selcukflix') || raw.includes('selcuk')) return 1 + ceza;

  // 1d. Dizilla (Pichive 1080p - dizi-only, Cloudstream TvSeries ile birebir)
  if (id.startsWith('dzl_') || raw.includes('dizilla')) return 2 + ceza;

  // 2. DP (DiziBal AlphaStream HLS - Doğrudan 1080p)
  if (id.startsWith('dzb_') || id.startsWith('dzp_') || raw.includes('dp 1080p') || raw.includes('dp ') || raw.includes('dizibal')) return 2 + ceza;

  // 3. DS (Dizisol HLS - Doğrudan 1080p Dual Ses)
  if (id.startsWith('dzs_') || raw.includes('dizisol') || raw.includes('ds 1080p') || raw.includes('ds ')) return 2 + ceza;

  // 4. SWX (Sinewix Direct - HLS/MP4 priority 3, MKV fallback priority 9)
  if (id.startsWith('snx') || raw.includes('sinewix') || raw.includes('swx')) {
    return (s.isMkv || raw.includes('mkv')) ? 9 : 3;
  }

  // 5. TVR VIP (RecTV 1080p HLS)
  if (id.startsWith('tvr_') || raw.includes('tvr') || raw.includes('rectv')) return 4 + ceza;

  // 5b. Short Dramas (Dramalar VIP & DramaDizilerim - Direct 1080p HLS)
  if (id.startsWith('dml_') || raw.includes('dramalar')) return 2 + ceza;
  if (id.startsWith('ddz_') || raw.includes('dramadizilerim') || raw.includes('ddz vip')) return 3 + ceza;

  // 6. LookMovie VIP (1080p HLS)
  if (id.startsWith('lookmovie_') || raw.includes('lookmovie')) return 5 + ceza;

  // 7. İkincil Yerli Sağlayıcılar (Webteizle, Diziyo, Diziyou, SezonlukDizi, HDF)
  if (id.startsWith('wtz_') || id.startsWith('webteizle_') || raw.includes('webteizle')) return 6 + ceza;
  if (id.startsWith('fxs_') || raw.includes('filmekseni') || raw.includes('eksenload')) return 6 + ceza;
  if (id.startsWith('dzy_') || raw.includes('diziyo')) return 7 + ceza;
  if (id.startsWith('dyu_') || raw.includes('diziyou')) return 8 + ceza;
  if (id.startsWith('szd_') || raw.includes('sezonluk')) return 8 + ceza;
  if (id.startsWith('hdfb_') || id.startsWith('fhdf_') || raw.includes('fullhd') || raw.includes('hdfilmizle') || raw.includes('hdf ')) return 9 + ceza;

  // 8. VIP P2P Torrent Akışları
  if (id.startsWith('torrent_p2p_')) return 10 + ceza;

  // 9. Embed Oynatıcılar (2Embed, SmashyStream)
  if (id.startsWith('twoembed_') || raw.includes('2embed')) return 12 + ceza;
  if (id.startsWith('smashystream_') || raw.includes('smashy')) return 13 + ceza;

  // 10. Anime & Çocuk
  if (id.startsWith('az_') || id.startsWith('anizium_') || raw.includes('anizium') || raw.includes('az ')) return 2 + ceza;
  if (id.startsWith('kvip_') || raw.includes('kids vip')) return 14 + ceza;
  if (id.startsWith('acx_') || raw.includes('animecix')) return 15 + ceza;
  if (id.startsWith('atr_') || raw.includes('animetr')) return 17 + ceza;

  return 20 + ceza;
}

/** ÖĞRENMİŞ SIRALAMA: temel sıra + bu cihazda öğrenilen güven cezası.
 *  Aynı ailenin tekrar tekrar ölen hattı aşağı düşer; oynatan hat yükselir. */
function getStreamPriorityScore(s) {
  let uyarinca = 0;
  try { uyarinca = zekaCeza(getSourceFamily(s).alias); } catch (_) { uyarinca = 0; }
  return temelOncelikSkoru(s) + uyarinca;
}

/**
 * Progressive live streaming source aggregator.
 */
export async function getStreamingServersProgressive({
  type = 'movie',
  tmdbId = null,
  imdbId = null,
  title = '',
  originalTitle = '',
  seriesTitle = '',
  year = null,
  season = 1,
  episode = 1,
  onUpdate = () => {}
}) {
  const isMovie = (type === 'movie');
  const targetTitle = cleanTitle(seriesTitle || title);
  const cacheKey = `${type}_${tmdbId || targetTitle}_s${season}_e${episode}`;
  // Eklenti anahtari: kapali eklenti aga hic vurmaz (trafik + sure kazanir).
  const off = (id) => !isPluginEnabled(id);

  const hydrateServers = (list) => {
    if (!Array.isArray(list)) return [];
    return list.map(s => {
      if (!s) return s;
      const u = s.streamUrl || s.url || '';
      return {
        ...s,
        streamUrl: u,
        url: u,
        getUrl: () => u
      };
    });
  };

  if (!streamServersCache.has(cacheKey)) {
    try {
      const sess = sessionStorage.getItem(`cp_streams_${CACHE_VERSION}_${cacheKey}`);
      if (sess) {
        const parsed = JSON.parse(sess);
        if (parsed && (parsed.dubbed?.length || parsed.subtitled?.length)) {
          const hydrated = {
            ...parsed,
            dubbed: hydrateServers(parsed.dubbed),
            subtitled: hydrateServers(parsed.subtitled)
          };
          streamServersCache.set(cacheKey, hydrated);
        }
      }
    } catch (_) {}
  }

  if (streamServersCache.has(cacheKey)) {
    const cached = streamServersCache.get(cacheKey);
    const hydrated = {
      ...cached,
      dubbed: hydrateServers(cached.dubbed),
      subtitled: hydrateServers(cached.subtitled)
    };
    // Show cached sources immediately, then revalidate every provider below.
    // Previously this returned early, so stale DS entries could never recover
    // and late Sezonluk/SWX sources were permanently hidden.
    // Bayat onbellekten (5dk+) otomatik BASLATMA yapma: sureli HLS
    // baglantilari son kullanmali olur, hata verip durur. Liste gosterilir,
    // oynatma taze tarama sonucunu bekler.
    onUpdate({ ...hydrated, isComplete: false, fromCache: true });
    streamServersCache.delete(cacheKey);
    try { sessionStorage.removeItem(`cp_streams_${CACHE_VERSION}_${cacheKey}`); } catch (_) {}
  }

  let candidateTitles = resolveCandidateTitlesSync(targetTitle, originalTitle);
  let targetYear = year;

  const enrichmentTask = tmdbId
    ? resolveCandidateTitles(type, tmdbId, targetTitle, originalTitle).catch(() => null)
    : Promise.resolve(null);

  let currentDubbed = [];
  let currentSubtitled = [];
  const seenDubUrls = new Set();
  const seenSubUrls = new Set();

  const sourceJobs = [];
  const addStreams = (rawList, category) => {
    if (!isNativeCapacitor()) return publishStreams(rawList, category);
    const job = prepareAndroidSources(rawList, { fallbackOnFailure: true, diagnose: recordProviderEvent })
      .then(sources => publishStreams(sources, category));
    sourceJobs.push(job);
    return job;
  };

  /** Tarayıcı-web: gömülü oynatıcı listelenmez (iframe kuralı — sidecar/cihaz
   *  embed oynatabilir, tarayıcıda 4xx/ölü satır olur; kabul kıstası "iframe
   *  yayın yok"). Doğrudan medya adresli (m3u8/mp4) "embed" tipi korunur. */
  const webTarayici = !isNativeCapacitor() && typeof window !== 'undefined' &&
    !(window.CinePulseDesktop?.isDesktop === true || (navigator.userAgent || '').includes('CinePulseDesktop'));
  /** Gömülü oynatıcı sitelerinin adresleri web'de oynatılamaz (tarayıcı
   *  iframe'i bizde yasak) — sağlayıcı bayraklamasa da listeye girmesin. */
  const GOMULU_OYNATICI = /^(?:(?:www\.)?vidmoly\.(?:biz|to|net)|ok\.ru|drive\.google\.com|(?:www\.)?vidthehd\.club|vidsrc(?:xyz)?\.|2embed\.|mixdrop\.|dood\.(?:to|la|ws|sh)|streamtape\.|upstream\.to|filemoon\.|vidshare\.|vidup\.|vkmcd\.|vidhide\.(?:pro|to|biz))(?::\d+)?\//i;

  /** Bir yayını iki dil listesine de yazar: çift dilli (dual) yayınlar hem
   *  dublaj hem altyazı sekmesinde görünür — tek dilde kaybolmaz. */
  const publishStreams = (rawList, category, derin = false) => {
    if (!Array.isArray(rawList) || rawList.length === 0) return [];
    let rawIncoming = rawList;
    if (webTarayici) {
      rawIncoming = rawList.filter(raw => {
        if (!raw) return false;
        const u = String(raw.streamUrl || raw.url || (typeof raw.getUrl === 'function' ? raw.getUrl() : '') || '');
        const medya = /\.(m3u8|mp4|mkv|webm|m4s|mpd)(\?|#|$)/i.test(u) || /\/api\/(?:hls_proxy|mkv_stream|stream_proxy)[?#]/i.test(u);
        let host = '';
        try { host = new URL(u, 'https://x.invalid').hostname; } catch (_) {}
        if (!medya && host && GOMULU_OYNATICI.test(host + '/')) return false;
        if (!(raw.isIframe || raw.type === 'embed')) return true;
        return medya;
      });
      if (!rawIncoming.length) return [];
      // Betelgeuse sources are verified upstream but their media hosts reject
      // browser playback (the HTML video request cannot carry the provider's
      // Referer/User-Agent). Keep discovery in the browser, route only its
      // direct media through our same-origin Range-capable proxy.
      rawIncoming = rawIncoming.map(raw => {
        if (!String(raw.id || '').startsWith('d4kh_')) return raw;
        const target = String(raw.streamUrl || raw.url || '');
        if (!/^https?:\/\//i.test(target) || /\/api\/proxy(?:\?|$)/i.test(target)) return raw;
        const ref = raw.headers?.Referer || raw.headers?.referer || '';
        const proxy = `/api/proxy?url=${encodeURIComponent(target)}&ref=${encodeURIComponent(ref)}`;
        return { ...raw, streamUrl: proxy, url: proxy, isDirectVideo: true };
      });
    }
    const valid = rawIncoming.filter(isValidStream);
    const added = [];
    let updated = false;

    for (const raw of valid) {
      const formatted = formatStreamItem(raw, category, category === 'dubbed' ? 'VIP 1080p' : 'VIP Altyazılı');
      const urlStr = (formatted.streamUrl || formatted.url || '').trim().toLowerCase();
      const id = (formatted.id || '').toLowerCase();
      const providerPrefix = id.split('_').slice(0, 2).join('_');
      const urlKey = `${providerPrefix}||${urlStr}`;
      const existingList = category === 'dubbed' ? currentDubbed : currentSubtitled;
      const existing = existingList.find(source => source.id === formatted.id &&
        (source.streamUrl || source.url || '').trim().toLowerCase() === urlStr);
      if (existing) {
        if (existing.verification?.state !== formatted.verification?.state || existing.autoPlayable !== formatted.autoPlayable) {
          Object.assign(existing, formatted);
          updated = true;
        }
        continue;
      }

      if (category === 'dubbed') {
        if (!seenDubUrls.has(urlKey)) {
          seenDubUrls.add(urlKey);
          currentDubbed.push(formatted);
          currentDubbed.sort((a, b) => getStreamPriorityScore(a) - getStreamPriorityScore(b));
          added.push(formatted);
        }
      } else {
        if (!seenSubUrls.has(urlKey)) {
          seenSubUrls.add(urlKey);
          currentSubtitled.push(formatted);
          currentSubtitled.sort((a, b) => getStreamPriorityScore(a) - getStreamPriorityScore(b));
          added.push(formatted);
        }
      }
    }

    // Çift dilli yayınlar karşı dile de kopyalanır (tek yönlü — döngü olmaz).
    if (!derin && added.length) {
      const kopyalar = ciftDilKopyalari(added, category === 'dubbed' ? 'subtitled' : 'dubbed');
      if (kopyalar.length) publishStreams(kopyalar, category === 'dubbed' ? 'subtitled' : 'dubbed', true);
    }

    // Subtitle sharing
    const discoveredSubs = [...currentSubtitled, ...currentDubbed]
      .find(s => Array.isArray(s.subtitles) && s.subtitles.length > 0)?.subtitles;

    if (discoveredSubs && discoveredSubs.length > 0) {
      for (const s of isNativeCapacitor() ? [] : currentSubtitled) {
        if (!Array.isArray(s.subtitles) || s.subtitles.length === 0) s.subtitles = discoveredSubs;
      }
      for (const s of isNativeCapacitor() ? [] : currentDubbed) {
        if (!Array.isArray(s.subtitles) || s.subtitles.length === 0) s.subtitles = discoveredSubs;
      }
    }

    if (added.length > 0 || updated) {
      onUpdate({
        dubbed: [...currentDubbed],
        subtitled: [...currentSubtitled],
        totalServers: currentDubbed.length + currentSubtitled.length,
        isComplete: false,
        newStream: added[0],
        isDubbedStream: category === 'dubbed'
      });
    }

    return added;
  };

  const isAnime = type === 'anime';
  const isShortDrama = Boolean(
    (tmdbId && (String(tmdbId).startsWith('ddz_') || String(tmdbId).startsWith('dml_'))) ||
    type === 'short-drama'
  );

  // Kısa diziler için özel izole sağlayıcı listesi (SmashyStream, LookMovie, Sinewix vb. film sağlayıcıları çağrılmaz)
  if (isShortDrama) {
    const rawDramaSlug = tmdbId ? String(tmdbId).replace(/^(ddz_|dml_)/, '') : '';
    if (rawDramaSlug) {
      candidateTitles = [...new Set([...candidateTitles, rawDramaSlug, tmdbId])];
    }

    const dramaTasks = [
      // 1. Dramalar.com VIP (Doğrudan kesintisiz CDN 1080p HLS)
      off('dramalar') ? [] : fetchDramalarEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, season, episode, isDub: true })
        .then(res => addStreams(res, 'dubbed')).catch(() => []),
      off('dramalar') ? [] : fetchDramalarEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, season, episode, isDub: false })
        .then(res => addStreams(res, 'subtitled')).catch(() => []),

      // 2. DramaDizilerim VIP (NetShort, FlexTV, DramaBox HLS / Direct Video)
      off('dramadizilerim') ? [] : fetchDramaDizilerimEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, season, episode, isDub: true })
        .then(res => addStreams(res, 'dubbed')).catch(() => []),
      off('dramadizilerim') ? [] : fetchDramaDizilerimEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, season, episode, isDub: false })
        .then(res => addStreams(res, 'subtitled')).catch(() => [])
    ];

    await Promise.allSettled(dramaTasks);
    await Promise.allSettled(sourceJobs);

    const finalDubbed = currentDubbed.sort((a, b) => getStreamPriorityScore(a) - getStreamPriorityScore(b));
    const finalSubtitled = currentSubtitled.sort((a, b) => getStreamPriorityScore(a) - getStreamPriorityScore(b));

    const payload = {
      dubbed: finalDubbed,
      subtitled: finalSubtitled,
      totalServers: finalDubbed.length + finalSubtitled.length,
      isComplete: true
    };

    onUpdate(payload);
    streamServersCache.set(cacheKey, payload);
    return payload;
  }

  if (isNativeCapacitor()) {
    const [{ listProviderDefinitions }, { runProviderBatch }] = await Promise.all([
      import('./providerRuntime/inventory.js'), import('./providerRuntime/batch.js')
    ]);
    const enriched = await Promise.race([enrichmentTask, new Promise(resolve => setTimeout(() => resolve(null), 1200))]);
    if (enriched?.candidateTitles?.length) candidateTitles = enriched.candidateTitles;
    targetYear = targetYear || enriched?.detectedYear;
    const mediaType = isMovie ? 'movie' : 'tv';
    const anime = type === 'anime' || enriched?.isAnimation === true;
    /* Anime eklentileri animasyon TESPTİNİN 1,2 saniyelik yarışına bağlanmaz:
       TMDB türü yetişmediğinde Aria (Anizium) ve Tera (Animecix) tümüyle
       eleniyordu — ölçülen "anime kaynağı hiç gelmiyor" buydu. Anime siteleri
       olmayan başlıkta zaten boş döner, maliyeti düşük.
       Animasyon doğrulandığında ise en başa alınır: Anizium doğrudan mp4/m3u8
       döndürdüğü için listeyi o doldurur ("hızlı çıkmalı"). */
    const oncelik = {
      ...(anime ? { anizium: -6, animecix: -5, animetr: -4, asy: -3, kidsvip: -3 } : {}),
      dyu: 0, lookmovie: 0, dzs: 1, dizi77: 1, dzb: 2, snx: 3, tvr: 4, // hdfc:3 kaldırıldı — WebView kapısı uygulandı, öğrenme sıralarını belirler
    };
    const definitions = listProviderDefinitions().filter(provider =>
      !provider.experimental && !off(provider.id) &&
      (provider.mediaTypes.includes(mediaType) || provider.mediaTypes.includes('anime'))
    ).sort((a, b) => (oncelik[a.id] ?? 10) - (oncelik[b.id] ?? 10));
    // — TEMİZ SAĞLAYICILAR: batch ile eşzamanlı, kendi yayın kanallarıyla —

    const temizGorevler = kayitliKimlikler().filter(id => !definitions.some(definition => definition.id === id)).map(async (temizId) => {
      const basladi = Date.now();
      try {
        if (off(temizId)) return;
        const temizMod = await saglayiciYukle(temizId);
        if (!temizMod || typeof temizMod.coz !== 'function') return;
        const kim = temizMod.kimlik || { mediaTypes: [mediaType] };
        const tipler = kim.mediaTypes || [];
        if (!(tipler.includes(mediaType) || (anime && tipler.includes('anime')))) return;
        const cikti = await temizMod.coz({
          type: mediaType, title: targetTitle, originalTitle, titles: candidateTitles,
          year: targetYear, tmdbId, imdbId, season, episode,
        });
        const hamKaynak = (cikti && cikti.sources) || [];
        // ÖĞRENME: bu aile bu içerik için ne üretti, kaç ms'de?
        zekaKaydet({ aile: aileAdi(temizId), olay: hamKaynak.length ? 'cozuldu' : 'bos', ms: Date.now() - basladi });
        if (!hamKaynak.length) return;
        const hazir = await prepareAndroidSources(hamKaynak, { fallbackOnFailure: true, diagnose: recordProviderEvent,
          onReady: source => publishStreams([source], source.category === 'dubbed' ? 'dubbed' : 'subtitled') });
        for (const kay of hazir) publishStreams([kay], kay.category === 'dubbed' ? 'dubbed' : 'subtitled');
      } catch (_) {}
    });

    await runProviderBatch(definitions, {
      type: mediaType, title: targetTitle, originalTitle, titles: candidateTitles, year: targetYear,
      tmdbId, imdbId, season, episode,
    }, {
      concurrency: 8, timeoutMs: 30000, diagnose: recordProviderEvent,
      onResult: async ({ sources }) => {
        const prepared = await prepareAndroidSources(sources, { fallbackOnFailure: true, diagnose: recordProviderEvent,
          onReady: source => publishStreams([source], source.category === 'dubbed' ? 'dubbed' : 'subtitled') });
        publishStreams(prepared.filter(source => source.category === 'dubbed'), 'dubbed');
        publishStreams(prepared.filter(source => source.category !== 'dubbed'), 'subtitled');
      }
    });
    await Promise.allSettled(temizGorevler);

    const payload = {
      dubbed: [...currentDubbed], subtitled: [...currentSubtitled],
      totalServers: currentDubbed.length + currentSubtitled.length,
      isComplete: true, cachedAt: Date.now(), transport: 'android-device',
    };
    if (payload.totalServers) {
      streamServersCache.set(cacheKey, payload);
      try { sessionStorage.setItem(`cp_streams_${CACHE_VERSION}_${cacheKey}`, JSON.stringify(payload)); } catch (_) {}
    }
    onUpdate(payload);
    return payload;
  }

  // — MASAÜSTÜ / WEB DALI: temiz KAYIT tek doğruluk kaynağı —
  const temizTur = isMovie ? 'movie' : 'tv';
  const temizSirasi = siraliCalistir(6);

  const tasks = [
    // 1. RecTV VIP (1080p VIP direct streams)
    off('tvr') ? [] : fetchRecTvSources({ type, title: targetTitle, originalTitle, season, episode, year: targetYear })
      .then(res => {
        if (!Array.isArray(res) || res.length === 0) return [];
        const dubs = res.filter(s => {
          const text = `${s.name || ''} ${s.badge || ''}`.toLowerCase();
          return text.includes('dublaj') || text.includes('tr dub');
        });
        const subs = res.filter(s => {
          const text = `${s.name || ''} ${s.badge || ''}`.toLowerCase();
          return !text.includes('dublaj') && !text.includes('tr dub');
        });
        if (dubs.length > 0) addStreams(dubs, 'dubbed');
        if (subs.length > 0) addStreams(subs, 'subtitled');
        if (dubs.length === 0 && subs.length === 0 && res.length > 0) {
          addStreams(res, 'subtitled');
        }
      }).catch(() => []),

    // 8f. Toplu film M3U kataloglari (Jet Film / Film Modu). Dogrudan dosya
    // adresleri; #EXTVLCOPT UA/referer degerleri proxy'ye devredilir, yoksa
    // cogu baglanti 403 donuyor. Yalnizca film.
    isMovie
      ? off('vodm3u') ? [] : Promise.all(VOD_M3U_IDS.map((sid) => loadVodSource(sid)))
          .then(() => fetchVodSources({ titles: candidateTitles, title: targetTitle, year: targetYear }))
          .then(res => addStreams(res, 'dubbed')).catch(() => [])
      : [],

    // 8h. Coklu site surucusu (HDFilmCehennemi / SelcukFlix / SetFilm /
    // FilmEkseni). Her biri kendi eklenti anahtariyla kontrol edilir.
    // TEMIZ_IDLER korumasi: temiz saglayicisi olan yildizlar (Orion, Lyra,
    // Vela, Sirius, Betelgeuse, Muhlif, Aquila) KAYIT'tan tek sefer sorgulanir;
    // surucu ayni siteye ikinci kez vururdu (Vercel + site limiti israfi —
    // inventory.js "tek kayit defteri" kuralinin web karsiligi).
    Promise.all(SITE_SURUCULERI.map(({ anahtar, site }) => (
      off(anahtar) || TEMIZ_IDLER.has(anahtar) ? [] : siteListesi(site, {
        title: targetTitle, originalTitle, titles: candidateTitles, imdbId,
        tmdbId: String(tmdbId || '').replace(/^[a-z]{2,4}_/, ''),
        mediaType: isMovie ? 'movie' : 'tv', season, episode
      })
    ))).then(heps => addStreams(heps.flat().map((source, index) => ({ ...source, id: source.id || `site_${index}`, streamUrl: source.url })), 'dubbed')).catch(() => []),

    // 8c/8d kaldirildi: setf+wtz registry (task 0) uzerinden tek sefer
    // cagriliyor; ayri direct cagrilar ayni backend'e 2. kez vurup
    // listeyi yavaslatiyordu (FastPlay/SetPlay/CloseLoad cift yuk).

    // 9. Kids VIP (Cartoons & Animations - Direct High-Speed)
    !isMovie
      ? off('kidsvip') ? [] : fetchKidsVipSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => [])
      : off('kidsvip') ? [] : fetchKidsVipMovieSources({ titles: candidateTitles, title: targetTitle, originalTitle, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => []),

    !isMovie
      ? off('kidsvip') ? [] : fetchKidsVipSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: false })
          .then(res => addStreams(res, 'subtitled')).catch(() => [])
      : off('kidsvip') ? [] : fetchKidsVipMovieSources({ titles: candidateTitles, title: targetTitle, originalTitle, isDub: false })
          .then(res => addStreams(res, 'subtitled')).catch(() => []),

    // 10. Clean Global VIP Embed: SmashyStream (Filmler ve diziler için, kısa diziler hariç)
    Promise.resolve(off('smashy') ? [] : fetchSmashyStreamSources({ type, tmdbId, season, episode }))
      .then(res => addStreams(res, 'subtitled')).catch(() => []),

    // 10b. Official LookMovie2.la VIP Player
    off('lookmovie') ? [] : fetchOfficialLookMovieSources({ type, title: targetTitle, originalTitle, season, episode })
      .then(res => addStreams(res, 'subtitled')).catch(() => []),

    // 11. Anime catalogues
    isAnime
      ? off('animecix') ? [] : fetchAnimecixSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => [])
      : Promise.resolve([]),

    isAnime
      ? off('animecix') ? [] : fetchAnimecixSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: false })
          .then(res => addStreams(res, 'subtitled')).catch(() => [])
      : Promise.resolve([]),

    isAnime
      ? off('animetr') ? [] : fetchAnimeTrSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => [])
      : Promise.resolve([]),

    // Anizium 4K / 1080p dedicated anime streams
    off('anizium') ? [] : fetchAniziumSources({ type, titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: true })
      .then(res => addStreams(res, 'dubbed')).catch(() => []),

    off('anizium') ? [] : fetchAniziumSources({ type, titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: false })
      .then(res => addStreams(res, 'subtitled')).catch(() => []),

    // 12. VIP P2P Streams
    off('torrent') ? [] : fetchTorrentStreamSources({ type, tmdbId, title: targetTitle, season, episode })
      .then(res => {
        if (Array.isArray(res) && res.length > 0) {
          addStreams(res, 'subtitled');
        }
      }).catch(() => []),

    // 13. TEMİZ KAYIT (Orion, Atlas, Nero, Vela, Lyra…) — masaüstü/web artık
    // APK ile BİREBİR aynı kaynaktan beslenir: src/providers/index.js KAYIT.
    // Eski hdfilmcehennemiScraper ve eski site blokları silindi; 8h site
    // sürücüleri yalnız yedek olarak duruyor.
    // DÜZELTME: eski satır `mediaType` kullanıyordu; o değişken yalnız APK
    // (isNativeCapacitor) bloğunda tanımlı — masaüstünde ReferenceError doğurup
    // .catch() içinde sessizce yutuluyor, Orion dahil HİÇBİR temiz sağlayıcı
    // listeye kaynak veremiyordu. Tur tipi burada ayrıca hesaplanır.
    ...kayitliKimlikler().map((temizId) => temizSaglayiciTara({
      sirasi: temizSirasi,
      id: temizId, mediaType: temizTur, isAnime, targetTitle, originalTitle,
      candidateTitles, targetYear, tmdbId, imdbId, season, episode, off, addStreams
    })),

    // 14. DramaDizilerim & Dramalar (Fallback to short drama sources if requested as standard series)
    !isMovie
      ? off('dramalar') ? [] : fetchDramalarEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, season, episode, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => [])
      : Promise.resolve([]),

    !isMovie
      ? off('dramalar') ? [] : fetchDramalarEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, season, episode, isDub: false })
          .then(res => addStreams(res, 'subtitled')).catch(() => [])
      : Promise.resolve([]),

    !isMovie
      ? off('dramadizilerim') ? [] : fetchDramaDizilerimEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, season, episode, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => [])
      : Promise.resolve([]),

    !isMovie
      ? off('dramadizilerim') ? [] : fetchDramaDizilerimEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, season, episode, isDub: false })
          .then(res => addStreams(res, 'subtitled')).catch(() => [])
      : Promise.resolve([])
  ];

  // Alias expansion task
  const aliasTask = enrichmentTask.then(enriched => {
    if (!enriched?.candidateTitles?.length) return [];
    const extraTitles = enriched.candidateTitles.filter(t => !candidateTitles.includes(t));
    if (!extraTitles.length) return [];
    candidateTitles = enriched.candidateTitles;
    if (!targetYear && enriched.detectedYear) targetYear = enriched.detectedYear;

    /* Eski alias taramaları (DiziBal / SezonlukDizi) kaldırıldı: aynı siteler
       artık temiz sağlayıcılar (Nero, Atlas, Corvus…) tarafından kendi başlık
       varyantlarıyla çözülüyor. Buradaki ikinci çağrı hem site adını etikete
       taşıyor (anonimlik) hem de aynı backend'e tekrar vurup listeyi
       yavaşlatıyordu. SezonlukDizi'nin sağlayıcısı zaten devre dışı. */
    return [];
  });

  // Keep media type and episode identity exact; never return episode 1 for a movie.
  const crossTypeTasks = [];

  await Promise.allSettled([...tasks, ...crossTypeTasks, aliasTask]);
  await Promise.allSettled(sourceJobs);

  // Ensure ALL dubbed and subtitled streams have OpenSubtitles fallback support
  const cleanMediaTitle = targetTitle || originalTitle || '';
  const defaultSubUrl = isMovie
    ? `/api/subtitles?tmdbId=${tmdbId || ''}&imdbId=${imdbId || ''}&title=${encodeURIComponent(cleanMediaTitle)}&type=movie`
    : `/api/subtitles?tmdbId=${tmdbId || ''}&imdbId=${imdbId || ''}&title=${encodeURIComponent(cleanMediaTitle)}&season=${season}&episode=${episode}&type=tv`;

  for (const s of isNativeCapacitor() ? [] : currentDubbed) {
    if (!Array.isArray(s.subtitles) || s.subtitles.length === 0) {
      s.subtitles = [{ label: 'OpenSubtitles (Türkçe)', src: defaultSubUrl }];
    } else if (!s.subtitles.some(x => (x.label || '').includes('Türkçe') || x.src?.includes('/api/subtitles'))) {
      s.subtitles.push({ label: 'OpenSubtitles (Türkçe)', src: defaultSubUrl });
    }
  }

  for (const s of isNativeCapacitor() ? [] : currentSubtitled) {
    if (!Array.isArray(s.subtitles) || s.subtitles.length === 0) {
      s.subtitles = [{ label: 'OpenSubtitles (Türkçe)', src: defaultSubUrl }];
    }
  }

  // Clean deduplication
  const dedupeServers = (list) => {
    const seenKeys = new Set();
    const result = [];
    for (const s of list) {
      const idPrefix = (s.id || '').toLowerCase().split('_').slice(0, 2).join('_');
      const nameKey = (s.displayName || s.name || s.id).toLowerCase().trim();
      const key = `${idPrefix}||${nameKey}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        result.push(s);
      }
    }
    return result;
  };

  const finalDubbed = dedupeServers(currentDubbed).sort((a, b) => getStreamPriorityScore(a) - getStreamPriorityScore(b));
  const finalSubtitled = dedupeServers(currentSubtitled).sort((a, b) => getStreamPriorityScore(a) - getStreamPriorityScore(b));

  const payload = {
    dubbed: finalDubbed,
    subtitled: finalSubtitled,
    totalServers: finalDubbed.length + finalSubtitled.length,
    isComplete: true,
    // Sureli baglantilar (DS HLS vb.) bayatlayabilir; listedeki yas
    // oto-baslatma kararinda kullanilir.
    cachedAt: Date.now()
  };

  if (payload.totalServers > 0) {
    streamServersCache.set(cacheKey, payload);
    try {
      sessionStorage.setItem(`cp_streams_${CACHE_VERSION}_${cacheKey}`, JSON.stringify(payload));
    } catch (_) {}
  }

  onUpdate(payload);
  return payload;
}

export const getStreamingServers = getStreamingServersProgressive;
