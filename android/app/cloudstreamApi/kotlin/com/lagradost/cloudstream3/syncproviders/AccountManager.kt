package com.lagradost.cloudstream3.syncproviders

import com.lagradost.cloudstream3.syncproviders.providers.SimklApi

// CINEPULSE KONAĞI SHIM (kullanıcı 2026-10-29): eklentiler AccountManager.Companion.simklApi
// okuyor (dex analizi); gerçek senkron yok — tek örnek, devre dışı sağlayıcı.
class AccountManager {
    companion object {
        val simklApi = SimklApi()
    }
}
