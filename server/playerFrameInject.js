/* CinePulse - oynatici-alan sayfa enjeksiyonu (masaüstü yan sunucu).
 * Gercek tarayici disi istemciler icin: bolum sayfasi HTML'ialinir,
 * <base> + oynatici CSS'i + alternatif-secici gomulur ve bizim kaynaktan
 * sunulur. Cerceve ayni-kaynak olur: tam oynatici izolasyonu.
 * Cloudstream WebViewResolver'in sundugu gorunumun karsiligi. */
export const SZD_PLAYER_CSS = [
  'html,body{margin:0!important;padding:0!important;overflow:auto!important;background:#101318!important;}',
  'body>*{display:none!important;}',
  '#embed,#playerMenu{display:block!important;visibility:visible!important;}',
  '#playerMenu{position:sticky!important;top:0!important;z-index:50!important;}',
  '#embed{position:relative!important;width:100%!important;min-height:60vh!important;}',
  '#embed iframe{width:100%!important;min-height:60vh!important;border:0!important;}',
].join('');

export function isSzdEpisodePath(pathname = '') {
  return /\/\d+-sezon-\d+-bolum\.html$/i.test(pathname || '');
}

export function injectSzdPlayerFrame(html, { alternativeId = '', language = '' } = {}) {
  if (!html || typeof html !== 'string' || html.length < 500) return html;
  let out = html;
  // Göreli adresler bizim proxy üzerinden çalismaz; tabani siteye sabitle.
  if (!/<base\b/i.test(out)) {
    out = out.replace(/<head(\s[^>]*)?>/i, '<head$1><base href="https://sezonlukdizi.cc/">');
  }
  const autoSelect = String(alternativeId || '').match(/^\d+$/)
    ? `<script>(function(){var id=${JSON.stringify(String(alternativeId))};function sel(){try{var items=document.querySelectorAll('#alternatif .menu [data-id]');for(var i=0;i<items.length;i++){if(items[i].dataset.id===id){if(!items[i].classList.contains('selected'))items[i].click();return true;}}}catch(e){}return false;}if(!sel()){var o=new MutationObserver(function(){if(sel())o.disconnect();});try{o.observe(document.body,{childList:true,subtree:true});}catch(e){}setTimeout(function(){try{o.disconnect();}catch(e){}},20000);})();</script>`
    : '';
  const inject = `<style data-cinepulse-frame>${SZD_PLAYER_CSS}</style>${autoSelect}`;
  if (/<\/head>/i.test(out)) out = out.replace(/<\/head>/i, `${inject}</head>`);
  else out = inject + out;
  return out;
}
