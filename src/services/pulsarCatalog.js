/* ==========================================================================
   CinePulse Studio — P2P KATALOG Şeridi (PULSAR)
   Ölçüm kaynağı: torrent hazırlık araştırması (2026-10-15, canlı 14 istek):
     • torrentio.strem.fun/stream/...json → 0,27-0,33 sn, anonim, anahtarsız.
     • Satırlarda OYNATILABİLİR video yok (infoHash yalnız; P2P motoru
       uygulamada yok — webtor 403/Bearer, btorrent istemci-taraflı; ölçüldü).
     • "TR dublaj" iddiası ÖLÇÜLMEDİ: 🇹🇷 bayrağı çok-dilli sürümlerin
       ALTYAZI listesi; `Dual` token'ı yalancı pozitif (8/9, 9/11) → kapıda
       KULLANILMAZ. Kesin kapı: 🇹🇷|TURK|DUBLAJ|TR Dub|Türkçe.
   DÜRÜST SÖZLEŞME (ölü kaynak kuralının uygulanması):
     • satır = salt katalog: isCatalogOnly:true, autoPlayable:false,
       streamUrl BOŞ (magnet streamUrl DEĞİLDİR — PlayerModal onu iframe'e
       basardı; dokunma = harici eylem: openMagnet köprüsü / panoya kopyala).
     • rozet: "⚡ P2P kataloğu · 👤N · 💾boyut · 🇹🇷 altyazı dili" —
       "TR Dublaj" ASLA yazılmaz (ölçüm desteklemiyor).
     • arayüzde site adı yok: "Pulsar" kod adı.
   ========================================================================== */

const PULSAR_UA = 'Mozilla/5.0';

/** Katalog JSON → satır listesi (saf; test edilebilir). cap: en çok satır. */
export function katalogSatirlari(json, { cap = 10, seedMin = 1 } = {}) {
  let veri = null;
  try { veri = JSON.parse(json); } catch (_) { return []; }
  const streams = Array.isArray(veri?.streams) ? veri.streams : [];
  const out = [];
  for (const s of streams) {
    const hash = String(s?.infoHash || '').toLowerCase();
    if (!/^[0-9a-f]{40}$/.test(hash)) continue;
    const satirlar = String(s?.title || '').split('\n');
    const ad = String(s?.name || '').split('\n')[1]?.trim() || satirlar[0]?.trim() || '';
    const dosya = satirlar[1]?.trim() || '';
    const tek = `${ad} ${satirlar.join(' ')}`;
    // KESİN TR kapısı — `Dual` yok (yalancı pozitif ölçüldü).
    if (!/🇹🇷|TURK|DUBLAJ|TR Dub|Türkçe/i.test(tek)) continue;
    const seed = parseInt((satirlar.join(' ').match(/👤\s*(\d+)/) || [])[1] || '0', 10);
    if (seed < seedMin) continue;
    const boyut = (satirlar.join(' ').match(/💾\s*([0-9][0-9.,]*\s*[KMGT]?B)/i) || [])[1] || '';
    out.push({
      id: `pulsar_${hash.slice(0, 12)}_${s?.fileIdx ?? 0}`,
      ad: `Pulsar · ${ad || dosya}`.slice(0, 90),
      aciklama: [seed ? `👤 ${seed}` : '', boyut ? `💾 ${boyut}` : '', '🇹🇷 altyazı'].filter(Boolean).join('  '),
      streamUrl: '',
      magnet: `magnet:?xt=urn:btih:${hash}&as=1`,
      kategori: 'subtitled',
      isCatalogOnly: true,
      autoPlayable: false,
      isTorrent: true,
      kalite: /\d{3,4}p|[4k]\b/i.exec(ad)?.[0]?.toUpperCase() || '',
      _seed: seed,
    });
  }
  return out.sort((a, b) => b._seed - a._seed).slice(0, cap);
}

/** İmdbId'den salt-katalog satırları (Pulsar). Hata/ağsız → [] (sessiz). */
export async function fetchPulsarCatalogRows({
  imdbId = null,
  type = 'movie',
  season = 1,
  episode = 1,
  timeoutMs = 7000,
} = {}) {
  const tt = String(imdbId || '').match(/^tt\d{6,8}$/i)?.[0];
  if (!tt) return [];
  const s = parseInt(season, 10) || 1;
  const e = parseInt(episode, 10) || 1;
  const yol = type === 'movie' ? `stream/movie/${tt}.json` : `stream/series/${tt}:${s}:${e}.json`;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const r = await fetch(`https://torrentio.strem.fun/${yol}`, {
      headers: { 'User-Agent': PULSAR_UA, Accept: 'application/json' },
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!r.ok) return [];
    return katalogSatirlari(await r.text());
  } catch (_) {
    return [];
  }
}
