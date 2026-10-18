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
  "Iron-Fist": "https://dizipal1590.com",        // smoker
  "Iron-Man": "https://www.hdfilmizle.best",     // joyboy
  "Joker": "https://diziroom.com",               // toki
  "Loki": "https://filmekseni.vip",              // shanks
  "Luke-Cage": "https://www.hdfilmcehennemi.nl", // kizaru
  "Moon-Knight": "https://dizipal10.com.tr",     // zunesha
  "Nightwing": "https://api.anizium.co",         // sabo
  "Poison-Ivy": "https://openani.me",            // lili
  "Punisher": "https://webdramaturkey2.com",     // mihawk
  // Scarlet-Witch çekirdeğinin takma adı (turkdizi) satıcı listesinde yok;
  // ölçümlü çalışan vegapunk alanı korunuyor.
  "Scarlet-Witch": "https://ydfvfdizipanel.ru",
  "Shazam": "https://dizisol.com",               // dragon
  "Spider-Man": "https://ha.vixolity.com",       // imu
  "Spider-Woman": "https://dizi79.life",         // noland
  "Supergirl": "https://api.sonanime.com",       // beckman
  "Superman": "https://japierdolevid.com",       // clover
  "Thanos": "https://streamcorecdn.com",         // bogard
  "Thor": "https://dizilla.now",                 // crocodile
  "Winter-Soldier": "https://dizipal2140.com",   // sakazuki
  "Wonder-Woman": "https://asyawatch.com",       // doflamingo
  "Zatanna": "https://www.showbox.media",        // hiriluk

  // Birinci taraf TR-site çekirdekleri (2026-10-18 canlı ölçümlü)
  "Green-Arrow": "https://dizisol.com",
  "Robin": "https://sezonlukdizi.cc",
  "Bane": "https://jetfilmizle.now",
  "Cat-Woman": "https://dizibal.org",
  "Raven": "https://dizipal2140.com",
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
const LS_ALAN = 'cp_canli_alanlar_v1';
const ALAN_OMUR_MS = 6 * 60 * 60 * 1000; // 6 saat

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

/** Canlı listeyi ağdan çeker, uygular ve önbelleğe yazar. */
export async function canliAlanlariYenile(fetchFn) {
  try {
    const f = fetchFn || (typeof fetch === 'function' ? fetch : null);
    if (!f) return 0;
    const r = await f(ALAN_LISTESI_URL, { signal: AbortSignal.timeout?.(8000) });
    if (!r || !r.ok) return 0;
    const metin = await r.text();
    const bulunan = {};
    for (const satir of metin.split('\n')) {
      const i = satir.indexOf(':');
      if (i < 1) continue;
      const anahtar = satir.slice(0, i).trim().toLowerCase();
      let url = satir.slice(i + 1).trim().replace(/\/+$/, '');
      if (!/^https?:\/\//i.test(url)) continue;
      for (const [site, kodlar] of Object.entries(SITE_KODLARI)) {
        if (!anahtar.includes(site)) continue;
        for (const kod of kodlar) if (GUNCEL[kod] !== url) bulunan[kod] = url;
      }
    }
    let n = 0;
    for (const [kod, url] of Object.entries(bulunan)) {
      // Yalnız bize ait kodlar güncellenir; ölü adresle mevcut iyiyi bozmuyoruz.
      if (Object.prototype.hasOwnProperty.call(GUNCEL, kod)) { GUNCEL[kod] = url; n++; }
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
  };
}

/** Bu adres bir alan listesi isteği mi? (köprü yakalayıcı) */
export function alanListesiIstegiMi(url) {
  return /\/domains(\.json)?(\?|$)/.test(String(url));
}

// Modül yüklenirken önbellekteki canlı liste uygulanır (ağ isteği YOK —
// testler ve çevrimdışı başlangıç etkilenmez). Ağdan tazeleme ayrı çağrılır.
try { kayitliAlanlariUygula(); } catch (_) {}
