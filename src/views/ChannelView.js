import { renderIcons } from '../services/kabuk/icons.js';
/* ==========================================================================
   CinePulse Studio - "Kanalım" Görünümü v2 (KUŞAK MOTORU)
   --------------------------------------------------------------------------
   Kendi TV kanalın: kanal şeridi (çizgi/belgesel/aksiyon), ruh hali chip'leri,
   kuşak hizalı EPG, "ŞU AN YAYINDA" geri sayımı, kaçırdıkların şeridi,
   akşam rehberi kopyalama, hatırlatma bildirimi ve kanal istatistikleri.

   Sözleşme: { html, init } (DiscoverView kalıbı) + ek olarak `dispose`.
   · Tüm metinler escHtml'den geçer. iframe / window.open / site adı YOK.
   · Ağ YALNIZCA scheduler'a enjekte edilen `fallbackHavuzu` içinden geçer.
   · Tüm timer id'leri `kanalSaat.js` kayıt defterinde tutulur ve görünüm
     hashchange / pagehide / dispose sırasında İPTAL EDİLİR (sızıntı yok).
   ========================================================================== */

import { createPlayerScope } from '../components/playerLifecycle.js';
import { showToast } from '../components/Toast.js';
import {
  getGroupedWatchHistory,
  getFavorites,
  getWatchlist,
  filterForActiveProfile
} from '../services/altyapi/storage.js';
import { fetchDiscoverMedia } from '../services/icerik/tmdbApi.js';
import {
  KANAL_PRESETLERI,
  RUH_HALLERI,
  kanalSluglari,
  kanalTanima,
  kanalProgramlaV2Async,
  yayindakiSlot,
  kacirdiklarim,
  kanalIstatistik,
  kanalRehberiMetni,
  hatirlatmaAdaylari,
  dkMetni,
  sezonBolumMetni,
  slotSuresiDk
} from '../services/canli/channelScheduler.js';
import { kanalSaatTicker } from '../services/canli/kanalSaat.js';
import { KANALIM_CSS } from './kanalimStil.js';

/* ── Kalıcı anahtarlar (storage.js'e dokunulmaz, slug'lar İZOLE) ───────── */
const KEY_AKTIF_KANAL = 'kanalim_aktif_kanal_v2';   // aktif slug
const KEY_BILDIRIM = 'kanalim_bildirim_v2';         // hatırlatma açık mı
const V1_TOHUM_KEY = 'kanalim_tohum_v1';            // geriye dönük (kendi kanalı)
const V1_PROGRAM_KEY = 'kanalim_program_v1';        // geriye dönük (kendi kanalı)
const tohumKey = (slug) => `kanalim_${slug}_tohum_v2`;
const programKey = (slug) => `kanalim_${slug}_program_v2`;

/** Oturum içi durum: ruh hali KALICI YAZILMAZ (spec: geçici bias). */
const GORUNUM = { slug: 'kendi', ruhHali: null };

/* ── Yardımcılar ───────────────────────────────────────────────────────── */

// Slot içerik adları uzak kaynaklardan gelebilir; HTML'e kaçırılmadan gömülmez.
function escHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** localStorage'ı storage.js'e dokunmadan güvenli okur (bozuksa null). */
function guvenliOku(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch (_) {
    return null;
  }
}

/** localStorage'a storage.js'e dokunmadan güvenli yazar (kotayı yok sayar). */
function guvenliYaz(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {
    /* kota/erişim hatası: kanal bellekte çalışmaya devam eder */
  }
}

/** Günün dakikasını (0-1439) verir; "şimdi" işaretçisi için. */
function gununDakikasi(tarih = new Date()) {
  return (Number(tarih.getHours()) || 0) * 60 + (Number(tarih.getMinutes()) || 0);
}

/** Kayıtlı aktif kanal slug'ı (bilinmeyen slug → 'kendi'). */
function aktifSlugAl() {
  const kayitli = guvenliOku(KEY_AKTIF_KANAL);
  const slug = typeof kayitli === 'string' ? kayitli.trim() : '';
  return kanalSluglari().includes(slug) ? slug : 'kendi';
}

/**
 * Slug'a özel tohum. 'kendi' kanalı v1 tohumunu devralır (geriye dönük uyum).
 * @param {string} slug
 * @returns {number}
 */
function tohumAl(slug) {
  const key = tohumKey(slug);
  const kayitli = Number(guvenliOku(key));
  if (Number.isFinite(kayitli) && kayitli > 0) return kayitli;

  if (slug === 'kendi') {
    const v1 = Number(guvenliOku(V1_TOHUM_KEY));
    if (Number.isFinite(v1) && v1 > 0) {
      guvenliYaz(key, v1);
      return v1;
    }
  }
  const taban = Number(kanalTanima(slug).varsayilanTohum) || 1;
  const yeni = ((Math.floor(Date.now() / 1000) + taban) % 2147483647) || 1;
  guvenliYaz(key, yeni);
  if (slug === 'kendi') guvenliYaz(V1_TOHUM_KEY, yeni);
  return yeni;
}

/** "Kanalı Yeniden Programla": yeni tohum = yeni akış (kanal slug'ına yazılır). */
function yeniTohumUret(slug) {
  const mevcut = Number(guvenliOku(tohumKey(slug))) || tohumAl(slug);
  const yeni = (mevcut + 1 + Math.floor(Math.random() * 100000)) % 2147483647 || 1;
  guvenliYaz(tohumKey(slug), yeni);
  if (slug === 'kendi') guvenliYaz(V1_TOHUM_KEY, yeni);
  return yeni;
}

/** Notification API varsa sınıf, yoksa null (toggle bu olmadan render edilmez). */
function bildirimApi() {
  try {
    const N = globalThis.Notification;
    return typeof N === 'function' ? N : null;
  } catch (_) {
    return null;
  }
}

/** Pano yazılabilir mi? (Değilse "rehberi kopyala" butonu hiç render edilmez.) */
function panoYazilabilirMi() {
  try {
    return typeof navigator !== 'undefined'
      && !!navigator.clipboard
      && typeof navigator.clipboard.writeText === 'function';
  } catch (_) {
    return false;
  }
}

/** Panoya yazar; eski tarayıcı için execCommand yedeği. Hata sessiz. */
async function panoyaKoy(metin) {
  if (!metin) return false;
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(metin);
      return true;
    }
  } catch (_) { /* aşağıdaki yedeğe düş */ }
  try {
    if (typeof document === 'undefined' || typeof document.execCommand !== 'function') return false;
    const alan = document.createElement('textarea');
    alan.value = metin;
    alan.setAttribute('readonly', '');
    alan.style.position = 'fixed';
    alan.style.opacity = '0';
    document.body.appendChild(alan);
    alan.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(alan);
    return !!ok;
  } catch (_) {
    return false;
  }
}

/** Dakikayı "⏳ n dk" biçimine çevirir (geri sayım etiketi). */
function geriSayimMetni(slot, simdiDk) {
  if (!slot) return '⏳ —';
  const bas = Number(slot.baslangucDk) || 0;
  let sure = Number(slot.sureDk);
  if (!(Number.isFinite(sure) && sure > 0)) sure = slotSuresiDk(slot.tip);
  const kalan = Math.ceil(bas + sure - (Number(simdiDk) || 0));
  if (kalan <= 0) return '⏳ bitiyor';
  const sa = Math.floor(kalan / 60);
  const dk = kalan % 60;
  return `⏳ ${sa > 0 ? `${sa} sa ${dk} dk` : `${dk} dk`}`;
}

/** Slot için "18:00-19:00" aralık etiketi. */
function slotAralik(slot) {
  const bas = Number(slot.baslangucDk) || 0;
  let sure = Number(slot.sureDk);
  if (!(Number.isFinite(sure) && sure > 0)) sure = slotSuresiDk(slot.tip);
  return `${dkMetni(bas)}-${dkMetni(bas + sure)}`;
}

/** Slot tipi + sezon/bölüm kısa metni ("Dizi • S3B5"). */
function slotAltBilgi(slot) {
  const tipAd = slot.tip === 'dizi' ? 'Dizi' : 'Film';
  const sb = sezonBolumMetni(slot);
  return sb ? `${tipAd} • ${sb}` : tipAd;
}

/** Slot etiketlerinden olay detayını üretir (dış sözleşme: v1 ile aynı alanlar). */
function slotDetayi(kart) {
  const tip = kart.getAttribute('data-tip') === 'dizi' ? 'dizi' : 'film';
  const detay = {
    tip,
    tmdbId: kart.getAttribute('data-tmdbid'),
    ad: kart.getAttribute('data-ad'),
    kusak: kart.getAttribute('data-kusak') || null
  };
  if (tip === 'dizi') {
    detay.sezon = Number(kart.getAttribute('data-sezon') || 1);
    detay.bolum = Number(kart.getAttribute('data-bolum') || 1);
    const sonraki = kart.getAttribute('data-sonraki');
    if (sonraki) {
      const parcalar = String(sonraki).split(',').map(Number);
      if (parcalar.length === 2 && Number.isFinite(parcalar[0]) && Number.isFinite(parcalar[1])) {
        detay.sonrakiBolum = { sezon: parcalar[0], bolum: parcalar[1] };
      }
    }
  }
  const bingeNo = Number(kart.getAttribute('data-binge') || 0);
  if (Number.isFinite(bingeNo) && bingeNo > 0) detay.bingeNo = bingeNo;
  return detay;
}

/** Slot kartının data-* öznitelikleri (tıklanan her kart aynı sözleşmeyi taşır). */
function slotDataAttr(slot) {
  const sonraki = slot.sonrakiBolum ? `${slot.sonrakiBolum.sezon},${slot.sonrakiBolum.bolum}` : '';
  return `data-tmdbid="${escHtml(slot.tmdbId)}"
        data-tip="${escHtml(slot.tip)}"
        data-ad="${escHtml(slot.ad)}"
        data-sezon="${escHtml(slot.sezon ?? '')}"
        data-bolum="${escHtml(slot.bolum ?? '')}"
        data-kusak="${escHtml(slot.kusakEtiket || slot.kusak || '')}"
        data-binge="${escHtml(slot.bingeNo ?? 0)}"
        data-sonraki="${escHtml(sonraki)}"`;
}

/**
 * Varsayılan TMDB fallback havuzu: preset'in tür filtresine göre popülerlik
 * sıralı TV + film listesi. Yalnızca çekirdek havuz küçükken
 * kanalProgramlaV2Async içinden çağrılır; çocuk/profil filtresi uygulanır.
 * Scheduler'a enjekte edilir (testlerde mock — ağ yok).
 * @param {{mevcutIdler?: Set<string>, slug?: string}} ctx
 * @returns {Promise<object[]>}
 */
async function tmdbFallbackHavuzu({ mevcutIdler, slug } = {}) {
  const preset = kanalTanima(slug);
  const turIdleri = Array.isArray(preset.turIdler) ? preset.turIdler : null;
  const genreId = turIdleri ? turIdleri.join(',') : null;
  const isAnime = preset.slug === 'cizgi';
  const isDoc = preset.slug === 'belgesel';
  const [tv, film] = await Promise.all([
    fetchDiscoverMedia({ type: 'tv', genreId, page: 1, sortBy: 'popularity.desc', isAnime }).catch(() => []),
    fetchDiscoverMedia({ type: 'movie', genreId, page: 1, sortBy: 'popularity.desc', isDoc }).catch(() => [])
  ]);
  const liste = [...(tv || []), ...(film || [])];
  const temiz = filterForActiveProfile(liste);
  return temiz.filter((x) => x && x.id != null && !(mevcutIdler && mevcutIdler.has(String(x.id))));
}

/** Boş programda gösterilen bilgilendirme metni. */
function bosDurumHTML() {
  return `
    <div class="kanalim-bos glass-panel">
      <i data-lucide="tv-2" aria-hidden="true"></i>
      <p>Henüz kanalın için yeterli geçmiş yok — birkaç içerik izle, kanalın zenginleşsin.</p>
      <small>İzleme geçmişin, favorilerin ve izleme saatin bu cihazda kullanılır; sunucuya hiçbir şey gitmez.</small>
    </div>
  `;
}

/* ── Gövde bölümleri ───────────────────────────────────────────────────── */

/** Kanal istatistikleri şeridi (tür dağılımı yüzdesi + toplam dk + binge). */
function istatistikHTML(istatistik) {
  if (!istatistik || istatistik.slotSayisi === 0) return '';
  const saat = Math.floor(istatistik.toplamDk / 60);
  const kalanDk = istatistik.toplamDk % 60;
  const sure = saat > 0 ? `${saat} sa ${kalanDk} dk` : `${kalanDk} dk`;
  const bant = (istatistik.turDagilimi || [])
    .filter((t) => t.yuzde > 0)
    .map((t) => `<span style="width:${escHtml(t.yuzde)}%" title="${escHtml(`${t.tur} %${t.yuzde}`)}"></span>`)
    .join('');
  const enCok = (istatistik.turDagilimi || [])[0];
  return `
    <div class="kanalim-istatistik" role="note" aria-label="Kanal istatistikleri">
      <span class="kanalim-ist-oge"><i data-lucide="list-video" aria-hidden="true"></i><strong>${escHtml(istatistik.slotSayisi)}</strong> program</span>
      <span class="kanalim-ist-oge"><i data-lucide="clock" aria-hidden="true"></i><strong>${escHtml(sure)}</strong> yayın</span>
      <span class="kanalim-ist-oge"><i data-lucide="popcorn" aria-hidden="true"></i><strong>${escHtml(istatistik.bingeSayisi)}</strong> binge${istatistik.enUzunBinge > 1 ? ` (en uzun ${escHtml(istatistik.enUzunBinge)})` : ''}</span>
      ${enCok ? `<span class="kanalim-ist-oge"><i data-lucide="heart" aria-hidden="true"></i><strong>%${escHtml(enCok.yuzde)}</strong> ${escHtml(enCok.tur)}</span>` : ''}
      <span class="kanalim-ist-oge" title="Programın izleme geçmişinle uyumu"><i data-lucide="target" aria-hidden="true"></i><strong>%${escHtml(istatistik.tuyumYuzde)}</strong> uyum</span>
      ${bant ? `<span class="kanalim-tur-dagilim" aria-hidden="true">${bant}</span>` : ''}
    </div>
  `;
}

/** "ŞU AN YAYINDA" kartı + sonraki yayın önizlemesi. */
function simdiKartiHTML(slot, sonraki, simdiDk) {
  if (!slot) return '';
  const devam = slot.sonrakiBolum && slot.tip === 'dizi'
    ? ` <i data-lucide="skip-forward" aria-hidden="true"></i> sonra S${escHtml(slot.sonrakiBolum.sezon)}B${escHtml(slot.sonrakiBolum.bolum)}`
    : '';
  return `
    <section class="kanalim-now glass-panel" aria-live="polite">
      <div class="kanalim-now-sol">
        <span class="kanalim-canli"><span class="kanalim-nokta"></span> ŞU AN YAYINDA</span>
        <h2>${escHtml(slot.ad)}</h2>
        <div class="kanalim-now-meta">
          <span><i data-lucide="clapperboard" aria-hidden="true"></i> ${escHtml(slot.tur)}</span>
          <span><i data-lucide="sunrise" aria-hidden="true"></i> ${escHtml(slot.kusakEtiket || '')}</span>
          <span>${escHtml(slotAltBilgi(slot))}${devam}</span>
          <span class="kanalim-geri-sayim" id="kanalim-geri-sayim">${escHtml(geriSayimMetni(slot, simdiDk))}</span>
        </div>
        <p class="kanalim-neden">
          <i data-lucide="sparkles" aria-hidden="true"></i>
          <span>neden bu: ${escHtml(slot.neden || '')}</span>
        </p>
      </div>
      ${sonraki ? `
        <div class="kanalim-sonra">
          <span class="kanalim-sonra-etiket">SONRA ${escHtml(dkMetni(sonraki.baslangucDk))}</span>
          <span class="kanalim-sonra-ad">${escHtml(sonraki.ad)}</span>
          <span class="kanalim-sonra-meta">${escHtml(slotAltBilgi(sonraki))} • ${escHtml(sonraki.tur)}</span>
        </div>` : ''}
    </section>
  `;
}

/** Yayın akışı şeridi: şimdi + sonraki 6 slot (program sonunda başa sarar). */
function epgSeritHTML(program, simdiDk, nowIdx) {
  if (!Array.isArray(program) || program.length === 0) return '';
  const kartlar = [];
  const adet = Math.min(program.length, 7);
  for (let i = 0; i < adet; i++) {
    const slot = program[(nowIdx + i) % program.length];
    const aktifMi = slot === program[nowIdx];
    const etiket = i === 0 ? `${dkMetni(slot.baslangucDk)} • ŞİMDİ` : slotAralik(slot);
    const binge = slot.tip === 'dizi' && Number(slot.bingeNo) > 1
      ? ` <span class="kanalim-binge">🍿 ${escHtml(slot.bingeNo)}/3</span>`
      : '';
    kartlar.push(`
      <button class="channel-epg-item ${aktifMi ? 'is-now' : ''}" type="button" ${slotDataAttr(slot)}>
        <span class="channel-epg-time">${escHtml(etiket)}</span>
        <span class="channel-epg-title" title="${escHtml(slot.ad)}">${escHtml(slot.ad)}</span>
        <span class="channel-epg-meta">${escHtml(slot.kusakEtiket || '')} • ${escHtml(slotAltBilgi(slot))}${binge}</span>
      </button>
    `);
  }
  return `
    <div class="kanalim-blok">
      <div class="kanalim-blok-baslik"><i data-lucide="list" aria-hidden="true"></i> Yayın akışı</div>
      <div class="kanalim-serit-kaydir" role="list">${kartlar.join('')}</div>
    </div>
  `;
}

/** "Kaçırdıkların" şeridi: biten slotlar (satır içi oynatıcı YOK). */
function kacirdikHTML(kacirdik) {
  if (!Array.isArray(kacirdik) || kacirdik.length === 0) return '';
  const kartlar = kacirdik.map((slot) => `
    <button class="kanalim-kacirdik-item" type="button" ${slotDataAttr(slot)}>
      <span class="channel-epg-time">${escHtml(slotAralik(slot))} • KAÇIRDI</span>
      <span class="channel-epg-title" title="${escHtml(slot.ad)}">${escHtml(slot.ad)}</span>
      <span class="channel-epg-meta">${escHtml(slot.kusakEtiket || '')} • ${escHtml(slotAltBilgi(slot))}</span>
    </button>
  `).join('');
  return `
    <div class="kanalim-blok">
      <div class="kanalim-blok-baslik"><i data-lucide="history" aria-hidden="true"></i> Kaçırdıkların</div>
      <div class="kanalim-serit-kaydir" role="list">${kartlar}</div>
    </div>
  `;
}

/**
 * Gövdenin tamamı: istatistikler + şu an + EPG + kaçırdıklar.
 * @returns {string}
 */
function govdeHTML({ program, simdiDk, gecmis }) {
  if (!Array.isArray(program) || program.length === 0) return bosDurumHTML();
  const aktif = yayindakiSlot(program, simdiDk);
  if (!aktif.simdi) return bosDurumHTML();
  const nowIdx = program.indexOf(aktif.simdi);
  const kacirdik = kacirdiklarim(program, simdiDk, { pencereDk: 360, enFazla: 8 });
  return [
    istatistikHTML(kanalIstatistik(program, gecmis)),
    simdiKartiHTML(aktif.simdi, aktif.sonraki, simdiDk),
    epgSeritHTML(program, simdiDk, nowIdx < 0 ? 0 : nowIdx),
    kacirdikHTML(kacirdik)
  ].join('');
}

/* ── Statik başlık bölümleri (chip şeritleri) ──────────────────────────── */

function kanalSeritHTML(aktif) {
  return `
    <nav class="kanalim-serit" id="kanalim-kanal-serit" role="tablist" aria-label="Kanal seçimi">
      ${KANAL_PRESETLERI.map((p) => `
        <button class="kanalim-chip ${p.slug === aktif ? 'is-active' : ''}" type="button" role="tab"
          data-kanal="${escHtml(p.slug)}" aria-selected="${p.slug === aktif ? 'true' : 'false'}"
          title="${escHtml(p.aciklama || p.ad)}">
          <i data-lucide="${escHtml(p.ikon)}" aria-hidden="true"></i><span>${escHtml(p.ad)}</span>
        </button>`).join('')}
    </nav>
  `;
}

function ruhSeritHTML(aktif) {
  return `
    <div class="kanalim-ruh-satir">
      <span class="kanalim-ruh-etiket" id="kanalim-ruh-etiket">Ruh hali</span>
      <div class="kanalim-ruh" role="group" aria-labelledby="kanalim-ruh-etiket">
        ${RUH_HALLERI.map((r) => `
          <button class="kanalim-ruh-chip ${r.slug === aktif ? 'is-active' : ''}" type="button"
            data-ruh="${escHtml(r.slug)}" aria-pressed="${r.slug === aktif ? 'true' : 'false'}"
            title="Programı bu ruh haline göre anında yeniden kur (kalıcı yazılmaz)">
            ${escHtml(r.ad)}
          </button>`).join('')}
      </div>
    </div>
    <p class="kanalim-ruh-not" id="kanalim-ruh-not"></p>
  `;
}

function eylemlerHTML({ panoVar, bildirimDestekli, bildirimAcik, rehberVar }) {
  return `
    <div class="kanalim-eylemler">
      ${panoVar ? `
        <button id="channel-kopyala-btn" class="kanalim-btn" type="button" ${rehberVar ? '' : 'disabled'}
          title="Bu akşamın yayın rehberini panoya kopyala">
          <i data-lucide="clipboard-list" aria-hidden="true"></i><span>Bu akşamki rehberi kopyala</span>
        </button>` : ''}
      ${bildirimDestekli ? `
        <button id="channel-bildirim-btn" class="kanalim-btn ${bildirimAcik ? 'is-on' : ''}" type="button"
          aria-pressed="${bildirimAcik ? 'true' : 'false'}"
          title="Yayın başlamasına 10 dk kala bildirim al (izin tarayıcıdan istenir)">
          <i data-lucide="bell" aria-hidden="true"></i><span>🔔 Hatırlatma</span>
        </button>` : ''}
      <button id="channel-reprogram-btn" class="kanalim-btn" type="button"
        title="Yeni tohum = yeni program">
        <i data-lucide="zap" aria-hidden="true"></i><span>Kanalı Yeniden Programla</span>
      </button>
    </div>
  `;
}

/**
 * "Kanalım" görünümünü üretir. DiscoverView kalıbına uyar: { html, init } (+dispose).
 * @param {object} [secenekler]
 * @param {(ctx:{saatKovasi:number,mevcutIdler:Set<string>,slug:string,preset:object}) => Promise<object[]>} [secenekler.fallbackHavuzu]
 *        TMDB tür-ağırlıklı yedek havuz (testlerde mock; varsayılan gerçek TMDB).
 * @param {number} [secenekler.maxSlot=24]
 * @param {number|null} [secenekler.uzunlukDk=null] verilirse sabit slot süresi (v1 override)
 * @param {() => Date} [secenekler.simdi] test için enjekte edilebilir saat
 * @param {boolean} [secenekler.bildirimKapali=false] test/CDP: bildirimı kapat
 * @param {number} [secenekler.tickerAraDkMs=30000] canlı saat aralığı (testte kısaltılır)
 * @returns {Promise<{html:string, init:(container:HTMLElement)=>void, dispose:()=>void}>}
 */
export async function renderChannelView(secenekler = {}) {
  const uzunlukDk = Number.isFinite(Number(secenekler.uzunlukDk)) && Number(secenekler.uzunlukDk) > 0
    ? Number(secenekler.uzunlukDk)
    : null;
  const maxSlot = Number(secenekler.maxSlot || 24);
  const fallbackHavuzu = secenekler.fallbackHavuzu || tmdbFallbackHavuzu;
  const simdiFn = typeof secenekler.simdi === 'function' ? secenekler.simdi : () => new Date();
  const bildirimKapali = secenekler.bildirimKapali === true;
  const tickerAraDkMs = Number(secenekler.tickerAraDkMs) > 0 ? Number(secenekler.tickerAraDkMs) : 30000;

  // Çocuk/profil filtresi çağıranın (view) sorumluluğunda: scheduler saf kalır.
  const gecmis = filterForActiveProfile(getGroupedWatchHistory() || []);
  const favoriler = filterForActiveProfile(getFavorites() || []);
  const watchlist = filterForActiveProfile(getWatchlist() || []);

  GORUNUM.slug = aktifSlugAl();
  const tohum = tohumAl(GORUNUM.slug);
  const simdiDk = gununDakikasi(simdiFn());

  /** Programı üretir (ağ yalnızca enjekte edilen fallback üzerinden). */
  async function programKur({ slug, ruhHali, tohum: t }) {
    const hicSinyal = gecmis.length === 0 && favoriler.length === 0 && watchlist.length === 0;
    if (hicSinyal) return [];
    return kanalProgramlaV2Async({
      gecmis,
      favoriler,
      watchlist,
      slug,
      ruhHali,
      simdiDk: gununDakikasi(simdiFn()),
      tohum: t,
      uzunlukDk,
      maxSlot,
      fallbackHavuzu
    });
  }

  let program = await programKur({ slug: GORUNUM.slug, ruhHali: GORUNUM.ruhHali, tohum });
  // v1 ile aynı kalıcılık: üretilen programın bir kopyası saklanır (yalnız aktif kanal).
  guvenliYaz(programKey(GORUNUM.slug), program);
  if (GORUNUM.slug === 'kendi') guvenliYaz(V1_PROGRAM_KEY, program);

  const panoVar = panoYazilabilirMi();
  const BildirimSinifi = bildirimKapali ? null : bildirimApi();
  let bildirimAcik = BildirimSinifi
    ? guvenliOku(KEY_BILDIRIM) === true
    : false;
  const rehberVar = kanalRehberiMetni(program, simdiDk).length > 0;

  const preset = kanalTanima(GORUNUM.slug);
  const govde = govdeHTML({ program, simdiDk, gecmis });

  const html = `
    <style data-kanalim>${KANALIM_CSS}</style>
    <div class="kanalim-view">
      <div class="container">
        <header class="kanalim-header">
          <div>
            <span class="cp-eyebrow">SANA ÖZEL YAYIN AKIŞI.</span>
            <h1 class="kanalim-baslik">
              <i data-lucide="tv" aria-hidden="true"></i> Kanalım
              <span class="kanalim-kanal-rozet" id="kanalim-kanal-rozet">${escHtml(preset.ad)}</span>
            </h1>
            <p class="kanalim-altbaslik">Favorilerinden, izlediklerinden ve izleme saatinden cihazında programlanan kişisel kanalın. Kuşaklara göre dizilir, diziler kaldığı yerden devam eder.</p>
          </div>
          ${eylemlerHTML({ panoVar, bildirimDestekli: !!BildirimSinifi, bildirimAcik, rehberVar })}
        </header>
        ${kanalSeritHTML(GORUNUM.slug)}
        ${ruhSeritHTML(GORUNUM.ruhHali)}
        <div id="channelim-body">${govde}</div>
      </div>
    </div>
  `;

  let iptal = false;
  // init() içinde gerçek kapatma fonksiyonu atanır; dış sözleşmeden de çağrılabilir.
  let kapat = () => {};

  return {
    html,
    init: (container) => {
      if (!container) return;
      const body = container.querySelector('#channelim-body');
      if (!body) return;

      // Oynatıcı scope: tüm olay dinleyicileri ve timer'lar tek yerde toplanır.
      const scope = createPlayerScope();
      const bildirilen = new Set();
      let sonCizimSlot = '';

      const simdiDkAl = () => gununDakikasi(simdiFn());
      const slotKimligi = (s) => `${s.tmdbId}@${s.baslangucDk}#${s.dongu || 0}`;
      const aktifSlot = (s) => yayindakiSlot(program, s).simdi;

      function turuYenile(not) {
        if (iptal) return;
        const notEl = container.querySelector('#kanalim-ruh-not');
        if (notEl) notEl.textContent = not || '';
      }

      function yenidenCiz() {
        if (iptal || !body) return;
        const sDk = simdiDkAl();
        body.innerHTML = govdeHTML({ program, simdiDk: sDk, gecmis });
        renderIcons(body);
        const kopyaBtn = container.querySelector('#channel-kopyala-btn');
        if (kopyaBtn) kopyaBtn.disabled = kanalRehberiMetni(program, sDk).length === 0;
      }

      function programDegistir(yeniProgram) {
        if (iptal) return;
        program = Array.isArray(yeniProgram) ? yeniProgram : [];
        const slug = GORUNUM.slug;
        // Yalnız aktif kanalın programı kalıcılaşır (kotayı şişirmemek için).
        guvenliYaz(programKey(slug), program);
        if (slug === 'kendi') guvenliYaz(V1_PROGRAM_KEY, program);
        sonCizimSlot = slotKimligi(aktifSlot(simdiDkAl()) || {});
        yenidenCiz();
        hatirlatmaKontrol();
      }

      /** Programı yeniden kurar; görünüm kapanmışsa sonucu yok sayar. */
      async function programYenile({ slug, ruhHali, tohum: t }) {
        if (iptal) return;
        const yeni = await programKur({ slug, ruhHali, tohum: t });
        if (iptal) return;
        programDegistir(yeni);
      }

      function chipIsaretle() {
        for (const el of container.querySelectorAll('[data-kanal]')) {
          const aktif = el.getAttribute('data-kanal') === GORUNUM.slug;
          el.classList.toggle('is-active', aktif);
          el.setAttribute('aria-selected', aktif ? 'true' : 'false');
        }
        for (const el of container.querySelectorAll('[data-ruh]')) {
          const aktif = el.getAttribute('data-ruh') === GORUNUM.ruhHali;
          el.classList.toggle('is-active', aktif);
          el.setAttribute('aria-pressed', aktif ? 'true' : 'false');
        }
        const rozet = container.querySelector('#kanalim-kanal-rozet');
        if (rozet) rozet.textContent = kanalTanima(GORUNUM.slug).ad;
      }

      function hatirlatmaKontrol() {
        if (iptal || !bildirimAcik || !BildirimSinifi) return;
        try {
          if (BildirimSinifi.permission && BildirimSinifi.permission !== 'granted') return;
          for (const slot of hatirlatmaAdaylari(program, simdiDkAl(), { pencereDk: 10 })) {
            const kimlik = slotKimligi(slot);
            if (bildirilen.has(kimlik)) continue;
            bildirilen.add(kimlik);
            new BildirimSinifi('Kanalım • 10 dk kaldı', {
              body: `${dkMetni(slot.baslangucDk)} — ${slot.ad} (${slotAltBilgi(slot)} • ${slot.tur})`,
              tag: kimlik
            });
          }
        } catch (_) {
          /* bildirim yoksa/kapalıysa sessizce geçilir */
        }
      }

      async function bildirimiDegistir() {
        if (!BildirimSinifi) return;
        const btn = container.querySelector('#channel-bildirim-btn');
        try {
          let izin = BildirimSinifi.permission;
          if (izin === 'default') {
            // İzin YALNIZCA kullanıcı bu butona tıkladığında istenir.
            izin = await BildirimSinifi.requestPermission();
          }
          bildirimAcik = izin === 'granted';
          guvenliYaz(KEY_BILDIRIM, bildirimAcik);
          if (btn) {
            btn.classList.toggle('is-on', bildirimAcik);
            btn.setAttribute('aria-pressed', bildirimAcik ? 'true' : 'false');
          }
          if (bildirimAcik) hatirlatmaKontrol();
        } catch (_) {
          /* desteklenmiyor / hata: sessizce geç */
        }
      }

      async function rehberiKopyala() {
        const metin = kanalRehberiMetni(program, simdiDkAl(), { kanalAd: kanalTanima(GORUNUM.slug).ad });
        if (!metin) return;
        let ok = false;
        try {
          ok = await panoyaKoy(metin);
        } catch (_) {
          ok = false;
        }
        try {
          showToast(ok ? 'Bu akşamın rehberi kopyalandı 📋' : 'Kopyalanamadı', ok ? 'success' : 'warning');
        } catch (_) {
          /* bildirim kabı yoksa sessizce geç */
        }
      }

      // EPG/kaçırdıklar kartı: oynatıcı AÇMAZ; olay + hash yönlendirmesi yapar.
      // Ana oturum 'kanal-slot-secildi' olayını dinleyip oynatıcıya bağlar.
      scope.on(container, 'click', (e) => {
        // Lucide ikonları <svg> ile değiştirir: `closest` varsa yeterli (Element
        // sınıfına güvenmek SVG/altın DOM hedeflerinde erişilemez olabilir).
        const hedef = e.target && typeof e.target.closest === 'function' ? e.target : null;
        if (!hedef) return;

        const kanalDugme = hedef.closest('[data-kanal]');
        if (kanalDugme) {
          const slug = kanalDugme.getAttribute('data-kanal');
          if (slug === GORUNUM.slug) return;
          GORUNUM.slug = slug;
          guvenliYaz(KEY_AKTIF_KANAL, slug);
          chipIsaretle();
          turuYenile('');
          programYenile({ slug, ruhHali: GORUNUM.ruhHali, tohum: tohumAl(slug) });
          return;
        }

        const ruhDugme = hedef.closest('[data-ruh]');
        if (ruhDugme) {
          const secilen = ruhDugme.getAttribute('data-ruh');
          // Aynı chip'e ikinci tık → ruh hali kaldırılır (nötr moda dön).
          GORUNUM.ruhHali = GORUNUM.ruhHali === secilen ? null : secilen;
          chipIsaretle();
          const tanim = RUH_HALLERI.find((r) => r.slug === GORUNUM.ruhHali);
          turuYenile(tanim ? `${tanim.ad} modu aktif — program anında yeniden kuruldu (kalıcı yazılmaz).` : 'Ruh hali temizlendi — program kendi karışımına döndü.');
          programYenile({ slug: GORUNUM.slug, ruhHali: GORUNUM.ruhHali, tohum: tohumAl(GORUNUM.slug) });
          return;
        }

        if (hedef.closest('#channel-reprogram-btn')) {
          programYenile({
            slug: GORUNUM.slug,
            ruhHali: GORUNUM.ruhHali,
            tohum: yeniTohumUret(GORUNUM.slug)
          });
          return;
        }
        if (hedef.closest('#channel-kopyala-btn')) { rehberiKopyala(); return; }
        if (hedef.closest('#channel-bildirim-btn')) { bildirimiDegistir(); return; }

        const kart = hedef.closest('.channel-epg-item, .kanalim-kacirdik-item');
        if (kart) {
          const detay = slotDetayi(kart);
          window.dispatchEvent(new CustomEvent('kanal-slot-secildi', { detail: detay }));
          window.location.hash = `#detail?type=${detay.tip === 'dizi' ? 'tv' : 'movie'}&id=${encodeURIComponent(detay.tmdbId)}`;
        }
      });

      // Canlı saat: 30 sn'de bir geri sayım + slot bitince otomatik yeniden çizim.
      const ticker = kanalSaatTicker({
        getSimdiDk: () => simdiDkAl(),
        kontrol: (sDk) => slotKimligi(aktifSlot(sDk) || {}) !== sonCizimSlot,
        yenile: (sDk) => {
          sonCizimSlot = slotKimligi(aktifSlot(sDk) || {});
          yenidenCiz();
          hatirlatmaKontrol();
        },
        geriSayimGuncelle: (sDk) => {
          const el = body.querySelector('#kanalim-geri-sayim');
          if (el) el.textContent = geriSayimMetni(aktifSlot(sDk), sDk);
        },
        // Görünüm DOM'dan ayrıldıysa ticker kendini bırakır (sızıntı yok).
        hayattaMi: () => {
          try { return typeof document !== 'undefined' && document.body.contains(container); }
          catch (_) { return false; }
        },
        araDkMs: tickerAraDkMs
      });

      /** Görünümü kapatır: timer + olay dinleyicileri + bildirim durumu temizlenir. */
      function dispose() {
        if (iptal) return;
        iptal = true;
        ticker.durdur();
        scope.dispose();
        bildirilen.clear();
      }
      kapat = dispose;

      // Rota değişimi (hashchange) ve sekme kapanışı: interval İPTAL EDİLİR.
      scope.on(window, 'hashchange', dispose);
      scope.on(window, 'pagehide', dispose);

      sonCizimSlot = slotKimligi(aktifSlot(simdiDkAl()) || {});
      turuYenile(GORUNUM.ruhHali
        ? `${RUH_HALLERI.find((r) => r.slug === GORUNUM.ruhHali)?.ad || ''} modu aktif — program bu ruh haline göre kuruldu.`
        : '');
      hatirlatmaKontrol();
      renderIcons(container);
    },
    dispose: () => kapat()
  };
}