#!/usr/bin/env node
/* ==========================================================================
   DUBLAJ ARŞİVİ DERLEME CLI'si — kanıt temelli TR dublaj arşivi toplayıcı
   --------------------------------------------------------------------------
   Kullanıcı kuralları (bağlayıcı):
     · Kayıtta gerçek site adı / hero kod adı YOKTUR; yalnız hash'lenmiş
       host (kaynakKok) ve hash'lenmiş adres özeti (adresOzet) yazılır.
     · Kanıt olmadan 'orijinal' YAZILMAZ: ağ hatası/timeout → 'bilinmiyor'.
     · Her başlıktan SONRA çıktı atomik olarak yazılır (kesinti-güvenli).
   Node uyarlaması: vekil.js'te göreli `/api/...` yolları `window` yokken
   ham fetch'e düşer (Failed to parse URL). globalThis.fetch, vekil
   yüklenmeden ÖNCE sarmalanır → göreli yollar apiUrl() ile mutlak hale
   gelir; vekil'in yakaladığı YEREL_FETCH bu sarmalayıcı olur.
   Kullanım:
     node tools/dublaj-arsiv-derle.mjs
     node tools/dublaj-arsiv-derle.mjs --tur movie --limit 3
     node tools/dublaj-arsiv-derle.mjs --liste liste.json --cikti cikti.json
     node tools/dublaj-arsiv-derle.mjs --paralel 4 --butce 90000
   ========================================================================== */
import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { apiUrl } from '../src/services/altyapi/apiOrigin.js';
import {
  akisanDilKaniti, arsivEkle, arsOzeti, arsivBirlestir,
} from '../src/services/dogrudan/dublajArsivi.js';

/* ── Node /api/ shim (vekil import EDİLMEDEN önce kurulmalı) ───────────────── */
const hamFetch = globalThis.fetch.bind(globalThis);
globalThis.fetch = (girdi, opts) => (
  typeof girdi === 'string' && girdi.startsWith('/')
    ? hamFetch(apiUrl(girdi), opts)
    : hamFetch(girdi, opts)
);

/* ── Doğrulanmış varsayılan liste (TMDB sayfaları HTTP 200 + başlık
      eşleşmesiyle doğrulandı, 2026-11-10) ─────────────────────────────────── */
const VARSAYILAN_LISTE = [
  // 12 film
  { tmdbTip: 'movie', tmdbId: '550' },     // Fight Club
  { tmdbTip: 'movie', tmdbId: '27205' },   // Inception
  { tmdbTip: 'movie', tmdbId: '157336' },  // Interstellar
  { tmdbTip: 'movie', tmdbId: '299534' },  // Avengers: Endgame
  { tmdbTip: 'movie', tmdbId: '155' },     // The Dark Knight
  { tmdbTip: 'movie', tmdbId: '680' },     // Pulp Fiction
  { tmdbTip: 'movie', tmdbId: '13' },      // Forrest Gump
  { tmdbTip: 'movie', tmdbId: '603' },     // The Matrix
  { tmdbTip: 'movie', tmdbId: '424' },     // Schindler's List
  { tmdbTip: 'movie', tmdbId: '98' },      // Gladiator
  { tmdbTip: 'movie', tmdbId: '238' },     // The Godfather
  { tmdbTip: 'movie', tmdbId: '496243' },  // Parasite
  // 12 dizi (varsayılan sezon 1 / bölüm 1)
  { tmdbTip: 'tv', tmdbId: '1399', sezon: 1, bolum: 1 },   // Game of Thrones
  { tmdbTip: 'tv', tmdbId: '1396', sezon: 1, bolum: 1 },   // Breaking Bad
  { tmdbTip: 'tv', tmdbId: '66732', sezon: 1, bolum: 1 },  // Stranger Things
  { tmdbTip: 'tv', tmdbId: '100088', sezon: 1, bolum: 1 }, // The Last of Us
  { tmdbTip: 'tv', tmdbId: '87108', sezon: 1, bolum: 1 },  // Chernobyl
  { tmdbTip: 'tv', tmdbId: '1438', sezon: 1, bolum: 1 },   // The Wire
  { tmdbTip: 'tv', tmdbId: '70523', sezon: 1, bolum: 1 },  // Dark
  { tmdbTip: 'tv', tmdbId: '2316', sezon: 1, bolum: 1 },   // The Office
  { tmdbTip: 'tv', tmdbId: '1416', sezon: 1, bolum: 1 },   // Grey's Anatomy
  { tmdbTip: 'tv', tmdbId: '60574', sezon: 1, bolum: 1 },  // Peaky Blinders
  { tmdbTip: 'tv', tmdbId: '119051', sezon: 1, bolum: 1 }, // Wednesday
  { tmdbTip: 'tv', tmdbId: '71912', sezon: 1, bolum: 1 },  // The Witcher
  // 8 anime (çekirdeklere 'tv' olarak gider)
  { tmdbTip: 'anime', tmdbId: '1429', sezon: 1, bolum: 1 },  // Attack on Titan
  { tmdbTip: 'anime', tmdbId: '85937', sezon: 1, bolum: 1 }, // Demon Slayer
  { tmdbTip: 'anime', tmdbId: '95479', sezon: 1, bolum: 1 }, // Jujutsu Kaisen
  { tmdbTip: 'anime', tmdbId: '63926', sezon: 1, bolum: 1 }, // One-Punch Man
  { tmdbTip: 'anime', tmdbId: '114410', sezon: 1, bolum: 1 },// Chainsaw Man
  { tmdbTip: 'anime', tmdbId: '209867', sezon: 1, bolum: 1 },// Frieren
  { tmdbTip: 'anime', tmdbId: '61374', sezon: 1, bolum: 1 }, // Tokyo Ghoul
  { tmdbTip: 'anime', tmdbId: '120089', sezon: 1, bolum: 1 },// SPY x FAMILY
];

const GECERLI_TURLER = new Set(['movie', 'tv', 'anime']);
const KANIT_ASIMI_MS = 8000;   // kullanıcı kuralı: 8 sn → 'bilinmiyor'
const PROBE_HAVUZU = 8;        // eşzamanlı dil-kanıtı okuması
const VARSAYILAN_BUTCE_MS = 90_000; // başlık başına tarama bütçesi

function arg(ad, varsayilan = null) {
  const i = process.argv.indexOf(ad);
  return i >= 0 && process.argv[i + 1] !== undefined ? process.argv[i + 1] : varsayilan;
}

function argSayi(ad, varsayilan) {
  const ham = arg(ad, null);
  if (ham == null) return varsayilan;
  const n = Number.parseInt(ham, 10);
  return Number.isFinite(n) && n > 0 ? n : varsayilan;
}

function argKullanim() {
  return [
    'Kullanım: node tools/dublaj-arsiv-derle.mjs [seçenekler]',
    '  --liste <json>        özel başlık listesi (varsayılan: gömülü 12+12+8)',
    '  --cikti <yol>         çıktı JSON (varsayılan: public/dublaj-arsivi/arsiv.json)',
    '  --tur movie|tv|anime  yalnız o türdeki başlıklar',
    '  --limit <n>           en fazla n başlık (filtreleme sonrası)',
    '  --paralel <n>         eşzamanlı başlık (varsayılan: 4)',
    '  --butce <ms>          başlık başına tarama bütçesi (varsayılan: 90000)',
  ].join('\n');
}

/** Liste girdisini doğrular; geçersiz satır null döner. */
function normalizeGiris(g) {
  if (!g || typeof g !== 'object') return null;
  const tip = String(g.tmdbTip || g.tur || '').toLowerCase().trim();
  if (!GECERLI_TURLER.has(tip)) return null;
  const id = String(g.tmdbId ?? g.id ?? '').trim();
  if (!/^\d+$/.test(id)) return null;
  const pozitif = (d) => (Number.isFinite(Number(d)) && Number(d) > 0 ? Number(d) : 1);
  return tip === 'movie'
    ? { tmdbTip: tip, tmdbId: id, sezon: null, bolum: null }
    : { tmdbTip: tip, tmdbId: id, sezon: pozitif(g.sezon), bolum: pozitif(g.bolum) };
}

/** Eşzamanlılık kapısı: aynı anda en fazla `boy` iş. */
class Kap {
  constructor(boy) { this.boy = boy; this.aktif = 0; this.bekleyen = []; }
  async al() {
    while (this.aktif >= this.boy) await new Promise(coz => this.bekleyen.push(coz));
    this.aktif += 1;
  }
  birak() {
    this.aktif = Math.max(0, this.aktif - 1);
    const coz = this.bekleyen.shift();
    if (coz) coz();
  }
}

/* ── Ana akış ──────────────────────────────────────────────────────────────── */
async function main() {
  if (process.argv.includes('--yardim') || process.argv.includes('-h')) {
    console.log(argKullanim());
    return;
  }

  const ciktiYolu = path.resolve(arg('--cikti', path.join('public', 'dublaj-arsivi', 'arsiv.json')));
  const listeYolu = arg('--liste', null);
  const tur = arg('--tur', null);
  const limit = argSayi('--limit', 0) || null;
  const paralel = argSayi('--paralel', 4);
  const butce = argSayi('--butce', VARSAYILAN_BUTCE_MS);

  if (tur && !GECERLI_TURLER.has(tur)) {
    console.error(`geçersiz --tur: ${tur} (movie|tv|anime olmalı)`);
    process.exitCode = 2;
    return;
  }

  let liste = VARSAYILAN_LISTE;
  if (listeYolu) {
    const ham = JSON.parse(await readFile(path.resolve(listeYolu), 'utf8'));
    liste = Array.isArray(ham) ? ham : ham?.liste;
    if (!Array.isArray(liste)) throw new Error('liste dosyası dizi ya da {liste: [...]} içermeli');
  }
  liste = liste.map(normalizeGiris).filter(Boolean);
  if (tur) liste = liste.filter(g => g.tmdbTip === tur);
  if (limit) liste = liste.slice(0, limit);
  if (!liste.length) {
    console.error('işlenecek başlık yok (--tur/--limit/--liste kontrol edin)');
    process.exitCode = 2;
    return;
  }

  // Kesinti-güvenli yeniden başlatma: mevcut çıktı varsa yükle ve birleştir.
  const arsiv = { kayitlar: [] };
  if (existsSync(ciktiYolu)) {
    try {
      const mevcut = JSON.parse(await readFile(ciktiYolu, 'utf8'));
      if (Array.isArray(mevcut.kayitlar)) {
        arsiv.kayitlar = arsivBirlestir({ kayitlar: [] }, { kayitlar: mevcut.kayitlar }).kayitlar;
        console.log(`mevcut arşiv yüklendi: ${arsiv.kayitlar.length} kayıt (üzerine birleşecek)`);
      }
    } catch (_) {
      console.warn('mevcut arşiv okunamadı — sıfırdan başlanıyor');
    }
  }

  // vekil, fetch sarmalayıcısından SONRA yüklenmeli (YEREL_FETCH yakalanır).
  const { kaynakTara } = await import('../src/providers/vekil.js');

  /* Atomik çıktı yazımı: paralel başlıklar sıraya girer, tmp+rename. */
  let yazKuyruk = Promise.resolve();
  async function arsiviYaz() {
    const ozet = arsOzeti(arsiv);
    const belge = {
      surum: '1.0.0',
      uretilmeTarihi: new Date().toISOString(),
      toplamKayit: ozet.toplamKayit,
      trSesliKayit: ozet.trSesliKayit,
      kayitlar: arsiv.kayitlar,
      ozet,
    };
    await mkdir(path.dirname(ciktiYolu), { recursive: true });
    const gecici = `${ciktiYolu}.gecici`;
    await writeFile(gecici, JSON.stringify(belge, null, 2), 'utf8');
    await rename(gecici, ciktiYolu);
  }
  function yazPlanla() {
    yazKuyruk = yazKuyruk
      .then(() => arsiviYaz())
      .catch(h => console.warn(`çıktı yazımı başarısız: ${h?.message || h}`));
    return yazKuyruk;
  }

  process.on('SIGINT', () => {
    console.error('\n[SIGINT] mevcut durum yazılıyor…');
    yazKuyruk
      .then(() => arsiviYaz())
      .catch(() => {})
      .finally(() => process.exit(130));
  });

  /* Aynı adres bir kez okunur (başlık-içi tekrar önlenir). */
  const kanitBellek = new Map(); // adres → {dilDurumu, kanit, diller}
  const probeKap = new Kap(PROBE_HAVUZU);

  async function kaynagiIsle(kaynak, adres, giris) {
    await probeKap.al();
    try {
      let kanit = kanitBellek.get(adres);
      if (!kanit) {
        const basliklar = kaynak?.headers && typeof kaynak.headers === 'object' ? kaynak.headers : {};
        const fetchImpl = (u, o = {}) => hamFetch(u, {
          ...o,
          headers: { ...(o.headers || {}), ...basliklar },
        });
        kanit = await akisanDilKaniti(adres, { fetchImpl, ms: KANIT_ASIMI_MS });
        kanitBellek.set(adres, kanit);
      }
      let host = '';
      try { host = new URL(adres).host; } catch (_) { return; }
      arsivEkle(arsiv, {
        tmdbTip: giris.tmdbTip,
        tmdbId: giris.tmdbId,
        sezon: giris.sezon,
        bolum: giris.bolum,
        host,
        adres,
        dilDurumu: kanit.dilDurumu,
        kanit: kanit.kanit,
        diller: kanit.diller,
      });
    } finally {
      probeKap.birak();
    }
  }

  async function basligiIsle(giris, sira, toplam) {
    let kaynakSayisi = 0;
    const gorulen = new Set();
    const bekleyen = [];

    await kaynakTara({
      tur: giris.tmdbTip,
      tmdbId: giris.tmdbId,
      season: giris.sezon ?? 1,
      episode: giris.bolum ?? 1,
      butceMs: butce,
      izleyici: (is) => {
        for (const k of is.kaynaklar || []) {
          kaynakSayisi += 1;
          const adres = String(k.hamAdres || k.streamUrl || '').trim();
          if (!/^https?:\/\//i.test(adres) || gorulen.has(adres)) continue;
          gorulen.add(adres);
          bekleyen.push(kaynagiIsle(k, adres, giris));
        }
      },
    });
    await Promise.allSettled(bekleyen);
    await yazPlanla();

    const trKayit = arsiv.kayitlar.filter(k => k.tmdbTip === giris.tmdbTip
      && String(k.tmdbId) === giris.tmdbId && k.diller.includes('tr')).length;
    console.log(`[${sira}/${toplam}] ${giris.tmdbId} → kaynak ${kaynakSayisi}, trSes ${trKayit}`);
  }

  console.log(`başlıyor: ${liste.length} başlık · paralel ${paralel} · bütçe ${butce}ms · çıktı ${ciktiYolu}`);
  let sira = 0;
  const isci = async () => {
    for (;;) {
      const i = sira;
      sira += 1;
      if (i >= liste.length) return;
      const giris = liste[i];
      try {
        await basligiIsle(giris, i + 1, liste.length);
      } catch (h) {
        console.error(`[${i + 1}/${liste.length}] ${giris.tmdbId} → hata: ${h?.message || h}`);
        await yazPlanla();
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(paralel, liste.length) }, () => isci()));
  await yazKuyruk;

  const ozet = arsOzeti(arsiv);
  console.log(`bitti: ${liste.length} başlık → toplam ${ozet.toplamKayit} kayıt, ${ozet.trSesliKayit} TR sesli`);
  console.log(`durumlar: ${JSON.stringify(ozet.durumlar)} · çıktı: ${ciktiYolu}`);
}

main().catch(h => {
  console.error(`CLI hatası: ${h?.stack || h}`);
  process.exitCode = 1;
});
