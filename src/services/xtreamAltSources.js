/* ==========================================================================
   CinePulse Studio - Xtream Alternatif Kaynak Servisi
   Aynı kanal birden fazla panelde varsa oynatıcıda "Kaynak" olarak seçilir.
   Panelin HLS segmentleri (/live/...m3u8) 403 korumalı çıktığı için düz
   MPEG-TS formu (/{user}/{pass}/{streamId}) proxy üzerinden verilir ve
   mpegts.js (MSE transmux) ile oynatılır.
   Karışık-içerik (http) sorunu için tüm kaynaklar /api/hls_proxy ile verilir.
   NOT: Bu dosyadaki hesap bilgileri herkese açık repoda görünür.
   Üretimde panel bilgisini localStorage (cinepulse_xtream_panels) ile ezebilir
   veya bu dosyayı repoya koymadan yerelde tutabilirsiniz.
   ========================================================================== */

const HOST = 'ccgbstreambay2.xyz:2095';

// Aynı hosttaki tüm hesaplarda stream ID'leri ortak doğrulandı.
export const XTREAM_PANELS = [
  { id: 'p1', label: 'Panel 1', user: 'alicanalican', pass: '11fc9e9910f07c24' },
  { id: 'p2', label: 'Panel 2', user: 'alietes0001', pass: 'ali0602yy00' },
  { id: 'p3', label: 'Panel 3', user: 'alpedo', pass: 'f740d3158777bc9b' },
  { id: 'p4', label: 'Panel 4 (60K)', user: 'alper2857', pass: 'lpr.0510' },
  { id: 'p5', label: 'Panel 5', user: 'altun6307', pass: 'bXzsrEChzn' }
];

function panels() {
  try {
    const raw = localStorage.getItem('cinepulse_xtream_panels');
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length > 0) return arr;
    }
  } catch (_) {}
  return XTREAM_PANELS;
}

// Kanal ID -> Xtream stream ID'leri (FHD öncelikli). ID yoksa alternatif sunulmaz.
const CHANNEL_STREAM_IDS = {
  ch_trt1: [32770, 8705],
  ch_atv: [36980, 96898],
  ch_showtv: [35060, 130955],
  ch_nowtv: [107148, 53754],
  ch_startv: [107672, 125579],
  ch_kanald: [72368, 77318],
  ch_kanal7: [70900, 71260],
  ch_beyaztv: [139161, 18453],
  ch_teve2: [99992, 155220],
  ch_tv360: [54291, 65020],
  ch_a2: [129851, 45469],
  ch_trthaber: [129375, 133206],
  ch_ahaber: [113573, 31194],
  ch_ntv: [70659, 99133],
  ch_halktv: [115243, 56403],
  ch_tv100: [120666, 162813],
  ch_bloomberg: [43263],
  ch_ulketv: [148090, 88160],
  ch_trtspor: [94495, 162216],
  ch_trtspor2: [32602, 161120],
  ch_aspor: [93986, 154011],
  ch_dmax: [60858, 27669],
  ch_tlc: [117488],
  ch_trtbelgesel: [123270, 60736],
  ch_tgrtbelgesel: [2820],
  ch_trtcocuk: [15821],
  ch_minikago: [104886],
  ch_kralpop: [76544],
  ch_powerturk: [44238],
  ch_dreamturk: [60742],
  ch_tempotv: [7755],
  ch_kanalv: [10584]
};

export function buildXtreamTs(panel, streamId) {
  return `http://${HOST}/${panel.user}/${panel.pass}/${streamId}`;
}

// Ev relay (Cloudflare Tunnel) adresi: önce build-time env, sonra localStorage.
// Relay yoksa üretimde göreli URL (Vercel) kullanılır ve zarifçe geçilir.
const RELAY_KEY = 'cinepulse_xtream_relay';

export function getRelayOrigin() {
  try {
    const env = String(import.meta.env?.VITE_XTREAM_RELAY_ORIGIN || '').replace(/\/$/, '');
    if (env) return env;
  } catch (_) {}
  try {
    return String(localStorage.getItem(RELAY_KEY) || '').replace(/\/$/, '');
  } catch (_) {
    return '';
  }
}

export function setRelayOrigin(url) {
  try {
    localStorage.setItem(RELAY_KEY, String(url || '').trim().replace(/\/$/, ''));
  } catch (_) {}
}

function tsProxyBase() {
  try {
    const loc = window.location;
    const host = loc?.hostname || '';
    const isNative = Boolean(window.Capacitor?.isNativePlatform?.()) || loc?.protocol === 'capacitor:';
    // Yerel geliştirme: vite -> localhost:4000 (ev IP'sinden panele erişir)
    if (!isNative && (host === 'localhost' || host === '127.0.0.1')) return '';
    // Üretim/APK: ev relay'i varsa oraya, yoksa göreli URL (başarısız olur, geçilir)
    return getRelayOrigin();
  } catch (_) {
    return '';
  }
}

export function toProxiedTs(tsUrl) {
  return `${tsProxyBase()}/api/hls_proxy?url=${encodeURIComponent(tsUrl)}`;
}

// Bir kanal için alternatif kaynak listesi: [{ key, label, url(proxied TS), isTs }]
// Panelin HLS (/live/...m3u8) segmentleri 403 korumalı olduğundan düz MPEG-TS
// kullanıyoruz; oynatma mpegts.js (MSE) ile yapılır.
export function getAltSources(channel) {
  if (!channel) return [];
  const ids = CHANNEL_STREAM_IDS[channel.id];
  if (!ids || ids.length === 0) return [];
  const out = [];
  for (const panel of panels()) {
    ids.forEach((sid, idx) => {
      out.push({
        key: `xt_${panel.id}_${sid}`,
        label: `${panel.label} • ${idx === 0 ? 'FHD' : 'HD'}`,
        url: toProxiedTs(buildXtreamTs(panel, sid)),
        isTs: true
      });
    });
  }
  // Aynı panelde FHD+HD tekrarını azalt: ilk panelin iki kalitesi + diğer
  // panellerin FHD'si yeterlidir; liste şişmesin.
  const seen = new Set();
  return out.filter(s => {
    const panelId = s.key.split('_')[1];
    const isFhd = s.label.endsWith('FHD');
    if (panelId === 'p1') return true;
    if (!isFhd) return false;
    if (seen.has(panelId)) return false;
    seen.add(panelId);
    return true;
  });
}

const PREF_KEY = 'cinepulse_live_src_pref';

export function getPreferredSourceKey(channelId) {
  try {
    return (JSON.parse(localStorage.getItem(PREF_KEY) || '{}'))[channelId] || null;
  } catch (_) {
    return null;
  }
}

export function setPreferredSourceKey(channelId, key) {
  try {
    const all = JSON.parse(localStorage.getItem(PREF_KEY) || '{}');
    all[channelId] = key;
    localStorage.setItem(PREF_KEY, JSON.stringify(all));
  } catch (_) {}
}
