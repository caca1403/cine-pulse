/* ==========================================================================
   CinePulse Studio — ÖNERİCİ (model → sıralı liste + "neden" açıklaması)
   --------------------------------------------------------------------------
   Girdi: aday havuzu (TMDB sayfaları, kanal havuzu, benzer içerikler).
   Çıktı: modele göre sıralanmış adaylar + her biri için Türkçe gerekçe.

   Skor bileşimi (hepsi gerçek modelden):
     0.60 × sıralayıcı olasılığı   (bağlam + tür + kalite + sinyaller)
     0.25 × BPR normalize skoru    (zevk yönü / matris ayrışımı)
     0.15 × ürün-ürün CF skoru     (birlikte izlenme)
   Model eğitilmemişse dürüstçe popülerlik/puan sırasına düşer ve
   `modelDurumu:'egitilmedi'` döner — sahte kişiselleştirme iddiası yok.
   ========================================================================== */

import { kodla, OZELLIK_ADLARI } from './ozellikler.js';
import { skorla, katkilar } from './lojistikSiralayici.js';
import { bprNormalize } from './matrisAyrisimi.js';
import { neuralSkorla } from './neuralRanker.js';
import { sequenceCnnPuanla } from './sequenceCnn.js';

export const AGIRLIKLAR = Object.freeze({
  siralayici: 0.4, neural: 0.2, bpr: 0.15, cf: 0.1, cnn: 0.15
});

const OZELLIK_ETIKET = Object.freeze({
  bias: '',
  tip_dizi: 'dizi tercihin',
  tip_anime: 'anime ilgin',
  tip_cizgi: 'çizgi içerik ilgin',
  puan: 'yüksek puan',
  populerlik: 'popülerlik',
  yil: 'dönem zevkin',
  tazelik: 'yeni içerik',
  favori: 'favorilerinde',
  izleme_listesi: 'listende',
  gecmis: 'daha önce izledin',
  birakilmis: 'yarım bıraktığın',
  tamamlanmis: 'bitirdiğin',
  cf_skor: 'birlikte izlenenler',
  mf_skor: 'zevk profiline yakınlık',
  kaynak_ana: '',
  kaynak_benzer: 'benzer içerik',
  kaynak_devam: 'devam eden akış',
  kaynak_kanal: 'kanal akışın',
  kaynak_tamamlanan: 'tamamladıklarına benzer',
  kaynak_favoriler: 'favorilerine benzer',
  saat_uyumu: 'izleme saatine uygun',
  hafta_sonu: 'hafta sonu seçimi'
});

/** Özellik adını kullanıcıya gösterilebilir kısa gerekçeye çevirir. */
export function ozellikEtiketi(ad) {
  const s = String(ad || '');
  if (OZELLIK_ETIKET[s] !== undefined) return OZELLIK_ETIKET[s];
  const m = s.match(/^tur_(\d+)$/);
  if (m) {
    const adlar = {
      28: 'aksiyon', 12: 'macera', 16: 'animasyon', 35: 'komedi', 80: 'suç',
      99: 'belgesel', 18: 'dram', 10751: 'aile', 14: 'fantastik', 36: 'tarih',
      27: 'korku', 9648: 'gizem', 10749: 'romantik', 878: 'bilim kurgu',
      53: 'gerilim', 10752: 'savaş', 10762: 'çocuk', 10759: 'aksiyon-macera',
      10765: 'bilim kurgu-fantastik', 10768: 'savaş-politika'
    };
    return adlar[m[1]] ? `${adlar[m[1]]} türü` : '';
  }
  return '';
}

/**
 * Modelin gerçekten eğitilmiş olup olmadığını söyler (görünüm bunu yazar).
 * @returns {{egitildi:boolean, ornek:number, etkilesim:number, auc:number|null, egitimTs:number}}
 */
export function modelDurumu(model) {
  if (!model) return { egitildi: false, ornek: 0, etkilesim: 0, auc: null, egitimTs: 0 };
  const siralayiciVar = Boolean(model.siralayici && model.siralayici.egitildi);
  return {
    egitildi: siralayiciVar,
    ornek: Number(model.ornekSayisi) || Number(model.olcum?.ornek) || 0,
    etkilesim: Number(model.etkilesimSayisi) || Number(model.olcum?.etkilesim) || 0,
    auc: Number.isFinite(Number(model.dogrulama?.auc)) ? Number(model.dogrulama.auc) : null,
    egitimTs: Number(model.egitimTs) || 0
  };
}

function populerlikSigortasi(oge) {
  const p = Number(oge?.popularity) || 0;
  const v = Number(oge?.vote_average ?? oge?.voteAverage) || 0;
  return Math.log1p(Math.max(0, p)) * 0.5 + v;
}

/**
 * Adayları modele göre sıralar.
 * @param {object} girdi
 * @param {object[]} girdi.adaylar medya kayıtları
 * @param {object|null} girdi.model egitmen.egitModel çıktısı
 * @param {object} [girdi.baglam] kodla() bağlamı (simdiMs, favoriIdler, ...)
 * @param {string} [girdi.kaynak='ana'] 'ana'|'benzer'|'devam'|'kanal'
 * @param {(a:string,b:string)=>number} [girdi.cfBenzerlik] ürün-ürün CF
 * @param {string} [girdi.tohumId] "çünkü X" satırı için tohum
 * @param {number} [girdi.adet] sınır
 * @returns {{liste:Array<object>, modelDurumu:object, skorlar:Map<string,number>}}
 */
export function sirala({
  adaylar = [], model = null, baglam = {}, kaynak = 'ana',
  cfBenzerlik = null, tohumId = null, adet = 0
} = {}) {
  const liste = (Array.isArray(adaylar) ? adaylar : []).filter((a) => a && a.id != null);
  const durum = modelDurumu(model);
  if (liste.length === 0) return { liste: [], modelDurumu: durum, skorlar: new Map() };

  const idler = liste.map((a) => String(a.id));
  const mfMap = model && model.bpr && model.bpr.egitildi
    ? bprNormalize(model.bpr, model.profilId || 'profil', idler)
    : new Map();
  const cnnModel = model?.icerikCnn || null;
  const skorlar = new Map();
  const cikti = [];

  for (const oge of liste) {
    const id = String(oge.id);
    const mfHam = mfMap.get(id);
    const mf = mfHam == null ? 0.5 : mfHam;
    const cfHam = typeof cfBenzerlik === 'function' && tohumId != null ? cfBenzerlik(String(tohumId), id) : null;
    const cf = cfHam == null ? 0 : Math.max(0, Math.min(1, cfHam));
    const x = kodla(oge, { ...baglam, kaynak, mfSkor: mf, cfSkor: cf });
    const s = durum.egitildi ? skorla(model.siralayici, x) : 0.5;
    const n = neuralSkorla(model?.neural, x);
    const cnn = sequenceCnnPuanla(cnnModel, oge, baglam.gecmis);
    const parts = [
      [AGIRLIKLAR.siralayici, s, durum.egitildi],
      [AGIRLIKLAR.neural, n, n != null],
      [AGIRLIKLAR.bpr, mf, Boolean(model?.bpr?.egitildi)],
      [AGIRLIKLAR.cf, cf, cfHam != null],
      [AGIRLIKLAR.cnn, cnn, cnn != null]
    ].filter(([, , aktif]) => aktif);
    const agirlikToplami = parts.reduce((toplam, [agirlik]) => toplam + agirlik, 0);
    const skor = agirlikToplami > 0
      ? parts.reduce((toplam, [agirlik, puan]) => toplam + agirlik * puan, 0) / agirlikToplami
      : 0.5;
    skorlar.set(id, skor);

    const nedenler = [];
    if (durum.egitildi) {
      for (const k of katkilar(model.siralayici, x, OZELLIK_ADLARI, 4)) {
        if (k.katki <= 0) continue;
        const etiket = ozellikEtiketi(k.ad);
        if (etiket && !nedenler.includes(etiket)) nedenler.push(etiket);
        if (nedenler.length >= 2) break;
      }
    }
    if (cfHam != null && cfHam > 0.08 && !nedenler.includes('birlikte izlenenler')) nedenler.push('birlikte izlenenler');

    cikti.push({
      oge,
      skor,
      neden: nedenler.slice(0, 2),
      bilesenler: { siralayici: s, neural: n, bpr: mf, cf, cnn }
    });
  }

  cikti.sort((a, b) => {
    if (Math.abs(b.skor - a.skor) > 1e-9) return b.skor - a.skor;
    return populerlikSigortasi(b.oge) - populerlikSigortasi(a.oge);
  });

  const kesilmis = adet > 0 ? cikti.slice(0, adet) : cikti;
  return { liste: kesilmis, modelDurumu: durum, skorlar };
}

/**
 * Kanal programlayıcısı için ağırlık fonksiyonu üretir: tmdbId → 0.2..2.2
 * çarpanı. Model yoksa null döner (scheduler kendi ağırlıklarıyla çalışır).
 */
export function kanalAgirlikFonksiyonu({ model, adaylar = [], baglam = {} } = {}) {
  if (!model || !modelDurumu(model).egitildi) return null;
  const { skorlar } = sirala({ adaylar, model, baglam, kaynak: 'kanal' });
  if (skorlar.size === 0) return null;
  const degerler = [...skorlar.values()];
  const min = Math.min(...degerler);
  const maks = Math.max(...degerler);
  return (ada) => {
    const s = skorlar.get(String(ada?.tmdbId));
    if (s == null) return 1;
    const t = maks - min < 1e-9 ? 0.5 : (s - min) / (maks - min);
    return 0.55 + t * 1.65;
  };
}
