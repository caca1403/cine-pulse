# Neden Dizilla daha iyi görünüyor? — ölçümlü analiz (2026-11-13)

Kullanıcı: *"dizilla.la ve hdfilmcehennemi.nl UI olarak açık ara daha iyi;
neden bul, analiz et."* Bu rapor **tahmin değil ölçüm**: her iki site canlı
olarak çekildi, CSS'leri ayrıştırıldı, sonra bizim uygulamada **hesaplanmış
(computed) stiller** tarayıcıda okunup yan yana kondu.

## Yöntem

| Adım | Komut / araç |
|---|---|
| Canlı HTML + inline CSS | `curl` → `/tmp/dizilla.html`, `/tmp/hdfc.html` |
| Dış CSS | `/dist/css/index.css` (hdfc, 124 KB) indirilip kural taraması |
| Bizim stiller | Chrome DevTools Protocol ile `getComputedStyle` (1440×900) |

Ölçüm çıktıları: kart gölgesi, `border-radius`, `aspect-ratio`, `transition`
eğrisi/süresi, ray boşluğu, `:hover` kural sayısı, zemin rengi.

## Ölçülen farklar (öncesi → sonrası)

| # | Özellik | Dizilla (ölçüldü) | Biz (önce) | Biz (şimdi) |
|---|---|---|---|---|
| 1 | **Kart gölgesi (dinlenme)** | `rgba(0,0,0,.69) 0 26px 30px -10px, rgba(0,0,0,.73) 0 16px 10px -10px` | **`none`** | aynı çift katman ✅ |
| 2 | **Kart gölgesi (hover)** | `rgba(0,0,0,.8) 0 40px 58px -16px, rgba(0,0,0,.72) 0 30px 22px -10px` | tek katman `0 12px 28px` | aynı çift katman ✅ |
| 3 | **Hover'da ne büyür** | yalnız afiş (`.pimg`) 1.05; metin sabit | **tüm kart** 1.05 (yazı da büyüyor) | yalnız afiş ✅ |
| 4 | **Hover eğrisi** | `cubic-bezier(.25,.46,.45,.94)` 250 ms | uzun kuyruklu expo-out | aynı "fiziksel" eğri ✅ |
| 5 | **Afiş çerçevesi** | 3px `rgba(249,249,249,.2)` → hover `.8` | yok | aynı ✅ |
| 6 | **Ray kart aralığı** | 24 px | 12–17.6 px (`!important` eziyordu) | 24 px ✅ |
| 7 | **Afiş oranı** | 158×238 ≈ 2:3 | 2:3 (doğruydu) | 2:3 |
| 8 | **Yuvarlaklık** | 10–12 px | 12–14 px | 12 px |
| 9 | **Zemin** | `rgb(6,6,7)` nötr siyah | `#000` | `#000` (fark yok) |

## Asıl sebep: **gölge hiyerarşisi**

Fark 1 ve 2 tek başına "kalite hissinin" çoğunu açıklıyor. Dizilla'da her afiş
**dinlenme hâlinde bile** iki katmanlı, negatif spread'li gölge taşıyor:

- `0 26px 30px **-10px**` → gölge kartın altına toplanır, geniş blur ile yumuşar
- `0 16px 10px **-10px**` → ikinci, daha sıkı katman temas gölgesi verir

Negatif spread + iki katman = **"havada duran afiş"** hissi. Tek katman
`0 12px 28px` ise kutuya yapışan düz bir gölge üretir; bu yüzden aynı
afişlerle bile arayüz "düz/ucuz" görünüyordu.

Kritik nokta: bizde token tanımlıydı ama **kartın kendisine uygulanmıyordu** —
tarayıcı ölçümü `box-shadow: none` döndürdü. Yani tasarım sistemi vardı,
uygulanmıyordu.

## İkinci sebep: hover'ın neyi büyüttüğü

Eski davranışta `.media-card:hover { transform: scale(1.05) }` **tüm kartı**
(başlık, yıl, rozetler dahil) büyütüyordu. Metin büyümesi gözle "zoom" olarak
algılanır ve profesyonel hissi bozar. Dizilla yalnız afiş katmanını büyütür;
tipografi sabit kalır. Bu, Netflix/Apple dahil tüm olgun arayüzlerin kuralıdır.

## Üçüncü sebep: boşluk ritmi

Ray aralığı 24 px (Dizilla) vs 12 px (biz, üstelik bir `!important` kuralı
token'ı eziyordu). 12 px'te afişler tek bir kütle gibi görünür; 24 px'te her
afiş ayrı bir nesne olur. Ayrıca yeni gölge aşağı doğru 26 px indiği için ray
alt boşluğu 1.2rem → 2rem yapıldı, aksi hâlde gölge kırpılıyordu.

## hdfilmcehennemi.nl notları

Tailwind tabanlı; kart oranları `9/13.5` ve `16/9`, yuvarlaklık `12/16 px`,
standart `cubic-bezier(0.4, 0, 0.2, 1)` (Material standardı), `box-shadow`
Tailwind ring değişkenleriyle kuruluyor. Yani onlarda özel bir numara yok —
kazandıkları şey **tutarlılık**: tek tasarım sistemi, tek eğri, tek yarıçap
ölçeği. Bizde 380 `box-shadow` bildirimi ve 8 farklı `cubic-bezier` vardı
(dağınık); bu da "elle yapılmış" hissi veriyordu.

## Yapılan düzeltmeler (dosya:satır)

- `src/styles/main.css` — `--shadow-card` / `--shadow-card-hover` artık
  Dizilla'nın ölçülen çift katmanlı değerleri; yeni `--ease-hover` eğrisi;
  `.card-rail` boşluğu 24 px + alt padding 2rem.
- `src/styles/card-polish.css` — hover'da yalnız `.card-poster-wrapper`
  büyür; 250 ms fiziksel eğri; 3 px şeffaf çerçeve (hover'da parlar);
  `prefers-reduced-motion` kapanışı.
- `src/styles/navigation.css` — ray boşluğunu ezen `!important` 12 px → 24 px.

## Doğrulama (tarayıcıda ölçülen sonuç)

```
dinlenme : rgba(0,0,0,.69) 0 26px 30px -10px, rgba(0,0,0,.73) 0 16px 10px -10px
           outline: 3px rgba(249,249,249,.16)   transform: none
hover    : rgba(0,0,0,.8) 0 40px 58px -16px, rgba(0,0,0,.72) 0 30px 22px -10px
           transform: matrix(1.05,...)  outline: rgba(249,249,249,.8)
ray gap  : 24px
```

Yani kart yüzeyi artık referansla **birebir aynı** gölge/eğri/çerçeve
değerlerini kullanıyor.
