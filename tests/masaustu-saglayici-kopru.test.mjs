/* Regresyon — masaüstü sağlayıcı rota köprüsü (inceleme 2026-11-13 #2).
   Electron yerel medya sunucusunda `/api/<kod>/...` istekleri 404'e düşüyordu;
   aynı çekirdek mobil/web'de çalışırken masaüstünde 0 kaynak dönüyordu.
   Bu test köprünün tabloyu paylaştığını, yerel uçları yakalamadığını,
   Referer/başlık taşıdığını ve mirror yedeğini uyguladığını doğrular. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const {
  saglayiciRotaCoz, saglayiciBasliklari, saglayiciIstekDene,
  rotaTablosunuYukle, rotaTablosunuSifirla,
} = await import('../server/saglayiciKopru.js');

const ROTALAR_YOLU = path.join(KOK, 'android/app/src/main/assets/native-routes.json');

test('masaüstü köprüsü mobil köprüyle AYNI tabloyu okur', () => {
  rotaTablosunuSifirla();
  const tablo = rotaTablosunuYukle({ yol: ROTALAR_YOLU });
  const mobil = JSON.parse(fs.readFileSync(ROTALAR_YOLU, 'utf8'));
  assert.deepEqual(Object.keys(tablo).sort(), Object.keys(mobil).sort(), 'tek kaynak: aynı tablo anahtarları');
  for (const kod of ['jet', 'hfd', 'slc', 'fhdf', 'ddz', 'szd']) {
    assert.ok(Object.prototype.hasOwnProperty.call(tablo, kod), `${kod} rotası tabloda olmalı`);
  }
});

test('göreli /api/<kod>/... yolunu tablodan çözer (sorgu korunur)', () => {
  const hedef = saglayiciRotaCoz('/api/jet/arama', '?q=abc');
  assert.ok(hedef, 'jet rotası çözülmeli');
  assert.equal(hedef.kod, 'jet');
  assert.equal(hedef.yol, '/arama');
  assert.equal(hedef.sorgu, '?q=abc');
  assert.ok(hedef.adaylar.length >= 1);
  assert.match(hedef.adaylar[0], /^https:\/\//);
});

test('yerel uçlar ve bilinmeyen kodlar köprüye takılmaz', () => {
  for (const yol of ['/api/ddz/dizi', '/api/proxy?url=x', '/api/hls_proxy?url=x', '/api/subtitles', '/api/bilinmeyen-kod/x']) {
    assert.equal(saglayiciRotaCoz(yol), null, `${yol} köprüye girmemeli`);
  }
});

test('başlıklar: tablo Referer/Origin + UA taşınır, taşıyıcı başlıklar engellenir', () => {
  const basliklar = saglayiciBasliklari(
    { referer: 'https://ornek.test/', headers: { Origin: 'https://ornek.test' } },
    { 'cf-control': '1', language: 'tr', host: 'kotu.test', 'content-length': '999', connection: 'keep-alive' }
  );
  assert.equal(basliklar.Referer, 'https://ornek.test/');
  assert.equal(basliklar.Origin, 'https://ornek.test');
  assert.equal(basliklar['cf-control'], '1');
  assert.equal(basliklar.language, 'tr');
  assert.match(basliklar['User-Agent'], /Mozilla/);
  assert.equal(basliklar.host, undefined);
  assert.equal(basliklar['content-length'], undefined);
  assert.equal(basliklar.connection, undefined);
});

test('mirror: birincil ağ hatası → ikinci aday çalışır, index bildirilir', async () => {
  const cagrilan = [];
  const fetchFn = async (url) => {
    cagrilan.push(url);
    if (url.startsWith('https://olu.test')) throw new Error('ENOTFOUND');
    return { status: 200, url, headers: { get: () => 'application/json' }, arrayBuffer: async () => new ArrayBuffer(2) };
  };
  const sonuc = await saglayiciIstekDene({
    adaylar: ['https://olu.test', 'https://canli.test'],
    yol: '/api/x', sorgu: '?a=1', basliklar: {}, fetchFn,
  });
  assert.equal(sonuc.calisanIndex, 1, 'çalışan aday indexi raporlanır');
  assert.equal(sonuc.cevap.status, 200);
  assert.deepEqual(cagrilan, ['https://olu.test/api/x?a=1', 'https://canli.test/api/x?a=1']);
});

test('tüm adaylar düşerse cevap null + hata döner (sessiz 200 yok)', async () => {
  const fetchFn = async () => { throw new Error('TLS'); };
  const sonuc = await saglayiciIstekDene({
    adaylar: ['https://a.test', 'https://b.test'], yol: '/x', basliklar: {}, fetchFn,
  });
  assert.equal(sonuc.cevap, null);
  assert.match(String(sonuc.hata && sonuc.hata.message), /TLS/);
});

test('5xx yanıtı sonraki adaya geçirir', async () => {
  const fetchFn = async (url) => (url.includes('birincil')
    ? { status: 503, url, headers: { get: () => 'text/html' }, arrayBuffer: async () => new ArrayBuffer(0) }
    : { status: 200, url, headers: { get: () => 'application/json' }, arrayBuffer: async () => new ArrayBuffer(0) });
  const sonuc = await saglayiciIstekDene({
    adaylar: ['https://birincil.test', 'https://yedek.test'], yol: '/x', basliklar: {}, fetchFn,
  });
  assert.equal(sonuc.calisanIndex, 1);
  assert.equal(sonuc.cevap.status, 200);
});
