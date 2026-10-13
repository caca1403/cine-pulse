import { qualityRank } from './contract.js';

async function within(promise, timeoutMs) {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('provider-timeout')), timeoutMs);
  })]); } finally { clearTimeout(timer); }
}

/**
 * Resolution and playback preparation have separate queues; neither language blocks discovery.
 *
 * İPTAL YAYILIMI (CloudStream coroutine cancellation / Nuvio eval-timeout kalıbı):
 * her sağlayıcı için bir AbortController üretilir ve `signal` resolve'a verilir;
 * timeout, çağıranın (kullanıcı/bölüm değişimi) sinyalinden gelen iptal veya
 * sağlayıcının bitişi controller'ı düşürür — kit.js'teki `istek()` bunu görür ve
 * bekleyen isteği anında bırakır, YENİ istek başlatmaz. Böylece timeout'tan sonra
 * "zombi" sağlayıcılar ağı ve WebView sırasını meşgul etmez.
 */
export async function runProviderBatch(providers, args, { concurrency = 4, onResult = () => {}, diagnose = () => {}, timeoutMs = 30000, signal = null } = {}) {
  const results = new Array(providers.length), publications = [];
  let cursor = 0;
  async function worker() {
    while (cursor < providers.length) {
      if (signal?.aborted) return; // bölüm/kullanıcı değişti: sıradakiler hiç başlamaz
      const index = cursor++, provider = providers[index], start = Date.now();
      const seen = new Set(), collected = [];
      let accepting = true;
      const emit = sources => {
        if (!accepting) return;
        const fresh = (sources || []).filter(source => {
          const key = `${source.category || ''}:${source.id || ''}:${source.rawStreamUrl || source.streamUrl || source.url}`;
          if (seen.has(key)) return false;
          seen.add(key); return true;
        });
        if (!fresh.length) return;
        // YAYIN ÖNCESİ KALİTE SIRASI (CloudStream sortUrls): en yüksek kalite en üstte,
        // kalitesiz (-1) en sonda.
        fresh.sort((a, b) => (qualityRank(b)) - (qualityRank(a)));
        collected.push(...fresh);
        publications.push(within(Promise.resolve().then(() => onResult({ provider: provider.id, sources: fresh })), timeoutMs)
          .catch(error => diagnose({ provider: provider.id, stage: 'prepare', state: 'failed', reason: error.message })));
      };
      const controller = new AbortController();
      const drop = reason => { if (!controller.signal.aborted) { try { controller.abort(new Error(reason)); } catch (_) { controller.abort(); } } };
      let settled = false, onCancel = null;
      // Çağıran sinyali: bekleme de anında bırakılır (sağlam olmayan sağlayıcılarda
      // `within` kalkanı yine de son sözü söyler).
      const external = signal ? new Promise((_, reject) => {
        onCancel = () => { drop('batch-aborted'); if (!settled) reject(new Error('batch-aborted')); };
        signal.addEventListener('abort', onCancel, { once: true });
      }) : null;
      const timeoutTimer = setTimeout(() => drop('provider-timeout'), timeoutMs);
      try {
        const running = within(provider.resolve({ ...args, onSources: emit, signal: controller.signal }), timeoutMs);
        const sources = await (external ? Promise.race([running, external]) : running);
        emit(sources);
        results[index] = { provider: provider.id, sources: collected };
        diagnose({ provider: provider.id, stage: 'provider', state: collected.length ? 'resolved' : 'empty', ms: Date.now() - start });
      } catch (error) {
        results[index] = { provider: provider.id, sources: collected, error: error.message };
        diagnose({ provider: provider.id, stage: 'provider', state: 'failed', reason: error.message, ms: Date.now() - start });
      } finally {
        settled = true;
        clearTimeout(timeoutTimer);
        if (signal && onCancel) signal.removeEventListener('abort', onCancel);
        drop('provider-finished'); // artık kimse bu sağlayıcı adına ağa dokunmasın
        accepting = false;
      }
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, Math.min(8, concurrency, providers.length)) }, worker));
  await Promise.allSettled(publications);
  return results;
}
