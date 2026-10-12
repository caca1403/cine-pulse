/* ==========================================================================
   CinePulse Studio - HDFilmCehennemi Scraper & Direct Stream Engine
   Extracts direct 1080p HLS streams and official Turkish subtitles
   Bypasses Cloudflare & SAMEORIGIN without 403 Forbidden errors
   ========================================================================== */

import { apiUrl, isNativeCapacitor } from './apiOrigin.js';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { isNativeAndroidApp } from './platformBridge.js';
import { akilliGet } from './nativeHttp.js';
import { be, altyazilariAl, HDFC_UA_PLAYER } from './hdfcDecoders.js';

const HDFC_BASES = ['https://www.hdfilmcehennemi.nl', 'https://www.hdfilmcehennemi.now'];
// NOT: hdfilmcehennemi.mobi oynatici hostudur (CloseLoad), bolum sayfasi
// barindirmaz. Cihaz-fallback sadece dizi sayfasi olan bazlari dener.
const HDFC_DOMAINS_URL = 'https://raw.githubusercontent.com/manitux-app/cs-plugins/main/domains.json';
const HDFC_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function hdfcSlug(value) {
  return String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function responseText(response) {
  return typeof response?.data === 'string' ? response.data : '';
}

async function getOnDevice(url, referer, origin, httpClient = CapacitorHttp, timeoutMs = 8000) {
  // Plain HTTP first: JSON/domain discovery and unprotected pages must not
  // wait behind every queued WebView challenge.
  try {
    const response = await httpClient.get({ url, headers: {
      'User-Agent': typeof navigator !== 'undefined' ? navigator.userAgent : HDFC_UA,
      Referer: referer || `${origin}/`, Accept: '*/*'
    }, connectTimeout: Math.min(timeoutMs, 4000), readTimeout: Math.min(timeoutMs, 6000) });
    if ([404, 410].includes(response.status)) return '';
    const text = typeof response?.data === 'object' ? JSON.stringify(response.data) : responseText(response);
    if (response.status >= 200 && response.status < 300 && text &&
      !/just a moment|challenge-platform|cf-chl|attention required/i.test(text.slice(0, 8000))) return text;
  } catch (_) {}
  // 1) Yerel WebView cozumleyicisi (Cloudstream WebViewResolver esdegeri):
  //    CF challenge'i gercek tarayici cozer, HTML + cerez doner. En guclu yol.
  try {
    const wv = await import('./platform/androidWebViewResolver.js');
    if (wv.hasNativeWebViewResolver()) {
      const hit = await wv.resolvePageInNativeWebView(url, { timeoutMs: Math.max(12000, timeoutMs + 6000) });
      if (hit && !wv.looksBlocked(hit)) {
        // JSON yanitlar WebView'de metin olarak durur; ham govdeyi tercih et.
        const rawText = String(hit.text || '').trim();
        if (rawText.startsWith('{') || rawText.startsWith('[')) return rawText;
        return hit.html || rawText || '';
      }
    }
  } catch (_) {}

  // 2) Cerezli CapacitorHttp (challenge gerekmiyorsa veya WebView yoksa).
  // Native'de WebView UA sart: cf_clearance IP+UA'ya baglidir, masaustu
  // Chrome UA ile cihazin meydan okuma cozumu gecersiz sayilir.
  let ua = HDFC_UA;
  let extraCookie = '';
  try {
    if (typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.()) {
      try { ua = navigator.userAgent || HDFC_UA; } catch (_) {}
      try {
        const { ensureChallengeCookies } = await import('./platform/androidChallengeSolver.js');
        extraCookie = await ensureChallengeCookies(origin, { timeoutMs: 20000 });
      } catch (_) {}
    }
  } catch (_) {}
  try {
    const headers = {
      // Match the same browser identity and AJAX headers used by the working
      // desktop resolver. HDFC rejects otherwise-valid device requests.
      'User-Agent': ua,
      'Referer': referer || `${origin}/`,
      'Origin': origin,
      'Accept': 'text/html,application/json,application/xhtml+xml,*/*;q=0.8',
      'Content-Type': 'application/json',
      'X-Requested-With': 'fetch'
    };
    if (extraCookie) headers.Cookie = extraCookie;
    const response = await httpClient.get({
      url,
      headers,
      responseType: 'text',
      connectTimeout: Math.min(5000, timeoutMs),
      readTimeout: timeoutMs
    });
    return response?.status >= 200 && response.status < 400 ? responseText(response) : '';
  } catch (_) {
    return '';
  }
}

function pageAlternatives(html) {
  const out = [];
  const buttons = /<(?:button|a|div)\b(?=[^>]*\bdata-video=["']?(\d+))(?=[^>]*\bclass=["'][^"']*alternative-link[^"']*["'])[^>]*>([\s\S]*?)<\/(?:button|a|div)>/gi;
  for (const match of html.matchAll(buttons)) {
    const id = match[1];
    if (!id || out.some(item => item.id === id)) continue;
    const label = match[2].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    out.push({ id, label });
  }
  return out;
}

function videoEmbedUrl(payload) {
  let html = '';
  try { html = JSON.parse(payload)?.data?.html || ''; } catch (_) {}
  const match = html.match(/<iframe\b[^>]*(?:data-src|src)=["']([^"']+)["'][^>]*>/i);
  if (!match) return '';
  return match[1].startsWith('//') ? `https:${match[1]}` : match[1];
}

// Vercel's datacenter egress can be blocked by HDFC. On Android, resolve the
// episode page from the device network and give the player the provider iframe.
export async function resolveHdfcEmbedsOnDevice({ title, originalTitle, season, episode, type, imdbId = null, tmdbId = null, httpClient = CapacitorHttp, platform = Capacitor.getPlatform() }) {
  if (platform !== 'android' && httpClient === CapacitorHttp) return [];
  const slug = hdfcSlug(title || originalTitle);
  if (!slug && !imdbId) return [];
  const s = Number.parseInt(season, 10) || 1;
  const e = Number.parseInt(episode, 10) || 1;
  const isMovie = type === 'movie';

  let bases = [...HDFC_BASES];
  try {
    const domainsText = await getOnDevice(HDFC_DOMAINS_URL, HDFC_DOMAINS_URL, 'https://raw.githubusercontent.com', httpClient, 1200);
    const dynamicDomain = JSON.parse(domainsText || '{}')?.hdfilmcehennemi;
    if (typeof dynamicDomain === 'string' && /^https:\/\//i.test(dynamicDomain)) {
      const normalized = dynamicDomain.replace(/\/$/, '');
      bases = [normalized, ...bases.filter(base => base !== normalized)];
    }
  } catch (_) {}
  // Patron'un kendi adres kaynağı (siteurl.txt) önce denenir.
  try {
    const siteUrl = await getOnDevice('https://raw.githubusercontent.com/patr0nq/veriler/refs/heads/main/siteurl.txt',
      'https://raw.githubusercontent.com/', 'https://raw.githubusercontent.com', httpClient, 1200);
    const satir = String(siteUrl || '').split('\n').find(l => l.trim().startsWith('hdfilmcehennemi:'));
    if (satir) {
      const u = satir.slice('hdfilmcehennemi:'.length).trim().replace(/\/$/, '');
      if (/^https:\/\//i.test(u)) bases = [u, ...bases.filter(b => b !== u)];
    }
  } catch (_) {}

  const base = bases[0];
  let contentUrl = '';

  // 1) Patron yolu: IMDB ile JSON arama (X-Requested-With: fetch şart).
  for (const q of [imdbId, imdbId ? String(imdbId).replace(/^tt/, '') : ''].filter(Boolean)) {
    const ham = await akilliGet(`${base}/search?q=${encodeURIComponent(q)}`, {
      ref: `${base}/`, timeout: 9000,
      headers: { 'User-Agent': HDFC_UA, 'X-Requested-With': 'fetch', Accept: 'application/json, text/plain, */*' }
    });
    const sonuc = jsonSonuclari(ham);
    if (sonuc.length) { contentUrl = secIcerik(sonuc, isMovie); if (contentUrl) break; }
  }
  // 2) Başlık araması (JSON) — IMDB sonuçsuzsa.
  if (!contentUrl && slug) {
    const ham = await akilliGet(`${base}/search?q=${encodeURIComponent(title || originalTitle)}`, {
      ref: `${base}/`, timeout: 9000,
      headers: { 'User-Agent': HDFC_UA, 'X-Requested-With': 'fetch', Accept: 'application/json, text/plain, */*' }
    });
    const sonuc = jsonSonuclari(ham);
    if (sonuc.length) contentUrl = secIcerik(sonuc, isMovie);
  }
  // 3) Doğrudan slug yolları (arama engelliyse).
  if (!contentUrl) {
    const paths = isMovie
      ? [`/${slug}/`, `/hd-${slug}-izle/`, `/${slug}-izle/`]
      : [`/dizi/${slug}-izle-3/sezon-${s}/bolum-${e}/`, `/dizi/${slug}-izle/sezon-${s}/bolum-${e}/`];
    for (const aday of bases.flatMap(b => paths.map(p => ({ base: b, url: `${b}${p}` })))) {
      const html = await akilliGet(aday.url, { ref: `${aday.base}/`, timeout: 9000, headers: { 'User-Agent': HDFC_UA } });
      if (html && pageAlternatives(html).length > 0) { contentUrl = aday.url; break; }
    }
  }
  if (!contentUrl) return [];
  if (!/^https?:/i.test(contentUrl)) contentUrl = `${base}${contentUrl.startsWith('/') ? '' : '/'}${contentUrl}`;
  const pageBase = originOf(contentUrl, base);

  // Dizi ise bölüm bağlantısını bul.
  if (!isMovie) {
    const showHtml = await akilliGet(contentUrl, { ref: `${pageBase}/`, timeout: 9000, headers: { 'User-Agent': HDFC_UA } });
    const bm = bolumBaglantisi(showHtml, s, e);
    if (bm) contentUrl = mutlakYap(bm, pageBase);
  }

  const playerHtml = await akilliGet(contentUrl, { ref: `${pageBase}/`, timeout: 12000, headers: { 'User-Agent': HDFC_UA } });
  if (!playerHtml) return [];

  // iframe ya da alternative-link → /video/{id}/ akışı
  let iframeUrl = '';
  const ifr = playerHtml.match(/<iframe\b[^>]*?(?:data-src|src)=["']([^"']+)["']/i);
  if (ifr) iframeUrl = mutlakYap(ifr[1], pageBase);
  if (!/embed|player|rplayer|rapidrame|closeload/i.test(iframeUrl)) {
    const alternatifler = pageAlternatives(playerHtml).slice(0, 5);
    let secili = alternatifler[0];
    if (alternatifler.some(a => /rapid/i.test(a.label))) secili = alternatifler.find(a => /rapid/i.test(a.label));
    if (secili) {
      const payload = await akilliGet(`${pageBase}/video/${secili.id}/`, {
        ref: contentUrl, timeout: 9000,
        headers: { 'User-Agent': HDFC_UA, 'X-Requested-With': 'fetch', Accept: 'application/json, text/plain, */*' }
      });
      const ic = videoEmbedUrl(payload);
      if (ic) iframeUrl = mutlakYap(ic, pageBase);
    }
  }
  if (!iframeUrl) return [];
  const iframeOrigin = originOf(iframeUrl, pageBase);

  // iframe HTML → şifre çözümü (Patron şemaları)
  let iframeHtml = await akilliGet(iframeUrl, { ref: contentUrl, timeout: 12000, headers: { 'User-Agent': HDFC_UA } });
  let m3u8 = be(iframeHtml || '');
  let finalHtml = iframeHtml || '';
  const rapidId = iframeUrl.match(/rapidrame_id=([a-zA-Z0-9]+)/) || iframeUrl.match(/\/rplayer\/([a-zA-Z0-9]+)/);
  if (rapidId && (!m3u8 || !finalHtml.includes('tracks:'))) {
    const rp = await akilliGet(`${pageBase}/rplayer/${rapidId[1]}/`, { ref: `${pageBase}/`, timeout: 12000, headers: { 'User-Agent': HDFC_UA } });
    if (rp) { finalHtml = rp; if (!m3u8) m3u8 = be(rp); }
  }

  const altyazilar = altyazilariAl(finalHtml, pageBase);
  const kaynaklar = [];

  if (m3u8) {
    // DOĞRUDAN YAYIN — iframe'e hiç düşmeden bizim oynatıcıyla açılır.
    const dublaj = /dual|trdual|trdub|dublaj/i.test(m3u8);
    for (const kategori of ['dubbed', 'subtitled']) {
      kaynaklar.push({
        id: `hdfc_direct_${tmdbId || slug}_${isMovie ? 'movie' : `s${s}e${e}`}_${kategori}`,
        name: `HDFC ${kategori === 'dubbed' ? 'Dublaj' : 'Altyazı'} 1080p`,
        displayName: `HDFC ${kategori === 'dubbed' ? 'Dublaj' : 'Altyazı'} (1080p)`,
        source: 'HDFC',
        url: m3u8,
        streamUrl: m3u8,
        rawStreamUrl: m3u8,
        // KRİTİK: Referer = OYNATICI origin'i, sitenin kök adresi DEĞİL.
        headers: { Referer: `${iframeOrigin}/`, 'User-Agent': HDFC_UA_PLAYER, Accept: '*/*' },
        quality: '1080p',
        isHls: /\.m3u8/i.test(m3u8),
        isDirectVideo: true,
        category: kategori,
        type: 'direct',
        subtitles: altyazilar,
        getUrl: () => m3u8
      });
    }
    void dublaj;
    return kaynaklar;
  }

  // Çözülemediyse gömülü oynatıcı (gizli WebView açar) — SON ÇARE.
  const provider = /rapid|rplayer/i.test(iframeUrl) ? 'Rapidrame' : 'CloseLoad';
  for (const category of ['dubbed', 'subtitled']) {
    kaynaklar.push({
      id: `hdfc_${provider === 'Rapidrame' ? 'rapid' : 'close'}_device_${tmdbId || slug}_${isMovie ? 'movie' : `s${s}e${e}`}_${category}`,
      name: `HDFC ${provider}`,
      displayName: `HDFC ${provider}`,
      source: provider,
      url: iframeUrl,
      streamUrl: iframeUrl,
      movieUrl: contentUrl,
      category,
      type: 'embed',
      isIframe: true,
      isDirectVideo: false,
      getUrl: () => iframeUrl
    });
  }
  return kaynaklar;
}

function originOf(url, varsayilan) {
  try { return new URL(url).origin; } catch (_) { return varsayilan; }
}

function mutlakYap(link, base) {
  if (!link) return '';
  const s = String(link).trim();
  if (s.startsWith('//')) return `https:${s}`;
  if (/^https?:\/\//i.test(s)) return s;
  try { return new URL(s, base).href; } catch (_) { return s; }
}

/** `/search` JSON yanıtından sonuç HTML parçalarını çıkarır. */
function jsonSonuclari(ham) {
  const t = String(ham || '').trim();
  if (!t) return [];
  try {
    const d = JSON.parse(t);
    if (Array.isArray(d?.results)) return d.results;
    if (Array.isArray(d)) return d;
  } catch (_) {}
  // JSON gelmediyse düz HTML araması (href listesi)
  const out = [];
  for (const m of t.matchAll(/href="([^"]+)"/g)) out.push(`<a href="${m[1]}"></a>`);
  return out;
}

function secIcerik(sonuclar, isMovie) {
  let yedek = '';
  for (const html of sonuclar) {
    const m = String(html).match(/href="([^"]+)"/);
    if (!m) continue;
    const url = m[1];
    if (!yedek) yedek = url;
    const dizi = url.includes('/dizi/');
    if (isMovie && !dizi) return url;
    if (!isMovie && dizi) return url;
  }
  return yedek;
}

function bolumBaglantisi(html, sezon, bolum) {
  for (const m of String(html || '').matchAll(/<a\s+[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = m[1];
    const metin = m[2].replace(/<[^>]+>/g, '').toLowerCase().trim();
    const dm = href.match(/sezon-(\d+)\/bolum-(\d+)/i);
    if (dm && parseInt(dm[1], 10) === sezon && parseInt(dm[2], 10) === bolum) return href;
    const sm = metin.match(/(\d+)\.\s*sezon/);
    const em = metin.match(/(\d+)\.\s*bölüm/);
    if (sm && em && parseInt(sm[1], 10) === sezon && parseInt(em[1], 10) === bolum) return href;
  }
  return '';
}

export async function fetchHdfilmcehennemiSources({
  type = 'movie',
  tmdbId = null,
  imdbId = null,
  title = '',
  originalTitle = '',
  season = 1,
  episode = 1
} = {}) {
  const query = title || originalTitle;
  if (!query) return [];

  const sNum = parseInt(season, 10) || 1;
  const epNum = parseInt(episode, 10) || 1;
  const isMovie = type === 'movie';

  try {
    const searchTitle = cleanTitle(query);
    const searchOriginal = cleanTitle(originalTitle);

    // Android: cihaz yolu once denenir. Sunucu IP'si engellendigi icin
    // API cagrisi 11 saniye bosuna gider; WebView cozumleyici dogrudan calisir.
    if (isNativeAndroidApp()) {
      const deviceSources = await resolveHdfcEmbedsOnDevice({ title: searchTitle, originalTitle: searchOriginal, season: sNum, episode: epNum, type, imdbId, tmdbId });
      if (deviceSources.length > 0) return deviceSources;
    }

    // Localhost'ta vite proxy -> :4000 (guncel backend); canlıda Vercel API.
    // APK'da hostname localhost olsa bile native'tir, relative birakilmaz.
    const host = typeof window !== 'undefined' ? (window.location?.hostname || '') : '';
    const isLocal = (host === 'localhost' || host === '127.0.0.1') && !isNativeCapacitor();
    const loc = (p) => (isLocal ? p : apiUrl(p));
    const endpoint = loc(`${isNativeCapacitor() ? '/api/resolve?provider=hdfc&title=' : '/api/hdfc_stream?query='}${encodeURIComponent(searchTitle)}&originalTitle=${encodeURIComponent(searchOriginal)}&tmdbId=${tmdbId || ''}&imdbId=${imdbId || ''}&season=${sNum}&episode=${epNum}&type=${type || (isMovie ? 'movie' : 'tv')}`);
    
    const res = await fetch(endpoint, {
      signal: AbortSignal.timeout(11000)
    }).catch(() => null);

    if (!res || !res.ok) {
      return await resolveHdfcEmbedsOnDevice({ title: searchTitle, originalTitle: searchOriginal, season: sNum, episode: epNum, type, imdbId, tmdbId });
    }

    const data = await res.json().catch(() => null);
    if (!data || !data.success || (!data.streamUrl && !Array.isArray(data.streams))) {
      return await resolveHdfcEmbedsOnDevice({ title: searchTitle, originalTitle: searchOriginal, season: sNum, episode: epNum, type, imdbId, tmdbId });
    }

    const sources = [];
    const backendStreams = Array.isArray(data.streams) && data.streams.length > 0
      ? data.streams
      : [{ provider: 'HDFilmCehennemi', streamUrl: data.streamUrl, rawStreamUrl: data.rawStreamUrl, subtitles: data.subtitles }];

    for (const bs of backendStreams) {
      if (!bs || !bs.streamUrl) continue;
      const provider = bs.provider === 'Rapidrame' ? 'Rapidrame' : (bs.provider === 'CloseLoad' ? 'CloseLoad' : 'HDFilmCehennemi');
      const tag = provider === 'HDFilmCehennemi' ? 'hdfc' : (provider === 'Rapidrame' ? 'rapid' : 'close');

      // Process subtitle tracks
      const subs = [];
      if (Array.isArray(bs.subtitles)) {
        for (const sub of bs.subtitles) {
          if (sub.src) {
            subs.push({
              label: sub.label || `Türkçe (${provider})`,
              src: sub.src
            });
          }
        }
      }

    // Add fallback OpenSubtitles if no Turkish sub present
    const hasTr = subs.some(s => (s.label || '').toLowerCase().includes('türk') || (s.label || '').toLowerCase().includes('tr'));
    if (!hasTr && (imdbId || tmdbId || title)) {
      const cleanTitle = encodeURIComponent(title || originalTitle || '');
      const defaultSubUrl = isMovie
        ? `/api/subtitles?tmdbId=${tmdbId || ''}&imdbId=${imdbId || ''}&title=${cleanTitle}&type=movie`
        : `/api/subtitles?tmdbId=${tmdbId || ''}&imdbId=${imdbId || ''}&title=${cleanTitle}&season=${sNum}&episode=${epNum}&type=tv`;
      subs.unshift({ label: 'OpenSubtitles (Türkçe)', src: defaultSubUrl });
    }

      // 1. Dublaj Hattı (CloseLoad / Rapidrame Dublaj 1080p)
      sources.push({
        id: `hdfc_${tag}_dub_${tmdbId || 'q'}_${isMovie ? 'movie' : `s${sNum}e${epNum}`}`,
        name: isMovie ? `${provider} Dublaj 1080p` : `${provider} Dublaj S${sNum}B${epNum}`,
        displayName: `${provider} Dublaj (1080p)`,
        badge: provider === 'Rapidrame' ? '🚀 Rapidrame Dublaj 1080p' : (provider === 'CloseLoad' ? '⚡ CloseLoad Dublaj 1080p' : '🔥 HDFC Dublaj 1080p'),
        source: provider,
        url: loc(bs.streamUrl),
        streamUrl: loc(bs.streamUrl),
        rawStreamUrl: bs.rawStreamUrl,
        movieUrl: bs.movieUrl || data.movieUrl,
        quality: '1080p HD',
        isHls: true,
        isDirectVideo: true,
        category: 'dubbed',
        type: 'direct',
        subtitles: subs,
        getUrl: () => loc(bs.streamUrl)
      });

      // 2. Altyazılı Hattı (CloseLoad / Rapidrame Altyazı 1080p)
      sources.push({
        id: `hdfc_${tag}_sub_${tmdbId || 'q'}_${isMovie ? 'movie' : `s${sNum}e${epNum}`}`,
        name: isMovie ? `${provider} Altyazı 1080p` : `${provider} Altyazı S${sNum}B${epNum}`,
        displayName: `${provider} Altyazı (1080p)`,
        badge: provider === 'Rapidrame' ? '🚀 Rapidrame Altyazı 1080p' : (provider === 'CloseLoad' ? '⚡ CloseLoad Altyazı 1080p' : '🔥 HDFC Altyazı 1080p'),
        source: provider,
        url: loc(bs.streamUrl),
        streamUrl: loc(bs.streamUrl),
        rawStreamUrl: bs.rawStreamUrl,
        movieUrl: bs.movieUrl || data.movieUrl,
        quality: '1080p HD',
        isHls: true,
        isDirectVideo: true,
        category: 'subtitled',
        type: 'direct',
        subtitles: subs,
        getUrl: () => loc(bs.streamUrl)
      });
    }

    return sources;
  } catch (err) {
    console.warn('[HDFilmCehennemi Scraper] Failed to resolve:', err?.message);
    return [];
  }
}

function cleanTitle(raw) {
  if (!raw) return '';
  return raw
    .replace(/\s*-\s*S\d+E\d+.*$/i, '')
    .replace(/\s*-\s*S\d+.*$/i, '')
    .replace(/\s*-\s*\d+\.\s*Sezon.*$/i, '')
    .replace(/\s*\(\d{4}\).*/, '')
    .trim();
}
