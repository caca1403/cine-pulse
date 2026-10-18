#!/usr/bin/env bash
# devtest APK: uretim varliklari + cihaz olcum kancasi -> cihazda kullanici 0'a kur
set -euo pipefail
cd /home/cagatay/İndirilenler/cine-pulse-main
ADB="$HOME/android-sdk/platform-tools/adb"
export ANDROID_HOME="$HOME/android-sdk"
export ANDROID_SDK_ROOT="$HOME/android-sdk"
export CINEPULSE_BUILD_PYTHON="/home/cagatay/.local/share/uv/python/cpython-3.11-linux-x86_64-gnu/bin/python3.11"

echo "[1/5] vite build (devtest)"
VITE_DEVICE_SWEEP=1 npx vite build 2>&1 | tail -3

echo "[2/5] assets kopyala"
rm -rf android/app/src/main/assets/public
mkdir -p android/app/src/main/assets/public
cp -r dist/. android/app/src/main/assets/public/

echo "[3/5] gradle assembleDebug"
(cd android && ./gradlew assembleDebug -PcinepulseDeviceTest -q 2>&1 | tail -6)

echo "[4/5] cihaza kur (kullanici 0)"
"$ADB" push android/app/build/outputs/apk/debug/app-debug.apk /data/local/tmp/cp.apk >/dev/null
"$ADB" shell pm install --user 0 -r -d /data/local/tmp/cp.apk

echo "[5/5] baslat"
"$ADB" shell am force-stop com.cinepulse.studio.devtest || true
"$ADB" logcat -c || true
"$ADB" shell am start --user 0 -n com.cinepulse.studio.devtest/com.cinepulse.studio.MainActivity >/dev/null
echo "KURULDU-VE-ACILDI"
