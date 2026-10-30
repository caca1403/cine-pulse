import { fetchDiscoverMedia, fetchRecommendations } from '../icerik/tmdbApi.js';
import { siralaAdaylar } from './kisiselMotor.js';
import { turKimlikleri } from './ml/ozellikler.js';

const medyaTipi = (oge) => {
  const tipler = [oge?.media_type, oge?.type].map((tip) => String(tip || '').toLowerCase());
  if (tipler.includes('movie')) return 'movie';
  if (tipler.includes('tv') || tipler.includes('anime')) return 'tv';
  if (oge?.first_air_date || oge?.number_of_seasons || oge?.isSeries) return 'tv';
  return 'movie';
};

const KEY = (oge) => {
  if (!oge || oge.id == null) return '';
  return `${medyaTipi(oge)}:${String(oge.id)}`;
};

function siralaGuncel(liste) {
  return (Array.isArray(liste) ? liste : [])
    .filter((x) => x && x.id != null)
    .slice()
    .sort((a, b) => (Number(b.lastWatchedAt || b.addedAt) || 0) - (Number(a.lastWatchedAt || a.addedAt) || 0));
}

export function onerilenlerdenCikar({ gecmis = [], tamamlanan = [], favoriler = [], watchlist = [] } = {}) {
  const idler = new Set();
  for (const liste of [gecmis, tamamlanan, favoriler, watchlist]) {
    for (const oge of Array.isArray(liste) ? liste : []) {
      const key = KEY(oge);
      if (key) idler.add(key);
    }
  }
  return idler;
}

export function adaylariTekillestir(liste, haric = new Set()) {
  const gorulen = new Set();
  const out = [];
  for (const oge of Array.isArray(liste) ? liste : []) {
    const key = KEY(oge);
    if (!key || gorulen.has(key) || haric.has(key)) continue;
    gorulen.add(key);
    out.push(oge);
  }
  return out;
}

function tohumlariSec({ gecmis, tamamlanan, favoriler, watchlist }, secenek = {}) {
  const limit = Math.max(1, Math.min(8, Math.trunc(Number(secenek.adet) || 6)));
  const sec = (liste) => siralaGuncel(liste).slice(0, limit);
  const gruplar = {
    tamamlanan: sec(tamamlanan),
    favoriler: sec(favoriler),
    watchlist: sec(watchlist),
    gecmis: sec(gecmis)
  };
  const hepsi = [];
  const gorulen = new Set();
  for (const oge of [...gruplar.favoriler, ...gruplar.watchlist, ...gruplar.gecmis, ...gruplar.tamamlanan]) {
    const key = KEY(oge);
    if (!key || gorulen.has(key)) continue;
    gorulen.add(key);
    hepsi.push(oge);
  }
  return { ...gruplar, hepsi: hepsi.slice(0, limit) };
}

function genreFallbackSeeds({ favoriler = [], gecmis = [], tamamlanan = [], watchlist = [] } = {}) {
  const sayim = new Map();
  for (const [liste, agirlik] of [[favoriler, 4], [watchlist, 3], [gecmis, 2], [tamamlanan, 1]]) {
    for (const oge of siralaGuncel(liste)) {
      for (const id of turKimlikleri(oge)) sayim.set(id, (sayim.get(id) || 0) + agirlik);
    }
  }
  return [...sayim].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id]) => id);
}

function siralaDengele(liste, model, etkile, adet, kaynak = 'ana') {
  const adaylar = adaylariTekillestir(liste);
  if (!adaylar.length) return [];
  const ranked = siralaAdaylar(adaylar, {
    kaynak,
    adet: 0,
    model,
    ekKayitlar: etkile
  }).liste;
  const kalan = ranked.map((x) => ({ oge: x.oge, skor: x.skor }));
  const secilen = [];
  const turSayisi = new Map();
  const tipSayisi = new Map();
  while (kalan.length && secilen.length < adet) {
    let best = 0;
    let bestScore = -Infinity;
    for (let i = 0; i < kalan.length; i += 1) {
      const oge = kalan[i].oge;
      const idler = turKimlikleri(oge);
      const tekrar = idler.reduce((s, id) => s + (turSayisi.get(id) || 0), 0);
      const tip = oge.type === 'movie' || oge.media_type === 'movie' ? 'movie' : 'tv';
      const tipCeza = (tipSayisi.get(tip) || 0) * 0.018;
      const ceza = Math.min(0.08, tekrar * 0.012);
      const puan = kalan[i].skor - ceza - tipCeza;
      if (puan > bestScore) { bestScore = puan; best = i; }
    }
    const [item] = kalan.splice(best, 1);
    secilen.push(item.oge);
    const tip = item.oge.type === 'movie' || item.oge.media_type === 'movie' ? 'movie' : 'tv';
    tipSayisi.set(tip, (tipSayisi.get(tip) || 0) + 1);
    for (const id of turKimlikleri(item.oge)) turSayisi.set(id, (turSayisi.get(id) || 0) + 1);
  }
  return secilen;
}

async function paralelSinirli(liste, eszamanli = 3) {
  const sonuc = new Array(liste.length);
  let sira = 0;
  const isci = async () => {
    while (sira < liste.length) {
      const i = sira++;
      sonuc[i] = await liste[i]();
    }
  };
  await Promise.all(Array.from({ length: Math.min(eszamanli, liste.length) }, isci));
  return sonuc;
}

/**
 * Builds personalized, unseen-only rows from TMDB recommendation edges.
 * Finished titles are positive taste signals, never eligible card results.
 */
export async function fetchPersonalizedRows({
  gecmis = [],
  tamamlanan = [],
  favoriler = [],
  watchlist = [],
  model = null,
  fallbackAdaylar = [],
  adet = 40,
  isKid = false,
  guvenliMi = null,
  fetchRecommendationsFn = fetchRecommendations,
  fetchDiscoverFn = fetchDiscoverMedia
} = {}) {
  const kaynaklar = { gecmis, tamamlanan, favoriler, watchlist };
  const tohumlar = tohumlariSec(kaynaklar);
  const haric = onerilenlerdenCikar(kaynaklar);
  const hedefAdet = Math.max(10, Math.min(40, Math.trunc(Number(adet)) || 40));
  const seedFetch = new Map();
  const recommendations = async (seed, page = 1) => {
    const key = `${KEY(seed)}:${page}`;
    if (!key) return [];
    if (!seedFetch.has(key)) {
      const type = medyaTipi(seed);
      seedFetch.set(key, fetchRecommendationsFn(type, seed.id, page).catch(() => []));
    }
    return seedFetch.get(key);
  };

  const bitenTohumlar = tohumlar.tamamlanan.slice(0, 4);
  const favoriTohumlar = tohumlar.favoriler.slice(0, 4);
  const istekTohumlari = adaylariTekillestir(
    [...tohumlar.hepsi, ...bitenTohumlar, ...favoriTohumlar]
  );
  const istekSonuclari = await paralelSinirli(
    istekTohumlari.map((seed) => () => recommendations(seed)), 3
  );
  const sonucHaritasi = new Map(istekTohumlari.map((seed, index) => [KEY(seed), istekSonuclari[index] || []]));
  const tohumSonuclari = (liste) => liste.flatMap((seed) => sonucHaritasi.get(KEY(seed)) || []);
  const anaHam = tohumSonuclari(tohumlar.hepsi);
  let bitenHam = tohumSonuclari(bitenTohumlar);
  let favoriHam = tohumSonuclari(favoriTohumlar);
  const guvenliSuze = (liste) => (Array.isArray(liste) ? liste : []).filter((x) =>
    x && x.id != null && (!isKid || (typeof guvenliMi === 'function' && guvenliMi(x)))
  );
  const etkile = [...gecmis, ...tamamlanan, ...favoriler, ...watchlist];
  const temizle = (liste) => adaylariTekillestir(guvenliSuze(liste), haric);
  const ekOneriSayfalari = [];
  if (bitenTohumlar.length && temizle(bitenHam).length < hedefAdet) {
    ekOneriSayfalari.push(
      paralelSinirli(bitenTohumlar.map((seed) => () => recommendations(seed, 2)), 3)
    );
  }
  if (favoriTohumlar.length && temizle(favoriHam).length < hedefAdet) {
    ekOneriSayfalari.push(
      paralelSinirli(favoriTohumlar.map((seed) => () => recommendations(seed, 2)), 3)
    );
  }
  const ekOneriSonuclari = await Promise.all(ekOneriSayfalari);
  let ekOneriIndex = 0;
  if (bitenTohumlar.length && temizle(bitenHam).length < hedefAdet) {
    bitenHam = [...bitenHam, ...(ekOneriSonuclari[ekOneriIndex++] || []).flat()];
  }
  if (favoriTohumlar.length && temizle(favoriHam).length < hedefAdet) {
    favoriHam = [...favoriHam, ...(ekOneriSonuclari[ekOneriIndex] || []).flat()];
  }
  const baslangicAdaylari = temizle([...anaHam, ...(Array.isArray(fallbackAdaylar) ? fallbackAdaylar : [])]);
  const eksikTurler = ['movie', 'tv'].filter((tip) =>
    baslangicAdaylari.filter((oge) => medyaTipi(oge) === tip).length < hedefAdet
  );
  const genreIds = genreFallbackSeeds(kaynaklar);
  const discoveryGenres = genreIds.length ? genreIds.slice(0, 3) : [null];
  const discoverRequests = discoveryGenres.flatMap((id) =>
    [1, 2].flatMap((page) => eksikTurler.map((type) =>
      () => fetchDiscoverFn({
        type,
        ...(id == null ? {} : { genreId: String(id) }),
        page,
        sortBy: 'popularity.desc'
      }).catch(() => [])
    ))
  );
  const discoverAdaylari = eksikTurler.length
    ? (await paralelSinirli(discoverRequests, 2)).flat()
    : [];
  const tumAdaylar = temizle([...baslangicAdaylari, ...discoverAdaylari]);
  const tum = siralaDengele(tumAdaylar, model, etkile, hedefAdet, 'ana');
  const filmler = siralaDengele(
    tumAdaylar.filter((oge) => medyaTipi(oge) === 'movie'),
    model, etkile, hedefAdet, 'ana'
  );
  const diziler = siralaDengele(
    tumAdaylar.filter((oge) => medyaTipi(oge) === 'tv'),
    model, etkile, hedefAdet, 'ana'
  );
  const bitenOnerileri = siralaDengele(temizle(bitenHam), model, etkile, hedefAdet, 'tamamlanan');
  const favoriOnerileri = siralaDengele(temizle(favoriHam), model, etkile, hedefAdet, 'favoriler');

  return {
    seninIcin: tum,
    sanaOzelFilmler: filmler,
    sanaOzelDiziler: diziler,
    tamamladiklarindanSonra: bitenOnerileri,
    favorilerineGore: favoriOnerileri
  };
}
