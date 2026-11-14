/* ==========================================================================
   MULTIDUBENDGAME — yıldızlı TR dublaj arşiv kaynakları
   --------------------------------------------------------------------------
   Üç site (artı filmmakinesi) TR dublaj konusunda sektörün fiilî arşividir.
   Bu modül onları "yıldızlı kaynak" olarak bağlar: kendi arama uçlarından
   içeriği bulur, DUBLAJ BEYANINI okur ve elde ettiği kanıtı TR Dublaj
   Sicili'ne (`dublajSicili.js`) yazar. Böylece:
     · kanıt bir kez öğrenilir, cihazda kalıcı olur (site kapansa da bilgi kalır),
     · sonraki açılışlarda siteye gitmeden doğru sağlayıcı bilinir,
     · aynı içerik için onlarca çekirdek taranmaz — arama sırası akıllanır.

   YILDIZLI KAYNAKLAR (hepsi 2026-11-14 canlı ölçüldü):
     HDFC        hdfilmcehennemi.nl   GET /search/?q=<sorgu>   → JSON {query,results[]}
                                      Sonuçlar hazır HTML kartlarıdır; href + alt
                                      metninden başlık/yıl/IMDb çıkarılır.
     SELCUKFLIX  selcukflix.app       POST /api/mj {action:'searchContent',params:[q]}
                                      Next.js RPC. `object_language` alanı
                                      "Türkçe Dublaj" gibi DOĞRUDAN dil beyanı taşır.
     DIZILLA     dizilla.la           POST /api/mj (selcukflix ile aynı vendor RPC'si)
                                      Action adı siteden siteye değişebilir; modül
                                      adayları sırayla dener ve ilk çalışanı
                                      (oturum içinde) hatırlar.
     FILMMAKINESI filmmakinesi.to     GET /arama/?s=<sorgu>
                                      Kartlarda `Dual` rozeti = TR dublaj işareti.
                                      Site düz curl'e 403 verir; TAM tarayıcı
                                      başlıkları (Sec-Fetch-*, Accept-Language)
                                      ile 200 döner — tarayiciBasliklari() bunu kurar.

   TASARIM KURALLARI (bağlayıcı):
     1) Ağ hatası ASLA fırlatılmaz. Her kaynak bağımsız `Promise` döner; biri
        düşerse diğerleri devam eder (`toplaHepsi` hepsini bekler).
     2) Beyan ≠ kanıt. `Türkçe Dublaj` yazısı `kanit:'etiket'` olarak yazılır;
        gerçek m3u8 ses izi kanıtı ayrı katmandan (`akisanDilKaniti`) gelir.
        Sicil bu ayrımı zaten uygular (etiketle 'dublaj' yazılmaz).
     3) Gerçek alan adları yalnız bu dosyada ve `native-routes.json`'dadır;
        arayüze çıkan sağlayıcı adı yıldız kodudur (`star:hdfc` gibi).
     4) Her istek zaman aşımlı; yavaş site tüm aramayı kilitlemez.
   ========================================================================== */

import { kanitIsle, icerikAnahtari } from './dublajSicili.js';

/* ── Sabitler ─────────────────────────────────────────────────────────────── */

/** Yıldızlı kaynak tanımları. `kod` sicildeki sağlayıcı anahtarıdır. */
export const YILDIZ_KAYNAKLAR = Object.freeze([
  {
    kod: 'star:hdfc',
    ad: 'Multidub HDFC',
    taban: 'https://www.hdfilmcehennemi.nl',
    tur: 'html-json',
  },
  {
    kod: 'star:selcukflix',
    ad: 'Multidub Selçukflix',
    taban: 'https://selcukflix.app',
    tur: 'rpc',
  },
  {
    kod: 'star:dizilla',
    ad: 'Multidub Dizilla',
    taban: 'https://dizilla.la',
    tur: 'rpc',
  },
  {
    kod: 'star:filmmakinesi',
    ad: 'Multidub FilmMakinesi',
    taban: 'https://filmmakinesi.to',
    tur: 'html-html',
  },
]);

/** Dizilla/ Selçukflix RPC'sinde denenecek action adları (ilk çalışan kazanır). */
const RPC_ARAMA_ACTIONLARI = Object.freeze([
  'searchContent',
  'searchTitles',
  'search',
  'getSearchResults',
  'ara',
  'findTitles',
]);

/** RPC params varyantları (`{q}` yerine sorgu konur). */
const RPC_PARAM_VARYANTLARI = Object.freeze([
  (q) => [q],
  (q) => [q, 1],
  (q) => [q, 'all'],
]);

/** Dizilla `getBrowseTitles` parametre şablonu (2026-11-14 canlı ölçüldü).
 *  Sıra: [sorgu, tür, tür?, bölge?, ülke?, türler?, ağlar?, yıllar?, durum?,
 *        minImdb?, yayında?, sezon?, bölüm?, sıralama, sayfa, sayfaBoyu]
 *  Yalnız ilk ikisi ve son üçü anlamlı; aradakiler null (filtresiz). */
const DIZILLA_PARAM = (q, tur, sayfa = 1) => [q, tur, null, null, null, null, null, 'rec', sayfa, 20];

const VARSAYILAN_MS = 12000;

/** Tarayıcı başlıkları: filmmakinesi düz curl'e 403 veriyor, bunlarla 200. */
export function tarayiciBasliklari(extra = {}) {
  return {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      + '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'sec-ch-ua': '"Chromium";v="131", "Not_A Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    ...extra,
  };
}

/* ── Yardımcılar ──────────────────────────────────────────────────────────── */

const metinTemizle = (s) => String(s ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

/** HTML varlıklarını çözer (&ouml; → ö gibi). */
export function htmlCoz(metin) {
  const tablo = {
    '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'",
    '&nbsp;': ' ', '&ouml;': 'ö', '&uuml;': 'ü', '&ccedil;': 'ç',
    '&Ouml;': 'Ö', '&Uuml;': 'Ü', '&Ccedil;': 'Ç', '&rsquo;': '’',
    '&lsquo;': '‘', '&ndash;': '–', '&mdash;': '—', '&hellip;': '…',
  };
  return String(metin ?? '').replace(/&[a-zA-Z#0-9]+;/g, (m) => tablo[m] ?? m);
}

/** Türkçe karakterleri ASCII'ye indirger (karşılaştırma için). */
export function sadelestir(s) {
  return String(s ?? '').toLowerCase()
    .replace(/ı/g, 'i').replace(/i̇/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/ş/g, 's').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c');
}

/** Karşılaştırma için kelime kümesi (tek harfliler ve noktalama atılır). */
function kelimeKumesi(s) {
  return new Set(
    sadelestir(s).replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
      .split(' ').filter((w) => w.length > 1),
  );
}

/**
 * Başlık benzerliği (0..1): Dice katsayısı — 2·|kesişim| / (|A|+|B|).
 * Amaç "Dövüş Kulübü - Fight Club" ↔ "Fight Club" eşleşmesi: kesişim 2,
 * boyutlar 4+2 → 2*2/6 = 0.667. Eşit kümelerde tam 1, ilgisizde 0.
 */
export function baslikBenzerligi(a, b) {
  const A = kelimeKumesi(a);
  const B = kelimeKumesi(b);
  if (!A.size || !B.size) return 0;
  let kesisim = 0;
  for (const w of A) if (B.has(w)) kesisim += 1;
  return (2 * kesisim) / (A.size + B.size);
}

/** Yıl çıkarır (1900-2100 arası ilk 4 haneli sayı). */
export function yilCikar(metin) {
  const m = String(metin ?? '').match(/\b(19\d{2}|20\d{2})\b/);
  return m ? Number(m[1]) : null;
}

/** IMDb kimliği çıkarır (tt + 7-8 hane). */
export function imdbCikar(metin) {
  const m = String(metin ?? '').match(/\b(tt\d{6,9})\b/);
  return m ? m[1] : '';
}

/** Dublaj beyanını okur: metinden TR dublaj / altyazı / özgün sinyali üretir.
 *  Dönen: { dilDurumu, kanit:'etiket'|'yok', sinyal: 'dublaj'|'altyazi'|'orijinal'|'' } */
export function dublajBeyani(metin) {
  const t = String(metin ?? '');
  const varMi = (re) => re.test(t);
  // Türkçe dublaj işaretleri (öncelik sırası önemli: "dublaj" > "altyazı").
  if (varMi(/t[üu]rk[çc]e\s*dublaj|t[üu]rk[çc]e\s*seslendirme|\bdublaj\b|dublajl[ıi]|\bdual\b/i)) {
    return { dilDurumu: 'dublaj', kanit: 'etiket', sinyal: 'dublaj' };
  }
  if (varMi(/t[üu]rk[çc]e\s*altyaz|\baltyaz[ıi]?l?[ıi]?\b|\bsubtitled?\b|\bsub\b/i)) {
    return { dilDurumu: 'altyazi', kanit: 'etiket', sinyal: 'altyazi' };
  }
  if (varMi(/\borijinal\b|\boriginal\b|\bözgün\b/i)) {
    return { dilDurumu: 'orijinal', kanit: 'etiket', sinyal: 'orijinal' };
  }
  return { dilDurumu: 'bilinmiyor', kanit: 'yok', sinyal: '' };
}

/** Güvenli JSON ayrıştırma (bozuk HTML gövdesi → null). */
export function jsonDene(metin) {
  try { return JSON.parse(metin); } catch (_) { return null; }
}

async function zamanAsimliFetch(fetchFn, adres, secenek = {}, ms = VARSAYILAN_MS) {
  const sinyal = typeof AbortSignal !== 'undefined' && AbortSignal.timeout
    ? AbortSignal.timeout(ms)
    : undefined;
  return fetchFn(adres, { ...secenek, signal: secenek.signal || sinyal });
}

/* ── Kaynak adaptörleri ───────────────────────────────────────────────────── */

/**
 * HDFC: GET /search/?q=<sorgu> → JSON {query, results:[html, html, ...]}.
 * Her öğe hazır bir <a class="search-result"> kartıdır.
 * @returns {Promise<Array>} aday listesi
 */
export async function hdfcAra(query, { fetchFn = globalThis.fetch, ms = VARSAYILAN_MS } = {}) {
  if (!query) return [];
  const adres = `https://www.hdfilmcehennemi.nl/search/?q=${encodeURIComponent(query)}`;
  const y = await zamanAsimliFetch(fetchFn, adres, {
    headers: tarayiciBasliklari({ 'X-Requested-With': 'fetch', Accept: 'application/json' }),
    redirect: 'follow',
  }, ms);
  if (!y || !y.ok) return [];
  const metin = await y.text();
  const j = jsonDene(metin);
  const kartlar = Array.isArray(j?.results) ? j.results : [];
  const adaylar = [];
  for (const kart of kartlar) {
    const ham = String(kart ?? '');
    if (!ham) continue;
    const yil = yilCikar(ham);
    const href = (ham.match(/href="([^"]+)"/) || [])[1] || '';
    // Başlık: alt özniteliği tam "Dövüş Kulübü - Fight Club" biçimindedir.
    const alt = htmlCoz((ham.match(/alt="([^"]*)"/) || [])[1] || '');
    const h4 = htmlCoz(metinTemizle((ham.match(/class="title"[^>]*>([\s\S]*?)<\/h4>/) || [])[1] || ''));
    const baslik = h4 || alt || '';
    if (!baslik || !href) continue;
    const imdb = imdbCikar(ham);
    // Kart türü (Film / Dizi) ve IMDb puanı.
    const turMetni = metinTemizle((ham.match(/class="type"[^>]*>([\s\S]*?)<\/span>/) || [])[1] || '');
    const dil = dublajBeyani(`${baslik} ${alt} ${ham.slice(0, 400)}`);
    adaylar.push({
      kaynak: 'star:hdfc',
      baslik,
      alt,
      adres: href.startsWith('http') ? href : `https://www.hdfilmcehennemi.nl${href}`,
      yil,
      imdb,
      tur: /dizi/i.test(turMetni) ? 'tv' : 'movie',
      dilDurumu: dil.dilDurumu,
      kanit: dil.kanit,
      beyanMetni: dil.sinyal,
    });
  }
  return adaylar;
}

/**
 * Selçukflix / Dizilla: POST /api/mj {action, params}.
 * `object_language` alanı DOĞRUDAN dil beyanıdır ("Türkçe Dublaj").
 * Dizilla'da action adı farklı olabilir; adaylar sırayla denenir.
 * @param {object} secenek.denenenAction — oturumlar arası hatırlanan action
 */
export async function rpcAra(taban, query, {
  fetchFn = globalThis.fetch, ms = VARSAYILAN_MS, denenenAction = null,
} = {}) {
  if (!query) return { adaylar: [], action: denenenAction };
  const origin = new URL(taban).origin;
  const adres = `${origin}/api/mj`;
  const denenecek = denenenAction
    ? [denenenAction, ...RPC_ARAMA_ACTIONLARI.filter((a) => a !== denenenAction)]
    : [...RPC_ARAMA_ACTIONLARI];
  let sonHata = '';

  for (const action of denenecek) {
    for (const paramUret of RPC_PARAM_VARYANTLARI) {
      let y;
      try {
        y = await zamanAsimliFetch(fetchFn, adres, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': tarayiciBasliklari()['User-Agent'],
            'Accept': 'application/json',
            'Origin': origin,
            'Referer': `${origin}/ara?q=${encodeURIComponent(query)}`,
          },
          body: JSON.stringify({ action, params: paramUret(query) }),
          redirect: 'follow',
        }, ms);
      } catch (hata) { sonHata = String(hata?.message || hata).slice(0, 100); continue; }
      if (!y || !y.ok) { sonHata = `http-${y?.status || 'yok'}`; continue; }
      const j = jsonDene(await y.text());
      if (!j || j.ok === false) { sonHata = String(j?.error || 'basarisiz'); continue; }
      const liste = Array.isArray(j.result) ? j.result : (Array.isArray(j.results) ? j.results : null);
      if (!liste) { sonHata = 'sonuc-bicimi'; continue; }
      const adaylar = liste.map((x) => rpcAdayaCevir(x, taban)).filter(Boolean);
      return { adaylar, action, hata: '' };
    }
  }
  return { adaylar: [], action: denenenAction, hata: sonHata || 'bos' };
}

/** RPC sonuç nesnesini ortak aday biçimine çevirir. */
export function rpcAdayaCevir(x, taban) {
  if (!x || typeof x !== 'object') return null;
  const baslik = htmlCoz(String(x.object_name || x.title || x.name || '')).trim();
  if (!baslik) return null;
  const slug = String(x.used_slug || x.slug || '').replace(/^\/+/, '');
  const origin = (() => { try { return new URL(taban).origin; } catch (_) { return String(taban).replace(/\/+$/, ''); } })();
  const adres = slug ? `${origin}/${slug}` : '';
  // object_language doğrudan dil beyanı: "Türkçe Dublaj" gibi.
  const dilMetni = [x.object_language, x.object_name_alternative, x.object_alternative_name].filter(Boolean).join(' ');
  const dil = dublajBeyani(dilMetni);
  const tipMetni = String(x.used_type || x.type || '');
  return {
    kaynak: '',
    baslik,
    alt: htmlCoz(String(x.object_alternative_name || x.object_name_alternative || '')).trim(),
    adres,
    slug,
    yil: Number(x.object_release_year) || yilCikar(x.object_release_date),
    imdb: String(x.object_related_imdb_id || ''),
    tur: /tv|series|dizi/i.test(tipMetni) ? 'tv' : 'movie',
    dilDurumu: dil.dilDurumu,
    kanit: dil.kanit,
    beyanMetni: dil.sinyal,
    hamDil: String(x.object_language || ''),
  };
}

export async function selcukflixAra(query, opts = {}) {
  const { adaylar, action, hata } = await rpcAra('https://selcukflix.app', query, opts);
  return { adaylar: adaylar.map((a) => ({ ...a, kaynak: 'star:selcukflix' })), action, hata: hata || '' };
}

/**
 * Dizilla: DİZİ-ONLY bir sitedir (film rotası yok; canlı ölçüm 2026-11-14).
 * Arama ucu `POST /api/mj {action:'getBrowseTitles', params:[...]}`.
 * `Origin` + `Referer` ZORUNLUDUR (yoksa 403 forbidden).
 * Dil bilgisi sözleşmesi Selçukflix'ten farklı: ayrı `object_language` alanı
 * YOKTUR. Aynı dizi iki kayıt olarak döner; Türkçe dublaj olanın slug'ı
 * `-turkce-dublaj` ile biter. Dil kararı SLUG'dan verilir (beyan = etiket).
 * @returns {Promise<{adaylar: Array, action: string, hata: string}>}
 */
export async function dizillaAra(query, { fetchFn = globalThis.fetch, ms = VARSAYILAN_MS } = {}) {
  if (!query) return { adaylar: [], action: 'getBrowseTitles', hata: '' };
  const origin = 'https://dizilla.la';
  const adres = `${origin}/api/mj`;

  // Dizi sitesi olduğu için yalnız 'dizi' türü aranır. 'film' denemesi
  // her zaman total:0 döner (ölçüldü) — ağ israfı yapılmaz.
  let sonHata = '';
  for (const tur of ['dizi']) {
    for (const sayfa of [1, 2]) {
      let y;
      try {
        y = await zamanAsimliFetch(fetchFn, adres, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': tarayiciBasliklari()['User-Agent'],
            'Accept': 'application/json',
            // Origin + Referer zorunlu — biri eksikse {"ok":false,"code":403}.
            'Origin': origin,
            'Referer': `${origin}/`,
          },
          body: JSON.stringify({ action: 'getBrowseTitles', params: DIZILLA_PARAM(query, tur, sayfa) }),
          redirect: 'follow',
        }, ms);
      } catch (hata) { sonHata = String(hata?.message || hata).slice(0, 100); continue; }
      if (!y || !y.ok) { sonHata = `http-${y?.status || 'yok'}`; continue; }
      const j = jsonDene(await y.text());
      if (!j || j.ok === false) { sonHata = String(j?.error || 'basarisiz'); continue; }
      const veri = j.result || {};
      const items = Array.isArray(veri.items) ? veri.items : [];
      if (!items.length) break; // bu türde sonuç yok — sonraki tür
      const adaylar = items.map((x) => dizillaAdayaCevir(x, origin)).filter(Boolean);
      // Sayfa doluysa devam et (en fazla 2 sayfa: 40 aday yeter).
      if (items.length < 20 || sayfa >= 2) return { adaylar, action: 'getBrowseTitles', hata: '' };
      const ilkSayfa = adaylar;
      // İkinci sayfa için döngü devam eder; biriken liste aşağıda birleşir.
      const ikinci = await dizillaAraSayfa(query, tur, origin, fetchFn, ms, 2);
      return { adaylar: [...ilkSayfa, ...ikinci], action: 'getBrowseTitles', hata: '' };
    }
  }
  return { adaylar: [], action: 'getBrowseTitles', hata: sonHata };
}

/** Dizilla tek sayfa yardımcısı (sessiz; hata → boş liste). */
async function dizillaAraSayfa(query, tur, origin, fetchFn, ms, sayfa) {
  try {
    const y = await zamanAsimliFetch(fetchFn, `${origin}/api/mj`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': tarayiciBasliklari()['User-Agent'],
        'Accept': 'application/json',
        'Origin': origin,
        'Referer': `${origin}/`,
      },
      body: JSON.stringify({ action: 'getBrowseTitles', params: DIZILLA_PARAM(query, tur, sayfa) }),
    }, ms);
    if (!y || !y.ok) return [];
    const j = jsonDene(await y.text());
    const items = Array.isArray(j?.result?.items) ? j.result.items : [];
    return items.map((x) => dizillaAdayaCevir(x, origin)).filter(Boolean);
  } catch (_) { return []; }
}

/**
 * Dizilla item → ortak aday. Dil kararı slug sonekinden:
 * `/dizi/lupin-turkce-dublaj` → dublaj. Alan adı 28 alanlı şemada
 * `object_language` benzeri bir dil alanı YOK (canlı ölçüm).
 */
export function dizillaAdayaCevir(x, taban) {
  if (!x || typeof x !== 'object') return null;
  const baslik = htmlCoz(String(x.title || x.title_tr || '')).trim();
  if (!baslik) return null;
  const slug = String(x.url || x.slug || '').replace(/^\/+/, '');
  const origin = (() => { try { return new URL(taban).origin; } catch (_) { return String(taban).replace(/\/+$/, ''); } })();
  const adres = slug ? `${origin}/${slug}` : '';
  // TR dublaj işareti: slug soneki ya da başlık metni.
  const dilMetni = `${slug} ${baslik}`;
  const trDublaj = /turkce-dublaj|türkçe-dublaj/i.test(dilMetni) || /türkçe dublaj/i.test(baslik);
  const dil = trDublaj
    ? { dilDurumu: 'dublaj', kanit: 'etiket', sinyal: 'dublaj' }
    : dublajBeyani(dilMetni);
  return {
    kaynak: 'star:dizilla',
    baslik,
    alt: htmlCoz(String(x.original_title || '')).trim(),
    adres,
    slug,
    yil: Number(x.year) || null,
    imdb: '',                       // Dizilla IMDb kimliği vermiyor (imdb alanı PUAN)
    puan: Number(x.imdb) || null,
    tur: 'tv',                      // site dizi-only
    dilDurumu: dil.dilDurumu,
    kanit: dil.kanit,
    beyanMetni: dil.sinyal,
    hamDil: trDublaj ? 'turkce-dublaj (slug)' : '',
  };
}

/**
 * FilmMakinesi: GET /arama/?s=<sorgu> → HTML kartlar.
 * Kartlarda `Dual` rozeti TR dublaj işaretidir; `Altyazı` rozeti altyazı.
 */
async function filmmakinesiHtmlAl(adres, { fetchFn = globalThis.fetch, ms = VARSAYILAN_MS } = {}) {
  // Android Capacitor: NativeMediaGateway Java TLS'i CF'ye 403 takılır;
  // CapacitorHttp + gerçek cihaz UA'sı ve gerekirse WebView challenge çözücüsü geçer.
  if (typeof window !== 'undefined' && window.Capacitor?.Plugins?.CapacitorHttp) {
    const cihazUA = (typeof navigator !== 'undefined' && navigator.userAgent) || tarayiciBasliklari()['User-Agent'];
    try {
      const r = await window.Capacitor.Plugins.CapacitorHttp.get({
        url: adres,
        headers: {
          'User-Agent': cihazUA,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
          Referer: 'https://filmmakinesi.to/',
        },
        responseType: 'text',
        connectTimeout: 8000,
        readTimeout: ms,
      });
      const metin = typeof r?.data === 'string' ? r.data : '';
      if (metin && !/just a moment|verifying you are human/i.test(metin.slice(0, 4000))) return metin;
    } catch (_) {}
    try {
      const { fetchTextWithSession } = await import('../platform/androidChallengeSolver.js');
      const c = await fetchTextWithSession(adres, {
        referer: 'https://filmmakinesi.to/',
        timeoutMs: ms,
        headers: { 'User-Agent': cihazUA },
      });
      if (c?.text && !/just a moment|verifying you are human/i.test(c.text.slice(0, 4000))) return c.text;
    } catch (_) {}
    return '';
  }

  // Electron masaüstü: Chromium'un kendi fetch'i CF TLS'ini geçer; /api/proxy (Node) 403 alabilir.
  if (typeof window !== 'undefined' && window.CinePulseDesktop?.isDesktop === true && typeof globalThis.fetch === 'function') {
    try {
      const y = await zamanAsimliFetch(globalThis.fetch, adres, { headers: tarayiciBasliklari() }, ms);
      if (y && y.ok) {
        const html = await y.text();
        if (html && !/just a moment|verifying you are human/i.test(html.slice(0, 4000))) return html;
      }
    } catch (_) {}
  }

  const y = await zamanAsimliFetch(fetchFn, adres, { headers: tarayiciBasliklari() }, ms);
  if (!y || !y.ok) return '';
  return y.text();
}

export async function filmmakinesiAra(query, { fetchFn = globalThis.fetch, ms = VARSAYILAN_MS } = {}) {
  if (!query) return [];
  const adres = `https://filmmakinesi.to/arama/?s=${encodeURIComponent(query)}`;
  const html = await filmmakinesiHtmlAl(adres, { fetchFn, ms });
  if (!html) return [];
  const adaylar = [];
  // Kart: <a class="item" href="..." data-title="..." data-score="..."> ... rozetler ... </a>
  const kartRe = /<a class="item"\s+href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/g;
  let m;
  while ((m = kartRe.exec(html))) {
    const href = m[1];
    const ozellikler = m[2];
    const govde = m[3];
    const baslik = htmlCoz((ozellikler.match(/data-title="([^"]*)"/) || [])[1] || '');
    if (!baslik) continue;
    const puan = Number((ozellikler.match(/data-score="([^"]*)"/) || [])[1]) || null;
    const turMetni = String((ozellikler.match(/data-type="([^"]*)"/) || [])[1] || '');
    // Rozetler: <div class="item-info"><div>HD</div><div>Dual</div></div>
    const rozetler = [...govde.matchAll(/<div>([^<]{1,24})<\/div>/g)].map((x) => x[1].trim());
    const rozetMetni = rozetler.join(' ');
    const dil = dublajBeyani(rozetMetni || govde.slice(0, 300));
    /* Yıl kartın ALT BİLGİ satırındadır: <div class="info"><span>2022</span>
       <span>104 Dakika</span></div> — data-* özniteliklerinde yıl YOK. */
    const infoMetni = metinTemizle((govde.match(/class="info"[^>]*>([\s\S]*?)<\/div>/) || [])[1] || '');
    const yil = yilCikar(infoMetni) || yilCikar(govde);
    const tip = /^\/dizi\//.test(href) ? 'tv' : 'movie';
    adaylar.push({
      kaynak: 'star:filmmakinesi',
      baslik,
      alt: '',
      adres: href.startsWith('http') ? href : `https://filmmakinesi.to${href}`,
      yil,
      imdb: imdbCikar(ozellikler),
      tur: tip,
      puan,
      turMetni,
      rozetler,
      dilDurumu: dil.dilDurumu,
      kanit: dil.kanit,
      beyanMetni: dil.sinyal,
    });
  }
  return adaylar;
}

/* ── Birleşik toplayıcı ───────────────────────────────────────────────────── */

/**
 * Tüm yıldızlı kaynaklarda paralel arar. Hiçbiri fırlatmaz.
 * @param {string} query
 * @param {{fetchFn?: Function, ms?: number, kaynaklar?: string[], rpcAction?: object}} secenek
 * @returns {Promise<{adaylar: Array, kaynakDurumu: object, rpcAction: object}>}
 */
export async function toplaHepsi(query, secenek = {}) {
  const fetchFn = secenek.fetchFn || globalThis.fetch;
  const ms = secenek.ms || VARSAYILAN_MS;
  const secili = Array.isArray(secenek.kaynaklar) && secenek.kaynaklar.length
    ? new Set(secenek.kaynaklar)
    : null;
  const rpcAction = { ...(secenek.rpcAction || {}) };
  const kaynakDurumu = {};
  const kanallar = {};

  /* Her kaynak bağımsız koşar; biri düşerse diğeri devam eder. Tek bir kaynak
     try/catch ile yutulur, hata `kaynakDurumu`nda görünür kalır (sessiz yutma
     yok — teşhis edilebilirlik korunur). */
  const kos = (kod, fn) => {
    if (secili && !secili.has(kod)) return Promise.resolve();
    const bas = Date.now();
    return Promise.resolve()
      .then(fn)
      .then((sonuc) => {
        kanallar[kod] = (sonuc?.adaylar || sonuc || []);
        // Adaptör kendi içinde hatayı yakalayabilir (ör. dizilla); o durumda
        // hata `hata` alanıyla gelir ve yine raporlanır — sessiz yutma yok.
        kaynakDurumu[kod] = {
          ok: !sonuc?.hata, adet: kanallar[kod].length, ms: Date.now() - bas,
          ...(sonuc?.hata ? { hata: String(sonuc.hata).slice(0, 120) } : {}),
        };
      })
      .catch((hata) => {
        kanallar[kod] = [];
        kaynakDurumu[kod] = {
          ok: false, adet: 0, ms: Date.now() - bas,
          hata: String(hata?.message || hata).slice(0, 120),
        };
      });
  };

  await Promise.all([
    kos('star:hdfc', () => hdfcAra(query, { fetchFn, ms })),
    kos('star:selcukflix', async () => {
      const r = await selcukflixAra(query, { fetchFn, ms, denenenAction: rpcAction['star:selcukflix'] || null });
      if (r.action) rpcAction['star:selcukflix'] = r.action;
      return { adaylar: r.adaylar, hata: r.hata };
    }),
    kos('star:dizilla', async () => {
      const r = await dizillaAra(query, { fetchFn, ms });
      return { adaylar: r.adaylar, hata: r.hata };
    }),
    kos('star:filmmakinesi', () => filmmakinesiAra(query, { fetchFn, ms })),
  ]);

  const adaylar = Object.values(kanallar).flat();
  return { adaylar, kaynakDurumu, rpcAction };
}

/* ── Eşleştirme + sicile yazma ────────────────────────────────────────────── */

/**
 * Adayları istenen içerikle eşleştirir. IMDb kimliği en güçlü kanıttır;
 * yoksa başlık benzerliği + yıl yakınlığı kullanılır.
 * @returns {Array} eşleşen adaylar (skor alanıyla), en iyiden başlayarak
 */
export function eslestir(adaylar, hedef, { esik = 0.55 } = {}) {
  const basliklar = [hedef?.baslik, hedef?.orijinalBaslik, hedef?.alt]
    .filter(Boolean).map(String);
  const hedefImdb = String(hedef?.imdb || hedef?.imdbId || '').trim();
  const hedefYil = Number(hedef?.yil) || null;

  const puanli = [];
  for (const aday of Array.isArray(adaylar) ? adaylar : []) {
    let skor = 0;
    if (hedefImdb && aday.imdb && aday.imdb === hedefImdb) skor = 1;
    else {
      /* SERT REDDİLER — puan düşürmek yetmez, yanlış filmi önermek daha kötü:
         · tür ikisi de biliniyorken farklıysa (dizi ↔ film) eşleşme yoktur;
         · iki yıl da biliniyorken 2 yıldan fazla fark varsa eşleşme yoktur
           (yeniden çevrimler IMDb ile eşleşir; başlıkla eşleştirmek yanıltır). */
      if (hedef?.tur && aday.tur && hedef.tur !== aday.tur) continue;
      if (hedefYil && aday.yil && Math.abs(hedefYil - aday.yil) > 2) continue;

      let benzerlik = 0;
      for (const b of basliklar) {
        benzerlik = Math.max(benzerlik, baslikBenzerligi(aday.baslik, b));
        if (aday.alt) benzerlik = Math.max(benzerlik, baslikBenzerligi(aday.alt, b));
      }
      skor = benzerlik;
      // Yıl uyumu ek puan (sinema/video yayın farkı 1 yıl tolere edilir).
      if (hedefYil && aday.yil) {
        const fark = Math.abs(hedefYil - aday.yil);
        if (fark === 0) skor += 0.15;
        else if (fark === 1) skor += 0.05;
        else if (fark === 2) skor -= 0.15;
      }
      skor = Math.max(0, Math.min(1, skor));
    }
    if (skor >= esik) puanli.push({ ...aday, eslesmeSkoru: Number(skor.toFixed(3)) });
  }
  return puanli.sort((a, b) => b.eslesmeSkoru - a.eslesmeSkoru);
}

/**
 * Eşleşen yıldız adaylarını sicile yazar. Yalnız BEYAN yazılır (`kanit:'etiket'`);
 * gerçek ses izi kanıtı ayrı katmanda kalır — sicil etiketle 'dublaj' yazmaz.
 * @returns {{yazilan: number, ozet: object}}
 */
export function sicileYaz(sicil, adaylar, hedef) {
  let yazilan = 0;
  const ozet = { dublaj: 0, altyazi: 0, bilinmiyor: 0 };
  const icerik = icerikAnahtari({
    tmdbTip: hedef?.tmdbTip || hedef?.tur || 'movie',
    tmdbId: hedef?.tmdbId || hedef?.id,
    sezon: hedef?.sezon,
    bolum: hedef?.bolum,
  });
  for (const aday of adaylar) {
    if (!aday?.kaynak) continue;
    const sonuc = kanitIsle(sicil, {
      tmdbTip: hedef?.tmdbTip || hedef?.tur || 'movie',
      tmdbId: hedef?.tmdbId || hedef?.id,
      sezon: hedef?.sezon,
      bolum: hedef?.bolum,
      saglayici: aday.kaynak,
      dilDurumu: aday.dilDurumu,
      kanit: aday.kanit,
      diller: aday.dilDurumu === 'dublaj' ? ['tr'] : [],
      sonGorulme: Number(hedef?.simdi) || 0,
    });
    if (sonuc.durum !== 'korundu') yazilan += 1;
    if (ozet[aday.dilDurumu] != null) ozet[aday.dilDurumu] += 1;
  }
  return { yazilan, ozet, icerik };
}

/**
 * TEK GİRİŞ NOKTASI: içerik için yıldızlı kaynakları ara, eşleştir, sicile yaz.
 * Çağıran katman bunu "arka plan zenginleştirme" olarak çağırır; dönen değer
 * oynatma listesini DEĞİŞTİRMEZ — yalnız sicili ve ipuçlarını günceller.
 * @returns {Promise<{adaylar: Array, eslesen: Array, kaynakDurumu: object, ozet: object}>}
 */
export async function yildizArsiviTara(hedef, secenek = {}) {
  const sorgular = [...new Set([
    hedef?.orijinalBaslik, hedef?.baslik, hedef?.imdb,
  ].filter(Boolean).map((s) => String(s).trim()))].slice(0, 2);
  if (!sorgular.length) {
    return { adaylar: [], eslesen: [], kaynakDurumu: {}, ozet: { dublaj: 0, altyazi: 0, bilinmiyor: 0 } };
  }
  const tumAdaylar = [];
  const kaynakDurumu = {};
  const rpcAction = secenek.rpcAction || {};
  for (const sorgu of sorgular) {
    const r = await toplaHepsi(sorgu, { ...secenek, rpcAction });
    tumAdaylar.push(...r.adaylar);
    Object.assign(kaynakDurumu, r.kaynakDurumu);
    if (tumAdaylar.length >= 40) break; // yeterince aday var, ağ israfı yok
  }
  // Aynı adres birden çok kez gelirse tek tut.
  const gorulen = new Set();
  const benzersiz = tumAdaylar.filter((a) => {
    const k = `${a.kaynak}|${a.adres}|${a.baslik}`;
    if (gorulen.has(k)) return false;
    gorulen.add(k);
    return true;
  });
  const eslesen = eslestir(benzersiz, {
    ...hedef,
    tur: hedef?.tmdbTip || hedef?.tur,
  });
  let ozet = { dublaj: 0, altyazi: 0, bilinmiyor: 0 };
  if (secenek.sicil) {
    ozet = sicileYaz(secenek.sicil, eslesen, hedef).ozet;
  }
  return { adaylar: benzersiz, eslesen, kaynakDurumu, ozet, rpcAction };
}

/** Yıldız kaynak kodunun arayüz adı (gerçek alan adı sızdırmaz). */
export function yildizAdi(kod) {
  const k = YILDIZ_KAYNAKLAR.find((x) => x.kod === kod);
  return k ? k.ad : 'Multidub';
}

/** Bu bir yıldız kaynağı mı? */
export function yildizKaynakMi(kod) {
  return YILDIZ_KAYNAKLAR.some((x) => x.kod === String(kod || ''));
}
