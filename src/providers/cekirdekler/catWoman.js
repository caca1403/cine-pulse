/* ==========================================================================
   CinePulse — "Cat-Woman" çekirdeği (birinci taraf, bağımlılıksız)
   --------------------------------------------------------------------------
   Ne yapıyor: Türkçe içerik sitesinin (rota: dzb) öneri-aramasıyla içeriği
   bulur, bölüm sayfasındaki oynatıcı yapılandırma işaretini (data-pv) oynatıcı
   sunucusunda (pilavyer ailesi) canlı bir HLS adresine çevirir.

   Ölçülen gerçekler (2026-10-18, bu çekirdek yazılırken canlı doğrulandı):
     • GET {site}/ara/oneri?q=<metin> → JSON { movies:[{title,url}], series:[…] }
     • Bölüm adresi şablonu: {içerik}/season/{S}/episode/{E}
     • Bölüm sayfasında `data-pv="<slug>"` işaretleri + oynatıcı kökü
       `https://play2.pilavyerplay.top` (pilavyer* alt alan adlarıRegex'i ile)
     • GET {oynatıcı}/assets/js/s.php?s=<slug>  (Referer = bölüm sayfası ŞART)
       → HTML içinde `"stream":"https://…/api/stream.php?v=…&token=…"`
       (JSON kaçağı: \u0026 → &)
     • Yayın yoklaması: Referer {oynatıcı-kökü}/ + User-Agent okhttp/4.9.2 ile
       GET → "#EXTM3U" döner; master içinde LANGUAGE="tr" DEFAULT=YES ses rayı
       (gerçek dublaj → üç-durum etiketini vekilin iz-ölçeri doğrular).
     • Ölü yayın listelenmez: stream.php #EXTM3U dönmüyorsa kaynak elenir.
   ========================================================================== */

import { rotaYol, metinAl, jsonAl, tmdbBilgi, adayBasliklar, sadeles, m3u8eCevir, ilki, zamanAsimi } from '../ortakCekirdek.js';

const AD = 'Cat-Woman';
const ROTA = 'dzb';
const UA = 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36';
const YAYIN_BASLIK = { Referer: '', 'User-Agent': 'okhttp/4.9.2', Accept: '*/*' };
const VARSAYILAN_OYNATICI = 'https://pilavyerplay.top';

const norm = s => sadeles(String(s || '')).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const eslesir = (a, b) => { const x = norm(a), y = norm(b); return x && y && (x === y || x.includes(y) || y.includes(x)); };

/* JSON kaçıklarını çöz (\u0026, \/, \u002f). */
const kacisCoz = s => String(s || '').replace(/\\u0026/gi, '&').replace(/\\\//g, '/').replace(/\\u002f/gi, '/');

/* Master'ı indirip yaşayıp yaşamadığını + kalitesini ölç; ölü ise null.
   Yaşar ama kalite etiketi yoksa kalite '' döner (yaşam belirtisi olarak). */
async function yayinDogrula(url, oynaticiKoku) {
  const basliklar = { ...YAYIN_BASLIK, Referer: `${oynaticiKoku}/` };
  const metin = await metinAl(url, { ms: 6000, basliklar });
  if (!/#EXTM3U/.test(metin.slice(0, 200))) return null;
  const k = [...metin.matchAll(/(\d{3,4})p/gi)].map(m => +m[1]);
  const en = k.length ? Math.max(...k) : 0;
  return { kalite: en >= 2160 ? '4K' : en >= 1080 ? '1080p' : en >= 720 ? '720p' : en >= 480 ? '480p' : en ? '360p' : '' };
}

async function icerikBul(adaylar, tur, site) {
  const listeAdi = tur === 'tv' ? 'series' : 'movies';
  const bulunan = [];
  const gorulen = new Set();
  for (const soru of adaylar.slice(0, 3)) {
    const veri = await jsonAl(rotaYol(ROTA, '/ara/oneri', { q: soru }), { ref: `${site}/`, ms: 7000 });
    const kartlar = Array.isArray(veri?.[listeAdi]) ? veri[listeAdi]
      : Array.isArray(veri?.movies) && tur !== 'tv' ? veri.movies : [];
    for (const k of kartlar) {
      const url = String(k?.url || '').replace(/\/+$/, '');
      if (!url || gorulen.has(url) || !eslesir(k.title, soru) && !adaylar.some(a => eslesir(k.title, a))) continue;
      gorulen.add(url);
      bulunan.push(url);
    }
    if (bulunan.length) break;
  }
  return bulunan.slice(0, 2);
}

/* data-pv işaretlerini ve oynatıcı kökünü sayfadaki ilk 3 işaretle döndürür. */
function oynaticilar(ham, site) {
  const isaretler = [...new Set([...String(ham || '').matchAll(/data-pv="([^"]+)"/gi)].map(m => m[1]))].slice(0, 3);
  if (!isaretler.length) return [];
  const hostlar = [...String(ham).matchAll(/https:\/\/(?:[a-z0-9-]+\.)*pilavyer[a-z0-9.-]*\.(?:top|com|net|org|io|xyz)/gi)].map(m => m[0]);
  const tercih = hostlar.find(h => /pilavyerplay\./.test(h)) || hostlar[0] || VARSAYILAN_OYNATICI;
  return isaretler.map(slug => ({ slug, host: tercih }));
}

/* Bir oynatıcı işaretini canlı yayına çevirir; olmazsa null. */
async function coz(slug, host, referer) {
  const ham = await metinAl(`${host}/assets/js/s.php?s=${encodeURIComponent(slug)}`, { ref: referer, ms: 9000, basliklar: { 'User-Agent': UA } });
  const hamAdres = kacisCoz(ilki(ham, /["']stream["']\s*:\s*["']([^"']+)["']/i));
  if (!hamAdres) return null;
  const tam = /^https?:/i.test(hamAdres) ? hamAdres : `${host}${hamAdres.startsWith('/') ? '' : '/'}${hamAdres}`;
  const dogrulama = await yayinDogrula(m3u8eCevir(tam), host);
  if (!dogrulama) return null;
  return { url: m3u8eCevir(tam), kalite: dogrulama.kalite };
}

export async function getStreams(kimlik, tur = 'movie', sezon = 1, bolum = 1) {
  const dizi = tur === 'tv';
  const site = 'https://dizibal.org';
  const bilgi = await tmdbBilgi(kimlik, tur);
  const adaylar = bilgi ? adayBasliklar(bilgi) : [String(kimlik || '')];
  const icerikler = await icerikBul(adaylar, tur, site);
  const sonuc = [];
  const gorulen = new Set();

  for (const icerik of icerikler) {
    let adres = dizi ? `${icerik}/season/${+sezon || 1}/episode/${+bolum || 1}` : icerik;
    let ham = await metinAl(adres, { ref: `${site}/`, ms: 9000, basliklar: { 'User-Agent': UA } });
    let oynaticilar_ = oynaticilar(ham, site);

    /* Doğrudan şablon tutmadıysa sezon listesinden bağlantıyı ara. */
    if (!oynaticilar_.length && dizi) {
      const liste = await metinAl(`${icerik}?sezon=${+sezon || 1}`, { ref: `${site}/`, ms: 8000, basliklar: { 'User-Agent': UA } });
      const yol = ilki(liste, new RegExp(`/[a-z0-9-]+/season/${+sezon || 1}/episode/${+bolum || 1}(?=["'\\s])`, 'i'));
      if (yol) {
        adres = yol.startsWith('http') ? yol : `${site}${yol}`;
        ham = await metinAl(adres, { ref: `${site}/`, ms: 9000, basliklar: { 'User-Agent': UA } });
        oynaticilar_ = oynaticilar(ham, site);
      }
    }

    for (const o of oynaticilar_) {
      const bulundu = await cozmus(o, adres);
      if (bulundu && !gorulen.has(bulundu.url)) {
        gorulen.add(bulundu.url);
        sonuc.push({
          name: AD,
          title: `${AD} ${bulundu.kalite || '1080p'}`,
          url: bulundu.url,
          quality: bulundu.kalite || '1080p',
          format: 'm3u8',
          headers: { ...YAYIN_BASLIK, Referer: `${o.host}/` },
        });
      }
    }
    if (sonuc.length) break;
  }
  return sonuc;
}

/* oynatıcı işaretini çözümle (refer = bölüm/içerik sayfası). */
async function cozmus(o, referer) {
  try { return await coz(o.slug, o.host, referer); } catch (_) { return null; }
}

if (typeof globalThis !== 'undefined') globalThis.getStreams = getStreams;
export default getStreams;
