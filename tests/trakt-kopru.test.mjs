import test from 'node:test';
import assert from 'node:assert/strict';
import { traktTokenKopru } from '../api/_traktToken.js';

/* Sahte req/res: traktTokenKopru'nun yazdıklarını toplar. */
function sahteReq(method = 'POST') {
  return { method };
}
function sahteRes() {
  const res = {
    statusCode: 0,
    headers: {},
    body: '',
    setHeader(k, v) { this.headers[k] = v; },
    end(b) { this.body = String(b || ''); return this; }
  };
  return res;
}

/* Global fetch'i yakalayıp taklit eder; çağrı bilgilerini kaydeder. */
function fetchTaklit(cevap) {
  const cagrilan = [];
  globalThis.fetch = async (url, secenek) => {
    cagrilan.push({ url, secenek });
    return {
      status: cevap.status,
      text: async () => cevap.text
    };
  };
  return cagrilan;
}

test('envde sır yoksa 503 döner ve Trakta istek gitmez', async () => {
  const eski = process.env.TRAKT_CLIENT_SECRET;
  delete process.env.TRAKT_CLIENT_SECRET;
  const cagrilan = fetchTaklit({ status: 200, text: '{}' });
  try {
    const res = sahteRes();
    await traktTokenKopru(sahteReq(), res, { code: 'abc', client_id: 'cid' });
    assert.equal(res.statusCode, 503);
    assert.equal(cagrilan.length, 0);
  } finally {
    if (eski !== undefined) process.env.TRAKT_CLIENT_SECRET = eski;
  }
});

test('code ya da refresh_token yoksa 400 döner', async () => {
  process.env.TRAKT_CLIENT_SECRET = 'test-sir';
  const res = sahteRes();
  await traktTokenKopru(sahteReq(), res, { client_id: 'cid' });
  assert.equal(res.statusCode, 400);
  delete process.env.TRAKT_CLIENT_SECRET;
});

test('cihaz kodu: sır yalnız sunucudan eklenir, durum kodu aynen geçer', async () => {
  process.env.TRAKT_CLIENT_SECRET = 'test-sir';
  const cagrilan = fetchTaklit({ status: 400, text: '{"error":"pending"}' });
  try {
    const res = sahteRes();
    await traktTokenKopru(sahteReq(), res, { code: 'dev-code', client_id: 'cid' });
    assert.equal(res.statusCode, 400); // pollDeviceToken 400'ü "bekle" sayar
    assert.equal(cagrilan.length, 1);
    assert.equal(cagrilan[0].url, 'https://api.trakt.tv/oauth/device/token');
    const gonderilen = JSON.parse(cagrilan[0].secenek.body);
    assert.equal(gonderilen.client_secret, 'test-sir');
    assert.equal(gonderilen.code, 'dev-code');
    assert.equal(JSON.parse(res.body).error, 'pending');
  } finally {
    delete process.env.TRAKT_CLIENT_SECRET;
  }
});

test('yenileme: /oauth/token ucuna gider ve grant_type taşır', async () => {
  process.env.TRAKT_CLIENT_SECRET = 'test-sir';
  const cagrilan = fetchTaklit({ status: 200, text: '{"access_token":"t"}' });
  try {
    const res = sahteRes();
    await traktTokenKopru(sahteReq(), res, { refresh_token: 'r1', client_id: 'cid' });
    assert.equal(res.statusCode, 200);
    assert.equal(cagrilan[0].url, 'https://api.trakt.tv/oauth/token');
    const gonderilen = JSON.parse(cagrilan[0].secenek.body);
    assert.equal(gonderilen.grant_type, 'refresh_token');
    assert.equal(gonderilen.refresh_token, 'r1');
  } finally {
    delete process.env.TRAKT_CLIENT_SECRET;
  }
});
