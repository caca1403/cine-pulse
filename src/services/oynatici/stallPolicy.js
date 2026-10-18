/* ==========================================================================
   CinePulse Studio — Durma (stall) politikası
   --------------------------------------------------------------------------
   Ölçülmüş zaman aşımları tek yerde. Bugün PlayerModal içinde üç ayrı sabit
   olarak dağınık duruyor:
     · FilmMaker akışı   8000 ms
     · DS kaynakları    15000 ms (ilk ilerleme 20000 ms)
     · HDF              18000 ms
   Bunlar ÖLÇÜLMÜŞ değerlerdir; varsayılanlar DEĞİŞMEZ. Ama artık tek yerden
   okunur, test edilebilir ve kaynak sınıfı başına değiştirilebilir.

   Kural: oynatıcı hiçbir koşulda `Date.now()` sabitini gömmez; buradan alır.
   ========================================================================== */

/** Kaynak sınıfı → eşikler (ms). Ölçülmüş mevcut davranışın karşılığı. */
export const VARSAYILAN_ESIK = Object.freeze({
  genel: 15000,
  ilkIlerleme: 20000,
  filmMakinesi: 8000,
  hdf: 18000,
});

/** Politika nesnesi — dondurulmuş, üstüne yazılamaz. */
export function politikaUret(ek = {}) {
  return Object.freeze({ ...VARSAYILAN_ESIK, ...ek });
}

/**
 * Belirli bir kaynak sınıfının eşiğini döndürür.
 * Bilinmeyen sınıf → `genel` (ölçülen DS davranışı).
 */
export function esikAl(politika, sinif) {
  const p = politika || politikaUret();
  switch (sinif) {
    case 'filmmakinesi':
    case 'FilmMaker':
      return p.filmMakinesi;
    case 'hdf':
    case 'HDFilmizle':
      return p.hdf;
    case 'ds':
    case 'Dizisol':
      return p.genel;
    default:
      return p.genel;
  }
}

/**
 * Beklenen ilerleme eşiği: ilk ilerleme daha uzun beklenir, sonrası kısadır.
 * @param {object} politika
 * @param {string} sinif
 * @param {boolean} saatIlerledi  şu ana kadar saat ilerledi mi
 */
export function beklemeEsigi(politika, sinif, saatIlerledi) {
  const p = politika || politikaUret();
  if (!saatIlerledi) return p.ilkIlerleme;
  return esikAl(p, sinif);
}

/** Politika doğrulaması — geçersiz değer erken yakalanır. */
export function politikaGecerli(politika) {
  if (!politika) return true;
  return Object.keys(VARSAYILAN_ESIK).every(
    k => typeof politika[k] === 'number' && Number.isFinite(politika[k]) && politika[k] >= 1000
  );
}