/* KAYNAK DOĞRULAMA KAPISI — kullanıcının ana talebi (2026-11-17):
   "bütün kaynakların gözükmesi değil gerçekten açıldığına emin ol" +
   "çıkan her kaynak çalışacak".

   Ölçülen kanıt (canlı site, Stranger Things S1E1): 13 kaynağın 7'si ölüydü
   (Star-Lord http-429, Green-Arrow /play?id= embed'leri http-403/http-500,
   HTML gövde). Aynı ölçümde YANLIŞ BÖLÜM de yakalandı (çekirdek animasyon
   türevi: 30,9 dk vs gerçek 49,4 dk) — süre sapması burada elenir.

   Kapı kuralları:
     - Oynatılabilir kaynak → oynatilir kutusu (dogrulandi: true)
     - Kanıtlanamayan (429 / zaman aşımı / embed çözülemedi / 5xx?) → belirsiz
       (dogrulandi: false, listede KALIR, sona düşer)
     - Kanıtlanmış ölü (403/404/5xx/HTML gövde/boş gövde) → olu (LİSTEYE GİRMEZ)
     - liste tamamen boşalırsa fail-open: mevcut liste aynen döner.

   Ağ YOK: fetchFn/embedCoz/gomuluMu enjekte edilir.
   Çalıştır: node --test tests/kaynak-dogrulama.test.mjs */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const { kaynakDogrula, dogrulanmislariAyir } = await import('../src/services/kaynak/kaynakDogrulayici.js');
const { failOpenBirlestir } = await import('../src/services/kaynak/providerAggregator.js');

/* ── kapı ağ adaptörü (CORS) ──────────────────────────────────────────── */

test('kapiFetch: tarayıcı CORS reddinde aynı-köken başlık proxy’siyle tekrar dener', async () => {
  const cagrilar = [];
  const hakikiFetch = globalThis.fetch;
  globalThis.fetch = async (adres, init = {}) => {
    cagrilar.push({ adres: String(adres), basliklar: { ...(init.headers || {}) } });
    if (String(adres).startsWith('/api/hls_proxy')) return yanit(playlist(10, 4));
    throw new TypeError('Failed to fetch'); // ölçülen belirti: CORS reddi
  };
  try {
    const { kapiFetch } = await import('../src/services/kaynak/providerAggregator.js');
    assert.equal(typeof kapiFetch, 'function', 'adaptör dışa açık olmalı (kapıya bağlanır)');
    const y = await kapiFetch('https://cdn.ornek/dizi/a.m3u8', {
      headers: { Referer: 'https://ornek.com/', Origin: 'https://ornek.com' },
    });
    assert.equal(y.status, 200);
    assert.equal(cagrilar.length, 2, 'önce doğrudan, sonra proxy — başka istek yok');
    const proxy = cagrilar[1].adres;
    assert.match(proxy, /^\/api\/hls_proxy\?url=/);
    assert.ok(proxy.includes(encodeURIComponent('https://cdn.ornek/dizi/a.m3u8')), 'hedef adres proxy’ye taşınır');
    assert.ok(proxy.includes(encodeURIComponent('https://ornek.com/')), 'Referer proxy’ye taşınır');
    assert.equal(cagrilar[1].basliklar.Referer, undefined, 'tarayıcıya özel başlık proxy isteğinde tekrar gönderilmez');
  } finally {
    globalThis.fetch = hakikiFetch;
  }
});

test('kapiFetch: doğrudan istek geçerse ikinci istek YAPILMAZ (çift trafik yok)', async () => {
  const cagrilar = [];
  const hakikiFetch = globalThis.fetch;
  globalThis.fetch = async (adres) => {
    cagrilar.push(String(adres));
    return yanit(playlist(4, 4));
  };
  try {
    const { kapiFetch } = await import('../src/services/kaynak/providerAggregator.js');
    const y = await kapiFetch('https://cdn.ornek/dizi/b.m3u8');
    assert.equal(y.status, 200);
    assert.deepEqual(cagrilar, ['https://cdn.ornek/dizi/b.m3u8']);
  } finally {
    globalThis.fetch = hakikiFetch;
  }
});

test('kapiFetch: göreli/proxy adresi yeniden sarmalanmaz', async () => {
  const cagrilar = [];
  const hakikiFetch = globalThis.fetch;
  globalThis.fetch = async (adres) => { cagrilar.push(String(adres)); return yanit(playlist(2, 4)); };
  try {
    const { kapiFetch } = await import('../src/services/kaynak/providerAggregator.js');
    await kapiFetch('/api/hls_proxy?url=https%3A%2F%2Fx%2Fa.m3u8');
    assert.deepEqual(cagrilar, ['/api/hls_proxy?url=https%3A%2F%2Fx%2Fa.m3u8']);
  } finally {
    globalThis.fetch = hakikiFetch;
  }
});


/* ── sahte ağ ─────────────────────────────────────────────────────────── */

function yanit(govde, { durum = 200, tip = 'application/vnd.apple.mpegurl' } = {}) {
  const basliklar = { 'content-type': tip };
  return {
    ok: durum >= 200 && durum < 300,
    status: durum,
    headers: { get: (ad) => basliklar[String(ad).toLowerCase()] ?? null },
    text: async () => (typeof govde === 'string' ? govde : ''),
    arrayBuffer: async () => new TextEncoder().encode(typeof govde === 'string' ? govde : '').buffer,
  };
}

/** Media playlist: adet × saniye → parça sayısı ve toplam süre deterministik. */
function playlist(adet, saniye = 4) {
  let m = '#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:4\n';
  for (let i = 0; i < adet; i++) m += `#EXTINF:${saniye.toFixed(3)},\nseg${i}.ts\n`;
  return `${m}#EXT-X-ENDLIST\n`;
}

const MASTER = '#EXTM3U\n#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=1280x720\nvaryan/index.m3u8\n';

function baslikVar(basliklar, ad) {
  const hedef = String(ad).toLowerCase();
  return Object.keys(basliklar || {}).some(k => k.toLowerCase() === hedef);
}
function baslikOku(basliklar, ad) {
  const hedef = String(ad).toLowerCase();
  const k = Object.keys(basliklar || {}).find(x => x.toLowerCase() === hedef);
  return k ? basliklar[k] : undefined;
}

/** Doğrudan yol testlerinde embed dalını deterministik kapat: paralel ajanın
 *  embedCozucu.js'i geldiğinde bu testler kaymasın. */
const EMBED_KAPALI = { embedCoz: async () => ({ durum: 'cozulemedi' }), gomuluMu: () => false };

/* ── doğrudan akış ────────────────────────────────────────────────────── */

test('m3u8 gövdesi olan kaynak → ok:true, parça ve süre doğru hesaplanır', async () => {
  const kaynak = { id: 'a', streamUrl: 'https://cdn.test/dizi/index.m3u8' };
  const sonuc = await kaynakDogrula(kaynak, {
    fetchFn: async () => yanit(playlist(741, 4)),
    ...EMBED_KAPALI,
  });
  assert.equal(sonuc.ok, true);
  assert.equal(sonuc.sebep, 'akis');
  assert.equal(sonuc.parca, 741, 'her #EXTINF bir parça');
  assert.equal(sonuc.sureDk, 49.4, '741 × 4 sn = 2964 sn = 49,4 dk');
});

test('master playlist → ilk varyan çözülür, süre varyandan hesaplanır (2 istek)', async () => {
  const cagrilar = [];
  const kaynak = { id: 'b', streamUrl: 'https://cdn.test/dizi/master.m3u8' };
  const sonuc = await kaynakDogrula(kaynak, {
    fetchFn: async (adres) => {
      const url = String(adres);
      cagrilar.push(url);
      if (url.endsWith('master.m3u8')) return yanit(MASTER);
      return yanit(playlist(741, 4));
    },
    ...EMBED_KAPALI,
  });
  assert.equal(sonuc.ok, true);
  assert.equal(sonuc.sureDk, 49.4);
  assert.equal(cagrilar.length, 2, 'master + ilk varyan');
  assert.equal(cagrilar[1], 'https://cdn.test/dizi/varyan/index.m3u8', 'göreli varyan adresi mutlaklaştırılır');
});

test('canlı playlist (ENDLIST yok) süre uydurmaz — kanıtsız süre eleme sebebi olamaz', async () => {
  const canli = '#EXTM3U\n#EXT-X-TARGETDURATION:4\n#EXTINF:4.000,\na.ts\n#EXTINF:4.000,\nb.ts\n';
  const sonuc = await kaynakDogrula(
    { id: 'canli', streamUrl: 'https://cdn.test/canli/index.m3u8' },
    { fetchFn: async () => yanit(canli), beklenenSureDk: 49, ...EMBED_KAPALI }
  );
  assert.equal(sonuc.ok, true);
  assert.equal(sonuc.sureDk, undefined, 'canlı yayında toplam süre kanıt değildir');
});

test('http 429 → ok:false http-429 ve belirsiz (rate-limit ölüm değildir)', async () => {
  const sonuc = await kaynakDogrula(
    { id: 'c', streamUrl: 'https://cdn.test/x/index.m3u8' },
    { fetchFn: async () => yanit('', { durum: 429, tip: 'text/plain' }), ...EMBED_KAPALI }
  );
  assert.equal(sonuc.ok, false);
  assert.equal(sonuc.sebep, 'http-429');
  assert.equal(sonuc.belirsiz, true);
});

test('HTML gövde → ok:false govde-tanimasiz (oynatıcı m3u8 beklerken sayfa alır)', async () => {
  const html = '<!doctype html><html><body>Bu sayfa yalnız tarayıcıda açılır</body></html>';
  const sonuc = await kaynakDogrula(
    { id: 'd', streamUrl: 'https://cdn.test/x/index.m3u8' },
    { fetchFn: async () => yanit(html, { tip: 'text/html' }), ...EMBED_KAPALI }
  );
  assert.equal(sonuc.ok, false);
  assert.equal(sonuc.sebep, 'govde-tanimasiz');
  assert.ok(!sonuc.belirsiz, 'tanımlanamayan gövde ölüm kanıtıdır');
});

test('boş gövde → ölü', async () => {
  const sonuc = await kaynakDogrula(
    { id: 'bos', streamUrl: 'https://cdn.test/x/index.m3u8' },
    { fetchFn: async () => yanit('   ', { tip: 'text/plain' }), ...EMBED_KAPALI }
  );
  assert.equal(sonuc.ok, false);
  assert.equal(sonuc.sebep, 'govde-tanimasiz');
});

test('video/mp4 içerik tipi → gövde okunmadan ok:true', async () => {
  let metinOkundu = false;
  const res = yanit('', { tip: 'video/mp4' });
  res.text = async () => { metinOkundu = true; return ''; };
  const sonuc = await kaynakDogrula(
    { id: 'mp4', streamUrl: 'https://cdn.test/film.mp4' },
    { fetchFn: async () => res, ...EMBED_KAPALI }
  );
  assert.equal(sonuc.ok, true);
  assert.equal(sonuc.sebep, 'akis');
  assert.equal(metinOkundu, false, 'video gövdesi belleğe çekilmez');
});

test('beklenen süre 49 dk, kaynak 31 dk → ok:false süre-sapmasi (yanlış bölüm elenir)', async () => {
  const sonuc = await kaynakDogrula(
    { id: 'yanlis', streamUrl: 'https://cdn.test/dizi/index.m3u8' },
    { fetchFn: async () => yanit(playlist(465, 4)), beklenenSureDk: 49, ...EMBED_KAPALI }
  );
  assert.equal(sonuc.ok, false);
  assert.equal(sonuc.sebep, 'sure-sapmasi');
  assert.equal(sonuc.sureDk, 31);
});

test('beklenen süre tolerans içinde → ok:true (aynı bölüm 49,4 dk)', async () => {
  const sonuc = await kaynakDogrula(
    { id: 'dogru', streamUrl: 'https://cdn.test/dizi/index.m3u8' },
    { fetchFn: async () => yanit(playlist(741, 4)), beklenenSureDk: 49, ...EMBED_KAPALI }
  );
  assert.equal(sonuc.ok, true);
});

test('zaman aşımı → ok:false zaman-asimi, throw YOK', async () => {
  const sonuc = await kaynakDogrula(
    { id: 'yavas', streamUrl: 'https://cdn.test/yavas/index.m3u8' },
    { fetchFn: () => new Promise(() => {}), ms: 150, ...EMBED_KAPALI }
  );
  assert.equal(sonuc.ok, false);
  assert.equal(sonuc.sebep, 'zaman-asimi');
  assert.equal(sonuc.belirsiz, true);
});

/* ── embed (gömülü oynatıcı) dalı ─────────────────────────────────────── */

test('embed "akis" dönerse iç akış doğrulanır → ok:true gomulu-akis', async () => {
  const embedCoz = async () => ({ durum: 'akis', akis: 'https://s6.ornek.com/ic/index.m3u8' });
  const sonuc = await kaynakDogrula(
    { id: 'e', streamUrl: 'https://s6.ornek.com/play?id=abc' },
    {
      fetchFn: async () => yanit(playlist(741, 4)),
      gomuluMu: () => true,
      embedCoz,
    }
  );
  assert.equal(sonuc.ok, true);
  assert.equal(sonuc.sebep, 'gomulu-akis');
  assert.equal(sonuc.parca, 741);
});

test('embed "olu" dönerse → ok:false (ölü)', async () => {
  const sonuc = await kaynakDogrula(
    { id: 'f', streamUrl: 'https://s6.ornek.com/play?id=olu' },
    { fetchFn: async () => yanit('', { durum: 500, tip: 'text/plain' }), gomuluMu: () => true, embedCoz: async () => ({ durum: 'olu', sebep: 'http-500' }) }
  );
  assert.equal(sonuc.ok, false);
  assert.equal(sonuc.belirsiz, undefined, 'embed ölü kanıtı ölü sayılır');
});

test('embed "cozulemedi" dönerse → belirsiz (liste sonunda kalır, silinmez)', async () => {
  const sonuc = await kaynakDogrula(
    { id: 'g', streamUrl: 'https://s6.ornek.com/play?id=belirsiz' },
    { fetchFn: async () => yanit('', { durum: 403, tip: 'text/plain' }), gomuluMu: () => true, embedCoz: async () => ({ durum: 'cozulemedi', sebep: 'desen-yok' }) }
  );
  assert.equal(sonuc.ok, false);
  assert.equal(sonuc.belirsiz, true);
});

test('embed akışı bulundu ama iç adres doğrulanamazsa → belirsiz (ölü ilan edilmez)', async () => {
  const sonuc = await kaynakDogrula(
    { id: 'h', streamUrl: 'https://s6.ornek.com/play?id=ic403' },
    {
      fetchFn: async () => yanit('', { durum: 403, tip: 'text/plain' }),
      gomuluMu: () => true,
      embedCoz: async () => ({ durum: 'akis', akis: 'https://cdn.test/ic/index.m3u8' }),
    }
  );
  assert.equal(sonuc.ok, false);
  assert.equal(sonuc.belirsiz, true);
});

test('embed çözücü YOKKEN gömülü adres ölü ilan edilmez → belirsiz', async () => {
  const sonuc = await kaynakDogrula(
    { id: 'i', streamUrl: 'https://s6.ornek.com/play?id=yok' },
    { fetchFn: async () => yanit('<html>oynatıcı</html>', { tip: 'text/html' }), gomuluMu: () => true }
  );
  assert.equal(sonuc.ok, false);
  assert.equal(sonuc.belirsiz, true);
});

test('embed çözücü fırlatırsa kapı çökmez → belirsiz', async () => {
  const sonuc = await kaynakDogrula(
    { id: 'j', streamUrl: 'https://s6.ornek.com/play?id=patlar' },
    { fetchFn: async () => yanit('', { durum: 200, tip: 'text/plain' }), gomuluMu: () => true, embedCoz: async () => { throw new Error('boom'); } }
  );
  assert.equal(sonuc.ok, false);
  assert.equal(sonuc.belirsiz, true);
});

/* ── İKİ AŞAMALI KANIT: başlık taşımayan probe çalışan kaynağı öldürmesin ── */

test('başlıksız 403 → başlıkla (Origin/Referer) tekrar dener ve ok:true olur', async () => {
  const cagrilar = [];
  const fetchFn = async (adres, init = {}) => {
    const basliklar = { ...(init.headers || {}) };
    cagrilar.push({ adres: String(adres), basliklar });
    if (!baslikVar(basliklar, 'origin') || !baslikVar(basliklar, 'referer')) {
      return yanit('forbidden', { durum: 403, tip: 'text/plain' });
    }
    return yanit(playlist(6, 10));
  };
  const sonuc = await kaynakDogrula(
    { id: 'dizisol', streamUrl: 'https://s6.dizisol.com/play?id=abc' },
    { fetchFn, ...EMBED_KAPALI }
  );
  assert.equal(sonuc.ok, true, 'Origin/Referer ile açılan kaynak listeye girmeli');
  assert.equal(cagrilar.length, 2, 'önce başlıksız, sonra başlıkla');
  assert.equal(baslikVar(cagrilar[0].basliklar, 'origin'), false, 'ilk deneme başlıksızdır');
  assert.equal(baslikOku(cagrilar[1].basliklar, 'origin'), 'https://s6.dizisol.com');
  assert.equal(baslikOku(cagrilar[1].basliklar, 'referer'), 'https://s6.dizisol.com/');
  assert.equal(baslikOku(cagrilar[1].basliklar, 'user-agent')?.length > 5, true, 'tarayıcı UA taşınır');
});

/* BAŞLIKLA AÇILAN ÇIPLAK SATIR İŞARETLENİR (2026-11-17 — kullanıcının ana
   şikâyeti: "kaynak listede var ama açılmıyor"). Düz web tarayıcısı
   Referer/Origin gönderemez; kapı türettiği başlıkla kaynağı açabiliyorsa
   satır çıplak bırakılmamalı, agregatör onu başlık proxy'sine sarmalı.
   Sözleşme: kaynak.baslikTuretildi = true + kaynak.headers doldurulur. */
test('başlıkla açılan satır işaretlenir (baslikTuretildi) ve başlıkları kaynağa yazılır', async () => {
  const fetchFn = async (_adres, init = {}) => {
    const basliklar = { ...(init.headers || {}) };
    if (!baslikVar(basliklar, 'referer')) return yanit('forbidden', { durum: 403, tip: 'text/plain' });
    return yanit(playlist(6, 10));
  };
  const kaynak = { id: 'ciplak', streamUrl: 'https://storage.ornek/ep/40901/play.m3u8' };
  const sonuc = await kaynakDogrula(kaynak, { fetchFn, ...EMBED_KAPALI });
  assert.equal(sonuc.ok, true);
  assert.equal(kaynak.baslikTuretildi, true, 'agregatörün yeniden-sarmalaması bu işareti okur');
  assert.equal(String(kaynak.headers?.Referer || '').startsWith('https://storage.ornek'), true, 'Referer kaynağa yazılır');
  assert.equal(String(kaynak.headers?.Origin || ''), 'https://storage.ornek');
});

test('kaynağın kendi başlığı yeterse işaret KONMAZ (yalnız türev başlık işaretlenir)', async () => {
  const fetchFn = async () => yanit(playlist(6, 10));
  const kaynak = {
    id: 'kendi-basligi',
    streamUrl: 'https://cdn.ornek/index.m3u8',
    headers: { Referer: 'https://site.ornek/', Origin: 'https://site.ornek' },
  };
  const sonuc = await kaynakDogrula(kaynak, { fetchFn, ...EMBED_KAPALI });
  assert.equal(sonuc.ok, true);
  assert.equal(kaynak.baslikTuretildi, undefined, 'kendi başlığıyla açılan satır zaten sarmalanmış olabilir');
});

test('kaynağın KENDİ başlıkları ilk denemede gider (Referer/Origin ezilmez)', async () => {  const cagrilar = [];
  const fetchFn = async (adres, init = {}) => {
    cagrilar.push({ ...(init.headers || {}) });
    return yanit(playlist(10, 4));
  };
  await kaynakDogrula(
    {
      id: 'baslikli',
      streamUrl: 'https://cdn.test/baslikli/index.m3u8',
      headers: { Referer: 'https://site.ornek/bolum/1', Origin: 'https://site.ornek', Cookie: 'a=1', 'User-Agent': 'Ozel-UA' },
    },
    { fetchFn, ...EMBED_KAPALI }
  );
  assert.equal(cagrilar.length, 1);
  assert.equal(baslikOku(cagrilar[0], 'referer'), 'https://site.ornek/bolum/1');
  assert.equal(baslikOku(cagrilar[0], 'origin'), 'https://site.ornek');
  assert.equal(baslikOku(cagrilar[0], 'cookie'), 'a=1');
  assert.equal(baslikOku(cagrilar[0], 'user-agent'), 'Ozel-UA', 'kaynağın UA değeri varsayılanı ezer');
});

test('başlıklarla da 403 → ölü (olum kanıtı yok)', async () => {
  const cagrilar = [];
  const sonuc = await kaynakDogrula(
    {
      id: 'kapali',
      streamUrl: 'https://s6.ornek.com/play?id=403',
      headers: { Origin: 'https://ornek.com', Referer: 'https://ornek.com/' },
    },
    {
      fetchFn: async (adres, init = {}) => {
        cagrilar.push({ ...(init.headers || {}) });
        return yanit('forbidden', { durum: 403, tip: 'text/plain' });
      },
      ...EMBED_KAPALI,
    }
  );
  assert.equal(sonuc.ok, false);
  assert.equal(sonuc.sebep, 'http-403');
  assert.equal(cagrilar.length, 1, 'başlık kümesi değişmiyorsa anlamsız ikinci istek yapılmaz');
});

test('5xx → ölü (sunucu kalıcı hata veriyor)', async () => {
  const sonuc = await kaynakDogrula(
    { id: 'k', streamUrl: 'https://cdn.test/x/index.m3u8' },
    { fetchFn: async () => yanit('', { durum: 503, tip: 'text/plain' }), ...EMBED_KAPALI }
  );
  assert.equal(sonuc.ok, false);
  assert.equal(sonuc.sebep, 'http-503');
});

test('kaynak.headers embedCoz seçeneklerine taşınır', async () => {
  let gorulen = null;
  await kaynakDogrula(
    { id: 'l', streamUrl: 'https://s6.ornek.com/play?id=x', headers: { Referer: 'https://ornek.com/', Origin: 'https://ornek.com' } },
    {
      fetchFn: async () => yanit(playlist(4, 4)),
      gomuluMu: () => true,
      embedCoz: async (adres, secenek = {}) => { gorulen = secenek; return { durum: 'akis', akis: 'https://s6.ornek.com/ic.m3u8' }; },
    }
  );
  assert.ok(gorulen, 'embedCoz çağrılmalı');
  assert.equal(baslikOku(gorulen.headers, 'referer'), 'https://ornek.com/');
  assert.equal(gorulen.ref, 'https://ornek.com/', 'ref olarak Referer geçirilir');
  assert.ok(Number(gorulen.ms) >= 7000, 'embed bütçesi cömert (sayfa + iç akış)');
});

/* ── GÖMÜLÜ İŞARETLİ SATIR (çekirdek çıktı sözleşmesi, 2026-11-17) ─────
   Green-Arrow artık gömülü oynatıcı sayfalarını `type:'embed', isIframe,
   gomulu:true, format:'embed', isM3u8:false` ile işaretliyor. Bu satırlar
   akış dalından girerse HTML gövdesi "govde-tanimasiz" sayılıp ÖLÜ ilan
   edilirdi — çalışan kaynağı öldürmek kullanıcı talebinin tersi. */

/** Gerçek embedCozucu'nun sözleşmesini taklit eden sahte çözücü: sayfayı
 *  verilen başlıklarla çeker, `file:"..."` desenini çıkarır. */
function sahteEmbedCozucu(fetchFn) {
  return async (adres, secenek = {}) => {
    const yanit1 = await fetchFn(adres, { headers: secenek.headers || {} });
    const govde = await yanit1.text();
    const m = govde.match(/file\s*:\s*["']([^"']+\.m3u8[^"']*)["']/i);
    if (!m) return { durum: 'cozulemedi', sebep: 'desen-yok' };
    return { durum: 'akis', akis: new URL(m[1], adres).toString() };
  };
}

test('gömülü işaretli satır → sayfa çözülür, akış kaynağa YAZILIR, Origin/Referer sayfaya gider', async () => {
  const sayfa = 'https://x.dizisol1.workers.dev/play?id=abc';
  const ic = 'https://x.dizisol1.workers.dev/hls/a.m3u8';
  const cagrilar = [];
  const fetchFn = async (adres, init = {}) => {
    const url = String(adres);
    cagrilar.push({ url, basliklar: { ...(init.headers || {}) } });
    if (url === sayfa) return yanit(`<script>player.setup({ file:"${ic}" })</script>`, { tip: 'text/html' });
    if (url === ic) return yanit(playlist(20, 30));
    return yanit('', { durum: 404, tip: 'text/plain' });
  };
  const kaynak = {
    id: 'ga_1',
    url: sayfa,
    type: 'embed',
    isIframe: true,
    gomulu: true,
    isM3u8: false,
    format: 'embed',
    embedSayfa: sayfa,
    headers: { Origin: 'https://dizisol.com', Referer: 'https://dizisol.com/' },
  };
  const sonuc = await kaynakDogrula(kaynak, { fetchFn, embedCoz: sahteEmbedCozucu(fetchFn), gomuluMu: () => true });
  assert.equal(sonuc.ok, true, 'çözülen gömülü kaynak oynatılabilir');
  assert.equal(sonuc.sebep, 'gomulu-akis');
  assert.match(kaynak.url, /\.m3u8$/, 'kaynağa gerçek akış yazılır (oynatıcı bunu açar)');
  assert.equal(kaynak.streamUrl, ic);
  assert.equal(kaynak.isM3u8, true);
  assert.equal(kaynak.format, 'm3u8');
  assert.equal(kaynak.dogrulandi, true);
  assert.equal(kaynak.embedSayfa, sayfa, 'orijinal sayfa referans olarak kalır');
  const sayfaIstegi = cagrilar.find(c => c.url === sayfa);
  assert.equal(baslikOku(sayfaIstegi.basliklar, 'origin'), 'https://dizisol.com');
  assert.equal(baslikOku(sayfaIstegi.basliklar, 'referer'), 'https://dizisol.com/');
  assert.equal(sonuc.parca, 20);
  assert.ok(cagrilar.length <= 3, 'sayfa + iç akış dışında istek yok');
});

test('gömülü çözülür ama akış BAŞKA origin’de → belirsiz (uydurma eşleşme kabul edilmez)', async () => {
  const kaynak = { id: 'ga_x', url: 'https://a.ornek/play?id=1', type: 'embed', gomulu: true, isM3u8: false };
  const sonuc = await kaynakDogrula(kaynak, {
    fetchFn: async (adres) => (String(adres).includes('/play')
      ? yanit('<html>player</html>', { tip: 'text/html' })
      : yanit(playlist(10, 4))),
    gomuluMu: () => true,
    embedCoz: async () => ({ durum: 'akis', akis: 'https://baskasite.test/gizli/index.m3u8' }),
  });
  assert.equal(sonuc.ok, false);
  assert.equal(sonuc.belirsiz, true);
  assert.equal(sonuc.sebep, 'gomulu-yabanci-akis');
});

test('gömülü sayfa fetch’i zaman aşımına düşerse → belirsiz (ölü değil)', async () => {
  const kaynak = { id: 'ga_y', url: 'https://a.ornek/play?id=2', type: 'embed', gomulu: true, isM3u8: false };
  const sonuc = await kaynakDogrula(kaynak, {
    fetchFn: () => new Promise(() => {}),
    ms: 120,
    gomuluMu: () => true,
    embedCoz: async (adres, secenek = {}) => {
      const y = await secenek.fetchFn(adres, { headers: secenek.headers });
      return { durum: 'akis', akis: 'https://a.ornek/x.m3u8' };
    },
  });
  assert.equal(sonuc.ok, false);
  assert.equal(sonuc.belirsiz, true);
  assert.equal(sonuc.sebep, 'zaman-asimi');
});

test('gömülü çözülemeyen satır aggregator’da listeye KONMAZ (dogrulanmadi)', () => {
  const kaynak = readFileSync(new URL('../src/services/kaynak/providerAggregator.js', import.meta.url), 'utf8');
  assert.match(kaynak, /gomuluCozulemedi/, 'çözülemeyen gömülü satır işaretlenir');
  assert.match(kaynak, /const gorunen = /, 'yalnız görünür (kanıtlı) küme yayınlanır');
});

/* ── toplu ayrıştırma: kutular ────────────────────────────────────────── */

test('karışık 6 kaynak → oynatilir/belirsiz/olu kutuları doğru', async () => {
  const kaynaklar = [
    { id: 'saglam-1', streamUrl: 'https://cdn.test/1/index.m3u8' },
    { id: 'rate-limit', streamUrl: 'https://cdn.test/2/index.m3u8' },
    { id: 'html', streamUrl: 'https://cdn.test/3/index.m3u8' },
    { id: 'yasak', streamUrl: 'https://cdn.test/4/index.m3u8' },
    { id: 'sunucu-hatasi', streamUrl: 'https://cdn.test/5/index.m3u8' },
    { id: 'saglam-2', streamUrl: 'https://cdn.test/6/master.m3u8' },
  ];
  const fetchFn = async (adres) => {
    const url = String(adres);
    if (url.includes('/1/')) return yanit(playlist(741, 4));
    if (url.includes('/2/')) return yanit('', { durum: 429, tip: 'text/plain' });
    if (url.includes('/3/')) return yanit('<html>captcha</html>', { tip: 'text/html' });
    if (url.includes('/4/')) return yanit('forbidden', { durum: 403, tip: 'text/plain' });
    if (url.includes('/5/')) return yanit('', { durum: 500, tip: 'text/plain' });
    if (url.endsWith('master.m3u8')) return yanit(MASTER);
    return yanit(playlist(741, 4));
  };
  const { oynatilir, belirsiz, olu } = await dogrulanmislariAyir(kaynaklar, {
    fetchFn,
    ms: 500,
    butceMs: 4000,
    ...EMBED_KAPALI,
  });
  assert.deepEqual(oynatilir.map(k => k.id), ['saglam-1', 'saglam-2']);
  assert.deepEqual(belirsiz.map(k => k.id), ['rate-limit']);
  assert.deepEqual(olu.map(k => k.id).sort(), ['html', 'sunucu-hatasi', 'yasak']);
  assert.equal(oynatilir[0].dogrulandi, true, 'doğrulananlar dürüstçe işaretlenir');
  assert.equal(belirsiz[0].dogrulandi, false, 'belirsizler dogrulandi:false');
  const liste = [...oynatilir, ...belirsiz];
  assert.ok(!liste.some(k => k.id === 'yasak'), 'ölü kaynak listeye giremez');
});

test('dogrulanmislariAyir eşzamanlılığı 6 ile sınırlar', async () => {
  let anlik = 0;
  let zirve = 0;
  const kaynaklar = Array.from({ length: 18 }, (_, i) => ({ id: `n${i}`, streamUrl: `https://cdn.test/${i}/index.m3u8` }));
  await dogrulanmislariAyir(kaynaklar, {
    ms: 500,
    butceMs: 6000,
    ...EMBED_KAPALI,
    fetchFn: async () => {
      anlik += 1;
      zirve = Math.max(zirve, anlik);
      await new Promise(r => setTimeout(r, 5));
      anlik -= 1;
      return yanit(playlist(4, 4));
    },
  });
  assert.ok(zirve <= 6, `eşzamanlı istek ${zirve} — 6'yı aşmamalı`);
});

test('bütçe bitince kalanlar belirsiz olur (ölü ilan edilmez)', async () => {
  const yavas = () => new Promise(() => {});
  const kaynaklar = Array.from({ length: 8 }, (_, i) => ({ id: `b${i}`, streamUrl: `https://cdn.test/b${i}/index.m3u8` }));
  const { oynatilir, belirsiz, olu } = await dogrulanmislariAyir(kaynaklar, {
    fetchFn: yavas, ms: 1000, butceMs: 300, ...EMBED_KAPALI,
  });
  assert.equal(oynatilir.length, 0);
  assert.equal(olu.length, 0, 'bütçe aşımı ölüm kanıtı değildir');
  assert.equal(belirsiz.length, 8);
});

test('boş/bozuk girdi kapıyı çökertmez', async () => {
  const { oynatilir, belirsiz, olu } = await dogrulanmislariAyir(null, { fetchFn: async () => yanit('') });
  assert.deepEqual([oynatilir.length, belirsiz.length, olu.length], [0, 0, 0]);
  const sonuc = await kaynakDogrula(null, { fetchFn: async () => yanit('') });
  assert.equal(sonuc.ok, false);
  assert.equal(sonuc.belirsiz, true);
});

/* ── FAIL-OPEN: hiçbir şey doğrulanamazsa liste BOŞ KALMAZ ────────────── */

test('fail-open: korunan yoksa elenenler geri gelir (liste boş dönmez)', () => {
  const a = { id: 'a', category: 'dubbed', dogrulandi: false };
  const b = { id: 'b', category: 'subtitled', dogrulandi: false };
  const sonuc = failOpenBirlestir({
    dubbed: [],
    subtitled: [],
    elenenler: [{ category: 'dubbed', kaynak: a }, { category: 'subtitled', kaynak: b }],
  });
  assert.equal(sonuc.failOpen, true);
  assert.deepEqual(sonuc.dubbed.map(k => k.id), ['a']);
  assert.deepEqual(sonuc.subtitled.map(k => k.id), ['b']);
});

test('fail-open: doğrulanmış kaynak varsa ölüler listeye geri gelmez', () => {
  const iyi = { id: 'iyi', category: 'dubbed', dogrulandi: true };
  const olu = { id: 'olu', category: 'dubbed', dogrulandi: false };
  const sonuc = failOpenBirlestir({
    dubbed: [iyi],
    subtitled: [],
    elenenler: [{ category: 'dubbed', kaynak: olu }],
  });
  assert.equal(sonuc.failOpen, false);
  assert.deepEqual(sonuc.dubbed.map(k => k.id), ['iyi'], 'ölü kaynak iddiası geçersiz');
});

/* ── bağlama bekçisi: aggregator gerçekten kapıyı kullanıyor mu ────────── */

test('providerAggregator: kapı bağlı, ölüler listeye girmiyor, fail-open uyarısı var', () => {
  const kaynak = readFileSync(new URL('../src/services/kaynak/providerAggregator.js', import.meta.url), 'utf8');
  assert.match(kaynak, /import \{ dogrulanmislariAyir \} from '\.\/kaynakDogrulayici\.js'/, 'doğrulayıcı import edilmeli');
  assert.match(kaynak, /dogrulanmislariAyir\(/, 'kapı çağrılmalı');
  assert.match(kaynak, /const yayinlanan = \[\.\.\.oynatilir, \.\.\.belirsiz\]/, 'yalnız oynatılır + belirsiz yayınlanır');
  assert.match(kaynak, /fetchFn: kapiFetch/, 'kapı CORS-güvenli ağ adaptöründen geçmeli (tarayıcıda kör kalmamalı)');
  assert.match(kaynak, /elenenler\.push\(/, 'ölüler ayrı kovaya alınır');
  assert.match(kaynak, /\[kaynak\] dogrulama acik kaldi/, 'fail-open uyarısı var');
  assert.match(kaynak, /await dogrulamaKuyrugu/, 'sonuç yayınlanmadan kapı beklenir');
});

test('providerAggregator: kademeli akış korunuyor (kısa dizi + kahraman aynı anda)', () => {
  const kaynak = readFileSync(new URL('../src/services/kaynak/providerAggregator.js', import.meta.url), 'utf8');
  assert.match(kaynak, /kahramanTaramasi = kaynakTara\(/, 'kahraman taraması saklanır');
  assert.match(kaynak, /await Promise\.allSettled\(\[/, 'kısa dizi hatları paralel kalır');
  const cagri = kaynak.match(/kisaDizi && fetch\w+\(/g) || [];
  assert.equal(cagri.length, 4, 'dört kısa dizi çağrısı korunur');
});

/* BAŞLIKLA AÇILAN ÇIPLAK SATIR WEB'DE PROXY'YE SARILIR (2026-11-17).
   Kapı satırı türettiği Referer/Origin ile açtıysa, düz web oynatıcısı aynı
   başlıkları gönderemeyeceği için çıplak adres 403 yer. Native/masaüstü
   istemciler başlığı kendisi gönderebildiğinden orada davranış değişmez. */
test('providerAggregator: türev-başlıkla açılan satır yalnız webde başlık proxy-sine sarılır', () => {
  const kaynak = readFileSync(new URL('../src/services/kaynak/providerAggregator.js', import.meta.url), 'utf8');
  assert.match(kaynak, /k\.baslikTuretildi/, 'kapı işareti yeniden-sarmalamada okunmalı');
  assert.match(kaynak, /!baslikGonderebilir\(\)/, 'sarmalama yalnız başlık gönderilemeyen ortamda');
  assert.match(kaynak, /export function baslikGonderebilir\(\)/, 'yetenek sorgusu dışa açık (test + tüketim)');
  const blok = kaynak.slice(kaynak.indexOf('const baslikTuretilmis'), kaynak.indexOf('const yayinlanan'));
  assert.match(blok, /oynatmaAdresi\(akis, başlık\)/, 'sarılan adres oynatma adresi olmalı');
  assert.match(blok, /k\.koprulendi = true/, 'çift sarmalama koruması işaretlenir');
});

test('providerAggregator: başlık yeteneği native/masaüstünde true, webde false', async () => {
  const mod = await import('../src/services/kaynak/providerAggregator.js');
  assert.equal(typeof mod.baslikGonderebilir, 'function');
  const onceki = globalThis.window;
  try {
    delete globalThis.window;
    assert.equal(mod.baslikGonderebilir(), false, 'node/web bağlamında başlık gönderilemez');
    globalThis.window = { CinePulseDesktop: { isDesktop: true } };
    assert.equal(mod.baslikGonderebilir(), true, 'masaüstü ağ geçidi başlıkları taşır');
  } finally {
    if (onceki === undefined) delete globalThis.window; else globalThis.window = onceki;
  }
});
