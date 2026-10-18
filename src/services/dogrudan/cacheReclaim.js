/* ==========================================================================
   CinePulse — Disk önbellek geri alma (reclaim)
   --------------------------------------------------------------------------
   P2P tarafında yalnız "30 dk boşta kalan torrent'i sil" gibi zaman tabanlı
   bir temizlik vardı; çağırabileceğimiz açık bir geri alma yolu yoktu.
   Buradaki politika iki şeyi garanti eder:
     1) AKTİK AKIŞ KORUNUR — şu an oynayan/korumalı bir kaynağın parçaları
        asla hedefe düşürülmez.
     2) HEDEF ELDE EDİLEBİLİR — toplam bayt hedefin altındaysa en eski,
        korunmayan kaynaktan başlanarak serbest bırakılır.

   Saf fonksiyonlar: gerçekte dosya sistemi/istatistik yolları çağıran yer bunları
   kullanır, testte ise düz nesneler yeter.
   ========================================================================== */

/** Bir önbellek girdisinin beklenen şekli.
 *  { kimlik, bayt, sonKullanim, korumali?, etkin? } */
export function girdiKontrol(g) {
  return Boolean(g && typeof g.kimlik === 'string' && Number.isFinite(g.bayt) && g.bayt >= 0);
}

/** Koruma: etkin oynatma VEYA açıkça korumalı işaretli girdi asla silinmez. */
export function korumaliMi(g) {
  return Boolean(g?.etkin || g?.korumali);
}

/**
 * Serbest bırakılacak girdileri seç (en eskiden yeniye).
 * @param {object[]} girdiler
 * @param {object} [opts]
 * @param {number} [opts.hedefBayt]   toplamın düşürülmesi istenen bayt
 * @param {number} [opts.simdi]       şimdi (ms) — deterministiklik için argüman
 * @returns {{silinecek: object[], korunan: object[], hedefKalan: number}}
 */
export function reclaimPlanla(girdiler = [], opts = {}) {
  const { hedefBayt = 0, simdi = 0 } = opts;
  const gecerli = girdiler.filter(girdiKontrol);
  const toplam = gecerli.reduce((t, g) => t + g.bayt, 0);

  const silinecek = [];
  const korunan = [];
  let kalan = toplam;

  // KORUMA ÖNCE: etkin/korumalı girdiler listeden hiç çıkmaz
  for (const g of gecerli) {
    if (korumaliMi(g)) korunan.push(g);
  }
  const adaylar = gecerli
    .filter(g => !korumaliMi(g))
    .sort((a, b) => (a.sonKullanim ?? 0) - (b.sonKullanim ?? 0)); // en eski önce

  for (const g of adaylar) {
    if (kalan <= hedefBayt) break;
    silinecek.push(g);
    kalan -= g.bayt;
  }

  return { silinecek, korunan, hedefKalan: Math.max(0, kalan), baslangicToplam: toplam };
}

/** İçerik adı sızdırmayan özet (cihaz ölçümü / log). */
export function reclaimOzeti(plan) {
  return {
    silinecekAdet: plan.silinecek.length,
    silinecekBayt: plan.baslangicToplam - plan.hedefKalan,
    korunanAdet: plan.korunan.length,
    hedefKalanBayt: plan.hedefKalan,
  };
}

/** Zaman tabanlı temizlik: `bosMs` aşan KORUNMAYAN girdiler aday olur. */
export function bosGirdiler(girdiler = [], { simdi = 0, bosMs = 30 * 60 * 1000 } = {}) {
  return girdiler
    .filter(girdiKontrol)
    .filter(g => !korumaliMi(g))
    .filter(g => simdi - (g.sonKullanim ?? 0) >= bosMs)
    .sort((a, b) => (a.sonKullanim ?? 0) - (b.sonKullanim ?? 0));
}