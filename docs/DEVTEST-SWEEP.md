# DEVTEST — Çoklu Kaynak Tarama Raporu (kaynak çapraz testi)

**Tarih:** 2026-10-13 · **Koşum:** Node runner (cihaz KULLANILMADI) · **Süre:** 16,1 dk · **Kapsam:** 106/106 içerik tamamlandı, içerik tavanına (75 sn) vuran: 0

- Betik: `/tmp/opencode/coklu-tarama.mjs` (repo kodu DEĞİŞTİRİLMEDİ)
- Ham veri (anonim): `/tmp/opencode/tarama-canli.jsonl` · `/tmp/opencode/tarama-ozet.json` · ilerleme günlüğü `/tmp/opencode/tarama.log`
- Tanı betiği (tek sağlayıcı iz): `/tmp/opencode/tani-tekilleri.mjs`

Bu rapor ve tüm çıktı dosyaları **yalnız yıldız kodu** içerir; gerçek site adı ve ham
sağlayıcı id'si hiçbir satırda yoktur (id'ler katalog ALIASES üzerinden yıldız adıyla yazıldı).

## Yöntem

- Uygulamanın kendi toplu yolu çağrıldı: `providerRuntime/inventory.listProviderDefinitions`
  + `providerRuntime/batch.runProviderBatch` (cihazdaki `window.__cpSweep` ölçüm kancasının
  birebir karşılığı). Sağlayıcı başına bütçe **30 sn** (abort sinyalli), sağlayıcı eşzamanlısı 4.
- İçerikler **3'erli paralel** koştu (ağı sakin tutma kısıtı); içerik başına sert tavan 75 sn.
- İçerik listeleri: TMDB `tr-TR`, `popularity.desc`, ilk 20: film (discover/movie), dizi
  (discover/tv), anime (discover/tv `with_genres=16`), çizgi film (discover/movie
  `with_genres=16` + `with_original_language=tr` → 20/20 TR karşılandı, genel doldurmaya
  gerek kalmadı), belgesel (discover movie+tv `with_genres=99`, 10+10). Türler arası
  tekilleştirme nedeniyle film 19, anime 17 içerik kaldı (toplam 96 batch içerik).
  Animasyon türü olan maddeler `anime=true` bayrağıyla tarandı (uygulamanın TMDB
  animasyon tespitiyle aynı davranış).
- **Kısa dizi:** TMDB'de karşılığı yok; Dora kataloğunun kendi keşif listesinden 10 gerçek
  başlık çekildi (uydurma başlık yok). aggregatörün yalıtılmış kısa-dizi dalı gibi yalnız
  Dora + Rhea çağrıldı (film sağlayıcıları devreye girmedi).
- **Bayt doğrulaması:** `providerRuntime/probe.probeStream` — Range isteğiyle ilk 64 KB
  okunur; `#EXTM3U` (+ilk segment/AES anahtar) veya `ftyp/EBML/TS` sihirli baytları aranır.
  İçerik başına en iyi 6 doğrudan kaynak yoklanır (gömülü oynatıcılar elenir); iframe'ler
  hiçbir sayıma girmedi. "İletişim kuran" = en az 1 BAYT-DOĞRULANMIŞ kaynak bulan içerik.

## 1) İletişim oranı (en az 1 doğrulanmış kaynak bulunan içerik)

| Tür | İçerik | İletişim kuran | Oran | Yoklanan örnek | Bayt-doğrulama |
|---|---|---|---|---|---|
| film | 19 | 18 | **%95** | 89 | 76 (%85) |
| dizi | 20 | 14 | **%70** | 59 | 47 (%80) |
| anime | 17 | 13 | **%76** | 68 | 56 (%82) |
| çizgi film | 20 | 9 | **%45** | 48 | 40 (%83) |
| belgesel | 20 | 10 | **%50** | 37 | 35 (%95) |
| kısa dizi | 10 | 10 | **%100** | 19 | 19 (%100) |

Örnek yoklaması bulundu: bir içeriğin geri kalan kaynakları da aynı doğrulanma yüzdesini
taşıması beklenmez; amaç "o içerik gerçekten oynatılabilir bir şeye ulaşıyor mu" sorusudur.

Ulaşamayanların profilleri:
- **film (1/19):** tek ulaşamayandan 2026 yapımı küçük bir yabancı film.
- **dizi (6/20) ve anime (4/17):** 9 madde Latin-olmayan başlıklı (CJK/Hangul) veya
  yabancı talk-show/talk formatı (TR altyazı sitelerinde arşivlenmez). TMDB popülerlik
  listesi bu içeriklerle kirleniyor; sıfırın büyük kısmı **liste kirliliği**, motor hatası değil.
- **çizgi (11/20):** 11'i tamamen TR-animasyon film (bkz. §5 — Lumen/Pico sessiz).
- **belgesel (10/20):** çoğu İngilizce/Yabancı kanon-dışı belgesel; Perseus arşivi TR
  ağırlıklı (bkz. §2, §5).

## 2) Kod adı katkısı (tür başına ilk 5 yıldız — kaynak adedi, ürettiği içerik sayısı)

| Tür | 1. | 2. | 3. | 4. | 5. | Toplam kaynak |
|---|---|---|---|---|---|---|
| film | Atlas 43 (12) | Bellatrix 20 (10) | Lyra 19 (17) | Polaris 17 (12) | Vela 13 (11) | 163 |
| dizi | Atlas 30 (7) | Betelgeuse 15 (8) | Halo 12 (12) | Kitsu 12 (1)* | Lyra 9 (9) | 113 |
| anime | Kitsu 22 (2) | Aria 20 (4) | Atlas 18 (9) | Betelgeuse 18 (11) | Lyra 17 (13) | 129 |
| çizgi film | Atlas 30 (7) | Bellatrix 14 (7) | Vela 12 (6) | Pulsar 10 (5) | Lyra 7 (6) | 81 |
| belgesel | Betelgeuse 9 (5) | Atlas 9 (3) | Lyra 7 (7) | Bellatrix 6 (3) | Muhlif 2 (2) | 43 |
| kısa dizi | Dora 10 (10) | Rhea 9 (9) | — | — | — | 19 |

\* dizi listesindeki tek animasyon maddesi anime bayrağıyla tarandı; Kitsu 12 kaynağı o
tek içerikten geldi.

**Görev sorularının cevabı:**
- **Perseus belgeselde üretiyor mu?** Neredeyse hayır: 20 belgesel içeriğin **1'inde 1
  kaynak** (TR başlıklı `Uçak Kazası Raporu`). Kök nedenler (§5'te): katalog kapısı
  yüzünden belgeselin **film tarafına hiç sorulmadı**; arşiv TR-ağırlıklı olduğundan
  yabancı başlıklarda slug/liste eşleşmesi yok; adres defterinde (siteurl.txt) belgesel
  bağı bulunamadı, yedek tabanla çalıştı. Portun kendisi **canlı** (TR başlıkta doğrulandı).
- **Lumen çizgide üretiyor mu?** Çizgi film listesinde **0/20** (20 içeriğin tamamı
  TR-animasyondu). Tek üretimi anime listesinde (Naruto ×2). Kök neden: içerik
  sayfalarının arkasındaki hız-sınırı (HTTP 429) doğrudan yolu bloke ediyor (JSON arama
  ucu açık kaldı — Naruto istisnası bazı isteklerin geçebildiğini gösteriyor); ayrıca
  tam başlık (`"X: Y"`) arama önerisinde bulunamıyor ve film modunda tam-eşik eşiği
  düşük eşleşmeleri eliyor. Yani **üretmiyor ama neden port çürüğü + korumalı sayfa**,
  ölü kod değil.

## 3) Süre

- İçerik ortalaması: **batch 29,3 sn** (tüm içerikler 26,7 sn; medyan 33,1 sn; en uzun 61,0 sn).
- Sağlayıcı başına 30 sn tavanı **çalışıyor**: tüm türlerde gözlenen en yüksek tek
  sağlayıcı gecikmesi 30,0 sn (zaman aşımı disipline uyuyor); içerik düzeyinde 75 sn'lik
  sert tavana hiç yaklaşılmadı (0/106).
- **Hedef ortalama ≤12 sn: TUTMADI** (17/96 batch içerik ≤12 sn). Neden: uygun
  sağlayıcı sayısı 23–28 iken hat sayısı 4; her listede birkaç sağlayıcı 30 sn'lik
  bütçesinin tamamını yakıyor ve kuyruk sırası bekliyor. Cihazda gizli WebView +
  yerel IP bu uzun kuyruğun bir kısmını kısaltır; Node koşumunda uzun kuyruk daha ağır.
- Kısa dizi yolu: ortalama **1,7 sn** (yalıtılmış 2 sağlayıcı — hedefin çok altında).

## 4) Kısa dizi sağlamlığı

Dora keşif listesinden 10 gerçek başlık; her başlık 1. sezon 1. bölüm için her iki
yıldızda dublaj+altyazı şeritleriyle çözüldü ve çıkan tüm akışlar bayt-yoklamasından geçti:

- **Dora: 10/10 başlıkta 1'er kaynak** — tamamı oynatılır (byte-doğrulama %100).
- **Rhea: 10 başlığın 9'unda 1'er kaynak** — tamamı oynatılır (%100).
- Toplam 19/19 kaynak doğrulandı; içerik başına süre 1,2–2,3 sn.
- **Semptom:** tek boş (Rhea 0) başlıkta Rhea araması da sonuç vermedi (`aramaBuldu: false`)
  → semptom **arama/archive kapsamı**, ölü yayın DEĞİL. Yayın hatlarının kendisi son
  derece sağlam; sorun iki yıldızın arşiv örtüşmesinin ~%90 olması.

## 5) Eksik kültür (tür → yoksun kod adları ve kök neden sınıfı)

Uygun 23–28 yıldıza rağmen hiç (veya sıfıra yakın) üretim yapanlar:

| Tür | Hiç üretmeyen / dikkat çeken | Neden sınıfı |
|---|---|---|
| film | Arcturus, **Betelgeuse (yalnız film hattı sessiz)**, Cosmo, Hydra, Lumen, Nimbus, Perseus, Pico, Regulus, Sirius, Toliman, Zenit | ölü adres / CF-429 koruması / kapsam |
| dizi | **Orion ve Vela dizi hattı 0 kaynak**, Arcturus, Cosmo, Hydra, Lumen, Nimbus, Perseus, Regulus, Rhea, Toliman, Zenit | film odaklı arşiv / ölü adres |
| anime | Arcturus, Cosmo, Dora, Hydra, Nimbus, Orion, Perseus, Pico, Regulus, Rhea, Toliman, Zenit (Dora/Rhea anime listesinde uygun ama arşivleri kısa-dizi odaklı) | arşiv + ölü adres |
| çizgi film | **Lumen 0/20, Pico 0/20 (yoksunluğun ana hikâyesi)**; Aquila, Aria, Tera, Kitsu, Halcyon, Halo, Nero, Orion, Sirius (TR-animasyon film arşivleri yok); Arcturus, Cosmo, Hydra, Regulus, Toliman, Zenit (küresel sessizler) | CF-429 (bkz. §2) + TR-film kapsamı |
| belgesel | **Perseus film tarafına hiç sorulmuyor** (katalog `kinds→TYPE` kapısı onu tv-only yapıyor; kendi `kimlik` beyanı movie+tv olsa da), Arcturus, Corvus, Cosmo, Dora, Echo, Hydra, Lumen, Pico, Polaris, Regulus, Toliman, Zenit | **kapı/kapsam hatası** (port sağlam) |
| tamamı (5 türde de 0) | **Zenit (bilinen adres düşüşü — "adres açılmıyor" kaydı düştü), Arcturus, Cosmo, Hydra, Regulus, Toliman** | ölü adres / erişilemeyen sağlayıcı |

Öne çıkan düzeltme notları (kod değiştirilmedi, yalnız tespittir):

1. **Katalog kapısı:** Perseus'un katalog satırı `kinds:["belgesel","dizi"]` tür
   haritasında onu tv-only yapıyor; belgesel FILMLERİ hiçbir taramada ona sorulmuyor
   (20 içeriğin 10'u). Sağlayıcının kendi `kimlik` beyanı movie+tv olduğunu söylüyor →
   katalog satırı `film`'i de kapsamalı. Bu, "belgeselde 20/20'de 0" semptomunun yarı nedeni.
2. **Çizgi film çifti aynı kaynağa düşüyor:** çizgi filmin iki yıldızı (Lumen, Pico)
   aynı siteden besleniyor ve sitenin HTML sayfaları bu ağdan 429 dönüyor → tür %45'te
   kalıyor. Cihazda gizli WebView farkı test edilmeli; olmazsa arama ÖNERİSine
   kısaltılmış-başlık denemesi (tam `"Başlık: Alt Başlık"` → iki nokta öncesi) eklenebilir.
3. Zenit bilinen düşüktür; listeden düşürülmesi/kapatılması gündeme alınabilir.

## Koşum notları / ölçüm hatalığı

- Node koşumu bu makinenin IP'sinden yapıldı; cihazdaki CapacitorHttp + gizli WebView
  yolları devre dışıydı. CF/429 korumalı sayfalar (çift çizgi yıldızı, Sirius, Arcturus)
  cihazda daha iyi sonuç verebilir — oranlar **muhafazakâr alt sınırdır**.
- Zenit dışındaki "boş" kayıtların çoğu hatayla değil sessiz boşlukla döndü (arama
  bulamıyor → `bosNeden` boş) — iletişim oranı buna göre tanımlandı.
- Gömülü oynatıcılar ve ölü yayın eleme kuralları aynen uygulandı; kaynak sayıları
  yalnızca doğrudan oynatılabilir adayları sayar.
- Canlı tekrar koşum: `node /tmp/opencode/coklu-tarama.mjs` (JSONL'e artımlı yazar,
  tamamlanmış içerikleri atlar, özet `tarama-ozet.json`).
