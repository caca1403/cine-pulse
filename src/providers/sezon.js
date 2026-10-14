/* ==========================================================================
   VEGA — Dizi/animasyon/belgesel havuzu (site adı arayüze SIZMAZ)

   2026-10-15 canlı ölçümleri:
     1. Arama   : POST /ajax/arama.asp {q} → {results:{diziler:{results:
                    [{did,title,url,imdb}]}}}  (başlık "Ad (YYYY)" biçiminde)
                  — anonime açık, kimlik kapısı burada kurulur.
     2. Bölüm   : /{slug}/{S}-sezon-{E}-bolum.html (ölçüldü: 200 + #dilsec).
     3. Oynatıcı: dataEmbed22.asp iframe'i TÜM sunucularda Cloudflare
                  Turnstile ("onay") kapılı — curl_cffi/tarayıcısız geçilemez
                  (Kekik'te de geçilemiyor; Core'da solver yok, ölçüldü).
                  BİZİM YOL: gizli WebView (gerçek Chromium) bölüm sayfasını
                  media=true ile açar: sitenin kendi JS'i yönetilmiş Turnstile'ı
                  tıklamadan geçer, sunucu iframe'i yüklenir, Android
                  shouldInterceptRequest oyuncunun istediği m3u8/mp4 akışını
                  `streams` olarak yakalar → akış adresi doğrudan gelir.
                  (MainActivity/NativePageResolver media akışı, cihazda kanıt
                  bekliyor; V1 tek hat.)
     4. Dublaj  : dublaj sayfası kalıbı henüz ölçülmedi → V1 yalnız altyazı
                  hattı listeler; TR dublaj ihtiyacını Hidra gömülü hatları
                  karşılar (ölçümlü). Ölçülmeden dublaj kaynağı YAYILMAZ.
   BÜTÇE: 2 arama (6sn) + 1 bölüm doğrulama (7sn) + WebView ≤22sn.
   Gizli WebView cihazda TEK ve sıralıdır; meşgulse bu sağlayıcı erken düşer
   (başka sağlayıcının bütçesini yakmamak için).
   ========================================================================== */

import { istek, gonder, izleyici, kaynak, temizBaslik, siteurlHaritasi } from './kit.js';
import { hasNativeWebViewResolver, resolverMesgulMu, resolvePageInNativeWebView } from '../services/platform/androidWebViewResolver.js';
import { extractEmbedStream } from '../services/embedExtractors.js';

const YEDEK_KOK = 'https://sezonlukdizi.cc'; // alan adı değişirse siteurl haritasındaki 'szd' anahtarı kazanır

export const kimlik = { id: 'szd', alias: 'Vega', mediaTypes: ['tv'] };

/** arama.asp JSON'undan kimlik kapılı aday listesi: [{slug, ad, yil, imdb}] */
export function adaylarSec(json, hedefler, yil) {
  // Tam/öneşek dışı (içeren) eşleşme YETERLİ sayılmaz: "the riverdale story"
  // ≠ "riverdale". Şüphe varsa hiç listelenmez ("2000 se 2000").
  const nor = (x) => String(x || '').toLowerCase()
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
  const puan = (ad) => {
    const a = nor(ad);
    let en = 0;
    for (const h of hedefler) {
      const t = nor(h);
      if (!t || t.length < 3) continue;
      if (a === t) en = Math.max(en, 6);
      else if (a.startsWith(`${t} `)) en = Math.max(en, 4); // "naruto shippuden" ⊃ "naruto" — yıl kapısı ayrıca ayırır
    }
    return en;
  };
  const gruplar = Object.values((json && json.results) || {});
  const adaylar = [];
  for (const g of gruplar) {
    for (const r of (g && g.results) || []) {
      const tam = String(r.title || '');
      const ym = tam.match(/\((\d{4})\)\s*$/);
      const yil2 = ym ? +ym[1] : null;
      const ad = tam.replace(/\s*\(\d{4}\)\s*$/, '').trim();
      const slugli = String(r.url || '').match(/\/diziler\/([a-z0-9-]+)\.html/i);
      if (!slugli || !ad || puan(ad) < 4) continue;
      // KİMLİK KAPISI: yıl biliniyorsa aday yılı olmalı ve ±1 içinde kalmalı.
      if (yil && (!yil2 || Math.abs(yil2 - +yil) > 1)) continue;
      adaylar.push({ slug: slugli[1], ad, yil: yil2, imdb: Number(r.imdb) || 0 });
    }
  }
  return adaylar.sort((a, b) => b.imdb - a.imdb);
}

/** Bölüm adresi kalıbı (ölçüldü): /{slug}/{S}-sezon-{E}-bolum.html */
export function bolumAdresi(kok, slug, s, e) {
  return `${kok}/${slug}/${+s || 1}-sezon-${+e || 1}-bolum.html`;
}

/** WebView akış yakalayıcısından oynatılabilir, tekrarları az liste. */
export function akislariSec(streams) {
  const gorulen = new Set();
  const out = [];
  for (const s of streams || []) {
    const u = String((s && s.url) || '');
    if (!/\.(m3u8|mp4|mpd)([?#]|$)/i.test(u)) continue;
    const anahtar = u.replace(/[?#].*$/, '');
    if (gorulen.has(anahtar)) continue;
    gorulen.add(anahtar);
    out.push({ url: u, headers: (s && s.headers) || {} });
  }
  return out.slice(0, 3);
}

/* ── ana akış ─────────────────────────────────────────────────────────── */
export async function coz({ type = 'tv', title = '', originalTitle = '', titles = [], year = null, season = 1, episode = 1 } = {}) {
  const trace = izleyici();
  const bas = Date.now();
  const kalan = (pay) => Math.max(1500, pay - (Date.now() - bas));
  if (type !== 'tv') return { sources: [], trace: trace.ozet() };
  const hedefler = [...new Set([temizBaslik(originalTitle), temizBaslik(title), ...titles.map(temizBaslik)].filter((t) => t && t.length > 2))];
  if (!hedefler.length) return { sources: [], trace: trace.ozet() };

  // 0) alan adı: siteurl haritasındaki 'szd' anahtarı varsa O, yoksa bilinen kurulum
  let kok = YEDEK_KOK;
  try {
    const harita = await siteurlHaritasi({ trace });
    if (harita && harita.szd) kok = String(harita.szd).replace(/\/+$/, '');
  } catch (_) {}

  // 1) arama (en çok iki hedef adı; JSON kimlik kapısı)
  let aday = null;
  for (const h of hedefler.slice(0, 2)) {
    const ham = await gonder(`${kok}/ajax/arama.asp`, `q=${encodeURIComponent(h)}`, {
      ref: `${kok}/`, headers: { 'X-Requested-With': 'XMLHttpRequest' }, timeout: kalan(13000), trace,
    });
    let json = null;
    try { json = JSON.parse(ham); } catch (_) {}
    const bulunan = adaylarSec(json, hedefler, year);
    if (bulunan.length) { aday = bulunan[0]; break; }
  }
  trace.koy('kimlik', aday ? { slug: aday.slug, ad: aday.ad, yil: aday.yil } : { red: hedefler[0] });
  if (!aday) return { sources: [], trace: trace.ozet() };

  // 2) bölüm sayfasını doğrula (yanlış bölümde ana sayfaya döner — izleme yok)
  const ep = bolumAdresi(kok, aday.slug, season, episode);
  const epHam = await istek(ep, { ref: `${kok}/`, timeout: kalan(21000), webView: false, trace });
  if (!epHam || !/id="dilsec"|id="playerMenu"/i.test(epHam)) {
    trace.koy('bolum-yok', { slug: aday.slug, s: +season || 1, e: +episode || 1 });
    return { sources: [], trace: trace.ozet() };
  }

  // 3) oynatıcı: gizli WebView'de bölüm sayfası; sitenin JS'i Turnstile'ı kendi
  //    geçer, oyuncunun istediği akış media-yakalayıcıdan düşer.
  if (!hasNativeWebViewResolver()) { trace.koy('webview-yok', {}); return { sources: [], trace: trace.ozet() }; }
  if (resolverMesgulMu()) { trace.koy('webview-mesgul', {}); return { sources: [], trace: trace.ozet() }; }
  const butce = Math.min(22000, kalan(44000));
  const cozum = await resolvePageInNativeWebView(ep, { media: true, timeoutMs: butce });
  if (!cozum || cozum.challenge) { trace.koy('webview-bos', { butce }); return { sources: [], trace: trace.ozet() }; }
  // Kimlik bekçisi: WebView bizi ana sayfaya/otomatik yönlendirmeye attıysa yok say
  const final = String(cozum.finalUrl || cozum.url || ep);
  if (!final.includes(`/${aday.slug}/`)) {
    trace.koy('kimlik-sonuc-kaydi', { final: final.slice(0, 90) });
    return { sources: [], trace: trace.ozet() };
  }

  const kaynaklar = [];
  const akislar = akislariSec(cozum.streams);
  trace.koy('akis-yakalandi', { n: akislar.length });
  for (const a of akislar) {
    const hd = String(a.headers['User-Agent'] || a.headers['user-agent'] || '');
    kaynaklar.push(kaynak({
      id: `szd_${aday.slug}_${+season || 1}x${+episode || 1}_${kaynaklar.length}`,
      ad: 'Vega HD Akış',
      url: a.url,
      kategori: 'subtitled',
      // Oyuncunun kendi başlıkları akışın bağlı olduğu parmak izidir — olduğu gibi taşınır.
      headers: { ...(hd ? { 'User-Agent': hd } : {}), Referer: ep },
      kalite: '',
      hls: /\.m3u8/i.test(a.url),
    }));
  }

  // 4) akış yakalanamadıysa: #embed'deki gerçek sunucu iframe'ini bul ve tek
  //    extractor denemesi yap (dzen/vk gibi zincirler için; captcha iframe'i ASLA).
  if (!kaynaklar.length) {
    const iframe = (String(cozum.html || '').match(/<iframe[^>]+src=["']([^"']+)["']/gi) || [])
      .map((x) => x.match(/src=["']([^"']+)["']/i)?.[1] || '')
      .find((u) => /^https?:/i.test(u) && !/reCAPTCHA|challenges\.cloudflare/i.test(u));
    if (iframe) {
      const acik = await extractEmbedStream(iframe, ep, new Set(), 0, '').catch(() => null);
      const u = String((acik && (acik.url || acik.streamUrl)) || '');
      if (u && /\.(m3u8|mp4|mpd)([?#]|$)/i.test(u)) {
        kaynaklar.push(kaynak({ id: `szd_${aday.slug}_${+season || 1}x${+episode || 1}_x`, ad: 'Vega HD Akış', url: u, kategori: 'subtitled', headers: { Referer: ep }, kalite: '', hls: /\.m3u8/i.test(u) }));
        trace.koy('extractor', { ok: true });
      } else trace.koy('extractor', { ok: false });
    } else trace.koy('iframe-yok', {});
  }

  trace.koy('sonuc', { slug: aday.slug, kaynak: kaynaklar.length, ms: Date.now() - bas });
  return { sources: kaynaklar, trace: trace.ozet() };
}

export default {
  apiVersion: 1,
  id: kimlik.id,
  name: kimlik.alias,
  mediaTypes: kimlik.mediaTypes,
  async resolve(a) { return (await coz(a)).sources; },
};
