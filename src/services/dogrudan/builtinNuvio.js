/* ── YERLİ NUVİO SAĞLAYICILARI (kullanıcı 2026-10-29) ─────────────────────
   "video boltu direkt çalıp cinepulse'a ekleyelim … önce o ikisini ekle" —
   kullanıcı onayıyla KASITLI dar liste: Türkçe dublaj + çok ses/altyazı
   parçası verdiği cihazda GÖRÜLEN yalnız PopWatch ve VidBolt. Başka
   sağlayıcı EKLENMEZ; dublajı cihazda doğrulanırsa listeye alınır.
   Provider JS'leri APK ile paketlenir (public/nuvio-builtin/); eklenti kaydı
   gerektirmez — tarama dalı kendi kendine koşar, kodlar same-origin fetch'le
   okunup motora kodTohumla ile verilir (motor provider kodu için ağa çıkmaz;
   vekil yalnız scraper'ların site istekleri için kullanılır). */

const SAGLAYICILAR = [
  { ad: 'PopWatch', id: 'yerli-popwatch', filename: 'providers/popwatch.js', supportedTypes: ['movie', 'tv'] },
  { ad: 'VidBolt', id: 'yerli-vidbolt', filename: 'providers/vidbolt.js', supportedTypes: ['movie', 'tv'] },
];

/** YERLİ_NUVIO_KAYIT: depodaAra'nın beklediği sahte-kayıt — eklenti listesinde
    GÖRÜNMEZ (localStorage'a yazılmaz), yalnız tarama dalı kullanır. */
export const YERLI_NUVIO_KAYIT = {
  ad: 'Yerli',
  aile: 'nuvio-depo',
  url: '', // yerliTaban() tarama anında çözülür
  scrapers: SAGLAYICILAR.map(s => ({ ...s, enabled: true, contentLanguage: [] })),
};

/** public/nuvio-builtin kökü: Capacitor'da capacitor://localhost, web'de sunucu origin'i. */
export function yerliTaban() {
  if (typeof location !== 'undefined' && location.origin && /^https?:|^capacitor:/.test(location.origin)) {
    return `${location.origin}/nuvio-builtin`;
  }
  return '/nuvio-builtin';
}

let tohumlu = false;
/* Tohumlama fetch'i YEREL olmalı: tarama sırasında globalThis.fetch geçici
   olarak vekilin kopruFetch'ine çevrilir (vekil.js kuşak deseni) — o anda
   kendi origin'imize istek atarsak adres dış vekilden geçirilip ölür
   (cihazda ölçüldü: /api/proxy?url=https://localhost/… → tohumsuz motor).
   YEREL_FETCH modül yüklenirken yakalanır; eminlik yedeği native XHR'dir
   (vekil sandbox'a kendi XHR'ını enjekte eder, GLOBAL XHR'a dokunmaz). */
const YEREL_FETCH = (typeof globalThis !== 'undefined' && typeof globalThis.fetch === 'function')
  ? globalThis.fetch.bind(globalThis) : null;
function xhrMetin(url) {
  return new Promise((çöz, red) => {
    try {
      const x = new XMLHttpRequest();
      x.open('GET', url, true);
      x.responseType = 'text';
      const t = setTimeout(() => { try { x.abort(); } catch (_) {} red(new Error('timeout')); }, 8000);
      x.onload = () => { clearTimeout(t); (x.status >= 200 && x.status < 400) ? çöz(x.responseText) : red(new Error(String(x.status))); };
      x.onerror = () => { clearTimeout(t); red(new Error('xhr-hata')); };
      x.send();
    } catch (h) { red(h); }
  });
}
/** Provider kodlarını APK varlıklarından okuyup motora tohumlar (bir kez).
    Okunamayan dosya sessiz kalır; motor onun için ağa düşer ve depodaAra'nın
    hatalar[] listesinde hata-izole görünür. */
export async function yerliNuvioTohumla(motor) {
  if (tohumlu || !motor || typeof motor.kodTohumla !== 'function') return;
  const taban = yerliTaban();
  await Promise.all(YERLI_NUVIO_KAYIT.scrapers.map(async (s) => {
    const url = `${taban}/${s.filename}`;
    try {
      let kod = null;
      if (YEREL_FETCH) {
        try {
          const yanit = await YEREL_FETCH(url, { signal: AbortSignal.timeout(8000) });
          if (yanit.ok) kod = await yanit.text();
        } catch (_) { /* XHR yedeğine düş */ }
      }
      // Sağlama: vekil çöpü/yarıksız dosy tohuma karışmasın — provider JS'i
      // daima getStreams bildirir.
      if (kod && kod.includes('getStreams')) { /* tamam */ } else { kod = null; }
      if (!kod) kod = await xhrMetin(url);
      motor.kodTohumla(url, kod);
    } catch (hata) {
      console.warn('[yerli-nuvio] kod okunamadı:', s.filename, hata?.message || hata);
    }
  }));
  tohumlu = true;
}

/** Önizleme listesinden parça sayısı: "a, b, c +15" → 3+15. */
function parcaSay(ham) {
  const metin = String(ham || '').trim();
  if (!metin) return 0;
  const t = metin.match(/\+(\d+)\s*$/);
  const n = metin.split(',').filter(x => x.trim()).length;
  return n + (t ? Number(t[1]) : 0);
}

/**
 * YERLİ satır için TEMİZ tek etiket — "birebir eklentideki gibi" tek zengin
 * satır (kullanıcı 2026-10-29: "23 altyazı + 23 dublaj seçeneği çıkmıştı,
 * şu anki ham liste duvarını kaldır"). Ham Nuvio başlığındaki ses/altyazı
 * önizlemelerinden GERÇEK sayıları okur; sayılamayan bilgi uydurulmaz.
 */
export function yerliTemizEtiket(sag, baslik, havuzBilgi = {}) {
  const ham = String(baslik || '').replace(/\s+/g, ' ');
  // Seçilen sunucu bazı açılışlarda dil listesi taşımaz ("Auto [HLS]" gibi);
  // o zaman HAVUZUN en iyi sayımı kullanılır — aynı sağlayıcının diğer
  // sunucusunda kanıtlı 10 ses/32 altyazı varken satır bilgisiz görünmesin.
  const sesN = parcaSay((ham.match(/ses:\s*([^|]+)/i) || [])[1]) || Number(havuzBilgi.sesN) || 0;
  const altyaziN = parcaSay((ham.match(/altyazi:\s*([^|]+)/i) || [])[1]) || Number(havuzBilgi.altyaziN) || 0;
  const kal = (ham.match(/(\d{3,4})p/i) || [])[1] || havuzBilgi.kalite || '';
  const tur = /\[HLS/i.test(ham) ? 'HLS' : /\[MP4/i.test(ham) ? 'MP4' : '';
  const sesSecim = /ses dili secilebilir/i.test(ham);
  const parcalar = [sag];
  if (kal) parcalar.push(`${kal}p`);
  // Yalnız SAYI: dil adı listesi satıra yazılmaz (eklentideki tek satır gibi).
  if (sesN) parcalar.push(`${sesN} Ses${sesSecim ? ' · Seçilebilir' : ''}`);
  if (altyaziN) parcalar.push(`${altyaziN} Altyazı`);
  if (tur) parcalar.push(`[${tur}]`);
  return parcalar.join(' · ');
}

/** Sağlayıcı havuzundan TEK en zengin satırı seçer (kullanıcı 2026-10-29:
 *  "videbolt ve popun bir tane kaynağı çıkıyordu eklentide, o da 23 dublaj ve
 *  altyazıydı — şuan bir sürü alakasız çıkıyor, birebir o eklentidekini
 *  istiyorum"). Provider sunucu/dil başına satır üretiyor; eklenti görünümünde
 *  tek satır + başlığında tam ses/altyazı listesi vardı. Skor: "ses:" listesi
 *  (madde sayısı), sonra "altyazı:" listesi, sonra kalite, sonra Multi/1080.
 *  (Satır başlığının TEMİZ etikete çevrilmesi çağrıda — yerliTemizEtiket.) */
export function zenginYerliSatir(satirlar) {
  let enIyi = null;
  let enSkor = -1;
  for (const s of satirlar || []) {
    const bas = String(s?.hamBaslik || s?.baslik || '');
    // GERÇEK parça sayıları: provider başlığı "ses: a, b, c +15 | altyazı: …"
    // biçiminde. Eskiden "1. " numaralı liste aranıyordu ve hiç eşleşmediği
    // için skor 0 kalıp RASTGELE (genellikle en yoksul) satır seçiliyordu —
    // kullanıcının "23 dublaj/altyazı vardı, şimdi 3-4 dil" şikâyetinin kökü.
    const sesN = parcaSay((bas.match(/ses:\s*([^|]+)/i) || [])[1]);
    const altyaziN = parcaSay((bas.match(/altyazi:\s*([^|]+)/i) || [])[1]);
    const sesListe = (bas.match(/ses:\s*([^|]+)/i) || [])[1] || '';
    const altyaziListe = (bas.match(/altyazi:\s*([^|]+)/i) || [])[1] || '';
    // TÜRKÇE KANITI EN AĞIR ÖLÇÜT (kullanıcı 2026-10-29: "dublaj azlığı"):
    // havuzda TR sesli tek bir sunucu bile varsa tek zengin satır ONU seçer —
    // yoksa en çok dilli İngilizce sunucu kazanıp TR dublaj görünmez oluyordu.
    const trSes = /\bt[uü]rk(?:ish|çe|ce)?\b/i.test(sesListe);
    const trAltyazi = /\bt[uü]rk(?:ish|çe|ce)?\b/i.test(altyaziListe);
    const kalite = Number((bas.match(/(\d{3,4})p/i) || [0, 0])[1]) || 0;
    const multi = /çok sesli|cok sesli|\bmulti\b/i.test(bas) ? 250 : 0;
    const sesSecim = /ses dili secilebilir/i.test(bas) ? 120 : 0;
    if (!sesN && !altyaziN && !kalite) continue; // bilgisiz satır kazanmasın
    const skor = (trSes ? 1000000 : 0) + (trAltyazi ? 100000 : 0)
      + sesN * 1000 + altyaziN * 30 + multi + sesSecim + kalite;
    if (skor > enSkor) { enSkor = skor; enIyi = s; }
  }
  // Hiçbir satırda dil bilgisi yoksa ilk satır kullanılır (boş dönmesin).
  return enIyi || (satirlar || [])[0] || null;
}
