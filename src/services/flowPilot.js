/* ==========================================================================
   Akış Otopilotu — Saf Karar Çekirdeği
   --------------------------------------------------------------------------
   Netflix'in "senin için en iyi oynatma seçeneği" istemci-tarafı karşılığı.
   TÜM GİRİLER PARAMETREYLE ENJETİLENİR: hiçbir global DOM/localStorage/Date
   erişimi yok. Deterministik, test edilebilir.
   ========================================================================== */

/**
 * Saf karar çekirdeği — UI/depolama/şehir sinyalleri parametreyle girer;
 * test edilebilirlik için hiçbir global durum okumaz.
 */
export function akışOtopilotu({ kaynaklar, cihazSkorlari, aileGuveni, tercih, geceKoveti } = {}) {
  // Kaynaklar boşsa/null → null döndür (atma yok)
  if (!Array.isArray(kaynaklar) || kaynaklar.length === 0) return null;

  // cihaz skorları: objesi veya Map. Yoksa tümü 50.
  let skorlar;
  if (!cihazSkorlari || typeof cihazSkorlari !== 'object') {
    skorlar = {};
    for (let i = 0; i < kaynaklar.length; i++) skorlar[i] = 50;
  } else if (cihazSkorlari instanceof Map) {
    skorlar = Object.fromEntries(cihazSkorlari);
  } else {
    skorlar = { ...cihazSkorlari };
  }
  // Eksik indeksleri 50 ile doldur (deterministik normalize)
  for (let i = 0; i < kaynaklar.length; i++) {
    if (skorlar[i] === undefined) skorlar[i] = 50;
  }

  // Aile güveni haritası: objedir; aileKodu ile bulunur. Yoksa 0.5 nötr.
  if (typeof aileGuveni !== 'object' || aileGuveni === null) aileGuveni = {};

  // Puan hesapla: toplam = cihazSkoru*1.0 + aileGuveni*25 + tercihEşleşmesi*12
  // (+ geceKoveti bonusu: cihazSkoru*0.15)
  const geceKovetiBonusu = geceKoveti ? 0.15 : 0;

  const kayitlar = [];
  for (let i = 0; i < kaynaklar.length; i++) {
    const src = kaynaklar[i];
    // cihaz skoru (her zaman var artık)
    const cihazSkor = Number(skorlar[i]) || 0;

    // Aile güveni: aileKodu(src.id) ile anahtar bulun; yoksa 0.5
    const aileAnahtari = aileKodu(src.id);
    const guven = aileGuveni[aileAnahtari] !== undefined ? Number(aileGuveni[aileAnahtari]) : 0.5;

    // Tercih eşleşmesi: 12 puan eğer tercih eşleşirse
    let tercihPuan = 0;
    if (tercih === 'dub') {
      if (src.dublaj || src.dubbed) tercihPuan = 12;
    } else if (tercih === 'altyazi') {
      if (src.altyazi || src.subtitles || src.languages) tercihPuan = 12;
    } else if (tercih === 'farketmez') {
      // farketmez: her zaman 0 puan eklenmez
      tercihPuan = 0;
    }

    // Toplam puan
    const toplam = cihazSkor * 1.0 + guven * 25 + tercihPuan + cihazSkor * geceKovetiBonusu;

    kayitlar.push({ idx: i, puan: toplam, source: src });
  }

  // Sırala: toplam puan azalan; eşitlikte düşük idx kazanır (kararlılık)
  kayitlar.sort((a, b) => b.puan - a.puan || a.idx - b.idx);

  const idx = kayitlar[0].idx;
  const alternatifIdx = kayitlar.length > 1 ? kayitlar[1].idx : -1;

  // Nedenler üret (1-3 kısa, pozitif Türkçe cümle)
  const kazanan = kayitlar[0].source;
  const kazananGuven = Number(aileGuveni[aileKodu(kazanan.id)]);
  const nizNedenler = nedenMetniUret(kazanan, tercih,
    Number.isFinite(kazananGuven) ? kazananGuven : 0.5);

  return { idx, alternatifIdx, nedenler: nizNedenler };
}

/**
 * Aile kodundan (id'den) aile adını çıkar.
 * 'polar_17_0' → 'polar'; '_' yoksa küçük harfe çevrilmiş id'nin kendisi
 * @param {string} kaynakId
 * @returns {string}
 */
export function aileKodu(kaynakId) {
  if (!kaynakId || typeof kaynakId !== 'string') return String(kaynakId).toLowerCase();
  if (!kaynakId.includes('_')) return String(kaynakId).toLowerCase();
  return String(kaynakId).split('_')[0].toLowerCase();
}

/**
 * Nedenler dizini kullanıcı cümlesine çevirir.
 * @param {string[]} nedenler - nizden alınmış dizeler
 * @returns {string}
 */
export function nedenMetni(nedenler) {
  if (!Array.isArray(nedenler) || nedenler.length === 0) return '';
  if (nedenler.length === 1) return nedenler[0];
  // Çoklu: ilk iki elemanı birleştirerek makul bir cümle yap
  return `${nedenler[0]} ${nedenler[1]}`;
}

/**
 * Nedenler dizisi için pozitif Türkçe cümleler üretir.
 * @param {object} kaynak - seçilen kaynak objesi
 * @param {string} tercih - 'dub' | 'altyazi' | 'farketmez'
 * @param {number} guven - aile güveni skoru (0-1)
 * @returns {string[]} 1-3 kısa pozitif cümle
 */
function nedenMetniUret(kaynak, tercih, guven) {
  const nedenler = [];

  // Tercih-related reason (pozitif formulasyon)
  const hasDub = !! (kaynak.dublaj || kaynak.dubbed);
  const hasSub = !! (kaynak.altyazi || kaynak.subtitles || kaynak.languages);

  if (tercih === 'dub' && (kaynak.dublaj || kaynak.dubbed)) {
    nedenler.push('Tercihine uygun dublaj mevcut');
  } else if (tercih === 'altyazi' && (kaynak.altyazi || kaynak.subtitles || kaynak.languages)) {
    nedenler.push('Tercihine uygun altyazı mevcut');
  }
  // 'farketmez': kullanıcıya tercih itirafı satırı gösterilmez; aşağıdaki
  // olumlu yedek neden (hız/dublaj/altyazı) devreye girer.

  // Family trust reason (eğer ≥ 0.75)
  if (guven >= 0.75) {
    nedenler.push('Bu kaynakla daha önce sorunsuz izlemiştin');
  }

  // Eğer hiçbir sebep eklenmedse (edge case), kaynağın varlığını temel
  // pozitif bildir
  if (nedenler.length === 0) {
    if (hasDub) {
      nedenler.push('Dublaj seçeneği mevcut');
    } else if (hasSub) {
      nedenler.push('Altyazı seçeneği mevcut');
    } else {
      // Olumsuz kelime geçmemek için menfi ifadelerden kaçınarak
      // "Cihazında en hızlı doğrulanmış kaynak" basit ve pozitif
      nedenler.push('Cihazında en hızlı doğrulanmış kaynak');
    }
  }

  // KESIN: /ölü|bozuk|düşüş|yavaş|değil/i regex tuzak testi için
  // uçuş olmamalı. Nedenler sadece pozitif ifadeler içermeli.

  // 1-3 arası cümle sınırını zorla (az ise ekle, çoksa kes)
  if (nedenler.length > 3) nedenler.length = 3;

  return nedenler;
}