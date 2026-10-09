/* ==========================================================================
   YENİ KAYNAK ŞABLONU — kopyala, doldur, kaydet. Hepsi bu.
   1) Bu dosyayı kopyala:  ornekSite.js
   2) Aşağıdaki 5 alanı doldur
   3) providers/index.js içine 1 satır ekle: export './ornekSite.js'
   Detay sayfasında otomatik listelenir, tarz/badge aynı kalır.
   ========================================================================== */

import { registerProvider, fetchHtml, extractIframes, toSlug, cleanTitle } from './providerRegistry.js';

const BASES = [
  'https://ornek-site.com' // domain değişirse yeni domaini başa ekle, kod değişmez
];

async function fetchSources({ type, title, originalTitle, season = 1, episode = 1 }) {
  const query = cleanTitle(title || originalTitle);
  if (!query || query.length < 2) return [];
  const slug = toSlug(query);

  for (const base of BASES) {
    // ADIM 1: arama — sitenin arama URL desenini yaz
    // Örnekler: `${base}/search?q=${slug}` / `${base}/?s=${slug}` / `${base}/ara/${slug}`
    const searchHtml = await fetchHtml(`${base}/search?q=${encodeURIComponent(query)}`, base + '/');
    if (!searchHtml) continue;

    // ADIM 2: sonuç linkini yakala — 1 regex yeter
    const linkMatch = searchHtml.match(/href=["']((?:https?:[^"']+|\/[^"']*?)[^"']*)["']/i);
    if (!linkMatch) continue;
    let pageUrl = linkMatch[1];
    if (pageUrl.startsWith('/')) pageUrl = base + pageUrl;

    // ADIM 3: film/dizi sayfasındaki player iframe'ini al
    const pageHtml = await fetchHtml(pageUrl, base + '/');
    const iframes = extractIframes(pageHtml);
    if (!iframes.length) continue;

    // ADIM 4: stream listesini dön (CinePulse tarzı korunur)
    return iframes.slice(0, 3).map((embed, i) => ({
      id: `ornek_${slug}_${i}`,
      name: 'Örnek Site 1080p',
      displayName: 'Örnek Site',
      badge: '🎬 Örnek 1080p',
      source: 'Örnek',
      url: embed,
      streamUrl: embed,
      isIframe: true,
      type: 'embed',
      category: 'subtitled'
    }));
  }
  return [];
}

registerProvider({
  id: 'ornek',
  name: 'Örnek Site',
  baseUrls: BASES,
  priority: 11, // 0=HDFC, 1=DP, 2=DS ... 11 = yeni kaynaklar için ideal
  fetchSources
});
