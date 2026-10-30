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

    /** Oynatıcının alt yazıları da yerel ağ geçidinden okuyabilmesi için kök. */
    String mediaGatewayOrigin() { return mediaGateway != null ? mediaGateway.origin() : null; }
    // Yerel torrent motoru köprüsü (gömülü servis): libtorrent + 127.0.0.1 sunucu.
    TorrentBridge torrentBridge;

    /** CloudStream3 eklenti konağı (kullanıcı 2026-10-29): DexClassLoader tabanlı
     *  plugin host; JS'e window.CinePulseCloudStream olarak açılır. */
    com.cinepulse.studio.cloudstream.CloudStreamHost csHost;
    boolean csDiskYuklendi = false;

    /* TorrentBridge paketi içinden WebView'a erişim (bridge alanı protected). */
    android.webkit.WebView torrentWebView() {
        return bridge != null ? bridge.getWebView() : null;
    }
    private NativePlayerView nativePlayer;

    /** 6a: TorrentBridge 'yayinda' olduğunda (magnetOynat otomatik) yerel akışı
     *  native oynatıcıya verir — JS köprü beklemeden çalar; play yolu JS'in
     *  kullandığıyla BİREBİRMEDİR (sözleşme aynı). */
    void nativeYerelOynat(String url, String ad) {
        try {
            if (nativePlayer == null) nativePlayer = new NativePlayerView(MainActivity.this);
            nativePlayer.play(url, ad == null ? "" : ad, null);
        } catch (Exception ignored) {}
    }

    /** JS'in play öncesi verdiği dil ipucu ("dublaj"/"altyazili"); playAt'te native'a aktarılır. */
    String bekleyenDilIpucu = "";

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
            // 6a zincir logu (kullanıcı 2026-10-28): magnet → motor → 127.0.0.1 →
            // play köprüsü aynı 'CinePulseTorrent' etiketiyle izlenir.
            try {
                String kisa = url == null ? "-" : (url.length() > 90 ? url.substring(0, 90) + "…" : url);
                android.util.Log.i("CinePulseTorrent", "köprü playAt: url=" + kisa
                        + " startSn=" + startSaniye + " başlık=" + (title == null ? "-" : title));
            } catch (Exception ignored) {}
            if (nativePlayer == null) nativePlayer = new NativePlayerView(MainActivity.this);
            nativePlayer.dilIpucuAyarla(bekleyenDilIpucu);
            nativePlayer.play(url, title, headersJson, altyaziJson, startSaniye);
        }

        /**
         * MADDE 6a GENİŞLEME (kullanıcı 2026-10-28): kaynak listesine yapıştırılan
         * magnet / btih bağlantısını DOĞRUDAN oynatır. Zincir: magnet → yerel
         * motor (pulsar/libtorrent) → 127.0.0.1 HTTP akış URL'i → NativePlayerView.play.
         *
         * İMZA (JS tarafı torrentYerel.js için):
         *   window.CinePulsePlayer.magnetOynat(magnetString, otomatikOynatBoolean)
         *   → SENKRON dönüş (JSON string):
         *       {"durum":"kabul"}                          motor işi aldı
         *       {"durum":"reddedildi","kod":"unsupported"} magnet/btih çözülemedi
         *       {"durum":"reddedildi","kod":"motor-yok"}   köprü hazır değil
         *   ASYNC sonuçlar mevcut olay kanalından gelir (window.__cpTorrentOlay):
         *       {"durum":"yayinda","url","ad","boyut"}     url = 127.0.0.1:port (sözleşme aynı)
         *       {"durum":"hata","kod","mesaj"}  kod: unsupported | timeout | no-peers | motor-hatasi
         * otomatikOynat=true ise 'yayinda' URL'ini Java tarafı native oynatıcıya
         * verir; false ise JS kendi play çağrısını yapar (davranış aynı kalır).
         */
        @JavascriptInterface
        public String magnetOynat(String magnet, boolean otomatikOynat) {
            if (torrentBridge == null) {
                android.util.Log.w("CinePulseTorrent", "magnetOynat: köprü yok (motor-yok)");
                return "{\"durum\":\"reddedildi\",\"kod\":\"motor-yok\"}";
            }
            try {
                return torrentBridge.magnetKabulEt(magnet, otomatikOynat);
            } catch (Throwable t) {
                android.util.Log.e("CinePulseTorrent", "magnetOynat beklenmeyen hata", t);
                return "{\"durum\":\"reddedildi\",\"kod\":\"unsupported\",\"mesaj\":\""
                        + String.valueOf(t.getMessage()).replace("\"", "'") + "\"}";
            }
        }

        /**
         * Dil ipucu ("dublaj" | "altyazili"): JS, kaynak kartı analizinden
         * (yayinSesBilgisi) dili play'den ÖNCE bildirir; HLS metadata'sı suskun
         * olan yayınlarda ses satırı "Ses 1" yerine gerçek dilini gösterir.
         */
        @JavascriptInterface
        public void setDilIpucu(String ipucu) {
            bekleyenDilIpucu = ipucu == null ? "" : ipucu;
            if (nativePlayer != null) nativePlayer.dilIpucuAyarla(bekleyenDilIpucu);
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
        /** Stremio tarzı yükleme perdesi: video açılana kadar blurlu backdrop. */
        @JavascriptInterface public void nativeBackdrop(String url) { if (nativePlayer != null) nativePlayer.backdropAyarla(url); }
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
            return "{\"konum\":" + nativePlayer.konumMs() + ",\"sure\":" + nativePlayer.sureMs()
                    + ",\"buffering\":" + nativePlayer.yukleniyorMu() + "}";
        }

        // ── İZ SEÇİMİ + GÖRÜNTÜ ORANI (kontrol katmanı DOM'da) ──────────
        // Stremio mimarisi: ses/altyazı menüsü ve oran düğmesi WebView DOM'unda
        // çizilir; bu üç köprü yalnız ExoPlayer'a okur/yazar.
        /** JSON: {"ses":[{"i":0,"ad":"…","aktif":true}],"alt":[…]} */
        @JavascriptInterface public String nativeIzlerJson() {
            return nativePlayer == null
                    ? "{\"ses\":[],\"alt\":[]}"
                    : nativePlayer.izlerJson();
        }
        /** tur: "ses" | "alt"; i: izlerJson()'daki düz indeks ("alt" için i<0 → kapat). */
        @JavascriptInterface public void nativeIzSec(String tur, int i) {
            if (nativePlayer != null) nativePlayer.izSec(tur, i);
        }
        /** mod: "fit" | "zoom" | "fill" */
        @JavascriptInterface public void nativeOran(String mod) {
            if (nativePlayer != null) nativePlayer.oran(mod);
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
                // Yerel torrent motoru: Torrentio satırları uygulama içinde oynar.
                torrentBridge = new TorrentBridge(this);
                this.bridge.getWebView().addJavascriptInterface(torrentBridge, "CinePulseTorrent");
                android.util.Log.i("CinePulseTorrent", "TorrentBridge bağlandı (CinePulseTorrent + magnetOynat)");
                // #12 Biometrik uygulama kilidi.
                this.bridge.getWebView().addJavascriptInterface(new BiometricBridge(), "CinePulseBiometric");
                // CloudStream3 eklenti konağı (kullanıcı 2026-10-29): .cs3/.apk
                // plugin'lerini yükler, sağlayıcı listesi/arama/akış üretir.
                csHost = new com.cinepulse.studio.cloudstream.CloudStreamHost(this);
                this.bridge.getWebView().addJavascriptInterface(new CloudStreamBridge(), "CinePulseCloudStream");
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
        // WebView SAYDAM olmalı: native yüzey artık kontrolsüz (headless), DOM
        // kontrolleri video görüntüsünün ÜSTÜNDE kalabilsin diye saydamlık
        // şart. Opaque WebView videoyu ve perdeyi örter (ses var, görüntü yok).
        webViewiSaydamYap();
        // #7: tema simgesi kaydını launcher durumuyla eşitle.
        temaSimgeOnar();
        // #13/#15: uygulama şemalı bağlantıyla (magnet:/cinepulse:) AÇILDIYSA yönlendir.
        semaliVeriYonlendir(getIntent());
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

    private boolean kilitIstekli = false;
    private long arkaPlanZaman = 0L;

    @Override
    public void onPause() {
        super.onPause();
        arkaPlanZaman = System.currentTimeMillis();
    }

    @Override
    public void onResume() {
        super.onResume();
        // #12: kilit ayarı açıksa ve uygulama 30 sn'den uzun süre arka planda
        // kaldıysa kilit ekranını yeniden göster (karar JS tarafında).
        if (kilitIstekli && arkaPlanZaman > 0
                && System.currentTimeMillis() - arkaPlanZaman > 30_000
                && bridge != null && bridge.getWebView() != null) {
            bridge.getWebView().postDelayed(() -> {
                try {
                    bridge.getWebView().evaluateJavascript(
                        "window.__cpKilitGoster && window.__cpKilitGoster();", null);
                } catch (Exception ignored) {
                }
            }, 350);
        }
    }

    /* ── #12 Biometrik uygulama kilidi (BiometricPrompt → __cpBiometrik) ── */
    public final class BiometricBridge {
        private static final int POLICY = androidx.biometric.BiometricManager.Authenticators.BIOMETRIC_STRONG
                | androidx.biometric.BiometricManager.Authenticators.BIOMETRIC_WEAK
                | androidx.biometric.BiometricManager.Authenticators.DEVICE_CREDENTIAL;

        @JavascriptInterface
        public String durum() {
            try {
                int r = androidx.biometric.BiometricManager.from(MainActivity.this)
                        .canAuthenticate(POLICY);
                return r == androidx.biometric.BiometricManager.BIOMETRIC_SUCCESS ? "hazir" : "yok";
            } catch (Exception e) {
                return "yok";
            }
        }

        /* JS ayarı Java'ya bildirir (localStorage Java'dan okunamaz). */
        @JavascriptInterface
        public void ayarla(boolean acik) {
            kilitIstekli = acik;
        }

        @JavascriptInterface
        public void dogrula() {
            runOnUiThread(() -> {
                try {
                    androidx.biometric.BiometricPrompt prompt = new androidx.biometric.BiometricPrompt(
                            MainActivity.this,
                            androidx.core.content.ContextCompat.getMainExecutor(MainActivity.this),
                            new androidx.biometric.BiometricPrompt.AuthenticationCallback() {
                                @Override
                                public void onAuthenticationSucceeded(
                                        androidx.biometric.BiometricPrompt.AuthenticationResult r) {
                                    biometrikSonuc(true);
                                }
                                @Override
                                public void onAuthenticationError(int code, CharSequence msg) {
                                    biometrikSonuc(false);
                                }
                                @Override
                                public void onAuthenticationFailed() {
                                    /* yanlış parmak: prompt devam eder, sonuç gönderme */
                                }
                            });
                    // DEVICE_CREDENTIAL izinli olduğunda negatif düğme yasak (API kuralı):
                    // kullanıcı ekran kilidine geçebilir, iptal ettiğinde USER_CANCELED gelir.
                    androidx.biometric.BiometricPrompt.PromptInfo params =
                            new androidx.biometric.BiometricPrompt.PromptInfo.Builder()
                                    .setAllowedAuthenticators(POLICY)
                                    .setTitle("CinePulse kilitli")
                                    .setSubtitle("Parmak izi, yüz veya ekran kilidi ile aç")
                                    .build();
                    prompt.authenticate(params);
                } catch (Exception e) {
                    biometrikSonuc(false);
                }
            });
        }
    }

    private void biometrikSonuc(boolean basarili) {
        try {
            if (bridge != null && bridge.getWebView() != null) {
                bridge.getWebView().evaluateJavascript(
                    "window.__cpBiometrik && window.__cpBiometrik("
                        + (basarili ? "true" : "false") + ");", null);
            }
        } catch (Exception ignored) {
        }
    }

    @Override
    public void onDestroy() {
        if (mediaGateway != null) mediaGateway.stop();
        if (pageResolver != null) pageResolver.close();
        if (torrentBridge != null) torrentBridge.close();
        super.onDestroy();
    }

    // #13/#15 şema yakalama — gelen URI'yi WebView kancalarına yönlendir:
    // magnet: → __cpMagnetGeldi (P2P penceresi); cinepulse: → __cpDerinBaglanti.
    private void semaliVeriYonlendir(Intent intent) {
        try {
            if (intent == null || intent.getData() == null) return;
            Uri veri = intent.getData();
            String sema = veri.getScheme();
            String kanca;
            if ("magnet".equals(sema)) kanca = "__cpMagnetGeldi";
            else if ("cinepulse".equals(sema)) kanca = "__cpDerinBaglanti";
            else return;
            final String adres = veri.toString();
            // WebView henüz hazır değilse kısa bekle ve tekrar dene.
            final android.os.Handler h = new android.os.Handler(android.os.Looper.getMainLooper());
            final int[] deneme = {0};
            Runnable dene = new Runnable() {
                @Override public void run() {
                    try {
                        if (bridge != null && bridge.getWebView() != null) {
                            String kacak = adres.replace("\\", "\\\\").replace("'", "\\'");
                            bridge.getWebView().evaluateJavascript(
                                "window." + kanca + " && window." + kanca + "('" + kacak + "')", null);
                        } else if (deneme[0]++ < 20) {
                            h.postDelayed(this, 500);
                        }
                    } catch (Exception ignored) {}
                }
            };
            h.post(dene);
        } catch (Exception ignored) {}
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        semaliVeriYonlendir(intent);
    }

    // #7 Tema simgeleri: launcher takma adlarından yalnız biri etkin olmalı.
    private static final String[] TEMA_ALIASLARI = {"TemaKlasik", "TemaKizil", "TemaOkyanus", "TemaOrman", "TemaMor"};

    private void temaSimgeUygula(String ad) {
        String hedef = aliasAdi(ad);
        android.content.pm.PackageManager pm = getPackageManager();
        for (String alias : TEMA_ALIASLARI) {
            try {
                android.content.ComponentName cn =
                    new android.content.ComponentName(getPackageName(), getPackageName() + "." + alias);
                int istenen = alias.equals(hedef)
                    ? android.content.pm.PackageManager.COMPONENT_ENABLED_STATE_ENABLED
                    : android.content.pm.PackageManager.COMPONENT_ENABLED_STATE_DISABLED;
                if (pm.getComponentEnabledSetting(cn) != istenen) {
                    pm.setComponentEnabledSetting(cn, istenen, android.content.pm.PackageManager.DONT_KILL_APP);
                }
            } catch (Exception ignored) {}
        }
    }

    private static String aliasAdi(String ad) {
        if ("kizil".equals(ad)) return "TemaKizil";
        if ("okyanus".equals(ad)) return "TemaOkyanus";
        if ("orman".equals(ad)) return "TemaOrman";
        if ("mor".equals(ad)) return "TemaMor";
        return "TemaKlasik";
    }

    // Doğrulama: açılışta kayıtla gerçeği eşitle (yarım kalan geçiş düzelir).
    private void temaSimgeOnar() {
        try {
            temaSimgeUygula(getSharedPreferences("cp_uygulama", MODE_PRIVATE).getString("tema_simge", "klasik"));
        } catch (Exception ignored) {}
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

        // Yol haritası #9: harici oynatıcıda OYNATMA (VLC/mpv/JustPlayer...).
        // MIME kısıtı oynatıcı bulamazsa kısıtsız yeniden denenir.
        @JavascriptInterface
        public String openExternalPlayer(String url, String mime) {
            try {
                String u = url == null ? "" : url.trim();
                if (!u.startsWith("http://") && !u.startsWith("https://")) return "YOK";
                String m = (mime == null || mime.trim().isEmpty()) ? "video/*" : mime.trim();
                Intent i = new Intent(Intent.ACTION_VIEW);
                i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                i.setDataAndType(Uri.parse(u), m);
                if (i.resolveActivity(getPackageManager()) == null) {
                    i.setDataAndType(Uri.parse(u), "*/*");
                    if (i.resolveActivity(getPackageManager()) == null) return "YOK";
                }
                startActivity(i);
                return "OK";
            } catch (Exception e) {
                return "YOK";
            }
        }

        // #7: launcher simge temasını değiştir (klasik|kizil|okyanus|orman|mor).
        @JavascriptInterface
        public String setThemeIcon(String ad) {
            try {
                String a = ad == null ? "klasik" : ad.trim().toLowerCase(java.util.Locale.US);
                if (!a.equals("klasik") && !a.equals("kizil") && !a.equals("okyanus")
                    && !a.equals("orman") && !a.equals("mor")) return "YOK";
                getSharedPreferences("cp_uygulama", MODE_PRIVATE).edit().putString("tema_simge", a).apply();
                temaSimgeUygula(a);
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

    /**
     * CLOUDSTREAM3 EKLENTİ KÖPRÜSÜ (kullanıcı 2026-10-29).
     * JS tarafı: window.CinePulseCloudStream. Tüm metotlar senkron JSON string
     * döner (JS köprü metotları binder havuz iş parçacığında koşar; ağ işi
     * ana iş parçacığını bloklamaz). Mevcut köprü adlarıyla çakışmaması için
     * tümü 'cs' öneki + benzersiz addır — overload YOK (JS↔Java köprüsü
     * aşırı yüklemeleri çözemez; skill kuralı).
     * Dönüş şeması: {ok:true,...} / {ok:false, islem, tur, hata} — hata tipi
     * NoClassDefFoundError ise 'hata' alanı eksik FQN'i taşır.
     */
    public final class CloudStreamBridge {
        /** csAs havuzu: TEK thread — provider'lar (APIHolder static) thread-safe değil;
         *  serial çalışma hem güvenliği hem beklenen sırayı garanti eder. */
        private final java.util.concurrent.ExecutorService csHavuz =
            java.util.concurrent.Executors.newSingleThreadExecutor(r -> {
                Thread t = new Thread(r, "cs-asenkran");
                t.setDaemon(true);
                return t;
            });
        private synchronized void csDiskiHazirla() {
            if (csDiskYuklendi || csHost == null) return;
            csDiskYuklendi = true;
            try { csHost.disktekiEklentileriYenidenYukle(); } catch (Exception ignored) {}
        }

        @JavascriptInterface
        public String csDurum() {
            try {
                csDiskiHazirla();
                return csHost.durum().toString();
            } catch (Throwable t) { return "{\"ok\":false,\"hata\":\"" + safeMsg(t) + "\"}"; }
        }

        /** .cs3 (zip içinde classes.dex + manifest.json) veya .apk eklentisini indirir ve yükler. */
        @JavascriptInterface
        public String csEklentiYukle(String url, String gorunenAd) {
            csDiskiHazirla();
            try { return csHost.apkYukle(url, gorunenAd).toString(); }
            catch (Throwable t) { return "{\"ok\":false,\"hata\":\"" + safeMsg(t) + "\"}"; }
        }

        @JavascriptInterface
        public String csEklentiListesi() {
            csDiskiHazirla();
            try { return csHost.listesi().toString(); }
            catch (Throwable t) { return "{\"ok\":false,\"hata\":\"" + safeMsg(t) + "\"}"; }
        }

        @JavascriptInterface
        public String csEklentiKaldir(String eklentiId) {
            try { return csHost.kaldir(eklentiId).toString(); }
            catch (Throwable t) { return "{\"ok\":false,\"hata\":\"" + safeMsg(t) + "\"}"; }
        }

        /** CloudStream repo.json manifestini indirir; KALEMLERİ LİSTER ( yüklemez). */
        @JavascriptInterface
        public String csRepoEkle(String repoUrl) {
            try { return csHost.repoEkle(repoUrl, false).toString(); }
            catch (Throwable t) { return "{\"ok\":false,\"hata\":\"" + safeMsg(t) + "\"}"; }
        }

        /** repo.json manifestini indirir ve TÜM eklenti APK'larını yükler (ağ yoğun). */
        @JavascriptInterface
        public String csRepoYukle(String repoUrl) {
            csDiskiHazirla();
            try { return csHost.repoEkle(repoUrl, true).toString(); }
            catch (Throwable t) { return "{\"ok\":false,\"hata\":\"" + safeMsg(t) + "\"}"; }
        }

        /** Sağlayıcının ana sayfa sekmeleri: sagId = 'eklentiId#sağlayıcıIndex'. */
        @JavascriptInterface
        public String csSaglayiciAnaSayfalar(String sagId) {
            csDiskiHazirla();
            try { return csHost.anaSayfalar(sagId).toString(); }
            catch (Throwable t) { return "{\"ok\":false,\"hata\":\"" + safeMsg(t) + "\"}"; }
        }

        @JavascriptInterface
        public String csAnaSayfaIcerik(String sagId, int sayfaIndex, int sayfa) {
            csDiskiHazirla();
            try { return csHost.anaSayfaIcerik(sagId, sayfaIndex, sayfa).toString(); }
            catch (Throwable t) { return "{\"ok\":false,\"hata\":\"" + safeMsg(t) + "\"}"; }
        }

        /** sagId boş veya '*' → tüm yüklü sağlayıcılarda arar. */
        @JavascriptInterface
        public String csAra(String sagId, String sorgu) {
            csDiskiHazirla();
            try { return csHost.ara(sagId, sorgu).toString(); }
            catch (Throwable t) { return "{\"ok\":false,\"hata\":\"" + safeMsg(t) + "\"}"; }
        }

        /** Arama/ana sayfa sonucundaki url'yi açar: {ad,tur,bolumler:[{veri,...}]}. */
        @JavascriptInterface
        public String csYukle(String sagId, String url) {
            csDiskiHazirla();
            try { return csHost.yukle(sagId, url).toString(); }
            catch (Throwable t) { return "{\"ok\":false,\"hata\":\"" + safeMsg(t) + "\"}"; }
        }

        /** loadLinks → ExtractorLink listesi: {linkler:[{ad,url,referer,kalite,tur}],altyazilar:[]}. */
        @JavascriptInterface
        public String csAkislar(String sagId, String veriUrl) {
            csDiskiHazirla();
            try { return csHost.akislar(sagId, veriUrl).toString(); }
            catch (Throwable t) { return "{\"ok\":false,\"hata\":\"" + safeMsg(t) + "\"}"; }
        }

        /* ---- Asenkran çağrılar (kullanıcı 2026-10-29): senkron cs* metodları
         * WebView JS thread'ini ağ süresi boyunca TAMAMEN blokluyordu — KAYNAKLAR
         * sekmesine girince uygulama donuyordu (kullanıcı şikâyeti, cihazda doğrulandı).
         * csAs ağ işini havuz thread'ine alır, sonucu window.__csCb(cbId, json) ile
         * geri döner (WebViewResolverBridge deseni). cbId [A-Za-z0-9_] olmalı. ---- */
        private java.util.Set<String> csAsIzin = new java.util.HashSet<>(java.util.Arrays.asList(
            "csAra", "csYukle", "csAkislar", "csRepoYukle", "csEklentiYukle", "csRepoEkle"));

        @JavascriptInterface
        public void csAs(final String cbId, final String metot, final String a1, final String a2) {
            if (cbId == null || !cbId.matches("[A-Za-z0-9_]{1,48}")
                || metot == null || !csAsIzin.contains(metot)) {
                csCbGonder(cbId, "{\"ok\":false,\"hata\":\"gecersiz csAs cagrisi\"}");
                return;
            }
            csHavuz.execute(() -> {
                String json;
                try {
                    csDiskiHazirla();
                    switch (metot) {
                        case "csAra":           json = csHost.ara(a1, a2).toString(); break;
                        case "csYukle":         json = csHost.yukle(a1, a2).toString(); break;
                        case "csAkislar":       json = csHost.akislar(a1, a2).toString(); break;
                        case "csRepoYukle":     json = csHost.repoEkle(a1, true).toString(); break;
                        case "csRepoEkle":      json = csHost.repoEkle(a1, false).toString(); break;
                        default /*csEklentiYukle*/: json = csHost.apkYukle(a1, a2).toString(); break;
                    }
                } catch (Throwable t) {
                    json = "{\"ok\":false,\"hata\":\"" + safeMsg(t) + "\"}";
                }
                csCbGonder(cbId, json);
            });
        }

        private void csCbGonder(String cbId, String json) {
            if (cbId == null || !cbId.matches("[A-Za-z0-9_]{1,48}")) return;
            final String literal = JSONObject.quote(json == null ? "" : json);
            runOnUiThread(() -> {
                try {
                    if (bridge == null || bridge.getWebView() == null) return;
                    bridge.getWebView().evaluateJavascript(
                        "window.__csCb && window.__csCb(" + JSONObject.quote(cbId) + "," + literal + ");", null);
                } catch (Exception ignored) {}
            });
        }

        private String safeMsg(Throwable t) {
            String m = t.getMessage() == null ? t.getClass().getSimpleName() : t.getMessage();
            return m.replace("\\", "\\\\").replace("\"", "'").replace("\n", " ");
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
