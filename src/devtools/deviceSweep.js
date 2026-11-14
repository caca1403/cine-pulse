/* ==========================================================================
   CinePulse Studio — Cihaz ölçüm kancası (device sweep)
   --------------------------------------------------------------------------
   `tools/cihaz-cdp.mjs` ve `tools/cihaz-sag-test.mjs` bu kancayı çağırır:
       window.__cpSag('<kahramanKodu>', { tur, tmdbId, season, episode })
       window.__cpSweep({ tur, tmdbId, season, episode })
   Ölçüm köprüsü teardown'da kaldırılmıştı; bu dosya onu geri getirir ve
   ÜÇ yüzeyi birden açar:
     1) kaynak katmanı  — kahraman kodları + durum (canlı/kapalı/bilinmiyor)
     2) akış sağlığı    — oynatıcının anlık durumu (IDLE…ENDED)
     3) oynatıcı        — kalite sırası, kaynak sayısı, canlı başlık

   Kapı: yalnız `VITE_DEVICE_SWEEP=1` ile derlemede açılır. Üretimde kanca yok.
   ========================================================================== */

import { KAYIT, kayitlar, KAPALI, durumOzeti } from '../providers/kayit.js';
import { SAGLIK, SAGLIK_ETIKET, saglikRaporu } from '../services/oynatici/streamHealth.js';
import { beklemeEsigi, politikaUret } from '../services/oynatici/stallPolicy.js';
import { kaynakCoz, kopruFetch } from '../providers/vekil.js';
import { yildizArsiviTara, YILDIZ_KAYNAKLAR } from '../services/dogrudan/multiDubEndgame.js';
import {
  sicilOzeti, sicilIpucu, icerikAnahtari, kaynakPuani,
} from '../services/dogrudan/dublajSicili.js';
import {
  sicil, dublajZekaDurumu, dublajaGoreSirala, oynatmaGeriBildir,
  saglayiciAnahtari, tohumuYukle, onekleriYukle,
} from '../services/kaynak/dublajZekasi.js';

const ACIK = import.meta.env?.VITE_DEVICE_SWEEP === '1' || import.meta.env?.DEV === 'true';

/** Oynatıcının anlık sağlığı — PlayerModal günceller, ölçüm okur. */
let canliSaglik = { durum: SAGLIK.IDLE, detay: {} };

export function saglikYayinla(durum, detay = {}) {
  canliSaglik = { durum, detay, ...saglikRaporu(durum, detay).split(' · ') };
  return canliSaglik;
}

export function saglikOku() {
  return { ...canliSaglik, etiket: SAGLIK_ETIKET[canliSaglik.durum] || canliSaglik.durum };
}

/** Kaynak katmanı özeti — arayüzde görünen adlar (kahraman kodu) dışında hiçbir şey. */
export function kaynakOzeti(tur = 'movie') {
  return {
    tur,
    toplam: KAYIT.size,
    ...durumOzeti(),
    kapaliListesi: [...KAPALI],
    kayitlar: kayitlar(tur).map(([ad, k]) => ({
      ad,                    // kahraman kodu — gerçek site adı YOK
      turler: k.turler,
      durum: k.durum,
    })),
  };
}

/** Tek kahraman kodunu ölç. */
async function sagTek(ad, arg = {}) {
  const sonuc = await kaynakCoz({
    id: ad,
    tur: arg.tur || 'movie',
    tmdbId: arg.tmdbId || '',
    imdbId: arg.imdbId || '',
    season: arg.season || 1,
    episode: arg.episode || 1,
    // KAYIT tavanını uygula (havuz aynısını yapar, vekil.js taramaHavuzu):
    // gizli-WebView kayıtları (Arcturus/Lyra… 26 sn) 15 sn varsayılanla
    // haksız yere butce-asim yiyordu (cihaz 2026-10-25: Arcturus 0 kaynak/
    // 15 sn → 3 kaynak/22 sn).
    butceMs: arg.butceMs ?? KAYIT.get(ad)?.tavaniMs ?? undefined,
  });
  return {
    ad: sonuc.kodAdi || ad,
    kaynakSayisi: sonuc.kaynaklar.length,
    kaliteler: sonuc.kaynaklar.map(s => s.quality),
    sure: sonuc.sure,
    hata: sonuc.hata,
    // kaynak ADLARI dışarı verilmez; yalnız kod adı ve kalite
    iz: sonuc.iz.map(k => k.ad),
  };
}

/** Tüm kayıtları tür için ölç (cihaz saha taraması). */
async function sagTara(arg = {}) {
  const tur = arg.tur || 'movie';
  const liste = kayitlar(tur);
  const t0 = Date.now();
  const sonuclar = [];
  for (const [ad] of liste) {
    // eslint-disable-next-line no-await-in-loop
    sonuclar.push(await sagTek(ad, { ...arg, tur }));
  }
  return {
    tur,
    sure: Date.now() - t0,
    toplam: sonuclar.length,
    yayinVeren: sonuclar.filter(s => s.kaynakSayisi > 0).length,
    sonuclar,
  };
}

/* ── YILDIZ ARŞİVİ + TR DUBLAJ ZEKÂSI ölçüm kancaları ─────────────────────
   2026-11-14: Kullanıcı "20-30 içerikte yıldız arşiv taramasının hem sitede
   hem uygulamada oynatıldığını gerçekten test et" istedi. Bu kancalar
   ÜRETİM ZİNCİRİNİN aynısını sayfa içinden koşturur — ayrı kopya yok:
       window.__cpYildizTara({baslik, orijinalBaslik, imdb, yil, tmdbTip, tmdbId})
       window.__cpDublajDurum()        → sicil özeti + ipuçları
       window.__cpDublajSirala(liste, icerik) → kademeli sıralama
       window.__cpDublajGeriBildir({...})     → oynatma geri bildirimi
       window.__cpTohumYukle()         → tohumu depoya yaz (kalıcı)
   Yine VITE_DEVICE_SWEEP=1 kapısı arkasında; üretim paketine girmez. */

/** Yıldız arşivini tara (4 site paralel) + sicile yaz. */
async function yildizTara(arg = {}) {
  const t0 = Date.now();
  try {
    const hedef = {
      baslik: arg.baslik || '',
      orijinalBaslik: arg.orijinalBaslik || arg.baslik || '',
      imdb: arg.imdb || '',
      yil: arg.yil || null,
      tmdbTip: arg.tmdbTip || arg.tur || 'movie',
      tmdbId: arg.tmdbId || '',
      sezon: arg.sezon ?? null,
      bolum: arg.bolum ?? null,
      simdi: Date.now(),
    };
    const r = await yildizArsiviTara(hedef, { sicil: sicil(), fetchFn: kopruFetch, ms: arg.ms || 12000 });
    return {
      sure: Date.now() - t0,
      adaySayisi: r.adaylar.length,
      eslesenSayisi: r.eslesen.length,
      kaynakDurumu: r.kaynakDurumu,
      eslesmeler: r.eslesen.map((a) => ({
        kaynak: a.kaynak, baslik: a.baslik, yil: a.yil,
        dilDurumu: a.dilDurumu, kanit: a.kanit,
        adres: a.adres, skor: a.eslesmeSkoru,
      })),
      ozet: r.ozet,
    };
  } catch (hata) {
    return { sure: Date.now() - t0, hata: String(hata?.message || hata), adaySayisi: 0, eslesenSayisi: 0 };
  }
}

/** Sicil durumu (özet + bu içerik için ipuçları). */
function dublajDurum(arg = {}) {
  const icerik = arg.icerik || (arg.tmdbId
    ? icerikAnahtari({ tmdbTip: arg.tmdbTip || 'movie', tmdbId: arg.tmdbId, sezon: arg.sezon, bolum: arg.bolum })
    : '');
  try {
    const d = dublajZekaDurumu(icerik);
    return {
      ...d,
      kaynaklar: (d.ipuclari || []).map((x) => ({ saglayici: x.saglayici, guc: Math.round(x.guc * 10) / 10 })),
    };
  } catch (hata) { return { hata: String(hata?.message || hata) }; }
}

/** Kademeli sıralamayı gerçek sicille uygula. */
function dublajSirala(liste, icerik) {
  try {
    const r = dublajaGoreSirala(liste, icerik);
    return {
      oncesi: (liste || []).map((x) => x.id),
      sonrasi: r.map((x) => x.id),
      degisti: JSON.stringify((liste || []).map((x) => x.id)) !== JSON.stringify(r.map((x) => x.id)),
      adet: r.length,
    };
  } catch (hata) { return { hata: String(hata?.message || hata) }; }
}

/** Oynatma geri bildirimi (kendini onarma döngüsü). */
function dublajGeriBildir(arg = {}) {
  try {
    return {
      ok: oynatmaGeriBildir({
        basarili: Boolean(arg.basarili),
        icerik: arg.icerik,
        kaynak: arg.kaynak,
      }),
    };
  } catch (hata) { return { ok: false, hata: String(hata?.message || hata) }; }
}

/** Tohumu + önekleri yükle (cihazda kalıcı sicil). */
async function tohumYukle(arg = {}) {
  try {
    const onek = await onekleriYukle();
    const n = await tohumuYukle({ zorla: Boolean(arg.zorla) });
    return { onekSayisi: onek, yuklenen: n, ozet: dublajZekaDurumu().ozet };
  } catch (hata) { return { hata: String(hata?.message || hata) }; }
}

export function kancayiKur() {
  if (!ACIK) return false;
  if (typeof window === 'undefined') return false;
  window.__cpSag = sagTek;
  window.__cpSweep = sagTara;
  window.__cpKaynak = kaynakOzeti;
  window.__cpSaglik = saglikOku;
  window.__cpPolitika = politikaUret;
  window.__cpEsik = beklemeEsigi;
  // TR dublaj zekâsı + yıldız arşivi kancaları
  window.__cpYildizTara = yildizTara;
  window.__cpDublajDurum = dublajDurum;
  window.__cpDublajSirala = dublajSirala;
  window.__cpDublajGeriBildir = dublajGeriBildir;
  window.__cpTohumYukle = tohumYukle;
  window.__cpYildizKaynaklari = () => YILDIZ_KAYNAKLAR.map((k) => ({ kod: k.kod, ad: k.ad }));
  window.__cpSicilOzeti = () => sicilOzeti(sicil());
  window.__cpSicilIpucu = (icerik) => sicilIpucu(sicil(), icerik, { simdi: Date.now(), limit: 10 });
  window.__cpKaynakPuani = (aday, icerik) => kaynakPuani(sicil(), aday, icerik, { simdi: Date.now() });
  window.__cpSaglayiciAnahtari = saglayiciAnahtari;
  return true;
}

export const KANCA_ACIK = ACIK;