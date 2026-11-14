
const { app, BrowserWindow } = require('electron');
const hedef = process.env.CP_E2E_URL || 'http://127.0.0.1:4173/';
app.commandLine.appendSwitch('remote-debugging-port', process.env.CP_E2E_PORT || '9333');
app.commandLine.appendSwitch('remote-allow-origins', '*');
app.disableHardwareAcceleration();
app.whenReady().then(() => {
  const w = new BrowserWindow({
    width: 1400, height: 900, show: false,
    webPreferences: { nodeIntegration: false, contextIsolation: true, webSecurity: false },
  });
  w.loadURL(hedef);
  w.webContents.on('did-finish-load', () => console.log('E2E-SAYFA-YUKLENDI'));
});
app.on('window-all-closed', () => app.quit());
