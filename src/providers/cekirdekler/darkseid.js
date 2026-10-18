/* ==========================================================================
   CinePulse — "Darkseid" çekirdeği (birinci taraf, bağımlılıksız) — film + TV
   --------------------------------------------------------------------------
   Ne yapıyor: En büyük Türkçe film/dizi sitelerinden birini (alan: hdfc ailesi)
   tarar; Cloudflare kapısı olduğu için istekler önce düz HTTP denenir, düşerse
   cihazın gizli WebView'ı sayfayı gerçek Chromium'da açar (çerezler cihazda
   birikir, sonraki istekler geçer). Oynatıcı HTML'indeki şifreli yayın adresi
   kodCozler.js'deki SAF şema çözücüleriyle (be/dn/gn/paket) açılır.

   Ölçülen gerçekler (2026-10-18, bu çekirdek yazılırken canlı doğrulandı):
     • Düz HTTP istemcileri kökte 403 döner (Cloudflare) → WebView şart.
     • Arama ucu: GET {site}/search/?q=<metin> (X-Requested-With: fetch) → JSON
       {results:[{url,title,…}]}; düz dizi veya HTML parçası da gelebilir.
     • Bölüm adresi: {içerik}/sezon-{S}/bolum-{E}/ (deterministik önce).
     • Oynatıcı düğmeleri: <button data-video="<id>"> → GET {site}/video/<id>/
       (JSON data.html içinde iframe) — iframe ASLA listelenmez.
     • Yayın, iframe HTML'inde şemalı gömülüdür; çözümleme kodCozler.js'de.
     • Yayın başlıkları: Referer oynatıcı kökü + User-Agent okhttp/4.9.2.
   ========================================================================== */

import { metinAl, sadeles, adayBasliklar, tmdbBilgi } from '../ortakCekirdek.js';
import { alanYaniti } from '../alanlar.js';
import { sifreCoz } from '../kodCozler.js';
import { resolvePageInNativeWebView, hasNativeWebViewResolver } from '../../services/platform/androidWebViewResolver.js';

const AD = 'Darkseid';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const YEDEK_KOKLER = ['https://www.hdfilmcehennemi.nl'];
const OYATICI_KAPI = /embed|player|rplayer|rapidrame|closeload|play/i;

const norm = s => sadeles(String(s || '')).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

function kokler() {
  let canli = '';
  try { canli = alanYaniti().domains['Darkseid'] || ''; } catch (_) { /* sabit haritaya düş */ }
  return [...new Set([canli, ...YEDEK_KOKLER].filter(Boolean))];
}

/* Cloudflare/bot sayfası mı? (JSON ve #EXTM3U asla engel sayılmaz.) */
function engelMi(govde) {
  const s = String(govde || '');
  if (!s) return true;
  const kucuk = s.slice(0, 8000).toLowerCase();
  if (/^\s*[[{]/.test(kucuk) || kucuk.startsWith('#extm3u')) return false;
  return ['just a moment', 'attention required', 'checking your browser', 'enable javascript and cookies',
    'verifying you are human', 'challenge-platform', 'cf-chl', 'cf_chl_', 'turnstile', 'you have been blocked',
    'ddos-guard', 'error 1020', 'error 1015', 'too many requests'].some(i => kucuk.includes(i));
}

/* Sayfayı getir: düz HTTP dene; düşerse gizli WebView (tek yineleme). */
async function sayfaAc(adres, { ref = '', ms = 10000, json = false } = {}) {
  const govde = await metinAl(adres, {
    ref: ref || undefined, ms,
    basliklar: {
      'User-Agent': UA,
      'X-Requested-With': json ? 'fetch' : 'XMLHttpRequest',
      Accept: json ? 'application/json, text/plain, */*' : 'text/html,application/xhtml+xml,*/*',
    },
  });
  if (!engelMi(govde)) return govde;
  if (!hasNativeWebViewResolver()) return '';
  try {
    const cozum = await resolvePageInNativeWebView(adres, { timeoutMs: 18000, media: false });
    if (!cozum?.ok) return '';
    const ham = /^\s*[[{]/.test(String(cozum.text || '')) ? String(cozum.text) : String(cozum.html || '');
    return engelMi(ham) ? '' : ham;
  } catch (_) { return ''; }
}

/* Arama yanıtını üç biçimden de (JSON dizi/nesne, HTML parçası) karta çevirir. */
function kartlarAyristir(ham) {
  const kartlar = [];
  const itir = (url, baslik, yil) => {
    if (!url || /\/assets\/|\.css(\?|$)|\.js(\?|$)|\.png|\.jpe?g|\.svg|\.webp|\.ico|\.woff/i.test(url)) return;
    if (/\/search(?:\/|\?|$)/i.test(url)) return;
    kartlar.push({ url, baslik: String(baslik || ''), yil: parseInt(String(yil || '').match(/\d{4}/)?.[0] || '', 10) || null });
  };
  const Metin = String(ham || '').trim();
  const htmlKartlar = (govde) => {
    // Pencere sınırsız: kart gövdesi SVG ikonlarla 1 KB'ı aşabiliyor (ölçüldü hdfc 2026-10-18);
    // kısıtlı pencere kartları yutuyordu. Tembel *? zaten ilk </a>'da durur.
    for (const m of String(govde).matchAll(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
      const icerik = m[2];
      const baslik = icerik.match(/class="[^"]*title[^"]*"[^>]*>([^<]+)</i)?.[1]
        || icerik.match(/alt="([^"]+)"/i)?.[1] || '';
      const yil = icerik.match(/class="[^"]*year[^"]*"[^>]*>(\d{4})/i)?.[1] || '';
      itir(m[1], baslik, yil);
    }
  };
  if (Metin.startsWith('{') || Metin.startsWith('[')) {
    let j = null;
    try { j = JSON.parse(Metin); } catch (_) { /* HTML parçasına düş */ }
    if (j) {
      const liste = Array.isArray(j) ? j : Array.isArray(j.results) ? j.results : [];
      for (const k of liste) {
        // Ölçülen (2026-10-18, cihaz): results öğeleri HTML PARÇASI metinler
        // ("<a href=...>...</a>"); nesne sandığımız alanlar karakter dizileriydi.
        if (typeof k === 'string') htmlKartlar(k);
        else if (k) itir(k.url || k.href || k.link, k.title || k.name, k.year);
      }
      return kartlar;
    }
  }
  htmlKartlar(Metin);
  return kartlar;
}

/* Puanla: tam başlık +6, slug URL'de +3, tür +1; yıl bağ çözücü. Puan 0 ASLA seçilmez. */
function enIyiKart(kartlar, dizi, adaylar, hedefYil, slug) {
  const puanla = k => {
    let p = 0;
    const yol = String(k.url || '');
    const baslik = norm(String(k.baslik || '').split(/[-–—]/)[0]);
    if (slug && yol.includes(slug)) p += 3;
    if (baslik && adaylar.some(a => a === baslik)) p += 6;
    else if (baslik && adaylar.some(a => a.includes(baslik) || baslik.includes(a))) p += 2;
    if (!dizi && /\/film\//i.test(yol)) p += 1;
    if (dizi && /\/dizi\//i.test(yol) && !/\/bolum\//i.test(yol)) p += 1;
    return p;
  };
  const skorlar = kartlar.map(k => ({ k, p: puanla(k) })).filter(x => x.p > 0);
  if (!skorlar.length) return '';
  const uygun = skorlar.filter(x => !hedefYil || !x.k.yil || Math.abs(x.k.yil - hedefYil) <= 1);
  const havuz = uygun.length ? uygun : skorlar;
  havuz.sort((a, b) => b.p - a.p);
  return havuz[0].k.url;
}

/* Bölüm/film sayfasından oynatıcı adayları: iframe'ler + data-video düğmeleri. */
async function oynaticiAdaylari(ham, base, referer) {
  const adaylar = [];
  const gorulen = new Set();
  for (const m of String(ham).matchAll(/<iframe\b[^>]*?(?:data-src|src)=["']([^"']+)["'][^>]*>/gi)) {
    const url = m[1].startsWith('http') ? m[1] : `${base}${m[1]}`;
    if (OYATICI_KAPI.test(url) && !gorulen.has(url)) { gorulen.add(url); adaylar.push(url); }
  }
  for (const m of String(ham).matchAll(/<button[^>]*data-video=["']?([\w-]+)["']?[^>]*>([\s\S]{0,200}?)<\/button>/gi)) {
    const id = m[1];
    if (gorulen.has(`v:${id}`)) continue;
    gorulen.add(`v:${id}`);
    const jsonHam = await sayfaAc(`${base}/video/${id}/`, { ref: referer, ms: 10000, json: true });
    if (!jsonHam) continue;
    let icerik = '';
    try { icerik = JSON.parse(jsonHam)?.data?.html || ''; } catch (_) {
      icerik = jsonHam.replace(/<[^>]+>/g, ''); // <pre> sarmalayıcılı JSON
    }
    const iframe = String(icerik).match(/<iframe\b[^>]*?(?:data-src|src)=["']([^"']+)["']/i)?.[1]
      || String(icerik).match(/https?:\/\/[^\s<>"']+/)?.[0] || '';
    const url = iframe.startsWith('http') ? iframe : iframe ? `${base}${iframe}` : '';
    if (url && OYATICI_KAPI.test(url) && !gorulen.has(url)) { gorulen.add(url); adaylar.push(url); }
    if (adaylar.length >= 3) break;
  }
  return adaylar.slice(0, 3);
}

/* 2026-10-18 cihaz analizi: arama + /video/{id} uçları duruyor AMA gösterim/bölüm
   sayfalarında sunucu düğmeleri (data-video / aria-label='Play video') artık hiç
   basılmıyor — oynatıcı bölümü oturum/gerisayım koşullu dolduruluyor.
   Aday düğme kaynağı bulunursa akış şeması eski Vercel çözücüsündeki gibi:
   iframe → sources:[{file:VAR}] → VAR=RastgeleFN([...]) → zincir kod çözme. */
export async function getStreams(kimlik, tur = 'movie', sezon = 1, bolum = 1) {
  const dizi = tur === 'tv';
  const bilgi = await tmdbBilgi(kimlik, tur);
  const adaylar = (bilgi ? adayBasliklar(bilgi) : [String(kimlik || '')]).map(norm).filter(t => t.length > 2);
  if (!adaylar.length) return [];

  /* Çalışan kökü ara + arama; ilk sonuç veren kazanır. */
  let base = '';
  let icerikUrl = '';
  const slug = adaylar[0].replace(/ +/g, '-');
  for (const kok of kokler()) {
    for (const soru of adaylar.slice(0, 3)) {
      const ham = await sayfaAc(`${kok}/search/?q=${encodeURIComponent(soru)}`, { ref: `${kok}/`, ms: 9000, json: true });
      const kartlar = kartlarAyristir(ham);
      if (!kartlar.length) continue;
      base = kok;
      icerikUrl = enIyiKart(kartlar, dizi, adaylar, bilgi?.yil, slug);
      break;
    }
    if (base && icerikUrl) break;
  }
  if (!base || !icerikUrl) return [];
  let adres = icerikUrl.startsWith('http') ? icerikUrl : `${base}${icerikUrl}`;
  const gosterim = adres.replace(/\/sezon-\d+\/bolum-\d+\/?$/i, '/');

  let ham = '';
  if (dizi) {
    /* Deterministik bölüm adresi önce; tutmazsa gösterim sayfasından bağlantı. */
    const aday = `${gosterim.replace(/\/$/, '')}/sezon-${+sezon || 1}/bolum-${+bolum || 1}/`;
    ham = await sayfaAc(aday, { ref: `${base}/`, ms: 10000 });
    if (ham && /data-video|alternative-link|<iframe/i.test(ham)) adres = aday;
    else {
      const gosterimHam = await sayfaAc(gosterim, { ref: `${base}/`, ms: 10000 });
      const yol = new RegExp(`/sezon-${+sezon || 1}/bolum-${+bolum || 1}/`, 'i').test(gosterimHam)
        ? `${gosterim.replace(/\/$/, '')}/sezon-${+sezon || 1}/bolum-${+bolum || 1}/` : '';
      adres = yol || gosterim;
      ham = await sayfaAc(adres, { ref: `${base}/`, ms: 10000 });
    }
  } else {
    ham = await sayfaAc(adres, { ref: `${base}/`, ms: 10000 });
  }
  if (!ham || !/data-video|alternative-link|<iframe/i.test(ham)) return [];

  const oynaticilar = await oynaticiAdaylari(ham, base, adres);
  const sonuc = [];
  const gorulen = new Set();
  for (const iframe of oynaticilar) {
    let oynaticiHam = await sayfaAc(iframe, { ref: adres, ms: 10000 });
    let url = oynaticiHam ? sifreCoz(oynaticiHam) : '';
    if (!url) {
      const rapid = iframe.match(/\/rplayer\/([a-zA-Z0-9]+)/)?.[1];
      if (rapid) {
        const yedek = await sayfaAc(`${base}/rplayer/${rapid}/`, { ref: adres, ms: 10000 });
        url = yedek ? sifreCoz(yedek) : '';
      }
    }
    if (!url || gorulen.has(url)) continue;
    gorulen.add(url);
    let oynaticiKoku = '';
    try { oynaticiKoku = new URL(iframe).origin; } catch (_) { oynaticiKoku = base; }
    sonuc.push({
      name: AD,
      title: `${AD} Sunucu ${sonuc.length + 1}`,
      url,
      quality: '1080p',
      format: 'm3u8',
      headers: { Referer: `${oynaticiKoku}/`, 'User-Agent': 'okhttp/4.9.2', Accept: '*/*' },
    });
    if (sonuc.length >= 3) break;
  }
  return sonuc;
}

if (typeof globalThis !== 'undefined') globalThis.getStreams = getStreams;
export default getStreams;
