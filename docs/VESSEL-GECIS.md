# Vessel Geçişi — taban çizgisi + kontrol listesi · ölçüm 2026-10-13
> DURUM GÜNCELLEME (aynı gün): KARAR = B senaryosu (kod PUBLIC + Release'ler public);
> "private" planı uygulanmadı — bu belgedeki rotate/env listesi public akış için de geçerli.
> Yayın hiç kesilmedi; API hijyeni (ölü uç silme, site adı → kod adı, raw-bağımlılığı
> kesme) bu belge sonrası uygulandı ve ücrete alındı → silinen 18 uç artık 404 döner.
Yayın: https://cine-pulse-drab.vercel.app → HTTP 200 (özel alan adı yayında değil; cinepulse.studio DNS çözülümüyor).
İndeks imzası (geçiş sonrası birebir aynı olmalı): index-KV9kM_Sm.js · vendor-capacitor-DGWR5Llo.js · index-C53FSMwo.css (index 6118 B).

## Uç tablosu — üretim, GET `?probe=1` (ham: /tmp/opencode/baseline.json, script: /tmp/opencode/probe.mjs)
| Sınıf | Uçlar (HTTP) | Gövdede GERÇEK site adı ifşası |
|---|---|---|
| CANLI — istemci çağırıyor | epg·release·download_apk·resolve·subtitles·szd·jet·dzs·ddz 200; proxy·hls_proxy·img_proxy·mkv_stream·live_tv_stream·fanart 400 (parametre bekliyor); live_sources 200; sibnet·czm·kvip 403 (upstream/CF); rtv 403 (HMAC bekliyor); snx 502 (upstream düştü); l·s·v·f·kv·hd alt-yolla çalışır | (ölçüm anı) 4 uç gövdede gerçek kaynak adı veriyordu → SONRAKİ DALGADA HEPSİ KOD ADINA ÇEVRİLDİ: szd→Luna · jet→Nimbus · dzs→Atlas · live_sources→Pulsar 1/2/3. Doğrulama: canlı yanıt taramasında gerçek ad 0. |
| YETİM — src grep=0 ama 200 dönüyordu | (tümü SİLİNDİ · kanıt üçlüsü: `src/` grep=0 + üretim 4xx/5xx + yerel 404) webteizle_stream · hdfc_stream · flz · hfd · fex · dzm · dzb | silme ile gövde ifşası da sona erdi |
| ÖLÜ — grep=0 + 4xx/5xx/timeout | (tümü SİLİNDİ · aynı kanıt üçlüsü) ara/oner · fmk_sub · dbl · fin · vidmixi · dzb_stream · fmk(+3 varyant) · dzl · dzp · dzr · dzy · dzyo · hdi · hdfc · hdm | — |
CORS: catch-all her yanıtta `Access-Control-Allow-Origin: *` veriyor; epg, download_apk ve fin/vidmixi rewrite'ları CORS vermiyordu (silindi). Canlı TV yedek listesi artık sunucudan statik okunuyor (yerel kopya ölçümü: 230 kanal).

## GEÇİŞ KONTROL LİSTESİ
1. Vercel Dashboard → Settings → Environment Variables — repodan çıkacak adlar (DEĞER YAZMA): `FANART_API_KEY` (görsel servisi; zaten env'den okunuyor); `TMDB_API_KEY` + 2. TMDB key'i (film/dizi arama; `CP_TMDB_KEYS`/`CP_TMDB_API_KEY` dalına taşındı, yedekli); `VITE_ANIZIUM_*` ×6 (Aria anime — build'de JS paketine gömülür, dashboard tek başına gizlemez; rotate sonrası yalnız env); Polaris (canlı ayar servisi) ve Nova panel imzası için istemci-anahtar bulunamadı — gerekirse `CP_RTV_BASE`, `CP_SNX_*`. Kendi worker vekilimizin ADRESİ bu belgede yazılmaz: `VITE_ANIZIUM_WORKER` adıyla env'de tutulur, eski gömülü kopyalar rotate ile silinmeli (adres zaten geçmiş commit'lerde — GÜVENLIK.md madde 4).
2. Vercel GitHub App izni İPTAL EDİLMEZ; repo yeniden adlandırılırsa Vercel'de Edit Git Provider ile yeni ad seçilmezse build durur.
3. Hobby Deployment Protection: private sonrası preview URL'leri Vercel-login ister, üretim adresi etkilenmez; preview paylaşılacaksa Password Protection ekle veya korumayı kapat.
4. Kendi deposundan (raw.githubusercontent.com/caca1403) canlı TV listesi çekimi KESİLDİ → `api/_liveSources.js` artık üçüncü-party canlı listeyi birinci, depodaki statik kopyayı (`api/data/`) yedek yapıyor; src/'de kendi deposundan raw çeken kod yok (0). patr0nq/phisher98 listeleri üçüncü-party public repo'lar — etkilenmez; GÜVENLIK.md'deki "kendi kopyamıza taşı + desen doğrulaması" planı geçerli.
5. Geçiş sonrası 5 dk doğrulama: `/` açılıyor + arama ≥1 kaynak veriyor + yukarıdaki tablonun HTTP kodları BİREBİR aynı + index asset hash'leri değişmemiş (yeni build yoksa).

Özet: canlı/fonksiyon-veren ~26 · yetim-fakat-canlı 7 · ölü 18 · gövdede site adı sızdıran 16 uç.
Sonuç: repo PUBLIC kaldı (B senaryosu); Vercel build akışı kesilmedi. Rotate edilecek gizli unsurlar (değerleri değil, adları): FANART_API_KEY, TMDB key ×2, ANIZIUM_* ×6 (Aria oturumu), canlı TV liste kimliği (Pulsar yedek listesi URL'sinde gömülü), Nova panel imzası. Ayrıntı: docs/GUVENLIK.md + docs/RELEASE.md.
