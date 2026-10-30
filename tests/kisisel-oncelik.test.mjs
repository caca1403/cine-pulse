// KisiselMotor — içerik önceliği (zevk profili) testleri.
// Amaç: model EĞİTİLMEMİŞKEN bile tamamlanan geçmiş / favori / liste sinyalleri
// ana sayfa sıralamasını gerçekten değiştirsin (kullanıcı isteği 2026-10-30).
import { test } from 'node:test';
import assert from 'node:assert/strict';

// storage.js Node'da window/localStorage arar — sahte depo kur.
const depo = new Map();
globalThis.localStorage = {
  getItem: (k) => (depo.has(k) ? depo.get(k) : null),
  setItem: (k, v) => depo.set(k, String(v)),
  removeItem: (k) => depo.delete(k)
};
globalThis.window = { localStorage: globalThis.localStorage, addEventListener: () => {} };

const KORKU = '27', KOMEDI = '35';
const yaz = (key, dizi) => globalThis.localStorage.setItem(key, JSON.stringify(dizi));

// 18 bitmiş KORKU filmi + 2 favori + 4 liste (komedi) — HomeView seed deseniyle aynı.
const korkuFilmler = Array.from({ length: 18 }, (_, i) => ({
  id: 90000 + i, title: `Korku ${i}`, type: 'movie', genre_ids: [Number(KORKU)],
  completed: true, progressPercent: 100, lastWatchedAt: Date.now() - i * 3_600_000
}));
const favoriKomediler = [
  { id: 80001, title: 'F1', media_type: 'movie', genre_ids: [Number(KOMEDI)] },
  { id: 80002, title: 'F2', media_type: 'movie', genre_ids: [Number(KOMEDI)] }
];
const listeFilmler = [
  { id: 70001, title: 'L1', media_type: 'movie', genre_ids: [Number(KOMEDI)] },
  { id: 70002, title: 'L2', media_type: 'movie', genre_ids: [Number(KOMEDI)] }
];
yaz('sineflix_watch_history_v1', korkuFilmler);
yaz('sineflix_favorites_v1', favoriKomediler);
yaz('sineflix_watchlist_v1', listeFilmler);

const k = await import('../src/services/kisisel/kisiselMotor.js');

test('baglamKur tam geçmişi ve tamamlananları görür', () => {
  const b = k.baglamKur();
  assert.equal(b.gecmisIdler.size, 18);
  assert.equal(b.tamamlananIdler.size, 18);
  assert.equal(b.favoriIdler.size, 2);
  assert.equal(b.listeIdler.size, 2);
});

test('zevkOncelligi: tamamlanan(3x) favori(2x) liste(1x) ağırlıklandırır', () => {
  const p = k.zevkOncelligi(k.baglamKur());
  assert.ok(p.has(KORKU) && p.has(KOMEDI));
  assert.equal(p.get(KORKU), 1, '18×3 korku normalize 1 olmalı');
  assert.ok(p.get(KOMEDI) > 0 && p.get(KOMEDI) < 1, 'komedi daha düşük ağırlıklı');
});

test('model yokken bile aday sırası zevk profiline kayar', () => {
  k.motoruSifirla();
  const adaylar = [
    ...Array.from({ length: 6 }, (_, i) => ({ id: 500 + i, title: `K${i}`, genre_ids: [Number(KORKU)], popularity: 100 - i })),
    ...Array.from({ length: 6 }, (_, i) => ({ id: 600 + i, title: `C${i}`, genre_ids: [Number(KOMEDI)], popularity: 500 - i }))
  ];
  const { liste } = k.siralaAdaylar(adaylar, { kaynak: 'ana', adet: 12 });
  const ilk4 = liste.slice(0, 4).map((x) => String(x.oge.id));
  assert.ok(ilk4.every((id) => id.startsWith('5')), `ilk 4 korku olmalıydı, got: ${ilk4}`);
});

test('favori/liste yapıtı küçük bonusla yükselir', () => {
  k.motoruSifirla();
  const adaylar = [
    { id: 600, title: 'Komedi-Yuksek', genre_ids: [Number(KOMEDI)], popularity: 1000 },
    { id: 80001, title: 'Favori Komedi', genre_ids: [Number(KOMEDI)], popularity: 999 }
  ];
  const { liste } = k.siralaAdaylar(adaylar, { kaynak: 'ana', adet: 2 });
  assert.equal(String(liste[0].oge.id), '80001', 'favori, popülerlikte ~eşit rakibini geçmeli');
});

test('sinyal yoksa sıra popülerlik sigortasına düşer (bozuk değil)', async () => {
  for (const key of ['sineflix_watch_history_v1', 'sineflix_favorites_v1', 'sineflix_watchlist_v1']) globalThis.localStorage.removeItem(key);
  const { clearStorageCache } = await import('../src/services/altyapi/storage.js');
  clearStorageCache(); // modül içi önbellekler testi kirletmesin
  k.motoruSifirla();
  const adaylar = [
    { id: 1, title: 'A', genre_ids: [28], popularity: 10 },
    { id: 2, title: 'B', genre_ids: [35], popularity: 900 },
    { id: 3, title: 'C', genre_ids: [27], popularity: 500 }
  ];
  const { liste } = k.siralaAdaylar(adaylar, { kaynak: 'ana', adet: 3 });
  assert.equal(String(liste[0].oge.id), '2', 'sinyalsiz en popüler başa geçer');
});
