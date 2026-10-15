/* ==========================================================================
   CinePulse Studio - "Çünkü bunu izledin" kişisel satır çekirdeği (SAF MODÜL)
   - Netflix analiz raporu Öneri #1 (notlar/netflix-ozellik-analizi.md §C).
   - DOM/window yok: önbellek deposu (localStorage benzeri) parametreyle
     enjekte edilir, böylece node --test ile ağsız/DOM'suz test edilir.
   - Girdi şekli: storage.js getGroupedWatchHistory()/getFavorites() kayıtları
     ({ id, title|name, type|media_type ('tv'|'movie'|'anime'), lastWatchedAt }).
   ========================================================================== */

/** Öneri sonucu önbellek ömrü: 6 saat (rapor §C-Öneri1 madde 3: CF'siz istemci). */
export const KISISSEL_RAIL_TTL_MS = 6 * 3600 * 1000;

/** Tek kişisel satır tipi (MVP: TEK yatay satır). */
export const KISISSEL_SATIR_TIPI = 'cunku-izledin';

/**
 * Kayıt türünü TMDB recommendations ucuna uygun türe indirger.
 * TMDB'de yalnız /tv|movie/{id}/recommendations vardır; anime tv olarak çekilir
 * (DetailView.js normalize mantığıyla aynı: anime → tv).
 */
function turNormalize(kayit) {
  const ham = kayit?.type ?? kayit?.media_type ?? '';
  const t = String(ham).toLowerCase();
  if (t === 'movie') return 'movie';
  return 'tv';
}

function adCoz(kayit) {
  const ad = kayit?.title ?? kayit?.name ?? kayit?.original_title ?? kayit?.original_name ?? '';
  return String(ad ?? '').trim();
}

function idCoz(kayit) {
  const ham = kayit?.tmdbId ?? kayit?.id;
  if (ham === undefined || ham === null) return null;
  if (typeof ham === 'number' && Number.isFinite(ham)) return ham;
  const metin = String(ham).trim();
  if (!metin) return null;
  const sayi = Number(metin);
  return Number.isFinite(sayi) && metin !== '' ? sayi : metin;
}

/**
 * Tohum seçimi: en son izlenen farklı yapımlardan en fazla `maks` tane.
 * Sıra: önce `gecmis` (zaten lastWatchedAt'e göre yeniden eskiye sıralı gelir),
 * yetmezse `favoriler` ile doldur. Aynı tmdbId bir kez sayılır; idsiz/adsız
 * kayıtlar atlanır.
 *
 * @param {Array} gecmis - getGroupedWatchHistory() çıktısı
 * @param {Array} favoriler - getFavorites() çıktısı
 * @param {{maks?: number}} secenekler
 * @returns {Array<{tur:'tv'|'movie', tmdbId:(number|string), ad:string}>}
 */
export function tohumSec(gecmis = [], favoriler = [], { maks = 2 } = {}) {
  const limit = Number.isFinite(Number(maks)) && Number(maks) > 0 ? Math.floor(Number(maks)) : 2;
  const tohumlar = [];
  const gorulen = new Set();
  const adaylar = [...(Array.isArray(gecmis) ? gecmis : []), ...(Array.isArray(favoriler) ? favoriler : [])];
  for (const kayit of adaylar) {
    if (tohumlar.length >= limit) break;
    if (!kayit || typeof kayit !== 'object') continue;
    const tmdbId = idCoz(kayit);
    if (tmdbId === null) continue;
    const anahtar = String(tmdbId);
    if (gorulen.has(anahtar)) continue;
    const ad = adCoz(kayit);
    if (!ad) continue;
    gorulen.add(anahtar);
    tohumlar.push({ tur: turNormalize(kayit), tmdbId, ad });
  }
  return tohumlar;
}

/**
 * Öneri önbellek anahtarı üretici.
 * Şema: `cinepulse_kisisel_{satirTipi}_{tur}_{tmdbId}` (profil ayrımı gerekmez:
 * yazan taraf zaten profil-ad-alanlı geçmişten tohum seçer).
 */
export function onbellekAnahtari(satirTip, tohum) {
  const tip = String(satirTip ?? KISISSEL_SATIR_TIPI).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || KISISSEL_SATIR_TIPI;
  const tur = tohum?.tur === 'movie' ? 'movie' : 'tv';
  const kimlik = tohum?.tmdbId === undefined || tohum?.tmdbId === null ? 'yok' : String(tohum.tmdbId).trim() || 'yok';
  return `cinepulse_kisisel_${tip}_${tur}_${kimlik}`;
}

/** onbellekAnahtari ile aynı: görev metnindeki kısa ad (takma ad). */
export const onKartlar = onbellekAnahtari;

/**
 * Önbellekten öneri listesi okur. Yok/bozuk/süresi dolmuş/boş ise null.
 * Bozuk JSON'a toleranslıdır (atmaz, null döner).
 *
 * @param {{getItem:Function}|null} depo - localStorage benzeri (enjekte)
 * @param {string} anahtar
 * @param {Function} simdiFn - test edilebilirlik için enjekte saat (varsayılan Date.now)
 */
export function cacheOku(depo, anahtar, simdiFn = Date.now) {
  try {
    if (!depo || typeof depo.getItem !== 'function' || !anahtar) return null;
    const ham = depo.getItem(anahtar);
    if (!ham || typeof ham !== 'string') return null;
    const coz = JSON.parse(ham);
    const kaydedildi = Number(coz?.savedAt);
    if (!Number.isFinite(kaydedildi)) return null;
    const simdi = typeof simdiFn === 'function' ? simdiFn() : Date.now();
    if (simdi - kaydedildi > KISISSEL_RAIL_TTL_MS) return null;
    const veri = coz?.veri;
    if (!Array.isArray(veri) || veri.length === 0) return null;
    return veri;
  } catch (_) {
    return null;
  }
}

/**
 * Öneri listesini önbelleğe yazar. Başarısız/depo-yok/boş-liste durumunda
 * false döner, asla atmaz.
 */
export function cacheYaz(depo, anahtar, veri, simdiFn = Date.now) {
  try {
    if (!depo || typeof depo.setItem !== 'function' || !anahtar) return false;
    if (!Array.isArray(veri) || veri.length === 0) return false;
    const simdi = typeof simdiFn === 'function' ? simdiFn() : Date.now();
    depo.setItem(anahtar, JSON.stringify({ savedAt: simdi, veri }));
    return true;
  } catch (_) {
    return false;
  }
}

/** Rail başlığı: "Çünkü {ad} izledin" (gerekçeli başlık, rapor §C madde 4). */
export function satirBasligi(ad) {
  const temiz = String(ad ?? '').trim();
  return temiz ? `Çünkü ${temiz} izledin` : 'Çünkü bunu izledin';
}
