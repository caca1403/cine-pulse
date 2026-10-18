/* Köprü özyineleme regresyonu.
   Uygulamada `kaynakCoz`, çekirdek çalışırken `globalThis.fetch`'i köprünün
   kendisiyle DEĞİŞTİRİR. Köprü içinde çıpa `fetch(...)` çağrısı o anda kendisini
   çağırıyordu → sonsuz döngü → RangeError → çekirdek hatayı yutuyor → symptom:
   "43 sağlayıcı da boş dönüyor, hata yok, ağ isteği yok, ~1 ms".
   Bu test tam o koşulu kurar: fetch'i köprüyle değiştirip köprüyü çağırmak. */
import test from 'node:test';
import assert from 'node:assert/strict';

/* GERCEK_FETCH modül yüklenirken bağlanır → vekil'den ÖNCE kurılmalı. */
const cagri = { adet: 0, sonAdres: null };
globalThis.fetch = async (url) => {
  cagri.adet++;
  cagri.sonAdres = String(url);
  return new Response('#EXTM3U\nok', { status: 200, headers: { 'content-type': 'application/vnd.apple.mpegurl' } });
};

const { kopruFetch, zatenKoprudeMi } = await import('../src/providers/vekil.js');

function kuyrukSifirla() { cagri.adet = 0; cagri.sonAdes = null; cagri.sonAdres = null; }

test('kaynakCoz koşulu: global fetch köprüyken bile TEK gerçek istek gider', async () => {
  kuyrukSifirla();
  const onceki = globalThis.fetch;
  globalThis.fetch = kopruFetch;             // ← kaynakCoz'un yaptığı şey
  try {
    const cevap = await globalThis.fetch('https://ornek.site/akis.m3u8', {});
    assert.equal(cevap.status, 200);
    assert.equal(cagri.adet, 1, `tek gerçek istek bekleniyordu, ${cagri.adet} gitti (özyineleme?)`);
    assert.match(cagri.sonAdres, /\/api\/proxy\?url=/, 'çapraz köken köprüden geçmeli');
  } finally {
    globalThis.fetch = onceki;
  }
});

test('zaten köprülü adres ikinci kez sarılmaz (özyineleme koruması)', async () => {
  kuyrukSifirla();
  const onceki = globalThis.fetch;
  globalThis.fetch = kopruFetch;
  const koprulu = 'https://ornek.site/api/proxy?url=https%3A%2F%2Fbaska.site%2Fx.m3u8';
  try {
    assert.equal(zatenKoprudeMi(koprulu), true);
    await globalThis.fetch(koprulu, {});
    assert.equal(cagri.adet, 1, 'köprülü adres olduğu gibi geçmeli');
    assert.equal(cagri.sonAdres, koprulu, 'adres DEĞİŞMEMELİ — her turda url= katlanarak şişerdi');
  } finally {
    globalThis.fetch = onceki;
  }
});

test('kendi originimizdeki yol köprüye sokulmaz', async () => {
  kuyrukSifirla();
  const onceki = globalThis.fetch;
  globalThis.fetch = kopruFetch;
  try {
    await globalThis.fetch('/api/saglik', {});
    assert.equal(cagri.adet, 1);
    assert.equal(cagri.sonAdres, '/api/saglik');
  } finally {
    globalThis.fetch = onceki;
  }
});

test('alan listesi isteği ağa çıkmadan yerel haritadan yanıtlanır', async () => {
  kuyrukSifirla();
  const onceki = globalThis.fetch;
  globalThis.fetch = kopruFetch;
  try {
    const cevap = await globalThis.fetch('https://cdn.ornek.site/domains.json', {});
    const veri = await cevap.json();
    assert.equal(cagri.adet, 0, 'alan listesi YEREL yanıtlanmalı');
    assert.ok(veri.domains && Object.keys(veri.domains).length > 10, 'yerel sabit harita dönmeli');
    assert.ok(Object.values(veri.domains).every(v => /^https:\/\//.test(String(v))));
  } finally {
    globalThis.fetch = onceki;
  }
});
