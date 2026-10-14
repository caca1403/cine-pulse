/* ==========================================================================
   CinePulse Studio - "Kanalım" Yayın Programlayıcı
   Kullanıcının izleme geçmişi + favorileri + izleme saatinden cihaz-içi
   algoritmayla kişisel bir TV kanalı programı üretir.
   SAF fonksiyonlar: fetch / localStorage / DOM / Date.now() YOK (tamamen
   enjekte edilen diziler ve sayılarla çalışır), böylece determinist ve
   test edilebilirdir.
   ========================================================================== */

/* TMDB tür kimlikleri -> Türkçe ad. Programdaki `tur` alanı bu adları taşır;
   kayıt yalnızca genre_ids (sayısal) taşıdığı için ad çözümü burada yapılır. */
const TUR_ADLARI = {
  12: 'Macera', 14: 'Fantastik', 16: 'Animasyon', 18: 'Dram', 27: 'Korku',
  28: 'Aksiyon', 35: 'Komedi', 36: 'Tarih', 37: 'Western', 53: 'Gerilim',
  80: 'Suç', 99: 'Belgesel', 878: 'Bilim Kurgu', 9648: 'Gizem',
  10749: 'Romantik', 10751: 'Aile', 10752: 'Savaş', 10762: 'Çocuk',
  10759: 'Aksiyon & Macera', 10763: 'Haber', 10764: 'Reality',
  10765: 'Bilim Kurgu & Fantastik', 10766: 'Pembe Dizi', 10767: 'Talk',
  10768: 'Savaş & Politika', 10770: 'TV Filmi'
};

/**
 * mulberry32: tohumlanabilir, hızlı ve deterministik PRNG.
 * Aynı tohum birebir aynı sayı dizisini üretir; "Kanalı değiştir" = yeni tohum.
 * @param {number} tohum
 * @returns {() => number} [0,1) aralığında ardışık sözde-rastgele sayı üreteci
 */
export function mulberry32(tohum) {
  let a = (tohum >>> 0) || 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Bir kaydın tür adlarını (Türkçe) çıkarır. Boşsa 'Genel' döner.
 * @param {object} item
 * @returns {string[]} en az bir tür adı
 */
function turleriCoz(item) {
  if (!item) return ['Genel'];
  const temiz = [];
  // 1) genre_ids sayısal TMDB kimlikleri -> Türkçe ad (tercih edilen yol)
  if (Array.isArray(item.genre_ids)) {
    for (const id of item.genre_ids) {
      const ad = TUR_ADLARI[Number(id)];
      if (ad && !temiz.includes(ad)) temiz.push(ad);
    }
  }
  // 2) genre_ids yoksa genres listesinden çöz (obje id'si ya da ismi)
  if (temiz.length === 0 && Array.isArray(item.genres)) {
    for (const g of item.genres) {
      const ad = (g && typeof g === 'object') ? (TUR_ADLARI[Number(g.id)] || g.name) : String(g || '');
      const s = String(ad || '').trim();
      if (s && !temiz.includes(s)) temiz.push(s);
    }
  }
  return temiz.length ? temiz : ['Genel'];
}

/**
 * Kaydın yayın tipini belirler: 'dizi' (tv/anime) veya 'film'.
 * @param {object} item
 * @returns {'dizi'|'film'}
 */
function tipCoz(item) {
  if (!item) return 'film';
  const t = item.type || item.media_type;
  if (t === 'tv' || t === 'anime') return 'dizi';
  if (t === 'movie') return 'film';
  if (item.isSeries === true) return 'dizi';
  if (item.first_air_date || item.number_of_seasons || item.episodesCount) return 'dizi';
  if (item.season > 1 || item.episode > 1) return 'dizi';
  return 'film';
}

/**
 * Kaydın izlenme saatlerini (0-23) çıkarır. Önce açık alanlara (saat/watchHour/
 * hour), yoksa lastWatchedAt zaman damgasına bakılır. Veri yoksa [] döner.
 * @param {object} item
 * @returns {number[]}
 */
function saatleriCoz(item) {
  const saatler = [];
  if (!item) return saatler;
  for (const ham of [item.saat, item.watchHour, item.hour]) {
    const n = Number(ham);
    if (Number.isFinite(n) && n >= 0 && n <= 23) saatler.push(n);
  }
  if (saatler.length === 0 && item.lastWatchedAt) {
    const d = new Date(Number(item.lastWatchedAt));
    const h = d.getHours();
    if (Number.isFinite(h)) saatler.push(h);
  }
  return saatler;
}

/**
 * Kaydı aday nesnesine dönüştürür; tmdbId'siz/geçersiz kayıtları eler.
 * @param {object} item
 * @param {'gecmis'|'favori'|'liste'} kaynak
 * @returns {object|null}
 */
function adayOlustur(item, kaynak) {
  const ham = item && item.id;
  if (ham === null || ham === undefined || ham === '') return null;
  const sayi = Number(ham);
  if (!Number.isFinite(sayi)) return null; // tmdbId'siz kayıt -> atla

  const tip = tipCoz(item);
  const turler = turleriCoz(item);
  return {
    tmdbId: String(sayi),
    ad: item.title || item.name || item.original_title || item.original_name || 'İçerik',
    tip,
    turler,
    anaTur: turler[0],
    saatlar: saatleriCoz(item),
    sezon: tip === 'dizi' ? Number(item.season || 1) : undefined,
    bolum: tip === 'dizi' ? Number(item.episode || 1) : undefined,
    kaynak
  };
}

/**
 * Saat kovası çarpanı. Geçmişte izlenme saati varsa o saate yakınlığa, yoksa
 * (veri yoksa) akşam kuşağı 20-23 varsayımına dayanır.
 * @param {object} aday
 * @param {number} saatKovasi 0-23
 * @returns {number}
 */
function saatCarpaniHesapla(aday, saatKovasi) {
  const kova = Number.isFinite(saatKovasi) ? ((saatKovasi % 24) + 24) % 24 : 0;
  if (aday.saatlar && aday.saatlar.length > 0) {
    let enYakin = 24;
    for (const s of aday.saatlar) {
      const fark = Math.abs(s - kova);
      enYakin = Math.min(enYakin, fark, 24 - fark);
    }
    if (enYakin <= 1) return 1.6;
    if (enYakin <= 3) return 1.25;
    return 1.0;
  }
  // Kullanıcının izleme saati verisi yoksa akşam izleme varsayılır.
  return kova >= 20 ? 1.5 : 1.0;
}

/**
 * Ağırlıklı seçim: deterministik PRNG ile ağırlık oranında tek aday döner.
 * @param {object[]} adaylar
 * @param {() => number} rastgele
 * @returns {object}
 */
function agirlikliSec(adaylar, rastgele) {
  let toplam = 0;
  for (const a of adaylar) toplam += a.agirlik;
  if (!(toplam > 0)) return adaylar[Math.floor(rastgele() * adaylar.length)] || adaylar[adaylar.length - 1];
  let r = rastgele() * toplam;
  for (const a of adaylar) {
    r -= a.agirlik;
    if (r <= 0) return a;
  }
  return adaylar[adaylar.length - 1];
}

/**
 * Slot için kısa gerekçe metni üretir ("neden bu").
 * @param {object} aday
 * @param {Record<string, number>} turSayimi
 * @param {number} saatKovasi
 * @returns {string}
 */
function nedenYaz(aday, turSayimi, saatKovasi) {
  const parcalar = [];
  const kova = Number.isFinite(saatKovasi) ? ((saatKovasi % 24) + 24) % 24 : 0;

  if (aday.kaynak === 'favori') parcalar.push('Favorilerinden');

  const enCok = aday.turler.reduce(
    (best, tr) => ((turSayimi[tr] || 0) > (turSayimi[best] || 0) ? tr : best),
    aday.turler[0]
  );
  if ((turSayimi[enCok] || 0) > 0) parcalar.push(`Sık izlediğin tür: ${enCok}`);

  if (aday.saatlar && aday.saatlar.length > 0) {
    let enYakin = 24;
    for (const s of aday.saatlar) {
      const fark = Math.abs(s - kova);
      enYakin = Math.min(enYakin, fark, 24 - fark);
    }
    if (enYakin <= 3) parcalar.push('Bu saatlerde izliyorsun');
  } else if (kova >= 20) {
    parcalar.push('Akşam kuşağı seçkisi');
  }

  if (parcalar.length === 0) parcalar.push('Kanal akışına uygun');
  return parcalar.join(' • ');
}

/**
 * Boş program: boş dizi döner; neden'i dizi üstünde numaralanmayan bir alanda
 * taşır. Böylece deepStrictEqual(sonuc, []) korunurken sonuc.neden === 'havuz-bos'
 * okunabilir.
 * @returns {Array}
 */
function bosProgram() {
  const arr = [];
  Object.defineProperty(arr, 'neden', { value: 'havuz-bos', enumerable: false });
  return arr;
}

/**
 * Kişisel TV kanalı programını üretir. Tamamen saf/deterministtir: aynı girdi
 * ve aynı tohum birebir aynı programı verir.
 *
 * Ağırlık modeli: tür-eğilimi (geçmiş tür sayımı) × favori 2x × saat kovası
 * eşleşmesi × (izleme listesi hafif artış). Çeşitlilik: ardışık iki slot aynı
 * tür olmaz (havuz izin verdiğince); aynı tmdbId bir günde yalnız bir kez çıkar.
 *
 * @param {object} girdi
 * @param {object[]} [girdi.gecmis=[]]  izleme geçmişi (tür sayımının kaynağı)
 * @param {object[]} [girdi.favoriler=[]]
 * @param {object[]} [girdi.watchlist=[]]
 * @param {number} [girdi.saatKovasi=0] 0-23 arası program saati
 * @param {number} [girdi.tohum=1] seed
 * @param {number} [girdi.uzunlukDk=90] slot süresi (dakika)
 * @param {number} [girdi.maxSlot=8] en fazla slot
 * @returns {Array<{slotNo:number,baslangucDk:number,tmdbId:string,tur:string,tip:'dizi'|'film',ad:string,sezon?:number,bolum?:number,neden:string}>}
 */
export function kanalProgramla({
  gecmis = [],
  favoriler = [],
  watchlist = [],
  saatKovasi = 0,
  tohum = 1,
  uzunlukDk = 90,
  maxSlot = 8
} = {}) {
  const g = Array.isArray(gecmis) ? gecmis : [];
  const f = Array.isArray(favoriler) ? favoriler : [];
  const w = Array.isArray(watchlist) ? watchlist : [];

  // 1) Tür eğilimi yalnızca izlenen geçmişten sayılır (tercih sinyali).
  const turSayimi = Object.create(null);
  for (const it of g) {
    if (!it || it.id == null) continue;
    for (const tr of turleriCoz(it)) turSayimi[tr] = (turSayimi[tr] || 0) + 1;
  }

  const favoriIdler = new Set();
  for (const it of f) if (it && it.id != null) favoriIdler.add(String(it.id));
  const listeIdler = new Set();
  for (const it of w) if (it && it.id != null) listeIdler.add(String(it.id));

  // 2) Aday havuzu: geçmiş + favoriler + izleme listesi, tmdbId bazında tekilleştir.
  const havuz = [];
  const gorulen = new Set();
  const ekle = (it, kaynak) => {
    const a = adayOlustur(it, kaynak);
    if (!a || gorulen.has(a.tmdbId)) return;
    gorulen.add(a.tmdbId);
    const turPuan = a.turler.reduce((s, tr) => s + (turSayimi[tr] || 0), 0);
    const favoriCarpani = favoriIdler.has(a.tmdbId) ? 2 : 1; // favori 2x
    const listeCarpani = listeIdler.has(a.tmdbId) ? 1.35 : 1; // izleme listesi hafif artış
    a.agirlik = (0.5 + turPuan) * favoriCarpani * listeCarpani * saatCarpaniHesapla(a, Number(saatKovasi));
    havuz.push(a);
  };
  for (const it of g) ekle(it, 'gecmis');
  for (const it of f) ekle(it, 'favori');
  for (const it of w) ekle(it, 'liste');

  // Hepsi boş / tmdbId'siz ise program üretilemez.
  if (havuz.length === 0) return bosProgram();

  // 3) Deterministik ağırlıklı seçim: çeşitlilik + tekrar yasağı.
  const rastgele = mulberry32(Number(tohum) || 0);
  const program = [];
  const kullanilan = new Set();
  let sonTur = null;

  for (let slotNo = 0; slotNo < maxSlot; slotNo++) {
    let adaylar = havuz.filter(a => !kullanilan.has(a.tmdbId));
    if (adaylar.length === 0) break; // havuz tükendi: kuyruk dolduğu kadar dolar

    // Çeşitlilik: bir önceki türden farklı olanları öncele.
    const farkliTur = adaylar.filter(a => a.anaTur !== sonTur);
    // Farklı tür kalmadıysa izlenen-çekirdek havuzundan yeniden örnekle (gevşet).
    adaylar = farkliTur.length > 0 ? farkliTur : adaylar;

    const secim = agirlikliSec(adaylar, rastgele);
    kullanilan.add(secim.tmdbId);
    sonTur = secim.anaTur;

    program.push({
      slotNo,
      baslangucDk: slotNo * Number(uzunlukDk),
      tmdbId: secim.tmdbId,
      tur: secim.anaTur,
      tip: secim.tip,
      ad: secim.ad,
      ...(secim.tip === 'dizi' ? { sezon: secim.sezon, bolum: secim.bolum } : {}),
      neden: nedenYaz(secim, turSayimi, Number(saatKovasi))
    });
  }

  if (program.length === 0) return bosProgram();
  return program;
}

/**
 * Zaman damgası ile programdan "şu an yayında" olan slotu ve bir sonrakini bulur.
 * Program sonunda başa sarar (wrap-around).
 * v2 (kuşak) programlarında slot süreleri değişkendir (`sureDk`); o durumda
 * her slot kendi penceresine göre değerlendirilir. `sureDk` taşımayan (v1)
 * programlarda davranış birebir eskisi gibi sabit süre varsayımıyladır.
 * @param {Array} program kanalProgramla / kanalProgramlaV2 çıktısı
 * @param {number} simdiDk günün dakikası (0-1439); daha büyük değerler mod alınır
 * @returns {{simdi: object|null, sonraki: object|null}}
 */
export function yayindakiSlot(program, simdiDk) {
  if (!Array.isArray(program) || program.length === 0) return { simdi: null, sonraki: null };

  const n = program.length;
  const değişken = program.every((s) => s && Number.isFinite(Number(s.sureDk)) && Number(s.sureDk) > 0);

  if (değişken) {
    // v2: slot süreleri değişkendir, slotlar bitişiktir (kuşak kırpması dışında
    // küçük bir boşluk bırakılabilir: kuşak değişimine kalan süre eşiğin
    // altındaysa yeni yayın başlatılmaz). Zaman çizelgesi programın ilk
    // slotundan başlar, gün sonunda başa sarar.
    const bas0 = Number(program[0].baslangucDk);
    const toplam = program.reduce((t, s) => t + Number(s.sureDk), 0);
    const t = bas0 + (((Number(simdiDk) - bas0) % toplam) + toplam) % toplam;
    let enYakin = 0;
    let enKisa = Infinity;
    for (let i = 0; i < n; i++) {
      const bas = Number(program[i].baslangucDk);
      if (t >= bas && t < bas + Number(program[i].sureDk)) {
        return { simdi: program[i], sonraki: program[(i + 1) % n] };
      }
      const d = Math.abs(bas - t);
      if (d < enKisa) { enKisa = d; enYakin = i; }
    }
    // Kuşak kırpması boşluğunda en yakın slot gösterilir.
    return { simdi: program[enYakin], sonraki: program[(enYakin + 1) % n] };
  }

  // Slot süresini bitişik başlangıçlardan çıkar; tek slot varsa 90 dk varsay.
  let sure = 90;
  if (n >= 2) {
    const fark = program[1].baslangucDk - program[0].baslangucDk;
    if (fark > 0) sure = fark;
  }
  const toplam = program[n - 1].baslangucDk + sure; // döngü uzunluğu (dk)
  const t = ((Number(simdiDk) % toplam) + toplam) % toplam;

  let idx = 0;
  for (let i = 0; i < n; i++) {
    const bas = program[i].baslangucDk;
    const bit = i === n - 1 ? toplam : program[i + 1].baslangucDk;
    if (t >= bas && t < bit) {
      idx = i;
      break;
    }
  }

  return { simdi: program[idx], sonraki: program[(idx + 1) % n] };
}

/**
 * kanalProgramla'nın ağ/çekirdek-havuz sarmalayıcısı. Geçmiş + izleme listesi
 * temel havuzu minHavuz'un altındaysa, enjekte edilen `fallbackHavuzu` (async)
 * çağrılarak tür-ağırlıklı adaylar eklenir. Böylece ağ erişimi scheduler'ın
 * dışında, enjekte edilebilir bir fonksiyon üzerinden kalır (testlerde mock,
 * gerçek istek yok).
 * @param {object} girdi kanalProgramla girdisi + fallback
 * @param {number} [girdi.minHavuz=12] fallback tetikleme eşiği
 * @param {(ctx:{saatKovasi:number,mevcutIdler:Set<string>}) => Promise<object[]>} [girdi.fallbackHavuzu]
 * @returns {Promise<Array>} kanalProgramla çıktısı
 */
export async function kanalProgramlaAsync({
  gecmis = [],
  favoriler = [],
  watchlist = [],
  saatKovasi = 0,
  tohum = 1,
  uzunlukDk = 90,
  maxSlot = 8,
  minHavuz = 12,
  fallbackHavuzu = null
} = {}) {
  const g = Array.isArray(gecmis) ? gecmis : [];
  const w = Array.isArray(watchlist) ? watchlist : [];
  const f = Array.isArray(favoriler) ? favoriler : [];

  let cekirdek = [...g, ...w];
  const mevcutIdler = new Set();
  for (const it of [...g, ...f, ...w]) {
    if (it && it.id != null && Number.isFinite(Number(it.id))) mevcutIdler.add(String(it.id));
  }

  if (typeof fallbackHavuzu === 'function' && mevcutIdler.size < minHavuz) {
    try {
      const ek = await fallbackHavuzu({ saatKovasi: Number(saatKovasi), mevcutIdler });
      if (Array.isArray(ek)) cekirdek = cekirdek.concat(ek);
    } catch (_) {
      /* Ağ hatası: çekirdek havuzla devam, program yine üretilir. */
    }
  }

  return kanalProgramla({ gecmis: cekirdek, favoriler: f, watchlist: w, saatKovasi, tohum, uzunlukDk, maxSlot });
}

/* ==========================================================================
   KANALIM v2 — KUŞAK MOTORU / BİNGE / PRESET / RUH HALİ / EPG YARDIMCILARI
   --------------------------------------------------------------------------
   v1'in saf programlayıcısı YANINDA yaşayan yeni katman. Sözleşme korunur:
   v1 export'ları (kanalProgramla / kanalProgramlaAsync / yayindakiSlot /
   mulberry32) aynen çalışır; v2 yalnızca YENİ export'larla gelir.

   SAFLIK: bu blok da Date.now / new Date / fetch / localStorage OKUMAZ.
   "Şu an kaç" bilgisi `simdiDk` parametresiyle dışarıdan enjekte edilir.
   ========================================================================== */

/** Bir gün 1440 dakika. */
export const GUN_DK = 1440;

/**
 * Günün 4 yayın kuşağı. `turCarpanlari` o kuşağın tür eğilimidir; eşleşmeyen
 * türler `varsayilan` çarpanını alır. Object.freeze: dışarıdan bozulamaz.
 * @type {ReadonlyArray<Readonly<{ad:string,etiket:string,saat:string,baslangicDk:number,bitisDk:number,ikon:string,turCarpanlari:Record<string,number>,varsayilan:number}>>}
 */
export const KUSAKLAR = Object.freeze([
  Object.freeze({
    ad: 'sabah', etiket: 'Sabah', saat: '06:00-12:00', baslangicDk: 360, bitisDk: 720, ikon: 'sunrise',
    turCarpanlari: Object.freeze({
      'Animasyon': 2.2, 'Çocuk': 2.5, 'Aile': 1.6, 'Komedi': 1.35, 'Fantastik': 1.2, 'Aksiyon & Macera': 0.9
    }),
    varsayilan: 1
  }),
  Object.freeze({
    ad: 'ogleden', etiket: 'Öğleden Sonra', saat: '12:00-17:00', baslangicDk: 720, bitisDk: 1020, ikon: 'sun',
    turCarpanlari: Object.freeze({
      'Komedi': 1.45, 'Dram': 1.3, 'Aile': 1.25, 'Romantik': 1.2, 'Suç': 1.15, 'Aksiyon & Macera': 1.1
    }),
    varsayilan: 1
  }),
  Object.freeze({
    ad: 'prime', etiket: 'Prime Time', saat: '17:00-24:00', baslangicDk: 1020, bitisDk: 1440, ikon: 'flame',
    turCarpanlari: Object.freeze({
      'Dram': 1.9, 'Aksiyon': 1.7, 'Gerilim': 1.6, 'Korku': 1.45, 'Suç': 1.4, 'Bilim Kurgu': 1.35,
      'Gizem': 1.3, 'Macera': 1.25, 'Aksiyon & Macera': 1.4, 'Savaş': 1.2
    }),
    varsayilan: 0.85
  }),
  Object.freeze({
    ad: 'gece', etiket: 'Gece', saat: '00:00-06:00', baslangicDk: 0, bitisDk: 360, ikon: 'moon',
    turCarpanlari: Object.freeze({
      'Belgesel': 1.9, 'Tarih': 1.7, 'Savaş': 1.5, 'Savaş & Politika': 1.6, 'Western': 1.45,
      'Suç': 1.3, 'Doğa': 1.5, 'Bilim Kurgu': 1.2
    }),
    varsayilan: 1
  })
]);

/** Preset tür filtrelerinde kullanılan, TUR_ADLARI'nda olmayan TMDB kimlikleri. */
const PRESET_TUR_ADLARI = Object.freeze({
  25: 'Tarih',      // TMDB "History" (movie eski haritası)
  990: 'Doğa'       // TMDB "Nature"
});

const KUSAK_INDEKS = new Map(KUSAKLAR.map((k) => [k.ad, k]));

/** Dakikayı güvenli biçimde 0-1439 aralığına indirger (bozuk girdi → 0). */
function gunDk(ham) {
  const n = Number(ham);
  if (!Number.isFinite(n)) return 0;
  return ((Math.trunc(n) % GUN_DK) + GUN_DK) % GUN_DK;
}

/**
 * Bir günün dakikasını kuşak nesnesine çevirir. Bilinmeyen/bozuk değer → 'gece'.
 * @param {number} dakika 0-1439 (dışarıdan daha büyük değerler mod alınır)
 * @returns {typeof KUSAKLAR[number]}
 */
export function kusakBul(dakika = 0) {
  const dk = gunDk(dakika);
  for (const k of KUSAKLAR) {
    if (k.baslangicDk <= dk && dk < k.bitisDk) return k;
  }
  return KUSAK_INDEKS.get('gece');
}

/**
 * Kuşak etiketini döndürür: kusakBul(...).etiket veya kusak adı/nesnesi kabul eder.
 * @param {number|string|object} kusak
 * @returns {string}
 */
export function kusakEtiket(kusak) {
  if (kusak && typeof kusak === 'object' && kusak.etiket) return String(kusak.etiket);
  if (typeof kusak === 'number') return kusakBul(kusak).etiket;
  const k = KUSAK_INDEKS.get(String(kusak || '').toLocaleLowerCase('tr-TR'));
  return k ? k.etiket : kusakBul(0).etiket;
}

/** Verilen dakikanın ait olduğu kuşağın başlangıç dakikası. */
export function kusakBaslangicDk(dakika = 0) {
  return kusakBul(dakika).baslangicDk;
}

/**
 * Bir kuşağın bitişinden sonraki ilk dakika (kuşak sınırına hizalı zaman atlaması).
 * Gün sonunda (1440) 0'a sarar.
 * @param {number|string|object} kusak kusakBul çıktısı ya da kuşak adı/dakikası
 * @returns {number}
 */
export function sonrakiKusakBaslangicDk(kusak) {
  const k = (kusak && typeof kusak === 'object' && typeof kusak.bitisDk === 'number')
    ? kusak
    : KUSAK_INDEKS.get(String(kusak || '').toLocaleLowerCase('tr-TR')) || kusakBul(typeof kusak === 'number' ? kusak : 0);
  return k.bitisDk >= GUN_DK ? 0 : k.bitisDk;
}

/** İçerik tipine göre varsayılan slot süresi (dakika). */
export const SLOT_SURELERI = Object.freeze({ film: 120, dizi: 45 });

/**
 * Slot süresi: film 120', dizi 45'. `uzunlukDk` verilirse (v1'den gelen
 * "sabit süre" override'ı) tüm tipler için o değer kullanılır.
 * @param {'dizi'|'film'|string} tip
 * @param {number|null} [uzunlukDk] v1'den gelen override
 * @returns {number} dakika
 */
export function slotSuresiDk(tip, uzunlukDk = null) {
  const ov = Number(uzunlukDk);
  if (Number.isFinite(ov) && ov > 0) return Math.round(ov);
  return tip === 'dizi' ? SLOT_SURELERI.dizi : SLOT_SURELERI.film;
}

/**
 * Kuşağın tür çarpanı: verilen türlerin EN YÜKSEK kuşak çarpanı.
 * Kuşak yoksa 1 (nötr). Bu, kuşak "ağırlık yönü"nü test edilebilir kılar.
 * @param {string|object} kusak kuşak adı ya da kusakBul çıktısı
 * @param {string[]|string} turler
 * @returns {number}
 */
export function kusakTurCarpani(kusak, turler) {
  const k = (kusak && typeof kusak === 'object' && kusak.turCarpanlari)
    ? kusak
    : KUSAK_INDEKS.get(String(kusak || '').toLocaleLowerCase('tr-TR')) || null;
  if (!k) return 1;
  const liste = Array.isArray(turler) ? turler : (turler ? [turler] : []);
  let en = Number(k.varsayilan) > 0 ? Number(k.varsayilan) : 1;
  for (const t of liste) {
    const w = k.turCarpanlari[String(t == null ? '' : t).trim()];
    if (typeof w === 'number' && Number.isFinite(w) && w > en) en = w;
  }
  return en;
}

/**
 * "Kaldığı yer" matematiği: bir dizi kaydının sonraki bölümü.
 *  - bölüm+1 (normal)
 *  - sezon finali biliniyorsa → sezon+1 / bölüm 1
 *  - sezon VE dizi sınırları birlikte dolduysa → üst sınır yok, dürüstçe
 *    mevcut bölümde kalır (uydurma sezon üretmez).
 * season/episode yoksa null döner (slot'a `sonrakiBolum` yazılmaz).
 * @param {{sezon?:number,bolum?:number,sezonBolumSayisi?:number,sezonSayisi?:number}} girdi
 * @returns {{sezon:number,bolum:number}|null}
 */
export function sonrakiBolumHesapla({ sezon, bolum, sezonBolumSayisi, sezonSayisi } = {}) {
  const s = Math.trunc(Number(sezon));
  const b = Math.trunc(Number(bolum));
  if (!Number.isFinite(s) || !Number.isFinite(b) || s < 1 || b < 1) return null;

  const bolumSayisi = Math.trunc(Number(sezonBolumSayisi));
  const sezonAdet = Math.trunc(Number(sezonSayisi));
  const sezonBitti = Number.isFinite(bolumSayisi) && bolumSayisi > 0 && b >= bolumSayisi;

  if (sezonBitti) {
    const sonSezon = Number.isFinite(sezonAdet) && sezonAdet > 0 && s >= sezonAdet;
    if (sonSezon) return { sezon: s, bolum: b };
    return { sezon: s + 1, bolum: 1 };
  }
  return { sezon: s, bolum: b + 1 };
}

/** Preset'lerin tür filtresinde kullanılan TMDB kimliklerinin Türkçe adları. */
export function presetTurAdlari(turIdler = []) {
  const liste = Array.isArray(turIdler) ? turIdler : [];
  const out = [];
  for (const id of liste) {
    const ad = PRESET_TUR_ADLARI[Number(id)] || TUR_ADLARI[Number(id)];
    if (ad && !out.includes(ad)) out.push(ad);
  }
  return out;
}

/**
 * Çoklu kanal preset'leri. `turIdler` null ise filtre uygulanmaz (kendi kanalı =
 * v1 davranışı). Her preset'in kendi varsayılan tohumu vardır (izole seed).
 */
export const KANAL_PRESETLERI = Object.freeze([
  Object.freeze({
    slug: 'kendi', ad: 'Kendi Kanalım', kisaAd: 'Kanalım', ikon: 'tv', turIdler: null,
    turAgirlik: Object.freeze({}), varsayilanTohum: 104729,
    aciklama: 'Geçmişinden, favorilerinden ve izleme saatinden karışım'
  }),
  Object.freeze({
    slug: 'cizgi', ad: 'Çizgi Kanalı', kisaAd: 'Çizgi', ikon: 'sparkles', turIdler: Object.freeze([16, 10762, 10751]),
    turAgirlik: Object.freeze({ 'Animasyon': 2.2, 'Çocuk': 2.6, 'Aile': 1.5 }),
    varsayilanTohum: 208733, aciklama: 'Animasyon, çizgi ve aile içerikleri'
  }),
  Object.freeze({
    slug: 'belgesel', ad: 'Belgesel Kanalı', kisaAd: 'Belgesel', ikon: 'telescope', turIdler: Object.freeze([99, 36, 10768, 25, 990]),
    turAgirlik: Object.freeze({ 'Belgesel': 2.6, 'Doğa': 1.8, 'Tarih': 1.7, 'Savaş & Politika': 1.6 }),
    varsayilanTohum: 306643, aciklama: 'Belgesel, tarih ve doğa (25/990 ağırlıklı)'
  }),
  Object.freeze({
    slug: 'aksiyon', ad: 'Aksiyon Kanalı', kisaAd: 'Aksiyon', ikon: 'flame', turIdler: Object.freeze([28, 878, 53, 12, 10759]),
    turAgirlik: Object.freeze({ 'Aksiyon': 2.6, 'Bilim Kurgu': 1.7, 'Gerilim': 1.6, 'Macera': 1.4, 'Aksiyon & Macera': 1.8 }),
    varsayilanTohum: 407587, aciklama: 'Aksiyon, bilim kurgu ve gerilim (28/878/53)'
  })
]);

const PRESET_INDEKS = new Map(KANAL_PRESETLERI.map((p) => [p.slug, p]));

/** Tüm kanal slug'ları (view chip şeridi bu sırayla çizilir). */
export function kanalSluglari() {
  return KANAL_PRESETLERI.map((p) => p.slug);
}

/**
 * Slug → preset tanımı. Bilinmeyen/bozuk slug "kendi"ye düşer (atma yok).
 * @param {string} slug
 * @returns {typeof KANAL_PRESETLERI[number]}
 */
export function kanalTanima(slug) {
  const s = String(slug == null ? '' : slug).trim().toLocaleLowerCase('tr-TR');
  return PRESET_INDEKS.get(s) || PRESET_INDEKS.get('kendi');
}

/**
 * Preset'in tür çarpanı (türler arası EN YÜKSEK). Filtresiz preset → 1.
 * @param {string|object} preset slug ya da preset nesnesi
 * @param {string[]|string} turler
 * @returns {number}
 */
export function presetTurCarpani(preset, turler) {
  const p = (preset && typeof preset === 'object' && preset.turAgirlik) ? preset : kanalTanima(preset);
  if (!p || !p.turIdler) return 1;
  const liste = Array.isArray(turler) ? turler : (turler ? [turler] : []);
  let en = 1;
  for (const t of liste) {
    const w = p.turAgirlik[String(t == null ? '' : t).trim()];
    if (typeof w === 'number' && Number.isFinite(w) && w > en) en = w;
  }
  return en;
}

/**
 * Preset tür filtresi: havuzdan yalnızca preset'in kabul ettiği türleri tutar.
 * Sonuç boş kalırsa DÜRÜSTÇE filtrelenmemiş havuzu döndürür (program hep doğar).
 * @param {string|object} preset
 * @param {object[]} havuz ham kayıtlar (genre_ids / genres taşıyan)
 * @returns {object[]}
 */
export function presetHavuz(preset, havuz) {
  const p = (preset && typeof preset === 'object') ? preset : kanalTanima(preset);
  const liste = Array.isArray(havuz) ? havuz : [];
  if (!p || !Array.isArray(p.turIdler) || p.turIdler.length === 0) return liste.slice();
  const izin = new Set(p.turIdler.map(Number));
  const uyan = liste.filter((it) => {
    if (!it) return false;
    const idler = new Set();
    if (Array.isArray(it.genre_ids)) for (const g of it.genre_ids) idler.add(Number(g));
    if (Array.isArray(it.genres)) for (const g of it.genres) idler.add(Number(g && g.id));
    if (typeof it.genre === 'number') idler.add(Number(it.genre));
    for (const id of idler) if (izin.has(id)) return true;
    return false;
  });
  return uyan.length > 0 ? uyan : liste.slice();
}

/**
 * Ruh hali (mood) tanımları: geçici tür bias'ı. Kalıcı yazılmaz, program anında
 * yeniden kurulur; aynı girdi + aynı tohum → aynı program (deterministik).
 */
export const RUH_HALLERI = Object.freeze([
  Object.freeze({
    slug: 'eglence', ad: 'Eğlence', ikon: 'laugh',
    turAgirlik: Object.freeze({ 'Komedi': 2.4, 'Animasyon': 1.9, 'Aile': 1.5, 'Macera': 1.3 }),
    varsayilan: 0.85
  }),
  Object.freeze({
    slug: 'duygu', ad: 'Duygu', ikon: 'heart',
    turAgirlik: Object.freeze({ 'Dram': 2.4, 'Romantik': 2.0, 'Aile': 1.35 }),
    varsayilan: 0.85
  }),
  Object.freeze({
    slug: 'gerilim', ad: 'Gerilim', ikon: 'zap',
    turAgirlik: Object.freeze({ 'Gerilim': 2.4, 'Korku': 2.2, 'Suç': 1.8, 'Gizem': 1.6 }),
    varsayilan: 0.85
  }),
  Object.freeze({
    slug: 'klasik', ad: 'Klasik', ikon: 'landmark',
    turAgirlik: Object.freeze({ 'Belgesel': 2.2, 'Tarih': 2.2, 'Western': 2.0, 'Savaş': 1.8 }),
    varsayilan: 0.85
  })
]);

const RUH_INDEKS = new Map(RUH_HALLERI.map((m) => [m.slug, m]));

/**
 * Slug → ruh hali tanımı. null/'temizle' → null.
 * @param {string|null} slug
 * @returns {typeof RUH_HALLERI[number]|null}
 */
export function ruhHaliTanimi(slug) {
  if (slug == null) return null;
  const s = String(slug).trim().toLocaleLowerCase('tr-TR');
  if (!s || s === 'temizle' || s === 'none' || s === 'null') return null;
  return RUH_INDEKS.get(s) || null;
}

/**
 * Ruh halinin tür çarpanı (türler arası EN YÜKSEK). Ruh hali yoksa 1 (nötr).
 * @param {string|object|null} slug
 * @param {string[]|string} turler
 * @returns {number}
 */
export function ruhHaliCarpani(slug, turler) {
  const m = (slug && typeof slug === 'object' && slug.turAgirlik) ? slug : ruhHaliTanimi(slug);
  if (!m) return 1;
  const liste = Array.isArray(turler) ? turler : (turler ? [turler] : []);
  let en = Number(m.varsayilan) > 0 ? Number(m.varsayilan) : 1;
  for (const t of liste) {
    const w = m.turAgirlik[String(t == null ? '' : t).trim()];
    if (typeof w === 'number' && Number.isFinite(w) && w > en) en = w;
  }
  return en;
}

/** Kaydın sezon/bölüm üst sınırlarını okur (sezon finali tespiti için). */
function bolumUstSinirlari(item) {
  const out = {};
  if (!item || typeof item !== 'object') return out;
  // Sezon sayısı YALNIZCA açık alandan okunur: "seasons dizisinin uzunluğu"
  // güvenilir bir üst sınır değildir (kayıt kısmi sezon listesi taşıyabilir).
  const sezonAdet = Math.trunc(Number(item.number_of_seasons));
  if (Number.isFinite(sezonAdet) && sezonAdet > 0) out.sezonSayisi = sezonAdet;
  // Sezon bölüm sayısı: ilgili sezonun episode_count'u ya da toplam bölüm sayısı.
  if (Array.isArray(item.seasons) && item.seasons.length > 0) {
    const s = Math.trunc(Number(item.season || 1));
    const kayit = item.seasons[s - 1];
    const adet = Math.trunc(Number(kayit && (kayit.episode_count ?? kayit.episodeCount ?? kayit.bolumSayisi)));
    if (Number.isFinite(adet) && adet > 0) out.sezonBolumSayisi = adet;
  }
  const toplamBolum = Math.trunc(Number(item.episodesCount ?? item.number_of_episodes ?? item.total_episodes ?? item.totalEpisodes));
  if (Number.isFinite(toplamBolum) && toplamBolum > 0) out.sezonBolumSayisi = out.sezonBolumSayisi || toplamBolum;
  return out;
}

/** Slot'un tür listesini güvenli biçimde döndürür (v1 slotlarında yalnız `tur` var). */
function slotTurleri(slot) {
  if (!slot) return ['Genel'];
  if (Array.isArray(slot.turler) && slot.turler.length > 0) return slot.turler;
  return slot.tur ? [slot.tur] : ['Genel'];
}

/** Slot bitiş dakikası (sureDk yoksa komşu başlangıçtan türetilir). */
function slotBitis(slot, program, idx) {
  const s = Number(slot && slot.sureDk);
  if (Number.isFinite(s) && s > 0) return Number(slot.baslangucDk) + s;
  if (Array.isArray(program) && program[idx + 1]) return Number(program[idx + 1].baslangucDk);
  return Number(slot.baslangucDk) + slotSuresiDk(slot && slot.tip);
}

/** Dakikayı "HH:MM" biçimine çevirir (saf; ekranda da kullanılır). */
export function dkMetni(dakika) {
  const dk = gunDk(dakika);
  const h = Math.floor(dk / 60);
  const m = dk % 60;
  return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
}

/** "S3B5" gibi kısa sezon/bölüm etiketi (veri yoksa boş dize). */
export function sezonBolumMetni(slot) {
  if (!slot || slot.tip !== 'dizi') return '';
  const s = Math.trunc(Number(slot.sezon));
  const b = Math.trunc(Number(slot.bolum));
  if (!Number.isFinite(s) || !Number.isFinite(b) || s < 1 || b < 1) return '';
  return `S${s}B${b}`;
}

/** v2 gerekçe metni: v1'in "neden bu" satırına kuşak/preset/ruh hali ekler. */
function v2Neden(aday, { turSayimi, saatKovasi, kusak, preset, ruhHali }) {
  const parcalar = nedenYaz(aday, turSayimi, saatKovasi).split(' • ');
  if (preset && preset.slug !== 'kendi') parcalar.push(`${preset.ad}`);
  if (ruhHali) parcalar.push(`${ruhHali.ad} modu`);
  if (kusak) parcalar.push(`${kusak.etiket} kuşağı`);
  return parcalar.join(' • ');
}

/**
 * KANALIM v2 — kuşak hizalı gerçek EPG programı. Saf ve deterministik.
 *
 * Kurallar:
 *  1) Zaman çizelgesi KUŞAK SINIRLARINA hizalıdır: başlangıç, "şimdi"nin ait
 *     olduğu kuşağın başıdır; slotlar asla kuşak sınırını geçmez (kalan süre
 *     çok kısaysa sonraki kuşağın başına atlanır).
 *  2) Slot süresi TİP BAZLIDIR: film 120', dizi 45' (`uzunlukDk` override).
 *  3) Ağırlık = v1'in modeli × preset tür çarpanı × kuşak tür çarpanı ×
 *     ruh hali bias'ı. Aynı girdi + aynı tohum → birebir aynı program.
 *  4) BİNGE: bir dizi art arda en fazla `bingeMaks` (3) slot alabilir;
 *     her slot `bingeNo` (1..3) ile işaretlenir ve `sonrakiBolum` ilerler.
 *     Ardışık-tür çeşitliliği kuralı binge BLOĞUNU yıkmaz (istisna `bingeIstisnasi`).
 *  5) Filmler ve binge dışı diziler günde yalnız bir kez çıkar (v1 tekilleştirme);
 *     havuz bitince akış `dongu` alanı 1'e çıkıp bir kez daha döner (kanal gün
 *     boyunca yayında kalır; akşam rehberi hep dolar).
 *
 * @param {object} girdi
 * @param {object[]} [girdi.gecmis=[]] [girdi.favoriler=[]] [girdi.watchlist=[]]
 * @param {string} [girdi.slug='kendi'] kanal preset slug'ı
 * @param {string|null} [girdi.ruhHali=null] Eğlence|Duygu|Gerilim|Klasik
 * @param {number} [girdi.simdiDk=0] günün dakikası (0-1439) — dışarıdan enjekte
 * @param {number} [girdi.tohum=1]
 * @param {number} [girdi.maxSlot=24]
 * @param {number|null} [girdi.uzunlukDk=null] v1'den gelen sabit süre override'ı
 * @param {number|null} [girdi.baslangicDk=null] verilmezse "şimdi"nin kuşağının başı
 * @param {number} [girdi.bingeMaks=3]
 * @param {number} [girdi.donguSayisi=2] havuzun kaç turda kullanılacağı
 * @returns {Array<object>} slot listesi (boş havuzda `neden='havuz-bos'`)
 */
export function kanalProgramlaV2({
  gecmis = [],
  favoriler = [],
  watchlist = [],
  slug = 'kendi',
  ruhHali = null,
  simdiDk = 0,
  tohum = 1,
  maxSlot = 24,
  uzunlukDk = null,
  baslangicDk = null,
  bingeMaks = 3,
  donguSayisi = 2
} = {}) {
  const g = Array.isArray(gecmis) ? gecmis : [];
  const f = Array.isArray(favoriler) ? favoriler : [];
  const w = Array.isArray(watchlist) ? watchlist : [];

  const preset = kanalTanima(slug);
  const mood = ruhHaliTanimi(ruhHali);
  const simdi = gunDk(simdiDk);
  const maksSlot = Math.max(0, Math.trunc(Number(maxSlot)) || 0);
  const bingeTavan = Math.max(1, Math.trunc(Number(bingeMaks)) || 3);
  const donguTavan = Math.max(1, Math.trunc(Number(donguSayisi)) || 1);

  if (maksSlot === 0) return bosProgram();

  // 1) Tür eğilimi (yalnızca izlenen geçmişten) — v1 ile aynı sinyal.
  const turSayimi = Object.create(null);
  for (const it of g) {
    if (!it || it.id == null) continue;
    for (const tr of turleriCoz(it)) turSayimi[tr] = (turSayimi[tr] || 0) + 1;
  }

  const favoriIdler = new Set();
  for (const it of f) if (it && it.id != null) favoriIdler.add(String(it.id));
  const listeIdler = new Set();
  for (const it of w) if (it && it.id != null) listeIdler.add(String(it.id));

  // 2) Havuz: preset tür filtresi → geçmiş + favoriler + izleme listesi (tekilleştirilmiş).
  //    Öncelik sırası v1 ile aynıdır: geçmiş → favori → izleme listesi.
  const etiketli = [];
  for (const it of g) if (it) etiketli.push([it, 'gecmis']);
  for (const it of f) if (it) etiketli.push([it, 'favori']);
  for (const it of w) if (it) etiketli.push([it, 'liste']);
  const presetUygun = new Set(presetHavuz(preset, etiketli.map(([it]) => it)));

  const havuz = [];
  const gorulen = new Set();
  const ekle = (it, kaynak) => {
    const a = adayOlustur(it, kaynak);
    if (!a || gorulen.has(a.tmdbId)) return;
    gorulen.add(a.tmdbId);
    const sinirlar = bolumUstSinirlari(it);
    a.sezonBolumSayisi = sinirlar.sezonBolumSayisi;
    a.sezonSayisi = sinirlar.sezonSayisi;
    a.epIzlenebilir = a.tip === 'dizi' && Number.isFinite(Number(a.sezon)) && Number.isFinite(Number(a.bolum));
    const turPuan = a.turler.reduce((s, tr) => s + (turSayimi[tr] || 0), 0);
    const favoriCarpani = favoriIdler.has(a.tmdbId) ? 2 : 1;
    const listeCarpani = listeIdler.has(a.tmdbId) ? 1.35 : 1;
    a.temelAgirlik = (0.5 + turPuan) * favoriCarpani * listeCarpani;
    a.agirlik = a.temelAgirlik;
    havuz.push(a);
  };
  for (const [it, kaynak] of etiketli) {
    if (presetUygun.has(it)) ekle(it, kaynak);
  }

  if (havuz.length === 0) return bosProgram();

  // 3) Kuşak hizalı zaman çizelgesi.
  const rastgele = mulberry32(Number(tohum) || 0);
  const baslangicGirildi = baslangicDk !== null && baslangicDk !== undefined && baslangicDk !== '';
  const baslangic = baslangicGirildi && Number.isFinite(Number(baslangicDk)) && Number(baslangicDk) >= 0
    ? Math.min(Math.trunc(Number(baslangicDk)), GUN_DK - 1)
    : kusakBaslangicDk(simdi);

  const program = [];
  const kullanilan = new Set();
  let t = baslangic;
  let sonTur = null;
  let bingeSeriId = null;
  let bingeNo = 0;
  let bingeKusak = null;
  let dongu = 0;
  // tmdbId → en son yayınlanan { sezon, bolum } ("kaldığı yer" devamı).
  const ilerleme = new Map();

  // Kuşak kırpma eşiği: override verilmişse onunla sınırlı, yoksa 20 dk.
  const esikDk = Number(uzunlukDk) > 0 ? Math.max(1, Math.min(Math.round(Number(uzunlukDk)), 20)) : 20;

  while (program.length < maksSlot && t < GUN_DK) {
    const kusak = kusakBul(t);
    const kalan = kusak.bitisDk - t;

    // Boşluk atla: kuşağa kalan süre bir slotu beslemiyorsa sıradaki kuşağa geç.
    // Son kuşak (prime) bittiğe kadar `sonraki` gün başına sarar → yayın biter.
    if (kalan < esikDk) {
      const sonraki = sonrakiKusakBaslangicDk(kusak);
      if (sonraki <= t) break;
      t = sonraki;
      continue;
    }

    const saatKovasi = Math.floor(t / 60) % 24;
    let secim = null;
    let bingeIstisnasi = false;

    // 3a) Binge: aynı dizi art arda en fazla `bingeTavan` slot. Kural:
    //     blok kuşak DEĞİŞTİRMEZ, kırpılmaz ve nominal süreyle sığar —
    //     prime'da başlayan binge gece kuşağına taşmaz.
    const bingeSigar = bingeSeriId
      && bingeNo < bingeTavan
      && bingeKusak === kusak.ad
      && t + slotSuresiDk('dizi', uzunlukDk) <= kusak.bitisDk;
    if (bingeSigar) {
      const devam = havuz.find(a => a.tmdbId === bingeSeriId && a.tip === 'dizi');
      if (devam) {
        secim = devam;
        bingeIstisnasi = true;
        // Binge bloğu "harcanmış" sayılır: 4. ardışık yayın yapılamaz.
        kullanilan.add(secim.tmdbId);
      }
    }

    // 3b) Normal seçim: çeşitlilik (ardışık tür) + kuşak/preset/mood ağırlıkları.
    if (!secim) {
      let adaylar = havuz.filter(a => !kullanilan.has(a.tmdbId));
      if (adaylar.length === 0) {
        // Havuz bitti: kanal gün boyunca yayına devam eder, akış bir kez daha
        // döner (dongu). Böylece akşam rehberi ve kuşak etiketleri hep dolar.
        if (dongu + 1 < donguSayisi && t < GUN_DK) {
          dongu += 1;
          kullanilan.clear();
          bingeSeriId = null;
          bingeNo = 0;
          bingeKusak = null;
          sonTur = null;
          continue;
        }
        break;
      }
      const farkliTur = adaylar.filter(a => a.anaTur !== sonTur);
      if (farkliTur.length > 0) adaylar = farkliTur;
      for (const a of adaylar) {
        a.agirlik = a.temelAgirlik
          * kusakTurCarpani(kusak, a.turler)
          * presetTurCarpani(preset, a.turler)
          * ruhHaliCarpani(mood, a.turler)
          * saatCarpaniHesapla(a, saatKovasi);
      }
      secim = agirlikliSec(adaylar, rastgele);
      kullanilan.add(secim.tmdbId);
    }

    // 4) Slot süresi: tip bazlı (film 120' / dizi 45'), kuşak sınırına kırpılır.
    const temelSure = slotSuresiDk(secim.tip, uzunlukDk);
    let sureDk = temelSure;
    let kisitli = false;
    if (t + temelSure > kusak.bitisDk) {
      sureDk = kalan; // kalan < temelSure: kuşak sınırına kırp
      kisitli = true;
    }

    // 5) Binge sayacı: aynı dizi art arda `bingeTavan` (3) slottan fazlasını alamaz.
    const ayniSeri = secim.tmdbId === bingeSeriId && secim.tip === 'dizi';
    if (ayniSeri && bingeNo < bingeTavan) {
      bingeNo += 1;
    } else {
      bingeSeriId = secim.tip === 'dizi' ? secim.tmdbId : null;
      bingeNo = secim.tip === 'dizi' ? 1 : 0;
      bingeKusak = secim.tip === 'dizi' ? kusak.ad : null;
    }

    // 6) "Kaldığı yer": kaydın sezon/bölümünden YAYINLANAN bölüm hesaplanır.
    //    `ilerleme` haritası, aynı serinin en son yayınlanan bölümünü tutar —
    //    binge bloğunda VE akış döndüğünde bölüm kaldığı yerden devam eder.
    let sezonYayin = secim.sezon;
    let bolumYayin = secim.bolum;
    let sonrakiBolum = null;
    if (secim.epIzlenebilir) {
      const taban = ilerleme.get(secim.tmdbId) || { sezon: secim.sezon, bolum: secim.bolum };
      const n = sonrakiBolumHesapla({
        sezon: taban.sezon,
        bolum: taban.bolum,
        sezonBolumSayisi: secim.sezonBolumSayisi,
        sezonSayisi: secim.sezonSayisi
      });
      if (n) {
        sezonYayin = n.sezon;
        bolumYayin = n.bolum;
      }
      sonrakiBolum = sonrakiBolumHesapla({
        sezon: sezonYayin,
        bolum: bolumYayin,
        sezonBolumSayisi: secim.sezonBolumSayisi,
        sezonSayisi: secim.sezonSayisi
      });
      ilerleme.set(secim.tmdbId, { sezon: sezonYayin, bolum: bolumYayin });
    }

    const slot = {
      slotNo: program.length,
      baslangucDk: t,
      sureDk,
      bitisDk: t + sureDk,
      dongu,
      kusak: kusak.ad,
      kusakEtiket: kusak.etiket,
      tmdbId: secim.tmdbId,
      ad: secim.ad,
      tip: secim.tip,
      tur: secim.anaTur,
      turler: secim.turler.slice(),
      ...(secim.tip === 'dizi' ? { sezon: sezonYayin, bolum: bolumYayin } : {}),
      ...(sonrakiBolum ? { sonrakiBolum: { sezon: sonrakiBolum.sezon, bolum: sonrakiBolum.bolum } } : {}),
      ...(secim.tip === 'dizi' ? { bingeNo } : {}),
      ...(bingeIstisnasi ? { bingeIstisnasi: true } : {}),
      ...(kisitli ? { kisitli: true } : {}),
      neden: v2Neden(secim, { turSayimi, saatKovasi, kusak, preset, ruhHali: mood })
    };

    program.push(slot);
    if (t + sureDk >= GUN_DK) break;
    t += sureDk;
    sonTur = secim.anaTur;
  }

  if (program.length === 0) return bosProgram();
  return program;
}

/**
 * kanalProgramlaV2'nin ağ/kekik-havuz sarmalayıcısı. Ağ YALNIZCA enjekte edilen
 * `fallbackHavuzu` üzerinden geçer (v1 `kanalProgramlaAsync` sözleşmesiyle
 * birebir aynı): çekirdek havuz minHavuz'un altındaysa fallback çağrılır, hata
 * olursa çekirdek havuzla devam edilir.
 * @param {object} girdi kanalProgramlaV2 girdisi + fallback
 * @param {number} [girdi.minHavuz=12]
 * @param {(ctx:{saatKovasi:number,mevcutIdler:Set<string>,slug:string,preset:object}) => Promise<object[]>} [girdi.fallbackHavuzu]
 * @returns {Promise<Array>}
 */
export async function kanalProgramlaV2Async({
  gecmis = [],
  favoriler = [],
  watchlist = [],
  slug = 'kendi',
  ruhHali = null,
  simdiDk = 0,
  tohum = 1,
  maxSlot = 24,
  uzunlukDk = null,
  baslangicDk = null,
  bingeMaks = 3,
  donguSayisi = 2,
  minHavuz = 12,
  fallbackHavuzu = null
} = {}) {
  const g = Array.isArray(gecmis) ? gecmis : [];
  const f = Array.isArray(favoriler) ? favoriler : [];
  const w = Array.isArray(watchlist) ? watchlist : [];
  const preset = kanalTanima(slug);

  let cekirdek = [...g, ...w];
  const mevcutIdler = new Set();
  for (const it of [...g, ...f, ...w]) {
    if (it && it.id != null && Number.isFinite(Number(it.id))) mevcutIdler.add(String(it.id));
  }

  if (typeof fallbackHavuzu === 'function' && mevcutIdler.size < minHavuz) {
    try {
      const ek = await fallbackHavuzu({ saatKovasi: Math.floor(gunDk(simdiDk) / 60), mevcutIdler, slug: preset.slug, preset });
      if (Array.isArray(ek)) cekirdek = cekirdek.concat(ek);
    } catch (_) {
      /* Ağ hatası: çekirdek havuzla devam, program yine üretilir. */
    }
  }

  return kanalProgramlaV2({
    gecmis: cekirdek, favoriler: f, watchlist: w, slug, ruhHali, simdiDk, tohum, maxSlot, uzunlukDk, baslangicDk, bingeMaks, donguSayisi
  });
}

/**
 * "Kaçırdıkların": bitmiş slotların son `pencereDk` dakikalık dilimi, en yeni önce.
 * Program yoksa / pencere yoksa boş dizi döner (atma yok).
 * @param {Array} program
 * @param {number} simdiDk
 * @param {{pencereDk?:number,enFazla?:number}} [secenek]
 * @returns {Array<object>}
 */
export function kacirdiklarim(program, simdiDk, { pencereDk = 240, enFazla = 8 } = {}) {
  if (!Array.isArray(program) || program.length === 0) return [];
  const pencere = Math.max(0, Math.trunc(Number(pencereDk)) || 0);
  const adet = Math.max(0, Math.trunc(Number(enFazla)) || 0);
  if (pencere === 0 || adet === 0) return [];
  const simdi = gunDk(simdiDk);
  const secilen = [];
  for (let i = 0; i < program.length; i++) {
    const s = program[i];
    if (!s || !Number.isFinite(Number(s.baslangucDk))) continue;
    const bitis = slotBitis(s, program, i);
    if (bitis <= simdi && bitis >= simdi - pencere) secilen.push(s);
  }
  secilen.sort((a, b) => Number(b.baslangucDk) - Number(a.baslangucDk));
  return secilen.slice(0, adet);
}

/**
 * Hatırlatma adayları: başlangıcı (simdi, simdi+pencere] aralığında olan slotlar.
 * View bu listeyi bildirim izni + kullanıcı toggle'ı varsa kullanır.
 * @param {Array} program
 * @param {number} simdiDk
 * @param {{pencereDk?:number}} [secenek]
 * @returns {Array<object>}
 */
export function hatirlatmaAdaylari(program, simdiDk, { pencereDk = 10 } = {}) {
  if (!Array.isArray(program) || program.length === 0) return [];
  const pencere = Math.max(0, Math.trunc(Number(pencereDk)) || 0);
  if (pencere === 0) return [];
  const simdi = gunDk(simdiDk);
  return program.filter((s) => {
    if (!s) return false;
    const bas = Number(s.baslangucDk);
    if (!Number.isFinite(bas)) return false;
    return bas > simdi && bas - simdi <= pencere;
  });
}

/**
 * "Bu akşamki rehberi kopyala" için düz metin. Saf (tarih/saat dışarıdan gelir),
 * clipboard/UI YOK. Program ya da akşam dilimi boşsa boş dize döner.
 * @param {Array} program
 * @param {number} tarihDk günün dakikası (başlıkta gösterilir)
 * @param {{baslangicDk?:number,bitisDk?:number,kanalAd?:string}} [secenek]
 * @returns {string}
 */
export function kanalRehberiMetni(program, tarihDk = 0, { baslangicDk = 1020, bitisDk = GUN_DK, kanalAd = 'Kanalım' } = {}) {
  if (!Array.isArray(program) || program.length === 0) return '';
  const bas = gunDk(baslangicDk);
  const bit = gunDk(bitisDk) || GUN_DK;
  const secilen = program
    .filter((s) => s && Number.isFinite(Number(s.baslangucDk)))
    .filter((s) => { const b = Number(s.baslangucDk); return b >= bas && b < bit; })
    .sort((a, b) => Number(a.baslangucDk) - Number(b.baslangucDk));
  if (secilen.length === 0) return '';

  const satirlar = secilen.map((s) => {
    const tip = s.tip === 'dizi' ? 'Dizi' : 'Film';
    const bolum = sezonBolumMetni(s);
    const devam = s.sonrakiBolum && s.tip === 'dizi'
      ? ` → S${s.sonrakiBolum.sezon}B${s.sonrakiBolum.bolum}`
      : '';
    const sure = Number(s.sureDk) > 0 ? `${Math.round(Number(s.sureDk))} dk` : `${slotSuresiDk(s.tip)} dk`;
    const parcalar = [tip, String(s.tur || 'Genel')];
    if (bolum) parcalar.push(bolum + devam);
    parcalar.push(sure);
    return `${dkMetni(s.baslangucDk)} • ${String(s.ad || 'İçerik')} (${parcalar.join(' • ')})`;
  });

  const toplamDk = secilen.reduce((t, s) => t + (Number(s.sureDk) > 0 ? Math.round(Number(s.sureDk)) : slotSuresiDk(s.tip)), 0);
  return [`📺 ${String(kanalAd)} • Bu akşamın rehberi (${dkMetni(tarihDk)})`, ...satirlar, `${secilen.length} program • ${toplamDk} dk`].join('\n');
}

/** Sayımları tam sayı yüzdelerle dağıtır (toplamı tam 100 yapar, artık en büyüğe). */
function yuzdelestir(sayimlar) {
  const toplam = sayimlar.reduce((t, x) => t + x.adet, 0);
  if (toplam <= 0) return [];
  const ham = sayimlar.map((x, i) => ({ ...x, i, ham: (x.adet / toplam) * 100, yuzde: Math.floor((x.adet / toplam) * 100) }));
  let kalan = 100 - ham.reduce((t, x) => t + x.yuzde, 0);
  const sira = [...ham].sort((a, b) => ((b.ham - b.yuzde) - (a.ham - a.yuzde)) || (b.adet - a.adet));
  for (let i = 0; kalan > 0 && i < sira.length; i++, kalan--) sira[i].yuzde += 1;
  return ham.sort((a, b) => b.adet - a.adet).map(({ anahtar, adet, yuzde }) => ({ anahtar, adet, yuzde }));
}

/**
 * Kanal istatistikleri (mini): tür dağılımı %, toplam dk, binge sayısı, kuşak
 * dağılımı ve geçmişle uyum. Saf — veri yoksa sıfır/boş döner (atma yok).
 * @param {Array} program
 * @param {object[]} [gecmis=[]] kullanıcının izleme geçmişi (uyum için)
 * @returns {{
 *   slotSayisi:number, filmSayisi:number, diziSayisi:number, toplamDk:number,
 *   turDagilimi:Array<{tur:string,adet:number,yuzde:number}>,
 *   kusakDagilimi:Array<{kusak:string,adet:number,yuzde:number}>,
 *   bingeSayisi:number, bingeSlotSayisi:number, enUzunBinge:number, tekrarSlotSayisi:number,
 *   enCokTur:string|null, tuyumYuzde:number
 * }}
 */
export function kanalIstatistik(program, gecmis = []) {
  const bos = {
    slotSayisi: 0, filmSayisi: 0, diziSayisi: 0, toplamDk: 0,
    turDagilimi: [], kusakDagilimi: [], bingeSayisi: 0, bingeSlotSayisi: 0,
    enUzunBinge: 0, tekrarSlotSayisi: 0, enCokTur: null, tuyumYuzde: 0
  };
  if (!Array.isArray(program) || program.length === 0) return bos;

  const turSayim = new Map();
  const kusakSayim = new Map();
  let toplamDk = 0;
  let filmSayisi = 0;
  let diziSayisi = 0;
  let bingeSlotSayisi = 0;
  let enUzunBinge = 0;
  let tekrarSlotSayisi = 0;

  for (let i = 0; i < program.length; i++) {
    const s = program[i];
    if (!s) continue;
    const turler = slotTurleri(s);
    const tur = String(s.tur || turler[0] || 'Genel');
    turSayim.set(tur, (turSayim.get(tur) || 0) + 1);
    const kusak = String(s.kusak || kusakBul(s.baslangucDk || 0).ad);
    kusakSayim.set(kusak, (kusakSayim.get(kusak) || 0) + 1);
    toplamDk += Math.max(0, Math.round(Number(s.sureDk) > 0 ? Number(s.sureDk) : slotSuresiDk(s.tip)));
    if (s.tip === 'dizi') diziSayisi += 1; else filmSayisi += 1;
    if (Math.trunc(Number(s.dongu) || 0) > 0) tekrarSlotSayisi += 1;

    // Binge: aynı tmdbId'nin ardışık yayınları tek blok sayılır.
    const ayniOnceki = i > 0 && program[i - 1] && String(program[i - 1].tmdbId) === String(s.tmdbId);
    const no = Math.max(1, Math.trunc(Number(s.bingeNo)) || 1);
    if (ayniOnceki) {
      bingeSlotSayisi += 1;
      enUzunBinge = Math.max(enUzunBinge, no);
    } else if (no > 1) {
      enUzunBinge = Math.max(enUzunBinge, no);
    }
  }

  let bingeSayisi = 0;
  for (let i = 1; i < program.length; i++) {
    const onceki = program[i - 1];
    const simdi = program[i];
    if (!onceki || !simdi) continue;
    if (String(onceki.tmdbId) !== String(simdi.tmdbId)) continue;
    if (onceki.tip !== 'dizi') continue;
    if (i - 2 >= 0 && program[i - 2] && String(program[i - 2].tmdbId) === String(simdi.tmdbId)) continue;
    bingeSayisi += 1;
  }

  const turDagilimi = yuzdelestir([...turSayim.entries()].map(([anahtar, adet]) => ({ anahtar, adet })))
    .map((x) => ({ tur: x.anahtar, adet: x.adet, yuzde: x.yuzde }));
  const kusakDagilimi = yuzdelestir([...kusakSayim.entries()].map(([anahtar, adet]) => ({ anahtar, adet })))
    .map((x) => ({ kusak: x.anahtar, adet: x.adet, yuzde: x.yuzde }));

  // Kullanıcı geçmişiyle uyum: programın türlerinden kaçı izlenen türlerde.
  const gecmisTurleri = new Set();
  for (const it of Array.isArray(gecmis) ? gecmis : []) {
    if (!it) continue;
    for (const tr of turleriCoz(it)) gecmisTurleri.add(tr);
  }
  let uyumlu = 0;
  for (const [tur, adet] of turSayim.entries()) {
    if (gecmisTurleri.has(tur)) uyumlu += adet;
  }
  const slotSayisi = [...turSayim.values()].reduce((t, a) => t + a, 0);

  return {
    slotSayisi,
    filmSayisi,
    diziSayisi,
    toplamDk,
    turDagilimi,
    kusakDagilimi,
    bingeSayisi,
    bingeSlotSayisi,
    enUzunBinge,
    tekrarSlotSayisi,
    enCokTur: turDagilimi.length > 0 ? turDagilimi[0].tur : null,
    tuyumYuzde: slotSayisi > 0 ? Math.round((uyumlu / slotSayisi) * 100) : 0
  };
}
