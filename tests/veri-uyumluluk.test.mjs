/* Veri uyumluluk sözleşmesi: mimari tamamen değişse de kullanıcı verisi
   (localStorage JSON) ESKİ anahtar ve şemayla kalır — güncelleme veri kaybı
   yaşatmaz (kullanıcı şartı 2026-10-19).
   Eski sürüm (v1.1.7x, src/services/storage.js) ile yeni (altyapi/storage.js)
   aynı anahtarları/yazar şekillerini kullanıyor; bu test onu kilitler. */
import { test } from 'node:test';
import assert from 'node:assert/strict';

const depo = new Map();
const saklama = {
  getItem: k => (depo.has(k) ? depo.get(k) : null),
  setItem: (k, v) => depo.set(k, String(v)),
  removeItem: k => depo.delete(k),
};
globalThis.window = { localStorage: saklama, dispatchEvent() {}, addEventListener() {} };
// Modül hem window.localStorage hem çıplak localStorage kullanıyor; ikisi de
// aynı sahte depoya bağlanmalı (aksi halde Node'un yerleşik deposu okunur).
Object.defineProperty(globalThis, 'localStorage', { value: saklama, configurable: true });

const ANAHTAR = 'sineflix_watch_history_v1';

// Eski sürümden çıkma, ek alanlı (genres/dil/ülke + bilinmeyen gelecek alan) kayıt.
const ESKI_KAYIT = {
  id: 603,
  title: 'Matrix',
  posterPath: '/x.jpg', poster_path: '/x.jpg',
  backdropPath: '/y.jpg', backdrop_path: '/y.jpg',
  type: 'movie', isAnime: false, isSeries: false,
  genres: [{ id: 878, name: 'Bilim Kurgu' }], genre_ids: [878],
  original_language: 'en', origin_country: ['US'],
  season: 1, episode: 1,
  currentTime: 5400, duration: 8100, progressPercent: 66,
  completed: false, lastWatchedAt: 1760000000000,
  gelecek_alan: 'korunmali', // eski sürümde olmayan alan: yazımda SİLİNMEMELİ
};
depo.set(ANAHTAR, JSON.stringify([ESKI_KAYIT]));

const s = await import('../src/services/altyapi/storage.js');

test('eski JSON aynı anahtarla okunur: ilerleme ve izlendi durumu görünür', () => {
  const p = s.getMediaProgress(603, 1, 1);
  assert.ok(p, 'eski kayıt okunmalı');
  assert.equal(p.progressPercent, 66);
  assert.equal(p.completed, false);
  assert.equal(s.isMediaWatched(603, 1, 1), false);
  assert.equal(depo.get(ANAHTAR) ? true : false, true, 'anahtar adı değişmemeli: sineflix_watch_history_v1');
});

test('tek-yazar yazımı ek alanları korur (geriye dönük şekil)', () => {
  s.markEpisodeWatched(603, 1, 1, true, { title: 'Matrix', type: 'movie' });
  const kayit = s.getWatchHistory().find(x => x.id == 603);
  assert.ok(kayit, 'kayıt güncellenmeli');
  assert.equal(kayit.completed, true);
  for (const alan of ['genres', 'genre_ids', 'original_language', 'origin_country', 'gelecek_alan']) {
    assert.ok(alan in kayit, `${alan} alanı silinmemeli`);
  }
  assert.deepEqual(kayit.genre_ids, [878]);
  assert.equal(kayit.gelecek_alan, 'korunmali');
});

test('toplu-yazar yazımı eski disk şemasıyla birebir aynı alanları yazar', () => {
  s.markSeasonEpisodesWatched(999, 2, 3, true, { title: 'Toplu', type: 'tv' });
  const ham = JSON.parse(depo.get(ANAHTAR));
  const kayit = ham.find(x => x.id == 999 && x.episode === 1);
  assert.ok(kayit, 'toplu yazım diske düşmeli');
  const beklenen = ['id', 'title', 'posterPath', 'poster_path', 'backdropPath', 'backdrop_path',
    'type', 'isAnime', 'isSeries', 'season', 'episode', 'currentTime', 'duration',
    'progressPercent', 'completed', 'lastWatchedAt'];
  assert.deepEqual(Object.keys(kayit).sort(), [...beklenen].sort(), 'eski sürümün alan kümesi birebir korunmalı');
  assert.equal(kayit.season, 2);
  assert.equal(kayit.progressPercent, 100);
});