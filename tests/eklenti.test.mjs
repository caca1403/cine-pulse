import test from 'node:test';
import assert from 'node:assert/strict';

/* Eklenti satır dönüşümü + kimlik/önbellek yardımcıları. */

globalThis.localStorage = { _m: {}, getItem(k) { return this._m[k] ?? null; }, setItem(k, v) { this._m[k] = String(v); } };
globalThis.window = { addEventListener() {}, removeEventListener() {} };

const { satirDonustur, eklentiTabani } = await import('../src/services/dogrudan/eklentiServisi.js');

test('düz url satırı oynatılabilir kaynak olur', () => {
  const s = satirDonustur({ name: 'EklentiX', title: 'Film 1080p', url: 'https://cdn.example/v.m3u8?tk=1' }, { ad: 'X' }, 0);
  assert.equal(s.streamUrl, 'https://cdn.example/v.m3u8?tk=1');
  assert.equal(s.isHls, true);
  assert.equal(s.autoPlayable, true);
  assert.equal(s.eklentiAdi, 'X');
  assert.equal(s.kalite, '1080p');
});

test('infoHash satırı magnet olur ve iç oynatıcıda oynatılmaz sayılır', () => {
  const s = satirDonustur({ name: 'Torr\n4k', infoHash: 'abc123', fileIdx: 3, title: 'dizi 2160p' }, { ad: 'T' }, 1);
  assert.ok(s.streamUrl.startsWith('magnet:?xt=urn:btih:abc123'));
  assert.ok(s.streamUrl.includes('&fi=3'));
  assert.equal(s.autoPlayable, false);
  assert.equal(s.kalite, '4K');
});

test('sources yoksa varsayılan izleyiciler magnet\'e eklenir (2026-10-25 Torrentio örkü: 95/76 sourcesız)', () => {
  const s = satirDonustur({ name: 'T', infoHash: 'abc123' }, { ad: 'T' }, 0);
  assert.ok((s.streamUrl.match(/&tr=/g) || []).length >= 4, 'en az 4 varsayılan izleyici');
  assert.ok(s.streamUrl.includes(encodeURIComponent('udp://tracker.opentrackr.org:1337/announce')));
});

test('satırdaki tracker listesi magnet izleyicisi olarak taşınır', () => {
  const s = satirDonustur({
    name: 'T', infoHash: 'abc123',
    sources: ['tracker:udp://tr.example:6969/announce', 'dht:abc123', 'tracker:https://tr2.example/a?x=1']
  }, { ad: 'T' }, 0);
  assert.ok(s.streamUrl.includes(`&tr=${encodeURIComponent('udp://tr.example:6969/announce')}`));
  assert.ok(s.streamUrl.includes(`&tr=${encodeURIComponent('https://tr2.example/a?x=1')}`));
  assert.equal((s.streamUrl.match(/&tr=/g) || []).length, 2);
});

test('proxyUrl içindeki gerçek adres çıkarılır; harici sayfa adresi elenir', () => {
  const s = satirDonustur({ name: 'P', behaviorHints: { proxyUrl: 'https://proxy.example/go?url=https%3A%2F%2Fcdn.example%2Fv.mp4' } }, { ad: 'P' }, 0);
  assert.equal(s.streamUrl, 'https://cdn.example/v.mp4');
  assert.equal(satirDonustur({ name: 'E', externalUrl: 'https://site.example/izle' }, { ad: 'E' }, 0), null);
  assert.equal(satirDonustur(null, { ad: 'E' }, 0), null);
});

test('proxyHeaders istek başlıkları temizlenerek taşınır', () => {
  const s = satirDonustur({
    name: 'H', url: 'https://cdn.example/v.mp4',
    behaviorHints: { proxyHeaders: { request: { 'User-Agent': 'UA/1', Referer: 'https://ref.example/', Cookie: 's=s' } } }
  }, { ad: 'H' }, 0);
  assert.equal(s.headers['User-Agent'], 'UA/1');
  assert.equal(s.headers.Referer, 'https://ref.example/');
  assert.equal(s.headers.Cookie, undefined); // Cookie taşınmaz
});

test('eklentiTabani manifest ve sondaki eğik çizgiyi temizler', () => {
  assert.equal(eklentiTabani('https://x.example/manifest.json'), 'https://x.example');
  assert.equal(eklentiTabani('https://x.example/'), 'https://x.example');
});
