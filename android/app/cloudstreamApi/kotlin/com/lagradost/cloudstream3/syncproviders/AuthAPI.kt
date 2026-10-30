package com.lagradost.cloudstream3.syncproviders

// CINEPULSE KONAĞI SHIM (kullanıcı 2026-10-29): AuthUser yalnız tip referansı olarak geçiyor.
interface AuthUser {
    val id: Int
    val name: String
}
