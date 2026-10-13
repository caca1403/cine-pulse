# Cloudflare dağıtım rehberi

## Üretim yapısı

**Site:** https://cinepulse.cinepulse.workers.dev/

```text
GitHub main → Actions → Vite dist + Worker bundle
                          ├── Workers Assets: HTML / JS / CSS / görseller
                          └── Worker: /api/* ve indirme yönlendirmeleri
```

Pages origin veya Vercel sunucusu gerekmez. Yerel `api/` dosyaları masaüstü servisinin de kullandığı modüller olduğundan korunur.

## GitHub Secrets

Depo → Settings → Secrets and variables → Actions:

| Secret | Amaç |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Yalnız ilgili hesapta Worker düzenleme / dağıtım yetkisi. |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare hesap kimliği. |

Token'ı dar kapsamlı tut. Sohbette veya loglarda paylaşılmış token'ları yenile; yeni değeri Secrets'e yazdıktan sonra eskisini iptal et. Global API Key kullanma.

Uygulamanın kullandığı API sırları Worker → Settings → Variables and Secrets altında tutulur. Gereken özelliklere göre metadata, görsel ve imzalı bağlantı değişkenleri ayrıca ayarlanır. Dağıtım betiği mevcut `secret_text` ve `plain_text` bağlarını korur; hesap token'ını uygulama ortamına taşımaz.

## Yerel dağıtım

Node.js 20+ ve bağımlılıklar kurulu olmalıdır:

```bash
npm ci
npm run build
node --test tests/cloudflare-deployment.test.mjs
# CF_TOKEN ve CF_ACCOUNT güvenli biçimde ortamda tanımlanmış olmalı.
node scripts/cf-worker-upload.mjs
node tools/cf-smoke.mjs
```

Betik resmi Workers Assets API akışını kullanır: manifest → yükleme oturumu → dosya paketleri → tamamlama token'ıyla Worker dağıtımı. Yerel geçici dosya yoluna bağımlı değildir.

Worker'ın `workers.dev` adresi panelde etkin olmalıdır. Token'da hata varsa önce API cevabını ve resmi uç / yöntem bilgisini kontrol et; hesap kapsamının nedeni olduğunu kanıtsız varsayma.

## Doğrulama

`cf-smoke` ana sayfa, uygulama JS dosyası, sürüm manifesti, CORS preflight, özel IP hedef engeli ve APK yönlendirmesini kontrol eder. **Kaynakların oynatılabilirliğini kontrol etmez.**

Kaynak kabul testi ayrı yapılır: platform + yapım + sezon/bölüm + dil + kod adı + HTTP durumları + ilk medya baytı + gerçek oynatma. Birkaç başarıdan “hepsi çalışıyor” sonucu çıkarılmaz.

## Kotalar ve maliyet

Workers Free dinamik istek ve CPU limitlerine tabidir. Statik varlıklar ile dinamik video vekil trafiği aynı kategori değildir. Cache hit, Worker kodu çalıştıysa bu çağrıyı otomatik olarak kota dışında bırakmaz.

Ücretsiz planı video CDN'i gibi sınırsız kabul etme. Büyük dosya indirmeleri GitHub'a yönlendirilir. Video aktarımı için kullanım şartlarını ve güncel limitleri ayrıca incele:

- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/workers/static-assets/direct-upload/
- https://www.cloudflare.com/terms/

## Vercel'den ayrılma

Kodun aktif web adresi Cloudflare'dir. Eski Android adres tanıma kuralı yalnız geriye dönük yerel yönlendirme içindir; Vercel'e trafik göndermek için değildir. Eski sürüm paketleri kendiliğinden değişmez.

Repo içindeki Vercel dağıtım yapılandırması kaldırılmıştır. **Bu işlem Vercel panelindeki Git bağlantısını kendiliğinden kesmez.** Projenin Settings → Git bölümünden bağlı depoyu ayır; gerekiyorsa projenin General ayarlarından projeyi ayrıca sil. Hesabı veya ücretli aboneliği yönetmek ayrı işlemdir.

## Geri dönüş

Cloudflare panelindeki Worker sürüm geçmişinden önceki doğrulanmış sürüme dön veya istenen commit'i yerelde derleyip aynı betikle dağıt. Yeni yayın kabul edilmeden eski üretim projesini silme. Aktif adresin ana sayfası ve API'leri birlikte test edilmeden geçişi tamamlandı sayma.
