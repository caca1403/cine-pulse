import { probeStream } from './probe.js';
import { normalizeStream, unwrapStreamUrl, directMediaUrl, deviceMediaUrl } from './contract.js';

const inflight = new Map();
const verified = new Map();
const pools = new Map();
const verificationInflight = new Map();
const unshortCache = new Map();

async function slot(fn, group = 'extract') {
  if (!pools.has(group)) pools.set(group, { active: 0, waiters: [] });
  const pool = pools.get(group);
  if (pool.active >= 2) await new Promise(resolve => pool.waiters.push(resolve));
  else pool.active++;
  try { return await fn(); } finally {
    const next = pool.waiters.shift();
    if (next) next(); else pool.active--;
  }
}

/** Hop başına birleşik sinyal: dış iptal + ~timeout ms; AbortSignal.any
 *  yoksa elle AbortController fallback (dinleyi sızdırmaz). */
function hopSignali(signal, timeoutMs) {
  const zamanAsimi = typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
    ? AbortSignal.timeout(Math.max(1, timeoutMs)) : null;
  if (!signal) return { signal: zamanAsimi || undefined, birak() {} };
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.any === 'function')
    return { signal: zamanAsimi ? AbortSignal.any([signal, zamanAsimi]) : signal, birak() {} };
  const ac = new AbortController();
  const yolla = () => { try { ac.abort(new Error('hop-abort')); } catch (_) { ac.abort(); } };
  if (signal.aborted) yolla(); else signal.addEventListener('abort', yolla, { once: true });
  const timer = setTimeout(yolla, Math.max(1, timeoutMs));
  return { signal: ac.signal, birak() { clearTimeout(timer); signal.removeEventListener('abort', yolla); } };
}

const META_REFRESH = /<meta[^>]+http-equiv\s*=\s*["']?refresh["']?[^>]*content\s*=\s*["'][^"']*?url\s*=\s*([^"'\s>]+)/i;
const JS_LOCATION = /(?:window|top|document\.location)\s*(?:\.\s*(?:location|href|replace|assign))?\s*(?:=|\()\s*["']([^"']+)["']/i;

/**
 * KISA ADRES ZİNCİRİ (CloudStream UnshortenUrl kalıbı): location header →
 * meta-refresh → window.location desenlerini ≤5 hop, hop başına ~4 sn ile çözer;
 * `seen` kümesi döngüyü keser. SONUÇ YAYIN DEĞİLDİR: zincir yalnız ADRES üretir
 * (medya ise doğrudan kullanılır; değilse çağıranın mevcut extract akışı yeni
 * adreste sürer) — asla iframe/sayfa yayını olarak döndürülmez. Herhangi bir
 * adımda hata/CORS/iptal olursa zincir güvenli şekilde o ana kadarki adreste durur.
 */
export async function unshorten(url, { signal = null, headers = {}, fetchImpl = fetch, maxHops = 5, timeoutMs = 4000, diagnose = () => {} } = {}) {
  let current = String(url || '');
  const seen = new Set();
  let hops = 0;
  for (let hop = 0; hop < maxHops; hop++) {
    if (!/^https?:\/\//i.test(current) || signal?.aborted) break;
    if (seen.has(current)) { diagnose({ stage: 'unshorten', state: 'loop-stopped', hops }); break; }
    seen.add(current);
    if (directMediaUrl(current)) return current; // zincir medyada bitti
    const { signal: hopSignal, birak } = hopSignali(signal, timeoutMs);
    try {
      let response = await fetchImpl(current, { redirect: 'manual', signal: hopSignal, headers: { Accept: 'text/html,application/xhtml+xml,*/*', ...headers } });
      // Tarayıcı CORS'ta location'ı göstermez (opaqueredirect): yönlendirmeyi
      // takip ederek final adrese in — response.url zincirin sonucunu verir.
      if (response.type === 'opaqueredirect') {
        response = await fetchImpl(current, { redirect: 'follow', signal: hopSignal, headers: { Accept: 'text/html,application/xhtml+xml,*/*', ...headers } });
        const finalUrl = response.url && response.url !== current ? response.url : '';
        if (!finalUrl || seen.has(finalUrl)) break;
        current = finalUrl; hops++; continue;
      }
      const location = typeof response.headers?.get === 'function' ? response.headers.get('location') : '';
      if (response.status >= 300 && response.status < 400 && location) {
        const next = new URL(location, current).href;
        if (next === current || seen.has(next)) break;
        current = next; hops++; continue;
      }
      if (!response.ok && response.status >= 400) break;
      const body = String(await response.text() || '').slice(0, 120000);
      const meta = META_REFRESH.exec(body)?.[1] || JS_LOCATION.exec(body)?.[1] || '';
      if (!meta || /^(?:javascript|data|about):/i.test(meta)) break;
      const next = new URL(decodeURIComponent(meta.trim()), current).href;
      if (!/^https?:\/\//i.test(next) || next === current || seen.has(next)) break;
      current = next; hops++;
    } catch (_) {
      break // güvenli düşüş: ağ/CORS/iptal → o ana kadarki adresle devam et
    } finally {
      birak();
    }
  }
  if (hops) diagnose({ stage: 'unshorten', state: directMediaUrl(current) ? 'media' : 'page', hops });
  return current;
}

/** Embedded pages are extraction inputs, never playback outputs on Android. */
export async function resolveDirectPlayback(raw, { extract, webView, diagnose = () => {}, provider = '', toPlaybackUrl = deviceMediaUrl, signal = null } = {}) {
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
        // KISA ADRES ZİNCİRİ — extract denemesinden ÖNCE (UnshortenUrl kalıbı).
        // Medya çıkarsa doğrudan kullan; sayfa çıkarsa extract yeni adreste sürer.
        const cached = unshortCache.get(url);
        const hedef = cached && Date.now() - cached.at < 45000 ? cached.url
          : await unshorten(url, { signal, headers, diagnose: event => diagnose({ provider, ...event }) }).catch(() => url);
        if (!unshortCache.has(url) && hedef && hedef !== url) {
          unshortCache.set(url, { at: Date.now(), url: hedef });
          if (unshortCache.size > 100) unshortCache.delete(unshortCache.keys().next().value);
        }
        if (hedef !== url && directMediaUrl(hedef)) {
          return { url: hedef, referer: headers.Referer || new URL(hedef).origin + '/', subtitles };
        }
        const hit = await extract?.(hedef, headers.Referer || '').catch(() => null);
        if (hit?.url && !hit.isIframe && (directMediaUrl(hit.url) || hit.isHls || hit.isDirectVideo)) return hit;
        const page = await webView?.(hedef, { media: true, timeoutMs: 16000, signal }).catch(() => null);
        const media = page?.streams?.find(item => directMediaUrl(item.url));
        return media ? { ...media, referer: media.headers?.Referer || page.finalUrl || hedef } : null;
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

export async function prepareAndroidSources(sources, { verify = true, fallbackOnFailure = false, onReady = () => {}, ...options } = {}) {
  const [{ extractEmbedStream }, { resolvePageInNativeWebView }] = await Promise.all([
    import('../embedExtractors.js'), import('../platform/androidWebViewResolver.js')
  ]);
  const fallback = (source, result) => {
    if (!fallbackOnFailure || !source) return null;
    // KURAL: yalnızca BİZİM oynatıcımızda oynayan kaynaklar listelenir.
    // iframe / sayfa-gömülü kaynak "açılmıyor" demekle aynıdır → hiç eklenmez.
    // Tek istisna: doğrulamalı modeller (Luna); onay sonrası asıl yayına
    // yönlendirir ve o yayın doğrudan çözülür.
    const iframeMi = Boolean(source.isIframe || source.isSayfa || source.isPageEmbed
      || source.type === 'embed' || source.type === 'iframe');
    if (iframeMi && !source.requiresVerification) {
      options.diagnose?.({ provider: source.provider || source.source, stage: 'playback', state: 'skipped', reason: 'iframe-only-calismaz' });
      return null;
    }
    // ÖLÜ YAYIN LİSTELENMEZ (kullanıcı kuralı): taşıma sorgusu yayının
    // sunucu tarafından REDDEDİLDİĞİNİ kesin olarak gösteriyorsa (HTTP 4xx/5xx)
    // kaynak hiç eklenmez. Ölçüldü: Vega'nın fastplay master.txt adresi 404
    // dönüyordu ama "Vega A/B" olarak listede duruyor, seçilince oynamıyordu.
    // Belirsiz başarısızlıklar (zaman aşımı, kopsuz ağ) listede kalır.
    const httpHatalari = /^HTTP (\d{3})/.exec(String(result?.reason || ''));
    if (httpHatalari && Number(httpHatalari[1]) >= 400) {
      options.diagnose?.({ provider: source.provider || source.source, stage: 'playback', state: 'skipped', reason: `olu-${httpHatalari[1]}`, url: source.rawStreamUrl || source.streamUrl });
      return null;
    }
    const kept = { ...source, autoPlayable: false, verification: result };
    onReady(kept);
    return kept;
  };
  const checked = await Promise.all((sources || []).map(async raw => {
    if (raw.isSrcdoc || raw.requiresVerification || raw.isTorrent) {
      return fallback(raw, { state: raw.requiresVerification ? 'verification-required' : 'unverified' });
    }
    const source = await resolveDirectPlayback(raw, {
      extract: extractEmbedStream, webView: resolvePageInNativeWebView, ...options
    });
    if (!source) return fallback(raw, { state: 'unverified', reason: 'direct-media-not-found' });
    if (!verify) { onReady(source); return source; }
    // Discovery must not wait behind the bounded transport-probe queue.
    // This is a resolved direct-media candidate, not a verified playback claim.
    onReady({ ...source, autoPlayable: false, verification: { state: 'pending' } });
    return slot(async () => {
      const key = `${source.rawStreamUrl}:${JSON.stringify(source.headers)}`;
      const cached = verified.get(key);
      let result = cached && Date.now() - cached.at < 45000 ? cached.result : null;
      if (!result) {
        if (!verificationInflight.has(key)) {
          const probe = probeStream(source, { timeoutMs: 8000 });
          verificationInflight.set(key, probe);
          probe.finally(() => verificationInflight.delete(key)).catch(() => {});
        }
        result = await verificationInflight.get(key);
        if (result.state === 'transport-verified') verified.set(key, { at: Date.now(), result });
        if (verified.size > 200) verified.delete(verified.keys().next().value);
      }
      options.diagnose?.({ provider: source.provider || source.source, stage: 'transport', ...result });
      if (result.state !== 'transport-verified') return fallback(source, result);
      const ready = { ...source, autoPlayable: true, verification: result };
      onReady(ready);
      return ready;
    }, source.category === 'dubbed' ? 'verify-dubbed' : 'verify-subtitled');
  }));
  return checked.filter(Boolean);
}
