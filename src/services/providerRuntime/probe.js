import { unwrapStreamUrl } from './contract.js';

async function readPrefix(response, limit = 65536) {
  const reader = response.body.getReader();
  const pieces = []; let size = 0;
  try {
    while (size < limit) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = value.subarray(0, limit - size); pieces.push(chunk); size += chunk.byteLength;
    }
  } finally { await reader.cancel().catch(() => {}); }
  const output = new Uint8Array(size); let offset = 0;
  for (const piece of pieces) { output.set(piece, offset); offset += piece.length; }
  return output;
}

/** A successful manifest alone is insufficient: also fetch the first segment and AES key. */
export async function probeStream(source, { fetcher = fetch, timeoutMs = 10000 } = {}) {
  let url = unwrapStreamUrl(source.rawStreamUrl || source.streamUrl || source.url);
  const headers = { ...source.headers };
  const fetchPrefix = async (target, range = true) => {
    const response = await fetcher(target, { headers: { ...headers, ...(range ? { Range: 'bytes=0-65535' } : {}) }, signal: AbortSignal.timeout(timeoutMs) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const bytes = await readPrefix(response);
    if (!bytes.length) throw new Error('empty-media');
    const text = new TextDecoder().decode(bytes);
    if (/^\s*(?:<!doctype html|<html|<\?xml)/i.test(text) || /just a moment|challenge-platform/i.test(text.slice(0, 2000))) throw new Error('html-instead-of-media');
    return { response, bytes, text };
  };
  try {
    for (let depth = 0; depth < 4; depth++) {
      const loaded = await fetchPrefix(url);
      if (loaded.text.trimStart().startsWith('#EXTM3U')) {
        const lines = loaded.text.split(/\r?\n/);
        const first = lines.find(line => line.trim() && !line.startsWith('#'));
        if (!first) throw new Error('empty-playlist');
        const child = new URL(first.trim(), loaded.response.url || url).href;
        if (lines.some(line => line.startsWith('#EXT-X-STREAM-INF'))) { url = child; continue; }
        const key = /#EXT-X-KEY:[^\n]*METHOD=AES-128[^\n]*URI="([^"]+)"/.exec(loaded.text);
        if (key) {
          const loadedKey = await fetchPrefix(new URL(key[1], loaded.response.url || url).href, false);
          if (loadedKey.bytes.length !== 16) throw new Error('invalid-aes-key');
        }
        const segment = await fetchPrefix(child);
        return { state: 'transport-verified', format: 'hls', bytes: segment.bytes.length, checks: ['playlist', ...(key ? ['aes-key'] : []), 'segment'] };
      }
      const mime = loaded.response.headers.get('content-type') || '';
      if (/image\/|application\/json|text\/html/.test(mime)) throw new Error('not-media');
      const mp4 = loaded.bytes.length > 12 && ['ftyp', 'styp', 'moof'].includes(new TextDecoder().decode(loaded.bytes.slice(4, 8)));
      const ebml = loaded.bytes[0] === 0x1a && loaded.bytes[1] === 0x45 && loaded.bytes[2] === 0xdf && loaded.bytes[3] === 0xa3;
      const ts = loaded.bytes[0] === 0x47 && loaded.bytes[188] === 0x47;
      if (!mp4 && !ebml && !ts && !/^video\//i.test(mime)) throw new Error('unknown-media-bytes');
      return { state: 'transport-verified', format: ebml ? 'mkv' : mp4 ? 'mp4' : 'video', bytes: loaded.bytes.length, checks: ['media-range'] };
    }
    throw new Error('playlist-depth-limit');
  } catch (error) { return { state: 'failed', reason: error.message }; }
}
