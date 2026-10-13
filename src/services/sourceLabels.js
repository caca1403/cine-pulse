// UI aliases only. Provider IDs and URLs remain available to the resolver.
// ONEK KURALI (koddan dogrulandi): bir kaynagin id'si ya temiz saglayicinin
// (src/providers/*.js) kendisinin urettigi onektir (`jet_`, `sinemacc_`, ...),
// ya da normalizeStream'in eklenti kimliginden urettigi `${pluginId}_` bicimidir
// (src/services/providerRuntime/contract.js + inventory.js SITE_PLUGIN_IDS).
// Her onek TEK aileye duser. Listenin SON SATIRI tarafsiz yutucudur (Nexus):
// taninmayan kaynak boylece gercek bir sitenin kod adini ustlenmez.
export const SOURCE_FAMILIES = [
  // --- Temiz saglayicilar (src/providers/index.js KAYIT) ---
  { alias: 'Atlas', provider: 'Dizisol', prefixes: ['dzs_'], sources: ['DS', 'Dizisol'] },
  { alias: 'Orion', provider: 'HDFilmCehennemi', prefixes: ['hdfc_'], sources: ['CloseLoad', 'Rapidrame', 'HDFilmCehennemi'] },
  { alias: 'Luna', provider: 'SezonlukDizi', prefixes: ['szd_'], sources: ['SZ'] },
  { alias: 'Nimbus', provider: 'jetFilm', prefixes: ['jet_'], sources: ['Jet'] },
  // Temiz saglayici `sinemacc_` uretir (halcyon.js); `smc_` eski eklenti yolunun
  // yedek onekidir — baska bir aile tarafindan iddia edilmedigi ici tutuluyor.
  { alias: 'Halcyon', provider: 'sinemacc', prefixes: ['sinemacc_', 'smc_'], sources: ['sinemacc'] },
  { alias: 'Bellatrix', provider: 'hdfd', prefixes: ['hdfd_'], sources: ['hdfd'] },
  { alias: 'Betelgeuse', provider: 'd4kh', prefixes: ['d4kh_'], sources: ['d4kh'] },
  { alias: 'Lyra', provider: 'SelcukFlix', prefixes: ['slc_'], sources: ['SelcukFlix'] },
  // echo.js (temiz saglayici) Diziyou sitesini cozer; slotu `dyu`'ya tasiniyor,
  // bu yuzden `dyu_` bu ailedir. Eski `Sol` satiri bu satirda birlesti.
  { alias: 'Echo', provider: 'Diziyou', prefixes: ['dyu_'], sources: ['Diziyou'] },
  { alias: 'Muhlif', provider: 'dzp', prefixes: ['dzp_'], sources: ['dzp'] },
  { alias: 'Lumen', provider: 'czgx', prefixes: ['czgx_'], sources: ['czgx'] },
  { alias: 'Sirius', provider: 'FullHDFilmizlesene', prefixes: ['fhdf_', 'fullhd'], sources: ['FullHD'] },
  { alias: 'Arcturus', provider: 'filmmakinesi', prefixes: ['fm_'], sources: ['fm'] },
  { alias: 'Aria', provider: 'Anizium', prefixes: ['az_', 'anizium_'], sources: ['Anizium'] },
  { alias: 'Tera', provider: 'Animecix', prefixes: ['acx_'], sources: ['Animecix'] },
  { alias: 'Aquila', provider: 'asy', prefixes: ['asy_'], sources: ['asy'] },
  // --- Eklenti / toplayici aileleri (temiz karsiligi olmayanlar) ---
  // setf (Vega) katalogdan tamamen kaldırıldı → aile satırı da söküldü;
  // setf_ id üreten yol kalmadı (kural: ölü aile defterde durmaz).
  { alias: 'Vela', provider: 'FilmEkseni', prefixes: ['fxs_'], sources: ['FilmEkseni'] },
  { alias: 'Mira', provider: 'Webteizle', prefixes: ['wtz_', 'webteizle_'], sources: ['WTZ', 'Webteizle'] },
  { alias: 'Nova', provider: 'Sinewix', prefixes: ['snx'], sources: ['SWX', 'Sinewix'] },
  { alias: 'Astra', provider: 'Dizilla', prefixes: ['dzl_'], sources: ['Dizilla'] },
  { alias: 'Polaris', provider: 'RecTV', prefixes: ['tvr_', 'rectv_'], sources: ['TVR', 'RecTV'] },
  // Nero yalniz Dizibal'dir (`dzb_`, temiz cozum Nero'nun icinde — eski dizibalScraper silindi). `dzp_` Dizipal'idir ve
  // muhlif.js'in (kimlik.id 'dzp') tek onigidir; yoksa Nero, Muhlif'i etiketlerdi.
  { alias: 'Nero', provider: 'Dizibal', prefixes: ['dzb_'], sources: ['Dizibal'] },
  { alias: 'Corvus', provider: 'dizi77', prefixes: ['d77_'], sources: ['dizi77'] },
  { alias: 'Cygnus', provider: 'DiziBox', prefixes: ['dzbx_'], sources: ['dizibox'] },
  { alias: 'Pulsar', provider: 'Film M3U', prefixes: ['vod_'], sources: ['vod-m3u'] },
  // diziyo.so ayri bir sitedir; 'Echo' adi temiz saglayiciya (Diziyou) devredildi.
  { alias: 'Mirach', provider: 'Diziyo', prefixes: ['dzy_'], sources: ['Diziyo'] },
  { alias: 'Halo', provider: 'LookMovie', prefixes: ['lookmovie_'], sources: ['LookMovie'] },
  { alias: 'Cosmo', provider: 'SmashyStream', prefixes: ['smashystream_'], sources: ['SmashyStream'] },
  { alias: 'Zenit', provider: '2Embed', prefixes: ['twoembed_'], sources: ['2Embed'] },
  { alias: 'Dora', provider: 'Dramalar', prefixes: ['dml_'], sources: ['Dramalar'] },
  { alias: 'Rhea', provider: 'DramaDizilerim', prefixes: ['ddz_'], sources: ['DramaDizilerim'] },
  { alias: 'Elara', provider: 'HDFilmizle', prefixes: ['hdfb_'], sources: ['HDFilmizle'] },
  { alias: 'Regulus', provider: 'dizify', prefixes: ['dzyf_'], sources: ['dizify'] },
  // Site suruculu eklentiler: id'yi normalizeStream `${eklentiKimligi}_` ile uretir,
  // bu yuzden onek eklenti anahtariyla birebir ayni olmali (vidy_, pichive_, ...).
  { alias: 'Altair', provider: 'vidy', prefixes: ['vidy_'], sources: ['vidy'] },
  { alias: 'Rigel', provider: 'hdplayersystem', prefixes: ['hdps_'], sources: ['hdps'] },
  { alias: 'Sadr', provider: 'ksdpictures', prefixes: ['ksd_'], sources: ['ksd'] },
  { alias: 'Antares', provider: 'pichive', prefixes: ['pichive_'], sources: ['pichive'] },
  { alias: 'Spica', provider: 'vidload', prefixes: ['vidload_'], sources: ['vidload'] },
  { alias: 'Almach', provider: 'vixolity', prefixes: ['vixolity_'], sources: ['vixolity'] },
  { alias: 'Nunki', provider: 'tauvideo', prefixes: ['tauvideo_'], sources: ['tauvideo'] },
  { alias: 'Menkar', provider: 'pilavyerplay', prefixes: ['pilavyer_'], sources: ['pilavyer'] },
  { alias: 'Adhara', provider: 'nxsha', prefixes: ['nxsha_'], sources: ['nxsha'] },
  { alias: 'Zubenelgenubi', provider: 'vidmolyNet', prefixes: ['vidmoly_'], sources: ['vidmoly'] },
  { alias: 'Alphecca', provider: 'searchPhp', prefixes: ['sphp_'], sources: ['sphp'] },
  { alias: 'Mizar', provider: 'keywordSearch', prefixes: ['kwsearch_'], sources: ['kwsearch'] },
  // ajax_ yaşıyor: ajaxSearch sitesi SITE_SURUCULERI üzerinden taranıyor.
  // (pluginCatalog'dan silinen 'ajax' ALIASES anahtarının yedeğidir.)
  { alias: 'Saiph', provider: 'ajaxSearch', prefixes: ['ajax_'], sources: ['ajax'] },
  { alias: 'Capella', provider: 'filmDiziList', prefixes: ['filmdizi_'], sources: ['filmdizi'] },
  { alias: 'Denebola', provider: 'rplayerVideo', prefixes: ['rplayer_'], sources: ['rplayer'] },
  { alias: 'Toliman', provider: 'vidlk', prefixes: ['vidlk_'], sources: ['vidlk'] },
  // Tarafsiz yutucu (SON SATIR olmali): taninmayan id gercek bir sitenin
  // kod adini almaz, kullaniciyi yaniltmaz. Bosluklar hicbir id/esme eslesmez.
  { alias: 'Perseus', provider: 'BelgeselX', prefixes: ['blgx_'], sources: [] },
  { alias: 'Pico', provider: 'KidsVip', prefixes: ['kvip_'], sources: [] },
  { alias: 'Kitsu', provider: 'AnimeTR', prefixes: ['antr_'], sources: ['AnimeTR'] },
  { alias: 'Nexus', provider: '', prefixes: [], sources: [] },
];

export function getSourceFamily(source) {
  const id = String(source?.id || '').toLowerCase();
  const name = String(source?.source || '').toLowerCase();
  // IDs win over shared host names (e.g. CloseLoad on multiple providers).
  return SOURCE_FAMILIES.find(f => f.prefixes.some(p => id.startsWith(p)))
    || SOURCE_FAMILIES.find(f => f.sources.some(s => name === s.toLowerCase()))
    // Son satirdaki tarafsiz yutucuya duser ('Nexus'); yanlış site adı atamaz.
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
  if (source?.requiresVerification && !source?.verificationCompleted) return `${label} · Doğrulama gerekli`;
  // NOT: 'Elle dene' etiketi kaldırıldı. Artık doğrulanamayan kaynaklar da
  // bizim kendi oynatıcımızdaki korumalı çerçevede açılıyor; kullanıcıya
  // yapacak bir şey bırakmıyoruz, sadece yanıltıcı bir uyarı gösteriyordu.
  return label;
}
