import test from 'node:test';
import assert from 'node:assert/strict';
import { canliAlanlariYenile } from '../src/providers/alanlar.js';

/* canliAlanlariYenile: kesin eşleşme + "yalnız iyileştir" doğrulaması.
   Önceki hatalar (2026-10-25): bulanık includes() Iron-Man'i Hulk'un alanına
   kaçırıyor; koşulsuz ezme çalışan alanı ölü aynayla zehirliyordu. */

const LISTE = [
  'dizipal:https://dizipal9999.com',
  'fullhdfilmizlesene:https://www.fullhdfilmizlesene.now',
  'hdfilmcehennemi:https://www.hdfilmcehennemi.nl',
  'sezonlukdizi:https://sezonlukdizi8.com',
].join('\n');

const IZLELAN = {
  ok: true,
  data: {
    domains: { noland: 'https://dizi90.life', smoker: 'https://dizipal7777.com', sakazuki: 'https://dizipal2143.com' },
    disabled: { bogard: 'https://streamcorecdn.com' },
  },
};

/* Sahte fetch: liste metni + köprü yoklamaları (durum kodu kontrollü). */
function sahteFetch(koprDurumlari = {}, secenekler = {}) {
  return async (url, _s) => {
    const u = String(url);
    if (u.includes('patr0nq')) {
      if (secenekler.patr0nOk === false) return { ok: false };
      return { ok: true, text: async () => LISTE };
    }
    if (u.includes('izlelan.com')) {
      if (secenekler.izlelanOk === false) return { ok: false };
      return { ok: true, json: async () => IZLELAN };
    }
    if (u.includes('/api/proxy?url=')) {
      const hedef = decodeURIComponent(u.split('url=')[1] || '');
      for (const [ad, kod] of Object.entries(koprDurumlari)) {
        if (hedef.startsWith(ad)) return { status: kod };
      }
      return { status: 200 };
    }
    return { ok: false };
  };
}

test('bulanık eşleşme yok: fullhdfilmizlesene, hdfilmizle (Iron-Man) kodlarını EZMEZ', async () => {
  // Köprü her şeyi canlı saysın — eşleşme hatası olsa bile Iron-Man değişmemeli.
  const n = await canliAlanlariYenile(sahteFetch({}));
  assert.ok(n >= 0);
  // Iron-Man listede anahtarı yok (hdfilmizle satırı yok); değeri dokunulmamalı.
  // Hulk (fullhdfilmizlesene) aynı değeri aldığı için aday bile oluşmaz.
  const { alanYaniti } = await import('../src/providers/alanlar.js');
  assert.equal(alanYaniti().domains['Iron-Man'], 'https://www.hdfilmizle.best');
});

test('çalışan alan ezilmez: mevcut canlıysa canlı liste uygulanmaz', async () => {
  // sezonlukdizi.cc (mevcut) canlı, aday sezonlukdizi8.com da canlı → değişmemeli.
  await canliAlanlariYenile(sahteFetch({ 'https://sezonlukdizi.cc': 200, 'https://sezonlukdizi8.com': 200 }));
  const { alanYaniti } = await import('../src/providers/alanlar.js');
  assert.equal(alanYaniti().domains['Robin'], 'https://sezonlukdizi.cc');
});

test('ölü alan iyileştirilir: mevcut 503, aday canlıysa uygulanır', async () => {
  await canliAlanlariYenile(sahteFetch({ 'https://sezonlukdizi.cc': 503, 'https://sezonlukdizi8.com': 200 }));
  const { alanYaniti } = await import('../src/providers/alanlar.js');
  assert.equal(alanYaniti().domains['Robin'], 'https://sezonlukdizi8.com');
  // geri temizle (sonraki testler etkilenmesin)
  const { GUNCEL } = { GUNCEL: null };
});

test('ölü aday asla uygulanmaz', async () => {
  // hdfilmcehennemi: mevcut .biz ölü, aday .nl de ölü → değer değişmemeli.
  await canliAlanlariYenile(sahteFetch({ 'https://www.hdfilmcehennemi2.biz': 503, 'https://www.hdfilmcehennemi.nl': 503 }));
  const { alanYaniti } = await import('../src/providers/alanlar.js');
  assert.equal(alanYaniti().domains['Hawkeye'], 'https://www.hdfilmcehennemi2.biz');
});

test('ikinci kaynak (izlelan) iyileştirir: patr0nq ölü olsa bile taze ayna bulunur', async () => {
  // patr0nq erişilemez; izlelan noland → dizi90.life. Mevcut dizi82 ölü,
  // aday canlı → uygulanmalı.
  await canliAlanlariYenile(sahteFetch(
    { 'https://dizi82.life': 503, 'https://dizi90.life': 200 },
    { patr0nOk: false }
  ));
  const { alanYaniti } = await import('../src/providers/alanlar.js');
  assert.equal(alanYaniti().domains['Spider-Woman'], 'https://dizi90.life');
});

test('izlelan "disabled" takma adları aday vermez', async () => {
  // Thanos (bogard) izlelan'da disabled → mevcut değer korunmalı.
  await canliAlanlariYenile(sahteFetch(
    { 'https://streamcorecdn.com': 503 },
    { patr0nOk: false }
  ));
  const { alanYaniti } = await import('../src/providers/alanlar.js');
  assert.equal(alanYaniti().domains['Thanos'], 'https://streamcorecdn.com');
});

test('alanYaniti: köprüden geçen çekirdeklere çalışan TMDB anahtarları verilir (2026-10-25: vendor 401 krizi)', async () => {
  const { alanYaniti } = await import('../src/providers/alanlar.js');
  const y = alanYaniti();
  assert.ok(Array.isArray(y.tmdb_keys) && y.tmdb_keys.length >= 2, 'en az 2 TMDB anahtarı');
  assert.ok(y.tmdb_keys.every(k => typeof k === 'string' && k.length >= 30), 'anahtar biçimi');
});
