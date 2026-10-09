/* ==========================================================================
   CinePulse Studio - Tanitim (Showcase) View
   Ilk acilista uygulamanin tanitimi: adimlar, korumalar, indirme.
   ========================================================================== */

import { renderIcons } from '../services/icons.js';

const SEEN_KEY = 'cp_showcase_seen_v1';

export function hasSeenShowcase() {
  try {
    return localStorage.getItem(SEEN_KEY) === '1';
  } catch (_) {
    return true;
  }
}

export function markShowcaseSeen() {
  try {
    localStorage.setItem(SEEN_KEY, '1');
  } catch (_) {}
}

const card = 'background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.09);border-radius:16px;padding:1.25rem;';
const h2 = 'color:#fff;font-size:1.25rem;font-weight:800;margin:0 0 .35rem;';
const sub = 'color:#94a3b8;font-size:.88rem;margin:0;';
const badge = 'display:inline-flex;align-items:center;gap:.35rem;padding:.32rem .75rem;border-radius:999px;font-size:.75rem;font-weight:700;';

export function renderShowcaseView() {
  const steps = [
    { icon: 'search', color: '#38bdf8', title: '1. Bul', text: 'Film, dizi, anime veya canlı TV — arat, listelerden seç.' },
    { icon: 'layers', color: '#a855f7', title: '2. Kaynağı seç', text: 'Birden fazla hat listelenir; tutmayan olursa sıradakine geçilir.' },
    { icon: 'play', color: '#10b981', title: '3. Kaldığın yerden izle', text: 'Pozisyonun saklanır; dublaj, altyazı ve hız senin kontrolünde.' }
  ];

  const protections = [
    { icon: 'shield-check', color: '#10b981', title: 'Reklamsız iç oynatıcı', text: 'Yayınlar uygulamanın kendi oynatıcısında açılır; dış siteye savrulmazsın.' },
    { icon: 'captions', color: '#38bdf8', title: 'Türkçe dublaj + altyazı', text: 'Hatlar dublaj ve altyazılı ayrılır; altyazı otomatik eşlenir.' },
    { icon: 'history', color: '#dfff76', title: 'Kaldığın yerden devam', text: 'Filmde saniyesi saniyesine, dizide bölüm bölüm takip.' },
    { icon: 'baby', color: '#ec4899', title: 'Çocuk profili', text: 'Çocuklar için ayrı güvenli alan; yetişkin içerik görünmez.' },
    { icon: 'satellite-dish', color: '#ef4444', title: 'Canlı TV + yayın akışı', text: 'Ulusal, haber, spor ve daha fazlası; o anki program bilgisiyle.' },
    { icon: 'users', color: '#a855f7', title: 'Birlikte izleme', text: 'Aynı odayla senkron izle, sohbet et.' }
  ];

  const html = `
    <div class="showcase-view" style="max-width:1060px;margin:0 auto;padding:3rem 1rem 4rem;width:100%;box-sizing:border-box;">
      <!-- HERO -->
      <section style="text-align:center;padding:3rem 1rem 2.5rem;">
        <div style="display:inline-flex;align-items:center;justify-content:center;width:68px;height:68px;border-radius:20px;background:linear-gradient(135deg,#dfff76,#ef4444);margin-bottom:1.1rem;">
          <i data-lucide="clapperboard" style="width:32px;height:32px;color:#fff;"></i>
        </div>
        <h1 style="color:#fff;font-size:2.1rem;font-weight:900;margin:0 0 .5rem;">Cine<span style="color:#dfff76;">Pulse</span></h1>
        <p style="color:#cbd5e1;font-size:1.02rem;max-width:560px;margin:0 auto 1.4rem;">
          Film, dizi, anime ve canlı TV tek çatıda. Ara, kaynağını seç, kaldığın yerden izle.
        </p>
        <div style="display:flex;gap:.7rem;justify-content:center;flex-wrap:wrap;margin-bottom:1.4rem;">
          <a href="#home" id="showcase-start-btn" style="display:inline-flex;align-items:center;gap:.5rem;background:#dfff76;color:#000;font-weight:800;padding:.8rem 1.6rem;border-radius:12px;text-decoration:none;font-size:.95rem;">
            <i data-lucide="play" style="width:17px;height:17px;"></i> Hemen Başla
          </a>
          <a href="/api/download_apk" style="display:inline-flex;align-items:center;gap:.5rem;background:rgba(255,255,255,.07);color:#fff;font-weight:700;padding:.8rem 1.6rem;border-radius:12px;text-decoration:none;border:1px solid rgba(255,255,255,.14);font-size:.95rem;">
            <i data-lucide="smartphone" style="width:17px;height:17px;"></i> Android APK İndir
          </a>
          <a href="https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse-setup.exe" style="display:inline-flex;align-items:center;gap:.5rem;background:rgba(255,255,255,.07);color:#fff;font-weight:700;padding:.8rem 1.6rem;border-radius:12px;text-decoration:none;border:1px solid rgba(255,255,255,.14);font-size:.95rem;">
            <i data-lucide="monitor" style="width:17px;height:17px;"></i> PC EXE İndir
          </a>
        </div>
        <div style="display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap;">
          <span style="${badge}background:rgba(16,185,129,.14);color:#10b981;">Reklamsız oynatıcı</span>
          <span style="${badge}background:rgba(56,189,248,.14);color:#38bdf8;">TR Dublaj + Altyazı</span>
          <span style="${badge}background:rgba(239,68,68,.14);color:#ef4444;">150+ Canlı Kanal</span>
        </div>
      </section>

      <!-- STEPS -->
      <section style="margin-bottom:2rem;">
        <h2 style="${h2}text-align:center;">3 adımda izle</h2>
        <p style="${sub}text-align:center;margin-bottom:1.2rem;">Kayıt yok, kurulum yok.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;">
          ${steps.map((s) => `
            <div style="${card}text-align:center;">
              <div style="display:inline-flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:14px;background:${s.color}22;color:${s.color};margin-bottom:.7rem;">
                <i data-lucide="${s.icon}" style="width:22px;height:22px;"></i>
              </div>
              <div style="color:#fff;font-weight:800;margin-bottom:.3rem;">${s.title}</div>
              <div style="color:#94a3b8;font-size:.85rem;">${s.text}</div>
            </div>`).join('')}
        </div>
      </section>

      <!-- PROTECTIONS -->
      <section style="margin-bottom:2rem;">
        <h2 style="${h2}text-align:center;">Korumaların</h2>
        <p style="${sub}text-align:center;margin-bottom:1.2rem;">Seni yarı yolda bırakmayacak düzen.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;">
          ${protections.map((p) => `
            <div style="${card}display:flex;gap:.8rem;align-items:flex-start;">
              <div style="flex:none;display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:12px;background:${p.color}22;color:${p.color};">
                <i data-lucide="${p.icon}" style="width:20px;height:20px;"></i>
              </div>
              <div>
                <div style="color:#fff;font-weight:700;font-size:.92rem;margin-bottom:.2rem;">${p.title}</div>
                <div style="color:#94a3b8;font-size:.82rem;">${p.text}</div>
              </div>
            </div>`).join('')}
        </div>
      </section>

      <!-- CTA -->
      <section style="text-align:center;${card}">
        <h2 style="${h2}">Hazırsan başlayalım</h2>
        <p style="${sub}margin-bottom:1.1rem;">Pozisyonun bu cihazda saklanır; istediğin zaman devam edersin.</p>
        <a href="#home" id="showcase-start-btn-2" style="display:inline-flex;align-items:center;gap:.5rem;background:#dfff76;color:#000;font-weight:800;padding:.8rem 2rem;border-radius:12px;text-decoration:none;">
          <i data-lucide="arrow-right" style="width:17px;height:17px;"></i> İçeriklere Git
        </a>
      </section>
    </div>
  `;

  return {
    html,
    init: (container) => {
      const mark = () => markShowcaseSeen();
      container.querySelector('#showcase-start-btn')?.addEventListener('click', mark);
      container.querySelector('#showcase-start-btn-2')?.addEventListener('click', mark);
      // Web'den canli TV'ye tiklanip buraya dusulduyse bilgi goster
      try {
        if (sessionStorage.getItem('cp_livetv_web_block') === '1') {
          sessionStorage.removeItem('cp_livetv_web_block');
          const hero = container.querySelector('.showcase-view section');
          if (hero) {
            const note = document.createElement('div');
            note.style.cssText = 'max-width:560px;margin:0 auto 1.2rem;padding:.8rem 1rem;border-radius:12px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.35);color:#fca5a5;font-size:.85rem;text-align:center;';
            note.textContent = 'Canlı TV web sürümünde kapalıdır — kesintisiz yayın için Android APK veya PC EXE kullanın.';
            hero.prepend(note);
          }
        }
      } catch (_) {}
      renderIcons(container);
    }
  };
}
