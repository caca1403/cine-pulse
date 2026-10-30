/* ==========================================================================
   CinePulse — "Spectre" çekirdeği (birinci taraf) — FilmMakinesi ailesi
   --------------------------------------------------------------------------
   NEDEN AYRI ÇEKİRDEK: site Cloudflare JS challenge arkasında; düz fetch 403
   döner. Ama CİHAZIN KENDİSİ challenge'ı geçiyor (gizli WebView + CapacitorHttp
   cookie jar) — bu yüzden okuma `fetchTextWithSession` üzerinden yapılır:
   çerez oturumu yoksa WebView'de çözülür, sonra native HTTP ile sayfa okunur.

   Ölçülen zincir (2026-10-29, cihazda uçtan uca doğrulandı):
     • Arama: GET {site}/arama/?s=<metin>  → /film/<slug>/ veya /dizi/<slug>/
     • Dizi bölüm: {site}/dizi/<slug>/sezon-<S>/bolum-<E>/
     • İçerik sayfası → iframe: closeload.<site>/video/embed/<id>/?imdb_id=tt…
     • Embed sayfası: jwplayer sources:[{file: <degisken>, type:"hls"}] ve
       <degisken> = <cozucu>("…".split("|")) — çözücü anahtarı
       window.location.hostname'e BAĞLI (yanlış host = bozuk çıktı).
     • Çözülen master m3u8 → HTTP 200, #EXTM3U, TYPE=AUDIO NAME="Turkish".
   ========================================================================== */

import { tmdbBilgi, adayBasliklar, sadeles, yilUyar } from '../ortakCekirdek.js';

const AD = 'Spectre';
const SITE = 'https://www.filmmakinesi.to';
const EMBED_HOST = 'closeload.filmmakinesi.to';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

/* ── Okuma: önce cihaz oturumu (CF), sonra düz fetch yedeği ─────────────── */
async function oku(url, { ref = SITE + '/', ms = 12000 } = {}) {
  const hata = (n, e) => { if (globalThis.__cpSpectreIzle) (globalThis.__cpSpectreHata ||= []).push([n, String(e && (e.message || e)).slice(0, 120)]); };
  // 1) CİHAZ NATİF HTTP (CapacitorHttp): çerez kavanozu WebView ile ORTAK —
  //    challenge bir kez çözüldüyse clearance çerezi burada da geçerlidir.
  //    Doğrudan kullanılır; araya oturum sarmalayıcı girmesi (challenge adımı,
  //    UA dayatması) filmmakinesi/dizibox okumasını sessizce 0 bayta düşürüyordu.
  try {
    const http = (typeof window !== 'undefined' && window.Capacitor?.Plugins?.CapacitorHttp) || null;
    if (http) {
      // UA: cihazın GERÇEK UA'sı — masaüstü Chrome UA'sı bu sitede CF tarafından
      // 403'leniyor (TLS/JA3 ile UA uyuşmuyor). Ölçüldü 2026-10-29.
      const cihazUA = (typeof navigator !== 'undefined' && navigator.userAgent) || UA;
      const r = await http.get({
        url,
        headers: { 'User-Agent': cihazUA, Accept: 'text/html,application/xhtml+xml,*/*', Referer: ref },
        responseType: 'text',
        connectTimeout: 8000,
        readTimeout: ms,
      });
      const metin = typeof r?.data === 'string' ? r.data : '';
      if (metin && !/just a moment|verifying you are human/i.test(metin.slice(0, 4000))) return metin;
      hata('native-bos', r?.status);
    }
  } catch (e) { hata('native-hata', e); }
  // 2) Challenge çözücü sarmalayıcısı (gerekirse WebView'de çerez üretir)
  try {
    const { fetchTextWithSession } = await import('../../services/platform/androidChallengeSolver.js');
    const c = await fetchTextWithSession(url, { referer: ref, timeoutMs: ms, headers: { 'User-Agent': UA } });
    if (c?.text) return c.text;
    hata('oturum-bos', c ? `status=${c.status}` : 'null');
  } catch (e) { hata('oturum-hata', e); }
  // 3) Düz fetch (web/masaüstü)
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'text/html,*/*', Referer: ref },
      signal: typeof AbortSignal?.timeout === 'function' ? AbortSignal.timeout(ms) : undefined,
    });
    if (!r.ok) { hata('fetch-durum', r.status); return ''; }
    return await r.text();
  } catch (e) {
    hata('fetch-hata', e);
    return '';
  }
}

/* Oturum önbelleği: aynı içerik/bölüm için çekirdek birden çok kez çağrılıyor
   (dublaj+altyazı kategorileri, yeniden tarama). Master adresi her istekte YENİ
   imza taşıdığı için satır kimliği değişip liste şişiyordu (aynı kaynak 2 kez).
   15 dk'lık bellek önbelleği tek satırı ve tekrar kullanımı garanti eder. */
const ONBELLEK = new Map();
const ONBELLEK_MS = 15 * 60 * 1000;
/* Uçan istek birleştirme: vekil dublaj/altyazı kategorilerini PARALEL çağırıyor;
   ikisi de önbellek boşken aynı zinciri başlatıp iki satır üretiyordu. Aynı
   anahtar için tek Promise paylaşılır. */
const UCAN = new Map();

const norm = (s) => sadeles(String(s || '')).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

/* ── Arama sonucu: tip + başlık + yıl kapısı ────────────────────────────── */
function kartSec(html, adaylar, isFilm, yil) {
  const kalip = isFilm ? /href="(\/film\/[^"]+)"/g : /href="(\/dizi\/[^"]+)"/g;
  const gorulen = new Set();
  for (const m of String(html).matchAll(kalip)) {
    const yol = m[1];
    if (gorulen.has(yol)) continue;
    gorulen.add(yol);
    const slug = norm(decodeURIComponent(yol.split('/').filter(Boolean).pop() || ''));
    const baslik = slug.replace(/\b(izle|izlesene|full|hd|fm[a-z0-9]+|\d{4})\b/g, ' ').replace(/\s+/g, ' ').trim();
    const esles = adaylar.some((a) => {
      const x = norm(a);
      if (!x) return false;
      return baslik.includes(x) || x.includes(baslik) || baslik.split(' ').slice(0, 4).join(' ').includes(x);
    });
    if (!esles) continue;
    // Yıl kapısı: slug'da 4 haneli yıl varsa ±1 tolerans
    const slugYil = (slug.match(/\b(19|20)\d{2}\b/) || [])[0];
    if (yil && slugYil && !yilUyar(Number(slugYil), yil)) continue;
    return yol;
  }
  return null;
}

/* ── Embed sayfasındaki gizli master adresini çöz ─────────────────────────
   Sayfa her istekte değişken adlar üretiyor: `var <d> = <cozucu>("a|b|c".split("|"))`
   ve jwplayer `sources:[{file: <d>}]`. Çözücü webe özgü; burada Function ile
   çalıştırılır (yalnız yerel metin; ağ yok). */
function embedCoz(html) {
  const iz = (n, d) => { if (globalThis.__cpSpectreIzle) (globalThis.__cpEmbedIz ||= []).push([n, d]); };
  const kaynak = html.match(/sources:\s*\[\{file:\s*(\w+)/);
  iz('kaynak', kaynak ? kaynak[1] : null);
  if (!kaynak) return '';
  const degisken = kaynak[1];
  const tanim = html.match(new RegExp(`(?:var\\s+)?${degisken}\\s*=\\s*(\\w+)\\(([\\s\\S]*?)\\);`));
  iz('tanim', tanim ? tanim[1] : null);
  if (!tanim) return '';
  const cozucuAd = tanim[1];
  let bas = html.search(new RegExp(`function\\s+${cozucuAd}\\s*\\(`));
  if (bas < 0) bas = html.search(new RegExp(`${cozucuAd}\\s*=\\s*function\\s*\\(`));
  if (bas < 0) return '';
  // gövde kapanışını süslü parantez sayarak bul
  let derinlik = 0, j = html.indexOf('{', bas), son = -1;
  for (; j < html.length; j++) {
    if (html[j] === '{') derinlik++;
    else if (html[j] === '}') { derinlik--; if (derinlik === 0) { son = j; break; } }
  }
  iz('cozucu', { ad: cozucuAd, bas, son });
  if (son < 0) return '';
  const cozucuKod = html.slice(bas, son + 1);
  try {
    // Çözücü anahtarı `window.location.hostname`e BAĞLI. Bu yüzden sandbox'a
    // hem window hem location hem belge/navigator verilir; çıplak `location`
    // kullanan varyantlar da doğru anahtarla çalışsın.
    const konum = { hostname: EMBED_HOST, host: EMBED_HOST, origin: `https://${EMBED_HOST}`, href: `https://${EMBED_HOST}/`, protocol: 'https:' };
    const sahteWindow = { location: konum, navigator: { userAgent: UA }, atob: null, btoa: null };
    sahteWindow.window = sahteWindow;
    sahteWindow.self = sahteWindow;
    sahteWindow.document = { createElement: () => ({ style: {}, setAttribute() {}, appendChild() {} }), cookie: '' };
    const atobFn = (x) => (typeof atob === 'function' ? atob(String(x)) : '');
    const btoaFn = (x) => (typeof btoa === 'function' ? btoa(String(x)) : '');
    sahteWindow.atob = atobFn;
    sahteWindow.btoa = btoaFn;
    const fn = new Function('window', 'location', 'document', 'navigator', 'self', 'atob', 'btoa',
      `${cozucuKod}\n; return (${cozucuAd})(${tanim[2]});`);
    let cikti = String(fn(sahteWindow, konum, sahteWindow.document, sahteWindow.navigator, sahteWindow, atobFn, btoaFn) || '').trim();
    iz('cikti', cikti.slice(0, 140));
    if (cikti && !/^https?:/i.test(cikti)) {
      try {
        const cozulmus = atobFn(cikti);
        const j = JSON.parse(cozulmus);
        if (j && typeof j === 'object') cikti = String(j.s || j.file || j.url || cikti);
      } catch (_) {
        try {
          const j = JSON.parse(cikti);
          if (j && typeof j === 'object') cikti = String(j.s || j.file || j.url || cikti);
        } catch (__) {}
      }
    }
    return /^https?:/i.test(cikti) ? cikti : '';
  } catch (e) {
    iz('hata', String(e && (e.message || e)).slice(0, 160));
    return '';
  }
}

/* ── Master m3u8'den Türkçe ses/altyazı kanıtı ──────────────────────────── */
async function dilKaniti(masterUrl) {
  const metin = await oku(masterUrl, { ref: `https://${EMBED_HOST}/`, ms: 9000 });
  if (!/#EXTM3U/.test(metin)) return { extm3u: false };
  const satirlar = metin.split('\n').filter((s) => /#EXT-X-MEDIA/i.test(s));
  const trSes = satirlar.some((s) => /TYPE=AUDIO/i.test(s) && /(?:LANGUAGE="?(?:tr|tur)"?|NAME="[^"]*t[uü]rk)/i.test(s));
  const trAltyazi = satirlar.some((s) => /TYPE=SUBTITLES/i.test(s) && /(?:LANGUAGE="?(?:tr|tur)"?|NAME="[^"]*t[uü]rk)/i.test(s));
  const sesSayisi = satirlar.filter((s) => /TYPE=AUDIO/i.test(s)).length;
  return { extm3u: true, trSes, trAltyazi, sesSayisi };
}

export async function getStreams(kimlik, tur = 'movie', sezon = 1, bolum = 1) {
  const iz = [];
  const kaydet = (ad, deger) => { iz.push([ad, deger]); if (globalThis.__cpSpectreIzle) globalThis.__cpSpectreIz = iz; };
  // KİMLİK: vekil bazen nesne ({tmdbId, imdbId}) bazen düz kimlik geçer —
  // tmdbBilgi tek değer bekler. Sayısal TMDB önce (daha hızlı), yoksa tt…
  const kim = (kimlik && typeof kimlik === 'object')
    ? (kimlik.tmdbId || kimlik.id || kimlik.imdbId || kimlik.imdb || '')
    : kimlik;
  const bilgi = await tmdbBilgi(kim, tur);
  kaydet('tmdbBilgi', bilgi ? { ad: bilgi.baslik, orijinal: bilgi.orijinal, yil: bilgi.yil } : null);
  const adaylar = bilgi ? adayBasliklar(bilgi) : [];
  if (!adaylar.length) return [];
  const isFilm = tur !== 'tv';
  const yil = bilgi?.yil || 0;
  // ÖNBELLEK ANAHTARI İÇERİK KİMLİĞİ ÜZERİNDEN: vekil aynı çekirdeği hem sayısal
  // TMDB hem tt… kimliğiyle çağırabiliyor (dublaj/altyazı kategorileri). Anahtar
  // kimliğe bağlı kalırsa iki zincir bağımsız koşup AYNI kaynağı iki kez üretiyor.
  const anahtar = `${tur}:${(bilgi?.baslik || kim)}:${bilgi?.yil || 0}:${+sezon || 1}:${+bolum || 1}`;
  const hazir = ONBELLEK.get(anahtar);
  if (hazir && Date.now() - hazir.t < ONBELLEK_MS) return hazir.sonuc;
  if (UCAN.has(anahtar)) return UCAN.get(anahtar);

  const is = (async () => {
  /* 1) arama */
  let yol = null;
  for (const soru of adaylar.slice(0, 2)) {
    let html = await oku(`${SITE}/arama/?s=${encodeURIComponent(soru)}`);
    yol = html ? kartSec(html, adaylar, isFilm, yil) : null;
    // CapacitorHttp bazen yalnız /film/ sonuçlarını veya yarım sayfa döndürürse
    // (ölçüldü: 18 KB vs 24 KB) bir kez yeniden dene.
    if (!yol) {
      html = await oku(`${SITE}/arama/?s=${encodeURIComponent(soru)}`);
      yol = html ? kartSec(html, adaylar, isFilm, yil) : null;
    }
    kaydet('aramaHam', { soru, boyut: html.length });
    if (yol) break;
  }
  kaydet('arama', { yol });
  if (!yol) return [];

  /* 2) içerik/ bölüm sayfası → embed */
  const sayfaUrl = isFilm
    ? `${SITE}${yol}`
    : `${SITE}${yol.replace(/\/$/, '')}/sezon-${+sezon || 1}/bolum-${+bolum || 1}/`;
  const sayfa = await oku(sayfaUrl, { ref: `${SITE}/` });
  kaydet('icerikSayfa', { sayfaUrl, boyut: sayfa.length });
  if (!sayfa) return [];
  const embed = [...new Set([...sayfa.matchAll(new RegExp(`${EMBED_HOST.replace(/\./g, '\\.')}\\/video\\/embed\\/[^"'\\\\\\s<]+`, 'g'))].map((m) => m[0]))][0];
  kaydet('embed', embed || null);
  if (!embed) return [];

  /* 3) embed → master m3u8 */
  const embedUrl = `https://${embed}`;
  const embedHtml = await oku(embedUrl, { ref: sayfaUrl, ms: 14000 });
  kaydet('embedSayfa', { embedUrl, boyut: embedHtml.length });
  if (!embedHtml) return [];
  const master = embedCoz(embedHtml);
  kaydet('master', master ? master.slice(0, 120) : '');

  /* 4) kanıt: etiket UYDURULMAZ — TR ses varsa "Türkçe Dublaj" yazılır */
  const kanit = master ? await dilKaniti(master) : { extm3u: false };
  const dublajMi = Boolean(kanit.trSes);
  const altyaziMi = Boolean(kanit.trAltyazi) && !dublajMi;
  const etiket = dublajMi ? 'Türkçe Dublaj' : (altyaziMi ? 'TR Altyazı' : (kanit.extm3u ? 'Orijinal' : 'Dublaj?'));
  // Kalite: yalnız STANDART etiketler ("100p" gibi yanlış eşleşme olmasın).
  const kaliteEs = embedHtml.match(/\b(2160p|1440p|1080p|720p|480p|360p)\b/i);
  const kalite = kaliteEs ? kaliteEs[1].toLowerCase() : '1080p';

  const sonuc = [];
  if (master) {
    sonuc.push({
      name: AD,
      title: `${AD} · ${kalite} · ${etiket}${kanit.sesSayisi > 1 ? ` · ${kanit.sesSayisi} Ses` : ''}`,
      url: master,
      quality: kalite,
      format: 'm3u8',
      isM3u8: true,
      // BAŞLIK VAR ama KÖPRÜ YOK: master imzalı (`?s=…`) ve imza cihazın kendi
      // isteğiyle üretiliyor; CDN segmentleri Referer istiyor. Köprüye
      // (/api/hls_proxy) sarılırsa kaynak SUNUCU IP'sinden çekilir → CDN 403 →
      // "seçili hat yanıt vermedi". proxyGerekmez ile başlıklar oynatıcıya
      // taşınır, istek cihazın kendisinden gider.
      headers: { 'User-Agent': UA, Referer: `https://${EMBED_HOST}/` },
      proxyGerekmez: true,
    });
  }
  // BOŞ SONUÇ ÖNBELLEĞE YAZILMAZ: bir kez başarısız olan zincir 15 dk boyunca
  // "kaynak yok" gibi görünüyordu (ölçüldü: geçici embed hatası tüm bölümü kilitledi).
  if (sonuc.length) ONBELLEK.set(anahtar, { t: Date.now(), sonuc });
  if (ONBELLEK.size > 200) ONBELLEK.delete(ONBELLEK.keys().next().value);
  return sonuc;
  })();
  UCAN.set(anahtar, is);
  try { return await is; } finally { UCAN.delete(anahtar); }
}

if (typeof globalThis !== 'undefined') {
  globalThis.getStreams = getStreams;
  // Teşhis kancası: cihazda `window.__cpSpectre(kimlik, tur, S, B)` ile
  // zincirin hangi adımında durduğu görülebilir (üretim akışını değiştirmez).
  globalThis.__cpSpectre = getStreams;
}
export default getStreams;
