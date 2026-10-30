/* ==========================================================================
   CinePulse — "Nova" çekirdeği (birinci taraf) — DiziFilmizle.to / Vidmixi ailesi
   --------------------------------------------------------------------------
   Ölçülen zincir (2026-10-30, Node'da uçtan uca doğrulandı — curl/UA ile):
     • Arama:  GET https://dizifilmizle.to/api/search?q=<metin>
       → {success, results:[{slug, content_type:'series'|'movie',
         start_year|year, imdb_rating, language_type}]}.  (UA şart; JSON.)
     • Dizi:   GET /dizi/<slug>/ → Next.js RSC flight payload'ı (self.__next_f)
       İÇİNDE tüm sezonların bölüm kayıtları düz metin dolaşır:
       `"season_number":N` başlangıçlı sezon bloğu, içinde tekrarlanan
       `"episode_number":E` + `"embed_player_url_1":"https://vidmixi.com/embed/<hash>"`
       üçlüleri. Sayfa kaçışlı JSON taşır; regex taramasından önce `\"`→`"`
       ve `\\`→`\` normalizasyonu yapılır (ölçüldü: tek geçiş yeterli).
     • Film:   GET /film/<slug>/ → aynı payload'ta film nesnesinin
       `embed_player_url_1/2/3` alanları.
     • Embed:  GET https://vidmixi.com/embed/<hash> (Referer: dizifilmizle.to)
       → jwplayer tabanlı "bepeak" oynatıcı: `bePlayer('<hash>', '<json>')`
       çağrısı. <json> = CryptoJS OpenSSL OpenSSH biçemi: {ct, iv, s};
       anahtar/IV = EVP_BytesToKey(MD5, 1 iter, parola=<hash>, salt=hex(s))
       → AES-256-CBC şifreçöz → {video_location, strSubtitles, ...}.
       WebCrypto (subtle AES-CBC + MD5) birincil, node:crypto yedek yoldur;
       üçüncü yol yoktur (harici kod çalıştırma yasağı).
     • Master: video_location = https://vidmixi.com/list/<token> → #EXTM3U.
       BB S1E1 kanıtı (master başlığı):
         #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio",LANGUAGE="tur",NAME="Turkish",...
         #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio",LANGUAGE="eng",NAME="English",...
         #EXT-X-STREAM-INF:...RESOLUTION=1920x1080,NAME="1080p"...
       YANI TR dublaj VE orijinal ses AYNI master'da ayrı AUDIO varyantıdır.
     • Altyazı: strSubtitles içinden language:"tur" VTT'si
       https://vidmixi.com/upload/.../Subtitle/subtitle_tur.vtt (200 ölçüldü).
     • Başlık etiketi dürüstlüğü: "· Türkçe Dublaj" YALNIZ master m3u8'de
       LANGUAGE="tur" / NAME="Turkish" satırı GÖRÜLÜRSE basılır; TR altyazı
       varsa "Altyazı" etiketi eklenir. Varyant listesi TR ses göstermiyorsa
       dublaj etiketi HİÇ basılmaz.
   ========================================================================== */

import { tmdbBilgi, adayBasliklar, sadeles, yilUyar, zamanAsimi } from '../ortakCekirdek.js';

const AD = 'Nova';
const SITE = 'https://dizifilmizle.to';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

/* ── yardımcılar ─────────────────────────────────────────────────────────── */

async function oku(url, { ref = SITE + '/', ms = 12000, basliklar = null } = {}) {
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'text/html,application/json,*/*', Referer: ref, ...(basliklar || {}) },
      signal: zamanAsimi(ms),
    });
    return r.ok ? await r.text() : '';
  } catch (_) {
    return '';
  }
}

const norm = (s) => sadeles(String(s || '')).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const yilSay = (v) => parseInt(String(v || '').match(/\d{4}/)?.[0] || '', 10) || null;

/* Flight payload normalizasyonu: kaçışlı JSON metnini taranabilir hale getirir.
   (Ölçüldü: `\"` ve `\\` tek katman geçişle düzleşiyor; döngü güvenlik için.) */
function duzlestir(html) {
  let s = String(html || '');
  for (let i = 0; i < 3; i++) {
    const t = s.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    if (t === s) break;
    s = t;
  }
  return s;
}

/* ── CryptoJS-uyumlu OpenSSL EVP_BytesToKey (MD5) + AES-256-CBC ─────────── */

function b64Byte(s) {
  const bin = atob(String(s || '').replace(/\s+/g, ''));
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u;
}
function hexByte(h) {
  const u = new Uint8Array(h.length / 2);
  for (let i = 0; i < u.length; i++) u[i] = parseInt(h.substr(i * 2, 2), 16);
  return u;
}

/* Saf JS MD5 (RFC 1321): node:crypto'nun OLMADIĞI ortamlar (WebView/üretım
   bundle) için yedek yol — Aksi halde cihazda beplayerCoz sessiz null döner. */
function md5Bayt(mesaj) {
  const l = mesaj.length;
  const uzunluk = (((l + 8) >> 6) + 1) << 6;
  const m = new Uint8Array(uzunluk);
  m.set(mesaj); m[l] = 0x80;
  const dv = new DataView(m.buffer);
  dv.setUint32(uzunluk - 8, (l << 3) >>> 0, true);
  dv.setUint32(uzunluk - 4, Math.floor(l / 536870912), true);
  const S = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];
  const K = new Uint32Array(64);
  for (let i = 0; i < 64; i++) K[i] = (Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296)) >>> 0;
  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
  const x = new Uint32Array(16);
  for (let off = 0; off < uzunluk; off += 64) {
    for (let i = 0; i < 16; i++) x[i] = dv.getUint32(off + i * 4, true);
    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F, g;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      F = (F + A + K[i] + x[g]) >>> 0;
      A = D; D = C; C = B;
      B = (B + ((F << S[i]) | (F >>> (32 - S[i])))) >>> 0;
    }
    a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0; c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0;
  }
  const out = new Uint8Array(16);
  const odv = new DataView(out.buffer);
  odv.setUint32(0, a0, true); odv.setUint32(4, b0, true); odv.setUint32(8, c0, true); odv.setUint32(12, d0, true);
  return out;
}

async function md5(...parcalar) {
  try {
    const { createHash } = await import('node:crypto');
    const h = createHash('md5');
    for (const p of parcalar) h.update(p);
    return new Uint8Array(h.digest());
  } catch (_) { /* tarayıcı/WebView: saf JS'e düş */ }
  let toplam = 0;
  for (const p of parcalar) toplam += p.length;
  const hepsi = new Uint8Array(toplam);
  let o = 0;
  for (const p of parcalar) { hepsi.set(p, o); o += p.length; }
  return md5Bayt(hepsi);
}

const concat = (parcalar) => {
  const n = parcalar.reduce((a, p) => a + p.length, 0);
  const out = new Uint8Array(n);
  let o = 0;
  for (const p of parcalar) { out.set(p, o); o += p.length; }
  return out;
};

/* parola (UTF-8) + salt'tan 32B anahtar + 16B IV üretir (1 MD5 iterasyonu;
   CryptoJS openssl formatının birebir karşılığı — ölçüldü 2026-10-30). */
async function evpBytesToKey(parola, salt) {
  const pw = new TextEncoder().encode(parola);
  let onceki = new Uint8Array(0);
  const cikt = [];
  let toplam = 0;
  while (toplam < 48) {
    onceki = await md5(onceki, pw, salt);
    cikt.push(onceki);
    toplam += onceki.length;
  }
  const tum = concat(cikt);
  return { key: tum.subarray(0, 32), iv: tum.subarray(32, 48) };
}

async function aesCbcAc(key, iv, veri) {
  const c = globalThis.crypto;
  if (c?.subtle) {
    try {
      const ahtar = await c.subtle.importKey('raw', key, { name: 'AES-CBC' }, false, ['decrypt']);
      const duz = await c.subtle.decrypt({ name: 'AES-CBC', iv }, ahtar, veri);
      return new Uint8Array(duz);
    } catch (_) { /* node:crypto yoluna düş */ }
  }
  const { createDecipheriv } = await import('node:crypto');
  const d = createDecipheriv('aes-256-cbc', key, iv);
  return new Uint8Array(Buffer.concat([d.update(veri), d.final()]));
}

/* bePlayer yükünü çözer: {ct, iv, s} + hash → {video_location, strSubtitles…} */
export async function beplayerCoz(setJson, hash) {
  let j = null;
  try { j = JSON.parse(String(setJson || '').replace(/\\\//g, '/')); } catch (_) { return null; }
  if (!j?.ct || !j?.s) return null;
  try {
    const { key, iv } = await evpBytesToKey(String(hash), hexByte(String(j.s)));
    const duz = await aesCbcAc(key, iv, b64Byte(j.ct));
    return JSON.parse(new TextDecoder().decode(duz));
  } catch (_) {
    return null;
  }
}

/* ── site adımları ───────────────────────────────────────────────────────── */

/* 1) arama → slug adayı */
async function araAdaylari(soru, istenenTur) {
  const html = await oku(`${SITE}/api/search?q=${encodeURIComponent(soru)}`, { ms: 9000 });
  if (!html) return [];
  let j = null;
  try { j = JSON.parse(html); } catch (_) { return []; }
  const beklenen = istenenTur === 'tv' ? 'series' : 'movie';
  return (j?.results || [])
    .filter((r) => r?.slug && r.content_type === beklenen)
    .map((r) => ({ slug: r.slug, yil: yilSay(r.year ?? r.start_year), ad: r.title || r.original_title || '' }));
}

/* 2) dizi sayfası → (sezon, bölüm) → embed hash'leri
      flight bloklarında sezon numarası bölüm kayıtlarından ÖNCE gelir;
      `season_number` işaretleri arasında kalan aralıktaki episode_number +
      embed_player_url_1 üçlüleri o sezona yazılır (ölçüldü: sezon blokları
      sıralı ve iç içe değil). */
function diziBolumleri(html) {
  const s = duzlestir(html);
  const sezonIsaretleri = [...s.matchAll(/"season_number":(\d+)/g)].map((m) => ({ n: +m[1], i: m.index }));
  const harita = new Map(); // "S:E" → [url,...]
  for (let k = 0; k < sezonIsaretleri.length; k++) {
    const bas = sezonIsaretleri[k].i;
    const bit = k + 1 < sezonIsaretleri.length ? sezonIsaretleri[k + 1].i : s.length;
    const blok = s.slice(bas, bit);
    // bölüm kaydı episode_number'dan ÖNCEki alanlarla başlayabilir; embed'i episode_number'ı
    // izleyen ~1200 karakterlik pencerede ara (ölçüldü: sır overview→…→embed_player_url_1).
    for (const em of blok.matchAll(/"episode_number":(\d+)/g)) {
      const ep = +em[1];
      const pencere = blok.slice(em.index, em.index + 1600);
      const urls = [...pencere.matchAll(/"embed_player_url_([123])":"(https:\/\/vidmixi\.com\/embed\/[a-f0-9]+)"/g)]
        .map((u) => u[2]);
      if (!urls.length) continue;
      const anahtar = `${sezonIsaretleri[k].n}:${ep}`;
      const mevcut = harita.get(anahtar) || [];
      for (const u of urls) if (!mevcut.includes(u)) mevcut.push(u);
      harita.set(anahtar, mevcut);
    }
  }
  return harita;
}

/* 2b) film sayfası → embed URL'leri (film nesnesindeki embed_player_url_1/2/3) */
function filmEmbedleri(html) {
  const s = duzlestir(html);
  const out = [];
  const i = s.search(/"embed_player_url_1"/);
  if (i >= 0) {
    const pencere = s.slice(Math.max(0, i - 3000), i + 3000);
    out.push(...[...new Set([...pencere.matchAll(/"embed_player_url_[123]":"(https:\/\/vidmixi\.com\/embed\/[a-f0-9]+)"/g)].map((m) => m[1]))]);
  }
  if (!out.length) {
    // FİLM deseni (ölçüldü 2026-10-30, /film/the-predator): film sayfaları
    // embed_player_url TAŞIMAZ — "parts:[{title:"Tek Part", url: embed,
    // language:"Dublaj & Altyazı"}]" dizisi taşır. Eski desen bu yüzden
    // filmlerde HEPSİZ 0 dönüyordu (kullanıcı: "filmlerde çok dublaj var,
    // neden gelmiyor"). Çok parçalı filmlerde ilk parça alınır: satır modeli
    // "ilk segment" demektir; parça-2 yedek sanılmaz.
    out.push(...[...new Set([...s.matchAll(/https:\/\/vidmixi\.com\/embed\/[a-f0-9]{16,64}/g)].map((m) => m[0]))]);
  }
  return out.slice(0, 3);
}

/* 3) embed → master m3u8 + TR altyazı adresi */
async function embedCoz(embedUrl, ref) {
  const html = await oku(embedUrl, { ref, ms: 12000 });
  if (!html) return null;
  const m = html.match(/bePlayer\(\s*'([^']+)'\s*,\s*'([^']+)'/);
  if (!m) return null;
  const ayar = await beplayerCoz(m[2], m[1]);
  if (!ayar?.video_location) return null;
  let trAltyazi = '';
  try {
    // strSubtitles şifreçözücüden DİZİ olarak çıkar (ölçüldü); string gelirse parse et.
    const liste = Array.isArray(ayar.strSubtitles)
      ? ayar.strSubtitles
      : (JSON.parse(ayar.strSubtitles || '[]') || []);
    const tr = liste.find((t) => t?.file && (t.language === 'tur' || /turk/i.test(t.label || '') || /subtitle_tur/i.test(t.file || '')));
    if (tr) trAltyazi = tr.file.startsWith('http') ? tr.file : `https://vidmixi.com${tr.file}`;
  } catch (_) { /* etiketsiz devam */ }
  return { master: ayar.video_location, trAltyazi, baslik: ayar.title || '', epAd: ayar.description || '' };
}

/* ── ana giriş ───────────────────────────────────────────────────────────── */

const ONBELLEK = new Map();
const ONBELLEK_MS = 15 * 60 * 1000;

export async function getStreams(kimlik, tur = 'tv', sezon = 1, bolum = 1) {
  const kim = (kimlik && typeof kimlik === 'object') ? (kimlik.tmdbId || kimlik.id || kimlik.imdbId || '') : kimlik;
  const bilgi = await tmdbBilgi(kim, tur);
  const adaylar = bilgi ? adayBasliklar(bilgi) : [];
  if (!adaylar.length) return [];

  const s = +sezon || 1;
  const b = +bolum || 1;
  const anahtar = `${tur}:${bilgi?.baslik || kim}:${s}:${b}`;
  const hazir = ONBELLEK.get(anahtar);
  if (hazir && Date.now() - hazir.t < ONBELLEK_MS) return hazir.sonuc;

  /* 1) slug: arama API'si; yıl uyan aday önce */
  let hedef = null;
  for (const soru of adaylar.slice(0, 2)) {
    const adayListe = await araAdaylari(soru, tur);
    const uygun = adayListe.find((a) => yilUyar(a.yil, bilgi?.yil)) || adayListe[0];
    if (uygun) { hedef = uygun; break; }
  }
  if (!hedef) return [];

  /* 2) bölüm/film embed'i */
  const altYol = tur === 'tv' ? `dizi/${hedef.slug}` : `film/${hedef.slug}`;
  const sayfa = await oku(`${SITE}/${altYol}/`, { ms: 14000 });
  if (!sayfa) return [];
  const embedler = tur === 'tv'
    ? (diziBolumleri(sayfa).get(`${s}:${b}`) || [])
    : filmEmbedleri(sayfa);
  if (!embedler.length) return [];

  /* 3) her embed'i çöz, master'ı doğrula, dil kanıtını master'dan oku */
  const sonuc = [];
  const gorulenMaster = new Set();
  for (const embedUrl of embedler.slice(0, 3)) {
    const coz = await embedCoz(embedUrl, `${SITE}/${altYol}/`);
    if (!coz || gorulenMaster.has(coz.master)) continue;
    // master'ı indir: #EXTM3U doğrulaması + TR ses/altyazı kanıtı BURADAN okunur.
    const ust = await oku(coz.master, { ref: 'https://vidmixi.com/', ms: 9000 });
    if (!/#EXTM3U|#EXT-X-|#EXTINF/.test(ust)) continue;
    gorulenMaster.add(coz.master);
    const p = [...ust.matchAll(/RESOLUTION=\d+x(\d+)/g)].map((x) => +x[1]);
    const h = p.length ? Math.max(...p) : 0;
    const kalite = h >= 2000 ? '4K' : h >= 1000 ? '1080p' : h >= 700 ? '720p' : h >= 400 ? '480p' : h ? '360p' : 'HD';
    // DİL KANITI (dürüstlük kuralı): yalnız master metnindeki satırlar sayılır.
    const trSes = /TYPE=AUDIO[^\n]*LANGUAGE="tur"/i.test(ust) || /TYPE=AUDIO[^\n]*NAME="Turk/i.test(ust);
    const altazi = !!coz.trAltyazi;
    const etiketler = [kalite];
    if (trSes) etiketler.push('Türkçe Dublaj');
    if (altazi) etiketler.push('Altyazı');
    if (!trSes) etiketler.push('Orijinal');
    sonuc.push({
      name: AD,
      title: `${AD} · ${etiketler.join(' · ')}`,
      url: coz.master,
      quality: kalite,
      format: 'hls',
      isM3u8: true,
      diller: [...(trSes ? ['tr'] : []), ...(altazi ? ['altyazi'] : [])],
      trSes,
      trAltyazi: altazi,
      dilDurumu: trSes ? 'dublaj' : 'orijinal',
      altyaziUrl: coz.trAltyazi || undefined,
      headers: { 'User-Agent': UA, Referer: 'https://vidmixi.com/' },
    });
    // Ölçüldü: tüm embedler aynı master'a çıkabiliyor; ilk doğrulanan yeter.
    if (sonuc.length >= 2) break;
  }

  if (sonuc.length) ONBELLEK.set(anahtar, { t: Date.now(), sonuc });
  if (ONBELLEK.size > 200) ONBELLEK.delete(ONBELLEK.keys().next().value);
  return sonuc;
}

if (typeof globalThis !== 'undefined') {
  globalThis.getStreams = getStreams;
  globalThis.__cpNova = getStreams;
}
export default getStreams;
