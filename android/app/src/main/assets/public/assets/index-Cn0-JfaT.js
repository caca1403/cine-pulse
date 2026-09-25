(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function i(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(a){if(a.ep)return;a.ep=!0;const r=i(a);fetch(a.href,r)}})();function G(e=document){const t=window.lucide;if(!t?.icons||!t?.createElement||!e)return;const i="[data-lucide]:not(svg)",n=e.matches?.(i)?[e,...e.querySelectorAll(i)]:e.querySelectorAll(i);for(const a of n){const r=a.getAttribute("data-lucide"),o=r.replace(/(^|-)(\w)/g,(u,p,h)=>h.toUpperCase()),s=t.icons[o];if(!s)continue;const l=t.createElement(s);for(const{name:u,value:p}of a.attributes)u!=="class"&&l.setAttribute(u,p);l.classList.add("lucide",`lucide-${r}`);for(const u of a.classList)u!=="lucide"&&!u.startsWith("lucide-")&&l.classList.add(u);a.replaceWith(l)}}const ce={WATCH_HISTORY:"sineflix_watch_history_v1",FAVORITES:"sineflix_favorites_v1",WATCHLIST:"sineflix_watchlist_v1",USER_SETTINGS:"sineflix_user_settings_v1",ANIME_IDS:"sineflix_anime_ids_v1"};let vt=null;function Wo(){if(vt)return vt;try{if(typeof window>"u"||!window.localStorage)return vt=new Set,vt;const e=localStorage.getItem(ce.ANIME_IDS);if(!e)return vt=new Set,vt;const t=JSON.parse(e);return vt=new Set(Array.isArray(t)?t.map(String):[]),vt}catch{return vt=new Set,vt}}function _e(e){if(e)try{const t=Wo(),i=String(e);t.has(i)||(t.add(i),typeof window<"u"&&window.localStorage&&localStorage.setItem(ce.ANIME_IDS,JSON.stringify(Array.from(t))))}catch{}}function Fe(e){return e?Wo().has(String(e)):!1}let it=null,Xe=null,at=null,Gi=null,ti=null,Ji=null,Xi=null,jt=null,Li=null,vi=null,Wn=null,ct=null,ai=null,Kt=null,xt=null;function Ot(){Gi=null,ti=null,Ji=null,Xi=null}function Yo(){it=null,Xe=null,at=null,Ot(),jt=null,Li=null,vi=null,Wn=null,vt=null,ct=null,ai=null,Kt=null,xt=null}function Vt(){if(ct)return ct;const e=[{id:"prof_1",name:"Profilim",avatar:"user-circle",isKid:!1,color:"#f59e0b"},{id:"prof_kids",name:"Çocuk Modu 🎈",avatar:"baby",isKid:!0,color:"#38bdf8"}];try{if(typeof window>"u"||!window.localStorage)return ct=e,ct;const t=localStorage.getItem("sineflix_profiles_list_v1");if(!t)return ct=e,ct;let i=JSON.parse(t);return i.some(a=>a.id==="prof_cinema")&&(i=i.filter(a=>a.id!=="prof_cinema"),localStorage.setItem("sineflix_profiles_list_v1",JSON.stringify(i))),ct=i,ct}catch{return ct=e,ct}}function ja(e){try{if(ct=e,ai=null,typeof window>"u"||!window.localStorage)return;localStorage.setItem("sineflix_profiles_list_v1",JSON.stringify(e)),window.dispatchEvent(new CustomEvent("sineflix_profiles_updated"))}catch{}}function Vo(){try{return typeof window>"u"||!window.localStorage?!0:localStorage.getItem("cinepulse_onboarding_completed")==="true"}catch{return!0}}function Rc(){try{return typeof window>"u"||!window.localStorage?!0:localStorage.getItem("cinepulse_product_tour_completed")==="true"}catch{return!0}}function $c(){try{if(typeof window>"u"||!window.localStorage)return;localStorage.setItem("cinepulse_product_tour_completed","true")}catch{}}function Mc({name:e,avatar:t="user-circle",color:i="#f59e0b",isKid:n=!1}){try{if(typeof window>"u"||!window.localStorage)return;const a=(e||"").trim()||(n?"Çocuk":"Profilim");let r=Vt();const o=r.findIndex(l=>l.id==="prof_1"),s={id:"prof_1",name:a,avatar:t,color:i,isKid:!!n};return o!==-1?r[o]=s:r.unshift(s),ja(r),Yn("prof_1"),localStorage.setItem("cinepulse_onboarding_completed","true"),window.dispatchEvent(new CustomEvent("sineflix_profile_changed",{detail:{profileId:"prof_1"}})),s}catch{return null}}const zr="1403";function Pc(){try{return typeof window>"u"||!window.localStorage?zr:localStorage.getItem("cinepulse_admin_pin")||zr}catch{return zr}}function Bc(e){try{return typeof window>"u"||!window.localStorage||!e||String(e).length<4?!1:(localStorage.setItem("cinepulse_admin_pin",String(e)),!0)}catch{return!1}}function Dc(e){return String(e).trim()===Pc().trim()}function mr(){if(xt)return xt;const e=["clitoris","le clitoris","erotik","porn"];try{if(typeof window>"u"||!window.localStorage)return xt=e,e;const t=localStorage.getItem("cinepulse_blocked_content");return t?(xt=JSON.parse(t),xt):(xt=e,e)}catch{return xt=e,e}}function Nc(e){if(!e)return;const t=mr(),i=String(e).trim().toLowerCase();if(!t.includes(i)){t.push(i),xt=t;try{localStorage.setItem("cinepulse_blocked_content",JSON.stringify(t))}catch{}}}function Oc(e){if(!e)return;let t=mr();const i=String(e).trim().toLowerCase();t=t.filter(n=>String(n).toLowerCase()!==i),xt=t;try{localStorage.setItem("cinepulse_blocked_content",JSON.stringify(t))}catch{}}function zc(e){if(!e)return!1;const t=mr(),i=String(e.id||""),n=`${e.title||""} ${e.name||""} ${e.original_title||""} ${e.original_name||""}`.toLowerCase();return t.some(a=>{const r=String(a).toLowerCase().trim();return r?i===r?!0:n.includes(r):!1})}function hn(){if(ai)return ai;try{const e=Vt(),t=typeof window<"u"&&window.localStorage&&localStorage.getItem("sineflix_active_profile_id")||"prof_1";return ai=e.find(i=>i.id===t)||e[0],ai}catch{return{id:"prof_1",name:"Profilim",avatar:"user-circle",isKid:!1,color:"#f59e0b"}}}function Yn(e){try{if(typeof window>"u"||!window.localStorage)return;localStorage.setItem("sineflix_active_profile_id",e),ai=null,Yo(),window.dispatchEvent(new CustomEvent("sineflix_profile_changed",{detail:{profileId:e}}))}catch{}}function Ct(){return hn()?.isKid===!0}function Jt(e){if(!e||e.adult===!0||zc(e))return!1;const t=[27,80,10752,10768,53,18],i=e.genre_ids||(Array.isArray(e.genres)?e.genres.map(s=>typeof s=="object"?s.id:s):[]);if(i.some(s=>t.includes(Number(s))))return!1;const n=`${e.title||""} ${e.name||""} ${e.overview||""}`.toLowerCase();if(["cinayet","katil","vahşet","kanlı","erotik","dehşet","intikam","mafya","uyuşturucu","şiddet","tecavüz","seri katil","katliam","korku","kan donduran","murder","killer","horror","bloody","psychopath","terror","revenge","savaş","war","battle","death","ölüm"].some(s=>n.includes(s)))return!1;const r=[16,10751,10762];return i.some(s=>r.includes(Number(s)))}function xs(e=[]){return Array.isArray(e)?Ct()?e.filter(Jt):e:[]}function Hc({name:e,isKid:t=!1,avatar:i="user-circle",color:n="#f59e0b"}){const a=Vt(),r={id:`prof_${Date.now()}`,name:e.trim()||"Yeni Profil",avatar:i,isKid:!!t,color:n};return a.push(r),ja(a),r}function qc(e){if(e==="prof_1")return!1;let t=Vt();return t=t.filter(i=>i.id!==e),ja(t),hn()?.id===e&&Yn("prof_1"),!0}function Mt(e){if(e===ce.WATCH_HISTORY||e===ce.FAVORITES||e===ce.WATCHLIST){const t=hn();if(t&&t.id&&t.id!=="prof_1")return`${e}_${t.id}`}return e}function pt(e,t=[]){try{if(typeof window>"u"||!window.localStorage)return t;const i=Mt(e),n=localStorage.getItem(i);return n?JSON.parse(n):t}catch{return t}}const Fc="cinepulse_storage_v1",Ii="keyval_store";let bn=null;function Go(){return bn||(typeof window>"u"||!window.indexedDB?Promise.resolve(null):(bn=new Promise(e=>{try{const t=window.indexedDB.open(Fc,1);t.onupgradeneeded=()=>{const i=t.result;i.objectStoreNames.contains(Ii)||i.createObjectStore(Ii)},t.onsuccess=()=>e(t.result),t.onerror=()=>e(null)}catch{e(null)}}),bn))}async function Uc(e){try{const t=await Go();return t?new Promise(i=>{try{const r=t.transaction(Ii,"readonly").objectStore(Ii).get(e);r.onsuccess=()=>i(r.result!==void 0?r.result:null),r.onerror=()=>i(null)}catch{i(null)}}):null}catch{return null}}async function Qi(e,t){try{const i=await Go();return i?new Promise(n=>{try{const a=i.transaction(Ii,"readwrite");a.objectStore(Ii).put(t,e),a.oncomplete=()=>n(!0),a.onerror=()=>n(!1)}catch{n(!1)}}):!1}catch{return!1}}async function jc(){if(!(typeof window>"u"||!window.indexedDB))try{const e=Mt(ce.WATCH_HISTORY),t=await Uc(e);if(Array.isArray(t)&&t.length>0){const i=it&&it.length||0;t.length>=i&&(it=t.sort((n,a)=>(a.lastWatchedAt||0)-(n.lastWatchedAt||0)),Xe=null,at=null,Ot(),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{key:e,value:it}})))}}catch{}}typeof window<"u"&&setTimeout(jc,80);const $t=new Map;function Es(){if(!(typeof window>"u")){for(const[e,t]of $t.entries())try{t.timer&&clearTimeout(t.timer),Qi(e,t.value),window.localStorage&&localStorage.setItem(e,JSON.stringify(t.value))}catch{}$t.clear()}}typeof window<"u"&&(window.addEventListener("beforeunload",Es),window.addEventListener("pagehide",Es));function $e(e,t,i={}){try{if(typeof window>"u")return;const n=Mt(e);if(Qi(n,t),window.localStorage)if(i.isProgressUpdate){$t.has(n)&&clearTimeout($t.get(n).timer);const a=setTimeout(()=>{try{localStorage.setItem(n,JSON.stringify(t))}catch{}$t.delete(n)},2500);$t.set(n,{timer:a,value:t})}else{$t.has(n)&&(clearTimeout($t.get(n).timer),$t.delete(n));try{localStorage.setItem(n,JSON.stringify(t))}catch{}}window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{key:n,value:t,...i}}))}catch{}}const Jo=["anime","kimetsu","yaiba","iblis keser","demon slayer","naruto","boruto","shingeki","titan","titana saldırı","jujutsu","kaisen","one piece","death note","bleach","dragon ball","hunter x hunter","chainsaw man","tokyo ghoul","my hero academia","boku no hero","kahramanlık akademim","fullmetal","alchemist","simyacı","sword art online","solo leveling","black clover","vinland saga","spy x family","cyberpunk: edgerunners","haikyuu","one punch","berserk","mob psycho","overlord","evangelion","cowboy bebop","code geass","frieren","dr. stone","blue lock","steins;gate","jojo","kaiju no. 8","gintama","fairy tail","violet evergarden","hell's paradise","jigokuraku","dandadan","wind breaker","mushoku tensei","re:zero","delicious in dungeon","dungeon meshi","mashle","baki","hajime no ippo","slamdunk","slam dunk","kuroko","initial d","great teacher onizuka","monster","dororo","fire force","soul eater","noragami","erased","parasyte","psycho-pass","fate/zero","fate/stay","made in abyss","your lie in april","shigatsu wa kimi","anohana","toradora","clannad","classroom of the elite","elite sınıfı","no game no life","konosuba","slime datta ken","shield hero","kalkan kahramanı","goblin slayer","akame ga kill","kill la kill","gurren lagann","darling in the franxx","promised neverland","seven deadly sins","nanatsu no taizai","yedi ölümcül günah","tokyo revengers","blue exorcist","ao no exorcist","d.gray-man","inuyasha","yu yu hakusho","sailor moon","pokemon","digimon","yu-gi-oh","beyblade","captain tsubasa","tsubasa","record of ragnarok","shuumatsu no valkyrie","golden kamuy","dorohedoro","pluto","trigun","hellsing","elfen lied","rurouni kenshin","samurai champloo","fruits basket","horimiya","my dress-up darling","komi can't communicate","rent-a-girlfriend","kaguya-sama","lycoris recoil","zom 100","undead unluck","dead mount death play","seraph of the end","owari no seraph","bungo stray dogs","bungou stray dogs","assassination classroom","suikast sınıfı","black butler","kuroshitsuji","spirited away","ruhların kaçışı","howl's moving castle","yürüyen şato","my neighbor totoro","komşum totoro","princess mononoke","prenses mononoke","your name","kimi no na wa","senin adın","weathering with you","suzume","a silent voice","sessizliğin sesi","koe no katachi","akira","shangri-la frontier","oshi no ko","the eminence in shadow","bocchi the rock"];function Kc(e){return e?/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(e):!1}function lt(e){if(!e)return!1;if(e.isAnime===!0||e.type==="anime"||e.media_type==="anime"||e.id&&Fe(e.id))return!0;const i=(e.genre_ids||(Array.isArray(e.genres)?e.genres.map(r=>typeof r=="object"?r.id:r):[])).some(r=>Number(r)===16),n=e.original_language==="ja"||Array.isArray(e.origin_country)&&e.origin_country.includes("JP");if(i&&n||i&&(e.origin_country?.includes("JP")||e.original_language==="ja")||e.original_language==="ja"&&(i||Kc(e.original_name||e.original_title||e.title||e.name))||Array.isArray(e.genres)&&e.genres.map(o=>typeof o=="object"?o.name:String(o)).filter(Boolean).some(o=>/anime/i.test(o)))return e.id&&_e(e.id),!0;if(typeof e.id=="string"&&(e.id.startsWith("ta_")||e.id.startsWith("acx_")||e.id.startsWith("tra_")))return _e(e.id),!0;const a=(e.title||e.name||e.original_title||e.original_name||"").toLowerCase();for(const r of Jo)if(a.includes(r))return e.id&&_e(e.id),!0;return!1}function Ka(e){return e?e.isSeries===!0||e.type==="tv"||e.media_type==="tv"?!1:e.type==="movie"||e.media_type==="movie"?!0:e.first_air_date||e.number_of_seasons||e.episodesCount||Array.isArray(e.seasons)&&e.seasons.length>0||e.season>1||e.episode>1?!1:!!(e.release_date&&!e.first_air_date):!0}function Be(){return it||(it=pt(ce.WATCH_HISTORY,[]).sort((t,i)=>(i.lastWatchedAt||0)-(t.lastWatchedAt||0)),it)}async function Wc(){const e=Be();let t=!1;const i="4e44d9029b1270a757cddc766a1bcb63";let n=0;for(let a=0;a<e.length;a++){const r=e[a];if(r.isAnime||r.type==="anime"){r.id&&_e(r.id);continue}if(!(r.isAnime===!1&&r.type!=="anime")){if(Fe(r.id)||lt(r)){r.isAnime=!0,r.type="anime",_e(r.id),t=!0;continue}if(n<5&&r.id&&!isNaN(Number(r.id))){n++;try{const o=await fetch(`https://api.themoviedb.org/3/tv/${r.id}?api_key=${i}&language=tr-TR`);if(o.ok){const s=await o.json(),l=s.original_language==="ja"||Array.isArray(s.origin_country)&&s.origin_country.includes("JP"),u=Array.isArray(s.genres)&&s.genres.some(p=>p.id===16||/anim/i.test(p.name));l&&u&&(r.isAnime=!0,r.type="anime",r.isSeries=!0,r.original_language="ja",_e(r.id),t=!0)}}catch{}}}}t&&(Ot(),$e(ce.WATCH_HISTORY,e))}function gr(){if(Xe)return Xe;const e=Be();Xe=new Map,at=new Map;for(let t=0;t<e.length;t++){const i=e[t],n=`${i.id}_${i.season||1}_${i.episode||1}`;Xe.has(n)||Xe.set(n,i);const a=String(i.id);at.has(a)||at.set(a,i)}return Xe}function Vn(e){if(!e||typeof e!="string")return"";let t=e.replace(/^(undefined|null|\/undefined|\/null)$/i,"");if(!t||t.startsWith("data:")||t.startsWith("http"))return t;try{for(;t.includes("%");){const i=decodeURIComponent(t);if(i===t)break;t=i}}catch{}return t=t.replace(/^\/+/,"/"),t.startsWith("/")||(t=`/${t}`),t==="/"||t==="/null"||t==="/undefined"?"":t}function fn(e,t,i,n=[]){const a=n.find(u=>u.id==e&&(u.posterPath||u.poster_path));let r=t||(a?a.posterPath||a.poster_path:""),o=i||(a?a.backdropPath||a.backdrop_path:"");const s=Vn(r),l=Vn(o);return{resolvedPoster:s||"",resolvedBackdrop:l||""}}function Wa({id:e,title:t,posterPath:i,poster_path:n,backdropPath:a,backdrop_path:r,type:o,isAnime:s=!1,isSeries:l=!1,season:u=1,episode:p=1,currentTime:h=0,duration:g=0,completed:v=!1,genres:b=[],genre_ids:w=[],original_language:k="",origin_country:f=[],...y}){if(!e)return;const E=Be(),C=E.findIndex(D=>D.id==e&&D.season==u&&D.episode==p),x=E.find(D=>D.id==e),A=!!(s||o==="anime"||Fe(e)||C>=0&&(E[C].isAnime||E[C].type==="anime")||x&&(x.isAnime||x.type==="anime")||lt({id:e,title:t,type:o,genres:b,genre_ids:w,original_language:k,origin_country:f,...y}));A&&_e(e);const R=!!(l||o==="tv"||y.first_air_date||y.number_of_seasons||y.episodesCount||Array.isArray(y.seasons)&&y.seasons.length>0||u>1||p>1||C>=0&&(E[C].isSeries||E[C].type==="tv"||E[C].season>1||E[C].episode>1)||x&&(x.isSeries||x.type==="tv"||x.season>1||x.episode>1));let L=A?"anime":R?"tv":"movie";const{resolvedPoster:N,resolvedBackdrop:z}=fn(e,i||n,a||r,E),K=g>0?g:L==="movie"?6600:3e3,W=K>0?Math.min(100,Math.round(h/K*100)):0,O=v||W>=90,B={...y,id:e,title:t||(C>=0?E[C].title:x?x.title:"İçerik"),posterPath:N,poster_path:N,backdropPath:z,backdrop_path:z,type:L,isAnime:A,isSeries:R,genres:b&&b.length>0?b:C>=0?E[C].genres:x?x.genres:[],genre_ids:w&&w.length>0?w:C>=0?E[C].genre_ids:x?x.genre_ids:[],original_language:k||(C>=0?E[C].original_language:x?x.original_language:""),origin_country:f&&f.length>0?f:C>=0?E[C].origin_country:x?x.origin_country:[],season:Number(u),episode:Number(p),currentTime:Math.round(h),duration:Math.round(K),progressPercent:W,completed:O,lastWatchedAt:y.lastWatchedAt?Number(y.lastWatchedAt):Date.now()};C>=0?E[C]=B:E.unshift(B),E.sort((D,J)=>(J.lastWatchedAt||0)-(D.lastWatchedAt||0)),it=E,Xe&&Xe.set(`${e}_${u}_${p}`,B),at&&at.set(String(e),B),Ot(),$e(ce.WATCH_HISTORY,E,{isProgressUpdate:!0})}function Xo(e=[]){if(!Array.isArray(e)||e.length===0)return;const t=Be(),i=new Map;for(let o=0;o<t.length;o++){const s=t[o],l=`${s.id}_${s.season||1}_${s.episode||1}`;i.set(l,s)}for(const o of e){if(!o||!o.id)continue;const s=Number(o.season||1),l=Number(o.episode||1),u=`${o.id}_${s}_${l}`,p=i.get(u);if(p&&p.lastWatchedAt&&o.lastWatchedAt&&p.lastWatchedAt>o.lastWatchedAt&&p.completed&&o.completed)continue;const h=!!(o.isAnime||o.type==="anime"||Fe(o.id)||p&&(p.isAnime||p.type==="anime")||lt(o));h&&_e(o.id);const g=!!(o.isSeries||o.type==="tv"||o.first_air_date||s>1||l>1||p&&(p.isSeries||p.type==="tv")),v=h?"anime":g?"tv":"movie",{resolvedPoster:b,resolvedBackdrop:w}=fn(o.id,o.posterPath||o.poster_path,o.backdropPath||o.backdrop_path,t),k=o.duration>0?o.duration:v==="movie"?6600:3e3,f=o.currentTime!==void 0?o.currentTime:o.completed?k:0,y=o.progressPercent!==void 0?o.progressPercent:k>0?Math.min(100,Math.round(f/k*100)):0,E=o.completed===!1?!1:o.completed||y>=90,C={...p||{},...o,id:o.id,title:o.title||p?.title||"İçerik",posterPath:b,poster_path:b,backdropPath:w,backdrop_path:w,type:v,isAnime:h,isSeries:g,season:s,episode:l,currentTime:Math.round(f),duration:Math.round(k),progressPercent:y,completed:E,lastWatchedAt:o.lastWatchedAt?Number(o.lastWatchedAt):p?.lastWatchedAt||Date.now()};i.set(u,C)}const n=Array.from(i.values()).sort((o,s)=>(s.lastWatchedAt||0)-(o.lastWatchedAt||0));it=n,Xe=null,at=null,Ot();const a=n.filter(o=>!o.completed).length,r=n.filter(o=>o.completed).length;a>0,$e(ce.WATCH_HISTORY,n)}function Yc(e,t=1,i=1){let n=Be();n=n.filter(a=>!(a.id==e&&a.season==t&&a.episode==i)),it=n,Xe&&Xe.delete(`${e}_${t}_${i}`),Ot(),$e(ce.WATCH_HISTORY,n)}function va(e){let t=Be();t=t.filter(i=>i.id!=e),it=t,Xe=null,Ot(),$e(ce.WATCH_HISTORY,t)}function Ts(){let e=Be();e=e.filter(t=>!t.completed&&t.progressPercent<90),$e(ce.WATCH_HISTORY,e)}function Vc(){let e=Be();const t=e.length;return e=e.filter(i=>!(i.currentTime===1e3&&i.duration===1e3)),it=e,Xe=null,Ot(),$e(ce.WATCH_HISTORY,e),t-e.length}function Gt(e,t=1,i=1){return gr().get(`${e}_${t}_${i}`)||null}function sn(e,t=1,i=1){const n=Gt(e,t,i);return!!(n&&(n.completed||n.progressPercent>=90))}function Zo(e,t=1,i=1,n=!0,a={}){const r=Be(),o=r.findIndex(b=>b.id==e&&b.season==t&&b.episode==i),s=r.find(b=>b.id==e),l=!!(a.isAnime||a.type==="anime"||Fe(e)||o>=0&&(r[o].isAnime||r[o].type==="anime")||s&&(s.isAnime||s.type==="anime")||lt({id:e,title:a.title,...a}));l&&_e(e);const u=a.type==="movie"&&!l,p=a.duration||(u?6600:3e3),{resolvedPoster:h,resolvedBackdrop:g}=fn(e,a.posterPath||a.poster_path,a.backdropPath||a.backdrop_path,r),v={id:e,title:a.title||(o>=0?r[o].title:"İçerik"),posterPath:h,poster_path:h,backdropPath:g,backdrop_path:g,type:l?"anime":u?"movie":"tv",isAnime:l,isSeries:!u,season:Number(t),episode:Number(i),currentTime:n?p:0,duration:p,progressPercent:n?100:0,completed:!!n,lastWatchedAt:Date.now()};o>=0?r[o]=v:r.push(v),$e(ce.WATCH_HISTORY,r)}function If(e,t=!0,i={}){Zo(e,1,1,t,{...i,type:i.type||"movie"})}function Qo(e,t=1,i=1,n={}){const a=sn(e,t,i);return Zo(e,t,i,!a,n),{completed:!a}}function Gc(e,t=[],i=!0,n={}){const a=Be(),r=n.title||"Dizi",o=!!(n.isAnime||n.type==="anime"||Fe(e)||lt({id:e,title:r}));o&&_e(e);const s=o?"anime":"tv",l=n.duration||3e3,{resolvedPoster:u,resolvedBackdrop:p}=fn(e,n.posterPath||n.poster_path,n.backdropPath||n.backdrop_path,a);for(const h of t){const g=h.season_number;if(g===0&&t.length>1)continue;const v=h.episode_count||10;for(let b=1;b<=v;b++){const w=a.findIndex(f=>f.id==e&&f.season==g&&f.episode==b),k={id:e,title:r,posterPath:u,poster_path:u,backdropPath:p,backdrop_path:p,type:s,isAnime:o,isSeries:!0,season:Number(g),episode:b,currentTime:i?l:0,duration:l,progressPercent:i?100:0,completed:!!i,lastWatchedAt:Date.now()};w>=0?a[w]=k:a.push(k)}}$e(ce.WATCH_HISTORY,a)}function Jc(e,t,i=10,n=!0,a={}){const r=Be(),o=a.title||"Dizi",s=!!(a.isAnime||a.type==="anime"||Fe(e)||lt({id:e,title:o}));s&&_e(e);const l=s?"anime":"tv",u=a.duration||3e3,{resolvedPoster:p,resolvedBackdrop:h}=fn(e,a.posterPath||a.poster_path,a.backdropPath||a.backdrop_path,r);for(let g=1;g<=i;g++){const v=r.findIndex(w=>w.id==e&&w.season==t&&w.episode==g),b={id:e,title:o,posterPath:p,poster_path:p,backdropPath:h,backdrop_path:h,type:l,isAnime:s,isSeries:!0,season:Number(t),episode:g,currentTime:n?u:0,duration:u,progressPercent:n?100:0,completed:!!n,lastWatchedAt:Date.now()};v>=0?r[v]=b:r.push(b)}$e(ce.WATCH_HISTORY,r)}function Hr(e,t=[]){if(!t||t.length===0)return sn(e,1,1);const i=gr();for(const n of t){const a=n.season_number;if(a===0&&t.length>1)continue;const r=n.episode_count||1;for(let o=1;o<=r;o++){const s=i.get(`${e}_${a}_${o}`);if(!s||!s.completed&&s.progressPercent<90)return!1}}return!0}function qr(e,t,i=10){const n=gr();for(let a=1;a<=i;a++){const r=n.get(`${e}_${t}_${a}`);if(!r||!r.completed&&r.progressPercent<90)return!1}return!0}function ba(e,t=1,i=1,n=1500,a={}){const r=!!(a.isAnime||a.type==="anime"||Fe(e)||lt({id:e,title:a.title,...a}));r&&_e(e);const o=a.type==="movie"&&!r,s=a.duration||(o?6600:3e3),l=n||Math.round(s*.5);return Wa({id:e,title:a.title||"İçerik",posterPath:a.posterPath||a.poster_path||"",backdropPath:a.backdropPath||a.backdrop_path||"",type:r?"anime":o?"movie":"tv",isAnime:r,isSeries:!o,season:t,episode:i,currentTime:l,duration:s,completed:!1})}function Fr(e){return e?(at||gr(),at&&at.has(String(e))?at.get(String(e)):Be().find(i=>i.id==e)||null):null}function ii(e){if(!e||e<=0)return"";const t=Math.floor(e/60),i=Math.floor(e%60);if(t>=60){const n=Math.floor(t/60),a=t%60;return`${n}sa ${a>0?a+"dk":""}`}return`${t}:${i<10?"0":""}${i}`}function As(e,t){(!t||t<=0)&&(t=3e3);const i=Math.max(0,t-(e||0)),n=Math.round(i/60);if(n<=0)return"Bitti";if(n>=60){const a=Math.floor(n/60),r=n%60;return`${a}sa ${r>0?r+"dk":""} kaldı`}return`${n} dk kaldı`}function Xc(e){if(!e||e<=0)return"0 dakika";const t=Math.floor(e/86400),i=Math.floor(e%86400/3600),n=Math.floor(e%3600/60),a=[];return t>0&&a.push(`${t} gün`),i>0&&a.push(`${i} saat`),(n>0||a.length===0)&&a.push(`${n} dk`),a.join(" ")}function Cs(){if(Xi)return Xi;const e=Be();let t=0,i=0,n=0;for(const r of e){const o=Ka(r),s=r.duration&&r.duration>0?r.duration:o?6600:3e3;r.completed?t+=s:r.currentTime>0?t+=r.currentTime:r.progressPercent&&r.progressPercent>0?t+=Math.round(r.progressPercent/100*s):t+=s,o?i++:n++}const a=Xc(t);return Xi={totalSeconds:t,totalMinutes:Math.floor(t/60),totalHours:(t/3600).toFixed(1),formattedTotalTime:a,formattedTotal:a,moviesCount:i,totalMovies:i,episodesCount:n,totalEpisodes:n,totalEntries:e.length},Xi}function Bn(){if(ti)return ti;const e=Be();if(!e||e.length===0)return ti=[],ti;const t=new Map;for(const n of e){const a=n.id;t.has(a)||t.set(a,[]),t.get(a).push(n)}const i=[];for(const[n,a]of t.entries()){a.sort((l,u)=>(u.lastWatchedAt||0)-(l.lastWatchedAt||0));const r=a[0],o=!!(r.isAnime||r.type==="anime"||Fe(r.id)||lt(r));if(o&&_e(r.id),a.some(l=>l.isSeries===!0||l.type==="tv"||l.type==="anime"||l.first_air_date||l.number_of_seasons||l.season&&l.season>1||l.episode&&l.episode>1||Array.isArray(l.seasons)&&l.seasons.length>0)){if(a.every(L=>L.completed||L.progressPercent>=85))continue;const l=a.find(L=>!L.completed&&L.currentTime>0&&L.progressPercent<100);let u=l?l.season||1:r.season||1;const p=new Set;for(const L of a)L.season===u&&(L.completed||L.progressPercent>=90)&&p.add(L.episode);let h=1,g=!1,v=0,b=r;if(l&&l.season===u)h=l.episode||1,g=!0,v=l.currentTime||0,b=l;else{for(;p.has(h)&&h<=999;)h++;const L=a.find(N=>N.season===u&&N.episode===h);L&&!L.completed&&L.currentTime>0&&(g=!0,v=L.currentTime,b=L)}const w=a.find(L=>L.number_of_seasons||L.status||Array.isArray(L.seasons)&&L.seasons.length>0)||r,k=w.status==="Ended"||w.status==="Canceled",y=(Array.isArray(w.seasons)?w.seasons.find(L=>L.season_number===u):null)?.episode_count||w.season_episodes_count,E=w.number_of_seasons||(Array.isArray(w.seasons)?w.seasons.filter(L=>L.season_number>0).length:0);if(y&&h>y){if(E&&u<E)u++,h=1,g=!1,v=0;else if(k&&!g)continue}if(k&&w.number_of_episodes&&!g&&a.filter(N=>N.completed||N.progressPercent>=90).length>=w.number_of_episodes||p.size===0&&!g&&r.currentTime<=0)continue;const C=b.duration||3e3,x=As(v,C),A=o?"Anime Dizisi • ":"";let R="";g&&v>0?R=`${A}S${u} B${h} • Kaldığın: ${ii(v)} • ${x}`:p.size>0||h>1?R=`${A}S${u} B${h} • Sıradaki Bölüm`:R=`${A}S${u} B${h} • Sıradaki Bölüm`,i.push({...r,...b,id:r.id,title:r.title||b.title,posterPath:r.posterPath||b.posterPath,poster_path:r.poster_path||b.poster_path,backdropPath:r.backdropPath||b.backdropPath,backdrop_path:r.backdrop_path||b.backdrop_path,type:o?"anime":"tv",isAnime:o,isSeries:!0,season:u,episode:h,currentTime:g?v:0,subtitle:R})}else{if(r.completed||r.progressPercent>=90)continue;if(r.currentTime>0){const u=r.duration||6600,p=As(r.currentTime,u),h=o?"Anime Filmi • ":"";i.push({...r,type:o?"anime":"movie",isAnime:o,isSeries:!1,subtitle:`${h}Kaldığın: ${ii(r.currentTime)} • ${p}`})}}}return i.sort((n,a)=>(a.lastWatchedAt||0)-(n.lastWatchedAt||0)),ti=i,ti}function Ur(){if(Ji)return Ji;const e=Be(),t=new Map;for(const n of e){const a=n.id;t.has(a)||t.set(a,[]),t.get(a).push(n)}const i=[];for(const[n,a]of t.entries()){a.sort((l,u)=>(u.lastWatchedAt||0)-(l.lastWatchedAt||0));const r=a[0],o=!!(r.isAnime||r.type==="anime"||Fe(r.id)||lt(r));o&&_e(r.id),Ka(r)?(r.completed||r.progressPercent>=90)&&i.push({...r,type:o?"anime":"movie",isAnime:o,isSeries:!1,completed:!0,subtitle:o?"✓ Anime Filmi İzlendi":"✓ Film İzlendi"}):a.every(u=>u.completed||u.progressPercent>=85)&&a.length>0&&i.push({...r,type:o?"anime":"tv",isAnime:o,isSeries:!0,completed:!0,subtitle:o?`✓ ${a.length} Bölüm Anime İzlendi`:`✓ ${a.length} Bölüm İzlendi`})}return i.sort((n,a)=>(a.lastWatchedAt||0)-(n.lastWatchedAt||0)),Ji=i,Ji}function Ls(){if(Gi)return Gi;const e=Be(),t=new Map;for(const n of e){const a=n.id;t.has(a)||t.set(a,[]),t.get(a).push(n)}const i=[];for(const[n,a]of t.entries()){a.sort((u,p)=>(p.lastWatchedAt||0)-(u.lastWatchedAt||0));const r=a[0],o=!!(r.isAnime||r.type==="anime"||Fe(r.id)||lt(r));o&&_e(r.id);const s=Ka(r),l=o?"anime":s?"movie":"tv";if(s){const u=o?"Anime Filmi • ":"";i.push({...r,type:l,isAnime:o,isSeries:!1,subtitle:r.completed?`✓ ${u}İzlendi`:r.progressPercent>0?`${u}%${r.progressPercent} İzlendi`:u.replace(" • ","")})}else{const u=a.filter(h=>h.completed||h.progressPercent>=85).length,p=o?"Anime Dizisi • ":"";i.push({...r,type:l,isAnime:o,isSeries:!0,subtitle:u>0?`${p}${u} Bölüm İzlendi`:`${p}S${r.season||1} B${r.episode||1}`})}}return i.sort((n,a)=>(a.lastWatchedAt||0)-(n.lastWatchedAt||0)),Gi=i,Gi}function Is(){return Bn()}function el(e){if(!e)return e;let t=e.type;const i=!!(e.isAnime||e.type==="anime"||Fe(e.id)||lt(e));i?(t="anime",e.id&&_e(e.id)):(!t||t==="movie")&&(e.isSeries||e.first_air_date||e.media_type==="tv"||e.number_of_seasons||e.episodesCount||!e.title&&e.name?t="tv":t=t||"movie");const n=!!(e.isSeries!==void 0?e.isSeries:t==="tv"||e.first_air_date||e.number_of_seasons||e.episodesCount||e.season&&e.season>1||e.episode&&e.episode>1),a=Vn(e.poster_path||e.posterPath||e.poster||""),r=Vn(e.backdrop_path||e.backdropPath||e.backdrop||"");return{...e,type:t,isAnime:i,isSeries:n,poster_path:a,posterPath:a,backdrop_path:r,backdropPath:r}}function Wt(){return jt||(jt=pt(ce.FAVORITES,[]).map(el),Li=new Set(jt.map(t=>String(t.id))),jt)}function Zc(e){return e?(Li||Wt(),Li.has(String(e))):!1}function Qc(e){if(!e||!e.id)return!1;let t=Wt();const i=t.findIndex(a=>a.id==e.id);let n=!1;if(i>=0)t.splice(i,1);else{const a=!!(e.isAnime||e.type==="anime"||Fe(e.id)||lt(e));a&&_e(e.id);let r=a?"anime":e.type;r||(r=e.first_air_date||e.media_type==="tv"||e.number_of_seasons||!e.title&&e.name?"tv":"movie");const o=e.poster_path||e.posterPath||e.poster||"",s=e.backdrop_path||e.backdropPath||e.backdrop||"";t.unshift({id:e.id,title:e.title||e.name||"İsimsiz",poster_path:o,posterPath:o,backdrop_path:s,backdropPath:s,vote_average:e.vote_average||e.voteAverage||8,release_date:e.release_date||e.first_air_date||"",first_air_date:e.first_air_date||"",genre_ids:e.genre_ids||(Array.isArray(e.genres)?e.genres.map(l=>typeof l=="object"?l.id:l):[]),genres:e.genres||[],original_language:e.original_language||"",origin_country:e.origin_country||[],isAnime:a,type:r,addedAt:Date.now()}),n=!0}return jt=t,Li=new Set(t.map(a=>String(a.id))),$e(ce.FAVORITES,t),n}function ed(e){let t=Wt();return t=t.filter(i=>i.id!=e),jt=t,Li=new Set(t.map(i=>String(i.id))),$e(ce.FAVORITES,t),t}function Yt(){return vi||(vi=pt(ce.WATCHLIST,[]).map(el),Wn=new Set(vi.map(t=>String(t.id))),vi)}function Ya(e){return e?(Wn||Yt(),Wn.has(String(e))):!1}function tl(e){if(!e||!e.id)return!1;let t=Yt();const i=t.findIndex(a=>a.id==e.id);let n=!1;if(i>=0)t.splice(i,1);else{const a=!!(e.isAnime||e.type==="anime"||Fe(e.id)||lt(e));a&&_e(e.id);let r=a?"anime":e.type;r||(r=e.first_air_date||e.media_type==="tv"||e.number_of_seasons||!e.title&&e.name?"tv":"movie");const o=e.poster_path||e.posterPath||e.poster||"",s=e.backdrop_path||e.backdropPath||e.backdrop||"";t.unshift({id:e.id,title:e.title||e.name||"İsimsiz",poster_path:o,posterPath:o,backdrop_path:s,backdropPath:s,vote_average:e.vote_average||e.voteAverage||8,release_date:e.release_date||e.first_air_date||"",first_air_date:e.first_air_date||"",genre_ids:e.genre_ids||(Array.isArray(e.genres)?e.genres.map(l=>typeof l=="object"?l.id:l):[]),genres:e.genres||[],original_language:e.original_language||"",origin_country:e.origin_country||[],isAnime:a,type:r,addedAt:Date.now()}),n=!0}return $e(ce.WATCHLIST,t),n}function td(e){let t=Yt();return t=t.filter(i=>i.id!=e),$e(ce.WATCHLIST,t),t}function id(){it=[],Xe=new Map,at=new Map,Ot(),$e(ce.WATCH_HISTORY,[])}function nd(e,t=1,i=1){return Yc(e,t,i)}function ft(){return Kt||(Kt=pt(ce.USER_SETTINGS,{autoplayNext:!0,preferredResolution:"1080p",theme:"dark",subtitlesEnabled:!0,cardLayout:"portrait",hoverPreviewsEnabled:!0,trailersEnabled:!0}),Kt)}function il(e){Kt={...ft(),...e},$e(ce.USER_SETTINGS,Kt),typeof window<"u"&&window.dispatchEvent(new CustomEvent("cinepulse_settings_changed",{detail:Kt}))}function nl(){const e=pt(ce.WATCH_HISTORY,[]),t=pt(ce.FAVORITES,[]),i=pt(ce.WATCHLIST,[]),n=pt(ce.USER_SETTINGS,{}),a={version:"1.0.0",exportDate:new Date().toISOString(),appName:"CinePulse Studio",watchHistory:e,favorites:t,watchlist:i,userSettings:n,data:{watchHistory:e,favorites:t,watchlist:i,userSettings:n}},r=JSON.stringify(a,null,2),o=new Blob([r],{type:"application/json;charset=utf-8"}),s=URL.createObjectURL(o),l=document.createElement("a");l.href=s,l.download=`cinepulse_yedek_${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(l),l.click(),setTimeout(()=>{document.body.removeChild(l),URL.revokeObjectURL(s)},1e3)}function rl(e,t="merge"){try{let i=null;if(typeof e=="string"?i=JSON.parse(e.trim()):typeof e=="object"&&e!==null&&(i=e),!i)throw new Error("Geçersiz veya boş yedek dosyası.");let n=[],a=[],r=[],o={};if(Array.isArray(i)?n=i:typeof i=="object"&&(n=i.watchHistory||i.data?.watchHistory||i.sineflix_watch_history_v1||i.history||[],a=i.favorites||i.data?.favorites||i.sineflix_favorites_v1||[],r=i.watchlist||i.data?.watchlist||i.sineflix_watchlist_v1||[],o=i.userSettings||i.data?.userSettings||i.sineflix_user_settings_v1||{}),Array.isArray(n)||(n=[]),Array.isArray(a)||(a=[]),Array.isArray(r)||(r=[]),t==="replace")$e(ce.WATCH_HISTORY,n),$e(ce.FAVORITES,a),$e(ce.WATCHLIST,r),o&&typeof o=="object"&&$e(ce.USER_SETTINGS,o);else{const s=pt(ce.WATCH_HISTORY,[]),l=new Map;s.forEach(w=>{const k=`${w.id}_${w.season||1}_${w.episode||1}`;l.set(k,w)}),n.forEach(w=>{const k=`${w.id}_${w.season||1}_${w.episode||1}`;if(!l.has(k))l.set(k,w);else{const f=l.get(k);((w.lastWatchedAt||0)>=(f.lastWatchedAt||0)||w.completed)&&l.set(k,{...f,...w})}});const u=Array.from(l.values()).sort((w,k)=>(k.lastWatchedAt||0)-(w.lastWatchedAt||0));$e(ce.WATCH_HISTORY,u);const p=pt(ce.FAVORITES,[]),h=new Map;p.forEach(w=>h.set(String(w.id),w)),a.forEach(w=>{h.has(String(w.id))||h.set(String(w.id),w)}),$e(ce.FAVORITES,Array.from(h.values()));const g=pt(ce.WATCHLIST,[]),v=new Map;g.forEach(w=>v.set(String(w.id),w)),r.forEach(w=>{v.has(String(w.id))||v.set(String(w.id),w)}),$e(ce.WATCHLIST,Array.from(v.values()));const b=pt(ce.USER_SETTINGS,{});$e(ce.USER_SETTINGS,{...b,...o})}return window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{action:"import"}})),window.dispatchEvent(new CustomEvent("cinepulse_data_changed",{detail:{action:"import"}})),window.dispatchEvent(new CustomEvent("cinepulse_data_changed",{detail:{action:"import"}})),{success:!0,countHistory:n.length,countFavs:a.length,countWatchlist:r.length,message:`${n.length} izleme kaydı ve ${a.length} favori başarıyla aktarıldı.`}}catch(i){return{success:!1,error:i.message,message:"Yedek dosyası okunamadı: "+i.message}}}function rd(){const e=Be(),t=Wt(),i=Yt(),n=JSON.stringify({history:e,favorites:t,watchlist:i}),a=new Blob([n]).size,r=(a/1024).toFixed(1);return{historyCount:e.length,favoritesCount:t.length,watchlistCount:i.length,bytes:a,kb:r}}function ad(){Yo();try{Qi(Mt(ce.WATCH_HISTORY),[]),Qi(Mt(ce.FAVORITES),[]),Qi(Mt(ce.WATCHLIST),[])}catch{}typeof window<"u"&&window.localStorage&&(localStorage.removeItem(Mt(ce.WATCH_HISTORY)),localStorage.removeItem(Mt(ce.FAVORITES)),localStorage.removeItem(Mt(ce.WATCHLIST))),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{cleared:!0}}))}function sd(){if(!(typeof window>"u"||!window.localStorage))try{localStorage.removeItem("cinepulse_epg_live_cache"),localStorage.removeItem("sineflix_epg_cache_v2");for(let t=0;t<localStorage.length;t++){const i=localStorage.key(t);i&&(i.startsWith("cinepulse_home_fast_")||i.startsWith("sineflix_home_fast_"))&&localStorage.removeItem(i)}const e=localStorage.getItem("sineflix_notifications_v1");if(e)try{const t=JSON.parse(e);Array.isArray(t)&&t.length>25&&localStorage.setItem("sineflix_notifications_v1",JSON.stringify(t.slice(0,25)))}catch{}}catch{}}sd();const od="https://api.themoviedb.org/3",Va=["4e44d9029b1270a757cddc766a1bcb63","844dba0bfd8f3a4f3799f6130ef9e335"];let wa=0;function ld(){return Va[wa]}function Rs(){wa=(wa+1)%Va.length}const Ze={POSTER_SMALL:"https://image.tmdb.org/t/p/w185",POSTER_MEDIUM:"https://image.tmdb.org/t/p/w342",BACKDROP_LARGE:"https://image.tmdb.org/t/p/w780",BACKDROP_XLARGE:"https://image.tmdb.org/t/p/w1280",BACKDROP_ORIGINAL:"https://image.tmdb.org/t/p/original",STILL_MEDIUM:"https://image.tmdb.org/t/p/w300"},cd='<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750"><rect width="500" height="750" fill="#0b0f19"/><circle cx="250" cy="300" r="160" fill="#f59e0b" opacity="0.25"/><g transform="translate(190, 230) scale(2.5)" fill="none" stroke="#f59e0b" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></g><text x="250" y="430" font-family="sans-serif" font-weight="800" font-size="30" fill="#ffffff" text-anchor="middle">Cine<tspan fill="#f59e0b">Pulse</tspan></text><text x="250" y="470" font-family="sans-serif" font-weight="500" font-size="16" fill="#64748b" text-anchor="middle">Görsel Yüklenemedi</text></svg>',on=`data:image/svg+xml,${encodeURIComponent(cd)}`,dd='<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#1e293b"/><circle cx="50" cy="40" r="18" fill="#64748b"/><path d="M 20 85 C 20 65, 80 65, 80 85 Z" fill="#64748b"/></svg>',Gn=`data:image/svg+xml,${encodeURIComponent(dd)}`;function st(e,t=Ze.POSTER_MEDIUM){if(!e||e==="null"||e==="undefined"||e==="")return on;if(e.startsWith("http")||e.startsWith("data:"))return e;let i=e;try{for(;i.includes("%");){const n=decodeURIComponent(i);if(n===i)break;i=n}}catch{}return i=i.replace(/^\/+/,"/"),i.startsWith("/")||(i=`/${i}`),i==="/"||i==="/null"||i==="/undefined"?on:`${t}${i}`}const jr={};async function Ga(e){if(!e||e.trim().length===0)return"";if(jr[e])return jr[e];try{const t=`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=tr&dt=t&q=${encodeURIComponent(e)}`,i=await fetch(t,{signal:AbortSignal.timeout(1200)});if(i.ok){const n=await i.json();if(n&&n[0]){const a=n[0].map(r=>r[0]).join("");return jr[e]=a,a}}}catch{}return e}const Kr=new Map;async function he(e,t={}){const i=`${e}_${JSON.stringify(t)}`;if(Kr.has(i))return Kr.get(i);for(let n=0;n<Va.length;n++)try{const a=new URL(`${od}${e}`);a.searchParams.append("api_key",ld());for(let o in t)t[o]!==void 0&&t[o]!==null&&a.searchParams.append(o,t[o]);const r=await fetch(a.toString(),{signal:AbortSignal.timeout(6e3)});if(r.ok){const o=await r.json();return Kr.set(i,o),o}else Rs()}catch{Rs()}return null}const ud=new Set([64,84,4370]),pd=new Set([10764]),hd=["hayalet hikayeleri","a haunting","altin pesinde","gold rush","olumcul av","deadliest catch","hurda avcilari","salvage hunters","tamirat tadilat","wheeler dealers","agir yasamlar","my 600-lb life","evlilige 90 gun","90 day fiance","pasta ustalari","cake boss","agac ev ustalari","treehouse masters","alaska yi kurtarmak","alaskayi kurtarmak","alaska: the last frontier","oto kurtarma kulubu","fast n loud","nehir canavarlari","river monsters","kupon delileri","extreme couponing","temizlik bagimlilari","obsessive compulsive cleaners","asiri cimriler","extreme cheapskates","restoran kurtarma","depo savaslari","storage wars","gumruk kontrol","border security","nasil yapilir","how it's made","how its made","dmax","tlc"],fd=new Set([3072,34634,3126,45814,1356,45598,61498,59792,29849,23067,44383,44372]);function Ve(e){if(!e||e.id&&fd.has(Number(e.id))||(e.genre_ids||(Array.isArray(e.genres)?e.genres.map(a=>typeof a=="object"?a.id:a):[])).some(a=>pd.has(Number(a))))return!0;const i=e.networks||[];if(Array.isArray(i)&&i.some(a=>ud.has(Number(a.id||a))))return!0;const n=(e.title||e.name||e.original_title||e.original_name||"").toLowerCase().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c");for(const a of hd)if(n.includes(a))return!0;return!!(Ct()&&!Jt(e))}const Ja=[[180,["rafadan tayfa","kral sakir","niloya","pepee"]],[225,["miraculous","gumball","adventure time","regular show","teen titans go","ben 10","spongebob","sunger bob"]],[130,["masha and the bear","masa ile koca ayi","winx","scooby doo","ninjago","paw patrol","pijamaskeliler"]],[150,["samurai jack","johnny test","johnny bravo","dexter laboratory","powerpuff girls","courage cowardly dog"]],[110,["avatar the last airbender","avatar son hava bukucu","gravity falls","steven universe","the owl house","amphibia"]]],$s=[[180,["naruto","one piece","attack on titan","shingeki no kyojin","demon slayer","kimetsu no yaiba"]],[160,["jujutsu kaisen","death note","solo leveling","bleach","dragon ball"]],[140,["pokemon","beyblade","captain tsubasa","yu gi oh","bakugan","my hero academia","boku no hero"]],[120,["hunter x hunter","tokyo ghoul","fullmetal alchemist","vinland saga","monster","jojo","haikyuu","blue lock"]],[105,["chainsaw man","one punch man","spy x family","black clover","frieren","kaiju no 8","dandadan"]]],md=[[320,["rick and morty","invincible","arcane","bojack horseman"]],[280,["south park","family guy","american dad","futurama","the simpsons"]],[250,["love death robots","harley quinn","archer","solar opposites"]],[220,["castlevania","blue eye samurai","the legend of vox machina","spawn","primal"]],[200,["big mouth","f is for family","disenchantment","inside job","smiling friends","hazbin hotel","helluva boss"]],[180,["boondocks","paradise pd","brickleberry","final space","scavengers reign","pantheon","undone","creature commandos"]]];function yr(e=""){return String(e).toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ı/g,"i").replace(/[^a-z0-9]+/g," ").trim()}function Xa(e){const t=String(e?.original_language||"").toLowerCase(),i=Array.isArray(e?.origin_country)?e.origin_country.map(n=>String(n).toUpperCase()):[];return["ja","zh","ko"].includes(t)||i.some(n=>["JP","CN","KR"].includes(n))}function gd(e,t=!1){const i=yr([e.name,e.title,e.original_name,e.original_title].filter(Boolean).join(" ")),n=t?$s:[...Ja,...$s];for(const[a,r]of n)if(r.some(o=>i.includes(o)))return a;return 0}function Ms(e){const t=yr([e.name,e.title,e.original_name,e.original_title].filter(Boolean).join(" "));for(const[i,n]of md)if(n.some(a=>t.includes(a)))return i;return 0}function al(e){const t=yr([e.name,e.title,e.original_name,e.original_title].filter(Boolean).join(" "));return Ja.some(([,i])=>i.some(n=>t.includes(n)))}function yd(e){const t=yr([e.name,e.title,e.original_name,e.original_title].filter(Boolean).join(" "));for(const[i,n]of Ja)if(n.some(a=>t.includes(a)))return i;return 0}function vr(e,{animeOnly:t=!1}={}){return e.map(i=>{const n=Math.min(220,Number(i.popularity)||0),a=Math.min(95,Math.log10((Number(i.vote_count)||0)+1)*22),r=Math.max(0,(Number(i.vote_average)||0)-5)*5,o=!t&&i.origin_country?.includes("TR")?115:0,s=n+a+r+o+gd(i,t);return{...i,_turkeyPopularityScore:Math.round(s*100)/100}}).sort((i,n)=>n._turkeyPopularityScore-i._turkeyPopularityScore)}async function ka(e=1){const[t,i,n,a,r]=await Promise.all([he("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16",without_genres:"27,80,53,10752,18","vote_count.gte":10,include_adult:!1}),he("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"10762",without_genres:"27,80,53","vote_count.gte":5,include_adult:!1}),he("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16",with_origin_country:"TR",without_genres:"27,80,53,10752,18",include_adult:!1}),he("/discover/tv",{sort_by:"vote_count.desc",page:e+2,language:"tr-TR",with_genres:"16",without_genres:"27,80,53,10752,18","vote_count.gte":10,include_adult:!1}),e===1?he("/trending/tv/week",{language:"tr-TR"}):Promise.resolve(null)]),o=(r?.results||[]).filter(u=>(u.genre_ids||[]).includes(16)),s=[...t?.results||[],...i?.results||[],...n?.results||[],...a?.results||[],...o],l=new Map;for(const u of s)u&&u.id&&!l.has(u.id)&&l.set(u.id,u);return vr(Array.from(l.values()).filter(u=>(u.poster_path||u.backdrop_path)&&!Ve(u)).map(u=>({...u,type:"tv",media_type:"tv",isSeries:!0,overview:(u.overview||"").trim()||qe(u,"tv")})))}function vd(e){const t=new Map;for(const i of e)i?.id&&!t.has(i.id)&&t.set(i.id,i);return vr(Array.from(t.values()).filter(i=>{const n=(i.genre_ids||[]).map(Number);return(i.poster_path||i.backdrop_path)&&n.includes(16)&&(n.includes(10751)||n.includes(10762)||al(i))&&!Xa(i)&&Jt(i)&&!Ve(i)}).map(i=>({...i,type:"tv",media_type:"tv",isSeries:!0,overview:(i.overview||"").trim()||qe(i,"tv")})))}async function sl(e,t,i){const n=await Promise.all(t.map(([a,r])=>he("/discover/tv",{sort_by:i,page:e,language:"tr-TR",with_genres:"16",without_genres:"18,27,53,80,99,10752,10764,10766,10767","first_air_date.gte":a,"first_air_date.lte":r,include_adult:!1})));return vd(n.flatMap(a=>a?.results||[]))}async function Ps(e=1){return sl(e,[["2020-01-01","2099-12-31"],["2015-01-01","2019-12-31"]],"popularity.desc")}async function Bs(e=1){return sl(e,[["2010-01-01","2014-12-31"],["2000-01-01","2009-12-31"],["1990-01-01","1999-12-31"],["1900-01-01","1989-12-31"]],"vote_count.desc")}async function _a(e=1){const[t,i,n]=await Promise.all([he("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16",without_genres:"10751,10762","vote_count.gte":80,include_adult:!1}),he("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"16",without_genres:"10751,10762","vote_average.gte":6.5,"vote_count.gte":150,include_adult:!1}),e===1?he("/trending/tv/week",{language:"tr-TR"}):Promise.resolve(null)]),a=(n?.results||[]).filter(o=>(o.genre_ids||[]).includes(16)),r=new Map;for(const o of[...t?.results||[],...i?.results||[],...a])o?.id&&!r.has(o.id)&&r.set(o.id,o);return Array.from(r.values()).filter(o=>{const s=(o.genre_ids||[]).map(Number);return(o.poster_path||o.backdrop_path)&&s.includes(16)&&!s.includes(10751)&&!s.includes(10762)&&!Xa(o)&&!al(o)&&(e===1?Ms(o)>0:!0)&&!Ve(o)}).map(o=>{const s=Math.min(250,Number(o.popularity)||0),l=Math.min(130,Math.log10((Number(o.vote_count)||0)+1)*30),u=Math.max(0,(Number(o.vote_average)||0)-5)*8;return{...o,type:"tv",media_type:"tv",isSeries:!0,overview:(o.overview||"").trim()||qe(o,"tv"),_adultAnimationScore:s+l+u+Ms(o)}}).sort((o,s)=>s._adultAnimationScore-o._adultAnimationScore)}async function Jn(e=1){const t=[["2020-01-01","2099-12-31"],["2015-01-01","2019-12-31"],["2010-01-01","2014-12-31"],["2000-01-01","2009-12-31"],["1990-01-01","1999-12-31"],["1980-01-01","1989-12-31"],["1900-01-01","1979-12-31"]],i=await Promise.all(t.map(([a,r])=>he("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"16",without_genres:"27,80,53,99,10764,10766,10767","first_air_date.gte":a,"first_air_date.lte":r,include_adult:!1}))),n=new Map;for(const a of i)for(const r of a?.results||[])r?.id&&!n.has(r.id)&&n.set(r.id,r);return Array.from(n.values()).filter(a=>{const r=(a.genre_ids||[]).map(Number);return(a.poster_path||a.backdrop_path)&&r.includes(16)&&!r.includes(99)&&!Xa(a)&&!br(a.name||a.title||"")&&!Ve(a)}).map(a=>{const r=parseInt(String(a.first_air_date||"").slice(0,4),10)||9999,o=Math.min(220,Number(a.popularity)||0),s=Math.min(115,Math.log10((Number(a.vote_count)||0)+1)*27),l=r<=2018?35:0;return{...a,type:"tv",media_type:"tv",isSeries:!0,overview:(a.overview||"").trim()||qe(a,"tv"),_cartoonScore:o+s+l+yd(a)}}).sort((a,r)=>r._cartoonScore-a._cartoonScore)}async function Sa(e=1){const t=await he("/discover/movie",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"16,10751",without_genres:"27,80,53,10752","vote_count.gte":40});return!t||!t.results?[]:t.results.filter(i=>(i.poster_path||i.backdrop_path)&&!Ve(i)).map(i=>({...i,type:"movie",media_type:"movie",overview:(i.overview||"").trim()||qe(i,"movie")}))}async function Ds(e=1){const t=await he("/discover/movie",{sort_by:"vote_average.desc",page:e,language:"tr-TR",with_genres:"12,14,10751","vote_count.gte":150,without_genres:"27,80,53"});return!t||!t.results?[]:t.results.filter(i=>(i.poster_path||i.backdrop_path)&&!Ve(i)).map(i=>({...i,type:"movie",media_type:"movie",overview:(i.overview||"").trim()||qe(i,"movie")}))}async function ol(e="all",t="week",i=1){const[n,a]=await Promise.all([he(`/trending/${e}/${t}`,{page:i,language:"tr-TR"}),he(`/trending/${e}/${t}`,{page:i,language:"en-US"})]);if(!n||!n.results)return[];const r=new Map((a?.results||[]).map(o=>[o.id,o.overview]));return n.results.filter(o=>(o.poster_path||o.backdrop_path)&&!Ve(o)).map(o=>{const l=o.media_type==="tv"||!!o.first_air_date?"tv":"movie",u=(o.overview||"").trim(),p=(r.get(o.id)||"").trim();return{...o,type:l,media_type:l,overview:u||p||qe(o,l)}})}async function Xn(e=1){const t=await he("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR","vote_count.gte":300,without_genres:"16"});return!t||!t.results?[]:t.results.filter(i=>(i.poster_path||i.backdrop_path)&&!Ve(i)).map(i=>{const n=(i.overview||"").trim();return{...i,type:"tv",media_type:"tv",overview:n||qe(i,"tv")}})}async function Zn(e=1){const t=await he("/discover/movie",{sort_by:"vote_count.desc",page:e,language:"tr-TR","vote_count.gte":500});return!t||!t.results?[]:t.results.filter(i=>(i.poster_path||i.backdrop_path)&&!Ve(i)).map(i=>{const n=(i.overview||"").trim();return{...i,type:"movie",media_type:"movie",overview:n||qe(i,"movie")}})}function br(e){return e?/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\u1100-\u11ff\u3130-\u318f\ua960-\ua97f\ud7b0-\ud7ff\u0600-\u06ff\u0400-\u04ff\u0e00-\u0e7f]/.test(e):!1}async function Qn(e=1){const[t,i,n,a]=await Promise.all([he("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16",with_original_language:"ja","vote_count.gte":50}),he("/discover/tv",{sort_by:"popularity.desc",page:e,language:"en-US",with_genres:"16",with_original_language:"ja","vote_count.gte":50}),he("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"16",with_original_language:"ja","vote_count.gte":100}),e===1?he("/trending/tv/week",{language:"tr-TR"}):Promise.resolve(null)]);if(!t||!t.results)return[];const r=new Map((i?.results||[]).map(s=>[s.id,s.name||s.title])),o=new Map([...t.results||[],...n?.results||[],...(a?.results||[]).filter(s=>s.original_language==="ja"&&(s.genre_ids||[]).includes(16))].map(s=>[s.id,s]));return vr(Array.from(o.values()).filter(s=>(s.poster_path||s.backdrop_path)&&!Ve(s)).map(s=>{let l=s.name||s.title||"";return(!l||br(l))&&(l=r.get(s.id)||s.original_name||s.original_title||l),s.id&&_e(s.id),{...s,name:l,title:l,type:"anime",media_type:"anime",isAnime:!0,isSeries:!0,overview:s.overview||qe(s,"tv")}}),{animeOnly:!0})}async function xa(e=1){const[t,i]=await Promise.all([he("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16,10762",with_original_language:"ja",without_genres:"27,80,53,10752,18","vote_count.gte":10}),he("/discover/tv",{sort_by:"popularity.desc",page:e,language:"en-US",with_genres:"16,10762",with_original_language:"ja",without_genres:"27,80,53,10752,18","vote_count.gte":10})]);if(!t||!t.results)return[];const n=new Map((i?.results||[]).map(a=>[a.id,a.name||a.title]));return vr(t.results.filter(a=>(a.poster_path||a.backdrop_path)&&!Ve(a)).map(a=>{let r=a.name||a.title||"";return(!r||br(r))&&(r=n.get(a.id)||a.original_name||a.original_title||r),a.id&&_e(a.id),{...a,name:r,title:r,type:"anime",media_type:"anime",isAnime:!0,isSeries:!0,overview:a.overview||qe(a,"tv")}}),{animeOnly:!0})}async function er(e=1){const[t,i]=await Promise.all([he("/discover/movie",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"99","vote_count.gte":40}),he("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"99","vote_count.gte":30})]),n=(t?.results||[]).filter(r=>(r.poster_path||r.backdrop_path)&&!Ve(r)).map(r=>({...r,type:"movie",media_type:"movie",overview:(r.overview||"").trim()||qe(r,"movie")})),a=(i?.results||[]).filter(r=>(r.poster_path||r.backdrop_path)&&!Ve(r)).map(r=>({...r,type:"tv",media_type:"tv",overview:(r.overview||"").trim()||qe(r,"tv")}));return[...n,...a].sort((r,o)=>(o.vote_count||0)-(r.vote_count||0))}async function bd(e=1){const t=await he("/discover/movie",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"99,10751",without_genres:"27,80,53,10752","vote_count.gte":10}),i=await he("/discover/movie",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"99,16",without_genres:"27,80,53","vote_count.gte":5}),n=t?.results||[],a=i?.results||[],r=new Set,o=[];for(const l of[...n,...a])l&&l.id&&!r.has(l.id)&&(r.add(l.id),o.push(l));const s=["jackass","murder","killer","war","drug","crime","sex","violent","savaş","cinayet","uyuşturucu"];return o.filter(l=>{if(!(l.poster_path||l.backdrop_path)||Ve(l))return!1;const u=`${l.title||""} ${l.name||""} ${l.overview||""}`.toLowerCase();return!s.some(p=>u.includes(p))}).map(l=>({...l,type:"movie",media_type:"movie",overview:l.overview||qe(l,"movie")}))}async function ki(e="tv",t=1){const[i,n]=await Promise.all([he(`/${e}/top_rated`,{page:t,language:"tr-TR"}),he(`/${e}/top_rated`,{page:t,language:"en-US"})]);if(!i||!i.results)return[];const a=new Map((n?.results||[]).map(r=>[r.id,r.overview]));return Promise.all(i.results.filter(r=>(r.poster_path||r.backdrop_path)&&!Ve(r)).map(async r=>{let o=(r.overview||"").trim();const s=(a.get(r.id)||"").trim();return(!o||o.length<15)&&s&&s.length>10&&(o=await Ga(s)),{...r,type:e,media_type:e,overview:o||s||qe(r,e)}}))}async function ll({type:e="tv",genreId:t=null,page:i=1,sortBy:n="popularity.desc",minRating:a=0,isAnime:r=!1,isDoc:o=!1,yearMin:s=null,yearMax:l=null,withNetworks:u=null,withProviders:p=null}){const h={sort_by:n,page:i,language:"tr-TR"};return r?(h.with_genres=t?`16,${t}`:"16",h.with_original_language="ja"):o?h.with_genres=t?`99,${t}`:"99":t&&(h.with_genres=t),a>0&&(h["vote_average.gte"]=a,h["vote_count.gte"]=40),s&&(e==="movie"?h["primary_release_date.gte"]=`${s}-01-01`:h["first_air_date.gte"]=`${s}-01-01`),l&&(e==="movie"?h["primary_release_date.lte"]=`${l}-12-31`:h["first_air_date.lte"]=`${l}-12-31`),u&&(e==="tv"?h.with_networks=u:(h.with_watch_providers=p||u,h.watch_region="TR")),((await he(e==="movie"?"/discover/movie":"/discover/tv",h))?.results||[]).filter(w=>(w.poster_path||w.backdrop_path)&&!Ve(w)).map(w=>(r&&w.id&&_e(w.id),{...w,type:r?"anime":e,media_type:r?"anime":e,isAnime:r,isSeries:e==="tv"}))}function qe(e,t="tv"){if(!e)return"Sürükleyici atmosferi ve zengin hikaye örgüsüyle izleyicileri ekran başına kilitleyen etkileyici bir yapım.";const i=e.title||e.name||"Bu yapım",n=t==="tv"||e.media_type==="tv"||!!e.first_air_date||e.seasons&&e.seasons.length>0||!!e.number_of_seasons,a=n?"dizi":"film";let r=[];Array.isArray(e.genres)&&e.genres.length>0&&(r=e.genres.map(y=>typeof y=="string"?y:y.name).filter(Boolean));const o=r.length>0?r.slice(0,3).join(", "):n?"Dram ve Gerilim":"Sinema",s=e.release_date||e.first_air_date||(e.year?String(e.year):""),l=s?` ${s.slice(0,4)} yılında izleyiciyle buluşan ve`:"",u=Number(e.vote_average||e.rating||0),p=u>0?`IMDb'de ${u.toFixed(1)}/10 gibi başarılı bir puana sahip olan`:"Eleştirmenler ve izleyiciler tarafından büyük beğeni toplayan";let h="";const g=e.credits?.cast||[];if(g.length>0){const y=g.slice(0,3).map(E=>E.name).filter(Boolean).join(", ");y&&(h=` Başrollerinde ${y} gibi başarılı isimlerin yer aldığı`)}let v="";const b=e.credits?.crew?.filter(y=>y.job==="Director").map(y=>y.name)||[],w=e.created_by?.map(y=>y.name)||[],k=b[0]||w[0];k&&(v=` ${k} imzalı`);let f="";return e.tagline&&e.tagline.trim().length>6&&(f=` "${e.tagline.trim()}" temasıyla dikkat çeken yapım,`),`${i}, ${o} türünde öne çıkan${l}${v}${h} etkileyici bir ${a} deneyimi sunuyor.${f} ${p} yapım, beklenmedik ters köşeleri, derin karakter gelişimleri ve soluksuz temposuyla izleyenlere unutulmaz anlar vadediyor.`}async function Ns(e="tv",t){const i=await he(`/${e}/${t}`,{append_to_response:"credits,similar,recommendations,videos,external_ids",language:"tr-TR"});if(!i)return null;(i.original_language==="ja"||Array.isArray(i.origin_country)&&i.origin_country.includes("JP"))&&Array.isArray(i.genres)&&i.genres.some(s=>s.id===16||/anim/i.test(s.name))&&i.id&&_e(i.id);let a=(i.overview||"").trim();if(!a||a.length<15)try{const s=await he(`/${e}/${t}`,{language:"en-US"});if(s&&s.overview&&s.overview.trim().length>10){const l=await Ga(s.overview.trim());l&&l.length>15&&(i.overview=l)}}catch{}(!i.overview||i.overview.trim().length<15)&&(i.overview=qe(i,e));let r=i.videos?.results||[];if(!r.some(s=>s.site==="YouTube"&&(s.type==="Trailer"||s.type==="Teaser")))try{const l=(await he(`/${e}/${t}/videos`,{language:"en-US"}))?.results||[];l.length>0&&(i.videos=i.videos||{},i.videos.results=[...r,...l])}catch{}return i}const wn=new Map;function Wr(e,t){if(!e||e.site!=="YouTube"||!e.key)return-1;let n={Trailer:500,Teaser:360,Promo:280,"Opening Credits":240,Clip:160,Featurette:100}[e.type]||50;return e.official===!0&&(n+=1e3),t==="tr"?n+=50:t==="en"?n+=25:t==="ja"&&(n+=15),/official|resmi|final trailer|main trailer|tanıtım|fragman/i.test(e.name||"")&&(n+=80),/fan|concept|reaction|breakdown/i.test(e.name||"")&&(n-=800),n}function ln(e="tv",t,i=""){if(ft().trailersEnabled===!1)return Promise.resolve(null);const n=`${e}:${t}`;if(wn.has(n))return wn.get(n);const a=(async()=>{try{const[r,o,s]=await Promise.all([he(`/${e}/${t}/videos`,{language:"tr-TR"}).catch(()=>null),he(`/${e}/${t}/videos`,{language:"en-US"}).catch(()=>null),he(`/${e}/${t}/videos`,{include_video_language:"tr,en,ja,ko,null"}).catch(()=>null)]),l=new Set,u=[],p=(g,v)=>{if(Array.isArray(g))for(const b of g)b&&b.key&&!l.has(b.key)&&(l.add(b.key),u.push({video:b,language:v||b.iso_639_1||"en"}))};p(r?.results,"tr"),p(o?.results,"en"),p(s?.results,""),u.sort((g,v)=>Wr(v.video,v.language)-Wr(g.video,g.language));const h=u.find(g=>Wr(g.video,g.language)>=0)?.video;if(h?.key){const g=h.key.trim(),v=encodeURIComponent(g);return{key:g,name:h.name||"Resmi Fragman",site:h.site,type:h.type,embedUrl:`https://www.youtube.com/embed/${v}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,watchUrl:`https://www.youtube.com/watch?v=${v}`}}if(i&&typeof i=="string"&&i.trim().length>1){const g=i.trim(),v=`${g} Fragman`;return{key:"",name:`${g} Tanıtım`,site:"YouTube",type:"Trailer",embedUrl:`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(v)}&autoplay=1&rel=0`,watchUrl:`https://www.youtube.com/results?search_query=${encodeURIComponent(v)}`}}}catch{}return null})();return wn.set(n,a),a.then(r=>{r||wn.delete(n)}),a}async function wd(e,t=1){const i=await he(`/tv/${e}/season/${t}`,{language:"tr-TR"});if(!i||!i.episodes)return i;const n=await he(`/tv/${e}/season/${t}`,{language:"en-US"});return await Promise.all(i.episodes.map(async(a,r)=>{let o=a.overview?a.overview.trim():"";(!o||o.length<5)&&n&&n.episodes&&n.episodes[r]&&n.episodes[r].overview&&(o=n.episodes[r].overview),o&&(!a.overview||a.overview.length<5)&&(a.overview=await Ga(o))})),i}async function Za(e,t=1){if(!e||!e.trim())return[];const i=e.trim().toLowerCase(),[n,a,r]=await Promise.all([he("/search/multi",{query:i,page:t,language:"tr-TR",include_adult:!1}),he("/search/multi",{query:i,page:t,language:"en-US",include_adult:!1}),he("/search/tv",{query:i,page:t,language:"tr-TR",include_adult:!1})]),o=new Map,s=u=>{if(Array.isArray(u)){for(const p of u)if(!(!p||!p.id)&&!(!p.poster_path&&!p.backdrop_path)&&!Ve(p)&&!o.has(p.id)){const h=p.media_type==="tv"||!!p.first_air_date||p.name&&!p.title;o.set(p.id,{...p,type:h?"tv":"movie",media_type:h?"tv":"movie"})}}};s(n?.results),s(a?.results),s(r?.results);const l=Array.from(o.values());return l.sort((u,p)=>{const h=(u.title||u.name||u.original_title||u.original_name||"").toLowerCase(),g=(p.title||p.name||p.original_title||p.original_name||"").toLowerCase(),v=h===i?100:h.startsWith(i)?50:0,b=g===i?100:g.startsWith(i)?50:0,w=v+Math.min(100,(u.vote_count||0)/50)+(u.popularity||0)*.5;return b+Math.min(100,(p.vote_count||0)/50)+(p.popularity||0)*.5-w}),l}const gt={ACTION_ADVENTURE:10759,ANIMATION:16,COMEDY:35,CRIME:80,DOCUMENTARY:99,DRAMA:18,FAMILY:10751,MYSTERY:9648,SCI_FI_FANTASY:10765,WAR_POLITICS:10768,WESTERN:37},Ye={ACTION:28,ADVENTURE:12,ANIMATION:16,COMEDY:35,CRIME:80,DOCUMENTARY:99,DRAMA:18,FAMILY:10751,FANTASY:14,HISTORY:36,HORROR:27,MUSIC:10402,MYSTERY:9648,ROMANCE:10749,SCI_FI:878,THRILLER:53,WESTERN:37};async function kd(e){if(!e)return null;const t=await he(`/person/${e}`,{language:"tr-TR",append_to_response:"combined_credits"});if(!t||!t.biography||t.biography.trim().length===0){const i=await he(`/person/${e}`,{language:"en-US",append_to_response:"combined_credits"});if(i)if(t)t.biography=i.biography,!t.combined_credits&&i.combined_credits&&(t.combined_credits=i.combined_credits);else return i}return t}function ee(e,t="info",i=3500){const n=document.getElementById("toast-container");if(!n)return;const a=document.createElement("div");a.className=`toast toast-${t}`;let r="info";t==="success"&&(r="check-circle"),t==="error"&&(r="alert-circle"),a.innerHTML=`
    <i data-lucide="${r}"></i>
    <span>${e}</span>
  `,n.appendChild(a),G(),setTimeout(()=>{a.style.opacity="0",a.style.transform="translateX(100%)",a.style.transition="all 0.3s ease-out",setTimeout(()=>{a.parentNode&&a.parentNode.removeChild(a)},300)},i)}const ht="https://api.trakt.tv",_d="AsVFyJXykTMViLCXPMAvFGtk7B_npj5Y3STpzljYnwY",Sd="4b6l8YaAG-GzyY6cSPFR5ea66xrXYEqrrHhn3FiWa7k",ot={TOKEN:"cinepulse_trakt_token",USER:"cinepulse_trakt_user",SETTINGS:"cinepulse_trakt_settings",LAST_SYNC:"cinepulse_trakt_last_sync"};let si=null,tr=null,ir=0;function wr(){return localStorage.getItem("cinepulse_trakt_custom_client_id")||_d}function cl(){return localStorage.getItem("cinepulse_trakt_custom_client_secret")||Sd}function Bi(){try{const e=localStorage.getItem(ot.SETTINGS);if(e)return JSON.parse(e)}catch{}return{autoScrobble:!0,scrobbleThreshold:80,autoSyncOnLaunch:!0}}function Os(e){const i={...Bi(),...e};return localStorage.setItem(ot.SETTINGS,JSON.stringify(i)),i}const zs=15*60*1e3;let Hs=!1,Yr=!1,dl=0;function ul(e){if(Hs){Xt()&&qs(e);return}Hs=!0;const t=()=>{document.visibilityState!=="hidden"&&(Date.now()-dl<zs||qs(e))};window.setTimeout(t,4e3),window.setInterval(t,zs),document.addEventListener("visibilitychange",t)}async function qs(e){if(!(!Bi().autoSyncOnLaunch||!Xt()||Yr)){Yr=!0,dl=Date.now();try{(await hl(e)).errors.length}catch{}finally{Yr=!1}}}function pl(){try{const e=localStorage.getItem(ot.TOKEN);return e?JSON.parse(e):null}catch{return null}}function Xt(){const e=pl();return!!(e&&e.access_token)}function xd(){try{const e=localStorage.getItem(ot.USER);return e?JSON.parse(e):null}catch{return null}}function Ed(){const e=localStorage.getItem(ot.LAST_SYNC);return e?Number(e):null}async function di(){const e=pl();if(!e||!e.access_token)return null;const t=Math.floor(Date.now()/1e3);if((e.created_at||0)+(e.expires_in||0)-t<86400&&e.refresh_token)try{const n=await Cd(e.refresh_token);if(n?.access_token)return n.access_token}catch{}return e.access_token}async function Td(){const e=wr(),t=await fetch(`${ht}/oauth/device/code`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({client_id:e})});if(!t.ok){const i=await t.text();throw new Error(`Device code error (${t.status}): ${i}`)}return await t.json()}function Ad(e,t=5,i=()=>{}){si&&si.abort(),si=new AbortController;const{signal:n}=si;return new Promise((a,r)=>{const o=wr(),s=cl();let l=Math.max(t,5)*1e3;const u=async()=>{if(n.aborted){r(new Error("Auth polling cancelled"));return}try{const p=await fetch(`${ht}/oauth/device/token`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:e,client_id:o,client_secret:s}),signal:n});if(p.status===200){const g=await p.json();localStorage.setItem(ot.TOKEN,JSON.stringify(g));let v=null;try{v=await Id(g.access_token),v&&localStorage.setItem(ot.USER,JSON.stringify(v))}catch{}window.dispatchEvent(new CustomEvent("cinepulse_trakt_auth_changed",{detail:{connected:!0,user:v}})),a(g);return}if(p.status===400){i({status:"pending",message:"Kullanıcı onayı bekleniyor..."}),n.aborted||setTimeout(u,l);return}if(p.status===404)throw new Error("Geçersiz cihaz kodu.");if(p.status===409)throw new Error("Bu kod zaten kullanılmış.");if(p.status===410)throw new Error("Kodun süresi doldu. Lütfen tekrar deneyin.");if(p.status===429){l+=2e3,n.aborted||setTimeout(u,l);return}const h=await p.text();throw new Error(`Trakt auth failed: ${h}`)}catch(p){if(n.aborted)return;r(p)}};setTimeout(u,l)})}function Ea(){si&&(si.abort(),si=null)}async function Cd(e){const t=wr(),i=cl(),n=await fetch(`${ht}/oauth/token`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refresh_token:e,client_id:t,client_secret:i,grant_type:"refresh_token"})});if(!n.ok)throw new Error("Token refresh failed");const a=await n.json();return localStorage.setItem(ot.TOKEN,JSON.stringify(a)),a}function Ld(){Ea(),localStorage.removeItem(ot.TOKEN),localStorage.removeItem(ot.USER),localStorage.removeItem(ot.LAST_SYNC),window.dispatchEvent(new CustomEvent("cinepulse_trakt_auth_changed",{detail:{connected:!1}}))}function Bt(e){return{"Content-Type":"application/json","trakt-api-version":"2","trakt-api-key":wr(),Authorization:`Bearer ${e}`}}async function Id(e=null){const t=e||await di();if(!t)return null;const i=await fetch(`${ht}/users/me?extended=full`,{headers:Bt(t)});if(!i.ok)return null;const n=await i.json();return localStorage.setItem(ot.USER,JSON.stringify(n)),n}function Qa(e,t=0){const i=Math.min(100,Math.max(0,Math.round(t))),n=e.tmdbId||e.id;return(e.isSeries===!0?!0:e.isSeries===!1||e.type==="movie"?!1:!!(e.type==="tv"||e.season&&Number(e.season)>0&&e.type!=="movie"))?{show:{title:e.seriesTitle||e.title||"",ids:{tmdb:Number(n)||void 0}},episode:{season:Math.max(1,Number(e.season)||1),number:Math.max(1,Number(e.episode)||1)},progress:i,app_version:"2.0.0",app_date:"2026-09-25"}:{movie:{title:e.title||"",ids:{tmdb:Number(n)||void 0}},progress:i,app_version:"2.0.0",app_date:"2026-09-25"}}async function Rf(e,t=0){if(!Bi().autoScrobble||!Xt())return null;const n=Date.now();if(tr==="start"&&n-ir<8e3)return null;const a=await di();if(!a)return null;try{const r=Qa(e,t),o=await fetch(`${ht}/scrobble/start`,{method:"POST",headers:Bt(a),body:JSON.stringify(r)});if(o.ok)return tr="start",ir=n,await o.json()}catch{}return null}async function $f(e,t=0){if(!Bi().autoScrobble||!Xt())return null;const n=await di();if(!n)return null;try{const a=Qa(e,t),r=await fetch(`${ht}/scrobble/pause`,{method:"POST",headers:Bt(n),body:JSON.stringify(a),keepalive:!0});if(r.ok)return tr="pause",ir=Date.now(),await r.json()}catch{}return null}async function Mf(e,t=100){if(!Bi().autoScrobble||!Xt())return null;const n=await di();if(!n)return null;try{const a=Qa(e,t),r=await fetch(`${ht}/scrobble/stop`,{method:"POST",headers:Bt(n),body:JSON.stringify(a),keepalive:!0});if(r.ok)return tr="stop",ir=Date.now(),await r.json()}catch{}return null}async function Rd(e){const t=await di();if(!t||!e||!e.length)return null;const i=[],n=new Map;for(const s of e){const l=s.tmdbId||s.id,u=Number(l);if(!u||isNaN(u))continue;const p=new Date(Number(s.lastWatchedAt)||s.lastWatchedAt||Date.now()),h=Number.isNaN(p.getTime())?new Date().toISOString():p.toISOString();if(s.type==="movie"?!1:!!(s.isSeries||s.type==="tv"||s.type==="anime")){const v=Math.max(1,Number(s.season)||1),b=Math.max(1,Number(s.episode)||1);n.has(u)||n.set(u,{title:s.title||"",ids:{tmdb:u},seasonsMap:new Map});const w=n.get(u);w.seasonsMap.has(v)||w.seasonsMap.set(v,[]),w.seasonsMap.get(v).push({number:b,watched_at:h})}else i.push({title:s.title||"",watched_at:h,ids:{tmdb:u}})}const a=Array.from(n.values()).map(s=>({title:s.title,ids:s.ids,seasons:Array.from(s.seasonsMap.entries()).map(([l,u])=>({number:l,episodes:u}))}));if(i.length===0&&a.length===0)return null;const r={};i.length>0&&(r.movies=i),a.length>0&&(r.shows=a);const o=await fetch(`${ht}/sync/history`,{method:"POST",headers:Bt(t),body:JSON.stringify(r)});if(!o.ok){const s=await o.text();throw new Error(`Trakt API Hatası (${o.status}): ${s}`)}return await o.json()}const $d="4e44d9029b1270a757cddc766a1bcb63",Vr=new Map;async function Gr(e,t=!1){const i=`${t?"tv":"movie"}_${e}`;if(Vr.has(i))return Vr.get(i);try{const a=await fetch(`https://api.themoviedb.org/3/${t?"tv":"movie"}/${e}?api_key=${$d}&language=tr-TR`);if(a.ok){const r=await a.json();return Vr.set(i,r),r}}catch{}return null}async function Fs(e,t){const i=[],n=new Set,a=e==="shows"?100:250;for(let r=1;;r++){const o=new URLSearchParams({page:String(r),limit:String(a)});e==="shows"&&o.set("extended","progress");const s=await fetch(`${ht}/sync/watched/${e}?${o}`,{headers:Bt(t)});if(!s.ok)throw new Error(`İzlenen ${e==="shows"?"diziler":"filmler"} alınamadı (${s.status})`);const l=await s.json();if(!Array.isArray(l))throw new Error("Trakt izlenenler yanıtı geçersiz");if(l.length===0)break;let u=0;for(const h of l){const g=h[e==="shows"?"show":"movie"]?.ids?.trakt;g&&n.has(g)||(g&&n.add(g),i.push(h),u++)}if(!u)break;const p=Number(s.headers?.get("X-Pagination-Page-Count"));if(p&&r>=p||!p&&l.length<a)break}return i}async function Md(e){const t=await di();if(!t)return{importedPlaybackCount:0,importedHistoryCount:0};const{saveWatchProgress:i,saveBatchWatchProgress:n,getWatchHistory:a}=e;if(!i&&!n)return{importedPlaybackCount:0,importedHistoryCount:0};let r=0,o=0;const s=[],l=[],u=a?a():[],p=new Map;for(const h of u){const g=`${h.id}_${h.season||1}_${h.episode||1}`;p.set(g,h)}try{{const h=await Fs("movies",t);if(Array.isArray(h))for(let g=0;g<h.length;g+=5){const v=h.slice(g,g+5);await Promise.all(v.map(async b=>{const w=b.movie?.ids?.tmdb;if(!w)return;const k=`${w}_1_1`,f=p.get(k);if(f&&f.completed)return;const y=b.last_watched_at?new Date(b.last_watched_at).getTime():Date.now();let E=f?.poster_path||f?.posterPath||"",C=f?.backdrop_path||f?.backdropPath||"",x=f?.title||b.movie?.title||"",A=6600;if(!E||!x){const R=await Gr(w,!1);R&&(E=R.poster_path||"",C=R.backdrop_path||"",x=R.title||x,R.runtime&&(A=R.runtime*60))}l.push({id:w,title:x,posterPath:E,backdropPath:C,type:"movie",isSeries:!1,currentTime:A,duration:A,progressPercent:100,completed:!0,traktImported:!0,lastWatchedAt:y}),o++}))}}}catch(h){s.push(h.message)}try{{const h=await Fs("shows",t);if(Array.isArray(h))for(let g=0;g<h.length;g+=4){const v=h.slice(g,g+4);await Promise.all(v.map(async b=>{const w=b.show?.ids?.tmdb;if(!w)return;const k=b.show?.title||"",f=await Gr(w,!0),y=f?.poster_path||"",E=f?.backdrop_path||"",C=f?.name||f?.title||k,x=f?.episode_run_time?.[0]?f.episode_run_time[0]*60:3e3,A={number_of_episodes:f?.number_of_episodes,number_of_seasons:f?.number_of_seasons,status:f?.status,seasons:f?.seasons},R=Array.isArray(b.seasons)?b.seasons:[];for(const L of R){const N=L.number,z=Array.isArray(L.episodes)?L.episodes:[];for(const K of z){const W=K.number,O=`${w}_${N}_${W}`,B=p.get(O);if(B&&B.completed)continue;const D=K.last_watched_at?new Date(K.last_watched_at).getTime():Date.now();l.push({id:w,title:C,posterPath:y,backdropPath:E,type:"tv",isSeries:!0,season:N,episode:W,currentTime:x,duration:x,progressPercent:100,completed:!0,traktImported:!0,lastWatchedAt:D,...A}),o++}}}))}}}catch(h){s.push(h.message)}try{const h=await fetch(`${ht}/sync/playback?extended=full&limit=50`,{headers:Bt(t)});if(!h.ok)throw new Error(`Yarım kalanlar alınamadı (${h.status})`);if(h.ok){const g=await h.json();if(Array.isArray(g))for(const v of g){const b=v.type==="movie",w=b?v.movie:v.show||v.episode,k=w?.ids?.tmdb||v.show?.ids?.tmdb||v.episode?.ids?.tmdb;if(!k)continue;const f=b?1:v.episode?.season||1,y=b?1:v.episode?.number||1,E=Math.min(99,Math.max(1,Math.round(v.progress||0))),C=v.paused_at?new Date(v.paused_at).getTime():Date.now(),x=`${k}_${f}_${y}`,A=p.get(x);let R=A?.poster_path||A?.posterPath||"",L=A?.backdrop_path||A?.backdropPath||"",N=A?.title||w.title||v.show?.title||"",z=b?6600:3e3,K={};if(!R||!N){const O=await Gr(k,!b);O&&(R=O.poster_path||"",L=O.backdrop_path||"",N=O.title||O.name||N,O.runtime?z=O.runtime*60:O.episode_run_time?.[0]&&(z=O.episode_run_time[0]*60),b||(K={number_of_episodes:O.number_of_episodes,number_of_seasons:O.number_of_seasons,status:O.status,seasons:O.seasons}))}const W=Math.max(60,Math.round(E/100*z));l.push({id:k,title:N,posterPath:R,backdropPath:L,type:b?"movie":"tv",isSeries:!b,season:b?void 0:f,episode:b?void 0:y,currentTime:W,duration:z,progressPercent:E,completed:!1,traktImported:!0,lastWatchedAt:C,...K}),r++}}}catch(h){s.push(h.message)}if(l.length>0){if(n)n(l);else if(i)for(const h of l)i(h)}return window.dispatchEvent(new CustomEvent("cinepulse_data_changed",{detail:{action:"import",source:"trakt"}})),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{action:"import",source:"trakt"}})),{importedPlaybackCount:r,importedHistoryCount:o,errors:s}}async function hl(e){if(!Xt())throw new Error("Trakt hesabı bağlı değil");const{getWatchHistory:t,saveWatchProgress:i,saveBatchWatchProgress:n}=e,a={pushedMoviesCount:0,pushedEpisodesCount:0,importedPlaybackCount:0,importedHistoryCount:0,errors:[]};if(i||n)try{const r=await Md(e);a.importedPlaybackCount=r.importedPlaybackCount||0,a.importedHistoryCount=r.importedHistoryCount||0,a.errors.push(...r.errors||[])}catch(r){a.errors.push(`Trakt'tan aktarma: ${r.message}`)}try{const o=(t?t():[]).filter(s=>s.completed&&!s.traktImported);if(o.length>0){const s=await Rd(o);if(s&&s.added){a.pushedMoviesCount=s.added.movies||0,a.pushedEpisodesCount=s.added.episodes||0;const l=Object.values(s.not_found||{}).reduce((u,p)=>u+(Array.isArray(p)?p.length:0),0);l&&a.errors.push(`Trakt ${l} içeriği katalogunda bulamadı`)}}}catch(r){a.errors.push(`Trakt'a gönderme: ${r.message||"Senkronizasyon hatası"}`)}return a.errors.length===0&&localStorage.setItem(ot.LAST_SYNC,String(Date.now())),a}async function Pd(){const e=await di();if(!e)throw new Error("Trakt hesabı bağlı değil");const t=await fetch(`${ht}/sync/history?limit=1000`,{headers:Bt(e)});if(!t.ok)throw new Error("Trakt geçmişi alınamadı");const i=await t.json();if(!Array.isArray(i)||i.length===0)return 0;const n=i.map(o=>o.id).filter(Boolean);if(n.length===0)return 0;const a=await fetch(`${ht}/sync/history/remove`,{method:"POST",headers:Bt(e),body:JSON.stringify({ids:n})});if(!a.ok){const o=await a.text();throw new Error(`Trakt geçmişi silinemedi: ${o}`)}const r=await a.json();return(r.deleted?.movies||0)+(r.deleted?.episodes||0)}let Qt=null;function nr(){let e=document.getElementById("trakt-modal");e||(e=document.createElement("div"),e.id="trakt-modal",e.className="modal-backdrop",document.body.appendChild(e));const t=(a="main",r={})=>{const o=Xt(),s=xd(),l=Bi(),u=Ed();let p="Henüz yapılmadı";if(u){const h=new Date(u);p=`${h.toLocaleDateString("tr-TR")} ${h.toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})}`}if(a==="connecting"){const{userCode:h,verificationUrl:g,expiresIn:v}=r;e.innerHTML=`
        <div class="data-modal-content trakt-dialog">
          <div class="data-modal-header" style="border-bottom: 1px solid rgba(237, 28, 36, 0.2);">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div class="trakt-logo-badge">
                <i data-lucide="tv" style="width: 18px; height: 18px; color: #ed1c24;"></i>
              </div>
              <h2 class="data-modal-title" style="color: #fff;">Trakt.tv Cihaz Aktivasyonu</h2>
            </div>
            <button id="trakt-close-btn" class="btn-modal-close" title="Kapat (ESC)">
              <i data-lucide="x" style="width: 18px; height: 18px;"></i>
            </button>
          </div>

          <div class="data-modal-body" style="text-align: center; padding: 2rem 1.5rem;">
            <div class="trakt-pulse-loader">
              <div class="trakt-pulse-circle"></div>
              <i data-lucide="smartphone" style="width: 32px; height: 32px; color: #ed1c24;"></i>
            </div>

            <h3 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin: 1rem 0 0.5rem;">
              Aktivasyon Kodunuz
            </h3>
            <p style="font-size: 0.88rem; color: #94a3b8; max-width: 380px; margin: 0 auto 1.5rem;">
              Aşağıdaki kodu kopyalayıp Trakt onay sayfasında girerek CinePulse'ı yetkilendirin:
            </p>

            <div class="trakt-code-display" id="btn-copy-trakt-code" title="Kodu Kopyala">
              <span class="trakt-code-text">${h||"---- ----"}</span>
              <button class="trakt-code-copy-icon">
                <i data-lucide="copy" style="width: 16px; height: 16px;"></i>
              </button>
            </div>

            <div style="display: flex; gap: 0.8rem; justify-content: center; margin-top: 1.8rem; flex-wrap: wrap;">
              <a href="${g||"https://trakt.tv/activate"}" target="_blank" rel="noopener noreferrer" class="btn-primary trakt-btn-glow" style="padding: 0.75rem 1.6rem; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                <i data-lucide="external-link" style="width: 16px; height: 16px;"></i>
                <span>trakt.tv/activate Sayfasını Aç</span>
              </a>
              <button id="btn-cancel-trakt-poll" class="btn-secondary" style="padding: 0.75rem 1.4rem;">
                İptal Et
              </button>
            </div>

            <div class="trakt-waiting-status" style="margin-top: 1.8rem; font-size: 0.82rem; color: #64748b; display: flex; align-items: center; justify-content: center; gap: 6px;">
              <span class="trakt-dot-ping"></span>
              <span id="trakt-poll-status-text">Trakt onayınız bekleniyor...</span>
            </div>
          </div>
        </div>
      `}else e.innerHTML=`
        <div class="data-modal-content trakt-dialog">
          <div class="data-modal-header" style="border-bottom: 1px solid rgba(237, 28, 36, 0.2);">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div class="trakt-logo-badge">
                <i data-lucide="tv" style="width: 18px; height: 18px; color: #ed1c24;"></i>
              </div>
              <h2 class="data-modal-title" style="color: #fff;">Trakt.tv Entegrasyonu</h2>
            </div>
            <button id="trakt-close-btn" class="btn-modal-close" title="Kapat (ESC)">
              <i data-lucide="x" style="width: 18px; height: 18px;"></i>
            </button>
          </div>

          <div class="data-modal-body" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem;">
            ${o?`
              <!-- Connected Profile Card -->
              <div class="trakt-profile-card">
                <div class="trakt-profile-avatar-wrap">
                  ${s?.images?.avatar?.full?`
                    <img src="${s.images.avatar.full}" class="trakt-avatar-img" alt="${s.username}" />
                  `:`
                    <div class="trakt-avatar-placeholder">
                      <i data-lucide="user" style="width: 26px; height: 26px; color: #ed1c24;"></i>
                    </div>
                  `}
                  <div class="trakt-status-dot-active" title="Bağlı"></div>
                </div>

                <div class="trakt-profile-details">
                  <div class="trakt-profile-header-row">
                    <span class="trakt-username">${s?.name||s?.username||"Trakt Kullanıcısı"}</span>
                    ${s?.vip?'<span class="trakt-vip-badge">VIP</span>':""}
                    <span class="trakt-connected-badge">BAĞLI</span>
                  </div>
                  <div class="trakt-profile-meta">
                    <span>@${s?.username||"trakt"}</span>
                    <span>•</span>
                    <span>Son Eşitleme: <strong>${p}</strong></span>
                  </div>
                </div>
              </div>

              <!-- Action & Sync Panel -->
              <div class="backup-card" style="border: 1px solid rgba(237, 28, 36, 0.2); background: rgba(237, 28, 36, 0.04);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                  <h3 class="backup-card-title" style="color: #fff; margin: 0; font-size: 0.95rem;">
                    <i data-lucide="refresh-cw" style="color: #ed1c24;"></i>
                    <span>Karşılıklı Senkronizasyon (İki Yönlü)</span>
                  </h3>
                  <button id="btn-trakt-sync-now" class="btn-primary trakt-btn-glow" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
                    <i data-lucide="refresh-cw" id="trakt-sync-icon" style="width: 14px; height: 14px;"></i>
                    <span>Şimdi Eşitle</span>
                  </button>
                </div>
                <p style="font-size: 0.82rem; color: #94a3b8; margin: 0; line-height: 1.5;">
                  CinePulse'daki geçmişi Trakt'a yükler ve Trakt'ta izlediğin veya yarım bıraktığın içerikleri doğrudan CinePulse kütüphanene aktarır.
                </p>
                <div id="trakt-sync-result" style="display: none; margin-top: 0.8rem; padding: 0.6rem 0.8rem; border-radius: 8px; font-size: 0.8rem; background: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.3); color: #4ade80;"></div>
              </div>

              <!-- Clean corrupted Trakt imports Panel -->
              <div class="backup-card" style="border: 1px solid rgba(239, 68, 68, 0.25); background: rgba(239, 68, 68, 0.05); display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; gap: 10px;">
                <div>
                  <div style="font-size: 0.85rem; font-weight: 600; color: #f87171;">Hatalı Trakt Kayıtlarını Temizle</div>
                  <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Önceki aktarımda CinePulse'a giren sahte/bozuk kayıtları tek tıkla kaldırır.</div>
                </div>
                <button id="btn-clean-trakt-history" class="btn-secondary" style="color: #f87171; border-color: rgba(239, 68, 68, 0.4); padding: 0.45rem 0.9rem; font-size: 0.8rem; flex-shrink: 0; display: inline-flex; align-items: center; gap: 6px;">
                  <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                  <span>Temizle</span>
                </button>
              </div>

              <!-- Wipe Remote Trakt History Panel -->
              <div class="backup-card" style="border: 1px solid rgba(245, 158, 11, 0.25); background: rgba(245, 158, 11, 0.05); display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; gap: 10px;">
                <div>
                  <div style="font-size: 0.85rem; font-weight: 600; color: #fbbf24;">Trakt.tv Geçmişini Tamamen Sıfırla</div>
                  <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Trakt hesabındaki tüm eski ve karışmış izleme kayıtlarını tamamen siler (temiz sayfa).</div>
                </div>
                <button id="btn-wipe-trakt-history" class="btn-secondary" style="color: #fbbf24; border-color: rgba(245, 158, 11, 0.4); padding: 0.45rem 0.9rem; font-size: 0.8rem; flex-shrink: 0; display: inline-flex; align-items: center; gap: 6px;">
                  <i data-lucide="eraser" style="width: 14px; height: 14px;"></i>
                  <span>Trakt'ı Sıfırla</span>
                </button>
              </div>

              <!-- Settings Controls -->
              <div class="trakt-settings-list">
                <div class="trakt-setting-row">
                  <div>
                    <div class="trakt-setting-title">Otomatik Eşitle</div>
                    <div class="trakt-setting-sub">CinePulse açıldığında, Trakt bağlandığında ve uygulamaya döndüğünde geçmişi arka planda eşitler.</div>
                  </div>
                  <label class="switch-toggle">
                    <input type="checkbox" id="trakt-toggle-autosync" ${l.autoSyncOnLaunch?"checked":""} />
                    <span class="slider-round"></span>
                  </label>
                </div>
                <div class="trakt-setting-row">
                  <div>
                    <div class="trakt-setting-title">Otomatik Scrobble (Canlı Takip)</div>
                    <div class="trakt-setting-sub">Oynatıcı açıkken içeriğin izleme durumunu Trakt'a anlık bildirir.</div>
                  </div>
                  <label class="switch-toggle">
                    <input type="checkbox" id="trakt-toggle-scrobble" ${l.autoScrobble?"checked":""} />
                    <span class="slider-round"></span>
                  </label>
                </div>
              </div>

              <!-- Footer Actions -->
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 0.75rem; border-top: 1px solid rgba(255, 255, 255, 0.08);">
                <button id="btn-trakt-disconnect" style="color: #ef4444; background: none; border: none; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 0.4rem 0;">
                  <i data-lucide="log-out" style="width: 15px; height: 15px;"></i>
                  <span>Trakt Bağlantısını Kes</span>
                </button>

                <button id="trakt-close-footer-btn" class="btn-secondary" style="padding: 0.5rem 1.2rem; font-size: 0.85rem;">
                  Tamam
                </button>
              </div>
            `:`
              <!-- Not Connected Hero -->
              <div class="trakt-hero-banner">
                <div class="trakt-hero-info">
                  <span class="trakt-pill-tag">Buluşma Noktası</span>
                  <h3 class="trakt-hero-title">İzlediklerini Trakt ile Otomatik Eşitle</h3>
                  <p class="trakt-hero-sub">
                    CinePulse üzerinden izlediğin dizi ve filmler anında Trakt profiline işlensin.
                    Watchlist ve izleme geçmişin tüm cihazlarında senkron kalsın.
                  </p>
                </div>
              </div>

              <!-- Feature Grid -->
              <div class="trakt-features-grid">
                <div class="trakt-feature-item">
                  <div class="trakt-feat-icon" style="background: rgba(237, 28, 36, 0.15); color: #ed1c24;">
                    <i data-lucide="play-circle" style="width: 20px; height: 20px;"></i>
                  </div>
                  <div>
                    <div class="trakt-feat-title">Canlı Scrobble</div>
                    <div class="trakt-feat-desc">İzlediğin içerik oynatılırken anında Trakt'ta görünür.</div>
                  </div>
                </div>

                <div class="trakt-feature-item">
                  <div class="trakt-feat-icon" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">
                    <i data-lucide="refresh-cw" style="width: 20px; height: 20px;"></i>
                  </div>
                  <div>
                    <div class="trakt-feat-title">Çift Yönlü Senkron</div>
                    <div class="trakt-feat-desc">Trakt izleme listen ve geçmişin CinePulse ile eşitlenir.</div>
                  </div>
                </div>

                <div class="trakt-feature-item">
                  <div class="trakt-feat-icon" style="background: rgba(34, 197, 94, 0.15); color: #22c55e;">
                    <i data-lucide="shield-check" style="width: 20px; height: 20px;"></i>
                  </div>
                  <div>
                    <div class="trakt-feat-title">Şifresiz Güvenli Bağlantı</div>
                    <div class="trakt-feat-desc">Aktivasyon koduyla resmi Trakt sayfasından tek tıkla bağlanın.</div>
                  </div>
                </div>
              </div>

              <!-- Connect Button -->
              <button id="btn-start-trakt-connect" class="btn-primary trakt-btn-glow" style="margin-top: 0.5rem; justify-content: center; padding: 0.85rem 1.5rem; font-size: 0.95rem;">
                <i data-lucide="link" style="width: 18px; height: 18px;"></i>
                <span>Trakt.tv Hesabını Bağla</span>
              </button>
            `}
          </div>
        </div>
      `;e.classList.remove("hidden"),document.body.style.overflow="hidden",G(e),n(a)},i=()=>{Ea(),e.classList.add("hidden"),e.innerHTML="",document.body.style.overflow="",Qt&&(window.removeEventListener("keydown",Qt),Qt=null)},n=a=>{const r=document.getElementById("trakt-close-btn"),o=document.getElementById("trakt-close-footer-btn");if(r&&(r.onclick=i),o&&(o.onclick=i),e.onclick=s=>{s.target===e&&i()},Qt&&window.removeEventListener("keydown",Qt),Qt=s=>{s.key==="Escape"&&i()},window.addEventListener("keydown",Qt),a==="connecting"){const s=document.getElementById("btn-copy-trakt-code");s&&(s.onclick=()=>{const u=s.querySelector(".trakt-code-text")?.textContent;u&&navigator.clipboard.writeText(u).then(()=>{ee("Aktivasyon kodu kopyalandı!","success")}).catch(()=>{ee(`Kod: ${u}`,"info")})});const l=document.getElementById("btn-cancel-trakt-poll");l&&(l.onclick=()=>{Ea(),t("main")})}else{const s=document.getElementById("btn-start-trakt-connect");s&&(s.onclick=async()=>{s.disabled=!0,s.innerHTML="<span>Kod alınıyor...</span>";try{const b=await Td();t("connecting",{userCode:b.user_code,verificationUrl:b.verification_url,expiresIn:b.expires_in}),Ad(b.device_code,b.interval,w=>{const k=document.getElementById("trakt-poll-status-text");k&&(k.textContent=w.message)}).then(()=>{ee("Trakt.tv başarıyla bağlandı!","success"),t("main")}).catch(w=>{w.message!=="Auth polling cancelled"&&(ee(`Bağlantı hatası: ${w.message}`,"error"),t("main"))})}catch(b){ee(`Trakt bağlantı başlatılamadı: ${b.message}`,"error"),t("main")}});const l=document.getElementById("btn-trakt-sync-now");l&&(l.onclick=async()=>{const b=document.getElementById("trakt-sync-icon"),w=document.getElementById("trakt-sync-result");l.disabled=!0,b&&b.classList.add("trakt-spin");try{const k=await hl({getWatchHistory:Be,saveWatchProgress:Wa,saveBatchWatchProgress:Xo});w&&(w.style.display="block",w.innerHTML=`
                <strong>${k.errors.length?"Senkronizasyon kısmen tamamlandı":"✓ Karşılıklı senkronizasyon tamamlandı!"}</strong><br/>
                • ${k.pushedMoviesCount} film & ${k.pushedEpisodesCount} dizi Trakt'a yüklendi<br/>
                • ${k.importedPlaybackCount} yarım kalan & ${k.importedHistoryCount} izlenen Trakt'tan CinePulse'a aktarıldı
              `),k.errors.length?ee(`Trakt senkronizasyon uyarısı: ${k.errors.join("; ")}`,"error"):(ee("CinePulse ve Trakt başarıyla karşılıklı eşitlendi!","success"),setTimeout(()=>t("main"),2500))}catch(k){ee(`Aktarım hatası: ${k.message}`,"error")}finally{l.disabled=!1,b&&b.classList.remove("trakt-spin")}});const u=document.getElementById("btn-clean-trakt-history");u&&(u.onclick=()=>{const b=Vc();ee(`${b} adet hatalı Trakt kaydı geçmişten temizlendi!`,"success"),t("main")});const p=document.getElementById("btn-wipe-trakt-history");p&&(p.onclick=async()=>{if(confirm("Trakt.tv hesabınızdaki tüm izleme geçmişini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")){p.disabled=!0,p.innerHTML="<span>Sıfırlanıyor...</span>";try{const b=await Pd();ee(`Trakt hesabından ${b} adet kayıt tamamen silindi!`,"success"),t("main")}catch(b){ee(`Hata: ${b.message}`,"error"),p.disabled=!1,t("main")}}});const h=document.getElementById("trakt-toggle-autosync");h&&(h.onchange=b=>{Os({autoSyncOnLaunch:b.target.checked}),ee(b.target.checked?"Açılışta otomatik eşitleme açıldı":"Açılışta otomatik eşitleme kapatıldı","info")});const g=document.getElementById("trakt-toggle-scrobble");g&&(g.onchange=b=>{Os({autoScrobble:b.target.checked}),ee(b.target.checked?"Otomatik Scrobble açıldı":"Otomatik Scrobble kapatıldı","info")});const v=document.getElementById("btn-trakt-disconnect");v&&(v.onclick=()=>{confirm("Trakt.tv bağlantısını kesmek istediğinize emin misiniz?")&&(Ld(),ee("Trakt.tv bağlantısı kesildi","info"),t("main"))})}};t("main")}function fl(){const e=document.getElementById("data-modal");if(!e)return;const t=rd();e.innerHTML=`
    <div class="data-modal-content">
      <div class="data-modal-header">
        <h2 class="data-modal-title">
          <i data-lucide="hard-drive" style="color: var(--secondary); flex-shrink: 0; width: 20px; height: 20px;"></i>
          <span>Yerel Önbellek & Yedek</span>
        </h2>
        <button id="data-close-btn" class="btn-modal-close" title="Kapat (ESC)" aria-label="Kapat">
          <i data-lucide="x" style="width: 18px; height: 18px;"></i>
        </button>
      </div>

      <div class="data-modal-body">
        <!-- Export Section -->
        <div class="backup-card">
          <h3 class="backup-card-title" style="color: var(--accent-cyan);">
            <i data-lucide="download"></i> JSON İndir (Yedekle)
          </h3>
          <p style="font-size: 0.88rem; color: var(--text-sub); line-height: 1.6; margin: 0;">
            Tüm izleme geçmişinizi, kaldığınız saniyeleri ve favorilerinizi <strong>.json</strong> olarak cihazınıza indirin.
          </p>

          <div class="backup-stats-box">
            <div style="font-weight: 600; color: #cbd5e1;">Mevcut Durum:</div>
            <div>• İzlenen İçerik Sayısı: <strong>${t.historyCount}</strong> adet</div>
            <div>• Favorilerim Sayısı: <strong>${t.favoritesCount}</strong> adet</div>
            <div>• Kullanılan Hafıza: ~${t.kb} KB</div>
          </div>

          <button id="btn-export-json" class="btn-primary" style="margin-top: auto; justify-content: center;">
            <i data-lucide="file-json"></i>
            <span>JSON Yedeği İndir</span>
          </button>
        </div>

        <!-- Import Section -->
        <div class="backup-card">
          <h3 class="backup-card-title" style="color: var(--accent-green);">
            <i data-lucide="upload"></i> JSON Yükle (Aktar)
          </h3>
          <p style="font-size: 0.88rem; color: var(--text-sub); line-height: 1.6; margin: 0;">
            Başka bir cihazdan indirilen <strong>.json</strong> yedek dosyasını buraya sürükleyip anında senkronize edin.
          </p>

          <div class="dropzone" id="json-dropzone">
            <i data-lucide="folder-open" style="width: 36px; height: 36px; color: var(--secondary); margin-bottom: 0.4rem;"></i>
            <div style="font-size: 0.88rem; font-weight: 600;">JSON Dosyası Seçin veya Sürükleyin</div>
            <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 0.2rem;">.json uzantılı yedek dosyası</div>
            <input type="file" id="json-file-input" accept=".json" style="display: none;" />
          </div>

          <div style="display: flex; gap: 1rem; align-items: center; font-size: 0.82rem; flex-wrap: wrap;">
            <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
              <input type="radio" name="import-mode" value="merge" checked />
              <span>Birleştir</span>
            </label>
            <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
              <input type="radio" name="import-mode" value="replace" />
              <span>Üzerine yaz</span>
            </label>
          </div>
        </div>

        <!-- Trakt.tv Cloud Sync Section -->
        <div class="backup-card" style="border: 1px solid rgba(237, 28, 36, 0.25); background: rgba(237, 28, 36, 0.04);">
          <h3 class="backup-card-title" style="color: #ed1c24;">
            <i data-lucide="tv"></i> Trakt.tv Bulut Eşitleme
          </h3>
          <p style="font-size: 0.88rem; color: var(--text-sub); line-height: 1.6; margin: 0;">
            İzleme geçmişinizi ve izleme listenizi Trakt.tv ile bulut üzerinden çift yönlü eşitleyin.
          </p>

          <div class="backup-stats-box">
            <div style="font-weight: 600; color: #cbd5e1;">Trakt Durumu:</div>
            <div>• Bağlantı: <strong>${Xt()?'<span style="color:#4ade80;">● Bağlı</span>':'<span style="color:#94a3b8;">○ Bağlı Değil</span>'}</strong></div>
            <div>• Otomatik Scrobble & İzleme Listesi</div>
          </div>

          <button id="btn-open-trakt-from-data" class="btn-primary trakt-btn-glow" style="margin-top: auto; justify-content: center;">
            <i data-lucide="repeat"></i>
            <span>Trakt.tv Yönetimi & Eşitle</span>
          </button>
        </div>
      </div>

      <div class="data-modal-footer">
        <button id="btn-clear-all-data" style="color: var(--primary); font-size: 0.86rem; font-weight: 600; display: flex; align-items: center; gap: 0.45rem; background: none; border: none; cursor: pointer; padding: 0.4rem 0;">
          <i data-lucide="trash-2" style="width:15px; height:15px"></i>
          <span>Tüm İzleme Geçmişini Sıfırla</span>
        </button>

        <button id="data-close-footer-btn" class="btn-secondary" style="padding: 0.55rem 1.4rem;">
          Kapat
        </button>
      </div>
    </div>
  `,e.classList.remove("hidden"),document.body.style.overflow="hidden",G();const i=document.getElementById("data-close-btn"),n=document.getElementById("data-close-footer-btn");let a=null;const r=()=>{e.classList.add("hidden"),e.innerHTML="",document.body.style.overflow="",a&&(window.removeEventListener("keydown",a),a=null)};i&&i.addEventListener("click",r),n&&n.addEventListener("click",r),e.onclick=g=>{g.target===e&&r()},a=g=>{g.key==="Escape"&&r()},window.addEventListener("keydown",a);const o=document.getElementById("btn-export-json");o&&o.addEventListener("click",()=>{nl(),ee("JSON yedek dosyası indirildi!","success")});const s=document.getElementById("btn-open-trakt-from-data");s&&s.addEventListener("click",()=>{r(),nr()});const l=document.getElementById("json-dropzone"),u=document.getElementById("json-file-input");l&&u&&(l.addEventListener("click",()=>u.click()),l.addEventListener("dragover",g=>{g.preventDefault(),l.style.borderColor="var(--accent-green)"}),l.addEventListener("dragleave",()=>{l.style.borderColor="rgba(99, 102, 241, 0.4)"}),l.addEventListener("drop",g=>{g.preventDefault(),l.style.borderColor="rgba(99, 102, 241, 0.4)",g.dataTransfer.files.length>0&&p(g.dataTransfer.files[0])}),u.addEventListener("change",g=>{g.target.files.length>0&&p(g.target.files[0])}));function p(g){if(!g)return;const v=new FileReader;v.onload=b=>{try{const w=document.querySelector('input[name="import-mode"]:checked'),k=w?w.value:"merge",f=rl(b.target.result,k);f.success?(ee(`✓ Yedek yüklendi! (${f.countHistory} izleme kaydı, ${f.countFavs} favori aktarıldı)`,"success"),r()):ee(`Yükleme hatası: ${f.message||f.error}`,"error")}catch(w){ee(`Yedek dosyası işlenirken hata oluştu: ${w.message}`,"error")}},v.onerror=()=>{ee("Dosya okunamadı.","error")},v.readAsText(g)}const h=document.getElementById("btn-clear-all-data");h&&h.addEventListener("click",()=>{confirm("Tüm izleme geçmişinizi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!")&&(ad(),ee("Tüm yerel veriler temizlendi.","info"),r())})}let _i=null,en=!1;function rr(){return window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===!0||document.referrer.includes("android-app://")}function Bd(){if(rr()){en=!0,Hi(!1);return}window.addEventListener("beforeinstallprompt",t=>{t.preventDefault(),_i=t,Hi(!0)}),window.addEventListener("appinstalled",()=>{_i=null,en=!0,Hi(!1),ee("CinePulse başarıyla cihazınıza yüklendi!","success")}),window.matchMedia("(display-mode: standalone)").addEventListener("change",t=>{t.matches&&(en=!0,Hi(!1))}),/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream&&!rr()&&setTimeout(()=>{Hi(!0)},1e3)}function Hi(e){document.querySelectorAll(".btn-pwa-install").forEach(i=>{e&&!en&&!rr()?i.classList.remove("hidden"):i.classList.add("hidden")})}async function Dd(){if(rr()||en){ee("CinePulse zaten bir uygulama olarak yüklü.","info");return}if(_i){try{_i.prompt(),(await _i.userChoice).outcome==="accepted"?ee("Yükleme başlatıldı...","success"):ee("Yükleme iptal edildi.","info"),_i=null}catch{}return}/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream?Nd():Od()}function Nd(){let e=document.getElementById("pwa-ios-modal");e||(e=document.createElement("div"),e.id="pwa-ios-modal",e.className="modal-backdrop pwa-guide-modal",e.innerHTML=`
      <div class="modal-content glass-panel pwa-guide-content">
        <div class="pwa-guide-header">
          <div class="pwa-guide-logo">
            <img src="/icon-192.png" alt="CinePulse" width="48" height="48" style="border-radius: 12px;" />
            <div>
              <h3>CinePulse'ı Yükle</h3>
              <p>iPhone / iPad Ana Ekranınıza Ekleyin</p>
            </div>
          </div>
          <button class="btn-icon pwa-close-btn">&times;</button>
        </div>
        <div class="pwa-guide-steps">
          <div class="pwa-step">
            <span class="step-num">1</span>
            <span>Safari'nin alt menüsündeki <strong>Paylaş</strong> (kare içinden yukarı ok) simgesine dokunun.</span>
          </div>
          <div class="pwa-step">
            <span class="step-num">2</span>
            <span>Açılan menüyü aşağı kaydırıp <strong>"Ana Ekrana Ekle"</strong> seçeneğini seçin.</span>
          </div>
          <div class="pwa-step">
            <span class="step-num">3</span>
            <span>Sağ üstteki <strong>"Ekle"</strong> butonuna dokunarak kurulumu tamamlayın.</span>
          </div>
        </div>
        <button class="btn-primary pwa-done-btn" style="width: 100%; margin-top: 16px;">Anladım</button>
      </div>
    `,document.body.appendChild(e),e.querySelector(".pwa-close-btn").addEventListener("click",()=>{e.classList.add("hidden")}),e.querySelector(".pwa-done-btn").addEventListener("click",()=>{e.classList.add("hidden")}),e.addEventListener("click",t=>{t.target===e&&e.classList.add("hidden")})),e.classList.remove("hidden")}function Od(){ee('Tarayıcınızın adres çubuğundaki "Yükle / Uygulamayı Yükle" simgesine tıklayarak indirebilirsiniz.',"info",5e3)}const Us="1.1.0",zd="https://raw.githubusercontent.com/caca1403/cine-pulse/main/public/version.json",ml="cinepulse_update_snoozed_until";function Hd(){return typeof window>"u"?!1:!!(window.Capacitor?.isNativePlatform?.()||window.Capacitor?.getPlatform?.()==="android"||navigator.userAgent.includes("CinePulseAndroid"))}function qd(e,t){if(!e||!t)return!1;const i=u=>String(u).replace(/^v/i,"").split(".").map(p=>parseInt(p,10)||0),[n,a,r]=i(e),[o,s,l]=i(t);return n>o||n===o&&a>s||n===o&&a===s&&r>l}function Fd(e){if(document.getElementById("cinepulse-update-modal"))return;const t=document.createElement("div");t.id="cinepulse-update-modal",t.className="cinepulse-modal-overlay",t.style.cssText=`
    position: fixed;
    inset: 0;
    z-index: 999999;
    background: rgba(4, 7, 14, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    animation: fadeInModal 0.25s ease-out;
  `;const i=(e.releaseNotes||"Performans iyileştirmeleri ve hata düzeltmeleri.").split(`
`).filter(Boolean).map(r=>`<li style="margin-bottom: 0.45rem;">${js(r.replace(/^[•\-\*]\s*/,""))}</li>`).join("");t.innerHTML=`
    <div class="cinepulse-update-card" style="
      background: linear-gradient(145deg, rgba(19, 24, 38, 0.98), rgba(13, 17, 26, 0.98));
      border: 1px solid rgba(245, 158, 11, 0.35);
      border-radius: 24px;
      padding: 2.2rem 2rem;
      max-width: 460px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(245, 158, 11, 0.15);
      position: relative;
      text-align: center;
      color: #fff;
    ">
      <!-- Glow Header Icon -->
      <div style="
        width: 64px;
        height: 64px;
        border-radius: 20px;
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.1));
        border: 1px solid rgba(245, 158, 11, 0.4);
        margin: 0 auto 1.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #f59e0b;
        box-shadow: 0 0 20px rgba(245, 158, 11, 0.25);
      ">
        <i data-lucide="sparkles" style="width: 30px; height: 30px;"></i>
      </div>

      <div style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.25rem 0.85rem; border-radius: 9999px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); color: #fbbf24; font-size: 0.76rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.8rem;">
        <span>YENİ GÜNCELLEME MEVCUT</span>
      </div>

      <h2 style="font-size: 1.45rem; font-weight: 800; margin: 0 0 0.5rem; letter-spacing: -0.02em;">
        ${js(e.title||`CinePulse v${e.version}`)}
      </h2>

      <p style="font-size: 0.88rem; color: #94a3b8; margin: 0 0 1.2rem; line-height: 1.5;">
        Daha akıcı oynatıcı ve yeni özellikler içeren resmi CinePulse güncellemesi hazır!
      </p>

      <div style="
        text-align: left;
        background: rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.07);
        border-radius: 14px;
        padding: 1rem 1.2rem;
        margin-bottom: 1.6rem;
        max-height: 140px;
        overflow-y: auto;
      ">
        <div style="font-size: 0.76rem; font-weight: 700; color: #cbd5e1; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.04em;">
          Yenilikler:
        </div>
        <ul style="margin: 0; padding-left: 1.1rem; font-size: 0.84rem; color: #94a3b8; line-height: 1.45;">
          ${i}
        </ul>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <a id="btn-update-download" href="${e.downloadUrl}" target="_blank" rel="noopener noreferrer" style="
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #0b0f19;
          font-weight: 800;
          font-size: 0.95rem;
          padding: 0.85rem 1.6rem;
          border-radius: 9999px;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(245, 158, 11, 0.35);
          transition: all 0.2s ease;
        ">
          <i data-lucide="download" style="width: 18px; height: 18px; stroke-width: 2.5;"></i>
          <span>Şimdi Güncelle (APK İndir)</span>
        </a>

        ${e.mandatory?"":`
          <button id="btn-update-later" type="button" style="
            background: transparent;
            border: none;
            color: #64748b;
            font-size: 0.84rem;
            font-weight: 600;
            padding: 0.5rem;
            cursor: pointer;
            transition: color 0.2s ease;
          ">
            Daha Sonra Hatırlat
          </button>
        `}
      </div>
    </div>
  `,document.body.appendChild(t),G(t);const n=t.querySelector("#btn-update-later");n&&n.addEventListener("click",()=>{try{localStorage.setItem(ml,String(Date.now()+12*60*60*1e3))}catch{}t.remove()});const a=t.querySelector("#btn-update-download");a&&a.addEventListener("click",()=>{ee("APK indirmesi başlatılıyor...","info"),setTimeout(()=>{try{t.remove()}catch{}},1500)})}function js(e=""){return String(e).replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t])}async function gl({manual:e=!1}={}){if(!e)try{const t=parseInt(localStorage.getItem(ml)||"0",10);if(Date.now()<t)return null}catch{}try{const t=await fetch(`${zd}?_t=${Date.now()}`,{signal:AbortSignal.timeout(6e3),cache:"no-store"});if(!t.ok)throw new Error(`HTTP ${t.status}`);const i=await t.json();if(i&&qd(i.version,Us))return Fd(i),i;if(e)return ee(`✓ CinePulse güncel (v${Us})`,"success"),null}catch{return e&&ee("Güncelleme sunucusuna erişilemedi.","error"),null}}function Ud(){typeof window>"u"||window.setTimeout(()=>{gl({manual:!1}).catch(()=>{})},4e3)}let Dn=null;function jd(){Ht();const e=document.createElement("div");e.id="profile-modal-root",e.className="profile-backdrop",document.body.appendChild(e),Dn=e;const t=(n="select")=>{const a=Vt(),r=hn();n==="select"?e.innerHTML=`
        <div class="profile-dialog">
          <button class="profile-close-btn" id="btn-close-profile-modal" title="Kapat">
            <i data-lucide="x" style="width: 20px; height: 20px;"></i>
          </button>

          <div class="profile-top-title">
            <h2>Kim İzliyor?</h2>
            <p>Kaldığınız yerden devam etmek için kendi profilinizi seçin.</p>
          </div>

          <!-- Profiles Grid -->
          <div class="profile-cards-grid">
            ${a.map(w=>{const k=w.id===r.id,f=w.id!=="prof_1";return`
                <div class="profile-card-wrapper">
                  <div class="profile-card ${k?"is-active":""}" data-profile-id="${w.id}">
                    <div class="profile-avatar-wrap" style="border-color: ${w.color||"#f59e0b"}; background: ${w.color||"#f59e0b"}22;">
                      <i data-lucide="${w.avatar||"user"}" style="width: 44px; height: 44px; color: ${w.color||"#f59e0b"};"></i>
                      ${k?`
                        <div class="profile-active-check">
                          <i data-lucide="check" style="width: 14px; height: 14px;"></i>
                        </div>
                      `:""}
                    </div>
                    <span class="profile-name">${w.name}</span>
                    ${w.isKid?'<span class="profile-kid-badge">Çocuk</span>':""}
                  </div>
                  ${f?`
                    <button class="btn-delete-profile" data-delete-id="${w.id}" title="Profili Sil">
                      <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
                    </button>
                  `:""}
                </div>
              `}).join("")}

            <!-- Add Profile Card -->
            <div class="profile-card-wrapper">
              <div class="profile-card profile-card-add" id="btn-show-add-profile">
                <div class="profile-avatar-wrap add-wrap">
                  <i data-lucide="plus" style="width: 38px; height: 38px; color: #94a3b8;"></i>
                </div>
                <span class="profile-name">Profil Ekle</span>
              </div>
            </div>
          </div>

          <!-- Bottom Management Bar -->
          <div class="profile-footer-bar" style="gap: 8px; flex-wrap: wrap;">
            <button class="btn-manage-profiles" id="btn-modal-open-trakt" title="Trakt.tv Senkronizasyonu">
              <i data-lucide="tv" style="width: 15px; height: 15px; color: #ed1c24;"></i>
              <span>Trakt.tv</span>
            </button>
            <button class="btn-manage-profiles" id="btn-modal-open-backup" title="Yedekleme & Veri Yönetimi">
              <i data-lucide="hard-drive-download" style="width: 15px; height: 15px;"></i>
              <span>Veri & Yedek</span>
            </button>
            ${Hd()?`
              <button class="btn-manage-profiles" id="btn-modal-check-update" title="Güncellemeleri Denetle">
                <i data-lucide="refresh-cw" style="width: 15px; height: 15px; color: #10b981;"></i>
                <span>Güncelleme</span>
              </button>
            `:`
              <a class="btn-manage-profiles" id="btn-modal-apk-download" href="https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk" target="_blank" rel="noopener noreferrer" title="Android APK İndir" style="text-decoration: none;">
                <i data-lucide="smartphone" style="width: 15px; height: 15px; color: #10b981;"></i>
                <span>Android APK</span>
              </a>
              <button class="btn-manage-profiles" id="btn-modal-pwa-install" title="CinePulse Web Uygulamasını Yükle">
                <i data-lucide="download" style="width: 15px; height: 15px;"></i>
                <span>Web Uygulaması</span>
              </button>
            `}
          </div>
        </div>
      `:n==="add"&&(e.innerHTML=`
        <div class="profile-dialog profile-dialog-small">
          <button class="profile-close-btn" id="btn-cancel-add-profile" title="Geri">
            <i data-lucide="arrow-left" style="width: 20px; height: 20px;"></i>
          </button>

          <div class="profile-top-title">
            <h2>Yeni Profil Oluştur</h2>
            <p>Kişiselleştirilmiş izleme geçmişi için yeni bir profil ekleyin.</p>
          </div>

          <form id="form-add-profile" class="profile-add-form">
            <div class="profile-input-group">
              <label>Profil Adı</label>
              <input type="text" id="new-profile-name" placeholder="Örn: Ayşe, Sinema Odası" required maxlength="20" autofocus />
            </div>

            <div class="profile-kid-toggle-row">
              <div class="kid-toggle-info">
                <span class="kid-toggle-title">Çocuk Profili 🎈</span>
                <span class="kid-toggle-sub">Sadece animasyonlar, çocuk dizileri ve güvenli kanallar gösterilir.</span>
              </div>
              <label class="switch-toggle">
                <input type="checkbox" id="new-profile-kid-check" />
                <span class="slider-round"></span>
              </label>
            </div>

            <div class="profile-color-picker-row">
              <label>Profil Rengi</label>
              <div class="profile-colors-wrap">
                ${["#f59e0b","#38bdf8","#ec4899","#10b981","#a855f7","#ef4444"].map((w,k)=>`
                  <button type="button" class="color-dot ${k===0?"active":""}" data-color="${w}" style="background: ${w};"></button>
                `).join("")}
              </div>
            </div>

            <div class="profile-form-actions">
              <button type="button" class="btn-secondary" id="btn-back-to-profiles">İptal</button>
              <button type="submit" class="btn-primary">Kaydet & Oluştur</button>
            </div>
          </form>
        </div>
      `),G(e);const o=e.querySelector("#btn-close-profile-modal");o&&(o.onclick=()=>Ht());const s=e.querySelector("#btn-show-add-profile");s&&(s.onclick=()=>t("add")),e.querySelectorAll(".btn-delete-profile").forEach(w=>{w.onclick=k=>{k.stopPropagation();const f=w.getAttribute("data-delete-id"),y=Vt().find(C=>C.id===f);if(!y||!confirm(`"${y.name}" profilini silmek istediğinize emin misiniz?`))return;qc(f)?(ee(`"${y.name}" profili silindi.`,"info"),t("select")):ee("Bu profil silinemez.","error")}});const l=e.querySelector("#btn-modal-open-trakt");l&&(l.onclick=()=>{Ht(),nr()});const u=e.querySelector("#btn-modal-open-backup");u&&(u.onclick=()=>{Ht(),fl()});const p=e.querySelector("#btn-modal-pwa-install");p&&(p.onclick=()=>{Dd()});const h=e.querySelector("#btn-modal-check-update");h&&(h.onclick=()=>{gl({manual:!0})}),e.querySelectorAll(".profile-card[data-profile-id]").forEach(w=>{w.onclick=()=>{const k=w.getAttribute("data-profile-id");if(k){const f=Vt().find(y=>y.id===k);Yn(k),Ht(),Ks(f)}}});const g=e.querySelector("#btn-cancel-add-profile");g&&(g.onclick=()=>t("select"));const v=e.querySelector("#btn-back-to-profiles");v&&(v.onclick=()=>t("select"));const b=e.querySelector("#form-add-profile");if(b){let w="#f59e0b";b.querySelectorAll(".color-dot").forEach(k=>{k.onclick=()=>{b.querySelectorAll(".color-dot").forEach(f=>f.classList.remove("active")),k.classList.add("active"),w=k.getAttribute("data-color")}}),b.onsubmit=k=>{k.preventDefault();const f=b.querySelector("#new-profile-name"),y=b.querySelector("#new-profile-kid-check"),E=f?f.value.trim():"",C=y?y.checked:!1;if(E){const x=Hc({name:E,isKid:C,avatar:C?"smile":"user",color:w});Yn(x.id),Ht(),Ks(x)}}}};t("select"),e.onclick=n=>{n.target===e&&Ht()};const i=n=>{n.key==="Escape"&&(Ht(),window.removeEventListener("keydown",i))};window.addEventListener("keydown",i)}function Ht(){if(Dn){try{Dn.remove()}catch{}Dn=null}}function Ks(e){const t=document.getElementById("profile-switch-curtain");t&&t.remove();const i=document.createElement("div");i.id="profile-switch-curtain",i.className="profile-switch-curtain is-entering",i.innerHTML=`
    <div class="profile-switch-card">
      <div class="profile-switch-avatar" style="border-color: ${e?.color||"#f59e0b"}; background: ${e?.color||"#f59e0b"}22;">
        <i data-lucide="${e?.avatar||(e?.isKid?"smile":"user")}" style="width: 50px; height: 50px; color: ${e?.color||"#f59e0b"};"></i>
      </div>
      <h2 class="profile-switch-name">${e?.name||"Profil"}</h2>
      <p class="profile-switch-subtitle">
        ${e?.isKid?"🎈 Güvenli Çocuk Moduna Geçiliyor...":"✨ Profiline Geçiliyor..."}
      </p>
      <div class="profile-switch-progress-bar">
        <div class="profile-switch-progress-fill"></div>
      </div>
    </div>
  `,document.body.appendChild(i),G(i),window.dispatchEvent(new CustomEvent("sineflix_profile_changed",{detail:{profile:e}})),setTimeout(()=>{i.classList.remove("is-entering"),i.classList.add("is-leaving"),setTimeout(()=>{i.remove()},450)},600)}const Kd="modulepreload",Wd=function(e,t){return new URL(e,t).href},Ws={},yl=function(t,i,n){let a=Promise.resolve();if(i&&i.length>0){const o=document.getElementsByTagName("link"),s=document.querySelector("meta[property=csp-nonce]"),l=s?.nonce||s?.getAttribute("nonce");a=Promise.allSettled(i.map(u=>{if(u=Wd(u,n),u in Ws)return;Ws[u]=!0;const p=u.endsWith(".css"),h=p?'[rel="stylesheet"]':"";if(!!n)for(let b=o.length-1;b>=0;b--){const w=o[b];if(w.href===u&&(!p||w.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${h}`))return;const v=document.createElement("link");if(v.rel=p?"stylesheet":Kd,p||(v.as="script"),v.crossOrigin="",v.href=u,l&&v.setAttribute("nonce",l),document.head.appendChild(v),p)return new Promise((b,w)=>{v.addEventListener("load",b),v.addEventListener("error",()=>w(new Error(`Unable to preload CSS for ${u}`)))})}))}function r(o){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=o,window.dispatchEvent(s),!s.defaultPrevented)throw o}return a.then(o=>{for(const s of o||[])s.status==="rejected"&&r(s.reason);return t().catch(r)})};async function Ri(e){return(await yl(()=>import("./PlayerModal-BtZURc71.js"),[],import.meta.url)).openPlayerModal(e)}let xi=null,Ta=null;const qi=e=>String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),Ys=[{label:"🎲 Karışık / Farketmez",id:null},{label:"💥 Aksiyon",movie:28,tv:10759},{label:"🚀 Bilim Kurgu & Fantastik",movie:878,tv:10765},{label:"😂 Komedi",movie:35,tv:35},{label:"🩸 Korku & Gerilim",movie:27,tv:9648},{label:"🎭 Dram",movie:18,tv:18},{label:"🕵️ Suç & Gizem",movie:80,tv:9648},{label:"🎌 Animasyon & Anime",movie:16,tv:16},{label:"💖 Romantik",movie:10749,tv:10749},{label:"🌍 Belgesel",movie:99,tv:99}];function Vs({type:e="all"}={}){fi();const t=document.createElement("div");t.id="random-picker-modal-root",t.className="random-picker-backdrop",document.body.appendChild(t),xi=t;let i=e==="tv"?"tv":"all",n=0,a=7;t.innerHTML=`
    <div class="random-picker-dialog">
      <button class="random-picker-close-btn" id="btn-close-random-picker" title="Kapat">
        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
      </button>

      <!-- Modal Title -->
      <div class="random-picker-top">
        <div class="random-picker-sparkle-icon">
          <i data-lucide="dices" style="width: 28px; height: 28px; color: #f59e0b;"></i>
        </div>
        <h2>${i==="tv"?"Dizi Öneri Sistemi 📺":"Şanslı Çark 🍿"}</h2>
        <p>Popüler yapımlar arasından rastgele bir öneri seçin. Tür ve puan filtrelerini değiştirebilirsiniz.</p>
      </div>

      <!-- Filters Section -->
      <div class="random-picker-filters">
        <!-- Type Selection -->
        <div class="random-filter-row">
          <label>İçerik Türü</label>
          <div class="random-pills-wrap" id="random-type-pills">
            <button class="random-pill-btn ${i==="all"?"active":""}" data-type="all">🎬 Film & Dizi</button>
            <button class="random-pill-btn" data-type="movie">🎥 Sadece Film</button>
            <button class="random-pill-btn ${i==="tv"?"active":""}" data-type="tv">📺 Sadece Dizi</button>
          </div>
        </div>

        <!-- Min IMDb Rating -->
        <div class="random-filter-row">
          <label>Minimum IMDb Puanı</label>
          <div class="random-pills-wrap" id="random-rating-pills">
            <button class="random-pill-btn" data-rating="0">Tümü</button>
            <button class="random-pill-btn active" data-rating="7.0">⭐ 7.0+</button>
            <button class="random-pill-btn" data-rating="7.5">⭐ 7.5+</button>
            <button class="random-pill-btn" data-rating="8.0">🏆 8.0+ (Başyapıt)</button>
          </div>
        </div>

        <!-- Genre Pills -->
        <div class="random-filter-row">
          <label>Favori Tür</label>
          <div class="random-pills-wrap" id="random-genre-pills">
            ${Ys.map((v,b)=>`
              <button class="random-pill-btn ${b===0?"active":""}" data-genre-idx="${b}">${v.label}</button>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Spin / Roulette Stage -->
      <div class="random-spin-stage" id="random-spin-stage">
        <div class="random-idle-placeholder">
          <i data-lucide="sparkles" style="width: 44px; height: 44px; color: #f59e0b;"></i>
          <span>Aşağıdaki butona basarak şansınızı deneyin!</span>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="random-picker-footer">
        <button class="btn-spin-wheel" id="btn-spin-wheel">
          <i data-lucide="shuffle" style="width: 18px; height: 18px;"></i>
          <span>Rastgele Öneriyi Başlat ✨</span>
        </button>
      </div>
    </div>
  `,G(t);const r=t.querySelector("#btn-close-random-picker");r&&(r.onclick=()=>fi()),t.onclick=v=>{v.target===t&&fi()};const o=v=>{v.key==="Escape"&&fi()};window.addEventListener("keydown",o),Ta=()=>window.removeEventListener("keydown",o);const s=t.querySelectorAll("#random-type-pills .random-pill-btn");s.forEach(v=>{v.onclick=()=>{s.forEach(b=>b.classList.remove("active")),v.classList.add("active"),i=v.getAttribute("data-type")}});const l=t.querySelectorAll("#random-rating-pills .random-pill-btn");l.forEach(v=>{v.onclick=()=>{l.forEach(b=>b.classList.remove("active")),v.classList.add("active"),a=parseFloat(v.getAttribute("data-rating")||"0")}});const u=t.querySelectorAll("#random-genre-pills .random-pill-btn");u.forEach(v=>{v.onclick=()=>{u.forEach(b=>b.classList.remove("active")),v.classList.add("active"),n=parseInt(v.getAttribute("data-genre-idx"),10)}});const p=t.querySelector("#btn-spin-wheel"),h=t.querySelector("#random-spin-stage"),g=async()=>{p&&(p.disabled=!0,p.classList.add("is-spinning")),h.innerHTML=`
      <div class="random-roulette-box">
        <div class="roulette-glow-ring"></div>
        <div class="roulette-roller" id="roulette-roller">
          <div class="roulette-reel-text">Adaylar Karıştırılıyor... 🎲</div>
        </div>
      </div>
    `;let v=i;v==="all"&&(v=Math.random()>.5?"movie":"tv");let b=null;const w=Ys[n];w&&(b=v==="movie"?w.movie:w.tv);const k=Math.floor(Math.random()*3)+1;let f;try{f=await ll({type:v,genreId:b,minRating:a,page:k,sortBy:"popularity.desc"})}catch{f=[]}if(xi!==t)return;const y=(f||[]).filter(J=>J&&(J.title||J.name)&&(J.poster_path||J.backdrop_path));if(!y||y.length===0){h.innerHTML=`
        <div class="random-idle-placeholder">
          <i data-lucide="frown" style="width: 40px; height: 40px; color: #ef4444;"></i>
          <span>Bu kriterlere uygun yapım bulunamadı. Lütfen filtreleri gevşetip tekrar deneyin.</span>
        </div>
      `,G(h),p&&(p.disabled=!1,p.classList.remove("is-spinning"));return}const E=h.querySelector("#roulette-roller"),C=8;for(let J=0;J<C;J++){const V=y[Math.floor(Math.random()*y.length)],U=V.title||V.name||"Öneri Aranıyor";if(E&&(E.innerHTML=`<div class="roulette-reel-text animate-pulse">${qi(U)}</div>`),await new Promise(Y=>setTimeout(Y,120+J*25)),xi!==t)return}const x=y[Math.floor(Math.random()*y.length)],A=x.title||x.name||"Seçilen Yapım",R=x.original_title||x.original_name||A,L=st(x.poster_path,Ze.POSTER_MEDIUM),N=x.vote_average?Number(x.vote_average).toFixed(1):"—",z=(x.release_date||x.first_air_date||"").substring(0,4),K=x.overview&&x.overview.trim().length>10?x.overview:"Harika bir izleme deneyimi sunan sürpriz bir öneri!",W=v==="movie"?"movie":"tv";h.innerHTML=`
      <div class="random-winner-card">
        <div class="winner-poster-wrap">
          <img src="${L}" alt="${qi(A)}" class="winner-poster" />
          <div class="winner-rating-pill">⭐ ${N}</div>
        </div>
        <div class="winner-details-wrap">
          <div class="winner-badge-row">
            <span class="winner-tag-type">${W==="movie"?"FİLM":"DİZİ"}</span>
            ${z?`<span class="winner-tag-year">${qi(z)}</span>`:""}
            <span class="winner-tag-match">Popüler öneri</span>
          </div>
          <h3 class="winner-title">${qi(A)}</h3>
          <p class="winner-overview">${qi(K)}</p>
          <div class="winner-actions-row">
            <button class="winner-play-btn" id="btn-winner-play">
              <i data-lucide="play" style="width: 16px; height: 16px; fill: currentColor;"></i>
              <span>Hemen İzle</span>
            </button>
            <button class="winner-detail-btn" id="btn-winner-detail">
              <i data-lucide="info" style="width: 16px; height: 16px;"></i>
              <span>İncele</span>
            </button>
            <button class="winner-retry-btn" id="btn-winner-retry" title="Başka Öner">
              <i data-lucide="refresh-cw" style="width: 16px; height: 16px;"></i>
            </button>
          </div>
        </div>
      </div>
    `,G(h);const O=h.querySelector("#btn-winner-play");O&&(O.onclick=()=>{fi(),Ri({type:W,tmdbId:x.id,title:A,originalTitle:R,posterPath:x.poster_path,backdropPath:x.backdrop_path,season:1,episode:1})});const B=h.querySelector("#btn-winner-detail");B&&(B.onclick=()=>{fi(),window.location.hash=`#detail?type=${W}&id=${x.id}`});const D=h.querySelector("#btn-winner-retry");D&&(D.onclick=()=>{g()}),p&&(p.disabled=!1,p.classList.remove("is-spinning"),p.innerHTML='<i data-lucide="refresh-cw" style="width: 17px; height: 17px;"></i> <span>Başka Bir Tane Öner</span>',G(p))};p&&(p.onclick=()=>g()),g()}function fi(){if(Ta?.(),Ta=null,xi){try{xi.remove()}catch{}xi=null}}let Nn=null;const Jr=[{id:"notif_1",title:"Yeni Bölüm Yayında! ⚔️",message:"Kuruluş Osman 6. Sezon 1. Bölüm Full HD olarak platforma eklendi.",time:"12 dk önce",isUnread:!0,type:"tv",tmdbId:"95557",badge:"YENİ BÖLÜM"},{id:"notif_2",title:"Özel Sinema Gösterimi 🍿",message:"Dune: Çöl Gezegeni Bölüm İki - 4K Ultra HD Türkçe Dublaj & Altyazılı yayında!",time:"2 saat önce",isUnread:!0,type:"movie",tmdbId:"693134",badge:"4K VİZYON"},{id:"notif_3",title:"Yeni Anime Bölümü ⚡",message:"Demon Slayer: Hashira Training Arc - Türkçe Altyazılı yeni bölüm izlenmeye hazır.",time:"Dün",isUnread:!1,type:"tv",tmdbId:"85937",badge:"ANİME"},{id:"notif_4",title:"Canlı TV Güncellemesi 📺",message:"Elektronik Program Rehberi (EPG), PiP Mini-Player ve HLS Kalite Menüsü aktif edildi.",time:"2 gün önce",isUnread:!1,type:"livetv",badge:"GÜNCELLEME"}];function vl(){try{if(typeof window>"u"||!window.localStorage)return Jr;const e=localStorage.getItem("sineflix_notifications_v1");return e?JSON.parse(e):Jr}catch{return Jr}}function Gs(e){try{if(typeof window>"u"||!window.localStorage)return;localStorage.setItem("sineflix_notifications_v1",JSON.stringify(e)),window.dispatchEvent(new CustomEvent("sineflix_notifications_updated"))}catch{}}function bl(){return vl().filter(t=>t.isUnread).length}function Yd(){kn();const e=document.createElement("div");e.id="notification-modal-root",e.className="notif-backdrop",document.body.appendChild(e),Nn=e;const t=vl();e.innerHTML=`
    <div class="notif-dialog">
      <div class="notif-header">
        <div class="notif-title-row">
          <div class="notif-bell-icon">
            <i data-lucide="bell" style="width: 20px; height: 20px; color: #f59e0b;"></i>
          </div>
          <div>
            <h3>Bildirimler & Alarmlar</h3>
            <span class="notif-subtext">Yeni bölüm ve yayın bildirimleri</span>
          </div>
        </div>
        <button class="notif-close-btn" id="btn-close-notif" title="Kapat">
          <i data-lucide="x" style="width: 18px; height: 18px;"></i>
        </button>
      </div>

      <div class="notif-actions-bar">
        <button class="notif-mark-read-btn" id="btn-mark-all-read">
          <i data-lucide="check-check" style="width: 14px; height: 14px;"></i>
          <span>Tümünü Okundu İşaretle</span>
        </button>
      </div>

      <div class="notif-list">
        ${t.map(a=>`
          <div class="notif-item ${a.isUnread?"unread":""}" data-notif-id="${a.id}" data-type="${a.type||""}" data-tmdb-id="${a.tmdbId||""}">
            <div class="notif-item-left">
              <span class="notif-tag">${a.badge||"HABER"}</span>
              <span class="notif-time">${a.time}</span>
            </div>
            <h4 class="notif-item-title">${a.title}</h4>
            <p class="notif-item-msg">${a.message}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `,G(e);const i=e.querySelector("#btn-close-notif");i&&(i.onclick=()=>kn()),e.onclick=a=>{a.target===e&&kn()};const n=e.querySelector("#btn-mark-all-read");n&&(n.onclick=()=>{const a=t.map(r=>({...r,isUnread:!1}));Gs(a),e.querySelectorAll(".notif-item.unread").forEach(r=>r.classList.remove("unread")),ee("Tüm bildirimler okundu olarak işaretlendi","info"),Js()}),e.querySelectorAll(".notif-item").forEach(a=>{a.onclick=()=>{const r=a.getAttribute("data-notif-id"),o=a.getAttribute("data-type"),s=a.getAttribute("data-tmdb-id"),l=t.map(u=>u.id===r?{...u,isUnread:!1}:u);Gs(l),a.classList.remove("unread"),Js(),kn(),o==="livetv"?window.location.hash="#livetv":s&&(window.location.hash=`#detail?type=${o}&id=${s}`)}})}function kn(){if(Nn){try{Nn.remove()}catch{}Nn=null}}function Js(){const e=document.getElementById("nav-notif-badge");if(!e)return;const t=bl();t>0?(e.textContent=t,e.classList.remove("hidden")):e.classList.add("hidden")}function wl(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function Vd(e){if(e.__esModule)return e;var t=e.default;if(typeof t=="function"){var i=function n(){return this instanceof n?Reflect.construct(t,arguments,this.constructor):t.apply(this,arguments)};i.prototype=t.prototype}else i={};return Object.defineProperty(i,"__esModule",{value:!0}),Object.keys(e).forEach(function(n){var a=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(i,n,a.get?a:{enumerable:!0,get:function(){return e[n]}})}),i}var Aa={exports:{}},Xr,Xs;function Gd(){if(Xs)return Xr;Xs=1;var e=1e3,t=e*60,i=t*60,n=i*24,a=n*7,r=n*365.25;Xr=function(p,h){h=h||{};var g=typeof p;if(g==="string"&&p.length>0)return o(p);if(g==="number"&&isFinite(p))return h.long?l(p):s(p);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(p))};function o(p){if(p=String(p),!(p.length>100)){var h=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(p);if(h){var g=parseFloat(h[1]),v=(h[2]||"ms").toLowerCase();switch(v){case"years":case"year":case"yrs":case"yr":case"y":return g*r;case"weeks":case"week":case"w":return g*a;case"days":case"day":case"d":return g*n;case"hours":case"hour":case"hrs":case"hr":case"h":return g*i;case"minutes":case"minute":case"mins":case"min":case"m":return g*t;case"seconds":case"second":case"secs":case"sec":case"s":return g*e;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return g;default:return}}}}function s(p){var h=Math.abs(p);return h>=n?Math.round(p/n)+"d":h>=i?Math.round(p/i)+"h":h>=t?Math.round(p/t)+"m":h>=e?Math.round(p/e)+"s":p+"ms"}function l(p){var h=Math.abs(p);return h>=n?u(p,h,n,"day"):h>=i?u(p,h,i,"hour"):h>=t?u(p,h,t,"minute"):h>=e?u(p,h,e,"second"):p+" ms"}function u(p,h,g,v){var b=h>=g*1.5;return Math.round(p/g)+" "+v+(b?"s":"")}return Xr}function Jd(e){i.debug=i,i.default=i,i.coerce=l,i.disable=o,i.enable=a,i.enabled=s,i.humanize=Gd(),i.destroy=u,Object.keys(e).forEach(p=>{i[p]=e[p]}),i.names=[],i.skips=[],i.formatters={};function t(p){let h=0;for(let g=0;g<p.length;g++)h=(h<<5)-h+p.charCodeAt(g),h|=0;return i.colors[Math.abs(h)%i.colors.length]}i.selectColor=t;function i(p){let h,g=null,v,b;function w(...k){if(!w.enabled)return;const f=w,y=Number(new Date),E=y-(h||y);f.diff=E,f.prev=h,f.curr=y,h=y,k[0]=i.coerce(k[0]),typeof k[0]!="string"&&k.unshift("%O");let C=0;k[0]=k[0].replace(/%([a-zA-Z%])/g,(A,R)=>{if(A==="%%")return"%";C++;const L=i.formatters[R];if(typeof L=="function"){const N=k[C];A=L.call(f,N),k.splice(C,1),C--}return A}),i.formatArgs.call(f,k),(f.log||i.log).apply(f,k)}return w.namespace=p,w.useColors=i.useColors(),w.color=i.selectColor(p),w.extend=n,w.destroy=i.destroy,Object.defineProperty(w,"enabled",{enumerable:!0,configurable:!1,get:()=>g!==null?g:(v!==i.namespaces&&(v=i.namespaces,b=i.enabled(p)),b),set:k=>{g=k}}),typeof i.init=="function"&&i.init(w),w}function n(p,h){const g=i(this.namespace+(typeof h>"u"?":":h)+p);return g.log=this.log,g}function a(p){i.save(p),i.namespaces=p,i.names=[],i.skips=[];const h=(typeof p=="string"?p:"").trim().replace(/\s+/g,",").split(",").filter(Boolean);for(const g of h)g[0]==="-"?i.skips.push(g.slice(1)):i.names.push(g)}function r(p,h){let g=0,v=0,b=-1,w=0;for(;g<p.length;)if(v<h.length&&(h[v]===p[g]||h[v]==="*"))h[v]==="*"?(b=v,w=g,v++):(g++,v++);else if(b!==-1)v=b+1,w++,g=w;else return!1;for(;v<h.length&&h[v]==="*";)v++;return v===h.length}function o(){const p=[...i.names,...i.skips.map(h=>"-"+h)].join(",");return i.enable(""),p}function s(p){for(const h of i.skips)if(r(p,h))return!1;for(const h of i.names)if(r(p,h))return!0;return!1}function l(p){return p instanceof Error?p.stack||p.message:p}function u(){}return i.enable(i.load()),i}var Xd=Jd;(function(e,t){var i={};t.formatArgs=a,t.save=r,t.load=o,t.useColors=n,t.storage=s(),t.destroy=(()=>{let u=!1;return()=>{u||(u=!0)}})(),t.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"];function n(){if(typeof window<"u"&&window.process&&(window.process.type==="renderer"||window.process.__nwjs))return!0;if(typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;let u;return typeof document<"u"&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent&&(u=navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/))&&parseInt(u[1],10)>=31||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)}function a(u){if(u[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+u[0]+(this.useColors?"%c ":" ")+"+"+e.exports.humanize(this.diff),!this.useColors)return;const p="color: "+this.color;u.splice(1,0,p,"color: inherit");let h=0,g=0;u[0].replace(/%[a-zA-Z%]/g,v=>{v!=="%%"&&(h++,v==="%c"&&(g=h))}),u.splice(g,0,p)}t.log=console.debug||console.log||(()=>{});function r(u){try{u?t.storage.setItem("debug",u):t.storage.removeItem("debug")}catch{}}function o(){let u;try{u=t.storage.getItem("debug")||t.storage.getItem("DEBUG")}catch{}return!u&&typeof process<"u"&&"env"in process&&(u=i.DEBUG),u}function s(){try{return localStorage}catch{}}e.exports=Xd(t);const{formatters:l}=e.exports;l.j=function(u){try{return JSON.stringify(u)}catch(p){return"[UnexpectedJSONParseError]: "+p.message}}})(Aa,Aa.exports);var kr=Aa.exports,es={exports:{}},Ei=typeof Reflect=="object"?Reflect:null,Zs=Ei&&typeof Ei.apply=="function"?Ei.apply:function(t,i,n){return Function.prototype.apply.call(t,i,n)},On;Ei&&typeof Ei.ownKeys=="function"?On=Ei.ownKeys:Object.getOwnPropertySymbols?On=function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:On=function(t){return Object.getOwnPropertyNames(t)};var kl=Number.isNaN||function(t){return t!==t};function Ce(){Ce.init.call(this)}es.exports=Ce;es.exports.once=tu;Ce.EventEmitter=Ce;Ce.prototype._events=void 0;Ce.prototype._eventsCount=0;Ce.prototype._maxListeners=void 0;var Qs=10;function _r(e){if(typeof e!="function")throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e)}Object.defineProperty(Ce,"defaultMaxListeners",{enumerable:!0,get:function(){return Qs},set:function(e){if(typeof e!="number"||e<0||kl(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");Qs=e}});Ce.init=function(){(this._events===void 0||this._events===Object.getPrototypeOf(this)._events)&&(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0};Ce.prototype.setMaxListeners=function(t){if(typeof t!="number"||t<0||kl(t))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+t+".");return this._maxListeners=t,this};function _l(e){return e._maxListeners===void 0?Ce.defaultMaxListeners:e._maxListeners}Ce.prototype.getMaxListeners=function(){return _l(this)};Ce.prototype.emit=function(t){for(var i=[],n=1;n<arguments.length;n++)i.push(arguments[n]);var a=t==="error",r=this._events;if(r!==void 0)a=a&&r.error===void 0;else if(!a)return!1;if(a){var o;if(i.length>0&&(o=i[0]),o instanceof Error)throw o;var s=new Error("Unhandled error."+(o?" ("+o.message+")":""));throw s.context=o,s}var l=r[t];if(l===void 0)return!1;if(typeof l=="function")Zs(l,this,i);else for(var u=l.length,p=Al(l,u),n=0;n<u;++n)Zs(p[n],this,i);return!0};function Sl(e,t,i,n){var a,r,o;if(_r(i),r=e._events,r===void 0?(r=e._events=Object.create(null),e._eventsCount=0):(r.newListener!==void 0&&(e.emit("newListener",t,i.listener?i.listener:i),r=e._events),o=r[t]),o===void 0)o=r[t]=i,++e._eventsCount;else if(typeof o=="function"?o=r[t]=n?[i,o]:[o,i]:n?o.unshift(i):o.push(i),a=_l(e),a>0&&o.length>a&&!o.warned){o.warned=!0;var s=new Error("Possible EventEmitter memory leak detected. "+o.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");s.name="MaxListenersExceededWarning",s.emitter=e,s.type=t,s.count=o.length}return e}Ce.prototype.addListener=function(t,i){return Sl(this,t,i,!1)};Ce.prototype.on=Ce.prototype.addListener;Ce.prototype.prependListener=function(t,i){return Sl(this,t,i,!0)};function Zd(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length===0?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function xl(e,t,i){var n={fired:!1,wrapFn:void 0,target:e,type:t,listener:i},a=Zd.bind(n);return a.listener=i,n.wrapFn=a,a}Ce.prototype.once=function(t,i){return _r(i),this.on(t,xl(this,t,i)),this};Ce.prototype.prependOnceListener=function(t,i){return _r(i),this.prependListener(t,xl(this,t,i)),this};Ce.prototype.removeListener=function(t,i){var n,a,r,o,s;if(_r(i),a=this._events,a===void 0)return this;if(n=a[t],n===void 0)return this;if(n===i||n.listener===i)--this._eventsCount===0?this._events=Object.create(null):(delete a[t],a.removeListener&&this.emit("removeListener",t,n.listener||i));else if(typeof n!="function"){for(r=-1,o=n.length-1;o>=0;o--)if(n[o]===i||n[o].listener===i){s=n[o].listener,r=o;break}if(r<0)return this;r===0?n.shift():Qd(n,r),n.length===1&&(a[t]=n[0]),a.removeListener!==void 0&&this.emit("removeListener",t,s||i)}return this};Ce.prototype.off=Ce.prototype.removeListener;Ce.prototype.removeAllListeners=function(t){var i,n,a;if(n=this._events,n===void 0)return this;if(n.removeListener===void 0)return arguments.length===0?(this._events=Object.create(null),this._eventsCount=0):n[t]!==void 0&&(--this._eventsCount===0?this._events=Object.create(null):delete n[t]),this;if(arguments.length===0){var r=Object.keys(n),o;for(a=0;a<r.length;++a)o=r[a],o!=="removeListener"&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if(i=n[t],typeof i=="function")this.removeListener(t,i);else if(i!==void 0)for(a=i.length-1;a>=0;a--)this.removeListener(t,i[a]);return this};function El(e,t,i){var n=e._events;if(n===void 0)return[];var a=n[t];return a===void 0?[]:typeof a=="function"?i?[a.listener||a]:[a]:i?eu(a):Al(a,a.length)}Ce.prototype.listeners=function(t){return El(this,t,!0)};Ce.prototype.rawListeners=function(t){return El(this,t,!1)};Ce.listenerCount=function(e,t){return typeof e.listenerCount=="function"?e.listenerCount(t):Tl.call(e,t)};Ce.prototype.listenerCount=Tl;function Tl(e){var t=this._events;if(t!==void 0){var i=t[e];if(typeof i=="function")return 1;if(i!==void 0)return i.length}return 0}Ce.prototype.eventNames=function(){return this._eventsCount>0?On(this._events):[]};function Al(e,t){for(var i=new Array(t),n=0;n<t;++n)i[n]=e[n];return i}function Qd(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}function eu(e){for(var t=new Array(e.length),i=0;i<t.length;++i)t[i]=e[i].listener||e[i];return t}function tu(e,t){return new Promise(function(i,n){function a(o){e.removeListener(t,r),n(o)}function r(){typeof e.removeListener=="function"&&e.removeListener("error",a),i([].slice.call(arguments))}Cl(e,t,r,{once:!0}),t!=="error"&&iu(e,a,{once:!0})})}function iu(e,t,i){typeof e.on=="function"&&Cl(e,"error",t,i)}function Cl(e,t,i,n){if(typeof e.on=="function")n.once?e.once(t,i):e.on(t,i);else if(typeof e.addEventListener=="function")e.addEventListener(t,function a(r){n.once&&e.removeEventListener(t,a),i(r)});else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof e)}var Sr=es.exports,ts={exports:{}},nu=Ll;function Ll(e,t){if(e&&t)return Ll(e)(t);if(typeof e!="function")throw new TypeError("need wrapper function");return Object.keys(e).forEach(function(n){i[n]=e[n]}),i;function i(){for(var n=new Array(arguments.length),a=0;a<n.length;a++)n[a]=arguments[a];var r=e.apply(this,n),o=n[n.length-1];return typeof r=="function"&&r!==o&&Object.keys(o).forEach(function(s){r[s]=o[s]}),r}}var Il=nu;ts.exports=Il(zn);ts.exports.strict=Il(Rl);zn.proto=zn(function(){Object.defineProperty(Function.prototype,"once",{value:function(){return zn(this)},configurable:!0}),Object.defineProperty(Function.prototype,"onceStrict",{value:function(){return Rl(this)},configurable:!0})});function zn(e){var t=function(){return t.called?t.value:(t.called=!0,t.value=e.apply(this,arguments))};return t.called=!1,t}function Rl(e){var t=function(){if(t.called)throw new Error(t.onceError);return t.called=!0,t.value=e.apply(this,arguments)},i=e.name||"Function wrapped with `once`";return t.onceError=i+" shouldn't be called more than once",t.called=!1,t}var ru=ts.exports;let eo;var xr=typeof queueMicrotask=="function"?queueMicrotask.bind(typeof window<"u"?window:globalThis):e=>(eo||(eo=Promise.resolve())).then(e).catch(t=>setTimeout(()=>{throw t},0));var au=ou;const su=xr;function ou(e,t){let i,n,a,r=!0;Array.isArray(e)?(i=[],n=e.length):(a=Object.keys(e),i={},n=a.length);function o(l){function u(){t&&t(l,i),t=null}r?su(u):u()}function s(l,u,p){i[l]=p,(--n===0||u)&&o(u)}n?a?a.forEach(function(l){e[l](function(u,p){s(l,u,p)})}):e.forEach(function(l,u){l(function(p,h){s(u,p,h)})}):o(null),r=!1}var lu=function(){if(typeof globalThis>"u")return null;var t={RTCPeerConnection:globalThis.RTCPeerConnection||globalThis.mozRTCPeerConnection||globalThis.webkitRTCPeerConnection,RTCSessionDescription:globalThis.RTCSessionDescription||globalThis.mozRTCSessionDescription||globalThis.webkitRTCSessionDescription,RTCIceCandidate:globalThis.RTCIceCandidate||globalThis.mozRTCIceCandidate||globalThis.webkitRTCIceCandidate};return t.RTCPeerConnection?t:null},Ca={exports:{}},La={exports:{}},ui={},Er={};Er.byteLength=uu;Er.toByteArray=hu;Er.fromByteArray=gu;var At=[],dt=[],cu=typeof Uint8Array<"u"?Uint8Array:Array,Zr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(var mi=0,du=Zr.length;mi<du;++mi)At[mi]=Zr[mi],dt[Zr.charCodeAt(mi)]=mi;dt[45]=62;dt[95]=63;function $l(e){var t=e.length;if(t%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var i=e.indexOf("=");i===-1&&(i=t);var n=i===t?0:4-i%4;return[i,n]}function uu(e){var t=$l(e),i=t[0],n=t[1];return(i+n)*3/4-n}function pu(e,t,i){return(t+i)*3/4-i}function hu(e){var t,i=$l(e),n=i[0],a=i[1],r=new cu(pu(e,n,a)),o=0,s=a>0?n-4:n,l;for(l=0;l<s;l+=4)t=dt[e.charCodeAt(l)]<<18|dt[e.charCodeAt(l+1)]<<12|dt[e.charCodeAt(l+2)]<<6|dt[e.charCodeAt(l+3)],r[o++]=t>>16&255,r[o++]=t>>8&255,r[o++]=t&255;return a===2&&(t=dt[e.charCodeAt(l)]<<2|dt[e.charCodeAt(l+1)]>>4,r[o++]=t&255),a===1&&(t=dt[e.charCodeAt(l)]<<10|dt[e.charCodeAt(l+1)]<<4|dt[e.charCodeAt(l+2)]>>2,r[o++]=t>>8&255,r[o++]=t&255),r}function fu(e){return At[e>>18&63]+At[e>>12&63]+At[e>>6&63]+At[e&63]}function mu(e,t,i){for(var n,a=[],r=t;r<i;r+=3)n=(e[r]<<16&16711680)+(e[r+1]<<8&65280)+(e[r+2]&255),a.push(fu(n));return a.join("")}function gu(e){for(var t,i=e.length,n=i%3,a=[],r=16383,o=0,s=i-n;o<s;o+=r)a.push(mu(e,o,o+r>s?s:o+r));return n===1?(t=e[i-1],a.push(At[t>>2]+At[t<<4&63]+"==")):n===2&&(t=(e[i-2]<<8)+e[i-1],a.push(At[t>>10]+At[t>>4&63]+At[t<<2&63]+"=")),a.join("")}var is={};is.read=function(e,t,i,n,a){var r,o,s=a*8-n-1,l=(1<<s)-1,u=l>>1,p=-7,h=i?a-1:0,g=i?-1:1,v=e[t+h];for(h+=g,r=v&(1<<-p)-1,v>>=-p,p+=s;p>0;r=r*256+e[t+h],h+=g,p-=8);for(o=r&(1<<-p)-1,r>>=-p,p+=n;p>0;o=o*256+e[t+h],h+=g,p-=8);if(r===0)r=1-u;else{if(r===l)return o?NaN:(v?-1:1)*(1/0);o=o+Math.pow(2,n),r=r-u}return(v?-1:1)*o*Math.pow(2,r-n)};is.write=function(e,t,i,n,a,r){var o,s,l,u=r*8-a-1,p=(1<<u)-1,h=p>>1,g=a===23?Math.pow(2,-24)-Math.pow(2,-77):0,v=n?0:r-1,b=n?1:-1,w=t<0||t===0&&1/t<0?1:0;for(t=Math.abs(t),isNaN(t)||t===1/0?(s=isNaN(t)?1:0,o=p):(o=Math.floor(Math.log(t)/Math.LN2),t*(l=Math.pow(2,-o))<1&&(o--,l*=2),o+h>=1?t+=g/l:t+=g*Math.pow(2,1-h),t*l>=2&&(o++,l/=2),o+h>=p?(s=0,o=p):o+h>=1?(s=(t*l-1)*Math.pow(2,a),o=o+h):(s=t*Math.pow(2,h-1)*Math.pow(2,a),o=0));a>=8;e[i+v]=s&255,v+=b,s/=256,a-=8);for(o=o<<a|s,u+=a;u>0;e[i+v]=o&255,v+=b,o/=256,u-=8);e[i+v-b]|=w*128};(function(e){const t=Er,i=is,n=typeof Symbol=="function"&&typeof Symbol.for=="function"?Symbol.for("nodejs.util.inspect.custom"):null;e.Buffer=s,e.SlowBuffer=y,e.INSPECT_MAX_BYTES=50;const a=2147483647;e.kMaxLength=a,s.TYPED_ARRAY_SUPPORT=r(),!s.TYPED_ARRAY_SUPPORT&&typeof console<"u";function r(){try{const m=new Uint8Array(1),c={foo:function(){return 42}};return Object.setPrototypeOf(c,Uint8Array.prototype),Object.setPrototypeOf(m,c),m.foo()===42}catch{return!1}}Object.defineProperty(s.prototype,"parent",{enumerable:!0,get:function(){if(s.isBuffer(this))return this.buffer}}),Object.defineProperty(s.prototype,"offset",{enumerable:!0,get:function(){if(s.isBuffer(this))return this.byteOffset}});function o(m){if(m>a)throw new RangeError('The value "'+m+'" is invalid for option "size"');const c=new Uint8Array(m);return Object.setPrototypeOf(c,s.prototype),c}function s(m,c,d){if(typeof m=="number"){if(typeof c=="string")throw new TypeError('The "string" argument must be of type string. Received type number');return h(m)}return l(m,c,d)}s.poolSize=8192;function l(m,c,d){if(typeof m=="string")return g(m,c);if(ArrayBuffer.isView(m))return b(m);if(m==null)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof m);if(De(m,ArrayBuffer)||m&&De(m.buffer,ArrayBuffer)||typeof SharedArrayBuffer<"u"&&(De(m,SharedArrayBuffer)||m&&De(m.buffer,SharedArrayBuffer)))return w(m,c,d);if(typeof m=="number")throw new TypeError('The "value" argument must not be of type number. Received type number');const _=m.valueOf&&m.valueOf();if(_!=null&&_!==m)return s.from(_,c,d);const I=k(m);if(I)return I;if(typeof Symbol<"u"&&Symbol.toPrimitive!=null&&typeof m[Symbol.toPrimitive]=="function")return s.from(m[Symbol.toPrimitive]("string"),c,d);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof m)}s.from=function(m,c,d){return l(m,c,d)},Object.setPrototypeOf(s.prototype,Uint8Array.prototype),Object.setPrototypeOf(s,Uint8Array);function u(m){if(typeof m!="number")throw new TypeError('"size" argument must be of type number');if(m<0)throw new RangeError('The value "'+m+'" is invalid for option "size"')}function p(m,c,d){return u(m),m<=0?o(m):c!==void 0?typeof d=="string"?o(m).fill(c,d):o(m).fill(c):o(m)}s.alloc=function(m,c,d){return p(m,c,d)};function h(m){return u(m),o(m<0?0:f(m)|0)}s.allocUnsafe=function(m){return h(m)},s.allocUnsafeSlow=function(m){return h(m)};function g(m,c){if((typeof c!="string"||c==="")&&(c="utf8"),!s.isEncoding(c))throw new TypeError("Unknown encoding: "+c);const d=E(m,c)|0;let _=o(d);const I=_.write(m,c);return I!==d&&(_=_.slice(0,I)),_}function v(m){const c=m.length<0?0:f(m.length)|0,d=o(c);for(let _=0;_<c;_+=1)d[_]=m[_]&255;return d}function b(m){if(De(m,Uint8Array)){const c=new Uint8Array(m);return w(c.buffer,c.byteOffset,c.byteLength)}return v(m)}function w(m,c,d){if(c<0||m.byteLength<c)throw new RangeError('"offset" is outside of buffer bounds');if(m.byteLength<c+(d||0))throw new RangeError('"length" is outside of buffer bounds');let _;return c===void 0&&d===void 0?_=new Uint8Array(m):d===void 0?_=new Uint8Array(m,c):_=new Uint8Array(m,c,d),Object.setPrototypeOf(_,s.prototype),_}function k(m){if(s.isBuffer(m)){const c=f(m.length)|0,d=o(c);return d.length===0||m.copy(d,0,0,c),d}if(m.length!==void 0)return typeof m.length!="number"||ze(m.length)?o(0):v(m);if(m.type==="Buffer"&&Array.isArray(m.data))return v(m.data)}function f(m){if(m>=a)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+a.toString(16)+" bytes");return m|0}function y(m){return+m!=m&&(m=0),s.alloc(+m)}s.isBuffer=function(c){return c!=null&&c._isBuffer===!0&&c!==s.prototype},s.compare=function(c,d){if(De(c,Uint8Array)&&(c=s.from(c,c.offset,c.byteLength)),De(d,Uint8Array)&&(d=s.from(d,d.offset,d.byteLength)),!s.isBuffer(c)||!s.isBuffer(d))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(c===d)return 0;let _=c.length,I=d.length;for(let $=0,H=Math.min(_,I);$<H;++$)if(c[$]!==d[$]){_=c[$],I=d[$];break}return _<I?-1:I<_?1:0},s.isEncoding=function(c){switch(String(c).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},s.concat=function(c,d){if(!Array.isArray(c))throw new TypeError('"list" argument must be an Array of Buffers');if(c.length===0)return s.alloc(0);let _;if(d===void 0)for(d=0,_=0;_<c.length;++_)d+=c[_].length;const I=s.allocUnsafe(d);let $=0;for(_=0;_<c.length;++_){let H=c[_];if(De(H,Uint8Array))$+H.length>I.length?(s.isBuffer(H)||(H=s.from(H)),H.copy(I,$)):Uint8Array.prototype.set.call(I,H,$);else if(s.isBuffer(H))H.copy(I,$);else throw new TypeError('"list" argument must be an Array of Buffers');$+=H.length}return I};function E(m,c){if(s.isBuffer(m))return m.length;if(ArrayBuffer.isView(m)||De(m,ArrayBuffer))return m.byteLength;if(typeof m!="string")throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof m);const d=m.length,_=arguments.length>2&&arguments[2]===!0;if(!_&&d===0)return 0;let I=!1;for(;;)switch(c){case"ascii":case"latin1":case"binary":return d;case"utf8":case"utf-8":return pe(m).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return d*2;case"hex":return d>>>1;case"base64":return Ue(m).length;default:if(I)return _?-1:pe(m).length;c=(""+c).toLowerCase(),I=!0}}s.byteLength=E;function C(m,c,d){let _=!1;if((c===void 0||c<0)&&(c=0),c>this.length||((d===void 0||d>this.length)&&(d=this.length),d<=0)||(d>>>=0,c>>>=0,d<=c))return"";for(m||(m="utf8");;)switch(m){case"hex":return Y(this,c,d);case"utf8":case"utf-8":return B(this,c,d);case"ascii":return V(this,c,d);case"latin1":case"binary":return U(this,c,d);case"base64":return O(this,c,d);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return ne(this,c,d);default:if(_)throw new TypeError("Unknown encoding: "+m);m=(m+"").toLowerCase(),_=!0}}s.prototype._isBuffer=!0;function x(m,c,d){const _=m[c];m[c]=m[d],m[d]=_}s.prototype.swap16=function(){const c=this.length;if(c%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let d=0;d<c;d+=2)x(this,d,d+1);return this},s.prototype.swap32=function(){const c=this.length;if(c%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let d=0;d<c;d+=4)x(this,d,d+3),x(this,d+1,d+2);return this},s.prototype.swap64=function(){const c=this.length;if(c%8!==0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let d=0;d<c;d+=8)x(this,d,d+7),x(this,d+1,d+6),x(this,d+2,d+5),x(this,d+3,d+4);return this},s.prototype.toString=function(){const c=this.length;return c===0?"":arguments.length===0?B(this,0,c):C.apply(this,arguments)},s.prototype.toLocaleString=s.prototype.toString,s.prototype.equals=function(c){if(!s.isBuffer(c))throw new TypeError("Argument must be a Buffer");return this===c?!0:s.compare(this,c)===0},s.prototype.inspect=function(){let c="";const d=e.INSPECT_MAX_BYTES;return c=this.toString("hex",0,d).replace(/(.{2})/g,"$1 ").trim(),this.length>d&&(c+=" ... "),"<Buffer "+c+">"},n&&(s.prototype[n]=s.prototype.inspect),s.prototype.compare=function(c,d,_,I,$){if(De(c,Uint8Array)&&(c=s.from(c,c.offset,c.byteLength)),!s.isBuffer(c))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof c);if(d===void 0&&(d=0),_===void 0&&(_=c?c.length:0),I===void 0&&(I=0),$===void 0&&($=this.length),d<0||_>c.length||I<0||$>this.length)throw new RangeError("out of range index");if(I>=$&&d>=_)return 0;if(I>=$)return-1;if(d>=_)return 1;if(d>>>=0,_>>>=0,I>>>=0,$>>>=0,this===c)return 0;let H=$-I,ue=_-d;const Le=Math.min(H,ue),Se=this.slice(I,$),me=c.slice(d,_);for(let xe=0;xe<Le;++xe)if(Se[xe]!==me[xe]){H=Se[xe],ue=me[xe];break}return H<ue?-1:ue<H?1:0};function A(m,c,d,_,I){if(m.length===0)return-1;if(typeof d=="string"?(_=d,d=0):d>2147483647?d=2147483647:d<-2147483648&&(d=-2147483648),d=+d,ze(d)&&(d=I?0:m.length-1),d<0&&(d=m.length+d),d>=m.length){if(I)return-1;d=m.length-1}else if(d<0)if(I)d=0;else return-1;if(typeof c=="string"&&(c=s.from(c,_)),s.isBuffer(c))return c.length===0?-1:R(m,c,d,_,I);if(typeof c=="number")return c=c&255,typeof Uint8Array.prototype.indexOf=="function"?I?Uint8Array.prototype.indexOf.call(m,c,d):Uint8Array.prototype.lastIndexOf.call(m,c,d):R(m,[c],d,_,I);throw new TypeError("val must be string, number or Buffer")}function R(m,c,d,_,I){let $=1,H=m.length,ue=c.length;if(_!==void 0&&(_=String(_).toLowerCase(),_==="ucs2"||_==="ucs-2"||_==="utf16le"||_==="utf-16le")){if(m.length<2||c.length<2)return-1;$=2,H/=2,ue/=2,d/=2}function Le(me,xe){return $===1?me[xe]:me.readUInt16BE(xe*$)}let Se;if(I){let me=-1;for(Se=d;Se<H;Se++)if(Le(m,Se)===Le(c,me===-1?0:Se-me)){if(me===-1&&(me=Se),Se-me+1===ue)return me*$}else me!==-1&&(Se-=Se-me),me=-1}else for(d+ue>H&&(d=H-ue),Se=d;Se>=0;Se--){let me=!0;for(let xe=0;xe<ue;xe++)if(Le(m,Se+xe)!==Le(c,xe)){me=!1;break}if(me)return Se}return-1}s.prototype.includes=function(c,d,_){return this.indexOf(c,d,_)!==-1},s.prototype.indexOf=function(c,d,_){return A(this,c,d,_,!0)},s.prototype.lastIndexOf=function(c,d,_){return A(this,c,d,_,!1)};function L(m,c,d,_){d=Number(d)||0;const I=m.length-d;_?(_=Number(_),_>I&&(_=I)):_=I;const $=c.length;_>$/2&&(_=$/2);let H;for(H=0;H<_;++H){const ue=parseInt(c.substr(H*2,2),16);if(ze(ue))return H;m[d+H]=ue}return H}function N(m,c,d,_){return Ie(pe(c,m.length-d),m,d,_)}function z(m,c,d,_){return Ie(Ge(c),m,d,_)}function K(m,c,d,_){return Ie(Ue(c),m,d,_)}function W(m,c,d,_){return Ie(Je(c,m.length-d),m,d,_)}s.prototype.write=function(c,d,_,I){if(d===void 0)I="utf8",_=this.length,d=0;else if(_===void 0&&typeof d=="string")I=d,_=this.length,d=0;else if(isFinite(d))d=d>>>0,isFinite(_)?(_=_>>>0,I===void 0&&(I="utf8")):(I=_,_=void 0);else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");const $=this.length-d;if((_===void 0||_>$)&&(_=$),c.length>0&&(_<0||d<0)||d>this.length)throw new RangeError("Attempt to write outside buffer bounds");I||(I="utf8");let H=!1;for(;;)switch(I){case"hex":return L(this,c,d,_);case"utf8":case"utf-8":return N(this,c,d,_);case"ascii":case"latin1":case"binary":return z(this,c,d,_);case"base64":return K(this,c,d,_);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return W(this,c,d,_);default:if(H)throw new TypeError("Unknown encoding: "+I);I=(""+I).toLowerCase(),H=!0}},s.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function O(m,c,d){return c===0&&d===m.length?t.fromByteArray(m):t.fromByteArray(m.slice(c,d))}function B(m,c,d){d=Math.min(m.length,d);const _=[];let I=c;for(;I<d;){const $=m[I];let H=null,ue=$>239?4:$>223?3:$>191?2:1;if(I+ue<=d){let Le,Se,me,xe;switch(ue){case 1:$<128&&(H=$);break;case 2:Le=m[I+1],(Le&192)===128&&(xe=($&31)<<6|Le&63,xe>127&&(H=xe));break;case 3:Le=m[I+1],Se=m[I+2],(Le&192)===128&&(Se&192)===128&&(xe=($&15)<<12|(Le&63)<<6|Se&63,xe>2047&&(xe<55296||xe>57343)&&(H=xe));break;case 4:Le=m[I+1],Se=m[I+2],me=m[I+3],(Le&192)===128&&(Se&192)===128&&(me&192)===128&&(xe=($&15)<<18|(Le&63)<<12|(Se&63)<<6|me&63,xe>65535&&xe<1114112&&(H=xe))}}H===null?(H=65533,ue=1):H>65535&&(H-=65536,_.push(H>>>10&1023|55296),H=56320|H&1023),_.push(H),I+=ue}return J(_)}const D=4096;function J(m){const c=m.length;if(c<=D)return String.fromCharCode.apply(String,m);let d="",_=0;for(;_<c;)d+=String.fromCharCode.apply(String,m.slice(_,_+=D));return d}function V(m,c,d){let _="";d=Math.min(m.length,d);for(let I=c;I<d;++I)_+=String.fromCharCode(m[I]&127);return _}function U(m,c,d){let _="";d=Math.min(m.length,d);for(let I=c;I<d;++I)_+=String.fromCharCode(m[I]);return _}function Y(m,c,d){const _=m.length;(!c||c<0)&&(c=0),(!d||d<0||d>_)&&(d=_);let I="";for(let $=c;$<d;++$)I+=We[m[$]];return I}function ne(m,c,d){const _=m.slice(c,d);let I="";for(let $=0;$<_.length-1;$+=2)I+=String.fromCharCode(_[$]+_[$+1]*256);return I}s.prototype.slice=function(c,d){const _=this.length;c=~~c,d=d===void 0?_:~~d,c<0?(c+=_,c<0&&(c=0)):c>_&&(c=_),d<0?(d+=_,d<0&&(d=0)):d>_&&(d=_),d<c&&(d=c);const I=this.subarray(c,d);return Object.setPrototypeOf(I,s.prototype),I};function re(m,c,d){if(m%1!==0||m<0)throw new RangeError("offset is not uint");if(m+c>d)throw new RangeError("Trying to access beyond buffer length")}s.prototype.readUintLE=s.prototype.readUIntLE=function(c,d,_){c=c>>>0,d=d>>>0,_||re(c,d,this.length);let I=this[c],$=1,H=0;for(;++H<d&&($*=256);)I+=this[c+H]*$;return I},s.prototype.readUintBE=s.prototype.readUIntBE=function(c,d,_){c=c>>>0,d=d>>>0,_||re(c,d,this.length);let I=this[c+--d],$=1;for(;d>0&&($*=256);)I+=this[c+--d]*$;return I},s.prototype.readUint8=s.prototype.readUInt8=function(c,d){return c=c>>>0,d||re(c,1,this.length),this[c]},s.prototype.readUint16LE=s.prototype.readUInt16LE=function(c,d){return c=c>>>0,d||re(c,2,this.length),this[c]|this[c+1]<<8},s.prototype.readUint16BE=s.prototype.readUInt16BE=function(c,d){return c=c>>>0,d||re(c,2,this.length),this[c]<<8|this[c+1]},s.prototype.readUint32LE=s.prototype.readUInt32LE=function(c,d){return c=c>>>0,d||re(c,4,this.length),(this[c]|this[c+1]<<8|this[c+2]<<16)+this[c+3]*16777216},s.prototype.readUint32BE=s.prototype.readUInt32BE=function(c,d){return c=c>>>0,d||re(c,4,this.length),this[c]*16777216+(this[c+1]<<16|this[c+2]<<8|this[c+3])},s.prototype.readBigUInt64LE=je(function(c){c=c>>>0,q(c,"offset");const d=this[c],_=this[c+7];(d===void 0||_===void 0)&&Z(c,this.length-8);const I=d+this[++c]*2**8+this[++c]*2**16+this[++c]*2**24,$=this[++c]+this[++c]*2**8+this[++c]*2**16+_*2**24;return BigInt(I)+(BigInt($)<<BigInt(32))}),s.prototype.readBigUInt64BE=je(function(c){c=c>>>0,q(c,"offset");const d=this[c],_=this[c+7];(d===void 0||_===void 0)&&Z(c,this.length-8);const I=d*2**24+this[++c]*2**16+this[++c]*2**8+this[++c],$=this[++c]*2**24+this[++c]*2**16+this[++c]*2**8+_;return(BigInt(I)<<BigInt(32))+BigInt($)}),s.prototype.readIntLE=function(c,d,_){c=c>>>0,d=d>>>0,_||re(c,d,this.length);let I=this[c],$=1,H=0;for(;++H<d&&($*=256);)I+=this[c+H]*$;return $*=128,I>=$&&(I-=Math.pow(2,8*d)),I},s.prototype.readIntBE=function(c,d,_){c=c>>>0,d=d>>>0,_||re(c,d,this.length);let I=d,$=1,H=this[c+--I];for(;I>0&&($*=256);)H+=this[c+--I]*$;return $*=128,H>=$&&(H-=Math.pow(2,8*d)),H},s.prototype.readInt8=function(c,d){return c=c>>>0,d||re(c,1,this.length),this[c]&128?(255-this[c]+1)*-1:this[c]},s.prototype.readInt16LE=function(c,d){c=c>>>0,d||re(c,2,this.length);const _=this[c]|this[c+1]<<8;return _&32768?_|4294901760:_},s.prototype.readInt16BE=function(c,d){c=c>>>0,d||re(c,2,this.length);const _=this[c+1]|this[c]<<8;return _&32768?_|4294901760:_},s.prototype.readInt32LE=function(c,d){return c=c>>>0,d||re(c,4,this.length),this[c]|this[c+1]<<8|this[c+2]<<16|this[c+3]<<24},s.prototype.readInt32BE=function(c,d){return c=c>>>0,d||re(c,4,this.length),this[c]<<24|this[c+1]<<16|this[c+2]<<8|this[c+3]},s.prototype.readBigInt64LE=je(function(c){c=c>>>0,q(c,"offset");const d=this[c],_=this[c+7];(d===void 0||_===void 0)&&Z(c,this.length-8);const I=this[c+4]+this[c+5]*2**8+this[c+6]*2**16+(_<<24);return(BigInt(I)<<BigInt(32))+BigInt(d+this[++c]*2**8+this[++c]*2**16+this[++c]*2**24)}),s.prototype.readBigInt64BE=je(function(c){c=c>>>0,q(c,"offset");const d=this[c],_=this[c+7];(d===void 0||_===void 0)&&Z(c,this.length-8);const I=(d<<24)+this[++c]*2**16+this[++c]*2**8+this[++c];return(BigInt(I)<<BigInt(32))+BigInt(this[++c]*2**24+this[++c]*2**16+this[++c]*2**8+_)}),s.prototype.readFloatLE=function(c,d){return c=c>>>0,d||re(c,4,this.length),i.read(this,c,!0,23,4)},s.prototype.readFloatBE=function(c,d){return c=c>>>0,d||re(c,4,this.length),i.read(this,c,!1,23,4)},s.prototype.readDoubleLE=function(c,d){return c=c>>>0,d||re(c,8,this.length),i.read(this,c,!0,52,8)},s.prototype.readDoubleBE=function(c,d){return c=c>>>0,d||re(c,8,this.length),i.read(this,c,!1,52,8)};function ie(m,c,d,_,I,$){if(!s.isBuffer(m))throw new TypeError('"buffer" argument must be a Buffer instance');if(c>I||c<$)throw new RangeError('"value" argument is out of bounds');if(d+_>m.length)throw new RangeError("Index out of range")}s.prototype.writeUintLE=s.prototype.writeUIntLE=function(c,d,_,I){if(c=+c,d=d>>>0,_=_>>>0,!I){const ue=Math.pow(2,8*_)-1;ie(this,c,d,_,ue,0)}let $=1,H=0;for(this[d]=c&255;++H<_&&($*=256);)this[d+H]=c/$&255;return d+_},s.prototype.writeUintBE=s.prototype.writeUIntBE=function(c,d,_,I){if(c=+c,d=d>>>0,_=_>>>0,!I){const ue=Math.pow(2,8*_)-1;ie(this,c,d,_,ue,0)}let $=_-1,H=1;for(this[d+$]=c&255;--$>=0&&(H*=256);)this[d+$]=c/H&255;return d+_},s.prototype.writeUint8=s.prototype.writeUInt8=function(c,d,_){return c=+c,d=d>>>0,_||ie(this,c,d,1,255,0),this[d]=c&255,d+1},s.prototype.writeUint16LE=s.prototype.writeUInt16LE=function(c,d,_){return c=+c,d=d>>>0,_||ie(this,c,d,2,65535,0),this[d]=c&255,this[d+1]=c>>>8,d+2},s.prototype.writeUint16BE=s.prototype.writeUInt16BE=function(c,d,_){return c=+c,d=d>>>0,_||ie(this,c,d,2,65535,0),this[d]=c>>>8,this[d+1]=c&255,d+2},s.prototype.writeUint32LE=s.prototype.writeUInt32LE=function(c,d,_){return c=+c,d=d>>>0,_||ie(this,c,d,4,4294967295,0),this[d+3]=c>>>24,this[d+2]=c>>>16,this[d+1]=c>>>8,this[d]=c&255,d+4},s.prototype.writeUint32BE=s.prototype.writeUInt32BE=function(c,d,_){return c=+c,d=d>>>0,_||ie(this,c,d,4,4294967295,0),this[d]=c>>>24,this[d+1]=c>>>16,this[d+2]=c>>>8,this[d+3]=c&255,d+4};function fe(m,c,d,_,I){T(c,_,I,m,d,7);let $=Number(c&BigInt(4294967295));m[d++]=$,$=$>>8,m[d++]=$,$=$>>8,m[d++]=$,$=$>>8,m[d++]=$;let H=Number(c>>BigInt(32)&BigInt(4294967295));return m[d++]=H,H=H>>8,m[d++]=H,H=H>>8,m[d++]=H,H=H>>8,m[d++]=H,d}function ge(m,c,d,_,I){T(c,_,I,m,d,7);let $=Number(c&BigInt(4294967295));m[d+7]=$,$=$>>8,m[d+6]=$,$=$>>8,m[d+5]=$,$=$>>8,m[d+4]=$;let H=Number(c>>BigInt(32)&BigInt(4294967295));return m[d+3]=H,H=H>>8,m[d+2]=H,H=H>>8,m[d+1]=H,H=H>>8,m[d]=H,d+8}s.prototype.writeBigUInt64LE=je(function(c,d=0){return fe(this,c,d,BigInt(0),BigInt("0xffffffffffffffff"))}),s.prototype.writeBigUInt64BE=je(function(c,d=0){return ge(this,c,d,BigInt(0),BigInt("0xffffffffffffffff"))}),s.prototype.writeIntLE=function(c,d,_,I){if(c=+c,d=d>>>0,!I){const Le=Math.pow(2,8*_-1);ie(this,c,d,_,Le-1,-Le)}let $=0,H=1,ue=0;for(this[d]=c&255;++$<_&&(H*=256);)c<0&&ue===0&&this[d+$-1]!==0&&(ue=1),this[d+$]=(c/H>>0)-ue&255;return d+_},s.prototype.writeIntBE=function(c,d,_,I){if(c=+c,d=d>>>0,!I){const Le=Math.pow(2,8*_-1);ie(this,c,d,_,Le-1,-Le)}let $=_-1,H=1,ue=0;for(this[d+$]=c&255;--$>=0&&(H*=256);)c<0&&ue===0&&this[d+$+1]!==0&&(ue=1),this[d+$]=(c/H>>0)-ue&255;return d+_},s.prototype.writeInt8=function(c,d,_){return c=+c,d=d>>>0,_||ie(this,c,d,1,127,-128),c<0&&(c=255+c+1),this[d]=c&255,d+1},s.prototype.writeInt16LE=function(c,d,_){return c=+c,d=d>>>0,_||ie(this,c,d,2,32767,-32768),this[d]=c&255,this[d+1]=c>>>8,d+2},s.prototype.writeInt16BE=function(c,d,_){return c=+c,d=d>>>0,_||ie(this,c,d,2,32767,-32768),this[d]=c>>>8,this[d+1]=c&255,d+2},s.prototype.writeInt32LE=function(c,d,_){return c=+c,d=d>>>0,_||ie(this,c,d,4,2147483647,-2147483648),this[d]=c&255,this[d+1]=c>>>8,this[d+2]=c>>>16,this[d+3]=c>>>24,d+4},s.prototype.writeInt32BE=function(c,d,_){return c=+c,d=d>>>0,_||ie(this,c,d,4,2147483647,-2147483648),c<0&&(c=4294967295+c+1),this[d]=c>>>24,this[d+1]=c>>>16,this[d+2]=c>>>8,this[d+3]=c&255,d+4},s.prototype.writeBigInt64LE=je(function(c,d=0){return fe(this,c,d,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),s.prototype.writeBigInt64BE=je(function(c,d=0){return ge(this,c,d,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))});function te(m,c,d,_,I,$){if(d+_>m.length)throw new RangeError("Index out of range");if(d<0)throw new RangeError("Index out of range")}function P(m,c,d,_,I){return c=+c,d=d>>>0,I||te(m,c,d,4),i.write(m,c,d,_,23,4),d+4}s.prototype.writeFloatLE=function(c,d,_){return P(this,c,d,!0,_)},s.prototype.writeFloatBE=function(c,d,_){return P(this,c,d,!1,_)};function M(m,c,d,_,I){return c=+c,d=d>>>0,I||te(m,c,d,8),i.write(m,c,d,_,52,8),d+8}s.prototype.writeDoubleLE=function(c,d,_){return M(this,c,d,!0,_)},s.prototype.writeDoubleBE=function(c,d,_){return M(this,c,d,!1,_)},s.prototype.copy=function(c,d,_,I){if(!s.isBuffer(c))throw new TypeError("argument should be a Buffer");if(_||(_=0),!I&&I!==0&&(I=this.length),d>=c.length&&(d=c.length),d||(d=0),I>0&&I<_&&(I=_),I===_||c.length===0||this.length===0)return 0;if(d<0)throw new RangeError("targetStart out of bounds");if(_<0||_>=this.length)throw new RangeError("Index out of range");if(I<0)throw new RangeError("sourceEnd out of bounds");I>this.length&&(I=this.length),c.length-d<I-_&&(I=c.length-d+_);const $=I-_;return this===c&&typeof Uint8Array.prototype.copyWithin=="function"?this.copyWithin(d,_,I):Uint8Array.prototype.set.call(c,this.subarray(_,I),d),$},s.prototype.fill=function(c,d,_,I){if(typeof c=="string"){if(typeof d=="string"?(I=d,d=0,_=this.length):typeof _=="string"&&(I=_,_=this.length),I!==void 0&&typeof I!="string")throw new TypeError("encoding must be a string");if(typeof I=="string"&&!s.isEncoding(I))throw new TypeError("Unknown encoding: "+I);if(c.length===1){const H=c.charCodeAt(0);(I==="utf8"&&H<128||I==="latin1")&&(c=H)}}else typeof c=="number"?c=c&255:typeof c=="boolean"&&(c=Number(c));if(d<0||this.length<d||this.length<_)throw new RangeError("Out of range index");if(_<=d)return this;d=d>>>0,_=_===void 0?this.length:_>>>0,c||(c=0);let $;if(typeof c=="number")for($=d;$<_;++$)this[$]=c;else{const H=s.isBuffer(c)?c:s.from(c,I),ue=H.length;if(ue===0)throw new TypeError('The value "'+c+'" is invalid for argument "value"');for($=0;$<_-d;++$)this[$+d]=H[$%ue]}return this};const j={};function Q(m,c,d){j[m]=class extends d{constructor(){super(),Object.defineProperty(this,"message",{value:c.apply(this,arguments),writable:!0,configurable:!0}),this.name=`${this.name} [${m}]`,this.stack,delete this.name}get code(){return m}set code(I){Object.defineProperty(this,"code",{configurable:!0,enumerable:!0,value:I,writable:!0})}toString(){return`${this.name} [${m}]: ${this.message}`}}}Q("ERR_BUFFER_OUT_OF_BOUNDS",function(m){return m?`${m} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"},RangeError),Q("ERR_INVALID_ARG_TYPE",function(m,c){return`The "${m}" argument must be of type number. Received type ${typeof c}`},TypeError),Q("ERR_OUT_OF_RANGE",function(m,c,d){let _=`The value of "${m}" is out of range.`,I=d;return Number.isInteger(d)&&Math.abs(d)>2**32?I=de(String(d)):typeof d=="bigint"&&(I=String(d),(d>BigInt(2)**BigInt(32)||d<-(BigInt(2)**BigInt(32)))&&(I=de(I)),I+="n"),_+=` It must be ${c}. Received ${I}`,_},RangeError);function de(m){let c="",d=m.length;const _=m[0]==="-"?1:0;for(;d>=_+4;d-=3)c=`_${m.slice(d-3,d)}${c}`;return`${m.slice(0,d)}${c}`}function S(m,c,d){q(c,"offset"),(m[c]===void 0||m[c+d]===void 0)&&Z(c,m.length-(d+1))}function T(m,c,d,_,I,$){if(m>d||m<c){const H=typeof c=="bigint"?"n":"";let ue;throw c===0||c===BigInt(0)?ue=`>= 0${H} and < 2${H} ** ${($+1)*8}${H}`:ue=`>= -(2${H} ** ${($+1)*8-1}${H}) and < 2 ** ${($+1)*8-1}${H}`,new j.ERR_OUT_OF_RANGE("value",ue,m)}S(_,I,$)}function q(m,c){if(typeof m!="number")throw new j.ERR_INVALID_ARG_TYPE(c,"number",m)}function Z(m,c,d){throw Math.floor(m)!==m?(q(m,d),new j.ERR_OUT_OF_RANGE("offset","an integer",m)):c<0?new j.ERR_BUFFER_OUT_OF_BOUNDS:new j.ERR_OUT_OF_RANGE("offset",`>= 0 and <= ${c}`,m)}const we=/[^+/0-9A-Za-z-_]/g;function se(m){if(m=m.split("=")[0],m=m.trim().replace(we,""),m.length<2)return"";for(;m.length%4!==0;)m=m+"=";return m}function pe(m,c){c=c||1/0;let d;const _=m.length;let I=null;const $=[];for(let H=0;H<_;++H){if(d=m.charCodeAt(H),d>55295&&d<57344){if(!I){if(d>56319){(c-=3)>-1&&$.push(239,191,189);continue}else if(H+1===_){(c-=3)>-1&&$.push(239,191,189);continue}I=d;continue}if(d<56320){(c-=3)>-1&&$.push(239,191,189),I=d;continue}d=(I-55296<<10|d-56320)+65536}else I&&(c-=3)>-1&&$.push(239,191,189);if(I=null,d<128){if((c-=1)<0)break;$.push(d)}else if(d<2048){if((c-=2)<0)break;$.push(d>>6|192,d&63|128)}else if(d<65536){if((c-=3)<0)break;$.push(d>>12|224,d>>6&63|128,d&63|128)}else if(d<1114112){if((c-=4)<0)break;$.push(d>>18|240,d>>12&63|128,d>>6&63|128,d&63|128)}else throw new Error("Invalid code point")}return $}function Ge(m){const c=[];for(let d=0;d<m.length;++d)c.push(m.charCodeAt(d)&255);return c}function Je(m,c){let d,_,I;const $=[];for(let H=0;H<m.length&&!((c-=2)<0);++H)d=m.charCodeAt(H),_=d>>8,I=d%256,$.push(I),$.push(_);return $}function Ue(m){return t.toByteArray(se(m))}function Ie(m,c,d,_){let I;for(I=0;I<_&&!(I+d>=c.length||I>=m.length);++I)c[I+d]=m[I];return I}function De(m,c){return m instanceof c||m!=null&&m.constructor!=null&&m.constructor.name!=null&&m.constructor.name===c.name}function ze(m){return m!==m}const We=function(){const m="0123456789abcdef",c=new Array(256);for(let d=0;d<16;++d){const _=d*16;for(let I=0;I<16;++I)c[_+I]=m[d]+m[I]}return c}();function je(m){return typeof BigInt>"u"?ae:m}function ae(){throw new Error("BigInt not supported")}})(ui);(function(e,t){var i=ui,n=i.Buffer;function a(o,s){for(var l in o)s[l]=o[l]}n.from&&n.alloc&&n.allocUnsafe&&n.allocUnsafeSlow?e.exports=i:(a(i,t),t.Buffer=r);function r(o,s,l){return n(o,s,l)}r.prototype=Object.create(n.prototype),a(n,r),r.from=function(o,s,l){if(typeof o=="number")throw new TypeError("Argument must not be a number");return n(o,s,l)},r.alloc=function(o,s,l){if(typeof o!="number")throw new TypeError("Argument must be a number");var u=n(o);return s!==void 0?typeof l=="string"?u.fill(s,l):u.fill(s):u.fill(0),u},r.allocUnsafe=function(o){if(typeof o!="number")throw new TypeError("Argument must be a number");return n(o)},r.allocUnsafeSlow=function(o){if(typeof o!="number")throw new TypeError("Argument must be a number");return i.SlowBuffer(o)}})(La,La.exports);var Ml=La.exports,Qr=65536,yu=4294967295;function vu(){throw new Error(`Secure random number generation is not supported by this browser.
Use Chrome, Firefox or Internet Explorer 11`)}var bu=Ml.Buffer,ar=globalThis.crypto||globalThis.msCrypto;ar&&ar.getRandomValues?Ca.exports=wu:Ca.exports=vu;function wu(e,t){if(e>yu)throw new RangeError("requested too many random bytes");var i=bu.allocUnsafe(e);if(e>0)if(e>Qr)for(var n=0;n<e;n+=Qr)ar.getRandomValues(i.slice(n,n+Qr));else ar.getRandomValues(i);return typeof t=="function"?process.nextTick(function(){t(null,i)}):i}var ns=Ca.exports,Ia={exports:{}},Pl=Sr.EventEmitter;const ku={},_u=Object.freeze(Object.defineProperty({__proto__:null,default:ku},Symbol.toStringTag,{value:"Module"})),pi=Vd(_u);var ea,to;function Su(){if(to)return ea;to=1;function e(b,w){var k=Object.keys(b);if(Object.getOwnPropertySymbols){var f=Object.getOwnPropertySymbols(b);w&&(f=f.filter(function(y){return Object.getOwnPropertyDescriptor(b,y).enumerable})),k.push.apply(k,f)}return k}function t(b){for(var w=1;w<arguments.length;w++){var k=arguments[w]!=null?arguments[w]:{};w%2?e(Object(k),!0).forEach(function(f){i(b,f,k[f])}):Object.getOwnPropertyDescriptors?Object.defineProperties(b,Object.getOwnPropertyDescriptors(k)):e(Object(k)).forEach(function(f){Object.defineProperty(b,f,Object.getOwnPropertyDescriptor(k,f))})}return b}function i(b,w,k){return w=o(w),w in b?Object.defineProperty(b,w,{value:k,enumerable:!0,configurable:!0,writable:!0}):b[w]=k,b}function n(b,w){if(!(b instanceof w))throw new TypeError("Cannot call a class as a function")}function a(b,w){for(var k=0;k<w.length;k++){var f=w[k];f.enumerable=f.enumerable||!1,f.configurable=!0,"value"in f&&(f.writable=!0),Object.defineProperty(b,o(f.key),f)}}function r(b,w,k){return w&&a(b.prototype,w),Object.defineProperty(b,"prototype",{writable:!1}),b}function o(b){var w=s(b,"string");return typeof w=="symbol"?w:String(w)}function s(b,w){if(typeof b!="object"||b===null)return b;var k=b[Symbol.toPrimitive];if(k!==void 0){var f=k.call(b,w);if(typeof f!="object")return f;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(b)}var l=ui,u=l.Buffer,p=pi,h=p.inspect,g=h&&h.custom||"inspect";function v(b,w,k){u.prototype.copy.call(b,w,k)}return ea=function(){function b(){n(this,b),this.head=null,this.tail=null,this.length=0}return r(b,[{key:"push",value:function(k){var f={data:k,next:null};this.length>0?this.tail.next=f:this.head=f,this.tail=f,++this.length}},{key:"unshift",value:function(k){var f={data:k,next:this.head};this.length===0&&(this.tail=f),this.head=f,++this.length}},{key:"shift",value:function(){if(this.length!==0){var k=this.head.data;return this.length===1?this.head=this.tail=null:this.head=this.head.next,--this.length,k}}},{key:"clear",value:function(){this.head=this.tail=null,this.length=0}},{key:"join",value:function(k){if(this.length===0)return"";for(var f=this.head,y=""+f.data;f=f.next;)y+=k+f.data;return y}},{key:"concat",value:function(k){if(this.length===0)return u.alloc(0);for(var f=u.allocUnsafe(k>>>0),y=this.head,E=0;y;)v(y.data,f,E),E+=y.data.length,y=y.next;return f}},{key:"consume",value:function(k,f){var y;return k<this.head.data.length?(y=this.head.data.slice(0,k),this.head.data=this.head.data.slice(k)):k===this.head.data.length?y=this.shift():y=f?this._getString(k):this._getBuffer(k),y}},{key:"first",value:function(){return this.head.data}},{key:"_getString",value:function(k){var f=this.head,y=1,E=f.data;for(k-=E.length;f=f.next;){var C=f.data,x=k>C.length?C.length:k;if(x===C.length?E+=C:E+=C.slice(0,k),k-=x,k===0){x===C.length?(++y,f.next?this.head=f.next:this.head=this.tail=null):(this.head=f,f.data=C.slice(x));break}++y}return this.length-=y,E}},{key:"_getBuffer",value:function(k){var f=u.allocUnsafe(k),y=this.head,E=1;for(y.data.copy(f),k-=y.data.length;y=y.next;){var C=y.data,x=k>C.length?C.length:k;if(C.copy(f,f.length-k,0,x),k-=x,k===0){x===C.length?(++E,y.next?this.head=y.next:this.head=this.tail=null):(this.head=y,y.data=C.slice(x));break}++E}return this.length-=E,f}},{key:g,value:function(k,f){return h(this,t(t({},f),{},{depth:0,customInspect:!1}))}}]),b}(),ea}function xu(e,t){var i=this,n=this._readableState&&this._readableState.destroyed,a=this._writableState&&this._writableState.destroyed;return n||a?(t?t(e):e&&(this._writableState?this._writableState.errorEmitted||(this._writableState.errorEmitted=!0,process.nextTick(Ra,this,e)):process.nextTick(Ra,this,e)),this):(this._readableState&&(this._readableState.destroyed=!0),this._writableState&&(this._writableState.destroyed=!0),this._destroy(e||null,function(r){!t&&r?i._writableState?i._writableState.errorEmitted?process.nextTick(Hn,i):(i._writableState.errorEmitted=!0,process.nextTick(io,i,r)):process.nextTick(io,i,r):t?(process.nextTick(Hn,i),t(r)):process.nextTick(Hn,i)}),this)}function io(e,t){Ra(e,t),Hn(e)}function Hn(e){e._writableState&&!e._writableState.emitClose||e._readableState&&!e._readableState.emitClose||e.emit("close")}function Eu(){this._readableState&&(this._readableState.destroyed=!1,this._readableState.reading=!1,this._readableState.ended=!1,this._readableState.endEmitted=!1),this._writableState&&(this._writableState.destroyed=!1,this._writableState.ended=!1,this._writableState.ending=!1,this._writableState.finalCalled=!1,this._writableState.prefinished=!1,this._writableState.finished=!1,this._writableState.errorEmitted=!1)}function Ra(e,t){e.emit("error",t)}function Tu(e,t){var i=e._readableState,n=e._writableState;i&&i.autoDestroy||n&&n.autoDestroy?e.destroy(t):e.emit("error",t)}var Bl={destroy:xu,undestroy:Eu,errorOrDestroy:Tu},hi={};function Au(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}var Dl={};function mt(e,t,i){i||(i=Error);function n(r,o,s){return typeof t=="string"?t:t(r,o,s)}var a=function(r){Au(o,r);function o(s,l,u){return r.call(this,n(s,l,u))||this}return o}(i);a.prototype.name=i.name,a.prototype.code=e,Dl[e]=a}function no(e,t){if(Array.isArray(e)){var i=e.length;return e=e.map(function(n){return String(n)}),i>2?"one of ".concat(t," ").concat(e.slice(0,i-1).join(", "),", or ")+e[i-1]:i===2?"one of ".concat(t," ").concat(e[0]," or ").concat(e[1]):"of ".concat(t," ").concat(e[0])}else return"of ".concat(t," ").concat(String(e))}function Cu(e,t,i){return e.substr(0,t.length)===t}function Lu(e,t,i){return(i===void 0||i>e.length)&&(i=e.length),e.substring(i-t.length,i)===t}function Iu(e,t,i){return typeof i!="number"&&(i=0),i+t.length>e.length?!1:e.indexOf(t,i)!==-1}mt("ERR_INVALID_OPT_VALUE",function(e,t){return'The value "'+t+'" is invalid for option "'+e+'"'},TypeError);mt("ERR_INVALID_ARG_TYPE",function(e,t,i){var n;typeof t=="string"&&Cu(t,"not ")?(n="must not be",t=t.replace(/^not /,"")):n="must be";var a;if(Lu(e," argument"))a="The ".concat(e," ").concat(n," ").concat(no(t,"type"));else{var r=Iu(e,".")?"property":"argument";a='The "'.concat(e,'" ').concat(r," ").concat(n," ").concat(no(t,"type"))}return a+=". Received type ".concat(typeof i),a},TypeError);mt("ERR_STREAM_PUSH_AFTER_EOF","stream.push() after EOF");mt("ERR_METHOD_NOT_IMPLEMENTED",function(e){return"The "+e+" method is not implemented"});mt("ERR_STREAM_PREMATURE_CLOSE","Premature close");mt("ERR_STREAM_DESTROYED",function(e){return"Cannot call "+e+" after a stream was destroyed"});mt("ERR_MULTIPLE_CALLBACK","Callback called multiple times");mt("ERR_STREAM_CANNOT_PIPE","Cannot pipe, not readable");mt("ERR_STREAM_WRITE_AFTER_END","write after end");mt("ERR_STREAM_NULL_VALUES","May not write null values to stream",TypeError);mt("ERR_UNKNOWN_ENCODING",function(e){return"Unknown encoding: "+e},TypeError);mt("ERR_STREAM_UNSHIFT_AFTER_END_EVENT","stream.unshift() after end event");hi.codes=Dl;var Ru=hi.codes.ERR_INVALID_OPT_VALUE;function $u(e,t,i){return e.highWaterMark!=null?e.highWaterMark:t?e[i]:null}function Mu(e,t,i,n){var a=$u(t,n,i);if(a!=null){if(!(isFinite(a)&&Math.floor(a)===a)||a<0){var r=n?i:"highWaterMark";throw new Ru(r,a)}return Math.floor(a)}return e.objectMode?16:16*1024}var Nl={getHighWaterMark:Mu},$a={exports:{}};typeof Object.create=="function"?$a.exports=function(t,i){i&&(t.super_=i,t.prototype=Object.create(i.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}))}:$a.exports=function(t,i){if(i){t.super_=i;var n=function(){};n.prototype=i.prototype,t.prototype=new n,t.prototype.constructor=t}};var mn=$a.exports,Pu=Bu;function Bu(e,t){if(ta("noDeprecation"))return e;var i=!1;function n(){if(!i){if(ta("throwDeprecation"))throw new Error(t);ta("traceDeprecation"),i=!0}return e.apply(this,arguments)}return n}function ta(e){try{if(!globalThis.localStorage)return!1}catch{return!1}var t=globalThis.localStorage[e];return t==null?!1:String(t).toLowerCase()==="true"}var ia,ro;function Ol(){if(ro)return ia;ro=1,ia=L;function e(P){var M=this;this.next=null,this.entry=null,this.finish=function(){te(M,P)}}var t;L.WritableState=A;var i={deprecate:Pu},n=Pl,a=ui.Buffer,r=(typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof self<"u"?self:{}).Uint8Array||function(){};function o(P){return a.from(P)}function s(P){return a.isBuffer(P)||P instanceof r}var l=Bl,u=Nl,p=u.getHighWaterMark,h=hi.codes,g=h.ERR_INVALID_ARG_TYPE,v=h.ERR_METHOD_NOT_IMPLEMENTED,b=h.ERR_MULTIPLE_CALLBACK,w=h.ERR_STREAM_CANNOT_PIPE,k=h.ERR_STREAM_DESTROYED,f=h.ERR_STREAM_NULL_VALUES,y=h.ERR_STREAM_WRITE_AFTER_END,E=h.ERR_UNKNOWN_ENCODING,C=l.errorOrDestroy;mn(L,n);function x(){}function A(P,M,j){t=t||$i(),P=P||{},typeof j!="boolean"&&(j=M instanceof t),this.objectMode=!!P.objectMode,j&&(this.objectMode=this.objectMode||!!P.writableObjectMode),this.highWaterMark=p(this,P,"writableHighWaterMark",j),this.finalCalled=!1,this.needDrain=!1,this.ending=!1,this.ended=!1,this.finished=!1,this.destroyed=!1;var Q=P.decodeStrings===!1;this.decodeStrings=!Q,this.defaultEncoding=P.defaultEncoding||"utf8",this.length=0,this.writing=!1,this.corked=0,this.sync=!0,this.bufferProcessing=!1,this.onwrite=function(de){J(M,de)},this.writecb=null,this.writelen=0,this.bufferedRequest=null,this.lastBufferedRequest=null,this.pendingcb=0,this.prefinished=!1,this.errorEmitted=!1,this.emitClose=P.emitClose!==!1,this.autoDestroy=!!P.autoDestroy,this.bufferedRequestCount=0,this.corkedRequestsFree=new e(this)}A.prototype.getBuffer=function(){for(var M=this.bufferedRequest,j=[];M;)j.push(M),M=M.next;return j},function(){try{Object.defineProperty(A.prototype,"buffer",{get:i.deprecate(function(){return this.getBuffer()},"_writableState.buffer is deprecated. Use _writableState.getBuffer instead.","DEP0003")})}catch{}}();var R;typeof Symbol=="function"&&Symbol.hasInstance&&typeof Function.prototype[Symbol.hasInstance]=="function"?(R=Function.prototype[Symbol.hasInstance],Object.defineProperty(L,Symbol.hasInstance,{value:function(M){return R.call(this,M)?!0:this!==L?!1:M&&M._writableState instanceof A}})):R=function(M){return M instanceof this};function L(P){t=t||$i();var M=this instanceof t;if(!M&&!R.call(L,this))return new L(P);this._writableState=new A(P,this,M),this.writable=!0,P&&(typeof P.write=="function"&&(this._write=P.write),typeof P.writev=="function"&&(this._writev=P.writev),typeof P.destroy=="function"&&(this._destroy=P.destroy),typeof P.final=="function"&&(this._final=P.final)),n.call(this)}L.prototype.pipe=function(){C(this,new w)};function N(P,M){var j=new y;C(P,j),process.nextTick(M,j)}function z(P,M,j,Q){var de;return j===null?de=new f:typeof j!="string"&&!M.objectMode&&(de=new g("chunk",["string","Buffer"],j)),de?(C(P,de),process.nextTick(Q,de),!1):!0}L.prototype.write=function(P,M,j){var Q=this._writableState,de=!1,S=!Q.objectMode&&s(P);return S&&!a.isBuffer(P)&&(P=o(P)),typeof M=="function"&&(j=M,M=null),S?M="buffer":M||(M=Q.defaultEncoding),typeof j!="function"&&(j=x),Q.ending?N(this,j):(S||z(this,Q,P,j))&&(Q.pendingcb++,de=W(this,Q,S,P,M,j)),de},L.prototype.cork=function(){this._writableState.corked++},L.prototype.uncork=function(){var P=this._writableState;P.corked&&(P.corked--,!P.writing&&!P.corked&&!P.bufferProcessing&&P.bufferedRequest&&Y(this,P))},L.prototype.setDefaultEncoding=function(M){if(typeof M=="string"&&(M=M.toLowerCase()),!(["hex","utf8","utf-8","ascii","binary","base64","ucs2","ucs-2","utf16le","utf-16le","raw"].indexOf((M+"").toLowerCase())>-1))throw new E(M);return this._writableState.defaultEncoding=M,this},Object.defineProperty(L.prototype,"writableBuffer",{enumerable:!1,get:function(){return this._writableState&&this._writableState.getBuffer()}});function K(P,M,j){return!P.objectMode&&P.decodeStrings!==!1&&typeof M=="string"&&(M=a.from(M,j)),M}Object.defineProperty(L.prototype,"writableHighWaterMark",{enumerable:!1,get:function(){return this._writableState.highWaterMark}});function W(P,M,j,Q,de,S){if(!j){var T=K(M,Q,de);Q!==T&&(j=!0,de="buffer",Q=T)}var q=M.objectMode?1:Q.length;M.length+=q;var Z=M.length<M.highWaterMark;if(Z||(M.needDrain=!0),M.writing||M.corked){var we=M.lastBufferedRequest;M.lastBufferedRequest={chunk:Q,encoding:de,isBuf:j,callback:S,next:null},we?we.next=M.lastBufferedRequest:M.bufferedRequest=M.lastBufferedRequest,M.bufferedRequestCount+=1}else O(P,M,!1,q,Q,de,S);return Z}function O(P,M,j,Q,de,S,T){M.writelen=Q,M.writecb=T,M.writing=!0,M.sync=!0,M.destroyed?M.onwrite(new k("write")):j?P._writev(de,M.onwrite):P._write(de,S,M.onwrite),M.sync=!1}function B(P,M,j,Q,de){--M.pendingcb,j?(process.nextTick(de,Q),process.nextTick(fe,P,M),P._writableState.errorEmitted=!0,C(P,Q)):(de(Q),P._writableState.errorEmitted=!0,C(P,Q),fe(P,M))}function D(P){P.writing=!1,P.writecb=null,P.length-=P.writelen,P.writelen=0}function J(P,M){var j=P._writableState,Q=j.sync,de=j.writecb;if(typeof de!="function")throw new b;if(D(j),M)B(P,j,Q,M,de);else{var S=ne(j)||P.destroyed;!S&&!j.corked&&!j.bufferProcessing&&j.bufferedRequest&&Y(P,j),Q?process.nextTick(V,P,j,S,de):V(P,j,S,de)}}function V(P,M,j,Q){j||U(P,M),M.pendingcb--,Q(),fe(P,M)}function U(P,M){M.length===0&&M.needDrain&&(M.needDrain=!1,P.emit("drain"))}function Y(P,M){M.bufferProcessing=!0;var j=M.bufferedRequest;if(P._writev&&j&&j.next){var Q=M.bufferedRequestCount,de=new Array(Q),S=M.corkedRequestsFree;S.entry=j;for(var T=0,q=!0;j;)de[T]=j,j.isBuf||(q=!1),j=j.next,T+=1;de.allBuffers=q,O(P,M,!0,M.length,de,"",S.finish),M.pendingcb++,M.lastBufferedRequest=null,S.next?(M.corkedRequestsFree=S.next,S.next=null):M.corkedRequestsFree=new e(M),M.bufferedRequestCount=0}else{for(;j;){var Z=j.chunk,we=j.encoding,se=j.callback,pe=M.objectMode?1:Z.length;if(O(P,M,!1,pe,Z,we,se),j=j.next,M.bufferedRequestCount--,M.writing)break}j===null&&(M.lastBufferedRequest=null)}M.bufferedRequest=j,M.bufferProcessing=!1}L.prototype._write=function(P,M,j){j(new v("_write()"))},L.prototype._writev=null,L.prototype.end=function(P,M,j){var Q=this._writableState;return typeof P=="function"?(j=P,P=null,M=null):typeof M=="function"&&(j=M,M=null),P!=null&&this.write(P,M),Q.corked&&(Q.corked=1,this.uncork()),Q.ending||ge(this,Q,j),this},Object.defineProperty(L.prototype,"writableLength",{enumerable:!1,get:function(){return this._writableState.length}});function ne(P){return P.ending&&P.length===0&&P.bufferedRequest===null&&!P.finished&&!P.writing}function re(P,M){P._final(function(j){M.pendingcb--,j&&C(P,j),M.prefinished=!0,P.emit("prefinish"),fe(P,M)})}function ie(P,M){!M.prefinished&&!M.finalCalled&&(typeof P._final=="function"&&!M.destroyed?(M.pendingcb++,M.finalCalled=!0,process.nextTick(re,P,M)):(M.prefinished=!0,P.emit("prefinish")))}function fe(P,M){var j=ne(M);if(j&&(ie(P,M),M.pendingcb===0&&(M.finished=!0,P.emit("finish"),M.autoDestroy))){var Q=P._readableState;(!Q||Q.autoDestroy&&Q.endEmitted)&&P.destroy()}return j}function ge(P,M,j){M.ending=!0,fe(P,M),j&&(M.finished?process.nextTick(j):P.once("finish",j)),M.ended=!0,P.writable=!1}function te(P,M,j){var Q=P.entry;for(P.entry=null;Q;){var de=Q.callback;M.pendingcb--,de(j),Q=Q.next}M.corkedRequestsFree.next=P}return Object.defineProperty(L.prototype,"destroyed",{enumerable:!1,get:function(){return this._writableState===void 0?!1:this._writableState.destroyed},set:function(M){this._writableState&&(this._writableState.destroyed=M)}}),L.prototype.destroy=l.destroy,L.prototype._undestroy=l.undestroy,L.prototype._destroy=function(P,M){M(P)},ia}var na,ao;function $i(){if(ao)return na;ao=1;var e=Object.keys||function(u){var p=[];for(var h in u)p.push(h);return p};na=o;var t=Hl(),i=Ol();mn(o,t);for(var n=e(i.prototype),a=0;a<n.length;a++){var r=n[a];o.prototype[r]||(o.prototype[r]=i.prototype[r])}function o(u){if(!(this instanceof o))return new o(u);t.call(this,u),i.call(this,u),this.allowHalfOpen=!0,u&&(u.readable===!1&&(this.readable=!1),u.writable===!1&&(this.writable=!1),u.allowHalfOpen===!1&&(this.allowHalfOpen=!1,this.once("end",s)))}Object.defineProperty(o.prototype,"writableHighWaterMark",{enumerable:!1,get:function(){return this._writableState.highWaterMark}}),Object.defineProperty(o.prototype,"writableBuffer",{enumerable:!1,get:function(){return this._writableState&&this._writableState.getBuffer()}}),Object.defineProperty(o.prototype,"writableLength",{enumerable:!1,get:function(){return this._writableState.length}});function s(){this._writableState.ended||process.nextTick(l,this)}function l(u){u.end()}return Object.defineProperty(o.prototype,"destroyed",{enumerable:!1,get:function(){return this._readableState===void 0||this._writableState===void 0?!1:this._readableState.destroyed&&this._writableState.destroyed},set:function(p){this._readableState===void 0||this._writableState===void 0||(this._readableState.destroyed=p,this._writableState.destroyed=p)}}),na}var ra={},so;function oo(){if(so)return ra;so=1;var e=Ml.Buffer,t=e.isEncoding||function(f){switch(f=""+f,f&&f.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return!0;default:return!1}};function i(f){if(!f)return"utf8";for(var y;;)switch(f){case"utf8":case"utf-8":return"utf8";case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return"utf16le";case"latin1":case"binary":return"latin1";case"base64":case"ascii":case"hex":return f;default:if(y)return;f=(""+f).toLowerCase(),y=!0}}function n(f){var y=i(f);if(typeof y!="string"&&(e.isEncoding===t||!t(f)))throw new Error("Unknown encoding: "+f);return y||f}ra.StringDecoder=a;function a(f){this.encoding=n(f);var y;switch(this.encoding){case"utf16le":this.text=h,this.end=g,y=4;break;case"utf8":this.fillLast=l,y=4;break;case"base64":this.text=v,this.end=b,y=3;break;default:this.write=w,this.end=k;return}this.lastNeed=0,this.lastTotal=0,this.lastChar=e.allocUnsafe(y)}a.prototype.write=function(f){if(f.length===0)return"";var y,E;if(this.lastNeed){if(y=this.fillLast(f),y===void 0)return"";E=this.lastNeed,this.lastNeed=0}else E=0;return E<f.length?y?y+this.text(f,E):this.text(f,E):y||""},a.prototype.end=p,a.prototype.text=u,a.prototype.fillLast=function(f){if(this.lastNeed<=f.length)return f.copy(this.lastChar,this.lastTotal-this.lastNeed,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal);f.copy(this.lastChar,this.lastTotal-this.lastNeed,0,f.length),this.lastNeed-=f.length};function r(f){return f<=127?0:f>>5===6?2:f>>4===14?3:f>>3===30?4:f>>6===2?-1:-2}function o(f,y,E){var C=y.length-1;if(C<E)return 0;var x=r(y[C]);return x>=0?(x>0&&(f.lastNeed=x-1),x):--C<E||x===-2?0:(x=r(y[C]),x>=0?(x>0&&(f.lastNeed=x-2),x):--C<E||x===-2?0:(x=r(y[C]),x>=0?(x>0&&(x===2?x=0:f.lastNeed=x-3),x):0))}function s(f,y,E){if((y[0]&192)!==128)return f.lastNeed=0,"�";if(f.lastNeed>1&&y.length>1){if((y[1]&192)!==128)return f.lastNeed=1,"�";if(f.lastNeed>2&&y.length>2&&(y[2]&192)!==128)return f.lastNeed=2,"�"}}function l(f){var y=this.lastTotal-this.lastNeed,E=s(this,f);if(E!==void 0)return E;if(this.lastNeed<=f.length)return f.copy(this.lastChar,y,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal);f.copy(this.lastChar,y,0,f.length),this.lastNeed-=f.length}function u(f,y){var E=o(this,f,y);if(!this.lastNeed)return f.toString("utf8",y);this.lastTotal=E;var C=f.length-(E-this.lastNeed);return f.copy(this.lastChar,0,C),f.toString("utf8",y,C)}function p(f){var y=f&&f.length?this.write(f):"";return this.lastNeed?y+"�":y}function h(f,y){if((f.length-y)%2===0){var E=f.toString("utf16le",y);if(E){var C=E.charCodeAt(E.length-1);if(C>=55296&&C<=56319)return this.lastNeed=2,this.lastTotal=4,this.lastChar[0]=f[f.length-2],this.lastChar[1]=f[f.length-1],E.slice(0,-1)}return E}return this.lastNeed=1,this.lastTotal=2,this.lastChar[0]=f[f.length-1],f.toString("utf16le",y,f.length-1)}function g(f){var y=f&&f.length?this.write(f):"";if(this.lastNeed){var E=this.lastTotal-this.lastNeed;return y+this.lastChar.toString("utf16le",0,E)}return y}function v(f,y){var E=(f.length-y)%3;return E===0?f.toString("base64",y):(this.lastNeed=3-E,this.lastTotal=3,E===1?this.lastChar[0]=f[f.length-1]:(this.lastChar[0]=f[f.length-2],this.lastChar[1]=f[f.length-1]),f.toString("base64",y,f.length-E))}function b(f){var y=f&&f.length?this.write(f):"";return this.lastNeed?y+this.lastChar.toString("base64",0,3-this.lastNeed):y}function w(f){return f.toString(this.encoding)}function k(f){return f&&f.length?this.write(f):""}return ra}var lo=hi.codes.ERR_STREAM_PREMATURE_CLOSE;function Du(e){var t=!1;return function(){if(!t){t=!0;for(var i=arguments.length,n=new Array(i),a=0;a<i;a++)n[a]=arguments[a];e.apply(this,n)}}}function Nu(){}function Ou(e){return e.setHeader&&typeof e.abort=="function"}function zl(e,t,i){if(typeof t=="function")return zl(e,null,t);t||(t={}),i=Du(i||Nu);var n=t.readable||t.readable!==!1&&e.readable,a=t.writable||t.writable!==!1&&e.writable,r=function(){e.writable||s()},o=e._writableState&&e._writableState.finished,s=function(){a=!1,o=!0,n||i.call(e)},l=e._readableState&&e._readableState.endEmitted,u=function(){n=!1,l=!0,a||i.call(e)},p=function(b){i.call(e,b)},h=function(){var b;if(n&&!l)return(!e._readableState||!e._readableState.ended)&&(b=new lo),i.call(e,b);if(a&&!o)return(!e._writableState||!e._writableState.ended)&&(b=new lo),i.call(e,b)},g=function(){e.req.on("finish",s)};return Ou(e)?(e.on("complete",s),e.on("abort",h),e.req?g():e.on("request",g)):a&&!e._writableState&&(e.on("end",r),e.on("close",r)),e.on("end",u),e.on("finish",s),t.error!==!1&&e.on("error",p),e.on("close",h),function(){e.removeListener("complete",s),e.removeListener("abort",h),e.removeListener("request",g),e.req&&e.req.removeListener("finish",s),e.removeListener("end",r),e.removeListener("close",r),e.removeListener("finish",s),e.removeListener("end",u),e.removeListener("error",p),e.removeListener("close",h)}}var rs=zl,aa,co;function zu(){if(co)return aa;co=1;var e;function t(E,C,x){return C=i(C),C in E?Object.defineProperty(E,C,{value:x,enumerable:!0,configurable:!0,writable:!0}):E[C]=x,E}function i(E){var C=n(E,"string");return typeof C=="symbol"?C:String(C)}function n(E,C){if(typeof E!="object"||E===null)return E;var x=E[Symbol.toPrimitive];if(x!==void 0){var A=x.call(E,C);if(typeof A!="object")return A;throw new TypeError("@@toPrimitive must return a primitive value.")}return(C==="string"?String:Number)(E)}var a=rs,r=Symbol("lastResolve"),o=Symbol("lastReject"),s=Symbol("error"),l=Symbol("ended"),u=Symbol("lastPromise"),p=Symbol("handlePromise"),h=Symbol("stream");function g(E,C){return{value:E,done:C}}function v(E){var C=E[r];if(C!==null){var x=E[h].read();x!==null&&(E[u]=null,E[r]=null,E[o]=null,C(g(x,!1)))}}function b(E){process.nextTick(v,E)}function w(E,C){return function(x,A){E.then(function(){if(C[l]){x(g(void 0,!0));return}C[p](x,A)},A)}}var k=Object.getPrototypeOf(function(){}),f=Object.setPrototypeOf((e={get stream(){return this[h]},next:function(){var C=this,x=this[s];if(x!==null)return Promise.reject(x);if(this[l])return Promise.resolve(g(void 0,!0));if(this[h].destroyed)return new Promise(function(N,z){process.nextTick(function(){C[s]?z(C[s]):N(g(void 0,!0))})});var A=this[u],R;if(A)R=new Promise(w(A,this));else{var L=this[h].read();if(L!==null)return Promise.resolve(g(L,!1));R=new Promise(this[p])}return this[u]=R,R}},t(e,Symbol.asyncIterator,function(){return this}),t(e,"return",function(){var C=this;return new Promise(function(x,A){C[h].destroy(null,function(R){if(R){A(R);return}x(g(void 0,!0))})})}),e),k),y=function(C){var x,A=Object.create(f,(x={},t(x,h,{value:C,writable:!0}),t(x,r,{value:null,writable:!0}),t(x,o,{value:null,writable:!0}),t(x,s,{value:null,writable:!0}),t(x,l,{value:C._readableState.endEmitted,writable:!0}),t(x,p,{value:function(L,N){var z=A[h].read();z?(A[u]=null,A[r]=null,A[o]=null,L(g(z,!1))):(A[r]=L,A[o]=N)},writable:!0}),x));return A[u]=null,a(C,function(R){if(R&&R.code!=="ERR_STREAM_PREMATURE_CLOSE"){var L=A[o];L!==null&&(A[u]=null,A[r]=null,A[o]=null,L(R)),A[s]=R;return}var N=A[r];N!==null&&(A[u]=null,A[r]=null,A[o]=null,N(g(void 0,!0))),A[l]=!0}),C.on("readable",b.bind(null,A)),A};return aa=y,aa}var sa,uo;function Hu(){return uo||(uo=1,sa=function(){throw new Error("Readable.from is not available in the browser")}),sa}var oa,po;function Hl(){if(po)return oa;po=1,oa=N;var e;N.ReadableState=L,Sr.EventEmitter;var t=function(T,q){return T.listeners(q).length},i=Pl,n=ui.Buffer,a=(typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof self<"u"?self:{}).Uint8Array||function(){};function r(S){return n.from(S)}function o(S){return n.isBuffer(S)||S instanceof a}var s=pi,l;s&&s.debuglog?l=s.debuglog("stream"):l=function(){};var u=Su(),p=Bl,h=Nl,g=h.getHighWaterMark,v=hi.codes,b=v.ERR_INVALID_ARG_TYPE,w=v.ERR_STREAM_PUSH_AFTER_EOF,k=v.ERR_METHOD_NOT_IMPLEMENTED,f=v.ERR_STREAM_UNSHIFT_AFTER_END_EVENT,y,E,C;mn(N,i);var x=p.errorOrDestroy,A=["error","close","destroy","pause","resume"];function R(S,T,q){if(typeof S.prependListener=="function")return S.prependListener(T,q);!S._events||!S._events[T]?S.on(T,q):Array.isArray(S._events[T])?S._events[T].unshift(q):S._events[T]=[q,S._events[T]]}function L(S,T,q){e=e||$i(),S=S||{},typeof q!="boolean"&&(q=T instanceof e),this.objectMode=!!S.objectMode,q&&(this.objectMode=this.objectMode||!!S.readableObjectMode),this.highWaterMark=g(this,S,"readableHighWaterMark",q),this.buffer=new u,this.length=0,this.pipes=null,this.pipesCount=0,this.flowing=null,this.ended=!1,this.endEmitted=!1,this.reading=!1,this.sync=!0,this.needReadable=!1,this.emittedReadable=!1,this.readableListening=!1,this.resumeScheduled=!1,this.paused=!0,this.emitClose=S.emitClose!==!1,this.autoDestroy=!!S.autoDestroy,this.destroyed=!1,this.defaultEncoding=S.defaultEncoding||"utf8",this.awaitDrain=0,this.readingMore=!1,this.decoder=null,this.encoding=null,S.encoding&&(y||(y=oo().StringDecoder),this.decoder=new y(S.encoding),this.encoding=S.encoding)}function N(S){if(e=e||$i(),!(this instanceof N))return new N(S);var T=this instanceof e;this._readableState=new L(S,this,T),this.readable=!0,S&&(typeof S.read=="function"&&(this._read=S.read),typeof S.destroy=="function"&&(this._destroy=S.destroy)),i.call(this)}Object.defineProperty(N.prototype,"destroyed",{enumerable:!1,get:function(){return this._readableState===void 0?!1:this._readableState.destroyed},set:function(T){this._readableState&&(this._readableState.destroyed=T)}}),N.prototype.destroy=p.destroy,N.prototype._undestroy=p.undestroy,N.prototype._destroy=function(S,T){T(S)},N.prototype.push=function(S,T){var q=this._readableState,Z;return q.objectMode?Z=!0:typeof S=="string"&&(T=T||q.defaultEncoding,T!==q.encoding&&(S=n.from(S,T),T=""),Z=!0),z(this,S,T,!1,Z)},N.prototype.unshift=function(S){return z(this,S,null,!0,!1)};function z(S,T,q,Z,we){l("readableAddChunk",T);var se=S._readableState;if(T===null)se.reading=!1,J(S,se);else{var pe;if(we||(pe=W(se,T)),pe)x(S,pe);else if(se.objectMode||T&&T.length>0)if(typeof T!="string"&&!se.objectMode&&Object.getPrototypeOf(T)!==n.prototype&&(T=r(T)),Z)se.endEmitted?x(S,new f):K(S,se,T,!0);else if(se.ended)x(S,new w);else{if(se.destroyed)return!1;se.reading=!1,se.decoder&&!q?(T=se.decoder.write(T),se.objectMode||T.length!==0?K(S,se,T,!1):Y(S,se)):K(S,se,T,!1)}else Z||(se.reading=!1,Y(S,se))}return!se.ended&&(se.length<se.highWaterMark||se.length===0)}function K(S,T,q,Z){T.flowing&&T.length===0&&!T.sync?(T.awaitDrain=0,S.emit("data",q)):(T.length+=T.objectMode?1:q.length,Z?T.buffer.unshift(q):T.buffer.push(q),T.needReadable&&V(S)),Y(S,T)}function W(S,T){var q;return!o(T)&&typeof T!="string"&&T!==void 0&&!S.objectMode&&(q=new b("chunk",["string","Buffer","Uint8Array"],T)),q}N.prototype.isPaused=function(){return this._readableState.flowing===!1},N.prototype.setEncoding=function(S){y||(y=oo().StringDecoder);var T=new y(S);this._readableState.decoder=T,this._readableState.encoding=this._readableState.decoder.encoding;for(var q=this._readableState.buffer.head,Z="";q!==null;)Z+=T.write(q.data),q=q.next;return this._readableState.buffer.clear(),Z!==""&&this._readableState.buffer.push(Z),this._readableState.length=Z.length,this};var O=1073741824;function B(S){return S>=O?S=O:(S--,S|=S>>>1,S|=S>>>2,S|=S>>>4,S|=S>>>8,S|=S>>>16,S++),S}function D(S,T){return S<=0||T.length===0&&T.ended?0:T.objectMode?1:S!==S?T.flowing&&T.length?T.buffer.head.data.length:T.length:(S>T.highWaterMark&&(T.highWaterMark=B(S)),S<=T.length?S:T.ended?T.length:(T.needReadable=!0,0))}N.prototype.read=function(S){l("read",S),S=parseInt(S,10);var T=this._readableState,q=S;if(S!==0&&(T.emittedReadable=!1),S===0&&T.needReadable&&((T.highWaterMark!==0?T.length>=T.highWaterMark:T.length>0)||T.ended))return l("read: emitReadable",T.length,T.ended),T.length===0&&T.ended?j(this):V(this),null;if(S=D(S,T),S===0&&T.ended)return T.length===0&&j(this),null;var Z=T.needReadable;l("need readable",Z),(T.length===0||T.length-S<T.highWaterMark)&&(Z=!0,l("length less than watermark",Z)),T.ended||T.reading?(Z=!1,l("reading or ended",Z)):Z&&(l("do read"),T.reading=!0,T.sync=!0,T.length===0&&(T.needReadable=!0),this._read(T.highWaterMark),T.sync=!1,T.reading||(S=D(q,T)));var we;return S>0?we=M(S,T):we=null,we===null?(T.needReadable=T.length<=T.highWaterMark,S=0):(T.length-=S,T.awaitDrain=0),T.length===0&&(T.ended||(T.needReadable=!0),q!==S&&T.ended&&j(this)),we!==null&&this.emit("data",we),we};function J(S,T){if(l("onEofChunk"),!T.ended){if(T.decoder){var q=T.decoder.end();q&&q.length&&(T.buffer.push(q),T.length+=T.objectMode?1:q.length)}T.ended=!0,T.sync?V(S):(T.needReadable=!1,T.emittedReadable||(T.emittedReadable=!0,U(S)))}}function V(S){var T=S._readableState;l("emitReadable",T.needReadable,T.emittedReadable),T.needReadable=!1,T.emittedReadable||(l("emitReadable",T.flowing),T.emittedReadable=!0,process.nextTick(U,S))}function U(S){var T=S._readableState;l("emitReadable_",T.destroyed,T.length,T.ended),!T.destroyed&&(T.length||T.ended)&&(S.emit("readable"),T.emittedReadable=!1),T.needReadable=!T.flowing&&!T.ended&&T.length<=T.highWaterMark,P(S)}function Y(S,T){T.readingMore||(T.readingMore=!0,process.nextTick(ne,S,T))}function ne(S,T){for(;!T.reading&&!T.ended&&(T.length<T.highWaterMark||T.flowing&&T.length===0);){var q=T.length;if(l("maybeReadMore read 0"),S.read(0),q===T.length)break}T.readingMore=!1}N.prototype._read=function(S){x(this,new k("_read()"))},N.prototype.pipe=function(S,T){var q=this,Z=this._readableState;switch(Z.pipesCount){case 0:Z.pipes=S;break;case 1:Z.pipes=[Z.pipes,S];break;default:Z.pipes.push(S);break}Z.pipesCount+=1,l("pipe count=%d opts=%j",Z.pipesCount,T);var we=(!T||T.end!==!1)&&S!==process.stdout&&S!==process.stderr,se=we?Ge:ae;Z.endEmitted?process.nextTick(se):q.once("end",se),S.on("unpipe",pe);function pe(m,c){l("onunpipe"),m===q&&c&&c.hasUnpiped===!1&&(c.hasUnpiped=!0,Ie())}function Ge(){l("onend"),S.end()}var Je=re(q);S.on("drain",Je);var Ue=!1;function Ie(){l("cleanup"),S.removeListener("close",We),S.removeListener("finish",je),S.removeListener("drain",Je),S.removeListener("error",ze),S.removeListener("unpipe",pe),q.removeListener("end",Ge),q.removeListener("end",ae),q.removeListener("data",De),Ue=!0,Z.awaitDrain&&(!S._writableState||S._writableState.needDrain)&&Je()}q.on("data",De);function De(m){l("ondata");var c=S.write(m);l("dest.write",c),c===!1&&((Z.pipesCount===1&&Z.pipes===S||Z.pipesCount>1&&de(Z.pipes,S)!==-1)&&!Ue&&(l("false write response, pause",Z.awaitDrain),Z.awaitDrain++),q.pause())}function ze(m){l("onerror",m),ae(),S.removeListener("error",ze),t(S,"error")===0&&x(S,m)}R(S,"error",ze);function We(){S.removeListener("finish",je),ae()}S.once("close",We);function je(){l("onfinish"),S.removeListener("close",We),ae()}S.once("finish",je);function ae(){l("unpipe"),q.unpipe(S)}return S.emit("pipe",q),Z.flowing||(l("pipe resume"),q.resume()),S};function re(S){return function(){var q=S._readableState;l("pipeOnDrain",q.awaitDrain),q.awaitDrain&&q.awaitDrain--,q.awaitDrain===0&&t(S,"data")&&(q.flowing=!0,P(S))}}N.prototype.unpipe=function(S){var T=this._readableState,q={hasUnpiped:!1};if(T.pipesCount===0)return this;if(T.pipesCount===1)return S&&S!==T.pipes?this:(S||(S=T.pipes),T.pipes=null,T.pipesCount=0,T.flowing=!1,S&&S.emit("unpipe",this,q),this);if(!S){var Z=T.pipes,we=T.pipesCount;T.pipes=null,T.pipesCount=0,T.flowing=!1;for(var se=0;se<we;se++)Z[se].emit("unpipe",this,{hasUnpiped:!1});return this}var pe=de(T.pipes,S);return pe===-1?this:(T.pipes.splice(pe,1),T.pipesCount-=1,T.pipesCount===1&&(T.pipes=T.pipes[0]),S.emit("unpipe",this,q),this)},N.prototype.on=function(S,T){var q=i.prototype.on.call(this,S,T),Z=this._readableState;return S==="data"?(Z.readableListening=this.listenerCount("readable")>0,Z.flowing!==!1&&this.resume()):S==="readable"&&!Z.endEmitted&&!Z.readableListening&&(Z.readableListening=Z.needReadable=!0,Z.flowing=!1,Z.emittedReadable=!1,l("on readable",Z.length,Z.reading),Z.length?V(this):Z.reading||process.nextTick(fe,this)),q},N.prototype.addListener=N.prototype.on,N.prototype.removeListener=function(S,T){var q=i.prototype.removeListener.call(this,S,T);return S==="readable"&&process.nextTick(ie,this),q},N.prototype.removeAllListeners=function(S){var T=i.prototype.removeAllListeners.apply(this,arguments);return(S==="readable"||S===void 0)&&process.nextTick(ie,this),T};function ie(S){var T=S._readableState;T.readableListening=S.listenerCount("readable")>0,T.resumeScheduled&&!T.paused?T.flowing=!0:S.listenerCount("data")>0&&S.resume()}function fe(S){l("readable nexttick read 0"),S.read(0)}N.prototype.resume=function(){var S=this._readableState;return S.flowing||(l("resume"),S.flowing=!S.readableListening,ge(this,S)),S.paused=!1,this};function ge(S,T){T.resumeScheduled||(T.resumeScheduled=!0,process.nextTick(te,S,T))}function te(S,T){l("resume",T.reading),T.reading||S.read(0),T.resumeScheduled=!1,S.emit("resume"),P(S),T.flowing&&!T.reading&&S.read(0)}N.prototype.pause=function(){return l("call pause flowing=%j",this._readableState.flowing),this._readableState.flowing!==!1&&(l("pause"),this._readableState.flowing=!1,this.emit("pause")),this._readableState.paused=!0,this};function P(S){var T=S._readableState;for(l("flow",T.flowing);T.flowing&&S.read()!==null;);}N.prototype.wrap=function(S){var T=this,q=this._readableState,Z=!1;S.on("end",function(){if(l("wrapped end"),q.decoder&&!q.ended){var pe=q.decoder.end();pe&&pe.length&&T.push(pe)}T.push(null)}),S.on("data",function(pe){if(l("wrapped data"),q.decoder&&(pe=q.decoder.write(pe)),!(q.objectMode&&pe==null)&&!(!q.objectMode&&(!pe||!pe.length))){var Ge=T.push(pe);Ge||(Z=!0,S.pause())}});for(var we in S)this[we]===void 0&&typeof S[we]=="function"&&(this[we]=function(Ge){return function(){return S[Ge].apply(S,arguments)}}(we));for(var se=0;se<A.length;se++)S.on(A[se],this.emit.bind(this,A[se]));return this._read=function(pe){l("wrapped _read",pe),Z&&(Z=!1,S.resume())},this},typeof Symbol=="function"&&(N.prototype[Symbol.asyncIterator]=function(){return E===void 0&&(E=zu()),E(this)}),Object.defineProperty(N.prototype,"readableHighWaterMark",{enumerable:!1,get:function(){return this._readableState.highWaterMark}}),Object.defineProperty(N.prototype,"readableBuffer",{enumerable:!1,get:function(){return this._readableState&&this._readableState.buffer}}),Object.defineProperty(N.prototype,"readableFlowing",{enumerable:!1,get:function(){return this._readableState.flowing},set:function(T){this._readableState&&(this._readableState.flowing=T)}}),N._fromList=M,Object.defineProperty(N.prototype,"readableLength",{enumerable:!1,get:function(){return this._readableState.length}});function M(S,T){if(T.length===0)return null;var q;return T.objectMode?q=T.buffer.shift():!S||S>=T.length?(T.decoder?q=T.buffer.join(""):T.buffer.length===1?q=T.buffer.first():q=T.buffer.concat(T.length),T.buffer.clear()):q=T.buffer.consume(S,T.decoder),q}function j(S){var T=S._readableState;l("endReadable",T.endEmitted),T.endEmitted||(T.ended=!0,process.nextTick(Q,T,S))}function Q(S,T){if(l("endReadableNT",S.endEmitted,S.length),!S.endEmitted&&S.length===0&&(S.endEmitted=!0,T.readable=!1,T.emit("end"),S.autoDestroy)){var q=T._writableState;(!q||q.autoDestroy&&q.finished)&&T.destroy()}}typeof Symbol=="function"&&(N.from=function(S,T){return C===void 0&&(C=Hu()),C(N,S,T)});function de(S,T){for(var q=0,Z=S.length;q<Z;q++)if(S[q]===T)return q;return-1}return oa}var ql=Dt,Tr=hi.codes,qu=Tr.ERR_METHOD_NOT_IMPLEMENTED,Fu=Tr.ERR_MULTIPLE_CALLBACK,Uu=Tr.ERR_TRANSFORM_ALREADY_TRANSFORMING,ju=Tr.ERR_TRANSFORM_WITH_LENGTH_0,Ar=$i();mn(Dt,Ar);function Ku(e,t){var i=this._transformState;i.transforming=!1;var n=i.writecb;if(n===null)return this.emit("error",new Fu);i.writechunk=null,i.writecb=null,t!=null&&this.push(t),n(e);var a=this._readableState;a.reading=!1,(a.needReadable||a.length<a.highWaterMark)&&this._read(a.highWaterMark)}function Dt(e){if(!(this instanceof Dt))return new Dt(e);Ar.call(this,e),this._transformState={afterTransform:Ku.bind(this),needTransform:!1,transforming:!1,writecb:null,writechunk:null,writeencoding:null},this._readableState.needReadable=!0,this._readableState.sync=!1,e&&(typeof e.transform=="function"&&(this._transform=e.transform),typeof e.flush=="function"&&(this._flush=e.flush)),this.on("prefinish",Wu)}function Wu(){var e=this;typeof this._flush=="function"&&!this._readableState.destroyed?this._flush(function(t,i){ho(e,t,i)}):ho(this,null,null)}Dt.prototype.push=function(e,t){return this._transformState.needTransform=!1,Ar.prototype.push.call(this,e,t)};Dt.prototype._transform=function(e,t,i){i(new qu("_transform()"))};Dt.prototype._write=function(e,t,i){var n=this._transformState;if(n.writecb=i,n.writechunk=e,n.writeencoding=t,!n.transforming){var a=this._readableState;(n.needTransform||a.needReadable||a.length<a.highWaterMark)&&this._read(a.highWaterMark)}};Dt.prototype._read=function(e){var t=this._transformState;t.writechunk!==null&&!t.transforming?(t.transforming=!0,this._transform(t.writechunk,t.writeencoding,t.afterTransform)):t.needTransform=!0};Dt.prototype._destroy=function(e,t){Ar.prototype._destroy.call(this,e,function(i){t(i)})};function ho(e,t,i){if(t)return e.emit("error",t);if(i!=null&&e.push(i),e._writableState.length)throw new ju;if(e._transformState.transforming)throw new Uu;return e.push(null)}var Yu=cn,Fl=ql;mn(cn,Fl);function cn(e){if(!(this instanceof cn))return new cn(e);Fl.call(this,e)}cn.prototype._transform=function(e,t,i){i(null,e)};var la;function Vu(e){var t=!1;return function(){t||(t=!0,e.apply(void 0,arguments))}}var Ul=hi.codes,Gu=Ul.ERR_MISSING_ARGS,Ju=Ul.ERR_STREAM_DESTROYED;function fo(e){if(e)throw e}function Xu(e){return e.setHeader&&typeof e.abort=="function"}function Zu(e,t,i,n){n=Vu(n);var a=!1;e.on("close",function(){a=!0}),la===void 0&&(la=rs),la(e,{readable:t,writable:i},function(o){if(o)return n(o);a=!0,n()});var r=!1;return function(o){if(!a&&!r){if(r=!0,Xu(e))return e.abort();if(typeof e.destroy=="function")return e.destroy();n(o||new Ju("pipe"))}}}function mo(e){e()}function Qu(e,t){return e.pipe(t)}function ep(e){return!e.length||typeof e[e.length-1]!="function"?fo:e.pop()}function tp(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];var n=ep(t);if(Array.isArray(t[0])&&(t=t[0]),t.length<2)throw new Gu("streams");var a,r=t.map(function(o,s){var l=s<t.length-1,u=s>0;return Zu(o,l,u,function(p){a||(a=p),p&&r.forEach(mo),!l&&(r.forEach(mo),n(a))})});return t.reduce(Qu)}var ip=tp;(function(e,t){t=e.exports=Hl(),t.Stream=t,t.Readable=t,t.Writable=Ol(),t.Duplex=$i(),t.Transform=ql,t.PassThrough=Yu,t.finished=rs,t.pipeline=ip})(Ia,Ia.exports);var jl=Ia.exports;function go(e,t){for(const i in t)Object.defineProperty(e,i,{value:t[i],enumerable:!0,configurable:!0});return e}function np(e,t,i){if(!e||typeof e=="string")throw new TypeError("Please pass an Error to err-code");i||(i={}),typeof t=="object"&&(i=t,t=""),t&&(i.code=t);try{return go(e,i)}catch{i.message=e.message,i.stack=e.stack;const a=function(){};return a.prototype=Object.create(Object.getPrototypeOf(e)),go(new a,i)}}var rp=np;const ap=kr("simple-peer"),Kl=lu,yo=ns,sp=jl,ca=xr,ve=rp,{Buffer:op}=ui,da=64*1024,lp=5*1e3,cp=5*1e3;function vo(e){return e.replace(/a=ice-options:trickle\s\n/g,"")}let Cr=class Ma extends sp.Duplex{constructor(t){if(t=Object.assign({allowHalfOpen:!1},t),super(t),this._id=yo(4).toString("hex").slice(0,7),this._debug("new peer %o",t),this.channelName=t.initiator?t.channelName||yo(20).toString("hex"):null,this.initiator=t.initiator||!1,this.channelConfig=t.channelConfig||Ma.channelConfig,this.channelNegotiated=this.channelConfig.negotiated,this.config=Object.assign({},Ma.config,t.config),this.offerOptions=t.offerOptions||{},this.answerOptions=t.answerOptions||{},this.sdpTransform=t.sdpTransform||(i=>i),this.streams=t.streams||(t.stream?[t.stream]:[]),this.trickle=t.trickle!==void 0?t.trickle:!0,this.allowHalfTrickle=t.allowHalfTrickle!==void 0?t.allowHalfTrickle:!1,this.iceCompleteTimeout=t.iceCompleteTimeout||lp,this.destroyed=!1,this.destroying=!1,this._connected=!1,this.remoteAddress=void 0,this.remoteFamily=void 0,this.remotePort=void 0,this.localAddress=void 0,this.localFamily=void 0,this.localPort=void 0,this._wrtc=t.wrtc&&typeof t.wrtc=="object"?t.wrtc:Kl(),!this._wrtc)throw ve(typeof window>"u"?new Error("No WebRTC support: Specify `opts.wrtc` option in this environment"):new Error("No WebRTC support: Not a supported browser"),"ERR_WEBRTC_SUPPORT");this._pcReady=!1,this._channelReady=!1,this._iceComplete=!1,this._iceCompleteTimer=null,this._channel=null,this._pendingCandidates=[],this._isNegotiating=!1,this._firstNegotiation=!0,this._batchedNegotiation=!1,this._queuedNegotiation=!1,this._sendersAwaitingStable=[],this._senderMap=new Map,this._closingInterval=null,this._remoteTracks=[],this._remoteStreams=[],this._chunk=null,this._cb=null,this._interval=null;try{this._pc=new this._wrtc.RTCPeerConnection(this.config)}catch(i){this.destroy(ve(i,"ERR_PC_CONSTRUCTOR"));return}this._isReactNativeWebrtc=typeof this._pc._peerConnectionId=="number",this._pc.oniceconnectionstatechange=()=>{this._onIceStateChange()},this._pc.onicegatheringstatechange=()=>{this._onIceStateChange()},this._pc.onconnectionstatechange=()=>{this._onConnectionStateChange()},this._pc.onsignalingstatechange=()=>{this._onSignalingStateChange()},this._pc.onicecandidate=i=>{this._onIceCandidate(i)},typeof this._pc.peerIdentity=="object"&&this._pc.peerIdentity.catch(i=>{this.destroy(ve(i,"ERR_PC_PEER_IDENTITY"))}),this.initiator||this.channelNegotiated?this._setupData({channel:this._pc.createDataChannel(this.channelName,this.channelConfig)}):this._pc.ondatachannel=i=>{this._setupData(i)},this.streams&&this.streams.forEach(i=>{this.addStream(i)}),this._pc.ontrack=i=>{this._onTrack(i)},this._debug("initial negotiation"),this._needsNegotiation(),this._onFinishBound=()=>{this._onFinish()},this.once("finish",this._onFinishBound)}get bufferSize(){return this._channel&&this._channel.bufferedAmount||0}get connected(){return this._connected&&this._channel.readyState==="open"}address(){return{port:this.localPort,family:this.localFamily,address:this.localAddress}}signal(t){if(!this.destroying){if(this.destroyed)throw ve(new Error("cannot signal after peer is destroyed"),"ERR_DESTROYED");if(typeof t=="string")try{t=JSON.parse(t)}catch{t={}}this._debug("signal()"),t.renegotiate&&this.initiator&&(this._debug("got request to renegotiate"),this._needsNegotiation()),t.transceiverRequest&&this.initiator&&(this._debug("got request for transceiver"),this.addTransceiver(t.transceiverRequest.kind,t.transceiverRequest.init)),t.candidate&&(this._pc.remoteDescription&&this._pc.remoteDescription.type?this._addIceCandidate(t.candidate):this._pendingCandidates.push(t.candidate)),t.sdp&&this._pc.setRemoteDescription(new this._wrtc.RTCSessionDescription(t)).then(()=>{this.destroyed||(this._pendingCandidates.forEach(i=>{this._addIceCandidate(i)}),this._pendingCandidates=[],this._pc.remoteDescription.type==="offer"&&this._createAnswer())}).catch(i=>{this.destroy(ve(i,"ERR_SET_REMOTE_DESCRIPTION"))}),!t.sdp&&!t.candidate&&!t.renegotiate&&!t.transceiverRequest&&this.destroy(ve(new Error("signal() called with invalid signal data"),"ERR_SIGNALING"))}}_addIceCandidate(t){const i=new this._wrtc.RTCIceCandidate(t);this._pc.addIceCandidate(i).catch(n=>{!i.address||i.address.endsWith(".local")?void 0:this.destroy(ve(n,"ERR_ADD_ICE_CANDIDATE"))})}send(t){if(!this.destroying){if(this.destroyed)throw ve(new Error("cannot send after peer is destroyed"),"ERR_DESTROYED");this._channel.send(t)}}addTransceiver(t,i){if(!this.destroying){if(this.destroyed)throw ve(new Error("cannot addTransceiver after peer is destroyed"),"ERR_DESTROYED");if(this._debug("addTransceiver()"),this.initiator)try{this._pc.addTransceiver(t,i),this._needsNegotiation()}catch(n){this.destroy(ve(n,"ERR_ADD_TRANSCEIVER"))}else this.emit("signal",{type:"transceiverRequest",transceiverRequest:{kind:t,init:i}})}}addStream(t){if(!this.destroying){if(this.destroyed)throw ve(new Error("cannot addStream after peer is destroyed"),"ERR_DESTROYED");this._debug("addStream()"),t.getTracks().forEach(i=>{this.addTrack(i,t)})}}addTrack(t,i){if(this.destroying)return;if(this.destroyed)throw ve(new Error("cannot addTrack after peer is destroyed"),"ERR_DESTROYED");this._debug("addTrack()");const n=this._senderMap.get(t)||new Map;let a=n.get(i);if(!a)a=this._pc.addTrack(t,i),n.set(i,a),this._senderMap.set(t,n),this._needsNegotiation();else throw a.removed?ve(new Error("Track has been removed. You should enable/disable tracks that you want to re-add."),"ERR_SENDER_REMOVED"):ve(new Error("Track has already been added to that stream."),"ERR_SENDER_ALREADY_ADDED")}replaceTrack(t,i,n){if(this.destroying)return;if(this.destroyed)throw ve(new Error("cannot replaceTrack after peer is destroyed"),"ERR_DESTROYED");this._debug("replaceTrack()");const a=this._senderMap.get(t),r=a?a.get(n):null;if(!r)throw ve(new Error("Cannot replace track that was never added."),"ERR_TRACK_NOT_ADDED");i&&this._senderMap.set(i,a),r.replaceTrack!=null?r.replaceTrack(i):this.destroy(ve(new Error("replaceTrack is not supported in this browser"),"ERR_UNSUPPORTED_REPLACETRACK"))}removeTrack(t,i){if(this.destroying)return;if(this.destroyed)throw ve(new Error("cannot removeTrack after peer is destroyed"),"ERR_DESTROYED");this._debug("removeSender()");const n=this._senderMap.get(t),a=n?n.get(i):null;if(!a)throw ve(new Error("Cannot remove track that was never added."),"ERR_TRACK_NOT_ADDED");try{a.removed=!0,this._pc.removeTrack(a)}catch(r){r.name==="NS_ERROR_UNEXPECTED"?this._sendersAwaitingStable.push(a):this.destroy(ve(r,"ERR_REMOVE_TRACK"))}this._needsNegotiation()}removeStream(t){if(!this.destroying){if(this.destroyed)throw ve(new Error("cannot removeStream after peer is destroyed"),"ERR_DESTROYED");this._debug("removeSenders()"),t.getTracks().forEach(i=>{this.removeTrack(i,t)})}}_needsNegotiation(){this._debug("_needsNegotiation"),!this._batchedNegotiation&&(this._batchedNegotiation=!0,ca(()=>{this._batchedNegotiation=!1,this.initiator||!this._firstNegotiation?(this._debug("starting batched negotiation"),this.negotiate()):this._debug("non-initiator initial negotiation request discarded"),this._firstNegotiation=!1}))}negotiate(){if(!this.destroying){if(this.destroyed)throw ve(new Error("cannot negotiate after peer is destroyed"),"ERR_DESTROYED");this.initiator?this._isNegotiating?(this._queuedNegotiation=!0,this._debug("already negotiating, queueing")):(this._debug("start negotiation"),setTimeout(()=>{this._createOffer()},0)):this._isNegotiating?(this._queuedNegotiation=!0,this._debug("already negotiating, queueing")):(this._debug("requesting negotiation from initiator"),this.emit("signal",{type:"renegotiate",renegotiate:!0})),this._isNegotiating=!0}}destroy(t){this._destroy(t,()=>{})}_destroy(t,i){this.destroyed||this.destroying||(this.destroying=!0,this._debug("destroying (error: %s)",t&&(t.message||t)),ca(()=>{if(this.destroyed=!0,this.destroying=!1,this._debug("destroy (error: %s)",t&&(t.message||t)),this.readable=this.writable=!1,this._readableState.ended||this.push(null),this._writableState.finished||this.end(),this._connected=!1,this._pcReady=!1,this._channelReady=!1,this._remoteTracks=null,this._remoteStreams=null,this._senderMap=null,clearInterval(this._closingInterval),this._closingInterval=null,clearInterval(this._interval),this._interval=null,this._chunk=null,this._cb=null,this._onFinishBound&&this.removeListener("finish",this._onFinishBound),this._onFinishBound=null,this._channel){try{this._channel.close()}catch{}this._channel.onmessage=null,this._channel.onopen=null,this._channel.onclose=null,this._channel.onerror=null}if(this._pc){try{this._pc.close()}catch{}this._pc.oniceconnectionstatechange=null,this._pc.onicegatheringstatechange=null,this._pc.onsignalingstatechange=null,this._pc.onicecandidate=null,this._pc.ontrack=null,this._pc.ondatachannel=null}this._pc=null,this._channel=null,t&&this.emit("error",t),this.emit("close"),i()}))}_setupData(t){if(!t.channel)return this.destroy(ve(new Error("Data channel event is missing `channel` property"),"ERR_DATA_CHANNEL"));this._channel=t.channel,this._channel.binaryType="arraybuffer",typeof this._channel.bufferedAmountLowThreshold=="number"&&(this._channel.bufferedAmountLowThreshold=da),this.channelName=this._channel.label,this._channel.onmessage=n=>{this._onChannelMessage(n)},this._channel.onbufferedamountlow=()=>{this._onChannelBufferedAmountLow()},this._channel.onopen=()=>{this._onChannelOpen()},this._channel.onclose=()=>{this._onChannelClose()},this._channel.onerror=n=>{const a=n.error instanceof Error?n.error:new Error(`Datachannel error: ${n.message} ${n.filename}:${n.lineno}:${n.colno}`);this.destroy(ve(a,"ERR_DATA_CHANNEL"))};let i=!1;this._closingInterval=setInterval(()=>{this._channel&&this._channel.readyState==="closing"?(i&&this._onChannelClose(),i=!0):i=!1},cp)}_read(){}_write(t,i,n){if(this.destroyed)return n(ve(new Error("cannot write after peer is destroyed"),"ERR_DATA_CHANNEL"));if(this._connected){try{this.send(t)}catch(a){return this.destroy(ve(a,"ERR_DATA_CHANNEL"))}this._channel.bufferedAmount>da?(this._debug("start backpressure: bufferedAmount %d",this._channel.bufferedAmount),this._cb=n):n(null)}else this._debug("write before connect"),this._chunk=t,this._cb=n}_onFinish(){if(this.destroyed)return;const t=()=>{setTimeout(()=>this.destroy(),1e3)};this._connected?t():this.once("connect",t)}_startIceCompleteTimeout(){this.destroyed||this._iceCompleteTimer||(this._debug("started iceComplete timeout"),this._iceCompleteTimer=setTimeout(()=>{this._iceComplete||(this._iceComplete=!0,this._debug("iceComplete timeout completed"),this.emit("iceTimeout"),this.emit("_iceComplete"))},this.iceCompleteTimeout))}_createOffer(){this.destroyed||this._pc.createOffer(this.offerOptions).then(t=>{if(this.destroyed)return;!this.trickle&&!this.allowHalfTrickle&&(t.sdp=vo(t.sdp)),t.sdp=this.sdpTransform(t.sdp);const i=()=>{if(this.destroyed)return;const r=this._pc.localDescription||t;this._debug("signal"),this.emit("signal",{type:r.type,sdp:r.sdp})},n=()=>{this._debug("createOffer success"),!this.destroyed&&(this.trickle||this._iceComplete?i():this.once("_iceComplete",i))},a=r=>{this.destroy(ve(r,"ERR_SET_LOCAL_DESCRIPTION"))};this._pc.setLocalDescription(t).then(n).catch(a)}).catch(t=>{this.destroy(ve(t,"ERR_CREATE_OFFER"))})}_requestMissingTransceivers(){this._pc.getTransceivers&&this._pc.getTransceivers().forEach(t=>{!t.mid&&t.sender.track&&!t.requested&&(t.requested=!0,this.addTransceiver(t.sender.track.kind))})}_createAnswer(){this.destroyed||this._pc.createAnswer(this.answerOptions).then(t=>{if(this.destroyed)return;!this.trickle&&!this.allowHalfTrickle&&(t.sdp=vo(t.sdp)),t.sdp=this.sdpTransform(t.sdp);const i=()=>{if(this.destroyed)return;const r=this._pc.localDescription||t;this._debug("signal"),this.emit("signal",{type:r.type,sdp:r.sdp}),this.initiator||this._requestMissingTransceivers()},n=()=>{this.destroyed||(this.trickle||this._iceComplete?i():this.once("_iceComplete",i))},a=r=>{this.destroy(ve(r,"ERR_SET_LOCAL_DESCRIPTION"))};this._pc.setLocalDescription(t).then(n).catch(a)}).catch(t=>{this.destroy(ve(t,"ERR_CREATE_ANSWER"))})}_onConnectionStateChange(){this.destroyed||this._pc.connectionState==="failed"&&this.destroy(ve(new Error("Connection failed."),"ERR_CONNECTION_FAILURE"))}_onIceStateChange(){if(this.destroyed)return;const t=this._pc.iceConnectionState,i=this._pc.iceGatheringState;this._debug("iceStateChange (connection: %s) (gathering: %s)",t,i),this.emit("iceStateChange",t,i),(t==="connected"||t==="completed")&&(this._pcReady=!0,this._maybeReady()),t==="failed"&&this.destroy(ve(new Error("Ice connection failed."),"ERR_ICE_CONNECTION_FAILURE")),t==="closed"&&this.destroy(ve(new Error("Ice connection closed."),"ERR_ICE_CONNECTION_CLOSED"))}getStats(t){const i=n=>(Object.prototype.toString.call(n.values)==="[object Array]"&&n.values.forEach(a=>{Object.assign(n,a)}),n);this._pc.getStats.length===0||this._isReactNativeWebrtc?this._pc.getStats().then(n=>{const a=[];n.forEach(r=>{a.push(i(r))}),t(null,a)},n=>t(n)):this._pc.getStats.length>0?this._pc.getStats(n=>{if(this.destroyed)return;const a=[];n.result().forEach(r=>{const o={};r.names().forEach(s=>{o[s]=r.stat(s)}),o.id=r.id,o.type=r.type,o.timestamp=r.timestamp,a.push(i(o))}),t(null,a)},n=>t(n)):t(null,[])}_maybeReady(){if(this._debug("maybeReady pc %s channel %s",this._pcReady,this._channelReady),this._connected||this._connecting||!this._pcReady||!this._channelReady)return;this._connecting=!0;const t=()=>{this.destroyed||this.getStats((i,n)=>{if(this.destroyed)return;i&&(n=[]);const a={},r={},o={};let s=!1;n.forEach(u=>{(u.type==="remotecandidate"||u.type==="remote-candidate")&&(a[u.id]=u),(u.type==="localcandidate"||u.type==="local-candidate")&&(r[u.id]=u),(u.type==="candidatepair"||u.type==="candidate-pair")&&(o[u.id]=u)});const l=u=>{s=!0;let p=r[u.localCandidateId];p&&(p.ip||p.address)?(this.localAddress=p.ip||p.address,this.localPort=Number(p.port)):p&&p.ipAddress?(this.localAddress=p.ipAddress,this.localPort=Number(p.portNumber)):typeof u.googLocalAddress=="string"&&(p=u.googLocalAddress.split(":"),this.localAddress=p[0],this.localPort=Number(p[1])),this.localAddress&&(this.localFamily=this.localAddress.includes(":")?"IPv6":"IPv4");let h=a[u.remoteCandidateId];h&&(h.ip||h.address)?(this.remoteAddress=h.ip||h.address,this.remotePort=Number(h.port)):h&&h.ipAddress?(this.remoteAddress=h.ipAddress,this.remotePort=Number(h.portNumber)):typeof u.googRemoteAddress=="string"&&(h=u.googRemoteAddress.split(":"),this.remoteAddress=h[0],this.remotePort=Number(h[1])),this.remoteAddress&&(this.remoteFamily=this.remoteAddress.includes(":")?"IPv6":"IPv4"),this._debug("connect local: %s:%s remote: %s:%s",this.localAddress,this.localPort,this.remoteAddress,this.remotePort)};if(n.forEach(u=>{u.type==="transport"&&u.selectedCandidatePairId&&l(o[u.selectedCandidatePairId]),(u.type==="googCandidatePair"&&u.googActiveConnection==="true"||(u.type==="candidatepair"||u.type==="candidate-pair")&&u.selected)&&l(u)}),!s&&(!Object.keys(o).length||Object.keys(r).length)){setTimeout(t,100);return}else this._connecting=!1,this._connected=!0;if(this._chunk){try{this.send(this._chunk)}catch(p){return this.destroy(ve(p,"ERR_DATA_CHANNEL"))}this._chunk=null,this._debug('sent chunk from "write before connect"');const u=this._cb;this._cb=null,u(null)}typeof this._channel.bufferedAmountLowThreshold!="number"&&(this._interval=setInterval(()=>this._onInterval(),150),this._interval.unref&&this._interval.unref()),this._debug("connect"),this.emit("connect")})};t()}_onInterval(){!this._cb||!this._channel||this._channel.bufferedAmount>da||this._onChannelBufferedAmountLow()}_onSignalingStateChange(){this.destroyed||(this._pc.signalingState==="stable"&&(this._isNegotiating=!1,this._debug("flushing sender queue",this._sendersAwaitingStable),this._sendersAwaitingStable.forEach(t=>{this._pc.removeTrack(t),this._queuedNegotiation=!0}),this._sendersAwaitingStable=[],this._queuedNegotiation?(this._debug("flushing negotiation queue"),this._queuedNegotiation=!1,this._needsNegotiation()):(this._debug("negotiated"),this.emit("negotiated"))),this._debug("signalingStateChange %s",this._pc.signalingState),this.emit("signalingStateChange",this._pc.signalingState))}_onIceCandidate(t){this.destroyed||(t.candidate&&this.trickle?this.emit("signal",{type:"candidate",candidate:{candidate:t.candidate.candidate,sdpMLineIndex:t.candidate.sdpMLineIndex,sdpMid:t.candidate.sdpMid}}):!t.candidate&&!this._iceComplete&&(this._iceComplete=!0,this.emit("_iceComplete")),t.candidate&&this._startIceCompleteTimeout())}_onChannelMessage(t){if(this.destroyed)return;let i=t.data;i instanceof ArrayBuffer&&(i=op.from(i)),this.push(i)}_onChannelBufferedAmountLow(){if(this.destroyed||!this._cb)return;this._debug("ending backpressure: bufferedAmount %d",this._channel.bufferedAmount);const t=this._cb;this._cb=null,t(null)}_onChannelOpen(){this._connected||this.destroyed||(this._debug("on channel open"),this._channelReady=!0,this._maybeReady())}_onChannelClose(){this.destroyed||(this._debug("on channel close"),this.destroy())}_onTrack(t){this.destroyed||t.streams.forEach(i=>{this._debug("on track"),this.emit("track",t.track,i),this._remoteTracks.push({track:t.track,stream:i}),!this._remoteStreams.some(n=>n.id===i.id)&&(this._remoteStreams.push(i),ca(()=>{this._debug("on stream"),this.emit("stream",i)}))})}_debug(){const t=[].slice.call(arguments);t[0]="["+this._id+"] "+t[0],ap.apply(null,t)}};Cr.WEBRTC_SUPPORT=!!Kl();Cr.config={iceServers:[{urls:["stun:stun.l.google.com:19302","stun:global.stun.twilio.com:3478"]}],sdpSemantics:"unified-plan"};Cr.channelConfig={};var Wl=Cr,as={};(function(e){e.DEFAULT_ANNOUNCE_PEERS=50,e.MAX_ANNOUNCE_PEERS=82,e.binaryToHex=i=>(typeof i!="string"&&(i=String(i)),Buffer.from(i,"binary").toString("hex")),e.hexToBinary=i=>(typeof i!="string"&&(i=String(i)),Buffer.from(i,"hex").toString("binary")),e.parseUrl=i=>{const n=new URL(i.replace(/^udp:/,"http:"));return i.match(/^udp:/)&&Object.defineProperties(n,{href:{value:n.href.replace(/^http/,"udp")},protocol:{value:n.protocol.replace(/^http/,"udp")},origin:{value:n.origin.replace(/^http/,"udp")}}),n},Object.assign(e,pi)})(as);var Yl={exports:{}};(function(e){var t=function(){function i(g,v){return v!=null&&g instanceof v}var n;try{n=Map}catch{n=function(){}}var a;try{a=Set}catch{a=function(){}}var r;try{r=Promise}catch{r=function(){}}function o(g,v,b,w,k){typeof v=="object"&&(b=v.depth,w=v.prototype,k=v.includeNonEnumerable,v=v.circular);var f=[],y=[],E=typeof Buffer<"u";typeof v>"u"&&(v=!0),typeof b>"u"&&(b=1/0);function C(x,A){if(x===null)return null;if(A===0)return x;var R,L;if(typeof x!="object")return x;if(i(x,n))R=new n;else if(i(x,a))R=new a;else if(i(x,r))R=new r(function(V,U){x.then(function(Y){V(C(Y,A-1))},function(Y){U(C(Y,A-1))})});else if(o.__isArray(x))R=[];else if(o.__isRegExp(x))R=new RegExp(x.source,h(x)),x.lastIndex&&(R.lastIndex=x.lastIndex);else if(o.__isDate(x))R=new Date(x.getTime());else{if(E&&Buffer.isBuffer(x))return Buffer.allocUnsafe?R=Buffer.allocUnsafe(x.length):R=new Buffer(x.length),x.copy(R),R;i(x,Error)?R=Object.create(x):typeof w>"u"?(L=Object.getPrototypeOf(x),R=Object.create(L)):(R=Object.create(w),L=w)}if(v){var N=f.indexOf(x);if(N!=-1)return y[N];f.push(x),y.push(R)}i(x,n)&&x.forEach(function(V,U){var Y=C(U,A-1),ne=C(V,A-1);R.set(Y,ne)}),i(x,a)&&x.forEach(function(V){var U=C(V,A-1);R.add(U)});for(var z in x){var K;L&&(K=Object.getOwnPropertyDescriptor(L,z)),!(K&&K.set==null)&&(R[z]=C(x[z],A-1))}if(Object.getOwnPropertySymbols)for(var W=Object.getOwnPropertySymbols(x),z=0;z<W.length;z++){var O=W[z],B=Object.getOwnPropertyDescriptor(x,O);B&&!B.enumerable&&!k||(R[O]=C(x[O],A-1),B.enumerable||Object.defineProperty(R,O,{enumerable:!1}))}if(k)for(var D=Object.getOwnPropertyNames(x),z=0;z<D.length;z++){var J=D[z],B=Object.getOwnPropertyDescriptor(x,J);B&&B.enumerable||(R[J]=C(x[J],A-1),Object.defineProperty(R,J,{enumerable:!1}))}return R}return C(g,b)}o.clonePrototype=function(v){if(v===null)return null;var b=function(){};return b.prototype=v,new b};function s(g){return Object.prototype.toString.call(g)}o.__objToStr=s;function l(g){return typeof g=="object"&&s(g)==="[object Date]"}o.__isDate=l;function u(g){return typeof g=="object"&&s(g)==="[object Array]"}o.__isArray=u;function p(g){return typeof g=="object"&&s(g)==="[object RegExp]"}o.__isRegExp=p;function h(g){var v="";return g.global&&(v+="g"),g.ignoreCase&&(v+="i"),g.multiline&&(v+="m"),v}return o.__getRegExpFlags=h,o}();e.exports&&(e.exports=t)})(Yl);var dp=Yl.exports;const up=kr("simple-websocket"),pp=ns,hp=jl,bo=xr,tn=pi,Zi=typeof tn!="function"?WebSocket:tn,wo=64*1024;let Vl=class extends hp.Duplex{constructor(t={}){if(typeof t=="string"&&(t={url:t}),t=Object.assign({allowHalfOpen:!1},t),super(t),t.url==null&&t.socket==null)throw new Error("Missing required `url` or `socket` option");if(t.url!=null&&t.socket!=null)throw new Error("Must specify either `url` or `socket` option, not both");if(this._id=pp(4).toString("hex").slice(0,7),this._debug("new websocket: %o",t),this.connected=!1,this.destroyed=!1,this._chunk=null,this._cb=null,this._interval=null,t.socket)this.url=t.socket.url,this._ws=t.socket,this.connected=t.socket.readyState===Zi.OPEN;else{this.url=t.url;try{typeof tn=="function"?this._ws=new Zi(t.url,null,{...t,encoding:void 0}):this._ws=new Zi(t.url)}catch(i){bo(()=>this.destroy(i));return}}this._ws.binaryType="arraybuffer",t.socket&&this.connected?bo(()=>this._handleOpen()):this._ws.onopen=()=>this._handleOpen(),this._ws.onmessage=i=>this._handleMessage(i),this._ws.onclose=()=>this._handleClose(),this._ws.onerror=i=>this._handleError(i),this._handleFinishBound=()=>this._handleFinish(),this.once("finish",this._handleFinishBound)}send(t){this._ws.send(t)}destroy(t){this._destroy(t,()=>{})}_destroy(t,i){if(!this.destroyed){if(this._debug("destroy (error: %s)",t&&(t.message||t)),this.readable=this.writable=!1,this._readableState.ended||this.push(null),this._writableState.finished||this.end(),this.connected=!1,this.destroyed=!0,clearInterval(this._interval),this._interval=null,this._chunk=null,this._cb=null,this._handleFinishBound&&this.removeListener("finish",this._handleFinishBound),this._handleFinishBound=null,this._ws){const n=this._ws,a=()=>{n.onclose=null};if(n.readyState===Zi.CLOSED)a();else try{n.onclose=a,n.close()}catch{a()}n.onopen=null,n.onmessage=null,n.onerror=()=>{}}this._ws=null,t&&this.emit("error",t),this.emit("close"),i()}}_read(){}_write(t,i,n){if(this.destroyed)return n(new Error("cannot write after socket is destroyed"));if(this.connected){try{this.send(t)}catch(a){return this.destroy(a)}typeof tn!="function"&&this._ws.bufferedAmount>wo?(this._debug("start backpressure: bufferedAmount %d",this._ws.bufferedAmount),this._cb=n):n(null)}else this._debug("write before connect"),this._chunk=t,this._cb=n}_handleOpen(){if(!(this.connected||this.destroyed)){if(this.connected=!0,this._chunk){try{this.send(this._chunk)}catch(i){return this.destroy(i)}this._chunk=null,this._debug('sent chunk from "write before connect"');const t=this._cb;this._cb=null,t(null)}typeof tn!="function"&&(this._interval=setInterval(()=>this._onInterval(),150),this._interval.unref&&this._interval.unref()),this._debug("connect"),this.emit("connect")}}_handleMessage(t){if(this.destroyed)return;let i=t.data;i instanceof ArrayBuffer&&(i=Buffer.from(i)),this.push(i)}_handleClose(){this.destroyed||(this._debug("on close"),this.destroy())}_handleError(t){this.destroy(new Error(`Error connecting to ${this.url}`))}_handleFinish(){if(this.destroyed)return;const t=()=>{setTimeout(()=>this.destroy(),1e3)};this.connected?t():this.once("connect",t)}_onInterval(){if(!this._cb||!this._ws||this._ws.bufferedAmount>wo)return;this._debug("ending backpressure: bufferedAmount %d",this._ws.bufferedAmount);const t=this._cb;this._cb=null,t(null)}_debug(){const t=[].slice.call(arguments);t[0]="["+this._id+"] "+t[0],up.apply(null,t)}};Vl.WEBSOCKET_SUPPORT=!!Zi;var fp=Vl;const mp=Sr;let gp=class extends mp{constructor(t,i){super(),this.client=t,this.announceUrl=i,this.interval=null,this.destroyed=!1}setInterval(t){t==null&&(t=this.DEFAULT_ANNOUNCE_INTERVAL),clearInterval(this.interval),t&&(this.interval=setInterval(()=>{this.announce(this.client._defaultAnnounceOpts())},t),this.interval.unref&&this.interval.unref())}};var yp=gp;const vp=dp,yt=kr("bittorrent-tracker:websocket-tracker"),bp=Wl,wp=ns,kp=fp,_p=pi,qt=as,Sp=yp,It={},xp=10*1e3,Ep=60*60*1e3,Tp=5*60*1e3,Ap=50*1e3;let ss=class extends Sp{constructor(t,i){super(t,i),yt("new websocket tracker %s",i),this.peers={},this.socket=null,this.reconnecting=!1,this.retries=0,this.reconnectTimer=null,this.expectingResponse=!1,this._openSocket()}announce(t){if(this.destroyed||this.reconnecting)return;if(!this.socket.connected){this.socket.once("connect",()=>{this.announce(t)});return}const i=Object.assign({},t,{action:"announce",info_hash:this.client._infoHashBinary,peer_id:this.client._peerIdBinary});if(this._trackerId&&(i.trackerid=this._trackerId),t.event==="stopped"||t.event==="completed")this._send(i);else{const n=Math.min(t.numwant,5);this._generateOffers(n,a=>{i.numwant=n,i.offers=a,this._send(i)})}}scrape(t){if(this.destroyed||this.reconnecting)return;if(!this.socket.connected){this.socket.once("connect",()=>{this.scrape(t)});return}const n={action:"scrape",info_hash:Array.isArray(t.infoHash)&&t.infoHash.length>0?t.infoHash.map(a=>a.toString("binary")):t.infoHash&&t.infoHash.toString("binary")||this.client._infoHashBinary};this._send(n)}destroy(t=ko){if(this.destroyed)return t(null);this.destroyed=!0,clearInterval(this.interval),clearTimeout(this.reconnectTimer);for(const r in this.peers){const o=this.peers[r];clearTimeout(o.trackerTimeout),o.destroy()}if(this.peers=null,this.socket&&(this.socket.removeListener("connect",this._onSocketConnectBound),this.socket.removeListener("data",this._onSocketDataBound),this.socket.removeListener("close",this._onSocketCloseBound),this.socket.removeListener("error",this._onSocketErrorBound),this.socket=null),this._onSocketConnectBound=null,this._onSocketErrorBound=null,this._onSocketDataBound=null,this._onSocketCloseBound=null,It[this.announceUrl]&&(It[this.announceUrl].consumers-=1),It[this.announceUrl].consumers>0)return t();let i=It[this.announceUrl];delete It[this.announceUrl],i.on("error",ko),i.once("close",t);let n;if(!this.expectingResponse)return a();n=setTimeout(a,qt.DESTROY_TIMEOUT),i.once("data",a);function a(){n&&(clearTimeout(n),n=null),i.removeListener("data",a),i.destroy(),i=null}}_openSocket(){if(this.destroyed=!1,this.peers||(this.peers={}),this._onSocketConnectBound=()=>{this._onSocketConnect()},this._onSocketErrorBound=t=>{this._onSocketError(t)},this._onSocketDataBound=t=>{this._onSocketData(t)},this._onSocketCloseBound=()=>{this._onSocketClose()},this.socket=It[this.announceUrl],this.socket)It[this.announceUrl].consumers+=1,this.socket.connected&&this._onSocketConnectBound();else{const t=new URL(this.announceUrl);let i;this.client._proxyOpts&&(i=t.protocol==="wss:"?this.client._proxyOpts.httpsAgent:this.client._proxyOpts.httpAgent,!i&&this.client._proxyOpts.socksProxy&&(i=new _p.Agent(vp(this.client._proxyOpts.socksProxy),t.protocol==="wss:"))),this.socket=It[this.announceUrl]=new kp({url:this.announceUrl,agent:i}),this.socket.consumers=1,this.socket.once("connect",this._onSocketConnectBound)}this.socket.on("data",this._onSocketDataBound),this.socket.once("close",this._onSocketCloseBound),this.socket.once("error",this._onSocketErrorBound)}_onSocketConnect(){this.destroyed||this.reconnecting&&(this.reconnecting=!1,this.retries=0,this.announce(this.client._defaultAnnounceOpts()))}_onSocketData(t){if(!this.destroyed){this.expectingResponse=!1;try{t=JSON.parse(t)}catch{this.client.emit("warning",new Error("Invalid tracker response"));return}t.action==="announce"?this._onAnnounceResponse(t):t.action==="scrape"?this._onScrapeResponse(t):this._onSocketError(new Error(`invalid action in WS response: ${t.action}`))}}_onAnnounceResponse(t){if(t.info_hash!==this.client._infoHashBinary){yt("ignoring websocket data from %s for %s (looking for %s: reused socket)",this.announceUrl,qt.binaryToHex(t.info_hash),this.client.infoHash);return}if(t.peer_id&&t.peer_id===this.client._peerIdBinary)return;yt("received %s from %s for %s",JSON.stringify(t),this.announceUrl,this.client.infoHash);const i=t["failure reason"];if(i)return this.client.emit("warning",new Error(i));const n=t["warning message"];n&&this.client.emit("warning",new Error(n));const a=t.interval||t["min interval"];a&&this.setInterval(a*1e3);const r=t["tracker id"];if(r&&(this._trackerId=r),t.complete!=null){const s=Object.assign({},t,{announce:this.announceUrl,infoHash:qt.binaryToHex(t.info_hash)});this.client.emit("update",s)}let o;if(t.offer&&t.peer_id&&(yt("creating peer (from remote offer)"),o=this._createPeer(),o.id=qt.binaryToHex(t.peer_id),o.once("signal",s=>{const l={action:"announce",info_hash:this.client._infoHashBinary,peer_id:this.client._peerIdBinary,to_peer_id:t.peer_id,answer:s,offer_id:t.offer_id};this._trackerId&&(l.trackerid=this._trackerId),this._send(l)}),this.client.emit("peer",o),o.signal(t.offer)),t.answer&&t.peer_id){const s=qt.binaryToHex(t.offer_id);o=this.peers[s],o?(o.id=qt.binaryToHex(t.peer_id),this.client.emit("peer",o),o.signal(t.answer),clearTimeout(o.trackerTimeout),o.trackerTimeout=null,delete this.peers[s]):yt(`got unexpected answer: ${JSON.stringify(t.answer)}`)}}_onScrapeResponse(t){t=t.files||{};const i=Object.keys(t);if(i.length===0){this.client.emit("warning",new Error("invalid scrape response"));return}i.forEach(n=>{const a=Object.assign(t[n],{announce:this.announceUrl,infoHash:qt.binaryToHex(n)});this.client.emit("scrape",a)})}_onSocketClose(){this.destroyed||(this.destroy(),this._startReconnectTimer())}_onSocketError(t){this.destroyed||(this.destroy(),this.client.emit("warning",t),this._startReconnectTimer())}_startReconnectTimer(){const t=Math.floor(Math.random()*Tp)+Math.min(Math.pow(2,this.retries)*xp,Ep);this.reconnecting=!0,clearTimeout(this.reconnectTimer),this.reconnectTimer=setTimeout(()=>{this.retries++,this._openSocket()},t),this.reconnectTimer.unref&&this.reconnectTimer.unref(),yt("reconnecting socket in %s ms",t)}_send(t){if(this.destroyed)return;this.expectingResponse=!0;const i=JSON.stringify(t);yt("send %s",i),this.socket.send(i)}_generateOffers(t,i){const n=this,a=[];yt("generating %s offers",t);for(let s=0;s<t;++s)r();o();function r(){const s=wp(20).toString("hex");yt("creating peer (from _generateOffers)");const l=n.peers[s]=n._createPeer({initiator:!0});l.once("signal",u=>{a.push({offer:u,offer_id:qt.hexToBinary(s)}),o()}),l.trackerTimeout=setTimeout(()=>{yt("tracker timeout: destroying peer"),l.trackerTimeout=null,delete n.peers[s],l.destroy()},Ap),l.trackerTimeout.unref&&l.trackerTimeout.unref()}function o(){a.length===t&&(yt("generated %s offers",t),i(a))}}_createPeer(t){const i=this;t=Object.assign({trickle:!1,config:i.client._rtcConfig,wrtc:i.client._wrtc},t);const n=new bp(t);return n.once("error",a),n.once("connect",r),n;function a(o){i.client.emit("warning",new Error(`Connection error: ${o.message}`)),n.destroy()}function r(){n.removeListener("error",a),n.removeListener("connect",r)}}};ss.prototype.DEFAULT_ANNOUNCE_INTERVAL=30*1e3;ss._socketPool=It;function ko(){}var Cp=ss;const Ft=kr("bittorrent-tracker:client"),Lp=Sr,Ip=ru,Rp=au,$p=Wl,Mp=xr,_o=as,So=pi,xo=pi,Pp=Cp;class Pa extends Lp{constructor(t={}){if(super(),!t.peerId)throw new Error("Option `peerId` is required");if(!t.infoHash)throw new Error("Option `infoHash` is required");if(!t.announce)throw new Error("Option `announce` is required");if(!process.browser&&!t.port)throw new Error("Option `port` is required");this.peerId=typeof t.peerId=="string"?t.peerId:t.peerId.toString("hex"),this._peerIdBuffer=Buffer.from(this.peerId,"hex"),this._peerIdBinary=this._peerIdBuffer.toString("binary"),this.infoHash=typeof t.infoHash=="string"?t.infoHash.toLowerCase():t.infoHash.toString("hex"),this._infoHashBuffer=Buffer.from(this.infoHash,"hex"),this._infoHashBinary=this._infoHashBuffer.toString("binary"),Ft("new client %s",this.infoHash),this.destroyed=!1,this._port=t.port,this._getAnnounceOpts=t.getAnnounceOpts,this._rtcConfig=t.rtcConfig,this._userAgent=t.userAgent,this._proxyOpts=t.proxyOpts,this._wrtc=typeof t.wrtc=="function"?t.wrtc():t.wrtc;let i=typeof t.announce=="string"?[t.announce]:t.announce==null?[]:t.announce;i=i.map(r=>(r=r.toString(),r[r.length-1]==="/"&&(r=r.substring(0,r.length-1)),r)),i=Array.from(new Set(i));const n=this._wrtc!==!1&&(!!this._wrtc||$p.WEBRTC_SUPPORT),a=r=>{Mp(()=>{this.emit("warning",r)})};this._trackers=i.map(r=>{let o;try{o=_o.parseUrl(r)}catch{return a(new Error(`Invalid tracker URL: ${r}`)),null}const s=o.port;if(s<0||s>65535)return a(new Error(`Invalid tracker port: ${r}`)),null;const l=o.protocol;return(l==="http:"||l==="https:")&&typeof So=="function"?new So(this,r):l==="udp:"&&typeof xo=="function"?new xo(this,r):(l==="ws:"||l==="wss:")&&n?l==="ws:"&&typeof window<"u"&&window.location.protocol==="https:"?(a(new Error(`Unsupported tracker protocol: ${r}`)),null):new Pp(this,r):(a(new Error(`Unsupported tracker protocol: ${r}`)),null)}).filter(Boolean)}start(t){t=this._defaultAnnounceOpts(t),t.event="started",Ft("send `start` %o",t),this._announce(t),this._trackers.forEach(i=>{i.setInterval()})}stop(t){t=this._defaultAnnounceOpts(t),t.event="stopped",Ft("send `stop` %o",t),this._announce(t)}complete(t){t||(t={}),t=this._defaultAnnounceOpts(t),t.event="completed",Ft("send `complete` %o",t),this._announce(t)}update(t){t=this._defaultAnnounceOpts(t),t.event&&delete t.event,Ft("send `update` %o",t),this._announce(t)}_announce(t){this._trackers.forEach(i=>{i.announce(t)})}scrape(t){Ft("send `scrape`"),t||(t={}),this._trackers.forEach(i=>{i.scrape(t)})}setInterval(t){Ft("setInterval %d",t),this._trackers.forEach(i=>{i.setInterval(t)})}destroy(t){if(this.destroyed)return;this.destroyed=!0,Ft("destroy");const i=this._trackers.map(n=>a=>{n.destroy(a)});Rp(i,t),this._trackers=[],this._getAnnounceOpts=null}_defaultAnnounceOpts(t={}){return t.numwant==null&&(t.numwant=_o.DEFAULT_ANNOUNCE_PEERS),t.uploaded==null&&(t.uploaded=0),t.downloaded==null&&(t.downloaded=0),this._getAnnounceOpts&&(t=Object.assign({},t,this._getAnnounceOpts())),t}}Pa.scrape=(e,t)=>{if(t=Ip(t),!e.infoHash)throw new Error("Option `infoHash` is required");if(!e.announce)throw new Error("Option `announce` is required");const i=Object.assign({},e,{infoHash:Array.isArray(e.infoHash)?e.infoHash[0]:e.infoHash,peerId:Buffer.from("01234567890123456789"),port:6881}),n=new Pa(i);n.once("error",t),n.once("warning",t);let a=Array.isArray(e.infoHash)?e.infoHash.length:1;const r={};return n.on("scrape",o=>{if(a-=1,r[o.infoHash]=o,a===0){n.destroy();const s=Object.keys(r);s.length===1?t(null,r[s[0]]):t(null,r)}}),e.infoHash=Array.isArray(e.infoHash)?e.infoHash.map(o=>Buffer.from(o,"hex")):Buffer.from(e.infoHash,"hex"),n.scrape({infoHash:e.infoHash}),n};var Bp=Pa;const Dp=wl(Bp);var Gl={exports:{}},Oe=Gl.exports={},Et,Tt;function Ba(){throw new Error("setTimeout has not been defined")}function Da(){throw new Error("clearTimeout has not been defined")}(function(){try{typeof setTimeout=="function"?Et=setTimeout:Et=Ba}catch{Et=Ba}try{typeof clearTimeout=="function"?Tt=clearTimeout:Tt=Da}catch{Tt=Da}})();function Jl(e){if(Et===setTimeout)return setTimeout(e,0);if((Et===Ba||!Et)&&setTimeout)return Et=setTimeout,setTimeout(e,0);try{return Et(e,0)}catch{try{return Et.call(null,e,0)}catch{return Et.call(this,e,0)}}}function Np(e){if(Tt===clearTimeout)return clearTimeout(e);if((Tt===Da||!Tt)&&clearTimeout)return Tt=clearTimeout,clearTimeout(e);try{return Tt(e)}catch{try{return Tt.call(null,e)}catch{return Tt.call(this,e)}}}var Pt=[],Ti=!1,oi,qn=-1;function Op(){!Ti||!oi||(Ti=!1,oi.length?Pt=oi.concat(Pt):qn=-1,Pt.length&&Xl())}function Xl(){if(!Ti){var e=Jl(Op);Ti=!0;for(var t=Pt.length;t;){for(oi=Pt,Pt=[];++qn<t;)oi&&oi[qn].run();qn=-1,t=Pt.length}oi=null,Ti=!1,Np(e)}}Oe.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var i=1;i<arguments.length;i++)t[i-1]=arguments[i];Pt.push(new Zl(e,t)),Pt.length===1&&!Ti&&Jl(Xl)};function Zl(e,t){this.fun=e,this.array=t}Zl.prototype.run=function(){this.fun.apply(null,this.array)};Oe.title="browser";Oe.browser=!0;Oe.env={};Oe.argv=[];Oe.version="";Oe.versions={};function zt(){}Oe.on=zt;Oe.addListener=zt;Oe.once=zt;Oe.off=zt;Oe.removeListener=zt;Oe.removeAllListeners=zt;Oe.emit=zt;Oe.prependListener=zt;Oe.prependOnceListener=zt;Oe.listeners=function(e){return[]};Oe.binding=function(e){throw new Error("process.binding is not supported")};Oe.cwd=function(){return"/"};Oe.chdir=function(e){throw new Error("process.chdir is not supported")};Oe.umask=function(){return 0};var zp=Gl.exports;const Hp=wl(zp);globalThis.Buffer||(globalThis.Buffer=ui.Buffer);globalThis.process||(globalThis.process=Hp);const qp=["wss://tracker.openwebtorrent.com","wss://tracker.btorrent.xyz","wss://tracker.webtorrent.dev","wss://tracker.files.fm:7073/announce","wss://spacetrackr.link:443/announce","wss://tracker.fastcast.nz:443/announce"],Fp=160,Ql="cinepulse.decision-room.owner.",Up="cinepulse.decision-room.autoplay";function bi(e=12){const t=new Uint8Array(e);return crypto.getRandomValues(t),Array.from(t,i=>i.toString(16).padStart(2,"0")).join("")}function Ke(e=""){const t=String(e).replace(/\D/g,"");return t.length===6?t:""}function _n(e,t="",i=null){if(!e?.id)return;const n=e.type==="tv"?"tv":"movie";try{sessionStorage.setItem(Up,JSON.stringify({id:String(e.id),type:n,roomCode:Ke(t),season:n==="tv"?Math.max(1,Number(e.season)||1):null,episode:n==="tv"?Math.max(1,Number(e.episode)||1):null,initialSync:i||null,createdAt:Date.now()}))}catch{}window.dispatchEvent(new CustomEvent("cinepulse:decision-room-open"));const a=`#detail?type=${n}&id=${e.id}`;window.location.hash===a?window.dispatchEvent(new Event("hashchange")):window.location.hash=a}async function jp(e){const t=new TextEncoder().encode(`cinepulse-decision-room-v1:${e}`),i=await crypto.subtle.digest("SHA-256",t);return Array.from(new Uint8Array(i).slice(0,20),n=>n.toString(16).padStart(2,"0")).join("")}function Kp(){const e=new Uint32Array(1);return crypto.getRandomValues(e),String(1e5+e[0]%9e5)}function Wp(e){const t=Ke(e);if(t)try{sessionStorage.setItem(`${Ql}${t}`,"1")}catch{}}function Yp(e){const t=Ke(e);if(!t)return!1;try{return sessionStorage.getItem(`${Ql}${t}`)==="1"}catch{return!1}}function Vp(){try{return Ke(new URL(window.location.href).searchParams.get("oda")||"")}catch{return""}}function ec(e){const t=new URL(window.location.href);return t.searchParams.set("oda",Ke(e)),t.toString()}function Gp(){try{const e=new URL(window.location.href);e.searchParams.delete("oda"),history.replaceState(history.state,"",e.toString())}catch{}}function Na(){const e=["Sinemasever","Gece Kuşu","Patlamış Mısır","Film Avcısı","Koltuğunda"],t=bi(2).toUpperCase();return`${e[Math.floor(Math.random()*e.length)]} ${t}`}class Jp{constructor({roomCode:t,nickname:i=Na(),isHost:n=!1}){this.roomCode=Ke(t),this.nickname=String(i||Na()).slice(0,30),this.isHost=!!n,this.selfId=bi(10),this.client=null,this.peers=new Map,this.peerParticipantIds=new WeakMap,this.trackerPeerCount=1,this.announceTimer=null,this.participants=new Map([[this.selfId,{id:this.selfId,nickname:this.nickname,role:this.isHost?"moderator":"participant"}]]),this.listeners=new Set,this.receivedIds=new Set,this.cards=[],this.votes={},this.ratings={},this.suggestions=[],this.syncMode="smooth",this.silentVoting=!1,this.sharedPlayback=null,this.lastPlayerSync=null,this.roomFinish=null,this.chatMessages=[],this.roomSummary=null,this.playbackStartedAt=0,this.roomActivity={reactions:[],chats:[]},this.onPlayerSync=a=>{const r=a.detail;!this.isHost||!r||Ke(r.roomCode)!==this.roomCode||!this.sharedPlayback||String(r.mediaId)!==String(this.sharedPlayback.id)||r.type!==this.sharedPlayback.type||(this.lastPlayerSync=r,this.broadcast({type:"player-sync",sync:r}))},window.addEventListener("cinepulse:player-sync",this.onPlayerSync),this.onRoomFinish=a=>{const r=a.detail;!this.isHost||!r||Ke(r.roomCode)!==this.roomCode||(this.roomFinish=r,this.broadcast({type:"room-finish",finish:r}))},this.onRoomFinishVote=a=>{const r=a.detail;!r||Ke(r.roomCode)!==this.roomCode||!r.optionId||this.broadcast({type:"room-finish-vote",vote:r})},this.onRoomFinishChoice=a=>{const r=a.detail;!this.isHost||!r||Ke(r.roomCode)!==this.roomCode||(this.broadcast({type:"room-finish-choice",choice:r}),this.applyRoomFinishChoice(r))},this.onRoomReaction=a=>{const r=a.detail;if(!r||Ke(r.roomCode)!==this.roomCode||!r.emoji)return;const o={...r,senderId:this.selfId,sentAt:Date.now()};this.recordRoomReaction(o),this.broadcast({type:"room-reaction",reaction:o})},window.addEventListener("cinepulse:room-finish",this.onRoomFinish),window.addEventListener("cinepulse:room-finish-vote",this.onRoomFinishVote),window.addEventListener("cinepulse:room-finish-choice",this.onRoomFinishChoice),window.addEventListener("cinepulse:room-reaction",this.onRoomReaction),this.onRoomChatSend=a=>{const r=a.detail,o=String(r?.text||"").trim().slice(0,240);if(!r||Ke(r.roomCode)!==this.roomCode||!o)return;const s={id:String(r.id||`chat-${Date.now()}-${Math.random().toString(36).slice(2,8)}`),text:o,nickname:this.nickname,senderId:this.selfId,sentAt:Number(r.sentAt)||Date.now(),at:Math.max(0,Number(r.at)||0)};this.chatMessages=[...this.chatMessages,s].slice(-60),this.recordRoomChat(s),this.broadcast({type:"room-chat",chat:s})},window.addEventListener("cinepulse:room-chat-send",this.onRoomChatSend),this.onRoomPlaybackHealth=a=>{const r=a.detail;!r||Ke(r.roomCode)!==this.roomCode||r.senderId===this.selfId||this.broadcast({type:"playback-health",health:{senderId:this.selfId,status:r.status==="buffering"?"buffering":"ready",bufferedAhead:Math.max(0,Number(r.bufferedAhead)||0),reportedAt:Date.now()}})},window.addEventListener("cinepulse:room-playback-health",this.onRoomPlaybackHealth),this.onRoomPlaybackProgress=a=>{const r=a.detail;!r||Ke(r.roomCode)!==this.roomCode||this.broadcast({type:"playback-progress",progress:{senderId:this.selfId,nickname:this.nickname,time:Math.max(0,Number(r.time)||0),playing:!!r.playing,buffering:!!r.buffering,reportedAt:Date.now()}})},window.addEventListener("cinepulse:room-playback-progress",this.onRoomPlaybackProgress),this.onRoomPlaybackCheckpoint=a=>{const r=a.detail;!this.isHost||!r||Ke(r.roomCode)!==this.roomCode||!r.targetId||this.broadcast({type:"playback-checkpoint",checkpoint:{targetId:r.targetId,action:r.action==="resume"?"resume":"hold",mediaId:String(r.mediaId||""),type:r.type==="tv"?"tv":"movie"}})},window.addEventListener("cinepulse:room-playback-checkpoint",this.onRoomPlaybackCheckpoint),this.onRoomPlaybackFinished=a=>{const r=a.detail;!r||Ke(r.roomCode)!==this.roomCode||this.broadcast({type:"playback-finished",finished:{mediaId:String(r.mediaId||""),type:r.type==="tv"?"tv":"movie",season:Math.max(1,Number(r.season)||1),episode:Math.max(1,Number(r.episode)||1),nickname:this.nickname}})},window.addEventListener("cinepulse:room-playback-finished",this.onRoomPlaybackFinished),this.onRoomSummary=a=>{const r=a.detail;if(!this.isHost||!r||Ke(r.roomCode)!==this.roomCode)return;const o=new Map;this.roomActivity.reactions.forEach(p=>o.set(p.emoji,(o.get(p.emoji)||0)+1));const s=Array.from(o.entries()).sort((p,h)=>h[1]-p[1])[0]||null,l=new Map;this.roomActivity.chats.forEach(p=>{const h=Math.floor(Math.max(0,Number(p.at)||0)/60)*60;l.set(h,(l.get(h)||0)+1)});const u=Array.from(l.entries()).sort((p,h)=>h[1]-p[1])[0]||null;this.roomSummary={roomCode:this.roomCode,mediaId:String(r.mediaId||this.sharedPlayback?.id||""),type:r.type==="tv"?"tv":"movie",participants:this.participants.size,watchedSeconds:Math.max(0,Number(r.seconds)||0),topReaction:s?{emoji:s[0],count:s[1]}:null,topTalkSecond:u?u[0]:null,chatCount:this.roomActivity.chats.length},this.broadcast({type:"room-summary",summary:this.roomSummary}),window.dispatchEvent(new CustomEvent("cinepulse:room-summary-remote",{detail:this.roomSummary}))},this.onRoomRhythm=a=>{const r=a.detail;!this.isHost||!r||Ke(r.roomCode)!==this.roomCode||!r.targetId||this.broadcast({type:"room-rhythm",rhythm:r})},window.addEventListener("cinepulse:room-summary",this.onRoomSummary),window.addEventListener("cinepulse:room-rhythm",this.onRoomRhythm),this.destroyed=!1}applyRoomFinishChoice(t){if(this.roomFinish=null,t.action==="open"&&t.card?.id){this.sharedPlayback={id:t.card.id,type:t.card.type==="tv"?"tv":"movie",season:Math.max(1,Number(t.card.season)||1),episode:Math.max(1,Number(t.card.episode)||1)},this.lastPlayerSync=null,this.playbackStartedAt=Date.now(),this.roomSummary=null,this.roomActivity={reactions:[],chats:[]},this.emit(),_n(t.card,this.roomCode);return}t.action==="close"&&(this.sharedPlayback=null,this.lastPlayerSync=null,window.dispatchEvent(new CustomEvent("cinepulse:decision-room-close-player",{detail:{roomCode:this.roomCode}}))),this.emit()}snapshot(){return{roomCode:this.roomCode,nickname:this.nickname,selfId:this.selfId,isHost:this.isHost,peerCount:this.peers.size,trackerPeerCount:this.trackerPeerCount,participants:Array.from(this.participants.values()),cards:this.cards,votes:this.votes,ratings:this.ratings,suggestions:this.suggestions,syncMode:this.syncMode,silentVoting:this.silentVoting,chatMessages:this.chatMessages,roomSummary:this.roomSummary}}subscribe(t){return this.listeners.add(t),t(this.snapshot()),()=>this.listeners.delete(t)}emit(){const t=this.snapshot();if(this.listeners.forEach(i=>i(t)),this.sharedPlayback){const i={roomCode:this.roomCode,isHost:this.isHost,selfId:this.selfId,participants:t.participants,peerCount:t.peerCount,chatMessages:t.chatMessages,syncMode:t.syncMode,silentVoting:t.silentVoting,roomSummary:t.roomSummary};window.__cinepulseDecisionRoomPresence=i,window.dispatchEvent(new CustomEvent("cinepulse:decision-room-presence",{detail:i}))}}async connect(){if(!this.roomCode)throw new Error("Geçersiz oda kodu.");const t=await jp(this.roomCode);this.destroyed||(this.client=new Dp({infoHash:t,peerId:bi(20),announce:qp,port:0,rtcConfig:{iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:global.stun.twilio.com:3478"}]}}),this.client.on("peer",i=>this.attachPeer(i)),this.client.on("update",i=>{const n=Number(i?.complete||0)+Number(i?.incomplete||0);this.trackerPeerCount=Math.max(1,n||1),this.emit()}),this.client.on("warning",()=>this.emit()),this.client.on("error",()=>this.emit()),this.client.start({numwant:5,left:1}),this.announceTimer=window.setInterval(()=>{try{this.client?.update({numwant:5,left:1})}catch{}},15e3),this.emit())}attachPeer(t){let i=t.id||bi(8);const n=()=>{this.destroyed||(i=t.id||i,this.peers.set(i,t),this.sendTo(t,{type:"hello",participant:{id:this.selfId,nickname:this.nickname,role:this.isHost?"moderator":"participant"},wantsState:!0}),this.emit())},a=s=>this.receive(s,t),r=()=>{this.peers.delete(i);const s=this.peerParticipantIds.get(t);s&&(Array.from(this.peers.values()).some(u=>this.peerParticipantIds.get(u)===s)||this.participants.delete(s)),this.emit()},o=()=>r();t.once("connect",n),t.on("data",a),t.once("close",r),t.once("error",o)}sendTo(t,i){try{if(!t||t.destroyed||!t.connected)return;t.send(JSON.stringify({...i,id:bi(10),senderId:this.selfId}))}catch{}}broadcast(t){const i={...t,id:bi(10),senderId:this.selfId};this.remember(i.id),this.peers.forEach(n=>{try{!n.destroyed&&n.connected&&n.send(JSON.stringify(i))}catch{}})}remember(t){this.receivedIds.add(t),this.receivedIds.size>Fp&&this.receivedIds.delete(this.receivedIds.values().next().value)}receive(t,i){let n;try{n=JSON.parse(typeof t=="string"?t:new TextDecoder().decode(t))}catch{return}if(!(!n?.id||this.receivedIds.has(n.id)||n.senderId===this.selfId)){if(this.remember(n.id),n.type==="hello"&&n.participant?.id&&(this.participants.set(n.participant.id,n.participant),this.peerParticipantIds.set(i,n.participant.id),n.wantsState&&(this.sendTo(i,{type:"hello",participant:{id:this.selfId,nickname:this.nickname,role:this.isHost?"moderator":"participant"}}),this.isHost&&this.sendTo(i,{type:"state",cards:this.cards,votes:this.votes,ratings:this.ratings,suggestions:this.suggestions,syncMode:this.syncMode,silentVoting:this.silentVoting,participants:Array.from(this.participants.values()),sharedPlayback:this.sharedPlayback,lastPlayerSync:this.lastPlayerSync,roomFinish:this.roomFinish,chatMessages:this.chatMessages})),this.emit()),n.type==="state"&&Array.isArray(n.cards)&&!this.isHost){if(this.cards=n.cards.slice(0,12),this.votes=n.votes||{},this.ratings=n.ratings||{},this.suggestions=Array.isArray(n.suggestions)?n.suggestions.slice(-20):[],this.syncMode=n.syncMode==="strict"?"strict":"smooth",this.silentVoting=n.silentVoting===!0,Array.isArray(n.participants)&&n.participants.forEach(a=>{a?.id&&a?.nickname&&this.participants.set(a.id,a)}),n.sharedPlayback?.id){const a={id:n.sharedPlayback.id,type:n.sharedPlayback.type==="tv"?"tv":"movie",season:Math.max(1,Number(n.sharedPlayback.season)||1),episode:Math.max(1,Number(n.sharedPlayback.episode)||1)},r=!this.sharedPlayback||String(this.sharedPlayback.id)!==String(a.id)||this.sharedPlayback.type!==a.type||Number(this.sharedPlayback.season)!==Number(a.season)||Number(this.sharedPlayback.episode)!==Number(a.episode);this.sharedPlayback=a,this.lastPlayerSync=n.lastPlayerSync||null,this.roomFinish=n.roomFinish||null,this.chatMessages=Array.isArray(n.chatMessages)?n.chatMessages.slice(-60):[],r?_n(a,this.roomCode,this.lastPlayerSync):this.lastPlayerSync&&window.dispatchEvent(new CustomEvent("cinepulse:player-sync-remote",{detail:this.lastPlayerSync}))}this.emit()}if(n.type==="cards"&&Array.isArray(n.cards)&&!this.isHost&&(this.cards=n.cards.slice(0,12),this.votes=n.votes||{},this.ratings=n.ratings||{},this.emit()),n.type==="suggestions"&&Array.isArray(n.suggestions)&&!this.isHost&&(this.suggestions=n.suggestions.slice(-20),this.emit()),n.type==="sync-mode"&&!this.isHost&&(this.syncMode=n.syncMode==="strict"?"strict":"smooth",this.emit()),n.type==="silent-voting"&&!this.isHost&&(this.silentVoting=n.enabled===!0,this.emit()),n.type==="suggest-card"&&this.isHost&&n.card?.id){const a=`${n.senderId}:${n.card.type}:${n.card.id}`;if(!this.cards.some(o=>String(o.id)===String(n.card.id)&&o.type===n.card.type)&&!this.suggestions.some(o=>o.id===a)){const o=this.participants.get(n.senderId);this.suggestions=[...this.suggestions,{id:a,card:n.card,nickname:o?.nickname||"Katılımcı"}].slice(-20),this.broadcast({type:"suggestions",suggestions:this.suggestions}),this.emit()}}if(n.type==="playback-health"&&this.isHost&&n.health?.senderId&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-health-remote",{detail:{...n.health,roomCode:this.roomCode,syncMode:this.syncMode}})),n.type==="playback-progress"&&this.isHost&&n.progress?.senderId&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-progress-remote",{detail:{...n.progress,roomCode:this.roomCode}})),n.type==="playback-checkpoint"&&n.checkpoint?.targetId&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-checkpoint-remote",{detail:{...n.checkpoint,roomCode:this.roomCode}})),n.type==="playback-finished"&&n.finished?.mediaId&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-finished-remote",{detail:{...n.finished,roomCode:this.roomCode,senderId:n.senderId}})),n.type==="vote"&&n.cardId&&n.senderId&&(this.votes={...this.votes,[n.cardId]:{...this.votes[n.cardId]||{},[n.senderId]:n.vote==="yes"?"yes":"no"}},this.emit()),n.type==="rating"&&n.cardId&&n.senderId){const a=Math.max(1,Math.min(5,Number(n.rating)||0));if(!a)return;this.ratings={...this.ratings,[n.cardId]:{...this.ratings[n.cardId]||{},[n.senderId]:a}},this.emit()}if(n.type==="open"&&n.card?.id&&(this.sharedPlayback={id:n.card.id,type:n.card.type==="tv"?"tv":"movie",season:Math.max(1,Number(n.card.season)||1),episode:Math.max(1,Number(n.card.episode)||1)},this.emit(),_n(n.card,this.roomCode)),n.type==="player-sync"&&n.sync&&!this.isHost){const a=n.sync;if(!this.sharedPlayback||String(a.mediaId)!==String(this.sharedPlayback.id)||a.type!==this.sharedPlayback.type)return;this.lastPlayerSync=a,window.dispatchEvent(new CustomEvent("cinepulse:player-sync-remote",{detail:a}))}if(n.type==="room-finish"&&n.finish&&!this.isHost&&(this.roomFinish=n.finish,window.dispatchEvent(new CustomEvent("cinepulse:room-finish-remote",{detail:n.finish})),this.emit()),n.type==="room-finish-vote"&&n.vote){const a=n.vote;if(this.roomFinish?.id!==a.finishId)return;this.roomFinish={...this.roomFinish,votes:{...this.roomFinish.votes||{},[n.senderId]:a.optionId}},window.dispatchEvent(new CustomEvent("cinepulse:room-finish-vote-remote",{detail:this.roomFinish})),this.emit()}if(n.type==="room-finish-choice"&&n.choice&&!this.isHost&&this.applyRoomFinishChoice(n.choice),n.type==="room-reaction"&&n.reaction&&(this.recordRoomReaction(n.reaction),window.dispatchEvent(new CustomEvent("cinepulse:room-reaction-remote",{detail:n.reaction}))),n.type==="room-chat"&&n.chat?.text){const a={...n.chat,senderId:n.senderId||n.chat.senderId};this.chatMessages=[...this.chatMessages,a].slice(-60),this.recordRoomChat(a),window.dispatchEvent(new CustomEvent("cinepulse:room-chat-remote",{detail:a}))}n.type==="room-summary"&&n.summary&&(this.roomSummary=n.summary,window.dispatchEvent(new CustomEvent("cinepulse:room-summary-remote",{detail:n.summary})),this.emit()),n.type==="room-rhythm"&&n.rhythm?.targetId&&window.dispatchEvent(new CustomEvent("cinepulse:room-rhythm-remote",{detail:{...n.rhythm,roomCode:this.roomCode}}))}}setCards(t){this.isHost&&(this.cards=Array.isArray(t)?t.slice(0,12):[],this.votes={},this.ratings={},this.broadcast({type:"cards",cards:this.cards,votes:this.votes,ratings:this.ratings}),this.emit())}addCard(t){return!this.isHost||!t?.id||this.cards.length>=12||this.cards.some(i=>String(i.id)===String(t.id)&&i.type===t.type)?!1:(this.cards=[...this.cards,t],this.broadcast({type:"cards",cards:this.cards,votes:this.votes,ratings:this.ratings}),this.emit(),!0)}suggest(t){return this.isHost||!t?.id?!1:(this.broadcast({type:"suggest-card",card:t}),!0)}acceptSuggestion(t){if(!this.isHost)return!1;const i=this.suggestions.find(n=>n.id===t);return!i||this.cards.length>=12?!1:(this.suggestions=this.suggestions.filter(n=>n.id!==t),this.cards.some(n=>String(n.id)===String(i.card.id)&&n.type===i.card.type)||(this.cards=[...this.cards,i.card],this.broadcast({type:"cards",cards:this.cards,votes:this.votes,ratings:this.ratings})),this.broadcast({type:"suggestions",suggestions:this.suggestions}),this.emit(),!0)}dismissSuggestion(t){if(!this.isHost)return!1;const i=this.suggestions.filter(n=>n.id!==t);return i.length===this.suggestions.length?!1:(this.suggestions=i,this.broadcast({type:"suggestions",suggestions:this.suggestions}),this.emit(),!0)}setSyncMode(t){this.isHost&&(this.syncMode=t==="strict"?"strict":"smooth",this.broadcast({type:"sync-mode",syncMode:this.syncMode}),this.emit())}setSilentVoting(t){this.isHost&&(this.silentVoting=t===!0,this.broadcast({type:"silent-voting",enabled:this.silentVoting}),this.emit())}removeCard(t){if(!this.isHost||!t)return!1;const i=this.cards.filter(n=>String(n.id)!==String(t));return i.length===this.cards.length?!1:(this.cards=i,delete this.votes[t],delete this.ratings[t],this.broadcast({type:"cards",cards:this.cards,votes:this.votes,ratings:this.ratings}),this.emit(),!0)}vote(t,i){t&&(this.votes={...this.votes,[t]:{...this.votes[t]||{},[this.selfId]:i==="yes"?"yes":"no"}},this.broadcast({type:"vote",cardId:t,vote:i==="yes"?"yes":"no"}),this.emit())}rate(t,i){if(!t)return;const n=Math.max(1,Math.min(5,Number(i)||0));n&&(this.ratings={...this.ratings,[t]:{...this.ratings[t]||{},[this.selfId]:n}},this.broadcast({type:"rating",cardId:t,rating:n}),this.emit())}openForEveryone(t){if(!t?.id)return;this.sharedPlayback={id:t.id,type:t.type==="tv"?"tv":"movie",season:Math.max(1,Number(t.season)||1),episode:Math.max(1,Number(t.episode)||1)},this.playbackStartedAt=Date.now(),this.roomSummary=null,this.roomActivity={reactions:[],chats:[]},this.emit(),this.broadcast({type:"open",card:t});const i=()=>{this.destroyed||!this.sharedPlayback||this.broadcast({type:"state",cards:this.cards,votes:this.votes,ratings:this.ratings,suggestions:this.suggestions,syncMode:this.syncMode,silentVoting:this.silentVoting,participants:Array.from(this.participants.values()),sharedPlayback:this.sharedPlayback,lastPlayerSync:this.lastPlayerSync,roomFinish:this.roomFinish,chatMessages:this.chatMessages})};window.setTimeout(i,350),window.setTimeout(i,1400),_n(t,this.roomCode)}recordRoomReaction(t){t?.emoji&&(this.roomActivity.reactions=[...this.roomActivity.reactions,{emoji:String(t.emoji),at:Math.max(0,Number(t.at)||0),senderId:t.senderId||""}].slice(-240))}recordRoomChat(t){t?.text&&(this.roomActivity.chats=[...this.roomActivity.chats,{at:Math.max(0,Number(t.at)||0),senderId:t.senderId||""}].slice(-120))}destroy(){this.destroyed=!0,window.removeEventListener("cinepulse:player-sync",this.onPlayerSync),window.removeEventListener("cinepulse:room-finish",this.onRoomFinish),window.removeEventListener("cinepulse:room-finish-vote",this.onRoomFinishVote),window.removeEventListener("cinepulse:room-finish-choice",this.onRoomFinishChoice),window.removeEventListener("cinepulse:room-reaction",this.onRoomReaction),window.removeEventListener("cinepulse:room-chat-send",this.onRoomChatSend),window.removeEventListener("cinepulse:room-playback-health",this.onRoomPlaybackHealth),window.removeEventListener("cinepulse:room-playback-progress",this.onRoomPlaybackProgress),window.removeEventListener("cinepulse:room-playback-checkpoint",this.onRoomPlaybackCheckpoint),window.removeEventListener("cinepulse:room-playback-finished",this.onRoomPlaybackFinished),window.removeEventListener("cinepulse:room-summary",this.onRoomSummary),window.removeEventListener("cinepulse:room-rhythm",this.onRoomRhythm),this.announceTimer&&window.clearInterval(this.announceTimer),this.announceTimer=null,this.peers.forEach(t=>{try{t.destroy()}catch{}}),this.peers.clear();try{this.client?.stop()}catch{}try{this.client?.destroy()}catch{}this.listeners.clear()}}let Nt=null,tt=null,Mi=null,Pi=null;function tc(){Ai(!1);const e=document.createElement("div");e.className="decision-room-backdrop",document.body.appendChild(e),Nt=e,e.innerHTML=`
    <section class="decision-room-lobby" role="dialog" aria-modal="true" aria-label="Birlikte Seç">
      <button id="btn-close-decision-room" class="decision-room-close" aria-label="Kapat"><i data-lucide="x"></i></button>
      <div class="decision-room-icon"><i data-lucide="users-round"></i></div>
      <h2>Birlikte Seç</h2>
      <p>Arkadaşlarınla aynı adaylara oy verin, herkesin istediği içeriği birlikte açın.</p>
      <button id="btn-create-decision-room" class="decision-room-create"><i data-lucide="crown"></i> Moderatör Olarak Oda Oluştur</button>
      <small class="decision-room-role-note">Adayları sen yenilersin ve katılan anonim kişileri görürsün.</small>
      <div class="decision-room-join">
        <label for="decision-room-code-input">Katılımcı olarak odaya katıl</label>
        <div><input id="decision-room-code-input" inputmode="numeric" maxlength="6" placeholder="6 haneli kod" autocomplete="one-time-code" /><button id="btn-join-decision-room">Katıl</button></div>
      </div>
    </section>`,e.querySelector("#btn-close-decision-room").onclick=()=>Ai(!1),e.addEventListener("click",i=>{i.target===e&&Ai(!1)}),e.querySelector("#btn-create-decision-room").onclick=()=>or({roomCode:Kp(),isHost:!0});const t=()=>{const i=e.querySelector("#decision-room-code-input"),n=String(i?.value||"").replace(/\D/g,"").slice(0,6);if(n.length!==6){i?.focus(),ee("6 haneli oda kodunu yaz.","warning");return}or({roomCode:n,isHost:!1})};e.querySelector("#btn-join-decision-room").onclick=t,e.querySelector("#decision-room-code-input").onkeydown=i=>{i.key==="Enter"&&t()},G(e)}function ut(e=""){const t=document.createElement("div");return t.textContent=String(e),t.innerHTML}function Xp(e,t){const n=Object.values(t.votes[e.id]||{}).filter(r=>r==="yes").length,a=Math.max(1,t.participants.length);return{yes:n,needed:a,matched:n>=a}}function Sn(e,t){const i=Object.values(t.ratings?.[e.id]||{}).map(Number).filter(r=>r>=1&&r<=5),n=t.ratings?.[e.id]?.[t.selfId]||0;return{average:i.length?i.reduce((r,o)=>r+o,0)/i.length:0,count:i.length,mine:n}}function ic(){return`
    <section id="decision-room-moderator-panel" class="decision-room-moderator-panel" hidden>
      <div><i data-lucide="crown"></i><strong>Moderatör paneli</strong><span>Katılanlar anonim kalır; yalnızca bu odadaki takma adları görünür.</span></div>
      <small id="decision-room-signal-status" class="decision-room-signal-status">Katılım sinyali bekleniyor…</small>
      <div id="decision-room-peers" class="decision-room-peers"></div>
      <section id="decision-room-sync-mode" class="decision-room-sync-mode"><strong>İzleme senkronu</strong><label><input type="radio" name="room-sync-mode" value="smooth" /> Akıcı mod</label><label><input type="radio" name="room-sync-mode" value="strict" /> Herkesle senkron</label><small id="decision-room-sync-help"></small></section>
      <label class="decision-room-silent-toggle"><input id="decision-room-silent-voting" type="checkbox" /> <span><b>Sessiz oylama</b><small>Puanları yalnız moderatör ortak sonuç olarak görür.</small></span></label>
      <section id="decision-room-silent-vote-summary" class="decision-room-silent-vote-summary"></section>
      <section id="decision-room-suggestions" class="decision-room-suggestions"></section>
      <form id="decision-room-content-form" class="decision-room-content-form"><label for="decision-room-content-search">Film veya dizi ekle</label><div><input id="decision-room-content-search" minlength="2" placeholder="İçerik ara" /><button type="submit"><i data-lucide="search"></i> Ara</button></div></form>
      <div id="decision-room-content-results" class="decision-room-content-results"></div>
    </section>
    <section id="decision-room-suggestion-panel" class="decision-room-suggestion-panel" hidden>
      <strong>İçerik öner</strong><small>Önerin moderatörün onayına düşer.</small>
      <form id="decision-room-suggestion-form" class="decision-room-content-form"><div><input id="decision-room-suggestion-search" minlength="2" placeholder="Film veya dizi ara" /><button type="submit"><i data-lucide="send"></i> Öner</button></div></form>
      <div id="decision-room-suggestion-results" class="decision-room-content-results"></div>
    </section>`}function nc(e,t,i=""){const n=e.querySelector("#decision-room-status"),a=e.querySelector("#decision-room-peers"),r=e.querySelector("#decision-room-member-count"),o=e.querySelector("#decision-room-moderator-panel"),s=e.querySelector("#decision-room-signal-status"),l=e.querySelector("#decision-room-suggestion-panel"),u=e.querySelector("#decision-room-suggestions"),p=e.querySelector("#decision-room-silent-vote-summary"),h=e.querySelector("#decision-room-sync-mode"),g=e.querySelector("#decision-room-silent-voting"),v=e.querySelector("#decision-room-deck"),b=e.querySelector("#decision-room-link");n&&(n.textContent=i||(t.peerCount?"Arkadaşların bağlandı, oylar anlık geliyor.":"Oda eşleştiriliyor. Arkadaşına bağlantıyı gönder."));const w=Math.max(t.participants.length,t.trackerPeerCount||1);if(r&&(r.textContent=`${w} kişi`),o&&(o.hidden=!t.isHost),l&&(l.hidden=t.isHost),s&&t.isHost&&(s.textContent=w>t.participants.length?`${w} kişi tracker tarafından görüldü; doğrudan bağlantı hazırlanıyor.`:`${w} kişi aktif bağlantıda.`),a&&(a.innerHTML=t.isHost?t.participants.map(k=>`<span class="decision-room-person ${k.role==="moderator"?"is-moderator":""}"><i data-lucide="${k.role==="moderator"?"crown":"circle-user-round"}"></i>${ut(k.nickname)}${k.id===t.selfId?" (Sen)":""}</span>`).join(""):""),b&&(b.value=ec(t.roomCode)),h&&t.isHost){const k=t.syncMode==="strict";h.querySelector('input[value="smooth"]').checked=!k,h.querySelector('input[value="strict"]').checked=k;const f=h.querySelector("#decision-room-sync-help");f&&(f.textContent=k?"Yavaş bağlantı buffer’a düşünce herkes kısa süre bekler; süreler birlikte kalır.":"İlk açılışta en fazla 2 dakika fark için bir kez hizalar. Moderatörün oynat/duraklat ve sarma komutları herkese gider; otomatik durum paketleri buffer’ı bozmaz. Fark 1,5 dakikaya çıkarsa geride veya önde kalan taraf kısa süre bekler, diğeri yaklaşınca devam eder."),h.querySelectorAll('input[name="room-sync-mode"]').forEach(y=>{y.onchange=()=>tt?.setSyncMode(y.value)})}if(g&&t.isHost&&(g.checked=t.silentVoting===!0,g.onchange=()=>tt?.setSilentVoting(g.checked)),u&&t.isHost&&(u.innerHTML=t.suggestions?.length?`<strong>Katılımcı önerileri</strong>${t.suggestions.map(k=>`<div class="decision-room-suggestion"><span><b>${ut(k.card.title||k.card.name||"İsimsiz içerik")}</b><small>${ut(k.nickname)} önerdi</small></span><button data-accept-suggestion="${ut(k.id)}">Ekle</button><button data-dismiss-suggestion="${ut(k.id)}" aria-label="Reddet">×</button></div>`).join("")}`:"",u.querySelectorAll("[data-accept-suggestion]").forEach(k=>{k.onclick=()=>tt?.acceptSuggestion(k.dataset.acceptSuggestion)}),u.querySelectorAll("[data-dismiss-suggestion]").forEach(k=>{k.onclick=()=>tt?.dismissSuggestion(k.dataset.dismissSuggestion)})),p&&t.isHost&&t.silentVoting){const k=t.cards.map(f=>({card:f,rating:Sn(f,t)})).filter(f=>f.rating.count>0).sort((f,y)=>y.rating.average-f.rating.average||y.rating.count-f.rating.count).slice(0,3);p.innerHTML=k.length?`<strong><i data-lucide="shield-check"></i> Sessiz oylama özeti</strong>${k.map(({card:f,rating:y},E)=>`<div><b>${E+1}</b><span>${ut(f.title||f.name||"İsimsiz içerik")}</span><em>★ ${y.average.toFixed(1)} · ${y.count} gizli oy</em></div>`).join("")}`:'<strong><i data-lucide="shield-check"></i> Sessiz oylama</strong><small>Katılımcıların yıldızları yalnızca burada ortak sonuç olarak görünür.</small>'}else p&&(p.innerHTML="");if(v){if(!t.cards.length)v.innerHTML='<div class="decision-room-empty"><i data-lucide="sparkles"></i><strong>Adaylar hazırlanıyor</strong><span>Oda sahibi ortak izleme listesi oluşturuyor.</span></div>';else{const k=t.isHost&&t.silentVoting?[...t.cards].sort((f,y)=>Sn(y,t).average-Sn(f,t).average):t.cards;v.innerHTML=k.map(f=>{const y=f.title||f.name||"İsimsiz içerik",E=f.type==="tv"?`Dizi · S${Math.max(1,Number(f.season)||1)} B${Math.max(1,Number(f.episode)||1)}`:"Film",C=Xp(f,t),x=t.votes[f.id]?.[t.selfId],A=Sn(f,t),R=[1,2,3,4,5].map(L=>`<button data-room-rating="${L}" data-card-id="${f.id}" class="${A.mine>=L?"active-star":""}" aria-label="${L} yıldız"><i data-lucide="star"></i></button>`).join("");return`<article class="decision-room-card ${C.matched?"matched":""}">
          <img src="${st(f.poster_path,Ze.POSTER_SMALL)}" alt="" loading="lazy" />
          <div class="decision-room-card-body">
            <span>${E} · ★ ${(Number(f.vote_average)||0).toFixed(1)}</span>
            <strong>${ut(y)}</strong>
            <small>${C.matched?"Herkes izlemek istiyor!":`${C.yes}/${C.needed} kişi izlemek istiyor`}</small>
            <div class="decision-room-rating"><span>${t.silentVoting?t.isHost?A.count?`Gizli puan ${A.average.toFixed(1)} · ${A.count} oy`:"Gizli oy bekleniyor":A.mine?"Puanın kaydedildi":"Gizli puan ver":A.count?`Ortak puan ${A.average.toFixed(1)} · ${A.count} oy`:"Puan ver"}</span><div>${R}</div></div>
            <div class="decision-room-votes">
              <button data-room-vote="yes" data-card-id="${f.id}" class="${x==="yes"?"active-yes":""}"><i data-lucide="heart"></i> İzle</button>
              <button data-room-vote="no" data-card-id="${f.id}" class="${x==="no"?"active-no":""}"><i data-lucide="skip-forward"></i> Geç</button>
              ${C.matched?`<button data-room-open="${f.id}" class="decision-room-open"><i data-lucide="play"></i> Birlikte Aç</button>`:""}
              ${t.isHost?`<button data-room-remove="${f.id}" class="decision-room-remove" aria-label="${ut(y)} içeriğini odadan kaldır"><i data-lucide="trash-2"></i> Kaldır</button>`:""}
            </div>
          </div>
        </article>`}).join("")}v.querySelectorAll("[data-room-vote]").forEach(k=>{k.onclick=()=>tt?.vote(k.dataset.cardId,k.dataset.roomVote)}),v.querySelectorAll("[data-room-rating]").forEach(k=>{k.onclick=()=>tt?.rate(k.dataset.cardId,k.dataset.roomRating)}),v.querySelectorAll("[data-room-open]").forEach(k=>{k.onclick=()=>{const f=t.cards.find(y=>String(y.id)===k.dataset.roomOpen);f&&tt?.openForEveryone(f)}}),v.querySelectorAll("[data-room-remove]").forEach(k=>{k.onclick=()=>{tt?.removeCard(k.dataset.roomRemove)&&ee("İçerik odadan kaldırıldı.","success")}})}G(e)}function sr(e){return{id:e.id,type:e.type||e.media_type||(e.first_air_date?"tv":"movie"),title:e.title,name:e.name,poster_path:e.poster_path,vote_average:e.vote_average,season:e.type==="tv"||e.media_type==="tv"?Math.max(1,Number(e.season)||1):null,episode:e.type==="tv"||e.media_type==="tv"?Math.max(1,Number(e.episode)||1):null}}function rc(e,t){const i=e.querySelector("#decision-room-content-form"),n=e.querySelector("#decision-room-content-search"),a=e.querySelector("#decision-room-content-results");if(!i||!n||!a||!t.isHost)return;let r=null,o=0;const s=async()=>{const l=n.value.trim();if(l.length<2){a.innerHTML="";return}const u=++o;a.innerHTML='<span class="decision-room-search-status">Aranıyor…</span>';const p=await Za(l).catch(()=>[]);if(u!==o||n.value.trim()!==l)return;const h=p.filter(g=>g?.id&&(g.type==="movie"||g.type==="tv")).slice(0,5);a.innerHTML=h.length?h.map(g=>{const v=sr(g),b=v.type==="tv"?'<span class="decision-room-episode-choice" aria-label="Bölüm seçimi"><label>Sezon <input data-add-season type="number" min="1" value="1" inputmode="numeric" /></label><label>Bölüm <input data-add-episode type="number" min="1" value="1" inputmode="numeric" /></label></span>':"";return`<div class="decision-room-search-result"><button type="button" data-add-room-card="${v.id}" data-add-room-type="${v.type}" title="Odaya ekle"><img src="${st(v.poster_path,Ze.POSTER_SMALL)}" alt="" /><span><strong>${ut(v.title||v.name||"İsimsiz içerik")}</strong><small>${v.type==="tv"?"Dizi":"Film"} · ★ ${(Number(v.vote_average)||0).toFixed(1)}</small></span><i data-lucide="plus"></i></button>${b}</div>`}).join(""):'<span class="decision-room-search-status">Sonuç bulunamadı.</span>',a.querySelectorAll("[data-add-room-card]").forEach(g=>{g.onclick=()=>{const v=h.find(f=>String(f.id)===g.dataset.addRoomCard&&(f.type||f.media_type)===g.dataset.addRoomType);if(!v)return;const b=g.closest(".decision-room-search-result"),w=Number(b?.querySelector("[data-add-season]")?.value)||1,k=Number(b?.querySelector("[data-add-episode]")?.value)||1;t.addCard(sr({...v,season:w,episode:k}))?(n.value="",a.innerHTML="",ee("İçerik odaya eklendi.","success")):ee("Bu içerik zaten listede veya oda dolu.","warning")}}),G(a)};i.onsubmit=l=>{l.preventDefault(),window.clearTimeout(r),s()},n.oninput=()=>{if(window.clearTimeout(r),n.value.trim().length<2){o+=1,a.innerHTML="";return}r=window.setTimeout(s,220)}}function ac(e,t){const i=e.querySelector("#decision-room-suggestion-form"),n=e.querySelector("#decision-room-suggestion-search"),a=e.querySelector("#decision-room-suggestion-results");if(!i||!n||!a||t.isHost)return;let r=null,o=0;const s=async()=>{const l=n.value.trim();if(l.length<2)return;const u=++o;a.innerHTML='<span class="decision-room-search-status">Aranıyor…</span>';const p=await Za(l).catch(()=>[]);if(u!==o||n.value.trim()!==l)return;const h=p.filter(g=>g?.id&&(g.type==="movie"||g.type==="tv")).slice(0,5);a.innerHTML=h.map(g=>`<div class="decision-room-search-result"><button type="button" data-suggest-card="${g.id}" data-suggest-type="${g.type||g.media_type}"><img src="${st(g.poster_path,Ze.POSTER_SMALL)}" alt="" /><span><strong>${ut(g.title||g.name||"İsimsiz içerik")}</strong><small>${(g.type||g.media_type)==="tv"?"Dizi":"Film"} · Moderatöre öner</small></span><i data-lucide="send"></i></button></div>`).join("")||'<span class="decision-room-search-status">Sonuç bulunamadı.</span>',a.querySelectorAll("[data-suggest-card]").forEach(g=>{g.onclick=()=>{const v=h.find(b=>String(b.id)===g.dataset.suggestCard&&String(b.type||b.media_type)===g.dataset.suggestType);!v||!t.suggest(sr(v))||(n.value="",a.innerHTML="",ee("Önerin moderatöre gönderildi.","success"))}}),G(a)};i.onsubmit=l=>{l.preventDefault(),window.clearTimeout(r),s()},n.oninput=()=>{if(window.clearTimeout(r),n.value.trim().length<2){o+=1,a.innerHTML="";return}r=window.setTimeout(s,220)}}async function sc(e,t){const i=t.querySelector("#decision-room-status");i&&(i.textContent="Ortak adaylar hazırlanıyor…");try{const a=(await ol("all","week")||[]).filter(r=>r?.id&&(r.media_type==="movie"||r.media_type==="tv"||r.type==="movie"||r.type==="tv")).slice(0,8).map(sr);if(!a.length)throw new Error("Aday bulunamadı.");e.setCards(a)}catch{i&&(i.textContent="Adaylar şu an yüklenemedi. Biraz sonra yeniden dene.")}}async function or({roomCode:e=Vp(),isHost:t=!1}={}){if(!e){tc();return}Ai(!1);const i=e;t&&Wp(i);const n=!!(t||Yp(i)),a=Na(),r=document.createElement("div");if(r.id="decision-room-modal-root",r.className="decision-room-backdrop",document.body.appendChild(r),Nt=r,n)try{history.replaceState(history.state,"",ec(i))}catch{}r.innerHTML=`
    <section class="decision-room-dialog" role="dialog" aria-modal="true" aria-label="Ortak Karar Odası">
      <button id="btn-close-decision-room" class="decision-room-close" aria-label="Kapat"><i data-lucide="x"></i></button>
      <header class="decision-room-header">
        <div class="decision-room-icon"><i data-lucide="users-round"></i></div>
        <div><h2>Birlikte Seç</h2><p>Herkesin istediği içeriği birlikte bulun.</p></div>
      </header>
      <div class="decision-room-code-panel">
        <span>ODA KODU</span>
        <strong id="decision-room-code">${ut(i)}</strong>
        <button id="btn-copy-decision-room"><i data-lucide="copy"></i> Kodu Kopyala</button>
        <small>Arkadaşın “Birlikte Seç” ekranında bu kodu yazsın.</small>
      </div>
      <div class="decision-room-live"><span class="decision-room-live-dot"></span><span id="decision-room-status">Oda hazırlanıyor…</span><strong id="decision-room-member-count" class="decision-room-member-count">1 kişi</strong></div>
      ${ic()}
      <div id="decision-room-deck" class="decision-room-deck"></div>
      <footer class="decision-room-footer"><span>Oda kapanınca oylar silinir.</span><button id="btn-refresh-decision-cards"><i data-lucide="refresh-cw"></i> Yeni adaylar</button></footer>
    </section>`;const o=()=>Ai(!0);r.querySelector("#btn-close-decision-room").addEventListener("click",o),r.addEventListener("click",u=>{u.target===r&&o()});const s=()=>oc();window.addEventListener("cinepulse:decision-room-open",s,{once:!0}),Pi=()=>window.removeEventListener("cinepulse:decision-room-open",s);const l=new Jp({roomCode:i,nickname:a,isHost:n});tt=l,Mi=l.subscribe(u=>nc(r,u)),await l.connect(),!(tt!==l||Nt!==r)&&(rc(r,l),ac(r,l),r.querySelector("#btn-copy-decision-room").onclick=async()=>{try{await navigator.clipboard.writeText(i),ee("Oda kodu kopyalandı.","success")}catch{const p=r.querySelector("#decision-room-code"),h=document.createRange();h.selectNodeContents(p),window.getSelection()?.removeAllRanges(),window.getSelection()?.addRange(h),document.execCommand("copy"),window.getSelection()?.removeAllRanges(),ee("Oda kodu kopyalandı.","success")}},r.querySelector("#btn-refresh-decision-cards").onclick=()=>sc(tt,r),G(r))}function Ai(e=!0){Pi?.(),Pi=null,Mi?.(),Mi=null,tt?.destroy(),tt=null,Nt?.remove(),Nt=null,e&&Gp()}function Of(){if(Nt)return;if(!tt){tc();return}const e=tt,t=document.createElement("div");t.id="decision-room-modal-root",t.className="decision-room-backdrop",document.body.appendChild(t),Nt=t,t.innerHTML=`
    <section class="decision-room-dialog" role="dialog" aria-modal="true" aria-label="Ortak Karar Odası">
      <button id="btn-close-decision-room" class="decision-room-close" aria-label="Kapat"><i data-lucide="x"></i></button>
      <header class="decision-room-header"><div class="decision-room-icon"><i data-lucide="users-round"></i></div><div><h2>Birlikte Seç</h2><p>Odan hâlâ açık. Adayları ve katılımcıları buradan gör.</p></div></header>
      <div class="decision-room-code-panel"><span>ODA KODU</span><strong id="decision-room-code">${ut(e.roomCode)}</strong><button id="btn-copy-decision-room"><i data-lucide="copy"></i> Kodu Kopyala</button><small>Arkadaşın “Birlikte Seç” ekranında bu kodu yazsın.</small></div>
      <div class="decision-room-live"><span class="decision-room-live-dot"></span><span id="decision-room-status">Odaya dönüldü.</span><strong id="decision-room-member-count" class="decision-room-member-count">1 kişi</strong></div>
      ${ic()}
      <div id="decision-room-deck" class="decision-room-deck"></div>
      <footer class="decision-room-footer"><span>Oda kapanınca oylar silinir.</span><button id="btn-refresh-decision-cards"><i data-lucide="refresh-cw"></i> Yeni adaylar</button></footer>
    </section>`;const i=()=>Ai(!0);t.querySelector("#btn-close-decision-room").onclick=i,t.addEventListener("click",a=>{a.target===t&&i()});const n=()=>oc();window.addEventListener("cinepulse:decision-room-open",n,{once:!0}),Pi=()=>window.removeEventListener("cinepulse:decision-room-open",n),Mi=e.subscribe(a=>nc(t,a)),rc(t,e),ac(t,e),t.querySelector("#btn-copy-decision-room").onclick=async()=>{try{await navigator.clipboard.writeText(e.roomCode),ee("Oda kodu kopyalandı.","success")}catch{ee(`Oda kodu: ${e.roomCode}`,"info")}},t.querySelector("#btn-refresh-decision-cards").onclick=()=>sc(e,t),G(t)}function oc(){Pi?.(),Pi=null,Mi?.(),Mi=null,Nt?.remove(),Nt=null}function Zp(e="home"){const t=hn(),i=bl(),n=t.isKid;return`
    <!-- ================================================================
         TOP NAVBAR
    ================================================================ -->
    <nav class="navbar" id="main-navbar">
      <div class="nav-container">

        <!-- Left: Brand + Desktop Primary Links -->
        <div class="nav-left-group">
          <a href="#home" class="nav-brand" id="nav-brand-logo" title="CinePulse Studio">
            <div class="brand-logo-icon">
              <i data-lucide="clapperboard" style="width:17px;height:17px;color:#fff;"></i>
            </div>
            <span class="brand-name">Cine<span class="brand-highlight">Pulse</span></span>
          </a>

          <!-- Desktop Primary Nav Links -->
          <ul class="nav-links desktop-nav-links">
            ${n?`
              <li><a href="#home" class="nav-link ${e==="home"?"active":""}">Ana Sayfa</a></li>
              <li><a href="#movies" class="nav-link ${e==="movies"?"active":""}">Animasyonlar</a></li>
              <li><a href="#series" class="nav-link ${e==="series"?"active":""}">Çizgi Diziler</a></li>
              <li><a href="#anime" class="nav-link ${e==="anime"?"active":""}">Anime</a></li>
            `:`
              <li><a href="#home" class="nav-link ${e==="home"?"active":""}">Ana Sayfa</a></li>

              <!-- Evren Hub Trigger – everything else lives here -->
              <li class="nav-hub-li" id="nav-hub-li">
                <button type="button" id="btn-desktop-hub" class="nav-link nav-link-hub-trigger" aria-haspopup="true" aria-expanded="false">
                  <i data-lucide="sparkles" style="width:13px;height:13px;color:#a855f7;"></i>
                  <span>Evren</span>
                  <i data-lucide="chevron-down" class="hub-caret" style="width:11px;height:11px;"></i>
                </button>

                <!-- Mega Dropdown Panel -->
                <div class="hub-mega-dropdown" id="hub-mega-dropdown" role="menu">
                  <div class="hub-mega-inner">

                    <!-- Col 1: Main content -->
                    <div class="hub-mega-col">
                      <div class="hub-mega-section-label">İÇERİK</div>
                      <a href="#movies" class="hub-mega-item hub-nav-trigger">
                        <div class="hub-mega-icon" style="background:rgba(2,132,199,.18);color:#38bdf8;">
                          <i data-lucide="film" style="width:15px;height:15px;"></i>
                        </div>
                        <div>
                          <div class="hub-mega-item-title">Filmler</div>
                          <div class="hub-mega-item-sub">Yerli & Yabancı Gişe</div>
                        </div>
                        <span class="hub-mega-badge" style="background:rgba(2,132,199,.2);color:#38bdf8;">4K UHD</span>
                      </a>
                      <a href="#series" class="hub-mega-item hub-nav-trigger">
                        <div class="hub-mega-icon" style="background:rgba(245,158,11,.15);color:#f59e0b;">
                          <i data-lucide="tv" style="width:15px;height:15px;"></i>
                        </div>
                        <div>
                          <div class="hub-mega-item-title">Diziler</div>
                          <div class="hub-mega-item-sub">Popüler & Tüm Sezonlar</div>
                        </div>
                        <span class="hub-mega-badge" style="background:rgba(245,158,11,.15);color:#f59e0b;">TREND</span>
                      </a>
                      <a href="#dramas" class="hub-mega-item hub-nav-trigger">
                        <div class="hub-mega-icon" style="background:rgba(168,85,247,.15);color:#c084fc;">
                          <i data-lucide="clapperboard" style="width:15px;height:15px;"></i>
                        </div>
                        <div>
                          <div class="hub-mega-item-title">Kısa Diziler</div>
                          <div class="hub-mega-item-sub">DramaBox & ReelShort</div>
                        </div>
                        <span class="hub-mega-badge" style="background:rgba(168,85,247,.15);color:#c084fc;">REEL</span>
                      </a>
                    </div>

                    <!-- Divider -->
                    <div class="hub-mega-divider"></div>

                    <!-- Col 2: Genres -->
                    <div class="hub-mega-col">
                      <div class="hub-mega-section-label">TÜRLER</div>
                      <a href="#anime" class="hub-mega-item hub-nav-trigger">
                        <div class="hub-mega-icon" style="background:rgba(56,189,248,.15);color:#38bdf8;">
                          <i data-lucide="sparkles" style="width:15px;height:15px;"></i>
                        </div>
                        <div>
                          <div class="hub-mega-item-title">Anime Dünyası</div>
                          <div class="hub-mega-item-sub">Shonen, Seinen</div>
                        </div>
                      </a>
                      <a href="#cartoons" class="hub-mega-item hub-nav-trigger">
                        <div class="hub-mega-icon" style="background:rgba(245,158,11,.15);color:#f59e0b;">
                          <i data-lucide="palette" style="width:15px;height:15px;"></i>
                        </div>
                        <div>
                          <div class="hub-mega-item-title">Çizgi Diziler</div>
                          <div class="hub-mega-item-sub">Nostalji & Animasyon</div>
                        </div>
                      </a>
                      <a href="#documentary" class="hub-mega-item hub-nav-trigger">
                        <div class="hub-mega-icon" style="background:rgba(16,185,129,.15);color:#10b981;">
                          <i data-lucide="book-open" style="width:15px;height:15px;"></i>
                        </div>
                        <div>
                          <div class="hub-mega-item-title">Belgesel</div>
                          <div class="hub-mega-item-sub">Bilim, Doğa & Tarih</div>
                        </div>
                      </a>
                      <a href="#discover" class="hub-mega-item hub-nav-trigger">
                        <div class="hub-mega-icon" style="background:rgba(99,102,241,.15);color:#818cf8;">
                          <i data-lucide="sliders-horizontal" style="width:15px;height:15px;"></i>
                        </div>
                        <div>
                          <div class="hub-mega-item-title">Detaylı Keşif</div>
                          <div class="hub-mega-item-sub">Yıl, Tür & Filtreler</div>
                        </div>
                      </a>
                    </div>

                    <!-- Divider -->
                    <div class="hub-mega-divider"></div>

                    <!-- Col 3: Tools -->
                    <div class="hub-mega-col">
                      <div class="hub-mega-section-label">ARAÇLAR</div>
                      <button type="button" id="btn-hub-random-spin" class="hub-mega-item hub-tool-btn">
                        <div class="hub-mega-icon" style="background:rgba(245,158,11,.15);color:#fbbf24;">
                          <i data-lucide="dices" style="width:15px;height:15px;"></i>
                        </div>
                        <div>
                          <div class="hub-mega-item-title">Şanslı Çark</div>
                          <div class="hub-mega-item-sub">Rastgele yapım seç</div>
                        </div>
                      </button>
                      <a href="https://caca1403.github.io/dizionerisistemi/" target="_blank" rel="noopener noreferrer" id="btn-hub-series-recommend" class="hub-mega-item hub-tool-btn" aria-label="SÉRA Dizi Öneri Sistemi'ni aç">
                        <div class="hub-mega-icon" style="background:rgba(99,102,241,.15);color:#a5b4fc;">
                          <i data-lucide="wand-2" style="width:15px;height:15px;"></i>
                        </div>
                        <div>
                          <div class="hub-mega-item-title">SÉRA Dizi Öneri Sistemi ↗</div>
                          <div class="hub-mega-item-sub">SÉRA uygulamasını aç</div>
                        </div>
                      </a>
                      <button type="button" id="btn-hub-trakt" class="hub-mega-item hub-tool-btn">
                        <div class="hub-mega-icon" style="background:rgba(237,28,36,.15);color:#ed1c24;">
                          <i data-lucide="tv" style="width:15px;height:15px;"></i>
                        </div>
                        <div>
                          <div class="hub-mega-item-title">Trakt.tv Eşitleme</div>
                          <div class="hub-mega-item-sub">İzleme geçmişi & Scrobble</div>
                        </div>
                      </button>
                      <a href="https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk" target="_blank" rel="noopener noreferrer" id="btn-hub-apk" class="hub-mega-item hub-tool-btn" aria-label="CinePulse Android APK İndir">
                        <div class="hub-mega-icon" style="background:rgba(16,185,129,.15);color:#10b981;">
                          <i data-lucide="smartphone" style="width:15px;height:15px;"></i>
                        </div>
                        <div>
                          <div class="hub-mega-item-title">Android APK İndir</div>
                          <div class="hub-mega-item-sub">Telefona doğrudan kur</div>
                        </div>
                      </a>
                    </div>

                  </div>
                </div>
              </li>
            `}
          </ul>
        </div>

        <!-- Right: Primary Actions always visible -->
        <div class="nav-actions">
          ${n?`
            <a href="#library" class="btn-nav-action-pill desktop-only ${e==="library"?"active-pill":""}">
              <i data-lucide="bookmark" style="width:13px;height:13px;"></i>
              <span>Listem</span>
            </a>
          `:`
            <!-- Canlı TV – always visible desktop pill -->
            <a href="#livetv" class="btn-nav-live desktop-only ${e==="livetv"?"active":""}" title="Canlı TV">
              <span class="live-dot-pulse"></span>
              <span>CANLI</span>
            </a>

            <!-- Birlikte – always visible desktop pill -->
            <button data-open-decision-room class="btn-nav-action-pill desktop-only" title="Birlikte Seç">
              <i data-lucide="users-round" style="width:13px;height:13px;"></i>
              <span>Birlikte</span>
            </button>

            <!-- Listem – always visible desktop pill -->
            <a href="#library" class="btn-nav-action-pill desktop-only ${e==="library"?"active-pill":""}" title="Listem">
              <i data-lucide="bookmark" style="width:13px;height:13px;"></i>
              <span>Listem</span>
            </a>
          `}

          <!-- Desktop Search Box -->
          <div class="search-box desktop-search-box desktop-only">
            <i data-lucide="search" class="search-icon"></i>
            <input type="text" id="nav-search-input" class="search-input" placeholder="Ara..." autocomplete="off" />
            <span class="search-kbd">⌘K</span>
            <div id="search-overlay" class="search-results-overlay glass-panel hidden"></div>
          </div>

          <!-- Notification Bell -->
          <button id="btn-nav-notifications" class="btn-action-icon btn-nav-bell" title="Bildirimler">
            <i data-lucide="bell" style="width:16px;height:16px;"></i>
            <span id="nav-notif-badge" class="nav-notif-dot ${i>0?"":"hidden"}">${i}</span>
          </button>

          <!-- Profile Avatar -->
          <button id="btn-nav-profile" class="btn-nav-avatar" title="Profil: ${t.name}">
            <div class="nav-avatar-circle" style="border-color:${t.color||"#f59e0b"};background:${t.color||"#f59e0b"}22;">
              <i data-lucide="${t.avatar||(n?"smile":"user")}" style="width:15px;height:15px;color:${t.color||"#f59e0b"};"></i>
            </div>
          </button>

          <!-- Mobile: search toggle -->
          <button id="btn-mobile-search-toggle" class="btn-action-icon mobile-only" aria-label="Ara">
            <i data-lucide="search" style="width:18px;height:18px;"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Expandable Search Row -->
      <div id="mobile-search-row" class="mobile-search-row glass-panel hidden">
        <div class="mobile-search-input-wrapper">
          <i data-lucide="search" class="search-icon"></i>
          <input type="text" id="mobile-search-input" class="mobile-search-input" placeholder="Dizi, film veya kısa dizi ara..." autocomplete="off" />
          <button id="btn-mobile-search-close" class="btn-icon"><i data-lucide="x"></i></button>
        </div>
        <div id="mobile-search-overlay" class="search-results-overlay glass-panel hidden"></div>
      </div>
    </nav>

    <!-- ================================================================
         MOBILE BOTTOM DOCK
         Items: Ana Sayfa | Canlı | ✦Evren | Birlikte | Listem
    ================================================================ -->
    <div class="mobile-dynamic-dock" id="mobile-bottom-dock">
      <a href="#home" class="dynamic-dock-item ${e==="home"?"active":""}">
        <i data-lucide="home"></i>
        <span>Ana Sayfa</span>
      </a>

      ${n?`
        <a href="#movies" class="dynamic-dock-item ${e==="movies"?"active":""}">
          <i data-lucide="film"></i>
          <span>Filmler</span>
        </a>
      `:`
        <a href="#livetv" class="dynamic-dock-item dynamic-dock-live ${e==="livetv"?"active":""}">
          <div class="dock-icon-rel">
            <i data-lucide="radio"></i>
            <span class="dock-live-dot"></span>
          </div>
          <span>Canlı</span>
        </a>
      `}

      <!-- Center Orb – Evren Hub -->
      <button class="dynamic-dock-hub-orb" id="btn-open-mobile-hub" aria-label="CinePulse Evreni">
        <div class="hub-orb-inner">
          <i data-lucide="sparkles" style="width:20px;height:20px;color:#fff;"></i>
        </div>
      </button>

      ${n?`
        <a href="#anime" class="dynamic-dock-item ${e==="anime"?"active":""}">
          <i data-lucide="sparkles"></i>
          <span>Anime</span>
        </a>
      `:`
        <button data-open-decision-room class="dynamic-dock-item dynamic-dock-birlikte">
          <i data-lucide="users-round"></i>
          <span>Birlikte</span>
        </button>
      `}

      <a href="#library" class="dynamic-dock-item ${e==="library"?"active":""}">
        <i data-lucide="bookmark"></i>
        <span>Listem</span>
      </a>
    </div>

    <!-- ================================================================
         MOBILE HUB BOTTOM SHEET
         (Secondary categories not in the main dock)
    ================================================================ -->
    <div class="mobile-hub-backdrop hidden" id="mobile-hub-backdrop">
      <div class="mobile-hub-sheet" id="mobile-hub-sheet">
        <!-- Drag Handle -->
        <div class="hub-sheet-handle-wrap">
          <div class="hub-sheet-handle"></div>
        </div>

        <!-- Sheet Header -->
        <div class="hub-sheet-header">
          <div class="hub-sheet-header-left">
            <div class="hub-sheet-icon-box">
              <i data-lucide="sparkles" style="width:18px;height:18px;color:#fff;"></i>
            </div>
            <div>
              <div class="hub-sheet-title">CinePulse Evreni</div>
              <div class="hub-sheet-subtitle">Tüm kategoriler & araçlar</div>
            </div>
          </div>
          <button id="btn-close-mobile-hub" class="hub-sheet-close" aria-label="Kapat">
            <i data-lucide="x" style="width:18px;height:18px;"></i>
          </button>
        </div>

        <!-- Sheet Grid -->
        <div class="hub-sheet-body">
          <!-- Row 1: Main content shortcuts (film/dizi still useful for quick access on mobile) -->
          <div class="hub-sheet-section-label">HIZLI ERİŞİM</div>
          <div class="hub-sheet-grid-2">
            <a href="#movies" class="hub-sheet-card hub-nav-trigger" style="--card-color:#0284c7;">
              <i data-lucide="film" style="width:22px;height:22px;"></i>
              <span class="hub-sheet-card-title">Filmler</span>
              <span class="hub-sheet-card-badge">4K UHD</span>
            </a>
            <a href="#series" class="hub-sheet-card hub-nav-trigger" style="--card-color:#f59e0b;">
              <i data-lucide="tv" style="width:22px;height:22px;"></i>
              <span class="hub-sheet-card-title">Diziler</span>
              <span class="hub-sheet-card-badge">TREND</span>
            </a>
            <a href="#dramas" class="hub-sheet-card hub-nav-trigger" style="--card-color:#a855f7;">
              <i data-lucide="clapperboard" style="width:22px;height:22px;"></i>
              <span class="hub-sheet-card-title">Kısa Dizi</span>
              <span class="hub-sheet-card-badge">REEL</span>
            </a>
            <a href="#discover" class="hub-sheet-card hub-nav-trigger" style="--card-color:#6366f1;">
              <i data-lucide="sliders-horizontal" style="width:22px;height:22px;"></i>
              <span class="hub-sheet-card-title">Keşif</span>
              <span class="hub-sheet-card-badge">FİLTRE</span>
            </a>
          </div>

          <!-- Row 2: Niche categories -->
          <div class="hub-sheet-section-label" style="margin-top:1.1rem;">TÜRLER</div>
          <div class="hub-sheet-grid-3">
            <a href="#anime" class="hub-sheet-chip hub-nav-trigger">
              <i data-lucide="sparkles" style="width:14px;height:14px;color:#38bdf8;"></i>
              Anime
            </a>
            <a href="#cartoons" class="hub-sheet-chip hub-nav-trigger">
              <i data-lucide="palette" style="width:14px;height:14px;color:#f59e0b;"></i>
              Çizgi
            </a>
            <a href="#documentary" class="hub-sheet-chip hub-nav-trigger">
              <i data-lucide="book-open" style="width:14px;height:14px;color:#10b981;"></i>
              Belgesel
            </a>
          </div>

          <!-- Row 3: Tools -->
          <div class="hub-sheet-section-label" style="margin-top:1.1rem;">ARAÇLAR</div>
          <div class="hub-sheet-tools">
            <button type="button" id="btn-hub-random-spin-mobile" class="hub-sheet-tool-btn">
              <div class="hub-sheet-tool-icon" style="background:linear-gradient(135deg,#f59e0b,#ef4444);">
                <i data-lucide="dices" style="width:18px;height:18px;color:#fff;"></i>
              </div>
              <div class="hub-sheet-tool-text">
                <span class="hub-sheet-tool-title">Şanslı Çark</span>
                <span class="hub-sheet-tool-sub">Rastgele popüler bir yapım seç</span>
              </div>
              <i data-lucide="sparkles" style="width:14px;height:14px;color:#fbbf24;margin-left:auto;flex-shrink:0;"></i>
            </button>
            <a href="https://caca1403.github.io/dizionerisistemi/" target="_blank" rel="noopener noreferrer" id="btn-hub-series-recommend-mobile" class="hub-sheet-tool-btn" aria-label="SÉRA Dizi Öneri Sistemi'ni aç">
              <div class="hub-sheet-tool-icon" style="background:linear-gradient(135deg,#6366f1,#a855f7);">
                <i data-lucide="wand-2" style="width:18px;height:18px;color:#fff;"></i>
              </div>
              <div class="hub-sheet-tool-text">
                <span class="hub-sheet-tool-title">SÉRA Dizi Öneri Sistemi ↗</span>
                <span class="hub-sheet-tool-sub">SÉRA uygulamasını aç</span>
              </div>
            </a>
            <button type="button" id="btn-hub-trakt-mobile" class="hub-sheet-tool-btn">
              <div class="hub-sheet-tool-icon" style="background:linear-gradient(135deg,#ed1c24,#b91c1c);">
                <i data-lucide="tv" style="width:18px;height:18px;color:#fff;"></i>
              </div>
              <div class="hub-sheet-tool-text">
                <span class="hub-sheet-tool-title">Trakt.tv Eşitleme</span>
                <span class="hub-sheet-tool-sub">İzleme geçmişi & Scrobble</span>
              </div>
              <i data-lucide="repeat" style="width:14px;height:14px;color:#ed1c24;margin-left:auto;flex-shrink:0;"></i>
            </button>
            <a href="https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk" target="_blank" rel="noopener noreferrer" id="btn-hub-apk-mobile" class="hub-sheet-tool-btn" aria-label="CinePulse Android APK İndir">
              <div class="hub-sheet-tool-icon" style="background:linear-gradient(135deg,#10b981,#059669);">
                <i data-lucide="smartphone" style="width:18px;height:18px;color:#fff;"></i>
              </div>
              <div class="hub-sheet-tool-text">
                <span class="hub-sheet-tool-title">Android APK İndir</span>
                <span class="hub-sheet-tool-sub">Telefona doğrudan kur & güncelle</span>
              </div>
              <i data-lucide="download" style="width:14px;height:14px;color:#10b981;margin-left:auto;flex-shrink:0;"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  `}let Fi=null,xn=null,Eo=!1;function To(e){const t=document.getElementById("main-navbar");Fi&&window.removeEventListener("scroll",Fi),Fi=()=>t?.classList.toggle("scrolled",window.scrollY>20),Fi(),window.addEventListener("scroll",Fi,{passive:!0});const i=document.getElementById("mobile-search-row");document.getElementById("btn-mobile-search-toggle")?.addEventListener("click",()=>{i?.classList.toggle("hidden"),i?.classList.contains("hidden")||(document.getElementById("mobile-search-input")?.focus(),G())}),document.getElementById("btn-mobile-search-close")?.addEventListener("click",()=>{i?.classList.add("hidden")}),document.getElementById("btn-nav-notifications")?.addEventListener("click",Yd),document.getElementById("btn-nav-profile")?.addEventListener("click",jd);const n=document.getElementById("nav-hub-li"),a=document.getElementById("btn-desktop-hub"),r=document.getElementById("hub-mega-dropdown");let o;function s(){clearTimeout(o),a?.setAttribute("aria-expanded","true"),r?.classList.add("open")}function l(){clearTimeout(o),a?.setAttribute("aria-expanded","false"),r?.classList.remove("open")}function u(){clearTimeout(o),o=setTimeout(()=>{!n?.matches(":hover")&&!r?.matches(":hover")&&l()},350)}if(n){n.addEventListener("mouseenter",s),n.addEventListener("mouseleave",u),r?.addEventListener("mouseenter",s),r?.addEventListener("mouseleave",u),a?.addEventListener("click",f=>{f.stopPropagation(),s()}),r?.querySelectorAll(".hub-nav-trigger").forEach(f=>{f.addEventListener("click",l)});const w=f=>{f.key==="Escape"&&l()};window.addEventListener("keydown",w);const k=f=>{n.contains(f.target)||l()};document.addEventListener("click",k)}document.getElementById("btn-hub-random-spin")?.addEventListener("click",async()=>{l(),Vs()}),document.getElementById("btn-hub-series-recommend")?.addEventListener("click",l),document.getElementById("btn-hub-trakt")?.addEventListener("click",()=>{l(),nr()});const p=document.getElementById("mobile-hub-backdrop"),h=document.getElementById("mobile-hub-sheet");let g;function v(){p&&(clearTimeout(g),h?.classList.remove("sheet-closing"),p.classList.remove("hidden"),document.body.style.overflow="hidden")}function b(){p&&(document.body.style.overflow="",h?.classList.add("sheet-closing"),clearTimeout(g),g=setTimeout(()=>{p.classList.add("hidden"),h?.classList.remove("sheet-closing")},280))}document.getElementById("btn-open-mobile-hub")?.addEventListener("click",w=>{w.preventDefault(),v()},{once:!1}),document.getElementById("btn-close-mobile-hub")?.addEventListener("click",b),p?.addEventListener("click",w=>{w.target===p&&b()}),p?.querySelectorAll(".hub-nav-trigger").forEach(w=>{w.addEventListener("click",b)}),document.getElementById("btn-hub-random-spin-mobile")?.addEventListener("click",async()=>{b(),Vs()}),document.getElementById("btn-hub-series-recommend-mobile")?.addEventListener("click",b),document.getElementById("btn-hub-trakt-mobile")?.addEventListener("click",()=>{b(),nr()}),document.querySelectorAll("[data-open-decision-room]").forEach(w=>{w.addEventListener("click",()=>{l(),b(),or()})}),Ao("nav-search-input","search-overlay"),Ao("mobile-search-input","mobile-search-overlay"),Eo||(Eo=!0,document.addEventListener("click",w=>{for(const[k,f]of[["nav-search-input","search-overlay"],["mobile-search-input","mobile-search-overlay"]]){const y=document.getElementById(k),E=document.getElementById(f);E&&!y?.contains(w.target)&&!E.contains(w.target)&&E.classList.add("hidden")}})),xn&&document.removeEventListener("keydown",xn),xn=w=>{(w.metaKey||w.ctrlKey)&&w.key.toLowerCase()==="k"&&(w.preventDefault(),window.innerWidth<=992&&i?(i.classList.remove("hidden"),document.getElementById("mobile-search-input")?.focus()):document.getElementById("nav-search-input")?.focus())},window.addEventListener("keydown",xn)}function Ao(e,t){const i=document.getElementById(e),n=document.getElementById(t);let a=null;!i||!n||(i.addEventListener("input",r=>{const o=r.target.value.trim();if(clearTimeout(a),o.length<2){n.classList.add("hidden"),n.innerHTML="";return}n.innerHTML='<div class="search-no-results" style="display:flex;align-items:center;gap:8px;padding:1rem;color:var(--text-muted);font-size:.85rem;"><span class="tv-loading-spinner" style="width:16px;height:16px;border-width:2px;"></span> Aranıyor...</div>',n.classList.remove("hidden"),a=setTimeout(async()=>{try{let h=function(){n.querySelectorAll(".search-item").forEach(g=>{g.addEventListener("click",()=>{n.classList.add("hidden"),i.value="",document.getElementById("mobile-search-row")?.classList.add("hidden")})})};const s=await Za(o),l=Array.isArray(s)?s.slice(0,8):s?.results?.slice(0,8)||[],u=`
          <a href="#dramas?q=${encodeURIComponent(o)}" class="search-item search-item-drama" style="background:linear-gradient(135deg,rgba(88,28,135,.35),rgba(30,27,75,.55));border:1px solid rgba(168,85,247,.3);border-radius:10px;margin-top:6px;padding:.6rem .75rem;">
            <div style="width:36px;height:48px;border-radius:6px;background:rgba(168,85,247,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i data-lucide="sparkles" style="width:18px;height:18px;color:#c084fc;"></i>
            </div>
            <div class="search-item-info">
              <div class="search-item-title" style="color:#f3e8ff;font-weight:750;">🎭 Kısa Dizilerde Ara: "${o}"</div>
              <div class="search-item-meta">
                <span class="search-badge" style="background:#a855f7;color:#fff;">Özel Hub</span>
                <span style="color:#c4b5fd;">ReelShort & DramaBox</span>
              </div>
            </div>
          </a>`;if(!l.length){n.innerHTML=`<div class="search-no-results" style="padding-bottom:.5rem;">TMDB Sonucu Bulunamadı</div>${u}`,n.classList.remove("hidden"),G(n),h();return}const p=l.map(g=>{const v=g.media_type==="tv"||!!g.first_air_date||!g.release_date&&!!g.name,b=g.title||g.name||"İsimsiz",w=(g.release_date||g.first_air_date||"").slice(0,4),k=st(g.poster_path,Ze.POSTER_SMALL||Ze.POSTER_MEDIUM);return`
            <a href="#detail?type=${v?"tv":"movie"}&id=${g.id}" class="search-item">
              <img src="${k}" alt="${b}" class="search-item-img" onerror="this.src='https://via.placeholder.com/45x68/1e293b/64748b?text=N/A'" />
              <div class="search-item-info">
                <div class="search-item-title">${b}</div>
                <div class="search-item-meta">
                  <span class="search-badge">${v?"Dizi":"Film"}</span>
                  ${w?`<span>${w}</span>`:""}
                  <span class="search-rating">★ ${(g.vote_average||0).toFixed(1)}</span>
                </div>
              </div>
            </a>`}).join("");n.innerHTML=p+u,n.classList.remove("hidden"),G(n),h()}catch{n.innerHTML='<div class="search-no-results">Arama sırasında bir hata oluştu</div>'}},200)}),i.addEventListener("keydown",r=>{r.key==="Escape"&&(n.classList.add("hidden"),i.blur())}))}let Ui=null;function lc({title:e="Fragman",trailerInfo:t,mediaId:i=null,mediaType:n="movie"}){const a=document.getElementById("trailer-modal");if(!a)return;if(!t||!t.embedUrl){alert("Bu yapım için resmi fragman bulunamadı.");return}const r=t.name||"Resmi Tanıtım",o=i?`#detail?type=${encodeURIComponent(n)}&id=${encodeURIComponent(i)}`:null;a.innerHTML=`
    <div class="trailer-modal-overlay">
      <div class="trailer-modal-dialog">
        
        <!-- Header Bar -->
        <div class="trailer-header">
          <div class="trailer-header-left">
            <span class="trailer-badge">
              <i data-lucide="youtube" style="width: 14px; height: 14px; fill: #ef4444; color: #ef4444;"></i>
              <span>FRAGMAN</span>
            </span>
            <h3 class="trailer-title" title="${e} • ${r}">
              ${e} <span class="trailer-subname">• ${r}</span>
            </h3>
          </div>

          <div class="trailer-header-actions">
            ${t.watchUrl?`
              <a href="${t.watchUrl}" target="_blank" rel="noopener noreferrer" class="btn-trailer-yt" title="YouTube'da Aç">
                <i data-lucide="external-link" style="width: 13px; height: 13px;"></i>
                <span class="btn-yt-text">YouTube</span>
              </a>
            `:""}
            <button id="btn-close-trailer" class="btn-trailer-close" title="Kapat (ESC)">
              <i data-lucide="x" style="width: 18px; height: 18px;"></i>
            </button>
          </div>
        </div>

        <!-- Video Player Frame (Strict 16:9 Responsive Aspect Ratio) -->
        <div class="trailer-video-wrapper">
          <iframe 
            src="${t.embedUrl}" 
            title="${e} Fragman" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen 
            class="trailer-iframe"
          ></iframe>
        </div>

        ${o?`<div class="trailer-footer"><a class="btn-trailer-detail" href="${o}"><i data-lucide="info"></i><span>İçerik Sayfasına Git</span><i data-lucide="arrow-right"></i></a></div>`:""}

      </div>
    </div>
  `,a.classList.remove("hidden"),document.body.style.overflow="hidden",G();const s=()=>{a.innerHTML="",a.classList.add("hidden"),document.body.style.overflow="",Ui&&(window.removeEventListener("keydown",Ui),Ui=null)},l=a.querySelector("#btn-close-trailer");l&&l.addEventListener("click",s),a.querySelector(".btn-trailer-detail")?.addEventListener("click",s);const u=a.querySelector(".trailer-modal-overlay");u&&u.addEventListener("click",p=>{p.target===u&&s()}),Ui=p=>{p.key==="Escape"&&s()},window.addEventListener("keydown",Ui)}let rt=0,lr=null,Fn=0;const En=new Map;function Qp(){clearInterval(lr),lr=null,Fn++}function os(e){const t=e?.backdrop_path||e?.poster_path,i=window.innerWidth<=768?Ze.BACKDROP_LARGE:Ze.BACKDROP_XLARGE;return st(t,i)}function ls(e,t="auto"){if(!e)return Promise.resolve(null);if(En.has(e))return En.get(e);const i=new Promise(n=>{const a=new Image;a.decoding="async",a.fetchPriority=t,a.onload=async()=>{try{await a.decode()}catch{}n(e)},a.onerror=()=>{En.delete(e),n(null)},a.src=e});return En.set(e,i),i}function eh(e=[]){const i=Ct()?e.filter(Jt):e;if(!i||i.length===0)return"";rt=0;const n=i.slice(0,10),a=n[0],r=a.id,o=a.first_air_date||a.media_type==="tv"?"tv":"movie",s=a.title||a.name||"Öne Çıkan Yapım",l=a.overview&&a.overview.trim().length>15?a.overview:qe(a,o),u=os(a),p=a.vote_average?a.vote_average.toFixed(1):"8.8",h=(a.first_air_date||a.release_date||"").substring(0,4),g=Ya(r);let v=document.getElementById("hero-backdrop-preload");return v||(v=document.createElement("link"),v.id="hero-backdrop-preload",v.rel="preload",v.as="image",document.head.appendChild(v)),v.href=u,v.fetchPriority="high",window.innerWidth>768&&ls(u,"high"),`
    <section class="hero-slider is-loading" id="hero-slider-section" aria-busy="true">
      <div class="hero-ambient-glow"></div>

      <img class="hero-backdrop" id="hero-backdrop-img" src="${u}" alt="" loading="eager" fetchpriority="high" decoding="async" sizes="100vw" />
      <div class="hero-overlay-gradient"></div>

      <!-- Prev / Next Arrow Buttons -->
      <button class="hero-arrow hero-arrow-prev" id="hero-arrow-prev" aria-label="Önceki">
        <i data-lucide="chevron-left" style="width:22px;height:22px;"></i>
      </button>
      <button class="hero-arrow hero-arrow-next" id="hero-arrow-next" aria-label="Sonraki">
        <i data-lucide="chevron-right" style="width:22px;height:22px;"></i>
      </button>

      <div class="container">
        <div class="hero-content">
          <div class="hero-badge-row" id="hero-badge-row">
            <span class="badge badge-rating" id="hero-rating-badge">
              <i data-lucide="star" style="width:12px; height:12px; fill: currentColor"></i> ${p} IMDb
            </span>
            <span class="badge" id="hero-year-badge">${h}</span>
            <span class="badge badge-type" id="hero-type-badge">${o==="tv"?"DİZİ":"FİLM"}</span>
          </div>

          <h1 class="hero-title" id="hero-title-text">${s}</h1>
          <p class="hero-overview" id="hero-overview-text">${l}</p>

          <div class="hero-actions">
            <button class="btn-primary hero-btn-play" id="hero-play-btn" data-id="${r}" data-type="${o}">
              <i data-lucide="play" style="fill: currentColor; width: 17px; height: 17px;"></i>
              <span>Hemen İzle</span>
            </button>

            <button class="btn-secondary hero-btn-trailer" id="hero-trailer-btn" data-id="${r}" data-type="${o}" title="Fragmanı İzle">
              <i data-lucide="clapperboard" style="width: 16px; height: 16px;"></i>
              <span>Fragman</span>
            </button>

            <button class="btn-secondary hero-btn-list-icon" id="hero-list-btn" data-id="${r}" data-type="${o}" title="${g?"Listemden Çıkar":"Listeme Ekle"}">
              <i data-lucide="${g?"check":"plus"}" style="width: 17px; height: 17px; ${g?"color: var(--primary);":""}"></i>
            </button>
          </div>

          <!-- Dot Indicators -->
          <div class="hero-dots-wrapper" id="hero-dots-container">
            ${n.map((b,w)=>`
              <div class="hero-dot ${w===rt?"active":""}" data-index="${w}" role="button" aria-label="Slayt ${w+1}"></div>
            `).join("")}
          </div>
        </div>
      </div>
    </section>
  `}function th(e=[]){const i=Ct()?e.filter(Jt):e;if(!i||i.length===0)return;const n=i.slice(0,10);rt=0;const a=document.getElementById("hero-play-btn"),r=document.getElementById("hero-list-btn"),o=document.getElementById("hero-trailer-btn"),s=document.getElementById("hero-slider-section"),l=document.getElementById("hero-backdrop-img"),u=document.getElementById("hero-arrow-prev"),p=document.getElementById("hero-arrow-next");(async()=>{if(l&&!l.complete&&await new Promise(A=>{l.addEventListener("load",A,{once:!0}),l.addEventListener("error",A,{once:!0})}),l?.complete&&l.naturalWidth>0)try{await l.decode()}catch{}requestAnimationFrame(()=>{s?.isConnected&&(s.classList.remove("is-loading"),s.setAttribute("aria-busy","false"))})})();const g=()=>n.slice(1,4).forEach(A=>ls(os(A)));"requestIdleCallback"in window?window.requestIdleCallback(g,{timeout:1500}):setTimeout(g,500),n.slice(0,2).forEach(A=>{const R=A.first_air_date||A.media_type==="tv"?"tv":"movie";ln(R,A.id).catch(()=>null)});function v(){Tn(n[(rt+1)%n.length],(rt+1)%n.length),x()}function b(){Tn(n[(rt-1+n.length)%n.length],(rt-1+n.length)%n.length),x()}u?.addEventListener("click",b),p?.addEventListener("click",v);const w=A=>{if(!s?.isConnected){document.removeEventListener("keydown",w);return}A.key==="ArrowRight"&&v(),A.key==="ArrowLeft"&&b()};document.addEventListener("keydown",w);let k=null,f=!1;const y=50;function E(A){k=A,f=!0}function C(A){if(!f||k===null)return;f=!1;const R=k-A;Math.abs(R)<y||(R>0?v():b(),k=null)}s?.addEventListener("touchstart",A=>E(A.touches[0].clientX),{passive:!0}),s?.addEventListener("touchend",A=>C(A.changedTouches[0].clientX),{passive:!0}),s?.addEventListener("touchcancel",()=>{f=!1,k=null},{passive:!0}),s?.addEventListener("mousedown",A=>{A.button===0&&E(A.clientX)}),s?.addEventListener("mouseup",A=>{A.button===0&&C(A.clientX)}),s?.addEventListener("mouseleave",()=>{f=!1,k=null}),a?.addEventListener("click",()=>{window.location.hash=`#detail?type=${a.getAttribute("data-type")}&id=${a.getAttribute("data-id")}`}),o?.addEventListener("click",async()=>{if(ft().trailersEnabled===!1){ee("Fragmanlar yönetici ayarlarından kapatıldı.","info");return}const A=n[rt];if(!A)return;const R=A.first_air_date||A.media_type==="tv"?"tv":"movie",L=o.innerHTML;o.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:17px;height:17px;"></i> <span>Yükleniyor...</span>',G(o);try{const N=await ln(R,A.id,A.title||A.name);N?lc({title:A.title||A.name,trailerInfo:N,mediaId:A.id,mediaType:R}):ee("Bu yapım için resmi tanıtım fragmanı bulunamadı.","info")}catch{ee("Fragman yüklenirken hata oluştu.","error")}finally{o.innerHTML=L,G(o)}}),r?.addEventListener("click",()=>{const A=n[rt],R=tl(A);ee(R?"İzleme listene eklendi!":"İzleme listenden çıkarıldı.",R?"success":"info"),r.title=R?"Listemden Çıkar":"Listeme Ekle",r.innerHTML=`<i data-lucide="${R?"check":"plus"}" style="width: 17px; height: 17px; ${R?"color: var(--primary);":""}"></i>`,G(r)}),document.querySelectorAll(".hero-dot").forEach(A=>{A.addEventListener("click",()=>{const R=parseInt(A.getAttribute("data-index"),10);Tn(n[R],R),x()})});function x(){clearInterval(lr),lr=setInterval(()=>{if(n.length>1){const A=(rt+1)%n.length;Tn(n[A],A)}},6e3)}x()}async function Tn(e,t=rt){if(!e||Ct()&&!Jt(e))return;const i=document.getElementById("hero-backdrop-img"),n=document.getElementById("hero-title-text"),a=document.getElementById("hero-overview-text"),r=document.getElementById("hero-play-btn"),o=document.getElementById("hero-list-btn"),s=document.getElementById("hero-trailer-btn"),l=document.getElementById("hero-rating-badge"),u=document.getElementById("hero-year-badge"),p=document.getElementById("hero-type-badge"),h=e.first_air_date||e.media_type==="tv"?"tv":"movie",g=os(e),v=e.vote_average?e.vote_average.toFixed(1):"8.5",b=(e.first_air_date||e.release_date||"").substring(0,4),w=++Fn;if(i&&i.src!==g){const y=await ls(g,"high");if(!y||w!==Fn||!i.isConnected)return;i.src=y;try{await i.decode()}catch{}if(w!==Fn||!i.isConnected)return}rt=t;const k=document.querySelector("#hero-slider-section .hero-content");k?.classList.remove("hero-content-committing"),requestAnimationFrame(()=>{k?.isConnected&&k.classList.add("hero-content-committing")}),n&&(n.textContent=e.title||e.name);const f=e.overview&&e.overview.trim().length>15?e.overview:qe(e,h);if(a&&(a.textContent=f),l&&(l.innerHTML=`<i data-lucide="star" style="width:13px;height:13px;fill:currentColor"></i> ${v} IMDb`),u&&(u.textContent=b||"2024"),p&&(p.textContent=h==="tv"?"DİZİ":"FİLM"),r&&(r.setAttribute("data-id",e.id),r.setAttribute("data-type",h)),s&&(s.setAttribute("data-id",e.id),s.setAttribute("data-type",h)),o){o.setAttribute("data-id",e.id),o.setAttribute("data-type",h);const y=Ya(e.id);o.title=y?"Listemden Çıkar":"Listeme Ekle",o.innerHTML=`<i data-lucide="${y?"check":"plus"}" style="width:17px;height:17px;${y?"color:var(--primary);":""}"></i>`}G(document.getElementById("hero-slider-section")),document.querySelectorAll(".hero-dot").forEach((y,E)=>{y.classList.toggle("active",E===rt)})}const cs=new Map,cr=new Map;let Ci=null,cc=null;function dc(){const e=window.location.hash||"#home";e.startsWith("#detail")||(cc=e,window.scrollY>0&&cs.set(e,window.scrollY))}function ih(){dc(),Ci===null&&(Ci=window.setTimeout(()=>{Ci=null,Lr()},300))}function Lr(){Ci!==null&&(clearTimeout(Ci),Ci=null),(window.location.hash||"#home")===cc&&dc();for(const[e,t]of cs)if(t>0)try{sessionStorage.setItem(`cinepulse_scroll_${e}`,String(t))}catch{}for(const[e,t]of cr)try{sessionStorage.setItem(`cinepulse_rail_${e}`,String(t))}catch{}}const Co=Lr;function nh(e=window.location.hash||"#home"){if(e.startsWith("#detail")){window.scrollTo({top:0,behavior:"instant"});return}document.querySelectorAll(".card-rail").forEach(i=>{if(i.id){let n=cr.get(i.id);if(typeof n!="number")try{const a=sessionStorage.getItem(`cinepulse_rail_${i.id}`);a&&(n=parseFloat(a))}catch{}typeof n=="number"&&n>0&&(i.scrollLeft=n,requestAnimationFrame(()=>{i.scrollLeft=n}))}});let t=cs.get(e);if(typeof t!="number")try{const i=sessionStorage.getItem(`cinepulse_scroll_${e}`);i&&(t=parseFloat(i))}catch{}if(typeof t=="number"&&t>0){const i=(n=0)=>{window.scrollTo({top:t,behavior:"instant"}),n<15&&document.body.scrollHeight<t+window.innerHeight&&setTimeout(()=>i(n+1),60)};requestAnimationFrame(()=>i(0))}else window.scrollTo({top:0,behavior:"instant"})}const ji=new Map,Lo="cp_fanart_thumb_v2_";async function uc(e,t="movie"){if(!/^\d+$/.test(String(e)))return null;const i=`${t==="tv"?"tv":"movie"}:${e}`;if(ji.has(i))return ji.get(i);try{const r=sessionStorage.getItem(Lo+i);if(r!==null){const o=r?JSON.parse(r):null;return ji.set(i,o),o}}catch{}const n=(async()=>{try{const r=await fetch(`/api/fanart?type=${t==="tv"?"tv":"movie"}&id=${encodeURIComponent(e)}`,{signal:AbortSignal.timeout(8e3)});if(!r.ok)return null;const o=await r.json(),s=o.image?{image:o.image,logo:o.logo||null}:null;try{sessionStorage.setItem(Lo+i,s?JSON.stringify(s):"")}catch{}return s}catch{return null}})();ji.set(i,n);const a=await n;return ji.set(i,a),a}function Io(e){Array.isArray(e)&&e.forEach((t,i)=>{if(!t?.id)return;const n=t.media_type==="tv"||t.type==="tv"?"tv":"movie";setTimeout(()=>uc(t.id,n),i*80)})}const rh=Jo||["anime","kimetsu","yaiba","iblis keser","demon slayer","naruto","boruto","shingeki","titan"];function Rt(e=""){return String(e).replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t])}function ah(e){return e?/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(e):!1}function ds(e){if(!e)return!1;if(e.isAnime===!0||e.type==="anime"||e.media_type==="anime"||e.id&&Fe(e.id))return!0;const i=(e.genre_ids||(Array.isArray(e.genres)?e.genres.map(r=>typeof r=="object"?r.id:r):[])).some(r=>Number(r)===16),n=e.original_language==="ja"||Array.isArray(e.origin_country)&&e.origin_country.includes("JP");if(i&&n||i&&(e.origin_country?.includes("JP")||e.original_language==="ja")||e.original_language==="ja"&&(i||ah(e.original_name||e.original_title||e.title||e.name))||Array.isArray(e.genres)&&e.genres.map(o=>typeof o=="object"?o.name:String(o)).filter(Boolean).some(o=>/anime/i.test(o)))return e.id&&_e(e.id),!0;if(typeof e.id=="string"&&(e.id.startsWith("ta_")||e.id.startsWith("acx_")||e.id.startsWith("tra_")))return _e(e.id),!0;const a=(e.title||e.name||e.original_title||e.original_name||"").toLowerCase();for(const r of rh)if(a.includes(r))return e.id&&_e(e.id),!0;return!1}function pc(e){return e?e.first_air_date||e.number_of_seasons||e.episodesCount||Array.isArray(e.seasons)&&e.seasons.length>0||e.type==="tv"||e.media_type==="tv"?!0:(e.type==="movie"||e.media_type==="movie"||e.release_date&&!e.first_air_date,!1):!1}function us(e){return e?e.isAnime||e.type==="anime"||ds(e)||e.id&&Fe(e.id)?"anime":e.type==="documentary"||e.media_type==="documentary"||(e.genre_ids||(Array.isArray(e.genres)?e.genres.map(i=>typeof i=="object"?i.id:i):[])).some(i=>Number(i)===99)?"documentary":e.type==="movie"||e.media_type==="movie"?"movie":e.type==="tv"||e.media_type==="tv"||pc(e)?"tv":"movie":"movie"}function _t(e,t={}){const i=e.id,n=us(e),a=!!(e.isAnime||n==="anime"||ds(e)||e.id&&Fe(e.id)),r=!!(e.isSeries!==void 0?e.isSeries:pc(e)),o=r?"tv":"movie";let s=e.title||e.name||"";(!s||br(s))&&(s=e.title_en||e.name_en||e.original_name||e.original_title||s||"İsimsiz İçerik");const l=s,u=e.poster_path||e.posterPath||e.poster||"",p=e.backdrop_path||e.backdropPath||e.backdrop||"",h=st(u,Ze.POSTER_MEDIUM),g=p?st(p,Ze.BACKDROP_LARGE):h,b=ft().cardLayout==="landscape"?g:h;let w=e.vote_average??e.voteAverage??e.rating,k=w?Number(w).toFixed(1):"";k==="0.0"&&(k="");const f=e.release_date||e.first_air_date||(e.year?String(e.year):""),y=f?String(f).substring(0,4):"";let E=e.progressPercent||0,C=e.season||1,x=e.episode||1,A=e.currentTime||0,R=e.completed||!1,L=!1;if(t.isContinueSection||e.currentTime>0&&!R||e.progressPercent>0&&!R)L=!0;else{const V=Gt(i,C,x);V&&(R=V.completed||!1,!R&&V.duration>0&&V.currentTime>15&&(E=Math.min(100,Math.round(V.currentTime/V.duration*100)),A=V.currentTime,r&&(C=V.season||1,x=V.episode||1)))}let N="FİLM",z="type-movie";a?(N=r?"ANİME DİZİSİ":"ANİME FİLMİ",z="type-anime"):n==="tv"||r?(N="DİZİ",z="type-tv"):n==="documentary"&&(N="BELGESEL",z="type-doc");const K=e.original_title||e.original_name||"",W=encodeURIComponent(l),O=encodeURIComponent(K),B=encodeURIComponent(u||""),D=encodeURIComponent(p||"");return`
    <div class="media-card" 
      data-id="${i}" 
      data-type="${o}" 
      data-isanime="${a?"true":"false"}"
      data-title="${W}" 
      data-originaltitle="${O}"
      data-poster="${B}"
      data-backdrop="${D}"
      data-tmdbid="${i}"
      data-mediatype="${n==="tv"||r?"tv":"movie"}"
      data-isseries="${r?"true":"false"}"
      data-season="${C}" 
      data-episode="${x}" 
      data-currenttime="${A}"
      data-iscontinue="${L?"true":"false"}"
      tabindex="0"
      role="button"
      aria-label="${l}">
      
      <div class="card-poster-wrapper card-fanart-placeholder ${p?"":"card-fanart-portrait-fallback"}">
        <img 
          src="${b}"
          data-poster-src="${h}"
          data-backdrop-src="${g}"
          alt="${l}" 
          class="card-poster-img" 
          loading="lazy" 
          decoding="async"
          onerror="this.onerror=null;this.src='${on}'"
        />
        <img class="card-fanart-logo" alt="" aria-hidden="true" />
        <span class="card-fanart-title">${Rt(l)}</span>
        
        <div class="card-glass-glow"></div>

        <!-- Left Status Pill (Completed / In-Progress with actual progress) -->
        ${R?`
          <div class="card-status-badge card-status-completed" title="Tamamlandı">
            <i data-lucide="check" style="width:10px;height:10px;stroke-width:3;"></i>
            <span>İZLENDİ</span>
          </div>
        `:L&&r&&(A>0||E>0)?`
          <div class="card-status-badge card-status-continue" title="Kaldığın Bölüm">
            <i data-lucide="clock" style="width:10px;height:10px;"></i>
            <span>S${C} B${x}</span>
          </div>
        `:""}

        <!-- Rating Pill Floating Top Right -->
        ${k?`
          <div class="card-rating-pill">
            <i data-lucide="star" style="width:11px;height:11px;fill:#f59e0b;stroke:#f59e0b;"></i>
            <span>${k}</span>
          </div>
        `:""}

        <!-- Hover Quick Play Overlay -->
        <div class="card-hover-overlay">
          <div class="card-play-btn-circle">
            <i data-lucide="play" style="width:20px;height:20px;fill:currentColor;margin-left:2px;"></i>
          </div>
          <span class="card-hover-action-text">${L?"İzlemeye Devam Et":"İncele & Oynat"}</span>
        </div>

        <!-- Progress Bar at bottom if watch in progress -->
        ${E>0&&!R?`
          <div class="card-progress-bar-bg">
            <div class="card-progress-bar-fill" style="width: ${E}%;"></div>
          </div>
        `:""}
      </div>

      <div class="card-info">
        <h3 class="card-title" title="${l}">${l}</h3>
        <div class="card-meta">
          <span class="card-type-tag ${z}">${N}</span>
          ${y?`<span class="card-year-tag">${y}</span>`:""}
        </div>
      </div>
    </div>
  `}function kt(e){if(!e||(dn(e),e._hasMediaEventsDelegated))return;e._hasMediaEventsDelegated=!0;let t=0;e.addEventListener("click",s=>{if(Date.now()<t){s.preventDefault(),s.stopPropagation();return}if(s.target.closest(".btn-lib-delete")||s.target.closest(".btn-delete-history"))return;const l=s.target.closest(".media-card");if(!l)return;s.preventDefault();const u=l.getAttribute("data-id"),p=l.getAttribute("data-type"),h=l.getAttribute("data-isanime")==="true"||p==="anime"||Fe(u),g=parseInt(l.getAttribute("data-season")||"1",10),v=parseInt(l.getAttribute("data-episode")||"1",10),b=parseFloat(l.getAttribute("data-currenttime")||"0"),w=decodeURIComponent(l.getAttribute("data-title")||""),k=decodeURIComponent(l.getAttribute("data-originaltitle")||""),f=l.getAttribute("data-poster")||"",y=l.getAttribute("data-backdrop")||"",E=l.getAttribute("data-iscontinue")==="true",C=l.getAttribute("data-isseries"),x=l.getAttribute("data-mediatype"),A=C!==null?C==="true":x==="tv"||p==="tv";E&&(l.closest("#continue-watching-rail")||l.closest(".continue-card-wrapper")||b>0)?Ri({type:h?"anime":A?"tv":"movie",isAnime:h,isSeries:A,tmdbId:u,title:A?`${w} - S${g}E${v}`:w,seriesTitle:w,originalTitle:k||w,season:A?g:void 0,episode:A?v:void 0,posterPath:f,backdropPath:y,currentTime:b}):(Co(),window.location.hash=`#detail?type=${h?"anime":p}&id=${u}`)}),document.querySelector("link[rel=preconnect][href*=youtube-nocookie]")||["https://www.youtube-nocookie.com","https://i.ytimg.com"].forEach(s=>{const l=document.createElement("link");l.rel="preconnect",l.href=s,l.crossOrigin="anonymous",document.head.appendChild(l)});const i=window.matchMedia("(hover: hover) and (pointer: fine)").matches,n=window.matchMedia("(pointer: coarse)").matches,a=ft(),r=a.hoverPreviewsEnabled!==!1&&a.trailersEnabled!==!1;function o(s,l){if(s.querySelector(".card-hover-video-preview"))return;let u=sessionStorage.getItem("cinepulse_preview_sound")==="on";l.then(p=>{if(!p||!p.key||!p.key.trim()||!s.isConnected||i&&!s.matches(":hover"))return;const h=decodeURIComponent(s.getAttribute("data-title")||"Fragman"),g=s.querySelector(".card-type-tag")?.textContent?.trim()||"",v=s.querySelector(".card-year-tag")?.textContent?.trim()||"",b=s.querySelector(".card-rating-pill span")?.textContent?.trim()||"",w=s.getAttribute("data-id")||"",k=s.getAttribute("data-type")||"movie",f=`#detail?type=${encodeURIComponent(k)}&id=${encodeURIComponent(w)}`,y=encodeURIComponent(p.key),E=document.createElement("div");E.className="card-hover-video-preview";const C=window.innerWidth<=700;if(C&&(document.querySelectorAll(".card-hover-video-preview").forEach(B=>{typeof B._closePreview=="function"?B._closePreview():(B.closest?.(".media-card")?.classList.remove("preview-active"),B.remove())}),document.querySelectorAll(".card-preview-mobile-close-portal").forEach(B=>B.remove()),E.classList.add("is-mobile-sheet")),E.innerHTML=`
        <div class="card-preview-media">
          <iframe
            src="https://www.youtube-nocookie.com/embed/${y}?autoplay=1&mute=1&controls=0&disablekb=1&modestbranding=1&loop=1&playlist=${y}&rel=0&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}"
            frameborder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            tabindex="-1"
            title="${Rt(h)} fragmanı">
          </iframe>
          <div class="card-preview-cinematic-shade"></div>
          <span class="card-preview-badge">FRAGMAN</span>
        </div>
        <button class="card-preview-close-btn" type="button" aria-label="Fragmanı kapat" title="Fragmanı kapat"><i data-lucide="x"></i></button>
        <div class="card-preview-details">
          <div class="card-preview-copy">
            <strong class="card-preview-title">${Rt(h)}</strong>
            <div class="card-preview-meta">
              ${b?`<span class="card-preview-match">${Rt(b)} IMDb</span>`:""}
              ${v?`<span>${Rt(v)}</span>`:""}
              ${g?`<span>${Rt(g)}</span>`:""}
            </div>
          </div>
          <div class="card-preview-actions">
            <a class="card-preview-detail" href="${Rt(f)}" aria-label="${Rt(h)} içerik sayfasına git"><i data-lucide="info"></i><span>İçeriğe Git</span></a>
            <a class="card-preview-open" href="${Rt(p.watchUrl||`https://www.youtube.com/watch?v=${y}`)}" target="_blank" rel="noopener noreferrer" title="YouTube'da aç" aria-label="Fragmanı YouTube'da aç"><i data-lucide="external-link"></i></a>
            <button class="card-preview-sound ${u?"is-on":""}" type="button" aria-label="${u?"Sesi kapat":"Sesi aç"}" title="${u?"Sesi kapat":"Sesi aç"}">
              <i data-lucide="${u?"volume-2":"volume-x"}"></i>
            </button>
          </div>
        </div>
      `,!C){const B=s.getBoundingClientRect(),D=window.innerHeight<520?12:76,J=Math.min(460,Math.max(390,B.width*2.2),window.innerWidth-32),V=Math.max(240,(window.innerHeight-D-94)*16/9),U=Math.max(240,Math.min(J,V)),Y=U*9/16+82,ne=Math.max(16,Math.min(window.innerWidth-U-16,B.left+(B.width-U)/2)),re=Math.max(D,Math.min(window.innerHeight-Y-12,B.top+(B.height-Y)/2));E.style.left=`${ne}px`,E.style.top=`${re}px`,E.style.width=`${U}px`}s.classList.add("preview-active"),s.appendChild(E),G();const x=E.querySelector("iframe");let A=null,R=null;C&&(A=document.createElement("button"),A.type="button",A.className="card-preview-mobile-close-portal",A.setAttribute("aria-label","Fragmanı kapat"),A.title="Fragmanı kapat",A.innerHTML='<i data-lucide="x"></i>',R=()=>{const B=E.getBoundingClientRect();A.style.top=`${Math.max(8,B.top+12)}px`,A.style.left=`${Math.max(8,B.right-52)}px`},document.body.appendChild(A),requestAnimationFrame(R),window.addEventListener("resize",R,{passive:!0}),G(A)),E.addEventListener("click",B=>B.stopPropagation()),E.addEventListener("touchend",B=>B.stopPropagation(),{passive:!0});const L=E.querySelector(".card-preview-sound"),N=E.querySelector(".card-preview-close-btn");E.querySelector(".card-preview-detail")?.addEventListener("click",()=>{Co(),W()});const z=(B,D=[])=>{x?.contentWindow?.postMessage(JSON.stringify({event:"command",func:B,args:D}),"*")},K=()=>{z(u?"unMute":"mute"),u&&z("setVolume",[75]),L.classList.toggle("is-on",u),L.title=u?"Sesi kapat":"Sesi aç",L.setAttribute("aria-label",L.title),L.innerHTML=`<i data-lucide="${u?"volume-2":"volume-x"}"></i>`,G()},W=()=>{R&&window.removeEventListener("resize",R);try{A?.remove()}catch{}try{E.remove()}catch{}s.classList.remove("preview-active")};E._closePreview=W;const O=window.setTimeout(()=>{E.classList.add("video-ready")},1500);x.addEventListener("load",()=>{window.clearTimeout(O),E.classList.add("video-ready"),u&&window.setTimeout(K,180)},{once:!0}),L.addEventListener("click",B=>{B.preventDefault(),B.stopPropagation(),u=!u,sessionStorage.setItem("cinepulse_preview_sound",u?"on":"off"),K(),window.setTimeout(K,180)}),N&&N.addEventListener("click",B=>{B.preventDefault(),B.stopPropagation(),W()}),A?.addEventListener("click",B=>{B.preventDefault(),B.stopPropagation(),W()})}).catch(()=>{})}if(i&&r){const s=new WeakMap;e.addEventListener("pointerover",l=>{const u=l.target.closest(".media-card");if(!u||l.relatedTarget&&u.contains(l.relatedTarget))return;const p=u.getAttribute("data-id"),h=u.getAttribute("data-type")||"movie",g=ln(h==="tv"?"tv":"movie",p),v=setTimeout(()=>o(u,g),850);s.set(u,v)}),e.addEventListener("pointerout",l=>{const u=l.target.closest(".media-card");if(!u||l.relatedTarget&&u.contains(l.relatedTarget))return;const p=s.get(u);p&&clearTimeout(p),s.delete(u);const h=u.querySelector(".card-hover-video-preview");if(h)try{h.remove()}catch{}u.classList.remove("preview-active")})}if(n&&r){const l=new WeakMap;e.addEventListener("touchstart",p=>{if(p.target.closest(".card-hover-video-preview"))return;const h=p.target.closest(".media-card");if(!h)return;const g={opened:!1,timer:null},v=h.getAttribute("data-id"),b=h.getAttribute("data-type")||"movie",w=ln(b==="tv"?"tv":"movie",v);g.timer=setTimeout(()=>{g.timer=null,g.opened=!0,t=Date.now()+900;try{navigator.vibrate?.(40)}catch{}o(h,w)},600),l.set(h,g)},{passive:!0});const u=p=>{const h=p.target.closest(".media-card"),g=h&&l.get(h);g&&(g.timer&&clearTimeout(g.timer),g.timer=null,(!g.opened||p.type!=="touchend")&&l.delete(h))};e.addEventListener("touchend",u,{passive:!0}),e.addEventListener("touchmove",u,{passive:!0}),e.addEventListener("touchcancel",u,{passive:!0}),e.addEventListener("touchend",p=>{const h=p.target.closest(".media-card");(h&&l.get(h))?.opened&&l.delete(h)},{passive:!0})}}let Ki=null;function sh(){return Ki||("IntersectionObserver"in window?(Ki=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&(Ki.unobserve(t.target),hc(t.target))})},{rootMargin:"800px 0px"}),Ki):null)}async function hc(e){if(!e||e.dataset.fanartState)return;e.dataset.fanartState="loading";const t=e.querySelector(".card-poster-img");if(!t)return;const i=await uc(e.dataset.tmdbid,e.dataset.mediatype||"movie");if(!i?.image){e.dataset.fanartState="empty";return}const n=u=>new Promise(p=>{const h=new Image;h.onload=()=>p(!0),h.onerror=()=>p(!1),h.src=u}),[a,r]=await Promise.all([n(i.image),i.logo?n(i.logo):Promise.resolve(!0)]);if(!a||!r||!e.isConnected){e.dataset.fanartState="empty";return}t.dataset.backdropSrc=i.image;const o=e.querySelector(".card-fanart-logo");o&&i.logo&&(o.src=i.logo);const s=e.querySelector(".card-poster-wrapper");s?.classList.remove("card-fanart-placeholder"),s?.classList.toggle("card-fanart-composite",!!i.logo),(ft().cardLayout==="landscape"||document.documentElement.classList.contains("cards-landscape"))&&(t.src=i.image),e.dataset.fanartState="loaded"}function dn(e=document){if(ft().cardLayout!=="landscape")return;const i=(e&&e.querySelectorAll?e:document).querySelectorAll(".media-card[data-tmdbid]:not([data-fanart-state])");if(!i.length)return;const n=sh();if(!n){i.forEach(a=>hc(a));return}i.forEach(a=>n.observe(a))}let et=null,Ut=null,wi=0;const dr=new Map,Oa=new Set,oh=10*60*1e3;function lh(){Qp();for(const e of Oa)e.disconnect();Oa.clear()}function ch(e){try{const t=sessionStorage.getItem(`cinepulse_home_fast_v7_${e?"kids":"adult"}`);if(!t)return null;const i=JSON.parse(t);return!i?.savedAt||Date.now()-i.savedAt>oh?null:i.data?.isKid===e?i.data:null}catch{return null}}function ua(e){try{sessionStorage.setItem(`cinepulse_home_fast_v7_${e.isKid?"kids":"adult"}`,JSON.stringify({savedAt:Date.now(),data:e}))}catch{}}function nn(){et=null,Ut=null,wi++;try{sessionStorage.removeItem("cinepulse_home_fast_v2_kids"),sessionStorage.removeItem("cinepulse_home_fast_v2_adult"),sessionStorage.removeItem("cinepulse_home_fast_v3_kids"),sessionStorage.removeItem("cinepulse_home_fast_v3_adult"),sessionStorage.removeItem("cinepulse_home_fast_v4_kids"),sessionStorage.removeItem("cinepulse_home_fast_v4_adult"),sessionStorage.removeItem("cinepulse_home_fast_v5_kids"),sessionStorage.removeItem("cinepulse_home_fast_v5_adult"),sessionStorage.removeItem("cinepulse_home_fast_v6_kids"),sessionStorage.removeItem("cinepulse_home_fast_v6_adult"),sessionStorage.removeItem("cinepulse_home_fast_v7_kids"),sessionStorage.removeItem("cinepulse_home_fast_v7_adult")}catch{}dr.clear(),Object.keys(ke).forEach(e=>{ke[e].page=1,ke[e].loading=!1,ke[e].exhausted=!1})}const ke={"rail-popular-tv":{page:1,loading:!1,exhausted:!1,fetcher:Xn},"rail-popular-movies":{page:1,loading:!1,exhausted:!1,fetcher:Zn},"rail-top-tv":{page:1,loading:!1,exhausted:!1,fetcher:e=>ki("tv",e)},"rail-top-movies":{page:1,loading:!1,exhausted:!1,fetcher:e=>ki("movie",e)},"rail-anime":{page:1,loading:!1,exhausted:!1,fetcher:Qn},"rail-adult-animation":{page:1,loading:!1,exhausted:!1,fetcher:_a},"rail-cartoon-series":{page:1,loading:!1,exhausted:!1,fetcher:Jn},"rail-documentary":{page:1,loading:!1,exhausted:!1,fetcher:er}};function Me({id:e,icon:t,title:i,accent:n,items:a}){if(!a||a.length===0)return"";const r=dr.get(e)||[],s=[...a,...r].map(l=>_t(l)).join("");return`
    <section class="rail-section">
      <div class="container">
        <div class="rail-header">
          <h2 class="rail-title">
            <span class="rail-icon-pill" style="--rail-color: ${n};">
              <i data-lucide="${t}" style="width:15px;height:15px;"></i>
            </span>
            ${i}
          </h2>
        </div>
        <div class="card-rail" id="${e}">
          ${s}
          <div class="rail-sentinel" data-rail="${e}"></div>
        </div>
      </div>
    </section>
  `}function dh(e){return!e||e.length===0?"":`
    <section class="rail-section">
      <div class="container">
        <div class="rail-header">
          <h2 class="rail-title">
            <span class="rail-icon-pill" style="--rail-color: var(--primary);">
              <i data-lucide="history" style="width:15px;height:15px;"></i>
            </span>
            İzlemeye Devam Et
          </h2>
        </div>
        <div class="card-rail continue-rail" id="continue-watching-rail">
          ${e.slice(0,24).map(n=>`
    <div class="continue-card-wrapper" data-id="${n.id}" data-season="${n.season||1}" data-episode="${n.episode||1}">
      ${_t(n,{isContinueSection:!0})}
      <button class="btn-delete-history" title="Geçmişten Kaldır" aria-label="Kaldır">
        <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
      </button>
    </div>
  `).join("")}
        </div>
      </div>
    </section>
  `}function Ro(e){const t=e.querySelectorAll(".rail-sentinel");t.length!==0&&t.forEach(i=>{const n=i.getAttribute("data-rail"),a=document.getElementById(n);if(!a)return;const r=async()=>{const s=ke[n];if(!s||s.loading||s.exhausted)return;s.loading=!0;const l=document.createElement("div");l.className="rail-loader",l.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:22px;height:22px;color:var(--text-muted);"></i>',i.before(l),G(l);try{const u=new Set(Array.from(a.querySelectorAll(".media-card[data-id]")).map(g=>String(g.getAttribute("data-id"))).filter(Boolean));let p=[];for(let g=0;g<4&&p.length===0;g+=1){s.page+=1;const v=await s.fetcher(s.page);if(!v||v.length===0){s.exhausted=!0;break}p=v.filter(b=>{const w=String(b?.id||"");return!w||u.has(w)?!1:(u.add(w),!0)})}if(l.remove(),p.length===0||!a.isConnected){s.loading=!1;return}const h=dr.get(n)||[];dr.set(n,[...h,...p]),p.forEach(g=>{const v=document.createElement("div");v.innerHTML=_t(g);const b=v.firstElementChild;b&&(a.insertBefore(b,i),b.addEventListener("click",()=>{const w=b.getAttribute("data-id"),k=b.getAttribute("data-type");window.location.hash=`#detail?type=${k}&id=${w}`}))}),G(a),dn(a)}catch{l.remove()}s.loading=!1};a.addEventListener("scroll",()=>{a.scrollWidth-(a.scrollLeft+a.clientWidth)<600&&r()},{passive:!0});const o=new IntersectionObserver(s=>{s.forEach(l=>{l.isIntersecting&&r()})},{root:a,rootMargin:"0px 400px 0px 0px",threshold:0});o.observe(i),Oa.add(o)})}async function uh(){const e=wi,t=Ct();let i,n,a,r,o,s,l,u,p,h,g,v;et||(et=ch(t));let b=null,w=!1,k=!1;if(et&&et.isKid===t)({trending:i,popularTV:n,popularMovies:a,topRatedTV:r,topRatedMovies:o,animeItems:s,docItems:l,kidsAdventures:u,adultAnimationItems:p,cartoonSeriesItems:h,kidsAnimationItems:g,kidsClassicCartoonItems:v}=et),b=Ut,w=!b;else if(t){if(b=Promise.all([Ds(1),xa(1),Ps(1),Bs(1)]).then(L=>{e===wi&&([u,s,g,v]=L,et={isKid:!0,trending:i,popularTV:n,popularMovies:a,kidsAdventures:u,animeItems:s,kidsAnimationItems:g,kidsClassicCartoonItems:v},k&&ua(et),w=!0)}).catch(()=>{w=!0}),Ut=b,b.then(()=>{Ut===b&&(Ut=null)}),[n,a]=await Promise.all([ka(1),Sa(1)]),i=[...a||[],...n||[]].filter(L=>L.backdrop_path&&Jt(L)).slice(0,10),e!==wi)return null;w||(et={isKid:!0,trending:i,popularTV:n,popularMovies:a})}else{if(b=Promise.all([ki("tv",1),ki("movie",1),Qn(1),er(1),_a(1),Jn(1)]).then(L=>{e===wi&&([r,o,s,l,p,h]=L,et={isKid:!1,trending:i,popularTV:n,popularMovies:a,topRatedTV:r,topRatedMovies:o,animeItems:s,docItems:l,adultAnimationItems:p,cartoonSeriesItems:h},k&&ua(et),w=!0)}).catch(()=>{w=!0}),Ut=b,b.then(()=>{Ut===b&&(Ut=null)}),[i,n,a]=await Promise.all([ol("all","week",1),Xn(1),Zn(1)]),e!==wi)return null;w||(et={isKid:!1,trending:i,popularTV:n,popularMovies:a})}k=!0,w&&et&&ua(et);const f=w,y=Is(),E=xs(y);let C;t?C=[...a||[],...n||[]].filter(N=>N.backdrop_path&&Jt(N)).slice(0,10):C=i;const x=eh(C);t?(ke["rail-kids-animation"]||(ke["rail-kids-animation"]={page:1,loading:!1,exhausted:!1,fetcher:Ps}),ke["rail-kids-classics"]||(ke["rail-kids-classics"]={page:1,loading:!1,exhausted:!1,fetcher:Bs}),ke["rail-kids-movies"]||(ke["rail-kids-movies"]={page:1,loading:!1,exhausted:!1,fetcher:Sa}),ke["rail-kids-adventures"]||(ke["rail-kids-adventures"]={page:1,loading:!1,exhausted:!1,fetcher:Ds}),ke["rail-anime"]||(ke["rail-anime"]={page:1,loading:!1,exhausted:!1,fetcher:xa})):(ke["rail-popular-tv"]||(ke["rail-popular-tv"]={page:1,loading:!1,exhausted:!1,fetcher:Xn}),ke["rail-popular-movies"]||(ke["rail-popular-movies"]={page:1,loading:!1,exhausted:!1,fetcher:Zn}),ke["rail-top-tv"]||(ke["rail-top-tv"]={page:1,loading:!1,exhausted:!1,fetcher:L=>ki("tv",L)}),ke["rail-top-movies"]||(ke["rail-top-movies"]={page:1,loading:!1,exhausted:!1,fetcher:L=>ki("movie",L)}),ke["rail-anime"]||(ke["rail-anime"]={page:1,loading:!1,exhausted:!1,fetcher:Qn}),ke["rail-adult-animation"]||(ke["rail-adult-animation"]={page:1,loading:!1,exhausted:!1,fetcher:_a}),ke["rail-cartoon-series"]||(ke["rail-cartoon-series"]={page:1,loading:!1,exhausted:!1,fetcher:Jn})),t||ke["rail-documentary"]||(ke["rail-documentary"]={page:1,loading:!1,exhausted:!1,fetcher:er}),Object.values(ke).forEach(L=>{L.loading=!1});let A="";return t?A=`
      ${Me({id:"rail-kids-movies",icon:"sparkles",title:"🎈 En Çok Sevilen Animasyon & Çocuk Filmleri",accent:"#ec4899",items:a})}

      ${g&&g.length>0?Me({id:"rail-kids-animation",icon:"sparkles",title:"Çocuk Animasyonları & Yeni Çizgi Diziler",accent:"#fb7185",items:g}):""}

      ${v&&v.length>0?Me({id:"rail-kids-classics",icon:"palette",title:"Çizgi Dizi Dünyası & Unutulmaz Klasikler",accent:"#38bdf8",items:v}):""}

      ${u&&u.length>0?Me({id:"rail-kids-adventures",icon:"compass",title:"⭐ Aile ve Fantastik Sinema Kuşağı",accent:"#38bdf8",items:u}):""}

      ${s&&s.length>0?Me({id:"rail-anime",icon:"smile",title:"🎌 Çocuk & Genç Anime Dünyası",accent:"#a855f7",items:s}):""}
    `:A=`
      ${Me({id:"rail-popular-tv",icon:"tv-2",title:"Trend Diziler & Yapımlar",accent:"#14b8a6",items:n})}

      ${p&&p.length>0?Me({id:"rail-adult-animation",icon:"sparkles",title:"Yetişkin Animasyonları & Çizgi Diziler",accent:"#fb7185",items:p}):""}

      ${h&&h.length>0?Me({id:"rail-cartoon-series",icon:"wand-2",title:"Çizgi Dizi Dünyası & Unutulmaz Klasikler",accent:"#38bdf8",items:h}):""}

      ${Me({id:"rail-popular-movies",icon:"clapperboard",title:"Tüm Zamanların En Popüler Filmleri",accent:"#a78bfa",items:a})}

      ${Me({id:"rail-top-movies",icon:"award",title:"⭐ Sinema Tarihinin Başyapıtları (IMDb 8.5+)",accent:"#fbbf24",items:o})}

      ${Me({id:"rail-top-tv",icon:"star",title:"Kült & En Yüksek Puanlı Diziler",accent:"#34d399",items:r})}

      ${s&&s.length>0?Me({id:"rail-anime",icon:"sparkles",title:"🎌 Popüler Anime Evreni (TR Dublaj & Altyazı)",accent:"#ec4899",items:s}):""}

      ${l&&l.length>0?Me({id:"rail-documentary",icon:"globe",title:"🌍 İlham Veren Kült Belgeseller",accent:"#38bdf8",items:l}):""}
    `,{html:`
    <div class="home-view ${t?"is-kids-mode":""}">
      ${x}

      ${dh(E)}

      ${A}
    </div>
  `,init:L=>{const N=C&&C.length>0?C:i;N&&N.length>0&&th(N),kt(L);const z=W=>{W.querySelectorAll(".card-rail").forEach(O=>{const B=O.id;if(B){let D=cr.get(B);if(typeof D!="number")try{const J=sessionStorage.getItem(`cinepulse_rail_${B}`);J&&(D=parseFloat(J))}catch{}typeof D=="number"&&D>0&&(O.scrollLeft=D,requestAnimationFrame(()=>{O.scrollLeft=D})),O.addEventListener("scroll",()=>{cr.set(B,O.scrollLeft)},{passive:!0})}O.addEventListener("wheel",D=>{Math.abs(D.deltaX)>Math.abs(D.deltaY)||(D.preventDefault(),O.scrollBy({left:D.deltaY*2.5,behavior:"smooth"}))},{passive:!1})})};if(z(L),L.querySelectorAll(".spotlight-hero, .spotlight-mini").forEach(W=>{W.addEventListener("click",()=>{const O=W.getAttribute("data-id"),B=W.getAttribute("data-type");O&&B&&(window.location.hash=`#detail?type=${B}&id=${O}`)})}),L.querySelector(".spotlight-hero-btn")?.addEventListener("click",W=>{W.stopPropagation();const O=L.querySelector(".spotlight-hero");if(O){const B=O.getAttribute("data-id"),D=O.getAttribute("data-type");window.location.hash=`#detail?type=${D}&id=${B}`}}),Ro(L),b&&!f){const W=L.querySelector(".home-view");b.then(()=>{if({topRatedTV:r,topRatedMovies:o,animeItems:s,docItems:l,kidsAdventures:u,adultAnimationItems:p,cartoonSeriesItems:h,kidsAnimationItems:g,kidsClassicCartoonItems:v}=et||{},!W?.isConnected||!(window.location.hash||"#home").startsWith("#home"))return;const O=document.createElement("div");O.className="home-more-rails",O.innerHTML=t?`
            ${Me({id:"rail-kids-animation",icon:"sparkles",title:"Çocuk Animasyonları & Yeni Çizgi Diziler",accent:"#fb7185",items:g})}
            ${Me({id:"rail-kids-classics",icon:"palette",title:"Çizgi Dizi Dünyası & Unutulmaz Klasikler",accent:"#38bdf8",items:v})}
            ${Me({id:"rail-kids-adventures",icon:"compass",title:"⭐ Aile ve Fantastik Sinema Kuşağı",accent:"#38bdf8",items:u})}
            ${Me({id:"rail-anime",icon:"smile",title:"🎌 Çocuk & Genç Anime Dünyası",accent:"#a855f7",items:s})}
          `:`
            ${Me({id:"rail-adult-animation",icon:"sparkles",title:"Yetişkin Animasyonları & Çizgi Diziler",accent:"#fb7185",items:p})}
            ${Me({id:"rail-cartoon-series",icon:"wand-2",title:"Çizgi Dizi Dünyası & Unutulmaz Klasikler",accent:"#38bdf8",items:h})}
            ${Me({id:"rail-top-movies",icon:"award",title:"⭐ Sinema Tarihinin Başyapıtları (IMDb 8.5+)",accent:"#fbbf24",items:o})}
            ${Me({id:"rail-top-tv",icon:"star",title:"Kült & En Yüksek Puanlı Diziler",accent:"#34d399",items:r})}
            ${Me({id:"rail-anime",icon:"sparkles",title:"🎌 Popüler Anime Evreni (TR Dublaj & Altyazı)",accent:"#ec4899",items:s})}
            ${Me({id:"rail-documentary",icon:"globe",title:"🌍 İlham Veren Kült Belgeseller",accent:"#38bdf8",items:l})}
          `,W.append(O),G(O),kt(O),z(O),Ro(O)})}L.querySelectorAll(".btn-delete-history").forEach(W=>{W.addEventListener("click",O=>{O.stopPropagation();const B=W.closest(".continue-card-wrapper");if(!B)return;const D=B.getAttribute("data-id");va(D),ee("İçerik izleme geçmişinden kaldırıldı.","info"),B.style.transition="all 0.28s ease-out",B.style.transform="scale(0.85)",B.style.opacity="0",setTimeout(()=>{B.remove();const J=L.querySelector("#continue-watching-rail");J&&J.children.length===0&&J.closest(".rail-section")?.remove()},300)})});const K=()=>{if(!(window.location.hash||"#home").startsWith("#home"))return;const W=L.querySelector(".home-view");if(!W?.isConnected)return;const O=xs(Is()),B=L.querySelector("#continue-watching-rail")?.closest(".rail-section");if(O&&O.length>0){const J=O.slice(0,24).map(V=>`
            <div class="continue-card-wrapper" data-id="${V.id}" data-season="${V.season||1}" data-episode="${V.episode||1}">
              ${_t(V,{isContinueSection:!0})}
              <button class="btn-delete-history" title="Geçmişten Kaldır" aria-label="Kaldır">
                <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
              </button>
            </div>
          `).join("");if(B){const V=B.querySelector("#continue-watching-rail");V&&(V.innerHTML=J)}else{const V=`
              <section class="rail-section">
                <div class="container">
                  <div class="rail-header">
                    <h2 class="rail-title">
                      <span class="rail-icon-pill" style="--rail-color: var(--primary);">
                        <i data-lucide="history" style="width:15px;height:15px;"></i>
                      </span>
                      İzlemeye Devam Et
                    </h2>
                  </div>
                  <div class="card-rail continue-rail" id="continue-watching-rail">
                    ${J}
                  </div>
                </div>
              </section>
            `,U=W.querySelector(".hero-slider-section")||W.querySelector(".rail-section");U?U.insertAdjacentHTML("afterend",V):W.insertAdjacentHTML("afterbegin",V)}G(L),kt(L),L.querySelectorAll(".btn-delete-history").forEach(V=>{V.addEventListener("click",U=>{U.stopPropagation();const Y=V.closest(".continue-card-wrapper");if(!Y)return;const ne=Y.getAttribute("data-id");va(ne),ee("İçerik izleme geçmişinden kaldırıldı.","info"),Y.style.transition="all 0.28s ease-out",Y.style.transform="scale(0.85)",Y.style.opacity="0",setTimeout(()=>{Y.remove();const re=L.querySelector("#continue-watching-rail");re&&re.children.length===0&&re.closest(".rail-section")?.remove()},300)})})}else B&&B.remove()};window.addEventListener("cinepulse_data_changed",K),window.addEventListener("sineflix_data_changed",K)}}}async function ph({tvId:e,seriesTitle:t,originalTitle:i="",seriesOverview:n="",seasons:a=[],posterPath:r="",backdropPath:o="",isAnime:s=!1,spoilerFree:l=!1}){const u=a.filter(k=>k.season_number>0);u.length===0&&a.length>0&&u.push(a[0]);const p=u.length>0?u[0].season_number:1,h=u.length>0&&u[0].episode_count||10,g=qr(e,p,h);let v=!!l,b=null;return{html:`
    <div class="season-selector-wrapper">
      <div class="season-selector-header">
        <div style="display: flex; align-items: center; gap: 0.65rem;">
          <span class="rail-icon-pill" style="--rail-color: #f59e0b; width: 28px; height: 28px;">
            <i data-lucide="layers" style="width: 15px; height: 15px;"></i>
          </span>
          <h2 class="season-selector-title" style="margin: 0;">Sezonlar ve Bölümler</h2>
        </div>

        <!-- Bulk Mark Current Season Watched Button -->
        <button id="btn-mark-season-all" class="btn-secondary" style="padding: 0.45rem 1.1rem; font-size: 0.82rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.45rem; cursor: pointer; ${g?"background: rgba(16, 185, 129, 0.2); border-color: #10b981; color: #10b981;":""}">
          <i data-lucide="${g?"check-circle-2":"check-check"}" style="width: 14px; height: 14px;"></i>
          <span>${g?"Bu Sezon İzlendi":"Bu Sezonu İzlendi İşaretle"}</span>
        </button>
      </div>

      <!-- Luxury Segmented Season Pills Track with PC Arrows & Scroll Support -->
      <div class="season-tabs-wrapper" style="position: relative; display: flex; align-items: center; margin-bottom: 1.5rem; width: 100%;">
        <button class="season-nav-arrow left" id="btn-season-prev" title="Önceki Sezonlar" aria-label="Geri">
          <i data-lucide="chevron-left" style="width:16px;height:16px;"></i>
        </button>
        <div class="season-pills-track" id="season-tabs-bar">
          ${u.map(k=>`
            <button class="season-pill ${k.season_number===p?"active":""}" data-season="${k.season_number}" data-ep-count="${k.episode_count||10}">
              ${k.name||`${k.season_number}. Sezon`} <span style="opacity: 0.75; font-size: 0.72rem; margin-left: 0.2rem;">(${k.episode_count} Bölüm)</span>
            </button>
          `).join("")}
        </div>
        <button class="season-nav-arrow right" id="btn-season-next" title="Sonraki Sezonlar" aria-label="İleri">
          <i data-lucide="chevron-right" style="width:16px;height:16px;"></i>
        </button>
      </div>

      <div class="episodes-grid" id="episode-grid-container">
        <div style="padding: 3rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;">
          <i data-lucide="loader-2" class="spin-loader" style="width: 24px; height: 24px; margin-bottom: 0.5rem;"></i>
          <div>Bölümler yükleniyor...</div>
        </div>
      </div>
    </div>
  `,init:k=>{if(!k)return;let f=p,y=h;const E=()=>{const z=k.querySelector("#btn-mark-season-all");if(!z)return;const K=qr(e,f,y),W=z.querySelector("span"),O=z.querySelector("i");W&&(W.textContent=K?"Bu Sezon İzlendi":"Bu Sezonu İzlendi İşaretle"),O&&O.setAttribute("data-lucide",K?"check-circle-2":"check-check"),K?(z.style.background="rgba(16, 185, 129, 0.2)",z.style.borderColor="#10b981",z.style.color="#10b981"):(z.style.background="",z.style.borderColor="",z.style.color=""),G()};Un(e,t,n,f,k,r,o,i,u,E,s,v);const C=z=>{if(z&&z.detail&&z.detail.isProgressUpdate&&document.getElementById("player-modal"))return;const K=k.querySelector("#episode-grid-container");K&&(K.querySelectorAll(".episode-card").forEach(W=>{const O=parseInt(W.getAttribute("data-season"),10),B=parseInt(W.getAttribute("data-episode"),10),D=Gt(e,O,B),J=D?D.progressPercent:0,V=D?D.completed||J>=90:!1,U=D&&!V&&D.currentTime>0,Y=W.querySelector(".badge-watched-status"),ne=W.querySelector(".btn-mark-ep-watched"),re=W.querySelector(".card-progress-fill"),ie=W.querySelector(".btn-mark-ep-halfway");Y&&(V?(Y.innerHTML='<i data-lucide="check" style="width:11px; height:11px"></i> İZLENDİ',Y.style.background="var(--accent-green)",Y.style.color="#fff",Y.style.display="inline-flex"):U?(Y.innerHTML='<i data-lucide="clock" style="width:11px; height:11px"></i> YARIDA',Y.style.background="rgba(245, 158, 11, 0.95)",Y.style.color="#000",Y.style.display="inline-flex"):Y.style.display="none"),ne&&(V?(ne.classList.add("watched"),ne.style.background="#10b981",ne.style.borderColor="#10b981",ne.title="İzlendi işaretini kaldır"):(ne.classList.remove("watched"),ne.style.background="rgba(0,0,0,0.65)",ne.style.borderColor="rgba(255,255,255,0.3)",ne.title="İzlendi olarak işaretle")),ie&&(ie.style.background=U?"#f59e0b":"rgba(0,0,0,0.65)",ie.style.borderColor=U?"#f59e0b":"rgba(255,255,255,0.3)"),re&&(re.style.width=`${J}%`,re.style.background=V?"var(--accent-green)":"#fbbf24")}),G()),E()};window.addEventListener("sineflix_data_changed",C),k.querySelectorAll(".season-pill").forEach(z=>{z.addEventListener("click",K=>{K.preventDefault(),k.querySelectorAll(".season-pill").forEach(W=>W.classList.remove("active")),z.classList.add("active"),z.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"}),f=parseInt(z.getAttribute("data-season"),10),y=parseInt(z.getAttribute("data-ep-count"),10)||10,Un(e,t,n,f,k,r,o,i,u,E,s,v),E()})});const x=k.querySelector(".season-pill.active");x&&setTimeout(()=>{x.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})},120);const A=k.querySelector("#season-tabs-bar"),R=k.querySelector("#btn-season-prev"),L=k.querySelector("#btn-season-next");if(A){R?.addEventListener("click",B=>{B.preventDefault(),A.scrollBy({left:-260,behavior:"smooth"})}),L?.addEventListener("click",B=>{B.preventDefault(),A.scrollBy({left:260,behavior:"smooth"})}),A.addEventListener("wheel",B=>{B.deltaY!==0&&A.scrollWidth>A.clientWidth&&(B.preventDefault(),A.scrollLeft+=B.deltaY)},{passive:!1});let z=!1,K=0,W=0,O=!1;A.addEventListener("mousedown",B=>{B.button===0&&(z=!0,O=!1,A.classList.add("dragging"),K=B.pageX-A.offsetLeft,W=A.scrollLeft)}),window.addEventListener("mousemove",B=>{if(!z)return;const J=(B.pageX-A.offsetLeft-K)*1.5;Math.abs(J)>4&&(O=!0),A.scrollLeft=W-J}),window.addEventListener("mouseup",()=>{z&&(z=!1,A.classList.remove("dragging"),setTimeout(()=>{O=!1},50))}),A.addEventListener("click",B=>{O&&(B.preventDefault(),B.stopPropagation())},!0)}const N=k.querySelector("#btn-mark-season-all");N&&N.addEventListener("click",z=>{z.preventDefault();const W=!qr(e,f,y);Jc(e,f,y,W,{title:t,posterPath:r,backdropPath:o,type:s?"anime":"tv",isAnime:s}),ee(W?`${f}. Sezonun tüm bölümleri izlendi!`:`${f}. Sezon izlenmedi olarak işaretlendi.`,W?"success":"info");const O=k.querySelector("#episode-grid-container");O&&(O.querySelectorAll(".episode-card").forEach(B=>{const D=B.querySelector(".badge-watched-status"),J=B.querySelector(".btn-mark-ep-watched");D&&(D.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',D.style.background="var(--accent-green)",D.style.color="#fff",D.style.display=W?"inline-flex":"none"),J&&(W?(J.classList.add("watched"),J.style.background="#10b981",J.style.borderColor="#10b981",J.title="İzlendi işaretini kaldır"):(J.classList.remove("watched"),J.style.background="rgba(0,0,0,0.65)",J.style.borderColor="rgba(255,255,255,0.3)",J.title="İzlendi olarak işaretle"))}),G()),E()}),b=z=>{v=!!z,Un(e,t,n,f,k,r,o,i,u,E,s,v)}},setSpoilerSafe(k){v=!!k,b?.(v)}}}function hh(e){const t=Be().filter(i=>String(i?.id)===String(e)&&(Number(i.currentTime)>0||i.completed||Number(i.progressPercent)>0));return t.length?t.reduce((i,n)=>{const a={season:Math.max(1,Number(n.season)||1),episode:Math.max(1,Number(n.episode)||1)};return a.season>i.season||a.season===i.season&&a.episode>i.episode?a:i},{season:1,episode:1}):{season:1,episode:1}}async function Un(e,t,i,n,a,r="",o="",s="",l=[],u=null,p=!1,h=!1){const g=a.querySelector("#episode-grid-container");if(!g)return;g.innerHTML=`<div style="padding: 3rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;"><i data-lucide="loader-2" class="spin-loader" style="width: 24px; height: 24px; margin-bottom: 0.5rem;"></i><div>${n}. Sezon bölümleri getiriliyor...</div></div>`,G();let v=null;try{v=await wd(e,n)}catch{}if(!v||!v.episodes||v.episodes.length===0){g.innerHTML=`
      <div style="padding: 3rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;">
        <p style="margin-bottom: 0.75rem;">Bu sezon için bölüm verisi getirilemedi.</p>
        <button id="btn-retry-season-episodes" class="btn-secondary" style="padding: 0.45rem 1rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
          <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
          <span>Tekrar Dene</span>
        </button>
      </div>
    `,G(),a.querySelector("#btn-retry-season-episodes")?.addEventListener("click",()=>{Un(e,t,i,n,a,r,o,s,l,u,p,h)});return}const b=h?hh(e):null,w=h?v.episodes.filter(f=>n<b.season||n===b.season&&Number(f.episode_number)<=b.episode+1):v.episodes;if(h&&w.length===0){g.innerHTML='<div class="spoiler-safe-locked"><i data-lucide="shield-check"></i><strong>Bu sezon spoiler korumasında</strong><span>Önceki sezona ilerledikçe bölüm detayları burada açılır.</span></div>',G();return}const k=h?`<div class="spoiler-safe-notice"><i data-lucide="shield-check"></i><span>Spoilersız keşif açık · S${b.season} B${b.episode+1} sonrasının detayları gizli.</span></div>`:"";g.innerHTML=k+w.map(f=>{const y=f.episode_number,E=f.name||`${y}. Bölüm`;let C=f.overview?f.overview.trim():"";(!C||C.length<5)&&(i&&i.length>10?C=`${y}. Bölüm: ${i}`:C=`${t} ${n}. Sezon ${y}. Bölüm Türkçe Dublaj ve Altyazılı yüksek kalitede kesintisiz HD izle.`);const x=C.length>90,A=st(f.still_path,Ze.STILL_MEDIUM),R=f.air_date||"",L=f.runtime?`${f.runtime} dk`:"",N=Gt(e,n,y),z=N?N.progressPercent:0,K=N?N.completed||z>=90:!1,W=N&&!K&&N.currentTime>0,O=z>0?`
      <div class="card-progress-bar">
        <div class="card-progress-fill" style="width: ${z}%; background: ${K?"var(--accent-green)":"#fbbf24"};"></div>
      </div>
    `:"";let B="";return K?B=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.5rem; left: 0.5rem; background: var(--accent-green); z-index: 4;">
          <i data-lucide="check" style="width:11px; height:11px"></i> İZLENDİ
        </span>
      `:W?B=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.5rem; left: 0.5rem; background: rgba(245, 158, 11, 0.95); color: #000; font-weight: 800; z-index: 4;">
          <i data-lucide="clock" style="width:11px; height:11px"></i> YARIDA
        </span>
      `:B=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.5rem; left: 0.5rem; background: var(--accent-green); display: none; z-index: 4;">
          <i data-lucide="check" style="width:11px; height:11px"></i> İZLENDİ
        </span>
      `,`
      <div class="episode-card" data-tv-id="${e}" data-season="${n}" data-episode="${y}" data-title="${E}">
        <div class="episode-thumb-wrap">
          <img src="${A}" alt="${E}" loading="lazy" onerror="this.onerror=null; this.src='${on}';" />
          <span class="episode-number-chip">${n}x${y<10?"0"+y:y}</span>
          ${B}
          
          <div class="episode-play-overlay">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--primary-gradient); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.6);">
              <i data-lucide="play" style="width: 20px; height: 20px; fill: #fff; color: #fff; margin-left: 2px;"></i>
            </div>
          </div>

          <!-- Top Right Action Controls: Mark Watched & Halfway -->
          <div style="position: absolute; top: 0.5rem; right: 0.5rem; display: flex; gap: 0.35rem; z-index: 5;">
            <button class="btn-mark-ep-halfway" data-tv-id="${e}" data-season="${n}" data-episode="${y}" title="Yarıda Bırakıldı (20. dk)" style="width: 28px; height: 28px; border-radius: 50%; background: ${W?"#f59e0b":"rgba(0,0,0,0.65)"}; border: 1px solid ${W?"#f59e0b":"rgba(255,255,255,0.3)"}; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
              <i data-lucide="clock" style="width: 13px; height: 13px;"></i>
            </button>

            <button class="btn-mark-ep-watched ${K?"watched":""}" data-tv-id="${e}" data-season="${n}" data-episode="${y}" title="${K?"İzlendi işaretini kaldır":"İzlendi olarak işaretle"}" style="width: 28px; height: 28px; border-radius: 50%; background: ${K?"#10b981":"rgba(0,0,0,0.65)"}; border: 1px solid ${K?"#10b981":"rgba(255,255,255,0.3)"}; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
              <i data-lucide="check" style="width: 14px; height: 14px;"></i>
            </button>
          </div>

          ${O}
        </div>

        <div class="episode-info">
          <div class="episode-header-row">
            <span class="episode-title" title="${E}">${y}. ${E}</span>
            <span class="episode-duration">${L||R}</span>
          </div>
          
          <div class="episode-overview-container">
            <div class="episode-overview ${x?"truncated":""}" data-full="${C}">
              ${C}
            </div>
            ${x?`
              <button class="btn-toggle-overview" style="color: var(--primary); font-weight: 700; font-size: 0.78rem; margin-top: 0.25rem; display: inline-flex; align-items: center; gap: 0.2rem; cursor: pointer; background: none; border: none; padding: 0;">
                <span>Devamını Oku</span>
                <i data-lucide="chevron-down" style="width: 12px; height: 12px;"></i>
              </button>
            `:""}
          </div>

          <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: auto; padding-top: 0.45rem; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06);">
            <span>${R}</span>
            <span class="btn-play-episode-trigger" style="color: var(--primary); font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.25rem;">
              <span>Oynat</span>
              <i data-lucide="play" style="width: 11px; height: 11px; fill: currentColor;"></i>
            </span>
          </div>
        </div>
      </div>
    `}).join(""),G(),a.querySelectorAll(".btn-toggle-overview").forEach(f=>{f.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation();const E=f.closest(".episode-overview-container"),C=E?E.querySelector(".episode-overview"):null;if(!C)return;const x=f.querySelector("span"),A=f.querySelector("i");C.classList.contains("truncated")?(C.classList.remove("truncated"),x&&(x.textContent="Daralt"),A&&A.setAttribute("data-lucide","chevron-up")):(C.classList.add("truncated"),x&&(x.textContent="Devamını Oku"),A&&A.setAttribute("data-lucide","chevron-down")),G()})}),g.querySelectorAll(".btn-mark-ep-watched").forEach(f=>{f.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation();const E=parseInt(f.getAttribute("data-season"),10),C=parseInt(f.getAttribute("data-episode"),10),x=f.closest(".episode-card"),R=Qo(e,E,C,{title:t,posterPath:r,backdropPath:o,type:p?"anime":"tv",isAnime:p}).completed;if(ee(R?`S${E} B${C} izlendi olarak işaretlendi!`:`S${E} B${C} izlendi işareti kaldırıldı.`,R?"success":"info"),R?(f.classList.add("watched"),f.style.background="#10b981",f.style.borderColor="#10b981",f.title="İzlendi işaretini kaldır"):(f.classList.remove("watched"),f.style.background="rgba(0,0,0,0.65)",f.style.borderColor="rgba(255,255,255,0.3)",f.title="İzlendi olarak işaretle"),x){const L=x.querySelector(".badge-watched-status");L&&(L.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',L.style.background="var(--accent-green)",L.style.color="#fff",L.style.display=R?"inline-flex":"none")}typeof u=="function"&&u(),G()})}),g.querySelectorAll(".btn-mark-ep-halfway").forEach(f=>{f.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation();const E=parseInt(f.getAttribute("data-season"),10),C=parseInt(f.getAttribute("data-episode"),10),x=f.closest(".episode-card");if(ba(e,E,C,1200,{title:t,posterPath:r,backdropPath:o,type:p?"anime":"tv",isAnime:p,duration:2700}),f.style.background="#f59e0b",f.style.borderColor="#f59e0b",x){const A=x.querySelector(".badge-watched-status");A&&(A.innerHTML='<i data-lucide="clock" style="width:12px; height:12px"></i> YARIDA (20:00)',A.style.background="rgba(245, 158, 11, 0.9)",A.style.color="#000",A.style.display="inline-flex")}ee(`S${E} B${C} 20. dakikada yarıda bırakıldı olarak işaretlendi!`,"info"),G()})}),g.querySelectorAll(".episode-card").forEach(f=>{const y=x=>{if(x&&x.target&&(x.target.closest(".btn-mark-ep-watched")||x.target.closest(".btn-mark-ep-halfway")||x.target.closest(".btn-toggle-overview")))return;x&&(x.preventDefault(),x.stopPropagation());const A=parseInt(f.getAttribute("data-season"),10),R=parseInt(f.getAttribute("data-episode"),10),L=f.getAttribute("data-title"),N=Gt(e,A,R),z=N?N.currentTime:0;Ri({type:p?"anime":"tv",isAnime:p,tmdbId:e,title:`${t} - S${A}E${R}: ${L}`,seriesTitle:t,originalTitle:s||t,season:A,episode:R,posterPath:r,backdropPath:o,currentTime:z,seasonsList:l,maxEpisodes:v.episodes?v.episodes.length:0})};f.addEventListener("click",y);const E=f.querySelector(".episode-thumb-wrap");E&&E.addEventListener("click",y);const C=f.querySelector(".btn-play-episode-trigger");C&&C.addEventListener("click",y)})}let jn=null;async function fh(e,t="",i=""){gi();const n=document.createElement("div");n.id="cast-explorer-modal-root",n.className="cast-explorer-backdrop",document.body.appendChild(n),jn=n,n.innerHTML=`
    <div class="cast-explorer-dialog">
      <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
      </button>
      <div class="cast-explorer-loading">
        <div class="cast-explorer-spinner"></div>
        <span>${t||"Oyuncu"} bilgileri ve filmografisi yükleniyor...</span>
      </div>
    </div>
  `,G(n);const a=n.querySelector("#btn-close-cast-explorer");a&&(a.onclick=()=>gi()),n.onclick=R=>{R.target===n&&gi()};const r=R=>{R.key==="Escape"&&(gi(),window.removeEventListener("keydown",r))};window.addEventListener("keydown",r);const o=await kd(e);if(!o){n.innerHTML=`
      <div class="cast-explorer-dialog">
        <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
          <i data-lucide="x" style="width: 20px; height: 20px;"></i>
        </button>
        <div class="cast-explorer-loading">
          <i data-lucide="alert-circle" style="width: 36px; height: 36px; color: #ef4444;"></i>
          <span>Oyuncu bilgileri alınamadı.</span>
        </div>
      </div>
    `,G(n);return}const s=o.name||t,l=o.profile_path?st(o.profile_path,Ze.POSTER_MEDIUM):i||Gn,u=o.birthday?o.birthday.substring(0,4):"",p=o.place_of_birth||"",h=o.known_for_department==="Acting"?"Oyuncu":o.known_for_department==="Directing"?"Yönetmen":o.known_for_department||"Sanatçı",g=o.biography&&o.biography.trim().length>20?o.biography:`${s}, sinema ve televizyon dünyasında yer aldığı yapımlarla tanınan başarılı bir sanatçıdır.`,v=o.combined_credits?.cast||[],b=o.combined_credits?.crew||[],w=[...v,...b],k=new Set,f=[];for(const R of w){if(!R||!R.id)continue;const L=`${R.media_type||"movie"}_${R.id}`;k.has(L)||(k.add(L),R.poster_path&&f.push(R))}f.sort((R,L)=>(L.popularity||0)-(R.popularity||0));const y=f.filter(R=>R.media_type==="movie"||!R.media_type&&R.title).length,E=f.filter(R=>R.media_type==="tv"||!R.media_type&&R.name).length;n.innerHTML=`
    <div class="cast-explorer-dialog">
      <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
      </button>

      <!-- Actor Hero Header -->
      <div class="cast-explorer-header">
        <div class="cast-explorer-avatar-box">
          <img src="${l}" alt="${s}" class="cast-explorer-avatar" onerror="this.onerror=null; this.src='${Gn}';" />
        </div>
        <div class="cast-explorer-bio-box">
          <div class="cast-explorer-name-row">
            <h2>${s}</h2>
            <span class="cast-explorer-dept-tag">${h}</span>
          </div>
          <div class="cast-explorer-meta-row">
            ${u?`<span><i data-lucide="calendar" style="width:13px;height:13px;"></i> D: ${u}</span>`:""}
            ${p?`<span><i data-lucide="map-pin" style="width:13px;height:13px;"></i> ${p}</span>`:""}
            <span><i data-lucide="film" style="width:13px;height:13px;"></i> ${f.length} Yapım</span>
          </div>
          <p class="cast-explorer-bio-text">${g}</p>
        </div>
      </div>

      <!-- Filmography Tabs -->
      <div class="cast-explorer-tabs">
        <button class="cast-tab-btn active" data-filter="all">Tümü (${f.length})</button>
        <button class="cast-tab-btn" data-filter="movie">Filmler (${y})</button>
        <button class="cast-tab-btn" data-filter="tv">Diziler (${E})</button>
      </div>

      <!-- Media Cards Grid -->
      <div class="cast-explorer-grid" id="cast-explorer-grid">
        ${f.map(R=>_t(R)).join("")}
      </div>
    </div>
  `,G(n);const C=n.querySelector("#btn-close-cast-explorer");C&&(C.onclick=()=>gi());const x=n.querySelector("#cast-explorer-grid");x&&(kt(x),x.addEventListener("click",()=>{setTimeout(()=>gi(),150)}));const A=n.querySelectorAll(".cast-tab-btn");A.forEach(R=>{R.onclick=()=>{A.forEach(z=>z.classList.remove("active")),R.classList.add("active");const L=R.getAttribute("data-filter");let N=f;L==="movie"?N=f.filter(z=>z.media_type==="movie"||!z.media_type&&z.title):L==="tv"&&(N=f.filter(z=>z.media_type==="tv"||!z.media_type&&z.name)),x&&(x.innerHTML=N.length>0?N.map(z=>_t(z)).join(""):'<div class="cast-empty-state">Bu kategoride yapım bulunamadı.</div>',G(x))}})}function gi(){if(jn){try{jn.remove()}catch{}jn=null}}const mh="https://api.tvmaze.com",gh=5500,fc=30*60*1e3,mc="cinepulse_tvmaze_cache_v1",un=new Map;function yh(){try{const e=sessionStorage.getItem(mc);if(!e)return;const t=JSON.parse(e);t&&typeof t=="object"&&Object.entries(t).forEach(([i,n])=>{n?.savedAt&&Date.now()-n.savedAt<fc&&un.set(i,n)})}catch{}}function vh(){try{const e={};let t=0;for(const[i,n]of un.entries()){if(t++>=80)break;e[i]=n}sessionStorage.setItem(mc,JSON.stringify(e))}catch{}}function ps(e){const t=un.get(e);if(t){if(Date.now()-t.savedAt>fc){un.delete(e);return}return t.data}}function hs(e,t){un.set(e,{savedAt:Date.now(),data:t}),vh()}async function ur(e){try{const t=await fetch(`${mh}${e}`,{headers:{Accept:"application/json"},signal:AbortSignal.timeout(gh)});return t.ok?await t.json():null}catch{return null}}function $o(e){return String(e||"").toLowerCase().replace(/[^a-z0-9çğıöşü ]/gi," ").replace(/\s+/g," ").trim()}function gc(e,t){const i=$o(e),n=$o(t);return!i||!n?!1:i===n?!0:i.includes(n)||n.includes(i)}function Mo(e){return e?{season:e.season??null,number:e.number??null,name:e.name||"",airdate:e.airdate||"",airstamp:e.airstamp||"",runtime:e.runtime||null}:null}function bh(e){switch(e){case"Running":return"Devam ediyor";case"Ended":return"Sonlandı";case"To Be Determined":return"Belirsiz";case"In Development":return"Yapım aşamasında";default:return e||""}}async function wh(e){const t=`lookup:${e}`,i=ps(t);if(i!==void 0)return i;const n=await ur(`/lookup/shows?${e}`);return hs(t,n||null),n||null}async function yc(e){if(!e)return null;const t=`show:${e}`,i=ps(t);if(i!==void 0)return i;const n=await ur(`/shows/${e}?embed[]=nextepisode&embed[]=previousepisode`),a=n?{tvmazeId:n.id,name:n.name||"",status:n.status||"",statusLabel:bh(n.status),premiered:n.premiered||"",officialSite:n.officialSite||"",thetvdbId:n.externals?.thetvdb??null,imdbId:n.externals?.imdb||"",nextEpisode:Mo(n._embedded?.nextepisode),previousEpisode:Mo(n._embedded?.previousepisode)}:null;return hs(t,a),a}async function kh(e){const t=String(e||"").trim();if(!t)return null;const i=t.startsWith("tt")?t:`tt${t}`,a=(await wh(`imdb=${encodeURIComponent(i)}`))?.id||null;return a?yc(a):null}function vc(e,t){const i=parseInt(String(e?.premiered||"").substring(0,4),10),n=parseInt(String(t||""),10);return!n||!i?0:Math.abs(i-n)}function _h(e,t,i){let n=null,a=1/0;for(const r of e){if(!r||!gc(r.name,t))continue;const o=vc(r,i);if(o>1)continue;const s=o*10+(r.status==="Running"?0:1);s<a&&(a=s,n=r)}return n}async function Sh(e,t){const i=String(e||"").trim();if(i.length<2)return null;const n=`search:${i}:${t||""}`,a=ps(n);if(a!==void 0)return a;let r=null;const o=await ur(`/singlesearch/shows?q=${encodeURIComponent(i)}`);if(o&&gc(o.name,i)&&vc(o,t)<=1&&(r=o),!r){const l=await ur(`/search/shows?q=${encodeURIComponent(i)}`),u=Array.isArray(l)?l.map(p=>p?.show).filter(Boolean):[];r=_h(u,i,t)}const s=r?await yc(r.id):null;return hs(n,s),s}async function xh({imdbId:e,title:t,year:i}={}){let n=await kh(e);if(n||(n=await Sh(t,i)),!n)return null;const a=n.nextEpisode;return{showName:n.name,statusLabel:n.statusLabel,officialSite:n.officialSite,nextEpisode:a,previousEpisode:n.previousEpisode,nextLabel:a?Eh(a):"",nextAirdateLabel:a?Ah(a.airdate,a.airstamp):""}}function Eh(e){if(!e)return"";const t=e.season!==null&&e.season!==void 0,i=e.number!==null&&e.number!==void 0,n=t&&e.season>=1900;return t&&!n&&i?`S${e.season} B${e.number}`:n&&e.name?e.name:i?`B${e.number}`:e.name||""}const Th=["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];function Ah(e,t){const i=t?new Date(t):e?new Date(`${e}T21:00:00`):null;if(!i||Number.isNaN(i.getTime()))return e||"";const n=new Date,a=s=>new Date(s.getFullYear(),s.getMonth(),s.getDate()).getTime(),r=Math.round((a(i)-a(n))/864e5),o=t?`${String(i.getHours()).padStart(2,"0")}:${String(i.getMinutes()).padStart(2,"0")}`:"";return r<0?"Yayınlandı":r===0?o?`Bugün ${o}`:"Bugün":r===1?o?`Yarın ${o}`:"Yarın":r<=7?`${r} gün sonra`:`${i.getDate()} ${Th[i.getMonth()]}`}yh();const Po="cinepulse.decision-room.autoplay";function Ch(e,t){try{const i=JSON.parse(sessionStorage.getItem(Po)||"null");return sessionStorage.removeItem(Po),i&&String(i.id)===String(t)&&i.type===e&&Date.now()-Number(i.createdAt||0)<15e3?i:null}catch{return null}}function Lh(e){if(!e||e<=0)return"";const t=Math.floor(e/60),i=e%60;return t>0?`${t} sa ${i>0?i+" dk":""} (${e} dk)`:`${e} dk`}async function Ih(e="tv",t){const i=typeof e=="object"&&e!==null?e.type||"tv":e||"tv",n=typeof e=="object"&&e!==null?e.id:t;let a=i==="series"||i==="tv"||i==="anime"?"tv":i==="movie"?"movie":"tv",r=await Ns(a,n);if(r||(a=a==="tv"?"movie":"tv",r=await Ns(a,n)),!r)return{html:'<div class="container" style="padding: 10rem 0; text-align: center;"><h2>İçerik bulunamadı.</h2></div>',init:()=>{}};const o=!!(r.seasons&&r.seasons.length>0)||a==="tv",s=o?"tv":"movie",l=ds(r)||i==="anime"||a==="anime"||Fe(n);l&&_e(n);const u=r.title||r.name||"Detay",p=r.original_title||r.original_name||"",h=st(r.backdrop_path,Ze.BACKDROP_ORIGINAL),g=st(r.poster_path,Ze.POSTER_MEDIUM),v=r.vote_average?r.vote_average.toFixed(1):"8.5",b=(r.first_air_date||r.release_date||"").substring(0,4),w=r.overview&&r.overview.trim().length>15?r.overview:qe(r,s),k=r.genres||[],f=r.runtime?r.runtime*60:6600,y=Zc(n),E=Ya(n),C=s==="tv"?Fr(n):null,x=s==="movie"?Gt(n,1,1):null,A=s==="movie"?sn(n,1,1):!1,R=s==="tv"?Hr(n,r.seasons||[]):!1,L=s==="movie"?A:R;let N=s==="movie"?"Filmi İzle":"1. Sezon 1. Bölümü İzle";if(s==="tv"&&C){const te=ii(C.currentTime);N=`Devam Et <span class="play-btn-subinfo">S${C.season} B${C.episode}${te?" • "+te:""}</span>`}else s==="movie"&&x&&x.currentTime>0&&(N=`Devam Et <span class="play-btn-subinfo">${ii(x.currentTime)}</span>`);const z=r.credits?.crew?r.credits.crew.filter(te=>te.job==="Director").map(te=>te.name):[],K=r.created_by?r.created_by.map(te=>te.name):[],W=z.length>0?z.slice(0,2).join(", "):K.length>0?K.slice(0,2).join(", "):"",O=(parseFloat(v)/2).toFixed(1),B=Math.floor(O),D=O%1>=.4,J="★".repeat(Math.min(5,B))+(D&&B<5?"½":""),V=r.credits&&r.credits.cast?r.credits.cast.slice(0,10):[];let U=null,Y=!1;s==="tv"&&r.seasons&&(U=await ph({tvId:n,seriesTitle:u,originalTitle:p,seriesOverview:w,seasons:r.seasons,posterPath:r.poster_path,backdropPath:r.backdrop_path,isAnime:l,spoilerFree:Y}));const ne=r.recommendations?r.recommendations.results.slice(0,6):[],re=s==="movie"?A?"Film İzlendi":"İzlendi Olarak İşaretle":R?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle",ie=r.runtime?`
    <span class="badge" style="background: rgba(245, 158, 11, 0.18); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); font-weight: 700; display: inline-flex; align-items: center; gap: 0.35rem;">
      <i data-lucide="clock" style="width:13px; height:13px"></i>
      <span>${Lh(r.runtime)}</span>
    </span>
  `:"";return{html:`
    <div class="detail-view">
      <div class="detail-hero-banner">
        <div class="detail-backdrop-img" style="background-image: url('${h}')"></div>
        <div class="detail-backdrop-gradient"></div>

        <div class="detail-container">
          <button class="detail-back-btn" id="btn-detail-back" title="Önceki Sayfaya Geri Dön">
            <i data-lucide="arrow-left" style="width:16px;height:16px;"></i>
            <span>Geri Dön</span>
          </button>
          
          <div class="detail-layout">
            <!-- Poster Card with Subtle Ambient Shadow -->
            <div class="detail-poster-col">
              <img class="detail-poster-img" src="${g}" alt="${u}" onerror="this.onerror=null; this.src='${on}';" />
            </div>

            <!-- Content Details -->
            <div class="detail-info-col">
              <!-- Frosted Badges Row -->
              <div class="detail-badge-deck">
                <span class="badge badge-type">${l?o?"ANİME DİZİSİ":"ANİME FİLMİ":s==="tv"?"DİZİ":"FİLM"}</span>
                <span class="badge badge-imdb">
                  <i data-lucide="star" style="width:13px; height:13px; fill: currentColor"></i> ${v} IMDb
                </span>
                <span class="badge badge-letterboxd" title="Letterboxd Derecelendirmesi">
                  <span style="letter-spacing: 0.05em; font-weight: 800;">${J}</span> ${O}
                </span>
                <span class="badge">${b}</span>
                ${ie}
                ${r.number_of_seasons?`<span class="badge">${r.number_of_seasons} Sezon</span>`:""}
                ${r.number_of_episodes?`<span class="badge">${r.number_of_episodes} Bölüm</span>`:""}
                ${s==="tv"?'<span class="badge" id="detail-next-episode-badge" style="display: none; background: rgba(34, 197, 94, 0.16); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.4); font-weight: 700; align-items: center; gap: 0.35rem;"></span>':""}
                ${!r.runtime&&r.episode_run_time&&r.episode_run_time.length>0?`<span class="badge">${r.episode_run_time[0]} dk / bölüm</span>`:""}
              </div>

              <!-- Main Title -->
              <h1 class="detail-heading-title">${u}</h1>

              <!-- Editorial Subtitle (Original Title & Director / Creator) -->
              <div class="detail-editorial-sub">
                ${p&&p!==u?`<span class="detail-orig-name">${p}</span>`:""}
                ${W?`
                  <span class="detail-director-pill">
                    <strong style="color: var(--primary);">${s==="tv"?"YARATICI":"YÖNETMEN"}:</strong> ${W}
                  </span>
                `:""}
              </div>

              <!-- Genres -->
              <div class="detail-genre-row">
                ${k.map(te=>`<span class="detail-genre-chip">${te.name}</span>`).join("")}
              </div>

              <!-- Storyline -->
              <div class="detail-storyline-wrapper">
                <p class="detail-storyline truncated" id="detail-storyline-text">${w}</p>
                ${w.length>120?'<button class="btn-storyline-expand" id="btn-expand-storyline"><span>Devamını Oku</span><i data-lucide="chevron-down" style="width:14px;height:14px"></i></button>':""}
              </div>

              ${s==="tv"?'<label class="spoiler-discovery-toggle"><input id="detail-spoiler-free-toggle" type="checkbox" /><span><i data-lucide="shield-check"></i><b>Spoilersız keşfet</b><small>İzleme ilerlemenin sonrasındaki bölüm başlıkları, görselleri ve özetleri gizlenir.</small></span></label>':""}

              <!-- Oyuncular & Sanatçılar (Letterboxd & Pentagram Style Carousel with PC Mouse Scroll & Nav Buttons) -->
              ${V.length>0?`
                <div class="detail-cast-block">
                  <div class="detail-cast-header">
                    <span class="detail-cast-label">Oyuncular & Ekip</span>
                    <div class="detail-cast-nav-arrows">
                      <button class="cast-nav-btn" id="btn-cast-prev" title="Önceki Oyuncular" aria-label="Geri">
                        <i data-lucide="chevron-left" style="width:14px;height:14px;"></i>
                      </button>
                      <button class="cast-nav-btn" id="btn-cast-next" title="Sonraki Oyuncular" aria-label="İleri">
                        <i data-lucide="chevron-right" style="width:14px;height:14px;"></i>
                      </button>
                    </div>
                  </div>
                  <div class="detail-cast-rail" id="detail-cast-rail">
                    ${V.map(te=>{const P=te.profile_path?st(te.profile_path,Ze.POSTER_SMALL):Gn,M=te.character?te.character.split("/")[0].trim():"";return`
                        <div class="detail-actor-pill" data-person-id="${te.id}" data-person-name="${te.name}" title="${te.name}${M?" ("+M+")":""} • Filmografiyi Gör" style="cursor: pointer;">
                          <img src="${P}" alt="${te.name}" class="detail-actor-avatar" onerror="this.onerror=null; this.src='${Gn}';" />
                          <div style="display: flex; flex-direction: column; min-width: 0;">
                            <span class="detail-actor-name">${te.name}</span>
                            ${M?`<span style="font-size: 0.65rem; color: var(--text-muted); line-height: 1; max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${M}</span>`:""}
                          </div>
                        </div>
                      `}).join("")}
                  </div>
                </div>
              `:""}

              <!-- Modern Hero Action Deck -->
              <div class="detail-action-deck">
                <!-- Main Action Row (Play + Trailer) -->
                <div class="detail-action-main-row">
                  ${s==="movie"?`
                    <button class="btn-play-primary" id="btn-play-movie">
                      <i data-lucide="play" style="fill: currentColor; width: 20px; height: 20px;"></i>
                      <span>${N}</span>
                    </button>
                  `:`
                    <button class="btn-play-primary" id="btn-resume-series">
                      <i data-lucide="play" style="fill: currentColor; width: 20px; height: 20px;"></i>
                      <span>${N}</span>
                    </button>
                  `}

                  <button class="btn-detail-trailer" id="btn-watch-trailer">
                    <i data-lucide="youtube" style="width: 18px; height: 18px;"></i>
                    <span>Fragman İzle</span>
                  </button>
                </div>

                <!-- Compact Quick Action Tiles Grid -->
                <div class="detail-action-subgrid">
                  <button class="btn-action-tile ${y?"active-fav":""}" id="btn-toggle-fav">
                    <i data-lucide="heart" style="${y?"fill: var(--primary); color: var(--primary)":""}"></i>
                    <span>${y?"Favorilerimde":"Favori"}</span>
                  </button>

                  <button class="btn-action-tile ${E?"active-watch":""}" id="btn-toggle-watchlist">
                    <i data-lucide="${E?"check":"plus"}"></i>
                    <span>${E?"Listemde":"Listem"}</span>
                  </button>

                  <button class="btn-action-tile ${L?"active-watched":""}" id="btn-toggle-watched-detail">
                    <i data-lucide="${L?"check-circle-2":"check"}"></i>
                    <span>${re}</span>
                  </button>

                  <button class="btn-action-tile" id="btn-mark-halfway-detail" title="Kaldığım Yer (Yarıda Bırakıldı)">
                    <i data-lucide="clock" style="color: #fbbf24;"></i>
                    <span>⏳ Yarıda Bırak</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section class="section" style="padding-top: 2rem;">
        <div class="container">
          ${s==="tv"&&U?U.html:""}

          ${ne.length>0?`
            <div style="margin-top: 4rem;">
              <h2 class="section-title" style="margin-bottom: 1.5rem;">
                <i data-lucide="thumbs-up"></i> Benzer Önerilen Yapımlar
              </h2>
              <div class="media-grid">
                ${ne.map(te=>_t(te)).join("")}
              </div>
            </div>
          `:""}
        </div>
      </section>
    </div>
  `,init:te=>{if(!te)return;let P=Ch(s,n);const M=te.querySelector("#btn-detail-back");M&&M.addEventListener("click",ae=>{ae.preventDefault(),window.history.length>1?window.history.back():window.location.hash="#home"}),U&&U.init(te);const j=te.querySelector("#detail-spoiler-free-toggle");j&&(j.checked=Y,j.addEventListener("change",()=>{Y=j.checked,U?.setSpoilerSafe(Y),ee(Y?"Spoilersız keşif açıldı. Sonraki bölüm detayları gizlendi.":"Spoilersız keşif kapatıldı.","info")}));const Q=te.querySelector("#btn-play-movie"),de=async()=>{if(!Q||Q.disabled)return;Q.disabled=!0;const ae=Q.innerHTML;Q.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px;fill:currentColor"></i> <span>Yükleniyor...</span>',G();try{const m=Gt(n,1,1);await Ri({type:l?"anime":"movie",isAnime:l,tmdbId:n,title:u,seriesTitle:u,originalTitle:p,posterPath:r.poster_path,backdropPath:r.backdrop_path,duration:f,currentTime:m?m.currentTime:0,roomSync:P?{roomCode:P.roomCode,mediaId:n,type:s,season:1,episode:1,initialSync:P.initialSync||null}:null})}catch{ee("Film açılırken hata oluştu, lütfen tekrar deneyin.","error")}finally{Q.disabled=!1,Q.innerHTML=ae,G()}};Q&&Q.addEventListener("click",de);const S=te.querySelector("#btn-resume-series"),T=async()=>{if(!S||S.disabled)return;S.disabled=!0;const ae=S.innerHTML;S.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px;fill:currentColor"></i> <span>Yükleniyor...</span>',G();try{const m=P;P=null;const c=Fr(n),d=m?.season||(c?c.season:1),_=m?.episode||(c?c.episode:1),I=m?0:c?c.currentTime:0;await Ri({type:l?"anime":"tv",isAnime:l,tmdbId:n,title:`${u} - S${d}E${_}`,seriesTitle:u,originalTitle:p,season:d,episode:_,posterPath:r.poster_path,backdropPath:r.backdrop_path,currentTime:I,seasonsList:r.seasons||[],roomSync:m?{roomCode:m.roomCode,mediaId:n,type:s,season:d,episode:_,initialSync:m.initialSync||null}:null})}catch{ee("İçerik açılırken hata oluştu, lütfen tekrar deneyin.","error")}finally{S.disabled=!1,S.innerHTML=ae,G()}};S&&S.addEventListener("click",ae=>{ae.preventDefault(),T()}),P&&window.setTimeout(()=>{s==="movie"?de():T()},0);const q=te.querySelector("#btn-watch-trailer");q&&q.addEventListener("click",async()=>{q.disabled=!0;const ae=q.innerHTML;q.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px"></i> <span>Yükleniyor...</span>',G();try{const m=await ln(s,n,u);m?lc({title:u,trailerInfo:m,mediaId:n,mediaType:l?"anime":s}):ee("Bu yapım için resmi fragman bulunamadı.","info")}catch{ee("Fragman yüklenirken bir hata oluştu.","error")}finally{q.disabled=!1,q.innerHTML=ae,G()}});const Z=te.querySelector("#btn-toggle-fav");Z&&Z.addEventListener("click",()=>{const ae=Qc({...r,type:l?"anime":s,isAnime:l,media_type:s});ee(ae?"Favorilere eklendi!":"Favorilerden çıkarıldı.",ae?"success":"info");const m=Z.querySelector("i"),c=Z.querySelector("span");m&&c&&(m.style.fill=ae?"var(--primary)":"none",m.style.color=ae?"var(--primary)":"currentColor",c.textContent=ae?"Favorilerimde":"Favorilere Ekle")});const we=te.querySelector("#btn-toggle-watchlist");we&&we.addEventListener("click",()=>{const ae=tl({...r,type:l?"anime":s,isAnime:l,media_type:s});ee(ae?"İzleme listesine eklendi!":"İzleme listesinden çıkarıldı.",ae?"success":"info");const m=we.querySelector("i"),c=we.querySelector("span");m&&c&&(m.setAttribute("data-lucide",ae?"check":"plus"),G(),c.textContent=ae?"Listemde":"İzleme Listeme Ekle")});const se=te.querySelector("#btn-toggle-watched-detail");se&&se.addEventListener("click",ae=>{if(ae.preventDefault(),s==="movie"){const c=Qo(n,1,1,{title:u,posterPath:r.poster_path,backdropPath:r.backdrop_path,type:"movie",duration:f}).completed;ee(c?"✓ Film izlendi olarak işaretlendi!":"Film izlendi işareti kaldırıldı.",c?"success":"info"),c?se.classList.add("btn-watched-active"):se.classList.remove("btn-watched-active"),se.innerHTML=`
              <i data-lucide="${c?"check-circle-2":"check"}"></i>
              <span>${c?"Film İzlendi":"İzlendi Olarak İşaretle"}</span>
            `,G()}else{const c=!Hr(n,r.seasons||[]);Gc(n,r.seasons||[],c,{title:u,posterPath:r.poster_path,backdropPath:r.backdrop_path,type:l?"anime":"tv",isAnime:l}),ee(c?"✓ Dizinin tüm bölümleri izlendi olarak işaretlendi!":"Tüm bölümler izlenmedi yapıldı.",c?"success":"info"),c?se.classList.add("btn-watched-active"):se.classList.remove("btn-watched-active"),se.innerHTML=`
              <i data-lucide="${c?"check-circle-2":"check"}"></i>
              <span>${c?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle"}</span>
            `,G(),te.querySelectorAll(".episode-card").forEach(_=>{const I=_.querySelector(".badge-watched-status"),$=_.querySelector(".btn-mark-ep-watched");I&&(I.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',I.style.background="var(--accent-green)",I.style.color="#fff",I.style.display=c?"inline-flex":"none"),$&&(c?($.classList.add("watched"),$.style.background="#10b981",$.style.borderColor="#10b981"):($.classList.remove("watched"),$.style.background="rgba(0,0,0,0.65)",$.style.borderColor="rgba(255,255,255,0.3)"))});const d=te.querySelector("#btn-mark-season-all");if(d){const _=d.querySelector("span"),I=d.querySelector("i");_&&(_.textContent=c?"Bu Sezon İzlendi":"Bu Sezonu İzlendi İşaretle"),I&&I.setAttribute("data-lucide",c?"check-circle-2":"check-check"),c?(d.style.background="rgba(16, 185, 129, 0.2)",d.style.borderColor="#10b981",d.style.color="#10b981"):(d.style.background="",d.style.borderColor="",d.style.color="")}G()}});const pe=ae=>{if(ae&&ae.detail&&ae.detail.isProgressUpdate&&document.getElementById("player-modal"))return;const m=s==="movie"?sn(n,1,1):!1,c=s==="tv"?Hr(n,r.seasons||[]):!1,d=s==="movie"?m:c;if(se){d?se.classList.add("btn-watched-active"):se.classList.remove("btn-watched-active");const $=s==="movie"?d?"Film İzlendi":"İzlendi Olarak İşaretle":d?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle";se.innerHTML=`
            <i data-lucide="${d?"check-circle-2":"check"}"></i>
            <span>${$}</span>
          `}const _=te.querySelector("#btn-play-movie");if(_&&s==="movie"){const $=Gt(n,1,1);if($&&$.currentTime>0&&!$.completed){const H=ii($.currentTime);_.innerHTML=`<i data-lucide="play" style="fill:currentColor"></i> <span>Devam Et <span class="play-btn-subinfo">${H}</span></span>`}}const I=te.querySelector("#btn-resume-series");if(I&&s==="tv"){const $=Fr(n);if($){const H=ii($.currentTime);I.innerHTML=`<i data-lucide="play" style="fill:currentColor"></i> <span>Devam Et <span class="play-btn-subinfo">S${$.season} B${$.episode}${H?" • "+H:""}</span></span>`}}G()};window.addEventListener("sineflix_data_changed",pe);const Ge=te.querySelector("#btn-mark-halfway-detail");Ge&&Ge.addEventListener("click",ae=>{if(ae.preventDefault(),s==="movie"){const m=Math.round(f*.5),c=ii(m);ba(n,1,1,m,{title:u,posterPath:r.poster_path,backdropPath:r.backdrop_path,type:l?"anime":"movie",isAnime:l,duration:f}),ee(`⏳ Film ${c} dakikasında yarıda bırakıldı olarak işaretlendi!`,"info");const d=te.querySelector("#btn-play-movie span");d&&(d.textContent=`Kaldığın Yerden Devam Et (${c})`)}else{const m=C?C.season:1,c=C?C.episode:1;ba(n,m,c,1200,{title:u,posterPath:r.poster_path,backdropPath:r.backdrop_path,type:l?"anime":"tv",isAnime:l,duration:3e3}),ee(`⏳ S${m} B${c} 20. dakikada yarıda bırakıldı olarak işaretlendi!`,"info");const d=te.querySelector("#btn-resume-series span");d&&(d.textContent=`Kaldığın Yerden Devam Et (S${m} B${c} • 20:00)`)}});const Je=te.querySelector("#btn-expand-storyline"),Ue=te.querySelector("#detail-storyline-text");Je&&Ue&&Je.addEventListener("click",()=>{const ae=!Ue.classList.contains("truncated");Ue.classList.toggle("truncated");const m=Je.querySelector("span"),c=Je.querySelector("i");m&&(m.textContent=ae?"Devamını Oku":"Daralt"),c&&(c.style.transform=ae?"rotate(0deg)":"rotate(180deg)")});const Ie=te.querySelector("#detail-cast-rail"),De=te.querySelector("#btn-cast-prev"),ze=te.querySelector("#btn-cast-next");if(Ie){De&&De.addEventListener("click",_=>{_.preventDefault(),Ie.scrollBy({left:-280,behavior:"smooth"})}),ze&&ze.addEventListener("click",_=>{_.preventDefault(),Ie.scrollBy({left:280,behavior:"smooth"})}),Ie.addEventListener("wheel",_=>{_.deltaY!==0&&(_.preventDefault(),Ie.scrollLeft+=_.deltaY)},{passive:!1});let ae=!1,m=0,c=0;Ie.addEventListener("mousedown",_=>{ae=!0,Ie.classList.add("dragging"),m=_.pageX-Ie.offsetLeft,c=Ie.scrollLeft});const d=()=>{ae=!1,Ie.classList.remove("dragging")};Ie.addEventListener("mouseleave",d),Ie.addEventListener("mouseup",d),Ie.addEventListener("mousemove",_=>{if(!ae)return;_.preventDefault();const $=(_.pageX-Ie.offsetLeft-m)*1.5;Ie.scrollLeft=c-$}),Ie.querySelectorAll(".detail-actor-pill").forEach(_=>{_.addEventListener("click",I=>{I.preventDefault();const $=_.getAttribute("data-person-id"),H=_.getAttribute("data-person-name");$&&fh($,H)})})}const We=te.querySelector("#detail-next-episode-badge");We&&s==="tv"&&(async()=>{try{const ae=await xh({imdbId:r.external_ids?.imdb_id,title:p||u,year:b});if(!ae?.nextEpisode||!We.isConnected)return;const m=ae.nextLabel||"",c=ae.nextAirdateLabel||"";if(!m&&!c||c==="Yayınlandı")return;const d=[m?`Yeni bölüm ${m}`:"Yeni bölüm",c].filter(Boolean).join(" • ");We.innerHTML=`<i data-lucide="calendar-clock" style="width:13px; height:13px"></i><span>${d}</span>`,We.title=`Sonraki bölüm: ${m||"-"}${ae.nextEpisode.name?" — "+ae.nextEpisode.name:""}${c?" • "+c:""} (Kaynak: TVmaze)`,We.style.display="inline-flex",G(We)}catch{}})();const je=te.querySelector(".media-grid");je&&kt(je)}}}function Bo(e,t){const i=us(e);return`
    <div class="continue-card-wrapper library-card-item" 
         data-id="${e.id}" 
         data-season="${e.season||1}" 
         data-episode="${e.episode||1}" 
         data-tab="${t}"
         data-type="${i}"
         data-title="${encodeURIComponent(e.title||e.name||"İçerik")}"
         data-rating="${e.vote_average||e.voteAverage||e.rating||0}"
         data-year="${(e.release_date||e.first_air_date||e.year||"2024").substring(0,4)}">
      ${_t({...e,type:i},{isContinueSection:t==="continue"})}
      <button class="btn-delete-history btn-lib-delete" title="Listeden / Geçmişten Sil" aria-label="Sil">
        <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
      </button>
    </div>
  `}function Rh(){Be();const e=Ls(),t=Wt(),i=Yt(),n=Cs(),a=Bn().length,r=Ur().length;let o="continue";if(typeof window<"u"&&window.sessionStorage)try{const l=window.sessionStorage.getItem("cp_lib_active_tab");l&&["continue","completed","favorites","watchlist","all-episodes"].includes(l)&&(o=l)}catch{}return{html:`
    <div class="library-view">
      <div class="container">
        
        <!-- Header & Action Group -->
        <div class="library-header-row">
          <div>
            <h1 class="library-header-title">
              <i data-lucide="bookmark" style="color: var(--primary)"></i> Kitaplığım & İstatistikler
            </h1>
            <p class="library-header-sub">İzleme geçmişiniz, bitirdikleriniz ve tercihleriniz yerel tarayıcı hafızanızda güvendedir.</p>
          </div>

          <div class="library-action-group">
            <button id="lib-data-modal-btn" class="btn-secondary" style="padding: 0.48rem 1.1rem; border-radius: var(--radius-full); font-size: 0.84rem; display: inline-flex; align-items: center; gap: 0.45rem;">
              <i data-lucide="database" style="width: 15px; height: 15px; color: var(--primary);"></i>
              <span>Veri & Yedek</span>
            </button>
            <input type="file" id="lib-file-input" accept=".json,application/json,text/plain" style="display: none;" />
          </div>
        </div>

        <!-- User Watch Analytics Stats Row -->
        <div class="stats-grid">
          
          <div class="stat-card" style="border-color: rgba(245, 158, 11, 0.25);">
            <div class="stat-card-icon" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24;">
              <i data-lucide="clock"></i>
            </div>
            <div>
              <div class="stat-card-label" style="color: #fbbf24;">Toplam İzleme</div>
              <div id="stat-total-watch" class="stat-card-val">${n.formattedTotal||n.formattedTotalTime||"0 dk"}</div>
            </div>
          </div>

          <div class="stat-card" style="border-color: rgba(59, 130, 246, 0.25);">
            <div class="stat-card-icon" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa;">
              <i data-lucide="tv"></i>
            </div>
            <div>
              <div class="stat-card-label" style="color: #60a5fa;">İzlenen Bölüm</div>
              <div id="stat-eps-count" class="stat-card-val">${n.totalEpisodes??n.episodesCount??0} Bölüm</div>
            </div>
          </div>

          <div class="stat-card" style="border-color: rgba(16, 185, 129, 0.25);">
            <div class="stat-card-icon" style="background: rgba(16, 185, 129, 0.15); color: #34d399;">
              <i data-lucide="film"></i>
            </div>
            <div>
              <div class="stat-card-label" style="color: #34d399;">İzlenen Film</div>
              <div id="stat-movies-count" class="stat-card-val">${n.totalMovies??n.moviesCount??0} Film</div>
            </div>
          </div>

          <div class="stat-card" style="border-color: rgba(239, 68, 68, 0.25);">
            <div class="stat-card-icon" style="background: rgba(239, 68, 68, 0.15); color: #f87171;">
              <i data-lucide="heart"></i>
            </div>
            <div>
              <div class="stat-card-label" style="color: #f87171;">Favori & Listem</div>
              <div id="stat-favs-count" class="stat-card-val">${t.length+i.length} Yapım</div>
            </div>
          </div>

        </div>

        <!-- Section Tabs: Devam Et, Tamamlananlar, Favoriler, Listem, Tüm Bölümler -->
        <div class="library-segmented-nav-track" id="library-tabs">
          <button class="lib-nav-tab ${o==="continue"?"active":""}" data-tab="continue">
            <i data-lucide="clock"></i>
            <span>Devam Et</span>
            <span class="lib-tab-badge" id="tab-count-continue">${a}</span>
          </button>
          <button class="lib-nav-tab ${o==="completed"?"active":""}" data-tab="completed">
            <i data-lucide="check-circle-2"></i>
            <span>Tamamlananlar</span>
            <span class="lib-tab-badge" id="tab-count-completed">${r}</span>
          </button>
          <button class="lib-nav-tab ${o==="favorites"?"active":""}" data-tab="favorites">
            <i data-lucide="heart"></i>
            <span>Favorilerim</span>
            <span class="lib-tab-badge" id="tab-count-favorites">${t.length}</span>
          </button>
          <button class="lib-nav-tab ${o==="watchlist"?"active":""}" data-tab="watchlist">
            <i data-lucide="plus-circle"></i>
            <span>İzleme Listesi</span>
            <span class="lib-tab-badge" id="tab-count-watchlist">${i.length}</span>
          </button>
          <button class="lib-nav-tab ${o==="all-episodes"?"active":""}" data-tab="all-episodes">
            <i data-lucide="history"></i>
            <span>İzleme Geçmişi</span>
            <span class="lib-tab-badge" id="tab-count-all-episodes">${e.length}</span>
          </button>
        </div>

        <!-- Library Luxury Toolbar Deck (Search, Type Filters, Sort & Batch Actions) -->
        <div class="library-toolbar-deck">
          <!-- Search Pill -->
          <div class="library-search-wrapper">
            <i data-lucide="search" class="library-search-icon"></i>
            <input type="text" id="lib-search-input" class="library-search-input" placeholder="Kitaplıkta ara..." autocomplete="off" />
            <i data-lucide="x" id="lib-search-clear" class="library-search-clear" title="Temizle"></i>
          </div>

          <!-- Horizontal Smooth Scrollable Filter Segment (Never Wraps!) -->
          <div class="library-filter-segment-track" id="lib-type-filters">
            <button class="lib-segment-btn active" data-filter="all">Tümü</button>
            <button class="lib-segment-btn" data-filter="movie">🎬 Filmler</button>
            <button class="lib-segment-btn" data-filter="tv">📺 Diziler</button>
            <button class="lib-segment-btn" data-filter="anime">🎌 Animeler</button>
          </div>

          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <!-- Sort Select Pill -->
            <div class="library-sort-pill-wrap">
              <i data-lucide="arrow-down-up" class="library-sort-icon"></i>
              <select id="lib-sort-select" class="library-sort-select" aria-label="Sırala">
                <option value="recent">Son Eklenen</option>
                <option value="rating-desc">En Yüksek IMDb</option>
                <option value="title-asc">İsim (A-Z)</option>
                <option value="year-desc">Yıla Göre</option>
              </select>
            </div>

            <button id="lib-batch-clear-btn" class="btn-lib-clear-batch hidden" title="Bu listedeki tüm kayıtları temizle">
              <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
              <span>Temizle</span>
            </button>
          </div>
        </div>

        <!-- Tab 1: Continue Watching (In-Progress Only) -->
        <div class="tab-content ${o==="continue"?"":"hidden"}" id="tab-continue"></div>

        <!-- Tab 2: Completed / Finished Watch List -->
        <div class="tab-content ${o==="completed"?"":"hidden"}" id="tab-completed"></div>

        <!-- Tab 3: Favorites Grid -->
        <div class="tab-content ${o==="favorites"?"":"hidden"}" id="tab-favorites"></div>

        <!-- Tab 4: Watchlist Grid -->
        <div class="tab-content ${o==="watchlist"?"":"hidden"}" id="tab-watchlist"></div>

        <!-- Tab 5: All Episodes Breakdown -->
        <div class="tab-content ${o==="all-episodes"?"":"hidden"}" id="tab-all-episodes"></div>
      </div>
    </div>
  `,init:l=>{if(!l)return;let u=o,p="all",h="recent",g="";const v=l.querySelector("#lib-search-input"),b=l.querySelector("#lib-search-clear"),w=l.querySelector("#lib-sort-select"),k=l.querySelector("#lib-batch-clear-btn"),f=D=>D==="continue"?Bn():D==="completed"?Ur():D==="favorites"?Wt():D==="watchlist"?Yt():D==="all-episodes"?Ls():[],y=D=>D==="continue"?`
            <div class="library-empty-state">
              <div class="empty-state-icon-wrap">
                <i data-lucide="clock" style="width: 32px; height: 32px;"></i>
              </div>
              <h3 class="empty-state-title">Yarım kalan içerik yok</h3>
              <p class="empty-state-desc">Dizi veya film izlemeye başladığınızda kaldığınız dakika burada otomatik olarak saklanır.</p>
              <a href="#discover" class="btn-primary empty-state-action-btn">
                <i data-lucide="compass" style="width: 16px; height: 16px;"></i>
                <span>Keşfet'e Göz At</span>
              </a>
            </div>
          `:D==="completed"?`
            <div class="library-empty-state">
              <div class="empty-state-icon-wrap" style="background: rgba(16, 185, 129, 0.12); border-color: rgba(16, 185, 129, 0.3); color: #34d399;">
                <i data-lucide="check-circle-2" style="width: 32px; height: 32px;"></i>
              </div>
              <h3 class="empty-state-title">Henüz tamamlanmış içerik yok</h3>
              <p class="empty-state-desc">İzleyip bitirdiğiniz filmler ve tüm sezonlarını tamamladığınız diziler burada listelenir.</p>
              <a href="#movies" class="btn-primary empty-state-action-btn">
                <i data-lucide="film" style="width: 16px; height: 16px;"></i>
                <span>Popüler Filmleri İncele</span>
              </a>
            </div>
          `:D==="favorites"?`
            <div class="library-empty-state">
              <div class="empty-state-icon-wrap" style="background: rgba(239, 68, 68, 0.12); border-color: rgba(239, 68, 68, 0.3); color: #f87171;">
                <i data-lucide="heart" style="width: 32px; height: 32px;"></i>
              </div>
              <h3 class="empty-state-title">Favorilerinize henüz yapım eklemediniz</h3>
              <p class="empty-state-desc">Beğendiğiniz dizi ve filmleri detay sayfasından veya kartlardan favorilere ekleyebilirsiniz.</p>
              <a href="#series" class="btn-primary empty-state-action-btn">
                <i data-lucide="tv" style="width: 16px; height: 16px;"></i>
                <span>Trend Dizilere Bak</span>
              </a>
            </div>
          `:D==="watchlist"?`
            <div class="library-empty-state">
              <div class="empty-state-icon-wrap" style="background: rgba(56, 189, 248, 0.12); border-color: rgba(56, 189, 248, 0.3); color: #38bdf8;">
                <i data-lucide="plus-circle" style="width: 32px; height: 32px;"></i>
              </div>
              <h3 class="empty-state-title">İzleme listeniz henüz boş</h3>
              <p class="empty-state-desc">Daha sonra izlemek istediğiniz içerikleri listenize kaydedip buradan hızlıca ulaşabilirsiniz.</p>
              <a href="#discover" class="btn-primary empty-state-action-btn">
                <i data-lucide="compass" style="width: 16px; height: 16px;"></i>
                <span>İçerik Keşfet</span>
              </a>
            </div>
          `:`
            <div class="library-empty-state">
              <div class="empty-state-icon-wrap" style="background: rgba(168, 85, 247, 0.12); border-color: rgba(168, 85, 247, 0.3); color: #c084fc;">
                <i data-lucide="list-checks" style="width: 32px; height: 32px;"></i>
              </div>
              <h3 class="empty-state-title">Bölüm geçmişi boş</h3>
              <p class="empty-state-desc">Oynatılan veya tek tek işaretlenen tüm bölümler burada kaydedilir.</p>
              <a href="#home" class="btn-primary empty-state-action-btn">
                <i data-lucide="home" style="width: 16px; height: 16px;"></i>
                <span>Ana Sayfaya Dön</span>
              </a>
            </div>
          `;let E=36;const C=()=>{const D=l.querySelector(`#tab-${u}`);if(!D)return;let V=f(u).filter(U=>{const Y=(U.title||U.name||"").toLowerCase(),ne=us(U);return(!g||Y.includes(g.toLowerCase()))&&(p==="all"||ne===p)});if(h==="rating-desc"?V.sort((U,Y)=>{const ne=parseFloat(U.vote_average||U.voteAverage||U.rating||0);return parseFloat(Y.vote_average||Y.voteAverage||Y.rating||0)-ne}):h==="title-asc"?V.sort((U,Y)=>{const ne=U.title||U.name||"",re=Y.title||Y.name||"";return ne.localeCompare(re,"tr")}):h==="year-desc"&&V.sort((U,Y)=>{const ne=parseInt((U.release_date||U.first_air_date||U.year||"0").substring(0,4),10);return parseInt((Y.release_date||Y.first_air_date||Y.year||"0").substring(0,4),10)-ne}),V.length===0)D.innerHTML=y(u);else{const U=V.slice(0,E),Y=V.length>E;D.innerHTML=`
            <div class="media-grid" id="grid-${u}">
              ${U.map(ge=>Bo(ge,u)).join("")}
            </div>
            ${Y?`
              <div class="lib-load-more-wrap" style="text-align: center; margin: 2rem 0 1rem;">
                <button id="btn-lib-load-more" class="btn-secondary" style="padding: 0.6rem 1.8rem; border-radius: var(--radius-full); font-size: 0.88rem;">
                  <span>Daha Fazla Göster (${V.length-E} içerik daha)</span>
                </button>
                <div class="lib-scroll-sentinel" style="height: 1px; margin-top: 1rem;"></div>
              </div>
            `:""}
          `;const ne=D.querySelector(`#grid-${u}`),re=()=>{const ge=ne.querySelectorAll(".library-card-item").length;if(ge>=V.length){const Q=D.querySelector(".lib-load-more-wrap");Q&&Q.remove();return}const te=V.slice(ge,ge+36);E=ge+te.length;const P=te.map(Q=>Bo(Q,u)).join("");ne.insertAdjacentHTML("beforeend",P);const M=V.length-E,j=D.querySelector(".lib-load-more-wrap");if(M>0){const Q=j?.querySelector("#btn-lib-load-more span");Q&&(Q.textContent=`Daha Fazla Göster (${M} içerik daha)`)}else j&&j.remove();Io(te),L(ne),G(ne),kt(ne),dn(ne)},ie=D.querySelector("#btn-lib-load-more");ie&&ie.addEventListener("click",re);const fe=D.querySelector(".lib-scroll-sentinel");fe&&"IntersectionObserver"in window&&new IntersectionObserver(te=>{te.some(P=>P.isIntersecting)&&re()},{rootMargin:"400px 0px"}).observe(fe),L(D),Io(U),kt(D),dn(D)}if(k)if(u==="completed"||u==="all-episodes"||u==="continue"){k.classList.remove("hidden");const U=k.querySelector("span");U&&(U.textContent="Temizle"),u==="completed"?k.title="Tamamlananlar listesini temizle":u==="continue"?k.title="İzlemeye devam et listesini temizle":k.title="Bölüm izleme geçmişini temizle"}else k.classList.add("hidden");G()},x=()=>{E=36,C()},A=l.querySelectorAll("#library-tabs .lib-nav-tab");A.forEach(D=>{D.addEventListener("click",J=>{J.preventDefault();const V=D.getAttribute("data-tab");if(u===V)return;if(A.forEach(Y=>Y.classList.remove("active")),D.classList.add("active"),u=V,typeof window<"u"&&window.sessionStorage)try{window.sessionStorage.setItem("cp_lib_active_tab",V)}catch{}l.querySelectorAll(".tab-content").forEach(Y=>Y.classList.add("hidden"));const U=l.querySelector(`#tab-${u}`);U&&U.classList.remove("hidden"),E=36,C()})});const R=()=>{const D=Cs(),J=l.querySelector("#stat-total-watch")||l.querySelector("#stat-total-time"),V=l.querySelector("#stat-eps-count")||l.querySelector("#stat-episodes-count"),U=l.querySelector("#stat-movies-count"),Y=l.querySelector("#stat-favs-count");J&&(J.textContent=D.formattedTotal||D.formattedTotalTime||"0 dk"),V&&(V.textContent=`${D.totalEpisodes??D.episodesCount??0} Bölüm`),U&&(U.textContent=`${D.totalMovies??D.moviesCount??0} Film`),Y&&(Y.textContent=`${Wt().length+Yt().length} Yapım`);const ne=l.querySelector("#tab-count-continue"),re=l.querySelector("#tab-count-completed"),ie=l.querySelector("#tab-count-favorites"),fe=l.querySelector("#tab-count-watchlist"),ge=l.querySelector("#tab-count-all-episodes");ne&&(ne.textContent=Bn().length),re&&(re.textContent=Ur().length),ie&&(ie.textContent=Wt().length),fe&&(fe.textContent=Yt().length),ge&&(ge.textContent=Be().length)},L=D=>{D&&D.querySelectorAll(".btn-lib-delete").forEach(J=>{J.addEventListener("click",V=>{V.stopPropagation();const U=J.closest(".library-card-item");if(!U)return;const Y=U.getAttribute("data-id"),ne=parseInt(U.getAttribute("data-season")||"1",10),re=parseInt(U.getAttribute("data-episode")||"1",10),ie=U.getAttribute("data-tab"),fe=decodeURIComponent(U.getAttribute("data-title")||"İçerik");let ge=`"${fe}" kaydını silmek istediğinize emin misiniz?`;ie==="all-episodes"?ge=`"${fe}" (Sezon ${ne}, Bölüm ${re}) izleme geçmişinizden silinsin mi?`:ie==="continue"?ge=`"${fe}" devam et listesinden kaldırılsın mı?`:ie==="completed"?ge=`"${fe}" tamamlananlar geçmişinden silinsin mi?`:ie==="favorites"?ge=`"${fe}" favorilerinizden kaldırılsın mı?`:ie==="watchlist"&&(ge=`"${fe}" izleme listenizden kaldırılsın mı?`),window.confirm(ge)&&(ie==="all-episodes"?nd(Y,ne,re):ie==="continue"||ie==="completed"?va(Y):ie==="favorites"?ed(Y):ie==="watchlist"&&td(Y),ee("✓ Kayıt başarıyla silindi.","success"),U.style.transition="all 0.28s ease-out",U.style.transform="scale(0.85)",U.style.opacity="0",setTimeout(()=>{U.remove(),R()},300))})})};v&&v.addEventListener("input",D=>{g=D.target.value.trim(),b&&(b.style.display=g?"block":"none"),x()}),b&&b.addEventListener("click",()=>{v&&(v.value="",g="",b.style.display="none",x(),v.focus())});const N=l.querySelectorAll("#lib-type-filters .lib-segment-btn");N.forEach(D=>{D.addEventListener("click",()=>{N.forEach(J=>J.classList.remove("active")),D.classList.add("active"),p=D.getAttribute("data-filter")||"all",x()})}),w&&w.addEventListener("change",D=>{h=D.target.value,x()}),k&&k.addEventListener("click",()=>{let D="Bu listedeki tüm kayıtları silmek istediğinize emin misiniz?";u==="completed"?D="Tamamlananlar listesindeki tüm kayıtlar temizlensin mi?":u==="continue"?D="İzlemeye devam et listesindeki tüm yarım kalanlar temizlensin mi?":u==="all-episodes"&&(D="Tüm bölüm izleme geçmişiniz sıfırlansın mı?"),window.confirm(D)&&(u==="completed"||u==="continue"?Ts():u==="all-episodes"&&id(),ee("✓ Liste başarıyla temizlendi.","success"),R(),C())});const z=l.querySelector("#lib-export-btn");z&&z.addEventListener("click",()=>nl());const K=l.querySelector("#lib-import-btn"),W=l.querySelector("#lib-file-input");K&&W&&(K.addEventListener("click",()=>W.click()),W.addEventListener("change",D=>{if(D.target.files&&D.target.files.length>0){const J=D.target.files[0],V=new FileReader;V.onload=U=>{const Y=rl(U.target.result,"merge");Y.success?(ee(`✓ Yedek başarıyla yüklendi! (${Y.countHistory} izleme, ${Y.countFavs} favori aktarıldı)`,"success"),R(),C()):ee(`Yükleme hatası: ${Y.message||Y.error}`,"error")},V.onerror=()=>ee("Dosya okunamadı.","error"),V.readAsText(J)}}));const O=l.querySelector("#lib-data-modal-btn");O&&O.addEventListener("click",()=>fl()),C(),kt(l),G(),Wc().then(()=>{R(),C()}).catch(()=>{});const B=D=>{D&&D.detail&&D.detail.isProgressUpdate&&document.getElementById("player-modal")||(R(),C())};window.addEventListener("sineflix_data_changed",B)}}}const Te={currentType:"tv",currentGenreId:null,currentSortBy:"popularity.desc",currentMinRating:0,currentPlatform:null,currentYearRange:"all",currentPage:1,allItems:[],isExhausted:!1};async function $h(e="tv"){e&&e!==Te.currentType&&Te.allItems.length===0&&(Te.currentType=e);let t=Te.currentType,i=Te.currentGenreId,n=Te.currentSortBy,a=Te.currentMinRating,r=Te.currentPlatform,o=Te.currentYearRange,s=!1;const l=[{id:null,name:"Tüm Türler"},{id:gt.MYSTERY,name:"🩸 Korku & Gerilim"},{id:gt.ACTION_ADVENTURE,name:"💥 Aksiyon & Macera"},{id:gt.SCI_FI_FANTASY,name:"🚀 Bilim Kurgu & Fantastik"},{id:gt.DRAMA,name:"🎭 Dram"},{id:gt.COMEDY,name:"😂 Komedi"},{id:gt.CRIME,name:"🕵️ Suç & Polisiye"},{id:gt.ANIMATION,name:"🎌 Animasyon & Anime"},{id:gt.DOCUMENTARY,name:"🌍 Belgesel"},{id:gt.FAMILY,name:"👨‍👩‍👧‍👦 Aile & Gençlik"},{id:gt.WAR_POLITICS,name:"⚔️ Savaş & Politika"},{id:gt.WESTERN,name:"🤠 Western"}],u=[{id:null,name:"Tüm Türler"},{id:Ye.HORROR,name:"🩸 Korku"},{id:Ye.THRILLER,name:"⚡ Gerilim"},{id:Ye.ACTION,name:"💥 Aksiyon"},{id:Ye.ADVENTURE,name:"🗺️ Macera"},{id:Ye.SCI_FI,name:"🚀 Bilim Kurgu"},{id:Ye.FANTASY,name:"🧙‍♂️ Fantastik"},{id:Ye.DRAMA,name:"🎭 Dram"},{id:Ye.COMEDY,name:"😂 Komedi"},{id:Ye.CRIME,name:"🕵️ Suç"},{id:Ye.ANIMATION,name:"🎌 Animasyon"},{id:Ye.MYSTERY,name:"🔍 Gizem"},{id:Ye.ROMANCE,name:"💖 Romantik"},{id:Ye.DOCUMENTARY,name:"🌍 Belgesel"},{id:Ye.HISTORY,name:"🏰 Tarih & Savaş"},{id:Ye.FAMILY,name:"👨‍👩‍👧‍👦 Aile"},{id:Ye.MUSIC,name:"🎵 Müzikal"},{id:Ye.WESTERN,name:"🤠 Western"}],p=()=>t==="movie"?u:l,h=Te.allItems.length>0,g=h?Te.allItems.map(b=>_t(b)).join(""):'<div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">İçerikler yükleniyor...</div>';return{html:`
    <div class="discover-view" style="padding-top: 6.5rem; padding-bottom: 5rem;">
      <div class="container">
        
        <!-- Header Banner -->
        <div class="discover-header-card glass-panel" style="padding: 2rem; border-radius: var(--radius-lg); margin-bottom: 2rem; background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(20, 184, 166, 0.08) 100%); border: 1px solid var(--border-light);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;">
            <div>
              <h1 style="font-size: 2.2rem; font-weight: 800; display: flex; align-items: center; gap: 0.75rem; color: #fff;">
                <i data-lucide="compass" style="color: var(--primary)"></i> Özelleştirilebilir Sinema Filtresi
              </h1>
              <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0.35rem;">
                Platforma, türe, IMDb puanına ve çıkış yılına göre nokta atışı arama yapın
              </p>
            </div>
          </div>
        </div>

        <!-- Filter Controls Container -->
        <div class="discover-controls-wrap glass-panel" style="padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 2rem; border: 1px solid var(--border-color);">
          
          <!-- Type Filter Tabs Segmented Track (Apple TV+ Capsule) -->
          <div class="discover-segmented-deck">
            <button id="discover-type-tv" class="discover-type-tab ${t==="tv"?"active":""}">
              <i data-lucide="tv-2" style="width:16px; height:16px;"></i> Diziler
            </button>
            <button id="discover-type-movie" class="discover-type-tab ${t==="movie"?"active":""}">
              <i data-lucide="clapperboard" style="width:16px; height:16px;"></i> Filmler
            </button>
            <button id="discover-type-anime" class="discover-type-tab ${t==="anime"?"active":""}">
              <i data-lucide="sparkles" style="width:16px; height:16px;"></i> Anime
            </button>
            <button id="discover-type-doc" class="discover-type-tab ${t==="documentary"?"active":""}">
              <i data-lucide="globe" style="width:16px; height:16px;"></i> Belgesel
            </button>
          </div>

          <!-- Secondary Filters Row (Mega Filter) -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 1.2rem; align-items: end;">
            
            <!-- Platform Filter -->
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
                <i data-lucide="tv" style="width:12px; height:12px;"></i> Yayın Platformu
              </label>
              <select id="discover-platform-select" class="discover-filter-select">
                <option value="" ${r?"":"selected"}>🌐 Tüm Platformlar</option>
                <option value="213" ${r==="213"?"selected":""}>🔴 Netflix</option>
                <option value="49" ${r==="49"?"selected":""}>🟣 HBO / Max</option>
                <option value="2739" ${r==="2739"?"selected":""}>🔵 Disney+</option>
                <option value="1024" ${r==="1024"?"selected":""}>🟡 Amazon Prime</option>
                <option value="2552" ${r==="2552"?"selected":""}>⚪ Apple TV+</option>
              </select>
            </div>

            <!-- Year Range Filter -->
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
                <i data-lucide="calendar" style="width:12px; height:12px;"></i> Çıkış Yılı Aralığı
              </label>
              <select id="discover-year-select" class="discover-filter-select">
                <option value="all" ${o==="all"?"selected":""}>📅 Tüm Yıllar</option>
                <option value="2024-2026" ${o==="2024-2026"?"selected":""}>✨ 2024 - 2026 (En Yeniler)</option>
                <option value="2020-2023" ${o==="2020-2023"?"selected":""}>🌟 2020 - 2023 (Son Yıllar)</option>
                <option value="2010-2019" ${o==="2010-2019"?"selected":""}>🎬 2010 - 2019 (2010'lar)</option>
                <option value="2000-2009" ${o==="2000-2009"?"selected":""}>📼 2000 - 2009 (2000'ler)</option>
                <option value="1990-1999" ${o==="1990-1999"?"selected":""}>🎞️ 1990 - 1999 (90'lar)</option>
                <option value="before-1990" ${o==="before-1990"?"selected":""}>🏛️ 1990 Öncesi (Klasikler)</option>
              </select>
            </div>

            <!-- Sort Filter -->
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
                <i data-lucide="arrow-down-up" style="width:12px; height:12px;"></i> Sıralama Ölçütü
              </label>
              <select id="discover-sort-select" class="discover-filter-select">
                <option value="popularity.desc" ${n==="popularity.desc"?"selected":""}>🔥 En Popülerler (Trend)</option>
                <option value="vote_average.desc" ${n==="vote_average.desc"?"selected":""}>⭐ En Yüksek IMDb Puanı</option>
                <option value="vote_count.desc" ${n==="vote_count.desc"?"selected":""}>👥 En Çok Oylananlar</option>
                <option value="first_air_date.desc" ${n==="first_air_date.desc"?"selected":""}>📅 En Yeniler (Vizyon / Çıkış)</option>
              </select>
            </div>

            <!-- Min IMDb Rating Slider/Select -->
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
                <i data-lucide="star" style="width:12px; height:12px;"></i> Minimum IMDb Puanı
              </label>
              <select id="discover-rating-select" class="discover-filter-select">
                <option value="0" ${a===0?"selected":""}>Tümü (Puan Sınırı Yok)</option>
                <option value="8.0" ${a===8?"selected":""}>⭐ 8.0 ve Üzeri (Başyapıtlar)</option>
                <option value="7.5" ${a===7.5?"selected":""}>⭐ 7.5 ve Üzeri (Çok Yüksek)</option>
                <option value="7.0" ${a===7?"selected":""}>⭐ 7.0 ve Üzeri (Çok İyi)</option>
                <option value="6.0" ${a===6?"selected":""}>⭐ 6.0 ve Üzeri (İyi)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Quick Genre Pills Filter Bar -->
        <div id="discover-genre-bar" class="genre-pills-bar" style="display: flex; gap: 0.6rem; overflow-x: auto; padding-bottom: 1.2rem; margin-bottom: 2rem; scrollbar-width: none;">
          <!-- Dynamically populated -->
        </div>

        <!-- Results Grid -->
        <div class="media-grid" id="discover-media-grid">
          ${g}
        </div>

        <!-- Scroll Sentinel / Loader -->
        <div id="discover-sentinel" style="height: 60px; display: flex; align-items: center; justify-content: center; margin-top: 2rem; color: var(--text-muted);">
          <i data-lucide="loader-2" class="spin-loader" style="width: 28px; height: 28px; display: none;"></i>
        </div>

      </div>
    </div>
  `,init:b=>{if(!b)return;const w=b.querySelector("#discover-type-tv"),k=b.querySelector("#discover-type-movie"),f=b.querySelector("#discover-type-anime"),y=b.querySelector("#discover-type-doc"),E=b.querySelector("#discover-platform-select"),C=b.querySelector("#discover-year-select"),x=b.querySelector("#discover-sort-select"),A=b.querySelector("#discover-rating-select"),R=b.querySelector("#discover-genre-bar"),L=b.querySelector("#discover-media-grid"),N=b.querySelector("#discover-sentinel"),z=N?N.querySelector(".spin-loader"):null;E&&E.addEventListener("change",()=>{r=E.value||null,Te.currentPlatform=r,B()}),C&&C.addEventListener("change",()=>{o=C.value||"all",Te.currentYearRange=o,B()});const K=()=>{const U=p();R.innerHTML=U.map(Y=>`
          <button class="genre-pill-btn ${i===Y.id?"active":""}" data-genre-id="${Y.id||""}">
            ${Y.name}
          </button>
        `).join(""),R.querySelectorAll(".genre-pill-btn").forEach(Y=>{Y.addEventListener("click",()=>{const ne=Y.dataset.genreId?parseInt(Y.dataset.genreId,10):null;i!==ne&&(i=ne,R.querySelectorAll(".genre-pill-btn").forEach(re=>re.classList.remove("active")),Y.classList.add("active"),B())})})};let W=0;const O=async U=>{const Y=U||W;if(s||Te.isExhausted)return;s=!0,z&&(z.style.display="block");const ne=Te.currentPage||1;try{const re=t==="anime"||t==="documentary"?"tv":t,ie=t==="anime",fe=t==="documentary";let ge=n;n==="first_air_date.desc"&&re==="movie"&&(ge="primary_release_date.desc");let te=null,P=null;o==="2024-2026"?(te=2024,P=2026):o==="2020-2023"?(te=2020,P=2023):o==="2010-2019"?(te=2010,P=2019):o==="2000-2009"?(te=2e3,P=2009):o==="1990-1999"?(te=1990,P=1999):o==="before-1990"&&(te=1940,P=1989);const M=await ll({type:re,genreId:i,page:ne,sortBy:ge,minRating:a,isAnime:ie,isDoc:fe,yearMin:te,yearMax:P,withNetworks:r});if(Y!==W)return;if(z&&(z.style.display="none"),!M||M.length===0){ne===1&&(L.innerHTML='<div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted); font-size: 1.05rem;">Bu filtre kriterlerine uygun içerik bulunamadı.</div>'),Te.isExhausted=!0;return}Te.allItems=[...Te.allItems,...M],Te.currentType=t,Te.currentGenreId=i,Te.currentSortBy=n,Te.currentMinRating=a;const j=M.map(Q=>_t(Q)).join("");ne===1?L.innerHTML=j:L.insertAdjacentHTML("beforeend",j),G(),kt(L),Te.currentPage=ne+1}catch{if(Y!==W)return;z&&(z.style.display="none"),ne===1&&(!Te.allItems||Te.allItems.length===0)&&(L.innerHTML=`
              <div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">
                <p style="margin-bottom: 0.75rem;">İçerikler getirilirken bir sorun oluştu.</p>
                <button id="btn-retry-discover" class="btn-secondary" style="padding: 0.5rem 1.2rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
                  <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
                  <span>Tekrar Dene</span>
                </button>
              </div>
            `,G(),L.querySelector("#btn-retry-discover")?.addEventListener("click",()=>{B()}))}finally{Y===W&&(s=!1,z&&(z.style.display="none"))}},B=()=>{W++;const U=W;Te.currentPage=1,Te.allItems=[],Te.isExhausted=!1,s=!1,L.innerHTML=`
          <div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">
            <div class="spin-loader" style="width: 32px; height: 32px; border: 3px solid rgba(245,158,11,0.2); border-top-color: #f59e0b; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem;"></div>
            <div>İçerikler yükleniyor...</div>
          </div>
        `,z&&(z.style.display="none"),O(U)};K(),h||O();let D=null;N&&"IntersectionObserver"in window&&(D=new IntersectionObserver(U=>{U[0].isIntersecting&&O()},{rootMargin:"0px 0px 600px 0px"}),D.observe(N));const J=()=>{if(s||Te.isExhausted)return;const U=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||0,Y=window.innerHeight,ne=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);U+Y>=ne-700&&O()};window.addEventListener("scroll",J,{passive:!0}),window.__discoverCleanup=()=>{D?.disconnect(),window.removeEventListener("scroll",J)};const V=U=>{t!==U&&(t=U,i=null,[w,k,f,y].forEach(Y=>Y?.classList.remove("active")),U==="tv"&&w?.classList.add("active"),U==="movie"&&k?.classList.add("active"),U==="anime"&&f?.classList.add("active"),U==="documentary"&&y?.classList.add("active"),K(),B())};w&&w.addEventListener("click",()=>V("tv")),k&&k.addEventListener("click",()=>V("movie")),f&&f.addEventListener("click",()=>V("anime")),y&&y.addEventListener("click",()=>V("documentary")),x&&x.addEventListener("change",U=>{n=U.target.value,B()}),A&&A.addEventListener("change",U=>{a=parseFloat(U.target.value),B()})}}}const Si={};function Mh(e){const i=Ct()?`${e}_kids`:e;return(!Si[i]||Si[i].stale)&&(Si[i]={allItems:[],seenIds:new Set,nextPage:1,isExhausted:!1,stale:!1}),Si[i]}function Ph(e){if(Ct())switch(e){case"movie":return Sa;case"anime":return xa;case"documentary":return bd;case"cartoon":return ka;default:return ka}switch(e){case"movie":return Zn;case"anime":return Qn;case"documentary":return er;case"cartoon":return Jn;default:return Xn}}async function Wi(e="tv"){const t=Ct(),i=t?`${e}_kids`:e;Si[i]&&(Si[i].stale=!0);const n=Mh(e),a=t?{tv:["Türkiye’de Popüler Çizgi ve Gençlik Dizileri","monitor-play"],movie:["🎈 Animasyon & Çocuk Filmleri","popcorn"],anime:["Türkiye’de Popüler Çocuk ve Genç Animeleri","cat"],documentary:["🐾 Doğa & Hayvan Belgeselleri","globe"]}:{tv:["Tüm Zamanların En Popüler Dizileri","monitor-play"],cartoon:["Çizgi Dizi Dünyası & Unutulmaz Klasikler","wand-2"],movie:["Tüm Zamanların En Popüler Filmleri","popcorn"],anime:["Türkiye’de En Popüler Animeler","cat"],documentary:["Tüm Zamanların En Çok İzlenen Belgeselleri","globe"]},[r,o]=a[e]||a.tv;return{html:`
    <div class="popular-list-view">
      <div class="container">
        <div class="popular-list-header">
          <h1 class="popular-list-title">
            <span class="rail-icon-pill" style="--rail-color: #f59e0b; width: 32px; height: 32px; flex-shrink: 0;">
              <i data-lucide="${o}" style="width: 17px; height: 17px;"></i>
            </span>
            <span>${r}</span>
          </h1>
          <p class="popular-list-sub" id="popular-count-label">${e==="anime"||e==="cartoon"||t&&e==="tv"?"Güncel ilgi, izleyici güveni ve Türkiye popülerlik sinyaline göre sıralanıyor":"Tüm zamanların popülerliğine göre akıcı olarak listeleniyor"}</p>
        </div>

        <div class="media-grid" id="popular-media-grid">
          <div class="popular-loading-placeholder" style="grid-column: 1/-1; padding: 3rem 2rem; text-align: center; color: var(--text-muted);">
            <div class="spin-loader" style="width: 36px; height: 36px; border: 3px solid rgba(245,158,11,0.2); border-top-color: #f59e0b; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1.25rem;"></div>
            <p style="font-size: 1.05rem;">Popüler içerikler hazırlanıyor...</p>
          </div>
        </div>

        <div id="popular-sentinel" style="min-height: 90px; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 2rem 0 5rem; color: var(--text-muted);"></div>
      </div>
    </div>
  `,init:u=>{if(!u)return;const p=u.querySelector("#popular-media-grid"),h=u.querySelector("#popular-sentinel");if(!p)return;kt(p);let g=!1;const v=Ph(e),b=()=>{h&&(n.isExhausted?h.innerHTML='<p style="color: var(--text-muted); font-size: 0.9rem;">Tüm popüler içerikler listelendi.</p>':h.innerHTML=`
            <div style="display: flex; align-items: center; gap: 0.6rem; color: var(--text-muted); font-size: 0.9rem;">
              <div class="spin-loader" style="width: 20px; height: 20px; border: 2px solid rgba(245,158,11,0.25); border-top-color: #f59e0b; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
              <span>Daha fazla içerik akıyor...</span>
            </div>
          `)},w=E=>{if(!E||E.length===0)return;const C=[];for(const R of E)R&&R.id&&!n.seenIds.has(R.id)&&(n.seenIds.add(R.id),C.push(R));if(C.length===0)return;n.allItems.push(...C);const x=C.map(R=>_t(R)).join("");p.querySelector(".popular-loading-placeholder")?p.innerHTML=x:p.insertAdjacentHTML("beforeend",x),kt(p),G()},k=async(E=3)=>{if(!(g||n.isExhausted)){g=!0,b();try{const C=n.nextPage,x=Array.from({length:E},(K,W)=>C+W);n.nextPage+=E;let A=0;const R=e==="anime"||e==="cartoon"||t&&e==="tv",L=x.map(K=>v(K).catch(()=>[])),N=await Promise.all(L),z=N.flat().filter(Boolean);if(R){const K=e==="cartoon"?"_cartoonScore":"_turkeyPopularityScore";z.sort((W,O)=>(O[K]||0)-(W[K]||0)),A=z.length,w(z)}else for(const K of N)K&&K.length>0&&(A+=K.length,w(K));z.length===0&&(n.isExhausted=!0),b(),requestAnimationFrame(()=>{if(!n.isExhausted&&document.documentElement.scrollHeight<=window.innerHeight+600){g=!1,k(2);return}})}catch{}finally{g=!1,b()}}};k(1);let f=null;h&&"IntersectionObserver"in window&&(f=new IntersectionObserver(E=>{E[0].isIntersecting&&!g&&!n.isExhausted&&k(2)},{rootMargin:"0px 0px 1500px 0px"}),f.observe(h));const y=()=>{if(g||n.isExhausted)return;const E=window.scrollY||0,C=window.innerHeight,x=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);E+C>=x-1200&&k(2)};window.addEventListener("scroll",y,{passive:!0}),window.__popularListCleanup=()=>{f?.disconnect(),window.removeEventListener("scroll",y)}}}}function Bh(){const e=new Set;let t=!1;const i=s=>{t?s():e.add(s)},n=(s,l,u,p)=>{t||(s.addEventListener(l,u,p),i(()=>s.removeEventListener(l,u,p)))},a=new Map,r=s=>{const l=a.get(s);l&&(l(),e.delete(l),a.delete(s))},o=(s,l,u)=>{if(t)return null;const p=globalThis[u?"setInterval":"setTimeout"](()=>{u||r(p),t||s()},l),h=()=>globalThis[u?"clearInterval":"clearTimeout"](p);return a.set(p,h),i(h),p};return{on:n,add:i,setTimeout:(s,l)=>o(s,l,!1),setInterval:(s,l)=>o(s,l,!0),clearTimeout:r,clearInterval:r,dispose(){if(!t){t=!0;for(const s of e)s();e.clear(),a.clear()}}}}function zf(e){const t=globalThis.window?.lucide;if(!(!e||!t?.createElement||!t.icons))for(const i of e.querySelectorAll("[data-lucide]:not(svg)")){const n=i.getAttribute("data-lucide"),a=n.replace(/(^|-)(\w)/g,(l,u,p)=>p.toUpperCase()),r=t.icons[a];if(!r)continue;const o=Object.fromEntries(Array.from(i.attributes,l=>[l.name,l.value]));o.class=`lucide lucide-${n} ${o.class||""}`;const s=t.createElement(r);for(const[l,u]of Object.entries(o))s.setAttribute(l,u);i.replaceWith(s)}}function bt(e,t){const i=(e||"").replace(/ (HD|4K|TV|Kanalı)/gi,"").trim(),n=i.slice(0,5).toUpperCase(),r={"TRT 1":{bg:"linear-gradient(135deg, #b91c1c, #ef4444)",text:"#ffffff",tag:"TRT 1"},ATV:{bg:"linear-gradient(135deg, #c2410c, #f97316)",text:"#ffffff",tag:"ATV"},"SHOW TV":{bg:"linear-gradient(135deg, #6b21a8, #ec4899)",text:"#ffffff",tag:"SHOW"},"NOW TV":{bg:"linear-gradient(135deg, #991b1b, #ef4444)",text:"#ffffff",tag:"NOW"},"STAR TV":{bg:"linear-gradient(135deg, #b91c1c, #dc2626)",text:"#ffffff",tag:"STAR"},"KANAL D":{bg:"linear-gradient(135deg, #0369a1, #0284c7)",text:"#ffffff",tag:"KANAL D"},TV8:{bg:"linear-gradient(135deg, #ea580c, #f97316)",text:"#ffffff",tag:"TV8"},"CNBC-E":{bg:"linear-gradient(135deg, #047857, #10b981)",text:"#ffffff",tag:"CNBC-E"},"A2 TV":{bg:"linear-gradient(135deg, #991b1b, #ea580c)",text:"#ffffff",tag:"A2"},"KANAL 7":{bg:"linear-gradient(135deg, #0284c7, #38bdf8)",text:"#ffffff",tag:"KANAL 7"},"BEYAZ TV":{bg:"linear-gradient(135deg, #881337, #e11d48)",text:"#ffffff",tag:"BEYAZ"},TEVE2:{bg:"linear-gradient(135deg, #ca8a04, #eab308)",text:"#000000",tag:"TEVE2"},"TV 360":{bg:"linear-gradient(135deg, #581c87, #9333ea)",text:"#ffffff",tag:"360"},"TRT HABER":{bg:"linear-gradient(135deg, #831843, #db2777)",text:"#ffffff",tag:"HABER"},"A HABER":{bg:"linear-gradient(135deg, #991b1b, #f97316)",text:"#ffffff",tag:"A HABER"},NTV:{bg:"linear-gradient(135deg, #0369a1, #0284c7)",text:"#ffffff",tag:"NTV"},HABERTÜRK:{bg:"linear-gradient(135deg, #991b1b, #dc2626)",text:"#ffffff",tag:"HTÜRK"},"HALK TV":{bg:"linear-gradient(135deg, #b91c1c, #ef4444)",text:"#ffffff",tag:"HALK"},"S SPORT 1 HD":{bg:"linear-gradient(135deg, #065f46, #10b981)",text:"#ffffff",tag:"S SPORT 1"},"S SPORT 2 HD":{bg:"linear-gradient(135deg, #047857, #34d399)",text:"#ffffff",tag:"S SPORT 2"},"BEIN SPORTS HABER HD":{bg:"linear-gradient(135deg, #4c1d95, #7c3aed)",text:"#ffffff",tag:"BEIN HABER"},"BEIN SPORTS 3 HD":{bg:"linear-gradient(135deg, #3b0764, #6d28d9)",text:"#ffffff",tag:"BEIN 3"},"SPOR SMART 1 HD":{bg:"linear-gradient(135deg, #c2410c, #f97316)",text:"#ffffff",tag:"SMART 1"},"SPOR SMART 2 HD":{bg:"linear-gradient(135deg, #9a3412, #ea580c)",text:"#ffffff",tag:"SMART 2"},"EURO SPORT 1 HD":{bg:"linear-gradient(135deg, #1e3a8a, #2563eb)",text:"#ffffff",tag:"EURO 1"},"EURO SPORT 2 HD":{bg:"linear-gradient(135deg, #172554, #1d4ed8)",text:"#ffffff",tag:"EURO 2"},"TIVIBU SPOR 1 HD":{bg:"linear-gradient(135deg, #0284c7, #06b6d4)",text:"#ffffff",tag:"TİVİBU 1"},"TIVIBU SPOR 2 HD":{bg:"linear-gradient(135deg, #0369a1, #0284c7)",text:"#ffffff",tag:"TİVİBU 2"},"TIVIBU SPOR 3 HD":{bg:"linear-gradient(135deg, #075985, #0369a1)",text:"#ffffff",tag:"TİVİBU 3"},"FX KANALI HD":{bg:"linear-gradient(135deg, #18181b, #27272a)",text:"#fbbf24",tag:"FX"},"SINEMA TV HD":{bg:"linear-gradient(135deg, #713f12, #a16207)",text:"#fef08a",tag:"SINEMA"},"NATIONAL GEOGRAPHIC HD":{bg:"linear-gradient(135deg, #000000, #18181b)",text:"#fbbf24",tag:"NAT GEO"},"DISCOVERY CHANNEL HD":{bg:"linear-gradient(135deg, #0284c7, #06b6d4)",text:"#ffffff",tag:"DISCOVERY"},"DMAX HD":{bg:"linear-gradient(135deg, #111827, #1f2937)",text:"#38bdf8",tag:"DMAX"},"TLC HD":{bg:"linear-gradient(135deg, #831843, #db2777)",text:"#ffffff",tag:"TLC"},"CARTOON NETWORK":{bg:"linear-gradient(135deg, #000000, #27272a)",text:"#ffffff",tag:"CARTOON"},"NICKELODEON HD":{bg:"linear-gradient(135deg, #ea580c, #f97316)",text:"#ffffff",tag:"NICK"}}[i.toUpperCase()]||{bg:"linear-gradient(135deg, #1e293b, #334155)",text:"#ffffff",tag:n},o=`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${r.bg.includes("#")&&r.bg.match(/#[a-f0-9]{6}/i)?.[0]||"#1e293b"}" />
        <stop offset="100%" stop-color="${r.bg.includes("#")&&r.bg.match(/(#[a-f0-9]{6})/gi)?.[1]||"#334155"}" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#bgGrad)" stroke="rgba(255,255,255,0.18)" stroke-width="2" />
    <text x="50%" y="46%" dominant-baseline="central" text-anchor="middle" fill="${r.text}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="26" letter-spacing="1">${n}</text>
    <rect x="20" y="78" width="80" height="22" rx="11" fill="rgba(0,0,0,0.4)" />
    <text x="50%" y="89" dominant-baseline="central" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="9" letter-spacing="1.2">${r.tag}</text>
  </svg>`;return`data:image/svg+xml;utf8,${encodeURIComponent(o)}`}const Dh=[{id:"all",name:"Tüm Kanallar",icon:"tv"},{id:"favorites",name:"⭐ Favorilerim",icon:"star"},{id:"national",name:"Ulusal & Sinema",icon:"home"},{id:"sports",name:"Spor VIP",icon:"trophy"},{id:"news",name:"Haber",icon:"newspaper"},{id:"doc",name:"Belgesel",icon:"compass"},{id:"kids",name:"Çocuk",icon:"smile"},{id:"music",name:"Müzik",icon:"music"}],pa=[{id:"ch_trt1",name:"TRT 1",category:"national",logo:"/tv-logos/trt-1.png",quality:"1080p FHD",streamUrl:"https://tv-trt1.medya.trt.com.tr/master.m3u8"},{id:"ch_atv",name:"ATV",category:"national",logo:"/tv-logos/atv.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/atv/atv_1080p.m3u8"},{id:"ch_showtv",name:"Show TV",category:"national",logo:"/tv-logos/show-tv.png",quality:"1080p FHD",streamUrl:"https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/showtv/showtv.m3u8"},{id:"ch_nowtv",name:"NOW TV",category:"national",logo:"/tv-logos/now-tv.png",quality:"1080p FHD",streamUrl:"https://uycyyuuzyh.turknet.ercdn.net/nphindgytw/nowtv/nowtv.m3u8"},{id:"ch_startv",name:"Star TV",category:"national",logo:"/tv-logos/star-tv.png",quality:"1080p FHD",streamUrl:"https://dygvideo.dygdigital.com/live/hls/startv4puhu/live.m3u8"},{id:"ch_kanald",name:"Kanal D",category:"national",logo:"/tv-logos/kanal-d.png",quality:"1080p FHD",streamUrl:"https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/kanald/kanald.m3u8"},{id:"ch_tv8",name:"TV8",category:"national",logo:"/tv-logos/tv8.png",quality:"480p",streamUrl:"https://rkhubpaomb.turknet.ercdn.net/fwjkgpasof/tv8/tv8_480p.m3u8"},{id:"ch_cnbce",name:"CNBC-e",category:"national",logo:"/tv-logos/cnbc-e.png",quality:"1080p FHD",streamUrl:"https://hnpsechtsc.turknet.ercdn.net/xpnvudnlsv/cnbc-e/cnbc-e.m3u8"},{id:"ch_a2",name:"A2 TV",category:"national",logo:"/tv-logos/a2.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/a2tv/a2tv.m3u8"},{id:"ch_kanal7",name:"Kanal 7",category:"national",logo:"/tv-logos/kanal-7.png",quality:"1080p FHD",streamUrl:"https://kanal7-live.daioncdn.net/kanal7/kanal7.m3u8"},{id:"ch_beyaztv",name:"Beyaz TV",category:"national",logo:"/tv-logos/beyaz-tv.png",quality:"1080p FHD",streamUrl:"https://beyaztv-live.daioncdn.net/beyaztv/beyaztv.m3u8"},{id:"ch_teve2",name:"Teve2",category:"national",logo:"/tv-logos/teve2.png",quality:"1080p FHD",streamUrl:"https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/teve2/teve2.m3u8"},{id:"ch_tv360",name:"TV 360",category:"national",logo:"/tv-logos/tv-360.png",quality:"1080p FHD",streamUrl:"https://turkmedya-live.ercdn.net/tv360/tv360.m3u8"},{id:"ch_trthaber",name:"TRT Haber",category:"news",logo:"/tv-logos/trt-haber.png",quality:"1080p FHD",streamUrl:"https://tv-trthaber.medya.trt.com.tr/master.m3u8"},{id:"ch_ahaber",name:"A Haber",category:"news",logo:"/tv-logos/a-haber.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/ahaber/ahaber.m3u8"},{id:"ch_ntv",name:"NTV",category:"news",logo:"/tv-logos/ntv.png",quality:"1080p FHD",streamUrl:"https://dygvideo.dygdigital.com/live/hls/ntv4puhu/live.m3u8"},{id:"ch_haberturk",name:"Habertürk",category:"news",logo:"/tv-logos/haberturk.png",quality:"1080p FHD",streamUrl:"https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/haberturktv/haberturktv.m3u8"},{id:"ch_halktv",name:"Halk TV",category:"news",logo:"/tv-logos/halk-tv.png",quality:"1080p FHD",streamUrl:"https://halktv-live.daioncdn.net/halktv/halktv.m3u8"},{id:"ch_tele1",name:"Tele1",category:"news",logo:"/tv-logos/tele1.png",quality:"1080p FHD",streamUrl:"https://tele1-live.ercdn.net/tele1/tele1.m3u8"},{id:"ch_tv100",name:"TV 100",category:"news",logo:"/tv-logos/tv100.png",quality:"1080p FHD",streamUrl:"https://tv.ensonhaber.com/tv100/tv100.m3u8"},{id:"ch_bloomberg",name:"Bloomberg HT",category:"news",logo:"/tv-logos/bloomberg-ht.png",quality:"1080p FHD",streamUrl:"https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/bloomberght/bloomberght.m3u8"},{id:"ch_tv24",name:"24 TV",category:"news",logo:"/tv-logos/tv24.png",quality:"1080p FHD",streamUrl:"https://tv.ensonhaber.com/tv24/tv24.m3u8"},{id:"ch_ulketv",name:"Ülke TV",category:"news",logo:"/tv-logos/ulke-tv.png",quality:"1080p FHD",streamUrl:"https://livetv.radyotvonline.net/kanal7live/ulketv/playlist.m3u8"},{id:"tvr_ch_141",tvrId:"141",isTvr:!0,name:"S SPORT 1 HD",category:"sports",logo:"/tv-logos/s-sport-1.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://mariuannastluisborg.autos/hls/ss11/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_140",tvrId:"140",isTvr:!0,name:"S SPORT 2 HD",category:"sports",logo:"/tv-logos/s-sport-2.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://mariuannastluisborg.autos/hls/ss22/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_165",tvrId:"165",isTvr:!0,name:"Bein Sports Haber HD",category:"sports",logo:"/tv-logos/bein-sports-haber.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/bshaber/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_147",tvrId:"147",isTvr:!0,name:"Bein Sports 3 HD",category:"sports",logo:"/tv-logos/bein-sports-3.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://mariuannastluisborg.autos/hls/bein3/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_139",tvrId:"139",isTvr:!0,name:"Spor Smart 1 HD",category:"sports",logo:"/tv-logos/spor-smart-1.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sporsmart/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_138",tvrId:"138",isTvr:!0,name:"Spor Smart 2 HD",category:"sports",logo:"/tv-logos/spor-smart-2.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sporsmart2/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_137",tvrId:"137",isTvr:!0,name:"Euro Sport 1 HD",category:"sports",logo:"/tv-logos/eurosport-1.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://mariuannastluisborg.autos/hls/euro1/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_135",tvrId:"135",isTvr:!0,name:"Euro Sport 2 HD",category:"sports",logo:"/tv-logos/eurosport-2.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://mariuannastluisborg.autos/hls/euro2/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_134",tvrId:"134",isTvr:!0,name:"Tivibu Spor 1 HD",category:"sports",logo:"/tv-logos/tivibu-spor.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/tivibu1/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_133",tvrId:"133",isTvr:!0,name:"Tivibu Spor 2 HD",category:"sports",logo:"/tv-logos/tivibu-spor.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/tivibu2/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_132",tvrId:"132",isTvr:!0,name:"Tivibu Spor 3 HD",category:"sports",logo:"/tv-logos/tivibu-spor.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/tivibu3/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"ch_trtspor",name:"TRT Spor",category:"sports",logo:"/tv-logos/trt-spor.png",quality:"1080p FHD",streamUrl:"https://tv-trtspor1.medya.trt.com.tr/master.m3u8"},{id:"ch_trtspor2",name:"TRT Spor Yıldız",category:"sports",logo:"/tv-logos/trt-spor-yildiz.png",quality:"1080p FHD",streamUrl:"https://tv-trtspor2.medya.trt.com.tr/master.m3u8"},{id:"ch_aspor",name:"A Spor",category:"sports",logo:"/tv-logos/a-spor.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/aspor/aspor.m3u8"},{id:"tvr_ch_128",tvrId:"128",isTvr:!0,name:"FB TV HD",category:"sports",logo:"/tv-logos/fb-tv.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/fbtv/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_127",tvrId:"127",isTvr:!0,name:"NBA TV HD",category:"sports",logo:"/tv-logos/nba-tv.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/nbatv/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_126",tvrId:"126",isTvr:!0,name:"HT Spor HD",category:"sports",logo:"/tv-logos/ht-spor.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/htspor/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_121",tvrId:"121",isTvr:!0,name:"Ekol Sport HD",category:"sports",logo:"/tv-logos/ekol-sport.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/ekolsport/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_65",tvrId:"65",isTvr:!0,name:"FX Kanalı HD",category:"national",logo:"/tv-logos/fx.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/fx/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_61",tvrId:"61",isTvr:!0,name:"Sinema TV HD",category:"national",logo:"/tv-logos/sinema-tv.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinema/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_60",tvrId:"60",isTvr:!0,name:"Sinema TV 2 HD",category:"national",logo:"/tv-logos/sinema-tv-2.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinema2/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_59",tvrId:"59",isTvr:!0,name:"Sinema TV Aksiyon HD",category:"national",logo:"/tv-logos/sinema-aksiyon.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinemaaksiyon2/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_57",tvrId:"57",isTvr:!0,name:"Sinema TV Komedi HD",category:"national",logo:"/tv-logos/sinema-komedi.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinemakomedi/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_56",tvrId:"56",isTvr:!0,name:"Sinema TV Yerli HD",category:"national",logo:"/tv-logos/sinema-yerli.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinemayerli/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_55",tvrId:"55",isTvr:!0,name:"Sinema TV Aile HD",category:"national",logo:"/tv-logos/sinema-aile.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinemaaile/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_53",tvrId:"53",isTvr:!0,name:"Sinema TV 1001 HD",category:"national",logo:"/tv-logos/sinema-1001.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinema1001/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_52",tvrId:"52",isTvr:!0,name:"Sinema TV 1002 HD",category:"national",logo:"/tv-logos/sinema-1002.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinema1002/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_89",tvrId:"89",isTvr:!0,name:"National Geographic HD",category:"doc",logo:"/tv-logos/national-geographic.png",quality:"1080p VIP",streamUrl:""},{id:"tvr_ch_88",tvrId:"88",isTvr:!0,name:"Nat Geo Wild HD",category:"doc",logo:"/tv-logos/nat-geo-wild.png",quality:"1080p VIP",streamUrl:""},{id:"tvr_ch_87",tvrId:"87",isTvr:!0,name:"History Channel HD",category:"doc",logo:"/tv-logos/history.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/history/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_86",tvrId:"86",isTvr:!0,name:"BBC Earth HD",category:"doc",logo:"/tv-logos/bbc-earth.svg",quality:"1080p VIP",streamUrl:""},{id:"tvr_ch_79",tvrId:"79",isTvr:!0,name:"Discovery Channel HD",category:"doc",logo:"/tv-logos/discovery.png",quality:"1080p VIP",streamUrl:""},{id:"tvr_ch_78",tvrId:"78",isTvr:!0,name:"Discovery Science HD",category:"doc",logo:"/tv-logos/discovery-science.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/discs/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_81",tvrId:"81",isTvr:!0,name:"DMAX HD",category:"doc",logo:"/tv-logos/dmax.png",quality:"1080p VIP",streamUrl:"/api/live_tv_stream?channel=dmax"},{id:"tvr_ch_83",tvrId:"83",isTvr:!0,name:"TLC HD",category:"doc",logo:"/tv-logos/tlc.png",quality:"1080p VIP",streamUrl:"/api/live_tv_stream?channel=tlc"},{id:"tvr_ch_85",tvrId:"85",isTvr:!0,name:"Tarih TV HD",category:"doc",logo:"/tv-logos/tarih-tv.svg",quality:"1080p VIP",streamUrl:""},{id:"tvr_ch_84",tvrId:"84",isTvr:!0,name:"DocuBox HD",category:"doc",logo:"/tv-logos/docubox.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/docubox/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_32",tvrId:"32",isTvr:!0,name:"Love Nature 4K",category:"doc",logo:"/tv-logos/love-nature.png",quality:"1080p VIP",streamUrl:""},{id:"tvr_ch_30",tvrId:"30",isTvr:!0,name:"Viasat History HD",category:"doc",logo:"/tv-logos/viasat-history.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/history/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"ch_trtbelgesel",name:"TRT Belgesel",category:"doc",logo:"/tv-logos/trt-belgesel.png",quality:"1080p FHD",streamUrl:"https://tv-trtbelgesel.medya.trt.com.tr/master.m3u8"},{id:"ch_tgrtbelgesel",name:"TGRT Belgesel",category:"doc",logo:bt("TGRT Belgesel"),quality:"1080p FHD",streamUrl:"https://b01c02nl.mediatriple.net/videoonlylive/mtsxxkzwwuqtglive/broadcast_5fe462afc6a0e.smil/playlist.m3u8"},{id:"ch_ciftcitv",name:"Çiftçi TV",category:"doc",logo:bt("Çiftçi TV"),quality:"720p",streamUrl:"https://live.artidijitalmedya.com/artidijital_ciftcitv/ciftcitv/chunks.m3u8"},{id:"ch_kanalv",name:"Kanal V",category:"doc",logo:bt("Kanal V"),quality:"720p",streamUrl:"https://live.artidijitalmedya.com/artidijital_kanalv/kanalv/chunks.m3u8"},{id:"tvr_ch_36",tvrId:"36",isTvr:!0,name:"Cartoon Network",category:"kids",logo:"/tv-logos/cartoon-network.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/cartoonnetwork/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_35",tvrId:"35",isTvr:!0,name:"Nickelodeon HD",category:"kids",logo:"/tv-logos/nickelodeon.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("http://fl1.moveonjoy.com/NICKELODEON/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_33",tvrId:"33",isTvr:!0,name:"Disney Junior",category:"kids",logo:"/tv-logos/disney-channel.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://saran-live.ercdn.net/disneyjunior/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"ch_trtcocuk",name:"TRT Çocuk",category:"kids",logo:"/tv-logos/trt-cocuk.png",quality:"1080p FHD",streamUrl:"https://tv-trtcocuk.medya.trt.com.tr/master.m3u8"},{id:"ch_minikago",name:"Minika GO",category:"kids",logo:"/tv-logos/minika-go.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/minikago/minikago.m3u8"},{id:"ch_trtmuzik",name:"TRT Müzik",category:"music",logo:"/tv-logos/trt-muzik.png",quality:"480p",streamUrl:"https://tv-trtmuzik.medya.trt.com.tr/master_480.m3u8"},{id:"ch_kralpop",name:"Kral Pop",category:"music",logo:"/tv-logos/kral-pop.png",quality:"1080p FHD",streamUrl:"https://dygvideo.dygdigital.com/live/hls/kralpoptv/live.m3u8"},{id:"ch_powerturk",name:"Power Türk",category:"music",logo:"/tv-logos/powerturk.png",quality:"1080p FHD",streamUrl:"https://powerlive.daioncdn.net/powerturktv/powerturktv.m3u8"},{id:"ch_dreamturk",name:"Dream Türk",category:"music",logo:"/tv-logos/dream-turk.png",quality:"1080p FHD",streamUrl:"https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/dreamturk/dreamturk.m3u8"},{id:"ch_tempotv",name:"Tempo TV",category:"music",logo:bt("Tempo TV"),quality:"720p",streamUrl:"https://live.artidijitalmedya.com/artidijital_tempotv/tempotv/chunks.m3u8"}],Nh=new Set(["hd","full","izle","seyret","film","dizi","anime","turkce","dublaj","altyazili","sezon","bolum","fragman","filmekseni","ekseni","sezonlukdizi","yabancidizi","dizipal","dizibal"]);function Do(e){return(e||"").toString().normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("tr-TR").replace(/[ıİ]/g,"i").replace(/\bs\d{1,2}\s*e\d{1,3}\b/g," ").replace(/\b(?:sezon|bolum)\s*\d+\b/g," ").replace(/\b\d+\s*(?:sezon|bolum)\b/g," ").replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(t=>t&&!Nh.has(t)&&!/^(?:19|20)\d{2}$/.test(t)).join(" ").trim()}function Oh(e,t){if(e===t)return 0;if(!e.length)return t.length;if(!t.length)return e.length;const i=Array.from({length:t.length+1},(n,a)=>a);for(let n=1;n<=e.length;n++){let a=i[0];i[0]=n;for(let r=1;r<=t.length;r++){const o=i[r];i[r]=Math.min(i[r]+1,i[r-1]+1,a+(e[n-1]===t[r-1]?0:1)),a=o}}return i[t.length]}function zh(e,t){const i=Do(e),n=Do(t);return!i||!n?0:i===n?1:1-Oh(i,n)/Math.max(i.length,n.length)}function za(e,t,i=.9){return(Array.isArray(t)?t:[t]).filter(Boolean).some(a=>zh(e,a)>=i)}function Hf(e){return e?(e.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i)?.[1]||e.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g," ")||e.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||"").replace(/\s+\d+\s*\.?\s*sezon\b[\s\S]*$/i,"").replace(/\s+[-|]\s*(?:sezonluk\s*dizi|sezonlukdizi|filmekseni|yabanci\s*dizi)[\s\S]*$/i,"").trim():""}const Hh="3508611138826751fdf77beaa6f93eb93fd27e6a5acb910e7aad22665513dd6e",qh="666482389dc76bfa57068407418f7dac9f6c14b6868856b169165b9fac7d812e",ni="4F5A9C3D9A86FA54EACEDDD635185/c3c5bd17-e37b-4b94-a944-8a3688a30452",Fh="aLhsnd71BqsMC_HZoT8MR_TrfZS1_WcAzYT5nROaUKI",Uh="MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDq5iorf3BOWNqObZFRyco/sa7GrDO5r094yhO1FsWRvwoTRneD1ryv+yVLwJrr0IOmjhD2hgyErvs6XRhAmNa18fcMlHJqHlghHA0dt2FnkFlqlZ029/w1inZ8+g5XFjffNp8Xb5T44PrsowlI5Mjfe0JpkHCN20tLkmGdMUes9yQNbKwpUXvBPq/bLYn8IJNoR/kP/4mis7mMeRzWgIupc9AlFx6HH7IZ6NfYmyqDdo7xdSg+WNl/rcuYcPccuN6dIhqWeceSOFiChaGHJMtuEzbHHefRqbK529eNHVTpUmRtfaZu2a+DRXkoz2TU1KCrnSDuNztvlKjiztiJZMdlAgMBAAECggEACCjTmSw1lfsfKGhk7l7gkCLXa95Kc65Dx/HZCmbOmRf2PSIq/6DjcAd8zatUllFpaU0xCKcyYx+C6Y2XTJMijjJn/v9fFBGWxRuo1vnqP8MzX/Dvg5vMnn1/TSsQeXTznuTSVOmS1qxV+wdUyLvtwFmTPoB+cGcIMAlXK7MtBrSD9kCRcpJZgFNUILhn6ISm9NpaqU+5xBBuJRsXaMDvSUTHi1IKK2ZUneetFAgg6BVE5StmORBjMgXfNRIsD+oOHUvtsEczcHnAP2hW19I0lXfwnLhaAicKIECCDpn6cwfBtQWnSDSENCLMemM2O8KYvAizBW4ET3BZBqSDrZEzRwKBgQD/9o7qbE2LEJ19Mkg+4PTqMJ06bFWKUvUB3JuS4Iu/wy9u6tAU7uQySo9vSDDclG8TaDjkz6c2eTmDy7LdFESwLgiHV6cmpm0sieoTMaz1pVkpykifQo1fv2Q60t/co6oEyUWfmdk3iaK6j3MFhjqRpkmZcUYvBYyuRUv8ewKtcwKBgQDq7tRYL2c6cIznwqTJdLuap3eFRP21ymjV/TTp2DrZtVevw9rNYflDK88mIxZdbbAqPT10zbRc3UnqeE2+76UKBAodUJpSPXg2WvA0hZe57q1VnU7gQhMgvDWRPrTG7qbij+FnRtPHWZ1HGLFfl2DSDnFEVsJo2xXQjw5vMTOBxwKBgQDlbKQQ7t5aRZxD+WvUIGKl/skO8seBYnYFIy226tmYGmVLr+Cuwql7gmUqQ7S4Ibul04cbYBzqsKGixlQd4OroV3qBhUlnVUkJ4NwUNDRpQbm3wX5ycX6yUaSPLTBGXdQo0hc7xPRz2UQooCdizjt1DW1uwZ88ymacVbSUK9XsjQKBgGTNhR8xd8GDeXIX+kzWYYjCQm5UY+gUqVboBkQwG1A+lxk7mC5301QXABMFCxubbPMyw6PSf4k5CfYpGHLMsKvTf+OEKjMPXP01l8txZuDIoGcT0Dw5Hav2FaX0meyhicm8oqKFqWjn8qwG1FSHx2tZ9w+zikcjegC64R6kpc0RAoGAO4/tqaXM5CUUWtHanK/1j6KYbFqsKL13FeqIr8TprF4LXpzrzFAPMCmWL6XFq8JZqZj/KNjH9vvt9f7/9QMvI4nZ+0vXihRqdX7LO+XliGRhuXjHp3RlUU4s8eJt9Af7PCFWFX0gwfM8SnkVUTkE3tOQHgk7hM3PUOPH0yZ+gQ8=",jh="MIIDDDCCAfSgAwIBAgIJYFwVX3W1KCXxMA0GCSqGSIb3DQEBCwUAMBgxFjAUBgNVBAMMDWF0dGVzdF9yc2FfdjEwHhcNMjYwOTA4MTUwMjMyWhcNMjcwOTA4MTUwMjMyWjAYMRYwFAYDVQQDDA1hdHRlc3RfcnNhX3YxMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6uYqK39wTljajm2RUcnKP7Guxqwzua9PeMoTtRbFkb8KE0Z3g9a8r_slS8Ca69CDpo4Q9oYMhK77Ol0YQJjWtfH3DJRyah5YIRwNHbdhZ5BZapWdNvf8NYp2fPoOVxY33zafF2-U-OD67KMJSOTI33tCaZBwjdtLS5JhnTFHrPckDWysKVF7wT6v2y2J_CCTaEf5D_-JorO5jHkc1oCLqXPQJRcehx-yGejX2Jsqg3aO8XUoPljZf63LmHD3HLjenSIalnnHkjhYgoWhhyTLbhM2xx3n0amyudvXjR1U6VJkbX2mbtmvg0V5KM9k1NSgq50g7jc7b5So4s7YiWTHZQIDAQABo1kwVzAMBgNVHRMBAf8EAjAAMA4GA1UdDwEB_wQEAwIFoDAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwGAYDVR0RBBEwD4INYXR0ZXN0X3JzYV92MTANBgkqhkiG9w0BAQsFAAOCAQEAREcHgi7mZGgOpu1jBzN89IJIdMSRjYI5AYwhePByZy7U4SOeqq5WTXPsOZdUjGyib1CJzvs44ro8_L9hLfeJCzNTRk9yyAt_EJ6QHAqdyMIBwNSSb3wDg6N7T4x4MJrgoHJ7uRf2iGEdMfazb2aZFyHQjyt4paUCrix5jt7FXY_02pyEQWPLYQb8U6nf8strd4nNdrm9EPAEF7zY7ZXD5L8egXvTkdmvsBRU5OQLftw1JaPkLu85zMQ2hZtscmCQ2ImxxwBlUqS7V_QmaMFHkdJrWQdXF7vU2Ws0qv3qBU7-FJgqGUSuDMFw7sMeeWuVKvg7WjSxolwPZrqIo6ZSUA";function Kh(e){let t="";for(let i=0;i<e.length;i++)t+=String.fromCharCode(e[i]);return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"")}function Wh(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");for(;t.length%4;)t+="=";const i=atob(t),n=new Uint8Array(i.length);for(let a=0;a<i.length;a++)n[a]=i.charCodeAt(a);return n}function Yh(e){const t=new Uint8Array(e.length/2);for(let i=0;i<t.length;i++)t[i]=parseInt(e.substr(i*2,2),16);return t}function bc(e){return Array.from(e).map(t=>t.toString(16).padStart(2,"0")).join("")}async function Vh(e){const t=new TextEncoder().encode(e),i=await crypto.subtle.digest("SHA-256",t);return bc(new Uint8Array(i))}async function Gh(e,t){const i=new TextEncoder,n=await crypto.subtle.importKey("raw",i.encode(e),{name:"HMAC",hash:"SHA-256"},!1,["sign"]),a=await crypto.subtle.sign("HMAC",n,i.encode(t));return bc(new Uint8Array(a))}async function Ha(e,t,i=""){const n=Math.floor(Date.now()/1e3).toString(),a=typeof crypto.randomUUID=="function"?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,l=>{const u=Math.random()*16|0;return(l==="x"?u:u&3|8).toString(16)}),r=await Vh(i),o=`${e}
${t}
${n}
${a}
${r}`,s=await Gh(Hh,o);return{"user-agent":"okhttp/4.12.0","X-Timestamp":n,"X-Nonce":a,"X-Signature":s,"X-App-Version":"110","X-Client-Id":"rectv-android"}}let An=null;async function Jh(){if(An)return An;const e=atob(Uh),t=new Uint8Array(e.length);for(let i=0;i<e.length;i++)t[i]=e.charCodeAt(i);return An=await crypto.subtle.importKey("pkcs8",t,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},!1,["sign"]),An}let yi=null,Cn=0;const Xh=typeof window>"u";function qa(e){return Xh?`https://a.prectv70.lol/api${e}`:`/api/rtv${e}`}let No=0;async function Zh(){const e=Math.floor(Date.now()/1e3);if(yi&&Cn>e+120)return yi;if(typeof localStorage<"u"){const t=localStorage.getItem("rectv_jwt_token"),i=parseInt(localStorage.getItem("rectv_jwt_exp")||"0",10);if(t&&i>e+120)return yi=t,Cn=i,t}if(Date.now()-No<3e5)return null;try{const i={...await Ha("GET","/api/attest/nonce",""),"x-rtv-path":"/attest/nonce"},n=await fetch(qa("/attest/nonce"),{method:"GET",headers:i});if(!n.ok)throw new Error(`Nonce request failed with status ${n.status}`);const r=(await n.json()).nonce;if(!r)throw new Error("Empty nonce returned");const o=Wh(r),s=await Jh(),l=await crypto.subtle.sign("RSASSA-PKCS1-v1_5",s,o),u=Kh(new Uint8Array(l)),p="/api/attest/verify",h=JSON.stringify({certChain:[jh],nonce:r,pkg:"com.rectv.shot",proof:u,sig:Fh}),g={...await Ha("POST",p,h),"x-rtv-path":"/attest/verify","Content-Type":"application/json"},v=await fetch(qa("/attest/verify"),{method:"POST",headers:g,body:h});if(!v.ok)throw new Error(`Verify attestation failed with status ${v.status}`);const b=await v.json();if(!b.jwt)throw new Error("Verify did not return JWT");if(yi=b.jwt,Cn=b.exp||e+7200,typeof localStorage<"u")try{localStorage.setItem("rectv_jwt_token",yi),localStorage.setItem("rectv_jwt_exp",Cn.toString())}catch{}return yi}catch{return No=Date.now(),null}}let Ln=null;async function Qh(){if(Ln)return Ln;const e=Yh(qh);return Ln=await crypto.subtle.importKey("raw",e,{name:"AES-GCM"},!1,["decrypt"]),Ln}async function Fa(e){if(!e)return"";if(e.startsWith("http://")||e.startsWith("https://"))return e;try{const t=atob(e),i=new Uint8Array(t.length);for(let l=0;l<t.length;l++)i[l]=t.charCodeAt(l);const n=i.slice(0,12),a=i.slice(12),r=await Qh(),o=await crypto.subtle.decrypt({name:"AES-GCM",iv:n,tagLength:128},r,a);return new TextDecoder("utf-8").decode(o)}catch{return""}}async function ri(e,t="GET",i=""){let n=null;try{n=await Zh()}catch{}const a=`/api${e}`,o={...await Ha(t,a,i),"x-rtv-path":e,...n?{Authorization:`Bearer ${n}`}:{},...i?{"Content-Type":"application/json"}:{}};try{const s=await fetch(qa(e),{method:t,headers:o,signal:AbortSignal.timeout(6e3),...i?{body:i}:{}});if(s.ok)return await s.json()}catch{}return null}async function qf({type:e="movie",title:t="",originalTitle:i="",season:n=1,episode:a=1,year:r=null}){const o=(t||i||"").trim();if(!o)return[];const s=parseInt(n,10)||1,l=parseInt(a,10)||1;try{let u=await ri(`/search/${encodeURIComponent(o)}/${ni}/`);if((!u||!Array.isArray(u.posters)||u.posters.length===0)&&i&&i.toLowerCase()!==o.toLowerCase()&&(u=await ri(`/search/${encodeURIComponent(i.trim())}/${ni}/`)),!u||!Array.isArray(u.posters)||u.posters.length===0)return[];const p=[o,i].filter(Boolean),h=e==="movie";let g=null;const v=w=>{if(!w)return!1;if(za(w,p))return!0;const k=w.split(/\s*[-/:]\s*/).filter(Boolean);for(const f of k)if(za(f,p))return!0;return!1};for(const w of u.posters)if((h?w.type==="movie":w.type==="serie")&&v(w.title||w.name||"")){g=w;break}if(!g)return[];const b=[];if(h){if(Array.isArray(g.sources))for(const w of g.sources){if(!w.enc_url&&!w.url)continue;const k=w.enc_url?await Fa(w.enc_url):w.url;if(!k||!k.startsWith("http"))continue;const f=`/api/hls_proxy?url=${encodeURIComponent(k)}&ref=https://a.prectv70.lol/`,E=(w.title||"").toLowerCase().includes("dublaj")||(g.label||"").toLowerCase().includes("dublaj")?"🇹🇷 TVR VIP (TR Dublaj)":"⚡ TVR VIP (TR Altyazı)";b.push({id:`tvr_movie_${g.id}_${w.id}`,name:E,displayName:E,badge:"⚡ TVR VIP",source:"TVR VIP",url:f,streamUrl:f,rawStreamUrl:k,quality:"1080p HD",isHls:!0,isDirectVideo:!0,priority:0,getUrl:()=>f})}}else{const w=await ri(`/season/by/serie/${g.id}/${ni}/`);if(Array.isArray(w))for(const k of w){const f=(k.title||k.name||"").toLowerCase(),y=f.match(/(\d+)/)||[];if((y[1]?parseInt(y[1],10):parseInt(k.number||k.season_number||k.num||"0",10)||1)!==s)continue;const C=f.includes("dublaj")||(k.label||"").toLowerCase().includes("dublaj");let x=Array.isArray(k.episodes)?k.episodes:null;if(!x||x.length===0){const A=await ri(`/episode/by/season/${k.id}/${ni}/`);Array.isArray(A)?x=A:A&&Array.isArray(A.episodes)&&(x=A.episodes)}if(!(!Array.isArray(x)||x.length===0))for(const A of x){const L=(A.title||A.name||"").toLowerCase().match(/(\d+)/)||[];if((L[1]?parseInt(L[1],10):parseInt(A.number||A.episode_number||A.num||"0",10)||1)!==l)continue;let z=Array.isArray(A.sources)?A.sources:Array.isArray(A.videos)?A.videos:Array.isArray(A.streams)?A.streams:[];if(z.length===0&&A.id){const K=await ri(`/source/by/episode/${A.id}/${ni}/`);Array.isArray(K)?z=K:K&&Array.isArray(K.sources)&&(z=K.sources)}for(const K of z){const W=K.enc_url||K.encUrl||K.encrypted_url,O=K.url||K.stream_url||K.video||K.link||K.source;if(!W&&!O)continue;const B=W?await Fa(W):O;if(!B||!B.startsWith("http"))continue;const D=`/api/hls_proxy?url=${encodeURIComponent(B)}&ref=https://a.prectv70.lol/`,V=C||(K.title||K.name||"").toLowerCase().includes("dublaj")?`🇹🇷 TVR S${s}E${l} (TR Dublaj)`:`⚡ TVR S${s}E${l} (TR Altyazı)`;b.push({id:`tvr_ep_${g.id}_${A.id||A.number}_${K.id||B.slice(-8)}`,name:V,displayName:V,badge:"⚡ TVR VIP",source:"TVR VIP",url:D,streamUrl:D,rawStreamUrl:B,quality:"1080p HD",isHls:!0,isDirectVideo:!0,priority:0,getUrl:()=>D})}}}}return b}catch{return[]}}const ha=[{id:"tvr_ch_dmax",tvrId:"dmax",isDaion:!0,name:"DMAX",category:"national",logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/DMAX_Logo_2019.svg/200px-DMAX_Logo_2019.svg.png",quality:"HD Canlı",streamUrl:""},{id:"tvr_ch_tlc",tvrId:"tlc",isDaion:!0,name:"TLC",category:"national",logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/TLC_Logo.svg/200px-TLC_Logo.svg.png",quality:"HD Canlı",streamUrl:""}];async function ef(){try{const e=await ri(`/channel/by/filtres/0/0/0/${ni}/`);if(!Array.isArray(e))return[...ha];const t=new Map([[1,"sports"],[2,"doc"],[3,"national"],[4,"news"],[5,"music"],[6,"national"],[7,"kids"],[8,"national"]]),i=new Set,n=[];for(const a of e){const r=String(a.id||"").trim();if(!r||i.has(r)||String(a.playas||"1")==="0")continue;i.add(r);const o=Number(a.categories?.[0]?.id||0);n.push({id:`tvr_ch_${r}`,tvrId:r,isTvr:!0,name:a.title||a.name||`TVR ${r}`,category:t.get(o)||"national",logo:a.image||a.poster||"",quality:"1080p TVR",streamUrl:""})}for(const a of ha)n.some(o=>{const s=(o.name||"").toLowerCase();return s===a.name.toLowerCase()||s.includes(a.tvrId)})||n.push(a);return n}catch{return[...ha]}}const Yi=new Map,In=new Map,Oo=2*60*1e3;async function Rn(e,{forceRefresh:t=!1}={}){if(!e)return null;const i=String(e).replace(/^tvr_ch_/,"");if(i==="dmax"||i==="tlc"||i==="81"||i==="83"){const r=i==="81"||i==="dmax"?"dmax":"tlc",o=`daion_${r}`,s=Yi.get(o);if(!t&&s&&s.expiresAt>Date.now())return s.url;try{const l=await fetch(`/api/live_tv_stream?channel=${r}&json=1`);if(l.ok){const u=await l.json();if(u&&u.url)return Yi.set(o,{url:u.url,expiresAt:Date.now()+Oo}),u.url}}catch{}return`/api/live_tv_stream?channel=${r}`}const n=Yi.get(i);if(!t&&n&&n.expiresAt>Date.now())return n.url;if(In.has(i))return In.get(i);t&&Yi.delete(i);const a=(async()=>{try{const r=await ri(`/channel/by/${i}/${ni}/`);if(!r||!Array.isArray(r.sources))return null;const o=r.sources.find(u=>!u.locked&&(u.enc_url||u.url));if(!o)return null;const s=o.enc_url?await Fa(o.enc_url):o.url;if(!s||!s.startsWith("http"))return null;const l=`/api/hls_proxy?url=${encodeURIComponent(s)}&ref=https://a.prectv70.lol/`;return Yi.set(i,{url:l,expiresAt:Date.now()+Oo}),l}catch{return null}})();In.set(i,a);try{return await a}finally{In.delete(i)}}const pr="cinepulse_epg_live_cache",wc=30*60*1e3;let wt=null,zo=0,fa=!1,rn=null;const tf={ch_cnbce:[{start:"07:00",end:"10:00",title:"Sabah Piyasaları & Finans"},{start:"10:00",end:"14:00",title:"Piyasa Ekranı & Global Trendler"},{start:"14:00",end:"18:00",title:"Kapanışa Doğru"},{start:"18:00",end:"20:00",title:"The Simpsons"},{start:"20:00",end:"21:00",title:"Mad Men"},{start:"21:00",end:"23:00",title:"Game of Thrones Kuşağı"},{start:"23:00",end:"01:00",title:"Late Night Show"},{start:"01:00",end:"07:00",title:"Gece Finans & Belgesel"}],tvr_ch_141:[{start:"08:00",end:"11:00",title:"İtalya Serie A Goller"},{start:"11:00",end:"14:00",title:"EuroLeague Özel Kuşağı"},{start:"14:00",end:"17:00",title:"La Liga Günlüğü & Özetler"},{start:"17:00",end:"20:00",title:"Maç Önü & Canlı Stüdyo"},{start:"20:00",end:"23:00",title:"Canlı Futbol / Basketbol Karşılaşması"},{start:"23:00",end:"02:00",title:"Günün Analizi & Tartışma"},{start:"02:00",end:"08:00",title:"Premier Maç Tekrarları"}],tvr_ch_140:[{start:"08:00",end:"12:00",title:"Formula 1 Özel Kuşağı"},{start:"12:00",end:"15:00",title:"NBA Action & En İyi Hareketler"},{start:"15:00",end:"19:00",title:"Uluslararası Voleybol Ligi"},{start:"19:00",end:"22:00",title:"Canlı Basketbol / Tenis Karşılaşması"},{start:"22:00",end:"01:00",title:"Motorsporları Kuşağı"},{start:"01:00",end:"08:00",title:"Gecenin Tekrarları"}]},Ho={sports:[{start:"06:00",end:"09:00",title:"Spor Bülteni & Günün Manşetleri"},{start:"09:00",end:"12:00",title:"Maç Özetleri & Goller Kuşağı"},{start:"12:00",end:"14:00",title:"Öğle Sporu & Transfer Raporu"},{start:"14:00",end:"17:00",title:"Uluslararası Ligler & Analiz"},{start:"17:00",end:"19:00",title:"Maç Önü & Stüdyo Analizi"},{start:"19:00",end:"21:30",title:"Canlı Karşılaşma / Canlı Yayın"},{start:"21:30",end:"23:45",title:"Dev Maç Özel Yayını"},{start:"23:45",end:"02:00",title:"Son Sayfa & Tartışma Programı"},{start:"02:00",end:"06:00",title:"Gecenin Maçları (Tekrar)"}],news:[{start:"06:00",end:"09:00",title:"Güne Başlarken & Sabah Raporu"},{start:"09:00",end:"12:00",title:"Ekonomi ve Politika Gündemi"},{start:"12:00",end:"14:00",title:"Gün Ortası Bülteni"},{start:"14:00",end:"17:00",title:"Sıcak Gelişmeler & Canlı Bağlantılar"},{start:"17:00",end:"19:00",title:"Akşam Bülteni & Manşetler"},{start:"19:00",end:"20:30",title:"Ana Haber Bülteni"},{start:"20:30",end:"23:30",title:"Türkiye'nin Nabzı & Açık Oturum"},{start:"23:30",end:"01:30",title:"Gece Raporu & Dünya Basını"},{start:"01:30",end:"06:00",title:"Gece Bülteni"}],doc:[{start:"06:00",end:"09:00",title:"Vahşi Yaşamın İzinde"},{start:"09:00",end:"12:00",title:"Evrenin Gizemleri ve Uzay"},{start:"12:00",end:"15:00",title:"Mega Yapılar & Mühendislik"},{start:"15:00",end:"18:00",title:"Tarihin Bilinmeyen Sayfaları"},{start:"18:00",end:"20:00",title:"Okyanusların Derinlikleri"},{start:"20:00",end:"22:00",title:"Büyük Kediler: Hayatta Kalma"},{start:"22:00",end:"00:30",title:"Dünyanın En Gizemli Keşifleri"},{start:"00:30",end:"06:00",title:"Gece Belgesel Kuşağı"}],kids:[{start:"06:00",end:"09:00",title:"Sabah Neşesi Çizgi Filmler"},{start:"09:00",end:"12:00",title:"Eğlenceli Maceralar & Kahramanlar"},{start:"12:00",end:"15:00",title:"Sevimli Dostlar & Bilim Zamanı"},{start:"15:00",end:"18:00",title:"Süper Kahramanlar Kuşağı"},{start:"18:00",end:"20:30",title:"Akşam Aile Sineması"},{start:"20:30",end:"22:30",title:"Fantastik Çizgi Dizi"},{start:"22:30",end:"06:00",title:"Gece Masalları"}],music:[{start:"06:00",end:"10:00",title:"Güne Enerjik Başla (Top 20 Pop)"},{start:"10:00",end:"14:00",title:"Hit Müzik & Radyo Şarkıları"},{start:"14:00",end:"18:00",title:"Trendler & En Çok Dinlenenler"},{start:"18:00",end:"21:00",title:"Akşam Ritimleri & Klip Kuşağı"},{start:"21:00",end:"23:30",title:"Canlı Akustik & Popüler Klipler"},{start:"23:30",end:"02:00",title:"Gece Chill & Deep House"},{start:"02:00",end:"06:00",title:"Kesintisiz Gece Müziği"}],national:[{start:"06:00",end:"09:00",title:"Sabah Programı & Magazin"},{start:"09:00",end:"12:00",title:"Gündüz Kuşağı Programı"},{start:"12:00",end:"14:00",title:"Gün Ortası & Yemek Programı"},{start:"14:00",end:"17:00",title:"Popüler Dizi Tekrar Kuşağı"},{start:"17:00",end:"19:00",title:"Yarışma Kuşağı"},{start:"19:00",end:"20:00",title:"Akşam Ana Haber"},{start:"20:00",end:"23:30",title:"Prime Time Sinema / Dizi"},{start:"23:30",end:"02:00",title:"Gece Sineması"},{start:"02:00",end:"06:00",title:"Gece Kuşağı"}]};function qo(e){if(!e||!e.includes(":"))return 0;const[t,i]=e.split(":").map(Number);return(t||0)*60+(i||0)}function nf(){try{const e=(typeof window<"u"&&window.sessionStorage?sessionStorage.getItem(pr):null)||(typeof window<"u"&&window.localStorage?localStorage.getItem(pr):null);if(!e)return null;const t=JSON.parse(e);if(t&&t.channels&&Date.now()-(t.updatedAt||0)<12*3600*1e3)return t.channels}catch{}return null}function rf(e){try{typeof window<"u"&&window.sessionStorage&&sessionStorage.setItem(pr,JSON.stringify({updatedAt:Date.now(),channels:e})),typeof window<"u"&&window.localStorage&&localStorage.removeItem(pr)}catch{}}async function Fo(e=!1){const t=Date.now();if(!e&&wt&&t-zo<wc||fa)return wt;fa=!0;try{let i=null;try{i=await fetch("/api/epg")}catch{}if((!i||!i.ok)&&(i=await fetch("/epg-data.json")),i&&i.ok){const n=await i.json();n&&n.channels&&Object.keys(n.channels).length>0&&(wt=n.channels,zo=t,rf(n.channels),window.dispatchEvent(new CustomEvent("epg-updated",{detail:{count:Object.keys(n.channels).length}})))}}catch{}finally{fa=!1}return wt}function af(){if(!wt){const e=nf();e&&(wt=e)}Fo(),rn===null&&(rn=setInterval(()=>{Fo(!0)},wc))}function sf(){rn!==null&&(clearInterval(rn),rn=null)}function $n(e){if(!e)return{title:"Canlı Yayın",timeRange:"Canlı Akış",start:"00:00",end:"23:59",progress:50,remainingMin:30,nextTitle:"Yayın Akışı"};const t=Date.now();if(wt&&wt[e.id]&&wt[e.id].length>0){const r=wt[e.id];for(let s=0;s<r.length;s++){const l=r[s];if(t>=l.startTs&&t<l.endTs){const u=Math.max(1,(l.endTs-l.startTs)/6e4),p=Math.max(0,(t-l.startTs)/6e4),h=Math.min(100,Math.max(0,Math.round(p/u*100))),g=Math.max(1,Math.round((l.endTs-t)/6e4)),v=r[s+1];return{title:l.title,timeRange:`${l.start} - ${l.end}`,start:l.start,end:l.end,progress:h,remainingMin:g,nextTitle:v?v.title:"Sonraki Program"}}}const o=r.find(s=>s.startTs>t);if(o)return{title:o.title,timeRange:`${o.start} - ${o.end}`,start:o.start,end:o.end,progress:5,remainingMin:Math.max(1,Math.round((o.endTs-t)/6e4)),nextTitle:"Yayın Başlamak Üzere"}}const i=new Date,n=i.getHours()*60+i.getMinutes();let a=tf[e.id];a||(a=Ho[e.category]||Ho.national);for(let r=0;r<a.length;r++){const o=a[r],s=qo(o.start);let l=qo(o.end);l<=s&&(l+=24*60);let u=n;if(s>l-24*60&&n<s&&n<l%(24*60)&&(u+=24*60),u>=s&&u<l){const p=l-s,h=u-s,g=Math.min(100,Math.max(0,Math.round(h/p*100))),v=Math.max(1,l-u),b=a[(r+1)%a.length];return{title:o.title,timeRange:`${o.start} - ${o.end}`,start:o.start,end:o.end,progress:g,remainingMin:v,nextTitle:b?b.title:"Sonraki Program"}}}return{title:`${e.name} Canlı Yayın`,timeRange:"Canlı Akış",start:"00:00",end:"23:59",progress:50,remainingMin:30,nextTitle:"Yayın Akışı Devam Ediyor"}}const kc="cinepulse_live_favs";function Uo(){try{const e=localStorage.getItem(kc);return e?JSON.parse(e):[]}catch{return[]}}function of(e){try{localStorage.setItem(kc,JSON.stringify(e))}catch{}}function lf(){const e=Ct(),t=y=>String(y||"").toLocaleUpperCase("tr-TR").replace(/\b(?:HD|FHD|4K|KANALI)\b/g,"").replace(/[^A-ZÇĞİÖŞÜ0-9]/g,""),i=[...pa],n=e?i.filter(y=>y.category==="kids"):i;let a=e?"kids":"all",r=e?n.find(y=>y.id==="ch_trtcocuk")||n[0]:i.find(y=>y.id==="ch_trt1")||i[0],o="",s=null,l=!1,u=1,p=null,h=null;function g(y){return Uo().includes(y)}function v(y){let E=Uo();E.includes(y)?(E=E.filter(C=>C!==y),ee("Favorilerden çıkarıldı","info")):(E.push(y),ee("Favorilere eklendi ⭐","success")),of(E),k()}function b(){return n.filter(y=>{let E=!0;a==="favorites"?E=g(y.id):a!=="all"&&(E=y.category===a);const C=!o||y.name.toLowerCase().includes(o.toLowerCase());return E&&C})}function w(y){return n.findIndex(E=>E.id===y.id)}let k=()=>{};return{html:`
    <div class="livetv-view-full" id="livetv-root">

      <!-- TOP: Full-Width Cinematic TV Player -->
      <section class="tv-hero-player-section" id="tv-hero-player-section">
        <!-- Layout shift placeholder for smooth Floating PiP -->
        <div class="tv-screen-placeholder" id="tv-screen-placeholder"></div>

        <div class="tv-screen" id="tv-screen" tabindex="0">
          <video id="tv-video" autoplay playsinline webkit-playsinline></video>

          <!-- Floating Mini-Player (PiP) Top Bar -->
          <div class="tv-pip-header" id="tv-pip-header">
            <div class="tv-pip-meta">
              <img class="tv-pip-logo" id="tv-pip-logo" src="${r.logo}" alt="" onerror="this.onerror=null; this.src='${bt(r.name,r.category)}';" />
              <div class="tv-pip-info">
                <span class="tv-pip-name" id="tv-pip-name">${r.name}</span>
                <span class="tv-pip-epg" id="tv-pip-epg">CANLI YAYIN</span>
              </div>
            </div>
            <div class="tv-pip-actions">
              <button class="tv-pip-btn tv-pip-btn-expand" id="tv-pip-expand" title="Oynatıcıya Dön">
                <i data-lucide="maximize" style="width:13px;height:13px;"></i>
              </button>
              <button class="tv-pip-btn tv-pip-btn-close" id="tv-pip-close" title="Mini Oynatıcıyı Kapat">
                <i data-lucide="x" style="width:13px;height:13px;"></i>
              </button>
            </div>
          </div>

          <!-- Backdrop Click Handler for Toggle Controls -->
          <div class="tv-screen-backdrop" id="tv-screen-backdrop"></div>

          <!-- Minimal Elegant Top Channel Badge (Logo + Name + Number + Live EPG) -->
          <div class="tv-osd-topbar" id="tv-osd-topbar">
            <div class="tv-osd-channel-meta">
              <div class="tv-osd-logo-box">
                <img id="tv-top-logo" class="tv-top-logo" src="${r.logo}" alt="" onerror="this.onerror=null; this.src='${bt(r.name,r.category)}';" />
              </div>
              <div class="tv-osd-text">
                <div class="tv-osd-ch-title">
                  <span id="tv-top-name">${r.name}</span>
                  <span class="tv-osd-num-tag" id="tv-top-num">CH 01</span>
                </div>
                <div class="tv-top-epg-line" id="tv-top-epg-line">
                  <span class="tv-top-epg-badge">YAYINDA</span>
                  <span class="tv-top-epg-title" id="tv-top-epg-title">Yayın Akışı Yükleniyor...</span>
                  <span class="tv-top-epg-prog" id="tv-top-epg-prog">%0</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Big Center OSD Banner on Channel Switch -->
          <div class="tv-osd-banner hidden" id="tv-osd">
            <img id="tv-osd-logo" class="tv-osd-logo" src="" alt="" />
            <div class="tv-osd-info">
              <div class="tv-osd-name" id="tv-osd-name"></div>
              <div class="tv-osd-meta">
                <span class="tv-osd-live-dot"></span>
                <span>CANLI YAYIN</span>
                <span class="tv-osd-quality" id="tv-osd-quality"></span>
              </div>
              <div class="tv-osd-epg-sub" id="tv-osd-epg-sub"></div>
            </div>
            <div class="tv-osd-chnum" id="tv-osd-chnum"></div>
          </div>

          <!-- Loading Spinner -->
          <div class="tv-loading hidden" id="tv-loading">
            <div class="tv-loading-spinner"></div>
            <span class="tv-loading-text">Yayın bağlanıyor...</span>
          </div>

          <!-- Error State with Auto-Reconnect -->
          <div class="tv-error hidden" id="tv-error">
            <div class="tv-error-icon-box">
              <i data-lucide="radio" style="width:36px;height:36px;color:#ef4444;"></i>
            </div>
            <span class="tv-error-msg">Yayın akışı geçici olarak yanıt vermedi</span>
            <div class="tv-error-actions">
              <button class="tv-retry-btn" id="tv-retry-btn">
                <i data-lucide="refresh-cw" style="width:14px;height:14px;"></i> Tekrar Bağlan
              </button>
              <button class="tv-next-btn" id="tv-error-next-btn">Sonraki Kanala Geç</button>
            </div>
          </div>

          <!-- Spacious Sleek Bottom Control Bar -->
          <div class="tv-screen-controls" id="tv-screen-controls">
            <!-- Left: Channel Navigation & Play/Pause & Live Badge -->
            <div class="tv-ctrl-group tv-ctrl-left">
              <button class="tv-ctrl-action-btn" id="tv-btn-prev-ch" title="Önceki Kanal (P-)">
                <i data-lucide="skip-back" style="width:18px;height:18px;"></i>
              </button>
              <button class="tv-ctrl-action-btn tv-play-btn" id="tv-btn-play-pause" title="Oynat / Duraklat (Space)">
                <i data-lucide="pause" style="width:20px;height:20px;"></i>
              </button>
              <button class="tv-ctrl-action-btn" id="tv-btn-next-ch" title="Sonraki Kanal (P+)">
                <i data-lucide="skip-forward" style="width:18px;height:18px;"></i>
              </button>
              <div class="tv-live-sync-indicator" id="tv-btn-sync" title="Canlı Yayına Eşitle">
                <span class="tv-live-sync-dot"></span>
                <span>CANLI</span>
              </div>
            </div>

            <!-- Center: Volume Slider & Mute -->
            <div class="tv-volume-group">
              <button class="tv-ctrl-action-btn" id="tv-btn-mute" title="Sesi Aç/Kapat (M)">
                <i data-lucide="volume-2" style="width:18px;height:18px;"></i>
              </button>
              <div class="tv-volume-slider-box">
                <input type="range" id="tv-volume-slider" class="tv-volume-slider" min="0" max="1" step="0.05" value="1" />
              </div>
            </div>

            <!-- Right: Numpad & Quality & Reload & Fullscreen -->
            <div class="tv-ctrl-group tv-ctrl-right">
              <!-- Numpad Zapper Keypad Button -->
              <button class="tv-ctrl-action-btn tv-numpad-btn" id="tv-btn-numpad" title="Kanal Numarası Tuş Takımı">
                <i data-lucide="hash" style="width:18px;height:18px;"></i>
              </button>

              <!-- HLS Quality / Bitrate Selector Dropdown -->
              <div class="tv-quality-wrapper" id="tv-quality-wrapper">
                <button class="tv-ctrl-action-btn tv-quality-btn" id="tv-btn-quality" title="Yayın Kalitesi / Bitrate">
                  <i data-lucide="settings" style="width:17px;height:17px;"></i>
                  <span class="tv-quality-badge-text" id="tv-quality-badge">AUTO</span>
                </button>
                <div class="tv-quality-menu hidden" id="tv-quality-menu">
                  <div class="tv-quality-menu-header">
                    <i data-lucide="sliders" style="width:13px;height:13px;color:#fbbf24;"></i>
                    <span>Yayın Çözünürlüğü</span>
                  </div>
                  <div class="tv-quality-options" id="tv-quality-options">
                    <button class="tv-quality-opt active" data-level="-1">
                      <i data-lucide="check" style="width:12px;height:12px;"></i>
                      <span>Otomatik (Adaptive)</span>
                    </button>
                  </div>
                </div>
              </div>

              <button class="tv-ctrl-action-btn" id="tv-btn-reload" title="Akışı Yenile (R)">
                <i data-lucide="rotate-cw" style="width:18px;height:18px;"></i>
              </button>
              <button class="tv-ctrl-action-btn" id="tv-btn-fullscreen" title="Tam Ekran (F)">
                <i data-lucide="maximize-2" style="width:18px;height:18px;"></i>
              </button>
            </div>
          </div>

        </div>
      </section>

      <!-- Glowing Numpad HUD Banner (Keyboard 0-9 input feedback) -->
      <div class="tv-numpad-hud hidden" id="tv-numpad-hud">
        <div class="tv-numpad-hud-digits" id="tv-numpad-hud-digits">01</div>
        <div class="tv-numpad-hud-name" id="tv-numpad-hud-name">Kanal Bekleniyor...</div>
      </div>

      <!-- Floating Translucent Numpad Modal (Interactive Touch / Mouse Keypad) -->
      <div class="tv-numpad-modal hidden" id="tv-numpad-modal">
        <div class="tv-numpad-modal-backdrop" id="tv-numpad-modal-backdrop"></div>
        <div class="tv-numpad-pad">
          <div class="tv-numpad-pad-header">
            <div class="tv-numpad-display">
              <span class="tv-numpad-display-tag">KANALA ZIPLA</span>
              <span class="tv-numpad-display-val" id="tv-pad-display-val">--</span>
              <span class="tv-numpad-display-sub" id="tv-pad-display-sub">Numara tuşlayın</span>
            </div>
            <button class="tv-numpad-pad-close" id="tv-numpad-close" title="Kapat">
              <i data-lucide="x" style="width:16px;height:16px;"></i>
            </button>
          </div>
          <div class="tv-numpad-keys">
            <button class="tv-num-key" data-digit="1">1</button>
            <button class="tv-num-key" data-digit="2">2</button>
            <button class="tv-num-key" data-digit="3">3</button>
            <button class="tv-num-key" data-digit="4">4</button>
            <button class="tv-num-key" data-digit="5">5</button>
            <button class="tv-num-key" data-digit="6">6</button>
            <button class="tv-num-key" data-digit="7">7</button>
            <button class="tv-num-key" data-digit="8">8</button>
            <button class="tv-num-key" data-digit="9">9</button>
            <button class="tv-num-key tv-num-key-clear" data-digit="clear">C</button>
            <button class="tv-num-key" data-digit="0">0</button>
            <button class="tv-num-key tv-num-key-ok" data-digit="ok">ZAP ⚡</button>
          </div>
        </div>
      </div>

      <!-- BOTTOM: Channel Switcher & Full Catalog (Mobile & Desktop) -->
      <section class="tv-bottom-catalog-section">

        <!-- Controls & Filter Toolbar -->
        <div class="tv-catalog-toolbar">

          <!-- Category Navigation Pills with Arrows -->
          <div class="tv-cat-nav-container">
            <button class="tv-cat-arrow-btn tv-cat-prev" id="tv-cat-prev" type="button" title="Geri kaydır">
              <i data-lucide="chevron-left" style="width:16px;height:16px;"></i>
            </button>
            <div class="tv-catalog-categories" id="tv-category-strip">
              ${Dh.map(y=>`
                <button class="tv-cat-filter-btn ${y.id===a?"active":""}" data-cat="${y.id}">
                  <i data-lucide="${y.icon}" style="width:14px;height:14px;"></i>
                  <span>${y.name}</span>
                </button>
              `).join("")}
            </div>
            <button class="tv-cat-arrow-btn tv-cat-next" id="tv-cat-next" type="button" title="İleri kaydır">
              <i data-lucide="chevron-right" style="width:16px;height:16px;"></i>
            </button>
          </div>

          <!-- Search & Counter Area -->
          <div class="tv-catalog-search-area">
            <div class="tv-catalog-search-box">
              <i data-lucide="search" class="tv-search-icon"></i>
              <input type="text" id="tv-search" class="tv-search-field" placeholder="Kanal adı ara..." />
              <button class="tv-search-clear-btn hidden" id="tv-search-clear" title="Temizle">
                <i data-lucide="x" style="width:14px;height:14px;"></i>
              </button>
            </div>
            <span class="tv-catalog-count-badge" id="tv-guide-count">73 KANAL</span>
          </div>

        </div>

        <!-- Main Channel Grid (Flows Below Video) -->
        <div class="tv-channel-grid" id="tv-channel-grid">
          <!-- Rendered dynamically -->
        </div>

      </section>

    </div>
  `,init:y=>{if(!y)return;af();const E=Bh(),{setTimeout:C,clearTimeout:x,setInterval:A,clearInterval:R}=E,L=y.querySelector("#tv-video"),N=y.querySelector("#tv-screen"),z=y.querySelector("#tv-hero-player-section"),K=y.querySelector("#tv-screen-placeholder"),W=y.querySelector("#tv-screen-backdrop");y.querySelector("#tv-osd-topbar");const O=y.querySelector("#tv-top-logo"),B=y.querySelector("#tv-top-name"),D=y.querySelector("#tv-top-num"),J=y.querySelector("#tv-top-epg-title"),V=y.querySelector("#tv-top-epg-prog");y.querySelector("#tv-pip-header");const U=y.querySelector("#tv-pip-logo"),Y=y.querySelector("#tv-pip-name"),ne=y.querySelector("#tv-pip-epg"),re=y.querySelector("#tv-pip-expand"),ie=y.querySelector("#tv-pip-close"),fe=y.querySelector("#tv-osd"),ge=y.querySelector("#tv-osd-logo"),te=y.querySelector("#tv-osd-name"),P=y.querySelector("#tv-osd-quality"),M=y.querySelector("#tv-osd-chnum"),j=y.querySelector("#tv-osd-epg-sub"),Q=y.querySelector("#tv-loading"),de=y.querySelector("#tv-error"),S=y.querySelector("#tv-retry-btn"),T=y.querySelector("#tv-error-next-btn"),q=y.querySelector("#tv-btn-play-pause"),Z=y.querySelector("#tv-btn-prev-ch"),we=y.querySelector("#tv-btn-next-ch"),se=y.querySelector("#tv-btn-sync"),pe=y.querySelector("#tv-btn-mute"),Ge=y.querySelector("#tv-volume-slider"),Je=y.querySelector("#tv-btn-reload"),Ue=y.querySelector("#tv-btn-fullscreen"),Ie=y.querySelector("#tv-btn-quality"),De=y.querySelector("#tv-quality-badge"),ze=y.querySelector("#tv-quality-menu"),We=y.querySelector("#tv-quality-options"),je=y.querySelector("#tv-btn-numpad"),ae=y.querySelector("#tv-numpad-modal"),m=y.querySelector("#tv-numpad-modal-backdrop"),c=y.querySelector("#tv-numpad-close"),d=y.querySelector("#tv-pad-display-val"),_=y.querySelector("#tv-pad-display-sub"),I=y.querySelector("#tv-numpad-hud"),$=y.querySelector("#tv-numpad-hud-digits"),H=y.querySelector("#tv-numpad-hud-name"),ue=y.querySelector("#tv-channel-grid"),Le=y.querySelector("#tv-search"),Se=y.querySelector("#tv-search-clear"),me=y.querySelector("#tv-category-strip"),xe=y.querySelector("#tv-cat-prev"),fs=y.querySelector("#tv-cat-next"),ms=y.querySelector("#tv-guide-count");function gn(){const F=w(r)+1,X=$n(r);B&&(B.textContent=r.name),D&&(D.textContent=`CH ${String(F).padStart(2,"0")}`),J&&(J.textContent=`${X.title} (${X.timeRange})`),V&&(V.textContent=`%${X.progress}`),O&&(O.src=r.logo,O.onerror=()=>{O.onerror=null,O.src=bt(r.name,r.category)}),Y&&(Y.textContent=r.name),ne&&(ne.textContent=`${X.title} (%${X.progress})`),U&&(U.src=r.logo,U.onerror=()=>{U.onerror=null,U.src=bt(r.name,r.category)})}function gs(){gn(),ue&&ue.querySelectorAll(".tv-grid-card").forEach(X=>{const ye=X.getAttribute("data-id"),be=i.find(Re=>Re.id===ye);if(!be)return;const le=$n(be),Ne=X.querySelector(".tv-epg-title"),Ae=X.querySelector(".tv-epg-time"),nt=X.querySelector(".tv-epg-bar-fill"),oe=X.querySelector(".tv-epg-pct");Ne&&Ne.textContent!==le.title&&(Ne.textContent=le.title,Ne.title=le.title),Ae&&Ae.textContent!==le.timeRange&&(Ae.textContent=le.timeRange),nt&&(nt.style.width=`${le.progress}%`),oe&&oe.textContent!==`%${le.progress}`&&(oe.textContent=`%${le.progress}`)})}const Rr=()=>{gs()};E.on(window,"epg-updated",Rr);let ys=A(()=>{if(!document.body.contains(y)){R(ys),window.removeEventListener("epg-updated",Rr);return}gs()},2e4);function Cc(){h&&x(h);const F=w(r),X=$n(r);ge&&(ge.src=r.logo,ge.onerror=()=>{ge.onerror=null,ge.src=bt(r.name,r.category)}),te&&(te.textContent=r.name),P&&(P.textContent=r.quality),M&&(M.textContent=String(F+1).padStart(2,"0")),j&&(j.textContent=`📺 ${X.title} • %${X.progress} tamamlandı`),fe.classList.remove("hidden"),fe.classList.add("tv-osd-show"),h=C(()=>{fe.classList.remove("tv-osd-show"),fe.classList.add("tv-osd-hide"),C(()=>{fe.classList.add("hidden"),fe.classList.remove("tv-osd-hide")},350)},2500)}function yn(){N.classList.add("user-active"),p&&x(p),p=C(()=>{N.classList.remove("user-active"),ze&&ze.classList.add("hidden")},3500)}N.addEventListener("mousemove",yn),N.addEventListener("touchstart",yn,{passive:!0}),W&&(W.addEventListener("click",F=>{F.stopPropagation(),N.classList.contains("user-active")?(N.classList.remove("user-active"),p&&x(p),ze&&ze.classList.add("hidden")):yn()}),W.addEventListener("dblclick",F=>{F.stopPropagation(),Ue&&Ue.click()}));function Ni(F){F=Math.max(0,Math.min(1,F)),u=F,L.volume=F,Ge&&(Ge.value=F),F===0?(l=!0,L.muted=!0,pe&&(pe.innerHTML='<i data-lucide="volume-x" style="width:18px;height:18px;color:#ef4444;"></i>')):(l=!1,L.muted=!1,pe&&(pe.innerHTML='<i data-lucide="volume-2" style="width:18px;height:18px;"></i>')),G()}Ge&&Ge.addEventListener("input",F=>{Ni(parseFloat(F.target.value))}),pe&&pe.addEventListener("click",F=>{F.stopPropagation(),l?(Ni(u||.8),ee("Ses açıldı","info")):(L.muted=!0,l=!0,pe.innerHTML='<i data-lucide="volume-x" style="width:18px;height:18px;color:#ef4444;"></i>',G(),ee("Sessize alındı","info"))}),q&&q.addEventListener("click",F=>{F.stopPropagation(),L.paused?(L.play(),q.innerHTML='<i data-lucide="pause" style="width:18px;height:18px;"></i>'):(L.pause(),q.innerHTML='<i data-lucide="play" style="width:18px;height:18px;"></i>'),G()}),se&&se.addEventListener("click",F=>{F.stopPropagation(),s&&L.seekable&&L.seekable.length>0?(L.currentTime=L.seekable.end(L.seekable.length-1),L.play(),ee("Canlı yayına eşitlendi","info")):Zt(r)});function $r(F){if(!We||!De)return;if(!F||!F.levels||F.levels.length<=1){De.textContent=r.quality?r.quality.split(" ")[0]:"HD",We.innerHTML=`
            <button class="tv-quality-opt active" data-level="-1">
              <i data-lucide="check" style="width:13px;height:13px;color:#fbbf24;"></i>
              <span>Kaynak Kalite (${r.quality||"1080p"})</span>
            </button>
          `,G();return}const X=F.levels,ye=F.currentLevel;let be=`
          <button class="tv-quality-opt ${ye===-1?"active":""}" data-level="-1">
            ${ye===-1?'<i data-lucide="check" style="width:13px;height:13px;color:#fbbf24;"></i>':'<span style="width:13px;display:inline-block;"></span>'}
            <span>Otomatik (Adaptive)</span>
          </button>
        `;if(X.forEach((le,Ne)=>{const Ae=le.height||(le.attrs&&le.attrs.RESOLUTION?le.attrs.RESOLUTION.height:720),nt=Ae>=1080?"1080p FHD":Ae>=720?"720p HD":Ae>=480?"480p SD":`${Ae}p`,oe=ye===Ne;be+=`
            <button class="tv-quality-opt ${oe?"active":""}" data-level="${Ne}">
              ${oe?'<i data-lucide="check" style="width:13px;height:13px;color:#fbbf24;"></i>':'<span style="width:13px;display:inline-block;"></span>'}
              <span>${nt}</span>
            </button>
          `}),We.innerHTML=be,ye===-1)De.textContent="AUTO";else if(X[ye]){const le=X[ye].height;De.textContent=le?`${le}p`:"HD"}We.querySelectorAll(".tv-quality-opt").forEach(le=>{le.addEventListener("click",Ne=>{Ne.stopPropagation();const Ae=parseInt(le.dataset.level,10);if(s){s.currentLevel=Ae,$r(s),ze&&ze.classList.add("hidden");const nt=le.querySelector("span").textContent;ee(`Kalite ayarlandı: ${nt}`,"success")}})}),G()}Ie&&ze&&(Ie.addEventListener("click",F=>{F.stopPropagation(),ze.classList.toggle("hidden"),yn()}),E.on(document,"click",F=>{F.target.closest("#tv-quality-wrapper")||ze.classList.add("hidden")}));let vn=!1;function vs(){if(!z||!K||!N||document.fullscreenElement)return;const X=z.getBoundingClientRect().bottom<80;X&&L&&!L.paused&&!vn?N.classList.contains("is-floating-pip")||(N.classList.add("is-floating-pip"),K.classList.add("is-active"),gn()):X||N.classList.contains("is-floating-pip")&&(N.classList.remove("is-floating-pip"),K.classList.remove("is-active"),vn=!1)}E.on(window,"scroll",vs,{passive:!0}),re&&re.addEventListener("click",F=>{F.stopPropagation(),z&&z.scrollIntoView({behavior:"smooth",block:"start"})}),ie&&ie.addEventListener("click",F=>{F.stopPropagation(),vn=!0,N.classList.remove("is-floating-pip"),K.classList.remove("is-active")});let He="",Mr=null;function Pr(F){if(F>=0&&F<i.length){const X=i[F];ee(`Kanal ${F+1}: ${X.name}`,"info"),Zt(X),z&&z.scrollIntoView({behavior:"smooth",block:"start"})}else ee(`Kanal ${F+1} bulunamadı`,"warning");He="",I&&I.classList.add("hidden"),ae&&ae.classList.add("hidden")}function bs(){if(!I||!$||!H)return;const F=parseInt(He,10),X=i[F-1];$.textContent=He.padStart(2,"0"),H.textContent=X?X.name:"Geçersiz Kanal",I.classList.remove("hidden"),d&&(d.textContent=He.padStart(2,"0")),_&&(_.textContent=X?X.name:"Geçersiz Kanal"),Mr&&x(Mr),Mr=C(()=>{He&&Pr(F-1)},1300)}je&&ae&&je.addEventListener("click",F=>{F.stopPropagation(),He="",d&&(d.textContent="--"),_&&(_.textContent="Numara tuşlayın"),ae.classList.toggle("hidden")}),c&&c.addEventListener("click",()=>{ae.classList.add("hidden"),He=""}),m&&m.addEventListener("click",()=>{ae.classList.add("hidden"),He=""}),ae&&ae.querySelectorAll(".tv-num-key").forEach(F=>{F.addEventListener("click",X=>{X.stopPropagation();const ye=F.dataset.digit;if(ye==="clear")He="",d&&(d.textContent="--"),_&&(_.textContent="Numara tuşlayın");else if(ye==="ok"){if(He){const be=parseInt(He,10);Pr(be-1)}}else He.length>=2&&(He=""),He+=ye,bs()})});let Qe=0;async function Zt(F){const X=++Qe;if(r=F,vn=!1,gn(),Cc(),Ic(),s){try{s.stopLoad(),s.detachMedia(),s.destroy()}catch{}s=null}if(L)try{L.pause(),L.removeAttribute("src"),L.load()}catch{}Q.classList.remove("hidden"),de.classList.add("hidden");const ye=()=>{Qe===X&&(Q.classList.add("hidden"),de.classList.add("hidden"))};L.addEventListener("loadeddata",ye,{once:!0}),C(()=>{L.removeEventListener("loadeddata",ye),Qe===X&&L.readyState<2&&oe()},2e4);let be=!1,le=0,Ne=!1,Ae=!1;async function nt(Ee){if(be||!F.isTvr||!F.tvrId)return!1;be=!0,Q.classList.remove("hidden"),de.classList.add("hidden");try{const Pe=await Rn(F.tvrId,{forceRefresh:!0});if(Qe!==X)return!0;if(Pe&&Pe!==Ee)return F.streamUrl=Pe,Lt(Pe),!0}catch{}return!1}function oe(){Qe===X&&(Q.classList.add("hidden"),de.classList.remove("hidden"))}function Re(Ee){if(Ne||!/^https?:\/\//i.test(Ee))return!1;Ne=!0;const Pe=`${new URL(Ee).origin}/`,zi=`/api/hls_proxy?url=${encodeURIComponent(Ee)}&ref=${encodeURIComponent(Pe)}`;return F.streamUrl=zi,Lt(zi),!0}function Lt(Ee){if(Qe===X)if(St.isSupported()){if(s){try{s.stopLoad(),s.detachMedia(),s.destroy()}catch{}s=null}const Pe=new St({enableWorker:!0,lowLatencyMode:!0,startLevel:0,capLevelToPlayerSize:!0,backBufferLength:10,maxBufferLength:8,maxMaxBufferLength:15,liveSyncDurationCount:2,liveMaxLatencyDurationCount:5,manifestLoadingTimeOut:12e3,manifestLoadingMaxRetry:1,manifestLoadingRetryDelay:350,levelLoadingTimeOut:14e3,levelLoadingMaxRetry:1,fragLoadingTimeOut:12e3});s=Pe,Pe.loadSource(Ee),Pe.attachMedia(L),Pe.on(St.Events.MANIFEST_PARSED,()=>{if(Qe!==X){try{Pe.stopLoad(),Pe.detachMedia(),Pe.destroy()}catch{}return}$r(Pe),L.play().catch(()=>{})}),Pe.on(St.Events.ERROR,(zi,Or)=>{if(!(Qe!==X||s!==Pe)&&Or.fatal)if(Or.type===St.ErrorTypes.NETWORK_ERROR)F.isTvr&&F.tvrId?nt(Ee).then(Ss=>{!Ss&&!Re(Ee)&&oe()}):le<1?(le+=1,Q.classList.remove("hidden"),C(()=>{Qe===X&&s===Pe&&Lt(Ee)},700)):Re(Ee)||oe();else if(Or.type===St.ErrorTypes.MEDIA_ERROR)if(Ae)oe();else{Ae=!0;try{Pe.recoverMediaError()}catch{oe()}}else oe()})}else L.canPlayType("application/vnd.apple.mpegurl")?(L.src=Ee,L.addEventListener("loadedmetadata",()=>{Qe===X&&($r(null),L.play().catch(()=>{}))},{once:!0}),L.addEventListener("error",()=>{Qe===X&&nt(Ee).then(Pe=>{!Pe&&!Re(Ee)&&oe()})},{once:!0})):oe()}let St;try{St=(await yl(async()=>{const{default:Ee}=await import("./hls-BuERnqCp.js");return{default:Ee}},[],import.meta.url)).default}catch{oe();return}Qe===X&&(F.isTvr&&F.tvrId&&!F.streamUrl?Rn(F.tvrId).then(Ee=>{Qe===X&&(Ee?(F.streamUrl=Ee,Lt(Ee)):oe())}).catch(()=>{Qe===X&&oe()}):(Lt(F.streamUrl),F.isTvr&&F.tvrId&&Rn(F.tvrId).then(Ee=>{Ee&&(F.streamUrl=Ee)}).catch(()=>{})),L.muted=l,L.volume=u)}function Oi(F){const X=b();if(X.length===0)return;const ye=X.findIndex(le=>le.id===r.id);let be;F==="prev"||F==="up"?be=ye<=0?X.length-1:ye-1:be=ye>=X.length-1?0:ye+1,Zt(X[be])}Z&&Z.addEventListener("click",F=>{F.stopPropagation(),Oi("prev")}),we&&we.addEventListener("click",F=>{F.stopPropagation(),Oi("next")}),T&&T.addEventListener("click",()=>Oi("next")),S&&S.addEventListener("click",()=>Zt(r)),Je&&Je.addEventListener("click",()=>{ee("Yayın yeniden yükleniyor...","info"),Zt(r)});function Lc(){const F=b();if(ms&&(ms.textContent=`${F.length} KANAL`),F.length===0){ue.innerHTML=`
            <div class="tv-catalog-empty-state">
              <i data-lucide="radio" style="width:40px;height:40px;color:var(--text-muted);"></i>
              <span class="tv-empty-title">Kanal Bulunamadı</span>
              <p class="tv-empty-sub">Arama teriminizi veya kategori filtrenizi değiştirin.</p>
            </div>
          `,G();return}ue.innerHTML=F.map(X=>{const ye=X.id===r.id,be=g(X.id),le=w(X)+1,Ne=bt(X.name,X.category),Ae=$n(X);return`
            <div class="tv-grid-card ${ye?"active":""}" data-id="${X.id}">
              <div class="tv-grid-card-top">
                <span class="tv-grid-num">${String(le).padStart(2,"0")}</span>
                <button class="tv-grid-fav-btn ${be?"is-fav":""}" data-favid="${X.id}" title="${be?"Favorilerden Çıkar":"Favorilere Ekle"}">
                  <i data-lucide="star" style="width:15px;height:15px;${be?"fill:#fbbf24;color:#fbbf24;":""}"></i>
                </button>
              </div>

              <div class="tv-grid-logo-box">
                <img class="tv-grid-logo" src="${X.logo}" alt="${X.name}" onerror="this.onerror=null; this.src='${Ne}';" loading="lazy" />
              </div>

              <div class="tv-grid-info">
                <span class="tv-grid-name" title="${X.name}">${X.name}</span>
                <div class="tv-grid-meta">
                  <span class="tv-grid-quality">${X.quality}</span>
                  ${X.isTvr?'<span class="tv-grid-vip-tag">VIP</span>':""}
                </div>
              </div>

              <!-- Real-Time EPG Schedule Progress -->
              <div class="tv-grid-epg">
                <div class="tv-epg-header">
                  <span class="tv-epg-title" title="${Ae.title}">${Ae.title}</span>
                  <span class="tv-epg-time">${Ae.timeRange}</span>
                </div>
                <div class="tv-epg-bar">
                  <div class="tv-epg-fill" style="width: ${Ae.progress}%"></div>
                </div>
                <div class="tv-epg-footer">
                  <span class="tv-epg-pct">%${Ae.progress} tamamlandı</span>
                  <span class="tv-epg-rem">${Ae.remainingMin} dk kaldı</span>
                </div>
              </div>

              ${ye?'<div class="tv-grid-live-indicator"><span class="tv-live-dot"></span> <span>ŞU AN İZLENİYOR</span></div>':""}
            </div>
          `}).join(""),ue.querySelectorAll(".tv-grid-card").forEach(X=>{X.addEventListener("click",ye=>{if(ye.target.closest(".tv-grid-fav-btn"))return;const be=i.find(le=>le.id===X.dataset.id);be&&be.id!==r.id&&(Zt(be),z&&z.scrollIntoView({behavior:"smooth",block:"start"}))})}),ue.querySelectorAll(".tv-grid-fav-btn").forEach(X=>{X.addEventListener("click",ye=>{ye.stopPropagation(),v(X.dataset.favid)})}),G()}function Ic(){ue&&ue.querySelectorAll(".tv-grid-card").forEach(F=>{const X=F.dataset.id===r.id;F.classList.toggle("active",X);const ye=F.querySelector(".tv-grid-live-indicator");if(!X&&ye&&ye.remove(),X&&!ye){const be=document.createElement("div");be.className="tv-grid-live-indicator",be.innerHTML='<span class="tv-live-dot"></span><span>ŞU AN İZLENİYOR</span>',F.appendChild(be)}})}if(k=()=>{Lc(),gn(),G()},Le&&Le.addEventListener("input",F=>{o=F.target.value.trim(),Se&&Se.classList.toggle("hidden",!o),k()}),Se&&Se.addEventListener("click",()=>{Le.value="",o="",Se.classList.add("hidden"),k()}),me){xe&&xe.addEventListener("click",le=>{le.stopPropagation(),me.scrollBy({left:-220,behavior:"smooth"})}),fs&&fs.addEventListener("click",le=>{le.stopPropagation(),me.scrollBy({left:220,behavior:"smooth"})}),me.addEventListener("wheel",le=>{Math.abs(le.deltaY)>Math.abs(le.deltaX)&&(le.preventDefault(),me.scrollLeft+=le.deltaY)},{passive:!1});let F=!1,X=0,ye=0,be=!1;me.addEventListener("mousedown",le=>{le.button===0&&(F=!0,be=!1,X=le.pageX-me.offsetLeft,ye=me.scrollLeft)}),E.on(window,"mousemove",le=>{if(!F)return;const Ae=(le.pageX-me.offsetLeft-X)*1.5;Math.abs(Ae)>6&&(be=!0,me.classList.add("is-dragging")),me.scrollLeft=ye-Ae}),E.on(window,"mouseup",()=>{F&&(F=!1,me.classList.remove("is-dragging"),C(()=>{be=!1},50))}),me.querySelectorAll(".tv-cat-filter-btn").forEach(le=>{le.addEventListener("click",Ne=>{if(be){Ne.preventDefault();return}me.querySelectorAll(".tv-cat-filter-btn").forEach(Ae=>Ae.classList.remove("active")),le.classList.add("active"),a=le.dataset.cat,le.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"}),k()})})}Ue&&Ue.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen().catch(()=>{}):N.requestFullscreen().catch(()=>{})}),E.on(document,"fullscreenchange",()=>{const F=!!document.fullscreenElement;N.classList.toggle("is-fullscreen",F),Ue&&(Ue.innerHTML=F?'<i data-lucide="minimize-2" style="width:18px;height:18px;"></i>':'<i data-lucide="maximize-2" style="width:18px;height:18px;"></i>',G())});function ws(F){if(document.activeElement!==Le){if(F.key>="0"&&F.key<="9"){He.length>=2&&(He=""),He+=F.key,bs();return}if(F.key==="Enter"&&He){F.preventDefault();const X=parseInt(He,10);Pr(X-1);return}switch(F.key){case"ArrowUp":case"w":case"W":F.preventDefault(),Oi("prev");break;case"ArrowDown":case"s":case"S":F.preventDefault(),Oi("next");break;case"ArrowRight":F.preventDefault(),Ni(u+.05);break;case"ArrowLeft":F.preventDefault(),Ni(u-.05);break;case"m":case"M":pe&&pe.click();break;case"f":case"F":Ue&&Ue.click();break;case"r":case"R":Je&&Je.click();break;case" ":F.preventDefault(),q&&q.click();break}}}E.on(document,"keydown",ws);let Br=null,Dr=!1;const ks=()=>{if(E.dispose(),sf(),Qe++,R(ys),Br&&R(Br),window.removeEventListener("epg-updated",Rr),window.removeEventListener("scroll",vs),s){try{s.stopLoad(),s.detachMedia(),s.destroy()}catch{}s=null}if(L)try{L.pause(),L.removeAttribute("src"),L.load()}catch{}document.removeEventListener("keydown",ws)};window.__LiveTvController={cleanup:ks};const Nr=new MutationObserver(()=>{document.contains(y)||(ks(),Nr.disconnect())});Nr.observe(document.body,{childList:!0,subtree:!0}),E.add(()=>Nr.disconnect()),k(),Zt(r),Ni(1);const _s=async()=>{if(!(Dr||!document.contains(y))){Dr=!0;try{const F=await ef();if(!document.contains(y)||!Array.isArray(F))return;const X=new Set(pa.map(oe=>t(oe.name))),ye=new Set(pa.filter(oe=>oe.tvrId).map(oe=>String(oe.tvrId))),be=F.filter(oe=>{const Re=t(oe.name);return Re&&!X.has(Re)&&!ye.has(String(oe.tvrId))}),le=await Promise.all(be.map(async oe=>{const Re=await Rn(oe.tvrId,{forceRefresh:!0});if(!Re)return null;const Lt=i.find(Ee=>Ee.isDynamicTvr&&String(Ee.tvrId)===String(oe.tvrId)),St={...oe,isDynamicTvr:!0,streamUrl:Re,logo:oe.logo||bt(oe.name,oe.category)};return Lt?(Object.assign(Lt,St),Lt):St}));if(!document.contains(y))return;const Ne=le.filter(Boolean),Ae=new Set(Ne.map(oe=>oe.id));let nt=!1;for(let oe=i.length-1;oe>=0;oe--){const Re=i[oe];Re.isDynamicTvr&&!Ae.has(Re.id)&&Re.id!==r.id&&(i.splice(oe,1),nt=!0)}for(const oe of Ne)i.some(Re=>Re.id===oe.id)||(i.push(oe),nt=!0);if(e){for(let oe=n.length-1;oe>=0;oe--){const Re=n[oe];Re.isDynamicTvr&&!Ae.has(Re.id)&&Re.id!==r.id&&n.splice(oe,1)}for(const oe of Ne.filter(Re=>Re.category==="kids"))n.some(Re=>Re.id===oe.id)||n.push(oe)}nt&&k()}catch{}finally{Dr=!1}}};_s(),Br=A(_s,30*1e3)}}}const cf=3e4,df=10*6e4,uf=5,pf=6e4;let Ir=0,an=!1,hr=0,Kn=0,fr=0;function hf(){Ir=Date.now()+cf}function ff(){return _c()||Ir>Date.now()}function _c(){return an&&hr<=Date.now()&&(an=!1,hr=0),an}function mf(){an=!0,hr=Date.now()+df,Ir=0,Kn=0,fr=0}function gf(){an=!1,hr=0,Ir=0}function Ua(){return Math.max(0,Math.ceil((fr-Date.now())/1e3))}function yf(){return fr>Date.now()||(Kn+=1,Kn>=uf&&(Kn=0,fr=Date.now()+pf)),Ua()}async function vf(){if(!_c())return{html:`
        <div class="admin-auth-container animate-fade-in">
          <div class="admin-auth-card">
            <div class="admin-shield-icon">
              <i data-lucide="shield-alert" style="width: 38px; height: 38px; color: #f59e0b;"></i>
            </div>
            <h1 style="font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem;">
              Yönetici Doğrulaması
            </h1>
            <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.5rem;">
              Bu alan kısıtlıdır. Yönetici PIN kodunuzu girin.
            </p>

            <form id="admin-login-form" style="display: flex; flex-direction: column; gap: 1rem;">
              <div style="position: relative;">
                <input 
                  type="password" 
                  id="admin-pin-input" 
                  class="admin-pin-input" 
                  placeholder="••••" 
                  maxlength="12"
                  autocomplete="off"
                  autofocus
                  required
                />
              </div>

              <div id="admin-login-error" style="color: #ef4444; font-size: 0.85rem; font-weight: 600; display: none;">
                Geçersiz PIN Kodu!
              </div>

              <button type="submit" class="admin-btn-primary">
                <i data-lucide="unlock" style="width: 18px; height: 18px;"></i>
                <span>Giriş Yap</span>
              </button>

              <a href="#home" class="admin-btn-secondary" style="display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none; margin-top: 0.25rem; width: 100%; border-radius: var(--radius-md); padding: 0.75rem; box-sizing: border-box;">
                <i data-lucide="arrow-left" style="width: 16px; height: 16px;"></i>
                <span>Ana Ekrana Dön</span>
              </a>
            </form>
          </div>
        </div>
      `,init:n=>{const a=n.querySelector("#admin-login-form"),r=n.querySelector("#admin-pin-input"),o=n.querySelector("#admin-login-error");a.addEventListener("submit",s=>{s.preventDefault();const l=r.value.trim(),u=Ua();if(u>0){o.textContent=`Çok fazla hatalı deneme. ${u} saniye sonra tekrar deneyin.`,o.style.display="block";return}if(Dc(l))mf(),window.dispatchEvent(new CustomEvent("cinepulse_admin_state_changed"));else{const p=yf();o.textContent=p>0?`Çok fazla hatalı deneme. ${p} saniye bekleyin.`:"Geçersiz PIN kodu!",o.style.display="block",r.classList.add("admin-input-error"),setTimeout(()=>r.classList.remove("admin-input-error"),400),r.value=""}}),G(n)}};const t=mr();Vt();const i=ft();return{html:`
      <div class="admin-dashboard container animate-fade-in" style="padding: 2.5rem 1rem; max-width: 1000px; margin: 0 auto; width: 100%;">
        <!-- Header -->
        <div class="admin-dash-header" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-color, rgba(255,255,255,0.1));">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.8rem; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 999px; color: #f59e0b; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
              <i data-lucide="shield-check" style="width: 14px; height: 14px;"></i> Sistem Yöneticisi
            </div>
            <h1 style="font-size: 1.8rem; font-weight: 800; color: #fff;">CinePulse Güvenlik & Kontrol Paneli</h1>
            <p style="font-size: 0.9rem; color: #94a3b8; margin-top: 0.25rem;">
              İçerik filtreleme, uygunsuz başlık kara listesi ve sistem ayarları
            </p>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
            <a href="#home" class="admin-btn-secondary" style="padding: 0.6rem 1.2rem; display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; cursor: pointer;">
              <i data-lucide="arrow-left" style="width: 16px; height: 16px;"></i>
              <span>Ana Ekrana Dön</span>
            </a>
            <button id="admin-lock-btn" class="admin-btn-secondary" style="padding: 0.6rem 1.2rem; display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer; color: #ef4444; border-color: rgba(239, 68, 68, 0.3);">
              <i data-lucide="lock" style="width: 16px; height: 16px;"></i>
              <span>Paneli Kilitle & Çık</span>
            </button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
          <!-- 1. Blocklist Management Card -->
          <div class="admin-card">
            <div class="admin-card-header">
              <i data-lucide="ban" style="width: 20px; height: 20px; color: #ef4444;"></i>
              <h2 style="font-size: 1.15rem; font-weight: 700; color: #fff;">İçerik Kara Listesi (Filtreleme)</h2>
            </div>
            <p style="font-size: 0.82rem; color: #94a3b8; margin-bottom: 1rem;">
              Buraya eklenen kelimeleri veya TMDB ID'lerini içeren yapımlar çocuk modundan ve aramalardan otomatik engellenir.
            </p>

            <form id="admin-add-block-form" style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem;">
              <input 
                type="text" 
                id="admin-block-input" 
                placeholder="Yasaklanacak kelime veya ID..." 
                class="admin-input-small"
                required
              />
              <button type="submit" class="admin-btn-accent" style="white-space: nowrap;">
                <i data-lucide="plus" style="width: 16px; height: 16px;"></i> Engelle
              </button>
            </form>

            <div id="admin-block-list" class="admin-tags-container">
              ${t.map(n=>`
                <div class="admin-tag-item">
                  <span>${n}</span>
                  <button type="button" class="admin-tag-del-btn" data-entry="${n}" title="Engeli Kaldır">
                    <i data-lucide="x" style="width: 12px; height: 12px;"></i>
                  </button>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- 2. Source Engines Health Card -->
          <div class="admin-card">
            <div class="admin-card-header">
              <i data-lucide="cpu" style="width: 20px; height: 20px; color: #10b981;"></i>
              <h2 style="font-size: 1.15rem; font-weight: 700; color: #fff;">Aktif Stream Motorları</h2>
            </div>
            <p style="font-size: 0.82rem; color: #94a3b8; margin-bottom: 1rem;">
              Platformun video kaynak motorları ve çalışma durumları:
            </p>

            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <div class="admin-engine-row">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <span class="status-indicator-dot online"></span>
                  <div>
                    <div style="font-weight: 700; font-size: 0.9rem; color: #fff;">Kids VIP Engine (1080p MP4)</div>
                    <div style="font-size: 0.75rem; color: #94a3b8;">Çizgi filmler & animasyonlar için anonim doğrudan CDN</div>
                  </div>
                </div>
                <span class="admin-badge-active">Aktif</span>
              </div>

              <div class="admin-engine-row">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <span class="status-indicator-dot online"></span>
                  <div>
                    <div style="font-weight: 700; font-size: 0.9rem; color: #fff;">TVR VIP Engine (1080p HLS)</div>
                    <div style="font-size: 0.75rem; color: #94a3b8;">Diziler ve filmler için anlık 0ms HLS akışları</div>
                  </div>
                </div>
                <span class="admin-badge-active">Aktif</span>
              </div>

              <div class="admin-engine-row">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <span class="status-indicator-dot online"></span>
                  <div>
                    <div style="font-weight: 700; font-size: 0.9rem; color: #fff;">DP & DS VIP Hibrit</div>
                    <div style="font-size: 0.75rem; color: #94a3b8;">AlphaStream ve yerel ters proxy altyapısı</div>
                  </div>
                </div>
                <span class="admin-badge-active">Aktif</span>
              </div>
            </div>
          </div>

          <!-- 3. Security & PIN Change Card -->
          <div class="admin-card">
            <div class="admin-card-header">
              <i data-lucide="key" style="width: 20px; height: 20px; color: #3b82f6;"></i>
              <h2 style="font-size: 1.15rem; font-weight: 700; color: #fff;">Yönetici PIN Kodunu Değiştir</h2>
            </div>
            <p style="font-size: 0.82rem; color: #94a3b8; margin-bottom: 1rem;">
              Admin paneline giriş için kullanılan PIN kodunu güvenliğiniz için güncelleyin.
            </p>

            <form id="admin-change-pin-form" style="display: flex; flex-direction: column; gap: 0.75rem;">
              <input 
                type="password" 
                id="admin-new-pin" 
                placeholder="Yeni PIN (En az 4 hane)..." 
                class="admin-input-small"
                minlength="4"
                maxlength="16"
                required
              />
              <button type="submit" class="admin-btn-secondary" style="justify-content: center;">
                <i data-lucide="check" style="width: 16px; height: 16px;"></i> PIN Kodunu Kaydet
              </button>
            </form>
          </div>

          <!-- 4. System & Cache Utilities Card -->
          <div class="admin-card">
            <div class="admin-card-header">
              <i data-lucide="sliders-horizontal" style="width: 20px; height: 20px; color: #a78bfa;"></i>
              <h2 style="font-size: 1.15rem; font-weight: 700; color: #fff;">Tüm Profilleri Etkileyen Kontroller</h2>
            </div>
            <p style="font-size: 0.82rem; color: #94a3b8; margin-bottom: 1rem;">
              Bu tarayıcıdaki tüm profiller için kart ve fragman davranışını tek yerden yönetin.
            </p>
            <label class="admin-engine-row" style="cursor:pointer;">
              <span>Yatay kart görünümü</span>
              <input id="admin-setting-landscape" type="checkbox" ${i.cardLayout==="landscape"?"checked":""} />
            </label>
            <label class="admin-engine-row" style="cursor:pointer; margin-top:.65rem;">
              <span>Kart üstü fragman önizlemesi</span>
              <input id="admin-setting-hover" type="checkbox" ${i.hoverPreviewsEnabled!==!1?"checked":""} />
            </label>
            <label class="admin-engine-row" style="cursor:pointer; margin-top:.65rem;">
              <span>Fragmanları aç</span>
              <input id="admin-setting-trailers" type="checkbox" ${i.trailersEnabled!==!1?"checked":""} />
            </label>
            <label class="admin-engine-row" style="cursor:pointer; margin-top:.65rem;">
              <span>Sonraki bölümü otomatik oynat</span>
              <input id="admin-setting-autoplay-next" type="checkbox" ${i.autoplayNext!==!1?"checked":""} />
            </label>
            <label class="admin-engine-row" style="cursor:pointer; margin-top:.65rem;">
              <span>Altyazılar varsayılan olarak açık</span>
              <input id="admin-setting-subtitles" type="checkbox" ${i.subtitlesEnabled!==!1?"checked":""} />
            </label>
            <label class="admin-engine-row" style="cursor:pointer; margin-top:.65rem;">
              <span>Varsayılan oynatma kalitesi</span>
              <select id="admin-setting-resolution" class="admin-input-small" style="width:auto;min-width:110px;">
                ${["720p","1080p","2160p"].map(n=>`<option value="${n}" ${i.preferredResolution===n?"selected":""}>${n}</option>`).join("")}
              </select>
            </label>
            <button id="admin-save-site-settings" class="admin-btn-accent" style="width:100%;justify-content:center;margin-top:1rem;">
              <i data-lucide="save" style="width:16px;height:16px;"></i> Kontrolleri Uygula
            </button>
          </div>

          <!-- 5. System & Cache Utilities Card -->
          <div class="admin-card">
            <div class="admin-card-header">
              <i data-lucide="trash-2" style="width: 20px; height: 20px; color: #ec4899;"></i>
              <h2 style="font-size: 1.15rem; font-weight: 700; color: #fff;">Sistem & Önbellek Temizliği</h2>
            </div>
            <p style="font-size: 0.82rem; color: #94a3b8; margin-bottom: 1.25rem;">
              Eski önbellek verilerini temizleyerek tüm akışların ve ana sayfa listelerinin en taze haliyle yüklenmesini sağlar.
            </p>

            <button id="admin-clear-cache-btn" class="admin-btn-secondary" style="width: 100%; justify-content: center; color: #f43f5e; border-color: rgba(244,63,94,0.3);">
              <i data-lucide="refresh-cw" style="width: 16px; height: 16px;"></i>
              <span>Önbelleği Sıfırla & Sayfayı Yenile</span>
            </button>
          </div>
        </div>
      </div>
    `,init:n=>{const a=n.querySelector("#admin-lock-btn");a&&a.addEventListener("click",()=>{gf(),window.location.hash="#home"});const r=n.querySelector("#admin-save-site-settings");r&&r.addEventListener("click",()=>{const h=n.querySelector("#admin-setting-landscape")?.checked===!0,g=n.querySelector("#admin-setting-hover")?.checked===!0,v=n.querySelector("#admin-setting-trailers")?.checked===!0,b=n.querySelector("#admin-setting-autoplay-next")?.checked===!0,w=n.querySelector("#admin-setting-subtitles")?.checked===!0,k=n.querySelector("#admin-setting-resolution")?.value||"1080p";il({cardLayout:h?"landscape":"portrait",hoverPreviewsEnabled:g,trailersEnabled:v,autoplayNext:b,subtitlesEnabled:w,preferredResolution:k}),document.documentElement.classList.toggle("cards-landscape",h),alert("Tüm profil kontrolleri uygulandı.")});const o=n.querySelector("#admin-add-block-form"),s=n.querySelector("#admin-block-input");o&&s&&o.addEventListener("submit",h=>{h.preventDefault();const g=s.value.trim();g&&(Nc(g),nn(),window.location.reload())}),n.querySelectorAll(".admin-tag-del-btn").forEach(h=>{h.addEventListener("click",()=>{const g=h.getAttribute("data-entry");g&&(Oc(g),nn(),window.location.reload())})});const l=n.querySelector("#admin-change-pin-form"),u=n.querySelector("#admin-new-pin");l&&u&&l.addEventListener("submit",h=>{h.preventDefault();const g=u.value.trim();g.length>=4&&(Bc(g),alert("Yönetici PIN kodu başarıyla güncellendi!"),u.value="")});const p=n.querySelector("#admin-clear-cache-btn");p&&p.addEventListener("click",()=>{sessionStorage.clear(),nn(),alert("Sistem önbelleği başarıyla temizlendi."),window.location.reload()}),G(n)}}}const ci="https://dramadizilerim.com";function bf(e){return e?e.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-"):""}function jo(e){return e?e.toLowerCase().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9]/g,""):""}async function li(e,t={}){const i=typeof window<"u";let n=e;if(i)if(e.startsWith("http"))try{const a=new URL(e);n=`/api/ddz${a.pathname}${a.search}`}catch{n=e}else n=`/api/ddz${e.startsWith("/")?"":"/"}${e}`;else n.startsWith("http")||(n=`${ci}${n.startsWith("/")?"":"/"}${n}`);try{const a=await fetch(n,{...t,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Referer:ci,...t.headers||{}},signal:AbortSignal.timeout(t.timeout||6e3)}).catch(()=>null);if(a&&a.ok)return a}catch{}return null}function pn(e){if(!e)return"";try{if(e.includes("image_proxy.php?url=")){const t=e.match(/url=([^&]+)/);if(t)return decodeURIComponent(t[1])}}catch{}return e}async function Sc(e){if(!e||typeof e!="string"||e.trim().length<2)return[];const t=e.trim(),i=`/search?q=${encodeURIComponent(t)}`,n=await li(i);if(!n)return[];const a=await n.text().catch(()=>"");if(!a)return[];const r=[],o=/<a[^>]+href=["'](?:https:\/\/dramadizilerim\.com)?\/dizi\/([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;let s;for(;(s=o.exec(a))!==null;){const l=s[1],u=s[2],p=u.match(/alt=["']([^"']+)["']/i)||u.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i),h=p?p[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():l,g=u.match(/src=["']([^"']+)["']/i),v=g?pn(g[1].replace(/&amp;/g,"&")):"",b=h.toLowerCase().includes("dublaj");r.some(w=>w.slug===l)||r.push({title:h,slug:l,poster:v,isDubbed:b,url:`${ci}/dizi/${l}`})}return r}async function wf(){const e=await li("/");if(!e)return[];const t=await e.text().catch(()=>"");if(!t)return[];const i=[],n=/<a[^>]+href=["'](?:https:\/\/dramadizilerim\.com)?\/dizi\/([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;let a;for(;(a=n.exec(t))!==null;){const r=a[1],o=a[2],s=o.match(/src=["']([^"']+)["']/i),l=o.match(/alt=["']([^"']+)["']/i)||o.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i),u=l?l[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():r,p=s?pn(s[1].replace(/&amp;/g,"&")):"",h=u.toLowerCase().includes("dublaj");i.some(g=>g.slug===r)||i.push({slug:r,title:u,poster:p,isDubbed:h,badge:h?"🇹🇷 DUBLAJ":"TR ALTYAZI",url:`${ci}/dizi/${r}`})}return i}async function ma({page:e=1,query:t=""}={}){if(t&&t.trim().length>=2)return Sc(t);const i=e>1?`/dizi?page=${e}`:"/dizi",n=await li(i);if(!n)return[];const a=await n.text().catch(()=>"");if(!a)return[];const r=[],o=/<a[^>]+href=["'](?:https:\/\/dramadizilerim\.com)?\/dizi\/([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;let s;for(;(s=o.exec(a))!==null;){const l=s[1],u=s[2],p=u.match(/src=["']([^"']+)["']/i),h=u.match(/alt=["']([^"']+)["']/i)||u.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i),g=h?h[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():l,v=p?pn(p[1].replace(/&amp;/g,"&")):"",b=g.toLowerCase().includes("dublaj");r.some(w=>w.slug===l)||r.push({slug:l,title:g,poster:v,isDubbed:b,badge:b?"🇹🇷 DUBLAJ":"TR ALTYAZI",url:`${ci}/dizi/${l}`})}return r}async function kf(e){if(!e)return null;const t=await li(`/dizi/${e}`);if(!t)return null;const i=await t.text().catch(()=>"");if(!i)return null;const n=i.match(/<h1[^>]*>(.*?)<\/h1>/i),a=n?n[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():e,r=i.match(/<p class=["'][^"']*description[^"']*["'][^>]*>([\s\S]*?)<\/p>/i)||i.match(/<div class=["'][^"']*synopsis[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)||i.match(/<meta name=["']description["'] content=["']([^"']+)["']/i),o=r?r[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():"Bu kısa dizi için henüz açıklama girilmedi.",s=i.match(/<div class=["'][^"']*poster[^"']*["'][^>]*>[\s\S]*?<img[^>]+src=["']([^"']+)["']/i)||i.match(/<img[^>]+class=["'][^"']*spotlight[^"']*["'][^>]+src=["']([^"']+)["']/i),l=s?pn(s[1].replace(/&amp;/g,"&")):"",u=/<a[^>]+href=["'](?:\/izle\/|https:\/\/dramadizilerim\.com\/izle\/)([a-zA-Z0-9_-]+)\?s=(\d+)&e=(\d+)["'][^>]*>([\s\S]*?)<\/a>/gi,p=[];let h;for(;(h=u.exec(i))!==null;){const g=parseInt(h[2],10)||1,v=parseInt(h[3],10)||1,b=h[4],w=b.match(/class=["']wp-enum["']>([^<]+)</i)||b.match(/alt=["']([^"']+)["']/i),k=w?w[1].trim():`Bölüm ${v}`,f=b.match(/src=["']([^"']+)["']/i),y=f?pn(f[1].replace(/&amp;/g,"&")):"";p.some(E=>E.season===g&&E.episode===v)||p.push({season:g,episode:v,title:k,thumb:y})}return p.sort((g,v)=>g.season-v.season||g.episode-v.episode),{slug:e,title:a,poster:l,description:o,isDubbed:a.toLowerCase().includes("dublaj"),totalEpisodes:p.length,episodes:p}}async function Ff({titles:e=[],seriesTitle:t="",season:i=1,episode:n=1,isDub:a=!0}){const r=[...new Set([...e,t])].filter(C=>C&&typeof C=="string"&&C.trim().length>1);if(r.length===0)return[];const o=parseInt(i,10)||1,s=parseInt(n,10)||1;let l=null,u=null;for(const C of r){const x=bf(C),A=`/izle/${x}?s=${o}&e=${s}`,R=await li(A,{method:"HEAD",timeout:3500});if(R&&R.ok){l=x;break}}if(!l)for(const C of r){const x=await Sc(C);if(x.length>0){for(const L of x)if(za(L.title,r,.75)){l=L.slug,u=L;break}if(l)break;const A=jo(C),R=x.find(L=>{const N=jo(L.title);return N===A||N.includes(A)||A.includes(N)});if(R){l=R.slug,u=R;break}}}if(!l)return[];const p=`/izle/${l}?s=${o}&e=${s}`,h=await li(p);if(!h)return[];const g=await h.text().catch(()=>"");if(!g)return[];const v=g.match(/(?:data-src|src)=["']([^"']*embed\.php[^"']*)["']/i);if(!v)return[];let b=v[1].replace(/&amp;/g,"&");b.startsWith("http")||(b=`${ci}${b.startsWith("/")?"":"/"}${b}`);const w=await li(b,{headers:{Referer:`${ci}${p}`}});if(!w)return[];const k=await w.text().catch(()=>"");if(!k)return[];const f=[],y=k.match(/let\s+source\s*=\s*["']([^"']+)["']/);let E=y&&y[1].startsWith("http")?y[1]:null;if(!E){const C=k.match(/https?:\/\/[^"'\s\\]+\.(?:m3u8|mp4)[^"'\s\\]*/);C&&(E=C[0])}if(E){const C=E.includes(".m3u8")||E.includes("mpegurl"),R=(u?.title||l).toLowerCase().includes("dublaj")||a===!0?`🇹🇷 DDZ VIP S${o}E${s} (TR Dublaj)`:`⚡ DDZ VIP S${o}E${s} (TR Altyazı)`;f.push({id:`ddz_ep_${l}_${o}_${s}`,name:R,displayName:R,badge:"🎭 DDZ VIP",source:"DDZ VIP",url:E,streamUrl:E,rawStreamUrl:E,quality:"1080p HD",isHls:C,isDirectVideo:!0,priority:2,getUrl:()=>E})}return f}async function _f(e=null,t=""){let i=t?"search":"trending",n=t||"",a=1,r=[],o=null,s="";const l=[{id:"trending",label:"Trendler",icon:"flame",query:""},{id:"all",label:"Tüm Katalog",icon:"layers",query:""},{id:"dubbed",label:"Türkçe Dublaj",icon:"sparkles",query:"dublaj"},{id:"patron",label:"CEO & Patron",icon:"briefcase",query:"patron"},{id:"kurt",label:"Kurt & Alfa",icon:"moon",query:"kurt"},{id:"intikam",label:"İntikam & Aşk",icon:"heart-crack",query:"intikam"},{id:"milyarder",label:"Milyarder",icon:"crown",query:"milyarder"},{id:"evlilik",label:"Yasak Aşk & Evlilik",icon:"ring",query:"evlilik"}];return{html:`
    <div class="drama-view-container" id="drama-view-root">
      <!-- Ambient Glow Elements -->
      <div class="drama-ambient-glow glow-primary"></div>
      <div class="drama-ambient-glow glow-secondary"></div>

      <!-- Hero Header Section -->
      <header class="drama-hero-header">
        <div class="drama-hero-content">
          <div class="drama-hero-badge">
            <i data-lucide="sparkles" style="width: 14px; height: 14px; color: #c084fc;"></i>
            <span>ÖZEL MİNİ DİZİ &amp; REELS KÜTÜPHANESİ</span>
            <span class="drama-vip-pill">DDZ VIP</span>
          </div>
          <h1 class="drama-hero-title">Kısa Diziler &amp; Mini Seriler</h1>
          <p class="drama-hero-subtitle">
            DramaBox, ReelShort, ShortMax ve FlexTV orijinal yapımları. TMDB'de bulunmayan tüm mini bölümler, 
            <strong style="color: #e9d5ff;">Türkçe Dublaj</strong> ve <strong style="color: #e9d5ff;">Altyazı</strong> desteğiyle burada!
          </p>

          <!-- Dedicated Specialized Search Box -->
          <div class="drama-search-wrapper">
            <div class="drama-search-box">
              <i data-lucide="search" class="drama-search-icon"></i>
              <input 
                type="text" 
                id="drama-search-input" 
                class="drama-search-input" 
                placeholder="Kısa dizi adı veya konu ara... (Örn: Patron, Kurt Kızı, Milyarder, Dublaj)" 
                value="${n.replace(/"/g,"&quot;")}"
                autocomplete="off"
              />
              <button id="btn-drama-search-clear" class="btn-drama-search-clear ${n?"":"hidden"}" title="Temizle">
                <i data-lucide="x" style="width: 16px; height: 16px;"></i>
              </button>
            </div>
            <div id="drama-search-feedback" class="drama-search-feedback"></div>
          </div>

          <!-- Category Quick Filter Chips -->
          <div class="drama-category-chips" id="drama-category-chips">
            ${l.map(p=>`
              <button 
                class="drama-chip ${i===p.id?"active":""}" 
                data-tab-id="${p.id}"
                data-tab-query="${p.query}"
              >
                <i data-lucide="${p.icon}" style="width: 14px; height: 14px;"></i>
                <span>${p.label}</span>
              </button>
            `).join("")}
          </div>
        </div>
      </header>

      <!-- Main Content Area: Grid / Loader -->
      <section class="drama-catalog-section">
        <div class="drama-section-header">
          <div class="drama-section-title-wrap">
            <h2 id="drama-section-title" class="drama-section-title">
              <i data-lucide="flame" style="width: 20px; height: 20px; color: #f43f5e;"></i>
              <span>Trend Kısa Diziler</span>
            </h2>
            <span id="drama-counter-badge" class="drama-counter-badge">Yükleniyor...</span>
          </div>
        </div>

        <div id="drama-cards-grid" class="drama-cards-grid">
          <!-- Skeletons initially rendered -->
          ${Array.from({length:12}).map(()=>`
            <div class="drama-card-skeleton">
              <div class="skeleton-poster"></div>
              <div class="skeleton-title"></div>
            </div>
          `).join("")}
        </div>

        <!-- Load More / Pagination Button -->
        <div id="drama-load-more-wrap" class="drama-load-more-wrap hidden">
          <button id="btn-drama-load-more" class="btn-drama-load-more">
            <i data-lucide="plus-circle" style="width: 16px; height: 16px;"></i>
            <span>Daha Fazla Dizi Yükle</span>
          </button>
        </div>
      </section>

      <!-- Drama Detail Modal / Drawer -->
      <div id="drama-detail-modal" class="drama-modal-backdrop hidden">
        <div class="drama-modal-dialog" id="drama-modal-dialog">
          <!-- Will be dynamically injected when a drama is opened -->
        </div>
      </div>
    </div>
  `,init:async p=>{const h=p.querySelector("#drama-view-root");if(!h)return;const g=h.querySelector("#drama-search-input"),v=h.querySelector("#btn-drama-search-clear");h.querySelector("#drama-search-feedback");const b=h.querySelectorAll(".drama-chip"),w=h.querySelector("#drama-section-title"),k=h.querySelector("#drama-counter-badge"),f=h.querySelector("#drama-cards-grid"),y=h.querySelector("#drama-load-more-wrap"),E=h.querySelector("#btn-drama-load-more"),C=h.querySelector("#drama-detail-modal"),x=h.querySelector("#drama-modal-dialog");let A=null;async function R(O=!1){O||(f.innerHTML=Array.from({length:12}).map(()=>`
            <div class="drama-card-skeleton">
              <div class="skeleton-poster"></div>
              <div class="skeleton-title"></div>
            </div>
          `).join(""),k.textContent="Yükleniyor...");try{let B=[];if(n&&n.trim().length>=2)B=await ma({query:n.trim()}),w.innerHTML=`
              <i data-lucide="search" style="width: 20px; height: 20px; color: #a855f7;"></i>
              <span>"${n}" İçin Arama Sonuçları</span>
            `,y.classList.add("hidden");else{const D=l.find(J=>J.id===i)||l[0];i==="trending"?(B=await wf(),w.innerHTML=`
                <i data-lucide="flame" style="width: 20px; height: 20px; color: #f43f5e;"></i>
                <span>Trend Kısa Diziler</span>
              `,y.classList.add("hidden")):i==="all"?(B=await ma({page:a}),w.innerHTML=`
                <i data-lucide="layers" style="width: 20px; height: 20px; color: #3b82f6;"></i>
                <span>Tüm Kısa Diziler Kataloğu (Sayfa ${a})</span>
              `,y.classList.toggle("hidden",B.length===0)):D.query&&(B=await ma({query:D.query}),w.innerHTML=`
                <i data-lucide="${D.icon}" style="width: 20px; height: 20px; color: #c084fc;"></i>
                <span>${D.label} Serileri</span>
              `,y.classList.add("hidden"))}O?r=[...r,...B]:r=B,L()}catch{f.innerHTML=`
            <div class="drama-empty-state">
              <i data-lucide="alert-circle" style="width: 44px; height: 44px; color: #ef4444;"></i>
              <h3>Diziler yüklenirken bir sorun oluştu</h3>
              <p>Lütfen internet bağlantınızı kontrol edip tekrar deneyin.</p>
              <button class="btn-primary" id="btn-drama-retry">Tekrar Dene</button>
            </div>
          `,h.querySelector("#btn-drama-retry")?.addEventListener("click",()=>R(!1)),G(f)}finally{}}function L(){if(!r||r.length===0){f.innerHTML=`
            <div class="drama-empty-state">
              <i data-lucide="film" style="width: 48px; height: 48px; color: #94a3b8;"></i>
              <h3>Eşleşen Kısa Dizi Bulunamadı</h3>
              <p>Farklı bir anahtar kelime ile arama yapabilir veya Trend kategorisine göz atabilirsiniz.</p>
            </div>
          `,k.textContent="0 Dizi",G(f);return}k.textContent=`${r.length} Dizi`,f.innerHTML=r.map((O,B)=>{const D=O.isDubbed||O.title.toLowerCase().includes("dublaj"),J=O.poster||"";return`
            <article class="drama-card" data-slug="${O.slug}" tabindex="0" role="button" aria-label="${O.title}">
              <div class="drama-card-poster-wrap">
                ${J?`
                  <img 
                    src="${J}" 
                    alt="${O.title}" 
                    class="drama-card-poster" 
                    loading="lazy" 
                    decoding="async"
                    onerror="this.onerror=null;this.classList.add('broken-img');"
                  />
                `:`
                  <div class="drama-card-fallback-poster">
                    <i data-lucide="clapperboard" style="width: 32px; height: 32px; color: #a855f7;"></i>
                  </div>
                `}

                <div class="drama-card-gradient"></div>

                <!-- Badges -->
                <div class="drama-card-badges">
                  <span class="drama-badge-pill ${D?"badge-dub":"badge-sub"}">
                    ${D?"🇹🇷 DUBLAJ":"TR ALTYAZI"}
                  </span>
                  <span class="drama-badge-pill badge-type">MİNİ DİZİ</span>
                </div>

                <!-- Hover Play Glow Icon -->
                <div class="drama-card-play-action">
                  <div class="drama-play-btn-circle">
                    <i data-lucide="play" style="width: 22px; height: 22px; color: #fff; margin-left: 2px;"></i>
                  </div>
                </div>
              </div>

              <div class="drama-card-info">
                <h3 class="drama-card-title" title="${O.title}">${O.title}</h3>
                <div class="drama-card-meta">
                  <span>Reels Series</span>
                  <span>•</span>
                  <span>1080p HD</span>
                </div>
              </div>
            </article>
          `}).join(""),G(f),f.querySelectorAll(".drama-card").forEach(O=>{O.addEventListener("click",()=>{const B=O.getAttribute("data-slug");B&&N(B)}),O.addEventListener("keydown",B=>{if(B.key==="Enter"||B.key===" "){B.preventDefault();const D=O.getAttribute("data-slug");D&&N(D)}})})}async function N(O){if(O){o=null,C.classList.remove("hidden"),document.body.style.overflow="hidden",x.innerHTML=`
          <div class="drama-detail-loading">
            <div class="spin-loader"></div>
            <span>Dizi bilgileri ve bölümler yükleniyor...</span>
          </div>
        `,G(x);try{const B=await kf(O);if(!B){x.innerHTML=`
              <div class="drama-empty-state">
                <i data-lucide="alert-circle" style="width: 38px; height: 38px; color: #ef4444;"></i>
                <h3>Dizi bilgisi alınamadı</h3>
                <button class="btn-primary" id="btn-close-drama-modal">Kapat</button>
              </div>
            `,h.querySelector("#btn-close-drama-modal")?.addEventListener("click",K),G(x);return}o=B,z()}catch{K(),ee("Dizi detayları yüklenemedi.","error")}}}function z(){if(!o)return;const{slug:O,title:B,poster:D,description:J,episodes:V=[],isDubbed:U}=o,Y=V.length,ne=s?V.filter(ie=>ie.title.toLowerCase().includes(s)||String(ie.episode).includes(s)):V;x.innerHTML=`
          <button class="drama-modal-close-btn" id="btn-close-drama-modal" title="Kapat">
            <i data-lucide="x" style="width: 20px; height: 20px;"></i>
          </button>

          <div class="drama-detail-hero">
            <div class="drama-detail-backdrop-blur" style="background-image: url('${D||""}');"></div>
            <div class="drama-detail-hero-content">
              <div class="drama-detail-poster-wrap">
                <img src="${D||""}" alt="${B}" class="drama-detail-poster" />
              </div>
              <div class="drama-detail-info">
                <div class="drama-detail-badges">
                  <span class="drama-badge-pill ${U?"badge-dub":"badge-sub"}">
                    ${U?"🇹🇷 TÜRKÇE DUBLAJ":"TR ALTYAZI"}
                  </span>
                  <span class="drama-badge-pill badge-type">MİNİ DİZİ</span>
                  <span class="drama-badge-pill badge-ep-count">${Y} BÖLÜM</span>
                  <span class="drama-badge-pill badge-server">DDZ VIP HLS</span>
                </div>
                <h2 class="drama-detail-title">${B}</h2>
                <p class="drama-detail-desc">${J||"Bu kısa dizi için henüz özet girilmedi."}</p>
                <div class="drama-detail-actions">
                  <button class="btn-primary drama-btn-play-all" id="btn-play-drama-start">
                    <i data-lucide="play" style="width: 18px; height: 18px; fill: currentColor;"></i>
                    <span>1. Bölümden Başla</span>
                  </button>
                  <button class="btn-secondary" id="btn-share-drama" title="Bağlantıyı Kopyala">
                    <i data-lucide="share-2" style="width: 16px; height: 16px;"></i>
                    <span>Paylaş</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Episode Explorer Section -->
          <div class="drama-episodes-explorer">
            <div class="drama-episodes-toolbar">
              <div class="drama-episodes-title-wrap">
                <h3>Bölümler (${Y})</h3>
                <span class="drama-episodes-sub">Bölüme tıklayarak reklamsız izleyin</span>
              </div>
              <div class="drama-episodes-filter-box">
                <i data-lucide="search" style="width: 15px; height: 15px; color: #94a3b8;"></i>
                <input 
                  type="text" 
                  id="drama-ep-filter-input" 
                  placeholder="Bölüm ara... (Örn: 25)" 
                  value="${s}"
                />
              </div>
            </div>

            <div class="drama-episodes-grid" id="drama-episodes-grid">
              ${ne.map(ie=>{const fe=sn(`ddz_${O}`,ie.season,ie.episode);return`
                  <button 
                    class="drama-ep-card ${fe?"is-watched":""}" 
                    data-season="${ie.season}" 
                    data-episode="${ie.episode}"
                  >
                    <div class="drama-ep-thumb-wrap">
                      ${ie.thumb?`
                        <img src="${ie.thumb}" alt="${ie.title}" loading="lazy" />
                      `:`
                        <div class="drama-ep-fallback-thumb">
                          <i data-lucide="play" style="width: 16px; height: 16px; color: #c084fc;"></i>
                        </div>
                      `}
                      <span class="drama-ep-num-pill">${ie.episode}</span>
                      ${fe?'<div class="drama-ep-watched-tag"><i data-lucide="check" style="width: 12px; height: 12px;"></i></div>':""}
                    </div>
                    <div class="drama-ep-title-wrap">
                      <span class="drama-ep-name">${ie.title}</span>
                      <span class="drama-ep-action-hint">İzle</span>
                    </div>
                  </button>
                `}).join("")}
            </div>
          </div>
        `,G(x),x.querySelector("#btn-close-drama-modal")?.addEventListener("click",K),x.querySelector("#btn-play-drama-start")?.addEventListener("click",()=>{V.length>0&&W(V[0].season,V[0].episode)}),x.querySelector("#btn-share-drama")?.addEventListener("click",()=>{const ie=`${window.location.origin}${window.location.pathname}#dramas?slug=${O}`;navigator.clipboard?.writeText(ie).then(()=>{ee("Dizi bağlantısı panoya kopyalandı!","success")}).catch(()=>{ee(`Bağlantı: ${ie}`,"info")})});const re=x.querySelector("#drama-ep-filter-input");re&&re.addEventListener("input",ie=>{s=ie.target.value.toLowerCase().trim(),z(),x.querySelector("#drama-ep-filter-input")?.focus()}),x.querySelectorAll(".drama-ep-card").forEach(ie=>{ie.addEventListener("click",()=>{const fe=parseInt(ie.getAttribute("data-season"),10)||1,ge=parseInt(ie.getAttribute("data-episode"),10)||1;W(fe,ge)})})}function K(){C.classList.add("hidden"),document.body.style.overflow="",o=null,s=""}C.addEventListener("click",O=>{O.target===C&&K()});function W(O=1,B=1){if(!o)return;const{slug:D,title:J,poster:V,episodes:U=[]}=o;Ri({type:"tv",tmdbId:`ddz_${D}`,title:`${J} - B${B}`,seriesTitle:J,season:O,episode:B,posterPath:V,backdropPath:V,maxEpisodes:U.length,seasonsList:[{season_number:O,episode_count:U.length}]})}g?.addEventListener("input",O=>{const B=O.target.value;v.classList.toggle("hidden",!B),clearTimeout(A),A=setTimeout(()=>{n=B.trim(),a=1,i=n?"search":"trending",b.forEach(D=>D.classList.toggle("active",!n&&D.getAttribute("data-tab-id")==="trending")),R(!1)},350)}),g?.addEventListener("keydown",O=>{O.key==="Enter"&&(O.preventDefault(),clearTimeout(A),n=g.value.trim(),a=1,R(!1))}),v?.addEventListener("click",()=>{g.value="",v.classList.add("hidden"),n="",i="trending",b.forEach(O=>O.classList.toggle("active",O.getAttribute("data-tab-id")==="trending")),R(!1)}),b.forEach(O=>{O.addEventListener("click",()=>{const B=O.getAttribute("data-tab-id");i===B&&!n||(i=B,n="",g&&(g.value=""),v?.classList.add("hidden"),a=1,b.forEach(D=>D.classList.toggle("active",D===O)),R(!1))})}),E?.addEventListener("click",()=>{a++,R(!0)}),await R(!1),e&&N(e)}}}const ga=[{id:"user-circle",icon:"user",label:"Klasik",color:"#f59e0b"},{id:"clapperboard",icon:"clapperboard",label:"Sinema",color:"#ec4899"},{id:"film",icon:"film",label:"Yıldız",color:"#8b5cf6"},{id:"sparkles",icon:"sparkles",label:"Sihirli",color:"#10b981"},{id:"tv",icon:"tv",label:"Dizi Kolik",color:"#3b82f6"},{id:"baby",icon:"baby",label:"Çocuk",color:"#38bdf8"},{id:"smile",icon:"smile",label:"Neşeli",color:"#eab308"},{id:"flame",icon:"flame",label:"Ateşli",color:"#ef4444"}];function Sf(){if(Vo()||document.getElementById("profile-onboarding-overlay"))return;const e=document.createElement("div");e.id="profile-onboarding-overlay",e.className="onboarding-overlay",e.innerHTML=`
    <div class="onboarding-modal-card animate-scale-in">
      <div class="onboarding-header">
        <div class="brand-logo-icon" style="width: 48px; height: 48px; border-radius: 12px; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--accent-primary, #6366f1), var(--accent-secondary, #ec4899));">
          <i data-lucide="clapperboard" style="width: 24px; height: 24px; color: #fff;"></i>
        </div>
        <h2 style="font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem;">CinePulse'a Hoş Geldiniz!</h2>
        <p style="font-size: 0.9rem; color: var(--text-muted, #94a3b8); max-width: 340px; margin: 0 auto;">
          Kişiselleştirilmiş dizi & film deneyiminiz için profilinizi belirleyin.
        </p>
      </div>

      <form id="onboarding-form" style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem;">
        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #cbd5e1; margin-bottom: 0.5rem; text-align: left;">
            Profil Adınız
          </label>
          <input 
            type="text" 
            id="onboarding-name-input" 
            class="onboarding-input"
            placeholder="Örn: Kendi Adınız..." 
            maxlength="24"
            required
            autocomplete="off"
            autofocus
          />
        </div>

        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #cbd5e1; margin-bottom: 0.65rem; text-align: left;">
            Avatarınızı Seçin
          </label>
          <div class="onboarding-avatars-grid">
            ${ga.map((o,s)=>`
              <button 
                type="button" 
                class="onboarding-avatar-btn ${s===0?"selected":""}" 
                data-avatar="${o.id}"
                data-color="${o.color}"
                style="--av-color: ${o.color};"
                title="${o.label}"
              >
                <i data-lucide="${o.icon}" style="width: 20px; height: 20px;"></i>
              </button>
            `).join("")}
          </div>
        </div>

        <div class="onboarding-kids-toggle">
          <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; user-select: none;">
            <div style="text-align: left;">
              <div style="font-size: 0.9rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 0.4rem;">
                <i data-lucide="baby" style="width: 16px; height: 16px; color: #38bdf8;"></i> Çocuk Profili
              </div>
              <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">
                Yalnızca çocuklara uygun güvenli animasyon ve çizgi filmleri gösterir.
              </div>
            </div>
            <input type="checkbox" id="onboarding-is-kid" class="custom-toggle-checkbox" style="width: 20px; height: 20px; accent-color: #38bdf8; cursor: pointer;" />
          </label>
        </div>

        <button type="submit" class="onboarding-submit-btn">
          <span>İzlemeye Başla</span>
          <i data-lucide="arrow-right" style="width: 18px; height: 18px;"></i>
        </button>
      </form>
    </div>
  `,document.body.appendChild(e),window.lucide&&G(e);let t=ga[0].id,i=ga[0].color;e.querySelectorAll(".onboarding-avatar-btn").forEach(o=>{o.addEventListener("click",()=>{e.querySelectorAll(".onboarding-avatar-btn").forEach(s=>s.classList.remove("selected")),o.classList.add("selected"),t=o.getAttribute("data-avatar"),i=o.getAttribute("data-color")})});const n=e.querySelector("#onboarding-form"),a=e.querySelector("#onboarding-name-input"),r=e.querySelector("#onboarding-is-kid");n.addEventListener("submit",o=>{o.preventDefault();const s=a.value.trim();s&&(Mc({name:s,avatar:t,color:i,isKid:r.checked}),e.classList.add("animate-fade-out"),setTimeout(()=>{e.remove(),window.location.reload()},280))})}const Vi=[{icon:"sparkles",eyebrow:"CinePulse rehberi",title:"İzlemeye hazır bir ana ekran",text:"Ana sayfadaki satırları yatay kaydırarak yapımları gez. Arama simgesinden dizi veya film adını yazdığında sonuçlar anında görünür.",hint:"Mobilde alt menüden Diziler, Filmler, Keşfet ve Listem’e geçebilirsin."},{icon:"clapperboard",eyebrow:"Fragman önizleme",title:"Karttan fragmana bak",text:"Telefonda bir içerik kartına kısa süre basılı tut; fragman ekranın alt kısmında açılır. Bilgisayarda kartın üzerine gelmen yeterli.",hint:"Önizlemeyi sağ üstteki çarpıdan kapatabilir, ses simgesinden sesi açabilirsin."},{icon:"list-plus",eyebrow:"Kişisel liste",title:"Listem senin kontrolünde",text:"İçerik detayındaki artı düğmesiyle yapımları Listem’e ekle. Listem sayfasından kaydettiğin yapımları açabilir veya kaldırabilirsin.",hint:"İzleme ilerlemen de aynı tarayıcıda otomatik hatırlanır."},{icon:"shield-check",eyebrow:"Spoilersız keşif",title:"Diziyi güvenle incele",text:"Dizi detayında “Spoilersız keşfet” seçeneğini açarsan, izleme ilerlemenin sonrasındaki bölüm başlıkları, görselleri ve özetleri gizlenir.",hint:"İzlediğin bölüme ve sıradaki bölüme kadar detay görürsün; ilerledikçe yeni bölümler açılır."},{icon:"users-round",eyebrow:"Birlikte Seç",title:"Arkadaşınla aynı odada izle",text:"Üstteki Birlikte Seç düğmesinden oda oluştur veya altı haneli kodla bir odaya katıl. Moderatör içerik ve kaynak seçer; odada emoji ve sohbet de kullanabilirsin.",hint:"Oynatıcıdaki “Odaya dön” düğmesindeki rozet yeni sohbet mesajlarını gösterir."},{icon:"monitor-play",eyebrow:"Oynatıcı",title:"Kontroller elinin altında",text:"İçeriği açınca ekrana bir kez dokunarak kontrolleri göster. Zaman çubuğundan sarabilir, kaynakları değiştirebilir, altyazı ve ses seçebilirsin.",hint:"Tam ekran, ses ve parlaklık ayarları her cihazda sana ait kalır."}];function xf(){if(!Vo()||Rc()||document.getElementById("cinepulse-product-tour"))return;let e=0;const t=document.body.style.overflow,i=document.createElement("section");i.id="cinepulse-product-tour",i.className="product-tour-overlay",i.setAttribute("role","dialog"),i.setAttribute("aria-modal","true"),i.setAttribute("aria-label","CinePulse kullanım rehberi");const n=()=>{$c(),document.body.style.overflow=t,i.classList.add("is-leaving"),window.setTimeout(()=>i.remove(),180)},a=()=>{const r=Vi[e];i.innerHTML=`
      <div class="product-tour-card">
        <button class="product-tour-skip" type="button" aria-label="Rehberi kapat">Geç <i data-lucide="x"></i></button>
        <div class="product-tour-icon"><i data-lucide="${r.icon}"></i></div>
        <p class="product-tour-eyebrow">${r.eyebrow}</p>
        <h2>${r.title}</h2>
        <p class="product-tour-text">${r.text}</p>
        <div class="product-tour-hint"><i data-lucide="lightbulb"></i><span>${r.hint}</span></div>
        <div class="product-tour-footer">
          <div class="product-tour-progress" aria-label="Adım ${e+1} / ${Vi.length}">
            ${Vi.map((o,s)=>`<span class="${s===e?"is-active":""}"></span>`).join("")}
          </div>
          <div class="product-tour-actions">
            ${e>0?'<button class="product-tour-back" type="button">Geri</button>':""}
            <button class="product-tour-next" type="button">${e===Vi.length-1?"Hazırım":"Devam"} <i data-lucide="arrow-right"></i></button>
          </div>
        </div>
      </div>
    `,G(i),i.querySelector(".product-tour-skip")?.addEventListener("click",n),i.querySelector(".product-tour-back")?.addEventListener("click",()=>{e=Math.max(0,e-1),a()}),i.querySelector(".product-tour-next")?.addEventListener("click",()=>{e>=Vi.length-1?n():(e+=1,a())})};document.body.appendChild(i),document.body.style.overflow="hidden",a()}const Mn=new Map,xc=new Set;let Ko=0;function Ef(e){if(!e)return Promise.resolve(!1);if(Mn.has(e))return Mn.get(e);const t=new Promise(i=>{const n=new Image;n.decoding="async",n.onload=async()=>{try{await n.decode()}catch{}xc.add(e),i(!0)},n.onerror=()=>{Mn.delete(e),i(!1)},n.src=e});return Mn.set(e,t),t}function Ec(e,t){return t==="landscape"?e.dataset.backdropSrc:e.dataset.posterSrc}function Tf(){const e=window.innerHeight+900;return[...document.querySelectorAll(".card-poster-img")].filter(t=>{const i=t.getBoundingClientRect();return i.bottom>-300&&i.top<e})}function Pn(e){return Promise.all(Tf().map(t=>Ef(Ec(t,e))))}function Af(e){document.querySelectorAll(".card-poster-img").forEach(t=>{const i=Ec(t,e);!i||t.src===i||(xc.has(i)?t.classList.remove("card-image-pending"):(t.classList.add("card-image-pending"),t.addEventListener("load",()=>t.classList.remove("card-image-pending"),{once:!0})),t.src=i,t.dataset.activeLayout=e)})}function Cf(){const e=ft().cardLayout==="landscape"?"landscape":"portrait";return`
    <div class="card-layout-switcher" id="card-layout-switcher" role="group" aria-label="Kart görünümü">
      <span class="card-layout-switcher-label">Kart Görünümü</span>
      <div class="card-layout-switcher-options">
        <button class="card-layout-option ${e==="portrait"?"active":""}" data-layout="portrait" aria-pressed="${e==="portrait"}">
          <i data-lucide="rectangle-vertical"></i><span>Dikey</span>
        </button>
        <button class="card-layout-option ${e==="landscape"?"active":""}" data-layout="landscape" aria-pressed="${e==="landscape"}">
          <i data-lucide="rectangle-horizontal"></i><span>Yatay</span>
        </button>
      </div>
    </div>
  `}function Lf(e=document){const t=e.querySelector("#card-layout-switcher");if(!t)return;const i=[...t.querySelectorAll(".card-layout-option")],a=(ft().cardLayout==="landscape"?"landscape":"portrait")==="landscape"?"portrait":"landscape",r=()=>{t.isConnected&&Pn(a)};window.innerWidth>768&&("requestIdleCallback"in window?window.requestIdleCallback(r,{timeout:1400}):window.setTimeout(r,450)),i.forEach(o=>{const s=o.dataset.layout==="landscape"?"landscape":"portrait";o.addEventListener("pointerenter",()=>{t.isConnected&&Pn(s)},{passive:!0}),o.addEventListener("focus",()=>{t.isConnected&&Pn(s)},{passive:!0}),o.addEventListener("click",async()=>{const l=o.dataset.layout==="landscape"?"landscape":"portrait",u=document.documentElement.classList.contains("cards-landscape")?"landscape":"portrait";if(l===u||t.classList.contains("is-switching"))return;const p=++Ko;t.classList.add("is-switching"),i.forEach(v=>{v.disabled=!0});const h=window.innerWidth<=768;if(h||await Promise.race([Pn(l),new Promise(v=>window.setTimeout(v,1200))]),p!==Ko||!t.isConnected)return;const g=()=>{Af(l),document.documentElement.classList.toggle("cards-landscape",l==="landscape"),i.forEach(v=>{const b=v.dataset.layout===l;v.classList.toggle("active",b),v.setAttribute("aria-pressed",String(b))})};if(h)g();else if(typeof document.startViewTransition=="function"){const v=document.startViewTransition(g);try{await v.finished}catch{}}else document.documentElement.classList.add("card-layout-changing"),g(),await new Promise(v=>window.setTimeout(v,280)),document.documentElement.classList.remove("card-layout-changing");il({cardLayout:l}),t.classList.remove("is-switching"),i.forEach(v=>{v.disabled=!1}),l==="landscape"&&dn(document)})})}"scrollRestoration"in history&&(history.scrollRestoration="manual");"serviceWorker"in navigator&&window.location.protocol.startsWith("http")&&window.addEventListener("load",()=>{const e="20260920-mobile-preview-2",t=`cinepulse-sw-reloaded-${e}`;navigator.serviceWorker.addEventListener("controllerchange",()=>{sessionStorage.getItem(t)||(sessionStorage.setItem(t,"1"),window.location.reload())}),navigator.serviceWorker.register(`/sw.js?build=${e}`,{updateViaCache:"none"}).then(i=>i.update()).catch(()=>{})});Bd();window.addEventListener("keydown",e=>{e.ctrlKey&&e.altKey&&e.shiftKey&&e.key==="F10"&&(e.preventDefault(),e.stopImmediatePropagation(),hf(),window.location.hash="#admin")},!0);const ei=document.getElementById("app");document.documentElement.classList.toggle("cards-landscape",ft().cardLayout==="landscape");window.addEventListener("scroll",()=>{ih()},{passive:!0});window.addEventListener("pagehide",Lr);let ya=0;async function Di(){const e=++ya;lh(),Lr();const t=window.location.hash||"#home";let i="home",n={};if(t.startsWith("#detail")){if(i="detail",t.includes("?")){const l=t.split("?")[1]||"",u=new URLSearchParams(l);n.type=u.get("type")||"tv",n.id=u.get("id")}else if(t.includes("/")){const l=t.split("/");l.length>=3?(n.type=l[1]||"tv",n.id=l[2]):l.length===2&&(n.type="tv",n.id=l[1])}}else if(t==="#series")i="series";else if(t==="#cartoons")i="cartoons";else if(t==="#movies")i="movies";else if(t==="#anime")i="anime";else if(t==="#documentary")i="documentary";else if(t==="#livetv")i="livetv";else if(t==="#discover")i="discover";else if(t==="#library")i="library";else if(t.startsWith("#dramas")){if(i="dramas",t.includes("?")){const l=t.split("?")[1]||"",u=new URLSearchParams(l);n.slug=u.get("slug"),n.q=u.get("q")}}else if(t==="#admin"){if(!ff()){window.location.replace("#home");return}i="admin"}if(window.__popularListCleanup?.(),window.__popularListCleanup=null,window.__discoverCleanup?.(),window.__discoverCleanup=null,window.__LiveTvController&&typeof window.__LiveTvController.cleanup=="function"&&window.__LiveTvController.cleanup(),document.querySelectorAll("video, audio").forEach(l=>{try{l.pause(),l.removeAttribute("src"),l.load()}catch{}}),i==="admin"){const l=await vf();if(e!==ya)return;ei.innerHTML=`
      <div class="admin-standalone-wrapper" style="min-height: 100vh; background: #07090e; display: flex; flex-direction: column; width: 100%;">
        ${l?l.html:""}
      </div>
    `,l&&typeof l.init=="function"&&l.init(ei),G();return}const a=Zp(i),o=new Set(["home","series","cartoons","movies","anime","documentary","discover","library"]).has(i)?Cf():"";(i==="home"||i==="detail")&&(ei.innerHTML=`${a}<main class="route-loading" aria-live="polite"><div class="spin-loader"></div><span>İçerikler yükleniyor...</span></main>`,To(),G(ei));let s=null;i==="home"?s=await uh():i==="detail"?s=await Ih(n.type,n.id):i==="series"?s=await Wi("tv"):i==="cartoons"?s=await Wi("cartoon"):i==="movies"?s=await Wi("movie"):i==="anime"?s=await Wi("anime"):i==="documentary"?s=await Wi("documentary"):i==="livetv"?s=lf():i==="discover"?s=await $h("tv"):i==="library"?s=Rh():i==="dramas"&&(s=await _f(n.slug,n.q)),e===ya&&(ei.innerHTML=`
    ${a}
    ${o}
    <main style="min-height: 85vh;">
      ${s?s.html:"<h2>Sayfa Bulunamadı</h2>"}
    </main>
    
    <footer style="padding: 3rem 0; background: var(--bg-surface); border-top: 1px solid var(--border-color); margin-top: 5rem;">
      <div class="container" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
          <div class="brand-logo-icon" style="width: 28px; height: 28px; border-radius: 8px;">
            <i data-lucide="clapperboard" style="width:15px; height:15px; color:#fff;"></i>
          </div>
          <span>Cine<span class="brand-highlight">Pulse</span></span>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-muted);">
          Sunucusuz & Üyeliksiz Dizi & Film İzleme Platformu • Yerel Önbellek & JSON Aktarım Destekli
        </div>
      </div>
    </footer>
  `,To(),Lf(ei),s&&s.init&&s.init(ei),window.lucide&&G(),nh(t))}window.addEventListener("hashchange",Di);Di();setTimeout(async()=>{try{const e=String(new URL(window.location.href).searchParams.get("oda")||"").replace(/\D/g,"");if(!/^\d{6}$/.test(e))return;or({roomCode:e})}catch{}},700);setTimeout(()=>{Sf()},400);setTimeout(()=>{xf()},1200);const Tc={getWatchHistory:Be,saveWatchProgress:Wa,saveBatchWatchProgress:Xo};window.addEventListener("cinepulse_trakt_auth_changed",e=>{e.detail?.connected&&ul(Tc)});ul(Tc);Ud();const Ac=e=>{e&&e.detail&&(e.detail.action==="import"||e.detail.cleared)&&Di()};window.addEventListener("sineflix_data_changed",Ac);window.addEventListener("cinepulse_data_changed",Ac);window.addEventListener("sineflix_profile_changed",async()=>{nn(),await Di()});window.addEventListener("cinepulse_admin_state_changed",Di);window.addEventListener("storage",e=>{if(e.key!=="sineflix_user_settings_v1")return;const t=ft();document.documentElement.classList.toggle("cards-landscape",t.cardLayout==="landscape"),nn(),Di()});document.addEventListener("contextmenu",e=>(e.preventDefault(),!1),{capture:!0}),window.addEventListener("keydown",e=>{const t=(e.key||"").toLowerCase();if(e.key==="F12"||e.keyCode===123)return e.preventDefault(),!1;if(e.ctrlKey||e.metaKey){const i=t;if(e.shiftKey&&(i==="i"||i==="j"||i==="c")||i==="u"||i==="s")return e.preventDefault(),!1}},!0),document.addEventListener("dragstart",e=>e.preventDefault());export{Ff as a,Fe as b,lt as c,sn as d,Hf as e,qf as f,Gt as g,zf as h,za as i,ii as j,Of as k,Bh as l,Zo as m,Ga as n,If as o,Wa as p,Mf as q,_e as r,ee as s,Qo as t,$f as u,Rf as v};
