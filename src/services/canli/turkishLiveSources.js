/* ==========================================================================
   CinePulse - Turk Canli TV kaynaklari (istemci tarafi)
   Kaynaklar sunucu tarafinda cozulur (/api/live_sources):
     kral   → GitHub raw .m3u_plus  (1860+ kanal, canli TS + HLS)
     turhan → Fixbet/Inatt kanallari (domain.php ile cozulen m3u8)
   Neden sunucudan? Dropbox CORS vermiyor, yayinlar Cloudflare korumali;
   cozumleme kullanici/Vercel IP'siyle yapilirsa engel kalkiyor.

   Varsayilan kaynak "ilk acilan" ilke: acilista hepsi denenir, yanit veren
   kaynaklar hiz sirasiyla one alinir ve secim kalici olarak saklanir.
   ========================================================================== */

import { apiUrl, isNativeCapacitor, isLocalDevHost } from '../altyapi/apiOrigin.js';
// _liveSources.js saf (Node-only API icermeyen) bir modul: ayni M3U ayristirici
// hem sunucuda hem tarayicida calisir. Boylece sunucu endpoint'i yoksa bile
// GitHub raw (CORS acik) uzerinden Kral listesi dogrudan alinabilir.
import { KRAL_M3U_ENDPOINT, parseKralChannels } from '../../../api/_liveSources.js';

const LS_KEY = 'cp_live_sources_v1';
const ORDER_KEY = 'cp_live_source_order_v1';
const DEFAULT_KEY = 'cp_live_source_default_v1';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;   // 6 saat
const STALE_TTL_MS = 48 * 60 * 60 * 1000;  // ag hatasi payi: 48 saat

export const LIVE_SOURCES = [
  { id: 'kral', label: 'Pulsar 1', icon: 'tv' },
  { id: 'izlego', label: 'Pulsar 3', icon: 'globe' },
  { id: 'turhan', label: 'Pulsar 2', icon: 'radio-tower' }
];

// Görünür etiket tek yerden: sunucu tarafı (api/_liveSources.js) bu üç kaynağı
// "Pulsar 1/2/3"e çevirdi — istemci AYNI adı kullanır (gerçek kaynak adları yalnız
// kod yorumlarında kalır). id sabittir; etiket HER ZAMAN id'den üretilir, yoksa
// eski localStorage önbelleklerindeki adlar ekrana sızabilirdi.
const YAYIN_ETIKETI = { kral: 'Pulsar 1', turhan: 'Pulsar 2', izlego: 'Pulsar 3' };
function gorunurEtiket(id, eskiLabel) {
  return YAYIN_ETIKETI[id] || eskiLabel || id;
}

// Relative API yolunu platformun dogru origin'ine cevirir.
// Desktop -> yerel sidecar, APK -> Vercel, web -> ayni origin.
function sourcesEndpoint() {
  const path = '/api/live_sources';
  if (typeof window !== 'undefined' && isLocalDevHost()) return path;
  if (typeof window !== 'undefined' && !isNativeCapacitor()) {
    // Web (vercel/github.io): ayni origin yeterli.
    const host = window.location?.hostname || '';
    if (host) return path;
  }
  return apiUrl(path);
}

function readStore() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (_) {
    return {};
  }
}

// localStorage kotası dolduğunda düşen kaynaklar burada tutulur; böylece
// oturum boyunca liste boş kalmaz (bir sonraki açılışta tekrar denenir).
let memoryCache = {};

/**
 * Onbelleğe yazmadan once listeyi budak (payload ~518 KB → ~300 KB).
 * Budanan alanlar oynatma/EPG akisinda hic kullanilmaz:
 *   logo  → yerel /tv-logos eslesmesi ya da SVG rozet kullanilir; 1800 uzak
 *           logo istegi yapmak hem yavas hem de localStorage'i dolduruyor.
 *   headers → yalnizca #EXTVLCOPT tasiyan ~50 kanalda dolu.
 */
function slimChannels(channels) {
  const out = new Array(channels.length);
  for (let i = 0; i < channels.length; i++) {
    const c = channels[i];
    const h = c.headers;
    const hasHeaders = h && (h.ua || h.ref || h.origin);
    out[i] = {
      name: c.name,
      streamUrl: c.streamUrl,
      tvgId: c.tvgId || '',
      category: c.category || 'national',
      quality: c.quality || 'HD',
      isTs: c.isTs === true
    };
    if (hasHeaders) out[i].headers = h;
  }
  return out;
}

function writeSource(id, entry) {
  try {
    const store = readStore();
    store[id] = { ...entry, channels: slimChannels(entry.channels) };
    localStorage.setItem(LS_KEY, JSON.stringify(store));
    return true;
  } catch (_) {
    // Kota doldu: veriyi bellekte tutmaya devam et (gecici bellek onbellegi).
    memoryCache[id] = { ...entry, savedAt: entry.savedAt || Date.now() };
    return false;
  }
}

function pruneStore() {
  try {
    const store = readStore();
    const now = Date.now();
    for (const id of Object.keys(store)) {
      const e = store[id];
      if (!e || !e.savedAt || now - e.savedAt > STALE_TTL_MS) delete store[id];
    }
    localStorage.setItem(LS_KEY, JSON.stringify(store));
  } catch (_) {}
}

/** Onbellekten anlik okuma (acilis ekraninda beklemeden boyamak icin). */
export function getCachedSource(id) {
  const entry = readStore()[id] || memoryCache[id];
  if (!entry || !Array.isArray(entry.channels) || !entry.channels.length) return null;
  const age = Date.now() - (entry.savedAt || 0);
  return {
    id,
    label: gorunurEtiket(id, entry.label),
    channels: entry.channels,
    count: entry.channels.length,
    savedAt: entry.savedAt,
    stale: age > CACHE_TTL_MS
  };
}

export function getAllCachedSources() {
  return LIVE_SOURCES.map((s) => getCachedSource(s.id)).filter(Boolean);
}

/**
 * Kaynaklari tazeler. Oncelik sirasi:
 *   1) sunucu endpoint'i (sidecar / Vercel) — hepsini tek istekte cozer
 *   2) endpoint yoksa/hataysa Kral M3U'su dogrudan GitHub raw'dan (CORS acik)
 *   3) hicbiri yoksa onbellekten duser (ag hatasi payi)
 * Donus: gercekten calisan kaynaklar.
 */
export async function refreshLiveSources({ force = false } = {}) {
  pruneStore();
  const store = readStore();
  const now = Date.now();
  const allFresh = LIVE_SOURCES.every((s) => {
    const e = store[s.id];
    return e && Array.isArray(e.channels) && e.channels.length && now - (e.savedAt || 0) < CACHE_TTL_MS;
  });
  if (!force && allFresh) return orderSources(getAllCachedSources());

  let payload = null;
  try {
    const res = await fetch(sourcesEndpoint(), {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(45000)
    });
    if (res.ok) payload = await res.json().catch(() => null);
  } catch (_) {
    payload = null;
  }

  const sources = Array.isArray(payload?.sources) ? payload.sources : [];
  const gotIds = new Set();
  for (const s of sources) {
    if (!s || !s.ok || !Array.isArray(s.channels) || !s.channels.length) continue;
    gotIds.add(s.id);
    writeSource(s.id, {
      label: gorunurEtiket(s.id, s.label),
      channels: s.channels,
      savedAt: Number(payload?.savedAt) || Date.now()
    });
  }

  // Yedek yol: sunucu kral listesini vermediyse dogrudan GitHub raw'dan cek.
  // (Turhan CORS kapali oldugu icin yalnizca sunucudan gelebilir.)
  if (!gotIds.has('kral')) {
    const direct = await fetchKralDirect().catch(() => null);
    if (direct && direct.length) {
      writeSource('kral', { label: 'Pulsar 1', channels: direct, savedAt: Date.now() });
    }
  }

  return orderSources(getAllCachedSources());
}

/** GitHub raw M3U'yu dogrudan cek (CORS acik, sunucuya gerek yok). */
async function fetchKralDirect() {
  const res = await fetch(KRAL_M3U_ENDPOINT, {
    signal: AbortSignal.timeout(30000)
  });
  if (!res.ok) throw new Error(`M3U HTTP ${res.status}`);
  const text = await res.text();
  const channels = parseKralChannels(text);
  if (!channels.length) throw new Error('M3U ayrıştırılamadı');
  return channels;
}

function orderSources(sources) {
  const registryOrder = new Map(LIVE_SOURCES.map((s, i) => [s.id, i]));
  return [...sources].sort((a, b) => {
    // Onbellek sirasi = son calisan sirasi (default secimi), yoksa kayit sirasi.
    const oa = getSourceOrder().indexOf(a.id);
    const ob = getSourceOrder().indexOf(b.id);
    const ia = oa === -1 ? 999 : oa;
    const ib = ob === -1 ? 999 : ob;
    if (ia !== ib) return ia - ib;
    const ra = registryOrder.has(a.id) ? registryOrder.get(a.id) : 99;
    const rb = registryOrder.has(b.id) ? registryOrder.get(b.id) : 99;
    return ra - rb;
  });
}

function getSourceOrder() {
  try {
    const raw = localStorage.getItem(ORDER_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function setSourceOrder(ids) {
  try { localStorage.setItem(ORDER_KEY, JSON.stringify(ids)); } catch (_) {}
}

/** Calisan ilk kaynak varsayilan olur (kullanicinin istegi). */
export function getDefaultSourceId(sources) {
  const list = sources && sources.length ? sources : getAllCachedSources();
  let saved = '';
  try { saved = localStorage.getItem(DEFAULT_KEY) || ''; } catch (_) {}
  if (saved && list.some((s) => s.id === saved)) return saved;
  const first = list[0];
  return first ? first.id : LIVE_SOURCES[0].id;
}

export function setDefaultSourceId(id) {
  try { localStorage.setItem(DEFAULT_KEY, String(id || '')); } catch (_) {}
}

/**
 * Kaynaklari sirayla dener, ilk acilani default yapar. Donus:
 *   { order: [id,...], defaultId, sources: [...] }
 */
export async function probeLiveSources() {
  const sources = await refreshLiveSources();
  const order = sources.map((s) => s.id);
  setSourceOrder(order);
  const defaultId = order.length ? order[0] : getDefaultSourceId(sources);
  setDefaultSourceId(defaultId);
  return { order, defaultId, sources };
}

/**
 * Varsayilan kaynaktan tum kanallari tek listede dondurur.
 *
 * Ayni kanal M3U listesinde cogu kez birden fazla adresle geciyor (orn. BeIN
 * Sports 4K 11 farkli adresle). Bunlarin cogu zaman degil, cogu zaman biri
 * olu/olu (bazen HLS, bazen TS). Bu yuzden ilk adres "Varsayilan Yayin"
 * olur, kalanlar altStreams'e konur; oynatici mevcut kaynak degistirme
 * zincirini (srcList/advanceOrError) kullanarak onlari otomatik dener.
 *
 * 1800+ kanalda her biri icin uzaktan logo istemek pahali oldugu icin logo
 * yalnizca yerel eslesme (/tv-logos) varsa kullanilir, yoksa SVG rozet.
 */
/**
 * Kanal listesini duzenler.
 *  - Turkce kanallar one
 *  - ayni adi tasiyan kanallar tekillestirilir (en cok yedekli kaynak secilir)
 *  - uluslararasi kanallar listenin sonuna atilir; arayuzde varsayilan olarak
 *    gizlidir (showInternational=false)
 */
export function buildChannels(sources, { resolveLogo, maxAlt = 6, maxTurkish = 300 } = {}) {
  const out = [];
  const byName = new Map();
  for (const src of sources || []) {
    for (const ch of src.channels || []) {
      if (!ch || !ch.name || !ch.streamUrl) continue;
      // Teknik yedek yayınlar aynı kanalın farklı akışları; kullanıcıya
      // gereksiz gürültü olarak görünüyor ("BeIN Sports FEED1").
      if (/\bFEED\s*\d*\b|\bBACKUP\b|\bYEDEK\s*\d*\b|\bTEST\b|\bDEMO\b/i.test(ch.name)) continue;
      // Radyo istasyonları TV ızgarasına girmez: ses-only yayınlar oynatıcıda
      // "ses var görüntü yok" gibi algılanıyor (ölçüldü: EFKAR FM, RADYO
      // 45'LİK, RADYO TATLISES havuzdaydı; kullanıcı TV kanalı istiyor).
      if (/\b(RADYO|RADIO|FM)\b/i.test(ch.name)) continue;
      // Yabancı (ağırlıkla ALMAN) kanallar: kaynağın 1834 kanalının 906'sı
      // Alman; adları "DE: …", grupları "DE | …"/"BOUQUET GERMANY".
      // Kullanıcı (2026-10-17): "Alman kanalları da var hâlâ".
      if (yabanciKanalMi(ch.name, ch.group)) continue;
      // Türkçe kanıtı olmayan kayıtlar listeye girmez. ÖNEMLİ: kanallar
      // "TR: ATV", "TR - NICKTOONS" gibi ÖNEKLİ geliyor; birebir beyaz liste
      // bunları kaçırdığı için "çoğu Türk kanalı yok" deniyordu.
      if (!turkKanalMi(ch.name, ch.group, ch.region)) continue;
      // Kullanıcı (2026-10-17): "sadece m3u8 benzeri kaynakları al" — HLS
      // olmayan kayıt ELENMEZ, YEDEK olur (aşağıda HLS ana yayına yükseltilir;
      // HLS yedeği olmayan kanal listenin sonunda tamamen düşer).
      // Aynı kanalın farklı kaynaklardaki kopyaları TEK kayda iner: HLS (.m3u8)
      // olan ANA yayın, kalanlar (TS/rtmp dahil) aynı kanalın YEDEKLERİ
      // (altStreams) olur — oynatıcı ana yayın ölürse sıradakine geçer.
      let anahtar = kanalAnahtari(ch.name);
      if (!anahtar) continue;
      /* "BENGU TURK" ↔ "TR: BENGU TURK TV": aynı kanal "… TV" uzantısıyla da
         yazılabiliyor (ÖLÇÜLDÜ: gerçek listede iki ayrı kanal gibi duruyorlardı).
         Yalnızca KARŞI BİÇİM ZATEN HAVUZDA VARSA birleştirilir; böylece iki
         ayrı marka yanlışlıkla birleşmez. Uzunluk kuralı "ATV → A" gibi
         tehlikeli kısaltmaları engeller. */
      if (!byName.has(anahtar)) {
        const kisa = anahtar.replace(/TV$/, '');
        const uzun = `${anahtar}TV`;
        // Cihazda görüldü (apk42): "A2" ve "A2 TV" yan yana iki karttı.
        // Birleştirme YALNIZ karşı biçim havuzda zaten varsa yapılıyor.
        if (kisa.length >= 2 && kisa !== anahtar && byName.has(kisa)) anahtar = kisa;
        else if (byName.has(uzun)) anahtar = uzun;
      }
      const hlsMi = hlsKaynakMi(ch.streamUrl, ch.isTs);
      const existing = byName.get(anahtar);
      if (!existing) {
        const channel = {
          id: `${src.id}_${stableId(ch.name, ch.streamUrl)}`,
          srcKey: src.id,
          srcLabel: gorunurEtiket(src.id, src.label),
          name: gorunurAd(ch.name),
          logo: (typeof resolveLogo === 'function' && resolveLogo(gorunurAd(ch.name))) || '',
          category: kategoriBelirle(gorunurAd(ch.name), ch.category),
          quality: ch.quality || 'HD',
          tvgId: ch.tvgId || '',
          group: ch.group || '',
          region: ch.region === 'INT' ? 'INT' : 'TR',
          streamUrl: ch.streamUrl,
          isTs: ch.isTs === true,
          headers: ch.headers || null,
          hlsKaynak: hlsMi,
          altStreams: []
        };
        byName.set(anahtar, channel);
        out.push(channel);
        continue;
      }
      /* KANIT (2026-10-17 — kanal-kalite-probe): kör "HLS ana yayına yükseltilir"
         kuralı_bozdu: HLS aynalarının bazıları 404 (TRT Spor, A Haber) veya
         hiç cevap vermiyor (Cartoon Network), aynı kanalın TS yayını ise 200
         dönüyordu. Sonuç kullanıcıda "ses var görüntü yok / sonsuz bağlanılıyor".
         Bu yüzden SIRA KORUNUR (kaynak sırasındaki ilk kayıt ana yayındır),
         HLS yedekleri LISTENIN BASSINA sıralanır; hangi yayının gerçekten
         yaşadığına cihazdaki sağlık denetimi karar verir ve kazanan ana yayına
         terfi eder (LiveTvView → cp_live_primary_v1, "duruma göre en stabili"). */
      if (existing.category === 'national') {
        existing.category = kategoriBelirle(existing.name, ch.category);
      }
      if (existing.altStreams.length >= maxAlt) continue;
      if (ch.streamUrl === existing.streamUrl) continue;
      if (existing.altStreams.some((a) => a.url === ch.streamUrl)) continue;
      existing.altStreams.push({
        url: ch.streamUrl,
        isTs: ch.isTs === true,
        headers: ch.headers || null
      });
    }
  }
  // Yedekler sıralanır: HLS (.m3u8) her zaman TS'den ÖNCE denenir. HLS
  // fragmanlıdır ve ilk kare hızlı gelir; düz MPEG-TS oynatıcının tampon
  // doldurmasını bekletir (kullanıcı: "yayına bağlanılıyor" diye dakikalar).
  for (const c of out) {
    c.altStreams.sort((a, b) => (hlsKaynakMi(a.url, a.isTs) ? 0 : 1) - (hlsKaynakMi(b.url, b.isTs) ? 0 : 1));
  }
  // Kullanıcı (2026-10-17): "sadece m3u8 benzeri kaynakları al" + "DMAX ve TLC
  // neden yok". ÖLÇÜM (gerçek Kral listesi): DMAX/TLC/Discovery'nin listedeki
  // TEK adresi MPEG-TS (`isTs: true`, uzantısız). HLS zorunlu tutulunca bu
  // kanallar tamamen kayboluyordu. Bu yüzden HLS ZORUNLU DEĞİL: HLS'li kanallar
  // listede öne alınır, HLS'siz olanlar TS yedekle listeye girer; çalışmayanı
  // cihazdaki sağlık denetimi (LiveTvView) listeden çıkarır veya yaşayan
  // yedeği ana yayına terfi ettirir.
  // (HLS bayrağı aşağıdaki sıralamada kullanılır; kesimden sonra silinir.)
  // ── Liste düzeni ────────────────────────────────────────────────
  // Süzgeç zaten kanal döngüsünde uygulandı (yabancı/Türkçe kanıtı). Burada
  // yalnız SIRALAMA ve üst sınır var:
  //   1) Öne çıkan ulusal markalar (populerMi) en başta,
  //   2) sonra ulusal → haber → sinema/dizi → çocuk → spor → müzik → belgesel,
  //   3) yerel/şehir kanalları listenin devamında.
  // Kullanıcı isteği (2026-10-17): "popüler kanalları daha da fazla yap; yerel
  // şehir kanalları da ekle" → liste artık yüzlerce GERÇEK Türk kanalı içeriyor,
  // Alman/çöp kanallar elendi.
  const KATEGORI_ONCELIK = { national: 0, news: 1, movie: 2, series: 2, kids: 3, sports: 4, music: 5, doc: 6, other: 7 };
  // Sıra: 0) öne çıkan marka, 1) YEREL/ŞEHİR kanalı, 2+) kategori önceliği.
  // Yerel kanallar öne alınmazsa üst sınır onları alfabetik olarak kesiyordu
  // (kullanıcı: "yerel şehir kanalları da ekle").
  const oncelik = (c) => (populerMi(c.name) ? 0 : yerelKanalMi(c.name) ? 1 : (KATEGORI_ONCELIK[c.category] ?? 7) + 2);
  const karsilastir = (a, b) => {
    const pa = oncelik(a);
    const pb = oncelik(b);
    if (pa !== pb) return pa - pb;
    const ha = a.hlsKaynak ? 0 : 1;
    const hb = b.hlsKaynak ? 0 : 1;
    if (ha !== hb) return ha - hb;
    return String(a.name).localeCompare(String(b.name), 'tr');
  };
  out.sort(karsilastir);

  /* ── KOTA: her kategori listeye girmeli ───────────────────────────────
     ÖLÇÜLDÜ (apk42): 300 kanalın 193'ü 'national' doluyor, Belgesel ve Müzik
     kategorileri BOŞ kalıyordu → kullanıcı: "kanalı aratınca çıkıyor ama
     kategorilerde yok; kategorileri bağla".
     Sıra önemli: popüler + yerel kanallar HER ŞEYİ tüketebiliyor (679 kayıtlık
     havuzda tek başına 300'ü dolduruyorlar), bu yüzden ulusal olanlar SONRA
     ve tavanlı alınır; kategori tabanları onlardan önce yer. */
  const KATEGORI_TABAN = { doc: 20, music: 16, kids: 24, sports: 30, news: 30 };
  const ULUSAL_TAVAN = Math.round(maxTurkish * 0.55);
  const secilen = [];
  const secildiMi = new Set();
  const kategoriSayisi = {};
  const al = (c) => {
    if (secildiMi.has(c) || secilen.length >= maxTurkish) return;
    secildiMi.add(c);
    secilen.push(c);
    kategoriSayisi[c.category] = (kategoriSayisi[c.category] || 0) + 1;
  };
  const ulusalDolu = () => (kategoriSayisi.national || 0) >= ULUSAL_TAVAN;

  // 1) Öne çıkan markalar + yerel şehir kanalları — ULUSAL dışı olanlar (beIN,
  //    A Haber, TRT Çocuk gibi markalar kategorilerinde zaten sayılıyor).
  out.forEach((c) => { if (oncelik(c) <= 1 && c.category !== 'national') al(c); });
  // 2) Kategori tabanları: sıralama popüler→HLS→alfabe olduğu için her
  //    kategorinin EN İYİ kayıtları girer (havuzdaki tüm belgesel/müzik böyle
  //    listeye çıkar).
  for (const [kategori, taban] of Object.entries(KATEGORI_TABAN)) {
    if ((kategoriSayisi[kategori] || 0) >= taban) continue;
    for (const c of out) {
      if ((kategoriSayisi[kategori] || 0) >= taban || secilen.length >= maxTurkish) break;
      if (c.category === kategori) al(c);
    }
  }
  // 3) Ulusal markalar + yerel ulusal kanallar (tavana kadar).
  out.forEach((c) => { if (oncelik(c) <= 1 && !ulusalDolu()) al(c); });
  // 4) Kalan yer: sırayla; ulusal tavanı aşmadan.
  for (const c of out) {
    if (secilen.length >= maxTurkish) break;
    if (c.category === 'national' && ulusalDolu()) continue;
    al(c);
  }
  // 5) Tavan yüzünden boş kalan yer olursa (diğer kategoriler bitti) ulusal ile tamamla.
  for (const c of out) {
    if (secilen.length >= maxTurkish) break;
    al(c);
  }
  secilen.sort(karsilastir);
  const kesilmis = secilen;
  for (const c of kesilmis) delete c.hlsKaynak;
  return kesilmis;
}

function normalizeName(name) {
  return String(name || '')
    .toLocaleUpperCase('tr-TR')
    .replace(/\b(?:HD|FHD|4K|UHD|SD|KANALI|KANAL)\b/g, '')
    .replace(/[^A-ZÇĞİÖŞÜ0-9]/g, '');
}

/* Türkçe harfleri ASCII'ye indirir: M3U listeleri hem "TRT ÇOCUK" hem
   "TRT COCUK" yazar; marka eşleşmesi ikisini de yakalamalı. */
const asciiYap = (s) => String(s || '')
  .replace(/İ/g, 'I').replace(/Ş/g, 'S').replace(/Ğ/g, 'G')
  .replace(/Ü/g, 'U').replace(/Ö/g, 'O').replace(/Ç/g, 'C');
/** Marka/şehir karşılaştırma anahtarı: büyük harf + ASCII + yalnız harf/rakam. */
const sadele = (s) => asciiYap(normalizeName(s));

/* ── Ülke öneki temizliği ─────────────────────────────────────────────────
   ÖLÇÜLDÜ (2026-10-17): Kral listesindeki Türk kanalları "TR: ATV",
   "TR - NICKTOONS", "|TR| SHOW TV" biçiminde geliyor. Beyaz liste birebir ad
   karşılaştırdığı için bunlar görünmüyordu ("çoğu Türk kanalı da yok hâlâ").
   Ayrıca aynı kanal "TV8" ve "TR: TV8" olarak iki kez listeleniyordu. */
const TR_ONEK_RE = /^\s*\|?\s*(?:TR|TUR|TURKIYE|TÜRKİYE)\s*[-:|]\s*/i;
function onekTenizle(ad) {
  return String(ad || '').replace(TR_ONEK_RE, '').replace(/^\s*[-–—]\s*/, '').trim();
}
/** Ekranda görünen ad: "TR: DMAX" → "DMAX", "TRT1 TR HD" → "TRT1".
 *  Kalite bilgisi kartta AYRI bir rozet olarak zaten gösteriliyor
 *  (canlı TV kartı: "TRT 1 · 1080p FHD · Popüler"), ada gömülü kalması
 *  gereksiz gürültüydü. "TR" yalnız SONDA ve tek başına atılır; "TRT TÜRK"
 *  gibi gerçek kanal adlarına dokunulmaz. */
function gorunurAd(ad) {
  const ham = String(ad || '').replace(/\s{2,}/g, ' ').trim();
  return onekTenizle(ham)
    .replace(/\s+\b(?:HD|FHD|UHD|4K|SD|1080P|720P|576P)\b\s*$/i, '')
    .replace(/\s+\b(?:TR|TUR)\s*$/i, '')
    .trim() || ham;
}

/* Kanal anahtarı = "hangi kanal?" sorusunun kimliği. ÖLÇÜLDÜ (cihaz, apk41):
   aynı kanal listede iki kez çıkıyordu —
     "TRT 1 1080p FHD" ↔ "280 TRT1 TR HD"
     "TRT Spor 1080p"  ↔ "273 TRT SPOR 1 HD" / "275 TRT SPOR TR 1440p"
   Yani ikinci kaynak adı sonuna " TR" ekliyor ve öneki/uzun yazımı farklı.
   Bu yüzden: ülke öneki + SONDAKİ TR/TÜRK eki + kalite sözcükleri atılır. */
/* NOT: JS'de \b yalnız ASCII harf/rakam için sınır tanır; "BENGÜTURK" içindeki
   "TURK" \b ile eşleşip kanal adını ortadan biçiyordu (testte yakalandı).
   Bu yüzden ülke eki SONDA ve ÖNÜNDE BOŞLUK varsa atılır: "TRT1 TR",
   "CNN TURK", "TRT SPOR TR" doğru; "BENGÜTURK" olduğu gibi kalır. */
const TR_SON_EK_RE = /\s+(?:TR|TUR|TURK|TURKIYE|TÜRKİYE|TÜRK)\s*$/i;
const KALITE_RE = /\b(?:HD|FHD|4K|UHD|SD|1080P|720P|576P)\b/gi;
export function kanalAnahtari(ad) {
  // SIRA ÖNEMLİ: kalite sözcükleri ÖNCE silinir. "TRT1 TR HD" örneğinde olduğu
  // gibi sonda kalite eki varsa, ülke eki onun arkasında kaldığı için
  // (test/cihaz: apk41'de "TRT 1" ile "TRT1 TR HD" iki ayrı kanal görünüyordu)
  // ülke eki hiç silinemiyordu ve aynı kanal iki kez listeleniyordu.
  return sadele(
    onekTenizle(String(ad || '')).replace(KALITE_RE, '').replace(TR_SON_EK_RE, '')
  );
}

/** Kullanıcı (2026-10-17): "sadece m3u8 benzeri kaynakları al". HLS olmayan
 *  (MPEG-TS / rtmp / udp / rtsp) kayıtlar cihazda oynamıyor: listeye girmez. */
function hlsKaynakMi(streamUrl, isTs) {
  if (isTs === true) return false;
  const u = String(streamUrl || '');
  if (!u) return false;
  return /\.m3u8(\?|#|$)/i.test(u) || /\/manifest\(|\/playlist/i.test(u);
}

/* ── KATEGORİ BELİRLEME ──────────────────────────────────────────────────
   ÖLÇÜLDÜ (cihaz, apk42): "kanalı aratınca buluyorum ama kategorilerde yok".
   Neden: Kral listesinde Türk kanalların grubu GENEL ("TR | GENERAL VIP",
   "TR | CINEMA VIP") geliyor → mapGroupToCategory hepsini 'national' sayıyor;
   Belgesel/Müzik kategorileri havuzda HİÇ kanal görmüyordu (doc 0, music 0).
   Kategori bilgisi aslında KANAL ADINDA duruyor (DMAX → belgesel, POWER TÜRK →
   müzik). Grup zaten spesifikse ona güvenilir, değilse ad'dan tahmin edilir. */
const KOC_COCUK_RE = /\b(COCUK|KIDS|KIDZ|CARTOON|CARTON|DISNEY|NICK|BOOMERANG|MINIKA|BABY|KUKULI|TOONS?|JR|PIWI|GUNAYDIN)\b/;
const KOC_SPOR_RE = /\b(SPOR|SPORT|SPORTS|SKOR|EUROSPORT|MATCH|MATCH?TV|FB|GS|BJK|FENER|GALATASARAY|BESEKTAS|TIVIBU|SMARTSPOR|A SPOR)\b/;
const KOC_BELGESEL_RE = /\b(BELGESEL|DOC|DOCUS|DISCOVERY|GEOGRAPHIC|GEO|DMAX|TLC|VIASAT|DAVINCI|VEEEK|LIFESTYLE|ANIMAL|ANIMALS|PLANET|HISTORY|CRIME|DESTINATION|SCIENCE|NASA|EARTH|WILD|TRAVEL|TARIM|ORMANCILIK|AVCILIK|BALIKCILIK|OUTDOOR|YASAM)\b/;
const KOC_MUZIK_RE = /\b(MUZIK|MUSIK|MUSIC|POWER|NUMBER ONE|DREAM|MTV|REMIX|KLIP|RADYO|POP|CONCERT|KRAL POP|TOP ?10|HIT)\b/;
const KOC_HABER_RE = /\b(HABER|HABERTURK|NEWS|CNN|NTV|BLOOMBERG|EKONOMI|PARA|FINAN|KRT|FLASH|SOZCU|HALK|AKIT|TELE1|ULUSAL|24)\b/;

function kategoriBelirle(ad, grupKategorisi) {
  const mevcut = String(grupKategorisi || 'national');
  if (mevcut && mevcut !== 'national') return mevcut;
  const a = asciiYap(String(ad || '').toLocaleUpperCase('tr-TR'));
  if (KOC_COCUK_RE.test(a)) return 'kids';
  if (KOC_SPOR_RE.test(a)) return 'sports';
  if (KOC_BELGESEL_RE.test(a)) return 'doc';
  if (KOC_MUZIK_RE.test(a)) return 'music';
  if (KOC_HABER_RE.test(a)) return 'news';
  return 'national';
}

/* ── YABANCI (özellikle ALMAN) KANAL İŞARETLERİ ───────────────────────────
   Kullanıcı (2026-10-17): "Alman kanalları da var hâlâ". Kaynak listesinin
   1834 kanalının 906'sı Alman; grupları "DE | …"/"BOUQUET GERMANY", adları
   "DE: …". Bu üç işaretten biri varsa kanal listelenmez. */
const YABANCI_ONEK_RE = /^\s*\|?\s*(?:DE|EN|FA|AR|FR|IT|ES|RU|PT|NL|PL|BG|GR|AZ|IN|PK|US|UK|AL)\s*[-:|]\s*/i;
const YABANCI_GRUP_RE = /^\s*(?:DE|DAZN|RTL|SKY|DYN|BOUQUET\s+GERMANY|SPORTTOTAL|SPORTDEUTSCHLAND|MAGENTA|EUROSPORT\s+EXTRA)/i;
const YABANCI_KELIME_RE = /\b(?:DEUTSCH\w*|MUSIK|GERMAN\w*|NACHRICHTEN|FERNSEHEN|BUNDESLIGA|FORMEL\s*1|PROSIEBEN|SAT\.?\s*1|KABEL\s*EINS|CLIPMYHORSE|BALLERMANN|BERGBLICK|SPORTTOTAL|ALONSO|ALBON|ALMAN\w*|ALMANYA|RUS\w*|RUSSIA|QURAN|ARABIC|WINDOWS\s*MEDIA|B[İI]L[İI]NMEYEN|NICHE)\b/i;
const ARAPCA_KIRIL_RE = /[\u0600-\u06FF\u0400-\u04FF\u0590-\u05FF]/;

function yabanciKanalMi(ad, group) {
  const a = String(ad || '');
  const g = String(group || '');
  if (YABANCI_ONEK_RE.test(a)) return true;
  if (YABANCI_GRUP_RE.test(g)) return true;
  if (YABANCI_KELIME_RE.test(a)) return true;
  if (ARAPCA_KIRIL_RE.test(a)) return true;
  // Adı ülke koduyla biten bozuk kayıtlar: "|---- |DE| DE Sports |DE| ----|"
  if (/\|\s*(?:DE|EN|FR|IT|ES|RU|AR)\s*\|/i.test(a)) return true;
  return false;
}

/* ── TÜRKÇE KANAL KANITI ─────────────────────────────────────────────────
   Kaynak "TR | GENERAL VIP", "TR ULUSAL-UHD", "HABER", "SPOR KANALI",
   "TR: COCUK", "Dizi Son Bölüm", "EXXEN SPORT" gibi Türkçe gruplar veriyor. */
const TURK_GRUP_RE = /\b(?:TR|ULUSAL|HABER|SPOR|SINEMA|CINEMA|DIZI|ÇOCUK|COCUK|KIDS|M[ÜU]Z[İI]K|BELGESEL|YEREL|GENEL|EXXEN|TAB[İI]{2}|T[İI]V[İI]T[ÜU]RK|VIP|ENTERTAINMENT|KAPANI[ŞS])\b|^\s*TR\s*[:\-|]|TR\s*\|/i;

function turkKanalMi(ad, group, region) {
  const a = String(ad || '');
  if (yabanciKanalMi(a, group)) return false;
  if (TR_ONEK_RE.test(a)) return true;          // "TR: KANAL 32"
  if (populerMi(a)) return true;                 // ulusal/haber/spor markaları
  if (yerelKanalMi(a)) return true;              // şehir + plaka kanalları
  if (TURK_GRUP_RE.test(String(group || ''))) return true;
  // Kaynak kanalı Türkçe diye işaretlemiş ve yabancı işareti yoksa kabul.
  return region !== 'INT';
}

/** Beyaz listedeki bir markayı ad içinde arar (ASCII + önek bağımsız). */
function populerMi(ad) {
  const k = sadele(onekTenizle(ad));
  if (!k) return false;
  for (const marka of POPULER_TR) {
    if (k === marka) return true;
    if (marka.length >= 4 && k.includes(marka)) return true;
  }
  return false;
}

/* ── POPÜLER TR KANAL BEYAZ LİSTESİ ────────────────────────────────────────
   Kullanıcı isteği (2026-10-17): "Sadece TR'de popüler kanalları göster; 380
   tane TR kanalını tamamen kaldır." Adlar `normalizeName` ile AYNI kurallardan
   geçirilir (HD/FHD/4K/KANALI atılır, harf/rakam dışı silinir), böylece M3U
   adı "TRT 1 HD" ile "TRT 1" eşleşir. Eşleşme az olursa buildChannels eski
   davranışa döner (boş liste riski yok). */
const POPULER_ADLAR = [
  // ── Ulusal ──
  'TRT 1', 'TRT 2', 'TRT 3', 'TRT Türk', 'TRT Avaz', 'TRT Kurdi', 'TRT World',
  'TRT EBA', 'TRT Radyo', 'ATV', 'A2', 'a TV', 'Show TV', 'Show Max', 'NOW TV',
  'Star TV', 'Kanal D', 'Kanal D2', 'TV8', 'TV8.5', 'Teve2', 'Beyaz TV',
  'TV 360', 'CNBC-e', 'Kanal 7', 'Kanal 7 Avrupa', 'Kanal 7 Int', 'Ülke TV',
  'TV 4', '360', 'TV 5', 'Kanal B', 'Beykent TV', 'Ekoyay TV',
  // ── Haber ──
  'TRT Haber', 'A Haber', 'A News', 'A Para', 'NTV', 'NTV Radyo', 'Habertürk',
  'Halk TV', 'Tele1', 'TV 100', 'Bloomberg HT', '24 TV', 'CNN Türk', 'TV Net',
  'Haber Global', 'KRT TV', 'Flash Haber', 'Bengütürk TV', 'Ulusal Kanal',
  'Sözcü TV', 'Ekol TV', 'Akit TV', 'Yol TV', 'Meltem TV', 'Kanal A', 'Kanal B',
  'Para TV', 'HT 24', 'TRT World', 'TRT Avaz', 'TRT Kurdi', 'Ekonomi TV',
  // ── Spor ──
  'TRT Spor', 'TRT Spor Yıldız', 'A Spor', 'S Sport', 'S Sport 2', 'Spor Smart',
  'Spor Smart 1', 'Spor Smart 2', 'beIN Sports 1', 'beIN Sports 2',
  'beIN Sports 3', 'beIN Sports 4', 'beIN Sports 5', 'beIN Sports Haber',
  'beIN Sports Max 1', 'beIN Sports Max 2', 'Tivibu Spor', 'Tivibu Spor 1',
  'Tivibu Spor 2', 'Tivibu Spor 3', 'Eurosport 1', 'Eurosport 2', 'FB TV',
  'GS TV', 'BJK TV', 'Beşiktaş TV', 'NTV Spor', 'Sports TV', 'S Sport Plus',
  'TFF 1. Lig TV', 'Türkiye Kupası TV',
  // ── Sinema & dizi ──
  'Sinema TV', 'Sinema 2', 'Sinema TV Aile', 'Sinema Aile 2', 'Movie Smart',
  'Movie Smart 2', 'Movie Smart Premium', 'Türkmax', 'Türkmax 2', 'Dizimax',
  'Dizimax 2', 'Dizimax Premium', 'Dizi Smart', 'Smart Çocuk', 'FX', 'Sci-Fi',
  'Epic Drama', 'TLC Türkiye',
  // ── Belgesel & yaşam ──
  'TRT Belgesel', 'TGRT Belgesel', 'DMAX', 'TLC', 'Discovery Channel',
  'Discovery Science', 'Animal Planet', 'National Geographic', 'Nat Geo Wild',
  'Nat Geo People', 'Viasat Explore', 'Viasat History', 'Viasat Nature',
  '24 Kitchen', 'Food Network', 'Fashion TV', 'Kanal V', 'Çiftçi TV', 'Tarım TV',
  'Köy TV', 'Bereket TV', 'Agro TV', 'Ege TV', 'Çukurova TV', 'Kanal 23',
  'Beyaz TV', 'Yeşilçam TV',
  // ── Çocuk ──
  'TRT Çocuk', 'TRT Diyanet Çocuk', 'Minika GO', 'Minika Çocuk', 'Cartoon Network',
  'Boomerang', 'Nickelodeon', 'Nick Jr', 'Nick Toons', 'Disney Channel',
  'Disney Junior', 'Baby TV', 'Da Vinci Kids', 'Pocket Watch', 'Zoo Moo',
  // ── Müzik ──
  'TRT Müzik', 'Kral Pop', 'Kral Pop TV', 'Kral TV', 'Power Türk', 'Power TV',
  'Dream Türk', 'Dream TV', 'Number One TV', 'Number One Türk', 'Tempo TV',
  'Müzik Türk', 'Viva TV', 'NR1 TV', 'Fener Radyo TV'
];
/* Araştırmayla eklenenler (2026-10-17): Kral listesinde BULUNAN, kullanıcının
   "çoğu Türk kanalı yok" dediği kanallar. Ölçüm: kaynakta 928 Türk kanalı var;
   bunların ulusal/haber/spor/sinema/çocuk/müzik omurgası buraya alındı. */
const POPULER_EK = [
  // Ulusal / platform
  'TRT 4K', 'TABİİ TV', 'TABİİ SPOR', 'TABİİ SPOR+', 'Tivibu Türk', 'SüperTürk TV',
  'SüperTürk Max', 'Cine 1', 'Cine 5', 'Cine 6', 'FOX TV', 'Euro D', 'Eurostar',
  'Show Türk', 'TGRT EU', 'TV8 INT', 'TV 5', 'Kanal B', 'Av TV', 'Yaban TV',
  'Berat TV', 'Kadırga TV', 'Akıllı TV', 'Business Channel Türk', 'Ekotürk',
  // Haber
  'TGRT Haber', 'Türk Haber', 'Kanal 24', 'A News', 'TV Net', 'Ulusal TV',
  'Ekotürk Haber', 'Bengütürk', 'Kanal 32', 'Kent Türk',
  // Spor
  'HT Spor', 'SmartSpor 1', 'SmartSpor 2', 'SmartSpor HD 1', 'TRT Spor 1',
  'EXXEN Sport', 'Tabii Spor', 'beIN Box Office 1', 'beIN Box Office 2',
  'beIN Gurme', 'beIN İz TV', 'Sports TV HD', 'S Sport Plus Live',
  // Sinema / dizi
  'Yeşilçam TV', 'Belgesel 2', 'Movie Smart Premium',
  // Belgesel / yaşam
  'BBC Earth', 'Ziraat TV', 'BeIN Gurme HD', 'Viasat Explore', 'Boomerang',
  'Discovery IDX', 'Animal Planet HD', '24 Kitchen HD', 'Fashion TV HD',
  // Çocuk
  'TRT EBA', 'Duck TV', 'Zarok TV', 'BabyFirst TV', 'Nick Toons', 'Caillou TV',
  'Tom ve Jerry', 'Sünger Bob',
  // Müzik
  'Kral Pop TV', 'Number One Türk TV'
];
POPULER_ADLAR.push(...POPULER_EK);
// Tek harfli anahtarlar da gerekli: "Kanal D" → "D", "Kanal 7" → "7"
// (normalizeName "KANAL" sözcüğünü atar). Eşitlik karşılaştırması güvenli;
// "içerir" kuralı yalnız ≥4 harflik anahtarlarda uygulanır.
const POPULER_TR = new Set(POPULER_ADLAR.map((ad) => sadele(ad)).filter(Boolean));

/* ── YEREL / ŞEHİR KANALLARI ──────────────────────────────────────────────
   Kullanıcı isteği (2026-10-17): "yerel şehir kanalları da ekle — FB TV, TV52
   mesela örnek". İki desen yakalanır:
     1) Plaka/kod kanalları: "Kanal 34", "TV 52", "Kanal 06", "RTV 61"…
     2) Şehir/bölge adı taşıyanlar: "Antalya TV", "Ege TV", "Çukurova TV"…
   Şehir adları ASCII yazımlarıyla da denenir (M3U listeleri çoğu kez
   "IZMIR"/"SANLIURFA" yazar). */
const SEHIR_ADLARI = [
  'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep',
  'Şanlıurfa', 'Trabzon', 'Samsun', 'Kayseri', 'Eskişehir', 'Diyarbakır', 'Mersin',
  'Kocaeli', 'Sakarya', 'Balıkesir', 'Manisa', 'Aydın', 'Denizli', 'Muğla', 'Hatay',
  'Kahramanmaraş', 'Van', 'Erzurum', 'Malatya', 'Zonguldak', 'Ordu', 'Giresun',
  'Rize', 'Sivas', 'Tokat', 'Çorum', 'Amasya', 'Bolu', 'Düzce', 'Karabük',
  'Bartın', 'Kastamonu', 'Çankırı', 'Kırıkkale', 'Kırşehir', 'Nevşehir', 'Niğde',
  'Aksaray', 'Karaman', 'Yozgat', 'Kırklareli', 'Edirne', 'Tekirdağ', 'Çanakkale',
  'Bilecik', 'Burdur', 'Isparta', 'Afyon', 'Kütahya', 'Uşak', 'Elazığ', 'Tunceli',
  'Bingöl', 'Muş', 'Bitlis', 'Hakkari', 'Şırnak', 'Siirt', 'Batman', 'Mardin',
  'Adıyaman', 'Kilis', 'Osmaniye', 'Kars', 'Ardahan', 'Iğdır', 'Ağrı', 'Erzincan',
  'Gümüşhane', 'Bayburt', 'Artvin', 'Sinop', 'Ege', 'Çukurova', 'Marmara',
  'Trakya', 'Akdeniz', 'Karadeniz', 'Anadolu'
];
const SEHIR_KOKLER = [...new Set(
  SEHIR_ADLARI.flatMap((s) => {
    // ÖNCE Türkçe büyüt, SONRA ASCII'ye indir: aksi hâlde toLocaleUpperCase
    // 'i' harfini yeniden 'İ'ye çevirip "IZMIR" eşleşmesini bozuyordu.
    const tr = s.toLocaleUpperCase('tr-TR');
    return [tr, asciiYap(tr)];
  })
)];
// Şehir adı KELİME olarak aranır (baş ve son sınır): "ADANA TV" ✔,
// "MUSIC" ✗ — aksi hâlde "Muş" şehri her "MUSIC/MUSIK" kanalını yakalıyordu
// (ölçüldü: "DE: DELUXE MUSIC" listeye sızıyordu).
const SEHIR_DESEN = new RegExp(`(?:^|[^\\p{L}])(?:${SEHIR_KOKLER.join('|')})(?=$|[^\\p{L}])`, 'u');
const PLAKA_DESEN = /^(?:KANAL|TV|RTV|RADYO)\s?\d{1,2}$/;

function yerelKanalMi(ad) {
  const ham = String(ad || '').trim().toLocaleUpperCase('tr-TR').replace(/\s*(?:HD|FHD|4K|UHD|SD)\s*$/, '');
  if (!ham) return false;
  if (/YEREL|BÖLGE/.test(ham)) return true;
  if (PLAKA_DESEN.test(ham)) return true;
  return SEHIR_DESEN.test(ham);
}

// Ayni isimli kanal farkli kaynaklarda olabilir; id cakismasini kirmak icin
// yayin adresinin kisa bir ozeti ekleniyor (localStorage anahtari olarak da
// kullaniliyor: sadece harf/rakam/alt cizgi).
function stableId(name, url) {
  const s = `${name}|${url || ''}`;
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

/**
 * Kanal sagligi denetimi.
 *
 * NEDEN SUNUCUDA DEGIL, ISTEMCIDE: oynatma daima /api/hls_proxy uzerinden
 * gider, yani yayin "sunucudan" (Vercel) degil oynaticinin bulundugu agdan
 * gelir. Masaustunde sidecar = kullanicinin ev IP'si, APK'da Vercel. Bu
 * yuzden saglik testi de AYNI proxy uzerinden, istemciden yapilmalidir;
 * sunucudan test edip "olu" demesi yanlis olurdu (datacenter IP'leri cok
 * yayini goremiyor).
 *
 * Liste kirpik oldugu icin (M3U'da olu kanallar cok) denetim su ise yarar:
 * calisanlar one, olu olanlar sona gider; kullanici one ucuzca oynatabilir
 * olanlari gorur. Yalnizca sinirli sayida kanal (varsayilan 48) denenir,
 * cunku her deneme gercek bir yayin baglantisi acar.
 *
 * @param channels  denenecek kanallar (oncelik sirali gelmeli)
 * @param makeUrl   (channel) => yayin URL'i (LiveTvView toProxiedLiveUrl)
 * @returns { alive:Set, dead:Set, tested:number }
 */
export async function probeChannels(channels, makeUrl, {
  limit = 48, concurrency = 6, timeout = 7000
} = {}) {
  const alive = new Set();
  const dead = new Set();
  const targets = (channels || []).filter(c => c && c.streamUrl).slice(0, limit);
  let cursor = 0;
  let tested = 0;

  async function worker() {
    while (cursor < targets.length) {
      const ch = targets[cursor++];
      const url = makeUrl(ch);
      if (!url) { dead.add(ch.streamUrl); continue; }
      tested++;
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), timeout);
        let ok = false;
        try {
          const res = await fetch(url, {
            method: 'GET',
            signal: ctrl.signal,
            headers: { Range: 'bytes=0-8191' },
            cache: 'no-store'
          });
          if (res.ok && res.body) {
            // Canlı akış SONUMSUZdur: arrayBuffer() tamamen beklerdi. Yalnızca
            // ilk paketi okuyup akışı kapatıyoruz.
            const reader = res.body.getReader();
            try {
              const { value } = await reader.read();
              if (value && value.length > 0) {
                // TS: 0x47 senkron baytı. HLS: "#EXTM3U".
                ok = value[0] === 0x47
                  || new TextDecoder().decode(value.subarray(0, 7)) === '#EXTM3U';
              }
            } finally {
              // cancel() reddeden bir promise döner; await + try/catch şart.
              try { await reader.cancel(); } catch (_) {}
            }
          } else {
            // Hata gövdesi de (403/404 HTML sayfaları) okunmazsa bağlantı
            // tarayıcının havuzunda asılı kalır; 36 denetimde havuz tükenirdi.
            try { if (res.body) await res.body.cancel(); } catch (_) {}
          }
        } finally {
          clearTimeout(timer);
        }
        if (ok) alive.add(ch.streamUrl); else dead.add(ch.streamUrl);
      } catch (_) {
        dead.add(ch.streamUrl);
      }
    }
  }

  const workers = [];
  const n = Math.max(1, Math.min(concurrency, targets.length));
  for (let i = 0; i < n; i++) workers.push(worker());
  await Promise.all(workers);
  return { alive, dead, tested };
}

export function clearLiveSourceCache() {
  memoryCache = {};
  try {
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem(ORDER_KEY);
    localStorage.removeItem(DEFAULT_KEY);
  } catch (_) {}
}