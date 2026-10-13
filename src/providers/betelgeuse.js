/* ==========================================================================
   BETELGEUSE — 4KHDHub (4khdhub.one)  (sıfırdan, kit sözleşmesi)

   Nuvio/Patron "4KHD" eklentisinin bizim katmandaki karşılığı. Site yeniden
   okunup akış kendi helper'larımızla (kit.js) kuruldu; eklenti kodu taşındı
   değil.

   Adımlar:
     1. Alan adı: domains.json (canlı adres) → bilinen adresler
     2. Arama  : /?s={başlık} → <a class="movie-card" aria-label="X details">
                 (yol kalıbı: -movie-N/ film, -series-N/ dizi)
     3. Film   : div.download-item  → "Download …" bağlantıları + boyut/kalite
        Dizi   : div.season-item (.episode-number = S03)
                 → .episode-download-item (.badge-psa = Episode-01)
     4. İndirme bağlantıları "…?id=<base64>" ara sayfasından geçer:
        base64 → base64 → rot13 → base64 → JSON {o} → base64 → gerçek adres
     5. hubcloud: sayfa → #download → üretici sayfa → pixeldrain api/file/…
        ve doğrudan sunucu bağlantıları (workers.dev / gpdl)
     6. Yayın DOĞRUDAN dosyadır (mkv/mp4). Uzatmayan adreslere #.mkv eklenir.

   IFRAME YASAK: gömülü/bilinmeyen sayfa adresi listelenmez.
   HIZ: dosya linkleri PARALEL, webView:false, tek bütçe (~9 sn).
   ========================================================================== */

import {
  istek, izleyici, duzMetin, mutlak, koken, medyaMi, kaynak, slugla, kaliteBul, b64Ac,
} from './kit.js';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const PLAYER_UA = 'okhttp/4.9.2';
const DOMAIN_URL = 'https://raw.githubusercontent.com/phisher98/TVVVV/refs/heads/main/domains.json';
const BILINEN = ['https://4khdhub.one', 'https://4khdhub.wiki', 'https://4khdhub.fit'];

export const kimlik = { id: 'd4kh', alias: 'Betelgeuse', mediaTypes: ['movie', 'tv'] };

let canliTaban = '';

const entityCoz = (s) => String(s || '')
  .replace(/&#0?39;|&apos;/gi, "'").replace(/&quot;/gi, '"')
  .replace(/&amp;/gi, '&').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));

const b64Coz = (s) => b64Ac(s); // toleranslı: `\/` kaçışları + base64url (katı atob 0 sonuç veriyordu)
const rot13 = (s) => String(s || '').replace(/[A-Za-z]/g, (c) => {
  const b = c <= 'Z' ? 65 : 97;
  return String.fromCharCode(((c.charCodeAt(0) - b + 13) % 26) + b);
});

const duz = (s) => String(s || '')
  .toLowerCase()
  .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
  .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
  .replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();

/** KATI başlık eşleşmesi: tam > öneş ek > kapsama (kapsama tek başına yetmez). */
function puanla(adayAdi, hedefler) {
  const aday = duz(adayAdi);
  if (!aday) return 0;
  let en = 0;
  for (const h of hedefler) {
    const hedef = duz(h);
    if (!hedef) continue;
    if (aday === hedef) en = Math.max(en, 6);
    else if (aday.startsWith(hedef)) en = Math.max(en, 4);
    else if (hedef.startsWith(aday)) en = Math.max(en, 3);
    else if (aday.includes(hedef) || hedef.includes(aday)) en = Math.max(en, 1);
  }
  return en >= 2 ? en : 0;
}

/* ── 1. arama ───────────────────────────────────────────────────────────── */

function kartlar(ham, base) {
  const out = [];
  const gorulen = new Set();
  const ekle = (href, ad) => {
    const url = mutlak(href, base);
    if (!url || !ad || gorulen.has(url)) return;
    if (/\/(category|tag|genre)\//i.test(url)) return;
    gorulen.add(url);
    out.push({ ad, url });
  };
  for (const m of String(ham || '').matchAll(/<a[^>]*href="([^"]+)"[^>]*class="movie-card"[^>]*aria-label="([^"]*)"/gi)) {
    ekle(m[1], entityCoz(m[2]).replace(/\s+details$/i, ''));
  }
  if (!out.length) {
    for (const m of String(ham || '').matchAll(/<a[^>]*href="([^"]+)"[^>]*>[\s\S]{0,400}?<h3[^>]*>([\s\S]{0,120}?)<\/h3>/gi)) {
      ekle(m[1], duzMetin(m[2]));
    }
  }
  return out;
}

async function ara(base, sorgu, trace) {
  const ham = await istek(`${base}/?s=${encodeURIComponent(sorgu)}`, {
    ref: `${base}/`, headers: { 'User-Agent': UA, Accept: 'text/html' }, timeout: 9000, trace, webView: false,
  });
  return { kart: kartlar(ham, base), ham: ham || '' };
}

/* ── 2. içerik linkleri (film / dizi) ───────────────────────────────────── */

function dosyaLinkleri(blok, taban) {
  const out = [];
  // span ŞARTI YOK (ölçüldü: sayfada span'sız 441, span'lı 74 link vardı —
  // "Download HubCloud&nbsp;<svg…>" butonları hiç görülmüyordu)
  for (const m of String(blok).matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]{0,400}?)<\/a>/gi)) {
    const url = mutlak(m[1], taban);
    if (!/^https?:\/\//i.test(url)) continue;
    if (/report|t\.me|telegram|google\.com|discord|facebook|twitter|x\.com\/home/i.test(`${url} ${m[2]}`)) continue;
    if (out.some((x) => x.url === url)) continue;
    out.push({ url, ad: entityCoz(duzMetin(m[2])).slice(0, 60) || 'İndir' });
  }
  return out;
}

function filmDosyalari(ham, taban) {
  return String(ham || '').split(/<div[^>]*class="download-item/).slice(1)
    .map((b) => ({
      ad: duzMetin((b.match(/font-semibold">([\s\S]{0,300}?)<br/i) || [])[1]) || 'Film',
      boyut: (b.match(/badge"[^>]*>([\d.]+\s*[GM]B)</i) || [])[1] || '',
      linkler: dosyaLinkleri(b, taban),
    })).filter((x) => x.linkler.length);
}

function bolumDosyalari(ham, taban, s, e) {
  const bloklar = String(ham || '').split(/<div[^>]*class="season-item/).slice(1);
  const sirali = [];
  for (const b of bloklar) {
    const sezon = +((b.match(/class="episode-number[^"]*"[^>]*>\s*S?0*(\d+)/i) || [])[1] || 0);
    sirali.push({ sezon, blok: b });
  }
  // İstenen sezon bloğu; bulunamazsa tüm bloklar aranır (bazı sayfalar
  // sezonu "Pack" olarak tek blokta tutar).
  const havuz = sirali.filter((x) => x.sezon === s);
  const out = [];
  for (const item of (havuz.length ? havuz : sirali)) {
    for (const b of String(item.blok).split(/<div[^>]*class="episode-download-item/).slice(1)) {
      const etiket = (b.match(/badge-psa"[^>]*>\s*Episode-?0*(\d+)/i) || [])[1];
      const dosyaAdi = duzMetin((b.match(/episode-file-title"[^>]*>([\s\S]{0,300}?)<\/div>/i) || [])[1]);
      const dosyada = new RegExp(`S0?${s}E0?${e}\\b`, 'i').test(dosyaAdi);
      // Sezon disiplini: ya blok istenen sezona ait ya da dosya adı S{sezon}E{bölüm}
      if (item.sezon !== s && !dosyada) continue;
      if (etiket && +etiket !== e && !dosyada) continue;
      if (!etiket && !dosyada) continue;
      const linkler = dosyaLinkleri(b, taban);
      if (linkler.length) out.push({ ad: dosyaAdi || `S${s}E${e}`, boyut: (b.match(/badge-size"[^>]*>([\d.]+\s*[GM]B)</i) || [])[1] || '', linkler });
    }
  }
  return out;
}

/* ── 3. bağlantı → doğrudan dosya ───────────────────────────────────────── */

const PIKSEL = /pixeldrain\.[a-z.]+\/(?:u|l)\/([A-Za-z0-9]+)/i;

/** Piksel sunucusu → api/file/{kod}?download (tarayıcının kullandığı uç). */
function pikselAdresi(url) {
  const m = String(url).match(PIKSEL);
  if (!m) return '';
  const host = (url.match(/^https?:\/\/([^/]+)/i) || [])[1];
  return `https://${host}/api/file/${m[1]}?download`;
}

/** "…?id=<base64>" ara sayfasındaki gizli hedefi çözer. */
async function araSayfaCoz(url, ref, trace) {
  const ham = await istek(url, { ref, headers: { 'User-Agent': UA }, timeout: 9000, trace, webView: false });
  let comb = '';
  for (const m of String(ham || '').matchAll(/s\('o','([A-Za-z0-9+/=_-]+)'|ck\('_wp_http_\d+','([^']+)'/g)) comb += (m[1] || m[2] || '');
  if (!comb) return '';
  try {
    const veri = JSON.parse(b64Coz(rot13(b64Coz(b64Coz(comb)))));
    const hedef = b64Coz(veri.o || '').trim();
    if (/^https?:\/\//i.test(hedef)) return hedef;
  } catch (_) { /* çöp token */ }
  return '';
}

/** hubcloud / hubdrive sayfasından doğrudan dosya adreslerini toplar. */
async function sunucudanCikar(url, ref, trace, derinlik = 0) {
  if (derinlik > 2 || !url) return { adresler: [], kaynak: url };
  let ham = await istek(url, { ref, headers: { 'User-Agent': UA }, timeout: 9000, trace, webView: false });
  // hubcloud: "id=download" köprüsünden gerçek üretici sayfaya geçilir
  const kopru = (ham.match(/id="download"[^>]*href="([^"]+)"/i) || [])[1];
  if (kopru) {
    ham = await istek(mutlak(kopru, url), { ref: url, headers: { 'User-Agent': UA }, timeout: 9000, trace, webView: false }) || ham;
  }
  const bul = String(ham || '');
  const adresler = [];
  // JS ile yazılan piksel kodu (a href'i bayat, gerçek kod değişkendedir)
  const pxl = (bul.match(/var\s+pxl\s*=\s*"(https?:\/\/[^"]+)"/i) || [])[1];
  if (pxl) { const p = pikselAdresi(pxl); if (p) adresler.push(p); }
  for (const m of bul.matchAll(/href="(https?:\/\/[^"]+)"/gi)) {
    const u = m[1];
    if (/t\.me|telegram|google\.com|tinyurl|one\.one\.one|snvhost|\/drive\/admin/i.test(u)) continue;
    const pik = pikselAdresi(u);
    if (pik) { adresler.push(pik); continue; }
    if (medyaMi(u) || /(workers\.dev|gpdl\.|fslhand|buzzserver|hubcdn|fileserver)/i.test(u)) adresler.push(u);
  }
  // hubdrive: tek buton → sonraki sayfa (bir kat daha çözülür)
  if (!adresler.length && /hubdrive/i.test(url)) {
    const buton = (bul.match(/href="([^"]+)"[^>]*class="btn[^"]*(?:success|primary)[^"]*"/i) || bul.match(/class="btn[^"]*"[^>]*href="([^"]+)"/i) || [])[1];
    if (buton) return sunucudanCikar(mutlak(buton, url), url, trace, derinlik + 1);
  }
  return { adresler: [...new Set(adresler)], kaynak: url };
}

/** Tek indirme bağlantısını doğrudan dosyaya çevirir. */
async function linkiCoz(link, ctx) {
  let url = link.url;
  if (/[?&]id=[A-Za-z0-9+/=]{16,}/.test(url)) {
    const cozuk = await araSayfaCoz(url, ctx.sayfa, ctx.trace);
    if (!cozuk) return [];
    url = cozuk;
  }
  if (medyaMi(url)) return [{ url, kaynak: ctx.sayfa }];
  const pik = pikselAdresi(url);
  if (pik) return [{ url: pik, kaynak: url }];
  const { adresler, kaynak } = await sunucudanCikar(url, ctx.sayfa, ctx.trace);
  return adresler.map((a) => ({ url: a, kaynak }));
}

/* ── yayın kanıtı (bayt yoklaması) ─────────────────────────────────────── */

/** ~1 KB `Range: bytes=0-2047` yoklaması — bellatrix'in `yayinTipi` ilkesi,
 *  bayt kanıtıyla: #EXTM3U / ftyp / EBML DIŞI ÇÖP (ölçüldü: `#.mkv` hilesinin
 *  5 adresinden 2'si text/html, 1'i 404 döndü). Ölü yayın listelenmez. */
async function yayinTipi(url, headers = {}, timeout = 2500) {
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), timeout);
    let r = null;
    try { r = await fetch(url, { headers: { ...headers, Range: 'bytes=0-2047', Accept: '*/*' }, signal: ac.signal }); } finally { clearTimeout(t); }
    if (!r || !r.ok) return ''; // 403/404 → ölü
    const ct = String(r.headers?.get?.('content-type') || '').toLowerCase();
    if (/text\/html/.test(ct)) return ''; // sayfa döndü, yayın değil
    let buf;
    try {
      if (r.status === 200 && !String(r.headers?.get?.('content-range') || '').includes('bytes 0-') && +String(r.headers?.get?.('content-length') || '0') > 65536) {
        // sunucu Range'i yok saydı: tüm dosyayı indirmeyiz
        return /^video\/|^audio\/|mpegurl/.test(ct) ? 'media' : '';
      }
      buf = new Uint8Array(await r.arrayBuffer());
    } catch (_) { return ''; }
    const bas = Buffer.from(buf.subarray(0, 32)).toString('latin1');
    if (Buffer.from(buf.subarray(0, 7)).toString('utf8') === '#EXTM3U') return 'hls';
    if (buf.length >= 12 && /^(ftyp|styp|moov|moof)$/.test(bas.slice(4, 8))) return 'mp4';
    if (buf.length >= 4 && buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) return 'mkv';
    return ''; // imzasız → çöp say
  } catch (_) { return ''; }
}

/* ── ana akış ───────────────────────────────────────────────────────────── */

export async function coz({ type = 'movie', title = '', originalTitle = '', titles = [], season = 1, episode = 1 } = {}) {
  const trace = izleyici();
  const bas = Date.now();
  const BITIS = bas + 11500; // sert bütçe: +yoklama ile ~12 sn
  const isFilm = type === 'movie';
  const s = +season || 1;
  const e = +episode || 1;
  const hedefler = [...new Set([originalTitle, title, ...titles].filter((t) => t && String(t).trim().length > 1))];
  if (!hedefler.length) return { sources: [], trace: trace.ozet() };

  // — 1. arama (canlı alan adıyla birlikte paralel: ilk adres tutarsa bekleme yok)
  const taban = canliTaban || BILINEN[0];
  const sorgular = [...new Set(hedefler.slice(0, 3))];
  const turlar = await Promise.allSettled([
    ...sorgular.map((q) => ara(taban, q, trace)),
    istek(DOMAIN_URL, { ref: 'https://raw.githubusercontent.com/', timeout: 6000, trace, webView: false }),
  ]);
  let kartlarList = [];
  for (let i = 0; i < sorgular.length; i++) {
    const r = turlar[i];
    if (r.status === 'fulfilled' && r.value) kartlarList = kartlarList.concat(r.value.kart);
  }
  const json = turlar[turlar.length - 1];
  const domains = json.status === 'fulfilled' ? json.value : '';

  let secenek = null;
  let enPuan = 0;
  for (const k of kartlarList) {
    // Başlık eşleşmesi ÖNKOŞUL: puanı 0 olan adaya tür bonusu (+2) uygulanmaz.
    // (Yoksa alakasız ama "-movie-" taşıyan bir kart, eşleşen hiçbir aday
    //  yokken seçilip YANLIŞ filmin sayfası açılıyordu.)
    const es = puanla(k.ad, hedefler);
    if (!es) continue;
    const tipUyar = isFilm ? /-movie-/i.test(k.url) : /-series-/i.test(k.url);
    const p = es + (tipUyar ? 2 : -2);
    if (p > enPuan) { enPuan = p; secenek = k; }
  }
  // ilk adresölü ölüyse: domains.json + bilinenler ile yeniden dene
  if (!kartlarList.length) {
    const alternatif = [...new Set([b64Ayri(domains), ...BILINEN.slice(1)].filter(Boolean))];
    for (const b of alternatif) {
      const deneme = await ara(b, sorgular[0], trace);
      if (deneme.kart.length) {
        canliTaban = b;
        for (const k of deneme.kart) {
          const es = puanla(k.ad, hedefler); // eşleşme önkoşul (yukarıdaki kural)
          if (!es) continue;
          const p = es + (isFilm === /-movie-/i.test(k.url) ? 2 : -2);
          if (p > enPuan) { enPuan = p; secenek = k; }
        }
        break;
      }
    }
  }
  trace.koy('arama', { taban, aday: kartlarList.length, secili: secenek ? secenek.ad : '' });
  if (!secenek) return { sources: [], trace: trace.ozet() };

  const sayfa = secenek.url;
  const ham = await istek(sayfa, { ref: `${koken(sayfa)}/`, headers: { 'User-Agent': UA }, timeout: 9000, trace, webView: false });
  if (!ham) return { sources: [], trace: trace.ozet() };
  const dosyalar = isFilm ? filmDosyalari(ham, sayfa) : bolumDosyalari(ham, sayfa, s, e);
  trace.koy('dosya', { tip: isFilm ? 'film' : `s${s}e${e}`, n: dosyalar.length });

  // — 2. en hafif 2 dosyanın bağlantıları PARALEL çözülür (4K remux ~60 GB,
  //    telefon için gereksiz; kalite etiketi yine de listelenir)
  const sirali = [...dosyalar].sort((a, b) => boyutMb(a.boyut) - boyutMb(b.boyut));
  const secilenler = sirali.slice(0, 2);
  const is = secilenler.flatMap((d) => d.linkler.slice(0, 3).map((l) => ({ d, l })));
  // Çözümleme bütçesi: süre bitince NE BULDUYSAK o (askıda iş beklenmez)
  const isler = is.map((x) => {
    let sonuc = null;
    const p = linkiCoz(x.l, { sayfa, trace }).then((a) => { sonuc = { ...x, adresler: a }; }).catch(() => {});
    return { ad: () => sonuc, p };
  });
  await Promise.race([Promise.all(isler.map((i) => i.p)), new Promise((r) => setTimeout(r, Math.max(0, BITIS - Date.now() - 2600)))]);

  const adaylar = [];
  const gorulen = new Set();
  for (const i of isler) {
    const r = i.ad();
    if (!r) continue;
    const { d, l, adresler } = r;
    for (const a of adresler || []) {
      let u = String(a.url || '');
      if (!u || /\/(embed|player|watch)\//i.test(u)) continue;
      // Dosya uzatmayan CDN adresleri: oynatıcı kaptörü tanısın diye #.mkv
      if (!medyaMi(u)) u += '#.mkv';
      if (!medyaMi(u) || gorulen.has(u)) continue;
      gorulen.add(u);
      adaylar.push({ u, d, l, a });
    }
  }
  // — 3. listeleme filtresi: ~1 KB bayt yoklaması; ölü/çöp yayın listelenmez
  const pay = Math.max(1200, 12000 - (Date.now() - bas));
  const tipler = await Promise.all(adaylar.map((x) =>
    yayinTipi(x.u, { Referer: `${koken(x.a.kaynak || sayfa)}/`, 'User-Agent': PLAYER_UA }, Math.min(2500, pay))));

  const kaynaklar = [];
  tipler.forEach((tip, i) => {
    if (!tip) return; // #EXTM3U/ftyp/EBML dışı ATILIR
    const { u, d, l, a } = adaylar[i];
    const kalite = kaliteBul(`${d.ad} ${l.ad}`) || '1080p';
    const dublaj = /dublaj|hindi|dubbed/i.test(`${d.ad} ${l.ad}`);
    kaynaklar.push(kaynak({
      id: `d4kh_${slugla(d.ad).slice(0, 40) || kaynaklar.length}_${slugla(l.ad) || 'sunucu'}_${kaynaklar.length}`,
      ad: `Betelgeuse ${kalite}${d.boyut ? ` ${d.boyut}` : ''} ${dublaj ? 'Dublaj' : 'Altyazı'}`,
      url: u,
      kategori: dublaj ? 'dubbed' : 'subtitled',
      headers: { Referer: `${koken(a.kaynak || sayfa)}/`, 'User-Agent': PLAYER_UA, Accept: '*/*' },
      kalite,
    }));
  });
  trace.koy('yoklama', { aday: adaylar.length, saglam: kaynaklar.length });
  trace.koy('sonuc', { n: kaynaklar.length, ms: Date.now() - bas });
  return { sources: kaynaklar, trace: trace.ozet() };
}

function boyutMb(s) {
  const m = String(s || '').match(/([\d.]+)\s*([GM])B/i);
  if (!m) return 1e9;
  return +m[1] * (m[2].toUpperCase() === 'G' ? 1024 : 1);
}
function b64Ayri(ham) {
  try { return String(JSON.parse(ham || '{}')['4khdhub'] || '').replace(/\/$/, ''); } catch (_) { return ''; }
}

export default {
  apiVersion: 1,
  id: kimlik.id,
  name: kimlik.alias,
  mediaTypes: kimlik.mediaTypes,
  async resolve(a) { return (await coz(a)).sources; },
};
