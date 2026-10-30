/* ==========================================================================
   CinePulse Studio — Kişiselleştirme ML çekirdeği: ÖZELLİK KODLAYICI (SAF)
   --------------------------------------------------------------------------
   Her aday içerik, sabit uzunlukta sayısal bir vektöre çevrilir. Vektör hem
   sıralayıcı (lojistik regresyon) hem de matris ayrışımı (BPR) tarafından
   kullanılır.

   SÖZLEŞME
   · DOM / window / fetch / Date.now / localStorage YOK. "Şimdi" bilgisi
     `simdiMs` parametresiyle enjekte edilir → node --test ile ağsız test.
   · `OZELLIK_ADLARI` sabittir: eğitilen ağırlık vektörünün boyutu ve sırası
     model dosyasıyla birlikte saklanır; şema değişirse MODEL_SURUMU artar ve
     eski model reddedilir (sessizce yanlış vektör okunmaz).
   ========================================================================== */

/** Model/şema sürümü. Özellik listesi değişirse MUTLAKA artırılır. */
export const MODEL_SURUMU = 5;

/** TMDB tür kimlikleri — sıra özellik vektöründeki yeri belirler. */
export const TUR_KIMLIKLERI = Object.freeze([
  28, 12, 16, 35, 80, 99, 18, 10751, 14, 36,
  27, 9648, 10749, 878, 53, 10752, 10762, 10759, 10765, 10768
]);

/** Tür adı → kimlik (Türkçe adlarla gelen kayıtlar için). */
const TUR_AD_KIMLIK = Object.freeze({
  'Aksiyon': 28, 'Macera': 12, 'Animasyon': 16, 'Komedi': 35, 'Suç': 80,
  'Belgesel': 99, 'Dram': 18, 'Aile': 10751, 'Fantastik': 14, 'Tarih': 36,
  'Korku': 27, 'Gizem': 9648, 'Romantik': 10749, 'Bilim Kurgu': 878,
  'Gerilim': 53, 'Savaş': 10752, 'Çocuk': 10762,
  'Aksiyon & Macera': 10759, 'Bilim Kurgu & Fantastik': 10765,
  'Savaş & Politika': 10768
});

/**
 * Özellik sütunlarının adları (uzunluk = vektör boyutu). Eğitim/test bu
 * listeyi tek doğruluk kaynağı olarak kullanır.
 */
export const OZELLIK_ADLARI = Object.freeze([
  'bias',
  // tip
  'tip_dizi', 'tip_anime', 'tip_cizgi',
  // kalite / popülerlik / tazelik
  'puan', 'populerlik', 'yil', 'tazelik',
  // türler (20 sütun)
  ...TUR_KIMLIKLERI.map((id) => `tur_${id}`),
  // kullanıcı sinyalleri
  'favori', 'izleme_listesi', 'gecmis', 'birakilmis', 'tamamlanmis',
  // kişiselleştirme skorları (çağıran taraf doldurur)
  'cf_skor', 'mf_skor',
  // bağlam: öneri yüzeyi (one-hot)
  'kaynak_ana', 'kaynak_benzer', 'kaynak_devam', 'kaynak_kanal',
  'kaynak_tamamlanan', 'kaynak_favoriler',
  // bağlam: saat uyumu ve seans
  'saat_uyumu', 'hafta_sonu'
]);

export const OZELLIK_SAYISI = OZELLIK_ADLARI.length;
const TUR_BASLANGIC = OZELLIK_ADLARI.indexOf('tur_28');

/** @returns {Float64Array} sıfır vektör */
export function bosVektor() {
  return new Float64Array(OZELLIK_SAYISI);
}

/** Sınırlı doğrusal ölçekleme: [min,max] → [0,1]. */
function olcek(deger, min, max) {
  const d = Number(deger);
  if (!Number.isFinite(d)) return 0;
  const t = (d - min) / (max - min);
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

/** Kaydın TMDB tür kimlikleri (genre_ids / genres / genre). */
export function turKimlikleri(oge) {
  const out = [];
  if (!oge || typeof oge !== 'object') return out;
  const ekle = (id) => {
    const n = Number(id);
    if (Number.isFinite(n) && !out.includes(n)) out.push(n);
  };
  if (Array.isArray(oge.genre_ids)) for (const g of oge.genre_ids) ekle(g);
  if (Array.isArray(oge.genres)) {
    for (const g of oge.genres) ekle(g && typeof g === 'object' ? g.id : TUR_AD_KIMLIK[String(g || '').trim()]);
  }
  if (typeof oge.genre === 'number') ekle(oge.genre);
  if (typeof oge.tur === 'number') ekle(oge.tur);
  if (typeof oge.tur === 'string') ekle(TUR_AD_KIMLIK[oge.tur.trim()]);
  return out;
}

/** Kayıt dizi mi? (tv/anime/çizgi) */
export function diziMi(oge) {
  if (!oge) return false;
  const t = String(oge.type || oge.media_type || '').toLowerCase();
  if (t === 'tv' || t === 'anime') return true;
  if (t === 'movie') return false;
  if (oge.isSeries === true) return true;
  if (oge.first_air_date || oge.number_of_seasons || oge.episodesCount) return true;
  return false;
}

export function animeMi(oge) {
  return Boolean(oge && (oge.isAnime || oge.type === 'anime' || oge.media_type === 'anime'));
}

export function cizgiMi(oge) {
  if (!oge) return false;
  const turler = turKimlikleri(oge);
  return turler.includes(16) || turler.includes(10762) || oge.type === 'cartoon';
}

/** İçeriğin yılı (yoksa 0). */
export function yilAl(oge) {
  const ham = oge && (oge.release_date || oge.first_air_date || oge.year);
  const m = String(ham == null ? '' : ham).match(/(\d{4})/);
  return m ? Number(m[1]) : 0;
}

/** İzlenim kaynağı → bağlam sütunu. */
const KAYNAK_INDEKS = Object.freeze({
  ana: { kolon: 'kaynak_ana', agirlik: 1 },
  benzer: { kolon: 'kaynak_benzer', agirlik: 1 },
  devam: { kolon: 'kaynak_devam', agirlik: 1 },
  kanal: { kolon: 'kaynak_kanal', agirlik: 1 },
  tamamlanan: { kolon: 'kaynak_tamamlanan', agirlik: 1 },
  favoriler: { kolon: 'kaynak_favoriler', agirlik: 1 }
});

/**
 * Bir adayı özellik vektörüne çevirir.
 * @param {object} oge TMDB/yerel medya kaydı
 * @param {object} [baglam]
 * @param {number} [baglam.simdiMs]        enjekte edilen saat
 * @param {number} [baglam.saat]           günün saati (0-23); yoksa simdiMs'ten
 * @param {string} [baglam.kaynak]         recommendation surface identifier
 * @param {Set<string>} [baglam.favoriIdler]
 * @param {Set<string>} [baglam.listeIdler]
 * @param {Set<string>} [baglam.gecmisIdler]
 * @param {Set<string>} [baglam.tamamlananIdler]
 * @param {number} [baglam.cfSkor]         0..1
 * @param {number} [baglam.mfSkor]         0..1
 * @param {number[]} [baglam.tercihSaatleri] kullanıcının izlediği saatler
 * @returns {Float64Array}
 */
export function kodla(oge, baglam = {}) {
  const v = bosVektor();
  if (!oge) return v;

  const simdiMs = Number.isFinite(Number(baglam.simdiMs)) ? Number(baglam.simdiMs) : 0;
  const simdi = simdiMs > 0 ? new Date(simdiMs) : null;
  const saat = Number.isFinite(Number(baglam.saat))
    ? Number(baglam.saat)
    : (simdi ? simdi.getHours() : 12);
  const id = oge.id != null ? String(oge.id) : '';

  let i = 0;
  v[i++] = 1;                                            // bias
  v[i++] = diziMi(oge) ? 1 : 0;
  v[i++] = animeMi(oge) ? 1 : 0;
  v[i++] = cizgiMi(oge) ? 1 : 0;

  v[i++] = olcek(oge.vote_average ?? oge.voteAverage ?? oge.rating, 0, 10);
  v[i++] = olcek(Math.log1p(Math.max(0, Number(oge.popularity) || 0)), 0, Math.log1p(2000));
  const yil = yilAl(oge);
  v[i++] = yil > 0 ? olcek(yil, 1950, 2030) : 0.35;
  const yasMs = yil > 0 && simdiMs > 0 ? Math.max(0, simdiMs - new Date(`${yil}-07-01`).getTime()) : null;
  v[i++] = yasMs == null ? 0.4 : Math.exp(-(yasMs / (365.25 * 86400000)) / 12); // 12 yıllık yarı-ömür

  const turler = turKimlikleri(oge);
  for (const t of turler) {
    const idx = TUR_KIMLIKLERI.indexOf(t);
    if (idx >= 0) v[TUR_BASLANGIC + idx] = 1;
  }
  i = TUR_BASLANGIC + TUR_KIMLIKLERI.length; // tür bloğu `i` ile yazılmaz

  const kumede = (set) => Boolean(id && set && typeof set.has === 'function' && set.has(id));
  v[i++] = kumede(baglam.favoriIdler) ? 1 : 0;
  v[i++] = kumede(baglam.listeIdler) ? 1 : 0;
  v[i++] = kumede(baglam.gecmisIdler) ? 1 : 0;
  v[i++] = oge.birakilmis || oge.abandoned ? 1 : 0;
  v[i++] = oge.completed || kumede(baglam.tamamlananIdler) ? 1 : 0;

  v[i++] = Math.max(0, Math.min(1, Number(baglam.cfSkor) || 0));
  v[i++] = Math.max(0, Math.min(1, Number(baglam.mfSkor) || 0));

  const k = KAYNAK_INDEKS[String(baglam.kaynak || 'ana')] || KAYNAK_INDEKS.ana;
  const kaynakKolon = OZELLIK_ADLARI.indexOf(k.kolon);
  if (kaynakKolon >= 0) v[kaynakKolon] = k.agirlik;

  // Saat uyumu: kullanıcının geçmiş izleme saatlerine en yakın fark (0..1).
  const saatler = Array.isArray(baglam.tercihSaatleri) ? baglam.tercihSaatleri : [];
  if (saatler.length === 0) {
    v[i++] = 0.5; // veri yok → nötr
  } else {
    let enYakin = 24;
    for (const s of saatler) {
      const n = Number(s);
      if (!Number.isFinite(n)) continue;
      const fark = Math.abs(((n % 24) + 24) % 24 - saat);
      enYakin = Math.min(enYakin, fark, 24 - fark);
    }
    v[i++] = 1 - enYakin / 12;
  }
  const gun = simdi ? simdi.getDay() : 3;
  v[i++] = gun === 0 || gun === 6 ? 1 : 0;

  return v;
}

/** Vektörü adlandırılmış sözlüğe çevirir (açıklama/"neden" üretimi için). */
export function vektorSozluk(v) {
  const out = {};
  for (let i = 0; i < OZELLIK_ADLARI.length; i += 1) out[OZELLIK_ADLARI[i]] = Number(v?.[i]) || 0;
  return out;
}
