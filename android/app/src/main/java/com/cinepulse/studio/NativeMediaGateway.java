package com.cinepulse.studio;

import android.content.Context;
import android.webkit.CookieManager;
import fi.iki.elonen.NanoHTTPD;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.regex.*;
import org.json.*;
import com.chaquo.python.Python;
import com.chaquo.python.android.AndroidPlatform;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

/** Device-local transport. Playlists, segments and keys share headers and cookies. */
final class NativeMediaGateway extends NanoHTTPD {
    private final JSONObject routes;
    private final MainActivity activity;
    private final String token = UUID.randomUUID().toString();
    private static final int MAX_PLAYLIST_BYTES = 4 * 1024 * 1024;

    NativeMediaGateway(MainActivity context) throws Exception {
        super("127.0.0.1", 0);
        activity = context;
        try (InputStream in = context.getAssets().open("native-routes.json")) {
            routes = new JSONObject(new String(readLimited(in, MAX_PLAYLIST_BYTES), StandardCharsets.UTF_8));
        }
    }

    String origin() { return "http://127.0.0.1:" + getListeningPort() + "/" + token; }

    private Response reply(Response response) {
        response.addHeader("Access-Control-Allow-Origin", "https://localhost");
        response.addHeader("Access-Control-Allow-Headers", "Content-Type,Range,Accept,Accept-Language,X-Requested-With,X-Hdf-Nonce,X-Proxy-Cookie,X-Proxy-Referer,Cf-Control,Language,Site,Device");
        response.addHeader("Access-Control-Allow-Methods", "GET,HEAD,POST,OPTIONS");
        response.addHeader("Access-Control-Expose-Headers", "Content-Length,Content-Range,Accept-Ranges,X-Upstream-URL");
        response.addHeader("Cache-Control", "no-store");
        return response;
    }

    @Override public Response serve(IHTTPSession session) {
        String prefix = "/" + token + "/api/";
        if (!session.getUri().startsWith(prefix)) return reply(newFixedLengthResponse(Response.Status.NOT_FOUND, "text/plain", "Not found"));
        if (session.getMethod() == Method.OPTIONS) return reply(newFixedLengthResponse(Response.Status.NO_CONTENT, "text/plain", ""));
        if (session.getMethod() != Method.GET && session.getMethod() != Method.HEAD && session.getMethod() != Method.POST)
            return reply(newFixedLengthResponse(Response.Status.METHOD_NOT_ALLOWED, "text/plain", "Unsupported method"));
        try {
            String path = session.getUri().substring(prefix.length());
            String route = path.split("/", 2)[0];
            Map<String, String> params = session.getParms();
            if (route.equals("resolve")) {
                synchronized (Python.class) {
                    if (!Python.isStarted()) Python.start(new AndroidPlatform(activity));
                }
                String payload = Python.getInstance().getModule("cinepulse_runtime")
                    .callAttr("resolve_json", new JSONObject(params).toString(), origin()).toString();
                return reply(newFixedLengthResponse(Response.Status.OK, "application/json", payload));
            }
            if (route.equals("native_page")) {
                final CountDownLatch latch = new CountDownLatch(1);
                final String[] payload = {"{\"ok\":false,\"challenge\":true}"};
                activity.resolveNativePage(params.get("url"), params.getOrDefault("ua", ""), (id, json) -> {
                    payload[0] = json; latch.countDown();
                });
                latch.await(45, TimeUnit.SECONDS);
                return reply(newFixedLengthResponse(Response.Status.OK, "application/json", payload[0]));
            }
            String target;
            String ref = params.getOrDefault("ref", "");
            Map<String, String> headers = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
            for (Map.Entry<String, String> e : session.getHeaders().entrySet()) {
                String key = e.getKey();
                if (!Arrays.asList("host", "connection", "content-length", "accept-encoding", "origin").contains(key.toLowerCase(Locale.ROOT)))
                    headers.put(key, e.getValue());
            }
            if (ref.isEmpty()) ref = session.getHeaders().getOrDefault("referer", "");
            boolean playlistProxy = route.equals("hls_proxy") || route.equals("mkv_stream");
            if (route.equals("proxy") || playlistProxy || route.equals("stream_proxy")) {
                target = params.get("url");
            } else if (routes.has(route)) {
                JSONObject config = routes.getJSONObject(route);
                String sub = params.getOrDefault("path", path.substring(route.length()));
                String base = config.getString("base");
                target = base + (sub.isEmpty() || sub.startsWith("/") ? sub : "/" + sub);
                List<String> query = new ArrayList<>();
                for (Map.Entry<String, List<String>> e : session.getParameters().entrySet()) {
                    if (e.getKey().equals("path")) continue;
                    for (String value : e.getValue()) query.add(enc(e.getKey()) + "=" + enc(value));
                }
                if (!query.isEmpty()) target += (target.contains("?") ? "&" : "?") + String.join("&", query);
                ref = config.optString("referer", base + "/");
                JSONObject configured = config.optJSONObject("headers");
                if (configured != null) for (Iterator<String> it = configured.keys(); it.hasNext();) {
                    String name = it.next(); headers.put(name, configured.getString(name));
                }
            } else {
                return reply(newFixedLengthResponse(Response.Status.NOT_IMPLEMENTED, "application/json", "{\"success\":false,\"error\":\"native-route-unavailable\"}"));
            }
            String encodedHeaders = params.get("headers");
            if (encodedHeaders != null && encodedHeaders.length() < 16384) {
                JSONObject supplied = new JSONObject(encodedHeaders);
                for (Iterator<String> it = supplied.keys(); it.hasNext();) {
                    String name = it.next();
                    if (!Arrays.asList("host", "connection", "content-length", "accept-encoding").contains(name.toLowerCase(Locale.ROOT)))
                        headers.put(name, supplied.getString(name));
                }
            }
            if (!ref.isEmpty()) headers.put("Referer", ref);
            String range = session.getHeaders().get("range");
            // Olculen hata (2026-10-16): imzali HLS uclari (dizisol, streamcorecdn,
            // zenoak) Range gordugunde 500/timeout donuyor. Oynatici ilk acilista
            // "bytes=0-" gonderir; bu gercek bir parc istegi degildir, yukariya
            // iletilmez - iletilince kaynak acilip video oynamiyordu. Gercek aralik
            // istekleri (bytes=N-, N-M) aynen aktarilir, arama (seek) bozulmaz.
            if (range != null && !range.trim().equalsIgnoreCase("bytes=0-")) {
                headers.put("Range", range);
            }
            headers.putIfAbsent("User-Agent", session.getHeaders().getOrDefault("user-agent", "Mozilla/5.0"));
            headers.putIfAbsent("Accept", session.getHeaders().getOrDefault("accept", "*/*"));
            byte[] body = null;
            if (session.getMethod() == Method.POST) {
                Map<String, String> files = new HashMap<>(); session.parseBody(files);
                body = files.getOrDefault("postData", "").getBytes(StandardCharsets.UTF_8);
                headers.put("Content-Type", session.getHeaders().getOrDefault("content-type", "application/x-www-form-urlencoded"));
                headers.put("X-Requested-With", "XMLHttpRequest");
                if (body.length == 0 && !params.isEmpty()) {
                    List<String> pairs = new ArrayList<>();
                    for (Map.Entry<String, String> e : params.entrySet()) if (!e.getKey().equals("url") && !e.getKey().equals("ref")) pairs.add(enc(e.getKey()) + "=" + enc(e.getValue()));
                    body = String.join("&", pairs).getBytes(StandardCharsets.UTF_8);
                }
            }
            HttpURLConnection conn = connect(target, session.getMethod().name(), headers, body);
            int status = conn.getResponseCode();
            String mime = conn.getContentType();
            if (mime == null) mime = "application/octet-stream";
            InputStream raw = status >= 400 ? conn.getErrorStream() : conn.getInputStream();
            if (raw == null) raw = new ByteArrayInputStream(new byte[0]);
            PushbackInputStream sniffed = new PushbackInputStream(raw, 32);
            byte[] beginning = new byte[32]; int prefixLength = sniffed.read(beginning);
            if (prefixLength > 0) sniffed.unread(beginning, 0, prefixLength);
            boolean playlistBody = prefixLength > 0 && new String(beginning, 0, prefixLength, StandardCharsets.UTF_8)
                .replace("\uFEFF", "").trim().startsWith("#EXTM3U");
            final HttpURLConnection opened = conn;
            InputStream stream = new FilterInputStream(sniffed) {
                @Override public void close() throws IOException { try { super.close(); } finally { opened.disconnect(); } }
            };
            Response.IStatus code = new Response.IStatus() {
                public int getRequestStatus() { return status; }
                public String getDescription() { return status + " Upstream"; }
            };
            Response response;
            boolean isPlaylist = playlistBody || mime.toLowerCase(Locale.ROOT).contains("mpegurl") || conn.getURL().getPath().toLowerCase(Locale.ROOT).endsWith(".m3u8");
            if (playlistProxy && status >= 200 && status < 300 && isPlaylist) {
                String text;
                try (InputStream in = stream) { text = new String(readLimited(in, MAX_PLAYLIST_BYTES), StandardCharsets.UTF_8); }
                text = MediaPlaylist.rewrite(text, conn.getURL().toString(), origin(), ref, new JSONObject(headers).toString());
                response = newFixedLengthResponse(code, "application/vnd.apple.mpegurl", text);
            } else {
                long length = conn.getContentLengthLong();
                response = length >= 0 ? newFixedLengthResponse(code, mime, stream, length) : newChunkedResponse(code, mime, stream);
            }
            for (String key : new String[]{"Content-Range", "Accept-Ranges"}) {
                String value = conn.getHeaderField(key); if (value != null) response.addHeader(key, value);
            }
            response.addHeader("X-Upstream-URL", conn.getURL().toString());
            return reply(response);
        } catch (Exception error) {
            return reply(newFixedLengthResponse(Response.Status.SERVICE_UNAVAILABLE, "application/json", "{\"success\":false,\"error\":\"native-upstream-failed\"}"));
        }
    }

    private HttpURLConnection connect(String target, String method, Map<String, String> headers, byte[] body) throws Exception {
        for (int hop = 0; hop < 6; hop++) {
            URL url = new URL(target);
            if (!url.getProtocol().equals("https") && !url.getProtocol().equals("http")) throw new IOException("Unsupported scheme");
            if (url.getUserInfo() != null) throw new IOException("User info not allowed");
            for (InetAddress address : InetAddress.getAllByName(url.getHost())) {
                if (address.isAnyLocalAddress() || address.isLoopbackAddress() || address.isLinkLocalAddress()) throw new IOException("Local destination");
            }
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setInstanceFollowRedirects(false); conn.setConnectTimeout(8000); conn.setReadTimeout(20000); conn.setRequestMethod(method);
            for (Map.Entry<String, String> e : headers.entrySet()) conn.setRequestProperty(e.getKey(), e.getValue());
            String cookies = CookieManager.getInstance().getCookie(target);
            if (cookies != null && !cookies.isEmpty()) conn.setRequestProperty("Cookie", cookies);
            if (body != null) { conn.setDoOutput(true); try (OutputStream out = conn.getOutputStream()) { out.write(body); } }
            int status = conn.getResponseCode();
            for (Map.Entry<String, List<String>> e : conn.getHeaderFields().entrySet()) {
                if (e.getKey() != null && e.getKey().equalsIgnoreCase("Set-Cookie")) for (String cookie : e.getValue()) CookieManager.getInstance().setCookie(target, cookie);
            }
            if (status != 301 && status != 302 && status != 303 && status != 307 && status != 308) return conn;
            String location = conn.getHeaderField("Location"); conn.disconnect();
            if (location == null) throw new IOException("Missing redirect");
            URL next = new URL(url, location);
            if (!next.getHost().equalsIgnoreCase(url.getHost())) {
                headers.remove("Authorization"); headers.remove("Cookie");
            }
            target = next.toString();
            if (status == 303 || ((status == 301 || status == 302) && method.equals("POST"))) { method = "GET"; body = null; }
        }
        throw new IOException("Redirect limit");
    }

    private static String enc(String value) throws Exception { return URLEncoder.encode(value, "UTF-8"); }
    private static byte[] readLimited(InputStream in, int limit) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream(); byte[] buffer = new byte[8192]; int count;
        while ((count = in.read(buffer)) != -1) { if (out.size() + count > limit) throw new IOException("Response too large"); out.write(buffer, 0, count); }
        return out.toByteArray();
    }
}
