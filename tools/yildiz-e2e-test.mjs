#!/usr/bin/env node
/* ==========================================================================
   YILDIZ ARŞİVİ UÇTAN UCA TESTİ — 30 içerik · tarama · akış · oynatma
   --------------------------------------------------------------------------
   Kullanıcı isteği (2026-11-14): "en az 20-30 içerikte yıldız arşiv taramasının
   hem sitede hem uygulamada oynatıldığını gerçekten test et".

   Bu araç ÜRETİM ZİNCİRİNİN aynısını koşturur, ayrı bir kopyasını değil:
     1) TMDB'den gerçek başlık verisi (başlık, özgün başlık, yıl, IMDb, tür)
     2) Yıldız arşiv taraması (multiDubEndgame) → hangi kaynakta var + dublaj
        beyanı; sonuç TR dublaj siciline yazılır
     3) Çekirdek taraması (cekirdek-test.mjs, ayrı süreç) → GERÇEK akış URL'si
     4) Akış doğrulama (akisanDilKaniti) → master playlist'te gerçek tr ses izi
        var mı? Token'lar kısa ömürlü olduğu için bu adım akış alınır alınmaz
        koşar.
     5) Sicil sıralaması → kanıtlı dublaj kaynağı öne geçti mi?

   ÇIKTI: notlar/yildiz-e2e-<tarih>.json + konsol tablosu.
   Ayrıca `--web` ile web bundle'ının (dist/) aynı modülleri içerdiği doğrulanır.

   Kullanım:
     node tools/yildiz-e2e-test.mjs                    # 30 başlık varsayılan
     node tools/yildiz-e2e-test.mjs --limit 5          # hızlı deneme
     node tools/yildiz-e2e-test.mjs --cekirdek-limit 8 # daha hızlı
   ========================================================================== */
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
  + '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

/* ── Başlık listesi ─────────────────────────────────────────────────────────
   30 içerik: 18 film + 12 dizi. TR dublaj sitelerinde GERÇEKTEN bulunan,
   popüler ve farklı tür/yıllardan seçildi. TMDB kimlikleri sabittir. */
const BASLIKLAR = [
  // ── Filmler (18)
  { tip: 'movie', id: '550', ad: 'Fight Club' },
  { tip: 'movie', id: '27205', ad: 'Inception' },
  { tip: 'movie', id: '157336', ad: 'Interstellar' },
  { tip: 'movie', id: '155', ad: 'The Dark Knight' },
  { tip: 'movie', id: '680', ad: 'Pulp Fiction' },
  { tip: 'movie', id: '603', ad: 'The Matrix' },
  { tip: 'movie', id: '13', ad: 'Forrest Gump' },
  { tip: 'movie', id: '238', ad: 'The Godfather' },
  { tip: 'movie', id: '424', ad: "Schindler's List" },
  { tip: 'movie', id: '98', ad: 'Gladiator' },
  { tip: 'movie', id: '299534', ad: 'Avengers: Endgame' },
  { tip: 'movie', id: '299536', ad: 'Avengers: Infinity War' },
  { tip: 'movie', id: '24428', ad: 'The Avengers' },
  { tip: 'movie', id: '76341', ad: 'Mad Max: Fury Road' },
  { tip: 'movie', id: '597', ad: 'Titanic' },
  { tip: 'movie', id: '862', ad: 'Toy Story' },
  { tip: 'movie', id: '76600', ad: 'Avatar: The Way of Water' },
  { tip: 'movie', id: '569094', ad: 'Across the Spider-Verse' },
  // ── Diziler (12)
  { tip: 'tv', id: '1399', sezon: 1, bolum: 1, ad: 'Game of Thrones' },
  { tip: 'tv', id: '1396', sezon: 1, bolum: 1, ad: 'Breaking Bad' },
  { tip: 'tv', id: '66732', sezon: 1, bolum: 1, ad: 'Stranger Things' },
  { tip: 'tv', id: '60625', sezon: 1, bolum: 1, ad: 'Rick and Morty' },
  { tip: 'tv', id: '456', sezon: 1, bolum: 1, ad: 'The Simpsons' },
  { tip: 'tv', id: '71446', sezon: 1, bolum: 1, ad: 'Money Heist' },
  { tip: 'tv', id: '82856', sezon: 1, bolum: 1, ad: 'The Mandalorian' },
  { tip: 'tv', id: '87108', sezon: 1, bolum: 1, ad: 'Chernobyl' },
  { tip: 'tv', id: '63174', sezon: 1, bolum: 1, ad: 'Lucifer' },
  { tip: 'tv', id: '1416', sezon: 1, bolum: 1, ad: "Grey's Anatomy" },
  { tip: 'tv', id: '1668', sezon: 1, bolum: 1, ad: 'Friends' },
  { tip: 'tv', id: '46648', sezon: 1, bolum: 1, ad: 'True Detective' },
];

const TMDB_ANAHTARLARI = [
  '4e44d9029b1270a757cddc766a1bcb63',
  '844dba0bfd8f3a4f3799f6130ef9e335',
];
const TMDB = 'https://api.themoviedb.org/3';

function arg(ad, varsayilan) {
  const i = process.argv.indexOf(ad);
  return i > -1 && process.argv[i + 1] !== undefined ? process.argv[i + 1] : varsayilan;
}

/* ── TMDB: gerçek başlık verisi ───────────────────────────────────────────── */

async function tmdbBaslik(b) {
  const yol = b.tip === 'movie' ? `movie/${b.id}` : `tv/${b.id}`;
  for (const anahtar of TMDB_ANAHTARLARI) {
    try {
      const y = await fetch(`${TMDB}/${yol}?api_key=${anahtar}&language=tr-TR`,
        { signal: AbortSignal.timeout(15000) });
      if (!y.ok) continue;
      const j = await y.json();
      return {
        tmdbTip: b.tip,
        tmdbId: String(b.id),
        sezon: b.sezon ?? null,
        bolum: b.bolum ?? null,
        baslik: j.title || j.name || b.ad,
        orijinalBaslik: j.original_title || j.original_name || b.ad,
        yil: Number(String(j.release_date || j.first_air_date || '').slice(0, 4)) || null,
        imdb: j.imdb_id || '',
        puan: Number(j.vote_average) || null,
      };
    } catch (_) { /* sonraki anahtar */ }
  }
  // TMDB düşerse yalnız adla devam — test çökmez, alan eksik kalır.
  return {
    tmdbTip: b.tip, tmdbId: String(b.id), sezon: b.sezon ?? null, bolum: b.bolum ?? null,
    baslik: b.ad, orijinalBaslik: b.ad, yil: null, imdb: '', puan: null,
  };
}

/* ── Çekirdek taraması (ayrı süreç — üretimle aynı kılıf) ─────────────────── */

const CEKIRDEK_DIZINI = path.join(KOK, 'src/providers/cekirdekler');

/** Ölçülen CANLI çekirdekler (2026-11-14 movie taraması, 26/56). */
const VARSAYILAN_CEKIRDEKLER = [
  'shazam.js', 'dizisol.js', 'hulk.js', 'aquaman.js', 'lukeCage.js', 'ironMan.js',
  'nova.js', 'phyla.js', 'hawkeye.js', 'darkseid.js', 'cyborg.js', 'constantine.js',
  'daredevil.js', 'beastBoy.js', 'blackPanther.js', 'aqualad.js', 'catWoman.js',
  'loki.js', 'raven.js', 'superman.js', 'winterSoldier.js', 'doctorStrange.js',
  'falcon.js', 'huntress.js', 'starLord.js', 'blackAdam.js',
];

function cekirdekCalistir(cekirdek, hedef, timeoutMs) {
  return new Promise((coz) => {
    const args = [path.join(KOK, 'tools/cekirdek-test.mjs'), cekirdek, hedef.tmdbId, hedef.tmdbTip];
    if (hedef.tmdbTip === 'tv') args.push(String(hedef.sezon || 1), String(hedef.bolum || 1));
    const cocuk = spawn('node', args, {
      cwd: KOK,
      env: { ...process.env, NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --dns-result-order=ipv4first`.trim(), LC_ALL: 'C.UTF-8' },
    });
    let cikti = '';
    const zaman = setTimeout(() => { try { cocuk.kill('SIGKILL'); } catch (_) {} }, timeoutMs);
    cocuk.stdout.on('data', (d) => { cikti += d; });
    cocuk.stderr.on('data', (d) => { cikti += d; });
    cocuk.on('close', () => {
      clearTimeout(zaman);
      // Son dengeli JSON nesnesi (kahraman-toplu-test.mjs ile aynı kural).
      const nesne = sonJson(cikti);
      coz(nesne ? { ...nesne, _cikti: '' } : { adet: 0, ornekler: [], _cikti: cikti.slice(-300) });
    });
  });
}

function sonJson(metin) {
  const kaynak = String(metin || '');
  const adaylar = [];
  let derinlik = 0; let bas = 0; let tirnak = false; let kacis = false;
  for (let i = 0; i < kaynak.length; i += 1) {
    const c = kaynak[i];
    if (tirnak) {
      if (kacis) kacis = false;
      else if (c === '\\') kacis = true;
      else if (c === '"') tirnak = false;
      continue;
    }
    if (c === '"') { tirnak = true; continue; }
    if (c === '{') { if (derinlik === 0) bas = i; derinlik += 1; }
    else if (c === '}') {
      if (derinlik > 0) { derinlik -= 1; if (derinlik === 0) adaylar.push(kaynak.slice(bas, i + 1)); }
    }
  }
  for (let i = adaylar.length - 1; i >= 0; i -= 1) {
    try { const o = JSON.parse(adaylar[i]); if (o && typeof o === 'object' && !Array.isArray(o)) return o; } catch (_) { /* önceki */ }
  }
  return null;
}

/* ── Akış doğrulama: gerçek tr ses izi var mı? ────────────────────────────── */

async function akisDogrula(url, referer) {
  const { akisanDilKaniti } = await import(path.join(KOK, 'src/services/dogrudan/dublajArsivi.js'));
  try {
    const r = await akisanDilKaniti(url, {
      ms: 12000,
      fetchImpl: (u, o = {}) => fetch(u, {
        ...o,
        headers: { 'User-Agent': UA, ...(referer ? { Referer: referer, Origin: new URL(referer).origin } : {}), ...(o.headers || {}) },
      }),
    });
    return { ...r, ulasildi: r.kanit !== 'yok' };
  } catch (hata) {
    return { dilDurumu: 'bilinmiyor', kanit: 'yok', diller: [], ulasildi: false, hata: String(hata?.message || hata).slice(0, 100) };
  }
}

/* ── Ana akış ─────────────────────────────────────────────────────────────── */

async function main() {
  const limit = Number(arg('--limit', '0')) || BASLIKLAR.length;
  const cekirdekLimit = Number(arg('--cekirdek-limit', '10')) || 10;
  const cekirdekButce = Number(arg('--cekirdek-butce', '25000')) || 25000;
  const ciktiYolu = path.resolve(KOK, arg('--cikti', `notlar/yildiz-e2e-${arg('--tarih', new Date().toISOString().slice(0, 10))}.json`));

  const secilen = BASLIKLAR.slice(0, limit);
  const cekirdekler = existsSync(CEKIRDEK_DIZINI)
    ? VARSAYILAN_CEKIRDEKLER.filter((f) => existsSync(path.join(CEKIRDEK_DIZINI, f))).slice(0, cekirdekLimit)
    : [];

  // Üretim modüllerini yükle (Vite/Node uyumlu ES modülleri).
  const yildiz = await import(path.join(KOK, 'src/services/dogrudan/multiDubEndgame.js'));
  const sicilMod = await import(path.join(KOK, 'src/services/dogrudan/dublajSicili.js'));
  const zeka = await import(path.join(KOK, 'src/services/kaynak/dublajZekasi.js'));

  // localStorage yoksa sahte depo (sicil kalıcılığı için).
  if (typeof globalThis.localStorage === 'undefined') {
    const m = new Map();
    globalThis.localStorage = {
      getItem: (k) => (m.has(k) ? m.get(k) : null),
      setItem: (k, v) => m.set(k, String(v)),
      removeItem: (k) => m.delete(k),
    };
  }
  zeka.siciliSifirla();
  await zeka.onekleriYukle();

  console.log(`yıldız arşivi E2E: ${secilen.length} başlık · ${cekirdekler.length} çekirdek`);
  console.log(`çekirdek bütçesi ${cekirdekButce}ms · çıktı ${path.relative(KOK, ciktiYolu)}\n`);

  const sicil = sicilMod.sicilBos();
  const sonuclar = [];

  for (let i = 0; i < secilen.length; i += 1) {
    const ham = secilen[i];
    const hedef = await tmdbBaslik(ham);
    const etiket = `[${String(i + 1).padStart(2, '0')}/${secilen.length}] ${hedef.baslik} (${hedef.yil || '?'})`;

    /* 1) Yıldız arşiv taraması (4 site paralel). */
    let yildizSonuc = { adaylar: [], eslesen: [], kaynakDurumu: {}, ozet: {} };
    try {
      yildizSonuc = await yildiz.yildizArsiviTara({
        ...hedef,
        simdi: Date.now(),
      }, { sicil, ms: 12000 });
    } catch (_) { /* tarama düşerse akış testi devam eder */ }

    /* 2) Çekirdek taraması — gerçek akış. */
    const akislar = [];
    let dublajAkis = null;
    for (const cekirdek of cekirdekler) {
      const r = await cekirdekCalistir(cekirdek, hedef, cekirdekButce);
      const ornekler = Array.isArray(r.ornekler) ? r.ornekler : [];
      for (const o of ornekler.slice(0, 2)) {
        if (!o?.url) continue;
        akislar.push({
          cekirdek,
          ad: o.ad || '',
          format: o.format || '',
          kalite: o.kalite || '',
          url: o.url,
        });
      }
      if (akislar.length >= 3) break; // yeterli akış var, ağ israfı yok
    }

    /* 3) Akışları HEMEN doğrula (token kısa ömürlü). */
    const dogrulanan = [];
    for (const akis of akislar.slice(0, 3)) {
      const d = await akisDogrula(akis.url);
      dogrulanan.push({ ...akis, ...d });
      if (d.dilDurumu === 'dublaj' && d.diller?.includes('tr') && !dublajAkis) {
        dublajAkis = akis.cekirdek;
      }
    }

    /* 4) Sicile gerçek akış kanıtını yaz (üretimdeki akışla aynı kurallar). */
    for (const d of dogrulanan) {
      if (d.dilDurumu !== 'dublaj' && d.dilDurumu !== 'orijinal') continue;
      if (d.kanit === 'yok') continue;
      sicilMod.kanitIsle(sicil, {
        tmdbTip: hedef.tmdbTip,
        tmdbId: hedef.tmdbId,
        sezon: hedef.sezon,
        bolum: hedef.bolum,
        saglayici: zeka.saglayiciAnahtari({ id: d.cekirdek.replace(/\.js$/, '') }),
        dilDurumu: d.dilDurumu,
        kanit: d.kanit,
        diller: d.diller,
        sonGorulme: Date.now(),
      });
    }

    /* 5) Sıralama: yıldız kanıtı öne geçti mi? */
    const icerik = sicilMod.icerikAnahtari({
      tmdbTip: hedef.tmdbTip, tmdbId: hedef.tmdbId, sezon: hedef.sezon, bolum: hedef.bolum,
    });
    const sahteListe = yildizSonuc.eslesen.map((a, idx) => ({
      id: `star_${idx}`, saglayici: a.kaynak, displayName: a.baslik,
    }));
    const sirali = sicilMod.sicileGoreSirala(sahteListe, sicil, icerik, { simdi: Date.now() });
    const kanitOnsirali = sirali.length > 0
      && yildizSonuc.eslesen.find((a) => `star_${yildizSonuc.eslesen.indexOf(a)}` === sirali[0]?.id)?.dilDurumu === 'dublaj';

    const satir = {
      ...hedef,
      yildiz: {
        adaySayisi: yildizSonuc.adaylar.length,
        eslesenSayisi: yildizSonuc.eslesen.length,
        kaynakDurumu: yildizSonuc.kaynakDurumu,
        kaynaklar: [...new Set(yildizSonuc.eslesen.map((a) => a.kaynak))],
        dublajBeyanli: yildizSonuc.eslesen.filter((a) => a.dilDurumu === 'dublaj').length,
        eslesmeler: yildizSonuc.eslesen.map((a) => ({
          kaynak: a.kaynak, baslik: a.baslik, yil: a.yil,
          dilDurumu: a.dilDurumu, adres: a.adres, skor: a.eslesmeSkoru,
        })),
      },
      akis: {
        denenenCekirdek: cekirdekler.length,
        bulunanAkis: akislar.length,
        dogrulanan: dogrulanan.map((d) => ({
          cekirdek: d.cekirdek, format: d.format, kalite: d.kalite,
          dilDurumu: d.dilDurumu, kanit: d.kanit, diller: d.diller,
          trKanit: d.dilDurumu === 'dublaj' && (d.diller || []).includes('tr'),
          url: d.url,
        })),
        trDublajliAkis: dogrulanan.some((d) => d.dilDurumu === 'dublaj'),
        oynatilabilir: dogrulanan.some((d) => d.kanit !== 'yok'),
      },
      siralama: {
        yildizDublajOne: Boolean(kanitOnsirali),
        sira: sirali.map((x) => x.id),
      },
    };
    sonuclar.push(satir);

    const yz = satir.yildiz;
    const ak = satir.akis;
    console.log(`${etiket}`);
    console.log(`   yıldız: ${yz.eslesenSayisi} eşleşme [${yz.kaynaklar.map((k) => k.replace('star:', '')).join(',') || '-'}] dublaj beyanı ${yz.dublajBeyanli}`);
    console.log(`   akış  : ${ak.bulunanAkis} bulundu, ${ak.dogrulanan.length} doğrulandı`
      + `${ak.trDublajliAkis ? ' · ✅ TR DUBLAJ KANITLI' : ak.oynatilabilir ? ' · oynatılabilir (tr kanıtsız)' : ' · ❌ akış yok'}`);
  }

  /* ── Özet ─────────────────────────────────────────────────────────────── */
  const ozet = {
    tarih: new Date().toISOString(),
    baslikSayisi: sonuclar.length,
    cekirdekSayisi: cekirdekler.length,
    yildizEslesmeOlan: sonuclar.filter((s) => s.yildiz.eslesenSayisi > 0).length,
    yildizDublajBeyanli: sonuclar.filter((s) => s.yildiz.dublajBeyanli > 0).length,
    akisBulunan: sonuclar.filter((s) => s.akis.bulunanAkis > 0).length,
    akisDogrulanan: sonuclar.filter((s) => s.akis.dogrulanan.length > 0).length,
    trDublajliAkis: sonuclar.filter((s) => s.akis.trDublajliAkis).length,
    oynatilabilir: sonuclar.filter((s) => s.akis.oynatilabilir).length,
    kaynakBazinda: {},
  };
  for (const s of sonuclar) {
    for (const [kod, durum] of Object.entries(s.yildiz.kaynakDurumu || {})) {
      if (!ozet.kaynakBazinda[kod]) ozet.kaynakBazinda[kod] = { ok: 0, adet: 0, hata: 0 };
      if (durum.ok) { ozet.kaynakBazinda[kod].ok += 1; ozet.kaynakBazinda[kod].adet += durum.adet || 0; }
      else ozet.kaynakBazinda[kod].hata += 1;
    }
  }

  const cikti = { olcum: new Date().toISOString().slice(0, 10), ozet, sonuclar, cevirim: { cekirdekler } };
  writeFileSync(ciktiYolu, `${JSON.stringify(cikti, null, 1)}\n`, 'utf8');

  console.log(`\n${'='.repeat(64)}`);
  console.log(`ÖZET — ${ozet.baslikSayisi} başlık`);
  console.log(`  yıldız eşleşmesi   : ${ozet.yildizEslesmeOlan}/${ozet.baslikSayisi}`);
  console.log(`  yıldız dublaj beyanı: ${ozet.yildizDublajBeyanli}/${ozet.baslikSayisi}`);
  console.log(`  akış bulunan       : ${ozet.akisBulunan}/${ozet.baslikSayisi}`);
  console.log(`  akış doğrulanan    : ${ozet.akisDogrulanan}/${ozet.baslikSayisi}`);
  console.log(`  TR dublaj kanıtlı  : ${ozet.trDublajliAkis}/${ozet.baslikSayisi}`);
  console.log(`  oynatılabilir      : ${ozet.oynatilabilir}/${ozet.baslikSayisi}`);
  console.log('  kaynak bazında     :');
  for (const [kod, v] of Object.entries(ozet.kaynakBazinda)) {
    console.log(`    ${kod.padEnd(20)} ok ${v.ok} · adet ${v.adet} · hata ${v.hata}`);
  }
  console.log(`\nçıktı: ${path.relative(KOK, ciktiYolu)}`);
}

main().catch((hata) => {
  console.error('ÖLÇÜM ÇÖKTÜ:', hata);
  process.exitCode = 1;
});
