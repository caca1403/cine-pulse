// UI aliases only. Provider IDs and URLs remain available to the resolver.
export const SOURCE_FAMILIES = [
  { alias: 'Atlas', provider: 'Dizisol', prefixes: ['dzs_'], sources: ['DS', 'Dizisol'] },
  { alias: 'Orion', provider: 'HDFilmCehennemi', prefixes: ['hdfc_'], sources: ['CloseLoad', 'Rapidrame', 'HDFilmCehennemi'] },
  { alias: 'Vega', provider: 'SetFilm', prefixes: ['setf_'], sources: ['SetFilm'] },
  { alias: 'Vela', provider: 'FilmEkseni', prefixes: ['fxs_'], sources: ['FilmEkseni'] },
  { alias: 'Luna', provider: 'SezonlukDizi', prefixes: ['szd_'], sources: ['SZ'] },
  { alias: 'Mira', provider: 'Webteizle', prefixes: ['wtz_', 'webteizle_'], sources: ['WTZ', 'Webteizle'] },
  { alias: 'Nova', provider: 'Sinewix', prefixes: ['snx', 'swx_'], sources: ['SWX', 'Sinewix'] },
  { alias: 'Lyra', provider: 'SelcukFlix', prefixes: ['slc_'], sources: ['SelcukFlix'] },
  { alias: 'Astra', provider: 'Dizilla', prefixes: ['dzl_'], sources: ['Dizilla'] },
  { alias: 'Sirius', provider: 'FullHDFilmizlesene', prefixes: ['fhdf_', 'fullhd'], sources: ['FullHD'] },
  { alias: 'Polaris', provider: 'RecTV', prefixes: ['tvr_', 'rectv_'], sources: ['TVR', 'RecTV'] },
  { alias: 'Sol', provider: 'Diziyou', prefixes: ['dyu_'], sources: ['Diziyou'] },
  { alias: 'Nero', provider: 'Dizibal / Dizipal', prefixes: ['dzb_', 'dzp_'], sources: ['Dizibal', 'Dizipal'] },
  { alias: 'Corvus', provider: 'dizi77', prefixes: ['d77_'], sources: ['dizi77'] },
  { alias: 'Cygnus', provider: 'DiziBox', prefixes: ['dzbx_'], sources: ['dizibox'] },
  { alias: 'Halcyon', provider: 'sinemacc', prefixes: ['smc_'], sources: ['sinemacc'] },
  { alias: 'Pulsar', provider: 'Film M3U', prefixes: ['vod_'], sources: ['vod-m3u'] },
  { alias: 'Echo', provider: 'Diziyo', prefixes: ['dzy_'], sources: ['Diziyo'] },
  { alias: 'Halo', provider: 'LookMovie', prefixes: ['lookmovie_'], sources: ['LookMovie'] },
  { alias: 'Cosmo', provider: 'SmashyStream', prefixes: ['smashystream_'], sources: ['SmashyStream'] },
  { alias: 'Zenit', provider: '2Embed', prefixes: ['twoembed_'], sources: ['2Embed'] },
  { alias: 'Aria', provider: 'Anizium', prefixes: ['az_', 'anizium_'], sources: ['Anizium'] },
  { alias: 'Tera', provider: 'Animecix', prefixes: ['acx_'], sources: ['Animecix'] },
  { alias: 'Dora', provider: 'Dramalar', prefixes: ['dml_'], sources: ['Dramalar'] },
  { alias: 'Rhea', provider: 'DramaDizilerim', prefixes: ['ddz_'], sources: ['DramaDizilerim'] },
  { alias: 'Elara', provider: 'HDFilmizle', prefixes: ['hdfb_'], sources: ['HDFilmizle'] },
  // Yeni siteler — ekran adlari da anonim kod adlaridir
  { alias: 'Thales', provider: 'filmmakinesi', prefixes: ['fm_'], sources: ['fm'] },
  { alias: 'Deneb', provider: 'k666', prefixes: ['k666_'], sources: ['k666'] },
  { alias: 'Mimosa', provider: 'dizify', prefixes: ['dzyf_'], sources: ['dizify'] },
  { alias: 'Altair', provider: 'vidy', prefixes: ['vdy_'], sources: ['vidy'] },
  { alias: 'Rigel', provider: 'hdplayersystem', prefixes: ['hdps_'], sources: ['hdps'] },
  { alias: 'Sadr', provider: 'ksdpictures', prefixes: ['ksd_'], sources: ['ksd'] },
  { alias: 'Antares', provider: 'pichive', prefixes: ['pch_'], sources: ['pichive'] },
  { alias: 'Spica', provider: 'vidload', prefixes: ['vld_'], sources: ['vidload'] },
  { alias: 'Almach', provider: 'vixolity', prefixes: ['vxl_'], sources: ['vixolity'] },
  { alias: 'Nunki', provider: 'tauvideo', prefixes: ['tau_'], sources: ['tauvideo'] },
  { alias: 'Menkar', provider: 'pilavyerplay', prefixes: ['plv_'], sources: ['pilavyer'] },
  { alias: 'Adhara', provider: 'nxsha', prefixes: ['nx_'], sources: ['nxsha'] },
  { alias: 'Zubenelgenubi', provider: 'vidmolyNet', prefixes: ['vmy_'], sources: ['vidmoly'] },
  { alias: 'Alphecca', provider: 'searchPhp', prefixes: ['sphp_'], sources: ['sphp'] },
  { alias: 'Mizar', provider: 'keywordSearch', prefixes: ['kws_'], sources: ['kwsearch'] },
  { alias: 'Saiph', provider: 'ajaxSearch', prefixes: ['ajx_'], sources: ['ajax'] },
  { alias: 'Capella', provider: 'filmDiziList', prefixes: ['fdl_'], sources: ['filmdizi'] },
  { alias: 'Denebola', provider: 'rplayerVideo', prefixes: ['rpl_'], sources: ['rplayer'] },
  { alias: 'Nexus', provider: 'Diğer / tanımlanmayan kaynak', prefixes: [], sources: [] }
];

export function getSourceFamily(source) {
  const id = String(source?.id || '').toLowerCase();
  const name = String(source?.source || '').toLowerCase();
  // IDs win over shared host names (e.g. CloseLoad on multiple providers).
  return SOURCE_FAMILIES.find(f => f.prefixes.some(p => id.startsWith(p)))
    || SOURCE_FAMILIES.find(f => f.sources.some(s => name === s.toLowerCase()))
    || SOURCE_FAMILIES.at(-1);
}

function letter(index) {
  let out = '';
  for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) out = String.fromCharCode(65 + (n - 1) % 26) + out;
  return out;
}

export function getAnonymousSourceLabel(source, siblings = []) {
  const family = getSourceFamily(source);
  const peers = siblings.filter(s => getSourceFamily(s).alias === family.alias)
    .sort((a, b) => String(a.id || '').localeCompare(String(b.id || '')));
  const index = peers.findIndex(s => s === source || (s.id && s.id === source?.id));
  const label = peers.length > 1 && index >= 0 ? `${family.alias} ${letter(index)}` : family.alias;
  return source?.requiresVerification && !source?.verificationCompleted ? `${label} · Doğrulama gerekli` : label;
}
