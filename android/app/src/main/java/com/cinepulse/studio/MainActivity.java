package com.cinepulse.studio;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.DownloadListener;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            if (this.bridge != null && this.bridge.getWebView() != null) {
                this.bridge.getWebView().setDownloadListener(new DownloadListener() {
                    @Override
                    public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimeType, long contentLength) {
                        try {
                            Intent intent = new Intent(Intent.ACTION_VIEW);
                            intent.setData(Uri.parse(url));
                            intent.addCategory(Intent.CATEGORY_BROWSABLE);
                            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                            startActivity(intent);
                        } catch (Exception e1) {
                            try {
                                Intent chooserIntent = Intent.createChooser(new Intent(Intent.ACTION_VIEW, Uri.parse(url)), "İndirici Seçin");
                                chooserIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                startActivity(chooserIntent);
                            } catch (Exception ignored) {}
                        }
                    }
                });
            }
        } catch (Exception ignored) {}
    }
}
