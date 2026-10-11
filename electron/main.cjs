/* CinePulse Desktop (EXE) — Electron main process.
 * Hibrit model: Chromium UI (dist/) + local sidecar (server/mediaServer.js:4000)
 * + gizli WebView (ghost window) Cloudflare/403 cozumu icin.
 *
 * Nuvio'dan alinanlar (native his): splash, pencere hafizasi, tek ornek,
 * GPU hizlandirma, userData'da kalici magaza.
 * Cloudstream'den alinanlar (eklenti sistemi): provider ac/kapa + oncelik
 * kalici olarak saklanir; eksikligi (sessiz bozulma) gidermek icin sidecar
 * saglik kontrolu vardir.
 *
 * Ilk acilis akisi (geleneksel kurulum sayfasi):
 *   acilis -> gereksinim denetimi (Python 3 + cryptography, opsiyonel ffmpeg)
 *   eksik varsa kurulum penceresi acilir, "Otomatik Kur" ile eksikler
 *   kurulur ("otomatik kuruluyor..." canli log), bitince ana pencere acilir.
 *   Kullanicilar Atla derse eski uyari gosterilip uygulama yine acilir. */

const { app, BrowserWindow, ipcMain, dialog, shell, webFrameMain, WebContentsView } = require('electron');
const { installPlayerFrameLayout } = require('./playerFrame.cjs');
const { registerVerificationPlayer } = require('./verificationPlayer.cjs');
const { fetchUpdateManifest } = require('./updateManifest.cjs');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const os = require('os');
const { spawn, execFile } = require('child_process');
const { createStore } = require('./store.cjs');

const ROOT = path.join(__dirname, '..');
const SIDECAR_PORT = 4000;
const SIDECAR_URL = `http://127.0.0.1:${SIDECAR_PORT}`;
ipcMain.handle('cinepulse:open-release-page', () =>
  shell.openExternal('https://github.com/caca1403/cine-pulse/releases')
);
const REAL_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

// Nuvio "native player daha akici" ilkesi: Chromium'un kendi GPU secimini
// kullan. Agresif flag'ler (ignore-gpu-blocklist vb.) GPU'suz sistemlerde
// bos gri pencereye yol actigindan bilerek EKLENMEDI.
// ANCAK GPU dongude cokerse (error 1002) pencere hic acilmaz ("acilmiyor").
// Asagidaki bekci 3. cokuste otomatik yazilim-render ile yeniden baslar;
// kullanici bayrakla ugrasmaz.
const SOFTWARE_GL_FLAG = (() => {
  try { return process.argv.includes('--cinepulse-software-gl'); } catch (_) { return false; }
})();
if (SOFTWARE_GL_FLAG) {
  try { app.disableHardwareAcceleration(); } catch (_) {}
}
let gpuCrashCount = 0;
try {
  app.on('child-process-gone', (_e, details) => {
    try {
      if (!details || details.type !== 'GPU' || SOFTWARE_GL_FLAG || isQuitting) return;
      gpuCrashCount += 1;
      logSidecar(`gpu crash #${gpuCrashCount} reason=${details.reason || 'unknown'}`);
      if (gpuCrashCount >= 3) {
        logSidecar('gpu dongusu: yazilim-render ile otomatik yeniden baslatiliyor');
        isQuitting = true;
        app.relaunch({ args: process.argv.slice(1).concat(['--cinepulse-software-gl']) });
        app.quit();
      }
    } catch (_) {}
  });
} catch (_) {}

// Tek ornek: ikinci tiklamada mevcut pencere one gelir (native davranis).
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
  return;
}

let mainWin = null;
let splashWin = null;
let ghostWin = null;
let sidecarProc = null;
let sidecarLogFd = null;
let store = null;
let isQuitting = false;
let sidecarRestarts = 0;
const verificationPlayer = registerVerificationPlayer({ ipcMain, WebContentsView, webFrameMain, getWindow: () => mainWin });

function sidecarAlive() {
  return new Promise((resolve) => {
    const req = http.get(`${SIDECAR_URL}/health`, { timeout: 2000 }, (res) => {
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForSidecar(tries = 45) {
  for (let i = 0; i < tries; i++) {
    if (await sidecarAlive()) return true;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

function appRoot() {
  // Paketli EXE'de asar kapali: hersey resources/app altinda duz dosya
  // (Python .py'lari ve Node require'lari arsiv icinden okuyamaz).
  if (app.isPackaged) return path.join(process.resourcesPath, 'app');
  return ROOT;
}

function sidecarLogPath() {
  try {
    return path.join(app.getPath('userData'), 'logs', 'sidecar.log');
  } catch (_) {
    return path.join(ROOT, 'sidecar.log');
  }
}

function logSidecar(msg) {
  try {
    const dir = path.dirname(sidecarLogPath());
    fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(
      sidecarLogPath(),
      `[${new Date().toISOString()}] ${msg}\n`
    );
  } catch (_) {}
}

const { execFile: execFileCb } = require('child_process');
const { promisify } = require('util');

// Kullanici portla ugrasmasin: 4000 dolu ama /health cevap vermiyorsa,
// eski CinePulse sidecar zombie'sidir. Sadece kendi mediaServer sureclerimizi
// oldurup tek seferlik otomatik retry dener. Baska uygulamalarin
// portlarina dokunulmaz.
async function tryFreeStalePort() {
  try {
    if (await sidecarAlive()) return true; // saglikli ornek var, dokunma
    const entry = path.join(appRoot(), 'server', 'mediaServer.js');
    const run = promisify(execFileCb);
    let pids = [];
    try {
      const { stdout } = await run('pgrep', ['-f', entry]);
      pids = String(stdout || '').split(/\s+/).map(s => s.trim()).filter(Boolean);
    } catch (_) { pids = []; }
    // pgrep yoksa (Windows) ya da eslesme yoksa: portu sorgula, CinePulse degilse birak
    if (pids.length === 0) {
      try {
        if (process.platform === 'win32') {
          const { stdout } = await run('netstat', ['-ano']);
          logSidecar(`port-probe netstat: ${(stdout || '').split('\n').filter(l => l.includes(':4000')).join(' | ').slice(0, 300)}`);
        } else {
          const { stdout } = await run('sh', ['-c', '(ss -tlnp 2>/dev/null || netstat -tlnp 2>/dev/null) | grep 4000 || true']);
          logSidecar(`port-probe: ${(stdout || '').trim().slice(0, 300)}`);
        }
      } catch (_) {}
      return false;
    }
    const selfPid = String(process.pid);
    for (const pid of pids.filter(p => p && p !== selfPid)) {
      try {
        process.kill(Number(pid), 'SIGTERM');
        logSidecar(`stale sidecar SIGTERM pid=${pid}`);
      } catch (_) {}
    }
    await new Promise((r) => setTimeout(r, 1500));
    return await sidecarAlive();
  } catch (err) {
    logSidecar(`tryFreeStalePort: ${(err && err.message) || err}`);
    return false;
  }
}

function mediaDirPath() {
  // DEB (/opt/CinePulse) root'a ait, AppImage squashfs'e RO bagliyor:
  // sidecar'in yanina medya yazmak EACCES veriyordu. Her zaman kullanici
  // yazilabilir dizini ver (userData). Eski kurulumlarda yanındaki klasör
  // kullanılıyordu; eski içerik kaybolmasin diye veri taşıyoruz.
  let target = null;
  try {
    target = path.join(app.getPath('userData'), 'media_storage');
  } catch (_) {}
  if (!target) {
    const base = process.env.XDG_DATA_HOME || path.join(os.homedir(), '.local', 'share');
    target = path.join(base, 'CinePulse', 'media_storage');
  }
  try {
    fs.mkdirSync(target, { recursive: true });
  } catch (_) {}
  return target;
}

// Eski sürümlerden kalan içerik varsa tek seferlik taşı (dosya taşınmaz, işaret
// dosyası bırakılır: kullanıcının güncelleme öncesi listesi kaybolmasın).
function migrateLegacyMedia(target) {
  const legacy = path.join(appRoot(), 'media_storage');
  if (legacy === target) return;
  try {
    if (!fs.existsSync(legacy)) return;
    const names = fs.readdirSync(legacy);
    if (!names.length) return;
    for (const name of names) {
      const from = path.join(legacy, name);
      const to = path.join(target, name);
      try {
        if (fs.existsSync(to)) continue;
        fs.cpSync(from, to, { recursive: true, force: false });
      } catch (_) {}
    }
    logSidecar(`legacy media migrated -> ${target}`);
  } catch (_) {}
}

function startSidecar() {  const entry = path.join(appRoot(), 'server', 'mediaServer.js');
  logSidecar(`starting: ${entry}`);
  try {
    const dir = path.dirname(sidecarLogPath());
    fs.mkdirSync(dir, { recursive: true });
    if (sidecarLogFd) {
      try { fs.closeSync(sidecarLogFd); } catch (_) {}
    }
    sidecarLogFd = fs.openSync(sidecarLogPath(), 'a');
  } catch (_) {
    sidecarLogFd = null;
  }
  const mediaDir = mediaDirPath();
  migrateLegacyMedia(mediaDir);
  // Electron binary'sini duz Node gibi calistir (ayri node kurulumu gerekmez).
  sidecarProc = spawn(process.execPath, [entry], {
    cwd: appRoot(),
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
      PYTHON_BIN: resolvePythonBin(),
      CINEPULSE_MEDIA_DIR: mediaDir
    },
    stdio: ['ignore', 'ignore', sidecarLogFd || 'ignore'],
    windowsHide: true
  });
  sidecarProc.on('error', (err) => {
    logSidecar(`spawn error: ${(err && err.message) || err}`);
  });
  sidecarProc.on('exit', async (code, signal) => {
    logSidecar(`exit code=${code} signal=${signal}`);
    sidecarProc = null;
    if (isQuitting) return; // Kapanista bilerek olduruldu: uyari gosterme.
    if (!mainWin || mainWin.isDestroyed()) return;
    // Beklenmedik olum: bir kez otomatik yeniden baslat (Cloudstream'in
    // sessiz bozulma eksikligine karsi kendini iyilestiren servis).
    if (sidecarRestarts < 1) {
      sidecarRestarts += 1;
      logSidecar('auto-restart #1');
      startSidecar();
      if (await waitForSidecar(20)) return;
    }
    dialog.showErrorBox(
      'CinePulse Servis Durdu',
      `Yerel medya servisi kapandi (kod ${code}). HDFC/SetFilm gibi Python cozucu kaynaklar calismaz. Detay: ${sidecarLogPath()}`
    );
  });
}

function resolvePythonBin() {
  if (process.env.PYTHON_BIN) return process.env.PYTHON_BIN;
  try {
    const saved = store && store.get('pythonBin', null);
    if (saved) return saved;
  } catch (_) {}
  return process.platform === 'win32' ? 'python' : 'python3';
}

function runBin(cmd, args, { timeout = 15000, shell = false } = {}) {
  return new Promise((resolve) => {
    let child;
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(deadline);
      resolve(result);
    };
    // Killing cmd.exe alone may leave a winget child holding its pipes open.
    // Resolve at the deadline independently, and terminate the Windows tree.
    const deadline = setTimeout(() => {
      finish({ ok: false, out: '', err: `Timed out after ${timeout}ms` });
      if (process.platform === 'win32' && child?.pid) {
        const killer = spawn('taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' });
        killer.on('error', () => { try { child.kill(); } catch (_) {} });
      } else { try { child?.kill('SIGKILL'); } catch (_) {} }
    }, timeout);
    try {
      child = execFile(cmd, args, { timeout, windowsHide: true, shell }, (err, stdout, stderr) => {
        finish({ ok: !err, out: String(stdout || stderr || '').trim(), err: err ? String(err.message || err) : '' });
      });
    } catch (e) {
      finish({ ok: false, out: '', err: String(e.message || e) });
    }
  });
}

function rememberPythonBin(bin) {
  try {
    if (store && bin) store.set('pythonBin', bin);
  } catch (_) {}
  try {
    if (bin) process.env.PYTHON_BIN = bin;
  } catch (_) {}
}

async function probePython() {
  const cands = [];
  try {
    const saved = store && store.get('pythonBin', null);
    if (saved) cands.push({ cmd: saved, args: ['--version'] });
  } catch (_) {}
  if (process.platform === 'win32') {
    cands.push({ cmd: 'python', args: ['--version'] });
    cands.push({ cmd: 'py', args: ['-3', '--version'] });
    const ld = process.env.LOCALAPPDATA || '';
    for (const v of ['313', '312', '311', '310']) {
      if (ld) cands.push({ cmd: path.join(ld, 'Programs', 'Python', `Python${v}`, 'python.exe'), args: ['--version'] });
      cands.push({ cmd: `C:\\Python${v}\\python.exe`, args: ['--version'] });
    }
  } else {
    cands.push({ cmd: 'python3', args: ['--version'] });
    cands.push({ cmd: 'python', args: ['--version'] });
  }
  for (const c of cands) {
    const r = await runBin(c.cmd, c.args, { timeout: 8000 });
    if (r.ok && /python\s+3/i.test(r.out)) {
      const bin = c.cmd === 'py' ? 'py' : c.cmd;
      return { ok: true, bin, version: r.out.split('\n')[0].trim() };
    }
  }
  return { ok: false, bin: cands.length ? cands[0].cmd : 'python', version: '' };
}

async function probeCrypto(pyBin) {
  const r = await runBin(pyBin, ['-c', 'import cryptography; print(cryptography.__version__)'], { timeout: 10000 });
  return { ok: r.ok, version: r.ok ? r.out.split('\n')[0].trim() : '' };
}

async function probeFfmpeg() {
  const cmd = process.platform === 'win32' ? 'ffmpeg' : 'ffmpeg';
  const r = await runBin(cmd, ['-version'], { timeout: 8000 });
  const m = /ffmpeg\s+version\s+([^\s]+)/i.exec(r.out);
  return { ok: r.ok, version: m ? m[1] : '' };
}

async function checkRequirements() {
  const [py, ff] = await Promise.all([probePython(), probeFfmpeg()]);
  const crypto = py.ok ? await probeCrypto(py.bin) : { ok: false, version: '' };
  return { python: py, crypto, ffmpeg: ff };
}

function downloadFile(url, dest, timeout = 300000) {
  return new Promise((resolve) => {
    try {
      const out = fs.createWriteStream(dest);
      const req = https.get(url, { headers: { 'User-Agent': 'CinePulse-Setup' }, timeout }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          out.close();
          try { fs.unlinkSync(dest); } catch (_) {}
          downloadFile(res.headers.location, dest, timeout).then(resolve);
          return;
        }
        if (res.statusCode !== 200) {
          out.close();
          resolve({ ok: false, err: `HTTP ${res.statusCode}` });
          return;
        }
        res.pipe(out);
        out.on('finish', () => resolve({ ok: true }));
      });
      req.on('error', (e) => resolve({ ok: false, err: String((e && e.message) || e) }));
      req.on('timeout', () => { try { req.destroy(); } catch (_) {} resolve({ ok: false, err: 'timeout' }); });
    } catch (e) {
      resolve({ ok: false, err: String((e && e.message) || e) });
    }
  });
}

function linuxPkgManager() {
  const bins = [
    ['apt-get', ['install', '-y']],
    ['dnf', ['install', '-y']],
    ['pacman', ['-S', '--noconfirm']],
    ['zypper', ['install', '-y']]
  ];
  for (const [bin, args] of bins) {
    try {
      const p = require('child_process').execFileSync('which', [bin], { timeout: 4000 }).toString().trim();
      if (p) return { bin: p, args };
    } catch (_) {}
  }
  return null;
}

async function pkexecAvailable() {
  const r = await runBin('which', ['pkexec'], { timeout: 4000 });
  return r.ok && Boolean(r.out);
}

/* ---- Kurulum penceresi (geleneksel sihirbaz) ---- */
let setupWin = null;
let setupResolve = null;

const SETUP_HTML = `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<title>CinePulse Kurulum</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#0d0f17;color:#e8ecf3;font-family:'Segoe UI',system-ui,sans-serif}
.wrap{max-width:520px;margin:0 auto;padding:26px 26px 20px}
.brand{font-size:26px;font-weight:800}.brand b{color:#e11d48}
.sub{color:#94a3b8;font-size:13px;margin:4px 0 18px}
.item{display:flex;align-items:center;gap:12px;background:#141824;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:11px 14px;margin-bottom:10px}
.dot{width:11px;height:11px;border-radius:50%;background:#64748b;flex:none}
.dot.ok{background:#10b981;box-shadow:0 0 8px #10b981}.dot.missing{background:#ef4444}
.dot.working{background:#f59e0b;box-shadow:0 0 8px #f59e0b;animation:bl 1s infinite alternate}
.dot.skip{background:#64748b}.dot.optional{background:#38bdf8}
@keyframes bl{to{opacity:.4}}
.info{min-width:0;flex:1}.name{font-weight:700;font-size:14px}.desc{color:#94a3b8;font-size:12px;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.state{font-size:12px;font-weight:700;flex:none}
.st-ok{color:#10b981}.st-missing{color:#ef4444}.st-working{color:#f59e0b}.st-skip{color:#94a3b8}
.log{background:#080a10;border:1px solid rgba(255,255,255,.08);border-radius:12px;height:150px;overflow-y:auto;padding:10px 12px;font-family:Consolas,monospace;font-size:11.5px;line-height:1.55;color:#b6c2d2;margin:6px 0 12px}
.log .t{color:#38bdf8}.log .ok{color:#10b981}.log .err{color:#f87171}
.bar{height:8px;background:#1c2230;border-radius:99px;overflow:hidden;margin-bottom:14px}
.bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#e11d48,#f59e0b);transition:width .3s}
.btns{display:flex;gap:10px;justify-content:flex-end}
button{border:0;border-radius:9px;padding:9px 18px;font-size:13.5px;font-weight:700;cursor:pointer}
.primary{background:#e11d48;color:#fff}.primary:disabled{opacity:.5;cursor:default}
.ghost{background:transparent;color:#94a3b8;border:1px solid rgba(255,255,255,.15)}
.note{color:#64748b;font-size:11.5px;margin-top:10px;text-align:center}
</style></head><body><div class="wrap">
<div class="brand">Cine<span style="color:#e11d48">Pulse</span> Kurulum</div>
<div class="sub">Gerekli uygulamalar denetleniyor. Eksikler <b>otomatik kuruluyor</b>, bitince uygulama açılıyor.</div>
<div id="items"></div>
<div class="log" id="log"></div>
<div class="bar"><i id="bar"></i></div>
<div class="btns">
<button class="ghost" id="btnSkip">Atla ve Aç</button>
<button class="primary" id="btnRetry" disabled>Tekrar Dene</button>
</div>
<div class="note" id="note"></div>
</div><script>
const api = window.CinePulseDesktop;
const itemsEl = document.getElementById('items');
const logEl = document.getElementById('log');
const barEl = document.getElementById('bar');
const btnSkip = document.getElementById('btnSkip');
const btnRetry = document.getElementById('btnRetry');
const noteEl = document.getElementById('note');
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function logRaw(html, cls){const d=document.createElement('div');if(cls)d.className=cls;d.innerHTML=html;logEl.appendChild(d);logEl.scrollTop=logEl.scrollHeight;}
function renderItems(items){
  itemsEl.innerHTML = items.map(function(it){
    const st = it.state === 'ok' ? '<span class="st-ok">Hazır</span>'
      : it.state === 'working' ? '<span class="st-working">Kuruluyor…</span>'
      : it.state === 'error' ? '<span class="st-missing">Hata</span>'
      : it.state === 'skip' ? '<span class="st-skip">Atlandı</span>'
      : it.state === 'optional' ? '<span class="st-skip">İsteğe bağlı</span>'
      : '<span class="st-missing">Eksik</span>';
    return '<div class="item"><span class="dot ' + it.state + '"></span>' +
      '<div class="info"><div class="name">' + esc(it.label) + '</div>' +
      '<div class="desc">' + esc(it.detail || '') + '</div></div>' +
      '<div class="state">' + st + '</div></div>';
  }).join('');
}
if (api && api.setupOnProgress) {
  api.setupOnProgress(function (msg) {
    if (!msg) return;
    if (msg.type === 'status') renderItems(msg.items || []);
    else if (msg.type === 'log') logRaw(msg.html || esc(msg.line || ''));
    else if (msg.type === 'progress') barEl.style.width = Math.max(0, Math.min(100, msg.value || 0)) + '%';
    else if (msg.type === 'note') noteEl.textContent = msg.text || '';
    else if (msg.type === 'done') {
      btnRetry.disabled = false;
      barEl.style.width = '100%';
      if (msg.ok) { noteEl.textContent = 'Tamamlandı, uygulama açılıyor…'; }
      else { noteEl.textContent = 'Bazı kurulumlar tamamlanamadı. Tekrar deneyebilir ya da atlayabilirsin.'; }
    }
  });
}
btnSkip.onclick = function () { if (api && api.setupAction) api.setupAction('skip'); };
btnRetry.onclick = function () { btnRetry.disabled = true; if (api && api.setupAction) api.setupAction('install'); };
if (api && api.setupAction) { setTimeout(function () { api.setupAction('install'); }, 700); }
</script></body></html>`;

function setupSend(msg) {
  try {
    if (setupWin && !setupWin.isDestroyed()) setupWin.webContents.send('cinepulse:setup-progress', msg);
  } catch (_) {}
}

function setupItemsFromReq(req) {
  const items = [];
  items.push({
    id: 'python',
    label: 'Python 3',
    detail: req.python.ok ? req.python.version : 'HDFC / SetFilm / SezonlukDizi / SelcukFlix / Dizilla çözücüler için gerekli',
    state: req.python.ok ? 'ok' : 'missing'
  });
  items.push({
    id: 'crypto',
    label: 'Python cryptography paketi',
    detail: req.crypto.ok ? ('v' + req.crypto.version) : 'SelcukFlix ve Dizilla şifre çözümü için gerekli',
    state: req.crypto.ok ? 'ok' : 'missing'
  });
  items.push({
    id: 'ffmpeg',
    label: 'FFmpeg (isteğe bağlı)',
    detail: req.ffmpeg.ok ? req.ffmpeg.version : 'Yalnızca MKV dönüştürme için; yokluğu engel değil',
    state: req.ffmpeg.ok ? 'ok' : 'optional'
  });
  return items;
}

async function installPythonWindows() {
  // Wine usually has no AppX winget alias. Check before invoking it.
  const available = await runBin('cmd.exe', ['/d', '/s', '/c', 'where winget'], { timeout: 3000 });
  if (available.ok) {
    setupSend({ type: 'log', line: '[python] winget deneniyor (en fazla 45 saniye)…' });
    const wing = await runBin('cmd.exe', ['/d', '/s', '/c', 'winget install -e --id Python.Python.3.12 --silent --accept-package-agreements --accept-source-agreements'], { timeout: 45000 });
    setupSend({ type: 'log', line: `[python] winget: ${wing.ok ? 'tamamlandı' : 'başarısız; doğrudan kurucuya geçiliyor'}` });
  } else {
    setupSend({ type: 'log', line: '[python] winget yok; python.org kurucusuna geçiliyor.' });
  }
  let probe = await probePython();
  if (probe.ok) {
    rememberPythonBin(probe.bin);
    setupSend({ type: 'log', html: '<span class="ok">[python]</span> ' + probe.version });
    return true;
  }
  // 2) yedek: python.org kurucusu, sessiz, kullaniciya ozel + PATH
  try {
    const url = 'https://www.python.org/ftp/python/3.12.8/python-3.12.8-amd64.exe';
    const dest = path.join(os.tmpdir(), 'cinepulse-python-setup.exe');
    setupSend({ type: 'log', line: '[python] python.org kurucusu indiriliyor… (bu biraz sürebilir)' });
    const dl = await downloadFile(url, dest, 600000);
    if (!dl.ok) {
      setupSend({ type: 'log', html: '<span class="err">[python]</span> indirilemedi: ' + dl.err });
      return false;
    }
    setupSend({ type: 'log', line: '[python] sessiz kurulum çalışıyor…' });
    await runBin(dest, ['/quiet', 'InstallAllUsers=0', 'PrependPath=1', 'Include_pip=1'], { timeout: 600000 });
    try { fs.unlinkSync(dest); } catch (_) {}
  } catch (e) {
    setupSend({ type: 'log', html: '<span class="err">[python]</span> ' + String((e && e.message) || e) });
    return false;
  }
  probe = await probePython();
  if (probe.ok) {
    rememberPythonBin(probe.bin);
    setupSend({ type: 'log', html: '<span class="ok">[python]</span> ' + probe.version });
    return true;
  }
  setupSend({ type: 'log', html: '<span class="err">[python]</span> kuruldu ama bulunamadı; bilgisayarı yeniden başlatıp tekrar dene.' });
  return false;
}

async function installPythonLinux() {
  const pm = linuxPkgManager();
  if (!pm) {
    setupSend({ type: 'log', html: '<span class="err">[python]</span> paket yöneticisi bulunamadı; lütfen python3 paketini el ile kur.' });
    return false;
  }
  if (!(await pkexecAvailable())) {
    setupSend({ type: 'log', html: '<span class="err">[python]</span> pkexec yok; uçbirimde şunu çalıştır: <b>' + pm.bin + ' ' + pm.args.join(' ') + ' python3</b>' });
    return false;
  }
  setupSend({ type: 'log', line: `[python] yönetici izni isteniyor (${pm.bin})…` });
  const r = await runBin('pkexec', [pm.bin, ...pm.args, 'python3'], { timeout: 600000 });
  const probe = await probePython();
  if (probe.ok) {
    rememberPythonBin(probe.bin);
    setupSend({ type: 'log', html: '<span class="ok">[python]</span> ' + probe.version });
    return true;
  }
  setupSend({ type: 'log', html: '<span class="err">[python]</span> ' + (r.err || 'kurulum başarısız') });
  return false;
}

async function installCrypto(pyBin) {
  setupSend({ type: 'log', line: '[cryptography] pip denetleniyor…' });
  let pip = await runBin(pyBin, ['-m', 'pip', '--version'], { timeout: 30000 });
  if (!pip.ok) {
    setupSend({ type: 'log', line: '[cryptography] ensurepip çalışıyor…' });
    await runBin(pyBin, ['-m', 'ensurepip', '--upgrade'], { timeout: 120000 });
    pip = await runBin(pyBin, ['-m', 'pip', '--version'], { timeout: 30000 });
  }
  if (!pip.ok) {
    setupSend({ type: 'log', html: '<span class="err">[cryptography]</span> pip yok; cryptography kurulamadı.' });
    return false;
  }
  setupSend({ type: 'log', line: '[cryptography] indirilip kuruluyor… (ilk seferde sürebilir)' });
  let inst = await runBin(pyBin, ['-m', 'pip', 'install', '--disable-pip-version-check', 'cryptography'], { timeout: 300000 });
  if (!inst.ok) {
    setupSend({ type: 'log', line: '[cryptography] kullanıcı dizinine deneniyor…' });
    inst = await runBin(pyBin, ['-m', 'pip', 'install', '--user', '--disable-pip-version-check', 'cryptography'], { timeout: 300000 });
  }
  const probe = await probeCrypto(pyBin);
  setupSend({ type: 'log', html: probe.ok ? `<span class="ok">[cryptography]</span> v${probe.version}` : '<span class="err">[cryptography]</span> kurulamadı.' });
  return probe.ok;
}

async function installFfmpegBestEffort() {
  try {
    if (process.platform === 'win32') {
      const available = await runBin('cmd.exe', ['/d', '/s', '/c', 'where winget'], { timeout: 3000 });
      if (!available.ok) return false;
      const r = await runBin('cmd.exe', ['/d', '/s', '/c', 'winget install -e --id Gyan.FFmpeg --silent --accept-package-agreements --accept-source-agreements'], { timeout: 45000 });
      return r.ok;
    }
    const pm = linuxPkgManager();
    if (pm && (await pkexecAvailable())) {
      const r = await runBin('pkexec', [pm.bin, ...pm.args, 'ffmpeg'], { timeout: 600000 });
      return r.ok;
    }
  } catch (_) {}
  return false;
}

async function runSetupInstall() {
  setupSend({ type: 'progress', value: 5 });
  let req = await checkRequirements();
  setupSend({ type: 'status', items: setupItemsFromReq(req) });
  const needPython = !req.python.ok;
  const needCrypto = !req.crypto.ok;
  const needFfmpeg = !req.ffmpeg.ok;

  if (!needPython && !needCrypto && !needFfmpeg) {
    setupSend({ type: 'done', ok: true });
    setTimeout(() => finishSetup(true), 600);
    return;
  }

  const markWorking = (id) => {
    req = { ...req };
    setupSend({
      type: 'status',
      items: setupItemsFromReq({
        python: needPython && id === 'python' ? { ok: false, version: '' } : req.python,
        crypto: needCrypto && id === 'crypto' ? { ok: false, version: '' } : req.crypto,
        ffmpeg: needFfmpeg && id === 'ffmpeg' ? { ok: false, version: '' } : req.ffmpeg
      }).map((it) => (it.id === id && it.state === 'missing' ? { ...it, state: 'working', detail: 'Otomatik kuruluyor…' } : it))
    });
  };

  if (needPython) {
    markWorking('python');
    const ok = process.platform === 'win32' ? await installPythonWindows() : await installPythonLinux();
    setupSend({ type: 'progress', value: 40 });
    if (!ok) {
      setupSend({ type: 'done', ok: false });
      return;
    }
  }
  if (needCrypto || needPython) {
    const probe = await probePython();
    const pyBin = probe.ok ? probe.bin : resolvePythonBin();
    if (probe.ok) rememberPythonBin(pyBin);
    markWorking('crypto');
    const ok = probe.ok ? await installCrypto(pyBin) : false;
    setupSend({ type: 'progress', value: 75 });
    if (!ok) {
      setupSend({ type: 'done', ok: false });
      return;
    }
  }
  if (needFfmpeg) {
    markWorking('ffmpeg');
    const ok = await installFfmpegBestEffort();
    setupSend({ type: 'log', line: ok ? '[ffmpeg] kuruldu.' : '[ffmpeg] atlandı (isteğe bağlı).' });
    setupSend({ type: 'progress', value: 90 });
  }

  req = await checkRequirements();
  setupSend({ type: 'status', items: setupItemsFromReq(req) });
  setupSend({ type: 'progress', value: 100 });
  const ok = req.python.ok && req.crypto.ok;
  setupSend({ type: 'done', ok });
  setTimeout(() => finishSetup(ok), ok ? 900 : 400);
}

function finishSetup(ok) {
  try {
    if (setupWin && !setupWin.isDestroyed()) setupWin.close();
  } catch (_) {}
  setupWin = null;
  if (setupResolve) {
    const r = setupResolve;
    setupResolve = null;
    r(ok ? 'ready' : 'failed');
  }
}

function openSetupWindow() {
  return new Promise((resolve) => {
    setupResolve = resolve;
    setupWin = new BrowserWindow({
      width: 560,
      height: 660,
      resizable: false,
      minimizable: false,
      maximizable: false,
      autoHideMenuBar: true,
      backgroundColor: '#0d0f17',
      show: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.cjs'),
        contextIsolation: true,
        nodeIntegration: false
      }
    });
    setupWin.once('ready-to-show', () => {
      try {
        if (!setupWin.isDestroyed()) setupWin.show();
      } catch (_) {}
    });
    setupWin.on('closed', () => {
      setupWin = null;
      if (setupResolve) {
        const r = setupResolve;
        setupResolve = null;
        r('skip');
      }
    });
    setupWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(SETUP_HTML)}`);
  });
}

/* ---- Gizli WebView: Cloudflare challenge + cookie cozucu ---- */
function ensureGhost() {
  if (ghostWin && !ghostWin.isDestroyed()) return ghostWin;
  ghostWin = new BrowserWindow({
    show: false,
    width: 1280,
    height: 800,
    webPreferences: {
      // Ana pencereyle ayni session: cozulen cookie tum uygulamaya yarar.
      partition: 'persist:cinepulse',
      images: false,
      javascript: true
    }
  });
  ghostWin.webContents.setUserAgent(REAL_UA);
  // Medya yukunu engelle: sadece HTML + challenge JS'i calissin.
  ghostWin.webContents.session.webRequest.onBeforeRequest((details, cb) => {
    if (details.webContentsId !== ghostWin.webContents.id) return cb({});
    const u = (details.url || '').toLowerCase();
    if (/\.(mp4|m3u8|mpd|ts|webm|vtt)(\?|$)/.test(u) || details.resourceType === 'media') {
      return cb({ cancel: true });
    }
    cb({});
  });
  return ghostWin;
}

function isChallengeHtml(title, html) {
  const t = (title || '').toLowerCase();
  const h = (html || '').toLowerCase().slice(0, 4000);
  return (
    t.includes('just a moment') ||
    t.includes('cloudflare') ||
    h.includes('cf-challenge') ||
    (h.includes('challenge-platform') && !h.includes('cf_clearance')) ||
    h.includes('verifying you are human')
  );
}

async function ghostResolve(targetUrl, { timeout = 30000, waitAfterLoad = 2500 } = {}) {
  const win = ensureGhost();
  await win.webContents.loadURL(targetUrl, { userAgent: REAL_UA });
  const deadline = Date.now() + timeout;
  let html = '';
  // Challenge cozumu icin bekle: sayfa basligi normallesene kadar yokla.
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 1500));
    try {
      const state = await win.webContents.executeJavaScript(
        `({ t: document.title || '', h: document.documentElement ? document.documentElement.outerHTML.slice(0, 6000) : '' })`,
        true
      );
      html = state.h || '';
      if (!isChallengeHtml(state.t, html)) break;
    } catch (_) {
      break;
    }
  }
  await new Promise((r) => setTimeout(r, waitAfterLoad));
  try {
    html = await win.webContents.executeJavaScript(
      `document.documentElement ? document.documentElement.outerHTML : ''`,
      true
    );
  } catch (_) {}
  const cookies = await win.webContents.session.cookies
    .get({ url: targetUrl })
    .catch(() => []);
  return {
    ok: true,
    url: win.webContents.getURL(),
    html: html || '',
    cookies: cookies.map((c) => ({ name: c.name, value: c.value, domain: c.domain }))
  };
}

ipcMain.handle('cinepulse:ghost-resolve', async (_e, url, opts) => {
  try {
    if (!url || !/^https?:\/\//i.test(url)) return { ok: false, error: 'bad-url' };
    return await ghostResolve(url, opts || {});
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err).slice(0, 200) };
  }
});

// Kalici magaza IPC (ayarlar + eklenti ac/kapa durumlari).
ipcMain.handle('cinepulse:store-get', (_e, key, fallback = null) => {
  try {
    return store ? store.get(key, fallback) : fallback;
  } catch (_) {
    return fallback;
  }
});
ipcMain.handle('cinepulse:store-set', (_e, key, value) => {
  try {
    if (store) store.set(key, value);
    return true;
  } catch (_) {
    return false;
  }
});

// Sistem tanılaması & gereksinim kontrolü (Kurulum Sihirbazı için)
ipcMain.handle('cinepulse:get-system-info', async () => {
  const bin = resolvePythonBin();
  let pyVersion = '';
  let pyOk = false;
  try {
    const stdout = await new Promise((resolve, reject) => {
      execFile(bin, ['--version'], { timeout: 6000 }, (err, out, errOut) => {
        if (err) return reject(err);
        resolve(String(out || errOut || '').trim());
      });
    });
    pyVersion = stdout;
    pyOk = true;
  } catch (_) {
    pyOk = false;
  }
  const sidecarOk = await sidecarAlive();
  return {
    platform: process.platform,
    arch: process.arch,
    python: { available: pyOk, bin, version: pyVersion },
    sidecar: { alive: sidecarOk, url: SIDECAR_URL, port: SIDECAR_PORT },
    electronVersion: process.versions.electron,
    chromeVersion: process.versions.chrome
  };
});

/* ---- Masaüstü otomatik güncelleme (kendi manifestini okur, APK'nınkiyle ezilmez) ---- */
const DESKTOP_UPDATE_URL = 'https://github.com/caca1403/cine-pulse/releases/latest/download/desktop-version.json';
let desktopUpdateBusy = false;

function localVersionCode() {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(appRoot(), 'package.json'), 'utf-8'));
    const c = Number(pkg.versionCode || 0);
    if (c > 0) return c;
  } catch (_) {}
  const m = /(\d+)\.(\d+)\.(\d+)/.exec(app.getVersion() || '');
  if (m) return Number(m[1]) * 10000 + Number(m[2]) * 100 + Number(m[3]);
  return 0;
}

function fetchRemoteManifest() {
  return fetchUpdateManifest(`${DESKTOP_UPDATE_URL}?_t=${Date.now()}`);
}

// ---- DEB kurulum yardımcıları (polkit'e bağımlı olmayan akış) ----------
const TERMINAL_CANDIDATES = [
  { bin: 'gnome-terminal', args: (cmd) => ['--', 'bash', '-lc', cmd] },
  { bin: 'konsole', args: (cmd) => ['-e', 'bash', '-lc', cmd] },
  { bin: 'xfce4-terminal', args: (cmd) => ['--command', `bash -lc ${JSON.stringify(cmd)}`] },
  { bin: 'mate-terminal', args: (cmd) => ['--execute', 'bash', '-lc', cmd] },
  { bin: 'lxterminal', args: (cmd) => ['-e', `bash -lc ${JSON.stringify(cmd)}`] },
  { bin: 'x-terminal-emulator', args: (cmd) => ['-e', 'bash', '-lc', cmd] },
  { bin: 'xterm', args: (cmd) => ['-e', 'bash', '-lc', cmd] }
];

// Gerçek bir terminal aç ve komutu onun içinde çalıştır. sudo burada kendi
// TTY'sinde sorar → polkit/pkexec'in masaüstünden açılan diyaloğuna takılmaz.
async function openTerminalWithCommand(cmd) {
  for (const t of TERMINAL_CANDIDATES) {
    const found = await runBin('which', [t.bin], { timeout: 3000 });
    if (!found.ok) continue;
    try {
      const child = spawn(t.bin, t.args(cmd), { detached: true, stdio: 'ignore' });
      child.on('error', () => {});
      child.unref();
      return true;
    } catch (_) {}
  }
  return false;
}

function debInstallCommand(dest) {
  return `sudo dpkg -i ${JSON.stringify(dest)} || sudo apt-get install -f -y`;
}

// Çalışan uygulama kendi paketinin dosyalarının üstünde olduğu için dpkg
// "text file busy" verebilir. Kurulumu uygulama kapandıktan sonraya planla.
function scheduleDebInstallAfterQuit(dest) {
  const sh = `sleep 3; ${debInstallCommand(dest)}; read -n1 -s -r -p $'\\nKurulum bitti. Enter... '`;
  const spawned = spawn('sh', ['-c', sh], { detached: true, stdio: 'ignore' });
  spawned.on('error', () => {});
  spawned.unref();
}

async function installDebPackage(dest, installedVersion = '') {
  // app.getVersion() CALISAN surumu verir; kullaniciya gosterilecek olan
  // KURULAN yeni surumdur (aksi halde "1.1.59 kuruldu" yazardi).
  const newVersionLabel = installedVersion ? `v${installedVersion}` : '';
  const fail = async (state, extra) => {
    if (mainWin && !mainWin.isDestroyed()) {
      await dialog.showMessageBox(mainWin, {
        type: 'info',
        title: 'Güncelleme kurulmadı',
        message: `CinePulse v${app.getVersion()} paketi indirildi:\n${dest}`,
        detail: extra || `Elle kurulum:\n  ${debInstallCommand(dest)}`,
        buttons: ['Uçbirimde Kur', 'Kapat']
      }).then(async (r) => {
        if (r && r.response === 0 && await openTerminalWithCommand(debInstallCommand(dest))) {
          isQuitting = true;
          try { if (sidecarProc) sidecarProc.kill(); } catch (_) {}
          app.quit();
        }
      });
    }
    return { ok: false, state };
  };

  // 1) pkexec + polkit (klasik yol). -f ile bağımlılık hatalarını da geç.
  if (await pkexecAvailable()) {
    const r = await runBin('pkexec', ['dpkg', '-i', '-f', dest], { timeout: 600000 });
    if (r.ok) {
      // Kurulum bitti ama calisan surecler ESKI kod. Kullaniciya tek tikla
      // yeniden baslatma sunuyoruz (eski surumde sadece "yeniden baslatin"
      // yaziyordu, kullanici ne yapacagini bilmiyordu).
      let restartNow = false;
      if (mainWin && !mainWin.isDestroyed()) {
        const res = await dialog.showMessageBox(mainWin, {
          type: 'info',
          title: 'Kuruldu',
          message: newVersionLabel ? `CinePulse ${newVersionLabel} kuruldu.` : `CinePulse ${ver} kuruldu.`,
          detail: 'Yeni sürümün tamamı için uygulama yeniden başlatılmalı.',
          buttons: ['Şimdi Yeniden Başlat', 'Sonra'],
          defaultId: 0,
          cancelId: 1
        });
        restartNow = !!(res && res.response === 0);
      }
      if (restartNow) {
        isQuitting = true;
        try { if (sidecarProc) sidecarProc.kill(); } catch (_) {}
        app.relaunch();
        app.quit();
      }
      return { ok: true, state: 'installed' };
    }
    logSidecar(`pkexec dpkg failed: ${(r.err || '').slice(0, 300)}`);
  }

  // 2) Polkit çalışmıyorsa doğrudan sudo (kullanıcı zaten sudo isteyebiliyorsa).
  const sudoable = await runBin('sudo', ['-n', 'true'], { timeout: 5000 });
  if (sudoable.ok) {
    scheduleDebInstallAfterQuit(dest);
    if (mainWin && !mainWin.isDestroyed()) {
      await dialog.showMessageBox(mainWin, {
        type: 'info',
        title: 'Kuruluyor',
        message: 'CinePulse güncelleniyor…',
        detail: 'Uygulama kapanıp yeni sürüm kurulacak. Açılınca yeniden aç.'
      });
    }
    isQuitting = true;
    try { if (sidecarProc) sidecarProc.kill(); } catch (_) {}
    app.quit();
    return { ok: true, state: 'installing' };
  }

  // 3) Terminal aç, kullanıcı orada şifrelesin (her zaman çalışır).
  const opened = await openTerminalWithCommand(debInstallCommand(dest));
  if (opened) {
    if (mainWin && !mainWin.isDestroyed()) {
      await dialog.showMessageBox(mainWin, {
        type: 'info',
        title: 'Kuruluyor',
        message: 'Terminal açıldı.',
        detail: 'Yeni sürümü kurmak için terminaldeki komutu onayla, sonra uygulamayı yeniden başlat.'
      });
    }
    return { ok: true, state: 'installing' };
  }

  return fail('downloaded');
}

async function checkDesktopUpdate({ manual = false } = {}) {
  if (desktopUpdateBusy) return { ok: false, state: 'busy' };
  desktopUpdateBusy = true;
  try {
    const manifest = await fetchRemoteManifest();
    if (!manifest || !Number(manifest.versionCode)) {
      if (manual && mainWin && !mainWin.isDestroyed()) {
        dialog.showMessageBox(mainWin, { type: 'warning', title: 'Güncelleme', message: 'Sürüm bilgisi alınamadı. İnternet bağlantını denetle.' });
      }
      return { ok: false, state: 'fetch-failed' };
    }
    const remote = Number(manifest.versionCode);
    const local = localVersionCode();
    if (!(remote > local)) {
      if (manual && mainWin && !mainWin.isDestroyed()) {
        dialog.showMessageBox(mainWin, { type: 'info', title: 'Güncelleme', message: `CinePulse güncel (v${app.getVersion()}).` });
      }
      return { ok: true, state: 'up-to-date' };
    }
    const notes = String(manifest.releaseNotes || '').slice(0, 900);
    const platformUrl = process.platform === 'win32'
      ? (manifest.windowsSetupUrl || '')
      : (process.env.APPIMAGE ? (manifest.linuxAppImageUrl || '') : (manifest.linuxDebUrl || ''));
    const ver = manifest.version || String(remote);
    if (!platformUrl) {
      if (manual && mainWin && !mainWin.isDestroyed()) {
        dialog.showMessageBox(mainWin, { type: 'info', title: 'Yeni Sürüm', message: `Yeni sürüm bulundu: v${ver}\n\n${notes}\n\nBu platform için indirme adresi tanımlı değil.` });
      }
      return { ok: false, state: 'no-asset' };
    }
    // Otomatik kontroller (acilis + 20sn sonra) MODAL SORMAZ. Kullanici
    // uygulamayi ilk kez aciyor, kurulum sihirbazinda ya da izlemedeyken
    // karsisina "Yeni Surum Mevcut" penceresi hic cikmamali (onceki surumde
    // oldugu gibi sihirbazin uzerine biniyordu). Otomatik kontrolde yalnizca
    // bilgi birakilir; kullanici menu uzerinden "Guncelleme kontrol et" ile
    // sorar, o zaman sorulur.
    let choice = 0;
    if (manual && mainWin && !mainWin.isDestroyed()) {
      const r = await dialog.showMessageBox(mainWin, {
        type: 'question',
        title: 'Yeni Sürüm Mevcut',
        message: `CinePulse v${ver} yayında (kurulu: v${app.getVersion()}).`,
        detail: notes ? `Yenilikler:\n${notes}` : undefined,
        buttons: ['İndir ve Kur', 'Sonra'],
        defaultId: 0,
        cancelId: 1
      });
      choice = r.response;
    }
    if (!manual) {
      logSidecar(`update available v${ver} (auto-check, no prompt)`);
      return { ok: false, state: 'available', version: ver, releaseNotes: notes };
    }
    if (choice !== 0) return { ok: true, state: 'postponed' };
    const fname = platformUrl.split('/').pop().split('?')[0] || (process.platform === 'win32' ? 'CinePulse-Setup.exe' : 'CinePulse-update.bin');
    const dest = path.join(os.tmpdir(), fname);
    try { fs.unlinkSync(dest); } catch (_) {}
    const dl = await downloadFile(platformUrl, dest, 900000);
    if (!dl.ok) {
      if (mainWin && !mainWin.isDestroyed()) {
        dialog.showMessageBox(mainWin, { type: 'error', title: 'İndirme Başarısız', message: `Kurulum dosyası indirilemedi (${dl.err || 'ağ hatası'}).` });
      }
      return { ok: false, state: 'download-failed' };
    }
    if (process.platform === 'win32') {
      // Geleneksel kurulum: uygulamayi kapat, kurucuyu one cikar.
      try {
        const child = spawn(dest, [], { detached: true, stdio: 'ignore', windowsHide: false });
        child.unref();
      } catch (_) {}
      isQuitting = true;
      try { if (sidecarProc) sidecarProc.kill(); } catch (_) {}
      app.quit();
      return { ok: true, state: 'installing' };
    }
    if (process.env.APPIMAGE) {
      try { fs.chmodSync(dest, 0o755); } catch (_) {}
      if (mainWin && !mainWin.isDestroyed()) {
        dialog.showMessageBox(mainWin, { type: 'info', title: 'İndirildi', message: `Yeni AppImage indirildi:\n${dest}\n\nEskisinin yerine koyup yeniden başlat.` });
      }
      try { if (process.platform === 'linux') spawn('xdg-open', [path.dirname(dest)], { detached: true, stdio: 'ignore' }).unref(); } catch (_) {}
      return { ok: true, state: 'downloaded' };
    }
    // DEB kurulumu.
    // Sorun: pkexec polkit diyalogunu masaüstünden açınca GNOME/masaüstü
    // ortamında "Request dismissed" ile düşüyor (parola kutusu hiç açılmıyor
    // ya da kullanıcı kapatıyor) ve kullanıcı ham hata mesajını görüyordu.
    // Kalıcı çözüm: 3 kademeli akış — dpkg'yi -f (force) ile dene, olmazsa
    // gerçek bir terminal aç (sudo kendi TTY'sinde çalışır, polkit'e takılmaz),
    // o da yoksa kullanıcıya tek satır komut ver. Hepsi başarısızsa hata
    // değil bilgilendirme gösterilir.
    const inst = await installDebPackage(dest, ver);
    return inst;
  } finally {
    desktopUpdateBusy = false;
  }
}

ipcMain.handle('cinepulse:check-desktop-update', async (_e, manual) => {
  try {
    return await checkDesktopUpdate({ manual: manual !== false });
  } catch (_) {
    return { ok: false, state: 'error' };
  }
});

function scheduleDesktopUpdateCheck() {
  setTimeout(() => {
    if (isQuitting) return;
    checkDesktopUpdate({ manual: false }).catch(() => {});
  }, 20000);
}

ipcMain.handle('cinepulse:restart-sidecar', async () => {
  try {
    if (sidecarProc) {
      sidecarProc.kill();
      sidecarProc = null;
    }
  } catch (_) {}
  startSidecar();
  const up = await waitForSidecar(15);
  return { ok: up };
});

// Kurulum penceresi eylemleri: install (otomatik kur), skip (atla ve ac).
ipcMain.handle('cinepulse:setup-action', async (_e, action) => {
  try {
    if (action === 'install') {
      runSetupInstall().catch(() => {
        setupSend({ type: 'done', ok: false });
      });
      return { ok: true };
    }
    if (action === 'skip') {
      finishSetup(false);
      return { ok: true };
    }
  } catch (_) {}
  return { ok: false };
});

function createSplash() {
  splashWin = new BrowserWindow({
    width: 420,
    height: 300,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: { nodeIntegration: false, contextIsolation: true }
  });
  splashWin.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(`
      <body style="margin:0;background:#0d0f17;color:#fff;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;border-radius:16px;">
        <div style="font-size:28px;font-weight:800;">Cine<span style="color:#e11d48;">Pulse</span></div>
        <div style="margin-top:12px;font-size:13px;opacity:.7;">Yerel servis baslatiliyor…</div>
      </body>`)}`
  );
}

function createMainWindow() {
  const saved = store ? store.get('window', null) : null;
  mainWin = new BrowserWindow({
    width: (saved && saved.width) || 1366,
    height: (saved && saved.height) || 850,
    x: saved && saved.x,
    y: saved && saved.y,
    minWidth: 1024,
    minHeight: 640,
    autoHideMenuBar: true,
    backgroundColor: '#0d0f17',
    show: false,
    webPreferences: {
      partition: 'persist:cinepulse',
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  if (saved && saved.maximized) mainWin.maximize();
  // Keep Chromium's actual OS/version for interactive provider verification.
  mainWin.webContents.setUserAgent(mainWin.webContents.getUserAgent().replace(/\sElectron\/[^\s]+/g, '').replace(/\sCinePulse[^\s]*\/[^\s]+/gi, ''));
  installPlayerFrameLayout(mainWin.webContents, webFrameMain);

  // Pencere durumunu hatirla (Nuvio tarzi).
  const persistWindow = () => {
    try {
      if (!mainWin || mainWin.isDestroyed() || !store) return;
      const b = mainWin.getBounds();
      store.set('window', { ...b, maximized: mainWin.isMaximized() });
    } catch (_) {}
  };
  mainWin.on('close', persistWindow);

  const devUrl = process.env.ELEC_START_URL || '';
  if (devUrl) {
    mainWin.loadURL(devUrl);
  } else {
    const indexHtml = path.join(appRoot(), 'dist', 'index.html');
    if (!fs.existsSync(indexHtml)) {
      dialog.showErrorBox(
        'CinePulse',
        `dist/index.html bulunamadi.\n\nOnce "npm run build" calistirin, sonra uygulamayi paketleyin.`
      );
    }
    mainWin.loadFile(indexHtml, { query: { desktopApp: '1' } });
  }
  mainWin.once('ready-to-show', () => {
    try {
      if (splashWin && !splashWin.isDestroyed()) splashWin.close();
    } catch (_) {}
    splashWin = null;
    mainWin.show();
  });
  // Renderer cokerse gri ekranda kalma: sebebini goster ve logla.
  mainWin.webContents.on('render-process-gone', (_e, details) => {
    const reason = `${(details && details.reason) || 'unknown'}`;
    logSidecar(`renderer gone: ${reason}`);
    if (!isQuitting && mainWin && !mainWin.isDestroyed()) {
      dialog.showErrorBox(
        'CinePulse Arayuzu Coktu',
        `Arayuz islemi kapandi (sebep: ${reason}). Pencere yeniden yukleniyor.`
      );
      try {
        mainWin.reload();
      } catch (_) {}
    }
  });
  mainWin.on('closed', () => {
    verificationPlayer.close();
    mainWin = null;
  });
}

app.whenReady().then(async () => {
  app.setAppUserModelId('com.cinepulse.studio');
  store = createStore(app.getPath('userData'));
  createSplash();
  // Ilk acilis denetimi: eksik varsa geleneksel kurulum sayfasi acilir,
  // otomatik kurulum bitince (veya atlaninca) normal acilisa devam edilir.
  let skippedSetup = false;
  try {
    const req = await checkRequirements();
    if (!(req.python.ok && req.crypto.ok)) {
      const decision = await openSetupWindow();
      if (decision !== 'ready') skippedSetup = true;
    }
  } catch (_) {}
  if (!(await sidecarAlive())) startSidecar();
  let up = await waitForSidecar();
  if (!up) {
    // Otomatik onarim: zombie temizle + bir kez daha dene, kullaniciya sorma.
    logSidecar('sidecar ilk denemede ayaga kalkmadi, otomatik temizlik deneniyor');
    try { await tryFreeStalePort(); } catch (_) {}
    if (!(await sidecarAlive())) {
      try { if (sidecarProc) { sidecarProc.kill(); sidecarProc = null; } } catch (_) {}
      startSidecar();
    }
    up = await waitForSidecar(20);
  }
  if (!up) {
    try {
      if (splashWin && !splashWin.isDestroyed()) splashWin.close();
    } catch (_) {}
    splashWin = null;
    dialog.showErrorBox(
      'CinePulse Servis Baslatilamadi',
      `Yerel medya servisi (127.0.0.1:4000) acilamadi. Otomatik onarim denendi ama port hala kapali.\n\nCozum: uygulamayi kapatip tek kopya acin. Detay: ${sidecarLogPath()}`
    );
  }
  createMainWindow();
  if (skippedSetup && mainWin && !mainWin.isDestroyed()) {
    dialog.showMessageBox(mainWin, {
      type: 'warning',
      title: 'Eksik Bilesen',
      message:
        `Bazi bilesenler kurulmadan devam ediliyor (${resolvePythonBin()}). HDFC / SetFilm / SezonlukDizi / SelcukFlix / Dizilla cozuculer calismayabilir.`
    });
  }
  // APK'daki gibi otomatik guncelleme denetimi (sessiz; varsa sorar).
  scheduleDesktopUpdateCheck();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('second-instance', () => {
  try {
    if (mainWin && !mainWin.isDestroyed()) {
      if (mainWin.isMinimized()) mainWin.restore();
      mainWin.focus();
    }
  } catch (_) {}
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  isQuitting = true;
  verificationPlayer.close();
  try {
    if (ghostWin && !ghostWin.isDestroyed()) ghostWin.destroy();
  } catch (_) {}
  try {
    if (sidecarProc) sidecarProc.kill();
  } catch (_) {}
  try {
    if (sidecarLogFd) fs.closeSync(sidecarLogFd);
  } catch (_) {}
});
