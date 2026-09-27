package com.cinepulse.studio;

import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.Manifest;
import android.os.Build;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.os.StatFs;
import android.webkit.JavascriptInterface;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.URLUtil;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final int NOTIFICATION_PERMISSION_REQUEST = 4402;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            if (this.bridge != null && this.bridge.getWebView() != null) {
                this.bridge.getWebView().addJavascriptInterface(new DeviceStorageBridge(), "CinePulseNative");
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

    public final class DeviceStorageBridge {
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
        public String getDeviceStorageInfo() {
            try {
                StatFs stats = new StatFs(Environment.getDataDirectory().getAbsolutePath());
                long total = stats.getTotalBytes();
                long free = stats.getAvailableBytes();
                return "{\"total\":" + total + ",\"free\":" + free + "}";
            } catch (Exception error) {
                return "";
            }
        }
    }

    private void enqueueDownload(String url, String userAgent, String contentDisposition, String mimeType) {
        Uri uri = Uri.parse(url);
        DownloadManager.Request request = new DownloadManager.Request(uri);
        String cookie = CookieManager.getInstance().getCookie(url);
        if (cookie != null && !cookie.isEmpty()) request.addRequestHeader("Cookie", cookie);
        if (userAgent != null && !userAgent.isEmpty()) request.addRequestHeader("User-Agent", userAgent);
        request.setTitle(URLUtil.guessFileName(url, contentDisposition, mimeType));
        request.setDescription("CinePulse bölüm indiriliyor");
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
