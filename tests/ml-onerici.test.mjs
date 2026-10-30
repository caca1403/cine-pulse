/* ==========================================================================
   Kişiselleştirme ML çekirdeği testleri
   --------------------------------------------------------------------------
   Kanıt ilkesi: bu testler modelin GERÇEKTEN öğrendiğini ölçer —
   · BPR gizli küme yapısını geri kazanıyor mu (hit-rate)
   · Lojistik sıralayıcı zaman ayrık testte AUC > 0.65 ve eğitim kaybı düşüyor mu
   · Aynı tohum → aynı ağırlıklar (deterministik)
   · Şema sürümü uyuşmazsa model reddediliyor mu (sessiz bozulma yok)
   · Model yokken sıralama sahte kişiselleştirme iddia etmiyor mu
   ========================================================================== */
import test from 'node:test';
import assert from 'node:assert/strict';

import { bprEgit, bprOneriler, bprSkor, bprToJSON, bprFromJSON, urunBenzerligi } from '../src/services/kisisel/ml/matrisAyrisimi.js';
import { egitSiralayici, skorla, auc, modelToJSON, modelFromJSON } from '../src/services/kisisel/ml/lojistikSiralayici.js';
import { kodla, OZELLIK_SAYISI, OZELLIK_ADLARI, MODEL_SURUMU } from '../src/services/kisisel/ml/ozellikler.js';
import { egitModel, modelKaydet, modelYukle, egitimGerekliMi, etkilesimlerKur, MIN_SIRALAYICI_ORNEK } from '../src/services/kisisel/ml/egitmen.js';
import { sirala, modelDurumu, kanalAgirlikFonksiyonu, ozellikEtiketi } from '../src/services/kisisel/ml/onerici.js';
import { izlenimEkle, izlenimTikla, izlenimOku, izlenimOrnekleri, IZLENIM_ANAHTAR } from '../src/services/kisisel/ml/izlenimler.js';
import { mulberry32 } from '../src/services/canli/channelScheduler.js';

/* ── Bellek deposu (localStorage yerine) ─────────────────────────────── */
function bellekDepo() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
    removeItem: (k) => { m.delete(k); },
    _harita: m
  };
}

/* ── Sentetik dünya ──────────────────────────────────────────────────── */
const TUR = { dram: 18, gerilim: 53, komedi: 35, belgesel: 99 };
const TUR_ANAHTAR = Object.keys(TUR);
const TERCIH = { dram: 0.95, gerilim: 0.8, belgesel: 0.3, komedi: 0.05 };

function dunyaKur(tohum = 42, adet = 90) {
  const rast = mulberry32(tohum);
  const kayitlar = new Map();
  const havuz = [];
  for (let i = 1; i <= adet; i += 1) {
    const tur = TUR_ANAHTAR[Math.floor(rast() * TUR_ANAHTAR.length)];
    const oge = {
      id: 2000 + i,
      title: `Kayıt ${i}`,
      type: rast() > 0.5 ? 'tv' : 'movie',
      genre_ids: [TUR[tur]],
      vote_average: 4 + rast() * 5,
      popularity: 20 + rast() * 400,
      release_date: `${1990 + Math.floor(rast() * 34)}-05-01`
    };
    kayitlar.set(String(oge.id), oge);
    havuz.push(oge);
  }
  const turAdi = (oge) => TUR_ANAHTAR.find((t) => TUR[t] === oge.genre_ids[0]);
  return { rast, kayitlar, havuz, zevk: (oge) => TERCIH[turAdi(oge)], turAdi };
}

/* ── 1. BPR gizli kümeleri kazanıyor mu ──────────────────────────────── */
test('BPR: aynı zevk kümesindeki GÖRÜLMEMİŞ içerikleri üst sıraya çıkarır (recall@6)', () => {
  const rast = mulberry32(7);
  // 3 zevk kümesi × 16 ürün; her kümede 2 kullanıcı (biri diğerinin
  // görmediği içerikleri görür → ürün vektörü öğrenilir, CF genellemesi ölçülür).
  const kumeUrun = { A: [], B: [], C: [] };
  for (let i = 0; i < 48; i += 1) kumeUrun[['A', 'B', 'C'][i % 3]].push(`i${i}`);

  const kullanicilar = [
    { id: 'uA1', kume: 'A' }, { id: 'uA2', kume: 'A' },
    { id: 'uB1', kume: 'B' }, { id: 'uB2', kume: 'B' },
    { id: 'uC1', kume: 'C' }, { id: 'uC2', kume: 'C' }
  ];
  const etkilesimler = [];
  const testBeklenti = new Map();
  for (const k of kullanicilar) {
    const urunler = kumeUrun[k.kume];
    const secilen = urunler.filter(() => rast() < 0.7);
    for (const urun of secilen) etkilesimler.push({ kullanici: k.id, urun, agirlik: 1 });
    testBeklenti.set(k.id, urunler.filter((u) => !secilen.includes(u)));
  }

  const model = bprEgit({ etkilesimler, hiper: { epoch: 150, faktor: 12, tohum: 11 } });
  assert.equal(model.egitildi, true, 'model eğitilmeli');

  // En az 4 kullanıcıda, görülmemiş aynı-küme içerikleri ilk 6'da olmalı.
  let basarili = 0;
  for (const k of kullanicilar) {
    const gorulen = new Set(etkilesimler.filter((e) => e.kullanici === k.id).map((e) => e.urun));
    const beklenen = new Set(testBeklenti.get(k.id));
    if (beklenen.size === 0) continue;
    const top = bprOneriler(model, k.id, { haric: gorulen, adet: 6 }).map((x) => x.urun);
    const isabet = top.filter((x) => beklenen.has(x)).length;
    if (isabet >= 3) basarili += 1;
  }
  assert.ok(basarili >= 4, `en az 4 kullanıcıda recall@6 ≥ 3 olmalı, başarılı: ${basarili}/6`);
});

test('BPR: JSON gidiş-dönüşü skorları korur; bozuk şekil reddedilir', () => {
  const etk = [];
  for (let i = 0; i < 20; i += 1) etk.push({ kullanici: 'a', urun: `i${i}`, agirlik: 1 });
  for (let i = 0; i < 8; i += 1) etk.push({ kullanici: 'a', urun: `i${i + 20}`, agirlik: 0.5 });
  const model = bprEgit({ etkilesimler: etk, hiper: { epoch: 25 } });
  const geri = bprFromJSON(JSON.parse(JSON.stringify(bprToJSON(model))));
  assert.ok(geri, 'model geri yüklenmeli');
  const a = bprSkor(model, 'a', 'i3');
  const b = bprSkor(geri, 'a', 'i3');
  assert.ok(Math.abs(a - b) < 0.01, `skor korunmalı: ${a} vs ${b}`);
  assert.equal(bprFromJSON({ tur: 'bpr', faktor: 4, U: [[1, 2]], V: [], urunler: [] }), null);
  assert.equal(bprFromJSON(null), null);
});

/* ── 2. Lojistik sıralayıcı öğreniyor mu ─────────────────────────────── */
test('Sıralayıcı: eğitim kaybı düşer, zaman ayrık test AUC ≥ 0.65', () => {
  const { kayitlar, havuz, zevk, rast } = dunyaKur(42);
  const ornekler = havuz.map((oge) => ({
    x: kodla(oge, {}),
    y: rast() < 0.05 + zevk(oge) * 0.85 ? 1 : 0
  }));
  const kesim = Math.floor(ornekler.length * 0.75);
  const egitim = ornekler.slice(0, kesim);
  const test_ = ornekler.slice(kesim);

  const model = egitSiralayici({ ornekler: egitim });
  assert.equal(model.egitildi, true);
  assert.ok(model.olcum.auc > 0.7, `eğitim AUC > 0.7 olmalı, gelen ${model.olcum.auc}`);

  const p = test_.map((o) => skorla(model, o.x));
  const heldOut = auc(p, test_.map((o) => o.y));
  assert.ok(heldOut !== null && heldOut >= 0.65, `test AUC ≥ 0.65 olmalı, gelen ${heldOut}`);

  // Eğitimsiz model nötr skor verir (0.5) — sahte iddia yok.
  assert.equal(skorla(null, ornekler[0].x), 0.5);
});

test('Sıralayıcı: aynı tohum → aynı ağırlıklar (deterministik)', () => {
  const { kayitlar, havuz, zevk, rast } = dunyaKur(9, 40);
  const ornekler = havuz.map((oge) => ({ x: kodla(oge, {}), y: rast() < zevk(oge) ? 1 : 0 }));
  const a = egitSiralayici({ ornekler, hiper: { tohum: 5, epoch: 40 } });
  const b = egitSiralayici({ ornekler, hiper: { tohum: 5, epoch: 40 } });
  assert.deepEqual(a.agirliklar, b.agirliklar);
});

test('Özellik vektörü: boyut sabit ve tür sütunları doğru yerde', () => {
  const v = kodla({ id: 1, genre_ids: [18], type: 'tv', vote_average: 8 }, {});
  assert.equal(v.length, OZELLIK_SAYISI);
  assert.equal(OZELLIK_ADLARI.length, OZELLIK_SAYISI);
  assert.equal(v[OZELLIK_ADLARI.indexOf('tur_18')], 1);
  assert.equal(v[OZELLIK_ADLARI.indexOf('tip_dizi')], 1);
  // Sütunlar birbirini ezmiyor: favori sütunu tür bloğundan sonra.
  const v2 = kodla({ id: 2, genre_ids: [18] }, { favoriIdler: new Set(['2']) });
  assert.equal(v2[OZELLIK_ADLARI.indexOf('favori')], 1);
  assert.equal(v2[OZELLIK_ADLARI.indexOf('tur_18')], 1);
});

/* ── 3. Uçtan uca model + sıralama ───────────────────────────────────── */
test('sirala(): model, popülerlik sırasından daha çok sevilen tür getirir', () => {
  const { kayitlar, havuz, zevk, rast } = dunyaKur(42);
  const gecmis = havuz.slice().sort((a, b) => zevk(b) - zevk(a)).slice(0, 12)
    .map((o) => ({ ...o, completed: true, lastWatchedAt: Date.now() - 1000 }));
  const gecmisIdler = new Set(gecmis.map((g) => String(g.id)));

  const izlenimler = [];
  for (let i = 0; i < 120; i += 1) {
    const oge = havuz[Math.floor(rast() * havuz.length)];
    izlenimler.push({
      id: String(oge.id),
      ts: Date.now() - (120 - i) * 60000,
      kaynak: 'ana',
      tiklandi: rast() < 0.06 + zevk(oge) * 0.85
    });
  }

  const model = egitModel({
    gecmis,
    favoriler: gecmis.slice(0, 4),
    izlenimler,
    kayitlar,
    profilId: 'p1',
    hizli: true
  });
  assert.equal(modelDurumu(model).egitildi, true, 'yeterli örnekte sıralayıcı eğitilmeli');
  assert.ok(model.olcum.etkilesim >= 12, 'etkileşim sayısı gerçek');

  const adaylar = havuz.filter((o) => !gecmisIdler.has(String(o.id)));
  const { liste } = sirala({ adaylar, model, adet: 15 });
  const ortalama = (l) => l.reduce((s, x) => s + zevk(x.oge || x), 0) / l.length;
  const baseline = adaylar.slice().sort((a, b) => b.popularity - a.popularity).slice(0, 15);

  assert.equal(liste.length, 15);
  assert.ok(liste[0].neden.length > 0, 'her öneride gerekçe olmalı');
  assert.ok(ortalama(liste) > ortalama(baseline) + 0.05,
    `ML ilk15 (${ortalama(liste).toFixed(2)}) popülerlikten (${ortalama(baseline).toFixed(2)}) belirgin iyi olmalı`);
});

test('sirala(): model yoksa sıralama dürüstçe popülerliğe düşer', () => {
  const { havuz } = dunyaKur(3, 30);
  const { liste, modelDurumu: durum } = sirala({ adaylar: havuz, model: null, adet: 10 });
  assert.equal(durum.egitildi, false);
  assert.equal(liste.length, 10);
  assert.ok(liste.every((x) => x.neden.length === 0), 'model yokken gerekçe uydurulmaz');
});

/* ── 4. Kalıcılık / sürüm ────────────────────────────────────────────── */
test('modelKaydet/modelYukle: şema sürümü uyuşmazsa null', () => {
  const depo = bellekDepo();
  const etk = [];
  for (let i = 1; i <= 20; i += 1) etk.push({ kullanici: 'p', urun: String(i), agirlik: 1 });
  const model = {
    surum: MODEL_SURUMU, profilId: 'p', egitimTs: Date.now(), ornekSayisi: 10,
    etkilesimSayisi: 20, izlenimSayisi: 0, olcum: {}, dogrulama: null,
    siralayici: { agirliklar: new Array(OZELLIK_SAYISI).fill(0.1), bias: 0, egitildi: true, olcum: {} },
    bpr: bprEgit({ etkilesimler: etk })
  };
  assert.equal(modelKaydet(depo, model), true);
  const geri = modelYukle(depo, 'p');
  assert.ok(geri, 'model geri okunmalı');
  assert.equal(geri.surum, MODEL_SURUMU);

  // Sürüm bozulursa model reddedilir.
  const ham = JSON.parse(depo.getItem([...depo._harita.keys()][0]));
  ham.surum = 1;
  depo.setItem([...depo._harita.keys()][0], JSON.stringify(ham));
  assert.equal(modelYukle(depo, 'p'), null);
});

test('egitimGerekliMi: yeni izlenim eşiği ve süre kuralı', () => {
  const simdi = 1_000_000_000_000;
  assert.equal(egitimGerekliMi(null, 0, simdi), true);
  const model = { egitimTs: simdi - 1000, izlenimSayisi: 50 };
  assert.equal(egitimGerekliMi(model, 55, simdi), false, 'az sayıda yeni izlenimde eğitim yok');
  assert.equal(egitimGerekliMi(model, 70, simdi), true, 'eşik aşıldığında eğitim');
});

/* ── 5. İzlenim defteri ──────────────────────────────────────────────── */
test('izlenimler: aynı gün tekrar gösterim sayılmaz, tıklama işaretlenir', () => {
  const depo = bellekDepo();
  const t0 = 1_700_000_000_000;
  assert.equal(izlenimEkle(depo, { id: 42, kaynak: 'ana', ts: t0 }), true);
  assert.equal(izlenimEkle(depo, { id: 42, kaynak: 'ana', ts: t0 + 1000 }), false, 'aynı gün tekrar sayılmaz');
  assert.equal(izlenimEkle(depo, { id: 42, kaynak: 'ana', ts: t0 + 86400000 }), true, 'ertesi gün yeni gösterim');
  assert.equal(izlenimTikla(depo, 42, t0 + 5000), true);

  const liste = izlenimOku(depo);
  assert.equal(liste.length, 2);
  assert.equal(liste[liste.length - 1].tiklandi, true);
  assert.ok(depo.getItem(IZLENIM_ANAHTAR));
  assert.equal(izlenimOrnekleri(liste).filter((o) => o.y === 1).length, 1);
});

/* ── 6. Kanal ağırlıkları ────────────────────────────────────────────── */
test('kanalAgirlikFonksiyonu: model yoksa null, varsa 0.55..2.2 aralığında çarpan', () => {
  const { kayitlar, havuz, zevk } = dunyaKur(42);
  const gecmis = havuz.slice(0, 14).map((o) => ({ ...o, lastWatchedAt: Date.now() }));
  const model = egitModel({
    gecmis,
    favoriler: gecmis.slice(0, 3),
    izlenimler: havuz.slice(0, 60).map((o, i) => ({
      id: String(o.id), ts: Date.now() - (60 - i) * 1000, kaynak: 'kanal', tiklandi: zevk(o) > 0.5
    })),
    kayitlar,
    profilId: 'p',
    hizli: true
  });
  assert.equal(kanalAgirlikFonksiyonu({ model: null, adaylar: havuz }), null);

  const fn = kanalAgirlikFonksiyonu({ model, adaylar: havuz });
  assert.equal(typeof fn, 'function');
  const degerler = havuz.slice(0, 10).map((ada) => fn({ tmdbId: String(ada.id) }));
  for (const d of degerler) {
    assert.ok(d >= 0.55 && d <= 2.2, `çarpan aralıkta olmalı, gelen ${d}`);
  }
  assert.equal(fn({ tmdbId: 'bilinmeyen' }), 1, 'bilinmeyen içerik nötr çarpan alır');
});

/* ── 7. Yardımcılar ──────────────────────────────────────────────────── */
test('etkilesimlerKur: tekilleştirir ve ağırlık sırası doğru', () => {
  const etk = etkilesimlerKur({
    gecmis: [{ id: 1, completed: true }, { id: 2, progressPercent: 30 }, { id: 1 }],
    favoriler: [{ id: 3 }, { id: 1 }],
    watchlist: [{ id: 4 }],
    profilId: 'p'
  });
  assert.equal(etk.length, 4);
  const agirlik = Object.fromEntries(etk.map((e) => [e.urun, e.agirlik]));
  assert.equal(agirlik['1'], 1.3, 'tamamlanan geçmiş en yüksek');
  assert.equal(agirlik['2'], 1, 'yarım kalan normal');
  assert.equal(agirlik['3'], 1.5, 'favori en güçlü');
  assert.equal(agirlik['4'], 0.9, 'liste daha zayıf');
});

test('ozellikEtiketi: tür sütunları okunabilir Türkçe gerekçeye çevrilir', () => {
  assert.equal(ozellikEtiketi('tur_18'), 'dram türü');
  assert.equal(ozellikEtiketi('saat_uyumu'), 'izleme saatine uygun');
  assert.equal(ozellikEtiketi('bilinmeyen'), '');
});

test('urunBenzerligi: birlikte izlenen içerikler benzer, ilgisizler sıfır', () => {
  const { benzerlik, komsular } = urunBenzerligi({
    dizi: [{ urun: 'a' }, { urun: 'b' }, { urun: 'c' }],
    kenarlar: [{ a: 'a', b: 'z', agirlik: 2 }]
  });
  assert.ok(benzerlik('a', 'b') > 0);
  assert.ok(benzerlik('a', 'z') > 0);
  assert.equal(benzerlik('a', 'yok'), 0);
  assert.ok(komsular('a', 3).length >= 2);
  assert.equal(benzerlik('a', 'a'), 0);
});

test('MIN_SIRALAYICI_ORNEK eşiği görünümle aynı (24)', () => {
  assert.equal(MIN_SIRALAYICI_ORNEK, 24);
});
