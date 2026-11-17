/* Köprü katman düşüşü (vekil.js) — AĞ YOK.
   ----------------------------------------------------------------------------
   Ölçülen sorun: `kopruFetch` uzaktan istekleri TEK katman (`/api/proxy`)
   gönderiyordu. Yerel/cihaz köprüsü ya da genel proxy çökünce çekirdek HİÇ
   yanıt alamıyordu → kullanıcı "hiçbir kaynak açılmıyor" diyordu. Eylül'deki
   kazıyıcılar (git 6baa792) sırayla 4 katman deniyordu.

   Bu test gerçek siteye GİTMEZ: modül yüklenirken global fetch bir
   yönlendiriciye bağlanır, her test kendi sahte fetch'ini takar. Ayrıca cihaz
   (Capacitor) benzetilir: 1. katman yerel ağ geçidi, 3. katman genel worker
   proxy olur — böylece iki katman AYRI adreslerdir. */

import test from 'node:test';
import assert from 'node:assert/strict';

/* YEREL_FETCH modül yüklenirken bağlanır → yönlendirici vekil'den ÖNCE kurulmalı.
   Böylece kopruFetch içinden `fetch(...)` çağrılsa bile (global fetch köprüyken)
   gerçek Node ağına ÇIKILMAZ. */
let aktifFetch = async () => { throw new Error('testte ağ kapalı'); };
const YONLENDIRICI = (girdi, secenek) => aktifFetch(girdi, secenek);
globalThis.fetch = YONLENDIRICI;

const {
  kopruFetch,
  KATMAN_ZAMAN_ASIMI_MS,
  KOPRU_TOPLAM_BUTCE_MS,
} = await import('../src/providers/vekil.js');

const LOKAL = 'http://127.0.0.1:45999';
const GENEL = 'https://cinepulse.cinepulse.workers.dev';
const CF_WORKER = 'https://wild-credit-e1ae.cagatayca07.workers.dev';
const HEDEF = 'https://hedef.example/sayfa?a=1';

function cihazKur() {
  globalThis.window = {
    Capacitor: { isNativePlatform: () => true },
    CinePulseNative: { getApiOrigin: () => LOKAL },
  };
}

function cihazKaldir() {
  try { delete globalThis.window; } catch (_) { /* yok */ }
}

function adresListesi(girdi) {
  return String(girdi);
}

function baslat(fetchUygulama) {
  aktifFetch = fetchUygulama;
}

test('zaman aşımı sabitleri makul (katman ~9 sn, toplam ~20 sn)', () => {
  assert.ok(KATMAN_ZAMAN_ASIMI_MS > 0 && KATMAN_ZAMAN_ASIMI_MS <= 10_000);
  assert.ok(KOPRU_TOPLAM_BUTCE_MS > 0 && KOPRU_TOPLAM_BUTCE_MS <= 25_000);
});

test('1. katman (yerel köprü) ağ hatası → 3. katman (genel proxy) yanıtı döner', async () => {
  cihazKur();
  const gorulen = [];
  baslat(async (girdi) => {
    const u = adresListesi(girdi);
    gorulen.push(u);
    if (u.startsWith(LOKAL)) throw new TypeError('Failed to fetch');
    if (u.startsWith(`${GENEL}/api/proxy`)) {
      return new Response('KATMAN3', { status: 200, headers: { 'content-type': 'text/plain' } });
    }
    throw new Error(`beklenmeyen adres: ${u}`);
  });

  try {
    const cevap = await kopruFetch(HEDEF);
    assert.equal(cevap.status, 200);
    assert.equal(await cevap.text(), 'KATMAN3');
    assert.ok(
      gorulen.some((u) => u.startsWith(`${GENEL}/api/proxy`)),
      'genel proxy katmanı denenmeli'
    );
    assert.equal(
      gorulen.some((u) => u.startsWith('https://hedef.example')),
      false,
      'cihazda doğrudan katman atlanmalı (CORS köprüsü yetkilidir)'
    );
  } finally {
    cihazKaldir();
  }
});

test('3. katman 500 → 4. katman (CF worker) denenir ve onun yanıtı döner', async () => {
  cihazKur();
  const gorulen = [];
  baslat(async (girdi) => {
    const u = adresListesi(girdi);
    gorulen.push(u);
    if (u.startsWith(LOKAL)) return new Response('down', { status: 500 });
    if (u.startsWith(`${GENEL}/api/proxy`)) return new Response('upstream down', { status: 502 });
    if (u.startsWith(CF_WORKER)) return new Response('KATMAN4', { status: 200 });
    throw new Error(`beklenmeyen adres: ${u}`);
  });

  try {
    const cevap = await kopruFetch(HEDEF);
    assert.equal(cevap.status, 200);
    assert.equal(await cevap.text(), 'KATMAN4');
    assert.ok(gorulen.some((u) => u.startsWith(CF_WORKER)), 'CF worker yedeği denenmeli');
  } finally {
    cihazKaldir();
  }
});

test('3. katman 403 → 4. KATMAN DENENMEZ, yanıt olduğu gibi döner', async () => {
  cihazKur();
  let cfCagri = 0;
  baslat(async (girdi) => {
    const u = adresListesi(girdi);
    if (u.startsWith(LOKAL)) throw new TypeError('Failed to fetch');
    if (u.startsWith(`${GENEL}/api/proxy`)) {
      return new Response('forbidden', { status: 403, headers: { 'content-type': 'text/plain' } });
    }
    if (u.startsWith(CF_WORKER)) {
      cfCagri += 1;
      return new Response('KATMAN4', { status: 200 });
    }
    throw new Error(`beklenmeyen adres: ${u}`);
  });

  try {
    const cevap = await kopruFetch(HEDEF);
    assert.equal(cevap.status, 403, '4xx yanıtı OLDUĞU GİBİ dönmeli');
    assert.equal(await cevap.text(), 'forbidden');
    assert.equal(cfCagri, 0, '4xx "uzak gerçekten ölü" sayılır → CF katmanı denenmez');
  } finally {
    cihazKaldir();
  }
});

test('tüm katmanlar başarısız → throw YOK, boş/hata yanıtı döner', async () => {
  cihazKur();
  baslat(async (girdi) => {
    const u = adresListesi(girdi);
    if (u.startsWith(LOKAL)) throw new TypeError('Failed to fetch');
    if (u.startsWith(`${GENEL}/api/proxy`)) return new Response('down', { status: 503 });
    if (u.startsWith(CF_WORKER)) throw new TypeError('Failed to fetch');
    throw new Error(`beklenmeyen adres: ${u}`);
  });

  try {
    let cevap;
    await assert.doesNotReject(async () => {
      cevap = await kopruFetch(HEDEF);
    }, 'köprü asla throw etmemeli');
    assert.ok(cevap, 'boş yanıt dönmeli (null değil)');
    assert.equal(cevap.ok, false);
    assert.ok(cevap.status >= 500, `boş davranış 5xx olmalı, gelen: ${cevap.status}`);
  } finally {
    cihazKaldir();
  }
});

test('cihaz köprüsü sağlıklıyken genel proxy/CF katmanları HİÇ denenmez (davranış aynı)', async () => {
  cihazKur();
  const gorulen = [];
  baslat(async (girdi) => {
    gorulen.push(adresListesi(girdi));
    return new Response('YEREL', { status: 200, headers: { 'content-type': 'text/plain' } });
  });

  try {
    const cevap = await kopruFetch(HEDEF);
    assert.equal(cevap.status, 200);
    assert.equal(await cevap.text(), 'YEREL');
    assert.equal(gorulen.length, 1, 'tek istek: yerel köprü');
    assert.ok(gorulen[0].startsWith(LOKAL), 'istek yerel ağ geçidine gitmeli');
    assert.equal(gorulen.some((u) => u.startsWith(GENEL)), false, 'genel proxy denenmemeli');
    assert.equal(gorulen.some((u) => u.startsWith(CF_WORKER)), false, 'CF worker denenmemeli');
  } finally {
    cihazKaldir();
  }
});

test('düz tarayıcıda 1. katman ağ hatası → doğrudan fetch (2) denenir', async () => {
  globalThis.window = { location: { hostname: 'ornek.app', protocol: 'https:' } };
  const gorulen = [];
  baslat(async (girdi) => {
    const u = adresListesi(girdi);
    gorulen.push(u);
    if (u.includes('/api/proxy')) throw new TypeError('Failed to fetch');
    if (u === HEDEF) return new Response('DOGRUDAN', { status: 200 });
    throw new Error(`beklenmeyen adres: ${u}`);
  });

  try {
    const cevap = await kopruFetch(HEDEF);
    assert.equal(cevap.status, 200);
    assert.equal(await cevap.text(), 'DOGRUDAN');
    assert.ok(gorulen.includes(HEDEF), 'doğrudan hedef adres denenmeli');
  } finally {
    cihazKaldir();
  }
});

test('özyineleme koruması: /api/proxy adresi tekrar köprüye girse de döngü YOK', async () => {
  cihazKur();
  let adet = 0;
  baslat(async () => {
    adet += 1;
    return new Response('OK', { status: 200 });
  });

  const onceki = globalThis.fetch;
  const koprulu = `${GENEL}/api/proxy?url=${encodeURIComponent('https://hedef.example/a.m3u8')}`;
  try {
    globalThis.fetch = kopruFetch; // kaynakCoz'un yaptığı şey
    const cevap = await globalThis.fetch(koprulu, {});
    assert.equal(cevap.status, 200);
    assert.equal(adet, 1, 'köprülenmiş adres olduğu gibi geçmeli (tek istek)');

    globalThis.fetch = kopruFetch;
    const cevap2 = await globalThis.fetch(koprulu, {});
    assert.equal(cevap2.status, 200);
    assert.equal(adet, 2, 'ikinci çağrıda da şişme/döngü olmamalı');
  } finally {
    globalThis.fetch = onceki;
    cihazKaldir();
  }
});
