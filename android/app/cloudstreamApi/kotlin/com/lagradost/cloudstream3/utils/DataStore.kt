package com.lagradost.cloudstream3.utils

import android.content.Context
import android.content.SharedPreferences

// CINEPULSE KONAĞI SHIM (kullanıcı 2026-10-29): eklentiler DataStore.getSharedPrefs(ctx)
// çağırıyor (dex analizi). Anahtar-depo şifreleme katmanı yok; ham SharedPreferences verilir.
object DataStore {
    fun getSharedPrefs(ctx: Context?): SharedPreferences? =
        ctx?.getSharedPreferences("cinepulse_cloudstream_store", Context.MODE_PRIVATE)
}
