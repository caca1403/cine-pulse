/* Regresyon: sezon/tümünü izlendi işaretleme sonrası türetilmiş ilerleme
   önbelleği bayat kalıyordu — buton etiketi ve durumu güncellenmiyordu
   (kullanıcı hatası 2026-10-18). setLocalItem artık WATCH_HISTORY yazımında
   harita önbelleğini tek merkezden geçersiz kılıyor. */
import { test } from 'node:test';
import assert from 'node:assert/strict';

const depo = new Map();
globalThis.window = {
  localStorage: {
    getItem: k => (depo.has(k) ? depo.get(k) : null),
    setItem: (k, v) => depo.set(k, String(v)),
    removeItem: k => depo.delete(k),
  },
  dispatchEvent() {},
  addEventListener() {},
};

const s = await import('../src/services/altyapi/storage.js');

test('sezonu izlendi işaretleme, harita önbelleği doluysa bile anında görünür', () => {
  const id = 'tt-regresyon-1';
  // Hatayı tetikleyen sıra: önce okuma (bayat haritayı kurar), sonra toplu yazım.
  assert.equal(s.isSeasonFullyWatched(id, 1, 6), false);
  s.markSeasonEpisodesWatched(id, 1, 6, true, { title: 'Regresyon Dizisi', type: 'tv' });
  assert.equal(s.isSeasonFullyWatched(id, 1, 6), true, 'işaretleme sonrası sezon tam izlendi sayılmalı');
  s.markSeasonEpisodesWatched(id, 1, 6, false, { title: 'Regresyon Dizisi', type: 'tv' });
  assert.equal(s.isSeasonFullyWatched(id, 1, 6), false, 'işaret kaldırma da anında görünmeli');
});

test('tüm sezonları işaretleme isEntireSeriesWatchedı anında günceller', () => {
  const id = 'tt-regresyon-2';
  const seasons = [{ season_number: 1, episode_count: 3 }, { season_number: 2, episode_count: 2 }];
  assert.equal(s.isEntireSeriesWatched(id, seasons), false);
  s.markAllEpisodesWatched(id, seasons, true, { title: 'Regresyon Dizisi 2', type: 'tv' });
  assert.equal(s.isEntireSeriesWatched(id, seasons), true);
});
