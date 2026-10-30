import test from 'node:test';
import assert from 'node:assert/strict';

import {
  adaylariTekillestir,
  fetchPersonalizedRows,
  onerilenlerdenCikar
} from '../src/services/kisisel/recommendationEngine.js';

test('completed and seen titles are exclusion signals, never recommendation cards', async () => {
  const gecmis = [
    { id: 1, type: 'tv', completed: true },
    { id: 2, type: 'movie', progressPercent: 35 }
  ];
  const tamamlanan = [{ id: 1, type: 'tv', completed: true }];
  const favoriler = [{ id: 3, type: 'movie' }];
  const watchlist = [{ id: 4, type: 'movie' }];
  const calls = [];
  let active = 0;
  let maxActive = 0;
  const recommendationMap = {
    'tv:1': [{ id: 11, type: 'tv', genre_ids: [18], popularity: 11 }, { id: 1, type: 'tv' }],
    'movie:2': [{ id: 22, type: 'movie', genre_ids: [35], popularity: 22 }],
    'movie:3': [{ id: 33, type: 'movie', genre_ids: [18], popularity: 33 }],
    'movie:4': [{ id: 44, type: 'movie', genre_ids: [53], popularity: 44 }]
  };
  const rows = await fetchPersonalizedRows({
    gecmis,
    tamamlanan,
    favoriler,
    watchlist,
    fallbackAdaylar: [{ id: 55, type: 'tv', genre_ids: [18], popularity: 55 }],
    adet: 24,
    fetchDiscoverFn: async () => [],
    fetchRecommendationsFn: async (type, id) => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      calls.push(`${type}:${id}`);
      await new Promise((resolve) => setTimeout(resolve, 2));
      active -= 1;
      return recommendationMap[`${type}:${id}`] || [];
    }
  });

  assert.deepEqual(new Set(calls), new Set(['tv:1', 'movie:2', 'movie:3', 'movie:4']));
  assert.ok(maxActive <= 3, `TMDB recommendation concurrency must be capped at 3; got ${maxActive}`);
  assert.deepEqual(rows.tamamladiklarindanSonra.map((item) => item.id), [11]);
  assert.deepEqual(rows.favorilerineGore.map((item) => item.id), [33]);
  assert.deepEqual(new Set(rows.seninIcin.map((item) => item.id)), new Set([11, 22, 33, 44, 55]));

  const excluded = onerilenlerdenCikar({ gecmis, tamamlanan, favoriler, watchlist });
  for (const row of Object.values(rows)) {
    assert.ok(row.every((item) => !excluded.has(`${item.type}:${item.id}`)));
  }
});

test('seen-only candidates are deduplicated and the kid filter applies to every row', async () => {
  const rows = await fetchPersonalizedRows({
    tamamlanan: [{ id: 7, type: 'tv', completed: true, genre_ids: [16] }],
    fallbackAdaylar: [
      { id: 8, type: 'tv', genre_ids: [16], popularity: 8 },
      { id: 9, type: 'tv', genre_ids: [16], popularity: 9 }
    ],
    isKid: true,
    guvenliMi: (item) => item.id !== 9,
    fetchDiscoverFn: async () => [],
    fetchRecommendationsFn: async () => [
      { id: 8, type: 'tv', genre_ids: [16], popularity: 8 },
      { id: 9, type: 'tv', genre_ids: [16], popularity: 9 }
    ]
  });

  assert.deepEqual(rows.seninIcin.map((item) => item.id), [8]);
  assert.deepEqual(rows.tamamladiklarindanSonra.map((item) => item.id), [8]);
  assert.deepEqual(adaylariTekillestir([{ id: 8, type: 'tv' }, { id: 8, type: 'tv' }]).map((item) => item.id), [8]);
});

test('all personalized rows can fill to 40 and stay separated by media type', async () => {
  const fallbackAdaylar = [
    ...Array.from({ length: 45 }, (_, index) => ({
      id: 100 + index,
      type: 'movie',
      genre_ids: [18],
      popularity: index
    })),
    ...Array.from({ length: 45 }, (_, index) => ({
      id: 200 + index,
      type: 'tv',
      genre_ids: [18],
      popularity: index
    }))
  ];
  const recommendationResults = (type, offset) => Array.from({ length: 45 }, (_, index) => ({
    id: offset + index,
    type,
    genre_ids: [18],
    popularity: index
  }));
  const rows = await fetchPersonalizedRows({
    tamamlanan: [{ id: 900, type: 'tv' }],
    favoriler: [{ id: 901, type: 'movie' }],
    fallbackAdaylar,
    adet: 40,
    fetchRecommendationsFn: async (type, id) => recommendationResults(type, id === 900 ? 1000 : 1100),
    fetchDiscoverFn: async () => []
  });

  assert.equal(rows.sanaOzelFilmler.length, 40);
  assert.equal(rows.sanaOzelDiziler.length, 40);
  assert.equal(rows.seninIcin.length, 40);
  assert.equal(rows.tamamladiklarindanSonra.length, 40);
  assert.equal(rows.favorilerineGore.length, 40);
  assert.ok(rows.sanaOzelFilmler.every((item) => item.type === 'movie'));
  assert.ok(rows.sanaOzelDiziler.every((item) => item.type === 'tv'));
});

test('a sparse series pool is expanded with genre-based series discovery', async () => {
  const discoveredPages = [];
  const moviePool = Array.from({ length: 15 }, (_, index) => ({
    id: 300 + index,
    type: 'movie',
    genre_ids: [18],
    popularity: index
  }));
  const rows = await fetchPersonalizedRows({
    favoriler: [{ id: 999, type: 'movie', genre_ids: [18] }],
    fallbackAdaylar: moviePool,
    fetchRecommendationsFn: async () => [],
    fetchDiscoverFn: async ({ type, page }) => {
      discoveredPages.push({ type, page });
      return type === 'tv'
        ? Array.from({ length: 20 }, (_, index) => ({
          id: 400 + ((page - 1) * 20) + index,
          type: 'tv',
          genre_ids: [18],
          popularity: index
        }))
        : [];
    }
  });

  assert.deepEqual(
    discoveredPages.filter(({ type }) => type === 'tv').map(({ page }) => page),
    [1, 2]
  );
  assert.equal(rows.sanaOzelFilmler.length, 15);
  assert.equal(rows.sanaOzelDiziler.length, 40);
});

test('series discovery can fill the target without genre history', async () => {
  const discoveredPages = [];
  const rows = await fetchPersonalizedRows({
    fallbackAdaylar: Array.from({ length: 15 }, (_, index) => ({
      id: 500 + index,
      type: 'movie',
      genre_ids: [18]
    })),
    fetchRecommendationsFn: async () => [],
    fetchDiscoverFn: async ({ type, page }) => {
      discoveredPages.push({ type, page });
      return type === 'tv'
        ? Array.from({ length: 20 }, (_, index) => ({
          id: 600 + ((page - 1) * 20) + index,
          type: 'tv',
          genre_ids: [18]
        }))
        : [];
    }
  });

  assert.deepEqual(
    discoveredPages.filter(({ type }) => type === 'tv').map(({ page }) => page),
    [1, 2]
  );
  assert.equal(rows.sanaOzelDiziler.length, 40);
});

test('completed and favorite recommendation rows fetch another page when needed', async () => {
  const pages = [];
  const rows = await fetchPersonalizedRows({
    tamamlanan: [{ id: 701, type: 'tv' }],
    favoriler: [{ id: 702, type: 'movie' }],
    fetchRecommendationsFn: async (type, id, page) => {
      pages.push(`${id}:${page}`);
      const start = page === 1 ? 0 : 20;
      return Array.from({ length: 20 }, (_, index) => ({
        id: id * 100 + start + index,
        type,
        genre_ids: [18]
      }));
    },
    fetchDiscoverFn: async () => []
  });

  assert.ok(pages.includes('701:2'));
  assert.ok(pages.includes('702:2'));
  assert.equal(rows.tamamladiklarindanSonra.length, 40);
  assert.equal(rows.favorilerineGore.length, 40);
});
