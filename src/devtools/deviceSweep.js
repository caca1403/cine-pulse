/* ==========================================================================
   Cihaz içi sağlayıcı ölçüm kancası — YALNIZCA geliştirme derlemesinde.
   Vite `VITE_DEVICE_SWEEP=1` verilmediği sürece bu modül pakete girmez.
   Uygulamanın GERÇEK kod yolunu (listProviderDefinitions + runProviderBatch)
   cihazın kendi ağından çalıştırır; sonucu CDP ile okuruz.
   ========================================================================== */
import { listProviderDefinitions } from '../services/providerRuntime/inventory.js';
import { runProviderBatch } from '../services/providerRuntime/batch.js';
import { isPluginEnabled } from '../services/pluginCatalog.js';

const KAYITLAR = [];

export function kurSweep() {
  window.__cpSweepKayitlar = () => KAYITLAR;

  /**
   * @param {{title:string,type?:string,season?:number,episode?:number,year?:number,tmdbId?:number,imdbId?:string,anime?:boolean,sure?:number}} o
   */
  window.__cpSweep = async (o = {}) => {
    KAYITLAR.length = 0;
    const type = o.type || 'tv';
    const mediaType = type === 'movie' ? 'movie' : 'tv';
    const anime = Boolean(o.anime);
    const tanimlar = listProviderDefinitions()
      .filter((p) => !p.experimental && isPluginEnabled(p.id) &&
        (p.mediaTypes.includes(mediaType) || (anime && p.mediaTypes.includes('anime'))))
      .map((p) => ({ ...p, resolve: p.resolve }));

    const olaylar = [];
    const bas = Date.now();
    const sonuc = await runProviderBatch(tanimlar, {
      type: mediaType, title: o.title, originalTitle: o.originalTitle || o.title,
      titles: o.titles || [o.title], year: o.year, tmdbId: o.tmdbId, imdbId: o.imdbId,
      season: o.season, episode: o.episode
    }, {
      concurrency: o.esZamanli ? 8 : 4,
      timeoutMs: o.sure || 30000,
      diagnose: (e) => { olaylar.push({ ...e, t: Date.now() - bas }); },
      onResult: ({ provider, sources }) => {
        olaylar.push({ provider, stage: 'onResult', state: 'published', n: sources.length, t: Date.now() - bas,
          ornek: sources.slice(0, 2).map((s) => ({ id: s.id, url: String(s.streamUrl || s.url || '').slice(0, 120), kat: s.category, iframe: Boolean(s.isIframe || s.isPageEmbed) })) });
      }
    });

    const ozet = sonuc.map((r) => ({
      id: r.provider,
      n: (r.sources || []).length,
      hata: r.error || null,
      kat: [...new Set((r.sources || []).map((s) => s.category))].join('+'),
      ornek: (r.sources || []).slice(0, 3).map((s) => ({
        ad: s.displayName || s.name || '',
        url: String(s.streamUrl || s.url || '').slice(0, 150),
        iframe: Boolean(s.isIframe || s.isPageEmbed), hls: Boolean(s.isHls), direct: Boolean(s.isDirectVideo)
      }))
    }));
    const kayit = { baslik: o.title, tur: mediaType, sezon: o.season, bolum: o.episode,
      gecen_ms: Date.now() - bas, saglayici: ozet.length, kaynak: sonuc.reduce((a, r) => a + (r.sources || []).length, 0), ozet, olaylar };
    KAYITLAR.push(kayit);
    return kayit;
  };
  return true;
}
