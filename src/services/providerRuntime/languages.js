import { normalizeStream } from './contract.js';

/** Publish each language as soon as it resolves; one failed lane cannot erase the other. */
export async function resolveLanguageLanes(resolve, options, { provider, split = false, onSources = () => {} } = {}) {
  const output = [];
  const lanes = split ? [false, true] : [undefined];
  await Promise.allSettled(lanes.map(async isDub => {
    const sources = await resolve(isDub === undefined ? options : { ...options, isDub });
    const normalized = (sources || []).map((source, index) => normalizeStream({
      ...source, category: source.category || (isDub === undefined ? undefined : isDub ? 'dubbed' : 'subtitled')
    }, { provider, index })).filter(Boolean);
    output.push(...normalized);
    if (normalized.length) onSources(normalized);
  }));
  return output;
}
