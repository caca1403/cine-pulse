package com.cinepulse.studio;

import android.app.Activity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import java.util.Map;

import androidx.media3.common.C;
import androidx.media3.common.MediaItem;
import androidx.media3.common.MimeTypes;
import androidx.media3.common.Player;
import androidx.media3.common.TrackSelectionOverride;
import androidx.media3.common.Tracks;
import androidx.media3.exoplayer.ExoPlayer;
import androidx.media3.exoplayer.source.DefaultMediaSourceFactory;
import androidx.media3.exoplayer.source.MediaSource;
import androidx.media3.exoplayer.source.MergingMediaSource;
import androidx.media3.exoplayer.source.SingleSampleMediaSource;
import androidx.media3.exoplayer.upstream.DefaultLoadErrorHandlingPolicy;

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

    // ── Torrent oynatma zinciri (madde 6a/6b, kullanıcı 2026-10-28) ──────────
    // Tek etiket: magnet → TorrentBridge → 127.0.0.1 → buraya hep 'CinePulseTorrent'
    // ile loglanır (zincir bugün sessiz ölüyordu; tanısızlık başlı başına hataydı).
    static final String AKIS_TAG = "CinePulseTorrent";
    // 6a: uzantısız yerel akışta (http://127.0.0.1:port/f) MIME çıkarımı belirsiz
    // kalıyor, ProgressiveMediaSource reddediyor → siyah ekran. Düzeltme: DETERMİNİSTİK
    // aday zinciri — uzantı ipucu varsa O başta, yoksa MATROSKA → MPEG_4. Hata
    // olınca bir sonraki adayla yeniden hazırlanır; rastgele deneme YOK.
    private String[] adayMimeler = null;
    private int adayIndex = 0;
    private MediaItem aktifItem = null;
    private long aktifBaslangicMs = 0;
    // 6b: yerel köprü akışında (127.0.0.1) seek kapısı — hedef buffer'ın
    // gerisindeyse sarMAZ; önce hedef baytlar Range ile öncelikli indirilir,
    // dilim diskte/buffer'da olunca TEK seek atılır (hemen atan seek takılıyor).
    private boolean yerelTorrentAkisi = false;
    private String aktifAkisUrl = null;
    private final android.os.Handler seekIsci =
            new android.os.Handler(android.os.Looper.getMainLooper());

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
                // HER ZAMAN YATAY TAM EKRAN (kullanıcı kararı 2026-10-27):
                // oynatıcı dikeyde açılıp sonra dönmesin diye yön görünüm
                // kurulmadan ÖNCE istenir; MainActivity yön değişimini kendisi
                // karşılıyor (manifest configChanges), yani play kaybolmaz.
                try {
                    activity.setRequestedOrientation(
                            android.content.pm.ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
                } catch (Exception ignored) {}
                // Yalnız yüzeyi bırak: yön yatay kalmalı (oynatıcı yeniden açılıyor).
                release(false);
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
                // Kapsayıcı tam ekran + JS bayrağı (konumlandırma yapılmasın).
                tamEkraniAyarla(true);

                // KULLANICI KARARI (2026-10-28, premium krom): stok Media3 çubuğu
                // kaldırıldı — video üstte tek başına; tüm kontroller özel çizilmiş
                // premium katmanda (Netflix düzeni, Stremio bölümleri): üst scrim
                // (geri + başlık + saat), yarım ekran çift dokunma ±10 sn, ince lime
                // scrubber, alt segment satırı (Altyazı·Ses·Hız·En-boy·İndir),
                // alttan açılan koyu sayfalar. Köprü API'si aynen durur.
                playerView = new androidx.media3.ui.PlayerView(activity);
                playerView.setUseController(false);
                playerView.setKeepContentOnPlayerReset(true);
                playerView.setShutterBackgroundColor(android.graphics.Color.TRANSPARENT);
                perdeBaslik = title;
                perdeKur();
                container.addView(playerView, new FrameLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
                kurChrome(title);
                oyuniciAyarlariUygula();

                // Çekirdek istek başlıklarını (Referen/User-Agent/Cookie) verirse
                // sunucu 403 dönebiliyor; HTTP veri kaynağına taşınır.
                Map headers = parseBasliklar(headersJson);
                androidx.media3.datasource.DefaultHttpDataSource.Factory httpFactory =
                        new androidx.media3.datasource.DefaultHttpDataSource.Factory()
                                .setAllowCrossProtocolRedirects(true);
                if (headers != null && !headers.isEmpty()) {
                    httpFactory.setDefaultRequestProperties(headers);
                }
                // ÖLÇÜLEN ÇÖKME (2026-10-25): http fabrikası HER şemaya verilirse
                // file:// alt yazılar da DefaultHttpDataSource'a girer →
                // "FileURLConnection cannot be cast to HttpURLConnection" → altyazısı
                // olan HER kaynak ölür. Alt yazı fabrikası ayrı verilir (file→
                // FileDataSource); http başlık+yönlendirme davranışı korunur.
                player = new ExoPlayer.Builder(activity)
                        // CDN'ler geçici 503 döndürebiliyor. Varsayılan 3 deneme
                        // çok kısa kalıyor; 5 deneme ile kesintiyi atlat, yine
                        // başarısızsa JS yedek hatta geçsin.
                        .setMediaSourceFactory(new DefaultMediaSourceFactory(httpFactory)
                                .setLoadErrorHandlingPolicy(new DefaultLoadErrorHandlingPolicy(5)))
                        .build();
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
                // UZANTISIZ HLS (2026-10-29): bazı CDN'ler master'ı ".txt" ile
                // sunuyor (ölçüldü: filmmakinesi → /txt/master.txt). Uzantıya
                // bakmak bu yayınları "bilinmeyen MIME" yapıp oynatmıyordu.
                if (icAdres.contains(".m3u8") || icAdres.contains(".m3u")
                        || icAdres.contains("master.txt") || icAdres.contains("/txt/master")
                        || icAdres.contains("playlist.txt")) mime = MimeTypes.APPLICATION_M3U8;
                else if (icAdres.contains(".mp4")) mime = MimeTypes.VIDEO_MP4;
                else if (icAdres.contains(".mkv")) mime = "video/x-matroska";
                else if (icAdres.contains(".webm")) mime = MimeTypes.VIDEO_WEBM;
                else if (icAdres.contains(".mpd")) mime = MimeTypes.APPLICATION_MPD;
                else if (kucuk.contains("/api/hls_proxy")) mime = MimeTypes.APPLICATION_M3U8;

                // ── madde 6a: yerel köprü akışında DETERMİNİSTİK kap zinciri ──
                // TorrentBridge yayını 'http://127.0.0.1:port/f' adresi taşır:
                // uzantı YOK → MIME çıkarımı belirsiz → ProgressiveMediaSource
                // reddedip siyah ekran üretiyordu (ölçüldü 2026-10-28). Artık
                // uzantı ipucuna göre (varsa o önce), yoksa MATROSKA → MPEG_4
                // sırasıyla DENER; her deneme loglanır, son aday da ölürse JS'ye
                // okunabilir hata gider (rastgele deneme yok).
                yerelTorrentAkisi = yerelKopruMu(url);
                aktifAkisUrl = url;
                adayMimeler = null; adayIndex = 0; aktifItem = null;
                if (yerelTorrentAkisi && (MimeTypes.VIDEO_MP4.equals(mime)
                        || "video/x-matroska".equals(mime))) {
                    // Uzantı ipucu var: yine de yanlışsa diğer container denenir.
                    adayMimeler = new String[] { mime,
                            MimeTypes.VIDEO_MP4.equals(mime) ? "video/x-matroska" : MimeTypes.VIDEO_MP4 };
                } else if (yerelTorrentAkisi && mime == null) {
                    adayMimeler = new String[] { "video/x-matroska", MimeTypes.VIDEO_MP4 };
                    mime = adayMimeler[0];
                }
                android.util.Log.i(AKIS_TAG, "play: url=" + (url.length() > 90 ? url.substring(0, 90) + "…" : url)
                        + " mime=" + mime + " kapAdaylari="
                        + (adayMimeler == null ? "-" : java.util.Arrays.toString(adayMimeler))
                        + " startMs=" + baslangicMs);

                // ── ALTYAZI: MediaItem'a BAĞLANIR (yeni Media3 boru hattı) ──
                // ÖLÇÜLEN ÇÖKME (2026-10-25, her kaynakta 1.3 sn): SingleSampleMediaSource
                // + MergingMediaSource "legacy" yoluydu; Media3 1.4 TextRenderer'ı
                // text/vtt örnekleriyle "Legacy decoding is disabled" atıyordu →
                // TÜM kaynaklar "Unexpected runtime error" ile ölüyordu. SubtitleConfiguration
                // doğrudan MediaItem'da verilir; DefaultMediaSourceFactory altyazıyı
                // SubtitleParserFactory'den geçirip application/x-media3-cues üretir.
                senkEtiketler.clear();
                senkDiller.clear();
                java.util.List<MediaItem.SubtitleConfiguration> altyazilar = altyaziKaynaklari(altyaziJson);
                MediaItem.Builder itemBuilder = new MediaItem.Builder().setUri(url);
                if (mime != null) itemBuilder.setMimeType(mime);
                if (!altyazilar.isEmpty()) itemBuilder.setSubtitleConfigurations(altyazilar);
                aktifItem = itemBuilder.build();      // 6a: aday rebuild buildUpon ile buradan
                aktifBaslangicMs = baslangicMs;
                player.setMediaItem(aktifItem, baslangicMs);
                // Altyazı İSTENEREK verildi: varsayılan olarak AÇIK gelsin.
                // Media3 altyazı parçalarını kendiliğinden seçmez; tercih
                // dilini bildirmek seçimi yapar (kullanıcı CC'den değiştirir).
                if (!altyazilar.isEmpty()) {
                    String hedefDil = altyaziDili(altyaziJson);
                    player.setTrackSelectionParameters(player.getTrackSelectionParameters().buildUpon()
                            .setPreferredTextLanguage(hedefDil)
                            .setSelectUndeterminedTextLanguage(true)
                            .build());
                }
                player.prepare();
                // KALDIĞIN YERDEN DEVAM (kullanıcı 2026-10-18): başlangıç konumu
                // doğrudan ExoPlayer'a verilir — arka plandaki WebView <video>'ya
                // değil. setMediaItem(..., baslangicMs) başlangıç sarımını zaten
                // tanımlar; prepare öncesi ikinci seek aynı HLS manifestini iki
                // ayrı konumdan istemeye yol açıp devam oynatmasını dondurabiliyordu.
                player.setPlayWhenReady(true);
                player.addListener(new Player.Listener() {
                    @Override public void onPlayerError(androidx.media3.common.PlaybackException error) {
                        // SİYAH EKRAN YAPMA: native oynatma tutmazsa kullanıcıya
                        // net sebep gösterilir ve player'a dönülür.
                        String ozet = hataOzeti(error);
                        android.util.Log.e(AKIS_TAG, "oynatıcı hatası: " + ozet
                                + " yerelTorrent=" + yerelTorrentAkisi + " aday=" + adayIndex);
                        // 6a: kap (container) yanlışı en olası kopuktu — deterministik
                        // aday zinciri varsa ÖNCE bir sonraki kap denenir; JS'ye
                        // ancak son aday da ölürse hata gider.
                        if (sonrakiKapaGec()) return;
                        bildirHata("Bu kaynak oynatılamadı (codec/bağlantı: "
                                + ozet + "). Başka bir kaynak seç.");
                        // Hata halinde yalnız native yüzeyi kaldır. close() tam
                        // kapanış olayı cp-native-kapat da gönderir ve PlayerModal'ı
                        // kapatıp JS yedek kaynak geçişini iptal eder. Başarısız
                        // kaynağı JS işaretleyip listedeki sıradaki hatta geçecek.
                        close(false);
                    }

                    @Override public void onPlaybackStateChanged(int state) {
                        // 6a: player durumu zincir logunda görünsün (sessiz ölüm yok).
                        if (yerelTorrentAkisi && player != null) {
                            try {
                                android.util.Log.i(AKIS_TAG, "player durumu: " + durumAdi(state)
                                        + " konum=" + player.getCurrentPosition()
                                        + " buffer=" + player.getBufferedPosition()
                                        + " sure=" + player.getDuration());
                            } catch (Exception ignored) {}
                        }
                        if (state == Player.STATE_READY && player != null) {
                            android.util.Log.i("CPResume", "READY pos=" + player.getCurrentPosition() + " start=" + baslangicMs + " dur=" + player.getDuration());
                            // Güvenlik ağı: frame olayı kaçarsa perde yine kalksın.
                            activity.runOnUiThread(() -> perdeKaldir());
                        }
                        if (state == Player.STATE_ENDED) close();
                    }

                    @Override public void onRenderedFirstFrame() {
                        // İlk video frame geldi → perde artık gereksiz.
                        activity.runOnUiThread(() -> perdeKaldir());
                    }
                });

                // Konumlandırma: yüzey yalnız videonun dikdörtgenini kaplar
                // (setBounds); play tam ekranda açıldığı için tam ekran.
                // KULLANICI KARARI (2026-10-28): TEK player native ExoPlayer —
                // DOM hiçbir şeyin üstüne binmeyecek. Container WebView'in
                // parent'ında EN SONA (en üste) eklenir; böylece video tüm
                // WebView'i (modal/backdrop dahil) kapatır. Geri tuşu close()
                // eder (MainActivity.onBackPressed).
                ViewGroup kok = kokBul((ViewGroup) activity.getWindow().getDecorView());
                kok.addView(container, new ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
                // Perde play başında container'dan ÖNCE eklendi → spinner video altında kalmasın.
                if (perdeOverlay != null) perdeOverlay.bringToFront();
                yuzeyArkada = true;
                // Üst çubuk (geri + ad) ARTIK YOK: kontrol katmanı DOM'da.
            }
        });
    }

    /** Oynatıcıyı kapatır ve WebView'e geri döner. */
    void close() {
        close(true);
    }

    private void close(final boolean notifyWeb) {
        if (activity == null) return;
        activity.runOnUiThread(new Runnable() {
            @Override public void run() {
                release(notifyWeb);
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
        // TAM EKRANDA KONUMLANDIRMA YOK (kullanıcı kararı 2026-10-27): play artık
        // her zaman yatay tam ekran açılıyor; WebView'in eski (dikey) video
        // dikdörtgeni dayatılırsa video ekran ortasında küçük kalıyordu.
        if (tamEkranMi) return;
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
    boolean yukleniyorMu() {
        final boolean[] sonuc = {false};
        anaThread(true, new Runnable() {
            @Override public void run() {
                sonuc[0] = player != null && player.getPlayWhenReady()
                        && player.getPlaybackState() == Player.STATE_BUFFERING;
            }
        });
        return sonuc[0];
    }
    void oynat() { anaThread(false, new Runnable() { @Override public void run() { if (player != null) player.setPlayWhenReady(true); } }); }
    void durdur() { anaThread(false, new Runnable() { @Override public void run() { if (player != null) player.setPlayWhenReady(false); } }); }
    void ilerle(double saniye) {
        final long ms = (long) (saniye * 1000);
        anaThread(false, new Runnable() {
            @Override public void run() { guvenliSar(ms); }
        });
    }
    void atla(double saniye) {
        anaThread(false, new Runnable() {
            @Override public void run() {
                if (player == null) return;
                long hedef = player.getCurrentPosition() + (long) (saniye * 1000);
                long sure = player.getDuration();
                if (sure > 0 && hedef > sure - 3000) hedef = Math.max(0, sure - 3000);
                if (hedef < 0) hedef = 0;
                guvenliSar(hedef);
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

    // ── İZ (SES/ALTYAZI) SEÇİMİ — kontrol katmanı DOM'da ─────────────────
    // Stremio mimarisi: parça listesi ve seçim WebView DOM'unda çizilir,
    // uygulama yalnız ExoPlayer'ın parça seçimine yazar. "i" düz indekstir:
    // aynı türün (ses ya da altyazı) parçaları sırayla 0,1,2… numaralanır —
    // izlerJson() ile izSec() AYNI sayımı kullanır.
    private static final String BOS_IZLER = "{\"ses\":[],\"alt\":[]}";

    /** DOM için iz listesi: {"ses":[{"i","ad","aktif"}],"alt":[…]} */
    String izlerJson() {
        final String[] sonuc = {BOS_IZLER};
        anaThread(true, new Runnable() {
            @Override public void run() {
                if (player == null) return;
                try {
                    org.json.JSONArray ses = new org.json.JSONArray();
                    org.json.JSONArray alt = new org.json.JSONArray();
                    Tracks izler = player.getCurrentTracks();
                    for (Tracks.Group grup : izler.getGroups()) {
                        boolean sesMi = grup.getType() == C.TRACK_TYPE_AUDIO;
                        if (!sesMi && grup.getType() != C.TRACK_TYPE_TEXT) continue;
                        org.json.JSONArray hedef = sesMi ? ses : alt;
                        for (int t = 0; t < grup.length; t++) {
                            androidx.media3.common.Format bicim = grup.getTrackFormat(t);
                            // Aynı ad zinciri native sheet'le ortak (dil tahmini + JS ipucu).
                            String ad = adVer(bicim, hedef.length(), sesMi);
                            hedef.put(new org.json.JSONObject()
                                    .put("i", hedef.length())
                                    .put("ad", ad)
                                    .put("aktif", grup.isSelected() && grup.isTrackSelected(t)));
                        }
                    }
                    sonuc[0] = new org.json.JSONObject().put("ses", ses).put("alt", alt).toString();
                } catch (Exception ignored) {}
            }
        });
        return sonuc[0];
    }

    /**
     * İz seçer. tur "ses" → ses parçası, "alt" → altyazı parçası.
     * "alt" için i < 0 → altyazı KAPATILIR (DOM'daki "Yok" satırı).
     */
    void izSec(final String tur, final int i) {
        anaThread(false, new Runnable() {
            @Override public void run() {
                if (player == null) return;
                try {
                    boolean sesMi = "ses".equals(tur);
                    int tip = sesMi ? C.TRACK_TYPE_AUDIO : C.TRACK_TYPE_TEXT;
                    if (i < 0) {
                        player.setTrackSelectionParameters(player.getTrackSelectionParameters().buildUpon()
                                .setTrackTypeDisabled(tip, true).build());
                        return;
                    }
                    int sayac = 0;
                    for (Tracks.Group grup : player.getCurrentTracks().getGroups()) {
                        if (grup.getType() != tip) continue;
                        for (int t = 0; t < grup.length; t++, sayac++) {
                            if (sayac != i) continue;
                            player.setTrackSelectionParameters(player.getTrackSelectionParameters().buildUpon()
                                    .setTrackTypeDisabled(tip, false)
                                    .setOverrideForType(new TrackSelectionOverride(
                                            grup.getMediaTrackGroup(), t))
                                    .build());
                            return;
                        }
                    }
                } catch (Exception ignored) {}
            }
        });
    }

    /** Görüntü oranı: "fit" (tam sığdır) | "zoom" (kırparak doldur) | "fill" (esnet). */
    void oran(final String mod) {
        anaThread(false, new Runnable() {
            @Override public void run() {
                if (playerView == null) return;
                int m = androidx.media3.ui.AspectRatioFrameLayout.RESIZE_MODE_FIT;
                if ("zoom".equals(mod)) m = androidx.media3.ui.AspectRatioFrameLayout.RESIZE_MODE_ZOOM;
                else if ("fill".equals(mod)) m = androidx.media3.ui.AspectRatioFrameLayout.RESIZE_MODE_FILL;
                try { playerView.setResizeMode(m); } catch (Exception ignored) {}
            }
        });
    }

    /** Yalnız TorrentBridge'in gerçek dosya akışı mı? Yerel HLS vekili de
     *  127.0.0.1 kullanır ama dosya aralığı/ torrent seek mantığı uygulanamaz. */
    private static boolean yerelKopruMu(String url) {
        try {
            java.net.URI uri = java.net.URI.create(String.valueOf(url));
            String host = String.valueOf(uri.getHost()).toLowerCase(java.util.Locale.ROOT);
            String path = String.valueOf(uri.getPath()).toLowerCase(java.util.Locale.ROOT);
            boolean loopback = "127.0.0.1".equals(host) || "localhost".equals(host) || "[::1]".equals(host);
            return loopback && "/f".equals(path);
        } catch (Exception e) { return false; }
    }

    private static String durumAdi(int state) {
        switch (state) {
            case Player.STATE_IDLE: return "IDLE";
            case Player.STATE_BUFFERING: return "BUFFERING";
            case Player.STATE_READY: return "READY";
            case Player.STATE_ENDED: return "ENDED";
            default: return "?" + state;
        }
    }

    /**
     * 6a: deterministik kap zincirinde bir sonraki MIME adayına geç: aynı
     * MediaItem buildUpon().setMimeType() ile yeniden kurulur (altyazı
     * konfigürasyonu korunur), hazırlanır ve oynatılır. Aday kalmadıysa false.
     * (Media3 1.4.1 javap: MediaItem.buildUpon()→Builder, Builder.setMimeType — doğrulandı.)
     */
    private boolean sonrakiKapaGec() {
        if (adayMimeler == null || aktifItem == null || player == null) return false;
        if (adayIndex + 1 >= adayMimeler.length) return false;
        adayIndex++;
        try {
            MediaItem yeni = aktifItem.buildUpon().setMimeType(adayMimeler[adayIndex]).build();
            aktifItem = yeni;
            android.util.Log.i(AKIS_TAG, "kap denemesi [" + adayIndex + "]: "
                    + adayMimeler[adayIndex] + " ile yeniden hazırlanıyor");
            player.setMediaItem(yeni, aktifBaslangicMs);
            player.prepare();
            player.setPlayWhenReady(true);
            return true;
        } catch (Exception e) {
            android.util.Log.e(AKIS_TAG, "aday yeniden kurulumu başarısız", e);
            return false;
        }
    }

    /**
     * 6b (kullanıcı 2026-10-28): yerel torrent akışında güvenli seek.
     * Kök sebep: seek hedefi henüz indirilmedi ve motor sıralı okuyor — hemen
     * atılan seek takılıyor. Kapı: hedef bufferedPosition'ın GERİSİNDEYSE
     * sarılmaz; önce hedef baytlar için ayrı bir Range isteği ateşlenir
     * (TorrentBridge o pencerenin parçalarını TOP önceliğe alır; oynatma bu
     * arada mevcut konumda sürer), hedef dilim diskte tamamlanınca veya buffer
     * hedefi kapsayınca TEK seek atılır. Üst sınır 20 sn — sonra zorla sar
     * (ExoPlayer zaten kendi yeniden-denemesini yapar). Torrent dışı akışlarda
     * davranış BİREBİR eski gibi: anında seek.
     */
    private void guvenliSar(final long hedefMs) {
        if (player == null) return;
        if (!yerelTorrentAkisi) { player.seekTo(hedefMs); return; }
        seekIsci.removeCallbacksAndMessages(null); // yeni seek önceliklidir (tek seek ilkesi)
        final long sure = player.getDuration();
        final long tampon = player.getBufferedPosition();
        android.util.Log.i(AKIS_TAG, "seek isteği: hedef=" + hedefMs + "ms tampon=" + tampon
                + " sure=" + sure);
        boolean tamponda = tampon != C.POSITION_UNSET && hedefMs <= tampon + 500;
        if (sure == C.TIME_UNSET || sure <= 0 || tamponda) {
            // Süre bilinmiyorsa ms→bayt eşlemi yapılamaz: kaplama yok, doğrudan sar.
            if (!tamponda) android.util.Log.w(AKIS_TAG, "seek: süre bilinmiyor — kapısız doğrudan sar");
            player.seekTo(hedefMs);
            return;
        }
        // Hedef buffer dışında: bayt hedefini Range ile öncelikli indir; dilim
        // hazır olur olmaz (veya tampon hedefi kapsayınca) sar.
        final java.util.concurrent.atomic.AtomicBoolean dilimHazir =
                new java.util.concurrent.atomic.AtomicBoolean(false);
        hedefDilimOnIndir(hedefMs, sure, dilimHazir);
        final long son = System.currentTimeMillis() + 20000L;
        seekIsci.post(new Runnable() {
            @Override public void run() {
                if (player == null) return;
                long b = player.getBufferedPosition();
                boolean hazir = (b != C.POSITION_UNSET && b + 500 >= hedefMs) || dilimHazir.get();
                boolean asim = System.currentTimeMillis() > son;
                if (hazir || asim) {
                    android.util.Log.i(AKIS_TAG, "seek uygulandı: hedef=" + hedefMs + " tampon=" + b
                            + " dilimHazir=" + dilimHazir.get() + (asim && !hazir ? " (20sn sonu, zorla)" : ""));
                    player.seekTo(hedefMs);
                } else {
                    seekIsci.postDelayed(this, 400);
                }
            }
        });
    }

    /**
     * 6b: hedef bayta arka plan Range isteği (torrentYerel sözleşmesi: sunucu
     * istenen aralığın parçalarını TOP önceliğe alır). Dosya boyutu küçük bir
     * bytes=0-0 isteğinin Content-Range'inden okunur; ms→bayt eşlemi süre
     * oranıyla yapılır. Bu istek TAMAMLANINCA hedef dilim diskte demektir →
     * oynatıcının kendi Range isteği diskten okur, seek takılmaz.
     */
    private void hedefDilimOnIndir(final long hedefMs, final long sureMs,
                                   final java.util.concurrent.atomic.AtomicBoolean dilimHazir) {
        final String url = aktifAkisUrl;
        if (url == null) { dilimHazir.set(true); return; }
        new Thread(new Runnable() {
            @Override public void run() {
                try {
                    long boyut = -1;
                    java.net.HttpURLConnection k = (java.net.HttpURLConnection)
                            new java.net.URL(url).openConnection();
                    k.setRequestProperty("Range", "bytes=0-0");
                    k.setConnectTimeout(5000);
                    k.setReadTimeout(15000);
                    String cr = k.getHeaderField("Content-Range");
                    if (cr != null && cr.contains("/")) {
                        try { boyut = Long.parseLong(cr.substring(cr.lastIndexOf('/') + 1).trim()); }
                        catch (Exception ignored) {}
                    }
                    k.disconnect();
                    if (boyut <= 0) {
                        android.util.Log.w(AKIS_TAG, "ön-indirme: boyut öğrenilemedi — seek kapısız");
                        return; // dilimHazir zaten true olacak finally'de
                    }
                    long bayt = (long) ((double) hedefMs / sureMs * boyut);
                    long a = Math.max(0, bayt - 512 * 1024);
                    long b2 = Math.min(boyut - 1, bayt + 3L * 1024 * 1024);
                    android.util.Log.i(AKIS_TAG, "hedef dilim ön-indiriliyor: " + a + "-" + b2
                            + "/" + boyut + " (hedef=" + hedefMs + "ms)");
                    java.net.HttpURLConnection k2 = (java.net.HttpURLConnection)
                            new java.net.URL(url).openConnection();
                    k2.setRequestProperty("Range", "bytes=" + a + "-" + b2);
                    k2.setConnectTimeout(5000);
                    k2.setReadTimeout(120000);
                    java.io.InputStream in = k2.getInputStream();
                    byte[] tmp = new byte[64 * 1024];
                    long okunan = 0;
                    int r;
                    while ((r = in.read(tmp)) > 0) okunan += r;
                    in.close();
                    k2.disconnect();
                    android.util.Log.i(AKIS_TAG, "hedef dilim hazır: " + okunan + " bayt");
                } catch (Exception e) {
                    android.util.Log.w(AKIS_TAG, "ön-indirme başarısız (seek yine deneneyecek): " + e);
                } finally {
                    dilimHazir.set(true);
                }
            }
        }, "cp-seek-onindir").start();
    }

    private static String hataOzeti(androidx.media3.common.PlaybackException error) {
        try {
            // Tam iz logcat'e: "Unexpected runtime error" hiç bir şey anlatmıyor;
            // gerçek sebep cause zincirinde (ölçüldü 2026-10-25, tüm kaynaklar).
            android.util.Log.e("CPNativeHata", "tam hata zinciri", error);
            String m = String.valueOf(error.getMessage());
            Throwable c = error.getCause();
            while (c != null) {
                m = c.getClass().getSimpleName() + ": " + String.valueOf(c.getMessage());
                c = c.getCause();
            }
            return m.length() > 90 ? m.substring(0, 90) + "…" : m;
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

    private void tamEkranDegistir() {
        try {
            boolean yatay = activity.getResources().getConfiguration().orientation
                    == android.content.res.Configuration.ORIENTATION_LANDSCAPE;
            activity.setRequestedOrientation(yatay
                    ? android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
                    : android.content.pm.ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
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

    // ── TAM EKRAN ────────────────────────────────────────────────────────
    // Buton artık DOM'da; burada yalnız istenen durum uygulanır:
    // yön + kapsayıcı boyutu + sistem barları.
    private boolean tamEkranMi = false;
    private int[] sonSinirlar = null;

    /** Tam ekranı istenen duruma getirir (durumun kendisi çağıranda tutulur). */
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
                activity.setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
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
                yonelimiGeriAl();
            }
            // Tam ekranda WebView konumlandırmayı BIRAKIR (yoksa video küçük kalır).
            jsCalistir("window.__cpNativeTamEkran = " + tamEkranMi + ";");
            // Tam ekranda immersive; normalde bayraklar temizlenir → durum/gezinme barları geri gelir.
            container.setSystemUiVisibility(tamEkranMi
                    ? (View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY)
                    : View.SYSTEM_UI_FLAG_VISIBLE);
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

    // ── YÜKLEME PERDESİ (tam ekran yatay backdrop + dönen logo) ──────────
    // STREMIO REFERANSI (2026-10-27): video açılana kadar içerik backdrop'ı
    // TÜM EKRANI kaplar, ortasında dönen yüklenme logosu — siyah ekran yerine.
    // İlk video frame gelince perde kalkar, oynatıcı görünür.
    private volatile String backdropUrl = null;
    private android.widget.FrameLayout perdeOverlay = null;
    private android.widget.ImageView perdeResim = null;
    /** Perdede spinner'ın altında görünen içerik adı (ilk karede perdeyle gider). */
    private String perdeBaslik = null;

    /** JS köprüsü: bir sonraki (ve varsa mevcut) oynatmanın arkasına resim. */
    void backdropAyarla(String url) {
        backdropUrl = (url != null && !url.isEmpty()) ? url : null;
        // Perde YOKSA kurulmaz: play() zaten hemen ardından perdeyi (başlıkla
        // birlikte) kuruyor. Burada kurulsaydı başlıksız/boş bir perde açılıp
        // play onu yıkıp yeniden kuruyordu (backdrop iki kez indiriliyordu).
        if (perdeOverlay == null) return;
        final android.widget.FrameLayout ov = perdeOverlay;
        activity.runOnUiThread(() -> {
            // Perde açıkken resim YENİSİYLE değişir (kaynak değişiminde
            // eski backdrop kalıyordu).
            if (perdeOverlay != ov) return;
            if (perdeResim != null) perdeResim.setImageDrawable(null);
            perdeResimYukle(ov, backdropUrl);
        });
    }

    /** Tam ekran perde kurar: backdrop + karartma + dönen logo + başlık. */
    private void perdeKur() {
        if (activity == null || perdeOverlay != null) return;
        ViewGroup decor = (ViewGroup) activity.getWindow().getDecorView();
        android.widget.FrameLayout ov = new android.widget.FrameLayout(activity);
        ov.setBackgroundColor(0x00000000);

        android.widget.ImageView iv = new android.widget.ImageView(activity);
        iv.setScaleType(android.widget.ImageView.ScaleType.CENTER_CROP);
        ov.addView(iv, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        perdeResim = iv;

        // Karartma: video frame gelene kadar görüntüsünü örtmesin (native perde).
        View perdeKarart = new View(activity);
        perdeKarart.setBackgroundColor(0x00000000);
        ov.addView(perdeKarart, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        // ORTA: dönen yüklenme logosu (Stremio gibi), altında içerik adı.
        android.widget.LinearLayout orta = new android.widget.LinearLayout(activity);
        orta.setOrientation(android.widget.LinearLayout.VERTICAL);
        orta.setGravity(android.view.Gravity.CENTER_HORIZONTAL);
        android.widget.ProgressBar spinner = new android.widget.ProgressBar(activity);
        spinner.setIndeterminate(true);
        int boyut = (int) (64 * activity.getResources().getDisplayMetrics().density);
        orta.addView(spinner, new android.widget.LinearLayout.LayoutParams(boyut, boyut));
        if (perdeBaslik != null && !perdeBaslik.isEmpty()) {
            android.widget.TextView ad = new android.widget.TextView(activity);
            ad.setText(perdeBaslik);
            ad.setTextColor(0xFFFFFFFF);
            ad.setTextSize(15);
            ad.setGravity(android.view.Gravity.CENTER);
            ad.setMaxLines(2);
            ad.setEllipsize(android.text.TextUtils.TruncateAt.END);
            int yan = (int) (48 * activity.getResources().getDisplayMetrics().density);
            ad.setPadding(yan, (int) (18 * activity.getResources().getDisplayMetrics().density), yan, 0);
            orta.addView(ad);
        }
        FrameLayout.LayoutParams ortaLp = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        ortaLp.gravity = android.view.Gravity.CENTER;
        ov.addView(orta, ortaLp);

        // WebView'in parent'ında en sona: perde hem WebView'in hem video
        // container'ının ÜSTÜNDE (container zaten hemen önce eklendi).
        kokBul(decor).addView(ov, new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        perdeOverlay = ov;
        // ZORUNLU KALKIŞ: hiçbir olay gelmezse perde videoyu örtmesin
        // (ölçüldü 2026-10-27: frame olayı bazı mkv'lerde gelmiyor → siyah ekran).
        new android.os.Handler(android.os.Looper.getMainLooper())
                .postDelayed(() -> { if (perdeOverlay == ov) perdeKaldir(); }, 12000);

        perdeResimYukle(ov, backdropUrl);
    }

    /** Backdrop'ı arka planda indirir; perde kapandıysa sonucu atar. */
    private void perdeResimYukle(final android.widget.FrameLayout ov, final String adres) {
        if (adres == null) return;
        new Thread(() -> {
            try {
                java.net.URL u = new java.net.URL(adres);
                java.net.HttpURLConnection c = (java.net.HttpURLConnection) u.openConnection();
                c.setConnectTimeout(8000); c.setReadTimeout(8000);
                android.graphics.Bitmap bm = android.graphics.BitmapFactory.decodeStream(c.getInputStream());
                c.disconnect();
                if (bm != null) activity.runOnUiThread(() -> {
                    if (perdeOverlay == ov && perdeResim != null) perdeResim.setImageBitmap(bm);
                });
            } catch (Exception ignored) {}
        }).start();
    }

    /** Perdeyi kaldırır (video frame geldiğinde veya kapanışta). */
    private void perdeKaldir() {
        if (perdeOverlay != null && activity != null) {
            // Perde artık decor'da değil, WebView'in parent'ında: gerçek parent'tan çıkar.
            ViewGroup parent = (ViewGroup) perdeOverlay.getParent();
            if (parent != null) parent.removeView(perdeOverlay);
        }
        perdeOverlay = null;
        perdeResim = null;
    }

    /** Cihaz geri tuşu oynatıcıyı kapatmalı. */
    boolean acikMi() {
        return container != null && player != null;
    }

    private void release() { release(true); }

    /**
     * @param yonelimiGeriAl false → oynatıcı hemen yeniden açılıyor, yön yatay kalmalı.
     */
    private void release(boolean yonelimiGeriAl) {
        // Krom zamanlayıcıları ve sheet kapanışta sızmasın (ticker decor'a
        // yazmaya devam etmesin; dialog activity yokken patlamasın).
        kromIsci.removeCallbacksAndMessages(null);
        // JS modalını bilgilendir: geri tuşu/✕ ile native kapanışta PlayerModal
        // siyah sahne üstünde açık kalmasın (kullanıcı 2026-10-28). YALNIZ gerçek
        // kapanışta: play() yeniden bağlamada release(false) çağırır — olay orada
        // yeni açılan playerı anında öldürürdü (ölçüldü 2026-10-29, NATIVE-OK sonra
        // konum hep 0).
        if (yonelimiGeriAl) {
            try { jsCalistir("window.dispatchEvent(new CustomEvent('cp-native-kapat'))"); } catch (Exception ignored) {}
        }
        if (aktifSheet != null) { try { aktifSheet.dismiss(); } catch (Exception ignored) {} aktifSheet = null; }
        try {
            if (playerView != null) { try { playerView.setPlayer(null); } catch (Exception ignored) {} playerView = null; }
            if (player != null) {
                if (dokuView != null) { try { player.clearVideoTextureView(dokuView); } catch (Exception ignored) {} }
                player.release();
                player = null;
            }
            if (container != null) {
                // Video parent'ı artık WebView'in konteyneri (decor değil): gerçek parent'tan çıkar.
                ViewGroup parent = (ViewGroup) container.getParent();
                if (parent != null) parent.removeView(container);
                container = null;
            }
            perdeKaldir(); // perde (backdrop+spinner) kalksın; backdropUrl sonraki play için korunur
        } finally {
            // HİÇBİR çıkış yolu (hata yolunda bile) yönü geri almayı atlamaz:
            // oynatıcı kapandıktan sonra detay sayfası yatayda sıkışıyordu (2026-10-27).
            dokuView = null;
            tamEkranMi = false;
            sonSinirlar = null;
            yuzeyArkada = false;
            if (yonelimiGeriAl) {
                yonelimiGeriAl();
                tamEkrandanCik();
            }
        }
    }

    /**
     * Yönü cihazın kendi rotasyon ayarına bırakır (Stremio davranışı):
     * kilit açıksa sensör izlenir, kilit varsa kilit kazanır — boş dönme yok.
     */
    private void yonelimiGeriAl() {
        try {
            activity.setRequestedOrientation(
                    android.content.pm.ActivityInfo.SCREEN_ORIENTATION_USER);
        } catch (Exception ignored) {}
    }

    /** Tam ekrandan normal yerleşime döner: sistem barları geri gelir, WebView bir kez yeniden ölçülür. */
    private void tamEkrandanCik() {
        // Immersive bayrakları yalnız container'daydı; o kaldırılınca barlar kendiliğinden döner.
        jsCalistir("window.__cpNativeTamEkran = false;");
        try {
            android.webkit.WebView wv = bridgeForJs();
            // Saydam WebView eski (tam ekran) inset'lerle kalmıştı: bir kez yeniden ölç.
            if (wv != null) wv.requestLayout();
        } catch (Exception ignored) {}
    }

    // ── PREMIUM KONTROL KROMU (Netflix düzeni · Stremio bölümleri) ───────
    // Kullanıcı (2026-10-28): stok Media3 çubuğu + siyah yazı çipleri "aşırı
    // kötü" — tam özel katman çizildi. Düzen: üst scrim (← + başlık + saat),
    // yarım ekran çift dokunma ±10 sn (Netflix), tek dokunma chrome aç/kapat,
    // ince lime (#dfff76) scrubber — sürüklerken balon, bırakınca tek seek;
    // alt segment satırı: Altyazı · Ses · Hız · En-boy · İndir (gri/pasif,
    // madde 3'te bağlanacak). Menüler PopupMenu değil alttan açılan koyu
    // sayfa (BottomSheet benzeri Dialog — Material bağımlılığı yok).
    // 250ms-500ms poll TEK (tickerGorevi); sheet açıkken auto-hide durur;
    // sheet açıkken yan seek alanları devre dışı (jest sheet'li iken dokunmaz).
    private static final int LIME = 0xFFDFFF76;
    private android.widget.FrameLayout chromeUst;   // üst scrim + ← + başlık + saat
    private android.widget.FrameLayout chromeAlt;   // alt scrim + scrubber + segmentler
    private android.widget.TextView baslikMetni;
    private android.widget.TextView saatMetni;
    private android.widget.TextView geriDugmesi;
    private android.widget.ImageView ortadaOynat;
    private android.widget.TextView skipSol, skipSag;
    private android.widget.TextView skipEtiket;
    private SeekHat seekHat;
    private android.widget.TextView saatSol, saatSag;
    private View jestAlani;
    private boolean chromeAcikMi = true;
    private boolean surukleMi = false;
    private final android.os.Handler kromIsci = new android.os.Handler(android.os.Looper.getMainLooper());
    private Runnable gizleGorevi, tickerGorevi, saatGorevi;
    private android.app.Dialog aktifSheet;
    private String chromeBaslik = "";

    private int dp(float v) { return Math.round(v * activity.getResources().getDisplayMetrics().density); }

    private int tercihInt(String anahtar, int varsayilan) {
        return activity.getSharedPreferences("cp_player", 0).getInt(anahtar, varsayilan);
    }

    private void tercihYaz(String anahtar, int deger) {
        activity.getSharedPreferences("cp_player", 0).edit().putInt(anahtar, deger).apply();
    }

    private static android.graphics.Typeface yazi(float agirlik) {
        return android.graphics.Typeface.create(agirlik >= 1f ? "sans-serif-medium" : "sans-serif",
                android.graphics.Typeface.NORMAL);
    }

    /** ms → "M:SS" / "SS" (saat varsa "S:MM:SS"). */
    private static String sureMetni(long ms) {
        long s = Math.max(0, ms / 1000);
        long saat = s / 3600, dk = (s % 3600) / 60, sn = s % 60;
        return saat > 0
                ? String.format(java.util.Locale.ROOT, "%d:%02d:%02d", saat, dk, sn)
                : String.format(java.util.Locale.ROOT, "%d:%02d", dk, sn);
    }

    /** Oynatıcı yüzeyinin üstüne premium kontrol katmanını kurar. */
    private void kurChrome(String baslik) {
        chromeBaslik = baslik == null ? "" : baslik;

        // 1) Jest alanı: tek dokunma → krom aç/kapat; çift dokunma → yan ±10 sn.
        jestAlani = new View(activity);
        final android.view.GestureDetector jest = new android.view.GestureDetector(
                activity, new android.view.GestureDetector.SimpleOnGestureListener() {
            @Override public boolean onSingleTapConfirmed(android.view.MotionEvent e) {
                if (chromeAcikMi) chromeGizle(); else chromeGoster();
                return true;
            }
            @Override public boolean onDoubleTap(android.view.MotionEvent e) {
                if (aktifSheet != null) return true; // sheet açıkken yanlış sarım yok
                boolean sol = jestAlani != null && e.getX() < jestAlani.getWidth() / 2f;
                atla(sol ? -10 : 10);
                skipGoster(sol);
                chromeGoster();
                return true;
            }
        });
        // OLAYLARI TÜKETMELİ: false dönerse DOWN hiçbir child'ı vurmaz ve
        // GestureDetector MOVE/UP göremez → tek dokunuş asla doğrulanamaz
        // (krom gizliyken dokunmayla açılmama hatasının kökü — 2026-10-28).
        jestAlani.setOnTouchListener((v, ev) -> { jest.onTouchEvent(ev); return true; });
        playerView.addView(jestAlani, new FrameLayout.LayoutParams(-1, -1));

        // 2) ÜST SCRIM: koyu degrade + satır (← · başlık · saat).
        chromeUst = new android.widget.FrameLayout(activity);
        View scrimUst = new View(activity);
        scrimUst.setBackground(new android.graphics.drawable.GradientDrawable(
                android.graphics.drawable.GradientDrawable.Orientation.TOP_BOTTOM,
                new int[]{0xE0000000, 0x80000000, 0x00000000}));
        chromeUst.addView(scrimUst, new FrameLayout.LayoutParams(-1, -1));
        android.widget.LinearLayout ustSatir = new android.widget.LinearLayout(activity);
        ustSatir.setOrientation(android.widget.LinearLayout.HORIZONTAL);
        ustSatir.setGravity(android.view.Gravity.CENTER_VERTICAL);
        ustSatir.setPadding(dp(18), dp(14), dp(22), dp(10));
        FrameLayout.LayoutParams ustSatirLp = new FrameLayout.LayoutParams(-1, -2);
        ustSatirLp.gravity = android.view.Gravity.TOP;
        geriDugmesi = new android.widget.TextView(activity);
        geriDugmesi.setText("←");
        geriDugmesi.setTextSize(21);
        geriDugmesi.setTextColor(0xFFFFFFFF);
        geriDugmesi.setGravity(android.view.Gravity.CENTER);
        int geriCep = dp(40);
        android.graphics.drawable.GradientDrawable geriArka = new android.graphics.drawable.GradientDrawable();
        geriArka.setColor(0x40FFFFFF); // sisli daire (Netflix geri düğmesi)
        geriArka.setCornerRadius(dp(20));
        geriDugmesi.setBackground(geriArka);
        geriDugmesi.setOnClickListener(v -> close());
        ustSatir.addView(geriDugmesi, new android.widget.LinearLayout.LayoutParams(geriCep, geriCep));
        baslikMetni = new android.widget.TextView(activity);
        baslikMetni.setText(chromeBaslik);
        baslikMetni.setTextColor(0xFFFFFFFF);
        baslikMetni.setTextSize(16);
        baslikMetni.setTypeface(yazi(1f));
        baslikMetni.setSingleLine(true);
        baslikMetni.setEllipsize(android.text.TextUtils.TruncateAt.END);
        baslikMetni.setPadding(dp(16), 0, dp(12), 0);
        android.widget.LinearLayout.LayoutParams baslikLp = new android.widget.LinearLayout.LayoutParams(
                0, android.view.ViewGroup.LayoutParams.WRAP_CONTENT, 1f);
        ustSatir.addView(baslikMetni, baslikLp);
        saatMetni = new android.widget.TextView(activity);
        saatMetni.setTextColor(0xCCFFFFFF);
        saatMetni.setTextSize(13);
        saatMetni.setTypeface(android.graphics.Typeface.SANS_SERIF);
        ustSatir.addView(saatMetni);
        chromeUst.addView(ustSatir, ustSatirLp);
        playerView.addView(chromeUst, new FrameLayout.LayoutParams(-1, dp(104), android.view.Gravity.TOP));
        guncleSaat();
        saatGorevi = new Runnable() {
            @Override public void run() {
                guncleSaat();
                kromIsci.postDelayed(this, 30_000);
            }
        };
        kromIsci.postDelayed(saatGorevi, 30_000);

        // 3) ALT SCRIM: degrade + scrubber satırı + segment satırı.
        chromeAlt = new android.widget.FrameLayout(activity);
        View scrimAlt = new View(activity);
        scrimAlt.setBackground(new android.graphics.drawable.GradientDrawable(
                android.graphics.drawable.GradientDrawable.Orientation.BOTTOM_TOP,
                new int[]{0xF0000000, 0x99000000, 0x00000000}));
        chromeAlt.addView(scrimAlt, new FrameLayout.LayoutParams(-1, -1));
        android.widget.LinearLayout altKol = new android.widget.LinearLayout(activity);
        altKol.setOrientation(android.widget.LinearLayout.VERTICAL);
        altKol.setPadding(dp(20), dp(10), dp(20), dp(14));
        altKol.setGravity(android.view.Gravity.BOTTOM);

        android.widget.LinearLayout scrubSatir = new android.widget.LinearLayout(activity);
        scrubSatir.setOrientation(android.widget.LinearLayout.HORIZONTAL);
        scrubSatir.setGravity(android.view.Gravity.CENTER_VERTICAL);
        saatSol = new android.widget.TextView(activity);
        saatSol.setText("0:00");
        saatSol.setTextColor(0xFFFFFFFF);
        saatSol.setTextSize(12);
        scrubSatir.addView(saatSol);
        seekHat = new SeekHat();
        android.widget.LinearLayout.LayoutParams seekLp = new android.widget.LinearLayout.LayoutParams(
                0, dp(30), 1f);
        seekLp.leftMargin = dp(14);
        seekLp.rightMargin = dp(14);
        scrubSatir.addView(seekHat, seekLp);
        saatSag = new android.widget.TextView(activity);
        saatSag.setText("0:00");
        saatSag.setTextColor(0xB3FFFFFF);
        saatSag.setTextSize(12);
        scrubSatir.addView(saatSag);
        altKol.addView(scrubSatir);

        android.widget.LinearLayout segmentler = new android.widget.LinearLayout(activity);
        segmentler.setOrientation(android.widget.LinearLayout.HORIZONTAL);
        segmentler.setGravity(android.view.Gravity.CENTER_HORIZONTAL);
        segmentler.setPadding(0, dp(10), 0, 0);
        segmentler.addView(segmentDugme(androidx.media3.ui.R.drawable.exo_ic_subtitle_on,
                "Altyazı", true, () -> sheetAltyazi()));
        segmentler.addView(segmentDugme(androidx.media3.ui.R.drawable.exo_ic_audiotrack,
                "Ses", true, () -> sheetSes()));
        segmentler.addView(segmentDugme(androidx.media3.ui.R.drawable.exo_ic_speed,
                "Hız", true, () -> sheetHiz()));
        segmentler.addView(segmentDugme(androidx.media3.ui.R.drawable.exo_icon_fullscreen_enter,
                "En-boy", true, () -> sheetOran()));
        segmentler.addView(segmentDugme(androidx.media3.ui.R.drawable.exo_ic_subtitle_off,
                "Görünüm", true, () -> sheetGorunum()));
        // İndirme: madde 3'ün servisine bağlanacak — şimdilik gri/pasif (plan m7/4).
        segmentler.addView(segmentDugme(android.R.drawable.stat_sys_download,
                "İndir", false, () -> sheetIndir()));
        altKol.addView(segmentler);

        FrameLayout.LayoutParams altKolLp = new FrameLayout.LayoutParams(-1, -2);
        altKolLp.gravity = android.view.Gravity.BOTTOM;
        chromeAlt.addView(altKol, altKolLp);
        playerView.addView(chromeAlt, new FrameLayout.LayoutParams(-1, -2, android.view.Gravity.BOTTOM));

        // 4) ORTA OYNAT/DURAKLAT — chrome ile gelir, 5.5 sn sonra kendiliğinden gider.
        ortadaOynat = new android.widget.ImageView(activity);
        ortadaOynat.setImageResource(androidx.media3.ui.R.drawable.exo_icon_play);
        ortadaOynat.setColorFilter(0xFFFFFFFF, android.graphics.PorterDuff.Mode.SRC_ATOP);
        ortadaOynat.setScaleType(android.widget.ImageView.ScaleType.CENTER_INSIDE);
        ortadaOynat.setPadding(dp(17), dp(17), dp(17), dp(17));
        android.graphics.drawable.GradientDrawable oynatArka = new android.graphics.drawable.GradientDrawable();
        oynatArka.setColor(0x66000000);
        oynatArka.setCornerRadius(dp(44));
        ortadaOynat.setBackground(oynatArka);
        ortadaOynat.setOnClickListener(v -> {
            if (player == null) return;
            if (player.isPlaying()) player.setPlayWhenReady(false); else player.setPlayWhenReady(true);
            chromeGoster();
        });
        FrameLayout.LayoutParams ortaLp = new FrameLayout.LayoutParams(dp(88), dp(88), android.view.Gravity.CENTER);
        playerView.addView(ortadaOynat, ortaLp);

        // 4b) GÖRÜNÜR ±10 SN DÜĞMELERİ — oynat'ın iki yanında (kullanıcı
        // 2026-10-28: "ileri/geri sarma playerda hala yok"; çift dokunma alanı
        // keşfedilebilir değildi, artık basılabilir düğme de var).
        skipSol = yuvarlakAtlaDugmesi("↺\n10", android.view.Gravity.CENTER_VERTICAL | android.view.Gravity.START, -10);
        skipSag = yuvarlakAtlaDugmesi("10\n↻", android.view.Gravity.CENTER_VERTICAL | android.view.Gravity.END, 10);
        FrameLayout.LayoutParams skipSolLp = new FrameLayout.LayoutParams(dp(60), dp(60),
                android.view.Gravity.CENTER_VERTICAL | android.view.Gravity.START);
        skipSolLp.leftMargin = dp(132);
        playerView.addView(skipSol, skipSolLp);
        FrameLayout.LayoutParams skipSagLp = new FrameLayout.LayoutParams(dp(60), dp(60),
                android.view.Gravity.CENTER_VERTICAL | android.view.Gravity.END);
        skipSagLp.rightMargin = dp(132);
        playerView.addView(skipSag, skipSagLp);

        // 5) ±10 sn geri bildirimi (yarım daire etiketi).
        skipEtiket = new android.widget.TextView(activity);
        skipEtiket.setTextColor(0xFFFFFFFF);
        skipEtiket.setTextSize(14);
        skipEtiket.setTypeface(yazi(1f));
        skipEtiket.setPadding(dp(14), dp(8), dp(14), dp(8));
        android.graphics.drawable.GradientDrawable skipArka = new android.graphics.drawable.GradientDrawable();
        skipArka.setColor(0xB3000000);
        skipArka.setCornerRadius(dp(24));
        skipEtiket.setBackground(skipArka);
        skipEtiket.setVisibility(View.GONE);
        FrameLayout.LayoutParams skipLp = new FrameLayout.LayoutParams(-2, -2,
                android.view.Gravity.CENTER_VERTICAL | android.view.Gravity.START);
        skipLp.leftMargin = dp(48);
        playerView.addView(skipEtiket, skipLp);

        chromeAcikMi = true;
        chromeUst.setAlpha(1f);
        chromeAlt.setAlpha(1f);
        zamanlayiciyiKur();

        // 6) TEK poll (500ms): konum/tampon/durum — segment başına poll YOK.
        tickerGorevi = new Runnable() {
            @Override public void run() {
                try {
                    if (player == null || seekHat == null) return;
                    long dur = player.getDuration();
                    long poz = player.getCurrentPosition();
                    long tampon = player.getBufferedPosition();
                    // Track iz cache'i (adVer son güvenlik ağı için): tek ses
                    // yolu + altyazı varlığı → dil çıkarımı.
                    try {
                        boolean aVar = false; int sSay = 0;
                        for (androidx.media3.common.Tracks.Group g : player.getCurrentTracks().getGroups()) {
                            int t = g.getType();
                            if (t == C.TRACK_TYPE_TEXT) aVar = true;
                            else if (t == C.TRACK_TYPE_AUDIO) sSay += g.length;
                        }
                        altyaziYolVarMi = aVar; sesYolSayisi = sSay;
                    } catch (Exception ignored) {}
                    if (dur > 0 && dur < 86_400_000L) {
                        if (!surukleMi) {
                            seekHat.guncelle(poz, dur, tampon);
                            if (saatSol != null) saatSol.setText(sureMetni(poz));
                        }
                        if (saatSag != null) saatSag.setText(sureMetni(dur));
                    }
                    if (ortadaOynat != null) ortadaOynat.setImageResource(player.isPlaying()
                            ? androidx.media3.ui.R.drawable.exo_icon_pause
                            : androidx.media3.ui.R.drawable.exo_icon_play);
                    // Duraklayınca kontroller kendiliğinden gelsin (Netflix).
                    if (!player.isPlaying() && !chromeAcikMi) chromeGoster();
                } catch (Exception ignored) {
                } finally {
                    kromIsci.postDelayed(this, 500);
                }
            }
        };
        kromIsci.postDelayed(tickerGorevi, 300);
    }

    private void guncleSaat() {
        if (saatMetni == null) return;
        try {
            saatMetni.setText(new java.text.SimpleDateFormat("HH:mm", java.util.Locale.ROOT)
                    .format(new java.util.Date()));
        } catch (Exception ignored) {}
    }

    /** Segment düğmesi: ikon + TAM etiket (kırpma yok — ağırlıklı eşit dağılım). */
    private android.widget.LinearLayout segmentDugme(int ikonRes, String ad, boolean aktif, Runnable is) {
        android.widget.LinearLayout dugme = new android.widget.LinearLayout(activity);
        dugme.setOrientation(android.widget.LinearLayout.VERTICAL);
        dugme.setGravity(android.view.Gravity.CENTER_HORIZONTAL);
        dugme.setPadding(dp(8), dp(6), dp(8), dp(4));
        android.graphics.drawable.GradientDrawable arka = new android.graphics.drawable.GradientDrawable();
        arka.setColor(aktif ? 0x26FFFFFF : 0x14FFFFFF);
        arka.setCornerRadius(dp(16));
        dugme.setBackground(arka);
        android.widget.ImageView ikon = new android.widget.ImageView(activity);
        ikon.setImageResource(ikonRes);
        ikon.setColorFilter(aktif ? 0xFFFFFFFF : 0x66FFFFFF, android.graphics.PorterDuff.Mode.SRC_ATOP);
        dugme.addView(ikon, new android.widget.LinearLayout.LayoutParams(dp(21), dp(21)));
        android.widget.TextView etiket = new android.widget.TextView(activity);
        etiket.setText(ad);
        etiket.setTextColor(aktif ? 0xE6FFFFFF : 0x66FFFFFF);
        etiket.setTextSize(10.5f);
        etiket.setTypeface(yazi(1f));
        etiket.setSingleLine(true);
        etiket.setGravity(android.view.Gravity.CENTER);
        etiket.setPadding(0, dp(3), 0, 0);
        dugme.addView(etiket);
        // Ağırlıklı genişlik: altı segment ekranı eşit paylaşır, etiketler tam sığar.
        android.widget.LinearLayout.LayoutParams lp = new android.widget.LinearLayout.LayoutParams(
                0, -2, 1f);
        lp.leftMargin = dp(3);
        lp.rightMargin = dp(3);
        dugme.setLayoutParams(lp);
        dugme.setClickable(true);
        dugme.setOnClickListener(v -> {
            chromeGoster();
            if (is != null) is.run();
        });
        return dugme;
    }

    // ── krom görünürlük yönetimi ──────────────────────────────────────────
    /** ±10 sn yuvarlak düğme fabrikası (sisli daire + iki satır etiket). */
    private android.widget.TextView yuvarlakAtlaDugmesi(String metin, int gravity, int sn) {
        android.widget.TextView dugme = new android.widget.TextView(activity);
        dugme.setText(metin);
        dugme.setTextColor(0xFFFFFFFF);
        dugme.setTextSize(14);
        dugme.setTypeface(yazi(1f));
        dugme.setGravity(android.view.Gravity.CENTER);
        dugme.setLineSpacing(0f, 0.82f);
        android.graphics.drawable.GradientDrawable arka = new android.graphics.drawable.GradientDrawable();
        arka.setColor(0x40FFFFFF);
        arka.setCornerRadius(dp(30));
        dugme.setBackground(arka);
        dugme.setOnClickListener(v -> {
            atla(sn);
            skipGoster(sn < 0);
            chromeGoster();
        });
        return dugme;
    }

    private void chromeGoster() {
        chromeAcikMi = true;
        if (chromeUst != null) { chromeUst.setAlpha(1f); chromeUst.setVisibility(View.VISIBLE); }
        if (chromeAlt != null) { chromeAlt.setAlpha(1f); chromeAlt.setVisibility(View.VISIBLE); }
        if (ortadaOynat != null) { ortadaOynat.setAlpha(1f); ortadaOynat.setVisibility(View.VISIBLE); }
        if (skipSol != null) { skipSol.setAlpha(1f); skipSol.setVisibility(View.VISIBLE); }
        if (skipSag != null) { skipSag.setAlpha(1f); skipSag.setVisibility(View.VISIBLE); }
        zamanlayiciyiKur();
    }

    private void chromeGizle() {
        if (!chromeAcikMi) return;
        chromeAcikMi = false;
        if (chromeUst == null || chromeAlt == null || ortadaOynat == null) return;
        // SADECE solmak yetmez: alpha-0 View dokunmayı hâlâ yer. Görünmez
        // krom GONE olmalı ki ekranın her yeri jest alanına düşsün ve tek
        // dokunuş playerı açsın (kullanıcı 2026-10-28).
        chromeUst.animate().alpha(0f).setDuration(220)
                .withEndAction(() -> { if (!chromeAcikMi && chromeUst != null) chromeUst.setVisibility(View.GONE); }).start();
        chromeAlt.animate().alpha(0f).setDuration(220)
                .withEndAction(() -> { if (!chromeAcikMi && chromeAlt != null) chromeAlt.setVisibility(View.GONE); }).start();
        ortadaOynat.animate().alpha(0f).setDuration(220)
                .withEndAction(() -> { if (!chromeAcikMi && ortadaOynat != null) ortadaOynat.setVisibility(View.GONE); }).start();
        if (skipSol != null) skipSol.animate().alpha(0f).setDuration(220)
                .withEndAction(() -> { if (!chromeAcikMi && skipSol != null) skipSol.setVisibility(View.GONE); }).start();
        if (skipSag != null) skipSag.animate().alpha(0f).setDuration(220)
                .withEndAction(() -> { if (!chromeAcikMi && skipSag != null) skipSag.setVisibility(View.GONE); }).start();
        kromIsci.removeCallbacks(gizleGorevi);
    }

    /** 5.5 sn boşta kalınca krom gizlenir; sheet/sürükleme/oynatmama engel. */
    private void zamanlayiciyiKur() {
        if (gizleGorevi == null) gizleGorevi = () -> {
            boolean oynuyor = player != null && player.isPlaying();
            if (oynuyor && aktifSheet == null && !surukleMi) chromeGizle();
        };
        kromIsci.removeCallbacks(gizleGorevi);
        kromIsci.postDelayed(gizleGorevi, 5500);
    }

    private void skipGoster(boolean sol) {
        if (skipEtiket == null) return;
        skipEtiket.setText(sol ? "↺  10 sn" : "10 sn  ↻");
        FrameLayout.LayoutParams lp = (FrameLayout.LayoutParams) skipEtiket.getLayoutParams();
        lp.gravity = android.view.Gravity.CENTER_VERTICAL | (sol
                ? android.view.Gravity.START : android.view.Gravity.END);
        lp.leftMargin = sol ? dp(48) : 0;
        lp.rightMargin = sol ? 0 : dp(48);
        skipEtiket.setLayoutParams(lp);
        skipEtiket.setAlpha(0f);
        skipEtiket.setScaleX(0.85f);
        skipEtiket.setScaleY(0.85f);
        skipEtiket.setVisibility(View.VISIBLE);
        skipEtiket.animate().alpha(1f).scaleX(1f).scaleY(1f).setDuration(140)
                .withEndAction(() -> skipEtiket.animate().alpha(0f).setStartDelay(450).setDuration(260).start())
                .start();
    }

    /** İnce lime scrubber: yol/tampon/oynanan + sürüklerken süre balonu. */
    private final class SeekHat extends android.view.View {
        SeekHat() { super(activity); }
        private long sure, konum, tampon, surukleMs = -1;
        private final android.graphics.Paint yol = new android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG);
        private final android.graphics.Paint tamponP = new android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG);
        private final android.graphics.Paint dolgu = new android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG);
        private final android.graphics.Paint balon = new android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG);
        private final android.graphics.Paint balonYazi = new android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG);
        {
            yol.setColor(0x40FFFFFF); yol.setStrokeWidth(dp(3)); yol.setStrokeCap(android.graphics.Paint.Cap.ROUND);
            tamponP.setColor(0x8CFFFFFF); tamponP.setStrokeWidth(dp(3)); tamponP.setStrokeCap(android.graphics.Paint.Cap.ROUND);
            dolgu.setColor(LIME); dolgu.setStrokeWidth(dp(4)); dolgu.setStrokeCap(android.graphics.Paint.Cap.ROUND);
            balon.setColor(0xE6000000);
            balonYazi.setColor(0xFFFFFFFF); balonYazi.setTextSize(sp13()); balonYazi.setTextAlign(android.graphics.Paint.Align.CENTER);
        }
        private float sp13() { return 13f * activity.getResources().getDisplayMetrics().scaledDensity; }
        void guncelle(long pozMs, long sureMs, long tamponMs) {
            konum = pozMs; sure = sureMs; tampon = tamponMs;
            invalidate();
        }
        private long msFromX(float x) {
            if (sure <= 0) return 0;
            float oran = Math.max(0f, Math.min(1f, (x - dp(2)) / (getWidth() - dp(4))));
            return (long) (oran * sure);
        }
        @Override protected void onDraw(android.graphics.Canvas c) {
            float y = getHeight() - dp(15);
            float x0 = dp(2), x1 = getWidth() - dp(2);
            c.drawLine(x0, y, x1, y, yol);
            if (sure > 0) {
                float xT = x0 + (x1 - x0) * Math.min(1f, Math.max(0f, tampon / (float) sure));
                long gosterim = surukleMs >= 0 ? surukleMs : konum;
                float xK = x0 + (x1 - x0) * Math.min(1f, Math.max(0f, gosterim / (float) sure));
                c.drawLine(x0, y, xT, y, tamponP);
                c.drawLine(x0, y, xK, y, dolgu);
                // Başparmak: beyaz halka + lime dolgu (Netflix inceliği).
                c.drawCircle(xK, y, dp(7), yol);
                yol.setColor(0x33FFFFFF);
                c.drawCircle(xK, y, dp(4.4f), dolgu);
                yol.setColor(0x40FFFFFF);
                if (surukleMi) {
                    String metin = sureMetni(gosterim);
                    float tw = balonYazi.measureText(metin) + dp(18);
                    float bx = Math.max(tw / 2 + dp(6), Math.min(getWidth() - tw / 2 - dp(6), xK));
                    float by = y - dp(34);
                    c.drawRoundRect(bx - tw / 2, by - dp(12), bx + tw / 2, by + dp(12), dp(9), dp(9), balon);
                    c.drawText(metin, bx, by + sp13() * 0.36f, balonYazi);
                }
            }
        }
        @Override public boolean onTouchEvent(android.view.MotionEvent ev) {
            if (sure <= 0) return false;
            switch (ev.getActionMasked()) {
                case android.view.MotionEvent.ACTION_DOWN:
                    surukleMi = true;
                    kromIsci.removeCallbacks(gizleGorevi);
                    surukleMs = msFromX(ev.getX());
                    if (saatSol != null) saatSol.setText(sureMetni(surukleMs));
                    invalidate();
                    return true;
                case android.view.MotionEvent.ACTION_MOVE:
                    surukleMs = msFromX(ev.getX());
                    if (saatSol != null) saatSol.setText(sureMetni(surukleMs));
                    invalidate();
                    return true;
                case android.view.MotionEvent.ACTION_UP:
                case android.view.MotionEvent.ACTION_CANCEL:
                    long hedef = surukleMs;
                    surukleMs = -1;
                    surukleMi = false;
                    invalidate();
                    if (ev.getActionMasked() == android.view.MotionEvent.ACTION_UP && hedef >= 0 && player != null) {
                        player.seekTo(hedef); // bırakınca TEK seek (sürüklerken spam yok)
                        konum = hedef;
                        if (saatSol != null) saatSol.setText(sureMetni(hedef));
                    }
                    zamanlayiciyiKur();
                    return true;
                default:
                    return super.onTouchEvent(ev);
            }
        }
    }


    private static final int[] ORAN_MODLERI = {
            androidx.media3.ui.AspectRatioFrameLayout.RESIZE_MODE_FIT,
            androidx.media3.ui.AspectRatioFrameLayout.RESIZE_MODE_ZOOM,
            androidx.media3.ui.AspectRatioFrameLayout.RESIZE_MODE_FILL,
    };
    private static final String[] ORAN_ADALRI = {"Sığdır (siyah kenar)", "Yakınlaştır (kırp)", "Ger (uzat)"};
    // Altyazı boyutu: DEFAULT_TEXT_SIZE_FRACTION çarpanları; stil: CaptionStyle tablosu.
    private static final float[] BOYUT_CARPANLARI = {0.75f, 1f, 1.4f};
    private static final String[] BOYUT_ADALRI = {"Küçük", "Normal", "Büyük"};
    private static final String[] STIL_ADALRI = {"Varsayılan (gömülü)", "Beyaz · siyah kutu", "Sarı · siyah kutu", "Konturlu"};

    // Kullanıcı düzenlemesi (2026-10-28): her şey kendi alt menüsünde —
    // Altyazılar (Yok/Otomatik + gerçek track listesi + boyut + stil),
    // Ses (Otomatik + track listesi), Oynatma hızı, En-boy ayrı.
    // Track listeleri her açılışta player.getCurrentTracks()'ten canlı okunur.
    private static final float[] HIZLAR = {0.5f, 0.75f, 1f, 1.25f, 1.5f, 2f};
    private static final String[] HIZ_ADALRI = {"0,5x", "0,75x", "Normal", "1,25x", "1,5x", "2x"};

    private java.util.List<androidx.media3.common.Tracks.Group> turGruplari(int tur) {
        java.util.List<androidx.media3.common.Tracks.Group> out = new java.util.ArrayList<>();
        if (player == null) return out;
        for (androidx.media3.common.Tracks.Group g : player.getCurrentTracks().getGroups())
            if (g.getType() == tur) out.add(g);
        return out;
    }

    // Dil kodu → Türkçe ad (kullanıcı 2026-10-28: "Parça 1 yazmasın, dublaj neyse o yazsın").
    private static final java.util.Map<String, String> DIL_ADLARI = new java.util.HashMap<>();
    static {
        DIL_ADLARI.put("tr", "Türkçe"); DIL_ADLARI.put("en", "İngilizce");
        DIL_ADLARI.put("de", "Almanca"); DIL_ADLARI.put("fr", "Fransızca");
        DIL_ADLARI.put("es", "İspanyolca"); DIL_ADLARI.put("it", "İtalyanca");
        DIL_ADLARI.put("ru", "Rusça"); DIL_ADLARI.put("ja", "Japonca");
        DIL_ADLARI.put("ko", "Korece"); DIL_ADLARI.put("zh", "Çince");
        DIL_ADLARI.put("ar", "Arapça"); DIL_ADLARI.put("hi", "Hintçe");
        DIL_ADLARI.put("pt", "Portekizce"); DIL_ADLARI.put("nl", "Felemenkçe");
        DIL_ADLARI.put("sv", "İsveççe"); DIL_ADLARI.put("pl", "Lehçe");
        DIL_ADLARI.put("uk", "Ukraynaca"); DIL_ADLARI.put("fa", "Farsça");
        DIL_ADLARI.put("az", "Azerbaycanca"); DIL_ADLARI.put("el", "Yunanca");
    }

    /* Dil tahmini zinciri (kullanıcı 2026-10-28): "Ses 1" yazmak yerine
       kaynağın VERDİĞİ ipuçlarından dili otomatik çöz. Sıra: Format.label →
       Format.language (BCP47) → label|language|id birleşik metninde anahtar
       kelime/ISO kodu araması → kanıt yoksa kanala göre tanımlayıcı ad.
       HLS rendition'larının NAME/id alanları ("r2817-tr", "Dublaj", "eng")
       çoğu TR kaynağında dili taşır; Media3 bunları Format'a koyar. */
    private static String izDilTahmin(String birlesik, boolean sesMi) {
        String ham = (" " + birlesik.toLowerCase(java.util.Locale.ROOT).replaceAll("[^a-z0-9]+", " ") + " ");
        boolean dub = ham.contains(" dublaj ") || ham.contains(" dubla") || ham.contains("dublaj")
                || ham.contains(" dubbed") || ham.contains(" dub ") || ham.contains("dub ");
        String bulundu = null;
        if (dub || ham.contains(" turk") || ham.contains(" turkish") || ham.contains(" trke")
                || ham.contains(" trk ") || ham.contains(" tr ") || ham.contains("tr-")) bulundu = "Türkçe";
        else if (ham.contains("ingil") || ham.contains("english") || ham.contains(" eng ")
                || ham.contains(" en ") || ham.contains("en-") || ham.contains(" ing ")) bulundu = "İngilizce";
        else if (ham.contains("alman") || ham.contains("german") || ham.contains(" deu")
                || ham.contains(" ger ") || ham.contains(" de ")) bulundu = "Almanca";
        else if (ham.contains("frans") || ham.contains("french") || ham.contains(" fra")
                || ham.contains(" fr ")) bulundu = "Fransızca";
        else if (ham.contains("ispany") || ham.contains("spanish") || ham.contains(" spa")
                || ham.contains(" es ")) bulundu = "İspanyolca";
        else if (ham.contains("ital")) bulundu = "İtalyanca";
        else if (ham.contains("rus ") || ham.contains("russian")) bulundu = "Rusça";
        else if (ham.contains("japon") || ham.contains("japanese") || ham.contains(" ja ")
                || ham.contains("jpn")) bulundu = "Japonca";
        else if (ham.contains("kore") || ham.contains(" ko ")) bulundu = "Korece";
        else if (ham.contains("cince") || ham.contains("chinese") || ham.contains("zh")) bulundu = "Çince";
        else if (ham.contains("arap") || ham.contains(" ar ")) bulundu = "Arapça";
        if (bulundu == null && dub) bulundu = "Türkçe"; // dublaj = TR ses (yerel kaynak kuralı)
        if (bulundu == null) return null;
        return (sesMi && dub && bulundu.equals("Türkçe")) ? "Türkçe (Dublaj)" : bulundu;
    }

    /* Dil ipucu (JS → native): yayın kartı analizi dublaj/altyazılı bilgisini
       zaten çözüyor (yayinSesBilgisi); HLS metadata'sı suskunsa ses satırının
       adı bundan üretilir — "Ses 1" yerine "Türkçe (Dublaj)" (kullanıcı 2026-10-28). */
    private volatile String dilIpucu = "";
    /** Yükleme-anı altyazı kimlikleri (etiket+dil) — sheet satır adları bundan okur. */
    private final java.util.List<String> senkEtiketler =
            java.util.Collections.synchronizedList(new java.util.ArrayList<String>());
    private final java.util.List<String> senkDiller =
            java.util.Collections.synchronizedList(new java.util.ArrayList<String>());
    /** Ticker'ın 500ms'lik iz cache'i — adVer worker thread'den de okunabilir. */
    private volatile boolean altyaziYolVarMi = false;
    private volatile int sesYolSayisi = 0;
    void dilIpucuAyarla(String v) { dilIpucu = v == null ? "" : v.trim(); }

    /** izAdi + dil ipucu birleşimi: Format suskunsa JS'in bildiğini kullan. */
    private String adVer(androidx.media3.common.Format f, int sira, boolean sesMi) {
        String ad = izAdi(f, sira, sesMi);
        if (!sesMi && ad.startsWith("Altyazı ")) {
            // Yedekten (JS altyaziJson) oku: "Altyazı 1" yerine dil/etiket.
            if (sira >= 0 && sira < senkEtiketler.size()) {
                String et = senkEtiketler.get(sira);
                String dy = senkDiller.get(sira);
                String harita = DIL_ADLARI.get(dy == null ? "" : dy.toLowerCase(java.util.Locale.ROOT));
                String isim = harita;
                if (isim == null && et != null && !et.isEmpty()
                        && !et.equalsIgnoreCase("Altyazı") && !et.equalsIgnoreCase("altyazi")) isim = et;
                if (isim == null && dy != null && !dy.isEmpty()) isim = izDilTahmin(dy, false);
                if (isim != null && !isim.isEmpty()) return isim;
            }
            // Akışa GÖMÜLÜ altyazı (muxed VTT) — dil kutusu boş. Bu kaynaklarda
            // gömülü altyazı Türkçedir (site kuralı; "Altyazı 1" yasak —
            // kullanıcı 2026-10-28).
            return "Türkçe altyazı";
        }
        String ipucu = dilIpucu;
        if (sesMi && ad.startsWith("Ses ")) {
            int nokta = ad.indexOf('·');
            String kuyruk = nokta > 0 ? " · " + ad.substring(nokta + 1).trim() : "";
            if (!ipucu.isEmpty()) {
                if (ipucu.contains("dublaj") || ipucu.contains("dub"))
                    ad = "Türkçe (Dublaj)" + kuyruk;
                else if (ipucu.contains("altyaz") || ipucu.contains("sub") || ipucu.contains("orijinal"))
                    ad = "Orijinal dil" + kuyruk;
            } else if (sesYolSayisi <= 1) {
                // Son güvenlik ağı (kullanıcı 2026-10-28: "her türlü çözmeli"):
                // metadata da JS de sustuysa tek bilinmeyen ses yolu = ya
                // altyazıyla gelen özgün dil ya da yerel dublaj.
                ad = (altyaziYolVarMi ? "Orijinal dil" : "Türkçe (Dublaj)") + kuyruk;
            }
        }
        return ad;
    }

    private static String izAdi(androidx.media3.common.Format f, int sira, boolean sesMi) {
        if (f.label != null && !f.label.isEmpty()) {
            // Etiket çıplak kod olabilir ("tr") — Türkçe okunabilir ada çevir.
            String etiketKucuk = f.label.toLowerCase(java.util.Locale.ROOT).trim();
            String harita = DIL_ADLARI.get(etiketKucuk);
            return harita != null ? harita : f.label;
        }
        String dil = f.language == null ? "" : f.language.toLowerCase(java.util.Locale.ROOT);
        String ad = DIL_ADLARI.get(dil);
        if (ad != null) return (sesMi && dil.equals("tr")) ? "Türkçe (Dublaj)" : ad;
        // language yok/`und`/`mis`: id + language birleşik metninde kazı yap.
        String birlesik = (f.language == null ? "" : f.language) + " " + (f.id == null ? "" : f.id)
                + " " + (f.label == null ? "" : f.label);
        String tahmin = izDilTahmin(birlesik, sesMi);
        if (tahmin != null) return tahmin;
        if (!dil.isEmpty() && !dil.equals("und") && !dil.equals("mis") && !dil.equals("zxx"))
            return dil.toUpperCase(java.util.Locale.ROOT);
        if (sesMi) {
            // Kanıt yoksa "Ses 1" deme — en azından kanalı söyle (kullanıcı 2026-10-28).
            String kanal = f.channelCount <= 1 ? "Mono" : f.channelCount == 2 ? "Stereo" : "5.1+";
            return "Ses " + (sira + 1) + " · " + kanal
                    + (f.bitrate > 0 ? " · " + Math.round(f.bitrate / 1000f) + " kbps" : "");
        }
        return "Altyazı " + (sira + 1);
    }

    /** Tek bir izi seçer (sheet satırlarından çağrılır; menuId hesapları yok). */
    private void izSecDuz(int tip, androidx.media3.common.Tracks.Group grp, int i) {
        if (player == null) return;
        try {
            player.setTrackSelectionParameters(player.getTrackSelectionParameters().buildUpon()
                    .setTrackTypeDisabled(tip, false)
                    .clearOverridesOfType(tip)
                    .setOverrideForType(new androidx.media3.common.TrackSelectionOverride(
                            grp.getMediaTrackGroup(), java.util.Collections.singletonList(i)))
                    .build());
        } catch (Exception ignored) {}
    }

    /** Bu türde elle seçilmiş bir iz var mı? (sheets'te "Yok" tikini belirler) */
    private boolean izSeciliMi(int tip) {
        for (androidx.media3.common.Tracks.Group g : turGruplari(tip))
            for (int i = 0; i < g.length; i++) if (g.isTrackSelected(i)) return true;
        return false;
    }

    private void izKapat(int tur) {
        if (player == null) return;
        androidx.media3.common.TrackSelectionParameters.Builder b =
                player.getTrackSelectionParameters().buildUpon().clearOverridesOfType(tur);
        for (androidx.media3.common.Tracks.Group g : turGruplari(tur))
            b.setOverrideForType(new androidx.media3.common.TrackSelectionOverride(
                    g.getMediaTrackGroup(), java.util.Collections.emptyList()));
        player.setTrackSelectionParameters(b.build());
    }

    private void izOtomatik(int tur) {
        if (player == null) return;
        player.setTrackSelectionParameters(player.getTrackSelectionParameters().buildUpon()
                .clearOverridesOfType(tur).build());
    }

    // ── ALTTAN AÇILAN KOYU SAYFALAR (sheets) ─────────────────────────────
    // PopupMenu devri bitti (2026-10-28): segment dokununca ekranın altından
    // yuvarlatılmış koyu panel kayar (Stremio/Netflix davranışı). Material
    // bağımlılığı yok: Dialog + slide animasyonu (res/anim) + saf View satırlar.
    // Sheet açıkken auto-hide durur ve yan çift-dokunma sarımı devre dışıdır.
    private static final class Satir {
        final String ad; final boolean secili; final Runnable is; final boolean pasif;
        /** Alt başlık satırı (BÖLÜM etiketi): tıklanmaz, sadece gruplar (kullanıcı 2026-10-29). */
        final boolean bolum;
        /** Altyazı önizlemesi: -1 yok; 0-3 altyazı stili; önizlemeBoyut boyut çarpanı (0 → 1). */
        final int onizlemeStil; final float onizlemeBoyut;
        /** Serbest görsel önizleme (en-boy şeması, hız barı) — stil önizlemesinden önce gelirse o kullanılır. */
        final View onizlemeView;
        Satir(String ad, boolean secili, Runnable is) { this(ad, secili, is, false); }
        Satir(String ad, boolean secili, Runnable is, boolean pasif) {
            this(ad, secili, is, pasif, -1, 0f, null);
        }
        Satir(String ad, boolean secili, Runnable is, int onizlemeStil, float onizlemeBoyut) {
            this(ad, secili, is, false, onizlemeStil, onizlemeBoyut, null);
        }
        Satir(String ad, boolean secili, Runnable is, View onizlemeView) {
            this(ad, secili, is, false, -1, 0f, onizlemeView);
        }
        Satir(String ad, boolean secili, Runnable is, boolean pasif, int onizlemeStil, float onizlemeBoyut) {
            this(ad, secili, is, pasif, onizlemeStil, onizlemeBoyut, null);
        }
        Satir(String ad, boolean secili, Runnable is, boolean pasif, int onizlemeStil, float onizlemeBoyut, View onizlemeView) {
            this(ad, secili, is, pasif, onizlemeStil, onizlemeBoyut, onizlemeView, false);
        }
        private Satir(String ad, boolean secili, Runnable is, boolean pasif, int onizlemeStil, float onizlemeBoyut, View onizlemeView, boolean bolum) {
            this.ad = ad; this.secili = secili; this.is = is; this.pasif = pasif;
            this.onizlemeStil = onizlemeStil; this.onizlemeBoyut = onizlemeBoyut;
            this.onizlemeView = onizlemeView; this.bolum = bolum;
        }
        /** Bölüm etikeni üretir: tıklanmaz alt başlık (BÖLÜM başlıkları için). */
        static Satir bolum(String ad) {
            return new Satir(ad, false, null, true, -1, 0f, null, true);
        }
    }

    private void sheetAltyazi() {
        java.util.List<Satir> s = new java.util.ArrayList<>();
        java.util.List<androidx.media3.common.Tracks.Group> metinler = turGruplari(C.TRACK_TYPE_TEXT);
        if (metinler.isEmpty()) {
            s.add(new Satir("Bu yayında altyazı yok", false, null, true));
        } else {
            s.add(new Satir("Yok", !izSeciliMi(C.TRACK_TYPE_TEXT), () -> izKapat(C.TRACK_TYPE_TEXT)));
            s.add(new Satir("Otomatik seç", false, () -> izOtomatik(C.TRACK_TYPE_TEXT)));
            int sira = 0;
            for (androidx.media3.common.Tracks.Group g : metinler)
                for (int i = 0; i < g.length; i++) {
                    final androidx.media3.common.Tracks.Group gg = g;
                    final int ii = i;
                    final int ss = sira++;
                    s.add(new Satir(adVer(gg.getTrackFormat(ii), ss, false), gg.isTrackSelected(ii),
                            () -> izSecDuz(C.TRACK_TYPE_TEXT, gg, ii)));
                }
        }
        s.add(new Satir("Altyazı boyutu ve stili", false, this::sheetGorunum));
        sheetAc("Altyazılar", s);
    }

    private void sheetSes() {
        java.util.List<Satir> s = new java.util.ArrayList<>();
        java.util.List<androidx.media3.common.Tracks.Group> sesler = turGruplari(C.TRACK_TYPE_AUDIO);
        if (sesler.isEmpty()) {
            s.add(new Satir("Bu yayında tek ses var", false, null, true));
        } else {
            s.add(new Satir("Otomatik seç", !izSeciliMi(C.TRACK_TYPE_AUDIO), () -> izOtomatik(C.TRACK_TYPE_AUDIO)));
            for (androidx.media3.common.Tracks.Group g : sesler)
                for (int i = 0; i < g.length; i++) {
                    final androidx.media3.common.Tracks.Group gg = g;
                    final int ii = i;
                    s.add(new Satir(adVer(gg.getTrackFormat(i), i, true), gg.isTrackSelected(i),
                            () -> izSecDuz(C.TRACK_TYPE_AUDIO, gg, ii)));
                }
        }
        sheetAc("Ses parçaları", s);
    }

    private void sheetHiz() {
        java.util.List<Satir> s = new java.util.ArrayList<>();
        float simdi = player != null ? player.getPlaybackParameters().speed : 1f;
        for (int i = 0; i < HIZLAR.length; i++) {
            final float h = HIZLAR[i];
            s.add(new Satir(HIZ_ADALRI[i], Math.abs(h - simdi) < 0.01f, () -> {
                if (player != null) player.setPlaybackSpeed(h);
            }, hizCubugu(h)));
        }
        sheetAc("Oynatma hızı", s);
    }

    /** En-boy modu şeması: ekran çerçevesi + içine oturan video kutusu. */
    private View oranSemasi(int mod) {
        FrameLayout cep = new FrameLayout(activity);
        android.graphics.drawable.GradientDrawable cerceve
                = new android.graphics.drawable.GradientDrawable();
        cerceve.setColor(0x2EFFFFFF);
        cerceve.setCornerRadius(dp(6));
        cep.setBackground(cerceve);
        View ekran = new View(activity);
        android.graphics.drawable.GradientDrawable eArka
                = new android.graphics.drawable.GradientDrawable();
        eArka.setColor(0xE6FFFFFF);
        eArka.setCornerRadius(dp(3));
        ekran.setBackground(eArka);
        FrameLayout.LayoutParams ep = new FrameLayout.LayoutParams(-1, -1);
        // 0 sığdır: siyah kenarlı kutu; 1 yakınlaştır: çerçeveye yapışık taşkın;
        // 2 ger: çerçeveyi tam dolduran ezilmiş kutu.
        if (mod == 0) ep.setMargins(dp(11), dp(7), dp(11), dp(7));
        else if (mod == 1) ep.setMargins(dp(3), 0, dp(3), 0);
        cep.addView(ekran, ep);
        // Sabit dış ölçü: -1 çocuk wrap-content'u satır genişliğine şişirir
        // (ölçüldü 2026-10-28: şemeler dev gri kutu oldu) — params burada verilir.
        cep.setLayoutParams(new android.widget.LinearLayout.LayoutParams(dp(64), dp(38)));
        ((android.widget.LinearLayout.LayoutParams) cep.getLayoutParams()).rightMargin = dp(12);
        return cep;
    }

    /** Hız önizlemesi: oransal lime dolgu barı (0.5–2x aralığında). */
    private View hizCubugu(float hiz) {
        FrameLayout ray = new FrameLayout(activity);
        android.graphics.drawable.GradientDrawable track
                = new android.graphics.drawable.GradientDrawable();
        track.setColor(0x2EFFFFFF);
        track.setCornerRadius(dp(3));
        ray.setBackground(track);
        View dolgu = new View(activity);
        android.graphics.drawable.GradientDrawable dArka
                = new android.graphics.drawable.GradientDrawable();
        dArka.setColor(LIME);
        dArka.setCornerRadius(dp(3));
        dolgu.setBackground(dArka);
        int genislik = dp(72);
        ray.setLayoutParams(new android.widget.LinearLayout.LayoutParams(genislik, dp(6)));
        ((android.widget.LinearLayout.LayoutParams) ray.getLayoutParams()).rightMargin = dp(12);
        int dolguW = Math.round(genislik * Math.max(0.12f, Math.min(1f, hiz / 2f)));
        FrameLayout.LayoutParams dp2 = new FrameLayout.LayoutParams(dolguW, dp(6));
        dp2.gravity = android.view.Gravity.START | android.view.Gravity.CENTER_VERTICAL;
        ray.addView(dolgu, dp2);
        return ray;
    }

    private void sheetOran() {
        java.util.List<Satir> s = new java.util.ArrayList<>();
        int mevcut = tercihInt("oran", 0);
        for (int i = 0; i < ORAN_ADALRI.length; i++) {
            final int idx = i;
            s.add(new Satir(ORAN_ADALRI[i], i == mevcut, () -> {
                tercihYaz("oran", idx);
                oyuniciAyarlariUygula();
            }, oranSemasi(i)));
        }
        sheetAc("Görüntü oranı", s);
    }

    private void sheetGorunum() {
        java.util.List<Satir> s = new java.util.ArrayList<>();
        // Satırlar GÖRSEL önizleme taşır: her seçenek kendi stilinde/boyutunda
        // "AaBb 123" örneği basar (kullanıcı 2026-10-28: "görsel betimleme yok").
        // 2026-10-29: "Boyut · "/"Stil · " önekleri bölüm başlıklarına taşındı —
        // satır adları sadeleşti, gruplar üst başlıkla ayrışıyor.
        final int suStil = tercihInt("altyazi_stil", 0);
        final float suBoyut = BOYUT_CARPANLARI[Math.max(0,
                Math.min(BOYUT_CARPANLARI.length - 1, tercihInt("altyazi_boyut", 1)))];
        s.add(Satir.bolum("Boyut"));
        for (int i = 0; i < BOYUT_ADALRI.length; i++) {
            final int idx = i;
            s.add(new Satir(BOYUT_ADALRI[i], i == tercihInt("altyazi_boyut", 1), () -> {
                tercihYaz("altyazi_boyut", idx);
                oyuniciAyarlariUygula();
            }, suStil, BOYUT_CARPANLARI[idx]));
        }
        s.add(Satir.bolum("Stil"));
        for (int i = 0; i < STIL_ADALRI.length; i++) {
            final int idx = i;
            s.add(new Satir(STIL_ADALRI[i], i == tercihInt("altyazi_stil", 0), () -> {
                tercihYaz("altyazi_stil", idx);
                oyuniciAyarlariUygula();
            }, i, suBoyut));
        }
        sheetAc("Altyazı görünümü", s);
    }

    private void sheetIndir() {
        // Madde 3 (indirme servisi) bağlanınca satırlar gerçek kuyruğu açacak;
        // WebView köprüsüyle JS tarafına istek bildirilir (PlayerModal dinler).
        jsCalistir("window.dispatchEvent(new CustomEvent('cp-indir-istek'))");
        java.util.List<Satir> s = new java.util.ArrayList<>();
        s.add(new Satir("Bölüm indirme hazırlanıyor — indirme merkezinden takip edebilirsin",
                false, null, true));
        sheetAc("İndirme", s);
    }

    /** Koyu, yuvarlatılmış, alttan kayan seçenek paneli. */
    private void sheetAc(String baslik, java.util.List<Satir> satirlar) {
        if (activity == null || activity.isFinishing()) return;
        if (aktifSheet != null) { try { aktifSheet.dismiss(); } catch (Exception ignored) {} }
        kromIsci.removeCallbacks(gizleGorevi); // sheet açıkken krom gizlenmez

        // Aşağı sürükleme ile kapatma durumu (liste satırları DOWN tükettiği
        // için olaylar parent intercept ile yakalanır — kullanıcı 2026-10-28).
        final float[] surukleBasY = {-1f};
        final long[] surukleBasT = {0L};
        final android.app.Dialog d = new android.app.Dialog(activity); // çarpı ileri referans
        final android.widget.ScrollView kaydir = new android.widget.ScrollView(activity);
        kaydir.setVerticalScrollBarEnabled(false);
        android.widget.LinearLayout kolon = new android.widget.LinearLayout(activity) {
            private float basX, basY;
            private boolean surukleDevralindi;
            @Override public boolean onInterceptTouchEvent(android.view.MotionEvent ev) {
                switch (ev.getActionMasked()) {
                    case android.view.MotionEvent.ACTION_DOWN:
                        basX = ev.getY();
                        basY = ev.getY();
                        surukleDevralindi = false;
                        return false;
                    case android.view.MotionEvent.ACTION_MOVE: {
                        float dy = ev.getY() - basY;
                        float dx = Math.abs(ev.getX() - basX);
                        boolean listeKisa = kaydir.getChildCount() == 0
                                || (kaydir.getChildAt(0) != null
                                && kaydir.getChildAt(0).getHeight() <= kaydir.getHeight() + dp(4));
                        // Aşağı çekme + liste en tepede/taşmıyor → kapatma sürüklemesi.
                        if (!surukleDevralindi && dy > dp(12) && dy > dx * 1.5f
                                && (listeKisa || kaydir.getScrollY() <= 0)) {
                            surukleDevralindi = true;
                            surukleBasY[0] = ev.getRawY() - getTranslationY();
                            surukleBasT[0] = android.os.SystemClock.uptimeMillis();
                            return true; // sonraki olaylar kolon'un listener'ına gider
                        }
                        return false;
                    }
                    case android.view.MotionEvent.ACTION_UP:
                    case android.view.MotionEvent.ACTION_CANCEL:
                        surukleDevralindi = false;
                        return false;
                    default:
                        return false;
                }
            }
        };
        kolon.setOrientation(android.widget.LinearLayout.VERTICAL);
        android.graphics.drawable.GradientDrawable zemin = new android.graphics.drawable.GradientDrawable();
        zemin.setColor(0xF2121216);
        zemin.setCornerRadii(new float[]{dp(22), dp(22), dp(22), dp(22), 0, 0, 0, 0});
        kolon.setBackground(zemin);

        // Sürükleme tutamağı
        android.widget.FrameLayout tutamacCepe = new android.widget.FrameLayout(activity);
        View tutamac = new View(activity);
        android.graphics.drawable.GradientDrawable tArka = new android.graphics.drawable.GradientDrawable();
        tArka.setColor(0x4DFFFFFF);
        tArka.setCornerRadius(dp(2));
        tutamac.setBackground(tArka);
        FrameLayout.LayoutParams tLp = new FrameLayout.LayoutParams(dp(40), dp(4));
        tLp.gravity = android.view.Gravity.CENTER_HORIZONTAL;
        tLp.topMargin = dp(10);
        tutamacCepe.addView(tutamac, tLp);
        kolon.addView(tutamacCepe, new android.widget.LinearLayout.LayoutParams(-1, -2));

        android.widget.LinearLayout basSatir = new android.widget.LinearLayout(activity);
        basSatir.setOrientation(android.widget.LinearLayout.HORIZONTAL);
        basSatir.setGravity(android.view.Gravity.CENTER_VERTICAL);
        basSatir.setPadding(dp(24), dp(12), dp(14), dp(14));
        android.widget.TextView bas = new android.widget.TextView(activity);
        bas.setText(baslik);
        bas.setTextColor(0xFFFFFFFF);
        bas.setTextSize(16);
        bas.setTypeface(yazi(1f));
        android.widget.LinearLayout.LayoutParams basLp = new android.widget.LinearLayout.LayoutParams(
                0, -2, 1f);
        basSatir.addView(bas, basLp);
        // Çarpı (kullanıcı 2026-10-28: "bari açılan pencerelere çarpı ekle").
        android.widget.TextView carp = new android.widget.TextView(activity);
        carp.setText("✕");
        carp.setTextColor(0xB3FFFFFF);
        carp.setTextSize(17);
        carp.setGravity(android.view.Gravity.CENTER);
        int carpCep = dp(38);
        android.graphics.drawable.GradientDrawable carpArka = new android.graphics.drawable.GradientDrawable();
        carpArka.setColor(0x26FFFFFF);
        carpArka.setCornerRadius(dp(19));
        carp.setBackground(carpArka);
        carp.setOnClickListener(v -> { try { d.dismiss(); } catch (Exception ignored) {} });
        basSatir.addView(carp, new android.widget.LinearLayout.LayoutParams(carpCep, carpCep));
        kolon.addView(basSatir);
        View bolme = new View(activity);
        bolme.setBackgroundColor(0x1AFFFFFF);
        kolon.addView(bolme, new android.widget.LinearLayout.LayoutParams(-1, dp(1)));

        android.widget.LinearLayout satirKolon = new android.widget.LinearLayout(activity);
        satirKolon.setOrientation(android.widget.LinearLayout.VERTICAL);
        satirKolon.setPadding(dp(10), dp(6), dp(10), dp(14));
        android.util.TypedValue ripple = new android.util.TypedValue();
        activity.getTheme().resolveAttribute(android.R.attr.selectableItemBackground, ripple, true);
        final int limeYumusak = (LIME & 0x00FFFFFF) | 0x1F000000; // seçili satır zemini
        final int limeHalka = (LIME & 0x00FFFFFF) | 0x33000000;   // tik çevresi halka
        for (Satir st : satirlar) {
            if (st.bolum) {
                // Bölüm etiketi: küçük, harf aralıklı, soluk — listeyi gruplar
                // (kullanıcı 2026-10-29: "altyazı görünümü daha görsel olsun").
                android.widget.TextView et = new android.widget.TextView(activity);
                et.setText(st.ad.toUpperCase(java.util.Locale.getDefault()));
                et.setTextColor(0x8CFFFFFF);
                et.setTextSize(11);
                et.setLetterSpacing(0.14f);
                et.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
                et.setPadding(dp(16), dp(14), dp(16), dp(6));
                satirKolon.addView(et, new android.widget.LinearLayout.LayoutParams(-1, -2));
                continue;
            }
            android.widget.LinearLayout satir = new android.widget.LinearLayout(activity);
            satir.setOrientation(android.widget.LinearLayout.HORIZONTAL);
            satir.setGravity(android.view.Gravity.CENTER_VERTICAL);
            satir.setPadding(dp(16), dp(14), dp(14), dp(14));
            android.widget.LinearLayout.LayoutParams slp = new android.widget.LinearLayout.LayoutParams(
                    -1, -2);
            slp.topMargin = dp(2); slp.bottomMargin = dp(2);
            if (st.secili && !st.pasif) {
                // Seçili satır: yumuşak lime kart + kalın ad (Netflix/Roka seçili
                // satır dili — tek başına ✓ yetmiyordu, kullanıcı 2026-10-29).
                android.graphics.drawable.GradientDrawable secZemin
                        = new android.graphics.drawable.GradientDrawable();
                secZemin.setColor(limeYumusak);
                secZemin.setCornerRadius(dp(14));
                secZemin.setStroke(dp(1), (LIME & 0x00FFFFFF) | 0x40000000);
                satir.setBackground(secZemin);
            } else if (!st.pasif) {
                satir.setBackgroundResource(ripple.resourceId);
                // Kart okunurluğu: ripple'ı köşeli bırakmak taşıyor — radii yok
                // (Platform ripple kendi maskesini kullanır, sorun değil).
            }
            satir.setClickable(!st.pasif);
            android.widget.TextView ad = new android.widget.TextView(activity);
            ad.setText(st.ad);
            ad.setTextColor(st.pasif ? 0x66FFFFFF : 0xF2FFFFFF);
            ad.setTextSize(15);
            if (st.secili) ad.setTypeface(yazi(1f));
            android.widget.LinearLayout.LayoutParams adLp = new android.widget.LinearLayout.LayoutParams(
                    0, -2, 1f);
            adLp.leftMargin = dp(6);
            adLp.rightMargin = dp(12);
            satir.addView(ad, adLp);
            // Görsel önizleme: serbest View (oran şeması/hız barı) öncelikli,
            // değilse altyazı stili maketi (kullanıcı 2026-10-28: görsel tasarım).
            if (st.onizlemeView != null) {
                // View kendi LayoutParams'ını taşıyorsa (sabit ölçü + margin) o
                // kullanılır; -2,-2 üretmek ölçüyü bozar.
                if (st.onizlemeView.getLayoutParams() != null) satir.addView(st.onizlemeView);
                else {
                    android.widget.LinearLayout.LayoutParams ozLp
                            = new android.widget.LinearLayout.LayoutParams(-2, -2);
                    ozLp.rightMargin = dp(12);
                    satir.addView(st.onizlemeView, ozLp);
                }
            } else if (st.onizlemeStil >= 0) {
                android.widget.TextView onz = new android.widget.TextView(activity);
                onz.setText("AaBb 123");
                onz.setTextSize(10f * (st.onizlemeBoyut > 0f ? st.onizlemeBoyut : 1f));
                onz.setTextColor(st.onizlemeStil == 2 ? 0xFFFFFF00 : 0xFFFFFFFF);
                if (st.onizlemeStil == 3) {
                    onz.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
                    onz.setShadowLayer(dp(2.5f), 0f, 0f, 0xFF000000);
                } else {
                    android.graphics.drawable.GradientDrawable ark
                            = new android.graphics.drawable.GradientDrawable();
                    ark.setColor(0xCC000000);
                    ark.setCornerRadius(dp(4));
                    onz.setBackground(ark);
                }
                onz.setPadding(dp(8), dp(3), dp(8), dp(4));
                android.widget.LinearLayout.LayoutParams ozLp
                        = new android.widget.LinearLayout.LayoutParams(-2, -2);
                ozLp.rightMargin = dp(10);
                satir.addView(onz, ozLp);
            }
            if (st.secili) {
                // Tik: lime halka içinde ✓ — çıplak glifden çok daha okunur.
                android.widget.TextView tik = new android.widget.TextView(activity);
                tik.setText("✓");
                tik.setTextColor(LIME);
                tik.setTextSize(13);
                tik.setGravity(android.view.Gravity.CENTER);
                tik.setTypeface(yazi(1f));
                android.graphics.drawable.GradientDrawable halka
                        = new android.graphics.drawable.GradientDrawable();
                halka.setShape(android.graphics.drawable.GradientDrawable.OVAL);
                halka.setColor(limeHalka);
                halka.setStroke(dp(1), (LIME & 0x00FFFFFF) | 0x66000000);
                tik.setBackground(halka);
                int cap = dp(26);
                satir.addView(tik, new android.widget.LinearLayout.LayoutParams(cap, cap));
            }
            if (!st.pasif) {
                satir.setOnClickListener(v -> {
                    android.app.Dialog sheet = aktifSheet;
                    try { if (sheet != null) sheet.dismiss(); } catch (Exception ignored) {}
                    if (st.is != null) st.is.run();
                });
            }
            satirKolon.addView(satir, slp);
        }
        kaydir.addView(satirKolon);
        kolon.addView(kaydir);

        d.setContentView(kolon, new ViewGroup.LayoutParams(-1, -2));
        android.view.Window w = d.getWindow();
        if (w != null) {
            w.setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            w.setGravity(android.view.Gravity.BOTTOM);
            w.addFlags(android.view.WindowManager.LayoutParams.FLAG_DIM_BEHIND);
            android.view.WindowManager.LayoutParams lp = w.getAttributes();
            lp.dimAmount = 0.6f;
            w.setAttributes(lp);
            w.setWindowAnimations(R.style.CpSheetAnim);
        }
        d.setCanceledOnTouchOutside(true);
        d.setOnDismissListener(di -> {
            aktifSheet = null;
            chromeGoster();
        });
        // Sürükleme listener'ı: intercept devraldığında VEYA tutamaç/başlık
        // bölgesinden doğrudan sürüklenildiğinde paneli aşağı çeker.
        kolon.setOnTouchListener((v, ev) -> {
            switch (ev.getActionMasked()) {
                case android.view.MotionEvent.ACTION_DOWN:
                    surukleBasY[0] = ev.getRawY();
                    surukleBasT[0] = android.os.SystemClock.uptimeMillis();
                    return false;
                case android.view.MotionEvent.ACTION_MOVE:
                    if (surukleBasY[0] >= 0) {
                        float dy = ev.getRawY() - surukleBasY[0];
                        if (dy > 0) kolon.setTranslationY(dy);
                    }
                    return false;
                case android.view.MotionEvent.ACTION_UP:
                case android.view.MotionEvent.ACTION_CANCEL: {
                    float dy = surukleBasY[0] >= 0 ? ev.getRawY() - surukleBasY[0] : 0f;
                    long sure = surukleBasT[0] > 0
                            ? android.os.SystemClock.uptimeMillis() - surukleBasT[0] : 9999L;
                    surukleBasY[0] = -1f;
                    surukleBasT[0] = 0L;
                    // Eşik 64dp + hızlı savurma (260ms'den kısa flick) — parmak
                    // hareketi çoğu zaman uzun mesafe değildir (kullanıcı 2026-10-28).
                    if (dy > dp(64) || (sure < 260L && dy > dp(24))) {
                        kolon.setTranslationY(0f);
                        try { d.dismiss(); } catch (Exception ignored) {}
                    } else kolon.animate().translationY(0f).setDuration(140).start();
                    return false;
                }
                default:
                    return false;
            }
        });
        aktifSheet = d;
        // Panel yüksekliğini gösterim sonrası kırp (uzun listeler ekranı taşmasın).
        try {
            d.show();
            if (w != null) {
                int maxHeight = (int) (activity.getResources().getDisplayMetrics().heightPixels * 0.62f);
                if (kolon.getHeight() > maxHeight) {
                    android.view.ViewGroup.LayoutParams kp = kolon.getLayoutParams();
                    kp.height = maxHeight;
                    kolon.setLayoutParams(kp);
                }
            }
        } catch (Exception ignored) { aktifSheet = null; }
    }

    /** Kayıtlı tercihleri aktif oynatıcıya uygular (her play'de çağrılır). */
    private void oyuniciAyarlariUygula() {
        if (playerView == null) return;
        int oran = tercihInt("oran", 0);
        if (oran >= 0 && oran < ORAN_MODLERI.length) playerView.setResizeMode(ORAN_MODLERI[oran]);
        androidx.media3.ui.SubtitleView sv = playerView.getSubtitleView();
        if (sv == null) return;
        // Altyazı ekranın Ham kenarına gömülmesin (ölçüldü 2026-10-28: yarısı
        // ekran dışına taşıyordu): yan 24dp, alt 40dp boşluk.
        sv.setPadding(dp(24), dp(24), dp(24), dp(40));
        int bIdx = tercihInt("altyazi_boyut", 1);
        if (bIdx >= 0 && bIdx < BOYUT_CARPANLARI.length) {
            sv.setFractionalTextSize(androidx.media3.ui.SubtitleView.DEFAULT_TEXT_SIZE_FRACTION * BOYUT_CARPANLARI[bIdx]);
        }
        int stil = tercihInt("altyazi_stil", 0);
        if (stil == 0) {
            sv.setApplyEmbeddedStyles(true);
            sv.setStyle(androidx.media3.ui.CaptionStyleCompat.DEFAULT);
        } else {
            // Gömülü stiller seçimi ezmesin (ör. sarı kutu üstüne beyaz kutu basmasın).
            sv.setApplyEmbeddedStyles(false);
            androidx.media3.ui.CaptionStyleCompat s;
            if (stil == 1) s = new androidx.media3.ui.CaptionStyleCompat(0xFFFFFFFF, 0xCC000000, 0x00000000,
                    androidx.media3.ui.CaptionStyleCompat.EDGE_TYPE_NONE, 0, null);
            else if (stil == 2) s = new androidx.media3.ui.CaptionStyleCompat(0xFFFFFF00, 0xCC000000, 0x00000000,
                    androidx.media3.ui.CaptionStyleCompat.EDGE_TYPE_NONE, 0, null);
            else s = new androidx.media3.ui.CaptionStyleCompat(0xFFFFFFFF, 0x00000000, 0x00000000,
                    androidx.media3.ui.CaptionStyleCompat.EDGE_TYPE_OUTLINE, 0xFF000000, null);
            sv.setStyle(s);
        }
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
    private java.util.List<MediaItem.SubtitleConfiguration> altyaziKaynaklari(String json) {
        java.util.List<MediaItem.SubtitleConfiguration> liste = new java.util.ArrayList<>();
        if (json == null || json.trim().isEmpty() || json.length() > 4_000_000) return liste;
        try {
            org.json.JSONArray dizi = new org.json.JSONArray(json);
            java.io.File dizin = activity.getCacheDir();
            for (int i = 0; i < dizi.length() && i < 3; i++) {
                org.json.JSONObject oge = dizi.optJSONObject(i);
                if (oge == null) continue;
                String vtt = oge.optString("vtt", "");
                if (vtt.isEmpty()) continue;
                // VTT cue ayarları (line:/region:/position:) bazı sitelerde altyazıyı
                // EKRANIN ÜSTÜNE çıkarıyordu (kullanıcı 2026-10-28): zaman damgasından
                // sonraki tüm ayarlar silinir → altyazı varsayılan alt-orta konumda.
                vtt = vtt.replaceAll("(?m)(-->\\s*(?:\\d{2}:)?\\d{2}:\\d{2}[.,]\\d{3}).*", "$1");
                java.io.File dosya = new java.io.File(dizin, "cp_altyazi_" + i + ".vtt");
                try (java.io.OutputStreamWriter yazici = new java.io.OutputStreamWriter(
                        new java.io.FileOutputStream(dosya), java.nio.charset.StandardCharsets.UTF_8)) {
                    yazici.write(vtt);
                }
                String dil = oge.optString("dil", "");
                // Alt yazı adresi YEREL AĞ GEÇİDİNDEN (http) verilir: oynatıcı
                // fabrikası yalnız http şemasını çözüyor; file:// doğrudan
                // "FileURLConnection cannot be cast" çökmesi üretiyordu (2026-10-25).
                String koken = activity.mediaGatewayOrigin();
                android.net.Uri altyaziAdresi = koken != null
                        ? android.net.Uri.parse(koken + "/api/altyazi/" + dosya.getName())
                        : android.net.Uri.fromFile(dosya);
                MediaItem.SubtitleConfiguration yapilandirma = new MediaItem.SubtitleConfiguration.Builder(
                        altyaziAdresi)
                        .setMimeType(MimeTypes.TEXT_VTT)
                        .setLabel(oge.optString("etiket", "Altyazı"))
                        .setLanguage(dil.isEmpty() ? null : dil)
                        .setSelectionFlags(androidx.media3.common.C.SELECTION_FLAG_DEFAULT)
                        .build();
                liste.add(yapilandirma);
                // JS etiketi native Format'a her zaman ulaşmıyor ("Altyazı 1"
                // kökü) — isimleri burada tut, adVer siteden okusun (2026-10-28).
                senkEtiketler.add(oge.optString("etiket", ""));
                senkDiller.add(dil);
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
