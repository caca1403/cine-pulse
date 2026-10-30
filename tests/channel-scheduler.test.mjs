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
} from '../src/services/canli/channelScheduler.js';

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

/* ==========================================================================
   KANALIM v2 — KUŞAK MOTORU / BİNGE / PRESET / RUH HALİ / EPG YARDIMCILARI
   (Yalnızca EKLEME: yukarıdaki 12 v1 testine dokunulmadı.)
   Yine saf + deterministik + ağsız: tüm girdiler fixture.
   ========================================================================== */
import {
  KUSAKLAR, kusakBul, kusakEtiket, kusakBaslangicDk, sonrakiKusakBaslangicDk,
  slotSuresiDk, kusakTurCarpani, sonrakiBolumHesapla,
  KANAL_PRESETLERI, kanalTanima, kanalSluglari, presetTurCarpani, presetHavuz,
  RUH_HALLERI, ruhHaliTanimi, ruhHaliCarpani,
  kanalProgramlaV2, kanalProgramlaV2Async, kacirdiklarim, hatirlatmaAdaylari,
  kanalRehberiMetni, kanalIstatistik, dkMetni, GUN_DK
} from '../src/services/canli/channelScheduler.js';
import { kanalSaatTicker, kanalAktifTimerSayisi } from '../src/services/canli/kanalSaat.js';

/* --- v2 yardımcıları ---------------------------------------------------- */
// Film/dizi karışık, kusaklara yayılan sabit fixture havuzu.
function v2HavuzUret(n = 10, turler = [18, 35, 28, 878]) {
  const liste = [];
  for (let i = 1; i <= n; i++) {
    const diziMi = i % 3 !== 0;
    liste.push({
      id: i,
      title: `V2 İçerik ${i}`,
      type: diziMi ? 'tv' : 'movie',
      genre_ids: [turler[(i - 1) % turler.length]],
      ...(diziMi ? { season: 1, episode: 2 } : {}),
      lastWatchedAt: 1700000000000
    });
  }
  return liste;
}

const v2Program = (ek = {}) => kanalProgramlaV2({
  gecmis: v2HavuzUret(10), slug: 'kendi', simdiDk: 8 * 60 + 24, tohum: 7, maxSlot: 16, ...ek
});

/* --- 8) Kuşak sınırları ------------------------------------------------ */
test('kuşak sınırları: 06/12/17/00 sınırları tam sınırda doğru kuşağa düşer', () => {
  assert.equal(kusakBul(0).ad, 'gece');
  assert.equal(kusakBul(359).ad, 'gece');
  assert.equal(kusakBul(360).ad, 'sabah');
  assert.equal(kusakBul(719).ad, 'sabah');
  assert.equal(kusakBul(720).ad, 'ogleden');
  assert.equal(kusakBul(1019).ad, 'ogleden');
  assert.equal(kusakBul(1020).ad, 'prime');
  assert.equal(kusakBul(1439).ad, 'prime');
  // Dışarıdan enjekte edilen "şimdi" taşabilir/negatif olabilir → mod ile güvenli.
  assert.equal(kusakBul(1440 + 360).ad, 'sabah');
  assert.equal(kusakBul(-1).ad, 'prime');
  assert.equal(kusakBul('abc').ad, 'gece');
  assert.equal(KUSAKLAR.length, 4);
  assert.equal(kusakBaslangicDk(500), 360);
  assert.equal(sonrakiKusakBaslangicDk('gece'), 360);
  assert.equal(sonrakiKusakBaslangicDk('prime'), 0); // gün sonunda başa sarar
  assert.equal(kusakEtiket('prime'), 'Prime Time');
  assert.equal(kusakEtiket(360), 'Sabah');
  assert.equal(dkMetni(504), '08:24');
  assert.equal(dkMetni(GUN_DK), '00:00');
});

test('kuşak çarpan yönü: prime dram/aksiyon, gece belgesel, sabah çocuk/çizgi ağır', () => {
  // Prime kuşağı dram/aksiyonu öne çıkarır...
  assert.ok(kusakTurCarpani('prime', ['Dram']) > kusakTurCarpani('gece', ['Dram']));
  assert.ok(kusakTurCarpani('prime', ['Aksiyon']) > kusakTurCarpani('sabah', ['Aksiyon']));
  // ...gece belgesel/klasik ağır basar...
  assert.ok(kusakTurCarpani('gece', ['Belgesel']) > kusakTurCarpani('prime', ['Belgesel']));
  assert.ok(kusakTurCarpani('gece', ['Tarih']) > kusakTurCarpani('sabah', ['Tarih']));
  // ...sabah çocuk/çizgi ağır basar.
  assert.ok(kusakTurCarpani('sabah', ['Animasyon']) > kusakTurCarpani('prime', ['Animasyon']));
  assert.ok(kusakTurCarpani('sabah', ['Çocuk']) > kusakTurCarpani('gece', ['Çocuk']));
  // Çarpanlar türler arası EN YÜKSEK alınır; bilinmeyen kuşak nötr.
  assert.equal(kusakTurCarpani('prime', ['Dram', 'Belgesel']), kusakTurCarpani('prime', ['Dram']));
  assert.equal(kusakTurCarpani('olmayan', ['Dram']), 1);
  assert.equal(kusakTurCarpani('prime', []), KUSAKLAR.find((k) => k.ad === 'prime').varsayilan);
  // Tip bazlı süre: film 120' / dizi 45', uzunlukDk override olarak kalır.
  assert.equal(slotSuresiDk('film'), 120);
  assert.equal(slotSuresiDk('dizi'), 45);
  assert.equal(slotSuresiDk('film', 90), 90);
  assert.equal(slotSuresiDk('dizi', 30), 30);
  assert.equal(slotSuresiDk('film', 0), 120);
  assert.equal(slotSuresiDk('dizi', -5), 45);
  assert.equal(slotSuresiDk('dizi', 'abc'), 45);
  assert.equal(slotSuresiDk(null), 120);
});

test('program kuşak hizalı: slotlar kuşak sınırını geçmez, süreler tip bazlıdır', () => {
  for (let t = 1; t <= 40; t++) {
    const simdi = (t * 37) % GUN_DK;
    const p = v2Program({ tohum: t, simdiDk: simdi });
    assert.ok(p.length > 0, `tohum ${t} boş program üretmemeli`);
    assert.equal(p[0].baslangucDk, kusakBaslangicDk(simdi), 'program kuşağın başında başlar');
    for (let i = 0; i < p.length; i++) {
      const s = p[i];
      const k = kusakBul(s.baslangucDk);
      assert.equal(s.kusak, k.ad, 'slot kuşak etiketi tutarlı olmalı');
      assert.equal(s.kusakEtiket, k.etiket);
      assert.ok(s.bitisDk <= k.bitisDk, 'slot kuşak sınırını geçmemeli');
      assert.equal(s.bitisDk - s.baslangucDk, s.sureDk);
      assert.ok(s.sureDk > 0 && s.sureDk <= slotSuresiDk(s.tip), 'süre tip bazlı ve pozitif olmalı');
      if (!s.kisitli) assert.equal(s.sureDk, slotSuresiDk(s.tip), 'kısıtsız slot tam süreyi almalı');
      if (i > 0) {
        assert.ok(s.baslangucDk >= p[i - 1].bitisDk, 'slotlar üst üste binmemeli');
        assert.ok(s.baslangucDk - p[i - 1].bitisDk < 20, 'kuşak kırpması boşluğu eşiğin altında olmalı');
      }
      assert.ok(s.baslangucDk >= 0 && s.baslangucDk < GUN_DK);
    }
    assert.ok(p[p.length - 1].baslangucDk < GUN_DK);
  }
});

/* --- 9) Kaldığı yer (sonrakiBolum) --------------------------------------- */
test('sonrakiBolum: kural bölüm+1; sezon/bölüm yoksa null (slot\'a yazılmaz)', () => {
  assert.deepStrictEqual(sonrakiBolumHesapla({ sezon: 2, bolum: 5 }), { sezon: 2, bolum: 6 });
  assert.deepStrictEqual(sonrakiBolumHesapla({ sezon: 1, bolum: 1 }), { sezon: 1, bolum: 2 });
  assert.equal(sonrakiBolumHesapla({}), null);
  assert.equal(sonrakiBolumHesapla(), null);
  assert.equal(sonrakiBolumHesapla({ sezon: 0, bolum: 3 }), null);
  assert.equal(sonrakiBolumHesapla({ sezon: 1, bolum: 'x' }), null);

  // Slot'a yazılan sonrakiBolum: kayıt S1B4 → yayın S1B5, sonraki S1B6.
  const gecmis = [{ id: 1, title: 'Tek Dizi', type: 'tv', genre_ids: [18], season: 1, episode: 4 }];
  const p = kanalProgramlaV2({ gecmis, slug: 'kendi', simdiDk: 700, tohum: 3, maxSlot: 1 });
  assert.equal(p[0].tip, 'dizi');
  assert.equal(p[0].sezon, 1);
  assert.equal(p[0].bolum, 5);
  assert.deepStrictEqual(p[0].sonrakiBolum, { sezon: 1, bolum: 6 });

  // season/episode taşımayan kayıtta sonrakiBolum YAZILMAZ (dürüstlük).
  const filmsiz = [{ id: 2, title: 'Sadece Film', type: 'movie', genre_ids: [18] }];
  const p2 = kanalProgramlaV2({ gecmis: filmsiz, slug: 'kendi', simdiDk: 700, tohum: 3, maxSlot: 1 });
  assert.equal(p2[0].tip, 'film');
  assert.equal('sonrakiBolum' in p2[0], false);
});

test('sonrakiBolum: sezon finali → sezon+1/bölüm 1; son sezon sonunda mevcut bölümde kalır', () => {
  // Sezon finali biliniyor → yeni sezonun 1. bölümü.
  assert.deepStrictEqual(sonrakiBolumHesapla({ sezon: 1, bolum: 12, sezonBolumSayisi: 12 }), { sezon: 2, bolum: 1 });
  // Aynı anda dizi sınırı da dolduysa üst sınır yok → dürüstçe mevcut bölümde kal.
  assert.deepStrictEqual(
    sonrakiBolumHesapla({ sezon: 3, bolum: 8, sezonBolumSayisi: 8, sezonSayisi: 3 }),
    { sezon: 3, bolum: 8 }
  );
  // Sezon 3/8 sonrası, dizi daha var → sezon 4 normal devam.
  assert.deepStrictEqual(
    sonrakiBolumHesapla({ sezon: 3, bolum: 8, sezonBolumSayisi: 8, sezonSayisi: 6 }),
    { sezon: 4, bolum: 1 }
  );

  // Uçtan uca: kayıt sezon finalinde (S1B5/5 bölüm) → yayın S1B5, sonraki S2B1.
  const gecmis = [{
    id: 1, title: 'Final Dizisi', type: 'tv', genre_ids: [18],
    season: 1, episode: 4, seasons: [{ episode_count: 5 }]
  }];
  const p = kanalProgramlaV2({ gecmis, slug: 'kendi', simdiDk: 700, tohum: 5, maxSlot: 1 });
  assert.equal(p[0].sezon, 1);
  assert.equal(p[0].bolum, 5);
  assert.deepStrictEqual(p[0].sonrakiBolum, { sezon: 2, bolum: 1 });
});

/* --- 10) Binge ---------------------------------------------------------- */
test('binge: aynı seri art arda en fazla 3 slot, bingeNo 1..3, kuşak değiştirmez', () => {
  for (let t = 1; t <= 40; t++) {
    const p = v2Program({ tohum: t });
    // Ardışık aynı seri koşusu en fazla 3 slot.
    let kosu = 1;
    for (let i = 1; i < p.length; i++) {
      if (p[i].tmdbId === p[i - 1].tmdbId) kosu += 1;
      else kosu = 1;
      assert.ok(kosu <= 3, `tohum ${t}: binge 3 slotu aştı (slot ${i})`);
    }
    // bingeNo yalnız dizilerde ve 1..3 aralığında.
    for (const s of p) {
      if (s.tip !== 'dizi') { assert.equal('bingeNo' in s, false); continue; }
      assert.ok(Number.isInteger(s.bingeNo), 'dizi slotunda bingeNo olmalı');
      assert.ok(s.bingeNo >= 1 && s.bingeNo <= 3, `bingeNo 1..3 olmalı: ${s.bingeNo}`);
    }
    // Bir döngüde aynı içerik en fazla 3 kez (yalnız binge bloğunda) çıkar.
    const gecen = new Map();
    for (const s of p) {
      const anahtar = `${s.dongu}:${s.tmdbId}`;
      gecen.set(anahtar, (gecen.get(anahtar) || 0) + 1);
      assert.ok(gecen.get(anahtar) <= 3, `dongu ${s.dongu} içinde ${s.ad} 3'ten fazla çıktı`);
    }
    // Aynı içerik tek bir ardışık blokta yer alır (dağınık tekrar yok).
    const baslanmis = new Set();
    for (let i = 0; i < p.length; i++) {
      const anahtar = `${p[i].dongu}:${p[i].tmdbId}`;
      if (i > 0 && p[i].tmdbId === p[i - 1].tmdbId) continue;
      assert.equal(baslanmis.has(anahtar), false, `${p[i].ad} iki ayrı blokta göründü`);
      baslanmis.add(anahtar);
    }
    // Binge bloğu kuşak değiştirmez (blok bir kuşak içinde kalır).
    for (let i = 1; i < p.length; i++) {
      if (p[i].tmdbId === p[i - 1].tmdbId) assert.equal(p[i].kusak, p[i - 1].kusak);
    }
  }
});

test('çeşitlilik istisnası: aynı tür ardışık yalnız binge devamında, istisna işaretli', () => {
  let istisnaSayisi = 0;
  for (let t = 1; t <= 40; t++) {
    const p = v2Program({ tohum: t });
    for (let i = 1; i < p.length; i++) {
      const a = p[i - 1];
      const b = p[i];
      if (a.tur !== b.tur) continue;
      if (a.tmdbId !== b.tmdbId) continue; // farklı içerik, aynı tür: kabul
      // AYNI İÇERİK + aynı tür → yalnız binge istisnası olabilir.
      assert.ok(b.tip === 'dizi', 'aynı içerik tekrarı yalnız dizi binge olabilir');
      assert.ok(b.bingeNo >= 2, 'binge devamı bingeNo>=2 olmalı');
      assert.equal(b.bingeIstisnasi, true, 'çeşitlilik kuralını yıkan slot işaretlenmeli');
      istisnaSayisi += 1;
    }
    // Binge olmayan ardışık iki slot aynı içeriği paylaşamaz.
    for (let i = 1; i < p.length; i++) {
      if (p[i].tmdbId === p[i - 1].tmdbId && !p[i].bingeIstisnasi) {
        assert.fail('binge dışı aynı içerik tekrarı üretilmemeli');
      }
    }
  }
  assert.ok(istisnaSayisi > 0, 'fixture binge üretmeli (istisna kuralı fiilen denenmeli)');
});

test('binge: bölümler ilerler (kaldığı yer) ve kuşak değişince blok biter', () => {
  const gecmis = [{ id: 1, title: 'Dizi', type: 'tv', genre_ids: [18], season: 1, episode: 1 }];
  const p = kanalProgramlaV2({ gecmis, slug: 'kendi', simdiDk: 360, tohum: 2, maxSlot: 12 });
  const diziler = p.filter((s) => s.tip === 'dizi' && s.tmdbId === '1');
  assert.ok(diziler.length >= 2, 'tek dizi havuzu binge yapmalı');
  // İlk ardışık blok bölümleri kesintisiz ilerler (S1B2 → S1B3 → S1B4).
  const ilkBlok = [];
  for (const s of diziler) {
    if (ilkBlok.length) {
      const onceki = diziler[ilkBlok.length - 1];
      if (s.baslangucDk !== onceki.bitisDk || s.dongu !== onceki.dongu) break;
    }
    ilkBlok.push(s);
  }
  assert.ok(ilkBlok.length >= 2, 'ilk binge bloğu en az 2 slot olmalı');
  assert.deepStrictEqual(
    ilkBlok.map((s) => s.bolum),
    ilkBlok.map((_, i) => ilkBlok[0].bolum + i),
    'bölümler kesintisiz ilerlemeli'
  );
  assert.equal(ilkBlok[0].sezon, 1);
  // Kuşak değişince yeni blok başlar (binge kuşak sınırını geçmez).
  for (const s of diziler) assert.equal(s.kusak, ilkBlok[0].kusak);
  // Akış döndüğünde (dongu) bölüm BAŞA SARMAZ, kaldığı yerden devam eder.
  for (let i = 1; i < diziler.length; i++) {
    assert.equal(diziler[i].bolum, diziler[i - 1].bolum + 1, `dongu sonrası bölüm sarmalı: ${diziler[i].ad}`);
  }
});

/* --- 11) Çoklu kanal (slug izolasyonu) ---------------------------------- */
test('slug izolasyonu: preset havuzları ayrışır, bilinmeyen slug "kendi"ye düşer', () => {
  const havuz = [
    { id: 1, genre_ids: [16] },  // Animasyon
    { id: 2, genre_ids: [99] },  // Belgesel
    { id: 3, genre_ids: [28] },  // Aksiyon
    { id: 4, genre_ids: [18] }   // Dram
  ];
  assert.deepStrictEqual(presetHavuz('cizgi', havuz).map((x) => x.id), [1]);
  assert.deepStrictEqual(presetHavuz('belgesel', havuz).map((x) => x.id), [2]);
  assert.deepStrictEqual(presetHavuz('aksiyon', havuz).map((x) => x.id), [3]);
  assert.equal(presetHavuz('kendi', havuz).length, 4, 'kendi kanalı filtresizdir (v1 davranışı)');
  // Belgesel kanalı 25/990 ağırlıklı: bu kimlikler de kabul edilir.
  const ozel = [{ id: 9, genre_ids: [25] }, { id: 10, genre_ids: [990] }, { id: 11, genre_ids: [18] }];
  assert.deepStrictEqual(presetHavuz('belgesel', ozel).map((x) => x.id), [9, 10]);
  // Filtre hiç eşleşmezse havuz olduğu gibi döner (program hep doğar, atma yok).
  assert.equal(presetHavuz('cizgi', [{ id: 11, genre_ids: [18] }]).length, 1);
  assert.equal(presetHavuz(null, havuz).length, 4);
  assert.equal(presetHavuz('olmayan', null).length, 0);

  assert.equal(kanalTanima('kendi').slug, 'kendi');
  assert.equal(kanalTanima('OLMAYAN').slug, 'kendi');
  assert.equal(kanalTanima(null).slug, 'kendi');
  assert.deepStrictEqual(kanalSluglari(), ['kendi', 'cizgi', 'belgesel', 'aksiyon']);
  // Her slug'ın tohumu izole ve benzersiz.
  const tohumlar = KANAL_PRESETLERI.map((x) => x.varsayilanTohum);
  assert.equal(new Set(tohumlar).size, tohumlar.length, 'preset tohumları benzersiz olmalı');
  assert.ok(presetTurCarpani('cizgi', ['Animasyon']) > presetTurCarpani('aksiyon', ['Animasyon']));
  assert.ok(presetTurCarpani('aksiyon', ['Aksiyon']) > presetTurCarpani('belgesel', ['Aksiyon']));
  assert.equal(presetTurCarpani('kendi', ['Dram']), 1);
});

test('slug izolasyonu: farklı kanal aynı girdi+tohumda farklı program üretir', () => {
  const gecmis = [
    { id: 1, title: 'Animasyon', type: 'tv', genre_ids: [16], season: 1, episode: 1 },
    { id: 2, title: 'Belgesel', type: 'movie', genre_ids: [99] },
    { id: 3, title: 'Aksiyon', type: 'movie', genre_ids: [28] },
    { id: 4, title: 'Dram', type: 'tv', genre_ids: [18], season: 1, episode: 1 },
    { id: 5, title: 'Bilim Kurgu', type: 'movie', genre_ids: [878] }
  ];
  const cizgi = kanalProgramlaV2({ gecmis, slug: 'cizgi', simdiDk: 360, tohum: 11, maxSlot: 8 });
  const aksiyon = kanalProgramlaV2({ gecmis, slug: 'aksiyon', simdiDk: 360, tohum: 11, maxSlot: 8 });
  const kendi = kanalProgramlaV2({ gecmis, slug: 'kendi', simdiDk: 360, tohum: 11, maxSlot: 8 });
  assert.ok(cizgi.length > 0 && aksiyon.length > 0 && kendi.length > 0);
  // Çizgi kanalındaki her içerik animasyon/çocuk/aile türünde olmalı.
  for (const s of cizgi) {
    assert.deepStrictEqual(presetHavuz('cizgi', [{ genre_ids: [16] }]).length, 1);
    assert.ok(['Animasyon', 'Çocuk', 'Aile'].includes(s.tur), `çizgi kanalında yabancı tür: ${s.tur}`);
  }
  const turler = (p) => p.map((s) => s.tur).join('|');
  assert.notStrictEqual(turler(cizgi), turler(aksiyon), 'kanallar birbirinden ayrışmalı');
  // Determinizm: aynı slug+tohum → birebir aynı program.
  assert.deepStrictEqual(
    kanalProgramlaV2({ gecmis, slug: 'cizgi', simdiDk: 360, tohum: 11, maxSlot: 8 }),
    cizgi
  );
});

/* --- 12) Ruh hali ------------------------------------------------------- */
test('ruh hali bias yönü: eğlence→komedi, gerilim→korku, klasik→belgesel', () => {
  assert.ok(ruhHaliCarpani('eglence', ['Komedi']) > ruhHaliCarpani('gerilim', ['Komedi']));
  assert.ok(ruhHaliCarpani('gerilim', ['Korku']) > ruhHaliCarpani('eglence', ['Korku']));
  assert.ok(ruhHaliCarpani('duygu', ['Dram']) > ruhHaliCarpani('gerilim', ['Dram']));
  assert.ok(ruhHaliCarpani('klasik', ['Belgesel']) > ruhHaliCarpani('eglence', ['Belgesel']));
  assert.equal(ruhHaliCarpani(null, ['Komedi']), 1, 'ruh hali yoksa nötr');
  assert.equal(ruhHaliCarpani('olmayan', ['Komedi']), 1, 'bilinmeyen ruh hali nötr');
  assert.equal(ruhHaliTanimi('temizle'), null);
  assert.equal(ruhHaliTanimi('EGLENCE').slug, 'eglence');
  assert.deepStrictEqual(RUH_HALLERI.map((r) => r.slug), ['eglence', 'duygu', 'gerilim', 'klasik']);
});

test('ruh hali programı değiştirir: aynı girdi+tohum, farklı bias (deterministik)', () => {
  const gecmis = [
    ...[1, 2, 3, 4].map((i) => ({ id: i, title: `Komedi ${i}`, type: 'movie', genre_ids: [35] })),
    { id: 5, title: 'Korku', type: 'movie', genre_ids: [27] },
    { id: 6, title: 'Gerilim', type: 'movie', genre_ids: [53] },
    { id: 7, title: 'Belgesel', type: 'movie', genre_ids: [99] }
  ];
  const ilkSlotTuru = (ruhHali, tohum) => kanalProgramlaV2({
    gecmis, slug: 'kendi', ruhHali, simdiDk: 360, tohum, maxSlot: 1
  })[0].tur;
  let komediEglence = 0;
  let komediGerilim = 0;
  let belgeselKlasik = 0;
  let belgeselEglence = 0;
  for (let t = 1; t <= 120; t++) {
    if (ilkSlotTuru('eglence', t) === 'Komedi') komediEglence += 1;
    if (ilkSlotTuru('gerilim', t) === 'Komedi') komediGerilim += 1;
    if (ilkSlotTuru('klasik', t) === 'Belgesel') belgeselKlasik += 1;
    if (ilkSlotTuru('eglence', t) === 'Belgesel') belgeselEglence += 1;
  }
  assert.ok(komediEglence > komediGerilim, `eğlencede komedi ağır olmalı (${komediEglence} > ${komediGerilim})`);
  assert.ok(belgeselKlasik > belgeselEglence, `klasikte belgesel ağır olmalı (${belgeselKlasik} > ${belgeselEglence})`);
  // Aynı girdi + aynı ruh hali → birebir aynı program.
  const girdi = { gecmis, slug: 'kendi', ruhHali: 'duygu', simdiDk: 360, tohum: 9, maxSlot: 8 };
  assert.deepStrictEqual(kanalProgramlaV2(girdi), kanalProgramlaV2(girdi));
  // Farklı ruh hali → farklı program (en az bir tohumda).
  const duygu = JSON.stringify(kanalProgramlaV2(girdi));
  let farkli = false;
  for (let t = 1; t <= 20; t++) {
    const g = { ...girdi, ruhHali: 'klasik', tohum: t };
    if (JSON.stringify(kanalProgramlaV2(g)) !== duygu) { farkli = true; break; }
  }
  assert.ok(farkli, 'ruh hali programı değiştirmeli');
});

/* --- 13) Kaçırdıkların -------------------------------------------------- */
test('kaçırdıklarım: yalnız biten slotlar, son pencere içinde, en yeni önce', () => {
  const p = [
    { baslangucDk: 0, sureDk: 60, bitisDk: 60, tmdbId: '1', ad: 'A', tip: 'film', tur: 'Dram' },
    { baslangucDk: 60, sureDk: 60, bitisDk: 120, tmdbId: '2', ad: 'B', tip: 'film', tur: 'Komedi' },
    { baslangucDk: 120, sureDk: 60, bitisDk: 180, tmdbId: '3', ad: 'C', tip: 'dizi', tur: 'Aksiyon' },
    { baslangucDk: 180, sureDk: 60, bitisDk: 240, tmdbId: '4', ad: 'D', tip: 'film', tur: 'Belgesel' }
  ];
  const hepsi = kacirdiklarim(p, 200, { pencereDk: 300 });
  assert.deepStrictEqual(hepsi.map((s) => s.ad), ['C', 'B', 'A'], 'D hala yayında, en yeni önce');
  const pencereli = kacirdiklarim(p, 200, { pencereDk: 90 });
  assert.deepStrictEqual(pencereli.map((s) => s.ad), ['C', 'B'], 'pencere dışındaki A düşer');
  assert.deepStrictEqual(kacirdiklarim(p, 200, { pencereDk: 60 }).map((s) => s.ad), ['C']);
  assert.deepStrictEqual(kacirdiklarim(p, 60, { pencereDk: 300 }).map((s) => s.ad), ['A'], 'bittiği an kaçırılmış sayılır');
  assert.deepStrictEqual(kacirdiklarim(p, 59, { pencereDk: 300 }).map((s) => s.ad), [], 'yayın sürerken kaçırılmış sayılmaz');
  assert.deepStrictEqual(kacirdiklarim(p, 200, { pencereDk: 300, enFazla: 1 }).map((s) => s.ad), ['C']);
  assert.deepStrictEqual(kacirdiklarim([], 100), []);
  assert.deepStrictEqual(kacirdiklarim(null, 100), []);
  assert.deepStrictEqual(kacirdiklarim(p, 200, { pencereDk: 0 }), []);
  // Gerçek programda pencere sınırı korunur.
  const gercek = v2Program({ tohum: 4 });
  const simdi = gercek[5].baslangucDk + 5;
  const kacirdik = kacirdiklarim(gercek, simdi, { pencereDk: 240, enFazla: 8 });
  assert.ok(kacirdik.length <= 8);
  for (const s of kacirdik) assert.ok(s.bitisDk <= simdi && s.bitisDk >= simdi - 240);
});

test('hatırlatma adayları: yalnız 10 dk içinde başlayan slotlar', () => {
  const p = [
    { baslangucDk: 100, tmdbId: '1', ad: 'Geçti', tip: 'film', tur: 'Dram' },
    { baslangucDk: 600, tmdbId: '2', ad: 'Şimdi', tip: 'film', tur: 'Dram' },
    { baslangucDk: 605, tmdbId: '3', ad: '5 dk', tip: 'dizi', tur: 'Komedi' },
    { baslangucDk: 610, tmdbId: '4', ad: '10 dk', tip: 'dizi', tur: 'Komedi' },
    { baslangucDk: 611, tmdbId: '5', ad: '11 dk', tip: 'film', tur: 'Dram' }
  ];
  assert.deepStrictEqual(hatirlatmaAdaylari(p, 600).map((s) => s.ad), ['5 dk', '10 dk']);
  assert.deepStrictEqual(hatirlatmaAdaylari(p, 600, { pencereDk: 5 }).map((s) => s.ad), ['5 dk']);
  assert.deepStrictEqual(hatirlatmaAdaylari(p, 600, { pencereDk: 2 }), []);
  assert.deepStrictEqual(hatirlatmaAdaylari(p, 600, { pencereDk: 0 }), []);
  assert.deepStrictEqual(hatirlatmaAdaylari([], 600), []);
  assert.deepStrictEqual(hatirlatmaAdaylari(null, 600), []);
});

/* --- 14) Rehber metni --------------------------------------------------- */
test('kanalRehberiMetni: akşam dilimi, HH:MM satırları, toplam dk; bozuk girdide boş dize', () => {
  const p = [
    { baslangucDk: 420, sureDk: 60, tmdbId: '1', ad: 'Sabah Kuşağı', tip: 'film', tur: 'Animasyon', kusak: 'sabah' },
    { baslangucDk: 1020, sureDk: 120, tmdbId: '2', ad: 'Gölgede Adam', tip: 'film', tur: 'Aksiyon', kusak: 'prime' },
    { baslangucDk: 1140, sureDk: 45, tmdbId: '3', ad: 'Karanlık', tip: 'dizi', tur: 'Dram', kusak: 'prime', sezon: 2, bolum: 4, sonrakiBolum: { sezon: 2, bolum: 5 } },
    { baslangucDk: 1185, sureDk: 45, tmdbId: '4', ad: 'Son', tip: 'dizi', tur: 'Komedi', kusak: 'prime', sezon: 1, bolum: 1 }
  ];
  const metin = kanalRehberiMetni(p, 20 * 60 + 15);
  const satirlar = metin.split('\n');
  assert.match(satirlar[0], /^📺 Kanalım • Bu akşamın rehberi \(20:15\)$/);
  assert.equal(satirlar.length, 5, 'başlık + 3 akşam programı + özet');
  assert.equal(satirlar[1], '17:00 • Gölgede Adam (Film • Aksiyon • 120 dk)');
  assert.equal(satirlar[2], '19:00 • Karanlık (Dizi • Dram • S2B4 → S2B5 • 45 dk)');
  assert.equal(satirlar[3], '19:45 • Son (Dizi • Komedi • S1B1 • 45 dk)');
  assert.equal(satirlar[4], '3 program • 210 dk', 'özet toplam dakikayı doğru vermeli');
  assert.ok(!metin.includes('Sabah Kuşağı'), 'sabah programı akşam rehberine girmemeli');
  for (let i = 1; i <= 3; i++) assert.match(satirlar[i], /^\d{2}:\d{2} • /);

  assert.equal(kanalRehberiMetni([], 500), '');
  assert.equal(kanalRehberiMetni(null, 500), '');
  assert.equal(kanalRehberiMetni(p, 500, { baslangicDk: 0, bitisDk: 300 }), '', 'akşam dilimi boşsa metin boş');
  assert.match(kanalRehberiMetni(p, 500, { kanalAd: 'Belgesel Kanalı' }), /^📺 Belgesel Kanalı • /);
});

/* --- 15) İstatistik ------------------------------------------------------ */
test('kanalIstatistik: yüzdeler 100 toplam, toplam dk = Σ süre, binge sayısı doğru', () => {
  const bos = kanalIstatistik([], []);
  assert.equal(bos.slotSayisi, 0);
  assert.equal(bos.toplamDk, 0);
  assert.equal(bos.bingeSayisi, 0);
  assert.equal(bos.turDagilimi.length, 0);
  assert.equal(kanalIstatistik(null, null).slotSayisi, 0);

  const p = [
    { baslangucDk: 0, sureDk: 120, tmdbId: '1', ad: 'F1', tip: 'film', tur: 'Dram', kusak: 'sabah', dongu: 0 },
    { baslangucDk: 120, sureDk: 45, tmdbId: '2', ad: 'D1', tip: 'dizi', tur: 'Komedi', kusak: 'sabah', bingeNo: 1, dongu: 0 },
    { baslangucDk: 165, sureDk: 45, tmdbId: '2', ad: 'D1', tip: 'dizi', tur: 'Komedi', kusak: 'sabah', bingeNo: 2, dongu: 0 },
    { baslangucDk: 210, sureDk: 45, tmdbId: '2', ad: 'D1', tip: 'dizi', tur: 'Komedi', kusak: 'sabah', bingeNo: 3, dongu: 0 },
    { baslangucDk: 255, sureDk: 120, tmdbId: '3', ad: 'F2', tip: 'film', tur: 'Komedi', kusak: 'prime', dongu: 1 }
  ];
  const gecmis = [{ id: 2, title: 'D1', genre_ids: [35] }, { id: 3, title: 'F2', genre_ids: [35] }];
  const ist = kanalIstatistik(p, gecmis);
  assert.equal(ist.slotSayisi, 5);
  assert.equal(ist.filmSayisi, 2);
  assert.equal(ist.diziSayisi, 3);
  assert.equal(ist.toplamDk, 375, 'toplam dk = slot sürelerinin toplamı');
  assert.equal(p.reduce((t, s) => t + s.sureDk, 0), ist.toplamDk);
  assert.equal(ist.turDagilimi.reduce((t, x) => t + x.yuzde, 0), 100, 'tür yüzdeleri tam 100 toplar');
  assert.equal(ist.turDagilimi[0].tur, 'Komedi');
  assert.equal(ist.turDagilimi[0].adet, 4);
  assert.equal(ist.turDagilimi[0].yuzde, 80);
  assert.equal(ist.bingeSayisi, 1, 'tek binge bloğu');
  assert.equal(ist.bingeSlotSayisi, 2, 'devam slotları');
  assert.equal(ist.enUzunBinge, 3);
  assert.equal(ist.tekrarSlotSayisi, 1, 'dongu>0 slotları');
  assert.equal(ist.kusakDagilimi.reduce((t, x) => t + x.yuzde, 0), 100);
  assert.equal(ist.tuyumYuzde, 80, 'geçmiş türleriyle uyum yüzdesi');
  // Gerçek v2 programında da toplamlar tutarlı.
  const gercek = v2Program({ tohum: 21 });
  const ist2 = kanalIstatistik(gercek, v2HavuzUret(10));
  assert.equal(ist2.slotSayisi, gercek.length);
  assert.equal(ist2.turDagilimi.reduce((t, x) => t + x.yuzde, 0), 100);
  assert.equal(ist2.toplamDk, gercek.reduce((t, s) => t + s.sureDk, 0));
});

/* --- 16) Geriye dönük uyum: yayindakiSlot v2 programı da okur ------------ */
test('yayindakiSlot: değişken süreli v2 programında doğru slotu seçer (v1 sabit süre korunur)', () => {
  const p = v2Program({ tohum: 13 });
  assert.ok(p.length >= 3);
  // Her slot için bağımsız doğrulama: mutlak dakikada kapsanan slot.
  for (let i = 0; i < p.length; i++) {
    const sDk = p[i].baslangucDk + Math.floor(p[i].sureDk / 2);
    const aktif = yayindakiSlot(p, sDk);
    assert.equal(aktif.simdi.baslangucDk, p[i].baslangucDk, `slot ${i} seçilmeliydi`);
    assert.equal(aktif.sonraki.baslangucDk, p[(i + 1) % p.length].baslangucDk);
  }
  // v1 (sabit süreli, sureDk'sız) program davranışı değişmedi.
  const v1Program = kanalProgramla({ gecmis: gecmisUret(8), saatKovasi: 21, tohum: 3, maxSlot: 5 });
  assert.equal(v1Program.every((s) => !('sureDk' in s)), true, 'v1 programında sureDk yok');
  assert.equal(yayindakiSlot(v1Program, v1Program[2].baslangucDk + 1).simdi.tmdbId, v1Program[2].tmdbId);
});

/* --- 17) Bozuk / eksik girdide atma yok --------------------------------- */
test('v2 bozuk girdi: null/NaN/string/negatif değerler çökme üretmez', () => {
  const bozuk = kanalProgramlaV2();
  assert.ok(Array.isArray(bozuk));
  assert.deepStrictEqual(bozuk, []);
  assert.equal(bozuk.neden, 'havuz-bos');

  assert.deepStrictEqual(
    kanalProgramlaV2({ gecmis: null, favoriler: undefined, watchlist: 'x', slug: null, ruhHali: {}, simdiDk: 'abc', tohum: NaN }),
    []
  );
  assert.deepStrictEqual(kanalProgramlaV2({ gecmis: [{}, null, { id: 'abc' }, { id: null }], maxSlot: 8 }), []);
  assert.deepStrictEqual(kanalProgramlaV2({ gecmis: v2HavuzUret(4), maxSlot: 0 }), []);
  assert.deepStrictEqual(kanalProgramlaV2({ gecmis: v2HavuzUret(4), maxSlot: -5 }), []);

  // Negatif/taşan "şimdi" değerleri güvenli: program yine üretilir.
  const negatif = kanalProgramlaV2({ gecmis: v2HavuzUret(6), simdiDk: -1, tohum: 3, maxSlot: 5 });
  assert.ok(negatif.length > 0);
  const tasan = kanalProgramlaV2({ gecmis: v2HavuzUret(6), simdiDk: 99999, tohum: 3, maxSlot: 5 });
  assert.ok(tasan.length > 0);
  assert.equal(tasan[0].baslangucDk, kusakBaslangicDk(99999));

  // Tek içerikli havuz, tek slot, tekrar durumu: program yine üretilir.
  const tek = kanalProgramlaV2({ gecmis: [{ id: 9, title: 'Tek', type: 'movie', genre_ids: [18] }], simdiDk: 360, tohum: 1, maxSlot: 4 });
  assert.ok(tek.length >= 1);
  assert.equal(kanalIstatistik(tek, null).slotSayisi, tek.length);
});

test('kanalProgramlaV2Async: fallback havuzu enjekte edilir, ağ çağrısı yapılmaz', async () => {
  let cagrildi = false;
  const mock = async ({ slug, preset }) => {
    cagrildi = true;
    assert.equal(slug, 'cizgi');
    assert.equal(preset.slug, 'cizgi');
    return v2HavuzUret(6, [16, 10762]).map((x) => ({ ...x, genre_ids: [16] }));
  };
  const p = await kanalProgramlaV2Async({
    gecmis: [], favoriler: [], watchlist: [], slug: 'cizgi', simdiDk: 360, tohum: 7, maxSlot: 6, fallbackHavuzu: mock
  });
  assert.equal(cagrildi, true, 'çekirdek havuz boşken fallback çağrılmalı');
  assert.ok(p.length > 0);
  for (const s of p) assert.ok(['Animasyon', 'Çocuk', 'Aile'].includes(s.tur), 'preset filtresi fallback havuzuna da uygulanmalı');

  const kirik = async () => { throw new Error('ağ yok'); };
  const p2 = await kanalProgramlaV2Async({
    gecmis: v2HavuzUret(4), slug: 'kendi', simdiDk: 360, tohum: 2, maxSlot: 4, fallbackHavuzu: kirik
  });
  assert.ok(p2.length > 0, 'fallback hata verse de çekirdek havuzdan program üretilmeli');
});

test('kanalProgramlaV2Async: preset dışı geçmiş yeterli havuz sayılmaz', async () => {
  const dramaGecmisi = v2HavuzUret(20, [18]);
  const fallback = v2HavuzUret(12, [28]).map((oge, i) => ({ ...oge, id: 100 + i }));
  let cagrildi = false;
  const program = await kanalProgramlaV2Async({
    gecmis: dramaGecmisi,
    slug: 'aksiyon',
    simdiDk: 360,
    tohum: 11,
    maxSlot: 8,
    fallbackHavuzu: async () => {
      cagrildi = true;
      return fallback;
    }
  });

  assert.equal(cagrildi, true, 'seçili kanala uymayan 20 kayıt fallback eşiğini karşılamamalı');
  assert.ok(program.length > 0);
  assert.ok(program.every((slot) => Number(slot.tmdbId) >= 100), 'program aksiyon fallback başlıklarından kurulmalı');

  let genisHavuzCagrildi = false;
  await kanalProgramlaV2Async({
    gecmis: v2HavuzUret(20, [28]),
    slug: 'aksiyon',
    simdiDk: 360,
    maxSlot: 8,
    minHavuz: 48,
    fallbackHavuzu: async () => {
      genisHavuzCagrildi = true;
      return [];
    }
  });
  assert.equal(genisHavuzCagrildi, true, '48 başlık hedefi için 20 uygun kayıt yeterli sayılmamalı');
});

/* --- 18) Sızıntı testi: timer kayıt defteri ------------------------------ */
test('sızıntı yok: ticker kayıt defterine yazılır, durdurulunca/ayrılınca boşalır', async () => {
  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
  const baslangic = kanalAktifTimerSayisi();
  assert.equal(kanalAktifTimerSayisi(), baslangic, 'test başlangıcında açık timer olmamalı');

  let tik = 0;
  const yasayan = kanalSaatTicker({
    getSimdiDk: () => 504,
    kontrol: () => { tik += 1; return false; },
    araDkMs: 5
  });
  const koptu = kanalSaatTicker({ getSimdiDk: () => 504, hayattaMi: () => false, araDkMs: 5 });
  assert.equal(kanalAktifTimerSayisi(), baslangic + 2, 'iki timer kayıt defterinde olmalı');

  await bekle(45);
  assert.equal(koptu.calisiyor(), false, 'DOM\'dan ayrılan görünümde ticker kendini durdurmalı');
  assert.equal(kanalAktifTimerSayisi(), baslangic + 1, 'ayrılan görünümün timerı silinmeli');
  assert.ok(tik > 0, 'canlı ticker geri çağrılmalı');

  yasayan.durdur();
  yasayan.durdur(); // çift durdurma güvenli olmalı (idempotent)
  assert.equal(kanalAktifTimerSayisi(), baslangic, 'durdurma kayıt defterini boşaltmalı');
  assert.equal(yasayan.calisiyor(), false);

  // Hata veren geri çağrı ticker'ı öldürmez.
  const hatali = kanalSaatTicker({ getSimdiDk: () => 1, geriSayimGuncelle: () => { throw new Error('çizim hatası'); }, araDkMs: 5 });
  await bekle(25);
  assert.equal(hatali.calisiyor(), true, 'çizim hatası ticker\'ı durdurmamalı');
  hatali.durdur();
  assert.equal(kanalAktifTimerSayisi(), baslangic);
  assert.throws(() => kanalSaatTicker({}), TypeError, 'getSimdiDk zorunlu');
  assert.equal(kanalAktifTimerSayisi(), baslangic);
});
