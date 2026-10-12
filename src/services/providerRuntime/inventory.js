import { resolveLanguageLanes } from './languages.js';
import { SITES, siteListesi } from '../siteProviders.js';
import { PLUGIN_DEFS } from '../pluginCatalog.js';
import { normalizeStream } from './contract.js';

const MODULES = {
  hdfc: ['hdfilmcehennemiScraper', 'fetchHdfilmcehennemiSources'],
  setf: ['setfilmScraper', 'fetchSetfilmSources'],
  slc: ['selcukflixScraper', 'fetchSelcukflixSources'],
  dzl: ['dizillaScraper', 'fetchDizillaSources'],
  fhdf: ['fullhdfilmizleseneScraper', 'fetchFullhdfilmSources'],
  wtz: ['webteizleScraper', 'fetchWebteizleSources'],
  fxs: ['filmekseniScraper', 'fetchFilmekseniSources'],
  dzs: ['dizisolScraper', 'fetchDizisolMovieSources', 'fetchDizisolEpisodeSources'],
  snx: ['sinewixScraper', 'fetchSinewixSources'],
  szd: ['sezonlukDiziScraper', null, 'fetchSezonlukDiziEpisodeSources'],
  dyu: ['diziyouScraper', null, 'fetchDiziyouSources'],
  dzy: ['diziyoScraper', 'fetchDiziyoMovieSources', 'fetchDiziyoEpisodeSources'],
  dzb: ['dizibalScraper', 'fetchDizibalMovieSources', 'fetchDizibalEpisodeSources'],
  tvr: ['rectvService', 'fetchRecTvSources'],
  jet: ['jetFilmScraper', 'fetchJetFilmSources', 'fetchJetFilmEpisodeSources'],
  hdfb: ['hdfilmizleBestScraper', 'fetchHdfBestMovieSources'],
  lookmovie: ['lookmovieScraper', 'fetchOfficialLookMovieSources'],
  smashy: ['smashyStreamService', 'fetchSmashyStreamSources'],
  anizium: ['aniziumScraper', 'fetchAniziumSources'],
  animecix: ['animecixScraper', 'fetchAnimecixSources'],
  animetr: ['animeTrScraper', 'fetchAnimeTrSources'],
  kidsvip: ['kidsVipScraper', 'fetchKidsVipMovieSources', 'fetchKidsVipSources'],
  dramalar: ['dramalarScraper', null, 'fetchDramalarEpisodeSources'],
  dramadizilerim: ['dramaDizilerimScraper', null, 'fetchDramaDizilerimEpisodeSources'],
  torrent: ['torrentStreamService', 'fetchTorrentStreamSources'],
  dizi77: ['dizi77Scraper', null, 'fetchDizi77Sources'],
  dizibox: ['diziboxScraper', null, 'fetchDiziBoxSources'],
  sinemacc: ['sinemaccScraper', 'fetchSinemaccSources'],
  fm: ['filmmakinesiScraper', 'fetchFilmMakinesiSources'],
  vodm3u: ['vodM3uSources', 'fetchVodSources'],
};
export const SITE_PLUGIN_IDS = {
  hdfilmcehennemi: 'hdfc', setfilm: 'setf', selcukflix: 'slc', filmekseni: 'fxs',
  vidy: 'vidy', hdplayersystem: 'hdps', ksdpictures: 'ksd', pichive: 'pichive',
  vidload: 'vidload', vixolity: 'vixolity', tauvideo: 'tauvideo', pilavyerplay: 'pilavyer',
  nxsha: 'nxsha', vidmolyNet: 'vidmoly', searchPhp: 'sphp', keywordSearch: 'kwsearch',
  ajaxSearch: 'ajax', filmDiziList: 'filmdizi', rplayerVideo: 'rplayer', film666: 'k666',
  dizify: 'dzyf', hdfilmdelisi: 'hdfd', dortkhd: 'd4kh', zenit: 'twoembed',
  vidlink: 'vidlk', dizipal: 'dzp', asyaanimeleri: 'asy',
};
const TYPE = { film: 'movie', dizi: 'tv', anime: 'anime', cocuk: 'tv', 'kisa-dizi': 'tv' };
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
    mediaTypes: plugin.kinds.includes('cocuk') ? ['movie', 'tv'] : [...new Set(plugin.kinds.map(type => TYPE[type]).filter(Boolean))],
    adapter: tuple ? 'javascript' : 'site', sites, experimental: Boolean(plugin.experimental),
    async resolve(args) {
      const options = { ...args, title: args.title || '', seriesTitle: args.title || '',
        titles: args.titles || [args.title, args.originalTitle].filter(Boolean), mediaType: args.type };
      const output = [];
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
export async function checkProviderAdapters() {
  const issues = [];
  for (const [id, [file, ...names]] of Object.entries(MODULES)) {
    try {
      const module = await import(`../${file}.js`);
      for (const name of names.filter(Boolean)) if (typeof module[name] !== 'function') issues.push(`${id}: missing ${name}`);
    } catch (error) { issues.push(`${id}: ${error.message}`); }
  }
  for (const [site, id] of Object.entries(SITE_PLUGIN_IDS)) if (!SITES[site] || !providerMap.has(id)) issues.push(`Missing site binding: ${site}/${id}`);
  return issues;
}
