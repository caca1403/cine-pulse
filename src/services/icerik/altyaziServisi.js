/* ==========================================================================
   CinePulse Studio — ALTYAZI SERVİSİ (OpenSubtitles, çok katmanlı)
   --------------------------------------------------------------------------
   HEDEF (kullanıcı 2026-10-30: "tüm kaynaklara OpenSubtitles"): HERhangi bir
   sağlayıcının satırı oynatılırken — Stremio/Nuvio/CloudStream eklentisi,
   yerli çekirdek, drama hattı, imdb'siz başlık-only içerik — altyazı katmanı
   aynı çalışır. Sağlayıcıdan bağımsız, içerik KİMLİĞİYLE çözülür.

   KATMANLAR (öncelik sırası):
     0) Kaynağın KENDİ sunduğu altyazı (srv.altyaziUrl / srv.subtitles —
        ör. dizisol subtitleTr). Sunucu vekilinden geçirilip WebVTT'ye çevrilir.
     1) strem.io OpenSubtitles v3 — imdb ister, UTF-8 hazır, en hızlı.
     2) Bizim sunucu ucu `/api/subtitles?mod=ara` — imdb YOKKEN de çalışır
        (TMDB external_ids + başlık sorgusu + rest.opensubtitles.org yedeği).
        Android'de yerel geçit bu rotayı tanımadığı için HERKese açık kökten
        çekilir (publicApiUrl).

   ETİKET DÜRÜSTLÜĞÜ (kullanıcı kuralı): "İngilizce" etiketi yalnız EN içerik
   GERÇEKTEN bulunursa atılır (ara modu `bulundu:true` döndürür); doğrulanama-
   yan dil listeye hiç girmez. Seçim sırası: kaynak → Türkçe → İngilizce.

   NEDEN TARAYICIDAN (ölçülen, 2026-10-17): altyazı yalnız sunucu yoluna
   bağlıydı; ANDROID'deki cihaz içi ağ geçidi `/api/subtitles` rotasını
   tanımıyor → 501. OpenSubtitles v3 CORS'a açıktır; ara modu da CORS'ludur.
   SRT→WebVTT dönüşümü burada yapılır; metin native oynatıcıya olduğu gibi
   verilir (cihaz dosyaya yazıp yükler). Aynı kod masaüstünde de çalışır.
   ========================================================================== */

import { apiUrl, publicApiUrl } from '../altyapi/apiOrigin.js';

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
      // Saat tek haneliyse (0:02:05) VTT için '00:'e tamamla —ExoPlayer ve
      // Chromium tek haneli saati reddebilir.
      const saat = s => (s || '00:').padStart(3, '0');
      const bas = `${saat(zaman[1])}${zaman[2]}:${zaman[3]}.${(zaman[4] + '00').slice(0, 3)}`;
      const son = `${saat(zaman[5])}${zaman[6]}:${zaman[7]}.${(zaman[8] + '00').slice(0, 3)}`;
      cikti.push(`${zamanSayaci++}`);
      cikti.push(`${bas} --> ${son}${zaman[9] || ''}`);
      continue;
    }
    // SRT sıra numarası: içeriğin kendisiyle karışmasın diye sadece
    // zaman damgasından hemen önce gelen boş-satır sırası atılır.
    if (/^\s*\d+\s*$/.test(satir) && /^\s*\d{1,2}:?\d{0,2}:?\d{2}[,.]\d{1,3}\s*-->/.test(satirlar[i + 1] || '')) continue;
    // OpenSubtitles reklam satırları: sunucu ucundaki ile aynı süzgeç —
    // "Support us / VIP" altyazı olarak görünmez (kullanıcı: gürültü yok).
    if (/(?:OpenSubtitles|osdb\.link|ai\.OpenSubtitles|VIP\s*üyelik|Support us and become)/i.test(satir)) continue;
    cikti.push(satir.replace(/\{\\?an\d+\}/gi, '').replace(/<\/?font[^>]*>/gi, ''));
  }
  return `WEBVTT\n\n${cikti.join('\n')}`;
}

function dilEtiketi(kod, sira) {
  if (kod === 'tr') return sira === 0 ? 'Türkçe' : `Türkçe (${sira + 1})`;
  if (kod === 'en') return sira === 0 ? 'İngilizce (normal)' : `İngilizce (${sira + 1})`;
  return kod;
}

/* ── Katman 1: strem.io OpenSubtitles v3 (imdb gerekir) ─────────────────── */
async function v3Adaylari({ imdb, type = 'movie', season = 1, episode = 1, timeoutMs = 4200 }) {
  if (!imdb) return [];
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
    return [
      ...sirali('tur').slice(0, 3).map((s, i) => ({ etiket: `OpenSubtitles · ${dilEtiketi('tr', i)}`, dil: 'tr', url: s.url })),
      ...sirali('eng').slice(0, 2).map((s, i) => ({ etiket: `OpenSubtitles · ${dilEtiketi('en', i)}`, dil: 'en', url: s.url }))
    ];
  } catch (_) {
    return [];
  }
}

/* ── Katman 2: bizim sunucu ucu (imdb'siz/TMDB-only/başlık-only çalışır) ── */

/** Sunucu ara modu adresi — saf, test edilebilir. */
export function sunucuAraUrl({ imdbId, tmdbId, title, type = 'movie', season = 1, episode = 1, dil = '', temelAdres } = {}) {
  const p = new URLSearchParams();
  const imdb = imdbKimligi(imdbId);
  if (imdb) p.set('imdbId', imdb);
  else if (tmdbId) p.set('tmdbId', String(tmdbId));
  if (title) p.set('title', String(title));
  if (String(type) === 'tv') {
    p.set('season', String(season || 1));
    p.set('episode', String(episode || 1));
  }
  p.set('type', String(type) === 'tv' ? 'tv' : 'movie');
  if (dil) p.set('dil', dil);
  else p.set('mod', 'ara');
  return `${temelAdres || publicApiUrl('/api/subtitles')}?${p.toString()}`;
}

/** ara modu JSON'unu aday listesine çevirir — saf, test edilebilir. */
export function araJsonAdaylari(json) {
  const liste = Array.isArray(json?.altyazilar) ? json.altyazilar : [];
  return liste
    // Yalnız sunucunun GERÇEKTEN bulduğu satırlar (etiket dürüstlüğü).
    .filter(a => a && a.vttUrl && a.bulundu !== false)
    .map(a => ({
      dil: a.dil === 'en' ? 'en' : 'tr',
      etiket: a.etiket || `OpenSubtitles (${a.dil === 'en' ? 'İngilizce' : 'Türkçe'})`,
      url: String(a.vttUrl)
    }));
}

/** Yalnız url tekilliği — sıra korunur (kaynak + OS satırları üst üste). */
export function altyaziTekille(liste) {
  const out = [];
  const gorulen = new Set();
  for (const a of liste || []) {
    if (!a?.url || gorulen.has(a.url)) continue;
    gorulen.add(a.url);
    out.push(a);
  }
  return out;
}

/**
 * İki aday listesini birleştirir — saf, test edilebilir.
 * Kurallar: url başına tek satır; yedek listeden bir dil YALNIZ ana listede
 * o dil hiç yoksa eklenir (aynı dilin çift kopyası kullanıcıya gösterilmez —
 * yedekten o dili temsil eden ilk satır gelir). Görünen sıra daima TR önce.
 */
export function altyaziBirlestir(ana, yedek) {
  const dilKodu = a => (a.dil === 'en' ? 'en' : 'tr');
  const gorulen = new Set();
  const dilSay = { tr: 0, en: 0 };
  const out = [];
  const ekle = (a) => {
    if (!a?.url || gorulen.has(a.url)) return;
    gorulen.add(a.url);
    out.push(a);
    dilSay[dilKodu(a)] += 1;
  };
  for (const a of ana || []) ekle(a);
  for (const a of yedek || []) {
    if (dilSay[dilKodu(a)] === 0) ekle(a);
  }
  return out.sort((x, y) => (dilKodu(x) === dilKodu(y) ? 0 : dilKodu(x) === 'tr' ? -1 : 1));
}

/* ── Katman 2b: rest.opensubtitles.org DOĞRUDAN (deploy beklenmez) ────────
   Ölçülen (2026-10-30): worker'daki `/api/proxy` canlısı rest API'nin JSON'unu
   sorunsuz geçiriyor (TR+EN). Böylece imdb'siz/başlık-only çözüm ve EN yedeği
   worker'da yeni kod DAHİ yayınlamadan her cihazda çalışır. İndirme de
   köprülü: SubDownloadLink gzip SRT verir; DecompressionStream ile açılır. */

/** rest.arama adresi — saf, test edilebilir. */
export function restAramaUrl({ imdbId, title, season, episode, dil = 'tr' }) {
  const lang = dil === 'en' ? 'eng' : 'tur';
  const parca = [];
  const imdb = imdbKimligi(imdbId);
  const cleanQ = String(title || '').replace(/[^\w\s]/gi, ' ').trim().toLowerCase().replace(/\s+/g, '+');
  if (imdb) parca.push(`imdbid-${imdb.replace(/^tt/, '')}`);
  else if (cleanQ) parca.push(`query-${cleanQ}`);
  else return '';
  if (Number(season) > 0 && Number(episode) > 0) {
    parca.push(`season-${Number(season)}`, `episode-${Number(episode)}`);
  }
  parca.push(`sublanguageid-${lang}`);
  return `https://rest.opensubtitles.org/search/${parca.join('/')}`;
}

/** rest.arama JSON'unu sıralar ve üst `limit` adayı OpenSubtitles satırına çevirir — saf. */
export function restSirala(liste, dil) {
  const kod = dil === 'en' ? 'en' : 'tr';
  const etiket = kod === 'en' ? 'OpenSubtitles · İngilizce (normal)' : 'OpenSubtitles · Türkçe';
  const gecerli = (Array.isArray(liste) ? liste : []).filter(c => c && c.SubDownloadLink);
  const puan = c => {
    const srt = String(c.SubFormat || '').toLowerCase() === 'srt' ? 25 : 0;
    const forced = c.SubForeignPartsOnly === '1' ? -40 : 0; // yalnız-yabancı-dialog: eksik altyazı
    const cd = /cd\s*[2-9]/i.test(c.SubFileName || '') ? -20 : 0; // parçalı disk
    const dl = Math.min(parseInt(c.SubDownloadsCnt || '0', 10) / 500, 15);
    return srt + forced + cd + dl;
  };
  return gecerli
    .sort((a, b) => puan(b) - puan(a))
    .slice(0, 2)
    .map(c => ({ dil: kod, etiket, url: String(c.SubDownloadLink), ikili: true }));
}

async function restIstek(uzakUrl, timeoutMs) {
  // rest API CORS'suz → her ortamda çalışan generic vekilden geçir.
  const hedef = `${publicApiUrl('/api/proxy')}?url=${encodeURIComponent(uzakUrl)}`;
  const res = await fetch(hedef, {
    signal: AbortSignal.timeout(timeoutMs),
    headers: { Accept: 'application/json' }
  });
  if (!res.ok) return [];
  const veri = await res.json();
  return Array.isArray(veri) ? veri : [];
}

async function restAdaylari(params, timeoutMs = 4000) {
  const trUrl = restAramaUrl({ ...params, dil: 'tr' });
  const enUrl = restAramaUrl({ ...params, dil: 'en' });
  if (!trUrl && !enUrl) return [];
  const ara = async (u, dil) => {
    if (!u) return [];
    try {
      let l = await restIstek(u, timeoutMs);
      // TR tek seferlik yeniden dene: ölçüldü, TR sorgusu EN'den yavaş gelebiliyor.
      if (!l.length && dil === 'tr') l = await restIstek(u, Math.max(1800, timeoutMs - 1500)).catch(() => []);
      // TR hâlâ boşsa ve imdb kullanıldıysa BAŞLIK sorgusuyla ara — imdb-id araması
      // eksik eşleşebilir; TR içerik OpenSubtitles'ta vardır, bulamamak bizim eksiğimiz.
      if (!l.length && dil === 'tr' && /^imdbid-/u.test(decodeURIComponent(u).split('/search/')[1] || '') && params.title) {
        const qUrl = restAramaUrl({ imdbId: '', title: params.title, season: params.season, episode: params.episode, dil: 'tr' });
        if (qUrl) l = await restIstek(qUrl, Math.max(1800, timeoutMs - 1500)).catch(() => []);
      }
      return l;
    } catch (_) { return []; }
  };
  const [tr, en] = await Promise.all([ara(trUrl, 'tr'), ara(enUrl, 'en')]);
  return [...restSirala(tr, 'tr'), ...restSirala(en, 'en')];
}

async function sunucuAdaylari(params, timeoutMs = 4200) {
  try {
    const res = await fetch(sunucuAraUrl(params), {
      signal: AbortSignal.timeout(timeoutMs),
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) return [];
    const veri = await res.json();
    return araJsonAdaylari(veri);
  } catch (_) {
    return [];
  }
}

/* ── Katman 0: kaynağın kendi altyazısı ─────────────────────────────────── */

/**
 * srv satırındaki sağlayıcı-verimli altyazıları aday listesine çevirir —
 * saf, test edilebilir. Bağıl ve OpenSubtitles-yollu adresler ATLANIR
 * (OS kendi katmanından gelir; bağıl adres native köprüde çözülmez).
 */
export function kaynakAltyaziAdaylari(srv) {
  const liste = [];
  const ekle = (url, etiket) => {
    const s = String(url || '');
    if (!/^https?:\/\//i.test(s)) return;
    if (/\/api\/subtitles/i.test(s)) return; // OS satırı — çift kopya olmasın
    if (liste.some(x => x.url === s)) return;
    liste.push({ dil: 'tr', etiket: etiket || 'Kaynak altyazısı', url: s, kaynak: true });
  };
  // dizisol vb. çekirdeklerin TR altyazı alanı — alan ADI TR iddia eder.
  if (srv?.altyaziUrl) ekle(srv.altyaziUrl, 'Kaynak altyazısı (Türkçe)');
  for (const s of (Array.isArray(srv?.subtitles) ? srv.subtitles : [])) {
    if (!s?.src) continue;
    const lbl = String(s.label || '');
    if (/opensubtitles/i.test(lbl)) continue; // OS satırını kendi katmanı besler
    ekle(s.src, lbl || 'Kaynak altyazısı');
  }
  return liste;
}

/* ── Ortak: aday listesi (kimliğe göre oturum-önbellekli) ───────────────── */

/**
 * İçerik için TÜM OpenSubtitles adaylarını döndürür (kaynak katmanı hariç).
 * @returns {Promise<Array<{etiket:string,dil:string,url:string}>>}
 */
export async function altyaziAdaylari({ imdbId, tmdbId, title, type = 'movie', season = 1, episode = 1 } = {}, timeoutMs = 4200) {
  const imdb = imdbKimligi(imdbId);
  const anahtar = `v2:${type}:${imdb || ('tmdb' + (tmdbId || ''))}:${String(title || '').toLocaleLowerCase('tr')}:${season}:${episode}`;
  if (kaynakOnbellek.has(anahtar)) return kaynakOnbellek.get(anahtar);

  const adaylar = await v3Adaylari({ imdb, type, season, episode, timeoutMs });
  const trVar = adaylar.some(a => a.dil === 'tr');

  // Sunucu/istemci yedeği: imdb hiç yoksa ya da v3 Türkçe/İngilizce'yi
  // bulamadıysa. Sıra: (a) worker ara modu (yeni dağıtım varsa TMDB çözümlemesi
  // de yapar), (b) rest.opensubtitles.org DOĞRUDAN — deployed worker'a yeni kod
  // gerekmez, her cihazda bugün çalışır. Eksik dil öteki kaynaktan tamamlanır.
  if ((!imdb || !trVar || !adaylar.some(a => a.dil === 'en')) && (imdb || tmdbId || title)) {
    const kalan = Math.max(2500, timeoutMs - 1000);
    const [ara, rest] = await Promise.all([
      sunucuAdaylari({ imdbId: imdb, tmdbId, title, type, season, episode }, Math.min(2500, kalan)),
      restAdaylari({ imdbId: imdb, title, season, episode }, kalan)
    ]);
    const birlesik = altyaziBirlestir(adaylar, altyaziBirlestir(ara, rest));
    if (birlesik.length) kaynakOnbellek.set(anahtar, birlesik);
    return birlesik;
  }
  if (adaylar.length) kaynakOnbellek.set(anahtar, adaylar);
  return adaylar;
}

/** gzip'li baytı (SubDownloadLink) açar; düz gelmişse aynen döner. */
async function acIkili(bayt) {
  if (bayt.length > 2 && bayt[0] === 0x1f && bayt[1] === 0x8b && typeof DecompressionStream === 'function') {
    try {
      const akis = new Blob([bayt]).stream().pipeThrough(new DecompressionStream('gzip'));
      return new Uint8Array(await new Response(akis).arrayBuffer());
    } catch (_) { return null; }
  }
  if (bayt.length > 2 && bayt[0] === 0x50 && bayt[1] === 0x4b) return null; // zip: desteklenmez, uydurma yok
  return bayt;
}

/** UTF-8 geçerliyse UTF-8; değilse windows-1254 (Türkçe ANSI) — çıplak metin asla bırakılmaz. */
function metinCoz(bayt) {
  const utf8 = new TextDecoder('utf-8').decode(bayt);
  if (!utf8.includes('\uFFFD')) return utf8;
  try { return new TextDecoder('windows-1254').decode(bayt); } catch (_) { return utf8; }
}

/** Bir altyazı kaynağını indirir ve WebVTT metnine çevirir. */
export async function altyaziVttMetni(kaynak, timeoutMs = 5000) {
  const url = typeof kaynak === 'string' ? kaynak : kaynak?.url;
  if (!url) return null;
  if (metinOnbellek.has(url)) return metinOnbellek.get(url);
  try {
    // Çapraz-kaynak sağlayıcı/OS alt-yazıları CORS'suz olabilir → vekilden geçir.
    const ikili = !!(kaynak && typeof kaynak === 'object' && kaynak.ikili);
    const hedef = (kaynak?.kaynak || ikili) && /^https?:\/\//i.test(url)
      ? `${apiUrl('/api/proxy')}?url=${encodeURIComponent(url)}`
      : url;
    const res = await fetch(hedef, { signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return null;
    if (ikili) {
      const ham = await acIkili(new Uint8Array(await res.arrayBuffer()));
      if (!ham) return null;
      const metin = metinCoz(ham);
      if (!metin || metin.length < 16) return null;
      const vtt = srtToVtt(metin);
      metinOnbellek.set(url, vtt);
      return vtt;
    }
    const ham = await res.text();
    if (!ham || ham.length < 16 || !/WEBVTT|\d{2}:\d{2}:\d{2}[,.]\d{2,3}/.test(ham.slice(0, 2000))) return null;
    const vtt = srtToVtt(ham);
    metinOnbellek.set(url, vtt);
    return vtt;
  } catch (_) {
    return null;
  }
}

/**
 * Native oynatıcıya (ve genel tüketicilere) verilecek altyazı listesi.
 * TR GARANTİSİ (kullanıcı 2026-10-30 kesin kuralı: "OpenSubtitles'ta Türkçe
 * olmaması mümkün değil"): önce TR adayları sırayla ve hızlı yeniden-denemeyle
 * indirilir; EN ancak TR BULUNAMAZSA tam bütçeyle denenir. TR varken EN yalnız
 * indirilmişse listeye girer — oynatma başlangıcı EN için bekletilmez.
 * @param {object} icerik {imdbId,tmdbId,title,type,season,episode}
 * @param {object} [opts] {enFazla, timeoutMs, srv} — srv: oynatılacak satır
 * @returns {Promise<Array<{etiket:string,dil:string,vtt:string}>>}
 */
export async function nativeAltyazilariHazirla(icerik, { enFazla = 3, timeoutMs = 4500, srv = null } = {}) {
  try {
    const t0 = Date.now();
    const adaylar = await altyaziAdaylari(icerik, timeoutMs);
    const kaynak = srv ? kaynakAltyaziAdaylari(srv) : [];
    const hepsi = altyaziTekille([...kaynak, ...adaylar]);
    if (!hepsi.length) return [];
    const trList = hepsi.filter(a => (a.dil || 'tr') === 'tr');
    const enList = hepsi.filter(a => a.dil === 'en');
    const deadline = t0 + Math.max(2600, timeoutMs);
    const dene = async (liste, bitis) => {
      for (const a of liste.slice(0, 2)) {
        for (let deneme = 0; deneme < 2; deneme++) {
          const kalan = bitis - Date.now();
          if (kalan < 700) return null;
          const vtt = await altyaziVttMetni(a, Math.min(deneme === 0 ? 3000 : 2200, kalan)).catch(() => null);
          if (vtt) return { etiket: a.etiket, dil: a.dil || 'tr', vtt };
        }
      }
      return null;
    };
    const sonuc = [];
    const tr = await dene(trList, deadline);
    if (tr) sonuc.push(tr);
    const en = await dene(enList, tr ? Date.now() + 900 : deadline + 800);
    if (en) sonuc.push(en);
    // Ek TR varyantları yalnız İNDİRİLMİŞSE eklenir (extra bekleme yok).
    for (const a of trList.slice(1)) {
      if (sonuc.length >= Math.max(1, enFazla)) break;
      const cached = metinOnbellek.get(a.url);
      if (cached && !sonuc.some(s => s.vtt === cached)) sonuc.push({ etiket: a.etiket, dil: 'tr', vtt: cached });
    }
    return sonuc;
  } catch (_) {
    return [];
  }
}

/**
 * Geriye-uyum: salt OS adayı listesi (kaynak katmanı olmadan).
 * @deprecated yeni kod nativeAltyazilariHazirla/altyaziAdaylari kullansın.
 */
export async function altyaziKaynaklariniBul(icerik, opts = {}) {
  return altyaziAdaylari(icerik, opts.timeoutMs);
}

export function altyaziOnbelleginiTemizle() {
  kaynakOnbellek.clear();
  metinOnbellek.clear();
}
