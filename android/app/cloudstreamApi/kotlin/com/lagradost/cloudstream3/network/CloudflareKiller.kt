package com.lagradost.cloudstream3.network

import okhttp3.Interceptor
import okhttp3.Response

// CINEPULSE KONAĞI SHIM (kullanıcı 2026-10-29): gerçek CloudflareKiller WebView ile
// JS- challenge çözer; konakta WebView-Interceptor henüz bağlı değil — şimdilik
// düz geçiş (geçmişte çözülmüş cookie'ler de boş). Cloudflare korumalı sitelerde
// plugin kendi headless çözümüne düşer; NoClassDefFoundError riski böylece biter.
class CloudflareKiller : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response = chain.proceed(chain.request())

    fun getSavedCookies(): Map<String, String> = emptyMap()
}
