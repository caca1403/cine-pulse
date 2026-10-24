/* ==========================================================================
   CinePulse Studio - Masaüstü kart hover fragman önizleme yöneticisi.
   - Tek document-level mouseover/mouseout delegasyonu: bütün raflardaki
     kartlar tek noktadan yönetilir (kart başına ayrı dinleyici yok).
   - 900 ms bekleme eşiği; fare başka karta geçince önceki önizleme durur
     (tek aktif kuralı).
   - Kart dışına çıkış / scroll / resize / ESC ile iptal; kart ile
     önizleme arasında fare geçişinde 300 ms tolerans.
   - Fragman üzerine gelindikte lazily çekilir: 60 sn bellek önbelleği,
     aynı anda en fazla tek ağ isteği (modül kuyruğu), ağ hatası sessiz.
   - Kaynak YouTube embed ise sessiz açılır (muted, playsinline, autoplay).
   ========================================================================== */

import { renderIcons } from '../kabuk/icons.js';

const GECEMIRE_MS = 900;
const CACHE_TTL_MS = 60 * 1000;
const AYRILMA_MS = 300;
const KART_SECICI = '.media-card';

let simdi = Date.now;
let zamanla = globalThis.setTimeout;
let zamanIptal = globalThis.clearTimeout;

let getVideoUrl = null;
let bagli = false;
let dinleyiciAdedi = 0;

let aktif = null;   // { kart, el, cap }
let bekle = null;   // { kart, timer }
let sonKart = null; // fare üstünde duran son kart

const onbellek = new Map(); // cacheKey -> { deger, ts }
const kuyruk = new Map();   // cacheKey -> promise (aynı anda tek istek)

function dokuman() {
  return typeof document !== 'undefined' ? document : null;
}

export function temizle() {
  if (bekle) { zamanIptal(bekle.timer); bekle = null; }
  kapat();
  sonKart = null;
  onbellek.clear();
  kuyruk.clear();
  getVideoUrl = null;
  simdi = Date.now;
  zamanla = globalThis.setTimeout;
  zamanIptal = globalThis.clearTimeout;
  const D = dokuman();
  if (bagli && D) {
    D.removeEventListener('mouseover', fareUstu);
    D.removeEventListener('mouseout', fareDisi);
    D.removeEventListener('scroll', kapat);
    D.removeEventListener('resize', kapat);
    D.removeEventListener('keydown', klavye);
    bagli = false;
    dinleyiciAdedi = 0;
  }
}

export function dinleyiciSayisi() { return dinleyiciAdedi; }

function kapat() {
  if (aktif && aktif.cap) { zamanIptal(aktif.cap); aktif.cap = null; }
  if (aktif) {
    try { aktif.el.remove(); } catch (_) {}
    if (aktif.kart.classList) aktif.kart.classList.remove('preview-active');
    aktif = null;
  }
}

/* Kartenin üzerinden fare geçtiğinde 900 ms sonra önizlemeyi hazırlar. */
function fareUstu(e) {
  if (!getVideoUrl) return;
  const D = dokuman();
  const kart = e.target?.closest?.(KART_SECICI);
  if (!kart || !kart.isConnected) return;
  if (bekle && bekle.kart === kart) return;
  sonKart = kart;
  if (bekle) { zamanIptal(bekle.timer); bekle = null; }
  if (aktif && aktif.kart !== kart) kapat(); // başka karta geçiş: önceki önizleme durur
  const baslangic = simdi();
  const calistir = () => {
    const gecikme = GECEMIRE_MS - (simdi() - baslangic);
    if (gecikme > 0) { bekle.timer = zamanla(calistir, gecikme); return; }
    bekle = null;
    goster(kart);
  };
  bekle = { kart, timer: zamanla(calistir, GECEMIRE_MS) };
}

/* Kartı bırakınca zamanlayıcıyı iptal eder; açık önizlemeyi 300 ms sonra
   kapatır (fare önizlemeye doğru gelse tolerans verilir). */
function fareDisi(e) {
  if (!sonKart) return;
  if (e.relatedTarget && sonKart.contains(e.relatedTarget)) return; // kart içi gezinme
  if (bekle && bekle.kart === sonKart) { zamanIptal(bekle.timer); bekle = null; }
  if (aktif && aktif.kart === sonKart && !(aktif.el && aktif.el.contains(e.relatedTarget))) {
    aktif.cap = zamanla(() => { aktif.cap = null; kapat(); }, AYRILMA_MS);
  }
}

async function fragmaniAl(kart, tip, id) {
  const cacheKey = `${tip}:${id}`;
  const simdik = simdi();
  const mevcut = onbellek.get(cacheKey);
  if (mevcut && mevcut.ts + CACHE_TTL_MS > simdik) return mevcut.deger;
  if (!kuyruk.has(cacheKey)) {
    const istek = (async () => {
      try { return await getVideoUrl(kart); } catch (_) { return null; }
    })().then((sonuc) => {
      kuyruk.delete(cacheKey);
      if (sonuc) onbellek.set(cacheKey, { deger: sonuc, ts: simdi() });
      return sonuc;
    });
    kuyruk.set(cacheKey, istek);
  }
  return kuyruk.get(cacheKey);
}

async function goster(kart) {
  if (!getVideoUrl || !kart || !kart.isConnected || sonKart !== kart) return;
  kapat(); // tek aktif kuralı: öncekini önce kapat

  const id = kart.getAttribute('data-tmdb-id') || kart.getAttribute('data-id');
  const tip = kart.getAttribute('data-type') === 'tv' ? 'tv' : 'movie';
  if (!/^\d+$/.test(String(id))) return;

  let video;
  try {
    video = await fragmaniAl(kart, tip, id);
  } catch (_) {
    return; // ağ hatası sessiz: kart aynen kalır
  }
  if (!video || !video.embedUrl || sonKart !== kart || !kart.isConnected) return;

  const D = dokuman();
  const el = D.createElement('div');
  el.className = 'card-hover-video-preview';
  el.innerHTML = `
    <div class="card-preview-media">
      <span class="card-preview-badge">FRAGMAN</span>
      <button type="button" class="card-preview-close-btn" aria-label="Önizlemeyi kapat"><i data-lucide="x"></i></button>
      <div class="card-preview-cinematic-shade"></div>
    </div>
    <div class="card-preview-details">
      <div class="card-preview-copy">
        <div class="card-preview-title"></div>
        <div class="card-preview-meta">${tip === 'tv' ? 'Dizi' : 'Film'}</div>
      </div>
      <div class="card-preview-actions">
        <a class="card-preview-detail" href="#detail?type=${tip}&id=${id}"><i data-lucide="info"></i><span>Detay</span></a>
      </div>
    </div>`;
  el.querySelector('.card-preview-title').textContent = video.name || 'Fragman';

  const iframe = D.createElement('iframe');
  const ayrac = video.embedUrl.includes('?') ? '&' : '?';
  iframe.setAttribute('src', `${video.embedUrl}${ayrac}mute=1&playsinline=1`);
  iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.setAttribute('aria-hidden', 'true');
  iframe.tabIndex = -1;
  el.querySelector('.card-preview-media').prepend(iframe);

  const pencere = (D.defaultView && D.defaultView.innerWidth) ? D.defaultView : (typeof window !== 'undefined' ? window : null);
  const genislik = (pencere && pencere.innerWidth) || 1024;
  const yukseklik = (pencere && pencere.innerHeight) || 768;

  const yerlestir = () => {
    if (!kart.isConnected) { kapat(); return; }
    const r = kart.getBoundingClientRect();
    const w = el.offsetWidth || 600;
    const h = el.offsetHeight || 240;
    let left = r.right + 12;
    if (left + w > genislik - 8) left = r.left - w - 12;
    if (left < 8) left = Math.max(8, Math.min(r.left, genislik - w - 8));
    let top = Math.round(r.top + r.height / 2 - h / 2);
    top = Math.max(8, Math.min(top, yukseklik - h - 8));
    el.style.left = `${Math.round(left)}px`;
    el.style.top = `${Math.round(top)}px`;
  };
  yerlestir();
  requestAnimationFrame(yerlestir);

  el.addEventListener('pointerenter', () => { if (aktif && aktif.cap) { zamanIptal(aktif.cap); aktif.cap = null; } });
  el.addEventListener('pointerleave', () => {
    if (aktif && aktif.kart === sonKart) {
      aktif.cap = zamanla(() => { aktif.cap = null; kapat(); }, AYRILMA_MS);
    }
  });
  el.querySelector('.card-preview-close-btn')?.addEventListener('click', kapat);

  renderIcons(el);
  D.body.appendChild(el);
  aktif = { el, kart, cap: null };
  kart.classList.add('preview-active');
}

function klavye(e) { if (e.key === 'Escape') kapat(); }

export function kur(getVideoUrlFn, { simdi: enjekte, setTimeout: st, clearTimeout: ct } = {}) {
  if (bagli) return;
  const D = dokuman();
  if (!D) return;
  if (enjekte) simdi = enjekte;
  if (st) zamanla = st;
  if (ct) zamanIptal = ct;
  getVideoUrl = getVideoUrlFn;

  D.addEventListener('mouseover', fareUstu);
  D.addEventListener('mouseout', fareDisi);
  D.addEventListener('scroll', kapat, { passive: true });
  D.addEventListener('resize', kapat, { passive: true });
  D.addEventListener('keydown', klavye);
  bagli = true;
  dinleyiciAdedi = 5;
}
