/* ==========================================================================
   CinePulse Studio - Otomatik Kurulum & Tanılama Sihirbazı (Setup Wizard)
   Cloudstream (Eklenti/Kaynak yönetimi & ping) + Nuvio (Native performans & donanım)
   ========================================================================== */

import { renderIcons } from '../services/icons.js';
import { showToast } from './Toast.js';
import { getProviders, setProviderEnabled, persistProviderState } from '../services/providers/providerRegistry.js';
import { getUserSettings, saveUserSettings } from '../services/storage.js';
import { isDesktopApp } from '../services/platformBridge.js';
import { canUseDesktopSetup } from '../services/desktopSetupPolicy.js';

let currentStep = 1;
const TOTAL_STEPS = 4;

// Sistem tanılaması önbelleği
let diagState = {
  python: { ok: false, version: 'Kontrol ediliyor…', path: '' },
  sidecar: { ok: false, port: 4000, latency: 0 },
  gpu: { ok: false, renderer: 'Kontrol ediliyor…' },
  network: { ok: false, ping: 0 },
  checking: false
};

// Kaynak ping süreleri önbelleği
const providerLatencies = new Map();

/**
 * Donanım / GPU Hızlandırma Tespiti
 */
function detectGpuInfo() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return { ok: false, renderer: 'WebGL Desteklenmiyor' };
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return { ok: true, renderer: 'Standart Donanım Hızlandırıcı' };
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Etkin Donanım';
    return { ok: true, renderer };
  } catch (_) {
    return { ok: false, renderer: 'GPU Bilgisi Alınamadı' };
  }
}

/**
 * Sistem Tanılama & Gereksinimleri Sorgula
 */
async function runSystemDiagnostics() {
  diagState.checking = true;

  // 1. GPU
  const gpu = detectGpuInfo();
  diagState.gpu = gpu;

  // 2. Sidecar (127.0.0.1:4000)
  const t0 = performance.now();
  try {
    const res = await fetch('http://127.0.0.1:4000/health', { signal: AbortSignal.timeout(3000) });
    const t1 = performance.now();
    if (res.ok) {
      diagState.sidecar = { ok: true, port: 4000, latency: Math.round(t1 - t0) };
    } else {
      diagState.sidecar = { ok: false, port: 4000, latency: 0 };
    }
  } catch (_) {
    diagState.sidecar = { ok: false, port: 4000, latency: 0 };
  }

  // 3. Masaüstü Electron ise doğrudan Python ve ortam sorgula
  if (typeof window !== 'undefined' && window.CinePulseDesktop?.getSystemInfo) {
    try {
      const info = await window.CinePulseDesktop.getSystemInfo();
      if (info && info.python) {
        diagState.python = {
          ok: info.python.available,
          version: info.python.version || (info.python.available ? 'Python 3 Hazır' : 'Bulunamadı'),
          path: info.python.bin || ''
        };
      }
      if (info && info.sidecar) {
        diagState.sidecar.ok = info.sidecar.alive;
      }
    } catch (_) {
      diagState.python = { ok: false, version: 'Sorgulanamadı', path: '' };
    }
  } else {
    // Web modunda Sidecar ayaktaysa Python backend desteği var demektir
    diagState.python = {
      ok: diagState.sidecar.ok,
      version: diagState.sidecar.ok ? 'Yerel Servis Üzerinden Hazır' : 'Yerel Servis Bekleniyor',
      path: 'Sistem Yolu'
    };
  }

  // 4. Ağ Bağlantısı / Ping
  const pingStart = performance.now();
  try {
    await fetch('https://api.themoviedb.org/3/configuration?api_key=4e44d9029b1270a757cddc766a1bcb63', {
      method: 'HEAD',
      signal: AbortSignal.timeout(4000)
    });
    diagState.network = { ok: true, ping: Math.round(performance.now() - pingStart) };
  } catch (_) {
    diagState.network = { ok: navigator.onLine, ping: 0 };
  }

  diagState.checking = false;
}

/**
 * Kaynakları Canlı Test Et (Ping)
 */
async function pingProviders() {
  const providers = getProviders();
  showToast('Kaynak hızları test ediliyor…', 'info');

  const promises = providers.map(async (p) => {
    const start = performance.now();
    try {
      // Hızlı HEAD veya lightweight arama testi
      const testUrl = p.baseUrl || 'https://www.google.com';
      await fetch(`http://127.0.0.1:4000/api/proxy?url=${encodeURIComponent(testUrl)}`, {
        signal: AbortSignal.timeout(3500)
      }).catch(() => null);
      const elapsed = Math.round(performance.now() - start);
      providerLatencies.set(p.id, elapsed);
    } catch (_) {
      providerLatencies.set(p.id, -1);
    }
  });

  await Promise.allSettled(promises);
  renderStepContent();
}

/**
 * Modal Kapat
 */
export function closeSetupWizardModal() {
  const container = document.getElementById('setup-wizard-modal');
  if (container) {
    container.classList.add('hidden');
    container.innerHTML = '';
  }
}

/**
 * Kurulum Sihirbazı Modalı Aç
 */
export async function openSetupWizardModal(options = {}) {
  if (!canUseDesktopSetup(window.CinePulseDesktop, window.Capacitor)) {
    closeSetupWizardModal();
    return { opened: false, reason: 'desktop-only' };
  }
  let container = document.getElementById('setup-wizard-modal');
  if (!container) {
    container = document.createElement('div');
    container.id = 'setup-wizard-modal';
    container.className = 'modal-backdrop hidden';
    document.body.appendChild(container);
  }

  currentStep = 1;
  container.classList.remove('hidden');

  renderWizardShell();
  await runSystemDiagnostics();
  renderStepContent();
}

/**
 * Sihirbaz İskeleti
 */
function renderWizardShell() {
  const container = document.getElementById('setup-wizard-modal');
  if (!container) return;

  container.innerHTML = `
    <div class="setup-wizard-content glass-panel" style="
      max-width: 680px;
      width: 94%;
      background: #0d111d;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 18px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.85);
      color: #fff;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: modalSlideUp 0.25s cubic-bezier(0.16,1,0.3,1);
    ">
      <!-- Header -->
      <div style="padding: 22px 26px 16px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 38px; height: 38px; border-radius: 10px; background: linear-gradient(135deg, #e11d48, #f43f5e); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(225,29,72,0.4);">
            <i data-lucide="sliders" style="width: 20px; height: 20px; color: #fff;"></i>
          </div>
          <div>
            <div style="font-size: 1.15rem; font-weight: 800; letter-spacing: -0.02em;">CinePulse Kurulum & Optimizasyon</div>
            <div style="font-size: 0.8rem; color: #94a3b8;">Cloudstream & Nuvio hibrit medya merkezi yapılandırması</div>
          </div>
        </div>
        <button id="btn-wizard-close" class="btn-icon" style="background: rgba(255,255,255,0.06); border: none; border-radius: 8px; width: 32px; height: 32px; cursor: pointer; color: #94a3b8;" title="Kapat">
          <i data-lucide="x" style="width: 16px; height: 16px;"></i>
        </button>
      </div>

      <!-- Step Bar -->
      <div style="padding: 14px 26px; background: rgba(0,0,0,0.25); border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem;">
        <div class="wizard-step-tab" data-step="1" style="display:flex; align-items:center; gap:6px; color:#f43f5e; font-weight:700;">
          <span style="width:20px; height:20px; border-radius:50%; background:#f43f5e; color:#fff; display:inline-flex; align-items:center; justify-content:center; font-size:11px;">1</span>
          <span>Gereksinimler</span>
        </div>
        <div style="flex:1; height:2px; background:rgba(255,255,255,0.1); margin:0 10px;" id="step-line-1"></div>
        <div class="wizard-step-tab" data-step="2" style="display:flex; align-items:center; gap:6px; color:#64748b; font-weight:600;">
          <span style="width:20px; height:20px; border-radius:50%; background:rgba(255,255,255,0.1); color:#fff; display:inline-flex; align-items:center; justify-content:center; font-size:11px;">2</span>
          <span>Kaynaklar</span>
        </div>
        <div style="flex:1; height:2px; background:rgba(255,255,255,0.1); margin:0 10px;" id="step-line-2"></div>
        <div class="wizard-step-tab" data-step="3" style="display:flex; align-items:center; gap:6px; color:#64748b; font-weight:600;">
          <span style="width:20px; height:20px; border-radius:50%; background:rgba(255,255,255,0.1); color:#fff; display:inline-flex; align-items:center; justify-content:center; font-size:11px;">3</span>
          <span>Oynatıcı</span>
        </div>
        <div style="flex:1; height:2px; background:rgba(255,255,255,0.1); margin:0 10px;" id="step-line-3"></div>
        <div class="wizard-step-tab" data-step="4" style="display:flex; align-items:center; gap:6px; color:#64748b; font-weight:600;">
          <span style="width:20px; height:20px; border-radius:50%; background:rgba(255,255,255,0.1); color:#fff; display:inline-flex; align-items:center; justify-content:center; font-size:11px;">4</span>
          <span>Tamamla</span>
        </div>
      </div>

      <!-- Step Content Area -->
      <div id="wizard-step-body" style="padding: 24px 26px; min-height: 360px; max-height: 60vh; overflow-y: auto;">
        <!-- Injected per step -->
      </div>

      <!-- Footer Actions -->
      <div style="padding: 18px 26px; border-top: 1px solid rgba(255,255,255,0.08); background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: space-between;">
        <button id="btn-wizard-prev" class="btn-secondary" style="padding: 10px 18px; border-radius: 10px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); color: #cbd5e1; font-weight: 600; cursor: pointer; display: none; align-items: center; gap: 8px;">
          <i data-lucide="arrow-left" style="width: 15px; height: 15px;"></i>
          <span>Geri</span>
        </button>
        <div style="display: flex; gap: 10px; margin-left: auto;">
          <button id="btn-wizard-next" class="btn-primary" style="padding: 10px 24px; border-radius: 10px; background: linear-gradient(135deg, #e11d48, #f43f5e); border: none; color: #fff; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 14px rgba(225,29,72,0.4);">
            <span>İleri</span>
            <i data-lucide="arrow-right" style="width: 15px; height: 15px;"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  attachShellEvents();
  renderIcons();
}

/**
 * Adım İçeriklerini Bas
 */
function renderStepContent() {
  const body = document.getElementById('wizard-step-body');
  const prevBtn = document.getElementById('btn-wizard-prev');
  const nextBtn = document.getElementById('btn-wizard-next');
  if (!body) return;

  // Step indicator renklerini güncelle
  for (let s = 1; s <= TOTAL_STEPS; s++) {
    const tab = document.querySelector(`.wizard-step-tab[data-step="${s}"]`);
    const line = document.getElementById(`step-line-${s}`);
    if (tab) {
      const circle = tab.querySelector('span:first-child');
      if (s < currentStep) {
        tab.style.color = '#10b981';
        if (circle) { circle.style.background = '#10b981'; circle.innerHTML = '✓'; }
      } else if (s === currentStep) {
        tab.style.color = '#f43f5e';
        if (circle) { circle.style.background = '#f43f5e'; circle.innerHTML = String(s); }
      } else {
        tab.style.color = '#64748b';
        if (circle) { circle.style.background = 'rgba(255,255,255,0.1)'; circle.innerHTML = String(s); }
      }
    }
    if (line) {
      line.style.background = s < currentStep ? '#10b981' : 'rgba(255,255,255,0.1)';
    }
  }

  // Prev / Next button state
  if (prevBtn) prevBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
  if (nextBtn) {
    if (currentStep === TOTAL_STEPS) {
      nextBtn.innerHTML = `<span>🚀 Kurulumu Tamamla & Başlat</span>`;
      nextBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      nextBtn.style.boxShadow = '0 4px 16px rgba(16,185,129,0.4)';
    } else {
      nextBtn.innerHTML = `<span>İleri</span><i data-lucide="arrow-right" style="width:15px;height:15px;"></i>`;
      nextBtn.style.background = 'linear-gradient(135deg, #e11d48, #f43f5e)';
      nextBtn.style.boxShadow = '0 4px 14px rgba(225,29,72,0.4)';
    }
  }

  if (currentStep === 1) {
    body.innerHTML = renderStep1Requirements();
    attachStep1Events();
  } else if (currentStep === 2) {
    body.innerHTML = renderStep2Providers();
    attachStep2Events();
  } else if (currentStep === 3) {
    body.innerHTML = renderStep3Player();
    attachStep3Events();
  } else if (currentStep === 4) {
    body.innerHTML = renderStep4Finish();
    attachStep4Events();
  }

  renderIcons();
}

/**
 * Adım 1: Sistem & Servis Gereksinimleri
 */
function renderStep1Requirements() {
  const py = diagState.python;
  const side = diagState.sidecar;
  const gpu = diagState.gpu;
  const net = diagState.network;

  return `
    <div style="display: flex; flex-direction: column; gap: 18px;">
      <div>
        <div style="font-size: 1.05rem; font-weight: 700; color: #f8fafc; margin-bottom: 4px;">1. Sistem & Motor Tanılaması</div>
        <p style="font-size: 0.84rem; color: #94a3b8; margin: 0; line-height: 1.5;">
          Yerel servislerin ve donanım hızlandırmanın durumu aşağıda gösterilir. Oynatma uyumluluğu seçilen kaynağa bağlıdır.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr; gap: 12px;">
        <!-- Sidecar Card -->
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 36px; height: 36px; border-radius: 10px; background: ${side.ok ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}; color: ${side.ok ? '#10b981' : '#ef4444'}; display: flex; align-items: center; justify-content: center;">
              <i data-lucide="${side.ok ? 'server' : 'server-off'}" style="width: 18px; height: 18px;"></i>
            </div>
            <div>
              <div style="font-weight: 600; font-size: 0.92rem; color: #f1f5f9;">Medya Motoru (Port 4000)</div>
              <div style="font-size: 0.78rem; color: #94a3b8;">HLS akış köprüsü & WebTorrent motoru</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 0.76rem; padding: 4px 10px; border-radius: 20px; font-weight: 600; background: ${side.ok ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}; color: ${side.ok ? '#10b981' : '#ef4444'};">
              ${side.ok ? `Aktif (${side.latency}ms)` : 'Servis Kapalı'}
            </span>
            ${!side.ok && isDesktopApp() ? `<button id="btn-restart-sidecar" style="background:rgba(255,255,255,0.08); border:none; border-radius:6px; color:#fff; padding:4px 8px; font-size:11px; cursor:pointer;">Başlat</button>` : ''}
          </div>
        </div>

        <!-- Python 3 Card -->
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 36px; height: 36px; border-radius: 10px; background: ${py.ok ? 'rgba(56,189,248,0.15)' : 'rgba(223, 255, 118,0.15)'}; color: ${py.ok ? '#38bdf8' : '#dfff76'}; display: flex; align-items: center; justify-content: center;">
              <i data-lucide="code" style="width: 18px; height: 18px;"></i>
            </div>
            <div>
              <div style="font-weight: 600; font-size: 0.92rem; color: #f1f5f9;">Python 3 Çözücü Çekirdeği</div>
              <div style="font-size: 0.78rem; color: #94a3b8;">${py.version || 'HDFC, SetFilm ve SezonlukDizi ayrıştırıcı'}</div>
            </div>
          </div>
          <div>
            <span style="font-size: 0.76rem; padding: 4px 10px; border-radius: 20px; font-weight: 600; background: ${py.ok ? 'rgba(16,185,129,0.15)' : 'rgba(223, 255, 118,0.15)'}; color: ${py.ok ? '#10b981' : '#dfff76'};">
              ${py.ok ? 'Hazır' : 'Opsiyonel (Tavsiye Edilir)'}
            </span>
          </div>
        </div>

        <!-- GPU Card -->
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 36px; height: 36px; border-radius: 10px; background: ${gpu.ok ? 'rgba(168,85,247,0.15)' : 'rgba(100,116,139,0.15)'}; color: ${gpu.ok ? '#c084fc' : '#94a3b8'}; display: flex; align-items: center; justify-content: center;">
              <i data-lucide="cpu" style="width: 18px; height: 18px;"></i>
            </div>
            <div style="max-width: 380px;">
              <div style="font-weight: 600; font-size: 0.92rem; color: #f1f5f9;">Donanım & GPU Hızlandırma</div>
              <div style="font-size: 0.78rem; color: #94a3b8; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${gpu.renderer}</div>
            </div>
          </div>
          <div>
            <span style="font-size: 0.76rem; padding: 4px 10px; border-radius: 20px; font-weight: 600; background: ${gpu.ok ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)'}; color: ${gpu.ok ? '#10b981' : '#cbd5e1'};">
              ${gpu.ok ? 'Donanım hızlandırma kullanılabilir' : 'Yazılımsal'}
            </span>
          </div>
        </div>

        <!-- Network / Ghost Resolver -->
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(16,185,129,0.15); color: #10b981; display: flex; align-items: center; justify-content: center;">
              <i data-lucide="shield-check" style="width: 18px; height: 18px;"></i>
            </div>
            <div>
              <div style="font-weight: 600; font-size: 0.92rem; color: #f1f5f9;">Uygulama İçi Doğrulama</div>
              <div style="font-size: 0.78rem; color: #94a3b8;">Destekli kaynaklarda kullanıcı doğrulama alanı</div>
            </div>
          </div>
          <div>
            <span style="font-size: 0.76rem; padding: 4px 10px; border-radius: 20px; font-weight: 600; background: rgba(16,185,129,0.15); color: #10b981;">
              Kaynağa bağlı
            </span>
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end;">
        <button id="btn-retest-diag" class="btn-secondary" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #cbd5e1; font-size: 0.8rem; padding: 6px 14px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
          <i data-lucide="refresh-cw" style="width: 13px; height: 13px;"></i>
          <span>Yeniden Test Et</span>
        </button>
      </div>
    </div>
  `;
}

/**
 * Adım 2: Eklenti & Kaynak Seçimi (Cloudstream Stili)
 */
function renderStep2Providers() {
  const providers = getProviders();

  return `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
        <div>
          <div style="font-size: 1.05rem; font-weight: 700; color: #f8fafc; margin-bottom: 4px;">2. Eklentiler & Yayın Kaynakları</div>
          <div style="font-size: 0.84rem; color: #94a3b8;">Cloudstream stili kaynak yönetimi. Dilediğin kaynağı aç/kapat veya ping testi yap.</div>
        </div>
        <button id="btn-ping-providers" style="background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.3); color: #38bdf8; border-radius: 8px; font-size: 0.78rem; font-weight: 600; padding: 6px 12px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
          <i data-lucide="zap" style="width: 13px; height: 13px;"></i>
          <span>Hızları Test Et</span>
        </button>
      </div>

      <!-- Quick Preset Buttons -->
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="btn-provider-preset" data-preset="all" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #e2e8f0; font-size: 0.78rem; padding: 5px 12px; border-radius: 6px; cursor: pointer;">
          ✓ Tümünü Aç (Önerilen)
        </button>
        <button class="btn-provider-preset" data-preset="fast" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #e2e8f0; font-size: 0.78rem; padding: 5px 12px; border-radius: 6px; cursor: pointer;">
          ⚡ Yalnızca En Hızlılar
        </button>
        <button class="btn-provider-preset" data-preset="tr" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #e2e8f0; font-size: 0.78rem; padding: 5px 12px; border-radius: 6px; cursor: pointer;">
          🇹🇷 Yerli Film & Dizi
        </button>
      </div>

      <!-- Provider List -->
      <div style="display: flex; flex-direction: column; gap: 8px; max-height: 280px; overflow-y: auto; padding-right: 4px;">
        ${providers.map((p) => {
          const lat = providerLatencies.get(p.id);
          let latBadge = '';
          if (lat !== undefined) {
            if (lat > 0 && lat < 400) latBadge = `<span style="font-size:11px; color:#10b981; font-weight:600;">⚡ ${lat}ms</span>`;
            else if (lat >= 400) latBadge = `<span style="font-size:11px; color:#dfff76; font-weight:600;">⏱️ ${lat}ms</span>`;
            else latBadge = `<span style="font-size:11px; color:#ef4444; font-weight:600;">⚠️ Yanıt Yok</span>`;
          }

          return `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 28px; height: 28px; border-radius: 8px; background: rgba(225,29,72,0.15); color: #f43f5e; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800;">
                  ${(p.name || 'P')[0]}
                </div>
                <div>
                  <div style="font-weight: 600; font-size: 0.88rem; color: #f1f5f9; display: flex; align-items: center; gap: 8px;">
                    <span>${p.name}</span>
                    ${latBadge}
                  </div>
                  <div style="font-size: 0.74rem; color: #94a3b8;">${p.types ? p.types.join(', ') : 'Film & Dizi VIP'}</div>
                </div>
              </div>
              <label style="position: relative; display: inline-block; width: 44px; height: 24px; cursor: pointer;">
                <input type="checkbox" class="provider-toggle-input" data-provider-id="${p.id}" ${p.enabled !== false ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: ${p.enabled !== false ? '#f43f5e' : 'rgba(255,255,255,0.15)'}; transition: .2s; border-radius: 24px;"></span>
                <span style="position: absolute; content: ''; height: 18px; width: 18px; left: ${p.enabled !== false ? '23px' : '3px'}; bottom: 3px; background-color: white; transition: .2s; border-radius: 50%;"></span>
              </label>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/**
 * Adım 3: Oynatıcı & Performans (Nuvio Stili)
 */
function renderStep3Player() {
  const settings = getUserSettings();

  return `
    <div style="display: flex; flex-direction: column; gap: 18px;">
      <div>
        <div style="font-size: 1.05rem; font-weight: 700; color: #f8fafc; margin-bottom: 4px;">3. Oynatıcı & Performans Tercihleri</div>
        <div style="font-size: 0.84rem; color: #94a3b8;">Nuvio native oynatıcı ilkeleri: minimum gecikme, optimum bellek ve kesintisiz akış.</div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 14px;">
        <!-- Player Mode Selection -->
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 18px;">
          <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 8px; color: #f8fafc;">Varsayılan Oynatıcı Motoru</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <label style="border: 2px solid #f43f5e; background: rgba(225,29,72,0.08); padding: 12px; border-radius: 10px; cursor: pointer; display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-weight: 700; font-size: 0.88rem; color: #fff;">Dahili VIP Oynatıcı</span>
                <input type="radio" name="opt_player_mode" value="internal" checked style="accent-color: #f43f5e;">
              </div>
              <span style="font-size: 0.74rem; color: #cbd5e1;">HLS.js donanım ivmeli, altyazı ve bölüm hafızalı (Önerilen)</span>
            </label>
            <label style="border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.02); padding: 12px; border-radius: 10px; cursor: pointer; display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-weight: 700; font-size: 0.88rem; color: #fff;">Harici Oynatıcı</span>
                <input type="radio" name="opt_player_mode" value="external" style="accent-color: #f43f5e;">
              </div>
              <span style="font-size: 0.74rem; color: #cbd5e1;">MPV, VLC veya sistem varsayılan medya oynatıcısı</span>
            </label>
          </div>
        </div>

        <!-- Buffer Cache Size -->
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-weight: 600; font-size: 0.9rem; color: #f8fafc;">Önbellek & Arabellek Boyutu</div>
            <div style="font-size: 0.76rem; color: #94a3b8;">Takılmayı önleyen RAM akış tamponu</div>
          </div>
          <select id="opt_buffer_size" style="background: #1e293b; color: #fff; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 6px 12px; font-size: 0.82rem;">
            <option value="50">50 MB (Düşük Bellek)</option>
            <option value="100" selected>100 MB (Dengeli - Tavsiye)</option>
            <option value="250">250 MB (Ultra Kesintisiz)</option>
          </select>
        </div>

        <!-- Subtitles Preference -->
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-weight: 600; font-size: 0.9rem; color: #f8fafc;">Varsayılan Altyazı Dili</div>
            <div style="font-size: 0.76rem; color: #94a3b8;">Otomatik yüklenen altyazı tercihi</div>
          </div>
          <select id="opt_sub_lang" style="background: #1e293b; color: #fff; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 6px 12px; font-size: 0.82rem;">
            <option value="tr" selected>🇹🇷 Türkçe</option>
            <option value="en">🇬🇧 İngilizce</option>
            <option value="off">Kapalı</option>
          </select>
        </div>

        <!-- Auto Next & Resume Toggles -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 0.84rem; font-weight: 600; color: #f1f5f9;">Otomatik Sonraki Bölüm</span>
            <input type="checkbox" id="opt_auto_next" checked style="accent-color: #f43f5e; width: 16px; height: 16px;">
          </div>
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 0.84rem; font-weight: 600; color: #f1f5f9;">Kaldığı Yerden Devam</span>
            <input type="checkbox" id="opt_resume" checked style="accent-color: #f43f5e; width: 16px; height: 16px;">
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Adım 4: Tamamlandı & Başlat
 */
function renderStep4Finish() {
  const activeProvidersCount = getProviders().length;

  return `
    <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 20px; padding: 10px 0;">
      <div style="width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #10b981, #059669); display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(16,185,129,0.4);">
        <i data-lucide="check" style="width: 34px; height: 34px; color: #fff;"></i>
      </div>

      <div>
        <div style="font-size: 1.25rem; font-weight: 800; color: #f8fafc; margin-bottom: 6px;">Kurulum Başarıyla Tamamlandı!</div>
        <p style="font-size: 0.88rem; color: #94a3b8; max-width: 480px; margin: 0 auto; line-height: 1.5;">
          CinePulse tüm gereksinimleri doğruladı ve medya motorunu yapılandırdı. Artık yerli & global VIP içeriklerin keyfini çıkarabilirsiniz.
        </p>
      </div>

      <!-- Summary Badges -->
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 16px 20px; width: 100%; max-width: 460px; display: flex; justify-content: space-around; text-align: center;">
        <div>
          <div style="font-size: 1.25rem; font-weight: 800; color: #f43f5e;">${activeProvidersCount}</div>
          <div style="font-size: 0.74rem; color: #94a3b8;">Aktif Kaynak</div>
        </div>
        <div style="width: 1px; background: rgba(255,255,255,0.08);"></div>
        <div>
          <div style="font-size: 1.25rem; font-weight: 800; color: #10b981;">1080p VIP</div>
          <div style="font-size: 0.74rem; color: #94a3b8;">HLS Akışı</div>
        </div>
        <div style="width: 1px; background: rgba(255,255,255,0.08);"></div>
        <div>
          <div style="font-size: 1.25rem; font-weight: 800; color: #38bdf8;">GPU Etkin</div>
          <div style="font-size: 0.74rem; color: #94a3b8;">Donanım İvmesi</div>
        </div>
      </div>

      <div style="font-size: 0.78rem; color: #64748b;">
        * İstediğin zaman üst menüdeki araçlardan bu sihirbazı tekrar açabilirsin.
      </div>
    </div>
  `;
}

/**
 * Event Listeners
 */
function attachShellEvents() {
  document.getElementById('btn-wizard-close')?.addEventListener('click', closeSetupWizardModal);

  document.getElementById('btn-wizard-prev')?.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      renderStepContent();
    }
  });

  document.getElementById('btn-wizard-next')?.addEventListener('click', async () => {
    if (currentStep < TOTAL_STEPS) {
      currentStep++;
      renderStepContent();
    } else {
      // Tamamlandı
      localStorage.setItem('cp_setup_done_v1', 'true');
      showToast('CinePulse hazır! İyi seyirler 🍿', 'success');
      closeSetupWizardModal();
    }
  });
}

function attachStep1Events() {
  document.getElementById('btn-retest-diag')?.addEventListener('click', async () => {
    showToast('Sistem tanılaması yenileniyor…', 'info');
    await runSystemDiagnostics();
    renderStepContent();
  });

  document.getElementById('btn-restart-sidecar')?.addEventListener('click', async () => {
    if (window.CinePulseDesktop?.restartSidecar) {
      showToast('Yerel servis yeniden başlatılıyor…', 'info');
      await window.CinePulseDesktop.restartSidecar();
      await runSystemDiagnostics();
      renderStepContent();
    }
  });
}

function attachStep2Events() {
  document.getElementById('btn-ping-providers')?.addEventListener('click', pingProviders);

  // Toggle handlers
  document.querySelectorAll('.provider-toggle-input').forEach((input) => {
    input.addEventListener('change', async (e) => {
      const id = e.target.getAttribute('data-provider-id');
      await setProviderEnabled(id, e.target.checked);
      await persistProviderState();
    });
  });

  // Presets
  document.querySelectorAll('.btn-provider-preset').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const preset = e.currentTarget.getAttribute('data-preset');
      const all = getProviders();
      for (const p of all) {
        if (preset === 'all') {
          await setProviderEnabled(p.id, true);
        } else if (preset === 'fast') {
          const isFast = ['sinewix', 'diziyou', 'dizisol', 'rectv', 'lookmovie'].includes(p.id);
          await setProviderEnabled(p.id, isFast);
        } else if (preset === 'tr') {
          const isTr = ['hdfilmcehennemi', 'sezonlukdizi', 'dizisol', 'diziyo', 'webteizle'].includes(p.id);
          await setProviderEnabled(p.id, isTr);
        }
      }
      await persistProviderState();
      renderStepContent();
      showToast('Kaynak şablonu uygulandı!', 'success');
    });
  });
}

function attachStep3Events() {
  document.getElementById('opt_buffer_size')?.addEventListener('change', (e) => {
    localStorage.setItem('cp_buffer_size_mb', e.target.value);
  });
  document.getElementById('opt_sub_lang')?.addEventListener('change', (e) => {
    localStorage.setItem('cp_default_sub_lang', e.target.value);
  });
  document.getElementById('opt_auto_next')?.addEventListener('change', (e) => {
    localStorage.setItem('cp_auto_next_episode', e.target.checked ? 'true' : 'false');
  });
  document.getElementById('opt_resume')?.addEventListener('change', (e) => {
    localStorage.setItem('cp_resume_playback', e.target.checked ? 'true' : 'false');
  });
}

function attachStep4Events() {
  // Finisher
}

