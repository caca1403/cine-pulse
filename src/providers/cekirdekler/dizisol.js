/* ==========================================================================
   CinePulse — "Dizisol" çekirdeği (birinci taraf) — çok kaynaklı TR arşivi
   --------------------------------------------------------------------------
   NEDEN AYRI ÇEKİRDEK: sitenin KENDİ API'si var ve içerik başına 6-9 YEDEK
   yayın döndürüyor (fullhd, rapidrame, vidmixi, filmekseni, imagestoo, pal-vds,
   hdfilmdelisi, setfilmizle, hdfilmizle). Tek çekirdekten 9 satıra kadar kaynak
   çıkar; TR dublaj kanıtı master m3u8'in kendi EXT-X-MEDIA satırındandır.

   Ölçülen zincir (2026-10-29, cihazda uçtan uca doğrulandı):
     • GET {site}/api/movies/by-tmdb/{tmdb}?type=tv  → JSON
       { tmdbId, mediaType, titleTr, m3u8Url, sources:[{provider, m3u8Url,
         priority, subtitleTr, isActive}] }
     • Arama: GET {site}/api/tmdb/search/multi?query=<q>&language=tr-TR
     • Kaynak master'ları: s{n}.dizisol.com/play?id=…, rapid.dizisol1.workers.dev/play,
       s26.cdnimg1399.shop/mv/… → hepsi #EXTM3U
     • Türkçe kanıtı: #EXT-X-MEDIA:TYPE=AUDIO,NAME="Türkçe",LANGUAGE="tr",DEFAULT=YES
     • dizi bölümü: /api/movies/by-tmdb/{tmdb}?type=tv&season=S&episode=E
   ========================================================================== */

import { tmdbBilgi, adayBasliklar, sadeles } from '../ortakCekirdek.js';

// UI identity is the existing hero code name; the real provider name stays
// internal to this adapter and its API URLs.
const AD = 'Green-Arrow';
const SITE = 'https://dizisol.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

/* ── Okuma: native HTTP (Capacitor) → düz fetch yedeği ──────────────────── */
async function oku(url, { ref = SITE + '/', json = true, ms = 15000 } = {}) {
  // ORIGIN ŞART (ölçüldü 2026-10-29): s*.dizisol.com/play uçları Origin
  // başlığı OLMADAN Cloudflare WAF tarafından 403'leniyor ("Attention
  // required!", 5661 bayt). Origin: https://dizisol.com ile aynı istek 200 +
  // #EXTM3U dönüyor. Sec-Fetch-* başlıkları ise tersine 403 üretiyor — EKLENMEZ.
  const basliklar = {
    'User-Agent': UA,
    Accept: json ? 'application/json,*/*' : '*/*',
    Referer: ref,
    Origin: SITE,
  };
  try {
    const http = (typeof window !== 'undefined' && window.Capacitor?.Plugins?.CapacitorHttp) || null;
    if (http) {
      const cihazUA = (typeof navigator !== 'undefined' && navigator.userAgent) || UA;
      // DİKKAT: CapacitorHttp.get'te timeout verilmezse ve uç takılırsa
      // (örn. s6.dizisol.com, plus.dizisol.com) Promise SONSedUZA KADAR askıda
      // kalıp tüm çekirdeği 35 sn sonunda 'butce-asim' ile düşürüyordu.
      // JS tarafında Promise.race ile kesin zaman aşımı uygulanır.
      const istek = http.get({ url, headers: { ...basliklar, 'User-Agent': cihazUA } });
      const r = await Promise.race([
        istek,
        new Promise((coz) => setTimeout(() => coz(null), ms)),
      ]);
      if (!r || (r.status && r.status >= 400)) return null;
      const d = r?.data;
      if (d == null) return null;
      const metin = typeof d === 'string' ? d : JSON.stringify(d);
      if (!metin) return null;
      return json ? (() => { try { return typeof d === 'string' ? JSON.parse(d) : d; } catch (_) { return null; } })() : metin;
    }
  } catch (_) { /* düz fetch */ }
  try {
    const r = await fetch(url, {
      headers: basliklar,
      signal: typeof AbortSignal?.timeout === 'function' ? AbortSignal.timeout(ms) : undefined,
    });
    if (!r.ok) return null;
    return json ? await r.json() : await r.text();
  } catch (_) {
    return null;
  }
}

const norm = (s) => sadeles(String(s || '')).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

/* ── Master m3u8'den GERÇEK dil kanıtı (uydurma etiket yok) ─────────────── */
async function dilKaniti(url, ref, ms = 6000) {
  const metin = await oku(url, { ref, json: false, ms });
  if (globalThis.__cpDizisolIzle) (globalThis.__cpDizisolIz ||= []).push(['master', String(url).slice(0, 70), metin ? metin.length : 0, metin ? /#EXTM3U/.test(metin) : false]);
  if (!metin || !/#EXTM3U/.test(metin)) return null;
  const satirlar = metin.split('\n').filter((s) => /#EXT-X-MEDIA/i.test(s));
  const ses = satirlar.filter((s) => /TYPE=AUDIO/i.test(s));
  const alt = satirlar.filter((s) => /TYPE=SUBTITLES/i.test(s));
  const trSes = ses.some((s) => /LANGUAGE="?(?:tr|tur)"?/i.test(s) || /NAME="[^"]*t[uü]rk/i.test(s));
  const trAltyazi = alt.some((s) => /LANGUAGE="?(?:tr|tur)"?/i.test(s) || /NAME="[^"]*t[uü]rk/i.test(s));
  const sesAdlari = ses.map((s) => (s.match(/NAME="([^"]+)"/) || [])[1]).filter(Boolean);
  // RESOLUTION yüksekliklerini STANDART etikete yuvarla (800p gibi ham değer
  // kullanıcıya anlamsız; 1080/720/480 ölçeği beklenir).
  const yukseklikler = (metin.match(/RESOLUTION=\d+x(\d+)/g) || []).map((x) => Number((x.match(/x(\d+)/) || [])[1])).filter(Boolean);
  const h = yukseklikler.length ? Math.max(...yukseklikler) : 1080;
  const enIyi = h >= 2000 ? '4K' : h >= 1000 ? '1080p' : h >= 700 ? '720p' : h >= 400 ? '480p' : '360p';
  const kalite = enIyi;
  return { trSes, trAltyazi, sesAdlari, sesSayisi: ses.length, kalite: enIyi };
}

/* ── Sağlayıcı adı → okunur etiket ─────────────────────────────────────── */
const SAGLAYICI_ETIKET = {
  fullhd: 'FullHD', rapidrame: 'RapidRame', vidmixi: 'VidMixi', filmekseni: 'FilmEkseni',
  imagestoo: 'ImagesToo', 'pal-vds': 'PAL', hdfilmdelisi: 'HDFilmDelisi',
  setfilmizle: 'SetFilmizle', hdfilmizle: 'HDFilmizle', vidrame: 'VidRame', cortina: 'Cortina',
};

const ONBELLEK = new Map();
const ONBELLEK_MS = 15 * 60 * 1000;
const UCAN = new Map();

export async function getStreams(kimlik, tur = 'movie', sezon = 1, bolum = 1) {
  const kim = (kimlik && typeof kimlik === 'object')
    ? (kimlik.tmdbId || kimlik.id || kimlik.imdbId || '')
    : kimlik;
  // Numeric TMDB IDs are already canonical. Resolving them through TMDB first
  // added an unnecessary network dependency and could burn most of the scan
  // budget before the DiziSol API was even queried.
  const tmdbId = /^\d+$/.test(String(kim)) ? String(kim) : (await tmdbBilgi(kim, tur))?.tmdbId;
  if (!tmdbId) return [];

  const isTv = tur === 'tv';
  const anahtar = `${isTv ? 'tv' : 'movie'}:${tmdbId}:${+sezon || 1}:${+bolum || 1}`;
  const hazir = ONBELLEK.get(anahtar);
  if (hazir && Date.now() - hazir.t < ONBELLEK_MS) return hazir.sonuc;
  if (UCAN.has(anahtar)) return UCAN.get(anahtar);

  const is = (async () => {
    const iz = (n, d) => { if (globalThis.__cpDizisolIzle) (globalThis.__cpDizisolIz ||= []).push([n, d]); };
    const sorgu = isTv
      ? `${SITE}/api/movies/by-tmdb/${tmdbId}?type=tv&season=${+sezon || 1}&episode=${+bolum || 1}`
      : `${SITE}/api/movies/by-tmdb/${tmdbId}`;
    const kayit = await oku(sorgu);
    iz('kayit', kayit ? { id: kayit.id, m3u: !!kayit.m3u8Url, kaynak: (kayit.sources || []).length } : null);
    if (!kayit) return [];

    // Kaynak listesi: tekil m3u8Url + sources[] birleşir, önceliğe göre sıralanır
    const adaylar = [];
    if (kayit.m3u8Url && String(kayit.m3u8Url).startsWith('http')) {
      adaylar.push({ provider: 'ana', m3u8Url: kayit.m3u8Url, priority: 0, subtitleTr: kayit.subtitleTr });
    }
    for (const s of kayit.sources || []) {
      if (!s || s.isActive === false || !s.m3u8Url || !String(s.m3u8Url).startsWith('http')) continue;
      adaylar.push(s);
    }
    const oncelik = (s) => Number.isFinite(Number(s?.priority)) ? Number(s.priority) : 99;
    adaylar.sort((a, b) => oncelik(a) - oncelik(b));

    // Aynı master iki kez denenmesin
    const gorulen = new Set();
    const benzersiz = adaylar.filter((s) => {
      // Keep distinct signed URLs: two backups may share a path but use
      // different query tokens.
      const u = String(s.m3u8Url || '').split('#')[0];
      if (!u || gorulen.has(u)) return false;
      gorulen.add(u);
      return true;
    });

    // Validate every backup in parallel. Previously this was capped at six,
    // silently dropping the remaining DiziSol mirrors (often the working ones).
    const olcumler = await Promise.allSettled(
      benzersiz.map((s) => dilKaniti(s.m3u8Url, `${SITE}/`, 8000))
    );
    const sonuc = [];
    const dogrulanmayanlar = [];
    for (let i = 0; i < benzersiz.length; i++) {
      const s = benzersiz[i];
      const kanit = olcumler[i]?.status === 'fulfilled' ? olcumler[i].value : null;
      iz('kanit' + i, kanit ? { tr: kanit.trSes, k: kanit.kalite } : (olcumler[i] && olcumler[i].status) + ':' + String(olcumler[i] && olcumler[i].reason && olcumler[i].reason.message).slice(0, 40));
      if (!kanit) {
        // Tek bir ayna doğrulanmış olsa bile zaman aşımına uğrayan diğer
        // aynaları listeden düşürme. Ağ taraması oynatıcıdan daha katı;
        // cihazda yanıt vermeyen bir doğrulama isteği, oynatılabilir hattın
        // daima ölü olduğu anlamına gelmez. Sağlam hatlar önce, bunlar yedek.
        dogrulanmayanlar.push({ s, index: i });
        continue;
      }
      const sagAd = SAGLAYICI_ETIKET[s.provider] || String(s.provider || 'Kaynak');
      const etiket = kanit.trSes ? 'Türkçe Dublaj' : (kanit.trAltyazi ? 'TR Altyazı' : 'Orijinal');
      sonuc.push({
        name: AD,
        title: `${AD} · ${sagAd} · ${kanit.kalite} · ${etiket}${kanit.sesSayisi > 1 ? ` · ${kanit.sesSayisi} Ses` : ''}`,
        url: s.m3u8Url,
        quality: kanit.kalite,
        format: 'm3u8',
        isM3u8: true,
        diller: kanit.trSes ? ['tr'] : (kanit.trAltyazi ? ['altyazi'] : []),
        trSes: kanit.trSes,
        trAltyazi: kanit.trAltyazi,
        dilDurumu: kanit.trSes ? 'dublaj' : (kanit.trAltyazi ? 'altyazi' : 'orijinal'),
        altyaziUrl: s.subtitleTr || '',
        headers: { 'User-Agent': UA, Referer: `${SITE}/`, Origin: SITE },
        proxyGerekmez: true,
        proxyStreamGerekli: true,
      });
    }

    for (const { s, index } of dogrulanmayanlar) {
      const sagAd = SAGLAYICI_ETIKET[s.provider] || `Yedek Hat ${index + 1}`;
      sonuc.push({
        name: AD,
        title: `${AD} · ${sagAd} · HLS yedeği`,
        url: s.m3u8Url,
        quality: 'auto',
        format: 'm3u8',
        isM3u8: true,
        headers: { 'User-Agent': UA, Referer: `${SITE}/`, Origin: SITE },
        proxyGerekmez: true,
        proxyStreamGerekli: true,
        diller: [],
        dogrulanamadi: true,
      });
    }

    // SIFIR DÖNÜŞ YASAĞI (kullanıcı 2026-10-29: "kaynak azlığı"): doğrulama
    // zaman aşımına düşse bile içeriğin kaynağı listede KALIR — etiketi
    // kanıtsız olduğu için dil iddiası taşımaz (uydurma yok, kaynak yok demek de yok).
    if (!sonuc.length && benzersiz.length) {
      for (const s of benzersiz) {
        const sagAd = SAGLAYICI_ETIKET[s.provider] || String(s.provider || 'Kaynak');
        sonuc.push({
          name: AD,
          title: `${AD} · ${sagAd} · HLS`,
          url: s.m3u8Url,
          quality: 'auto',
          format: 'm3u8',
          isM3u8: true,
          headers: { 'User-Agent': UA, Referer: `${SITE}/`, Origin: SITE },
          // Keep device-origin access through the local gateway and provide a
          // header-aware HLS proxy URL for manifest MIME and segment rewrites.
          proxyGerekmez: true,
          proxyStreamGerekli: true,
          diller: [],
        });
      }
    }
    if (sonuc.length) ONBELLEK.set(anahtar, { t: Date.now(), sonuc });
    if (ONBELLEK.size > 150) ONBELLEK.delete(ONBELLEK.keys().next().value);
    return sonuc;
  })();

  UCAN.set(anahtar, is);
  try { return await is; } finally { UCAN.delete(anahtar); }
}

if (typeof globalThis !== 'undefined') {
  globalThis.getStreams = getStreams;
  globalThis.__cpDizisol = getStreams;
}
export default getStreams;
