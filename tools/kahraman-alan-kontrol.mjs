#!/usr/bin/env node
/* Alan (domain) sağlık kontrolü — her kahramanın kayıtlı alanı yaşıyor mu?
   Ölü alan = o sağlayıcı HER zaman sıfır kaynak verir; bu, çekirdek hatasından
   bağımsız ve en sık görünen nedendir. Yönlendirme varsa yeni alan bildirilir.

   Kullanım: node tools/kahraman-alan-kontrol.mjs [--json dosya]
*/
import { writeFileSync } from 'node:fs';

const MOD = await import('../src/providers/alanlar.js');
const ALANLAR = MOD.default || MOD.ALANLAR || MOD.alanHaritasi || MOD.kahramanAlanlari || {};
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const anahtar = Object.keys(ALANLAR);
if (!anahtar.length) {
  console.error('alan haritası boş/okunamadı — dışa açılan adı kontrol et');
  process.exit(1);
}

async function dene(kod, alan) {
  const sonuc = { kod, alan: alan || null, durum: 'bilinmiyor', hedef: null, ms: 0 };
  if (typeof alan !== 'string' || !/^https?:\/\//i.test(alan)) {
    sonuc.durum = 'alan-tanimsi';
    return sonuc;
  }
  const t0 = Date.now();
  const iste = { headers: { 'User-Agent': UA, Accept: 'text/html,*/*' }, redirect: 'follow' };
  try {
    const r = await fetch(alan, { ...iste, signal: AbortSignal.timeout(12000) });
    sonuc.durum = r.ok ? 'yayin' : `http-${r.status}`;
    sonuc.hedef = new URL(r.url).host;
  } catch (e) {
    const m = String(e?.cause?.code || e?.message || e);
    sonuc.durum = /ENOTFOUND|getaddrinfo/i.test(m) ? 'alan-yok'
      : /ECONNREFUSED/i.test(m) ? 'baglanti-red'
      : /ETIMEDOUT|timeout|AbortError/i.test(m) ? 'zaman-asimi'
      : /ERR_TLS|CERT|SSL/i.test(m) ? 'tls' : /hata/i.test(m) ? m.slice(0, 40) : 'bozuk';
  }
  sonuc.ms = Date.now() - t0;
  return sonuc;
}

/** Adresten host adı: raporlamada yönlendirme farkını göstermek için. */
const hostAdi = adres => String(adres || '').split('//')[1]?.split('/')[0] || String(adres || '');

const kuyruk = [];
const HAVUZ = 8;
for (let i = 0; i < anahtar.length; i += HAVUZ) {
  kuyruk.push(Promise.all(anahtar.slice(i, i + HAVUZ).map(k => dene(k, ALANLAR[k]))));
}
const sonuclar = (await Promise.all(kuyruk)).flat();

const grup = {};
for (const s of sonuclar) (grup[s.durum] ||= []).push(s);
for (const [durum, liste] of Object.entries(grup).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`\n${durum} (${liste.length}):`);
  for (const s of liste) {
    const yon = s.hedef && s.hedef !== hostAdi(s.alan) ? ` → ${s.hedef}` : '';
    console.log(`  ${s.kod.padEnd(16)} ${hostAdi(s.alan).padEnd(34)}${yon} ${Math.round(s.ms)}ms`);
  }
}

const jsonYol = process.argv.indexOf('--json');
if (jsonYol > -1 && process.argv[jsonYol + 1]) {
  writeFileSync(process.argv[jsonYol + 1], JSON.stringify({ tarih: new Date().toISOString(), sonuclar }, null, 2));
  console.log('\nyazildi:', process.argv[jsonYol + 1]);
}
