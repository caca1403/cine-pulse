/** Bounded provider scheduling shared by app and CLI. */
export async function runProviderBatch(providers, args, { concurrency = 4, onResult = () => {}, diagnose = () => {} } = {}) {
  const results = new Array(providers.length);
  let cursor = 0;
  async function worker() {
    while (cursor < providers.length) {
      const index = cursor++, provider = providers[index];
      const start = Date.now();
      try {
        const sources = await provider.resolve(args);
        results[index] = { provider: provider.id, sources: sources || [] };
        await onResult(results[index]);
        diagnose({ provider: provider.id, stage: 'provider', state: sources?.length ? 'resolved' : 'empty', ms: Date.now() - start });
      } catch (error) {
        results[index] = { provider: provider.id, sources: [], error: error.message };
        diagnose({ provider: provider.id, stage: 'provider', state: 'failed', reason: error.message, ms: Date.now() - start });
      }
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, Math.min(8, concurrency, providers.length)) }, worker));
  return results;
}
