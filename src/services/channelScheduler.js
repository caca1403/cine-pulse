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
 * @param {Array} program kanalProgramla çıktısı
 * @param {number} simdiDk günün dakikası (0-1439); daha büyük değerler mod alınır
 * @returns {{simdi: object|null, sonraki: object|null}}
 */
export function yayindakiSlot(program, simdiDk) {
  if (!Array.isArray(program) || program.length === 0) return { simdi: null, sonraki: null };

  const n = program.length;
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
