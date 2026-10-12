package com.cinepulse.studio;

import android.os.Handler;
import android.os.Looper;
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

    private final MainActivity activity;
    private final Handler main = new Handler(Looper.getMainLooper());

    private final ArrayDeque<Runnable> jobs = new ArrayDeque<>();
    private boolean busy = false;
    private WebView webView;
    private ViewGroup holder;
    private Runnable pollTask;
    private final List<JSONObject> mediaRequests = Collections.synchronizedList(new ArrayList<JSONObject>());

    NativePageResolver(MainActivity activity) {
        this.activity = activity;
    }

    void resolve(final String id, final String url, final int timeoutMs, final boolean media,
                 final String userAgent, final Callback callback) {
        main.post(() -> {
            jobs.add(() -> {
                Callback done = (requestId, json) -> {
                    callback.onResult(requestId, json);
                    main.post(() -> { finish(); busy = false; drain(); });
                };
                try { start(id, url, timeoutMs <= 0 ? 20000 : timeoutMs, media, userAgent, done); }
                catch (Throwable error) { done.onResult(id, errorJson(error)); }
            });
            drain();
        });
    }

    private void drain() {
        if (busy || jobs.isEmpty()) return;
        busy = true; jobs.remove().run();
    }

    private void start(final String id, final String url, final int timeoutMs, final boolean media, final String userAgent, final Callback callback) {
        finish();
        mediaRequests.clear();

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
        // Gorunmez oldugu icin dokunus ve cizim yok, JS ve ag normal calisir.
        container.setLayoutParams(new ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        container.setVisibility(android.view.View.INVISIBLE);
        container.addView(view, new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        ViewGroup root = activity.findViewById(android.R.id.content);
        if (root == null) throw new IllegalStateException("icerik kaplamasi bulunamadi");
        root.addView(container);
        webView = view;
        holder = container;

        view.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest request) {
                String candidate = request.getUrl().toString();
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
                return super.shouldInterceptRequest(v, request);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest request) {
                return false;
            }
        });

        final long deadline = System.currentTimeMillis() + timeoutMs;

        pollTask = new Runnable() {
            @Override
            public void run() {
                readSnapshot(view, new SnapshotListener() {
                    @Override
                    public void onSnapshot(String href, String html, String text) {
                        boolean ready = html != null && html.length() > 1500 && !isChallenge(html);
                        if ((ready && (!media || !mediaRequests.isEmpty())) || System.currentTimeMillis() >= deadline) {
                            deliver(id, url, href, html, text, !ready, callback);
                            return;
                        }
                        main.postDelayed(pollTask, 700);
                    }
                });
            }
        };

        Map<String, String> headers = new HashMap<String, String>();
        headers.put("Accept-Language", "tr-TR,tr;q=0.9,en;q=0.8");
        try {
            view.loadUrl(url, headers);
        } catch (Throwable error) {
            deliver(id, url, "", "", "", true, callback);
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

    private static boolean isChallenge(String html) {
        if (html == null || html.isEmpty()) return true;
        String sample = html.length() > 8000 ? html.substring(0, 8000) : html;
        String low = sample.toLowerCase();
        return low.contains("just a moment")
            || low.contains("enable javascript and cookies")
            || low.contains("challenge-platform")
            || low.contains("attention required")
            || low.contains("cf-chl");
    }

    private void deliver(final String id, final String url, final String href, final String html,
                         final String text, boolean challenge, final Callback callback) {
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