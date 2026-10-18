/* ==========================================================================
   CinePulse Studio - PlayerFrame (Cloudstream WebViewResolver dengi + artisi)
   Sayfa-embed kaynaklari kendi penceremizde acilir, sadece oynatici
   gosterilir; Cloudstream'in aciklari kapatilir:
   - Sessiz olum yok: cozulemeyen cerceve hata + failover'a duser.
   - Popup / top-frame kacis yok: sandbox (allow-popups YOK,
     allow-top-navigation YOK).
   - Masaustunde (ghost/WebContentsView): site CSS'i enjekte edilir,
     gercek oynatici-alan izolasyonu olur.
   - Web/APK'da capraz-origin enjeksiyon mumkun degildir; oynatici capasi
     (#embed) + sandbox ile maksimum izolasyon uygulanir.
   ========================================================================== */

// Site bazinda cerceve profili. Eski sayfa-embed sağlayıcıları (ve onlarin
// oynatici cerceveleri) eklenti katmanıyla birlikte kaldırıldı; arayüz artık
// yalnız doğrudan medya hatlarını gösterdiği için profil listesi boştur.
// API bilinmeyen URL'lerde ham adresi döndürür.
const SITE_PROFILES = [];

function hostnameOf(url) {
  try {
    return new URL(url).hostname || '';
  } catch (_) {
    return '';
  }
}

export function getFrameProfile(url) {
  const host = hostnameOf(url);
  return SITE_PROFILES.find((p) => p.match.test(host)) || null;
}

/** Cerceve URL'i: sayfa-embed ise oynatici capasi eklenir. */
export function frameUrlFor(source) {
  try {
    const raw = (typeof source === 'string' ? source : (source?.streamUrl || source?.url || '')) || '';
    if (!raw) return raw;
    const profile = getFrameProfile(raw);
    if (!profile || !profile.anchor) return raw;
    if (/#.+/.test(raw)) return raw;
    return `${raw}#${profile.anchor}`;
  } catch (_) {
    return typeof source === 'string' ? source : (source?.streamUrl || '');
  }
}

/**
 * Sandbox politikasi: oynatici calisir, kacis calismaz.
 * - allow-scripts: oynatici JS'i sart.
 * - allow-same-origin: oturum/cerez + tam ekran icin sart.
 * - allow-forms: arama/dogrulama formu olan sayfalar icin.
 * - allow-presentation: fullscreen/PiP icin.
 * YOK: allow-popups (reklam popup'i olur), allow-top-navigation
 * (sayfa uygulamayi kacirir), allow-downloads (sessiz indirme olur).
 */
export function sandboxFor(source) {
  try {
    const raw = (typeof source === 'string' ? source : (source?.streamUrl || source?.url || '')) || '';
    if (!raw) return '';
    if (/^https:\/\/(www\.)?youtube\.com\/embed\//.test(raw)) {
      return 'allow-scripts allow-same-origin allow-forms allow-presentation';
    }
    return 'allow-scripts allow-same-origin allow-forms allow-presentation';
  } catch (_) {
    return '';
  }
}

/** Bu kaynak sayfa-embed mi (oynatici-alan cerceve uygulanir)? */
export function isPageEmbed(source) {
  try {
    if (source?.isPageEmbed === true) return true;
    const raw = (typeof source === 'string' ? source : (source?.streamUrl || source?.url || '')) || '';
    const profile = getFrameProfile(raw);
    return Boolean(profile && profile.anchor);
  } catch (_) {
    return false;
  }
}

/**
 * Masaustu oynatici cerceve URL'i: sayfa yan sunucu uzerinden frame=1 ile
 * yuklenir (oynatici-alan HTML gomulu, bizim kaynak). Masaustu disi
 * platformda ham URL doner (capraz-origin enjeksiyon mumkun degil).
 */
export function desktopFrameUrl(source, sidecarBase = 'http://127.0.0.1:4000') {
  // Eski sağlayıcı cerçeve enjeksiyonu (sunucudan frame=1) o katmanla birlikte
  // söküldü; masaüstü de ham adresi kullanır. sidecarBase imza uyumu için durur.
  const raw = (typeof source === 'string' ? source : (source?.streamUrl || source?.url || '')) || '';
  return raw;
}
