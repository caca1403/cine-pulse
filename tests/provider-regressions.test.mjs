import test from 'node:test';
import assert from 'node:assert/strict';
import CryptoJS from '../src/vendor/crypto-js.js';
import { sifreliOynaticiCoz } from '../src/services/encryptedPlayer.js';
import { siteListesi, vidlinkKaynaklari } from '../src/services/siteProviders.js';

test('ESM crypto entry decrypts the reversed-base64 provider envelope', () => {
  const html = '<video src="https://cdn.example/movie.m3u8"></video>';
  const key = 'provider-password';
  const encrypted = CryptoJS.AES.encrypt(html, key, {salt:CryptoJS.enc.Hex.parse('0011223344556677')}).toString();
  const wrap = value => Buffer.from(value, 'latin1').toString('base64').split('').reverse().join('');
  const input = `CryptoJS; document.write(decode("${wrap(encrypted)}")); var KEY=decode("${wrap(key)}");`;
  assert.equal(sifreliOynaticiCoz(input), html);
});

test('VidLink parses a short JSON response into streams, not an API iframe', () => {
  const sources = vidlinkKaynaklari(JSON.stringify({stream:{playlist:'https://cdn.example/master.m3u8',qualities:{'1080p':{url:'https://cdn.example/1080.m3u8'}}}}));
  assert.equal(sources.length, 2);
  assert.ok(sources.every(s => s.isHls && !s.isIframe));
  assert.deepEqual(vidlinkKaynaklari('{"error":"not found"}'), []);
});

test('HDFilmDelisi uses q and selects the matching title after an unrelated first link', async () => {
  const originalFetch = globalThis.fetch;
  const requests = [];
  globalThis.fetch = async input => {
    const u = String(input); requests.push(u);
    const body = u.includes('/arama?')
      ? `<a href="/film/another">Another Movie</a><a href="/film/interstellar"><img alt="Interstellar"></a>${' '.repeat(350)}`
      : u.includes('/film/interstellar')
        ? `<iframe src="https://cdn.example/master.m3u8"></iframe>${' '.repeat(350)}`
        : ' '.repeat(400);
    return new Response(body, {status:200});
  };
  try {
    const sources = await siteListesi('hdfilmdelisi', {title:'Interstellar',tmdbId:'157336',imdbId:'tt0816692'});
    assert.ok(requests.some(u => u.includes('/arama?q=')));
    assert.ok(requests.some(u => u.endsWith('/film/interstellar')));
    assert.ok(!requests.some(u => u.endsWith('/film/another')));
    assert.ok(sources.length > 0);
  } finally { globalThis.fetch = originalFetch; }
});
