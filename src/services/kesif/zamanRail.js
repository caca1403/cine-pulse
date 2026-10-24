/* ==========================================================================
   CinePulse Studio - Zaman railleri çekirdeği (SAF MODÜL)
   - notlar/parite-ve-farklilar.md #12: "Bugün neler var"/"Yakında" rail'leri.
   - DOM/window yok; `simdi` enjekte edilir → node --test ile ağsız/DOM'suz
     test edilebilir (personalRails.js desenine uygun).
   - Girdi: TMDB öğeleri karışımı ({id|tmdbId, release_date|first_air_date,...})
   - Çıkış: { bugun[], buHafta[], yakinda[] } — tarih alanı yoksa öğe hiçbir
     kola girmez (tarihsiz eleme); aynı TMDB id tek sayılır; her öğeye
     `_zamanTip: 'film'|'dizi'` etiketi eklenir (girdi mutasyona tabi tutulmaz).
   ========================================================================== */

/** "Bu hafta" kenarı: 7 gün. 7. gün DAHİLDIR (bugünden 7 gün sonra); 8. gün ve
   ilerisi zaten "yakında"dır. Geçmişteki tarih hiçbir kola girmez. */
export const ZAMAN_RAIL_BU_HAFTA_GUN = 7;

/** YYYY-MM-DD (veya ...T...) tarihini UTC gün koduna indirger; geçersiz/tarihsiz → null. */
function gunKodu(ham) {
  if (!ham) return null;
  const parca = String(ham).trim().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(parca)) return null;
  const tarih = new Date(`${parca}T00:00:00Z`); // tarih-only = UTC (ES2015+)
  if (!Number.isFinite(tarih.getTime())) return null;
  return Date.UTC(tarih.getUTCFullYear(), tarih.getUTCMonth(), tarih.getUTCDate());
}

function cozId(oge) {
  const ham = oge?.tmdbId ?? oge?.id;
  if (ham === undefined || ham === null) return null;
  if (typeof ham === 'number' && Number.isFinite(ham)) return ham;
  const metin = String(ham).trim();
  if (!metin) return null;
  const sayi = Number(metin);
  return Number.isFinite(sayi) ? sayi : null;
}

/** 'movie' → 'film', 'tv'/'anime' → 'dizi'; yoksa first_air_date varsa dizi, yoksa film. */
function cozTip(oge) {
  const t = String(oge?.media_type ?? oge?.type ?? '').toLowerCase();
  if (t === 'movie') return 'film';
  if (t === 'tv' || t === 'anime') return 'dizi';
  return oge.first_air_date ? 'dizi' : 'film';
}

/**
 * Ogeleri air_date/release_date'e göre kovalar.
 * @param {Array} ogeler - trending/katalog karışımı TMDB öğeleri
 * @param {number} simdi - test edilebilirlik için enjekte epoch-ms (varsayılan Date.now)
 * @returns {{bugun:Array, buHafta:Array, yakinda:Array}}
 */
export function zamanRail(ogeler = [], simdi = Date.now()) {
  const simdiKod = gunKodu(new Date(simdi).toISOString().slice(0, 10));
  const sonuclar = { bugun: [], buHafta: [], yakinda: [] };
  const gorulen = new Set();

  const ekle = (kova, oge) => {
    const kimlik = cozId(oge);
    if (kimlik === null || gorulen.has(String(kimlik))) return;
    gorulen.add(String(kimlik));
    kova.push({ ...oge, _zamanTip: cozTip(oge) });
  };

  for (const oge of ogeler) {
    if (!oge || typeof oge !== 'object') continue;
    const tarihKod = gunKodu(oge.release_date ?? oge.first_air_date ?? oge.air_date);
    if (tarihKod === null) continue; // tarihsiz/gecersiz tarih: ele
    const gunFarki = Math.round((tarihKod - simdiKod) / 86400000);
    if (gunFarki === 0) ekle(sonuclar.bugun, oge);
    else if (gunFarki >= 1 && gunFarki <= ZAMAN_RAIL_BU_HAFTA_GUN) ekle(sonuclar.buHafta, oge);
    else if (gunFarki > ZAMAN_RAIL_BU_HAFTA_GUN) ekle(sonuclar.yakinda, oge);
    // gunFarki < 0: geçmişteki → hiçbir kola girmez ("yakında" yalnız gelecektir)
  }

  return sonuclar;
}
