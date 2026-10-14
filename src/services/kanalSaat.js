/* ==========================================================================
   CinePulse Studio - "Kanalım" Canlı Saat Ticker'ı
   --------------------------------------------------------------------------
   "ŞU AN YAYINDA" kartındaki geri sayımı 30 sn'de bir tazeler ve slot bitince
   otomatik yeniden çizim ister.

   Temizlik kuralı (kanal görünümü sızıntısı bırakmaz):
     * TÜM timer id'leri TEK bir kayıt defterinde (`AKTIF_TIMERLAR`) tutulur.
     * `durdur()` çağrıldığında id silinir (çift kayıt yok).
     * `hayattaMi()` false dönerse ticker KENDİ KENDİNİ durdurur (DOM'dan
       kopmuş görünüm = sızıntı değil).
     * Görünüm `hashchange` / `pagehide` / dispose sırasında `durdur()` çağırır.
   Bağımlılık yok, DOM'a yalnızca enjekte edilen `hayattaMi` üzerinden bakar.
   ========================================================================== */

/** Kayıt defteri: şu an yaşayan tüm kanal ticker timer id'leri. */
const AKTIF_TIMERLAR = new Set();

/**
 * Yaşayan ticker sayısı (sızıntı teşhisi / test kanıtı).
 * @returns {number}
 */
export function kanalAktifTimerSayisi() {
  return AKTIF_TIMERLAR.size;
}

/** Kayıt defterinin kimliği (testler: canlı sayımın aynı küme olduğunu doğrular). */
export function kanalTimerDefteri() {
  return AKTIF_TIMERLAR;
}

/**
 * Canlı saat ticker'ı başlatır.
 *
 * @param {object} secenek
 * @param {() => number} secenek.getSimdiDk günün dakikasını verir (view enjekte eder)
 * @param {(simdiDk:number) => boolean} [secenek.kontrol] true dönerse yeniden çizim gerekir
 * @param {(simdiDk:number) => void} [secenek.geriSayimGuncelle] yalnız geri sayım metni
 * @param {(simdiDk:number) => void} [secenek.yenile] tam yeniden çizim
 * @param {() => boolean} [secenek.hayattaMi] false → ticker kendini durdurur
 * @param {number} [secenek.araDkMs=30000] 30 saniye
 * @returns {{id:any, durdur:() => void, calisiyor:() => boolean}}
 */
export function kanalSaatTicker({
  getSimdiDk,
  kontrol = null,
  geriSayimGuncelle = null,
  yenile = null,
  hayattaMi = null,
  araDkMs = 30000
} = {}) {
  if (typeof getSimdiDk !== 'function') throw new TypeError('kanalSaatTicker: getSimdiDk zorunlu');

  const sure = Number(araDkMs) > 0 ? Number(araDkMs) : 30000;
  let durdu = false;

  const tik = () => {
    if (durdu) return;
    // Görünüm DOM'dan ayrıldıysa (rotasyon/kapanış) timer'ı bırak.
    if (typeof hayattaMi === 'function') {
      let yasiyor = true;
      try { yasiyor = hayattaMi() !== false; } catch (_) { yasiyor = true; }
      if (!yasiyor) { durdur(); return; }
    }
    let simdi = 0;
    try { simdi = Number(getSimdiDk()) || 0; } catch (_) { simdi = 0; }
    try {
      if (typeof geriSayimGuncelle === 'function') geriSayimGuncelle(simdi);
      if (typeof kontrol === 'function' && kontrol(simdi) === true) {
        if (typeof yenile === 'function') yenile(simdi);
      }
    } catch (_) {
      /* Çizim hatası ticker'ı öldürmez; bir sonraki tikte tekrar denenir. */
    }
  };

  const id = globalThis.setInterval(tik, sure);
  AKTIF_TIMERLAR.add(id);

  const durdur = () => {
    if (durdu) return;
    durdu = true;
    try { globalThis.clearInterval(id); } catch (_) { /* yok sayılır */ }
    AKTIF_TIMERLAR.delete(id);
  };

  return { id, durdur, calisiyor: () => !durdu };
}