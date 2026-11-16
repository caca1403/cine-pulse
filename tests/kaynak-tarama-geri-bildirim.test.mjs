/* ==========================================================================
   Kaynak tarama geri bildirimi — detay sayfası kaynak listesi (kaynakListesi)
   --------------------------------------------------------------------------
   - Ağ yok, JSDOM yok: hafif document/window stub'larıyla davranış testi.
   - kaynakListesi.js'deki .css yan-etki import'u registerHooks ile boş moda
     alınır; providerAggregator.js kaynağa bağlı bir taklitle değiştirilir,
     böylece additive alanlar (saglayiciHatasi / cekirdekYok /
     tamamlananSaglayici) onUpdate üzerinden denetlenir.
   - EKRANA sağlayıcı/kahraman adı asla yazılmayan kuralı testte de zorunlu
     tutulur: şeritte yalnız sayı ve durum metni olabilir.
   - Çalıştır: node --test tests/kaynak-tarama-geri-bildirim.test.mjs
   ========================================================================== */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { registerHooks } from 'node:module';

const KOK = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

/* ----------------------------------------------------------------
   Import-time çevre susturma:
     * .css import'u -> boş modül (Node CSS modülü bilmez)
     * providerAggregator.js (yalnız kaynakListesi.js üzerinden) ->
       denetimli taklit: onUpdate'ı dışarı açar, bitişi testin çağırmasıyla olur.
   ---------------------------------------------------------------- */

globalThis.__cp_agg_cagri = 0;
globalThis.__cp_sonOnUpdate = null;
globalThis.__cp_sonBitir = null;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.endsWith('.css')) {
      return { shortCircuit: true, url: new URL(specifier, context.parentURL).href, format: 'module' };
    }
    if (specifier.endsWith('providerAggregator.js') && context.parentURL.endsWith('kaynakListesi.js')) {
      return {
        shortCircuit: true,
        url: 'data:application/javascript,' + encodeURIComponent(`
export async function getStreamingServersProgressive(opts = {}) {
  globalThis.__cp_agg_cagri += 1;
  const onUpdate = typeof opts.onUpdate === 'function' ? opts.onUpdate : () => {};
  globalThis.__cp_sonOnUpdate = onUpdate;
  return new Promise(res => { globalThis.__cp_sonBitir = res; });
}
`),
        format: 'module',
      };
    }
    return nextResolve(specifier);
  },
  load(url, context, nextLoad) {
    if (String(url).endsWith('.css')) return { format: 'module', source: '', shortCircuit: true };
    return nextLoad(url);
  },
});

/* ----------------------------------------------------------------
   Test ortamı stub'ları (kaynakListesi + bağlı modülleri için)
   ---------------------------------------------------------------- */

const depolama = new Map();
globalThis.localStorage = {
  getItem: (k) => (depolama.has(k) ? depolama.get(k) : null),
  setItem: (k, v) => depolama.set(k, String(v)),
  removeItem: (k) => depolama.delete(k),
  clear: () => depolama.clear(),
};
globalThis.sessionStorage = {
  getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {}
};

const { webcrypto } = await import('node:crypto');
if (!globalThis.crypto) globalThis.crypto = webcrypto;

const ASLI_FETCH = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : String(input && input.url || '');
  if (/^https?:\/\//i.test(url)) {
    return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
  }
  return ASLI_FETCH(input, init);
};

// renderIcons(window.lucide) gerekir; storage.js gibi modüller import
// zamanında window.addEventListener çağırır, dolayı window gerçek bir stub
// olmalı (lucide tanımsız kalmalı; nuvio motoru vekil.js'ini çekmeyecekse de
// bu testte sourceDecay gibi ağır zincir yoktur).
globalThis.window = {
  addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => true,
  lucide: undefined,
  location: { hostname: 'localhost', protocol: 'https:' },
  matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
};

function digerEl(ozel = {}) {
  const cocuklar = [];
  const attr = {};
  const dinleyiciler = {};
  const el = {
    tagName: 'DIV',
    _attr: attr,
    _cocuklar: cocuklar,
    _dinleyiciler: dinleyiciler,
    setAttribute: (k, v) => { attr[String(k)] = String(v); },
    getAttribute: (k) => Object.prototype.hasOwnProperty.call(attr, k) ? attr[k] : null,
    removeAttribute: (k) => { delete attr[k]; },
    hasAttribute: (k) => Object.prototype.hasOwnProperty.call(attr, k),
    addEventListener: (t, f) => { (dinleyiciler[t] = dinleyiciler[t] || []).push(f); },
    removeEventListener: () => {},
    appendChild: (c) => { cocuklar.push(c); if (c) c.ebeveyn = el; return c; },
    removeChild: (c) => { const i = cocuklar.indexOf(c); if (i >= 0) cocuklar.splice(i, 1); return c; },
    remove: () => { const p = el.ebeveyn; if (p) p.removeChild(el); el.kaldirildi = true; },
    classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => true },
    style: {},
    get className() { return attr['class'] || ''; },
    set className(v) { attr['class'] = v; },
    get dataset() {
      const d = {};
      for (const k of Object.keys(attr)) {
        if (k.startsWith('data-')) d[k.slice(5)] = attr[k];
      }
      return d;
    },
    querySelector: (s) => bul(cocuklar, s),
    querySelectorAll: (s) => bulTum(cocuklar, s),
    closest: (s) => { let e = el; while (e) { if (eslesSelector(e, s)) return e; e = e.ebeveyn; } return null; },
    get innerHTML() { return serialize(cocuklar); },
    set innerHTML(html) { cocuklar.length = 0; cocuklar.push(...parse(html)); },
    get textContent() { return metinTopla(cocuklar); },
    set textContent(v) { cocuklar.length = 0; cocuklar.push({ _text: String(v) }); },
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0 }),
    offsetWidth: 0, offsetHeight: 0,
    parentElement: null,
    isConnected: true,
    matches: () => false,
    ...ozel
  };
  return el;
}

function parseAttrs(s, el) {
  const re = /([\w:-]+)\s*=\s*"([^"]*)"|([\w:-]+)\s*=\s*'([^']*)'|([\w:-]+)/g;
  let m;
  while ((m = re.exec(s))) {
    if (m[1] !== undefined) el.setAttribute(m[1], m[2]);
    else if (m[3] !== undefined) el.setAttribute(m[3], m[4]);
    else el.setAttribute(m[5], '');
  }
}

function parse(html) {
  const kok = { cocuklar: [] };
  let i = 0;
  function parca(durdur) {
    const cocuklar = [];
    while (i < html.length) {
      if (html[i] === '<') {
        const kapama = /^\<\/\s*([a-zA-Z0-9]+)\s*\>/.exec(html.slice(i));
        if (kapama && (!durdur || kapama[1].toLowerCase() === durdur.toLowerCase())) {
          i += kapama[0].length;
          return cocuklar;
        }
        const acilma = /^\<([a-zA-Z0-9]+)([^\>]*)\>/.exec(html.slice(i));
        if (acilma) {
          i += acilma[0].length;
          const el = digerEl({ tagName: acilma[1].toUpperCase() });
          parseAttrs(acilma[2], el);
          el._cocuklar.push(...parca(acilma[1]));
          cocuklar.push(el);
          continue;
        }
      }
      const sonrakı = html.indexOf('<', i);
      if (sonrakı < 0) { cocuklar.push({ _text: html.slice(i) }); i = html.length; break; }
      if (sonrakı > i) cocuklar.push({ _text: html.slice(i, sonrakı) });
      i = sonrakı;
    }
    return cocuklar;
  }
  kok.cocuklar.push(...parca(null));
  return kok.cocuklar;
}

function escapeHtml(metin) {
  return String(metin)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function serialize(dugumler) {
  return dugumler.map(d => {
    if (d._text) return escapeHtml(d._text);
    const attrs = Object.entries(d._attr).map(([k, v]) => ` ${k}="${escapeHtml(v)}"`).join('');
    return `<${d.tagName.toLowerCase()}${attrs}>${serialize(d._cocuklar)}</${d.tagName.toLowerCase()}>`;
  }).join('');
}

function metinTopla(dugumler) {
  return dugumler.map(d => (d._text ? d._text : metinTopla(d._cocuklar))).join('');
}

function eslesSelector(el, s) {
  s = s.trim();
  if (s.startsWith('.')) return (el.getAttribute('class') || '').split(/\s+/).includes(s.slice(1));
  if (s.startsWith('[')) {
    const m = /^\[([\w:-]+)(?:=["']([^"']*)["'])?\]$/.exec(s);
    if (!m) return false;
    const v = el.getAttribute(m[1]);
    return v !== null && (m[2] === undefined || v === m[2]);
  }
  return el.tagName.toLowerCase() === s.toLowerCase();
}

function bul(dugumler, s) {
  for (const d of dugumler) {
    if (d && d._text !== undefined) continue;
    if (eslesSelector(d, s)) return d;
    const bulunan = bul(d._cocuklar, s);
    if (bulunan) return bulunan;
  }
  return null;
}

function bulTum(dugumler, s, bulunan = []) {
  for (const d of dugumler) {
    if (d && d._text !== undefined) continue;
    if (eslesSelector(d, s)) bulunan.push(d);
    bulTum(d._cocuklar, s, bulunan);
  }
  return bulunan;
}

globalThis.document = {
  addEventListener: () => {}, removeEventListener: () => {},
  querySelector: () => null, querySelectorAll: () => [],
  createElement: () => digerEl(),
  body: digerEl({ tagName: 'BODY' }),
  documentElement: digerEl({ tagName: 'HTML' }),
};

/* ----------------------------------------------------------------
   Gerçek modülü içe aktar (hook'lar etkindedir)
   ---------------------------------------------------------------- */

const { kaynakListesiOlustur } = await import('../src/components/kaynakListesi.js');

/* ----------------------------------------------------------------
   Test yardımcıları
   ---------------------------------------------------------------- */

function bekle(ms = 20) { return new Promise(res => setTimeout(res, ms)); }

// Toplayıcı ve eklenti finally'lerinin ikisini de düşürüp şeridi bitiş
// metinine getirir (tüm işlemler stub'lı olduğunda çok kısa sürer).
async function sonucaBekle(durumKok) {
  for (let i = 0; i < 100; i++) {
    const metin = durumKok.textContent;
    if (/denendi \(tamamlandı\)|bulunamadı|yüklenemedi/.test(metin)) return metin;
    await bekle(20);
  }
  assert.fail('durum şeridi bitiş metinine düşmedi: "' + durumKok.textContent + '"');
}

function yeniListe(tmdbId = '550') {
  const kok = digerEl({ tagName: 'DIV' });
  const liste = kaynakListesiOlustur({ kok, tur: 'movie', tmdbId, baslik: 'Test İçerik' });
  const durumKok = kok.querySelector('.kaynak-durum');
  assert.equal(durumKok.getAttribute('role'), 'status');
  assert.equal(durumKok.getAttribute('aria-live'), 'polite');
  return { kok, liste, durumKok };
}

function stream(url, id) {
  return {
    streamUrl: url, url: url, title: 'Örnek Yayın', displayName: 'Örnek Yayın',
    id: id, source: 'Test'
  };
}

const ORNEK_STREAM = stream('https://cdn.example.com/a/playlist.m3u8', 's1');

/* ----------------------------------------------------------------
   Testler
   ---------------------------------------------------------------- */

test('baslat: detay açılışında koşulsuz çalışır; ikinci çağrı atılır (tek tarama)', async () => {
  globalThis.__cp_agg_cagri = 0;
  globalThis.__cp_sonOnUpdate = null;
  globalThis.__cp_sonBitir = null;
  const { liste, durumKok } = yeniListe('551');
  liste.baslat();
  liste.baslat(); // idempotent: aynı tarama iki kez başlamamalı
  assert.equal(globalThis.__cp_agg_cagri, 1, 'baslat() tek seferde toplayıcıyı çağırmalı');

  // Tarama gerçekten başlar: ilk onUpdate ile canlı şerit düşer.
  globalThis.__cp_sonOnUpdate({
    dubbed: [ORNEK_STREAM],
    subtitled: [],
    totalServers: 1,
    isComplete: false,
    saglayiciHatasi: [],
    cekirdekYok: 0,
    tamamlananSaglayici: 'Sunucu-A',
  });
  assert.match(durumKok.textContent, /1 kaynak bulundu · 1 sağlayıcı tamamlandı · taranıyor…/);
  assert.ok(!durumKok.textContent.includes('Sunucu-A'), 'sağlayıcı adı ekrana yazılmamalı');
});

test('canli serit: "N kaynak bulundu · X sağlayıcı tamamlandı · taranıyor…"', async () => {
  globalThis.__cp_agg_cagri = 0;
  globalThis.__cp_sonOnUpdate = null;
  globalThis.__cp_sonBitir = null;
  const { kok, liste, durumKok } = yeniListe('552');
  liste.baslat();
  assert.equal(globalThis.__cp_agg_cagri, 1);

  globalThis.__cp_sonOnUpdate({
    dubbed: [ORNEK_STREAM],
    subtitled: [],
    totalServers: 1,
    isComplete: false,
    saglayiciHatasi: [],
    cekirdekYok: 0,
    tamamlananSaglayici: 'Sunucu-A',
  });
  assert.match(durumKok.textContent, /1 kaynak bulundu · 1 sağlayıcı tamamlandı · taranıyor…/);
  assert.ok(!durumKok.textContent.includes('Sunucu-A'), 'sağlayıcı adı ekrana yazılmamalı');

  const s2 = stream('https://cdn.example.com/b/playlist.m3u8', 's2');
  const s3 = stream('https://cdn.example.com/c/playlist.m3u8', 's3');
  globalThis.__cp_sonOnUpdate({
    dubbed: [ORNEK_STREAM, s2, s3],
    subtitled: [],
    totalServers: 3,
    isComplete: false,
    saglayiciHatasi: [{ ad: 'Sunucu-B', kod: 'ag-hatasi' }],
    cekirdekYok: 0,
    tamamlananSaglayici: 'Sunucu-C',
  });
  assert.match(durumKok.textContent, /3 kaynak bulundu · 2 sağlayıcı tamamlandı · taranıyor…/);
  assert.ok(!durumKok.textContent.includes('Sunucu-B'), 'hatalı sağlayıcı adı da ekrana yazılmamalı');

  globalThis.__cp_sonBitir();
  const son = await sonucaBekle(durumKok);
  // tamamlanan {A, C} = 2 + yanıtsız {B} = 1 → 3 sağlayıcı denendi
  assert.match(son, /3 kaynak · 3 sağlayıcı denendi \(tamamlandı\)/);
  assert.ok(!/Sunucu|ag-hatasi|butce/.test(son), 'sağlayıcı adı/kodu sızdırılmamalı');
});

test('kaynak yok ve cekirdekYok: dürüst neden + rehber', async () => {
  globalThis.__cp_agg_cagri = 0;
  globalThis.__cp_sonOnUpdate = null;
  globalThis.__cp_sonBitir = null;
  const { liste, durumKok } = yeniListe('553');
  liste.baslat();
  listeyeBitir(durumKok, {
    dubbed: [], subtitled: [], totalServers: 0, isComplete: true,
    saglayiciHatasi: [], cekirdekYok: 2, tamamlananSaglayici: '',
  });
  const metin = await sonucaBekle(durumKok);
  assert.match(metin, /Kaynak çekirdeği yüklenemedi, içerik taranamadı/);
  assert.match(metin, /İnternet bağlantınızı kontrol edin ve tekrar deneyin/);
});

test('kaynak yok ve saglayiciHatasi: sayı gösterilir, isim gizli', async () => {
  globalThis.__cp_agg_cagri = 0;
  globalThis.__cp_sonOnUpdate = null;
  globalThis.__cp_sonBitir = null;
  const { liste, durumKok } = yeniListe('554');
  liste.baslat();
  listeyeBitir(durumKok, {
    dubbed: [], subtitled: [], totalServers: 0, isComplete: true,
    saglayiciHatasi: [
      { ad: 'Sunucu-X', kod: 'butce-asim' },
      { ad: 'Sunucu-Y', kod: 'yukleme-asim' }
    ],
    cekirdekYok: 0,
    tamamlananSaglayici: '',
  });
  const metin = await sonucaBekle(durumKok);
  assert.match(metin, /2 sağlayıcı yanıt vermedi, kaynak bulunamadı/);
  assert.match(metin, /Farklı bir bölüm deneyin veya daha sonra tekrar deneyin/);
  assert.ok(!metin.includes('Sunucu-X') && !metin.includes('Sunucu-Y'), 'sağlayıcı isimleri ekrana yazılmamalı');
});

test('kaynak yok ve her şey boş: varsayılan dürüst satır + rehber', async () => {
  globalThis.__cp_agg_cagri = 0;
  globalThis.__cp_sonOnUpdate = null;
  globalThis.__cp_sonBitir = null;
  const { liste, durumKok } = yeniListe('555');
  liste.baslat();
  listeyeBitir(durumKok, {
    dubbed: [], subtitled: [], totalServers: 0, isComplete: true,
    saglayiciHatasi: [], cekirdekYok: 0, tamamlananSaglayici: '',
  });
  const metin = await sonucaBekle(durumKok);
  assert.match(metin, /Bu içerik için oynatılabilir kaynak bulunamadı/);
  assert.match(metin, /Farklı bir sezon\/bölüm deneyin veya daha sonra tekrar deneyin/);
});

test('DetailView: kaynak paneli kaldırıldı — oynatıcı DOĞRUDAN açılır (2026-11-14)', () => {
  const detailView = fs.readFileSync(path.join(KOK, 'src/views/DetailView.js'), 'utf8');
  // KAYNAKLAR sekmesi/paneli ve kaynak listesi bileşeni detaydan TAMAMEN çıktı
  // (kullanıcı 2026-11-14: "detayda yalnız bölüm yönetimi; kaynak player içinde").
  assert.ok(!detailView.includes('kaynakListesiOlustur'), 'kaynakListesiOlustur artık kullanılmamalı');
  assert.ok(!detailView.includes('kaynakListesi.baslat'), 'kaynak taraması detayda artık koşmaz (oynatıcı koşar)');
  assert.ok(!detailView.includes('data-panel="sources"'), 'KAYNAKLAR paneli çizilmemeli');
  // Oynatma yolları doğrudan oynatıcıyı açar: İzle/Devam Et ve bölüm kartı.
  assert.match(detailView, /playMovieBtn\.addEventListener\('click', \(event\) => \{[\s\S]{0,120}?openMovie\(\);/);
  assert.match(detailView, /resumeSeriesBtn\.addEventListener\('click', event => \{[\s\S]{0,120}?openSeries\(\);/);
  assert.match(detailView, /cp:kaynak-bolum'[\s\S]{0,400}?bolumOynat\(/);
});

/* ----------------------------------------------------------------
   Yerel yardımcılar (testler arasında sıfırlanmış durumda)
   ---------------------------------------------------------------- */

function listeyeBitir(durumKok, payload) {
  // toplayıcıdan bir geliş ve hemen bitiş; eklenti dalı daStub'lı olduğuyle
  // kısa sürede kendi finally'sini düşer.
  if (typeof globalThis.__cp_sonOnUpdate === 'function') {
    globalThis.__cp_sonOnUpdate(payload);
  }
  if (typeof globalThis.__cp_sonBitir === 'function') {
    globalThis.__cp_sonBitir();
  }
}
