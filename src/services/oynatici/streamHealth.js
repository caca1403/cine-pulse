/* ==========================================================================
   CinePulse Studio — Akış Sağlığı (stream health)
   --------------------------------------------------------------------------
   Oynatıcının "akış ne durumda" sorusunun TEK, saf, test edilebilir cevabı.
   Amaç: PlayerModal içine dağılmış durum yorumlarını (hazırPlayerStartedPlaying,
   lastHlsProgressAt, hlsClockAdvanced, üç ayrı zaman aşımı sabiti) tek yerde
   toplamak; gözlenebilir olaylardan bir durum enum'u türetmek.

   TASARIM KURALI: saf fonksiyonlar. `Date.now()` ve `document` YOK — zaman
   ve medya durumu ARGÜMAN olarak verilir. Bu yüzden node --test ile ağsız,
   DOM'suz, deterministik test edilir.

   Durum sözleşmesi (gözlenebilir davranış; rakip motorun kod değil şekli):
     IDLE        hiç oynatma isteği yapılmadı
     CONNECTING  istek atıldı, ilk veri yok
     BUFFERING   veri var ama ilerleme yok ( tampon doluyor)
     PLAYING     saat ilerliyor
     STALLED     oynuyordu, ilerleme koptu (eşik aşıldı)
     RECOVERING  hatadan sonra kurtarma deneniyor
     ERROR       kalıcı hata — failover gerekir
     ENDED       oynatma bitti
   ========================================================================== */

/** Akış sağlık durumları. Sıra `ağırlık` sırasıyla (düşükten yükseğe). */
export const SAGLIK = Object.freeze({
  IDLE: 'IDLE',
  CONNECTING: 'CONNECTING',
  BUFFERING: 'BUFFERING',
  PLAYING: 'PLAYING',
  STALLED: 'STALLED',
  RECOVERING: 'RECOVERING',
  ERROR: 'ERROR',
  ENDED: 'ENDED',
});

/** Kullanıcıya gösterilebilir tek satır (arayüz metni; kaynak adı taşımaz). */
export const SAGLIK_ETIKET = Object.freeze({
  IDLE: 'Bekliyor',
  CONNECTING: 'Bağlanıyor',
  BUFFERING: 'Tamponlanıyor',
  PLAYING: 'Oynatılıyor',
  STALLED: 'Akış dondu',
  RECOVERING: 'Kurtarılıyor',
  ERROR: 'Hata',
  ENDED: 'Bitti',
});

/** Sağlıktan karar: bu durumda failover gerekir mi? */
export const FAILOVER_GEREKEN = new Set([SAGLIK.STALLED, SAGLIK.ERROR]);

/**
 * Ortak durum türetme.
 *
 * @param {object} g
 * @param {boolean} [g.istendi]        oynatma isteği yapıldı mı (false → IDLE)
 * @param {boolean} [g.hata]          kalıcı hata var mı
 * @param {boolean} [g.bitti]         oynatma bitti mi
 * @param {boolean} [g.kurtariliyor]  hata sonrası kurtarma denemesi
 * @param {boolean} [g.saatIlerledi]  video saati ilerledi mi (clock advanced)
 * @param {boolean} [g.donduruldu]    ilerleme eşiği aşıldı (stall)
 * @param {boolean} [g.paused]        kullanıcı duraklattı
 * @param {number}  [g.tamponSn]      tampon içindeki saniye
 * @param {number}  [g.veriVar]       herhangi bir medya verisi geldi mi
 * @returns {string} SAGLIK değerlerinden biri
 */
export function saglikTuret(g = {}) {
  const {
    istendi = false,
    hata = false,
    bitti = false,
    kurtariliyor = false,
    saatIlerledi = false,
    donduruldu = false,
    paused = false,
    tamponSn = 0,
    veriVar = false,
  } = g;

  if (!istendi) return SAGLIK.IDLE;
  if (hata) return kurtariliyor ? SAGLIK.RECOVERING : SAGLIK.ERROR;
  if (bitti) return SAGLIK.ENDED;
  if (donduruldu) return SAGLIK.STALLED;
  if (saatIlerledi && !paused) return SAGLIK.PLAYING;
  if (saatIlerledi && paused) return SAGLIK.PLAYING;   // duraklatma hata değildir
  if (veriVar || tamponSn > 0) return SAGLIK.BUFFERING;
  return SAGLIK.CONNECTING;
}

/** Durumdan karar: bu anda failover tetiklenmeli mi? */
export function failoverGerekli(saglik) {
  return FAILOVER_GEREKEN.has(saglik);
}

/**
 * İlerleme durumu güncelleyici (saf durum makinesi).
 * Oynatıcının zamanlayıcıları bunu besler; `simdi` dışarıdan verilir.
 */
export function ilerlemeDurumu(onceki, { ilerledi, simdi, eşikMs }) {
  const g = onceki || { sonIlerleme: null, saatIlerledi: false };
  if (ilerledi) return { sonIlerleme: simdi, saatIlerledi: true };
  if (g.sonIlerleme === null) return { ...g, donduruldu: false };
  const donduruldu = simdi - g.sonIlerleme >= eşikMs;
  return { sonIlerleme: g.sonIlerleme, saatIlerledi: g.saatIlerledi, donduruldu };
}

/** Tanılama satırı (log/cihaz ölçümü için) — kaynak adı taşımaz. */
export function saglikRaporu(saglik, ek = {}) {
  const parcalar = [SAGLIK_ETIKET[saglik] || saglik];
  if (ek.tamponSn != null) parcalar.push(`tampon ${Math.round(ek.tamponSn)}s`);
  if (ek.gecikmeMs != null) parcalar.push(`gecikme ${Math.round(ek.gecikmeMs)}ms`);
  return parcalar.join(' · ');
}