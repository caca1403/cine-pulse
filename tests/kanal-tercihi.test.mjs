/* ==========================================================================
   İlk kurulum (soğuk başlangıç) testleri
   --------------------------------------------------------------------------
   Amaç: izleme geçmişi HİÇ olmayan kullanıcı da kanal kurabilsin.
   Kanıtlar:
   · tercih doğrulama/normalize + sürüm reddi
   · havuz birleştirme (tekilleştirme, görselsiz kayıt atma, hariç tutma)
   · tercih türlerine göre önceliklendirme
   · tercih havuzundan gerçek program üretimi (slot + neden + tür eğilimi)
   ========================================================================== */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  TERCIH_SURUMU, TERCIH_ANAHTAR, TUR_RAF, turRafTanimi, tercihGecerli, tercihOku,
  tercihYaz, tercihTemizle, havuzBirlestir, terciheGoreSirala, tercihSlug, turSorgusu
} from '../src/services/canli/kanalTercihi.js';
import { kanalProgramlaV2, yayindakiSlot } from '../src/services/canli/channelScheduler.js';

function bellekDepo() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
    removeItem: (k) => { m.delete(k); },
    _harita: m
  };
}

/** Gerçekçi TMDB keşif kaydı. */
function kayit(id, turIdler, ek = {}) {
  return {
    id,
    title: `Yapıt ${id}`,
    name: `Yapıt ${id}`,
    type: 'movie',
    genre_ids: turIdler,
    poster_path: `/p${id}.jpg`,
    backdrop_path: `/b${id}.jpg`,
    vote_average: 7.5,
    popularity: 100 - (id % 50),
    release_date: '2020-05-01',
    ...ek
  };
}

/* ── 1. Tür rafı ─────────────────────────────────────────────────────── */
test('TUR_RAF: slug/tanım tutarlı, her rafın en az bir TMDB türü var', () => {
  assert.ok(TUR_RAF.length >= 10, 'enough genre shelf entries');
  for (const t of TUR_RAF) {
    assert.ok(t.slug && t.ad && Array.isArray(t.turIdler) && t.turIdler.length > 0, `${t.slug} eksik alan`);
    assert.equal(turRafTanimi(t.slug)?.ad, t.ad);
    assert.equal(turRafTanimi(t.slug.toUpperCase())?.slug, t.slug, 'case-insensitive lookup');
  }
  assert.equal(turRafTanimi('yok-boyle-bir-sey'), null);
  assert.equal(turRafTanimi(null), null);
});

/* ── 2. Tercih doğrulama ─────────────────────────────────────────────── */
test('tercihGecerli: türleri normalize eder, tekrarı atar, kimlikleri toplar', () => {
  const t = tercihGecerli({ slug: 'aksiyon', turler: ['aksiyon', 'aksiyon', 'dram', 'yok'] });
  assert.ok(t);
  assert.equal(t.slug, 'aksiyon');
  assert.deepEqual(t.turler, ['aksiyon', 'dram']);
  // aksiyon: 28,12,10759 · dram: 18,10766
  assert.ok(t.turIdler.includes(28) && t.turIdler.includes(12) && t.turIdler.includes(18));
  assert.equal(new Set(t.turIdler).size, t.turIdler.length, 'turIdler tekil');
});

test('tercihGecerli: hiç seçim yoksa null (boş kayıt yazılmaz)', () => {
  assert.equal(tercihGecerli(null), null);
  assert.equal(tercihGecerli({}), null);
  assert.equal(tercihGecerli({ turler: [] }), null);
  assert.equal(tercihGecerli({ turler: ['bilinmeyen'] }), null);
  // Yalnız serbest TMDB kimliği verilmişse geçerli sayılır.
  assert.ok(tercihGecerli({ turIdler: [28] }));
});

/* ── 3. Kalıcılık + sürüm ────────────────────────────────────────────── */
test('tercihYaz/tercihOku: gidiş-dönüş; sürüm uyuşmazsa null', () => {
  const depo = bellekDepo();
  assert.equal(tercihYaz(depo, { slug: 'dram', turler: ['dram', 'gerilim'] }, 1_700_000_000_000), true);
  const okunan = tercihOku(depo);
  assert.ok(okunan);
  assert.equal(okunan.slug, 'dram');
  assert.deepEqual(okunan.turler, ['dram', 'gerilim']);
  assert.equal(okunan.olusturmaTs, 1_700_000_000_000);
  assert.equal(tercihSlug(okunan), 'dram');

  const ham = JSON.parse(depo.getItem(TERCIH_ANAHTAR));
  ham.surum = TERCIH_SURUMU + 1;
  depo.setItem(TERCIH_ANAHTAR, JSON.stringify(ham));
  assert.equal(tercihOku(depo), null, 'eski/yeni şema reddedilir');

  assert.equal(tercihTemizle(depo), true);
  assert.equal(tercihOku(depo), null);
});

test('turSorgusu: çoklu türde OR (|) üretir — virgül AND olduğu için boş havuz yapıyordu', () => {
  assert.equal(turSorgusu([28, 12, 18]), '28|12|18');
  assert.equal(turSorgusu([18, 18, 53]), '18|53', 'tekilleştirir');
  assert.equal(turSorgusu([28]), '28');
  assert.equal(turSorgusu([]), null);
  assert.equal(turSorgusu(null), null);
  assert.equal(turSorgusu(['x', -1, 0]), null, 'geçersizler elenir');
});

test('tercihYaz: geçersiz tercih depoya yazılmaz', () => {
  const depo = bellekDepo();
  assert.equal(tercihYaz(depo, { turler: [] }), false);
  assert.equal(depo.getItem(TERCIH_ANAHTAR), null);
});

/* ── 4. Havuz birleştirme ────────────────────────────────────────────── */
test('havuzBirlestir: tekilleştirir, görselsiz kaydı atar, harici eler, sırayı korur', () => {
  const a = [kayit(1, [28]), kayit(2, [18]), kayit(9, [28], { poster_path: '', backdrop_path: '' })];
  const b = [kayit(2, [18]), kayit(3, [35])];
  const sonuc = havuzBirlestir([a, b], { haric: new Set(['3']) });
  assert.deepEqual(sonuc.map((x) => x.id), [1, 2]);
});

test('havuzBirlestir: enFazla sınırına uyar', () => {
  const liste = Array.from({ length: 30 }, (_, i) => kayit(i + 1, [28]));
  assert.equal(havuzBirlestir([liste], { enFazla: 7 }).length, 7);
  assert.equal(havuzBirlestir([liste]).length, 30);
  assert.deepEqual(havuzBirlestir([]), []);
  assert.deepEqual(havuzBirlestir([null, undefined]), []);
});

/* ── 5. Tercihe göre öncelik ─────────────────────────────────────────── */
test('terciheGoreSirala: seçilen türler öne, diğerleri arkaya (sıra korunur)', () => {
  const havuz = [kayit(1, [35]), kayit(2, [18]), kayit(3, [18, 80]), kayit(4, [99])];
  const sirali = terciheGoreSirala(havuz, { turIdler: [18] });
  assert.deepEqual(sirali.map((x) => x.id), [2, 3, 1, 4]);
  // Tercih yoksa sıra bozulmaz.
  assert.deepEqual(terciheGoreSirala(havuz, {}).map((x) => x.id), [1, 2, 3, 4]);
});

/* ── 6. Soğuk başlangıç programı ─────────────────────────────────────── */
test('soğuk başlangıç: tercih havuzundan program kurulur (sinyal yok)', () => {
  // tercih: dram + gerilim; havuzda 30 dram/gerilim + 20 komedi
  const havuz = [];
  for (let i = 0; i < 30; i += 1) havuz.push(kayit(100 + i, i % 2 ? [18] : [53], { type: i % 3 ? 'movie' : 'tv' }));
  for (let i = 0; i < 20; i += 1) havuz.push(kayit(300 + i, [35]));

  const tercih = tercihGecerli({ slug: 'kendi', turler: ['dram', 'gerilim'] });
  const simdiDk = 20 * 60; // 20:00 — prime time
  const program = kanalProgramlaV2({
    gecmis: terciheGoreSirala(havuz, tercih),
    favoriler: [],
    watchlist: [],
    slug: tercih.slug,
    simdiDk,
    tohum: 104729,
    maxSlot: 48
  });

  assert.ok(program.length >= 4, `program kurulmalı, gelen ${program.length}`);
  assert.ok(program.every((s) => s.ad && Number.isFinite(s.baslangucDk)), 'her slot adlı ve zamanlı');
  assert.ok(program.every((s) => typeof s.neden === 'string' && s.neden.length > 0), 'her slotta gerekçe');
  assert.ok(yayindakiSlot(program, simdiDk).simdi, 'şu an yayında bir slot var');

  // Tercih edilen türlerin çoğunlukta olması beklenir (havuzun %60'ı).
  const secilen = program.filter((s) => s.turler.some((t) => t === 'Dram' || t === 'Gerilim')).length;
  assert.ok(secilen / program.length >= 0.5,
    `programın en az yarısı tercih türlerinden olmalı (%${Math.round((secilen / program.length) * 100)})`);
});

test('soğuk başlangıç: 48 slota kadar program üretilebiliyor (başlık sayısı arttı)', () => {
  const havuz = [];
  for (let i = 0; i < 120; i += 1) {
    havuz.push(kayit(1000 + i, i % 4 === 0 ? [53] : [18], { type: i % 2 ? 'movie' : 'tv' }));
  }
  const simdiDk = 8 * 60; // sabah kuşağından başlar, gün sonuna kadar dolar
  const program = kanalProgramlaV2({ gecmis: havuz, slug: 'kendi', simdiDk, tohum: 5, maxSlot: 48 });
  assert.ok(program.length >= 15, `en az 15 slot beklenir, gelen ${program.length}`);
  assert.ok(program.length <= 48);
  const sonSlot = program[program.length - 1];
  assert.ok(sonSlot.baslangucDk + sonSlot.sureDk <= 1440, 'program gün sınırını aşmaz');
  // Eski tavan 24'tü: havuz büyükse gün sonuna kadar dolmalı.
  assert.ok(program.length > 15, 'havuz büyükken program gün boyuna yayılır');
});

test('soğuk başlangıç: boş havuzda program uydurulmaz', () => {
  const program = kanalProgramlaV2({ gecmis: [], slug: 'kendi', simdiDk: 600, tohum: 1, maxSlot: 48 });
  assert.equal(program.length, 0);
});
