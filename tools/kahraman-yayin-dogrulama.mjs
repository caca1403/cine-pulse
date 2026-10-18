#!/usr/bin/env node
/* ==========================================================================
   tools/kahraman-yayin-dogrulama.mjs — "yayın var" ile "yayın çalışıyor" farkı
   --------------------------------------------------------------------------
   Kaynak taraması yayın listesi döndürdüğünde iş bitmiyor: adres ölü, başka
   bir siteden gelmiş (başlık/çerez isteyen) ya da iframe adresi olabilir.
   Bu araç HER yayın için şunları yapar:
     1) ham adresi, çekirdeğin istediği başlıklarla ve BAŞLIKSIZ dener
     2) yanıtın gerçekten medya olup olmadığına bakar (.m3u8 → #EXTM3U,
        .mp4 → fyp/ftyp imzası, HTML ise çöp)
     3) HLS ise ilk varyantı ve ilk segmenti indirir (segment ölüyse oynatıcı
        "açılıyor ama oynamıyor" der — cihazda ölçülen asıl şikâyet buydu)
   Kullanım:
     node tools/kahraman-yayin-dogrulama.mjs --tur tv --tmdb 1399 --imdb tt0944947
     node tools/kahraman-yayin-dogrulama.mjs --tur movie --tmdb 27205 --imdb tt1375616
   Çıktı: kaynak başına OK / BOZUK + sebep. Kod 0 döner (rapor aracıdır).
   ========================================================================== */

const arg = (ad, varsayilan) => {
  const i = process.argv.indexOf(ad);
  return i > -1 ? process.argv[i + 1] : varsayilan;
};
const TUR = arg('--tur', 'tv');
const TMDB = arg('--tmdb', '1399');
const IMDB = arg('--imdb', '');
const SEZON = Number(arg('--sezon', 1));
const BOLUM = Number(arg('--bolum', 1));
const TEK = arg('--kod', null);

const { kaynakTara, kaynakCoz, kayitlar } = await import('../src/providers/vekil.js');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

function imzaBul(metin, adres) {
  const başı = metin.slice(0, 2048);
  if (/^#EXTM3U/m.test(başı.trim()) || metin.includes('#EXTM3U')) return 'hls';
  if (/ftyp/.test(başı.slice(0, 64))) return 'mp4';
  if (/^\x1aE\xdf\xa7/.test(başı)) return 'mkv';
  if (/<html|<!doctype/i.test(başı)) return 'html';
  if (/\.m3u8(\?|#|$)/i.test(adres)) return 'hls-basliksiz';
  return metin.length > 4096 ? 'ikili' : 'bilinmeyen';
}

async function dene(adres, başlıklar, ms = 12000) {
  try {
    // DERS (2016-10-16 ölçüldü): imzalı HLS uçları (dizisol, streamcorecdn,
    // zenoak) Range başlığı görince 500/timeout veriyor. Oynatıcı da ilk
    // istekte Range göndermez; burada asla Range GONDERILMEZ.
    const yanıt = await fetch(adres, {
      headers: { ...başlıklar },
      redirect: 'follow',
      signal: AbortSignal.timeout(ms),
    });
    const tam = await yanıt.arrayBuffer();
    const metin = Buffer.from(tam).toString('latin1');
    return { durum: yanıt.status, boy: tam.byteLength, imza: imzaBul(metin, adres), gövde: metin };
  } catch (hata) {
    return { durum: 'HATA', boy: 0, imza: 'ulasilamadi', not: String(hata?.message || hata).slice(0, 45) };
  }
}

/** HLS master ise ilk varyantı, media playlist ise ilk segmenti çeker. */
async function hlsDerin(adres, başlıklar, anaGövde) {
  const satırlar = anaGövde.split('\n').map(s => s.trim()).filter(Boolean);
  const çocuk = satırlar.find(s => !s.startsWith('#') && /\.(m3u8|m4s|ts)(\?|$)/i.test(s));
  const segment = satırlar.find(s => !s.startsWith('#'));
  const hedef = çocuk || segment;
  if (!hedef) return { ok: false, sebep: 'playlist boş' };
  let tam = hedef;
  try { tam = new URL(hedef, adres).toString(); } catch (_) { /* göreli kalsın */ }
  const r = await dene(tam, başlıklar, 14000);
  const iyi = (r.durum === 200 || r.durum === 206) && r.boy > 800 && r.imza !== 'html';
  return iyi
    ? { ok: true, not: `${çocuk ? 'varyant' : 'segment'} ${r.boy}b` }
    : { ok: false, sebep: `${çocuk ? 'varyant' : 'segment'} ${r.durum} ${r.imza} ${r.boy}b${r.not ? ' ' + r.not : ''}` };
}

async function yayınDoğrula(yayın) {
  const adres = yayın.hamAdres || yayın.streamUrl || yayın.url;
  const başlıklar = yayın.headers && Object.keys(yayın.headers).length ? yayın.headers : {};
  const başlıklı = await dene(adres, başlıklar);
  let kullanılan = { başlıklar: Object.keys(başlıklar).length ? 'çekirdek' : 'yok', ...başlıklı };
  // Başlıksız da çalışıyorsa daha iyidir: köprü sarmalama gerekmez.
  if (Object.keys(başlıklar).length && (başlıklı.durum === 200 || başlıklı.durum === 206)) {
    const çıplak = await dene(adres, {});
    if (çıplak.durum === 200 || çıplak.durum === 206) {
      kullanılan = { başlıklar: 'çıplak da çalışıyor', ...çıplak };
    }
  }
  // Eşik imzaya göre: HLS master playlist 600 bayt olabilir (meşru), ikili
  // dosya ise gerçekten içerik taşımalı. Ölçüldü: streamcorecdn master = 622b.
  const imzaİyi = ['hls', 'mp4', 'mkv', 'ikili', 'hls-basliksiz'].includes(kullanılan.imza);
  const boyİyi = (kullanılan.imza === 'hls' || kullanılan.imza === 'hls-basliksiz')
    ? kullanılan.boy > 120
    : kullanılan.boy > 900;
  const oynatılır = (kullanılan.durum === 200 || kullanılan.durum === 206) && imzaİyi && boyİyi;
  if (!oynatılır) {
    const sebep = kullanılan.durum === 403 ? '403 yasak'
      : kullanılan.durum === 404 ? '404 yok'
        : kullanılan.durum === 429 ? '429 kota'
          : kullanılan.imza === 'html' ? 'medya değil (HTML)'
            : kullanılan.imza === 'ulasilamadi' ? `erişilemiyor (${kullanılan.not})`
              : `${kullanılan.durum} ${kullanılan.imza} ${kullanılan.boy}b`;
    return { ok: false, sebep, adres };
  }
  if (kullanılan.imza === 'hls' || kullanılan.imza === 'hls-basliksiz') {
    const derin = await hlsDerin(adres, başlıklar, kullanılan.gövde);
    if (!derin.ok) return { ok: false, sebep: `playlist içi bozuk: ${derin.sebep}`, adres };
    return { ok: true, not: derin.not, adres };
  }
  return { ok: true, not: `${kullanılan.imza} ${kullanılan.boy}b`, adres };
}

/* ── taramayı koş ─────────────────────────────────────────────────────── */
let harita;
if (TEK) {
  const r = await kaynakCoz({ id: TEK, tur: TUR, tmdbId: TMDB, imdbId: IMDB, season: SEZON, episode: BOLUM, butceMs: 30000 });
  harita = new Map([[TEK, r]]);
} else {
  harita = (await kaynakTara({
    tur: TUR, tmdbId: TMDB, imdbId: IMDB, season: SEZON, episode: BOLUM,
    butceMs: 90000, izleyici: () => {},
  })).sonuc;
}

const satırlar = [];
for (const [kod, sonuc] of harita) {
  const yayınlar = sonuc?.kaynaklar || [];
  if (!yayınlar.length) continue;
  for (const y of yayınlar) {
    // aynı adrese iki kalite etiketiyle denk gelince tek deneme yeter
    const r = await yayınDoğrula(y);
    satırlar.push({
      kod, kalite: y.kalite || y.quality || '-', ok: r.ok,
      sebep: r.ok ? (r.not || 'oynatılır') : r.sebep,
      başlık: Object.keys(y.headers || {}).length ? 'var' : 'yok',
      sarma: y.koprulendi ? 'proxy' : 'düz',
      adres: String(r.adres).slice(0, 58),
    });
  }
}

console.log(`\n=== ${TUR} · tmdb ${TMDB} · S${SEZON}E${BOLUM} — yayın DOGRULAMA ===`);
const grup = new Map();
for (const s of satırlar) (grup.get(s.kod) || grup.set(s.kod, []).get(s.kod)).push(s);
let okToplam = 0, bozukToplam = 0;
for (const [kod, liste] of [...grup.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const oklar = liste.filter(s => s.ok);
  okToplam += oklar.length; bozukToplam += liste.length - oklar.length;
  console.log(`\n${oklar.length === liste.length ? 'OK  ' : 'KISM'} ${kod.padEnd(16)} ${oklar.length}/${liste.length}`);
  for (const s of liste) {
    if (!s.ok || process.env['AYRINTI']) {
      console.log(`     ${s.ok ? 'iyi' : 'BOZUK'} ${String(s.kalite).padEnd(6)} baslik:${s.başlık} ${s.sarma.padEnd(5)} ${s.sebep}  ${s.adres}`);
    }
  }
}
console.log(`\nOZET: ${okToplam} oynatilabilir · ${bozukToplam} bozuk (toplam ${satırlar.length} yayin)`);
process.exit(0);
