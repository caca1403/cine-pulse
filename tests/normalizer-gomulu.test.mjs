/* normalizeEt — GÖMÜLÜ OYNATICI sayfalarını işaretler, çöpe atmaz.
   --------------------------------------------------------------------------
   ÖLÇÜLEN HATA (2026-11-17, kullanıcının APK'sında doğrulandı): Green-Arrow'un
   (dizisol) 10 kaynağının 10'u `.../play?id=…` GÖMÜLÜ SAYFASI. `normalizeEt`
   bu adresleri ya `null`layıp atıyordu (kaynak kaybı) ya da çekirdek
   `format:'m3u8'` yazdığı için "1080p HLS" diye listeleniyordu ve oynatıcı
   HTML'yi ayrıştıramayıp ÖLÜ satır üretiyordu.
   BEKLENTİ: sayfa ELENMEZ, RESMEN gömülü olarak işaretlenir; doğrulama katmanı
   (kaynakDogrulayıcı + embedCozucu) iç akışı çözer, kapı yalnız çözüleni listeler.
   Ağ KULLANILMAZ. */

import test from 'node:test';
import assert from 'node:assert/strict';

let aktifFetch = async () => { throw new Error('testte ağ kapalı'); };
globalThis.fetch = (girdi, secenek) => aktifFetch(girdi, secenek);

const { normalizeEt, gomuluSayfaMi } = await import('../src/providers/vekil.js');

const KAYIT = { kodAdi: 'Green-Arrow', onek: 'sp_greenarrow_' };

test('gomuluSayfaMi: ölçülen dizisol sayfaları tanır', () => {
  const olculenler = [
    'https://cortina.dizisol14.workers.dev/play?id=e5xrdjhyfxy8',
    'https://s6.dizisol.com/play?id=8787c5a7',
    'https://rapid.dizisol1.workers.dev/play?hash=7c45x8vyq354',
    'https://videoplays.dizisol89.workers.dev/play?video=3259',
    'https://x.com/embed/abc',
    'https://y.com/oynat/abc',
  ];
  for (const u of olculenler) assert.equal(gomuluSayfaMi({}, u), true, `gömülü: ${u}`);
});

test('gomuluSayfaMi: gerçek akışlar asla gömülü sayılmaz', () => {
  const akslar = [
    'https://cdn.x.com/a/master.m3u8',
    'https://cdn.x.com/a/master.m3u8?id=7',
    'https://cdn.x.com/film.mp4?token=abc',
    'https://s26.cdnimg1399.shop/mv/abc123',
  ];
  for (const u of akslar) assert.equal(gomuluSayfaMi({}, u), false, `gömülü değil: ${u}`);
});

test('normalizeEt: gömülü sayfayı atmaz, resmi gömülü işaret verir', () => {
  const oge = {
    url: 'https://s6.dizisol.com/play?id=8787c5a7',
    title: 'Green-Arrow · VidRame · Gömülü hat',
    format: 'embed',
    type: 'embed',
    isM3u8: false,
    gomulu: true,
    headers: { Referer: 'https://dizisol.com/', Origin: 'https://dizisol.com' },
  };
  const n = normalizeEt(oge, KAYIT);
  assert.ok(n, 'gömülü satır null DÖNMEMELİ (doğrulama katmanı görebilmeli)');
  assert.equal(n.gomulu, true);
  assert.equal(n.type, 'embed');
  assert.equal(n.isIframe, true);
  assert.equal(n.isM3u8, false, 'oynatıcıya HLS olarak gitmemeli');
  assert.equal(n.quality, 'auto', 'kalite uydurulamaz');
  assert.equal(n.dogrulandi, false, 'doğrulanmadan "çalışır" sayılmaz');
  assert.equal(n.embedSayfa, oge.url, 'orijinal sayfa korunmalı (çözüm girdisi)');
  assert.equal(n.headers.Origin, 'https://dizisol.com', 'WAF başlıkları taşınmalı');
  assert.ok(!/hls_proxy|\/api\//.test(n.url), 'gömülü sayfa akış proxy sine sarılmaz');
});

test('normalizeEt: çekirdek işaretlemese de /play?id= sayfası yakalanır', () => {
  // Çekirdekler kademeli güncellenir; işaret OLMASA bile sayfa biçimi yakalanmalı,
  // aksi halde "1080p HLS" yalanıyla listeye girer (ölçülen APK hatası).
  const yalanci = { url: 'https://pal.dizisol50.workers.dev/play?id=omcibh99gpcb', format: 'm3u8', quality: '1080p' };
  const n = normalizeEt(yalanci, KAYIT);
  assert.ok(n, 'sayfa listeden kaybolmamalı');
  assert.equal(n.gomulu, true, 'biçim "m3u8" dense de gömülü işaret verilmeli');
  assert.equal(n.isM3u8, false);
  assert.equal(n.quality, 'auto');
});

test('normalizeEt: gerçek akış eskisi gibi sarmalanır, gömülü işaret TAŞIMAZ', () => {
  const gercek = {
    url: 'https://load.prectv63.lol/hls/2/cdn5/stranger/1/tr1.mp4/index.m3u8?token=abc',
    format: 'm3u8',
    quality: '1080p',
    headers: { Referer: 'https://a.prectv70.lol/' },
  };
  const n = normalizeEt(gercek, KAYIT);
  assert.ok(n);
  assert.notEqual(n.gomulu, true);
  assert.notEqual(n.type, 'embed');
  assert.match(n.url, /hls_proxy/, 'başlık isteyen akış başlık-taşıyan proxy ye sarılmalı');
  assert.match(decodeURIComponent(n.url), /prectv70/, 'kaynağın Referer ı proxy ye taşınmalı');
});
