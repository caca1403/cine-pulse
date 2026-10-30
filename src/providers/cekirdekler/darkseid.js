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

const norm = s => sadeles(entitySoy(String(s || ''))).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

/* HTML varlıkları (arama kartı başlığı "D&ouml;v&uuml;\u015f Kul&uuml;b&uuml;" geliyor). */
function entitySoy(s) {
  return String(s || '')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&(ccedil|ouml|uuml|scedil|gbreve|Ouml|Uuml|Ccedil|Scedil|Gbreve|amp|quot|nbsp|#0?39|apos);?/g, (_, e) => ({
      ccedil: 'ç', ouml: 'ö', uuml: 'ü', scedil: 'ş', gbreve: 'ğ',
      Ouml: 'Ö', Uuml: 'Ü', Ccedil: 'Ç', Scedil: 'Ş', Gbreve: 'Ğ',
      amp: '&', quot: '"', nbsp: ' ', '#039': "'", '#39': "'", apos: "'",
    })[e] || '');
}

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
  /* onarim:ds-tekrar — ölçüm 2026-10-28: aynı sayfa isteği ara ara 403 (CF) dönüyor,
     hemen ardından gelen istek 200; tek deneme tüm çekirdeği 0'a düşürüyordu. */
  const govdeAl = () => metinAl(adres, {
    ref: ref || undefined, ms,
    basliklar: {
      'User-Agent': UA,
      'X-Requested-With': json ? 'fetch' : 'XMLHttpRequest',
      Accept: json ? 'application/json, text/plain, */*' : 'text/html,application/xhtml+xml,*/*',
    },
  });
  let govde = await govdeAl();
  if (engelMi(govde)) {
    await new Promise(r => setTimeout(r, 1200));
    const ikinci = await govdeAl();
    if (!engelMi(ikinci)) govde = ikinci;
  }
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
  /* onarim:ds-kart — kart başlığı varlık kaçıklı geliyordu (norm boşa düşüyordu) ve
     tek slug "Fight Club" iken site "1-dovus-kulubu-izle-6" kullanıyor → 0 puan.
     Ölçüm 2026-10-28: tüm aday başlıklarının slug'ı denenir. */
  const sluglar = [...new Set([slug, ...adaylar.map(a => a.replace(/ +/g, '-'))])].filter(Boolean);
  const puanla = k => {
    let p = 0;
    const yol = String(k.url || '');
    const baslik = norm(String(k.baslik || '').split(/[-–—]/)[0]);
    if (sluglar.some(s => yol.includes(s))) p += 3;
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
  /* onarim:ds-dugme — ölçüm 2026-10-28: /video/{id}/ düz HTTP'de her zaman CF 403;
     sayfada iframe zaten varsa düğme uçlarını hiç çağırma (2 boşa istek). */
  if (adaylar.length) return adaylar.slice(0, 3);
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

/* Gömülü oynatıcıdaki özel şifre (vnb74): sifreCoz bilmiyor, URL base64+XOR
   karışımından çıkıyor. Ölçüm 2026-10-28 (hdfilmcehennemi.mobi embed):
   var smx9 = vnb74("...".split("~")); sources:[{file:smx9}]. */
function vnbCoz(html, host) {
  /* Buffer yok (uygulama WebView'da çalışır) → atob tabanlı base64. */
  const b64 = s => { try { return atob(String(s)); } catch (_) { return ''; } };
  try {
  /* Değişken adları her yanıtta değişiyor → adı sources'tan al. */
  const ad = String(html || '').match(/sources:\s*\[\{\s*file:\s*([a-zA-Z0-9_$]+)/)?.[1] || '';
  const m = (ad && new RegExp('var\\s+' + ad + '\\s*=\\s*[a-zA-Z0-9_$]+\\s*\\(\\s*"([\\s\\S]*?)"\\.split\\(\\s*"([^"]+)"\\s*\\)\\s*\\)').exec(String(html)))
    || /var\s+[a-zA-Z0-9_$]+\s*=\s*[a-zA-Z0-9_$]+\s*\(\s*"([\s\S]{200,}?)"\.split\(\s*"([^"]+)"\s*\)\s*\)/.exec(String(html));
  if (!m) return '';
  /* tohum sitenin hostname'i: sayfa kendi alan adını karışıma katıyor. */
  const t91 = m[1].split(m[2]);
  const n0 = t91.length - 2, xs32 = n0 % 7, fh2 = 8 + (n0 % 5);
  const g = t91.splice(fh2, 1)[0], zr = t91.splice(xs32, 1)[0] + host;
  let q = t91.join('');
  if (zr.length > 4096) q = b64(q);
  let h4e = 0, c8k = 0;
  for (let i = 0; i < zr.length; i++) {
    const c = zr.charCodeAt(i);
    h4e = (h4e * 37 + c) % 241;
    c8k = (c8k + ((c << 1) ^ i)) & 255;
  }
  const jb = (h4e * 3 + c8k) % 256, wx = (c8k % 11) + 5;
  let l4 = ((c8k * 251 + h4e) % 65519) + 1;
  for (let i = g.length - 1; i >= 0; i--) {
    const ch = g.charAt(i);
    if (ch === '7') q = b64(q);
    else if (ch === '3') q = q.split('').reverse().join('');
    else {
      const k = (26 - ((ch.charCodeAt(0) - 96) % 26)) % 26;
      q = q.replace(/[a-zA-Z]/g, y => {
        const c = y.charCodeAt(0), b = c <= 90 ? 65 : 97;
        return String.fromCharCode((c - b + k) % 26 + b);
      });
    }
  }
  if (g.length > 2048) q = q.split('').reverse().join('');
  const n = q.length, sira = [];
  for (let i = n - 1; i >= 1; i--) { l4 = (l4 * 97 + 41) % 65519; sira[i] = l4 % (i + 1); }
  const dizi = q.split('');
  for (let i = 1; i < n; i++) { const j = sira[i], t = dizi[i]; dizi[i] = dizi[j]; dizi[j] = t; }
  q = dizi.join('');
  let el = jb, cikti = '';
  for (let i = 0; i < q.length; i++) {
    const c = q.charCodeAt(i);
    el = (el * 5 + wx) % 256;
    cikti += String.fromCharCode(c ^ el);
    el = (el + c) % 256;
  }
  return /^https?:\/\//.test(cikti) ? cikti : '';
  } catch (_) { return ''; }
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
    let url = '';
    let host = '';
    try { host = new URL(iframe).hostname; } catch (_) {}
    /* onarim:ds-varyant — ölçüm 2026-10-28: embed her istekte farklı paket varyantı
       dönüyor; bazı varyantlarda URL çıkmıyor. İki deneme (sayfaAc kendi 403
       tekrarını yapıyor) tek varyanta takılıp 0'a düşmesin. */
    for (let d = 0; d < 2 && !url; d++) {
      const oynaticiHam = await sayfaAc(iframe, { ref: adres, ms: 10000 });
      url = oynaticiHam ? sifreCoz(oynaticiHam) : '';
      /* onarim:ds-vnb — .mobi embed'i kendi şifresini (vnb74) kullanıyor; sifreCoz
         burada çöp döndürüyor. Tohum hostname = embed'in alan adı. */
      if (!url && oynaticiHam) url = vnbCoz(oynaticiHam, host);
      if (!url && d === 0) await new Promise(r => setTimeout(r, 900));
    }
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
    /* dublaj-kanıtı (2026-10-30 kazıması): ölçüm — hdfc master'ları çift sesli
       olabiliyor: `#EXT-X-MEDIA:TYPE=AUDIO,...,NAME="Turkish",DEFAULT=YES` +
       "Original Audio" (Inception: `...-bluray-trdualmp4-.../master.txt`, Node'da
       doğrulandı). Çekirdek eskiden bu satırları HİÇ okumadan etiketsiz yayınlıyor;
       rozet YALNIZ kanıt satırıyla konur, yoksa davranış birebir eski. */
    let dilEtiketi = '';
    let trSes = false;
    let dilDurumu;
    try {
      const pl = await sayfaAc(url, { ref: `${oynaticiKoku}/`, ms: 8000 });
      if (pl && /#EXTM3U/.test(pl)) {
        const sesler = String(pl).match(/#EXT-X-MEDIA:[^\n]*TYPE=AUDIO[^\n]*/gi) || [];
        const trSatir = sesler.find((s) => /LANGUAGE="?(?:tr|tur)"?/i.test(s) || /NAME="[^"]*(?:turk|dublaj)[^"]*"/i.test(s));
        if (trSatir) { trSes = true; dilEtiketi = ' · Türkçe Dublaj'; dilDurumu = 'dublaj'; }
        else if (sesler.length) dilDurumu = 'orijinal'; // dil listesi okundu, tr yok
      }
    } catch (_) {}
    sonuc.push({
      name: AD,
      title: `${AD} Sunucu ${sonuc.length + 1}${dilEtiketi}`,
      url,
      quality: '1080p',
      format: 'm3u8',
      diller: trSes ? ['tr'] : [],
      trSes,
      ...(dilDurumu ? { dilDurumu } : {}),
      headers: { Referer: `${oynaticiKoku}/`, 'User-Agent': 'okhttp/4.9.2', Accept: '*/*' },
    });
    if (sonuc.length >= 3) break;
  }
  return sonuc;
}

if (typeof globalThis !== 'undefined') globalThis.getStreams = getStreams;
export default getStreams;
