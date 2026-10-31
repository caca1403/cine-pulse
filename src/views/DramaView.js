/* ==========================================================================
   CinePulse Studio — KISA DİZİ SAHNESİ (Kısa Diziler / Mini Seriler)
   Kaynak: DramaBox / ReelShort / ShortMax / FlexTV mikro dizileri (DDZ + DML)

   YENİ DENEME (2026-10-17) — kullanıcı isteği:
     "kısa dizi sayfası ve diğer yerler gerekliyse netflix mantığı, iphone
      estetiği olacak"
   Bu yüzden sayfa baştan kuruldu:
     • NETFLIX MANTIĞI → tek billboard (vitrin) + kişisel YATAY SATIRLAR
       ("Kaldığın yerden devam et", "Bugün trend", "Türkçe dublaj", türler) +
       kategori/arama ızgarası. Satırlar ekrana girdikçe yüklenir; açılışta
       9 istek birden atılmaz.
     • APPLE DİLİ → büyük yuvarlak köşe, buzlu çubuk, pil düğmeler, ince tüy
       kenarlık, tek vurgu rengi, yaylı (spring) geçişler. Mobilde detay
       özeti ve bölümleri ayrı bir detay sayfasında açılır.
   Tasarım kuralları kendi dosyasında: src/styles/kisa-dizi.css (kd-* ön eki).
   Eski ".drama-*" ekranı kaldırıldı; bölüm seçimi TEK yerde (oynatıcı rail'i).
   ========================================================================== */

import '../styles/kisa-dizi.css';
import { renderIcons } from '../services/kabuk/icons.js';
import {
  fetchTrendingDramas,
  fetchDramaCatalog,
  fetchDramaDetails
} from '../services/kaynak/dramaDizilerimScraper.js';
import { fetchDramalarDetails } from '../services/kaynak/dramalarScraper.js';
import { openPlayerModal } from '../components/openPlayer.js';
import { showToast } from '../components/Toast.js';
import { getUnifiedContinueWatching, removeWatchHistoryItem } from '../services/altyapi/storage.js';
import { isDesktopApp } from '../services/platform/platformBridge.js';

/* Kısa dizi kayıtları TMDB id'si yerine ddz_/dml_ önekiyle saklanır; geçmiş
   kayıtları da aynı öneki taşır. "Devam et" satırı bu önekle süzülür. */
const KISA_ONEK = /^(ddz_|dml_)/;

/* SATIR KATEGORİLERİ — DOĞRULANMIŞ (2026-10-17, /tmp/opencode/kd-baslik-dogrula.mjs).
   Kaynak sitede TÜR taksonomisi YOK; menüde yalnız /dizi (katalog) ve
   /search?q= var. Önceki başlıklar ("CEO & Patron", "Kurt & Alfa", "Yasak Aşk")
   uydurma kelime aramalarına dayanıyordu ve kullanıcı haklı olarak "çok alakasız"
   dedi. Bu listedeki her anahtar ÖLÇÜLDÜ: /search?q= her biri için 48 kayıt
   döndürüyor ve dönen başlıklar konuyla tutarlı (ör. "aşk" → Aşkı Zehir Gibi,
   "kurt" → Kurt Kral: Sıfırdan Alfaya, "vampir" → Vampir Prensin Gelini). */
const KATEGORILER = [
  { id: 'dublaj', label: 'Türkçe Dublaj', icon: 'audio-lines', query: 'dublaj', sub: 'Seslendirilmiş mikro diziler' },
  { id: 'ask', label: 'Aşk & Romantik', icon: 'heart', query: 'aşk', sub: 'Duygusal hikâyeler' },
  { id: 'intikam', label: 'İntikam', icon: 'flame', query: 'intikam', sub: 'Yüksek tempo' },
  { id: 'patron', label: 'Patron & Ofis', icon: 'briefcase', query: 'patron', sub: 'Güç ve hırs' },
  { id: 'milyarder', label: 'Milyarder', icon: 'crown', query: 'milyarder', sub: 'Zengin & fakir' },
  { id: 'gizem', label: 'Gizem', icon: 'search', query: 'gizem', sub: 'Sırlar ve entrikalar' },
  { id: 'evlilik', label: 'Düğün & Evlilik', icon: 'gift', query: 'evlilik', sub: 'Sahte evlilik, gerçek aşk' },
  { id: 'kurt', label: 'Kurt & Fantastik', icon: 'moon', query: 'kurt', sub: 'Fantastik dünya' }
];

const SAYFA_BASLIK = {
  katalog: 'Tüm Kısa Diziler',
  arama: 'Arama Sonuçları'
};

export async function renderDramaView(initialSlug = null, initialQuery = '', initialPlayback = null) {
  const desktopPlaybackUnavailable = isDesktopApp();
  let mod = 'vitrin'; // 'vitrin' (billboard + satırlar) | 'izgara' (kategori/arama)
  let aktifSeg = initialQuery ? 'arama' : 'vitrin';
  let aramaDizisi = initialQuery || '';
  let ızgaraListe = [];
  let sayfa = 0;
  let dahaVar = true;
  let yukleniyor = false;
  let istekSurumu = 0;
  let hataSayisi = 0;
  let seciliDizi = null;

  const html = `
    <div class="kd-root" id="kd-root">
      ${desktopPlaybackUnavailable ? `
        <div class="kd-desktop-playback-notice" role="alert">
          <i data-lucide="lock-keyhole" aria-hidden="true"></i>
          <span><strong>Masaüstünde kısa dizi oynatma kullanılamıyor.</strong> Bu sürümde dizilerin detaylarını ve bölüm listesini görüntüleyebilirsin; bölümler oynatılamaz.</span>
        </div>` : ''}
      <!-- 1) VITRIN: tek kahraman dizi, Netflix billboard'u gibi -->
      <section class="kd-billboard" id="kd-billboard" aria-label="Öne çıkan kısa dizi">
        <div class="kd-billboard-bg" id="kd-billboard-bg"></div>
        <div class="kd-billboard-scrim"></div>
        <div class="kd-billboard-body">
          <span class="kd-eyebrow"><i data-lucide="sparkles"></i> CP ÖZEL · MİNİ DİZİ</span>
          <h1 class="kd-billboard-title" id="kd-bb-title">Kısa Diziler</h1>
          <p class="kd-billboard-desc" id="kd-bb-desc">DramaBox, ReelShort ve ShortMax orijinal mikro dizileri — Türkçe dublaj ve altyazıyla.</p>
          <div class="kd-billboard-meta" id="kd-bb-meta"></div>
          <div class="kd-billboard-actions">
            <button class="kd-btn kd-btn-play" id="kd-bb-play" ${desktopPlaybackUnavailable ? 'disabled aria-label="Masaüstünde kısa dizi oynatma kullanılamıyor"' : ''}>
              <i data-lucide="${desktopPlaybackUnavailable ? 'lock-keyhole' : 'play'}" style="width:18px;height:18px"></i><span>${desktopPlaybackUnavailable ? 'Oynatma kapalı' : 'Oynat'}</span>
            </button>
            <button class="kd-btn kd-btn-ghost" id="kd-bb-info">
              <i data-lucide="info" style="width:17px;height:17px"></i><span>Detaylar</span>
            </button>
          </div>
        </div>
      </section>

      <!-- 2) ARAÇ ÇUBUĞU: arama + iOS segment kontrolü (yapışkan) -->
      <div class="kd-toolbar" id="kd-toolbar">
        <div class="kd-search">
          <i data-lucide="search"></i>
          <input id="kd-search" type="search" inputmode="search" autocomplete="off"
                 placeholder="Kısa dizi ara: patron, kurt, intikam…" value="${aramaDizisi.replace(/"/g, '&quot;')}" />
          <button class="kd-search-clear ${aramaDizisi ? '' : 'hidden'}" id="kd-search-clear" aria-label="Aramayı temizle">
            <i data-lucide="x"></i>
          </button>
        </div>
        <div class="kd-segments" id="kd-segments" role="tablist">
          <button class="kd-seg ${aktifSeg === 'vitrin' ? 'is-active' : ''}" role="tab" data-seg="vitrin">
            <i data-lucide="flame"></i><span>Trendler</span>
          </button>
          <button class="kd-seg" role="tab" data-seg="katalog">
            <i data-lucide="layers"></i><span>Katalog</span>
          </button>
          ${KATEGORILER.map(k => `
            <button class="kd-seg" role="tab" data-seg="${k.id}">
              <i data-lucide="${k.icon}"></i><span>${k.label}</span>
            </button>`).join('')}
        </div>
      </div>

      <!-- 3) SATIRLAR (yalnız vitrin modunda) -->
      <div class="kd-rails" id="kd-rails"></div>

      <!-- 4) IZGARA (kategori / katalog / arama) -->
      <section class="kd-section hidden" id="kd-izgara">
        <div class="kd-section-head">
          <h2 class="kd-section-title" id="kd-izgara-baslik">Katalog</h2>
          <span class="kd-count" id="kd-izgara-say">—</span>
        </div>
        <div class="kd-grid" id="kd-grid"></div>
        <div id="kd-sentinel" aria-hidden="true"></div>
        <div class="kd-more-wrap hidden" id="kd-more-wrap">
          <button class="kd-btn kd-btn-quiet" id="kd-more">
            <i data-lucide="plus" style="width:15px;height:15px"></i><span>Daha fazla getir</span>
          </button>
        </div>
      </section>

      <!-- 5) DETAY PERDESİ (mobil: alt çekmece / masaüstü: merkezî kart) -->
      <div class="kd-sheet-backdrop hidden" id="kd-sheet-backdrop">
        <div class="kd-sheet" id="kd-sheet" role="dialog" aria-modal="true"></div>
      </div>
    </div>
  `;

  return {
    html,
    init: async (container) => {
      const root = container.querySelector('#kd-root');
      if (!root) return;

      const billboard = root.querySelector('#kd-billboard');
      const bbBg = root.querySelector('#kd-billboard-bg');
      const bbTitle = root.querySelector('#kd-bb-title');
      const bbDesc = root.querySelector('#kd-bb-desc');
      const bbMeta = root.querySelector('#kd-bb-meta');
      const bbPlay = root.querySelector('#kd-bb-play');
      const bbInfo = root.querySelector('#kd-bb-info');
      const rails = root.querySelector('#kd-rails');
      const section = root.querySelector('#kd-izgara');
      const grid = root.querySelector('#kd-grid');
      const gridTitle = root.querySelector('#kd-izgara-baslik');
      const gridCount = root.querySelector('#kd-izgara-say');
      const sentinel = root.querySelector('#kd-sentinel');
      const moreWrap = root.querySelector('#kd-more-wrap');
      const moreBtn = root.querySelector('#kd-more');
      const search = root.querySelector('#kd-search');
      const searchClear = root.querySelector('#kd-search-clear');
      const segBtns = Array.from(root.querySelectorAll('.kd-seg'));
      const backdrop = root.querySelector('#kd-sheet-backdrop');
      const sheet = root.querySelector('#kd-sheet');

      /* ── Yapışkan çubuk, uygulamanın sabit gezinme çubuğunun hemen altında
             kalmalı; yükseklik cihazdan cihaza değiştiği için ölçülüyor. ── */
      const navYuksekliginiOle = () => {
        const nav = document.querySelector('.navbar');
        const h = nav ? Math.round(nav.getBoundingClientRect().height) : 58;
        root.style.setProperty('--kd-nav-h', `${h}px`);
      };
      navYuksekliginiOle();
      const navResize = () => navYuksekliginiOle();
      window.addEventListener('resize', navResize);
      setTimeout(navYuksekliginiOle, 600);

      /* ── Detay istekleri tek kez yapılır (billboard + kart aynı diziyse) ── */
      const detayHafizasi = new Map();
      async function detayGetir(slug) {
        if (!slug) return null;
        if (detayHafizasi.has(slug)) return detayHafizasi.get(slug);
        const istek = (async () => {
          /* "Devam et" kartının data-slug'u kayıt id'sidir ve ONEK TAŞIR
             (ddz_...). Saha ölçümü (kullanıcı 2026-10-18: "bölüm bilgisi
             alınamadı"): onekli slug site yoluna gidince 404 dönüyordu;
             detay istekleri her zaman ONEKSİZ slug ile yapılır. */
          const temiz = String(slug).replace(KISA_ONEK, '');
          if (String(slug).startsWith('dml_')) return fetchDramalarDetails(temiz);
          const ddz = await fetchDramaDetails(temiz).catch(() => null);
          if (ddz && (ddz.episodes || []).length) return ddz;
          return ddz || fetchDramalarDetails(temiz).catch(() => null);
        })().catch(() => null);
        detayHafizasi.set(slug, istek);
        const sonuc = await istek;
        if (!sonuc) detayHafizasi.delete(slug);
        return sonuc;
      }

      const temizListe = (items) => (Array.isArray(items) ? items : []).filter(Boolean);

      /* ── Kart üretimi (satır ve ızgara aynı kartı kullanır) ───────────── */
      function kartHtml(dizi, seçenekler = {}) {
        const { sira = 0, devam = null } = seçenekler;
        const slug = String(dizi.slug || '').replace(/"/g, '&quot;');
        const baslik = String(dizi.title || 'İsimsiz dizi');
        const dublaj = Boolean(dizi.isDubbed) || /dublaj/i.test(baslik);
        const poster = dizi.poster || dizi.poster_path || '';
        const yillik = baslik.replace(/^\(?\s*(dublajl[ıi]|altyaz[ıi])\s*\)?[\s:.-]*/i, '').replace(/[^\p{L}\p{N} ]/gu, ' ').trim().slice(0, 2) || 'CP';
        const yuzde = devam && typeof devam.progressPercent === 'number'
          ? Math.max(2, Math.min(100, Math.round(devam.progressPercent))) : 0;
        return `
          <article class="kd-card" data-slug="${slug}" tabindex="0" role="group" aria-label="${baslik}">
            ${devam ? `<button class="kd-card-del" type="button" data-del-id="${slug}" data-del-sez="${devam.season || 1}" data-del-bol="${devam.episode || 1}" aria-label="Listeden kaldır"><span aria-hidden="true">✕</span></button>` : ''}
            <div class="kd-card-media">
              ${poster
                ? `<img src="${poster}" alt="${baslik}" loading="eager" decoding="async" onload="var f=this.nextElementSibling; if(f && f.classList && f.classList.contains('kd-card-fallback')) f.style.display='none';" onerror="this.remove()" />`
                : ''}
              <div class="kd-card-fallback" aria-hidden="true">${yillik}</div>
              <span class="kd-card-badge ${dublaj ? 'dub' : ''}">${dublaj ? 'Dublaj' : 'Altyazı'}</span>
              ${sira ? `<span class="kd-card-rank" aria-hidden="true">${sira}</span>` : ''}
              <div class="kd-card-hover">
                <button class="kd-card-action kd-card-action-watch" type="button" data-card-action="watch" ${desktopPlaybackUnavailable ? 'disabled' : ''}
                  aria-label="${desktopPlaybackUnavailable ? 'Masaüstünde oynatma kullanılamıyor' : `${devam ? 'Bölüme devam et' : 'Bölümü izle'}: ${baslik}`}">
                  <i data-lucide="${desktopPlaybackUnavailable ? 'lock-keyhole' : 'play'}" aria-hidden="true"></i><span>${desktopPlaybackUnavailable ? 'Oynatma kapalı' : (devam ? 'Bölüme devam et' : 'Bölümü izle')}</span>
                </button>
                <button class="kd-card-action kd-card-action-detail" type="button" data-card-action="detail"
                  aria-label="İçerik sayfasına git: ${baslik}">
                  <i data-lucide="info" aria-hidden="true"></i><span>İçerik sayfasına git</span>
                </button>
              </div>
            </div>
            <div class="kd-card-info">
              <h3 class="kd-card-title" title="${baslik}">${baslik}</h3>
              <div class="kd-card-meta">
                <span>${devam ? `Bölüm ${devam.episode || 1}` : 'Mini dizi'}</span>
                <span class="kd-chip-dot"></span>
                <span>1080p</span>
              </div>
              ${yuzde ? `<div class="kd-progress"><i style="width:${yuzde}%"></i></div>` : ''}
            </div>
          </article>`;
      }

      const iskelet = (n = 7) => Array.from({ length: n }).map(() => `
        <div class="kd-skel-card">
          <div class="kd-skel"></div>
          <div class="kd-skel kd-skel-line"></div>
        </div>`).join('');

      /* ── SATIRLAR ─────────────────────────────────────────────────────── */
      /* Trend havuzu BİR KEZ çekilir: vitrin (billboard) ile "Bugün trend"
         satırı aynı veriyi paylaşır → açılışta gereksiz ikinci istek atılmaz. */
      let trendVadi = null;
      const trendHavuzu = () => {
        if (!trendVadi) trendVadi = fetchTrendingDramas().then(t => temizListe(t)).catch(() => []);
        return trendVadi;
      };

      const rayTanimlari = [
        { id: 'trend', baslik: 'Bugün Trend Olanlar', alt: 'Son 24 saat', yukle: trendHavuzu, sirala: true },
        { id: 'yeni', baslik: 'Yeni Eklenenler', alt: 'Kataloğun taze ucu', yukle: () => fetchDramaCatalog({ page: 1 }) },
        ...KATEGORILER.map(k => ({
          id: k.id,
          baslik: k.label,
          alt: k.sub,
          yukle: () => fetchDramaCatalog({ query: k.query })
        }))
      ];

      /* Geçmişten gelen "devam et" satırı: senkron (localStorage) → anında görünür. */
      function devamListesi() {
        try {
          return temizListe(getUnifiedContinueWatching() || [])
            .filter(it => it && KISA_ONEK.test(String(it.id || '')))
            .slice(0, 18);
        } catch (_) {
          return [];
        }
      }

      /* ── SIRALI YÜKLEME KUYRUĞU ──────────────────────────────────────────
         KANIT (cihaz, apk47): 8 satır AYNI ANDA istek atınca kaynak site
         (Cloudflare) istekleri kısıtladı, her satır hata verdi ve hata yolu
         satırı DOM'dan sildiği için sayfa BOMBOŞ kaldı — kullanıcı: "kısa dizi
         sayfasında kartlar hiç gelmiyor şu an". Artık aynı anda TEK istek
         uçar; kaydırma gözlemcisi satırı kuyruğun ÖNÜNE alır (hızlı tepki),
         kuyruk yine seri çalışır. */
      const kuyruk = [];
      /* İŞÇİ SAYISI ölçümle seçildi: 8 satır birden → kaynak site istekleri
         kısıtladı ve sayfa boş kaldı; 1 işçi → 10 satır ~25 sn'de doluyordu.
         2 işçi + istekler arası 200 ms aralık dengeli (apk48 ölçümü). */
      const ISCI_SAYISI = 2;
      let calisanIsci = 0;
      let kuyrukZaman = null;
      function kuyrugaEkle(id) {
        if (!id) return;
        if (!kuyruk.includes(id)) kuyruk.push(id);
        kuyrukIsle();
      }
      function kuyrukIsle() {
        if (!document.contains(rails)) return;
        while (calisanIsci < ISCI_SAYISI && kuyruk.length) {
          const id = kuyruk.shift();
          calisanIsci += 1;
          const bitir = () => {
            calisanIsci -= 1;
            if (kuyrukZaman) clearTimeout(kuyrukZaman);
            kuyrukZaman = setTimeout(() => { if (document.contains(rails)) kuyrukIsle(); }, 200);
          };
          rayYukle(id).then(bitir, bitir);
        }
      }

      const gozlemci = new IntersectionObserver((girdiler) => {
        for (const g of girdiler) {
          if (!g.isIntersecting) continue;
          gozlemci.unobserve(g.target);
          kuyrugaEkle(g.target.getAttribute('data-ray'));
        }
      }, { rootMargin: '500px 0px' });

      function rayKur({ id, baslik, alt }, { onizleme = '', kartlar = '', gozle = true } = {}) {
        const el = document.createElement('section');
        el.className = 'kd-rail';
        el.innerHTML = `
          <div class="kd-rail-head">
            <h2 class="kd-rail-title">${onizleme || baslik}</h2>
            ${alt ? `<span class="kd-rail-sub">${alt}</span>` : ''}
          </div>
          <div class="kd-rail-viewport">
            <button class="kd-rail-btn prev is-off" data-dir="-1" aria-label="Geri"><i data-lucide="chevron-left"></i></button>
            <div class="kd-rail-track" data-ray="${id}" ${gozle ? '' : 'data-hazir="1"'}>${kartlar || iskelet()}</div>
            <button class="kd-rail-btn next" data-dir="1" aria-label="İleri"><i data-lucide="chevron-right"></i></button>
          </div>`;
        rails.appendChild(el);
        const track = el.querySelector('.kd-rail-track');
        if (gozle) gozlemci.observe(track);
        track.addEventListener('scroll', () => rayKaydirmaKontrolu(track), { passive: true });
        renderIcons(el);
        return el;
      }

      async function rayYukle(id) {
        const tanim = rayTanimlari.find(r => r.id === id);
        const track = rails.querySelector(`.kd-rail-track[data-ray="${id}"]`);
        if (!tanim || !track) return;
        // ÇİFT YÜKLEME KİLİDİ: kaydırma gözlemcisi ile aşağıdaki tembel-önceden
        // yükleme kuyruğu aynı satırı yarıştırmaz.
        if (track.dataset.yukleniyor === '1' || track.dataset.hazir === '1') return;
        track.dataset.yukleniyor = '1';
        try {
          let gelen = temizListe(await tanim.yukle());
          // Kullanıcı (2026-10-17): "kaynak çok az kart gözüküyor" → ölçülen
          // kaynak (48 kayıt/anahtar, kd-baslik-dogrula) tamamen kullanılır.
          gelen = gelen.slice(0, 24);
          if (!gelen.length) {
            const bos = new Error(`Kısa dizi satırı boş döndü: ${id}`);
            bos.bosListe = true;   // yeniden denemesi anlamlı (kısıtlama olabilir)
            throw bos;
          }
          track.innerHTML = gelen.map((d, i) => kartHtml(d, { sira: tanim.sirala ? i + 1 : 0 })).join('');
          track.dataset.hazir = '1';
          renderIcons(track);
          // Billboard kahramanını ilk trend satırından seç (görseli olan ilk kayıt).
          if (tanim.sirala && !vitrinDizisi) vitrinSec(gelen.find(d => d.poster) || gelen[0]);
        } catch (err) {
          /* HATA SATIRI SİLMEZ (kullanıcı: "kartlar hiç gelmiyor"). Kaynak
             site geçici olarak kısıtlarsa satır yok oluyordu; artık iskelet
             kalır, iki kez kendiliğinden yeniden denenir, sonrasında elle
             "Tekrar dene" düğmesi gösterilir. */
          console.warn('[KısaDizi] satır yüklenemedi:', id, err?.message || err);
          track.dataset.yukleniyor = '';
          const deneme = Number(track.dataset.deneme || 0) + 1;
          track.dataset.deneme = String(deneme);
          if (deneme <= 2) {
            setTimeout(() => {
              if (document.contains(rails) && track.dataset.hazir !== '1') kuyrugaEkle(id);
            }, 3000 * deneme);
          } else {
            track.innerHTML = `<button class="kd-ray-tekrar" type="button">
              <i data-lucide="refresh-cw"></i> Satır yüklenemedi · Tekrar dene
            </button>`;
            renderIcons(track);
            track.querySelector('.kd-ray-tekrar')?.addEventListener('click', () => {
              track.dataset.deneme = '0';
              track.dataset.yukleniyor = '';
              track.innerHTML = iskelet();
              renderIcons(track);
              kuyrugaEkle(id);
            });
          }
        }
      }

      /* ── RAY SONSUZ YÜKLEME ──────────────────────────────────────────────
         Kullanıcı (2026-10-18): "yana doğru kaydırınca içerikler gelmeye devam
         etmiyor." Katalog/kategori rayları tek sayfayla (24 kart) sınırlıydı.
         Rayın sağına yaklaşınca sonraki sayfa sona eklenir (ızgara sonsuz
         kaydırmasıyla aynı mantık; ölçüldü: sayfalar 0 örtüşmeyle farklı).
         Trend rayı ("/") ve "devam" rayı sayfalı olmadığı için katlanmaz. */
      const rayDurum = new Map(); // id -> { sayfa, dahaVar, yukleniyor }
      function raySayfaliMi(id) {
        return id === 'yeni' || KATEGORILER.some(k => k.id === id);
      }
      async function raySonrakiGetir(id) {
        const track = rails.querySelector(`.kd-rail-track[data-ray="${id}"]`);
        if (!track || track.dataset.hazir !== '1') return;
        const st = rayDurum.get(id) || { sayfa: 1, dahaVar: true };
        rayDurum.set(id, st);
        if (!st.dahaVar || st.yukleniyor) return;
        st.yukleniyor = true;
        const sonraki = st.sayfa + 1;
        try {
          const kategori = KATEGORILER.find(k => k.id === id);
          const gelen = temizListe(await (kategori
            ? fetchDramaCatalog({ query: kategori.query, page: sonraki })
            : fetchDramaCatalog({ page: sonraki })));
          const mevcut = new Set([...track.querySelectorAll('.kd-card')].map(c => c.getAttribute('data-slug')));
          const taze = gelen.filter(d => d.slug && !mevcut.has(d.slug));
          if (taze.length) {
            track.insertAdjacentHTML('beforeend', taze.map(d => kartHtml(d)).join(''));
            renderIcons(track);
            st.sayfa = sonraki;
          }
          if (!gelen.length) st.dahaVar = false;   // kaynak sayfayı tüketti
        } catch (_) {
          st.dahaVar = false;                        // kalıcı hatırda sonsuz deneme yok
        } finally {
          st.yukleniyor = false;
        }
      }
      function rayKaydirmaKontrolu(track) {
        const id = track.getAttribute('data-ray');
        if (!raySayfaliMi(id)) return;
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 450) raySonrakiGetir(id);
      }

      /* Devam et satırı (boşsa hiç çizilmez — Netflix de boş satır göstermez). */
      const devam = devamListesi();
      if (devam.length) {
        rayKur(
          { id: 'devam', baslik: 'Kaldığın Yerden Devam Et', alt: `${devam.length} dizi` },
          { kartlar: devam.map(it => kartHtml(
            { slug: it.id, title: it.title || it.name || 'Kısa dizi', poster: it.poster_path || it.posterPath || it.poster, isDubbed: it.isDubbed },
            { devam: it }
          )).join(''), gozle: false }
        );
      }
      rayTanimlari.forEach(t => rayKur(t));

      /* TEMBEL YÜKLEME TEK BAŞINA YETMİYOR (kullanıcı 2026-10-17: "katalog
         resimleri gelmiyor"). App, sayfa başına dikey kaydırma konumunu geri
         yüklüyor; kullanıcı kısa diziyi alt taraflardan açtığında ekran iskelet
         kutularında kalıyordu. Satırlar artık kademeli olarak kuyruğa girer —
         KAYNAĞA AYNI ANDA TEK İSTEK gider (kısıtlanma = bomboş sayfa). */
      const onYukleveye = rayTanimlari.map((t, i) =>
        setTimeout(() => { if (document.contains(rails)) kuyrugaEkle(t.id); }, 900 + i * 250)
      );

      /* Ray ok düğmeleri + okunabilir kenar rozetleri */
      rails.addEventListener('click', (e) => {
        const btn = e.target.closest('.kd-rail-btn');
        if (!btn) return;
        const track = btn.closest('.kd-rail-viewport').querySelector('.kd-rail-track');
        const adim = Math.max(240, track.clientWidth * 0.82);
        track.scrollBy({ left: adim * Number(btn.dataset.dir), behavior: 'smooth' });
      });
      rails.addEventListener('scroll', (e) => {
        const track = e.target;
        if (!track.classList?.contains('kd-rail-track')) return;
        const oklar = track.closest('.kd-rail-viewport').querySelectorAll('.kd-rail-btn');
        const bas = track.scrollLeft <= 6;
        const son = track.scrollLeft + track.clientWidth >= track.scrollWidth - 6;
        oklar[0].classList.toggle('is-off', bas);
        oklar[1].classList.toggle('is-off', son);
      }, true);

      /* ── VITRIN ───────────────────────────────────────────────────────── */
      let vitrinDizisi = null;
      function vitrinSec(dizi) {
        if (!dizi) return;
        vitrinDizisi = dizi;
        const baslik = String(dizi.title || 'Kısa Dizi');
        const dublaj = Boolean(dizi.isDubbed) || /dublaj/i.test(baslik);
        bbBg.style.backgroundImage = dizi.poster ? `url("${dizi.poster}")` : '';
        bbTitle.textContent = baslik;
        bbMeta.innerHTML = `
          <b>${dublaj ? 'Türkçe Dublaj' : 'Türkçe Altyazı'}</b>
          <span class="kd-chip-dot"></span><span>Mini dizi</span>
          <span class="kd-chip-dot"></span><span>1080p HLS</span>
          <span class="kd-chip-dot"></span><span>Reels formatı</span>`;
        renderIcons(billboard);
        // Özet, kart verisinde yok: detay isteğiyle tamamlanır (başarısızsa suskun kalır).
        bbDesc.textContent = dizi.description || '';
        detayGetir(dizi.slug).then((d) => {
          if (!d || vitrinDizisi?.slug !== dizi.slug) return;
          bbDesc.textContent = d.description || bbDesc.textContent;
        });
      }

      /* ── IZGARA MODU ──────────────────────────────────────────────────── */
      function modaGec(yeniMod) {
        mod = yeniMod;
        const vitrin = yeniMod === 'vitrin';
        // Vitrin, veri gelmeden de görünür kalır (başlık/özet zaten genel bir
        // tanıtım metni taşıyor); boş bir boşluk göstermemek için saklanmaz.
        billboard.classList.toggle('hidden', !vitrin);
        rails.classList.toggle('hidden', !vitrin);
        section.classList.toggle('hidden', vitrin);
      }

      function segSec(id) {
        aktifSeg = id;
        segBtns.forEach(b => b.classList.toggle('is-active', b.dataset.seg === id));
      }

      async function ızgaraYeniden(baslik, sayfaSayaci = 1) {
        const surum = ++istekSurumu;
        hataSayisi = 0;
        yukleniyor = true;
        ızgaraListe = [];
        dahaVar = true;
        sayfa = 0;
        modaGec('izgara');
        segSec(aktifSeg);
        gridTitle.textContent = baslik;
        gridCount.textContent = 'Yükleniyor…';
        grid.innerHTML = Array.from({ length: 12 }).map(() => `
          <div>
            <div class="kd-skel" style="aspect-ratio:2/3"></div>
            <div class="kd-skel kd-skel-line"></div>
          </div>`).join('');
        try {
          const gelen = await ızgaraSayfa(sayfaSayaci);
          if (surum !== istekSurumu) return;
          sayfa = sayfaSayaci;
          ızgaraCiz(gelen, false);
        } catch (err) {
          if (surum !== istekSurumu) return;
          console.error('[KısaDizi] ızgara yüklenemedi:', err);
          grid.innerHTML = `
            <div class="kd-state" style="grid-column:1/-1">
              <i data-lucide="wifi-off"></i>
              <h3>Diziler yüklenemedi</h3>
              <p>Bağlantını kontrol et; kaynak siteler bazen birkaç dakikalığına kapanıyor.</p>
              <button class="kd-btn kd-btn-ghost" id="kd-yeniden">Tekrar dene</button>
            </div>`;
          renderIcons(grid);
          grid.querySelector('#kd-yeniden')?.addEventListener('click', () => ızgaraYeniden(baslik, sayfaSayaci));
        } finally {
          if (surum === istekSurumu) {
            yukleniyor = false;
            if (dahaVar && sentinelGorunur()) ızgaraDevam();
          }
        }
      }

      function ızgaraSayfa(sorguSayfasi) {
        if (aramaDizisi) return fetchDramaCatalog({ query: aramaDizisi, page: sorguSayfasi });
        const kategori = KATEGORILER.find(k => k.id === aktifSeg);
        if (kategori) return fetchDramaCatalog({ query: kategori.query, page: sorguSayfasi });
        return fetchDramaCatalog({ page: sorguSayfasi });
      }

      function ızgaraCiz(gelen, sonaEkle) {
        const bilinen = new Set(ızgaraListe.map(d => d.slug));
        const taze = temizListe(gelen).filter(d => d.slug && !bilinen.has(d.slug) && bilinen.add(d.slug));
        if (sonaEkle) ızgaraListe.push(...taze);
        else ızgaraListe = taze;
        dahaVar = taze.length > 0;

        gridCount.textContent = `${ızgaraListe.length} dizi`;
        if (!ızgaraListe.length) {
          grid.innerHTML = `
            <div class="kd-state" style="grid-column:1/-1">
              <i data-lucide="search-x"></i>
              <h3>Eşleşen kısa dizi yok</h3>
              <p>Farklı bir kelime dene — örneğin “patron”, “kurt”, “intikam” ya da “dublaj”.</p>
            </div>`;
          renderIcons(grid);
          moreWrap.classList.add('hidden');
          return;
        }
        const parca = taze.map(d => kartHtml(d)).join('');
        if (sonaEkle) grid.insertAdjacentHTML('beforeend', parca);
        else grid.innerHTML = parca;
        renderIcons(grid);
        moreWrap.classList.toggle('hidden', !dahaVar);
      }

      const sentinelGorunur = () => sentinel.getBoundingClientRect().top < window.innerHeight + 700;

      async function ızgaraDevam() {
        if (yukleniyor || !dahaVar) return;
        yukleniyor = true;
        const surum = istekSurumu;
        const sonraki = sayfa + 1;
        try {
          const gelen = await ızgaraSayfa(sonraki);
          if (surum !== istekSurumu) return;
          sayfa = sonraki;
          ızgaraCiz(gelen, true);
          if (dahaVar && sentinelGorunur()) setTimeout(ızgaraDevam, 60);
        } catch (err) {
          if (surum !== istekSurumu) return;
          console.warn('[KısaDizi] sonraki sayfa alınamadı:', err?.message || err);
          hataSayisi += 1;
          if (hataSayisi > 2) dahaVar = false;
          moreWrap.classList.toggle('hidden', !dahaVar);
        } finally {
          if (surum === istekSurumu) yukleniyor = false;
        }
      }

      new IntersectionObserver((g) => {
        if (mod === 'izgara' && g.some(x => x.isIntersecting)) ızgaraDevam();
      }, { rootMargin: '700px 0px' }).observe(sentinel);

      moreBtn?.addEventListener('click', ızgaraDevam);

      /* ── SEGMENT / ARAMA ETKİLEŞİMLERİ ───────────────────────────────── */
      segBtns.forEach(btn => btn.addEventListener('click', () => {
        const id = btn.dataset.seg;
        aramaDizisi = '';
        search.value = '';
        searchClear.classList.add('hidden');
        if (id === 'vitrin') {
          segSec('vitrin');
          modaGec('vitrin');
          return;
        }
        segSec(id);
        const kategori = KATEGORILER.find(k => k.id === id);
        ızgaraYeniden(kategori ? kategori.label : SAYFA_BASLIK.katalog);
      }));

      let aramaZamanlayici = null;
      search?.addEventListener('input', () => {
        const deger = search.value.trim();
        searchClear.classList.toggle('hidden', !deger);
        clearTimeout(aramaZamanlayici);
        aramaZamanlayici = setTimeout(() => {
          aramaDizisi = deger;
          if (deger.length >= 2) {
            segSec('arama');
            ızgaraYeniden(`“${deger}”`);
          } else if (deger.length === 0) {
            segSec('vitrin');
            modaGec('vitrin');
          }
        }, 320);
      });
      search?.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        clearTimeout(aramaZamanlayici);
        aramaDizisi = search.value.trim();
        if (aramaDizisi.length < 2) return;
        segSec('arama');
        ızgaraYeniden(`“${aramaDizisi}”`);
      });
      searchClear?.addEventListener('click', () => {
        search.value = '';
        searchClear.classList.add('hidden');
        aramaDizisi = '';
        segSec('vitrin');
        modaGec('vitrin');
      });

      /* ── DETAY PERDESİ ───────────────────────────────────────────────── */
      function perdeKapat() {
        backdrop.classList.add('hidden');
        document.body.style.overflow = '';
        seciliDizi = null;
      }

      async function perdeAc(slug) {
        if (!slug) return;
        backdrop.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        sheet.innerHTML = `<div class="kd-loading-row"><i data-lucide="loader-2"></i>Dizi bilgileri yükleniyor…</div>`;
        renderIcons(sheet);

        const detay = await detayGetir(slug);
        if (!detay) {
          sheet.innerHTML = `
            <button class="kd-sheet-close" data-kapat aria-label="Kapat"><i data-lucide="x"></i></button>
            <div class="kd-state">
              <i data-lucide="alert-circle"></i>
              <h3>Dizi bilgisi alınamadı</h3>
              <p>Kaynak şu an yanıt vermiyor. Birazdan tekrar dene.</p>
              <button class="kd-btn kd-btn-ghost" data-kapat>Kapat</button>
            </div>`;
          renderIcons(sheet);
          return;
        }
        seciliDizi = detay;
        const { title, poster, description, episodes = [], isDubbed, totalEpisodes } = detay;
        const bolumSayisi = totalEpisodes || episodes.length || 1;
        const dublaj = Boolean(isDubbed) || /dublaj/i.test(String(title));
        sheet.innerHTML = `
          <button class="kd-sheet-close" data-kapat aria-label="Kapat"><i data-lucide="x"></i></button>
          <div class="kd-sheet-grabber" aria-hidden="true"></div>
          <div class="kd-sheet-hero">
            <div class="kd-sheet-hero-bg" style="background-image:url('${poster || ''}')"></div>
            <div class="kd-sheet-hero-scrim"></div>
            <div class="kd-sheet-hero-body">
              <div class="kd-sheet-pills">
                <span class="kd-pill ${dublaj ? 'accent' : ''}">${dublaj ? 'Türkçe dublaj' : 'Türkçe altyazı'}</span>
                <span class="kd-pill">Mini dizi</span>
                <span class="kd-pill">${bolumSayisi} bölüm</span>
                <span class="kd-pill">1080p HLS</span>
              </div>
              <h2 class="kd-sheet-title">${title}</h2>
            </div>
          </div>
          <div class="kd-sheet-body">
            <p class="kd-sheet-desc">${description || 'Bu kısa dizi için özet girilmemiş.'}</p>
            <div class="kd-sheet-actions">
              <button class="kd-btn kd-btn-play" id="kd-perde-oynat">
                <i data-lucide="play" style="width:18px;height:18px;fill:currentColor"></i>
                <span>1. Bölümden Başla</span>
              </button>
              <button class="kd-btn kd-btn-ghost" id="kd-perde-paylas">
                <i data-lucide="share-2" style="width:16px;height:16px"></i><span>Paylaş</span>
              </button>
            </div>
            <p class="kd-sheet-note">
              <i data-lucide="list-restart"></i>
              <span>${bolumSayisi} bölüm var · bölüm seçimi oynatıcının içindeki “Bölümler” şeridinden yapılır</span>
            </p>
            <div class="kd-sheet-episodes" id="kd-sheet-episodes">
              ${episodes.length ? `
                <h4 class="kd-sheet-ep-title">Bölümler</h4>
                <div class="kd-sheet-ep-grid">
                  ${episodes.slice(0, 30).map(ep => `
                    <button class="kd-ep-chip" data-sez="${ep.season || 1}" data-bol="${ep.episode}" type="button">
                      B${ep.episode}
                    </button>
                  `).join('')}
                  ${episodes.length > 30 ? `<span class="kd-ep-more">+${episodes.length - 30} bölüm</span>` : ''}
                </div>
              ` : ''}
            </div>`;
        renderIcons(sheet);

        sheet.querySelector('[data-kapat]')?.addEventListener('click', perdeKapat);
        /* Bölüm çipleri: doğrudan o bölümden başlat (bölümler arası geçiş
           perdeden de yapılır — kullanıcı 2026-10-31). */
        sheet.querySelectorAll('.kd-ep-chip').forEach(chip => {
          chip.addEventListener('click', (e) => {
            bolumOynat(detay, Number(chip.dataset.sez) || 1, Number(chip.dataset.bol) || 1, e.currentTarget);
          });
        });
        sheet.querySelector('#kd-perde-oynat')?.addEventListener('click', (e) => {
          const ilk = episodes[0] || { season: 1, episode: 1 };
          bolumOynat(detay, ilk.season, ilk.episode, e.currentTarget);
        });
        sheet.querySelector('#kd-perde-paylas')?.addEventListener('click', () => {
          const adres = `${window.location.origin}${window.location.pathname}#dramas?slug=${slug}`;
          navigator.clipboard?.writeText(adres)
            .then(() => showToast('Bağlantı panoya kopyalandı.', 'success'))
            .catch(() => showToast(`Bağlantı: ${adres}`, 'info'));
        });
      }

      async function detaySayfasiGoster(slug, playback = null) {
        root.innerHTML = `
          <section class="kd-detail-page" aria-live="polite">
            <button class="kd-detail-back" type="button" data-detail-back>
              <i data-lucide="arrow-left" aria-hidden="true"></i><span>Kısa dizilere dön</span>
            </button>
            <div class="kd-detail-loading"><i data-lucide="loader-2" aria-hidden="true"></i><span>Dizi bilgileri yükleniyor…</span></div>
          </section>`;
        renderIcons(root);

        const detay = await detayGetir(slug);
        if (!document.contains(root)) return;

        const esc = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({
          '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[char]);
        const geriDugmesi = '<button class="kd-detail-back" type="button" data-detail-back><i data-lucide="arrow-left" aria-hidden="true"></i><span>Kısa dizilere dön</span></button>';

        if (!detay) {
          root.innerHTML = `
            <section class="kd-detail-page">
              ${geriDugmesi}
              <div class="kd-detail-state" role="alert">
                <i data-lucide="alert-circle" aria-hidden="true"></i>
                <h1>Dizi bilgisi alınamadı</h1>
                <p>Kaynak şu an yanıt vermiyor. Yeniden deneyebilir veya kısa dizilere dönebilirsin.</p>
                <button class="kd-btn kd-btn-ghost" type="button" data-detail-retry>Yeniden dene</button>
              </div>
            </section>`;
          root.querySelector('[data-detail-back]')?.addEventListener('click', () => {
            window.location.hash = '#dramas';
          });
          root.querySelector('[data-detail-retry]')?.addEventListener('click', () => {
            detayHafizasi.delete(slug);
            detaySayfasiGoster(slug, playback);
          });
          renderIcons(root);
          return;
        }

        if (playback?.play) {
          await bolumOynat(
            detay,
            Number(playback.season) || 1,
            Number(playback.episode) || 1,
            null,
            Number(playback.currentTime) || 0
          );
          return;
        }

        const baslik = esc(detay.title || 'Kısa dizi');
        const aciklama = esc(detay.description || 'Bu kısa dizi için özet girilmemiş.');
        const poster = esc(detay.poster || '');
        const bolumler = Array.isArray(detay.episodes) ? detay.episodes : [];
        const bolumSayisi = Number(detay.totalEpisodes) || bolumler.length;

        root.innerHTML = `
          <section class="kd-detail-page">
            ${geriDugmesi}
            <header class="kd-detail-hero">
              ${poster ? `<img class="kd-detail-poster" src="${poster}" alt="" />` : '<div class="kd-detail-poster kd-detail-poster-fallback" aria-hidden="true"><i data-lucide="clapperboard"></i></div>'}
              <div class="kd-detail-info">
                <div class="kd-detail-meta">
                  <span class="kd-pill">${detay.isDubbed ? 'Türkçe dublaj' : 'Türkçe altyazı'}</span>
                  <span class="kd-pill">${bolumSayisi || bolumler.length} bölüm</span>
                  <span class="kd-pill">Mini dizi</span>
                </div>
                <h1 class="kd-detail-title">${baslik}</h1>
                <p class="kd-detail-overview">${aciklama}</p>
              </div>
            </header>
            <section class="kd-detail-episodes" aria-labelledby="kd-detail-episodes-title">
              <div class="kd-detail-episodes-heading">
                <h2 id="kd-detail-episodes-title">Bölümler</h2>
                <span>${bolumler.length} bölüm</span>
              </div>
              ${bolumler.length ? `
                <div class="kd-detail-episode-list">
                  ${bolumler.map((ep) => `
                    <button class="kd-detail-episode" type="button" data-sez="${Number(ep.season) || 1}" data-bol="${Number(ep.episode) || 1}" ${desktopPlaybackUnavailable ? 'disabled aria-label="Masaüstünde oynatma kullanılamıyor"' : ''}>
                      ${ep.thumb ? `<img src="${esc(ep.thumb)}" alt="" loading="lazy" />` : '<span class="kd-detail-episode-number" aria-hidden="true"><i data-lucide="play"></i></span>'}
                      <span class="kd-detail-episode-label">${esc(ep.title || `Bölüm ${ep.episode}`)}</span>
                      <i data-lucide="${desktopPlaybackUnavailable ? 'lock-keyhole' : 'play'}" aria-hidden="true"></i>
                    </button>`).join('')}
                </div>
              ` : '<p class="kd-detail-no-episodes">Bu dizi için bölüm bilgisi bulunamadı.</p>'}
            </section>
          </section>`;

        root.querySelector('[data-detail-back]')?.addEventListener('click', () => {
          window.location.hash = '#dramas';
        });
        root.querySelectorAll('.kd-detail-episode').forEach((button) => {
          button.addEventListener('click', () => {
            bolumOynat(detay, Number(button.dataset.sez) || 1, Number(button.dataset.bol) || 1, button);
          });
        });
        renderIcons(root);
      }

      backdrop.addEventListener('click', (e) => { if (e.target === backdrop) perdeKapat(); });
      sheet.addEventListener('click', (e) => { if (e.target.closest('[data-kapat]')) perdeKapat(); });

      /* ── OYNATMA ─────────────────────────────────────────────────────── */
      async function bolumOynat(dizi, sezon = 1, bolum = 1, tetikleyen = null, devamSaniye = 0) {
        if (!dizi) return;
        if (desktopPlaybackUnavailable) {
          showToast('Masaüstü sürümünde kısa dizi oynatma kullanılamıyor.', 'info');
          return;
        }
        const kayitli = tetikleyen ? tetikleyen.innerHTML : null;
        if (tetikleyen) {
          tetikleyen.disabled = true;
          tetikleyen.innerHTML = '<i data-lucide="loader-2"></i><span>Açılıyor…</span>';
          renderIcons(tetikleyen);
        }
        try {
          perdeKapat();
          const slug = String(dizi.slug || '');
          const temiz = slug.replace(KISA_ONEK, '');
          const onek = slug.startsWith('dml_') ? 'dml_' : 'ddz_';
          const bolumler = dizi.episodes || [];
          const gorsel = bolumler.find(ep => ep.season === sezon && ep.episode === bolum)?.thumb || dizi.poster;
          await openPlayerModal({
            type: 'tv',
            tmdbId: `${onek}${temiz}`,
            title: `${dizi.title} - B${bolum}`,
            seriesTitle: dizi.title,
            season: sezon,
            episode: bolum,
            currentTime: Number(devamSaniye) || 0,   // kaldığın saniyeden başlat
            posterPath: dizi.poster,
            backdropPath: dizi.poster,
            playerVariant: 'short-drama',
            seriesOverview: dizi.description || '',
            episodeArtworkPath: gorsel || dizi.poster,
            shortDramaEpisodes: bolumler,
            maxEpisodes: bolumler.length,
            seasonsList: [{ season_number: sezon, episode_count: bolumler.length }]
          });
        } catch (err) {
          console.error('[KısaDizi] bölüm açılamadı:', err);
          showToast('Bölüm açılırken bir sorun oluştu, tekrar deneyin.', 'error');
        } finally {
          if (tetikleyen && kayitli) {
            tetikleyen.disabled = false;
            tetikleyen.innerHTML = kayitli;
            renderIcons(tetikleyen);
          }
        }
      }

      /* Kart tıklamaları: satırlar + ızgara ortak (delegasyon).
         "Devam et" kartı doğrudan kaldığı bölüme gider; diğerleri perdede açılır. */
      async function kartaTikla(kart) {
        const slug = kart?.getAttribute('data-slug');
        if (!slug) return;
        const devamKaydi = devam.find(it => String(it.id) === slug);
        if (devamKaydi) {
          const detay = await detayGetir(slug);
          if (!detay) { showToast('Bölüm bilgisi alınamadı.', 'error'); return; }
          bolumOynat(detay, devamKaydi.season || 1, devamKaydi.episode || 1, kart, devamKaydi.currentTime || 0);
          return;
        }
        window.location.hash = `#dramas?slug=${encodeURIComponent(slug)}`;
      }

      async function karttanBolumOynat(kart, dugme) {
        const slug = kart?.getAttribute('data-slug');
        if (!slug) return;
        const devamKaydi = devam.find(it => String(it.id) === slug);
        const detay = await detayGetir(slug);
        if (!detay) { showToast('Bölüm bilgisi alınamadı.', 'error'); return; }
        const ilkBolum = (detay.episodes || [])[0];
        const sezon = devamKaydi
          ? Number(devamKaydi.season) || 1
          : Number(ilkBolum?.season) || 1;
        const bolum = devamKaydi
          ? Number(devamKaydi.episode) || 1
          : Number(ilkBolum?.episode) || 1;
        bolumOynat(detay, sezon, bolum, dugme, devamKaydi?.currentTime || 0);
      }

      /* "Devam et" kartından bir kaydı listeye veda ettir (kullanıcı 2026-10-18:
         "kısa dizi kısmında kaldığın yerden devam etleri silme seçeneği yok"). */
      function devamKaydiSil(dugme) {
        const id = dugme.getAttribute('data-del-id');
        const sezon = Number(dugme.getAttribute('data-del-sez')) || 1;
        const bolum = Number(dugme.getAttribute('data-del-bol')) || 1;
        try { removeWatchHistoryItem(id, sezon, bolum); } catch (_) {}
        const kart = dugme.closest('.kd-card');
        const rail = kart?.closest('.kd-rail');
        kart?.remove();
        if (rail && !rail.querySelector('.kd-card')) rail.remove();
        showToast('Listeden kaldırıldı.', 'info');
      }

      root.addEventListener('click', (e) => {
        const sil = e.target.closest('.kd-card-del');
        if (sil) { e.preventDefault(); e.stopPropagation(); devamKaydiSil(sil); return; }
        const action = e.target.closest('[data-card-action]');
        if (action) {
          e.preventDefault();
          e.stopPropagation();
          const kart = action.closest('.kd-card');
          if (action.dataset.cardAction === 'detail') {
            const slug = kart?.getAttribute('data-slug');
            if (slug) window.location.hash = `#dramas?slug=${encodeURIComponent(slug)}`;
          } else if (action.dataset.cardAction === 'watch') {
            karttanBolumOynat(kart, action);
          }
          return;
        }
        const kart = e.target.closest('.kd-card');
        if (kart) { kartaTikla(kart); return; }
      });
      root.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const kart = e.target.closest?.('.kd-card');
        if (!kart || e.target !== kart) return;
        e.preventDefault();
        kartaTikla(kart);
      });

      /* Vitrin düğmeleri: doğrudan 1. bölümü oynatır (Netflix gibi). */
      bbPlay?.addEventListener('click', async (e) => {
        if (!vitrinDizisi) return;
        const detay = await detayGetir(vitrinDizisi.slug);
        if (!detay) { showToast('Bölüm bilgisi alınamadı.', 'error'); return; }
        bolumOynat(detay, 1, 1, e.currentTarget);
      });
      bbInfo?.addEventListener('click', () => {
        if (vitrinDizisi?.slug) {
          window.location.hash = `#dramas?slug=${encodeURIComponent(vitrinDizisi.slug)}`;
        }
      });

      /* TEMİZLİK — route değişimini detay isteği sürerken de yakala. */
      const acilisHash = window.location.hash;
      const rotaDinleyici = () => {
        if (window.location.hash === acilisHash) return;
        gozlemci.disconnect();
        onYukleveye.forEach(clearTimeout);
        window.removeEventListener('resize', navResize);
        window.removeEventListener('hashchange', rotaDinleyici);
        perdeKapat();
      };
      window.addEventListener('hashchange', rotaDinleyici);

      /* ── AÇILIŞ ───────────────────────────────────────────────────────── */
      if (initialSlug) {
        await detaySayfasiGoster(initialSlug, initialPlayback?.play ? initialPlayback : null);
      } else {
        renderIcons(root);
        if (aramaDizisi) {
          segSec('arama');
          ızgaraYeniden(`“${aramaDizisi}”`);
        } else {
          modaGec('vitrin');
        }

        /* Vitrin kahramanı: trend havuzu gelir gelmez vitrin doldurulur. */
        trendHavuzu().then((liste) => {
          if (vitrinDizisi || !liste.length) return;
          vitrinSec(liste.find(d => d?.poster) || liste[0]);
        });
      }
    }
  };
}
