/* ==========================================================================
   CinePulse Studio — LOJİSTİK SIRALAYICI (gerçek eğitilen model, SAF)
   --------------------------------------------------------------------------
   Gösterilen kartlar arasından TIKLANAN/İZLENEN kartı öğrenir: ikili
   sınıflandırma (gösterim → tıklama). Mini-batch SGD + L2 + sınıf dengeleme.
   Kalibrasyon için tek örneklemli ölçek uydurma (Platt) yerine doğrudan
   log-odds kullanılır; sıralama için yeterli, olasılık iddiası yoktur.

   · Deterministik: aynı veri + aynı tohum → aynı ağırlıklar (test edilir).
   · DOM/ağ yok.
   ========================================================================== */

import { mulberry32 } from '../../canli/channelScheduler.js';
import { OZELLIK_SAYISI } from './ozellikler.js';

/** Varsayılan hiperparametreler (küçük veride makul, hepsi override edilebilir). */
export const SIRALAYICI_VARSAYILAN = Object.freeze({
  ogrenmeOrani: 0.08,
  l2: 0.0035,
  epoch: 220,
  partiBoyu: 16,
  tohum: 20261030,
  sinifDengele: true
});

function sigmoid(z) {
  if (z >= 0) {
    const e = Math.exp(-z);
    return 1 / (1 + e);
  }
  const e = Math.exp(z);
  return e / (1 + e);
}

/**
 * AUC (Mann-Whitney U). Etiketlerde tek sınıf varsa null döner — uydurma yok.
 * @param {number[]} skorlar
 * @param {number[]} etiketler 0/1
 * @returns {number|null}
 */
export function auc(skorlar, etiketler) {
  const pozitifler = [];
  const negatifler = [];
  for (let i = 0; i < skorlar.length; i += 1) {
    if (Number(etiketler[i]) >= 0.5) pozitifler.push(Number(skorlar[i]));
    else negatifler.push(Number(skorlar[i]));
  }
  if (pozitifler.length === 0 || negatifler.length === 0) return null;
  let kazanc = 0;
  for (const p of pozitifler) {
    for (const n of negatifler) {
      if (p > n) kazanc += 1;
      else if (p === n) kazanc += 0.5;
    }
  }
  return kazanc / (pozitifler.length * negatifler.length);
}

/** Ortalama log-loss (0/1 etiket, olasılık). */
export function logKaybi(olasiliklar, etiketler) {
  let toplam = 0;
  const eps = 1e-9;
  for (let i = 0; i < olasiliklar.length; i += 1) {
    const p = Math.min(1 - eps, Math.max(eps, Number(olasiliklar[i])));
    toplam += Number(etiketler[i]) >= 0.5 ? -Math.log(p) : -Math.log(1 - p);
  }
  return olasiliklar.length ? toplam / olasiliklar.length : 0;
}

/**
 * Sıralayıcıyı eğitir.
 * @param {object} girdi
 * @param {Array<{x: Float64Array|number[], y: number, agirlik?: number}>} girdi.ornekler
 * @param {object} [girdi.hiper] SIRALAYICI_VARSAYILAN üzerine override
 * @returns {{agirliklar: number[], bias: number, olcum: object, egitildi: boolean}}
 */
export function egitSiralayici({ ornekler = [], hiper = {} } = {}) {
  const h = { ...SIRALAYICI_VARSAYILAN, ...hiper };
  const veri = (Array.isArray(ornekler) ? ornekler : [])
    .filter((o) => o && (o.x instanceof Float64Array || Array.isArray(o.x)) && Number.isFinite(Number(o.y)))
    .map((o) => ({ x: o.x, y: Number(o.y) >= 0.5 ? 1 : 0, w: Number.isFinite(Number(o.agirlik)) && Number(o.agirlik) > 0 ? Number(o.agirlik) : 1 }));

  const boyut = OZELLIK_SAYISI;
  const sonuc = { agirliklar: new Array(boyut).fill(0), bias: 0, egitildi: false, olcum: { ornek: veri.length } };
  if (veri.length < 8) return sonuc;

  const pozitif = veri.filter((o) => o.y === 1).length;
  const negatif = veri.length - pozitif;
  if (pozitif === 0 || negatif === 0) return sonuc;

  // Sınıf dengeleme: azınlık sınıfı örnekleri daha ağır sayılır.
  const pozAgirlik = h.sinifDengele ? veri.length / (2 * pozitif) : 1;
  const negAgirlik = h.sinifDengele ? veri.length / (2 * negatif) : 1;
  const agirliklar = new Array(boyut).fill(0);
  let bias = 0;
  const rastgele = mulberry32(Number(h.tohum) || 1);
  let sonKayip = Infinity;

  for (let ep = 0; ep < Math.max(1, Math.trunc(h.epoch)); ep += 1) {
    const sira = veri.map((_, i) => i);
    for (let i = sira.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rastgele() * (i + 1));
      [sira[i], sira[j]] = [sira[j], sira[i]];
    }
    const adim = Math.max(1, Math.trunc(h.partiBoyu));
    for (let b = 0; b < sira.length; b += adim) {
      const gW = new Array(boyut).fill(0);
      let gB = 0;
      let toplamAgirlik = 0;
      for (let k = b; k < Math.min(sira.length, b + adim); k += 1) {
        const o = veri[sira[k]];
        const oAgirlik = o.y === 1 ? pozAgirlik : negAgirlik;
        let z = bias;
        for (let d = 0; d < boyut; d += 1) z += agirliklar[d] * Number(o.x[d] || 0);
        const hata = (sigmoid(z) - o.y) * oAgirlik;
        for (let d = 0; d < boyut; d += 1) gW[d] += hata * Number(o.x[d] || 0);
        gB += hata;
        toplamAgirlik += oAgirlik;
      }
      const normal = toplamAgirlik > 0 ? 1 / toplamAgirlik : 1;
      for (let d = 0; d < boyut; d += 1) {
        agirliklar[d] -= h.ogrenmeOrani * (gW[d] * normal + h.l2 * agirliklar[d]);
      }
      bias -= h.ogrenmeOrani * gB * normal;
    }
    if ((ep + 1) % 20 === 0) {
      const p = veri.map((o) => olasilik(agirliklar, bias, o.x));
      const kayip = logKaybi(p, veri.map((o) => o.y));
      sonKayip = kayip;
      if (!Number.isFinite(kayip)) break;
    }
  }

  const olasiliklar = veri.map((o) => olasilik(agirliklar, bias, o.x));
  const etiketler = veri.map((o) => o.y);
  sonuc.agirliklar = agirliklar;
  sonuc.bias = bias;
  sonuc.egitildi = true;
  sonuc.olcum = {
    ornek: veri.length,
    pozitif,
    negatif,
    auc: auc(olasiliklar, etiketler),
    logKaybi: logKaybi(olasiliklar, etiketler),
    epoch: Math.max(1, Math.trunc(h.epoch))
  };
  return sonuc;
}

/** Ham log-odds. */
export function olasilik(agirliklar, bias, x) {
  let z = Number(bias) || 0;
  const w = Array.isArray(agirliklar) ? agirliklar : [];
  for (let d = 0; d < w.length; d += 1) z += (Number(w[d]) || 0) * Number(x?.[d] || 0);
  return sigmoid(z);
}

/**
 * Model nesnesiyle tek örnek skoru (0..1).
 * @param {{agirliklar:number[], bias:number, egitildi?:boolean}|null} model
 * @param {Float64Array|number[]} x
 * @returns {number} model yoksa 0.5 (nötr; sıralamayı bozmaz)
 */
export function skorla(model, x) {
  if (!model || !model.egitildi || !Array.isArray(model.agirliklar)) return 0.5;
  return olasilik(model.agirliklar, model.bias, x);
}

/** JSON'a serileştirme (localStorage). */
export function modelToJSON(model) {
  if (!model) return null;
  return {
    surum: 1,
    boyut: Number(model.boyut) || OZELLIK_SAYISI,
    agirliklar: model.agirliklar.map((w) => Math.round(Number(w) * 100000) / 100000),
    bias: Math.round((Number(model.bias) || 0) * 100000) / 100000,
    olcum: model.olcum || null
  };
}

/**
 * JSON'dan model. Boyut uyuşmazsa null (sessiz bozulma yok).
 * @param {object|null} json
 * @returns {{agirliklar:number[], bias:number, egitildi:boolean, olcum:object, boyut:number}|null}
 */
export function modelFromJSON(json) {
  if (!json || !Array.isArray(json.agirliklar)) return null;
  if (Number(json.boyut) !== OZELLIK_SAYISI) return null;
  if (json.agirliklar.length !== OZELLIK_SAYISI) return null;
  return {
    agirliklar: json.agirliklar.map(Number),
    bias: Number(json.bias) || 0,
    egitildi: true,
    olcum: json.olcum && typeof json.olcum === 'object' ? json.olcum : {},
    boyut: OZELLIK_SAYISI
  };
}

/**
 * "Neden bu?" açıklaması: katkısı en yüksek ilk `adet` özellik.
 * @param {{agirliklar:number[], bias:number}|null} model
 * @param {Float64Array|number[]} x
 * @param {string[]} adlar
 * @param {number} [adet]
 * @returns {Array<{ad:string, katki:number}>} katkıya göre azalan
 */
export function katkilar(model, x, adlar, adet = 3) {
  if (!model || !Array.isArray(model.agirliklar)) return [];
  const satirlar = [];
  for (let d = 0; d < model.agirliklar.length; d += 1) {
    const katki = (Number(model.agirliklar[d]) || 0) * Number(x?.[d] || 0);
    if (katki !== 0) satirlar.push({ ad: adlar[d] || `f${d}`, katki });
  }
  satirlar.sort((a, b) => Math.abs(b.katki) - Math.abs(a.katki));
  return satirlar.slice(0, Math.max(0, adet));
}
