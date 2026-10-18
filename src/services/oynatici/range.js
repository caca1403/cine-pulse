/* ==========================================================================
   CinePulse — Range (bayt aralığı) yardımcıları
   --------------------------------------------------------------------------
   HLS oynatıcısı segment isterken `Range: bytes=a-b` gönderir. İki uç da
   (masaüstü sidecar ve Vercel yönlendiricisi) aynı kuralları uygulamalı:
     · aralık geçerliyse 206 Partial Content + Content-Range
     · geçersizse 416 + "bytes star-slash TOPLAM"
     · hiç aralık yoksa 200 + Accept-Ranges: bytes
   Saf fonksiyonlar (bağımlılık yok) → doğrudan test edilir.
   ========================================================================== */

/** `bytes=0-999`, `bytes=500-`, `bytes=-500` → {baslangic, bitis} veya null. */
export function aralikAyikla(header) {
  if (!header || typeof header !== 'string') return null;
  const m = /^bytes=(\d*)-(\d*)$/i.exec(header.trim());
  if (!m) return null;
  const [, bas, bit] = m;
  if (bas === '' && bit === '') return null;
  if (bas === '') {
    const son = Number(bit);
    if (!Number.isFinite(son) || son <= 0) return null;
    return { baslangic: null, bitis: son, sondan: true };
  }
  const b = Number(bas);
  if (!Number.isFinite(b)) return null;
  const s = bit === '' ? null : Number(bit);
  if (s !== null && !Number.isFinite(s)) return null;
  return { baslangic: b, bitis: s, sondan: false };
}

/** İstek için durum + Content-Range. `toplam` bilinmiyorsa null olabilir. */
export function aralikCoz(header, toplam) {
  const a = aralikAyikla(header);
  if (!a) {
    return { gecerli: false, durum: 416, contentRange: toplam ? `bytes */${toplam}` : null, baslangic: null, bitis: null, uzunluk: null };
  }
  const T = Number(toplam);
  const bilinen = Number.isFinite(T) && T > 0;

  if (a.sondan) {
    if (!bilinen) return { gecerli: false, durum: 416, contentRange: null, baslangic: null, bitis: null, uzunluk: null };
    const uzunluk = Math.min(a.bitis, T);
    const baslangic = T - uzunluk;
    return {
      gecerli: true, durum: 206,
      contentRange: `bytes ${baslangic}-${T - 1}/${T}`,
      baslangic, bitis: T - 1, uzunluk,
    };
  }

  const baslangic = a.baslangic;
  if (bilinen && baslangic >= T) {
    return { gecerli: false, durum: 416, contentRange: `bytes */${T}`, baslangic: null, bitis: null, uzunluk: null };
  }
  const bitis = a.bitis === null
    ? (bilinen ? T - 1 : null)
    : (bilinen ? Math.min(a.bitis, T - 1) : a.bitis);
  if (bitis !== null && bitis < baslangic) {
    return { gecerli: false, durum: 416, contentRange: bilinen ? `bytes */${T}` : null, baslangic: null, bitis: null, uzunluk: null };
  }
  const uzunluk = bitis === null ? null : bitis - baslangic + 1;
  // Toplam bilinmiyorsa RFC gereği '*' kullanılır (dangling slash olmaz).
  const sonEk = bilinen ? `/${T}` : '/*';
  return {
    gecerli: true,
    durum: 206,
    contentRange: `bytes ${baslangic}-${bitis === null ? '' : bitis}${sonEk}`,
    baslangic,
    bitis,
    uzunluk,
  };
}

/**
 * Yanıt başlıkları için birleşik üretici.
 * Yukarı akış zaten 206 döndüyse onun başlıkları korunur (doğruluk için);
 * yoksa bizim hesapladığımız kullanılır.
 */
export function rangeHeaderlari({ istekRange, toplam, yukarıAkisContentRange, yukarıAkisDurum }) {
  const coz = aralikCoz(istekRange, toplam);
  const basliklar = {
    'Accept-Ranges': 'bytes',
    'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges',
  };
  if (!coz.gecerli) {
    if (coz.contentRange) basliklar['Content-Range'] = coz.contentRange;
    return { durum: 416, basliklar };
  }
  basliklar['Content-Range'] = yukarıAkisContentRange || coz.contentRange;
  if (coz.uzunluk != null) basliklar['Content-Length'] = String(coz.uzunluk);
  return { durum: yukarıAkisDurum === 206 ? 206 : 206, basliklar };
}

/** İstekteki Range başlığını yukarı akışa aynen taşımak için (güvenli liste). */
export function gecerliRangeHeader(header) {
  return aralikAyikla(header) ? header : null;
}