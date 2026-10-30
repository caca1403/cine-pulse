/* ==========================================================================
   NATIVE OYNATICI KÖPRÜSÜ (Android)
   --------------------------------------------------------------------------
   NEDEN VAR (ölçülen, 2026-10-16): oynatma WebView `<video>` ile yapılıyordu.
   Chromium HEVC/H.265 çözemiyor; cihazdaki yayınlarda `video.error.code = 4`
   ("MEDIA_ELEMENT_ERROR: Format error") + `networkState = 3` oluyordu, yani
   kaynak listede görünüyor ama OYNATILAMIYORDU. Cihazın donanım çözücüsü
   HEVC destekli (`c2.qti.hevc.decoder`); Chromium o çözücüye ulaşmıyor.
   Media3/ExoPlayer APK'nın içindedir ve doğrudan cihaz çözücüsünü kullanır.
   Aynı yaklaşım Kodi eklentilerinde de geçerlidir (native oynatıcı).
   ========================================================================== */

import { showToast } from '../../components/Toast.js';
import { motorOlayBaginiKopar } from './torrentYerel.js';

/** Native oynatıcı APK'da var mı? (yoksa çağırma yapma) */
export function nativeOynaticiVar() {
  try {
    return Boolean(window.CinePulsePlayer && typeof window.CinePulsePlayer.play === 'function');
  } catch (_) {
    return false;
  }
}

/**
 * Yayını cihazın kendi oynatıcısında açar (tam ekran).
 * @param {string} url  oynatılacak adres (köprüden geçmiş olmalı)
 * @param {object} headers  çekirdeğin istediği başlıklar (Referer/User-Agent…)
 * @param {Array<{etiket:string,dil:string,vtt:string}>} altyazilar
 *        Altyazı artık PLAY ANINDA verilir: WebView `<video>` native modda
 *        çalışmadığı için `<track>` etiketleri işe yaramıyordu; ayrıca
 *        oynatma başladıktan sonra ExoPlayer'a altyazı eklenemiyor.
 * @returns {boolean} native oynatıcıya devredildi mi
 */
/* Cihaz köprüsünün (NativeMediaGateway) TANIMADIĞI, yalnız masaüstü
   sunucusunda bulunan rotalar. Bunlar oynatıcıya verilirse köprü
   501 `native-route-unavailable` döndürür ve kullanıcı ham hata görür
   (ölçüldü 2026-10-17: canlı TV'de DMAX/TLC). */
const SUNUCUYA_OZEL_ROTALAR = new Set([
  'live_tv_stream', 'subtitles', 'fanart', 'tv_logos', 'tv-logos', 'iptv_list', 'live_logo'
]);

/* ── Magnet / btih oynatma devri (madde 4 — B köprüsü, kullanıcı 2026-10-28) ──
   window.CinePulsePlayer.magnetOynat(magnet, otomatikOynat=true) SENKRON JSON
   döner: {"durum":"kabul"|"reddedildi","kod":...}. Kabulde akış sonucu MEVCUT
   torrent olay kanalından gelir (window.__cpTorrentOlay — TorrentBridge.java):
     {"durum":"yayinda","url","ad","boyut"} | {"durum":"hata","kod","mesaj"}
   otomatikOynat=true olduğu için 'yayinda' URL'ini JAVA tarafı native oynatıcıya
   verir; JS kendi ikinci play'ini ATMAZ (çift-play riski — B risk notu):
   torrentYerel'deki eski motorBaslat geri çağrısı bağlanmadan önce koparılır. */
function magnetIleOynat(magnet) {
  const k = (() => { try { return window.CinePulsePlayer || null; } catch (_) { return null; } })();
  if (!k || typeof k.magnetOynat !== 'function') {
    try { showToast('Magnet oynatma bu cihazda desteklenmiyor.', 'warning'); } catch (_) {}
    try { (window.__cpLog = window.__cpLog || []).push([Date.now() % 100000, 'MAGNET-KOPRU-YOK', '']); } catch (_) {}
    return false;
  }
  // Çift-play koruması: 'yayinda' olayını yalnız Java tüketir; JS'in eski
  // motorBaslat geri çağrısı kendi play'ini tetiklemesin (kullanıcı 2026-10-28).
  try { motorOlayBaginiKopar(); } catch (_) {}
  let karar = null;
  try { karar = JSON.parse(String(k.magnetOynat(magnet, true) || '{}')); } catch (_) { karar = null; }
  try { (window.__cpLog = window.__cpLog || []).push([Date.now() % 100000, 'MAGNET-' + String(karar?.durum || 'bozuk').toUpperCase(), magnet.slice(0, 80)]); } catch (_) {}
  if (karar?.durum === 'kabul') return true; // spinner bekler; async sonuç olay kanalından
  const kod = String(karar?.kod || '');
  const mesaj = kod === 'unsupported' ? 'Magnet bağlantısı çözülemedi.'
    : kod === 'timeout' ? 'Yayın bulunamadı — motor zaman aşımına uğradı.'
    : kod === 'no-peers' ? 'Bu torrent için peer bulunamadı.'
    : kod === 'motor-yok' ? 'Torrent motoru bu cihazda hazır değil.'
    : kod === 'motor-hatasi' ? 'Torrent motoru hata verdi.'
    : (String(karar?.mesaj || '') || 'Torrent kaynağı açılamadı.');
  try { showToast(mesaj, 'error'); } catch (_) {}
  return false;
}

export function nativeRotaDestekliMi(url) {
  const ham = String(url || '');
  if (!ham) return true;
  const m = ham.match(/\/api\/([a-zA-Z0-9_]+)/);
  if (!m) return true;
  const rota = m[1].toLowerCase();
  if (SUNUCUYA_OZEL_ROTALAR.has(rota)) return false;
  // Proxy içine sarılmış adres: iç adres de aynı denetimden geçer.
  if (rota === 'hls_proxy' || rota === 'proxy' || rota === 'stream_proxy' || rota === 'mkv_stream') {
    const ic = ham.match(/[?&]url=([^&]+)/);
    if (ic) {
      let cozulmus = ic[1];
      try { cozulmus = decodeURIComponent(cozulmus); } catch (_) {}
      if (cozulmus !== ham) return nativeRotaDestekliMi(cozulmus);
    }
  }
  return true;
}

export function nativeOynat(url, headers = null, altyazilar = null, startSaniye = 0, dilIpucu = '') {
  if (!url || !nativeOynaticiVar()) return false;
  // Madde 4 (kullanıcı 2026-10-28): magnet/btih adresleri doğrudan yerel
  // torrent motoruna devredilir (Java otomatik oynatır); play()'e ham magnet
  // gitmez. Köprü yoksa okunabilir toast ile reddedilir.
  if (/^(magnet:|btih)/i.test(String(url))) return magnetIleOynat(String(url));
  // Dil ipucunu OYNATMA ANINDA değil hemen önce ver: native ses satırı adı
  // metadata suskunsa bu ipucundan üretilir ("Türkçe (Dublaj)").
  try {
    if (dilIpucu && window.CinePulsePlayer && typeof window.CinePulsePlayer.setDilIpucu === 'function')
      window.CinePulsePlayer.setDilIpucu(String(dilIpucu).slice(0, 24));
  } catch (_) {}
  // Desteklenmeyen sunucu rotası (örn. /api/live_tv_stream) cihaz köprüsünde
  // 501 `native-route-unavailable` döner; oynatıcıya ham hata olarak
  // yansımasın (ölçüldü 2026-10-17: DMAX/TLC canlı yayınları).
  if (!nativeRotaDestekliMi(url)) {
    try { (window.__cpLog = window.__cpLog || []).push([Date.now() % 100000, 'ROTA-YOK', String(url).slice(0, 80)]); } catch (_) {}
    try { window.dispatchEvent(new CustomEvent('cp-native-hata', { detail: 'Bu yayın bu cihazda desteklenmiyor.' })); } catch (_) {}
    return false;
  }
  try {
    const altyaziJson = Array.isArray(altyazilar) && altyazilar.length
      ? JSON.stringify(altyazilar.slice(0, 3))
      : '';
    const sn = Number(startSaniye) || 0;
    // PERDE BAŞLIĞI (2026-10-27): native play() başlığı yükleme perdesinde
    // spinner'ın altında gösteriyor. PlayerModal oynatma sırasında
    // document.title'ı içerik adına ayarlıyor (PlayerModal:1066); uygulamanın
    // genel başlığı ("CinePulse …") gönderilmez.
    const hamBaslik = String(document.title || '');
    const perdeBaslik = hamBaslik.startsWith('CinePulse') ? '' : hamBaslik;
    const k = window.CinePulsePlayer;
    if (sn > 0.5 && typeof k.playAt === 'function') {
      // Kaldığın yerden devam: konum DOĞRUDAN ExoPlayer'a verilir (arka plandaki
      // WebView <video>'ya değil — kullanıcı 2026-10-18).
      k.playAt(url, perdeBaslik, headers ? JSON.stringify(headers) : '{}', altyaziJson, sn);
    } else {
      k.play(url, perdeBaslik, headers ? JSON.stringify(headers) : '{}', altyaziJson);
    }
    try { (window.__cpLog = window.__cpLog || []).push([Date.now() % 100000, 'BRIDGE-PLAY', String(url).slice(0, 80)]); } catch (_) {}
    return true;
  } catch (_) {
    try { (window.__cpLog = window.__cpLog || []).push([Date.now() % 100000, 'BRIDGE-HATA', String(_ && _.message).slice(0, 60)]); } catch (_) {}
    return false;
  }
}

/* ── Native oynatıcı DURUM OKUMA/YÖNETME ──────────────────────────────────
   NEDEN GEREKLİ (ölçülen hata, 2026-10-17): native oynatmada WebView'deki
   `<video>` hiç oynamaz. "İzlemeye devam et" ilerlemesi ve "Birlikte izle"
   senkronu tamamen `<video>` olaylarına (timeupdate/play/pause/seeking)
   bağlıydı; bu yüzden native oynatmada ilerleme kaydedilmiyor ve oda
   senkronu hiç çalışmıyordu. Aşağıdaki fonksiyonlar native köprüden gerçek
   konum/süre/durum okur. */
function kopru() {
  try { return window.CinePulsePlayer || null; } catch (_) { return null; }
}

/* TEK JSON OKUMA NOKTASI (madde 7, kullanıcı 2026-10-28): köprü metodlarının
   (nativeDurum / nativeIzlerJson) JSON parse'ı burada toplanır. Eski kod aynı
   nativeDurum metnini üç ayrı yerde parse ediyordu; sözleşme değişirse tek
   yerden uyarlanır. Bozuk/eksik JSON daima `varsayilan` ile döner — istisna
   yaymaz (poll döngüleri bu fonksiyona yaslı, atılan hata sesi keserdi). */
function kopruJson(yontemAdi, varsayilan) {
  const k = kopru();
  if (!k || typeof k[yontemAdi] !== 'function') return varsayilan;
  try {
    const metin = k[yontemAdi]();
    return JSON.parse(metin == null || metin === '' ? JSON.stringify(varsayilan) : String(metin));
  } catch (_) { return varsayilan; }
}

/* nativeDurum sözleşmesinin TEK normalize edicisi: köprü milisaniye verir,
   saniyeye çevrilir; hiz/ses yoksa eski varsayılan (1) korunur. Konum/süre
   okuyucuları da dahil herkes bu tek fonksiyondan beslenir — iki tolere
   edilen biçim (oynuyor|playing) burada normalize edilir. */
function durumNormalize(veri) {
  const bos = { konum: 0, sure: 0, oynuyor: false, buffering: false, hiz: 1, ses: 1 };
  if (!veri || typeof veri !== 'object') return bos;
  const konum = Number(veri.konum);
  const sure = Number(veri.sure);
  const hiz = Number(veri.hiz);
  const ses = Number(veri.ses);
  return {
    konum: Number.isFinite(konum) && konum > 0 ? konum / 1000 : 0,
    sure: Number.isFinite(sure) && sure > 0 ? sure / 1000 : 0,
    oynuyor: Boolean(veri.oynuyor || veri.playing),
    buffering: Boolean(veri.buffering),
    hiz: Number.isFinite(hiz) && hiz > 0 ? hiz : 1,
    ses: Number.isFinite(ses) ? Math.min(1, Math.max(0, ses)) : 1
  };
}

export function nativeKonumSaniye() {
  const veri = kopruJson('nativeDurum', {});
  const ms = Number(veri && veri.konum);
  return Number.isFinite(ms) ? ms / 1000 : null;
}

export function nativeSureSaniye() {
  const veri = kopruJson('nativeDurum', {});
  const ms = Number(veri && veri.sure);
  return Number.isFinite(ms) && ms > 0 ? ms / 1000 : 0;
}

export function nativeOynuyorMu() {
  const k = kopru();
  try { return Boolean(k && typeof k.nativePlaying === 'function' && k.nativePlaying()); } catch (_) { return false; }
}

export function nativeSarmala(saniye) {
  const k = kopru();
  try { if (k && typeof k.nativeSeekTo === 'function') k.nativeSeekTo(Math.max(0, Number(saniye) || 0)); } catch (_) {}
}

export function nativeAtla(saniye) {
  const k = kopru();
  try { if (k && typeof k.nativeSeekBy === 'function') k.nativeSeekBy(Number(saniye) || 0); } catch (_) {}
}

export function nativeDevam() { const k = kopru(); try { k?.nativePlay?.(); } catch (_) {} }

/** Yükleme perdesi: oynatıcı video frame verene kadar arkada blurlu içerik resmi (Stremio tarzı). */
export function nativeBackdrop(url) {
  const k = kopru();
  try { k?.nativeBackdrop?.(String(url || '')); } catch (_) {}
}
export function nativeDuraklat() { const k = kopru(); try { k?.nativePause?.(); } catch (_) {} }
export function nativeDurumDegistir() { const k = kopru(); try { k?.nativeToggle?.(); } catch (_) {} }
export function nativeHiz(kat) {
  const k = kopru();
  try { if (k && typeof k.nativeHiz === 'function') k.nativeHiz(Number(kat) || 1); } catch (_) {}
}
export function nativeSes(seviye) {
  const k = kopru();
  try { if (k && typeof k.nativeSes === 'function') k.nativeSes(Number(seviye) || 0); } catch (_) {}
}

/**
 * Oynatıcı çubuğunu besleyen TEK durum okuması.
 * Köprü milisaniye verir; burada saniyeye çevrilir. `hiz`/`ses` köprüde
 * yoksa bugünkü varsayılan (1) döner — eski nativeDurum sözleşmesi bozulmaz.
 * @returns {{konum:number,sure:number,oynuyor:boolean,hiz:number,ses:number}}
 */
export function nativeDurum() {
  // TEK okuma + TEK normalizasyon (madde 7): kopruJson parse'ı, durumNormalize
  // birimleri tek yerde ele alır. Köprü `oynuyor` vermeyebiliyor — eski
  // sözleşmeyle uyum için nativePlaying() yedeği burada eklenir.
  const durum = durumNormalize(kopruJson('nativeDurum', {}));
  if (!durum.oynuyor) durum.oynuyor = nativeOynuyorMu();
  return durum;
}

/**
 * Native oynatıcıdaki iz (altyazı/ses) listesi.
 * Köprü biçimi henüz sabit değil: dizi ya da {altyazilar, sesler} kabul edilir.
 * @returns {Array<{tur:'altyazi'|'ses',indeks:number,etiket:string,secili:boolean}>}
 */
export function nativeIzler() {
  // İki tolere edilen biçim (dizi | {altyazilar, sesler}) TEK yerde normalize
  // edilir; parse kopruJson'dan gelir (madde 7).
  const ham = kopruJson('nativeIzlerJson', []);
  const liste = Array.isArray(ham) ? ham : (ham && typeof ham === 'object' ? [
    ...(Array.isArray(ham.altyazilar) ? ham.altyazilar.map((x, i) => ({ ...x, tur: 'altyazi', _sira: i })) : []),
    ...(Array.isArray(ham.sesler) ? ham.sesler.map((x, i) => ({ ...x, tur: 'ses', _sira: i })) : [])
  ] : []);
  return liste.map((iz, i) => {
    const hamTur = String((iz && (iz.tur || iz.type)) || '').toLowerCase();
    const tur = hamTur.startsWith('ses') || hamTur === 'audio' ? 'ses' : 'altyazi';
    const hamIndeks = Number(iz && (iz.indeks ?? iz.index ?? iz.i ?? iz._sira));
    const etiket = iz && (iz.etiket || iz.label || iz.dil || iz.language);
    return {
      tur,
      indeks: Number.isFinite(hamIndeks) ? hamIndeks : i,
      etiket: String(etiket || (tur === 'ses' ? 'Ses parçası' : 'Altyazı') + ' ' + (i + 1)),
      secili: Boolean(iz && (iz.secili ?? iz.selected ?? iz.active))
    };
  });
}

/** İz seçer (tur: 'altyazi' | 'ses'). Köprü yoksa false. */
export function nativeIzSec(tur, indeks) {
  const k = kopru();
  if (!k || typeof k.nativeIzSec !== 'function') return false;
  try { k.nativeIzSec(String(tur || ''), Number(indeks) || 0); return true; } catch (_) { return false; }
}

/**
 * Video ölçekleme (contain | zoom | fill). Köprüde henüz yoksa false —
 * arayüz "bu oynatıcıda ölçekleme yok" der, sessizce yutulmaz.
 */
export function nativeOran(mod) {
  const k = kopru();
  if (!k || typeof k.nativeOran !== 'function') return false;
  try { k.nativeOran(String(mod || '')); return true; } catch (_) { return false; }
}

/**
 * Ekran yönünü çevirir. Köprü metodu başka agent tarafından eklenecek;
 * henüz yoksa Screen Orientation'a düşer, o da yoksa telemetri bırakır
 * (sessiz yutma yok).
 */
export function nativeDondur() {
  const k = kopru();
  for (const ad of ['nativeDondur', 'nativeEkranDondur', 'nativeYonDegistir', 'nativeYon', 'nativeRotate']) {
    try {
      if (k && typeof k[ad] === 'function') { k[ad](); return true; }
    } catch (e) {
      try { (window.__cpLog = window.__cpLog || []).push([Date.now() % 100000, 'DONDUR-HATA', String(e && e.message || ad).slice(0, 60)]); } catch (_) {}
    }
  }
  try {
    const yon = window.screen && window.screen.orientation;
    if (yon && typeof yon.lock === 'function') {
      const hedef = String(yon.type || '').includes('portrait') ? 'landscape' : 'portrait';
      yon.lock(hedef).then(() => nativeYerlestir()).catch((e) => {
        try { (window.__cpLog = window.__cpLog || []).push([Date.now() % 100000, 'DONDUR-HATA', String(e && e.message || 'kilit').slice(0, 60)]); } catch (_) {}
      });
      return true;
    }
  } catch (_) {}
  try { (window.__cpLog = window.__cpLog || []).push([Date.now() % 100000, 'DONDUR-YOK', 'köprü yok']); } catch (_) {}
  return false;
}

/** Native oynatıcı açıldı: sınıfı ekle, konumu uygula, yeniden boyutlandırmayı izle. */
export function nativeModAc() {
  try {
    document.documentElement.classList.add('cp-native-video');
    // OYNATICI ARTIK HER ZAMAN YATAY TAM EKRAN AÇILIYOR (kullanıcı kararı
    // 2026-10-27): native taraf bunu play() içinde yapıyor. Bayrak burada da
    // kurulur; yoksa aşağıdaki yerleştirme çağrıları native yüzeyi WebView'in
    // (dikey) video dikdörtgenine küçültüp tam ekranı bozuyordu.
    window.__cpNativeTamEkran = true;
    nativeYerlestir();
    const yenile = () => nativeYerlestir();
    window.addEventListener('resize', yenile);
    window.addEventListener('orientationchange', yenile);
    // KAYDIRMA: yüzey içerikle birlikte kaysın (ekranda sabit kalmasın).
    // Yakalama (capture) modunda bağlanır; iç kaydırma kapları da yakalanır.
    if (!window.__cpNativeKaydirma) {
      let bekliyor = false;
      const tetikle = () => {
        if (bekliyor) return;
        bekliyor = true;
        requestAnimationFrame(() => { bekliyor = false; nativeYerlestir(); });
      };
      window.__cpNativeKaydirma = tetikle;
      window.addEventListener('scroll', tetikle, { passive: true, capture: true });
      document.addEventListener('scroll', tetikle, { passive: true, capture: true });
    }
    // Video alanı geç açılabilir (poster/skeleton), birkaç kare tekrar dene.
    [80, 250, 600, 1200].forEach(ms => setTimeout(yenile, ms));
    // Native oynatma tutmazsa SİYAH EKRAN yerine uyarı göster.
    window.addEventListener('cp-native-hata', (e) => {
      const mesaj = (e && e.detail) || 'Bu kaynak oynatılamadı.';
      temizleNativeSinif();
      try { window.dispatchEvent(new CustomEvent('cp-yayin-hatasi', { detail: mesaj })); } catch (_) {}
    }, { once: true });
  } catch (_) {}
}

/** Native oynatıcıyı kapatır. */
export function nativeKapat() {
  try { window.CinePulsePlayer?.close?.(); } catch (_) {}
  temizleNativeSinif();
}

function temizleNativeSinif() {
  try { document.documentElement.classList.remove('cp-native-video'); } catch (_) {}
  // Bayrak temizlenir: oynatıcı kapandıktan sonra yerleştirme yardımcıları
  // yeniden çalışabilsin (play her açılışta yeniden true yapar).
  try { window.__cpNativeTamEkran = false; } catch (_) {}
}

/**
 * Native yüzeyi videonun EKRAN DİKDÖRTGENİNE taşır.
 * Nuvio mantığı: video, player'ın içinde ve ekrana göre ölçekli görünür —
 * ayrı bir oynatıcı ekranı yok. CSS piksellerini ölçer, native'e yollar.
 */
export function nativeYerlestir() {
  // TAM EKRANDA KONUMLANDIRMA YAPILMAZ: native taraf yüzeyi ekrana yayar.
  // Ölçülen hata: tam ekrana geçince WebView hâlâ eski (dikey) dikdörtgeni
  // dayatıyordu → video ekran ortasında küçük kalıyordu.
  if (window.__cpNativeTamEkran) return;
  try {
    if (!nativeOynaticiVar()) return;
    const el = document.querySelector('.direct-video-wrapper')
      || document.querySelector('#hls-video-player');
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const ekranH = window.innerHeight || 0;
    if (r.bottom < 0 || r.top > ekranH) {
      window.CinePulsePlayer.setBounds(-10000, -10000, 1, 1);
      return;
    }
    window.CinePulsePlayer.setBounds(r.left, r.top, r.width, r.height);
  } catch (_) {}
}

function nativeYuzeyGizle() { /* yüzey kapatma ile birlikte gider */ }

/** Kalan yardımcılar (tek tanım). */
