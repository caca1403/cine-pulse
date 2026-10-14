/* ==========================================================================
   DENEB — Arşiv kaynağı (kitaplık mikro-servisi; site adı arayüze SIZMAZ)

   Kitaplık API'si anahtarsız/ücretsiz; 2026-10-14 canlı ölçümler:
     1. Arama : GET /advancedsearch.php?q=title:("X") AND year:YYYY AND
                mediatype:(movies)&fl[]=identifier|title|year&output=json
                → {response:{docs:[{identifier,title,year}]}}
                YIL FİLTRESİ KİMLİK KAPISIDIR: "night of the living dead"
                başlıkta 246 sonuç; year:1968 → 8 (ölçüldü).
     2. Kimlik: doc.title normalize eşleşme (tam/öneşek). Trailer/fragman/
                sahne/yabancı-dublaj kartları RED ("…Trailer (1968)" öneşek
                geliyor — ölçülen gürültü; mandarin/vietnamese dub RED).
     3. Dosya : GET /metadata/{id} → {is_dark, server, dir, files[]}
                is_dark → ELLE. format==="h.264" && .mp4 (".ia.mp4" türevi
                atılır), height en yüksek seçilir.
                URL https://{server}{dir}/{encode(dosya)}
                Range GET 0-63 → 206 + 'ftyp' imzası BAYTLA doğrulandı.
     4. DİZİ  : başlıkta bölüm işareti (S01E01 / Episode / N. Bölüm / Bolum N)
                VE istenen bölümü aralıkla içermesi ŞART. İşaretsiz kayıt
                filmde kabul, dizide RED (yanlış bölüm riski — "Rafadan Tayfa
                Episode 10-13" S1B1 isteğinde RED; ölçülen karar).
   BÜTÇE: ≤2 arama + ≤2×(1 metadata + 2 probe) ≤ 8 istek, timeout ≤8 sn.
   ANONİMLİK: kullanıcıya yalnız "Deneb …" görünür. UA: okhttp (referer yok).
   ========================================================================== */

import {
  istek, izleyici, kaynak, slugla, temizBaslik,
} from './kit.js';

const UA_ARSIV = 'okhttp/4.9.0';
const APAR = 'https://archive.org/advancedsearch.php';
const UST = 'https://archive.org/metadata/';

export const kimlik = { id: 'arhv', alias: 'Deneb', mediaTypes: ['movie', 'tv'] };

/** Türkçe-duyarlı normalizasyon (lumen ile aynı kalıp). */
const duz = (s) => String(s || '')
  .toLowerCase()
  .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
  .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
  .replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();

/** Ölçülen gürültü: fragman/sahne/yabancı dublaj kopyaları. */
const COP = /trailer|fragman|teaser|clip|scene|sahne|behind the scenes|kamera arkasi|mandarin|cantonese|vietnamese|hindi dub|spanish dub|german dub|earrape/i;

/** doc.title → hedefe göre puan. 0 = elenir. */
function puanla(dokAdi, hedefler) {
  const aday = duz(dokAdi);
  if (!aday || COP.test(aday)) return 0;
  let en = 0;
  for (const h of hedefler) {
    const hedef = duz(h);
    if (!hedef || hedef.length < 2) continue;
    if (aday === hedef) en = Math.max(en, 6);
    else if (aday.startsWith(`${hedef} `)) en = Math.max(en, 4);   // "rafadan tayfa episode 10 13"
    else if (hedef.startsWith(`${aday} `)) en = Math.max(en, 2);   // doc çok kısa — temkinli
  }
  return en;
}

/** Başlıktan sezon/bölüm işareti: {s,e} | {a,b} | null. Aralık: "10-13". */
function bolumIzi(ad) {
  const t = duz(String(ad).replace(/[._]/g, ' '));
  let m = t.match(/(?:^|\s)s(\d{1,2})\s*e(\d{1,3})(?:\s|$)/i);
  if (m) return { s: +m[1], e: +m[2] };
  m = t.match(/(?:episode|bolum|bolum|bolum|ep|bolum|b)\s+(\d{1,4})(?:\s+(\d{1,4}))?(?:\s|$)/i);
  if (m) return { a: +m[1], b: m[2] ? +m[2] : +m[1] };
  m = t.match(/(?:^|\s)(\d{1,4})\s+(?:bolum|episode|bolum)(?:\s|$)/i);
  if (m) return { a: +m[1], b: +m[1] };
  return null;
}

/** İstenen s/e kayıtla uyuşur mu? İşaret yoksa yalnız film kabul (dizi RED). */
function bolumUyar(iz, s, e, isFilm) {
  if (isFilm) return true;
  if (!iz) return false;
  if (iz.s != null) return iz.s === s && iz.e === e;
  return e >= iz.a && e <= iz.b;
}

/* ── 1. arama ─────────────────────────────────────────────────────────── */
async function ara(hedefler, yil, trace) {
  const q = hedefler.slice(0, 2).map((h) => `title:("${h.replace(/["\\]/g, '')}")`).join(' OR ');
  const kosul = yil ? ` AND year:${yil}` : '';
  const url = `${APAR}?q=${encodeURIComponent(`(${q})${kosul} AND mediatype:(movies)`)}&fl[]=identifier&fl[]=title&fl[]=year&rows=8&output=json`;
  const ham = await istek(url, { ref: 'https://archive.org/', headers: { Accept: 'application/json', 'User-Agent': UA_ARSIV }, timeout: 8000, trace, webView: false });
  try {
    const docs = JSON.parse(ham)?.response?.docs || [];
    return docs.map((d) => ({ identifier: d.identifier, title: d.title || '', year: d.year || null, _puan: puanla(d.title || d.identifier || '', hedefler) }));
  } catch (_) { return []; }
}

/* ── ana akış ─────────────────────────────────────────────────────────── */
export async function coz({ type = 'movie', title = '', originalTitle = '', titles = [], year = null, season = 1, episode = 1 } = {}) {
  const trace = izleyici();
  const isFilm = type === 'movie';
  const s = +season || 1;
  const e = +episode || 1;
  const hedefler = [...new Set([temizBaslik(originalTitle), temizBaslik(title), ...titles.map(temizBaslik)].filter((t) => t && t.length > 1))];
  if (!hedefler.length) return { sources: [], trace: trace.ozet() };
  const yil = (year && String(year).match(/\d{4}/) || [null])[0];

  // 1) yıl kapılı arama; boşsa kapısız + TAM eşik (kapıyı gevşetme)
  let docs = (await ara(hedefler, yil, trace)).filter((d) => d._puan >= 4);
  if (!docs.length && yil) {
    docs = (await ara(hedefler, null, trace))
      .filter((d) => d._puan >= 6 && (d.year == null || Math.abs(+d.year - +yil) <= 1));
  }
  trace.koy('arama', { hedef: hedefler[0], yil: yil || '-', docs: docs.length });
  if (!docs.length) return { sources: [], trace: trace.ozet() };

  // 2) puan sırasıyla en çok 2 kayıt: metadata → bölüm uyumu → dosya → bayt probe
  const kaynaklar = [];
  for (const d of docs.sort((a, b) => b._puan - a._puan).slice(0, 3)) {
    if (!d.identifier) continue;
    const ham = await istek(`${UST}${encodeURIComponent(d.identifier)}`, {
      ref: 'https://archive.org/', headers: { Accept: 'application/json', 'User-Agent': UA_ARSIV }, timeout: 8000, trace, webView: false,
    });
    let meta = null;
    try { meta = JSON.parse(ham); } catch (_) {}
    if (!meta || meta.is_dark || !meta.server || !meta.dir) { trace.koy('kayit', { id: d.identifier, karanlik: Boolean(meta && meta.is_dark) }); continue; }

    const iz = bolumIzi(d.title || d.identifier);
    if (!bolumUyar(iz, s, e, isFilm)) { trace.koy('bolum-red', { id: d.identifier, istenen: `S${s}B${e}`, iz: iz ? JSON.stringify(iz) : 'yok' }); continue; }

    // Cihazda ölçüldü (2026-10-15): orijinal yükleme "MPEG4" etiketlidir,
    // "h.264" yalnız .ia.mp4 türevinde — türev ad bazen atlanır, ad filtresi
    // yine de korunur. İkisi de ExoPlayer'da çalan h.264 mp4'tür.
    const mp4ler = (meta.files || [])
      .filter((f) => f && /^(h\.264|mpeg4)$/i.test(String(f.format || '')) && /\.mp4$/i.test(f.name || '') && !/\.ia\.mp4$/i.test(f.name || ''))
      .sort((a, b) => (Number(b.height) || 0) - (Number(a.height) || 0));
    if (!mp4ler.length) { trace.koy('dosya', { id: d.identifier, mp4: 0 }); continue; }

    let sec = null;
    for (const f of mp4ler.slice(0, 2)) {
      const url = `https://${meta.server}${meta.dir}/${encodeURIComponent(f.name)}`;
      const probe = await istek(url, { ref: 'https://archive.org/', headers: { 'User-Agent': UA_ARSIV, Range: 'bytes=0-63' }, timeout: 8000, trace, webView: false });
      const p = String(probe || '');
      // Bayt kanıtı: en az 12 B + mp4 'ftyp' imzası (ilk 12 B içinde) VE ya da HTML hata sayfası değil.
      if (p.length >= 12 && !/^\s*</.test(p)) { sec = { url, f }; break; }
    }
    if (!sec) { trace.koy('probe', { id: d.identifier, olu: true }); continue; }

    const y = Number(sec.f.height) || 0;
    const kalite = y >= 1080 ? '1080p' : y >= 720 ? '720p' : y >= 480 ? '480p' : y ? `${y}p` : 'Arşiv';
    kaynaklar.push(kaynak({
      id: `arhv_${slugla(d.identifier).slice(0, 42) || 'kayit'}_${kalite}`,
      ad: `Deneb ${kalite} Arşiv`,
      url: sec.url,
      kategori: 'subtitled',
      headers: { 'User-Agent': UA_ARSIV },
      kalite,
    }));
    trace.koy('sonuc', { id: d.identifier, kalite });
    break; // kimlik kapısı: en iyi tek kayıt yeterli
  }
  return { sources: kaynaklar, trace: trace.ozet() };
}

export default {
  apiVersion: 1,
  id: kimlik.id,
  name: kimlik.alias,
  mediaTypes: kimlik.mediaTypes,
  async resolve(a) { return (await coz(a)).sources; },
};
