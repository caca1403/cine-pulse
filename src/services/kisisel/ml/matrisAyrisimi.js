/* ==========================================================================
   CinePulse Studio — MATRİS AYRIŞIMI (BPR) + ÜRÜN-ÜRÜN İŞBİRLİKÇİ FİLTRE
   --------------------------------------------------------------------------
   İki gerçek model, tek modülde:

   1) BPR (Bayesian Personalized Ranking) — gizli geri bildirimde (izleme,
      favori, liste) "gördüğüm > görmediğim" varsayımıyla SGD ile eğitilen
      matris çarpanları. Tek profilde bile çalışır: kullanıcı vektörü o profilin
      zevk yönünü, ürün vektörleri içeriklerin konumunu öğrenir.
   2) ÜRÜN-ÜRÜN CF — aynı seansta/geçmişte birlikte görülen içeriklerin
      kosinüs benzerliği; soğuk içerikler için BPR'yi besleyen ek sinyal.

   SAFLIK: ağ/DOM/localStorage yok, rastgelelik tohumlu (deterministik).
   ========================================================================== */

import { mulberry32 } from '../../canli/channelScheduler.js';

export const BPR_VARSAYILAN = Object.freeze({
  faktor: 12,
  epoch: 60,
  ogrenmeOrani: 0.05,
  reg: 0.015,
  tohum: 7727,
  negatifOrnek: 1
});

function nokta(a, b) {
  let t = 0;
  for (let i = 0; i < a.length; i += 1) t += a[i] * b[i];
  return t;
}

function sigmoid(x) {
  if (x >= 0) return 1 / (1 + Math.exp(-x));
  const e = Math.exp(x);
  return e / (1 + e);
}

/**
 * Etkileşimleri (kullanıcı, ürün) çiftlerine açar.
 * @param {Array<{kullanici?:string, urun:string, agirlik?:number}>} etkilesimler
 * @returns {{kullanicilar:string[], urunler:string[], ciftler:Array<{u:number,i:number,w:number}>}}
 */
function indeksle(etkilesimler) {
  const kullaniciIndeks = new Map();
  const urunIndeks = new Map();
  const kullanicilar = [];
  const urunler = [];
  const ciftler = [];
  for (const e of etkilesimler) {
    if (!e || e.urun == null || e.urun === '') continue;
    const k = String(e.kullanici || 'profil');
    const u = String(e.urun);
    if (!kullaniciIndeks.has(k)) {
      kullaniciIndeks.set(k, kullanicilar.length);
      kullanicilar.push(k);
    }
    if (!urunIndeks.has(u)) {
      urunIndeks.set(u, urunler.length);
      urunler.push(u);
    }
    ciftler.push({
      u: kullaniciIndeks.get(k),
      i: urunIndeks.get(u),
      w: Number.isFinite(Number(e.agirlik)) && Number(e.agirlik) > 0 ? Number(e.agirlik) : 1
    });
  }
  return { kullanicilar, urunler, ciftler };
}

/**
 * BPR eğitimi.
 * @param {object} girdi
 * @param {Array<{kullanici?:string, urun:string, agirlik?:number}>} girdi.etkilesimler
 * @param {object} [girdi.hiper]
 * @returns {object} model
 */
export function bprEgit({ etkilesimler = [], hiper = {} } = {}) {
  const h = { ...BPR_VARSAYILAN, ...hiper };
  const faktor = Math.max(1, Math.trunc(h.faktor));
  const { kullanicilar, urunler, ciftler } = indeksle(Array.isArray(etkilesimler) ? etkilesimler : []);
  const model = {
    tur: 'bpr',
    faktor,
    kullanicilar,
    urunler,
    U: [],
    V: [],
    olcum: { cift: ciftler.length, kullanici: kullanicilar.length, urun: urunler.length, kayip: null },
    egitildi: false
  };
  if (ciftler.length < 4 || urunler.length < 6) return model;

  const rastgele = mulberry32(Number(h.tohum) || 1);
  const baslat = () => Array.from({ length: faktor }, () => (rastgele() - 0.5) * 0.2);
  for (let u = 0; u < kullanicilar.length; u += 1) model.U.push(baslat());
  for (let i = 0; i < urunler.length; i += 1) model.V.push(baslat());

  // Kullanıcının pozitif ürün kümesi (negatif örneklem buradan kaçınır).
  const pozitifler = new Map();
  for (const c of ciftler) {
    if (!pozitifler.has(c.u)) pozitifler.set(c.u, new Set());
    pozitifler.get(c.u).add(c.i);
  }

  const lr = Number(h.ogrenmeOrani) > 0 ? Number(h.ogrenmeOrani) : 0.05;
  const reg = Number(h.reg) >= 0 ? Number(h.reg) : 0.015;
  const epoch = Math.max(1, Math.trunc(h.epoch));
  let sonKayip = null;

  for (let ep = 0; ep < epoch; ep += 1) {
    // Deterministik karıştırma (aynı tohum → aynı sıra).
    const sira = ciftler.map((_, i) => i);
    for (let i = sira.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rastgele() * (i + 1));
      [sira[i], sira[j]] = [sira[j], sira[i]];
    }
    let kayip = 0;
    for (const c of sira.map((k) => ciftler[k])) {
      for (let n = 0; n < Math.max(1, Math.trunc(h.negatifOrnek)); n += 1) {
        let neg = Math.floor(rastgele() * urunler.length);
        const gorulen = pozitifler.get(c.u);
        let deneme = 0;
        while (gorulen && gorulen.has(neg) && deneme < 10) {
          neg = Math.floor(rastgele() * urunler.length);
          deneme += 1;
        }
        if (gorulen && gorulen.has(neg)) continue;

        const u = model.U[c.u];
        const vi = model.V[c.i];
        const vj = model.V[neg];
        const fark = nokta(u, vi) - nokta(u, vj);
        const g = c.w * sigmoid(-fark);
        if (Number.isFinite(g)) kayip += -Math.log(sigmoid(fark) + 1e-9) * c.w;
        const uKopya = u.slice();
        for (let f = 0; f < faktor; f += 1) {
          const gi = g * (vi[f] - vj[f]) - reg * u[f];
          const gj = g * uKopya[f] - reg * vj[f];
          const gii = g * uKopya[f] - reg * vi[f];
          u[f] += lr * gi;
          vi[f] += lr * gii;
          vj[f] += lr * gj;
        }
      }
    }
    sonKayip = ciftler.length ? kayip / ciftler.length : null;
  }

  model.egitildi = true;
  model.olcum.kayip = sonKayip == null ? null : Math.round(sonKayip * 10000) / 10000;
  return model;
}

let _indeksOnbellek = new WeakMap();

/** Model içi indeks haritaları (her skorda yeniden kurulmaz). */
function indeksleriAl(model) {
  if (!model) return null;
  if (_indeksOnbellek.has(model)) return _indeksOnbellek.get(model);
  const kullanici = new Map();
  model.kullanicilar.forEach((k, i) => kullanici.set(k, i));
  const urun = new Map();
  model.urunler.forEach((u, i) => urun.set(u, i));
  const paket = { kullanici, urun };
  _indeksOnbellek.set(model, paket);
  return paket;
}

/**
 * Ham BPR skoru (log-odds benzeri). Model/eşleşme yoksa null.
 * @param {object} model bprEgit çıktısı
 * @param {string} kullanici
 * @param {string|number} urun
 * @returns {number|null}
 */
export function bprSkor(model, kullanici, urun) {
  if (!model || !model.egitildi) return null;
  const idx = indeksleriAl(model);
  const u = idx.kullanici.get(String(kullanici || 'profil'));
  const i = idx.urun.get(String(urun));
  if (u === undefined || i === undefined) return null;
  return nokta(model.U[u], model.V[i]);
}

/**
 * Ürün skorlarını 0..1 aralığına normalize eder (min-max). Tek üründe 0.5.
 * @param {object} model
 * @param {string} kullanici
 * @param {string[]} urunler
 * @returns {Map<string, number>}
 */
export function bprNormalize(model, kullanici, urunler = []) {
  const out = new Map();
  const ham = [];
  for (const u of urunler) {
    const s = bprSkor(model, kullanici, u);
    if (s == null) {
      out.set(String(u), null);
      continue;
    }
    ham.push([String(u), s]);
  }
  if (ham.length === 0) return out;
  if (ham.length === 1) {
    out.set(ham[0][0], 0.5);
    return out;
  }
  const degerler = ham.map(([, s]) => s);
  const min = Math.min(...degerler);
  const maks = Math.max(...degerler);
  for (const [u, s] of ham) {
    out.set(u, maks - min < 1e-9 ? 0.5 : (s - min) / (maks - min));
  }
  return out;
}

/**
 * Kullanıcı vektörüne en yakın ürünler (vektör uzayında komşuluk).
 * @param {object} model
 * @param {string} kullanici
 * @param {{haric?:Set<string>, adet?:number}} [secenek]
 * @returns {Array<{urun:string, skor:number}>}
 */
export function bprOneriler(model, kullanici, { haric = new Set(), adet = 20 } = {}) {
  if (!model || !model.egitildi) return [];
  const idx = indeksleriAl(model);
  const u = idx.kullanici.get(String(kullanici || 'profil'));
  if (u === undefined) return [];
  const skorlar = [];
  for (let i = 0; i < model.urunler.length; i += 1) {
    const urun = model.urunler[i];
    if (haric && haric.has(urun)) continue;
    skorlar.push({ urun, skor: nokta(model.U[u], model.V[i]) });
  }
  skorlar.sort((a, b) => b.skor - a.skor);
  return skorlar.slice(0, Math.max(0, adet));
}

/** Modeli JSON'a çevirir (ağırlıklar 4 ondalığa yuvarlanır — depolama dostu). */
export function bprToJSON(model) {
  if (!model || !model.egitildi) return null;
  const yuvarla = (v) => v.map((r) => r.map((x) => Math.round(x * 10000) / 10000));
  return {
    tur: 'bpr',
    faktor: model.faktor,
    kullanicilar: model.kullanicilar,
    urunler: model.urunler,
    U: yuvarla(model.U),
    V: yuvarla(model.V),
    olcum: model.olcum
  };
}

/** JSON'dan model. Şekil bozuksa null. */
export function bprFromJSON(json) {
  try {
    if (!json || json.tur !== 'bpr') return null;
    if (!Array.isArray(json.U) || !Array.isArray(json.V) || !Array.isArray(json.urunler)) return null;
    const faktor = Number(json.faktor);
    if (!Number.isFinite(faktor) || faktor < 1) return null;
    if (json.V.length !== json.urunler.length) return null;
    if (!json.U.every((r) => Array.isArray(r) && r.length === faktor)) return null;
    if (!json.V.every((r) => Array.isArray(r) && r.length === faktor)) return null;
    return {
      tur: 'bpr',
      faktor,
      kullanicilar: Array.isArray(json.kullanicilar) ? json.kullanicilar.map(String) : [],
      urunler: json.urunler.map(String),
      U: json.U.map((r) => r.map(Number)),
      V: json.V.map((r) => r.map(Number)),
      olcum: json.olcum && typeof json.olcum === 'object' ? json.olcum : {},
      egitildi: true
    };
  } catch (_) {
    return null;
  }
}

/* ── Ürün-ürün işbirlikçi filtre ───────────────────────────────────────── */

/**
 * Kosinüs tabanlı ürün-ürün benzerliği.
 * Sinyal kaynakları: (a) kullanıcının izleme sırasındaki komşuluk (aynı gün /
 * ardışık 3 içerik), (b) dışarıdan verilen katalog kenarları (TMDB benzer/
 * öneri kenarları). Kenar ağırlıkları toplanır.
 *
 * @param {object} girdi
 * @param {Array<{urun:string, zaman?:number}>} [girdi.dizi] izleme dizisi (yeniden eskiye)
 * @param {Array<{a:string,b:string,agirlik?:number}>} [girdi.kenarlar] dış katalog kenarları
 * @param {number} [girdi.komsuluk=3] dizide kaç komşuya bağlanacağı
 * @returns {{benzerlik:(a:string,b:string)=>number, komsular:(a:string,adet?:number)=>Array<{urun:string,skor:number}>, boyut:number}}
 */
export function urunBenzerligi({ dizi = [], kenarlar = [], komsuluk = 3 } = {}) {
  const komsulukSayisi = Math.max(1, Math.trunc(Number(komsuluk) || 3));
  const ciftAgirlik = new Map(); // "a|b" (a<b) → ağırlık
  const tekAgirlik = new Map();  // ürün → vektör büyüklüğü (kosinüs paydası)

  const ekle = (a, b, w) => {
    const A = String(a);
    const B = String(b);
    if (!A || !B || A === B) return;
    const agirlik = Number.isFinite(Number(w)) && Number(w) > 0 ? Number(w) : 1;
    const anahtar = A < B ? `${A}|${B}` : `${B}|${A}`;
    ciftAgirlik.set(anahtar, (ciftAgirlik.get(anahtar) || 0) + agirlik);
    tekAgirlik.set(A, (tekAgirlik.get(A) || 0) + agirlik * agirlik);
    tekAgirlik.set(B, (tekAgirlik.get(B) || 0) + agirlik * agirlik);
  };

  const liste = Array.isArray(dizi) ? dizi.filter((x) => x && x.urun != null) : [];
  for (let i = 0; i < liste.length; i += 1) {
    for (let j = i + 1; j < Math.min(liste.length, i + 1 + komsulukSayisi); j += 1) {
      // Yakın komşu daha güçlü: 1/(mesafe)
      ekle(liste[i].urun, liste[j].urun, 1 / (j - i));
    }
  }
  for (const k of Array.isArray(kenarlar) ? kenarlar : []) {
    if (!k) continue;
    ekle(k.a, k.b, k.agirlik == null ? 1.2 : k.agirlik);
  }

  const benzerlik = (a, b) => {
    const A = String(a);
    const B = String(b);
    if (!A || !B || A === B) return 0;
    const anahtar = A < B ? `${A}|${B}` : `${B}|${A}`;
    const w = ciftAgirlik.get(anahtar);
    if (!w) return 0;
    const payda = Math.sqrt((tekAgirlik.get(A) || 0) * (tekAgirlik.get(B) || 0));
    return payda > 0 ? w / payda : 0;
  };

  const komsular = (a, adet = 10) => {
    const A = String(a);
    const out = [];
    for (const anahtar of ciftAgirlik.keys()) {
      const [x, y] = anahtar.split('|');
      if (x !== A && y !== A) continue;
      const digeri = x === A ? y : x;
      const s = benzerlik(A, digeri);
      if (s > 0) out.push({ urun: digeri, skor: s });
    }
    out.sort((m, n) => n.skor - m.skor);
    return out.slice(0, Math.max(0, adet));
  };

  return { benzerlik, komsular, boyut: ciftAgirlik.size };
}
