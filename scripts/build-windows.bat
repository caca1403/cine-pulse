@echo off
chcp 65001 >nul
echo ====================================================
echo   CinePulse Studio - Windows EXE NSIS Paketleyici
echo   (Cloudstream & Nuvio Hibrit Medya Merkezi)
echo ====================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [HATA] Node.js bulunamadı! Lütfen nodejs.org üzerinden Node.js 20+ kurun.
    pause
    exit /b 1
)

echo [1/2] Arayüz derleniyor (vite build)...
call npm run build
if %errorlevel% neq 0 (
    echo [HATA] Vite derlemesi başarısız oldu!
    pause
    exit /b 1
)

echo.
echo [2/2] Windows NSIS Kurulum Sihirbazı Paketleniyor (CinePulse-Setup.exe)...
call npx electron-builder --win nsis
if %errorlevel% neq 0 (
    echo [HATA] Electron Builder paketlemesi başarısız oldu!
    pause
    exit /b 1
)

echo.
echo ====================================================
echo   ✓ Kurulum EXE'si başarıyla oluşturuldu!
echo   Dosya: release\CinePulse-Setup-1.1.50.exe
echo   Kurulum sihirbazı masaüstü ve başlat menüsü kısayollarını otomatik ekler.
echo ====================================================
pause

