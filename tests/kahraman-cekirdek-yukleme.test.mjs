/* Çekirdek yükleme yaşam döngüsü testleri.
   Asıl regresyon: çekirdekler kendini globalThis.getStreams ile kaydediyor ve
   ES modülleri BİR KEZ çalışır. Global geri alınıp ikinci kez import edilirse
   gövde yeniden çalışmaz → getStreams bir daha dolmaz → "cekirdek-yok" → tüm
   kaynaklar sıfıra düşer. Taze test süreçlerinde görünmez, uzun ömürlü
   uygulamada görünür. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { kayitKancasi, cekirdekAl, cekirdekYardimcisi, yuklemeOzeti } from '../src/providers/vekil.js';

/** ES modülü taklidi: gövde yalnız ilk importta çalışır. */
function sahteModul(kayitAdi, etiket) {
  const durüm = { govdeSayisi: 0 };
  const yukle = async () => {
    if (durüm.govdeSayisi === 0) {
      durüm.govdeSayisi++;
      globalThis.getStreams = async () => [{ etiket }];
      if (etiket === 'altyazili') globalThis.getSubtitles = async () => [];
    }
  };
  return { durüm, kayit: { onek: `sp_${kayitAdi.toLowerCase()}_`, dosya: `${kayitAdi}.js`, yukle, turler: ['movie', 'tv'], durum: 'bilinmiyor' } };
}

test('aynı çekirdek ikinci kez de çözümlenir (modül önbelleği tuzağı)', async () => {
  const { durüm, kayit } = sahteModul('Test-Kahraman', 'birinci');
  kayitKancasi(new Map([['Test-Kahraman', kayit]]));
  try {
    const ilk = await cekirdekAl('Test-Kahraman');
    assert.equal(typeof ilk, 'function', 'ilk yükleme çözümlenmeli');

    const ikinci = await cekirdekAl('Test-Kahraman');
    assert.equal(typeof ikinci, 'function', 'İKİNCİ yükleme de çözümlenmeli (regresyon)');

    const ucuncu = await cekirdekAl('Test-Kahraman');
    assert.equal(typeof ucuncu, 'function', 'ardışık çağrılar kaydı yitirmemeli');

    assert.equal(durüm.govdeSayisi, 1, 'modül gövdesi yalnız bir kez çalışmalı');
    assert.deepEqual(await ikinci(), [{ etiket: 'birinci' }], 'yakalanan işlev kendi çekirdeğini döndürmeli');
  } finally {
    kayitKancasi(null);
  }
});

test('iki çekirdek birbirinin kaydını ezmez', async () => {
  const a = sahteModul('Alfa-Kahraman', 'alfa');
  const b = sahteModul('Beta-Kahraman', 'beta');
  kayitKancasi(new Map([['Alfa-Kahraman', a.kayit], ['Beta-Kahraman', b.kayit]]));
  try {
    const fa = await cekirdekAl('Alfa-Kahraman');
    const fb = await cekirdekAl('Beta-Kahraman');
    assert.deepEqual(await fa(), [{ etiket: 'alfa' }]);
    assert.deepEqual(await fb(), [{ etiket: 'beta' }]);
    // sıra ters çevrilse de kayıt karışmaz
    assert.deepEqual(await (await cekirdekAl('Beta-Kahraman'))(), [{ etiket: 'beta' }]);
    assert.deepEqual(await (await cekirdekAl('Alfa-Kahraman'))(), [{ etiket: 'alfa' }]);
  } finally {
    kayitKancasi(null);
  }
});

test('eşzamanlı yüklemeler kaydı karıştırmaz', async () => {
  // Kalıcı hafıza süreç boyunca yaşadığı için her test BENZERSİZ ad kullanır.
  const cekirdekler = ['Ksila-Kahraman', 'Kappa-Kahraman', 'Rho-Kahraman'].map(ad => [ad, sahteModul(ad.replace(/-/g, ''), ad)]);
  kayitKancasi(new Map(cekirdekler.map(([ad, x]) => [ad, x.kayit])));
  try {
    const sonuclar = await Promise.all(cekirdekler.map(([ad]) => cekirdekAl(ad)));
    sonuclar.forEach(f => assert.equal(typeof f, 'function'));
    const etiketler = await Promise.all(sonuclar.map(f => f()));
    assert.deepEqual(etiketler.flat().map(x => x.etiket).sort(),
      ['Ksila-Kahraman', 'Kappa-Kahraman', 'Rho-Kahraman'].sort());
  } finally {
    kayitKancasi(null);
  }
});

test('getStreams bırakmayan çekirdek teşhiste görünür (sessiz ölüm yok)', async () => {
  kayitKancasi(new Map([['Sessiz-Kahraman', {
    onek: 'sp_sessiz_', dosya: 'sessiz.js', turler: ['movie'], durum: 'bilinmiyor',
    yukle: async () => { /* hiçbir şey bırakmıyor */ }
  }]]));
  try {
    const w = console.warn; console.warn = () => {};
    const r = await cekirdekAl('Sessiz-Kahraman');
    console.warn = w;
    assert.equal(r, null);
    assert.equal(yuklemeOzeti().detay['Sessiz-Kahraman'].durum, 'kayit-birakmadi');
  } finally {
    kayitKancasi(null);
  }
});

test('patlayan çekirdeğin sebebi teşhiste yazılır', async () => {
  kayitKancasi(new Map([['Bozuk-Kahraman', {
    onek: 'sp_bozuk_', dosya: 'bozuk.js', turler: ['movie'], durum: 'bilinmiyor',
    yukle: async () => { throw new TypeError('value is not a function'); }
  }]]));
  try {
    const w = console.warn; console.warn = () => {};
    const r = await cekirdekAl('Bozuk-Kahraman');
    console.warn = w;
    assert.equal(r, null);
    const d = yuklemeOzeti().detay['Bozuk-Kahraman'];
    assert.equal(d.durum, 'yuklenmedi');
    assert.match(d.mesaj, /value is not a function/);
  } finally {
    kayitKancasi(null);
  }
});

test('yardımcı kayıt (altyazı) kalıcı hafızadan okunur', async () => {
  const { kayit } = sahteModul('Altyazili-Kahraman', 'altyazili');
  kayitKancasi(new Map([['Altyazili-Kahraman', kayit]]));
  try {
    await cekirdekAl('Altyazili-Kahraman');
    assert.equal(typeof cekirdekYardimcisi('Altyazili-Kahraman'), 'function');
    assert.equal(cekirdekYardimcisi('Altyazili-Kahraman', 'yok-boyle-bir-sey'), null);
  } finally {
    kayitKancasi(null);
  }
});

test('kayıtsız ad null döner ve teşhise yazılır', async () => {
  kayitKancasi(new Map());
  try {
    assert.equal(await cekirdekAl('Olmayan-Kahraman'), null);
    assert.equal(yuklemeOzeti().detay['Olmayan-Kahraman'].durum, 'kayit-yok');
  } finally {
    kayitKancasi(null);
  }
});

/* ── Üretim-hattı (çözümleyici) regresyonları ─────────────────────────────
   2026-10-16: 43/43 çekirdek ÖLÜ yükleniyordu. İki mekanik kusur:
   1) `__toESM` yardımıcısının parametresi `value`, modül seviyesindeki
      `var value = Object.create` adını GÖLGELİYORDU → "value is not a function".
   2) CJS kuyruğu `module.exports.getStreams = _gs` salt-getirici özelliğe
      yazmaya çalışıp katı modda patlıyordu → 24 çekirdek ölü.
   tools/kahraman-yamama.mjs bu iki kalıbı onarır; test bozulmayı yakalar. */
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const CEKIRDEK_DIZIN = path.join(process.cwd(), 'src', 'providers', 'cekirdekler');
const tumCekirdekler = readdirSync(CEKIRDEK_DIZIN).filter(f => f.endsWith('.js'));

test('çekirdek sayısı beklenen kayıtlarla örtüşür', () => {
  // Politika (2026-10-16): havuzda YALNIZ ölçümde yayın veren kayıtlar durur.
  // Yayın vermeyen 30 çekirdek arsive alındı (kahraman-cekirdekler/arsiv-kapanlar)
  // ve kayıttan çıkarıldı; bu test artık sayıyı sabitleyerek yeni bir sessiz
  // çekirdek kaybını yakalar.
  assert.ok(tumCekirdekler.length >= 40, `çekirdek sayısı düşük: ${tumCekirdekler.length}`);
});

test('çekirdeklerde gölgelenmiş interop kalıbı kalmadı', () => {
  const bozuk = /([A-Za-z_$][\w$]*) != null \? \1\(([A-Za-z_$][\w$]*)\(\1\)\) : \{\}/g;
  const hatali = [];
  for (const ad of tumCekirdekler) {
    const metin = readFileSync(path.join(CEKIRDEK_DIZIN, ad), 'utf8');
    for (const m of metin.matchAll(bozuk)) hatali.push(`${ad}: ${m[0].slice(0, 60)}`);
  }
  assert.deepEqual(hatali, [], `Object.create çağrısı parametrede gölgelenmiş: ${hatali.join(' | ')}`);
});

test('CJS kuyruk yazmaları tolere ediliyor (try/catch olmadan katı modda ölür)', () => {
  const hatali = [];
  for (const ad of tumCekirdekler) {
    const metin = readFileSync(path.join(CEKIRDEK_DIZIN, ad), 'utf8');
    for (const satir of metin.split('\n')) {
      const m = satir.match(/module\.exports\.(getStreams|getSubtitles)\s*=/);
      if (m && !satir.includes('try {')) hatali.push(`${ad}: ${satir.trim().slice(0, 70)}`);
    }
  }
  assert.deepEqual(hatali, [], `korumasız module.exports yazması: ${hatali.slice(0, 5).join(' | ')}`);
});

test('her çekirdek globalThis.getStreams kaydını bırakır (kuyruk deseni)', () => {
  const eksik = tumCekirdekler.filter(ad => {
    const metin = readFileSync(path.join(CEKIRDEK_DIZIN, ad), 'utf8');
    return !/globalThis\.getStreams\s*=/.test(metin);
  });
  assert.deepEqual(eksik, [], `getStreams kaydı olmayan çekirdek: ${eksik.join(', ')}`);
});
