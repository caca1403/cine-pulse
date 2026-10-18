/* ==========================================================================
   CinePulse — "Bane" çekirdeği (birinci taraf, bağımlılıksız)
   --------------------------------------------------------------------------
   Ne yapıyor: Türkçe film sitesinin (rota: jet) aramasından filmi bulur,
   sayfadaki oynatıcı düğmelerini sunucu API'sinden geçırıp gömülü oynatıcıyı
   (videopark ailesi) canlı HLS'e çevirir. Yalnız FİLM — site 2026-10 ölçümünde
   dizi barındırmıyordu (dizi aramalarında tek kart dönmedi).

   Ölçülen gerçekler (2026-10-18, bu çekirdek yazılırken canlı doğrulandı):
     • GET {site}/arama?q=<metin> → HTML; kartlar
       <a href="…/film/<slug>" class="text-decoration-none" title="Ad Full Türkçe Dublaj İzle">
     • Film sayfası: name="film_id" value="<sayı>" + düğmelerde
       data-source-index / data-player-type ("dublaj"|"genel")
     • POST {site}/jetplayer  gövde "film_id=..&source_index=..&player_type=.."
       (X-Requested-With: XMLHttpRequest) → HTML içinde <iframe src=…>
     • videopark apollo: iframe'deki id ile POST https://videopark.top/apollo/get_video.php
       gövde "id=<id>" → JSON hlsUrl (göreli) → https://videopark.top/apollo/hls/<token>
       → #EXTM3U (okhttp/4.9.2 + Referer https://videopark.top/ ile) — canlı ölçüldü
     • Filmin dublaj düğme sayısı ölçülen: 7 dublaj + 2 genel → dublajlar ÖNCE denenir.
   ========================================================================== */

import { rotaYol, metinAl, jsonAl, tmdbBilgi, adayBasliklar, sadeles, kaliteEtiket, ilki } from '../ortakCekirdek.js';

const AD = 'Bane';
const ROTA = 'jet';
const VP = 'https://videopark.top';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const YAYIN_BASLIK = { 'User-Agent': 'okhttp/4.9.2', Accept: '*/*' };

const norm = s => sadeles(String(s || '')).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const kartAdi = s => norm(String(s || '')
  .replace(/\b(full|hd)\b/gi, ' ')
  .replace(/\b(türkçe dublaj|turkce dublaj|dublaj|altyazılı|altyazili)\b/gi, ' ')
  .replace(/\b(izle|film izle)\b/gi, ' '));
const eslesir = (a, b) => { const x = kartAdi(a), y = kartAdi(b); return x && y && (x === y || x.includes(y) || y.includes(x)); };

/* Yayın kabul kapısı: ölçülmüş tuzaklar elenir ("/e/" 403 tuzağı, boş sorgulu şablon). */
function yayinKabulMi(url) {
  if (/\/e\//.test(url)) return false;
  if (/[?&][A-Za-z_][\w.-]*=(&|$)/.test(url)) return false;
  return /\/apollo\/hls\//i.test(url) || /\.(m3u8|mp4)(\?|#|$)/i.test(url) || /master\.txt/i.test(url);
}

/* Canlı HLS'i indir: #EXTM3U dönerse kalite etiketiyle, yoksa null. */
async function yayinDogrula(url, referer) {
  const metin = await metinAl(url, { ms: 7000, basliklar: { ...YAYIN_BASLIK, Referer: referer } });
  if (!/#EXTM3U/.test(metin.slice(0, 200))) return null;
  return kaliteEtiket(metin);
}

/* Gömülü oynatıcı adresini canlı yayına çevirir (apollo / titan). */
async function oynaticiCoz(iframe) {
  if (/videopark\.top\/apollo\//i.test(iframe)) {
    const id = ilki(iframe, /[?&]id=([\w-]+)/);
    if (!id) return null;
    const j = await jsonAl(`${VP}/apollo/get_video.php`, {
      ref: `${VP}/apollo/`, ms: 8000,
      govde: `id=${encodeURIComponent(id)}`,
      basliklar: { 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': UA },
    });
    const hls = j?.hlsUrl;
    if (!hls) return null;
    const tam = /^https?:/i.test(hls) ? hls : `${VP}/apollo/${String(hls).replace(/^\.?\//, '')}`;
    if (!yayinKabulMi(tam)) return null;
    const kalite = await yayinDogrula(tam, `${VP}/`);
    return kalite == null ? null : { url: tam, kalite };
  }
  if (/videopark\.top\/titan\//i.test(iframe)) {
    const ham = await metinAl(iframe, { ref: iframe, ms: 9000, basliklar: { 'User-Agent': UA } });
    const jsonHam = ilki(ham, /var\s+_sd\s*=\s*(\{[\s\S]*?\});/);
    if (!jsonHam) return null;
    let sd = null;
    try { sd = JSON.parse(jsonHam); } catch (_) { return null; }
    const url = sd?.stream_url;
    if (!url || !yayinKabulMi(String(url))) return null;
    const kalite = await yayinDogrula(String(url), `${VP}/`);
    return kalite == null ? null : { url: String(url), kalite };
  }
  return null;
}

/* Sitede filmi ara: aday başlıklarla, kart başlığı + tür kapısıyla. */
async function filmBul(adaylar, site) {
  for (const soru of adaylar.slice(0, 3)) {
    const ham = await metinAl(rotaYol(ROTA, '/arama', { q: soru }), { ref: `${site}/`, ms: 8000, basliklar: { 'User-Agent': UA } });
    const kartlar = [...ham.matchAll(/<a[^>]*href="(https?:\/\/[^"]*\/film\/[a-z0-9-]+)"[^>]*title="([^"]*)"/gi)];
    const isabet = kartlar.find(([, , ad]) => adaylar.some(a => eslesir(ad, a)));
    if (isabet) return isabet[1];
  }
  return '';
}

export async function getStreams(kimlik, tur = 'movie') {
  if (tur !== 'movie') return []; // site yalnız film barındırıyor (ölçüldü 2026-10-18)
  const site = 'https://jetfilmizle.now';
  const bilgi = await tmdbBilgi(kimlik, 'movie');
  const adaylar = bilgi ? adayBasliklar(bilgi) : [];
  const filmSayfa = await filmBul(adaylar, site);
  if (!filmSayfa) return [];

  const ham = await metinAl(filmSayfa, { ref: `${site}/`, ms: 9000, basliklar: { 'User-Agent': UA } });
  const filmNo = ilki(ham, /name="film_id"\s+value="(\d+)"/);
  if (!filmNo) return [];

  /* Düğmeleri topla: {index, tip}; dublajlar önce, aynı index+tip tekilleştirilir. */
  const dugmeler = [];
  const gorulen = new Set();
  for (const m of ham.matchAll(/<button\b[\s\S]{0,600}?player-source-btn[\s\S]{0,600}?>/g)) {
    const etiket = m[0];
    const index = ilki(etiket, /data-source-index="(\d+)"/);
    if (!index) continue;
    const tip = (ilki(etiket, /data-player-type="([^"]*)"/i) || 'genel').toLowerCase();
    const anahtar = `${tip}:${index}`;
    if (gorulen.has(anahtar)) continue;
    gorulen.add(anahtar);
    dugmeler.push({ index, tip });
  }
  dugmeler.sort((a, b) => (a.tip === 'dublaj' ? -1 : 0) - (b.tip === 'dublaj' ? -1 : 0));

  const sonuc = [];
  for (const d of dugmeler.slice(0, 4)) {
    let iframe = '';
    try {
      const yanit = await fetch(`${site}/jetplayer`, {
        method: 'POST',
        headers: {
          'User-Agent': UA,
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: '*/*',
          Referer: filmSayfa,
        },
        body: `film_id=${filmNo}&source_index=${d.index}&player_type=${encodeURIComponent(d.tip)}`,
      });
      iframe = ilki(yanit.ok ? await yanit.text() : '', /<iframe\b[^>]*src=['"]([^'"]+)['"]/i);
    } catch (_) { continue; }
    if (!iframe) continue;
    const bulundu = await oynaticiCoz(iframe);
    if (bulundu) {
      sonuc.push({
        name: AD,
        title: `${AD} ${bulundu.kalite || '1080p'} ${d.tip === 'dublaj' ? 'Dublaj' : 'Sunucu'}`,
        url: bulundu.url,
        quality: bulundu.kalite || '1080p',
        format: 'm3u8',
        headers: { ...YAYIN_BASLIK, Referer: `${VP}/` },
      });
      if (sonuc.length >= 3) break;
    }
  }
  return sonuc;
}

if (typeof globalThis !== 'undefined') globalThis.getStreams = getStreams;
export default getStreams;
