/* ==========================================================================
   CinePulse — Kaynak Kapısı (doğrulama + kalıcı eleme)
   --------------------------------------------------------------------------
   KULLANICI KURALI (2026-11-17): "bizde olan her kaynağın çalışması lazım;
   çalışmayan da elensin, kalıcı olarak silinsin."
   Sözleşme:
     1) Listelenen her satır async doğrulanır (denetle):
        · canli     → listede kalır
        · belirsiz  → kalır (ağ/timeout dürüst biçimde "ölü" sayılmaz)
        · olu       → LİSTEDEN ANINDA düşürülür + kalıcı sicile yazılır
     2) Kalıcı sicil (localStorage, 7 gün TTL): aynı host+yol (token'lardan
        arındırılmış) bir daha taramaya rağmen listeye GİRMEZ. TTL sonrası
        kaynak kendini kurtarabilir (sunucular taşınır, WAF'lar kalkar).
     3) FAIL-OPEN (eski kullanıcı kuralı "kaynak listesi boş kalmasın"):
        kapı tüm listeyi bitirirse gizlenenler tek sefer geri açılır —
        etiketleri dogrulanamadi taşır, kullanıcıya asla boş ekran yok.
   Denetim girdisi vekilin BAŞLIK-TAŞIYAN proxy adresidir (/api/hls_proxy?url=…):
   403'ler "bizim hatamız" olmadan önce doğru Referer/Origin ile denenmiş olur
   (ölçüm 2026-11-17: başlıksız yoklama Nova/Gambit'i yanlışlıkla öldürüyordu).
   ========================================================================== */

const SICIL_ANAHTARI = 'cp_kaynak_kapisi_v1';
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 gün
const SICIL_SINIRI = 400;

function sicilYukle() {
  try {
    const ham = globalThis.localStorage?.getItem?.(SICIL_ANAHTARI);
    if (!ham) return {};
    const veri = JSON.parse(ham);
    if (!veri || typeof veri !== 'object' || Array.isArray(veri)) return {};
    const simdi = Date.now();
    for (const [k, v] of Object.entries(veri)) {
      if (!v || typeof v.t !== 'number' || simdi - v.t > TTL_MS) delete veri[k];
    }
    return veri;
  } catch (_) {
    return {};
  }
}

let _sicil = null;
const sicil = () => (_sicil || (_sicil = sicilYukle()));

export function siciliSifirla() {
  _sicil = {};
  try { globalThis.localStorage?.removeItem?.(SICIL_ANAHTARI); } catch (_) {}
}

/** İç barınağa + token'sız yola in: imza süresi dolmuş iki satır aynı kaynaktır;
    kalıcı eleme bu kimliğe yazılır (imzalı URL her taramada değiştiği için
    ham URL'ye yazmak sicili hiç çalıştırmazdı). */
export function kapiAnahtari(item) {
  let s = String(item?.streamUrl || item?.url || (typeof item?.getUrl === 'function' ? item.getUrl() : '') || '');
  for (let i = 0; i < 3; i += 1) {
    const m = s.match(/[?&]url=([^&]+)/i);
    if (!m) break;
    let ic = m[1];
    try { ic = decodeURIComponent(ic); } catch (_) {}
    if (ic === s) break;
    s = ic;
  }
  try {
    const u = new URL(s, 'http://yerel');
    return `${u.host.toLowerCase()}${u.pathname.toLowerCase()}`;
  } catch (_) {
    return s.slice(0, 160).toLowerCase();
  }
}

/** Satır kalıcı sicilde mi? (taramada hiç listelenmeyecek) */
export function sicildeMi(item) {
  return sicil()[kapiAnahtari(item)] !== undefined;
}

/** ÖLÜ kanıtı sicile yazılır (kalıcı eleme — TTL boyunca liste dışı). */
export function oluKaydet(anahtar) {
  if (!anahtar) return;
  const s = sicil();
  s[anahtar] = { t: Date.now() };
  const anahtarlar = Object.keys(s);
  if (anahtarlar.length > SICIL_SINIRI) {
    for (const k of anahtarlar.sort((a, b) => (s[a]?.t || 0) - (s[b]?.t || 0)).slice(0, anahtarlar.length - SICIL_SINIRI)) delete s[k];
  }
  try { globalThis.localStorage?.setItem?.(SICIL_ANAHTARI, JSON.stringify(s)); } catch (_) {}
}

/** Tek satırı denetler: 'canli' | 'olu' | 'belirsiz'.
    Yalnız KESİN ölüm (410/404/403-cached yanlış değil — proxy başlığı taşır;
    200 HTML/JSON çöpü) 'olu' verir. Timeout/ağ/5xx = 'belirsiz'. */
export async function denetle(item, { ms = 9000 } = {}) {
  let ham = String(item?.streamUrl || item?.url || '');
  if (!ham) return 'belirsiz';
  if (ham.startsWith('/')) {
    // apiUrl'a döngüsel bağı kırmak için lazy import; başarısızsa göreli devam eder.
    try {
      if (!apiUrl) {
        const m = await import('../altyapi/apiOrigin.js');
        apiUrl = typeof m.apiUrl === 'function' ? m.apiUrl : null;
      }
      if (apiUrl) ham = apiUrl(ham);
    } catch (_) { /* göreli kalsın */ }
  }
  if (!/^https?:/i.test(ham)) return 'belirsiz';
  const c = new AbortController();
  const zaman = setTimeout(() => { try { c.abort(); } catch (_) {} }, ms);
  try {
    const res = await fetch(ham, { signal: c.signal, headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (res.status === 404 || res.status === 410 || res.status === 451) return 'olu';
    if (res.status === 403) {
      /* Proxy doğru başlıkları TAŞIYARAK istedi; yine 403 ise kaynak bizi
         istemiyor — satır oynatılamaz. (Başlıksız 403'ün yanlış ölüm verdiği
         dönem ölçüldü; bu yüzden denetim her zaman vekil proxy adresinden.) */
      return 'olu';
    }
    if (!res.ok) return 'belirsiz'; // 5xx: sunucu aşırı yüklü olabilir — öldürme
    const ct = String(res.headers?.get?.('content-type') || '').toLowerCase();
    const ilk = await ilkBaytlar(res, 4096);
    const metin = ilk.text;
    if (/#EXTM3U/i.test(metin)) return 'canli';
    if (res.headers?.get?.('content-length') && Number(res.headers.get('content-length')) > 4096 && /video|octet-stream|mp2t/i.test(ct)) return 'canli';
    if (/^(200|206)$/.test(String(res.status)) && ilk.bayt > 2048 && !/text\/html/i.test(ct) && !/^\s*<(!doctype|html)/i.test(metin)) return 'canli';
    if (/text\/html/i.test(ct) || /^\s*<(!doctype|html)/i.test(metin)) return 'olu'; // oynatıcıya HTML giderdi → ölü satır
    if (/application\/json/i.test(ct)) return 'olu';                                // akış değil, hata/hizmet cevabı
    return 'belirsiz';
  } catch (_) {
    return 'belirsiz';
  } finally {
    clearTimeout(zaman);
  }
}

async function ilkBaytlar(res, limit) {
  try {
    if (!res?.body) {
      const t = await res.text();
      return { text: t.slice(0, limit), bayt: Math.min(t.length, limit) };
    }
    const okuyucu = res.body.getReader();
    const parca = await okuyucu.read();
    const bayt = parca?.value?.byteLength || 0;
    const text = new TextDecoder('utf-8', { fatal: false }).decode(parca?.value || new Uint8Array());
    try { await okuyucu.cancel(); } catch (_) {}
    return { text, bayt };
  } catch (_) {
    return { text: '', bayt: 0 };
  }
}

/* apiUrl lazy — denetle içinde ilk ihtiyaçta yüklenir (testte ağı kapalı
   tutmak ve döngüsel importu önlemek için modül yüklenirken import YOK). */
let apiUrl = null;
