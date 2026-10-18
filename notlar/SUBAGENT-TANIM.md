# Subagent Tanımı — "Kaynak Araştırmacısı" (HAZIR, BAŞLATILMADI)

Kullanıcı "başlayın" diyince bu prompt ile `general` subagent (hızlı model) dispatch edilecek.
O ana kadar HİÇBİRŞEY koşmayacak. Amaç: kod DEĞİŞTİRMEDEN, kanıta dayalı kök neden raporu.

## Dispatch promptu (olduğu gibi kullanılacak)

> CinePulse (çalışma dizini /home/cagatay/İndirilenler/cine-pulse-main) APK'sında bazı içeriklerde
> kaynak yıldızları (ör. Polaris=tvr, Orion=hdfc) görünmüyor. GÖREVİN: salt-okur araştırma + rapor.
> KESİN KURALLAR: hiçbir dosyayı değiştirme, git commit/push YOK, cihazda uygulama verisi silme YOK.
>
> Ortam: telefon SM-S931B `RFGL4384VSR`, paket `com.cinepulse.studio.devtest`.
> - CDP: `adb -s RFGL4384VSR forward tcp:9333 localabstract:webview_devtools_remote_$(adb -s RFGL4384VSR shell pidof com.cinepulse.studio.devtest | tr -d '\r')`
>   — forward her install/reboot'ta ölür, her oturum başında yenile. App kapalıysa:
>   `adb -s RFGL4384VSR shell "monkey -p com.cinepulse.studio.devtest -c android.intent.category.LAUNCHER 1"` + 15sn bekle.
> - Yoklama: `CINEPULSE_PKG=com.cinepulse.studio.devtest timeout 110 node tools/cihaz-cdp.mjs "<js>"`
>   — uzun işlerde tek değerlendirme 300sn duvarına çarpar; `window.__cpSweep` fire-and-forget + sonuç poll et.
> - Provider tekil test: `window.__cpSag('<id>', {title, originalTitle, type:'movie'|'tv', season, episode, tmdbId})`
>   → `{n, ms, kaynaklar[], iz[]}`. `iz[].yol:"bos"` = hızlı boş/404; `uz≈2300` + `yol:"akilli"` = gerçek sayfa.
> - Çapraz kontrol: aynı URL'yi cihaz webview'inden ham `fetch` ile çek (AbortController 6sn); `bos`/0 kaynak
>   **ham fetch kanıtı olmadan** asla "kod bozuk" veya "site içerik yok" diye yorumlanmaz — site aileleri
>   (`.now/.nl/.com`, player `.mobi`) gün boyu dönüşümlü 503/challenge veriyor.
>
> İŞLER:
> 1. Polaris (`tvr`): pluginCatalog'ta durumu, DEVRE_DISI kontrolü; 3 farklı içerikte `__cpSag('tvr',…)` izi + ham fetch.
> 2. Orion (`hdfc`): en az 8 başlık (film/dizi karışık, "12 Monkeys", "Riverdale", "Stranger Things" dahil) —
>    her biri için denenen slug'lar + durum kodları. Hangi kalıp ne sıklıkta 200 dönüyor say.
> 3. Tür taraması: film/dizi/anime/belgesel/kısa × 3'er başlık `__cpSweep` (fire-and-forget, JSON'u
>    /tmp/opencode/ara-tarama.json'a yazdır, 30sn'de bir poll). Tür başına: kaynak sayısı, görünen yıldızlar, sessiz kalanlar.
> 4. Rapor (tek dosya /tmp/opencode/KAYNAK-ARASTIRMA-RAPORU.md): kayıt başına kök neden sınıflandırması
>    (ORTAM / KOD / SLUG / TASARIM-GEREĞİ) + her iddia için ham kanıt satırı + tek satırlık önerilen düzeltmeler.
>    Kod yazma, öneri yaz.

## Bekletilen işler (rapor gelince ana oturumda)
- notlar/YAPILACAKLAR.md maddeleri 4-5 (orion.js commit/geri-al kararı, belgesel kapsamı).
