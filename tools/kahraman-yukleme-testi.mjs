/* Her kahraman çekirdeğini yükler ve NEDEN yüklenemediğini gruplar.
   Ağ kullanmaz; yalnız modül değerlendirmesi. Çalıştır:
     node tools/kahraman-yukleme-testi.mjs                                    */
import { KAYIT } from '../src/providers/kayit.js';
import { cekirdekAl, yuklemeOzeti } from '../src/providers/vekil.js';

// Çekirdekler tarayıcıda koşmak üzere yazıldı: Node'da değerlendirilebilmeleri
// için en küçük kabuk. (Gerçek ağ çağrısı yapmıyoruz.)
globalThis.window ??= globalThis;
globalThis.self ??= globalThis;
globalThis.document ??= {
  createElement: () => ({ style: {}, setAttribute() {}, appendChild() {}, classList: { add() {} } }),
  cookie: '', referrer: '', querySelector: () => null, addEventListener() {},
  documentElement: { classList: { contains: () => false } },
};
globalThis.navigator ??= { userAgent: 'Mozilla/5.0 (X11; Linux x86_64)', language: 'tr-TR', onLine: true };
globalThis.location ??= { href: 'https://localhost/', origin: 'https://localhost', hostname: 'localhost' };

const sessiz = console.warn; console.warn = () => {};
for (const [ad] of KAYIT) {
  try { await cekirdekAl(ad); } catch (_) { /* özet raporlayacak */ }
}
console.warn = sessiz;

const o = yuklemeOzeti();
console.log(`yuklendi=${o.yuklendi}  yuklenmedi=${o.yuklenmedi}  kayit-birakmadi=${o.kayitBirakmadi}  toplam=${KAYIT.size}`);

const kalip = new Map();
for (const [ad, b] of Object.entries(o.detay)) {
  if (b.durum === 'yuklendi') continue;
  const k = `${b.durum} :: ${b.mesaj.slice(0, 80)}`;
  kalip.set(k, [...(kalip.get(k) || []), ad]);
}
console.log('\n--- kalıplar ---');
for (const [k, adlar] of [...kalip.entries()].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`[${adlar.length}] ${k}`);
  console.log(`         ${adlar.slice(0, 20).join(', ')}${adlar.length > 20 ? ' …' : ''}`);
}
