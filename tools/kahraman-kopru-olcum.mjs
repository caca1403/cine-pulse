#!/usr/bin/env node
/* ==========================================================================
   CinePulse Studio — kahraman ölçüm aracı (köprüden geçerek)
   --------------------------------------------------------------------------
   NEDEN VAR: cihazda "31 sağlayıcı boş dönüyor" sorunu köprü yüzünden
   Node'da yeniden üretilemiyordu (Node köprüsüz koşuyor, CORS yok). Bu araç
   AYNI yolu kurar: kaynakCoz → kopruFetch → /api/proxy?url=… → burada çözülen
   GERÇEK istek. Böylece çekirdeğin kendi günlüğü terminalde görünür ve
   telefonu bekmeden teşhis edilir.

   Kullanım:
     node tools/kahraman-kopru-olcum.mjs --kod Batman --tur movie --tmdb 27205
     node tools/kahraman-kopru-olcum.mjs --tur movie --tmdb 27205        # tümü
     ... --gunluk      # çekirdek günlüklerini de bas
   Yalnız kahraman kodları yazdırılır.
   ========================================================================== */
import { KAYIT } from '../src/providers/kayit.js';
import { kaynakTara } from '../src/providers/vekil.js';

const arg = (a, v) => {
  const i = process.argv.indexOf(a);
  return i > -1 ? process.argv[i + 1] : v;
};
const TUR = arg('--tur', 'movie');
const TMDB = arg('--tmdb', '27205');
const TEK = arg('--kod', null);
const IMDB = arg('--imdb', '');
const GUNLUK = process.argv.includes('--gunluk');

/* ── köprü taklidi: /api/proxy?url=X → X'i gerçekten çek ───────────────── */
const GERCEK = globalThis.fetch.bind(globalThis);
let istekSayisi = 0;
const gorulenAdresler = new Map();

globalThis.fetch = async (girdi, secenekler = {}) => {
  let url = String((girdi && girdi.url) || girdi);
  const u = new URL(url, 'http://127.0.0.1:4000');
  if (/\/api\/proxy$/.test(u.pathname) && u.searchParams.get('url')) {
    const hedef = u.searchParams.get('url');
    const başlıklar = { ...(secenekler.headers || {}) };
    if (u.searchParams.get('ref')) başlıklar.Referer = u.searchParams.get('ref');
    // Sunucu proxy'sinin kuralı: x-proxy-cookie → Cookie (çekirdek kurabiyesi)
    if (başlıklar['x-proxy-cookie']) { başlıklar.Cookie = başlıklar['x-proxy-cookie']; delete başlıklar['x-proxy-cookie']; }
    // Sunucu/ağ geçidinin yeni kuralı (2026-10-16): çekirdeğin özel başlıkları
    // (Cf-Control/language/site/device/Cookie…) `headers` JSON parametresiyle
    // taşınır ve hedefe GERÇEK başlık olarak yazılır. Araç bunu uygulamazsa
    // ölçüm gerçeği yansıtmaz (anizium/Nightwing jeton olmadan 401 alır).
    const ekHam = u.searchParams.get('headers');
    if (ekHam) {
      try {
        const ek = JSON.parse(ekHam);
        const yasak = new Set(['host', 'content-length', 'connection', 'accept-encoding']);
        for (const [ad, deger] of Object.entries(ek || {})) {
          if (!ad || typeof deger !== 'string' || yasak.has(ad.toLowerCase())) continue;
          başlıklar[ad] = deger;
        }
      } catch (_) {}
    }
    istekSayisi++;
    const anahtar = new URL(hedef).host;
    gorulenAdresler.set(anahtar, (gorulenAdresler.get(anahtar) || 0) + 1);
    try {
      // Sunucunun dayanıklı fetch'i gibi: geçici ECONNRESET'te yeniden dene.
      let sonHata;
      for (let d = 0; d < 3; d++) {
        try { return await GERCEK(hedef, { ...secenekler, headers: başlıklar, redirect: 'follow' }); }
        catch (e) {
          sonHata = e;
          const kod = e?.cause?.code || '';
          if (!['ECONNRESET', 'ECONNREFUSED', 'EAI_AGAIN', 'ETIMEDOUT', 'EPIPE', 'UND_ERR_SOCKET'].includes(kod) && !/fetch failed/i.test(e.message)) throw e;
          await new Promise((r) => setTimeout(r, 120 * (d + 1)));
        }
      }
      throw sonHata;
    } catch (e) {
      return new Response('baglanti-hatasi: ' + e.message, { status: 599 });
    }
  }
  return GERCEK(url, secenekler);
};

/* ── günlüğün kahraman satırlarını yakala ──────────────────────────────── */
const birikim = [];
const hamLog = console.log.bind(console);
if (GUNLUK) console.log = (...a) => { birikim.push(a.map(x => String(x)).join(' ')); };
else console.log = (...a) => { birikim.push(a.map(x => String(x)).join(' ')); };

const hedefler = TEK ? [[TEK, KAYIT.get(TEK)]] : null;
if (TEK && !KAYIT.get(TEK)) {
  hamLog(`bilinmeyen kod: ${TEK}`);
  hamLog('bilinenler:', [...KAYIT.keys()].join(', '));
  process.exit(1);
}

const t0 = Date.now();
const tara = await kaynakTara({
  tur: TUR,
  tmdbId: TMDB,
  imdbId: IMDB,
  season: 1,
  episode: 1,
  butceMs: hedefler ? 40_000 : undefined
});
if (GUNLUK) console.log = hamLog;

let liste = [...tara.sonuc.entries()].map(([kod, is]) => ({
  kod,
  n: is.kaynaklar.length,
  sure: is.sure,
  hata: is.hata || '',
  iz: (is.iz || []).map(k => k.ad || k).join('>')
}));
if (hedefler) liste = liste.filter(k => k.kod === TEK);

const yayin = liste.filter(k => k.n > 0);
hamLog(`\n=== ${TUR} · tmdb ${TMDB}${IMDB ? ' · ' + IMDB : ''} · ${liste.length}/${tara.toplam} kayit · ${((Date.now() - t0) / 1000).toFixed(1)} sn ===`);
hamLog(`YAYIN VEREN ${yayin.length}: ${yayin.map(k => `${k.kod}(${k.n})`).join(', ') || '-'}`);
const bos = liste.filter(k => k.n === 0);
hamLog(`\nBOS ${bos.length}:`);
for (const k of bos) hamLog(`  ${k.kod.padEnd(16)} ${String(k.sure).padStart(6)} ms  ${k.hata.padEnd(18)} ${k.iz}`);
/* Bos donen her kahramanin SON gunluk satiri = siniflandirma kaniti */
const sebepler = [];
for (const k of bos) {
  const satirlar = birikim.filter(x => x.includes(`[${k.kod}]`) || x.includes(`${k.kod}]`));
  const son = satirlar.length ? satirlar.at(-1).replace(/^\[[^\]]+\]\s*/, '').slice(0, 74) : '(gunluk satiri yok)';
  sebepler.push({ kod: k.kod, sure: k.sure, sebep: son });
}
if (sebepler.length) {
  hamLog('\nBOSE DONENLERIN SEBEPI (cekirdek gunlugunden):');
  for (const x of sebepler) hamLog(`  ${x.kod.padEnd(16)} ${String(x.sure).padStart(6)} ms  ${x.sebep}`);
}
if (hedefler && GUNLUK && birikim.length) {
  hamLog('\nCEKIRDEK GUNLUGU:');
  for (const s of birikim) hamLog('  ' + s.slice(0, 170));
}
hamLog(`\nag istegi: ${istekSayisi} · gorulen host'lar: ${[...gorulenAdresler.entries()].map(([h, n]) => `${h}×${n}`).slice(0, 14).join(', ')}`);
process.exit(0);
