/* ==========================================================================
   CinePulse — "Green-Arrow" çekirdeği (birinci taraf, bağımlılıksız)
   --------------------------------------------------------------------------
   Ne yapıyor: TMDB numarasıyla içerik kataloğu API'sini (rota: dzs) sorgulayıp
   DOĞRUDAN HLS adresleri döndürüyor. Sayfa kazıma yok; JSON → m3u8.

   Ölçülen gerçekler (2026-10-18, bu çekirdek yazılırken canlı doğrulandı):
     • /api/dzs/movies/search?q=<metin>          → [{ tmdbId, type, title… }]
     • /api/dzs/movies/by-tmdb/<no>              → film kaydı (m3u8Url + sources[])
     • /api/dzs/movies/by-tmdb/<no>/episodes     → bölüm dizisi (season/episode tamsayı)
     • m3u8Url'ler uzantısız: …/play?id=… → 200 + "application/vnd.apple.mpegurl"
       ve master içinde #EXT-X-MEDIA:TYPE=AUDIO,LANGUAGE="tr" (gerçek dublaj
       rayı → üç-durum etiketi vekilin iz-ölçeri kendi tespit eder).
     • sources[] KABAK: 5 kaynaktan 2'si 500 dönebiliyor → her adres tek tek
       yoklanır, ölü yayın listelenmez (Nero kuralı).
     • Çöp adres kalıpları: "picturebox.cloud", "setfilmizle" → daima reddedilir.
   ========================================================================== */

import { rotaYol, jsonAl, tmdbBilgi, adayBasliklar, zamanAsimi } from '../ortakCekirdek.js';

const AD = 'Green-Arrow';
const ROTA = 'dzs';
const REF = 'https://dizisol.com/';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const COK = /picturebox\.cloud|setfilmizle/i;

/* Adres canlı mı? Master playlist metni dönerse kaliteyle birlikte; değilse null. */
async function canliMi(url) {
  try {
    const yanit = await fetch(url, {
      headers: { Referer: REF, 'User-Agent': UA, Accept: '*/*' },
      signal: zamanAsimi(6000),
    });
    if (!yanit.ok) return null;
    const metin = await yanit.text();
    if (!/#EXTM3U/.test(metin.slice(0, 200))) return null;
    const kaliteler = [...metin.matchAll(/(\d{3,4})p/gi)].map(m => parseInt(m[1], 10));
    const enYuksek = kaliteler.length ? Math.max(...kaliteler) : 0;
    return enYuksek >= 2160 ? '4K' : enYuksek >= 1080 ? '1080p' : enYuksek >= 720 ? '720p' : enYuksek >= 480 ? '480p' : enYuksek ? '360p' : '';
  } catch (_) {
    return null;
  }
}

/* JSON kayıtlarından (m3u8Url + sources[]) aday adresleri toplar. */
function adayTopla(kayit) {
  const ham = [
    { url: kayit?.m3u8Url, saglayici: 'VIP' },
    ...(Array.isArray(kayit?.sources) ? kayit.sources.map(s => ({ url: s?.m3u8Url, saglayici: String(s?.provider || 'sunucu') })) : []),
  ];
  const gorulen = new Set();
  return ham.filter(a => {
    if (!a.url || !/^https?:\/\//i.test(a.url) || COK.test(a.url)) return false;
    const anahtar = a.url.split('?')[0];
    if (gorulen.has(anahtar)) return false;
    gorulen.add(anahtar);
    return true;
  });
}

async function tmdbBul(kimlik, tur) {
  const no = String(kimlik || '').trim();
  if (/^\d+$/.test(no)) return no; // vekil sayısal TMDB numarasını doğrudan veriyor (kimlik:'tmdb')
  const bilgi = await tmdbBilgi(no, tur);
  if (bilgi?.tmdbId) return String(bilgi.tmdbId);
  /* Kimlik çözülemediyse: başlıklarla katalog araması, tür+id taşıyan ilk kart. */
  if (!bilgi) return null;
  for (const soru of adayBasliklar(bilgi).slice(0, 3)) {
    const sonuc = await jsonAl(rotaYol(ROTA, '/movies/search', { q: soru }), { ref: REF, ms: 5000 });
    const kart = Array.isArray(sonuc) && sonuc.find(x => x?.tmdbId && x.type === (tur === 'tv' ? 'tv' : 'movie'));
    if (kart) return String(kart.tmdbId);
  }
  return null;
}

export async function getStreams(kimlik, tur = 'movie', sezon = 1, bolum = 1) {
  const dizi = tur === 'tv';
  const no = await tmdbBul(kimlik, tur);
  if (!no) return [];

  let kayit = null;
  if (dizi) {
    const bolumler = await jsonAl(rotaYol(ROTA, `/movies/by-tmdb/${no}/episodes`), { ref: REF, ms: 9000 });
    kayit = Array.isArray(bolumler)
      ? bolumler.find(x => Number(x?.season) === Number(sezon) && Number(x?.episode) === Number(bolum)) || null
      : null;
    /* Bölüm sayfası düşerse komşu bölüme asla düşmez — kimlik kanıtı şart. */
  } else {
    kayit = await jsonAl(rotaYol(ROTA, `/movies/by-tmdb/${no}`), { ref: REF, ms: 9000 });
  }
  if (!kayit || !kayit.m3u8Url && !Array.isArray(kayit.sources)) return [];

  const adaylar = adayTopla(kayit);
  if (!adaylar.length) return [];

  const yoklanmis = await Promise.all(adaylar.map(async a => {
    const kalite = await canliMi(a.url);
    return kalite == null ? null : { ...a, kalite };
  }));

  return yoklanmis.filter(Boolean).map(a => ({
    name: AD,
    title: `${AD} ${a.kalite || '1080p'} ${a.saglayici}`,
    url: a.url,
    quality: a.kalite || '1080p',
    format: 'm3u8',
    headers: { Referer: REF, 'User-Agent': UA, Accept: '*/*' },
  }));
}

/* Vekil sözleşmesi: modül yüklendiğinde çekirdeği global'e bağla. */
if (typeof globalThis !== 'undefined') globalThis.getStreams = getStreams;
export default getStreams;
