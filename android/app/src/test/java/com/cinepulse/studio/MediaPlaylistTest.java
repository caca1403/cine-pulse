package com.cinepulse.studio;
import org.junit.Test;
import static org.junit.Assert.*;
import java.net.URI;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

public class MediaPlaylistTest {
    private static final String ORIGIN = "http://127.0.0.1:1234/device-token";
    private static final String HEADERS = "{\"User-Agent\":\"fixture-agent\",\"Authorization\":\"fixture\"}";
    private Map<String, String> query(String url) throws Exception {
        Map<String, String> map = new HashMap<>();
        for (String pair : new URI(url).getRawQuery().split("&")) {
            String[] fields = pair.split("=", 2); map.put(fields[0], URLDecoder.decode(fields[1], "UTF-8"));
        }
        return map;
    }
    @Test public void relativeSegmentsUseFinalRedirectUrlAndCarryPlaybackHeaders() throws Exception {
        String result = MediaPlaylist.rewrite("#EXTM3U\n#EXTINF:8,\n../segment.ts?sig=a&v=2\n", "https://cdn.test/redirect/level.m3u8", ORIGIN, "https://provider.test/", HEADERS);
        String url = result.split("\n")[2]; Map<String, String> params = query(url);
        assertTrue(url.startsWith(ORIGIN));
        assertEquals("https://cdn.test/segment.ts?sig=a&v=2", params.get("url"));
        assertEquals("https://provider.test/", params.get("ref")); assertEquals(HEADERS, params.get("headers"));
    }
    @Test public void variantsKeysInitMapsAndSubtitlesAreAllProxied() throws Exception {
        String playlist = "#EXTM3U\n#EXT-X-MEDIA:TYPE=SUBTITLES,URI=\"subs/list.m3u8\"\n#EXT-X-KEY:METHOD=AES-128,URI=\"key.bin\"\n#EXT-X-MAP:URI=\"init.mp4\"\n#EXT-X-STREAM-INF:BANDWIDTH=1000\nlevel.m3u8\n";
        String result = MediaPlaylist.rewrite(playlist, "https://cdn.test/master.m3u8", ORIGIN, "https://provider.test/", HEADERS);
        assertEquals(4, result.split("/api/hls_proxy", -1).length - 1);
        assertTrue(result.contains("subs%2Flist.m3u8")); assertTrue(result.contains("key.bin")); assertTrue(result.contains("init.mp4"));
    }
    @Test public void inlineKeysArePreserved() throws Exception {
        String playlist = "#EXTM3U\n#EXT-X-KEY:METHOD=AES-128,URI=\"data:application/octet-stream;base64,AAAA\"\n";
        String result = MediaPlaylist.rewrite(playlist, "https://cdn.test/master.m3u8", ORIGIN, "", "{}");
        assertTrue(result.contains("URI=\"data:application/octet-stream;base64,AAAA\""));
        assertFalse(result.contains("/api/hls_proxy"));
    }
}
