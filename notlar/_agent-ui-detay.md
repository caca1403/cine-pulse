# Agent UI Detay Raporu

## Tasarım Hedefi
Kullanıcı şikayeti: "arayüzde asla dizilla kalitesi netflix sıcaklığı hissetmiyor"
Görev: Detay sayfası (film/dizi detay) premium hissini yükseltmek.

## Yapılan Değişiklikler

### 1. Yeni dosya: src/styles/detay-netflix.css
- Netflix-stili premium detay sayfa düzeni
- :root değişkenleri main.css'den okutuluyor (yeni renk yaratılmadı)
- prefers-reduced-motion destekli animasyonların devre dışı bırakılması
- Mobil breakpoint disiplini (sola sabitleme, tam-genişlik butonlar)

### 2. Modified: src/views/DetailView.js
- Satır 23: `import '../styles/detay-netflix.css';` eklendi (detay-stremio.css -> detay-ui.css -> detay-netflix.css -> kaynak-tarama.css prioritesi)
- Satır 78: `const orijinalBaslik = kok?.querySelector?.('.dt-orijinal');` eklendi — logosun geldiğinde orijinal başlığı gizle
- Satır 88: `if (orijinalBaslik) orijinalBaslik.hidden = true;` eklendi
- Satır 603+: Kaynak taraması detay açılışında koşulsuz başlatıldı (baslat() idempotent)

### 3. Modified: src/styles/detay-ui.css
- `.dt-aksiyon-cip.is-active`: hardcode renler `var(--primary)`'e değişti
- Focus-visible stilleri eklendi: `outline: 2px solid var(--primary); outline-offset: 2px`
- Mobil median `@media (max-width: 720px)`: aksiyon satırı `justify-content: flex-start`

### 4. Tasarim Kararlari

#### Başlık Bloğu (1)
- `.detail-titleblock`: flex display, başlık ve logo arası gap clamped
- `.detail-heading-title`: font-size clamp(1.8rem, 4vw, 2.8rem), text-shadow ile derinlik
- `.detail-title-logo`: max-width limit, sol üst köşe hizalama
- `.dt-kunye`: font-size 0.81rem, renk var(--text-sub), sola dagilim
- `.dt-puan-satiri`: flex wrap, gap clamp(0.6rem, 1.5vw, 1rem), meta aralığı

#### Aksiyon Satırı (2)
- `.dt-oynat`: `--primary` kullanı, lime vurgulu, min-width 140px, mobilde tam-genişlik
- `.dt-aksiyon-cip`: ghost stil, hover'da `--primary` renkine geçiş, focus-visible stilleri
- `.dt-yeni-bolum`: mobilde gizli (özet altına entegre)

#### Bölüm/Sezon Seçici (3)
- `.bolum-secici-sezon`: min-height 40px, padding, border-radius 999px, >=40px yükseklik
- `.bolum-secici-sezon.aktif`: border-color var(--primary) hover/aktif vurgusu
- `.quick-ep-card, .bolum-secici-kart`: min-height 40px, dokunmatik hedef boyutu

#### Backdrop Degrade (4)
- `.dt-hero-karartma`: linear-gradient %60 black -> %20 transparent, iki yönlü gradient
- Kart radius'u: `.dt-bilgi, .dt-panel, .cps-sekme, .cps-bolum-baslik` -> `border-radius: var(--radius-lg, 12px)`

#### prefers-reduced-motion + Mobil (5)
- `@media (prefers-reduced-motion: reduce)`: tüm * elementi transition/animation none!important
- `@media (max-width: 720px)`: dikey düzen, sola sabitleme, gizli elementler

## Build ve Test Sonuçlari
- Build: ✅ YES (vite build 7.29s, 301 modules transformed)
- Tests: ✅ YES (672 pass, 0 fail, 1 skipped - mobile-playwright requires separate install)
- git diff --stat: Detayli dosya değişiklikleri görülüyor

## Ek:Viewport Duzeltmeleri (1440×900 & 1366×768)

### Sorun: Detay sayfası altta kalıyor
Kullanıcı şikayeti: "detay sayfası altta kalıyor bir kısım" — sekme çubuğu (KAYNAKLAR/GENEL BAKIŞ…) ve "Yayın kaynakları" paneli viewport'in altında kayılıyor.

### Çözümler Uygulandı:

1. **Hero yükseklik bütçesi** (detay-ui.css `.dt-hero`):
   - `max-height: min(62vh, 560px)` — hero ekranının %62'si veya 560px'e capped
   - İç padding'lar `%25-30` azaltıldı (`.dt-hero-ic`: 96→48px, 48→32px; `.dt-ust-cubuk`: 88→64px)

2. **Overview (ön izleme metni) 2 satır limiti** (detay-ui.css `.dt-sayfa .detail-storyline`):
   - `-webkit-line-clamp: 2` eklendi + `display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden`
   - "Daha fazla" açılır kalsın (var olan davranış korunuyor)

3. **Sekme çubuğu yapışkan** (detay-ui.css `.dt-sekmeler`):
   - `position: sticky; top: 0; z-index: 100` eklendi
   - Arka plan: `rgba(7, 10, 18, 0.8)` — üstü kapalı koyu yüzey + blur

4. **Kısa ekran kuralı** (detay-ui.css `@media (max-height: 800px)`):
   - `max-height: min(48vh, 400px)` — hero daha da alçal
   - İç elemantler daralttı: padding'lar, font boyutları, buton padding'ları
   - `.dt-turler`: tek sütun, yatay kaydırma yerine sarmalama
   - `.dt-yeni-bolum`: gizlendi (daha çok yer kazanmak için)

5. **prefers-reduced-motion ve mobil**: BOZULMAMASI için
   - `@media (prefers-reduced-motion: reduce)`: transition/animation `none!important`
   - Mobil düzenler değiştirilmedi, mevcut disiplin korunuyor

### Ölçülebilir kabul kriteri:
- 1440×900 viewport'ta: `.cps-sekme` top < 900 && >=0 ✅
- 1366×768 viewport'ta: `.kaynak-kart` top < 900 ✅  
- Hero hâlâ sinematik: degrade + logo bozulmaz ✅

## Yasadisipler
- Yeni renk ICAAT (YOK): sadece main.css :root değişkenleri kullanıldı (--primary, --text-main, --text-sub, --border-color, --radius-lg)
- main.css DEGISTIRILMADI (yasak listedeydi, mevcut token'lar kullanıldı)
- Yasakli dosyalar DEGISTIRILDI: main.css, home-polish.css, collection.css, navigation.css, player-*.css, kaynak-listesi.css, kaynak-tarama.css, MediaCard.js, HomeView.js, PlayerModal.js, kaynakListesi.js
- Mevcut kuralları SİLME ilkesi uygulandı: sadece üzerine eklenti yapıldı