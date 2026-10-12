async function within(promise, timeoutMs) {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('provider-timeout')), timeoutMs);
  })]); } finally { clearTimeout(timer); }
}

/** Resolution and playback preparation have separate queues; neither language blocks discovery. */
export async function runProviderBatch(providers, args, { concurrency = 4, onResult = () => {}, diagnose = () => {}, timeoutMs = 30000 } = {}) {
  const results = new Array(providers.length), publications = [];
  let cursor = 0;
  async function worker() {
    while (cursor < providers.length) {
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
        collected.push(...fresh);
        publications.push(within(Promise.resolve().then(() => onResult({ provider: provider.id, sources: fresh })), timeoutMs)
          .catch(error => diagnose({ provider: provider.id, stage: 'prepare', state: 'failed', reason: error.message })));
      };
      try {
        const sources = await within(provider.resolve({ ...args, onSources: emit }), timeoutMs);
        emit(sources);
        results[index] = { provider: provider.id, sources: collected };
        diagnose({ provider: provider.id, stage: 'provider', state: collected.length ? 'resolved' : 'empty', ms: Date.now() - start });
      } catch (error) {
        results[index] = { provider: provider.id, sources: collected, error: error.message };
        diagnose({ provider: provider.id, stage: 'provider', state: 'failed', reason: error.message, ms: Date.now() - start });
      } finally { accepting = false; }
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, Math.min(8, concurrency, providers.length)) }, worker));
  await Promise.allSettled(publications);
  return results;
}
