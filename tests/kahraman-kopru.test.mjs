/* Fetch köprüsü + yayın süzgeci testleri.
   Neden var: köprü, kendi ürettiği /api/proxy?url=… adresini ikinci kez sarıyordu;
   her turda url= parametresi URL-kodlandığı için adres katlanarak şişiyor ve
   belleği bitiriyordu (ölçülen: 4 GB heap → WebView çökmesi).
   Süzgeç de uzantısız meşru HLS adreslerini (/vs/abc) eliyordu. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { kopruFetch, zatenKoprudeMi, normalizeEt } from '../src/providers/vekil.js';

const KAYIT = { onek: 'sp_ornek_', kodAdi: 'ornek-kod' };

/* ── köprü: özyineleme koruması ─────────────────────────────────────────── */

test('köprü adresi tanınır', () => {
  assert.equal(zatenKoprudeMi('/api/proxy?url=https%3A%2F%2Fx.example%2Fa.m3u8'), true);
  assert.equal(zatenKoprudeMi('https://ornek.dev/api/proxy?url=abc&ref=x'), true);
  assert.equal(zatenKoprudeMi('https://ornek.dev/api/proxy'), false, 'url= yoksa köprülenmiş sayılmaz');
  assert.equal(zatenKoprudeMi('https://baska.site/x.m3u8'), false);
  assert.equal(zatenKoprudeMi(''), false);
  assert.equal(zatenKoprudeMi(null), false);
  assert.equal(zatenKoprudeMi(42), false);
});

test('köprülenmiş adres köprüye yeniden g girmez (sarmalama yok)', async () => {
  const gorulen = [];
  const gercekFetch = globalThis.fetch;
  globalThis.fetch = async (urun) => {
    gorulen.push(typeof urun === 'string' ? urun : urun?.url);
    return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
  };
  try {
    const koprulu = '/api/proxy?url=https%3A%2F%2Fx.example%2Fa.m3u8';
    await kopruFetch(koprulu);
    assert.equal(gorulen.length, 1);
    assert.equal(gorulen[0], koprulu, 'adres aynen geçmeli, yeniden sarılmamalı');
    assert.ok(!/url=url%3D/.test(gorulen[0]), 'iç içe url= birikmesi');
  } finally {
    globalThis.fetch = gercekFetch;
  }
});

test('uzak adres bir kez sarılır, ikinci çağrı şişmez', async () => {
  const gorulen = [];
  const gercekFetch = globalThis.fetch;
  globalThis.fetch = async (urun) => {
    const s = typeof urun === 'string' ? urun : urun?.url;
    gorulen.push(s);
    return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
  };
  try {
    await kopruFetch('https://x.example/a.m3u8');
    await kopruFetch(gorulen[0]);          // köprülenmiş çıktıyı geri besle
    const ikinci = gorulen[1] || '';
    assert.ok(!/url=url%253D|url=url%3D/.test(ikinci), `ikinci turda şişme: ${ikinci.slice(0, 120)}`);
    assert.ok(ikinci.length <= gorulen[0].length + 4, 'uzunluk birikmemeli');
  } finally {
    globalThis.fetch = gercekFetch;
  }
});

test('alan listesi isteği yerelden yanıtlanır (ağ gitmez)', async () => {
  const gercekFetch = globalThis.fetch;
  let cikti = false;
  globalThis.fetch = async () => { cikti = true; return new Response('{}'); };
  try {
    const r = await kopruFetch('https://cdn.ornek.dev/domains.json');
    assert.equal(cikti, false, 'alan listesi için ağa çıkılmamalı');
    assert.equal(r.status, 200);
  } finally {
    globalThis.fetch = gercekFetch;
  }
});

/* ── süzgeç: yalnız doğrudan yayın, ama uzantısız HLS de geçerli ─────────── */

test('başlıksız yayın ÇIPLAK verilir (sarmalama listeyi kırpamaz)', () => {
  const r = normalizeEt({ url: 'https://x.example/a.m3u8' }, KAYIT);
  assert.ok(r);
  // Ölçülen ders (2026-10-16): HER yayını proxy hattına sarmak cihazda
  // görünen kaynak sayısını 10'dan 3'e düşürdü. Başlık istemeyen yayın çıplak
  // kalır; sarmalama yalnız başlık isteyenler içindir.
  assert.equal(r.streamUrl, 'https://x.example/a.m3u8');
  assert.equal(r.koprulendi, false);
  assert.equal(r.hamAdres, 'https://x.example/a.m3u8');
  assert.equal(r.isDirectVideo, true);
  assert.equal(r.isHls, true);
});

test('çekirdeğin istediği başlıklar proxy adresine taşınır (403 düzeltmesi)', () => {
  const r = normalizeEt({
    url: 'https://x.example/vs/abc123',
    format: 'm3u8',
    headers: { Referer: 'https://x.example/', Origin: 'https://x.example', 'User-Agent': 'UA/1.0' }
  }, KAYIT);
  assert.ok(r);
  const u = new URL(r.streamUrl, 'http://127.0.0.1:4000');
  assert.equal(u.searchParams.get('url'), 'https://x.example/vs/abc123');
  assert.equal(u.searchParams.get('ref'), 'https://x.example/');
  assert.equal(u.searchParams.get('ua'), 'UA/1.0');
  const ek = JSON.parse(u.searchParams.get('headers'));
  assert.equal(ek.Origin, 'https://x.example');
  // KRİTİK: Android'in liste yeniden yazıcısı alt isteklere yalnız `headers`ı
  // taşıyor. UA/Referer yalnız `ua`/`ref`te kalırsa parçalar başlıksız gidiyor
  // ve yayın "açılıyor ama oynamıyor" oluyor.
  assert.equal(ek['User-Agent'], 'UA/1.0', 'User-Agent headers JSONunda da bulunmalı');
  assert.equal(ek.Referer, 'https://x.example/', 'Referer headers JSONunda da bulunmalı');
});

test('proxy hattı yasaklı başlıkları taşımaz (host/connection/accept-encoding)', () => {
  const r = normalizeEt({
    url: 'https://x.example/a.mp4',
    headers: { Host: 'x.example', Connection: 'keep-alive', 'Accept-Encoding': 'gzip', 'X-Token': 't' }
  }, KAYIT);
  const u = new URL(r.streamUrl, 'http://127.0.0.1:4000');
  const gonderilen = JSON.parse(u.searchParams.get('headers') || '{}');
  assert.deepEqual(Object.keys(gonderilen), ['X-Token']);
});

test('başlık isteyen yayın proxy hattına sarılır (403 düzeltmesi)', () => {
  const r = normalizeEt({ url: 'https://x.example/b.mp4', headers: { Referer: 'https://x.example/' } }, KAYIT);
  assert.match(r.streamUrl, /^\/api\/hls_proxy\?url=/, 'başlık gerekiyorsa proxy hattı kullanılmalı');
  assert.equal(r.koprulendi, true);
  assert.equal(r.hamAdres, 'https://x.example/b.mp4', 'ham adres yedek olarak kalmalı');
  const u = new URL(r.streamUrl, 'http://127.0.0.1:4000');
  assert.equal(u.searchParams.get('url'), 'https://x.example/b.mp4');
  assert.equal(u.searchParams.get('ref'), 'https://x.example/');
  assert.equal(r.isHls, false);
  assert.equal(r.isDirectVideo, true);
});

test('kaynak kimliği ham adresten türetilir — proxy sarmalama kimliği bozmaz', () => {
  const a = normalizeEt({ url: 'https://x.example/a.m3u8' }, KAYIT);
  const b = normalizeEt({ url: 'https://x.example/a.m3u8', headers: { Referer: 'https://x.example/' } }, KAYIT);
  assert.equal(a.id, b.id, 'aynı yayın aynı kimliği taşımalı (tekilleştirme bozulmasın)');
});

test('uzantısız ama format bildiren HLS kabul edilir', () => {
  const r = normalizeEt({ url: 'https://x.example/vs/abc123', format: 'm3u8' }, KAYIT);
  assert.ok(r, 'çekirdek format:m3u8 diyorsa uzantı aranmaz');
  assert.match(r.id, /^sp_ornek_/);
});

test('format büyük/küçük harf ve type alanı da okunur', () => {
  assert.ok(normalizeEt({ url: 'https://x.example/vs/a', format: 'HLS' }, KAYIT));
  assert.ok(normalizeEt({ url: 'https://x.example/vs/b', type: 'mp4' }, KAYIT));
});

test('biçim bildirmeyen ve uzantısız adres reddedilir', () => {
  assert.equal(normalizeEt({ url: 'https://x.example/vs/abc123' }, KAYIT), null);
});

test('gömülü oynatıcı biçim söylese de reddedilir', () => {
  assert.equal(normalizeEt({ url: 'https://x.example/embed/abc', format: 'm3u8' }, KAYIT), null);
  assert.equal(normalizeEt({ url: 'https://x.example/iframe/abc' }, KAYIT), null);
  assert.equal(normalizeEt({ url: 'https://x.example/player/abc', type: 'mp4' }, KAYIT), null);
});

test('şemasız ve boş adres reddedilir', () => {
  assert.equal(normalizeEt({ url: 'blob:https://x/1' }, KAYIT), null);
  assert.equal(normalizeEt({ url: 'data:video/mp4;base64,AAA' }, KAYIT), null);
  assert.equal(normalizeEt({}, KAYIT), null);
  assert.equal(normalizeEt(null, KAYIT), null);
});

test('kod adı kimliği id ve source a alanlarına sızar, gerçek site adı asla', () => {
  const r = normalizeEt({ url: 'https://gerçek-site.example/a.m3u8' }, KAYIT);
  assert.equal(r.source, 'ornek-kod');
  assert.ok(!r.displayName.includes('gerçek-site'), 'görünen ad site adı sızdırmamalı');
  assert.ok(!r.id.includes('gerçek'), 'id site adı sızdırmamalı');
});

test('başlıklar korunur ama çöp tip kabul edilmez', () => {
  const r = normalizeEt({ url: 'https://x.example/a.mp4', headers: { Referer: 'https://r.example' } }, KAYIT);
  assert.deepEqual(r.headers, { Referer: 'https://r.example' });
  assert.deepEqual(normalizeEt({ url: 'https://x.example/a.mp4', headers: 'nope' }, KAYIT).headers, {});
});
