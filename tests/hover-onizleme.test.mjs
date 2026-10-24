/* ==========================================================================
   Masaüstü kart hover fragman önizleme yöneticisi (src/services/kesif/hoverOnizleme.js)
   - Ağ yok, DOM yok, JSDOM yok: hafif stub'larla saf karar + kablosallık testleri.
   - Çalıştır: node --test tests/hover-onizleme.test.mjs
   ========================================================================== */
import test from 'node:test';
import assert from 'node:assert/strict';
import { kur, temizle, dinleyiciSayisi } from '../src/services/kesif/hoverOnizleme.js';
import { renderMediaCard } from '../src/components/MediaCard.js';
import { saveUserSettings } from '../src/services/altyapi/storage.js';

if (typeof globalThis.requestAnimationFrame === 'undefined') {
  globalThis.requestAnimationFrame = (fn) => fn();
}

const ORIGINAL_DOCUMENT = globalThis.document;
const ORIGINAL_WINDOW = globalThis.window;

function eleman(ozel = {}) {
  const cocuklar = [];
  const attr = {};
  const dinleyiciler = {};
  const qsCache = {};
  const el = {
    tagName: 'DIV',
    _attr: attr,
    _dinleyiciler: dinleyiciler,
    cocuklar,
    setAttribute: (k, v) => { attr[k] = String(v); },
    getAttribute: (k) => Object.prototype.hasOwnProperty.call(attr, k) ? attr[k] : null,
    addEventListener: (t, f) => { (dinleyiciler[t] = dinleyiciler[t] || []).push(f); },
    removeEventListener: () => {},
    appendChild: (c) => { cocuklar.push(c); c.ebeveyn = el; return c; },
    prepend: (c) => { cocuklar.unshift(c); c.ebeveyn = el; return c; },
    remove: () => { el.kaldirildi = true; },
    classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} },
    style: {},
    querySelector: (s) => {
      if (qsCache[s]) return qsCache[s];
      if (['.card-preview-title', '.card-preview-media', '.card-preview-close-btn', '.card-preview-actions'].includes(s)) return qsCache[s] = eleman();
      return null;
    },
    querySelectorAll: () => [],
    contains: (x) => x === el,
    getBoundingClientRect: () => ({ left: 100, top: 100, width: 120, height: 180, right: 220, bottom: 280 }),
    offsetWidth: 0, offsetHeight: 0,
    parentElement: null,
    isConnected: true,
    ...ozel
  };
  el.textContent = '';
  return el;
}

function olusturDOM() {
  const ekleyen = [];
  const cagri = [];
  const yakala = {};
  const doc = {
    addEventListener: (t, f) => { cagri.push(t); (yakala[t] = yakala[t] || []).push(f); },
    removeEventListener: () => {},
    querySelectorAll: () => [],
    createElement: () => eleman(),
    body: { appendChild: (el) => { ekleyen.push(el); return el; } },
    eklenen: ekleyen,
    documentElement: { style: {}, classList: { contains: () => false } }
  };
  return { doc, cagri, yakala };
}

function kartOlustur(ekAttr = {}) {
  const a = { 'data-id': '550', 'data-type': 'movie', 'data-tmdb-id': '550', ...ekAttr };
  const el = eleman({
    getAttribute: (k) => Object.prototype.hasOwnProperty.call(a, k) ? a[k] : null,
    closest: (s) => s === '.media-card' ? el : null
  });
  return el;
}

const VIDEO = {
  key: 'abc123', name: 'Resmi Fragman', site: 'YouTube', type: 'Trailer',
  embedUrl: 'https://www.youtube.com/embed/abc123?autoplay=1&rel=0&modestbranding=1&playsinline=1',
  watchUrl: 'https://www.youtube.com/watch?v=abc123'
};

const mikroIsleriBekle = () => new Promise((r) => setTimeout(r, 0));

function sifirla() {
  temizle();
  if (ORIGINAL_DOCUMENT === undefined) delete globalThis.document;
  else globalThis.document = ORIGINAL_DOCUMENT;
  if (ORIGINAL_WINDOW === undefined) delete globalThis.window;
  else globalThis.window = ORIGINAL_WINDOW;
}

function pencereStubu() {
  return { innerWidth: 1024, innerHeight: 768, addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => {} };
}

/* --- testler ----------------------------------------------------------- */

test('eşik süresi: 899 ms\'de önizleme açılmaz, 900 ms\'de açılır (saat enjekte)', async () => {
  sifirla();
  let saat = 0;
  const zamanlayicilar = [];
  const st = (fn, ms) => { zamanlayicilar.push({ fn, ms }); return { id: zamanlayicilar.length }; };
  const ct = (z) => { const i = zamanlayicilar.findIndex((x) => x.id === z.id); if (i >= 0) zamanlayicilar.splice(i, 1); };
  const { doc, yakala } = olusturDOM();
  globalThis.document = doc;
  globalThis.window = pencereStubu();

  let fetchSayisi = 0;
  const getVideoUrl = async () => { fetchSayisi++; return { ...VIDEO }; };
  kur(getVideoUrl, { simdi: () => saat, setTimeout: st, clearTimeout: ct });

  const kart = kartOlustur();
  yakala['mouseover'][0]({ target: kart, relatedTarget: null });
  assert.equal(fetchSayisi, 0);
  assert.equal(doc.eklenen.length, 0, 'eşikten önce önizleme eklenemez');

  const ilk = zamanlayicilar[0];
  assert.equal(ilk.ms, 900);
  saat = 899; ilk.fn(); await mikroIsleriBekle();
  assert.equal(doc.eklenen.length, 0, '899 ms\'de henüz açılmaz');
  assert.equal(zamanlayicilar.length, 2, 'kalan süre yeniden planlanır');
  assert.ok(zamanlayicilar[1].ms <= 1, 'kalan süre 1 ms veya daha az');

  saat = 900; zamanlayicilar[1].fn(); await mikroIsleriBekle();
  assert.equal(doc.eklenen.length, 1, '900 ms\'de önizleme eklenir');
  const onizleme = doc.eklenen[0];
  const media = onizleme.querySelector('.card-preview-media');
  const iframe = media.cocuklar[0];
  assert.ok(String(iframe.getAttribute('src') || '').includes('mute=1'), 'sessiz autoplay (mute=1)');
  assert.ok(String(iframe.getAttribute('src') || '').includes('playsinline=1'), 'playsinline');
  assert.equal(fetchSayisi, 1);
});

test('tek-aktif kuralı: yeni karta geçiş öncekini durdurur', async () => {
  sifirla();
  let saat = 100000;
  const zamanlayicilar = [];
  const st = (fn, ms) => { zamanlayicilar.push({ fn, ms }); return { id: zamanlayicilar.length }; };
  const ct = (z) => { const i = zamanlayicilar.findIndex((x) => x.id === z.id); if (i >= 0) zamanlayicilar.splice(i, 1); };
  const { doc, yakala } = olusturDOM();
  globalThis.document = doc;
  globalThis.window = pencereStubu();

  const getVideoUrl = async () => ({ ...VIDEO });
  kur(getVideoUrl, { simdi: () => saat, setTimeout: st, clearTimeout: ct });

  const kartA = kartOlustur();
  const kartB = kartOlustur({ 'data-id': '660', 'data-tmdb-id': '660' });

  yakala['mouseover'][0]({ target: kartA, relatedTarget: null });
  saat = 100900; zamanlayicilar[0].fn(); await mikroIsleriBekle();
  assert.equal(doc.eklenen.filter((e) => !e.kaldirildi).length, 1, 'A açık');

  yakala['mouseover'][0]({ target: kartB, relatedTarget: null });
  assert.equal(doc.eklenen.filter((e) => !e.kaldirildi).length, 0, 'A hemen durduruldu (tek aktif)');
  saat = 101800; zamanlayicilar[zamanlayicilar.length - 1].fn(); await mikroIsleriBekle();
  assert.equal(doc.eklenen.filter((e) => !e.kaldirildi).length, 1, 'sadece B açık');
});

test('tek-aktif: eşikteyken diğer karta geçiş öncekini iptal eder', async () => {
  sifirla();
  let saat = 0;
  const zamanlayicilar = [];
  const st = (fn, ms) => { zamanlayicilar.push({ fn, ms }); return { id: zamanlayicilar.length }; };
  const ct = (z) => { const i = zamanlayicilar.findIndex((x) => x.id === z.id); if (i >= 0) zamanlayicilar.splice(i, 1); };
  const { doc, yakala } = olusturDOM();
  globalThis.document = doc;
  globalThis.window = pencereStubu();

  kur(async () => ({ ...VIDEO }), { simdi: () => saat, setTimeout: st, clearTimeout: ct });

  const kartA = kartOlustur();
  const kartB = kartOlustur({ 'data-id': '660' });
  yakala['mouseover'][0]({ target: kartA, relatedTarget: null });
  saat = 400; zamanlayicilar[0].fn();           // A'nın zamanlayıcısı yarıda, kalan 500 ms
  assert.equal(zamanlayicilar.length, 2);
  yakala['mouseover'][0]({ target: kartB, relatedTarget: null });
  assert.equal(doc.eklenen.length, 0, 'A\'nın önizlemesi hiç açılmaz');
  saat = 1300; zamanlayicilar[zamanlayicilar.length - 1].fn(); await mikroIsleriBekle();   // 400 + 900
  assert.equal(doc.eklenen.length, 1, 'yalnız B açılır');
});

test('coarse pointer: (pointer: fine) değilse document düzeyinde dinleyici kurulmaz', () => {
  sifirla();
  const { doc, cagri } = olusturDOM();
  globalThis.document = doc;
  globalThis.window = { ...pencereStubu(), matchMedia: () => ({ matches: false, addEventListener: () => {} }) };
  const container = {
    _hasMediaEventsDelegated: false,
    addEventListener: (t, f) => cagri.push(t),
    querySelectorAll: () => []
  };
  return import('../src/components/MediaCard.js').then((mod) => {
    mod.attachMediaCardEvents(container);
    assert.ok(!cagri.includes('mouseover'), 'coarse-pointer\'da document düzeyinde dinleyici eklenmez');
    assert.ok(cagri.includes('click'), 'kart tıklaması hâlâ bağlanır');
  });
});

test('tercih kapalıyken kurma: dinleyici eklenmez', () => {
  sifirla();
  saveUserSettings({ hoverPreviewsEnabled: false });
  const { doc, cagri } = olusturDOM();
  globalThis.document = doc;
  globalThis.window = { ...pencereStubu(), matchMedia: () => ({ matches: true, addEventListener: () => {} }) };
  const container = {
    _hasMediaEventsDelegated: false,
    addEventListener: (t, f) => cagri.push(t),
    querySelectorAll: () => []
  };
  return import('../src/components/MediaCard.js').then((mod) => {
    mod.attachMediaCardEvents(container);
    assert.ok(!cagri.includes('mouseover'), 'tercih kapalıyken kurulum çağrılmaz');
    assert.ok(cagri.includes('click'));
  });
});

test('tercih açık olduğunda kurulum çağrılır', () => {
  sifirla();
  saveUserSettings({ hoverPreviewsEnabled: true });
  const { doc, cagri } = olusturDOM();
  globalThis.document = doc;
  globalThis.window = { ...pencereStubu(), matchMedia: () => ({ matches: true, addEventListener: () => {} }) };
  const container = {
    _hasMediaEventsDelegated: false,
    addEventListener: (t, f) => cagri.push(t),
    querySelectorAll: () => []
  };
  return import('../src/components/MediaCard.js').then((mod) => {
    mod.attachMediaCardEvents(container);
    assert.ok(cagri.includes('mouseover'), 'tercih açık + imleç aygıtı => document düzeyinde dinleyici');
  });
});

test('kart markup hook\'u: data-tmdb-id ve data-type render edilir', () => {
  const html = renderMediaCard({ id: 550, title: 'Test', poster_path: '/p.jpg', release_date: '2024-01-01', vote_average: 8 }, { skipProgressLookup: true });
  assert.ok(html.includes('data-tmdb-id="550"'), 'data-tmdb-id hook\'u kartta var');
  assert.ok(html.includes('data-type="movie"'), 'data-type var');
});

test('bellek önbelleği: 60 sn içinde tek istek, TTL sonrası yeniler', async () => {
  sifirla();
  let saat = 0;
  const zamanlayicilar = [];
  const st = (fn, ms) => { zamanlayicilar.push({ fn, ms }); return { id: zamanlayicilar.length }; };
  const ct = (z) => { const i = zamanlayicilar.findIndex((x) => x.id === z.id); if (i >= 0) zamanlayicilar.splice(i, 1); };
  const { doc, yakala } = olusturDOM();
  globalThis.document = doc;
  globalThis.window = pencereStubu();

  let fetchSayisi = 0;
  const getVideoUrl = async () => { fetchSayisi++; return { ...VIDEO }; };
  kur(getVideoUrl, { simdi: () => saat, setTimeout: st, clearTimeout: ct });

  const kart = kartOlustur();
  const sonrakiniCalistir = () => { zamanlayicilar[zamanlayicilar.length - 1].fn(); };
  const hareket = async (k) => { yakala['mouseover'][0]({ target: k, relatedTarget: null }); await mikroIsleriBekle(); };

  await hareket(kart); saat = 900; sonrakiniCalistir(); await mikroIsleriBekle();   // istek #1
  assert.equal(fetchSayisi, 1);
  await hareket(kart); saat = 1900; sonrakiniCalistir(); await mikroIsleriBekle();  // 60 sn içinde → önbellekten gösterilir
  assert.equal(fetchSayisi, 1, '60 sn içinde aynı kart tek istek');
  assert.equal(doc.eklenen.filter((e) => !e.kaldirildi).length, 1);

  saat = 60901;                                                  // TTL (60 sn) doldu
  await hareket(kart); saat = 61801; sonrakiniCalistir(); await mikroIsleriBekle();
  assert.equal(fetchSayisi, 2, 'TTL sonrası yeniden çekilir');
});

test('ağ hatası sessiz: kart aynen kalır, hiçbir şey açılmaz', async () => {
  sifirla();
  let saat = 0;
  const zamanlayicilar = [];
  const st = (fn, ms) => { zamanlayicilar.push({ fn, ms }); return { id: zamanlayicilar.length }; };
  const ct = (z) => { const i = zamanlayicilar.findIndex((x) => x.id === z.id); if (i >= 0) zamanlayicilar.splice(i, 1); };
  const { doc, yakala } = olusturDOM();
  globalThis.document = doc;
  globalThis.window = pencereStubu();

  const getVideoUrl = async () => { throw new Error('ağ yok'); };
  kur(getVideoUrl, { simdi: () => saat, setTimeout: st, clearTimeout: ct });

  const kart = kartOlustur();
  yakala['mouseover'][0]({ target: kart, relatedTarget: null });
  saat = 900; zamanlayicilar[0].fn(); await mikroIsleriBekle();
  assert.equal(doc.eklenen.length, 0, 'ağ hatası sessiz: önizleme eklenmez');
});

test('temizle: eşit sayıda ekleme/çıkarma, dinleyici sayısı sıfırlanır', () => {
  sifirla();
  const { doc, cagri } = olusturDOM();
  let cikarma = 0;
  doc.removeEventListener = () => { cikarma++; };
  globalThis.document = doc;
  globalThis.window = pencereStubu();

  kur(async () => ({ ...VIDEO }));
  assert.equal(cagri.filter((t) => t === 'mouseover').length, 1);
  assert.equal(cagri.filter((t) => t === 'mouseout').length, 1);
  assert.equal(cagri.filter((t) => t === 'scroll').length, 1);
  assert.equal(cagri.filter((t) => t === 'resize').length, 1);
  assert.equal(cagri.filter((t) => t === 'keydown').length, 1);
  assert.equal(dinleyiciSayisi(), 5);

  temizle();
  assert.equal(cikarma, 5, '5 dinleyici çıkarıldı');
  assert.equal(dinleyiciSayisi(), 0, 'dinleyici sayısı sıfırlandı');
});

test('iptaller: kart dışı çıkış / scroll / ESC önizlemeyi kapatır', async () => {
  sifirla();
  let saat = 100000;
  const zamanlayicilar = [];
  const st = (fn, ms) => { zamanlayicilar.push({ fn, ms }); return { id: zamanlayicilar.length }; };
  const ct = (z) => { const i = zamanlayicilar.findIndex((x) => x.id === z.id); if (i >= 0) zamanlayicilar.splice(i, 1); };
  const { doc, yakala } = olusturDOM();
  globalThis.document = doc;
  globalThis.window = pencereStubu();

  kur(async () => ({ ...VIDEO }), { simdi: () => saat, setTimeout: st, clearTimeout: ct });
  const kart = kartOlustur();
  const hareket = async (k) => { yakala['mouseover'][0]({ target: k, relatedTarget: null }); await mikroIsleriBekle(); };
  const acikMi = () => doc.eklenen.filter((e) => !e.kaldirildi).length;

  await hareket(kart); saat = 100900; zamanlayicilar[0].fn(); await mikroIsleriBekle();
  assert.equal(acikMi(), 1);

  yakala['mouseout'][0]({ target: kart, relatedTarget: null });
  assert.equal(acikMi(), 1, 'anında kapanmaz (tolerans)');
  const cap = zamanlayicilar[zamanlayicilar.length - 1];
  assert.equal(cap.ms, 300);
  cap.fn(); saat += 300; await mikroIsleriBekle();
  assert.equal(acikMi(), 0, 'kart dışı çıkış sonrası kapanır');

  await hareket(kart); saat = 102100; zamanlayicilar[zamanlayicilar.length - 1].fn(); await mikroIsleriBekle();
  assert.equal(acikMi(), 1);
  yakala['scroll'][0]({}); await mikroIsleriBekle();
  assert.equal(acikMi(), 0, 'scroll kapanıyor');

  await hareket(kart); saat = 103000; zamanlayicilar[zamanlayicilar.length - 1].fn(); await mikroIsleriBekle();
  assert.equal(acikMi(), 1);
  yakala['keydown'][0]({ key: 'Escape' }); await mikroIsleriBekle();
  assert.equal(acikMi(), 0, 'ESC kapanıyor');
});

test('önizlemeye doğru fare geçişinde kapanma iptal edilir (tolerans)', async () => {
  sifirla();
  let saat = 100000;
  const zamanlayicilar = [];
  const st = (fn, ms) => { zamanlayicilar.push({ fn, ms }); return { id: zamanlayicilar.length }; };
  const ct = (z) => { const i = zamanlayicilar.findIndex((x) => x.id === z.id); if (i >= 0) zamanlayicilar.splice(i, 1); };
  const { doc, yakala } = olusturDOM();
  globalThis.document = doc;
  globalThis.window = pencereStubu();

  kur(async () => ({ ...VIDEO }), { simdi: () => saat, setTimeout: st, clearTimeout: ct });
  const kart = kartOlustur();
  yakala['mouseover'][0]({ target: kart, relatedTarget: null });
  saat = 100900; zamanlayicilar[0].fn(); await mikroIsleriBekle();
  const onizleme = doc.eklenen[0];
  assert.equal(doc.eklenen.filter((e) => !e.kaldirildi).length, 1);

  const once = zamanlayicilar.length;
  yakala['mouseout'][0]({ target: kart, relatedTarget: onizleme });
  assert.equal(zamanlayicilar.length, once, 'önizlemeye doğru geçişte bekleme planlanmaz');
  assert.equal(doc.eklenen.filter((e) => !e.kaldirildi).length, 1);

  // diğer test dosyalarının aynı işlemde okuması için varsayıla dön
  saveUserSettings({ hoverPreviewsEnabled: false });
});
