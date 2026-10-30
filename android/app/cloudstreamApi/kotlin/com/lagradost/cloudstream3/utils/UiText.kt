package com.lagradost.cloudstream3.utils

import android.content.Context

// CINEPULSE KONAĞI SHIM (kullanıcı 2026-10-29): CloudStream'in UiText soyutlamasının
// minimal karşılığı; eklentiler yalnız asString(Context) çağırıyor (dex analizi).
sealed class UiText {
    abstract fun asString(context: Context?): String
}

class DynamicString(val value: String) : UiText() {
    override fun asString(context: Context?): String = value
}

class ResourceString(private val resId: Int, private vararg val formatArgs: Any) : UiText() {
    override fun asString(context: Context?): String {
        return try {
            String.format(context?.getString(resId) ?: "", *formatArgs)
        } catch (e: Exception) {
            ""
        }
    }
}
