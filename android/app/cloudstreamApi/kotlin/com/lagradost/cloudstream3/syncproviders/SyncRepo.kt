package com.lagradost.cloudstream3.syncproviders

// CINEPULSE KONAĞI SHIM (kullanıcı 2026-10-29): SyncRepo yalnız tip + authUser() ile referanlı.
class SyncRepo(val provider: SyncAPI) {
    fun authUser(): AuthUser? = null
}
