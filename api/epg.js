import { guardNodeRequest } from './_security.js';

import zlib from 'zlib';

const EPG_URL = 'https://iptv-epg.org/files/epg-tr.xml.gz';

const CHANNEL_MAPPINGS = {
  // Ulusal
  'ch_trt1': 'TRT1.tr',
  'ch_atv': 'ATV.tr',
  'ch_showtv': 'ShowTV.tr',
  'ch_nowtv': 'NOWTV.tr',
  'ch_startv': 'StarTV.tr',
  'ch_kanald': 'KanalD.tr',
  'ch_tv8': 'TV8.tr',
  'ch_a2': 'A2.tr',
  'ch_kanal7': 'KANAL7.tr',
  'ch_beyaztv': 'BEYAZTV.tr',
  'ch_teve2': 'Teve2.tr',
  'ch_tv360': '360.tr',

  // Haber
  'ch_trthaber': 'TRTHaber.tr',
  'ch_ahaber': 'AHaber.tr',
  'ch_ntv': 'NTV.tr',
  'ch_halktv': 'HalkTV.tr',
  'ch_tele1': 'TELE1.tr',
  'ch_bloomberg': 'BloombergHT.tr',
  'ch_tv24': 'KANAL24.tr',
  'ch_ulketv': 'UlkeTV.tr',

  // Spor
  'tvr_ch_165': 'beINSPORTSHABER.tr',
  'tvr_ch_147': 'beINSPORTS3.tr',
  'tvr_ch_137': 'Eurosport1.tr',
  'tvr_ch_135': 'Eurosport2.tr',
  'ch_trtspor': 'TRTSPOR.tr',
  'ch_aspor': 'ASpor.tr',
  'tvr_ch_128': 'FBTV.tr',
  'tvr_ch_126': 'HTSPOR.tr',

  // Sinema & Dizi
  'tvr_ch_61': 'SinemaTV.tr',
  'tvr_ch_60': 'SinemaTV2.tr',
  'tvr_ch_59': 'SinemaTVAksiyon.tr',
  'tvr_ch_55': 'SinemaTVAile.tr',
  'tvr_ch_53': 'SinemaTV1001.tr',
  'tvr_ch_52': 'SinemaTV1002.tr',

  // Belgesel
  'tvr_ch_89': 'NationalGeographic.tr',
  'tvr_ch_88': 'NatGeoWild.tr',
  'tvr_ch_86': 'BBCEARTH.tr',
  'tvr_ch_79': 'DiscoveryChannel.tr',
  'tvr_ch_81': 'DMAX.tr',
  'tvr_ch_83': 'TLC.tr',
  'tvr_ch_85': 'TARIHTV.tr',
  'ch_trtbelgesel': 'TRTBelgesel.tr',

  // Çocuk
  'tvr_ch_36': 'CartoonNetwork.tr',
  'tvr_ch_35': 'Nickelodeon.tr',
  'tvr_ch_33': 'DisneyJunior.tr',
  'ch_trtcocuk': 'TRT&#xC7;ocuk.tr',
  'ch_minikago': 'MinikaGO.tr',

  // Müzik
  'ch_trtmuzik': 'TRTM&#xFC;zik.tr'
};

function parseXmltvDate(str) {
  const m = str.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\s*([+-]\d{4})?/);
  if (!m) return null;
  const year = parseInt(m[1], 10);
  const month = parseInt(m[2], 10) - 1;
  const day = parseInt(m[3], 10);
  const hour = parseInt(m[4], 10);
  const min = parseInt(m[5], 10);
  const sec = parseInt(m[6], 10);
  
  let utcMs = Date.UTC(year, month, day, hour, min, sec);
  if (m[7]) {
    const tzSign = m[7][0] === '-' ? -1 : 1;
    const tzHours = parseInt(m[7].slice(1, 3), 10);
    const tzMins = parseInt(m[7].slice(3, 5), 10);
    const tzOffsetMs = tzSign * (tzHours * 60 + tzMins) * 60 * 1000;
    utcMs -= tzOffsetMs;
  }
  return utcMs;
}

function formatTrTime(ms) {
  const d = new Date(ms + 3 * 3600 * 1000);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function cleanHtmlEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&#xC7;/g, 'Ç')
    .replace(/&#xFC;/g, 'ü')
    .replace(/&#x11F;/g, 'ğ')
    .replace(/&#x15F;/g, 'ş')
    .replace(/&#x131;/g, 'ı')
    .replace(/&#xF6;/g, 'ö')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

// In-memory cache
let cachedData = null;
let cacheTime = 0;
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (guardNodeRequest(req, res, { limit: 60, bucket: 'epg' })) return;

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const now = Date.now();
    if (cachedData && (now - cacheTime < CACHE_TTL_MS)) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=86400');
      return res.status(200).json(cachedData);
    }

    const fetchRes = await fetch(EPG_URL);
    if (!fetchRes.ok) {
      throw new Error(`Failed to download EPG: ${fetchRes.status}`);
    }

    const buf = await fetchRes.arrayBuffer();
    const xml = zlib.gunzipSync(Buffer.from(buf)).toString('utf-8');

    const xmlToOur = {};
    for (const [ourId, xmlId] of Object.entries(CHANNEL_MAPPINGS)) {
      xmlToOur[xmlId.toLowerCase()] = ourId;
    }

    const progRegex = /<programme\s+start="([^"]+)"\s+stop="([^"]+)"\s+channel="([^"]+)"[^>]*>[\s\S]*?<title[^>]*>([^<]+)<\/title>/gi;
    let p;
    const channels = {};

    // Keep programmes for today +/- 24 hours
    const windowStart = now - 24 * 3600 * 1000;
    const windowEnd = now + 36 * 3600 * 1000;

    while ((p = progRegex.exec(xml)) !== null) {
      const chAttr = p[3].toLowerCase();
      const ourId = xmlToOur[chAttr];
      if (ourId) {
        const startMs = parseXmltvDate(p[1]);
        const stopMs = parseXmltvDate(p[2]);
        if (startMs && stopMs && stopMs >= windowStart && startMs <= windowEnd) {
          if (!channels[ourId]) channels[ourId] = [];
          channels[ourId].push({
            startTs: startMs,
            endTs: stopMs,
            start: formatTrTime(startMs),
            end: formatTrTime(stopMs),
            title: cleanHtmlEntities(p[4])
          });
        }
      }
    }

    // Sort programmes by startTs for each channel
    for (const chId of Object.keys(channels)) {
      channels[chId].sort((a, b) => a.startTs - b.startTs);
    }

    cachedData = {
      updatedAt: now,
      serverTime: formatTrTime(now),
      totalChannels: Object.keys(channels).length,
      channels
    };
    cacheTime = now;

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=86400');
    return res.status(200).json(cachedData);
  } catch (err) {
    console.error('EPG Handler Error:', err);
    if (cachedData) {
      // Return stale cache if available
      return res.status(200).json(cachedData);
    }
    return res.status(500).json({ error: err.message });
  }
}
