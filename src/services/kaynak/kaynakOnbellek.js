/* Ortak kaynak tarama önbelleği (kullanıcı 2026-10-29).
 *
 * KURAL SETİ (kullanıcı talepleri, tarihli):
 *  - Oturum ömürlü: uygulama kapanana kadar MODÜL-HAFIZASINDA durur;
 *    localStorage'a YAZILMAZ (geçici istendi).
 *  - Liste SADECE BÜYÜR: yazımlar kimlik-bazlı birleşimdir; 12 önbellekteyse
 *    ve tarama 13 bulursa 13 olur, ASLA azalmaz ('gelmemezlik' yasak).
 *  - YIĞILMA YASAK: önbellekten gelen satır sonraki taramada yeniden
 *    eklenmez — kimlik (streamUrl/url/embedUrl/id) tüm tarafların tek anahtarı.
 *  - EKLENTİ SİLİNİNCE TEMİZLİK: o eklentinin ürettiği satırlar (ekKaynak)
 *    önbellekten ve açık ekranlardan anında düşer.
 * Tüketici tarafları: kaynakListesi (detay sekmesi) ve PlayerModal (havuz
 * tohumlama). EklentiYonetimModal silme sonrası ekKaynakDusur çağırır.
 */

const MAX_KAYIT = 80; // bölüm-bazlı giriş tavanı (LRU); bellek güvencesi
const onbellek = new Map(); // anahtar -> { zaman, tamam, girisler[] }
const dinleyiciler = new Set();

/** Satırın tekil kimliği — tarama/önbellek ayrımı olmadan TEK anahtar. */
export function kimlikOlustur(kaynak) {
  return String(
    kaynak?.streamUrl || kaynak?.url || kaynak?.embedUrl || kaynak?.id || ''
  ).trim();
}

/** KARARLI satır kimliği (kullanıcı 2026-10-29: "önbellekten gelen kaynak
 *  taramada yine gelebiliyor"): CloudStream csAkislar ve Nuvio getStreams
 *  imzalı URL'leri HER taramada yeniler (`?tok=…` döner) — tam URL anahtarı
 *  aynı kaynağı iki farklı satır sayıyordu. Anahtar = sorgu/sas-parçası
 *  soyulmuş adres + sağlayıcı adı + görünen ad; imza dönsen de satır aynıdır.
 *  Adres yolunda dönen imza taşıyan çekirdek satırlarında (/vs/abc123)
 *  yapacak bir şey yok — tam adres zaten kendisi kadar değişkendir. */
export function satirKimligi(kaynak) {
  const url = String(kaynak?.streamUrl || kaynak?.url || kaynak?.embedUrl || '').trim();
  if (!url) return String(kaynak?.id || '').trim();
  const temel = url.split('#')[0].split('?')[0];
  const sag = String(kaynak?.eklentiAdi || kaynak?.source || '').trim().toLowerCase();
  const ad = String(kaynak?.baslik || kaynak?.displayName || kaynak?.title || '').trim().toLowerCase();
  const id = String(kaynak?.id || '').trim().toLowerCase();
  return `${temel}|${sag}|${ad}|${id}`;
}

/** İçerik+bölüm anahtarı (detay ve oynatıcı aynı formülü kullanır). */
export function anahtarOlustur({ tur, tmdbId, baslik, sezon = 1, bolum = 1 }) {
  return `${tur}:${tmdbId || baslik || ''}:s${Number(sezon) || 1}e${Number(bolum) || 1}`;
}

/** @returns {{zaman:number,tamam:boolean,girisler:Array}|null} */
export function onbellekten(anahtar) {
  return onbellek.get(anahtar) || null;
}

/**
 * Birleşim yazımı: mevcut girişler korunur, kimliği yeni olanlar eklenir.
 * girisler: [{ ham, tip:'saglayici'|'eklenti', kimlik, ekKaynak, kategori }]
 */
export function onbellekYaz(anahtar, girisler, tamam = false) {
  const eski = onbellek.get(anahtar);
  const birlesik = eski && Array.isArray(eski.girisler) ? eski.girisler.slice() : [];
  for (const g of (Array.isArray(girisler) ? girisler : [])) {
    if (!g || !g.ham) continue;
    const k = String(g.kimlik || '');
    if (k && birlesik.some(x => x.kimlik === k)) continue; // yığılma yasak
    birlesik.push(g);
  }
  const kayit = {
    zaman: Date.now(),
    tamam: Boolean((eski && eski.tamam) || tamam),
    girisler: birlesik,
  };
  onbellek.delete(anahtar); // LRU tazeliği: en son yazılan en sonda
  onbellek.set(anahtar, kayit);
  while (onbellek.size > MAX_KAYIT) onbellek.delete(onbellek.keys().next().value);
  return kayit;
}

/**
 * Silinen eklentinin satırlarını tüm önbellekten düşürür ve açık ekranların
 * dinleyicilerini bilgilendirir. Kalan liste tamam sayılmaz (tarama telafi
 * edebilsin). @returns number silinen satır sayısı
 */
export function ekKaynakDusur(ekTaban) {
  const taban = String(ekTaban || '');
  if (!taban) return 0;
  let adet = 0;
  for (const [anahtar, v] of onbellek) {
    const oncekiler = Array.isArray(v.girisler) ? v.girisler : [];
    const kalan = oncekiler.filter(g => g.ekKaynak !== taban);
    if (kalan.length !== oncekiler.length) {
      adet += oncekiler.length - kalan.length;
      onbellek.set(anahtar, { ...v, girisler: kalan, tamam: false });
    }
  }
  for (const d of dinleyiciler) { try { d(taban); } catch (_) { /* tek dinleyici hatası akışı bozmasın */ } }
  return adet;
}

/** Canlı ekran (durum) filtreleyicileri kayıt eder; geri-bırak fonksiyonu döner. */
export function onbellekDinle(fn) {
  dinleyiciler.add(fn);
  return () => dinleyiciler.delete(fn);
}

// TEST/teşhis amaçlı (üretim yolu bundan bağımsız).
export function _onbellekBosalt() { onbellek.clear(); }
