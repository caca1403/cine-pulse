package com.cinepulse.studio;

import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.view.MotionEvent;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import org.json.JSONArray;
import java.util.Collections;
import java.util.ArrayList;
import java.util.List;
import java.util.ArrayDeque;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Cloudstream "WebViewResolver" esdegeri: gizli bir WebView ile gercek site
 * sayfasini yukler (Cloudflare challenge'i tarayici olarak cozer), sonra
 * sayfanin HTML'ini, metnini ve cerezlerini disariye dondurur.
 *
 * Gerekce: HDFC gibi siteler datacenter IP'sine "Just a moment..." verir.
 * CapacitorHttp düz bir HTTP istemcisidir; challenge JS'i calismaz. Tek gercek
 * cozum sayfayi gercek bir WebView'de acmaktir.
 */
final class NativePageResolver {

    interface Callback {
        void onResult(String id, String json);
    }

    interface SnapshotListener {
        void onSnapshot(String href, String html, String text);
    }

    private static final String READ_JS =
        "(function(){try{return {href:String(location.href||''),"
            + "html:(document.documentElement?document.documentElement.outerHTML:''),"
            + "text:(document.body?document.body.innerText:'')};}catch(e){return null;}})()";

    /**
     * Otomatik-baslatma cikisi (olculen 2026-10-18, cihaz): bolum sayfalarinda
     * oynatici, "onayla/oynat/sunucu N" dugmesine tiklamayi veya CF Turnstile
     * kutusunu bekliyor; gorunmez WebView'da tiklama olmadigi icin hicbir akis
     * yakalanmiyordu (Robin/Raven 0 kaynak). Bu JS ayni-kokenli dugmeleri tiklar
     * (kisa + TAM eslesen etiket; serbest metinli baglantilara dokunmaz) ve CF
     * widget koordinatini dondurur — Java oraya gercek dokunis gonderir, cunku
     * cf iframe capraz-koken: JS icine tiklayamaz.
     */
    /**
     * Sayfa içi gözlemci KALDIRILDI (2026-10-18): site ajax'ları sayfa-sonundan
     * ÖNCE bittiği için yakalanamıyordu; sayfa JS'ini sarmalamak riskli ve
     * verimsiz kaldı. Statik istek günlüğü (requestLog) teşhis için yeterlidir.
     */
    private static final String NUDGE_JS =
        "(function(){try{var n=0;"
            + "var els=document.querySelectorAll('button,a,[role=button],li,span,div');"
            + "for(var i=0;i<els.length&&n<8;i++){var el=els[i];"
            + "var t=((el.innerText||el.value||'')+'').trim().toLowerCase();"
            + "if(t.length>0&&t.length<42&&/^(onayla|onay|do\\u011frula|dogrula|oynat|dene|sunucu\\s?\\d*)$/.test(t)){el.click();n++;}}"
            + "var sels=document.querySelectorAll('[onclick*=startPlayer],[aria-label*=Oynat],[aria-label*=ynat],[class*=play-btn],[class*=playButton],[class*=play_btn],#playBtn,.play-button,#play,[data-dil=\"0\"]');for(var i=0;i<sels.length&&n<8;i++){sels[i].click();n++;}}"
            + "var w=null;var f=document.querySelector('.cf-turnstile iframe,iframe[src*=\"challenges.cloudflare.com\"]');"
            + "if(f){var b=f.getBoundingClientRect();if(b.width>0&&b.height>0)w={x:b.left+b.width/2,y:b.top+b.height/2};}"
            + "return JSON.stringify({n:n,w:w});}catch(e){return '{\"n\":-1,\"w\":null}'}})()";

    private final MainActivity activity;
    private final Handler main = new Handler(Looper.getMainLooper());

    private final ArrayDeque<Runnable> jobs = new ArrayDeque<>();
    private boolean busy = false;
    private volatile WebView webView;
    private ViewGroup holder;
    private Runnable pollTask;

    NativePageResolver(MainActivity activity) {
        this.activity = activity;
    }

    void resolve(final String id, final String url, final int timeoutMs, final boolean media,
                 final String userAgent, final Callback callback) {
        resolve(id, url, timeoutMs, media, userAgent, "", callback);
    }

    void resolve(final String id, final String url, final int timeoutMs, final boolean media,
                 final String userAgent, final String referer, final Callback callback) {
        final long queuedDeadline = System.currentTimeMillis() + (timeoutMs <= 0 ? 20000 : timeoutMs);
        main.post(() -> {
            jobs.add(() -> {
                Callback done = (requestId, json) -> {
                    callback.onResult(requestId, json);
                    main.post(() -> { finish(); busy = false; drain(); });
                };
                final long remaining = queuedDeadline - System.currentTimeMillis();
                if (remaining < 1000) { done.onResult(id, errorJson(new IllegalStateException("resolver-queue-timeout"))); return; }
                try { start(id, url, (int) remaining, media, userAgent, referer, done); }
                catch (Throwable error) { done.onResult(id, errorJson(error)); }
            });
            drain();
        });
    }

    private void drain() {
        if (busy || jobs.isEmpty()) return;
        busy = true; jobs.remove().run();
    }

    private void start(final String id, final String url, final int timeoutMs, final boolean media, final String userAgent, final String referer, final Callback callback) {
        finish();
        final List<JSONObject> mediaRequests = Collections.synchronizedList(new ArrayList<JSONObject>());

        WebView view = new WebView(activity);
        view.setTag(id);
        WebSettings settings = view.getSettings();
        settings.setJavaScriptEnabled(true);
        if (userAgent != null && !userAgent.isEmpty()) settings.setUserAgentString(userAgent);
        settings.setDomStorageEnabled(true);
        settings.setLoadWithOverviewMode(false);
        settings.setUseWideViewPort(false);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);

        CookieManager cookies = CookieManager.getInstance();
        cookies.setAcceptCookie(true);
        cookies.setAcceptThirdPartyCookies(view, true);

        FrameLayout container = new FrameLayout(activity);
        // Gercek boyut: challenge sayfasi normal bir viewport bekliyor.
        // OLULEN (2026-10-18): INVISIBLE container sayfayi "gizli" yapip
        // Chromium'un lazy-load/autoplay/IntersectionObserver zincirini
        // donduruyordu — oynatici hicbir istek atmiyordu. Cozum: gorunur
        // ama ANA WebView'in Arkasinda (index 0) + alpha ~0: kullanici
        // gormez, sayfa ise kendisini acik sanar.
        container.setLayoutParams(new ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        container.setAlpha(0.01f);
        container.addView(view, new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        ViewGroup root = activity.findViewById(android.R.id.content);
        if (root == null) throw new IllegalStateException("icerik kaplamasi bulunamadi");
        root.addView(container, 0);
        webView = view;
        holder = container;
        final List<String> requestLog = Collections.synchronizedList(new ArrayList<String>());

        view.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest request) {
                if (webView != v) return null;
                String candidate = request.getUrl().toString();
                // TEŞHİS (2026-10-18): sayfanın 20 sn'de ne çektiğini görmek için
                // statik-varlık dışı tüm istekler kısa biçimde loglanır.
                try {
                    if (!candidate.matches("(?i).*\\.(png|jpe?g|webp|gif|svg|css|woff2?|ttf|ico)([?#].*)?$")
                        && !candidate.startsWith("data:")) {
                        synchronized (requestLog) {
                            if (requestLog.size() < 80) requestLog.add(candidate.length() > 160 ? candidate.substring(0, 160) : candidate);
                        }
                    }
                } catch (Throwable ignored) {}
                if (candidate.matches("(?i).*\\.(m3u8|mp4|mpd|mkv|webm)([?#].*)?$")
                    && !candidate.matches("(?i).*(/ads?/|preroll|vast|doubleclick).*")) {
                    try {
                        JSONObject item = new JSONObject(); item.put("url", candidate);
                        item.put("headers", new JSONObject(request.getRequestHeaders()));
                        synchronized (mediaRequests) {
                            if (mediaRequests.size() < 32) mediaRequests.add(item);
                        }
                    } catch (Exception ignored) {}
                }
                WebResourceResponse yanit = super.shouldInterceptRequest(v, request);
                return yanit;
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest request) {
                return false;
            }
        });

        final long deadline = System.currentTimeMillis() + timeoutMs;
        final long yukT0 = deadline - timeoutMs;

        pollTask = new Runnable() {
            private int nudges = 0;
            private long sonNudge = 0;
            private int sonMedyaAdet = 0;
            private long sonMedyaT = 0;

            @Override
            public void run() {
                // 3.5 sn sonra ve en fazla 3 kez: oynatici/Onay dugmelerini tikla,
                // CF Turnstile varsa gercek dokunus gonder (media isteklerini baslatir).
                long nowMs = System.currentTimeMillis();
                if (mediaRequests.size() != sonMedyaAdet) { sonMedyaAdet = mediaRequests.size(); sonMedyaT = nowMs; }
                if (nudges < 3 && nowMs - yukT0 > 3500 && nowMs - sonNudge > 4000) {
                    nudges++; sonNudge = nowMs;
                    try {
                        view.evaluateJavascript(NUDGE_JS, raw -> {
                            try {
                                JSONObject sar = new JSONObject("{\"v\":" + raw + "}");
                                JSONObject j = new JSONObject(sar.getString("v"));
                                JSONObject w = j.optJSONObject("w");
                                if (w != null) tapWidget(view, w.getDouble("x"), w.getDouble("y"));
                            } catch (Throwable ignored) {}
                        });
                    } catch (Throwable ignored) {}
                }
                readSnapshot(view, new SnapshotListener() {
                    @Override
                    public void onSnapshot(String href, String html, String text) {
                        if (webView != view) return;
                        boolean ready = html != null && html.length() > 1500 && !isChallenge(html);
                        // PREROLL tuzağı (ölçülen 2026-10-18): oynatici önce reklam
                        // mp4'ü çeker; tek istekle erken teslim reklamı yayın yapar.
                        // Erken teslim ya >=2 istek ya tek istek 4 sn'dir sabitse.
                        int adet = mediaRequests.size();
                        boolean medyaOlgun = adet >= 2
                            || (adet == 1 && sonMedyaT > 0 && System.currentTimeMillis() - sonMedyaT > 4000);
                        if ((ready && (!media || medyaOlgun)) || System.currentTimeMillis() >= deadline) {
                            deliver(id, url, href, html, text, !ready, mediaRequests, requestLog, callback);
                            return;
                        }
                        main.postDelayed(pollTask, 700);
                    }
                });
            }
        };

        Map<String, String> headers = new HashMap<String, String>();
        headers.put("Accept-Language", "tr-TR,tr;q=0.9,en;q=0.8");
        // Gömülü oynatıcılar üst-seviye yüklemeyi Referer'suz bloklar/boşlar
        // (ölçüldü 2026-10-18: sn.dplayer74.site boş sayfa) — ana belge isteğine eklenir.
        if (referer != null && !referer.isEmpty()) headers.put("Referer", referer);
        try {
            view.loadUrl(url, headers);
        } catch (Throwable error) {
            deliver(id, url, "", "", "", true, mediaRequests, requestLog, callback);
            return;
        }
        main.postDelayed(pollTask, 1500);
    }

    private void readSnapshot(final WebView view, final SnapshotListener listener) {
        try {
            view.evaluateJavascript(READ_JS, new android.webkit.ValueCallback<String>() {
                @Override
                public void onReceiveValue(String raw) {
                    String href = "";
                    String html = "";
                    String text = "";
                    try {
                        if (raw != null && raw.length() > 2 && raw.charAt(0) == '{') {
                            JSONObject data = new JSONObject(raw);
                            href = data.optString("href", "");
                            html = data.optString("html", "");
                            text = data.optString("text", "");
                        }
                    } catch (Throwable ignored) {}
                    listener.onSnapshot(href, html, text);
                }
            });
        } catch (Throwable error) {
            listener.onSnapshot("", "", "");
        }
    }

    /**
     * CF Turnstile kutusuna gercek dokunus: JS'in iframe icine erisimi yok, ama
     * widget koordinati parent'tan okunabiliyor. WebView dogrudan dispatched
     * olaylari gorunmezken de isler (INVISIBLE layout'u korur, sadece cizmez).
     */
    private void tapWidget(final WebView view, final double cx, final double cy) {
        try {
            final float d = view.getResources().getDisplayMetrics().density;
            final float x = (float) (cx * d), y = (float) (cy * d);
            long t = SystemClock.uptimeMillis();
            MotionEvent down = MotionEvent.obtain(t, t, MotionEvent.ACTION_DOWN, x, y, 0);
            view.dispatchTouchEvent(down);
            down.recycle();
            main.postDelayed(() -> {
                if (webView != view) return;
                long t2 = SystemClock.uptimeMillis();
                MotionEvent up = MotionEvent.obtain(t2, t2, MotionEvent.ACTION_UP, x, y, 0);
                view.dispatchTouchEvent(up);
                up.recycle();
            }, 90);
        } catch (Throwable ignored) {}
    }

    private static boolean isChallenge(String html) {
        if (html == null || html.isEmpty()) return true;
        String sample = html.length() > 8000 ? html.substring(0, 8000) : html;
        String low = sample.toLowerCase();
        return low.contains("just a moment")
            || low.contains("enable javascript and cookies")
            || low.contains("challenge-platform")
            || low.contains("attention required")
            || low.contains("cf-chl")
            || low.contains("do\u011frulama gerekiyor"); // olculen: dizipal interstisial'i (2026-10-18)
    }

    private void deliver(final String id, final String url, final String href, final String html,
                         final String text, boolean challenge, final List<JSONObject> mediaRequests,
                         final List<String> requestLog, final Callback callback) {
        String cookieHeader = "";
        try {
            cookieHeader = CookieManager.getInstance().getCookie(url);
        } catch (Throwable ignored) {}

        String payload = "{}";
        try {
            JSONObject result = new JSONObject();
            result.put("ok", html != null && html.length() > 0);
            result.put("url", url);
            result.put("finalUrl", (href == null || href.isEmpty()) ? url : href);
            result.put("html", html == null ? "" : html);
            result.put("text", text == null ? "" : text);
            result.put("cookies", cookieHeader == null ? "" : cookieHeader);
            result.put("challenge", challenge);
            synchronized (mediaRequests) { result.put("streams", new JSONArray(mediaRequests)); }
            // TEŞHİS (2026-10-18): sayfa akışının ne yaptığını ölçüm için.
            if (requestLog != null) synchronized (requestLog) { result.put("requests", new JSONArray(requestLog)); }
            payload = result.toString();
        } catch (Throwable ignored) {}

        callback.onResult(id, payload);
    }

    private String errorJson(Throwable error) {
        try {
            JSONObject result = new JSONObject();
            result.put("ok", false);
            result.put("challenge", true);
            result.put("html", "");
            result.put("text", "");
            result.put("cookies", "");
            result.put("error", error == null ? "bilinmeyen hata" : String.valueOf(error.getMessage()));
            return result.toString();
        } catch (Throwable ignored) {
            return "{\"ok\":false,\"challenge\":true,\"html\":\"\",\"text\":\"\",\"cookies\":\"\"}";
        }
    }

    void close() { main.post(() -> { jobs.clear(); finish(); }); }

    private void finish() {
        try {
            if (pollTask != null) main.removeCallbacks(pollTask);
        } catch (Throwable ignored) {}
        pollTask = null;
        try {
            if (holder != null && holder.getParent() instanceof ViewGroup) {
                ((ViewGroup) holder.getParent()).removeView(holder);
            }
        } catch (Throwable ignored) {}
        try {
            if (webView != null) {
                webView.stopLoading();
                webView.setWebViewClient(new WebViewClient());
                webView.destroy();
            }
        } catch (Throwable ignored) {}
        holder = null;
        webView = null;
    }
}