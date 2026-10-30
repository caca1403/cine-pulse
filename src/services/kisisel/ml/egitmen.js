/* ==========================================================================
   CinePulse Studio — ML EĞİTMENİ (cihaz içi, gerçek eğitim)
   --------------------------------------------------------------------------
   Görev: kullanıcının kendi sinyallerinden iki modeli eğitip sürümlü olarak
   saklamak.
     1) BPR matris ayrışımı  → "zevk yönü" vektörü (kişisel skor)
     2) Lojistik sıralayıcı  → gösterim/tıklama ayrımını öğrenen bağlam modeli

   DÜRÜSTLÜK KURALLARI
   · Ölçüm (AUC / log-loss) yalnızca GERÇEK eğitimden gelir; veri azsa metrik
     null kalır ve görünüm "henüz eğitilmedi" der — uydurma sayı yok.
   · Değerlendirme zaman sıralı ayrım (son %25 test) ile yapılır; model sonra
     tüm veriyle yeniden eğitilir.
   · Depo enjekte edilir; ağ yok.
   ========================================================================== */

import { MODEL_SURUMU, OZELLIK_ADLARI, kodla } from './ozellikler.js';
import { egitSiralayici, auc, logKaybi, modelFromJSON, modelToJSON, skorla } from './lojistikSiralayici.js';
import { bprEgit, bprFromJSON, bprToJSON, urunBenzerligi } from './matrisAyrisimi.js';
import { izlenimOku } from './izlenimler.js';
import { neuralEgit, neuralFromJSON } from './neuralRanker.js';
import { sequenceCnnEgit, sequenceCnnFromJSON } from './sequenceCnn.js';

export const MODEL_ANAHTAR_ON = 'cinepulse_ml_model_v5_';

/** Sıralayıcı için anlamlı minimum etiketli örnek. */
export const MIN_SIRALAYICI_ORNEK = 24;
/** BPR için minimum etkileşim. */
export const MIN_ETKILESIM = 6;
/** Yeniden eğitim eşiği: bu kadar yeni izlenim birikince. */
export const YENIDEN_EGITIM_ESIGI = 12;
/** İki eğitim arası en az süre (ms) — cihazı yormamak için. */
export const EGITIM_ARALIGI_MS = 6 * 3600 * 1000;

function anahtar(profilId) {
  return `${MODEL_ANAHTAR_ON}${String(profilId || 'profil').replace(/[^a-z0-9_-]+/gi, '_')}`;
}

function kimlik(oge) {
  if (!oge || oge.id == null) return null;
  const s = String(oge.id).trim();
  return s || null;
}

/**
 * Geçmiş + favori + listeden BPR etkileşimleri.
 * Ağırlık: tamamlanmış > yarım kalmış > favori > liste.
 */
export function etkilesimlerKur({ gecmis = [], favoriler = [], watchlist = [], profilId = 'profil' } = {}) {
  const out = [];
  const gorulen = new Set();
  const ekle = (oge, agirlik) => {
    const id = kimlik(oge);
    if (!id || gorulen.has(id)) return;
    gorulen.add(id);
    out.push({ kullanici: profilId, urun: id, agirlik });
  };
  for (const g of Array.isArray(gecmis) ? gecmis : []) {
    const tamam = g && (g.completed || Number(g.progressPercent) >= 92);
    ekle(g, tamam ? 1.3 : 1);
  }
  for (const f of Array.isArray(favoriler) ? favoriler : []) ekle(f, 1.5);
  for (const w of Array.isArray(watchlist) ? watchlist : []) ekle(w, 0.9);
  return out;
}

/**
 * Özellik matrisi üretimi. Tüm aday kayıtları `kayitlar` haritasından çözülür
 * (izlenimde yalnız id saklanır — depolama küçük kalır).
 *
 * @param {object} girdi
 * @param {Array<{id:string,y:number,kaynak:string,ts:number}>} girdi.gosterimler
 * @param {Map<string,object>} girdi.kayitlar id → medya kaydı
 * @param {object} [girdi.baglam] kodla() bağlamı
 * @returns {Array<{x:Float64Array,y:number,agirlik:number}>}
 */
export function egitimOrnekleri({ gosterimler = [], kayitlar = new Map(), baglam = {} } = {}) {
  const out = [];
  for (const g of gosterimler) {
    const oge = kayitlar instanceof Map ? kayitlar.get(String(g.id)) : kayitlar?.[String(g.id)];
    if (!oge) continue;
    out.push({
      x: kodla(oge, { ...baglam, kaynak: g.kaynak || 'ana' }),
      y: g.y >= 0.5 ? 1 : 0,
      agirlik: 1
    });
  }
  return out;
}

/** Zaman sıralı ayrım: ilk %75 eğitim, son %25 test. */
function zamanAyir(ornekler, testOran = 0.25) {
  const sirali = ornekler.slice().sort((a, b) => (Number(a.ts) || 0) - (Number(b.ts) || 0));
  const kesim = Math.max(1, Math.floor(sirali.length * (1 - testOran)));
  return { egitim: sirali.slice(0, kesim), test: sirali.slice(kesim) };
}

/**
 * Tüm modelleri eğitir.
 * @param {object} girdi
 * @param {Array} [girdi.gecmis]
 * @param {Array} [girdi.favoriler]
 * @param {Array} [girdi.watchlist]
 * @param {Array} [girdi.izlenimler] ham izlenim kayıtları
 * @param {Map<string,object>} [girdi.kayitlar] id → medya kaydı
 * @param {string} [girdi.profilId]
 * @param {number} [girdi.simdiMs]
 * @param {boolean} [girdi.hizli] (test: epoch küçültme)
 * @returns {object} model paketi
 */
export function egitModel({
  gecmis = [], favoriler = [], watchlist = [], izlenimler = [],
  kayitlar = new Map(), profilId = 'profil', simdiMs = Date.now(), hizli = false
} = {}) {
  const etkilesimler = etkilesimlerKur({ gecmis, favoriler, watchlist, profilId });
  const gosterimler = (Array.isArray(izlenimler) ? izlenimler : [])
    .map((k) => ({ id: String(k.id), y: k.tiklandi ? 1 : 0, kaynak: k.kaynak || 'ana', ts: Number(k.ts) || 0 }))
    .filter((k) => k.id);

  const baglam = {
    simdiMs,
    favoriIdler: new Set((favoriler || []).map((f) => kimlik(f)).filter(Boolean)),
    listeIdler: new Set((watchlist || []).map((w) => kimlik(w)).filter(Boolean)),
    gecmisIdler: new Set((gecmis || []).map((g) => kimlik(g)).filter(Boolean)),
    // Bir yapütün TÜM geçmiş kayıtları tamamsa 'tamamlanmis' özelliği 1 olur;
    // gecmis TAM geçmiştir (tamamlananlar dâhil) — köprü öyle besler.
    tamamlananIdler: (() => {
      const hepsi = new Map();
      for (const g of Array.isArray(gecmis) ? gecmis : []) {
        const id = kimlik(g);
        if (!id) continue;
        const tamam = Boolean(g.completed) || Number(g.progressPercent) >= 90;
        if (!hepsi.has(id)) hepsi.set(id, tamam);
        else if (!tamam) hepsi.set(id, false);
      }
      const s = new Set();
      for (const [id, tamam] of hepsi) if (tamam) s.add(id);
      return s;
    })(),
    tercihSaatleri: (gecmis || [])
      .map((g) => (g && g.lastWatchedAt ? new Date(Number(g.lastWatchedAt)).getHours() : null))
      .filter((h) => Number.isFinite(h))
  };

  const ornekler = egitimOrnekleri({ gosterimler, kayitlar, baglam });
  const { egitim, test } = zamanAyir(ornekler);

  const hiper = hizli ? { epoch: 90 } : {};
  let siralayici = { agirliklar: new Array(OZELLIK_ADLARI.length).fill(0), bias: 0, egitildi: false, olcum: { ornek: ornekler.length } };
  let dogrulama = null;
  if (ornekler.length >= MIN_SIRALAYICI_ORNEK) {
    const deneysel = egitSiralayici({ ornekler: egitim, hiper });
    if (deneysel.egitildi && test.length >= 4) {
      const p = test.map((o) => skorla(deneysel, o.x));
      dogrulama = {
        test: test.length,
        auc: auc(p, test.map((o) => o.y)),
        logKaybi: logKaybi(p, test.map((o) => o.y))
      };
    }
    // Nihai model tüm etiketli örnekle eğitilir.
    siralayici = egitSiralayici({ ornekler, hiper });
    if (dogrulama && siralayici.olcum) dogrulama.egitimAuc = siralayici.olcum.auc;
  }

  const bpr = bprEgit({
    etkilesimler,
    hiper: hizli ? { epoch: 35 } : {}
  });
  const neural = neuralEgit(ornekler, { epoch: hizli ? 60 : 100 });
  const icerikCnn = sequenceCnnEgit(gecmis);

  return {
    surum: MODEL_SURUMU,
    profilId,
    egitimTs: simdiMs,
    ornekSayisi: ornekler.length,
    etkilesimSayisi: etkilesimler.length,
    izlenimSayisi: gosterimler.length,
    siralayici,
    neural,
    bpr,
    icerikCnn,
    dogrulama,
    olcum: {
      siralayiciAuc: siralayici?.olcum?.auc ?? null,
      siralayiciKayip: siralayici?.olcum?.logKaybi ?? null,
      bprKayip: bpr?.olcum?.kayip ?? null,
      ornek: ornekler.length,
      etkilesim: etkilesimler.length
    }
  };
}

/** Model paketini depoya yazar. */
export function modelKaydet(depo, model) {
  if (!depo || typeof depo.setItem !== 'function' || !model) return false;
  try {
    depo.setItem(anahtar(model.profilId), JSON.stringify({
      surum: MODEL_SURUMU,
      profilId: model.profilId,
      egitimTs: model.egitimTs,
      ornekSayisi: model.ornekSayisi,
      etkilesimSayisi: model.etkilesimSayisi,
      izlenimSayisi: model.izlenimSayisi,
      olcum: model.olcum,
      dogrulama: model.dogrulama,
      siralayici: modelToJSON(model.siralayici),
      bpr: bprToJSON(model.bpr),
      neural: model.neural || null,
      icerikCnn: model.icerikCnn || null
    }));
    return true;
  } catch (_) {
    return false;
  }
}

/** Model paketini okur. Sürüm/şema uyuşmazsa null (sessiz bozulma yok). */
export function modelYukle(depo, profilId = 'profil') {
  if (!depo || typeof depo.getItem !== 'function') return null;
  try {
    const ham = depo.getItem(anahtar(profilId));
    if (!ham) return null;
    const j = JSON.parse(ham);
    if (!j || Number(j.surum) !== MODEL_SURUMU) return null;
    const siralayici = modelFromJSON(j.siralayici);
    const bpr = bprFromJSON(j.bpr);
    const neural = neuralFromJSON(j.neural, OZELLIK_ADLARI.length);
    const icerikCnn = sequenceCnnFromJSON(j.icerikCnn);
    if (!bpr && !siralayici) return null;
    return {
      surum: MODEL_SURUMU,
      profilId: j.profilId || profilId,
      egitimTs: Number(j.egitimTs) || 0,
      ornekSayisi: Number(j.ornekSayisi) || 0,
      etkilesimSayisi: Number(j.etkilesimSayisi) || 0,
      izlenimSayisi: Number(j.izlenimSayisi) || 0,
      olcum: j.olcum && typeof j.olcum === 'object' ? j.olcum : {},
      dogrulama: j.dogrulama && typeof j.dogrulama === 'object' ? j.dogrulama : null,
      siralayici: siralayici || { agirliklar: new Array(OZELLIK_ADLARI.length).fill(0), bias: 0, egitildi: false, olcum: {} },
      neural,
      icerikCnn,
      bpr: bpr || { tur: 'bpr', faktor: 0, kullanicilar: [], urunler: [], U: [], V: [], olcum: {}, egitildi: false }
    };
  } catch (_) {
    return null;
  }
}

/**
 * Yeniden eğitim gerekiyor mu? (yeni izlenim sayısı + süre eşiği)
 * @returns {boolean}
 */
export function egitimGerekliMi(model, izlenimSayisi = 0, simdiMs = Date.now()) {
  if (!model) return true;
  const yeni = Math.max(0, Number(izlenimSayisi) - (Number(model.izlenimSayisi) || 0));
  if (yeni >= YENIDEN_EGITIM_ESIGI) return true;
  const gecen = simdiMs - (Number(model.egitimTs) || 0);
  return gecen > EGITIM_ARALIGI_MS && yeni > 0;
}

/** Depodan izlenimleri okuyup modeli tazeler (gerekmiyorsa mevcut model). */
export function modeliHazirla({ depo, profilId, gecmis, favoriler, watchlist, kayitlar, simdiMs = Date.now(), zorla = false }) {
  const mevcut = modelYukle(depo, profilId);
  const izlenimler = izlenimOku(depo);
  if (!zorla && mevcut && !egitimGerekliMi(mevcut, izlenimler.length, simdiMs)) {
    return { model: mevcut, yeni: false };
  }
  const model = egitModel({ gecmis, favoriler, watchlist, izlenimler, kayitlar, profilId, simdiMs });
  modelKaydet(depo, model);
  return { model, yeni: true };
}

export { urunBenzerligi, OZELLIK_ADLARI };
