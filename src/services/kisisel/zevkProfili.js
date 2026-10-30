/* ==========================================================================
   CinePulse Studio — ZEVK PROFİLİ (kullanıcının kendi verisinden, SAF)
   --------------------------------------------------------------------------
   Amaç: kullanıcının BİLEREK verdiği sinyalleri (favoriler, izleme listesi,
   bitirdikleri, izleme geçmişi) tek bir ağırlık profiline indirgemek ve Ana
   Sayfa'nın her satırını bu profile göre sıralamak.

   Sinyal ağırlıkları (kanıta dayalı, ölçülmüş niyet sırası):
     favori 3.0 · izleme listesi 2.2 · bitirilen 2.6 · yarım bırakılan 0.6 ·
     yeni izlenen 1.2
   Bu ağırlıklar türlere dağıtılır; süreklilik (recency) ile çarpılır.

   SAFLIK: DOM/ağ/localStorage YOK. Girdi dizileri, çıktı düz nesneler.
   ========================================================================== */

/** Sinyal ağırlıkları — tek doğruluk kaynağı. */
export const SINYAL_AGIRLIK = Object.freeze({
  favori: 3.0,
  liste: 2.2,
  bitirilen: 2.6,
  birakilan: 0.6,
  izlenen: 1.2
});

/** Yarı-ömür: 90 gün (bu süreden eski sinyal yarı ağırlığa düşer). */
const YARI_OMUR_MS = 90 * 24 * 3600 * 1000;

/** Tür kimliği → okunabilir ad (profil çipi ve testler bunu kullanır). */
export const TUR_ADLARI = Object.freeze({
  28: 'Aksiyon', 12: 'Macera', 16: 'Animasyon', 35: 'Komedi', 80: 'Suç',
  99: 'Belgesel', 18: 'Dram', 10751: 'Aile', 14: 'Fantastik', 36: 'Tarih',
  27: 'Korku', 9648: 'Gizem', 10749: 'Romantik', 878: 'Bilim Kurgu',
  53: 'Gerilim', 10752: 'Savaş', 10762: 'Çocuk', 10759: 'Aksiyon & Macera',
  10765: 'Bilim Kurgu & Fantastik', 10766: 'Pembe Dizi', 10768: 'Savaş & Politika',
  25: 'Tarih'
});

function kimlik(oge) {
  if (!oge || oge.id == null) return null;
  const s = String(oge.id).trim();
  return s || null;
}

/** Kaydın TMDB tür kimlikleri. */
export function turKimlikleri(oge) {
  const out = [];
  if (!oge) return out;
  const ekle = (id) => {
    const n = Number(id);
    if (Number.isFinite(n) && n > 0 && !out.includes(n)) out.push(n);
  };
  if (Array.isArray(oge.genre_ids)) for (const g of oge.genre_ids) ekle(g);
  if (Array.isArray(oge.genres)) for (const g of oge.genres) ekle(g && typeof g === 'object' ? g.id : NaN);
  if (typeof oge.genre === 'number') ekle(oge.genre);
  return out;
}

/** Zaman damgası (yoksa 0). */
function zaman(oge) {
  const n = Number(oge?.lastWatchedAt ?? oge?.updatedAt ?? oge?.addedAt ?? 0);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Recency çarpanı: 0..1 arası, yarı-ömürlü üstel azalma. */
export function tazelikCarpani(ts, simdiMs) {
  const t = Number(ts);
  const now = Number(simdiMs);
  if (!Number.isFinite(t) || !Number.isFinite(now) || t <= 0 || now <= 0) return 1;
  const yas = Math.max(0, now - t);
  return Math.pow(0.5, yas / YARI_OMUR_MS);
}

/**
 * Profili kurar.
 *
 * @param {object} girdi
 * @param {Array} [girdi.favoriler]
 * @param {Array} [girdi.watchlist]
 * @param {Array} [girdi.tamamlanan]  bitirilen yapıtlar (getCompletedWatchList)
 * @param {Array} [girdi.gecmis]      izleme geçmişi (getGroupedWatchHistory)
 * @param {number} [girdi.simdiMs]
 * @returns {{
 *   turAgirlik: Record<number, number>, turSira: Array<{id:number, ad:string, agirlik:number, adet:number}>,
 *   idler: {favori:Set<string>, liste:Set<string>, tamamlanan:Set<string>, gecmis:Set<string>},
 *   toplam: {favori:number, liste:number, tamamlanan:number, gecmis:number},
 *   sinyalSayisi: number, bos: boolean
 * }}
 */
export function profilKur({
  favoriler = [], watchlist = [], tamamlanan = [], gecmis = [], simdiMs = Date.now()
} = {}) {
  const turPuan = new Map();   // türId → ağırlıklı puan
  const turAdet = new Map();   // türId → kaç yapıtta görüldü (güven sinyali)
  const idler = {
    favori: new Set(), liste: new Set(), tamamlanan: new Set(), gecmis: new Set()
  };

  const isle = (liste, sinyalTuru, kume) => {
    for (const oge of Array.isArray(liste) ? liste : []) {
      const id = kimlik(oge);
      if (!id) continue;
      kume.add(id);
      const turler = turKimlikleri(oge);
      if (turler.length === 0) continue;
      const carpan = tazelikCarpani(zaman(oge), simdiMs);
      for (const t of turler) {
        turPuan.set(t, (turPuan.get(t) || 0) + sinyalTuru * carpan);
        turAdet.set(t, (turAdet.get(t) || 0) + 1);
      }
    }
  };

  isle(favoriler, SINYAL_AGIRLIK.favori, idler.favori);
  isle(watchlist, SINYAL_AGIRLIK.liste, idler.liste);
  isle(tamamlanan, SINYAL_AGIRLIK.bitirilen, idler.tamamlanan);

  // Geçmiş: tamamlananlar dışındakiler (yarım bırakılan / yeni) daha zayıf sinyal.
  const tamamlananSet = idler.tamamlanan;
  for (const oge of Array.isArray(gecmis) ? gecmis : []) {
    const id = kimlik(oge);
    if (!id) continue;
    idler.gecmis.add(id);
    if (tamamlananSet.has(id)) continue; // çift sayılmasın
    const tamam = oge && (oge.completed || Number(oge.progressPercent) >= 90);
    isle([oge], tamam ? SINYAL_AGIRLIK.bitirilen : SINYAL_AGIRLIK.izlenen, new Set());
  }

  // Normalize: en güçlü tür 1.0. Böylece eşikler veri hacminden bağımsız.
  let maks = 0;
  for (const p of turPuan.values()) if (p > maks) maks = p;
  const turAgirlik = {};
  for (const [id, puan] of turPuan.entries()) {
    turAgirlik[id] = maks > 0 ? Math.round((puan / maks) * 1000) / 1000 : 0;
  }
  const turSira = [...turPuan.entries()]
    .map(([id, puan]) => ({
      id,
      ad: TUR_ADLARI[id] || String(id),
      agirlik: maks > 0 ? puan / maks : 0,
      adet: turAdet.get(id) || 0
    }))
    .sort((a, b) => b.agirlik - a.agirlik || b.adet - a.adet);

  const toplam = {
    favori: idler.favori.size,
    liste: idler.liste.size,
    tamamlanan: idler.tamamlanan.size,
    gecmis: idler.gecmis.size
  };
  const sinyalSayisi = toplam.favori + toplam.liste + toplam.tamamlanan + toplam.gecmis;

  return {
    turAgirlik,
    turSira,
    idler,
    toplam,
    sinyalSayisi,
    bos: sinyalSayisi === 0 || turSira.length === 0
  };
}

/**
 * Tek içerik için kişisel puan (0..1). Tür uyumu + doğrudan sinyal işareti.
 * Profil boşsa 0 döner (sıralama değişmez — sahte kişiselleştirme yok).
 *
 * @param {object} oge
 * @param {ReturnType<typeof profilKur>} profil
 * @param {{favoriBonus?:number, listeBonus?:number, tamamlananBonus?:number}} [secenek]
 * @returns {number}
 */
export function ogePuani(oge, profil, secenek = {}) {
  if (!profil || profil.bos || !oge) return 0;
  const id = kimlik(oge);
  const favoriBonus = Number(secenek.favoriBonus ?? 0.35);
  const listeBonus = Number(secenek.listeBonus ?? 0.25);
  const tamamBonus = Number(secenek.tamamlananBonus ?? 0.15);

  const turler = turKimlikleri(oge);
  let en = 0;
  for (const t of turler) {
    const w = Number(profil.turAgirlik[t]);
    if (Number.isFinite(w) && w > en) en = w;
  }
  // Tür uyumu tüm ağırlığın %65'i; doğrudan işaretler kalanı.
  let puan = en * 0.65;
  if (id && profil.idler.favori.has(id)) puan += favoriBonus;
  else if (id && profil.idler.liste.has(id)) puan += listeBonus;
  else if (id && profil.idler.tamamlanan.has(id)) puan += tamamBonus;
  return Math.min(1, Math.round(puan * 1000) / 1000);
}

/**
 * Bir listeyi profile göre sıralar. Kararlı: eşit puanda özgün sıra korunur
 * (popülerlik sırası bozulmaz).
 *
 * @param {object[]} ogeListesi
 * @param {ReturnType<typeof profilKur>} profil
 * @param {{esik?:number, haric?:Set<string>, enFazla?:number}} [secenek]
 * @returns {object[]}
 */
export function profilSirala(ogeListesi = [], profil, { esik = 0.08, haric = null, enFazla = 0 } = {}) {
  const liste = (Array.isArray(ogeListesi) ? ogeListesi : []).filter((o) => o && o.id != null);
  if (!profil || profil.bos) return enFazla > 0 ? liste.slice(0, enFazla) : liste;

  const esikDeger = Number.isFinite(Number(esik)) ? Number(esik) : 0;
  const uyan = [];
  const diger = [];
  for (const oge of liste) {
    const id = kimlik(oge);
    if (haric && id && haric.has(id)) continue;
    const puan = ogePuani(oge, profil);
    if (puan >= esikDeger) uyan.push({ oge, puan });
    else diger.push(oge);
  }
  uyan.sort((a, b) => b.puan - a.puan);
  const out = [...uyan.map((x) => x.oge), ...diger];
  return enFazla > 0 ? out.slice(0, enFazla) : out;
}

/**
 * Kullanıcının kendi verisinden doğrudan satır(lar) üretir — AĞ YOK.
 * Favoriler / izleme listesi / bitirdikleri sırayla; her satır en az
 * `minAdet` öğe taşır, yoksa çizilmez (boş satır gürültü sayılır).
 *
 * @param {ReturnType<typeof profilKur>} profil
 * @param {object} kaynaklar {favoriler, watchlist, tamamlanan, havuz}
 * @param {{minAdet?:number, enFazla?:number}} [secenek]
 * @returns {Array<{anahtar:string, baslik:string, ikon:string, renk:string, ogeler:object[]}>}
 */
export function yerelSatirlar(profil, { favoriler = [], watchlist = [], tamamlanan = [] } = {}, { minAdet = 6, enFazla = 20 } = {}) {
  const satirlar = [];
  const ekle = (anahtar, baslik, ikon, renk, liste) => {
    const temiz = (Array.isArray(liste) ? liste : []).filter((x) => x && x.id != null);
    if (temiz.length < minAdet) return;
    satirlar.push({
      anahtar,
      baslik,
      ikon,
      renk,
      ogeler: temiz.slice(0, Math.max(minAdet, enFazla))
    });
  };
  ekle('rail-ozel-favori', 'Favorilerinden', 'heart', '#f472b6', favoriler);
  ekle('rail-ozel-liste', 'İzleme listenden', 'bookmark', '#38bdf8', watchlist);
  ekle('rail-ozel-tekrar', 'Bitirdiklerinden', 'check-check', '#dfff76', tamamlanan);
  return satirlar;
}

/**
 * Profil özeti (tek satır, dürüst sayılar): "12 favori · 8 listede · 24 bitirdin
 * — en çok: Dram, Gerilim".
 */
export function ozetMetni(profil, { turAdet = 3 } = {}) {
  if (!profil || profil.bos) return '';
  const parcalar = [];
  if (profil.toplam.favori > 0) parcalar.push(`${profil.toplam.favori} favori`);
  if (profil.toplam.liste > 0) parcalar.push(`${profil.toplam.liste} listede`);
  if (profil.toplam.tamamlanan > 0) parcalar.push(`${profil.toplam.tamamlanan} bitirdin`);
  const turler = profil.turSira.slice(0, Math.max(1, turAdet)).map((t) => t.ad);
  const temel = parcalar.join(' · ');
  return turler.length ? `${temel} — en çok ${turler.join(', ')}` : temel;
}
