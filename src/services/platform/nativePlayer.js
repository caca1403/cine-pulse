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

export function nativeOynat(url, headers = null, altyazilar = null, startSaniye = 0) {
  if (!url || !nativeOynaticiVar()) return false;
  // Desteklenmeyen sunucu rotası (örn. /api/live_tv_stream) cihaz köprüsünde
  // 501 `native-route-unavailable` döner; oynatıcıya ham hata olarak
  // yansımasın (ölçüldü 2026-10-17: DMAX/TLC canlı yayınları).
  if (!nativeRotaDestekliMi(url)) {
    try { window.dispatchEvent(new CustomEvent('cp-native-hata', { detail: 'Bu yayın bu cihazda desteklenmiyor.' })); } catch (_) {}
    return false;
  }
  try {
    const altyaziJson = Array.isArray(altyazilar) && altyazilar.length
      ? JSON.stringify(altyazilar.slice(0, 3))
      : '';
    const sn = Number(startSaniye) || 0;
    const k = window.CinePulsePlayer;
    if (sn > 0.5 && typeof k.playAt === 'function') {
      // Kaldığın yerden devam: konum DOĞRUDAN ExoPlayer'a verilir (arka plandaki
      // WebView <video>'ya değil — kullanıcı 2026-10-18).
      k.playAt(url, '', headers ? JSON.stringify(headers) : '{}', altyaziJson, sn);
    } else {
      k.play(url, '', headers ? JSON.stringify(headers) : '{}', altyaziJson);
    }
    return true;
  } catch (_) {
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

export function nativeKonumSaniye() {
  const k = kopru();
  if (!k || typeof k.nativeDurum !== 'function') return null;
  try {
    const veri = JSON.parse(k.nativeDurum() || '{}');
    const ms = Number(veri.konum);
    return Number.isFinite(ms) ? ms / 1000 : null;
  } catch (_) { return null; }
}

export function nativeSureSaniye() {
  const k = kopru();
  if (!k || typeof k.nativeDurum !== 'function') return 0;
  try {
    const veri = JSON.parse(k.nativeDurum() || '{}');
    const ms = Number(veri.sure);
    return Number.isFinite(ms) && ms > 0 ? ms / 1000 : 0;
  } catch (_) { return 0; }
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

/** Native oynatıcı açıldı: sınıfı ekle, konumu uygula, yeniden boyutlandırmayı izle. */
export function nativeModAc() {
  try {
    document.documentElement.classList.add('cp-native-video');
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