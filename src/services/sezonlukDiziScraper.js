import { extractPageMediaTitle, isStrictMediaTitleMatch } from './mediaMatcher.js';
import { apiUrl } from './apiOrigin.js';

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

/** Sayfa-embed URL'leri oynaticiya capali acilir (#embed): capraz-origin
 * CSS enjekte edilemedigi icin cerceve oyuncu bolumune kaydirilmis baslar.
 * Cloudstream de korumali ogete dogrudan erisemez; fark oc kernelde degil sunumdadir. */
export function withEmbedAnchor(pageUrl) {
  try {
    if (!pageUrl || typeof pageUrl !== 'string') return pageUrl;
    if (/#.+/.test(pageUrl)) return pageUrl;
    return `${pageUrl}#embed`;
  } catch (_) {
    return pageUrl;
  }
}

function toTurkishSlug(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function buildVerificationSources(pageUrl, sources, season, episode, isDub) {
  if (!/^https:\/\/sezonlukdizi\.cc\//i.test(pageUrl || '') || !Array.isArray(sources)) return [];
  return sources
    .filter(item => item?.id && !/pixel|filemoon/i.test(item.provider || ''))
    .map(item => {
      const page = new URL(pageUrl);
      if (isDub && !page.pathname.includes('/dublaj/')) {
        page.pathname = page.pathname.replace(/\/([^/]+\.html)$/, '/dublaj/$1');
      }
      page.searchParams.set('cpAlternative', item.id);
      page.searchParams.set('cpLanguage', item.language ?? (isDub ? '0' : '1'));
      const url = withEmbedAnchor(page.href);
      const provider = item.provider || 'Player';
      return {
        id: `szd_${item.id}_s${season}e${episode}`,
        name: `SZ ${provider}`,
        displayName: `SZ ${provider}`,
        category: isDub ? 'dubbed' : 'subtitled',
        url,
        streamUrl: url,
        isIframe: true,
        isPageEmbed: true,
        type: 'embed',
        requiresVerification: true,
        isDirectVideo: false,
        source: 'SZ',
        getUrl: () => url
      };
    });
}

async function fetchWithWorkerFallback(targetUrl, options = {}) {
  const isBrowser = typeof window !== 'undefined';

  // Localhost'ta vite proxy -> :4000 (cookie'li SZD hatti); canlida Vercel API.
  if (isBrowser) {
    try {
      const host = window.location?.hostname || '';
      const isLocal = ((host === 'localhost' || host === '127.0.0.1') && !Boolean(window.Capacitor?.isNativePlatform?.()) && window.location?.protocol !== 'capacitor:');
      const u = new URL(targetUrl);
      const szdUrl = isLocal ? `/api/szd${u.pathname}${u.search}` : apiUrl(`/api/szd${u.pathname}${u.search}`);
      const res = await fetch(szdUrl, {
        ...options,
        headers: {
          ...(options.headers || {}),
          'X-Requested-With': 'XMLHttpRequest'
        },
        signal: AbortSignal.timeout(6000)
      }).catch(() => null);
      if (res && res.ok) return res;
    } catch (_) {}
  }

  // Try Cloudflare Worker Gateway when the local gateway is unavailable.
  try {
    const workerUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(workerUrl, {
      ...options,
      signal: AbortSignal.timeout(4000)
    }).catch(() => null);

    if (res && res.ok) {
      return res;
    }
  } catch (_) {}

  // Server-side/direct fallback.
  try {
    const res = await fetch(targetUrl, {
      ...options,
      headers: {
        ...(options.headers || {}),
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://sezonlukdizi.cc/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(4000)
    }).catch(() => null);

    if (res && res.ok) {
      return res;
    }
  } catch (_) {}

  return null;
}

export async function fetchSezonlukDiziEpisodeSources({ titles = [], seriesTitle = '', originalTitle = '', season = 1, episode = 1, isDub = true }) {
  // Ozel backend resolver (birincil); basarisizsa klasik akisa dus.
  try {
    const host = typeof window !== 'undefined' ? (window.location?.hostname || '') : '';
    const isLocal = ((host === 'localhost' || host === '127.0.0.1') && !Boolean(window.Capacitor?.isNativePlatform?.()) && window.location?.protocol !== 'capacitor:');
    const qs = new URLSearchParams({
      provider: 'szd', type: 'tv', title: seriesTitle || (titles || [])[0] || '',
      originalTitle: originalTitle || '', season: String(season || 1), episode: String(episode || 1),
      isDub: isDub ? '1' : '0'
    });
    (titles || []).forEach((t, i) => { if (i < 4 && t) qs.append(`t${i}`, t); });
    const rpath = `/api/resolve?${qs.toString()}`;
    const rendpoint = (isLocal || typeof window === 'undefined') ? rpath : apiUrl(rpath);
    const rres = await fetch(rendpoint, { signal: AbortSignal.timeout(50000) }).catch(() => null);
    if (rres && rres.ok) {
      const rdata = await rres.json().catch(() => null);
      const verification = rdata?.requiresVerification
        ? buildVerificationSources(
          rdata.pageUrl,
          rdata.verificationSources?.length
            ? rdata.verificationSources
            : [{ id: 'verification', language: isDub ? '0' : '1' }],
          season,
          episode,
          isDub
        )
        : [];
      if (rdata && rdata.success && Array.isArray(rdata.streams) && rdata.streams.length > 0) {
        const mapped = rdata.streams.map((s, i) => {
          const prov = s.provider || 'SZ';
          const label = `${prov} S${season}B${episode}`;
          return {
            id: `szd_${s.tag || i}_s${season}e${episode}`,
            name: label,
            displayName: label,
            badge: `⚡ ${prov}`,
            category: isDub ? 'dubbed' : 'subtitled',
            url: s.streamUrl,
            streamUrl: s.streamUrl,
            isHls: /\.m3u8/i.test(s.streamUrl || ''),
            isIframe: !/\.m3u8/i.test(s.streamUrl || ''),
            type: /\.m3u8/i.test(s.streamUrl || '') ? 'hls' : 'embed',
            isDirectVideo: false,
            source: 'SZ',
            subtitles: Array.isArray(s.subtitles) ? s.subtitles : [],
            getUrl: () => s.streamUrl
          };
        }).filter((s) => s.streamUrl);
        if (mapped.length > 0) return [...mapped, ...verification];
      }
      if (verification.length) return verification;
    }
  } catch (_) {}

  const allTitles = [...new Set([...titles, seriesTitle, originalTitle])].filter(t => t && typeof t === 'string' && t.trim().length > 1);
  if (allTitles.length === 0) return [];

  const candidateSlugs = [];
  for (const t of allTitles) {
    const s = toTurkishSlug(t);
    if (s && !candidateSlugs.includes(s)) {
      candidateSlugs.push(s);
      if (!s.endsWith('-izle')) candidateSlugs.push(`${s}-izle`);
      
      if (s.startsWith('the-')) {
        const noThe = s.replace(/^the-/, '');
        if (!candidateSlugs.includes(noThe)) candidateSlugs.push(noThe);
      }
    }
  }

  const baseDomain = 'https://sezonlukdizi.cc';

  for (const slug of candidateSlugs) {
    try {
      const pageUrl = `${baseDomain}/${slug}/${season}-sezon-${episode}-bolum.html`;

      const res = await fetchWithWorkerFallback(pageUrl);
      if (!res) continue;

      const html = await res.text();
      const pageTitle = extractPageMediaTitle(html);
      if (!isStrictMediaTitleMatch(pageTitle, allTitles)) continue;

      const bidMatch = html.match(/data-id=["'](\d+)["']/i) || html.match(/var\s+bid\s*=\s*["']?(\d+)["']?/i) || html.match(/bid\s*=\s*(\d+)/i);
      const bid = bidMatch ? bidMatch[1] : null;
      if (!bid) continue;

      const dilParam = isDub ? '0' : '1';
      const altUrl = `${baseDomain}/ajax/dataAlternatif22.asp`;

      const altRes = await fetchWithWorkerFallback(altUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: `bid=${bid}&dil=${dilParam}`
      });

      if (!altRes) continue;
      const altJson = await altRes.json().catch(() => null);
      if (!altJson || altJson.status !== 'success' || !Array.isArray(altJson.data) || altJson.data.length === 0) continue;

      const extractedSources = [];
      const verificationSources = [];

      const sourceResults = await Promise.all(altJson.data.map(async item => {
        if (/pixel|filemoon/i.test(item.baslik || '')) return null;
        const embedUrlEndpoint = `${baseDomain}/ajax/dataEmbed22.asp`;

        const emRes = await fetchWithWorkerFallback(embedUrlEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          body: `id=${item.id}`
        });

        if (!emRes) return null;
        const emText = await emRes.text().catch(() => '');
        const srcMatch = emText.match(/src=["']([^"']+)["']/i);
        let iframeUrl = srcMatch ? srcMatch[1] : null;

        if (iframeUrl && /recaptcha/i.test(iframeUrl)) {
          verificationSources.push({
            id: String(item.id),
            provider: item.baslik || 'Player',
            language: dilParam
          });
          return null;
        }

        if (iframeUrl && iframeUrl.length > 10) {
          if (/pixel|filemoon|bysejikuar|bysezoxexe/i.test(`${item.baslik || ''} ${iframeUrl}`)) return null;
          if (iframeUrl.startsWith('//')) {
            iframeUrl = 'https:' + iframeUrl;
          }

          const isVidmoly = item.baslik === 'VidMoly' || iframeUrl.includes('vidmoly');
          const finalUrl = iframeUrl;
          const serverName = isVidmoly ? 'VidMoly 1080p' : `${item.baslik} HD`;

          return {
            id: `szd_${item.id}`,
            name: serverName,
            displayName: serverName,
            badge: `⚡ ${item.baslik}`,
            category: isDub ? 'dubbed' : 'subtitled',
            url: finalUrl,
            streamUrl: finalUrl,
            isHls: false,
            isDirectVideo: false,
            getUrl: () => finalUrl
          };
        }
        return null;
      }));
      extractedSources.push(...sourceResults.filter(Boolean));

      if (extractedSources.length > 0) {
        return [...extractedSources, ...buildVerificationSources(pageUrl, verificationSources, season, episode, isDub)];
      }
      const mappedVerification = buildVerificationSources(pageUrl, verificationSources, season, episode, isDub);
      if (mappedVerification.length > 0) return mappedVerification;
    } catch (err) {
      console.warn('[SezonlukDiziScraper] Error:', err);
    }
  }

  return [];
}
