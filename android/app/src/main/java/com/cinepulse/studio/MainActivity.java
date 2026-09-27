package com.cinepulse.studio;

import android.app.DownloadManager;
import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.URLUtil;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            if (this.bridge != null && this.bridge.getWebView() != null) {
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
