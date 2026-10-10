/* ==========================================================================
   CinePulse Studio - Luna cihaz cozumleyici (sadece Android APK)
   Masaustunde sayfa yan sunucusu oynatici alanini gomup sunar; APK'da yan
   sunucu yok. Burada her adim cihazin kendi agindan (CapacitorHttp) atilir ve
   oynatici, sadece bir iframe iceren kendi HTML'imiz olarak kurulur:
     bolum sayfasi -> bid -> alternatifler -> oynatici iframe'si
   Dogrulama (Turnstile) gerektiginde oynatici yerine dogrulama cercevesi
   gosterilir; kullanici onaylayinca cihazda yeniden cozumlenip oynatici
   iframe'siyle degistirilir. Site sayfasi hic cerceveye girmez.
   ========================================================================== */

const SZD_ORIGIN = 'https://sezonlukdizi.cc';
const RECAPTCHA_PATH = '/ajax/reCAPTCHADATA.asp';

function escapeAttr(value) {
  return String(value || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function isNativeAndroid() {
  try {
    return Boolean(window.Capacitor?.isNativePlatform?.()) && window.Capacitor.getPlatform() === 'android';
  } catch (_) {
    return false;
  }
}

function toTurkishSlug(title) {
  if (!title) return '';
  return String(title)
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i')
    .replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/â/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/** Oynatici alani: sadece oynatici iframe'si, site kabugu yok. */
export function buildPlayerSrcdoc(embedUrl, { title = '', recaptcha = false } = {}) {
  const src = String(embedUrl || '');
  const frame = recaptcha
    ? `<iframe src="${escapeAttr(SZD_ORIGIN + RECAPTCHA_PATH)}" allow="autoplay; fullscreen; encrypted-media" allowfullscreen="true" referrerpolicy="origin" title="Dogrulama"></iframe>`
    : `<iframe src="${escapeAttr(src)}" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen="true" referrerpolicy="origin" title="${escapeAttr(title || 'Oynatici')}"></iframe>`;
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Oynatici</title>
<style>html,body{margin:0;padding:0;background:#000;height:100%;overflow:hidden}
#wrap{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#000}
iframe{border:0;width:100%;height:100%;display:block;background:#000}
#note{position:absolute;left:0;right:0;bottom:0;padding:.5rem .75rem;font:500 12px/1.4 system-ui,sans-serif;color:#9fb0c9;background:rgba(0,0,0,.55);text-align:center}
@media (min-aspect-ratio:1/1){#wrap{height:auto;bottom:0;top:auto;aspect-ratio:16/9;position:absolute;left:0;right:0}}</style>
</head><body><div id="wrap">${frame}</div>${recaptcha ? '<div id="note">Dogrulama tamamlandiginda oynatici otomatik acilir.</div>' : ''}</body></html>`;
}

function embedSrcFrom(payload) {
  const text = typeof payload === 'string' ? payload : (payload?.text || '');
  const m = text.match(/<iframe\b[^>]*(?:data-src|src)=["']([^"']+)["']/i);
  if (!m) return '';
  let src = m[1].trim();
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('//')) return `https:${src}`;
  if (src.startsWith('/')) return `${SZD_ORIGIN}${src}`;
  return src;
}

function isRecaptcha(src) {
  return /reCAPTCHA\.asp/i.test(String(src || ''));
}

function findBid(html) {
  const m = html.match(/data-id=["'](\d+)["']/i) || html.match(/bid\s*=\s*["']?(\d+)["']?/i) || html.match(/\bbid="(\d+)"/i);
  return m ? m[1] : '';
}

function pickAlternatives(data) {
  if (!Array.isArray(data)) return [];
  return data
    .filter((it) => it && it.id && !/pixel|filemoon/i.test(it.baslik || ''))
    .sort((a, b) => (b.kalite || 0) - (a.kalite || 0));
}

/**
 * Cihazda cozumler. Donus: [{ id, alternativeId, embedUrl, recaptcha }]
 * embedUrl bos ise dogrulama gerekiyordur.
 */
export async function resolveLunaOnDevice({ title, originalTitle, season = 1, episode = 1, isDub = true } = {}) {
  if (!isNativeAndroid()) return [];
  let session;
  try {
    session = await import('./platform/androidChallengeSolver.js');
  } catch (_) {
    return [];
  }
  const fetchText = session.fetchTextWithSession;
  if (typeof fetchText !== 'function') return [];

  const queries = [...new Set([title, originalTitle].filter((t) => t && String(t).trim().length > 1))];
  const slugs = [];
  for (const q of queries) {
    const base = toTurkishSlug(q);
    if (!base) continue;
    slugs.push(base, `${base}-izle`);
  }
  if (slugs.length === 0) return [];

  const dil = isDub ? '0' : '1';
  for (const slug of slugs.slice(0, 4)) {
    const pageUrl = `${SZD_ORIGIN}/${slug}/${season}-sezon-${episode}-bolum.html`;
    const page = await fetchText(pageUrl, { referer: `${SZD_ORIGIN}/`, timeoutMs: 12000 });
    if (!page?.text) continue;
    const bid = findBid(page.text);
    if (!bid) continue;

    const altRes = await fetchText(`${SZD_ORIGIN}/ajax/dataAlternatif22.asp`, {
      method: 'POST',
      body: `bid=${bid}&dil=${dil}`,
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      referer: pageUrl,
      timeoutMs: 12000
    });
    if (!altRes?.text) continue;
    let payload = null;
    try { payload = JSON.parse(altRes.text); } catch (_) { continue; }
    if (payload?.status !== 'success') continue;
    const alternatives = pickAlternatives(payload.data);
    if (alternatives.length === 0) continue;

    const out = [];
    for (const alt of alternatives.slice(0, 3)) {
      const embRes = await fetchText(`${SZD_ORIGIN}/ajax/dataEmbed22.asp`, {
        method: 'POST',
        body: `id=${alt.id}`,
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        referer: pageUrl,
        timeoutMs: 12000
      });
      const src = embedSrcFrom(embRes);
      if (!src) continue;
      out.push({
        id: String(alt.id),
        alternativeId: String(alt.id),
        providerLabel: alt.baslik || 'Oynatici',
        embedUrl: src,
        recaptcha: isRecaptcha(src),
        bid,
        pageUrl
      });
    }
    if (out.length > 0) return out;
  }
  return [];
}

/** Dogrulama sonrasi yeniden cozumleme (cerez WebView'da yazildi). */
export async function resolveLunaEmbedAfterVerify(item) {
  if (!item) return '';
  try {
    const sessionMod = await import('./platform/androidChallengeSolver.js');
  } catch (_) {
    return '';
  }
  const res = await sessionMod.fetchTextWithSession(`${SZD_ORIGIN}/ajax/dataEmbed22.asp`, {
    method: 'POST',
    body: `id=${item.alternativeId}`,
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    referer: item.pageUrl,
    timeoutMs: 12000
  });
  const src = embedSrcFrom(res);
  return src && !isRecaptcha(src) ? src : '';
}