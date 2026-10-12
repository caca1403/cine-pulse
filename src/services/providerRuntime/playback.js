import { probeStream } from './probe.js';
import { normalizeStream, unwrapStreamUrl, directMediaUrl, deviceMediaUrl } from './contract.js';

const inflight = new Map();
const verified = new Map();
let active = 0;
const waiters = [];
async function slot(fn) {
  if (active >= 4) await new Promise(resolve => waiters.push(resolve));
  else active++;
  try { return await fn(); } finally {
    const next = waiters.shift();
    if (next) next(); else active--;
  }
}

/** Embedded pages are extraction inputs, never playback outputs on Android. */
export async function resolveDirectPlayback(raw, { extract, webView, diagnose = () => {}, provider = '', toPlaybackUrl = deviceMediaUrl } = {}) {
  const stream = normalizeStream(raw, { provider });
  if (!stream) return null;
  if (stream.isTorrent || stream.isSrcdoc || stream.requiresVerification) {
    diagnose({ provider, stage: 'playback', state: 'unsupported', reason: 'requires-special-runtime' });
    return null;
  }
  let url = unwrapStreamUrl(stream.rawStreamUrl || stream.streamUrl);
  let headers = { ...stream.headers };
  try {
    const proxy = new URL(stream.streamUrl, 'https://localhost');
    if (!headers.Referer && proxy.searchParams.get('ref')) headers.Referer = proxy.searchParams.get('ref');
  } catch (_) {}
  let subtitles = stream.subtitles;
  const declaredDirect = !stream.isIframe && !stream.isSayfa && stream.type !== 'embed' && stream.type !== 'iframe' &&
    (stream.isHls || stream.isDirectVideo) && /^https?:\/\//i.test(url) && !/\.html?(?:[?#]|$)/i.test(url);
  if (!directMediaUrl(url) && !declaredDirect) {
    const key = `${url}:${headers.Referer || ''}`;
    if (!inflight.has(key)) {
      const job = slot(async () => {
        const hit = await extract?.(url, headers.Referer || '').catch(() => null);
        if (hit?.url && !hit.isIframe && (directMediaUrl(hit.url) || hit.isHls || hit.isDirectVideo)) return hit;
        const page = await webView?.(url, { media: true, timeoutMs: 16000 }).catch(() => null);
        const media = page?.streams?.find(item => directMediaUrl(item.url));
        return media ? { ...media, referer: media.headers?.Referer || page.finalUrl || url } : null;
      });
      inflight.set(key, job);
      job.finally(() => inflight.delete(key)).catch(() => {});
    }
    const hit = await inflight.get(key);
    if (!hit?.url) {
      diagnose({ provider: stream.provider || provider, stage: 'extract', state: 'failed', reason: 'direct-media-not-found' });
      return null;
    }
    url = hit.url;
    headers = { ...headers, ...hit.headers, ...(hit.referer ? { Referer: hit.referer } : {}) };
    subtitles = hit.subtitles || subtitles;
  }
  const playback = toPlaybackUrl(url, headers);
  subtitles = (subtitles || []).map(subtitle => {
    const value = subtitle.src || subtitle.url;
    if (!value || !/^https?:\/\//i.test(unwrapStreamUrl(value))) return subtitle;
    const target = toPlaybackUrl(unwrapStreamUrl(value), headers);
    return { ...subtitle, src: target, url: target };
  });
  diagnose({ provider: stream.provider || provider, stage: 'extract', state: 'resolved' });
  return {
    ...stream, rawStreamUrl: url, url: playback, streamUrl: playback, headers, subtitles,
    isIframe: false, isSayfa: false, type: 'direct', isDirectVideo: true,
    isHls: stream.isHls || /\.m3u8(?:[?#]|$)/i.test(url),
    getUrl: () => playback,
  };
}

export async function prepareAndroidSources(sources, { verify = true, ...options } = {}) {
  const [{ extractEmbedStream }, { resolvePageInNativeWebView }] = await Promise.all([
    import('../embedExtractors.js'), import('../platform/androidWebViewResolver.js')
  ]);
  const prepared = await Promise.all((sources || []).map(source => resolveDirectPlayback(source, {
    extract: extractEmbedStream, webView: resolvePageInNativeWebView, ...options
  })));
  if (!verify) return prepared.filter(Boolean);
  const checked = await Promise.all(prepared.filter(Boolean).map(source => slot(async () => {
    const key = `${source.rawStreamUrl}:${JSON.stringify(source.headers)}`;
    const cached = verified.get(key);
    let result = cached && Date.now() - cached.at < 45000 ? cached.result : null;
    if (!result) {
      result = await probeStream(source, { timeoutMs: 8000 });
      if (result.state === 'transport-verified') verified.set(key, { at: Date.now(), result });
      if (verified.size > 200) verified.delete(verified.keys().next().value);
    }
    options.diagnose?.({ provider: source.provider || source.source, stage: 'transport', ...result });
    return result.state === 'transport-verified' ? { ...source, verification: result } : null;
  })));
  return checked.filter(Boolean);
}
