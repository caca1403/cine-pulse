/* ==========================================================================
   CinePulse — "Robin" çekirdeği (birinci taraf, bağımlılıksız) — YALNIZ TV
   --------------------------------------------------------------------------
   Ne yapıyor: Dizi sitesinin (rota: szd) bölüm sayfasını adres şablonundan
   kurar; site Cloudflare bot süzgeci düz istemcileri kestiği için sayfayı
   gerçek Chromium'da açan yerel gizli-WebView çözümleyicisini kullanır ve
   oynatıcının çektiği akışları (m3u8/mp4) yakalar.

   Ölçülen gerçekler (2026-10-18, cihazdan; iki kez yeniden doğrulandı):
     • POST /ajax/arama.asp → boş 200 (çerez kavanozu sıcakken de) — CF bu
      ucu TLS parmak iziyle kesiyor; düz GET bölüm sayfası → 503. Sadece
      gerçek WebView geçer. Arama KULLANILMAZ.
     • Slug = başlığın kebab-case hâli (Türkçe harfler ASCII'ye): TMDB
       "Breaking Bad" → /breaking-bad/1-sezon-1-bolum.html (canlı ölçüldü).
     • Bölüm sayfası geçerleme deseni: id="dilsec" veya id="playerMenu"
       (yanlış slug ana sayfaya düşer).
     • Oynatıcı sekme düğmelerine ("sunucu N" / "oynat") dokunulmadan akış
       isteği GİTMEZ — çözümleyicinin NUDGE adımı bunu gizli sayfada yapar.
   ========================================================================== */

import { tmdbBilgi, metinAl, jsonAl } from '../ortakCekirdek.js';
import { alanYaniti } from '../alanlar.js';
import { resolvePageInNativeWebView, hasNativeWebViewResolver, resolverMesgulMu } from '../../services/platform/androidWebViewResolver.js';

const AD = 'Robin';
const VARSAYILAN_KOK = 'https://sezonlukdizi.cc';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

/** Başlıktan site slug'ı üret: küçük harf + Türkçe ASCII + tire. */
export function slugYap(ad) {
  return String(ad || '')
    .toLowerCase()
    .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i')
    .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
    .replace(/\u0307/g, '') // 'İ'.toLowerCase() = i + birleşik nokta üretir; nokta düşer
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const bolumGecerli = c => /id="dilsec"|id="playerMenu"/i.test(String(c?.html || ''));

const b64u = (s) => {
  const b = String(s || '').replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b + '='.repeat((4 - (b.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};

/* Byse/Filemoon (bysejikuar.com) API + AES-256-GCM oynatıcı çözücü. */
async function byseCoz(embedUrl) {
  try {
    const u = new URL(embedUrl);
    const code = u.pathname.split('/').filter(Boolean).pop();
    if (!code || typeof crypto === 'undefined' || !crypto.subtle) return null;
    const v = await jsonAl(`${u.origin}/api/videos/${encodeURIComponent(code)}`, {
      ref: embedUrl, ms: 7000, basliklar: { 'User-Agent': UA },
    });
    const pb = v?.playback;
    if (!pb?.iv || !pb?.payload || !Array.isArray(pb?.key_parts)) return null;
    const n = parseInt(pb.version, 10);
    const p1 = pb.key_parts[n - 1];
    const p2 = pb.key_parts[31 - n - 1];
    const secilen = (p1 && p2) ? [p1, p2].map(b64u) : pb.key_parts.map(b64u);
    const rawKey = new Uint8Array(secilen.reduce((a, p) => a + p.length, 0));
    let off = 0;
    for (const p of secilen) { rawKey.set(p, off); off += p.length; }
    const key = await crypto.subtle.importKey('raw', rawKey, 'AES-GCM', false, ['decrypt']);
    const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64u(pb.iv) }, key, b64u(pb.payload));
    const data = JSON.parse(new TextDecoder().decode(dec));
    const src = (data?.sources || []).find((s) => /\.m3u8/i.test(String(s?.url || ''))) || data?.sources?.[0];
    if (!src?.url) return null;
    return { url: src.url, ref: `${u.origin}/`, kalite: src.label || (src.height ? `${src.height}p` : '720p') };
  } catch (_) {
    return null;
  }
}

/* Düz HTTP yolu: bölüm sayfasından bid al → dataAlternatif22 → dataEmbed22 → byseCoz. */
async function duzHttpCoz(kok, bolumUrl) {
  const html = await metinAl(bolumUrl, { ref: `${kok}/`, ms: 8000, basliklar: { 'User-Agent': UA } });
  if (!bolumGecerli({ html })) return [];
  const bid = html.match(/bid\s*[:=]\s*["']?(\d+)/i)?.[1] || html.match(/data-id=["'](\d+)/i)?.[1];
  if (!bid) return [];

  const sonuc = [];
  const gorulen = new Set();
  for (const [dil, etiket] of [[1, 'Dublaj'], [0, 'Altyazı']]) {
    const alt = await jsonAl(`${kok}/ajax/dataAlternatif22.asp`, {
      ref: bolumUrl, ms: 6000,
      govde: `bid=${encodeURIComponent(bid)}&dil=${dil}`,
      basliklar: { 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest' },
    });
    const liste = Array.isArray(alt?.data) ? alt.data : [];
    const oncelikli = [
      ...liste.filter((x) => /filemoon|byse/i.test(String(x?.baslik || ''))),
      ...liste.filter((x) => !/filemoon|byse/i.test(String(x?.baslik || ''))),
    ];
    for (const item of oncelikli.slice(0, 2)) {
      let iframe = '';
      try {
        const r = await fetch(`${kok}/ajax/dataEmbed22.asp`, {
          method: 'POST',
          headers: { 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest', Referer: bolumUrl },
          body: `id=${encodeURIComponent(item.id)}`,
          signal: AbortSignal.timeout(6000),
        });
        const t = r.ok ? await r.text() : '';
        if (/reCAPTCHADATA/i.test(t)) continue;
        iframe = t.match(/<iframe[^>]*src=["']([^"']+)["']/i)?.[1] || '';
      } catch (_) { continue; }
      if (!iframe) continue;
      const cozulmus = await byseCoz(iframe.startsWith('//') ? `https:${iframe}` : iframe);
      if (cozulmus && !gorulen.has(cozulmus.url)) {
        gorulen.add(cozulmus.url);
        sonuc.push({
          name: AD,
          title: `${AD} · ${cozulmus.kalite} · ${etiket}`,
          url: cozulmus.url,
          quality: cozulmus.kalite,
          format: 'm3u8',
          headers: { 'User-Agent': UA, Referer: cozulmus.ref },
        });
        break; // bu dil için çalışan akış bulundu, 429 önlemek için diğerlerine geçme
      }
    }
  }
  return sonuc;
}

export async function getStreams(kimlik, tur = 'tv', sezon = 1, bolum = 1) {
  if (tur !== 'tv') return []; // site dizi kaynağıdır; film vaat etmiyoruz

  const bilgi = await tmdbBilgi(kimlik, 'tv');
  const adayAdlar = [bilgi?.orijinal, bilgi?.baslik].filter(Boolean);
  const slug = slugYap(adayAdlar[0] || '');
  if (slug.length < 3) return [];

  let kok = VARSAYILAN_KOK;
  try { kok = alanYaniti().domains['Robin'] || kok; } catch (_) {}

  const bolumUrl = `${kok}/${slug}/${+sezon || 1}-sezon-${+bolum || 1}-bolum.html`;
  const duz = await duzHttpCoz(kok, bolumUrl);
  if (duz.length) return duz;

  if (!hasNativeWebViewResolver() || resolverMesgulMu()) return [];
  const cozum = await resolvePageInNativeWebView(bolumUrl, { timeoutMs: 18000, media: true });
  if (!cozum?.ok || !bolumGecerli(cozum)) return [];

  /* Kimlik bekçisi: final adres hâlâ doğru içerik sayfasında mı? */
  const finalUrl = String(cozum.finalUrl || '');
  if (finalUrl && !finalUrl.includes(`/${slug}/`)) return [];

  const akislar = [];
  const gorulen = new Set();
  for (const a of cozum.streams || []) {
    const url = String(a?.url || '');
    if (!/\.(m3u8|mp4|mpd)([?#]|$)/i.test(url)) continue;
    if (/\/ads?\/|preroll|vast|doubleclick/i.test(url)) continue; // reklam ağlarının takma akışları
    const anahtar = url.split(/[?#]/)[0];
    if (gorulen.has(anahtar)) continue;
    gorulen.add(anahtar);
    akislar.push(a);
    if (akislar.length >= 3) break;
  }

  const ref = finalUrl || bolumUrl;
  return akislar.map((a, i) => {
    const mp4 = /\.mp4([?#]|$)/i.test(a.url);
    return {
      name: AD,
      title: `${AD} Akış ${i + 1}`,
      url: a.url,
      quality: '1080p',
      format: mp4 ? 'mp4' : 'm3u8',
      headers: { ...(a.headers || {}), Referer: ref },
    };
  });
}

if (typeof globalThis !== 'undefined') globalThis.getStreams = getStreams;
export default getStreams;
