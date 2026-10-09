// Presentation only: keep the source page's verification and click handlers intact.
// A sandboxed preload runs before page scripts and the first document paint.
const { webFrame } = require('electron');
const prefix = '--cinepulse-player-css=';
const argument = process.argv.find(value => value.startsWith(prefix));
if (argument && location.protocol === 'https:' && location.hostname === 'sezonlukdizi.cc') {
  webFrame.insertCSS(Buffer.from(argument.slice(prefix.length), 'base64').toString('utf8'));
}
