/* ==========================================================================
   VELA — FilmEkseni (sıfırdan, kit sözleşmesi; eski fxs köprüsünün ve
   Patron/Python akışının kendi dilimizde karşılığı — köprü artık YOK,
   site yalnız buradan yaşar.)

   Adımlar (toplam BÜTÇE ≤ 12 sn; her istek deadline'a göre kısalır):
     1. Arama:  GET /api/search?q= → JSON {data:[{title, slug,
                contentableType(Movie|TVSeries), releaseYear}]}. En fazla İKİ
                sorgu; boş transport yanıtı (429/ölü adres) bir kez yeniden
                denenir, sonra ikinci yedek adrese geçilir.
     2. Sayfa:  film → /{slug}/ · dizi → /{slug}/sezon-{S}/bolum-{E}/
                (SONDA EĞİK ÇİZGİ şart; yoksa site meta-refresh döner.)
     3. Yayın:  videoPlayerData JSON.parse('...') grupları → player.template
                (base64) içinden hat adresi:
                  · VidMoly   → embed sayfasından DOĞRUDAN master.m3u8
                  · EksenLoad → jwplayer setup JSON'undan imzalı m3u8 + tracks
                iframe ADAY DEĞİLDİR; hat çözülemezse aday çöptür.
     4. Yayın başlıkları: Referer (ölçüldü: Referer'sız EksenLoad 403) +
                User-Agent: okhttp/4.9.2. webView KULLANILMAZ (hep false).
   SİTE HIZI: hızlı vuruş 429 (boş taşıt yanıtı ~20 ms'de döner) → retry
   öncesi kısa bekleme; hat çözümleri PARALEL (farklı alan adları).
   ========================================================================== */

import {
  istek, izleyici, mutlak, koken, m3u8eCevir, medyaMi,
  kaynak, temizBaslik, tmdbMeta,
} from './kit.js';

export const kimlik = { id: 'fxs', alias: 'Vela', mediaTypes: ['movie', 'tv'] };

const BILINEN_ADRESLER = ['https://filmekseni.vip', 'https://filmekseni.top'];
const PLAYBACK_HEADERS = { 'User-Agent': 'okhttp/4.9.2', Accept: '*/*' };
const VDM_REFERER = 'https://vidmoly.net/';
const BUTCE_MS = 11000; // toplam süre tavanı (agregatör 30 sn; biz ≤12 sn)

const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = (s) => String(s || '')
  .toLowerCase()
  .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
  .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
  .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const kalanMs = (deadline, pay) => Math.max(0, deadline - Date.now() - pay);

/* Site verisi JS-sözcüğü kaçışlarıyla gömülüdür: JSON.parse('{"key":"..."}')
   gibi — JSON.parse kaçışı SÖZCÜK içinde çözmez; tek geçişte JS anlamıyla
   çöz, sonra parse et (python karşılığı: unicode_escape + json.loads). */
function kacisliJson(s) {
  const ac = String(s || '').replace(/\\(u[0-9a-fA-F]{4}|[\s\S])/g, (m, g) => {
    if (g[0] === 'u') return String.fromCharCode(parseInt(g.slice(1), 16));
    if (g === 'n') return '\n';
    if (g === 'r') return '\r';
    if (g === 't') return '\t';
    if (g === '\\' || g === '"' || g === "'" || g === '/') return g;
    return m;
  });
  try { return JSON.parse(ac); } catch (_) { return null; }
}

/* ── ADIM 1: ara() — JSON aramasından içerik sayfasının adresi ────────── */
async function aramaTek(query, taban, deadline, trace) {
  const ham = await istek(`${taban}/api/search?q=${encodeURIComponent(query)}`, {
    ref: `${taban}/`, headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
    timeout: kalanMs(deadline, 200), trace, webView: false,
  });
  return ham || '';
}

async function ara(adaylar, dizi, yil, tabanRef, deadline, trace) {
  let taban = tabanRef;
  for (const q of adaylar.slice(0, 2)) { // en fazla iki sorgu — bütçe
    let ham = await aramaTek(q, taban, deadline, trace);
    if (!ham && kalanMs(deadline, 1000) > 0) { // 429/ölü: bir kez, kısa mola ile
      await bekle(700);
      ham = await aramaTek(q, taban, deadline, trace);
    }
    if (!ham && taban === BILINEN_ADRESLER[0]) { // adres ölü olabilir: yedeğe geç
      taban = BILINEN_ADRESLER[1];
      ham = await aramaTek(q, taban, deadline, trace);
    }
    if (!ham) continue;
    // /api/search yaniti DÜZ JSON'dur (App\\Models\\...) — kacisliJson onu
    // bozar; burada doğrudan parse edilir (kaçış kırpma yalnız gömülü veri için).
    let liste = null;
    try { liste = JSON.parse(ham)?.data; } catch (_) {}
    trace.koy('arama', { q: q.slice(0, 26), n: Array.isArray(liste) ? liste.length : -1 });
    if (!Array.isArray(liste) || !liste.length) continue;
    const tipli = (it) => (dizi
      ? /series/i.test(String(it.contentableType || '')) || String(it.slug || '').startsWith('dizi/')
      : !/series/i.test(String(it.contentableType || '')) && !String(it.slug || '').startsWith('dizi/'));
    const tip = liste.filter((it) => it?.slug && tipli(it));
    let bulunan = tip.filter((it) => norm(it.title) && adaylar.some((t) => norm(t) === norm(it.title)));
    if (!bulunan.length) bulunan = tip.filter((it) => norm(it.title) && adaylar.some((t) => norm(t).includes(norm(it.title)) || norm(it.title).includes(norm(t))));
    if (yil && bulunan.length > 1) {
      const yas = bulunan.filter((it) => Math.abs((parseInt(it.releaseYear, 10) || 0) - (+yil || 0)) <= 1);
      if (yas.length) bulunan = yas;
    }
    if (bulunan.length) {
      const slug = String(bulunan[0].slug).replace(/^\/+|\/+$/g, '');
      trace.koy('eslesme', { baslik: bulunan[0].title, slug });
      return { sayfa: `${taban}/${slug}/`, taban };
    }
  }
  return null;
}

/* ── ADIM 2: hat çözücüləri (iframe asla dönmez) ───────────────────────── */
function paketCoz(ham) {
  const m = String(ham || '').match(/\}:'([^']*)',(\d+),(\d+),'([^']*)'\.split\('\|'\)/);
  if (!m) return String(ham || '');
  const [, p, aS, cS, kS] = m;
  const a = parseInt(aS, 10); const c = parseInt(cS, 10); const k = kS.split('|');
  const sozluk = {};
  const kodla = (n) => (n < a ? '' : kodla(Math.floor(n / a))) + (n % a > 35 ? String.fromCharCode(n % a + 29) : (n % a).toString(36));
  for (let i = 0; i < c; i++) sozluk[kodla(i)] = k[i];
  try {
    return p.replace(new RegExp(`\\b(${Object.keys(sozluk).filter(Boolean).join('|')})\\b`, 'g'), (x) => sozluk[x] || x);
  } catch (_) { return String(ham || ''); }
}

async function vidmolyCoz(embedUrl, deadline, trace) {
  const ham = await istek(embedUrl, { ref: VDM_REFERER, timeout: Math.min(8000, kalanMs(deadline, 200)), trace, webView: false });
  if (!ham) return '';
  let u = (ham.match(/https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*/) || [])[0]
    || (ham.match(/https?:\/\/[^\s"'<>]+\.mp4[^\s"'<>]*/) || [])[0] || '';
  if (!u && ham.includes('eval(function')) {
    for (const blok of ham.matchAll(/eval\(function\(p,a,c,k,e,?d?\).*?\)\)/g)) {
      const acik = paketCoz(blok[0]);
      const m = acik.match(/file\s*:\s*["']([^"']+\.(?:m3u8|mp4)[^"']*)["']/i);
      if (m) { u = m[1]; break; }
    }
  }
  if (!u) {
    const s = ham.match(/sources\s*:\s*\[([^\]]*)\]/);
    const f = s && s[1].match(/["']?(?:https?:)?\/\/[^"',\]]+\.(?:m3u8|mp4)[^"',\]]*/i);
    if (f) u = f[0].replace(/^["']|["']$/g, '');
  }
  return u ? m3u8eCevir(mutlak(u, embedUrl)) : '';
}

async function eksenLoadCoz(embedUrl, deadline, trace, ref) {
  // GÖMÜLÜ SAYFA koruması: Referer olarak SİTENİN kökünü ister — kendi
  // köküyle 403 döner (ölçüldü). Yayın adresi ise gömülü kökü ister; o
  // kaynak başlıklarında kalır.
  const ham = await istek(embedUrl, { ref: ref || `${koken(embedUrl)}/`, timeout: Math.min(8000, kalanMs(deadline, 200)), trace, webView: false });
  const m = ham && ham.match(/setup\(JSON\.parse\('([\s\S]*?)'\)\)/);
  const d = m && kacisliJson(m[1]);
  if (!d?.file) return null;
  const url = m3u8eCevir(mutlak(d.file, embedUrl));
  if (!medyaMi(url)) return null;
  const altyazilar = (Array.isArray(d.tracks) ? d.tracks : [])
    .filter((t) => t?.file && /\.(vtt|srt|ass)(\?|$)/i.test(t.file))
    .map((t) => {
      const u = mutlak(t.file, embedUrl);
      const label = t.label || 'Altyazı';
      return { url: u, src: u, label, language: /t[uü]rk/i.test(label) ? 'tr' : (/ing|eng/i.test(label) ? 'en' : ''),
        headers: { Referer: `${koken(embedUrl)}/`, ...PLAYBACK_HEADERS } };
    });
  return { url, altyazilar };
}

/* videoPlayerData gruplarından hat adreslerini çıkar. */
function hatBul(ham, sayfaUrl) {
  const hatlar = [];
  for (const m of String(ham || '').matchAll(/JSON\.parse\('([\s\S]*?)'\)/g)) {
    const d = kacisliJson(m[1]);
    if (!d || typeof d !== 'object') continue;
    for (const [grup, oyuncular] of Object.entries(d)) {
      if (!Array.isArray(oyuncular)) continue;
      for (const p of oyuncular) {
        const link = String(p?.link || '');
        let embed = '';
        try {
          const t = atob(String(p?.template || ''));
          const e = t.match(/(?:data-src|src)=["']([^"']+)["']/);
          if (e) embed = e[1].replace('{url}', link);
        } catch (_) {}
        if (!embed && /^https?:\/\//i.test(link)) embed = link;
        if (!embed && p?.service_slug === 'moly' && link) embed = `https://vidmoly.net/embed-${link}.html`;
        if (embed) hatlar.push({ embed: mutlak(embed, sayfaUrl), ad: `${String(p?.service_name || p?.service_slug || 'Sunucu')} ${grup}` });
      }
    }
  }
  return hatlar;
}

/* ── ADIM 3: yayın() — sayfadaki hatları DOĞRUDAN yayına çevir ─────────── */
async function yayın(sayfaUrl, deadline, trace) {
  const ham = await istek(sayfaUrl, { ref: `${koken(sayfaUrl)}/`, timeout: Math.min(8000, kalanMs(deadline, 200)), trace, webView: false });
  if (!ham) return [];
  const gorülenSayfaAltyazi = [...String(ham).matchAll(/<track\b[^>]+src=["']([^"']+)["'][^>]*>/gi)]
    .map((m) => {
      const u = mutlak(m[1], sayfaUrl);
      if (!/\.(vtt|srt)(\?|$)/i.test(u)) return null;
      const label = (m[0].match(/label=["']([^"']+)["']/i) || [])[1] || 'Altyazı';
      return { url: u, src: u, label, language: /t[uü]rk/i.test(label) ? 'tr' : (/ing|eng/i.test(label) ? 'en' : ''),
        headers: { Referer: `${koken(sayfaUrl)}/`, ...PLAYBACK_HEADERS } };
    }).filter(Boolean);

  const hatlar = hatBul(ham, sayfaUrl).slice(0, 3);
  // Hatlar FARKLI alan adlarında (vidmoly.net / eksenload.top) → paralel
  // çözüm sitenin 429 penceresine takılmaz ve bütçeyi yemez.
  const cozulen = await Promise.allSettled(hatlar.map(async (hat) => {
    const dublaj = /dublaj|dub\b|turkce dub/i.test(hat.ad);
    let bul = null;
    if (/vidmoly/i.test(hat.embed)) {
      const u = await vidmolyCoz(hat.embed, deadline, trace);
      if (u) bul = { url: u, altyazilar: [], headers: { Referer: VDM_REFERER, ...PLAYBACK_HEADERS } };
    } else if (/eksenload|vidload|firgunedavay|haccodavayup/i.test(hat.embed)) {
      const e = await eksenLoadCoz(hat.embed, deadline, trace, `${koken(sayfaUrl)}/`);
      if (e) bul = { url: e.url, altyazilar: e.altyazilar, headers: { Referer: `${koken(hat.embed)}/`, ...PLAYBACK_HEADERS } };
    } else if (medyaMi(m3u8eCevir(hat.embed))) {
      bul = { url: m3u8eCevir(hat.embed), altyazilar: [], headers: { Referer: `${koken(hat.embed)}/`, ...PLAYBACK_HEADERS } };
    } else {
      trace.koy('iframe-aday', { servis: hat.ad }); // iframe YAYIN DEĞİLDİR → çöp
      return null;
    }
    if (!bul || !medyaMi(bul.url)) return null;
    return { bul, dublaj };
  }));

  const out = [];
  for (const r of cozulen) {
    if (r.status !== 'fulfilled' || !r?.value?.bul) continue;
    const { bul, dublaj } = r.value;
    const altyazilar = [...bul.altyazilar, ...gorülenSayfaAltyazi.filter((x) => !bul.altyazilar.some((y) => y.src === x.src))];
    out.push(kaynak({
      id: `fxs_${out.length}${dublaj ? '_dub' : ''}`,
      ad: `Vela Sunucu ${out.length + 1} (${dublaj ? 'Dublaj' : 'Altyazı'})`,
      url: bul.url,
      kategori: dublaj ? 'dubbed' : 'subtitled',
      headers: bul.headers,
      altyazilar,
      kalite: '1080p',
    }));
  }
  trace.koy('yayin', { hat: hatlar.length, n: out.length });
  return out;
}

/* ── GİRİŞ NOKTASI: coz() — aggregator bunu çağırır ───────────────────── */
export async function coz({ type = 'movie', title = '', originalTitle = '', titles = [], season = 1, episode = 1, year = null, tmdbId = null } = {}) {
  const trace = izleyici();
  const t0 = Date.now();
  const deadline = t0 + BUTCE_MS;
  const dizi = type !== 'movie';
  const s = +season || 1; const e = +episode || 1;

  let anahtarlar = [...new Set([originalTitle, title, ...(titles || [])].map(temizBaslik).filter(Boolean))];
  if (!anahtarlar.length && tmdbId) {
    const meta = await tmdbMeta(tmdbId, dizi ? 'tv' : 'movie', { trace });
    anahtarlar = [...new Set([meta?.tr, meta?.orj].filter(Boolean))];
  }
  if (!anahtarlar.length) { trace.koy('sonuc', { n: 0, neden: 'baslıksız' }); return { sources: [], trace: trace.ozet() }; }

  const bulundu = await ara(anahtarlar, dizi, year, BILINEN_ADRESLER[0], deadline, trace);
  if (!bulundu) { trace.koy('sonuc', { n: 0, neden: 'arama', ms: Date.now() - t0 }); return { sources: [], trace: trace.ozet() }; }

  // Dizi: bölüm adresini dene (ölçüldü: /sezon-{S}/bolum-{E}/ geçerli).
  let hedef = bulundu.sayfa;
  if (dizi && kalanMs(deadline, 2500) > 0) {
    const epUrl = `${bulundu.sayfa}sezon-${s}/bolum-${e}/`;
    const ep = await istek(epUrl, { ref: bulundu.sayfa, timeout: kalanMs(deadline, 1500), trace, webView: false });
    if (ep && (ep.includes('videoPlayerData') || /<iframe\b/i.test(ep))) hedef = epUrl;
    trace.koy('bolum', { hedef });
  }

  const sources = await yayın(hedef, deadline, trace);
  trace.koy('sonuc', { n: sources.length, ms: Date.now() - t0 });
  return { sources, trace: trace.ozet() };
}

export default { apiVersion: 1, id: kimlik.id, name: kimlik.alias, mediaTypes: kimlik.mediaTypes, async resolve(a) { return (await coz(a)).sources; } };
