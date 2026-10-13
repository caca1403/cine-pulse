# CinePulse — Güvenlik Kuralları (özel depo)

**Yayın modeli:** Site yayında kalmaya devam eder (Vercel web + API uçları); gizliliğin
sınırı KAYNAK DEPODUR — `github.com/caca1403/cine-pulse` **PRIVATE** kalır, kod hiçbir
yerde halka açık yayınlanmaz. Bu yüzden repoda sır/anahtar bırakılmaz; değerler Vercel
ortam değişkenlerinde (ve cihaz derlemede yerel `.env`) tutulur, depo sadece anahtar
ADLARINI (`.env.example`) görür. APK/DEB/EXE dağıtımı da aynı sırları GÖMEMEZ — derleme
anında enjekte edilir.

1. **Push öncesi kapı (zorunlu):** `node tools/gizli-tara.mjs` → exit 0 olmadan push yok.
2. **Sırlar:** oturum çerezleri/API anahtarları koda yazılmaz; `.env` (git dışı) veya
   Vercel/CI secret. Yeni anahtar adı önce `.env.example`'e eklenir.
3. **Derleme çıktısı commit edilmez:** `dist/`, `android/app/src/main/assets/public/`,
   `*.apk|deb|exe`, `.vercel/` ignore'da; kanıt: `git check-ignore -v <yol>`.
4. **GEÇMİŞ TEMİZLİĞİ GEREKİR:** eski commit'lerde (`b1f43de`, `9b0a43a` vb.) Aria
   oturumu, TMDB anahtarları ve worker adresi var. Temizlik `git filter-repo` ile
   geçmiş yeniden yazılmalı, sızan anahtar/oturumlar SAĞLAYICI TARAFINDA ROTATE edilmeli.
5. **Adres listeleri:** `kit.js`/`betelgeuse.js` üçüncü taraf GitHub depolarından
   (patr0nq, phisher98) domain listesi çekiyor → kendi kopyamıza taşınacak; çekilirken
   beklenen-desen doğrulaması (bilinen ad kümesi kesişimi) + imzasız liste reddi.
6. Depo private kalmalı; davetsiz ortakçı yok. Şüphe anında oturum/anahtarları döndür.
