/* ==========================================================================
   CinePulse — "Phyla" çekirdeği (birinci taraf) — DiziBal / Pilavyer ailesi
   --------------------------------------------------------------------------
   Ölçülen zincir (2026-10-30, Node'da uçtan uca doğrulandı):
     • Arama:  GET {site}/ara/oneri?q=<metin>  (Accept: application/json)
         → { movies:[{title,url,meta:"Film · YYYY"}], series:[{title,url,meta:
           "Dizi · YYYY"}] } — URL doğrudan {site}/series/<slug> veya /movie/<slug>.
         (DİKKAT: /ara?keyword= BOŞ sayfa döner; gerçek parametre /ara?q= ve
          JSON öneri ucu /ara/oneri'dir — app-C4B7K_dm.js searchBox() ölçüldü.)
     • Bölüm:  GET {site}/series/<slug>/season/S/episode/E
         → oynatıcı HTML'de GİZLİDİR (Pilavyer "izsiz" koruması): kutuda yalnız
           <template data-tbx-defer><div data-pv="<opal-slug>">
           <script src="https://<embed>/assets/js/core.js"> bulunur.
           core.js runtime'da iframe kurar: {embed}/assets/js/s.php?s=<slug>.
     • Embed:  GET {embed}/assets/js/s.php?s=<slug>  (Referer: {site} ŞART —
           referersiz 403 ölçüldü) → window.__PLAYER__ = { stream, token,
           subs:[{lang,label,src}], audios:[{lang,label}], dur, title, ... }
           stream = {embed}/api/stream.php?v=<vid>&token=<JWT> (JWT'de
           o:"dizibal.org" —origin anahtanlı—, exp ~15 gün).
     • Master: stream.php → #EXTM3U + varyantlar (relative URI'ler master
           adresine göre çözülür). Dil kanıtları:
             - dublaj : master'da TYPE=AUDIO LANGUAGE="tr|tur" / NAME="Türk…"
             - altyazı: __PLAYER__.subs[] içinde lang:"tr" + sub.php WEBVTT
               (sub.php gerçekten `WEBVTT` + Türkçe cue'lar döndürür — ölçüldü;
                orada sub src'si dogrulanmis TR altyazı kanıtıdır).
           Ölçümler (2026-10-30, Node'da 10 ayrı içerikte doğrulandı):
           • DUBLAJLI çift sesli filmler (Oppenheimer / Ters Yüz / Deadpool):
             master'da `TYPE=AUDIO,NAME="audio_1",DEFAULT=YES,LANGUAGE="tr"`
             + ikinci ses `LANGUAGE="en"` / ayrı URI `p=stream_a1/index.m3u8`
             → çekirdek SES BAŞINA SATIR yayınlar; dil kanıtı master satırı.
           • Muxed dublaj dizileri (One Piece, Dark): __PLAYER__.audios
             [{lang:"tr",label:"Türkçe Dublaj"}] DER AMA master'da EXT-X-MEDIA
             YOK (ses video'ya mux'lu) → ilk segman (Range 256KB) PMT/mdhd
             probu konuşur; kanıt gelirse rozet, gelmezse yalnız "site beyanı"
             ipucu yayınlanebilir (rozet BASILMAZ — kanıtsız rozet yasak).
           • Gerçek tek sesliler (BB S1E1, Stranger Things, Peaky Blinders):
             audios=[{label:"Orijinal"}], master NAME="audio_1" LANGUAGE YOK →
             etiket "TR Altyazı" (altyazı kanıtı sub.php WEBVTT).
   Token yenileme: {embed}/api/token.php?v=<vid> (Referer: {site}) → {ok,token}
   — satır yayınlandığında token tazedir; süresi düşerse çekirdek yeniden
   s.php çağırır (önbellek 15 dk), ek playbook gerekmez.
   ========================================================================== */

import { tmdbBilgi, adayBasliklar, sadeles, yilUyar } from '../ortakCekirdek.js';

const AD = 'Phyla';
const SITE = 'https://dizibal.org';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const VARLIK_EMBED = 'https://pilavyerplay.top'; // data-pv yoksa düşülen yedek taban

async function oku(url, { ref = SITE + '/', ms = 12000, accept = 'text/html,application/xhtml+xml,*/*' } = {}) {
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: accept, Referer: ref },
      signal: typeof AbortSignal?.timeout === 'function' ? AbortSignal.timeout(ms) : undefined,
    });
    return r.ok ? await r.text() : '';
  } catch (_) {
    return '';
  }
}

const norm = (s) => sadeles(String(s || '')).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

/* 1) arama → dizi/film sayfası URL'i (JSON öneri ucu; başlık + yıl kapısı) */
async function sayfaBul(adaylar, isTv, hedefYil = 0) {
  for (const soru of adaylar.slice(0, 2)) {
    const ham = await oku(`${SITE}/ara/oneri?q=${encodeURIComponent(soru)}`, { accept: 'application/json' });
    if (!ham) continue;
    let j = null;
    try { j = JSON.parse(ham); } catch (_) { continue; }
    const liste = [...(isTv ? j?.series || [] : j?.movies || []), ...(isTv ? [] : j?.series || [])];
    // YIL KAPI: ilk eşleşme yıl uymazsa ATLANIR (ölçüm: 'one piece' → 'LEGO ONE
    // PIECE · 2026' first geliyordu; tek-aday davranışı tüm zinciri 0'a düşürüyordu)
    for (const kayit of liste) {
      if (!kayit?.url) continue;
      const b = norm(kayit.title || '');
      const esles = adaylar.some((a) => { const n = norm(a); return n && (b === n || b.includes(n) || n.includes(b)); });
      if (!esles) continue;
      const y = Number((String(kayit.meta || '').match(/(?:19|20)\d{2}/) || [])[0] || 0);
      if (hedefYil && y && !yilUyar(y, hedefYil)) continue;
      return { url: String(kayit.url), yil: y };
    }
  }
  return null;
}

/* 2) bölüm/film sayfası → [{slug, embedBase}] (Pilavyer data-pv izleri) */
function pvAdlari(html) {
  const sluglar = [...new Set([...String(html).matchAll(/data-pv="([^"]+)"/g)].map((m) => m[1]))].filter(Boolean);
  const base = (String(html).match(/<script[^>]+src="(https?:\/\/[^"]+)\/(?:e\/c|assets\/js\/core)\.js/) || [])[1] || VARLIK_EMBED;
  return sluglar.map((s) => ({ slug: s, base }));
}

/* 3) embed → __PLAYER__ config */
function oynaticiAyar(html) {
  const m = String(html).match(/window\.__PLAYER__\s*=\s*(\{[\s\S]*?\});\s*<\/script>/);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch (_) { return null; }
}

/* 3b) Dil yardımcıları + Katman-2 muxed ses probu (dublajKestirme deseni —
      çekirdek kendi kendine yeter, node:crypto/node:fs YOK; bundle güvenliği). */
const TS_AUDIO_TIPLERI = new Set([0x03, 0x04, 0x06, 0x0F, 0x81, 0x83, 0x84, 0x87, 0x90, 0x91, 0x92, 0xA1, 0xAC, 0xD1]);
function dilKodla(ham) {
  const t = String(ham || '').trim().toLowerCase().replace(/["']/g, '');
  if (!t) return null;
  const kisa = t.split(/[-_]/)[0];
  if (kisa === 'tur' || kisa === 'tr' || t === 'turkish' || t === 'turkce' || t === 'turk') return 'tr';
  if (kisa === 'eng' || kisa === 'en' || t === 'english' || t === 'ingilizce') return 'en';
  if (kisa === 'und' || kisa === 'mis' || t === 'undefined') return 'und';
  if (/^[a-z]{2}$/.test(kisa)) return kisa; // 3 harfli kodlar yalnız tur/eng eşlenir; gerisi kanıt sayılmaz
  return null;
}
/** MPEG-TS PAT→PMT→ES 0x0A dil tanımlayıcısı (12-bit length'lar 0x0fff maskıyla). */
function tsSesDilleri(b) {
  const kodlar = new Set();
  let senkron = -1;
  for (let i = 0; i < 188 && i + 188 <= b.length; i++) if (b[i] === 0x47) { senkron = i; break; }
  if (senkron < 0) return kodlar;
  const pmtPidler = new Set();
  for (let i = senkron; i + 188 <= b.length; i += 188) {
    if (b[i] !== 0x47) continue;
    const pid = ((b[i + 1] & 0x1f) << 8) | b[i + 2];
    if ((b[i + 1] & 0x40) === 0) continue; // payload_unit_start
    const afc = (b[i + 3] >> 4) & 3;       // adaptation_field_control bit 5-4 (>>6 DEĞİL)
    if (afc === 0 || afc === 2) continue;
    let p = i + 4;
    if (afc === 3) p += 1 + b[p];
    if (p >= i + 188) continue;
    p += 1 + b[p]; // pointer_field
    if (p >= i + 188) continue;
    const bit = (o) => (o + 1 < b.length) ? ((b[o] << 8) | b[o + 1]) : -1;
    if (pid === 0 && b[p] === 0x00) { // PAT
      const son = Math.min(p + 3 + (bit(p + 1) & 0x0fff), i + 188 - 4);
      for (let q = p + 6; q + 4 <= son; q += 4) if (bit(q) !== 0) pmtPidler.add(bit(q + 2) & 0x1fff);
    } else if (pmtPidler.has(pid) && b[p] === 0x02) { // PMT
      const son = Math.min(p + 3 + (bit(p + 1) & 0x0fff), i + 188);
      let q = p + 9 + (bit(p + 7) & 0x0fff); // program_info_length reserved '1111' → 0x0fff
      while (q + 5 <= son) {
        const tur = b[q], eil = bit(q + 3) & 0x0fff;
        if (TS_AUDIO_TIPLERI.has(tur)) {
          let d = q + 5; const dSon = Math.min(d + eil, son);
          while (d + 2 <= dSon) {
            const etiket = b[d], uzunluk = b[d + 1];
            if (etiket === 0x0A && d + 5 <= dSon) { // ISO-639-2 language descriptor
              const kod = dilKodla(String.fromCharCode(b[d + 2], b[d + 3], b[d + 4]));
              if (kod) kodlar.add(kod);
            }
            d += 2 + uzunluk;
          }
        }
        q += 5 + eil;
      }
    }
  }
  return kodlar;
}
/** fMP4/MP4: her yerde 'mdhd' ara, paketlenmiş ISO-639 dilini oku. */
function mp4SesDilleri(b) {
  const kodlar = new Set();
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  for (let i = 0; i + 24 <= b.length; i++) {
    if (b[i] === 0x6d && b[i + 1] === 0x64 && b[i + 2] === 0x68 && b[i + 3] === 0x64) {
      const ver = b[i + 4];
      const of = ver === 1 ? i + 36 : i + 24;
      if (of + 1 < b.length) {
        const p = dv.getUint16(of);
        const iso = String.fromCharCode(((p >> 10) & 31) + 0x60, ((p >> 5) & 31) + 0x60, (p & 31) + 0x60);
        const kod = dilKodla(iso);
        if (kod) kodlar.add(kod);
      }
    }
  }
  return kodlar;
}
/** Master/muxed → ilk segmandan (Range 256KB) ses dilleri; TS veya fMP4 sniff. */
async function segmanSesDilleri(masterMetni, masterUrl, ref) {
  try {
    let vUrl = masterUrl, pl = masterMetni;
    if (!/#EXTINF:/.test(pl)) {
      const varM = pl.match(/#EXT-X-STREAM-INF:[^\n]*\n\s*([^\s#][^\n]*)/);
      if (!varM) return [];
      vUrl = new URL(varM[1].trim(), masterUrl).href;
      pl = await oku(vUrl, { ref, ms: 9000 });
      if (!/#EXTM3U/.test(pl)) return [];
    }
    const segM = pl.match(/\n\s*([^\s#][^\n]*)/);
    if (!segM) return [];
    const segUrl = new URL(segM[1].trim(), vUrl).href;
    const r = await fetch(segUrl, {
      headers: { 'User-Agent': UA, Referer: ref, Range: 'bytes=0-262143' },
      signal: typeof AbortSignal?.timeout === 'function' ? AbortSignal.timeout(12000) : undefined,
    });
    if (!(r.ok || r.status === 206)) return [];
    const b = new Uint8Array(await r.arrayBuffer());
    if (b.length > 12 && b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) return [...mp4SesDilleri(b)];
    for (let i = 0; i < 188 && i < b.length; i++) if (b[i] === 0x47) return [...tsSesDilleri(b)];
  } catch (_) {}
  return [];
}
/** Kanıtlı ses satırları planı; HİÇ kanıt yoksa null → eski tek-satır davranışı. */
function sesPlani(kanit, beyan, segDil) {
  if (kanit.sesler.length) {
    return kanit.sesler.map((s, i) => {
      const kod = dilKodla(s.lang) || dilKodla(s.name);
      const bey = beyan.find((x) => x?.name && s.uri && s.uri.includes('stream_' + x.name)) || beyan[i] || {};
      return { kod: kod && kod !== 'und' ? kod : null, varsayilan: String(bey.label || '') };
    });
  }
  const kodlar = (segDil || []).filter((d) => d && d !== 'und');
  if (kodlar.length) return [{ kod: kodlar.includes('tr') ? 'tr' : kodlar[0], varsayilan: kodlar.includes('tr') ? 'Türkçe Dublaj' : '' }];
  return null;
}

/* 4) master m3u8 → kalite + SES HARİTASI (TYPE=AUDIO satırları uri'siyle).
      Dublaj rozeti YALNIZ LANGUAGE="tr|tur" / NAME="Türk…" kanıtıyla konur. */
async function kanitla(master, ref) {
  const metin = await oku(master, { ref, ms: 9000 });
  if (!/#EXTM3U/.test(metin)) return null;
  const sesler = [...metin.matchAll(/#EXT-X-MEDIA:([^\n]*TYPE=AUDIO[^\n]*)/gi)].map((m) => {
    const at = (n) => (m[1].match(new RegExp(n + '="([^"]*)"')) || m[1].match(new RegExp(n + '=([^,\\s]+)')) || [])[1] || '';
    return { name: at('NAME'), lang: at('LANGUAGE'), uri: at('URI') };
  });
  const trSatir = sesler.find((s) => dilKodla(s.lang) === 'tr' || dilKodla(s.name) === 'tr');
  const yuk = (metin.match(/RESOLUTION=\d+x(\d+)/g) || []).map((x) => Number((x.match(/x(\d+)/) || [])[1])).filter(Boolean);
  const h = yuk.length ? Math.max(...yuk) : 720;
  const kalite = h >= 2000 ? '4K' : h >= 1000 ? '1080p' : h >= 700 ? '720p' : h >= 400 ? '480p' : '360p';
  return {
    trSes: Boolean(trSatir),
    trSesKanit: trSatir ? `LANGUAGE="${trSatir.lang}" NAME="${trSatir.name}"` : '',
    sesler, metin, sesSayisi: sesler.length, kalite,
  };
}

const ONBELLEK = new Map();
const ONBELLEK_MS = 15 * 60 * 1000;
const UCAN = new Map();

export async function getStreams(kimlik, tur = 'tv', sezon = 1, bolum = 1) {
  const kim = (kimlik && typeof kimlik === 'object') ? (kimlik.tmdbId || kimlik.id || kimlik.imdbId || '') : kimlik;
  const bilgi = await tmdbBilgi(kim, tur);
  const adaylar = bilgi ? adayBasliklar(bilgi) : [];
  if (!adaylar.length) return [];
  const isTv = tur === 'tv';

  const anahtar = `${isTv ? 'tv' : 'movie'}:${bilgi?.baslik || kim}:${+sezon || 1}:${+bolum || 1}`;
  const hazir = ONBELLEK.get(anahtar);
  if (hazir && Date.now() - hazir.t < ONBELLEK_MS) return hazir.sonuc;
  if (UCAN.has(anahtar)) return UCAN.get(anahtar);

  const is = (async () => {
    /* 1) içerik sayfası (yıl kapısı sayfaBul içinde: uymayan aday atlanır) */
    const sayfa = await sayfaBul(adaylar, isTv, bilgi?.yil || 0);
    if (!sayfa) return [];

    /* 2) bölüm URL'i: /series/<slug>/season/S/episode/E ; film: sayfanın kendisi */
    const izlemeUrl = isTv
      ? `${sayfa.url.replace(/\/$/, '')}/season/${+sezon || 1}/episode/${+bolum || 1}`
      : sayfa.url;
    const izleme = await oku(izlemeUrl, { ref: SITE + '/' });
    if (!izleme) return [];
    const pvler = pvAdlari(izleme).slice(0, 3);
    if (!pvler.length) return [];

    /* 3) her data-pv → embed config'i → master → kanıt (paralel) */
    const olcumler = await Promise.allSettled(pvler.map(async ({ slug, base }) => {
      const embedUrl = `${base}/assets/js/s.php?s=${encodeURIComponent(slug)}`;
      const embed = await oku(embedUrl, { ref: izlemeUrl }); // referersiz 403 (ölçüldü)
      const cfg = oynaticiAyar(embed);
      const master = String(cfg?.stream || '');
      if (!/^https?:/i.test(master)) return null;
      const kanit = await kanitla(master, embedUrl);
      if (!kanit) return null;
      // TR altyazı: __PLAYER__.subs lang:"tr" + sub.php WEBVTT doğrulaması
      const trSub = (Array.isArray(cfg.subs) ? cfg.subs : []).find((s) => /^tr/i.test(String(s?.lang || '')) || /t[uü]rk/i.test(String(s?.label || '')));
      let altyaziUrl = '';
      if (trSub?.src && /^https?:/i.test(trSub.src)) {
        const vtt = await oku(String(trSub.src), { ref: base + '/', ms: 8000 });
        if (/^\s*WEBVTT/i.test(vtt)) altyaziUrl = String(trSub.src);
      }
      // Ses planı: ① master TYPE=AUDIO satırları (Oppenheimer/Ters Yüz/Deadpool
      // çift ses: LANGUAGE="tr" + "en") ② satır YOKSA muxed PMT/mdhd probu
      // (One Piece/Dark: site audios[]'da "Türkçe Dublaj" der, master susar)
      // ③ hiçbiri → null → tek satır, rozetsiz (site beyanı yalnız ipucu olur).
      const beyan = Array.isArray(cfg.audios) ? cfg.audios : [];
      let plan = sesPlani(kanit, beyan, null);
      if (!plan) {
        const segDil = await segmanSesDilleri(kanit.metin, master, embedUrl);
        plan = sesPlani(kanit, beyan, segDil);
      }
      const beyanTr = beyan.some((b) => dilKodla(b?.lang) === 'tr' || /t[uü]rk/i.test(String(b?.label || '')));
      return { kanit, altyaziUrl, embedUrl, master, plan, beyanTr, baslik: String(cfg?.title || '') };
    }));

    const sonuc = [];
    for (const o of olcumler) {
      if (o.status !== 'fulfilled' || !o.value) continue;
      const { kanit, altyaziUrl, embedUrl, master, plan, beyanTr } = o.value;
      const taban = {
        name: AD,
        url: master, // varyant URI'leri göreli; oynatıcı master adresine göre çözer
        quality: kanit.kalite,
        format: 'm3u8',
        isM3u8: true,
        headers: { 'User-Agent': UA, Referer: embedUrl },
        proxyGerekmez: true, // token JWT'si origin'e anahtanlı: vekilden geçerse 403 riski
        ...(altyaziUrl ? { altyaziUrl } : {}),
      };
      const adEtiket = (k, varsayilan) => k === 'tr' ? 'Türkçe Dublaj' : k === 'en' ? 'İngilizce' : (varsayilan || 'Orijinal');
      if (plan && plan.length > 1) {
        // SES BAŞINA SATIR: dil kanıtı her satırın kendi EXT-X-MEDIA/PMT satırı
        plan.forEach((ses, i) => {
          const altyaziSatiri = i === 0 && Boolean(altyaziUrl);
          sonuc.push({
            ...taban,
            title: `${AD} · Pilavyer · ${kanit.kalite} · ${adEtiket(ses.kod, ses.varsayilan)}${altyaziSatiri ? ' · TR Altyazı' : ''} · ${plan.length} Ses`,
            diller: ses.kod === 'tr' ? ['tr'] : (altyaziSatiri ? ['altyazi'] : []),
            trSes: ses.kod === 'tr',
            trAltyazi: altyaziSatiri,
            dilDurumu: ses.kod === 'tr' ? 'dublaj' : (altyaziSatiri ? 'altyazi' : (ses.kod ? 'orijinal' : undefined)),
          });
        });
        continue;
      }
      const trKaniti = plan?.[0]?.kod === 'tr' || kanit.trSes;
      const etiket = trKaniti ? 'Türkçe Dublaj' : (altyaziUrl ? 'TR Altyazı' : 'Orijinal');
      sonuc.push({
        ...taban,
        title: `${AD} · Pilavyer · ${kanit.kalite} · ${etiket}${kanit.sesSayisi > 1 ? ` · ${kanit.sesSayisi} Ses` : ''}${!trKaniti && !altyaziUrl && beyanTr ? ' · site beyanı: Türkçe Dublaj' : ''}`,
        diller: trKaniti ? ['tr'] : (altyaziUrl ? ['altyazi'] : []),
        trSes: trKaniti,
        trAltyazi: Boolean(altyaziUrl),
        dilDurumu: trKaniti ? 'dublaj' : (altyaziUrl ? 'altyazi' : 'orijinal'),
      });
    }

    if (sonuc.length) ONBELLEK.set(anahtar, { t: Date.now(), sonuc });
    if (ONBELLEK.size > 200) ONBELLEK.delete(ONBELLEK.keys().next().value);
    return sonuc;
  })();

  UCAN.set(anahtar, is);
  try { return await is; } finally { UCAN.delete(anahtar); }
}

if (typeof globalThis !== 'undefined') {
  globalThis.getStreams = getStreams;
  globalThis.__cpPhyla = getStreams;
}
export default getStreams;
