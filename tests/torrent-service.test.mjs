import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchTorrentStreamSources } from '../src/services/torrentStreamService.js';

// Hidra çok hatlı torrent hattı (2026-10-14 ölçümleriyle): beş hattın hepsi
// anahtarsız ve gömülü tip; sıralama sabit (TR dublaj → altyazı → vidlink →
// multi → son yedek). Torrent havuzu olmaksızın yalnızca açılabilir hatlar.

test('torrent: beş hat, ilki TR dublaj öncelikli ve tümü gömülü', async () => {
  const sources = await fetchTorrentStreamSources({ type: 'tv', tmdbId: '71446', season: 1, episode: 1, title: 'Test' });
  assert.equal(sources.length, 5);
  assert.match(sources[0].url, /^https:\/\/player\.videasy\.to\/tv\/71446\/1\/1\?language=Turkish$/);
  assert.equal(sources[0].category, 'dubbed');
  assert.ok(sources.every((s) => s.type === 'embed' && /^https:\/\//.test(s.url)), 'tüm hatlar gömülü ve https');
  assert.ok(sources.every((s) => s.isTorrent === true), 'torrent havuzu bayrağı korunur');
  assert.match(sources[2].url, /^https:\/\/vidlink\.pro\/tv\/71446\/1\/1\?language=Turkish$/);
  assert.match(sources[4].url, /^https:\/\/2embed\.cc\/embedtv\/71446&s=1&e=1$/);
});

test('torrent: film hattı tmdb ile film kalıplarını kurar, altyazı ucu taşınır', async () => {
  const sources = await fetchTorrentStreamSources({ type: 'movie', tmdbId: '157336', title: 'Interstellar' });
  assert.match(sources[0].url, /^https:\/\/player\.videasy\.to\/movie\/157336\?language=Turkish$/);
  assert.match(sources[1].url, /^https:\/\/player\.videasy\.to\/movie\/157336$/);
  assert.match(sources[3].url, /multiembed\.mov\/\?video_id=157336&tmdb=1$/);
  const subs = sources[0].subtitles || [];
  assert.equal(subs[0]?.src?.includes('/api/subtitles?tmdbId=157336'), true);
});
