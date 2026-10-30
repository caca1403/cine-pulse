package com.lagradost.cloudstream3

import android.content.Context

// CINEPULSE KONAĞI SHIM (kullanıcı 2026-10-29): CloudStream uygulamasının Application
// sınıfının yerini alan minimal karşılık. Eklentiler yalnız getContext()/setKey() çağırır
// (dex üye analiziyle doğrulandı); depolama bellek içi tutulur.
class CloudStreamApp {
    companion object {
        @Volatile
        var hostContext: Context? = null

        private val memory = java.util.concurrent.ConcurrentHashMap<String, Any?>()

        fun getContext(): Context? = hostContext

        fun setKey(key: String, value: Any?) {
            if (value == null) memory.remove(key) else memory[key] = value
        }

        fun getKey(key: String): Any? = memory[key]
    }
}
