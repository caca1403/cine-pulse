#!/usr/bin/env bash
# Cihazda (emülatör/telefon) gizli WebView'ın CF challenge'ı geçip geçmediğini ölç.
#
# Deney: emülatörün WebView motoru (bizim NativePageResolver'ın kullandığı
# motorun AYNI motoru) filmmakinesi.to'yu açabiliyor mu?
#   Evet -> bizim çözümleyicimiz de geçer, çünkü aynı motordan geçiyor.
#   Hayır -> sorun motorda değil, IP'de; sunucudan hiçbir yolla çözülemez.
set -u
source /tmp/opencode/buildenv.sh
ADB="$ANDROID_HOME/platform-tools/adb"
SER=${1:-emulator-5554}
A="$ADB -s $SER"

say() { printf '\n═══ %s ═══\n' "$1"; }

say "cihaz"
$A get-state 2>&1 | tr -d '\r'
$A shell getprop ro.build.version.release 2>&1 | tr -d '\r' | sed 's/^/  Android /'

say "APK kurulumu"
APK=/home/cagatay/İndirilenler/cine-pulse-main/android/app/build/outputs/apk/debug/app-debug.apk
$A install -r -g "$APK" 2>&1 | tr -d '\r' | tail -2

say "1) WebView motoru filmmakinesi.to'yu açabiliyor mu?"
# DİKKAT: logcat'te temizlenmiş CF gövdesini arıyoruz. 403 + "Just a moment"
# görülürse challenge ÇÖZÜLEMEDİ demektir.
$A logcat -c 2>/dev/null
$A shell am start -a android.intent.action.VIEW -d "https://filmmakinesi.to/" \
   -n com.android.chrome/com.google.android.apps.chrome.Main > /dev/null 2>&1
echo "  (tarayıcı açıldı, 45sn bekleniyor…)"
sleep 45

# Sonuç sayfayı göstergeden okumak yerine logcat üzerinden ölçüyoruz:
# Chromium "Just a moment" yüklediyse konsola CF uyarısı düşer.
CF=$($A logcat -d 2>/dev/null | grep -icE 'just a moment|challenges.cloudflare.com|__cf_chl|cf_chl_opt' || true)
echo "  logcat'teki CF izi sayısı: $CF"
[ "$CF" -gt 0 ] && echo "  → CF challenge görüldü (çözüm bekleniyor/başarısız olabilir)" \
                || echo "  → CF izi yok (challenge geçilmiş olabilir)"

say "2) Ekran görüntüsü"
$A exec-out screencap -p > /tmp/opencode/fm-screen.png 2>/dev/null
ls -l /tmp/opencode/fm-screen.png 2>/dev/null | awk '{print "  "$5" bayt -> /tmp/opencode/fm-screen.png"}'

say "3) Bizim çözümleyicimiz (logcat)"
$A logcat -d 2>/dev/null | grep -iE 'CinePulseWebView|__cinepulseWebViewResolve|NativePageResolver' | tail -5 \
  || echo "  (uygulama henüz çalışmadı — normal, sadece tarayıcı açıldı)"