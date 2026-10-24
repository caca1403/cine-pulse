/* ==========================================================================
   CinePulse Studio - Türkçe doğal-dil arama parseri (istemci tarafı, SAF)
   - Sorguyu TMDB /discover filtrelerine çevirir. LLM yok, yeni servis yok.
   - Tanınan anahtar kelime yoksa null döner: mevcut searchMulti akışı hiç
    bir şekilde etkilenmez.
   - Tür kimlikleri src/services/icerik/tmdbApi.js'deki
     GENRE_MAP_MOVIE / GENRE_MAP_TV haritalarıyla AYNI değerler.
   ========================================================================== */

const TIP_FILM = new Set(['film', 'movie', 'sinema']);
const TIP_DIZI = new Set(['dizi', 'diziler', 'sezon', 'bolum', 'bölüm']);

const YIL_SONRA = /(\d{4})['’]?\s*(dan|den)?\s*(sonra|sonrasi)\b/i;
const YIL_ONCE = /(\d{4})['’]?\s*(dan|den)?\s*(once|oncesi)\b/i;

// Türkçe anahtar kelime → tür kimliği. Id'ler tmdbApi.js genre haritalarıyla
// aynı (uydurulmamış). not: sözlükte "gerilim→53/9648" → filmde 53 (thriller),
// dizide en yakın eş 9648 (mystery).
const GENRE_KELIMELERI = [
  { anahtar: 'korku', film: 27, etiket: 'Korku' },
  { anahtar: 'gerilim', film: 53, tv: 9648, etiket: 'Gerilim' },
  { anahtar: 'romantik', film: 10749, etiket: 'Romantik' },
  { anahtar: 'ask', film: 10749, etiket: 'Romantik' },
  { anahtar: 'komedi', film: 35, tv: 35, etiket: 'Komedi' },
  { anahtar: 'bilim kurgu', film: 878, tv: 10765, etiket: 'Bilim Kurgu' },
  { anahtar: 'bilimkurgu', film: 878, tv: 10765, etiket: 'Bilim Kurgu' },
  { anahtar: 'fantastik', film: 14, tv: 10765, etiket: 'Fantastik' },
  { anahtar: 'aksiyon', film: 28, tv: 10759, etiket: 'Aksiyon' },
  { anahtar: 'animasyon', film: 16, tv: 16, etiket: 'Animasyon' },
  { anahtar: 'cocuk', film: 16, tv: 16, etiket: 'Çocuk' },
  { anahtar: 'aile', film: 10751, tv: 10751, etiket: 'Aile' },
  { anahtar: 'cocukla', film: 10751, tv: 10751, etiket: 'Aile' },
  { anahtar: 'dram', film: 18, tv: 18, etiket: 'Dram' },
  { anahtar: 'suç', film: 80, tv: 80, etiket: 'Suç' },
  { anahtar: 'suc', film: 80, tv: 80, etiket: 'Suç' },
  { anahtar: 'belgesel', film: 99, tv: 99, etiket: 'Belgesel' },
  { anahtar: 'macera', film: 12, tv: 10759, etiket: 'Macera' },
];

const CEVIR = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' };
function normalize(metin) {
  // 'İ'.toLowerCase() -> 'i̇' (i + combining nokta): işaretleri at, aksi halde
  // kelime sınırı kırılıyor (Türkçe case-folding kavgası).
  return metin
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[çğıöşü]/g, ch => CEVIR[ch]);
}
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
const GENRE_REGEXLERI = GENRE_KELIMELERI.map(g => ({
  ...g,
  re: new RegExp('\\b' + escapeRegExp(g.anahtar) + '\\b')
}));

/**
 * @param {string} sorgu
 * @returns {null|{ sorguKalan: string, tur: 'film'|'dizi'|null,
 *   turler: number[], yilMin?: number, yilMaks?: number,
 *   onayEtiketleri: string[] }}
 */
export function parseDilArama(sorgu) {
  if (typeof sorgu !== 'string') return null;
  const ham = sorgu.trim();
  if (!ham) return null;

  const norm = normalize(ham);

  // 1. Tür (film/dizi) — kelime sırası, son eşleşme geçerli.
  let tur = null;
  for (const kelime of norm.split(/[^\w]+/).filter(Boolean)) {
    if (TIP_DIZI.has(kelime)) tur = 'dizi';
    else if (TIP_FILM.has(kelime)) tur = 'film';
  }

  // 2. Türler (repo haritası id'leri; tür seçimine göre film/dizi id'i)
  const turler = [];
  const etiketler = [];
  const idler = new Set();
  const kelimeKokleri = [];
  for (const g of GENRE_REGEXLERI) {
    if (!g.re.test(norm)) continue;
    const id = tur === 'dizi' && g.tv != null ? g.tv : g.film;
    if (id == null || idler.has(id)) continue;
    idler.add(id);
    turler.push(id);
    etiketler.push(g.etiket);
    kelimeKokleri.push(g.anahtar);
  }

  // 3. Yıl
  let yilMin, yilMaks;
  const ms = norm.match(YIL_SONRA);
  if (ms) { yilMin = Number(ms[1]); kelimeKokleri.push(ms[0]); }
  const mo = norm.match(YIL_ONCE);
  if (mo) { yilMaks = Number(mo[1]); kelimeKokleri.push(mo[0]); }

  // Tür kelimelerini de çıkarma havuzuna ekle
  for (const kelime of norm.split(/[^\w]+/).filter(Boolean)) {
    if (TIP_DIZI.has(kelime) || TIP_FILM.has(kelime)) kelimeKokleri.push(kelime);
  }

  if (turler.length === 0 && yilMin == null && yilMaks == null) return null;

  // 4. Kalan sorgu (ekranda gösterilmez; ayrıntılı keşif için)
  let kalan = norm;
  for (const kok of kelimeKokleri) {
    kalan = kalan.replace(new RegExp('\\b' + escapeRegExp(kok) + '\\b', 'g'), ' ');
  }
  kalan = kalan.replace(/\s+/g, ' ').trim();

  const sonuc = { sorguKalan: kalan, tur, turler, onayEtiketleri: etiketler };
  if (yilMin != null) sonuc.yilMin = yilMin;
  if (yilMaks != null) sonuc.yilMaks = yilMaks;
  return sonuc;
}
