package com.lagradost.cloudstream3

import com.lagradost.cloudstream3.utils.Event

// CINEPULSE KONAĞI SHIM (kullanıcı 2026-10-29): library'deki MainActivity.kt yalnız
// üst-seviye `app`/`insecureApp` verilerini taşır; eklentilerin MainActivity tipine
// ve Companion.getReloadHomeEvent()'e referansı var (dex analizi). Sınıf tanımı eklenir.
class MainActivity {
    companion object {
        val reloadHomeEvent = Event<Any?>()
    }
}
