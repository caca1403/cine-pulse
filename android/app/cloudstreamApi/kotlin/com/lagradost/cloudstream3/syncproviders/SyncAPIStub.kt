package com.lagradost.cloudstream3.syncproviders

import com.lagradost.cloudstream3.utils.UiText

// CINEPULSE KONAĞI SHIM (kullanıcı 2026-10-29): senkronizasyon sağlayıcıları konağın
// kapsamı dışında; eklentilerin tip referansı + birkaç üyesi kadarı karşılanıyor
// (dex analizi: SyncRepo(SyncAPI).authUser, LibraryList.name/items,
// LibraryMetadata.getAllLibraryLists, AccountManager.Companion.simklApi).
abstract class SyncAPI {
    data class LibraryList(
        val name: UiText,
        val items: List<Pair<String, String>> = emptyList()
    )

    interface LibraryMetadata {
        fun getAllLibraryLists(): List<LibraryList>
    }
}
