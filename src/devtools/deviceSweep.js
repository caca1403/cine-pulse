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
import { kaynakCoz } from '../providers/vekil.js';

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

export function kancayiKur() {
  if (!ACIK) return false;
  if (typeof window === 'undefined') return false;
  window.__cpSag = sagTek;
  window.__cpSweep = sagTara;
  window.__cpKaynak = kaynakOzeti;
  window.__cpSaglik = saglikOku;
  window.__cpPolitika = politikaUret;
  window.__cpEsik = beklemeEsigi;
  return true;
}

export const KANCA_ACIK = ACIK;