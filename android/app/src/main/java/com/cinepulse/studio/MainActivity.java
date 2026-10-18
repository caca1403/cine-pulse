package com.cinepulse.studio;

import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.ContentValues;
import android.Manifest;
import android.os.Build;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.os.StatFs;
import android.provider.MediaStore;
import android.webkit.JavascriptInterface;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.URLUtil;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import org.json.JSONObject;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final int NOTIFICATION_PERMISSION_REQUEST = 4402;
    private NativePageResolver pageResolver;
    private NativeMediaGateway mediaGateway;
    private NativePlayerView nativePlayer;

    /** Native oynatıcı, yüzeyi WebView'in arkasına yerleştirmek için
     *  WebView'in konteynerini bulur. */
    com.getcapacitor.Bridge bridgeForPlayer() { return this.bridge; }

    /** Geri tuşu: native oynatıcı açıksa önce onu kapat. */
    @Override
    public void onBackPressed() {
        try {
            if (nativePlayer != null && nativePlayer.acikMi()) { nativePlayer.close(); return; }
        } catch (Exception ignored) {}
        super.onBackPressed();
    }

    /** WebView saydam olmalı: native oynatıcının görüntüsü WebView'in
     *  ARKASINDA çizilir (ses WebView'de, görüntü native yüzeyde). Saydam
     *  olmazsa WebView o görüntüyü örter ve ekranda ses var/görüntü yok olur. */
    private void webViewiSaydamYap() {
        try {
            if (bridge != null && bridge.getWebView() != null) {
                bridge.getWebView().setBackgroundColor(0x00000000);
                bridge.getWebView().setLayerType(android.view.View.LAYER_TYPE_HARDWARE, null);
            }
        } catch (Exception ignored) {}
    }

    /**
     * NATIVE OYNATICI KÖPRÜSÜ.
     * WebView (Chromium) HEVC/H.265 çözemiyor — ölçülen hata:
     * video.error.code 4 "Format error". Cihazın donanım çözücüsü HEVC
     * destekli; Media3/ExoPlayer o çözücüyü kullanır. APK'nın içinde
     * olduğu için her cihazda çalışır (donanım yoksa yazılım çözümleyici).
     */
    public final class NativePlayerBridge {
        @JavascriptInterface
        public boolean isAvailable() { return true; }

        @JavascriptInterface
        public void play(String url, String title, String headersJson) {
            play(url, title, headersJson, null);
        }

        /**
         * Altyazılı oynatma. WebView tarafı altyazıyı (WebVTT metni) önceden
         * çözer ve buraya verir; ExoPlayer'da oynatma başladıktan sonra altyazı
         * eklenemediği için liste PLAY ANINDA taşınır.
         */
        @JavascriptInterface
        public void play(String url, String title, String headersJson, String altyaziJson) {
            playAt(url, title, headersJson, altyaziJson, 0);
        }

        /**
         * Kaldığın yerden devam: başlangıç saniyesi verilirse ExoPlayer medyayı
         * DOĞRUDAN o noktadan hazırlar (WebView'a değil). 0 → baştan. Ayrı ad
         * (playAt) — JS köprüsünde aynı adlı aşırı yükleme güvenilir değildir.
         */
        @JavascriptInterface
        public void playAt(String url, String title, String headersJson, String altyaziJson, double startSaniye) {
            if (nativePlayer == null) nativePlayer = new NativePlayerView(MainActivity.this);
            nativePlayer.play(url, title, headersJson, altyaziJson, startSaniye);
        }

        @JavascriptInterface
        public void close() {
            if (nativePlayer != null) nativePlayer.close();
        }

        /**
         * Yüzeyi videonun ekran dikdörtgenine taşır (Nuvio mantığı: video
         * player'ın içinde, ekrana göre ölçek). Değerler CSS pikselidir;
         * Java tarafında cihaz pikseline çevrilir.
         */
        @JavascriptInterface
        public void setBounds(double x, double y, double w, double h) {
            try {
                if (nativePlayer == null || bridge == null || bridge.getWebView() == null) return;
                android.view.View wv = bridge.getWebView();
                int[] loc = new int[2];
                wv.getLocationInWindow(loc);
                float d = getResources().getDisplayMetrics().density;
                int l = loc[0] + (int) Math.round(x * d);
                int t = loc[1] + (int) Math.round(y * d);
                int r = l + (int) Math.round(w * d);
                int b = t + (int) Math.round(h * d);
                nativePlayer.setBounds(l, t, r, b);
            } catch (Exception ignored) {}
        }

        // ── Player butonları native oynatıcıyı yönetir ──────────────────
        @JavascriptInterface public void nativePlay() { if (nativePlayer != null) nativePlayer.oynat(); }
        @JavascriptInterface public void nativePause() { if (nativePlayer != null) nativePlayer.durdur(); }
        @JavascriptInterface public void nativeToggle() {
            if (nativePlayer == null) return;
            if (nativePlayer.oynatiliyorMu()) nativePlayer.durdur(); else nativePlayer.oynat();
        }
        @JavascriptInterface public void nativeSeekBy(double sn) { if (nativePlayer != null) nativePlayer.atla(sn); }
        @JavascriptInterface public void nativeSeekTo(double sn) { if (nativePlayer != null) nativePlayer.ilerle(sn); }
        @JavascriptInterface public boolean nativePlaying() { return nativePlayer != null && nativePlayer.oynatiliyorMu(); }
        /** "Birlikte izle" hız/ses eşitlemesi native oynatıcıya uygulanır. */
        @JavascriptInterface public void nativeHiz(double kat) { if (nativePlayer != null) nativePlayer.hiz(kat); }
        @JavascriptInterface public void nativeSes(double seviye) { if (nativePlayer != null) nativePlayer.ses(seviye); }
        /** JSON: {"konum":ms,"sure":ms} — ilerleme çubuğu ve zaman yazısı için. */
        @JavascriptInterface public String nativeDurum() {
            if (nativePlayer == null) return "{\"konum\":0,\"sure\":0}";
            return "{\"konum\":" + nativePlayer.konumMs() + ",\"sure\":" + nativePlayer.sureMs() + "}";
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if ((getApplicationInfo().flags & android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE) != 0 && getPackageName().endsWith(".devtest")) {
            android.webkit.WebView.setWebContentsDebuggingEnabled(true);
        }
        try {
            pageResolver = new NativePageResolver(this);
            mediaGateway = new NativeMediaGateway(this);
            mediaGateway.start();
        } catch (Exception ignored) {}
        try {
            if (this.bridge != null && this.bridge.getWebView() != null) {
                this.bridge.getWebView().addJavascriptInterface(new DeviceStorageBridge(), "CinePulseNative");
                // Native medya cozucu: HEVC dahil her yayini cihaz cozucusuyle acar.
                this.bridge.getWebView().addJavascriptInterface(new NativePlayerBridge(), "CinePulsePlayer");
                // Gizli WebView cozumleyicisi cevabi dogrudan uygulama icine
                // geri verir: window.__cinepulseWebViewResolve(id, json).
                this.bridge.getWebView().addJavascriptInterface(new WebViewResolverBridge(), "CinePulseWebView");
                this.bridge.getWebView().setDownloadListener(new DownloadListener() {
                    @Override
                    public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimeType, long contentLength) {
                        try {
                            enqueueDownload(url, userAgent, contentDisposition, mimeType);
                        } catch (Exception ignored) {}
                    }
                });
            }
        } catch (Exception ignored) {}
    }

    void resolveNativePage(String url, String userAgent, NativePageResolver.Callback callback) {
        if (pageResolver == null || url == null) { callback.onResult("", "{}"); return; }
        pageResolver.resolve("py-" + java.util.UUID.randomUUID(), url, 35000, false, userAgent, callback);
    }

    /** Cloudflare'i gercek tarayici ile gecip sayfa HTML'ini dondurur. */
    public final class WebViewResolverBridge {
        @JavascriptInterface
        public boolean isAvailable() {
            return pageResolver != null;
        }

        @JavascriptInterface
        public void resolvePage(String requestId, String url, int timeoutMs, boolean media, String referer) {
            final NativePageResolver resolver = pageResolver;
            if (resolver == null || url == null || url.trim().isEmpty()) return;
            final String id = requestId;
            resolver.resolve(id, url.trim(), timeoutMs, media, "", referer == null ? "" : referer.trim(), new NativePageResolver.Callback() {
                @Override
                public void onResult(final String requestId, final String json) {
                    try {
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                if (bridge == null || bridge.getWebView() == null) return;
                                String literal = JSONObject.quote(json == null ? "" : json);
                                bridge.getWebView().evaluateJavascript(
                                    "window.__cinepulseWebViewResolve && window.__cinepulseWebViewResolve("
                                        + JSONObject.quote(requestId) + "," + literal + ");", null);
                            }
                        });
                    } catch (Exception ignored) {}
                }
            });
        }
    }

    @Override
    public void onDestroy() {
        if (mediaGateway != null) mediaGateway.stop();
        if (pageResolver != null) pageResolver.close();
        super.onDestroy();
    }

    public final class DeviceStorageBridge {
        @JavascriptInterface
        public String getApiOrigin() {
            return mediaGateway == null ? "" : mediaGateway.origin();
        }

        // Pulsar kataloğu: magnet → harici torrent uygulaması. Uygulama bulunamazsa
        // "YOK" dön (JS panoya düşer) — klik sessiz ölmesin (ölü özellik kuralı).
        @JavascriptInterface
        public String openMagnet(String magnet) {
            try {
                String m = magnet == null ? "" : magnet.trim();
                if (!m.startsWith("magnet:")) return "YOK";
                Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(m));
                i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                if (i.resolveActivity(getPackageManager()) == null) return "YOK";
                startActivity(i);
                return "OK";
            } catch (Exception e) {
                return "YOK";
            }
        }

        @JavascriptInterface
        public String getInstalledVersion() {
            try {
                android.content.pm.PackageInfo info = getPackageManager().getPackageInfo(getPackageName(), 0);
                long code = Build.VERSION.SDK_INT >= 28 ? info.getLongVersionCode() : info.versionCode;
                return new JSONObject().put("version", info.versionName).put("versionCode", code).toString();
            } catch (Exception e) { return "{}"; }
        }

        @JavascriptInterface
        public void startDownloadNotification(String title) {
            runOnUiThread(() -> {
                if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                    requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, NOTIFICATION_PERMISSION_REQUEST);
                }
                Intent intent = new Intent(MainActivity.this, DownloadProgressService.class)
                        .setAction(DownloadProgressService.ACTION_START)
                        .putExtra(DownloadProgressService.EXTRA_TITLE, title);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) startForegroundService(intent);
                else startService(intent);
            });
        }

        @JavascriptInterface
        public void updateDownloadNotification(String title, int percent, String status, long loaded, long total) {
            Intent intent = new Intent(MainActivity.this, DownloadProgressService.class)
                    .setAction(DownloadProgressService.ACTION_UPDATE)
                    .putExtra(DownloadProgressService.EXTRA_TITLE, title)
                    .putExtra(DownloadProgressService.EXTRA_PERCENT, percent)
                    .putExtra(DownloadProgressService.EXTRA_STATUS, status)
                    .putExtra(DownloadProgressService.EXTRA_LOADED, loaded)
                    .putExtra(DownloadProgressService.EXTRA_TOTAL, total);
            startService(intent);
        }

        @JavascriptInterface
        public void finishDownloadNotification(boolean success, String message) {
            Intent intent = new Intent(MainActivity.this, DownloadProgressService.class)
                    .setAction(DownloadProgressService.ACTION_FINISH)
                    .putExtra(DownloadProgressService.EXTRA_SUCCESS, success)
                    .putExtra(DownloadProgressService.EXTRA_STATUS, message);
            startService(intent);
        }

        @JavascriptInterface
        public void downloadApk(String url) {
            runOnUiThread(() -> {
                if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                    requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, NOTIFICATION_PERMISSION_REQUEST);
                }
                try {
                    enqueueDownload(url, null, "cinepulse.apk", "application/vnd.android.package-archive", true);
                } catch (Exception error) {
                    android.widget.Toast.makeText(MainActivity.this, "APK indirilemedi: " + error.getMessage(), android.widget.Toast.LENGTH_LONG).show();
                }
            });
        }

        /**
         * Gizli WebView'in çerez kavanozunu JS'e açar. Cloudflare `cf_clearance`
         * çerezi bu sayede HTTP katmanına taşınır; aksi halde her istek
         * challenge'ı baştan çözmeye çalışıp zaman aşımına düşüyor.
         */
        @JavascriptInterface
        public String getCookies(String url) {
            try {
                String c = CookieManager.getInstance().getCookie(url);
                return c == null ? "" : c;
            } catch (Exception e) { return ""; }
        }

        @JavascriptInterface
        public void setCookies(String url, String cookie) {
            try {
                if (url == null || cookie == null || cookie.isEmpty()) return;
                for (String part : cookie.split(";")) {
                    String p = part.trim();
                    if (!p.isEmpty()) CookieManager.getInstance().setCookie(url, p);
                }
                CookieManager.getInstance().flush();
            } catch (Exception ignored) {}
        }

        @JavascriptInterface
        public String getDeviceStorageInfo() {            try {
                StatFs stats = new StatFs(Environment.getDataDirectory().getAbsolutePath());
                long total = stats.getTotalBytes();
                long free = stats.getAvailableBytes();
                return "{\"total\":" + total + ",\"free\":" + free + "}";
            } catch (Exception error) {
                return "";
            }
        }

        @JavascriptInterface
        public String saveJsonBackup(String json, String filename) {
            try {
                String safeName = (filename == null ? "cinepulse_yedek.json" : filename)
                        .replaceAll("[^a-zA-Z0-9._-]", "_");
                if (!safeName.endsWith(".json")) safeName += ".json";
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    ContentValues values = new ContentValues();
                    values.put(MediaStore.MediaColumns.DISPLAY_NAME, safeName);
                    values.put(MediaStore.MediaColumns.MIME_TYPE, "application/json");
                    values.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/CinePulse");
                    Uri uri = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
                    if (uri == null) return "ERROR:Dosya Downloads klasörüne kaydedilemedi";
                    try (OutputStream output = getContentResolver().openOutputStream(uri)) {
                        if (output == null) throw new IllegalStateException("Dosya açılamadı");
                        output.write(json.getBytes(java.nio.charset.StandardCharsets.UTF_8));
                        output.flush();
                    } catch (Exception error) {
                        getContentResolver().delete(uri, null, null);
                        throw error;
                    }
                } else {
                    File downloads = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
                    if (downloads == null || (!downloads.exists() && !downloads.mkdirs())) {
                        return "ERROR:İndirme klasörü oluşturulamadı";
                    }
                    try (FileOutputStream output = new FileOutputStream(new File(downloads, safeName))) {
                        output.write(json.getBytes(java.nio.charset.StandardCharsets.UTF_8));
                        output.flush();
                    }
                }
                return "OK";
            } catch (Exception error) {
                return "ERROR:" + (error.getMessage() == null ? "Yedek kaydedilemedi" : error.getMessage());
            }
        }
    }

    private void enqueueDownload(String url, String userAgent, String contentDisposition, String mimeType) {
        enqueueDownload(url, userAgent, contentDisposition, mimeType, false);
    }

    private void enqueueDownload(String url, String userAgent, String contentDisposition, String mimeType, boolean apkUpdate) {
        Uri uri = Uri.parse(url);
        DownloadManager.Request request = new DownloadManager.Request(uri);
        String cookie = CookieManager.getInstance().getCookie(url);
        if (cookie != null && !cookie.isEmpty()) request.addRequestHeader("Cookie", cookie);
        if (userAgent != null && !userAgent.isEmpty()) request.addRequestHeader("User-Agent", userAgent);
        request.setMimeType(apkUpdate ? "application/vnd.android.package-archive" : mimeType);
        request.setTitle(apkUpdate ? "CinePulse güncellemesi" : URLUtil.guessFileName(url, contentDisposition, mimeType));
        request.setDescription(apkUpdate ? "Güncel APK indiriliyor" : "CinePulse bölüm indiriliyor");
        request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
        request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS,
                URLUtil.guessFileName(url, contentDisposition, mimeType));
        DownloadManager manager = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
        if (manager == null) throw new IllegalStateException("Android indirme servisi kullanılamıyor");
        long downloadId = manager.enqueue(request);
        Cursor cursor = manager.query(new DownloadManager.Query().setFilterById(downloadId));
        if (cursor != null) {
            try {
                if (cursor.moveToFirst() && cursor.getInt(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_STATUS)) == DownloadManager.STATUS_FAILED) {
                    throw new IllegalStateException("Android indirme kuyruğu isteği reddetti");
                }
            } finally {
                cursor.close();
            }
        }
    }
}
