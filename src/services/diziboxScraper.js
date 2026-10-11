/* ==========================================================================
   CinePulse — DiziBox kaziyicisi (dizi odakli)

   Akis (canli dogrulanmis 2026-10-11):
     /?s=<baslik>                    -> dizi sayfalari (/slug/)
     /slug/                          -> bolum sayfalari (/slug-sezon-N-bolum-M/)
     /slug-sezon-N-bolum-M/          -> <iframe src="https://ok.ru/videoembed/<id>">

   NOT: dizibox.live adi CF'nin JS challenge'ini istiyor; Vercel/datacenter
   IP'lerinden acilmaz. Ayni sitenin aynasi diziboxizle.com CF'siz ve
   tam erisilebilir oldugu icin o kullaniliyor. Cihazda WebView cozumleyici
   (androidWebViewResolver) dizibox.live'i cozer; buradaki kaynak her
   iki alan adini da dener.

   Yayin dogrudan m3u8 degil, ok.ru gomulusudur. Bu yuzden gomulu oynatici
   olarak isaretlenir; uygulama mevcut oynatici cercevesinde acar.
   ========================================================================== */

const HOSTS = [
  { base: 'https://diziboxizle.com', label: 'DiziBox' },
  { base: 'https://dizibox.live', label: 'DiziBox (live)' }
];

function proxyUrl(url, ref) {
  try {
    const r = `${new URL(url).origin}/`;
    return `/api/proxy?url=${encodeURIComponent(url)}&ref=${encodeURIComponent(ref || r)}`;
  } catch (_) {
    return url;
  }
}

function isBlockedPage(body) {
  if (!body || body.length < 2000) return true;
  const low = body.slice(0, 4000).toLowerCase();
  return low.includes('attention required') || low.includes('just a moment')
      || low.includes('cf-browser-verification') || low.includes('enable javascript and cookies');
}

async function getHtml(url, timeout = 14000) {
  // 1) Cihaz WebView'i — dizibox.live'in CF challenge'ini çözer
  try {
    const wv = await import('./platform/androidWebViewResolver.js');
    if (wv.hasNativeWebViewResolver()) {
      const hit = await wv.resolvePageInNativeWebView(url, { timeoutMs: Math.max(16000, timeout + 6000) });
      if (hit && !wv.looksBlocked(hit)) {
        const raw = String(hit.text || '').trim();
        const body = (raw.startsWith('{') || raw.startsWith('[')) ? raw : (hit.html || raw);
        if (body && !isBlockedPage(body)) return body;
      }
    }
  } catch (_) {}

  // 2) CF Worker — datacenter IP engelini aşar
  try {
    const res = await fetch(
      `https://wild-credit-e1ae.cagatayca07.workers.dev?url=${encodeURIComponent(url)}`,
      { signal: AbortSignal.timeout(timeout) }).catch(() => null);
    if (res && res.ok) {
      const body = await res.text();
      if (!isBlockedPage(body)) return body;
    }
  } catch (_) {}

  // 3) Uygulama proxy'si
  try {
    const res = await fetch(proxyUrl(url), { signal: AbortSignal.timeout(timeout) });
    if (!res.ok) return '';
    const body = await res.text();
    return isBlockedPage(body) ? '' : body;
  } catch (_) {
    return '';
  }
}

// Gercek dizi sayfasi slug'i: en az bir kelime, teknik sayfa adlari degil.
// ("wp-json", "feed", "tum-bolumler" gibi degerler elenir.)
const TEKNIK_SLUG = new Set([
  'wp-json', 'wp-content', 'wp-includes', 'feed', 'comments', 'category', 'page', 'tag',
  'arama', 'search', 'login', 'uye', 'uye-ol', 'giris', 'cikis', 'kayit', 'kayit-ol',
  'abone', 'abone-ol', 'premium', 'vip', 'iletisim', 'hakkimizda', 'gizlilik', 'kvkk',
  'sss', 'yardim', 'destek', 'ana', 'sayfa', 'kategori', 'etiket', 'arsiv', 'yeni',
  'en-yeni', 'yeni-eklenenler', 'tum-bolumler', 'tum-icerikler', 'son-eklenenler',
  'dizi', 'film', 'canli', 'oyun', 'oynatici', 'donor', 'sponsor', 'reklam',
  'dizi-arsivi', 'dizi-turu', 'dizi-arsivi-2024', 'tum-diziler', 'tum-seriler'
]);

function seriSlugMi(slug) {
  if (!slug || slug.length < 4) return false;
  if (TEKNIK_SLUG.has(slug)) return false;
  // Bölüm sayfaları dizi değildir (…-1-sezon-1-bolum)
  if (/sezon|bolum/.test(slug)) return false;
  // Tek kelimelik, Türkçe arayüz kelimeleri (uye ol, giris yap, ...)
  if (!slug.includes('-')) {
    const tek = TEKNIK_SLUG.has(slug);
    if (tek) return false;
  }
  return /^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(slug);
}

function normalize(str) {
  return String(str || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
    .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '');
}

/* --------------------------------------------------------------- arama --- */

export async function searchDiziBox(query) {
  if (!query || String(query).trim().length < 2) return [];
  const q = normalize(query);
  const bulunanlar = [];

  for (const host of HOSTS) {
    const html = await getHtml(`${host.base}/?s=${encodeURIComponent(query.trim())}`);
    if (!html) continue;

    const gorulen = new Set();
    // Arama sonuçlarının KENDİ bölümü: sayfanın tamamı taranırsa kenar
    // çubuğundaki tüm dizi listesi de gelir ve eşleşme bozulur.
    const sonucBolumu = html.slice(
      Math.max(0, html.search(/dizibox-search-section/)),
      (() => { const i = html.indexOf('dizibox-mobile-search'); return i > 0 ? i : html.length; })()
    ) || html;
    for (const m of sonucBolumu.matchAll(/href="https:\/\/dizibox(?:izle)?\.[a-z]+\/([a-z0-9-]{4,70})\/"/g)) {
      const slug = m[1];
      if (gorulen.has(slug)) continue;
      if (!seriSlugMi(slug)) continue;
      gorulen.add(slug);
      bulunanlar.push({
        id: slug,
        slug,
        title: slug.split('-').map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(' '),
        url: `${host.base}/${slug}/`,
        base: host.base,
        isSeries: true
      });
    }
    if (bulunanlar.length) break;   // ilk çalışan host yeter
  }

  // Arama sonucu gelmediyse katalog sayfasından başlıkla eşleştir
  if (!bulunanlar.length) {
    for (const host of HOSTS) {
      const html = await getHtml(`${host.base}/`);
      if (!html) continue;
      for (const m of html.matchAll(/href="https:\/\/dizibox(?:izle)?\.[a-z]+\/([a-z0-9-]{4,70})\/"/g)) {
        const slug = m[1];
        if (!seriSlugMi(slug)) continue;
        if (normalize(slug).includes(q)) {
          bulunanlar.push({
            id: slug, slug,
            title: slug.split('-').map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(' '),
            url: `${host.base}/${slug}/`, base: host.base, isSeries: true
          });
        }
        if (bulunanlar.length >= 10) break;
      }
      if (bulunanlar.length) break;
    }
  }

  return bulunanlar.slice(0, 30);
}

/* -------------------------------------------------------------- bölümler --- */

/** Dizi sayfasından sezon/bölüm sayfalarını çıkarır.
 *  Bağlantılar dizi slug'ının ÖNÜNE eklenerek geliyor:
 *    /56-days/                      → dizi sayfası
 *    /56-days-1-sezon-1-bolum/      → bölüm sayfası
 *  Sayfada kenar çubuğundaki yüzlerce başka dizi bağlantısı da var; bu
 *  yüzden slug ile başlayan VE sezon/bolum içeren bağlantılar seçilir.
 */
function bolumleriCikar(html, slug) {
  const gorulen = new Set();
  const bolumler = [];
  for (const m of html.matchAll(/href="https:\/\/dizibox(?:izle)?\.[a-z]+\/([a-z0-9-]{4,90})\/"/gi)) {
    const p = m[1];
    if (gorulen.has(p)) continue;
    if (!p.startsWith(slug)) continue;
    if (!/(sezon|bolum)/i.test(p)) continue;
    if (p === slug) continue;
    gorulen.add(p);
    const sezon = Number((p.match(/sezon[-]?(\d+)/i) || [])[1]) || 1;
    const bolum = Number((p.match(/bolum[-]?(\d+)/i) || [])[1]) || 1;
    bolumler.push({ path: p, season: sezon, episode: bolum });
  }
  bolumler.sort((a, b) => (a.season - b.season) || (a.episode - b.episode));
  return bolumler;
}

/* ----------------------------------------------------------- aggregator --- */

/**
 * Aggregator giriş noktasi: başlıktan diziye, diziden bölüme, bölümden
 * oynatıcı gömülüsüne.
 */
export async function fetchDiziBoxSources({ titles = [], title = '', season = 1, episode = 1 } = {}) {
  const cands = [...new Set([...titles, title].filter((t) => t && String(t).trim().length > 1))];
  if (!cands.length) return [];

  let match = null;
  for (const c of cands) {
    const res = await searchDiziBox(c);
    if (!res.length) continue;
    const nc = normalize(c);
    match = res.find((r) => normalize(r.title) === nc)
      || res.find((r) => normalize(r.title).includes(nc) || nc.includes(normalize(r.title)))
      || res[0];
    if (match) break;
  }
  if (!match) return [];

  const diziHtml = await getHtml(match.url);
  if (!diziHtml) return [];
  const bolumler = bolumleriCikar(diziHtml, match.slug);
  if (!bolumler.length) return [];

  // İstenen bölümü bul; yoksa aynı sezondaki en yakın bölümü dene.
  let secili = bolumler.find((b) => b.season === Number(season) && b.episode === Number(episode));
  if (!secili) {
    const ayniSezon = bolumler.filter((b) => b.season === Number(season));
    secili = ayniSezon.find((b) => b.episode >= Number(episode)) || ayniSezon[ayniSezon.length - 1] || bolumler[0];
  }
  if (!secili) return [];

  const bolumUrl = `${match.base}/${secili.path}/`;
  const bolumHtml = await getHtml(bolumUrl);
  if (!bolumHtml) return [];

  const m = bolumHtml.match(/<iframe[^>]*src=["'](https?:\/\/[^"']+)["']/i);
  if (!m || !m[1]) return [];

  const embed = m[1];
  const oynatici = /ok\.ru\/videoembed/.test(embed) ? 'OK.RU' : 'DiziBox';

  return [{
    id: `dzbx_s${secili.season}e${secili.episode}_${match.slug}`,
    title: `DiziBox • S${secili.season}B${secili.episode}`,
    displayName: `DiziBox S${secili.season}B${secili.episode}`,
    badge: `${oynatici} gömülü`,
    source: 'dizibox',
    type: 'embed',
    isIframe: true,
    isPageEmbed: true,
    category: 'dubbed',
    url: embed,
    streamUrl: embed,
    embedUrl: embed,
    rawStreamUrl: embed,
    quality: '1080p',
    pageUrl: bolumUrl
  }];
}