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

  /** TEK sağlayıcıyı iz (trace) ile çöz. Kaynak: tek kayıt defteri KAYIT
   *  (id ile `hdfc`/`slc`… ya da kod adıyla `orion`/`lyra`…). Burada elle
   *  tutulan ikinci liste, dosya silinince build'i kırmıştı. */
  window.__cpSag = async (id, args = {}) => {
    const { KAYIT } = await import('../providers/index.js');
    let yukle = KAYIT[id];
    if (!yukle) {
      for (const fn of Object.values(KAYIT)) {
        const mod = await fn().catch(() => null);
        if (mod && String(mod.default?.name || '').toLowerCase() === String(id).toLowerCase()) { yukle = fn; break; }
      }
    }
    if (!yukle) return { hata: `bilinmeyen saglayici: ${id}`, kayitli: Object.keys(KAYIT) };
    const t0 = Date.now();
    try {
      const m = await yukle();
      if (typeof m.coz !== 'function') return { hata: 'coz yok' };
      const r = await m.coz(args);
      return { id, ms: Date.now() - t0, n: (r.sources || []).length,
        kaynaklar: (r.sources || []).map((s) => ({ ad: s.displayName, url: String(s.streamUrl || '').slice(0, 130), kat: s.category, hls: !!s.isHls, iframe: !!s.isIframe, altyazi: (s.subtitles || []).length })),
        iz: r.trace || [], iframe: r.iframe || '' };
    } catch (e) {
      return { id, ms: Date.now() - t0, hata: String(e && e.stack || e).slice(0, 300) };
    }
  };

  /**
   * @param {{title:string,type?:string,season?:number,episode?:number,year?:number,tmdbId?:number,imdbId?:string,anime?:boolean,sure?:number,signal?:AbortSignal}} o
   *   `signal`: DEVTEST tanılama panelinin 35 sn'lik bütçesi — iptal edilince
   *   sıradaki sağlayıcılar hiç başlamaz, yarım kalanlar bırakılır, kısım kayıt döner.
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
    const msHaritasi = new Map(); // saglayici -> cozum suresi (tanilama tablosu icin)
    const bas = Date.now();
    const sonuc = await runProviderBatch(tanimlar, {
      type: mediaType, title: o.title, originalTitle: o.originalTitle || o.title,
      titles: o.titles || [o.title], year: o.year, tmdbId: o.tmdbId, imdbId: o.imdbId,
      season: o.season, episode: o.episode
    }, {
      concurrency: o.esZamanli ? 8 : 4,
      timeoutMs: o.sure || 30000,
      signal: o.signal || null,
      diagnose: (e) => {
        if (typeof e?.ms === 'number') msHaritasi.set(e.provider, e.ms);
        olaylar.push({ ...e, t: Date.now() - bas });
      },
      onResult: ({ provider, sources }) => {
        olaylar.push({ provider, stage: 'onResult', state: 'published', n: sources.length, t: Date.now() - bas,
          ornek: sources.slice(0, 2).map((s) => ({ id: s.id, url: String(s.streamUrl || s.url || '').slice(0, 120), kat: s.category, iframe: Boolean(s.isIframe || s.isPageEmbed) })) });
      }
    });

    // IPTAL'DA siradaki saglayicilar hic baslamadigi icin sonuc dizisinde bosluk
    // kalir (runProviderBatch worker'i erken doner); `filter(Boolean)` olmadan
    // yarim kalan tarama kaydindan once patlardik.
    const satirlar = sonuc.filter(Boolean);
    const ozet = satirlar.map((r) => ({
      id: r.provider,
      ms: Number.isFinite(msHaritasi.get(r.provider)) ? msHaritasi.get(r.provider) : null,
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
      gecen_ms: Date.now() - bas, saglayici: ozet.length, kaynak: satirlar.reduce((a, r) => a + (r.sources || []).length, 0),
      iptal: Boolean(o.signal && o.signal.aborted), ozet, olaylar };
    KAYITLAR.push(kayit);
    return kayit;
  };
  return true;
}
