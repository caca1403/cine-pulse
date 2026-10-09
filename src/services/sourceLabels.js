// UI aliases only. Provider IDs and URLs remain available to the resolver.
export const SOURCE_FAMILIES = [
  { alias: 'Atlas', provider: 'Dizisol', prefixes: ['dzs_'], sources: ['DS', 'Dizisol'] },
  { alias: 'Orion', provider: 'HDFilmCehennemi', prefixes: ['hdfc_'], sources: ['CloseLoad', 'Rapidrame', 'HDFilmCehennemi'] },
  { alias: 'Vega', provider: 'SetFilm', prefixes: ['setf_'], sources: ['SetFilm'] },
  { alias: 'Luna', provider: 'SezonlukDizi', prefixes: ['szd_'], sources: ['SZ'] },
  { alias: 'Mira', provider: 'Webteizle', prefixes: ['wtz_', 'webteizle_'], sources: ['WTZ', 'Webteizle'] },
  { alias: 'Nova', provider: 'Sinewix', prefixes: ['snx', 'swx_'], sources: ['SWX', 'Sinewix'] },
  { alias: 'Lyra', provider: 'SelcukFlix', prefixes: ['slc_'], sources: ['SelcukFlix'] },
  { alias: 'Astra', provider: 'Dizilla', prefixes: ['dzl_'], sources: ['Dizilla'] },
  { alias: 'Sirius', provider: 'FullHDFilmizlesene', prefixes: ['fhdf_', 'fullhd'], sources: ['FullHD'] },
  { alias: 'Polaris', provider: 'RecTV', prefixes: ['tvr_', 'rectv_'], sources: ['TVR', 'RecTV'] },
  { alias: 'Sol', provider: 'Diziyou', prefixes: ['dyu_'], sources: ['Diziyou'] },
  { alias: 'Nero', provider: 'Dizibal / Dizipal', prefixes: ['dzb_', 'dzp_'], sources: ['Dizibal', 'Dizipal'] },
  { alias: 'Echo', provider: 'Diziyo', prefixes: ['dzy_'], sources: ['Diziyo'] },
  { alias: 'Halo', provider: 'LookMovie', prefixes: ['lookmovie_'], sources: ['LookMovie'] },
  { alias: 'Cosmo', provider: 'SmashyStream', prefixes: ['smashystream_'], sources: ['SmashyStream'] },
  { alias: 'Zenit', provider: '2Embed', prefixes: ['twoembed_'], sources: ['2Embed'] },
  { alias: 'Aria', provider: 'Anizium', prefixes: ['az_', 'anizium_'], sources: ['Anizium'] },
  { alias: 'Tera', provider: 'Animecix', prefixes: ['acx_'], sources: ['Animecix'] },
  { alias: 'Dora', provider: 'Dramalar', prefixes: ['dml_'], sources: ['Dramalar'] },
  { alias: 'Rhea', provider: 'DramaDizilerim', prefixes: ['ddz_'], sources: ['DramaDizilerim'] },
  { alias: 'Elara', provider: 'HDFilmizle', prefixes: ['hdfb_'], sources: ['HDFilmizle'] },
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
