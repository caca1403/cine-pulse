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

import { tmdbBilgi } from '../ortakCekirdek.js';
import { resolvePageInNativeWebView, hasNativeWebViewResolver, resolverMesgulMu } from '../../services/platform/androidWebViewResolver.js';

const AD = 'Robin';
const VARSAYILAN_KOK = 'https://sezonlukdizi.cc';

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

export async function getStreams(kimlik, tur = 'tv', sezon = 1, bolum = 1) {
  if (tur !== 'tv') return []; // site dizi kaynağıdır; film vaat etmiyoruz
  if (!hasNativeWebViewResolver() || resolverMesgulMu()) return []; // site yalnız gerçek Chromium'a açılır

  const bilgi = await tmdbBilgi(kimlik, 'tv');
  const slug = slugYap((bilgi && (bilgi.orijinal || bilgi.baslik)) || '');
  if (slug.length < 3) return [];

  const bolumUrl = `${VARSAYILAN_KOK}/${slug}/${+sezon || 1}-sezon-${+bolum || 1}-bolum.html`;
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
