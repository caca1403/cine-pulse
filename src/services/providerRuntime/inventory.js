import { resolveLanguageLanes } from './languages.js';
import { SITES, siteListesi } from '../siteProviders.js';
import { PLUGIN_DEFS } from '../pluginCatalog.js';
import { normalizeStream } from './contract.js';
import { KAYIT as TEMIZ_KAYIT, saglayiciYukle } from '../../providers/index.js';

/* Temiz sağlayıcısı olan id'ler burada TUTULMAZ: src/providers/index.js (KAYIT)
   kazanır; ölü scraper demeti sadece kafa karıştırırdı.
   Kaldırılan satırlar: slc/Lyra, fhdf/Sirius, dzy/Echo, jet/Nimbus,
   sinemacc/Halcyon, fm/Arcturus (scraper DOSYALARI duruyor — silme ayrı iş). */
/* YALNIZCA temiz sağlayıcısı OLMAYAN id'ler burada durur. Temiz sağlayıcısı
   olan her id (`src/providers/index.js` KAYIT) buradan SİLİNİR — iki kayıt
   defteri çift bakım + çift çağrı üretiyordu. Silinen satırlar: hdfc/Orion,
   dzb/Nero, dizi77/Corvus, anizium/Aria, animecix/Tera, slc/Lyra, fhdf/Sirius,
   dzy→dyu/Echo, jet/Nimbus, sinemacc/Halcyon, fm/Arcturus, dzs/Atlas, fxs/Vela;
   dosyası silinen ölü satırlar: dzl, wtz, szd, snx, dyu(diziyou), hdfb, dizibox,
   fxs(filmekseniScraper). */
const MODULES = {
  // dzs: temiz sağlayıcısı (Atlas) KAYIT'ta var → burada durmaz (kural: temiz
  // olan kazanır; buradaki satır ölü dizisolScraper yolunu "sağlarmış" gösteriyordu).
  tvr: ['rectvService', 'fetchRecTvSources'],
  lookmovie: ['lookmovieScraper', 'fetchOfficialLookMovieSources'],
  smashy: ['smashyStreamService', 'fetchSmashyStreamSources'],
  animetr: ['animeTrScraper', 'fetchAnimeTrSources'],
  kidsvip: ['kidsVipScraper', 'fetchKidsVipMovieSources', 'fetchKidsVipSources'],
  dramalar: ['dramalarScraper', null, 'fetchDramalarEpisodeSources'],
  dramadizilerim: ['dramaDizilerimScraper', null, 'fetchDramaDizilerimEpisodeSources'],
  torrent: ['torrentStreamService', 'fetchTorrentStreamSources'],
  vodm3u: ['vodM3uSources', 'fetchVodSources'],
};
export const SITE_PLUGIN_IDS = {
  hdfilmcehennemi: 'hdfc', selcukflix: 'slc', filmekseni: 'fxs',
  vidy: 'vidy', hdplayersystem: 'hdps', ksdpictures: 'ksd', pichive: 'pichive',
  vidload: 'vidload', vixolity: 'vixolity', tauvideo: 'tauvideo', pilavyerplay: 'pilavyer',
  nxsha: 'nxsha', vidmolyNet: 'vidmoly', searchPhp: 'sphp', keywordSearch: 'kwsearch',
  ajaxSearch: 'ajax', filmDiziList: 'filmdizi', rplayerVideo: 'rplayer',
  dizify: 'dzyf', hdfilmdelisi: 'hdfd', dortkhd: 'd4kh', zenit: 'twoembed',
  vidlink: 'vidlk', dizipal: 'dzp', asyaanimeleri: 'asy',
};
const TYPE = { film: 'movie', dizi: 'tv', anime: 'anime', cocuk: 'tv', belgesel: 'tv', 'kisa-dizi': 'tv' };
// `cocuk` ve `belgesel` tür anahtarları her iki içerik biçimine de açılır:
// çizgi film/belgesel hem film hem dizi olarak yayımlanır; tek türe sabitlemek
// sağlayıcıyı ya filmlerden ya dizilerden tümüyle düşürürdü.
const MEDIA_ACIK_TURLER = ['cocuk', 'belgesel'];
const providerMap = new Map();
const plugins = [...PLUGIN_DEFS];
for (const [site, id] of Object.entries(SITE_PLUGIN_IDS)) {
  if (!plugins.some(plugin => plugin.id === id)) plugins.push({ id, kinds: SITES[site].tur, experimental: true });
}
for (const plugin of plugins) {
  const tuple = MODULES[plugin.id];
  const sites = Object.keys(SITE_PLUGIN_IDS).filter(site => SITE_PLUGIN_IDS[site] === plugin.id);
  providerMap.set(plugin.id, {
    apiVersion: 1, id: plugin.id, name: plugin.id,
    mediaTypes: plugin.kinds.some(kind => MEDIA_ACIK_TURLER.includes(kind)) ? ['movie', 'tv'] : [...new Set(plugin.kinds.map(type => TYPE[type]).filter(Boolean))],
    adapter: tuple ? 'javascript' : 'site', sites, experimental: Boolean(plugin.experimental),
    async resolve(args) {
      const options = { ...args, title: args.title || '', seriesTitle: args.title || '',
        titles: args.titles || [args.title, args.originalTitle].filter(Boolean), mediaType: args.type };
      const output = [];
      // Temiz sağlayıcı (varsa) tek başına yeterlidir.
      const temiz = TEMIZ_SAGLAYICILAR[plugin.id];
      if (temiz) {
        try {
          const mod = await temiz();
          const kaynaklar = await resolveLanguageLanes(mod.default.resolve, options, {
            provider: plugin.id,
            split: ['anizium', 'animecix'].includes(plugin.id),
            onSources: args.onSources,
          });
          const bulunan = (kaynaklar || []).map((raw, index) => normalizeStream(raw, { provider: plugin.id, index })).filter(Boolean);
          if (bulunan.length) args.onSources?.(bulunan);
          return bulunan;
        } catch (error) {
          throw new Error(`temiz sağlayıcı hatası (${plugin.id}): ${error.message}`);
        }
      }
      if (tuple) {
        const module = await import(`../${tuple[0]}.js`);
        const fnName = args.type === 'movie' ? tuple[1] : tuple[2] || tuple[1];
        if (fnName && typeof module[fnName] !== 'function') throw new Error(`Invalid adapter export: ${plugin.id}/${fnName}`);
        if (fnName) {
          const splitLanguage = ['szd', 'dzy', 'dzb', 'jet', 'snx', 'anizium', 'animecix', 'animetr', 'kidsvip', 'dramalar', 'dramadizilerim'].includes(plugin.id);
          output.push(...await resolveLanguageLanes(module[fnName], options, {
            provider: plugin.id, split: splitLanguage, onSources: args.onSources
          }));
        }
      }
      if (!output.length) for (const site of sites) {
        const found = (await siteListesi(site, options)).map((raw, index) => normalizeStream(raw, { provider: plugin.id, index })).filter(Boolean);
        output.push(...found);
        if (found.length) args.onSources?.(found);
      }
      return output.map((raw, index) => normalizeStream(raw, { provider: plugin.id, index })).filter(Boolean);
    }
  });
}
export function listProviderDefinitions() { return [...providerMap.values()]; }
export function getProviderDefinition(id) { return providerMap.get(id); }

/**
 * Temiz (sıfırdan yazılmış) sağlayıcılar — Patron/Nuvio akışının elle
 * yazılmış karşılığı. TEK KAYIT DEFTERİ: src/providers/index.js (KAYIT).
 * Burada ikinci bir liste TUTULMAZ — iki liste birbirinden sapıyordu.
 * IFRAME YOK: yalnızca bizim oynatıcımızda oynayan kaynaklar üretilir.
 */
const TEMIZ_SAGLAYICILAR = Object.fromEntries(
  Object.keys(TEMIZ_KAYIT).map((id) => [id, () => saglayiciYukle(id)]),
);

/** Devre dışı sağlayıcılar (eski, üst üste yığılmış kod yolları).
 *  setf (Vega) artık burada tutulmuyor: katalog satırı, alias'ı ve site bağları
 *  tamamen kaldırıldı (yayın adresleri sunucuda 404 dönüyordu). */
const DEVRE_DISI = new Set(['szd']);

for (const id of DEVRE_DISI) providerMap.delete(id);
export async function checkProviderAdapters() {
  const issues = [];
  for (const [id, [file, ...names]] of Object.entries(MODULES)) {
    try {
      const module = await import(`../${file}.js`);
      for (const name of names.filter(Boolean)) if (typeof module[name] !== 'function') issues.push(`${id}: missing ${name}`);
    } catch (error) { issues.push(`${id}: ${error.message}`); }
  }
  // Bilinçli olarak kapatılmış sağlayıcı (DEVRE_DISI) kasıtlı olarak haritada
  // yok → "eksik bağ" sayılmaz; geri kalan her site bağı doğrulanır.
  for (const [site, id] of Object.entries(SITE_PLUGIN_IDS)) {
    if (DEVRE_DISI.has(id)) continue;
    if (!SITES[site] || !providerMap.has(id)) issues.push(`Missing site binding: ${site}/${id}`);
  }
  return issues;
}
