/* ==========================================================================
   "Kanalım" programlama motoru — saf (node:test) testleri.
   Çalıştır: node --test tests/channel-scheduler.test.mjs
   Ağ yok, DOM yok, localStorage yok: tüm girdiler fixture.
   ========================================================================== */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  kanalProgramla,
  kanalProgramlaAsync,
  yayindakiSlot,
  mulberry32
} from '../src/services/channelScheduler.js';

/* --- Yardımcılar --------------------------------------------------------- */
// 18 Dram, 35 Komedi, 28 Aksiyon, 878 Bilim Kurgu
const TURLER = [18, 35, 28, 878];

// id 1..n; türleri sırayla dağıtılmış izleme geçmişi üretir.
function gecmisUret(n = 12, turler = TURLER) {
  const liste = [];
  for (let i = 1; i <= n; i++) {
    liste.push({
      id: i,
      title: `İçerik ${i}`,
      type: i % 3 === 0 ? 'movie' : 'tv',
      genre_ids: [turler[(i - 1) % turler.length]],
      season: 1,
      episode: 1,
      lastWatchedAt: Date.now()
    });
  }
  return liste;
}

const idler = (program) => program.map((s) => s.tmdbId);

/* --- 1) Determinizm / tohum --------------------------------------------- */
test('determinizm: aynı girdi + aynı tohum birebir aynı programı verir', () => {
  const girdi = {
    gecmis: gecmisUret(12),
    favoriler: [{ id: 3, title: 'Fav 3', genre_ids: [18] }],
    watchlist: [{ id: 9, title: 'Liste 9', genre_ids: [28] }],
    saatKovasi: 21,
    uzunlukDk: 90,
    maxSlot: 6
  };
  const a = kanalProgramla({ ...girdi, tohum: 42 });
  const b = kanalProgramla({ ...girdi, tohum: 42 });
  assert.deepStrictEqual(a, b, 'aynı tohum aynı programı üretmeli');
  assert.ok(a.length > 0, 'program boş olmamalı');
});

test('determinizm: farklı tohum farklı sıra üretir', () => {
  const girdi = { gecmis: gecmisUret(12), favoriler: [], watchlist: [], saatKovasi: 20, maxSlot: 6 };
  const temel = JSON.stringify(kanalProgramla({ ...girdi, tohum: 1 }));
  let farkliVar = false;
  for (let t = 2; t <= 25; t++) {
    if (JSON.stringify(kanalProgramla({ ...girdi, tohum: t })) !== temel) { farkliVar = true; break; }
  }
  assert.ok(farkliVar, 'farklı tohumlardan en az biri farklı sıra üretmeli');
});

test('mulberry32: aynı tohum aynı diziyi, farklı tohum farklı dizi üretir', () => {
  const d1 = Array.from({ length: 5 }, mulberry32(7));
  const d2 = Array.from({ length: 5 }, mulberry32(7));
  const d3 = Array.from({ length: 5 }, mulberry32(8));
  assert.deepStrictEqual(d1, d2);
  assert.notDeepStrictEqual(d1, d3);
  assert.ok(d1.every((x) => x >= 0 && x < 1));
});

/* --- 2) Favori 2x ağırlık ----------------------------------------------- */
test('favori 2x ağırlık: favori içerik ortalamanın üzerinde slot alır (200 tohum)', () => {
  // Tüm kayıtlar aynı türde: fark yalnızca favori çarpanından gelmeli.
  const gecmis = gecmisUret(12, [18]);
  const favoriId = '7';
  const favoriler = [{ id: 7, title: 'Favori 7', genre_ids: [18] }];

  const sayim = new Map();
  const tohumSayisi = 200;
  for (let t = 1; t <= tohumSayisi; t++) {
    const program = kanalProgramla({ gecmis, favoriler, watchlist: [], saatKovasi: 21, tohum: t, maxSlot: 4 });
    for (const id of new Set(idler(program))) sayim.set(id, (sayim.get(id) || 0) + 1);
  }

  const favoriOran = (sayim.get(favoriId) || 0) / tohumSayisi;
  const tumIdler = gecmis.map((g) => String(g.id));
  const ortalama = tumIdler.reduce((s, id) => s + (sayim.get(id) || 0) / tohumSayisi, 0) / tumIdler.length;
  assert.ok(favoriOran > ortalama, `favori oranı (${favoriOran.toFixed(3)}) > ortalama (${ortalama.toFixed(3)})`);
});

/* --- 3) Tekilleştirme (dedupe) ------------------------------------------ */
test('dedupe: aynı tmdbId program içinde en fazla bir kez çıkar', () => {
  const id = 5;
  const gecmis = [
    { id, title: 'Tekrar 5', genre_ids: [18] },
    { id, title: 'Tekrar 5 b', genre_ids: [35] },
    ...gecmisUret(10)
  ];
  const favoriler = [{ id, title: 'Tekrar 5', genre_ids: [18] }];
  const watchlist = [{ id, title: 'Tekrar 5', genre_ids: [18] }];
  for (let t = 1; t <= 30; t++) {
    const program = kanalProgramla({ gecmis, favoriler, watchlist, saatKovasi: 21, tohum: t, maxSlot: 8 });
    const liste = idler(program);
    assert.equal(new Set(liste).size, liste.length, 'tmdbId tekrar etmemeli');
  }
});

/* --- 4) Boş / geçersiz girdi -------------------------------------------- */
test('boş girdi: [] döner, neden havuz-bos, çökme yok', () => {
  const sonuc = kanalProgramla();
  assert.ok(Array.isArray(sonuc));
  assert.equal(sonuc.length, 0);
  assert.deepStrictEqual(sonuc, []);
  assert.equal(sonuc.neden, 'havuz-bos');
  assert.equal(kanalProgramla({ gecmis: [], favoriler: [], watchlist: [] }).length, 0);
  assert.equal(kanalProgramla({ gecmis: null, favoriler: undefined, watchlist: 'x' }).length, 0);
});

test("tmdbId'siz kayıtlar atlanır, geçerli kayıt programa girer", () => {
  const gecmis = [
    {},
    { id: null, title: 'Boş id' },
    { id: 'abc', title: 'Sayısal değil' },
    { id: 5, title: 'Geçerli', genre_ids: [18] }
  ];
  const program = kanalProgramla({ gecmis, favoriler: [], watchlist: [], saatKovasi: 21, tohum: 1, maxSlot: 8 });
  assert.equal(program.length, 1);
  assert.equal(program[0].tmdbId, '5');
  assert.equal(program[0].ad, 'Geçerli');
});

/* --- 5) Tür çeşitliliği (ardışık aynı tür yok) -------------------------- */
test('çeşitlilik: 3+ türde ardışık iki slot aynı tür olmaz', () => {
  const gecmis = gecmisUret(30, [18, 35, 28]); // her türden 10 kayıt
  for (let t = 1; t <= 40; t++) {
    const program = kanalProgramla({ gecmis, favoriler: [], watchlist: [], saatKovasi: 21, tohum: t, maxSlot: 6 });
    assert.ok(program.length >= 2);
    for (let i = 1; i < program.length; i++) {
      assert.notEqual(program[i].tur, program[i - 1].tur, `slot ${i} ve ${i - 1} aynı tür olamaz`);
    }
  }
});

/* --- 6) yayindakiSlot (doğru slot + wrap-around) ------------------------ */
test('yayindakiSlot: doğru slotu seçer ve program sonunda başa sarar', () => {
  const program = [
    { slotNo: 0, baslangucDk: 0, ad: 'A', tur: 'Dram', tip: 'film', tmdbId: '1' },
    { slotNo: 1, baslangucDk: 90, ad: 'B', tur: 'Komedi', tip: 'film', tmdbId: '2' },
    { slotNo: 2, baslangucDk: 180, ad: 'C', tur: 'Aksiyon', tip: 'dizi', tmdbId: '3' }
  ];
  assert.equal(yayindakiSlot(program, 100).simdi.ad, 'B');
  assert.equal(yayindakiSlot(program, 100).sonraki.ad, 'C');
  assert.equal(yayindakiSlot(program, 200).simdi.ad, 'C');
  assert.equal(yayindakiSlot(program, 200).sonraki.ad, 'A'); // wrap
  assert.equal(yayindakiSlot(program, 300).simdi.ad, 'A');   // 300 % 270 = 30
  assert.equal(yayindakiSlot(program, 0).simdi.ad, 'A');
  const bos = yayindakiSlot([], 100);
  assert.equal(bos.simdi, null);
  assert.equal(bos.sonraki, null);
});

test('yayindakiSlot: scheduler çıktısıyla tutarlı (gerçek program)', () => {
  const program = kanalProgramla({ gecmis: gecmisUret(8), favoriler: [], watchlist: [], saatKovasi: 21, tohum: 3, maxSlot: 5 });
  assert.ok(program.length >= 2);
  const aktif = yayindakiSlot(program, program[1].baslangucDk + 1);
  assert.equal(aktif.simdi.tmdbId, program[1].tmdbId);
  assert.equal(aktif.sonraki.tmdbId, program[2] ? program[2].tmdbId : program[0].tmdbId);
  assert.ok(program[1].baslangucDk - program[0].baslangucDk > 0);
});

/* --- 7) Enjekte edilebilir async fallback (ağ yok, mock) ---------------- */
test('kanalProgramlaAsync: fallback havuzu enjekte edilir, ağ çağrısı yapılmaz', async () => {
  let cagrildi = false;
  const mockFallback = async ({ mevcutIdler }) => {
    cagrildi = true;
    assert.ok(mevcutIdler instanceof Set);
    return gecmisUret(6).map((x) => ({ ...x, title: `Fallback ${x.id}` }));
  };
  const program = await kanalProgramlaAsync({
    gecmis: [], favoriler: [], watchlist: [], saatKovasi: 21, tohum: 7, maxSlot: 5, fallbackHavuzu: mockFallback
  });
  assert.equal(cagrildi, true, 'çekirdek havuz boşken fallback çağrılmalı');
  assert.ok(program.length > 0, 'fallback havuzundan program üretilmeli');
});

test('kanalProgramlaAsync: fallback hata verirse çekirdek havuzla devam eder', async () => {
  const kirikFallback = async () => { throw new Error('ağ yok'); };
  const program = await kanalProgramlaAsync({
    gecmis: gecmisUret(4), favoriler: [], watchlist: [], saatKovasi: 21, tohum: 2, maxSlot: 4, fallbackHavuzu: kirikFallback
  });
  assert.ok(program.length > 0, 'hata olsa bile çekirdek havuzdan program üretilmeli');
});
