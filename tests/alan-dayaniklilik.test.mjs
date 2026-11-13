import test from 'node:test';
import assert from 'node:assert/strict';

import {
  alanYedekAdresleri, alanYedekOnayla, alanAdaylari, alanlariSifirla,
  alanYaniti, kayitliAlanlariUygula, canliAlanlariYenile, gerektigindeYenile,
  alanTazelemeDurumu, ALAN_OMUR_MS,
} from '../src/providers/alanlar.js';
import { kopruFetch, oynatmaAdresi } from '../src/providers/vekil.js';
import { saglayiciYaniti } from '../cf/provider-routes.js';
import { proxyYedekDene } from '../cf/proxy-failover.js';

/* DAYANIKLILIK (2026-11-13) — kullanıcı gereksinimi:
   "site tamamen çökmediği sürece kaynaklar asla bozulmasın".
   Katmanlar: (1) aday/mirror havuzu + şeffaf yedek deneme, (2) "yalnız
   iyileştir" kuralı (çalışan alan ezilmez), (3) çevrimdışı son iyi harita,
   (4) periyodik/on-demand tazeleme. Hepsi AĞSIZ, fetch enjekte edilerek. */

function temizle() {
  alanlariSifirla();
  try { delete globalThis.localStorage; } catch (_) { /* yok */ }
}

function sahteListeFetch({ patr0nOk = false, izlelan = {}, durumlar = {}, sayac = null } = {}) {
  return async (url) => {
    const u = String(url);
    if (sayac) sayac.adet += 1;
    if (u.includes('patr0nq')) {
      return patr0nOk
        ? { ok: true, text: async () => 'dizipal:https://dizipal9999.com' }
        : { ok: false, status: 404 };
    }
    if (u.includes('izlelan.com')) {
      return { ok: true, json: async () => ({ ok: true, data: { domains: izlelan, disabled: {} } }) };
    }
    if (u.includes('/api/proxy?url=')) {
      const hedef = decodeURIComponent(u.split('url=')[1].split('&')[0] || '');
      for (const [ad, kod] of Object.entries(durumlar)) {
        if (hedef.startsWith(ad)) return { status: kod };
      }
      return { status: 200 };
    }
    return { ok: false, status: 404 };
  };
}

/* ── (1) Birincil domain düşerse aynı istek yedek aynaya şeffaf gider ──── */
test('birincil alan 5xx → ikinci aday denenir, yanıt aynı isteğe döner', async () => {
  temizle();
  const asil = globalThis.fetch;
  const cagrilar = [];
  globalThis.fetch = async (girdi) => {
    const adres = String(girdi);
    cagrilar.push(adres);
    const hedef = decodeURIComponent((adres.split('url=')[1] || '').split('&')[0] || '');
    if (hedef.startsWith('https://dizipal1595.com')) {
      return new Response('upstream down', { status: 503 });
    }
    if (hedef.startsWith('https://dizipal2149.com')) {
      return new Response(JSON.stringify({ ok: 'yedek' }), { status: 200, headers: { 'content-type': 'application/json' } });
    }
    return new Response('yok', { status: 404 });
  };
  try {
    const cevap = await kopruFetch('https://dizipal1595.com/foo/bar?x=1');
    assert.equal(cevap.status, 200, 'şeffaf yedek yanıtı dönmeli');
    assert.deepEqual(await cevap.json(), { ok: 'yedek' });
    assert.equal(cagrilar.length, 2, `birincil + yedek = 2 istek, ${cagrilar.length} gitti`);
    const sonHedef = new URL(cagrilar[1]).searchParams.get('url');
    assert.equal(sonHedef, 'https://dizipal2149.com/foo/bar?x=1', 'aynı yol+yol sorgusu yedek origin’e taşınmalı');
    // Çalışan hat birincil yapılır (birincil zaten ölçülmüş ölüydü).
    assert.equal(alanYaniti().domains['Iron-Fist'], 'https://dizipal2149.com');
  } finally {
    globalThis.fetch = asil;
    temizle();
  }
});

test('alanYedekAdresleri aynı yolu farklı origin’e taşır, bilinmeyen host’a dokunmaz', () => {
  temizle();
  const yedekler = alanYedekAdresleri('https://dizipal1595.com/path/a?q=1');
  assert.ok(yedekler.length >= 1);
  assert.ok(yedekler.some((y) => y.url === 'https://dizipal2149.com/path/a?q=1'));
  assert.equal(yedekler.some((y) => y.url.includes('dizipal1595.com')), false, 'kendisi yedek olmamalı');
  assert.deepEqual(alanYedekAdresleri('https://bilinmeyen.example/x'), []);
  assert.deepEqual(alanYedekAdresleri('bozuk-adres'), []);
});

test('alanAdaylari birincil + aile aynalarını döndürür', () => {
  temizle();
  const adaylar = alanAdaylari('Iron-Fist');
  assert.equal(adaylar[0], 'https://dizipal1595.com');
  assert.ok(adaylar.includes('https://dizipal2149.com'), 'aile aynası aday havuzunda');
});

/* ── (2) Çalışan alan asla ezilmez · (3) tüm adaylar ölüyse mevcut korunur ── */
test('mevcut alan canlıysa canlı liste onu EZMEZ', async () => {
  temizle();
  try {
    await canliAlanlariYenile(sahteListeFetch({
      patr0nOk: false,
      izlelan: { noland: 'https://dizi90.life' },
      durumlar: { 'https://dizi86.life': 200, 'https://dizi90.life': 200 },
    }));
    assert.equal(alanYaniti().domains['Spider-Woman'], 'https://dizi86.life');
  } finally { temizle(); }
});

test('tüm adaylar düşükse mevcut alan korunur (boş değere düşmez)', async () => {
  temizle();
  try {
    await canliAlanlariYenile(sahteListeFetch({
      patr0nOk: false,
      izlelan: { noland: 'https://dizi90.life' },
      durumlar: { 'https://dizi86.life': 503, 'https://dizi90.life': 503 },
    }));
    assert.equal(alanYaniti().domains['Spider-Woman'], 'https://dizi86.life');
  } finally { temizle(); }
});

test('ölü mevcut + canlı aday → iyileştirir ve aday havuzuna kalıcı ekler', async () => {
  temizle();
  try {
    const n = await canliAlanlariYenile(sahteListeFetch({
      patr0nOk: false,
      izlelan: { noland: 'https://dizi90.life' },
      durumlar: { 'https://dizi86.life': 503, 'https://dizi90.life': 200 },
    }));
    assert.ok(n >= 1);
    assert.equal(alanYaniti().domains['Spider-Woman'], 'https://dizi90.life');
    assert.ok(alanAdaylari('Spider-Woman').includes('https://dizi86.life'), 'eski alan yedek olarak kalmalı');
  } finally { temizle(); }
});

/* ── (4) Çevrimdışı: localStorage’daki son iyi harita uygulanır ─────────── */
test('çevrimdışı başlangıçta son iyi harita + adaylar uygulanır', () => {
  temizle();
  const depo = new Map();
  globalThis.localStorage = {
    getItem: (k) => (depo.has(k) ? depo.get(k) : null),
    setItem: (k, v) => depo.set(k, String(v)),
    removeItem: (k) => depo.delete(k),
  };
  try {
    const taze = {
      t: Date.now(),
      harita: { 'Spider-Woman': 'https://dizi99.life' },
      adaylar: { 'Spider-Woman': ['https://dizi99.life', 'https://dizi98.life'] },
    };
    depo.set('cp_canli_alanlar_v2', JSON.stringify(taze));
    const n = kayitliAlanlariUygula();
    assert.ok(n >= 1);
    assert.equal(alanYaniti().domains['Spider-Woman'], 'https://dizi99.life');
    assert.ok(alanAdaylari('Spider-Woman').includes('https://dizi98.life'));
  } finally { temizle(); }
});

test('bayat önbellek (6 saatten eski) uygulanmaz', () => {
  temizle();
  const depo = new Map();
  globalThis.localStorage = {
    getItem: (k) => (depo.has(k) ? depo.get(k) : null),
    setItem: (k, v) => depo.set(k, String(v)),
    removeItem: (k) => depo.delete(k),
  };
  try {
    depo.set('cp_canli_alanlar_v2', JSON.stringify({ t: Date.now() - ALAN_OMUR_MS - 1000, harita: { 'Spider-Woman': 'https://dizi99.life' } }));
    assert.equal(kayitliAlanlariUygula(), 0);
    assert.notEqual(alanYaniti().domains['Spider-Woman'], 'https://dizi99.life');
  } finally { temizle(); }
});

/* ── On-demand tazeleme: tek uçuş + cooldown (hata fırtınasında ağ boğulmaz) ── */
test('gerektigindeYenile cooldown içinde ikinci kez ağa çıkmaz', async () => {
  temizle();
  const sayac = { adet: 0 };
  const f = sahteListeFetch({ sayac });
  try {
    const ilk = await gerektigindeYenile(f);
    assert.equal(ilk, 0);
    const ilkAdet = sayac.adet;
    assert.ok(ilkAdet >= 2, 'iki canlı liste kaynağı yoklanmalı');
    assert.equal(await gerektigindeYenile(f), 0);
    assert.equal(sayac.adet, ilkAdet, 'cooldown içinde ağ isteği YOK');
    // cooldown sıfırlanınca yeniden denenir
    alanlariSifirla();
    await gerektigindeYenile(f, { minAralikMs: 0 });
    assert.ok(sayac.adet > ilkAdet);
    assert.equal(alanTazelemeDurumu().ucusta, false);
  } finally { temizle(); }
});

/* ── Web gateway: /api/<kod> rota yedeği + /api/proxy yedek katmanı ────── */
test('web rota çözücü birincil 5xx alınca tablodaki `mirrors` adayını dener', async () => {
  const cagrilar = [];
  const f = async (adres) => {
    cagrilar.push(String(adres));
    if (String(adres).startsWith('https://jetfilmizle.app')) return new Response('down', { status: 502 });
    return new Response(JSON.stringify({ tamam: true }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  const cevap = await saglayiciYaniti(
    new Request('https://worker.example/api/jet/arama?q=x'),
    new URL('https://worker.example/api/jet/arama?q=x'),
    f,
  );
  assert.equal(cevap.status, 200);
  assert.equal(cagrilar.length, 2);
  assert.equal(cagrilar[0], 'https://jetfilmizle.app/arama?q=x');
  assert.equal(cagrilar[1], 'https://jetfilmizle.now/arama?q=x');
  assert.deepEqual(await cevap.json(), { tamam: true });
});

test('proxyYedekDene: /api/proxy 5xx → yedek origin ile aynı isteği tekrar dener', async () => {
  temizle();
  const istek = new Request('https://worker.example/api/proxy?url=' + encodeURIComponent('https://dizipal1595.com/x?y=1') + '&ref=' + encodeURIComponent('https://dizipal1595.com/'));
  const url = new URL(istek.url);
  const denenen = [];
  const yenidenDene = async (yeniIstek) => {
    denenen.push(yeniIstek.url);
    const hedef = new URL(yeniIstek.url).searchParams.get('url');
    return hedef.startsWith('https://dizipal2149.com')
      ? new Response('yedek-govde', { status: 200 })
      : new Response('yok', { status: 502 });
  };
  const cevap = await proxyYedekDene(new Response('down', { status: 502 }), istek, url, yenidenDene);
  assert.equal(cevap.status, 200);
  assert.equal(await cevap.text(), 'yedek-govde');
  assert.equal(denenen.length, 1);
  assert.match(denenen[0], /dizipal2149/);
  temizle();
});

/* ── Oynatma paritesi: Origin hem headers JSON'unda hem `origin` sorgusunda ── */
test('hls proxy adresi Origin’i iki taşıma biçiminde de taşır (mobil + web)', () => {
  const adres = oynatmaAdresi('https://s10.dizisol.com/play?id=x', {
    Referer: 'https://dizisol.com/',
    Origin: 'https://dizisol.com',
    'User-Agent': 'UA/1.0',
  });
  const u = new URL(adres, 'https://worker.example');
  assert.equal(u.searchParams.get('origin'), 'https://dizisol.com', 'worker hls_proxy Origin’i buradan okur');
  assert.equal(JSON.parse(u.searchParams.get('headers')).Origin, 'https://dizisol.com', 'Android ağ geçidi buradan okur');
});
