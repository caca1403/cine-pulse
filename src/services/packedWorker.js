/* ==========================================================================
   Paketlenmiş oynatıcı JS'ini İZLE ÇALIŞTIRAN worker

   Neden ayrı worker:
   Paketlenmiş oynatıcı kodu sayfanın İÇİNDEN gelir ve biz onu çalıştırırız.
   Ana iş parçacığında `new Function` ile çalıştırmak tehlikelidir: kötü/bozuk
   bir sayfa gigabaytlarca bellek ayırarak hem sekmeyi hem Node'u çökertir
   (ölçüldü: bir sinemacc film sayfası işlemi düşürdü).

   Worker'da çalıştırınca:
     • sonsuz döngü / bellek şişmesi işi öldürmez (terminate edilebilir)
     • çökme olursa ana iş parçacığı etkilenmez
     • zaman aşımı uygulanabilir
   ========================================================================== */

let zamanlayici = null;
const isler = new Map();
let sayac = 0;

// Oynatıcı global'larına yapılan her çağrıyı yakalar.
function oynaticiYap(bulunan) {
  const oynatici = new Proxy({}, {
    get(_, prop) {
      if (prop === Symbol.toPrimitive) return () => '';
      return (...args) => {
        for (const a of args) {
          if (typeof a === 'string' && (/\.m3u8|\.mp4|\.mkv/i.test(a))) bulunan.url = a.replace(/\\\//g, '/');
        }
        return oynatici;
      };
    },
    set(_, prop, value) {
      if (typeof value === 'string' && (/\.m3u8|\.mp4|\.mkv/i.test(value))) bulunan.url = value.replace(/\\\//g, '/');
      return true;
    }
  });
  return oynatici;
}

self.onmessage = async (e) => {
  const { kod, id, timeoutMs = 6000 } = e.data || {};
  const bulunan = { url: '' };
  let bitti = false;
  const bitir = (sonuc) => {
    if (bitti) return;
    bitti = true;
    if (zamanlayici) clearTimeout(zamanlayici);
    self.postMessage({ id, ...sonuc });
  };

  // Zaman aşımı: oynatıcı sonsuz döngüye girerse iş burada kesilir.
  zamanlayici = setTimeout(() => bitir({ ok: false, hata: 'zaman aşımı' }), timeoutMs);

  try {
    const oynatici = oynaticiYap(bulunan);
    const sahte = {
      location: { href: '', search: '' },
      document: { createElement: () => ({ style: {}, addEventListener() {} }) }
    };
    sahte.window = sahte; sahte.self = sahte; sahte.globalThis = sahte;
    const sessiz = { log() {}, warn() {}, error() {}, info() {}, debug() {} };

    const calistir = new Function(
      'window', 'document', 'self', 'globalThis', 'location', 'navigator', 'console',
      'player', 'jwplayer', 'videojs', 'hls', 'Hls', 'Playerjs', 'Player', 'Clappr', 'Plyr',
      kod
    );
    calistir(
      sahte, sahte.document, sahte, sahte, sahte.location, { userAgent: 'node' }, sessiz,
      oynatici, oynatici, oynatici, oynatici, oynatici, oynatici, oynatici, oynatici, oynatici
    );

    bitir({ ok: true, url: bulunan.url });
  } catch (hata) {
    bitir({ ok: false, hata: String((hata && hata.message) || hata) });
  }
};

function workerOlustur() {
  try {
    return new Worker(new URL('./packedWorker.js', import.meta.url), { type: 'module' });
  } catch (_) {
    return null;
  }
}

/**
 * Paketlenmiş kodu çalıştırıp içindeki yayın adresini döner.
 * @returns {Promise<string>} m3u8/mp4 adresi ya da boş dize
 */
export async function pakettiCalistir(kod, { timeoutMs = 6000 } = {}) {
  const w = workerOlustur();
  if (!w || !kod) return '';
  const id = ++sayac;
  return new Promise((resolve) => {
    let bitti = false;
    const bitir = (v) => {
      if (bitti) return;
      bitti = true;
      clearTimeout(t);
      try { w.terminate(); } catch (_) {}
      resolve(v || '');
    };
    const t = setTimeout(() => bitir(''), timeoutMs + 1200);
    w.onmessage = (e) => { if (e.data?.id === id) bitir(e.data?.ok ? e.data.url : ''); };
    w.onerror = () => bitir('');
    w.postMessage({ id, kod, timeoutMs });
  });
}