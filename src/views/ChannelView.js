import { renderIcons } from '../services/icons.js';
/* ==========================================================================
   CinePulse Studio - "Kanalım" Görünümü
   Kullanıcının izleme geçmişi + favorileri + izleme saatinden cihaz-içi
   algoritmayla kişisel TV kanalını gösterir: "ŞU AN YAYINDA" kartı ve EPG
   şeridi. Tüm veri cihazda kalır; backend/hesap YOK.
   ========================================================================== */

import {
  getGroupedWatchHistory,
  getFavorites,
  getWatchlist,
  filterForActiveProfile
} from '../services/storage.js';
import { kanalProgramlaAsync, yayindakiSlot } from '../services/channelScheduler.js';
import { fetchDiscoverMedia } from '../services/tmdbApi.js';

// Görünüme ait kalıcı anahtarlar (storage.js dosyasına dokunulmaz).
const KANAL_PROGRAM_KEY = 'kanalim_program_v1'; // üretilen programın kalıcı kopyası
const KANAL_TOHUM_KEY = 'kanalim_tohum_v1';     // "kanalı değiştir" tohumu

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
    /* kota/erişim hatası: program bellekte kalır, uygulama çalışmaya devam eder */
  }
}

/** Kayıtlı tohumu döner; yoksa yeni bir tohum üretip kalıcılaştırır. */
function tohumAl() {
  const kayitli = Number(guvenliOku(KANAL_TOHUM_KEY));
  if (Number.isFinite(kayitli) && kayitli > 0) return kayitli;
  const yeni = (Math.floor(Date.now() / 1000) % 2147483647) || 1;
  guvenliYaz(KANAL_TOHUM_KEY, yeni);
  return yeni;
}

/** Günün dakikasını (0-1439) verir; EPG "şimdi" işaretçisi için. */
function gununDakikasi(tarih = new Date()) {
  return tarih.getHours() * 60 + tarih.getMinutes();
}

/** Dakikayı HH:MM biçimine çevirir. */
function dkToSaat(dk) {
  const t = ((Number(dk) % 1440) + 1440) % 1440;
  const h = Math.floor(t / 60);
  const m = t % 60;
  return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
}

/** Slot için tip etiketi + kısa sezon/bölüm metni. */
function slotAltBilgi(slot) {
  const tipAd = slot.tip === 'dizi' ? 'Dizi' : 'Film';
  const sezon = slot.tip === 'dizi' && slot.sezon ? ` • S${slot.sezon}B${slot.bolum || 1}` : '';
  return `${tipAd}${sezon}`;
}

/**
 * Varsayılan TMDB fallback havuzu: popülerlik ağırlıklı TV + film listesi.
 * Yalnızca çekirdek havuz küçükken kanalProgramlaAsync içinden çağrılır;
 * çocuk profilinde filtrelenir. Scheduler'a enjekte edilir (testlerde mock).
 * @param {{mevcutIdler: Set<string>}} ctx
 * @returns {Promise<object[]>}
 */
async function tmdbFallbackHavuzu({ mevcutIdler } = {}) {
  const [tv, film] = await Promise.all([
    fetchDiscoverMedia({ type: 'tv', page: 1, sortBy: 'popularity.desc' }).catch(() => []),
    fetchDiscoverMedia({ type: 'movie', page: 1, sortBy: 'popularity.desc' }).catch(() => [])
  ]);
  const liste = [...(tv || []), ...(film || [])];
  const temiz = filterForActiveProfile(liste);
  return temiz.filter(x => x && x.id != null && !(mevcutIdler && mevcutIdler.has(String(x.id))));
}

/** Boş programda gösterilen bilgilendirme metni. */
function bosDurumHTML() {
  return `
    <div class="channel-empty" style="padding: 3.5rem 1.5rem; text-align: center; color: var(--text-muted);">
      <i data-lucide="tv-2" style="width: 44px; height: 44px; margin-bottom: 1rem; opacity: 0.7;"></i>
      <p style="margin: 0; font-size: 1.05rem;">Henüz kanalın için yeterli geçmiş yok — birkaç içerik izle, kanalın zenginleşsin.</p>
    </div>
  `;
}

/**
 * "Şu an yayında" büyük kartı + EPG şeridi HTML'ini üretir.
 * @param {Array} program kanalProgramla çıktısı
 * @param {{simdi: object|null, sonraki: object|null}} aktif
 * @param {number} uzunlukDk
 * @param {number} gunDk günün dakikası
 * @returns {string}
 */
function kanalGovdeHTML(program, aktif, uzunlukDk, gunDk) {
  if (!Array.isArray(program) || program.length === 0 || !aktif.simdi) return bosDurumHTML();

  const now = aktif.simdi;
  const nowIdx = program.indexOf(now);
  // EPG: şu anki slot + sonraki 6 slot (program sonunda başa sarar).
  const serit = [];
  for (let i = 0; i < Math.min(program.length, 7); i++) {
    serit.push(program[(nowIdx + i) % program.length]);
  }

  const seritHTML = serit.map((slot) => {
    const kaymaDk = (slot.baslangucDk - now.baslangucDk + 1440) % 1440;
    const saatEtiketi = dkToSaat(gunDk + kaymaDk);
    const aktifMi = slot === now;
    return `
      <button class="channel-epg-item ${aktifMi ? 'is-now' : ''}" type="button"
        data-tmdbid="${escHtml(slot.tmdbId)}"
        data-tip="${escHtml(slot.tip)}"
        data-ad="${escHtml(slot.ad)}"
        data-sezon="${escHtml(slot.sezon ?? '')}"
        data-bolum="${escHtml(slot.bolum ?? '')}">
        <span class="channel-epg-time">${escHtml(saatEtiketi)}${aktifMi ? ' • ŞİMDİ' : ''}</span>
        <span class="channel-epg-title" title="${escHtml(slot.ad)}">${escHtml(slot.ad)}</span>
        <span class="channel-epg-meta">${escHtml(slot.tur)} • ${escHtml(slotAltBilgi(slot))}</span>
      </button>
    `;
  }).join('');

  return `
    <div class="channel-now glass-panel" style="display:flex; gap:1.5rem; flex-wrap:wrap; padding:1.5rem; border-radius:var(--radius-md); border:1px solid var(--border-color); margin-bottom:1.75rem;">
      <div style="flex:1; min-width:240px;">
        <span class="cp-eyebrow" style="display:inline-flex; align-items:center; gap:0.4rem;">
          <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#ef4444;"></span> ŞU AN YAYINDA
        </span>
        <h2 style="margin:0.35rem 0 0.5rem; font-family:var(--font-heading);">${escHtml(now.ad)}</h2>
        <div style="display:flex; gap:0.75rem; flex-wrap:wrap; color:var(--text-muted); font-size:0.92rem;">
          <span><i data-lucide="clapperboard" style="width:14px;height:14px;"></i> ${escHtml(now.tur)}</span>
          <span><i data-lucide="clock" style="width:14px;height:14px;"></i> ~${escHtml(uzunlukDk)} dk</span>
          <span>${escHtml(slotAltBilgi(now))}</span>
        </div>
        <p class="channel-now-reason" style="margin:0.75rem 0 0; font-size:0.85rem; color:var(--text-muted);">
          <i data-lucide="sparkles" style="width:13px;height:13px;"></i> neden bu: ${escHtml(now.neden || '')}
        </p>
      </div>
    </div>
    <div class="channel-epg" style="display:flex; gap:0.75rem; overflow-x:auto; padding-bottom:0.75rem;">${seritHTML}</div>
  `;
}

/** slot detayını olaydan okuyup normalize eder. */
function slotDetayi(kart) {
  const tip = kart.getAttribute('data-tip') === 'dizi' ? 'dizi' : 'film';
  const detay = {
    tip,
    tmdbId: kart.getAttribute('data-tmdbid'),
    ad: kart.getAttribute('data-ad')
  };
  if (tip === 'dizi') {
    detay.sezon = Number(kart.getAttribute('data-sezon') || 1);
    detay.bolum = Number(kart.getAttribute('data-bolum') || 1);
  }
  return detay;
}

/**
 * "Kanalım" görünümünü üretir. DiscoverView kalıbına uyar: { html, init } döner.
 * @param {object} [secenekler]
 * @param {(ctx:{saatKovasi:number,mevcutIdler:Set<string>}) => Promise<object[]>} [secenekler.fallbackHavuzu]
 *        TMDB tür-ağırlıklı yedek havuz (testlerde mock; varsayılan gerçek TMDB).
 * @param {number} [secenekler.uzunlukDk=90]
 * @param {number} [secenekler.maxSlot=8]
 * @param {() => Date} [secenekler.simdi] test için enjekte edilebilir saat
 * @returns {Promise<{html: string, init: (container: HTMLElement) => void}>}
 */
export async function renderChannelView(secenekler = {}) {
  const uzunlukDk = Number(secenekler.uzunlukDk || 90);
  const maxSlot = Number(secenekler.maxSlot || 8);
  const fallbackHavuzu = secenekler.fallbackHavuzu || tmdbFallbackHavuzu;
  const simdiFn = typeof secenekler.simdi === 'function' ? secenekler.simdi : () => new Date();

  // Çocuk/profil filtresi çağıranın (view) sorumluluğunda: scheduler saf kalır.
  const gecmis = filterForActiveProfile(getGroupedWatchHistory() || []);
  const favoriler = filterForActiveProfile(getFavorites() || []);
  const watchlist = filterForActiveProfile(getWatchlist() || []);

  const tohum = tohumAl();
  const saatKovasi = simdiFn().getHours();

  // Hiç sinyal yoksa ağa çıkmadan boş program (fallback havuzu da tetiklenmez).
  const hicSinyal = gecmis.length === 0 && favoriler.length === 0 && watchlist.length === 0;
  let program = [];
  if (!hicSinyal) {
    program = await kanalProgramlaAsync({
      gecmis,
      favoriler,
      watchlist,
      saatKovasi,
      tohum,
      uzunlukDk,
      maxSlot,
      fallbackHavuzu
    });
    guvenliYaz(KANAL_PROGRAM_KEY, program);
  }

  const simdiDk = gununDakikasi(simdiFn());
  const aktif = yayindakiSlot(program, simdiDk);
  const govde = kanalGovdeHTML(program, aktif, uzunlukDk, simdiDk);

  const html = `
    <div class="channel-view" style="padding-top:6.5rem; padding-bottom:5rem;">
      <div class="container">
        <header class="cp-view-header" style="display:flex; flex-wrap:wrap; gap:1rem; align-items:flex-end; justify-content:space-between; margin-bottom:1.75rem;">
          <div>
            <span class="cp-eyebrow">SANA ÖZEL YAYIN AKIŞI.</span>
            <h1 style="margin:0.25rem 0 0;"><i data-lucide="tv" aria-hidden="true"></i> Kanalım</h1>
            <p style="margin:0.35rem 0 0;">Favorilerinden, izlediklerinden ve izleme saatinden cihazında programlanan kişisel kanalın.</p>
          </div>
          <button id="channel-reprogram-btn" class="btn-secondary" type="button"
            style="display:inline-flex; align-items:center; gap:0.4rem; padding:0.6rem 1.2rem; border-radius:var(--radius-full); cursor:pointer;">
            <i data-lucide="zap" style="width:15px;height:15px;"></i>
            <span>⚡ Kanalı Yeniden Programla</span>
          </button>
        </header>
        <div id="channelim-body">${govde}</div>
      </div>
    </div>
  `;

  return {
    html,
    init: (container) => {
      if (!container) return;
      const body = container.querySelector('#channelim-body');
      const btn = container.querySelector('#channel-reprogram-btn');

      // EPG şeridi içerik seçimi: oynatıcı AÇMAZ; olay + hash yönlendirmesi yapar.
      // Ana oturum 'kanal-slot-secildi' olayını dinleyip oynatıcıya bağlayacak.
      body?.addEventListener('click', (e) => {
        const kart = e.target.closest('.channel-epg-item');
        if (!kart) return;
        const detay = slotDetayi(kart);
        window.dispatchEvent(new CustomEvent('kanal-slot-secildi', { detail: detay }));
        window.location.hash = `#detail?type=${detay.tip === 'dizi' ? 'tv' : 'movie'}&id=${encodeURIComponent(detay.tmdbId)}`;
      });

      // Yeni tohum = yeni kanal; mevcut temiz dizilerle yeniden programlanır.
      btn?.addEventListener('click', () => {
        const yeniTohum = (Number(tohumAl()) + 1 + Math.floor(Math.random() * 1000)) % 2147483647 || 1;
        guvenliYaz(KANAL_TOHUM_KEY, yeniTohum);
        kanalProgramlaAsync({
          gecmis,
          favoriler,
          watchlist,
          saatKovasi: simdiFn().getHours(),
          tohum: yeniTohum,
          uzunlukDk,
          maxSlot,
          fallbackHavuzu
        }).then((sonuc) => {
          guvenliYaz(KANAL_PROGRAM_KEY, sonuc);
          if (!body) return;
          const yeniAktif = yayindakiSlot(sonuc, gununDakikasi(simdiFn()));
          body.innerHTML = kanalGovdeHTML(sonuc, yeniAktif, uzunlukDk, gununDakikasi(simdiFn()));
          renderIcons(body);
        });
      });

      renderIcons(container);
    }
  };
}
