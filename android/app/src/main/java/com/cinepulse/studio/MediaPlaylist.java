package com.cinepulse.studio;

import java.net.URL;
import java.net.URLEncoder;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Pure playlist rewrite used by the Android gateway and its JVM tests. */
final class MediaPlaylist {
    static String rewrite(String text, String base, String origin, String ref, String headers) throws Exception {
        StringBuilder result = new StringBuilder();
        Pattern uri = Pattern.compile("URI=\"([^\"]+)\"");
        for (String line : text.split("\\r?\\n", -1)) {
            if (line.startsWith("#")) {
                Matcher matcher = uri.matcher(line); StringBuffer rewritten = new StringBuffer();
                while (matcher.find()) {
                    String value = matcher.group(1);
                    String replacement = value.startsWith("data:") ? value : proxy(new URL(new URL(base), value).toString(), origin, ref, headers);
                    matcher.appendReplacement(rewritten, Matcher.quoteReplacement("URI=\"" + replacement + "\""));
                }
                matcher.appendTail(rewritten); result.append(rewritten);
            } else if (!line.trim().isEmpty()) result.append(proxy(new URL(new URL(base), line.trim()).toString(), origin, ref, headers));
            else result.append(line);
            result.append('\n');
        }
        return result.toString();
    }
    private static String proxy(String target, String origin, String ref, String headers) throws Exception {
        return origin + "/api/hls_proxy?url=" + URLEncoder.encode(target, "UTF-8")
            + "&ref=" + URLEncoder.encode(ref, "UTF-8") + "&headers=" + URLEncoder.encode(headers, "UTF-8");
    }
}
