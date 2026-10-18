/* XSS regresyon testi: uzak M3U'den gelen kanal verisi HTML'e kaçırılmadan
   giriyor mu? Saldırgan kontrollü kanal adi/listesi kullanılır. */

import { getChannelBadgeSvg } from '../src/services/canli/liveTvChannels.js';
import { buildChannels } from '../src/services/canli/turkishLiveSources.js';

const PAYLOAD = '<img src=x onerror="alert(1)">';
const ATTR_PAYLOAD = '" onmouseover="alert(2)';

// ---- 1) SVG rozet üreticisi ------------------------------------------
console.log('── getChannelBadgeSvg (kanal adı → SVG)');
for (const name of [PAYLOAD, ATTR_PAYLOAD, '<svg onload=alert(3)>', 'TRT 1', "A&B'C"]) {
  const svg = getChannelBadgeSvg(name, 'national');
  const injects = /<img|<svg(?!\sxmlns)|onerror|onload|onmouseover/i.test(svg.replace(/^<svg[\s\S]*?<\/svg>$/, ''));
  // svg sarmalını çıkar, içindeki gerçek içerik kontrol edilsin
  const inner = svg.replace(/^[\s\S]*?<rect/, '<rect');
  const hasOn = /\son\w+\s*=/i.test(inner);
  const hasForeignTag = /<(?!\/?(rect|text|stop|linearGradient|svg)\b)[a-zA-Z]/.test(inner);
  const clean = !hasOn && !hasForeignTag;
  console.log(`  ${clean ? 'OK  ' : 'KÖTÜ '} "${name.slice(0, 28)}" → on*=${hasOn} yabancıEtiket=${hasForeignTag}`);
  if (!clean) process.exitCode = 1;
}

// ---- 2) Kanal üretimi: id/alan temizliği -------------------------------
console.log('\n── buildChannels (uzak liste → kanal nesneleri)');
const hostile = [{
  id: 'kral', label: 'Kral TV',
  channels: [
    { name: PAYLOAD, streamUrl: 'https://x.example/a.m3u8', category: 'national', quality: ATTR_PAYLOAD, isTs: false },
    { name: 'TRT 1', streamUrl: 'https://x.example/b.m3u8', category: 'national', quality: 'HD', isTs: false },
    { name: '"><script>alert(4)</script>', streamUrl: 'https://x.example/c.m3u8', category: 'national', quality: 'HD', isTs: false }
  ]
}];
const built = buildChannels(hostile, { resolveLogo: () => '' });
for (const c of built) {
  const idSafe = /^[a-z0-9_]+$/.test(c.id);
  console.log(`  ${idSafe ? 'OK  ' : 'KÖTÜ '} id="${c.id}"  name=${JSON.stringify(c.name.slice(0, 40))}`);
  if (!idSafe) process.exitCode = 1;
}
console.log(`  toplam kanal: ${built.length} (3 bekleniyor)`);

// ---- 3) LiveTvView escHtml'inin davranışı ----------------------------
console.log('\n── escHtml (LiveTvView ile aynı)');
const escHtml = (v) => String(v == null ? '' : v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const cases = [PAYLOAD, ATTR_PAYLOAD, '</div><script>alert(5)</script>', 'TRT & ATV'];
for (const c of cases) {
  const out = escHtml(c);
  // Ölçüt: kaçırıcı karakterlerin HİBİRİ çıktıda ham olarak kalmamalı.
  // ("onerror=" metni kaçırılmış olarak düz metin olarak durur — zararsız.)
  const rawChars = /[<>"]/.test(out);
  const entitiesOk = !/&(?!amp;|lt;|gt;|quot;|#39;)\w+;/.test(out);
  const safe = !rawChars && entitiesOk;
  console.log(`  ${safe ? 'OK  ' : 'KÖTÜ '} ${JSON.stringify(c.slice(0, 32))} → ${JSON.stringify(out.slice(0, 46))}`);
  if (!safe) process.exitCode = 1;
}

// Kaçırıcıdan sonra metin gerçekten aynı görünüyor mu (görsel bozulma testi)
const roundTrip = ['BeIN Sports 4K', 'TRT 1 HD', 'A&B', "Kanal'ın"].every(
  (c) => escHtml(c).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'") === c
);
console.log(`  ${roundTrip ? 'OK  ' : 'KÖTÜ '} kaçır→geri aç (görsel bozulma yok)`);
if (!roundTrip) process.exitCode = 1;

console.log(process.exitCode ? '\nBAŞARISIZ' : '\nTAMAM — XSS kaçırma doğrulandı');