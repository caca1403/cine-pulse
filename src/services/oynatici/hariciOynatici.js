/* ==========================================================================
   CinePulse — Harici oynatıcıda OYNATMA (yol haritası #9, Nuvio/CS paritesi)
   --------------------------------------------------------------------------
   Android: CinePulseNative.openExternalPlayer(url, mime) → ACTION_VIEW
   (MainActivity; manifest <queries> video/* görünürlüğü).
   Masaüstü: CinePulseDesktop.openExternalPlayer(url, opts) → mpv/VLC spawn
   (electron/main.cjs — URL doğrulaması + sabit oynatıcı beyaz listesi orada).
   Web: köprü yok → desteklenmez, çağıranlar düğmeyi gizler.
   ========================================================================== */

import { apiUrl } from '../altyapi/apiOrigin.js';

export function hariciOynaticiMusaitMi() {
  try {
    if (typeof window === 'undefined') return false;
    return Boolean(window.CinePulseNative?.openExternalPlayer || window.CinePulseDesktop?.openExternalPlayer);
  } catch (_) {
    return false;
  }
}

/** Sihirbaz tercihi (opt_player_mode → cp_player_mode). */
export function hariciOynaticiModuAcik() {
  try {
    return localStorage.getItem('cp_player_mode') === 'external' && hariciOynaticiMusaitMi();
  } catch (_) {
    return false;
  }
}

/** Akış nesnesinden oynatılabilir URL (bağlantı-kopyala ile aynı kural). */
export function streamUrlCoz(stream) {
  const ham = String(stream?.streamUrl || stream?.url || '');
  if (!ham) return '';
  return ham.startsWith('/api/') ? apiUrl(ham) : ham;
}

/** Harici oynatıcıda açar. Başarı → true. */
export async function hariciOynaticidaAc(stream, { baslangicSn = 0 } = {}) {
  const url = streamUrlCoz(stream);
  if (!url || !/^https?:\/\//i.test(url)) return false;
  const headers = stream?.headers || {};
  try {
    if (window.CinePulseNative?.openExternalPlayer) {
      const mime = /\.m3u8/i.test(url) ? 'application/vnd.apple.mpegurl' : 'video/*';
      return window.CinePulseNative.openExternalPlayer(url, mime) === 'OK';
    }
    if (window.CinePulseDesktop?.openExternalPlayer) {
      const r = await window.CinePulseDesktop.openExternalPlayer(url, {
        baslangicSn: Math.max(0, Number(baslangicSn) || 0),
        referer: String(headers.Referer || headers.referer || ''),
        ua: String(headers['User-Agent'] || headers['user-agent'] || '')
      });
      return Boolean(r && r.ok);
    }
  } catch (_) {}
  return false;
}
