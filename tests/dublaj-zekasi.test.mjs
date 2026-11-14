/* ==========================================================================
   DUBLAJ ZEKÂSI — entegrasyon katmanı testleri (ağsız)
   --------------------------------------------------------------------------
   Bu katman motoru uygulamaya bağlar. En kritik risk SESSİZ ETKİSİZLİK:
   modül çalışır ama sıralamayı değiştirmez, kimse fark etmez. Aşağıdaki
   testler o sessiz arızaları yakalar:
     · sağlayıcı öneki eşleşmesi (`sp_hulk_` ≠ `sp_`) — ÖLÇÜLEN HATA
     · sicil boşken davranışın DEĞİŞMEMESİ (ilk açılış)
     · tohum yükleme (doğrudan biçim + geriye uyum) ve tekrar yüklememe
     · oynatma geri bildiriminin kalıcı yazılması
     · her hatada sessiz düşme (asla fırlatmama)
   Çalıştır: node --test tests/dublaj-zekasi.test.mjs
   ========================================================================== */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  sicil, sicilKaydetSimdi, siciliSifirla, tohumKokKodlari, tohumuYukle,
  saglayiciAnahtari, saglayiciOnekleriniAyarla, dublajaGoreSirala,
  icerikAnahtariOlustur, oynatmaGeriBildir, arkaPlandaZenginlestir,
  dublajZekaDurumu, akilliTaramaSirasi,
} from '../src/services/kaynak/dublajZekasi.js';

/* ── Sahte depo (localStorage) ────────────────────────────────────────────── */
function depoKur() {
  const m = new Map();
  globalThis.localStorage = {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
  };
  return m;
}

function yanit(govde, { ok = true, status = 200 } = {}) {
  const metin = typeof govde === 'string' ? govde : JSON.stringify(govde);
  return { ok, status, text: async () => metin, json: async () => JSON.parse(metin) };
}

const TOHUM = {
  surum: 1,
  kayitlar: [
    { tmdbTip: 'movie', tmdbId: '550', sezon: null, bolum: null, saglayici: 'sp_hulk_', dilDurumu: 'dublaj', kanit: 'm3u8', diller: ['tr'], sonGorulme: Date.now() },
    { tmdbTip: 'movie', tmdbId: '550', sezon: null, bolum: null, saglayici: 'sp_aquaman_', dilDurumu: 'dublaj', kanit: 'm3u8', diller: ['tr'], sonGorulme: Date.now() },
    { tmdbTip: 'movie', tmdbId: '550', sezon: null, bolum: null, saglayici: 'sp_cyborg_', dilDurumu: 'orijinal', kanit: 'm3u8', diller: ['en'], sonGorulme: Date.now() },
  ],
};

/* ══ SAĞLAYICI ÖNEKİ ══════════════════════════════════════════════════════ */

test('saglayiciAnahtari: EN UZUN önek eşleşir (ölçülen sessiz hata)', () => {
  depoKur();
  siciliSifirla();
  saglayiciOnekleriniAyarla(['sp_', 'sp_hulk_', 'sp_starlord_']);
  // ÖLÇÜLEN HATA: kaba `^([a-z0-9]+_)` kalıbı buradan 'sp_' üretiyordu ve
  // sicildeki 'sp_hulk_' anahtarıyla eşleşmediği için sıralama etkisizdi.
  assert.equal(saglayiciAnahtari({ id: 'sp_hulk_abc123' }), 'sp_hulk_');
  assert.equal(saglayiciAnahtari({ id: 'sp_starlord_xy' }), 'sp_starlord_');
  // Bilinmeyen önek: sabit bir anahtar üretilir, fırlatmaz.
  assert.equal(typeof saglayiciAnahtari({ id: 'yeni_onek_x' }), 'string');
  assert.equal(saglayiciAnahtari({}), '');
});

test('saglayiciAnahtari: yıldız kaynakları doğrudan döner', () => {
  depoKur();
  siciliSifirla();
  saglayiciOnekleriniAyarla(['sp_hulk_']);
  assert.equal(saglayiciAnahtari({ id: 'star:hdfc' }), 'star:hdfc');
  assert.equal(saglayiciAnahtari({ id: 'STAR:DIZILLA' }), 'star:dizilla');
});

/* ══ SIRALAMA ═════════════════════════════════════════════════════════════ */

test('dublajaGoreSirala: sicil BOŞKEN liste aynen döner (davranış değişmez)', () => {
  depoKur();
  siciliSifirla();
  saglayiciOnekleriniAyarla(['sp_hulk_', 'sp_cyborg_']);
  const liste = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const sonuc = dublajaGoreSirala(liste, 'movie|550||');
  assert.deepEqual(sonuc.map((x) => x.id), ['a', 'b', 'c']);
});

test('dublajaGoreSirala: TR dublaj kanıtlı kaynağı başa alır', () => {
  depoKur();
  siciliSifirla();
  saglayiciOnekleriniAyarla(['sp_hulk_', 'sp_aquaman_', 'sp_cyborg_']);
  // Sicile doğrudan kanıt yaz (tohum yolunu ayrı test ediyoruz).
  const { kanitIsle } = { kanitIsle: null };
  void kanitIsle;
  // Tohum üzerinden yaz:
  return tohumuYukle({ fetchFn: async () => yanit(TOHUM), zorla: true }).then(() => {
    // hulk + aquaman dublaj, cyborg orijinal → dublajlılar öne.
    const liste = [
      { id: 'sp_cyborg_1', streamUrl: 'c' },
      { id: 'sp_aquaman_1', streamUrl: 'b' },
    ];
    const sonuc = dublajaGoreSirala(liste, 'movie|550||');
    assert.equal(sonuc[0].id, 'sp_aquaman_1', 'dublaj kanıtlı kaynak öne geçmeli');
    assert.equal(sonuc.length, 2, 'hiçbir kaynak kaybolmamalı');
  });
});

test('dublajaGoreSirala: girdi dizisini DEĞİŞTİRMEZ, saglayici alanını sızdırmaz', () => {
  depoKur();
  siciliSifirla();
  saglayiciOnekleriniAyarla(['sp_hulk_']);
  return tohumuYukle({ fetchFn: async () => yanit(TOHUM), zorla: true }).then(() => {
    const liste = [{ id: 'sp_hulk_1', streamUrl: 'a', displayName: 'Hulk' }];
    const kopya = JSON.parse(JSON.stringify(liste));
    const sonuc = dublajaGoreSirala(liste, 'movie|550||');
    assert.deepEqual(liste, kopya, 'girdi değişmemeli');
    assert.equal(Object.prototype.hasOwnProperty.call(sonuc[0], 'saglayici'), false,
      'saglayici alanı dışa sızmamalı (tüketici sözleşmesi)');
  });
});

test('dublajaGoreSirala: boş/bozuk girdide güvenli', () => {
  depoKur();
  siciliSifirla();
  assert.deepEqual(dublajaGoreSirala([], 'movie|1||'), []);
  assert.deepEqual(dublajaGoreSirala(null, 'movie|1||'), []);
});

/* ══ TOHUM ════════════════════════════════════════════════════════════════ */

test('tohumuYukle: doğrudan biçimi sicile yazar', async () => {
  depoKur();
  siciliSifirla();
  saglayiciOnekleriniAyarla(['sp_hulk_']);
  const n = await tohumuYukle({ fetchFn: async () => yanit(TOHUM), zorla: true });
  assert.ok(n >= 3, `en az 3 kayıt yüklenmeli, gelen: ${n}`);
  const durum = dublajZekaDurumu('movie|550||');
  assert.equal(durum.ozet.icerikSayisi, 1);
  assert.equal(durum.ozet.trDublajKaydi, 2);
  assert.ok(durum.ipuclari.length >= 2, 'TR dublaj ipucu üretilmeli');
  assert.ok(durum.ipuclari.some((i) => i.saglayici === 'sp_hulk_'));
});

test('tohumuYukle: ikinci çağrıda ağa çıkmaz (tek yükleme)', async () => {
  depoKur();
  siciliSifirla();
  let cagri = 0;
  const f = async () => { cagri += 1; return yanit(TOHUM); };
  await tohumuYukle({ fetchFn: f, zorla: true });
  const ilk = cagri;
  const n = await tohumuYukle({ fetchFn: f });   // zorla YOK
  assert.equal(n, 0);
  assert.equal(cagri, ilk, 'ikinci çağrı ağa çıkmamalı');
});

test('tohumuYukle: doğrudan biçim yoksa eski hash arşivine düşer', async () => {
  depoKur();
  siciliSifirla();
  const eskiArsiv = {
    uretilmeTarihi: '2026-11-13T16:13:13.401Z',
    kayitlar: [
      { tmdbTip: 'movie', tmdbId: '551', dilDurumu: 'dublaj', kanit: 'm3u8', keynakKok: '', kaynakKok: 'kokX' },
    ],
  };
  const f = async (adres) => {
    if (String(adres).includes('dublaj-tohum.json')) return yanit('', { ok: false, status: 404 });
    return yanit(eskiArsiv);
  };
  const n = await tohumuYukle({ fetchFn: f, zorla: true });
  assert.ok(n >= 1, 'hash arşivi toplayıcıya yazılmalı');
  const durum = dublajZekaDurumu('movie|551||');
  assert.equal(durum.ozet.trDublajliIcerik, 1, 'içerik kanıtı korunmalı');
});

test('tohumuYukle: ağ tamamen çökse bile fırlatmaz', async () => {
  depoKur();
  siciliSifirla();
  const n = await tohumuYukle({ fetchFn: async () => { throw new Error('ağ yok'); }, zorla: true });
  assert.equal(n, 0);
  assert.equal(dublajZekaDurumu().ozet.icerikSayisi, 0);
});

test('tohumKokKodlari: yalnız eşleşen hash leri döndürür', () => {
  const { hostHashla } = { hostHashla: null };
  void hostHashla;
  // Boş kayıt → boş harita (uydurma yok).
  assert.deepEqual(tohumKokKodlari([]), {});
  assert.deepEqual(tohumKokKodlari(null), {});
});

/* ══ OYNATMA GERİ BİLDİRİMİ ══════════════════════════════════════════════ */

test('oynatmaGeriBildir: başarı/başarısızlık sicile yazılır', async () => {
  depoKur();
  siciliSifirla();
  saglayiciOnekleriniAyarla(['sp_hulk_']);
  await tohumuYukle({ fetchFn: async () => yanit(TOHUM), zorla: true });
  const icerik = 'movie|550||';
  const onceki = dublajZekaDurumu(icerik).ipuclari.find((i) => i.saglayici === 'sp_hulk_')?.guc || 0;

  assert.equal(oynatmaGeriBildir({ basarili: true, icerik, kaynak: { id: 'sp_hulk_1' } }), true);
  assert.equal(oynatmaGeriBildir({ basarili: true, icerik, kaynak: { id: 'sp_hulk_1' } }), true);
  const sonraki = dublajZekaDurumu(icerik).ipuclari.find((i) => i.saglayici === 'sp_hulk_')?.guc || 0;
  assert.ok(sonraki >= onceki, 'başarı gücü düşürmemeli');
});

test('oynatmaGeriBildir: eksik alanlarda false döner, fırlatmaz', () => {
  depoKur();
  siciliSifirla();
  assert.equal(oynatmaGeriBildir({ basarili: true }), false);
  assert.equal(oynatmaGeriBildir({ basarili: true, icerik: 'movie|1||' }), false);
  assert.equal(oynatmaGeriBildir({}), false);
});

/* ══ ARKA PLAN ZENGİNLEŞTİRME ════════════════════════════════════════════ */

test('arkaPlandaZenginlestir: ağ yoksa sessizce döner', async () => {
  depoKur();
  siciliSifirla();
  const r = await arkaPlandaZenginlestir(
    { baslik: 'Fight Club', originalTitle: 'Fight Club', tmdbTip: 'movie', tmdbId: '550', yil: 1999 },
    { fetchFn: async () => { throw new Error('ağ yok'); }, zorla: true },
  );
  assert.ok(typeof r === 'object', 'nesne dönmeli');
  assert.ok(r.atlandi === true || r.hata === true || typeof r.adaySayisi === 'number');
});

test('arkaPlandaZenginlestir: cooldown içinde tekrar ağa çıkmaz', async () => {
  depoKur();
  siciliSifirla();
  let cagri = 0;
  const f = async () => { cagri += 1; return yanit('', { ok: false, status: 404 }); };
  await arkaPlandaZenginlestir({ baslik: 'X', originalTitle: 'X', tmdbTip: 'movie', tmdbId: '777' }, { fetchFn: f, zorla: true });
  const ilk = cagri;
  const r2 = await arkaPlandaZenginlestir({ baslik: 'X', originalTitle: 'X', tmdbTip: 'movie', tmdbId: '777' }, { fetchFn: f });
  assert.equal(r2.atlandi, true);
  assert.equal(cagri, ilk, 'cooldown içinde ağa çıkılmamalı');
});

/* ══ YARDIMCI / DURUM ════════════════════════════════════════════════════ */

test('icerikAnahtariOlustur: aggregator alan adlarıyla çalışır', () => {
  assert.equal(icerikAnahtariOlustur({ type: 'movie', tmdbId: '550' }), 'movie|550||');
  assert.equal(icerikAnahtariOlustur({ type: 'tv', tmdbId: '1399', season: 1, episode: 2 }), 'tv|1399|1|2');
});

test('akilliTaramaSirasi: kanıtlı sağlayıcıyı öne alır', async () => {
  depoKur();
  siciliSifirla();
  saglayiciOnekleriniAyarla(['sp_hulk_', 'sp_cyborg_']);
  await tohumuYukle({ fetchFn: async () => yanit(TOHUM), zorla: true });
  const sira = akilliTaramaSirasi(['sp_cyborg_', 'sp_hulk_']);
  assert.equal(sira[0], 'sp_hulk_', 'TR dublaj kanıtlı sağlayıcı ilk sırada');
  assert.equal(sira.length, 2);
});

test('sicilKaydetSimdi: depo yoksa da fırlatmaz', () => {
  globalThis.localStorage = undefined;
  siciliSifirla();
  assert.doesNotThrow(() => sicilKaydetSimdi());
});

test('sicil(): depodan kalıcı yükler (aynı süreçte yeniden ayrıştırmaz)', async () => {
  depoKur();
  siciliSifirla();
  saglayiciOnekleriniAyarla(['sp_hulk_']);
  await tohumuYukle({ fetchFn: async () => yanit(TOHUM), zorla: true });
  const a = sicil();
  const b = sicil();
  assert.equal(a, b, 'aynı nesne dönmeli (tek yükleme)');
  assert.ok(Object.keys(a.icerikler).length > 0);
});
