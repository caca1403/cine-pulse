// UI aliases only. Provider IDs and URLs remain available to the resolver.
// ONEK KURALI: bir kaynağın id'si kazıyıcının ürettiği önektir (`dml_`, `ddz_`,
// `sp_<slug>_`). Her önek TEK aileye düşer. Listenin SON SATIRI tarafsız
// yutucudur (Nexus): tanınmayan kaynak böylece gerçek bir sitenin kod adını
// üstlenmez.
import { KAYIT as TUM_KAYIT } from '../../providers/kayit.js';

// Kısa dizi hatları (elle yazılmış)
const ELLE_AILER = [
  { alias: 'Dora', provider: 'Dramalar', prefixes: ['dml_', 'dramalar_'], sources: ['Dramalar'] },
  { alias: 'Rhea', provider: 'DramaDizilerim', prefixes: ['ddz_', 'dramadizilerim_'], sources: ['DramaDizilerim'] },
];

// Kahraman sağlayıcıları — tek doğruluk kaynağı KAYIT'tir, kod adları oradan gelir.
// Arayüz bu tabloyu görür; gerçek site adı hiçbir zaman buraya girmez.
const KAHRAMAN_AILER = [...TUM_KAYIT.entries()]
  .map(([ad, k]) => ({ alias: ad, provider: '', prefixes: [k.onek], sources: [] }))
  .sort((a, b) => a.alias.localeCompare(b.alias, 'en'));

export const SOURCE_FAMILIES = [
  ...ELLE_AILER,
  ...KAHRAMAN_AILER,
  // Tarafsız yutucu (SON SATIR olmalı): tanınmayan id gerçek bir sitenin
  // kod adını almaz, kullanıcıyı yanıltmaz. Boşluklar hiçbir id/esme eşleşmez.
  { alias: 'Nexus', provider: '', prefixes: [], sources: [] },
];

export function getSourceFamily(source) {
  const id = String(source?.id || '').toLowerCase();
  const name = String(source?.source || '').toLowerCase();
  // IDs win over shared host names.
  return SOURCE_FAMILIES.find(f => f.prefixes.some(p => id.startsWith(p)))
    || SOURCE_FAMILIES.find(f => f.sources.some(s => name === s.toLowerCase()))
    // Son satırdaki tarafsız yutucuya düşer ('Nexus'); yanlış site adı atamaz.
    || SOURCE_FAMILIES.at(-1);
}

/** Kaynak id'sinden anonim kod adı (Dora, Rhea…). Ham id asla dönmez:
 *  eşleşme yoksa tarafsız yutucu 'Nexus'. */
export function getAliasForId(id) {
  const kimlik = String(id || '');
  if (!kimlik) return 'Nexus';
  return getSourceFamily({ id: `${kimlik}_` }).alias;
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
  return label;
}
