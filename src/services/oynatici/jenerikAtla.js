/* ==========================================================================
   CinePulse — Jenerik/absik atlama (yol haritası #1, Nuvio/CS paritesi)
   --------------------------------------------------------------------------
   Kaynak: api.aniskip.com (Cloudstream AnimeSkip'ın kullandığı servis).
   Zincir: TMDB external_ids → anidb_id → skip-times/anidb/{id}/{ep}.
   Yalnız dizi bölümlerinde çalışır; anidb kaydı olmayan başlıkta sessizce
   boş döner (tek TMDB çağrısı önbelleğe alınır, tekrarlanmaz).
   AniDB bölüm numaraları MUTLAK sayılabildiği için TMDB sezon episode_count
   toplamlarıyla mutlak numara tahmin edilir; bulunamazsa sezon-içi denenir.
   ========================================================================== */

import { tmdbHariciIdleriGetir } from '../icerik/tmdbApi.js';

const ANISKIP = 'https://api.aniskip.com/v2/skip-times';
const ONEV_GUN = 7;

const lsGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch { /* sessiz */ } };

function onbellekOku(anahtar) {
  try {
    const ham = JSON.parse(lsGet(anahtar) || 'null');
    if (!ham || typeof ham.t !== 'number') return null;
    if (Date.now() - ham.t > ONEV_GUN * 864e5) return null;
    return Array.isArray(ham.a) ? ham.a : null;
  } catch { return null; }
}

/** TMDB → AniDB id (0 = yok, negatif sonuç da önbelleğe alınır). */
async function anidbIdBul(tmdbId) {
  const ck = `cp-jenerik-anidb:${tmdbId}`;
  const cached = lsGet(ck);
  if (cached !== null) return Number(cached) || 0;
  let id = 0;
  try {
    const ext = await tmdbHariciIdleriGetir('tv', tmdbId);
    id = Number(ext && ext.anidb_id) || 0;
  } catch { /* TMDB erişilemez: önbelleğe yazmadan dön (bir dahaki denesin) */ return 0; }
  lsSet(ck, String(id));
  return id;
}

/** TMDB sezon listesi varsa mutlak bölüm numarasını üretir (AniDB sıralaması). */
export function mutlakBolum(sezonlarListesi, sezon, bolum) {
  try {
    const sezonlar = (sezonlarListesi || [])
      .map(s => ({ n: Number(s.season_number), adet: Number(s.episode_count) || 0 }))
      .filter(s => s.n >= 1 && s.adet > 0)
      .sort((a, b) => a.n - b.n);
    if (!sezonlar.length) return 0;
    let toplam = 0;
    for (const s of sezonlar) {
      if (s.n >= sezon) return toplam + bolum;
      toplam += s.adet;
    }
    return toplam + bolum;
  } catch { return 0; }
}

async function araliklariIste(anidbId, bolumNo) {
  const url = `${ANISKIP}/anidb/${anidbId}/${bolumNo}?episodeLength=0&types=op&types=ed`;
  const r = await fetch(url, { signal: AbortSignal.timeout(6000) });
  if (!r.ok) return [];
  const j = await r.json().catch(() => null);
  const sonuc = [];
  for (const tip of ['op', 'ed']) {
    const best = (j?.results || [])
      .filter(x => x?.skipType === tip && x?.interval)
      .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))[0];
    if (best) {
      sonuc.push({
        tip,
        bas: Number(best.interval.startTime) || 0,
        bit: Number(best.interval.endTime) || 0,
        atla: Number(best.interval.skipTime) || Number(best.interval.endTime) || 0
      });
    }
  }
  return sonuc;
}

/**
 * Bölümün jenerik/absik aralıkları: [{tip:'op'|'ed', bas, bit, atla}] (sn).
 * Hata/yokluk → [] (asla atma).
 */
export async function jenerikAraliklariBul({ tmdbId, sezon = 1, bolum = 1, sezonlarListesi = [] } = {}) {
  if (!tmdbId) return [];
  const anidbId = await anidbIdBul(tmdbId);
  if (!anidbId) return [];
  const mutlak = mutlakBolum(sezonlarListesi, sezon, bolum);
  const ck = `cp-jenerik-v1:${anidbId}:${mutlak || `${sezon}x${bolum}`}`;
  const cached = onbellekOku(ck);
  if (cached) return cached;
  let araliklar = await araliklariIste(anidbId, mutlak || bolum).catch(() => []);
  // Mutlak tahmin yanlışsa (result 0) sezon-içi numarayı dene.
  if (!araliklar.length && mutlak && mutlak !== bolum) {
    araliklar = await araliklariIste(anidbId, bolum).catch(() => []);
  }
  lsSet(ck, JSON.stringify({ t: Date.now(), a: araliklar }));
  return araliklar;
}

/* ---------- Oynatıcı bağlama: timeupdate'te "Jeneriği atla" düğmesi -------
   Bulunulan aralıkta düğme gösterilir; tıklayınca ileri sarılır ve o aralık
   bölüm süresince bir daha gösterilmez. otomatik-atlama BİLİNÇLİ yok —
   kullanıcı onayı olmadan konum değiştirmek (resume/bildirim etkileşimi)
   istenmeyen sonuçlar doğurabiliyordu. */

const durumlar = new WeakMap(); // videoEl -> durum

function dugmeYarat(videoEl) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = '⏭ Jeneriği atla';
  b.setAttribute('aria-label', 'Jeneriği atla');
  b.style.cssText = [
    'position:absolute', 'right:12px', 'bottom:88px', 'z-index:60',
    'background:rgba(15,23,42,0.88)', 'color:#fff', 'border:1px solid rgba(226,232,240,0.35)',
    'border-radius:10px', 'padding:0.5rem 0.9rem', 'font-size:0.8rem', 'font-weight:700',
    'cursor:pointer', 'backdrop-filter:blur(6px)', 'display:none'
  ].join(';');
  b.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const d = durumlar.get(videoEl);
    const aralik = d?.aktifAralik;
    if (!aralik) return;
    try { videoEl.currentTime = Math.min(aralik.atla + 0.75, (videoEl.duration || aralik.atla) - 0.5); } catch { /* hazır değil */ }
    d.atlanan.add(aralik.tip);
    gizle(d);
  };
  (videoEl.parentElement || document.body).appendChild(b);
  return b;
}

function gizle(d) {
  if (d?.dugme && d.dugme.style.display !== 'none') d.dugme.style.display = 'none';
  if (d) d.aktifAralik = null;
}

function timeupdate(videoEl) {
  const d = durumlar.get(videoEl);
  if (!d || !d.araliklar || d.uygulananAnahtar !== d.anahtar) return;
  const t = videoEl.currentTime;
  const aralik = d.araliklar.find(a => !d.atlanan.has(a.tip) && t >= a.bas + 0.4 && t < Math.min(a.bit, (videoEl.duration || Infinity) - 2));
  if (!aralik) { gizle(d); return; }
  if (!d.dugme) d.dugme = dugmeYarat(videoEl);
  d.dugme.textContent = aralik.tip === 'op' ? '⏭ Jeneriği atla' : '⏭ Absği geç';
  if (d.dugme.style.display === 'none') d.dugme.style.display = 'inline-flex';
  d.aktifAralik = aralik;
}

/**
 * Oynatma her (re)kurulduğunda çağrılır. Aynı bölüm + aynı elementse no-op;
 * değiştiyse aralık yüklemesi yeniden başlar. tur !== 'tv' → pasif.
 */
export function jenerikDurumKur(videoEl, { tur, tmdbId, sezon = 1, bolum = 1, sezonlarListesi = [] } = {}) {
  if (!videoEl) return;
  let d = durumlar.get(videoEl);
  if (!d) {
    d = { anahtar: '', uygulananAnahtar: '', araliklar: null, atlanan: new Set(), dugme: null, aktifAralik: null };
    durumlar.set(videoEl, d);
    videoEl.addEventListener('timeupdate', () => timeupdate(videoEl));
  }
  const anahtar = `${tmdbId || 0}|${sezon}x${bolum}`;
  if (d.anahtar === anahtar && (d.araliklar || d.yukleniyor)) return;
  d.anahtar = anahtar;
  d.araliklar = null;
  d.atlanan = new Set();
  gizle(d);
  if (d.dugme && d.dugme.parentElement) d.dugme.remove(), d.dugme = null;
  if (tur !== 'tv' || !tmdbId) { d.yukleniyor = false; return; }
  d.yukleniyor = true;
  jenerikAraliklariBul({ tmdbId, sezon, bolum, sezonlarListesi })
    .then(a => {
      d.yukleniyor = false;
      if (durumlar.get(videoEl) === d && d.anahtar === anahtar) {
        d.araliklar = a;
        d.uygulananAnahtar = anahtar;
      }
    })
    .catch(() => { d.yukleniyor = false; d.araliklar = []; });
}
