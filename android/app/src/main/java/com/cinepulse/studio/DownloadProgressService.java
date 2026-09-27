package com.cinepulse.studio;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;

import java.util.Locale;

public class DownloadProgressService extends Service {
    public static final String ACTION_START = "com.cinepulse.studio.DOWNLOAD_START";
    public static final String ACTION_UPDATE = "com.cinepulse.studio.DOWNLOAD_UPDATE";
    public static final String ACTION_FINISH = "com.cinepulse.studio.DOWNLOAD_FINISH";
    public static final String EXTRA_TITLE = "title";
    public static final String EXTRA_PERCENT = "percent";
    public static final String EXTRA_STATUS = "status";
    public static final String EXTRA_LOADED = "loaded";
    public static final String EXTRA_TOTAL = "total";
    public static final String EXTRA_SUCCESS = "success";

    private static final String CHANNEL_ID = "cinepulse_downloads";
    private static final int NOTIFICATION_ID = 7824;
    private String title = "CinePulse indirmesi";
    private boolean foreground = false;

    @Override
    public void onCreate() {
        super.onCreate();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "İndirme durumu", NotificationManager.IMPORTANCE_LOW);
            channel.setDescription("CinePulse çevrimdışı indirme ilerlemesi");
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) manager.createNotificationChannel(channel);
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null) {
            stopSelf(startId);
            return START_NOT_STICKY;
        }
        String action = intent.getAction();
        title = intent.getStringExtra(EXTRA_TITLE) == null ? title : intent.getStringExtra(EXTRA_TITLE);
        if (ACTION_FINISH.equals(action)) {
            boolean success = intent.getBooleanExtra(EXTRA_SUCCESS, false);
            String status = intent.getStringExtra(EXTRA_STATUS);
            showFinished(success, status == null ? (success ? "İndirme tamamlandı" : "İndirme durduruldu") : status);
            if (foreground) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) stopForeground(STOP_FOREGROUND_DETACH);
                else stopForeground(false);
            }
            stopSelf(startId);
            return START_NOT_STICKY;
        }

        int percent = intent.getIntExtra(EXTRA_PERCENT, 0);
        long loaded = intent.getLongExtra(EXTRA_LOADED, 0);
        long total = intent.getLongExtra(EXTRA_TOTAL, 0);
        String status = intent.getStringExtra(EXTRA_STATUS);
        Notification notification = buildProgress(percent, loaded, total, status == null ? "İndirme hazırlanıyor…" : status);
        if (!foreground) {
            startForeground(NOTIFICATION_ID, notification);
            foreground = true;
        } else {
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) manager.notify(NOTIFICATION_ID, notification);
        }
        return START_NOT_STICKY;
    }

    private Notification buildProgress(int percent, long loaded, long total, String status) {
        Notification.Builder builder = builder()
                .setSmallIcon(android.R.drawable.stat_sys_download)
                .setContentTitle(title)
                .setContentText(status + " · " + formatBytes(loaded) + (total > 0 ? " / " + formatBytes(total) : ""))
                .setContentIntent(openAppPendingIntent())
                .setCategory(Notification.CATEGORY_PROGRESS)
                .setOnlyAlertOnce(true)
                .setOngoing(true)
                .setShowWhen(false);
        if (total > 0) builder.setProgress(100, Math.max(0, Math.min(100, percent)), false);
        else builder.setProgress(0, 0, true);
        return builder.build();
    }

    private void showFinished(boolean success, String status) {
        Notification notification = builder()
                .setSmallIcon(success ? android.R.drawable.stat_sys_download_done : android.R.drawable.stat_notify_error)
                .setContentTitle(success ? "İndirme tamamlandı" : "İndirme durduruldu")
                .setContentText(status)
                .setContentIntent(openAppPendingIntent())
                .setAutoCancel(true)
                .setOnlyAlertOnce(true)
                .setOngoing(false)
                .build();
        NotificationManager manager = getSystemService(NotificationManager.class);
        if (manager != null) manager.notify(NOTIFICATION_ID, notification);
    }

    private Notification.Builder builder() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) return new Notification.Builder(this, CHANNEL_ID);
        return new Notification.Builder(this);
    }

    private PendingIntent openAppPendingIntent() {
        Intent intent = new Intent(this, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) flags |= PendingIntent.FLAG_IMMUTABLE;
        return PendingIntent.getActivity(this, 0, intent, flags);
    }

    private String formatBytes(long bytes) {
        if (bytes < 1024) return bytes + " B";
        double value = bytes / 1024.0;
        String[] units = {"KB", "MB", "GB", "TB"};
        int unit = 0;
        while (value >= 1024 && unit < units.length - 1) { value /= 1024; unit++; }
        return String.format(Locale.getDefault(), "%.1f %s", value, units[unit]);
    }

    @Override
    public IBinder onBind(Intent intent) { return null; }
}
