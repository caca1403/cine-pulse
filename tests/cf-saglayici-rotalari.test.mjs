import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

import worker from '../cf/workers-entry.js';
import { onRequest as pagesOnRequest } from '../functions/[[route]].js';
import { saglayiciRotaCoz, saglayiciRotalari, saglayiciYaniti } from '../cf/provider-routes.js';
import { ALANLAR } from '../src/providers/alanlar.js';

/* 2026-11-13 parite kırığı: birinci taraf çekirdekler `/api/<kod>/...` ister.
   Android'de NativeMediaGateway bu kodu `native-routes.json` ile hedef siteye
   çevirir; web worker'da böyle bir çözüm YOKTU → 404 → mobilde çalışan
   çekirdek web'de 0 kaynak. Bu test çözümü AĞSIZ (fetch sahtelenmiş) doğrular. */

const KOK = path.resolve(import.meta.dirname, '..');
const ROTA_JSON = path.join(KOK, 'android/app/src/main/assets/native-routes.json');
const CEKIRDEKLER = path.join(KOK, 'src/providers/cekirdekler');

function sahteFetch(kayitlar) {
  return async (adres, secenekler = {}) => {
    kayitlar.push({ adres: String(adres), secenekler });
    return new Response(JSON.stringify({ ok: true, from: 'upstream' }), {
      status: 200,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  };
}

test('rota tablosu doğrudan Android varlığından gelir (tek kaynak, kopya yok)', () => {
  const diskteki = JSON.parse(readFileSync(ROTA_JSON, 'utf8'));
  assert.deepEqual(saglayiciRotalari(), diskteki);
});

test('/api/<kod>/... kodunu native-routes tablosundan çözer', () => {
  const szd = saglayiciRotaCoz('/api/szd/ajax/dataAlternatif22.asp', '?a=1');
  assert.ok(szd);
  assert.equal(szd.konf.base, 'https://sezonlukdizi.cc');
  assert.equal(szd.yol, '/ajax/dataAlternatif22.asp');
  assert.equal(szd.sorgu, '?a=1');

  // base'i /api ile biten rotalar (dzs) çift slash üretmemeli
  const dzs = saglayiciRotaCoz('/api/dzs/movies/by-tmdb/1399', '?type=tv');
  assert.ok(dzs);
  assert.equal(dzs.konf.base, 'https://dizisol.com/api');
  assert.equal(`${dzs.konf.base.replace(/\/+$/, '')}${dzs.yol}${dzs.sorgu}`, 'https://dizisol.com/api/movies/by-tmdb/1399?type=tv');
});

test('worker’ın kendi uçları ve bilinmeyen kodlar rota çözücüye takılmaz', () => {
  // 'dml' api/[...all].js'in Set-Cookie forward dalını kullanan yerel uçtur;
  // yeni çözücü yakalarsa o davranış kaybolur (2026-11-13 inceleme bulgusu).
  for (const yol of ['/api/aria_key', '/api/imdbRating', '/api/trakt_token', '/api/proxy', '/api/hls_proxy', '/api/resolve', '/api/dml', '/api/stream-proxy', '/api/bilinmeyen', '/api']) {
    assert.equal(saglayiciRotaCoz(yol), null, yol);
  }
});

test('sağlayıcı isteği mobil köprüyle aynı hedef/başlıklarla sunucudan atılır', async () => {
  const kayitlar = [];
  const cevap = await saglayiciYaniti(
    new Request('https://worker.example/api/szd/ajax/x.asp?a=1'),
    new URL('https://worker.example/api/szd/ajax/x.asp?a=1'),
    sahteFetch(kayitlar),
  );
  assert.equal(kayitlar.length, 1);
  assert.equal(kayitlar[0].adres, 'https://sezonlukdizi.cc/ajax/x.asp?a=1');
  assert.equal(kayitlar[0].secenekler.headers.Referer, 'https://sezonlukdizi.cc/');
  assert.equal(kayitlar[0].secenekler.headers['X-Requested-With'], 'XMLHttpRequest');
  assert.equal(kayitlar[0].secenekler.headers['Content-Type'], 'application/x-www-form-urlencoded; charset=UTF-8');
  assert.match(kayitlar[0].secenekler.headers['User-Agent'], /Chrome\/124/);
  assert.equal(cevap.status, 200);
  assert.match(cevap.headers.get('content-type'), /application\/json/);
  assert.equal(cevap.headers.get('access-control-allow-origin'), '*');
  assert.deepEqual(await cevap.json(), { ok: true, from: 'upstream' });
});

test('POST gövdesi ve içerik tipi hedefe taşınır', async () => {
  const kayitlar = [];
  const istek = new Request('https://worker.example/api/fhdf/arama', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: 'q=test',
  });
  await saglayiciYaniti(istek, new URL(istek.url), sahteFetch(kayitlar));
  assert.equal(kayitlar[0].secenekler.method, 'POST');
  assert.equal(kayitlar[0].adres, 'https://www.fullhdfilmizlesene.now/arama');
  assert.equal(kayitlar[0].secenekler.headers['Content-Type'], 'application/x-www-form-urlencoded; charset=UTF-8');
  assert.equal(Buffer.from(kayitlar[0].secenekler.body).toString('utf8'), 'q=test');
});

test('OPTIONS ön kontrolü 204 döner, üst akışa gitmez', async () => {
  const kayitlar = [];
  const cevap = await saglayiciYaniti(
    new Request('https://worker.example/api/szd/x', { method: 'OPTIONS' }),
    new URL('https://worker.example/api/szd/x'),
    sahteFetch(kayitlar),
  );
  assert.equal(cevap.status, 204);
  assert.equal(kayitlar.length, 0);
});

test('worker girişi /api/<kod>/... isteğini gerçekten sağlayıcıya taşır (uçtan uca bağlama)', async () => {
  const asil = globalThis.fetch;
  const kayitlar = [];
  globalThis.fetch = sahteFetch(kayitlar);
  try {
    const istek = new Request('https://worker.example/api/slc/api/search?q=test');
    const cevap = await worker.fetch(istek, {
      ASSETS: { fetch: async () => new Response('statik', { status: 200 }) },
    }, { waitUntil() {} });
    assert.equal(kayitlar.length, 1);
    assert.equal(kayitlar[0].adres, 'https://selcukflix.app/api/search?q=test');
    assert.equal(cevap.status, 200);
    assert.deepEqual(await cevap.json(), { ok: true, from: 'upstream' });
  } finally {
    globalThis.fetch = asil;
  }
});

test('rota tablosu çekirdeklerin kullandığı TÜM kodları içerir (mobil+web parite nöbeti)', () => {
  const kodlar = new Set();
  for (const dosya of readdirSync(CEKIRDEKLER).filter((f) => f.endsWith('.js'))) {
    const metin = readFileSync(path.join(CEKIRDEKLER, dosya), 'utf8');
    for (const m of metin.matchAll(/const\s+ROTA\s*=\s*['"]([^'"]+)['"]/g)) kodlar.add(m[1]);
  }
  // Ölçülen gerçek kullanım: bane=jet, bellatrix=hfd, catWoman=dzb, lyra=slc, sirius=fhdf
  assert.ok(kodlar.size >= 4, `beklenen en az 4 rota kodu, bulunan: ${[...kodlar].join(',')}`);
  for (const kod of kodlar) {
    assert.ok(saglayiciRotalari()[kod], `ROTA '${kod}' native-routes.json'da yok — web'de 404 olurdu`);
  }
});

/* ── 2026-11-13 bağımsız inceleme bulgularının regresyon testleri ─────────── */

test('JSON gövdede gerçek site adı kod adına çevrilir (ürün kuralı: sızıntı yok)', async () => {
  const f = async () => new Response(JSON.stringify({
    provider: 'JetFilmizle', name: 'jetfilmizle', label: 'Jet Film İzle', source: 'jetfilmizle',
    items: [{ name: 'DiziSol', provider: 'Dizisol' }],
    url: 'https://jetfilmizle.app/x',
  }), { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } });
  const cevap = await saglayiciYaniti(
    new Request('https://worker.example/api/jet/api/search?q=x'),
    new URL('https://worker.example/api/jet/api/search?q=x'),
    f,
  );
  const j = await cevap.json();
  // api/_anonim.js'in mevcut davranışı (kod adı + kalan ek) korunur; ölçüt
  // gerçek site adının gövdede KALMAMASI.
  for (const deger of [j.provider, j.name, j.label, j.source]) {
    assert.match(deger, /^Nimbus/);
    assert.ok(!/jet\s*film|jetfilmizle/i.test(deger), `site adı sızdı: ${deger}`);
  }
  assert.equal(j.items[0].name, 'Atlas');
  assert.equal(j.items[0].provider, 'Atlas');
  // URL alanına dokunulmaz (çekirdek parse'ı bozulmasın)
  assert.equal(j.url, 'https://jetfilmizle.app/x');
});

test('HTML gövdeye dokunulmaz (çekirdekler HTML’i yapı olarak parse eder)', async () => {
  const html = '<html><body>jetfilmizle içerik</body></html>';
  const f = async () => new Response(html, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } });
  const cevap = await saglayiciYaniti(
    new Request('https://worker.example/api/jet/film/x'),
    new URL('https://worker.example/api/jet/film/x'),
    f,
  );
  assert.equal(await cevap.text(), html);
});

test('mirror tercihi KALICI: başarılı yedek sonraki istekte öne alınır, ölü birincil bir daha denenmez', async () => {
  const cagrilar = [];
  const f = async (adres) => {
    cagrilar.push(String(adres));
    return String(adres).startsWith('https://jetfilmizle.app')
      ? new Response('down', { status: 502 })
      : new Response('{"ok":true}', { status: 200, headers: { 'content-type': 'application/json' } });
  };
  const iste = () => saglayiciYaniti(
    new Request('https://worker.example/api/jet/api/search?q=1'),
    new URL('https://worker.example/api/jet/api/search?q=1'),
    f,
  );
  assert.equal((await iste()).status, 200);
  assert.equal(cagrilar.length, 2, 'ilk istek: ölü birincil + yedek');
  cagrilar.length = 0;
  assert.equal((await iste()).status, 200);
  assert.equal(cagrilar.length, 1, 'ikinci istek yedekle başlamalı (tercih kalıcı)');
  assert.ok(cagrilar[0].startsWith('https://jetfilmizle.now'), 'yedek öne alınmalı');
});

test('Pages/Vercel girişi (functions/[[route]].js) de aynı sağlayıcı rota çözümünü kullanır', async () => {
  const asil = globalThis.fetch;
  const cagrilar = [];
  globalThis.fetch = async (adres) => {
    cagrilar.push(String(adres));
    return new Response('{"ok":true}', { status: 200, headers: { 'content-type': 'application/json' } });
  };
  try {
    const cevap = await pagesOnRequest({
      request: new Request('https://test.example/api/dzb/arama?q=test'),
      env: {},
      waitUntil() {},
    });
    assert.equal(cagrilar.length, 1);
    assert.equal(cagrilar[0], 'https://dizibal.org/arama?q=test');
    assert.equal(cevap.status, 200);
  } finally {
    globalThis.fetch = asil;
  }
});

test('rota tablosu ile ALANLAR çakışan ailelerde tutarlı (rotasyon iki yerde ayrışmasın)', () => {
  const rotalar = saglayiciRotalari();
  const host = (u) => new URL(u).hostname.replace(/^www\./i, '');
  // Aynı yayıncı sitesini paylaşan (rota kodu ↔ kahraman) eşleşmeleri.
  const ESLESME = { jet: 'Bane', dzb: 'Cat-Woman' };
  for (const [kod, kahraman] of Object.entries(ESLESME)) {
    assert.equal(
      host(rotalar[kod].base), host(ALANLAR[kahraman]),
      `${kod} rota tabanı (${rotalar[kod].base}) ile alanlar.js ${kahraman} (${ALANLAR[kahraman]}) ayrıştı — ` +
      'alan adı rotasyonu native-routes.json + alanlar.js BİRLİKTE güncellenmeli',
    );
  }
  for (const [kod, konf] of Object.entries(rotalar)) {
    for (const mirror of konf.mirrors || []) {
      assert.notEqual(host(mirror), host(konf.base), `${kod}: mirror birincil ile aynı host olamaz`);
    }
  }
});

/* ── TEK KAYNAK NÖBETİ (2026-11-13) ────────────────────────────────────────
   Node 20 CI'da ESM JSON import-attributes parse edilemediği için CF tarafı
   native-routes.json'un ÜRETİLMİŞ JS kopyasını kullanır. Kopya bayatlarsa
   mobil ile web farklı alan adlarına gider — bu test drift'i derhal yakalar. */
test('cf/provider-rotalari.js, native-routes.json ile birebir aynı (üretilmiş kopya)', () => {
  const json = JSON.parse(readFileSync(ROTA_JSON, 'utf8'));
  assert.deepEqual(saglayiciRotalari(), json, 'kopya bayat: node scripts/native-routes-sync.mjs çalıştırın');
});

test('native-routes-sync --check: üretilmiş kopya güncel', async () => {
  const { execFileSync } = await import('node:child_process');
  const cikti = execFileSync(process.execPath, [path.join(KOK, 'scripts/native-routes-sync.mjs'), '--check'], { encoding: 'utf8' });
  assert.match(cikti, /güncel/);
});
