/* ==========================================================================
   Cihaz içi sağlayıcı ölçüm kancası — YALNIZCA geliştirme derlemesinde.
   Vite `VITE_DEVICE_SWEEP=1` verilmediği sürece bu modül pakete girmez.
   Uygulamanın GERÇEK kod yolunu (listProviderDefinitions + runProviderBatch)
   cihazın kendi ağından çalıştırır; sonucu CDP ile okuruz.
   ========================================================================== */
import { listProviderDefinitions } from '../services/providerRuntime/inventory.js';
import { runProviderBatch } from '../services/providerRuntime/batch.js';
import { isPluginEnabled, getPluginDisplay } from '../services/pluginCatalog.js';
import { probeStream } from '../services/providerRuntime/probe.js';

const KAYITLAR = [];

export function kurSweep() {
  window.__cpSweepKayitlar = () => KAYITLAR;
  window.__cpProviders = () => listProviderDefinitions().map(p => ({ id: p.id, name: getPluginDisplay(p).alias, mediaTypes: p.mediaTypes, enabled: isPluginEnabled(p.id), experimental: Boolean(p.experimental) }));

  /** TEK sağlayıcıyı iz (trace) ile çöz. Kaynak: tek kayıt defteri KAYIT
   *  (id ile `hdfc`/`slc`… ya da kod adıyla `orion`/`lyra`…). Burada elle
   *  tutulan ikinci liste, dosya silinince build'i kırmıştı. */
  window.__cpSag = async (id, args = {}) => {
    // Ölçüm kancası: yeni çağrı öncekini İPTAL eder (yarım kalan işler kuyruğu
    // işgal edip sonraki sağlayıcıları blokuyordu) ve akış boyunca CANLI durum
    // tutar — zaman aşımında bile o ana kadar gelen kaynaklar görülür.
    if (window.__cpSagCtl) { try { window.__cpSagCtl.abort(); } catch (_) {} }
    const ctl = new AbortController();
    window.__cpSagCtl = ctl;
    const iptal = AbortSignal && AbortSignal.any
      ? AbortSignal.any([ctl.signal, args.signal].filter(Boolean))
      : (args.signal || ctl.signal);
    window.__cpSagCanli = { id, n: 0, t: Date.now() };
    let canliToplam = 0;
    const canliSar = (def) => ({ ...def, async resolve(input) {
      const ust = input.onSources;
      return def.resolve({ ...input, onSources: (liste) => {
        canliToplam += (liste || []).length;
        window.__cpSagCanli = { id, n: canliToplam, t: Date.now(),
          ornek: (liste || []).slice(0, 2).map((s) => ({ ad: s.displayName || s.name, u: String(s.streamUrl || s.url || '').slice(0, 90) })) };
        ust?.(liste);
      } });
    } });
    const { KAYIT } = await import('../providers/index.js');
    let yukle = KAYIT[id];
    if (!yukle) {
      for (const fn of Object.values(KAYIT)) {
        const mod = await fn().catch(() => null);
        if (mod && String(mod.default?.name || '').toLowerCase() === String(id).toLowerCase()) { yukle = fn; break; }
      }
    }
    const adapter = listProviderDefinitions().find(p => p.id === id || getPluginDisplay(p).alias.toLowerCase() === String(id).toLowerCase());
    if (!yukle && !adapter) return { hata: `bilinmeyen saglayici: ${id}`, kayitli: listProviderDefinitions().map(p => p.id) };
    const t0 = Date.now();
    try {
      let trace = [];
      const module = yukle ? await yukle() : null;
      const definition = module && typeof module.coz === 'function' ? {
        id,
        async resolve(input) {
          const r = await module.coz(input);
          trace = r.trace || [];
          return r.sources || [];
        },
      } : adapter;
      if (!definition) return { hata: 'coz yok' };
      const events = [];
      const [result] = await runProviderBatch([canliSar(definition)], args, {
        timeoutMs: Math.min(30000, Math.max(1000, Number(args.timeoutMs) || 30000)),
        signal: iptal,
        diagnose: e => events.push(e),
      });
      const sources = result?.sources || [];
      const probes = [];
      if (args.probe) {
        for (const source of sources.slice(0, 2)) {
          probes.push({ id: source.id, ...await probeStream(source, { timeoutMs: 6000 }) });
        }
      }
      let diagnostics = null;
      if ((adapter?.id || id) === 'tvr') diagnostics = { ...(await import('../services/rectvService.js')).rectvTani };
      return { id, ms: Date.now() - t0, n: sources.length, hata: result?.error || null, iptal: iptal.aborted,
        kaynaklar: sources.map((s) => ({ ad: s.displayName, url: String(s.streamUrl || '').slice(0, 130), kat: s.category, hls: !!s.isHls, iframe: !!s.isIframe, altyazi: (s.subtitles || []).length })),
        iz: trace, olaylar: events, probes, diagnostics };
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
