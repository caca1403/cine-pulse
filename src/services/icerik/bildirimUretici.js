/* ==========================================================================
   CinePulse Studio - Bildirim Üretici (Saf Modül)
   - Girdi: aday kayıtlar [{ tmdbId?, tvmazeId?, ad, sonrakiHava?, yayinTarihi?, bolumEtiketi? }]
     + "şimdi" anı (ms) — izleme listesi / izleme geçmişinden modalca hazırlanır.
   - Çıktı: yayına en yakın öncelikli, geçmiş ve tarihsiz kayıtları elenmiş,
     kimliğe göre tekilleştirilmiş YAPILANDIRILMIŞ bildirim listesi.
   - Göreceli Türkçe metin ("Yarın", "3 gün sonra") BURADA üretilmez;
     DOM metnini NotificationCenterModal kurar.
   - Saf: fetch/DOM/localStorage yok — node --test ile koşar.
   ========================================================================== */

const VARSAYILAN_LIMIT = 20;

/** Kimlik anahtarı: tmdbId > tvmazeId > normalize edilmiş ad. */
function anahtarUret(kayit) {
  if (kayit.tmdbId) return `tmdb:${kayit.tmdbId}`;
  if (kayit.tvmazeId) return `tvmaze:${kayit.tvmazeId}`;
  const ad = String(kayit.ad || '').trim().toLocaleLowerCase('tr');
  return ad ? `ad:${ad}` : '';
}

/** Yayın zamanı (ms): sonrakiHava (ISO) tercih, yayinTarihi (YYYY-MM-DD) yedek. */
function yayinZamaniBul(kayit) {
  if (kayit.sonrakiHava) {
    const d = new Date(kayit.sonrakiHava);
    if (!Number.isNaN(d.getTime())) return d.getTime();
  }
  if (kayit.yayinTarihi) {
    const d = new Date(`${String(kayit.yayinTarihi).slice(0, 10)}T21:00:00`);
    if (!Number.isNaN(d.getTime())) return d.getTime();
  }
  return null;
}

/**
 * Adaylardan bildirim listesi üretir.
 * - Tarihi olmayan veya geçmişte kalan yayınlar elenir.
 * - Aynı yapıma ait tekrarlar tekilleştirilir (en yakın tarih korunur).
 * - Yayına en yakın yayın önce gelir; eşitlikte ad alfabetiktir.
 */
export function bildirimUret(adaylar, simdi = Date.now(), limit = VARSAYILAN_LIMIT) {
  if (!Array.isArray(adaylar) || adaylar.length === 0) return [];

  const enYakin = new Map(); // anahtar → kayıt (en yakın tarih)

  for (const kayit of adaylar) {
    if (!kayit || typeof kayit !== 'object') continue;
    const ad = String(kayit.ad || '').trim();
    if (!ad) continue;

    const anahtar = anahtarUret(kayit);
    if (!anahtar) continue; // adsız ve kimliksiz kayıt elenir

    const yayinZamani = yayinZamaniBul(kayit);
    if (yayinZamani === null) continue; // tarihsiz elenir
    if (yayinZamani <= simdi) continue;  // geçmiş (veya tam şu an) elenir

    const mevcut = enYakin.get(anahtar);
    if (!mevcut || yayinZamani < mevcut.yayinZamani) {
      enYakin.set(anahtar, { ...kayit, ad, yayinZamani });
    }
  }

  return [...enYakin.values()]
    .sort((a, b) => a.yayinZamani - b.yayinZamani || a.ad.localeCompare(b.ad, 'tr'))
    .slice(0, limit)
    .map(k => ({
      id: `bildirim_${anahtarUret(k).replace(/[^a-z0-9]/gi, '_')}_${k.yayinZamani}`,
      tmdbId: k.tmdbId || null,
      tvmazeId: k.tvmazeId || null,
      ad: k.ad,
      bolumEtiketi: k.bolumEtiketi || '',
      yayinZamani: k.yayinZamani
    }));
}
