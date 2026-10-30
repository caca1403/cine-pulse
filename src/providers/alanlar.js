/* ==========================================================================
   CinePulse — YAYIN ALAN ADI SABİTİ (yerel; uzak liste bağımlılığı YOK)
   --------------------------------------------------------------------------
   Çekirdekler kendi yayın alan adını çalışma anında ister; bu harita o
   isteği yerel olarak yanıtlar. Uygulama üçüncü taraf alan adı listesine
   bağlı kalmaz, liste değişse bile davranış sabittir.

   Değerler yayıncının alan adıdır; arayüze ASLA sızmaz.

   Doğrulama (2026-10-16): her satır, çekirdek dosyası başlığındaki gerçek
   satıcı takma adı (örn. batman.js ← oden.js) ile satıcının kendi
   alanlar.json haritasından birebir eşleştirilerek yazıldı.
   ========================================================================== */

export const ALANLAR = Object.freeze({
  // Birinci taraf çekirdekler (doğrulandı, canlı)
  "Star-Lord": "https://vidlink.pro",
  "Wolverine": "https://www.diziyou.one",

  // Vendor çekirdekler — çekirdek başlığındaki takma ad → satıcı alan haritası
  "Ant-Man": "https://www.dizidad.com",          // rouge
  "Aqualad": "https://vixsrc.to",                // rayleigh
  "Aquaman": "https://ddizibox.com",             // teach
  "Batgirl": "https://animezer.com",             // shamrock
  "Batman": "https://yabanci-dizi.now",          // oden
  "Beast-Boy": "https://api.wecollege.net",      // gorosei
  "Black-Adam": "https://lmscript.xyz",          // urouge
  "Black-Panther": "https://siyahfilmizle.vip",  // garp
  "Black-Widow": "https://filmmakinesi.to",      // kidd
  "Captain-America": "https://selcukflix.app",   // enel
  "Constantine": "https://arc018.stream",        // ace
  "Cyborg": "https://liderfilmizle.vip",         // garling
  "Daredevil": "https://dizipod.com",            // katakuri
  "Deadpool": "https://diziizle.wiki",           // sengoku
  "Doctor-Fate": "https://nxsha.space",          // jinbe
  "Doctor-Strange": "https://lovefilmizle.net",  // ryuma
  "Falcon": "https://dizibal.org",               // kalgara
  "Flash": "https://roketdizi.life",             // roger
  "Green-Lantern": "https://filmizlehub.live",   // kuzan
  "Harley-Quinn": "https://animecix.tv",         // fujitora
  "Hawkeye": "https://www.hdfilmcehennemi2.biz", // shiki
  "Hawkman": "https://streamdata.vaplayer.ru",   // gaban
  "Hulk": "https://www.fullhdfilmizlesene.now",  // xebec
  // dizipal aynaları sık döner (2026-10-25: 1590/2140/10 öldü; vendor'un
  // taze domains.json'ından alındı: smoker=1592, zunesha=12, sakazuki=2143).
  "Iron-Fist": "https://dizipal1592.com",        // smoker
  "Iron-Man": "https://www.hdfilmizle.best",     // joyboy
  "Joker": "https://diziroom.com",               // toki
  "Loki": "https://filmekseni.vip",              // shanks
  "Luke-Cage": "https://www.hdfilmcehennemi.nl", // kizaru
  "Moon-Knight": "https://dizipal12.com.tr",     // zunesha
  "Nightwing": "https://api.anizium.co",         // sabo
  "Poison-Ivy": "https://openani.me",            // lili
  "Punisher": "https://webdramaturkey2.com",     // mihawk
  // Scarlet-Witch çekirdeğinin takma adı (turkdizi) satıcı listesinde yok;
  // ölçümlü çalışan vegapunk alanı korunuyor.
  "Scarlet-Witch": "https://ydfvfdizipanel.ru",
  "Shazam": "https://dizisol.com",               // dragon
  "Spider-Man": "https://ha.vixolity.com",       // imu
  "Spider-Woman": "https://dizi82.life",         // noland (dizi79 taşındı)
  "Supergirl": "https://api.sonanime.com",       // beckman
  "Superman": "https://japierdolevid.com",       // clover
  "Thanos": "https://streamcorecdn.com",         // bogard
  "Thor": "https://dizilla.now",                 // crocodile
  "Winter-Soldier": "https://dizipal2143.com",   // sakazuki
  "Wonder-Woman": "https://asyawatch.com",       // doflamingo
  "Zatanna": "https://www.showbox.media",        // hiriluk

  // Birinci taraf TR-site çekirdekleri (2026-10-18 canlı ölçümlü)
  "Green-Arrow": "https://dizisol.com",
  "Robin": "https://sezonlukdizi.cc",
  "Bane": "https://jetfilmizle.now",
  "Cat-Woman": "https://dizibal.org",
  "Raven": "https://dizipal2143.com",
  "Darkseid": "https://www.hdfilmcehennemi.nl",
});

/* ── CANLI ALAN ADI (ölçülen ders: nuvioaddons) ───────────────────────────
   Nuvio eklentileri domain'i KODA GÖMMEZ; ortak bir listeden çeker:
   https://raw.githubusercontent.com/patr0nq/veriler/main/siteurl.txt
   Site adı değişince o liste güncellenir ve eklenti kendini düzeltir.
   Bizimki de aynısını yapar: sabit harita YEDEK kalır, açılışta canlı liste
   çekilirse üzerine yazılır. Böylece "domain taşındı" sorunları kendiliğinden
   kapanır (15 yanlış domain sorununun kökü buydu). */

/** Canlı listedeki site anahtarı → bizdeki kahraman kodları. */
const SITE_KODLARI = {
  hdfilmcehennemi: ['Hawkeye', 'Luke-Cage', 'Darkseid'],
  hdfilmcehennemi2: ['Hawkeye'],
  selcukflix: ['Captain-America'],
  dizipal: ['Moon-Knight', 'Winter-Soldier', 'Iron-Fist', 'Raven'],
  dizipalDiger: ['Raven'],
  jetfilm: ['Bane'],
  sezonlukdizi: ['Robin'],
  filmmakinesi: ['Black-Widow'],
  fullhdfilmizlesene: ['Hulk'],
  hdfilmizle: ['Iron-Man'],
  diziyou: ['Wolverine'],
  dizipod: ['Daredevil'],
  filmizle: ['Green-Lantern'],
  filmekseni: ['Loki'],
  animecix: ['Harley-Quinn'],
  openani: ['Poison-Ivy'],
  animezer: ['Batgirl'],
  anizium: ['Nightwing'],
  sonanime: ['Supergirl'],
  dizilla: ['Thor'],
  siyahfilmizle: ['Black-Panther'],
  lovefilmizle: ['Doctor-Strange'],
  dizibal: ['Falcon', 'Cat-Woman'],
  yabanci: ['Batman'],
  webdramaturkey: ['Punisher'],
  vixsrc: ['Aqualad'],
  ddizibox: ['Aquaman'],
  streamcore: ['Thanos'],
  lmscript: ['Black-Adam'],
  wecollege: ['Beast-Boy'],
  arc018: ['Constantine'],
  nxsha: ['Doctor-Fate'],
  dizisol: ['Shazam', 'Green-Arrow'],
  showbox: ['Zatanna'],
  japierdolevid: ['Superman'],
  vixolity: ['Spider-Man'],
  dizi79: ['Spider-Woman'],
};

const ALAN_LISTESI_URL = 'https://raw.githubusercontent.com/patr0nq/veriler/main/siteurl.txt';
// v2 (2026-10-25): v1 önbellekleri bayat patr0nq değerleriyle (ölü dizipal
// aynaları, Iron-Man'in Hulk alanına kaçması) çalışan alanları eziyordu.
const LS_ALAN = 'cp_canli_alanlar_v2';
const ALAN_OMUR_MS = 6 * 60 * 60 * 1000; // 6 saat

/* Gömülü TMDB anahtarları — Nuvio-tabanlı çekirmelerın çekirdekleri köprüden bu
   listeyi `tmdb_keys` olarak alır (bkz. alanYaniti + vekil kopruFetch).
   2026-10-25 ölçümü: çekirmelerin kendi görmüş 4 anahtarı öldü (TMDB 401) ve
   satıcının ids.json'unda da artık tmdb_keys yok → ~40 çekirdek "IMDb ID
   bulunamadı" ile anında 0 dönerdi; cihazda GoT için el kaynak 3-7'ye düştü.
   Not: bu kalıbın tek kaynağı src/services/icerik/tmdbApi.js API_KEYS (kota
   rotasyonu orada). Buraya kopyalanması import döngüsünü kırır. */
const TMDB_ANAHTARLARI = [
  '4e44d9029b1270a757cddc766a1bcb63',
  '844dba0bfd8f3a4f3799f6130ef9e335',
];

/* ── İKİNCİ ADAY KAYNAĞI: vendor konsorsiyumu haritası ────────────────────
   patr0nq listesi bayatlayabiliyor (2026-10-25 ölçümü: ölü dizipal aynaları
   hâlâ listeliyordu). Bu kaynak aynı rotasyonları çok daha hızlı yakaladı
   (dizipal2143, dizi82 tazeydi). Yalnız ADAY sağlar — köprü yoklamasıyla
   kanıtlanmadan hiçbir değer uygulanmaz, çalışan alan asla ezilmez. */
const SATICI_ALAN_LISTESI_URL = 'https://cdn.izlelan.com/domains.json';

/** kahraman kodu → satıcı takma adı (kaynağın anahtarları). */
const SATICI_TAKMA = {
  'Ant-Man': 'rouge', 'Aqualad': 'rayleigh', 'Aquaman': 'teach', 'Batgirl': 'shamrock',
  'Batman': 'oden', 'Beast-Boy': 'gorosei', 'Black-Adam': 'urouge', 'Black-Panther': 'garp',
  'Black-Widow': 'kidd', 'Captain-America': 'enel', 'Constantine': 'ace', 'Cyborg': 'garling',
  'Daredevil': 'katakuri', 'Deadpool': 'sengoku', 'Doctor-Fate': 'jinbe', 'Doctor-Strange': 'ryuma',
  'Falcon': 'kalgara', 'Flash': 'roger', 'Green-Lantern': 'kuzan', 'Harley-Quinn': 'fujitora',
  'Hawkeye': 'shiki', 'Hawkman': 'gaban', 'Hulk': 'xebec', 'Iron-Fist': 'smoker',
  'Iron-Man': 'joyboy', 'Joker': 'toki', 'Loki': 'shanks', 'Luke-Cage': 'kizaru',
  'Moon-Knight': 'zunesha', 'Nightwing': 'sabo', 'Poison-Ivy': 'lili', 'Punisher': 'mihawk',
  'Shazam': 'dragon', 'Spider-Man': 'imu', 'Spider-Woman': 'noland', 'Supergirl': 'beckman',
  'Superman': 'clover', 'Thanos': 'bogard', 'Thor': 'crocodile', 'Winter-Soldier': 'sakazuki',
  'Wonder-Woman': 'doflamingo', 'Zatanna': 'hiriluk', 'Scarlet-Witch': 'vegapunk',
  // Birinci taraf çekirdekler (vendor alan ailelerini kazırlar)
  'Green-Arrow': 'dragon', 'Cat-Woman': 'kalgara', 'Raven': 'sakazuki', 'Darkseid': 'kizaru',
};

/** Sabit harita + canlı güncelleme katmanı (çalışma anında değişebilir). */
const GUNCEL = { ...ALANLAR };

/** Kaydedilmiş canlı listeyi uygula (varsa). */
export function kayitliAlanlariUygula() {
  try {
    const ham = typeof localStorage !== 'undefined' && localStorage.getItem(LS_ALAN);
    if (!ham) return 0;
    const { t, harita } = JSON.parse(ham);
    if (!harita || Date.now() - (t || 0) > ALAN_OMUR_MS) return 0;
    let n = 0;
    for (const [kod, url] of Object.entries(harita)) {
      if (GUNCEL[kod] !== url && url) { GUNCEL[kod] = url; n++; }
    }
    return n;
  } catch (_) { return 0; }
}

/** Adres ayakta mı? Köprüden durum kodu okunabilir (503/CF ölçülür);
 *  köprü yoksa (test/çevrimdışı) ağ-seviyesi no-cors yeterli sayılır. */
async function erisilebilirMi(url, f) {
  try {
    try {
      const { apiUrl } = await import('../services/altyapi/apiOrigin.js');
      const r = await f(apiUrl('/api/proxy?url=' + encodeURIComponent(url + '/')), { signal: AbortSignal.timeout?.(6000) });
      if (r && typeof r.status === 'number') return r.status > 0 && r.status < 500;
    } catch (_) { /* köprü yok → aşağıya düş */ }
    await f(url + '/', { mode: 'no-cors', signal: AbortSignal.timeout?.(6000) });
    return true;
  } catch (_) {
    return false;
  }
}

/** Canlı listeleri ağdan çeker, doğrular ve uygular.
 *  KURAL (2026-10-25 dersi): canlı liste yalnız İYİLEŞTİRİR — mevcut çalışan
 *  alan asla ezilmez. Değer farklıysa: mevcut ölü VE aday canlıysa uygulanır.
 *  Eskiden koşulsuz eziliyordu; bayat liste (ölü dizipal aynaları) taze
 *  statik haritayı zehirliyordu.
 *  Kaynaklar: patr0nq siteurl.txt + vendor konsorsiyumu domains.json. */
export async function canliAlanlariYenile(fetchFn) {
  try {
    const f = fetchFn || (typeof fetch === 'function' ? fetch : null);
    if (!f) return 0;
    const adaylar = new Map(); // kod → Set(url)
    const ekle = (kod, url) => {
      if (!Object.prototype.hasOwnProperty.call(GUNCEL, kod) || !url || GUNCEL[kod] === url) return;
      if (!adaylar.has(kod)) adaylar.set(kod, new Set());
      adaylar.get(kod).add(url);
    };

    /* Kaynak 1: patr0nq siteurl.txt (SITE_KODLARI, KESİN eşleşme). */
    try {
      const r = await f(ALAN_LISTESI_URL, { signal: AbortSignal.timeout?.(8000) });
      if (r && r.ok) {
        const metin = await r.text();
        for (const satir of metin.split('\n')) {
          const i = satir.indexOf(':');
          if (i < 1) continue;
          const anahtar = satir.slice(0, i).trim().toLowerCase();
          let url = satir.slice(i + 1).trim().replace(/\/+$/, '');
          if (!/^https?:\/\//i.test(url)) continue;
          for (const [site, kodlar] of Object.entries(SITE_KODLARI)) {
            // KESİN eşleşme: "fullhdfilmizlesene" ⊃ "hdfilmizle" bulanık
            // eşleşmesi Iron-Man'i Hulk'un alanına kaçırıyordu (2026-10-25).
            if (anahtar !== site) continue;
            for (const kod of kodlar) ekle(kod, url);
          }
        }
      }
    } catch (_) { /* kaynak erişilemez → diğerine devam */ }

    /* Kaynak 2: vendor konsorsiyumu domains.json (SATICI_TAKMA eşlemesi).
       Kaynağın kendi "disabled" listesindeki takma adlar aday VERMEZ. */
    try {
      const r = await f(SATICI_ALAN_LISTESI_URL, { signal: AbortSignal.timeout?.(8000) });
      if (r && r.ok) {
        const j = await r.json();
        const veri = (j && (j.data || j)) || {};
        const dom = veri.domains || {};
        const kapaliTakma = new Set(Object.keys(veri.disabled || {}));
        for (const [kod, takma] of Object.entries(SATICI_TAKMA)) {
          if (kapaliTakma.has(takma)) continue;
          ekle(kod, String(dom[takma] || '').replace(/\/+$/, ''));
        }
      }
    } catch (_) { /* kaynak erişilemez → diğerine devam */ }

    let n = 0;
    for (const [kod, urlKumesi] of adaylar) {
      const mevcut = GUNCEL[kod];
      if (mevcut && await erisilebilirMi(mevcut, f)) continue; // çalışan alan ezilmez
      for (const url of urlKumesi) {
        if (!(await erisilebilirMi(url, f))) continue;          // ölü aday uygulanmaz
        GUNCEL[kod] = url;
        n++;
        break;
      }
    }
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LS_ALAN, JSON.stringify({ t: Date.now(), harita: GUNCEL }));
      }
    } catch (_) {}
    return n;
  } catch (_) { return 0; }
}

/** Çekirdeğin beklediği yanıt biçimi (canlı katman dahil). */
export function alanYaniti() {
  return {
    domains: Object.fromEntries(Object.entries(GUNCEL).filter(([, v]) => v)),
    cookies: {},
    tmdb_keys: [...TMDB_ANAHTARLARI],
  };
}

/** Bu adres bir alan listesi isteği mi? (köprü yakalayıcı) */
export function alanListesiIstegiMi(url) {
  return /\/domains(\.json)?(\?|$)/.test(String(url));
}

// Modül yüklenirken önbellekteki canlı liste uygulanır (ağ isteği YOK —
// testler ve çevrimdışı başlangıç etkilenmez). Ağdan tazeleme ayrı çağrılır.
try { kayitliAlanlariUygula(); } catch (_) {}
