/* KAYNAK KAPISI — doğrulama + kalıcı eleme sözleşmesi (ağ KULLANILMAZ).
   Kullanıcı kuralı 2026-11-17: "her kaynak çalışacak; çalışmayan elensin,
   kalıcı silinsin" — ama "liste boş kalmasın" fail-open'ı da korunur. */
import test from 'node:test';
import assert from 'node:assert/strict';

/* localStorage benzeşimi */
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};

let aktifFetch = async () => { throw new Error('testte ağ kapalı'); };
globalThis.fetch = (g, o) => aktifFetch(g, o);

const { kapiAnahtari, sicildeMi, oluKaydet, siciliSifirla, denetle } = await import('../src/services/kaynak/kaynakKapisi.js');

const yanit = (durum, govde, ct = 'application/vnd.apple.mpegurl') => ({
  ok: durum >= 200 && durum < 300,
  status: durum,
  headers: { get: (n) => (String(n).toLowerCase() === 'content-type' ? ct : null) },
  text: async () => govde,
  body: null,
});

test('kapiAnahtari: proxy sarmalını çözer, token-atar aynı kaynağı birleştirir', () => {
  const a = { streamUrl: '/api/hls_proxy?url=' + encodeURIComponent('https://cdn.x.com/a/b/index.m3u8?token=AAA&t=1') };
  const b = { streamUrl: '/api/hls_proxy?url=' + encodeURIComponent('https://cdn.x.com/a/b/index.m3u8?token=ZZZ&t=9') };
  assert.equal(kapiAnahtari(a), kapiAnahtari(b), 'imza farklılsa da aynı kaynak aynı anahtar');
  assert.equal(kapiAnahtari(a), 'cdn.x.com/a/b/index.m3u8');
});

test('sicil: ölü kanıtı 7 gün boyunca listelenmez; sıfırlama çalışır', () => {
  siciliSifirla();
  const item = { streamUrl: 'https://olu.example.com/film/master.m3u8' };
  assert.equal(sicildeMi(item), false);
  oluKaydet(kapiAnahtari(item));
  assert.equal(sicildeMi(item), true, 'kalıcı eleme: aynı yol artık sicilde');
  siciliSifirla();
  assert.equal(sicildeMi(item), false);
});

test('denetle: #EXTM3U 200 → canli', async () => {
  aktifFetch = async () => yanit(200, '#EXTM3U\n#EXT-X-TARGETDURATION:6\nseg-1.ts\n');
  assert.equal(await denetle({ streamUrl: 'https://a.com/m.m3u8' }), 'canli');
});

test('denetle: 404/410 → olu; proxy 403 → olu (başlık taşınarak denendi)', async () => {
  aktifFetch = async () => yanit(404, 'yok', 'text/html');
  assert.equal(await denetle({ streamUrl: 'https://a.com/x.m3u8' }), 'olu');
  aktifFetch = async () => yanit(410, 'gitmiş', 'text/plain');
  assert.equal(await denetle({ streamUrl: 'https://a.com/x.m3u8' }), 'olu');
  aktifFetch = async () => yanit(403, '<html>kalkan</html>', 'text/html');
  assert.equal(await denetle({ streamUrl: '/api/hls_proxy?url=https%3A%2F%2Fhost.site%2Fplay%3Fid%3D1' }), 'olu');
});

test('denetle: 5xx ve ağ hatası BELİRSİZdir — ölçülemeyen öldürülmez', async () => {
  aktifFetch = async () => yanit(503, 'bakım', 'text/html');
  assert.equal(await denetle({ streamUrl: 'https://a.com/x.m3u8' }), 'belirsiz', '5xx ölü sayılmaz');
  aktifFetch = async () => { throw new Error('timeout'); };
  assert.equal(await denetle({ streamUrl: 'https://a.com/x.m3u8' }), 'belirsiz');
});

test('denetle: 200 dönen HTML/JSON çöpü → olu (oynatıcıya HTML gidecek satır)', async () => {
  aktifFetch = async () => yanit(200, '<!DOCTYPE html><html>player sayfası</html>', 'text/html');
  assert.equal(await denetle({ streamUrl: 'https://a.com/x.m3u8' }), 'olu');
  aktifFetch = async () => yanit(200, '{"error":"internal"}', 'application/json');
  assert.equal(await denetle({ streamUrl: 'https://a.com/x.m3u8' }), 'olu');
});
