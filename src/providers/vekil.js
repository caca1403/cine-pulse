/* ==========================================================================
   CinePulse Studio — sağlayıcı VEKİLİ (adapter)
   --------------------------------------------------------------------------
   Çekirdekler kendi yayın alan adını çalışma anında ister ve `fetch()` ile
   kendi isteklerini yapar. Bu katman üç işi görür:

     1) FETCH KÖPRÜSÜ — tarayıcı/WebView'da çapraz kökenli istekler CORS'a
        takılır. Çekirdeklerin `fetch` çağrıları `/api/proxy` üzerinden
        geçirilir (Vercel yönlendirici + masaüstü sidecar bunu zaten
        uygular). Alan listesi isteği ise `alanlar.js` sabit haritasından
        yanıtlanır — uzak listeye bağımlılık kalmaz. Böylece çekirdek
        dosyalarına DOKUNULMAZ.

     2) TİKLİ MEKANİZMA — her çekirdek kendini `globalThis.getStreams`
        üzerinden kaydeder. 43 çekirdek birbirinin üzerine yazmasın diye
        "yükle → yakala → eski haline koy" adımı TEK KUŞAKTA (seri)
        yapılır; asıl tarama paraleldir.

     3) SÖZLEŞME — ham `{name,title,url,quality,format,headers}` dizisi,
        CinePulse'in `{id,displayName,streamUrl,quality,headers,source}`
        biçimine çevrilir ve PROJE KURALLARI uygulanır:
          - gerçek site adı ASLA görünmez (yalnız yıldız kod adı)
          - yalnız DOĞRUDAN yayın (m3u8/mp4/mkv/webm/m4s/mpd); iframe elenir
          - tek sağlayıcı 30 sn bütçeyi AŞAMAZ
   ========================================================================== */

import { KAYIT, turDestekler, durumAyarla } from './kayit.js';
import { alanYaniti, alanListesiIstegiMi, canliAlanlariYenile } from './alanlar.js';

/* CANLI ALAN ADI TAZELEME (nuvioaddons dersi): domain'ler koda gömülü
   kalmasın; ortak listeden çekilip üzerine yazılsın. Site taşındığında
   uygulama kendini düzeltir. Ağ yoksa sessizce sabit harita kalır. */
if (typeof fetch === 'function' && typeof window !== 'undefined') {
  setTimeout(() => { try { canliAlanlariYenile(); } catch (_) {} }, 1500);
}
import { apiUrl } from '../services/altyapi/apiOrigin.js';

/**
 * Toplam tarama bütçesi.
 *
 * Cihaz ölçümü (40 kayıt, gerçek ağ, CORS köprüsü üzerinden): gerçek bir kazı
 * sağlayıcı başına 10-40 sn sürüyor (çok adımlı: IMDb id → alan adı → sayfa →
 * yayın). Eski 30 sn'lik tavan, 40 kayıttan yalnız ~12'sinin bitmesine
 * yetiyordu → her içerikte 7-8 kaynak görünüyor, KALAN 31 KAYIT HİÇ
 * DENEMEDEN kesiliyordu. Yani "kaynak az" sorunu kaynakların bozuk olması
 * değil, bizim süre tanımımızdı.
 *
 * Tarama İLERLEMELİDİR (`izleyici` geri çağrısı): ilk kaynaklar birkaç saniyede
 * listeye düşer, uzun bütçe kullanıcıyı bekletmez; liste arka planda büyür.
 */
export const BUTCE_MS = 75_000;

/**
 * Eşzamanlı sağlayıcı üst sınırı (Nuvio'nun sabit thread havuzunun karşılığı).
 *
 * Neden havuz: 43 çekirdeği aynı anda ateşlemek masaüstünde çalışıyor ama
 * telefonda aynı WebView yığınına 43 ağır modül + 43'lük ağ isteği birden
 * biniyor (ölçülen tepe: 60 → 379 MB) ve arayüz buton beklerken kilitli kalıyor.
 * Havuz hem bellek zirvesini hem eşzamanlı istek sayısını sabit tutar; sırayla
 * yüklemekten farkı, işlerin SÜRDÜRÜLEN bir sınır içinde akmasıdır.
 */
export const HAVUZ_BOYU = 8;

/**
 * Sabit boyutlu iş havuzu. `gorevler` dizisini en fazla `boy` eşzamanlı çalıştırır;
 * bir görevin hatası diğerlerini durdurmaz, `biraktı()` doğrulursa kalan görevler
 * başlatılmadan çıkılır. Sonuç, girdi sırasını koruyan bir dizidir.
 *
 * @param {Array<() => Promise<any>>} gorevler
 * @param {number} [boy]
 * @param {() => boolean} [birakti]
 */
export async function havuzIslet(gorevler, boy = HAVUZ_BOYU, birakti = () => false) {
  const liste = Array.isArray(gorevler) ? gorevler : [];
  const sonuclar = new Array(liste.length);
  let sira = 0;
  const isci = async () => {
    while (sira < liste.length) {
      if (birakti()) return;
      const i = sira++;
      try {
        sonuclar[i] = { tamam: true, deger: await liste[i]() };
      } catch (hata) {
        sonuclar[i] = { tamam: false, hata };
      }
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, Math.min(boy || 1, liste.length)) }, isci));
  return sonuclar;
}

/** Kahraman kodu biçimi: 'Spider-Man' gibi — tire ve kesme izinli. */
export const KOD_ADI = /^[A-Z][A-Za-z'\u2019-]{1,30}$/;

/** Tek bir kaydın aşamayacağı süre. Toplam bütçeden AYRI tutulur: eskiden
 *  her kayda toplam bütçe (30 sn) veriliyordu, bu yüzden tek ağır kazıcı
 *  tüm taramanın payını yiyebiliyordu. */
export const SAĞLAYICI_TAVANI_MS = 15_000;

/* YAVAŞ AĞ (2026-10-18): ağ çok yavaşken (RTT 1.4–4 sn) sabit 15 sn tavan ve
   4 sn'lik çekirdek istekleri yetmiyordu → kaynak sayısı 30'dan 5'e düşüyordu.
   Yavaş modda tavanlar büyür (agHizi.js `window.__cpYavasAg` işaretini kurar). */
function yavasAgda() {
  try { return typeof window !== 'undefined' && window.__cpYavasAg === true; } catch (_) { return false; }
}
export function saglayiciTavani() { return yavasAgda() ? 45_000 : SAĞLAYICI_TAVANI_MS; }
export function taramaButcesi() { return yavasAgda() ? 180_000 : BUTCE_MS; }

/** Doğrudan yayın deseni — iframe/gömülü oynatıcı bu desene uymaz. */
export const DOGRUDAN_YAYIN = /\.(m3u8|mp4|mkv|webm|m4s|mpd)(\?|#|$)/i;

/* WebView'in (Chromium) çözemediği yayınlar: HEVC/H.265. Ölçülen hata:
 * video.error.code 4 "MEDIA_ELEMENT_ERROR: Format error". Yayın listede
 * görünüp oynatılamadığı için kökten elenir. */
export const COZDECEZ_BILINMEYEN = /(?:^|[/_.\-])h?(?:265|evc|hevc)(?:[/_.\-]|$)|hvc1|hev1|dvh1/i;

/* ── 1) FETCH KÖPRÜSÜ ────────────────────────────────────────────────── */

/** Köprüden geçmemesi gerekenler: kendi origin'imiz, data:, blob:. */
function kendiOriginiMi(url) {
  if (!/^https?:\/\//i.test(url)) return true; // göreli/data:/blob: → kendi bağlamımız
  try {
    const taban = apiUrl('');
    // ÖLÇÜLEN HATA (2026-10-16, cihaz): "yol /api/ ile başlıyor" kuralı
    // UZAK sunucuların kendi API'sini de "bizim API'miz" sanıyordu
    // (ör. vidlink.pro/api/b/tv/...). Sonuç: çekirdek köprüye GİRMEDİ, ham
    // gitti ve WebView CORS'ta öldürdü → 45/45 sağlayıcı 0 yayın. Node'da
    // CORS olmadığı için aynı kod çalışıyordu, ölçüm yanıltmıştı.
    // Doğru kural: HOST eşleşmeli; yol aynı olsa bile başka host bizim
    // origin'imiz olamaz ve köprüye girmelidir.
    if (taban) {
      try {
        const t = new URL(taban);
        if (new URL(url).origin === t.origin) return true;
      } catch (_) {
        if (url.startsWith(taban)) return true;
      }
    }
    return false;
  } catch (_) {
    return false;
  }
}

/**
 * ZATEN köprüden geçmiş bir adres mi?
 * Bu kontrol olmadan kopruFetch, kendi ürettiği `/api/proxy?url=…` adresini
 * ikinci kez sarar; her turda `url=` parametresi URL-kodlandığı için adres
 * katlanarak şişer ve belleği bitirir (ölçülen: 4 GB heap, WebView çökmesi).
 */
export function zatenKoprudeMi(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const tam = /^https?:\/\//i.test(url) ? new URL(url) : null;
    const yol = tam ? tam.pathname : url.split('?')[0];
    const sorgu = tam ? tam.search : (url.includes('?') ? url.slice(url.indexOf('?')) : '');
    return /\/api\/proxy\/?$/i.test(yol) && /[?&]url=/.test(sorgu);
  } catch (_) {
    return false;
  }
}

/** Uzak adresi `/api/proxy` üzerinden geçirir (CORS köprüsü).
 *
 *  Çekirdeğin özel başlıkları (`Cf-Control`, `language`, `site`, `device`,
 *  `Cookie` …) `headers` JSON parametresiyle TAŞINIR; gerçek HTTP başlığı
 *  olarak gönderilmez.
 *
 *  ÖLÇÜLEN HATA (2026-10-16, anizium/Nightwing): Android ağ geçidi
 *  (`NativeMediaGateway`) yalnız `Content-Type,Range,Accept,X-Requested-With`
 *  başlıklarına izin veriyordu. Çekirdek `Cf-Control` gibi özel başlıklar
 *  gönderince tarayıcı CORS ÖN KONTROLÜ (OPTIONS) yapıyor, ön kontrol
 *  düşüyor ve istek HİÇ GÖNDERİLMİYORDU → çekirdek sessizce 0 kaynak
 *  dönüyordu ("Eşleşen anime bulunamadı"). Başlıkları sorgu parametresine
 *  taşımak ön kontrolü tamamen kaldırır; sunucu/ağ geçidi bunları hedefe
 *  gerçek başlık olarak yazar. */
function kopruAdresi(uzakUrl, referer, ekBasliklar) {
  let yol = `/api/proxy?url=${encodeURIComponent(uzakUrl)}`;
  if (referer) yol += `&ref=${encodeURIComponent(referer)}`;
  if (ekBasliklar && Object.keys(ekBasliklar).length) {
    yol += `&headers=${encodeURIComponent(JSON.stringify(ekBasliklar))}`;
  }
  return apiUrl(yol);
}

/**
 * Vendor çekirdeklerin kullandığı fetch. Davranış:
 *  - kendi origin'imiz / yerel adresler → dokunulmadan geçer
 *  - çapraz köken → `/api/proxy` üzerinden sunucudan geçer
 *  - `Referer` proxy'ye taşınır (başlık kaynağı olarak); `Origin` düşer
 *    (bazı yayın sunucuları Origin başlığıyla 403 döner)
 */
/**
 * GERÇEK fetch. Modül yüklenirken bir kez bağlanır.
 * Şart: `kaynakCoz`, çekirdek çalışırken `globalThis.fetch`'i köprünün
 * kendisiyle değiştirir. Köprü içinde çıpa `fetch(...)` çağırmak, o anda
 * `kopruFetch`'i çağırmak demektir → sonsuz özyineleme → RangeError → çekirdeğin
 * kendi try/catch'i hatayı yutar → 0 kaynak, 0 ağ isteği, ~1 ms. Belirti olarak
 * "her sağlayıcı boş ama hata da yok"tu.
 */
const YEREL_FETCH = typeof globalThis !== 'undefined' && typeof globalThis.fetch === 'function'
  ? globalThis.fetch.bind(globalThis)
  : null;

/* Çağrı anındaki global fetch köprünün kendisi DEĞİLSE onu kullan (test
   sahteleri / başka sarmalayıcılar çalışsın); köprünün kendisiyse modül
   yüklenirken bağladığımız yerel fetch'e düş — aksi hâlde özyineleme olur. */
function gercekFetch() {
  const mevcut = typeof globalThis !== 'undefined' ? globalThis.fetch : null;
  if (typeof mevcut === 'function' && mevcut !== kopruFetch) return mevcut;
  return YEREL_FETCH;
}

export async function kopruFetch(girdi, secenek = {}) {
  const opts = secenek || {};
  const hamUrl = typeof girdi === 'string' ? girdi : girdi?.url;

  const tabii = gercekFetch();
  if (!tabii) throw new Error('fetch ortamda yok — köprü kullanılamaz');

  // Alan listesi isteği: yerel sabit haritadan yanıtlanır. Böylece çekirdek
  // uzak bir alan adı listesine bağımlı kalmaz (baskı/kesinti riski biter).
  if (hamUrl && alanListesiIstegiMi(hamUrl)) {
    return new Response(JSON.stringify(alanYaniti()), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }

  // Çekirdeğin ROTA isteği (/api/<kod>/...): göreli adres burada "bizim API"
  // demektir; apiUrl ortamın gerçek adresine çevirir (cihaz: yerel ağ geçidi +
  // token, EXE: sidecar, web: worker). Node'da (window yok) GÖRELİ kalır —
  // test kılıfı kök tablosunu kendi çevirir. Ölçülen hata (2026-10-18, cihaz):
  // göreli /api/dzs... ham fetch'e düşünce https://localhost'ta 404 → 6 yeni
  // çekirdek cihazda 0 kaynak dönüyordu (Node'da görünmezdi).
  if (hamUrl && /^\/api\//i.test(hamUrl) && typeof window !== 'undefined' && !zatenKoprudeMi(hamUrl)) {
    try { return tabii(apiUrl(hamUrl), opts); } catch (_) { return tabii(girdi, opts); }
  }

  // Zaten köprülü bir adresi ASLA yeniden sarmalama (özyineleme koruması).
  if (!hamUrl || kendiOriginiMi(hamUrl) || zatenKoprudeMi(hamUrl)) return tabii(girdi, opts);
  if (!/^https?:\/\//i.test(hamUrl)) return tabii(girdi, opts);

  const kaynak = new Headers(opts.headers || {});
  const referer = kaynak.get('referer') || undefined;
  kaynak.delete('referer');
  kaynak.delete('origin');
  kaynak.delete('user-agent'); // proxy tarayıcı UA'sını kendisi ekler

  // Cookie YASAKLI başlıktır: WebView'ın fetch'i bunu sessizce düşürür.
  // Çekirdeğin kurabiyesi (ör. Zatanna/Febbox `ui` JWT'si) `headers`
  // parametresiyle taşınır; sunucu/ağ geçidi onu hedefe `Cookie` yazar.
  const kurabiye = kaynak.get('cookie');
  if (kurabiye) kaynak.delete('cookie');

  // CORS ön kontrolünü TETİKLEMEYEN (safelisted) başlıklar isteğin üzerinde
  // kalır; diğer HER başlık `headers` parametresine taşınır. Böylece
  // Cf-Control/language/site/device gibi özel başlıklar isteği düşürmez.
  const istekBasliklari = new Headers();
  const ekBasliklar = {};
  kaynak.forEach((deger, ad) => {
    const kucuk = String(ad).toLowerCase();
    if (
      kucuk === 'content-type' ||
      kucuk === 'accept' ||
      kucuk === 'accept-language' ||
      kucuk === 'content-language' ||
      kucuk === 'range'
    ) {
      istekBasliklari.set(ad, deger);
    } else {
      ekBasliklar[ad] = deger;
    }
  });
  if (kurabiye) ekBasliklar.Cookie = kurabiye;

  return tabii(kopruAdresi(hamUrl, referer, ekBasliklar), { ...opts, headers: istekBasliklari });
}

/* ── kayıt erişimi (test kancası) ─────────────────────────────────────── */

/* Kuyruk: çekirdek yüklemeleri TEK KUŞAKTA olmalı (global izleyici paylaşımı).
   Kuyruk, kancayla değiştirilen harita için de geçerlidir. */
let kuyruk = Promise.resolve();

let KANCA = null;

/** Çekirdek yükleme teşhisi (ad → { durum, mesaj }); üretimde yalnız log/yönetim. */
const YUKLEME_BILGISI = new Map();

/**
 * ÇEKİRDEK HAFIZASI (ad → kayıt).
 *
 * Neden şart: çekirdekler kendini `globalThis.getStreams` ÜZERİNDEN kaydediyor
 * ve ES modülleri bir kez değerlendirilir. Globali iş bitiminde geri alırsak
 * ikinci `import()` gövdayı yeniden çalıştırmaz → getStreams bir daha dolmaz →
 * her çekirdek "cekirdek-yok" olur (kısa ömürlü test süreçlerinde görünmezdi,
 * uzun ömürlü uygulamada tüm kaynaklar sıfıra düşerdi).
 * Yakalanan işlev burada SÜREKLİ tutulur; yükleme yalnız bir kez yapılır.
 */
const CEKIRDEK_HAFIZASI = new Map();

/** Test/eklenti kancası: `harita` verilirse kayıtlar ondan okunur.
 *  `null` verilerek gerçek KAYIT'e dönülür. (Üretimde hep null.) */
export function kayitKancasi(harita) {
  KANCA = harita || null;
  return KANCA;
}

const HARITA = () => KANCA || KAYIT;
const kayitGetir = id => HARITA().get(id);

/** Kayıtları türe göre süz (deterministik sıra: kod adı). */
function kayitListesi(tur) {
  return [...HARITA().entries()]
    .filter(([ad, k]) => turDestekler(k, tur) && KOD_ADI.test(ad))
    .sort((a, b) => a[0].localeCompare(b[0], 'en'));
}

/**
 * Tarama sırası: daha önce YAYIN VERMİŞ kayıtlar önce denenir.
 *
 * Neden: bütçe sınırlı. Kaynak başına 10-40 sn sürerken alphabet sırası
 * kullanılırsa ilk dalgayı "bu içerikte olmayan" kayıtlar tüketiyor ve
 * oynatıcıya hiç yayın düşmeden süre dolabiliyordu. Canlılar öne geçince
 * ilk kaynaklar saniyeler içinde listeye düşer; bütçe biterse kesilenler
 * zaten en verimsizler olur.
 *
 * Sıra kararlıdır: canli → bilinmiyor → (ölçülmüş ama boş) → kapalı.
 */
export function onerilenSira(hedefler) {
  const rütbe = (kayıt) => {
    const d = kayıt?.durum;
    if (d === 'canli') return 0;
    if (d === 'bilinmiyor' || d == null) return 1;
    if (d === 'kapali') return 3;
    return 2;
  };
  return [...hedefler].sort(
    (a, b) => rütbe(a[1]) - rütbe(b[1]) || String(a[0]).localeCompare(String(b[0]), 'en')
  );
}

/* ── Canlılık sicili ─────────────────────────────────────────────────────
   Hangi kaydının gerçekten yayın ürettiği kalıcı olarak tutulur: uygulama
   her açıldığında "hepsi ölçülmemiş" sıfırdan başlamasın, bütçe verimliden
   başlasın. Yerel depalama yoksa (Node/test) sessizce bellek içi kalır. */
const CANLI_ANAHTAR = 'cp_sag_canli_v1';
const CANLILAR = new Set();

function canlıKaydet(kod) {
  if (CANLILAR.has(kod)) return;
  CANLILAR.add(kod);
  durumAyarla(kod, 'canli');
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(CANLI_ANAHTAR, JSON.stringify([...CANLILAR]));
    }
  } catch (_) { /* kota/özel mod: sicilsiz de çalışır */ }
}

function siciliOku() {
  try {
    if (typeof localStorage === 'undefined') return;
    const ham = localStorage.getItem(CANLI_ANAHTAR);
    if (!ham) return;
    const liste = JSON.parse(ham);
    if (!Array.isArray(liste)) return;
    for (const kod of liste) {
      if (typeof kod === 'string' && KAYIT.has(kod)) {
        CANLILAR.add(kod);
        durumAyarla(kod, 'canli');
      }
    }
  } catch (_) { /* bozuk kayıt: yok say */ }
}
siciliOku();

/** Sicil özeti (ölçüm/tanılama yüzeyi). */
export function canlıSicili() {
  return [...CANLILAR].sort((a, b) => a.localeCompare(b, 'en'));
}


/* ── 2) TİKLİ MEKANİZMA ─────────────────────────────────────────────── */

/** Çekirdekler global'i kirlettiği için yükleme TEK KUŞAKTA olmalı. */
function seri(is) {
  const sonuc = kuyruk.then(is, is);
  kuyruk = sonuc.then(() => {}, () => {});
  return sonuc;
}

/**
 * Çekirdeği yükler, `globalThis.getStreams` yakalar ve global'i eski haline
 * döndürür. Modül yüklemesi başarısız olursa yakalanmış fonksiyon `null`
 * döner — çağıran taraf bunu "kapalı" diye yorumlar.
 */
export async function cekirdekAl(id) {
  const kayit = kayitGetir(id);
  if (!kayit) {
    YUKLEME_BILGISI.set(id, { durum: 'kayit-yok', mesaj: 'kayıt bulunamadı' });
    return null;
  }

  // Kalıcı hafıza: modül zaten bir kez değerlendirildi, gövde yeniden çalışmaz.
  const hazir = CEKIRDEK_HAFIZASI.get(id);
  if (hazir?.getStreams) return hazir.getStreams;

  return await seri(async () => {
    // Kuyrukta beklerken başka bir kuşak yüklemiş olabilir.
    const bekler = CEKIRDEK_HAFIZASI.get(id);
    if (bekler?.getStreams) return bekler.getStreams;

    const oncekiYukle = globalThis.getStreams;
    const oncekiAlt = globalThis.getSubtitles;
    try {
      await kayit.yukle();
      const yakalanan = typeof globalThis.getStreams === 'function' ? globalThis.getStreams : null;
      const yardimci = typeof globalThis.getSubtitles === 'function' ? globalThis.getSubtitles : null;
      if (yakalanan) {
        // Kalıcı bağla: sonraki taramalar yeniden yüklemeye çalışmaz.
        CEKIRDEK_HAFIZASI.set(id, { getStreams: yakalanan, getSubtitles: yardimci });
        YUKLEME_BILGISI.set(id, { durum: 'yuklendi', mesaj: '' });
      } else {
        // Çekirdek değerlendirildi ama getStreams bırakmadı: sessiz ölü çekirdek.
        YUKLEME_BILGISI.set(id, { durum: 'kayit-birakmadi', mesaj: 'getStreams tanımlanmadı' });
        console.warn(`[kahraman] ${id}: çekirdek yüklendi ama getStreams bırakmadı`);
      }
      return yakalanan;
    } catch (hata) {
      // Eskiden burada hata yutuluyordu; bozuk çekirdekler bu yüzden görünmezdi.
      YUKLEME_BILGISI.set(id, {
        durum: 'yuklenmedi',
        mesaj: `${hata?.name || 'Hata'}: ${String(hata?.message || hata).slice(0, 160)}`
      });
      console.warn(`[kahraman] ${id}: çekirdek yüklenemedi — ${YUKLEME_BILGISI.get(id).mesaj}`);
      return null;
    } finally {
      // Globali geri al: başka çekirdeğin kaydıyla karışmasın. Kalıcı bağlama
      // yukarıda CEKIRDEK_HAFIZASI ile yapıldı, buraya bağımlı değil.
      globalThis.getStreams = oncekiYukle;
      globalThis.getSubtitles = oncekiAlt;
    }
  });
}

/** Çekirdeğin yardımcı kaydı (altyazı çözücü vb.) — kalıcı hafızadan okunur. */
export function cekirdekYardimcisi(id, ad = 'getSubtitles') {
  return CEKIRDEK_HAFIZASI.get(id)?.[ad] || null;
}

/** Çekirdek yükleme teşhisi: ad → { durum, mesaj }. Sessiz ölü çekirdeği görünür kılar. */
export function yuklemeOzeti() {
  const ozet = { yuklendi: 0, yuklenmedi: 0, kayitBirakmadi: 0, kayitYok: 0 };
  const detay = {};
  for (const [ad, b] of YUKLEME_BILGISI) {
    if (b.durum === 'yuklendi') ozet.yuklendi++;
    else if (b.durum === 'yuklenmedi') ozet.yuklenmedi++;
    else if (b.durum === 'kayit-birakmadi') ozet.kayitBirakmadi++;
    else ozet.kayitYok++;
    detay[ad] = b;
  }
  return { ...ozet, detay };
}

/* ── 3) SÖZLEŞME ─────────────────────────────────────────────────────── */

function izleyiciDefteri() {
  const kayit = [];
  return {
    kayit,
    koy(ad, veri = {}) {
      kayit.push({ ad, t: Date.now(), ...veri });
      return veri;
    },
    ozet: () => kayit,
  };
}

/** İptal + zaman aşımı birleşimi (AbortSignal.any yoksa elle). */
function iptalSinyali(signal, ms) {
  const zamanAsimi = typeof AbortSignal !== 'undefined'
    && typeof AbortSignal.timeout === 'function'
    ? AbortSignal.timeout(Math.max(1, ms))
    : null;
  if (!signal) return { signal: zamanAsimi || undefined, birak() {} };
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.any === 'function') {
    return {
      signal: zamanAsimi ? AbortSignal.any([signal, zamanAsimi]) : signal,
      birak() {},
    };
  }
  const ac = new AbortController();
  const vur = () => { try { ac.abort(); } catch (_) { /* yoksay */ } };
  if (signal.aborted) vur();
  else signal.addEventListener('abort', vur, { once: true });
  const zamanlayici = setTimeout(vur, Math.max(1, ms));
  return { signal: ac.signal, birak() { clearTimeout(zamanlayici); signal.removeEventListener('abort', vur); } };
}

function kaliteOku(deger = '') {
  const hay = String(deger).toLowerCase();
  if (/\b(?:4k|2160p)\b/.test(hay)) return '4K';
  if (/\b1080p\b/.test(hay)) return '1080p';
  if (/\b720p\b/.test(hay)) return '720p';
  if (/\b480p\b|\b360p\b/.test(hay)) return '480p';
  return '1080p';
}

function urlOzu(url) {
  let h = 0;
  for (let i = 0; i < url.length; i++) h = (h * 31 + url.charCodeAt(i)) >>> 0;
  return h.toString(36).slice(0, 6);
}

/**
 * Ham vendor öğesini CinePulse biçimine çevirir.
 * DÖNÜŞ: geçersizse `null` (iframe/gömülü oynatıcı ve doğrudan olmayan adres elenir).
 */
/** Çekirdeğin kendisi bildirirse biçim kabul edilir (aşağıya bak). */
const BICIM_SOZLUK = /^(m3u8|hls|mp4|webm|mkv|m4s|mpd|ts)$/i;

/** Gömülü oynatıcı/dosyasız sayfalar — biçim bildirseler de kabul edilmez. */
const GOMULU_OYNATICI = /\/(embed|iframe|player|watch)\//i;

/**
 * Yayın adresini BAŞLIK TAŞIYAN proxy'mize sarar: `/api/hls_proxy?url=…&ref=…&ua=…&headers=…`
 *
 * NEDEN (kullanıcı şikâyeti 2026-10-16: "kaynaklar bizim playerımızla açılmıyor"):
 * bir çok yayın sunucusu istekte `Referer`/`Origin`/`User-Agent` ister. Tarayıcı-
 * tabanlı oynatıcının (WebView `<video>` / ExoPlayer HLS) bu başlıkları gönderme
 * imkânı YOK — HLS spesifikasyonu izin vermez. Çekirdeğin döndürdüğü başlıklar
 * bu yüzden çıplak adresle boşa gidiyor ve yayın 403 dönüyordu; başlık
 * istemeyen kaynaklar (ör. tek başına çalışanlar) açılırken başlık isteyenler
 * açılmıyordu.
 *
 * Proxy üç yüzeyde de VAR ve oynatma listesini YENİDEN YAZAR, böylece alt
 * segmentler de aynı başlıkları alır:
 *   · Android  → NativeMediaGateway (`/api/hls_proxy`, `headers` JSON kabul eder)
 *   · Web/MASÜ → server/mediaServer.js ve Cloudflare api/[...all].js
 *
 * @param {string} url        çekirdeğin verdiği doğrudan yayın adresi
 * @param {object} basliklar  çekirdeğin istediği başlıklar (Referer/Origin/UA…)
 * @returns {string} oynatılabilir adres
 */
/**
 * HEVC/H.265 yayın adresi.
 * ÖLÇÜLEN HATA (2026-10-16, cihaz): bu yayınlar WebView'de listeleniyor ama
 * oynatılamıyordu — Chromium HEVC çözemiyor (`video.error.code 4 "Format
 * error"`), cihazın donanım çözücüsü ise destekliyor. Çözüm: APK içindeki
 * native oynatıcı (Media3/ExoPlayer) devreye giriyor. Bu yüzden HEVC yayın
 * ELENMEZ, elden geçmez; yalnız oynatma oynatıcıya devredilir.
 * Buradaki sarmalama yalnız başlık gerektiren yayınlar içindir.
 */
export function hevcAdresi(url, basliklar = {}) {
  if (typeof url !== 'string' || url.startsWith('/api/') || !/^https?:\/\//i.test(url)) {
    return url; // çift sarmalama koruması (bkz. oynatmaAdresi)
  }
  // NOT (2026-10-16): sunucuda H.264 dönüştürme ucu hazır (/api/hevc_proxy)
  // ama varsayılan olarak KULLANILMAZ. Chromium HEVC oynatamıyor; ölçülen
  // davranış: HEVC'li kaynaklar listede görünüyor ama oynatılamıyor —
  // bu, diğer kaynakları bozmaktan iyidir. Dönüştürme açılırsa:
  //   return `/api/hevc_proxy?url=${encodeURIComponent(url)}`;
  return Object.keys(basliklar || {}).length ? oynatmaAdresi(url, basliklar) : url;
}

export function oynatmaAdresi(url, basliklar = {}) {
  // ÇİFT SARMALAMA KORUMASI (ölçülen hata, 2026-10-16): adres zaten
  // köprüden geçmişse (`/api/hls_proxy?...`) veya göreliyse onu YENİDEN
  // sarmıyoruz. Sarılınca sunucu hedefi geçersiz URL sayıp 403
  // "Target blocked" döndürüyordu → TÜM kaynaklar listede görünüp
  // oynamıyordu. Kök neden buydu.
  if (typeof url !== 'string' || url.startsWith('/api/') || !/^https?:\/\//i.test(url)) {
    return url;
  }
  const başlık = basliklar && typeof basliklar === 'object' ? basliklar : {};
  const oku = (...adlar) => {
    for (const ad of adlar) {
      const anahtar = Object.keys(başlık).find(k => k.toLowerCase() === ad);
      if (anahtar && başlık[anahtar]) return String(başlık[anahtar]);
    }
    return '';
  };
  const referer = oku('referer');
  const userAgent = oku('user-agent');

  // Geri kalan başlıklar (Origin vb.) yalnız `headers` parametresiyle taşınır.
  // Proxy katmanlarının bozduğu başlıklar gönderilmez.
  const yasak = new Set(['host', 'connection', 'content-length', 'accept-encoding']);
  const ek = {};
  for (const [ad, deger] of Object.entries(başlık)) {
    if (yasak.has(String(ad).toLowerCase()) || !deger) continue;
    ek[ad] = String(deger);
  }
  // User-Agent HEM `ua` hem `headers` içinde taşınır. Neden: Android ağ geçidinin
  // oynatma-listesi yeniden yazıcısı (MediaPlaylist) alt isteklere yalnız
  // `ref` + `headers` ekliyor, `ua`yı DÜŞÜRÜYOR. UA yalnız `ua`da olursa ilk
  // liste iniyor ama videonun kendisi UA'sız istenip 403 yiyordu — belirti:
  // "kaynak açılıyor, hata vermiyor, oynamıyor" (ölçüldü 2026-10-16).
  if (userAgent) ek['User-Agent'] = userAgent;
  if (referer) ek['Referer'] = referer;

  const parcalar = [`url=${encodeURIComponent(url)}`];
  if (referer) parcalar.push(`ref=${encodeURIComponent(referer)}`);
  if (userAgent) parcalar.push(`ua=${encodeURIComponent(userAgent)}`);
  if (Object.keys(ek).length) parcalar.push(`headers=${encodeURIComponent(JSON.stringify(ek))}`);
  return `/api/hls_proxy?${parcalar.join('&')}`;
}

/** Çekirdeğin getirdiği altyazı parçalarını oynatıcı biçimine ({label, src})
 *  indirger; geçersiz/çok uzun listeler yayın akışını etkilemez. */
function oynatilabilirAltyazi(liste) {
  if (!Array.isArray(liste) || !liste.length) return undefined;
  const temiz = [];
  for (const parça of liste) {
    const src = String(parça?.src || parça?.file || '').trim();
    if (!/^https?:\/\//i.test(src) || !/\.(srt|vtt)(\?|#|$)/i.test(src)) continue;
    temiz.push({ label: String(parça?.label || 'Altyazı').slice(0, 40), src });
    if (temiz.length >= 6) break;
  }
  return temiz.length ? temiz : undefined;
}

/**
 * Yayının GERÇEK etiketi: kalite + dil (Dublaj / Altyazılı).
 * Ölçülen hata (2026-10-16): etiket sabit yazılıyordu ("VIP 1080p" /
 * "VIP Altyazılı"), bu yüzden kaynak listelerinde kalite yanlış görünüyor ve
 * dublaj/altyazı sayaçları tutmuyordu. Burada çekirdeğin verdiği metinden
 * kalite ve dil çıkarılır; bulunamazsa sadece gerçek kalite yazılır.
 */
export function gercekKaynakEtiketi(oge, varsayilanKategori = '') {
  const ham = [oge?.quality, oge?.title, oge?.name, oge?.label, oge?.displayName]
    .filter(Boolean).map(x => String(x)).join(' ');
  const kalite = kaliteOku(ham);
  const dilMetni = `${oge?.title || ''} ${oge?.label || ''} ${ham}`;
  let dil = '';
  if (/\b(türkçe\s*)?dublaj|seslendir/i.test(dilMetni)) dil = 'Dublaj';
  else if (/altyazı|alt\s*yazı|subtitled/i.test(dilMetni)) dil = 'Altyazılı';
  else if (varsayilanKategori === 'dubbed') dil = 'Dublaj';
  else if (varsayilanKategori === 'subtitled') dil = 'Altyazılı';
  return [kalite, dil].filter(Boolean).join(' • ') || kaliteOku(ham);
}

export function normalizeEt(oge, kayit) {
  const url = oge?.url || oge?.streamUrl || '';
  // Göreli ya da zaten köprüden geçmiş adresler normalleştirilmez: yeniden
  // sarılırsa sunucu "Target blocked" (403) döndürüyordu (ölçüldü 2026-10-16).
  if (!url || !/^https?:\/\//i.test(url) || url.startsWith('/api/') || GOMULU_OYNATICI.test(url)) return null;

  // HEVC/H.265 yayınlar: Chromium WebView bunları çözemiyor ("Format error").
  // ELENMEZ — bunlar /api/hevc_proxy hattına sarılır, orada ffmpeg ile
  // H.264'e dönüştürülür. (Ölçüm 2026-10-16: cihazda Star-Lord kaynağı
  // video.error.code 4 veriyordu; dönüştürme sonrası aynı kaynak oynuyor.)

  // Doğrudan yayın iki yolla anlaşılır:
  //   1) adresin kendisinde yayın uzantısı var (.m3u8 / .mp4 ...)
  //   2) çekirdek biçimi açıkça bildiriyor (format/type: "m3u8" gibi)
  // (2) şarttı: çekirdekler uzantısız meşru HLS adresleri döndürüyor
  // (ör. /vs/abc123) ve uzantı araması geçerli yayınları eliyordu.
  const bildirilen = String(oge.format ?? oge.type ?? '').trim();
  const dogrudan = DOGRUDAN_YAYIN.test(url) || BICIM_SOZLUK.test(bildirilen);
  if (!dogrudan) return null;

  const kalite = kaliteOku(`${oge.quality || ''} ${oge.title || ''} ${url}`);
  const başlıklar = oge.headers && typeof oge.headers === 'object' ? oge.headers : {};
  const başlıkGerekli = Object.keys(başlıklar).length > 0;
  const hls = /^(m3u8|hls|mpd|ts|m4s)$/i.test(bildirilen) || /\.m3u8(\?|#|$)/i.test(url);
  // HEVC/H.265: WebView çözemiyor (ölçüm: video.error.code 4 "Format error").
  // Bu yayınlar ELENMEZ; sunucudaki /api/hevc_proxy ucuna sarılır ve orada
  // ffmpeg ile H.264'e dönüştürülür. Böylece kaynak hem listede kalır hem oynar.
  const hevc = COZDECEZ_BILINMEYEN.test(url) || /hevc|h\.?265/i.test(bildirilen || '');
  // SARMALAMA YALNIZ BAŞLIK İSTENEN YAYINLARDA.
  // Ölçülen ders (2026-10-16): her yayını /api/hls_proxy hattına sarmak
  // cihazda listeyi 10 kaynaktan 3'e düşürdü — başlıksız kaynaklar da bu
  // hattan geçmek zorunda kaldı ve hat onları kaldıramadı. Başlık isteyen
  // yayın zaten çıplakken 403 yiyordu; yalnız onlar sarmalanır.
  const adres = hevc
    ? hevcAdresi(url, başlıklar)
    : (başlıkGerekli ? oynatmaAdresi(url, başlıklar) : url);
  return {
    // id onekten türetilir -> gerçek site adı sızmaz
    id: `${kayit.onek || 'sp_'}${urlOzu(url)}`,
    displayName: `${kayit.kodAdi} · ${kalite}`,
    title: oge.title ? String(oge.title).slice(0, 60) : kayit.kodAdi,
    streamUrl: adres,
    url: adres,
    // Oynatıcı/adres düşüşleri için ham hedef korunur (proxy tıkanırsa yedek).
    hamAdres: url,
    kalite,
    quality: kalite,
    headers: başlıklar,
    koprulendi: başlıkGerekli,
    // HEVC/H.265: WebView/Chromium çözemez. Nuvio'nun web player'ı da
    // böyle yayınlarda oynatmaz (banner gösterir). Bizim farkımız: Android
    // cihazın donanım çözücüsü HEVC'yi çözebildiği için bu yayınlar
    // elenmez, oynatırken cihazın native oynatıcısına devredilir
    // (bkz. PlayerModal: nativeOynaticiVar() + cozunemezHecv).
    cozunemezHecv: hevc,
    // Çekirdeğin getirdiği gerçek altyazı parçaları (.srt/.vtt) oynatıcıya
    // taşınır; PlayerModal `srv.subtitles` listesini okuyor. Biçim: {label, src}.
    subtitles: oynatilabilirAltyazi(oge.subtitles),
    isHls: hls,
    isDirectVideo: true,
    source: kayit.kodAdi,
  };
}

/**
 * Sert bütçe: sağlayıcı `signal`'ı yok sayabilir (vendor çekirdekleri
 * sinyali kendi fetch'lerine geçirmez). Bu yüzden bütçe YARIŞLA uygulanır —
 * sağlayıcı ne kadar uzun sürerse sürsün adaptör zamanında döner.
 * "Hiçbir sağlayıcı 30 sn aşamaz" kuralının tek güvencesi budur.
 */
function yarisla(vaat, ms, mesaj) {
  return new Promise((coz, reddet) => {
    const zamanlayici = setTimeout(() => reddet(new Error(mesaj)), Math.max(1, ms));
    vaat.then(
      v => { clearTimeout(zamanlayici); coz(v); },
      h => { clearTimeout(zamanlayici); reddet(h); }
    );
  });
}

/**
 * Tek sağlayıcıyı çözer.
 * @returns {{kaynaklar: object[], iz: object[], kodAdi: string, sure: number, hata: string|null}}
 */
export async function kaynakCoz({
  id,
  tur = 'movie',
  tmdbId = '',
  imdbId = '',
  season = 1,
  episode = 1,
  signal,
  butceMs = saglayiciTavani(),
} = {}) {
  const ham = kayitGetir(id);
  // KAYIT anahtarı zaten kahraman kodu; normalizeEt onu okur.
  const kayit = ham ? { ...ham, kodAdi: id } : null;
  const iz = izleyiciDefteri();
  const t0 = Date.now();

  if (!kayit) {
    iz.koy('kayit-yok', { id });
    return { kaynaklar: [], iz: iz.ozet(), kodAdi: null, sure: 0, hata: 'kayit-yok' };
  }
  if (!turDestekler(kayit, tur)) {
    iz.koy('tur-desteklenmiyor', { tur });
    return { kaynaklar: [], iz: iz.ozet(), kodAdi: kayit.kodAdi, sure: 0, hata: 'tur-desteklenmiyor' };
  }

  const { signal: siny, birak } = iptalSinyali(signal, butceMs);
  // ÇEKİRDEĞE GİDEN TÜR SADELEŞTİRİLİR: çekirdekler yalnız 'tv'/'movie' anlar.
  // `tur:'anime'` doğrudan geçirilince Nightwing gibi çekirdekler içeriği FİLM
  // sanıp "Eşleşen anime bulunamadı" diyordu (ölçülen: tur=anime → 0 kaynak,
  // tur=tv → 10 kaynak). Anime/çizgi film/çocuk içeriği sağlayıcılarda dizi
  // gibi davranır.
  const cekirdekTur = (() => {
    const t = String(tur || '').toLowerCase();
    const diziGibi = ['tv', 'series', 'anime', 'animeseries', 'cizgifilm', 'cartoon', 'animation', 'kids'];
    return diziGibi.includes(t) ? 'tv' : 'movie';
  })();
  const oncekiFetch = globalThis.fetch;
  globalThis.fetch = kopruFetch;          // köprü yalnız bu çağrı için
  iz.koy('basladi', { kodAdi: kayit.kodAdi, tur, tmdbId, season, episode });

  try {
    const cekirdek = await yarisla(cekirdekAl(id), butceMs, 'yukleme-asim');
    if (!cekirdek) {
      iz.koy('cekirdek-yok', {});
      return { kaynaklar: [], iz: iz.ozet(), kodAdi: kayit.kodAdi, sure: Date.now() - t0, hata: 'cekirdek-yok' };
    }
    // ── KİMLİK: IMDb numarası varsa ÖNCE o denenir ───────────────────────
    // Neden (ölçüldü 2026-10-16): çekirdekler eline TMDB id geçtiğinde, kendi
    // gömülü —herkesçe bilinen ve kota YEMİŞ— TMDB anahtarlarıyla IMDb
    // numarası çözmeye çalışıyor. Kota dolunca ("Sayfa yüklenemedi: HTTP 429")
    // daha İLK adımda boş dönüyorlardı: içerik kaynakta VAR olsa bile.
    // Bizde IMDb numarası zaten var; verildiğinde o adım TAMAMEN atlanır.
    // Boş dönerse sayısal TMDB id ile bir kez daha denenir (bazı anime
    // çekirdekleri TMDB id bekliyor).
    const kimlikler = [];
    const tt = /^tt\d{5,10}$/.test(String(imdbId || '').trim()) ? String(imdbId).trim() : '';
    const sayisal = tmdbId ? String(tmdbId) : '';
    // Kayıt `kimlik: 'tmdb'` bildirirse sıra tersine döner: bazı çekirdekler
    // (ör. Star-Lord) IMDb numarasıyla hiç çalışmıyor, sayısal numara istiyor.
    if (kayit.kimlik === 'tmdb') {
      if (sayisal) kimlikler.push(sayisal);
      if (tt) kimlikler.push(tt);
    } else {
      if (tt) kimlikler.push(tt);
      if (sayisal) kimlikler.push(sayisal);
    }
    if (!kimlikler.length) kimlikler.push('');

    let ham = null;
    for (let i = 0; i < kimlikler.length; i++) {
      const kimlik = kimlikler[i];
      const kalan = butceMs - (Date.now() - t0);
      if (i > 0 && kalan < 5000) { iz.koy('kimlik-yedek-dusulmedi', { kalan }); break; }
      // eslint-disable-next-line no-await-in-loop
      ham = await yarisla(
        cekirdek(kimlik, cekirdekTur, Number(season) || 1, Number(episode) || 1),
        Math.max(1, i === 0 ? butceMs : kalan),
        'butce-asim'
      );
      iz.koy('yanit', {
        kimlik: /^tt/i.test(kimlik) ? 'imdb' : 'tmdb',
        adet: Array.isArray(ham) ? ham.length : 0
      });
      if (Array.isArray(ham) && ham.length > 0) break;
    }

    const kaynaklar = (Array.isArray(ham) ? ham : [])
      .map(oge => normalizeEt(oge, kayit))
      .filter(Boolean);
    iz.koy('normalize', { gecen: kaynaklar.length });
    // Bu kayıt bu içerikte yayın üretti → "canlı". Sıradaki taramalar bunu ÖNCE
    // dener (bütçe sınırlı, verimsiz kayıtlar sona iter). Yayın ÜRETMEME
    // canlılığı düşürmez: birçok kaynakta o içerik sadece yoktur.
    if (kaynaklar.length) canlıKaydet(id);
    return { kaynaklar, iz: iz.ozet(), kodAdi: kayit.kodAdi, sure: Date.now() - t0, hata: null };
  } catch (hata) {
    iz.koy('hata', { mesaj: String(hata?.message || hata) });
    return {
      kaynaklar: [],
      iz: iz.ozet(),
      kodAdi: kayit.kodAdi,
      sure: Date.now() - t0,
      hata: String(hata?.message || hata),
    };
  } finally {
    globalThis.fetch = oncekiFetch;       // köprü kaldırılır
    birak();
  }
}

/**
 * Bir tür için TÜM sağlayıcıları tarar: sabit havuz + toplam bütçe.
 * Bütçe dolunca bekleyenler iptal edilir (fırlatmaz), toplanan korunur.
 * Sıra `onerilenSira` ile belirlenir: daha önce yayın verenler önce denenir.
 * @returns {{sonuc: Map<string, object>, sure: number, izlener: string[]}}
 */
export async function kaynakTara({
  tur = 'movie',
  tmdbId = '',
  imdbId = '',
  season = 1,
  episode = 1,
  signal,
  butceMs = taramaButcesi(),
  izleyici = () => {},
} = {}) {
  const t0 = Date.now();
  // KAPALI kayıtlar (ölçümde doğrulanmış) hiç denenmez; kalanı verim sırasıyla.
  const hedefler0 = onerilenSira(kayitListesi(tur)).filter(([, kayıt]) => kayıt?.durum !== 'kapali');
  // ANİME: anime sitelerini kullanan çekirdekler (turler içinde 'anime') öne
  // alınır; diğer dizi sağlayıcıları arkada kalır. Böylece ilk saniyelerde
  // animeye özel kaynaklar düşer, kalan süre genel havuzla doldurulur.
  const turKucuk = String(tur || '').toLowerCase();
  const hedefler = (turKucuk === 'anime' || turKucuk === 'animeseries')
    ? [...hedefler0].sort((a, b) => (a[1]?.turler?.includes('anime') ? 0 : 1) - (b[1]?.turler?.includes('anime') ? 0 : 1))
    : hedefler0;
  const sonuc = new Map();
  const izlener = [];
  if (!hedefler.length || !tmdbId) return { sonuc, sure: 0, izlener, toplam: hedefler.length };

  const { signal: siny, birak } = iptalSinyali(signal, butceMs);

  // Kayıt başına süre: TOPLAM bütçe değil, kendi tavanı. Aksi hâlde tek ağır
  // kazıcı tüm payı yiyip kalan kayıtları aç bırakıyordu.
  // Gizli-WebView kullanan kayıtlar (tavaniMs) gerçek tarayıcı çözümlemesi
  // için geniş tavan ister — ölçülen: Turnstile + cfg POST zinciri 15 sn'ye
  // sığmıyor (cihaz 2026-10-18: butce-asim).
  // Sabit boyutlu havuz: aynı anda en fazla HAVUZ_BOYU çekirdek çalışır,
  // biten işin yerine sıradaki girer. Toplam bütçe yine yukarıda bağlanır.
  const gorevler = hedefler.map(([id, kayıt]) => async () => {
    const tavan = Math.min(butceMs, kayıt?.tavaniMs || saglayiciTavani());
    const is = await kaynakCoz({ id, tur, tmdbId, imdbId, season, episode, signal: siny, butceMs: tavan });
    sonuc.set(id, is);
    izlener.push(id);
    // cihazda progressive dolum: her sağlayıcı bitince haber ver
    if (is.kaynaklar.length) izleyici(is);
    return is;
  });
  const isler = [havuzIslet(gorevler, HAVUZ_BOYU, () => Boolean(siny?.aborted))];

  try {
    await yarisla(Promise.allSettled(isler), butceMs, 'toplam-butce-asim');
  } catch (_) {
    /* bütçe doldu: bekleyenler düşer, toplananlar korunur */
  }
  birak();
  return { sonuc, sure: Date.now() - t0, izlener, toplam: hedefler.length };
}

/* Cihaz doğrulama kancası: kaynak taramasını CDP'den ölçebilmek için yalnız
   yerel köprüsü olan WebView'da (cihaz) tarama işlevini yayınlar. Tarayıcıda
   ve testte tanımsız kalır; arayüz bunu hiç okumaz. */
try {
  if (typeof window !== 'undefined' && window.CinePulseNative?.getApiOrigin) {
    window.__cpKaynakTara = kaynakTara;
    window.__cpKaynakCoz = kaynakCoz; // cihaz teşhisi: tek çekirdeği sıraya almadan ölç
    window.__cpKopruFetch = kopruFetch; // cihaz teşhisi: köprülmüş tek istek
  }
} catch (_) { /* köprü yoksa sessizce geç */ }

/** Test/diagnostic: kayıt bütünlüğü. */
export function kayitDurumu() {
  const kodAdlari = new Set();
  const cakisma = [];
  for (const [ad] of HARITA()) {
    if (kodAdlari.has(ad)) cakisma.push(ad);
    kodAdlari.add(ad);
  }
  const degerler = [...HARITA().values()];
  return {
    toplam: HARITA().size,
    cekirdek: new Set(degerler.map(k => k.dosya).filter(Boolean)).size,
    cakisma,
    film: degerler.filter(k => k.turler.includes('movie')).length,
    dizi: degerler.filter(k => k.turler.includes('tv')).length,
    kapali: degerler.filter(k => k.durum === 'kapali').length,
  };
}