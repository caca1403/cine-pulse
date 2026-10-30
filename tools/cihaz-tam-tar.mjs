#!/usr/bin/env node
/* ==========================================================================
   cihaz-tam-tar.mjs — TELEFONUNDA 55 çekirdek × (film + dizi) TAM TARAMA
   --------------------------------------------------------------------------
   `window.__cpSag` kancasıyla tüm kayıtları tek tek ölçer ve tablo yazar.
   Çıktı: /tmp/opencode/tam-tar.json + konsol tablo.
   Kullanım:  node tools/cihaz-tam-tar.mjs [--tur tv] [--tmdb 27205] [--butce 20000]
   ========================================================================== */
import { cdpAc } from './cihaz-cdp.mjs';
import fs from 'node:fs';

const arg = (ad, varsayilan) => {
  const i = process.argv.indexOf(ad);
  return i > -1 ? process.argv[i + 1] : varsayilan;
};
const TUR = arg('--tur', 'both');
const TMDB = { movie: arg('--tmdb', '27205'), tv: arg('--tmdb', '1399') }; // Inception / GoT
const BUTCE = +(arg('--butce', '20000'));

const { kayitListesi } = await import(new URL('../src/providers/vekil.js', import.meta.url)).catch(() => ({}));
const { KAYIT } = await import(new URL('../src/providers/kayit.js', import.meta.url));
const kayitlar = [];
for (const tur of TUR === 'both' ? ['movie', 'tv'] : [TUR]) {
  for (const [ad, k] of KAYIT) {
    if (k.turler.includes(tur)) kayitlar.push([ad, tur]);
  }
}
console.log(`tarama: ${kayitlar.length} çekirdek-tür · bütçe ${BUTCE}ms · içerik: Inception(27205)/GoT(1399)`);

const cdp = await cdpAc();
const sonuclar = [];
let ortak = Promise.resolve();
for (const [ad, tur] of kayitlar) {
  ortak = ortak.then(async () => {
    try {
      const r = await cdp.calistir(
        `window.__cpSag(${JSON.stringify(ad)}, { tur: ${JSON.stringify(tur)}, tmdbId: '${TMDB[tur]}', season: 1, episode: 1, butceMs: ${BUTCE} })`,
        { bekle: true }
      );
      sonuclar.push({ ...r, tur });
      console.log(String(r.ad || ad).padEnd(16), tur.padEnd(5), String(r.kaynakSayisi ?? '?').padStart(3), 'kaynak;', `${Math.round(r.sure || 0)}ms`, r.hata ? `HATA: ${String(r.hata).slice(0, 40)}` : '');
    } catch (e) {
      const s = { ad, tur, kaynakSayisi: 0, hata: String(e?.message || e).slice(0, 50) };
      sonuclar.push(s);
      console.log(String(ad).padEnd(16), tur.padEnd(5), '  0', 'kaynak;', 'HATA:', s.hata);
    }
    fs.writeFileSync('/tmp/opencode/tam-tar.json', JSON.stringify(sonuclar, null, 2));
  });
}
await ortak;
cdp.kapat();
const topla = {};
for (const s of sonuclar) topla[s.tur] = (topla[s.tur] || 0) + (s.kaynakSayisi || 0);
const sifir = sonuclar.filter((s) => !(s.kaynakSayisi > 0));
console.log(`\nSON: toplam kaynak ${topla.movie || 0} (film) + ${topla.tv || 0} (dizi); 0-çıkan: ${sifir.length}/${sonuclar.length}`);
console.log('0-çıkanlar:', sifir.map((s) => `${s.ad}/${s.tur}(${s.hata || 'sözsüz'})`).join(', '));
fs.writeFileSync('/tmp/opencode/tam-tar.json', JSON.stringify({ sonuc: sonuclar, ozet: topla, sifirlar: sifir }, null, 2));
