/* ==========================================================================
   DEVTEST-YALNIZ "Kaynak tanılama" bölümü — Eklentiler penceresinin altında.
   PluginsModal'daki main.js ile AYNI kapıdan geçen dinamik import ile yüklenir
   (VITE_DEVICE_SWEEP=1); üretim derlemesinde bu dosya pakete hiç girmez, bu
   yüzden başlık/buton metni de public çıktıda bulunmaz.

   ÇIKTI ANONİMDİR: satır etiketleri pluginCatalog ALIASES ve sourceLabels
   aile adlarından üretilir (getPluginDisplay / getAnonymousSourceLabel).
   `__cpSweep` ve `__cpSag` id'leri, gerçek site adları ve adresleri ekrana da
   panoya kopyalanan JSON'a da çıkmaz — amaç adb olmadan cihazdan log almak.
   ========================================================================== */
import { renderIcons } from '../services/icons.js';
import { getAnonymousSourceLabel } from '../services/sourceLabels.js';
import { getPluginDisplay } from '../services/pluginCatalog.js';
import { showToast } from '../components/Toast.js';

/** Toplam bütçe: bu süre dolunca koşum iptal edilir, kısmi tablo gösterilir. */
const SURE_LIMI_MS = 35000;

/** Sabit örnek içerikler: film + iki dizi durumu, kullanıcı verisi harcamaz. */
const ORNEKLER = [
  { type: 'movie', title: 'Interstellar', originalTitle: 'Interstellar' },
  { type: 'tv', title: 'Breaking Bad', season: 2, episode: 5 },
  { type: 'tv', title: 'Stranger Things', season: 1, episode: 3 }
];

let aktif = null;     // açık bölüm ({ bolme }) — arama yüzünden yenilenince yenilenir
let sonRapor = null;  // son/DEVAM eden koşumun anonim raporu
let calisan = null;   // { iptal: AbortController, ilerleme: string } | null

const PANEL_CSS = `
.cp-diag{margin-top:.9rem;padding:.85rem .9rem;border-radius:14px;border:1px dashed rgba(223,255,118,.35);background:rgba(223,255,118,.05);}
.cp-diag h3{margin:0 0 .15rem;font-size:.9rem;color:#dfff76;display:flex;align-items:center;gap:.4rem;}
.cp-diag p.cp-diag-not{margin:0 0 .6rem;font-size:.72rem;color:#94a3b8;}
.cp-diag-ac{display:flex;gap:.5rem;flex-wrap:wrap;align-items:center;}
.cp-diag-btn{display:inline-flex;align-items:center;gap:.4rem;border:1px solid rgba(223,255,118,.5);background:rgba(223,255,118,.14);color:#dfff76;border-radius:10px;padding:.45rem .8rem;font-size:.78rem;font-weight:700;cursor:pointer;}
.cp-diag-btn:disabled{opacity:.55;cursor:default;}
.cp-diag-btn-ghost{background:transparent;border-color:rgba(255,255,255,.18);color:#b6c2d8;}
.cp-diag-ozet{margin:.6rem 0 0;font-size:.74rem;color:#b6c2d8;}
.cp-diag-masalar{display:flex;flex-direction:column;gap:.7rem;margin-top:.6rem;}
.cp-diag-baslik{font-size:.74rem;font-weight:700;color:#eef2ff;margin-bottom:.25rem;}
.cp-diag-tablo{width:100%;border-collapse:collapse;font-size:.72rem;}
.cp-diag-tablo th{text-align:left;font-weight:700;color:#94a3b8;padding:.15rem .35rem;border-bottom:1px solid rgba(255,255,255,.12);}
.cp-diag-tablo td{padding:.18rem .35rem;border-bottom:1px solid rgba(255,255,255,.05);color:#dbe4f3;}
.cp-diag-tablo td.ok{color:#86efac;}
.cp-diag-tablo td.bad{color:#fca5a5;}
.cp-diag-tablo td.sayi{text-align:right;font-variant-numeric:tabular-nums;}
.cp-diag-sag{font-size:.72rem;color:#94a3b8;padding:.5rem 0;}
.cp-diag-donme{display:inline-block;animation:spin .8s linear infinite;}
`;

function ensureCss() {
  try {
    if (document.getElementById('cp-diag-css')) return;
    const st = document.createElement('style');
    st.id = 'cp-diag-css';
    st.textContent = PANEL_CSS;
    document.head.appendChild(st);
  } catch (_) {}
}

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

/** sourceLabels'taki harf dizisiyle aynı kural: A, B, C… (YZ) */
function harf(index) {
  let out = '';
  for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) out = String.fromCharCode(65 + (n - 1) % 26) + out;
  return out;
}

/**
 * Satır etiketi = yıldıız kod adı. Ham sağlayıcı id'si ASLA basılmaz:
 * 1) eklenti kataloğunun ALIASES karşılığı (aynı pencerenin üst listesiyle
 *    birebir aynı ad), 2) katalogda olmayan id'ler sourceLabels ailesinden
 *    (getAnonymousSourceLabel), 3) tanımsızsa tarafsız yutucu ('Nexus').
 */
function yildizKod(saglayiciId, kullanilan) {
  const id = String(saglayiciId || '');
  let etiket = '';
  try { etiket = getPluginDisplay({ id }).alias || ''; } catch (_) {}
  if (!etiket || etiket === 'Nexus') {
    try {
      // getAnonymousSourceLabel aile önekinden okur; tek kardeşle harf almaz.
      const kaynak = { id: `${id}_` };
      etiket = String(getAnonymousSourceLabel(kaynak, [kaynak]) || '').split('·')[0].trim();
    } catch (_) {}
  }
  if (!etiket) etiket = 'Nexus';
  let sira = 1;
  let cikti = etiket;
  while (kullanilan.includes(cikti)) { sira += 1; cikti = `${etiket} ${harf(sira - 1)}`; }
  kullanilan.push(cikti);
  return cikti;
}

/** Hata metnini sınıfa indirger; site adı/adres içerebilecek ham metin gösterilmez. */
function hataSinifi(hata) {
  const s = String(hata || '').toLowerCase();
  if (!s) return '';
  if (s.includes('timeout')) return 'zaman aşımı';
  if (s.includes('abort')) return 'iptal';
  if (s.includes('403') || s.includes('forbidden') || s.includes('cloudflare') || s.includes('challenge')) return 'engellendi';
  if (s.includes('404')) return 'bulunamadı';
  if (s.includes('fetch') || s.includes('network') || s.includes('networkerror') || s.includes('dns')) return 'ağ';
  if (s.includes('parse') || s.includes('json') || s.includes('html')) return 'çözümlenemedi';
  return 'hata';
}

/** JSON'daki serbest metin: adres/domain silinir, kısa tutulur (anonim log). */
function kirmiziKalem(metin) {
  return String(metin || '')
    .replace(/https?:\/\/\S+/gi, '[adres]')
    .replace(/[a-z0-9][a-z0-9-]*\.(?:com|net|org|io|xyz|to|tv|me|app|site|online|club|one|life|plus|pro|cc|ru)\b/gi, '[site]')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 70);
}

const turEtiketi = (t) => (t === 'movie' ? 'film' : 'dizi');

/** __cpSweep kaydını anonim tablo satırlarına çevirir (id/adres sızmaz). */
function anonImle(kayit, kullanilan) {
  const satirlar = (kayit?.ozet || []).map((r) => {
    const adet = Number(r?.n) || 0;
    const hata = r?.hata || null;
    return {
      kod: yildizKod(r?.id, kullanilan),
      kaynak: adet,
      ms: Number.isFinite(Number(r?.ms)) ? Number(r.ms) : null,
      ok: !hata && adet > 0,
      tur: String(r?.kat || '').slice(0, 24),
      not: hata ? kirmiziKalem(hata) : ''
    };
  });
  // Tek ekranda okunsun: çok kaynak üreten en üstte, eşitlikte hızlı olan.
  satirlar.sort((a, b) => (b.kaynak - a.kaynak) || ((a.ms ?? 1e9) - (b.ms ?? 1e9)));
  return {
    baslik: String(kayit?.baslik || ''),
    tur: turEtiketi(kayit?.tur),
    sezon: kayit?.sezon ?? null,
    bolum: kayit?.bolum ?? null,
    ms: Number(kayit?.gecen_ms) || 0,
    saglayici: satirlar.filter((s) => s.ok).length,
    kaynak: satirlar.reduce((a, s) => a + s.kaynak, 0),
    satirlar
  };
}

function tabloHtml(ornek) {
  const satirlar = ornek.satirlar.map((s) => `
    <tr>
      <td>${esc(s.kod)}${s.tur ? ` <span style="color:#64748b;">${esc(s.tur)}</span>` : ''}</td>
      <td class="sayi">${s.kaynak}</td>
      <td class="sayi">${s.ms === null ? '—' : s.ms}</td>
      <td class="${s.ok ? 'ok' : 'bad'}">${s.ok ? '✓' : '✗'}</td>
    </tr>`).join('');
  return `
    <div class="cp-diag-baslik">${esc(ornek.baslik)}${ornek.sezon ? ` · S${ornek.sezon}B${ornek.bolum}` : ''} · ${esc(ornek.tur)} — ${ornek.ms} ms, ${ornek.saglayici} kaynaklı hat, ${ornek.kaynak} kaynak</div>
    <table class="cp-diag-tablo">
      <thead><tr><th>Kod</th><th style="text-align:right;">Kaynak</th><th style="text-align:right;">ms</th><th>✓</th></tr></thead>
      <tbody>${satirlar || '<tr><td colspan="4" class="cp-diag-sag">Satır yok.</td></tr>'}</tbody>
    </table>`;
}

function ciz() {
  const bolme = aktif?.bolme;
  if (!bolme || !bolme.isConnected) return;
  const kosuyor = Boolean(calisan);
  const ilerleme = kosuyor ? calisan.ilerleme : '';
  const rapor = sonRapor;
  const ozet = rapor && rapor.ornekler.length
    ? `<p class="cp-diag-ozet">${rapor.ornekler.length}/${ORNEKLER.length} içerik · ${rapor.toplamMs} ms · ${rapor.durum === 'kismi' ? 'kısmi (süre doldu)' : 'tamam'}</p>`
    : '';
  const tablo = rapor && rapor.ornekler.length
    ? `<div class="cp-diag-masalar">${rapor.ornekler.map(tabloHtml).join('')}</div>`
    : (kosuyor ? '' : '<p class="cp-diag-sag">Henüz koşum yok.</p>');
  bolme.innerHTML = `
    <h3><i data-lucide="stethoscope" style="width:14px;height:14px;"></i> Kaynak tanılama (test derlemesi)</h3>
    <p class="cp-diag-not">Üç sabit örnek içerikle tüm açık eklentiler cihazın kendi ağında çözülür. Yalnız kod adları gösterilir; ✓ = en az bir kaynak yayımlandı, ✗ = boş/hata.</p>
    <div class="cp-diag-ac">
      <button type="button" class="cp-diag-btn" data-diag-run ${kosuyor ? 'disabled' : ''}>
        ${kosuyor
          ? '<i class="cp-diag-donme" data-lucide="loader" style="width:13px;height:13px;"></i> Taranıyor…'
          : '<i data-lucide="radar" style="width:13px;height:13px;"></i> Örnek içeriklerle tara'}
        ${kosuyor && ilerleme ? `<span>(${esc(ilerleme)})</span>` : ''}
      </button>
      <button type="button" class="cp-diag-btn cp-diag-btn-ghost" data-diag-json ${kosuyor || !rapor || !rapor.ornekler.length ? 'disabled' : ''}>
        <i data-lucide="copy" style="width:13px;height:13px;"></i> JSON kopyala
      </button>
    </div>
    ${ozet}${tablo}
  `;
  renderIcons(bolme);
  bolme.querySelector('[data-diag-run]')?.addEventListener('click', () => { kos(); });
  bolme.querySelector('[data-diag-json]')?.addEventListener('click', () => { jsonKopyala(); });
}

/** Raporu güncel duruma göre yeniden hesaplar (kısmi sonuçlar da buradan geçer). */
function raporla(ornekler, toplamMs, kismi) {
  sonRapor = {
    durum: kismi ? 'kismi' : 'tamam',
    baslangic: new Date().toISOString(),
    toplamMs,
    ornekler
  };
}

async function kos() {
  if (calisan) return;
  if (typeof window.__cpSweep !== 'function') {
    showToast('Ölçüm kancası bu derlemede yüklü değil (VITE_DEVICE_SWEEP=1 gerekir).', 'error');
    return;
  }
  const bas = Date.now();
  const iptal = new AbortController();
  calisan = { iptal, ilerleme: '' };
  const asami = setTimeout(() => { try { iptal.abort(); } catch (_) {} }, SURE_LIMI_MS);
  const ornekler = [];
  const kullanilan = [];
  let kismi = false;
  ciz();
  try {
    for (let i = 0; i < ORNEKLER.length; i += 1) {
      const kalan = SURE_LIMI_MS - (Date.now() - bas);
      if (iptal.signal.aborted || kalan <= 1500) { kismi = true; break; }
      calisan.ilerleme = `${ORNEKLER[i].title} ${i + 1}/${ORNEKLER.length}`;
      ciz();
      const kayit = await window.__cpSweep({
        ...ORNEKLER[i],
        esZamanli: true,
        signal: iptal.signal,
        sure: Math.max(3000, Math.min(20000, kalan - 1000))
      });
      ornekler.push(anonImle(kayit, kullanilan));
      if (kayit?.iptal) kismi = true;
      raporla(ornekler.slice(), Date.now() - bas, kismi);
      ciz();
    }
  } catch (e) {
    kismi = true;
    ornekler.push({ baslik: 'Koşum hatası', tur: '—', sezon: null, bolum: null, ms: Date.now() - bas, saglayici: 0, kaynak: 0, satirlar: [{ kod: 'Nexus', kaynak: 0, ms: null, ok: false, tur: '', not: kirmiziKalem(e?.message || e) }] });
  } finally {
    clearTimeout(asami);
    if (!kismi && Date.now() - bas >= SURE_LIMI_MS) kismi = true;
    raporla(ornekler, Date.now() - bas, kismi);
    calisan = null;
    ciz();
  }
}

/** Son tanılama çıktısını anonim JSON olarak panoya verir (adb'siz log). */
async function jsonKopyala() {
  const r = sonRapor;
  if (!r || !r.ornekler.length) { showToast('Kopyalanacak tanılama yok.', 'info'); return; }
  const veri = {
    rapor: 'kaynak-tanilama',
    tur: 'devtest',
    zaman: r.baslangic,
    durum: r.durum,
    toplamMs: r.toplamMs,
    ornekler: r.ornekler.map((o) => ({
      baslik: o.baslik,
      tur: o.tur,
      sezon: o.sezon,
      bolum: o.bolum,
      ms: o.ms,
      hatSayisi: o.saglayici,
      kaynakSayisi: o.kaynak,
      satirlar: o.satirlar.map((s) => ({
        kod: s.kod,
        kaynak: s.kaynak,
        ms: s.ms,
        ok: s.ok,
        tur: s.tur || undefined,
        not: s.not || undefined
      }))
    }))
  };
  const metin = JSON.stringify(veri, null, 2);
  let tamam = false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(metin);
      tamam = true;
    }
  } catch (_) {}
  if (!tamam) {
    // WebView / http bağlamı: clipboard API yoksa eski yol.
    try {
      const ta = document.createElement('textarea');
      ta.value = metin;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      tamam = document.execCommand('copy');
      ta.remove();
    } catch (_) {}
  }
  showToast(tamam ? 'Tanılama JSON olarak kopyalandı.' : 'Panoya kopyalanamadı (clipboard kapalı).', tamam ? 'success' : 'error');
}

/**
 * Eklentiler penceresinin listesinin altına bölümü asar. Pencere her
 * yenilendiğinde (arama vb.) yeniden çağrılır; devam eden koşum modül
 * durumunda tutulduğu için tablo kaybolmaz.
 * @param {HTMLElement} modalKok @param {AbortSignal} [sinyal] pencere kapanınca iptal
 */
export function baglantiKur(modalKok, sinyal) {
  const liste = modalKok?.querySelector?.('.plugins-modal-list');
  if (!liste) return;
  ensureCss();
  const bolme = document.createElement('div');
  bolme.className = 'cp-diag';
  liste.appendChild(bolme);
  aktif = { bolme };
  ciz();
  const birak = () => { try { calisan?.iptal?.abort(); } catch (_) {} };
  if (sinyal) {
    if (sinyal.aborted) birak();
    else sinyal.addEventListener('abort', birak, { once: true });
  }
}
