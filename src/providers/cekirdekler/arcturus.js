/* ==========================================================================
   CinePulse — "Arcturus" çekirdeği (birinci taraf, bağımlılıksız)
   --------------------------------------------------------------------------
   Ne yapıyor: site tamamen Cloudflare JS-süzgeçli (düz HTTP 403) — tüm
   adımlar yerel gizli-WebView çözümleyicisiyle atılır. Oynatıcı gömülüleri
   (data-video_url) MEDYA kipiyle açılır; gerçek Chromium oynatıcının
   çağırdığı canlı akışlar istek-kaçırmadan toplanır, şifre çözücü gerekmez.

   Ölçülen gerçekler (2026-10-18, cihaz):
     • Arama ucu /arama/?s= DEĞİL: GET /ajax/autocomplete/?s=<q> →
       JSON {sonuc_kodu:"1", kayitlar:"<a href=\"/film/<slug>/…\">…"}.
     • Film/dizi sayfasında oynatıcı data-video_url="https://…/embed/…"
       (youtube gömülüleri elenir; closeload/rapid ailesi).
     • Gömülü sayfa media:true ile açıldığında rapid ailesi master.m3u8'i
       DOĞRUDAN veriyor (ölçüldü: s*.rapidrame.com/hls2/…/master.m3u8).
     • closeload ailesi yasaklı playmix.uno'ya yönlendiriyor → elenir.
     • Dizi bölüm kalıbı: /dizi/<slug>/sezon-<S>/bolum-<E>/

   Site adı yalnız bu yapılandırma satırındadır; arayüzde kahraman kodu görünür.
   ========================================================================== */

import { tmdbBilgi, adayBasliklar, sadeles } from '../ortakCekirdek.js';
import { resolvePageInNativeWebView, hasNativeWebViewResolver, resolverMesgulMu } from '../../services/platform/androidWebViewResolver.js';

const AD = 'Arcturus';
const VARSAYILAN_KOK = 'https://filmmakinesi.to';
const ELE = ['/filmler-', '/yabanci-dizi-', '/tur/', '/ulke/', '/kategori/'];
const YASAK_EV = ['playmix.uno', 'youtube.com', 'youtu.be'];
const YAYIN_BASLIK = { 'User-Agent': 'okhttp/4.9.2', Accept: '*/*' };

const norm = s => sadeles(String(s || '')).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const eslesir = (a, b) => { const x = norm(a), y = norm(b); return x && y && (x === y || x.includes(y) || y.includes(x)); };

/* Arama/sayfa HTML'inden film|dizi bağlantısı seç (kategori süzgeçli). */
function icerikBul(html, isFilm, adaylar) {
  let ilkYedek = '';
  // Pencere sınırsız: arama kartı gövdesi (poster + meta) 300 karakteri aşar,
  // kısıtlı pencere kartları yutuyordu (ölçüldü 2026-10-18). Tembel *? ilk
  // </a>'da durur.
  for (const m of String(html || '').matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    const u = m[1];
    if (!/\/(film|dizi)\//i.test(u) || ELE.some(x => u.includes(x))) continue;
    if ((/\/dizi\//i.test(u)) !== !isFilm) continue; // film aranan /dizi/ olamaz
    const metin = String(m[2] || '').replace(/<[^>]*>/g, ' ');
    if (metin.trim() && adaylar.some(a => eslesir(a, metin))) return u;
    if (!ilkYedek) ilkYedek = u;
  }
  return ilkYedek;
}

/* Sayfa gömülü oynatıcı adresleri: data-video_url + iframe (youtube hariç). */
function gomuluAdaylar(html) {
  const cikti = [];
  const gorulen = new Set();
  for (const m of String(html || '').matchAll(/data-video_url\s*=\s*"([^"]+)"/gi))
    if (!gorulen.has(m[1])) { gorulen.add(m[1]); cikti.push(m[1]); }
  for (const m of String(html || '').matchAll(/<iframe\b[^>]*?(?:data-src|src)\s*=\s*"([^"]+)"/gi))
    if (!gorulen.has(m[1])) { gorulen.add(m[1]); cikti.push(m[1]); }
  return cikti
    .map(u => (u.startsWith('//') ? `https:${u}` : u.startsWith('/') ? `${VARSAYILAN_KOK}${u}` : u))
    .filter(u => /^https?:/i.test(u) && !YASAK_EV.some(d => u.includes(d)))
    .sort((a, b) => (/closeload|rapid/i.test(b) ? 1 : 0) - (/closeload|rapid/i.test(a) ? 1 : 0));
}

export async function getStreams(kimlik, tur = 'movie', sezon = 1, bolum = 1) {
  // Çözücü kuyruğu meşgulse ANINDA vazgeçmek ardışık taramalarda (bölüm
  // geçişi!) Arcturus'u 0'a düşürüyordu: önceki taramanın butce-aşım
  // etmiş öksüz görevi kuyruğu tutmaya devam ediyor (ölçüm 2026-10-25).
  // Zincir başı biziz: kendi kuyruğumuzdayız, boşalmasını tavana sığacak
  // kadar bekle (38 sn bekleme + ~20 sn iş ≤ 65 sn tavaniMs); sığmazsa vazgeç.
  if (resolverMesgulMu()) {
    const t0 = Date.now();
    while (resolverMesgulMu() && Date.now() - t0 < 38000) {
      await new Promise((r) => setTimeout(r, 800));
    }
    if (resolverMesgulMu()) return [];
  }

  const bilgi = await tmdbBilgi(kimlik, tur);
  const adaylar = bilgi ? adayBasliklar(bilgi) : [];
  if (!adaylar.length) return [];
  const isFilm = tur !== 'tv';

  /* 1. arama: /ajax/autocomplete/?s= → JSON {sonuc_kodu, kayitlar} */
  let icerikUrl = '';
  for (const soru of adaylar.slice(0, 2)) {
    const arama = await resolvePageInNativeWebView(
      `${VARSAYILAN_KOK}/ajax/autocomplete/?s=${encodeURIComponent(soru)}`,
      { timeoutMs: 9000, media: false, referer: `${VARSAYILAN_KOK}/` },
    );
    if (!arama?.ok) continue;
    let kayitlar = String(arama.text || '').trim();
    if (!kayitlar.startsWith('{')) kayitlar = String(arama.html || '').replace(/<[^>]+>/g, '');
    let kayitHtml = '';
    try { kayitHtml = JSON.parse(kayitlar)?.kayitlar || ''; } catch (_) { kayitHtml = kayitlar; }
    icerikUrl = icerikBul(kayitHtml, isFilm, adaylar);
    if (icerikUrl) break;
  }
  if (!icerikUrl) return [];
  if (!/^https?:/i.test(icerikUrl)) icerikUrl = `${VARSAYILAN_KOK}${icerikUrl.startsWith('/') ? '' : '/'}${icerikUrl}`;

  /* 2. dizi: bölüm kalıbı URL'ye eklenir (eski çekirdeğin kanıtladığı kalıp). */
  if (!isFilm && !/sezon-\d+\/bolum-\d+/i.test(icerikUrl)) {
    icerikUrl = `${icerikUrl.replace(/\/$/, '')}/sezon-${+sezon || 1}/bolum-${+bolum || 1}/`;
  }

  /* 3. içerik/bölüm sayfası → gömülü oynatıcı adayları. */
  const sayfa = await resolvePageInNativeWebView(icerikUrl, {
    timeoutMs: 11000, media: false, referer: `${VARSAYILAN_KOK}/`,
  });
  if (!sayfa?.ok) return [];
  const gomululer = gomuluAdaylar(sayfa.html);
  if (!gomululer.length) return [];

  /* 4. her gömülü MEDYA kipiyle açılır; oynatıcının akışı yakalanır. */
  const sonuc = [];
  const gorulen = new Set();
  for (const gomulu of gomululer.slice(0, 3)) {
    const cozum = await resolvePageInNativeWebView(gomulu, {
      timeoutMs: 9000, media: true, referer: icerikUrl,
    });
    for (const a of cozum?.streams || []) {
      const url = String(a?.url || '');
      if (!/\.(m3u8|mp4|mpd)([?#]|$)/i.test(url)) continue;
      if (/\/ads?\/|preroll|vast|doubleclick|\.gif|\.png/i.test(url)) continue; // reklam akışları
      if (YASAK_EV.some(d => url.includes(d)) || gorulen.has(url) || sonuc.length >= 3) continue;
      gorulen.add(url);
      let ev = gomulu;
      try { ev = new URL(gomulu).origin; } catch (_) {}
      const dublaj = /dublaj|dub[^b]/i.test(url);
      sonuc.push({
        name: AD,
        title: `${AD} Sunucu ${sonuc.length + 1}${dublaj ? ' Dublaj' : ''}`,
        url, quality: '1080p', format: /\.mp4/i.test(url) ? 'mp4' : 'm3u8',
        headers: { ...YAYIN_BASLIK, Referer: `${ev}/` },
      });
      if (sonuc.length >= 3) break;
    }
    if (sonuc.length >= 3) break;
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