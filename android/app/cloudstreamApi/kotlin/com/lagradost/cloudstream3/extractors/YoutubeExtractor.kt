package com.lagradost.cloudstream3.extractors

import com.lagradost.cloudstream3.SubtitleFile
import com.lagradost.cloudstream3.utils.ExtractorApi
import com.lagradost.cloudstream3.utils.ExtractorLink

// Vendored kütüphanedeki expect open class YoutubeExtractor'ın yerini alır.
// Orijinali NewPipeExtractor kullanır (ağır); CinePulse konağında YouTube
// eklentileri çalışsa da akış çıkaramaz — imza (name/mainUrl/getUrl) aynıdır.
open class YoutubeExtractor : ExtractorApi() {
    override val mainUrl = "https://www.youtube.com"
    override val name = "YouTube"
    override val requiresReferer = false

    override suspend fun getUrl(
        url: String,
        referer: String?,
        subtitleCallback: (SubtitleFile) -> Unit,
        callback: (ExtractorLink) -> Unit,
    ) {
        // Kasıtlı no-op: yeniplayer API'si (newPlayerApi) yüklenmediği için boş dönülür.
    }
}

class YoutubeShortLinkExtractor : YoutubeExtractor() {
    override val mainUrl = "https://youtu.be"
}

class YoutubeMobileExtractor : YoutubeExtractor() {
    override val mainUrl = "https://m.youtube.com"
}

class YoutubeNoCookieExtractor : YoutubeExtractor() {
    override val mainUrl = "https://www.youtube-nocookie.com"
}
