/* ==========================================================================
   CinePulse Studio — Kaynak toplayıcı (KISA DİZİ)
   --------------------------------------------------------------------------
   Eklenti/sağlayıcı katmanı söküldü: film, dizi, anime, çizgi film, belgesel
   ve P2P kaynak kovalayan tüm yollar kaldırıldı. Bu dosya yalnız kısa dizi
   (kısa drama) sağlayıcılarını çözer; arayüz geri kalan içerik türlerinde
   boş liste görür.

   KALAN KAYNAKLAR
     dramalar        → Dora   (dramalarScraper.js,  doğrudan CDN 1080p HLS)
     dramadizilerim  → Rhea   (dramaDizilerimScraper.js, dört ayrı hat)
   Anonim adlar tek yerden gelir: src/services/sourceLabels.js.

   SİLİNENLER (geri getirilmeyecek): src/providers/ (KAYIT), providerRuntime/,
   site sürücüleri, rectv/smashy/lookmovie/anizium/animecix/animetr/kidsvip/
   czgx/blgx/arhv/szd/vodm3u/torrent yolları, gömülü oynatıcı çözücüleri,
   kaynak öğrenme (sourceIntelligence) ve kaynak sıhhati (sourceReliability).
   ========================================================================== */

import { fetchDramaDizilerimEpisodeSources } from './dramaDizilerimScraper.js';
import { fetchDramalarEpisodeSources } from './dramalarScraper.js';
import { kaynakTara, gercekKaynakEtiketi } from '../../providers/vekil.js';
import { isNativeAndroidApp } from '../platform/platformBridge.js';
import { apiUrl } from '../altyapi/apiOrigin.js';

/** Çift dilli (Türkçe seslendirme + altyazı taşıyan) yayınları karşı dil
 *  listesinin girdisine çevirir. Yayınlayıcı katman tek yönlü çağırır. */

/* --------------------------------------------------------------------------
   KATMAN ANAHTARI — cihazda bellek/eşzamanlılık koruması
   43 çekirdek birden ateşlendiğinde telefonda bellek zirvesi ve eşzamanlı istek
   sayısı fırlıyor (ölçülen: 60 → 379 MB) ve arayüz kilitleniyordu. Asıl düzeltme
   sabit iş havuzudur (vekil HAVUZ_BOYU). Burası yalnız güvenlik anahtarı:
     localStorage.setItem('cp_kahraman', '0')  → katmanı kapat
     localStorage.setItem('cp_kahraman', '1')  → açık (varsayılan)
   -------------------------------------------------------------------------- */
export function kahramanKatmaniAcikMi() {
  try {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('cp_kahraman') === '0') return false;
  } catch (_) { /* gizli modda localStorage yok → varsayılan: açık */ }
  return true;
}

const IKI_DIL_MUSTERISI = /dual|trdual|trdub|dublaj/i;

/* YERLİ (Türk) sağlayıcı önekleri — kullanıcı kuralı (2026-10-18):
   "türk kaynaklarında dublaj/altyazı etiketi türkçe dublaj durumunu etiketler;
   yabancı kaynaklar direkt altyazı yazılır" (anizium dahil).
   Türk siteler içerik başlığında Türkçe Dublaj/Altyazı işareti taşır → kategori
   anlamlıdır. Yabancı siteler bu işareti taşımadığı için hepsi yanlışlıkla
   "dublaj" sayılıyordu. Liste src/providers/alanlar.js alan adlarına göre
   çıkarıldı (Türk .com.tr/.tv/.life/.vip/.now dizi-film-anime siteleri). */
const YERLI_ONEKLER = [
  'dml_', 'ddz_', 'dramalar_', 'dramadizilerim_', // kısa dizi (Türk)
  'sp_wolverine_', 'sp_antman_', 'sp_aquaman_', 'sp_batgirl_', 'sp_blackpanther_',
  'sp_blackwidow_', 'sp_captainamerica_', 'sp_cyborg_', 'sp_daredevil_', 'sp_deadpool_',
  'sp_doctorstrange_', 'sp_falcon_', 'sp_flash_', 'sp_greenlantern_', 'sp_harleyquinn_',
  'sp_hawkeye_', 'sp_hulk_', 'sp_ironfist_', 'sp_ironman_', 'sp_joker_', 'sp_loki_',
  'sp_lukecage_', 'sp_moonknight_', 'sp_nightwing_', 'sp_poisonivy_', 'sp_punisher_',
  'sp_shazam_', 'sp_spiderwoman_', 'sp_supergirl_', 'sp_thor_', 'sp_wintersoldier_',
  'sp_wonderwoman_',
];

/** Kaynak bir Türk sağlayıcıdan mı geliyor? (id öneki ile — alan adları
 *  src/providers/alanlar.js'te; gerçek site adı arayüze sızmaz.) */
export function yerliKaynakMi(srv) {
  const id = String(srv?.id || '').toLowerCase();
  return YERLI_ONEKLER.some(onek => id.startsWith(onek));
}

/* SES TİPİ — TESPİTE dayalı (kullanıcı 2026-10-18: "otomatik yabancıysa Türkçe
   yok gibi yapma; orijinalse öyle, Türkçe altyazı varsa öyle, dublaj gerçekten
   olsun"). Kaynak m3u8'indeki gerçek ses/altyazı izleri (`trSes` / `trAltyazi`,
   aşağıdaki izleriOlc ile doldurulur) ya da çekirdeğin `isDual` doğrulaması
   esas alınır; hiçbir Türkçe iz tespit edilemezse 'ozgun' (Özgün Dil) — sahte
   'Altyazı' iddiası YOK. Yerli (Türk) sitelerde kategori güvenilir olduğundan
   ona göre etiketlenir. */
export function sesTipiBul(srv, category = '') {
  if (!srv) return 'ozgun';
  const id = String(srv.id || '');
  if (id.endsWith('_xd')) return 'dublaj';    // bilinçli dublaj kopyası
  if (id.endsWith('_xs')) return 'altyazi';   // bilinçli altyazı kopyası
  if (srv.trSes || srv.isDual) return 'dublaj';   // gerçek Türkçe ses izi
  if (srv.trAltyazi) return 'altyazi';            // gerçek Türkçe altyazı izi
  if (yerliKaynakMi(srv)) return category === 'dubbed' ? 'dublaj' : 'altyazi';
  return 'ozgun';                                  // Türkçe iz yok → Özgün Dil
}

/** sesTipiBul çıktısının kullanıcıya görünen etiketi. */
export function sesTipiEtiketi(tip) {
  if (tip === 'dublaj') return '🇹🇷 Türkçe Dublaj';
  if (tip === 'altyazi') return '💬 Türkçe Altyazı';
  return '🌐 Özgün Dil';
}

/** Yayın adında/etiketinde altyazı işareti. Bulunursa yayın altyazı sekmesine
 *  sayılır; aksi hâlde seslendirme varsayılır (yanlış pozitif pahasına dar
 *  tutuldu: "sub" tek başına altalan adlarında da geçebiliyor). */
const ALTYAZI_ISARETI = /altyaz[iı]|subtitles?|sub-?bed|x-?sub|\bsub\.?s\b/i;

export function ciftDilKopyalari(eklenen, karsiKategori) {
  return (eklenen || [])
    .filter(s => s && (s.isDual || IKI_DIL_MUSTERISI.test(s.streamUrl || s.url || '')))
    .map(s => ({ ...s, id: `${s.id}_${karsiKategori === 'subtitled' ? 'xs' : 'xd'}`, category: karsiKategori }));
}

const CACHE_VERSION = 'v48';
const streamServersCache = new Map();

/** Kahraman katmanının desteklediği türler (kayıt bunları doğrular). */
// Kahraman katmanının tarayabildiği türler.
// ÖLÇÜLEN HATA (2026-10-16, kullanıcı: "animelerde hâlâ gözükmüyor, Naruto"):
// uygulama animeyi `type:'anime'` ile açıyor; bu küme yalnız movie/tv/series
// içerdiği için aşağıdaki kapı (satır ~173) TARAMA BAŞLAMADAN boş dönüyordu —
// "sanki hiç taramıyor gibi". Animeler/çizgi filmler sağlayıcılarda dizi gibi
// davranır; 'anime' ve çizgi film türleri artık taranır (çekirdeklere giden tür
// vekil.js'te 'tv'ye sadeleştirilir).
export const KAHRA_MAN_TURLERI = new Set([
  'movie', 'tv', 'series',
  'anime', 'animeseries', 'cizgifilm', 'cartoon', 'animation', 'kids',
]);

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

/** Jenerik anonim etiket: "Sunucu <harf> <kalite> <dil>". Harf, id/url'den
 *  türetilen sabit indekstir; aynı hat her seferinde aynı adı alır. Gerçek
 *  site adı etikete hiçbir koşulda çıkmaz. */
function formatStreamName(s, category = '') {
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

function formatStreamItem(s, category, fallbackName) {
  const streamUrl = s.streamUrl || s.url || (typeof s.getUrl === 'function' ? s.getUrl() : '') || '';
  const finalDisplayName = (formatStreamName(s, category) || fallbackName)
    .replace(/[\p{Extended_Pictographic}\p{Regional_Indicator}\uFE0F\u200D]/gu, '')
    .replace(/(?:Türkçe|TR)\s*(?:Dublaj|Altyazılı|Altyazı)|Dublaj|Altyazılı|Altyazı/gi, '')
    .replace(/\(\s*\)/g, '').replace(/\s+/g, ' ').trim();

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
    isDirectVideo: Boolean(s.isDirectVideo || s.isHls || /\.(m3u8|mp4|mkv|webm|m4s)(\?|#|$)/i.test(streamUrl)),
    // Chromium HEVC/H.265 çözemiyor; bu yayınlarda oynatma cihazın native
    // çözücüsüne devredilir (PlayerModal). H.264/HLS normal player'da kalır.
    cozunemezHecv: Boolean(s.cozunemezHecv),
    getUrl: () => streamUrl
  };
}

/** Yayın kabul kıstası: yalnız oynatılabilir doğrudan medya (m3u8/mp4/mkv)
 *  ve bizim proxy'mizden geçen adresler. Gömülü oynatıcı (iframe) listelenmez. */
function isValidStream(s) {
  const urlStr = (s?.url || s?.streamUrl || (typeof s?.getUrl === 'function' ? s.getUrl() : '') || '').toLowerCase();
  if (!urlStr || urlStr.length < 8) return false;
  if (s.isIframe || s.type === 'embed' || s.isSayfa || s.isPageEmbed) {
    return /\.(m3u8|mp4|mkv|webm|m4s|mpd)(\?|#|$)/i.test(urlStr) || /\/api\/(?:hls_proxy|proxy)[?#]/i.test(urlStr);
  }
  return true;
}

/** Kısa dizi hatları kendi CDN'inden gelir; sıralama doğrudan yayında kalite
 *  sırasına göre yapılır (1080p → 720p → 480p). */
function siralamaSkoru(s) {
  const hay = `${s.displayName || s.name || ''} ${s.streamUrl || s.url || ''}`.toLowerCase();
  const kalite = /\b(?:4k|2160p)\b/.test(hay) ? 0 : /\b1080p\b/.test(hay) ? 1 : /\b720p\b/.test(hay) ? 2 : /\b480p\b/.test(hay) ? 3 : 1;
  const dogrudan = /\.(m3u8|mp4|mkv|webm|m4s)(\?|#|$)/i.test(hay) || hay.includes('/api/hls_proxy') ? 0 : 5;
  return kalite + dogrudan;
}

/* TÜM KAYNAKLAR — GERÇEK ses/altyazı izi tespiti (kullanıcı 2026-10-18: "isDual
   tüm kaynaklar için yapılsın; orijinalse öyle yazsın, Türkçe altyazı varsa
   öyle, dublaj gerçekten dublaj olsun"). Master m3u8'deki #EXT-X-MEDIA satırları
   taranır: TYPE=AUDIO + Türkçe → dublaj; TYPE=SUBTITLES + Türkçe → altyazı.
   Yalnız OLUMLU kanıt etiketi yükseltir; tespit edilemezse kaynak 'Özgün Dil'
   kalır (sahte 'Altyazı' iddiası yok). En-iyi-çaba: sınırlı sayı + eşzamanlılık,
   yavaş-ağ tabanına takılmayan (AbortController) kısa zaman aşımı, URL önbelleği.
   Ağ çok yavaşsa/bu biçimde iz yoksa sessizce atlanır. */
const _izOlcum = new Map(); // streamUrl -> { ses, altyazi }
async function izleriOlc(streamUrl) {
  const key = String(streamUrl || '');
  if (!/\.m3u8(?:\?|#|$)|\/api\/(?:hls_proxy|proxy)\?/i.test(key)) return null;
  if (_izOlcum.has(key)) return _izOlcum.get(key);
  const sonuc = { ses: false, altyazi: false };
  try {
    const c = new AbortController();
    const zaman = setTimeout(() => { try { c.abort(); } catch (_) {} }, 5000);
    const res = await fetch(key, { signal: c.signal, headers: { 'User-Agent': 'Mozilla/5.0' } });
    clearTimeout(zaman);
    const metin = ((res && typeof res.text === 'function') ? await res.text() : '') || '';
    for (const satir of metin.split('\n')) {
      if (!/#EXT-X-MEDIA/i.test(satir)) continue;
      const tr = /LANGUAGE=(?:"|')(?:tr|tur)(?:"|')|(?:NAME|GROUP-ID)=(?:"|')[^"'|]*turk/i.test(satir);
      if (!tr) continue;
      if (/TYPE=AUDIO/i.test(satir)) sonuc.ses = true;
      else if (/TYPE=SUBTITLES/i.test(satir)) sonuc.altyazi = true;
    }
  } catch (_) { /* tespit yok → { ses:false, altyazi:false } */ }
  _izOlcum.set(key, sonuc);
  return sonuc;
}
async function izleriZenginlestir(liste) {
  const hedefler = (liste || []).filter(s => s && !s.isDual && !s.trSes && !s.trAltyazi
    && /\.m3u8|\/api\/(?:hls_proxy|proxy)/i.test(s.streamUrl || s.url || '')).slice(0, 12);
  if (!hedefler.length) return;
  const kuyruk = [...hedefler];
  const isci = async () => {
    while (kuyruk.length) {
      const s = kuyruk.shift();
      const iz = await izleriOlc(s.streamUrl || s.url);
      if (iz) { if (iz.ses) { s.trSes = true; s.isDual = true; } if (iz.altyazi) s.trAltyazi = true; }
    }
  };
  await Promise.all(Array.from({ length: Math.min(3, hedefler.length) }, isci));
}

/**
 * Kaynak taraması. Kısa dizi dışında hiçbir içerik türü kaynak üretmez.
 */
export async function getStreamingServersProgressive({
  type = 'movie',
  tmdbId = null,
  imdbId = '',
  title = '',
  originalTitle = '',
  seriesTitle = '',
  season = 1,
  episode = 1,
  onUpdate = () => {}
}) {
  const targetTitle = cleanTitle(seriesTitle || title);
  const cacheKey = `${type}_${tmdbId || targetTitle}_s${season}_e${episode}`;

  const kisaDizi = Boolean(
    (tmdbId && (String(tmdbId).startsWith('ddz_') || String(tmdbId).startsWith('dml_'))) ||
    type === 'short-drama'
  );

  const bos = { dubbed: [], subtitled: [], totalServers: 0, isComplete: true, cachedAt: Date.now() };

  // Kısa dizi değilse yalnız kahraman katmanının desteklediği türler taranır.
  if (!kisaDizi && !KAHRA_MAN_TURLERI.has(String(type).toLowerCase())) {
    onUpdate(bos);
    return bos;
  }

  if (streamServersCache.has(cacheKey)) {
    onUpdate({ ...streamServersCache.get(cacheKey), isComplete: false, fromCache: true });
    streamServersCache.delete(cacheKey);
    try { sessionStorage.removeItem(`cp_streams_${CACHE_VERSION}_${cacheKey}`); } catch (_) {}
  }

  const slug = tmdbId ? String(tmdbId).replace(/^(ddz_|dml_)/, '') : '';
  const candidateTitles = [...new Set([targetTitle, cleanTitle(targetTitle), originalTitle, cleanTitle(originalTitle), slug, tmdbId].filter(Boolean))];

  let currentDubbed = [];
  let currentSubtitled = [];
  const seenUrls = { dubbed: new Set(), subtitled: new Set() };
  /* YİNELENEN AYNI-KAYNAK ELEME (kullanıcı 2026-10-18: "40 kaynağın 8'i dublaj,
     8'in 4'ü aynı kaynaktan"). Farklı sağlayıcılar çoğu zaman AYNI altyapıya
     (iframe/CDN host'una) çıkar; bunlar ayrı kaynak gibi sayılıyordu. Artık her
     dil kümesinde aynı host+kalite bir kez tutulur (proxy içindeki gerçek adres
     çözülür). Kalite varyantları ve dublaj/altyazı ayrımı KORUNUR. */
  const seenHost = { dubbed: new Set(), subtitled: new Set() };
  const kaynakHostu = (u) => {
    let s = String(u || '');
    for (let i = 0; i < 3; i++) {              // /proxy?url=<iç> → iç adresi çöz
      const m = s.match(/[?&]url=([^&]+)/i);
      if (!m) break;
      let ic = m[1];
      try { ic = decodeURIComponent(ic); } catch (_) {}
      if (ic === s) break;
      s = ic;
    }
    try { return new URL(s, 'http://yerel').host.toLowerCase(); } catch (_) { return s.slice(0, 80).toLowerCase(); }
  };
  const kaliteTokeni = (s) => {
    const hay = `${s.displayName || s.name || ''} ${s.streamUrl || s.url || ''}`.toLowerCase();
    return /\b(?:4k|2160p)\b/.test(hay) ? '4k' : /\b1080p\b/.test(hay) ? '1080' : /\b720p\b/.test(hay) ? '720' : /\b480p\b/.test(hay) ? '480' : 'x';
  };

  const addStreams = (rawList, category, derin = false) => {
    if (!Array.isArray(rawList) || !rawList.length) return [];
    const added = [];
    for (const raw of rawList.filter(isValidStream)) {
      // ÖLÇÜLEN HATA (2026-10-16): etiket SABİTTİ ('VIP 1080p' / 'VIP
      // Altyazılı')ydi; yayının gerçek kalitesi/dili ne olursa olsun o yazılıyordu.
      // Bu yüzden sayaçlar yanlış çıkıyor ve iki sekme de aynı içerikleri
      // gösteriyordu. Artık etiket çekirdeğin verdiği metinden türetilir.
      const gercekEtiket = gercekKaynakEtiketi(raw, category);
      const item = formatStreamItem(raw, category, gercekEtiket);
      const key = `${(item.id || '').split('_').slice(0, 2).join('_')}||${(item.streamUrl || '').toLowerCase()}`;
      if (seenUrls[category].has(key)) continue;
      seenUrls[category].add(key);
      const hostKey = `${kaynakHostu(item.streamUrl || item.url)}|${kaliteTokeni(item)}`;
      if (seenHost[category].has(hostKey)) continue;   // aynı altyapı + kalite → tekrar
      seenHost[category].add(hostKey);
      (category === 'dubbed' ? currentDubbed : currentSubtitled).push(item);
      added.push(item);
    }
    if (added.length) {
      currentDubbed.sort((a, b) => siralamaSkoru(a) - siralamaSkoru(b));
      currentSubtitled.sort((a, b) => siralamaSkoru(a) - siralamaSkoru(b));
      if (!derin) {
        const kopyalar = ciftDilKopyalari(added, category === 'dubbed' ? 'subtitled' : 'dubbed');
        if (kopyalar.length) addStreams(kopyalar, category === 'dubbed' ? 'subtitled' : 'dubbed', true);
      }
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

  // ── kahraman sağlayıcı katmanı (film / dizi) ──────────────────────
  // Kısa dizi hattı DEĞİLDİRSE tüm kayıtlar (kahraman koduyla) taranır.
  // Yalnız doğrudan m3u8/mp4 listelenir; gömülü oynatıcı ve ölü yayın elenir.
  //
  // KISA DİZİ GARANTİSİ: tarama 75 sn'ye kadar sürebilir. Dora/Rhea hatları
  // bu taramanın ARKASINDA bekletilemezdi — kahraman taraması başlatılır ama
  // AŞAĞIDaki Promise.allSettled'a katılır, yani kısa diziyle AYNI ANDA koşar.
  let kahramanTaramasi = null;
  if (!kisaDizi && kahramanKatmaniAcikMi()) {
    kahramanTaramasi = kaynakTara({
      tur: String(type).toLowerCase(),
      tmdbId: String(tmdbId || '').replace(/^(ddz_|dml_)/, ''),
      imdbId: String(imdbId || '').trim(),
      season,
      episode,
      izleyici: is => {
        if (!is?.kaynaklar?.length) return;
        // Sekme seçimi yayına bakarak yapılır (Nuvio'nun API-Source sınıflandırması
        // gibi): altyazı işareti taşıyan yayın altyazı sekmesine, diğerleri
        // seslendirme sekmesine sayılır. Yayınlayıcı adı hiçbir yerde sızmez.
        const altyazili = is.kaynaklar.filter(s =>
          ALTYAZI_ISARETI.test(`${s?.title || ''} ${s?.category || ''} ${s?.url || s?.streamUrl || ''}`));
        const sesli = is.kaynaklar.filter(s => !altyazili.includes(s));
        if (sesli.length) addStreams(sesli, 'dubbed');
        if (altyazili.length) addStreams(altyazili, 'subtitled');
      },
    })
      .then(tara => {
        const sure = Math.round(tara.sure / 100) / 10;
        console.info(`[kaynak] ${tara.izlener.length}/${tara.toplam ?? '?'} kayit tarandi (${sure}s)`);
        return tara;
      })
      .catch(() => null);
  }

  await Promise.allSettled([
    kahramanTaramasi,
    // Dora — kesintisiz CDN 1080p HLS
    kisaDizi && fetchDramalarEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, season, episode, isDub: true })
      .then(res => addStreams(res, 'dubbed')).catch(() => []),
    kisaDizi && fetchDramalarEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, season, episode, isDub: false })
      .then(res => addStreams(res, 'subtitled')).catch(() => []),
    // Rhea — NetShort / FlexTV / DramaBox hatları
    kisaDizi && fetchDramaDizilerimEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, season, episode, isDub: true })
      .then(res => addStreams(res, 'dubbed')).catch(() => []),
    kisaDizi && fetchDramaDizilerimEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, season, episode, isDub: false })
      .then(res => addStreams(res, 'subtitled')).catch(() => [])
  ]);

  // Türkçe altyazı yedeği: bizim altyazı ucumuz her hat için geçerlidir.
  const altYol = `${apiUrl('/api/subtitles')}?tmdbId=${encodeURIComponent(tmdbId || '')}&title=${encodeURIComponent(targetTitle)}&season=${season}&episode=${episode}&type=tv`;
  for (const s of [...currentDubbed, ...currentSubtitled]) {
    if (!Array.isArray(s.subtitles) || s.subtitles.length === 0) {
      s.subtitles = [{ label: 'OpenSubtitles (Türkçe)', src: altYol }];
    }
  }

  // TÜM kaynaklar için gerçek ses/altyazı izi tespiti (yukarıdaki izleriOlc).
  // Kaynaklar zaten ilerlemeli olarak listelendi; bu yalnız etiketleri düzeltir.
  try { await izleriZenginlestir([...currentDubbed, ...currentSubtitled]); } catch (_) {}

  const payload = {
    dubbed: currentDubbed,
    subtitled: currentSubtitled,
    totalServers: currentDubbed.length + currentSubtitled.length,
    isComplete: true,
    cachedAt: Date.now()
  };
  if (payload.totalServers > 0) {
    streamServersCache.set(cacheKey, payload);
    try { sessionStorage.setItem(`cp_streams_${CACHE_VERSION}_${cacheKey}`, JSON.stringify(payload)); } catch (_) {}
  }
  onUpdate(payload);
  return payload;
}

export const getStreamingServers = getStreamingServersProgressive;
