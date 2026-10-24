/* ==========================================================================
   CinePulse Studio - Recap Card Decision Module
   Saf modül: girdi {sezon, bolum, oncekiOverview?, suankiOverview?, ad} + tercihler
   → karar: göster/gösterme + içerik
   Kurallar: yalnız dizi + sezon>bolum>1 + önceki bölüm özeti GERÇEKTEN var ise
   ========================================================================== */

const RECAP_STORAGE_KEY = 'cinepulse_recap_seen_v1';
const MAX_RECAP_ENTRIES = 200;

/** ≤220 karakter, kelime sınırında kırp */
export function kisaltMetin(metin, max = 220) {
  if (!metin || metin.length <= max) return metin || '';
  const kırp = metin.slice(0, max);
  const sonBosluk = kırp.lastIndexOf(' ');
  return sonBosluk > 0 ? kırp.slice(0, sonBosluk) + '…' : kırp + '…';
}

/** localStorage'tan "bu bölüm recap görüldü" map'ini oku */
function seenMapOku() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return new Map();
    const raw = window.localStorage.getItem(RECAP_STORAGE_KEY);
    if (!raw) return new Map();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return new Map();
    return new Map(Object.entries(parsed));
  } catch (_) {
    return new Map();
  }
}

/** localStorage'a "bu bölüm recap görüldü" yaz (200 girdi aşınca eski yarı sil) */
function seenMapYaz(map) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    // 200 girdi aşınca eski yarı sil
    if (map.size > MAX_RECAP_ENTRIES) {
      const entries = Array.from(map.entries());
      const yarisi = Math.floor(entries.length / 2);
      const yeniEntries = entries.slice(yarisi);
      map = new Map(yeniEntries);
    }
    const obj = Object.fromEntries(map);
    window.localStorage.setItem(RECAP_STORAGE_KEY, JSON.stringify(obj));
  } catch (_) {}
}

/** Recap gösterilip gösterilmeyeceğine karar ver
 *  @param {Object} girdi
 *  @param {number} girdi.sezon - Sezon numarası (1-based)
 *  @param {number} girdi.bolum - Bölüm numarası (1-based)
 *  @param {string} [girdi.oncekiOverview] - Önceki bölümün overview'ı
 *  @param {string} [girdi.suankiOverview] - Mevcut bölümün overview'ı (kullanılmaz, sadece imza için)
 *  @param {string} [girdi.ad] - Dizi adı (sadece log/debug için)
 *  @param {Object} [tercihler={}]
 *  @param {boolean} [tercihler.gosterildiMi] - Aynı bölüm için tekrar gösterme kararı çağırana bırakılır
 *  @returns {{goster: boolean, baslik: string, metin: string}}
 */
export function recapKararVer({ sezon, bolum, oncekiOverview, suankiOverview, ad }, tercihler = {}) {
  const { gosterildiMi = false } = tercihler;

  // 1. Sadece dizi için (sezon/bolum > 1 kontrolü zaten bunu kapsar ama explicit olsun)
  if (!sezon || !bolum) {
    return { goster: false, baslik: '', metin: '' };
  }

  // 2. Sezon 1, Bölüm 1 ise önceki bölüm yok
  if (sezon === 1 && bolum === 1) {
    return { goster: false, baslik: '', metin: '' };
  }

  // 3. Aynı bölüm için zaten gösterildiyse gösterme (çağıran karar verir)
  if (gosterildiMi) {
    return { goster: false, baslik: '', metin: '' };
  }

  // 4. Önceki bölüm overview'i GERÇEKTEN var mı? (boş/undefined/null değil)
  const oncekiVar = oncekiOverview && oncekiOverview.trim().length > 0;
  if (!oncekiVar) {
    return { goster: false, baslik: '', metin: '' };
  }

  // 5. Tüm koşullar sağlandı → göster
  const baslik = `Önceki Bölüm Özeti`;
  const metin = kisaltMetin(oncekiOverview.trim());

  return { goster: true, baslik, metin };
}

/** "Bu bölüm recap görüldü" işaretle */
export function recapGorulduIsaretle(tmdbId, sezon, bolum) {
  if (!tmdbId || !sezon || !bolum) return;
  const map = seenMapOku();
  const key = `${tmdbId}:s${sezon}:e${bolum}`;
  map.set(key, Date.now());
  seenMapYaz(map);
}

/** "Bu bölüm recap görüldü mü?" sorgula */
export function recapGorulduMu(tmdbId, sezon, bolum) {
  if (!tmdbId || !sezon || !bolum) return false;
  const map = seenMapOku();
  const key = `${tmdbId}:s${sezon}:e${bolum}`;
  return map.has(key);
}

/** Recap storage'ı temizle (test/debug için) */
export function recapStorageTemizle() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(RECAP_STORAGE_KEY);
    }
  } catch (_) {}
}