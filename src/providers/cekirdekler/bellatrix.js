/* ==========================================================================
   CinePulse — "Bellatrix" çekirdeği (birinci taraf, bağımlılıksız)
   --------------------------------------------------------------------------
   Ne yapıyor: sitenin kendi JSON arama ucundan (rota: hfd) film/dizi bulur,
   sayfadaki "videoUrl" oynatıcısını (vixolity ailesi) SAF metin çözümüyle
   canlı yayına çevirir; "contentUrl" adresleri sitenin kendi sunucusundan
   doğrudan verilir. IFRAME YOK, üçüncü taraf kod YÜRÜTÜLMEZ.

   Ölçülen gerçekler (2026-10-18, bu çekirdek yazılırken canlı doğrulandı):
     • GET {site}/api/search?q=<metin> → JSON {results[], series[]};
       kart {baslik, orijinalBaslik, slug, yayinYili, imdbId, dublajDurumu}
     • Film sayfası /film/{slug}: Next.js yığınında "videoUrl" (vixolity
       gömülüsü) ve "contentUrl" (/vids/<slug>_<sure>.mp4)
     • Dizi detayı /api/dizi/{slug} → seasons[].sezonNo / episodes[].bolumNo
       — S/E KESİN eşleşmezse kaynak ÜRETİLMEZ
     • vixolity config `}('<hex>',<k>)`: hex→bayt→ters→base64→(bayt−k);
       çıkan `file` uzantısız ama #EXTM3U dönen HLS'tir (eski ölçüm)
     • /vids/ adresleri okhttp UA'sına 404 döner → tarayıcı UA; vixolity
       m3u8'i okhttp ile 200 (eski ölçüm) — başlıklar buna göre verilir
   ========================================================================== */

import { rotaYol, metinAl, jsonAl, tmdbBilgi, adayBasliklar, sadeles } from '../ortakCekirdek.js';
import { b64Kaydir } from '../kodCozler.js';

const AD = 'Bellatrix';
const ROTA = 'hfd';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const YAYIN_BASLIK = { 'User-Agent': 'okhttp/4.9.2', Accept: '*/*' };

const norm = s => sadeles(String(s || '')).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const kartAdi = s => norm(String(s || '').replace(/\b(full|hd)\b/gi, ' '));
const eslesir = (a, b) => { const x = kartAdi(a), y = kartAdi(b); return x && y && (x === y || x.includes(y) || y.includes(x)); };

/* vixolity config: hex→bayt→ters→base64→kaydır; içinden çıkan URL'ler. */
function vixAdresleri(html) {
  const bulunan = [];
  for (const m of String(html || '').matchAll(/\}\)\('([0-9a-fA-F]{16,})',(\d+)\)/g)) {
    try {
      let ham = '';
      for (let i = 0; i + 1 < m[1].length; i += 2) ham += String.fromCharCode(parseInt(m[1].substr(i, 2), 16));
      const b64 = ham.split('').reverse().join('');
      const kaydir = b64Kaydir(b64);
      const k = +m[2] || 0;
      let kod = '';
      for (let i = 0; i < kaydir.length; i++) kod += String.fromCharCode(((kaydir.charCodeAt(i) - k) % 256 + 256) % 256);
      const temiz = kod.replace(/\\x([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
      for (const u of temiz.matchAll(/https?:\/\/[^'"\s<>\\]+/g)) bulunan.push(u[0]);
    } catch (_) { /* çözülmezse aday elenir */ }
  }
  return [...new Set(bulunan)];
}

/* Yayın tipi: uzantı kanıtı veya ölçülmüş vixolity /vs/ deseni. */
function yayinTipi(url) {
  const u = String(url || '');
  if (/\.m3u8(\?|#|$)/i.test(u) || /vixolity\.[a-z]+\/vs\//i.test(u)) return 'm3u8';
  if (/\.mp4(\?|#|$)/i.test(u)) return 'mp4';
  return '';
}

/* Gömülü oynatıcı adresini canlı yayın候选ına çevir. */
async function oynaticiCoz(embed, referer) {
  if (!/^https?:\/\//i.test(embed) || /youtube/i.test(embed)) return null;
  const html = await metinAl(embed, { ref: referer, ms: 8000, basliklar: { 'User-Agent': UA } });
  if (!html) return null;
  for (const u of vixAdresleri(html).slice(0, 2)) {
    const tip = yayinTipi(u);
    if (tip) return { url: u, format: tip };
  }
  return null;
}

/* JSON aramasından S/E-uygun kartı seç: imdb/başlık + yıl kapısı. */
function kartSec(liste, adaylar, yil) {
  for (const x of Array.isArray(liste) ? liste : []) {
    const basliklar = [x?.baslik, x?.orijinalBaslik].filter(Boolean);
    if (!basliklar.some(b => adaylar.some(a => eslesir(a, b)))) continue;
    const kartYil = +(x?.yayinYili || x?.yil || 0);
    if (yil && kartYil && Math.abs(kartYil - yil) > 1) continue;
    if (x?.slug) return x;
  }
  return null;
}

export async function getStreams(kimlik, tur = 'movie', sezon = 1, bolum = 1) {
  const bilgi = await tmdbBilgi(kimlik, tur);
  const adaylar = bilgi ? adayBasliklar(bilgi) : [];
  if (!adaylar.length) return [];
  const isFilm = tur !== 'tv';

  /* 1. arama: özgün başlık önce; sonuç tipine göre results/series taranır. */
  let kart = null;
  for (const soru of adaylar.slice(0, 2)) {
    const j = await jsonAl(rotaYol(ROTA, '/api/search', { q: soru }), { ms: 8000, basliklar: { 'User-Agent': UA } });
    if (!j) continue;
    kart = isFilm ? kartSec(j.results, adaylar, bilgi?.yil) : kartSec(j.series, adaylar, bilgi?.yil);
    if (kart) break;
  }
  if (!kart) return [];

  /* 2. içerik sayfası; dizide S/E YOKSA kaynak üretilmez (katı eşleşme). */
  let icerikUrl = rotaYol(ROTA, isFilm ? `/film/${kart.slug}` : `/dizi/${kart.slug}/${+sezon || 1}/${+bolum || 1}`);
  if (!isFilm) {
    const detay = await jsonAl(rotaYol(ROTA, `/api/dizi/${kart.slug}`), { ms: 8000, basliklar: { 'User-Agent': UA } });
    const ep = ((detay?.seasons || []).find(x => +x?.sezonNo === (+sezon || 1))?.episodes || [])
      .find(x => +x?.bolumNo === (+bolum || 1));
    if (!ep) return [];
  }
  const ham = await metinAl(icerikUrl, { ref: `${rotaYol(ROTA)}/`, ms: 9000, basliklar: { 'User-Agent': UA } });
  if (!ham) return [];
  const saf = ham.replace(/\\(["'\\/])/g, '$1'); // Next.js kaçışlarını sadeleştir

  /* 3. oynatıcılar: gömülüler çöz, site sunucusu dosyaları olduğu gibi al. */
  const dublaj = /dublaj/i.test(String(kart.dublajDurumu || ''));
  const sonuc = [];
  const gorulen = new Set();
  const ekle = (url, format, referer, vixKok) => {
    if (!url || gorulen.has(url) || sonuc.length >= 3) return;
    gorulen.add(url);
    sonuc.push({
      name: AD,
      title: `${AD} ${dublaj ? 'Dublaj' : 'Altyazı'} ${format === 'm3u8' ? 'HLS' : 'MP4'}`,
      url, quality: format === 'm3u8' ? '1080p' : '', format,
      headers: vixKok
        ? { ...YAYIN_BASLIK, Referer: `${vixKok}/` }
        : { Referer: `${referer}/`, 'User-Agent': UA, Accept: '*/*' }, // /vids: okhttp yasak (ölçüldü)
    });
  };

  const govde = [...saf.matchAll(/"videoUrl"\s*:\s*"(https?:\/\/[^"]+)"/g)].map(m => m[1]);
  for (const embed of [...new Set(govde.filter(u => !yayinTipi(u)))].slice(0, 2)) {
    const bulundu = await oynaticiCoz(embed, icerikUrl);
    // Referer = oynatıcının kendi kökü (ha./pl. aynaları değişken — ölçüldü)
    if (bulundu) ekle(bulundu.url, bulundu.format, embed.split('/').slice(0, 3).join('/'), embed.split('/').slice(0, 3).join('/'));
  }
  const vids = [...new Set([...saf.matchAll(/"contentUrl"\s*:\s*"(https?:\/\/[^"]+)"/g)].map(m => m[1]))]
    .filter(u => /\/vids\/|\.(mp4|m3u8)(\?|#|$)/i.test(u));
  for (const u of vids.slice(0, 2)) {
    const tip = yayinTipi(u);
    if (tip) ekle(u, tip, u.split('/').slice(0, 3).join('/'), false);
  }
  return sonuc;
}

if (typeof globalThis !== 'undefined') globalThis.getStreams = getStreams;
export default getStreams;
