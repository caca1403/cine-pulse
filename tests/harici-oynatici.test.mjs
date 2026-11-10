import test from 'node:test';
import assert from 'node:assert/strict';

/* Harici oynatıcı servisi (#9): köprü seçimi, URL çözümü, başarısızlık yolları. */

const hizmet = await import('../src/services/oynatici/hariciOynatici.js');

function sahtePencere(koprular) {
  globalThis.window = koprular;
  globalThis.localStorage = { _m: {}, getItem(k) { return this._m[k] ?? null; }, setItem(k, v) { this._m[k] = String(v); } };
}

test('köprü yoksa: kullanılamaz ve açılamaz', async () => {
  sahtePencere({});
  assert.equal(hizmet.hariciOynaticiMusaitMi(), false);
  assert.equal(await hizmet.hariciOynaticidaAc({ streamUrl: 'https://x.example/v.m3u8' }), false);
});

test('Android köprüsü: OK dönerse açılır, m3u8 MIME seçilir', async () => {
  const cagrilar = [];
  sahtePencere({ CinePulseNative: { openExternalPlayer: (url, mime) => { cagrilar.push({ url, mime }); return 'OK'; } } });
  assert.equal(hizmet.hariciOynaticiMusaitMi(), true);
  const ok = await hizmet.hariciOynaticidaAc({ streamUrl: 'https://x.example/v.m3u8' });
  assert.equal(ok, true);
  assert.equal(cagrilar[0].mime, 'application/vnd.apple.mpegurl');
  assert.equal(cagrilar[0].url, 'https://x.example/v.m3u8');
});

test('masaüstü köprüsü: /api/ URL, başlangıç, referer ve istek başlıkları taşınır', async () => {
  const cagrilar = [];
  sahtePencere({ CinePulseDesktop: {
    isDesktop: true,
    getApiConfig: () => ({ origin: 'http://127.0.0.1:49123', token: 'test-token' }),
    openExternalPlayer: async (url, opts) => { cagrilar.push({ url, opts }); return { ok: true }; }
  } });
  const ok = await hizmet.hariciOynaticidaAc(
    { streamUrl: '/api/hls_proxy?url=x', headers: { Referer: 'https://ref.example/', Cookie: 'sid=abc' } },
    { baslangicSn: 42 }
  );
  assert.equal(ok, true);
  assert.ok(cagrilar[0].url.startsWith('http://127.0.0.1:49123/api/hls_proxy'));
  assert.equal(new URL(cagrilar[0].url).searchParams.get('__cp_token'), 'test-token');
  assert.equal(cagrilar[0].opts.referer, 'https://ref.example/');
  assert.equal(cagrilar[0].opts.baslangicSn, 42);
  assert.equal(cagrilar[0].opts.tamEkran, false);
  assert.equal(cagrilar[0].opts.headers.Cookie, 'sid=abc');
  await hizmet.hariciOynaticidaAc(
    { streamUrl: 'https://x.example/v.mp4' },
    { tamEkran: true }
  );
  assert.equal(cagrilar[1].opts.tamEkran, true);
});

test('harici mod: cp_player_mode=external + köprü gerekir', async () => {
  sahtePencere({});
  globalThis.localStorage.setItem('cp_player_mode', 'external');
  assert.equal(hizmet.hariciOynaticiModuAcik(), false); // köprü yok → mod da kapalı
  sahtePencere({ CinePulseDesktop: { isDesktop: true, openExternalPlayer() {} } });
  assert.equal(hizmet.hariciOynaticiModuAcik(), false); // açık kullanıcı tercihi gerekir
  globalThis.localStorage.setItem('cp_player_mode', 'external');
  assert.equal(hizmet.hariciOynaticiModuAcik(), true);
  sahtePencere({ CinePulseNative: { openExternalPlayer: () => 'YOK' } });
  globalThis.localStorage.setItem('cp_player_mode', 'external');
  assert.equal(hizmet.hariciOynaticiModuAcik(), true);
});

test('Android köprüsü YOK dönerse başarı sayılmaz', async () => {
  sahtePencere({ CinePulseNative: { openExternalPlayer: () => 'YOK' } });
  assert.equal(await hizmet.hariciOynaticidaAc({ streamUrl: 'https://x.example/v.mp4' }), false);
});
