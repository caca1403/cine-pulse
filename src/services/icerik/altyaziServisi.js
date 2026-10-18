/* ==========================================================================
   CinePulse Studio — ALTYAZI SERVİSİ (hemer platform)
   --------------------------------------------------------------------------
   NEDEN BURADA (ölçülen, 2026-10-17): altyazı tamamen sunucu yoluna
   (`/api/subtitles`) bağlıydı. Masaüstünde o yol var; ANDROID'de cihaz içi ağ
   geçidi (`NativeMediaGateway`) yalnız belirli rotaları tanıyor ve
   `/api/subtitles` onlarda YOK → 501 `native-route-unavailable`. Sonuç:
   telefondaki kaynakların neredeyse hepsinde altyazı KAPALI kalıyordu.
   Ayrıca native (Media3) oynatıcıya altyazı hiç aktarılmıyordu.

   ÇÖZÜM: altyazı, tarayıcıdan (WebView) DOĞRUDAN çözülür. OpenSubtitles v3
   (Stremio) ucu CORS'a açık (`Access-Control-Allow-Origin: *`) ve dosyaları
   UTF-8 hazır veriyor. SRT→WebVTT dönüşümü burada yapılır; metin olduğu gibi
   native oynatıcıya verilir (cihaz dosyaya yazıp yükler). Böylece aynı kod
   masaüstünde ve telefonda çalışır, sunucuya bağımlılık kalkar.

   Seçim sırası: Türkçe → İngilizce ("normal"). Altyazı YOKSA arayüz düz
   başlık/uyarı gösterir; asla yanlış dil zorlanmaz.
   ========================================================================== */

const OS_V3 = 'https://opensubtitles-v3.strem.io';
/* Aynı içerik için tekrar tekrar uca gitmeyelim: kaynak listesi önbelleği. */
const kaynakOnbellek = new Map();
const metinOnbellek = new Map();

/** "tt1234567" ya da gömülü imdb kimliğini ayıklar. */
export function imdbKimligi(deger) {
  const m = String(deger || '').match(/tt\d{6,9}/i);
  return m ? m[0].toLowerCase() : '';
}

/**
 * SRT → WebVTT. Native oynatıcı (Media3) WebVTT'yi her sürümde çözer; SRT
 * için ayrı çözücü sınıfının derlemede olması gerekir. Dönüştürmek riski
 * tamamen kaldırır.
 */
export function srtToVtt(ham) {
  let metin = String(ham || '').replace(/^\uFEFF/, '');
  if (/^\s*WEBVTT/i.test(metin)) return metin;
  metin = metin.replace(/\r\n|\r/g, '\n');
  // Zaman damgası: 00:00:46,920 → 00:00:46.920 (saat eksikse ekle)
  const satirlar = metin.split('\n');
  const cikti = [];
  let zamanSayaci = 0;
  for (let i = 0; i < satirlar.length; i++) {
    const satir = satirlar[i];
    const zaman = satir.match(/^\s*(\d{1,2}:)?(\d{2}):(\d{2})[,.](\d{1,3})\s*-->\s*(\d{1,2}:)?(\d{2}):(\d{2})[,.](\d{1,3})(.*)$/);
    if (zaman) {
      const bas = `${zaman[1] || '00:'}${zaman[2]}:${zaman[3]}.${(zaman[4] + '00').slice(0, 3)}`;
      const son = `${zaman[5] || '00:'}${zaman[6]}:${zaman[7]}.${(zaman[8] + '00').slice(0, 3)}`;
      cikti.push(`${zamanSayaci++}`);
      cikti.push(`${bas} --> ${son}${zaman[9] || ''}`);
      continue;
    }
    // SRT sıra numarası: içeriğin kendisiyle karışmasın diye sadece
    // zaman damgasından hemen önce gelen boş-satır sırası atılır.
    if (/^\s*\d+\s*$/.test(satir) && /^\s*\d{1,2}:?\d{0,2}:?\d{2}[,.]\d{1,3}\s*-->/.test(satirlar[i + 1] || '')) continue;
    cikti.push(satir.replace(/\{\\?an\d+\}/gi, '').replace(/<\/?font[^>]*>/gi, ''));
  }
  return `WEBVTT\n\n${cikti.join('\n')}`;
}

function dilEtiketi(kod, sira) {
  if (kod === 'tr') return sira === 0 ? 'Türkçe' : `Türkçe (${sira + 1})`;
  if (kod === 'en') return sira === 0 ? 'İngilizce (normal)' : `İngilizce (${sira + 1})`;
  return kod;
}

/**
 * İçerik için altyazı kaynaklarını bulur (Türkçe önce, sonra İngilizce).
 * @returns {Promise<Array<{etiket:string,dil:string,url:string}>>}
 */
export async function altyaziKaynaklariniBul({ imdbId, tmdbId, type = 'movie', season = 1, episode = 1, timeoutMs = 4200 } = {}) {
  const imdb = imdbKimligi(imdbId);
  const anahtar = `v1:${type}:${imdb || ('tmdb' + tmdbId)}:${season}:${episode}`;
  if (kaynakOnbellek.has(anahtar)) return kaynakOnbellek.get(anahtar);
  if (!imdb) return []; // v3 ucu imdb kimliği ister

  const istek = type === 'tv'
    ? `${OS_V3}/subtitles/series/${imdb}:${season}:${episode}.json`
    : `${OS_V3}/subtitles/movie/${imdb}.json`;
  try {
    const res = await fetch(istek, { signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return [];
    const veri = await res.json();
    const hepsi = Array.isArray(veri?.subtitles) ? veri.subtitles.filter(s => s?.url) : [];
    if (!hepsi.length) return [];
    // Aynı dilde en çok indirilen (g) önce; bunlar genelde daha doğru zamanlı.
    const sirali = kod => hepsi
      .filter(s => String(s.lang || '').toLowerCase() === kod)
      .sort((a, b) => (Number(b.g || 0) - Number(a.g || 0)) || (Number(b.id || 0) - Number(a.id || 0)));
    const liste = [
      ...sirali('tur').slice(0, 3).map((s, i) => ({ etiket: dilEtiketi('tr', i), dil: 'tr', url: s.url })),
      ...sirali('eng').slice(0, 2).map((s, i) => ({ etiket: dilEtiketi('en', i), dil: 'en', url: s.url }))
    ];
    if (liste.length) kaynakOnbellek.set(anahtar, liste);
    return liste;
  } catch (_) {
    return [];
  }
}

/** Bir altyazı kaynağını indirir ve WebVTT metnine çevirir. */
export async function altyaziVttMetni(kaynak, timeoutMs = 5000) {
  if (!kaynak?.url) return null;
  if (metinOnbellek.has(kaynak.url)) return metinOnbellek.get(kaynak.url);
  try {
    const res = await fetch(kaynak.url, { signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return null;
    const ham = await res.text();
    if (!ham || ham.length < 16) return null;
    const vtt = srtToVtt(ham);
    metinOnbellek.set(kaynak.url, vtt);
    return vtt;
  } catch (_) {
    return null;
  }
}

/**
 * Native oynatıcıya verilecek altyazı listesi: kaynakları bulur ve ilk
 * `enFazla` tanesini indirip VTT metniyle döner.
 * @returns {Promise<Array<{etiket:string,dil:string,vtt:string}>>}
 */
export async function nativeAltyazilariHazirla(icerik, { enFazla = 2, timeoutMs = 4500 } = {}) {
  try {
    const kaynaklar = await altyaziKaynaklariniBul(icerik);
    if (!kaynaklar.length) return [];
    const secilen = kaynaklar.slice(0, enFazla);
    const metinler = await Promise.all(secilen.map(k => altyaziVttMetni(k, timeoutMs)));
    return secilen
      .map((k, i) => (metinler[i] ? { etiket: k.etiket, dil: k.dil, vtt: metinler[i] } : null))
      .filter(Boolean);
  } catch (_) {
    return [];
  }
}

export function altyaziOnbelleginiTemizle() {
  kaynakOnbellek.clear();
  metinOnbellek.clear();
}
