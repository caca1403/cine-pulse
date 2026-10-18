/**
 * nextEpisodePolicy.js — Saf decision module for next-episode autoplay & post-play.
 *
 * Input:  { autoplayNext:boolean, kalanSn:number, sezonMu:boolean, finalBolumMu:boolean, kullaniciEtkilestimi?:boolean }
 * Output: { gec: 'otomatik'|'beklet'|'kapat', gerekce: string }
 *
 * Kurallar (priority order):
 *   1) autoplayNext=false            → 'kapat'       (ayar açık kapatılmış)
 *   2) finalBolumMu=true             → 'beklet'      (son bölüm — post-play kartı gösterilecek)
 *   3) kalanSn < 3                   → 'otomatik'    (sRemaining < 3 sn — hemen oynat)
 *   4) kullaniciEtkilestimi=true     → 'beklet'      (kullanıcı elle gezindi — bırak)
 *   5) default                       → 'otomatik'
 */

export function evaluateNextEpisode({
  autoplayNext = true,
  kalanSn = 0,
  sezonMu = false,
  finalBolumMu = false,
  kullaniciEtkilestimi = false,
}) {
  // 1) Ayar kapalı → tamamen kapat
  if (autoplayNext === false) {
    return {
      gec: 'kapat',
      gerekce: 'AutoplayNext ayarı kapalı, sonraki bölüm otomatik geçilmiyor.',
    };
  }

  // 2) Son bölüm → beklet (post-play kartı göstereceğiz)
  if (finalBolumMu === true) {
    return {
      gec: 'beklet',
      gerekce: 'Son bölüm tespit edildi, post-play kartı gösterilecek.',
    };
  }

  // 3) Kalan süre < 3 sn → otomatik Geç
  if (kalanSn < 3) {
    return {
      gec: 'otomatik',
      gerekce: `Kalan süre ${kalanSn} sn, following episode oynatılıyor.`,
    };
  }

  // 4) Kullanıcı elle gezindiyse → bırak
  if (kullaniciEtkilestimi === true) {
    return {
      gec: 'beklet',
      gerekce: 'Kullanıcı oynayınca elle gezindi, sonraki bölüm bekletildi.',
    };
  }

  // 5) Default: otomatik geç
  return {
    gec: 'otomatik',
    gerekce: 'Varsayılan comport: sonraki bölüm otomatik oynatılıyor.',
  };
}

/**
 * Policy kararlarının Türkçe özet tablosu (report/readme için).
 */
export const POLICY_TABLE = {
  kapat: {
    koşul: 'autoplayNext=false',
    rationale: 'Ayar kapalı — hiçbir otomatik geçiş yapilmiyor.',
    örnek: { autoplayNext: false, kalanSn: 0, sezonMu: false, finalBolumMu: false },
  },
  beklet: {
    koşul: 'finalBolumMu=true || kullaniciEtkilestimi=true',
    rationale: 'Son bölüm veya kullanıcı elle gezinti — post-play kartı gösterilecek, otomatik geçilmiyor.',
    örnek_final: { autoplayNext: true, kalanSn: 10, sezonMu: true, finalBolumMu: true, kullaniciEtkilestimi: false },
    örnek_kullanici: { autoplayNext: true, kalanSn: 10, sezonMu: true, finalBolumMu: false, kullaniciEtkilestimi: true },
  },
  otomatik: {
    koşul: 'kalanSn<3 (veya default)',
    rationale: 'Kalan süre kısa — following episode hemen oynatılıyor.',
    örnek_short: { autoplayNext: true, kalanSn: 2, sezonMu: true, finalBolumMu: false, kullaniciEtkilestimi: false },
    örnek_default: { autoplayNext: true, kalanSn: 10, sezonMu: false, finalBolumMu: false, kullaniciEtkilestimi: false },
  },
};