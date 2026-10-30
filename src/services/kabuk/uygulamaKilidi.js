/* ==========================================================================
   CinePulse — uygulama kilidi (#12)
   --------------------------------------------------------------------------
   Ayar açıksa (ve cihaz biyometriğe hazırsa) uygulama açılışta ve 30 sn'den
   uzun arka plan dönüşünde kilit ekranıyla gelir. Doğrulama BiometricPrompt
   (parmak izi / yüz / ekran kilidi) — Java köprüsü: window.CinePulseBiometric,
   sonuç kanalı: window.__cpBiometrik(true|false). Kilit kararı HER ZAMAN bu
   katmandadır; Java yalnız istekçi (ayarlandıysa) overlay'i hatırlatır.
   CSS bilinçli olarak satır içi: overlay açılışta her şeyden önce çizebilir
   olmalı ve modül node testlerinde import edilebilsin.
   ========================================================================== */

const KILIT_ANAHTAR = 'cp_kilit';

export const kilitAcik = () => {
  try { return localStorage.getItem(KILIT_ANAHTAR) === 'acik'; } catch (_) { return false; }
};

/* Ayarı hem JS (overlay kararı) hem Java (arka plan hatırlatması) bilmeli. */
export function kilitAyarla(acik) {
  try { localStorage.setItem(KILIT_ANAHTAR, acik ? 'acik' : 'kapali'); } catch (_) {}
  try { window.CinePulseBiometric?.ayarla?.(Boolean(acik)); } catch (_) {}
}

export const biometrikHazir = () => {
  try { return window.CinePulseBiometric?.durum?.() === 'hazir'; } catch (_) { return false; }
};

/* BiometricPrompt sonucunu Promise'e çevirir. zamanAsimiMs test/güvenlik payı. */
export function biometrikDogrula(zamanAsimiMs = 90000) {
  return new Promise((cozum) => {
    const onceki = window.__cpBiometrik;
    let bitti = false;
    const kapat = (sonuc) => {
      if (bitti) return;
      bitti = true;
      clearTimeout(t);
      window.__cpBiometrik = onceki;
      cozum(sonuc === true);
    };
    window.__cpBiometrik = (b) => kapat(b === true);
    const t = setTimeout(() => kapat(false), zamanAsimiMs);
    try { window.CinePulseBiometric.dogrula(); } catch (_) { kapat(false); }
  });
}

let overlay = null;

export function kilitGosteriKapat() {
  if (overlay) { overlay.remove(); overlay = null; }
}

export function kilitEkraniGoster() {
  if (overlay || !kilitAcik()) return;
  overlay = document.createElement('div');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Uygulama kilidi');
  overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:#020617;display:grid;place-items:center;';
  overlay.innerHTML = `
    <div style="text-align:center;padding:28px 32px;border-radius:18px;background:#0f172a;border:1px solid rgba(148,163,184,.25);max-width:320px;">
      <div style="font-size:2.4rem;">🔒</div>
      <h3 style="margin:.5rem 0 .2rem;color:#e2e8f0;font-size:1.05rem;">CinePulse kilitli</h3>
      <p id="cp-kl-not" style="font-size:.76rem;color:#94a3b8;margin:.3rem 0 1rem;">Açmak için doğrula</p>
      <button id="cp-kl-ac" type="button" style="cursor:pointer;padding:.6rem 1.4rem;border-radius:999px;border:none;background:#dfff76;color:#0b1020;font-weight:700;font-size:.85rem;">Parmak iziyle aç</button>
    </div>`;
  document.body.appendChild(overlay);
  const not = overlay.querySelector('#cp-kl-not');
  const dogrula = async () => {
    not.textContent = 'Doğrulama bekleniyor…';
    const ok = await biometrikDogrula();
    if (ok) kilitGosteriKapat();
    else not.textContent = 'Doğrulanamadı — tekrar dene.';
  };
  overlay.querySelector('#cp-kl-ac').addEventListener('click', dogrula);
  dogrula(); // açılışta tek otomatik deneme (parmak zaten hazırsa tek dokunuş)
}

/* main.js açılışında bir kez çağrılır. */
export function kilidiKur() {
  window.__cpKilitGoster = () => kilitEkraniGoster();
  try { window.CinePulseBiometric?.ayarla?.(kilitAcik()); } catch (_) {}
  if (kilitAcik() && biometrikHazir()) kilitEkraniGoster();
}
