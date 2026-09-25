const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./PlayerModal-B6Djv0t2.js","./hls-BuERnqCp.js"])))=>i.map(i=>d[i]);
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function i(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(r){if(r.ep)return;r.ep=!0;const a=i(r);fetch(r.href,a)}})();function V(e=document){const t=window.lucide;if(!t?.icons||!t?.createElement||!e)return;const i="[data-lucide]:not(svg)",n=e.matches?.(i)?[e,...e.querySelectorAll(i)]:e.querySelectorAll(i);for(const r of n){const a=r.getAttribute("data-lucide"),o=a.replace(/(^|-)(\w)/g,(d,p,h)=>h.toUpperCase()),s=t.icons[o];if(!s)continue;const l=t.createElement(s);for(const{name:d,value:p}of r.attributes)d!=="class"&&l.setAttribute(d,p);l.classList.add("lucide",`lucide-${a}`);for(const d of r.classList)d!=="lucide"&&!d.startsWith("lucide-")&&l.classList.add(d);r.replaceWith(l)}}const ue={WATCH_HISTORY:"sineflix_watch_history_v1",FAVORITES:"sineflix_favorites_v1",WATCHLIST:"sineflix_watchlist_v1",USER_SETTINGS:"sineflix_user_settings_v1",ANIME_IDS:"sineflix_anime_ids_v1"};let kt=null;function _l(){if(kt)return kt;try{if(typeof window>"u"||!window.localStorage)return kt=new Set,kt;const e=localStorage.getItem(ue.ANIME_IDS);if(!e)return kt=new Set,kt;const t=JSON.parse(e);return kt=new Set(Array.isArray(t)?t.map(String):[]),kt}catch{return kt=new Set,kt}}function Se(e){if(e)try{const t=_l(),i=String(e);t.has(i)||(t.add(i),typeof window<"u"&&window.localStorage&&localStorage.setItem(ue.ANIME_IDS,JSON.stringify(Array.from(t))))}catch{}}function Fe(e){return e?_l().has(String(e)):!1}let nt=null,Qe=null,ot=null,nn=null,oi=null,rn=null,an=null,Wt=null,zi=null,Ti=null,lr=null,ut=null,ui=null,Yt=null,Et=null;function Ot(){nn=null,oi=null,rn=null,an=null}function $r(){nt=null,Qe=null,ot=null,Ot(),Wt=null,zi=null,Ti=null,lr=null,kt=null,ut=null,ui=null,Yt=null,Et=null}function Jt(){if(ut)return ut;const e=[{id:"prof_1",name:"Profilim",avatar:"user-circle",isKid:!1,color:"#f59e0b"},{id:"prof_kids",name:"Çocuk Modu 🎈",avatar:"baby",isKid:!0,color:"#38bdf8"}];try{if(typeof window>"u"||!window.localStorage)return ut=e,ut;const t=localStorage.getItem("sineflix_profiles_list_v1");if(!t)return ut=e,ut;let i=JSON.parse(t);return i.some(r=>r.id==="prof_cinema")&&(i=i.filter(r=>r.id!=="prof_cinema"),localStorage.setItem("sineflix_profiles_list_v1",JSON.stringify(i))),ut=i,ut}catch{return ut=e,ut}}function hs(e){try{if(ut=e,ui=null,typeof window>"u"||!window.localStorage)return;localStorage.setItem("sineflix_profiles_list_v1",JSON.stringify(e)),window.dispatchEvent(new CustomEvent("sineflix_profiles_updated"))}catch{}}function Sl(){try{return typeof window>"u"||!window.localStorage?!0:localStorage.getItem("cinepulse_onboarding_completed")==="true"}catch{return!0}}function cd(){try{return typeof window>"u"||!window.localStorage?!0:localStorage.getItem("cinepulse_product_tour_completed")==="true"}catch{return!0}}function dd(){try{if(typeof window>"u"||!window.localStorage)return;localStorage.setItem("cinepulse_product_tour_completed","true")}catch{}}function ud({name:e,avatar:t="user-circle",color:i="#f59e0b",isKid:n=!1}){try{if(typeof window>"u"||!window.localStorage)return;const r=(e||"").trim()||(n?"Çocuk":"Profilim");let a=Jt();const o=a.findIndex(l=>l.id==="prof_1"),s={id:"prof_1",name:r,avatar:t,color:i,isKid:!!n};return o!==-1?a[o]=s:a.unshift(s),hs(a),cr("prof_1"),localStorage.setItem("cinepulse_onboarding_completed","true"),window.dispatchEvent(new CustomEvent("sineflix_profile_changed",{detail:{profileId:"prof_1"}})),s}catch{return null}}const ra="1403";function pd(){try{return typeof window>"u"||!window.localStorage?ra:localStorage.getItem("cinepulse_admin_pin")||ra}catch{return ra}}function hd(e){try{return typeof window>"u"||!window.localStorage||!e||String(e).length<4?!1:(localStorage.setItem("cinepulse_admin_pin",String(e)),!0)}catch{return!1}}function fd(e){return String(e).trim()===pd().trim()}function Mr(){if(Et)return Et;const e=["clitoris","le clitoris","erotik","porn"];try{if(typeof window>"u"||!window.localStorage)return Et=e,e;const t=localStorage.getItem("cinepulse_blocked_content");return t?(Et=JSON.parse(t),Et):(Et=e,e)}catch{return Et=e,e}}function md(e){if(!e)return;const t=Mr(),i=String(e).trim().toLowerCase();if(!t.includes(i)){t.push(i),Et=t;try{localStorage.setItem("cinepulse_blocked_content",JSON.stringify(t))}catch{}}}function gd(e){if(!e)return;let t=Mr();const i=String(e).trim().toLowerCase();t=t.filter(n=>String(n).toLowerCase()!==i),Et=t;try{localStorage.setItem("cinepulse_blocked_content",JSON.stringify(t))}catch{}}function yd(e){if(!e)return!1;const t=Mr(),i=String(e.id||""),n=`${e.title||""} ${e.name||""} ${e.original_title||""} ${e.original_name||""}`.toLowerCase();return t.some(r=>{const a=String(r).toLowerCase().trim();return a?i===a?!0:n.includes(a):!1})}function xn(){if(ui)return ui;try{const e=Jt(),t=typeof window<"u"&&window.localStorage&&localStorage.getItem("sineflix_active_profile_id")||"prof_1";return ui=e.find(i=>i.id===t)||e[0],ui}catch{return{id:"prof_1",name:"Profilim",avatar:"user-circle",isKid:!1,color:"#f59e0b"}}}function cr(e){try{if(typeof window>"u"||!window.localStorage)return;localStorage.setItem("sineflix_active_profile_id",e),ui=null,$r(),window.dispatchEvent(new CustomEvent("sineflix_profile_changed",{detail:{profileId:e}}))}catch{}}function Lt(){return xn()?.isKid===!0}function Zt(e){if(!e||e.adult===!0||yd(e))return!1;const t=[27,80,10752,10768,53,18],i=e.genre_ids||(Array.isArray(e.genres)?e.genres.map(s=>typeof s=="object"?s.id:s):[]);if(i.some(s=>t.includes(Number(s))))return!1;const n=`${e.title||""} ${e.name||""} ${e.overview||""}`.toLowerCase();if(["cinayet","katil","vahşet","kanlı","erotik","dehşet","intikam","mafya","uyuşturucu","şiddet","tecavüz","seri katil","katliam","korku","kan donduran","murder","killer","horror","bloody","psychopath","terror","revenge","savaş","war","battle","death","ölüm"].some(s=>n.includes(s)))return!1;const a=[16,10751,10762];return i.some(s=>a.includes(Number(s)))}function Gs(e=[]){return Array.isArray(e)?Lt()?e.filter(Zt):e:[]}function vd({name:e,isKid:t=!1,avatar:i="user-circle",color:n="#f59e0b"}){const r=Jt(),a={id:`prof_${Date.now()}`,name:e.trim()||"Yeni Profil",avatar:i,isKid:!!t,color:n};return r.push(a),hs(r),a}function bd(e){if(e==="prof_1")return!1;let t=Jt();return t=t.filter(i=>i.id!==e),hs(t),xn()?.id===e&&cr("prof_1"),!0}function Mt(e){if(e===ue.WATCH_HISTORY||e===ue.FAVORITES||e===ue.WATCHLIST){const t=xn();if(t&&t.id&&t.id!=="prof_1")return`${e}_${t.id}`}return e}function ft(e,t=[]){try{if(typeof window>"u"||!window.localStorage)return t;const i=Mt(e),n=localStorage.getItem(i);return n?JSON.parse(n):t}catch{return t}}const wd="cinepulse_storage_v1",Oi="keyval_store";let $n=null;function xl(){return $n||(typeof window>"u"||!window.indexedDB?Promise.resolve(null):($n=new Promise(e=>{try{const t=window.indexedDB.open(wd,1);t.onupgradeneeded=()=>{const i=t.result;i.objectStoreNames.contains(Oi)||i.createObjectStore(Oi)},t.onsuccess=()=>e(t.result),t.onerror=()=>e(null)}catch{e(null)}}),$n))}async function kd(e){try{const t=await xl();return t?new Promise(i=>{try{const a=t.transaction(Oi,"readonly").objectStore(Oi).get(e);a.onsuccess=()=>i(a.result!==void 0?a.result:null),a.onerror=()=>i(null)}catch{i(null)}}):null}catch{return null}}async function ln(e,t){try{const i=await xl();return i?new Promise(n=>{try{const r=i.transaction(Oi,"readwrite");r.objectStore(Oi).put(t,e),r.oncomplete=()=>n(!0),r.onerror=()=>n(!1)}catch{n(!1)}}):!1}catch{return!1}}async function _d(){if(!(typeof window>"u"||!window.indexedDB))try{const e=Mt(ue.WATCH_HISTORY),t=await kd(e);if(Array.isArray(t)&&t.length>0){const i=nt&&nt.length||0;t.length>=i&&(nt=t.sort((n,r)=>(r.lastWatchedAt||0)-(n.lastWatchedAt||0)),Qe=null,ot=null,Ot(),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{key:e,value:nt}})))}}catch{}}typeof window<"u"&&setTimeout(_d,80);const $t=new Map;function Js(){if(!(typeof window>"u")){for(const[e,t]of $t.entries())try{t.timer&&clearTimeout(t.timer),ln(e,t.value),window.localStorage&&localStorage.setItem(e,JSON.stringify(t.value))}catch{}$t.clear()}}typeof window<"u"&&(window.addEventListener("beforeunload",Js),window.addEventListener("pagehide",Js));function Me(e,t,i={}){try{if(typeof window>"u")return;const n=Mt(e);if(ln(n,t),window.localStorage)if(i.isProgressUpdate){$t.has(n)&&clearTimeout($t.get(n).timer);const r=setTimeout(()=>{try{localStorage.setItem(n,JSON.stringify(t))}catch{}$t.delete(n)},2500);$t.set(n,{timer:r,value:t})}else{$t.has(n)&&(clearTimeout($t.get(n).timer),$t.delete(n));try{localStorage.setItem(n,JSON.stringify(t))}catch{}}window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{key:n,value:t,...i}}))}catch{}}const El=["anime","kimetsu","yaiba","iblis keser","demon slayer","naruto","boruto","shingeki","titan","titana saldırı","jujutsu","kaisen","one piece","death note","bleach","dragon ball","hunter x hunter","chainsaw man","tokyo ghoul","my hero academia","boku no hero","kahramanlık akademim","fullmetal","alchemist","simyacı","sword art online","solo leveling","black clover","vinland saga","spy x family","cyberpunk: edgerunners","haikyuu","one punch","berserk","mob psycho","overlord","evangelion","cowboy bebop","code geass","frieren","dr. stone","blue lock","steins;gate","jojo","kaiju no. 8","gintama","fairy tail","violet evergarden","hell's paradise","jigokuraku","dandadan","wind breaker","mushoku tensei","re:zero","delicious in dungeon","dungeon meshi","mashle","baki","hajime no ippo","slamdunk","slam dunk","kuroko","initial d","great teacher onizuka","monster","dororo","fire force","soul eater","noragami","erased","parasyte","psycho-pass","fate/zero","fate/stay","made in abyss","your lie in april","shigatsu wa kimi","anohana","toradora","clannad","classroom of the elite","elite sınıfı","no game no life","konosuba","slime datta ken","shield hero","kalkan kahramanı","goblin slayer","akame ga kill","kill la kill","gurren lagann","darling in the franxx","promised neverland","seven deadly sins","nanatsu no taizai","yedi ölümcül günah","tokyo revengers","blue exorcist","ao no exorcist","d.gray-man","inuyasha","yu yu hakusho","sailor moon","pokemon","digimon","yu-gi-oh","beyblade","captain tsubasa","tsubasa","record of ragnarok","shuumatsu no valkyrie","golden kamuy","dorohedoro","pluto","trigun","hellsing","elfen lied","rurouni kenshin","samurai champloo","fruits basket","horimiya","my dress-up darling","komi can't communicate","rent-a-girlfriend","kaguya-sama","lycoris recoil","zom 100","undead unluck","dead mount death play","seraph of the end","owari no seraph","bungo stray dogs","bungou stray dogs","assassination classroom","suikast sınıfı","black butler","kuroshitsuji","spirited away","ruhların kaçışı","howl's moving castle","yürüyen şato","my neighbor totoro","komşum totoro","princess mononoke","prenses mononoke","your name","kimi no na wa","senin adın","weathering with you","suzume","a silent voice","sessizliğin sesi","koe no katachi","akira","shangri-la frontier","oshi no ko","the eminence in shadow","bocchi the rock"];function Sd(e){return e?/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(e):!1}function dt(e){if(!e)return!1;if(e.isAnime===!0||e.type==="anime"||e.media_type==="anime"||e.id&&Fe(e.id))return!0;const i=(e.genre_ids||(Array.isArray(e.genres)?e.genres.map(a=>typeof a=="object"?a.id:a):[])).some(a=>Number(a)===16),n=e.original_language==="ja"||Array.isArray(e.origin_country)&&e.origin_country.includes("JP");if(i&&n||i&&(e.origin_country?.includes("JP")||e.original_language==="ja")||e.original_language==="ja"&&(i||Sd(e.original_name||e.original_title||e.title||e.name))||Array.isArray(e.genres)&&e.genres.map(o=>typeof o=="object"?o.name:String(o)).filter(Boolean).some(o=>/anime/i.test(o)))return e.id&&Se(e.id),!0;if(typeof e.id=="string"&&(e.id.startsWith("ta_")||e.id.startsWith("acx_")||e.id.startsWith("tra_")))return Se(e.id),!0;const r=(e.title||e.name||e.original_title||e.original_name||"").toLowerCase();for(const a of El)if(r.includes(a))return e.id&&Se(e.id),!0;return!1}function fs(e){return e?e.isSeries===!0||e.type==="tv"||e.media_type==="tv"?!1:e.type==="movie"||e.media_type==="movie"?!0:e.first_air_date||e.number_of_seasons||e.episodesCount||Array.isArray(e.seasons)&&e.seasons.length>0||e.season>1||e.episode>1?!1:!!(e.release_date&&!e.first_air_date):!0}function Be(){return nt||(nt=ft(ue.WATCH_HISTORY,[]).sort((t,i)=>(i.lastWatchedAt||0)-(t.lastWatchedAt||0)),nt)}async function xd(){const e=Be();let t=!1;const i="4e44d9029b1270a757cddc766a1bcb63";let n=0;for(let r=0;r<e.length;r++){const a=e[r];if(a.isAnime||a.type==="anime"){a.id&&Se(a.id);continue}if(!(a.isAnime===!1&&a.type!=="anime")){if(Fe(a.id)||dt(a)){a.isAnime=!0,a.type="anime",Se(a.id),t=!0;continue}if(n<5&&a.id&&!isNaN(Number(a.id))){n++;try{const o=await fetch(`https://api.themoviedb.org/3/tv/${a.id}?api_key=${i}&language=tr-TR`);if(o.ok){const s=await o.json(),l=s.original_language==="ja"||Array.isArray(s.origin_country)&&s.origin_country.includes("JP"),d=Array.isArray(s.genres)&&s.genres.some(p=>p.id===16||/anim/i.test(p.name));l&&d&&(a.isAnime=!0,a.type="anime",a.isSeries=!0,a.original_language="ja",Se(a.id),t=!0)}}catch{}}}}t&&(Ot(),Me(ue.WATCH_HISTORY,e))}function Pr(){if(Qe)return Qe;const e=Be();Qe=new Map,ot=new Map;for(let t=0;t<e.length;t++){const i=e[t],n=`${i.id}_${i.season||1}_${i.episode||1}`;Qe.has(n)||Qe.set(n,i);const r=String(i.id);ot.has(r)||ot.set(r,i)}return Qe}function dr(e){if(!e||typeof e!="string")return"";let t=e.replace(/^(undefined|null|\/undefined|\/null)$/i,"");if(!t||t.startsWith("data:")||t.startsWith("http"))return t;try{for(;t.includes("%");){const i=decodeURIComponent(t);if(i===t)break;t=i}}catch{}return t=t.replace(/^\/+/,"/"),t.startsWith("/")||(t=`/${t}`),t==="/"||t==="/null"||t==="/undefined"?"":t}function En(e,t,i,n=[]){const r=n.find(d=>d.id==e&&(d.posterPath||d.poster_path));let a=t||(r?r.posterPath||r.poster_path:""),o=i||(r?r.backdropPath||r.backdrop_path:"");const s=dr(a),l=dr(o);return{resolvedPoster:s||"",resolvedBackdrop:l||""}}function ms({id:e,title:t,posterPath:i,poster_path:n,backdropPath:r,backdrop_path:a,type:o,isAnime:s=!1,isSeries:l=!1,season:d=1,episode:p=1,currentTime:h=0,duration:f=0,completed:b=!1,genres:v=[],genre_ids:y=[],original_language:k="",origin_country:m=[],...w}){if(!e)return;const E=Be(),C=E.findIndex(W=>W.id==e&&W.season==d&&W.episode==p),S=E.find(W=>W.id==e),T=!!(s||o==="anime"||Fe(e)||C>=0&&(E[C].isAnime||E[C].type==="anime")||S&&(S.isAnime||S.type==="anime")||dt({id:e,title:t,type:o,genres:v,genre_ids:y,original_language:k,origin_country:m,...w}));T&&Se(e);const I=!!(l||o==="tv"||w.first_air_date||w.number_of_seasons||w.episodesCount||Array.isArray(w.seasons)&&w.seasons.length>0||d>1||p>1||C>=0&&(E[C].isSeries||E[C].type==="tv"||E[C].season>1||E[C].episode>1)||S&&(S.isSeries||S.type==="tv"||S.season>1||S.episode>1));let L=T?"anime":I?"tv":"movie";const{resolvedPoster:D,resolvedBackdrop:O}=En(e,i||n,r||a,E),Y=f>0?f:L==="movie"?6600:3e3,j=Y>0?Math.min(100,Math.round(h/Y*100)):0,z=b||j>=90,B={...w,id:e,title:t||(C>=0?E[C].title:S?S.title:"İçerik"),posterPath:D,poster_path:D,backdropPath:O,backdrop_path:O,type:L,isAnime:T,isSeries:I,genres:v&&v.length>0?v:C>=0?E[C].genres:S?S.genres:[],genre_ids:y&&y.length>0?y:C>=0?E[C].genre_ids:S?S.genre_ids:[],original_language:k||(C>=0?E[C].original_language:S?S.original_language:""),origin_country:m&&m.length>0?m:C>=0?E[C].origin_country:S?S.origin_country:[],season:Number(d),episode:Number(p),currentTime:Math.round(h),duration:Math.round(Y),progressPercent:j,completed:z,lastWatchedAt:w.lastWatchedAt?Number(w.lastWatchedAt):Date.now()};C>=0?E[C]=B:E.unshift(B),E.sort((W,ie)=>(ie.lastWatchedAt||0)-(W.lastWatchedAt||0)),nt=E,Qe&&Qe.set(`${e}_${d}_${p}`,B),ot&&ot.set(String(e),B),Ot(),Me(ue.WATCH_HISTORY,E,{isProgressUpdate:!0})}function Tl(e=[]){if(!Array.isArray(e)||e.length===0)return;const t=Be(),i=new Map;for(let o=0;o<t.length;o++){const s=t[o],l=`${s.id}_${s.season||1}_${s.episode||1}`;i.set(l,s)}for(const o of e){if(!o||!o.id)continue;const s=Number(o.season||1),l=Number(o.episode||1),d=`${o.id}_${s}_${l}`,p=i.get(d);if(p&&p.lastWatchedAt&&o.lastWatchedAt&&p.lastWatchedAt>o.lastWatchedAt&&p.completed&&o.completed)continue;const h=!!(o.isAnime||o.type==="anime"||Fe(o.id)||p&&(p.isAnime||p.type==="anime")||dt(o));h&&Se(o.id);const f=!!(o.isSeries||o.type==="tv"||o.first_air_date||s>1||l>1||p&&(p.isSeries||p.type==="tv")),b=h?"anime":f?"tv":"movie",{resolvedPoster:v,resolvedBackdrop:y}=En(o.id,o.posterPath||o.poster_path,o.backdropPath||o.backdrop_path,t),k=o.duration>0?o.duration:b==="movie"?6600:3e3,m=o.currentTime!==void 0?o.currentTime:o.completed?k:0,w=o.progressPercent!==void 0?o.progressPercent:k>0?Math.min(100,Math.round(m/k*100)):0,E=o.completed===!1?!1:o.completed||w>=90,C={...p||{},...o,id:o.id,title:o.title||p?.title||"İçerik",posterPath:v,poster_path:v,backdropPath:y,backdrop_path:y,type:b,isAnime:h,isSeries:f,season:s,episode:l,currentTime:Math.round(m),duration:Math.round(k),progressPercent:w,completed:E,lastWatchedAt:o.lastWatchedAt?Number(o.lastWatchedAt):p?.lastWatchedAt||Date.now()};i.set(d,C)}const n=Array.from(i.values()).sort((o,s)=>(s.lastWatchedAt||0)-(o.lastWatchedAt||0));nt=n,Qe=null,ot=null,Ot();const r=n.filter(o=>!o.completed).length,a=n.filter(o=>o.completed).length;r>0,Me(ue.WATCH_HISTORY,n)}function Ed(e,t=1,i=1){let n=Be();n=n.filter(r=>!(r.id==e&&r.season==t&&r.episode==i)),nt=n,Qe&&Qe.delete(`${e}_${t}_${i}`),Ot(),Me(ue.WATCH_HISTORY,n)}function Oa(e){let t=Be();t=t.filter(i=>i.id!=e),nt=t,Qe=null,Ot(),Me(ue.WATCH_HISTORY,t)}function Xs(){let e=Be();e=e.filter(t=>!t.completed&&t.progressPercent<90),Me(ue.WATCH_HISTORY,e)}function Td(){let e=Be();const t=e.length;return e=e.filter(i=>!(i.currentTime===1e3&&i.duration===1e3)),nt=e,Qe=null,Ot(),Me(ue.WATCH_HISTORY,e),t-e.length}function Xt(e,t=1,i=1){return Pr().get(`${e}_${t}_${i}`)||null}function yn(e,t=1,i=1){const n=Xt(e,t,i);return!!(n&&(n.completed||n.progressPercent>=90))}function Al(e,t=1,i=1,n=!0,r={}){const a=Be(),o=a.findIndex(v=>v.id==e&&v.season==t&&v.episode==i),s=a.find(v=>v.id==e),l=!!(r.isAnime||r.type==="anime"||Fe(e)||o>=0&&(a[o].isAnime||a[o].type==="anime")||s&&(s.isAnime||s.type==="anime")||dt({id:e,title:r.title,...r}));l&&Se(e);const d=r.type==="movie"&&!l,p=r.duration||(d?6600:3e3),{resolvedPoster:h,resolvedBackdrop:f}=En(e,r.posterPath||r.poster_path,r.backdropPath||r.backdrop_path,a),b={id:e,title:r.title||(o>=0?a[o].title:"İçerik"),posterPath:h,poster_path:h,backdropPath:f,backdrop_path:f,type:l?"anime":d?"movie":"tv",isAnime:l,isSeries:!d,season:Number(t),episode:Number(i),currentTime:n?p:0,duration:p,progressPercent:n?100:0,completed:!!n,lastWatchedAt:Date.now()};o>=0?a[o]=b:a.push(b),Me(ue.WATCH_HISTORY,a)}function Cm(e,t=!0,i={}){Al(e,1,1,t,{...i,type:i.type||"movie"})}function Cl(e,t=1,i=1,n={}){const r=yn(e,t,i);return Al(e,t,i,!r,n),{completed:!r}}function Ad(e,t=[],i=!0,n={}){const r=Be(),a=n.title||"Dizi",o=!!(n.isAnime||n.type==="anime"||Fe(e)||dt({id:e,title:a}));o&&Se(e);const s=o?"anime":"tv",l=n.duration||3e3,{resolvedPoster:d,resolvedBackdrop:p}=En(e,n.posterPath||n.poster_path,n.backdropPath||n.backdrop_path,r);for(const h of t){const f=h.season_number;if(f===0&&t.length>1)continue;const b=h.episode_count||10;for(let v=1;v<=b;v++){const y=r.findIndex(m=>m.id==e&&m.season==f&&m.episode==v),k={id:e,title:a,posterPath:d,poster_path:d,backdropPath:p,backdrop_path:p,type:s,isAnime:o,isSeries:!0,season:Number(f),episode:v,currentTime:i?l:0,duration:l,progressPercent:i?100:0,completed:!!i,lastWatchedAt:Date.now()};y>=0?r[y]=k:r.push(k)}}Me(ue.WATCH_HISTORY,r)}function Cd(e,t,i=10,n=!0,r={}){const a=Be(),o=r.title||"Dizi",s=!!(r.isAnime||r.type==="anime"||Fe(e)||dt({id:e,title:o}));s&&Se(e);const l=s?"anime":"tv",d=r.duration||3e3,{resolvedPoster:p,resolvedBackdrop:h}=En(e,r.posterPath||r.poster_path,r.backdropPath||r.backdrop_path,a);for(let f=1;f<=i;f++){const b=a.findIndex(y=>y.id==e&&y.season==t&&y.episode==f),v={id:e,title:o,posterPath:p,poster_path:p,backdropPath:h,backdrop_path:h,type:l,isAnime:s,isSeries:!0,season:Number(t),episode:f,currentTime:n?d:0,duration:d,progressPercent:n?100:0,completed:!!n,lastWatchedAt:Date.now()};b>=0?a[b]=v:a.push(v)}Me(ue.WATCH_HISTORY,a)}function aa(e,t=[]){if(!t||t.length===0)return yn(e,1,1);const i=Pr();for(const n of t){const r=n.season_number;if(r===0&&t.length>1)continue;const a=n.episode_count||1;for(let o=1;o<=a;o++){const s=i.get(`${e}_${r}_${o}`);if(!s||!s.completed&&s.progressPercent<90)return!1}}return!0}function sa(e,t,i=10){const n=Pr();for(let r=1;r<=i;r++){const a=n.get(`${e}_${t}_${r}`);if(!a||!a.completed&&a.progressPercent<90)return!1}return!0}function Na(e,t=1,i=1,n=1500,r={}){const a=!!(r.isAnime||r.type==="anime"||Fe(e)||dt({id:e,title:r.title,...r}));a&&Se(e);const o=r.type==="movie"&&!a,s=r.duration||(o?6600:3e3),l=n||Math.round(s*.5);return ms({id:e,title:r.title||"İçerik",posterPath:r.posterPath||r.poster_path||"",backdropPath:r.backdropPath||r.backdrop_path||"",type:a?"anime":o?"movie":"tv",isAnime:a,isSeries:!o,season:t,episode:i,currentTime:l,duration:s,completed:!1})}function oa(e){return e?(ot||Pr(),ot&&ot.has(String(e))?ot.get(String(e)):Be().find(i=>i.id==e)||null):null}function li(e){if(!e||e<=0)return"";const t=Math.floor(e/60),i=Math.floor(e%60);if(t>=60){const n=Math.floor(t/60),r=t%60;return`${n}sa ${r>0?r+"dk":""}`}return`${t}:${i<10?"0":""}${i}`}function Zs(e,t){(!t||t<=0)&&(t=3e3);const i=Math.max(0,t-(e||0)),n=Math.round(i/60);if(n<=0)return"Bitti";if(n>=60){const r=Math.floor(n/60),a=n%60;return`${r}sa ${a>0?a+"dk":""} kaldı`}return`${n} dk kaldı`}function Ld(e){if(!e||e<=0)return"0 dakika";const t=Math.floor(e/86400),i=Math.floor(e%86400/3600),n=Math.floor(e%3600/60),r=[];return t>0&&r.push(`${t} gün`),i>0&&r.push(`${i} saat`),(n>0||r.length===0)&&r.push(`${n} dk`),r.join(" ")}function Qs(){if(an)return an;const e=Be();let t=0,i=0,n=0;for(const a of e){const o=fs(a),s=a.duration&&a.duration>0?a.duration:o?6600:3e3;a.completed?t+=s:a.currentTime>0?t+=a.currentTime:a.progressPercent&&a.progressPercent>0?t+=Math.round(a.progressPercent/100*s):t+=s,o?i++:n++}const r=Ld(t);return an={totalSeconds:t,totalMinutes:Math.floor(t/60),totalHours:(t/3600).toFixed(1),formattedTotalTime:r,formattedTotal:r,moviesCount:i,totalMovies:i,episodesCount:n,totalEpisodes:n,totalEntries:e.length},an}function Jn(){if(oi)return oi;const e=Be();if(!e||e.length===0)return oi=[],oi;const t=new Map;for(const n of e){const r=n.id;t.has(r)||t.set(r,[]),t.get(r).push(n)}const i=[];for(const[n,r]of t.entries()){r.sort((l,d)=>(d.lastWatchedAt||0)-(l.lastWatchedAt||0));const a=r[0],o=!!(a.isAnime||a.type==="anime"||Fe(a.id)||dt(a));if(o&&Se(a.id),r.some(l=>l.isSeries===!0||l.type==="tv"||l.type==="anime"||l.first_air_date||l.number_of_seasons||l.season&&l.season>1||l.episode&&l.episode>1||Array.isArray(l.seasons)&&l.seasons.length>0)){if(r.every(L=>L.completed||L.progressPercent>=85))continue;const l=r.find(L=>!L.completed&&L.currentTime>0&&L.progressPercent<100);let d=l?l.season||1:a.season||1;const p=new Set;for(const L of r)L.season===d&&(L.completed||L.progressPercent>=90)&&p.add(L.episode);let h=1,f=!1,b=0,v=a;if(l&&l.season===d)h=l.episode||1,f=!0,b=l.currentTime||0,v=l;else{for(;p.has(h)&&h<=999;)h++;const L=r.find(D=>D.season===d&&D.episode===h);L&&!L.completed&&L.currentTime>0&&(f=!0,b=L.currentTime,v=L)}const y=r.find(L=>L.number_of_seasons||L.status||Array.isArray(L.seasons)&&L.seasons.length>0)||a,k=y.status==="Ended"||y.status==="Canceled",w=(Array.isArray(y.seasons)?y.seasons.find(L=>L.season_number===d):null)?.episode_count||y.season_episodes_count,E=y.number_of_seasons||(Array.isArray(y.seasons)?y.seasons.filter(L=>L.season_number>0).length:0);if(w&&h>w){if(E&&d<E)d++,h=1,f=!1,b=0;else if(k&&!f)continue}if(k&&y.number_of_episodes&&!f&&r.filter(D=>D.completed||D.progressPercent>=90).length>=y.number_of_episodes||p.size===0&&!f&&a.currentTime<=0)continue;const C=v.duration||3e3,S=Zs(b,C),T=o?"Anime Dizisi • ":"";let I="";f&&b>0?I=`${T}S${d} B${h} • Kaldığın: ${li(b)} • ${S}`:p.size>0||h>1?I=`${T}S${d} B${h} • Sıradaki Bölüm`:I=`${T}S${d} B${h} • Sıradaki Bölüm`,i.push({...a,...v,id:a.id,title:a.title||v.title,posterPath:a.posterPath||v.posterPath,poster_path:a.poster_path||v.poster_path,backdropPath:a.backdropPath||v.backdropPath,backdrop_path:a.backdrop_path||v.backdrop_path,type:o?"anime":"tv",isAnime:o,isSeries:!0,season:d,episode:h,currentTime:f?b:0,subtitle:I})}else{if(a.completed||a.progressPercent>=90)continue;if(a.currentTime>0){const d=a.duration||6600,p=Zs(a.currentTime,d),h=o?"Anime Filmi • ":"";i.push({...a,type:o?"anime":"movie",isAnime:o,isSeries:!1,subtitle:`${h}Kaldığın: ${li(a.currentTime)} • ${p}`})}}}return i.sort((n,r)=>(r.lastWatchedAt||0)-(n.lastWatchedAt||0)),oi=i,oi}function la(){if(rn)return rn;const e=Be(),t=new Map;for(const n of e){const r=n.id;t.has(r)||t.set(r,[]),t.get(r).push(n)}const i=[];for(const[n,r]of t.entries()){r.sort((l,d)=>(d.lastWatchedAt||0)-(l.lastWatchedAt||0));const a=r[0],o=!!(a.isAnime||a.type==="anime"||Fe(a.id)||dt(a));o&&Se(a.id),fs(a)?(a.completed||a.progressPercent>=90)&&i.push({...a,type:o?"anime":"movie",isAnime:o,isSeries:!1,completed:!0,subtitle:o?"✓ Anime Filmi İzlendi":"✓ Film İzlendi"}):r.every(d=>d.completed||d.progressPercent>=85)&&r.length>0&&i.push({...a,type:o?"anime":"tv",isAnime:o,isSeries:!0,completed:!0,subtitle:o?`✓ ${r.length} Bölüm Anime İzlendi`:`✓ ${r.length} Bölüm İzlendi`})}return i.sort((n,r)=>(r.lastWatchedAt||0)-(n.lastWatchedAt||0)),rn=i,rn}function eo(){if(nn)return nn;const e=Be(),t=new Map;for(const n of e){const r=n.id;t.has(r)||t.set(r,[]),t.get(r).push(n)}const i=[];for(const[n,r]of t.entries()){r.sort((d,p)=>(p.lastWatchedAt||0)-(d.lastWatchedAt||0));const a=r[0],o=!!(a.isAnime||a.type==="anime"||Fe(a.id)||dt(a));o&&Se(a.id);const s=fs(a),l=o?"anime":s?"movie":"tv";if(s){const d=o?"Anime Filmi • ":"";i.push({...a,type:l,isAnime:o,isSeries:!1,subtitle:a.completed?`✓ ${d}İzlendi`:a.progressPercent>0?`${d}%${a.progressPercent} İzlendi`:d.replace(" • ","")})}else{const d=r.filter(h=>h.completed||h.progressPercent>=85).length,p=o?"Anime Dizisi • ":"";i.push({...a,type:l,isAnime:o,isSeries:!0,subtitle:d>0?`${p}${d} Bölüm İzlendi`:`${p}S${a.season||1} B${a.episode||1}`})}}return i.sort((n,r)=>(r.lastWatchedAt||0)-(n.lastWatchedAt||0)),nn=i,nn}function to(){return Jn()}function Ll(e){if(!e)return e;let t=e.type;const i=!!(e.isAnime||e.type==="anime"||Fe(e.id)||dt(e));i?(t="anime",e.id&&Se(e.id)):(!t||t==="movie")&&(e.isSeries||e.first_air_date||e.media_type==="tv"||e.number_of_seasons||e.episodesCount||!e.title&&e.name?t="tv":t=t||"movie");const n=!!(e.isSeries!==void 0?e.isSeries:t==="tv"||e.first_air_date||e.number_of_seasons||e.episodesCount||e.season&&e.season>1||e.episode&&e.episode>1),r=dr(e.poster_path||e.posterPath||e.poster||""),a=dr(e.backdrop_path||e.backdropPath||e.backdrop||"");return{...e,type:t,isAnime:i,isSeries:n,poster_path:r,posterPath:r,backdrop_path:a,backdropPath:a}}function Vt(){return Wt||(Wt=ft(ue.FAVORITES,[]).map(Ll),zi=new Set(Wt.map(t=>String(t.id))),Wt)}function Id(e){return e?(zi||Vt(),zi.has(String(e))):!1}function Rd(e){if(!e||!e.id)return!1;let t=Vt();const i=t.findIndex(r=>r.id==e.id);let n=!1;if(i>=0)t.splice(i,1);else{const r=!!(e.isAnime||e.type==="anime"||Fe(e.id)||dt(e));r&&Se(e.id);let a=r?"anime":e.type;a||(a=e.first_air_date||e.media_type==="tv"||e.number_of_seasons||!e.title&&e.name?"tv":"movie");const o=e.poster_path||e.posterPath||e.poster||"",s=e.backdrop_path||e.backdropPath||e.backdrop||"";t.unshift({id:e.id,title:e.title||e.name||"İsimsiz",poster_path:o,posterPath:o,backdrop_path:s,backdropPath:s,vote_average:e.vote_average||e.voteAverage||8,release_date:e.release_date||e.first_air_date||"",first_air_date:e.first_air_date||"",genre_ids:e.genre_ids||(Array.isArray(e.genres)?e.genres.map(l=>typeof l=="object"?l.id:l):[]),genres:e.genres||[],original_language:e.original_language||"",origin_country:e.origin_country||[],isAnime:r,type:a,addedAt:Date.now()}),n=!0}return Wt=t,zi=new Set(t.map(r=>String(r.id))),Me(ue.FAVORITES,t),n}function $d(e){let t=Vt();return t=t.filter(i=>i.id!=e),Wt=t,zi=new Set(t.map(i=>String(i.id))),Me(ue.FAVORITES,t),t}function Gt(){return Ti||(Ti=ft(ue.WATCHLIST,[]).map(Ll),lr=new Set(Ti.map(t=>String(t.id))),Ti)}function gs(e){return e?(lr||Gt(),lr.has(String(e))):!1}function Il(e){if(!e||!e.id)return!1;let t=Gt();const i=t.findIndex(r=>r.id==e.id);let n=!1;if(i>=0)t.splice(i,1);else{const r=!!(e.isAnime||e.type==="anime"||Fe(e.id)||dt(e));r&&Se(e.id);let a=r?"anime":e.type;a||(a=e.first_air_date||e.media_type==="tv"||e.number_of_seasons||!e.title&&e.name?"tv":"movie");const o=e.poster_path||e.posterPath||e.poster||"",s=e.backdrop_path||e.backdropPath||e.backdrop||"";t.unshift({id:e.id,title:e.title||e.name||"İsimsiz",poster_path:o,posterPath:o,backdrop_path:s,backdropPath:s,vote_average:e.vote_average||e.voteAverage||8,release_date:e.release_date||e.first_air_date||"",first_air_date:e.first_air_date||"",genre_ids:e.genre_ids||(Array.isArray(e.genres)?e.genres.map(l=>typeof l=="object"?l.id:l):[]),genres:e.genres||[],original_language:e.original_language||"",origin_country:e.origin_country||[],isAnime:r,type:a,addedAt:Date.now()}),n=!0}return Me(ue.WATCHLIST,t),n}function Md(e){let t=Gt();return t=t.filter(i=>i.id!=e),Me(ue.WATCHLIST,t),t}function Pd(){nt=[],Qe=new Map,ot=new Map,Ot(),Me(ue.WATCH_HISTORY,[])}function Bd(e,t=1,i=1){return Ed(e,t,i)}function yt(){return Yt||(Yt=ft(ue.USER_SETTINGS,{autoplayNext:!0,preferredResolution:"1080p",theme:"dark",subtitlesEnabled:!0,cardLayout:"portrait",hoverPreviewsEnabled:!0,trailersEnabled:!0}),Yt)}function Rl(e){Yt={...yt(),...e},Me(ue.USER_SETTINGS,Yt),typeof window<"u"&&window.dispatchEvent(new CustomEvent("cinepulse_settings_changed",{detail:Yt}))}function $l(){const e=ft(ue.WATCH_HISTORY,[]),t=ft(ue.FAVORITES,[]),i=ft(ue.WATCHLIST,[]),n=ft(ue.USER_SETTINGS,{}),r={version:"1.0.0",exportDate:new Date().toISOString(),appName:"CinePulse Studio",watchHistory:e,favorites:t,watchlist:i,userSettings:n,data:{watchHistory:e,favorites:t,watchlist:i,userSettings:n}},a=JSON.stringify(r,null,2),o=new Blob([a],{type:"application/json;charset=utf-8"}),s=URL.createObjectURL(o),l=document.createElement("a");l.href=s,l.download=`cinepulse_yedek_${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(l),l.click(),setTimeout(()=>{document.body.removeChild(l),URL.revokeObjectURL(s)},1e3)}function Ml(e,t="merge"){try{let i=null;if(typeof e=="string"?i=JSON.parse(e.trim()):typeof e=="object"&&e!==null&&(i=e),!i)throw new Error("Geçersiz veya boş yedek dosyası.");let n=[],r=[],a=[],o={};if(Array.isArray(i)?n=i:typeof i=="object"&&(n=i.watchHistory||i.data?.watchHistory||i.sineflix_watch_history_v1||i.history||[],r=i.favorites||i.data?.favorites||i.sineflix_favorites_v1||[],a=i.watchlist||i.data?.watchlist||i.sineflix_watchlist_v1||[],o=i.userSettings||i.data?.userSettings||i.sineflix_user_settings_v1||{}),Array.isArray(n)||(n=[]),Array.isArray(r)||(r=[]),Array.isArray(a)||(a=[]),t==="replace")Me(ue.WATCH_HISTORY,n),Me(ue.FAVORITES,r),Me(ue.WATCHLIST,a),o&&typeof o=="object"&&Me(ue.USER_SETTINGS,o);else{const s=ft(ue.WATCH_HISTORY,[]),l=new Map;s.forEach(y=>{const k=`${y.id}_${y.season||1}_${y.episode||1}`;l.set(k,y)}),n.forEach(y=>{const k=`${y.id}_${y.season||1}_${y.episode||1}`;if(!l.has(k))l.set(k,y);else{const m=l.get(k);((y.lastWatchedAt||0)>=(m.lastWatchedAt||0)||y.completed)&&l.set(k,{...m,...y})}});const d=Array.from(l.values()).sort((y,k)=>(k.lastWatchedAt||0)-(y.lastWatchedAt||0));Me(ue.WATCH_HISTORY,d);const p=ft(ue.FAVORITES,[]),h=new Map;p.forEach(y=>h.set(String(y.id),y)),r.forEach(y=>{h.has(String(y.id))||h.set(String(y.id),y)}),Me(ue.FAVORITES,Array.from(h.values()));const f=ft(ue.WATCHLIST,[]),b=new Map;f.forEach(y=>b.set(String(y.id),y)),a.forEach(y=>{b.has(String(y.id))||b.set(String(y.id),y)}),Me(ue.WATCHLIST,Array.from(b.values()));const v=ft(ue.USER_SETTINGS,{});Me(ue.USER_SETTINGS,{...v,...o})}return $r(),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{action:"import"}})),window.dispatchEvent(new CustomEvent("cinepulse_data_changed",{detail:{action:"import"}})),{success:!0,countHistory:n.length,countFavs:r.length,countWatchlist:a.length,message:`${n.length} izleme kaydı ve ${r.length} favori başarıyla aktarıldı.`}}catch(i){return{success:!1,error:i.message,message:"Yedek dosyası okunamadı: "+i.message}}}function Dd(){const e=Be(),t=Vt(),i=Gt(),n=JSON.stringify({history:e,favorites:t,watchlist:i}),r=new Blob([n]).size,a=(r/1024).toFixed(1);return{historyCount:e.length,favoritesCount:t.length,watchlistCount:i.length,bytes:r,kb:a}}function zd(){$r();try{ln(Mt(ue.WATCH_HISTORY),[]),ln(Mt(ue.FAVORITES),[]),ln(Mt(ue.WATCHLIST),[])}catch{}typeof window<"u"&&window.localStorage&&(localStorage.removeItem(Mt(ue.WATCH_HISTORY)),localStorage.removeItem(Mt(ue.FAVORITES)),localStorage.removeItem(Mt(ue.WATCHLIST))),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{cleared:!0}}))}function Od(){if(!(typeof window>"u"||!window.localStorage))try{localStorage.removeItem("cinepulse_epg_live_cache"),localStorage.removeItem("sineflix_epg_cache_v2");for(let t=0;t<localStorage.length;t++){const i=localStorage.key(t);i&&(i.startsWith("cinepulse_home_fast_")||i.startsWith("sineflix_home_fast_"))&&localStorage.removeItem(i)}const e=localStorage.getItem("sineflix_notifications_v1");if(e)try{const t=JSON.parse(e);Array.isArray(t)&&t.length>25&&localStorage.setItem("sineflix_notifications_v1",JSON.stringify(t.slice(0,25)))}catch{}}catch{}}Od();const Nd="https://api.themoviedb.org/3",ys=["4e44d9029b1270a757cddc766a1bcb63","844dba0bfd8f3a4f3799f6130ef9e335"];let Ha=0;function Hd(){return ys[Ha]}function io(){Ha=(Ha+1)%ys.length}const et={POSTER_SMALL:"https://image.tmdb.org/t/p/w185",POSTER_MEDIUM:"https://image.tmdb.org/t/p/w342",BACKDROP_LARGE:"https://image.tmdb.org/t/p/w780",BACKDROP_XLARGE:"https://image.tmdb.org/t/p/w1280",BACKDROP_ORIGINAL:"https://image.tmdb.org/t/p/original",STILL_MEDIUM:"https://image.tmdb.org/t/p/w300"},qd='<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750"><rect width="500" height="750" fill="#0b0f19"/><circle cx="250" cy="300" r="160" fill="#f59e0b" opacity="0.25"/><g transform="translate(190, 230) scale(2.5)" fill="none" stroke="#f59e0b" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></g><text x="250" y="430" font-family="sans-serif" font-weight="800" font-size="30" fill="#ffffff" text-anchor="middle">Cine<tspan fill="#f59e0b">Pulse</tspan></text><text x="250" y="470" font-family="sans-serif" font-weight="500" font-size="16" fill="#64748b" text-anchor="middle">Görsel Yüklenemedi</text></svg>',vn=`data:image/svg+xml,${encodeURIComponent(qd)}`,Fd='<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#1e293b"/><circle cx="50" cy="40" r="18" fill="#64748b"/><path d="M 20 85 C 20 65, 80 65, 80 85 Z" fill="#64748b"/></svg>',ur=`data:image/svg+xml,${encodeURIComponent(Fd)}`;function lt(e,t=et.POSTER_MEDIUM){if(!e||e==="null"||e==="undefined"||e==="")return vn;if(e.startsWith("http")||e.startsWith("data:"))return e;let i=e;try{for(;i.includes("%");){const n=decodeURIComponent(i);if(n===i)break;i=n}}catch{}return i=i.replace(/^\/+/,"/"),i.startsWith("/")||(i=`/${i}`),i==="/"||i==="/null"||i==="/undefined"?vn:`${t}${i}`}const ca={};async function vs(e){if(!e||e.trim().length===0)return"";if(ca[e])return ca[e];try{const t=`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=tr&dt=t&q=${encodeURIComponent(e)}`,i=await fetch(t,{signal:AbortSignal.timeout(1200)});if(i.ok){const n=await i.json();if(n&&n[0]){const r=n[0].map(a=>a[0]).join("");return ca[e]=r,r}}}catch{}return e}const da=new Map;async function me(e,t={}){const i=`${e}_${JSON.stringify(t)}`;if(da.has(i))return da.get(i);for(let n=0;n<ys.length;n++)try{const r=new URL(`${Nd}${e}`);r.searchParams.append("api_key",Hd());for(let o in t)t[o]!==void 0&&t[o]!==null&&r.searchParams.append(o,t[o]);const a=await fetch(r.toString(),{signal:AbortSignal.timeout(6e3)});if(a.ok){const o=await a.json();return da.set(i,o),o}else io()}catch{io()}return null}const Ud=new Set([64,84,4370]),jd=new Set([10764]),Kd=["hayalet hikayeleri","a haunting","altin pesinde","gold rush","olumcul av","deadliest catch","hurda avcilari","salvage hunters","tamirat tadilat","wheeler dealers","agir yasamlar","my 600-lb life","evlilige 90 gun","90 day fiance","pasta ustalari","cake boss","agac ev ustalari","treehouse masters","alaska yi kurtarmak","alaskayi kurtarmak","alaska: the last frontier","oto kurtarma kulubu","fast n loud","nehir canavarlari","river monsters","kupon delileri","extreme couponing","temizlik bagimlilari","obsessive compulsive cleaners","asiri cimriler","extreme cheapskates","restoran kurtarma","depo savaslari","storage wars","gumruk kontrol","border security","nasil yapilir","how it's made","how its made","dmax","tlc"],Wd=new Set([3072,34634,3126,45814,1356,45598,61498,59792,29849,23067,44383,44372]);function Je(e){if(!e||e.id&&Wd.has(Number(e.id))||(e.genre_ids||(Array.isArray(e.genres)?e.genres.map(r=>typeof r=="object"?r.id:r):[])).some(r=>jd.has(Number(r))))return!0;const i=e.networks||[];if(Array.isArray(i)&&i.some(r=>Ud.has(Number(r.id||r))))return!0;const n=(e.title||e.name||e.original_title||e.original_name||"").toLowerCase().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c");for(const r of Kd)if(n.includes(r))return!0;return!!(Lt()&&!Zt(e))}const bs=[[180,["rafadan tayfa","kral sakir","niloya","pepee"]],[225,["miraculous","gumball","adventure time","regular show","teen titans go","ben 10","spongebob","sunger bob"]],[130,["masha and the bear","masa ile koca ayi","winx","scooby doo","ninjago","paw patrol","pijamaskeliler"]],[150,["samurai jack","johnny test","johnny bravo","dexter laboratory","powerpuff girls","courage cowardly dog"]],[110,["avatar the last airbender","avatar son hava bukucu","gravity falls","steven universe","the owl house","amphibia"]]],no=[[180,["naruto","one piece","attack on titan","shingeki no kyojin","demon slayer","kimetsu no yaiba"]],[160,["jujutsu kaisen","death note","solo leveling","bleach","dragon ball"]],[140,["pokemon","beyblade","captain tsubasa","yu gi oh","bakugan","my hero academia","boku no hero"]],[120,["hunter x hunter","tokyo ghoul","fullmetal alchemist","vinland saga","monster","jojo","haikyuu","blue lock"]],[105,["chainsaw man","one punch man","spy x family","black clover","frieren","kaiju no 8","dandadan"]]],Yd=[[320,["rick and morty","invincible","arcane","bojack horseman"]],[280,["south park","family guy","american dad","futurama","the simpsons"]],[250,["love death robots","harley quinn","archer","solar opposites"]],[220,["castlevania","blue eye samurai","the legend of vox machina","spawn","primal"]],[200,["big mouth","f is for family","disenchantment","inside job","smiling friends","hazbin hotel","helluva boss"]],[180,["boondocks","paradise pd","brickleberry","final space","scavengers reign","pantheon","undone","creature commandos"]]];function Br(e=""){return String(e).toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ı/g,"i").replace(/[^a-z0-9]+/g," ").trim()}function ws(e){const t=String(e?.original_language||"").toLowerCase(),i=Array.isArray(e?.origin_country)?e.origin_country.map(n=>String(n).toUpperCase()):[];return["ja","zh","ko"].includes(t)||i.some(n=>["JP","CN","KR"].includes(n))}function Vd(e,t=!1){const i=Br([e.name,e.title,e.original_name,e.original_title].filter(Boolean).join(" ")),n=t?no:[...bs,...no];for(const[r,a]of n)if(a.some(o=>i.includes(o)))return r;return 0}function ro(e){const t=Br([e.name,e.title,e.original_name,e.original_title].filter(Boolean).join(" "));for(const[i,n]of Yd)if(n.some(r=>t.includes(r)))return i;return 0}function Pl(e){const t=Br([e.name,e.title,e.original_name,e.original_title].filter(Boolean).join(" "));return bs.some(([,i])=>i.some(n=>t.includes(n)))}function Gd(e){const t=Br([e.name,e.title,e.original_name,e.original_title].filter(Boolean).join(" "));for(const[i,n]of bs)if(n.some(r=>t.includes(r)))return i;return 0}function Dr(e,{animeOnly:t=!1}={}){return e.map(i=>{const n=Math.min(220,Number(i.popularity)||0),r=Math.min(95,Math.log10((Number(i.vote_count)||0)+1)*22),a=Math.max(0,(Number(i.vote_average)||0)-5)*5,o=!t&&i.origin_country?.includes("TR")?115:0,s=n+r+a+o+Vd(i,t);return{...i,_turkeyPopularityScore:Math.round(s*100)/100}}).sort((i,n)=>n._turkeyPopularityScore-i._turkeyPopularityScore)}async function qa(e=1){const[t,i,n,r,a]=await Promise.all([me("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16",without_genres:"27,80,53,10752,18","vote_count.gte":10,include_adult:!1}),me("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"10762",without_genres:"27,80,53","vote_count.gte":5,include_adult:!1}),me("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16",with_origin_country:"TR",without_genres:"27,80,53,10752,18",include_adult:!1}),me("/discover/tv",{sort_by:"vote_count.desc",page:e+2,language:"tr-TR",with_genres:"16",without_genres:"27,80,53,10752,18","vote_count.gte":10,include_adult:!1}),e===1?me("/trending/tv/week",{language:"tr-TR"}):Promise.resolve(null)]),o=(a?.results||[]).filter(d=>(d.genre_ids||[]).includes(16)),s=[...t?.results||[],...i?.results||[],...n?.results||[],...r?.results||[],...o],l=new Map;for(const d of s)d&&d.id&&!l.has(d.id)&&l.set(d.id,d);return Dr(Array.from(l.values()).filter(d=>(d.poster_path||d.backdrop_path)&&!Je(d)).map(d=>({...d,type:"tv",media_type:"tv",isSeries:!0,overview:(d.overview||"").trim()||qe(d,"tv")})))}function Jd(e){const t=new Map;for(const i of e)i?.id&&!t.has(i.id)&&t.set(i.id,i);return Dr(Array.from(t.values()).filter(i=>{const n=(i.genre_ids||[]).map(Number);return(i.poster_path||i.backdrop_path)&&n.includes(16)&&(n.includes(10751)||n.includes(10762)||Pl(i))&&!ws(i)&&Zt(i)&&!Je(i)}).map(i=>({...i,type:"tv",media_type:"tv",isSeries:!0,overview:(i.overview||"").trim()||qe(i,"tv")})))}async function Bl(e,t,i){const n=await Promise.all(t.map(([r,a])=>me("/discover/tv",{sort_by:i,page:e,language:"tr-TR",with_genres:"16",without_genres:"18,27,53,80,99,10752,10764,10766,10767","first_air_date.gte":r,"first_air_date.lte":a,include_adult:!1})));return Jd(n.flatMap(r=>r?.results||[]))}async function ao(e=1){return Bl(e,[["2020-01-01","2099-12-31"],["2015-01-01","2019-12-31"]],"popularity.desc")}async function so(e=1){return Bl(e,[["2010-01-01","2014-12-31"],["2000-01-01","2009-12-31"],["1990-01-01","1999-12-31"],["1900-01-01","1989-12-31"]],"vote_count.desc")}async function Fa(e=1){const[t,i,n]=await Promise.all([me("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16",without_genres:"10751,10762","vote_count.gte":80,include_adult:!1}),me("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"16",without_genres:"10751,10762","vote_average.gte":6.5,"vote_count.gte":150,include_adult:!1}),e===1?me("/trending/tv/week",{language:"tr-TR"}):Promise.resolve(null)]),r=(n?.results||[]).filter(o=>(o.genre_ids||[]).includes(16)),a=new Map;for(const o of[...t?.results||[],...i?.results||[],...r])o?.id&&!a.has(o.id)&&a.set(o.id,o);return Array.from(a.values()).filter(o=>{const s=(o.genre_ids||[]).map(Number);return(o.poster_path||o.backdrop_path)&&s.includes(16)&&!s.includes(10751)&&!s.includes(10762)&&!ws(o)&&!Pl(o)&&(e===1?ro(o)>0:!0)&&!Je(o)}).map(o=>{const s=Math.min(250,Number(o.popularity)||0),l=Math.min(130,Math.log10((Number(o.vote_count)||0)+1)*30),d=Math.max(0,(Number(o.vote_average)||0)-5)*8;return{...o,type:"tv",media_type:"tv",isSeries:!0,overview:(o.overview||"").trim()||qe(o,"tv"),_adultAnimationScore:s+l+d+ro(o)}}).sort((o,s)=>s._adultAnimationScore-o._adultAnimationScore)}async function pr(e=1){const t=[["2020-01-01","2099-12-31"],["2015-01-01","2019-12-31"],["2010-01-01","2014-12-31"],["2000-01-01","2009-12-31"],["1990-01-01","1999-12-31"],["1980-01-01","1989-12-31"],["1900-01-01","1979-12-31"]],i=await Promise.all(t.map(([r,a])=>me("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"16",without_genres:"27,80,53,99,10764,10766,10767","first_air_date.gte":r,"first_air_date.lte":a,include_adult:!1}))),n=new Map;for(const r of i)for(const a of r?.results||[])a?.id&&!n.has(a.id)&&n.set(a.id,a);return Array.from(n.values()).filter(r=>{const a=(r.genre_ids||[]).map(Number);return(r.poster_path||r.backdrop_path)&&a.includes(16)&&!a.includes(99)&&!ws(r)&&!zr(r.name||r.title||"")&&!Je(r)}).map(r=>{const a=parseInt(String(r.first_air_date||"").slice(0,4),10)||9999,o=Math.min(220,Number(r.popularity)||0),s=Math.min(115,Math.log10((Number(r.vote_count)||0)+1)*27),l=a<=2018?35:0;return{...r,type:"tv",media_type:"tv",isSeries:!0,overview:(r.overview||"").trim()||qe(r,"tv"),_cartoonScore:o+s+l+Gd(r)}}).sort((r,a)=>a._cartoonScore-r._cartoonScore)}async function Ua(e=1){const t=await me("/discover/movie",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"16,10751",without_genres:"27,80,53,10752","vote_count.gte":40});return!t||!t.results?[]:t.results.filter(i=>(i.poster_path||i.backdrop_path)&&!Je(i)).map(i=>({...i,type:"movie",media_type:"movie",overview:(i.overview||"").trim()||qe(i,"movie")}))}async function oo(e=1){const t=await me("/discover/movie",{sort_by:"vote_average.desc",page:e,language:"tr-TR",with_genres:"12,14,10751","vote_count.gte":150,without_genres:"27,80,53"});return!t||!t.results?[]:t.results.filter(i=>(i.poster_path||i.backdrop_path)&&!Je(i)).map(i=>({...i,type:"movie",media_type:"movie",overview:(i.overview||"").trim()||qe(i,"movie")}))}async function Dl(e="all",t="week",i=1){const[n,r]=await Promise.all([me(`/trending/${e}/${t}`,{page:i,language:"tr-TR"}),me(`/trending/${e}/${t}`,{page:i,language:"en-US"})]);if(!n||!n.results)return[];const a=new Map((r?.results||[]).map(o=>[o.id,o.overview]));return n.results.filter(o=>(o.poster_path||o.backdrop_path)&&!Je(o)).map(o=>{const l=o.media_type==="tv"||!!o.first_air_date?"tv":"movie",d=(o.overview||"").trim(),p=(a.get(o.id)||"").trim();return{...o,type:l,media_type:l,overview:d||p||qe(o,l)}})}async function hr(e=1){const t=await me("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR","vote_count.gte":300,without_genres:"16"});return!t||!t.results?[]:t.results.filter(i=>(i.poster_path||i.backdrop_path)&&!Je(i)).map(i=>{const n=(i.overview||"").trim();return{...i,type:"tv",media_type:"tv",overview:n||qe(i,"tv")}})}async function fr(e=1){const t=await me("/discover/movie",{sort_by:"vote_count.desc",page:e,language:"tr-TR","vote_count.gte":500});return!t||!t.results?[]:t.results.filter(i=>(i.poster_path||i.backdrop_path)&&!Je(i)).map(i=>{const n=(i.overview||"").trim();return{...i,type:"movie",media_type:"movie",overview:n||qe(i,"movie")}})}function zr(e){return e?/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\u1100-\u11ff\u3130-\u318f\ua960-\ua97f\ud7b0-\ud7ff\u0600-\u06ff\u0400-\u04ff\u0e00-\u0e7f]/.test(e):!1}async function mr(e=1){const[t,i,n,r]=await Promise.all([me("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16",with_original_language:"ja","vote_count.gte":50}),me("/discover/tv",{sort_by:"popularity.desc",page:e,language:"en-US",with_genres:"16",with_original_language:"ja","vote_count.gte":50}),me("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"16",with_original_language:"ja","vote_count.gte":100}),e===1?me("/trending/tv/week",{language:"tr-TR"}):Promise.resolve(null)]);if(!t||!t.results)return[];const a=new Map((i?.results||[]).map(s=>[s.id,s.name||s.title])),o=new Map([...t.results||[],...n?.results||[],...(r?.results||[]).filter(s=>s.original_language==="ja"&&(s.genre_ids||[]).includes(16))].map(s=>[s.id,s]));return Dr(Array.from(o.values()).filter(s=>(s.poster_path||s.backdrop_path)&&!Je(s)).map(s=>{let l=s.name||s.title||"";return(!l||zr(l))&&(l=a.get(s.id)||s.original_name||s.original_title||l),s.id&&Se(s.id),{...s,name:l,title:l,type:"anime",media_type:"anime",isAnime:!0,isSeries:!0,overview:s.overview||qe(s,"tv")}}),{animeOnly:!0})}async function ja(e=1){const[t,i]=await Promise.all([me("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16,10762",with_original_language:"ja",without_genres:"27,80,53,10752,18","vote_count.gte":10}),me("/discover/tv",{sort_by:"popularity.desc",page:e,language:"en-US",with_genres:"16,10762",with_original_language:"ja",without_genres:"27,80,53,10752,18","vote_count.gte":10})]);if(!t||!t.results)return[];const n=new Map((i?.results||[]).map(r=>[r.id,r.name||r.title]));return Dr(t.results.filter(r=>(r.poster_path||r.backdrop_path)&&!Je(r)).map(r=>{let a=r.name||r.title||"";return(!a||zr(a))&&(a=n.get(r.id)||r.original_name||r.original_title||a),r.id&&Se(r.id),{...r,name:a,title:a,type:"anime",media_type:"anime",isAnime:!0,isSeries:!0,overview:r.overview||qe(r,"tv")}}),{animeOnly:!0})}async function gr(e=1){const[t,i]=await Promise.all([me("/discover/movie",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"99","vote_count.gte":40}),me("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"99","vote_count.gte":30})]),n=(t?.results||[]).filter(a=>(a.poster_path||a.backdrop_path)&&!Je(a)).map(a=>({...a,type:"movie",media_type:"movie",overview:(a.overview||"").trim()||qe(a,"movie")})),r=(i?.results||[]).filter(a=>(a.poster_path||a.backdrop_path)&&!Je(a)).map(a=>({...a,type:"tv",media_type:"tv",overview:(a.overview||"").trim()||qe(a,"tv")}));return[...n,...r].sort((a,o)=>(o.vote_count||0)-(a.vote_count||0))}async function Xd(e=1){const t=await me("/discover/movie",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"99,10751",without_genres:"27,80,53,10752","vote_count.gte":10}),i=await me("/discover/movie",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"99,16",without_genres:"27,80,53","vote_count.gte":5}),n=t?.results||[],r=i?.results||[],a=new Set,o=[];for(const l of[...n,...r])l&&l.id&&!a.has(l.id)&&(a.add(l.id),o.push(l));const s=["jackass","murder","killer","war","drug","crime","sex","violent","savaş","cinayet","uyuşturucu"];return o.filter(l=>{if(!(l.poster_path||l.backdrop_path)||Je(l))return!1;const d=`${l.title||""} ${l.name||""} ${l.overview||""}`.toLowerCase();return!s.some(p=>d.includes(p))}).map(l=>({...l,type:"movie",media_type:"movie",overview:l.overview||qe(l,"movie")}))}async function Li(e="tv",t=1){const[i,n]=await Promise.all([me(`/${e}/top_rated`,{page:t,language:"tr-TR"}),me(`/${e}/top_rated`,{page:t,language:"en-US"})]);if(!i||!i.results)return[];const r=new Map((n?.results||[]).map(a=>[a.id,a.overview]));return Promise.all(i.results.filter(a=>(a.poster_path||a.backdrop_path)&&!Je(a)).map(async a=>{let o=(a.overview||"").trim();const s=(r.get(a.id)||"").trim();return(!o||o.length<15)&&s&&s.length>10&&(o=await vs(s)),{...a,type:e,media_type:e,overview:o||s||qe(a,e)}}))}async function zl({type:e="tv",genreId:t=null,page:i=1,sortBy:n="popularity.desc",minRating:r=0,isAnime:a=!1,isDoc:o=!1,yearMin:s=null,yearMax:l=null,withNetworks:d=null,withProviders:p=null}){const h={sort_by:n,page:i,language:"tr-TR"};return a?(h.with_genres=t?`16,${t}`:"16",h.with_original_language="ja"):o?h.with_genres=t?`99,${t}`:"99":t&&(h.with_genres=t),r>0&&(h["vote_average.gte"]=r,h["vote_count.gte"]=40),s&&(e==="movie"?h["primary_release_date.gte"]=`${s}-01-01`:h["first_air_date.gte"]=`${s}-01-01`),l&&(e==="movie"?h["primary_release_date.lte"]=`${l}-12-31`:h["first_air_date.lte"]=`${l}-12-31`),d&&(e==="tv"?h.with_networks=d:(h.with_watch_providers=p||d,h.watch_region="TR")),((await me(e==="movie"?"/discover/movie":"/discover/tv",h))?.results||[]).filter(y=>(y.poster_path||y.backdrop_path)&&!Je(y)).map(y=>(a&&y.id&&Se(y.id),{...y,type:a?"anime":e,media_type:a?"anime":e,isAnime:a,isSeries:e==="tv"}))}function qe(e,t="tv"){if(!e)return"Sürükleyici atmosferi ve zengin hikaye örgüsüyle izleyicileri ekran başına kilitleyen etkileyici bir yapım.";const i=e.title||e.name||"Bu yapım",n=t==="tv"||e.media_type==="tv"||!!e.first_air_date||e.seasons&&e.seasons.length>0||!!e.number_of_seasons,r=n?"dizi":"film";let a=[];Array.isArray(e.genres)&&e.genres.length>0&&(a=e.genres.map(w=>typeof w=="string"?w:w.name).filter(Boolean));const o=a.length>0?a.slice(0,3).join(", "):n?"Dram ve Gerilim":"Sinema",s=e.release_date||e.first_air_date||(e.year?String(e.year):""),l=s?` ${s.slice(0,4)} yılında izleyiciyle buluşan ve`:"",d=Number(e.vote_average||e.rating||0),p=d>0?`IMDb'de ${d.toFixed(1)}/10 gibi başarılı bir puana sahip olan`:"Eleştirmenler ve izleyiciler tarafından büyük beğeni toplayan";let h="";const f=e.credits?.cast||[];if(f.length>0){const w=f.slice(0,3).map(E=>E.name).filter(Boolean).join(", ");w&&(h=` Başrollerinde ${w} gibi başarılı isimlerin yer aldığı`)}let b="";const v=e.credits?.crew?.filter(w=>w.job==="Director").map(w=>w.name)||[],y=e.created_by?.map(w=>w.name)||[],k=v[0]||y[0];k&&(b=` ${k} imzalı`);let m="";return e.tagline&&e.tagline.trim().length>6&&(m=` "${e.tagline.trim()}" temasıyla dikkat çeken yapım,`),`${i}, ${o} türünde öne çıkan${l}${b}${h} etkileyici bir ${r} deneyimi sunuyor.${m} ${p} yapım, beklenmedik ters köşeleri, derin karakter gelişimleri ve soluksuz temposuyla izleyenlere unutulmaz anlar vadediyor.`}async function lo(e="tv",t){const i=await me(`/${e}/${t}`,{append_to_response:"credits,similar,recommendations,videos,external_ids",language:"tr-TR"});if(!i)return null;(i.original_language==="ja"||Array.isArray(i.origin_country)&&i.origin_country.includes("JP"))&&Array.isArray(i.genres)&&i.genres.some(s=>s.id===16||/anim/i.test(s.name))&&i.id&&Se(i.id);let r=(i.overview||"").trim();if(!r||r.length<15)try{const s=await me(`/${e}/${t}`,{language:"en-US"});if(s&&s.overview&&s.overview.trim().length>10){const l=await vs(s.overview.trim());l&&l.length>15&&(i.overview=l)}}catch{}(!i.overview||i.overview.trim().length<15)&&(i.overview=qe(i,e));let a=i.videos?.results||[];if(!a.some(s=>s.site==="YouTube"&&(s.type==="Trailer"||s.type==="Teaser")))try{const l=(await me(`/${e}/${t}/videos`,{language:"en-US"}))?.results||[];l.length>0&&(i.videos=i.videos||{},i.videos.results=[...a,...l])}catch{}return i}const Mn=new Map;function ua(e,t){if(!e||e.site!=="YouTube"||!e.key)return-1;let n={Trailer:500,Teaser:360,Promo:280,"Opening Credits":240,Clip:160,Featurette:100}[e.type]||50;return e.official===!0&&(n+=1e3),t==="tr"?n+=50:t==="en"?n+=25:t==="ja"&&(n+=15),/official|resmi|final trailer|main trailer|tanıtım|fragman/i.test(e.name||"")&&(n+=80),/fan|concept|reaction|breakdown/i.test(e.name||"")&&(n-=800),n}function bn(e="tv",t,i=""){if(yt().trailersEnabled===!1)return Promise.resolve(null);const n=`${e}:${t}`;if(Mn.has(n))return Mn.get(n);const r=(async()=>{try{const[a,o,s]=await Promise.all([me(`/${e}/${t}/videos`,{language:"tr-TR"}).catch(()=>null),me(`/${e}/${t}/videos`,{language:"en-US"}).catch(()=>null),me(`/${e}/${t}/videos`,{include_video_language:"tr,en,ja,ko,null"}).catch(()=>null)]),l=new Set,d=[],p=(f,b)=>{if(Array.isArray(f))for(const v of f)v&&v.key&&!l.has(v.key)&&(l.add(v.key),d.push({video:v,language:b||v.iso_639_1||"en"}))};p(a?.results,"tr"),p(o?.results,"en"),p(s?.results,""),d.sort((f,b)=>ua(b.video,b.language)-ua(f.video,f.language));const h=d.find(f=>ua(f.video,f.language)>=0)?.video;if(h?.key){const f=h.key.trim(),b=encodeURIComponent(f);return{key:f,name:h.name||"Resmi Fragman",site:h.site,type:h.type,embedUrl:`https://www.youtube.com/embed/${b}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,watchUrl:`https://www.youtube.com/watch?v=${b}`}}if(i&&typeof i=="string"&&i.trim().length>1){const f=i.trim(),b=`${f} Fragman`;return{key:"",name:`${f} Tanıtım`,site:"YouTube",type:"Trailer",embedUrl:`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(b)}&autoplay=1&rel=0`,watchUrl:`https://www.youtube.com/results?search_query=${encodeURIComponent(b)}`}}}catch{}return null})();return Mn.set(n,r),r.then(a=>{a||Mn.delete(n)}),r}async function Zd(e,t=1){const i=await me(`/tv/${e}/season/${t}`,{language:"tr-TR"});if(!i||!i.episodes)return i;const n=await me(`/tv/${e}/season/${t}`,{language:"en-US"});return await Promise.all(i.episodes.map(async(r,a)=>{let o=r.overview?r.overview.trim():"";(!o||o.length<5)&&n&&n.episodes&&n.episodes[a]&&n.episodes[a].overview&&(o=n.episodes[a].overview),o&&(!r.overview||r.overview.length<5)&&(r.overview=await vs(o))})),i}async function ks(e,t=1){if(!e||!e.trim())return[];const i=e.trim().toLowerCase(),[n,r,a]=await Promise.all([me("/search/multi",{query:i,page:t,language:"tr-TR",include_adult:!1}),me("/search/multi",{query:i,page:t,language:"en-US",include_adult:!1}),me("/search/tv",{query:i,page:t,language:"tr-TR",include_adult:!1})]),o=new Map,s=d=>{if(Array.isArray(d)){for(const p of d)if(!(!p||!p.id)&&!(!p.poster_path&&!p.backdrop_path)&&!Je(p)&&!o.has(p.id)){const h=p.media_type==="tv"||!!p.first_air_date||p.name&&!p.title;o.set(p.id,{...p,type:h?"tv":"movie",media_type:h?"tv":"movie"})}}};s(n?.results),s(r?.results),s(a?.results);const l=Array.from(o.values());return l.sort((d,p)=>{const h=(d.title||d.name||d.original_title||d.original_name||"").toLowerCase(),f=(p.title||p.name||p.original_title||p.original_name||"").toLowerCase(),b=h===i?100:h.startsWith(i)?50:0,v=f===i?100:f.startsWith(i)?50:0,y=b+Math.min(100,(d.vote_count||0)/50)+(d.popularity||0)*.5;return v+Math.min(100,(p.vote_count||0)/50)+(p.popularity||0)*.5-y}),l}const bt={ACTION_ADVENTURE:10759,ANIMATION:16,COMEDY:35,CRIME:80,DOCUMENTARY:99,DRAMA:18,FAMILY:10751,MYSTERY:9648,SCI_FI_FANTASY:10765,WAR_POLITICS:10768,WESTERN:37},Ge={ACTION:28,ADVENTURE:12,ANIMATION:16,COMEDY:35,CRIME:80,DOCUMENTARY:99,DRAMA:18,FAMILY:10751,FANTASY:14,HISTORY:36,HORROR:27,MUSIC:10402,MYSTERY:9648,ROMANCE:10749,SCI_FI:878,THRILLER:53,WESTERN:37};async function Qd(e){if(!e)return null;const t=await me(`/person/${e}`,{language:"tr-TR",append_to_response:"combined_credits"});if(!t||!t.biography||t.biography.trim().length===0){const i=await me(`/person/${e}`,{language:"en-US",append_to_response:"combined_credits"});if(i)if(t)t.biography=i.biography,!t.combined_credits&&i.combined_credits&&(t.combined_credits=i.combined_credits);else return i}return t}function Z(e,t="info",i=3500){const n=document.getElementById("toast-container");if(!n)return;const r=document.createElement("div");r.className=`toast toast-${t}`;let a="info";t==="success"&&(a="check-circle"),t==="error"&&(a="alert-circle"),r.innerHTML=`
    <i data-lucide="${a}"></i>
    <span>${e}</span>
  `,n.appendChild(r),V(),setTimeout(()=>{r.style.opacity="0",r.style.transform="translateX(100%)",r.style.transition="all 0.3s ease-out",setTimeout(()=>{r.parentNode&&r.parentNode.removeChild(r)},300)},i)}const gt="https://api.trakt.tv",eu="AsVFyJXykTMViLCXPMAvFGtk7B_npj5Y3STpzljYnwY",tu="4b6l8YaAG-GzyY6cSPFR5ea66xrXYEqrrHhn3FiWa7k",ct={TOKEN:"cinepulse_trakt_token",USER:"cinepulse_trakt_user",SETTINGS:"cinepulse_trakt_settings",LAST_SYNC:"cinepulse_trakt_last_sync"};let pi=null,yr=null,vr=0;function Or(){return localStorage.getItem("cinepulse_trakt_custom_client_id")||eu}function Ol(){return localStorage.getItem("cinepulse_trakt_custom_client_secret")||tu}function ji(){try{const e=localStorage.getItem(ct.SETTINGS);if(e)return JSON.parse(e)}catch{}return{autoScrobble:!0,scrobbleThreshold:80,autoSyncOnLaunch:!0}}function co(e){const i={...ji(),...e};return localStorage.setItem(ct.SETTINGS,JSON.stringify(i)),i}const uo=15*60*1e3;let po=!1,pa=!1,Nl=0;function Hl(e){if(po){ei()&&ho(e);return}po=!0;const t=()=>{document.visibilityState!=="hidden"&&(Date.now()-Nl<uo||ho(e))};window.setTimeout(t,4e3),window.setInterval(t,uo),document.addEventListener("visibilitychange",t)}async function ho(e){if(!(!ji().autoSyncOnLaunch||!ei()||pa)){pa=!0,Nl=Date.now();try{(await Fl(e)).errors.length}catch{}finally{pa=!1}}}function ql(){try{const e=localStorage.getItem(ct.TOKEN);return e?JSON.parse(e):null}catch{return null}}function ei(){const e=ql();return!!(e&&e.access_token)}function iu(){try{const e=localStorage.getItem(ct.USER);return e?JSON.parse(e):null}catch{return null}}function nu(){const e=localStorage.getItem(ct.LAST_SYNC);return e?Number(e):null}async function yi(){const e=ql();if(!e||!e.access_token)return null;const t=Math.floor(Date.now()/1e3);if((e.created_at||0)+(e.expires_in||0)-t<86400&&e.refresh_token)try{const n=await su(e.refresh_token);if(n?.access_token)return n.access_token}catch{}return e.access_token}async function ru(){const e=Or(),t=await fetch(`${gt}/oauth/device/code`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({client_id:e})});if(!t.ok){const i=await t.text();throw new Error(`Device code error (${t.status}): ${i}`)}return await t.json()}function au(e,t=5,i=()=>{}){pi&&pi.abort(),pi=new AbortController;const{signal:n}=pi;return new Promise((r,a)=>{const o=Or(),s=Ol();let l=Math.max(t,5)*1e3;const d=async()=>{if(n.aborted){a(new Error("Auth polling cancelled"));return}try{const p=await fetch(`${gt}/oauth/device/token`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:e,client_id:o,client_secret:s}),signal:n});if(p.status===200){const f=await p.json();localStorage.setItem(ct.TOKEN,JSON.stringify(f));let b=null;try{b=await lu(f.access_token),b&&localStorage.setItem(ct.USER,JSON.stringify(b))}catch{}window.dispatchEvent(new CustomEvent("cinepulse_trakt_auth_changed",{detail:{connected:!0,user:b}})),r(f);return}if(p.status===400){i({status:"pending",message:"Kullanıcı onayı bekleniyor..."}),n.aborted||setTimeout(d,l);return}if(p.status===404)throw new Error("Geçersiz cihaz kodu.");if(p.status===409)throw new Error("Bu kod zaten kullanılmış.");if(p.status===410)throw new Error("Kodun süresi doldu. Lütfen tekrar deneyin.");if(p.status===429){l+=2e3,n.aborted||setTimeout(d,l);return}const h=await p.text();throw new Error(`Trakt auth failed: ${h}`)}catch(p){if(n.aborted)return;a(p)}};setTimeout(d,l)})}function Ka(){pi&&(pi.abort(),pi=null)}async function su(e){const t=Or(),i=Ol(),n=await fetch(`${gt}/oauth/token`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refresh_token:e,client_id:t,client_secret:i,grant_type:"refresh_token"})});if(!n.ok)throw new Error("Token refresh failed");const r=await n.json();return localStorage.setItem(ct.TOKEN,JSON.stringify(r)),r}function ou(){Ka(),localStorage.removeItem(ct.TOKEN),localStorage.removeItem(ct.USER),localStorage.removeItem(ct.LAST_SYNC),window.dispatchEvent(new CustomEvent("cinepulse_trakt_auth_changed",{detail:{connected:!1}}))}function Bt(e){return{"Content-Type":"application/json","trakt-api-version":"2","trakt-api-key":Or(),Authorization:`Bearer ${e}`}}async function lu(e=null){const t=e||await yi();if(!t)return null;const i=await fetch(`${gt}/users/me?extended=full`,{headers:Bt(t)});if(!i.ok)return null;const n=await i.json();return localStorage.setItem(ct.USER,JSON.stringify(n)),n}function _s(e,t=0){const i=Math.min(100,Math.max(0,Math.round(t))),n=e.tmdbId||e.id;return(e.isSeries===!0?!0:e.isSeries===!1||e.type==="movie"?!1:!!(e.type==="tv"||e.season&&Number(e.season)>0&&e.type!=="movie"))?{show:{title:e.seriesTitle||e.title||"",ids:{tmdb:Number(n)||void 0}},episode:{season:Math.max(1,Number(e.season)||1),number:Math.max(1,Number(e.episode)||1)},progress:i,app_version:"2.0.0",app_date:"2026-09-25"}:{movie:{title:e.title||"",ids:{tmdb:Number(n)||void 0}},progress:i,app_version:"2.0.0",app_date:"2026-09-25"}}async function Lm(e,t=0){if(!ji().autoScrobble||!ei())return null;const n=Date.now();if(yr==="start"&&n-vr<8e3)return null;const r=await yi();if(!r)return null;try{const a=_s(e,t),o=await fetch(`${gt}/scrobble/start`,{method:"POST",headers:Bt(r),body:JSON.stringify(a)});if(o.ok)return yr="start",vr=n,await o.json()}catch{}return null}async function Im(e,t=0){if(!ji().autoScrobble||!ei())return null;const n=await yi();if(!n)return null;try{const r=_s(e,t),a=await fetch(`${gt}/scrobble/pause`,{method:"POST",headers:Bt(n),body:JSON.stringify(r),keepalive:!0});if(a.ok)return yr="pause",vr=Date.now(),await a.json()}catch{}return null}async function Rm(e,t=100){if(!ji().autoScrobble||!ei())return null;const n=await yi();if(!n)return null;try{const r=_s(e,t),a=await fetch(`${gt}/scrobble/stop`,{method:"POST",headers:Bt(n),body:JSON.stringify(r),keepalive:!0});if(a.ok)return yr="stop",vr=Date.now(),await a.json()}catch{}return null}async function cu(e){const t=await yi();if(!t||!e||!e.length)return null;const i=[],n=new Map;for(const s of e){const l=s.tmdbId||s.id,d=Number(l);if(!d||isNaN(d))continue;const p=new Date(Number(s.lastWatchedAt)||s.lastWatchedAt||Date.now()),h=Number.isNaN(p.getTime())?new Date().toISOString():p.toISOString();if(s.type==="movie"?!1:!!(s.isSeries||s.type==="tv"||s.type==="anime")){const b=Math.max(1,Number(s.season)||1),v=Math.max(1,Number(s.episode)||1);n.has(d)||n.set(d,{title:s.title||"",ids:{tmdb:d},seasonsMap:new Map});const y=n.get(d);y.seasonsMap.has(b)||y.seasonsMap.set(b,[]),y.seasonsMap.get(b).push({number:v,watched_at:h})}else i.push({title:s.title||"",watched_at:h,ids:{tmdb:d}})}const r=Array.from(n.values()).map(s=>({title:s.title,ids:s.ids,seasons:Array.from(s.seasonsMap.entries()).map(([l,d])=>({number:l,episodes:d}))}));if(i.length===0&&r.length===0)return null;const a={};i.length>0&&(a.movies=i),r.length>0&&(a.shows=r);const o=await fetch(`${gt}/sync/history`,{method:"POST",headers:Bt(t),body:JSON.stringify(a)});if(!o.ok){const s=await o.text();throw new Error(`Trakt API Hatası (${o.status}): ${s}`)}return await o.json()}const du="4e44d9029b1270a757cddc766a1bcb63",ha=new Map;async function fa(e,t=!1){const i=`${t?"tv":"movie"}_${e}`;if(ha.has(i))return ha.get(i);try{const r=await fetch(`https://api.themoviedb.org/3/${t?"tv":"movie"}/${e}?api_key=${du}&language=tr-TR`);if(r.ok){const a=await r.json();return ha.set(i,a),a}}catch{}return null}async function fo(e,t){const i=[],n=new Set,r=e==="shows"?100:250;for(let a=1;;a++){const o=new URLSearchParams({page:String(a),limit:String(r)});e==="shows"&&o.set("extended","progress");const s=await fetch(`${gt}/sync/watched/${e}?${o}`,{headers:Bt(t)});if(!s.ok)throw new Error(`İzlenen ${e==="shows"?"diziler":"filmler"} alınamadı (${s.status})`);const l=await s.json();if(!Array.isArray(l))throw new Error("Trakt izlenenler yanıtı geçersiz");if(l.length===0)break;let d=0;for(const h of l){const f=h[e==="shows"?"show":"movie"]?.ids?.trakt;f&&n.has(f)||(f&&n.add(f),i.push(h),d++)}if(!d)break;const p=Number(s.headers?.get("X-Pagination-Page-Count"));if(p&&a>=p||!p&&l.length<r)break}return i}async function uu(e){const t=await yi();if(!t)return{importedPlaybackCount:0,importedHistoryCount:0};const{saveWatchProgress:i,saveBatchWatchProgress:n,getWatchHistory:r}=e;if(!i&&!n)return{importedPlaybackCount:0,importedHistoryCount:0};let a=0,o=0;const s=[],l=[],d=r?r():[],p=new Map;for(const h of d){const f=`${h.id}_${h.season||1}_${h.episode||1}`;p.set(f,h)}try{const h=await fetch(`${gt}/sync/playback?extended=full&limit=50`,{headers:Bt(t),signal:AbortSignal.timeout(8e3)});if(h.ok){const f=await h.json();if(Array.isArray(f)){for(const b of f){const v=b.type==="movie",y=v?b.movie:b.show||b.episode,k=v?b.movie?.ids?.tmdb||y?.ids?.tmdb:b.show?.ids?.tmdb||b.episode?.ids?.tmdb||y?.ids?.tmdb;if(!k)continue;const m=v?1:b.episode?.season||1,w=v?1:b.episode?.number||1,E=Math.min(99,Math.max(1,Math.round(b.progress||0))),C=b.paused_at?new Date(b.paused_at).getTime():Date.now(),S=`${k}_${m}_${w}`,T=p.get(S);let I=T?.poster_path||T?.posterPath||"",L=T?.backdrop_path||T?.backdropPath||"",D=T?.title||b.show?.title||y?.title||"",O=v?6600:3e3,Y={};if(!I||!D){const z=await fa(k,!v);z&&(I=z.poster_path||"",L=z.backdrop_path||"",D=z.title||z.name||D,z.runtime?O=z.runtime*60:z.episode_run_time?.[0]&&(O=z.episode_run_time[0]*60),v||(Y={number_of_episodes:z.number_of_episodes,number_of_seasons:z.number_of_seasons,status:z.status,seasons:z.seasons}))}const j=Math.max(60,Math.round(E/100*O));l.push({id:k,title:D,posterPath:I,backdropPath:L,type:v?"movie":"tv",isSeries:!v,season:v?void 0:m,episode:v?void 0:w,currentTime:j,duration:O,progressPercent:E,completed:!1,traktImported:!0,lastWatchedAt:C,...Y}),a++}l.length>0&&(n?n(l):i&&l.forEach(b=>i(b)),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{action:"playback_import",source:"trakt"}})))}}}catch(h){s.push(h.message)}try{{const h=await fo("movies",t);if(Array.isArray(h))for(let f=0;f<h.length;f+=5){const b=h.slice(f,f+5);await Promise.all(b.map(async v=>{const y=v.movie?.ids?.tmdb;if(!y)return;const k=`${y}_1_1`,m=p.get(k);if(m&&m.completed)return;const w=v.last_watched_at?new Date(v.last_watched_at).getTime():Date.now();let E=m?.poster_path||m?.posterPath||"",C=m?.backdrop_path||m?.backdropPath||"",S=m?.title||v.movie?.title||"",T=6600;if(!E||!S){const I=await fa(y,!1);I&&(E=I.poster_path||"",C=I.backdrop_path||"",S=I.title||S,I.runtime&&(T=I.runtime*60))}l.push({id:y,title:S,posterPath:E,backdropPath:C,type:"movie",isSeries:!1,currentTime:T,duration:T,progressPercent:100,completed:!0,traktImported:!0,lastWatchedAt:w}),o++}))}}}catch(h){s.push(h.message)}try{{const h=await fo("shows",t);if(Array.isArray(h))for(let f=0;f<h.length;f+=4){const b=h.slice(f,f+4);await Promise.all(b.map(async v=>{const y=v.show?.ids?.tmdb;if(!y)return;const k=v.show?.title||"",m=await fa(y,!0),w=m?.poster_path||"",E=m?.backdrop_path||"",C=m?.name||m?.title||k,S=m?.episode_run_time?.[0]?m.episode_run_time[0]*60:3e3,T={number_of_episodes:m?.number_of_episodes,number_of_seasons:m?.number_of_seasons,status:m?.status,seasons:m?.seasons},I=Array.isArray(v.seasons)?v.seasons:[];for(const L of I){const D=L.number,O=Array.isArray(L.episodes)?L.episodes:[];for(const Y of O){const j=Y.number,z=`${y}_${D}_${j}`,B=p.get(z);if(B&&B.completed)continue;const W=Y.last_watched_at?new Date(Y.last_watched_at).getTime():Date.now();l.push({id:y,title:C,posterPath:w,backdropPath:E,type:"tv",isSeries:!0,season:D,episode:j,currentTime:S,duration:S,progressPercent:100,completed:!0,traktImported:!0,lastWatchedAt:W,...T}),o++}}}))}}}catch(h){s.push(h.message)}if(l.length>0){if(n)n(l);else if(i)for(const h of l)i(h)}return window.dispatchEvent(new CustomEvent("cinepulse_data_changed",{detail:{action:"import",source:"trakt"}})),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{action:"import",source:"trakt"}})),{importedPlaybackCount:a,importedHistoryCount:o,errors:s}}async function Fl(e){if(!ei())throw new Error("Trakt hesabı bağlı değil");const{getWatchHistory:t,saveWatchProgress:i,saveBatchWatchProgress:n}=e,r={pushedMoviesCount:0,pushedEpisodesCount:0,importedPlaybackCount:0,importedHistoryCount:0,errors:[]};if(i||n)try{const a=await uu(e);r.importedPlaybackCount=a.importedPlaybackCount||0,r.importedHistoryCount=a.importedHistoryCount||0,r.errors.push(...a.errors||[])}catch(a){r.errors.push(`Trakt'tan aktarma: ${a.message}`)}try{const o=(t?t():[]).filter(s=>s.completed&&!s.traktImported);if(o.length>0){const s=await cu(o);if(s&&s.added){r.pushedMoviesCount=s.added.movies||0,r.pushedEpisodesCount=s.added.episodes||0;const l=Object.values(s.not_found||{}).reduce((d,p)=>d+(Array.isArray(p)?p.length:0),0);l&&r.errors.push(`Trakt ${l} içeriği katalogunda bulamadı`)}}}catch(a){r.errors.push(`Trakt'a gönderme: ${a.message||"Senkronizasyon hatası"}`)}return r.errors.length===0&&localStorage.setItem(ct.LAST_SYNC,String(Date.now())),r}async function pu(){const e=await yi();if(!e)throw new Error("Trakt hesabı bağlı değil");const t=await fetch(`${gt}/sync/history?limit=1000`,{headers:Bt(e)});if(!t.ok)throw new Error("Trakt geçmişi alınamadı");const i=await t.json();if(!Array.isArray(i)||i.length===0)return 0;const n=i.map(o=>o.id).filter(Boolean);if(n.length===0)return 0;const r=await fetch(`${gt}/sync/history/remove`,{method:"POST",headers:Bt(e),body:JSON.stringify({ids:n})});if(!r.ok){const o=await r.text();throw new Error(`Trakt geçmişi silinemedi: ${o}`)}const a=await r.json();return(a.deleted?.movies||0)+(a.deleted?.episodes||0)}let ai=null;function br(){let e=document.getElementById("trakt-modal");e||(e=document.createElement("div"),e.id="trakt-modal",e.className="modal-backdrop",document.body.appendChild(e));const t=(r="main",a={})=>{const o=ei(),s=iu(),l=ji(),d=nu();let p="Henüz yapılmadı";if(d){const h=new Date(d);p=`${h.toLocaleDateString("tr-TR")} ${h.toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})}`}if(r==="connecting"){const{userCode:h,verificationUrl:f,expiresIn:b}=a;e.innerHTML=`
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
              <a href="${f||"https://trakt.tv/activate"}" target="_blank" rel="noopener noreferrer" class="btn-primary trakt-btn-glow" style="padding: 0.75rem 1.6rem; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
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
      `;e.classList.remove("hidden"),document.body.style.overflow="hidden",V(e),n(r)},i=()=>{Ka(),e.classList.add("hidden"),e.innerHTML="",document.body.style.overflow="",ai&&(window.removeEventListener("keydown",ai),ai=null)},n=r=>{const a=document.getElementById("trakt-close-btn"),o=document.getElementById("trakt-close-footer-btn");if(a&&(a.onclick=i),o&&(o.onclick=i),e.onclick=s=>{s.target===e&&i()},ai&&window.removeEventListener("keydown",ai),ai=s=>{s.key==="Escape"&&i()},window.addEventListener("keydown",ai),r==="connecting"){const s=document.getElementById("btn-copy-trakt-code");s&&(s.onclick=()=>{const d=s.querySelector(".trakt-code-text")?.textContent;d&&navigator.clipboard.writeText(d).then(()=>{Z("Aktivasyon kodu kopyalandı!","success")}).catch(()=>{Z(`Kod: ${d}`,"info")})});const l=document.getElementById("btn-cancel-trakt-poll");l&&(l.onclick=()=>{Ka(),t("main")})}else{const s=document.getElementById("btn-start-trakt-connect");s&&(s.onclick=async()=>{s.disabled=!0,s.innerHTML="<span>Kod alınıyor...</span>";try{const v=await ru();t("connecting",{userCode:v.user_code,verificationUrl:v.verification_url,expiresIn:v.expires_in}),au(v.device_code,v.interval,y=>{const k=document.getElementById("trakt-poll-status-text");k&&(k.textContent=y.message)}).then(()=>{Z("Trakt.tv başarıyla bağlandı!","success"),t("main")}).catch(y=>{y.message!=="Auth polling cancelled"&&(Z(`Bağlantı hatası: ${y.message}`,"error"),t("main"))})}catch(v){Z(`Trakt bağlantı başlatılamadı: ${v.message}`,"error"),t("main")}});const l=document.getElementById("btn-trakt-sync-now");l&&(l.onclick=async()=>{const v=document.getElementById("trakt-sync-icon"),y=document.getElementById("trakt-sync-result");l.disabled=!0,v&&v.classList.add("trakt-spin");try{const k=await Fl({getWatchHistory:Be,saveWatchProgress:ms,saveBatchWatchProgress:Tl});y&&(y.style.display="block",y.innerHTML=`
                <strong>${k.errors.length?"Senkronizasyon kısmen tamamlandı":"✓ Karşılıklı senkronizasyon tamamlandı!"}</strong><br/>
                • ${k.pushedMoviesCount} film & ${k.pushedEpisodesCount} dizi Trakt'a yüklendi<br/>
                • ${k.importedPlaybackCount} yarım kalan & ${k.importedHistoryCount} izlenen Trakt'tan CinePulse'a aktarıldı
              `),k.errors.length?Z(`Trakt senkronizasyon uyarısı: ${k.errors.join("; ")}`,"error"):(Z("CinePulse ve Trakt başarıyla karşılıklı eşitlendi!","success"),setTimeout(()=>t("main"),2500))}catch(k){Z(`Aktarım hatası: ${k.message}`,"error")}finally{l.disabled=!1,v&&v.classList.remove("trakt-spin")}});const d=document.getElementById("btn-clean-trakt-history");d&&(d.onclick=()=>{const v=Td();Z(`${v} adet hatalı Trakt kaydı geçmişten temizlendi!`,"success"),t("main")});const p=document.getElementById("btn-wipe-trakt-history");p&&(p.onclick=async()=>{if(confirm("Trakt.tv hesabınızdaki tüm izleme geçmişini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")){p.disabled=!0,p.innerHTML="<span>Sıfırlanıyor...</span>";try{const v=await pu();Z(`Trakt hesabından ${v} adet kayıt tamamen silindi!`,"success"),t("main")}catch(v){Z(`Hata: ${v.message}`,"error"),p.disabled=!1,t("main")}}});const h=document.getElementById("trakt-toggle-autosync");h&&(h.onchange=v=>{co({autoSyncOnLaunch:v.target.checked}),Z(v.target.checked?"Açılışta otomatik eşitleme açıldı":"Açılışta otomatik eşitleme kapatıldı","info")});const f=document.getElementById("trakt-toggle-scrobble");f&&(f.onchange=v=>{co({autoScrobble:v.target.checked}),Z(v.target.checked?"Otomatik Scrobble açıldı":"Otomatik Scrobble kapatıldı","info")});const b=document.getElementById("btn-trakt-disconnect");b&&(b.onclick=()=>{confirm("Trakt.tv bağlantısını kesmek istediğinize emin misiniz?")&&(ou(),Z("Trakt.tv bağlantısı kesildi","info"),t("main"))})}};t("main")}function Ul(){const e=document.getElementById("data-modal");if(!e)return;const t=Dd();e.innerHTML=`
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
            <div>• Bağlantı: <strong>${ei()?'<span style="color:#4ade80;">● Bağlı</span>':'<span style="color:#94a3b8;">○ Bağlı Değil</span>'}</strong></div>
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
  `,e.classList.remove("hidden"),document.body.style.overflow="hidden",V();const i=document.getElementById("data-close-btn"),n=document.getElementById("data-close-footer-btn");let r=null;const a=()=>{e.classList.add("hidden"),e.innerHTML="",document.body.style.overflow="",r&&(window.removeEventListener("keydown",r),r=null)};i&&i.addEventListener("click",a),n&&n.addEventListener("click",a),e.onclick=f=>{f.target===e&&a()},r=f=>{f.key==="Escape"&&a()},window.addEventListener("keydown",r);const o=document.getElementById("btn-export-json");o&&o.addEventListener("click",()=>{$l(),Z("JSON yedek dosyası indirildi!","success")});const s=document.getElementById("btn-open-trakt-from-data");s&&s.addEventListener("click",()=>{a(),br()});const l=document.getElementById("json-dropzone"),d=document.getElementById("json-file-input");l&&d&&(l.addEventListener("click",()=>d.click()),l.addEventListener("dragover",f=>{f.preventDefault(),l.style.borderColor="var(--accent-green)"}),l.addEventListener("dragleave",()=>{l.style.borderColor="rgba(99, 102, 241, 0.4)"}),l.addEventListener("drop",f=>{f.preventDefault(),l.style.borderColor="rgba(99, 102, 241, 0.4)",f.dataTransfer.files.length>0&&p(f.dataTransfer.files[0])}),d.addEventListener("change",f=>{f.target.files.length>0&&p(f.target.files[0])}));function p(f){if(!f)return;const b=new FileReader;b.onload=v=>{try{const y=document.querySelector('input[name="import-mode"]:checked'),k=y?y.value:"merge",m=Ml(v.target.result,k);m.success?(Z(`✓ Yedek yüklendi! (${m.countHistory} izleme kaydı, ${m.countFavs} favori aktarıldı)`,"success"),a()):Z(`Yükleme hatası: ${m.message||m.error}`,"error")}catch(y){Z(`Yedek dosyası işlenirken hata oluştu: ${y.message}`,"error")}},b.onerror=()=>{Z("Dosya okunamadı.","error")},b.readAsText(f)}const h=document.getElementById("btn-clear-all-data");h&&h.addEventListener("click",()=>{confirm("Tüm izleme geçmişinizi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!")&&(zd(),Z("Tüm yerel veriler temizlendi.","info"),a())})}let Ii=null,cn=!1;function wr(){return window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===!0||document.referrer.includes("android-app://")}function hu(){if(wr()){cn=!0,Vi(!1);return}window.addEventListener("beforeinstallprompt",t=>{t.preventDefault(),Ii=t,Vi(!0)}),window.addEventListener("appinstalled",()=>{Ii=null,cn=!0,Vi(!1),Z("CinePulse başarıyla cihazınıza yüklendi!","success")}),window.matchMedia("(display-mode: standalone)").addEventListener("change",t=>{t.matches&&(cn=!0,Vi(!1))}),/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream&&!wr()&&setTimeout(()=>{Vi(!0)},1e3)}function Vi(e){document.querySelectorAll(".btn-pwa-install").forEach(i=>{e&&!cn&&!wr()?i.classList.remove("hidden"):i.classList.add("hidden")})}async function fu(){if(wr()||cn){Z("CinePulse zaten bir uygulama olarak yüklü.","info");return}if(Ii){try{Ii.prompt(),(await Ii.userChoice).outcome==="accepted"?Z("Yükleme başlatıldı...","success"):Z("Yükleme iptal edildi.","info"),Ii=null}catch{}return}/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream?mu():gu()}function mu(){let e=document.getElementById("pwa-ios-modal");e||(e=document.createElement("div"),e.id="pwa-ios-modal",e.className="modal-backdrop pwa-guide-modal",e.innerHTML=`
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
    `,document.body.appendChild(e),e.querySelector(".pwa-close-btn").addEventListener("click",()=>{e.classList.add("hidden")}),e.querySelector(".pwa-done-btn").addEventListener("click",()=>{e.classList.add("hidden")}),e.addEventListener("click",t=>{t.target===e&&e.classList.add("hidden")})),e.classList.remove("hidden")}function gu(){Z('Tarayıcınızın adres çubuğundaki "Yükle / Uygulamayı Yükle" simgesine tıklayarak indirebilirsiniz.',"info",5e3)}const mo="1.1.6",yu="https://raw.githubusercontent.com/caca1403/cine-pulse/main/public/version.json",jl="cinepulse_update_snoozed_until";function fi(){return typeof window>"u"?!1:!!(window.Capacitor?.isNativePlatform?.()||window.Capacitor?.getPlatform?.()==="android"||navigator.userAgent.includes("CinePulseAndroid"))}function vu(e,t){if(!e||!t)return!1;const i=d=>String(d).replace(/^v/i,"").split(".").map(p=>parseInt(p,10)||0),[n,r,a]=i(e),[o,s,l]=i(t);return n>o||n===o&&r>s||n===o&&r===s&&a>l}function bu(e){if(document.getElementById("cinepulse-update-modal"))return;const t=e.downloadUrl||"https://cine-pulse.vercel.app/api/download_apk",i=e.githubDownloadUrl||"https://github.com/caca1403/cine-pulse/releases/latest",n=document.createElement("div");n.id="cinepulse-update-modal",n.className="cinepulse-modal-overlay",n.style.cssText=`
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
  `;const r=(e.releaseNotes||"Performans iyileştirmeleri ve hata düzeltmeleri.").split(`
`).filter(Boolean).map(d=>`<li style="margin-bottom: 0.45rem;">${go(d.replace(/^[•\-\*]\s*/,""))}</li>`).join("");n.innerHTML=`
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
        ${go(e.title||`CinePulse v${e.version}`)}
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
        margin-bottom: 1.3rem;
        max-height: 140px;
        overflow-y: auto;
      ">
        <div style="font-size: 0.76rem; font-weight: 700; color: #cbd5e1; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.04em;">
          Yenilikler:
        </div>
        <ul style="margin: 0; padding-left: 1.1rem; font-size: 0.84rem; color: #94a3b8; line-height: 1.45;">
          ${r}
        </ul>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; flex-direction: column; gap: 0.65rem;">
        <a id="btn-update-download" href="${t}" download="cinepulse.apk" target="_blank" rel="noopener noreferrer" style="
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
          <span>Hemen İndir (Hızlı Sunucu)</span>
        </a>

        <a id="btn-update-github" href="${i}" target="_blank" rel="noopener noreferrer" style="
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #cbd5e1;
          font-weight: 600;
          font-size: 0.84rem;
          padding: 0.65rem 1.2rem;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.2s ease;
        ">
          <i data-lucide="external-link" style="width: 15px; height: 15px;"></i>
          <span>GitHub Releases (Yedek)</span>
        </a>

        ${e.mandatory?"":`
          <button id="btn-update-later" type="button" style="
            background: transparent;
            border: none;
            color: #64748b;
            font-size: 0.84rem;
            font-weight: 600;
            padding: 0.4rem;
            cursor: pointer;
            transition: color 0.2s ease;
          ">
            Daha Sonra Hatırlat
          </button>
        `}
      </div>

      <div style="margin-top: 1rem; padding: 0.65rem 0.85rem; border-radius: 12px; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.2); text-align: left; font-size: 0.76rem; color: #fde68a; line-height: 1.4;">
        <div style="font-weight: 700; margin-bottom: 0.2rem; display: flex; align-items: center; gap: 0.35rem; color: #fbbf24;">
          <i data-lucide="info" style="width: 13px; height: 13px;"></i>
          <span>İndirme İpucu</span>
        </div>
        Chrome tarayıcısında <em>"Zararlı dosya olabilir"</em> uyarısı çıkarsa bildirim çubuğunu indirip <strong>"Yine de indir"</strong> butonuna basarak indirmeyi tamamlayabilirsiniz.
      </div>
    </div>
  `,document.body.appendChild(n),V(n);const a=n.querySelector("#btn-update-later");a&&a.addEventListener("click",()=>{try{localStorage.setItem(jl,String(Date.now()+12*60*60*1e3))}catch{}n.remove()});const o=d=>{if(Z("APK indirmesi başlatılıyor...","info"),fi())try{window.open(d,"_system")||(window.location.href=d)}catch{window.location.href=d}else try{const p=document.createElement("a");p.href=d,p.download="cinepulse.apk",p.target="_blank",p.rel="noopener noreferrer",document.body.appendChild(p),p.click(),setTimeout(()=>p.remove(),1e3)}catch{window.location.href=d}setTimeout(()=>{try{n.remove()}catch{}},2e3)},s=n.querySelector("#btn-update-download");s&&s.addEventListener("click",d=>{fi()&&d.preventDefault(),o(t)});const l=n.querySelector("#btn-update-github");l&&l.addEventListener("click",d=>{fi()&&(d.preventDefault(),o(i))})}function go(e=""){return String(e).replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t])}async function Kl({manual:e=!1}={}){if(!e)try{const t=parseInt(localStorage.getItem(jl)||"0",10);if(Date.now()<t)return null}catch{}try{const t=await fetch(`${yu}?_t=${Date.now()}`,{signal:AbortSignal.timeout(6e3),cache:"no-store"});if(!t.ok)throw new Error(`HTTP ${t.status}`);const i=await t.json();if(i&&vu(i.version,mo))return bu(i),i;if(e)return Z(`✓ CinePulse güncel (v${mo})`,"success"),null}catch{return e&&Z("Güncelleme sunucusuna erişilemedi.","error"),null}}function wu(){typeof window>"u"||window.setTimeout(()=>{Kl({manual:!1}).catch(()=>{})},4e3)}let Xn=null;function ku(){qt();const e=document.createElement("div");e.id="profile-modal-root",e.className="profile-backdrop",document.body.appendChild(e),Xn=e;const t=(n="select")=>{const r=Jt(),a=xn();n==="select"?e.innerHTML=`
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
            ${r.map(y=>{const k=y.id===a.id,m=y.id!=="prof_1";return`
                <div class="profile-card-wrapper">
                  <div class="profile-card ${k?"is-active":""}" data-profile-id="${y.id}">
                    <div class="profile-avatar-wrap" style="border-color: ${y.color||"#f59e0b"}; background: ${y.color||"#f59e0b"}22;">
                      <i data-lucide="${y.avatar||"user"}" style="width: 44px; height: 44px; color: ${y.color||"#f59e0b"};"></i>
                      ${k?`
                        <div class="profile-active-check">
                          <i data-lucide="check" style="width: 14px; height: 14px;"></i>
                        </div>
                      `:""}
                    </div>
                    <span class="profile-name">${y.name}</span>
                    ${y.isKid?'<span class="profile-kid-badge">Çocuk</span>':""}
                  </div>
                  ${m?`
                    <button class="btn-delete-profile" data-delete-id="${y.id}" title="Profili Sil">
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
            ${fi()?`
              <button class="btn-manage-profiles" id="btn-modal-check-update" title="Güncellemeleri Denetle">
                <i data-lucide="refresh-cw" style="width: 15px; height: 15px; color: #10b981;"></i>
                <span>Güncelleme</span>
              </button>
            `:`
              <a class="btn-manage-profiles" id="btn-modal-apk-download" href="https://cine-pulse.vercel.app/api/download_apk" download="cinepulse.apk" target="_blank" rel="noopener noreferrer" title="Android APK İndir" style="text-decoration: none;">
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
                ${["#f59e0b","#38bdf8","#ec4899","#10b981","#a855f7","#ef4444"].map((y,k)=>`
                  <button type="button" class="color-dot ${k===0?"active":""}" data-color="${y}" style="background: ${y};"></button>
                `).join("")}
              </div>
            </div>

            <div class="profile-form-actions">
              <button type="button" class="btn-secondary" id="btn-back-to-profiles">İptal</button>
              <button type="submit" class="btn-primary">Kaydet & Oluştur</button>
            </div>
          </form>
        </div>
      `),V(e);const o=e.querySelector("#btn-close-profile-modal");o&&(o.onclick=()=>qt());const s=e.querySelector("#btn-show-add-profile");s&&(s.onclick=()=>t("add")),e.querySelectorAll(".btn-delete-profile").forEach(y=>{y.onclick=k=>{k.stopPropagation();const m=y.getAttribute("data-delete-id"),w=Jt().find(C=>C.id===m);if(!w||!confirm(`"${w.name}" profilini silmek istediğinize emin misiniz?`))return;bd(m)?(Z(`"${w.name}" profili silindi.`,"info"),t("select")):Z("Bu profil silinemez.","error")}});const l=e.querySelector("#btn-modal-open-trakt");l&&(l.onclick=()=>{qt(),br()});const d=e.querySelector("#btn-modal-open-backup");d&&(d.onclick=()=>{qt(),Ul()});const p=e.querySelector("#btn-modal-pwa-install");p&&(p.onclick=()=>{fu()});const h=e.querySelector("#btn-modal-check-update");h&&(h.onclick=()=>{Kl({manual:!0})}),e.querySelectorAll(".profile-card[data-profile-id]").forEach(y=>{y.onclick=()=>{const k=y.getAttribute("data-profile-id");if(k){const m=Jt().find(w=>w.id===k);cr(k),qt(),yo(m)}}});const f=e.querySelector("#btn-cancel-add-profile");f&&(f.onclick=()=>t("select"));const b=e.querySelector("#btn-back-to-profiles");b&&(b.onclick=()=>t("select"));const v=e.querySelector("#form-add-profile");if(v){let y="#f59e0b";v.querySelectorAll(".color-dot").forEach(k=>{k.onclick=()=>{v.querySelectorAll(".color-dot").forEach(m=>m.classList.remove("active")),k.classList.add("active"),y=k.getAttribute("data-color")}}),v.onsubmit=k=>{k.preventDefault();const m=v.querySelector("#new-profile-name"),w=v.querySelector("#new-profile-kid-check"),E=m?m.value.trim():"",C=w?w.checked:!1;if(E){const S=vd({name:E,isKid:C,avatar:C?"smile":"user",color:y});cr(S.id),qt(),yo(S)}}}};t("select"),e.onclick=n=>{n.target===e&&qt()};const i=n=>{n.key==="Escape"&&(qt(),window.removeEventListener("keydown",i))};window.addEventListener("keydown",i)}function qt(){if(Xn){try{Xn.remove()}catch{}Xn=null}}function yo(e){const t=document.getElementById("profile-switch-curtain");t&&t.remove();const i=document.createElement("div");i.id="profile-switch-curtain",i.className="profile-switch-curtain is-entering",i.innerHTML=`
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
  `,document.body.appendChild(i),V(i),window.dispatchEvent(new CustomEvent("sineflix_profile_changed",{detail:{profile:e}})),setTimeout(()=>{i.classList.remove("is-entering"),i.classList.add("is-leaving"),setTimeout(()=>{i.remove()},450)},600)}const _u="modulepreload",Su=function(e,t){return new URL(e,t).href},vo={},Ss=function(t,i,n){let r=Promise.resolve();if(i&&i.length>0){const o=document.getElementsByTagName("link"),s=document.querySelector("meta[property=csp-nonce]"),l=s?.nonce||s?.getAttribute("nonce");r=Promise.allSettled(i.map(d=>{if(d=Su(d,n),d in vo)return;vo[d]=!0;const p=d.endsWith(".css"),h=p?'[rel="stylesheet"]':"";if(!!n)for(let v=o.length-1;v>=0;v--){const y=o[v];if(y.href===d&&(!p||y.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${h}`))return;const b=document.createElement("link");if(b.rel=p?"stylesheet":_u,p||(b.as="script"),b.crossOrigin="",b.href=d,l&&b.setAttribute("nonce",l),document.head.appendChild(b),p)return new Promise((v,y)=>{b.addEventListener("load",v),b.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${d}`)))})}))}function a(o){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=o,window.dispatchEvent(s),!s.defaultPrevented)throw o}return r.then(o=>{for(const s of o||[])s.status==="rejected"&&a(s.reason);return t().catch(a)})};async function Qt(e){return(await Ss(()=>import("./PlayerModal-B6Djv0t2.js"),__vite__mapDeps([0,1]),import.meta.url)).openPlayerModal(e)}let $i=null,Wa=null;const Gi=e=>String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),bo=[{label:"🎲 Karışık / Farketmez",id:null},{label:"💥 Aksiyon",movie:28,tv:10759},{label:"🚀 Bilim Kurgu & Fantastik",movie:878,tv:10765},{label:"😂 Komedi",movie:35,tv:35},{label:"🩸 Korku & Gerilim",movie:27,tv:9648},{label:"🎭 Dram",movie:18,tv:18},{label:"🕵️ Suç & Gizem",movie:80,tv:9648},{label:"🎌 Animasyon & Anime",movie:16,tv:16},{label:"💖 Romantik",movie:10749,tv:10749},{label:"🌍 Belgesel",movie:99,tv:99}];function wo({type:e="all"}={}){_i();const t=document.createElement("div");t.id="random-picker-modal-root",t.className="random-picker-backdrop",document.body.appendChild(t),$i=t;let i=e==="tv"?"tv":"all",n=0,r=7;t.innerHTML=`
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
            ${bo.map((b,v)=>`
              <button class="random-pill-btn ${v===0?"active":""}" data-genre-idx="${v}">${b.label}</button>
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
  `,V(t);const a=t.querySelector("#btn-close-random-picker");a&&(a.onclick=()=>_i()),t.onclick=b=>{b.target===t&&_i()};const o=b=>{b.key==="Escape"&&_i()};window.addEventListener("keydown",o),Wa=()=>window.removeEventListener("keydown",o);const s=t.querySelectorAll("#random-type-pills .random-pill-btn");s.forEach(b=>{b.onclick=()=>{s.forEach(v=>v.classList.remove("active")),b.classList.add("active"),i=b.getAttribute("data-type")}});const l=t.querySelectorAll("#random-rating-pills .random-pill-btn");l.forEach(b=>{b.onclick=()=>{l.forEach(v=>v.classList.remove("active")),b.classList.add("active"),r=parseFloat(b.getAttribute("data-rating")||"0")}});const d=t.querySelectorAll("#random-genre-pills .random-pill-btn");d.forEach(b=>{b.onclick=()=>{d.forEach(v=>v.classList.remove("active")),b.classList.add("active"),n=parseInt(b.getAttribute("data-genre-idx"),10)}});const p=t.querySelector("#btn-spin-wheel"),h=t.querySelector("#random-spin-stage"),f=async()=>{p&&(p.disabled=!0,p.classList.add("is-spinning")),h.innerHTML=`
      <div class="random-roulette-box">
        <div class="roulette-glow-ring"></div>
        <div class="roulette-roller" id="roulette-roller">
          <div class="roulette-reel-text">Adaylar Karıştırılıyor... 🎲</div>
        </div>
      </div>
    `;let b=i;b==="all"&&(b=Math.random()>.5?"movie":"tv");let v=null;const y=bo[n];y&&(v=b==="movie"?y.movie:y.tv);const k=Math.floor(Math.random()*3)+1;let m;try{m=await zl({type:b,genreId:v,minRating:r,page:k,sortBy:"popularity.desc"})}catch{m=[]}if($i!==t)return;const w=(m||[]).filter(ie=>ie&&(ie.title||ie.name)&&(ie.poster_path||ie.backdrop_path));if(!w||w.length===0){h.innerHTML=`
        <div class="random-idle-placeholder">
          <i data-lucide="frown" style="width: 40px; height: 40px; color: #ef4444;"></i>
          <span>Bu kriterlere uygun yapım bulunamadı. Lütfen filtreleri gevşetip tekrar deneyin.</span>
        </div>
      `,V(h),p&&(p.disabled=!1,p.classList.remove("is-spinning"));return}const E=h.querySelector("#roulette-roller"),C=8;for(let ie=0;ie<C;ie++){const te=w[Math.floor(Math.random()*w.length)],re=te.title||te.name||"Öneri Aranıyor";if(E&&(E.innerHTML=`<div class="roulette-reel-text animate-pulse">${Gi(re)}</div>`),await new Promise(N=>setTimeout(N,120+ie*25)),$i!==t)return}const S=w[Math.floor(Math.random()*w.length)],T=S.title||S.name||"Seçilen Yapım",I=S.original_title||S.original_name||T,L=lt(S.poster_path,et.POSTER_MEDIUM),D=S.vote_average?Number(S.vote_average).toFixed(1):"—",O=(S.release_date||S.first_air_date||"").substring(0,4),Y=S.overview&&S.overview.trim().length>10?S.overview:"Harika bir izleme deneyimi sunan sürpriz bir öneri!",j=b==="movie"?"movie":"tv";h.innerHTML=`
      <div class="random-winner-card">
        <div class="winner-poster-wrap">
          <img src="${L}" alt="${Gi(T)}" class="winner-poster" />
          <div class="winner-rating-pill">⭐ ${D}</div>
        </div>
        <div class="winner-details-wrap">
          <div class="winner-badge-row">
            <span class="winner-tag-type">${j==="movie"?"FİLM":"DİZİ"}</span>
            ${O?`<span class="winner-tag-year">${Gi(O)}</span>`:""}
            <span class="winner-tag-match">Popüler öneri</span>
          </div>
          <h3 class="winner-title">${Gi(T)}</h3>
          <p class="winner-overview">${Gi(Y)}</p>
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
    `,V(h);const z=h.querySelector("#btn-winner-play");z&&(z.onclick=()=>{_i(),Qt({type:j,tmdbId:S.id,title:T,originalTitle:I,posterPath:S.poster_path,backdropPath:S.backdrop_path,season:1,episode:1})});const B=h.querySelector("#btn-winner-detail");B&&(B.onclick=()=>{_i(),window.location.hash=`#detail?type=${j}&id=${S.id}`});const W=h.querySelector("#btn-winner-retry");W&&(W.onclick=()=>{f()}),p&&(p.disabled=!1,p.classList.remove("is-spinning"),p.innerHTML='<i data-lucide="refresh-cw" style="width: 17px; height: 17px;"></i> <span>Başka Bir Tane Öner</span>',V(p))};p&&(p.onclick=()=>f()),f()}function _i(){if(Wa?.(),Wa=null,$i){try{$i.remove()}catch{}$i=null}}let Zn=null;const ma=[{id:"notif_1",title:"Yeni Bölüm Yayında! ⚔️",message:"Kuruluş Osman 6. Sezon 1. Bölüm Full HD olarak platforma eklendi.",time:"12 dk önce",isUnread:!0,type:"tv",tmdbId:"95557",badge:"YENİ BÖLÜM"},{id:"notif_2",title:"Özel Sinema Gösterimi 🍿",message:"Dune: Çöl Gezegeni Bölüm İki - 4K Ultra HD Türkçe Dublaj & Altyazılı yayında!",time:"2 saat önce",isUnread:!0,type:"movie",tmdbId:"693134",badge:"4K VİZYON"},{id:"notif_3",title:"Yeni Anime Bölümü ⚡",message:"Demon Slayer: Hashira Training Arc - Türkçe Altyazılı yeni bölüm izlenmeye hazır.",time:"Dün",isUnread:!1,type:"tv",tmdbId:"85937",badge:"ANİME"},{id:"notif_4",title:"Canlı TV Güncellemesi 📺",message:"Elektronik Program Rehberi (EPG), PiP Mini-Player ve HLS Kalite Menüsü aktif edildi.",time:"2 gün önce",isUnread:!1,type:"livetv",badge:"GÜNCELLEME"}];function Wl(){try{if(typeof window>"u"||!window.localStorage)return ma;const e=localStorage.getItem("sineflix_notifications_v1");return e?JSON.parse(e):ma}catch{return ma}}function ko(e){try{if(typeof window>"u"||!window.localStorage)return;localStorage.setItem("sineflix_notifications_v1",JSON.stringify(e)),window.dispatchEvent(new CustomEvent("sineflix_notifications_updated"))}catch{}}function Yl(){return Wl().filter(t=>t.isUnread).length}function xu(){Pn();const e=document.createElement("div");e.id="notification-modal-root",e.className="notif-backdrop",document.body.appendChild(e),Zn=e;const t=Wl();e.innerHTML=`
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
        ${t.map(r=>`
          <div class="notif-item ${r.isUnread?"unread":""}" data-notif-id="${r.id}" data-type="${r.type||""}" data-tmdb-id="${r.tmdbId||""}">
            <div class="notif-item-left">
              <span class="notif-tag">${r.badge||"HABER"}</span>
              <span class="notif-time">${r.time}</span>
            </div>
            <h4 class="notif-item-title">${r.title}</h4>
            <p class="notif-item-msg">${r.message}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `,V(e);const i=e.querySelector("#btn-close-notif");i&&(i.onclick=()=>Pn()),e.onclick=r=>{r.target===e&&Pn()};const n=e.querySelector("#btn-mark-all-read");n&&(n.onclick=()=>{const r=t.map(a=>({...a,isUnread:!1}));ko(r),e.querySelectorAll(".notif-item.unread").forEach(a=>a.classList.remove("unread")),Z("Tüm bildirimler okundu olarak işaretlendi","info"),_o()}),e.querySelectorAll(".notif-item").forEach(r=>{r.onclick=()=>{const a=r.getAttribute("data-notif-id"),o=r.getAttribute("data-type"),s=r.getAttribute("data-tmdb-id"),l=t.map(d=>d.id===a?{...d,isUnread:!1}:d);ko(l),r.classList.remove("unread"),_o(),Pn(),o==="livetv"?window.location.hash="#livetv":s&&(window.location.hash=`#detail?type=${o}&id=${s}`)}})}function Pn(){if(Zn){try{Zn.remove()}catch{}Zn=null}}function _o(){const e=document.getElementById("nav-notif-badge");if(!e)return;const t=Yl();t>0?(e.textContent=t,e.classList.remove("hidden")):e.classList.add("hidden")}function Vl(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function Eu(e){if(e.__esModule)return e;var t=e.default;if(typeof t=="function"){var i=function n(){return this instanceof n?Reflect.construct(t,arguments,this.constructor):t.apply(this,arguments)};i.prototype=t.prototype}else i={};return Object.defineProperty(i,"__esModule",{value:!0}),Object.keys(e).forEach(function(n){var r=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(i,n,r.get?r:{enumerable:!0,get:function(){return e[n]}})}),i}var Ya={exports:{}},ga,So;function Tu(){if(So)return ga;So=1;var e=1e3,t=e*60,i=t*60,n=i*24,r=n*7,a=n*365.25;ga=function(p,h){h=h||{};var f=typeof p;if(f==="string"&&p.length>0)return o(p);if(f==="number"&&isFinite(p))return h.long?l(p):s(p);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(p))};function o(p){if(p=String(p),!(p.length>100)){var h=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(p);if(h){var f=parseFloat(h[1]),b=(h[2]||"ms").toLowerCase();switch(b){case"years":case"year":case"yrs":case"yr":case"y":return f*a;case"weeks":case"week":case"w":return f*r;case"days":case"day":case"d":return f*n;case"hours":case"hour":case"hrs":case"hr":case"h":return f*i;case"minutes":case"minute":case"mins":case"min":case"m":return f*t;case"seconds":case"second":case"secs":case"sec":case"s":return f*e;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return f;default:return}}}}function s(p){var h=Math.abs(p);return h>=n?Math.round(p/n)+"d":h>=i?Math.round(p/i)+"h":h>=t?Math.round(p/t)+"m":h>=e?Math.round(p/e)+"s":p+"ms"}function l(p){var h=Math.abs(p);return h>=n?d(p,h,n,"day"):h>=i?d(p,h,i,"hour"):h>=t?d(p,h,t,"minute"):h>=e?d(p,h,e,"second"):p+" ms"}function d(p,h,f,b){var v=h>=f*1.5;return Math.round(p/f)+" "+b+(v?"s":"")}return ga}function Au(e){i.debug=i,i.default=i,i.coerce=l,i.disable=o,i.enable=r,i.enabled=s,i.humanize=Tu(),i.destroy=d,Object.keys(e).forEach(p=>{i[p]=e[p]}),i.names=[],i.skips=[],i.formatters={};function t(p){let h=0;for(let f=0;f<p.length;f++)h=(h<<5)-h+p.charCodeAt(f),h|=0;return i.colors[Math.abs(h)%i.colors.length]}i.selectColor=t;function i(p){let h,f=null,b,v;function y(...k){if(!y.enabled)return;const m=y,w=Number(new Date),E=w-(h||w);m.diff=E,m.prev=h,m.curr=w,h=w,k[0]=i.coerce(k[0]),typeof k[0]!="string"&&k.unshift("%O");let C=0;k[0]=k[0].replace(/%([a-zA-Z%])/g,(T,I)=>{if(T==="%%")return"%";C++;const L=i.formatters[I];if(typeof L=="function"){const D=k[C];T=L.call(m,D),k.splice(C,1),C--}return T}),i.formatArgs.call(m,k),(m.log||i.log).apply(m,k)}return y.namespace=p,y.useColors=i.useColors(),y.color=i.selectColor(p),y.extend=n,y.destroy=i.destroy,Object.defineProperty(y,"enabled",{enumerable:!0,configurable:!1,get:()=>f!==null?f:(b!==i.namespaces&&(b=i.namespaces,v=i.enabled(p)),v),set:k=>{f=k}}),typeof i.init=="function"&&i.init(y),y}function n(p,h){const f=i(this.namespace+(typeof h>"u"?":":h)+p);return f.log=this.log,f}function r(p){i.save(p),i.namespaces=p,i.names=[],i.skips=[];const h=(typeof p=="string"?p:"").trim().replace(/\s+/g,",").split(",").filter(Boolean);for(const f of h)f[0]==="-"?i.skips.push(f.slice(1)):i.names.push(f)}function a(p,h){let f=0,b=0,v=-1,y=0;for(;f<p.length;)if(b<h.length&&(h[b]===p[f]||h[b]==="*"))h[b]==="*"?(v=b,y=f,b++):(f++,b++);else if(v!==-1)b=v+1,y++,f=y;else return!1;for(;b<h.length&&h[b]==="*";)b++;return b===h.length}function o(){const p=[...i.names,...i.skips.map(h=>"-"+h)].join(",");return i.enable(""),p}function s(p){for(const h of i.skips)if(a(p,h))return!1;for(const h of i.names)if(a(p,h))return!0;return!1}function l(p){return p instanceof Error?p.stack||p.message:p}function d(){}return i.enable(i.load()),i}var Cu=Au;(function(e,t){var i={};t.formatArgs=r,t.save=a,t.load=o,t.useColors=n,t.storage=s(),t.destroy=(()=>{let d=!1;return()=>{d||(d=!0)}})(),t.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"];function n(){if(typeof window<"u"&&window.process&&(window.process.type==="renderer"||window.process.__nwjs))return!0;if(typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;let d;return typeof document<"u"&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent&&(d=navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/))&&parseInt(d[1],10)>=31||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)}function r(d){if(d[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+d[0]+(this.useColors?"%c ":" ")+"+"+e.exports.humanize(this.diff),!this.useColors)return;const p="color: "+this.color;d.splice(1,0,p,"color: inherit");let h=0,f=0;d[0].replace(/%[a-zA-Z%]/g,b=>{b!=="%%"&&(h++,b==="%c"&&(f=h))}),d.splice(f,0,p)}t.log=console.debug||console.log||(()=>{});function a(d){try{d?t.storage.setItem("debug",d):t.storage.removeItem("debug")}catch{}}function o(){let d;try{d=t.storage.getItem("debug")||t.storage.getItem("DEBUG")}catch{}return!d&&typeof process<"u"&&"env"in process&&(d=i.DEBUG),d}function s(){try{return localStorage}catch{}}e.exports=Cu(t);const{formatters:l}=e.exports;l.j=function(d){try{return JSON.stringify(d)}catch(p){return"[UnexpectedJSONParseError]: "+p.message}}})(Ya,Ya.exports);var Nr=Ya.exports,xs={exports:{}},Mi=typeof Reflect=="object"?Reflect:null,xo=Mi&&typeof Mi.apply=="function"?Mi.apply:function(t,i,n){return Function.prototype.apply.call(t,i,n)},Qn;Mi&&typeof Mi.ownKeys=="function"?Qn=Mi.ownKeys:Object.getOwnPropertySymbols?Qn=function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:Qn=function(t){return Object.getOwnPropertyNames(t)};var Gl=Number.isNaN||function(t){return t!==t};function Le(){Le.init.call(this)}xs.exports=Le;xs.exports.once=$u;Le.EventEmitter=Le;Le.prototype._events=void 0;Le.prototype._eventsCount=0;Le.prototype._maxListeners=void 0;var Eo=10;function Hr(e){if(typeof e!="function")throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e)}Object.defineProperty(Le,"defaultMaxListeners",{enumerable:!0,get:function(){return Eo},set:function(e){if(typeof e!="number"||e<0||Gl(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");Eo=e}});Le.init=function(){(this._events===void 0||this._events===Object.getPrototypeOf(this)._events)&&(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0};Le.prototype.setMaxListeners=function(t){if(typeof t!="number"||t<0||Gl(t))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+t+".");return this._maxListeners=t,this};function Jl(e){return e._maxListeners===void 0?Le.defaultMaxListeners:e._maxListeners}Le.prototype.getMaxListeners=function(){return Jl(this)};Le.prototype.emit=function(t){for(var i=[],n=1;n<arguments.length;n++)i.push(arguments[n]);var r=t==="error",a=this._events;if(a!==void 0)r=r&&a.error===void 0;else if(!r)return!1;if(r){var o;if(i.length>0&&(o=i[0]),o instanceof Error)throw o;var s=new Error("Unhandled error."+(o?" ("+o.message+")":""));throw s.context=o,s}var l=a[t];if(l===void 0)return!1;if(typeof l=="function")xo(l,this,i);else for(var d=l.length,p=tc(l,d),n=0;n<d;++n)xo(p[n],this,i);return!0};function Xl(e,t,i,n){var r,a,o;if(Hr(i),a=e._events,a===void 0?(a=e._events=Object.create(null),e._eventsCount=0):(a.newListener!==void 0&&(e.emit("newListener",t,i.listener?i.listener:i),a=e._events),o=a[t]),o===void 0)o=a[t]=i,++e._eventsCount;else if(typeof o=="function"?o=a[t]=n?[i,o]:[o,i]:n?o.unshift(i):o.push(i),r=Jl(e),r>0&&o.length>r&&!o.warned){o.warned=!0;var s=new Error("Possible EventEmitter memory leak detected. "+o.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");s.name="MaxListenersExceededWarning",s.emitter=e,s.type=t,s.count=o.length}return e}Le.prototype.addListener=function(t,i){return Xl(this,t,i,!1)};Le.prototype.on=Le.prototype.addListener;Le.prototype.prependListener=function(t,i){return Xl(this,t,i,!0)};function Lu(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length===0?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function Zl(e,t,i){var n={fired:!1,wrapFn:void 0,target:e,type:t,listener:i},r=Lu.bind(n);return r.listener=i,n.wrapFn=r,r}Le.prototype.once=function(t,i){return Hr(i),this.on(t,Zl(this,t,i)),this};Le.prototype.prependOnceListener=function(t,i){return Hr(i),this.prependListener(t,Zl(this,t,i)),this};Le.prototype.removeListener=function(t,i){var n,r,a,o,s;if(Hr(i),r=this._events,r===void 0)return this;if(n=r[t],n===void 0)return this;if(n===i||n.listener===i)--this._eventsCount===0?this._events=Object.create(null):(delete r[t],r.removeListener&&this.emit("removeListener",t,n.listener||i));else if(typeof n!="function"){for(a=-1,o=n.length-1;o>=0;o--)if(n[o]===i||n[o].listener===i){s=n[o].listener,a=o;break}if(a<0)return this;a===0?n.shift():Iu(n,a),n.length===1&&(r[t]=n[0]),r.removeListener!==void 0&&this.emit("removeListener",t,s||i)}return this};Le.prototype.off=Le.prototype.removeListener;Le.prototype.removeAllListeners=function(t){var i,n,r;if(n=this._events,n===void 0)return this;if(n.removeListener===void 0)return arguments.length===0?(this._events=Object.create(null),this._eventsCount=0):n[t]!==void 0&&(--this._eventsCount===0?this._events=Object.create(null):delete n[t]),this;if(arguments.length===0){var a=Object.keys(n),o;for(r=0;r<a.length;++r)o=a[r],o!=="removeListener"&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if(i=n[t],typeof i=="function")this.removeListener(t,i);else if(i!==void 0)for(r=i.length-1;r>=0;r--)this.removeListener(t,i[r]);return this};function Ql(e,t,i){var n=e._events;if(n===void 0)return[];var r=n[t];return r===void 0?[]:typeof r=="function"?i?[r.listener||r]:[r]:i?Ru(r):tc(r,r.length)}Le.prototype.listeners=function(t){return Ql(this,t,!0)};Le.prototype.rawListeners=function(t){return Ql(this,t,!1)};Le.listenerCount=function(e,t){return typeof e.listenerCount=="function"?e.listenerCount(t):ec.call(e,t)};Le.prototype.listenerCount=ec;function ec(e){var t=this._events;if(t!==void 0){var i=t[e];if(typeof i=="function")return 1;if(i!==void 0)return i.length}return 0}Le.prototype.eventNames=function(){return this._eventsCount>0?Qn(this._events):[]};function tc(e,t){for(var i=new Array(t),n=0;n<t;++n)i[n]=e[n];return i}function Iu(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}function Ru(e){for(var t=new Array(e.length),i=0;i<t.length;++i)t[i]=e[i].listener||e[i];return t}function $u(e,t){return new Promise(function(i,n){function r(o){e.removeListener(t,a),n(o)}function a(){typeof e.removeListener=="function"&&e.removeListener("error",r),i([].slice.call(arguments))}ic(e,t,a,{once:!0}),t!=="error"&&Mu(e,r,{once:!0})})}function Mu(e,t,i){typeof e.on=="function"&&ic(e,"error",t,i)}function ic(e,t,i,n){if(typeof e.on=="function")n.once?e.once(t,i):e.on(t,i);else if(typeof e.addEventListener=="function")e.addEventListener(t,function r(a){n.once&&e.removeEventListener(t,r),i(a)});else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof e)}var qr=xs.exports,Es={exports:{}},Pu=nc;function nc(e,t){if(e&&t)return nc(e)(t);if(typeof e!="function")throw new TypeError("need wrapper function");return Object.keys(e).forEach(function(n){i[n]=e[n]}),i;function i(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];var a=e.apply(this,n),o=n[n.length-1];return typeof a=="function"&&a!==o&&Object.keys(o).forEach(function(s){a[s]=o[s]}),a}}var rc=Pu;Es.exports=rc(er);Es.exports.strict=rc(ac);er.proto=er(function(){Object.defineProperty(Function.prototype,"once",{value:function(){return er(this)},configurable:!0}),Object.defineProperty(Function.prototype,"onceStrict",{value:function(){return ac(this)},configurable:!0})});function er(e){var t=function(){return t.called?t.value:(t.called=!0,t.value=e.apply(this,arguments))};return t.called=!1,t}function ac(e){var t=function(){if(t.called)throw new Error(t.onceError);return t.called=!0,t.value=e.apply(this,arguments)},i=e.name||"Function wrapped with `once`";return t.onceError=i+" shouldn't be called more than once",t.called=!1,t}var Bu=Es.exports;let To;var Fr=typeof queueMicrotask=="function"?queueMicrotask.bind(typeof window<"u"?window:globalThis):e=>(To||(To=Promise.resolve())).then(e).catch(t=>setTimeout(()=>{throw t},0));var Du=Ou;const zu=Fr;function Ou(e,t){let i,n,r,a=!0;Array.isArray(e)?(i=[],n=e.length):(r=Object.keys(e),i={},n=r.length);function o(l){function d(){t&&t(l,i),t=null}a?zu(d):d()}function s(l,d,p){i[l]=p,(--n===0||d)&&o(d)}n?r?r.forEach(function(l){e[l](function(d,p){s(l,d,p)})}):e.forEach(function(l,d){l(function(p,h){s(d,p,h)})}):o(null),a=!1}var Nu=function(){if(typeof globalThis>"u")return null;var t={RTCPeerConnection:globalThis.RTCPeerConnection||globalThis.mozRTCPeerConnection||globalThis.webkitRTCPeerConnection,RTCSessionDescription:globalThis.RTCSessionDescription||globalThis.mozRTCSessionDescription||globalThis.webkitRTCSessionDescription,RTCIceCandidate:globalThis.RTCIceCandidate||globalThis.mozRTCIceCandidate||globalThis.webkitRTCIceCandidate};return t.RTCPeerConnection?t:null},Va={exports:{}},Ga={exports:{}},vi={},Ur={};Ur.byteLength=Fu;Ur.toByteArray=ju;Ur.fromByteArray=Yu;var Ct=[],pt=[],Hu=typeof Uint8Array<"u"?Uint8Array:Array,ya="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(var Si=0,qu=ya.length;Si<qu;++Si)Ct[Si]=ya[Si],pt[ya.charCodeAt(Si)]=Si;pt[45]=62;pt[95]=63;function sc(e){var t=e.length;if(t%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var i=e.indexOf("=");i===-1&&(i=t);var n=i===t?0:4-i%4;return[i,n]}function Fu(e){var t=sc(e),i=t[0],n=t[1];return(i+n)*3/4-n}function Uu(e,t,i){return(t+i)*3/4-i}function ju(e){var t,i=sc(e),n=i[0],r=i[1],a=new Hu(Uu(e,n,r)),o=0,s=r>0?n-4:n,l;for(l=0;l<s;l+=4)t=pt[e.charCodeAt(l)]<<18|pt[e.charCodeAt(l+1)]<<12|pt[e.charCodeAt(l+2)]<<6|pt[e.charCodeAt(l+3)],a[o++]=t>>16&255,a[o++]=t>>8&255,a[o++]=t&255;return r===2&&(t=pt[e.charCodeAt(l)]<<2|pt[e.charCodeAt(l+1)]>>4,a[o++]=t&255),r===1&&(t=pt[e.charCodeAt(l)]<<10|pt[e.charCodeAt(l+1)]<<4|pt[e.charCodeAt(l+2)]>>2,a[o++]=t>>8&255,a[o++]=t&255),a}function Ku(e){return Ct[e>>18&63]+Ct[e>>12&63]+Ct[e>>6&63]+Ct[e&63]}function Wu(e,t,i){for(var n,r=[],a=t;a<i;a+=3)n=(e[a]<<16&16711680)+(e[a+1]<<8&65280)+(e[a+2]&255),r.push(Ku(n));return r.join("")}function Yu(e){for(var t,i=e.length,n=i%3,r=[],a=16383,o=0,s=i-n;o<s;o+=a)r.push(Wu(e,o,o+a>s?s:o+a));return n===1?(t=e[i-1],r.push(Ct[t>>2]+Ct[t<<4&63]+"==")):n===2&&(t=(e[i-2]<<8)+e[i-1],r.push(Ct[t>>10]+Ct[t>>4&63]+Ct[t<<2&63]+"=")),r.join("")}var Ts={};Ts.read=function(e,t,i,n,r){var a,o,s=r*8-n-1,l=(1<<s)-1,d=l>>1,p=-7,h=i?r-1:0,f=i?-1:1,b=e[t+h];for(h+=f,a=b&(1<<-p)-1,b>>=-p,p+=s;p>0;a=a*256+e[t+h],h+=f,p-=8);for(o=a&(1<<-p)-1,a>>=-p,p+=n;p>0;o=o*256+e[t+h],h+=f,p-=8);if(a===0)a=1-d;else{if(a===l)return o?NaN:(b?-1:1)*(1/0);o=o+Math.pow(2,n),a=a-d}return(b?-1:1)*o*Math.pow(2,a-n)};Ts.write=function(e,t,i,n,r,a){var o,s,l,d=a*8-r-1,p=(1<<d)-1,h=p>>1,f=r===23?Math.pow(2,-24)-Math.pow(2,-77):0,b=n?0:a-1,v=n?1:-1,y=t<0||t===0&&1/t<0?1:0;for(t=Math.abs(t),isNaN(t)||t===1/0?(s=isNaN(t)?1:0,o=p):(o=Math.floor(Math.log(t)/Math.LN2),t*(l=Math.pow(2,-o))<1&&(o--,l*=2),o+h>=1?t+=f/l:t+=f*Math.pow(2,1-h),t*l>=2&&(o++,l/=2),o+h>=p?(s=0,o=p):o+h>=1?(s=(t*l-1)*Math.pow(2,r),o=o+h):(s=t*Math.pow(2,h-1)*Math.pow(2,r),o=0));r>=8;e[i+b]=s&255,b+=v,s/=256,r-=8);for(o=o<<r|s,d+=r;d>0;e[i+b]=o&255,b+=v,o/=256,d-=8);e[i+b-v]|=y*128};(function(e){const t=Ur,i=Ts,n=typeof Symbol=="function"&&typeof Symbol.for=="function"?Symbol.for("nodejs.util.inspect.custom"):null;e.Buffer=s,e.SlowBuffer=w,e.INSPECT_MAX_BYTES=50;const r=2147483647;e.kMaxLength=r,s.TYPED_ARRAY_SUPPORT=a(),!s.TYPED_ARRAY_SUPPORT&&typeof console<"u";function a(){try{const g=new Uint8Array(1),c={foo:function(){return 42}};return Object.setPrototypeOf(c,Uint8Array.prototype),Object.setPrototypeOf(g,c),g.foo()===42}catch{return!1}}Object.defineProperty(s.prototype,"parent",{enumerable:!0,get:function(){if(s.isBuffer(this))return this.buffer}}),Object.defineProperty(s.prototype,"offset",{enumerable:!0,get:function(){if(s.isBuffer(this))return this.byteOffset}});function o(g){if(g>r)throw new RangeError('The value "'+g+'" is invalid for option "size"');const c=new Uint8Array(g);return Object.setPrototypeOf(c,s.prototype),c}function s(g,c,u){if(typeof g=="number"){if(typeof c=="string")throw new TypeError('The "string" argument must be of type string. Received type number');return h(g)}return l(g,c,u)}s.poolSize=8192;function l(g,c,u){if(typeof g=="string")return f(g,c);if(ArrayBuffer.isView(g))return v(g);if(g==null)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof g);if(De(g,ArrayBuffer)||g&&De(g.buffer,ArrayBuffer)||typeof SharedArrayBuffer<"u"&&(De(g,SharedArrayBuffer)||g&&De(g.buffer,SharedArrayBuffer)))return y(g,c,u);if(typeof g=="number")throw new TypeError('The "value" argument must not be of type number. Received type number');const _=g.valueOf&&g.valueOf();if(_!=null&&_!==g)return s.from(_,c,u);const R=k(g);if(R)return R;if(typeof Symbol<"u"&&Symbol.toPrimitive!=null&&typeof g[Symbol.toPrimitive]=="function")return s.from(g[Symbol.toPrimitive]("string"),c,u);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof g)}s.from=function(g,c,u){return l(g,c,u)},Object.setPrototypeOf(s.prototype,Uint8Array.prototype),Object.setPrototypeOf(s,Uint8Array);function d(g){if(typeof g!="number")throw new TypeError('"size" argument must be of type number');if(g<0)throw new RangeError('The value "'+g+'" is invalid for option "size"')}function p(g,c,u){return d(g),g<=0?o(g):c!==void 0?typeof u=="string"?o(g).fill(c,u):o(g).fill(c):o(g)}s.alloc=function(g,c,u){return p(g,c,u)};function h(g){return d(g),o(g<0?0:m(g)|0)}s.allocUnsafe=function(g){return h(g)},s.allocUnsafeSlow=function(g){return h(g)};function f(g,c){if((typeof c!="string"||c==="")&&(c="utf8"),!s.isEncoding(c))throw new TypeError("Unknown encoding: "+c);const u=E(g,c)|0;let _=o(u);const R=_.write(g,c);return R!==u&&(_=_.slice(0,R)),_}function b(g){const c=g.length<0?0:m(g.length)|0,u=o(c);for(let _=0;_<c;_+=1)u[_]=g[_]&255;return u}function v(g){if(De(g,Uint8Array)){const c=new Uint8Array(g);return y(c.buffer,c.byteOffset,c.byteLength)}return b(g)}function y(g,c,u){if(c<0||g.byteLength<c)throw new RangeError('"offset" is outside of buffer bounds');if(g.byteLength<c+(u||0))throw new RangeError('"length" is outside of buffer bounds');let _;return c===void 0&&u===void 0?_=new Uint8Array(g):u===void 0?_=new Uint8Array(g,c):_=new Uint8Array(g,c,u),Object.setPrototypeOf(_,s.prototype),_}function k(g){if(s.isBuffer(g)){const c=m(g.length)|0,u=o(c);return u.length===0||g.copy(u,0,0,c),u}if(g.length!==void 0)return typeof g.length!="number"||Ne(g.length)?o(0):b(g);if(g.type==="Buffer"&&Array.isArray(g.data))return b(g.data)}function m(g){if(g>=r)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+r.toString(16)+" bytes");return g|0}function w(g){return+g!=g&&(g=0),s.alloc(+g)}s.isBuffer=function(c){return c!=null&&c._isBuffer===!0&&c!==s.prototype},s.compare=function(c,u){if(De(c,Uint8Array)&&(c=s.from(c,c.offset,c.byteLength)),De(u,Uint8Array)&&(u=s.from(u,u.offset,u.byteLength)),!s.isBuffer(c)||!s.isBuffer(u))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(c===u)return 0;let _=c.length,R=u.length;for(let P=0,F=Math.min(_,R);P<F;++P)if(c[P]!==u[P]){_=c[P],R=u[P];break}return _<R?-1:R<_?1:0},s.isEncoding=function(c){switch(String(c).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},s.concat=function(c,u){if(!Array.isArray(c))throw new TypeError('"list" argument must be an Array of Buffers');if(c.length===0)return s.alloc(0);let _;if(u===void 0)for(u=0,_=0;_<c.length;++_)u+=c[_].length;const R=s.allocUnsafe(u);let P=0;for(_=0;_<c.length;++_){let F=c[_];if(De(F,Uint8Array))P+F.length>R.length?(s.isBuffer(F)||(F=s.from(F)),F.copy(R,P)):Uint8Array.prototype.set.call(R,F,P);else if(s.isBuffer(F))F.copy(R,P);else throw new TypeError('"list" argument must be an Array of Buffers');P+=F.length}return R};function E(g,c){if(s.isBuffer(g))return g.length;if(ArrayBuffer.isView(g)||De(g,ArrayBuffer))return g.byteLength;if(typeof g!="string")throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof g);const u=g.length,_=arguments.length>2&&arguments[2]===!0;if(!_&&u===0)return 0;let R=!1;for(;;)switch(c){case"ascii":case"latin1":case"binary":return u;case"utf8":case"utf-8":return fe(g).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return u*2;case"hex":return u>>>1;case"base64":return Ue(g).length;default:if(R)return _?-1:fe(g).length;c=(""+c).toLowerCase(),R=!0}}s.byteLength=E;function C(g,c,u){let _=!1;if((c===void 0||c<0)&&(c=0),c>this.length||((u===void 0||u>this.length)&&(u=this.length),u<=0)||(u>>>=0,c>>>=0,u<=c))return"";for(g||(g="utf8");;)switch(g){case"hex":return N(this,c,u);case"utf8":case"utf-8":return B(this,c,u);case"ascii":return te(this,c,u);case"latin1":case"binary":return re(this,c,u);case"base64":return z(this,c,u);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return ae(this,c,u);default:if(_)throw new TypeError("Unknown encoding: "+g);g=(g+"").toLowerCase(),_=!0}}s.prototype._isBuffer=!0;function S(g,c,u){const _=g[c];g[c]=g[u],g[u]=_}s.prototype.swap16=function(){const c=this.length;if(c%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let u=0;u<c;u+=2)S(this,u,u+1);return this},s.prototype.swap32=function(){const c=this.length;if(c%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let u=0;u<c;u+=4)S(this,u,u+3),S(this,u+1,u+2);return this},s.prototype.swap64=function(){const c=this.length;if(c%8!==0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let u=0;u<c;u+=8)S(this,u,u+7),S(this,u+1,u+6),S(this,u+2,u+5),S(this,u+3,u+4);return this},s.prototype.toString=function(){const c=this.length;return c===0?"":arguments.length===0?B(this,0,c):C.apply(this,arguments)},s.prototype.toLocaleString=s.prototype.toString,s.prototype.equals=function(c){if(!s.isBuffer(c))throw new TypeError("Argument must be a Buffer");return this===c?!0:s.compare(this,c)===0},s.prototype.inspect=function(){let c="";const u=e.INSPECT_MAX_BYTES;return c=this.toString("hex",0,u).replace(/(.{2})/g,"$1 ").trim(),this.length>u&&(c+=" ... "),"<Buffer "+c+">"},n&&(s.prototype[n]=s.prototype.inspect),s.prototype.compare=function(c,u,_,R,P){if(De(c,Uint8Array)&&(c=s.from(c,c.offset,c.byteLength)),!s.isBuffer(c))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof c);if(u===void 0&&(u=0),_===void 0&&(_=c?c.length:0),R===void 0&&(R=0),P===void 0&&(P=this.length),u<0||_>c.length||R<0||P>this.length)throw new RangeError("out of range index");if(R>=P&&u>=_)return 0;if(R>=P)return-1;if(u>=_)return 1;if(u>>>=0,_>>>=0,R>>>=0,P>>>=0,this===c)return 0;let F=P-R,pe=_-u;const Ie=Math.min(F,pe),xe=this.slice(R,P),ge=c.slice(u,_);for(let Ee=0;Ee<Ie;++Ee)if(xe[Ee]!==ge[Ee]){F=xe[Ee],pe=ge[Ee];break}return F<pe?-1:pe<F?1:0};function T(g,c,u,_,R){if(g.length===0)return-1;if(typeof u=="string"?(_=u,u=0):u>2147483647?u=2147483647:u<-2147483648&&(u=-2147483648),u=+u,Ne(u)&&(u=R?0:g.length-1),u<0&&(u=g.length+u),u>=g.length){if(R)return-1;u=g.length-1}else if(u<0)if(R)u=0;else return-1;if(typeof c=="string"&&(c=s.from(c,_)),s.isBuffer(c))return c.length===0?-1:I(g,c,u,_,R);if(typeof c=="number")return c=c&255,typeof Uint8Array.prototype.indexOf=="function"?R?Uint8Array.prototype.indexOf.call(g,c,u):Uint8Array.prototype.lastIndexOf.call(g,c,u):I(g,[c],u,_,R);throw new TypeError("val must be string, number or Buffer")}function I(g,c,u,_,R){let P=1,F=g.length,pe=c.length;if(_!==void 0&&(_=String(_).toLowerCase(),_==="ucs2"||_==="ucs-2"||_==="utf16le"||_==="utf-16le")){if(g.length<2||c.length<2)return-1;P=2,F/=2,pe/=2,u/=2}function Ie(ge,Ee){return P===1?ge[Ee]:ge.readUInt16BE(Ee*P)}let xe;if(R){let ge=-1;for(xe=u;xe<F;xe++)if(Ie(g,xe)===Ie(c,ge===-1?0:xe-ge)){if(ge===-1&&(ge=xe),xe-ge+1===pe)return ge*P}else ge!==-1&&(xe-=xe-ge),ge=-1}else for(u+pe>F&&(u=F-pe),xe=u;xe>=0;xe--){let ge=!0;for(let Ee=0;Ee<pe;Ee++)if(Ie(g,xe+Ee)!==Ie(c,Ee)){ge=!1;break}if(ge)return xe}return-1}s.prototype.includes=function(c,u,_){return this.indexOf(c,u,_)!==-1},s.prototype.indexOf=function(c,u,_){return T(this,c,u,_,!0)},s.prototype.lastIndexOf=function(c,u,_){return T(this,c,u,_,!1)};function L(g,c,u,_){u=Number(u)||0;const R=g.length-u;_?(_=Number(_),_>R&&(_=R)):_=R;const P=c.length;_>P/2&&(_=P/2);let F;for(F=0;F<_;++F){const pe=parseInt(c.substr(F*2,2),16);if(Ne(pe))return F;g[u+F]=pe}return F}function D(g,c,u,_){return Re(fe(c,g.length-u),g,u,_)}function O(g,c,u,_){return Re(Xe(c),g,u,_)}function Y(g,c,u,_){return Re(Ue(c),g,u,_)}function j(g,c,u,_){return Re(Ze(c,g.length-u),g,u,_)}s.prototype.write=function(c,u,_,R){if(u===void 0)R="utf8",_=this.length,u=0;else if(_===void 0&&typeof u=="string")R=u,_=this.length,u=0;else if(isFinite(u))u=u>>>0,isFinite(_)?(_=_>>>0,R===void 0&&(R="utf8")):(R=_,_=void 0);else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");const P=this.length-u;if((_===void 0||_>P)&&(_=P),c.length>0&&(_<0||u<0)||u>this.length)throw new RangeError("Attempt to write outside buffer bounds");R||(R="utf8");let F=!1;for(;;)switch(R){case"hex":return L(this,c,u,_);case"utf8":case"utf-8":return D(this,c,u,_);case"ascii":case"latin1":case"binary":return O(this,c,u,_);case"base64":return Y(this,c,u,_);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return j(this,c,u,_);default:if(F)throw new TypeError("Unknown encoding: "+R);R=(""+R).toLowerCase(),F=!0}},s.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function z(g,c,u){return c===0&&u===g.length?t.fromByteArray(g):t.fromByteArray(g.slice(c,u))}function B(g,c,u){u=Math.min(g.length,u);const _=[];let R=c;for(;R<u;){const P=g[R];let F=null,pe=P>239?4:P>223?3:P>191?2:1;if(R+pe<=u){let Ie,xe,ge,Ee;switch(pe){case 1:P<128&&(F=P);break;case 2:Ie=g[R+1],(Ie&192)===128&&(Ee=(P&31)<<6|Ie&63,Ee>127&&(F=Ee));break;case 3:Ie=g[R+1],xe=g[R+2],(Ie&192)===128&&(xe&192)===128&&(Ee=(P&15)<<12|(Ie&63)<<6|xe&63,Ee>2047&&(Ee<55296||Ee>57343)&&(F=Ee));break;case 4:Ie=g[R+1],xe=g[R+2],ge=g[R+3],(Ie&192)===128&&(xe&192)===128&&(ge&192)===128&&(Ee=(P&15)<<18|(Ie&63)<<12|(xe&63)<<6|ge&63,Ee>65535&&Ee<1114112&&(F=Ee))}}F===null?(F=65533,pe=1):F>65535&&(F-=65536,_.push(F>>>10&1023|55296),F=56320|F&1023),_.push(F),R+=pe}return ie(_)}const W=4096;function ie(g){const c=g.length;if(c<=W)return String.fromCharCode.apply(String,g);let u="",_=0;for(;_<c;)u+=String.fromCharCode.apply(String,g.slice(_,_+=W));return u}function te(g,c,u){let _="";u=Math.min(g.length,u);for(let R=c;R<u;++R)_+=String.fromCharCode(g[R]&127);return _}function re(g,c,u){let _="";u=Math.min(g.length,u);for(let R=c;R<u;++R)_+=String.fromCharCode(g[R]);return _}function N(g,c,u){const _=g.length;(!c||c<0)&&(c=0),(!u||u<0||u>_)&&(u=_);let R="";for(let P=c;P<u;++P)R+=Ye[g[P]];return R}function ae(g,c,u){const _=g.slice(c,u);let R="";for(let P=0;P<_.length-1;P+=2)R+=String.fromCharCode(_[P]+_[P+1]*256);return R}s.prototype.slice=function(c,u){const _=this.length;c=~~c,u=u===void 0?_:~~u,c<0?(c+=_,c<0&&(c=0)):c>_&&(c=_),u<0?(u+=_,u<0&&(u=0)):u>_&&(u=_),u<c&&(u=c);const R=this.subarray(c,u);return Object.setPrototypeOf(R,s.prototype),R};function J(g,c,u){if(g%1!==0||g<0)throw new RangeError("offset is not uint");if(g+c>u)throw new RangeError("Trying to access beyond buffer length")}s.prototype.readUintLE=s.prototype.readUIntLE=function(c,u,_){c=c>>>0,u=u>>>0,_||J(c,u,this.length);let R=this[c],P=1,F=0;for(;++F<u&&(P*=256);)R+=this[c+F]*P;return R},s.prototype.readUintBE=s.prototype.readUIntBE=function(c,u,_){c=c>>>0,u=u>>>0,_||J(c,u,this.length);let R=this[c+--u],P=1;for(;u>0&&(P*=256);)R+=this[c+--u]*P;return R},s.prototype.readUint8=s.prototype.readUInt8=function(c,u){return c=c>>>0,u||J(c,1,this.length),this[c]},s.prototype.readUint16LE=s.prototype.readUInt16LE=function(c,u){return c=c>>>0,u||J(c,2,this.length),this[c]|this[c+1]<<8},s.prototype.readUint16BE=s.prototype.readUInt16BE=function(c,u){return c=c>>>0,u||J(c,2,this.length),this[c]<<8|this[c+1]},s.prototype.readUint32LE=s.prototype.readUInt32LE=function(c,u){return c=c>>>0,u||J(c,4,this.length),(this[c]|this[c+1]<<8|this[c+2]<<16)+this[c+3]*16777216},s.prototype.readUint32BE=s.prototype.readUInt32BE=function(c,u){return c=c>>>0,u||J(c,4,this.length),this[c]*16777216+(this[c+1]<<16|this[c+2]<<8|this[c+3])},s.prototype.readBigUInt64LE=je(function(c){c=c>>>0,q(c,"offset");const u=this[c],_=this[c+7];(u===void 0||_===void 0)&&ee(c,this.length-8);const R=u+this[++c]*2**8+this[++c]*2**16+this[++c]*2**24,P=this[++c]+this[++c]*2**8+this[++c]*2**16+_*2**24;return BigInt(R)+(BigInt(P)<<BigInt(32))}),s.prototype.readBigUInt64BE=je(function(c){c=c>>>0,q(c,"offset");const u=this[c],_=this[c+7];(u===void 0||_===void 0)&&ee(c,this.length-8);const R=u*2**24+this[++c]*2**16+this[++c]*2**8+this[++c],P=this[++c]*2**24+this[++c]*2**16+this[++c]*2**8+_;return(BigInt(R)<<BigInt(32))+BigInt(P)}),s.prototype.readIntLE=function(c,u,_){c=c>>>0,u=u>>>0,_||J(c,u,this.length);let R=this[c],P=1,F=0;for(;++F<u&&(P*=256);)R+=this[c+F]*P;return P*=128,R>=P&&(R-=Math.pow(2,8*u)),R},s.prototype.readIntBE=function(c,u,_){c=c>>>0,u=u>>>0,_||J(c,u,this.length);let R=u,P=1,F=this[c+--R];for(;R>0&&(P*=256);)F+=this[c+--R]*P;return P*=128,F>=P&&(F-=Math.pow(2,8*u)),F},s.prototype.readInt8=function(c,u){return c=c>>>0,u||J(c,1,this.length),this[c]&128?(255-this[c]+1)*-1:this[c]},s.prototype.readInt16LE=function(c,u){c=c>>>0,u||J(c,2,this.length);const _=this[c]|this[c+1]<<8;return _&32768?_|4294901760:_},s.prototype.readInt16BE=function(c,u){c=c>>>0,u||J(c,2,this.length);const _=this[c+1]|this[c]<<8;return _&32768?_|4294901760:_},s.prototype.readInt32LE=function(c,u){return c=c>>>0,u||J(c,4,this.length),this[c]|this[c+1]<<8|this[c+2]<<16|this[c+3]<<24},s.prototype.readInt32BE=function(c,u){return c=c>>>0,u||J(c,4,this.length),this[c]<<24|this[c+1]<<16|this[c+2]<<8|this[c+3]},s.prototype.readBigInt64LE=je(function(c){c=c>>>0,q(c,"offset");const u=this[c],_=this[c+7];(u===void 0||_===void 0)&&ee(c,this.length-8);const R=this[c+4]+this[c+5]*2**8+this[c+6]*2**16+(_<<24);return(BigInt(R)<<BigInt(32))+BigInt(u+this[++c]*2**8+this[++c]*2**16+this[++c]*2**24)}),s.prototype.readBigInt64BE=je(function(c){c=c>>>0,q(c,"offset");const u=this[c],_=this[c+7];(u===void 0||_===void 0)&&ee(c,this.length-8);const R=(u<<24)+this[++c]*2**16+this[++c]*2**8+this[++c];return(BigInt(R)<<BigInt(32))+BigInt(this[++c]*2**24+this[++c]*2**16+this[++c]*2**8+_)}),s.prototype.readFloatLE=function(c,u){return c=c>>>0,u||J(c,4,this.length),i.read(this,c,!0,23,4)},s.prototype.readFloatBE=function(c,u){return c=c>>>0,u||J(c,4,this.length),i.read(this,c,!1,23,4)},s.prototype.readDoubleLE=function(c,u){return c=c>>>0,u||J(c,8,this.length),i.read(this,c,!0,52,8)},s.prototype.readDoubleBE=function(c,u){return c=c>>>0,u||J(c,8,this.length),i.read(this,c,!1,52,8)};function K(g,c,u,_,R,P){if(!s.isBuffer(g))throw new TypeError('"buffer" argument must be a Buffer instance');if(c>R||c<P)throw new RangeError('"value" argument is out of bounds');if(u+_>g.length)throw new RangeError("Index out of range")}s.prototype.writeUintLE=s.prototype.writeUIntLE=function(c,u,_,R){if(c=+c,u=u>>>0,_=_>>>0,!R){const pe=Math.pow(2,8*_)-1;K(this,c,u,_,pe,0)}let P=1,F=0;for(this[u]=c&255;++F<_&&(P*=256);)this[u+F]=c/P&255;return u+_},s.prototype.writeUintBE=s.prototype.writeUIntBE=function(c,u,_,R){if(c=+c,u=u>>>0,_=_>>>0,!R){const pe=Math.pow(2,8*_)-1;K(this,c,u,_,pe,0)}let P=_-1,F=1;for(this[u+P]=c&255;--P>=0&&(F*=256);)this[u+P]=c/F&255;return u+_},s.prototype.writeUint8=s.prototype.writeUInt8=function(c,u,_){return c=+c,u=u>>>0,_||K(this,c,u,1,255,0),this[u]=c&255,u+1},s.prototype.writeUint16LE=s.prototype.writeUInt16LE=function(c,u,_){return c=+c,u=u>>>0,_||K(this,c,u,2,65535,0),this[u]=c&255,this[u+1]=c>>>8,u+2},s.prototype.writeUint16BE=s.prototype.writeUInt16BE=function(c,u,_){return c=+c,u=u>>>0,_||K(this,c,u,2,65535,0),this[u]=c>>>8,this[u+1]=c&255,u+2},s.prototype.writeUint32LE=s.prototype.writeUInt32LE=function(c,u,_){return c=+c,u=u>>>0,_||K(this,c,u,4,4294967295,0),this[u+3]=c>>>24,this[u+2]=c>>>16,this[u+1]=c>>>8,this[u]=c&255,u+4},s.prototype.writeUint32BE=s.prototype.writeUInt32BE=function(c,u,_){return c=+c,u=u>>>0,_||K(this,c,u,4,4294967295,0),this[u]=c>>>24,this[u+1]=c>>>16,this[u+2]=c>>>8,this[u+3]=c&255,u+4};function ne(g,c,u,_,R){A(c,_,R,g,u,7);let P=Number(c&BigInt(4294967295));g[u++]=P,P=P>>8,g[u++]=P,P=P>>8,g[u++]=P,P=P>>8,g[u++]=P;let F=Number(c>>BigInt(32)&BigInt(4294967295));return g[u++]=F,F=F>>8,g[u++]=F,F=F>>8,g[u++]=F,F=F>>8,g[u++]=F,u}function de(g,c,u,_,R){A(c,_,R,g,u,7);let P=Number(c&BigInt(4294967295));g[u+7]=P,P=P>>8,g[u+6]=P,P=P>>8,g[u+5]=P,P=P>>8,g[u+4]=P;let F=Number(c>>BigInt(32)&BigInt(4294967295));return g[u+3]=F,F=F>>8,g[u+2]=F,F=F>>8,g[u+1]=F,F=F>>8,g[u]=F,u+8}s.prototype.writeBigUInt64LE=je(function(c,u=0){return ne(this,c,u,BigInt(0),BigInt("0xffffffffffffffff"))}),s.prototype.writeBigUInt64BE=je(function(c,u=0){return de(this,c,u,BigInt(0),BigInt("0xffffffffffffffff"))}),s.prototype.writeIntLE=function(c,u,_,R){if(c=+c,u=u>>>0,!R){const Ie=Math.pow(2,8*_-1);K(this,c,u,_,Ie-1,-Ie)}let P=0,F=1,pe=0;for(this[u]=c&255;++P<_&&(F*=256);)c<0&&pe===0&&this[u+P-1]!==0&&(pe=1),this[u+P]=(c/F>>0)-pe&255;return u+_},s.prototype.writeIntBE=function(c,u,_,R){if(c=+c,u=u>>>0,!R){const Ie=Math.pow(2,8*_-1);K(this,c,u,_,Ie-1,-Ie)}let P=_-1,F=1,pe=0;for(this[u+P]=c&255;--P>=0&&(F*=256);)c<0&&pe===0&&this[u+P+1]!==0&&(pe=1),this[u+P]=(c/F>>0)-pe&255;return u+_},s.prototype.writeInt8=function(c,u,_){return c=+c,u=u>>>0,_||K(this,c,u,1,127,-128),c<0&&(c=255+c+1),this[u]=c&255,u+1},s.prototype.writeInt16LE=function(c,u,_){return c=+c,u=u>>>0,_||K(this,c,u,2,32767,-32768),this[u]=c&255,this[u+1]=c>>>8,u+2},s.prototype.writeInt16BE=function(c,u,_){return c=+c,u=u>>>0,_||K(this,c,u,2,32767,-32768),this[u]=c>>>8,this[u+1]=c&255,u+2},s.prototype.writeInt32LE=function(c,u,_){return c=+c,u=u>>>0,_||K(this,c,u,4,2147483647,-2147483648),this[u]=c&255,this[u+1]=c>>>8,this[u+2]=c>>>16,this[u+3]=c>>>24,u+4},s.prototype.writeInt32BE=function(c,u,_){return c=+c,u=u>>>0,_||K(this,c,u,4,2147483647,-2147483648),c<0&&(c=4294967295+c+1),this[u]=c>>>24,this[u+1]=c>>>16,this[u+2]=c>>>8,this[u+3]=c&255,u+4},s.prototype.writeBigInt64LE=je(function(c,u=0){return ne(this,c,u,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),s.prototype.writeBigInt64BE=je(function(c,u=0){return de(this,c,u,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))});function G(g,c,u,_,R,P){if(u+_>g.length)throw new RangeError("Index out of range");if(u<0)throw new RangeError("Index out of range")}function $(g,c,u,_,R){return c=+c,u=u>>>0,R||G(g,c,u,4),i.write(g,c,u,_,23,4),u+4}s.prototype.writeFloatLE=function(c,u,_){return $(this,c,u,!0,_)},s.prototype.writeFloatBE=function(c,u,_){return $(this,c,u,!1,_)};function M(g,c,u,_,R){return c=+c,u=u>>>0,R||G(g,c,u,8),i.write(g,c,u,_,52,8),u+8}s.prototype.writeDoubleLE=function(c,u,_){return M(this,c,u,!0,_)},s.prototype.writeDoubleBE=function(c,u,_){return M(this,c,u,!1,_)},s.prototype.copy=function(c,u,_,R){if(!s.isBuffer(c))throw new TypeError("argument should be a Buffer");if(_||(_=0),!R&&R!==0&&(R=this.length),u>=c.length&&(u=c.length),u||(u=0),R>0&&R<_&&(R=_),R===_||c.length===0||this.length===0)return 0;if(u<0)throw new RangeError("targetStart out of bounds");if(_<0||_>=this.length)throw new RangeError("Index out of range");if(R<0)throw new RangeError("sourceEnd out of bounds");R>this.length&&(R=this.length),c.length-u<R-_&&(R=c.length-u+_);const P=R-_;return this===c&&typeof Uint8Array.prototype.copyWithin=="function"?this.copyWithin(u,_,R):Uint8Array.prototype.set.call(c,this.subarray(_,R),u),P},s.prototype.fill=function(c,u,_,R){if(typeof c=="string"){if(typeof u=="string"?(R=u,u=0,_=this.length):typeof _=="string"&&(R=_,_=this.length),R!==void 0&&typeof R!="string")throw new TypeError("encoding must be a string");if(typeof R=="string"&&!s.isEncoding(R))throw new TypeError("Unknown encoding: "+R);if(c.length===1){const F=c.charCodeAt(0);(R==="utf8"&&F<128||R==="latin1")&&(c=F)}}else typeof c=="number"?c=c&255:typeof c=="boolean"&&(c=Number(c));if(u<0||this.length<u||this.length<_)throw new RangeError("Out of range index");if(_<=u)return this;u=u>>>0,_=_===void 0?this.length:_>>>0,c||(c=0);let P;if(typeof c=="number")for(P=u;P<_;++P)this[P]=c;else{const F=s.isBuffer(c)?c:s.from(c,R),pe=F.length;if(pe===0)throw new TypeError('The value "'+c+'" is invalid for argument "value"');for(P=0;P<_-u;++P)this[P+u]=F[P%pe]}return this};const H={};function Q(g,c,u){H[g]=class extends u{constructor(){super(),Object.defineProperty(this,"message",{value:c.apply(this,arguments),writable:!0,configurable:!0}),this.name=`${this.name} [${g}]`,this.stack,delete this.name}get code(){return g}set code(R){Object.defineProperty(this,"code",{configurable:!0,enumerable:!0,value:R,writable:!0})}toString(){return`${this.name} [${g}]: ${this.message}`}}}Q("ERR_BUFFER_OUT_OF_BOUNDS",function(g){return g?`${g} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"},RangeError),Q("ERR_INVALID_ARG_TYPE",function(g,c){return`The "${g}" argument must be of type number. Received type ${typeof c}`},TypeError),Q("ERR_OUT_OF_RANGE",function(g,c,u){let _=`The value of "${g}" is out of range.`,R=u;return Number.isInteger(u)&&Math.abs(u)>2**32?R=se(String(u)):typeof u=="bigint"&&(R=String(u),(u>BigInt(2)**BigInt(32)||u<-(BigInt(2)**BigInt(32)))&&(R=se(R)),R+="n"),_+=` It must be ${c}. Received ${R}`,_},RangeError);function se(g){let c="",u=g.length;const _=g[0]==="-"?1:0;for(;u>=_+4;u-=3)c=`_${g.slice(u-3,u)}${c}`;return`${g.slice(0,u)}${c}`}function x(g,c,u){q(c,"offset"),(g[c]===void 0||g[c+u]===void 0)&&ee(c,g.length-(u+1))}function A(g,c,u,_,R,P){if(g>u||g<c){const F=typeof c=="bigint"?"n":"";let pe;throw c===0||c===BigInt(0)?pe=`>= 0${F} and < 2${F} ** ${(P+1)*8}${F}`:pe=`>= -(2${F} ** ${(P+1)*8-1}${F}) and < 2 ** ${(P+1)*8-1}${F}`,new H.ERR_OUT_OF_RANGE("value",pe,g)}x(_,R,P)}function q(g,c){if(typeof g!="number")throw new H.ERR_INVALID_ARG_TYPE(c,"number",g)}function ee(g,c,u){throw Math.floor(g)!==g?(q(g,u),new H.ERR_OUT_OF_RANGE("offset","an integer",g)):c<0?new H.ERR_BUFFER_OUT_OF_BOUNDS:new H.ERR_OUT_OF_RANGE("offset",`>= 0 and <= ${c}`,g)}const ke=/[^+/0-9A-Za-z-_]/g;function le(g){if(g=g.split("=")[0],g=g.trim().replace(ke,""),g.length<2)return"";for(;g.length%4!==0;)g=g+"=";return g}function fe(g,c){c=c||1/0;let u;const _=g.length;let R=null;const P=[];for(let F=0;F<_;++F){if(u=g.charCodeAt(F),u>55295&&u<57344){if(!R){if(u>56319){(c-=3)>-1&&P.push(239,191,189);continue}else if(F+1===_){(c-=3)>-1&&P.push(239,191,189);continue}R=u;continue}if(u<56320){(c-=3)>-1&&P.push(239,191,189),R=u;continue}u=(R-55296<<10|u-56320)+65536}else R&&(c-=3)>-1&&P.push(239,191,189);if(R=null,u<128){if((c-=1)<0)break;P.push(u)}else if(u<2048){if((c-=2)<0)break;P.push(u>>6|192,u&63|128)}else if(u<65536){if((c-=3)<0)break;P.push(u>>12|224,u>>6&63|128,u&63|128)}else if(u<1114112){if((c-=4)<0)break;P.push(u>>18|240,u>>12&63|128,u>>6&63|128,u&63|128)}else throw new Error("Invalid code point")}return P}function Xe(g){const c=[];for(let u=0;u<g.length;++u)c.push(g.charCodeAt(u)&255);return c}function Ze(g,c){let u,_,R;const P=[];for(let F=0;F<g.length&&!((c-=2)<0);++F)u=g.charCodeAt(F),_=u>>8,R=u%256,P.push(R),P.push(_);return P}function Ue(g){return t.toByteArray(le(g))}function Re(g,c,u,_){let R;for(R=0;R<_&&!(R+u>=c.length||R>=g.length);++R)c[R+u]=g[R];return R}function De(g,c){return g instanceof c||g!=null&&g.constructor!=null&&g.constructor.name!=null&&g.constructor.name===c.name}function Ne(g){return g!==g}const Ye=function(){const g="0123456789abcdef",c=new Array(256);for(let u=0;u<16;++u){const _=u*16;for(let R=0;R<16;++R)c[_+R]=g[u]+g[R]}return c}();function je(g){return typeof BigInt>"u"?oe:g}function oe(){throw new Error("BigInt not supported")}})(vi);(function(e,t){var i=vi,n=i.Buffer;function r(o,s){for(var l in o)s[l]=o[l]}n.from&&n.alloc&&n.allocUnsafe&&n.allocUnsafeSlow?e.exports=i:(r(i,t),t.Buffer=a);function a(o,s,l){return n(o,s,l)}a.prototype=Object.create(n.prototype),r(n,a),a.from=function(o,s,l){if(typeof o=="number")throw new TypeError("Argument must not be a number");return n(o,s,l)},a.alloc=function(o,s,l){if(typeof o!="number")throw new TypeError("Argument must be a number");var d=n(o);return s!==void 0?typeof l=="string"?d.fill(s,l):d.fill(s):d.fill(0),d},a.allocUnsafe=function(o){if(typeof o!="number")throw new TypeError("Argument must be a number");return n(o)},a.allocUnsafeSlow=function(o){if(typeof o!="number")throw new TypeError("Argument must be a number");return i.SlowBuffer(o)}})(Ga,Ga.exports);var oc=Ga.exports,va=65536,Vu=4294967295;function Gu(){throw new Error(`Secure random number generation is not supported by this browser.
Use Chrome, Firefox or Internet Explorer 11`)}var Ju=oc.Buffer,kr=globalThis.crypto||globalThis.msCrypto;kr&&kr.getRandomValues?Va.exports=Xu:Va.exports=Gu;function Xu(e,t){if(e>Vu)throw new RangeError("requested too many random bytes");var i=Ju.allocUnsafe(e);if(e>0)if(e>va)for(var n=0;n<e;n+=va)kr.getRandomValues(i.slice(n,n+va));else kr.getRandomValues(i);return typeof t=="function"?process.nextTick(function(){t(null,i)}):i}var As=Va.exports,Ja={exports:{}},lc=qr.EventEmitter;const Zu={},Qu=Object.freeze(Object.defineProperty({__proto__:null,default:Zu},Symbol.toStringTag,{value:"Module"})),bi=Eu(Qu);var ba,Ao;function ep(){if(Ao)return ba;Ao=1;function e(v,y){var k=Object.keys(v);if(Object.getOwnPropertySymbols){var m=Object.getOwnPropertySymbols(v);y&&(m=m.filter(function(w){return Object.getOwnPropertyDescriptor(v,w).enumerable})),k.push.apply(k,m)}return k}function t(v){for(var y=1;y<arguments.length;y++){var k=arguments[y]!=null?arguments[y]:{};y%2?e(Object(k),!0).forEach(function(m){i(v,m,k[m])}):Object.getOwnPropertyDescriptors?Object.defineProperties(v,Object.getOwnPropertyDescriptors(k)):e(Object(k)).forEach(function(m){Object.defineProperty(v,m,Object.getOwnPropertyDescriptor(k,m))})}return v}function i(v,y,k){return y=o(y),y in v?Object.defineProperty(v,y,{value:k,enumerable:!0,configurable:!0,writable:!0}):v[y]=k,v}function n(v,y){if(!(v instanceof y))throw new TypeError("Cannot call a class as a function")}function r(v,y){for(var k=0;k<y.length;k++){var m=y[k];m.enumerable=m.enumerable||!1,m.configurable=!0,"value"in m&&(m.writable=!0),Object.defineProperty(v,o(m.key),m)}}function a(v,y,k){return y&&r(v.prototype,y),Object.defineProperty(v,"prototype",{writable:!1}),v}function o(v){var y=s(v,"string");return typeof y=="symbol"?y:String(y)}function s(v,y){if(typeof v!="object"||v===null)return v;var k=v[Symbol.toPrimitive];if(k!==void 0){var m=k.call(v,y);if(typeof m!="object")return m;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(v)}var l=vi,d=l.Buffer,p=bi,h=p.inspect,f=h&&h.custom||"inspect";function b(v,y,k){d.prototype.copy.call(v,y,k)}return ba=function(){function v(){n(this,v),this.head=null,this.tail=null,this.length=0}return a(v,[{key:"push",value:function(k){var m={data:k,next:null};this.length>0?this.tail.next=m:this.head=m,this.tail=m,++this.length}},{key:"unshift",value:function(k){var m={data:k,next:this.head};this.length===0&&(this.tail=m),this.head=m,++this.length}},{key:"shift",value:function(){if(this.length!==0){var k=this.head.data;return this.length===1?this.head=this.tail=null:this.head=this.head.next,--this.length,k}}},{key:"clear",value:function(){this.head=this.tail=null,this.length=0}},{key:"join",value:function(k){if(this.length===0)return"";for(var m=this.head,w=""+m.data;m=m.next;)w+=k+m.data;return w}},{key:"concat",value:function(k){if(this.length===0)return d.alloc(0);for(var m=d.allocUnsafe(k>>>0),w=this.head,E=0;w;)b(w.data,m,E),E+=w.data.length,w=w.next;return m}},{key:"consume",value:function(k,m){var w;return k<this.head.data.length?(w=this.head.data.slice(0,k),this.head.data=this.head.data.slice(k)):k===this.head.data.length?w=this.shift():w=m?this._getString(k):this._getBuffer(k),w}},{key:"first",value:function(){return this.head.data}},{key:"_getString",value:function(k){var m=this.head,w=1,E=m.data;for(k-=E.length;m=m.next;){var C=m.data,S=k>C.length?C.length:k;if(S===C.length?E+=C:E+=C.slice(0,k),k-=S,k===0){S===C.length?(++w,m.next?this.head=m.next:this.head=this.tail=null):(this.head=m,m.data=C.slice(S));break}++w}return this.length-=w,E}},{key:"_getBuffer",value:function(k){var m=d.allocUnsafe(k),w=this.head,E=1;for(w.data.copy(m),k-=w.data.length;w=w.next;){var C=w.data,S=k>C.length?C.length:k;if(C.copy(m,m.length-k,0,S),k-=S,k===0){S===C.length?(++E,w.next?this.head=w.next:this.head=this.tail=null):(this.head=w,w.data=C.slice(S));break}++E}return this.length-=E,m}},{key:f,value:function(k,m){return h(this,t(t({},m),{},{depth:0,customInspect:!1}))}}]),v}(),ba}function tp(e,t){var i=this,n=this._readableState&&this._readableState.destroyed,r=this._writableState&&this._writableState.destroyed;return n||r?(t?t(e):e&&(this._writableState?this._writableState.errorEmitted||(this._writableState.errorEmitted=!0,process.nextTick(Xa,this,e)):process.nextTick(Xa,this,e)),this):(this._readableState&&(this._readableState.destroyed=!0),this._writableState&&(this._writableState.destroyed=!0),this._destroy(e||null,function(a){!t&&a?i._writableState?i._writableState.errorEmitted?process.nextTick(tr,i):(i._writableState.errorEmitted=!0,process.nextTick(Co,i,a)):process.nextTick(Co,i,a):t?(process.nextTick(tr,i),t(a)):process.nextTick(tr,i)}),this)}function Co(e,t){Xa(e,t),tr(e)}function tr(e){e._writableState&&!e._writableState.emitClose||e._readableState&&!e._readableState.emitClose||e.emit("close")}function ip(){this._readableState&&(this._readableState.destroyed=!1,this._readableState.reading=!1,this._readableState.ended=!1,this._readableState.endEmitted=!1),this._writableState&&(this._writableState.destroyed=!1,this._writableState.ended=!1,this._writableState.ending=!1,this._writableState.finalCalled=!1,this._writableState.prefinished=!1,this._writableState.finished=!1,this._writableState.errorEmitted=!1)}function Xa(e,t){e.emit("error",t)}function np(e,t){var i=e._readableState,n=e._writableState;i&&i.autoDestroy||n&&n.autoDestroy?e.destroy(t):e.emit("error",t)}var cc={destroy:tp,undestroy:ip,errorOrDestroy:np},wi={};function rp(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}var dc={};function vt(e,t,i){i||(i=Error);function n(a,o,s){return typeof t=="string"?t:t(a,o,s)}var r=function(a){rp(o,a);function o(s,l,d){return a.call(this,n(s,l,d))||this}return o}(i);r.prototype.name=i.name,r.prototype.code=e,dc[e]=r}function Lo(e,t){if(Array.isArray(e)){var i=e.length;return e=e.map(function(n){return String(n)}),i>2?"one of ".concat(t," ").concat(e.slice(0,i-1).join(", "),", or ")+e[i-1]:i===2?"one of ".concat(t," ").concat(e[0]," or ").concat(e[1]):"of ".concat(t," ").concat(e[0])}else return"of ".concat(t," ").concat(String(e))}function ap(e,t,i){return e.substr(0,t.length)===t}function sp(e,t,i){return(i===void 0||i>e.length)&&(i=e.length),e.substring(i-t.length,i)===t}function op(e,t,i){return typeof i!="number"&&(i=0),i+t.length>e.length?!1:e.indexOf(t,i)!==-1}vt("ERR_INVALID_OPT_VALUE",function(e,t){return'The value "'+t+'" is invalid for option "'+e+'"'},TypeError);vt("ERR_INVALID_ARG_TYPE",function(e,t,i){var n;typeof t=="string"&&ap(t,"not ")?(n="must not be",t=t.replace(/^not /,"")):n="must be";var r;if(sp(e," argument"))r="The ".concat(e," ").concat(n," ").concat(Lo(t,"type"));else{var a=op(e,".")?"property":"argument";r='The "'.concat(e,'" ').concat(a," ").concat(n," ").concat(Lo(t,"type"))}return r+=". Received type ".concat(typeof i),r},TypeError);vt("ERR_STREAM_PUSH_AFTER_EOF","stream.push() after EOF");vt("ERR_METHOD_NOT_IMPLEMENTED",function(e){return"The "+e+" method is not implemented"});vt("ERR_STREAM_PREMATURE_CLOSE","Premature close");vt("ERR_STREAM_DESTROYED",function(e){return"Cannot call "+e+" after a stream was destroyed"});vt("ERR_MULTIPLE_CALLBACK","Callback called multiple times");vt("ERR_STREAM_CANNOT_PIPE","Cannot pipe, not readable");vt("ERR_STREAM_WRITE_AFTER_END","write after end");vt("ERR_STREAM_NULL_VALUES","May not write null values to stream",TypeError);vt("ERR_UNKNOWN_ENCODING",function(e){return"Unknown encoding: "+e},TypeError);vt("ERR_STREAM_UNSHIFT_AFTER_END_EVENT","stream.unshift() after end event");wi.codes=dc;var lp=wi.codes.ERR_INVALID_OPT_VALUE;function cp(e,t,i){return e.highWaterMark!=null?e.highWaterMark:t?e[i]:null}function dp(e,t,i,n){var r=cp(t,n,i);if(r!=null){if(!(isFinite(r)&&Math.floor(r)===r)||r<0){var a=n?i:"highWaterMark";throw new lp(a,r)}return Math.floor(r)}return e.objectMode?16:16*1024}var uc={getHighWaterMark:dp},Za={exports:{}};typeof Object.create=="function"?Za.exports=function(t,i){i&&(t.super_=i,t.prototype=Object.create(i.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}))}:Za.exports=function(t,i){if(i){t.super_=i;var n=function(){};n.prototype=i.prototype,t.prototype=new n,t.prototype.constructor=t}};var Tn=Za.exports,up=pp;function pp(e,t){if(wa("noDeprecation"))return e;var i=!1;function n(){if(!i){if(wa("throwDeprecation"))throw new Error(t);wa("traceDeprecation"),i=!0}return e.apply(this,arguments)}return n}function wa(e){try{if(!globalThis.localStorage)return!1}catch{return!1}var t=globalThis.localStorage[e];return t==null?!1:String(t).toLowerCase()==="true"}var ka,Io;function pc(){if(Io)return ka;Io=1,ka=L;function e($){var M=this;this.next=null,this.entry=null,this.finish=function(){G(M,$)}}var t;L.WritableState=T;var i={deprecate:up},n=lc,r=vi.Buffer,a=(typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof self<"u"?self:{}).Uint8Array||function(){};function o($){return r.from($)}function s($){return r.isBuffer($)||$ instanceof a}var l=cc,d=uc,p=d.getHighWaterMark,h=wi.codes,f=h.ERR_INVALID_ARG_TYPE,b=h.ERR_METHOD_NOT_IMPLEMENTED,v=h.ERR_MULTIPLE_CALLBACK,y=h.ERR_STREAM_CANNOT_PIPE,k=h.ERR_STREAM_DESTROYED,m=h.ERR_STREAM_NULL_VALUES,w=h.ERR_STREAM_WRITE_AFTER_END,E=h.ERR_UNKNOWN_ENCODING,C=l.errorOrDestroy;Tn(L,n);function S(){}function T($,M,H){t=t||Ni(),$=$||{},typeof H!="boolean"&&(H=M instanceof t),this.objectMode=!!$.objectMode,H&&(this.objectMode=this.objectMode||!!$.writableObjectMode),this.highWaterMark=p(this,$,"writableHighWaterMark",H),this.finalCalled=!1,this.needDrain=!1,this.ending=!1,this.ended=!1,this.finished=!1,this.destroyed=!1;var Q=$.decodeStrings===!1;this.decodeStrings=!Q,this.defaultEncoding=$.defaultEncoding||"utf8",this.length=0,this.writing=!1,this.corked=0,this.sync=!0,this.bufferProcessing=!1,this.onwrite=function(se){ie(M,se)},this.writecb=null,this.writelen=0,this.bufferedRequest=null,this.lastBufferedRequest=null,this.pendingcb=0,this.prefinished=!1,this.errorEmitted=!1,this.emitClose=$.emitClose!==!1,this.autoDestroy=!!$.autoDestroy,this.bufferedRequestCount=0,this.corkedRequestsFree=new e(this)}T.prototype.getBuffer=function(){for(var M=this.bufferedRequest,H=[];M;)H.push(M),M=M.next;return H},function(){try{Object.defineProperty(T.prototype,"buffer",{get:i.deprecate(function(){return this.getBuffer()},"_writableState.buffer is deprecated. Use _writableState.getBuffer instead.","DEP0003")})}catch{}}();var I;typeof Symbol=="function"&&Symbol.hasInstance&&typeof Function.prototype[Symbol.hasInstance]=="function"?(I=Function.prototype[Symbol.hasInstance],Object.defineProperty(L,Symbol.hasInstance,{value:function(M){return I.call(this,M)?!0:this!==L?!1:M&&M._writableState instanceof T}})):I=function(M){return M instanceof this};function L($){t=t||Ni();var M=this instanceof t;if(!M&&!I.call(L,this))return new L($);this._writableState=new T($,this,M),this.writable=!0,$&&(typeof $.write=="function"&&(this._write=$.write),typeof $.writev=="function"&&(this._writev=$.writev),typeof $.destroy=="function"&&(this._destroy=$.destroy),typeof $.final=="function"&&(this._final=$.final)),n.call(this)}L.prototype.pipe=function(){C(this,new y)};function D($,M){var H=new w;C($,H),process.nextTick(M,H)}function O($,M,H,Q){var se;return H===null?se=new m:typeof H!="string"&&!M.objectMode&&(se=new f("chunk",["string","Buffer"],H)),se?(C($,se),process.nextTick(Q,se),!1):!0}L.prototype.write=function($,M,H){var Q=this._writableState,se=!1,x=!Q.objectMode&&s($);return x&&!r.isBuffer($)&&($=o($)),typeof M=="function"&&(H=M,M=null),x?M="buffer":M||(M=Q.defaultEncoding),typeof H!="function"&&(H=S),Q.ending?D(this,H):(x||O(this,Q,$,H))&&(Q.pendingcb++,se=j(this,Q,x,$,M,H)),se},L.prototype.cork=function(){this._writableState.corked++},L.prototype.uncork=function(){var $=this._writableState;$.corked&&($.corked--,!$.writing&&!$.corked&&!$.bufferProcessing&&$.bufferedRequest&&N(this,$))},L.prototype.setDefaultEncoding=function(M){if(typeof M=="string"&&(M=M.toLowerCase()),!(["hex","utf8","utf-8","ascii","binary","base64","ucs2","ucs-2","utf16le","utf-16le","raw"].indexOf((M+"").toLowerCase())>-1))throw new E(M);return this._writableState.defaultEncoding=M,this},Object.defineProperty(L.prototype,"writableBuffer",{enumerable:!1,get:function(){return this._writableState&&this._writableState.getBuffer()}});function Y($,M,H){return!$.objectMode&&$.decodeStrings!==!1&&typeof M=="string"&&(M=r.from(M,H)),M}Object.defineProperty(L.prototype,"writableHighWaterMark",{enumerable:!1,get:function(){return this._writableState.highWaterMark}});function j($,M,H,Q,se,x){if(!H){var A=Y(M,Q,se);Q!==A&&(H=!0,se="buffer",Q=A)}var q=M.objectMode?1:Q.length;M.length+=q;var ee=M.length<M.highWaterMark;if(ee||(M.needDrain=!0),M.writing||M.corked){var ke=M.lastBufferedRequest;M.lastBufferedRequest={chunk:Q,encoding:se,isBuf:H,callback:x,next:null},ke?ke.next=M.lastBufferedRequest:M.bufferedRequest=M.lastBufferedRequest,M.bufferedRequestCount+=1}else z($,M,!1,q,Q,se,x);return ee}function z($,M,H,Q,se,x,A){M.writelen=Q,M.writecb=A,M.writing=!0,M.sync=!0,M.destroyed?M.onwrite(new k("write")):H?$._writev(se,M.onwrite):$._write(se,x,M.onwrite),M.sync=!1}function B($,M,H,Q,se){--M.pendingcb,H?(process.nextTick(se,Q),process.nextTick(ne,$,M),$._writableState.errorEmitted=!0,C($,Q)):(se(Q),$._writableState.errorEmitted=!0,C($,Q),ne($,M))}function W($){$.writing=!1,$.writecb=null,$.length-=$.writelen,$.writelen=0}function ie($,M){var H=$._writableState,Q=H.sync,se=H.writecb;if(typeof se!="function")throw new v;if(W(H),M)B($,H,Q,M,se);else{var x=ae(H)||$.destroyed;!x&&!H.corked&&!H.bufferProcessing&&H.bufferedRequest&&N($,H),Q?process.nextTick(te,$,H,x,se):te($,H,x,se)}}function te($,M,H,Q){H||re($,M),M.pendingcb--,Q(),ne($,M)}function re($,M){M.length===0&&M.needDrain&&(M.needDrain=!1,$.emit("drain"))}function N($,M){M.bufferProcessing=!0;var H=M.bufferedRequest;if($._writev&&H&&H.next){var Q=M.bufferedRequestCount,se=new Array(Q),x=M.corkedRequestsFree;x.entry=H;for(var A=0,q=!0;H;)se[A]=H,H.isBuf||(q=!1),H=H.next,A+=1;se.allBuffers=q,z($,M,!0,M.length,se,"",x.finish),M.pendingcb++,M.lastBufferedRequest=null,x.next?(M.corkedRequestsFree=x.next,x.next=null):M.corkedRequestsFree=new e(M),M.bufferedRequestCount=0}else{for(;H;){var ee=H.chunk,ke=H.encoding,le=H.callback,fe=M.objectMode?1:ee.length;if(z($,M,!1,fe,ee,ke,le),H=H.next,M.bufferedRequestCount--,M.writing)break}H===null&&(M.lastBufferedRequest=null)}M.bufferedRequest=H,M.bufferProcessing=!1}L.prototype._write=function($,M,H){H(new b("_write()"))},L.prototype._writev=null,L.prototype.end=function($,M,H){var Q=this._writableState;return typeof $=="function"?(H=$,$=null,M=null):typeof M=="function"&&(H=M,M=null),$!=null&&this.write($,M),Q.corked&&(Q.corked=1,this.uncork()),Q.ending||de(this,Q,H),this},Object.defineProperty(L.prototype,"writableLength",{enumerable:!1,get:function(){return this._writableState.length}});function ae($){return $.ending&&$.length===0&&$.bufferedRequest===null&&!$.finished&&!$.writing}function J($,M){$._final(function(H){M.pendingcb--,H&&C($,H),M.prefinished=!0,$.emit("prefinish"),ne($,M)})}function K($,M){!M.prefinished&&!M.finalCalled&&(typeof $._final=="function"&&!M.destroyed?(M.pendingcb++,M.finalCalled=!0,process.nextTick(J,$,M)):(M.prefinished=!0,$.emit("prefinish")))}function ne($,M){var H=ae(M);if(H&&(K($,M),M.pendingcb===0&&(M.finished=!0,$.emit("finish"),M.autoDestroy))){var Q=$._readableState;(!Q||Q.autoDestroy&&Q.endEmitted)&&$.destroy()}return H}function de($,M,H){M.ending=!0,ne($,M),H&&(M.finished?process.nextTick(H):$.once("finish",H)),M.ended=!0,$.writable=!1}function G($,M,H){var Q=$.entry;for($.entry=null;Q;){var se=Q.callback;M.pendingcb--,se(H),Q=Q.next}M.corkedRequestsFree.next=$}return Object.defineProperty(L.prototype,"destroyed",{enumerable:!1,get:function(){return this._writableState===void 0?!1:this._writableState.destroyed},set:function(M){this._writableState&&(this._writableState.destroyed=M)}}),L.prototype.destroy=l.destroy,L.prototype._undestroy=l.undestroy,L.prototype._destroy=function($,M){M($)},ka}var _a,Ro;function Ni(){if(Ro)return _a;Ro=1;var e=Object.keys||function(d){var p=[];for(var h in d)p.push(h);return p};_a=o;var t=fc(),i=pc();Tn(o,t);for(var n=e(i.prototype),r=0;r<n.length;r++){var a=n[r];o.prototype[a]||(o.prototype[a]=i.prototype[a])}function o(d){if(!(this instanceof o))return new o(d);t.call(this,d),i.call(this,d),this.allowHalfOpen=!0,d&&(d.readable===!1&&(this.readable=!1),d.writable===!1&&(this.writable=!1),d.allowHalfOpen===!1&&(this.allowHalfOpen=!1,this.once("end",s)))}Object.defineProperty(o.prototype,"writableHighWaterMark",{enumerable:!1,get:function(){return this._writableState.highWaterMark}}),Object.defineProperty(o.prototype,"writableBuffer",{enumerable:!1,get:function(){return this._writableState&&this._writableState.getBuffer()}}),Object.defineProperty(o.prototype,"writableLength",{enumerable:!1,get:function(){return this._writableState.length}});function s(){this._writableState.ended||process.nextTick(l,this)}function l(d){d.end()}return Object.defineProperty(o.prototype,"destroyed",{enumerable:!1,get:function(){return this._readableState===void 0||this._writableState===void 0?!1:this._readableState.destroyed&&this._writableState.destroyed},set:function(p){this._readableState===void 0||this._writableState===void 0||(this._readableState.destroyed=p,this._writableState.destroyed=p)}}),_a}var Sa={},$o;function Mo(){if($o)return Sa;$o=1;var e=oc.Buffer,t=e.isEncoding||function(m){switch(m=""+m,m&&m.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return!0;default:return!1}};function i(m){if(!m)return"utf8";for(var w;;)switch(m){case"utf8":case"utf-8":return"utf8";case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return"utf16le";case"latin1":case"binary":return"latin1";case"base64":case"ascii":case"hex":return m;default:if(w)return;m=(""+m).toLowerCase(),w=!0}}function n(m){var w=i(m);if(typeof w!="string"&&(e.isEncoding===t||!t(m)))throw new Error("Unknown encoding: "+m);return w||m}Sa.StringDecoder=r;function r(m){this.encoding=n(m);var w;switch(this.encoding){case"utf16le":this.text=h,this.end=f,w=4;break;case"utf8":this.fillLast=l,w=4;break;case"base64":this.text=b,this.end=v,w=3;break;default:this.write=y,this.end=k;return}this.lastNeed=0,this.lastTotal=0,this.lastChar=e.allocUnsafe(w)}r.prototype.write=function(m){if(m.length===0)return"";var w,E;if(this.lastNeed){if(w=this.fillLast(m),w===void 0)return"";E=this.lastNeed,this.lastNeed=0}else E=0;return E<m.length?w?w+this.text(m,E):this.text(m,E):w||""},r.prototype.end=p,r.prototype.text=d,r.prototype.fillLast=function(m){if(this.lastNeed<=m.length)return m.copy(this.lastChar,this.lastTotal-this.lastNeed,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal);m.copy(this.lastChar,this.lastTotal-this.lastNeed,0,m.length),this.lastNeed-=m.length};function a(m){return m<=127?0:m>>5===6?2:m>>4===14?3:m>>3===30?4:m>>6===2?-1:-2}function o(m,w,E){var C=w.length-1;if(C<E)return 0;var S=a(w[C]);return S>=0?(S>0&&(m.lastNeed=S-1),S):--C<E||S===-2?0:(S=a(w[C]),S>=0?(S>0&&(m.lastNeed=S-2),S):--C<E||S===-2?0:(S=a(w[C]),S>=0?(S>0&&(S===2?S=0:m.lastNeed=S-3),S):0))}function s(m,w,E){if((w[0]&192)!==128)return m.lastNeed=0,"�";if(m.lastNeed>1&&w.length>1){if((w[1]&192)!==128)return m.lastNeed=1,"�";if(m.lastNeed>2&&w.length>2&&(w[2]&192)!==128)return m.lastNeed=2,"�"}}function l(m){var w=this.lastTotal-this.lastNeed,E=s(this,m);if(E!==void 0)return E;if(this.lastNeed<=m.length)return m.copy(this.lastChar,w,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal);m.copy(this.lastChar,w,0,m.length),this.lastNeed-=m.length}function d(m,w){var E=o(this,m,w);if(!this.lastNeed)return m.toString("utf8",w);this.lastTotal=E;var C=m.length-(E-this.lastNeed);return m.copy(this.lastChar,0,C),m.toString("utf8",w,C)}function p(m){var w=m&&m.length?this.write(m):"";return this.lastNeed?w+"�":w}function h(m,w){if((m.length-w)%2===0){var E=m.toString("utf16le",w);if(E){var C=E.charCodeAt(E.length-1);if(C>=55296&&C<=56319)return this.lastNeed=2,this.lastTotal=4,this.lastChar[0]=m[m.length-2],this.lastChar[1]=m[m.length-1],E.slice(0,-1)}return E}return this.lastNeed=1,this.lastTotal=2,this.lastChar[0]=m[m.length-1],m.toString("utf16le",w,m.length-1)}function f(m){var w=m&&m.length?this.write(m):"";if(this.lastNeed){var E=this.lastTotal-this.lastNeed;return w+this.lastChar.toString("utf16le",0,E)}return w}function b(m,w){var E=(m.length-w)%3;return E===0?m.toString("base64",w):(this.lastNeed=3-E,this.lastTotal=3,E===1?this.lastChar[0]=m[m.length-1]:(this.lastChar[0]=m[m.length-2],this.lastChar[1]=m[m.length-1]),m.toString("base64",w,m.length-E))}function v(m){var w=m&&m.length?this.write(m):"";return this.lastNeed?w+this.lastChar.toString("base64",0,3-this.lastNeed):w}function y(m){return m.toString(this.encoding)}function k(m){return m&&m.length?this.write(m):""}return Sa}var Po=wi.codes.ERR_STREAM_PREMATURE_CLOSE;function hp(e){var t=!1;return function(){if(!t){t=!0;for(var i=arguments.length,n=new Array(i),r=0;r<i;r++)n[r]=arguments[r];e.apply(this,n)}}}function fp(){}function mp(e){return e.setHeader&&typeof e.abort=="function"}function hc(e,t,i){if(typeof t=="function")return hc(e,null,t);t||(t={}),i=hp(i||fp);var n=t.readable||t.readable!==!1&&e.readable,r=t.writable||t.writable!==!1&&e.writable,a=function(){e.writable||s()},o=e._writableState&&e._writableState.finished,s=function(){r=!1,o=!0,n||i.call(e)},l=e._readableState&&e._readableState.endEmitted,d=function(){n=!1,l=!0,r||i.call(e)},p=function(v){i.call(e,v)},h=function(){var v;if(n&&!l)return(!e._readableState||!e._readableState.ended)&&(v=new Po),i.call(e,v);if(r&&!o)return(!e._writableState||!e._writableState.ended)&&(v=new Po),i.call(e,v)},f=function(){e.req.on("finish",s)};return mp(e)?(e.on("complete",s),e.on("abort",h),e.req?f():e.on("request",f)):r&&!e._writableState&&(e.on("end",a),e.on("close",a)),e.on("end",d),e.on("finish",s),t.error!==!1&&e.on("error",p),e.on("close",h),function(){e.removeListener("complete",s),e.removeListener("abort",h),e.removeListener("request",f),e.req&&e.req.removeListener("finish",s),e.removeListener("end",a),e.removeListener("close",a),e.removeListener("finish",s),e.removeListener("end",d),e.removeListener("error",p),e.removeListener("close",h)}}var Cs=hc,xa,Bo;function gp(){if(Bo)return xa;Bo=1;var e;function t(E,C,S){return C=i(C),C in E?Object.defineProperty(E,C,{value:S,enumerable:!0,configurable:!0,writable:!0}):E[C]=S,E}function i(E){var C=n(E,"string");return typeof C=="symbol"?C:String(C)}function n(E,C){if(typeof E!="object"||E===null)return E;var S=E[Symbol.toPrimitive];if(S!==void 0){var T=S.call(E,C);if(typeof T!="object")return T;throw new TypeError("@@toPrimitive must return a primitive value.")}return(C==="string"?String:Number)(E)}var r=Cs,a=Symbol("lastResolve"),o=Symbol("lastReject"),s=Symbol("error"),l=Symbol("ended"),d=Symbol("lastPromise"),p=Symbol("handlePromise"),h=Symbol("stream");function f(E,C){return{value:E,done:C}}function b(E){var C=E[a];if(C!==null){var S=E[h].read();S!==null&&(E[d]=null,E[a]=null,E[o]=null,C(f(S,!1)))}}function v(E){process.nextTick(b,E)}function y(E,C){return function(S,T){E.then(function(){if(C[l]){S(f(void 0,!0));return}C[p](S,T)},T)}}var k=Object.getPrototypeOf(function(){}),m=Object.setPrototypeOf((e={get stream(){return this[h]},next:function(){var C=this,S=this[s];if(S!==null)return Promise.reject(S);if(this[l])return Promise.resolve(f(void 0,!0));if(this[h].destroyed)return new Promise(function(D,O){process.nextTick(function(){C[s]?O(C[s]):D(f(void 0,!0))})});var T=this[d],I;if(T)I=new Promise(y(T,this));else{var L=this[h].read();if(L!==null)return Promise.resolve(f(L,!1));I=new Promise(this[p])}return this[d]=I,I}},t(e,Symbol.asyncIterator,function(){return this}),t(e,"return",function(){var C=this;return new Promise(function(S,T){C[h].destroy(null,function(I){if(I){T(I);return}S(f(void 0,!0))})})}),e),k),w=function(C){var S,T=Object.create(m,(S={},t(S,h,{value:C,writable:!0}),t(S,a,{value:null,writable:!0}),t(S,o,{value:null,writable:!0}),t(S,s,{value:null,writable:!0}),t(S,l,{value:C._readableState.endEmitted,writable:!0}),t(S,p,{value:function(L,D){var O=T[h].read();O?(T[d]=null,T[a]=null,T[o]=null,L(f(O,!1))):(T[a]=L,T[o]=D)},writable:!0}),S));return T[d]=null,r(C,function(I){if(I&&I.code!=="ERR_STREAM_PREMATURE_CLOSE"){var L=T[o];L!==null&&(T[d]=null,T[a]=null,T[o]=null,L(I)),T[s]=I;return}var D=T[a];D!==null&&(T[d]=null,T[a]=null,T[o]=null,D(f(void 0,!0))),T[l]=!0}),C.on("readable",v.bind(null,T)),T};return xa=w,xa}var Ea,Do;function yp(){return Do||(Do=1,Ea=function(){throw new Error("Readable.from is not available in the browser")}),Ea}var Ta,zo;function fc(){if(zo)return Ta;zo=1,Ta=D;var e;D.ReadableState=L,qr.EventEmitter;var t=function(A,q){return A.listeners(q).length},i=lc,n=vi.Buffer,r=(typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof self<"u"?self:{}).Uint8Array||function(){};function a(x){return n.from(x)}function o(x){return n.isBuffer(x)||x instanceof r}var s=bi,l;s&&s.debuglog?l=s.debuglog("stream"):l=function(){};var d=ep(),p=cc,h=uc,f=h.getHighWaterMark,b=wi.codes,v=b.ERR_INVALID_ARG_TYPE,y=b.ERR_STREAM_PUSH_AFTER_EOF,k=b.ERR_METHOD_NOT_IMPLEMENTED,m=b.ERR_STREAM_UNSHIFT_AFTER_END_EVENT,w,E,C;Tn(D,i);var S=p.errorOrDestroy,T=["error","close","destroy","pause","resume"];function I(x,A,q){if(typeof x.prependListener=="function")return x.prependListener(A,q);!x._events||!x._events[A]?x.on(A,q):Array.isArray(x._events[A])?x._events[A].unshift(q):x._events[A]=[q,x._events[A]]}function L(x,A,q){e=e||Ni(),x=x||{},typeof q!="boolean"&&(q=A instanceof e),this.objectMode=!!x.objectMode,q&&(this.objectMode=this.objectMode||!!x.readableObjectMode),this.highWaterMark=f(this,x,"readableHighWaterMark",q),this.buffer=new d,this.length=0,this.pipes=null,this.pipesCount=0,this.flowing=null,this.ended=!1,this.endEmitted=!1,this.reading=!1,this.sync=!0,this.needReadable=!1,this.emittedReadable=!1,this.readableListening=!1,this.resumeScheduled=!1,this.paused=!0,this.emitClose=x.emitClose!==!1,this.autoDestroy=!!x.autoDestroy,this.destroyed=!1,this.defaultEncoding=x.defaultEncoding||"utf8",this.awaitDrain=0,this.readingMore=!1,this.decoder=null,this.encoding=null,x.encoding&&(w||(w=Mo().StringDecoder),this.decoder=new w(x.encoding),this.encoding=x.encoding)}function D(x){if(e=e||Ni(),!(this instanceof D))return new D(x);var A=this instanceof e;this._readableState=new L(x,this,A),this.readable=!0,x&&(typeof x.read=="function"&&(this._read=x.read),typeof x.destroy=="function"&&(this._destroy=x.destroy)),i.call(this)}Object.defineProperty(D.prototype,"destroyed",{enumerable:!1,get:function(){return this._readableState===void 0?!1:this._readableState.destroyed},set:function(A){this._readableState&&(this._readableState.destroyed=A)}}),D.prototype.destroy=p.destroy,D.prototype._undestroy=p.undestroy,D.prototype._destroy=function(x,A){A(x)},D.prototype.push=function(x,A){var q=this._readableState,ee;return q.objectMode?ee=!0:typeof x=="string"&&(A=A||q.defaultEncoding,A!==q.encoding&&(x=n.from(x,A),A=""),ee=!0),O(this,x,A,!1,ee)},D.prototype.unshift=function(x){return O(this,x,null,!0,!1)};function O(x,A,q,ee,ke){l("readableAddChunk",A);var le=x._readableState;if(A===null)le.reading=!1,ie(x,le);else{var fe;if(ke||(fe=j(le,A)),fe)S(x,fe);else if(le.objectMode||A&&A.length>0)if(typeof A!="string"&&!le.objectMode&&Object.getPrototypeOf(A)!==n.prototype&&(A=a(A)),ee)le.endEmitted?S(x,new m):Y(x,le,A,!0);else if(le.ended)S(x,new y);else{if(le.destroyed)return!1;le.reading=!1,le.decoder&&!q?(A=le.decoder.write(A),le.objectMode||A.length!==0?Y(x,le,A,!1):N(x,le)):Y(x,le,A,!1)}else ee||(le.reading=!1,N(x,le))}return!le.ended&&(le.length<le.highWaterMark||le.length===0)}function Y(x,A,q,ee){A.flowing&&A.length===0&&!A.sync?(A.awaitDrain=0,x.emit("data",q)):(A.length+=A.objectMode?1:q.length,ee?A.buffer.unshift(q):A.buffer.push(q),A.needReadable&&te(x)),N(x,A)}function j(x,A){var q;return!o(A)&&typeof A!="string"&&A!==void 0&&!x.objectMode&&(q=new v("chunk",["string","Buffer","Uint8Array"],A)),q}D.prototype.isPaused=function(){return this._readableState.flowing===!1},D.prototype.setEncoding=function(x){w||(w=Mo().StringDecoder);var A=new w(x);this._readableState.decoder=A,this._readableState.encoding=this._readableState.decoder.encoding;for(var q=this._readableState.buffer.head,ee="";q!==null;)ee+=A.write(q.data),q=q.next;return this._readableState.buffer.clear(),ee!==""&&this._readableState.buffer.push(ee),this._readableState.length=ee.length,this};var z=1073741824;function B(x){return x>=z?x=z:(x--,x|=x>>>1,x|=x>>>2,x|=x>>>4,x|=x>>>8,x|=x>>>16,x++),x}function W(x,A){return x<=0||A.length===0&&A.ended?0:A.objectMode?1:x!==x?A.flowing&&A.length?A.buffer.head.data.length:A.length:(x>A.highWaterMark&&(A.highWaterMark=B(x)),x<=A.length?x:A.ended?A.length:(A.needReadable=!0,0))}D.prototype.read=function(x){l("read",x),x=parseInt(x,10);var A=this._readableState,q=x;if(x!==0&&(A.emittedReadable=!1),x===0&&A.needReadable&&((A.highWaterMark!==0?A.length>=A.highWaterMark:A.length>0)||A.ended))return l("read: emitReadable",A.length,A.ended),A.length===0&&A.ended?H(this):te(this),null;if(x=W(x,A),x===0&&A.ended)return A.length===0&&H(this),null;var ee=A.needReadable;l("need readable",ee),(A.length===0||A.length-x<A.highWaterMark)&&(ee=!0,l("length less than watermark",ee)),A.ended||A.reading?(ee=!1,l("reading or ended",ee)):ee&&(l("do read"),A.reading=!0,A.sync=!0,A.length===0&&(A.needReadable=!0),this._read(A.highWaterMark),A.sync=!1,A.reading||(x=W(q,A)));var ke;return x>0?ke=M(x,A):ke=null,ke===null?(A.needReadable=A.length<=A.highWaterMark,x=0):(A.length-=x,A.awaitDrain=0),A.length===0&&(A.ended||(A.needReadable=!0),q!==x&&A.ended&&H(this)),ke!==null&&this.emit("data",ke),ke};function ie(x,A){if(l("onEofChunk"),!A.ended){if(A.decoder){var q=A.decoder.end();q&&q.length&&(A.buffer.push(q),A.length+=A.objectMode?1:q.length)}A.ended=!0,A.sync?te(x):(A.needReadable=!1,A.emittedReadable||(A.emittedReadable=!0,re(x)))}}function te(x){var A=x._readableState;l("emitReadable",A.needReadable,A.emittedReadable),A.needReadable=!1,A.emittedReadable||(l("emitReadable",A.flowing),A.emittedReadable=!0,process.nextTick(re,x))}function re(x){var A=x._readableState;l("emitReadable_",A.destroyed,A.length,A.ended),!A.destroyed&&(A.length||A.ended)&&(x.emit("readable"),A.emittedReadable=!1),A.needReadable=!A.flowing&&!A.ended&&A.length<=A.highWaterMark,$(x)}function N(x,A){A.readingMore||(A.readingMore=!0,process.nextTick(ae,x,A))}function ae(x,A){for(;!A.reading&&!A.ended&&(A.length<A.highWaterMark||A.flowing&&A.length===0);){var q=A.length;if(l("maybeReadMore read 0"),x.read(0),q===A.length)break}A.readingMore=!1}D.prototype._read=function(x){S(this,new k("_read()"))},D.prototype.pipe=function(x,A){var q=this,ee=this._readableState;switch(ee.pipesCount){case 0:ee.pipes=x;break;case 1:ee.pipes=[ee.pipes,x];break;default:ee.pipes.push(x);break}ee.pipesCount+=1,l("pipe count=%d opts=%j",ee.pipesCount,A);var ke=(!A||A.end!==!1)&&x!==process.stdout&&x!==process.stderr,le=ke?Xe:oe;ee.endEmitted?process.nextTick(le):q.once("end",le),x.on("unpipe",fe);function fe(g,c){l("onunpipe"),g===q&&c&&c.hasUnpiped===!1&&(c.hasUnpiped=!0,Re())}function Xe(){l("onend"),x.end()}var Ze=J(q);x.on("drain",Ze);var Ue=!1;function Re(){l("cleanup"),x.removeListener("close",Ye),x.removeListener("finish",je),x.removeListener("drain",Ze),x.removeListener("error",Ne),x.removeListener("unpipe",fe),q.removeListener("end",Xe),q.removeListener("end",oe),q.removeListener("data",De),Ue=!0,ee.awaitDrain&&(!x._writableState||x._writableState.needDrain)&&Ze()}q.on("data",De);function De(g){l("ondata");var c=x.write(g);l("dest.write",c),c===!1&&((ee.pipesCount===1&&ee.pipes===x||ee.pipesCount>1&&se(ee.pipes,x)!==-1)&&!Ue&&(l("false write response, pause",ee.awaitDrain),ee.awaitDrain++),q.pause())}function Ne(g){l("onerror",g),oe(),x.removeListener("error",Ne),t(x,"error")===0&&S(x,g)}I(x,"error",Ne);function Ye(){x.removeListener("finish",je),oe()}x.once("close",Ye);function je(){l("onfinish"),x.removeListener("close",Ye),oe()}x.once("finish",je);function oe(){l("unpipe"),q.unpipe(x)}return x.emit("pipe",q),ee.flowing||(l("pipe resume"),q.resume()),x};function J(x){return function(){var q=x._readableState;l("pipeOnDrain",q.awaitDrain),q.awaitDrain&&q.awaitDrain--,q.awaitDrain===0&&t(x,"data")&&(q.flowing=!0,$(x))}}D.prototype.unpipe=function(x){var A=this._readableState,q={hasUnpiped:!1};if(A.pipesCount===0)return this;if(A.pipesCount===1)return x&&x!==A.pipes?this:(x||(x=A.pipes),A.pipes=null,A.pipesCount=0,A.flowing=!1,x&&x.emit("unpipe",this,q),this);if(!x){var ee=A.pipes,ke=A.pipesCount;A.pipes=null,A.pipesCount=0,A.flowing=!1;for(var le=0;le<ke;le++)ee[le].emit("unpipe",this,{hasUnpiped:!1});return this}var fe=se(A.pipes,x);return fe===-1?this:(A.pipes.splice(fe,1),A.pipesCount-=1,A.pipesCount===1&&(A.pipes=A.pipes[0]),x.emit("unpipe",this,q),this)},D.prototype.on=function(x,A){var q=i.prototype.on.call(this,x,A),ee=this._readableState;return x==="data"?(ee.readableListening=this.listenerCount("readable")>0,ee.flowing!==!1&&this.resume()):x==="readable"&&!ee.endEmitted&&!ee.readableListening&&(ee.readableListening=ee.needReadable=!0,ee.flowing=!1,ee.emittedReadable=!1,l("on readable",ee.length,ee.reading),ee.length?te(this):ee.reading||process.nextTick(ne,this)),q},D.prototype.addListener=D.prototype.on,D.prototype.removeListener=function(x,A){var q=i.prototype.removeListener.call(this,x,A);return x==="readable"&&process.nextTick(K,this),q},D.prototype.removeAllListeners=function(x){var A=i.prototype.removeAllListeners.apply(this,arguments);return(x==="readable"||x===void 0)&&process.nextTick(K,this),A};function K(x){var A=x._readableState;A.readableListening=x.listenerCount("readable")>0,A.resumeScheduled&&!A.paused?A.flowing=!0:x.listenerCount("data")>0&&x.resume()}function ne(x){l("readable nexttick read 0"),x.read(0)}D.prototype.resume=function(){var x=this._readableState;return x.flowing||(l("resume"),x.flowing=!x.readableListening,de(this,x)),x.paused=!1,this};function de(x,A){A.resumeScheduled||(A.resumeScheduled=!0,process.nextTick(G,x,A))}function G(x,A){l("resume",A.reading),A.reading||x.read(0),A.resumeScheduled=!1,x.emit("resume"),$(x),A.flowing&&!A.reading&&x.read(0)}D.prototype.pause=function(){return l("call pause flowing=%j",this._readableState.flowing),this._readableState.flowing!==!1&&(l("pause"),this._readableState.flowing=!1,this.emit("pause")),this._readableState.paused=!0,this};function $(x){var A=x._readableState;for(l("flow",A.flowing);A.flowing&&x.read()!==null;);}D.prototype.wrap=function(x){var A=this,q=this._readableState,ee=!1;x.on("end",function(){if(l("wrapped end"),q.decoder&&!q.ended){var fe=q.decoder.end();fe&&fe.length&&A.push(fe)}A.push(null)}),x.on("data",function(fe){if(l("wrapped data"),q.decoder&&(fe=q.decoder.write(fe)),!(q.objectMode&&fe==null)&&!(!q.objectMode&&(!fe||!fe.length))){var Xe=A.push(fe);Xe||(ee=!0,x.pause())}});for(var ke in x)this[ke]===void 0&&typeof x[ke]=="function"&&(this[ke]=function(Xe){return function(){return x[Xe].apply(x,arguments)}}(ke));for(var le=0;le<T.length;le++)x.on(T[le],this.emit.bind(this,T[le]));return this._read=function(fe){l("wrapped _read",fe),ee&&(ee=!1,x.resume())},this},typeof Symbol=="function"&&(D.prototype[Symbol.asyncIterator]=function(){return E===void 0&&(E=gp()),E(this)}),Object.defineProperty(D.prototype,"readableHighWaterMark",{enumerable:!1,get:function(){return this._readableState.highWaterMark}}),Object.defineProperty(D.prototype,"readableBuffer",{enumerable:!1,get:function(){return this._readableState&&this._readableState.buffer}}),Object.defineProperty(D.prototype,"readableFlowing",{enumerable:!1,get:function(){return this._readableState.flowing},set:function(A){this._readableState&&(this._readableState.flowing=A)}}),D._fromList=M,Object.defineProperty(D.prototype,"readableLength",{enumerable:!1,get:function(){return this._readableState.length}});function M(x,A){if(A.length===0)return null;var q;return A.objectMode?q=A.buffer.shift():!x||x>=A.length?(A.decoder?q=A.buffer.join(""):A.buffer.length===1?q=A.buffer.first():q=A.buffer.concat(A.length),A.buffer.clear()):q=A.buffer.consume(x,A.decoder),q}function H(x){var A=x._readableState;l("endReadable",A.endEmitted),A.endEmitted||(A.ended=!0,process.nextTick(Q,A,x))}function Q(x,A){if(l("endReadableNT",x.endEmitted,x.length),!x.endEmitted&&x.length===0&&(x.endEmitted=!0,A.readable=!1,A.emit("end"),x.autoDestroy)){var q=A._writableState;(!q||q.autoDestroy&&q.finished)&&A.destroy()}}typeof Symbol=="function"&&(D.from=function(x,A){return C===void 0&&(C=yp()),C(D,x,A)});function se(x,A){for(var q=0,ee=x.length;q<ee;q++)if(x[q]===A)return q;return-1}return Ta}var mc=Dt,jr=wi.codes,vp=jr.ERR_METHOD_NOT_IMPLEMENTED,bp=jr.ERR_MULTIPLE_CALLBACK,wp=jr.ERR_TRANSFORM_ALREADY_TRANSFORMING,kp=jr.ERR_TRANSFORM_WITH_LENGTH_0,Kr=Ni();Tn(Dt,Kr);function _p(e,t){var i=this._transformState;i.transforming=!1;var n=i.writecb;if(n===null)return this.emit("error",new bp);i.writechunk=null,i.writecb=null,t!=null&&this.push(t),n(e);var r=this._readableState;r.reading=!1,(r.needReadable||r.length<r.highWaterMark)&&this._read(r.highWaterMark)}function Dt(e){if(!(this instanceof Dt))return new Dt(e);Kr.call(this,e),this._transformState={afterTransform:_p.bind(this),needTransform:!1,transforming:!1,writecb:null,writechunk:null,writeencoding:null},this._readableState.needReadable=!0,this._readableState.sync=!1,e&&(typeof e.transform=="function"&&(this._transform=e.transform),typeof e.flush=="function"&&(this._flush=e.flush)),this.on("prefinish",Sp)}function Sp(){var e=this;typeof this._flush=="function"&&!this._readableState.destroyed?this._flush(function(t,i){Oo(e,t,i)}):Oo(this,null,null)}Dt.prototype.push=function(e,t){return this._transformState.needTransform=!1,Kr.prototype.push.call(this,e,t)};Dt.prototype._transform=function(e,t,i){i(new vp("_transform()"))};Dt.prototype._write=function(e,t,i){var n=this._transformState;if(n.writecb=i,n.writechunk=e,n.writeencoding=t,!n.transforming){var r=this._readableState;(n.needTransform||r.needReadable||r.length<r.highWaterMark)&&this._read(r.highWaterMark)}};Dt.prototype._read=function(e){var t=this._transformState;t.writechunk!==null&&!t.transforming?(t.transforming=!0,this._transform(t.writechunk,t.writeencoding,t.afterTransform)):t.needTransform=!0};Dt.prototype._destroy=function(e,t){Kr.prototype._destroy.call(this,e,function(i){t(i)})};function Oo(e,t,i){if(t)return e.emit("error",t);if(i!=null&&e.push(i),e._writableState.length)throw new kp;if(e._transformState.transforming)throw new wp;return e.push(null)}var xp=wn,gc=mc;Tn(wn,gc);function wn(e){if(!(this instanceof wn))return new wn(e);gc.call(this,e)}wn.prototype._transform=function(e,t,i){i(null,e)};var Aa;function Ep(e){var t=!1;return function(){t||(t=!0,e.apply(void 0,arguments))}}var yc=wi.codes,Tp=yc.ERR_MISSING_ARGS,Ap=yc.ERR_STREAM_DESTROYED;function No(e){if(e)throw e}function Cp(e){return e.setHeader&&typeof e.abort=="function"}function Lp(e,t,i,n){n=Ep(n);var r=!1;e.on("close",function(){r=!0}),Aa===void 0&&(Aa=Cs),Aa(e,{readable:t,writable:i},function(o){if(o)return n(o);r=!0,n()});var a=!1;return function(o){if(!r&&!a){if(a=!0,Cp(e))return e.abort();if(typeof e.destroy=="function")return e.destroy();n(o||new Ap("pipe"))}}}function Ho(e){e()}function Ip(e,t){return e.pipe(t)}function Rp(e){return!e.length||typeof e[e.length-1]!="function"?No:e.pop()}function $p(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];var n=Rp(t);if(Array.isArray(t[0])&&(t=t[0]),t.length<2)throw new Tp("streams");var r,a=t.map(function(o,s){var l=s<t.length-1,d=s>0;return Lp(o,l,d,function(p){r||(r=p),p&&a.forEach(Ho),!l&&(a.forEach(Ho),n(r))})});return t.reduce(Ip)}var Mp=$p;(function(e,t){t=e.exports=fc(),t.Stream=t,t.Readable=t,t.Writable=pc(),t.Duplex=Ni(),t.Transform=mc,t.PassThrough=xp,t.finished=Cs,t.pipeline=Mp})(Ja,Ja.exports);var vc=Ja.exports;function qo(e,t){for(const i in t)Object.defineProperty(e,i,{value:t[i],enumerable:!0,configurable:!0});return e}function Pp(e,t,i){if(!e||typeof e=="string")throw new TypeError("Please pass an Error to err-code");i||(i={}),typeof t=="object"&&(i=t,t=""),t&&(i.code=t);try{return qo(e,i)}catch{i.message=e.message,i.stack=e.stack;const r=function(){};return r.prototype=Object.create(Object.getPrototypeOf(e)),qo(new r,i)}}var Bp=Pp;const Dp=Nr("simple-peer"),bc=Nu,Fo=As,zp=vc,Ca=Fr,ve=Bp,{Buffer:Op}=vi,La=64*1024,Np=5*1e3,Hp=5*1e3;function Uo(e){return e.replace(/a=ice-options:trickle\s\n/g,"")}let Wr=class Qa extends zp.Duplex{constructor(t){if(t=Object.assign({allowHalfOpen:!1},t),super(t),this._id=Fo(4).toString("hex").slice(0,7),this._debug("new peer %o",t),this.channelName=t.initiator?t.channelName||Fo(20).toString("hex"):null,this.initiator=t.initiator||!1,this.channelConfig=t.channelConfig||Qa.channelConfig,this.channelNegotiated=this.channelConfig.negotiated,this.config=Object.assign({},Qa.config,t.config),this.offerOptions=t.offerOptions||{},this.answerOptions=t.answerOptions||{},this.sdpTransform=t.sdpTransform||(i=>i),this.streams=t.streams||(t.stream?[t.stream]:[]),this.trickle=t.trickle!==void 0?t.trickle:!0,this.allowHalfTrickle=t.allowHalfTrickle!==void 0?t.allowHalfTrickle:!1,this.iceCompleteTimeout=t.iceCompleteTimeout||Np,this.destroyed=!1,this.destroying=!1,this._connected=!1,this.remoteAddress=void 0,this.remoteFamily=void 0,this.remotePort=void 0,this.localAddress=void 0,this.localFamily=void 0,this.localPort=void 0,this._wrtc=t.wrtc&&typeof t.wrtc=="object"?t.wrtc:bc(),!this._wrtc)throw ve(typeof window>"u"?new Error("No WebRTC support: Specify `opts.wrtc` option in this environment"):new Error("No WebRTC support: Not a supported browser"),"ERR_WEBRTC_SUPPORT");this._pcReady=!1,this._channelReady=!1,this._iceComplete=!1,this._iceCompleteTimer=null,this._channel=null,this._pendingCandidates=[],this._isNegotiating=!1,this._firstNegotiation=!0,this._batchedNegotiation=!1,this._queuedNegotiation=!1,this._sendersAwaitingStable=[],this._senderMap=new Map,this._closingInterval=null,this._remoteTracks=[],this._remoteStreams=[],this._chunk=null,this._cb=null,this._interval=null;try{this._pc=new this._wrtc.RTCPeerConnection(this.config)}catch(i){this.destroy(ve(i,"ERR_PC_CONSTRUCTOR"));return}this._isReactNativeWebrtc=typeof this._pc._peerConnectionId=="number",this._pc.oniceconnectionstatechange=()=>{this._onIceStateChange()},this._pc.onicegatheringstatechange=()=>{this._onIceStateChange()},this._pc.onconnectionstatechange=()=>{this._onConnectionStateChange()},this._pc.onsignalingstatechange=()=>{this._onSignalingStateChange()},this._pc.onicecandidate=i=>{this._onIceCandidate(i)},typeof this._pc.peerIdentity=="object"&&this._pc.peerIdentity.catch(i=>{this.destroy(ve(i,"ERR_PC_PEER_IDENTITY"))}),this.initiator||this.channelNegotiated?this._setupData({channel:this._pc.createDataChannel(this.channelName,this.channelConfig)}):this._pc.ondatachannel=i=>{this._setupData(i)},this.streams&&this.streams.forEach(i=>{this.addStream(i)}),this._pc.ontrack=i=>{this._onTrack(i)},this._debug("initial negotiation"),this._needsNegotiation(),this._onFinishBound=()=>{this._onFinish()},this.once("finish",this._onFinishBound)}get bufferSize(){return this._channel&&this._channel.bufferedAmount||0}get connected(){return this._connected&&this._channel.readyState==="open"}address(){return{port:this.localPort,family:this.localFamily,address:this.localAddress}}signal(t){if(!this.destroying){if(this.destroyed)throw ve(new Error("cannot signal after peer is destroyed"),"ERR_DESTROYED");if(typeof t=="string")try{t=JSON.parse(t)}catch{t={}}this._debug("signal()"),t.renegotiate&&this.initiator&&(this._debug("got request to renegotiate"),this._needsNegotiation()),t.transceiverRequest&&this.initiator&&(this._debug("got request for transceiver"),this.addTransceiver(t.transceiverRequest.kind,t.transceiverRequest.init)),t.candidate&&(this._pc.remoteDescription&&this._pc.remoteDescription.type?this._addIceCandidate(t.candidate):this._pendingCandidates.push(t.candidate)),t.sdp&&this._pc.setRemoteDescription(new this._wrtc.RTCSessionDescription(t)).then(()=>{this.destroyed||(this._pendingCandidates.forEach(i=>{this._addIceCandidate(i)}),this._pendingCandidates=[],this._pc.remoteDescription.type==="offer"&&this._createAnswer())}).catch(i=>{this.destroy(ve(i,"ERR_SET_REMOTE_DESCRIPTION"))}),!t.sdp&&!t.candidate&&!t.renegotiate&&!t.transceiverRequest&&this.destroy(ve(new Error("signal() called with invalid signal data"),"ERR_SIGNALING"))}}_addIceCandidate(t){const i=new this._wrtc.RTCIceCandidate(t);this._pc.addIceCandidate(i).catch(n=>{!i.address||i.address.endsWith(".local")?void 0:this.destroy(ve(n,"ERR_ADD_ICE_CANDIDATE"))})}send(t){if(!this.destroying){if(this.destroyed)throw ve(new Error("cannot send after peer is destroyed"),"ERR_DESTROYED");this._channel.send(t)}}addTransceiver(t,i){if(!this.destroying){if(this.destroyed)throw ve(new Error("cannot addTransceiver after peer is destroyed"),"ERR_DESTROYED");if(this._debug("addTransceiver()"),this.initiator)try{this._pc.addTransceiver(t,i),this._needsNegotiation()}catch(n){this.destroy(ve(n,"ERR_ADD_TRANSCEIVER"))}else this.emit("signal",{type:"transceiverRequest",transceiverRequest:{kind:t,init:i}})}}addStream(t){if(!this.destroying){if(this.destroyed)throw ve(new Error("cannot addStream after peer is destroyed"),"ERR_DESTROYED");this._debug("addStream()"),t.getTracks().forEach(i=>{this.addTrack(i,t)})}}addTrack(t,i){if(this.destroying)return;if(this.destroyed)throw ve(new Error("cannot addTrack after peer is destroyed"),"ERR_DESTROYED");this._debug("addTrack()");const n=this._senderMap.get(t)||new Map;let r=n.get(i);if(!r)r=this._pc.addTrack(t,i),n.set(i,r),this._senderMap.set(t,n),this._needsNegotiation();else throw r.removed?ve(new Error("Track has been removed. You should enable/disable tracks that you want to re-add."),"ERR_SENDER_REMOVED"):ve(new Error("Track has already been added to that stream."),"ERR_SENDER_ALREADY_ADDED")}replaceTrack(t,i,n){if(this.destroying)return;if(this.destroyed)throw ve(new Error("cannot replaceTrack after peer is destroyed"),"ERR_DESTROYED");this._debug("replaceTrack()");const r=this._senderMap.get(t),a=r?r.get(n):null;if(!a)throw ve(new Error("Cannot replace track that was never added."),"ERR_TRACK_NOT_ADDED");i&&this._senderMap.set(i,r),a.replaceTrack!=null?a.replaceTrack(i):this.destroy(ve(new Error("replaceTrack is not supported in this browser"),"ERR_UNSUPPORTED_REPLACETRACK"))}removeTrack(t,i){if(this.destroying)return;if(this.destroyed)throw ve(new Error("cannot removeTrack after peer is destroyed"),"ERR_DESTROYED");this._debug("removeSender()");const n=this._senderMap.get(t),r=n?n.get(i):null;if(!r)throw ve(new Error("Cannot remove track that was never added."),"ERR_TRACK_NOT_ADDED");try{r.removed=!0,this._pc.removeTrack(r)}catch(a){a.name==="NS_ERROR_UNEXPECTED"?this._sendersAwaitingStable.push(r):this.destroy(ve(a,"ERR_REMOVE_TRACK"))}this._needsNegotiation()}removeStream(t){if(!this.destroying){if(this.destroyed)throw ve(new Error("cannot removeStream after peer is destroyed"),"ERR_DESTROYED");this._debug("removeSenders()"),t.getTracks().forEach(i=>{this.removeTrack(i,t)})}}_needsNegotiation(){this._debug("_needsNegotiation"),!this._batchedNegotiation&&(this._batchedNegotiation=!0,Ca(()=>{this._batchedNegotiation=!1,this.initiator||!this._firstNegotiation?(this._debug("starting batched negotiation"),this.negotiate()):this._debug("non-initiator initial negotiation request discarded"),this._firstNegotiation=!1}))}negotiate(){if(!this.destroying){if(this.destroyed)throw ve(new Error("cannot negotiate after peer is destroyed"),"ERR_DESTROYED");this.initiator?this._isNegotiating?(this._queuedNegotiation=!0,this._debug("already negotiating, queueing")):(this._debug("start negotiation"),setTimeout(()=>{this._createOffer()},0)):this._isNegotiating?(this._queuedNegotiation=!0,this._debug("already negotiating, queueing")):(this._debug("requesting negotiation from initiator"),this.emit("signal",{type:"renegotiate",renegotiate:!0})),this._isNegotiating=!0}}destroy(t){this._destroy(t,()=>{})}_destroy(t,i){this.destroyed||this.destroying||(this.destroying=!0,this._debug("destroying (error: %s)",t&&(t.message||t)),Ca(()=>{if(this.destroyed=!0,this.destroying=!1,this._debug("destroy (error: %s)",t&&(t.message||t)),this.readable=this.writable=!1,this._readableState.ended||this.push(null),this._writableState.finished||this.end(),this._connected=!1,this._pcReady=!1,this._channelReady=!1,this._remoteTracks=null,this._remoteStreams=null,this._senderMap=null,clearInterval(this._closingInterval),this._closingInterval=null,clearInterval(this._interval),this._interval=null,this._chunk=null,this._cb=null,this._onFinishBound&&this.removeListener("finish",this._onFinishBound),this._onFinishBound=null,this._channel){try{this._channel.close()}catch{}this._channel.onmessage=null,this._channel.onopen=null,this._channel.onclose=null,this._channel.onerror=null}if(this._pc){try{this._pc.close()}catch{}this._pc.oniceconnectionstatechange=null,this._pc.onicegatheringstatechange=null,this._pc.onsignalingstatechange=null,this._pc.onicecandidate=null,this._pc.ontrack=null,this._pc.ondatachannel=null}this._pc=null,this._channel=null,t&&this.emit("error",t),this.emit("close"),i()}))}_setupData(t){if(!t.channel)return this.destroy(ve(new Error("Data channel event is missing `channel` property"),"ERR_DATA_CHANNEL"));this._channel=t.channel,this._channel.binaryType="arraybuffer",typeof this._channel.bufferedAmountLowThreshold=="number"&&(this._channel.bufferedAmountLowThreshold=La),this.channelName=this._channel.label,this._channel.onmessage=n=>{this._onChannelMessage(n)},this._channel.onbufferedamountlow=()=>{this._onChannelBufferedAmountLow()},this._channel.onopen=()=>{this._onChannelOpen()},this._channel.onclose=()=>{this._onChannelClose()},this._channel.onerror=n=>{const r=n.error instanceof Error?n.error:new Error(`Datachannel error: ${n.message} ${n.filename}:${n.lineno}:${n.colno}`);this.destroy(ve(r,"ERR_DATA_CHANNEL"))};let i=!1;this._closingInterval=setInterval(()=>{this._channel&&this._channel.readyState==="closing"?(i&&this._onChannelClose(),i=!0):i=!1},Hp)}_read(){}_write(t,i,n){if(this.destroyed)return n(ve(new Error("cannot write after peer is destroyed"),"ERR_DATA_CHANNEL"));if(this._connected){try{this.send(t)}catch(r){return this.destroy(ve(r,"ERR_DATA_CHANNEL"))}this._channel.bufferedAmount>La?(this._debug("start backpressure: bufferedAmount %d",this._channel.bufferedAmount),this._cb=n):n(null)}else this._debug("write before connect"),this._chunk=t,this._cb=n}_onFinish(){if(this.destroyed)return;const t=()=>{setTimeout(()=>this.destroy(),1e3)};this._connected?t():this.once("connect",t)}_startIceCompleteTimeout(){this.destroyed||this._iceCompleteTimer||(this._debug("started iceComplete timeout"),this._iceCompleteTimer=setTimeout(()=>{this._iceComplete||(this._iceComplete=!0,this._debug("iceComplete timeout completed"),this.emit("iceTimeout"),this.emit("_iceComplete"))},this.iceCompleteTimeout))}_createOffer(){this.destroyed||this._pc.createOffer(this.offerOptions).then(t=>{if(this.destroyed)return;!this.trickle&&!this.allowHalfTrickle&&(t.sdp=Uo(t.sdp)),t.sdp=this.sdpTransform(t.sdp);const i=()=>{if(this.destroyed)return;const a=this._pc.localDescription||t;this._debug("signal"),this.emit("signal",{type:a.type,sdp:a.sdp})},n=()=>{this._debug("createOffer success"),!this.destroyed&&(this.trickle||this._iceComplete?i():this.once("_iceComplete",i))},r=a=>{this.destroy(ve(a,"ERR_SET_LOCAL_DESCRIPTION"))};this._pc.setLocalDescription(t).then(n).catch(r)}).catch(t=>{this.destroy(ve(t,"ERR_CREATE_OFFER"))})}_requestMissingTransceivers(){this._pc.getTransceivers&&this._pc.getTransceivers().forEach(t=>{!t.mid&&t.sender.track&&!t.requested&&(t.requested=!0,this.addTransceiver(t.sender.track.kind))})}_createAnswer(){this.destroyed||this._pc.createAnswer(this.answerOptions).then(t=>{if(this.destroyed)return;!this.trickle&&!this.allowHalfTrickle&&(t.sdp=Uo(t.sdp)),t.sdp=this.sdpTransform(t.sdp);const i=()=>{if(this.destroyed)return;const a=this._pc.localDescription||t;this._debug("signal"),this.emit("signal",{type:a.type,sdp:a.sdp}),this.initiator||this._requestMissingTransceivers()},n=()=>{this.destroyed||(this.trickle||this._iceComplete?i():this.once("_iceComplete",i))},r=a=>{this.destroy(ve(a,"ERR_SET_LOCAL_DESCRIPTION"))};this._pc.setLocalDescription(t).then(n).catch(r)}).catch(t=>{this.destroy(ve(t,"ERR_CREATE_ANSWER"))})}_onConnectionStateChange(){this.destroyed||this._pc.connectionState==="failed"&&this.destroy(ve(new Error("Connection failed."),"ERR_CONNECTION_FAILURE"))}_onIceStateChange(){if(this.destroyed)return;const t=this._pc.iceConnectionState,i=this._pc.iceGatheringState;this._debug("iceStateChange (connection: %s) (gathering: %s)",t,i),this.emit("iceStateChange",t,i),(t==="connected"||t==="completed")&&(this._pcReady=!0,this._maybeReady()),t==="failed"&&this.destroy(ve(new Error("Ice connection failed."),"ERR_ICE_CONNECTION_FAILURE")),t==="closed"&&this.destroy(ve(new Error("Ice connection closed."),"ERR_ICE_CONNECTION_CLOSED"))}getStats(t){const i=n=>(Object.prototype.toString.call(n.values)==="[object Array]"&&n.values.forEach(r=>{Object.assign(n,r)}),n);this._pc.getStats.length===0||this._isReactNativeWebrtc?this._pc.getStats().then(n=>{const r=[];n.forEach(a=>{r.push(i(a))}),t(null,r)},n=>t(n)):this._pc.getStats.length>0?this._pc.getStats(n=>{if(this.destroyed)return;const r=[];n.result().forEach(a=>{const o={};a.names().forEach(s=>{o[s]=a.stat(s)}),o.id=a.id,o.type=a.type,o.timestamp=a.timestamp,r.push(i(o))}),t(null,r)},n=>t(n)):t(null,[])}_maybeReady(){if(this._debug("maybeReady pc %s channel %s",this._pcReady,this._channelReady),this._connected||this._connecting||!this._pcReady||!this._channelReady)return;this._connecting=!0;const t=()=>{this.destroyed||this.getStats((i,n)=>{if(this.destroyed)return;i&&(n=[]);const r={},a={},o={};let s=!1;n.forEach(d=>{(d.type==="remotecandidate"||d.type==="remote-candidate")&&(r[d.id]=d),(d.type==="localcandidate"||d.type==="local-candidate")&&(a[d.id]=d),(d.type==="candidatepair"||d.type==="candidate-pair")&&(o[d.id]=d)});const l=d=>{s=!0;let p=a[d.localCandidateId];p&&(p.ip||p.address)?(this.localAddress=p.ip||p.address,this.localPort=Number(p.port)):p&&p.ipAddress?(this.localAddress=p.ipAddress,this.localPort=Number(p.portNumber)):typeof d.googLocalAddress=="string"&&(p=d.googLocalAddress.split(":"),this.localAddress=p[0],this.localPort=Number(p[1])),this.localAddress&&(this.localFamily=this.localAddress.includes(":")?"IPv6":"IPv4");let h=r[d.remoteCandidateId];h&&(h.ip||h.address)?(this.remoteAddress=h.ip||h.address,this.remotePort=Number(h.port)):h&&h.ipAddress?(this.remoteAddress=h.ipAddress,this.remotePort=Number(h.portNumber)):typeof d.googRemoteAddress=="string"&&(h=d.googRemoteAddress.split(":"),this.remoteAddress=h[0],this.remotePort=Number(h[1])),this.remoteAddress&&(this.remoteFamily=this.remoteAddress.includes(":")?"IPv6":"IPv4"),this._debug("connect local: %s:%s remote: %s:%s",this.localAddress,this.localPort,this.remoteAddress,this.remotePort)};if(n.forEach(d=>{d.type==="transport"&&d.selectedCandidatePairId&&l(o[d.selectedCandidatePairId]),(d.type==="googCandidatePair"&&d.googActiveConnection==="true"||(d.type==="candidatepair"||d.type==="candidate-pair")&&d.selected)&&l(d)}),!s&&(!Object.keys(o).length||Object.keys(a).length)){setTimeout(t,100);return}else this._connecting=!1,this._connected=!0;if(this._chunk){try{this.send(this._chunk)}catch(p){return this.destroy(ve(p,"ERR_DATA_CHANNEL"))}this._chunk=null,this._debug('sent chunk from "write before connect"');const d=this._cb;this._cb=null,d(null)}typeof this._channel.bufferedAmountLowThreshold!="number"&&(this._interval=setInterval(()=>this._onInterval(),150),this._interval.unref&&this._interval.unref()),this._debug("connect"),this.emit("connect")})};t()}_onInterval(){!this._cb||!this._channel||this._channel.bufferedAmount>La||this._onChannelBufferedAmountLow()}_onSignalingStateChange(){this.destroyed||(this._pc.signalingState==="stable"&&(this._isNegotiating=!1,this._debug("flushing sender queue",this._sendersAwaitingStable),this._sendersAwaitingStable.forEach(t=>{this._pc.removeTrack(t),this._queuedNegotiation=!0}),this._sendersAwaitingStable=[],this._queuedNegotiation?(this._debug("flushing negotiation queue"),this._queuedNegotiation=!1,this._needsNegotiation()):(this._debug("negotiated"),this.emit("negotiated"))),this._debug("signalingStateChange %s",this._pc.signalingState),this.emit("signalingStateChange",this._pc.signalingState))}_onIceCandidate(t){this.destroyed||(t.candidate&&this.trickle?this.emit("signal",{type:"candidate",candidate:{candidate:t.candidate.candidate,sdpMLineIndex:t.candidate.sdpMLineIndex,sdpMid:t.candidate.sdpMid}}):!t.candidate&&!this._iceComplete&&(this._iceComplete=!0,this.emit("_iceComplete")),t.candidate&&this._startIceCompleteTimeout())}_onChannelMessage(t){if(this.destroyed)return;let i=t.data;i instanceof ArrayBuffer&&(i=Op.from(i)),this.push(i)}_onChannelBufferedAmountLow(){if(this.destroyed||!this._cb)return;this._debug("ending backpressure: bufferedAmount %d",this._channel.bufferedAmount);const t=this._cb;this._cb=null,t(null)}_onChannelOpen(){this._connected||this.destroyed||(this._debug("on channel open"),this._channelReady=!0,this._maybeReady())}_onChannelClose(){this.destroyed||(this._debug("on channel close"),this.destroy())}_onTrack(t){this.destroyed||t.streams.forEach(i=>{this._debug("on track"),this.emit("track",t.track,i),this._remoteTracks.push({track:t.track,stream:i}),!this._remoteStreams.some(n=>n.id===i.id)&&(this._remoteStreams.push(i),Ca(()=>{this._debug("on stream"),this.emit("stream",i)}))})}_debug(){const t=[].slice.call(arguments);t[0]="["+this._id+"] "+t[0],Dp.apply(null,t)}};Wr.WEBRTC_SUPPORT=!!bc();Wr.config={iceServers:[{urls:["stun:stun.l.google.com:19302","stun:global.stun.twilio.com:3478"]}],sdpSemantics:"unified-plan"};Wr.channelConfig={};var wc=Wr,Ls={};(function(e){e.DEFAULT_ANNOUNCE_PEERS=50,e.MAX_ANNOUNCE_PEERS=82,e.binaryToHex=i=>(typeof i!="string"&&(i=String(i)),Buffer.from(i,"binary").toString("hex")),e.hexToBinary=i=>(typeof i!="string"&&(i=String(i)),Buffer.from(i,"hex").toString("binary")),e.parseUrl=i=>{const n=new URL(i.replace(/^udp:/,"http:"));return i.match(/^udp:/)&&Object.defineProperties(n,{href:{value:n.href.replace(/^http/,"udp")},protocol:{value:n.protocol.replace(/^http/,"udp")},origin:{value:n.origin.replace(/^http/,"udp")}}),n},Object.assign(e,bi)})(Ls);var kc={exports:{}};(function(e){var t=function(){function i(f,b){return b!=null&&f instanceof b}var n;try{n=Map}catch{n=function(){}}var r;try{r=Set}catch{r=function(){}}var a;try{a=Promise}catch{a=function(){}}function o(f,b,v,y,k){typeof b=="object"&&(v=b.depth,y=b.prototype,k=b.includeNonEnumerable,b=b.circular);var m=[],w=[],E=typeof Buffer<"u";typeof b>"u"&&(b=!0),typeof v>"u"&&(v=1/0);function C(S,T){if(S===null)return null;if(T===0)return S;var I,L;if(typeof S!="object")return S;if(i(S,n))I=new n;else if(i(S,r))I=new r;else if(i(S,a))I=new a(function(te,re){S.then(function(N){te(C(N,T-1))},function(N){re(C(N,T-1))})});else if(o.__isArray(S))I=[];else if(o.__isRegExp(S))I=new RegExp(S.source,h(S)),S.lastIndex&&(I.lastIndex=S.lastIndex);else if(o.__isDate(S))I=new Date(S.getTime());else{if(E&&Buffer.isBuffer(S))return Buffer.allocUnsafe?I=Buffer.allocUnsafe(S.length):I=new Buffer(S.length),S.copy(I),I;i(S,Error)?I=Object.create(S):typeof y>"u"?(L=Object.getPrototypeOf(S),I=Object.create(L)):(I=Object.create(y),L=y)}if(b){var D=m.indexOf(S);if(D!=-1)return w[D];m.push(S),w.push(I)}i(S,n)&&S.forEach(function(te,re){var N=C(re,T-1),ae=C(te,T-1);I.set(N,ae)}),i(S,r)&&S.forEach(function(te){var re=C(te,T-1);I.add(re)});for(var O in S){var Y;L&&(Y=Object.getOwnPropertyDescriptor(L,O)),!(Y&&Y.set==null)&&(I[O]=C(S[O],T-1))}if(Object.getOwnPropertySymbols)for(var j=Object.getOwnPropertySymbols(S),O=0;O<j.length;O++){var z=j[O],B=Object.getOwnPropertyDescriptor(S,z);B&&!B.enumerable&&!k||(I[z]=C(S[z],T-1),B.enumerable||Object.defineProperty(I,z,{enumerable:!1}))}if(k)for(var W=Object.getOwnPropertyNames(S),O=0;O<W.length;O++){var ie=W[O],B=Object.getOwnPropertyDescriptor(S,ie);B&&B.enumerable||(I[ie]=C(S[ie],T-1),Object.defineProperty(I,ie,{enumerable:!1}))}return I}return C(f,v)}o.clonePrototype=function(b){if(b===null)return null;var v=function(){};return v.prototype=b,new v};function s(f){return Object.prototype.toString.call(f)}o.__objToStr=s;function l(f){return typeof f=="object"&&s(f)==="[object Date]"}o.__isDate=l;function d(f){return typeof f=="object"&&s(f)==="[object Array]"}o.__isArray=d;function p(f){return typeof f=="object"&&s(f)==="[object RegExp]"}o.__isRegExp=p;function h(f){var b="";return f.global&&(b+="g"),f.ignoreCase&&(b+="i"),f.multiline&&(b+="m"),b}return o.__getRegExpFlags=h,o}();e.exports&&(e.exports=t)})(kc);var qp=kc.exports;const Fp=Nr("simple-websocket"),Up=As,jp=vc,jo=Fr,dn=bi,sn=typeof dn!="function"?WebSocket:dn,Ko=64*1024;let _c=class extends jp.Duplex{constructor(t={}){if(typeof t=="string"&&(t={url:t}),t=Object.assign({allowHalfOpen:!1},t),super(t),t.url==null&&t.socket==null)throw new Error("Missing required `url` or `socket` option");if(t.url!=null&&t.socket!=null)throw new Error("Must specify either `url` or `socket` option, not both");if(this._id=Up(4).toString("hex").slice(0,7),this._debug("new websocket: %o",t),this.connected=!1,this.destroyed=!1,this._chunk=null,this._cb=null,this._interval=null,t.socket)this.url=t.socket.url,this._ws=t.socket,this.connected=t.socket.readyState===sn.OPEN;else{this.url=t.url;try{typeof dn=="function"?this._ws=new sn(t.url,null,{...t,encoding:void 0}):this._ws=new sn(t.url)}catch(i){jo(()=>this.destroy(i));return}}this._ws.binaryType="arraybuffer",t.socket&&this.connected?jo(()=>this._handleOpen()):this._ws.onopen=()=>this._handleOpen(),this._ws.onmessage=i=>this._handleMessage(i),this._ws.onclose=()=>this._handleClose(),this._ws.onerror=i=>this._handleError(i),this._handleFinishBound=()=>this._handleFinish(),this.once("finish",this._handleFinishBound)}send(t){this._ws.send(t)}destroy(t){this._destroy(t,()=>{})}_destroy(t,i){if(!this.destroyed){if(this._debug("destroy (error: %s)",t&&(t.message||t)),this.readable=this.writable=!1,this._readableState.ended||this.push(null),this._writableState.finished||this.end(),this.connected=!1,this.destroyed=!0,clearInterval(this._interval),this._interval=null,this._chunk=null,this._cb=null,this._handleFinishBound&&this.removeListener("finish",this._handleFinishBound),this._handleFinishBound=null,this._ws){const n=this._ws,r=()=>{n.onclose=null};if(n.readyState===sn.CLOSED)r();else try{n.onclose=r,n.close()}catch{r()}n.onopen=null,n.onmessage=null,n.onerror=()=>{}}this._ws=null,t&&this.emit("error",t),this.emit("close"),i()}}_read(){}_write(t,i,n){if(this.destroyed)return n(new Error("cannot write after socket is destroyed"));if(this.connected){try{this.send(t)}catch(r){return this.destroy(r)}typeof dn!="function"&&this._ws.bufferedAmount>Ko?(this._debug("start backpressure: bufferedAmount %d",this._ws.bufferedAmount),this._cb=n):n(null)}else this._debug("write before connect"),this._chunk=t,this._cb=n}_handleOpen(){if(!(this.connected||this.destroyed)){if(this.connected=!0,this._chunk){try{this.send(this._chunk)}catch(i){return this.destroy(i)}this._chunk=null,this._debug('sent chunk from "write before connect"');const t=this._cb;this._cb=null,t(null)}typeof dn!="function"&&(this._interval=setInterval(()=>this._onInterval(),150),this._interval.unref&&this._interval.unref()),this._debug("connect"),this.emit("connect")}}_handleMessage(t){if(this.destroyed)return;let i=t.data;i instanceof ArrayBuffer&&(i=Buffer.from(i)),this.push(i)}_handleClose(){this.destroyed||(this._debug("on close"),this.destroy())}_handleError(t){this.destroy(new Error(`Error connecting to ${this.url}`))}_handleFinish(){if(this.destroyed)return;const t=()=>{setTimeout(()=>this.destroy(),1e3)};this.connected?t():this.once("connect",t)}_onInterval(){if(!this._cb||!this._ws||this._ws.bufferedAmount>Ko)return;this._debug("ending backpressure: bufferedAmount %d",this._ws.bufferedAmount);const t=this._cb;this._cb=null,t(null)}_debug(){const t=[].slice.call(arguments);t[0]="["+this._id+"] "+t[0],Fp.apply(null,t)}};_c.WEBSOCKET_SUPPORT=!!sn;var Kp=_c;const Wp=qr;let Yp=class extends Wp{constructor(t,i){super(),this.client=t,this.announceUrl=i,this.interval=null,this.destroyed=!1}setInterval(t){t==null&&(t=this.DEFAULT_ANNOUNCE_INTERVAL),clearInterval(this.interval),t&&(this.interval=setInterval(()=>{this.announce(this.client._defaultAnnounceOpts())},t),this.interval.unref&&this.interval.unref())}};var Vp=Yp;const Gp=qp,wt=Nr("bittorrent-tracker:websocket-tracker"),Jp=wc,Xp=As,Zp=Kp,Qp=bi,Ft=Ls,eh=Vp,Rt={},th=10*1e3,ih=60*60*1e3,nh=5*60*1e3,rh=50*1e3;let Is=class extends eh{constructor(t,i){super(t,i),wt("new websocket tracker %s",i),this.peers={},this.socket=null,this.reconnecting=!1,this.retries=0,this.reconnectTimer=null,this.expectingResponse=!1,this._openSocket()}announce(t){if(this.destroyed||this.reconnecting)return;if(!this.socket.connected){this.socket.once("connect",()=>{this.announce(t)});return}const i=Object.assign({},t,{action:"announce",info_hash:this.client._infoHashBinary,peer_id:this.client._peerIdBinary});if(this._trackerId&&(i.trackerid=this._trackerId),t.event==="stopped"||t.event==="completed")this._send(i);else{const n=Math.min(t.numwant,5);this._generateOffers(n,r=>{i.numwant=n,i.offers=r,this._send(i)})}}scrape(t){if(this.destroyed||this.reconnecting)return;if(!this.socket.connected){this.socket.once("connect",()=>{this.scrape(t)});return}const n={action:"scrape",info_hash:Array.isArray(t.infoHash)&&t.infoHash.length>0?t.infoHash.map(r=>r.toString("binary")):t.infoHash&&t.infoHash.toString("binary")||this.client._infoHashBinary};this._send(n)}destroy(t=Wo){if(this.destroyed)return t(null);this.destroyed=!0,clearInterval(this.interval),clearTimeout(this.reconnectTimer);for(const a in this.peers){const o=this.peers[a];clearTimeout(o.trackerTimeout),o.destroy()}if(this.peers=null,this.socket&&(this.socket.removeListener("connect",this._onSocketConnectBound),this.socket.removeListener("data",this._onSocketDataBound),this.socket.removeListener("close",this._onSocketCloseBound),this.socket.removeListener("error",this._onSocketErrorBound),this.socket=null),this._onSocketConnectBound=null,this._onSocketErrorBound=null,this._onSocketDataBound=null,this._onSocketCloseBound=null,Rt[this.announceUrl]&&(Rt[this.announceUrl].consumers-=1),Rt[this.announceUrl].consumers>0)return t();let i=Rt[this.announceUrl];delete Rt[this.announceUrl],i.on("error",Wo),i.once("close",t);let n;if(!this.expectingResponse)return r();n=setTimeout(r,Ft.DESTROY_TIMEOUT),i.once("data",r);function r(){n&&(clearTimeout(n),n=null),i.removeListener("data",r),i.destroy(),i=null}}_openSocket(){if(this.destroyed=!1,this.peers||(this.peers={}),this._onSocketConnectBound=()=>{this._onSocketConnect()},this._onSocketErrorBound=t=>{this._onSocketError(t)},this._onSocketDataBound=t=>{this._onSocketData(t)},this._onSocketCloseBound=()=>{this._onSocketClose()},this.socket=Rt[this.announceUrl],this.socket)Rt[this.announceUrl].consumers+=1,this.socket.connected&&this._onSocketConnectBound();else{const t=new URL(this.announceUrl);let i;this.client._proxyOpts&&(i=t.protocol==="wss:"?this.client._proxyOpts.httpsAgent:this.client._proxyOpts.httpAgent,!i&&this.client._proxyOpts.socksProxy&&(i=new Qp.Agent(Gp(this.client._proxyOpts.socksProxy),t.protocol==="wss:"))),this.socket=Rt[this.announceUrl]=new Zp({url:this.announceUrl,agent:i}),this.socket.consumers=1,this.socket.once("connect",this._onSocketConnectBound)}this.socket.on("data",this._onSocketDataBound),this.socket.once("close",this._onSocketCloseBound),this.socket.once("error",this._onSocketErrorBound)}_onSocketConnect(){this.destroyed||this.reconnecting&&(this.reconnecting=!1,this.retries=0,this.announce(this.client._defaultAnnounceOpts()))}_onSocketData(t){if(!this.destroyed){this.expectingResponse=!1;try{t=JSON.parse(t)}catch{this.client.emit("warning",new Error("Invalid tracker response"));return}t.action==="announce"?this._onAnnounceResponse(t):t.action==="scrape"?this._onScrapeResponse(t):this._onSocketError(new Error(`invalid action in WS response: ${t.action}`))}}_onAnnounceResponse(t){if(t.info_hash!==this.client._infoHashBinary){wt("ignoring websocket data from %s for %s (looking for %s: reused socket)",this.announceUrl,Ft.binaryToHex(t.info_hash),this.client.infoHash);return}if(t.peer_id&&t.peer_id===this.client._peerIdBinary)return;wt("received %s from %s for %s",JSON.stringify(t),this.announceUrl,this.client.infoHash);const i=t["failure reason"];if(i)return this.client.emit("warning",new Error(i));const n=t["warning message"];n&&this.client.emit("warning",new Error(n));const r=t.interval||t["min interval"];r&&this.setInterval(r*1e3);const a=t["tracker id"];if(a&&(this._trackerId=a),t.complete!=null){const s=Object.assign({},t,{announce:this.announceUrl,infoHash:Ft.binaryToHex(t.info_hash)});this.client.emit("update",s)}let o;if(t.offer&&t.peer_id&&(wt("creating peer (from remote offer)"),o=this._createPeer(),o.id=Ft.binaryToHex(t.peer_id),o.once("signal",s=>{const l={action:"announce",info_hash:this.client._infoHashBinary,peer_id:this.client._peerIdBinary,to_peer_id:t.peer_id,answer:s,offer_id:t.offer_id};this._trackerId&&(l.trackerid=this._trackerId),this._send(l)}),this.client.emit("peer",o),o.signal(t.offer)),t.answer&&t.peer_id){const s=Ft.binaryToHex(t.offer_id);o=this.peers[s],o?(o.id=Ft.binaryToHex(t.peer_id),this.client.emit("peer",o),o.signal(t.answer),clearTimeout(o.trackerTimeout),o.trackerTimeout=null,delete this.peers[s]):wt(`got unexpected answer: ${JSON.stringify(t.answer)}`)}}_onScrapeResponse(t){t=t.files||{};const i=Object.keys(t);if(i.length===0){this.client.emit("warning",new Error("invalid scrape response"));return}i.forEach(n=>{const r=Object.assign(t[n],{announce:this.announceUrl,infoHash:Ft.binaryToHex(n)});this.client.emit("scrape",r)})}_onSocketClose(){this.destroyed||(this.destroy(),this._startReconnectTimer())}_onSocketError(t){this.destroyed||(this.destroy(),this.client.emit("warning",t),this._startReconnectTimer())}_startReconnectTimer(){const t=Math.floor(Math.random()*nh)+Math.min(Math.pow(2,this.retries)*th,ih);this.reconnecting=!0,clearTimeout(this.reconnectTimer),this.reconnectTimer=setTimeout(()=>{this.retries++,this._openSocket()},t),this.reconnectTimer.unref&&this.reconnectTimer.unref(),wt("reconnecting socket in %s ms",t)}_send(t){if(this.destroyed)return;this.expectingResponse=!0;const i=JSON.stringify(t);wt("send %s",i),this.socket.send(i)}_generateOffers(t,i){const n=this,r=[];wt("generating %s offers",t);for(let s=0;s<t;++s)a();o();function a(){const s=Xp(20).toString("hex");wt("creating peer (from _generateOffers)");const l=n.peers[s]=n._createPeer({initiator:!0});l.once("signal",d=>{r.push({offer:d,offer_id:Ft.hexToBinary(s)}),o()}),l.trackerTimeout=setTimeout(()=>{wt("tracker timeout: destroying peer"),l.trackerTimeout=null,delete n.peers[s],l.destroy()},rh),l.trackerTimeout.unref&&l.trackerTimeout.unref()}function o(){r.length===t&&(wt("generated %s offers",t),i(r))}}_createPeer(t){const i=this;t=Object.assign({trickle:!1,config:i.client._rtcConfig,wrtc:i.client._wrtc},t);const n=new Jp(t);return n.once("error",r),n.once("connect",a),n;function r(o){i.client.emit("warning",new Error(`Connection error: ${o.message}`)),n.destroy()}function a(){n.removeListener("error",r),n.removeListener("connect",a)}}};Is.prototype.DEFAULT_ANNOUNCE_INTERVAL=30*1e3;Is._socketPool=Rt;function Wo(){}var ah=Is;const Ut=Nr("bittorrent-tracker:client"),sh=qr,oh=Bu,lh=Du,ch=wc,dh=Fr,Yo=Ls,Vo=bi,Go=bi,uh=ah;class es extends sh{constructor(t={}){if(super(),!t.peerId)throw new Error("Option `peerId` is required");if(!t.infoHash)throw new Error("Option `infoHash` is required");if(!t.announce)throw new Error("Option `announce` is required");if(!process.browser&&!t.port)throw new Error("Option `port` is required");this.peerId=typeof t.peerId=="string"?t.peerId:t.peerId.toString("hex"),this._peerIdBuffer=Buffer.from(this.peerId,"hex"),this._peerIdBinary=this._peerIdBuffer.toString("binary"),this.infoHash=typeof t.infoHash=="string"?t.infoHash.toLowerCase():t.infoHash.toString("hex"),this._infoHashBuffer=Buffer.from(this.infoHash,"hex"),this._infoHashBinary=this._infoHashBuffer.toString("binary"),Ut("new client %s",this.infoHash),this.destroyed=!1,this._port=t.port,this._getAnnounceOpts=t.getAnnounceOpts,this._rtcConfig=t.rtcConfig,this._userAgent=t.userAgent,this._proxyOpts=t.proxyOpts,this._wrtc=typeof t.wrtc=="function"?t.wrtc():t.wrtc;let i=typeof t.announce=="string"?[t.announce]:t.announce==null?[]:t.announce;i=i.map(a=>(a=a.toString(),a[a.length-1]==="/"&&(a=a.substring(0,a.length-1)),a)),i=Array.from(new Set(i));const n=this._wrtc!==!1&&(!!this._wrtc||ch.WEBRTC_SUPPORT),r=a=>{dh(()=>{this.emit("warning",a)})};this._trackers=i.map(a=>{let o;try{o=Yo.parseUrl(a)}catch{return r(new Error(`Invalid tracker URL: ${a}`)),null}const s=o.port;if(s<0||s>65535)return r(new Error(`Invalid tracker port: ${a}`)),null;const l=o.protocol;return(l==="http:"||l==="https:")&&typeof Vo=="function"?new Vo(this,a):l==="udp:"&&typeof Go=="function"?new Go(this,a):(l==="ws:"||l==="wss:")&&n?l==="ws:"&&typeof window<"u"&&window.location.protocol==="https:"?(r(new Error(`Unsupported tracker protocol: ${a}`)),null):new uh(this,a):(r(new Error(`Unsupported tracker protocol: ${a}`)),null)}).filter(Boolean)}start(t){t=this._defaultAnnounceOpts(t),t.event="started",Ut("send `start` %o",t),this._announce(t),this._trackers.forEach(i=>{i.setInterval()})}stop(t){t=this._defaultAnnounceOpts(t),t.event="stopped",Ut("send `stop` %o",t),this._announce(t)}complete(t){t||(t={}),t=this._defaultAnnounceOpts(t),t.event="completed",Ut("send `complete` %o",t),this._announce(t)}update(t){t=this._defaultAnnounceOpts(t),t.event&&delete t.event,Ut("send `update` %o",t),this._announce(t)}_announce(t){this._trackers.forEach(i=>{i.announce(t)})}scrape(t){Ut("send `scrape`"),t||(t={}),this._trackers.forEach(i=>{i.scrape(t)})}setInterval(t){Ut("setInterval %d",t),this._trackers.forEach(i=>{i.setInterval(t)})}destroy(t){if(this.destroyed)return;this.destroyed=!0,Ut("destroy");const i=this._trackers.map(n=>r=>{n.destroy(r)});lh(i,t),this._trackers=[],this._getAnnounceOpts=null}_defaultAnnounceOpts(t={}){return t.numwant==null&&(t.numwant=Yo.DEFAULT_ANNOUNCE_PEERS),t.uploaded==null&&(t.uploaded=0),t.downloaded==null&&(t.downloaded=0),this._getAnnounceOpts&&(t=Object.assign({},t,this._getAnnounceOpts())),t}}es.scrape=(e,t)=>{if(t=oh(t),!e.infoHash)throw new Error("Option `infoHash` is required");if(!e.announce)throw new Error("Option `announce` is required");const i=Object.assign({},e,{infoHash:Array.isArray(e.infoHash)?e.infoHash[0]:e.infoHash,peerId:Buffer.from("01234567890123456789"),port:6881}),n=new es(i);n.once("error",t),n.once("warning",t);let r=Array.isArray(e.infoHash)?e.infoHash.length:1;const a={};return n.on("scrape",o=>{if(r-=1,a[o.infoHash]=o,r===0){n.destroy();const s=Object.keys(a);s.length===1?t(null,a[s[0]]):t(null,a)}}),e.infoHash=Array.isArray(e.infoHash)?e.infoHash.map(o=>Buffer.from(o,"hex")):Buffer.from(e.infoHash,"hex"),n.scrape({infoHash:e.infoHash}),n};var ph=es;const hh=Vl(ph);var Sc={exports:{}},Oe=Sc.exports={},Tt,At;function ts(){throw new Error("setTimeout has not been defined")}function is(){throw new Error("clearTimeout has not been defined")}(function(){try{typeof setTimeout=="function"?Tt=setTimeout:Tt=ts}catch{Tt=ts}try{typeof clearTimeout=="function"?At=clearTimeout:At=is}catch{At=is}})();function xc(e){if(Tt===setTimeout)return setTimeout(e,0);if((Tt===ts||!Tt)&&setTimeout)return Tt=setTimeout,setTimeout(e,0);try{return Tt(e,0)}catch{try{return Tt.call(null,e,0)}catch{return Tt.call(this,e,0)}}}function fh(e){if(At===clearTimeout)return clearTimeout(e);if((At===is||!At)&&clearTimeout)return At=clearTimeout,clearTimeout(e);try{return At(e)}catch{try{return At.call(null,e)}catch{return At.call(this,e)}}}var Pt=[],Pi=!1,hi,ir=-1;function mh(){!Pi||!hi||(Pi=!1,hi.length?Pt=hi.concat(Pt):ir=-1,Pt.length&&Ec())}function Ec(){if(!Pi){var e=xc(mh);Pi=!0;for(var t=Pt.length;t;){for(hi=Pt,Pt=[];++ir<t;)hi&&hi[ir].run();ir=-1,t=Pt.length}hi=null,Pi=!1,fh(e)}}Oe.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var i=1;i<arguments.length;i++)t[i-1]=arguments[i];Pt.push(new Tc(e,t)),Pt.length===1&&!Pi&&xc(Ec)};function Tc(e,t){this.fun=e,this.array=t}Tc.prototype.run=function(){this.fun.apply(null,this.array)};Oe.title="browser";Oe.browser=!0;Oe.env={};Oe.argv=[];Oe.version="";Oe.versions={};function Nt(){}Oe.on=Nt;Oe.addListener=Nt;Oe.once=Nt;Oe.off=Nt;Oe.removeListener=Nt;Oe.removeAllListeners=Nt;Oe.emit=Nt;Oe.prependListener=Nt;Oe.prependOnceListener=Nt;Oe.listeners=function(e){return[]};Oe.binding=function(e){throw new Error("process.binding is not supported")};Oe.cwd=function(){return"/"};Oe.chdir=function(e){throw new Error("process.chdir is not supported")};Oe.umask=function(){return 0};var gh=Sc.exports;const yh=Vl(gh);globalThis.Buffer||(globalThis.Buffer=vi.Buffer);globalThis.process||(globalThis.process=yh);const vh=["wss://tracker.openwebtorrent.com","wss://tracker.btorrent.xyz","wss://tracker.webtorrent.dev","wss://tracker.files.fm:7073/announce","wss://spacetrackr.link:443/announce","wss://tracker.fastcast.nz:443/announce"],bh=160,Ac="cinepulse.decision-room.owner.",wh="cinepulse.decision-room.autoplay";function Ai(e=12){const t=new Uint8Array(e);return crypto.getRandomValues(t),Array.from(t,i=>i.toString(16).padStart(2,"0")).join("")}function We(e=""){const t=String(e).replace(/\D/g,"");return t.length===6?t:""}function Bn(e,t="",i=null){if(!e?.id)return;const n=e.type==="tv"?"tv":"movie";try{sessionStorage.setItem(wh,JSON.stringify({id:String(e.id),type:n,roomCode:We(t),season:n==="tv"?Math.max(1,Number(e.season)||1):null,episode:n==="tv"?Math.max(1,Number(e.episode)||1):null,initialSync:i||null,createdAt:Date.now()}))}catch{}window.dispatchEvent(new CustomEvent("cinepulse:decision-room-open"));const r=`#detail?type=${n}&id=${e.id}`;window.location.hash===r?window.dispatchEvent(new Event("hashchange")):window.location.hash=r}async function kh(e){const t=new TextEncoder().encode(`cinepulse-decision-room-v1:${e}`),i=await crypto.subtle.digest("SHA-256",t);return Array.from(new Uint8Array(i).slice(0,20),n=>n.toString(16).padStart(2,"0")).join("")}function _h(){const e=new Uint32Array(1);return crypto.getRandomValues(e),String(1e5+e[0]%9e5)}function Sh(e){const t=We(e);if(t)try{sessionStorage.setItem(`${Ac}${t}`,"1")}catch{}}function xh(e){const t=We(e);if(!t)return!1;try{return sessionStorage.getItem(`${Ac}${t}`)==="1"}catch{return!1}}function Eh(){try{return We(new URL(window.location.href).searchParams.get("oda")||"")}catch{return""}}function Cc(e){const t=new URL(window.location.href);return t.searchParams.set("oda",We(e)),t.toString()}function Th(){try{const e=new URL(window.location.href);e.searchParams.delete("oda"),history.replaceState(history.state,"",e.toString())}catch{}}function ns(){const e=["Sinemasever","Gece Kuşu","Patlamış Mısır","Film Avcısı","Koltuğunda"],t=Ai(2).toUpperCase();return`${e[Math.floor(Math.random()*e.length)]} ${t}`}class Ah{constructor({roomCode:t,nickname:i=ns(),isHost:n=!1}){this.roomCode=We(t),this.nickname=String(i||ns()).slice(0,30),this.isHost=!!n,this.selfId=Ai(10),this.client=null,this.peers=new Map,this.peerParticipantIds=new WeakMap,this.trackerPeerCount=1,this.announceTimer=null,this.participants=new Map([[this.selfId,{id:this.selfId,nickname:this.nickname,role:this.isHost?"moderator":"participant"}]]),this.listeners=new Set,this.receivedIds=new Set,this.cards=[],this.votes={},this.ratings={},this.suggestions=[],this.syncMode="smooth",this.silentVoting=!1,this.sharedPlayback=null,this.lastPlayerSync=null,this.roomFinish=null,this.chatMessages=[],this.roomSummary=null,this.playbackStartedAt=0,this.roomActivity={reactions:[],chats:[]},this.onPlayerSync=r=>{const a=r.detail;!this.isHost||!a||We(a.roomCode)!==this.roomCode||!this.sharedPlayback||String(a.mediaId)!==String(this.sharedPlayback.id)||a.type!==this.sharedPlayback.type||(this.lastPlayerSync=a,this.broadcast({type:"player-sync",sync:a}))},window.addEventListener("cinepulse:player-sync",this.onPlayerSync),this.onRoomFinish=r=>{const a=r.detail;!this.isHost||!a||We(a.roomCode)!==this.roomCode||(this.roomFinish=a,this.broadcast({type:"room-finish",finish:a}))},this.onRoomFinishVote=r=>{const a=r.detail;!a||We(a.roomCode)!==this.roomCode||!a.optionId||this.broadcast({type:"room-finish-vote",vote:a})},this.onRoomFinishChoice=r=>{const a=r.detail;!this.isHost||!a||We(a.roomCode)!==this.roomCode||(this.broadcast({type:"room-finish-choice",choice:a}),this.applyRoomFinishChoice(a))},this.onRoomReaction=r=>{const a=r.detail;if(!a||We(a.roomCode)!==this.roomCode||!a.emoji)return;const o={...a,senderId:this.selfId,sentAt:Date.now()};this.recordRoomReaction(o),this.broadcast({type:"room-reaction",reaction:o})},window.addEventListener("cinepulse:room-finish",this.onRoomFinish),window.addEventListener("cinepulse:room-finish-vote",this.onRoomFinishVote),window.addEventListener("cinepulse:room-finish-choice",this.onRoomFinishChoice),window.addEventListener("cinepulse:room-reaction",this.onRoomReaction),this.onRoomChatSend=r=>{const a=r.detail,o=String(a?.text||"").trim().slice(0,240);if(!a||We(a.roomCode)!==this.roomCode||!o)return;const s={id:String(a.id||`chat-${Date.now()}-${Math.random().toString(36).slice(2,8)}`),text:o,nickname:this.nickname,senderId:this.selfId,sentAt:Number(a.sentAt)||Date.now(),at:Math.max(0,Number(a.at)||0)};this.chatMessages=[...this.chatMessages,s].slice(-60),this.recordRoomChat(s),this.broadcast({type:"room-chat",chat:s})},window.addEventListener("cinepulse:room-chat-send",this.onRoomChatSend),this.onRoomPlaybackHealth=r=>{const a=r.detail;!a||We(a.roomCode)!==this.roomCode||a.senderId===this.selfId||this.broadcast({type:"playback-health",health:{senderId:this.selfId,status:a.status==="buffering"?"buffering":"ready",bufferedAhead:Math.max(0,Number(a.bufferedAhead)||0),reportedAt:Date.now()}})},window.addEventListener("cinepulse:room-playback-health",this.onRoomPlaybackHealth),this.onRoomPlaybackProgress=r=>{const a=r.detail;!a||We(a.roomCode)!==this.roomCode||this.broadcast({type:"playback-progress",progress:{senderId:this.selfId,nickname:this.nickname,time:Math.max(0,Number(a.time)||0),playing:!!a.playing,buffering:!!a.buffering,reportedAt:Date.now()}})},window.addEventListener("cinepulse:room-playback-progress",this.onRoomPlaybackProgress),this.onRoomPlaybackCheckpoint=r=>{const a=r.detail;!this.isHost||!a||We(a.roomCode)!==this.roomCode||!a.targetId||this.broadcast({type:"playback-checkpoint",checkpoint:{targetId:a.targetId,action:a.action==="resume"?"resume":"hold",mediaId:String(a.mediaId||""),type:a.type==="tv"?"tv":"movie"}})},window.addEventListener("cinepulse:room-playback-checkpoint",this.onRoomPlaybackCheckpoint),this.onRoomPlaybackFinished=r=>{const a=r.detail;!a||We(a.roomCode)!==this.roomCode||this.broadcast({type:"playback-finished",finished:{mediaId:String(a.mediaId||""),type:a.type==="tv"?"tv":"movie",season:Math.max(1,Number(a.season)||1),episode:Math.max(1,Number(a.episode)||1),nickname:this.nickname}})},window.addEventListener("cinepulse:room-playback-finished",this.onRoomPlaybackFinished),this.onRoomSummary=r=>{const a=r.detail;if(!this.isHost||!a||We(a.roomCode)!==this.roomCode)return;const o=new Map;this.roomActivity.reactions.forEach(p=>o.set(p.emoji,(o.get(p.emoji)||0)+1));const s=Array.from(o.entries()).sort((p,h)=>h[1]-p[1])[0]||null,l=new Map;this.roomActivity.chats.forEach(p=>{const h=Math.floor(Math.max(0,Number(p.at)||0)/60)*60;l.set(h,(l.get(h)||0)+1)});const d=Array.from(l.entries()).sort((p,h)=>h[1]-p[1])[0]||null;this.roomSummary={roomCode:this.roomCode,mediaId:String(a.mediaId||this.sharedPlayback?.id||""),type:a.type==="tv"?"tv":"movie",participants:this.participants.size,watchedSeconds:Math.max(0,Number(a.seconds)||0),topReaction:s?{emoji:s[0],count:s[1]}:null,topTalkSecond:d?d[0]:null,chatCount:this.roomActivity.chats.length},this.broadcast({type:"room-summary",summary:this.roomSummary}),window.dispatchEvent(new CustomEvent("cinepulse:room-summary-remote",{detail:this.roomSummary}))},this.onRoomRhythm=r=>{const a=r.detail;!this.isHost||!a||We(a.roomCode)!==this.roomCode||!a.targetId||this.broadcast({type:"room-rhythm",rhythm:a})},window.addEventListener("cinepulse:room-summary",this.onRoomSummary),window.addEventListener("cinepulse:room-rhythm",this.onRoomRhythm),this.destroyed=!1}applyRoomFinishChoice(t){if(this.roomFinish=null,t.action==="open"&&t.card?.id){this.sharedPlayback={id:t.card.id,type:t.card.type==="tv"?"tv":"movie",season:Math.max(1,Number(t.card.season)||1),episode:Math.max(1,Number(t.card.episode)||1)},this.lastPlayerSync=null,this.playbackStartedAt=Date.now(),this.roomSummary=null,this.roomActivity={reactions:[],chats:[]},this.emit(),Bn(t.card,this.roomCode);return}t.action==="close"&&(this.sharedPlayback=null,this.lastPlayerSync=null,window.dispatchEvent(new CustomEvent("cinepulse:decision-room-close-player",{detail:{roomCode:this.roomCode}}))),this.emit()}snapshot(){return{roomCode:this.roomCode,nickname:this.nickname,selfId:this.selfId,isHost:this.isHost,peerCount:this.peers.size,trackerPeerCount:this.trackerPeerCount,participants:Array.from(this.participants.values()),cards:this.cards,votes:this.votes,ratings:this.ratings,suggestions:this.suggestions,syncMode:this.syncMode,silentVoting:this.silentVoting,chatMessages:this.chatMessages,roomSummary:this.roomSummary}}subscribe(t){return this.listeners.add(t),t(this.snapshot()),()=>this.listeners.delete(t)}emit(){const t=this.snapshot();if(this.listeners.forEach(i=>i(t)),this.sharedPlayback){const i={roomCode:this.roomCode,isHost:this.isHost,selfId:this.selfId,participants:t.participants,peerCount:t.peerCount,chatMessages:t.chatMessages,syncMode:t.syncMode,silentVoting:t.silentVoting,roomSummary:t.roomSummary};window.__cinepulseDecisionRoomPresence=i,window.dispatchEvent(new CustomEvent("cinepulse:decision-room-presence",{detail:i}))}}async connect(){if(!this.roomCode)throw new Error("Geçersiz oda kodu.");const t=await kh(this.roomCode);this.destroyed||(this.client=new hh({infoHash:t,peerId:Ai(20),announce:vh,port:0,rtcConfig:{iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:global.stun.twilio.com:3478"}]}}),this.client.on("peer",i=>this.attachPeer(i)),this.client.on("update",i=>{const n=Number(i?.complete||0)+Number(i?.incomplete||0);this.trackerPeerCount=Math.max(1,n||1),this.emit()}),this.client.on("warning",()=>this.emit()),this.client.on("error",()=>this.emit()),this.client.start({numwant:5,left:1}),this.announceTimer=window.setInterval(()=>{try{this.client?.update({numwant:5,left:1})}catch{}},15e3),this.emit())}attachPeer(t){let i=t.id||Ai(8);const n=()=>{this.destroyed||(i=t.id||i,this.peers.set(i,t),this.sendTo(t,{type:"hello",participant:{id:this.selfId,nickname:this.nickname,role:this.isHost?"moderator":"participant"},wantsState:!0}),this.emit())},r=s=>this.receive(s,t),a=()=>{this.peers.delete(i);const s=this.peerParticipantIds.get(t);s&&(Array.from(this.peers.values()).some(d=>this.peerParticipantIds.get(d)===s)||this.participants.delete(s)),this.emit()},o=()=>a();t.once("connect",n),t.on("data",r),t.once("close",a),t.once("error",o)}sendTo(t,i){try{if(!t||t.destroyed||!t.connected)return;t.send(JSON.stringify({...i,id:Ai(10),senderId:this.selfId}))}catch{}}broadcast(t){const i={...t,id:Ai(10),senderId:this.selfId};this.remember(i.id),this.peers.forEach(n=>{try{!n.destroyed&&n.connected&&n.send(JSON.stringify(i))}catch{}})}remember(t){this.receivedIds.add(t),this.receivedIds.size>bh&&this.receivedIds.delete(this.receivedIds.values().next().value)}receive(t,i){let n;try{n=JSON.parse(typeof t=="string"?t:new TextDecoder().decode(t))}catch{return}if(!(!n?.id||this.receivedIds.has(n.id)||n.senderId===this.selfId)){if(this.remember(n.id),n.type==="hello"&&n.participant?.id&&(this.participants.set(n.participant.id,n.participant),this.peerParticipantIds.set(i,n.participant.id),n.wantsState&&(this.sendTo(i,{type:"hello",participant:{id:this.selfId,nickname:this.nickname,role:this.isHost?"moderator":"participant"}}),this.isHost&&this.sendTo(i,{type:"state",cards:this.cards,votes:this.votes,ratings:this.ratings,suggestions:this.suggestions,syncMode:this.syncMode,silentVoting:this.silentVoting,participants:Array.from(this.participants.values()),sharedPlayback:this.sharedPlayback,lastPlayerSync:this.lastPlayerSync,roomFinish:this.roomFinish,chatMessages:this.chatMessages})),this.emit()),n.type==="state"&&Array.isArray(n.cards)&&!this.isHost){if(this.cards=n.cards.slice(0,12),this.votes=n.votes||{},this.ratings=n.ratings||{},this.suggestions=Array.isArray(n.suggestions)?n.suggestions.slice(-20):[],this.syncMode=n.syncMode==="strict"?"strict":"smooth",this.silentVoting=n.silentVoting===!0,Array.isArray(n.participants)&&n.participants.forEach(r=>{r?.id&&r?.nickname&&this.participants.set(r.id,r)}),n.sharedPlayback?.id){const r={id:n.sharedPlayback.id,type:n.sharedPlayback.type==="tv"?"tv":"movie",season:Math.max(1,Number(n.sharedPlayback.season)||1),episode:Math.max(1,Number(n.sharedPlayback.episode)||1)},a=!this.sharedPlayback||String(this.sharedPlayback.id)!==String(r.id)||this.sharedPlayback.type!==r.type||Number(this.sharedPlayback.season)!==Number(r.season)||Number(this.sharedPlayback.episode)!==Number(r.episode);this.sharedPlayback=r,this.lastPlayerSync=n.lastPlayerSync||null,this.roomFinish=n.roomFinish||null,this.chatMessages=Array.isArray(n.chatMessages)?n.chatMessages.slice(-60):[],a?Bn(r,this.roomCode,this.lastPlayerSync):this.lastPlayerSync&&window.dispatchEvent(new CustomEvent("cinepulse:player-sync-remote",{detail:this.lastPlayerSync}))}this.emit()}if(n.type==="cards"&&Array.isArray(n.cards)&&!this.isHost&&(this.cards=n.cards.slice(0,12),this.votes=n.votes||{},this.ratings=n.ratings||{},this.emit()),n.type==="suggestions"&&Array.isArray(n.suggestions)&&!this.isHost&&(this.suggestions=n.suggestions.slice(-20),this.emit()),n.type==="sync-mode"&&!this.isHost&&(this.syncMode=n.syncMode==="strict"?"strict":"smooth",this.emit()),n.type==="silent-voting"&&!this.isHost&&(this.silentVoting=n.enabled===!0,this.emit()),n.type==="suggest-card"&&this.isHost&&n.card?.id){const r=`${n.senderId}:${n.card.type}:${n.card.id}`;if(!this.cards.some(o=>String(o.id)===String(n.card.id)&&o.type===n.card.type)&&!this.suggestions.some(o=>o.id===r)){const o=this.participants.get(n.senderId);this.suggestions=[...this.suggestions,{id:r,card:n.card,nickname:o?.nickname||"Katılımcı"}].slice(-20),this.broadcast({type:"suggestions",suggestions:this.suggestions}),this.emit()}}if(n.type==="playback-health"&&this.isHost&&n.health?.senderId&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-health-remote",{detail:{...n.health,roomCode:this.roomCode,syncMode:this.syncMode}})),n.type==="playback-progress"&&this.isHost&&n.progress?.senderId&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-progress-remote",{detail:{...n.progress,roomCode:this.roomCode}})),n.type==="playback-checkpoint"&&n.checkpoint?.targetId&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-checkpoint-remote",{detail:{...n.checkpoint,roomCode:this.roomCode}})),n.type==="playback-finished"&&n.finished?.mediaId&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-finished-remote",{detail:{...n.finished,roomCode:this.roomCode,senderId:n.senderId}})),n.type==="vote"&&n.cardId&&n.senderId&&(this.votes={...this.votes,[n.cardId]:{...this.votes[n.cardId]||{},[n.senderId]:n.vote==="yes"?"yes":"no"}},this.emit()),n.type==="rating"&&n.cardId&&n.senderId){const r=Math.max(1,Math.min(5,Number(n.rating)||0));if(!r)return;this.ratings={...this.ratings,[n.cardId]:{...this.ratings[n.cardId]||{},[n.senderId]:r}},this.emit()}if(n.type==="open"&&n.card?.id&&(this.sharedPlayback={id:n.card.id,type:n.card.type==="tv"?"tv":"movie",season:Math.max(1,Number(n.card.season)||1),episode:Math.max(1,Number(n.card.episode)||1)},this.emit(),Bn(n.card,this.roomCode)),n.type==="player-sync"&&n.sync&&!this.isHost){const r=n.sync;if(!this.sharedPlayback||String(r.mediaId)!==String(this.sharedPlayback.id)||r.type!==this.sharedPlayback.type)return;this.lastPlayerSync=r,window.dispatchEvent(new CustomEvent("cinepulse:player-sync-remote",{detail:r}))}if(n.type==="room-finish"&&n.finish&&!this.isHost&&(this.roomFinish=n.finish,window.dispatchEvent(new CustomEvent("cinepulse:room-finish-remote",{detail:n.finish})),this.emit()),n.type==="room-finish-vote"&&n.vote){const r=n.vote;if(this.roomFinish?.id!==r.finishId)return;this.roomFinish={...this.roomFinish,votes:{...this.roomFinish.votes||{},[n.senderId]:r.optionId}},window.dispatchEvent(new CustomEvent("cinepulse:room-finish-vote-remote",{detail:this.roomFinish})),this.emit()}if(n.type==="room-finish-choice"&&n.choice&&!this.isHost&&this.applyRoomFinishChoice(n.choice),n.type==="room-reaction"&&n.reaction&&(this.recordRoomReaction(n.reaction),window.dispatchEvent(new CustomEvent("cinepulse:room-reaction-remote",{detail:n.reaction}))),n.type==="room-chat"&&n.chat?.text){const r={...n.chat,senderId:n.senderId||n.chat.senderId};this.chatMessages=[...this.chatMessages,r].slice(-60),this.recordRoomChat(r),window.dispatchEvent(new CustomEvent("cinepulse:room-chat-remote",{detail:r}))}n.type==="room-summary"&&n.summary&&(this.roomSummary=n.summary,window.dispatchEvent(new CustomEvent("cinepulse:room-summary-remote",{detail:n.summary})),this.emit()),n.type==="room-rhythm"&&n.rhythm?.targetId&&window.dispatchEvent(new CustomEvent("cinepulse:room-rhythm-remote",{detail:{...n.rhythm,roomCode:this.roomCode}}))}}setCards(t){this.isHost&&(this.cards=Array.isArray(t)?t.slice(0,12):[],this.votes={},this.ratings={},this.broadcast({type:"cards",cards:this.cards,votes:this.votes,ratings:this.ratings}),this.emit())}addCard(t){return!this.isHost||!t?.id||this.cards.length>=12||this.cards.some(i=>String(i.id)===String(t.id)&&i.type===t.type)?!1:(this.cards=[...this.cards,t],this.broadcast({type:"cards",cards:this.cards,votes:this.votes,ratings:this.ratings}),this.emit(),!0)}suggest(t){return this.isHost||!t?.id?!1:(this.broadcast({type:"suggest-card",card:t}),!0)}acceptSuggestion(t){if(!this.isHost)return!1;const i=this.suggestions.find(n=>n.id===t);return!i||this.cards.length>=12?!1:(this.suggestions=this.suggestions.filter(n=>n.id!==t),this.cards.some(n=>String(n.id)===String(i.card.id)&&n.type===i.card.type)||(this.cards=[...this.cards,i.card],this.broadcast({type:"cards",cards:this.cards,votes:this.votes,ratings:this.ratings})),this.broadcast({type:"suggestions",suggestions:this.suggestions}),this.emit(),!0)}dismissSuggestion(t){if(!this.isHost)return!1;const i=this.suggestions.filter(n=>n.id!==t);return i.length===this.suggestions.length?!1:(this.suggestions=i,this.broadcast({type:"suggestions",suggestions:this.suggestions}),this.emit(),!0)}setSyncMode(t){this.isHost&&(this.syncMode=t==="strict"?"strict":"smooth",this.broadcast({type:"sync-mode",syncMode:this.syncMode}),this.emit())}setSilentVoting(t){this.isHost&&(this.silentVoting=t===!0,this.broadcast({type:"silent-voting",enabled:this.silentVoting}),this.emit())}removeCard(t){if(!this.isHost||!t)return!1;const i=this.cards.filter(n=>String(n.id)!==String(t));return i.length===this.cards.length?!1:(this.cards=i,delete this.votes[t],delete this.ratings[t],this.broadcast({type:"cards",cards:this.cards,votes:this.votes,ratings:this.ratings}),this.emit(),!0)}vote(t,i){t&&(this.votes={...this.votes,[t]:{...this.votes[t]||{},[this.selfId]:i==="yes"?"yes":"no"}},this.broadcast({type:"vote",cardId:t,vote:i==="yes"?"yes":"no"}),this.emit())}rate(t,i){if(!t)return;const n=Math.max(1,Math.min(5,Number(i)||0));n&&(this.ratings={...this.ratings,[t]:{...this.ratings[t]||{},[this.selfId]:n}},this.broadcast({type:"rating",cardId:t,rating:n}),this.emit())}openForEveryone(t){if(!t?.id)return;this.sharedPlayback={id:t.id,type:t.type==="tv"?"tv":"movie",season:Math.max(1,Number(t.season)||1),episode:Math.max(1,Number(t.episode)||1)},this.playbackStartedAt=Date.now(),this.roomSummary=null,this.roomActivity={reactions:[],chats:[]},this.emit(),this.broadcast({type:"open",card:t});const i=()=>{this.destroyed||!this.sharedPlayback||this.broadcast({type:"state",cards:this.cards,votes:this.votes,ratings:this.ratings,suggestions:this.suggestions,syncMode:this.syncMode,silentVoting:this.silentVoting,participants:Array.from(this.participants.values()),sharedPlayback:this.sharedPlayback,lastPlayerSync:this.lastPlayerSync,roomFinish:this.roomFinish,chatMessages:this.chatMessages})};window.setTimeout(i,350),window.setTimeout(i,1400),Bn(t,this.roomCode)}recordRoomReaction(t){t?.emoji&&(this.roomActivity.reactions=[...this.roomActivity.reactions,{emoji:String(t.emoji),at:Math.max(0,Number(t.at)||0),senderId:t.senderId||""}].slice(-240))}recordRoomChat(t){t?.text&&(this.roomActivity.chats=[...this.roomActivity.chats,{at:Math.max(0,Number(t.at)||0),senderId:t.senderId||""}].slice(-120))}destroy(){this.destroyed=!0,window.removeEventListener("cinepulse:player-sync",this.onPlayerSync),window.removeEventListener("cinepulse:room-finish",this.onRoomFinish),window.removeEventListener("cinepulse:room-finish-vote",this.onRoomFinishVote),window.removeEventListener("cinepulse:room-finish-choice",this.onRoomFinishChoice),window.removeEventListener("cinepulse:room-reaction",this.onRoomReaction),window.removeEventListener("cinepulse:room-chat-send",this.onRoomChatSend),window.removeEventListener("cinepulse:room-playback-health",this.onRoomPlaybackHealth),window.removeEventListener("cinepulse:room-playback-progress",this.onRoomPlaybackProgress),window.removeEventListener("cinepulse:room-playback-checkpoint",this.onRoomPlaybackCheckpoint),window.removeEventListener("cinepulse:room-playback-finished",this.onRoomPlaybackFinished),window.removeEventListener("cinepulse:room-summary",this.onRoomSummary),window.removeEventListener("cinepulse:room-rhythm",this.onRoomRhythm),this.announceTimer&&window.clearInterval(this.announceTimer),this.announceTimer=null,this.peers.forEach(t=>{try{t.destroy()}catch{}}),this.peers.clear();try{this.client?.stop()}catch{}try{this.client?.destroy()}catch{}this.listeners.clear()}}let zt=null,it=null,Hi=null,qi=null;function Lc(){Bi(!1);const e=document.createElement("div");e.className="decision-room-backdrop",document.body.appendChild(e),zt=e,e.innerHTML=`
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
    </section>`,e.querySelector("#btn-close-decision-room").onclick=()=>Bi(!1),e.addEventListener("click",i=>{i.target===e&&Bi(!1)}),e.querySelector("#btn-create-decision-room").onclick=()=>Sr({roomCode:_h(),isHost:!0});const t=()=>{const i=e.querySelector("#decision-room-code-input"),n=String(i?.value||"").replace(/\D/g,"").slice(0,6);if(n.length!==6){i?.focus(),Z("6 haneli oda kodunu yaz.","warning");return}Sr({roomCode:n,isHost:!1})};e.querySelector("#btn-join-decision-room").onclick=t,e.querySelector("#decision-room-code-input").onkeydown=i=>{i.key==="Enter"&&t()},V(e)}function ht(e=""){const t=document.createElement("div");return t.textContent=String(e),t.innerHTML}function Ch(e,t){const n=Object.values(t.votes[e.id]||{}).filter(a=>a==="yes").length,r=Math.max(1,t.participants.length);return{yes:n,needed:r,matched:n>=r}}function Dn(e,t){const i=Object.values(t.ratings?.[e.id]||{}).map(Number).filter(a=>a>=1&&a<=5),n=t.ratings?.[e.id]?.[t.selfId]||0;return{average:i.length?i.reduce((a,o)=>a+o,0)/i.length:0,count:i.length,mine:n}}function Ic(){return`
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
    </section>`}function Rc(e,t,i=""){const n=e.querySelector("#decision-room-status"),r=e.querySelector("#decision-room-peers"),a=e.querySelector("#decision-room-member-count"),o=e.querySelector("#decision-room-moderator-panel"),s=e.querySelector("#decision-room-signal-status"),l=e.querySelector("#decision-room-suggestion-panel"),d=e.querySelector("#decision-room-suggestions"),p=e.querySelector("#decision-room-silent-vote-summary"),h=e.querySelector("#decision-room-sync-mode"),f=e.querySelector("#decision-room-silent-voting"),b=e.querySelector("#decision-room-deck"),v=e.querySelector("#decision-room-link");n&&(n.textContent=i||(t.peerCount?"Arkadaşların bağlandı, oylar anlık geliyor.":"Oda eşleştiriliyor. Arkadaşına bağlantıyı gönder."));const y=Math.max(t.participants.length,t.trackerPeerCount||1);if(a&&(a.textContent=`${y} kişi`),o&&(o.hidden=!t.isHost),l&&(l.hidden=t.isHost),s&&t.isHost&&(s.textContent=y>t.participants.length?`${y} kişi tracker tarafından görüldü; doğrudan bağlantı hazırlanıyor.`:`${y} kişi aktif bağlantıda.`),r&&(r.innerHTML=t.isHost?t.participants.map(k=>`<span class="decision-room-person ${k.role==="moderator"?"is-moderator":""}"><i data-lucide="${k.role==="moderator"?"crown":"circle-user-round"}"></i>${ht(k.nickname)}${k.id===t.selfId?" (Sen)":""}</span>`).join(""):""),v&&(v.value=Cc(t.roomCode)),h&&t.isHost){const k=t.syncMode==="strict";h.querySelector('input[value="smooth"]').checked=!k,h.querySelector('input[value="strict"]').checked=k;const m=h.querySelector("#decision-room-sync-help");m&&(m.textContent=k?"Yavaş bağlantı buffer’a düşünce herkes kısa süre bekler; süreler birlikte kalır.":"İlk açılışta en fazla 2 dakika fark için bir kez hizalar. Moderatörün oynat/duraklat ve sarma komutları herkese gider; otomatik durum paketleri buffer’ı bozmaz. Fark 1,5 dakikaya çıkarsa geride veya önde kalan taraf kısa süre bekler, diğeri yaklaşınca devam eder."),h.querySelectorAll('input[name="room-sync-mode"]').forEach(w=>{w.onchange=()=>it?.setSyncMode(w.value)})}if(f&&t.isHost&&(f.checked=t.silentVoting===!0,f.onchange=()=>it?.setSilentVoting(f.checked)),d&&t.isHost&&(d.innerHTML=t.suggestions?.length?`<strong>Katılımcı önerileri</strong>${t.suggestions.map(k=>`<div class="decision-room-suggestion"><span><b>${ht(k.card.title||k.card.name||"İsimsiz içerik")}</b><small>${ht(k.nickname)} önerdi</small></span><button data-accept-suggestion="${ht(k.id)}">Ekle</button><button data-dismiss-suggestion="${ht(k.id)}" aria-label="Reddet">×</button></div>`).join("")}`:"",d.querySelectorAll("[data-accept-suggestion]").forEach(k=>{k.onclick=()=>it?.acceptSuggestion(k.dataset.acceptSuggestion)}),d.querySelectorAll("[data-dismiss-suggestion]").forEach(k=>{k.onclick=()=>it?.dismissSuggestion(k.dataset.dismissSuggestion)})),p&&t.isHost&&t.silentVoting){const k=t.cards.map(m=>({card:m,rating:Dn(m,t)})).filter(m=>m.rating.count>0).sort((m,w)=>w.rating.average-m.rating.average||w.rating.count-m.rating.count).slice(0,3);p.innerHTML=k.length?`<strong><i data-lucide="shield-check"></i> Sessiz oylama özeti</strong>${k.map(({card:m,rating:w},E)=>`<div><b>${E+1}</b><span>${ht(m.title||m.name||"İsimsiz içerik")}</span><em>★ ${w.average.toFixed(1)} · ${w.count} gizli oy</em></div>`).join("")}`:'<strong><i data-lucide="shield-check"></i> Sessiz oylama</strong><small>Katılımcıların yıldızları yalnızca burada ortak sonuç olarak görünür.</small>'}else p&&(p.innerHTML="");if(b){if(!t.cards.length)b.innerHTML='<div class="decision-room-empty"><i data-lucide="sparkles"></i><strong>Adaylar hazırlanıyor</strong><span>Oda sahibi ortak izleme listesi oluşturuyor.</span></div>';else{const k=t.isHost&&t.silentVoting?[...t.cards].sort((m,w)=>Dn(w,t).average-Dn(m,t).average):t.cards;b.innerHTML=k.map(m=>{const w=m.title||m.name||"İsimsiz içerik",E=m.type==="tv"?`Dizi · S${Math.max(1,Number(m.season)||1)} B${Math.max(1,Number(m.episode)||1)}`:"Film",C=Ch(m,t),S=t.votes[m.id]?.[t.selfId],T=Dn(m,t),I=[1,2,3,4,5].map(L=>`<button data-room-rating="${L}" data-card-id="${m.id}" class="${T.mine>=L?"active-star":""}" aria-label="${L} yıldız"><i data-lucide="star"></i></button>`).join("");return`<article class="decision-room-card ${C.matched?"matched":""}">
          <img src="${lt(m.poster_path,et.POSTER_SMALL)}" alt="" loading="lazy" />
          <div class="decision-room-card-body">
            <span>${E} · ★ ${(Number(m.vote_average)||0).toFixed(1)}</span>
            <strong>${ht(w)}</strong>
            <small>${C.matched?"Herkes izlemek istiyor!":`${C.yes}/${C.needed} kişi izlemek istiyor`}</small>
            <div class="decision-room-rating"><span>${t.silentVoting?t.isHost?T.count?`Gizli puan ${T.average.toFixed(1)} · ${T.count} oy`:"Gizli oy bekleniyor":T.mine?"Puanın kaydedildi":"Gizli puan ver":T.count?`Ortak puan ${T.average.toFixed(1)} · ${T.count} oy`:"Puan ver"}</span><div>${I}</div></div>
            <div class="decision-room-votes">
              <button data-room-vote="yes" data-card-id="${m.id}" class="${S==="yes"?"active-yes":""}"><i data-lucide="heart"></i> İzle</button>
              <button data-room-vote="no" data-card-id="${m.id}" class="${S==="no"?"active-no":""}"><i data-lucide="skip-forward"></i> Geç</button>
              ${C.matched?`<button data-room-open="${m.id}" class="decision-room-open"><i data-lucide="play"></i> Birlikte Aç</button>`:""}
              ${t.isHost?`<button data-room-remove="${m.id}" class="decision-room-remove" aria-label="${ht(w)} içeriğini odadan kaldır"><i data-lucide="trash-2"></i> Kaldır</button>`:""}
            </div>
          </div>
        </article>`}).join("")}b.querySelectorAll("[data-room-vote]").forEach(k=>{k.onclick=()=>it?.vote(k.dataset.cardId,k.dataset.roomVote)}),b.querySelectorAll("[data-room-rating]").forEach(k=>{k.onclick=()=>it?.rate(k.dataset.cardId,k.dataset.roomRating)}),b.querySelectorAll("[data-room-open]").forEach(k=>{k.onclick=()=>{const m=t.cards.find(w=>String(w.id)===k.dataset.roomOpen);m&&it?.openForEveryone(m)}}),b.querySelectorAll("[data-room-remove]").forEach(k=>{k.onclick=()=>{it?.removeCard(k.dataset.roomRemove)&&Z("İçerik odadan kaldırıldı.","success")}})}V(e)}function _r(e){return{id:e.id,type:e.type||e.media_type||(e.first_air_date?"tv":"movie"),title:e.title,name:e.name,poster_path:e.poster_path,vote_average:e.vote_average,season:e.type==="tv"||e.media_type==="tv"?Math.max(1,Number(e.season)||1):null,episode:e.type==="tv"||e.media_type==="tv"?Math.max(1,Number(e.episode)||1):null}}function $c(e,t){const i=e.querySelector("#decision-room-content-form"),n=e.querySelector("#decision-room-content-search"),r=e.querySelector("#decision-room-content-results");if(!i||!n||!r||!t.isHost)return;let a=null,o=0;const s=async()=>{const l=n.value.trim();if(l.length<2){r.innerHTML="";return}const d=++o;r.innerHTML='<span class="decision-room-search-status">Aranıyor…</span>';const p=await ks(l).catch(()=>[]);if(d!==o||n.value.trim()!==l)return;const h=p.filter(f=>f?.id&&(f.type==="movie"||f.type==="tv")).slice(0,5);r.innerHTML=h.length?h.map(f=>{const b=_r(f),v=b.type==="tv"?'<span class="decision-room-episode-choice" aria-label="Bölüm seçimi"><label>Sezon <input data-add-season type="number" min="1" value="1" inputmode="numeric" /></label><label>Bölüm <input data-add-episode type="number" min="1" value="1" inputmode="numeric" /></label></span>':"";return`<div class="decision-room-search-result"><button type="button" data-add-room-card="${b.id}" data-add-room-type="${b.type}" title="Odaya ekle"><img src="${lt(b.poster_path,et.POSTER_SMALL)}" alt="" /><span><strong>${ht(b.title||b.name||"İsimsiz içerik")}</strong><small>${b.type==="tv"?"Dizi":"Film"} · ★ ${(Number(b.vote_average)||0).toFixed(1)}</small></span><i data-lucide="plus"></i></button>${v}</div>`}).join(""):'<span class="decision-room-search-status">Sonuç bulunamadı.</span>',r.querySelectorAll("[data-add-room-card]").forEach(f=>{f.onclick=()=>{const b=h.find(m=>String(m.id)===f.dataset.addRoomCard&&(m.type||m.media_type)===f.dataset.addRoomType);if(!b)return;const v=f.closest(".decision-room-search-result"),y=Number(v?.querySelector("[data-add-season]")?.value)||1,k=Number(v?.querySelector("[data-add-episode]")?.value)||1;t.addCard(_r({...b,season:y,episode:k}))?(n.value="",r.innerHTML="",Z("İçerik odaya eklendi.","success")):Z("Bu içerik zaten listede veya oda dolu.","warning")}}),V(r)};i.onsubmit=l=>{l.preventDefault(),window.clearTimeout(a),s()},n.oninput=()=>{if(window.clearTimeout(a),n.value.trim().length<2){o+=1,r.innerHTML="";return}a=window.setTimeout(s,220)}}function Mc(e,t){const i=e.querySelector("#decision-room-suggestion-form"),n=e.querySelector("#decision-room-suggestion-search"),r=e.querySelector("#decision-room-suggestion-results");if(!i||!n||!r||t.isHost)return;let a=null,o=0;const s=async()=>{const l=n.value.trim();if(l.length<2)return;const d=++o;r.innerHTML='<span class="decision-room-search-status">Aranıyor…</span>';const p=await ks(l).catch(()=>[]);if(d!==o||n.value.trim()!==l)return;const h=p.filter(f=>f?.id&&(f.type==="movie"||f.type==="tv")).slice(0,5);r.innerHTML=h.map(f=>`<div class="decision-room-search-result"><button type="button" data-suggest-card="${f.id}" data-suggest-type="${f.type||f.media_type}"><img src="${lt(f.poster_path,et.POSTER_SMALL)}" alt="" /><span><strong>${ht(f.title||f.name||"İsimsiz içerik")}</strong><small>${(f.type||f.media_type)==="tv"?"Dizi":"Film"} · Moderatöre öner</small></span><i data-lucide="send"></i></button></div>`).join("")||'<span class="decision-room-search-status">Sonuç bulunamadı.</span>',r.querySelectorAll("[data-suggest-card]").forEach(f=>{f.onclick=()=>{const b=h.find(v=>String(v.id)===f.dataset.suggestCard&&String(v.type||v.media_type)===f.dataset.suggestType);!b||!t.suggest(_r(b))||(n.value="",r.innerHTML="",Z("Önerin moderatöre gönderildi.","success"))}}),V(r)};i.onsubmit=l=>{l.preventDefault(),window.clearTimeout(a),s()},n.oninput=()=>{if(window.clearTimeout(a),n.value.trim().length<2){o+=1,r.innerHTML="";return}a=window.setTimeout(s,220)}}async function Pc(e,t){const i=t.querySelector("#decision-room-status");i&&(i.textContent="Ortak adaylar hazırlanıyor…");try{const r=(await Dl("all","week")||[]).filter(a=>a?.id&&(a.media_type==="movie"||a.media_type==="tv"||a.type==="movie"||a.type==="tv")).slice(0,8).map(_r);if(!r.length)throw new Error("Aday bulunamadı.");e.setCards(r)}catch{i&&(i.textContent="Adaylar şu an yüklenemedi. Biraz sonra yeniden dene.")}}async function Sr({roomCode:e=Eh(),isHost:t=!1}={}){if(!e){Lc();return}Bi(!1);const i=e;t&&Sh(i);const n=!!(t||xh(i)),r=ns(),a=document.createElement("div");if(a.id="decision-room-modal-root",a.className="decision-room-backdrop",document.body.appendChild(a),zt=a,n)try{history.replaceState(history.state,"",Cc(i))}catch{}a.innerHTML=`
    <section class="decision-room-dialog" role="dialog" aria-modal="true" aria-label="Ortak Karar Odası">
      <button id="btn-close-decision-room" class="decision-room-close" aria-label="Kapat"><i data-lucide="x"></i></button>
      <header class="decision-room-header">
        <div class="decision-room-icon"><i data-lucide="users-round"></i></div>
        <div><h2>Birlikte Seç</h2><p>Herkesin istediği içeriği birlikte bulun.</p></div>
      </header>
      <div class="decision-room-code-panel">
        <span>ODA KODU</span>
        <strong id="decision-room-code">${ht(i)}</strong>
        <button id="btn-copy-decision-room"><i data-lucide="copy"></i> Kodu Kopyala</button>
        <small>Arkadaşın “Birlikte Seç” ekranında bu kodu yazsın.</small>
      </div>
      <div class="decision-room-live"><span class="decision-room-live-dot"></span><span id="decision-room-status">Oda hazırlanıyor…</span><strong id="decision-room-member-count" class="decision-room-member-count">1 kişi</strong></div>
      ${Ic()}
      <div id="decision-room-deck" class="decision-room-deck"></div>
      <footer class="decision-room-footer"><span>Oda kapanınca oylar silinir.</span><button id="btn-refresh-decision-cards"><i data-lucide="refresh-cw"></i> Yeni adaylar</button></footer>
    </section>`;const o=()=>Bi(!0);a.querySelector("#btn-close-decision-room").addEventListener("click",o),a.addEventListener("click",d=>{d.target===a&&o()});const s=()=>Bc();window.addEventListener("cinepulse:decision-room-open",s,{once:!0}),qi=()=>window.removeEventListener("cinepulse:decision-room-open",s);const l=new Ah({roomCode:i,nickname:r,isHost:n});it=l,Hi=l.subscribe(d=>Rc(a,d)),await l.connect(),!(it!==l||zt!==a)&&($c(a,l),Mc(a,l),a.querySelector("#btn-copy-decision-room").onclick=async()=>{try{await navigator.clipboard.writeText(i),Z("Oda kodu kopyalandı.","success")}catch{const p=a.querySelector("#decision-room-code"),h=document.createRange();h.selectNodeContents(p),window.getSelection()?.removeAllRanges(),window.getSelection()?.addRange(h),document.execCommand("copy"),window.getSelection()?.removeAllRanges(),Z("Oda kodu kopyalandı.","success")}},a.querySelector("#btn-refresh-decision-cards").onclick=()=>Pc(it,a),V(a))}function Bi(e=!0){qi?.(),qi=null,Hi?.(),Hi=null,it?.destroy(),it=null,zt?.remove(),zt=null,e&&Th()}function Dm(){if(zt)return;if(!it){Lc();return}const e=it,t=document.createElement("div");t.id="decision-room-modal-root",t.className="decision-room-backdrop",document.body.appendChild(t),zt=t,t.innerHTML=`
    <section class="decision-room-dialog" role="dialog" aria-modal="true" aria-label="Ortak Karar Odası">
      <button id="btn-close-decision-room" class="decision-room-close" aria-label="Kapat"><i data-lucide="x"></i></button>
      <header class="decision-room-header"><div class="decision-room-icon"><i data-lucide="users-round"></i></div><div><h2>Birlikte Seç</h2><p>Odan hâlâ açık. Adayları ve katılımcıları buradan gör.</p></div></header>
      <div class="decision-room-code-panel"><span>ODA KODU</span><strong id="decision-room-code">${ht(e.roomCode)}</strong><button id="btn-copy-decision-room"><i data-lucide="copy"></i> Kodu Kopyala</button><small>Arkadaşın “Birlikte Seç” ekranında bu kodu yazsın.</small></div>
      <div class="decision-room-live"><span class="decision-room-live-dot"></span><span id="decision-room-status">Odaya dönüldü.</span><strong id="decision-room-member-count" class="decision-room-member-count">1 kişi</strong></div>
      ${Ic()}
      <div id="decision-room-deck" class="decision-room-deck"></div>
      <footer class="decision-room-footer"><span>Oda kapanınca oylar silinir.</span><button id="btn-refresh-decision-cards"><i data-lucide="refresh-cw"></i> Yeni adaylar</button></footer>
    </section>`;const i=()=>Bi(!0);t.querySelector("#btn-close-decision-room").onclick=i,t.addEventListener("click",r=>{r.target===t&&i()});const n=()=>Bc();window.addEventListener("cinepulse:decision-room-open",n,{once:!0}),qi=()=>window.removeEventListener("cinepulse:decision-room-open",n),Hi=e.subscribe(r=>Rc(t,r)),$c(t,e),Mc(t,e),t.querySelector("#btn-copy-decision-room").onclick=async()=>{try{await navigator.clipboard.writeText(e.roomCode),Z("Oda kodu kopyalandı.","success")}catch{Z(`Oda kodu: ${e.roomCode}`,"info")}},t.querySelector("#btn-refresh-decision-cards").onclick=()=>Pc(e,t),V(t)}function Bc(){qi?.(),qi=null,Hi?.(),Hi=null,zt?.remove(),zt=null}function Lh(e="home"){const t=xn(),i=Yl(),n=t.isKid,r=fi();return`
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
                      <a href="https://cine-pulse.vercel.app/api/download_apk" download="cinepulse.apk" target="_blank" rel="noopener noreferrer" id="btn-hub-apk" class="hub-mega-item hub-tool-btn" aria-label="CinePulse Android APK İndir">
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

      <a href="#livetv" class="dynamic-dock-item dynamic-dock-live ${e==="livetv"?"active":""}">
        <i data-lucide="radio"></i>
        <span>Canlı</span>
      </a>

      <!-- Center Orb – Evren Hub -->
      <button class="dynamic-dock-hub-orb" id="btn-open-mobile-hub" aria-label="CinePulse Evreni">
        <div class="hub-orb-inner">
          <i data-lucide="sparkles" style="width:20px;height:20px;color:#fff;"></i>
        </div>
      </button>

      <button type="button" data-open-decision-room class="dynamic-dock-item" aria-label="Birlikte İzle">
        <i data-lucide="users-round"></i>
        <span>Birlikte</span>
      </button>

      ${r?`<a href="#downloads" class="dynamic-dock-item ${e==="downloads"?"active":""}" id="dock-item-downloads">
        <div class="dock-icon-rel">
          <i data-lucide="arrow-down-circle"></i>
          <span class="dock-download-badge" id="dock-downloads-badge" style="display:none;"></span>
        </div>
        <span>İndirilenler</span>
      </a>`:""}

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
              <span class="hub-sheet-card-title">Keşfet</span>
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
          <div class="hub-sheet-section-label" style="margin-top:1.1rem;">ARAÇLAR & ÖZEL</div>
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
            <a href="https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk" download="cinepulse.apk" target="_blank" rel="noopener noreferrer" id="btn-hub-apk-mobile" class="hub-sheet-tool-btn" aria-label="CinePulse Android APK İndir">
              <div class="hub-sheet-tool-icon" style="background:linear-gradient(135deg,#10b981,#059669);">
                <i data-lucide="smartphone" style="width:18px;height:18px;color:#fff;"></i>
              </div>
              <div class="hub-sheet-tool-text">
                <span class="hub-sheet-tool-title">Android APK İndir (Doğrudan)</span>
                <span class="hub-sheet-tool-sub">v1.1.1 • Hızlı sunucu</span>
              </div>
              <i data-lucide="download" style="width:14px;height:14px;color:#10b981;margin-left:auto;flex-shrink:0;"></i>
            </a>
            <a href="./cinepulse.zip" download="cinepulse.zip" target="_blank" rel="noopener noreferrer" class="hub-sheet-tool-btn" style="background:rgba(255,255,255,0.03);border:1px dashed rgba(255,255,255,0.12);">
              <div class="hub-sheet-tool-icon" style="background:rgba(245,158,11,0.15);color:#fbbf24;">
                <i data-lucide="archive" style="width:18px;height:18px;"></i>
              </div>
              <div class="hub-sheet-tool-text">
                <span class="hub-sheet-tool-title">APK Zip Paketi (Chrome %100 Çözümü)</span>
                <span class="hub-sheet-tool-sub">Takılma olmadan anında iner</span>
              </div>
              <i data-lucide="download" style="width:14px;height:14px;color:#fbbf24;margin-left:auto;flex-shrink:0;"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  `}let Ji=null,zn=null,Jo=!1;function Xo(e){const t=document.getElementById("main-navbar");Ji&&window.removeEventListener("scroll",Ji),Ji=()=>t?.classList.toggle("scrolled",window.scrollY>20),Ji(),window.addEventListener("scroll",Ji,{passive:!0});const i=document.getElementById("mobile-search-row");document.getElementById("btn-mobile-search-toggle")?.addEventListener("click",()=>{i?.classList.toggle("hidden"),i?.classList.contains("hidden")||(document.getElementById("mobile-search-input")?.focus(),V())}),document.getElementById("btn-mobile-search-close")?.addEventListener("click",()=>{i?.classList.add("hidden")}),document.getElementById("btn-nav-notifications")?.addEventListener("click",xu),document.getElementById("btn-nav-profile")?.addEventListener("click",ku);const n=document.getElementById("nav-hub-li"),r=document.getElementById("btn-desktop-hub"),a=document.getElementById("hub-mega-dropdown");let o;function s(){clearTimeout(o),r?.setAttribute("aria-expanded","true"),a?.classList.add("open")}function l(){clearTimeout(o),r?.setAttribute("aria-expanded","false"),a?.classList.remove("open")}function d(){clearTimeout(o),o=setTimeout(()=>{!n?.matches(":hover")&&!a?.matches(":hover")&&l()},350)}if(n){n.addEventListener("mouseenter",s),n.addEventListener("mouseleave",d),a?.addEventListener("mouseenter",s),a?.addEventListener("mouseleave",d),r?.addEventListener("click",m=>{m.stopPropagation(),s()}),a?.querySelectorAll(".hub-nav-trigger").forEach(m=>{m.addEventListener("click",l)});const y=m=>{m.key==="Escape"&&l()};window.addEventListener("keydown",y);const k=m=>{n.contains(m.target)||l()};document.addEventListener("click",k)}document.getElementById("btn-hub-random-spin")?.addEventListener("click",async()=>{l(),wo()}),document.getElementById("btn-hub-series-recommend")?.addEventListener("click",l),document.getElementById("btn-hub-trakt")?.addEventListener("click",()=>{l(),br()});const p=document.getElementById("mobile-hub-backdrop"),h=document.getElementById("mobile-hub-sheet");let f;function b(){p&&(clearTimeout(f),h?.classList.remove("sheet-closing"),p.classList.remove("hidden"),document.body.style.overflow="hidden")}function v(){p&&(document.body.style.overflow="",h?.classList.add("sheet-closing"),clearTimeout(f),f=setTimeout(()=>{p.classList.add("hidden"),h?.classList.remove("sheet-closing")},280))}document.getElementById("btn-open-mobile-hub")?.addEventListener("click",y=>{y.preventDefault(),b()},{once:!1}),document.getElementById("btn-close-mobile-hub")?.addEventListener("click",v),p?.addEventListener("click",y=>{y.target===p&&v()}),p?.querySelectorAll(".hub-nav-trigger").forEach(y=>{y.addEventListener("click",v)}),document.getElementById("btn-hub-random-spin-mobile")?.addEventListener("click",async()=>{v(),wo()}),document.getElementById("btn-hub-series-recommend-mobile")?.addEventListener("click",v),document.getElementById("btn-hub-trakt-mobile")?.addEventListener("click",()=>{v(),br()}),document.querySelectorAll("[data-open-decision-room]").forEach(y=>{y.addEventListener("click",()=>{l(),v(),Sr()})}),Zo("nav-search-input","search-overlay"),Zo("mobile-search-input","mobile-search-overlay"),Jo||(Jo=!0,document.addEventListener("click",y=>{for(const[k,m]of[["nav-search-input","search-overlay"],["mobile-search-input","mobile-search-overlay"]]){const w=document.getElementById(k),E=document.getElementById(m);E&&!w?.contains(y.target)&&!E.contains(y.target)&&E.classList.add("hidden")}})),zn&&document.removeEventListener("keydown",zn),zn=y=>{(y.metaKey||y.ctrlKey)&&y.key.toLowerCase()==="k"&&(y.preventDefault(),window.innerWidth<=992&&i?(i.classList.remove("hidden"),document.getElementById("mobile-search-input")?.focus()):document.getElementById("nav-search-input")?.focus())},window.addEventListener("keydown",zn)}function Zo(e,t){const i=document.getElementById(e),n=document.getElementById(t);let r=null;!i||!n||(i.addEventListener("input",a=>{const o=a.target.value.trim();if(clearTimeout(r),o.length<2){n.classList.add("hidden"),n.innerHTML="";return}n.innerHTML='<div class="search-no-results" style="display:flex;align-items:center;gap:8px;padding:1rem;color:var(--text-muted);font-size:.85rem;"><span class="tv-loading-spinner" style="width:16px;height:16px;border-width:2px;"></span> Aranıyor...</div>',n.classList.remove("hidden"),r=setTimeout(async()=>{try{let h=function(){n.querySelectorAll(".search-item").forEach(f=>{f.addEventListener("click",()=>{n.classList.add("hidden"),i.value="",document.getElementById("mobile-search-row")?.classList.add("hidden")})})};const s=await ks(o),l=Array.isArray(s)?s.slice(0,8):s?.results?.slice(0,8)||[],d=`
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
          </a>`;if(!l.length){n.innerHTML=`<div class="search-no-results" style="padding-bottom:.5rem;">TMDB Sonucu Bulunamadı</div>${d}`,n.classList.remove("hidden"),V(n),h();return}const p=l.map(f=>{const b=f.media_type==="tv"||!!f.first_air_date||!f.release_date&&!!f.name,v=f.title||f.name||"İsimsiz",y=(f.release_date||f.first_air_date||"").slice(0,4),k=lt(f.poster_path,et.POSTER_SMALL||et.POSTER_MEDIUM);return`
            <a href="#detail?type=${b?"tv":"movie"}&id=${f.id}" class="search-item">
              <img src="${k}" alt="${v}" class="search-item-img" onerror="this.src='https://via.placeholder.com/45x68/1e293b/64748b?text=N/A'" />
              <div class="search-item-info">
                <div class="search-item-title">${v}</div>
                <div class="search-item-meta">
                  <span class="search-badge">${b?"Dizi":"Film"}</span>
                  ${y?`<span>${y}</span>`:""}
                  <span class="search-rating">★ ${(f.vote_average||0).toFixed(1)}</span>
                </div>
              </div>
            </a>`}).join("");n.innerHTML=p+d,n.classList.remove("hidden"),V(n),h()}catch{n.innerHTML='<div class="search-no-results">Arama sırasında bir hata oluştu</div>'}},200)}),i.addEventListener("keydown",a=>{a.key==="Escape"&&(n.classList.add("hidden"),i.blur())}))}let Xi=null;function Dc({title:e="Fragman",trailerInfo:t,mediaId:i=null,mediaType:n="movie"}){const r=document.getElementById("trailer-modal");if(!r)return;if(!t||!t.embedUrl){alert("Bu yapım için resmi fragman bulunamadı.");return}const a=t.name||"Resmi Tanıtım",o=i?`#detail?type=${encodeURIComponent(n)}&id=${encodeURIComponent(i)}`:null;r.innerHTML=`
    <div class="trailer-modal-overlay">
      <div class="trailer-modal-dialog">
        
        <!-- Header Bar -->
        <div class="trailer-header">
          <div class="trailer-header-left">
            <span class="trailer-badge">
              <i data-lucide="youtube" style="width: 14px; height: 14px; fill: #ef4444; color: #ef4444;"></i>
              <span>FRAGMAN</span>
            </span>
            <h3 class="trailer-title" title="${e} • ${a}">
              ${e} <span class="trailer-subname">• ${a}</span>
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
  `,r.classList.remove("hidden"),document.body.style.overflow="hidden",V();const s=()=>{r.innerHTML="",r.classList.add("hidden"),document.body.style.overflow="",Xi&&(window.removeEventListener("keydown",Xi),Xi=null)},l=r.querySelector("#btn-close-trailer");l&&l.addEventListener("click",s),r.querySelector(".btn-trailer-detail")?.addEventListener("click",s);const d=r.querySelector(".trailer-modal-overlay");d&&d.addEventListener("click",p=>{p.target===d&&s()}),Xi=p=>{p.key==="Escape"&&s()},window.addEventListener("keydown",Xi)}let st=0,xr=null,nr=0;const On=new Map;function Ih(){clearInterval(xr),xr=null,nr++}function Rs(e){const t=e?.backdrop_path||e?.poster_path,i=window.innerWidth<=768?et.BACKDROP_LARGE:et.BACKDROP_XLARGE;return lt(t,i)}function $s(e,t="auto"){if(!e)return Promise.resolve(null);if(On.has(e))return On.get(e);const i=new Promise(n=>{const r=new Image;r.decoding="async",r.fetchPriority=t,r.onload=async()=>{try{await r.decode()}catch{}n(e)},r.onerror=()=>{On.delete(e),n(null)},r.src=e});return On.set(e,i),i}function Rh(e=[]){const i=Lt()?e.filter(Zt):e;if(!i||i.length===0)return"";st=0;const n=i.slice(0,10),r=n[0],a=r.id,o=r.first_air_date||r.media_type==="tv"?"tv":"movie",s=r.title||r.name||"Öne Çıkan Yapım",l=r.overview&&r.overview.trim().length>15?r.overview:qe(r,o),d=Rs(r),p=r.vote_average?r.vote_average.toFixed(1):"8.8",h=(r.first_air_date||r.release_date||"").substring(0,4),f=gs(a);let b=document.getElementById("hero-backdrop-preload");return b||(b=document.createElement("link"),b.id="hero-backdrop-preload",b.rel="preload",b.as="image",document.head.appendChild(b)),b.href=d,b.fetchPriority="high",window.innerWidth>768&&$s(d,"high"),`
    <section class="hero-slider is-loading" id="hero-slider-section" aria-busy="true">
      <div class="hero-ambient-glow"></div>

      <img class="hero-backdrop" id="hero-backdrop-img" src="${d}" alt="" loading="eager" fetchpriority="high" decoding="async" sizes="100vw" />
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
            <button class="btn-primary hero-btn-play" id="hero-play-btn" data-id="${a}" data-type="${o}">
              <i data-lucide="play" style="fill: currentColor; width: 17px; height: 17px;"></i>
              <span>Hemen İzle</span>
            </button>

            <button class="btn-secondary hero-btn-trailer" id="hero-trailer-btn" data-id="${a}" data-type="${o}" title="Fragmanı İzle">
              <i data-lucide="clapperboard" style="width: 16px; height: 16px;"></i>
              <span>Fragman</span>
            </button>

            <button class="btn-secondary hero-btn-list-icon" id="hero-list-btn" data-id="${a}" data-type="${o}" title="${f?"Listemden Çıkar":"Listeme Ekle"}">
              <i data-lucide="${f?"check":"plus"}" style="width: 17px; height: 17px; ${f?"color: var(--primary);":""}"></i>
            </button>
          </div>

          <!-- Dot Indicators -->
          <div class="hero-dots-wrapper" id="hero-dots-container">
            ${n.map((v,y)=>`
              <div class="hero-dot ${y===st?"active":""}" data-index="${y}" role="button" aria-label="Slayt ${y+1}"></div>
            `).join("")}
          </div>
        </div>
      </div>
    </section>
  `}function $h(e=[]){const i=Lt()?e.filter(Zt):e;if(!i||i.length===0)return;const n=i.slice(0,10);st=0;const r=document.getElementById("hero-play-btn"),a=document.getElementById("hero-list-btn"),o=document.getElementById("hero-trailer-btn"),s=document.getElementById("hero-slider-section"),l=document.getElementById("hero-backdrop-img"),d=document.getElementById("hero-arrow-prev"),p=document.getElementById("hero-arrow-next");(async()=>{if(l&&!l.complete&&await new Promise(T=>{l.addEventListener("load",T,{once:!0}),l.addEventListener("error",T,{once:!0})}),l?.complete&&l.naturalWidth>0)try{await l.decode()}catch{}requestAnimationFrame(()=>{s?.isConnected&&(s.classList.remove("is-loading"),s.setAttribute("aria-busy","false"))})})();const f=()=>n.slice(1,4).forEach(T=>$s(Rs(T)));"requestIdleCallback"in window?window.requestIdleCallback(f,{timeout:1500}):setTimeout(f,500),n.slice(0,2).forEach(T=>{const I=T.first_air_date||T.media_type==="tv"?"tv":"movie";bn(I,T.id).catch(()=>null)});function b(){Nn(n[(st+1)%n.length],(st+1)%n.length),S()}function v(){Nn(n[(st-1+n.length)%n.length],(st-1+n.length)%n.length),S()}d?.addEventListener("click",v),p?.addEventListener("click",b);const y=T=>{if(!s?.isConnected){document.removeEventListener("keydown",y);return}T.key==="ArrowRight"&&b(),T.key==="ArrowLeft"&&v()};document.addEventListener("keydown",y);let k=null,m=!1;const w=50;function E(T){k=T,m=!0}function C(T){if(!m||k===null)return;m=!1;const I=k-T;Math.abs(I)<w||(I>0?b():v(),k=null)}s?.addEventListener("touchstart",T=>E(T.touches[0].clientX),{passive:!0}),s?.addEventListener("touchend",T=>C(T.changedTouches[0].clientX),{passive:!0}),s?.addEventListener("touchcancel",()=>{m=!1,k=null},{passive:!0}),s?.addEventListener("mousedown",T=>{T.button===0&&E(T.clientX)}),s?.addEventListener("mouseup",T=>{T.button===0&&C(T.clientX)}),s?.addEventListener("mouseleave",()=>{m=!1,k=null}),r?.addEventListener("click",()=>{window.location.hash=`#detail?type=${r.getAttribute("data-type")}&id=${r.getAttribute("data-id")}`}),o?.addEventListener("click",async()=>{if(yt().trailersEnabled===!1){Z("Fragmanlar yönetici ayarlarından kapatıldı.","info");return}const T=n[st];if(!T)return;const I=T.first_air_date||T.media_type==="tv"?"tv":"movie",L=o.innerHTML;o.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:17px;height:17px;"></i> <span>Yükleniyor...</span>',V(o);try{const D=await bn(I,T.id,T.title||T.name);D?Dc({title:T.title||T.name,trailerInfo:D,mediaId:T.id,mediaType:I}):Z("Bu yapım için resmi tanıtım fragmanı bulunamadı.","info")}catch{Z("Fragman yüklenirken hata oluştu.","error")}finally{o.innerHTML=L,V(o)}}),a?.addEventListener("click",()=>{const T=n[st],I=Il(T);Z(I?"İzleme listene eklendi!":"İzleme listenden çıkarıldı.",I?"success":"info"),a.title=I?"Listemden Çıkar":"Listeme Ekle",a.innerHTML=`<i data-lucide="${I?"check":"plus"}" style="width: 17px; height: 17px; ${I?"color: var(--primary);":""}"></i>`,V(a)}),document.querySelectorAll(".hero-dot").forEach(T=>{T.addEventListener("click",()=>{const I=parseInt(T.getAttribute("data-index"),10);Nn(n[I],I),S()})});function S(){clearInterval(xr),xr=setInterval(()=>{if(n.length>1){const T=(st+1)%n.length;Nn(n[T],T)}},6e3)}S()}async function Nn(e,t=st){if(!e||Lt()&&!Zt(e))return;const i=document.getElementById("hero-backdrop-img"),n=document.getElementById("hero-title-text"),r=document.getElementById("hero-overview-text"),a=document.getElementById("hero-play-btn"),o=document.getElementById("hero-list-btn"),s=document.getElementById("hero-trailer-btn"),l=document.getElementById("hero-rating-badge"),d=document.getElementById("hero-year-badge"),p=document.getElementById("hero-type-badge"),h=e.first_air_date||e.media_type==="tv"?"tv":"movie",f=Rs(e),b=e.vote_average?e.vote_average.toFixed(1):"8.5",v=(e.first_air_date||e.release_date||"").substring(0,4),y=++nr;if(i&&i.src!==f){const w=await $s(f,"high");if(!w||y!==nr||!i.isConnected)return;i.src=w;try{await i.decode()}catch{}if(y!==nr||!i.isConnected)return}st=t;const k=document.querySelector("#hero-slider-section .hero-content");k?.classList.remove("hero-content-committing"),requestAnimationFrame(()=>{k?.isConnected&&k.classList.add("hero-content-committing")}),n&&(n.textContent=e.title||e.name);const m=e.overview&&e.overview.trim().length>15?e.overview:qe(e,h);if(r&&(r.textContent=m),l&&(l.innerHTML=`<i data-lucide="star" style="width:13px;height:13px;fill:currentColor"></i> ${b} IMDb`),d&&(d.textContent=v||"2024"),p&&(p.textContent=h==="tv"?"DİZİ":"FİLM"),a&&(a.setAttribute("data-id",e.id),a.setAttribute("data-type",h)),s&&(s.setAttribute("data-id",e.id),s.setAttribute("data-type",h)),o){o.setAttribute("data-id",e.id),o.setAttribute("data-type",h);const w=gs(e.id);o.title=w?"Listemden Çıkar":"Listeme Ekle",o.innerHTML=`<i data-lucide="${w?"check":"plus"}" style="width:17px;height:17px;${w?"color:var(--primary);":""}"></i>`}V(document.getElementById("hero-slider-section")),document.querySelectorAll(".hero-dot").forEach((w,E)=>{w.classList.toggle("active",E===st)})}const Ms=new Map,Er=new Map;let Di=null,zc=null;function Oc(){const e=window.location.hash||"#home";e.startsWith("#detail")||(zc=e,window.scrollY>0&&Ms.set(e,window.scrollY))}function Mh(){Oc(),Di===null&&(Di=window.setTimeout(()=>{Di=null,Yr()},300))}function Yr(){Di!==null&&(clearTimeout(Di),Di=null),(window.location.hash||"#home")===zc&&Oc();for(const[e,t]of Ms)if(t>0)try{sessionStorage.setItem(`cinepulse_scroll_${e}`,String(t))}catch{}for(const[e,t]of Er)try{sessionStorage.setItem(`cinepulse_rail_${e}`,String(t))}catch{}}const Qo=Yr;function Ph(e=window.location.hash||"#home"){if(e.startsWith("#detail")){window.scrollTo({top:0,behavior:"instant"});return}document.querySelectorAll(".card-rail").forEach(i=>{if(i.id){let n=Er.get(i.id);if(typeof n!="number")try{const r=sessionStorage.getItem(`cinepulse_rail_${i.id}`);r&&(n=parseFloat(r))}catch{}typeof n=="number"&&n>0&&(i.scrollLeft=n,requestAnimationFrame(()=>{i.scrollLeft=n}))}});let t=Ms.get(e);if(typeof t!="number")try{const i=sessionStorage.getItem(`cinepulse_scroll_${e}`);i&&(t=parseFloat(i))}catch{}if(typeof t=="number"&&t>0){const i=(n=0)=>{window.scrollTo({top:t,behavior:"instant"}),n<15&&document.body.scrollHeight<t+window.innerHeight&&setTimeout(()=>i(n+1),60)};requestAnimationFrame(()=>i(0))}else window.scrollTo({top:0,behavior:"instant"})}const Bh={},Dh="https://cine-pulse-drab.vercel.app";(Bh?.VITE_MKV_RELAY_ORIGIN||"").replace(/\/$/,"");function rr(e=""){if(!e||/^https?:\/\//i.test(e))return e;if(typeof window>"u")return`http://127.0.0.1:4000${e}`;const t=window.location?.hostname||"";return!!(window.Capacitor?.isNativePlatform?.()||window.location?.protocol==="capacitor:"||t==="localhost"||t==="127.0.0.1"||t.endsWith("github.io"))?`${Dh}${e}`:e}const un=new Map,Tr="cp_fanart_v4_",zh="4e44d9029b1270a757cddc766a1bcb63";function Oh(e){if(un.has(e))return un.get(e);try{const t=localStorage.getItem(Tr+e)||sessionStorage.getItem(Tr+e);if(t!==null){const i=t?JSON.parse(t):null;return un.set(e,i),i}}catch{}}function Hn(e,t){un.set(e,t);try{const i=t?JSON.stringify(t):"";localStorage.setItem(Tr+e,i)}catch{try{sessionStorage.setItem(Tr+e,t?JSON.stringify(t):"")}catch{}}}async function Nh(e,t){try{const i=await fetch(`https://api.themoviedb.org/3/${t==="tv"?"tv":"movie"}/${e}/images?api_key=${zh}&include_image_language=tr,en,null`,{signal:AbortSignal.timeout(3500)});if(!i.ok)return null;const n=await i.json(),r=n.logos||[];let a=null;r.length>0&&(r.sort((d,p)=>{const h=f=>f.iso_639_1==="tr"?3:f.iso_639_1==="en"?2:1;return h(p)-h(d)||(p.vote_average||0)-(d.vote_average||0)}),r[0]?.file_path&&(a=`https://image.tmdb.org/t/p/w500${r[0].file_path}`));const s=(n.backdrops||[]).filter(d=>(d.iso_639_1==="tr"||d.iso_639_1==="en")&&(d.aspect_ratio||0)>1.35&&d.file_path);let l=null;return s.length>0&&(s.sort((d,p)=>{const h=f=>f.iso_639_1==="tr"?2:1;return h(p)-h(d)||(p.vote_average||0)-(d.vote_average||0)}),l=`https://image.tmdb.org/t/p/w780${s[0].file_path}`),l||a?{image:l||null,logo:l?null:a}:null}catch{return null}}async function Hh(e,t){try{const i=rr(`/api/fanart?type=${t==="tv"?"tv":"movie"}&id=${encodeURIComponent(e)}`),n=await fetch(i,{signal:AbortSignal.timeout(3e3)});if(!n.ok)return null;const r=await n.json();return r.image?{image:r.image,logo:r.logo||null}:null}catch{return null}}async function Nc(e,t="movie"){if(!/^\d+$/.test(String(e)))return null;const i=t==="tv"?"tv":"movie",n=`${i}:${e}`,r=Oh(n);if(r!==void 0)return r;const a=(async()=>{const s=Nh(e,i),l=Hh(e,i),d=await s;if(d)return Hn(n,d),d;const p=await l;return p?(Hn(n,p),p):(Hn(n,null),null)})();un.set(n,a);const o=await a;return Hn(n,o),o}function el(e){Array.isArray(e)&&e.forEach((t,i)=>{if(!t?.id)return;const n=t.media_type==="tv"||t.type==="tv"?"tv":"movie";setTimeout(()=>Nc(t.id,n),i*30)})}const qh=El||["anime","kimetsu","yaiba","iblis keser","demon slayer","naruto","boruto","shingeki","titan"];function jt(e=""){return String(e).replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t])}function Fh(e){return e?/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(e):!1}function Ps(e){if(!e)return!1;if(e.isAnime===!0||e.type==="anime"||e.media_type==="anime"||e.id&&Fe(e.id))return!0;const i=(e.genre_ids||(Array.isArray(e.genres)?e.genres.map(a=>typeof a=="object"?a.id:a):[])).some(a=>Number(a)===16),n=e.original_language==="ja"||Array.isArray(e.origin_country)&&e.origin_country.includes("JP");if(i&&n||i&&(e.origin_country?.includes("JP")||e.original_language==="ja")||e.original_language==="ja"&&(i||Fh(e.original_name||e.original_title||e.title||e.name))||Array.isArray(e.genres)&&e.genres.map(o=>typeof o=="object"?o.name:String(o)).filter(Boolean).some(o=>/anime/i.test(o)))return e.id&&Se(e.id),!0;if(typeof e.id=="string"&&(e.id.startsWith("ta_")||e.id.startsWith("acx_")||e.id.startsWith("tra_")))return Se(e.id),!0;const r=(e.title||e.name||e.original_title||e.original_name||"").toLowerCase();for(const a of qh)if(r.includes(a))return e.id&&Se(e.id),!0;return!1}function Hc(e){return e?e.first_air_date||e.number_of_seasons||e.episodesCount||Array.isArray(e.seasons)&&e.seasons.length>0||e.type==="tv"||e.media_type==="tv"?!0:(e.type==="movie"||e.media_type==="movie"||e.release_date&&!e.first_air_date,!1):!1}function Bs(e){return e?e.isAnime||e.type==="anime"||Ps(e)||e.id&&Fe(e.id)?"anime":e.type==="documentary"||e.media_type==="documentary"||(e.genre_ids||(Array.isArray(e.genres)?e.genres.map(i=>typeof i=="object"?i.id:i):[])).some(i=>Number(i)===99)?"documentary":e.type==="movie"||e.media_type==="movie"?"movie":e.type==="tv"||e.media_type==="tv"||Hc(e)?"tv":"movie":"movie"}function xt(e,t={}){const i=e.id,n=Bs(e),r=!!(e.isAnime||n==="anime"||Ps(e)||e.id&&Fe(e.id)),a=!!(e.isSeries!==void 0?e.isSeries:Hc(e)),o=a?"tv":"movie";let s=e.title||e.name||"";(!s||zr(s))&&(s=e.title_en||e.name_en||e.original_name||e.original_title||s||"İsimsiz İçerik");const l=s,d=e.poster_path||e.posterPath||e.poster||"",p=e.backdrop_path||e.backdropPath||e.backdrop||"",h=lt(d,et.POSTER_MEDIUM),f=p?lt(p,et.BACKDROP_LARGE):h,v=yt().cardLayout==="landscape"?f:h;let y=e.vote_average??e.voteAverage??e.rating,k=y?Number(y).toFixed(1):"";k==="0.0"&&(k="");const m=e.release_date||e.first_air_date||(e.year?String(e.year):""),w=m?String(m).substring(0,4):"";let E=e.progressPercent||0,C=e.season||1,S=e.episode||1,T=e.currentTime||0,I=e.completed||!1,L=!1;if(t.isContinueSection||e.currentTime>0&&!I||e.progressPercent>0&&!I)L=!0;else{const te=Xt(i,C,S);te&&(I=te.completed||!1,!I&&te.duration>0&&te.currentTime>15&&(E=Math.min(100,Math.round(te.currentTime/te.duration*100)),T=te.currentTime,a&&(C=te.season||1,S=te.episode||1)))}let D="FİLM",O="type-movie";r?(D=a?"ANİME DİZİSİ":"ANİME FİLMİ",O="type-anime"):n==="tv"||a?(D="DİZİ",O="type-tv"):n==="documentary"&&(D="BELGESEL",O="type-doc");const Y=e.original_title||e.original_name||"",j=encodeURIComponent(l),z=encodeURIComponent(Y),B=encodeURIComponent(d||""),W=encodeURIComponent(p||"");return`
    <div class="media-card" 
      data-id="${i}" 
      data-type="${o}" 
      data-isanime="${r?"true":"false"}"
      data-title="${j}" 
      data-originaltitle="${z}"
      data-poster="${B}"
      data-backdrop="${W}"
      data-tmdbid="${i}"
      data-mediatype="${n==="tv"||a?"tv":"movie"}"
      data-isseries="${a?"true":"false"}"
      data-season="${C}" 
      data-episode="${S}" 
      data-currenttime="${T}"
      data-iscontinue="${L?"true":"false"}"
      tabindex="0"
      role="button"
      aria-label="${l}">
      
      <div class="card-poster-wrapper ${p?"":"card-fanart-portrait-fallback"}">
        <img 
          src="${v}"
          data-poster-src="${h}"
          data-backdrop-src="${f}"
          alt="${l}" 
          class="card-poster-img" 
          loading="lazy" 
          decoding="async"
          onerror="this.onerror=null;this.src='${vn}'"
        />
        <img class="card-fanart-logo" alt="" aria-hidden="true" />
        
        <div class="card-glass-glow"></div>

        <!-- Left Status Pill (Completed / In-Progress with actual progress) -->
        ${I?`
          <div class="card-status-badge card-status-completed" title="Tamamlandı">
            <i data-lucide="check" style="width:10px;height:10px;stroke-width:3;"></i>
            <span>İZLENDİ</span>
          </div>
        `:L&&a&&(T>0||E>0)?`
          <div class="card-status-badge card-status-continue" title="Kaldığın Bölüm">
            <i data-lucide="clock" style="width:10px;height:10px;"></i>
            <span>S${C} B${S}</span>
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
        ${E>0&&!I?`
          <div class="card-progress-bar-bg">
            <div class="card-progress-bar-fill" style="width: ${E}%;"></div>
          </div>
        `:""}
      </div>

      <div class="card-info">
        <h3 class="card-title" title="${l}">${l}</h3>
        <div class="card-meta">
          <span class="card-type-tag ${O}">${D}</span>
          ${w?`<span class="card-year-tag">${w}</span>`:""}
        </div>
      </div>
    </div>
  `}function mt(e){if(!e||(kn(e),e._hasMediaEventsDelegated))return;e._hasMediaEventsDelegated=!0;let t=0;e.addEventListener("click",s=>{if(Date.now()<t){s.preventDefault(),s.stopPropagation();return}if(s.target.closest(".btn-lib-delete")||s.target.closest(".btn-delete-history"))return;const l=s.target.closest(".media-card");if(!l)return;s.preventDefault();const d=l.getAttribute("data-id"),p=l.getAttribute("data-type"),h=l.getAttribute("data-isanime")==="true"||p==="anime"||Fe(d),f=parseInt(l.getAttribute("data-season")||"1",10),b=parseInt(l.getAttribute("data-episode")||"1",10),v=parseFloat(l.getAttribute("data-currenttime")||"0"),y=decodeURIComponent(l.getAttribute("data-title")||""),k=decodeURIComponent(l.getAttribute("data-originaltitle")||""),m=l.getAttribute("data-poster")||"",w=l.getAttribute("data-backdrop")||"",E=l.getAttribute("data-iscontinue")==="true",C=l.getAttribute("data-isseries"),S=l.getAttribute("data-mediatype"),T=C!==null?C==="true":S==="tv"||p==="tv";E&&(l.closest("#continue-watching-rail")||l.closest(".continue-card-wrapper")||v>0)?Qt({type:h?"anime":T?"tv":"movie",isAnime:h,isSeries:T,tmdbId:d,title:T?`${y} - S${f}E${b}`:y,seriesTitle:y,originalTitle:k||y,season:T?f:void 0,episode:T?b:void 0,posterPath:m,backdropPath:w,currentTime:v}):(Qo(),window.location.hash=`#detail?type=${h?"anime":p}&id=${d}`)}),document.querySelector("link[rel=preconnect][href*=youtube-nocookie]")||["https://www.youtube-nocookie.com","https://i.ytimg.com"].forEach(s=>{const l=document.createElement("link");l.rel="preconnect",l.href=s,l.crossOrigin="anonymous",document.head.appendChild(l)});const i=window.matchMedia("(hover: hover) and (pointer: fine)").matches,n=window.matchMedia("(pointer: coarse)").matches,r=yt(),a=r.hoverPreviewsEnabled!==!1&&r.trailersEnabled!==!1;function o(s,l){if(s.querySelector(".card-hover-video-preview"))return;let d=sessionStorage.getItem("cinepulse_preview_sound")==="on";l.then(p=>{if(!p||!p.key||!p.key.trim()||!s.isConnected||i&&!s.matches(":hover"))return;const h=decodeURIComponent(s.getAttribute("data-title")||"Fragman"),f=s.querySelector(".card-type-tag")?.textContent?.trim()||"",b=s.querySelector(".card-year-tag")?.textContent?.trim()||"",v=s.querySelector(".card-rating-pill span")?.textContent?.trim()||"",y=s.getAttribute("data-id")||"",k=s.getAttribute("data-type")||"movie",m=`#detail?type=${encodeURIComponent(k)}&id=${encodeURIComponent(y)}`,w=encodeURIComponent(p.key),E=document.createElement("div");E.className="card-hover-video-preview";const C=window.innerWidth<=700;if(C&&(document.querySelectorAll(".card-hover-video-preview").forEach(B=>{typeof B._closePreview=="function"?B._closePreview():(B.closest?.(".media-card")?.classList.remove("preview-active"),B.remove())}),document.querySelectorAll(".card-preview-mobile-close-portal").forEach(B=>B.remove()),E.classList.add("is-mobile-sheet")),E.innerHTML=`
        <div class="card-preview-media">
          <iframe
            src="https://www.youtube-nocookie.com/embed/${w}?autoplay=1&mute=1&controls=0&disablekb=1&modestbranding=1&loop=1&playlist=${w}&rel=0&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}"
            frameborder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            tabindex="-1"
            title="${jt(h)} fragmanı">
          </iframe>
          <div class="card-preview-cinematic-shade"></div>
          <span class="card-preview-badge">FRAGMAN</span>
        </div>
        <button class="card-preview-close-btn" type="button" aria-label="Fragmanı kapat" title="Fragmanı kapat"><i data-lucide="x"></i></button>
        <div class="card-preview-details">
          <div class="card-preview-copy">
            <strong class="card-preview-title">${jt(h)}</strong>
            <div class="card-preview-meta">
              ${v?`<span class="card-preview-match">${jt(v)} IMDb</span>`:""}
              ${b?`<span>${jt(b)}</span>`:""}
              ${f?`<span>${jt(f)}</span>`:""}
            </div>
          </div>
          <div class="card-preview-actions">
            <a class="card-preview-detail" href="${jt(m)}" aria-label="${jt(h)} içerik sayfasına git"><i data-lucide="info"></i><span>İçeriğe Git</span></a>
            <a class="card-preview-open" href="${jt(p.watchUrl||`https://www.youtube.com/watch?v=${w}`)}" target="_blank" rel="noopener noreferrer" title="YouTube'da aç" aria-label="Fragmanı YouTube'da aç"><i data-lucide="external-link"></i></a>
            <button class="card-preview-sound ${d?"is-on":""}" type="button" aria-label="${d?"Sesi kapat":"Sesi aç"}" title="${d?"Sesi kapat":"Sesi aç"}">
              <i data-lucide="${d?"volume-2":"volume-x"}"></i>
            </button>
          </div>
        </div>
      `,!C){const B=s.getBoundingClientRect(),W=window.innerHeight<520?12:76,ie=Math.min(460,Math.max(390,B.width*2.2),window.innerWidth-32),te=Math.max(240,(window.innerHeight-W-94)*16/9),re=Math.max(240,Math.min(ie,te)),N=re*9/16+82,ae=Math.max(16,Math.min(window.innerWidth-re-16,B.left+(B.width-re)/2)),J=Math.max(W,Math.min(window.innerHeight-N-12,B.top+(B.height-N)/2));E.style.left=`${ae}px`,E.style.top=`${J}px`,E.style.width=`${re}px`}s.classList.add("preview-active"),s.appendChild(E),V();const S=E.querySelector("iframe");let T=null,I=null;C&&(T=document.createElement("button"),T.type="button",T.className="card-preview-mobile-close-portal",T.setAttribute("aria-label","Fragmanı kapat"),T.title="Fragmanı kapat",T.innerHTML='<i data-lucide="x"></i>',I=()=>{const B=E.getBoundingClientRect();T.style.top=`${Math.max(8,B.top+12)}px`,T.style.left=`${Math.max(8,B.right-52)}px`},document.body.appendChild(T),requestAnimationFrame(I),window.addEventListener("resize",I,{passive:!0}),V(T)),E.addEventListener("click",B=>B.stopPropagation()),E.addEventListener("touchend",B=>B.stopPropagation(),{passive:!0});const L=E.querySelector(".card-preview-sound"),D=E.querySelector(".card-preview-close-btn");E.querySelector(".card-preview-detail")?.addEventListener("click",()=>{Qo(),j()});const O=(B,W=[])=>{S?.contentWindow?.postMessage(JSON.stringify({event:"command",func:B,args:W}),"*")},Y=()=>{O(d?"unMute":"mute"),d&&O("setVolume",[75]),L.classList.toggle("is-on",d),L.title=d?"Sesi kapat":"Sesi aç",L.setAttribute("aria-label",L.title),L.innerHTML=`<i data-lucide="${d?"volume-2":"volume-x"}"></i>`,V()},j=()=>{I&&window.removeEventListener("resize",I);try{T?.remove()}catch{}try{E.remove()}catch{}s.classList.remove("preview-active")};E._closePreview=j;const z=window.setTimeout(()=>{E.classList.add("video-ready")},1500);S.addEventListener("load",()=>{window.clearTimeout(z),E.classList.add("video-ready"),d&&window.setTimeout(Y,180)},{once:!0}),L.addEventListener("click",B=>{B.preventDefault(),B.stopPropagation(),d=!d,sessionStorage.setItem("cinepulse_preview_sound",d?"on":"off"),Y(),window.setTimeout(Y,180)}),D&&D.addEventListener("click",B=>{B.preventDefault(),B.stopPropagation(),j()}),T?.addEventListener("click",B=>{B.preventDefault(),B.stopPropagation(),j()})}).catch(()=>{})}if(i&&a){const s=new WeakMap;e.addEventListener("pointerover",l=>{const d=l.target.closest(".media-card");if(!d||l.relatedTarget&&d.contains(l.relatedTarget))return;const p=d.getAttribute("data-id"),h=d.getAttribute("data-type")||"movie",f=bn(h==="tv"?"tv":"movie",p),b=setTimeout(()=>o(d,f),850);s.set(d,b)}),e.addEventListener("pointerout",l=>{const d=l.target.closest(".media-card");if(!d||l.relatedTarget&&d.contains(l.relatedTarget))return;const p=s.get(d);p&&clearTimeout(p),s.delete(d);const h=d.querySelector(".card-hover-video-preview");if(h)try{h.remove()}catch{}d.classList.remove("preview-active")})}if(n&&a){const l=new WeakMap;e.addEventListener("touchstart",p=>{if(p.target.closest(".card-hover-video-preview"))return;const h=p.target.closest(".media-card");if(!h)return;const f={opened:!1,timer:null},b=h.getAttribute("data-id"),v=h.getAttribute("data-type")||"movie",y=bn(v==="tv"?"tv":"movie",b);f.timer=setTimeout(()=>{f.timer=null,f.opened=!0,t=Date.now()+900;try{navigator.vibrate?.(40)}catch{}o(h,y)},600),l.set(h,f)},{passive:!0});const d=p=>{const h=p.target.closest(".media-card"),f=h&&l.get(h);f&&(f.timer&&clearTimeout(f.timer),f.timer=null,(!f.opened||p.type!=="touchend")&&l.delete(h))};e.addEventListener("touchend",d,{passive:!0}),e.addEventListener("touchmove",d,{passive:!0}),e.addEventListener("touchcancel",d,{passive:!0}),e.addEventListener("touchend",p=>{const h=p.target.closest(".media-card");(h&&l.get(h))?.opened&&l.delete(h)},{passive:!0})}}let Zi=null;function Uh(){return Zi||("IntersectionObserver"in window?(Zi=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&(Zi.unobserve(t.target),qc(t.target))})},{rootMargin:"800px 0px"}),Zi):null)}async function qc(e){if(!e||e.dataset.fanartState)return;e.dataset.fanartState="loading";const t=e.querySelector(".card-poster-img");if(!t)return;const i=await Nc(e.dataset.tmdbid,e.dataset.mediatype||"movie");if(!i?.image&&!i?.logo){e.dataset.fanartState="empty";return}if(!(i.image||t.dataset.backdropSrc||t.src)){e.dataset.fanartState="empty";return}const r=p=>new Promise(h=>{const f=new Image;f.onload=()=>h(!0),f.onerror=()=>h(!1),f.src=p}),[a,o]=await Promise.all([i.image?r(i.image):Promise.resolve(!0),i.logo?r(i.logo):Promise.resolve(!0)]);if(!a||!o||!e.isConnected){e.dataset.fanartState="empty";return}i.image&&(t.dataset.backdropSrc=i.image);const s=e.querySelector(".card-fanart-logo");s&&i.logo&&(s.src=i.logo);const l=e.querySelector(".card-poster-wrapper");l?.classList.remove("card-fanart-placeholder"),l?.classList.toggle("card-fanart-composite",!!i.logo),(yt().cardLayout==="landscape"||document.documentElement.classList.contains("cards-landscape"))&&i.image&&(t.src=i.image),e.dataset.fanartState="loaded"}function kn(e=document){if(!(yt().cardLayout==="landscape"||document.documentElement.classList.contains("cards-landscape")))return;const n=(e&&e.querySelectorAll?e:document).querySelectorAll(".media-card[data-tmdbid]:not([data-fanart-state])");if(!n.length)return;const r=Uh();if(!r){n.forEach(a=>qc(a));return}n.forEach(a=>r.observe(a))}let tt=null,Kt=null,Ci=0;const Ar=new Map,rs=new Set,jh=10*60*1e3;function Kh(){Ih();for(const e of rs)e.disconnect();rs.clear()}function Wh(e){try{const t=sessionStorage.getItem(`cinepulse_home_fast_v7_${e?"kids":"adult"}`);if(!t)return null;const i=JSON.parse(t);return!i?.savedAt||Date.now()-i.savedAt>jh?null:i.data?.isKid===e?i.data:null}catch{return null}}function Ia(e){try{sessionStorage.setItem(`cinepulse_home_fast_v7_${e.isKid?"kids":"adult"}`,JSON.stringify({savedAt:Date.now(),data:e}))}catch{}}function pn(){tt=null,Kt=null,Ci++;try{sessionStorage.removeItem("cinepulse_home_fast_v2_kids"),sessionStorage.removeItem("cinepulse_home_fast_v2_adult"),sessionStorage.removeItem("cinepulse_home_fast_v3_kids"),sessionStorage.removeItem("cinepulse_home_fast_v3_adult"),sessionStorage.removeItem("cinepulse_home_fast_v4_kids"),sessionStorage.removeItem("cinepulse_home_fast_v4_adult"),sessionStorage.removeItem("cinepulse_home_fast_v5_kids"),sessionStorage.removeItem("cinepulse_home_fast_v5_adult"),sessionStorage.removeItem("cinepulse_home_fast_v6_kids"),sessionStorage.removeItem("cinepulse_home_fast_v6_adult"),sessionStorage.removeItem("cinepulse_home_fast_v7_kids"),sessionStorage.removeItem("cinepulse_home_fast_v7_adult")}catch{}Ar.clear(),Object.keys(_e).forEach(e=>{_e[e].page=1,_e[e].loading=!1,_e[e].exhausted=!1})}const _e={"rail-popular-tv":{page:1,loading:!1,exhausted:!1,fetcher:hr},"rail-popular-movies":{page:1,loading:!1,exhausted:!1,fetcher:fr},"rail-top-tv":{page:1,loading:!1,exhausted:!1,fetcher:e=>Li("tv",e)},"rail-top-movies":{page:1,loading:!1,exhausted:!1,fetcher:e=>Li("movie",e)},"rail-anime":{page:1,loading:!1,exhausted:!1,fetcher:mr},"rail-adult-animation":{page:1,loading:!1,exhausted:!1,fetcher:Fa},"rail-cartoon-series":{page:1,loading:!1,exhausted:!1,fetcher:pr},"rail-documentary":{page:1,loading:!1,exhausted:!1,fetcher:gr}};function Pe({id:e,icon:t,title:i,accent:n,items:r}){if(!r||r.length===0)return"";const a=Ar.get(e)||[],s=[...r,...a].map(l=>xt(l)).join("");return`
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
  `}function Yh(e){return!e||e.length===0?"":`
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
      ${xt(n,{isContinueSection:!0})}
      <button class="btn-delete-history" title="Geçmişten Kaldır" aria-label="Kaldır">
        <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
      </button>
    </div>
  `).join("")}
        </div>
      </div>
    </section>
  `}function tl(e){const t=e.querySelectorAll(".rail-sentinel");t.length!==0&&t.forEach(i=>{const n=i.getAttribute("data-rail"),r=document.getElementById(n);if(!r)return;const a=async()=>{const s=_e[n];if(!s||s.loading||s.exhausted)return;s.loading=!0;const l=document.createElement("div");l.className="rail-loader",l.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:22px;height:22px;color:var(--text-muted);"></i>',i.before(l),V(l);try{const d=new Set(Array.from(r.querySelectorAll(".media-card[data-id]")).map(f=>String(f.getAttribute("data-id"))).filter(Boolean));let p=[];for(let f=0;f<4&&p.length===0;f+=1){s.page+=1;const b=await s.fetcher(s.page);if(!b||b.length===0){s.exhausted=!0;break}p=b.filter(v=>{const y=String(v?.id||"");return!y||d.has(y)?!1:(d.add(y),!0)})}if(l.remove(),p.length===0||!r.isConnected){s.loading=!1;return}const h=Ar.get(n)||[];Ar.set(n,[...h,...p]),p.forEach(f=>{const b=document.createElement("div");b.innerHTML=xt(f);const v=b.firstElementChild;v&&(r.insertBefore(v,i),v.addEventListener("click",()=>{const y=v.getAttribute("data-id"),k=v.getAttribute("data-type");window.location.hash=`#detail?type=${k}&id=${y}`}))}),V(r),kn(r)}catch{l.remove()}s.loading=!1};r.addEventListener("scroll",()=>{r.scrollWidth-(r.scrollLeft+r.clientWidth)<600&&a()},{passive:!0});const o=new IntersectionObserver(s=>{s.forEach(l=>{l.isIntersecting&&a()})},{root:r,rootMargin:"0px 400px 0px 0px",threshold:0});o.observe(i),rs.add(o)})}async function Vh(){const e=Ci,t=Lt();let i,n,r,a,o,s,l,d,p,h,f,b;tt||(tt=Wh(t));let v=null,y=!1,k=!1;if(tt&&tt.isKid===t)({trending:i,popularTV:n,popularMovies:r,topRatedTV:a,topRatedMovies:o,animeItems:s,docItems:l,kidsAdventures:d,adultAnimationItems:p,cartoonSeriesItems:h,kidsAnimationItems:f,kidsClassicCartoonItems:b}=tt),v=Kt,y=!v;else if(t){if(v=Promise.all([oo(1),ja(1),ao(1),so(1)]).then(L=>{e===Ci&&([d,s,f,b]=L,tt={isKid:!0,trending:i,popularTV:n,popularMovies:r,kidsAdventures:d,animeItems:s,kidsAnimationItems:f,kidsClassicCartoonItems:b},k&&Ia(tt),y=!0)}).catch(()=>{y=!0}),Kt=v,v.then(()=>{Kt===v&&(Kt=null)}),[n,r]=await Promise.all([qa(1),Ua(1)]),i=[...r||[],...n||[]].filter(L=>L.backdrop_path&&Zt(L)).slice(0,10),e!==Ci)return null;y||(tt={isKid:!0,trending:i,popularTV:n,popularMovies:r})}else{if(v=Promise.all([Li("tv",1),Li("movie",1),mr(1),gr(1),Fa(1),pr(1)]).then(L=>{e===Ci&&([a,o,s,l,p,h]=L,tt={isKid:!1,trending:i,popularTV:n,popularMovies:r,topRatedTV:a,topRatedMovies:o,animeItems:s,docItems:l,adultAnimationItems:p,cartoonSeriesItems:h},k&&Ia(tt),y=!0)}).catch(()=>{y=!0}),Kt=v,v.then(()=>{Kt===v&&(Kt=null)}),[i,n,r]=await Promise.all([Dl("all","week",1),hr(1),fr(1)]),e!==Ci)return null;y||(tt={isKid:!1,trending:i,popularTV:n,popularMovies:r})}k=!0,y&&tt&&Ia(tt);const m=y,w=to(),E=Gs(w);let C;t?C=[...r||[],...n||[]].filter(D=>D.backdrop_path&&Zt(D)).slice(0,10):C=i;const S=Rh(C);t?(_e["rail-kids-animation"]||(_e["rail-kids-animation"]={page:1,loading:!1,exhausted:!1,fetcher:ao}),_e["rail-kids-classics"]||(_e["rail-kids-classics"]={page:1,loading:!1,exhausted:!1,fetcher:so}),_e["rail-kids-movies"]||(_e["rail-kids-movies"]={page:1,loading:!1,exhausted:!1,fetcher:Ua}),_e["rail-kids-adventures"]||(_e["rail-kids-adventures"]={page:1,loading:!1,exhausted:!1,fetcher:oo}),_e["rail-anime"]||(_e["rail-anime"]={page:1,loading:!1,exhausted:!1,fetcher:ja})):(_e["rail-popular-tv"]||(_e["rail-popular-tv"]={page:1,loading:!1,exhausted:!1,fetcher:hr}),_e["rail-popular-movies"]||(_e["rail-popular-movies"]={page:1,loading:!1,exhausted:!1,fetcher:fr}),_e["rail-top-tv"]||(_e["rail-top-tv"]={page:1,loading:!1,exhausted:!1,fetcher:L=>Li("tv",L)}),_e["rail-top-movies"]||(_e["rail-top-movies"]={page:1,loading:!1,exhausted:!1,fetcher:L=>Li("movie",L)}),_e["rail-anime"]||(_e["rail-anime"]={page:1,loading:!1,exhausted:!1,fetcher:mr}),_e["rail-adult-animation"]||(_e["rail-adult-animation"]={page:1,loading:!1,exhausted:!1,fetcher:Fa}),_e["rail-cartoon-series"]||(_e["rail-cartoon-series"]={page:1,loading:!1,exhausted:!1,fetcher:pr})),t||_e["rail-documentary"]||(_e["rail-documentary"]={page:1,loading:!1,exhausted:!1,fetcher:gr}),Object.values(_e).forEach(L=>{L.loading=!1});let T="";return t?T=`
      ${Pe({id:"rail-kids-movies",icon:"sparkles",title:"🎈 En Çok Sevilen Animasyon & Çocuk Filmleri",accent:"#ec4899",items:r})}

      ${f&&f.length>0?Pe({id:"rail-kids-animation",icon:"sparkles",title:"Çocuk Animasyonları & Yeni Çizgi Diziler",accent:"#fb7185",items:f}):""}

      ${b&&b.length>0?Pe({id:"rail-kids-classics",icon:"palette",title:"Çizgi Dizi Dünyası & Unutulmaz Klasikler",accent:"#38bdf8",items:b}):""}

      ${d&&d.length>0?Pe({id:"rail-kids-adventures",icon:"compass",title:"⭐ Aile ve Fantastik Sinema Kuşağı",accent:"#38bdf8",items:d}):""}

      ${s&&s.length>0?Pe({id:"rail-anime",icon:"smile",title:"🎌 Çocuk & Genç Anime Dünyası",accent:"#a855f7",items:s}):""}
    `:T=`
      ${Pe({id:"rail-popular-tv",icon:"tv-2",title:"Trend Diziler & Yapımlar",accent:"#14b8a6",items:n})}

      ${p&&p.length>0?Pe({id:"rail-adult-animation",icon:"sparkles",title:"Yetişkin Animasyonları & Çizgi Diziler",accent:"#fb7185",items:p}):""}

      ${h&&h.length>0?Pe({id:"rail-cartoon-series",icon:"wand-2",title:"Çizgi Dizi Dünyası & Unutulmaz Klasikler",accent:"#38bdf8",items:h}):""}

      ${Pe({id:"rail-popular-movies",icon:"clapperboard",title:"Tüm Zamanların En Popüler Filmleri",accent:"#a78bfa",items:r})}

      ${Pe({id:"rail-top-movies",icon:"award",title:"⭐ Sinema Tarihinin Başyapıtları (IMDb 8.5+)",accent:"#fbbf24",items:o})}

      ${Pe({id:"rail-top-tv",icon:"star",title:"Kült & En Yüksek Puanlı Diziler",accent:"#34d399",items:a})}

      ${s&&s.length>0?Pe({id:"rail-anime",icon:"sparkles",title:"🎌 Popüler Anime Evreni (TR Dublaj & Altyazı)",accent:"#ec4899",items:s}):""}

      ${l&&l.length>0?Pe({id:"rail-documentary",icon:"globe",title:"🌍 İlham Veren Kült Belgeseller",accent:"#38bdf8",items:l}):""}
    `,{html:`
    <div class="home-view ${t?"is-kids-mode":""}">
      ${S}

      ${Yh(E)}

      ${T}
    </div>
  `,init:L=>{const D=C&&C.length>0?C:i;D&&D.length>0&&$h(D),mt(L);const O=j=>{j.querySelectorAll(".card-rail").forEach(z=>{const B=z.id;if(B){let W=Er.get(B);if(typeof W!="number")try{const ie=sessionStorage.getItem(`cinepulse_rail_${B}`);ie&&(W=parseFloat(ie))}catch{}typeof W=="number"&&W>0&&(z.scrollLeft=W,requestAnimationFrame(()=>{z.scrollLeft=W})),z.addEventListener("scroll",()=>{Er.set(B,z.scrollLeft)},{passive:!0})}z.addEventListener("wheel",W=>{Math.abs(W.deltaX)>Math.abs(W.deltaY)||(W.preventDefault(),z.scrollBy({left:W.deltaY*2.5,behavior:"smooth"}))},{passive:!1})})};if(O(L),L.querySelectorAll(".spotlight-hero, .spotlight-mini").forEach(j=>{j.addEventListener("click",()=>{const z=j.getAttribute("data-id"),B=j.getAttribute("data-type");z&&B&&(window.location.hash=`#detail?type=${B}&id=${z}`)})}),L.querySelector(".spotlight-hero-btn")?.addEventListener("click",j=>{j.stopPropagation();const z=L.querySelector(".spotlight-hero");if(z){const B=z.getAttribute("data-id"),W=z.getAttribute("data-type");window.location.hash=`#detail?type=${W}&id=${B}`}}),tl(L),v&&!m){const j=L.querySelector(".home-view");v.then(()=>{if({topRatedTV:a,topRatedMovies:o,animeItems:s,docItems:l,kidsAdventures:d,adultAnimationItems:p,cartoonSeriesItems:h,kidsAnimationItems:f,kidsClassicCartoonItems:b}=tt||{},!j?.isConnected||!(window.location.hash||"#home").startsWith("#home"))return;const z=document.createElement("div");z.className="home-more-rails",z.innerHTML=t?`
            ${Pe({id:"rail-kids-animation",icon:"sparkles",title:"Çocuk Animasyonları & Yeni Çizgi Diziler",accent:"#fb7185",items:f})}
            ${Pe({id:"rail-kids-classics",icon:"palette",title:"Çizgi Dizi Dünyası & Unutulmaz Klasikler",accent:"#38bdf8",items:b})}
            ${Pe({id:"rail-kids-adventures",icon:"compass",title:"⭐ Aile ve Fantastik Sinema Kuşağı",accent:"#38bdf8",items:d})}
            ${Pe({id:"rail-anime",icon:"smile",title:"🎌 Çocuk & Genç Anime Dünyası",accent:"#a855f7",items:s})}
          `:`
            ${Pe({id:"rail-adult-animation",icon:"sparkles",title:"Yetişkin Animasyonları & Çizgi Diziler",accent:"#fb7185",items:p})}
            ${Pe({id:"rail-cartoon-series",icon:"wand-2",title:"Çizgi Dizi Dünyası & Unutulmaz Klasikler",accent:"#38bdf8",items:h})}
            ${Pe({id:"rail-top-movies",icon:"award",title:"⭐ Sinema Tarihinin Başyapıtları (IMDb 8.5+)",accent:"#fbbf24",items:o})}
            ${Pe({id:"rail-top-tv",icon:"star",title:"Kült & En Yüksek Puanlı Diziler",accent:"#34d399",items:a})}
            ${Pe({id:"rail-anime",icon:"sparkles",title:"🎌 Popüler Anime Evreni (TR Dublaj & Altyazı)",accent:"#ec4899",items:s})}
            ${Pe({id:"rail-documentary",icon:"globe",title:"🌍 İlham Veren Kült Belgeseller",accent:"#38bdf8",items:l})}
          `,j.append(z),V(z),mt(z),O(z),tl(z)})}L.querySelectorAll(".btn-delete-history").forEach(j=>{j.addEventListener("click",z=>{z.stopPropagation();const B=j.closest(".continue-card-wrapper");if(!B)return;const W=B.getAttribute("data-id");Oa(W),Z("İçerik izleme geçmişinden kaldırıldı.","info"),B.style.transition="all 0.28s ease-out",B.style.transform="scale(0.85)",B.style.opacity="0",setTimeout(()=>{B.remove();const ie=L.querySelector("#continue-watching-rail");ie&&ie.children.length===0&&ie.closest(".rail-section")?.remove()},300)})});const Y=()=>{if(!(window.location.hash||"#home").startsWith("#home"))return;const j=L.querySelector(".home-view");if(!j?.isConnected)return;const z=Gs(to()),B=L.querySelector("#continue-watching-rail")?.closest(".rail-section");if(z&&z.length>0){const ie=z.slice(0,24).map(te=>`
            <div class="continue-card-wrapper" data-id="${te.id}" data-season="${te.season||1}" data-episode="${te.episode||1}">
              ${xt(te,{isContinueSection:!0})}
              <button class="btn-delete-history" title="Geçmişten Kaldır" aria-label="Kaldır">
                <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
              </button>
            </div>
          `).join("");if(B){const te=B.querySelector("#continue-watching-rail");te&&(te.innerHTML=ie)}else{const te=`
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
                    ${ie}
                  </div>
                </div>
              </section>
            `,re=j.querySelector(".hero-slider-section")||j.querySelector(".rail-section");re?re.insertAdjacentHTML("afterend",te):j.insertAdjacentHTML("afterbegin",te)}V(L),mt(L),L.querySelectorAll(".btn-delete-history").forEach(te=>{te.addEventListener("click",re=>{re.stopPropagation();const N=te.closest(".continue-card-wrapper");if(!N)return;const ae=N.getAttribute("data-id");Oa(ae),Z("İçerik izleme geçmişinden kaldırıldı.","info"),N.style.transition="all 0.28s ease-out",N.style.transform="scale(0.85)",N.style.opacity="0",setTimeout(()=>{N.remove();const J=L.querySelector("#continue-watching-rail");J&&J.children.length===0&&J.closest(".rail-section")?.remove()},300)})})}else B&&B.remove()};window.addEventListener("cinepulse_data_changed",Y),window.addEventListener("sineflix_data_changed",Y)}}}async function Gh({tvId:e,seriesTitle:t,originalTitle:i="",seriesOverview:n="",seasons:r=[],posterPath:a="",backdropPath:o="",isAnime:s=!1,spoilerFree:l=!1}){const d=r.filter(k=>k.season_number>0);d.length===0&&r.length>0&&d.push(r[0]);const p=d.length>0?d[0].season_number:1,h=d.length>0&&d[0].episode_count||10,f=sa(e,p,h);let b=!!l,v=null;return{html:`
    <div class="season-selector-wrapper">
      <div class="season-selector-header">
        <div style="display: flex; align-items: center; gap: 0.65rem;">
          <span class="rail-icon-pill" style="--rail-color: #f59e0b; width: 28px; height: 28px;">
            <i data-lucide="layers" style="width: 15px; height: 15px;"></i>
          </span>
          <h2 class="season-selector-title" style="margin: 0;">Sezonlar ve Bölümler</h2>
        </div>

        <!-- Bulk Mark Current Season Watched Button -->
        <button id="btn-mark-season-all" class="btn-secondary" style="padding: 0.45rem 1.1rem; font-size: 0.82rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.45rem; cursor: pointer; ${f?"background: rgba(16, 185, 129, 0.2); border-color: #10b981; color: #10b981;":""}">
          <i data-lucide="${f?"check-circle-2":"check-check"}" style="width: 14px; height: 14px;"></i>
          <span>${f?"Bu Sezon İzlendi":"Bu Sezonu İzlendi İşaretle"}</span>
        </button>
      </div>

      <!-- Luxury Segmented Season Pills Track with PC Arrows & Scroll Support -->
      <div class="season-tabs-wrapper" style="position: relative; display: flex; align-items: center; margin-bottom: 1.5rem; width: 100%;">
        <button class="season-nav-arrow left" id="btn-season-prev" title="Önceki Sezonlar" aria-label="Geri">
          <i data-lucide="chevron-left" style="width:16px;height:16px;"></i>
        </button>
        <div class="season-pills-track" id="season-tabs-bar">
          ${d.map(k=>`
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
  `,init:k=>{if(!k)return;let m=p,w=h;const E=()=>{const O=k.querySelector("#btn-mark-season-all");if(!O)return;const Y=sa(e,m,w),j=O.querySelector("span"),z=O.querySelector("i");j&&(j.textContent=Y?"Bu Sezon İzlendi":"Bu Sezonu İzlendi İşaretle"),z&&z.setAttribute("data-lucide",Y?"check-circle-2":"check-check"),Y?(O.style.background="rgba(16, 185, 129, 0.2)",O.style.borderColor="#10b981",O.style.color="#10b981"):(O.style.background="",O.style.borderColor="",O.style.color=""),V()};ar(e,t,n,m,k,a,o,i,d,E,s,b);const C=O=>{if(O&&O.detail&&O.detail.isProgressUpdate&&document.getElementById("player-modal"))return;const Y=k.querySelector("#episode-grid-container");Y&&(Y.querySelectorAll(".episode-card").forEach(j=>{const z=parseInt(j.getAttribute("data-season"),10),B=parseInt(j.getAttribute("data-episode"),10),W=Xt(e,z,B),ie=W?W.progressPercent:0,te=W?W.completed||ie>=90:!1,re=W&&!te&&W.currentTime>0,N=j.querySelector(".badge-watched-status"),ae=j.querySelector(".btn-mark-ep-watched"),J=j.querySelector(".card-progress-fill"),K=j.querySelector(".btn-mark-ep-halfway");N&&(te?(N.innerHTML='<i data-lucide="check" style="width:11px; height:11px"></i> İZLENDİ',N.style.background="var(--accent-green)",N.style.color="#fff",N.style.display="inline-flex"):re?(N.innerHTML='<i data-lucide="clock" style="width:11px; height:11px"></i> YARIDA',N.style.background="rgba(245, 158, 11, 0.95)",N.style.color="#000",N.style.display="inline-flex"):N.style.display="none"),ae&&(te?(ae.classList.add("watched"),ae.style.background="#10b981",ae.style.borderColor="#10b981",ae.title="İzlendi işaretini kaldır"):(ae.classList.remove("watched"),ae.style.background="rgba(0,0,0,0.65)",ae.style.borderColor="rgba(255,255,255,0.3)",ae.title="İzlendi olarak işaretle")),K&&(K.style.background=re?"#f59e0b":"rgba(0,0,0,0.65)",K.style.borderColor=re?"#f59e0b":"rgba(255,255,255,0.3)"),J&&(J.style.width=`${ie}%`,J.style.background=te?"var(--accent-green)":"#fbbf24")}),V()),E()};window.addEventListener("sineflix_data_changed",C),k.querySelectorAll(".season-pill").forEach(O=>{O.addEventListener("click",Y=>{Y.preventDefault(),k.querySelectorAll(".season-pill").forEach(j=>j.classList.remove("active")),O.classList.add("active"),O.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"}),m=parseInt(O.getAttribute("data-season"),10),w=parseInt(O.getAttribute("data-ep-count"),10)||10,ar(e,t,n,m,k,a,o,i,d,E,s,b),E()})});const S=k.querySelector(".season-pill.active");S&&setTimeout(()=>{S.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})},120);const T=k.querySelector("#season-tabs-bar"),I=k.querySelector("#btn-season-prev"),L=k.querySelector("#btn-season-next");if(T){I?.addEventListener("click",B=>{B.preventDefault(),T.scrollBy({left:-260,behavior:"smooth"})}),L?.addEventListener("click",B=>{B.preventDefault(),T.scrollBy({left:260,behavior:"smooth"})}),T.addEventListener("wheel",B=>{B.deltaY!==0&&T.scrollWidth>T.clientWidth&&(B.preventDefault(),T.scrollLeft+=B.deltaY)},{passive:!1});let O=!1,Y=0,j=0,z=!1;T.addEventListener("mousedown",B=>{B.button===0&&(O=!0,z=!1,T.classList.add("dragging"),Y=B.pageX-T.offsetLeft,j=T.scrollLeft)}),window.addEventListener("mousemove",B=>{if(!O)return;const ie=(B.pageX-T.offsetLeft-Y)*1.5;Math.abs(ie)>4&&(z=!0),T.scrollLeft=j-ie}),window.addEventListener("mouseup",()=>{O&&(O=!1,T.classList.remove("dragging"),setTimeout(()=>{z=!1},50))}),T.addEventListener("click",B=>{z&&(B.preventDefault(),B.stopPropagation())},!0)}const D=k.querySelector("#btn-mark-season-all");D&&D.addEventListener("click",O=>{O.preventDefault();const j=!sa(e,m,w);Cd(e,m,w,j,{title:t,posterPath:a,backdropPath:o,type:s?"anime":"tv",isAnime:s}),Z(j?`${m}. Sezonun tüm bölümleri izlendi!`:`${m}. Sezon izlenmedi olarak işaretlendi.`,j?"success":"info");const z=k.querySelector("#episode-grid-container");z&&(z.querySelectorAll(".episode-card").forEach(B=>{const W=B.querySelector(".badge-watched-status"),ie=B.querySelector(".btn-mark-ep-watched");W&&(W.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',W.style.background="var(--accent-green)",W.style.color="#fff",W.style.display=j?"inline-flex":"none"),ie&&(j?(ie.classList.add("watched"),ie.style.background="#10b981",ie.style.borderColor="#10b981",ie.title="İzlendi işaretini kaldır"):(ie.classList.remove("watched"),ie.style.background="rgba(0,0,0,0.65)",ie.style.borderColor="rgba(255,255,255,0.3)",ie.title="İzlendi olarak işaretle"))}),V()),E()}),v=O=>{b=!!O,ar(e,t,n,m,k,a,o,i,d,E,s,b)}},setSpoilerSafe(k){b=!!k,v?.(b)}}}function Jh(e){const t=Be().filter(i=>String(i?.id)===String(e)&&(Number(i.currentTime)>0||i.completed||Number(i.progressPercent)>0));return t.length?t.reduce((i,n)=>{const r={season:Math.max(1,Number(n.season)||1),episode:Math.max(1,Number(n.episode)||1)};return r.season>i.season||r.season===i.season&&r.episode>i.episode?r:i},{season:1,episode:1}):{season:1,episode:1}}async function ar(e,t,i,n,r,a="",o="",s="",l=[],d=null,p=!1,h=!1){const f=r.querySelector("#episode-grid-container");if(!f)return;f.innerHTML=`<div style="padding: 3rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;"><i data-lucide="loader-2" class="spin-loader" style="width: 24px; height: 24px; margin-bottom: 0.5rem;"></i><div>${n}. Sezon bölümleri getiriliyor...</div></div>`,V();let b=null;try{b=await Zd(e,n)}catch{}if(!b||!b.episodes||b.episodes.length===0){f.innerHTML=`
      <div style="padding: 3rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;">
        <p style="margin-bottom: 0.75rem;">Bu sezon için bölüm verisi getirilemedi.</p>
        <button id="btn-retry-season-episodes" class="btn-secondary" style="padding: 0.45rem 1rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
          <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
          <span>Tekrar Dene</span>
        </button>
      </div>
    `,V(),r.querySelector("#btn-retry-season-episodes")?.addEventListener("click",()=>{ar(e,t,i,n,r,a,o,s,l,d,p,h)});return}const v=h?Jh(e):null,y=h?b.episodes.filter(m=>n<v.season||n===v.season&&Number(m.episode_number)<=v.episode+1):b.episodes;if(h&&y.length===0){f.innerHTML='<div class="spoiler-safe-locked"><i data-lucide="shield-check"></i><strong>Bu sezon spoiler korumasında</strong><span>Önceki sezona ilerledikçe bölüm detayları burada açılır.</span></div>',V();return}const k=h?`<div class="spoiler-safe-notice"><i data-lucide="shield-check"></i><span>Spoilersız keşif açık · S${v.season} B${v.episode+1} sonrasının detayları gizli.</span></div>`:"";f.innerHTML=k+y.map(m=>{const w=m.episode_number;let E=(m.name||"").trim();E=E.replace(new RegExp(`^(?:${w}\\s*[\\.\\:\\-]\\s*)+(?:Bölüm\\s*[\\:\\-]\\s*)?`,"i"),""),E=E.replace(new RegExp(`^Bölüm\\s*${w}\\s*[\\:\\-]\\s*`,"i"),""),E=E.trim();const C=E?`${w}. Bölüm: ${E}`:`${w}. Bölüm`;let S=m.overview?m.overview.trim():"";(!S||S.length<5)&&(i&&i.length>10?S=`${w}. Bölüm: ${i}`:S=`${t} ${n}. Sezon ${w}. Bölüm Türkçe Dublaj ve Altyazılı yüksek kalitede kesintisiz HD izle.`);const T=S.length>90,I=lt(m.still_path,et.STILL_MEDIUM),L=m.air_date||"",D=m.runtime?`${m.runtime} dk`:"",O=Xt(e,n,w),Y=O?O.progressPercent:0,j=O?O.completed||Y>=90:!1,z=O&&!j&&O.currentTime>0,B=Y>0?`
      <div class="card-progress-bar">
        <div class="card-progress-fill" style="width: ${Y}%; background: ${j?"var(--accent-green)":"#fbbf24"};"></div>
      </div>
    `:"";let W="";return j?W=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.5rem; left: 0.5rem; background: var(--accent-green); z-index: 4;">
          <i data-lucide="check" style="width:11px; height:11px"></i> İZLENDİ
        </span>
      `:z?W=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.5rem; left: 0.5rem; background: rgba(245, 158, 11, 0.95); color: #000; font-weight: 800; z-index: 4;">
          <i data-lucide="clock" style="width:11px; height:11px"></i> YARIDA
        </span>
      `:W=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.5rem; left: 0.5rem; background: var(--accent-green); display: none; z-index: 4;">
          <i data-lucide="check" style="width:11px; height:11px"></i> İZLENDİ
        </span>
      `,`
      <div class="episode-card" data-tv-id="${e}" data-season="${n}" data-episode="${w}" data-title="${C}">
        <div class="episode-thumb-wrap">
          <img src="${I}" alt="${C}" loading="lazy" onerror="this.onerror=null; this.src='${vn}';" />
          <span class="episode-number-chip">${n}x${w<10?"0"+w:w}</span>
          ${W}
          
          <div class="episode-play-overlay">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--primary-gradient); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.6);">
              <i data-lucide="play" style="width: 20px; height: 20px; fill: #fff; color: #fff; margin-left: 2px;"></i>
            </div>
          </div>

          <!-- Top Right Action Controls: Mark Watched & Halfway -->
          <div style="position: absolute; top: 0.5rem; right: 0.5rem; display: flex; gap: 0.35rem; z-index: 5;">
            <button class="btn-mark-ep-halfway" data-tv-id="${e}" data-season="${n}" data-episode="${w}" title="Yarıda Bırakıldı (20. dk)" style="width: 28px; height: 28px; border-radius: 50%; background: ${z?"#f59e0b":"rgba(0,0,0,0.65)"}; border: 1px solid ${z?"#f59e0b":"rgba(255,255,255,0.3)"}; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
              <i data-lucide="clock" style="width: 13px; height: 13px;"></i>
            </button>

            <button class="btn-mark-ep-watched ${j?"watched":""}" data-tv-id="${e}" data-season="${n}" data-episode="${w}" title="${j?"İzlendi işaretini kaldır":"İzlendi olarak işaretle"}" style="width: 28px; height: 28px; border-radius: 50%; background: ${j?"#10b981":"rgba(0,0,0,0.65)"}; border: 1px solid ${j?"#10b981":"rgba(255,255,255,0.3)"}; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
              <i data-lucide="check" style="width: 14px; height: 14px;"></i>
            </button>
          </div>

          ${B}
        </div>

        <div class="episode-info">
          <div class="episode-header-row">
            <span class="episode-title" title="${C}">${C}</span>
            <span class="episode-duration">${D||L}</span>
          </div>
          
          <div class="episode-overview-container">
            <div class="episode-overview ${T?"truncated":""}" data-full="${S}">
              ${S}
            </div>
            ${T?`
              <button class="btn-toggle-overview" style="color: var(--primary); font-weight: 700; font-size: 0.78rem; margin-top: 0.25rem; display: inline-flex; align-items: center; gap: 0.2rem; cursor: pointer; background: none; border: none; padding: 0;">
                <span>Devamını Oku</span>
                <i data-lucide="chevron-down" style="width: 12px; height: 12px;"></i>
              </button>
            `:""}
          </div>

          <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: auto; padding-top: 0.45rem; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06);">
            <span>${L}</span>
            <span class="btn-play-episode-trigger" style="color: var(--primary); font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.25rem;">
              <span>Oynat</span>
              <i data-lucide="play" style="width: 11px; height: 11px; fill: currentColor;"></i>
            </span>
          </div>
        </div>
      </div>
    `}).join(""),V(),r.querySelectorAll(".btn-toggle-overview").forEach(m=>{m.addEventListener("click",w=>{w.preventDefault(),w.stopPropagation();const E=m.closest(".episode-overview-container"),C=E?E.querySelector(".episode-overview"):null;if(!C)return;const S=m.querySelector("span"),T=m.querySelector("i");C.classList.contains("truncated")?(C.classList.remove("truncated"),S&&(S.textContent="Daralt"),T&&T.setAttribute("data-lucide","chevron-up")):(C.classList.add("truncated"),S&&(S.textContent="Devamını Oku"),T&&T.setAttribute("data-lucide","chevron-down")),V()})}),f.querySelectorAll(".btn-mark-ep-watched").forEach(m=>{m.addEventListener("click",w=>{w.preventDefault(),w.stopPropagation();const E=parseInt(m.getAttribute("data-season"),10),C=parseInt(m.getAttribute("data-episode"),10),S=m.closest(".episode-card"),I=Cl(e,E,C,{title:t,posterPath:a,backdropPath:o,type:p?"anime":"tv",isAnime:p}).completed;if(Z(I?`S${E} B${C} izlendi olarak işaretlendi!`:`S${E} B${C} izlendi işareti kaldırıldı.`,I?"success":"info"),I?(m.classList.add("watched"),m.style.background="#10b981",m.style.borderColor="#10b981",m.title="İzlendi işaretini kaldır"):(m.classList.remove("watched"),m.style.background="rgba(0,0,0,0.65)",m.style.borderColor="rgba(255,255,255,0.3)",m.title="İzlendi olarak işaretle"),S){const L=S.querySelector(".badge-watched-status");L&&(L.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',L.style.background="var(--accent-green)",L.style.color="#fff",L.style.display=I?"inline-flex":"none")}typeof d=="function"&&d(),V()})}),f.querySelectorAll(".btn-mark-ep-halfway").forEach(m=>{m.addEventListener("click",w=>{w.preventDefault(),w.stopPropagation();const E=parseInt(m.getAttribute("data-season"),10),C=parseInt(m.getAttribute("data-episode"),10),S=m.closest(".episode-card");if(Na(e,E,C,1200,{title:t,posterPath:a,backdropPath:o,type:p?"anime":"tv",isAnime:p,duration:2700}),m.style.background="#f59e0b",m.style.borderColor="#f59e0b",S){const T=S.querySelector(".badge-watched-status");T&&(T.innerHTML='<i data-lucide="clock" style="width:12px; height:12px"></i> YARIDA (20:00)',T.style.background="rgba(245, 158, 11, 0.9)",T.style.color="#000",T.style.display="inline-flex")}Z(`S${E} B${C} 20. dakikada yarıda bırakıldı olarak işaretlendi!`,"info"),V()})}),f.querySelectorAll(".episode-card").forEach(m=>{const w=S=>{if(S&&S.target&&(S.target.closest(".btn-mark-ep-watched")||S.target.closest(".btn-mark-ep-halfway")||S.target.closest(".btn-toggle-overview")))return;S&&(S.preventDefault(),S.stopPropagation());const T=parseInt(m.getAttribute("data-season"),10),I=parseInt(m.getAttribute("data-episode"),10),L=m.getAttribute("data-title"),D=Xt(e,T,I),O=D?D.currentTime:0;Qt({type:p?"anime":"tv",isAnime:p,tmdbId:e,title:`${t} - S${T}E${I}: ${L}`,seriesTitle:t,originalTitle:s||t,season:T,episode:I,posterPath:a,backdropPath:o,currentTime:O,seasonsList:l,maxEpisodes:b.episodes?b.episodes.length:0})};m.addEventListener("click",w);const E=m.querySelector(".episode-thumb-wrap");E&&E.addEventListener("click",w);const C=m.querySelector(".btn-play-episode-trigger");C&&C.addEventListener("click",w)})}let sr=null;async function Xh(e,t="",i=""){xi();const n=document.createElement("div");n.id="cast-explorer-modal-root",n.className="cast-explorer-backdrop",document.body.appendChild(n),sr=n,n.innerHTML=`
    <div class="cast-explorer-dialog">
      <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
      </button>
      <div class="cast-explorer-loading">
        <div class="cast-explorer-spinner"></div>
        <span>${t||"Oyuncu"} bilgileri ve filmografisi yükleniyor...</span>
      </div>
    </div>
  `,V(n);const r=n.querySelector("#btn-close-cast-explorer");r&&(r.onclick=()=>xi()),n.onclick=I=>{I.target===n&&xi()};const a=I=>{I.key==="Escape"&&(xi(),window.removeEventListener("keydown",a))};window.addEventListener("keydown",a);const o=await Qd(e);if(!o){n.innerHTML=`
      <div class="cast-explorer-dialog">
        <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
          <i data-lucide="x" style="width: 20px; height: 20px;"></i>
        </button>
        <div class="cast-explorer-loading">
          <i data-lucide="alert-circle" style="width: 36px; height: 36px; color: #ef4444;"></i>
          <span>Oyuncu bilgileri alınamadı.</span>
        </div>
      </div>
    `,V(n);return}const s=o.name||t,l=o.profile_path?lt(o.profile_path,et.POSTER_MEDIUM):i||ur,d=o.birthday?o.birthday.substring(0,4):"",p=o.place_of_birth||"",h=o.known_for_department==="Acting"?"Oyuncu":o.known_for_department==="Directing"?"Yönetmen":o.known_for_department||"Sanatçı",f=o.biography&&o.biography.trim().length>20?o.biography:`${s}, sinema ve televizyon dünyasında yer aldığı yapımlarla tanınan başarılı bir sanatçıdır.`,b=o.combined_credits?.cast||[],v=o.combined_credits?.crew||[],y=[...b,...v],k=new Set,m=[];for(const I of y){if(!I||!I.id)continue;const L=`${I.media_type||"movie"}_${I.id}`;k.has(L)||(k.add(L),I.poster_path&&m.push(I))}m.sort((I,L)=>(L.popularity||0)-(I.popularity||0));const w=m.filter(I=>I.media_type==="movie"||!I.media_type&&I.title).length,E=m.filter(I=>I.media_type==="tv"||!I.media_type&&I.name).length;n.innerHTML=`
    <div class="cast-explorer-dialog">
      <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
      </button>

      <!-- Actor Hero Header -->
      <div class="cast-explorer-header">
        <div class="cast-explorer-avatar-box">
          <img src="${l}" alt="${s}" class="cast-explorer-avatar" onerror="this.onerror=null; this.src='${ur}';" />
        </div>
        <div class="cast-explorer-bio-box">
          <div class="cast-explorer-name-row">
            <h2>${s}</h2>
            <span class="cast-explorer-dept-tag">${h}</span>
          </div>
          <div class="cast-explorer-meta-row">
            ${d?`<span><i data-lucide="calendar" style="width:13px;height:13px;"></i> D: ${d}</span>`:""}
            ${p?`<span><i data-lucide="map-pin" style="width:13px;height:13px;"></i> ${p}</span>`:""}
            <span><i data-lucide="film" style="width:13px;height:13px;"></i> ${m.length} Yapım</span>
          </div>
          <p class="cast-explorer-bio-text">${f}</p>
        </div>
      </div>

      <!-- Filmography Tabs -->
      <div class="cast-explorer-tabs">
        <button class="cast-tab-btn active" data-filter="all">Tümü (${m.length})</button>
        <button class="cast-tab-btn" data-filter="movie">Filmler (${w})</button>
        <button class="cast-tab-btn" data-filter="tv">Diziler (${E})</button>
      </div>

      <!-- Media Cards Grid -->
      <div class="cast-explorer-grid" id="cast-explorer-grid">
        ${m.map(I=>xt(I)).join("")}
      </div>
    </div>
  `,V(n);const C=n.querySelector("#btn-close-cast-explorer");C&&(C.onclick=()=>xi());const S=n.querySelector("#cast-explorer-grid");S&&(mt(S),S.addEventListener("click",()=>{setTimeout(()=>xi(),150)}));const T=n.querySelectorAll(".cast-tab-btn");T.forEach(I=>{I.onclick=()=>{T.forEach(O=>O.classList.remove("active")),I.classList.add("active");const L=I.getAttribute("data-filter");let D=m;L==="movie"?D=m.filter(O=>O.media_type==="movie"||!O.media_type&&O.title):L==="tv"&&(D=m.filter(O=>O.media_type==="tv"||!O.media_type&&O.name)),S&&(S.innerHTML=D.length>0?D.map(O=>xt(O)).join(""):'<div class="cast-empty-state">Bu kategoride yapım bulunamadı.</div>',V(S))}})}function xi(){if(sr){try{sr.remove()}catch{}sr=null}}const Zh="https://api.tvmaze.com",Qh=5500,Fc=30*60*1e3,Uc="cinepulse_tvmaze_cache_v1",_n=new Map;function ef(){try{const e=sessionStorage.getItem(Uc);if(!e)return;const t=JSON.parse(e);t&&typeof t=="object"&&Object.entries(t).forEach(([i,n])=>{n?.savedAt&&Date.now()-n.savedAt<Fc&&_n.set(i,n)})}catch{}}function tf(){try{const e={};let t=0;for(const[i,n]of _n.entries()){if(t++>=80)break;e[i]=n}sessionStorage.setItem(Uc,JSON.stringify(e))}catch{}}function Ds(e){const t=_n.get(e);if(t){if(Date.now()-t.savedAt>Fc){_n.delete(e);return}return t.data}}function zs(e,t){_n.set(e,{savedAt:Date.now(),data:t}),tf()}async function Cr(e){try{const t=await fetch(`${Zh}${e}`,{headers:{Accept:"application/json"},signal:AbortSignal.timeout(Qh)});return t.ok?await t.json():null}catch{return null}}function il(e){return String(e||"").toLowerCase().replace(/[^a-z0-9çğıöşü ]/gi," ").replace(/\s+/g," ").trim()}function jc(e,t){const i=il(e),n=il(t);return!i||!n?!1:i===n?!0:i.includes(n)||n.includes(i)}function nl(e){return e?{season:e.season??null,number:e.number??null,name:e.name||"",airdate:e.airdate||"",airstamp:e.airstamp||"",runtime:e.runtime||null}:null}function nf(e){switch(e){case"Running":return"Devam ediyor";case"Ended":return"Sonlandı";case"To Be Determined":return"Belirsiz";case"In Development":return"Yapım aşamasında";default:return e||""}}async function rf(e){const t=`lookup:${e}`,i=Ds(t);if(i!==void 0)return i;const n=await Cr(`/lookup/shows?${e}`);return zs(t,n||null),n||null}async function Kc(e){if(!e)return null;const t=`show:${e}`,i=Ds(t);if(i!==void 0)return i;const n=await Cr(`/shows/${e}?embed[]=nextepisode&embed[]=previousepisode`),r=n?{tvmazeId:n.id,name:n.name||"",status:n.status||"",statusLabel:nf(n.status),premiered:n.premiered||"",officialSite:n.officialSite||"",thetvdbId:n.externals?.thetvdb??null,imdbId:n.externals?.imdb||"",nextEpisode:nl(n._embedded?.nextepisode),previousEpisode:nl(n._embedded?.previousepisode)}:null;return zs(t,r),r}async function af(e){const t=String(e||"").trim();if(!t)return null;const i=t.startsWith("tt")?t:`tt${t}`,r=(await rf(`imdb=${encodeURIComponent(i)}`))?.id||null;return r?Kc(r):null}function Wc(e,t){const i=parseInt(String(e?.premiered||"").substring(0,4),10),n=parseInt(String(t||""),10);return!n||!i?0:Math.abs(i-n)}function sf(e,t,i){let n=null,r=1/0;for(const a of e){if(!a||!jc(a.name,t))continue;const o=Wc(a,i);if(o>1)continue;const s=o*10+(a.status==="Running"?0:1);s<r&&(r=s,n=a)}return n}async function of(e,t){const i=String(e||"").trim();if(i.length<2)return null;const n=`search:${i}:${t||""}`,r=Ds(n);if(r!==void 0)return r;let a=null;const o=await Cr(`/singlesearch/shows?q=${encodeURIComponent(i)}`);if(o&&jc(o.name,i)&&Wc(o,t)<=1&&(a=o),!a){const l=await Cr(`/search/shows?q=${encodeURIComponent(i)}`),d=Array.isArray(l)?l.map(p=>p?.show).filter(Boolean):[];a=sf(d,i,t)}const s=a?await Kc(a.id):null;return zs(n,s),s}async function lf({imdbId:e,title:t,year:i}={}){let n=await af(e);if(n||(n=await of(t,i)),!n)return null;const r=n.nextEpisode;return{showName:n.name,statusLabel:n.statusLabel,officialSite:n.officialSite,nextEpisode:r,previousEpisode:n.previousEpisode,nextLabel:r?cf(r):"",nextAirdateLabel:r?uf(r.airdate,r.airstamp):""}}function cf(e){if(!e)return"";const t=e.season!==null&&e.season!==void 0,i=e.number!==null&&e.number!==void 0,n=t&&e.season>=1900;return t&&!n&&i?`S${e.season} B${e.number}`:n&&e.name?e.name:i?`B${e.number}`:e.name||""}const df=["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];function uf(e,t){const i=t?new Date(t):e?new Date(`${e}T21:00:00`):null;if(!i||Number.isNaN(i.getTime()))return e||"";const n=new Date,r=s=>new Date(s.getFullYear(),s.getMonth(),s.getDate()).getTime(),a=Math.round((r(i)-r(n))/864e5),o=t?`${String(i.getHours()).padStart(2,"0")}:${String(i.getMinutes()).padStart(2,"0")}`:"";return a<0?"Yayınlandı":a===0?o?`Bugün ${o}`:"Bugün":a===1?o?`Yarın ${o}`:"Yarın":a<=7?`${a} gün sonra`:`${i.getDate()} ${df[i.getMonth()]}`}ef();const rl="cinepulse.decision-room.autoplay";function pf(e,t){try{const i=JSON.parse(sessionStorage.getItem(rl)||"null");return sessionStorage.removeItem(rl),i&&String(i.id)===String(t)&&i.type===e&&Date.now()-Number(i.createdAt||0)<15e3?i:null}catch{return null}}function hf(e){if(!e||e<=0)return"";const t=Math.floor(e/60),i=e%60;return t>0?`${t} sa ${i>0?i+" dk":""} (${e} dk)`:`${e} dk`}async function ff(e="tv",t){const i=typeof e=="object"&&e!==null?e.type||"tv":e||"tv",n=typeof e=="object"&&e!==null?e.id:t;let r=i==="series"||i==="tv"||i==="anime"?"tv":i==="movie"?"movie":"tv",a=await lo(r,n);if(a||(r=r==="tv"?"movie":"tv",a=await lo(r,n)),!a)return{html:'<div class="container" style="padding: 10rem 0; text-align: center;"><h2>İçerik bulunamadı.</h2></div>',init:()=>{}};const o=!!(a.seasons&&a.seasons.length>0)||r==="tv",s=o?"tv":"movie",l=Ps(a)||i==="anime"||r==="anime"||Fe(n);l&&Se(n);const d=a.title||a.name||"Detay",p=a.original_title||a.original_name||"",h=lt(a.backdrop_path,et.BACKDROP_ORIGINAL),f=lt(a.poster_path,et.POSTER_MEDIUM),b=a.vote_average?a.vote_average.toFixed(1):"8.5",v=(a.first_air_date||a.release_date||"").substring(0,4),y=a.overview&&a.overview.trim().length>15?a.overview:qe(a,s),k=a.genres||[],m=a.runtime?a.runtime*60:6600,w=Id(n),E=gs(n),C=s==="tv"?oa(n):null,S=s==="movie"?Xt(n,1,1):null,T=s==="movie"?yn(n,1,1):!1,I=s==="tv"?aa(n,a.seasons||[]):!1,L=s==="movie"?T:I;let D=s==="movie"?"Filmi İzle":"1. Sezon 1. Bölümü İzle";if(s==="tv"&&C){const G=li(C.currentTime);D=`Devam Et <span class="play-btn-subinfo">S${C.season} B${C.episode}${G?" • "+G:""}</span>`}else s==="movie"&&S&&S.currentTime>0&&(D=`Devam Et <span class="play-btn-subinfo">${li(S.currentTime)}</span>`);const O=a.credits?.crew?a.credits.crew.filter(G=>G.job==="Director").map(G=>G.name):[],Y=a.created_by?a.created_by.map(G=>G.name):[],j=O.length>0?O.slice(0,2).join(", "):Y.length>0?Y.slice(0,2).join(", "):"",z=(parseFloat(b)/2).toFixed(1),B=Math.floor(z),W=z%1>=.4,ie="★".repeat(Math.min(5,B))+(W&&B<5?"½":""),te=a.credits&&a.credits.cast?a.credits.cast.slice(0,10):[];let re=null,N=!1;s==="tv"&&a.seasons&&(re=await Gh({tvId:n,seriesTitle:d,originalTitle:p,seriesOverview:y,seasons:a.seasons,posterPath:a.poster_path,backdropPath:a.backdrop_path,isAnime:l,spoilerFree:N}));const ae=a.recommendations?a.recommendations.results.slice(0,6):[],J=s==="movie"?T?"Film İzlendi":"İzlendi Olarak İşaretle":I?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle",K=a.runtime?`
    <span class="badge" style="background: rgba(245, 158, 11, 0.18); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); font-weight: 700; display: inline-flex; align-items: center; gap: 0.35rem;">
      <i data-lucide="clock" style="width:13px; height:13px"></i>
      <span>${hf(a.runtime)}</span>
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
              <img class="detail-poster-img" src="${f}" alt="${d}" onerror="this.onerror=null; this.src='${vn}';" />
            </div>

            <!-- Content Details -->
            <div class="detail-info-col">
              <!-- Frosted Badges Row -->
              <div class="detail-badge-deck">
                <span class="badge badge-type">${l?o?"ANİME DİZİSİ":"ANİME FİLMİ":s==="tv"?"DİZİ":"FİLM"}</span>
                <span class="badge badge-imdb">
                  <i data-lucide="star" style="width:13px; height:13px; fill: currentColor"></i> ${b} IMDb
                </span>
                <span class="badge badge-letterboxd" title="Letterboxd Derecelendirmesi">
                  <span style="letter-spacing: 0.05em; font-weight: 800;">${ie}</span> ${z}
                </span>
                <span class="badge">${v}</span>
                ${K}
                ${a.number_of_seasons?`<span class="badge">${a.number_of_seasons} Sezon</span>`:""}
                ${a.number_of_episodes?`<span class="badge">${a.number_of_episodes} Bölüm</span>`:""}
                ${s==="tv"?'<span class="badge" id="detail-next-episode-badge" style="display: none; background: rgba(34, 197, 94, 0.16); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.4); font-weight: 700; align-items: center; gap: 0.35rem;"></span>':""}
                ${!a.runtime&&a.episode_run_time&&a.episode_run_time.length>0?`<span class="badge">${a.episode_run_time[0]} dk / bölüm</span>`:""}
              </div>

              <!-- Main Title -->
              <h1 class="detail-heading-title">${d}</h1>

              <!-- Editorial Subtitle (Original Title & Director / Creator) -->
              <div class="detail-editorial-sub">
                ${p&&p!==d?`<span class="detail-orig-name">${p}</span>`:""}
                ${j?`
                  <span class="detail-director-pill">
                    <strong style="color: var(--primary);">${s==="tv"?"YARATICI":"YÖNETMEN"}:</strong> ${j}
                  </span>
                `:""}
              </div>

              <!-- Genres -->
              <div class="detail-genre-row">
                ${k.map(G=>`<span class="detail-genre-chip">${G.name}</span>`).join("")}
              </div>

              <!-- Storyline -->
              <div class="detail-storyline-wrapper">
                <p class="detail-storyline truncated" id="detail-storyline-text">${y}</p>
                ${y.length>120?'<button class="btn-storyline-expand" id="btn-expand-storyline"><span>Devamını Oku</span><i data-lucide="chevron-down" style="width:14px;height:14px"></i></button>':""}
              </div>

              ${s==="tv"?'<label class="spoiler-discovery-toggle"><input id="detail-spoiler-free-toggle" type="checkbox" /><span><i data-lucide="shield-check"></i><b>Spoilersız keşfet</b><small>İzleme ilerlemenin sonrasındaki bölüm başlıkları, görselleri ve özetleri gizlenir.</small></span></label>':""}

              <!-- Oyuncular & Sanatçılar (Letterboxd & Pentagram Style Carousel with PC Mouse Scroll & Nav Buttons) -->
              ${te.length>0?`
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
                    ${te.map(G=>{const $=G.profile_path?lt(G.profile_path,et.POSTER_SMALL):ur,M=G.character?G.character.split("/")[0].trim():"";return`
                        <div class="detail-actor-pill" data-person-id="${G.id}" data-person-name="${G.name}" title="${G.name}${M?" ("+M+")":""} • Filmografiyi Gör" style="cursor: pointer;">
                          <img src="${$}" alt="${G.name}" class="detail-actor-avatar" onerror="this.onerror=null; this.src='${ur}';" />
                          <div style="display: flex; flex-direction: column; min-width: 0;">
                            <span class="detail-actor-name">${G.name}</span>
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
                      <span>${D}</span>
                    </button>
                  `:`
                    <button class="btn-play-primary" id="btn-resume-series">
                      <i data-lucide="play" style="fill: currentColor; width: 20px; height: 20px;"></i>
                      <span>${D}</span>
                    </button>
                  `}

                  <button class="btn-detail-trailer" id="btn-watch-trailer">
                    <i data-lucide="youtube" style="width: 18px; height: 18px;"></i>
                    <span>Fragman İzle</span>
                  </button>
                </div>

                <!-- Compact Quick Action Tiles Grid -->
                <div class="detail-action-subgrid">
                  <button class="btn-action-tile ${w?"active-fav":""}" id="btn-toggle-fav">
                    <i data-lucide="heart" style="${w?"fill: var(--primary); color: var(--primary)":""}"></i>
                    <span>${w?"Favorilerimde":"Favori"}</span>
                  </button>

                  <button class="btn-action-tile ${E?"active-watch":""}" id="btn-toggle-watchlist">
                    <i data-lucide="${E?"check":"plus"}"></i>
                    <span>${E?"Listemde":"Listem"}</span>
                  </button>

                  <button class="btn-action-tile ${L?"active-watched":""}" id="btn-toggle-watched-detail">
                    <i data-lucide="${L?"check-circle-2":"check"}"></i>
                    <span>${J}</span>
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
          ${s==="tv"&&re?re.html:""}

          ${ae.length>0?`
            <div style="margin-top: 4rem;">
              <h2 class="section-title" style="margin-bottom: 1.5rem;">
                <i data-lucide="thumbs-up"></i> Benzer Önerilen Yapımlar
              </h2>
              <div class="media-grid">
                ${ae.map(G=>xt(G)).join("")}
              </div>
            </div>
          `:""}
        </div>
      </section>
    </div>
  `,init:G=>{if(!G)return;let $=pf(s,n);const M=G.querySelector("#btn-detail-back");M&&M.addEventListener("click",oe=>{oe.preventDefault(),window.history.length>1?window.history.back():window.location.hash="#home"}),re&&re.init(G);const H=G.querySelector("#detail-spoiler-free-toggle");H&&(H.checked=N,H.addEventListener("change",()=>{N=H.checked,re?.setSpoilerSafe(N),Z(N?"Spoilersız keşif açıldı. Sonraki bölüm detayları gizlendi.":"Spoilersız keşif kapatıldı.","info")}));const Q=G.querySelector("#btn-play-movie"),se=async()=>{if(!Q||Q.disabled)return;Q.disabled=!0;const oe=Q.innerHTML;Q.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px;fill:currentColor"></i> <span>Yükleniyor...</span>',V();try{const g=Xt(n,1,1);await Qt({type:l?"anime":"movie",isAnime:l,tmdbId:n,title:d,seriesTitle:d,originalTitle:p,posterPath:a.poster_path,backdropPath:a.backdrop_path,duration:m,currentTime:g?g.currentTime:0,roomSync:$?{roomCode:$.roomCode,mediaId:n,type:s,season:1,episode:1,initialSync:$.initialSync||null}:null})}catch{Z("Film açılırken hata oluştu, lütfen tekrar deneyin.","error")}finally{Q.disabled=!1,Q.innerHTML=oe,V()}};Q&&Q.addEventListener("click",se);const x=G.querySelector("#btn-resume-series"),A=async()=>{if(!x||x.disabled)return;x.disabled=!0;const oe=x.innerHTML;x.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px;fill:currentColor"></i> <span>Yükleniyor...</span>',V();try{const g=$;$=null;const c=oa(n),u=g?.season||(c?c.season:1),_=g?.episode||(c?c.episode:1),R=g?0:c?c.currentTime:0;await Qt({type:l?"anime":"tv",isAnime:l,tmdbId:n,title:`${d} - S${u}E${_}`,seriesTitle:d,originalTitle:p,season:u,episode:_,posterPath:a.poster_path,backdropPath:a.backdrop_path,currentTime:R,seasonsList:a.seasons||[],roomSync:g?{roomCode:g.roomCode,mediaId:n,type:s,season:u,episode:_,initialSync:g.initialSync||null}:null})}catch{Z("İçerik açılırken hata oluştu, lütfen tekrar deneyin.","error")}finally{x.disabled=!1,x.innerHTML=oe,V()}};x&&x.addEventListener("click",oe=>{oe.preventDefault(),A()}),$&&window.setTimeout(()=>{s==="movie"?se():A()},0);const q=G.querySelector("#btn-watch-trailer");q&&q.addEventListener("click",async()=>{q.disabled=!0;const oe=q.innerHTML;q.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px"></i> <span>Yükleniyor...</span>',V();try{const g=await bn(s,n,d);g?Dc({title:d,trailerInfo:g,mediaId:n,mediaType:l?"anime":s}):Z("Bu yapım için resmi fragman bulunamadı.","info")}catch{Z("Fragman yüklenirken bir hata oluştu.","error")}finally{q.disabled=!1,q.innerHTML=oe,V()}});const ee=G.querySelector("#btn-toggle-fav");ee&&ee.addEventListener("click",()=>{const oe=Rd({...a,type:l?"anime":s,isAnime:l,media_type:s});Z(oe?"Favorilere eklendi!":"Favorilerden çıkarıldı.",oe?"success":"info");const g=ee.querySelector("i"),c=ee.querySelector("span");g&&c&&(g.style.fill=oe?"var(--primary)":"none",g.style.color=oe?"var(--primary)":"currentColor",c.textContent=oe?"Favorilerimde":"Favorilere Ekle")});const ke=G.querySelector("#btn-toggle-watchlist");ke&&ke.addEventListener("click",()=>{const oe=Il({...a,type:l?"anime":s,isAnime:l,media_type:s});Z(oe?"İzleme listesine eklendi!":"İzleme listesinden çıkarıldı.",oe?"success":"info");const g=ke.querySelector("i"),c=ke.querySelector("span");g&&c&&(g.setAttribute("data-lucide",oe?"check":"plus"),V(),c.textContent=oe?"Listemde":"İzleme Listeme Ekle")});const le=G.querySelector("#btn-toggle-watched-detail");le&&le.addEventListener("click",oe=>{if(oe.preventDefault(),s==="movie"){const c=Cl(n,1,1,{title:d,posterPath:a.poster_path,backdropPath:a.backdrop_path,type:"movie",duration:m}).completed;Z(c?"✓ Film izlendi olarak işaretlendi!":"Film izlendi işareti kaldırıldı.",c?"success":"info"),c?le.classList.add("btn-watched-active"):le.classList.remove("btn-watched-active"),le.innerHTML=`
              <i data-lucide="${c?"check-circle-2":"check"}"></i>
              <span>${c?"Film İzlendi":"İzlendi Olarak İşaretle"}</span>
            `,V()}else{const c=!aa(n,a.seasons||[]);Ad(n,a.seasons||[],c,{title:d,posterPath:a.poster_path,backdropPath:a.backdrop_path,type:l?"anime":"tv",isAnime:l}),Z(c?"✓ Dizinin tüm bölümleri izlendi olarak işaretlendi!":"Tüm bölümler izlenmedi yapıldı.",c?"success":"info"),c?le.classList.add("btn-watched-active"):le.classList.remove("btn-watched-active"),le.innerHTML=`
              <i data-lucide="${c?"check-circle-2":"check"}"></i>
              <span>${c?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle"}</span>
            `,V(),G.querySelectorAll(".episode-card").forEach(_=>{const R=_.querySelector(".badge-watched-status"),P=_.querySelector(".btn-mark-ep-watched");R&&(R.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',R.style.background="var(--accent-green)",R.style.color="#fff",R.style.display=c?"inline-flex":"none"),P&&(c?(P.classList.add("watched"),P.style.background="#10b981",P.style.borderColor="#10b981"):(P.classList.remove("watched"),P.style.background="rgba(0,0,0,0.65)",P.style.borderColor="rgba(255,255,255,0.3)"))});const u=G.querySelector("#btn-mark-season-all");if(u){const _=u.querySelector("span"),R=u.querySelector("i");_&&(_.textContent=c?"Bu Sezon İzlendi":"Bu Sezonu İzlendi İşaretle"),R&&R.setAttribute("data-lucide",c?"check-circle-2":"check-check"),c?(u.style.background="rgba(16, 185, 129, 0.2)",u.style.borderColor="#10b981",u.style.color="#10b981"):(u.style.background="",u.style.borderColor="",u.style.color="")}V()}});const fe=oe=>{if(oe&&oe.detail&&oe.detail.isProgressUpdate&&document.getElementById("player-modal"))return;const g=s==="movie"?yn(n,1,1):!1,c=s==="tv"?aa(n,a.seasons||[]):!1,u=s==="movie"?g:c;if(le){u?le.classList.add("btn-watched-active"):le.classList.remove("btn-watched-active");const P=s==="movie"?u?"Film İzlendi":"İzlendi Olarak İşaretle":u?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle";le.innerHTML=`
            <i data-lucide="${u?"check-circle-2":"check"}"></i>
            <span>${P}</span>
          `}const _=G.querySelector("#btn-play-movie");if(_&&s==="movie"){const P=Xt(n,1,1);if(P&&P.currentTime>0&&!P.completed){const F=li(P.currentTime);_.innerHTML=`<i data-lucide="play" style="fill:currentColor"></i> <span>Devam Et <span class="play-btn-subinfo">${F}</span></span>`}}const R=G.querySelector("#btn-resume-series");if(R&&s==="tv"){const P=oa(n);if(P){const F=li(P.currentTime);R.innerHTML=`<i data-lucide="play" style="fill:currentColor"></i> <span>Devam Et <span class="play-btn-subinfo">S${P.season} B${P.episode}${F?" • "+F:""}</span></span>`}}V()};window.addEventListener("sineflix_data_changed",fe);const Xe=G.querySelector("#btn-mark-halfway-detail");Xe&&Xe.addEventListener("click",oe=>{if(oe.preventDefault(),s==="movie"){const g=Math.round(m*.5),c=li(g);Na(n,1,1,g,{title:d,posterPath:a.poster_path,backdropPath:a.backdrop_path,type:l?"anime":"movie",isAnime:l,duration:m}),Z(`⏳ Film ${c} dakikasında yarıda bırakıldı olarak işaretlendi!`,"info");const u=G.querySelector("#btn-play-movie span");u&&(u.textContent=`Kaldığın Yerden Devam Et (${c})`)}else{const g=C?C.season:1,c=C?C.episode:1;Na(n,g,c,1200,{title:d,posterPath:a.poster_path,backdropPath:a.backdrop_path,type:l?"anime":"tv",isAnime:l,duration:3e3}),Z(`⏳ S${g} B${c} 20. dakikada yarıda bırakıldı olarak işaretlendi!`,"info");const u=G.querySelector("#btn-resume-series span");u&&(u.textContent=`Kaldığın Yerden Devam Et (S${g} B${c} • 20:00)`)}});const Ze=G.querySelector("#btn-expand-storyline"),Ue=G.querySelector("#detail-storyline-text");Ze&&Ue&&Ze.addEventListener("click",()=>{const oe=!Ue.classList.contains("truncated");Ue.classList.toggle("truncated");const g=Ze.querySelector("span"),c=Ze.querySelector("i");g&&(g.textContent=oe?"Devamını Oku":"Daralt"),c&&(c.style.transform=oe?"rotate(0deg)":"rotate(180deg)")});const Re=G.querySelector("#detail-cast-rail"),De=G.querySelector("#btn-cast-prev"),Ne=G.querySelector("#btn-cast-next");if(Re){De&&De.addEventListener("click",_=>{_.preventDefault(),Re.scrollBy({left:-280,behavior:"smooth"})}),Ne&&Ne.addEventListener("click",_=>{_.preventDefault(),Re.scrollBy({left:280,behavior:"smooth"})}),Re.addEventListener("wheel",_=>{_.deltaY!==0&&(_.preventDefault(),Re.scrollLeft+=_.deltaY)},{passive:!1});let oe=!1,g=0,c=0;Re.addEventListener("mousedown",_=>{oe=!0,Re.classList.add("dragging"),g=_.pageX-Re.offsetLeft,c=Re.scrollLeft});const u=()=>{oe=!1,Re.classList.remove("dragging")};Re.addEventListener("mouseleave",u),Re.addEventListener("mouseup",u),Re.addEventListener("mousemove",_=>{if(!oe)return;_.preventDefault();const P=(_.pageX-Re.offsetLeft-g)*1.5;Re.scrollLeft=c-P}),Re.querySelectorAll(".detail-actor-pill").forEach(_=>{_.addEventListener("click",R=>{R.preventDefault();const P=_.getAttribute("data-person-id"),F=_.getAttribute("data-person-name");P&&Xh(P,F)})})}const Ye=G.querySelector("#detail-next-episode-badge");Ye&&s==="tv"&&(async()=>{try{const oe=await lf({imdbId:a.external_ids?.imdb_id,title:p||d,year:v});if(!oe?.nextEpisode||!Ye.isConnected)return;const g=oe.nextLabel||"",c=oe.nextAirdateLabel||"";if(!g&&!c||c==="Yayınlandı")return;const u=[g?`Yeni bölüm ${g}`:"Yeni bölüm",c].filter(Boolean).join(" • ");Ye.innerHTML=`<i data-lucide="calendar-clock" style="width:13px; height:13px"></i><span>${u}</span>`,Ye.title=`Sonraki bölüm: ${g||"-"}${oe.nextEpisode.name?" — "+oe.nextEpisode.name:""}${c?" • "+c:""} (Kaynak: TVmaze)`,Ye.style.display="inline-flex",V(Ye)}catch{}})();const je=G.querySelector(".media-grid");je&&mt(je)}}}const mf="cinepulse_offline_db",gf=1,rt="downloads",hn="cinepulse-offline-media-v1";let qn=null,fn=[];function Yc(e){return Fi().then(t=>new Promise((i,n)=>{const r=t.transaction(rt,"readonly").objectStore(rt).get(e);r.onsuccess=()=>i(r.result||null),r.onerror=()=>n(r.error)}))}function Os(e,t){return new Request(new URL(`/__cinepulse_offline__/${encodeURIComponent(e)}/${t}`,location.origin))}function as(e,t){return new URL(e,t).href}async function yf(e,t,i,n,r,a){const o=await fetch(n,{cache:"no-store"});if(!o.ok)throw new Error(`Bölüm parçası indirilemedi (HTTP ${o.status})`);const s=await o.blob();return await e.put(Os(t,i),new Response(s,{headers:{"Content-Type":o.headers.get("content-type")||"application/octet-stream"}})),a.loaded+=s.size,a.done+=1,r({percent:Math.min(98,8+Math.round(a.done/a.count*90)),loaded:a.loaded,total:0,status:`%${Math.min(98,8+Math.round(a.done/a.count*90))} · ${a.done}/${a.count} parça`}),s.size}function al(e,t){const i=e.split(/\r?\n/),n=[];for(let r=0;r<i.length;r+=1){if(!i[r].startsWith("#EXT-X-STREAM-INF:"))continue;const a=Number(i[r].match(/(?:AVERAGE-)?BANDWIDTH=(\d+)/)?.[1])||0,o=i.slice(r+1).find(s=>s&&!s.startsWith("#"));o&&n.push({bandwidth:a,url:as(o.trim(),t)})}return n.sort((r,a)=>a.bandwidth-r.bandwidth)[0]?.url||null}async function vf(e,t,i,n,r){let a=i.url||i.url,o=n,s=al(o,a);if(s){const y=await fetch(s,{cache:"no-store"});if(!y.ok)throw new Error(`Bölüm listesi alınamadı (HTTP ${y.status})`);if(a=y.url||s,o=await y.text(),al(o,a))throw new Error("Bu yayın çok katmanlı HLS listesi kullanıyor; farklı bir kaynak seçin.")}if(!o.includes("#EXT-X-ENDLIST"))throw new Error("Bu yayın tamamlanmış bölüm değil; çevrimdışı indirme desteklenmiyor.");if(o.includes("#EXT-X-BYTERANGE"))throw new Error("Bu kaynak parçalı byte aralığı kullanıyor; başka bir yayın hattı seçin.");const l=o.split(/\r?\n/),d=l.filter(y=>y&&!y.startsWith("#")).length+(o.match(/#EXT-X-(?:KEY|MAP):[^\n]*URI="[^"]+"/g)||[]).length;if(!d)throw new Error("Bu bölümde indirilebilir video parçası bulunamadı.");const p={done:0,count:d,loaded:0},h=[];let f=0;const b=async y=>{const k=f++;return await yf(e,t,k,y,r,p),h.push(k),`__CP_OFFLINE_RESOURCE_${k}__`},v=[];for(const y of l){if(!y){v.push(y);continue}if(y.startsWith("#EXT-X-BYTERANGE"))throw new Error("Bu kaynak parçalı byte aralığı kullanıyor; başka bir yayın hattı seçin.");if(y.startsWith("#EXT-X-KEY:")||y.startsWith("#EXT-X-MAP:")){const k=y.match(/URI="([^"]+)"/);if(k){const m=await b(as(k[1],a));v.push(y.replace(k[0],`URI="${m}"`))}else v.push(y);continue}y.startsWith("#")?v.push(y):v.push(await b(as(y.trim(),a)))}return{playlistTemplate:v.join(`
`),resourceKeys:h,sizeBytes:p.loaded}}function Fi(){return qn?Promise.resolve(qn):new Promise((e,t)=>{const i=indexedDB.open(mf,gf);i.onupgradeneeded=n=>{const r=n.target.result;if(!r.objectStoreNames.contains(rt)){const a=r.createObjectStore(rt,{keyPath:"key"});a.createIndex("tmdbId","tmdbId",{unique:!1}),a.createIndex("downloadedAt","downloadedAt",{unique:!1})}},i.onsuccess=()=>{qn=i.result,e(qn)},i.onerror=()=>t(i.error)})}function Vr(e,t=null,i=null){return t!==null&&i!==null&&t!==void 0&&i!==void 0?`${e}_s${t}_e${i}`:String(e)}async function Vc(){try{const e=await Fi();return new Promise((t,i)=>{const a=e.transaction(rt,"readonly").objectStore(rt).getAll();a.onsuccess=()=>{const o=a.result||[];o.sort((s,l)=>(l.downloadedAt||0)-(s.downloadedAt||0)),t(o)},a.onerror=()=>i(a.error)})}catch{return[]}}async function zm(e,t=null,i=null){try{const n=await Fi(),r=Vr(e,t,i);return new Promise(a=>{const l=n.transaction(rt,"readonly").objectStore(rt).get(r);l.onsuccess=()=>a(!!l.result),l.onerror=()=>a(!1)})}catch{return!1}}async function Gc(e,t=null,i=null){try{const n=Vr(e,t,i),r=await Yc(n);if(!r||!("caches"in window))return null;const a=await caches.open(hn);if(r.mediaKind==="hls"){let s=r.playlistTemplate||"";for(const d of r.resourceKeys||[]){const p=await a.match(Os(n,d));if(!p)throw new Error("İndirilen bölüm dosyası eksik.");const h=URL.createObjectURL(await p.blob());fn.push(h),s=s.replaceAll(`__CP_OFFLINE_RESOURCE_${d}__`,h)}const l=URL.createObjectURL(new Blob([s],{type:"application/vnd.apple.mpegurl"}));return fn.push(l),l}const o=await a.match(`/offline/${n}`);if(o){const s=URL.createObjectURL(await o.blob());return fn.push(s),s}return null}catch{return null}}function Om(){fn.forEach(e=>{try{URL.revokeObjectURL(e)}catch{}}),fn=[]}async function Nm(e,t=()=>{}){const{tmdbId:i,type:n,title:r,poster:a,backdrop:o,season:s,episode:l,streamUrl:d}=e;if(!d)throw new Error("İndirilecek medya bağlantısı bulunamadı.");if(!("caches"in window))throw new Error("Bu cihaz çevrimdışı depolamayı desteklemiyor.");const p=Vr(i,s,l),h=`/offline/${p}`;t({percent:5,loaded:0,total:0,status:"Başlatılıyor..."});try{const f=await fetch(d,{cache:"no-store"});if(!f.ok)throw new Error(`İndirme başarısız (${f.status})`);const b=f.headers.get("content-type")||"";if(/mpegurl|vnd\.apple\.mpegurl/i.test(b)||/\.m3u8(?:[?#]|$)/i.test(d)){const S=await f.text();if(!S.includes("#EXTM3U"))throw new Error("Kaynak HLS bölüm akışı döndürmedi.");const T=await caches.open(hn),I=await vf(T,p,f,S,t),L=await Fi(),D={key:p,tmdbId:String(i),type:n||"tv",title:r||"İsimsiz İçerik",poster:a||"",backdrop:o||"",season:s!==null?Number(s):null,episode:l!==null?Number(l):null,sizeBytes:I.sizeBytes,downloadedAt:Date.now(),mediaKind:"hls",playlistTemplate:I.playlistTemplate,resourceKeys:I.resourceKeys};return await new Promise((O,Y)=>{const j=L.transaction(rt,"readwrite").objectStore(rt).put(D);j.onsuccess=O,j.onerror=()=>Y(j.error)}),t({percent:100,loaded:I.sizeBytes,total:I.sizeBytes,status:"Tamamlandı"}),window.dispatchEvent(new CustomEvent("cinepulse_offline_changed",{detail:{action:"add",key:p}})),!0}const y=f.headers.get("content-length"),k=y?parseInt(y,10):0;let m=0,w;if(f.body&&k>0){const S=f.body.getReader(),T=[];for(;;){const{done:I,value:L}=await S.read();if(I)break;T.push(L),m+=L.length;const D=Math.min(99,Math.round(m/k*100));t({percent:D,loaded:m,total:k,status:`%${D} indiriliyor...`})}w=new Blob(T,{type:f.headers.get("content-type")||"video/mp4"})}else t({percent:50,loaded:0,total:0,status:"Veri alınıyor..."}),w=await f.blob();"caches"in window&&await(await caches.open(hn)).put(h,new Response(w,{headers:{"Content-Type":w.type||"video/mp4","Content-Length":String(w.size)}}));const E=await Fi(),C={key:p,tmdbId:String(i),type:n||"movie",title:r||"İsimsiz İçerik",poster:a||"",backdrop:o||"",season:s!==null?Number(s):null,episode:l!==null?Number(l):null,sizeBytes:w.size,downloadedAt:Date.now(),mimeType:w.type||"video/mp4",mediaKind:"file"};return await new Promise((S,T)=>{const D=E.transaction(rt,"readwrite").objectStore(rt).put(C);D.onsuccess=()=>S(),D.onerror=()=>T(D.error)}),t({percent:100,loaded:w.size,total:w.size,status:"Tamamlandı"}),window.dispatchEvent(new CustomEvent("cinepulse_offline_changed",{detail:{action:"add",key:p}})),!0}catch(f){try{const b=await caches.open(hn),v=new URL(`/__cinepulse_offline__/${encodeURIComponent(p)}/`,location.origin).href;await Promise.all((await b.keys()).filter(y=>y.url.startsWith(v)).map(y=>b.delete(y)))}catch{}throw f}}async function ss(e,t=null,i=null){try{const n=Vr(e,t,i),r=await Fi(),a=await Yc(n);if(await new Promise((o,s)=>{const p=r.transaction(rt,"readwrite").objectStore(rt).delete(n);p.onsuccess=()=>o(),p.onerror=()=>s(p.error)}),"caches"in window){const o=await caches.open(hn);await o.delete(`/offline/${n}`);for(const s of a?.resourceKeys||[])await o.delete(Os(n,s))}return window.dispatchEvent(new CustomEvent("cinepulse_offline_changed",{detail:{action:"delete",key:n}})),!0}catch{return!1}}function on(e){if(!e||e<=0)return"0 B";const t=1024,i=["B","KB","MB","GB","TB"],n=Math.floor(Math.log(e)/Math.log(t));return parseFloat((e/Math.pow(t,n)).toFixed(1))+" "+i[n]}function sl(e,t){const i=Bs(e);return`
    <div class="continue-card-wrapper library-card-item" 
         data-id="${e.id}" 
         data-season="${e.season||1}" 
         data-episode="${e.episode||1}" 
         data-tab="${t}"
         data-type="${i}"
         data-title="${encodeURIComponent(e.title||e.name||"İçerik")}"
         data-rating="${e.vote_average||e.voteAverage||e.rating||0}"
         data-year="${(e.release_date||e.first_air_date||e.year||"2024").substring(0,4)}">
      ${xt({...e,type:i},{isContinueSection:t==="continue"})}
      <button class="btn-delete-history btn-lib-delete" title="Listeden / Geçmişten Sil" aria-label="Sil">
        <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
      </button>
    </div>
  `}function bf(){const e=fi();Be();const t=eo(),i=Vt(),n=Gt(),r=Qs(),a=Jn().length,o=la().length;let s="continue";if(typeof window<"u"&&window.sessionStorage)try{const d=window.sessionStorage.getItem("cp_lib_active_tab");d&&["continue","completed","favorites","watchlist","all-episodes",...e?["downloads"]:[]].includes(d)&&(s=d)}catch{}return{html:`
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
              <div id="stat-total-watch" class="stat-card-val">${r.formattedTotal||r.formattedTotalTime||"0 dk"}</div>
            </div>
          </div>

          <div class="stat-card" style="border-color: rgba(59, 130, 246, 0.25);">
            <div class="stat-card-icon" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa;">
              <i data-lucide="tv"></i>
            </div>
            <div>
              <div class="stat-card-label" style="color: #60a5fa;">İzlenen Bölüm</div>
              <div id="stat-eps-count" class="stat-card-val">${r.totalEpisodes??r.episodesCount??0} Bölüm</div>
            </div>
          </div>

          <div class="stat-card" style="border-color: rgba(16, 185, 129, 0.25);">
            <div class="stat-card-icon" style="background: rgba(16, 185, 129, 0.15); color: #34d399;">
              <i data-lucide="film"></i>
            </div>
            <div>
              <div class="stat-card-label" style="color: #34d399;">İzlenen Film</div>
              <div id="stat-movies-count" class="stat-card-val">${r.totalMovies??r.moviesCount??0} Film</div>
            </div>
          </div>

          <div class="stat-card" style="border-color: rgba(239, 68, 68, 0.25);">
            <div class="stat-card-icon" style="background: rgba(239, 68, 68, 0.15); color: #f87171;">
              <i data-lucide="heart"></i>
            </div>
            <div>
              <div class="stat-card-label" style="color: #f87171;">Favori & Listem</div>
              <div id="stat-favs-count" class="stat-card-val">${i.length+n.length} Yapım</div>
            </div>
          </div>

        </div>

        <!-- Section Tabs: Devam Et, Tamamlananlar, Favoriler, Listem, Tüm Bölümler -->
        <div class="library-segmented-nav-track" id="library-tabs">
          <button class="lib-nav-tab ${s==="continue"?"active":""}" data-tab="continue">
            <i data-lucide="clock"></i>
            <span>Devam Et</span>
            <span class="lib-tab-badge" id="tab-count-continue">${a}</span>
          </button>
          <button class="lib-nav-tab ${s==="completed"?"active":""}" data-tab="completed">
            <i data-lucide="check-circle-2"></i>
            <span>Tamamlananlar</span>
            <span class="lib-tab-badge" id="tab-count-completed">${o}</span>
          </button>
          <button class="lib-nav-tab ${s==="favorites"?"active":""}" data-tab="favorites">
            <i data-lucide="heart"></i>
            <span>Favorilerim</span>
            <span class="lib-tab-badge" id="tab-count-favorites">${i.length}</span>
          </button>
          <button class="lib-nav-tab ${s==="watchlist"?"active":""}" data-tab="watchlist">
            <i data-lucide="plus-circle"></i>
            <span>İzleme Listesi</span>
            <span class="lib-tab-badge" id="tab-count-watchlist">${n.length}</span>
          </button>
          <button class="lib-nav-tab ${s==="all-episodes"?"active":""}" data-tab="all-episodes">
            <i data-lucide="history"></i>
            <span>İzleme Geçmişi</span>
            <span class="lib-tab-badge" id="tab-count-all-episodes">${t.length}</span>
          </button>
          ${e?`<button class="lib-nav-tab ${s==="downloads"?"active":""}" data-tab="downloads">
            <i data-lucide="download"></i>
            <span>İndirilenler</span>
            <span class="lib-tab-badge" id="tab-count-downloads">0</span>
          </button>`:""}
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
        <div class="tab-content ${s==="continue"?"":"hidden"}" id="tab-continue"></div>

        <!-- Tab 2: Completed / Finished Watch List -->
        <div class="tab-content ${s==="completed"?"":"hidden"}" id="tab-completed"></div>

        <!-- Tab 3: Favorites Grid -->
        <div class="tab-content ${s==="favorites"?"":"hidden"}" id="tab-favorites"></div>

        <!-- Tab 4: Watchlist Grid -->
        <div class="tab-content ${s==="watchlist"?"":"hidden"}" id="tab-watchlist"></div>

        <!-- Tab 5: All Episodes Breakdown -->
        <div class="tab-content ${s==="all-episodes"?"":"hidden"}" id="tab-all-episodes"></div>

        <!-- Tab 6: Offline Downloads -->
        ${e?`<div class="tab-content ${s==="downloads"?"":"hidden"}" id="tab-downloads"></div>`:""}
      </div>
    </div>
  `,init:d=>{if(!d)return;let p=s,h="all",f="recent",b="";const v=d.querySelector("#lib-search-input"),y=d.querySelector("#lib-search-clear"),k=d.querySelector("#lib-sort-select"),m=d.querySelector("#lib-batch-clear-btn");let w=[];const E=async()=>{try{w=(await Vc()).map(J=>({id:J.tmdbId,title:J.title,poster_path:J.poster,backdrop_path:J.backdrop,type:J.type,isSeries:J.type==="tv"||J.season!==null&&J.episode!==null,season:J.season??null,episode:J.episode??null,sizeBytes:J.sizeBytes,mediaKind:J.mediaKind||"file",isDownloaded:!0,key:J.key}));const ae=d.querySelector("#tab-count-downloads");ae&&(ae.textContent=w.length),p==="downloads"&&I()}catch{}};e&&E();const C=N=>N==="continue"?Jn():N==="completed"?la():N==="favorites"?Vt():N==="watchlist"?Gt():N==="all-episodes"?eo():N==="downloads"?w:[],S=N=>N==="downloads"?`
            <div class="library-empty-state">
              <div class="empty-state-icon-wrap" style="background: rgba(245, 158, 11, 0.12); border-color: rgba(245, 158, 11, 0.3); color: #f59e0b;">
                <i data-lucide="download" style="width: 32px; height: 32px;"></i>
              </div>
              <h3 class="empty-state-title">Henüz indirilmiş içerik yok</h3>
              <p class="empty-state-desc">Oynatıcıdaki "Çevrimdışı İndir" butonuna basarak dizi veya filmleri cihazınıza indirebilir, internetsiz izleyebilirsiniz.</p>
              <a href="#discover" class="btn-primary empty-state-action-btn">
                <i data-lucide="compass" style="width: 16px; height: 16px;"></i>
                <span>İçerik Keşfet</span>
              </a>
            </div>
          `:N==="continue"?`
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
          `:N==="completed"?`
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
          `:N==="favorites"?`
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
          `:N==="watchlist"?`
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
          `;let T=36;const I=()=>{const N=d.querySelector(`#tab-${p}`);if(!N)return;let J=C(p).filter(K=>{const ne=(K.title||K.name||"").toLowerCase(),de=Bs(K);return(!b||ne.includes(b.toLowerCase()))&&(h==="all"||de===h)});if(f==="rating-desc"?J.sort((K,ne)=>{const de=parseFloat(K.vote_average||K.voteAverage||K.rating||0);return parseFloat(ne.vote_average||ne.voteAverage||ne.rating||0)-de}):f==="title-asc"?J.sort((K,ne)=>{const de=K.title||K.name||"",G=ne.title||ne.name||"";return de.localeCompare(G,"tr")}):f==="year-desc"&&J.sort((K,ne)=>{const de=parseInt((K.release_date||K.first_air_date||K.year||"0").substring(0,4),10);return parseInt((ne.release_date||ne.first_air_date||ne.year||"0").substring(0,4),10)-de}),J.length===0)N.innerHTML=S(p);else if(p==="downloads")N.innerHTML=`
            <div class="offline-download-list">
              ${J.map(K=>`
                <article class="offline-download-card" data-offline-id="${K.id}" data-season="${K.season??""}" data-episode="${K.episode??""}">
                  <img src="${K.backdrop_path||K.poster_path||""}" alt="" loading="lazy" />
                  <div class="offline-download-info"><strong>${K.title}</strong><span>${K.isSeries?`S${K.season} · B${K.episode}`:"Film"} · ${on(K.sizeBytes)}</span><small>Bu cihaza kaydedildi · İnternetsiz izlenebilir</small></div>
                  <button class="offline-play-btn" type="button"><i data-lucide="play"></i><span>Oynat</span></button>
                  <button class="btn-delete-history btn-lib-delete" title="Cihazdan sil" aria-label="Cihazdan sil"><i data-lucide="trash-2"></i></button>
                </article>`).join("")}
            </div>`,N.querySelectorAll(".offline-play-btn").forEach(K=>{K.addEventListener("click",async()=>{const ne=K.closest(".offline-download-card"),de=ne?.dataset.offlineId,G=ne?.dataset.season?Number(ne.dataset.season):null,$=ne?.dataset.episode?Number(ne.dataset.episode):null,M=w.find(H=>String(H.id)===String(de)&&H.season===G&&H.episode===$);if(M){K.disabled=!0;try{const H=await Gc(de,G,$);if(!H)throw new Error("İndirilen video dosyası bulunamadı.");Qt({type:M.type==="movie"?"movie":"tv",tmdbId:de,title:M.title,seriesTitle:M.title,season:G||1,episode:$||1,posterPath:M.poster_path||"",backdropPath:M.backdrop_path||"",offlinePlaybackUrl:H,offlineMediaKind:M.mediaKind})}catch(H){Z(H?.message||"İndirilen içerik açılamadı.","error")}finally{K.disabled=!1}}})}),N.querySelectorAll(".offline-download-card .btn-lib-delete").forEach(K=>{K.addEventListener("click",async()=>{const ne=K.closest(".offline-download-card"),de=ne?.dataset.offlineId,G=ne?.dataset.season?Number(ne.dataset.season):null,$=ne?.dataset.episode?Number(ne.dataset.episode):null;if(!de||!window.confirm("Bu indirilen içerik cihazdan silinsin mi?"))return;await ss(de,G,$),w=w.filter(H=>!(String(H.id)===String(de)&&H.season===G&&H.episode===$));const M=d.querySelector("#tab-count-downloads");M&&(M.textContent=String(w.length)),I(),Z("İndirilen içerik cihazdan silindi.","success")})});else{const K=J.slice(0,T),ne=J.length>T;N.innerHTML=`
            <div class="media-grid" id="grid-${p}">
              ${K.map(H=>sl(H,p)).join("")}
            </div>
            ${ne?`
              <div class="lib-load-more-wrap" style="text-align: center; margin: 2rem 0 1rem;">
                <button id="btn-lib-load-more" class="btn-secondary" style="padding: 0.6rem 1.8rem; border-radius: var(--radius-full); font-size: 0.88rem;">
                  <span>Daha Fazla Göster (${J.length-T} içerik daha)</span>
                </button>
                <div class="lib-scroll-sentinel" style="height: 1px; margin-top: 1rem;"></div>
              </div>
            `:""}
          `;const de=N.querySelector(`#grid-${p}`),G=()=>{const H=de.querySelectorAll(".library-card-item").length;if(H>=J.length){const q=N.querySelector(".lib-load-more-wrap");q&&q.remove();return}const Q=J.slice(H,H+36);T=H+Q.length;const se=Q.map(q=>sl(q,p)).join("");de.insertAdjacentHTML("beforeend",se);const x=J.length-T,A=N.querySelector(".lib-load-more-wrap");if(x>0){const q=A?.querySelector("#btn-lib-load-more span");q&&(q.textContent=`Daha Fazla Göster (${x} içerik daha)`)}else A&&A.remove();el(Q),Y(de),V(de),mt(de),kn(de)},$=N.querySelector("#btn-lib-load-more");$&&$.addEventListener("click",G);const M=N.querySelector(".lib-scroll-sentinel");M&&"IntersectionObserver"in window&&new IntersectionObserver(Q=>{Q.some(se=>se.isIntersecting)&&G()},{rootMargin:"400px 0px"}).observe(M),Y(N),el(K),mt(N),kn(N)}if(m)if(p==="completed"||p==="all-episodes"||p==="continue"){m.classList.remove("hidden");const K=m.querySelector("span");K&&(K.textContent="Temizle"),p==="completed"?m.title="Tamamlananlar listesini temizle":p==="continue"?m.title="İzlemeye devam et listesini temizle":m.title="Bölüm izleme geçmişini temizle"}else m.classList.add("hidden");V()},L=()=>{T=36,I()},D=d.querySelectorAll("#library-tabs .lib-nav-tab");D.forEach(N=>{N.addEventListener("click",ae=>{ae.preventDefault();const J=N.getAttribute("data-tab");if(p===J)return;if(D.forEach(ne=>ne.classList.remove("active")),N.classList.add("active"),p=J,typeof window<"u"&&window.sessionStorage)try{window.sessionStorage.setItem("cp_lib_active_tab",J)}catch{}d.querySelectorAll(".tab-content").forEach(ne=>ne.classList.add("hidden"));const K=d.querySelector(`#tab-${p}`);K&&K.classList.remove("hidden"),T=36,I()})});const O=()=>{const N=Qs(),ae=d.querySelector("#stat-total-watch")||d.querySelector("#stat-total-time"),J=d.querySelector("#stat-eps-count")||d.querySelector("#stat-episodes-count"),K=d.querySelector("#stat-movies-count"),ne=d.querySelector("#stat-favs-count");ae&&(ae.textContent=N.formattedTotal||N.formattedTotalTime||"0 dk"),J&&(J.textContent=`${N.totalEpisodes??N.episodesCount??0} Bölüm`),K&&(K.textContent=`${N.totalMovies??N.moviesCount??0} Film`),ne&&(ne.textContent=`${Vt().length+Gt().length} Yapım`);const de=d.querySelector("#tab-count-continue"),G=d.querySelector("#tab-count-completed"),$=d.querySelector("#tab-count-favorites"),M=d.querySelector("#tab-count-watchlist"),H=d.querySelector("#tab-count-all-episodes");de&&(de.textContent=Jn().length),G&&(G.textContent=la().length),$&&($.textContent=Vt().length),M&&(M.textContent=Gt().length),H&&(H.textContent=Be().length)},Y=N=>{N&&N.querySelectorAll(".btn-lib-delete").forEach(ae=>{ae.addEventListener("click",J=>{J.stopPropagation();const K=ae.closest(".library-card-item");if(!K)return;const ne=K.getAttribute("data-id"),de=parseInt(K.getAttribute("data-season")||"1",10),G=parseInt(K.getAttribute("data-episode")||"1",10),$=K.getAttribute("data-tab"),M=decodeURIComponent(K.getAttribute("data-title")||"İçerik");let H=`"${M}" kaydını silmek istediğinize emin misiniz?`;if($==="all-episodes"?H=`"${M}" (Sezon ${de}, Bölüm ${G}) izleme geçmişinizden silinsin mi?`:$==="continue"?H=`"${M}" devam et listesinden kaldırılsın mı?`:$==="completed"?H=`"${M}" tamamlananlar geçmişinden silinsin mi?`:$==="favorites"?H=`"${M}" favorilerinizden kaldırılsın mı?`:$==="watchlist"?H=`"${M}" izleme listenizden kaldırılsın mı?`:$==="downloads"&&(H=`"${M}" indirilmiş içerik cihazınızdan silinsin mi?`),window.confirm(H)){if($==="all-episodes")Bd(ne,de,G);else if($==="continue"||$==="completed")Oa(ne);else if($==="favorites")$d(ne);else if($==="watchlist")Md(ne);else if($==="downloads"){const Q=w.find(se=>String(se.id)===String(ne)&&(se.season||1)===de&&(se.episode||1)===G);ss(ne,Q?.season??null,Q?.episode??null),w=w.filter(se=>!(se.id===ne&&se.season===de&&se.episode===G))}Z("✓ Kayıt başarıyla silindi.","success"),K.style.transition="all 0.28s ease-out",K.style.transform="scale(0.85)",K.style.opacity="0",setTimeout(()=>{K.remove(),O()},300)}})})};v&&v.addEventListener("input",N=>{b=N.target.value.trim(),y&&(y.style.display=b?"block":"none"),L()}),y&&y.addEventListener("click",()=>{v&&(v.value="",b="",y.style.display="none",L(),v.focus())});const j=d.querySelectorAll("#lib-type-filters .lib-segment-btn");j.forEach(N=>{N.addEventListener("click",()=>{j.forEach(ae=>ae.classList.remove("active")),N.classList.add("active"),h=N.getAttribute("data-filter")||"all",L()})}),k&&k.addEventListener("change",N=>{f=N.target.value,L()}),m&&m.addEventListener("click",()=>{let N="Bu listedeki tüm kayıtları silmek istediğinize emin misiniz?";p==="completed"?N="Tamamlananlar listesindeki tüm kayıtlar temizlensin mi?":p==="continue"?N="İzlemeye devam et listesindeki tüm yarım kalanlar temizlensin mi?":p==="all-episodes"&&(N="Tüm bölüm izleme geçmişiniz sıfırlansın mı?"),window.confirm(N)&&(p==="completed"||p==="continue"?Xs():p==="all-episodes"&&Pd(),Z("✓ Liste başarıyla temizlendi.","success"),O(),I())});const z=d.querySelector("#lib-export-btn");z&&z.addEventListener("click",()=>$l());const B=d.querySelector("#lib-import-btn"),W=d.querySelector("#lib-file-input");B&&W&&(B.addEventListener("click",()=>W.click()),W.addEventListener("change",N=>{if(N.target.files&&N.target.files.length>0){const ae=N.target.files[0],J=new FileReader;J.onload=K=>{const ne=Ml(K.target.result,"merge");ne.success?($r(),O(),I(),mt(d),V(),Z(`✓ Yedek başarıyla yüklendi! (${ne.countHistory} izleme, ${ne.countFavs} favori aktarıldı)`,"success")):Z(`Yükleme hatası: ${ne.message||ne.error}`,"error")},J.onerror=()=>Z("Dosya okunamadı.","error"),J.readAsText(ae)}}));const ie=d.querySelector("#lib-data-modal-btn");ie&&ie.addEventListener("click",()=>Ul()),I(),mt(d),V(),xd().then(()=>{O(),I()}).catch(()=>{});const te=N=>{N&&N.detail&&N.detail.isProgressUpdate&&document.getElementById("player-modal")||(O(),I())};window.addEventListener("sineflix_data_changed",te),window.addEventListener("cinepulse_data_changed",te);const re=()=>E();window.addEventListener("cinepulse_offline_changed",re)}}}function wf(){return{html:`
      <section class="downloads-page" id="downloads-page">
        <header class="downloads-page-header">
          <div class="downloads-page-icon"><i data-lucide="download"></i></div>
          <div><span class="downloads-kicker">BU CİHAZDA</span><h1>İndirilenler</h1><p>Dizilerin ve bölümlerin çevrimdışı izlemeye hazır.</p></div>
        </header>
        <div class="downloads-storage-card">
          <div class="downloads-storage-copy"><span>Yerel depolama</span><strong id="downloads-storage-text">Kullanım hesaplanıyor…</strong></div>
          <div class="downloads-storage-track"><span id="downloads-storage-fill"></span></div>
          <small id="downloads-storage-note">İndirilen dosyalar yalnızca bu cihazda saklanır.</small>
        </div>
        <div class="downloads-list-heading"><h2>Kaydedilen içerikler</h2><span id="downloads-total">0 öğe</span></div>
        <div class="downloads-list" id="downloads-list"><div class="downloads-loading"><i data-lucide="loader-circle"></i><span>İndirilenler yükleniyor…</span></div></div>
      </section>`,init:e=>{if(!fi())return;const t=e.querySelector("#downloads-page"),i=t?.querySelector("#downloads-list");if(!t||!i)return;const n=async()=>{try{const{usage:o=0,quota:s=0}=await navigator.storage.estimate(),l=s?Math.min(100,Math.round(o/s*100)):0;t.querySelector("#downloads-storage-text").textContent=s?`${on(o)} kullanılıyor · ${on(Math.max(0,s-o))} boş`:`${on(o)} kullanılıyor`,t.querySelector("#downloads-storage-fill").style.width=`${l}%`}catch{t.querySelector("#downloads-storage-text").textContent="Depolama bilgisi alınamadı"}},r=async()=>{const o=await Vc();if(t.isConnected){if(t.querySelector("#downloads-total").textContent=`${o.length} öğe`,!o.length){i.innerHTML='<div class="downloads-empty"><i data-lucide="cloud-download"></i><h3>Henüz içerik indirmedin</h3><p>Bir bölümü oynatıcıda açıp <b>İndir</b> düğmesine bas. İndirme ilerlemesini oradan görebilirsin.</p><a href="#home" class="downloads-browse-btn"><i data-lucide="compass"></i> İçeriklere göz at</a></div>',V(i);return}i.innerHTML=o.map((s,l)=>`
          <article class="download-item" data-index="${l}">
            <div class="download-item-art">${s.backdrop||s.poster?`<img src="${s.backdrop||s.poster}" alt="" loading="lazy" />`:'<i data-lucide="clapperboard"></i>'}<span><i data-lucide="check"></i> HAZIR</span></div>
            <div class="download-item-main"><h3>${s.title}</h3><p>${s.season!==null&&s.episode!==null?`Sezon ${s.season} · Bölüm ${s.episode}`:"Film"} <b>·</b> ${on(s.sizeBytes)}</p><small>${new Date(s.downloadedAt||Date.now()).toLocaleDateString("tr-TR")} · İnternetsiz oynatılabilir</small></div>
            <button class="download-item-play" type="button" aria-label="İndirilen içeriği oynat"><i data-lucide="play"></i><span>Oynat</span></button>
            <button class="download-item-delete" type="button" aria-label="İndirilen içeriği sil"><i data-lucide="trash-2"></i></button>
          </article>`).join(""),V(i),i.querySelectorAll(".download-item").forEach((s,l)=>{const d=o[l];s.querySelector(".download-item-play").addEventListener("click",async p=>{const h=p.currentTarget;h.disabled=!0;try{const f=await Gc(d.tmdbId,d.season,d.episode);if(!f)throw new Error("İndirilen video bulunamadı.");Qt({type:d.type==="movie"?"movie":"tv",tmdbId:d.tmdbId,title:d.title,seriesTitle:d.title,season:d.season||1,episode:d.episode||1,posterPath:d.poster||"",backdropPath:d.backdrop||"",offlinePlaybackUrl:f,offlineMediaKind:d.mediaKind||"file"})}catch(f){Z(f?.message||"İndirilen içerik açılamadı.","error")}finally{h.disabled=!1}}),s.querySelector(".download-item-delete").addEventListener("click",async()=>{window.confirm(`“${d.title}” cihazdan silinsin mi?`)&&(await ss(d.tmdbId,d.season,d.episode),await r(),await n(),Z("İndirilen içerik silindi.","success"))})})}};n(),r();const a=()=>{r(),n()};window.addEventListener("cinepulse_offline_changed",a),V(t)}}}const Te={currentType:"tv",currentGenreId:null,currentSortBy:"popularity.desc",currentMinRating:0,currentPlatform:null,currentYearRange:"all",currentPage:1,allItems:[],isExhausted:!1};async function kf(e="tv"){e&&e!==Te.currentType&&Te.allItems.length===0&&(Te.currentType=e);let t=Te.currentType,i=Te.currentGenreId,n=Te.currentSortBy,r=Te.currentMinRating,a=Te.currentPlatform,o=Te.currentYearRange,s=!1;const l=[{id:null,name:"Tüm Türler"},{id:bt.MYSTERY,name:"🩸 Korku & Gerilim"},{id:bt.ACTION_ADVENTURE,name:"💥 Aksiyon & Macera"},{id:bt.SCI_FI_FANTASY,name:"🚀 Bilim Kurgu & Fantastik"},{id:bt.DRAMA,name:"🎭 Dram"},{id:bt.COMEDY,name:"😂 Komedi"},{id:bt.CRIME,name:"🕵️ Suç & Polisiye"},{id:bt.ANIMATION,name:"🎌 Animasyon & Anime"},{id:bt.DOCUMENTARY,name:"🌍 Belgesel"},{id:bt.FAMILY,name:"👨‍👩‍👧‍👦 Aile & Gençlik"},{id:bt.WAR_POLITICS,name:"⚔️ Savaş & Politika"},{id:bt.WESTERN,name:"🤠 Western"}],d=[{id:null,name:"Tüm Türler"},{id:Ge.HORROR,name:"🩸 Korku"},{id:Ge.THRILLER,name:"⚡ Gerilim"},{id:Ge.ACTION,name:"💥 Aksiyon"},{id:Ge.ADVENTURE,name:"🗺️ Macera"},{id:Ge.SCI_FI,name:"🚀 Bilim Kurgu"},{id:Ge.FANTASY,name:"🧙‍♂️ Fantastik"},{id:Ge.DRAMA,name:"🎭 Dram"},{id:Ge.COMEDY,name:"😂 Komedi"},{id:Ge.CRIME,name:"🕵️ Suç"},{id:Ge.ANIMATION,name:"🎌 Animasyon"},{id:Ge.MYSTERY,name:"🔍 Gizem"},{id:Ge.ROMANCE,name:"💖 Romantik"},{id:Ge.DOCUMENTARY,name:"🌍 Belgesel"},{id:Ge.HISTORY,name:"🏰 Tarih & Savaş"},{id:Ge.FAMILY,name:"👨‍👩‍👧‍👦 Aile"},{id:Ge.MUSIC,name:"🎵 Müzikal"},{id:Ge.WESTERN,name:"🤠 Western"}],p=()=>t==="movie"?d:l,h=Te.allItems.length>0,f=h?Te.allItems.map(v=>xt(v)).join(""):'<div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">İçerikler yükleniyor...</div>';return{html:`
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
                <option value="" ${a?"":"selected"}>🌐 Tüm Platformlar</option>
                <option value="213" ${a==="213"?"selected":""}>🔴 Netflix</option>
                <option value="49" ${a==="49"?"selected":""}>🟣 HBO / Max</option>
                <option value="2739" ${a==="2739"?"selected":""}>🔵 Disney+</option>
                <option value="1024" ${a==="1024"?"selected":""}>🟡 Amazon Prime</option>
                <option value="2552" ${a==="2552"?"selected":""}>⚪ Apple TV+</option>
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
                <option value="0" ${r===0?"selected":""}>Tümü (Puan Sınırı Yok)</option>
                <option value="8.0" ${r===8?"selected":""}>⭐ 8.0 ve Üzeri (Başyapıtlar)</option>
                <option value="7.5" ${r===7.5?"selected":""}>⭐ 7.5 ve Üzeri (Çok Yüksek)</option>
                <option value="7.0" ${r===7?"selected":""}>⭐ 7.0 ve Üzeri (Çok İyi)</option>
                <option value="6.0" ${r===6?"selected":""}>⭐ 6.0 ve Üzeri (İyi)</option>
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
          ${f}
        </div>

        <!-- Scroll Sentinel / Loader -->
        <div id="discover-sentinel" style="height: 60px; display: flex; align-items: center; justify-content: center; margin-top: 2rem; color: var(--text-muted);">
          <i data-lucide="loader-2" class="spin-loader" style="width: 28px; height: 28px; display: none;"></i>
        </div>

      </div>
    </div>
  `,init:v=>{if(!v)return;const y=v.querySelector("#discover-type-tv"),k=v.querySelector("#discover-type-movie"),m=v.querySelector("#discover-type-anime"),w=v.querySelector("#discover-type-doc"),E=v.querySelector("#discover-platform-select"),C=v.querySelector("#discover-year-select"),S=v.querySelector("#discover-sort-select"),T=v.querySelector("#discover-rating-select"),I=v.querySelector("#discover-genre-bar"),L=v.querySelector("#discover-media-grid"),D=v.querySelector("#discover-sentinel"),O=D?D.querySelector(".spin-loader"):null;E&&E.addEventListener("change",()=>{a=E.value||null,Te.currentPlatform=a,B()}),C&&C.addEventListener("change",()=>{o=C.value||"all",Te.currentYearRange=o,B()});const Y=()=>{const re=p();I.innerHTML=re.map(N=>`
          <button class="genre-pill-btn ${i===N.id?"active":""}" data-genre-id="${N.id||""}">
            ${N.name}
          </button>
        `).join(""),I.querySelectorAll(".genre-pill-btn").forEach(N=>{N.addEventListener("click",()=>{const ae=N.dataset.genreId?parseInt(N.dataset.genreId,10):null;i!==ae&&(i=ae,I.querySelectorAll(".genre-pill-btn").forEach(J=>J.classList.remove("active")),N.classList.add("active"),B())})})};let j=0;const z=async re=>{const N=re||j;if(s||Te.isExhausted)return;s=!0,O&&(O.style.display="block");const ae=Te.currentPage||1;try{const J=t==="anime"||t==="documentary"?"tv":t,K=t==="anime",ne=t==="documentary";let de=n;n==="first_air_date.desc"&&J==="movie"&&(de="primary_release_date.desc");let G=null,$=null;o==="2024-2026"?(G=2024,$=2026):o==="2020-2023"?(G=2020,$=2023):o==="2010-2019"?(G=2010,$=2019):o==="2000-2009"?(G=2e3,$=2009):o==="1990-1999"?(G=1990,$=1999):o==="before-1990"&&(G=1940,$=1989);const M=await zl({type:J,genreId:i,page:ae,sortBy:de,minRating:r,isAnime:K,isDoc:ne,yearMin:G,yearMax:$,withNetworks:a});if(N!==j)return;if(O&&(O.style.display="none"),!M||M.length===0){ae===1&&(L.innerHTML='<div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted); font-size: 1.05rem;">Bu filtre kriterlerine uygun içerik bulunamadı.</div>'),Te.isExhausted=!0;return}Te.allItems=[...Te.allItems,...M],Te.currentType=t,Te.currentGenreId=i,Te.currentSortBy=n,Te.currentMinRating=r;const H=M.map(Q=>xt(Q)).join("");ae===1?L.innerHTML=H:L.insertAdjacentHTML("beforeend",H),V(),mt(L),Te.currentPage=ae+1}catch{if(N!==j)return;O&&(O.style.display="none"),ae===1&&(!Te.allItems||Te.allItems.length===0)&&(L.innerHTML=`
              <div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">
                <p style="margin-bottom: 0.75rem;">İçerikler getirilirken bir sorun oluştu.</p>
                <button id="btn-retry-discover" class="btn-secondary" style="padding: 0.5rem 1.2rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
                  <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
                  <span>Tekrar Dene</span>
                </button>
              </div>
            `,V(),L.querySelector("#btn-retry-discover")?.addEventListener("click",()=>{B()}))}finally{N===j&&(s=!1,O&&(O.style.display="none"))}},B=()=>{j++;const re=j;Te.currentPage=1,Te.allItems=[],Te.isExhausted=!1,s=!1,L.innerHTML=`
          <div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">
            <div class="spin-loader" style="width: 32px; height: 32px; border: 3px solid rgba(245,158,11,0.2); border-top-color: #f59e0b; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem;"></div>
            <div>İçerikler yükleniyor...</div>
          </div>
        `,O&&(O.style.display="none"),z(re)};Y(),h||z();let W=null;D&&"IntersectionObserver"in window&&(W=new IntersectionObserver(re=>{re[0].isIntersecting&&z()},{rootMargin:"0px 0px 600px 0px"}),W.observe(D));const ie=()=>{if(s||Te.isExhausted)return;const re=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||0,N=window.innerHeight,ae=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);re+N>=ae-700&&z()};window.addEventListener("scroll",ie,{passive:!0}),window.__discoverCleanup=()=>{W?.disconnect(),window.removeEventListener("scroll",ie)};const te=re=>{t!==re&&(t=re,i=null,[y,k,m,w].forEach(N=>N?.classList.remove("active")),re==="tv"&&y?.classList.add("active"),re==="movie"&&k?.classList.add("active"),re==="anime"&&m?.classList.add("active"),re==="documentary"&&w?.classList.add("active"),Y(),B())};y&&y.addEventListener("click",()=>te("tv")),k&&k.addEventListener("click",()=>te("movie")),m&&m.addEventListener("click",()=>te("anime")),w&&w.addEventListener("click",()=>te("documentary")),S&&S.addEventListener("change",re=>{n=re.target.value,B()}),T&&T.addEventListener("change",re=>{r=parseFloat(re.target.value),B()})}}}const Ri={};function _f(e){const i=Lt()?`${e}_kids`:e;return(!Ri[i]||Ri[i].stale)&&(Ri[i]={allItems:[],seenIds:new Set,nextPage:1,isExhausted:!1,stale:!1}),Ri[i]}function Sf(e){if(Lt())switch(e){case"movie":return Ua;case"anime":return ja;case"documentary":return Xd;case"cartoon":return qa;default:return qa}switch(e){case"movie":return fr;case"anime":return mr;case"documentary":return gr;case"cartoon":return pr;default:return hr}}async function Qi(e="tv"){const t=Lt(),i=t?`${e}_kids`:e;Ri[i]&&(Ri[i].stale=!0);const n=_f(e),r=t?{tv:["Türkiye’de Popüler Çizgi ve Gençlik Dizileri","monitor-play"],movie:["🎈 Animasyon & Çocuk Filmleri","popcorn"],anime:["Türkiye’de Popüler Çocuk ve Genç Animeleri","cat"],documentary:["🐾 Doğa & Hayvan Belgeselleri","globe"]}:{tv:["Tüm Zamanların En Popüler Dizileri","monitor-play"],cartoon:["Çizgi Dizi Dünyası & Unutulmaz Klasikler","wand-2"],movie:["Tüm Zamanların En Popüler Filmleri","popcorn"],anime:["Türkiye’de En Popüler Animeler","cat"],documentary:["Tüm Zamanların En Çok İzlenen Belgeselleri","globe"]},[a,o]=r[e]||r.tv;return{html:`
    <div class="popular-list-view">
      <div class="container">
        <div class="popular-list-header">
          <h1 class="popular-list-title">
            <span class="rail-icon-pill" style="--rail-color: #f59e0b; width: 32px; height: 32px; flex-shrink: 0;">
              <i data-lucide="${o}" style="width: 17px; height: 17px;"></i>
            </span>
            <span>${a}</span>
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
  `,init:d=>{if(!d)return;const p=d.querySelector("#popular-media-grid"),h=d.querySelector("#popular-sentinel");if(!p)return;mt(p);let f=!1;const b=Sf(e),v=()=>{h&&(n.isExhausted?h.innerHTML='<p style="color: var(--text-muted); font-size: 0.9rem;">Tüm popüler içerikler listelendi.</p>':h.innerHTML=`
            <div style="display: flex; align-items: center; gap: 0.6rem; color: var(--text-muted); font-size: 0.9rem;">
              <div class="spin-loader" style="width: 20px; height: 20px; border: 2px solid rgba(245,158,11,0.25); border-top-color: #f59e0b; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
              <span>Daha fazla içerik akıyor...</span>
            </div>
          `)},y=E=>{if(!E||E.length===0)return;const C=[];for(const I of E)I&&I.id&&!n.seenIds.has(I.id)&&(n.seenIds.add(I.id),C.push(I));if(C.length===0)return;n.allItems.push(...C);const S=C.map(I=>xt(I)).join("");p.querySelector(".popular-loading-placeholder")?p.innerHTML=S:p.insertAdjacentHTML("beforeend",S),mt(p),V()},k=async(E=3)=>{if(!(f||n.isExhausted)){f=!0,v();try{const C=n.nextPage,S=Array.from({length:E},(Y,j)=>C+j);n.nextPage+=E;let T=0;const I=e==="anime"||e==="cartoon"||t&&e==="tv",L=S.map(Y=>b(Y).catch(()=>[])),D=await Promise.all(L),O=D.flat().filter(Boolean);if(I){const Y=e==="cartoon"?"_cartoonScore":"_turkeyPopularityScore";O.sort((j,z)=>(z[Y]||0)-(j[Y]||0)),T=O.length,y(O)}else for(const Y of D)Y&&Y.length>0&&(T+=Y.length,y(Y));O.length===0&&(n.isExhausted=!0),v(),requestAnimationFrame(()=>{if(!n.isExhausted&&document.documentElement.scrollHeight<=window.innerHeight+600){f=!1,k(2);return}})}catch{}finally{f=!1,v()}}};k(1);let m=null;h&&"IntersectionObserver"in window&&(m=new IntersectionObserver(E=>{E[0].isIntersecting&&!f&&!n.isExhausted&&k(2)},{rootMargin:"0px 0px 1500px 0px"}),m.observe(h));const w=()=>{if(f||n.isExhausted)return;const E=window.scrollY||0,C=window.innerHeight,S=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);E+C>=S-1200&&k(2)};window.addEventListener("scroll",w,{passive:!0}),window.__popularListCleanup=()=>{m?.disconnect(),window.removeEventListener("scroll",w)}}}}function xf(){const e=new Set;let t=!1;const i=s=>{t?s():e.add(s)},n=(s,l,d,p)=>{t||(s.addEventListener(l,d,p),i(()=>s.removeEventListener(l,d,p)))},r=new Map,a=s=>{const l=r.get(s);l&&(l(),e.delete(l),r.delete(s))},o=(s,l,d)=>{if(t)return null;const p=globalThis[d?"setInterval":"setTimeout"](()=>{d||a(p),t||s()},l),h=()=>globalThis[d?"clearInterval":"clearTimeout"](p);return r.set(p,h),i(h),p};return{on:n,add:i,setTimeout:(s,l)=>o(s,l,!1),setInterval:(s,l)=>o(s,l,!0),clearTimeout:a,clearInterval:a,dispose(){if(!t){t=!0;for(const s of e)s();e.clear(),r.clear()}}}}function Hm(e){const t=globalThis.window?.lucide;if(!(!e||!t?.createElement||!t.icons))for(const i of e.querySelectorAll("[data-lucide]:not(svg)")){const n=i.getAttribute("data-lucide"),r=n.replace(/(^|-)(\w)/g,(l,d,p)=>p.toUpperCase()),a=t.icons[r];if(!a)continue;const o=Object.fromEntries(Array.from(i.attributes,l=>[l.name,l.value]));o.class=`lucide lucide-${n} ${o.class||""}`;const s=t.createElement(a);for(const[l,d]of Object.entries(o))s.setAttribute(l,d);i.replaceWith(s)}}function _t(e,t){const i=(e||"").replace(/ (HD|4K|TV|Kanalı)/gi,"").trim(),n=i.slice(0,5).toUpperCase(),a={"TRT 1":{bg:"linear-gradient(135deg, #b91c1c, #ef4444)",text:"#ffffff",tag:"TRT 1"},ATV:{bg:"linear-gradient(135deg, #c2410c, #f97316)",text:"#ffffff",tag:"ATV"},"SHOW TV":{bg:"linear-gradient(135deg, #6b21a8, #ec4899)",text:"#ffffff",tag:"SHOW"},"NOW TV":{bg:"linear-gradient(135deg, #991b1b, #ef4444)",text:"#ffffff",tag:"NOW"},"STAR TV":{bg:"linear-gradient(135deg, #b91c1c, #dc2626)",text:"#ffffff",tag:"STAR"},"KANAL D":{bg:"linear-gradient(135deg, #0369a1, #0284c7)",text:"#ffffff",tag:"KANAL D"},TV8:{bg:"linear-gradient(135deg, #ea580c, #f97316)",text:"#ffffff",tag:"TV8"},"CNBC-E":{bg:"linear-gradient(135deg, #047857, #10b981)",text:"#ffffff",tag:"CNBC-E"},"A2 TV":{bg:"linear-gradient(135deg, #991b1b, #ea580c)",text:"#ffffff",tag:"A2"},"KANAL 7":{bg:"linear-gradient(135deg, #0284c7, #38bdf8)",text:"#ffffff",tag:"KANAL 7"},"BEYAZ TV":{bg:"linear-gradient(135deg, #881337, #e11d48)",text:"#ffffff",tag:"BEYAZ"},TEVE2:{bg:"linear-gradient(135deg, #ca8a04, #eab308)",text:"#000000",tag:"TEVE2"},"TV 360":{bg:"linear-gradient(135deg, #581c87, #9333ea)",text:"#ffffff",tag:"360"},"TRT HABER":{bg:"linear-gradient(135deg, #831843, #db2777)",text:"#ffffff",tag:"HABER"},"A HABER":{bg:"linear-gradient(135deg, #991b1b, #f97316)",text:"#ffffff",tag:"A HABER"},NTV:{bg:"linear-gradient(135deg, #0369a1, #0284c7)",text:"#ffffff",tag:"NTV"},HABERTÜRK:{bg:"linear-gradient(135deg, #991b1b, #dc2626)",text:"#ffffff",tag:"HTÜRK"},"HALK TV":{bg:"linear-gradient(135deg, #b91c1c, #ef4444)",text:"#ffffff",tag:"HALK"},"S SPORT 1 HD":{bg:"linear-gradient(135deg, #065f46, #10b981)",text:"#ffffff",tag:"S SPORT 1"},"S SPORT 2 HD":{bg:"linear-gradient(135deg, #047857, #34d399)",text:"#ffffff",tag:"S SPORT 2"},"BEIN SPORTS HABER HD":{bg:"linear-gradient(135deg, #4c1d95, #7c3aed)",text:"#ffffff",tag:"BEIN HABER"},"BEIN SPORTS 3 HD":{bg:"linear-gradient(135deg, #3b0764, #6d28d9)",text:"#ffffff",tag:"BEIN 3"},"SPOR SMART 1 HD":{bg:"linear-gradient(135deg, #c2410c, #f97316)",text:"#ffffff",tag:"SMART 1"},"SPOR SMART 2 HD":{bg:"linear-gradient(135deg, #9a3412, #ea580c)",text:"#ffffff",tag:"SMART 2"},"EURO SPORT 1 HD":{bg:"linear-gradient(135deg, #1e3a8a, #2563eb)",text:"#ffffff",tag:"EURO 1"},"EURO SPORT 2 HD":{bg:"linear-gradient(135deg, #172554, #1d4ed8)",text:"#ffffff",tag:"EURO 2"},"TIVIBU SPOR 1 HD":{bg:"linear-gradient(135deg, #0284c7, #06b6d4)",text:"#ffffff",tag:"TİVİBU 1"},"TIVIBU SPOR 2 HD":{bg:"linear-gradient(135deg, #0369a1, #0284c7)",text:"#ffffff",tag:"TİVİBU 2"},"TIVIBU SPOR 3 HD":{bg:"linear-gradient(135deg, #075985, #0369a1)",text:"#ffffff",tag:"TİVİBU 3"},"FX KANALI HD":{bg:"linear-gradient(135deg, #18181b, #27272a)",text:"#fbbf24",tag:"FX"},"SINEMA TV HD":{bg:"linear-gradient(135deg, #713f12, #a16207)",text:"#fef08a",tag:"SINEMA"},"NATIONAL GEOGRAPHIC HD":{bg:"linear-gradient(135deg, #000000, #18181b)",text:"#fbbf24",tag:"NAT GEO"},"DISCOVERY CHANNEL HD":{bg:"linear-gradient(135deg, #0284c7, #06b6d4)",text:"#ffffff",tag:"DISCOVERY"},"DMAX HD":{bg:"linear-gradient(135deg, #111827, #1f2937)",text:"#38bdf8",tag:"DMAX"},"TLC HD":{bg:"linear-gradient(135deg, #831843, #db2777)",text:"#ffffff",tag:"TLC"},"CARTOON NETWORK":{bg:"linear-gradient(135deg, #000000, #27272a)",text:"#ffffff",tag:"CARTOON"},"NICKELODEON HD":{bg:"linear-gradient(135deg, #ea580c, #f97316)",text:"#ffffff",tag:"NICK"}}[i.toUpperCase()]||{bg:"linear-gradient(135deg, #1e293b, #334155)",text:"#ffffff",tag:n},o=`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${a.bg.includes("#")&&a.bg.match(/#[a-f0-9]{6}/i)?.[0]||"#1e293b"}" />
        <stop offset="100%" stop-color="${a.bg.includes("#")&&a.bg.match(/(#[a-f0-9]{6})/gi)?.[1]||"#334155"}" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#bgGrad)" stroke="rgba(255,255,255,0.18)" stroke-width="2" />
    <text x="50%" y="46%" dominant-baseline="central" text-anchor="middle" fill="${a.text}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="26" letter-spacing="1">${n}</text>
    <rect x="20" y="78" width="80" height="22" rx="11" fill="rgba(0,0,0,0.4)" />
    <text x="50%" y="89" dominant-baseline="central" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="9" letter-spacing="1.2">${a.tag}</text>
  </svg>`;return`data:image/svg+xml;utf8,${encodeURIComponent(o)}`}const Ef=[{id:"all",name:"Tüm Kanallar",icon:"tv"},{id:"favorites",name:"⭐ Favorilerim",icon:"star"},{id:"national",name:"Ulusal & Sinema",icon:"home"},{id:"sports",name:"Spor VIP",icon:"trophy"},{id:"news",name:"Haber",icon:"newspaper"},{id:"doc",name:"Belgesel",icon:"compass"},{id:"kids",name:"Çocuk",icon:"smile"},{id:"music",name:"Müzik",icon:"music"}],Ra=[{id:"ch_trt1",name:"TRT 1",category:"national",logo:"/tv-logos/trt-1.png",quality:"1080p FHD",streamUrl:"https://tv-trt1.medya.trt.com.tr/master.m3u8"},{id:"ch_atv",name:"ATV",category:"national",logo:"/tv-logos/atv.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/atv/atv_1080p.m3u8"},{id:"ch_showtv",name:"Show TV",category:"national",logo:"/tv-logos/show-tv.png",quality:"1080p FHD",streamUrl:"https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/showtv/showtv.m3u8"},{id:"ch_nowtv",name:"NOW TV",category:"national",logo:"/tv-logos/now-tv.png",quality:"1080p FHD",streamUrl:"https://uycyyuuzyh.turknet.ercdn.net/nphindgytw/nowtv/nowtv.m3u8"},{id:"ch_startv",name:"Star TV",category:"national",logo:"/tv-logos/star-tv.png",quality:"1080p FHD",streamUrl:"https://dygvideo.dygdigital.com/live/hls/startv4puhu/live.m3u8"},{id:"ch_kanald",name:"Kanal D",category:"national",logo:"/tv-logos/kanal-d.png",quality:"1080p FHD",streamUrl:"https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/kanald/kanald.m3u8"},{id:"ch_tv8",name:"TV8",category:"national",logo:"/tv-logos/tv8.png",quality:"480p",streamUrl:"https://rkhubpaomb.turknet.ercdn.net/fwjkgpasof/tv8/tv8_480p.m3u8"},{id:"ch_cnbce",name:"CNBC-e",category:"national",logo:"/tv-logos/cnbc-e.png",quality:"1080p FHD",streamUrl:"https://hnpsechtsc.turknet.ercdn.net/xpnvudnlsv/cnbc-e/cnbc-e.m3u8"},{id:"ch_a2",name:"A2 TV",category:"national",logo:"/tv-logos/a2.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/a2tv/a2tv.m3u8"},{id:"ch_kanal7",name:"Kanal 7",category:"national",logo:"/tv-logos/kanal-7.png",quality:"1080p FHD",streamUrl:"https://kanal7-live.daioncdn.net/kanal7/kanal7.m3u8"},{id:"ch_beyaztv",name:"Beyaz TV",category:"national",logo:"/tv-logos/beyaz-tv.png",quality:"1080p FHD",streamUrl:"https://beyaztv-live.daioncdn.net/beyaztv/beyaztv.m3u8"},{id:"ch_teve2",name:"Teve2",category:"national",logo:"/tv-logos/teve2.png",quality:"1080p FHD",streamUrl:"https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/teve2/teve2.m3u8"},{id:"ch_tv360",name:"TV 360",category:"national",logo:"/tv-logos/tv-360.png",quality:"1080p FHD",streamUrl:"https://turkmedya-live.ercdn.net/tv360/tv360.m3u8"},{id:"ch_trthaber",name:"TRT Haber",category:"news",logo:"/tv-logos/trt-haber.png",quality:"1080p FHD",streamUrl:"https://tv-trthaber.medya.trt.com.tr/master.m3u8"},{id:"ch_ahaber",name:"A Haber",category:"news",logo:"/tv-logos/a-haber.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/ahaber/ahaber.m3u8"},{id:"ch_ntv",name:"NTV",category:"news",logo:"/tv-logos/ntv.png",quality:"1080p FHD",streamUrl:"https://dygvideo.dygdigital.com/live/hls/ntv4puhu/live.m3u8"},{id:"ch_haberturk",name:"Habertürk",category:"news",logo:"/tv-logos/haberturk.png",quality:"1080p FHD",streamUrl:"https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/haberturktv/haberturktv.m3u8"},{id:"ch_halktv",name:"Halk TV",category:"news",logo:"/tv-logos/halk-tv.png",quality:"1080p FHD",streamUrl:"https://halktv-live.daioncdn.net/halktv/halktv.m3u8"},{id:"ch_tele1",name:"Tele1",category:"news",logo:"/tv-logos/tele1.png",quality:"1080p FHD",streamUrl:"https://tele1-live.ercdn.net/tele1/tele1.m3u8"},{id:"ch_tv100",name:"TV 100",category:"news",logo:"/tv-logos/tv100.png",quality:"1080p FHD",streamUrl:"https://tv.ensonhaber.com/tv100/tv100.m3u8"},{id:"ch_bloomberg",name:"Bloomberg HT",category:"news",logo:"/tv-logos/bloomberg-ht.png",quality:"1080p FHD",streamUrl:"https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/bloomberght/bloomberght.m3u8"},{id:"ch_tv24",name:"24 TV",category:"news",logo:"/tv-logos/tv24.png",quality:"1080p FHD",streamUrl:"https://tv.ensonhaber.com/tv24/tv24.m3u8"},{id:"ch_ulketv",name:"Ülke TV",category:"news",logo:"/tv-logos/ulke-tv.png",quality:"1080p FHD",streamUrl:"https://livetv.radyotvonline.net/kanal7live/ulketv/playlist.m3u8"},{id:"tvr_ch_141",tvrId:"141",isTvr:!0,name:"S SPORT 1 HD",category:"sports",logo:"/tv-logos/s-sport-1.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://mariuannastluisborg.autos/hls/ss11/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_140",tvrId:"140",isTvr:!0,name:"S SPORT 2 HD",category:"sports",logo:"/tv-logos/s-sport-2.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://mariuannastluisborg.autos/hls/ss22/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_165",tvrId:"165",isTvr:!0,name:"Bein Sports Haber HD",category:"sports",logo:"/tv-logos/bein-sports-haber.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/bshaber/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_147",tvrId:"147",isTvr:!0,name:"Bein Sports 3 HD",category:"sports",logo:"/tv-logos/bein-sports-3.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://mariuannastluisborg.autos/hls/bein3/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_139",tvrId:"139",isTvr:!0,name:"Spor Smart 1 HD",category:"sports",logo:"/tv-logos/spor-smart-1.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sporsmart/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_138",tvrId:"138",isTvr:!0,name:"Spor Smart 2 HD",category:"sports",logo:"/tv-logos/spor-smart-2.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sporsmart2/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_137",tvrId:"137",isTvr:!0,name:"Euro Sport 1 HD",category:"sports",logo:"/tv-logos/eurosport-1.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://mariuannastluisborg.autos/hls/euro1/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_135",tvrId:"135",isTvr:!0,name:"Euro Sport 2 HD",category:"sports",logo:"/tv-logos/eurosport-2.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://mariuannastluisborg.autos/hls/euro2/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_134",tvrId:"134",isTvr:!0,name:"Tivibu Spor 1 HD",category:"sports",logo:"/tv-logos/tivibu-spor.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/tivibu1/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_133",tvrId:"133",isTvr:!0,name:"Tivibu Spor 2 HD",category:"sports",logo:"/tv-logos/tivibu-spor.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/tivibu2/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_132",tvrId:"132",isTvr:!0,name:"Tivibu Spor 3 HD",category:"sports",logo:"/tv-logos/tivibu-spor.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/tivibu3/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"ch_trtspor",name:"TRT Spor",category:"sports",logo:"/tv-logos/trt-spor.png",quality:"1080p FHD",streamUrl:"https://tv-trtspor1.medya.trt.com.tr/master.m3u8"},{id:"ch_trtspor2",name:"TRT Spor Yıldız",category:"sports",logo:"/tv-logos/trt-spor-yildiz.png",quality:"1080p FHD",streamUrl:"https://tv-trtspor2.medya.trt.com.tr/master.m3u8"},{id:"ch_aspor",name:"A Spor",category:"sports",logo:"/tv-logos/a-spor.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/aspor/aspor.m3u8"},{id:"tvr_ch_128",tvrId:"128",isTvr:!0,name:"FB TV HD",category:"sports",logo:"/tv-logos/fb-tv.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/fbtv/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_127",tvrId:"127",isTvr:!0,name:"NBA TV HD",category:"sports",logo:"/tv-logos/nba-tv.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/nbatv/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_126",tvrId:"126",isTvr:!0,name:"HT Spor HD",category:"sports",logo:"/tv-logos/ht-spor.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/htspor/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_121",tvrId:"121",isTvr:!0,name:"Ekol Sport HD",category:"sports",logo:"/tv-logos/ekol-sport.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/ekolsport/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_65",tvrId:"65",isTvr:!0,name:"FX Kanalı HD",category:"national",logo:"/tv-logos/fx.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/fx/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_61",tvrId:"61",isTvr:!0,name:"Sinema TV HD",category:"national",logo:"/tv-logos/sinema-tv.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinema/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_60",tvrId:"60",isTvr:!0,name:"Sinema TV 2 HD",category:"national",logo:"/tv-logos/sinema-tv-2.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinema2/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_59",tvrId:"59",isTvr:!0,name:"Sinema TV Aksiyon HD",category:"national",logo:"/tv-logos/sinema-aksiyon.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinemaaksiyon2/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_57",tvrId:"57",isTvr:!0,name:"Sinema TV Komedi HD",category:"national",logo:"/tv-logos/sinema-komedi.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinemakomedi/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_56",tvrId:"56",isTvr:!0,name:"Sinema TV Yerli HD",category:"national",logo:"/tv-logos/sinema-yerli.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinemayerli/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_55",tvrId:"55",isTvr:!0,name:"Sinema TV Aile HD",category:"national",logo:"/tv-logos/sinema-aile.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinemaaile/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_53",tvrId:"53",isTvr:!0,name:"Sinema TV 1001 HD",category:"national",logo:"/tv-logos/sinema-1001.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinema1001/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_52",tvrId:"52",isTvr:!0,name:"Sinema TV 1002 HD",category:"national",logo:"/tv-logos/sinema-1002.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinema1002/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_89",tvrId:"89",isTvr:!0,name:"National Geographic HD",category:"doc",logo:"/tv-logos/national-geographic.png",quality:"1080p VIP",streamUrl:""},{id:"tvr_ch_88",tvrId:"88",isTvr:!0,name:"Nat Geo Wild HD",category:"doc",logo:"/tv-logos/nat-geo-wild.png",quality:"1080p VIP",streamUrl:""},{id:"tvr_ch_87",tvrId:"87",isTvr:!0,name:"History Channel HD",category:"doc",logo:"/tv-logos/history.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/history/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_86",tvrId:"86",isTvr:!0,name:"BBC Earth HD",category:"doc",logo:"/tv-logos/bbc-earth.svg",quality:"1080p VIP",streamUrl:""},{id:"tvr_ch_79",tvrId:"79",isTvr:!0,name:"Discovery Channel HD",category:"doc",logo:"/tv-logos/discovery.png",quality:"1080p VIP",streamUrl:""},{id:"tvr_ch_78",tvrId:"78",isTvr:!0,name:"Discovery Science HD",category:"doc",logo:"/tv-logos/discovery-science.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/discs/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_81",tvrId:"81",isTvr:!0,officialLiveId:"dmax",name:"DMAX HD",category:"doc",logo:"/tv-logos/dmax.png",quality:"1080p",streamUrl:"/api/live_tv_stream?channel=dmax"},{id:"tvr_ch_83",tvrId:"83",isTvr:!0,officialLiveId:"tlc",name:"TLC HD",category:"doc",logo:"/tv-logos/tlc.png",quality:"1080p",streamUrl:"/api/live_tv_stream?channel=tlc"},{id:"tvr_ch_85",tvrId:"85",isTvr:!0,name:"Tarih TV HD",category:"doc",logo:"/tv-logos/tarih-tv.svg",quality:"1080p VIP",streamUrl:""},{id:"tvr_ch_84",tvrId:"84",isTvr:!0,name:"DocuBox HD",category:"doc",logo:"/tv-logos/docubox.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/docubox/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_32",tvrId:"32",isTvr:!0,name:"Love Nature 4K",category:"doc",logo:"/tv-logos/love-nature.png",quality:"1080p VIP",streamUrl:""},{id:"tvr_ch_30",tvrId:"30",isTvr:!0,name:"Viasat History HD",category:"doc",logo:"/tv-logos/viasat-history.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/history/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"ch_trtbelgesel",name:"TRT Belgesel",category:"doc",logo:"/tv-logos/trt-belgesel.png",quality:"1080p FHD",streamUrl:"https://tv-trtbelgesel.medya.trt.com.tr/master.m3u8"},{id:"ch_tgrtbelgesel",name:"TGRT Belgesel",category:"doc",logo:_t("TGRT Belgesel"),quality:"1080p FHD",streamUrl:"https://b01c02nl.mediatriple.net/videoonlylive/mtsxxkzwwuqtglive/broadcast_5fe462afc6a0e.smil/playlist.m3u8"},{id:"ch_ciftcitv",name:"Çiftçi TV",category:"doc",logo:_t("Çiftçi TV"),quality:"720p",streamUrl:"https://live.artidijitalmedya.com/artidijital_ciftcitv/ciftcitv/chunks.m3u8"},{id:"ch_kanalv",name:"Kanal V",category:"doc",logo:_t("Kanal V"),quality:"720p",streamUrl:"https://live.artidijitalmedya.com/artidijital_kanalv/kanalv/chunks.m3u8"},{id:"tvr_ch_36",tvrId:"36",isTvr:!0,name:"Cartoon Network",category:"kids",logo:"/tv-logos/cartoon-network.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/cartoonnetwork/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_35",tvrId:"35",isTvr:!0,name:"Nickelodeon HD",category:"kids",logo:"/tv-logos/nickelodeon.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("http://fl1.moveonjoy.com/NICKELODEON/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_33",tvrId:"33",isTvr:!0,name:"Disney Junior",category:"kids",logo:"/tv-logos/disney-channel.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://saran-live.ercdn.net/disneyjunior/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"ch_trtcocuk",name:"TRT Çocuk",category:"kids",logo:"/tv-logos/trt-cocuk.png",quality:"1080p FHD",streamUrl:"https://tv-trtcocuk.medya.trt.com.tr/master.m3u8"},{id:"ch_minikago",name:"Minika GO",category:"kids",logo:"/tv-logos/minika-go.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/minikago/minikago.m3u8"},{id:"ch_trtmuzik",name:"TRT Müzik",category:"music",logo:"/tv-logos/trt-muzik.png",quality:"480p",streamUrl:"https://tv-trtmuzik.medya.trt.com.tr/master_480.m3u8"},{id:"ch_kralpop",name:"Kral Pop",category:"music",logo:"/tv-logos/kral-pop.png",quality:"1080p FHD",streamUrl:"https://dygvideo.dygdigital.com/live/hls/kralpoptv/live.m3u8"},{id:"ch_powerturk",name:"Power Türk",category:"music",logo:"/tv-logos/powerturk.png",quality:"1080p FHD",streamUrl:"https://powerlive.daioncdn.net/powerturktv/powerturktv.m3u8"},{id:"ch_dreamturk",name:"Dream Türk",category:"music",logo:"/tv-logos/dream-turk.png",quality:"1080p FHD",streamUrl:"https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/dreamturk/dreamturk.m3u8"},{id:"ch_tempotv",name:"Tempo TV",category:"music",logo:_t("Tempo TV"),quality:"720p",streamUrl:"https://live.artidijitalmedya.com/artidijital_tempotv/tempotv/chunks.m3u8"}],Tf=new Set(["hd","full","izle","seyret","film","dizi","anime","turkce","dublaj","altyazili","sezon","bolum","fragman","filmekseni","ekseni","sezonlukdizi","yabancidizi","dizipal","dizibal"]);function ol(e){return(e||"").toString().normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("tr-TR").replace(/[ıİ]/g,"i").replace(/\bs\d{1,2}\s*e\d{1,3}\b/g," ").replace(/\b(?:sezon|bolum)\s*\d+\b/g," ").replace(/\b\d+\s*(?:sezon|bolum)\b/g," ").replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(t=>t&&!Tf.has(t)&&!/^(?:19|20)\d{2}$/.test(t)).join(" ").trim()}function Af(e,t){if(e===t)return 0;if(!e.length)return t.length;if(!t.length)return e.length;const i=Array.from({length:t.length+1},(n,r)=>r);for(let n=1;n<=e.length;n++){let r=i[0];i[0]=n;for(let a=1;a<=t.length;a++){const o=i[a];i[a]=Math.min(i[a]+1,i[a-1]+1,r+(e[n-1]===t[a-1]?0:1)),r=o}}return i[t.length]}function Cf(e,t){const i=ol(e),n=ol(t);return!i||!n?0:i===n?1:1-Af(i,n)/Math.max(i.length,n.length)}function os(e,t,i=.9){return(Array.isArray(t)?t:[t]).filter(Boolean).some(r=>Cf(e,r)>=i)}function qm(e){return e?(e.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i)?.[1]||e.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g," ")||e.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||"").replace(/\s+\d+\s*\.?\s*sezon\b[\s\S]*$/i,"").replace(/\s+[-|]\s*(?:sezonluk\s*dizi|sezonlukdizi|filmekseni|yabanci\s*dizi)[\s\S]*$/i,"").trim():""}const Lf="3508611138826751fdf77beaa6f93eb93fd27e6a5acb910e7aad22665513dd6e",If="666482389dc76bfa57068407418f7dac9f6c14b6868856b169165b9fac7d812e",ci="4F5A9C3D9A86FA54EACEDDD635185/c3c5bd17-e37b-4b94-a944-8a3688a30452",Rf="aLhsnd71BqsMC_HZoT8MR_TrfZS1_WcAzYT5nROaUKI",$f="MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDq5iorf3BOWNqObZFRyco/sa7GrDO5r094yhO1FsWRvwoTRneD1ryv+yVLwJrr0IOmjhD2hgyErvs6XRhAmNa18fcMlHJqHlghHA0dt2FnkFlqlZ029/w1inZ8+g5XFjffNp8Xb5T44PrsowlI5Mjfe0JpkHCN20tLkmGdMUes9yQNbKwpUXvBPq/bLYn8IJNoR/kP/4mis7mMeRzWgIupc9AlFx6HH7IZ6NfYmyqDdo7xdSg+WNl/rcuYcPccuN6dIhqWeceSOFiChaGHJMtuEzbHHefRqbK529eNHVTpUmRtfaZu2a+DRXkoz2TU1KCrnSDuNztvlKjiztiJZMdlAgMBAAECggEACCjTmSw1lfsfKGhk7l7gkCLXa95Kc65Dx/HZCmbOmRf2PSIq/6DjcAd8zatUllFpaU0xCKcyYx+C6Y2XTJMijjJn/v9fFBGWxRuo1vnqP8MzX/Dvg5vMnn1/TSsQeXTznuTSVOmS1qxV+wdUyLvtwFmTPoB+cGcIMAlXK7MtBrSD9kCRcpJZgFNUILhn6ISm9NpaqU+5xBBuJRsXaMDvSUTHi1IKK2ZUneetFAgg6BVE5StmORBjMgXfNRIsD+oOHUvtsEczcHnAP2hW19I0lXfwnLhaAicKIECCDpn6cwfBtQWnSDSENCLMemM2O8KYvAizBW4ET3BZBqSDrZEzRwKBgQD/9o7qbE2LEJ19Mkg+4PTqMJ06bFWKUvUB3JuS4Iu/wy9u6tAU7uQySo9vSDDclG8TaDjkz6c2eTmDy7LdFESwLgiHV6cmpm0sieoTMaz1pVkpykifQo1fv2Q60t/co6oEyUWfmdk3iaK6j3MFhjqRpkmZcUYvBYyuRUv8ewKtcwKBgQDq7tRYL2c6cIznwqTJdLuap3eFRP21ymjV/TTp2DrZtVevw9rNYflDK88mIxZdbbAqPT10zbRc3UnqeE2+76UKBAodUJpSPXg2WvA0hZe57q1VnU7gQhMgvDWRPrTG7qbij+FnRtPHWZ1HGLFfl2DSDnFEVsJo2xXQjw5vMTOBxwKBgQDlbKQQ7t5aRZxD+WvUIGKl/skO8seBYnYFIy226tmYGmVLr+Cuwql7gmUqQ7S4Ibul04cbYBzqsKGixlQd4OroV3qBhUlnVUkJ4NwUNDRpQbm3wX5ycX6yUaSPLTBGXdQo0hc7xPRz2UQooCdizjt1DW1uwZ88ymacVbSUK9XsjQKBgGTNhR8xd8GDeXIX+kzWYYjCQm5UY+gUqVboBkQwG1A+lxk7mC5301QXABMFCxubbPMyw6PSf4k5CfYpGHLMsKvTf+OEKjMPXP01l8txZuDIoGcT0Dw5Hav2FaX0meyhicm8oqKFqWjn8qwG1FSHx2tZ9w+zikcjegC64R6kpc0RAoGAO4/tqaXM5CUUWtHanK/1j6KYbFqsKL13FeqIr8TprF4LXpzrzFAPMCmWL6XFq8JZqZj/KNjH9vvt9f7/9QMvI4nZ+0vXihRqdX7LO+XliGRhuXjHp3RlUU4s8eJt9Af7PCFWFX0gwfM8SnkVUTkE3tOQHgk7hM3PUOPH0yZ+gQ8=",Mf="MIIDDDCCAfSgAwIBAgIJYFwVX3W1KCXxMA0GCSqGSIb3DQEBCwUAMBgxFjAUBgNVBAMMDWF0dGVzdF9yc2FfdjEwHhcNMjYwOTA4MTUwMjMyWhcNMjcwOTA4MTUwMjMyWjAYMRYwFAYDVQQDDA1hdHRlc3RfcnNhX3YxMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6uYqK39wTljajm2RUcnKP7Guxqwzua9PeMoTtRbFkb8KE0Z3g9a8r_slS8Ca69CDpo4Q9oYMhK77Ol0YQJjWtfH3DJRyah5YIRwNHbdhZ5BZapWdNvf8NYp2fPoOVxY33zafF2-U-OD67KMJSOTI33tCaZBwjdtLS5JhnTFHrPckDWysKVF7wT6v2y2J_CCTaEf5D_-JorO5jHkc1oCLqXPQJRcehx-yGejX2Jsqg3aO8XUoPljZf63LmHD3HLjenSIalnnHkjhYgoWhhyTLbhM2xx3n0amyudvXjR1U6VJkbX2mbtmvg0V5KM9k1NSgq50g7jc7b5So4s7YiWTHZQIDAQABo1kwVzAMBgNVHRMBAf8EAjAAMA4GA1UdDwEB_wQEAwIFoDAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwGAYDVR0RBBEwD4INYXR0ZXN0X3JzYV92MTANBgkqhkiG9w0BAQsFAAOCAQEAREcHgi7mZGgOpu1jBzN89IJIdMSRjYI5AYwhePByZy7U4SOeqq5WTXPsOZdUjGyib1CJzvs44ro8_L9hLfeJCzNTRk9yyAt_EJ6QHAqdyMIBwNSSb3wDg6N7T4x4MJrgoHJ7uRf2iGEdMfazb2aZFyHQjyt4paUCrix5jt7FXY_02pyEQWPLYQb8U6nf8strd4nNdrm9EPAEF7zY7ZXD5L8egXvTkdmvsBRU5OQLftw1JaPkLu85zMQ2hZtscmCQ2ImxxwBlUqS7V_QmaMFHkdJrWQdXF7vU2Ws0qv3qBU7-FJgqGUSuDMFw7sMeeWuVKvg7WjSxolwPZrqIo6ZSUA";function Pf(e){let t="";for(let i=0;i<e.length;i++)t+=String.fromCharCode(e[i]);return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"")}function Bf(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");for(;t.length%4;)t+="=";const i=atob(t),n=new Uint8Array(i.length);for(let r=0;r<i.length;r++)n[r]=i.charCodeAt(r);return n}function Df(e){const t=new Uint8Array(e.length/2);for(let i=0;i<t.length;i++)t[i]=parseInt(e.substr(i*2,2),16);return t}function Jc(e){return Array.from(e).map(t=>t.toString(16).padStart(2,"0")).join("")}async function zf(e){const t=new TextEncoder().encode(e),i=await crypto.subtle.digest("SHA-256",t);return Jc(new Uint8Array(i))}async function Of(e,t){const i=new TextEncoder,n=await crypto.subtle.importKey("raw",i.encode(e),{name:"HMAC",hash:"SHA-256"},!1,["sign"]),r=await crypto.subtle.sign("HMAC",n,i.encode(t));return Jc(new Uint8Array(r))}async function ls(e,t,i=""){const n=Math.floor(Date.now()/1e3).toString(),r=typeof crypto.randomUUID=="function"?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,l=>{const d=Math.random()*16|0;return(l==="x"?d:d&3|8).toString(16)}),a=await zf(i),o=`${e}
${t}
${n}
${r}
${a}`,s=await Of(Lf,o);return{"user-agent":"okhttp/4.12.0","X-Timestamp":n,"X-Nonce":r,"X-Signature":s,"X-App-Version":"110","X-Client-Id":"rectv-android"}}let Fn=null;async function Nf(){if(Fn)return Fn;const e=atob($f),t=new Uint8Array(e.length);for(let i=0;i<e.length;i++)t[i]=e.charCodeAt(i);return Fn=await crypto.subtle.importKey("pkcs8",t,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},!1,["sign"]),Fn}let Ei=null,Un=0;const Hf=typeof window>"u";function cs(e){return Hf?`https://a.prectv70.lol/api${e}`:`/api/rtv${e}`}let ll=0;async function qf(){const e=Math.floor(Date.now()/1e3);if(Ei&&Un>e+120)return Ei;if(typeof localStorage<"u"){const t=localStorage.getItem("rectv_jwt_token"),i=parseInt(localStorage.getItem("rectv_jwt_exp")||"0",10);if(t&&i>e+120)return Ei=t,Un=i,t}if(Date.now()-ll<3e5)return null;try{const i={...await ls("GET","/api/attest/nonce",""),"x-rtv-path":"/attest/nonce"},n=await fetch(cs("/attest/nonce"),{method:"GET",headers:i});if(!n.ok)throw new Error(`Nonce request failed with status ${n.status}`);const a=(await n.json()).nonce;if(!a)throw new Error("Empty nonce returned");const o=Bf(a),s=await Nf(),l=await crypto.subtle.sign("RSASSA-PKCS1-v1_5",s,o),d=Pf(new Uint8Array(l)),p="/api/attest/verify",h=JSON.stringify({certChain:[Mf],nonce:a,pkg:"com.rectv.shot",proof:d,sig:Rf}),f={...await ls("POST",p,h),"x-rtv-path":"/attest/verify","Content-Type":"application/json"},b=await fetch(cs("/attest/verify"),{method:"POST",headers:f,body:h});if(!b.ok)throw new Error(`Verify attestation failed with status ${b.status}`);const v=await b.json();if(!v.jwt)throw new Error("Verify did not return JWT");if(Ei=v.jwt,Un=v.exp||e+7200,typeof localStorage<"u")try{localStorage.setItem("rectv_jwt_token",Ei),localStorage.setItem("rectv_jwt_exp",Un.toString())}catch{}return Ei}catch{return ll=Date.now(),null}}let jn=null;async function Ff(){if(jn)return jn;const e=Df(If);return jn=await crypto.subtle.importKey("raw",e,{name:"AES-GCM"},!1,["decrypt"]),jn}async function ds(e){if(!e)return"";if(e.startsWith("http://")||e.startsWith("https://"))return e;try{const t=atob(e),i=new Uint8Array(t.length);for(let l=0;l<t.length;l++)i[l]=t.charCodeAt(l);const n=i.slice(0,12),r=i.slice(12),a=await Ff(),o=await crypto.subtle.decrypt({name:"AES-GCM",iv:n,tagLength:128},a,r);return new TextDecoder("utf-8").decode(o)}catch{return""}}async function di(e,t="GET",i=""){let n=null;try{n=await qf()}catch{}const r=`/api${e}`,o={...await ls(t,r,i),"x-rtv-path":e,...n?{Authorization:`Bearer ${n}`}:{},...i?{"Content-Type":"application/json"}:{}};try{const s=await fetch(cs(e),{method:t,headers:o,signal:AbortSignal.timeout(6e3),...i?{body:i}:{}});if(s.ok)return await s.json()}catch{}return null}async function Fm({type:e="movie",title:t="",originalTitle:i="",season:n=1,episode:r=1,year:a=null}){const o=(t||i||"").trim();if(!o)return[];const s=parseInt(n,10)||1,l=parseInt(r,10)||1;try{let d=await di(`/search/${encodeURIComponent(o)}/${ci}/`);if((!d||!Array.isArray(d.posters)||d.posters.length===0)&&i&&i.toLowerCase()!==o.toLowerCase()&&(d=await di(`/search/${encodeURIComponent(i.trim())}/${ci}/`)),!d||!Array.isArray(d.posters)||d.posters.length===0)return[];const p=[o,i].filter(Boolean),h=e==="movie";let f=null;const b=y=>{if(!y)return!1;if(os(y,p))return!0;const k=y.split(/\s*[-/:]\s*/).filter(Boolean);for(const m of k)if(os(m,p))return!0;return!1};for(const y of d.posters)if((h?y.type==="movie":y.type==="serie")&&b(y.title||y.name||"")){f=y;break}if(!f)return[];const v=[];if(h){if(Array.isArray(f.sources))for(const y of f.sources){if(!y.enc_url&&!y.url)continue;const k=y.enc_url?await ds(y.enc_url):y.url;if(!k||!k.startsWith("http"))continue;const m=`/api/hls_proxy?url=${encodeURIComponent(k)}&ref=https://a.prectv70.lol/`,E=(y.title||"").toLowerCase().includes("dublaj")||(f.label||"").toLowerCase().includes("dublaj")?"🇹🇷 TVR VIP (TR Dublaj)":"⚡ TVR VIP (TR Altyazı)";v.push({id:`tvr_movie_${f.id}_${y.id}`,name:E,displayName:E,badge:"⚡ TVR VIP",source:"TVR VIP",url:m,streamUrl:m,rawStreamUrl:k,quality:"1080p HD",isHls:!0,isDirectVideo:!0,priority:0,getUrl:()=>m})}}else{const y=await di(`/season/by/serie/${f.id}/${ci}/`);if(Array.isArray(y))for(const k of y){const m=(k.title||k.name||"").toLowerCase(),w=m.match(/(\d+)/)||[];if((w[1]?parseInt(w[1],10):parseInt(k.number||k.season_number||k.num||"0",10)||1)!==s)continue;const C=m.includes("dublaj")||(k.label||"").toLowerCase().includes("dublaj");let S=Array.isArray(k.episodes)?k.episodes:null;if(!S||S.length===0){const T=await di(`/episode/by/season/${k.id}/${ci}/`);Array.isArray(T)?S=T:T&&Array.isArray(T.episodes)&&(S=T.episodes)}if(!(!Array.isArray(S)||S.length===0))for(const T of S){const L=(T.title||T.name||"").toLowerCase().match(/(\d+)/)||[];if((L[1]?parseInt(L[1],10):parseInt(T.number||T.episode_number||T.num||"0",10)||1)!==l)continue;let O=Array.isArray(T.sources)?T.sources:Array.isArray(T.videos)?T.videos:Array.isArray(T.streams)?T.streams:[];if(O.length===0&&T.id){const Y=await di(`/source/by/episode/${T.id}/${ci}/`);Array.isArray(Y)?O=Y:Y&&Array.isArray(Y.sources)&&(O=Y.sources)}for(const Y of O){const j=Y.enc_url||Y.encUrl||Y.encrypted_url,z=Y.url||Y.stream_url||Y.video||Y.link||Y.source;if(!j&&!z)continue;const B=j?await ds(j):z;if(!B||!B.startsWith("http"))continue;const W=`/api/hls_proxy?url=${encodeURIComponent(B)}&ref=https://a.prectv70.lol/`,te=C||(Y.title||Y.name||"").toLowerCase().includes("dublaj")?`🇹🇷 TVR S${s}E${l} (TR Dublaj)`:`⚡ TVR S${s}E${l} (TR Altyazı)`;v.push({id:`tvr_ep_${f.id}_${T.id||T.number}_${Y.id||B.slice(-8)}`,name:te,displayName:te,badge:"⚡ TVR VIP",source:"TVR VIP",url:W,streamUrl:W,rawStreamUrl:B,quality:"1080p HD",isHls:!0,isDirectVideo:!0,priority:0,getUrl:()=>W})}}}}return v}catch{return[]}}const $a=[{id:"tvr_ch_dmax",tvrId:"dmax",isDaion:!0,name:"DMAX",category:"national",logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/DMAX_Logo_2019.svg/200px-DMAX_Logo_2019.svg.png",quality:"HD Canlı",streamUrl:""},{id:"tvr_ch_tlc",tvrId:"tlc",isDaion:!0,name:"TLC",category:"national",logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/TLC_Logo.svg/200px-TLC_Logo.svg.png",quality:"HD Canlı",streamUrl:""}];async function Uf(){try{const e=await di(`/channel/by/filtres/0/0/0/${ci}/`);if(!Array.isArray(e))return[...$a];const t=new Map([[1,"sports"],[2,"doc"],[3,"national"],[4,"news"],[5,"music"],[6,"national"],[7,"kids"],[8,"national"]]),i=new Set,n=[];for(const r of e){const a=String(r.id||"").trim();if(!a||i.has(a)||String(r.playas||"1")==="0")continue;i.add(a);const o=Number(r.categories?.[0]?.id||0);n.push({id:`tvr_ch_${a}`,tvrId:a,isTvr:!0,name:r.title||r.name||`TVR ${a}`,category:t.get(o)||"national",logo:r.image||r.poster||"",quality:"1080p TVR",streamUrl:""})}for(const r of $a)n.some(o=>{const s=(o.name||"").toLowerCase();return s===r.name.toLowerCase()||s.includes(r.tvrId)})||n.push(r);return n}catch{return[...$a]}}const en=new Map,Kn=new Map,cl=2*60*1e3;async function Wn(e,{forceRefresh:t=!1}={}){if(!e)return null;const i=String(e).replace(/^tvr_ch_/,"");if(i==="dmax"||i==="tlc"||i==="81"||i==="83"){const a=i==="81"||i==="dmax"?"dmax":"tlc",o=`daion_${a}`,s=en.get(o);if(!t&&s&&s.expiresAt>Date.now())return s.url;try{const l=await fetch(`/api/live_tv_stream?channel=${a}&json=1`);if(l.ok){const d=await l.json(),p=d?.raw||d?.url;if(p)return en.set(o,{url:p,expiresAt:Date.now()+cl}),p}}catch{}if(i!=="81"&&i!=="83")return`/api/live_tv_stream?channel=${a}`}const n=en.get(i);if(!t&&n&&n.expiresAt>Date.now())return n.url;if(Kn.has(i))return Kn.get(i);t&&en.delete(i);const r=(async()=>{try{const a=await di(`/channel/by/${i}/${ci}/`);if(!a||!Array.isArray(a.sources))return null;const o=a.sources.find(d=>!d.locked&&(d.enc_url||d.url));if(!o)return null;const s=o.enc_url?await ds(o.enc_url):o.url;if(!s||!s.startsWith("http"))return null;const l=`/api/hls_proxy?url=${encodeURIComponent(s)}&ref=https://a.prectv70.lol/`;return en.set(i,{url:l,expiresAt:Date.now()+cl}),l}catch{return null}})();Kn.set(i,r);try{return await r}finally{Kn.delete(i)}}const Lr="cinepulse_epg_live_cache",Xc=30*60*1e3;let St=null,dl=0,Ma=!1,mn=null;const jf={ch_cnbce:[{start:"07:00",end:"10:00",title:"Sabah Piyasaları & Finans"},{start:"10:00",end:"14:00",title:"Piyasa Ekranı & Global Trendler"},{start:"14:00",end:"18:00",title:"Kapanışa Doğru"},{start:"18:00",end:"20:00",title:"The Simpsons"},{start:"20:00",end:"21:00",title:"Mad Men"},{start:"21:00",end:"23:00",title:"Game of Thrones Kuşağı"},{start:"23:00",end:"01:00",title:"Late Night Show"},{start:"01:00",end:"07:00",title:"Gece Finans & Belgesel"}],tvr_ch_141:[{start:"08:00",end:"11:00",title:"İtalya Serie A Goller"},{start:"11:00",end:"14:00",title:"EuroLeague Özel Kuşağı"},{start:"14:00",end:"17:00",title:"La Liga Günlüğü & Özetler"},{start:"17:00",end:"20:00",title:"Maç Önü & Canlı Stüdyo"},{start:"20:00",end:"23:00",title:"Canlı Futbol / Basketbol Karşılaşması"},{start:"23:00",end:"02:00",title:"Günün Analizi & Tartışma"},{start:"02:00",end:"08:00",title:"Premier Maç Tekrarları"}],tvr_ch_140:[{start:"08:00",end:"12:00",title:"Formula 1 Özel Kuşağı"},{start:"12:00",end:"15:00",title:"NBA Action & En İyi Hareketler"},{start:"15:00",end:"19:00",title:"Uluslararası Voleybol Ligi"},{start:"19:00",end:"22:00",title:"Canlı Basketbol / Tenis Karşılaşması"},{start:"22:00",end:"01:00",title:"Motorsporları Kuşağı"},{start:"01:00",end:"08:00",title:"Gecenin Tekrarları"}]},ul={sports:[{start:"06:00",end:"09:00",title:"Spor Bülteni & Günün Manşetleri"},{start:"09:00",end:"12:00",title:"Maç Özetleri & Goller Kuşağı"},{start:"12:00",end:"14:00",title:"Öğle Sporu & Transfer Raporu"},{start:"14:00",end:"17:00",title:"Uluslararası Ligler & Analiz"},{start:"17:00",end:"19:00",title:"Maç Önü & Stüdyo Analizi"},{start:"19:00",end:"21:30",title:"Canlı Karşılaşma / Canlı Yayın"},{start:"21:30",end:"23:45",title:"Dev Maç Özel Yayını"},{start:"23:45",end:"02:00",title:"Son Sayfa & Tartışma Programı"},{start:"02:00",end:"06:00",title:"Gecenin Maçları (Tekrar)"}],news:[{start:"06:00",end:"09:00",title:"Güne Başlarken & Sabah Raporu"},{start:"09:00",end:"12:00",title:"Ekonomi ve Politika Gündemi"},{start:"12:00",end:"14:00",title:"Gün Ortası Bülteni"},{start:"14:00",end:"17:00",title:"Sıcak Gelişmeler & Canlı Bağlantılar"},{start:"17:00",end:"19:00",title:"Akşam Bülteni & Manşetler"},{start:"19:00",end:"20:30",title:"Ana Haber Bülteni"},{start:"20:30",end:"23:30",title:"Türkiye'nin Nabzı & Açık Oturum"},{start:"23:30",end:"01:30",title:"Gece Raporu & Dünya Basını"},{start:"01:30",end:"06:00",title:"Gece Bülteni"}],doc:[{start:"06:00",end:"09:00",title:"Vahşi Yaşamın İzinde"},{start:"09:00",end:"12:00",title:"Evrenin Gizemleri ve Uzay"},{start:"12:00",end:"15:00",title:"Mega Yapılar & Mühendislik"},{start:"15:00",end:"18:00",title:"Tarihin Bilinmeyen Sayfaları"},{start:"18:00",end:"20:00",title:"Okyanusların Derinlikleri"},{start:"20:00",end:"22:00",title:"Büyük Kediler: Hayatta Kalma"},{start:"22:00",end:"00:30",title:"Dünyanın En Gizemli Keşifleri"},{start:"00:30",end:"06:00",title:"Gece Belgesel Kuşağı"}],kids:[{start:"06:00",end:"09:00",title:"Sabah Neşesi Çizgi Filmler"},{start:"09:00",end:"12:00",title:"Eğlenceli Maceralar & Kahramanlar"},{start:"12:00",end:"15:00",title:"Sevimli Dostlar & Bilim Zamanı"},{start:"15:00",end:"18:00",title:"Süper Kahramanlar Kuşağı"},{start:"18:00",end:"20:30",title:"Akşam Aile Sineması"},{start:"20:30",end:"22:30",title:"Fantastik Çizgi Dizi"},{start:"22:30",end:"06:00",title:"Gece Masalları"}],music:[{start:"06:00",end:"10:00",title:"Güne Enerjik Başla (Top 20 Pop)"},{start:"10:00",end:"14:00",title:"Hit Müzik & Radyo Şarkıları"},{start:"14:00",end:"18:00",title:"Trendler & En Çok Dinlenenler"},{start:"18:00",end:"21:00",title:"Akşam Ritimleri & Klip Kuşağı"},{start:"21:00",end:"23:30",title:"Canlı Akustik & Popüler Klipler"},{start:"23:30",end:"02:00",title:"Gece Chill & Deep House"},{start:"02:00",end:"06:00",title:"Kesintisiz Gece Müziği"}],national:[{start:"06:00",end:"09:00",title:"Sabah Programı & Magazin"},{start:"09:00",end:"12:00",title:"Gündüz Kuşağı Programı"},{start:"12:00",end:"14:00",title:"Gün Ortası & Yemek Programı"},{start:"14:00",end:"17:00",title:"Popüler Dizi Tekrar Kuşağı"},{start:"17:00",end:"19:00",title:"Yarışma Kuşağı"},{start:"19:00",end:"20:00",title:"Akşam Ana Haber"},{start:"20:00",end:"23:30",title:"Prime Time Sinema / Dizi"},{start:"23:30",end:"02:00",title:"Gece Sineması"},{start:"02:00",end:"06:00",title:"Gece Kuşağı"}]};function pl(e){if(!e||!e.includes(":"))return 0;const[t,i]=e.split(":").map(Number);return(t||0)*60+(i||0)}function Kf(){try{const e=(typeof window<"u"&&window.sessionStorage?sessionStorage.getItem(Lr):null)||(typeof window<"u"&&window.localStorage?localStorage.getItem(Lr):null);if(!e)return null;const t=JSON.parse(e);if(t&&t.channels&&Date.now()-(t.updatedAt||0)<12*3600*1e3)return t.channels}catch{}return null}function Wf(e){try{typeof window<"u"&&window.sessionStorage&&sessionStorage.setItem(Lr,JSON.stringify({updatedAt:Date.now(),channels:e})),typeof window<"u"&&window.localStorage&&localStorage.removeItem(Lr)}catch{}}async function hl(e=!1){const t=Date.now();if(!e&&St&&t-dl<Xc||Ma)return St;Ma=!0;try{let i=null;try{i=await fetch("/api/epg")}catch{}if((!i||!i.ok)&&(i=await fetch("/epg-data.json")),i&&i.ok){const n=await i.json();n&&n.channels&&Object.keys(n.channels).length>0&&(St=n.channels,dl=t,Wf(n.channels),window.dispatchEvent(new CustomEvent("epg-updated",{detail:{count:Object.keys(n.channels).length}})))}}catch{}finally{Ma=!1}return St}function Yf(){if(!St){const e=Kf();e&&(St=e)}hl(),mn===null&&(mn=setInterval(()=>{hl(!0)},Xc))}function Vf(){mn!==null&&(clearInterval(mn),mn=null)}function Yn(e){if(!e)return{title:"Canlı Yayın",timeRange:"Canlı Akış",start:"00:00",end:"23:59",progress:50,remainingMin:30,nextTitle:"Yayın Akışı"};const t=Date.now();if(St&&St[e.id]&&St[e.id].length>0){const a=St[e.id];for(let s=0;s<a.length;s++){const l=a[s];if(t>=l.startTs&&t<l.endTs){const d=Math.max(1,(l.endTs-l.startTs)/6e4),p=Math.max(0,(t-l.startTs)/6e4),h=Math.min(100,Math.max(0,Math.round(p/d*100))),f=Math.max(1,Math.round((l.endTs-t)/6e4)),b=a[s+1];return{title:l.title,timeRange:`${l.start} - ${l.end}`,start:l.start,end:l.end,progress:h,remainingMin:f,nextTitle:b?b.title:"Sonraki Program"}}}const o=a.find(s=>s.startTs>t);if(o)return{title:o.title,timeRange:`${o.start} - ${o.end}`,start:o.start,end:o.end,progress:5,remainingMin:Math.max(1,Math.round((o.endTs-t)/6e4)),nextTitle:"Yayın Başlamak Üzere"}}const i=new Date,n=i.getHours()*60+i.getMinutes();let r=jf[e.id];r||(r=ul[e.category]||ul.national);for(let a=0;a<r.length;a++){const o=r[a],s=pl(o.start);let l=pl(o.end);l<=s&&(l+=24*60);let d=n;if(s>l-24*60&&n<s&&n<l%(24*60)&&(d+=24*60),d>=s&&d<l){const p=l-s,h=d-s,f=Math.min(100,Math.max(0,Math.round(h/p*100))),b=Math.max(1,l-d),v=r[(a+1)%r.length];return{title:o.title,timeRange:`${o.start} - ${o.end}`,start:o.start,end:o.end,progress:f,remainingMin:b,nextTitle:v?v.title:"Sonraki Program"}}}return{title:`${e.name} Canlı Yayın`,timeRange:"Canlı Akış",start:"00:00",end:"23:59",progress:50,remainingMin:30,nextTitle:"Yayın Akışı Devam Ediyor"}}const Zc="cinepulse_live_favs";function fl(){try{const e=localStorage.getItem(Zc);return e?JSON.parse(e):[]}catch{return[]}}function Gf(e){try{localStorage.setItem(Zc,JSON.stringify(e))}catch{}}function Jf(){const e=Lt(),t=w=>String(w||"").toLocaleUpperCase("tr-TR").replace(/\b(?:HD|FHD|4K|KANALI)\b/g,"").replace(/[^A-ZÇĞİÖŞÜ0-9]/g,""),i=[...Ra],n=e?i.filter(w=>w.category==="kids"):i;let r=e?"kids":"all",a=e?n.find(w=>w.id==="ch_trtcocuk")||n[0]:i.find(w=>w.id==="ch_trt1")||i[0],o="",s=null,l=!1,d=1,p=null,h=null;function f(w){return fl().includes(w)}function b(w){let E=fl();E.includes(w)?(E=E.filter(C=>C!==w),Z("Favorilerden çıkarıldı","info")):(E.push(w),Z("Favorilere eklendi ⭐","success")),Gf(E),k()}function v(){return n.filter(w=>{let E=!0;r==="favorites"?E=f(w.id):r!=="all"&&(E=w.category===r);const C=!o||w.name.toLowerCase().includes(o.toLowerCase());return E&&C})}function y(w){return n.findIndex(E=>E.id===w.id)}let k=()=>{};return{html:`
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
              <img class="tv-pip-logo" id="tv-pip-logo" src="${a.logo}" alt="" onerror="this.onerror=null; this.src='${_t(a.name,a.category)}';" />
              <div class="tv-pip-info">
                <span class="tv-pip-name" id="tv-pip-name">${a.name}</span>
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
                <img id="tv-top-logo" class="tv-top-logo" src="${a.logo}" alt="" onerror="this.onerror=null; this.src='${_t(a.name,a.category)}';" />
              </div>
              <div class="tv-osd-text">
                <div class="tv-osd-ch-title">
                  <span id="tv-top-name">${a.name}</span>
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
              ${Ef.map(w=>`
                <button class="tv-cat-filter-btn ${w.id===r?"active":""}" data-cat="${w.id}">
                  <i data-lucide="${w.icon}" style="width:14px;height:14px;"></i>
                  <span>${w.name}</span>
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
  `,init:w=>{if(!w)return;Yf();const E=xf(),{setTimeout:C,clearTimeout:S,setInterval:T,clearInterval:I}=E,L=w.querySelector("#tv-video"),D=w.querySelector("#tv-screen"),O=w.querySelector("#tv-hero-player-section"),Y=w.querySelector("#tv-screen-placeholder"),j=w.querySelector("#tv-screen-backdrop");w.querySelector("#tv-osd-topbar");const z=w.querySelector("#tv-top-logo"),B=w.querySelector("#tv-top-name"),W=w.querySelector("#tv-top-num"),ie=w.querySelector("#tv-top-epg-title"),te=w.querySelector("#tv-top-epg-prog");w.querySelector("#tv-pip-header");const re=w.querySelector("#tv-pip-logo"),N=w.querySelector("#tv-pip-name"),ae=w.querySelector("#tv-pip-epg"),J=w.querySelector("#tv-pip-expand"),K=w.querySelector("#tv-pip-close"),ne=w.querySelector("#tv-osd"),de=w.querySelector("#tv-osd-logo"),G=w.querySelector("#tv-osd-name"),$=w.querySelector("#tv-osd-quality"),M=w.querySelector("#tv-osd-chnum"),H=w.querySelector("#tv-osd-epg-sub"),Q=w.querySelector("#tv-loading"),se=w.querySelector("#tv-error"),x=w.querySelector("#tv-retry-btn"),A=w.querySelector("#tv-error-next-btn"),q=w.querySelector("#tv-btn-play-pause"),ee=w.querySelector("#tv-btn-prev-ch"),ke=w.querySelector("#tv-btn-next-ch"),le=w.querySelector("#tv-btn-sync"),fe=w.querySelector("#tv-btn-mute"),Xe=w.querySelector("#tv-volume-slider"),Ze=w.querySelector("#tv-btn-reload"),Ue=w.querySelector("#tv-btn-fullscreen"),Re=w.querySelector("#tv-btn-quality"),De=w.querySelector("#tv-quality-badge"),Ne=w.querySelector("#tv-quality-menu"),Ye=w.querySelector("#tv-quality-options"),je=w.querySelector("#tv-btn-numpad"),oe=w.querySelector("#tv-numpad-modal"),g=w.querySelector("#tv-numpad-modal-backdrop"),c=w.querySelector("#tv-numpad-close"),u=w.querySelector("#tv-pad-display-val"),_=w.querySelector("#tv-pad-display-sub"),R=w.querySelector("#tv-numpad-hud"),P=w.querySelector("#tv-numpad-hud-digits"),F=w.querySelector("#tv-numpad-hud-name"),pe=w.querySelector("#tv-channel-grid"),Ie=w.querySelector("#tv-search"),xe=w.querySelector("#tv-search-clear"),ge=w.querySelector("#tv-category-strip"),Ee=w.querySelector("#tv-cat-prev"),Hs=w.querySelector("#tv-cat-next"),qs=w.querySelector("#tv-guide-count");function Cn(){const U=y(a)+1,X=Yn(a);B&&(B.textContent=a.name),W&&(W.textContent=`CH ${String(U).padStart(2,"0")}`),ie&&(ie.textContent=`${X.title} (${X.timeRange})`),te&&(te.textContent=`%${X.progress}`),z&&(z.src=a.logo,z.onerror=()=>{z.onerror=null,z.src=_t(a.name,a.category)}),N&&(N.textContent=a.name),ae&&(ae.textContent=`${X.title} (%${X.progress})`),re&&(re.src=a.logo,re.onerror=()=>{re.onerror=null,re.src=_t(a.name,a.category)})}function Fs(){Cn(),pe&&pe.querySelectorAll(".tv-grid-card").forEach(X=>{const ye=X.getAttribute("data-id"),be=i.find($e=>$e.id===ye);if(!be)return;const ce=Yn(be),ze=X.querySelector(".tv-epg-title"),Ae=X.querySelector(".tv-epg-time"),at=X.querySelector(".tv-epg-bar-fill"),he=X.querySelector(".tv-epg-pct");ze&&ze.textContent!==ce.title&&(ze.textContent=ce.title,ze.title=ce.title),Ae&&Ae.textContent!==ce.timeRange&&(Ae.textContent=ce.timeRange),at&&(at.style.width=`${ce.progress}%`),he&&he.textContent!==`%${ce.progress}`&&(he.textContent=`%${ce.progress}`)})}const Xr=()=>{Fs()};E.on(window,"epg-updated",Xr);let Us=T(()=>{if(!document.body.contains(w)){I(Us),window.removeEventListener("epg-updated",Xr);return}Fs()},2e4);function sd(){h&&S(h);const U=y(a),X=Yn(a);de&&(de.src=a.logo,de.onerror=()=>{de.onerror=null,de.src=_t(a.name,a.category)}),G&&(G.textContent=a.name),$&&($.textContent=a.quality),M&&(M.textContent=String(U+1).padStart(2,"0")),H&&(H.textContent=`📺 ${X.title} • %${X.progress} tamamlandı`),ne.classList.remove("hidden"),ne.classList.add("tv-osd-show"),h=C(()=>{ne.classList.remove("tv-osd-show"),ne.classList.add("tv-osd-hide"),C(()=>{ne.classList.add("hidden"),ne.classList.remove("tv-osd-hide")},350)},2500)}function Ln(){D.classList.add("user-active"),p&&S(p),p=C(()=>{D.classList.remove("user-active"),Ne&&Ne.classList.add("hidden")},3500)}D.addEventListener("mousemove",Ln),D.addEventListener("touchstart",Ln,{passive:!0}),j&&(j.addEventListener("click",U=>{U.stopPropagation(),D.classList.contains("user-active")?(D.classList.remove("user-active"),p&&S(p),Ne&&Ne.classList.add("hidden")):Ln()}),j.addEventListener("dblclick",U=>{U.stopPropagation(),Ue&&Ue.click()}));function Wi(U){U=Math.max(0,Math.min(1,U)),d=U,L.volume=U,Xe&&(Xe.value=U),U===0?(l=!0,L.muted=!0,fe&&(fe.innerHTML='<i data-lucide="volume-x" style="width:18px;height:18px;color:#ef4444;"></i>')):(l=!1,L.muted=!1,fe&&(fe.innerHTML='<i data-lucide="volume-2" style="width:18px;height:18px;"></i>')),V()}Xe&&Xe.addEventListener("input",U=>{Wi(parseFloat(U.target.value))}),fe&&fe.addEventListener("click",U=>{U.stopPropagation(),l?(Wi(d||.8),Z("Ses açıldı","info")):(L.muted=!0,l=!0,fe.innerHTML='<i data-lucide="volume-x" style="width:18px;height:18px;color:#ef4444;"></i>',V(),Z("Sessize alındı","info"))}),q&&q.addEventListener("click",U=>{U.stopPropagation(),L.paused?(L.play(),q.innerHTML='<i data-lucide="pause" style="width:18px;height:18px;"></i>'):(L.pause(),q.innerHTML='<i data-lucide="play" style="width:18px;height:18px;"></i>'),V()}),le&&le.addEventListener("click",U=>{U.stopPropagation(),s&&L.seekable&&L.seekable.length>0?(L.currentTime=L.seekable.end(L.seekable.length-1),L.play(),Z("Canlı yayına eşitlendi","info")):ti(a)});function Zr(U){if(!Ye||!De)return;if(!U||!U.levels||U.levels.length<=1){De.textContent=a.quality?a.quality.split(" ")[0]:"HD",Ye.innerHTML=`
            <button class="tv-quality-opt active" data-level="-1">
              <i data-lucide="check" style="width:13px;height:13px;color:#fbbf24;"></i>
              <span>Kaynak Kalite (${a.quality||"1080p"})</span>
            </button>
          `,V();return}const X=U.levels,ye=U.currentLevel;let be=`
          <button class="tv-quality-opt ${ye===-1?"active":""}" data-level="-1">
            ${ye===-1?'<i data-lucide="check" style="width:13px;height:13px;color:#fbbf24;"></i>':'<span style="width:13px;display:inline-block;"></span>'}
            <span>Otomatik (Adaptive)</span>
          </button>
        `;if(X.forEach((ce,ze)=>{const Ae=ce.height||(ce.attrs&&ce.attrs.RESOLUTION?ce.attrs.RESOLUTION.height:720),at=Ae>=1080?"1080p FHD":Ae>=720?"720p HD":Ae>=480?"480p SD":`${Ae}p`,he=ye===ze;be+=`
            <button class="tv-quality-opt ${he?"active":""}" data-level="${ze}">
              ${he?'<i data-lucide="check" style="width:13px;height:13px;color:#fbbf24;"></i>':'<span style="width:13px;display:inline-block;"></span>'}
              <span>${at}</span>
            </button>
          `}),Ye.innerHTML=be,ye===-1)De.textContent="AUTO";else if(X[ye]){const ce=X[ye].height;De.textContent=ce?`${ce}p`:"HD"}Ye.querySelectorAll(".tv-quality-opt").forEach(ce=>{ce.addEventListener("click",ze=>{ze.stopPropagation();const Ae=parseInt(ce.dataset.level,10);if(s){s.currentLevel=Ae,Zr(s),Ne&&Ne.classList.add("hidden");const at=ce.querySelector("span").textContent;Z(`Kalite ayarlandı: ${at}`,"success")}})}),V()}Re&&Ne&&(Re.addEventListener("click",U=>{U.stopPropagation(),Ne.classList.toggle("hidden"),Ln()}),E.on(document,"click",U=>{U.target.closest("#tv-quality-wrapper")||Ne.classList.add("hidden")}));let In=!1;function js(){if(!O||!Y||!D||document.fullscreenElement)return;const X=O.getBoundingClientRect().bottom<80;X&&L&&!L.paused&&!In?D.classList.contains("is-floating-pip")||(D.classList.add("is-floating-pip"),Y.classList.add("is-active"),Cn()):X||D.classList.contains("is-floating-pip")&&(D.classList.remove("is-floating-pip"),Y.classList.remove("is-active"),In=!1)}E.on(window,"scroll",js,{passive:!0}),J&&J.addEventListener("click",U=>{U.stopPropagation(),O&&O.scrollIntoView({behavior:"smooth",block:"start"})}),K&&K.addEventListener("click",U=>{U.stopPropagation(),In=!0,D.classList.remove("is-floating-pip"),Y.classList.remove("is-active")});let He="",Qr=null;function ea(U){if(U>=0&&U<i.length){const X=i[U];Z(`Kanal ${U+1}: ${X.name}`,"info"),ti(X),O&&O.scrollIntoView({behavior:"smooth",block:"start"})}else Z(`Kanal ${U+1} bulunamadı`,"warning");He="",R&&R.classList.add("hidden"),oe&&oe.classList.add("hidden")}function Ks(){if(!R||!P||!F)return;const U=parseInt(He,10),X=i[U-1];P.textContent=He.padStart(2,"0"),F.textContent=X?X.name:"Geçersiz Kanal",R.classList.remove("hidden"),u&&(u.textContent=He.padStart(2,"0")),_&&(_.textContent=X?X.name:"Geçersiz Kanal"),Qr&&S(Qr),Qr=C(()=>{He&&ea(U-1)},1300)}je&&oe&&je.addEventListener("click",U=>{U.stopPropagation(),He="",u&&(u.textContent="--"),_&&(_.textContent="Numara tuşlayın"),oe.classList.toggle("hidden")}),c&&c.addEventListener("click",()=>{oe.classList.add("hidden"),He=""}),g&&g.addEventListener("click",()=>{oe.classList.add("hidden"),He=""}),oe&&oe.querySelectorAll(".tv-num-key").forEach(U=>{U.addEventListener("click",X=>{X.stopPropagation();const ye=U.dataset.digit;if(ye==="clear")He="",u&&(u.textContent="--"),_&&(_.textContent="Numara tuşlayın");else if(ye==="ok"){if(He){const be=parseInt(He,10);ea(be-1)}}else He.length>=2&&(He=""),He+=ye,Ks()})});let Ke=0;async function ti(U){const X=++Ke;if(a=U,In=!1,Cn(),sd(),ld(),s){try{s.stopLoad(),s.detachMedia(),s.destroy()}catch{}s=null}if(L)try{L.pause(),L.removeAttribute("src"),L.load()}catch{}Q.classList.remove("hidden"),se.classList.add("hidden");const ye=()=>{Ke===X&&(Q.classList.add("hidden"),se.classList.add("hidden"))};L.addEventListener("loadeddata",ye,{once:!0}),C(()=>{L.removeEventListener("loadeddata",ye),Ke===X&&L.readyState<2&&Ve()},2e4);let be=!1,ce=0,ze=0,Ae=!1,at=!1;async function he(we,Ce=!0){if(!U.officialLiveId||Ce&&ce>=2)return!1;Ce&&(ce+=1),be=!0,Q.classList.remove("hidden"),se.classList.add("hidden");try{const Ht=rr(`/api/live_tv_stream?channel=${encodeURIComponent(U.officialLiveId)}&json=1&refresh=1&_=${Date.now()}`),ni=await fetch(Ht,{cache:"no-store",headers:{Accept:"application/json"}});if(!ni.ok)throw new Error(`Live resolver ${ni.status}`);const ri=await ni.json();if(Ke!==X)return!0;const Rn=ri?.url?rr(ri.url):"";if(!Rn)throw new Error("Live stream URL missing");if(U.streamUrl=Rn,Rn!==we||Ce)return It(Rn),!0}catch{}return!1}async function $e(we){if(U.officialLiveId)return he(we);if(be||!U.isTvr||!U.tvrId)return!1;be=!0,Q.classList.remove("hidden"),se.classList.add("hidden");try{const Ce=await Wn(U.tvrId,{forceRefresh:!0});if(Ke!==X)return!0;if(Ce&&Ce!==we)return U.streamUrl=Ce,It(Ce),!0}catch{}return!1}function Ve(){Ke===X&&(Q.classList.add("hidden"),se.classList.remove("hidden"))}function ki(we){if(Ae||!/^https?:\/\//i.test(we))return!1;Ae=!0;const Ce=`${new URL(we).origin}/`,Ht=`/api/hls_proxy?url=${encodeURIComponent(we)}&ref=${encodeURIComponent(Ce)}`;return U.streamUrl=Ht,It(Ht),!0}function It(we){if(Ke===X)if(we=rr(we),ii.isSupported()){if(s){try{s.stopLoad(),s.detachMedia(),s.destroy()}catch{}s=null}const Ce=new ii({enableWorker:!0,lowLatencyMode:!0,startLevel:0,capLevelToPlayerSize:!0,backBufferLength:10,maxBufferLength:8,maxMaxBufferLength:15,liveSyncDurationCount:2,liveMaxLatencyDurationCount:5,manifestLoadingTimeOut:12e3,manifestLoadingMaxRetry:1,manifestLoadingRetryDelay:350,levelLoadingTimeOut:14e3,levelLoadingMaxRetry:1,fragLoadingTimeOut:12e3});s=Ce,Ce.loadSource(we),Ce.attachMedia(L),Ce.on(ii.Events.MANIFEST_PARSED,()=>{if(Ke!==X){try{Ce.stopLoad(),Ce.detachMedia(),Ce.destroy()}catch{}return}Zr(Ce),L.play().catch(()=>{})}),Ce.on(ii.Events.ERROR,(Ht,ni)=>{if(!(Ke!==X||s!==Ce)&&ni.fatal)if(ni.type===ii.ErrorTypes.NETWORK_ERROR)U.officialLiveId?he(we).then(ri=>{ri||Ve()}):U.isTvr&&U.tvrId?$e(we).then(ri=>{!ri&&!ki(we)&&Ve()}):ze<1?(ze+=1,Q.classList.remove("hidden"),C(()=>{Ke===X&&s===Ce&&It(we)},700)):ki(we)||Ve();else if(ni.type===ii.ErrorTypes.MEDIA_ERROR)if(at)Ve();else{at=!0;try{Ce.recoverMediaError()}catch{Ve()}}else Ve()})}else L.canPlayType("application/vnd.apple.mpegurl")?(L.src=we,L.addEventListener("loadedmetadata",()=>{Ke===X&&(Zr(null),L.play().catch(()=>{}))},{once:!0}),L.addEventListener("error",()=>{Ke===X&&$e(we).then(Ce=>{!Ce&&!ki(we)&&Ve()})},{once:!0})):Ve()}let ii;try{ii=(await Ss(async()=>{const{default:we}=await import("./hls-BuERnqCp.js");return{default:we}},[],import.meta.url)).default}catch{Ve();return}Ke===X&&(U.officialLiveId?he("",!0).then(we=>{we||Ke!==X||he("",!0).then(Ce=>{!Ce&&Ke===X&&Ve()})}):U.isTvr&&U.tvrId&&!U.streamUrl?Wn(U.tvrId).then(we=>{Ke===X&&(we?(U.streamUrl=we,It(we)):Ve())}).catch(()=>{Ke===X&&Ve()}):(It(U.streamUrl),U.isTvr&&U.tvrId&&Wn(U.tvrId).then(we=>{we&&(U.streamUrl=we)}).catch(()=>{})),L.muted=l,L.volume=d)}function Yi(U){const X=v();if(X.length===0)return;const ye=X.findIndex(ce=>ce.id===a.id);let be;U==="prev"||U==="up"?be=ye<=0?X.length-1:ye-1:be=ye>=X.length-1?0:ye+1,ti(X[be])}ee&&ee.addEventListener("click",U=>{U.stopPropagation(),Yi("prev")}),ke&&ke.addEventListener("click",U=>{U.stopPropagation(),Yi("next")}),A&&A.addEventListener("click",()=>Yi("next")),x&&x.addEventListener("click",()=>ti(a)),Ze&&Ze.addEventListener("click",()=>{Z("Yayın yeniden yükleniyor...","info"),ti(a)});function od(){const U=v();if(qs&&(qs.textContent=`${U.length} KANAL`),U.length===0){pe.innerHTML=`
            <div class="tv-catalog-empty-state">
              <i data-lucide="radio" style="width:40px;height:40px;color:var(--text-muted);"></i>
              <span class="tv-empty-title">Kanal Bulunamadı</span>
              <p class="tv-empty-sub">Arama teriminizi veya kategori filtrenizi değiştirin.</p>
            </div>
          `,V();return}pe.innerHTML=U.map(X=>{const ye=X.id===a.id,be=f(X.id),ce=y(X)+1,ze=_t(X.name,X.category),Ae=Yn(X);return`
            <div class="tv-grid-card ${ye?"active":""}" data-id="${X.id}">
              <div class="tv-grid-card-top">
                <span class="tv-grid-num">${String(ce).padStart(2,"0")}</span>
                <button class="tv-grid-fav-btn ${be?"is-fav":""}" data-favid="${X.id}" title="${be?"Favorilerden Çıkar":"Favorilere Ekle"}">
                  <i data-lucide="star" style="width:15px;height:15px;${be?"fill:#fbbf24;color:#fbbf24;":""}"></i>
                </button>
              </div>

              <div class="tv-grid-logo-box">
                <img class="tv-grid-logo" src="${X.logo}" alt="${X.name}" onerror="this.onerror=null; this.src='${ze}';" loading="lazy" />
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
          `}).join(""),pe.querySelectorAll(".tv-grid-card").forEach(X=>{X.addEventListener("click",ye=>{if(ye.target.closest(".tv-grid-fav-btn"))return;const be=i.find(ce=>ce.id===X.dataset.id);be&&be.id!==a.id&&(ti(be),O&&O.scrollIntoView({behavior:"smooth",block:"start"}))})}),pe.querySelectorAll(".tv-grid-fav-btn").forEach(X=>{X.addEventListener("click",ye=>{ye.stopPropagation(),b(X.dataset.favid)})}),V()}function ld(){pe&&pe.querySelectorAll(".tv-grid-card").forEach(U=>{const X=U.dataset.id===a.id;U.classList.toggle("active",X);const ye=U.querySelector(".tv-grid-live-indicator");if(!X&&ye&&ye.remove(),X&&!ye){const be=document.createElement("div");be.className="tv-grid-live-indicator",be.innerHTML='<span class="tv-live-dot"></span><span>ŞU AN İZLENİYOR</span>',U.appendChild(be)}})}if(k=()=>{od(),Cn(),V()},Ie&&Ie.addEventListener("input",U=>{o=U.target.value.trim(),xe&&xe.classList.toggle("hidden",!o),k()}),xe&&xe.addEventListener("click",()=>{Ie.value="",o="",xe.classList.add("hidden"),k()}),ge){Ee&&Ee.addEventListener("click",ce=>{ce.stopPropagation(),ge.scrollBy({left:-220,behavior:"smooth"})}),Hs&&Hs.addEventListener("click",ce=>{ce.stopPropagation(),ge.scrollBy({left:220,behavior:"smooth"})}),ge.addEventListener("wheel",ce=>{Math.abs(ce.deltaY)>Math.abs(ce.deltaX)&&(ce.preventDefault(),ge.scrollLeft+=ce.deltaY)},{passive:!1});let U=!1,X=0,ye=0,be=!1;ge.addEventListener("mousedown",ce=>{ce.button===0&&(U=!0,be=!1,X=ce.pageX-ge.offsetLeft,ye=ge.scrollLeft)}),E.on(window,"mousemove",ce=>{if(!U)return;const Ae=(ce.pageX-ge.offsetLeft-X)*1.5;Math.abs(Ae)>6&&(be=!0,ge.classList.add("is-dragging")),ge.scrollLeft=ye-Ae}),E.on(window,"mouseup",()=>{U&&(U=!1,ge.classList.remove("is-dragging"),C(()=>{be=!1},50))}),ge.querySelectorAll(".tv-cat-filter-btn").forEach(ce=>{ce.addEventListener("click",ze=>{if(be){ze.preventDefault();return}ge.querySelectorAll(".tv-cat-filter-btn").forEach(Ae=>Ae.classList.remove("active")),ce.classList.add("active"),r=ce.dataset.cat,ce.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"}),k()})})}Ue&&Ue.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen().catch(()=>{}):D.requestFullscreen().catch(()=>{})}),E.on(document,"fullscreenchange",()=>{const U=!!document.fullscreenElement;D.classList.toggle("is-fullscreen",U),Ue&&(Ue.innerHTML=U?'<i data-lucide="minimize-2" style="width:18px;height:18px;"></i>':'<i data-lucide="maximize-2" style="width:18px;height:18px;"></i>',V())});function Ws(U){if(document.activeElement!==Ie){if(U.key>="0"&&U.key<="9"){He.length>=2&&(He=""),He+=U.key,Ks();return}if(U.key==="Enter"&&He){U.preventDefault();const X=parseInt(He,10);ea(X-1);return}switch(U.key){case"ArrowUp":case"w":case"W":U.preventDefault(),Yi("prev");break;case"ArrowDown":case"s":case"S":U.preventDefault(),Yi("next");break;case"ArrowRight":U.preventDefault(),Wi(d+.05);break;case"ArrowLeft":U.preventDefault(),Wi(d-.05);break;case"m":case"M":fe&&fe.click();break;case"f":case"F":Ue&&Ue.click();break;case"r":case"R":Ze&&Ze.click();break;case" ":U.preventDefault(),q&&q.click();break}}}E.on(document,"keydown",Ws);let ta=null,ia=!1;const Ys=()=>{if(E.dispose(),Vf(),Ke++,I(Us),ta&&I(ta),window.removeEventListener("epg-updated",Xr),window.removeEventListener("scroll",js),s){try{s.stopLoad(),s.detachMedia(),s.destroy()}catch{}s=null}if(L)try{L.pause(),L.removeAttribute("src"),L.load()}catch{}document.removeEventListener("keydown",Ws)};window.__LiveTvController={cleanup:Ys};const na=new MutationObserver(()=>{document.contains(w)||(Ys(),na.disconnect())});na.observe(document.body,{childList:!0,subtree:!0}),E.add(()=>na.disconnect()),k(),ti(a),Wi(1);const Vs=async()=>{if(!(ia||!document.contains(w))){ia=!0;try{const U=await Uf();if(!document.contains(w)||!Array.isArray(U))return;const X=new Set(Ra.map(he=>t(he.name))),ye=new Set(Ra.filter(he=>he.tvrId).map(he=>String(he.tvrId))),be=U.filter(he=>{const $e=t(he.name);return $e&&!X.has($e)&&!ye.has(String(he.tvrId))}),ce=await Promise.all(be.map(async he=>{const $e=await Wn(he.tvrId,{forceRefresh:!0});if(!$e)return null;const Ve=i.find(It=>It.isDynamicTvr&&String(It.tvrId)===String(he.tvrId)),ki={...he,isDynamicTvr:!0,streamUrl:$e,logo:he.logo||_t(he.name,he.category)};return Ve?(Object.assign(Ve,ki),Ve):ki}));if(!document.contains(w))return;const ze=ce.filter(Boolean),Ae=new Set(ze.map(he=>he.id));let at=!1;for(let he=i.length-1;he>=0;he--){const $e=i[he];$e.isDynamicTvr&&!Ae.has($e.id)&&$e.id!==a.id&&(i.splice(he,1),at=!0)}for(const he of ze)i.some($e=>$e.id===he.id)||(i.push(he),at=!0);if(e){for(let he=n.length-1;he>=0;he--){const $e=n[he];$e.isDynamicTvr&&!Ae.has($e.id)&&$e.id!==a.id&&n.splice(he,1)}for(const he of ze.filter($e=>$e.category==="kids"))n.some($e=>$e.id===he.id)||n.push(he)}at&&k()}catch{}finally{ia=!1}}};Vs(),ta=T(Vs,30*1e3)}}}const Xf=3e4,Zf=10*6e4,Qf=5,em=6e4;let Gr=0,gn=!1,Ir=0,or=0,Rr=0;function tm(){Gr=Date.now()+Xf}function im(){return Qc()||Gr>Date.now()}function Qc(){return gn&&Ir<=Date.now()&&(gn=!1,Ir=0),gn}function nm(){gn=!0,Ir=Date.now()+Zf,Gr=0,or=0,Rr=0}function rm(){gn=!1,Ir=0,Gr=0}function us(){return Math.max(0,Math.ceil((Rr-Date.now())/1e3))}function am(){return Rr>Date.now()||(or+=1,or>=Qf&&(or=0,Rr=Date.now()+em)),us()}async function sm(){if(!Qc())return{html:`
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
      `,init:n=>{const r=n.querySelector("#admin-login-form"),a=n.querySelector("#admin-pin-input"),o=n.querySelector("#admin-login-error");r.addEventListener("submit",s=>{s.preventDefault();const l=a.value.trim(),d=us();if(d>0){o.textContent=`Çok fazla hatalı deneme. ${d} saniye sonra tekrar deneyin.`,o.style.display="block";return}if(fd(l))nm(),window.dispatchEvent(new CustomEvent("cinepulse_admin_state_changed"));else{const p=am();o.textContent=p>0?`Çok fazla hatalı deneme. ${p} saniye bekleyin.`:"Geçersiz PIN kodu!",o.style.display="block",a.classList.add("admin-input-error"),setTimeout(()=>a.classList.remove("admin-input-error"),400),a.value=""}}),V(n)}};const t=Mr();Jt();const i=yt();return{html:`
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
    `,init:n=>{const r=n.querySelector("#admin-lock-btn");r&&r.addEventListener("click",()=>{rm(),window.location.hash="#home"});const a=n.querySelector("#admin-save-site-settings");a&&a.addEventListener("click",()=>{const h=n.querySelector("#admin-setting-landscape")?.checked===!0,f=n.querySelector("#admin-setting-hover")?.checked===!0,b=n.querySelector("#admin-setting-trailers")?.checked===!0,v=n.querySelector("#admin-setting-autoplay-next")?.checked===!0,y=n.querySelector("#admin-setting-subtitles")?.checked===!0,k=n.querySelector("#admin-setting-resolution")?.value||"1080p";Rl({cardLayout:h?"landscape":"portrait",hoverPreviewsEnabled:f,trailersEnabled:b,autoplayNext:v,subtitlesEnabled:y,preferredResolution:k}),document.documentElement.classList.toggle("cards-landscape",h),alert("Tüm profil kontrolleri uygulandı.")});const o=n.querySelector("#admin-add-block-form"),s=n.querySelector("#admin-block-input");o&&s&&o.addEventListener("submit",h=>{h.preventDefault();const f=s.value.trim();f&&(md(f),pn(),window.location.reload())}),n.querySelectorAll(".admin-tag-del-btn").forEach(h=>{h.addEventListener("click",()=>{const f=h.getAttribute("data-entry");f&&(gd(f),pn(),window.location.reload())})});const l=n.querySelector("#admin-change-pin-form"),d=n.querySelector("#admin-new-pin");l&&d&&l.addEventListener("submit",h=>{h.preventDefault();const f=d.value.trim();f.length>=4&&(hd(f),alert("Yönetici PIN kodu başarıyla güncellendi!"),d.value="")});const p=n.querySelector("#admin-clear-cache-btn");p&&p.addEventListener("click",()=>{sessionStorage.clear(),pn(),alert("Sistem önbelleği başarıyla temizlendi."),window.location.reload()}),V(n)}}}const gi="https://dramadizilerim.com";function om(e){return e?e.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-"):""}function ml(e){return e?e.toLowerCase().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9]/g,""):""}async function mi(e,t={}){const i=typeof window<"u";let n=e;if(i)if(e.startsWith("http"))try{const r=new URL(e);n=`/api/ddz${r.pathname}${r.search}`}catch{n=e}else n=`/api/ddz${e.startsWith("/")?"":"/"}${e}`;else n.startsWith("http")||(n=`${gi}${n.startsWith("/")?"":"/"}${n}`);try{const r=await fetch(n,{...t,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Referer:gi,...t.headers||{}},signal:AbortSignal.timeout(t.timeout||6e3)}).catch(()=>null);if(r&&r.ok)return r}catch{}return null}function Sn(e){if(!e)return"";try{if(e.includes("image_proxy.php?url=")){const t=e.match(/url=([^&]+)/);if(t)return decodeURIComponent(t[1])}}catch{}return e}async function ed(e){if(!e||typeof e!="string"||e.trim().length<2)return[];const t=e.trim(),i=`/search?q=${encodeURIComponent(t)}`,n=await mi(i);if(!n)return[];const r=await n.text().catch(()=>"");if(!r)return[];const a=[],o=/<a[^>]+href=["'](?:https:\/\/dramadizilerim\.com)?\/dizi\/([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;let s;for(;(s=o.exec(r))!==null;){const l=s[1],d=s[2],p=d.match(/alt=["']([^"']+)["']/i)||d.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i),h=p?p[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():l,f=d.match(/src=["']([^"']+)["']/i),b=f?Sn(f[1].replace(/&amp;/g,"&")):"",v=h.toLowerCase().includes("dublaj");a.some(y=>y.slug===l)||a.push({title:h,slug:l,poster:b,isDubbed:v,url:`${gi}/dizi/${l}`})}return a}async function lm(){const e=await mi("/");if(!e)return[];const t=await e.text().catch(()=>"");if(!t)return[];const i=[],n=/<a[^>]+href=["'](?:https:\/\/dramadizilerim\.com)?\/dizi\/([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;let r;for(;(r=n.exec(t))!==null;){const a=r[1],o=r[2],s=o.match(/src=["']([^"']+)["']/i),l=o.match(/alt=["']([^"']+)["']/i)||o.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i),d=l?l[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():a,p=s?Sn(s[1].replace(/&amp;/g,"&")):"",h=d.toLowerCase().includes("dublaj");i.some(f=>f.slug===a)||i.push({slug:a,title:d,poster:p,isDubbed:h,badge:h?"🇹🇷 DUBLAJ":"TR ALTYAZI",url:`${gi}/dizi/${a}`})}return i}async function Pa({page:e=1,query:t=""}={}){if(t&&t.trim().length>=2)return ed(t);const i=e>1?`/dizi?page=${e}`:"/dizi",n=await mi(i);if(!n)return[];const r=await n.text().catch(()=>"");if(!r)return[];const a=[],o=/<a[^>]+href=["'](?:https:\/\/dramadizilerim\.com)?\/dizi\/([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;let s;for(;(s=o.exec(r))!==null;){const l=s[1],d=s[2],p=d.match(/src=["']([^"']+)["']/i),h=d.match(/alt=["']([^"']+)["']/i)||d.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i),f=h?h[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():l,b=p?Sn(p[1].replace(/&amp;/g,"&")):"",v=f.toLowerCase().includes("dublaj");a.some(y=>y.slug===l)||a.push({slug:l,title:f,poster:b,isDubbed:v,badge:v?"🇹🇷 DUBLAJ":"TR ALTYAZI",url:`${gi}/dizi/${l}`})}return a}async function cm(e){if(!e)return null;const t=await mi(`/dizi/${e}`);if(!t)return null;const i=await t.text().catch(()=>"");if(!i)return null;const n=i.match(/<h1[^>]*>(.*?)<\/h1>/i),r=n?n[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():e;let a="";const s=[...i.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(b=>b[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,"&").trim()).filter(b=>{if(b.length<25)return!1;const v=b.toLowerCase();return!(v.includes("çerez")||v.includes("cookie")||v.includes("reklam")||v.includes("tüm hakları")||v.includes("bildirim")||v.includes("yapay zeka")||v.includes("bize bildirin")||v.includes("aradığınız dizi"))});if(s.length>0&&(s.sort((b,v)=>v.length-b.length),a=s[0]),!a||a.length<25){const b=i.match(/<meta\s+(?:property=["']og:description["']|name=["']description["'])\s+content=["']([^"']+)["']/i)||i.match(/<meta\s+content=["']([^"']+)["']\s+(?:property=["']og:description["']|name=["']description["'])/i);if(b&&b[1]&&b[1].trim().length>15){const v=b[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,"&").trim();v.toLowerCase().includes("aradığınız dizi")||(a=v)}}(!a||a.includes("Bu dizi için konu özeti henüz eklenmedi"))&&(a=`${r} - Tüm bölümleri yüksek kalitede, kesintisiz ve donmadan Türkçe dublaj ve altyazı seçenekleriyle CinePulse Kısa Dizi Evreni'nde izleyin.`);const l=i.match(/<div class=["'][^"']*poster[^"']*["'][^>]*>[\s\S]*?<img[^>]+src=["']([^"']+)["']/i)||i.match(/<img[^>]+class=["'][^"']*spotlight[^"']*["'][^>]+src=["']([^"']+)["']/i),d=l?Sn(l[1].replace(/&amp;/g,"&")):"",p=/<a[^>]+href=["'](?:\/izle\/|https:\/\/dramadizilerim\.com\/izle\/)([a-zA-Z0-9_-]+)\?s=(\d+)&e=(\d+)["'][^>]*>([\s\S]*?)<\/a>/gi,h=[];let f;for(;(f=p.exec(i))!==null;){const b=parseInt(f[2],10)||1,v=parseInt(f[3],10)||1,y=f[4],k=y.match(/class=["']wp-enum["']>([^<]+)</i)||y.match(/alt=["']([^"']+)["']/i),m=k?k[1].trim():`Bölüm ${v}`,w=y.match(/src=["']([^"']+)["']/i),E=w?Sn(w[1].replace(/&amp;/g,"&")):"";h.some(C=>C.season===b&&C.episode===v)||h.push({season:b,episode:v,title:m,thumb:E})}return h.sort((b,v)=>b.season-v.season||b.episode-v.episode),{slug:e,title:r,poster:d,description:a,isDubbed:r.toLowerCase().includes("dublaj"),totalEpisodes:h.length,episodes:h}}async function Um({titles:e=[],seriesTitle:t="",season:i=1,episode:n=1,isDub:r=!0}){const a=[...new Set([...e,t])].filter(C=>C&&typeof C=="string"&&C.trim().length>1);if(a.length===0)return[];const o=parseInt(i,10)||1,s=parseInt(n,10)||1;let l=null,d=null;for(const C of a){const S=om(C),T=`/izle/${S}?s=${o}&e=${s}`,I=await mi(T,{method:"HEAD",timeout:3500});if(I&&I.ok){l=S;break}}if(!l)for(const C of a){const S=await ed(C);if(S.length>0){for(const L of S)if(os(L.title,a,.75)){l=L.slug,d=L;break}if(l)break;const T=ml(C),I=S.find(L=>{const D=ml(L.title);return D===T||D.includes(T)||T.includes(D)});if(I){l=I.slug,d=I;break}}}if(!l)return[];const p=`/izle/${l}?s=${o}&e=${s}`,h=await mi(p);if(!h)return[];const f=await h.text().catch(()=>"");if(!f)return[];const b=f.match(/(?:data-src|src)=["']([^"']*embed\.php[^"']*)["']/i);if(!b)return[];let v=b[1].replace(/&amp;/g,"&");v.startsWith("http")||(v=`${gi}${v.startsWith("/")?"":"/"}${v}`);const y=await mi(v,{headers:{Referer:`${gi}${p}`}});if(!y)return[];const k=await y.text().catch(()=>"");if(!k)return[];const m=[],w=k.match(/let\s+source\s*=\s*["']([^"']+)["']/);let E=w&&w[1].startsWith("http")?w[1]:null;if(!E){const C=k.match(/https?:\/\/[^"'\s\\]+\.(?:m3u8|mp4)[^"'\s\\]*/);C&&(E=C[0])}if(E){const C=E.includes(".m3u8")||E.includes("mpegurl"),I=(d?.title||l).toLowerCase().includes("dublaj")||r===!0?`🇹🇷 DDZ VIP S${o}E${s} (TR Dublaj)`:`⚡ DDZ VIP S${o}E${s} (TR Altyazı)`;m.push({id:`ddz_ep_${l}_${o}_${s}`,name:I,displayName:I,badge:"🎭 DDZ VIP",source:"DDZ VIP",url:E,streamUrl:E,rawStreamUrl:E,quality:"1080p HD",isHls:C,isDirectVideo:!0,priority:2,getUrl:()=>E})}return m}async function dm(e=null,t=""){let i=t?"search":"trending",n=t||"",r=1,a=[],o=null,s="";const l=[{id:"trending",label:"Trendler",icon:"flame",query:""},{id:"all",label:"Tüm Katalog",icon:"layers",query:""},{id:"dubbed",label:"Türkçe Dublaj",icon:"sparkles",query:"dublaj"},{id:"patron",label:"CEO & Patron",icon:"briefcase",query:"patron"},{id:"kurt",label:"Kurt & Alfa",icon:"moon",query:"kurt"},{id:"intikam",label:"İntikam & Aşk",icon:"heart-crack",query:"intikam"},{id:"milyarder",label:"Milyarder",icon:"crown",query:"milyarder"},{id:"evlilik",label:"Yasak Aşk & Evlilik",icon:"ring",query:"evlilik"}];return{html:`
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
  `,init:async p=>{const h=p.querySelector("#drama-view-root");if(!h)return;const f=h.querySelector("#drama-search-input"),b=h.querySelector("#btn-drama-search-clear");h.querySelector("#drama-search-feedback");const v=h.querySelectorAll(".drama-chip"),y=h.querySelector("#drama-section-title"),k=h.querySelector("#drama-counter-badge"),m=h.querySelector("#drama-cards-grid"),w=h.querySelector("#drama-load-more-wrap"),E=h.querySelector("#btn-drama-load-more"),C=h.querySelector("#drama-detail-modal"),S=h.querySelector("#drama-modal-dialog");let T=null;async function I(z=!1){z||(m.innerHTML=Array.from({length:12}).map(()=>`
            <div class="drama-card-skeleton">
              <div class="skeleton-poster"></div>
              <div class="skeleton-title"></div>
            </div>
          `).join(""),k.textContent="Yükleniyor...");try{let B=[];if(n&&n.trim().length>=2)B=await Pa({query:n.trim()}),y.innerHTML=`
              <i data-lucide="search" style="width: 20px; height: 20px; color: #a855f7;"></i>
              <span>"${n}" İçin Arama Sonuçları</span>
            `,w.classList.add("hidden");else{const W=l.find(ie=>ie.id===i)||l[0];i==="trending"?(B=await lm(),y.innerHTML=`
                <i data-lucide="flame" style="width: 20px; height: 20px; color: #f43f5e;"></i>
                <span>Trend Kısa Diziler</span>
              `,w.classList.add("hidden")):i==="all"?(B=await Pa({page:r}),y.innerHTML=`
                <i data-lucide="layers" style="width: 20px; height: 20px; color: #3b82f6;"></i>
                <span>Tüm Kısa Diziler Kataloğu (Sayfa ${r})</span>
              `,w.classList.toggle("hidden",B.length===0)):W.query&&(B=await Pa({query:W.query}),y.innerHTML=`
                <i data-lucide="${W.icon}" style="width: 20px; height: 20px; color: #c084fc;"></i>
                <span>${W.label} Serileri</span>
              `,w.classList.add("hidden"))}z?a=[...a,...B]:a=B,L()}catch{m.innerHTML=`
            <div class="drama-empty-state">
              <i data-lucide="alert-circle" style="width: 44px; height: 44px; color: #ef4444;"></i>
              <h3>Diziler yüklenirken bir sorun oluştu</h3>
              <p>Lütfen internet bağlantınızı kontrol edip tekrar deneyin.</p>
              <button class="btn-primary" id="btn-drama-retry">Tekrar Dene</button>
            </div>
          `,h.querySelector("#btn-drama-retry")?.addEventListener("click",()=>I(!1)),V(m)}finally{}}function L(){if(!a||a.length===0){m.innerHTML=`
            <div class="drama-empty-state">
              <i data-lucide="film" style="width: 48px; height: 48px; color: #94a3b8;"></i>
              <h3>Eşleşen Kısa Dizi Bulunamadı</h3>
              <p>Farklı bir anahtar kelime ile arama yapabilir veya Trend kategorisine göz atabilirsiniz.</p>
            </div>
          `,k.textContent="0 Dizi",V(m);return}k.textContent=`${a.length} Dizi`,m.innerHTML=a.map((z,B)=>{const W=z.isDubbed||z.title.toLowerCase().includes("dublaj"),ie=z.poster||"";return`
            <article class="drama-card" data-slug="${z.slug}" tabindex="0" role="button" aria-label="${z.title}">
              <div class="drama-card-poster-wrap">
                ${ie?`
                  <img 
                    src="${ie}" 
                    alt="${z.title}" 
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
                  <span class="drama-badge-pill ${W?"badge-dub":"badge-sub"}">
                    ${W?"🇹🇷 DUBLAJ":"TR ALTYAZI"}
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
                <h3 class="drama-card-title" title="${z.title}">${z.title}</h3>
                <div class="drama-card-meta">
                  <span>Reels Series</span>
                  <span>•</span>
                  <span>1080p HD</span>
                </div>
              </div>
            </article>
          `}).join(""),V(m),m.querySelectorAll(".drama-card").forEach(z=>{z.addEventListener("click",()=>{const B=z.getAttribute("data-slug");B&&D(B)}),z.addEventListener("keydown",B=>{if(B.key==="Enter"||B.key===" "){B.preventDefault();const W=z.getAttribute("data-slug");W&&D(W)}})})}async function D(z){if(z){o=null,C.classList.remove("hidden"),document.body.style.overflow="hidden",S.innerHTML=`
          <div class="drama-detail-loading">
            <div class="spin-loader"></div>
            <span>Dizi bilgileri ve bölümler yükleniyor...</span>
          </div>
        `,V(S);try{const B=await cm(z);if(!B){S.innerHTML=`
              <div class="drama-empty-state">
                <i data-lucide="alert-circle" style="width: 38px; height: 38px; color: #ef4444;"></i>
                <h3>Dizi bilgisi alınamadı</h3>
                <button class="btn-primary" id="btn-close-drama-modal">Kapat</button>
              </div>
            `,h.querySelector("#btn-close-drama-modal")?.addEventListener("click",Y),V(S);return}o=B,O()}catch{Y(),Z("Dizi detayları yüklenemedi.","error")}}}function O(){if(!o)return;const{slug:z,title:B,poster:W,description:ie,episodes:te=[],isDubbed:re}=o,N=te.length,ae=s?te.filter(K=>K.title.toLowerCase().includes(s)||String(K.episode).includes(s)):te;S.innerHTML=`
          <button class="drama-modal-close-btn" id="btn-close-drama-modal" title="Kapat">
            <i data-lucide="x" style="width: 20px; height: 20px;"></i>
          </button>

          <div class="drama-detail-hero">
            <div class="drama-detail-backdrop-blur" style="background-image: url('${W||""}');"></div>
            <div class="drama-detail-hero-content">
              <div class="drama-detail-poster-wrap">
                <img src="${W||""}" alt="${B}" class="drama-detail-poster" />
              </div>
              <div class="drama-detail-info">
                <div class="drama-detail-badges">
                  <span class="drama-badge-pill ${re?"badge-dub":"badge-sub"}">
                    ${re?"🇹🇷 TÜRKÇE DUBLAJ":"TR ALTYAZI"}
                  </span>
                  <span class="drama-badge-pill badge-type">MİNİ DİZİ</span>
                  <span class="drama-badge-pill badge-ep-count">${N} BÖLÜM</span>
                  <span class="drama-badge-pill badge-server">DDZ VIP HLS</span>
                </div>
                <h2 class="drama-detail-title">${B}</h2>
                <p class="drama-detail-desc">${ie||"Bu kısa dizi için henüz özet girilmedi."}</p>
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
                <h3>Bölümler (${N})</h3>
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
              ${ae.map(K=>{const ne=yn(`ddz_${z}`,K.season,K.episode);return`
                  <button 
                    class="drama-ep-card ${ne?"is-watched":""}" 
                    data-season="${K.season}" 
                    data-episode="${K.episode}"
                  >
                    <div class="drama-ep-thumb-wrap">
                      ${K.thumb?`
                        <img src="${K.thumb}" alt="${K.title}" loading="lazy" />
                      `:`
                        <div class="drama-ep-fallback-thumb">
                          <i data-lucide="play" style="width: 16px; height: 16px; color: #c084fc;"></i>
                        </div>
                      `}
                      <span class="drama-ep-num-pill">${K.episode}</span>
                      ${ne?'<div class="drama-ep-watched-tag"><i data-lucide="check" style="width: 12px; height: 12px;"></i></div>':""}
                    </div>
                    <div class="drama-ep-title-wrap">
                      <span class="drama-ep-name">${K.title}</span>
                      <span class="drama-ep-action-hint">İzle</span>
                    </div>
                  </button>
                `}).join("")}
            </div>
          </div>
        `,V(S),S.querySelector("#btn-close-drama-modal")?.addEventListener("click",Y),S.querySelector("#btn-play-drama-start")?.addEventListener("click",()=>{te.length>0&&j(te[0].season,te[0].episode)}),S.querySelector("#btn-share-drama")?.addEventListener("click",()=>{const K=`${window.location.origin}${window.location.pathname}#dramas?slug=${z}`;navigator.clipboard?.writeText(K).then(()=>{Z("Dizi bağlantısı panoya kopyalandı!","success")}).catch(()=>{Z(`Bağlantı: ${K}`,"info")})});const J=S.querySelector("#drama-ep-filter-input");J&&J.addEventListener("input",K=>{s=K.target.value.toLowerCase().trim(),O(),S.querySelector("#drama-ep-filter-input")?.focus()}),S.querySelectorAll(".drama-ep-card").forEach(K=>{K.addEventListener("click",()=>{const ne=parseInt(K.getAttribute("data-season"),10)||1,de=parseInt(K.getAttribute("data-episode"),10)||1;j(ne,de)})})}function Y(){C.classList.add("hidden"),document.body.style.overflow="",o=null,s=""}C.addEventListener("click",z=>{z.target===C&&Y()});function j(z=1,B=1){if(!o)return;const{slug:W,title:ie,poster:te,description:re,episodes:N=[]}=o,ae=N.find(J=>J.season===z&&J.episode===B)?.thumb||"";Qt({type:"tv",tmdbId:`ddz_${W}`,title:`${ie} - B${B}`,seriesTitle:ie,season:z,episode:B,posterPath:te,backdropPath:te,playerVariant:"short-drama",seriesOverview:re||"",episodeArtworkPath:ae||te,shortDramaEpisodes:N,maxEpisodes:N.length,seasonsList:[{season_number:z,episode_count:N.length}]})}f?.addEventListener("input",z=>{const B=z.target.value;b.classList.toggle("hidden",!B),clearTimeout(T),T=setTimeout(()=>{n=B.trim(),r=1,i=n?"search":"trending",v.forEach(W=>W.classList.toggle("active",!n&&W.getAttribute("data-tab-id")==="trending")),I(!1)},350)}),f?.addEventListener("keydown",z=>{z.key==="Enter"&&(z.preventDefault(),clearTimeout(T),n=f.value.trim(),r=1,I(!1))}),b?.addEventListener("click",()=>{f.value="",b.classList.add("hidden"),n="",i="trending",v.forEach(z=>z.classList.toggle("active",z.getAttribute("data-tab-id")==="trending")),I(!1)}),v.forEach(z=>{z.addEventListener("click",()=>{const B=z.getAttribute("data-tab-id");i===B&&!n||(i=B,n="",f&&(f.value=""),b?.classList.add("hidden"),r=1,v.forEach(W=>W.classList.toggle("active",W===z)),I(!1))})}),E?.addEventListener("click",()=>{r++,I(!0)}),await I(!1),e&&D(e)}}}const Ba=[{id:"user-circle",icon:"user",label:"Klasik",color:"#f59e0b"},{id:"clapperboard",icon:"clapperboard",label:"Sinema",color:"#ec4899"},{id:"film",icon:"film",label:"Yıldız",color:"#8b5cf6"},{id:"sparkles",icon:"sparkles",label:"Sihirli",color:"#10b981"},{id:"tv",icon:"tv",label:"Dizi Kolik",color:"#3b82f6"},{id:"baby",icon:"baby",label:"Çocuk",color:"#38bdf8"},{id:"smile",icon:"smile",label:"Neşeli",color:"#eab308"},{id:"flame",icon:"flame",label:"Ateşli",color:"#ef4444"}];function um(){if(Sl()||document.getElementById("profile-onboarding-overlay"))return;const e=document.createElement("div");e.id="profile-onboarding-overlay",e.className="onboarding-overlay",e.innerHTML=`
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
            ${Ba.map((o,s)=>`
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
  `,document.body.appendChild(e),window.lucide&&V(e);let t=Ba[0].id,i=Ba[0].color;e.querySelectorAll(".onboarding-avatar-btn").forEach(o=>{o.addEventListener("click",()=>{e.querySelectorAll(".onboarding-avatar-btn").forEach(s=>s.classList.remove("selected")),o.classList.add("selected"),t=o.getAttribute("data-avatar"),i=o.getAttribute("data-color")})});const n=e.querySelector("#onboarding-form"),r=e.querySelector("#onboarding-name-input"),a=e.querySelector("#onboarding-is-kid");n.addEventListener("submit",o=>{o.preventDefault();const s=r.value.trim();s&&(ud({name:s,avatar:t,color:i,isKid:a.checked}),e.classList.add("animate-fade-out"),setTimeout(()=>{e.remove(),window.location.reload()},280))})}const tn=[{icon:"sparkles",eyebrow:"CinePulse rehberi",title:"İzlemeye hazır bir ana ekran",text:"Ana sayfadaki satırları yatay kaydırarak yapımları gez. Arama simgesinden dizi veya film adını yazdığında sonuçlar anında görünür.",hint:"Mobilde alt menüden Diziler, Filmler, Keşfet ve Listem’e geçebilirsin."},{icon:"clapperboard",eyebrow:"Fragman önizleme",title:"Karttan fragmana bak",text:"Telefonda bir içerik kartına kısa süre basılı tut; fragman ekranın alt kısmında açılır. Bilgisayarda kartın üzerine gelmen yeterli.",hint:"Önizlemeyi sağ üstteki çarpıdan kapatabilir, ses simgesinden sesi açabilirsin."},{icon:"list-plus",eyebrow:"Kişisel liste",title:"Listem senin kontrolünde",text:"İçerik detayındaki artı düğmesiyle yapımları Listem’e ekle. Listem sayfasından kaydettiğin yapımları açabilir veya kaldırabilirsin.",hint:"İzleme ilerlemen de aynı tarayıcıda otomatik hatırlanır."},{icon:"shield-check",eyebrow:"Spoilersız keşif",title:"Diziyi güvenle incele",text:"Dizi detayında “Spoilersız keşfet” seçeneğini açarsan, izleme ilerlemenin sonrasındaki bölüm başlıkları, görselleri ve özetleri gizlenir.",hint:"İzlediğin bölüme ve sıradaki bölüme kadar detay görürsün; ilerledikçe yeni bölümler açılır."},{icon:"users-round",eyebrow:"Birlikte Seç",title:"Arkadaşınla aynı odada izle",text:"Üstteki Birlikte Seç düğmesinden oda oluştur veya altı haneli kodla bir odaya katıl. Moderatör içerik ve kaynak seçer; odada emoji ve sohbet de kullanabilirsin.",hint:"Oynatıcıdaki “Odaya dön” düğmesindeki rozet yeni sohbet mesajlarını gösterir."},{icon:"monitor-play",eyebrow:"Oynatıcı",title:"Kontroller elinin altında",text:"İçeriği açınca ekrana bir kez dokunarak kontrolleri göster. Zaman çubuğundan sarabilir, kaynakları değiştirebilir, altyazı ve ses seçebilirsin.",hint:"Tam ekran, ses ve parlaklık ayarları her cihazda sana ait kalır."}];function pm(){if(!Sl()||cd()||document.getElementById("cinepulse-product-tour"))return;let e=0;const t=document.body.style.overflow,i=document.createElement("section");i.id="cinepulse-product-tour",i.className="product-tour-overlay",i.setAttribute("role","dialog"),i.setAttribute("aria-modal","true"),i.setAttribute("aria-label","CinePulse kullanım rehberi");const n=()=>{dd(),document.body.style.overflow=t,i.classList.add("is-leaving"),window.setTimeout(()=>i.remove(),180)},r=()=>{const a=tn[e];i.innerHTML=`
      <div class="product-tour-card">
        <button class="product-tour-skip" type="button" aria-label="Rehberi kapat">Geç <i data-lucide="x"></i></button>
        <div class="product-tour-icon"><i data-lucide="${a.icon}"></i></div>
        <p class="product-tour-eyebrow">${a.eyebrow}</p>
        <h2>${a.title}</h2>
        <p class="product-tour-text">${a.text}</p>
        <div class="product-tour-hint"><i data-lucide="lightbulb"></i><span>${a.hint}</span></div>
        <div class="product-tour-footer">
          <div class="product-tour-progress" aria-label="Adım ${e+1} / ${tn.length}">
            ${tn.map((o,s)=>`<span class="${s===e?"is-active":""}"></span>`).join("")}
          </div>
          <div class="product-tour-actions">
            ${e>0?'<button class="product-tour-back" type="button">Geri</button>':""}
            <button class="product-tour-next" type="button">${e===tn.length-1?"Hazırım":"Devam"} <i data-lucide="arrow-right"></i></button>
          </div>
        </div>
      </div>
    `,V(i),i.querySelector(".product-tour-skip")?.addEventListener("click",n),i.querySelector(".product-tour-back")?.addEventListener("click",()=>{e=Math.max(0,e-1),r()}),i.querySelector(".product-tour-next")?.addEventListener("click",()=>{e>=tn.length-1?n():(e+=1,r())})};document.body.appendChild(i),document.body.style.overflow="hidden",r()}const Vn=new Map,td=new Set;let gl=0;function hm(e){if(!e)return Promise.resolve(!1);if(Vn.has(e))return Vn.get(e);const t=new Promise(i=>{const n=new Image;n.decoding="async",n.onload=async()=>{try{await n.decode()}catch{}td.add(e),i(!0)},n.onerror=()=>{Vn.delete(e),i(!1)},n.src=e});return Vn.set(e,t),t}function id(e,t){return t==="landscape"?e.dataset.backdropSrc:e.dataset.posterSrc}function fm(){const e=window.innerHeight+900;return[...document.querySelectorAll(".card-poster-img")].filter(t=>{const i=t.getBoundingClientRect();return i.bottom>-300&&i.top<e})}function Gn(e){return Promise.all(fm().map(t=>hm(id(t,e))))}function mm(e){document.querySelectorAll(".card-poster-img").forEach(t=>{const i=id(t,e);!i||t.src===i||(td.has(i)?t.classList.remove("card-image-pending"):(t.classList.add("card-image-pending"),t.addEventListener("load",()=>t.classList.remove("card-image-pending"),{once:!0})),t.src=i,t.dataset.activeLayout=e)})}function gm(){const e=yt().cardLayout==="landscape"?"landscape":"portrait";return`
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
  `}function ym(e=document){const t=e.querySelector("#card-layout-switcher");if(!t)return;const i=[...t.querySelectorAll(".card-layout-option")],r=(yt().cardLayout==="landscape"?"landscape":"portrait")==="landscape"?"portrait":"landscape",a=()=>{t.isConnected&&Gn(r)};window.innerWidth>768&&("requestIdleCallback"in window?window.requestIdleCallback(a,{timeout:1400}):window.setTimeout(a,450)),i.forEach(o=>{const s=o.dataset.layout==="landscape"?"landscape":"portrait";o.addEventListener("pointerenter",()=>{t.isConnected&&Gn(s)},{passive:!0}),o.addEventListener("focus",()=>{t.isConnected&&Gn(s)},{passive:!0}),o.addEventListener("click",async()=>{const l=o.dataset.layout==="landscape"?"landscape":"portrait",d=document.documentElement.classList.contains("cards-landscape")?"landscape":"portrait";if(l===d||t.classList.contains("is-switching"))return;const p=++gl;t.classList.add("is-switching"),i.forEach(b=>{b.disabled=!0});const h=window.innerWidth<=768;if(h||await Promise.race([Gn(l),new Promise(b=>window.setTimeout(b,1200))]),p!==gl||!t.isConnected)return;const f=()=>{mm(l),document.documentElement.classList.toggle("cards-landscape",l==="landscape"),i.forEach(b=>{const v=b.dataset.layout===l;b.classList.toggle("active",v),b.setAttribute("aria-pressed",String(v))})};if(h)f();else if(typeof document.startViewTransition=="function"){const b=document.startViewTransition(f);try{await b.finished}catch{}}else document.documentElement.classList.add("card-layout-changing"),f(),await new Promise(b=>window.setTimeout(b,280)),document.documentElement.classList.remove("card-layout-changing");Rl({cardLayout:l}),t.classList.remove("is-switching"),i.forEach(b=>{b.disabled=!1}),l==="landscape"&&kn(document)})})}var Ui;(function(e){e.Unimplemented="UNIMPLEMENTED",e.Unavailable="UNAVAILABLE"})(Ui||(Ui={}));class Da extends Error{constructor(t,i,n){super(t),this.message=t,this.code=i,this.data=n}}const vm=e=>{var t,i;return e?.androidBridge?"android":!((i=(t=e?.webkit)===null||t===void 0?void 0:t.messageHandlers)===null||i===void 0)&&i.bridge?"ios":"web"},bm=e=>{const t=e.CapacitorCustomPlatform||null,i=e.Capacitor||{},n=i.Plugins=i.Plugins||{},r=()=>t!==null?t.name:vm(e),a=()=>r()!=="web",o=h=>{const f=d.get(h);return!!(f?.platforms.has(r())||s(h))},s=h=>{var f;return(f=i.PluginHeaders)===null||f===void 0?void 0:f.find(b=>b.name===h)},l=h=>e.console.error(h),d=new Map,p=(h,f={})=>{const b=d.get(h);if(b)return b.proxy;const v=r(),y=s(h);let k;const m=async()=>(!k&&v in f?k=typeof f[v]=="function"?k=await f[v]():k=f[v]:t!==null&&!k&&"web"in f&&(k=typeof f.web=="function"?k=await f.web():k=f.web),k),w=(L,D)=>{var O,Y;if(y){const j=y?.methods.find(z=>D===z.name);if(j)return j.rtype==="promise"?z=>i.nativePromise(h,D.toString(),z):(z,B)=>i.nativeCallback(h,D.toString(),z,B);if(L)return(O=L[D])===null||O===void 0?void 0:O.bind(L)}else{if(L)return(Y=L[D])===null||Y===void 0?void 0:Y.bind(L);throw new Da(`"${h}" plugin is not implemented on ${v}`,Ui.Unimplemented)}},E=L=>{let D;const O=(...Y)=>{const j=m().then(z=>{const B=w(z,L);if(B){const W=B(...Y);return D=W?.remove,W}else throw new Da(`"${h}.${L}()" is not implemented on ${v}`,Ui.Unimplemented)});return L==="addListener"&&(j.remove=async()=>D()),j};return O.toString=()=>`${L.toString()}() { [capacitor code] }`,Object.defineProperty(O,"name",{value:L,writable:!1,configurable:!1}),O},C=E("addListener"),S=E("removeListener"),T=(L,D)=>{const O=C({eventName:L},D),Y=async()=>{const z=await O;S({eventName:L,callbackId:z},D)},j=new Promise(z=>O.then(()=>z({remove:Y})));return j.remove=async()=>{await Y()},j},I=new Proxy({},{get(L,D){switch(D){case"$$typeof":return;case"toJSON":return()=>({});case"addListener":return y?T:C;case"removeListener":return S;default:return E(D)}}});return n[h]=I,d.set(h,{name:h,proxy:I,platforms:new Set([...Object.keys(f),...y?[v]:[]])}),I};return i.convertFileSrc||(i.convertFileSrc=h=>h),i.getPlatform=r,i.handleError=l,i.isNativePlatform=a,i.isPluginAvailable=o,i.registerPlugin=p,i.Exception=Da,i.DEBUG=!!i.DEBUG,i.isLoggingEnabled=!!i.isLoggingEnabled,i},wm=e=>e.Capacitor=bm(e),ps=wm(typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof globalThis<"u"?globalThis:{}),Jr=ps.registerPlugin;class Ns{constructor(){this.listeners={},this.retainedEventArguments={},this.windowListeners={}}addListener(t,i){let n=!1;this.listeners[t]||(this.listeners[t]=[],n=!0),this.listeners[t].push(i);const a=this.windowListeners[t];a&&!a.registered&&this.addWindowListener(a),n&&this.sendRetainedArgumentsForEvent(t);const o=async()=>this.removeListener(t,i);return Promise.resolve({remove:o})}async removeAllListeners(){this.listeners={};for(const t in this.windowListeners)this.removeWindowListener(this.windowListeners[t]);this.windowListeners={}}notifyListeners(t,i,n){const r=this.listeners[t];if(!r){if(n){let a=this.retainedEventArguments[t];a||(a=[]),a.push(i),this.retainedEventArguments[t]=a}return}r.forEach(a=>a(i))}hasListeners(t){var i;return!!(!((i=this.listeners[t])===null||i===void 0)&&i.length)}registerWindowListener(t,i){this.windowListeners[i]={registered:!1,windowEventName:t,pluginEventName:i,handler:n=>{this.notifyListeners(i,n)}}}unimplemented(t="not implemented"){return new ps.Exception(t,Ui.Unimplemented)}unavailable(t="not available"){return new ps.Exception(t,Ui.Unavailable)}async removeListener(t,i){const n=this.listeners[t];if(!n)return;const r=n.indexOf(i);r!==-1&&this.listeners[t].splice(r,1),this.listeners[t].length||this.removeWindowListener(this.windowListeners[t])}addWindowListener(t){window.addEventListener(t.windowEventName,t.handler),t.registered=!0}removeWindowListener(t){t&&(window.removeEventListener(t.windowEventName,t.handler),t.registered=!1)}sendRetainedArgumentsForEvent(t){const i=this.retainedEventArguments[t];i&&(delete this.retainedEventArguments[t],i.forEach(n=>{this.notifyListeners(t,n)}))}}const yl=e=>encodeURIComponent(e).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),vl=e=>e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent);class km extends Ns{async getCookies(){const t=document.cookie,i={};return t.split(";").forEach(n=>{if(n.length<=0)return;let[r,a]=n.replace(/=/,"CAP_COOKIE").split("CAP_COOKIE");r=vl(r).trim(),a=vl(a).trim(),i[r]=a}),i}async setCookie(t){try{const i=yl(t.key),n=yl(t.value),r=t.expires?`; expires=${t.expires.replace("expires=","")}`:"",a=(t.path||"/").replace("path=",""),o=t.url!=null&&t.url.length>0?`domain=${t.url}`:"";document.cookie=`${i}=${n||""}${r}; path=${a}; ${o};`}catch(i){return Promise.reject(i)}}async deleteCookie(t){try{document.cookie=`${t.key}=; Max-Age=0`}catch(i){return Promise.reject(i)}}async clearCookies(){try{const t=document.cookie.split(";")||[];for(const i of t)document.cookie=i.replace(/^ +/,"").replace(/=.*/,`=;expires=${new Date().toUTCString()};path=/`)}catch(t){return Promise.reject(t)}}async clearAllCookies(){try{await this.clearCookies()}catch(t){return Promise.reject(t)}}}Jr("CapacitorCookies",{web:()=>new km});const _m=async e=>new Promise((t,i)=>{const n=new FileReader;n.onload=()=>{const r=n.result;t(r.indexOf(",")>=0?r.split(",")[1]:r)},n.onerror=r=>i(r),n.readAsDataURL(e)}),Sm=(e={})=>{const t=Object.keys(e);return Object.keys(e).map(r=>r.toLocaleLowerCase()).reduce((r,a,o)=>(r[a]=e[t[o]],r),{})},xm=(e,t=!0)=>e?Object.entries(e).reduce((n,r)=>{const[a,o]=r;let s,l;return Array.isArray(o)?(l="",o.forEach(d=>{s=t?encodeURIComponent(d):d,l+=`${a}=${s}&`}),l.slice(0,-1)):(s=t?encodeURIComponent(o):o,l=`${a}=${s}`),`${n}&${l}`},"").substr(1):null,Em=(e,t={})=>{const i=Object.assign({method:e.method||"GET",headers:e.headers},t),r=Sm(e.headers)["content-type"]||"";if(typeof e.data=="string")i.body=e.data;else if(r.includes("application/x-www-form-urlencoded")){const a=new URLSearchParams;for(const[o,s]of Object.entries(e.data||{}))a.set(o,s);i.body=a.toString()}else if(r.includes("multipart/form-data")||e.data instanceof FormData){const a=new FormData;if(e.data instanceof FormData)e.data.forEach((s,l)=>{a.append(l,s)});else for(const s of Object.keys(e.data))a.append(s,e.data[s]);i.body=a;const o=new Headers(i.headers);o.delete("content-type"),i.headers=o}else(r.includes("application/json")||typeof e.data=="object")&&(i.body=JSON.stringify(e.data));return i};class Tm extends Ns{async request(t){const i=Em(t,t.webFetchExtra),n=xm(t.params,t.shouldEncodeUrlParams),r=n?`${t.url}?${n}`:t.url,a=await fetch(r,i),o=a.headers.get("content-type")||"";let{responseType:s="text"}=a.ok?t:{};o.includes("application/json")&&(s="json");let l,d;switch(s){case"arraybuffer":case"blob":d=await a.blob(),l=await _m(d);break;case"json":l=await a.json();break;case"document":case"text":default:l=await a.text()}const p={};return a.headers.forEach((h,f)=>{p[f]=h}),{data:l,headers:p,status:a.status,url:a.url}}async get(t){return this.request(Object.assign(Object.assign({},t),{method:"GET"}))}async post(t){return this.request(Object.assign(Object.assign({},t),{method:"POST"}))}async put(t){return this.request(Object.assign(Object.assign({},t),{method:"PUT"}))}async patch(t){return this.request(Object.assign(Object.assign({},t),{method:"PATCH"}))}async delete(t){return this.request(Object.assign(Object.assign({},t),{method:"DELETE"}))}}Jr("CapacitorHttp",{web:()=>new Tm});var bl;(function(e){e.Dark="DARK",e.Light="LIGHT",e.Default="DEFAULT"})(bl||(bl={}));var wl;(function(e){e.StatusBar="StatusBar",e.NavigationBar="NavigationBar"})(wl||(wl={}));class Am extends Ns{async setStyle(){this.unavailable("not available for web")}async setAnimation(){this.unavailable("not available for web")}async show(){this.unavailable("not available for web")}async hide(){this.unavailable("not available for web")}}Jr("SystemBars",{web:()=>new Am});const kl=Jr("App",{web:()=>Ss(()=>import("./web-e7uFf7gc.js"),[],import.meta.url).then(e=>new e.AppWeb)}),An=!!(window.Capacitor?.isNativePlatform?.()&&window.Capacitor?.getPlatform?.()==="android");document.documentElement.classList.toggle("native-android",An);const nd=matchMedia("(max-width: 768px)");document.documentElement.classList.toggle("mobile-web",!An&&nd.matches);nd.addEventListener?.("change",e=>{document.documentElement.classList.toggle("mobile-web",!An&&e.matches)});if(An){const e=window.fetch.bind(window),t="https://cine-pulse-drab.vercel.app";window.fetch=(i,n)=>{if(typeof i=="string"&&i.startsWith("/api/"))i=`${t}${i}`;else if(i instanceof URL&&i.origin===window.location.origin&&i.pathname.startsWith("/api/"))i=`${t}${i.pathname}${i.search}${i.hash}`;else if(typeof Request<"u"&&i instanceof Request){const r=new URL(i.url);r.origin===window.location.origin&&r.pathname.startsWith("/api/")&&(i=new Request(`${t}${r.pathname}${r.search}${r.hash}`,i))}return e(i,n)}}if(typeof window<"u")try{kl.addListener("backButton",({canGoBack:e})=>{const t=document.getElementById("player-modal-container")||document.querySelector(".player-modal-overlay");if(t){const r=document.getElementById("player-close-btn");r?r.click():t.remove();return}const i=document.querySelector(".modal-overlay, .decision-modal-overlay, .profile-modal-overlay, .data-manager-modal");if(i){const r=i.querySelector('.modal-close, .btn-modal-close, [data-action="close"]');r?r.click():i.remove();return}const n=window.location.hash||"#home";if(n!=="#home"&&n!==""){e?window.history.back():window.location.hash="#home";return}kl.exitApp()})}catch{}"scrollRestoration"in history&&(history.scrollRestoration="manual");"serviceWorker"in navigator&&window.location.protocol.startsWith("http")&&window.addEventListener("load",()=>{const e="20260920-mobile-preview-2",t=`cinepulse-sw-reloaded-${e}`;navigator.serviceWorker.addEventListener("controllerchange",()=>{sessionStorage.getItem(t)||(sessionStorage.setItem(t,"1"),window.location.reload())}),navigator.serviceWorker.register(`/sw.js?build=${e}`,{updateViaCache:"none"}).then(i=>i.update()).catch(()=>{})});hu();window.addEventListener("keydown",e=>{e.ctrlKey&&e.altKey&&e.shiftKey&&e.key==="F10"&&(e.preventDefault(),e.stopImmediatePropagation(),tm(),window.location.hash="#admin")},!0);const si=document.getElementById("app");document.documentElement.classList.toggle("cards-landscape",yt().cardLayout==="landscape");window.addEventListener("scroll",()=>{Mh()},{passive:!0});window.addEventListener("pagehide",Yr);let za=0;async function Ki(){const e=++za;Kh(),Yr();const t=window.location.hash||"#home";let i="home",n={};if(t.startsWith("#detail")){if(i="detail",t.includes("?")){const l=t.split("?")[1]||"",d=new URLSearchParams(l);n.type=d.get("type")||"tv",n.id=d.get("id")}else if(t.includes("/")){const l=t.split("/");l.length>=3?(n.type=l[1]||"tv",n.id=l[2]):l.length===2&&(n.type="tv",n.id=l[1])}}else if(t==="#series")i="series";else if(t==="#cartoons")i="cartoons";else if(t==="#movies")i="movies";else if(t==="#anime")i="anime";else if(t==="#documentary")i="documentary";else if(t==="#livetv")i="livetv";else if(t==="#discover")i="discover";else if(t==="#library")i="library";else if(t==="#downloads")An?i="downloads":(window.location.replace("#library"),i="library");else if(t.startsWith("#dramas")){if(i="dramas",t.includes("?")){const l=t.split("?")[1]||"",d=new URLSearchParams(l);n.slug=d.get("slug"),n.q=d.get("q")}}else if(t==="#admin"){if(!im()){window.location.replace("#home");return}i="admin"}if(window.__popularListCleanup?.(),window.__popularListCleanup=null,window.__discoverCleanup?.(),window.__discoverCleanup=null,window.__LiveTvController&&typeof window.__LiveTvController.cleanup=="function"&&window.__LiveTvController.cleanup(),document.querySelectorAll("video, audio").forEach(l=>{try{l.pause(),l.removeAttribute("src"),l.load()}catch{}}),i==="admin"){const l=await sm();if(e!==za)return;si.innerHTML=`
      <div class="admin-standalone-wrapper" style="min-height: 100vh; background: #07090e; display: flex; flex-direction: column; width: 100%;">
        ${l?l.html:""}
      </div>
    `,l&&typeof l.init=="function"&&l.init(si),V();return}const r=Lh(i),o=new Set(["home","series","cartoons","movies","anime","documentary","discover","library"]).has(i)?gm():"";(i==="home"||i==="detail")&&(si.innerHTML=`${r}<main class="route-loading" aria-live="polite"><div class="spin-loader"></div><span>İçerikler yükleniyor...</span></main>`,Xo(),V(si));let s=null;i==="home"?s=await Vh():i==="detail"?s=await ff(n.type,n.id):i==="series"?s=await Qi("tv"):i==="cartoons"?s=await Qi("cartoon"):i==="movies"?s=await Qi("movie"):i==="anime"?s=await Qi("anime"):i==="documentary"?s=await Qi("documentary"):i==="livetv"?s=Jf():i==="discover"?s=await kf("tv"):i==="library"?s=bf():i==="downloads"?s=wf():i==="dramas"&&(s=await dm(n.slug,n.q)),e===za&&(si.innerHTML=`
    ${r}
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
  `,Xo(),ym(si),s&&s.init&&s.init(si),window.lucide&&V(),Ph(t))}window.addEventListener("hashchange",Ki);Ki();setTimeout(async()=>{try{const e=String(new URL(window.location.href).searchParams.get("oda")||"").replace(/\D/g,"");if(!/^\d{6}$/.test(e))return;Sr({roomCode:e})}catch{}},700);setTimeout(()=>{um()},400);setTimeout(()=>{pm()},1200);const rd={getWatchHistory:Be,saveWatchProgress:ms,saveBatchWatchProgress:Tl};window.addEventListener("cinepulse_trakt_auth_changed",e=>{e.detail?.connected&&Hl(rd)});Hl(rd);wu();const ad=e=>{e&&e.detail&&(e.detail.action==="import"||e.detail.cleared)&&Ki()};window.addEventListener("sineflix_data_changed",ad);window.addEventListener("cinepulse_data_changed",ad);window.addEventListener("sineflix_profile_changed",async()=>{pn(),await Ki()});window.addEventListener("cinepulse_admin_state_changed",Ki);window.addEventListener("storage",e=>{if(e.key!=="sineflix_user_settings_v1")return;const t=yt();document.documentElement.classList.toggle("cards-landscape",t.cardLayout==="landscape"),pn(),Ki()});export{Lm as A,Ns as W,rr as a,Um as b,Fe as c,dt as d,qm as e,Fm as f,Xt as g,yn as h,os as i,Hm as j,Nm as k,li as l,fi as m,Dm as n,Al as o,Om as p,xf as q,Se as r,Z as s,zm as t,Cl as u,vs as v,Cm as w,ms as x,Rm as y,Im as z};
