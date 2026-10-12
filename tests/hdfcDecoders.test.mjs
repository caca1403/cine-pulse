/* Orion (HDFC) çözücüleri — Patron referansıyla birebir karşılaştırma.
   Referans: /tmp/opencode/patron-ref.cjs (patr0nq/nuvioaddons). */
import { be, b64Kaydir, packerCoz, dnCoz, gnCoz, beCoz, altyazilariAl } from '../src/services/hdfcDecoders.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let ref = null;
try { ref = require('/tmp/opencode/patron-ref.cjs').__ic; } catch (_) {}

let gecen = 0, kalan = 0;
function kontrol(ad, kosul, ek = '') {
  if (kosul) { gecen++; console.log(`  ✓ ${ad}`); }
  else { kalan++; console.log(`  ✗ ${ad} ${ek}`); }
}

// 1) base64 kaydırıcı: referansla rastgele girdiler
if (ref) {
  const ornekler = [
    'aHR0cHM6Ly9vci5jb20vbWFzdGVyLm0zdTg=',
    'QUJDRA',
    'eHl6===',
    'aGVsbG8td29ybGQ_',
    'aGVs bG8=',
    '',
    '!!!!not base64!!!!'
  ];
  let ayni = true, ilkFark = '';
  for (const o of ornekler) {
    const a = b64Kaydir(o), b = ref.C0(o);
    if (a !== b) { ayni = false; ilkFark = `${JSON.stringify(o)} → ben:${JSON.stringify(a)} ref:${JSON.stringify(b)}`; break; }
  }
  kontrol('b64Kaydir ≡ Patron C0', ayni, ilkFark);
}

// 2) packer: bilinen bir paketlenmiş blok
const packed = `eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c])}}return p}('0:\"1\"',2,2,'file|https://a.b/master.m3u8'.split('|'),0,{}))`;
const pc = packerCoz(packed);
kontrol('packerCoz paket çözer', /master\.m3u8/.test(pc || ''), `→ ${pc}`);
if (ref) kontrol('packerCoz ≡ Patron fn', packerCoz(packed) === ref.fn(packed));

// 3) be(): doğrudan m3u8
kontrol('be doğrudan m3u8 bulur',
  be('<script>var x="https://cdn.example.com/hls/master.m3u8";</script>') === 'https://cdn.example.com/hls/master.m3u8');
kontrol('be master.txt → master.m3u8',
  be('<script>var x="https://cdn.example.com/txt/master.txt";</script>') === 'https://cdn.example.com/master.m3u8');
kontrol('be playmix.uno reddeder', be('<script>var x="https://playmix.uno/master.m3u8";</script>') === null);
kontrol('be boş girdi', be('') === null);

// 4) altyazı çıkarma
const tracks = `tracks:[{"file":"\\/sub/tr.vtt","label":"Türkçe"},{"file":"https://c.d/en.vtt","label":"English"},{"file":"/x/get_slides.jpg","label":"thumbs"}]`;
const al = altyazilariAl(tracks, 'https://hdfc.example');
kontrol('altyazı: 2 geçerli, thumbs elendi', al.length === 2, `→ ${al.length}`);
kontrol('altyazı: Türkçe dili tr', al[0]?.language === 'tr');
kontrol('altyazı: göreli yol mutlaklaşır', al[0]?.url === 'https://hdfc.example/sub/tr.vtt', al[0]?.url);
kontrol('altyazı: Referer origin', al[1]?.headers?.Referer === 'https://c.d/');

// 5) referans yoksa bilgi ver
console.log(ref ? '' : '\n  ! Patron referansı yok — yalnızca yerel testler koştu.');

console.log(`\n${kalan === 0 ? 'TAMAM' : 'HATA'} — geçen: ${gecen}, kalan: ${kalan}`);
process.exit(kalan === 0 ? 0 : 1);
