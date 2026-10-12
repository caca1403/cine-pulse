#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { listProviderDefinitions, getProviderDefinition, checkProviderAdapters } from '../src/services/providerRuntime/inventory.js';
import { resolveDirectPlayback } from '../src/services/providerRuntime/playback.js';
import { extractEmbedStream } from '../src/services/embedExtractors.js';
import { runProviderFlow } from '../src/services/providerRuntime/flow.js';
import { probeStream } from '../src/services/providerRuntime/probe.js';
const exec = promisify(execFile);
const root = new URL('../', import.meta.url);
const routes = JSON.parse(readFileSync(new URL('android/app/src/main/assets/native-routes.json', root)));
const originalFetch = globalThis.fetch;
const network = [];

// The CLI uses the same upstreams and Python resolvers, without a hosting service.
globalThis.fetch = async (input, init = {}) => {
  let url = new URL(typeof input === 'string' ? input : input.url || String(input), 'http://127.0.0.1:4000');
  if (url.hostname.endsWith('.vercel.app')) throw new Error('remote-relay-disabled');
  if (url.hostname.endsWith('.workers.dev') && url.searchParams.has('url')) url = new URL(url.searchParams.get('url'));
  if (['127.0.0.1', 'localhost'].includes(url.hostname) && url.pathname.startsWith('/api/')) {
    const route = url.pathname.split('/')[2];
    if (route === 'resolve') {
      const params = Object.fromEntries(url.searchParams);
      const { stdout } = await exec(process.env.PYTHON_BIN || 'python3', [fileURLToPath(new URL('api/provider_cli.py', root)), '--params-json', JSON.stringify(params)], { timeout: 35000, maxBuffer: 5 * 1024 * 1024 });
      const payload = JSON.parse(stdout.trim());
      network.push({ host: `python:${params.provider}`, status: payload.success ? 200 : 422, reason: payload.error || '' });
      return Response.json(payload);
    }
    if (['proxy', 'hls_proxy', 'stream_proxy'].includes(route) && url.searchParams.has('url')) {
      init = { ...init, headers: { ...Object.fromEntries(new Headers(init.headers)), ...(url.searchParams.get('ref') ? { Referer: url.searchParams.get('ref') } : {}) } };
      url = new URL(url.searchParams.get('url'));
    } else if (routes[route]) {
      const config = routes[route];
      const sub = url.searchParams.get('path') || url.pathname.slice(`/api/${route}`.length);
      url.searchParams.delete('path');
      url = new URL(`${config.base}${sub.startsWith('/') || !sub ? sub : '/' + sub}${url.search}`);
      init = { ...init, headers: { ...config.headers, Referer: config.referer, ...Object.fromEntries(new Headers(init.headers)) } };
    } else return Response.json({ success: false, error: 'cli-route-unavailable', route }, { status: 501 });
  }
  const started = Date.now();
  try {
    const response = await originalFetch(url, init);
    network.push({ host: url.hostname, status: response.status, ms: Date.now() - started });
    return response;
  } catch (error) {
    network.push({ host: url.hostname, status: 0, reason: error.cause?.code || error.name, ms: Date.now() - started });
    throw error;
  }
};

const [command = 'help', ...args] = process.argv.slice(2);
const flags = {};
for (let index = 0; index < args.length; index++) {
  if (!args[index].startsWith('--')) continue;
  const key = args[index].slice(2);
  flags[key] = args[index + 1] && !args[index + 1].startsWith('--') ? args[++index] : true;
}
const emit = data => {
  const text = JSON.stringify(data, null, 2);
  if (flags.output) writeFileSync(String(flags.output), text + '\n');
  process.stdout.write(text + '\n');
};
const query = { title: flags.title || '', originalTitle: flags.original || '', type: flags.type || 'movie',
  season: Number(flags.season) || 1, episode: Number(flags.episode) || 1,
  tmdbId: flags.tmdb || '', imdbId: flags.imdb || '', isDub: flags.dub === true || flags.dub === 'true' };

async function resolveOne(provider) {
  const start = Date.now(), startNetwork = network.length;
  const diagnostics = [];
  if (!provider.mediaTypes.includes(query.type)) return { provider: provider.id, state: 'not-applicable' };
  try {
    const candidates = await provider.resolve(query);
    const streams = [];
    for (const raw of candidates) {
      const direct = await resolveDirectPlayback(raw, { extract: extractEmbedStream, diagnose: event => diagnostics.push(event), provider: provider.id, toPlaybackUrl: url => url });
      if (!direct || streams.some(stream => stream.url === direct.url)) continue;
      const verification = flags.check ? await probeStream(direct) : { state: 'unverified' };
      const { getUrl, ...serializable } = direct;
      streams.push({ ...serializable, verification });
    }
    return { provider: provider.id, state: streams.some(stream => stream.verification.state === 'transport-verified') ? 'transport-verified' : streams.length ? flags.check ? 'verification-failed' : 'resolved' : 'no-direct-media', ms: Date.now() - start, streams, diagnostics, network: network.slice(startNetwork) };
  } catch (error) { return { provider: provider.id, state: 'failed', reason: error.message, ms: Date.now() - start, diagnostics, network: network.slice(startNetwork) }; }
}

if (command === 'list') emit(listProviderDefinitions().map(({ resolve, ...definition }) => definition));
else if (command === 'doctor') {
  const issues = await checkProviderAdapters();
  emit({ providers: listProviderDefinitions().length, issues, state: issues.length ? 'failed' : 'valid', playbackVerified: false });
  if (issues.length) process.exitCode = 1;
} else if (command === 'resolve' || command === 'sweep') {
  if (!query.title && !query.tmdb) throw new Error('--title veya --tmdb gerekli');
  const definitions = command === 'resolve' ? [getProviderDefinition(flags.provider)] : listProviderDefinitions().filter(provider => !provider.experimental || flags.experimental);
  if (definitions.some(provider => !provider)) throw new Error('Geçersiz --provider');
  const results = [];
  // Sequential CLI probing keeps upstream load bounded and reports isolated.
  for (const provider of definitions) {
    process.stderr.write(`[cinepulse] ${provider.id}\n`);
    results.push(await resolveOne(provider));
    if (flags.output) writeFileSync(String(flags.output), JSON.stringify({ query, results }, null, 2) + '\n');
  }
  emit({ query, results, success: results.filter(result => result.state === 'transport-verified').length, playbackVerified: false });
  if (flags.check && results.some(result => !['transport-verified', 'not-applicable'].includes(result.state))) process.exitCode = 1;
} else if (command === 'flow') {
  if (!flags.file) throw new Error('--file gerekli');
  const flow = JSON.parse(readFileSync(String(flags.file)));
  emit(await runProviderFlow(flow, query, { extract: extractEmbedStream }));
} else if (command === 'extract') {
  const raw = { url: flags.url, isIframe: true };
  const stream = await resolveDirectPlayback(raw, { extract: extractEmbedStream, toPlaybackUrl: url => url });
  emit(stream ? { ...stream, verification: flags.check ? await probeStream(stream) : { state: 'unverified' } } : { state: 'no-direct-media' });
} else process.stdout.write(`CinePulse CLI\n  list\n  doctor\n  resolve --provider dzs --title "Başlangıç" --type movie --tmdb 27205 --check\n  sweep --title "Breaking Bad" --type tv --tmdb 1396 --season 1 --episode 1 --check --output report.json\n  extract --url https://example.com/player --check\n`);
