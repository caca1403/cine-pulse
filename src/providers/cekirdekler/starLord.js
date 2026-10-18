/* ==========================================================================
   CinePulse — "Star-Lord" çekirdeği (birinci taraf, bağımlılıksız)
   --------------------------------------------------------------------------
   Ne yapıyor: TMDB numarasını oynatıcı API'sinin anladığı şifreli kimliğe
   çevirip DOĞRUDAN dosya adresleri (.mp4) üretiyor. Sayfa kazıma yok, iframe
   yok, gömülü API anahtarı yok, tarayıcı eklentisi bağımlılığı yok.

   Ölçülen gerçekler (2026-10-16, bu çekirdek yazılırken canlı doğrulandı):
     • şifreleme ucu   → { result: "<sifreli-kimlik>" }
       (TMDB sayısal numarası ile çalışır; IMDb numarası ile "null" dönüyor —
        bu yüzden kayıtta `kimlik: 'tmdb'` bildirildi, vekil ilk denemede
        sayısal numarayı veriyor)
     • film → /api/b/movie/<sifreli>            · dizi → /api/b/tv/<sifreli>/<sezon>/<bolum>
     • stream.qualities = { "360"|"480"|"720"|"1080": { url } } → imzalı .mp4
     • stream.deliveryType = "file", stream.TTL = 3600 (adres ~1 saat geçerli;
       yayın her açılışta yeniden çözüldüğü için sorun değil)
     • Dosya ADRESİ BAŞLIKSIZ istekte 200 veriyor; Referer eklenince 429 yiyor.
       → Yayınların ÜZERİNE BAŞLIK YAZILMAZ. Başlık olmayınca vekil yayını
         /api/hls_proxy hattına da sarmaz; oynatıcı dosyaya doğrudan gider.
     • upstream eklentideki ikinci hat (vidmody) ÖLMÜŞ: adres çözümlenemiyor.
       Bilerek alınmadı — ölü hat tarama bütçesi yer.

   DİL: Bu hat YALNIZ altyazılı yayın veriyor (Türkçe dublaj yok). Yayın
   etiketinde bilerek "Altyazı" kelimesi dolaştırılır: derleyici altyazı
   işareti görmeyen yayını dublaj sekmesine atıyordu, bu onu engeller.
   Altyazı parçaları 13 dilde geliyor (Türkçe YOK) → menüyü boğmamak için
   yalnız Türkçe/İngiliz parça taşınır, gerisi atılır.
   ========================================================================== */

const SÜRÜM = '1.0.0';
const ETİKET = `[Star-Lord v${SÜRÜM}]`;

const UÇ = {
  sifrele: 'https://enc-dec.app/api/enc-vidlink?text=',
  film: 'https://vidlink.pro/api/b/movie/',
  dizi: 'https://vidlink.pro/api/b/tv/',
};

/** Yalnız API çağrıları için başlık; MEDYA ADRESLERİNE başlık eklenmez (yukarıda ölçüldü). */
const API_BAŞLIK = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
  Accept: 'application/json, text/plain, */*',
};

/** Ortam AbortSignal.timeout desteklemiyorsa sinyalsiz devam eder. */
function zamanAşımı(ms) {
  try {
    return typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
      ? AbortSignal.timeout(ms)
      : undefined;
  } catch (_) {
    return undefined;
  }
}

async function jsonAl(adres, ms) {
  const yanıt = await fetch(adres, { headers: API_BAŞLIK, signal: zamanAşımı(ms) });
  if (!yanıt.ok) throw new Error(`HTTP ${yanıt.status}`);
  return await yanıt.json();
}

/** TMDB numarası → oynatıcının şifreli kimliği. Uç kapalıysa boş dizi. */
async function kimliğiŞifrele(tmdbId) {
  try {
    const veri = await jsonAl(UÇ.sifrele + encodeURIComponent(tmdbId), 6000);
    const sonuç = veri && typeof veri.result === 'string' ? veri.result.trim() : '';
    if (!sonuç) console.log(`${ETİKET} şifreleme ucu boş yanıt verdi`);
    return sonuç;
  } catch (hata) {
    console.log(`${ETİKET} şifreleme ucu ulaşılamadı: ${String(hata?.message || hata).slice(0, 60)}`);
    return '';
  }
}

function kaliteEtiketi(anahtar) {
  const yüksek = parseInt(String(anahtar).replace(/\D/g, ''), 10) || 0;
  if (yüksek >= 2160) return '4K';
  if (yüksek >= 1440) return '1440p';
  if (yüksek >= 1080) return '1080p';
  if (yüksek >= 720) return '720p';
  if (yüksek >= 480) return '480p';
  return '360p';
}

/**
 * stream.captions → oynatıcının { label, src } listesi.
 * 13 dil geliyor ve Türkçe bunların arasında DEĞİL; alt yazı menüsünü
 * yabancı dille doldurmamak için yalnız Türkçe/İngiliz parça bırakılır.
 * (Türkçe altyazı ihtiyacını uygulamanın kendi altyazı ucu karşılıyor.)
 */
function altyazılarıOku(captions) {
  if (!Array.isArray(captions)) return [];
  const listeler = [];
  for (const parça of captions) {
    const src = typeof parça?.url === 'string' ? parça.url : '';
    if (!src || !/\.(srt|vtt)(\?|#|$)/i.test(src)) continue;
    const dil = String(parça.language || parça.lang || parça.name || '').trim();
    const küçük = dil.toLowerCase();
    const yararlı = /turk|türk/i.test(küçük) || küçük.startsWith('i̇ngiliz') || küçük.includes('english');
    if (!yararlı) continue;
    listeler.push({ label: (dil || 'Altyazı').slice(0, 40), src });
    if (listeler.length >= 3) break;
  }
  return listeler;
}

/** Kalite adresini kabul edilir mi? (yalnız düz medya, iframe/embed değil) */
function medyaMı(adres) {
  return /^https?:\/\//i.test(adres)
    && /\.(mp4|m3u8|m4s|webm|mkv)(\?|#|$)/i.test(adres)
    && !/\/(embed|iframe|player|watch)\//i.test(adres);
}

/**
 * @param {string} kimlik  sayısal TMDB numarası (kayıt `kimlik:'tmdb'` bildirdi)
 * @param {string} tur     'movie' | 'tv' | 'series'
 */
async function getStreams(kimlik, tur = 'movie', season = 1, episode = 1) {
  const tmdbId = String(kimlik ?? '').trim();
  // Şifreleme ucu IMDb numarasıyla çalışmıyor (ölçüldü: "null"). Boş dönünce
  // vekil zaten sayısal TMDB numarasıyla ikinci denemeyi yapıyor.
  if (!/^\d{1,9}$/.test(tmdbId)) return [];

  const şifre = await kimliğiŞifrele(tmdbId);
  if (!şifre) return [];

  const dizi = tur === 'tv' || tur === 'series';
  const hedef = dizi
    ? `${UÇ.dizi}${encodeURIComponent(şifre)}/${Number(season) || 1}/${Number(episode) || 1}`
    : `${UÇ.film}${encodeURIComponent(şifre)}`;

  let veri = null;
  try {
    veri = await jsonAl(hedef, 9000);
  } catch (hata) {
    console.log(`${ETİKET} oynatıcı API yanıt vermedi: ${String(hata?.message || hata).slice(0, 60)}`);
    return [];
  }

  const akış = veri?.stream || veri?.data?.stream || null;
  if (!akış) return [];

  const altyazılar = altyazılarıOku(akış.captions);
  const çıktılar = [];
  const kaliteler = akış.qualities && typeof akış.qualities === 'object' ? akış.qualities : {};

  for (const [anahtar, değer] of Object.entries(kaliteler)) {
    const adres = typeof değer === 'string' ? değer : (değer && typeof değer.url === 'string' ? değer.url : '');
    if (!medyaMı(adres)) continue;
    const kalite = kaliteEtiketi(anahtar);
    çıktılar.push({
      url: adres,
      // "Altyazı" kelimesi bilerek etikette: hat yalnız altyazılı içerik
      // veriyor; işaret olmazsa derleyici yayını dublaj sekmesine atıyor.
      title: `Altyazı ${kalite}`,
      quality: kalite,
      format: /\.m3u8/i.test(adres) ? 'm3u8' : 'mp4',
      ...(altyazılar.length ? { subtitles: altyazılar } : {}),
    });
  }

  // Kalite listesi boş ama master playlist varsa onu tek yayın olarak ver.
  if (!çıktılar.length && medyaMı(String(akış.playlist || ''))) {
    çıktılar.push({
      url: akış.playlist,
      title: 'Altyazı 1080p',
      quality: '1080p',
      format: /\.m3u8/i.test(akış.playlist) ? 'm3u8' : 'mp4',
      ...(altyazılar.length ? { subtitles: altyazılar } : {}),
    });
  }

  // En yüksek kalite üste (derleyici sıralamayı yine de kendi yapar).
  çıktılar.sort((a, b) => (parseInt(b.quality, 10) || 0) - (parseInt(a.quality, 10) || 0));
  console.log(`${ETİKET} ${çıktılar.length} yayın · ${dizi ? `S${Number(season) || 1}E${Number(episode) || 1}` : 'film'} · ${altyazılar.length} altyazı parçası`);
  return çıktılar;
}

// Vendor çekirdekleriyle aynı kayıt mekanizması: vekil globalThis.getStreams'i
// yakalar, sonra eski haline döndürür.
if (typeof globalThis !== 'undefined') globalThis.getStreams = getStreams;
if (typeof global !== 'undefined') global.getStreams = getStreams;
if (typeof window !== 'undefined') window.getStreams = getStreams;
if (typeof module !== 'undefined' && module.exports) {
  try { module.exports = { getStreams }; } catch (_) { /* ESM ortamında yok sayılır */ }
}

export { getStreams };
export default getStreams;
