/* ==========================================================================
   CinePulse — "Sirius" çekirdeği (birinci taraf, bağımlılıksız) — YALNIZ FİLM
   --------------------------------------------------------------------------
   Ne yapıyor: sitenin arama + film sayfası Cloudflare süzgeçlidir (ölçülen
   2026-10-18: düz HTTP 403, .pw→.now yönlendirmesi canlı). Sayfalar düz
   HTTP denenir, boşsa gerçek Chromium gizli-WebView'ından geçer; sayfadaki
   `scx` blok JSON'undaki sunucu bağlantıları rot13+base64 ile açılır ve her
   oynatıcı ev sahibi (VidMoxy / TurboImgz / TRsTX / RapidVid / TurkeyPlayer)
   kendi kuralıyla canlı HLS'e çevrilir. Oynatıcı konakları CF'sizdir — bu
   çözüm düz HTTP/vekil köprüsüyle her ortamda koşar. IFRAME listelenmez.

   Ölçülen gerçekler (2026-10-18):
     • GET {site}/arama/<slug> → <li class="film"><a href><span class="film-title">
     • Film sayfası: scx = {"atom":{"sx":{"t":"<rot13+b64>"}},…} anahtarları
       atom/advid/advidprox/proton/fast/fastly/tr/en
     • TRsTX: sayfadaki file":"<yol>" → POST {kok}/<yol> → [{title,file}] →
       GET {kok}/playlist/<file>.txt → içindeki http satırı = HLS
     • RapidVid av(): ters → base64 → "K9L" char-kaydır → base64 (eski ölçüm)
   ========================================================================== */

import { rotaYol, metinAl, jsonAl, tmdbBilgi, adayBasliklar, sadeles, slugla } from '../ortakCekirdek.js';
import { resolvePageInNativeWebView, hasNativeWebViewResolver } from '../../services/platform/androidWebViewResolver.js';

const AD = 'Sirius';
const ROTA = 'fhdf';
const VARSAYILAN_KOK = 'https://www.fullhdfilmizlesene.now';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const YAYIN_BASLIK = { 'User-Agent': 'okhttp/4.9.2', Accept: '*/*' };
const ANAHTARLAR = ['atom', 'advid', 'advidprox', 'proton', 'fast', 'fastly', 'tr', 'en'];

const norm = s => sadeles(String(s || '')).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const eslesir = (a, b) => { const x = norm(a), y = norm(b); return x && y && (x === y || x.includes(y) || y.includes(x)); };

const rot13 = s => String(s).replace(/[a-zA-Z]/g, c => {
  const taban = c.charCodeAt(0) <= 90 ? 65 : 97;
  return String.fromCharCode(((c.charCodeAt(0) - taban + 13) % 26) + taban);
});
const b64 = s => { try { return atob(String(s).replace(/\s+/g, '')); } catch (_) { return ''; } };
const kok = u => String(u || '').split('/').slice(0, 3).join('/');
const YAYIN = /\.(m3u8|mp4)(\?|#|$)/i;

/* Sayfa getirici: düz rota önce; CF meydan okuma sayfası GEÇERLİ SAYILMAZ
   (ölçülen 2026-10-18: 403 gövdesi 6 KB — salt uzunluk kapısı onu yutuyordu).
   Geçersizse ve köprü varsa gerçek Chromium gizli-WebView'ı devreye girer. */
async function sayfaGet(yol, gecerMi, ms = 9000) {
  const duz = await metinAl(rotaYol(ROTA, yol), { ref: `${rotaYol(ROTA)}/`, ms, basliklar: { 'User-Agent': UA } });
  if (duz && gecerMi(duz)) return duz;
  if (!hasNativeWebViewResolver()) return duz && gecerMi(duz) ? duz : '';
  const cozum = await resolvePageInNativeWebView(`${VARSAYILAN_KOK}${yol}`, { timeoutMs: 11000, media: false });
  const html = (cozum?.ok && cozum.html) || '';
  return gecerMi(html) ? html : '';
}

/* scx bloğu → {anahtar, linkler[]} (rot13 → base64). */
function scxLinkleri(html) {
  const m = String(html || '').match(/scx\s*=\s*(\{[\s\S]*?\});/);
  if (!m) return [];
  let veri = null;
  try { veri = JSON.parse(m[1]); } catch (_) { return []; }
  const gruplar = [];
  for (const anahtar of ANAHTARLAR) {
    const t = veri?.[anahtar]?.sx?.t;
    if (!t) continue;
    const coz = x => b64(rot13(String(x)));
    const linkler = Array.isArray(t) ? [t.map(coz).join(',')]
      : typeof t === 'object' ? Object.values(t).filter(v => typeof v === 'string').map(coz) : [];
    const acik = linkler.join(',').split(',').map(u => u.trim()).filter(u => /^https?:\/\//i.test(u));
    if (acik.length) gruplar.push({ anahtar, linkler: acik });
  }
  return gruplar;
}

function aramaKartlari(html) {
  const cikar = [];
  const gorulen = new Set();
  // Ölçülen (2026-10-18): kalıplar /film/<slug>/ ve /dizi/<slug>/; başlık
  // title="" ÖZELLİĞİNDE değil bağlantı METNİNDE (eski kalıp title= zorunlu
  // tutup kartları yutuyordu).
  for (const m of String(html || '').matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]{0,300}?)<\/a>/gi)) {
    const u = m[1];
    if (!/\/(film|dizi)\//i.test(u) || /\/(tur|ulke|kategori|yil)\//i.test(u) || gorulen.has(u)) continue;
    gorulen.add(u);
    const ad = (String(m[2]).match(/title="([^"]+)"/i) || [])[1]
      || String(m[2]).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (ad) cikar.push({ url: u, ad });
  }
  return cikar;
}

/* ── oynatıcı evi çözücüler (hepsi doğrudan HLS/MP4 hedefler) ─────────── */

/* WebView medya toplayıcı: JW aileleri uzantısız oynatma listesi URL'leri
   kullanıyor (ölçüldü 2026-10-18: …/m7/… master, …/mw/…, …/mc/…; .vtt altyazı).
   İstek sırası JW'de önce master'ı çağırır → ilk geçerli istek oynatma
   listesidir. Statik/log/reklam istekleri elenir. */
function medyaTopla(cozum) {
  const gorulen = new Set();
  const akislar = [];
  const altyazilar = [];
  const kaynaklar = [...(cozum?.streams || []).map(s => String(s?.url || '')), ...(cozum?.requests || []).map(String)];
  for (const u of kaynaklar) {
    if (!u || gorulen.has(u)) continue;
    gorulen.add(u);
    if (/\.vtt(\?|$)/i.test(u)) {
      if (altyazilar.length < 2) altyazilar.push({ src: u, label: altyazilar.length ? 'English' : 'Türkçe' });
      continue;
    }
    if (/\.(png|jpe?g|webp|gif|css|js|woff2?|ico|svg|php|log|json)(\?|$)/i.test(u)) continue;
    if (/\/ads?\/|preroll|vast|doubleclick|beacon|analytics|player-log|collect/i.test(u)) continue;
    if (/\.(m3u8|mp4|mpd)([?#]|$)/i.test(u) || /\/(m[0-9a-z]{1,3}|hls|vod|stream)\//i.test(u)) akislar.push(u);
  }
  return { akislar, altyazilar };
}

async function evCoz(embed) {
  const ref = embed;
  let html = await metinAl(embed, { ref, ms: 8000, basliklar: { 'User-Agent': UA } });
  let yakalanan = { akislar: [], altyazilar: [] };
  let webviewDenendi = false;
  if (!html || /just a moment|attention required|challenge-platform/i.test(html)) {
    // Ölçülen (2026-10-18): gömülü evler de CF'li — gerçek Chromium şart.
    if (!hasNativeWebViewResolver()) return null;
    webviewDenendi = true;
    const cozum = await resolvePageInNativeWebView(embed, { timeoutMs: 9000, media: true, referer: ref });
    html = cozum?.ok ? String(cozum.html || cozum.text || '') : '';
    yakalanan = medyaTopla(cozum);
    if (yakalanan.akislar.length) {
      return { url: yakalanan.akislar[0], ad: 'Gömülü', altyazilar: yakalanan.altyazilar, uzantiSiz: !/\.(m3u8|mp4|mpd)([?#]|$)/i.test(yakalanan.akislar[0]) };
    }
  }
  if (!html) return null;
  const k = kok(embed);

  if (/vidmoxy\.com/.test(embed)) {
    const hex = (html.match(/file":\s*"((?:\\x[0-9a-fA-F]{2})+)"/) || [])[1];
    let url = hex ? hex.split('\\x').filter(Boolean).map(h => String.fromCharCode(parseInt(h, 16))).join('') : '';
    if (!url) url = ((html.match(/file":"([^"]+\.m3u8[^"]*)"/) || [])[1] || '').replace(/\\/g, '');
    return url ? { url, ad: 'VidMoxy' } : null;
  }
  if (/rapidvid\./.test(embed)) {
    const av = ((html.match(/jwSetup\.sources\s*=\s*([\s\S]*?);/) || [])[1] || '').match(/av\('([^']+)'\)/)?.[1];
    if (!av) return null;
    let s = b64(av.split('').reverse().join(''));
    const anahtar = 'K9L';
    let kaydir = '';
    for (let i = 0; i < s.length; i++) kaydir += String.fromCharCode(s.charCodeAt(i) - (anahtar.charCodeAt(i % anahtar.length) % 5 + 1));
    const url = b64(kaydir);
    return YAYIN.test(url) ? { url, ad: 'RapidVid' } : null;
  }
  if (/turkeyplayer\.com/.test(embed)) {
    let v = null;
    try { v = JSON.parse((html.match(/var\s+video\s*=\s*(\{[\s\S]*?\});/) || [])[1] || 'null'); } catch (_) {}
    if (!v?.id || !v?.md5) return null;
    return { url: `${k}/m3u8/8/${v.md5}/master.txt?s=1&id=${v.id}&cache=1`, ad: 'TurkeyPlayer' };
  }
  if (/trstx\.org/.test(embed)) {
    const yol = ((html.match(/file":"([^"]+)"/) || [])[1] || '').replace(/\\/g, '').replace(/^\/+/, '');
    if (!yol) return null;
    const liste = await jsonAl(`${k}/${yol}`, { ref: embed, ms: 8000, govde: '', basliklar: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': UA } });
    for (const it of (Array.isArray(liste) ? liste : []).slice(1, 4)) {
      if (!it?.file) continue;
      const m3u = await metinAl(`${k}/playlist/${String(it.file).replace(/^\/+/, '')}.txt`, { ref: embed, ms: 7000, basliklar: { 'User-Agent': UA } });
      const u = String(m3u || '').trim().split('\n').map(x => x.trim()).find(x => /^https?:\/\//i.test(x));
      if (u) return { url: u, ad: `TRsTX ${it.title || ''}`.trim().slice(0, 40) };
    }
    return null;
  }
  if (/turbo\.imgz\./.test(embed)) {
    const url = (html.match(/file:\s*"([^"]+)"/) || [])[1];
    return url && YAYIN.test(url) ? { url, ad: 'TurboImgz' } : null;
  }
  const duz = (html.match(/["'](https?:\/\/[^"'\s]+\.m3u8[^"'\s]*)["']/i) || [])[1];
  if (duz) return { url: duz, ad: 'Gömülü' };
  // Şifre çözücü sustuysa oynatıcı kaynakları JS ile yükleniyor demektir
  // (ölçüldü 2026-10-18: uzantısız …/m7/… istekleri) — WebView medya yakalama.
  if (!webviewDenendi && hasNativeWebViewResolver()) {
    const cozum = await resolvePageInNativeWebView(embed, { timeoutMs: 9000, media: true, referer: ref });
    const yak = medyaTopla(cozum);
    if (yak.akislar.length) return { url: yak.akislar[0], ad: 'Gömülü', altyazilar: yak.altyazilar, uzantiSiz: !/\.(m3u8|mp4|mpd)([?#]|$)/i.test(yak.akislar[0]) };
  }
  return null;
}

export async function getStreams(kimlik, tur = 'movie') {
  if (tur !== 'movie') return []; // site yalnız film barındırıyor
  const bilgi = await tmdbBilgi(kimlik, 'movie');
  const adaylar = bilgi ? adayBasliklar(bilgi) : [];
  if (!adaylar.length) return [];

  /* 1. arama: slug denemeleri; kart başlık eşleşmeli (kör seçim yasak). */
  let filmYol = '';
  const sorgular = [...new Set([slugla(adaylar[0] || ''), slugla(bilgi?.orijinal || '')].filter(Boolean))].slice(0, 2);
  const aramaGecerli = h => /\/film\/|\/dizi\/|film-title|video-page/i.test(h);
  for (const q of sorgular) {
    const html = await sayfaGet(`/arama/${encodeURIComponent(q)}`, aramaGecerli, 8000);
    const kart = aramaKartlari(html).find(k => adaylar.some(a => eslesir(a, k.ad)));
    if (kart) { filmYol = kart.url.startsWith('http') ? new URL(kart.url).pathname : kart.url; break; }
  }
  if (!filmYol) return [];

  /* 2. film sayfası → scx → ilk 3 gruptan en fazla 5 bağlantıyı çöz. */
  const sayfa = await sayfaGet(filmYol, h => /scx\s*=|film-title/i.test(h));
  const islenecek = [];
  for (const g of scxLinkleri(sayfa)) for (const link of g.linkler.slice(0, 2)) islenecek.push({ ...g, link });
  const sonuc = [];
  const gorulen = new Set();
  // SIRAYLA + ilk başarıda dur: cihazda TEK gizli-WebView var, paralel
  // ateşleme kuyruğu şişirip bütçeyi yiyordu (ölçüldü 2026-10-18).
  for (const x of islenecek.slice(0, 5)) {
    const v = await evCoz(x.link);
    if (!v || !(YAYIN.test(v.url) || v.uzantiSiz) || gorulen.has(v.url)) continue;
    gorulen.add(v.url);
    const dublaj = /dublaj|dub/i.test(v.ad);
    sonuc.push({
      name: AD,
      title: `${AD} ${v.ad.replace(/\s+/g, ' ').slice(0, 18)}${dublaj ? ' Dublaj' : ''}`,
      url: v.url, quality: '1080p', format: /\.mp4/i.test(v.url) ? 'mp4' : 'm3u8',
      headers: { ...YAYIN_BASLIK, Referer: `${kok(v.url)}/` },
    });
    if (sonuc.length >= 2) break;
  }
  return sonuc;
}

var _exp = typeof module !== 'undefined' && module.exports ? module.exports : {},
  _glob = typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : {},
  _gs = _exp.getStreams || (_exp.default && _exp.default.getStreams) || _glob.getStreams || (typeof getStreams === 'function' ? getStreams : null);

if (_gs) {
  if (typeof globalThis !== 'undefined') globalThis.getStreams = _gs;
  if (typeof global !== 'undefined') global.getStreams = _gs;
  if (typeof window !== 'undefined') window.getStreams = _gs;
  if (typeof module !== 'undefined' && module.exports) { try { module.exports.getStreams = _gs; } catch (_) {} }
}
export default getStreams;
