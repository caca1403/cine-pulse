package com.lagradost.cloudstream3

import android.app.Activity
import java.lang.ref.WeakReference

// CINEPULSE KONAĞI SHIM (kullanıcı 2026-10-29): cloudstream v4.8.0 uygulamasında
// CommonActivity bir `object`'tir ve plugin dex'leri INSTANCE alanını + getActivity()
// üyesini referanslıyor (WioSinema dex doğrulaması). Konakta aktivite takibi
// yapılmaz; host isterse setActivity ile besleyebilir, varsayılan null döner.
object CommonActivity {
    @Volatile
    private var activityRef: WeakReference<Activity>? = null

    fun setActivity(activity: Activity?) {
        activityRef = activity?.let { WeakReference(it) }
    }

    fun getActivity(): Activity? = activityRef?.get()
}
