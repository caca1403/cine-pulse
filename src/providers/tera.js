/* ==========================================================================
   TERA — AnimeciX  (sıfırdan, kit sözleşmesi)

   Cihaz yolu: animecix.net /secure/search + /secure/episode-videos
   (uzak worker yalnızca son yedek). Doğrudan HLS/MP4 → oynatıcımız.
   IFRAME YOK: yalnızca doğrudan medya listelenir.
   ========================================================================== */

import { izleyici, kaynak, medyaMi, m3u8eCevir } from './kit.js';
import { isStrictMediaTitleMatch } from '../services/mediaMatcher.js';
import { akilliGet } from '../services/nativeHttp.js';

const WORKER = 'https://wild-credit-e1ae.cagatayca07.workers.dev';
/* ADRES DEĞİŞİKLİĞİ (ölçüldü): animecix.net Türkiye'de erişim engelli —
   ISP kendini-imzalı sertifika ile blok sayfası döndürüyor, bu yüzden
   CapacitorHttp/WebView/OkHttp isteği TLS aşamasında ÖLÜYORU (cert hatası
   JSON sanılıyordu). Canlı adres animecix.tv; .com 404 veriyor. Sıra ile
   denenir, çalışan adres hafızada tutulur (Patron'un siteurl.txt mantığı). */
const ADAY_ORIJINLER = ['https://animecix.tv', 'https://animecix.net', 'https://animecix.com'];
const SITEURL = 'https://raw.githubusercontent.com/patr0nq/veriler/refs/heads/main/siteurl.txt';
let cachedOrigin = '';

export const kimlik = { id: 'animecix', alias: 'Tera', mediaTypes: ['anime', 'movie', 'tv'] };

const UA = 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36';

function workerdenGet(url, timeout) {
  // `aktar=1`: androidTransport bu adrese cihaz yolu yerine GERÇEKTEN worker'ı
  // kullanır. Erişim engelli alan adlarında cihazın kendi IP'si işe yaramaz;
  // tek kaçış worker'dır.
  return fetch(`${WORKER}?url=${encodeURIComponent(url)}&aktar=1`, { signal: AbortSignal.timeout(timeout) })
    .then((r) => (r.ok ? r.text() : ''))
    .catch(() => '');
}

/** Çalışan Animecix adresini bul (bir kez) ve hafızala. */
async function originBul(trace) {
  if (cachedOrigin) return cachedOrigin;
  const adaylar = [...ADAY_ORIJINLER];
  try {
    const ham = await akilliGet(SITEURL, { ref: 'https://raw.githubusercontent.com/', timeout: 6000 });
    const satir = String(ham || '').split('\n').map((l) => l.trim()).find((l) => l.startsWith('animecix:'));
    const u = satir ? satir.slice('animecix:'.length).trim().replace(/\/$/, '') : '';
    if (/^https:\/\//i.test(u)) adaylar.unshift(u);
  } catch (_) { /* liste açıksa adaylarla devam */ }

  for (const aday of adaylar) {
    const test = await akilliGet(`${aday}/secure/search/test`, {
      ref: `${aday}/`, timeout: 7000,
      headers: { 'User-Agent': UA, Accept: 'application/json, text/plain, */*' },
      yedekCek: (u) => workerdenGet(u, 7000),
    });
    const gecerli = String(test || '').trimStart().startsWith('{') || String(test || '').trimStart().startsWith('[');
    if (gecerli) { cachedOrigin = aday; trace?.koy('adres', { secili: aday }); return aday; }
  }
  cachedOrigin = adaylar[0];
  trace?.koy('adres', { secili: cachedOrigin, uyari: 'dogrulanamadi' });
  return cachedOrigin;
}

async function axGet(url, origin, timeout = 9000) {
  return (await akilliGet(url, {
    ref: `${origin}/`, timeout,
    headers: { 'User-Agent': UA, Accept: 'application/json, text/plain, */*' },
    yedekCek: (u) => workerdenGet(u, timeout),
  })) || '';
}

function json(ham) {
  const t = String(ham || '').trim();
  if (!t) return null;
  try { return JSON.parse(t); } catch (_) {}
  const m = t.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch (_) {} }
  return null;
}

const norm = (s) => String(s || '').toLowerCase().replace(/[ğ]/g, 'g').replace(/[ü]/g, 'u').replace(/[ş]/g, 's').replace(/[ı]/g, 'i').replace(/[ö]/g, 'o').replace(/[ç]/g, 'c').replace(/[^\w\s-]/g, ' ').replace(/\s+/g, ' ').trim();

export async function coz({ type = 'anime', title = '', originalTitle = '', titles = [], season = 1, episode = 1, isDub = false, tmdbId = null, imdbId = null } = {}) {
  const trace = izleyici();
  const s = +season || 1, e = +episode || 1;
  const adaylar = [...new Set([originalTitle, title, ...titles].filter((t) => t && String(t).trim().length > 1))];
  if (!adaylar.length) return { sources: [], trace: trace.ozet() };
  const ORIGIN = await originBul(trace);

  let bulunanlar = [];
  // EŞLEŞME SIRASI (Animecix indeksinde ad ROMANCI yazılıdır: "Attack on Titan"
  // → "Shingeki no Kyojin"). Ölçüldü: başlıkla arayınca ya hiç sonuç ya da
  // yanlış anime (Naruto → "Naruto x UT") geliyordu ve sıkı ad karşılaştırması
  // kaynakları sıfırlıyordu. Bu yüzden ÖNCE kimlik numarası (tmdb/imdb), sonra
  // adın TÜM varyantları (romanji/english/oryijinal/titles[]) denenir.
  const idEslesir = (it) => (tmdbId && Number(it?.tmdb_id) === Number(tmdbId))
    || (imdbId && String(it?.imdb_id || '') === String(imdbId));
  const adEslesir = (it) => {
    const adlar = [it?.name, it?.name_romanji, it?.name_english, it?.original_title,
      ...(Array.isArray(it?.titles) ? it.titles.map((t) => t?.title) : [])].map(norm).filter(Boolean);
    return adlar.some((ad) => isStrictMediaTitleMatch(ad, adaylar.map(norm)));
  };
  for (const q of adaylar) {
    const ham = await axGet(`${ORIGIN}/secure/search/${encodeURIComponent(norm(q))}`, ORIGIN);
    const d = json(ham);
    const res = d?.results || d?.data?.results || d?.data || d?.animes || d?.result;
    trace.koy('arama', { q, n: Array.isArray(res) ? res.length : 0, anahtar: d ? Object.keys(d).slice(0, 4) : [], ham: String(ham || '').replace(/\s+/g, ' ').slice(0, 120) });
    if (!Array.isArray(res)) continue;
    const bulunan = res.filter((it) => it?.id && (idEslesir(it) || adEslesir(it)));
    // Kimlik numarasıyla eşleşen her zaman önce gelir (ad eşleşmesi yanıltabilir).
    bulunan.sort((a, b) => Number(idEslesir(b)) - Number(idEslesir(a)));
    if (bulunan.length) { bulunanlar = bulunan.slice(0, 5); break; }
  }
  trace.koy('eslesme', { aday: bulunanlar.map((a) => `${a.id}:${a.name}`).slice(0, 3) });
  if (!bulunanlar.length) return { sources: [], trace: trace.ozet() };

  const kaynaklar = [];
  const gorulen = new Set();
  /* Animecix yayınları EMBED adresi döndürür (Tau Video, Vidmoly…). KURAL:
     iframe/liste yasağı — gömülü adres olduğu gibi listelenmez. Kekik'in
     ExtractorMixins karşılığı olan ortak çözücümüzle (embedExtractors) önce
     DOĞRUDAN yayına çevrilir; çözülen yayın listelenir. */
  const adayVideonlar = [];
  for (const anime of bulunanlar.slice(0, 4)) {
    const vids = json(await axGet(`${ORIGIN}/secure/episode-videos?titleId=${anime.id}&season=${s}&episode=${e}`, ORIGIN, 10000));
    if (!Array.isArray(vids)) continue;
    for (const v of vids) {
      if (typeof v?.url !== 'string' || !v.url.trim()) continue;
      if (gorulen.has(v.url)) continue;
      gorulen.add(v.url);
      adayVideonlar.push({ anime, v });
    }
    if (adayVideonlar.length >= 10) break;
  }

  const cozulenler = await Promise.allSettled(adayVideonlar.slice(0, 8).map(async ({ anime, v }, i) => {
    const ham = m3u8eCevir(v.url.trim());
    let u = ham;
    if (!medyaMi(u)) {
      const { extractEmbedStream } = await import('../services/embedExtractors.js');
      const bul = await extractEmbedStream(ham, `${ORIGIN}/`, new Set(), Date.now() + 12000);
      u = m3u8eCevir(typeof bul === 'string' ? bul : (bul?.url || ''));
    }
    if (!medyaMi(u)) return null;
    // ARAYÜZ ANONİMLİĞİ: v.name gömülü sunucunun GERÇEK adıdır (Tau Video,
    // Doodstream, Uqload…) → listeye taşınmaz; dil bilgisi ad/extra üzerinden
    // okunur ama etikette yalnız kod adı + sunucu numarası görünür.
    const etiketMetni = `${v.name || ''} ${v.extra || ''}`.toLowerCase();
    const dublaj = etiketMetni.includes('dublaj') || etiketMetni.includes('dub ');
    return kaynak({
      id: `acx_${anime.id}_${v.id || kaynaklar.length}_${dublaj ? 'dub' : 'sub'}`,
      ad: `Tera Sunucu ${i + 1} (${dublaj ? 'Dublaj' : 'Altyazı'})`,
      url: u,
      kategori: dublaj ? 'dubbed' : 'subtitled',
      headers: { Referer: `${ORIGIN}/`, 'User-Agent': UA, Accept: '*/*' },
    });
  }));
  for (const r of cozulenler) if (r.status === 'fulfilled' && r.value) kaynaklar.push(r.value);
  if (isDub) {
    const dublar = kaynaklar.filter((k) => k.category === 'dubbed');
    kaynaklar.length = 0;
    kaynaklar.push(...dublar);
  }
  trace.koy('sonuc', { n: kaynaklar.length });
  return { sources: kaynaklar, trace: trace.ozet() };
}

export default { apiVersion: 1, id: kimlik.id, name: kimlik.alias, mediaTypes: kimlik.mediaTypes, async resolve(a) { return (await coz(a)).sources; } };
