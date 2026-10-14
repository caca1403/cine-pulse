/* ==========================================================================
   POLAR — belgesel & çocuk dizisi arşivi (site adı arayüze HİÇ sızmaz)

   2026-10-15 canlı ölçümleri (anonim, anahtarsız; Node + curl kanıtlı):
     1. Arama   : /wp-json/wp/v2/search?search=…&per_page=10 → JSON.
                   Başlık kalıbı "Ad N. Sezon M. Bölüm"
                   (ölçüldü: "Planet Earth II 1. Sezon 6. Bölüm", id 164141).
                   YIL BİLGİSİ YOK → kimlik kapısı SIKI: seri adı BİREBİR +
                   sezon/bölüm birebir ("Planet Earth" ≠ "Planet Earth II").
     2. Oynatıcı: /wp/wp-admin/admin-ajax.php?action=get_episode_player&post_id=N
                   → { embed_code: <iframe src="…/embed/NNN.mp4"> }.
                   DÜZTAVAN: .mp4 uzantılı bu adres HTML sayfadır (alt ağ
                   Referer: kök/ ister, yoksa ana sayfaya 302) → ASLA kaynak
                   olarak dönmez; yalnız içindeki paketsiz akış döner.
     3. Paket   : embed sayfası ev-içi kodlu oyuncu ayarı taşır; packerCoz
                   (services/hdfcDecoders) açar → sources JSON'u
                   (ölçüldü: 1080p/720p etiketli …-720.mp4/gomindex.m3u8).
     4. Akış    : m3u8 anonim açılır — Range 0-200 → "#EXTM3U" (HD ve SD
                   örneklerde doğrulandı); ilk segment 301→kenar→206 TS
                   (0x47 senkron). Uzantıya aldanma: her satır doğrulanır.
   BÜTÇE: ≤2 arama + 1 oynatıcı + 1 paket + ≤2 doğrulama; tek istek ≤8sn.
   ========================================================================== */

import {
  izleyici, istek, kaynak, koken, alanAdiCoz, temizBaslik,
} from './kit.js';
import { packerCoz } from '../services/hdfcDecoders.js';

export const kimlik = { id: 'polar', alias: 'Polar', mediaTypes: ['tv'] };

const BILINEN_ADRESLER = ['https://dizipod.com'];

/** Türkçe-duyarlı küçültme/düzme (sezon.jsnor ile aynı çizgi). */
export function duz(x) {
  return String(x || '').toLowerCase()
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/** "Ad N. Sezon M. Bölüm" → { s, e, seri } | null (ölçülmüş kalıp). */
export function sezonBolum(baslik) {
  const t = duz(baslik);
  const m = t.match(/(\d+)\s*sezon\s+(\d+)\s*bol/);
  if (!m) return null;
  return { s: +m[1], e: +m[2], seri: t.slice(0, m.index).trim() };
}

/** REST sonuçlarından kimlik kapılı aday: birebir seri + birebir S/E. */
export function adaySec(json, hedefler, season, episode) {
  const s = +season || 1;
  const e = +episode || 1;
  const hedeflerDuz = [...new Set(hedefler.map(duz).filter((t) => t.length >= 3))];
  for (const p of Array.isArray(json) ? json : []) {
    const t = p && p.title; // sitede düz dizgi ölçüldü; WP varsayılanı {rendered} — ikisi de
    const tam = String((t && typeof t === 'object' ? (t.rendered || t.raw) : t) || '').trim();
    const url = String((p && p.url) || '');
    if (!tam || !+p.id) continue;
    const sb = sezonBolum(tam);
    if (!sb) continue;
    if (sb.s !== s || sb.e !== e) continue;
    // KAPI: seri adı birebir eşit olmalı — önek YETMEZ (yıl kapısı yok ki).
    if (!hedeflerDuz.includes(sb.seri)) continue;
    return { postId: +p.id || 0, url, ad: tam };
  }
  return null;
}

/** admin-ajax yanıtından iframe adresini kazı. */
export function iframeBul(json) {
  const kod = String((json && (json.data || json.embed_code || json.html)) || (typeof json === 'string' ? json : ''))
    .replace(/\\\//g, '/');
  for (const m of kod.matchAll(/<iframe[^>]+src=["']([^"']+)["']/gi)) {
    const u = m[1];
    if (/^https?:/i.test(u)) return u;
  }
  return '';
}

/** Packerdan çıkan oyuncu ayarından kaynak satırlarını listele (etiketli). */
export function akislariCoz(acikMetin) {
  const out = [];
  const gorulen = new Set();
  const ekle = (u, etiket) => {
    const t = String(u || '').replace(/\\\//g, '/');
    if (!/^https?:\/\/[^"'\s]+\.(m3u8|mp4|mkv)([?#]|$)/i.test(t)) return;
    if (gorulen.has(t)) return;
    gorulen.add(t);
    out.push({ url: t, etiket: String(etiket || '') });
  };
  // 1) ölçülen biçim: sources:[{"file":"…\/gomindex.m3u8","label":"720p"},…] (jwplayer ayarı)
  const sm = String(acikMetin || '').match(/sources\s*:\s*(\[[\s\S]*?\])\s*[,}]/);
  if (sm) {
    let liste = null;
    try { liste = JSON.parse(sm[1].replace(/\\\//g, '/')); } catch (_) {}
    if (Array.isArray(liste)) {
      for (const s of liste) ekle(s && (s.file || s.src || s.url), (s && (s.label || s.title)) || '');
    }
  }
  // 2) dizgi kipi: sources:"[{\"file\":…}]" (bazı oynatıcılarda)
  if (!out.length) {
    const s2 = String(acikMetin || '').match(/sources\s*:\s*"((?:[^"\\]|\\.)*)"/);
    if (s2) {
      let liste = null;
      try { liste = JSON.parse(JSON.parse(`"${s2[1]}"`)); } catch (_) {}
      if (Array.isArray(liste)) {
        for (const s of liste) ekle(s && (s.file || s.src || s.url), (s && (s.label || s.title)) || '');
      }
    }
  }
  // 3) yedek: düz adres kazıma
  if (!out.length) {
    for (const m of String(acikMetin || '').matchAll(/["'](https?:[^"'\s\\]+?\.(?:m3u8|mp4|mkv)(?:[?#][^"'\s\\]*)?)["']/gi)) {
      ekle(m[1], '');
    }
  }
  // yüksek etiketli üstte (720p gibi); sayısal olmayanlar sona.
  return out.sort((a, b) => (parseInt(b.etiket, 10) || 0) - (parseInt(a.etiket, 10) || 0));
}

/** Range ile akış satırını bayt düzeyinde doğrula (uydurma/HTML elenir). */
async function akisDogrula(url, ref, trace) {
  const govde = await istek(url, { ref, headers: { Range: 'bytes=0-200' }, timeout: 6000, trace });
  if (!govde) return false;
  const bas = govde.slice(0, 16);
  if (/^#EXTM3U/.test(bas)) return true;
  if (/ftyp/.test(bas.slice(0, 12)) && !/<!DOCTYPE|<html/i.test(govde)) return true;
  return false;
}

/* ── adım 1: ara — REST araması, kimlik kapısıyla ─────────────────────── */
export async function ara(hedefler, season, episode, taban, { trace } = {}) {
  for (const h of hedefler.slice(0, 2)) {
    const json = await istek(`${taban}/wp-json/wp/v2/search?search=${encodeURIComponent(h)}&per_page=10`, {
      ref: `${taban}/`, timeout: 6000, trace,
    });
    let veri = json;
    if (typeof json === 'string') { try { veri = JSON.parse(json); } catch (_) { veri = null; } }
    const aday = adaySec(veri, hedefler, season, episode);
    if (aday) { trace?.koy('kimlik', { baslik: aday.ad.slice(0, 60) }); return aday; }
  }
  trace?.koy('kimlik-yok', { hedef: hedefler[0], s: +season || 1, e: +episode || 1 });
  return null;
}

/* ── adım 2-3: yayın — oynatıcı → paket → doğrulanmış m3u8 ────────────── */
export async function yayin(aday, taban, { trace } = {}) {
  const out = [];
  const ajax = `${taban}/wp/wp-admin/admin-ajax.php?action=get_episode_player&post_id=${aday.postId}`;
  const ham = await istek(ajax, { ref: `${taban}/`, timeout: 7000, trace });
  let json = ham;
  if (typeof ham === 'string') { try { json = JSON.parse(ham); } catch (_) { json = ham; } }
  const iframe = iframeBul(json);
  if (!iframe) { trace?.koy('iframe-yok', {}); return out; }

  // Paket sayfası: Referer kök şart (ölçüldü: yoksa 302→ana sayfa, içerik boş).
  const paket = await istek(iframe, { ref: `${taban}/`, timeout: 7000, trace });
  if (!paket) { trace?.koy('paket-yok', {}); return out; }
  // Ölçülen kipi: <script>eval(function(p,a,c,k,e,d){e=function(c){return c}…
  let acik = paket;
  for (const m of paket.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)) {
    if (!/function\(p,a,c,k,e,d\)/.test(m[1])) continue;
    const u = packerCoz(m[1]);
    if (u) { acik = u; break; }
  }
  const adaylar = akislariCoz(acik);
  trace?.koy('paket', { n: adaylar.length });

  const oyuncuKok = koken(iframe) + '/';
  for (const a of adaylar.slice(0, 2)) {
    if (!await akisDogrula(a.url, `${taban}/`, trace)) { trace?.koy('akis-yanlis', { etiket: a.etiket }); continue; }
    out.push(kaynak({
      id: `polar_${aday.postId}_${out.length}`,
      ad: a.etiket ? `Polar ${a.etiket}` : 'Polar Akış',
      url: a.url,
      kategori: /dublaj|dub\b|turkish/i.test(a.etiket) ? 'dubbed' : 'subtitled',
      headers: { Referer: oyuncuKok },
      kalite: /^\d{3,4}p$/i.test(a.etiket) ? a.etiket : '',
      hls: /\.m3u8/i.test(a.url),
    }));
  }
  return out;
}

/* ── giriş noktası ─────────────────────────────────────────────────────── */
export async function coz({ type = 'tv', title = '', originalTitle = '', titles = [], season = 1, episode = 1 } = {}) {
  const trace = izleyici();
  const bas = Date.now();
  if (type !== 'tv') return { sources: [], trace: trace.ozet() };
  const hedefler = [...new Set(
    [temizBaslik(originalTitle), temizBaslik(title), ...(titles || []).map(temizBaslik)]
      .filter((t) => t && t.length > 2),
  )];
  if (!hedefler.length) return { sources: [], trace: trace.ozet() };

  const taban = await alanAdiCoz('polar', BILINEN_ADRESLER, { trace });
  if (!taban) return { sources: [], trace: trace.ozet() };

  const aday = await ara(hedefler, season, episode, taban, { trace });
  const sources = aday ? await yayin(aday, taban, { trace }) : [];
  trace.koy('sonuc', { kaynak: sources.length, ms: Date.now() - bas });
  return { sources, trace: trace.ozet() };
}

export default {
  apiVersion: 1,
  id: kimlik.id,
  name: kimlik.alias,
  mediaTypes: kimlik.mediaTypes,
  async resolve(a) { return (await coz(a)).sources; },
};
