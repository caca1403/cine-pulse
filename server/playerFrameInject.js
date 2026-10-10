/* CinePulse - oynatici-alan sayfa enjeksiyonu (masaüstü yan sunucu).
 * Gercek tarayici disi istemciler icin: bolum sayfasi HTML'i alinir,
 * tum site-relative adresler yan sunucuya (/api/szd) baglanir, oynatici
 * alani gomulur ve bizim kaynaktan sunulur. Cerceve ayni-kaynak olur:
 * hem AJAX/calisma sitesi engeli hem de tam oynatici izolasyonu cozulur.
 * Cloudstream WebViewResolver'in sundugu gorunumun karsiligi. */

export const SZD_PLAYER_CSS = [
  'html,body{margin:0!important;padding:0!important;background:#000!important;overflow:auto!important;}',
  'body{font-family:inherit;}',
  '#embed{position:relative!important;width:100%!important;min-height:62vh!important;background:#000!important;}',
  '#embed iframe{width:100%!important;min-height:62vh!important;border:0!important;}',
  '[data-cinepulse-hidden]{display:none!important;}',
].join('');

export function isSzdEpisodePath(pathname = '') {
  return /\/\d+-sezon-\d+-bolum\.html$/i.test(pathname || '');
}

// Oynatici alanini ve menuyu birakir, diger her seyi gizler; ayrica sitenin
// kok-absolute AJAX adreslerini yan sunucuya cevirir (base etiketi kok-absolute
// yollari duzeltmez; bu olmadan alternatif menusu hic dolmaz).
function isolateScript() {
  return `(function(){
  var PREFIX = '/api/szd';
  function fixUrl(url){
    if(typeof url !== 'string' || !url) return url;
    if(/^[a-z][a-z0-9+.-]*:/i.test(url) || url.indexOf('//') === 0) return url;
    if(url.charAt(0) === '#' || url.indexOf('data:') === 0) return url;
    if(url.charAt(0) === '/'){
      if(url === PREFIX || url.indexOf(PREFIX + '/') === 0) return url;
      return PREFIX + url;
    }
    return url;
  }
  try {
    var xhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url){
      return xhrOpen.apply(this, [method, fixUrl(url)]);
    };
  } catch(e){}
  try {
    var origFetch = window.fetch;
    if (origFetch) {
      window.fetch = function(input, init){
        if (typeof input === 'string') input = fixUrl(input);
        return origFetch.call(this, input, init);
      };
    }
  } catch(e){}
  function keepOnly(el){
    if(!el) return;
    var node = el;
    while(node && node !== document.body && node.parentElement){
      var p = node.parentElement;
      var kids = p.children;
      for(var i=0;i<kids.length;i++){
        if(kids[i] !== node && kids[i] && kids[i].nodeType === 1){
          kids[i].setAttribute('data-cinepulse-hidden','1');
          kids[i].style.setProperty('display','none','important');
        }
      }
      try { p.style.setProperty('position','static','important'); p.style.setProperty('overflow','visible','important'); } catch(e2){}
      node = p;
    }
  }
  function isolate(){
    keepOnly(document.getElementById('embed'));
    keepOnly(document.getElementById('playerMenu'));
  }
  function ready(){ try { isolate(); } catch(e){} }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
  window.addEventListener('load', ready);
  var tries = 0;
  var t = setInterval(function(){ isolate(); if(++tries > 60) clearInterval(t); }, 250);
})();`;
}

export function injectSzdPlayerFrame(html, { alternativeId = '', language = '' } = {}) {
  if (!html || typeof html !== 'string' || html.length < 500) return html;
  let out = html;
  // Temel adres yan sunucuya: /js, /ajax, /img... istekleri de ayni-kaynak
  // olur; aksi halde sayfa JS'i CORS'a takilir ve oynatici hic acilmaz.
  if (!/<base\b/i.test(out)) {
    out = out.replace(/<head(\s[^>]*)?>/i, '<head$1><base href="/api/szd/">');
  } else {
    out = out.replace(/<base\b[^>]*>/i, '<base href="/api/szd/">');
  }
  const autoSelect = String(alternativeId || '').match(/^\d+$/)
    ? `<script>(function(){var id=${JSON.stringify(String(alternativeId))};var done=false;function sel(){if(done)return true;try{var items=document.querySelectorAll('#alternatif .menu [data-id]');for(var i=0;i<items.length;i++){if(String(items[i].dataset.id)===id){done=true;if(!items[i].classList.contains('active')&&!items[i].classList.contains('selected'))items[i].click();return true;}}}catch(e){}return false;}if(!sel()){var o=new MutationObserver(function(){if(sel())o.disconnect();});try{o.observe(document.body,{childList:true,subtree:true});}catch(e){}setTimeout(function(){try{o.disconnect();}catch(e){}},30000);}})();</script>`
    : '';
  const inject = `<style data-cinepulse-frame>${SZD_PLAYER_CSS}</style>${autoSelect}<script data-cinepulse-isolate>${isolateScript()}</script>`;
  if (/<\/head>/i.test(out)) out = out.replace(/<\/head>/i, `${inject}</head>`);
  else out = inject + out;
  return out;
}