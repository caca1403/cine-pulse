/* ==========================================================================
   CinePulse Studio — YAYIN SES İZLEYİCİ (dublaj / altyazı ayrımı)
   --------------------------------------------------------------------------
   NEDEN VAR (2026-10-17): kaynak listesinde "Beastboy", "Nightwing" gibi
   SUNUCU adları görünüyordu; kullanıcı ise "bu Türkçe dublaj mı, altyazılı
   mı?" sorusunun cevabını görmek istiyor. Çekirdeklerin verdiği etiketler
   çoğu zaman gerçeği söylemiyor (aynı sunucu her içerikte dublaj olmuyor).

   ÇÖZÜM: içerik gösterilmeden HEMEN önce yayının KENDİ manifestine bakılır.
   HLS master listesindeki `#EXT-X-MEDIA:TYPE=AUDIO` satırları ses parçalarını
   ve dillerini bildirir (`LANGUAGE="tr"`, `NAME="Türkçe"`). DASH'te
   `<AdaptationSet mimeType="audio" lang="tr">`. Türkçe ses parçası varsa
   yayın Türkçe DUBLAJDIR; yoksa ses özgündür → altyazı devreye alınır.

   Manifest zaten cihaz köprüsünden geçen adrestir (`/api/hls_proxy?...`),
   aynı kaynaktan okunur; ekstra yetki/anahtar gerekmez.
   ========================================================================== */

const TURKCE_DIL = new Set(['tr', 'tur', 'tür']);
const TURKCE_AD = /türk|turk|dublaj|seslendir|dubbed/i;

/** Yalnız playlist adresleri incelenir (video baytları indirilmesin). */
export function playlistMi(url) {
  return /\.m3u8(\?|#|$)|\.mpd(\?|#|$)|hls_proxy|stream_proxy/i.test(String(url || ''));
}

/**
 * Manifest metnini okur: hangi ses dilleri var, Türkçe ses var mı?
 * @returns {{diller:string[],turkceDublaj:boolean}|null} bilinmiyorsa null
 */
export function playlistSesBilgisi(metin) {
  const veri = String(metin || '');
  if (!veri) return null;
  const diller = new Set();
  let turkceAd = false;

  for (const satir of veri.match(/^#EXT-X-MEDIA:.*$/gim) || []) {
    if (!/TYPE=AUDIO/i.test(satir)) continue;
    const dil = (satir.match(/LANGUAGE="([^"]*)"/i) || [])[1];
    const ad = (satir.match(/NAME="([^"]*)"/i) || [])[1] || '';
    if (dil) diller.add(dil.toLowerCase().split(/[-_]/)[0].slice(0, 3));
    if (TURKCE_AD.test(ad)) turkceAd = true;
  }

  if (!diller.size) {
    for (const etiket of veri.match(/<AdaptationSet[^>]*mimeType="audio[^"]*"[^>]*>/gi) || []) {
      const dil = (etiket.match(/xml:lang="([^"]*)"/i) || etiket.match(/lang="([^"]*)"/i) || [])[1];
      if (dil) diller.add(dil.toLowerCase().split(/[-_]/)[0].slice(0, 3));
    }
  }

  const liste = [...diller];
  const turkce = turkceAd || liste.some(d => TURKCE_DIL.has(d));
  if (!liste.length && !turkceAd) return null;
  return { diller: liste, turkceDublaj: turkce };
}

/**
 * Oynatılacak adresten ses bilgisini okur. Kısa zaman aşımı: oynatmayı
 * bekletmemesi için ölçüm sınırlıdır (bulunamazsa null → etiket değişmez).
 */
export async function yayinSesBilgisi(url, { timeoutMs = 3000 } = {}) {
  if (!url || !playlistMi(url)) return null;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return null;
    return playlistSesBilgisi(await res.text());
  } catch (_) {
    return null;
  }
}

/** Etiket metni: "🎙️ Türkçe Dublaj" / "💬 Türkçe Altyazılı" / null (bilinmiyor). */
export function sesEtiketi(bilgi) {
  if (!bilgi) return null;
  return bilgi.turkceDublaj ? '🎙️ Türkçe Dublaj' : '💬 Türkçe Altyazılı';
}
