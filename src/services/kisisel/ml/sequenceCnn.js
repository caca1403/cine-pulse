import { TUR_KIMLIKLERI, turKimlikleri } from './ozellikler.js';

const PENCERE = 3;
const CEKIRDEK = 2;
const FILTRE = 8;
const TUR_ADEDI = TUR_KIMLIKLERI.length;

function rastgeleKur(tohum) {
  let a = (Number(tohum) >>> 0) || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ozellik(oge) {
  const v = new Float64Array(TUR_ADEDI);
  for (const id of turKimlikleri(oge)) {
    const i = TUR_KIMLIKLERI.indexOf(id);
    if (i >= 0) v[i] = 1;
  }
  return v;
}

function sigmoid(x) {
  const sinirli = Math.max(-18, Math.min(18, x));
  return 1 / (1 + Math.exp(-sinirli));
}

function ileri(model, dizi) {
  const pooled = new Float64Array(FILTRE);
  const kazanan = new Int8Array(FILTRE);
  const etkin = new Uint8Array(FILTRE);
  for (let konum = 0; konum <= PENCERE - CEKIRDEK; konum += 1) {
    for (let f = 0; f < FILTRE; f += 1) {
      let toplam = model.convBias[f];
      for (let k = 0; k < CEKIRDEK; k += 1) {
        for (let g = 0; g < TUR_ADEDI; g += 1) {
          toplam += dizi[konum + k][g] * model.conv[k][f][g];
        }
      }
      const aktivasyon = Math.max(0, toplam);
      if (aktivasyon > pooled[f]) {
        pooled[f] = aktivasyon;
        kazanan[f] = konum;
        etkin[f] = toplam > 0 ? 1 : 0;
      }
    }
  }
  const olasilik = new Float64Array(TUR_ADEDI);
  for (let g = 0; g < TUR_ADEDI; g += 1) {
    let logit = model.outBias[g];
    for (let f = 0; f < FILTRE; f += 1) logit += pooled[f] * model.out[f][g];
    olasilik[g] = sigmoid(logit);
  }
  return { pooled, kazanan, etkin, olasilik };
}

function bosModel(rastgele) {
  const conv = Array.from({ length: CEKIRDEK }, () =>
    Array.from({ length: FILTRE }, () =>
      Array.from({ length: TUR_ADEDI }, () => (rastgele() - 0.5) * 0.18)
    )
  );
  const out = Array.from({ length: FILTRE }, () =>
    Array.from({ length: TUR_ADEDI }, () => (rastgele() - 0.5) * 0.18)
  );
  return {
    surum: 1,
    turKimlikleri: [...TUR_KIMLIKLERI],
    conv,
    convBias: Array(FILTRE).fill(0),
    out,
    outBias: Array(TUR_ADEDI).fill(0),
    egitildi: true
  };
}

/**
 * Chronological genre vectors are trained as next-item targets with a small
 * Conv1D -> ReLU -> global-max-pool -> sigmoid head.
 */
export function sequenceCnnEgit(kayitlar = [], { epoch = 90, tohum = 20261030 } = {}) {
  const sira = (Array.isArray(kayitlar) ? kayitlar : [])
    .filter((x) => x && x.id != null && turKimlikleri(x).length > 0)
    .slice()
    .sort((a, b) => (Number(a.lastWatchedAt) || 0) - (Number(b.lastWatchedAt) || 0));
  const ogeler = [];
  const gorulen = new Set();
  for (const oge of sira) {
    const id = String(oge.id);
    if (gorulen.has(id)) continue;
    gorulen.add(id);
    ogeler.push(ozellik(oge));
  }
  if (ogeler.length < PENCERE + 3) return null;
  const egitimOgeleri = ogeler.slice(-180);

  const ornekler = [];
  for (let i = PENCERE; i < egitimOgeleri.length; i += 1) {
    ornekler.push({ x: egitimOgeleri.slice(i - PENCERE, i), y: egitimOgeleri[i] });
  }
  const model = bosModel(rastgeleKur(tohum));
  const ogrenme = 0.012;
  const donem = Math.max(1, Math.min(160, Math.trunc(Number(epoch) || 90)));
  for (let e = 0; e < donem; e += 1) {
    const oran = ogrenme / (1 + e * 0.02);
    for (const { x, y } of ornekler) {
      const { pooled, kazanan, etkin, olasilik } = ileri(model, x);
      const dLogit = new Float64Array(TUR_ADEDI);
      const dPool = new Float64Array(FILTRE);
      for (let g = 0; g < TUR_ADEDI; g += 1) {
        dLogit[g] = olasilik[g] - y[g];
        for (let f = 0; f < FILTRE; f += 1) dPool[f] += dLogit[g] * model.out[f][g];
      }
      for (let g = 0; g < TUR_ADEDI; g += 1) {
        for (let f = 0; f < FILTRE; f += 1) model.out[f][g] -= oran * dLogit[g] * pooled[f];
        model.outBias[g] -= oran * dLogit[g];
      }
      for (let f = 0; f < FILTRE; f += 1) {
        if (!etkin[f]) continue;
        const konum = kazanan[f];
        const gradyan = dPool[f];
        model.convBias[f] -= oran * gradyan;
        for (let k = 0; k < CEKIRDEK; k += 1) {
          for (let g = 0; g < TUR_ADEDI; g += 1) {
            model.conv[k][f][g] -= oran * gradyan * x[konum + k][g];
          }
        }
      }
    }
  }
  return model;
}

export function sequenceCnnPuanla(model, aday, kayitlar = []) {
  if (!model?.egitildi || !aday) return null;
  const sira = (Array.isArray(kayitlar) ? kayitlar : [])
    .filter((x) => x && x.id != null && turKimlikleri(x).length > 0)
    .slice()
    .sort((a, b) => (Number(a.lastWatchedAt) || 0) - (Number(b.lastWatchedAt) || 0));
  const son = [];
  const gorulen = new Set();
  for (const oge of sira) {
    const id = String(oge.id);
    if (gorulen.has(id)) continue;
    gorulen.add(id);
    son.push(ozellik(oge));
  }
  if (son.length < PENCERE) return null;
  const tahmin = ileri(model, son.slice(-PENCERE)).olasilik;
  const adayTurleri = turKimlikleri(aday)
    .map((id) => TUR_KIMLIKLERI.indexOf(id))
    .filter((i) => i >= 0);
  if (adayTurleri.length === 0) return null;
  return adayTurleri.reduce((toplam, i) => toplam + tahmin[i], 0) / adayTurleri.length;
}

export function sequenceCnnFromJSON(json) {
  if (!json || json.surum !== 1 || !Array.isArray(json.conv) || !Array.isArray(json.out)) return null;
  if (json.turKimlikleri?.join(',') !== TUR_KIMLIKLERI.join(',')) return null;
  if (json.conv.length !== CEKIRDEK || json.conv.some((k) => !Array.isArray(k) || k.length !== FILTRE || k.some((f) => !Array.isArray(f) || f.length !== TUR_ADEDI))) return null;
  if (json.out.length !== FILTRE || json.out.some((f) => !Array.isArray(f) || f.length !== TUR_ADEDI)) return null;
  if (json.convBias?.length !== FILTRE || json.outBias?.length !== TUR_ADEDI) return null;
  const sonlu = (arr) => arr.flat(Infinity).every((x) => Number.isFinite(Number(x)));
  if (![json.conv, json.convBias, json.out, json.outBias].every(sonlu)) return null;
  return {
    ...json,
    conv: json.conv.map((k) => k.map((f) => f.map(Number))),
    convBias: json.convBias.map(Number),
    out: json.out.map((f) => f.map(Number)),
    outBias: json.outBias.map(Number),
    egitildi: true
  };
}
