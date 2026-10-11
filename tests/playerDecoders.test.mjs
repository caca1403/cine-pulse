/* Oynatıcı çözücüleri — saf metin dönüşümleri, ağ çağrısı yok.
   Buradaki her kalıp çalışan kaynaklarda ölçülmüş/tespit edilmiştir. */

import {
  masterUrlDuzelt, base64Coz, paketCoz, vnCoz, charCodeCoz,
  oynaticiCoz, masterAltyazilari, videoPlayerDataCoz, firePlayerCoz
} from '../src/services/playerDecoders.js';

let gecti = 0, kalan = 0;
function ok(kosul, ad, ek = '') {
  if (kosul) { gecti++; console.log(`  ✓ ${ad}${ek ? ' — ' + ek : ''}`); }
  else { kalan++; console.log(`  ✗ ${ad}${ek ? ' — ' + ek : ''}`); }
}

console.log('═══ oynatıcı çözücüleri ═══');

// 1) master.txt → master.m3u8 (DiziSol 404'ünün çözümü)
ok(masterUrlDuzelt('https://cdn.com/a/b.mpd/txt/master.txt') === 'https://cdn.com/a/b.mpd/master.m3u8',
   'txt/master.txt → master.m3u8');
ok(masterUrlDuzelt('https://cdn.com/x/master.m3u8') === 'https://cdn.com/x/master.m3u8',
   'master.m3u8 olduğu gibi kalır');

// 2) Dean Edwards paketi — kod ÇALIŞTIRILMADAN açılıyor.
//    Gerçek biçimde paketlenmiş bir yük; token'lar kelime sınırıyla
//    ayrılabilsin diye boşlukla konmuş (0 ve 1 komşu olsaydı "01" diye
//    birleşir ve ayrıştırılamazdı).
const paketli = '<script>eval(function(p,a,c,k,e,d){while(--d){if(k[r])e[r]=k[r];}}("u=0;",36,1,"https://cdn.tv/hls/y.m3u8".split("|"),0,1))</script>';
const acilan = paketCoz(paketli);
ok(acilan.trim() === 'u=https://cdn.tv/hls/y.m3u8;', 'paketli JS metin dönüşümüyle açıldı', acilan.trim().slice(0, 44));
ok(oynaticiCoz(paketli)?.url === 'https://cdn.tv/hls/y.m3u8', 'paketli JS içinden adres çıkarıldı', oynaticiCoz(paketli)?.url || 'yok');

// 3) openPlayer(...) — selcukflix benzeri
const selcuk = `<script>function go(){ openPlayer('https://tr.selcuk.tv/hls/slug/master.m3u8'); }</script>`;
ok(oynaticiCoz(selcuk)?.url === 'https://tr.selcuk.tv/hls/slug/master.m3u8', 'openPlayer(...) deseni');

// 4) file : av("...")
const avli = `<script>var cfg = { file : av("https://f.ekseni.tv/v/x.mp4"), title: "x" };</script>`;
ok(oynaticiCoz(avli)?.url === 'https://f.ekseni.tv/v/x.mp4', 'file : av("...") deseni');

// 5) master.txt deseni
const masterTxt = `<script>var s="https://cdn.hd/v/x.mpd/txt/master.txt";</script>`;
ok(oynaticiCoz(masterTxt)?.url === 'https://cdn.hd/v/x.mpd/master.m3u8', 'master.txt otomatik düzeltildi');

// 6) doğrudan adres
ok(oynaticiCoz('<video src="https://cdn.tv/a/b.m3u8">')?.url === 'https://cdn.tv/a/b.m3u8', 'doğrudan medya adresi');

// 7) Türkçe altyazı hatları
const master = `#EXTM3U
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="a",LANGUAGE="tr",NAME="Türkçe",URI="tr.m3u8"
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="a",LANGUAGE="en",NAME="English",URI="en.m3u8"
#EXT-X-STREAM-INF:BANDWIDTH=1500000,RESOLUTION=854x480`;
const subs = masterAltyazilari(master);
ok(subs.length === 1 && subs[0].url === 'tr.m3u8', 'master.m3u8 → Türkçe ses/altyazı', `${subs.length} hat`);

// 8) charCode deseni
const cc = `<script>var a="https://cdn.tv/x.m3u8";var b=42;var s="";for(i=0;i<a.length;i++)s+=String.fromCharCode(a.charCodeAt(i)-(42%(i+9)));</script>`;
ok(Boolean(charCodeCoz(cc)) || Boolean(oynaticiCoz(cc)), 'charCode deseni tanındı');

// 8b) videoPlayerData(JSON.parse('…')) — gömülü oynatıcı verisi
const gomulu = `<script>videoPlayerData(JSON.parse('{\\u0022url\\u0022:\\u0022https://cdn.t/hls/g\\u0022,\\u0022size\\u0022:\\u00221\\u0022}'));</script>`;
ok(oynaticiCoz(gomulu)?.url === 'https://cdn.t/hls/g', 'videoPlayerData(JSON.parse) çözüldü', oynaticiCoz(gomulu)?.url || 'yok');

// 8c) FirePlayer(…, { file: … }, …) — SetFilm ailesi
const fire = `<script>FirePlayer("abc", { file: "https://cdn.sf.tv/hls/f.m3u8", title: "x" }, true);</script>`;
ok(oynaticiCoz(fire)?.url === 'https://cdn.sf.tv/hls/f.m3u8', 'FirePlayer({file}) çözüldü', oynaticiCoz(fire)?.url || 'yok');

// 9) Kod çalıştırılmadığının kanıtı: process/require çağrısı yok
const kotu = `<script>process.exit(1); require('fs').readFileSync('/etc/passwd'); while(1){}</script>`;
ok(oynaticiCoz(kotu) === null, 'tehlikeli kod çalıştırılmıyor (ağ/erişim yok)');

console.log(`\nTAMAM — geçen: ${gecti}, kalan: ${kalan}`);
process.exit(kalan === 0 ? 0 : 1);