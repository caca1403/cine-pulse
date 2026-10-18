package com.cinepulse.studio;

import android.app.Activity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import java.util.Map;

import androidx.media3.common.MediaItem;
import androidx.media3.common.MimeTypes;
import androidx.media3.common.Player;
import androidx.media3.exoplayer.ExoPlayer;
import androidx.media3.exoplayer.source.DefaultMediaSourceFactory;
import androidx.media3.exoplayer.source.MediaSource;
import androidx.media3.exoplayer.source.MergingMediaSource;
import androidx.media3.exoplayer.source.SingleSampleMediaSource;

/**
 * NATIVE OYNATICI — WebView'in yerine.
 *
 * NEDEN VAR (ölçülen, 2026-10-16): oynatma WebView `<video>` ile yapılıyordu.
 * Chromium HEVC/H.265 çözemiyor; cihazdaki yayınlarda `video.error.code = 4`
 * ("MEDIA_ELEMENT_ERROR: Format error") ve `networkState = 3` oluyordu, yani
 * kaynak listede görünüyor ama OYNATILAMIYORDU. Cihazın kendi çözücüsü HEVC
 * destekli (`c2.qti.hevc.decoder`), ama Chromium o çözücüye ulaşmıyor.
 *
 * ÇÖZÜM: ExoPlayer (Media3) doğrudan cihaz çözücüsünü kullanır. WebView
 * devre dışı kalır. Böylece H.264, H.265 ve HLS'in hepsi oynar.
 *
 * Aynı yaklaşımın doğru olduğu yer: Kodi eklentileri de tarayıcı kullanmaz,
 * native oynatıcı kullanır.
 */
final class NativePlayerView {

    private final MainActivity activity;
    private FrameLayout container;
    private android.view.TextureView dokuView;
    private androidx.media3.ui.PlayerView playerView;
    private ExoPlayer player;

    NativePlayerView(MainActivity activity) {
        this.activity = activity;
    }

    /**
     * Yayını cihaz çözücüsüyle oynatır.
     *
     * GÖRÜNÜM: ExoPlayer'ın kendi kontrolleri KAPALI — yalnız görüntü üretilir.
     * Yüzey WebView'in ARKASINA eklenir; WebView saydam bırakıldığında
     * uygulamanın kendi player kontrolleri (başlık, ilerleme çubuğu, kaynak
     * listesi, çıkış) üstte görünmeye devam eder. Yani çözücü native,
     * arayüz tamamen CinePulse'un kendi arayüzü — Nuvio'daki gibi.
     */
    void play(final String url, final String title, final String headersJson) {
        play(url, title, headersJson, null, 0);
    }

    /**
     * Yayını altyazı ile birlikte oynatır.
     *
     * ALTYAZI NEDEN PLAY ANINDA VERİLİR (ölçülen hata, 2026-10-17): ExoPlayer'da
     * oynatma başladıktan sonra medya öğesine altyazı EKLENEMEZ. Bu yüzden
     * WebView tarafı altyazıyı önce çözer (OpenSubtitles v3), WebVTT'ye çevirir
     * ve metni buraya verir; burada geçici dosyaya yazılıp yayınla BİRLEŞTİRİLİR
     * (SingleSampleMediaSource + MergingMediaSource). Media3'ün CC düğmesi
     * böylece gerçekten çalışır: dil listesi, aç/kapa, "Yok".
     *
     * @param altyaziJson JSON dizi: [{"etiket":"Türkçe","dil":"tr","vtt":"WEBVTT…"}]
     */
    void play(final String url, final String title, final String headersJson, final String altyaziJson) {
        play(url, title, headersJson, altyaziJson, 0);
    }

    /**
     * Kaldığın yerden devam: startSaniye>0 ise ExoPlayer medyayı DOĞRUDAN o
     * saniyeden hazırlar (post-hoc seek'e güvenmez — WebView'a değil, native
     * oynatıcıya uygulanır, kullanıcı 2026-10-18).
     */
    void play(final String url, final String title, final String headersJson, final String altyaziJson, final double startSaniye) {
        if (activity == null || url == null || url.isEmpty()) return;
        final long baslangicMs = (long) (Math.max(0d, startSaniye) * 1000d);
        activity.runOnUiThread(new Runnable() {
            @Override public void run() {
                release();
                container = new FrameLayout(activity);
                container.setLayoutParams(new ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
                container.setBackgroundColor(0xFF000000);
                container.setSystemUiVisibility(
                        View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_FULLSCREEN
                                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);

                // ÖLÇÜLEN HATA (2026-10-16): ses var, görüntü yok. Sebep: PlayerView varsayılan
                // olarak SurfaceView kullanır; SurfaceView AYRI KATMANDA çizilir,
                // görünüm hiyerarşisini bozar ve saydam WebView onu örter.
                // Çözüm: PlayerView'e gerek yok (kontroller zaten kapalı),
                // doğrudan TextureView kullanılır — normal bir görünüm gibi
                // birleşir, WebView'in arkasında kalır, üstteki DOM
                // kontrolleri görünür.
                playerView = new androidx.media3.ui.PlayerView(turkceBaglam(activity));
                // HAZIR PROFESYONEL KONTROL ARAYÜZÜ (Media3 PlayerView):
                // elle çizilen butonların yerine YouTube/Stremio kalitesinde
                // bar: animasyonlu gizlenme, sürüklenebilir ilerleme çubuğu,
                // zaman göstergesi, tam ekran ve hız/altyazı menüsü hazır gelir.
                playerView.setUseController(true);
                playerView.setControllerAutoShow(true);
                playerView.setControllerHideOnTouch(true);
                playerView.setShowBuffering(androidx.media3.ui.PlayerView.SHOW_BUFFERING_WHEN_PLAYING);
                playerView.setKeepContentOnPlayerReset(true);
                playerView.setShutterBackgroundColor(0xFF000000);
                // SES + ALTYAZI YÖNETİMİ: PlayerView'ın hazır altyazı düğmesi,
                // yayındaki tüm ses parçalarını ve altyazıları listeleyen seçim
                // penceresini açar (parça seçimi, altyazı aç/kapa, dil değiştir).
                playerView.setShowSubtitleButton(true);
                // ── TAM EKRAN DÜĞMESİ: MEDIA3'ÜN KENDİ DÜĞMESİ ──────────────
                // ÖLÇÜLDÜ (media3-ui 1.4.1 kaynağı, PlayerControlView):
                // `exo_fullscreen` düğmesi kontrol çubuğunda — CC ve dişlinin
                // HEMEN YANINDA, o yarı saydam siyah şeridin içinde — hazır
                // durur; fakat bir tam ekran dinleyicisi bağlanmadığı sürece
                // GONE'dur:
                //   updateFullScreenButtonVisibility(fullScreenButton, listener != null)
                // Dinleyici bağlanınca düğme görünür, ikonu (gir/çık) Media3
                // kendisi değiştirir ve kontrol çubuğuyla birlikte gizlenir.
                // Bu yüzden elle çizilen yüzen ⛶ düğmesi kaldırıldı.
                playerView.setFullscreenButtonClickListener(
                        new androidx.media3.ui.PlayerView.FullscreenButtonClickListener() {
                            @Override public void onFullscreenButtonClick(boolean isFullScreen) {
                                tamEkraniAyarla(isFullScreen);
                            }
                        });
                playerView.setShowBuffering(androidx.media3.ui.PlayerView.SHOW_BUFFERING_WHEN_PLAYING);
                dokuView = new android.view.TextureView(activity);
                container.addView(playerView, new FrameLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

                // Çekirdek istek başlıklarını (Referer/User-Agent/Cookie) verirse
                // sunucu 403 dönebiliyor; HTTP veri kaynağına taşınır.
                Map headers = parseBasliklar(headersJson);
                androidx.media3.datasource.DefaultHttpDataSource.Factory httpFactory =
                        new androidx.media3.datasource.DefaultHttpDataSource.Factory()
                                .setAllowCrossProtocolRedirects(true);
                if (headers != null && !headers.isEmpty()) {
                    httpFactory.setDefaultRequestProperties(headers);
                }
                player = new ExoPlayer.Builder(activity)
                        .setMediaSourceFactory(new DefaultMediaSourceFactory(httpFactory))
                        .build();
                player.setVideoTextureView(dokuView);
                playerView.setPlayer(player);

                // MIME tipi ADRES UZANTISINDAN ÇIKARILAMAZ: yayınlar köprüden geçerken
                // `/api/hls_proxy?url=…` biçimine geliyor (uzantı yok), ExoPlayer
                // bunu "progressive" sanıp playlist'i çözmüyordu. Tip açıkça verilir.
                //
                // ÖLÇÜLEN HATA (2026-10-16, anizium): köprülenmiş HER adresi HLS
                // saymak, başlık isteyen MP4 yayınlarını da HLS sanıyor →
                // "Bu kaynak oynatılamadı" (mp4 baytları playlist sanıldı). Artık
                // köprünün İÇİNDEKİ gerçek adres (`url=` parametresi) incelenir.
                String mime = null;
                String kucuk = url.toLowerCase(java.util.Locale.ROOT);
                String icAdres = kucuk;
                int icBas = kucuk.indexOf("url=");
                if (icBas >= 0) {
                    try {
                        String ham = url.substring(icBas + 4);
                        int ampersand = ham.indexOf('&');
                        if (ampersand >= 0) ham = ham.substring(0, ampersand);
                        icAdres = java.net.URLDecoder.decode(ham, "UTF-8").toLowerCase(java.util.Locale.ROOT);
                    } catch (Exception ignored) { icAdres = kucuk; }
                }
                if (icAdres.contains(".m3u8") || icAdres.contains(".m3u")) mime = MimeTypes.APPLICATION_M3U8;
                else if (icAdres.contains(".mp4")) mime = MimeTypes.VIDEO_MP4;
                else if (icAdres.contains(".mkv")) mime = "video/x-matroska";
                else if (icAdres.contains(".webm")) mime = MimeTypes.VIDEO_WEBM;
                else if (icAdres.contains(".mpd")) mime = MimeTypes.APPLICATION_MPD;
                else if (kucuk.contains("/api/hls_proxy")) mime = MimeTypes.APPLICATION_M3U8;

                MediaItem.Builder itemBuilder = new MediaItem.Builder().setUri(url);
                if (mime != null) itemBuilder.setMimeType(mime);
                MediaItem medyaOgesi = itemBuilder.build();

                // ── ALTYAZI: yayınla BİRLEŞTİRİLEREK yüklenir ────────────────
                // (ExoPlayer'da oynatma sonrası altyazı eklenemez; bu yüzden
                // WebView tarafı altyazıyı önceden çözüp WebVTT metni olarak verir.)
                java.util.List<MediaSource> altyazilar = altyaziKaynaklari(altyaziJson, httpFactory);
                if (altyazilar.isEmpty()) {
                    player.setMediaItem(medyaOgesi, baslangicMs);
                } else {
                    MediaSource anaKaynak = new DefaultMediaSourceFactory(httpFactory).createMediaSource(medyaOgesi);
                    MediaSource[] birlesik = new MediaSource[altyazilar.size() + 1];
                    birlesik[0] = anaKaynak;
                    for (int i = 0; i < altyazilar.size(); i++) birlesik[i + 1] = altyazilar.get(i);
                    player.setMediaSource(new MergingMediaSource(birlesik), baslangicMs);
                    // Altyazı İSTENEREK verildi: varsayılan olarak AÇIK gelsin.
                    // Media3 altyazı parçalarını kendiliğinden seçmez; tercih
                    // dilini bildirmek seçimi yapar (kullanıcı CC'den değiştirir).
                    String hedefDil = altyaziDili(altyaziJson);
                    player.setTrackSelectionParameters(player.getTrackSelectionParameters().buildUpon()
                            .setPreferredTextLanguage(hedefDil)
                            .setSelectUndeterminedTextLanguage(true)
                            .build());
                }
                player.prepare();
                // KALDIĞIN YERDEN DEVAM (kullanıcı 2026-10-18): başlangıç konumu
                // doğrudan ExoPlayer'a verilir — arka plandaki WebView <video>'ya
                // değil. Media3 timeline hazır olunca seek'i uygular; JS bekçisi
                // ayrıca hedefe ulaşana dek yedek olarak sarar.
                if (startSaniye > 0.5) {
                    player.seekTo((long) (startSaniye * 1000));
                }
                player.setPlayWhenReady(true);
                player.addListener(new Player.Listener() {
                    @Override public void onPlayerError(androidx.media3.common.PlaybackException error) {
                        // SİYAH EKRAN YAPMA: native oynatma tutmazsa kullanıcıya
                        // net sebep gösterilir ve player'a dönülür.
                        bildirHata("Bu kaynak oynatılamadı (codec/bağlantı: "
                                + hataOzeti(error) + "). Başka bir kaynak seç.");
                        close();
                    }

                    @Override public void onPlaybackStateChanged(int state) {
                        if (state == Player.STATE_READY && player != null) {
                            android.util.Log.i("CPResume", "READY pos=" + player.getCurrentPosition() + " start=" + baslangicMs + " dur=" + player.getDuration());
                        }
                        if (state == Player.STATE_ENDED) close();
                    }
                });

                // Video player'ın İÇİNDE, ekrana göre ölçekli: yüzey ÜSTTE ama YALNIZ
                // videonun ekran dikdörtgenini kaplar (setBounds). Böylece
                // görüntü görünür (WebView saydamlığına bağlı değiliz),
                // kontrol çubuğumuz videonun ALTINDA kaldığı için hem görünür
                // hem dokunulabilir olur. Ölçülen: WebView arkasına gömünce
                // ses vardı, görüntü yoktu — modal arka planı opak kalıyor.
                ViewGroup decor = (ViewGroup) activity.getWindow().getDecorView();
                decor.addView(container, new ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
                container.bringToFront();
                yuzeyArkada = false;
                ustCubukKur(title);
            }
        });
    }

    /** Oynatıcıyı kapatır ve WebView'e geri döner. */
    void close() {
        if (activity == null) return;
        activity.runOnUiThread(new Runnable() {
            @Override public void run() {
                release();
                ViewGroup decor = (ViewGroup) activity.getWindow().getDecorView();
                if (container != null) decor.removeView(container);
            }
        });
    }

    /**
     * Yüzeyi videonun EKRAN DİKDÖRTGENİNE göre konumlandırır.
     *
     * NEDEN: Nuvio (Kodi) video'yu uygulamanın kendi player ekranının İÇİNDE
     * gösterir; ayrı bir oynatıcı ekranı yok. Biz de öyleyiz: WebView saydam,
     * native yüzey onun ALTINDA ve yalnız video alanının dikdörtgenini kaplar.
     * Böylece video, player'ımızın içinde "ekrana göre ölçek" görünür ve
     * başlık/ilerleme/kaynak listesi gibi TÜM kontrollerimiz yerinde kalır.
     *
     * @param l,t,r,b cihaz pikseli (WebView penceresi koordinatlarında)
     */
    void setBounds(int l, int t, int r, int b) {
        if (container == null) return;
        final int width = Math.max(1, r - l);
        final int height = Math.max(1, b - t);
        activity.runOnUiThread(new Runnable() {
            @Override public void run() {
                if (container == null) return;
                ViewGroup decor = (ViewGroup) activity.getWindow().getDecorView();
                ViewGroup.LayoutParams lp = container.getLayoutParams();
                if (!(lp instanceof ViewGroup.MarginLayoutParams)) {
                    lp = new ViewGroup.MarginLayoutParams(width, height);
                }
                lp.width = width;
                lp.height = height;
                if (lp instanceof ViewGroup.MarginLayoutParams) {
                    ViewGroup.MarginLayoutParams mp = (ViewGroup.MarginLayoutParams) lp;
                    mp.setMargins(l, t, 0, 0);
                }
                container.setLayoutParams(lp);
                if (dokuView != null) {
                    dokuView.requestLayout();
                }
            }
        });
    }

    // ── DOM kontrollerinden gelen komutlar ────────────────────────────────
    // Player'ın butonları gizli <video>'yu değil NATIVE oynatıcıyı yönetir.
    //
    // ÖLÇÜLEN HATA (2026-10-18, resume testi): @JavascriptInterface metotları
    // WebView köprü thread'inde koşar; Media3 Player yalnız KENDİ thread'inden
    // (ana thread) çağrılabilir. Doğrudan çağrılar "Player is accessed on the
    // wrong thread" fırlatıyordu → JS yedekçisi konumu hiç okuyamıyor, kaldığın
    // yerden saramıyordu. Tümü ana thread'e köprülenir; okuyucular sonucu
    // bekler (kısa latch), yazıcılar sıraya girer.
    private void anaThread(boolean bekle, Runnable is) {
        if (android.os.Looper.myLooper() == android.os.Looper.getMainLooper()) { is.run(); return; }
        final java.util.concurrent.CountDownLatch lata = new java.util.concurrent.CountDownLatch(1);
        activity.runOnUiThread(new Runnable() {
            @Override public void run() { try { is.run(); } finally { lata.countDown(); } }
        });
        if (bekle) { try { lata.await(400, java.util.concurrent.TimeUnit.MILLISECONDS); } catch (InterruptedException ignored) {} }
    }

    boolean oynatiliyorMu() {
        final boolean[] sonuc = {false};
        anaThread(true, new Runnable() {
            @Override public void run() { sonuc[0] = player != null && player.isPlaying(); }
        });
        return sonuc[0];
    }
    void oynat() { anaThread(false, new Runnable() { @Override public void run() { if (player != null) player.setPlayWhenReady(true); } }); }
    void durdur() { anaThread(false, new Runnable() { @Override public void run() { if (player != null) player.setPlayWhenReady(false); } }); }
    void ilerle(double saniye) {
        final long ms = (long) (saniye * 1000);
        anaThread(false, new Runnable() { @Override public void run() { if (player != null) player.seekTo(ms); } });
    }
    void atla(double saniye) {
        anaThread(false, new Runnable() {
            @Override public void run() {
                if (player == null) return;
                long hedef = player.getCurrentPosition() + (long) (saniye * 1000);
                long sure = player.getDuration();
                if (sure > 0 && hedef > sure - 3000) hedef = Math.max(0, sure - 3000);
                if (hedef < 0) hedef = 0;
                player.seekTo(hedef);
            }
        });
    }
    double konumMs() {
        final long[] sonuc = {0};
        anaThread(true, new Runnable() {
            @Override public void run() { if (player != null) sonuc[0] = player.getCurrentPosition(); }
        });
        return sonuc[0];
    }
    double sureMs() {
        final long[] sonuc = {0};
        anaThread(true, new Runnable() {
            @Override public void run() { if (player != null) sonuc[0] = player.getDuration(); }
        });
        long d = sonuc[0];
        return d == 9223372036854775807L ? 0 : d;
    }

    void hiz(final double kat) {
        anaThread(false, new Runnable() {
            @Override public void run() {
                if (player == null) return;
                try { player.setPlaybackSpeed((float) Math.max(0.25, Math.min(3, kat))); } catch (Exception ignored) {}
            }
        });
    }

    void ses(final double seviye) {
        anaThread(false, new Runnable() {
            @Override public void run() {
                if (player == null) return;
                try { player.setVolume((float) Math.max(0, Math.min(1, seviye))); } catch (Exception ignored) {}
            }
        });
    }

    private static String hataOzeti(androidx.media3.common.PlaybackException error) {
        try {
            String m = String.valueOf(error.getMessage());
            return m.length() > 70 ? m.substring(0, 70) + "…" : m;
        } catch (Exception e) {
            return "bilinmeyen";
        }
    }

    /** JS'ye olay gönderir: player kendi uyarısını gösterir (siyah ekran yok). */
    private void bildirHata(final String mesaj) {
        try {
            if (bridgeForJs() == null) return;
            final String json = mesaj.replace("\\", "\\\\").replace("\"", "\\\"");
            bridgeForJs().post(new Runnable() {
                @Override public void run() {
                    bridgeForJs().evaluateJavascript(
                            "window.dispatchEvent(new CustomEvent('cp-native-hata',{detail:'" + json + "'}))", null);
                }
            });
        } catch (Exception ignored) {}
    }

    private android.webkit.WebView bridgeForJs() {
        try {
            return activity.bridgeForPlayer() != null ? activity.bridgeForPlayer().getWebView() : null;
        } catch (Exception e) { return null; }
    }

    /**
     * NATIVE KONTROL ÇUBUĞU — WebView oynatıcıdaki kontrollerin yerine geçer
     * (WebView oynatıcı tamamen kullanımdan kalkıyor). Basit ve güvenilir:
     * geri, -10 sn, oynat/duraklat, +10 sn, ilerleme çubuğu ve zaman yazısı.
     */
    private void kontrolleriKur(String title) {
        if (container == null) return;
        android.widget.LinearLayout panel = new android.widget.LinearLayout(activity);
        panel.setOrientation(android.widget.LinearLayout.VERTICAL);
        panel.setBackgroundColor(0xCC000000);
        int pad = (int) (10 * activity.getResources().getDisplayMetrics().density);
        panel.setPadding(pad, pad, pad, pad);

        // Üst satır: geri + ad
        android.widget.LinearLayout ust = new android.widget.LinearLayout(activity);
        ust.setOrientation(android.widget.LinearLayout.HORIZONTAL);
        ust.setGravity(android.view.Gravity.CENTER_VERTICAL);
        android.widget.TextView geri = new android.widget.TextView(activity);
        geri.setText("‹  Geri");
        geri.setTextColor(0xFFFFFFFF);
        geri.setTextSize(16);
        geri.setPadding(0, 0, pad * 2, 0);
        geri.setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { close(); }
        });
        ust.addView(geri);
        android.widget.TextView ad = new android.widget.TextView(activity);
        ad.setText(title == null || title.isEmpty() ? "CinePulse" : title);
        ad.setTextColor(0xFFB8E986);
        ad.setTextSize(14);
        ust.addView(ad);
        panel.addView(ust);

        // İlerleme çubuğu
        final android.widget.SeekBar cubuk = new android.widget.SeekBar(activity);
        cubuk.setMax(1000);
        cubuk.setOnSeekBarChangeListener(new android.widget.SeekBar.OnSeekBarChangeListener() {
            @Override public void onProgressChanged(android.widget.SeekBar sb, int p, boolean kullanici) {
                if (!kullanici || player == null) return;
                long sure = player.getDuration();
                if (sure > 0) player.seekTo(sure * p / 1000);
            }
            @Override public void onStartTrackingTouch(android.widget.SeekBar sb) {}
            @Override public void onStopTrackingTouch(android.widget.SeekBar sb) {}
        });
        panel.addView(cubuk);

        // Alt satır: -10 · oynat/duraklat · +10  · zaman
        android.widget.LinearLayout alt = new android.widget.LinearLayout(activity);
        alt.setOrientation(android.widget.LinearLayout.HORIZONTAL);
        alt.setGravity(android.view.Gravity.CENTER_VERTICAL);
        final android.widget.TextView zaman = new android.widget.TextView(activity);
        zaman.setTextColor(0xFFFFFFFF);
        zaman.setTextSize(13);
        alt.addView(zaman);

        android.widget.Button geri10 = dugme("⏪ 10");
        geri10.setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { atla(-10); }
        });
        alt.addView(geri10);

        final android.widget.Button oynat = dugme("⏯");
        oynat.setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                if (oynatiliyorMu()) durdur(); else oynat();
                oynat.setText(oynatiliyorMu() ? "⏸" : "▶");
            }
        });
        alt.addView(oynat);

        android.widget.Button ileri10 = dugme("10 ⏩");
        ileri10.setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { atla(10); }
        });
        alt.addView(ileri10);

        android.widget.Button tamEkran = dugme("⛶");
        tamEkran.setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { tamEkranDegistir(); }
        });
        alt.addView(tamEkran);
        panel.addView(alt);

        android.widget.FrameLayout.LayoutParams lp = new android.widget.FrameLayout.LayoutParams(
                android.widget.FrameLayout.LayoutParams.MATCH_PARENT,
                android.widget.FrameLayout.LayoutParams.WRAP_CONTENT);
        lp.gravity = android.view.Gravity.BOTTOM;
        container.addView(panel, lp);

        // Zaman/çubuk güncelleyici
        final android.os.Handler h = new android.os.Handler(android.os.Looper.getMainLooper());
        h.postDelayed(new Runnable() {
            @Override public void run() {
                if (player == null) return;
                long konum = player.getCurrentPosition();
                long sure = player.getDuration();
                if (sure > 0) cubuk.setProgress((int) (konum * 1000 / sure));
                zaman.setText(sure > 0 ? surek(konum) + " / " + surek(sure) : surek(konum));
                oynat.setText(player.isPlaying() ? "⏸" : "▶");
                h.postDelayed(this, 700);
            }
        }, 700);
    }

    private android.widget.Button dugme(String yazi) {
        // Gri kutulu varsayılan Android butonu yerine DÜZ ikon: arka plan yok,
        // çerçeve yok. Amatör görünümün sebebi buydu.
        android.widget.Button b = new android.widget.Button(activity);
        b.setText(yazi);
        b.setTextSize(20);
        b.setAllCaps(false);
        b.setBackground(null);
        b.setTextColor(0xFFFFFFFF);
        b.setPadding(24, 0, 24, 0);
        b.setMinWidth(0);
        b.setMinimumWidth(0);
        b.setMinHeight(0);
        b.setMinimumHeight(0);
        return b;
    }

    /** Gerçek tam ekran: yatay yön + sistem barları gizli, tekrar basınca geri. */
    private void tamEkranDegistir() {
        try {
            boolean yatay = activity.getResources().getConfiguration().orientation
                    == android.content.res.Configuration.ORIENTATION_LANDSCAPE;
            activity.setRequestedOrientation(yatay
                    ? android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
                    : android.content.pm.ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
            if (container != null) {
                container.setSystemUiVisibility(
                        View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_FULLSCREEN
                                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
            }
        } catch (Exception ignored) {}
    }

    private static String surek(long ms) {
        long s = Math.max(0, ms / 1000);
        long dk = s / 60;
        long sn = s % 60;
        return dk + ":" + (sn < 10 ? "0" : "") + sn;
    }

    /** Kontroller artık hazır PlayerView arayüzünde; elle panel çizilmez. */
    private void ustCubukKur(String title) { /* PlayerView kontrolü kullanılır */ }

    // ── TAM EKRAN ────────────────────────────────────────────────────────
    // Düğme Media3'ün KENDİ kontrol çubuğunda (`exo_fullscreen`, CC ve
    // dişlinin yanında) ve kontrol çubuğuyla birlikte gizlenir. Burada yalnız
    // istenen durum uygulanır: yön + kapsayıcı boyutu + sistem barları.
    private boolean tamEkranMi = false;
    private int[] sonSinirlar = null;

    /** Tam ekranı İSTENEN duruma getirir (Media3 düğme durumunu kendi tutar). */
    void tamEkraniAyarla(boolean tamEkran) {
        try {
            if (container == null) return;
            if (tamEkran) {
                // Normal → TAM EKRAN
                ViewGroup.LayoutParams lp = container.getLayoutParams();
                if (lp instanceof ViewGroup.MarginLayoutParams) {
                    ViewGroup.MarginLayoutParams m = (ViewGroup.MarginLayoutParams) lp;
                    sonSinirlar = new int[]{ m.width, m.height, m.leftMargin, m.topMargin };
                }
                lp.width = ViewGroup.LayoutParams.MATCH_PARENT;
                lp.height = ViewGroup.LayoutParams.MATCH_PARENT;
                if (lp instanceof ViewGroup.MarginLayoutParams) {
                    ((ViewGroup.MarginLayoutParams) lp).setMargins(0, 0, 0, 0);
                }
                container.setLayoutParams(lp);
                tamEkranMi = true;
                activity.setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
            } else {
                // TAM EKRAN → normal (eski dikdörtgene dön)
                ViewGroup.LayoutParams lp = container.getLayoutParams();
                if (sonSinirlar != null) {
                    lp.width = sonSinirlar[0];
                    lp.height = sonSinirlar[1];
                    if (lp instanceof ViewGroup.MarginLayoutParams) {
                        ((ViewGroup.MarginLayoutParams) lp).setMargins(sonSinirlar[2], sonSinirlar[3], 0, 0);
                    }
                }
                container.setLayoutParams(lp);
                tamEkranMi = false;
                activity.setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
            }
            // Tam ekranda WebView konumlandırmayı BIRAKIR (yoksa video küçük kalır).
            jsCalistir("window.__cpNativeTamEkran = " + tamEkranMi + ";");
            container.setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
        } catch (Exception ignored) {}
    }

    /** Durumu çevirir (eski çağrı yerleri için). */
    void tamEkraniDegistir() { tamEkraniAyarla(!tamEkranMi); }

    /** Tam ekran ↔ normal arasında geçer (yatay yön + immersive). */
    private void jsCalistir(String kod) {
        try {
            android.webkit.WebView wv = bridgeForJs();
            if (wv != null) wv.post(new Runnable() {
                @Override public void run() { try { wv.evaluateJavascript(kod, null); } catch (Exception ignored) {} }
            });
        } catch (Exception ignored) {}
    }

    /** Kendi üst çubuğumuz: geri düğmesi + içerik adı. */
    private void ustCubukKullanilmiyor(final String title) {
        if (container == null) return;
        android.widget.LinearLayout bar = new android.widget.LinearLayout(activity);
        bar.setOrientation(android.widget.LinearLayout.HORIZONTAL);
        bar.setGravity(android.view.Gravity.CENTER_VERTICAL);
        bar.setBackgroundColor(0xB3000000);
        int pad = (int) (12 * activity.getResources().getDisplayMetrics().density);
        bar.setPadding(pad, pad, pad, pad);
        android.widget.TextView geri = new android.widget.TextView(activity);
        geri.setText("‹  Geri");
        geri.setTextColor(0xFFFFFFFF);
        geri.setTextSize(17);
        geri.setPadding(pad, 0, pad * 2, 0);
        geri.setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { close(); }
        });
        bar.addView(geri);
        android.widget.TextView ad = new android.widget.TextView(activity);
        ad.setText(title == null || title.isEmpty() ? "Oynatılıyor" : title);
        ad.setTextColor(0xFFB8E986);
        ad.setTextSize(15);
        bar.addView(ad);
        android.widget.FrameLayout.LayoutParams lp = new android.widget.FrameLayout.LayoutParams(
                android.widget.FrameLayout.LayoutParams.MATCH_PARENT,
                android.widget.FrameLayout.LayoutParams.WRAP_CONTENT);
        lp.gravity = android.view.Gravity.TOP;
        bar.setTag("cp-ust-cubuk");
        container.addView(bar, lp);
    }

    /** Cihaz geri tuşu oynatıcıyı kapatmalı. */
    boolean acikMi() {
        return container != null && player != null;
    }

    private void release() {
        if (playerView != null) { try { playerView.setPlayer(null); } catch (Exception ignored) {} playerView = null; }
        if (player != null) {
            if (dokuView != null) { try { player.clearVideoTextureView(dokuView); } catch (Exception ignored) {} }
            player.release();
            player = null;
        }
        if (container != null) {
            ViewGroup parent = (ViewGroup) container.getParent();
            if (parent != null) parent.removeView(container);
            container = null;
        }
        dokuView = null;
        yuzeyArkada = false;
    }

    /** WebView'in bulunduğu üst konteyneri bulur (yüzey onun altına girer). */
    private ViewGroup kokBul(ViewGroup decor) {
        android.webkit.WebView wv = null;
        if (activity.bridgeForPlayer() != null) wv = activity.bridgeForPlayer().getWebView();
        ViewGroup parent = wv != null ? (ViewGroup) wv.getParent() : decor;
        return parent != null ? parent : decor;
    }

    /** Yüzey WebView'in arkasında mı? (WebView saydam olmalı) */
    boolean yuzeyArkadaMi() { return yuzeyArkada; }

    private boolean yuzeyArkada = false;

    /**
     * Turkce baglam: PlayerView'in hazir kontrol arayuzu (arac ipuclari, ayar
     * menusu: "Ayarlar / Hiz / Ses / Altyazi / Yok") Media3 kaynaklarindan
     * gelir ve CIHAZ diline gore cizilir. Cihaz baska dildeyse menu Ingilizce
     * kaliyordu; bu baglam yalniz oynatici gorunumunu TURKCE'ye sabitler.
     */
    private static android.content.Context turkceBaglam(android.content.Context ctx) {
        try {
            android.content.res.Configuration yapilandirma =
                    new android.content.res.Configuration(ctx.getResources().getConfiguration());
            yapilandirma.setLocale(new java.util.Locale("tr", "TR"));
            return ctx.createConfigurationContext(yapilandirma);
        } catch (Exception e) {
            return ctx;
        }
    }

    /** Verilen altyazı listesinin ilk dil kodu (altyazıyı açık başlatmak için). */
    private static String altyaziDili(String json) {
        if (json == null || json.trim().isEmpty()) return null;
        try {
            org.json.JSONArray dizi = new org.json.JSONArray(json);
            org.json.JSONObject ilk = dizi.optJSONObject(0);
            if (ilk != null) {
                String dil = ilk.optString("dil", "");
                if (!dil.isEmpty()) return dil;
            }
        } catch (Exception ignored) {}
        return null;
    }

    /**
     * Altyazı metinlerini (WebVTT) geçici dosyaya yazar ve tek örnekli medya
     * kaynaklarına çevirir. MIME açıkça `text/vtt`: uzantısız/dosya adreslerinde
     * ExoPlayer biçimi kestiremiyor ve altyazı sessizce yüklenmiyordu.
     */
    private java.util.List<MediaSource> altyaziKaynaklari(String json, androidx.media3.datasource.DataSource.Factory veriFabrikasi) {
        java.util.List<MediaSource> liste = new java.util.ArrayList<>();
        if (json == null || json.trim().isEmpty() || json.length() > 4_000_000) return liste;
        try {
            org.json.JSONArray dizi = new org.json.JSONArray(json);
            java.io.File dizin = activity.getCacheDir();
            for (int i = 0; i < dizi.length() && i < 3; i++) {
                org.json.JSONObject oge = dizi.optJSONObject(i);
                if (oge == null) continue;
                String vtt = oge.optString("vtt", "");
                if (vtt.isEmpty()) continue;
                java.io.File dosya = new java.io.File(dizin, "cp_altyazi_" + i + ".vtt");
                try (java.io.OutputStreamWriter yazici = new java.io.OutputStreamWriter(
                        new java.io.FileOutputStream(dosya), java.nio.charset.StandardCharsets.UTF_8)) {
                    yazici.write(vtt);
                }
                String dil = oge.optString("dil", "");
                MediaItem.SubtitleConfiguration yapilandirma = new MediaItem.SubtitleConfiguration.Builder(
                        android.net.Uri.fromFile(dosya))
                        .setMimeType(MimeTypes.TEXT_VTT)
                        .setLabel(oge.optString("etiket", "Altyazı"))
                        .setLanguage(dil.isEmpty() ? null : dil)
                        .setSelectionFlags(androidx.media3.common.C.SELECTION_FLAG_DEFAULT)
                        .build();
                liste.add(new SingleSampleMediaSource.Factory(new androidx.media3.datasource.FileDataSource.Factory())
                        .createMediaSource(yapilandirma, androidx.media3.common.C.TIME_UNSET));
            }
        } catch (Exception ignored) {}
        return liste;
    }

    /** JSON başlık nesnesini java Map'e çevirir (hatalıysa null). */
    private static java.util.Map<String, String> parseBasliklar(String json) {
        if (json == null || json.trim().isEmpty()) return null;
        try {
            org.json.JSONObject obj = new org.json.JSONObject(json);
            java.util.Map<String, String> sonuc = new java.util.HashMap<>();
            java.util.Iterator<String> anahtarlar = obj.keys();
            while (anahtarlar.hasNext()) {
                String a = anahtarlar.next();
                sonuc.put(a, obj.optString(a));
            }
            return sonuc.isEmpty() ? null : sonuc;
        } catch (Exception e) {
            return null;
        }
    }
}