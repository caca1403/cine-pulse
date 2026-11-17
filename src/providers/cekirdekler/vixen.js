/* ==========================================================================
   CinePulse — "Vixen" çekirdeği (birinci taraf) — ID-anahtarlı HLS çözücü
   --------------------------------------------------------------------------
   KULLANICI HEDEFİ (2026-11-17): "dizisol gibi farklı kaynakları m3u8'e çevirelim;
   gelen her veriden video + SES + ALTYAZI doğru çıkarılsın." Bu çekirdek tam
   bunu HAM olarak verir: sunucu ucundaki çözümleyici IMDb-ID + sezon/bölüm ile
   çağrılır ve DOĞRUDAN master m3u8 döner — iframe/embed YOK, gömülü sayfa YOK.

   Ölçülen zincir (2026-11-17, canlı):
     • Film:  GET {taban}/vs/{imdbId}                     → #EXTM3U master
     • Dizi:  GET {taban}/vs/{imdbId}/s{SS}/e{EE}         → #EXTM3U master
       (S2E3 doğrulandı — sezonluk dizi çalışıyor; katalogda olmayan içerik 404)
     • Master içinde GERÇEK izler (uydurma değil, manifest kanıtı):
         #EXT-X-MEDIA:TYPE=AUDIO,NAME="Türkçe",LANGUAGE="tr",URI=…   → dublaj
         #EXT-X-MEDIA:TYPE=AUDIO,NAME="English",LANGUAGE="en"        → özgün
         #EXT-X-MEDIA:TYPE=SUBTITLES,NAME="Türkçe",LANGUAGE="tr"     → altyazı
         #EXT-X-STREAM-INF:RESOLUTION=1920x960 / 854x427             → varyantlar
     • Referer/Origin: hdfilmdelisi.one kabul edilen ana fitildir
       (sayfanın kendi izin listesinde doğrulandı). Manifest'te ACAO YOK →
       vekil başlık-taşıyan /api/hls_proxy hattına sarar; segmentler ACAO:*
       taşısa da çocuk adresler proxy üzerinden aynı başlığı korur.
     • Altyazı URI'leri HLS altyazı çalma listeleridir (.gif takma uzantılı);
       hls.js master üzerinden bunları YEREL track olarak gösterir — ayrıca
       düz .vtt/.srt taşınmaz (ölçüldü: dosya uçları manifest döndürüyor).
   Hata ağının hiçbir yerinde throw YOK: her sapma → [] (vekil sözleşmesi).
   ========================================================================== */

import { jsonAl, metinAl } from '../ortakCekirdek.js';

const AD = 'Vixen';
const TABAN = 'https://ha.vixolity.com';
const FITRE = 'https://hdfilmdelisi.one';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const BASLIK = { 'User-Agent': UA, Accept: '*/*', Referer: `${FITRE}/`, Origin: FITRE };
/* Kimlik anahtarı IMDb olduğundan TMDB detayından imdb_id okunur. Anahtar
   ortakCekirdek'te sabitli olanla aynıdır (repo içi sabit, dış servis yok). */
const TMDB_ANAHTAR = '4e44d9029b1270a757cddc766a1bcb63';

const ONBELLEK = new Map();
const ONBELLEK_MS = 30 * 1000;
const UCAN = new Map();
const IMDB_ONBELLEK = new Map();

/* Yol biçimi ölçüldü: videoId "tt4574334/s1/e01" — SEZON sıfırsız, BÖLÜM iki
   haneli sıfırlı. (/s02/ denemesi 404; /s2/e03 200 — 2026-11-17 canlı ölçüm.) */
function sezonYol(n) { return String(Math.max(1, parseInt(n, 10) || 1)); }
function bolumYol(n) { return String(Math.max(1, parseInt(n, 10) || 1)).padStart(2, '0'); }

/** tmdb sayısal id / tt id → IMDb numarası ('' bulunamazsa). */
async function imdbBul(kim, tv) {
  const s = String(kim || '').trim();
  if (/^tt\d{5,10}$/i.test(s)) return s;
  const no = s.replace(/^(ddz_|dml_)/, '');
  if (!/^\d+$/.test(no)) return '';
  const anahtar = `${tv ? 'tv' : 'movie'}:${no}`;
  if (IMDB_ONBELLEK.has(anahtar)) return IMDB_ONBELLEK.get(anahtar);
  /* external_ids ölçüldü (2026-11-17): düz detay yanıtında imdb_id ALANMIYOR
     (bu anahtar/hesap altında), external_ids uç noktası veriyor. */
  const ext = await jsonAl(
    `https://api.themoviedb.org/3/${tv ? 'tv' : 'movie'}/${no}/external_ids?api_key=${TMDB_ANAHTAR}&language=en-US`,
    { ms: 8000 },
  );
  let imdb = String(ext?.imdb_id || '');
  if (!/^tt\d{5,10}$/i.test(imdb)) {
    const veri = await jsonAl(
      `https://api.themoviedb.org/3/${tv ? 'tv' : 'movie'}/${no}?api_key=${TMDB_ANAHTAR}&language=en-US`,
      { ms: 8000 },
    );
    imdb = String(veri?.imdb_id || '');
  }
  IMDB_ONBELLEK.set(anahtar, /^tt\d{5,10}$/i.test(imdb) ? imdb : '');
  return IMDB_ONBELLEK.get(anahtar);
}

/** Master m3u8 metninden GERÇEK izleri çıkarır: ses/altyazı dilleri + varyantlar. */
export function manifestIzleri(metin) {
  const ses = [];
  const yazi = [];
  const varyantlar = [];
  const satirlar = String(metin || '').split('\n');
  let sonInf = null;
  for (const ham of satirlar) {
    const s = ham.trim();
    if (/^#EXT-X-MEDIA:/.test(s)) {
      const a = {};
      for (const m of s.matchAll(/([A-Z0-9-]+)=("([^"]*)"|[^,]*)/g)) a[m[1]] = (m[3] ?? m[2] ?? '').trim();
      const kayit = { dil: String(a.LANGUAGE || '').toLowerCase(), isim: a.NAME || '', uri: a.URI || '' };
      if (a.TYPE === 'AUDIO') ses.push(kayit);
      else if (a.TYPE === 'SUBTITLES') yazi.push(kayit);
      continue;
    }
    if (/^#EXT-X-STREAM-INF:/.test(s)) {
      const coz = (s.match(/RESOLUTION=(\d+)x(\d+)/) || []).slice(1).map(Number);
      sonInf = { yukseklik: coz[1] || 0, genislik: coz[0] || 0 };
      continue;
    }
    if (s && !s.startsWith('#') && sonInf) {
      sonInf.url = s;
      varyantlar.push(sonInf);
      sonInf = null;
    }
  }
  return { ses, yazi, varyantlar };
}

/** Ölçüldü 2026-11-17: ustalar 1920x960 (2:1 kırpma) taşıyor — yalnız yüksekliğe
    bakmak 960'ı 720p'ye düşürürdü; genişlik birlikte sınıflandırılır. */
const etiketle = (h, w = 0) => ((h >= 2000 || w >= 3000) ? '4K'
  : (h >= 900 || w >= 1900) ? '1080p'
  : (h >= 650 || w >= 1200) ? '720p'
  : (h >= 380 || w >= 760) ? '480p' : '360p');

export async function getStreams(kimlik, tur = 'movie', sezon = 1, bolum = 1) {
  try {
    const kim = (kimlik && typeof kimlik === 'object')
      ? (kimlik.imdbId || kimlik.tmdbId || kimlik.id || '')
      : kimlik;
    const tv = /tv|series|dizi|anime/i.test(String(tur || ''));
    const anahtar = `${tv ? 'tv' : 'movie'}:${kim}:${+sezon || 1}:${+bolum || 1}`;
    const hazir = ONBELLEK.get(anahtar);
    if (hazir && Date.now() - hazir.t < ONBELLEK_MS) return hazir.sonuc;
    if (UCAN.has(anahtar)) return UCAN.get(anahtar);

    const is = (async () => {
      const imdb = await imdbBul(kim, tv);
      if (!imdb) return [];
      const adres = tv
        ? `${TABAN}/vs/${imdb}/s${sezonYol(sezon)}/e${bolumYol(bolum)}`
        : `${TABAN}/vs/${imdb}`;
      const metin = await metinAl(adres, { basliklar: BASLIK, ms: 9000 });
      if (!metin || !/#EXTM3U/i.test(metin.slice(0, 256))) return [];

      const iz = manifestIzleri(metin);
      const trSes = iz.ses.some((t) => t.dil === 'tr' || /t[uü]rk/i.test(t.isim));
      const enSes = iz.ses.some((t) => t.dil === 'en' || /ingiliz|english/i.test(t.isim));
      const trAltyazi = iz.yazi.some((t) => t.dil === 'tr' || /t[uü]rk/i.test(t.isim));
      const dil = trSes ? 'Dublaj' : (trAltyazi ? 'Altyazılı' : '');
      const diller = [];
      if (trSes) diller.push('tr');
      if (trAltyazi || !trSes) diller.push('altyazi');

      const satirlar = [];
      const enIyi = iz.varyantlar.reduce((a, v) => ((v.yukseklik * v.genislik) > ((a?.yukseklik || 0) * (a?.genislik || 0)) ? v : a), iz.varyantlar[0]);
      const masterKalite = etiketle(enIyi?.yukseklik || 0, enIyi?.genislik || 0) === '360p' ? '1080p' : etiketle(enIyi?.yukseklik || 0, enIyi?.genislik || 0);
      if (iz.varyantlar.length > 1) {
        // Master satırı: hls.js varyantlar arası otomatik geçiş + ses/altyazı
        // tracklerini kendisi sunar.
        satirlar.push({
          name: AD,
          title: `${AD} · ${masterKalite} · Otomatik · ${dil || 'Tek kalite'}`,
          url: adres,
          quality: masterKalite,
          format: 'm3u8',
          isM3u8: true,
          headers: { Referer: `${FITRE}/`, Origin: FITRE },
          diller, trSes, trAltyazi,
          dilDurumu: trSes ? 'dublaj' : (trAltyazi ? 'altyazi' : 'orijinal'),
          sesSayisi: iz.ses.length || undefined,
          ciftSes: trSes && enSes ? true : undefined,
        });
        for (const v of iz.varyantlar) {
          if (!v.url || !v.yukseklik) continue;
          const vUrl = /^https?:/i.test(v.url) ? v.url : new URL(v.url, adres).href;
          satirlar.push({
            name: AD,
            title: `${AD} · ${etiketle(v.yukseklik, v.genislik)} · ${dil || 'Orijinal'}`,
            url: vUrl,
            quality: etiketle(v.yukseklik, v.genislik),
            format: 'm3u8',
            isM3u8: true,
            headers: { Referer: `${FITRE}/`, Origin: FITRE },
            diller, trSes, trAltyazi,
            dilDurumu: trSes ? 'dublaj' : (trAltyazi ? 'altyazi' : 'orijinal'),
          });
        }
      } else {
        const tek = iz.varyantlar[0];
        const url = tek?.url
          ? (/^https?:/i.test(tek.url) ? tek.url : new URL(tek.url, adres).href)
          : adres;
        satirlar.push({
          name: AD,
          title: `${AD} · ${etiketle(tek?.yukseklik || 1080, tek?.genislik || 1920)} · ${dil || 'Orijinal'}`,
          url,
          quality: etiketle(tek?.yukseklik || 1080, tek?.genislik || 1920),
          format: 'm3u8',
          isM3u8: true,
          headers: { Referer: `${FITRE}/`, Origin: FITRE },
          diller, trSes, trAltyazi,
          dilDurumu: trSes ? 'dublaj' : (trAltyazi ? 'altyazi' : 'orijinal'),
          sesSayisi: iz.ses.length || undefined,
          ciftSes: trSes && enSes ? true : undefined,
        });
      }
      if (satirlar.length) ONBELLEK.set(anahtar, { t: Date.now(), sonuc: satirlar });
      if (ONBELLEK.size > 150) ONBELLEK.delete(ONBELLEK.keys().next().value);
      return satirlar;
    })();

    UCAN.set(anahtar, is);
    try { return await is; } finally { UCAN.delete(anahtar); }
  } catch (_) {
    return [];
  }
}

if (typeof globalThis !== 'undefined') {
  globalThis.getStreams = getStreams;
  globalThis.__cpVixen = getStreams;
}
export default getStreams;
