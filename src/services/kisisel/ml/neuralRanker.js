function rastgeleKur(tohum) {
  let a = (Number(tohum) >>> 0) || 7;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-Math.max(-18, Math.min(18, x))));
}

function ileri(model, x) {
  const h = model.biasGizli.map((b, j) => Math.tanh(
    b + x.reduce((s, v, i) => s + v * model.giris[i][j], 0)
  ));
  const logit = model.biasCikis[0] + h.reduce((s, v, j) => s + v * model.cikis[j][0], 0);
  return { h, p: sigmoid(logit) };
}

/** Trains a small tanh MLP on observed impressions/clicks; no synthetic labels. */
export function neuralEgit(ornekler = [], { epoch = 100, tohum = 20261030 } = {}) {
  const ham = (Array.isArray(ornekler) ? ornekler : [])
    .filter((o) => o?.x && Number.isFinite(Number(o.y)) && o.x.length > 0);
  const pozitifler = ham.filter((o) => Number(o.y) >= 0.5);
  const negatifler = ham.filter((o) => Number(o.y) < 0.5);
  const liste = [
    ...pozitifler.slice(-300),
    ...negatifler.slice(-300)
  ];
  const egitimPozitif = Math.min(300, pozitifler.length);
  const egitimNegatif = Math.min(300, negatifler.length);
  const girdiSayisi = liste[0]?.x?.length || 0;
  const pozitif = pozitifler.length;
  const negatif = negatifler.length;
  if (liste.length < 24 || pozitif < 3 || negatif < 3) return null;
  if (liste.some((o) => o.x.length !== girdiSayisi)) return null;

  const gizliSayisi = 16;
  const rastgele = rastgeleKur(tohum);
  const model = {
    surum: 1,
    girdiSayisi,
    gizliSayisi,
    giris: Array.from({ length: girdiSayisi }, () =>
      Array.from({ length: gizliSayisi }, () => (rastgele() * 2 - 1) * Math.sqrt(1 / girdiSayisi))
    ),
    biasGizli: Array(gizliSayisi).fill(0),
    cikis: Array.from({ length: gizliSayisi }, () => [(rastgele() * 2 - 1) * 0.08]),
    biasCikis: [0],
    egitildi: true
  };

  const donem = Math.max(1, Math.min(200, Math.trunc(Number(epoch) || 100)));
  for (let e = 0; e < donem; e += 1) {
    const oran = 0.025 / (1 + e * 0.015);
    const siralama = Array.from({ length: liste.length }, (_, i) => i);
    for (let i = siralama.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rastgele() * (i + 1));
      [siralama[i], siralama[j]] = [siralama[j], siralama[i]];
    }
    for (const index of siralama) {
      const oge = liste[index];
      const x = Array.from(oge.x, (n) => Math.max(-1, Math.min(1, Number(n) || 0)));
      const y = Number(oge.y) >= 0.5 ? 1 : 0;
      const { h, p } = ileri(model, x);
      const classWeight = Math.min(4, y
        ? liste.length / (2 * egitimPozitif)
        : liste.length / (2 * egitimNegatif));
      const sampleWeight = Math.max(0, Math.min(4, Number(oge.agirlik) || 1));
      const dLogit = (p - y) * classWeight * sampleWeight;
      const dGizli = h.map((v, j) => dLogit * model.cikis[j][0] * (1 - v * v));
      for (let j = 0; j < gizliSayisi; j += 1) {
        model.cikis[j][0] -= oran * dLogit * h[j];
        model.biasGizli[j] -= oran * dGizli[j];
        for (let i = 0; i < girdiSayisi; i += 1) model.giris[i][j] -= oran * dGizli[j] * x[i];
      }
      model.biasCikis[0] -= oran * dLogit;
    }
  }
  return model;
}

export function neuralSkorla(model, vektor) {
  if (!model?.egitildi || !vektor || vektor.length !== model.girdiSayisi) return null;
  return ileri(model, Array.from(vektor, (n) => Math.max(-1, Math.min(1, Number(n) || 0)))).p;
}

export function neuralFromJSON(json, beklenenGirdi = null) {
  if (!json || json.surum !== 1 || !Number.isInteger(json.girdiSayisi) || json.girdiSayisi < 1
      || (beklenenGirdi != null && json.girdiSayisi !== beklenenGirdi)
      || json.gizliSayisi !== 16 || !Array.isArray(json.giris) || json.giris.length !== json.girdiSayisi
      || !Array.isArray(json.biasGizli) || !Array.isArray(json.cikis) || !Array.isArray(json.biasCikis)
      || json.giris.some((satir) => !Array.isArray(satir) || satir.length !== json.gizliSayisi)
      || json.biasGizli?.length !== json.gizliSayisi
      || json.cikis?.length !== json.gizliSayisi
      || json.cikis.some((satir) => !Array.isArray(satir) || satir.length !== 1)
      || json.biasCikis?.length !== 1) return null;
  const sonlu = (arr) => arr.flat(Infinity).every((x) => Number.isFinite(Number(x)));
  if (![json.giris, json.biasGizli, json.cikis, json.biasCikis].every(sonlu)) return null;
  return {
    ...json,
    giris: json.giris.map((r) => r.map(Number)),
    biasGizli: json.biasGizli.map(Number),
    cikis: json.cikis.map((r) => r.map(Number)),
    biasCikis: json.biasCikis.map(Number),
    egitildi: true
  };
}
