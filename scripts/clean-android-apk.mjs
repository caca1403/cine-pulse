import { existsSync, unlinkSync } from 'node:fs';

// Vite copies public/cinepulse.apk into dist for website downloads. Do not
// package that APK inside the Android app during Capacitor sync.
const bundledApk = new URL('../android/app/src/main/assets/public/cinepulse.apk', import.meta.url);
if (existsSync(bundledApk)) unlinkSync(bundledApk);
