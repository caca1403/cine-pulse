/* ==========================================================================
   LUMEN — ÇizgiMax (cizgimax.online)  (sıfırdan, kit sözleşmesi)

   Çizgi film / kids kaynağı. Site 2026-10'da canlı okunup kalıp kendimiz
   çıkarıldı ve akış kit.js ile kuruldu. Eklenti referansı YOK.

   Kanıtlanmış kalıplar (2026-10-13 ölçümleri):
     1. Arama  : /api/search/suggest/?q={başlık} → JSON {animes:[{name,url}]}
                 (JSON; ~400 ms. HTML /ara/?q= yalnızca yedek.)
     2. Seri   : /diziler/{slug}-izle/ → bölüm bağlantıları
                 /{govde}-{s}-sezon-{e}-bolum-izle/  (kök dizinde)
     3. Oynatıcı: bölüm sayfasında gömülü ve BASE64 ile saklı (DMCA grep
                 koruması; sayfa yorumunda kendileri yazıyor):
                   var servers       = JSON.parse(atob("…"))  → [{type,…}]
                   var serversByLang = JSON.parse(atob("…"))  → {dub,sub,any}
     4. Sunucu tipleri ve GERÇEK yayın yolları (ölçüldü):
        • dzen (+resolveUrl) → GET resolveUrl (Referer: bölüm sayfası şart,
          yoksa 403) → {"id":"<24 hex>"} → GET upstream video API
          (tau-video.xyz/api/video/{id}, CORS'suz düz JSON) →
          urls:[{label:"1080p",url:"…*.mp4"}] → DOĞRUDAN MP4 (206, ~1.5 sn).
        • iframe + src=/oynat/?t=<imzalı token> → 302 dış embed'e gidiyor:
            - sibnet → sağlayıcı 2026-10-02'de telif ile toplu sildi; shell.php
              artık 403 (ölçüldü) → ÖLÜ.
            - dzen.ru/embed → iframe'de kalıyor, doğrudan yayın vermiyor → ELE.
        • youtube (ytId) → doğrudan m3u8/mp4 üretilemez → ELE.
        • hdfc vb. (+metaUrl) → meta.hls akış adresi doğrudan kullanılabilir.

   IFRAME YASAK: yalnız doğrudan m3u8/mp4 listelenir; iframe/oynat/youtube
   sunucuları istek atılmadan elenir (yukarıdaki ölçümler).
   ANONİMLİK: yayın başlıklarında site adı geçmez → "Lumen …"; siteden gelen
   etiketler de filtreden geçer. Yayın header'ları: Referer site kökü +
   User-Agent okhttp/4.9.2.
   HIZ: timeout ≤9 sn, sunucular PARALEL (Promise.allSettled), webView:false,
   tek denemede en fazla 2 HTML sayfası + 2-3 küçük JSON isteği, bütçe ~10 sn.
   ========================================================================== */

import {
  istek, izleyici, duzMetin, mutlak, koken, m3u8eCevir, medyaMi, kaynak,
  slugla, alanAdiCoz, kaliteBul,
} from './kit.js';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const PLAYER_UA = 'okhttp/4.9.2';
const BILINEN = ['https://cizgimax.online'];
// dzen/np sunucularının arkasındaki üst (upstream) video API'si (düz JSON, UA yeterli).
const UST_API = 'https://tau-video.xyz/api/video/';

export const kimlik = { id: 'czgx', alias: 'Lumen', mediaTypes: ['movie', 'tv'] };

let canliTaban = '';

const b64Coz = (s) => {
  try {
    // Sitede base64 içindeki '/' karakteri JS dizesi içinde '\/' olarak
    // kaçırılmış geliyor (tarayıcıda geçerli kaçıştır; ham metinde
    // kalırsa base64 alfabesi bozulur ve çözüm sessizce patlar).
    let temiz = String(s || '').replace(/\\/g, '').replace(/\s+/g, '')
      .replace(/-/g, '+').replace(/_/g, '/');
    while (temiz.length % 4) temiz += '=';
    try { return atob(temiz); } catch (_) { /* node 18: atob yoksa */ }
    return Buffer.from(temiz, 'base64').toString('utf-8');
  } catch (_) { return ''; }
};

const duz = (s) => String(s || '')
  .toLowerCase()
  .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
  .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
  .replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();

/** KATI başlık eşleşmesi (tam > öneş ek > kapsama; kapsama tek başına yetmez).
 *  Filmler yalnız TAM eşlikle kabul edilir (aşağıda eşik 6); dizilerde sitenin
 *  kaydı öneş ek olabilir ("X 2" gibi) → 2 yeterli. */
function puanla(adayAdi, hedefler, adayUrl = '') {
  const aday = duz(adayAdi);
  const slug = slugla(String(adayUrl).split('/').filter(Boolean).pop().replace(/-izle+$/, ''));
  let en = 0;
  for (const h of hedefler) {
    const hedef = duz(h);
    if (!hedef) continue;
    if (aday === hedef) en = Math.max(en, 6);
    else if (aday.startsWith(hedef)) en = Math.max(en, 4);
    else if (hedef.startsWith(aday)) en = Math.max(en, 3);
    else if (aday.includes(hedef) || hedef.includes(aday)) en = Math.max(en, 1);
    const hslug = slugla(h);
    if (slug && hslug && (slug === hslug || slug.startsWith(`${hslug}-`))) en = Math.max(en, 5);
  }
  return en >= 2 ? en : 0;
}

/** Sunucu etiketinden site adı/URL sızıntısını temizle (ANONİMLİK). */
function etiketle(s) {
  let e = duzMetin(s.label || '');
  e = e.replace(/cizgi\s*max|czgx/gi, '').replace(/https?:\/\/\S+/gi, '').replace(/\s+/g, ' ').trim();
  return (e || duzMetin(s.type || '') || 'Sunucu').slice(0, 18);
}

/* ── 1. arama ───────────────────────────────────────────────────────────── */

/** /api/search/suggest/?q= → [{ad,url}] (JSON; tek ~400 ms istek). */
async function apiAra(base, sorgu, trace) {
  const ham = await istek(`${base}/api/search/suggest/?q=${encodeURIComponent(sorgu)}`, {
    ref: `${base}/`, headers: { 'User-Agent': UA, Accept: 'application/json' },
    timeout: 8500, trace, webView: false,
  });
  const out = [];
  try {
    const j = JSON.parse(ham);
    for (const a of (j && Array.isArray(j.animes) ? j.animes : [])) {
      const ad = duzMetin(a.name || a.title || '');
      const url = mutlak(a.url || '', base);
      if (ad && url) out.push({ ad, url });
    }
  } catch (_) { /* JSON yoksa boş dön; HTML yedeği denenir */ }
  return out;
}

/** HTML arama yedeği: /ara/?q= → film-item kalıbı. */
async function htmlAra(base, sorgu, trace) {
  const ham = await istek(`${base}/ara/?q=${encodeURIComponent(sorgu)}`, {
    ref: `${base}/`, headers: { 'User-Agent': UA, Accept: 'text/html' },
    timeout: 8500, trace, webView: false,
  });
  const out = [];
  const gorulen = new Set();
  for (const m of String(ham || '').matchAll(/<div[^>]*class="film-item"[^>]*data-anime-name="([^"]+)"[\s\S]{0,900}?<a[^>]*href="(\/[^"]+izle\/?)"/gi)) {
    const ad = duzMetin(m[1]);
    const url = mutlak(m[2], base);
    if (!ad || gorulen.has(url)) continue;
    gorulen.add(url);
    out.push({ ad, url });
  }
  return out;
}

/* ── 2. bölüm adresi ────────────────────────────────────────────────────── */

/** Sayfadaki tüm bölüm bağlantılarını SAYISAL sezon/bölüm olarak çıkar.
 *  (Eski `-1-sezon-1-bolum` dize araması "11-sezon-1"i de yakalıyordu →
 *  yanlış bölüm riski; burada rakamlar ayrıştırılır.) */
function bolumHarita(ham, base) {
  const harita = [];
  for (const m of String(ham || '').matchAll(/href="(\/[a-z0-9-]+?-(\d+)-sezon-(\d+)-bolum-izle\/?)"/gi)) {
    harita.push({ url: mutlak(m[1], base), s: +m[2], e: +m[3] });
  }
  return harita;
}

/* ── 3. gömülü sunucu listesi ───────────────────────────────────────────── */

/** servers + serversByLang base64 bloklarını çöz. Yalnız DOĞRUDAN yayına
 *  gidebilecek sunucular döner (iframe/oynat ve youtube ölçülmüş ölü → ELE). */
function sunucular(ham) {
  const duzulen = [];
  for (const m of String(ham || '').matchAll(/(?:var\s+)?servers(ByLang)?\s*=\s*JSON\.parse\(\s*atob\(\s*["']([^"']+)["']\s*\)\s*\)/gi)) {
    let veri = null;
    try { veri = JSON.parse(b64Coz(m[2])); } catch (_) { continue; }
    if (Array.isArray(veri)) { duzulen.push(...veri); continue; }
    for (const dil of ['dub', 'any', 'sub']) {
      for (const s of (Array.isArray(veri && veri[dil]) ? veri[dil] : [])) {
        if (s && typeof s === 'object') duzulen.push({ dil, ...s });
      }
    }
  }
  const out = [];
  const gorulen = new Set();
  for (const s of duzulen) {
    const canli = Boolean(s.resolveUrl) || Boolean(s.metaUrl)
      || (typeof s.streamUrl === 'string' && medyaMi(s.streamUrl))
      || (typeof s.src === 'string' && medyaMi(s.src));
    if (!canli || s.notice) continue; // notice:'copyright' → ölü hane
    const anahtar = String(s.embedId || s.resolveUrl || s.src || s.streamUrl || '');
    if (!anahtar || gorulen.has(anahtar)) continue;
    gorulen.add(anahtar);
    const d = String(s.lang || s.dil || '').toLowerCase();
    out.push({
      ...s, etiket: etiketle(s),
      dil: d, dublaj: d === 'dub' || /dublaj|dubla/i.test(String(s.label || '')),
    });
  }
  return out;
}

/* ── 4. sunucu → doğrudan yayın listesi ─────────────────────────────────── */

/** Bir sunucuyu 0..N doğrudan yayına çevirir. iframe ASLA dönmez. */
async function yayingaCevir(s, ctx) {
  const sonuc = [];
  // a) np/dzen: resolveUrl → {"id"} → üst video API'si → kalite kalitesine MP4
  if (s.resolveUrl) {
    const ru = mutlak(s.resolveUrl, ctx.taban);
    // Referer: bölüm sayfası OLMADAN uç 403 veriyor (ölçüldü).
    const ham = await istek(ru, {
      ref: ctx.epUrl, headers: { 'User-Agent': UA, Accept: 'application/json' },
      timeout: 8000, trace: ctx.trace, webView: false,
    });
    let id = '';
    try { id = String(JSON.parse(ham).id || ''); } catch (_) {}
    if (!/^[a-f0-9]{16,32}$/i.test(id)) return sonuc;
    const t0 = Date.now();
    const ust = await istek(`${UST_API}${id}`, {
      ref: `${ctx.taban}/`, headers: { 'User-Agent': UA, Accept: 'application/json' },
      timeout: Math.max(1500, Math.min(8000, ctx.bitis - t0)), trace: ctx.trace, webView: false,
    });
    let veri = null;
    try { veri = JSON.parse(ust); } catch (_) {}
    for (const u of (veri && Array.isArray(veri.urls) ? veri.urls : [])) {
      const url = m3u8eCevir(String((u && u.url) || ''));
      if (medyaMi(url) && gorulmedi(ctx, url)) sonuc.push({ url, kalite: kaliteBul(String(u.label || '')) || kaliteBul(url) || '' });
    }
    // Üst API bazen captions[] de veriyor (altyazı varsa taşı).
    for (const c of (veri && Array.isArray(veri.captions) ? veri.captions : [])) {
      const u = String((c && c.url) || '');
      if (/\.(vtt|srt)(\?|$)/i.test(u)) sonuc.push({ altyazi: { url: u, src: u, label: c.name || c.lang || 'Altyazı' } });
    }
    return sonuc;
  }
  // b) hdfc ailesi: metaUrl → {hls, subs[]}
  if (s.metaUrl) {
    const mu = mutlak(s.metaUrl, ctx.taban);
    const ham = await istek(mu, {
      ref: ctx.epUrl, headers: { 'User-Agent': UA, Accept: 'application/json' },
      timeout: 8000, trace: ctx.trace, webView: false,
    });
    let meta = null;
    try { meta = JSON.parse(ham); } catch (_) {}
    const hls = m3u8eCevir(String((meta && meta.hls) || ''));
    if (medyaMi(hls) && gorulmedi(ctx, hls)) sonuc.push({ url: hls, kalite: kaliteBul(hls) });
    for (const sb of (meta && Array.isArray(meta.subs) ? meta.subs : [])) {
      const u = mutlak(String(sb.url || ''), ctx.taban);
      if (/\.(vtt|srt)(\?|$)/i.test(u)) sonuc.push({ altyazi: { url: u, src: u, label: sb.name || sb.lang || 'Altyazı' } });
    }
    return sonuc;
  }
  // c) Doğrudan adres taşıyan sunucu
  const dogrudan = m3u8eCevir(mutlak(String(s.streamUrl || s.src || ''), ctx.taban));
  if (medyaMi(dogrudan) && gorulmedi(ctx, dogrudan)) sonuc.push({ url: dogrudan, kalite: kaliteBul(dogrudan) });
  return sonuc;
}

const gorulmedi = (ctx, url) => {
  if (ctx.adresler.has(url)) return false;
  ctx.adresler.add(url);
  return true;
};

/* ── ana akış ───────────────────────────────────────────────────────────── */

export async function coz({ type = 'tv', title = '', originalTitle = '', titles = [], season = 1, episode = 1 } = {}) {
  const trace = izleyici();
  const s = +season || 1;
  const e = +episode || 1;
  const hedefler = [...new Set([originalTitle, title, ...titles].filter((t) => t && String(t).trim().length > 1))];
  if (!hedefler.length) return { sources: [], trace: trace.ozet() };

  // — 1. seri adayı. HIZ: alan adı her açılışta doğrulanmaz; bilinen adresle
  //    başlanır, yalnız arama boş kalırsa canlı adrese düşülür.
  const taban = canliTaban || BILINEN[0];
  let adaySay = 0;
  const ara = async (base) => {
    let adaylar = [];
    for (const q of [...new Set(hedefler.slice(0, 2))]) {
      let bulunan = await apiAra(base, q, trace);
      if (!bulunan.length) bulunan = await htmlAra(base, q, trace);
      trace.koy('arama', { q, n: bulunan.length });
      adaylar = adaylar.concat(bulunan);
      if (adaylar.some((a) => puanla(a.ad, hedefler, a.url) >= 6)) break;
    }
    adaySay = Math.max(adaySay, adaylar.length);
    let secenek = null; let enPuan = 0;
    for (const a of adaylar) {
      const p = puanla(a.ad, hedefler, a.url);
      if (p > enPuan) { enPuan = p; secenek = a; }
    }
    // FİLM: öneş ek yetmez (site kaydı başka iş olabilir) → TAM eşik şart.
    if (type === 'movie' && enPuan < 6) return null;
    return secenek;
  };
  let secenek = await ara(taban);
  // Yalnız hiçbir aday dönmezse (alan adı değişmiş/ölü olabilir) canlı adresi
  // çözüp bir kez daha ara. Aday var ama başlık eşleşmediyse alan adı zaten
  // çalışıyor → gereksiz yere siteurl.txt + kök isteği atma.
  if (!secenek && adaySay === 0) {
    // alan adı değişmiş olabilir → siteurl.txt üzerinden bir kez daha dene
    const yeni = await alanAdiCoz('cizgimax', BILINEN, { trace, ua: UA });
    if (yeni && yeni !== taban) {
      const ikinci = await ara(yeni);
      if (ikinci) { canliTaban = yeni; secenek = ikinci; }
    }
  }
  trace.koy('seri', { secili: secenek ? secenek.ad : '' });
  if (!secenek) return { sources: [], trace: trace.ozet() };

  // — 2. bölüm sayfası (tek HTML sayfa isteği; filmde ilk bölüm oynatılır)
  const seriHam = await istek(secenek.url, { ref: `${taban}/`, headers: { 'User-Agent': UA }, timeout: 9000, trace, webView: false });
  const harita = bolumHarita(seriHam, secenek.url);
  let istenen = harita.find((x) => x.s === s && x.e === e);
  if (!istenen && type === 'movie') istenen = harita[0];
  let epUrl = istenen ? istenen.url : '';
  if (!epUrl && type !== 'movie') {
    // bölüm listesi JS ile geç doluyorsa adres kalıbını bir kez doğrula
    const parca = String(secenek.url).replace(/\/+$/, '').split('/').pop() || '';
    const govde = parca.replace(/(-izle)+$/i, '');
    const tahmin = govde ? mutlak(`/${govde}-${s}-sezon-${e}-bolum-izle/`, taban) : '';
    if (tahmin && await istek(tahmin, { ref: secenek.url, headers: { 'User-Agent': UA }, timeout: 8000, trace, webView: false })) epUrl = tahmin;
  }
  trace.koy('bolum', { s, e, url: epUrl });
  if (!epUrl) return { sources: [], trace: trace.ozet() };

  const epHam = await istek(epUrl, { ref: secenek.url, headers: { 'User-Agent': UA }, timeout: 9000, trace, webView: false });
  if (!epHam) return { sources: [], trace: trace.ozet() };

  // — 3. sunucular PARALEL (bütçe ~7 sn; iframe'ler zaten elenmiş)
  const ctx = { taban, epUrl, bitis: Date.now() + 7000, trace, adresler: new Set() };
  const liste = sunucular(epHam).slice(0, 4);
  const cozulen = await Promise.allSettled(liste.map((x) => yayingaCevir(x, ctx)));

  // — 4. kaynak listesi (yalnız doğrudan medya; iframe YASAK)
  const altyaziPay = [];
  cozulen.forEach((r) => {
    if (r.status !== 'fulfilled' || !Array.isArray(r.value)) return;
    for (const parca of r.value) if (parca.altyazi) altyaziPay.push(parca.altyazi);
  });
  const kaynaklar = [];
  const gorulanUr = new Set();
  cozulen.forEach((r, i) => {
    if (r.status !== 'fulfilled' || !Array.isArray(r.value)) return;
    const sunucu = liste[i];
    for (const parca of r.value) {
      if (!parca.url || gorulanUr.has(parca.url)) continue;
      gorulanUr.add(parca.url);
      const kalite = parca.kalite || kaliteBul(sunucu.etiket) || '1080p';
      kaynaklar.push(kaynak({
        id: `czgx_${slugla(secenek.ad) || 'cizgi'}_s${s}e${e}_${slugla(sunucu.etiket) || i}_${slugla(kalite) || 'x'}_${sunucu.dublaj ? 'dub' : 'sub'}`,
        ad: `Lumen ${sunucu.etiket} ${kalite} ${sunucu.dublaj ? 'TR Dublaj' : 'TR Altyazı'}`,
        url: parca.url,
        kategori: sunucu.dublaj ? 'dubbed' : 'subtitled',
        headers: { Referer: `${koken(parca.url) || taban}/`, 'User-Agent': PLAYER_UA, Accept: '*/*' },
        altyazilar: altyaziPay.slice(0, 6),
        kalite,
      }));
    }
  });
  trace.koy('sonuc', { sunucu: liste.length, n: kaynaklar.length });
  return { sources: kaynaklar, trace: trace.ozet() };
}

export default {
  apiVersion: 1,
  id: kimlik.id,
  name: kimlik.alias,
  mediaTypes: kimlik.mediaTypes,
  async resolve(a) { return (await coz(a)).sources; },
};
