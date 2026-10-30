/* ==========================================================================
   CinePulse Studio — KİŞİSELLEŞTİRME MOTORU (uygulama köprüsü)
   --------------------------------------------------------------------------
   ML çekirdeği (services/kisisel/ml/*) saf ve test edilebilir; bu modül onu
   uygulamaya bağlar: depo okuma, model tazeleme, gösterim/tıklama kaydı,
   satır sıralaması ve kanal ağırlıkları.

   · Ağır eğitim ilk boyamayı BLOKLAMAZ: çağıran taraf `modeliHazirla()`yı
     await eder, HTML üretimi bundan önce biter.
   · Model eğitilmemişse satırlar dürüstçe popülerlik sırasına düşer; görünüm
     "öğreniyor" der. Sahte kişiselleştirme iddiası yoktur.
   ========================================================================== */

import {
  getWatchHistory, getFavorites, getWatchlist, getActiveProfile, filterForActiveProfile
} from '../altyapi/storage.js';
import { modeliHazirla, modelYukle, etkilesimlerKur } from './ml/egitmen.js';
import { izlenimEkle, izlenimTikla, izlenimOku } from './ml/izlenimler.js';
import { sirala, kanalAgirlikFonksiyonu, modelDurumu } from './ml/onerici.js';
import { TUR_KIMLIKLERI, OZELLIK_ADLARI as OZELLIK_KOLONLARI } from './ml/ozellikler.js';
import { urunBenzerligi } from './ml/matrisAyrisimi.js';

const TUR_ADLARI = {
  28: 'Aksiyon', 12: 'Macera', 16: 'Animasyon', 35: 'Komedi', 80: 'Suç',
  99: 'Belgesel', 18: 'Dram', 10751: 'Aile', 14: 'Fantastik', 36: 'Tarih',
  27: 'Korku', 9648: 'Gizem', 10749: 'Romantik', 878: 'Bilim Kurgu',
  53: 'Gerilim', 10752: 'Savaş', 10762: 'Çocuk', 10759: 'Aksiyon & Macera',
  10765: 'Bilim Kurgu & Fantastik', 10768: 'Savaş & Politika'
};

function depo() {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch (_) {
    return null;
  }
}

function profilId() {
  try {
    return getActiveProfile()?.id || 'profil';
  } catch (_) {
    return 'profil';
  }
}

/** Oturum içi model önbelleği (profilden profile ayrı). */
const MODEL_CACHE = new Map();
let hazirlikSozu = null;

function kimlikSet(liste) {
  const s = new Set();
  for (const x of Array.isArray(liste) ? liste : []) if (x && x.id != null) s.add(String(x.id));
  return s;
}

/** Kullanıcının kayıtlarından id → medya haritası.
 *  TAM izleme geçmişi kullanılır (tamamlananlar dâhil) — devam listesi
 *  tamamlanan filmleri eler, model en güçlü sinyali kaçırırdı. */
export function kayitHaritasi(ekKayitlar = []) {
  const harita = new Map();
  const koy = (liste) => {
    for (const it of Array.isArray(liste) ? liste : []) {
      if (it && it.id != null) harita.set(String(it.id), it);
    }
  };
  koy(getWatchHistorySafe());
  koy(getFavorites());
  koy(getWatchlist());
  koy(ekKayitlar);
  return harita;
}

/** Tam geçmiş (tamamlananlar dâhil), profil süzülmüş. Hata durumunda [].  */
function getWatchHistorySafe() {
  try {
    return filterForActiveProfile(getWatchHistory() || []) || [];
  } catch (_) {
    return [];
  }
}

/** Bir yapıtın TÜM kayıtları tamamsa id tamamlanmış sayılır (dizi bölümleri
 *  tek tek tamamlanabilir; yarım dizi "bitti" sinyali vermez). */
function tamamlananIdlerKur(gecmis) {
  const hepsi = new Map();
  for (const g of Array.isArray(gecmis) ? gecmis : []) {
    if (!g || g.id == null) continue;
    const id = String(g.id);
    const tamam = Boolean(g.completed) || Number(g.progressPercent) >= 90;
    if (!hepsi.has(id)) hepsi.set(id, tamam);
    else if (!tamam) hepsi.set(id, false);
  }
  const out = new Set();
  for (const [id, tamam] of hepsi) if (tamam) out.add(id);
  return out;
}

/** Bağlam (özellik vektörü için) — profilin gerçek sinyallerinden.
 *  `gecmis` TAM geçmiştir: yedekten/önbellekten dönen tamamlananlar da ana
 *  sayfayı etkilesin (kullanıcı isteği 2026-10-30). `tamamlananIdler`
 *  ozellikler.js'in 'tamamlanmis' özelliğini ilk kez gerçek veriyle besler. */
export function baglamKur(ekKayitlar = []) {
  const gecmis = getWatchHistorySafe();
  const favoriler = filterForActiveProfile(getFavorites() || []);
  const watchlist = filterForActiveProfile(getWatchlist() || []);
  const saatler = [];
  for (const g of gecmis) {
    const ts = Number(g?.lastWatchedAt);
    if (Number.isFinite(ts)) saatler.push(new Date(ts).getHours());
  }
  return {
    simdiMs: Date.now(),
    favoriIdler: kimlikSet(favoriler),
    listeIdler: kimlikSet(watchlist),
    gecmisIdler: kimlikSet(gecmis),
    tamamlananIdler: tamamlananIdlerKur(gecmis),
    tercihSaatleri: saatler,
    gecmis, favoriler, watchlist
  };
}

/**
 * Modeli hazırlar (gerekirse eğitir). Aynı anda tek eğitim çalışır.
 * @param {{zorla?:boolean, ekKayitlar?:object[]}} [secenek]
 * @returns {Promise<object|null>}
 */
export async function modeliHazirla2({ zorla = false, ekKayitlar = [] } = {}) {
  const pid = profilId();
  if (!zorla && MODEL_CACHE.has(pid)) return MODEL_CACHE.get(pid);
  if (hazirlikSozu) return hazirlikSozu;

  hazirlikSozu = (async () => {
    try {
      const baglam = baglamKur(ekKayitlar);
      const kayitlar = kayitHaritasi(ekKayitlar);
      const { model } = modeliHazirla({
        depo: depo(),
        profilId: pid,
        gecmis: baglam.gecmis,
        favoriler: baglam.favoriler,
        watchlist: baglam.watchlist,
        kayitlar,
        zorla
      });
      MODEL_CACHE.set(pid, model);
      return model;
    } catch (_) {
      // Model kurulamazsa kişiselleştirme sessizce kapanır (popülerlik sırası).
      const mevcut = modelYukle(depo(), pid);
      if (mevcut) MODEL_CACHE.set(pid, mevcut);
      return mevcut || null;
    } finally {
      hazirlikSozu = null;
    }
  })();

  return hazirlikSozu;
}

/** Önbellekteki model (eğitim beklemeden). Yoksa depodan okur. */
export function modelAninda() {
  const pid = profilId();
  if (MODEL_CACHE.has(pid)) return MODEL_CACHE.get(pid);
  const m = modelYukle(depo(), pid);
  if (m) MODEL_CACHE.set(pid, m);
  return m;
}

/** Model durumu (görünümdeki dürüst rozet). */
export function motorDurumu() {
  return modelDurumu(modelAninda());
}

/** Gösterimleri kaydeder (negatif sınıf). */
export function gosterimKaydet(liste, kaynak = 'ana') {
  const d = depo();
  if (!d) return 0;
  let n = 0;
  for (const oge of Array.isArray(liste) ? liste : []) {
    if (!oge || oge.id == null) continue;
    if (izlenimEkle(d, { id: oge.id, tip: oge.type || oge.media_type || '', kaynak })) n += 1;
  }
  return n;
}

/** Tıklama kaydı (pozitif sınıf). Eşik aşılırsa arka planda yeniden eğitir. */
export function tiklamaKaydet(oge, kaynak = 'ana') {
  const d = depo();
  if (!d || !oge || oge.id == null) return false;
  const ok = izlenimTikla(d, oge.id);
  // Eşik kontrolü: bir sonraki ziyarette model tazelenir.
  return ok;
}

/**
 * İçerik önceliği (zevk profili): model henüz eğitilmemişken bile tamamlanan
 * geçmişin, favorilerin ve izleme listesinin tür dağılımını sıralamaya karıştırır.
 * Ağırlıklar: tamamlanan 3x, favori 2x, izleme listesi 1x — sonra 0..1'e normalize.
 * @param {object} baglam baglamKur() çıktısı
 * @returns {Map<string,number>} genreId → 0..1 ağırlık
 */
export function zevkOncelligi(baglam = {}) {
  const v = new Map();
  const ekle = (oge, w) => {
    const g = oge && (oge.genre_ids || oge.genres);
    if (!Array.isArray(g)) return;
    for (const id of g) {
      const k = String(typeof id === 'object' && id !== null ? (id.id ?? '') : id);
      if (!k || k === '') continue;
      v.set(k, (v.get(k) || 0) + w);
    }
  };
  for (const g of Array.isArray(baglam.gecmis) ? baglam.gecmis : []) {
    const tamam = Boolean(g && (g.completed || Number(g.progressPercent) >= 90));
    ekle(g, tamam ? 3 : 1);
  }
  for (const f of Array.isArray(baglam.favoriler) ? baglam.favoriler : []) ekle(f, 2);
  for (const w of Array.isArray(baglam.watchlist) ? baglam.watchlist : []) ekle(w, 1);
  let en = 1;
  for (const x of v.values()) if (x > en) en = x;
  for (const [k, x] of v) v.set(k, x / en);
  return v;
}

/**
 * Adayları modele göre sıralar. Model eğitilmemişse (yeni kurulum / yedekten
 * dönüş) salt-popülerlik sırasına düşmek yerine zevk önceliği işler: biten
 * filmlerin, favorilerin ve listenin türleri ana sayfayı HEMEN etkiler.
 * @param {object[]} adaylar
 * @param {{kaynak?:string, adet?:number, model?:object, tohumId?:string, ekKayitlar?:object[]}} [secenek]
 */
export function siralaAdaylar(adaylar, { kaynak = 'ana', adet = 0, model = null, tohumId = null, ekKayitlar = [] } = {}) {
  const m = model || modelAninda();
  const baglam = baglamKur(ekKayitlar);
  let cfBenzerlik = null;
  if (tohumId != null) {
    try {
      const gecmis = baglam.gecmis || [];
      const dizi = gecmis
        .slice()
        .sort((a, b) => (Number(b.lastWatchedAt) || 0) - (Number(a.lastWatchedAt) || 0))
        .map((g) => ({ urun: String(g.id), zaman: Number(g.lastWatchedAt) || 0 }));
      cfBenzerlik = urunBenzerligi({ dizi }).benzerlik;
    } catch (_) {
      cfBenzerlik = null;
    }
  }
  const sonuc = sirala({ adaylar, model: m, baglam, kaynak, cfBenzerlik, tohumId, adet });
  // İçerik önceliği köprüde uygulanır (ML çekirdeği saf kalır): tür örtüşmesi
  // 0.25'e kadar skor ekler; favoride/listede duran yapıtlar küçük sabit bonus alır.
  try {
    const prior = zevkOncelligi(baglam);
    if (prior.size >= 2) {
      for (const satir of sonuc.liste) {
        const g = Array.isArray(satir.oge.genre_ids) ? satir.oge.genre_ids : [];
        let pay = 0;
        for (const id of g) pay += prior.get(String(id)) || 0;
        pay = g.length ? pay / Math.max(2, g.length) : 0;
        let bonus = 0.25 * pay;
        const id = String(satir.oge.id);
        if (baglam.favoriIdler && baglam.favoriIdler.has(id)) bonus += 0.06;
        else if (baglam.listeIdler && baglam.listeIdler.has(id)) bonus += 0.04;
        if (bonus > 0) {
          satir.skor += bonus;
          satir.bilesenler = { ...(satir.bilesenler || {}), zevk: Math.round(pay * 100) / 100 };
        }
      }
      sonuc.liste.sort((a, b) => b.skor - a.skor);
      if (adet > 0) sonuc.liste = sonuc.liste.slice(0, adet);
    }
  } catch (_) { /* öncelik opsiyonel; sıra bozulmaz */ }
  return sonuc;
}

/**
 * Kanal programlayıcısı için ML ağırlık fonksiyonu. Model yoksa null.
 * @param {object[]} adaylar kanal havuzu (gecmis+favori+liste+fallback)
 */
export function kanalAgirliklari(adaylar) {
  const m = modelAninda();
  if (!m) return null;
  try {
    return kanalAgirlikFonksiyonu({ model: m, adaylar, baglam: baglamKur() });
  } catch (_) {
    return null;
  }
}

/**
 * Modelin öğrendiği en güçlü türler (dürüst özet; ağırlıkların kendisinden).
 * @param {object|null} [model]
 * @param {number} [adet]
 * @returns {Array<{tur:string, agirlik:number}>}
 */
export function ogrenilenTurler(model = modelAninda(), adet = 4) {
  const w = model?.siralayici?.agirliklar;
  if (!Array.isArray(w) || !model?.siralayici?.egitildi) return [];
  const satirlar = [];
  for (const id of TUR_KIMLIKLERI) {
    const i = OZELLIK_KOLONLARI.indexOf(`tur_${id}`);
    if (i < 0) continue;
    const agirlik = Number(w[i]) || 0;
    if (agirlik > 0.02) satirlar.push({ tur: TUR_ADLARI[id] || String(id), agirlik: Math.round(agirlik * 1000) / 1000 });
  }
  satirlar.sort((a, b) => b.agirlik - a.agirlik);
  return satirlar.slice(0, adet);
}

/** Test/veri yönetimi: model + izlenim önbelleğini sıfırlar. */
export function motoruSifirla() {
  MODEL_CACHE.clear();
  hazirlikSozu = null;
}

/** Son eğitimde kullanılan etkileşim çiftleri (kanal paneli için). */
export function etkilesimSayisi() {
  try {
    const b = baglamKur();
    return etkilesimlerKur({ gecmis: b.gecmis, favoriler: b.favoriler, watchlist: b.watchlist, profilId: profilId() }).length;
  } catch (_) {
    return 0;
  }
}

/** İzlenim sayısı (panel). */
export function izlenimSayisi() {
  return izlenimOku(depo()).length;
}
