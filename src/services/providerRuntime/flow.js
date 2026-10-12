import { isStrictMediaTitleMatch } from '../mediaMatcher.js';
import { directMediaUrl } from './contract.js';

const OPERATIONS = new Set(['request', 'links', 'select', 'extract', 'emit']);
function read(state, path) {
  let value = state;
  for (const key of path.split('.')) {
    if (['__proto__', 'constructor', 'prototype'].includes(key)) throw new TypeError('Invalid flow path');
    value = value?.[key];
  }
  return value;
}
function template(value, state) {
  return String(value || '').replace(/\{\{([\w.]+)(:url)?\}\}/g, (_, path, encode) => {
    const resolved = read(state, path) ?? '';
    return encode ? encodeURIComponent(String(resolved)) : String(resolved);
  });
}
function text(value) {
  return String(value || '').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
}
export function validateFlow(flow) {
  if (flow?.format !== 'cinepulse-flow/1' || !/^[a-z][a-z0-9_-]*$/.test(flow.id || '')) throw new TypeError('Invalid flow format or id');
  if (!Array.isArray(flow.steps) || flow.steps.length < 1 || flow.steps.length > 24) throw new TypeError('Invalid flow step count');
  for (const step of flow.steps) {
    if (!OPERATIONS.has(step.op) || !/^[a-z][a-zA-Z0-9_]*$/.test(step.save || 'result')) throw new TypeError(`Invalid flow operation: ${step.op}`);
  }
  return flow;
}

/** Declarative provider language. No eval, generated JavaScript, or remote server. */
export async function runProviderFlow(flow, args, { request = fetch, extract, diagnose = () => {}, timeoutMs = 25000 } = {}) {
  validateFlow(flow);
  if (!flow.mediaTypes?.includes(args.type)) return [];
  const state = { ...args, base: flow.baseUrl, output: [] };
  const deadline = Date.now() + timeoutMs;
  for (const step of flow.steps) {
    if (Date.now() >= deadline) throw new Error('flow-timeout');
    const started = Date.now(); let result;
    try {
      if (step.op === 'request') {
        const url = template(step.url, state);
        const headers = Object.fromEntries(Object.entries(step.headers || {}).map(([key, value]) => [key, template(value, state)]));
        const response = await request(url, { method: step.method || 'GET', headers, ...(step.body ? { body: template(step.body, state) } : {}), signal: AbortSignal.timeout(Math.max(1, deadline - Date.now())) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const html = await response.text();
        if (html.length > 2 * 1024 * 1024) throw new Error('flow-response-limit');
        if (/just a moment|challenge-platform|enable javascript and cookies/i.test(html.slice(0, 6000))) throw new Error('challenge');
        result = { url: response.url || url, html };
      } else if (step.op === 'links') {
        const page = read(state, step.from); if (!page?.html) throw new Error('missing-page');
        result = [...page.html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].slice(0, 2000).map(match => ({
          url: new URL(text(match[1]), page.url).href, title: text(match[2]),
        })).filter(link => /^https?:\/\//i.test(link.url) && (!step.pathIncludes || link.url.includes(step.pathIncludes)));
      } else if (step.op === 'select') {
        const candidates = read(state, step.from) || [];
        result = candidates.find(candidate => isStrictMediaTitleMatch(candidate.title, [state.title, state.originalTitle, ...(state.titles || [])].filter(Boolean)));
        if (!result) throw new Error('title-not-found');
      } else if (step.op === 'extract') {
        if (!extract) throw new Error('extractor-unavailable');
        result = await extract(template(step.url, state), template(step.referer, state));
        if (!result?.url || result.isIframe) throw new Error('direct-media-not-found');
      } else if (step.op === 'emit') {
        const source = read(state, step.from);
        if (!source || (!directMediaUrl(source.url) && !source.isHls && !source.isDirectVideo)) throw new Error('non-media-output');
        state.output.push({ ...source, id: `${flow.id}_${state.output.length}`, provider: flow.id, name: flow.name || flow.id,
          streamUrl: source.url, isIframe: false, isDirectVideo: true });
        result = source;
      }
      state[step.save || 'result'] = result;
      diagnose({ provider: flow.id, stage: step.op, state: 'ok', ms: Date.now() - started });
    } catch (error) {
      diagnose({ provider: flow.id, stage: step.op, state: 'failed', reason: error.message, ms: Date.now() - started });
      throw error;
    }
  }
  return state.output;
}
