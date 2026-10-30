package com.cinepulse.studio;

import android.os.Handler;
import android.os.Looper;
import android.webkit.JavascriptInterface;

import java.io.File;
import java.io.PipedInputStream;
import java.io.PipedOutputStream;
import java.io.RandomAccessFile;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import fi.iki.elonen.NanoHTTPD;
import org.libtorrent4j.AlertListener;
import org.libtorrent4j.swig.torrent_flags_t;
import org.libtorrent4j.Priority;
import org.libtorrent4j.Sha1Hash;
import org.libtorrent4j.SessionManager;
import org.libtorrent4j.TorrentHandle;
import org.libtorrent4j.TorrentInfo;
import org.libtorrent4j.TorrentStatus;
import org.libtorrent4j.alerts.Alert;
import org.libtorrent4j.alerts.FileErrorAlert;
import org.libtorrent4j.alerts.MetadataReceivedAlert;
import org.libtorrent4j.alerts.TorrentErrorAlert;

/* ==========================================================================
   CinePulse — yerel torrent motoru köprüsü (gömülü servis modeli)
   --------------------------------------------------------------------------
   Torrent yayınını, uygulamasına gömülü GERÇEK bir BitTorrent
   motoruyla oynatır (UDP/DHT/peers — tarayıcının WebRTC'si değil). Burada
   aynı işi libtorrent4j yapar: magnet seansa eklenir, metadata gelince
   hedef dosya seçilir, indirme sıralı moda alınır ve dosya 127.0.0.1
   üzerindeki NanoHTTPD sunucusundan HTTP-Range ile parça parça sunulur.
   Okuyucu, istenen baytların parçaları diske inene kadar havePiece ile
   bekler ve setPieceDeadline ile öncelikler — oynatıcı "buffering" görür,
   parça inince oynatmaya devam eder. Yalnızca arm64 paketlidir; diğer
   ABI'lerde JS tarafı WebTorrent yedeğine düşer.
   ========================================================================== */

public final class TorrentBridge {

    private static final Pattern BTIH = Pattern.compile("urn:btih:([0-9a-fA-F]{40})");
    /* Base32 btih (bazı takipçiler 32 karakter üretir): 6b17d… → 40 hex.
       6a genişletmesi (kullanıcı 2026-10-28): yapıştırılan magnet linkleri de
       listeye girebilsin — hangi yazım gelirse gelsin kabul edilir. */
    private static final Pattern BTIH32 = Pattern.compile("urn:btih:([0-9A-Za-z]{32})(?![0-9A-Za-z])");
    private static final Pattern FI = Pattern.compile("[?&]fi=(\\d+)");
    /* Zincir log etiketi (madde 6a, kullanıcı 2026-10-28): magnet → motor →
       127.0.0.1 → NativePlayerView aynı etiketle izlenir. Eski etiket:
       CPTorrent (loglar artık hep burada toplansın diye değiştirildi). */
    static final String TAG = "CinePulseTorrent";
    /* Yanıt dilimi: küçük dilim = ilk kare daha çabuk (yalnız o dilimin
       parçaları beklenir) + Android'de güvenli tahsis. */
    private static final long DILIM = 8L * 1024 * 1024;
    /* Watchdog eşikleri (madde 6a hata kodları için): metadata bu kadar
       saniyede gelmezse 'timeout'; bu kadar saniye boyunca tek peer görülmezse
       'no-peers' bildirilir (JS okunabilir toast gösterir — ölü sessizlik yok). */
    private static final long TIMEOUT_SN = 120;
    private static final long NO_PEERS_SN = 45;

    private final MainActivity ctx;
    private final Handler ui = new Handler(Looper.getMainLooper());
    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private final Map<String, Job> jobs = new HashMap<>();

    private SessionManager session;

    TorrentBridge(MainActivity ctx) {
        this.ctx = ctx;
    }

    /* JS olay kanalı: window.__cpTorrentOlay(jsonString) */
    private void olay(String json) {
        // Teşhis: motorun ne dediği logcat'te de görünsün (6a zincir etiketi).
        try { android.util.Log.i(TAG, "olay: " + json); } catch (Throwable ignored) {}
        ui.post(() -> {
            try {
                android.webkit.WebView wv = ctx.torrentWebView();
                if (wv != null) {
                    wv.evaluateJavascript(
                        "window.__cpTorrentOlay && window.__cpTorrentOlay("
                            + org.json.JSONObject.quote(json) + ");", null);
                }
            } catch (Exception ignored) {
            }
        });
    }

    private static final class Job {
        String id;
        String hex;
        int fileIdx = -1;
        TorrentHandle th;
        TorrentInfo ti;
        int file;
        String path;
        long size;
        String name;
        Server server;
        Runnable statRunnable;
        // 6a: magnetOynat(true) ile açıldıysa 'yayinda' URL'i native oynatıcıya
        // kendimiz veririz (JS köprüsü olmadan da çalar).
        boolean otomatikOynat;
        // Watchdog'lar (timeout / no-peers) — metadata gelince iptal edilir.
        Runnable zamanAsimiBekci;
        Runnable peersizBekci;
        // 6b: seek algılama — son servis edilen baytın devamı istenmiyorsa
        // kullanıcı sarıyor demektir; logla ve hedef pencereyi önceliklendir.
        long beklenenSonraki = -1;
    }

    /* ── JS arayüzü ─────────────────────────────────────────────────────── */

    @JavascriptInterface
    public boolean isAvailable() {
        return true;
    }

    /* ── madde 6a/6b genişleme: doğrudan magnet girişi (kullanıcı 2026-10-28) ──
       JS (torrentYerel.js) window.CinePulsePlayer.magnetOynat(magnet, true) ile
       çağırır; buraya senkron karar döner:
         {"durum":"kabul"}                          → akış sonucu olay kanalından:
             {"durum":"yayinda","url","ad","boyut"}  → 127.0.0.1 HTTP URL (sözleşme aynı)
             {"durum":"hata","kod","mesaj"}          → kod: unsupported | timeout | no-peers
         {"durum":"reddedildi","kod":"unsupported"}  → magnet biçimi çözülemedi
       Sözleşme değişikliği YOK: JS yine aynı 127.0.0.1:port URL'i görür ve
       NativePlayerView.play aynı yoldan çağrılır (otomatikOynat=true ise Java
       tarafı kendisi çalar). */
    String magnetKabulEt(String magnet, boolean otomatikOynat) {
        String m = magnet == null ? "" : magnet.trim();
        String hex = btihHex(m);
        if (hex == null) {
            android.util.Log.w(TAG, "magnet reddedildi: biçim çözülemedi: " + kisa(m));
            olay("{\"durum\":\"hata\",\"kod\":\"unsupported\",\"mesaj\":\"Magnet bağlantısı çözülemedi.\"}");
            return "{\"durum\":\"reddedildi\",\"kod\":\"unsupported\"}";
        }
        android.util.Log.i(TAG, "magnet kabul (btih=" + hex.substring(0, 10) + "… otomatik=" + otomatikOynat + ")");
        sonrakiOtomatikOynat = otomatikOynat;
        start(m, -1);
        return "{\"durum\":\"kabul\"}";
    }

    private volatile boolean sonrakiOtomatikOynat = false;

    /* btih'yi 40'lık hex'e çevirir: 40-hex doğrudan, 32-base32 çözülür;
       hiçbiri yoksa null (→ 'unsupported'). */
    private static String btihHex(String magnet) {
        Matcher h = BTIH.matcher(magnet);
        if (h.find()) return h.group(1).toLowerCase();
        Matcher b = BTIH32.matcher(magnet);
        if (!b.find()) return null;
        final String ALFABE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        String s = b.group(1).toUpperCase();
        // 32 base32 karakter = 160 bit = 20 bayt = 40 hex rakamı.
        try {
            int birikim = 0, bitSay = 0;
            StringBuilder hex = new StringBuilder(40);
            java.io.ByteArrayOutputStream baytlar = new java.io.ByteArrayOutputStream(20);
            for (int i = 0; i < s.length(); i++) {
                int d = ALFABE.indexOf(s.charAt(i));
                if (d < 0) return null;
                birikim = (birikim << 5) | d;
                bitSay += 5;
                if (bitSay >= 8) {
                    baytlar.write((birikim >> (bitSay - 8)) & 0xFF);
                    bitSay -= 8;
                }
            }
            byte[] ham = baytlar.toByteArray();
            if (ham.length != 20) return null;
            for (byte x : ham) hex.append(String.format("%02x", x));
            return hex.toString();
        } catch (Exception e) {
            return null;
        }
    }

    private static String kisa(String s) {
        s = String.valueOf(s);
        return s.length() > 90 ? s.substring(0, 90) + "…" : s;
    }

    @JavascriptInterface
    public void start(String magnet, int fileIdx) {
        String m = magnet == null ? "" : magnet.trim();
        String hex = btihHex(m);
        if (hex == null) {
            android.util.Log.w(TAG, "start reddedildi: btih çözülemedi: " + kisa(m));
            olay("{\"durum\":\"hata\",\"kod\":\"unsupported\",\"mesaj\":\"Torrent kimliği çözülemedi.\"}");
            return;
        }
        final String hexS = hex;
        Matcher fi = FI.matcher(m);
        final int fidx = fileIdx >= 0 ? fileIdx
                : (fi.find() ? Integer.parseInt(fi.group(1)) : -1);
        final boolean otomatik = sonrakiOtomatikOynat;
        sonrakiOtomatikOynat = false;
        android.util.Log.i(TAG, "start: btih=" + hexS.substring(0, 10) + "… fileIdx=" + fidx
                + " izleyici=" + (m.contains("&tr=") || m.contains("&tr%3D") ? "var" : "yok")
                + " dht=" + (m.contains("&dn=") ? "ipucu-var" : "-") + " otomatik=" + otomatik);
        executor.execute(() -> {
            try {
                hepsiniDurdur(); // aynı anda tek yayın
                ensureSession();
                File dir = new File(ctx.getCodeCacheDir(), "torrent");
                //noinspection ResultOfMethodCallIgnored
                dir.mkdirs();
                session.download(m, dir, new torrent_flags_t());
                session.startDht();
                // Handle asenkron eklenir; kısa süre bulunana kadar dene.
                Job job = new Job();
                job.id = hexS;
                job.hex = hexS;
                job.fileIdx = fidx;
                job.otomatikOynat = otomatik;
                Sha1Hash h = Sha1Hash.parseHex(hexS);
                for (int i = 0; i < 40 && job.th == null; i++) {
                    job.th = session.find(h);
                    if (job.th == null) Thread.sleep(250);
                }
                if (job.th == null) {
                    android.util.Log.e(TAG, "seansa ekleme BAŞARISIZ (10 sn): " + hexS.substring(0, 10));
                    olay("{\"durum\":\"hata\",\"kod\":\"unsupported\",\"mesaj\":\"Torrent seansa eklenemedi.\"}");
                    return;
                }
                android.util.Log.i(TAG, "handle alındı: " + hexS.substring(0, 10) + " — metadata bekleniyor");
                jobs.put(hexS, job);
                bekciKur(job);
                // Metadata zaten geldiyse (kuyruklu tekrar) alert'i kaçırmış olabiliriz.
                TorrentStatus st = job.th.status();
                if (st != null && st.hasMetadata()) metadataHazir(job);
            } catch (Throwable t) {
                android.util.Log.e(TAG, "motor başlatılamadı", t);
                olay("{\"durum\":\"hata\",\"kod\":\"unsupported\",\"mesaj\":\"Motor başlatılamadı: "
                        + String.valueOf(t.getMessage()).replace("\"", "'") + "\"}");
            }
        });
    }

    /* 6a bekçileri: 'timeout' ve 'no-peers' net hata kodu olarak JS'ye ulaşır;
       bugün zincirin SESSİZ ölmesi başlı başına hataydı (kullanıcı 2026-10-28). */
    private void bekciKur(final Job job) {
        job.zamanAsimiBekci = () -> {
            try {
                boolean metadataYok = job.ti == null;
                if (metadataYok) {
                    android.util.Log.w(TAG, "WATCHDOG timeout: " + TIMEOUT_SN + "sn'de metadata yok peer="
                            + peerSay(job));
                    olay("{\"durum\":\"hata\",\"kod\":\"timeout\",\"mesaj\":\"Torrent metadata "
                            + TIMEOUT_SN + " sn içinde gelemedi (ağ/peyer yavaş).\"}");
                }
            } catch (Exception ignored) {}
        };
        job.peersizBekci = () -> {
            try {
                int p = peerSay(job);
                if (p == 0) {
                    android.util.Log.w(TAG, "WATCHDOG no-peers: " + NO_PEERS_SN + "sn'de 0 peyer");
                    olay("{\"durum\":\"hata\",\"kod\":\"no-peers\",\"mesaj\":\"Bu yayına "
                            + NO_PEERS_SN + " sn boyunca hiç peyer bulunamadı.\"}");
                }
            } catch (Exception ignored) {}
        };
        ui.postDelayed(job.peersizBekci, NO_PEERS_SN * 1000L);
        ui.postDelayed(job.zamanAsimiBekci, TIMEOUT_SN * 1000L);
    }

    private static int peerSay(Job job) {
        try { return job.th != null && job.th.isValid() ? job.th.status().numPeers() : -1; }
        catch (Exception e) { return -1; }
    }

    @JavascriptInterface
    public void stop() {
        executor.execute(this::hepsiniDurdur);
    }

    void close() {
        // stop() ~1 sn bloklar (native seans yıkımı) — UI thread'inde çağrılmaz.
        new Thread(() -> {
            try {
                hepsiniDurdur();
                if (session != null) session.stop();
            } catch (Exception ignored) {
            }
        }).start();
    }

    /* ── seans + alert'lar ──────────────────────────────────────────────── */

    private void ensureSession() {
        if (session != null) return;
        session = new SessionManager();
        // start() çağrılmadan session nesresi yoktur; download() sessizce düşer.
        session.start();
        // 6a envanter (kullanıcı 2026-10-28): bilinçli olarak HİÇ settings_pack
        // uygulanmıyor — connections_limit, active_downloads, enable_upnp/
        // natpmp/lsd/dht, auto_sequential, request_queue_time vb. libtorrent
        // VARSAYILANLARINDA. Ayar kolu: session.applySettings(SettingsPack)
        // (SessionManager javap'ta doğrulandı). Stremio ölçümüyle kıyaslama
        // için parametre DEĞİŞTİRİLMEDİ.
        android.util.Log.i(TAG, "oturum başladı (libtorrent4j 2.1.0-39, saf varsayılanlar)");
        session.addListener(new AlertListener() {
            @Override public int[] types() { return null; } // tüm alert'lar
            @Override public void alert(Alert<?> a) {
                try {
                    if (a instanceof MetadataReceivedAlert) {
                        TorrentHandle th = ((MetadataReceivedAlert) a).handle();
                        Job job = jobByHandle(th);
                        if (job != null) executor.execute(() -> metadataHazir(job));
                    } else if (a instanceof TorrentErrorAlert || a instanceof FileErrorAlert) {
                        // ÖLÇÜLEN HATA (2026-10-27): kullanıcı ikinci torrent
                        // satırına basınca birinci iş kaldırılır ve libtorrent
                        // o KALDIRILAN torrent için error alert'i basar. JS bunu
                        // yeni denemenin hatası sanıp hemen normal kaynağa
                        // düşüyordu ("ikinci hiç açılmıyor"). Yalnız güncel
                        // (jobs içindeki) işin hatası bildirilir.
                        Job jb = null;
                        try {
                            TorrentHandle eh = (a instanceof TorrentErrorAlert)
                                    ? ((TorrentErrorAlert) a).handle() : ((FileErrorAlert) a).handle();
                            jb = jobByHandle(eh);
                        } catch (Exception ignored) {}
                        if (jb != null) {
                            android.util.Log.w(TAG, "motor hata alert'i: " + a.category() + " " + a.message());
                            olay("{\"durum\":\"hata\",\"kod\":\"motor-hatasi\",\"mesaj\":\"Torrent bağlantısında hata oluştu.\"}");
                        }
                    }
                } catch (Exception ignored) {
                }
            }
        });
    }

    private Job jobByHandle(TorrentHandle th) {
        try {
            if (th == null || !th.isValid()) return null;
            String hex = th.infoHash().toHex().toLowerCase();
            synchronized (jobs) { return jobs.get(hex); }
        } catch (Exception e) {
            return null;
        }
    }

    /* Metadata geldi: hedef dosyayı seç, sıralı indirmeyi başlat, sunucuyu aç. */
    private void metadataHazir(Job job) {
        try {
            TorrentInfo ti = job.th.torrentFile();
            if (ti == null) return;
            int idx = job.fileIdx;
            if (idx < 0 || idx >= ti.numFiles()) {
                idx = 0;
                long en = -1;
                for (int i = 0; i < ti.numFiles(); i++) {
                    long s = ti.files().fileSize(i);
                    if (s > en && !ti.files().padFileAt(i)) { en = s; idx = i; }
                }
            }
            job.ti = ti;
            job.file = idx;
            job.size = ti.files().fileSize(idx);
            job.name = ti.files().fileName(idx);
            job.path = ti.files().filePath(idx, job.th.savePath());
            // Hedef dışı dosyalar indirilmez; hedef dosyada OYNATICI usulü
            // öncelik kurulur (aşağıdaki baş+son parça bloğu). ExoPlayer mkv'nin
            // başına (EBML) ve Cues'a (mkv metadata — genellikle dosya SONUNDA)
            // uzanır. Stremio farkı buydu: setSequentialRange(0) baştan-dolduran modla
            // sona istenen parçalar öncelik alamıyor, ExoPlayer 00:00'da
            // asılı kalıyor ve bekçi/failover motoru öldürüyor (ölçüldü
            // 2026-10-26: '+36 sn'de invalid-handle'). Önce İLK 3 ve SON 3
            // parçaya üst öncelik; ortadaki parçaları sunucu
            // setPieceDeadline ile talepte getirir.
            for (int i = 0; i < ti.numFiles(); i++) {
                job.th.filePriority(i, i == idx ? Priority.TOP_PRIORITY : Priority.IGNORE);
            }
            try {
                final int plen = Math.max(1, ti.files().pieceLength());
                final long ofset = ti.files().fileOffset(job.file);
                final long bitir = ofset + ti.files().fileSize(idx) - 1;
                final int toplamParca = ti.numPieces();
                final int sonParca = Math.min(toplamParca - 1, (int) (bitir / plen));
                final int ilkSon = Math.min(2, toplamParca - 1);
                for (int p = 0; p <= ilkSon; p++) job.th.piecePriority(p, Priority.TOP_PRIORITY);
                for (int p = Math.max(0, sonParca - 2); p <= sonParca; p++) job.th.piecePriority(p, Priority.TOP_PRIORITY);
            } catch (Exception ignore) { /* öncelik kurulamazsa eski davranış: istek bazlı */ }
            job.server = new Server(job);
            job.server.start(0);
            String url = "http://127.0.0.1:" + job.server.getListeningPort() + "/f";
            // Metadata geldi: watchdog'lar artık gereksiz.
            try {
                if (job.zamanAsimiBekci != null) ui.removeCallbacks(job.zamanAsimiBekci);
                if (job.peersizBekci != null) ui.removeCallbacks(job.peersizBekci);
            } catch (Exception ignored) {}
            // 6a zincir logu: hedef dosya + sunucu adresi görünür olsun.
            android.util.Log.i(TAG, "metadata hazır: ad=" + job.name + " boyut=" + job.size
                    + " parcaBoy=" + job.ti.files().pieceLength()
                    + " parcaSay=" + job.ti.numPieces() + " fileIdx=" + idx
                    + " url=" + url);
            olay("{\"durum\":\"yayinda\",\"url\":\"" + url + "\",\"ad\":\""
                    + esc(job.name) + "\",\"boyut\":" + job.size + "}");
            // 6a genişleme: magnetOynat(magnet, true) ile açılan iş — JS beklenmeden
            // native oynatıcıya verilir (sözleşme aynı: NativePlayerView.play).
            if (job.otomatikOynat) {
                final String ad = job.name;
                ui.post(() -> { try { ctx.nativeYerelOynat(url, ad); } catch (Exception ignored) {} });
            }
            // Periyodik canlı durum: hız/peer/ilerleme (arayüz "kaç KB/s" göstersin).
            job.statRunnable = new Runnable() {
                @Override public void run() {
                    try {
                        TorrentStatus st = job.th.status();
                        boolean p0 = job.ti != null && job.ti.numPieces() > 0 && job.th.havePiece(0);
                        boolean pN = job.ti != null && job.ti.numPieces() > 0 && job.th.havePiece(job.ti.numPieces() - 1);
                        olay("{\"durum\":\"durum\",\"hb\":" + st.downloadPayloadRate() / 1024
                                + ",\"peer\":" + st.numPeers()
                                + ",\"ilerle\":" + Math.round(st.progress() * 100)
                                + ",\"p0\":" + (p0 ? 1 : 0) + ",\"pN\":" + (pN ? 1 : 0) + "}");
                        if (jobs.containsKey(job.hex)) ui.postDelayed(this, 4000);
                    } catch (Exception ignored) {
                    }
                }
            };
            ui.postDelayed(job.statRunnable, 4000);
        } catch (Exception e) {
            android.util.Log.e(TAG, "dosya hazırlanamadı", e);
            olay("{\"durum\":\"hata\",\"kod\":\"motor-hatasi\",\"mesaj\":\"Dosya hazırlanamadı.\"}");
        }
    }

    /* ── yerel yayın sunucusu (yalnız 127.0.0.1) ────────────────────────── */

    private final class Server extends NanoHTTPD {
        private final Job job;
        Server(Job job) {
            super("127.0.0.1", 0);
            this.job = job;
        }
        @Override
        public Response serve(IHTTPSession sess) {
            try {
                // OOM dersi (2026-10-25, ölçülen çökme): Range'siz istek gelirse
                // dosyanın tamamı byte[]'a alınıyordu → 1.6 GB tahsis, OOM, ölü app.
                // Her yanıt tek dilim = en fazla 8 MB; oynatıcı devamı için
                // Range ile geri gelir (ExoPlayer bunu her zaman yapar).
                long from = 0;
                long to = Math.min(job.size - 1, DILIM - 1);
                String range = sess.getHeaders().get("range");
                if (range != null && range.startsWith("bytes=")) {
                    String v = range.substring(6);
                    int dash = v.indexOf('-');
                    from = Long.parseLong(v.substring(0, dash).trim());
                    String end = v.substring(dash + 1).trim();
                    // Dilimli yanıt: oynatıcı devamı için yeniden gelir.
                    to = end.isEmpty() ? Math.min(job.size - 1, from + DILIM - 1)
                            : Math.min(Long.parseLong(end), Math.min(job.size - 1, from + DILIM - 1));
                }
                if (from < 0 || to >= job.size || from > to) {
                    android.util.Log.w(TAG, "geçersiz aralık istendi: from=" + from + " to=" + to + " boyut=" + job.size);
                    return newFixedLengthResponse(Response.Status.RANGE_NOT_SATISFIABLE,
                            "text/plain", "aralik");
                }
                // 6b: SEEK algılama. Son servis edilen dilimin devamı istenmiyorsa
                // kullanıcı (veya oynatıcı) sardı demektir. Logla; hedef pencere
                // aşağıda zaten TOP önceliğe alınacak (motor 'sırayla okuyor'
                // takılmasının panzehiri budur — kullanıcı 2026-10-28).
                long beklenen;
                synchronized (job) { beklenen = job.beklenenSonraki; }
                if (beklenen >= 0 && Math.abs(from - beklenen) > 1024 * 1024) {
                    android.util.Log.i(TAG, "SEEK algılandı: from=" + from + " (beklenen devam="
                            + beklenen + ") — hedef pencere önceliklendiriliyor");
                }
                synchronized (job) { job.beklenenSonraki = to + 1; }
                // ÖLÇÜLEN HATA (2026-10-25): parçalar inmeden dosya diskte
                // oluşmamış olabiliyor; RandomAccessFile o an FileNotFoundException
                // atıp HTTP 500 dönüyordu. 500 oynatıcı için KALICI hatadır →
                // kaynak hemen düşüyordu ("torrent satırı oynatılmıyor").
                // Dosya görünene kadar bekle; hâlâ yoksa 503 (yeniden denenebilir).
                File f = new File(job.path);
                for (int i = 0; i < 80 && !f.isFile(); i++) Thread.sleep(250);
                if (!f.isFile()) {
                    android.util.Log.w(TAG, "dosya diskte yok (20 sn) — 503: from=" + from);
                    return newFixedLengthResponse(Response.Status.SERVICE_UNAVAILABLE,
                            "text/plain", "dosya hazirlaniyor");
                }
                long len = to - from + 1;
                // TANI (6a): her sunucu isteği görünür olsun.
                android.util.Log.i(TAG, "istek: from=" + from + " len=" + len
                        + " (range=" + (range == null ? "yok" : range) + ")");
                // KAYMA pencere: istenen dilimdeki parçalar TOP, okuma bitince
                // geri DEFAULT — sıralı oynatmada sonraki parçalar motorun
                // kendi rastgele seçiminden önce gelir (2026-10-26 ölçüldü:
                // başta 3 parça inip 10.7 sn'de takılıyordu; 4. parça
                // indirilme sıraya alımış görünmüyordu).
                int plen = job.ti.files().pieceLength();
                long ay = job.ti.files().fileOffset(job.file) + from;
                int pa = (int) (ay / plen);
                int pb = (int) ((ay + len - 1) / plen);
                // 6b: iki parça ön-oku — dilim biter bitmez sonraki dilimin
                // parçaları diskte olsun (seek/ilerleme teklemesin).
                int onUc = Math.min(job.ti.numPieces() - 1, pb + 2);
                try {
                    for (int p = pa; p <= onUc; p++) job.th.piecePriority(p, Priority.TOP_PRIORITY);
                } catch (RuntimeException ignored) { /* handle öldüyse okumada anlaşılır */ }
                // ── AKIŞKAN YANIT (madde 6a siyah ekran düzeltmesi) ──────────
                // ÖLÇÜLEN KÖK NEDEN (2026-10-28): eski yol 8 MB'lık dilimin TÜM
                // parçalarını belleğe indirip SONRA yazıyordu; yavaş ağda bu
                // dakika sürer, ExoPlayer okuma zaman aşımına (8 sn) uğrar ve
                // bağlantı sessizce ölür → siyah ekran. Artık HTTP başlıkları
                // hemen gider, baytlar 256 KB'lık parçalar diskte indikçe
                // boru üzerinden akar; oynatıcı 'buffering' görür, ölmez.
                PipedInputStream giris = new PipedInputStream(256 * 1024);
                final PipedOutputStream cikis = new PipedOutputStream(giris);
                final RandomAccessFile raf = new RandomAccessFile(f, "r");
                final long t0 = System.currentTimeMillis();
                final long fromF = from, lenF = len;
                Thread akitici = new Thread(() -> {
                    long yazilan = 0;
                    String son = "ok";
                    try {
                        yazilan = yazarakGetir(cikis, job, fromF, lenF);
                    } catch (InterruptedException ie) {
                        son = "bekletildi/parca-yetismedi";
                        android.util.Log.w(TAG, "akış bekletildi from=" + fromF + " su="
                                + (System.currentTimeMillis() - t0) + "ms");
                    } catch (Exception e) {
                        son = "hata:" + e;
                        android.util.Log.w(TAG, "akış hatası from=" + fromF + ": " + e);
                    } finally {
                        try {
                            for (int p = pa; p <= onUc; p++) job.th.piecePriority(p, Priority.DEFAULT);
                        } catch (RuntimeException ignored) { /* handle öldüyse sıfırlamaya gerek yok */ }
                        try { raf.close(); } catch (Exception ignored) {}
                        try { cikis.close(); } catch (Exception ignored) {}
                        // TANI: yanıtın tamamı: bayt sayısı + süre (kullanıcı 6a).
                        android.util.Log.i(TAG, "yanıt bitti: from=" + fromF + " yazilan=" + yazilan
                                + "/" + lenF + " bayt su=" + (System.currentTimeMillis() - t0)
                                + "ms durum=" + son);
                    }
                }, "cp-torrent-akis");
                akitici.setDaemon(true);
                akitici.start();
                String mime = job.path.toLowerCase().endsWith(".mp4") ? "video/mp4"
                        : job.path.toLowerCase().endsWith(".webm") ? "video/webm"
                        : "video/x-matroska";
                // 206 + Content-Range: ExoPlayer devam dilimini kendisi ister.
                Response r = newFixedLengthResponse(Response.Status.PARTIAL_CONTENT, mime,
                        giris, len);
                r.addHeader("Content-Range", "bytes " + from + "-" + to + "/" + job.size);
                r.addHeader("Accept-Ranges", "bytes");
                return r;
            } catch (Exception e) {
                try { android.util.Log.w(TAG, "sunucu: " + e); } catch (Throwable ignored) {}
                // 503 = yeniden denenebilir (500 oynatıcı için KALICI hataydı,
                // kaynak anında düşüyordu — 2026-10-27 handle ölümü ölçüldü).
                return newFixedLengthResponse(Response.Status.SERVICE_UNAVAILABLE,
                        "text/plain", "yeniden dene");
            }
        }
    }

    /* İstenen aralığı 256 KB'lık parçalarla boruya yazar; her parça diske
       inene kadar bekler (havePiece → disk yazımı tamamdır; libtorrent4j'de
       disk cache varsayılan kapalıdır, parça hash sonrası doğrudan dosyaya
       yazılır). Parça yetişmezse akış KESİLİR — oynatıcı eksik yanıta
       kendi yeniden-deneme politikasıyla karar verir (6a: sessiz ölüm yok,
       her kesinti 'yanıt bitti ... durum=' logunda görünür). */
    /* long döner: boruya yazılan bayt sayısı (log için). */
    private long yazarakGetir(PipedOutputStream out, Job job, long fileFrom, long len)
            throws Exception {
        int pieceLen = job.ti.files().pieceLength();
        long base = job.ti.files().fileOffset(job.file) + fileFrom;
        java.io.RandomAccessFile raf = new java.io.RandomAccessFile(new File(job.path), "r");
        try {
            raf.seek(fileFrom);
            byte[] chunk = new byte[256 * 1024];
            long done = 0;
            while (done < len) {
                int n = (int) Math.min(chunk.length, len - done);
                long g = base + done;
                int p0 = (int) (g / pieceLen);
                int p1 = (int) ((g + n - 1) / pieceLen);
                for (int p = p0; p <= p1; p++) {
                    int beklenen = 0;
                    while (true) {
                        // KÖK NEDEN (2026-10-27): iş değişince eski handle ölür,
                        // havePiece RuntimeException (libtorrent:20) atar → buradan
                        // InterruptedException çıkar, akış 503-mantığıyla kesilir;
                        // akış başka kaynağa düşerse yarış kaybolur.
                        try {
                            if (job.th.havePiece(p)) break;
                            job.th.setPieceDeadline(p, 12000);
                        } catch (RuntimeException dead) {
                            throw new InterruptedException("is degisti");
                        }
                        Thread.sleep(250);
                        if (++beklenen > 240) throw new InterruptedException("parça beklenemedi");
                    }
                }
                raf.readFully(chunk, 0, n);
                out.write(chunk, 0, n); // boru dolarsa burada bekler (backpressure)
                done += n;
            }
            return done;
        } finally {
            try { raf.close(); } catch (Exception ignored) {}
        }
    }

    /* ── temizle ────────────────────────────────────────────────────────── */

    private void hepsiniDurdur() {
        synchronized (jobs) {
            for (Job job : jobs.values()) {
                try {
                    if (job.statRunnable != null) ui.removeCallbacks(job.statRunnable);
                    // 6a: bekçi yarım işlerde asılı kalmasın (yanlış timeout uyarısı).
                    if (job.zamanAsimiBekci != null) ui.removeCallbacks(job.zamanAsimiBekci);
                    if (job.peersizBekci != null) ui.removeCallbacks(job.peersizBekci);
                    if (job.server != null) job.server.stop();
                    if (job.th != null) {
                        job.th.pause();
                        if (session != null) session.remove(job.th);
                    }
                } catch (Exception ignored) {
                }
            }
            jobs.clear();
        }
        // Yarım indirmeler SİLİNMEZ — aynı torrent tekrar açılınca libtorrent
        // mevcut parçaları tanır, kaldığı yerden sürer (resume davranışı).
        // Üst sınır: 12 GB'ı aşarsa en eskiler silinir (telefon diski koruması).
        try {
            File dir = new File(ctx.getCodeCacheDir(), "torrent");
            if (!dir.isDirectory()) return;
            File[] ana = dir.listFiles();
            if (ana == null) return;
            long toplam = 0;
            for (File d : ana) toplam += dizinBoyutu(d);
            java.util.Arrays.sort(ana, (a, b) -> Long.valueOf(a.lastModified()).compareTo(b.lastModified()));
            for (File d : ana) {
                if (toplam <= 12L * 1024 * 1024 * 1024) break;
                long b = dizinBoyutu(d);
                deleteRec(d);
                toplam -= b;
            }
        } catch (Exception ignored) {
        }
    }

    private static long dizinBoyutu(File f) {
        if (f.isFile()) return f.length();
        long t = 0;
        File[] cs = f.listFiles();
        if (cs != null) for (File c : cs) t += dizinBoyutu(c);
        return t;
    }

    private static void deleteRec(File f) {
        if (f.isDirectory()) {
            File[] cs = f.listFiles();
            if (cs != null) for (File c : cs) deleteRec(c);
        }
        //noinspection ResultOfMethodCallIgnored
        f.delete();
    }

    private static String esc(String s) {
        return String.valueOf(s).replace("\\", "\\\\").replace("\"", "'");
    }
}
