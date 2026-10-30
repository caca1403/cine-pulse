/* ==========================================================================
   CinePulse — yerel torrent motoru köprüsü (Android arm64: window.CinePulseTorrent)
   --------------------------------------------------------------------------
   Gömülü servis modeli: gerçek libtorrent cihazın içinde koşar
   (UDP/DHT/peers — tarayıcının WebRTC'si değil), yayın 127.0.0.1 yerel
   sunucusundan HTTP-Range ile akar; satır ana oynatıcıda sıradan bir kaynak
   gibi oynar. Motor yoksa (web/masaüstü/diğer ABI) motorVar() false döner ve
   çağıran WebTorrent penceresine ya da masaüstü motoruna düşer.
   ========================================================================== */

export const motorVar = () => {
  try { return typeof window.CinePulseTorrent?.start === 'function'; } catch (_) { return false; }
};

let olayCb = null;

/* Native köprü tek_global olay kanalı kullanır (TorrentBridge.java). */
if (typeof window !== 'undefined') {
  window.__cpTorrentOlay = (json) => {
    let o = null;
    try { o = JSON.parse(String(json)); } catch (_) { o = null; }
    if (olayCb) olayCb(o || { durum: 'hata', mesaj: 'Motor olayı okunamadı.' });
  };
}

/* olay(o): o.durum = 'yayinda' {url,ad,boyut} | 'durum' {hb,peer,ilerle} | 'hata' {mesaj} */
export function motorBaslat(magnet, olay) {
  olayCb = typeof olay === 'function' ? olay : null;
  try {
    window.CinePulseTorrent.start(String(magnet || ''), -1);
    return true;
  } catch (_) {
    olayCb = null;
    return false;
  }
}

export function motorDurdur() {
  olayCb = null;
  try { window.CinePulseTorrent?.stop(); } catch (_) { /* kapatma yarışında sessiz */ }
}

/* Madde 4 çift-play koruması (kullanıcı 2026-10-28): magnetOynat(otomatikOynat
   =true) devrinde 'yayinda' olayını JAVA tüketir. Eski motorBaslat geri
   çağrısı bağlı kalırsa JS aynı akışa kendi ikinci play'ini basardı — bağ
   koparılır (motor DURDURULMAZ, yalnız JS dinleyicisi ayrılır). */
export function motorOlayBaginiKopar() {
  olayCb = null;
}
