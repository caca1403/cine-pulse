#!/usr/bin/env node
/* Çekirdek doğrulama tezgâhı: çekirdeği Node'da çalıştırır; çekirdeğin attığı
   göreli /api/<rota>/... isteklerini native-routes.json'daki GERÇEK site
   adreslerine çevirir — cihazdaki yerel vekilin yaptığı işin aynısı.

   Kullanım: node tools/cekirdek-test.mjs <cekirdek-dosyasi> <kimlik> <tur> [sezon] [bolum]
   Örn:      node tools/cekirdek-test.mjs robin.js 1399 tv 1 1                     */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROTALAR = JSON.parse(readFileSync(path.join(KOK, 'android/app/src/main/assets/native-routes.json'), 'utf8'));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const gercekFetch = globalThis.fetch;

/* Cihaz vekili gibi: /api/<kod>/<yol>?<sorgu> → base+<yol>?<sorgu> (+referer/origin).
   /api/proxy?url=… ve mutlak TMDB adresleri doğrudan geçirilir. */
globalThis.fetch = async (adres, secenekler = {}) => {
  let hedef = String(adres);
  const basliklar = { 'User-Agent': UA, ...(secenekler.headers || {}) };
  const es = hedef.match(/^\/api\/([a-zA-Z0-9_-]+)(\/[^?]*)?(\?.*)?$/);
  if (es && es[1] !== 'proxy' && ROTALAR[es[1]]) {
    const konf = ROTALAR[es[1]];
    /* YEDEK ALAN (2026-11-14 ölçümü): tabloda `mirrors` varken test kılıfı
       yalnız `base`i deniyordu. Ölçülen vaka: hfd.base = hdfilmdelisi1.com
       ÖLÜ (DNS/bağlantı yok), mirrors[0] = hdfilmdelisi.one CANLI (api/search
       200 + geçerli JSON). Sonuç: Bellatrix/Spectre gibi çekirdekler testte
       "0 kaynak" görünüyordu, oysa mobil köprü ve web worker yedeği zaten
       uyguluyordu. Artık test kılıfı da üretimle aynı sırayı izler. */
    const adaylar = [konf.base, ...(Array.isArray(konf.mirrors) ? konf.mirrors : [])]
      .filter(u => typeof u === 'string' && /^https?:\/\//i.test(u));
    hedef = (adaylar[0] || konf.base) + (es[2] || '') + (es[3] || '');
    if (konf.referer) basliklar.Referer = konf.referer;
    Object.assign(basliklar, konf.headers || {});
    // Birincil ağ/TLS/5xx ile düşerse sıradaki aday denenir (üretim paritesi).
    if (adaylar.length > 1) {
      for (let i = 0; i < adaylar.length; i += 1) {
        const denemeHedef = adaylar[i] + (es[2] || '') + (es[3] || '');
        try {
          // eslint-disable-next-line no-await-in-loop
          const deneme = await gercekFetch(denemeHedef, { ...secenekler, headers: basliklar, redirect: 'follow' });
          if (deneme.status < 500) return deneme;
          if (i === adaylar.length - 1) return deneme;
        } catch (_) {
          if (i === adaylar.length - 1) throw _;
        }
      }
    }
  }
  const yanit = await gercekFetch(hedef, { ...secenekler, headers: basliklar, redirect: 'follow' });
  return yanit;
};

const [dosya, kimlik, tur = 'movie', sezon = '1', bolum = '1'] = process.argv.slice(2);
if (!dosya || !kimlik) { console.error('kullanım: cekirdek-test.mjs <dosya> <kimlik> <tur> [sez] [bol]'); process.exit(2); }

const mod = await import(path.join(KOK, 'src/providers/cekirdekler', dosya));
/* Vekille aynı sırayı izle: çekirdekler kendini CJS içine gömülü ya da
   globalThis.getStreams olarak kaydediyor; ikisini de tanı. */
const fn =
  mod.getStreams ||
  (typeof mod.default === 'function' ? mod.default : mod.default?.getStreams) ||
  (typeof globalThis.getStreams === 'function' ? globalThis.getStreams : null);
if (typeof fn !== 'function') { console.error('getStreams yok'); process.exit(2); }

const t0 = Date.now();
const sonuc = await fn(kimlik, tur, Number(sezon), Number(bolum));
const liste = Array.isArray(sonuc) ? sonuc : [];
console.log(JSON.stringify({
  cekirdek: dosya, kimlik, tur, sezon, bolum,
  sureMs: Date.now() - t0,
  adet: liste.length,
  ornekler: liste.slice(0, 6).map(x => ({
    ad: x.title || x.name || '', url: String(x.url || '').slice(0, 110),
    kalite: x.quality || '', format: x.format || x.type || '',
    baslikSayisi: x.headers ? Object.keys(x.headers).length : 0,
    altyazi: (x.subtitles || []).length,
  })),
}, null, 1));
process.exit(liste.length ? 0 : 1);
