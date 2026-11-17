/* ==========================================================================
   CinePulse — "Mystique" çekirdeği (birinci taraf) — LookMovie2.la hosted API
   --------------------------------------------------------------------------
   Eylül 29 (6baa792) hosted-API servisi lookmovieScraper.js'ten geri getirildi
   (kullanıcı isteği 2026-11-17): anahtarsız JSON API, DOĞRUDAN m3u8 üretir —
   iframe/embed YOK, "iframe ruhu" kuralına uygundur.
   Ölçülen zincir (Eylül kanıtı) + çevrimdışı sözleşme testi:
     • Arama:  GET {taban}/api/v1/{movies|shows}/do-search/?q=<başlık>
       → { result: [{ id_movie | id_show, slug, ... }] }
     • Oynatma sayfası: GET {taban}/{movies|shows}/play/<slug> (HTML)
       → inline script içinde hash + expires (+ filmde id_movie; dizide
       her bölüm bir blok: { id_episode, season: 'S', episode: 'E' }).
     • Erişim: GET {taban}/api/v1/security/{movie-access?id_movie=..&hash=..&expires=..
                 | episode-access?id_episode=..&hash=..&expires=..}
       → { streams: { '1080p': 'https://...m3u8', ... }, subtitles: [...] }
   CDN (srv*.meatort.site) erişim yanıtında Access-Control-Allow-Origin: *
   gönderiyor (Eylül ölçümü) → akış satırlarına headers EKLENMEZ; vekil
   doğrudan oynatıma izin verir.
   Hata ağının hiçbir yerinde throw YOK: her sapma → [] (vekil sözleşmesi).
   ========================================================================== */

import { tmdbBilgi, adayBasliklar, jsonAl, metinAl } from '../ortakCekirdek.js';

const TABAN = 'https://lookmovie2.la';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const BASLIK_CERCEVESI = { 'User-Agent': UA, Referer: `${TABAN}/` };

/* Kalite anahtarları API'den ham geliyor; görüntüleme etiketi burada düzelir. */
const KALITE_DUZEN = ['1080p', '1080', '720p', '720', '480p', '480', '360p', '360', 'auto'];
function kaliteDuzenle(k) {
  const s = String(k || '').toLowerCase();
  if (!s || s === 'auto') return '';
  return /p$/.test(s) ? s : `${s}p`;
}
function karsilastir(a, b) {
  const ia = KALITE_DUZEN.indexOf(a);
  const ib = KALITE_DUZEN.indexOf(b);
  return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
}

/** dizi/tv/series/anime havuzu ortak; film dışı her tür dizi yolunu kullanır. */
function diziMi(tur) {
  return /tv|series|anime/.test(String(tur || '').toLowerCase());
}

/** Katalog araması: slug taşıyan ilk isabeti döner (Eylül davranışı). */
async function ara(tur, sorgu, ms) {
  const yol = tur === 'tv' ? 'shows' : 'movies';
  const veri = await jsonAl(
    `${TABAN}/api/v1/${yol}/do-search/?q=${encodeURIComponent(sorgu)}`,
    { basliklar: BASLIK_CERCEVESI, ms }
  );
  const sonuclar = Array.isArray(veri?.result) ? veri.result : [];
  return sonuclar.find(h => h && h.slug) || null;
}

/** Altyazı dosyaları: yalnız TR/EN tutulur, göreli yollar mutlak adrese çevrilir. */
function altyazilariCikar(veri) {
  const liste = [];
  if (!Array.isArray(veri?.subtitles)) return liste;
  for (const alt of veri.subtitles) {
    const dosya = typeof alt?.file === 'string' ? alt.file : '';
    if (!dosya) continue;
    const dil = String(alt?.language || '').toLowerCase();
    const tr = dil.includes('turk') || /(^|[_/])tr([_.]|$)/.test(dosya);
    const en = dil.includes('eng') || /(^|[_/])en([_.]|$)/.test(dosya);
    if (!tr && !en) continue;
    const src = dosya.startsWith('http') ? dosya : `${TABAN}${dosya.startsWith('/') ? '' : '/'}${dosya}`;
    liste.push({ label: tr ? 'Türkçe (Mystique)' : 'English (Mystique)', src });
  }
  return liste;
}

/** kimlik → başlık adayları → katalog → oynatma sayfası → security API → m3u8 satırları. */
export async function getStreams(kimlik, tur = 'movie', sezon = 1, bolum = 1) {
  try {
    const tv = diziMi(tur);
    const turK = tv ? 'tv' : 'movie';
    const bilgi = await tmdbBilgi(kimlik, turK);
    if (!bilgi) return [];

    let isabet = null;
    for (const sorgu of adayBasliklar(bilgi)) {
      isabet = await ara(turK, sorgu, 8000);
      if (isabet) break;
    }
    if (!isabet) return [];

    const oynatma = `${TABAN}/${tv ? 'shows' : 'movies'}/play/${isabet.slug}`;
    const html = await metinAl(oynatma, { basliklar: BASLIK_CERCEVESI, ms: 9000 });
    if (!html) return [];

    const hash = html.match(/hash:\s*["']([^"']+)["']/)?.[1];
    const expires = html.match(/expires:\s*(\d+)/)?.[1];
    if (!hash || !expires) return [];

    let erisimAdresi = null;
    if (!tv) {
      const idFilm = html.match(/id_movie:\s*(\d+)/)?.[1];
      if (!idFilm) return [];
      erisimAdresi = `${TABAN}/api/v1/security/movie-access?id_movie=${idFilm}&hash=${hash}&expires=${expires}`;
    } else {
      const sNum = parseInt(sezon, 10) || 1;
      const eNum = parseInt(bolum, 10) || 1;
      let idBolum = null;
      /* Çok sezonlu sayfalarda her bölüm kendi nesne bloğunda: '{' ile böl,
         sezon+bölüm ikilisi tutan bloktan id_episode'u oku (Eylül sağlaması). */
      for (const blok of html.split('{')) {
        const epUyar = new RegExp(`episode:\\s*["']${eNum}["']`).test(blok);
        const seUyar = new RegExp(`season:\\s*["']${sNum}["']`).test(blok);
        if (epUyar && seUyar) {
          const m = blok.match(/id_episode:\s*(\d+)/);
          if (m) { idBolum = m[1]; break; }
        }
      }
      if (!idBolum) {
        const yedek = html.match(
          new RegExp(`episode:\\s*["']?${eNum}["']?[\\s\\S]*?id_episode:\\s*(\\d+)[\\s\\S]*?season:\\s*["']?${sNum}["']?`, 'i')
        );
        if (yedek) idBolum = yedek[1];
      }
      if (!idBolum) return [];
      erisimAdresi = `${TABAN}/api/v1/security/episode-access?id_episode=${idBolum}&hash=${hash}&expires=${expires}`;
    }

    const veri = await jsonAl(erisimAdresi, {
      basliklar: { ...BASLIK_CERCEVESI, Referer: oynatma },
      ms: 9000,
    });
    const ham = Object.entries(veri?.streams || {})
      .filter(([, v]) => typeof v === 'string' && v.startsWith('http') && v.includes('.m3u8'))
      .map(([k, v]) => ({ anahtar: String(k).toLowerCase(), url: v }))
      .sort((a, b) => karsilastir(a.anahtar, b.anahtar));
    if (!ham.length) return [];

    const altyazilar = altyazilariCikar(veri);
    return ham.map(h => {
      const kalite = kaliteDuzenle(h.anahtar);
      return {
        name: 'Mystique',
        url: h.url,
        title: `${kalite ? `${kalite} ` : ''}Altyazı`,
        quality: kalite || '1080p',
        format: 'm3u8',
        ...(altyazilar.length ? { subtitles: altyazilar } : {}),
      };
    });
  } catch (_) {
    return [];
  }
}

if (typeof globalThis !== 'undefined') {
  globalThis.getStreams = getStreams;
  globalThis.__cpMystique = getStreams;
}

export default getStreams;
