# Cihazda test (gizli WebView / CF challenge)

## Neden gerekli

`filmmakinesi.to` ve `dizibox.live` Cloudflare **JS challenge** kullanıyor:

```
HTTP 403  <title>Just a moment...
```

Bu, HTTP katmanının hiçbir yolundan çözülemez — proxy, CF Worker ve
CapacitorHttp (cihazın kendi IP'si) denendi, hepsi 403 döndü.
Çözüm için gerçek bir tarayıcı motoru gerekiyor, yani cihazdaki
gizli WebView (`NativePageResolver`).

## Bu makinede neden çalışmıyor

| Gereken | Durum |
|---|---|
| Android cihaz + `adb` | yok |
| `/dev/kvm` (emülatör için şart) | **yok** → Android emülatör çalışmaz |
| Waydroid oturumu | kurulu, ama `sudo` şifresi istiyor |

JDK + Android SDK ev dizinine **root'suz** kurulabilir → APK derlenebilir.
Çalıştırmak için ya sudo ya da fiziksel telefon gerekir.

## Yol A — Waydroid (kullanıcı terminalde)

```bash
sudo waydroid session start
```

Sonra adb TCP üzerinden bağlanmak gerekir (Waydroid'ın kendi adb'si
kuruludur):

```bash
~/Android/Sdk/platform-tools/adb connect 127.0.0.1:5555
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

## Yol B — Fiziksel telefon

USB kablosuyla bağla, USB debugging'i aç, sonra:

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

## Ölçüm

Uygulamada bir film aç → oynatıcıyı seç. Konsolda
`__cinepulseWebViewResolve` çağrılıp çağrılmadığına bak. Köprü
`MainActivity.java` içinde `CinePulseWebView` adıyla kayıtlıdır ve
`hasNativeWebViewResolver()` yalnızca native ortamda true döner.