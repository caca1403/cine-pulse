/* RecTV (Polaris) bağlantı katmanı — dönen alan adı düştüğünde davranış.
 *
 * Kanıtlanan kusur: Node/Electron doğrudan yolunda RC'nin verdiği aktif adres
 * (a.psrectv80.xyz) TLS'te ECONNRESET veriyordu; aynı imza ve aynı yol
 * ADRES_YEDEK (a.prectv70.lol) ile HTTP 200 dönüyor ve gerçek kaynaklar çıkıyor.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchRecTvSources, rectvTani, derlemeAyikla } from '../src/services/rectvService.js';

const ANA_HOST = 'https://a.psrectv80.xyz';
const YEDEK_HOST = 'https://a.prectv70.lol';
const RC_UCU = 'firebaseremoteconfig.googleapis.com';
const YAYIN_URL = 'https://cdn.example/dune/master.m3u8';

function jsonYanit(govde, durum = 200) {
  return new Response(JSON.stringify(govde), {
    status: durum,
    headers: { 'content-type': 'application/json' }
  });
}

/** Remote Config'in her testte aynı cevabı: aktif adres + düz derleme no. */
function rcYaniti() {
  return jsonYanit({ entries: { api_url: `${ANA_HOST}/api/`, app_build: '160' } });
}

/** Yedek adresin döndürdüğü arama gövdesi: tek doğrudan m3u8 kaynak. */
function aramaYaniti() {
  return jsonYanit({
    posters: [
      {
        id: 501,
        type: 'movie',
        title: 'Dune',
        sources: [{ id: 9, title: '1080p', url: YAYIN_URL }]
      }
    ]
  });
}

function tlsReset(hedef) {
  const err = new Error(`read ECONNRESET (${hedef})`);
  err.code = 'ECONNRESET';
  return err;
}

/** fetch mock'u kurar; istek kayıtlarını `cikti` dizisine yazar. */
function mockKur(cikti, secenekler = {}) {
  globalThis.fetch = async (girdi, baslangic = {}) => {
    const url = String(girdi);
    cikti.push({ url, headers: baslangic.headers || {} });
    if (url.includes(RC_UCU)) return secenekler.rc ? secenekler.rc() : rcYaniti();
    if (url.startsWith(ANA_HOST)) {
      if (secenekler.anaHata) throw secenekler.anaHata();
      return secenekler.ana ? secenekler.ana() : aramaYaniti();
    }
    if (url.startsWith(YEDEK_HOST)) {
      if (secenekler.yedekHata) throw secenekler.yedekHata();
      return secenekler.yedek ? secenekler.yedek() : aramaYaniti();
    }
    throw new Error(`Beklenmeyen istek: ${url}`);
  };
}

const anaVeYedekIstekleri = (cikti) => ({
  ana: cikti.filter(r => r.url.startsWith(ANA_HOST)),
  yedek: cikti.filter(r => r.url.startsWith(YEDEK_HOST))
});

test('ana host ECONNRESET verirse aynı imza ve yolla ADRES_YEDEK tek retry ile kaynak döndürür', async () => {
  const onceki = globalThis.fetch;
  const cikti = [];
  mockKur(cikti, { anaHata: () => tlsReset(ANA_HOST) });
  try {
    const kaynaklar = await fetchRecTvSources({ type: 'movie', title: 'Dune' });

    assert.equal(kaynaklar.length, 1, 'yedek adresten kaynak gelmeli');
    assert.equal(kaynaklar[0].rawStreamUrl, YAYIN_URL);
    assert.equal(kaynaklar[0].source, 'Polaris');
    assert.equal(kaynaklar[0].isHls, true);

    const { ana, yedek } = anaVeYedekIstekleri(cikti);
    assert.equal(ana.length, 1, 'aktif adres yalnız bir kez denenir');
    assert.equal(yedek.length, 1, 'yedek adres yalnız bir kez denenir (TEK retry)');

    // Aynı yol, aynı imza malzemesi.
    assert.equal(yedek[0].url.split('/api')[1], ana[0].url.split('/api')[1]);
    assert.equal(yedek[0].headers['x-app-version'], ana[0].headers['x-app-version']);
    for (const baslik of ['x-signature', 'x-timestamp', 'x-nonce', 'x-app-version', 'x-app-package']) {
      assert.ok(ana[0].headers[baslik], `ana istekte ${baslik} olmalı`);
      assert.ok(yedek[0].headers[baslik], `yedek istekte ${baslik} olmalı`);
    }

    // Adres önbelleği kalıcı olarak değişmedi.
    assert.equal(rectvTani.adres, ANA_HOST);
    assert.equal(rectvTani.derleme, '160');
    assert.equal(rectvTani.durumKodu, 200);
    assert.equal(rectvTani.hata, '');
  } finally {
    globalThis.fetch = onceki;
  }
});

test('bağlantı hatası durumKodu 0 bırakır, hata "baglanti:" önekiyle döner', async () => {
  const onceki = globalThis.fetch;
  const cikti = [];
  mockKur(cikti, {
    anaHata: () => tlsReset(ANA_HOST),
    yedekHata: () => tlsReset(YEDEK_HOST)
  });
  try {
    const kaynaklar = await fetchRecTvSources({ type: 'movie', title: 'Dune' });

    assert.deepEqual(kaynaklar, []);
    assert.equal(rectvTani.durumKodu, 0, 'eski RemoteConfig 200 durum kodu kalmamalı');
    assert.match(rectvTani.hata, /^baglanti: /);
    assert.match(rectvTani.hata, /ECONNRESET/);

    const { ana, yedek } = anaVeYedekIstekleri(cikti);
    assert.equal(ana.length, 1);
    assert.equal(yedek.length, 1);
  } finally {
    globalThis.fetch = onceki;
  }
});

test('HTTP durum kodu alındığında yedek adrese yeniden deneme yapılmaz', async () => {
  const onceki = globalThis.fetch;
  const cikti = [];
  mockKur(cikti, {
    ana: () => new Response('{"error":"invalid_signature"}', {
      status: 403,
      headers: { 'content-type': 'application/json' }
    })
  });
  try {
    const kaynaklar = await fetchRecTvSources({ type: 'movie', title: 'Dune' });

    assert.deepEqual(kaynaklar, []);
    const { ana, yedek } = anaVeYedekIstekleri(cikti);
    assert.equal(ana.length, 1);
    assert.equal(yedek.length, 0, 'sunucu yanıt verdiyse retry anlamsız');
    assert.equal(rectvTani.durumKodu, 403);
    assert.match(rectvTani.hata, /^403 /);
  } finally {
    globalThis.fetch = onceki;
  }
});

test('derlemeAyikla düz "160" derleme numarasını da okur', () => {
  assert.equal(derlemeAyikla({ app_build: '160' }), '160');
  assert.equal(derlemeAyikla({ app_build: ' 160 ' }), '160');
  // Yedek değer 160 olduğu için asıl ayırt edici kontrol farklı bir sayı.
  assert.equal(derlemeAyikla({ app_build: '161' }), '161');
  assert.equal(derlemeAyikla({ updated_app_url: '', app_build: '1642' }), '1642');
  // URL biçimi hâlâ çalışır ve öncelik sırası korunur.
  assert.equal(derlemeAyikla({ updated_app_url: 'https://x/rectv-160.apk', app_build: '161' }), '160');
  assert.equal(derlemeAyikla({ build_number: 'v=167' }), '167');
  assert.equal(derlemeAyikla({ app_build: 'son-ki-surum' }), '160');
});