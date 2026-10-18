/* ==========================================================================
   CinePulse Studio - High-Performance Artwork & Fanart Service
   - Direct TMDB Images CDN for instant (<200ms) titled artwork & HD logos
   - Fanart.tv integration for custom stylized community thumbs
   - Persistent LocalStorage + In-Memory caching for instant 0ms subsequent renders
   - Works flawlessly in both Web and Capacitor Mobile APK
   ========================================================================== */

import { apiUrl } from '../altyapi/apiOrigin.js';
import { aktifAnahtar, siradakiAnahtar, searchMulti } from './tmdbApi.js';

const artworkCache = new Map();
// v5: logo/backdrop kararları değişti (eskiden başlıklı backdrop varsa logo
// null eziliyordu). Eski önbellek kayıtları "logosuz" olduğu için sürüm
// yükseltildi; aksi hâlde kullanıcılar logoları hiç göremezdi.
const LS_PREFIX = 'cp_fanart_v5_';

/* ── Nazik istek bütçesi ─────────────────────────────────────────────────
   Kart başına TMDB /images isteği atmak, anahtarı 429'a (rate limit)
   sokuyordu. Yan etkileri zincirleme: detay isteği de 429 yiyince
   "İçerik bulunamadı", rafın sonraki sayfaları da gelmiyordu. Bu yüzden
   görsel istekleri (a) sıraya girer (en fazla 2 eş zamanlı, aralarında
   ~140 ms), (b) 429/401/403 görürse 60 sn boyunca HİÇ istek atmayıp
   logoyu sessizce atlar — düz başlık görünür kalır. */
/* ÖLÇÜLEN DARBOĞAZ (2026-10-17): 2 eşzamanlı + 140 ms aralık, ana sayfadaki
   96 kartı ~7 saniyede ancak sıraya sokuyordu; üstüne bir de "isimle arama"
   zinciri tek sırada olduğu için logolar çok geç geliyordu. 5 eşzamanlı +
   70 ms aralık ≈ 70 istek/s (TMDB'nin 50/s sınırına yakın ama anahtar havuzu
   ve 429 sonrası anahtar değiştirme var). Kart sayısını değil, GÖRÜNEN kartı
   önceliklendirmek asıl hız kazancı (aşağıdaki öncelikli kuyruk). */
const EN_FAZLA_ES_ZAMANLI = 5;
const ISTEK_ARASI_MS = 70;
const SOGUMA_MS = 60000;
/* Tüm anahtarlar tükendiğinde beklenecek kısa süre: 60 sn yerine 12 sn.
   Uzun soğuma, kotanın açılması geldiğinde bile kartların logosuz kalmasına
   yol açıyordu; kısa soğuma + yeniden deneme ile logo açığı kapanır. */
const KISA_SOGUMA_MS = 12000;

/* Öncelikli kuyruk: 'yuksek' = görünen kartın kendi logosu (id ile), 'dusuk' =
   logo bulunamayınca içeriğin ADIYLA arama. Düşük öncelikli işler en fazla
   (n-2) yuva kullanır; aksi hâlde biri normal öncelikli bir isteği beklerken
   tüm yuvaları tıkayıp kilitlenme yaratırdı. Böylece kartların gerçek logo
   yüklemesi, ad aramalarının arkasında ASLA kuyrukta beklemez. */
const kuyruk = { aktif: 0, dusukAktif: 0, bekleyen: [], dusukBekleyen: [], sonTarih: 0 };
let sogukBitis = 0;

function sogukMu() {
  return Date.now() < sogukBitis;
}

function kuyruktaKos(is, oncelik = 'yuksek') {
  return new Promise((coz, reddet) => {
    const liste = oncelik === 'dusuk' ? kuyruk.dusukBekleyen : kuyruk.bekleyen;
    liste.push({ is, coz, reddet });
    bosalt();
  });
}

function bosalt() {
  while (kuyruk.aktif < EN_FAZLA_ES_ZAMANLI) {
    let gorev = kuyruk.bekleyen.shift();
    let dusuk = false;
    if (!gorev) {
      if (kuyruk.dusukBekleyen.length === 0) break;
      if (kuyruk.dusukAktif >= EN_FAZLA_ES_ZAMANLI - 2) break;
      gorev = kuyruk.dusukBekleyen.shift();
      dusuk = true;
    }
    const bekleme = Math.max(0, kuyruk.sonTarih + ISTEK_ARASI_MS - Date.now());
    kuyruk.aktif++;
    if (dusuk) kuyruk.dusukAktif++;
    kuyruk.sonTarih = Date.now() + bekleme;
    setTimeout(() => {
      Promise.resolve()
        .then(gorev.is)
        .then(gorev.coz, gorev.reddet)
        .finally(() => { kuyruk.aktif--; if (dusuk) kuyruk.dusukAktif--; bosalt(); });
    }, bekleme);
  }
}
const TMDB_API_KEY = aktifAnahtar();

function getCachedArtwork(cacheKey) {
  if (artworkCache.has(cacheKey)) return artworkCache.get(cacheKey);
  try {
    const raw = localStorage.getItem(LS_PREFIX + cacheKey) || sessionStorage.getItem(LS_PREFIX + cacheKey);
    if (raw !== null) {
      const parsed = raw ? JSON.parse(raw) : null;
      // ÖLÇÜLEN HATA (2026-10-16): boş sonuç SÜREKLİ önbelleğe yazılıyordu.
      // Tek bir 429 (kota) o içeriği kalıcı olarak "logosuz" yapıyordu; ana
      // sayfada ilk 8 kart yüklenip gerisi hiç yüklenmiyordu. Boş sonuç artık
      // KISA ÖMÜRLÜ: süre dolunca tekrar denenir.
      if (parsed && parsed.__bos) {
        if (Date.now() - (parsed.t || 0) < BOS_OMUR_MS) {
          artworkCache.set(cacheKey, parsed);
          return parsed;
        }
        return undefined; // süresi doldu → yeniden dene
      }
      artworkCache.set(cacheKey, parsed);
      return parsed;
    }
  } catch (_) {}
  return undefined;
}

/** "Logo yok" sonucunun önbellekte yaşama süresi (kota geçici olduğu için kısa). */
const BOS_OMUR_MS = 10 * 60 * 1000;

function setCachedArtwork(cacheKey, artwork) {
  artworkCache.set(cacheKey, artwork);
  try {
    // Boş sonuç zaman damgalı yazılır (kısa ömür) — kalıcı "yok" yazmıyoruz.
    const value = artwork ? JSON.stringify(artwork) : JSON.stringify({ __bos: 1, t: Date.now() });
    localStorage.setItem(LS_PREFIX + cacheKey, value);
  } catch (_) {
    try {
      const value = artwork ? JSON.stringify(artwork) : JSON.stringify({ __bos: 1, t: Date.now() });
      sessionStorage.setItem(LS_PREFIX + cacheKey, value);
    } catch (_) {}
  }
}

/** TMDB logo adresi (saydam özel tasarım). */
function logoAdresi(yol, boyut = 'w500') {
  if (!yol) return null;
  return `https://image.tmdb.org/t/p/${/\.svg$/i.test(yol) ? 'original' : boyut}${yol}`;
}

/**
 * TMDB logoları arasından en iyisini seçer: Türkçe → İngilizce → dilsiz,
 * aynı dilde oy çokluğu (popülerlik) yüksek olan; eşitlikte PNG (SVG'de
 * saydam kenar/tarama sorunu yaşanabiliyor).
 */
function enIyiTmdbLogosu(logolar = []) {
  /* Kullanıcı (2026-10-17): "logoların çoğunun Türkçesi yok; varsa logoda
     İngilizce tercih et." İçerik adları Türkçe kalır (kart yazısı değişmez),
     yalnız SAYDAM LOGO seçimi İngilizceye öncelik verir:
     İngilizce → dilsiz (orijinal) → Türkçe → diğer. */
  const dilSkoru = l => (l.iso_639_1 === 'en' ? 4 : (!l.iso_639_1 || l.iso_639_1 === 'xx') ? 3 : l.iso_639_1 === 'tr' ? 2 : 1);
  const sirali = [...logosFilter(logolar)].sort((a, b) =>
    (dilSkoru(b) - dilSkoru(a))
    || ((b.vote_count || 0) - (a.vote_count || 0))
    || ((/\.png$/i.test(b.file_path || '') ? 1 : 0) - (/\.png$/i.test(a.file_path || '') ? 1 : 0))
  );
  return sirali[0]?.file_path || null;
}

/** Boyutu 0/eksik olan (bozuk) yüklemeleri eler. */
function logosFilter(logolar) {
  return logolar.filter(l => l?.file_path && (!l.aspect_ratio || l.aspect_ratio > 0.5));
}

/**
 * Fast fetch from TMDB images CDN (ultra-fast, zero proxy, CORS-enabled, reliable everywhere)
 */
async function fetchTmdbArtwork(tmdbId, type) {
  if (sogukMu()) return null;               // soğuma süresi: anahtarı daha fazla yorma
  // Kota yediğinde sıradaki anahtara geç: tek anahtar 429 alınca tüm kartlar
  // logosuz kalıyordu. Anahtar havuzu varsayılan olarak kullanılır, çünkü
  // akıllı anahtar yönetimi (aktifAnahtar/siradakiAnahtar) tüm anahtarları
  // havuzda döndürür ve 429 alındığında otomatik sıradakine geçer.
  let apiKey = aktifAnahtar();
  try {
    let res = await kuyruktaKos(() => fetch(
      `https://api.themoviedb.org/3/${type === 'tv' ? 'tv' : 'movie'}/${tmdbId}/images?api_key=${apiKey}&include_image_language=tr,en,ja,de,fr,es,it,pt,ru,ko,zh,ar,pl,nl,sv,xx,null`,
      { signal: AbortSignal.timeout(3500) }
    ));
    // 429/401/403 → sıradaki anahtarla bir kez daha dene (havuz döner).
    if (res.status === 429 || res.status === 401 || res.status === 403) {
      apiKey = siradakiAnahtar();
      res = await kuyruktaKos(() => fetch(
        `https://api.themoviedb.org/3/${type === 'tv' ? 'tv' : 'movie'}/${tmdbId}/images?api_key=${apiKey}&include_image_language=tr,en,ja,de,fr,es,it,pt,ru,ko,zh,ar,pl,nl,sv,xx,null`,
        { signal: AbortSignal.timeout(3500) }
      ));
      if (res.status === 429 || res.status === 401 || res.status === 403) {
        // Üçüncü anahtarı da dene.
        apiKey = siradakiAnahtar();
        res = await kuyruktaKos(() => fetch(
          `https://api.themoviedb.org/3/${type === 'tv' ? 'tv' : 'movie'}/${tmdbId}/images?api_key=${apiKey}&include_image_language=tr,en,ja,de,fr,es,it,pt,ru,ko,zh,ar,pl,nl,sv,xx,null`,
          { signal: AbortSignal.timeout(3500) }
        ));
        if (res.status === 429 || res.status === 401 || res.status === 403) {
          // Tüm anahtarlar tükendi: kısa mola ver, sonra yeniden dene.
          sogukBitis = Date.now() + KISA_SOGUMA_MS;
          return null;
        }
      }
    }
    if (!res.ok) return null;
    const data = await res.json();

    // 1. Resmi saydam logo (özel tasarımlı içerik başlığı)
    const bestLogo = logoAdresi(enIyiTmdbLogosu(data.logos || []));

    // 2. Check for title-bearing landscape backdrops (Turkish or English)
    const backdrops = data.backdrops || [];
    const titledBackdrops = backdrops.filter(
      b => (b.iso_639_1 === 'tr' || b.iso_639_1 === 'en') && (b.aspect_ratio || 0) > 1.35 && b.file_path
    );
    let bestTitledBackdrop = null;
    if (titledBackdrops.length > 0) {
      titledBackdrops.sort((a, b) => {
        const score = l => l.iso_639_1 === 'tr' ? 2 : 1;
        return (score(b) - score(a)) || ((b.vote_average || 0) - (a.vote_average || 0));
      });
      bestTitledBackdrop = `https://image.tmdb.org/t/p/w780${titledBackdrops[0].file_path}`;
    }

    // Eskiden başlıklı backdrop varsa logo `null` dönüyordu; hero/kart/detay
    // o yüzden yalnız düz yazı gösteriyordu. İkisi birbirinden bağımsızdır.
    if (bestTitledBackdrop || bestLogo) {
      return { image: bestTitledBackdrop || null, logo: bestLogo || null };
    }
    return null;
  } catch (_) {
    return null;
  }
}

/**
 * Fetch from Fanart.tv proxy endpoint
 */
async function fetchFanartArtwork(tmdbId, type) {
  try {
    const fanartUrl = apiUrl(`/api/fanart?type=${type === 'tv' ? 'tv' : 'movie'}&id=${encodeURIComponent(tmdbId)}`);
    const res = await fetch(fanartUrl, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.image) {
      return { image: data.image, logo: data.logo || null };
    }
    return null;
  } catch (_) {
    return null;
  }
}

export async function getBestBackdrop(tmdbId, type = 'movie') {
  if (!/^\d+$/.test(String(tmdbId))) return null;
  const mediaType = type === 'tv' ? 'tv' : 'movie';
  const cacheKey = `${mediaType}:${tmdbId}`;

  const cached = getCachedArtwork(cacheKey);
  // Zaman damgalı boş kayıt: kullanıcıya kalıcı "logo yok" demek yerine yeniden denenir.
  if (cached !== undefined) return (cached && cached.__bos) ? null : cached;
  // Soğuma sıresindeysek isteği DÜŞÜRME: kısa bekleyip yeniden dene.
  // Ölçülen hata (2026-10-16): soğuma anında gelen kartlar hiç denemiyordu;
  // ana sayfada ilk 8 kart yükleniyor, gerisi hiç yüklenmiyordu.
  if (sogukMu()) {
    await new Promise(r => setTimeout(r, Math.max(300, sogukBitis - Date.now() + 300)));
  }

  const request = (async () => {
    // 1) TMDB CDN anında döner (logolar + başlıklı backdrop).
    const tmdbResult = await fetchTmdbArtwork(tmdbId, mediaType);
    if (tmdbResult?.logo) {
      // Logo elimizde: Fanart'a hiç gidilmez (istek bütçesi).
      setCachedArtwork(cacheKey, tmdbResult);
      return tmdbResult;
    }
    // 2) TMDB'de logo yoksa Fanart.tv denenir. İSTENÇLİ: her kart için değil,
    //    yalnız logoya gerçekten ihtiyaç duyulduğunda (yarı yarıya istek tasarrufu).
    const fanartResult = await fetchFanartArtwork(tmdbId, mediaType);
    const birlesik = {
      image: tmdbResult?.image || fanartResult?.image || null,
      logo: fanartResult?.logo || tmdbResult?.logo || null,
    };
    if (birlesik.image || birlesik.logo) {
      setCachedArtwork(cacheKey, birlesik);
      return birlesik;
    }

    setCachedArtwork(cacheKey, null);
    return null;
  })();

  artworkCache.set(cacheKey, request);
  const result = await request;
  // Soğuma yeni başladıysa sonucu KALICI önbelleğe yazma: 429 geçtiğinde
  // logo yine görülebilsin. Bellek içi değer zararsız (bu oturumda yeter).
  if (sogukMu()) {
    artworkCache.set(cacheKey, result);
    return result;
  }
  setCachedArtwork(cacheKey, result);
  return result;
}

/**
 * İçeriğin ÖZEL TASARIMLI BAŞLIĞI (saydam logo). Zincir: TMDB logosu →
 * İSİMLE TMDB ARAMASI → null.
 *
 * TVMaze'de şeffaf logo/clearlogo BULUNMAZ (yalnız poster ve geniş banner
 * verir), bu yüzden "oradan başlık al" adımı dürüst bir logo kaynağı değil;
 * logo yoksa arayüz stilize düz başlığı gösterir.
 *
 * @param {string|number} tmdbId
 * @param {'movie'|'tv'} type
 * @param {string} baslik  içeriğin KENDİ adı — id'de logo yoksa bu adla
 *                         TMDB'de arama yapılır (aşağıdaki nota bakın)
 * @returns {Promise<string|null>} logo adresi
 */
export async function baslikLogosu(tmdbId, type = 'movie', baslik = '') {
  const sanat = await getBestBackdrop(tmdbId, type);
  // Kart/hero başlığı YALNIZ gerçek saydam logoyu kullanır.
  // ÖLÇÜLEN HATA (2026-10-17): burada logo yokken backdrop'a düşülüyordu.
  // Afişin altındaki ince (max 27px) şeritte 16:9 bir fotoğraf başlık sanılıp
  // kartı bozuyordu. Logo yoksa arayüz içeriğin KENDİ ADINI stilize bir
  // "logotype" olarak çizer (isimle eşleşen başlık) — asla boş görünmez.
  if (sanat?.logo || !baslik) return sanat?.logo || null;
  // İSİMLE EŞLEŞTİRME (kullanıcı isteği: "logolara isimle eşleştirip daha
  // doğru bul"): id altında logo yoksa içeriğin adıyla aranır. Belgesel ve
  // az bilinen yapımların logosu çoğu kez yalnız böyle çıkar.
  return isimleBaslikLogosu(baslik, type);
}

/* ── İsimle logo arama ─────────────────────────────────────────────────────
   Saydam logo (clearlogo) her içerikte TMDB'nin kendi kaydında olmuyor:
   aynı yapım birden çok kayıt/kopya altında duruyor ve logo çoğu zaman
   diğer kaydın altındadır. Bu yüzden isimle arama, id ile bulunamayanı
   kurtarır.

   ÖLÇÜLEN DARBOĞAZ (2026-10-17): aramalar TEK SIRADA yapılıyordu; 84
   logosuz kart için sıra ~1 dakikaya çıkıyor, logolar "çok geç" geliyordu.
   Artık arama işleri kuyruğun DÜŞÜK öncelikli kanalına girer: görünen
   kartların gerçek logo istekleri hep önce işlenir, aramalar boşlukları
   doldurur. Aynı ad için eşzamanlı tekrar istek de tekilleştirilir. */
const isimLogoOnbellek = new Map();
const isimIstekleri = new Map();

function basligiNormallestir(deger) {
  return String(deger || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N} ]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * İçeriğin adıyla TMDB'de logo arar.
 * @param {string|string[]} basliklar denenecek adlar (Türkçe ad, özgün ad)
 */
export async function isimleBaslikLogosu(basliklar, type = 'movie') {
  const adlar = (Array.isArray(basliklar) ? basliklar : [basliklar])
    .map(ad => String(ad || '').trim())
    .filter(Boolean)
    .slice(0, 2);
  if (!adlar.length) return null;
  const hedefTur = type === 'tv' ? 'tv' : 'movie';
  const anahtar = `${hedefTur}:${basligiNormallestir(adlar[0])}`;
  if (isimLogoOnbellek.has(anahtar)) return isimLogoOnbellek.get(anahtar);
  if (isimIstekleri.has(anahtar)) return isimIstekleri.get(anahtar);

  const istek = kuyruktaKos(async () => {
    if (isimLogoOnbellek.has(anahtar)) return isimLogoOnbellek.get(anahtar);
    try {
      for (const ad of adlar) {
        const sonuclar = await searchMulti(ad);
        const normal = basligiNormallestir(ad);
        const havuz = (Array.isArray(sonuclar) ? sonuclar : [])
          .filter(s => !hedefTur || (s.type || s.media_type) === hedefTur);
        // Önce adı HARFI HARFINE tutan kayıt; yoksa ilk sonuç.
        const secilen = havuz.find(s => basligiNormallestir(s.title || s.name) === normal) || havuz[0];
        if (secilen?.id) {
          const sanat = await getBestBackdrop(secilen.id, hedefTur);
          if (sanat?.logo) {
            isimLogoOnbellek.set(anahtar, sanat.logo);
            return sanat.logo;
          }
        }
        // Aynı listede sıradaki adı denerken kısa bir nefes: toplu logoda
        // istekler üst üste binmesin.
        await new Promise(cozum => setTimeout(cozum, 60));
      }
    } catch (_) { /* logo opsiyoneldir; düz başlık görünür kalır */ }
    isimLogoOnbellek.set(anahtar, null);
    return null;
  }, 'dusuk');

  isimIstekleri.set(anahtar, istek);
  try {
    return await istek;
  } finally {
    isimIstekleri.delete(anahtar);
  }
}

export function prefetchBackdrops(items, enFazla = 30) {
  if (!Array.isArray(items)) return;
  // Kullanıcı: "logolar çatır çatır gelmeli". Görünür rafların ilk kartları
  // için istekler ÖNCEDEN başlatılır; kart gözlemcisi ateşlendiğinde sonuç
  // önbellekten gelir. Üst sınır: tüm ana sayfayı birden ısıtıp kotayı
  // tüketmemek için ilk `enFazla` öğe.
  items.slice(0, enFazla).forEach((item, index) => {
    if (!item?.id) return;
    const type = item.media_type === 'tv' || item.type === 'tv' ? 'tv' : 'movie';
    setTimeout(() => getBestBackdrop(item.id, type), index * 20);
  });
}
