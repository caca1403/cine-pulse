/* ==========================================================================
   CinePulse — "Huntress" çekirdeği (birinci taraf) — FilmEkseni ailesi
   --------------------------------------------------------------------------
   Ölçülen zincir (2026-10-29, Node'da uçtan uca doğrulandı):
     • Arama:  GET {site}/api/search?q=<metin>  → { data:[{ id, title, slug,
       contentableType: "App\\Models\\Movie"|"Episode", releaseYear }] }
     • Detay:  GET {site}/<slug>/  → videoPlayerData(JSON.parse('…')) bloğu.
       Blok HTML/JS kaçışlıdır: \u0022 → " , \/ → / . Dil grupları:
       dual | dublaj | subtitle ; her öğe { link, service_slug, service_name,
       quality, template(base64) } .
     • Embed:  template base64'ü çözülür → data-src="//eksenload.top/eplayer/{url}"
       → {url} yerine link konur.
     • Master: embed sayfasında jwplayer(...).setup(JSON.parse('…')) → sources[0].file
     • Kanıt:  master m3u8'de TYPE=AUDIO NAME="Türkçe" → gerçek Türkçe dublaj.
   ========================================================================== */

import { tmdbBilgi, adayBasliklar, sadeles, yilUyar } from '../ortakCekirdek.js';

const AD = 'Huntress';
const SITE = 'https://filmekseni.vip';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

async function oku(url, { ref = SITE + '/', ms = 12000 } = {}) {
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'text/html,application/json,*/*', Referer: ref },
      signal: typeof AbortSignal?.timeout === 'function' ? AbortSignal.timeout(ms) : undefined,
    });
    return r.ok ? await r.text() : '';
  } catch (_) {
    return '';
  }
}

const norm = (s) => sadeles(String(s || '')).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

/* HTML/JS kaçışlı JSON'u gerçek JSON'a çevirir. */
const kacisCoz = (ham) => String(ham || '').replace(/\\u0022/gi, '"').replace(/\\\//g, '/').replace(/\\\\/g, '\\');

/* videoPlayerData bloğunu ayıklar → { dual:[…], dublaj:[…], subtitle:[…] } | null */
function oynaticiVerisi(html) {
  const ham = (String(html).match(/videoPlayerData\(JSON\.parse\('([\s\S]*?)'\)/) || [])[1];
  if (!ham) return null;
  try {
    const veri = JSON.parse(kacisCoz(ham));
    return veri && typeof veri === 'object' ? veri : null;
  } catch (_) {
    return null;
  }
}

/* Embed adresini şablondan üretir: //eksenload.top/eplayer/{url} + link */
function embedAdresi(saglayici) {
  let tmpl = '';
  try {
    const b64 = String(saglayici.template || '').trim();
    if (typeof atob === 'function') {
      tmpl = decodeURIComponent(escape(atob(b64)));
    } else if (typeof Buffer !== 'undefined') {
      tmpl = Buffer.from(b64, 'base64').toString('utf8');
    }
  } catch (_) {
    try { tmpl = typeof atob === 'function' ? atob(String(saglayici.template || '').trim()) : ''; } catch (__) { return ''; }
  }
  const yol = (tmpl.match(/data-src="([^"]+)"/) || tmpl.match(/src="([^"]+)"/) || [])[1] || '';
  if (!yol) return '';
  const tam = yol.replace('{url}', String(saglayici.link || '')).replace(/^\/\//, 'https://');
  return /^https?:/i.test(tam) ? tam : '';
}

/* jwplayer config'inden master adresi. */
function masterAdresi(embedHtml) {
  const jw = (String(embedHtml).match(/jwplayer\([^)]*\)\.setup\(JSON\.parse\('([\s\S]*?)'\)/) || [])[1];
  if (!jw) return '';
  try {
    const cfg = JSON.parse(kacisCoz(jw));
    const dosya = cfg?.sources?.[0]?.file || cfg?.file || '';
    return /^https?:/i.test(String(dosya)) ? String(dosya) : '';
  } catch (_) {
    return '';
  }
}

/* Master m3u8 → dil kanıtı + kalite. Kanıtsız satır listeye GİRMEZ. */
async function kanitla(master, ref) {
  const metin = await oku(master, { ref, ms: 9000 });
  if (!/#EXTM3U/.test(metin)) return null;
  const satirlar = metin.split('\n').filter((s) => /#EXT-X-MEDIA/i.test(s));
  const sesler = satirlar.filter((s) => /TYPE=AUDIO/i.test(s));
  const trSes = sesler.some((s) => /TYPE=AUDIO/i.test(s) && /(?:LANGUAGE="?(?:tr|tur)"?|NAME="[^"]*t[uü]rk)/i.test(s));
  const trAltyazi = satirlar.some((s) => /TYPE=SUBTITLES/i.test(s) && /(?:LANGUAGE="?(?:tr|tur)"?|NAME="[^"]*t[uü]rk)/i.test(s));
  const sesAdlari = sesler.map((s) => (s.match(/NAME="([^"]+)"/) || [])[1]).filter(Boolean);
  const yuk = (metin.match(/RESOLUTION=\d+x(\d+)/g) || []).map((x) => Number((x.match(/x(\d+)/) || [])[1])).filter(Boolean);
  const h = yuk.length ? Math.max(...yuk) : 1080;
  const kalite = h >= 2000 ? '4K' : h >= 1000 ? '1080p' : h >= 700 ? '720p' : h >= 400 ? '480p' : '360p';
  return { trSes, trAltyazi, sesSayisi: sesler.length, sesAdlari, kalite };
}

const SAGLAYICI_ETIKET = { vip: 'VIP', moly: 'Moly', eksen: 'Eksen', rapid: 'Rapid', okru: 'OK.ru' };

const ONBELLEK = new Map();
const ONBELLEK_MS = 15 * 60 * 1000;
const UCAN = new Map();

export async function getStreams(kimlik, tur = 'movie', sezon = 1, bolum = 1) {
  const kim = (kimlik && typeof kimlik === 'object') ? (kimlik.tmdbId || kimlik.id || kimlik.imdbId || '') : kimlik;
  const bilgi = await tmdbBilgi(kim, tur);
  const adaylar = bilgi ? adayBasliklar(bilgi) : [];
  if (!adaylar.length) return [];
  const isTv = tur === 'tv';

  const anahtar = `${isTv ? 'tv' : 'movie'}:${bilgi?.baslik || kim}:${+sezon || 1}:${+bolum || 1}`;
  const hazir = ONBELLEK.get(anahtar);
  if (hazir && Date.now() - hazir.t < ONBELLEK_MS) return hazir.sonuc;
  if (UCAN.has(anahtar)) return UCAN.get(anahtar);

  const is = (async () => {
    /* 1) arama */
    let kayit = null;
    for (const soru of adaylar.slice(0, 2)) {
      const ham = await oku(`${SITE}/api/search?q=${encodeURIComponent(soru)}`);
      if (!ham) continue;
      let j = null;
      try { j = JSON.parse(ham); } catch (_) { continue; }
      const liste = Array.isArray(j?.data) ? j.data : (Array.isArray(j) ? j : []);
      // Film/dizi türü + başlık + yıl kapısı
      kayit = liste.find((x) => {
        const tip = String(x?.contentableType || '');
        const filmMi = /movie/i.test(tip);
        if (isTv ? filmMi : (!filmMi && tip)) return false;
        const b = norm(x?.title || x?.baslik || '');
        const esles = adaylar.some((a) => { const n = norm(a); return n && (b === n || b.includes(n) || n.includes(b)); });
        if (!esles) return false;
        const y = Number(x?.releaseYear || 0);
        if (bilgi?.yil && y && !yilUyar(y, bilgi.yil)) return false;
        return Boolean(x?.slug);
      }) || null;
      if (kayit) break;
    }
    if (!kayit) return [];

    /* 2) detay → oynatıcı verisi */
    const detayUrl = isTv
      ? `${SITE}/${String(kayit.slug).replace(/^\//, '')}${/(-sezon-|-bolum)/.test(String(kayit.slug)) ? '' : `-${+sezon || 1}-sezon-${+bolum || 1}-bolum`}/`
      : `${SITE}/${String(kayit.slug).replace(/^\//, '')}/`;
    const detay = await oku(detayUrl, { ref: `${SITE}/` });
    const veri = oynaticiVerisi(detay);
    if (!veri) return [];

    /* 3) dil grupları: dual (TR dublaj+altyazı) önce */
    const gruplar = ['dual', 'dublaj', 'subtitle'].flatMap((g) => (Array.isArray(veri[g]) ? veri[g].map((s) => ({ ...s, grup: g })) : []));
    const gorulen = new Set();
    const benzersiz = gruplar.filter((s) => {
      const e = embedAdresi(s);
      if (!e || gorulen.has(e)) return false;
      gorulen.add(e);
      return true;
    }).slice(0, 6);

    /* 4) paralel doğrulama */
    const olcumler = await Promise.allSettled(benzersiz.map(async (s) => {
      const embed = embedAdresi(s);
      const embedHtml = await oku(embed, { ref: detayUrl, ms: 11000 });
      const master = masterAdresi(embedHtml);
      if (!master) return null;
      const kanit = await kanitla(master, embed);
      return kanit ? { s, embed, master, kanit } : null;
    }));

    const sonuc = [];
    for (const o of olcumler) {
      if (o.status !== 'fulfilled' || !o.value) continue;
      const { s, embed, master, kanit } = o.value;
      const sagAd = SAGLAYICI_ETIKET[s.service_slug] || String(s.service_name || s.service_slug || 'Kaynak');
      const etiket = kanit.trSes ? 'Türkçe Dublaj' : (kanit.trAltyazi ? 'TR Altyazı' : 'Orijinal');
      sonuc.push({
        name: AD,
        title: `${AD} · ${sagAd} · ${kanit.kalite} · ${etiket}${kanit.sesSayisi > 1 ? ` · ${kanit.sesSayisi} Ses` : ''}`,
        url: master,
        quality: kanit.kalite,
        format: 'm3u8',
        isM3u8: true,
        diller: kanit.trSes ? ['tr'] : (kanit.trAltyazi ? ['altyazi'] : []),
        trSes: kanit.trSes,
        trAltyazi: kanit.trAltyazi,
        dilDurumu: kanit.trSes ? 'dublaj' : (kanit.trAltyazi ? 'altyazi' : 'orijinal'),
        headers: { 'User-Agent': UA, Referer: embed },
        proxyGerekmez: true, // imzalı CDN: köprüden çekilirse 403
      });
    }

    if (sonuc.length) ONBELLEK.set(anahtar, { t: Date.now(), sonuc });
    if (ONBELLEK.size > 200) ONBELLEK.delete(ONBELLEK.keys().next().value);
    return sonuc;
  })();

  UCAN.set(anahtar, is);
  try { return await is; } finally { UCAN.delete(anahtar); }
}

if (typeof globalThis !== 'undefined') {
  globalThis.getStreams = getStreams;
  globalThis.__cpHuntress = getStreams;
}
export default getStreams;
