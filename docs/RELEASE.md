# CinePulse — Release Hattı (public depo + public Releases)

**Karar:** Depo ve GitHub Releases **public**; imza malzemesi yalnız **GitHub Actions
Secrets** içinde yaşar (değerler hiçbir dosyaya yazılmaz, mevcut anahtarlar değişmez —
rotasyon kullanıcıda). Tag (`vX.Y.Z`) itilince **APK + DEB + EXE + AppImage** aynı
Release'te yayımlanır: tek sahip **`.github/workflows/release.yml`**.

## 1. Artifact envanteri

| Artifact | İmzalı? | ÖNCEKİ durum | ŞİMDİKİ durum (tetik) | Release'teki adı |
|---|---|---|---|---|
| Android APK | ✅ keystore | ✅ `build-apk.yml` tag `v*` → Release | ✅ `release.yml` → `apk` job (tag `v*`; manuel: `build-apk.yml`, artık sadece `workflow_dispatch`) | `cinepulse.apk` |
| Android AAB | — | ❌ üretilmiyor | ❌ planlanmadı (Play Store yok, APK doğrudan dağıtılıyor) | — |
| Linux DEB | ❌ imzasız mümkün değil | ❌ hedef `package.json`'da VARDI ama hiçbir workflow çağırmıyordu | ✅ `release.yml` → `desktop-linux` (ubuntu) | `CinePulse-<ver>.deb` |
| Linux AppImage | ❌ | ❌ (yukarıdaki aynı eksik) | ✅ `release.yml` → `desktop-linux` | `CinePulse-<ver>.AppImage` |
| Windows EXE (NSIS) | ❌ code-signing cert yok | ❌ hedef VARDI, workflow yoktu | ✅ `release.yml` → `desktop-windows` (windows-latest) | `CinePulse-Setup-<ver>.exe` |
| `version.json` / `desktop-version.json` (updater manifestleri) | — | ⚠️ `public/`'den ELLE kopyalanıyordu; masaüstü URL'leri var olmayan EXE/DEB/AppImage asset'lerini gösterdiğinden masaüstü güncellemesi 404 veriyordu | ✅ her build'de `scripts/generate-update-manifest.mjs` ile package.json'dan üretilir + Release'e konur | aynı adlarla Release asset'i |
| Web sitesi (Pages) | — | ✅ `deploy.yml` (push `main`/`master`) | ✅ değişmedi (Release artifact'i değil) | — |

**Ad sözleşmesi:** güncelleyici URL'leri (`public/version.json`) ile electron-builder
`artifactName`'leri birebir aynı olmalı — script bu sözleşmeyi üretir; adları
değiştirirken ikisini birden değiştirin.

## 2. Keystore / gizlilik denetimi (yalnız ADLAR, değerler asla)

| Secret adı | Kim okur | Kanıt (dosya:satır) |
|---|---|---|
| `ANDROID_KEYSTORE_BASE64` | release + manual APK | `release.yml:110` ("Prepare release signing key"), `build-apk.yml:68` |
| `ANDROID_KEYSTORE_PASSWORD` | gradle (env) | `release.yml:115`, `build-apk.yml:73`; `android/app/build.gradle:5` |
| `ANDROID_KEY_ALIAS` | gradle (env) | `release.yml:116`, `build-apk.yml:74`; `android/app/build.gradle:6` |
| `ANDROID_KEY_PASSWORD` | gradle (env) | `release.yml:117`, `build-apk.yml:75`; `android/app/build.gradle:7` |
| `VITE_XTREAM_RELAY_ORIGIN` | Vite build | `release.yml:91,153,195`, `build-apk.yml:49` |

- **Aynı keystore'la devam kanıtı:** `release.yml` yukarıdaki adları harfiyen kullanır
  (`${{ secrets.ANDROID_KEYSTORE_* }}`); `android/app/build.gradle:4-7` bu env adlarını
  okur; `scripts/build-android-release.py:23` sertifikanın **SHA-256 parmak izini sabitler**
  (`429f0788…e3d5`) — başka anahtarla derleme script'i kasıtlı olarak patlar.
- **Repo izi:** `git ls-files | grep -iE "keystore|\.jks|\.keystore"` → boş. YML/PWH/
  properties içinde `storePassword|keyPassword` araması → yalnız secret **adı** geçen
  workflow satırları; `android/gradle.properties`'ta parola yok.
- **`.gitignore` kapsıyor:** `*.keystore`, `*.jks`, `android/app/*.keystore`, `.env*`,
  `dist`, `release/`, `android/app/src/main/assets/public/`, `*.apk|aab|deb|exe|AppImage|msi`.
- Yerel imza malzemesi depo **dışında**: `~/.local/share/cinepulse-signing/` (release.env +
  release.keystore). Depoya kopyalamayın.

## 3. Sürüm tek kaynaktan okunur

- **Tek kaynak `package.json`**: `version` (X.Y.Z) + `versionCode` (tamsayi).
  - Android: `android/app/build.gradle:9,19-20` doğrudan package.json'ı okur (senkron garanti).
  - Updater manifestleri: `scripts/generate-update-manifest.mjs` üretir (`npm run manifest:sync`,
    kontrol `npm run manifest:check`); `releaseNotes`/`mandatory` elle girilen alanlara dokunmaz.
  - `release.yml` → `version-gate`: etiket ≠ `v<package.json version>` ise hattı **durdurur**
    (sürüm uydurulmaz); manifest senkronsuzsa uyarı verir, build'de zaten yeniden üretir.
- Güncelleme kararı **versionCode**'a göredir (`tests/update-policy.test.mjs`); sürüm
  yükseltirken `versionCode`'u da artırın.
- **asar:false bilinçli:** `electron/main.cjs:107` + sidecar spawn'ı (`:217-236`,
  `ELECTRON_RUN_AS_NODE` ile `resources/app/server/mediaServer.js` düz dosya olarak
  çalıştırılır) asar paketini desteklemez; `true` yapılırsa torrent/HLS sidecar'ı ölür.
  Updater bu projede electron-updater **değildir** (custom: `src/services/appUpdater.js:20`,
  `electron/main.cjs:865` → Release asset `version.json`/`desktop-version.json`), asar
  güncellemeyi etkilemez. CI'daki paketleme komutlarında `--publish never` bayrağı vardır
  (depo token'ı CI ortamında dururken electron-builder'ın kendi başına Release'e
  yüklemesini engeller; yapılandırma alanına string `"never"` YAZILMAZ — v25'te sağlayıcı
  adı sanılıp çöker). Paketlemeyi ve yayını tek başına `release.yml` yönetir.

## 4. Sürüm yükseltme ve yayın (kullanıcı adımları)

1. `package.json` → `version: "X.Y.Z"` ve `versionCode` +1.
2. `docs/release-notes.md` içeriğini bu sürüm için güncelle (Release gövdesi olur).
3. İsteğe bağlı: `public/version.json` / `desktop-version.json` içindeki `releaseNotes`
   ve `mandatory` alanlarını düzenle (script bunları korur).
4. `npm run manifest:sync` (URL'ler/sürüm package.json'a eşitlensin).
5. Kapı: `node tools/gizli-tara.mjs` → exit 0 olmadan push yok (`docs/GUVENLIK.md` kural 1).
6. `git commit` → `git tag vX.Y.Z` → `git push && git push origin vX.Y.Z`.
7. Actions → "Release CinePulse (APK + DEB + EXE + AppImage)" yeşil olunca
   Releases'de 4 paket + 2 manifest görünür.

## 5. Kullanıcının YAPMASI gerekenler (depo public olmadan önce)

1. **Sağlayıcı tarafında rotate et** (eski commit'lerde izleri var — `docs/GUVENLIK.md`
   madde 4; public'te kalıcı sızıntı olur): RSA çifti, Aria oturumu
   (`VITE_ANIZIUM_*`), TMDB anahtar(lar)ı, Trakt istemcisi, worker ucu
   (`VITE_ANIZIUM_WORKER`), Nova paneli imzası. Yeni değerler yalnız Vercel/CI secret + yerel `.env`.
2. **Geçmiş temizliği:** sızıntılı commit'ler (`b1f43de`, `9b0a43a`…) `git filter-repo` ile
   temizlenmeden (veya temiz tarihli yeni depo açılmadan) deposu public yapma.
3. **Keystore yedeği:** `release.keystore` + parolasının **çevrimdışı 2 kopyası** (ör. şifreli
   USB + kasa) sakla. Keystore kaybolursa mevcut kurulumlara APK güncellemesi bir daha
   imzalanamaz (imza uyuşmazlığı); GitHub Secrets tek başına yedek sayılmaz.
4. **Windows imzası yok:** EXE code-signing sertifikası alınmadığı sürece SmartScreen
   "tanınmayan yayıncı" uyarısı gösterir; Release notlarında kullanıcıya belirt.
5. **Windows runner kotası:** public depoda Windows dakikaları ücretsizdir; depo bir gün
   private olursa 2x kota sayılır (`release.yml` içindeki `desktop-windows` notuna bakın).
