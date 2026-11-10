import test from 'node:test';
import assert from 'node:assert/strict';
import { getStreams } from '../src/providers/cekirdekler/dizisol.js';
import { normalizeEt } from '../src/providers/vekil.js';

test('DiziSol returns all valid API backups instead of truncating at six', async () => {
  const originalFetch = globalThis.fetch;
  const manifests = new Map();
  const sources = Array.from({ length: 9 }, (_, i) => {
    const url = `https://backup-${i}.example.test/master.m3u8?token=${i}`;
    manifests.set(url, '#EXTM3U\n#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio",NAME="Turkish",LANGUAGE="tr",DEFAULT=YES\n#EXT-X-STREAM-INF:BANDWIDTH=4000000,RESOLUTION=1920x1080\nvariant.m3u8');
    return { provider: `backup-${i}`, m3u8Url: url, priority: i, isActive: true };
  });

  globalThis.fetch = async (url) => {
    const address = String(url);
    if (address.includes('/api/movies/by-tmdb/')) {
      return { ok: true, json: async () => ({ sources }) };
    }
    const body = manifests.get(address);
    return body
      ? { ok: true, text: async () => body }
      : { ok: false, text: async () => '' };
  };

  try {
    const streams = await getStreams(987654321, 'movie');
    assert.equal(streams.length, 9);
    assert.deepEqual(streams.map((stream) => stream.url), sources.map((source) => source.m3u8Url));
    assert.ok(streams.every((stream) => stream.name === 'Green-Arrow' && stream.proxyStreamGerekli && stream.headers.Origin));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('DiziSol keeps unverified mirrors as fallbacks when one mirror validates', async () => {
  const originalFetch = globalThis.fetch;
  const sources = [
    { provider: 'working', m3u8Url: 'https://working.example.test/master.m3u8', priority: 1, isActive: true },
    { provider: 'slow', m3u8Url: 'https://slow.example.test/master.m3u8', priority: 2, isActive: true },
    { provider: 'backup', m3u8Url: 'https://backup.example.test/master.m3u8', priority: 3, isActive: true },
  ];

  globalThis.fetch = async (url) => {
    const address = String(url);
    if (address.includes('/api/movies/by-tmdb/')) {
      return { ok: true, json: async () => ({ sources }) };
    }
    if (address === sources[0].m3u8Url) {
      return { ok: true, text: async () => '#EXTM3U\n#EXT-X-STREAM-INF:BANDWIDTH=4000000,RESOLUTION=1920x1080\nvariant.m3u8' };
    }
    return { ok: false, text: async () => '' };
  };

  try {
    const streams = await getStreams(987654322, 'movie');
    assert.deepEqual(streams.map((stream) => stream.url), sources.map((source) => source.m3u8Url));
    assert.equal(streams.filter((stream) => stream.dogrulanamadi).length, 2);
    assert.ok(streams.every((stream) => stream.proxyStreamGerekli));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('DiziSol resolves relative proxy streams from the provider API', async () => {
  const originalFetch = globalThis.fetch;
  const streamUrl = 'https://dizisol.com/api/proxy/hdfilmizle/play/6676';

  globalThis.fetch = async (url) => {
    const address = String(url);
    if (address.includes('/api/movies/by-tmdb/')) {
      return { ok: true, json: async () => ({ sources: [{ provider: 'hdfilmizle', m3u8Url: '/api/proxy/hdfilmizle/play/6676' }] }) };
    }
    return address === streamUrl
      ? { ok: true, text: async () => '#EXTM3U\n#EXT-X-STREAM-INF:BANDWIDTH=4000000,RESOLUTION=1920x1080\nvariant.m3u8' }
      : { ok: false, text: async () => '' };
  };

  try {
    const streams = await getStreams(987654323, 'movie');
    assert.equal(streams.length, 1);
    assert.equal(streams[0].url, streamUrl);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('DiziSol refreshes cached stream URLs after 30 seconds', async () => {
  const originalFetch = globalThis.fetch;
  const originalNow = Date.now;
  let now = 1_800_000_000_000;
  let apiRequests = 0;
  Date.now = () => now;
  const streamUrl = 'https://cache.example.test/master.m3u8';

  globalThis.fetch = async (url) => {
    if (String(url).includes('/api/movies/by-tmdb/')) {
      apiRequests++;
      return { ok: true, json: async () => ({ sources: [{ provider: 'cache-test', m3u8Url: streamUrl }] }) };
    }
    return { ok: true, text: async () => '#EXTM3U\n#EXT-X-STREAM-INF:BANDWIDTH=4000000,RESOLUTION=1920x1080\nvariant.m3u8' };
  };

  try {
    await getStreams(987654324, 'movie');
    assert.equal(apiRequests, 1);
    now += 30_001;
    await getStreams(987654324, 'movie');
    assert.equal(apiRequests, 2);
  } finally {
    Date.now = originalNow;
    globalThis.fetch = originalFetch;
  }
});

test('DiziSol normalization keeps direct native URL and adds header-aware browser URL', () => {
  const normalized = normalizeEt({
    name: 'Green-Arrow',
    title: 'Green-Arrow · FullHD · 1080p',
    url: 'https://cdn.example.test/master.m3u8?sig=abc',
    format: 'm3u8',
    headers: { Referer: 'https://dizisol.com/', Origin: 'https://dizisol.com' },
    proxyGerekmez: true,
    proxyStreamGerekli: true,
  }, { onek: 'sp_greenarrow_', kodAdi: 'Green-Arrow' });

  assert.equal(normalized.streamUrl, 'https://cdn.example.test/master.m3u8?sig=abc');
  assert.match(normalized.proxyStreamUrl, /^\/api\/hls_proxy\?/);
  assert.match(decodeURIComponent(normalized.proxyStreamUrl), /"Origin":"https:\/\/dizisol\.com"/);
});
