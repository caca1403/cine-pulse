/* ==========================================================================
   CinePulse - CanliTV (canlitv.you) kanal listesi
   280+ kanal, gunluk cache. Oynatma: officialLiveId ctv:<slug> uzerinden
   taze imzali m3u8'e 302 (mevcut live_tv_stream akisi).
   ========================================================================== */

import { apiUrl } from './apiOrigin.js';
import { resolveLocalLogo } from './iptvOrgChannels.js';

const LS_KEY = 'cp_canlitv_list_v3';
const TTL_MS = 24 * 60 * 60 * 1000;

function readCache() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.channels)) return null;
    if (Date.now() - (parsed.savedAt || 0) > TTL_MS) return null;
    return parsed.channels;
  } catch (_) {
    return null;
  }
}

function writeCache(channels) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ savedAt: Date.now(), channels }));
  } catch (_) {}
}

function endpoint() {
  const path = '/api/resolve?provider=ctv';
  if (typeof window !== 'undefined') {
    const host = window.location?.hostname || '';
    if (host === 'localhost' || host === '127.0.0.1') return path;
  }
  return apiUrl(path);
}

export function normalizeCanliName(name) {
  return String(name || '')
    .toLocaleUpperCase('tr-TR')
    .replace(/\b(?:HD|FHD|4K|KANALI)\b/g, '')
    .replace(/[^A-ZÇĞİÖŞÜ0-9]/g, '');
}

export function getCachedCanliChannels() {
  return readCache() || [];
}

export async function refreshCanliChannels() {
  try {
    const res = await fetch(endpoint(), { signal: AbortSignal.timeout(25000) }).catch(() => null);
    if (!res || !res.ok) return null;
    const data = await res.json().catch(() => null);
    const list = data && Array.isArray(data.channels) ? data.channels : null;
    if (!list || list.length === 0) return null;
    writeCache(list);
    return list;
  } catch (_) {
    return null;
  }
}

export function toLiveChannels(rawList, builtinNames = []) {
  const builtin = new Set((builtinNames || []).map(normalizeCanliName));
  const out = [];
  for (const c of rawList || []) {
    if (!c || !c.slug || !c.name) continue;
    // Yerlesik listede ayni isim varsa tekrari ekleme
    if (builtin.has(normalizeCanliName(c.name))) continue;
    out.push({
      id: `ctv_${c.slug}`,
      name: c.name,
      logo: resolveLocalLogo(c.name) || c.logo || '',
      category: c.category || 'canlitv',
      group: c.group || '',
      officialLiveId: `ctv:${c.slug}`,
      streamUrl: `/api/live_tv_stream?channel=ctv:${encodeURIComponent(c.slug)}`,
      quality: 'HD',
      playerId: c.playerId || String(c.logo || '').match(/\/(\d+)\.jpg/)?.[1] || '',
      canliTv: true
    });
  }
  return out;
}
