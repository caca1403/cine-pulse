package com.lagradost.cloudstream3.plugins

import android.content.Context
import android.content.res.Resources

// CINEPULSE KONAĞI SHIM (kullanıcı 2026-10-29): resmi Plugin sınıfının (cloudstream v4.8.0
// app/plugins/Plugin.kt) konağa bakan yüzü — BİREBİR imzalar, çünkü plugin dex'leri bunlara
// karşı derlenmiş:
//  - open class değil, abstract (VerifyError + yanlış örneklenme koruması)
//  - load(context) overload'u ZORUNLU: WioSinema gibi gerçek pluginler load(context: Context)
//    override ediyor; konağın argsız load()'ını çağırması hiçbir şeyi tetiklemiyordu
//    (sessiz 0 sağlayıcı — 2026-10-29 cihaz teşhisi).
//  - setOpenSettings: eski API plugin referansı (dex üye taraması), no-op korunur.
abstract class Plugin : BasePlugin() {
    /** Called when your plugin is loaded; varsayılan, cross-platform load()'u dener. */
    @Throws(Throwable::class)
    open fun load(context: Context) {
        load()
    }

    /** requiresResources belirtildiyse dolar; konak şimdilik null bırakıyor. */
    var resources: Resources? = null

    /**
     * Eski API `setOpenSettings(cb)` metoduydu, yeni API `openSettings` property —
     * JVM'de İKİSİ DE aynı imzadır: setOpenSettings(Function1)V. Property'yi olduğu gibi
     * bırakmak her iki tarafın dex referansını da karşılar (ayrı metot tanımlamak
     * platform-declaration-clash üretir — 2026-10-29 build dersi).
     */
    var openSettings: ((context: Context) -> Unit)? = null
}
