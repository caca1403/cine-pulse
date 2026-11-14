#!/usr/bin/env node
/* ==========================================================================
   TR DUBLAJ KANIT TOHUMU DERLEYİCİ
   --------------------------------------------------------------------------
   `notlar/dublaj-kanit-*.json` ölçüm dosyalarını (canlı, gerçek m3u8 ses izi
   kanıtı) uygulamaya gömülebilir TEK tohum dosyasına dönüştürür:
     public/dublaj-tohum.json

   NEDEN: Ölçüm dosyaları ayrı ayrı duruyor ve uygulama onları okumuyordu.
   Tohum, TR dublaj sicilinin ilk açılışta "akıllı" başlamasını sağlar —
   kullanıcı daha hiçbir şey izlemeden hangi sağlayıcıların gerçek Türkçe ses
   verdiğini bilir. Siteye gitme ihtiyacı büyük ölçüde kalkar.

   KURALLAR:
     · Yalnız `kanit` alanı m3u8/ts/mp4/mkv olan kayıtlar tohumlanır (etiket
       kanıt sayılmaz — projedeki mevcut kural).
     · Çekirdek adı → sağlayıcı öneki eşlemesi `kayit.js` KAYIT tablosundan
       gelir; eşleşmeyen çekirdek atlanır (uydurma atıf yok).
     · `kaynakKok`/`adresOzet` tohumda tutulmaz: tohum içerik+sağlayıcı
       düzeyindedir ve gerçek site adı taşımaz.

   Kullanım:
     node tools/dublaj-tohum-derle.mjs
     node tools/dublaj-tohum-derle.mjs --girdi notlar/a.json notlar/b.json
   ========================================================================== */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CIKTI = path.join(KOK, 'public/dublaj-tohum.json');
const GECERLI_KANIT = new Set(['m3u8', 'ts', 'mp4', 'mkv']);

/* ── Çekirdek adı → sağlayıcı öneki ─────────────────────────────────────────
   KAYIT tablosunu import etmek yerine dosyadan okuyoruz: kayit.js modül
   yüklenirken ağa çıkıyor (aria anahtarı) — derleyici çevrimdışı çalışmalı. */
function cekirdekOnekleri() {
  const kaynak = readFileSync(path.join(KOK, 'src/providers/kayit.js'), 'utf8');
  const harita = {};
  // ['Hulk', { onek: 'sp_hulk_', dosya: 'hulk.js', ... }]
  const re = /\['([^']+)',\s*\{[^}]*?onek:\s*'([^']+)'[^}]*?dosya:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(kaynak))) {
    const [, kod, onek, dosya] = m;
    harita[dosya] = onek;
    harita[dosya.replace(/\.js$/, '')] = onek;
    harita[kod.toLowerCase()] = onek;
  }
  return harita;
}

/** Ölçüm dosyasındaki çekirdek adını sağlayıcı anahtarına çevirir. */
function saglayiciAnahtari(cekirdek, onekler) {
  const temiz = String(cekirdek || '').trim();
  if (!temiz) return '';
  const varyantlar = [temiz, temiz.replace(/\.js$/, ''), `${temiz.replace(/\.js$/, '')}.js`];
  for (const v of varyantlar) {
    if (onekler[v]) return onekler[v];
  }
  // camelCase → lowercase eşleşmesi (ör. "blackPanther" → kayıt anahtarı).
  const kucuk = temiz.replace(/\.js$/, '').toLowerCase();
  return onekler[kucuk] || '';
}

function main() {
  const argv = process.argv.slice(2);
  const gIdx = argv.indexOf('--girdi');
  let girdiler;
  if (gIdx >= 0) {
    girdiler = argv.slice(gIdx + 1).filter((a) => !a.startsWith('--'));
  } else {
    // Varsayılan: notlar/ altındaki tüm dublaj-kanit-*.json dosyaları.
    const notlar = path.join(KOK, 'notlar');
    girdiler = readdirSync(notlar)
      .filter((f) => /^dublaj-kanit-.*\.json$/.test(f))
      .sort()
      .map((f) => path.join(notlar, f));
  }
  if (!girdiler.length) {
    console.error('HATA: ölçüm dosyası bulunamadı (notlar/dublaj-kanit-*.json).');
    process.exitCode = 1;
    return;
  }

  const onekler = cekirdekOnekleri();
  const kayitlar = [];
  const gorulen = new Set();
  const atlanan = { kanit: 0, eslesmeyen: 0, kimliksiz: 0 };
  const kaynakDosyalar = [];

  for (const girdi of girdiler) {
    const tam = path.isAbsolute(girdi) ? girdi : path.join(KOK, girdi);
    if (!existsSync(tam)) { console.warn(`atlandı (yok): ${girdi}`); continue; }
    let veri;
    try { veri = JSON.parse(readFileSync(tam, 'utf8')); } catch (h) {
      console.warn(`atlandı (bozuk JSON): ${girdi} — ${h.message}`);
      continue;
    }
    const liste = Array.isArray(veri?.kayitlar) ? veri.kayitlar : [];
    kaynakDosyalar.push({ dosya: path.relative(KOK, tam), olcum: veri?.olcum || '', kayit: liste.length });

    for (const k of liste) {
      const kanit = String(k?.kanit || '').toLowerCase();
      if (!GECERLI_KANIT.has(kanit)) { atlanan.kanit += 1; continue; }
      if (!String(k?.tmdbId ?? '').trim()) { atlanan.kimliksiz += 1; continue; }
      const saglayici = saglayiciAnahtari(k.cekirdek, onekler);
      if (!saglayici) { atlanan.eslesmeyen += 1; continue; }

      const dilDurumu = String(k?.dilDurumu || 'bilinmiyor').toLowerCase();
      if (dilDurumu !== 'dublaj' && dilDurumu !== 'altyazi' && dilDurumu !== 'orijinal') continue;

      const anahtar = `${k.tmdbTip}|${k.tmdbId ?? ''}|${k.sezon ?? ''}|${k.bolum ?? ''}|${saglayici}`;
      if (gorulen.has(anahtar)) continue;
      gorulen.add(anahtar);
      kayitlar.push({
        tmdbTip: String(k.tmdbTip || 'movie'),
        tmdbId: String(k.tmdbId ?? ''),
        sezon: k.sezon ?? null,
        bolum: k.bolum ?? null,
        saglayici,
        dilDurumu,
        kanit,
        diller: Array.isArray(k.diller) ? k.diller : [],
        /* Ölçüm zamanı: dosya adından gün çıkarılamazsa derleme zamanı
           kullanılmaz — kanıtın tazeliği abartılmasın. Dosya `olcum` alanı
           (YYYY-MM-DD) varsa ondan alınır. */
        sonGorulme: /^\d{4}-\d{2}-\d{2}$/.test(String(veri?.olcum || ''))
          ? Date.parse(`${veri.olcum}T00:00:00Z`)
          : 0,
      });
    }
  }

  const tohum = {
    surum: 1,
    uretilmeTarihi: new Date().toISOString(),
    aciklama: 'TR dublaj ses izi kanıtı — canlı m3u8 ölçümlerinden derlendi. '
      + 'Etiket kanıt sayılmaz; yalnız medya okuması (m3u8/ts/mp4/mkv) girer.',
    kaynakDosyalar,
    ozet: {
      kayitSayisi: kayitlar.length,
      dublaj: kayitlar.filter((k) => k.dilDurumu === 'dublaj').length,
      altyazi: kayitlar.filter((k) => k.dilDurumu === 'altyazi').length,
      orijinal: kayitlar.filter((k) => k.dilDurumu === 'orijinal').length,
      saglayiciSayisi: new Set(kayitlar.map((k) => k.saglayici)).size,
      icerikSayisi: new Set(kayitlar.map((k) => `${k.tmdbTip}|${k.tmdbId}|${k.sezon ?? ''}|${k.bolum ?? ''}`)).size,
      atlanan,
    },
    kayitlar,
  };

  writeFileSync(CIKTI, `${JSON.stringify(tohum, null, 1)}\n`, 'utf8');
  console.log(`tohum yazıldı: ${path.relative(KOK, CIKTI)}`);
  console.log(`  kayıt: ${tohum.ozet.kayitSayisi} (dublaj ${tohum.ozet.dublaj}, altyazı ${tohum.ozet.altyazi}, orijinal ${tohum.ozet.orijinal})`);
  console.log(`  sağlayıcı: ${tohum.ozet.saglayiciSayisi} · içerik: ${tohum.ozet.icerikSayisi}`);
  console.log(`  atlanan: kanıt-dışı ${atlanan.kanit}, eşlenmeyen çekirdek ${atlanan.eslesmeyen}, kimliksiz ${atlanan.kimliksiz}`);
  for (const d of kaynakDosyalar) console.log(`  kaynak: ${d.dosya} (${d.kayit} kayıt, ölçüm ${d.olcum || '?'})`);
}

main();
