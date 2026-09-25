(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function i(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(a){if(a.ep)return;a.ep=!0;const r=i(a);fetch(a.href,r)}})();function V(e=document){const t=window.lucide;if(!t?.icons||!t?.createElement||!e)return;const i="[data-lucide]:not(svg)",n=e.matches?.(i)?[e,...e.querySelectorAll(i)]:e.querySelectorAll(i);for(const a of n){const r=a.getAttribute("data-lucide"),o=r.replace(/(^|-)(\w)/g,(d,p,h)=>h.toUpperCase()),s=t.icons[o];if(!s)continue;const l=t.createElement(s);for(const{name:d,value:p}of a.attributes)d!=="class"&&l.setAttribute(d,p);l.classList.add("lucide",`lucide-${r}`);for(const d of a.classList)d!=="lucide"&&!d.startsWith("lucide-")&&l.classList.add(d);a.replaceWith(l)}}const de={WATCH_HISTORY:"sineflix_watch_history_v1",FAVORITES:"sineflix_favorites_v1",WATCHLIST:"sineflix_watchlist_v1",USER_SETTINGS:"sineflix_user_settings_v1",ANIME_IDS:"sineflix_anime_ids_v1"};let vt=null;function sl(){if(vt)return vt;try{if(typeof window>"u"||!window.localStorage)return vt=new Set,vt;const e=localStorage.getItem(de.ANIME_IDS);if(!e)return vt=new Set,vt;const t=JSON.parse(e);return vt=new Set(Array.isArray(t)?t.map(String):[]),vt}catch{return vt=new Set,vt}}function _e(e){if(e)try{const t=sl(),i=String(e);t.has(i)||(t.add(i),typeof window<"u"&&window.localStorage&&localStorage.setItem(de.ANIME_IDS,JSON.stringify(Array.from(t))))}catch{}}function Fe(e){return e?sl().has(String(e)):!1}let it=null,Xe=null,at=null,Ji=null,ti=null,Xi=null,Zi=null,jt=null,Li=null,vi=null,Jn=null,ct=null,ai=null,Kt=null,xt=null;function Ot(){Ji=null,ti=null,Xi=null,Zi=null}function ol(){it=null,Xe=null,at=null,Ot(),jt=null,Li=null,vi=null,Jn=null,vt=null,ct=null,ai=null,Kt=null,xt=null}function Vt(){if(ct)return ct;const e=[{id:"prof_1",name:"Profilim",avatar:"user-circle",isKid:!1,color:"#f59e0b"},{id:"prof_kids",name:"Çocuk Modu 🎈",avatar:"baby",isKid:!0,color:"#38bdf8"}];try{if(typeof window>"u"||!window.localStorage)return ct=e,ct;const t=localStorage.getItem("sineflix_profiles_list_v1");if(!t)return ct=e,ct;let i=JSON.parse(t);return i.some(a=>a.id==="prof_cinema")&&(i=i.filter(a=>a.id!=="prof_cinema"),localStorage.setItem("sineflix_profiles_list_v1",JSON.stringify(i))),ct=i,ct}catch{return ct=e,ct}}function Za(e){try{if(ct=e,ai=null,typeof window>"u"||!window.localStorage)return;localStorage.setItem("sineflix_profiles_list_v1",JSON.stringify(e)),window.dispatchEvent(new CustomEvent("sineflix_profiles_updated"))}catch{}}function ll(){try{return typeof window>"u"||!window.localStorage?!0:localStorage.getItem("cinepulse_onboarding_completed")==="true"}catch{return!0}}function Kc(){try{return typeof window>"u"||!window.localStorage?!0:localStorage.getItem("cinepulse_product_tour_completed")==="true"}catch{return!0}}function Wc(){try{if(typeof window>"u"||!window.localStorage)return;localStorage.setItem("cinepulse_product_tour_completed","true")}catch{}}function Yc({name:e,avatar:t="user-circle",color:i="#f59e0b",isKid:n=!1}){try{if(typeof window>"u"||!window.localStorage)return;const a=(e||"").trim()||(n?"Çocuk":"Profilim");let r=Vt();const o=r.findIndex(l=>l.id==="prof_1"),s={id:"prof_1",name:a,avatar:t,color:i,isKid:!!n};return o!==-1?r[o]=s:r.unshift(s),Za(r),Xn("prof_1"),localStorage.setItem("cinepulse_onboarding_completed","true"),window.dispatchEvent(new CustomEvent("sineflix_profile_changed",{detail:{profileId:"prof_1"}})),s}catch{return null}}const Kr="1403";function Vc(){try{return typeof window>"u"||!window.localStorage?Kr:localStorage.getItem("cinepulse_admin_pin")||Kr}catch{return Kr}}function Gc(e){try{return typeof window>"u"||!window.localStorage||!e||String(e).length<4?!1:(localStorage.setItem("cinepulse_admin_pin",String(e)),!0)}catch{return!1}}function Jc(e){return String(e).trim()===Vc().trim()}function wr(){if(xt)return xt;const e=["clitoris","le clitoris","erotik","porn"];try{if(typeof window>"u"||!window.localStorage)return xt=e,e;const t=localStorage.getItem("cinepulse_blocked_content");return t?(xt=JSON.parse(t),xt):(xt=e,e)}catch{return xt=e,e}}function Xc(e){if(!e)return;const t=wr(),i=String(e).trim().toLowerCase();if(!t.includes(i)){t.push(i),xt=t;try{localStorage.setItem("cinepulse_blocked_content",JSON.stringify(t))}catch{}}}function Zc(e){if(!e)return;let t=wr();const i=String(e).trim().toLowerCase();t=t.filter(n=>String(n).toLowerCase()!==i),xt=t;try{localStorage.setItem("cinepulse_blocked_content",JSON.stringify(t))}catch{}}function Qc(e){if(!e)return!1;const t=wr(),i=String(e.id||""),n=`${e.title||""} ${e.name||""} ${e.original_title||""} ${e.original_name||""}`.toLowerCase();return t.some(a=>{const r=String(a).toLowerCase().trim();return r?i===r?!0:n.includes(r):!1})}function mn(){if(ai)return ai;try{const e=Vt(),t=typeof window<"u"&&window.localStorage&&localStorage.getItem("sineflix_active_profile_id")||"prof_1";return ai=e.find(i=>i.id===t)||e[0],ai}catch{return{id:"prof_1",name:"Profilim",avatar:"user-circle",isKid:!1,color:"#f59e0b"}}}function Xn(e){try{if(typeof window>"u"||!window.localStorage)return;localStorage.setItem("sineflix_active_profile_id",e),ai=null,ol(),window.dispatchEvent(new CustomEvent("sineflix_profile_changed",{detail:{profileId:e}}))}catch{}}function Ct(){return mn()?.isKid===!0}function Jt(e){if(!e||e.adult===!0||Qc(e))return!1;const t=[27,80,10752,10768,53,18],i=e.genre_ids||(Array.isArray(e.genres)?e.genres.map(s=>typeof s=="object"?s.id:s):[]);if(i.some(s=>t.includes(Number(s))))return!1;const n=`${e.title||""} ${e.name||""} ${e.overview||""}`.toLowerCase();if(["cinayet","katil","vahşet","kanlı","erotik","dehşet","intikam","mafya","uyuşturucu","şiddet","tecavüz","seri katil","katliam","korku","kan donduran","murder","killer","horror","bloody","psychopath","terror","revenge","savaş","war","battle","death","ölüm"].some(s=>n.includes(s)))return!1;const r=[16,10751,10762];return i.some(s=>r.includes(Number(s)))}function Ps(e=[]){return Array.isArray(e)?Ct()?e.filter(Jt):e:[]}function ed({name:e,isKid:t=!1,avatar:i="user-circle",color:n="#f59e0b"}){const a=Vt(),r={id:`prof_${Date.now()}`,name:e.trim()||"Yeni Profil",avatar:i,isKid:!!t,color:n};return a.push(r),Za(a),r}function td(e){if(e==="prof_1")return!1;let t=Vt();return t=t.filter(i=>i.id!==e),Za(t),mn()?.id===e&&Xn("prof_1"),!0}function $t(e){if(e===de.WATCH_HISTORY||e===de.FAVORITES||e===de.WATCHLIST){const t=mn();if(t&&t.id&&t.id!=="prof_1")return`${e}_${t.id}`}return e}function pt(e,t=[]){try{if(typeof window>"u"||!window.localStorage)return t;const i=$t(e),n=localStorage.getItem(i);return n?JSON.parse(n):t}catch{return t}}const id="cinepulse_storage_v1",Ii="keyval_store";let kn=null;function cl(){return kn||(typeof window>"u"||!window.indexedDB?Promise.resolve(null):(kn=new Promise(e=>{try{const t=window.indexedDB.open(id,1);t.onupgradeneeded=()=>{const i=t.result;i.objectStoreNames.contains(Ii)||i.createObjectStore(Ii)},t.onsuccess=()=>e(t.result),t.onerror=()=>e(null)}catch{e(null)}}),kn))}async function nd(e){try{const t=await cl();return t?new Promise(i=>{try{const r=t.transaction(Ii,"readonly").objectStore(Ii).get(e);r.onsuccess=()=>i(r.result!==void 0?r.result:null),r.onerror=()=>i(null)}catch{i(null)}}):null}catch{return null}}async function en(e,t){try{const i=await cl();return i?new Promise(n=>{try{const a=i.transaction(Ii,"readwrite");a.objectStore(Ii).put(t,e),a.oncomplete=()=>n(!0),a.onerror=()=>n(!1)}catch{n(!1)}}):!1}catch{return!1}}async function rd(){if(!(typeof window>"u"||!window.indexedDB))try{const e=$t(de.WATCH_HISTORY),t=await nd(e);if(Array.isArray(t)&&t.length>0){const i=it&&it.length||0;t.length>=i&&(it=t.sort((n,a)=>(a.lastWatchedAt||0)-(n.lastWatchedAt||0)),Xe=null,at=null,Ot(),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{key:e,value:it}})))}}catch{}}typeof window<"u"&&setTimeout(rd,80);const Rt=new Map;function Bs(){if(!(typeof window>"u")){for(const[e,t]of Rt.entries())try{t.timer&&clearTimeout(t.timer),en(e,t.value),window.localStorage&&localStorage.setItem(e,JSON.stringify(t.value))}catch{}Rt.clear()}}typeof window<"u"&&(window.addEventListener("beforeunload",Bs),window.addEventListener("pagehide",Bs));function $e(e,t,i={}){try{if(typeof window>"u")return;const n=$t(e);if(en(n,t),window.localStorage)if(i.isProgressUpdate){Rt.has(n)&&clearTimeout(Rt.get(n).timer);const a=setTimeout(()=>{try{localStorage.setItem(n,JSON.stringify(t))}catch{}Rt.delete(n)},2500);Rt.set(n,{timer:a,value:t})}else{Rt.has(n)&&(clearTimeout(Rt.get(n).timer),Rt.delete(n));try{localStorage.setItem(n,JSON.stringify(t))}catch{}}window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{key:n,value:t,...i}}))}catch{}}const dl=["anime","kimetsu","yaiba","iblis keser","demon slayer","naruto","boruto","shingeki","titan","titana saldırı","jujutsu","kaisen","one piece","death note","bleach","dragon ball","hunter x hunter","chainsaw man","tokyo ghoul","my hero academia","boku no hero","kahramanlık akademim","fullmetal","alchemist","simyacı","sword art online","solo leveling","black clover","vinland saga","spy x family","cyberpunk: edgerunners","haikyuu","one punch","berserk","mob psycho","overlord","evangelion","cowboy bebop","code geass","frieren","dr. stone","blue lock","steins;gate","jojo","kaiju no. 8","gintama","fairy tail","violet evergarden","hell's paradise","jigokuraku","dandadan","wind breaker","mushoku tensei","re:zero","delicious in dungeon","dungeon meshi","mashle","baki","hajime no ippo","slamdunk","slam dunk","kuroko","initial d","great teacher onizuka","monster","dororo","fire force","soul eater","noragami","erased","parasyte","psycho-pass","fate/zero","fate/stay","made in abyss","your lie in april","shigatsu wa kimi","anohana","toradora","clannad","classroom of the elite","elite sınıfı","no game no life","konosuba","slime datta ken","shield hero","kalkan kahramanı","goblin slayer","akame ga kill","kill la kill","gurren lagann","darling in the franxx","promised neverland","seven deadly sins","nanatsu no taizai","yedi ölümcül günah","tokyo revengers","blue exorcist","ao no exorcist","d.gray-man","inuyasha","yu yu hakusho","sailor moon","pokemon","digimon","yu-gi-oh","beyblade","captain tsubasa","tsubasa","record of ragnarok","shuumatsu no valkyrie","golden kamuy","dorohedoro","pluto","trigun","hellsing","elfen lied","rurouni kenshin","samurai champloo","fruits basket","horimiya","my dress-up darling","komi can't communicate","rent-a-girlfriend","kaguya-sama","lycoris recoil","zom 100","undead unluck","dead mount death play","seraph of the end","owari no seraph","bungo stray dogs","bungou stray dogs","assassination classroom","suikast sınıfı","black butler","kuroshitsuji","spirited away","ruhların kaçışı","howl's moving castle","yürüyen şato","my neighbor totoro","komşum totoro","princess mononoke","prenses mononoke","your name","kimi no na wa","senin adın","weathering with you","suzume","a silent voice","sessizliğin sesi","koe no katachi","akira","shangri-la frontier","oshi no ko","the eminence in shadow","bocchi the rock"];function ad(e){return e?/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(e):!1}function lt(e){if(!e)return!1;if(e.isAnime===!0||e.type==="anime"||e.media_type==="anime"||e.id&&Fe(e.id))return!0;const i=(e.genre_ids||(Array.isArray(e.genres)?e.genres.map(r=>typeof r=="object"?r.id:r):[])).some(r=>Number(r)===16),n=e.original_language==="ja"||Array.isArray(e.origin_country)&&e.origin_country.includes("JP");if(i&&n||i&&(e.origin_country?.includes("JP")||e.original_language==="ja")||e.original_language==="ja"&&(i||ad(e.original_name||e.original_title||e.title||e.name))||Array.isArray(e.genres)&&e.genres.map(o=>typeof o=="object"?o.name:String(o)).filter(Boolean).some(o=>/anime/i.test(o)))return e.id&&_e(e.id),!0;if(typeof e.id=="string"&&(e.id.startsWith("ta_")||e.id.startsWith("acx_")||e.id.startsWith("tra_")))return _e(e.id),!0;const a=(e.title||e.name||e.original_title||e.original_name||"").toLowerCase();for(const r of dl)if(a.includes(r))return e.id&&_e(e.id),!0;return!1}function Qa(e){return e?e.isSeries===!0||e.type==="tv"||e.media_type==="tv"?!1:e.type==="movie"||e.media_type==="movie"?!0:e.first_air_date||e.number_of_seasons||e.episodesCount||Array.isArray(e.seasons)&&e.seasons.length>0||e.season>1||e.episode>1?!1:!!(e.release_date&&!e.first_air_date):!0}function Be(){return it||(it=pt(de.WATCH_HISTORY,[]).sort((t,i)=>(i.lastWatchedAt||0)-(t.lastWatchedAt||0)),it)}async function sd(){const e=Be();let t=!1;const i="4e44d9029b1270a757cddc766a1bcb63";let n=0;for(let a=0;a<e.length;a++){const r=e[a];if(r.isAnime||r.type==="anime"){r.id&&_e(r.id);continue}if(!(r.isAnime===!1&&r.type!=="anime")){if(Fe(r.id)||lt(r)){r.isAnime=!0,r.type="anime",_e(r.id),t=!0;continue}if(n<5&&r.id&&!isNaN(Number(r.id))){n++;try{const o=await fetch(`https://api.themoviedb.org/3/tv/${r.id}?api_key=${i}&language=tr-TR`);if(o.ok){const s=await o.json(),l=s.original_language==="ja"||Array.isArray(s.origin_country)&&s.origin_country.includes("JP"),d=Array.isArray(s.genres)&&s.genres.some(p=>p.id===16||/anim/i.test(p.name));l&&d&&(r.isAnime=!0,r.type="anime",r.isSeries=!0,r.original_language="ja",_e(r.id),t=!0)}}catch{}}}}t&&(Ot(),$e(de.WATCH_HISTORY,e))}function kr(){if(Xe)return Xe;const e=Be();Xe=new Map,at=new Map;for(let t=0;t<e.length;t++){const i=e[t],n=`${i.id}_${i.season||1}_${i.episode||1}`;Xe.has(n)||Xe.set(n,i);const a=String(i.id);at.has(a)||at.set(a,i)}return Xe}function Zn(e){if(!e||typeof e!="string")return"";let t=e.replace(/^(undefined|null|\/undefined|\/null)$/i,"");if(!t||t.startsWith("data:")||t.startsWith("http"))return t;try{for(;t.includes("%");){const i=decodeURIComponent(t);if(i===t)break;t=i}}catch{}return t=t.replace(/^\/+/,"/"),t.startsWith("/")||(t=`/${t}`),t==="/"||t==="/null"||t==="/undefined"?"":t}function gn(e,t,i,n=[]){const a=n.find(d=>d.id==e&&(d.posterPath||d.poster_path));let r=t||(a?a.posterPath||a.poster_path:""),o=i||(a?a.backdropPath||a.backdrop_path:"");const s=Zn(r),l=Zn(o);return{resolvedPoster:s||"",resolvedBackdrop:l||""}}function es({id:e,title:t,posterPath:i,poster_path:n,backdropPath:a,backdrop_path:r,type:o,isAnime:s=!1,isSeries:l=!1,season:d=1,episode:p=1,currentTime:h=0,duration:f=0,completed:y=!1,genres:v=[],genre_ids:w=[],original_language:k="",origin_country:m=[],...b}){if(!e)return;const E=Be(),C=E.findIndex(W=>W.id==e&&W.season==d&&W.episode==p),x=E.find(W=>W.id==e),T=!!(s||o==="anime"||Fe(e)||C>=0&&(E[C].isAnime||E[C].type==="anime")||x&&(x.isAnime||x.type==="anime")||lt({id:e,title:t,type:o,genres:v,genre_ids:w,original_language:k,origin_country:m,...b}));T&&_e(e);const R=!!(l||o==="tv"||b.first_air_date||b.number_of_seasons||b.episodesCount||Array.isArray(b.seasons)&&b.seasons.length>0||d>1||p>1||C>=0&&(E[C].isSeries||E[C].type==="tv"||E[C].season>1||E[C].episode>1)||x&&(x.isSeries||x.type==="tv"||x.season>1||x.episode>1));let L=T?"anime":R?"tv":"movie";const{resolvedPoster:D,resolvedBackdrop:N}=gn(e,i||n,a||r,E),U=f>0?f:L==="movie"?6600:3e3,j=U>0?Math.min(100,Math.round(h/U*100)):0,O=y||j>=90,B={...b,id:e,title:t||(C>=0?E[C].title:x?x.title:"İçerik"),posterPath:D,poster_path:D,backdropPath:N,backdrop_path:N,type:L,isAnime:T,isSeries:R,genres:v&&v.length>0?v:C>=0?E[C].genres:x?x.genres:[],genre_ids:w&&w.length>0?w:C>=0?E[C].genre_ids:x?x.genre_ids:[],original_language:k||(C>=0?E[C].original_language:x?x.original_language:""),origin_country:m&&m.length>0?m:C>=0?E[C].origin_country:x?x.origin_country:[],season:Number(d),episode:Number(p),currentTime:Math.round(h),duration:Math.round(U),progressPercent:j,completed:O,lastWatchedAt:b.lastWatchedAt?Number(b.lastWatchedAt):Date.now()};C>=0?E[C]=B:E.unshift(B),E.sort((W,ne)=>(ne.lastWatchedAt||0)-(W.lastWatchedAt||0)),it=E,Xe&&Xe.set(`${e}_${d}_${p}`,B),at&&at.set(String(e),B),Ot(),$e(de.WATCH_HISTORY,E,{isProgressUpdate:!0})}function ul(e=[]){if(!Array.isArray(e)||e.length===0)return;const t=Be(),i=new Map;for(let o=0;o<t.length;o++){const s=t[o],l=`${s.id}_${s.season||1}_${s.episode||1}`;i.set(l,s)}for(const o of e){if(!o||!o.id)continue;const s=Number(o.season||1),l=Number(o.episode||1),d=`${o.id}_${s}_${l}`,p=i.get(d);if(p&&p.lastWatchedAt&&o.lastWatchedAt&&p.lastWatchedAt>o.lastWatchedAt&&p.completed&&o.completed)continue;const h=!!(o.isAnime||o.type==="anime"||Fe(o.id)||p&&(p.isAnime||p.type==="anime")||lt(o));h&&_e(o.id);const f=!!(o.isSeries||o.type==="tv"||o.first_air_date||s>1||l>1||p&&(p.isSeries||p.type==="tv")),y=h?"anime":f?"tv":"movie",{resolvedPoster:v,resolvedBackdrop:w}=gn(o.id,o.posterPath||o.poster_path,o.backdropPath||o.backdrop_path,t),k=o.duration>0?o.duration:y==="movie"?6600:3e3,m=o.currentTime!==void 0?o.currentTime:o.completed?k:0,b=o.progressPercent!==void 0?o.progressPercent:k>0?Math.min(100,Math.round(m/k*100)):0,E=o.completed===!1?!1:o.completed||b>=90,C={...p||{},...o,id:o.id,title:o.title||p?.title||"İçerik",posterPath:v,poster_path:v,backdropPath:w,backdrop_path:w,type:y,isAnime:h,isSeries:f,season:s,episode:l,currentTime:Math.round(m),duration:Math.round(k),progressPercent:b,completed:E,lastWatchedAt:o.lastWatchedAt?Number(o.lastWatchedAt):p?.lastWatchedAt||Date.now()};i.set(d,C)}const n=Array.from(i.values()).sort((o,s)=>(s.lastWatchedAt||0)-(o.lastWatchedAt||0));it=n,Xe=null,at=null,Ot();const a=n.filter(o=>!o.completed).length,r=n.filter(o=>o.completed).length;a>0,$e(de.WATCH_HISTORY,n)}function od(e,t=1,i=1){let n=Be();n=n.filter(a=>!(a.id==e&&a.season==t&&a.episode==i)),it=n,Xe&&Xe.delete(`${e}_${t}_${i}`),Ot(),$e(de.WATCH_HISTORY,n)}function Ea(e){let t=Be();t=t.filter(i=>i.id!=e),it=t,Xe=null,Ot(),$e(de.WATCH_HISTORY,t)}function Ds(){let e=Be();e=e.filter(t=>!t.completed&&t.progressPercent<90),$e(de.WATCH_HISTORY,e)}function ld(){let e=Be();const t=e.length;return e=e.filter(i=>!(i.currentTime===1e3&&i.duration===1e3)),it=e,Xe=null,Ot(),$e(de.WATCH_HISTORY,e),t-e.length}function Gt(e,t=1,i=1){return kr().get(`${e}_${t}_${i}`)||null}function ln(e,t=1,i=1){const n=Gt(e,t,i);return!!(n&&(n.completed||n.progressPercent>=90))}function pl(e,t=1,i=1,n=!0,a={}){const r=Be(),o=r.findIndex(v=>v.id==e&&v.season==t&&v.episode==i),s=r.find(v=>v.id==e),l=!!(a.isAnime||a.type==="anime"||Fe(e)||o>=0&&(r[o].isAnime||r[o].type==="anime")||s&&(s.isAnime||s.type==="anime")||lt({id:e,title:a.title,...a}));l&&_e(e);const d=a.type==="movie"&&!l,p=a.duration||(d?6600:3e3),{resolvedPoster:h,resolvedBackdrop:f}=gn(e,a.posterPath||a.poster_path,a.backdropPath||a.backdrop_path,r),y={id:e,title:a.title||(o>=0?r[o].title:"İçerik"),posterPath:h,poster_path:h,backdropPath:f,backdrop_path:f,type:l?"anime":d?"movie":"tv",isAnime:l,isSeries:!d,season:Number(t),episode:Number(i),currentTime:n?p:0,duration:p,progressPercent:n?100:0,completed:!!n,lastWatchedAt:Date.now()};o>=0?r[o]=y:r.push(y),$e(de.WATCH_HISTORY,r)}function hm(e,t=!0,i={}){pl(e,1,1,t,{...i,type:i.type||"movie"})}function hl(e,t=1,i=1,n={}){const a=ln(e,t,i);return pl(e,t,i,!a,n),{completed:!a}}function cd(e,t=[],i=!0,n={}){const a=Be(),r=n.title||"Dizi",o=!!(n.isAnime||n.type==="anime"||Fe(e)||lt({id:e,title:r}));o&&_e(e);const s=o?"anime":"tv",l=n.duration||3e3,{resolvedPoster:d,resolvedBackdrop:p}=gn(e,n.posterPath||n.poster_path,n.backdropPath||n.backdrop_path,a);for(const h of t){const f=h.season_number;if(f===0&&t.length>1)continue;const y=h.episode_count||10;for(let v=1;v<=y;v++){const w=a.findIndex(m=>m.id==e&&m.season==f&&m.episode==v),k={id:e,title:r,posterPath:d,poster_path:d,backdropPath:p,backdrop_path:p,type:s,isAnime:o,isSeries:!0,season:Number(f),episode:v,currentTime:i?l:0,duration:l,progressPercent:i?100:0,completed:!!i,lastWatchedAt:Date.now()};w>=0?a[w]=k:a.push(k)}}$e(de.WATCH_HISTORY,a)}function dd(e,t,i=10,n=!0,a={}){const r=Be(),o=a.title||"Dizi",s=!!(a.isAnime||a.type==="anime"||Fe(e)||lt({id:e,title:o}));s&&_e(e);const l=s?"anime":"tv",d=a.duration||3e3,{resolvedPoster:p,resolvedBackdrop:h}=gn(e,a.posterPath||a.poster_path,a.backdropPath||a.backdrop_path,r);for(let f=1;f<=i;f++){const y=r.findIndex(w=>w.id==e&&w.season==t&&w.episode==f),v={id:e,title:o,posterPath:p,poster_path:p,backdropPath:h,backdrop_path:h,type:l,isAnime:s,isSeries:!0,season:Number(t),episode:f,currentTime:n?d:0,duration:d,progressPercent:n?100:0,completed:!!n,lastWatchedAt:Date.now()};y>=0?r[y]=v:r.push(v)}$e(de.WATCH_HISTORY,r)}function Wr(e,t=[]){if(!t||t.length===0)return ln(e,1,1);const i=kr();for(const n of t){const a=n.season_number;if(a===0&&t.length>1)continue;const r=n.episode_count||1;for(let o=1;o<=r;o++){const s=i.get(`${e}_${a}_${o}`);if(!s||!s.completed&&s.progressPercent<90)return!1}}return!0}function Yr(e,t,i=10){const n=kr();for(let a=1;a<=i;a++){const r=n.get(`${e}_${t}_${a}`);if(!r||!r.completed&&r.progressPercent<90)return!1}return!0}function Ta(e,t=1,i=1,n=1500,a={}){const r=!!(a.isAnime||a.type==="anime"||Fe(e)||lt({id:e,title:a.title,...a}));r&&_e(e);const o=a.type==="movie"&&!r,s=a.duration||(o?6600:3e3),l=n||Math.round(s*.5);return es({id:e,title:a.title||"İçerik",posterPath:a.posterPath||a.poster_path||"",backdropPath:a.backdropPath||a.backdrop_path||"",type:r?"anime":o?"movie":"tv",isAnime:r,isSeries:!o,season:t,episode:i,currentTime:l,duration:s,completed:!1})}function Vr(e){return e?(at||kr(),at&&at.has(String(e))?at.get(String(e)):Be().find(i=>i.id==e)||null):null}function ii(e){if(!e||e<=0)return"";const t=Math.floor(e/60),i=Math.floor(e%60);if(t>=60){const n=Math.floor(t/60),a=t%60;return`${n}sa ${a>0?a+"dk":""}`}return`${t}:${i<10?"0":""}${i}`}function Os(e,t){(!t||t<=0)&&(t=3e3);const i=Math.max(0,t-(e||0)),n=Math.round(i/60);if(n<=0)return"Bitti";if(n>=60){const a=Math.floor(n/60),r=n%60;return`${a}sa ${r>0?r+"dk":""} kaldı`}return`${n} dk kaldı`}function ud(e){if(!e||e<=0)return"0 dakika";const t=Math.floor(e/86400),i=Math.floor(e%86400/3600),n=Math.floor(e%3600/60),a=[];return t>0&&a.push(`${t} gün`),i>0&&a.push(`${i} saat`),(n>0||a.length===0)&&a.push(`${n} dk`),a.join(" ")}function Ns(){if(Zi)return Zi;const e=Be();let t=0,i=0,n=0;for(const r of e){const o=Qa(r),s=r.duration&&r.duration>0?r.duration:o?6600:3e3;r.completed?t+=s:r.currentTime>0?t+=r.currentTime:r.progressPercent&&r.progressPercent>0?t+=Math.round(r.progressPercent/100*s):t+=s,o?i++:n++}const a=ud(t);return Zi={totalSeconds:t,totalMinutes:Math.floor(t/60),totalHours:(t/3600).toFixed(1),formattedTotalTime:a,formattedTotal:a,moviesCount:i,totalMovies:i,episodesCount:n,totalEpisodes:n,totalEntries:e.length},Zi}function zn(){if(ti)return ti;const e=Be();if(!e||e.length===0)return ti=[],ti;const t=new Map;for(const n of e){const a=n.id;t.has(a)||t.set(a,[]),t.get(a).push(n)}const i=[];for(const[n,a]of t.entries()){a.sort((l,d)=>(d.lastWatchedAt||0)-(l.lastWatchedAt||0));const r=a[0],o=!!(r.isAnime||r.type==="anime"||Fe(r.id)||lt(r));if(o&&_e(r.id),a.some(l=>l.isSeries===!0||l.type==="tv"||l.type==="anime"||l.first_air_date||l.number_of_seasons||l.season&&l.season>1||l.episode&&l.episode>1||Array.isArray(l.seasons)&&l.seasons.length>0)){if(a.every(L=>L.completed||L.progressPercent>=85))continue;const l=a.find(L=>!L.completed&&L.currentTime>0&&L.progressPercent<100);let d=l?l.season||1:r.season||1;const p=new Set;for(const L of a)L.season===d&&(L.completed||L.progressPercent>=90)&&p.add(L.episode);let h=1,f=!1,y=0,v=r;if(l&&l.season===d)h=l.episode||1,f=!0,y=l.currentTime||0,v=l;else{for(;p.has(h)&&h<=999;)h++;const L=a.find(D=>D.season===d&&D.episode===h);L&&!L.completed&&L.currentTime>0&&(f=!0,y=L.currentTime,v=L)}const w=a.find(L=>L.number_of_seasons||L.status||Array.isArray(L.seasons)&&L.seasons.length>0)||r,k=w.status==="Ended"||w.status==="Canceled",b=(Array.isArray(w.seasons)?w.seasons.find(L=>L.season_number===d):null)?.episode_count||w.season_episodes_count,E=w.number_of_seasons||(Array.isArray(w.seasons)?w.seasons.filter(L=>L.season_number>0).length:0);if(b&&h>b){if(E&&d<E)d++,h=1,f=!1,y=0;else if(k&&!f)continue}if(k&&w.number_of_episodes&&!f&&a.filter(D=>D.completed||D.progressPercent>=90).length>=w.number_of_episodes||p.size===0&&!f&&r.currentTime<=0)continue;const C=v.duration||3e3,x=Os(y,C),T=o?"Anime Dizisi • ":"";let R="";f&&y>0?R=`${T}S${d} B${h} • Kaldığın: ${ii(y)} • ${x}`:p.size>0||h>1?R=`${T}S${d} B${h} • Sıradaki Bölüm`:R=`${T}S${d} B${h} • Sıradaki Bölüm`,i.push({...r,...v,id:r.id,title:r.title||v.title,posterPath:r.posterPath||v.posterPath,poster_path:r.poster_path||v.poster_path,backdropPath:r.backdropPath||v.backdropPath,backdrop_path:r.backdrop_path||v.backdrop_path,type:o?"anime":"tv",isAnime:o,isSeries:!0,season:d,episode:h,currentTime:f?y:0,subtitle:R})}else{if(r.completed||r.progressPercent>=90)continue;if(r.currentTime>0){const d=r.duration||6600,p=Os(r.currentTime,d),h=o?"Anime Filmi • ":"";i.push({...r,type:o?"anime":"movie",isAnime:o,isSeries:!1,subtitle:`${h}Kaldığın: ${ii(r.currentTime)} • ${p}`})}}}return i.sort((n,a)=>(a.lastWatchedAt||0)-(n.lastWatchedAt||0)),ti=i,ti}function Gr(){if(Xi)return Xi;const e=Be(),t=new Map;for(const n of e){const a=n.id;t.has(a)||t.set(a,[]),t.get(a).push(n)}const i=[];for(const[n,a]of t.entries()){a.sort((l,d)=>(d.lastWatchedAt||0)-(l.lastWatchedAt||0));const r=a[0],o=!!(r.isAnime||r.type==="anime"||Fe(r.id)||lt(r));o&&_e(r.id),Qa(r)?(r.completed||r.progressPercent>=90)&&i.push({...r,type:o?"anime":"movie",isAnime:o,isSeries:!1,completed:!0,subtitle:o?"✓ Anime Filmi İzlendi":"✓ Film İzlendi"}):a.every(d=>d.completed||d.progressPercent>=85)&&a.length>0&&i.push({...r,type:o?"anime":"tv",isAnime:o,isSeries:!0,completed:!0,subtitle:o?`✓ ${a.length} Bölüm Anime İzlendi`:`✓ ${a.length} Bölüm İzlendi`})}return i.sort((n,a)=>(a.lastWatchedAt||0)-(n.lastWatchedAt||0)),Xi=i,Xi}function zs(){if(Ji)return Ji;const e=Be(),t=new Map;for(const n of e){const a=n.id;t.has(a)||t.set(a,[]),t.get(a).push(n)}const i=[];for(const[n,a]of t.entries()){a.sort((d,p)=>(p.lastWatchedAt||0)-(d.lastWatchedAt||0));const r=a[0],o=!!(r.isAnime||r.type==="anime"||Fe(r.id)||lt(r));o&&_e(r.id);const s=Qa(r),l=o?"anime":s?"movie":"tv";if(s){const d=o?"Anime Filmi • ":"";i.push({...r,type:l,isAnime:o,isSeries:!1,subtitle:r.completed?`✓ ${d}İzlendi`:r.progressPercent>0?`${d}%${r.progressPercent} İzlendi`:d.replace(" • ","")})}else{const d=a.filter(h=>h.completed||h.progressPercent>=85).length,p=o?"Anime Dizisi • ":"";i.push({...r,type:l,isAnime:o,isSeries:!0,subtitle:d>0?`${p}${d} Bölüm İzlendi`:`${p}S${r.season||1} B${r.episode||1}`})}}return i.sort((n,a)=>(a.lastWatchedAt||0)-(n.lastWatchedAt||0)),Ji=i,Ji}function Hs(){return zn()}function fl(e){if(!e)return e;let t=e.type;const i=!!(e.isAnime||e.type==="anime"||Fe(e.id)||lt(e));i?(t="anime",e.id&&_e(e.id)):(!t||t==="movie")&&(e.isSeries||e.first_air_date||e.media_type==="tv"||e.number_of_seasons||e.episodesCount||!e.title&&e.name?t="tv":t=t||"movie");const n=!!(e.isSeries!==void 0?e.isSeries:t==="tv"||e.first_air_date||e.number_of_seasons||e.episodesCount||e.season&&e.season>1||e.episode&&e.episode>1),a=Zn(e.poster_path||e.posterPath||e.poster||""),r=Zn(e.backdrop_path||e.backdropPath||e.backdrop||"");return{...e,type:t,isAnime:i,isSeries:n,poster_path:a,posterPath:a,backdrop_path:r,backdropPath:r}}function Wt(){return jt||(jt=pt(de.FAVORITES,[]).map(fl),Li=new Set(jt.map(t=>String(t.id))),jt)}function pd(e){return e?(Li||Wt(),Li.has(String(e))):!1}function hd(e){if(!e||!e.id)return!1;let t=Wt();const i=t.findIndex(a=>a.id==e.id);let n=!1;if(i>=0)t.splice(i,1);else{const a=!!(e.isAnime||e.type==="anime"||Fe(e.id)||lt(e));a&&_e(e.id);let r=a?"anime":e.type;r||(r=e.first_air_date||e.media_type==="tv"||e.number_of_seasons||!e.title&&e.name?"tv":"movie");const o=e.poster_path||e.posterPath||e.poster||"",s=e.backdrop_path||e.backdropPath||e.backdrop||"";t.unshift({id:e.id,title:e.title||e.name||"İsimsiz",poster_path:o,posterPath:o,backdrop_path:s,backdropPath:s,vote_average:e.vote_average||e.voteAverage||8,release_date:e.release_date||e.first_air_date||"",first_air_date:e.first_air_date||"",genre_ids:e.genre_ids||(Array.isArray(e.genres)?e.genres.map(l=>typeof l=="object"?l.id:l):[]),genres:e.genres||[],original_language:e.original_language||"",origin_country:e.origin_country||[],isAnime:a,type:r,addedAt:Date.now()}),n=!0}return jt=t,Li=new Set(t.map(a=>String(a.id))),$e(de.FAVORITES,t),n}function fd(e){let t=Wt();return t=t.filter(i=>i.id!=e),jt=t,Li=new Set(t.map(i=>String(i.id))),$e(de.FAVORITES,t),t}function Yt(){return vi||(vi=pt(de.WATCHLIST,[]).map(fl),Jn=new Set(vi.map(t=>String(t.id))),vi)}function ts(e){return e?(Jn||Yt(),Jn.has(String(e))):!1}function ml(e){if(!e||!e.id)return!1;let t=Yt();const i=t.findIndex(a=>a.id==e.id);let n=!1;if(i>=0)t.splice(i,1);else{const a=!!(e.isAnime||e.type==="anime"||Fe(e.id)||lt(e));a&&_e(e.id);let r=a?"anime":e.type;r||(r=e.first_air_date||e.media_type==="tv"||e.number_of_seasons||!e.title&&e.name?"tv":"movie");const o=e.poster_path||e.posterPath||e.poster||"",s=e.backdrop_path||e.backdropPath||e.backdrop||"";t.unshift({id:e.id,title:e.title||e.name||"İsimsiz",poster_path:o,posterPath:o,backdrop_path:s,backdropPath:s,vote_average:e.vote_average||e.voteAverage||8,release_date:e.release_date||e.first_air_date||"",first_air_date:e.first_air_date||"",genre_ids:e.genre_ids||(Array.isArray(e.genres)?e.genres.map(l=>typeof l=="object"?l.id:l):[]),genres:e.genres||[],original_language:e.original_language||"",origin_country:e.origin_country||[],isAnime:a,type:r,addedAt:Date.now()}),n=!0}return $e(de.WATCHLIST,t),n}function md(e){let t=Yt();return t=t.filter(i=>i.id!=e),$e(de.WATCHLIST,t),t}function gd(){it=[],Xe=new Map,at=new Map,Ot(),$e(de.WATCH_HISTORY,[])}function yd(e,t=1,i=1){return od(e,t,i)}function ft(){return Kt||(Kt=pt(de.USER_SETTINGS,{autoplayNext:!0,preferredResolution:"1080p",theme:"dark",subtitlesEnabled:!0,cardLayout:"portrait",hoverPreviewsEnabled:!0,trailersEnabled:!0}),Kt)}function gl(e){Kt={...ft(),...e},$e(de.USER_SETTINGS,Kt),typeof window<"u"&&window.dispatchEvent(new CustomEvent("cinepulse_settings_changed",{detail:Kt}))}function yl(){const e=pt(de.WATCH_HISTORY,[]),t=pt(de.FAVORITES,[]),i=pt(de.WATCHLIST,[]),n=pt(de.USER_SETTINGS,{}),a={version:"1.0.0",exportDate:new Date().toISOString(),appName:"CinePulse Studio",watchHistory:e,favorites:t,watchlist:i,userSettings:n,data:{watchHistory:e,favorites:t,watchlist:i,userSettings:n}},r=JSON.stringify(a,null,2),o=new Blob([r],{type:"application/json;charset=utf-8"}),s=URL.createObjectURL(o),l=document.createElement("a");l.href=s,l.download=`cinepulse_yedek_${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(l),l.click(),setTimeout(()=>{document.body.removeChild(l),URL.revokeObjectURL(s)},1e3)}function vl(e,t="merge"){try{let i=null;if(typeof e=="string"?i=JSON.parse(e.trim()):typeof e=="object"&&e!==null&&(i=e),!i)throw new Error("Geçersiz veya boş yedek dosyası.");let n=[],a=[],r=[],o={};if(Array.isArray(i)?n=i:typeof i=="object"&&(n=i.watchHistory||i.data?.watchHistory||i.sineflix_watch_history_v1||i.history||[],a=i.favorites||i.data?.favorites||i.sineflix_favorites_v1||[],r=i.watchlist||i.data?.watchlist||i.sineflix_watchlist_v1||[],o=i.userSettings||i.data?.userSettings||i.sineflix_user_settings_v1||{}),Array.isArray(n)||(n=[]),Array.isArray(a)||(a=[]),Array.isArray(r)||(r=[]),t==="replace")$e(de.WATCH_HISTORY,n),$e(de.FAVORITES,a),$e(de.WATCHLIST,r),o&&typeof o=="object"&&$e(de.USER_SETTINGS,o);else{const s=pt(de.WATCH_HISTORY,[]),l=new Map;s.forEach(w=>{const k=`${w.id}_${w.season||1}_${w.episode||1}`;l.set(k,w)}),n.forEach(w=>{const k=`${w.id}_${w.season||1}_${w.episode||1}`;if(!l.has(k))l.set(k,w);else{const m=l.get(k);((w.lastWatchedAt||0)>=(m.lastWatchedAt||0)||w.completed)&&l.set(k,{...m,...w})}});const d=Array.from(l.values()).sort((w,k)=>(k.lastWatchedAt||0)-(w.lastWatchedAt||0));$e(de.WATCH_HISTORY,d);const p=pt(de.FAVORITES,[]),h=new Map;p.forEach(w=>h.set(String(w.id),w)),a.forEach(w=>{h.has(String(w.id))||h.set(String(w.id),w)}),$e(de.FAVORITES,Array.from(h.values()));const f=pt(de.WATCHLIST,[]),y=new Map;f.forEach(w=>y.set(String(w.id),w)),r.forEach(w=>{y.has(String(w.id))||y.set(String(w.id),w)}),$e(de.WATCHLIST,Array.from(y.values()));const v=pt(de.USER_SETTINGS,{});$e(de.USER_SETTINGS,{...v,...o})}return window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{action:"import"}})),window.dispatchEvent(new CustomEvent("cinepulse_data_changed",{detail:{action:"import"}})),window.dispatchEvent(new CustomEvent("cinepulse_data_changed",{detail:{action:"import"}})),{success:!0,countHistory:n.length,countFavs:a.length,countWatchlist:r.length,message:`${n.length} izleme kaydı ve ${a.length} favori başarıyla aktarıldı.`}}catch(i){return{success:!1,error:i.message,message:"Yedek dosyası okunamadı: "+i.message}}}function vd(){const e=Be(),t=Wt(),i=Yt(),n=JSON.stringify({history:e,favorites:t,watchlist:i}),a=new Blob([n]).size,r=(a/1024).toFixed(1);return{historyCount:e.length,favoritesCount:t.length,watchlistCount:i.length,bytes:a,kb:r}}function bd(){ol();try{en($t(de.WATCH_HISTORY),[]),en($t(de.FAVORITES),[]),en($t(de.WATCHLIST),[])}catch{}typeof window<"u"&&window.localStorage&&(localStorage.removeItem($t(de.WATCH_HISTORY)),localStorage.removeItem($t(de.FAVORITES)),localStorage.removeItem($t(de.WATCHLIST))),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{cleared:!0}}))}function wd(){if(!(typeof window>"u"||!window.localStorage))try{localStorage.removeItem("cinepulse_epg_live_cache"),localStorage.removeItem("sineflix_epg_cache_v2");for(let t=0;t<localStorage.length;t++){const i=localStorage.key(t);i&&(i.startsWith("cinepulse_home_fast_")||i.startsWith("sineflix_home_fast_"))&&localStorage.removeItem(i)}const e=localStorage.getItem("sineflix_notifications_v1");if(e)try{const t=JSON.parse(e);Array.isArray(t)&&t.length>25&&localStorage.setItem("sineflix_notifications_v1",JSON.stringify(t.slice(0,25)))}catch{}}catch{}}wd();const kd="https://api.themoviedb.org/3",is=["4e44d9029b1270a757cddc766a1bcb63","844dba0bfd8f3a4f3799f6130ef9e335"];let Aa=0;function _d(){return is[Aa]}function qs(){Aa=(Aa+1)%is.length}const Ze={POSTER_SMALL:"https://image.tmdb.org/t/p/w185",POSTER_MEDIUM:"https://image.tmdb.org/t/p/w342",BACKDROP_LARGE:"https://image.tmdb.org/t/p/w780",BACKDROP_XLARGE:"https://image.tmdb.org/t/p/w1280",BACKDROP_ORIGINAL:"https://image.tmdb.org/t/p/original",STILL_MEDIUM:"https://image.tmdb.org/t/p/w300"},Sd='<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750"><rect width="500" height="750" fill="#0b0f19"/><circle cx="250" cy="300" r="160" fill="#f59e0b" opacity="0.25"/><g transform="translate(190, 230) scale(2.5)" fill="none" stroke="#f59e0b" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></g><text x="250" y="430" font-family="sans-serif" font-weight="800" font-size="30" fill="#ffffff" text-anchor="middle">Cine<tspan fill="#f59e0b">Pulse</tspan></text><text x="250" y="470" font-family="sans-serif" font-weight="500" font-size="16" fill="#64748b" text-anchor="middle">Görsel Yüklenemedi</text></svg>',cn=`data:image/svg+xml,${encodeURIComponent(Sd)}`,xd='<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#1e293b"/><circle cx="50" cy="40" r="18" fill="#64748b"/><path d="M 20 85 C 20 65, 80 65, 80 85 Z" fill="#64748b"/></svg>',Qn=`data:image/svg+xml,${encodeURIComponent(xd)}`;function st(e,t=Ze.POSTER_MEDIUM){if(!e||e==="null"||e==="undefined"||e==="")return cn;if(e.startsWith("http")||e.startsWith("data:"))return e;let i=e;try{for(;i.includes("%");){const n=decodeURIComponent(i);if(n===i)break;i=n}}catch{}return i=i.replace(/^\/+/,"/"),i.startsWith("/")||(i=`/${i}`),i==="/"||i==="/null"||i==="/undefined"?cn:`${t}${i}`}const Jr={};async function ns(e){if(!e||e.trim().length===0)return"";if(Jr[e])return Jr[e];try{const t=`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=tr&dt=t&q=${encodeURIComponent(e)}`,i=await fetch(t,{signal:AbortSignal.timeout(1200)});if(i.ok){const n=await i.json();if(n&&n[0]){const a=n[0].map(r=>r[0]).join("");return Jr[e]=a,a}}}catch{}return e}const Xr=new Map;async function he(e,t={}){const i=`${e}_${JSON.stringify(t)}`;if(Xr.has(i))return Xr.get(i);for(let n=0;n<is.length;n++)try{const a=new URL(`${kd}${e}`);a.searchParams.append("api_key",_d());for(let o in t)t[o]!==void 0&&t[o]!==null&&a.searchParams.append(o,t[o]);const r=await fetch(a.toString(),{signal:AbortSignal.timeout(6e3)});if(r.ok){const o=await r.json();return Xr.set(i,o),o}else qs()}catch{qs()}return null}const Ed=new Set([64,84,4370]),Td=new Set([10764]),Ad=["hayalet hikayeleri","a haunting","altin pesinde","gold rush","olumcul av","deadliest catch","hurda avcilari","salvage hunters","tamirat tadilat","wheeler dealers","agir yasamlar","my 600-lb life","evlilige 90 gun","90 day fiance","pasta ustalari","cake boss","agac ev ustalari","treehouse masters","alaska yi kurtarmak","alaskayi kurtarmak","alaska: the last frontier","oto kurtarma kulubu","fast n loud","nehir canavarlari","river monsters","kupon delileri","extreme couponing","temizlik bagimlilari","obsessive compulsive cleaners","asiri cimriler","extreme cheapskates","restoran kurtarma","depo savaslari","storage wars","gumruk kontrol","border security","nasil yapilir","how it's made","how its made","dmax","tlc"],Cd=new Set([3072,34634,3126,45814,1356,45598,61498,59792,29849,23067,44383,44372]);function Ve(e){if(!e||e.id&&Cd.has(Number(e.id))||(e.genre_ids||(Array.isArray(e.genres)?e.genres.map(a=>typeof a=="object"?a.id:a):[])).some(a=>Td.has(Number(a))))return!0;const i=e.networks||[];if(Array.isArray(i)&&i.some(a=>Ed.has(Number(a.id||a))))return!0;const n=(e.title||e.name||e.original_title||e.original_name||"").toLowerCase().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c");for(const a of Ad)if(n.includes(a))return!0;return!!(Ct()&&!Jt(e))}const rs=[[180,["rafadan tayfa","kral sakir","niloya","pepee"]],[225,["miraculous","gumball","adventure time","regular show","teen titans go","ben 10","spongebob","sunger bob"]],[130,["masha and the bear","masa ile koca ayi","winx","scooby doo","ninjago","paw patrol","pijamaskeliler"]],[150,["samurai jack","johnny test","johnny bravo","dexter laboratory","powerpuff girls","courage cowardly dog"]],[110,["avatar the last airbender","avatar son hava bukucu","gravity falls","steven universe","the owl house","amphibia"]]],Fs=[[180,["naruto","one piece","attack on titan","shingeki no kyojin","demon slayer","kimetsu no yaiba"]],[160,["jujutsu kaisen","death note","solo leveling","bleach","dragon ball"]],[140,["pokemon","beyblade","captain tsubasa","yu gi oh","bakugan","my hero academia","boku no hero"]],[120,["hunter x hunter","tokyo ghoul","fullmetal alchemist","vinland saga","monster","jojo","haikyuu","blue lock"]],[105,["chainsaw man","one punch man","spy x family","black clover","frieren","kaiju no 8","dandadan"]]],Ld=[[320,["rick and morty","invincible","arcane","bojack horseman"]],[280,["south park","family guy","american dad","futurama","the simpsons"]],[250,["love death robots","harley quinn","archer","solar opposites"]],[220,["castlevania","blue eye samurai","the legend of vox machina","spawn","primal"]],[200,["big mouth","f is for family","disenchantment","inside job","smiling friends","hazbin hotel","helluva boss"]],[180,["boondocks","paradise pd","brickleberry","final space","scavengers reign","pantheon","undone","creature commandos"]]];function _r(e=""){return String(e).toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ı/g,"i").replace(/[^a-z0-9]+/g," ").trim()}function as(e){const t=String(e?.original_language||"").toLowerCase(),i=Array.isArray(e?.origin_country)?e.origin_country.map(n=>String(n).toUpperCase()):[];return["ja","zh","ko"].includes(t)||i.some(n=>["JP","CN","KR"].includes(n))}function Id(e,t=!1){const i=_r([e.name,e.title,e.original_name,e.original_title].filter(Boolean).join(" ")),n=t?Fs:[...rs,...Fs];for(const[a,r]of n)if(r.some(o=>i.includes(o)))return a;return 0}function Us(e){const t=_r([e.name,e.title,e.original_name,e.original_title].filter(Boolean).join(" "));for(const[i,n]of Ld)if(n.some(a=>t.includes(a)))return i;return 0}function bl(e){const t=_r([e.name,e.title,e.original_name,e.original_title].filter(Boolean).join(" "));return rs.some(([,i])=>i.some(n=>t.includes(n)))}function Rd(e){const t=_r([e.name,e.title,e.original_name,e.original_title].filter(Boolean).join(" "));for(const[i,n]of rs)if(n.some(a=>t.includes(a)))return i;return 0}function Sr(e,{animeOnly:t=!1}={}){return e.map(i=>{const n=Math.min(220,Number(i.popularity)||0),a=Math.min(95,Math.log10((Number(i.vote_count)||0)+1)*22),r=Math.max(0,(Number(i.vote_average)||0)-5)*5,o=!t&&i.origin_country?.includes("TR")?115:0,s=n+a+r+o+Id(i,t);return{...i,_turkeyPopularityScore:Math.round(s*100)/100}}).sort((i,n)=>n._turkeyPopularityScore-i._turkeyPopularityScore)}async function Ca(e=1){const[t,i,n,a,r]=await Promise.all([he("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16",without_genres:"27,80,53,10752,18","vote_count.gte":10,include_adult:!1}),he("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"10762",without_genres:"27,80,53","vote_count.gte":5,include_adult:!1}),he("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16",with_origin_country:"TR",without_genres:"27,80,53,10752,18",include_adult:!1}),he("/discover/tv",{sort_by:"vote_count.desc",page:e+2,language:"tr-TR",with_genres:"16",without_genres:"27,80,53,10752,18","vote_count.gte":10,include_adult:!1}),e===1?he("/trending/tv/week",{language:"tr-TR"}):Promise.resolve(null)]),o=(r?.results||[]).filter(d=>(d.genre_ids||[]).includes(16)),s=[...t?.results||[],...i?.results||[],...n?.results||[],...a?.results||[],...o],l=new Map;for(const d of s)d&&d.id&&!l.has(d.id)&&l.set(d.id,d);return Sr(Array.from(l.values()).filter(d=>(d.poster_path||d.backdrop_path)&&!Ve(d)).map(d=>({...d,type:"tv",media_type:"tv",isSeries:!0,overview:(d.overview||"").trim()||qe(d,"tv")})))}function $d(e){const t=new Map;for(const i of e)i?.id&&!t.has(i.id)&&t.set(i.id,i);return Sr(Array.from(t.values()).filter(i=>{const n=(i.genre_ids||[]).map(Number);return(i.poster_path||i.backdrop_path)&&n.includes(16)&&(n.includes(10751)||n.includes(10762)||bl(i))&&!as(i)&&Jt(i)&&!Ve(i)}).map(i=>({...i,type:"tv",media_type:"tv",isSeries:!0,overview:(i.overview||"").trim()||qe(i,"tv")})))}async function wl(e,t,i){const n=await Promise.all(t.map(([a,r])=>he("/discover/tv",{sort_by:i,page:e,language:"tr-TR",with_genres:"16",without_genres:"18,27,53,80,99,10752,10764,10766,10767","first_air_date.gte":a,"first_air_date.lte":r,include_adult:!1})));return $d(n.flatMap(a=>a?.results||[]))}async function js(e=1){return wl(e,[["2020-01-01","2099-12-31"],["2015-01-01","2019-12-31"]],"popularity.desc")}async function Ks(e=1){return wl(e,[["2010-01-01","2014-12-31"],["2000-01-01","2009-12-31"],["1990-01-01","1999-12-31"],["1900-01-01","1989-12-31"]],"vote_count.desc")}async function La(e=1){const[t,i,n]=await Promise.all([he("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16",without_genres:"10751,10762","vote_count.gte":80,include_adult:!1}),he("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"16",without_genres:"10751,10762","vote_average.gte":6.5,"vote_count.gte":150,include_adult:!1}),e===1?he("/trending/tv/week",{language:"tr-TR"}):Promise.resolve(null)]),a=(n?.results||[]).filter(o=>(o.genre_ids||[]).includes(16)),r=new Map;for(const o of[...t?.results||[],...i?.results||[],...a])o?.id&&!r.has(o.id)&&r.set(o.id,o);return Array.from(r.values()).filter(o=>{const s=(o.genre_ids||[]).map(Number);return(o.poster_path||o.backdrop_path)&&s.includes(16)&&!s.includes(10751)&&!s.includes(10762)&&!as(o)&&!bl(o)&&(e===1?Us(o)>0:!0)&&!Ve(o)}).map(o=>{const s=Math.min(250,Number(o.popularity)||0),l=Math.min(130,Math.log10((Number(o.vote_count)||0)+1)*30),d=Math.max(0,(Number(o.vote_average)||0)-5)*8;return{...o,type:"tv",media_type:"tv",isSeries:!0,overview:(o.overview||"").trim()||qe(o,"tv"),_adultAnimationScore:s+l+d+Us(o)}}).sort((o,s)=>s._adultAnimationScore-o._adultAnimationScore)}async function er(e=1){const t=[["2020-01-01","2099-12-31"],["2015-01-01","2019-12-31"],["2010-01-01","2014-12-31"],["2000-01-01","2009-12-31"],["1990-01-01","1999-12-31"],["1980-01-01","1989-12-31"],["1900-01-01","1979-12-31"]],i=await Promise.all(t.map(([a,r])=>he("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"16",without_genres:"27,80,53,99,10764,10766,10767","first_air_date.gte":a,"first_air_date.lte":r,include_adult:!1}))),n=new Map;for(const a of i)for(const r of a?.results||[])r?.id&&!n.has(r.id)&&n.set(r.id,r);return Array.from(n.values()).filter(a=>{const r=(a.genre_ids||[]).map(Number);return(a.poster_path||a.backdrop_path)&&r.includes(16)&&!r.includes(99)&&!as(a)&&!xr(a.name||a.title||"")&&!Ve(a)}).map(a=>{const r=parseInt(String(a.first_air_date||"").slice(0,4),10)||9999,o=Math.min(220,Number(a.popularity)||0),s=Math.min(115,Math.log10((Number(a.vote_count)||0)+1)*27),l=r<=2018?35:0;return{...a,type:"tv",media_type:"tv",isSeries:!0,overview:(a.overview||"").trim()||qe(a,"tv"),_cartoonScore:o+s+l+Rd(a)}}).sort((a,r)=>r._cartoonScore-a._cartoonScore)}async function Ia(e=1){const t=await he("/discover/movie",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"16,10751",without_genres:"27,80,53,10752","vote_count.gte":40});return!t||!t.results?[]:t.results.filter(i=>(i.poster_path||i.backdrop_path)&&!Ve(i)).map(i=>({...i,type:"movie",media_type:"movie",overview:(i.overview||"").trim()||qe(i,"movie")}))}async function Ws(e=1){const t=await he("/discover/movie",{sort_by:"vote_average.desc",page:e,language:"tr-TR",with_genres:"12,14,10751","vote_count.gte":150,without_genres:"27,80,53"});return!t||!t.results?[]:t.results.filter(i=>(i.poster_path||i.backdrop_path)&&!Ve(i)).map(i=>({...i,type:"movie",media_type:"movie",overview:(i.overview||"").trim()||qe(i,"movie")}))}async function kl(e="all",t="week",i=1){const[n,a]=await Promise.all([he(`/trending/${e}/${t}`,{page:i,language:"tr-TR"}),he(`/trending/${e}/${t}`,{page:i,language:"en-US"})]);if(!n||!n.results)return[];const r=new Map((a?.results||[]).map(o=>[o.id,o.overview]));return n.results.filter(o=>(o.poster_path||o.backdrop_path)&&!Ve(o)).map(o=>{const l=o.media_type==="tv"||!!o.first_air_date?"tv":"movie",d=(o.overview||"").trim(),p=(r.get(o.id)||"").trim();return{...o,type:l,media_type:l,overview:d||p||qe(o,l)}})}async function tr(e=1){const t=await he("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR","vote_count.gte":300,without_genres:"16"});return!t||!t.results?[]:t.results.filter(i=>(i.poster_path||i.backdrop_path)&&!Ve(i)).map(i=>{const n=(i.overview||"").trim();return{...i,type:"tv",media_type:"tv",overview:n||qe(i,"tv")}})}async function ir(e=1){const t=await he("/discover/movie",{sort_by:"vote_count.desc",page:e,language:"tr-TR","vote_count.gte":500});return!t||!t.results?[]:t.results.filter(i=>(i.poster_path||i.backdrop_path)&&!Ve(i)).map(i=>{const n=(i.overview||"").trim();return{...i,type:"movie",media_type:"movie",overview:n||qe(i,"movie")}})}function xr(e){return e?/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\u1100-\u11ff\u3130-\u318f\ua960-\ua97f\ud7b0-\ud7ff\u0600-\u06ff\u0400-\u04ff\u0e00-\u0e7f]/.test(e):!1}async function nr(e=1){const[t,i,n,a]=await Promise.all([he("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16",with_original_language:"ja","vote_count.gte":50}),he("/discover/tv",{sort_by:"popularity.desc",page:e,language:"en-US",with_genres:"16",with_original_language:"ja","vote_count.gte":50}),he("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"16",with_original_language:"ja","vote_count.gte":100}),e===1?he("/trending/tv/week",{language:"tr-TR"}):Promise.resolve(null)]);if(!t||!t.results)return[];const r=new Map((i?.results||[]).map(s=>[s.id,s.name||s.title])),o=new Map([...t.results||[],...n?.results||[],...(a?.results||[]).filter(s=>s.original_language==="ja"&&(s.genre_ids||[]).includes(16))].map(s=>[s.id,s]));return Sr(Array.from(o.values()).filter(s=>(s.poster_path||s.backdrop_path)&&!Ve(s)).map(s=>{let l=s.name||s.title||"";return(!l||xr(l))&&(l=r.get(s.id)||s.original_name||s.original_title||l),s.id&&_e(s.id),{...s,name:l,title:l,type:"anime",media_type:"anime",isAnime:!0,isSeries:!0,overview:s.overview||qe(s,"tv")}}),{animeOnly:!0})}async function Ra(e=1){const[t,i]=await Promise.all([he("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16,10762",with_original_language:"ja",without_genres:"27,80,53,10752,18","vote_count.gte":10}),he("/discover/tv",{sort_by:"popularity.desc",page:e,language:"en-US",with_genres:"16,10762",with_original_language:"ja",without_genres:"27,80,53,10752,18","vote_count.gte":10})]);if(!t||!t.results)return[];const n=new Map((i?.results||[]).map(a=>[a.id,a.name||a.title]));return Sr(t.results.filter(a=>(a.poster_path||a.backdrop_path)&&!Ve(a)).map(a=>{let r=a.name||a.title||"";return(!r||xr(r))&&(r=n.get(a.id)||a.original_name||a.original_title||r),a.id&&_e(a.id),{...a,name:r,title:r,type:"anime",media_type:"anime",isAnime:!0,isSeries:!0,overview:a.overview||qe(a,"tv")}}),{animeOnly:!0})}async function rr(e=1){const[t,i]=await Promise.all([he("/discover/movie",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"99","vote_count.gte":40}),he("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"99","vote_count.gte":30})]),n=(t?.results||[]).filter(r=>(r.poster_path||r.backdrop_path)&&!Ve(r)).map(r=>({...r,type:"movie",media_type:"movie",overview:(r.overview||"").trim()||qe(r,"movie")})),a=(i?.results||[]).filter(r=>(r.poster_path||r.backdrop_path)&&!Ve(r)).map(r=>({...r,type:"tv",media_type:"tv",overview:(r.overview||"").trim()||qe(r,"tv")}));return[...n,...a].sort((r,o)=>(o.vote_count||0)-(r.vote_count||0))}async function Md(e=1){const t=await he("/discover/movie",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"99,10751",without_genres:"27,80,53,10752","vote_count.gte":10}),i=await he("/discover/movie",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"99,16",without_genres:"27,80,53","vote_count.gte":5}),n=t?.results||[],a=i?.results||[],r=new Set,o=[];for(const l of[...n,...a])l&&l.id&&!r.has(l.id)&&(r.add(l.id),o.push(l));const s=["jackass","murder","killer","war","drug","crime","sex","violent","savaş","cinayet","uyuşturucu"];return o.filter(l=>{if(!(l.poster_path||l.backdrop_path)||Ve(l))return!1;const d=`${l.title||""} ${l.name||""} ${l.overview||""}`.toLowerCase();return!s.some(p=>d.includes(p))}).map(l=>({...l,type:"movie",media_type:"movie",overview:l.overview||qe(l,"movie")}))}async function ki(e="tv",t=1){const[i,n]=await Promise.all([he(`/${e}/top_rated`,{page:t,language:"tr-TR"}),he(`/${e}/top_rated`,{page:t,language:"en-US"})]);if(!i||!i.results)return[];const a=new Map((n?.results||[]).map(r=>[r.id,r.overview]));return Promise.all(i.results.filter(r=>(r.poster_path||r.backdrop_path)&&!Ve(r)).map(async r=>{let o=(r.overview||"").trim();const s=(a.get(r.id)||"").trim();return(!o||o.length<15)&&s&&s.length>10&&(o=await ns(s)),{...r,type:e,media_type:e,overview:o||s||qe(r,e)}}))}async function _l({type:e="tv",genreId:t=null,page:i=1,sortBy:n="popularity.desc",minRating:a=0,isAnime:r=!1,isDoc:o=!1,yearMin:s=null,yearMax:l=null,withNetworks:d=null,withProviders:p=null}){const h={sort_by:n,page:i,language:"tr-TR"};return r?(h.with_genres=t?`16,${t}`:"16",h.with_original_language="ja"):o?h.with_genres=t?`99,${t}`:"99":t&&(h.with_genres=t),a>0&&(h["vote_average.gte"]=a,h["vote_count.gte"]=40),s&&(e==="movie"?h["primary_release_date.gte"]=`${s}-01-01`:h["first_air_date.gte"]=`${s}-01-01`),l&&(e==="movie"?h["primary_release_date.lte"]=`${l}-12-31`:h["first_air_date.lte"]=`${l}-12-31`),d&&(e==="tv"?h.with_networks=d:(h.with_watch_providers=p||d,h.watch_region="TR")),((await he(e==="movie"?"/discover/movie":"/discover/tv",h))?.results||[]).filter(w=>(w.poster_path||w.backdrop_path)&&!Ve(w)).map(w=>(r&&w.id&&_e(w.id),{...w,type:r?"anime":e,media_type:r?"anime":e,isAnime:r,isSeries:e==="tv"}))}function qe(e,t="tv"){if(!e)return"Sürükleyici atmosferi ve zengin hikaye örgüsüyle izleyicileri ekran başına kilitleyen etkileyici bir yapım.";const i=e.title||e.name||"Bu yapım",n=t==="tv"||e.media_type==="tv"||!!e.first_air_date||e.seasons&&e.seasons.length>0||!!e.number_of_seasons,a=n?"dizi":"film";let r=[];Array.isArray(e.genres)&&e.genres.length>0&&(r=e.genres.map(b=>typeof b=="string"?b:b.name).filter(Boolean));const o=r.length>0?r.slice(0,3).join(", "):n?"Dram ve Gerilim":"Sinema",s=e.release_date||e.first_air_date||(e.year?String(e.year):""),l=s?` ${s.slice(0,4)} yılında izleyiciyle buluşan ve`:"",d=Number(e.vote_average||e.rating||0),p=d>0?`IMDb'de ${d.toFixed(1)}/10 gibi başarılı bir puana sahip olan`:"Eleştirmenler ve izleyiciler tarafından büyük beğeni toplayan";let h="";const f=e.credits?.cast||[];if(f.length>0){const b=f.slice(0,3).map(E=>E.name).filter(Boolean).join(", ");b&&(h=` Başrollerinde ${b} gibi başarılı isimlerin yer aldığı`)}let y="";const v=e.credits?.crew?.filter(b=>b.job==="Director").map(b=>b.name)||[],w=e.created_by?.map(b=>b.name)||[],k=v[0]||w[0];k&&(y=` ${k} imzalı`);let m="";return e.tagline&&e.tagline.trim().length>6&&(m=` "${e.tagline.trim()}" temasıyla dikkat çeken yapım,`),`${i}, ${o} türünde öne çıkan${l}${y}${h} etkileyici bir ${a} deneyimi sunuyor.${m} ${p} yapım, beklenmedik ters köşeleri, derin karakter gelişimleri ve soluksuz temposuyla izleyenlere unutulmaz anlar vadediyor.`}async function Ys(e="tv",t){const i=await he(`/${e}/${t}`,{append_to_response:"credits,similar,recommendations,videos,external_ids",language:"tr-TR"});if(!i)return null;(i.original_language==="ja"||Array.isArray(i.origin_country)&&i.origin_country.includes("JP"))&&Array.isArray(i.genres)&&i.genres.some(s=>s.id===16||/anim/i.test(s.name))&&i.id&&_e(i.id);let a=(i.overview||"").trim();if(!a||a.length<15)try{const s=await he(`/${e}/${t}`,{language:"en-US"});if(s&&s.overview&&s.overview.trim().length>10){const l=await ns(s.overview.trim());l&&l.length>15&&(i.overview=l)}}catch{}(!i.overview||i.overview.trim().length<15)&&(i.overview=qe(i,e));let r=i.videos?.results||[];if(!r.some(s=>s.site==="YouTube"&&(s.type==="Trailer"||s.type==="Teaser")))try{const l=(await he(`/${e}/${t}/videos`,{language:"en-US"}))?.results||[];l.length>0&&(i.videos=i.videos||{},i.videos.results=[...r,...l])}catch{}return i}const _n=new Map;function Zr(e,t){if(!e||e.site!=="YouTube"||!e.key)return-1;let n={Trailer:500,Teaser:360,Promo:280,"Opening Credits":240,Clip:160,Featurette:100}[e.type]||50;return e.official===!0&&(n+=1e3),t==="tr"?n+=50:t==="en"?n+=25:t==="ja"&&(n+=15),/official|resmi|final trailer|main trailer|tanıtım|fragman/i.test(e.name||"")&&(n+=80),/fan|concept|reaction|breakdown/i.test(e.name||"")&&(n-=800),n}function dn(e="tv",t,i=""){if(ft().trailersEnabled===!1)return Promise.resolve(null);const n=`${e}:${t}`;if(_n.has(n))return _n.get(n);const a=(async()=>{try{const[r,o,s]=await Promise.all([he(`/${e}/${t}/videos`,{language:"tr-TR"}).catch(()=>null),he(`/${e}/${t}/videos`,{language:"en-US"}).catch(()=>null),he(`/${e}/${t}/videos`,{include_video_language:"tr,en,ja,ko,null"}).catch(()=>null)]),l=new Set,d=[],p=(f,y)=>{if(Array.isArray(f))for(const v of f)v&&v.key&&!l.has(v.key)&&(l.add(v.key),d.push({video:v,language:y||v.iso_639_1||"en"}))};p(r?.results,"tr"),p(o?.results,"en"),p(s?.results,""),d.sort((f,y)=>Zr(y.video,y.language)-Zr(f.video,f.language));const h=d.find(f=>Zr(f.video,f.language)>=0)?.video;if(h?.key){const f=h.key.trim(),y=encodeURIComponent(f);return{key:f,name:h.name||"Resmi Fragman",site:h.site,type:h.type,embedUrl:`https://www.youtube.com/embed/${y}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,watchUrl:`https://www.youtube.com/watch?v=${y}`}}if(i&&typeof i=="string"&&i.trim().length>1){const f=i.trim(),y=`${f} Fragman`;return{key:"",name:`${f} Tanıtım`,site:"YouTube",type:"Trailer",embedUrl:`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(y)}&autoplay=1&rel=0`,watchUrl:`https://www.youtube.com/results?search_query=${encodeURIComponent(y)}`}}}catch{}return null})();return _n.set(n,a),a.then(r=>{r||_n.delete(n)}),a}async function Pd(e,t=1){const i=await he(`/tv/${e}/season/${t}`,{language:"tr-TR"});if(!i||!i.episodes)return i;const n=await he(`/tv/${e}/season/${t}`,{language:"en-US"});return await Promise.all(i.episodes.map(async(a,r)=>{let o=a.overview?a.overview.trim():"";(!o||o.length<5)&&n&&n.episodes&&n.episodes[r]&&n.episodes[r].overview&&(o=n.episodes[r].overview),o&&(!a.overview||a.overview.length<5)&&(a.overview=await ns(o))})),i}async function ss(e,t=1){if(!e||!e.trim())return[];const i=e.trim().toLowerCase(),[n,a,r]=await Promise.all([he("/search/multi",{query:i,page:t,language:"tr-TR",include_adult:!1}),he("/search/multi",{query:i,page:t,language:"en-US",include_adult:!1}),he("/search/tv",{query:i,page:t,language:"tr-TR",include_adult:!1})]),o=new Map,s=d=>{if(Array.isArray(d)){for(const p of d)if(!(!p||!p.id)&&!(!p.poster_path&&!p.backdrop_path)&&!Ve(p)&&!o.has(p.id)){const h=p.media_type==="tv"||!!p.first_air_date||p.name&&!p.title;o.set(p.id,{...p,type:h?"tv":"movie",media_type:h?"tv":"movie"})}}};s(n?.results),s(a?.results),s(r?.results);const l=Array.from(o.values());return l.sort((d,p)=>{const h=(d.title||d.name||d.original_title||d.original_name||"").toLowerCase(),f=(p.title||p.name||p.original_title||p.original_name||"").toLowerCase(),y=h===i?100:h.startsWith(i)?50:0,v=f===i?100:f.startsWith(i)?50:0,w=y+Math.min(100,(d.vote_count||0)/50)+(d.popularity||0)*.5;return v+Math.min(100,(p.vote_count||0)/50)+(p.popularity||0)*.5-w}),l}const gt={ACTION_ADVENTURE:10759,ANIMATION:16,COMEDY:35,CRIME:80,DOCUMENTARY:99,DRAMA:18,FAMILY:10751,MYSTERY:9648,SCI_FI_FANTASY:10765,WAR_POLITICS:10768,WESTERN:37},Ye={ACTION:28,ADVENTURE:12,ANIMATION:16,COMEDY:35,CRIME:80,DOCUMENTARY:99,DRAMA:18,FAMILY:10751,FANTASY:14,HISTORY:36,HORROR:27,MUSIC:10402,MYSTERY:9648,ROMANCE:10749,SCI_FI:878,THRILLER:53,WESTERN:37};async function Bd(e){if(!e)return null;const t=await he(`/person/${e}`,{language:"tr-TR",append_to_response:"combined_credits"});if(!t||!t.biography||t.biography.trim().length===0){const i=await he(`/person/${e}`,{language:"en-US",append_to_response:"combined_credits"});if(i)if(t)t.biography=i.biography,!t.combined_credits&&i.combined_credits&&(t.combined_credits=i.combined_credits);else return i}return t}function te(e,t="info",i=3500){const n=document.getElementById("toast-container");if(!n)return;const a=document.createElement("div");a.className=`toast toast-${t}`;let r="info";t==="success"&&(r="check-circle"),t==="error"&&(r="alert-circle"),a.innerHTML=`
    <i data-lucide="${r}"></i>
    <span>${e}</span>
  `,n.appendChild(a),V(),setTimeout(()=>{a.style.opacity="0",a.style.transform="translateX(100%)",a.style.transition="all 0.3s ease-out",setTimeout(()=>{a.parentNode&&a.parentNode.removeChild(a)},300)},i)}const ht="https://api.trakt.tv",Dd="AsVFyJXykTMViLCXPMAvFGtk7B_npj5Y3STpzljYnwY",Od="4b6l8YaAG-GzyY6cSPFR5ea66xrXYEqrrHhn3FiWa7k",ot={TOKEN:"cinepulse_trakt_token",USER:"cinepulse_trakt_user",SETTINGS:"cinepulse_trakt_settings",LAST_SYNC:"cinepulse_trakt_last_sync"};let si=null,ar=null,sr=0;function Er(){return localStorage.getItem("cinepulse_trakt_custom_client_id")||Dd}function Sl(){return localStorage.getItem("cinepulse_trakt_custom_client_secret")||Od}function Oi(){try{const e=localStorage.getItem(ot.SETTINGS);if(e)return JSON.parse(e)}catch{}return{autoScrobble:!0,scrobbleThreshold:80,autoSyncOnLaunch:!0}}function Vs(e){const i={...Oi(),...e};return localStorage.setItem(ot.SETTINGS,JSON.stringify(i)),i}const Gs=15*60*1e3;let Js=!1,Qr=!1,xl=0;function El(e){if(Js){Xt()&&Xs(e);return}Js=!0;const t=()=>{document.visibilityState!=="hidden"&&(Date.now()-xl<Gs||Xs(e))};window.setTimeout(t,4e3),window.setInterval(t,Gs),document.addEventListener("visibilitychange",t)}async function Xs(e){if(!(!Oi().autoSyncOnLaunch||!Xt()||Qr)){Qr=!0,xl=Date.now();try{(await Al(e)).errors.length}catch{}finally{Qr=!1}}}function Tl(){try{const e=localStorage.getItem(ot.TOKEN);return e?JSON.parse(e):null}catch{return null}}function Xt(){const e=Tl();return!!(e&&e.access_token)}function Nd(){try{const e=localStorage.getItem(ot.USER);return e?JSON.parse(e):null}catch{return null}}function zd(){const e=localStorage.getItem(ot.LAST_SYNC);return e?Number(e):null}async function di(){const e=Tl();if(!e||!e.access_token)return null;const t=Math.floor(Date.now()/1e3);if((e.created_at||0)+(e.expires_in||0)-t<86400&&e.refresh_token)try{const n=await Fd(e.refresh_token);if(n?.access_token)return n.access_token}catch{}return e.access_token}async function Hd(){const e=Er(),t=await fetch(`${ht}/oauth/device/code`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({client_id:e})});if(!t.ok){const i=await t.text();throw new Error(`Device code error (${t.status}): ${i}`)}return await t.json()}function qd(e,t=5,i=()=>{}){si&&si.abort(),si=new AbortController;const{signal:n}=si;return new Promise((a,r)=>{const o=Er(),s=Sl();let l=Math.max(t,5)*1e3;const d=async()=>{if(n.aborted){r(new Error("Auth polling cancelled"));return}try{const p=await fetch(`${ht}/oauth/device/token`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:e,client_id:o,client_secret:s}),signal:n});if(p.status===200){const f=await p.json();localStorage.setItem(ot.TOKEN,JSON.stringify(f));let y=null;try{y=await jd(f.access_token),y&&localStorage.setItem(ot.USER,JSON.stringify(y))}catch{}window.dispatchEvent(new CustomEvent("cinepulse_trakt_auth_changed",{detail:{connected:!0,user:y}})),a(f);return}if(p.status===400){i({status:"pending",message:"Kullanıcı onayı bekleniyor..."}),n.aborted||setTimeout(d,l);return}if(p.status===404)throw new Error("Geçersiz cihaz kodu.");if(p.status===409)throw new Error("Bu kod zaten kullanılmış.");if(p.status===410)throw new Error("Kodun süresi doldu. Lütfen tekrar deneyin.");if(p.status===429){l+=2e3,n.aborted||setTimeout(d,l);return}const h=await p.text();throw new Error(`Trakt auth failed: ${h}`)}catch(p){if(n.aborted)return;r(p)}};setTimeout(d,l)})}function $a(){si&&(si.abort(),si=null)}async function Fd(e){const t=Er(),i=Sl(),n=await fetch(`${ht}/oauth/token`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refresh_token:e,client_id:t,client_secret:i,grant_type:"refresh_token"})});if(!n.ok)throw new Error("Token refresh failed");const a=await n.json();return localStorage.setItem(ot.TOKEN,JSON.stringify(a)),a}function Ud(){$a(),localStorage.removeItem(ot.TOKEN),localStorage.removeItem(ot.USER),localStorage.removeItem(ot.LAST_SYNC),window.dispatchEvent(new CustomEvent("cinepulse_trakt_auth_changed",{detail:{connected:!1}}))}function Pt(e){return{"Content-Type":"application/json","trakt-api-version":"2","trakt-api-key":Er(),Authorization:`Bearer ${e}`}}async function jd(e=null){const t=e||await di();if(!t)return null;const i=await fetch(`${ht}/users/me?extended=full`,{headers:Pt(t)});if(!i.ok)return null;const n=await i.json();return localStorage.setItem(ot.USER,JSON.stringify(n)),n}function os(e,t=0){const i=Math.min(100,Math.max(0,Math.round(t))),n=e.tmdbId||e.id;return(e.isSeries===!0?!0:e.isSeries===!1||e.type==="movie"?!1:!!(e.type==="tv"||e.season&&Number(e.season)>0&&e.type!=="movie"))?{show:{title:e.seriesTitle||e.title||"",ids:{tmdb:Number(n)||void 0}},episode:{season:Math.max(1,Number(e.season)||1),number:Math.max(1,Number(e.episode)||1)},progress:i,app_version:"2.0.0",app_date:"2026-09-25"}:{movie:{title:e.title||"",ids:{tmdb:Number(n)||void 0}},progress:i,app_version:"2.0.0",app_date:"2026-09-25"}}async function fm(e,t=0){if(!Oi().autoScrobble||!Xt())return null;const n=Date.now();if(ar==="start"&&n-sr<8e3)return null;const a=await di();if(!a)return null;try{const r=os(e,t),o=await fetch(`${ht}/scrobble/start`,{method:"POST",headers:Pt(a),body:JSON.stringify(r)});if(o.ok)return ar="start",sr=n,await o.json()}catch{}return null}async function mm(e,t=0){if(!Oi().autoScrobble||!Xt())return null;const n=await di();if(!n)return null;try{const a=os(e,t),r=await fetch(`${ht}/scrobble/pause`,{method:"POST",headers:Pt(n),body:JSON.stringify(a),keepalive:!0});if(r.ok)return ar="pause",sr=Date.now(),await r.json()}catch{}return null}async function gm(e,t=100){if(!Oi().autoScrobble||!Xt())return null;const n=await di();if(!n)return null;try{const a=os(e,t),r=await fetch(`${ht}/scrobble/stop`,{method:"POST",headers:Pt(n),body:JSON.stringify(a),keepalive:!0});if(r.ok)return ar="stop",sr=Date.now(),await r.json()}catch{}return null}async function Kd(e){const t=await di();if(!t||!e||!e.length)return null;const i=[],n=new Map;for(const s of e){const l=s.tmdbId||s.id,d=Number(l);if(!d||isNaN(d))continue;const p=new Date(Number(s.lastWatchedAt)||s.lastWatchedAt||Date.now()),h=Number.isNaN(p.getTime())?new Date().toISOString():p.toISOString();if(s.type==="movie"?!1:!!(s.isSeries||s.type==="tv"||s.type==="anime")){const y=Math.max(1,Number(s.season)||1),v=Math.max(1,Number(s.episode)||1);n.has(d)||n.set(d,{title:s.title||"",ids:{tmdb:d},seasonsMap:new Map});const w=n.get(d);w.seasonsMap.has(y)||w.seasonsMap.set(y,[]),w.seasonsMap.get(y).push({number:v,watched_at:h})}else i.push({title:s.title||"",watched_at:h,ids:{tmdb:d}})}const a=Array.from(n.values()).map(s=>({title:s.title,ids:s.ids,seasons:Array.from(s.seasonsMap.entries()).map(([l,d])=>({number:l,episodes:d}))}));if(i.length===0&&a.length===0)return null;const r={};i.length>0&&(r.movies=i),a.length>0&&(r.shows=a);const o=await fetch(`${ht}/sync/history`,{method:"POST",headers:Pt(t),body:JSON.stringify(r)});if(!o.ok){const s=await o.text();throw new Error(`Trakt API Hatası (${o.status}): ${s}`)}return await o.json()}const Wd="4e44d9029b1270a757cddc766a1bcb63",ea=new Map;async function ta(e,t=!1){const i=`${t?"tv":"movie"}_${e}`;if(ea.has(i))return ea.get(i);try{const a=await fetch(`https://api.themoviedb.org/3/${t?"tv":"movie"}/${e}?api_key=${Wd}&language=tr-TR`);if(a.ok){const r=await a.json();return ea.set(i,r),r}}catch{}return null}async function Zs(e,t){const i=[],n=new Set,a=e==="shows"?100:250;for(let r=1;;r++){const o=new URLSearchParams({page:String(r),limit:String(a)});e==="shows"&&o.set("extended","progress");const s=await fetch(`${ht}/sync/watched/${e}?${o}`,{headers:Pt(t)});if(!s.ok)throw new Error(`İzlenen ${e==="shows"?"diziler":"filmler"} alınamadı (${s.status})`);const l=await s.json();if(!Array.isArray(l))throw new Error("Trakt izlenenler yanıtı geçersiz");if(l.length===0)break;let d=0;for(const h of l){const f=h[e==="shows"?"show":"movie"]?.ids?.trakt;f&&n.has(f)||(f&&n.add(f),i.push(h),d++)}if(!d)break;const p=Number(s.headers?.get("X-Pagination-Page-Count"));if(p&&r>=p||!p&&l.length<a)break}return i}async function Yd(e){const t=await di();if(!t)return{importedPlaybackCount:0,importedHistoryCount:0};const{saveWatchProgress:i,saveBatchWatchProgress:n,getWatchHistory:a}=e;if(!i&&!n)return{importedPlaybackCount:0,importedHistoryCount:0};let r=0,o=0;const s=[],l=[],d=a?a():[],p=new Map;for(const h of d){const f=`${h.id}_${h.season||1}_${h.episode||1}`;p.set(f,h)}try{const h=await fetch(`${ht}/sync/playback?extended=full&limit=50`,{headers:Pt(t),signal:AbortSignal.timeout(8e3)});if(h.ok){const f=await h.json();if(Array.isArray(f)){for(const y of f){const v=y.type==="movie",w=v?y.movie:y.show||y.episode,k=v?y.movie?.ids?.tmdb||w?.ids?.tmdb:y.show?.ids?.tmdb||y.episode?.ids?.tmdb||w?.ids?.tmdb;if(!k)continue;const m=v?1:y.episode?.season||1,b=v?1:y.episode?.number||1,E=Math.min(99,Math.max(1,Math.round(y.progress||0))),C=y.paused_at?new Date(y.paused_at).getTime():Date.now(),x=`${k}_${m}_${b}`,T=p.get(x);let R=T?.poster_path||T?.posterPath||"",L=T?.backdrop_path||T?.backdropPath||"",D=T?.title||y.show?.title||w?.title||"",N=v?6600:3e3,U={};if(!R||!D){const O=await ta(k,!v);O&&(R=O.poster_path||"",L=O.backdrop_path||"",D=O.title||O.name||D,O.runtime?N=O.runtime*60:O.episode_run_time?.[0]&&(N=O.episode_run_time[0]*60),v||(U={number_of_episodes:O.number_of_episodes,number_of_seasons:O.number_of_seasons,status:O.status,seasons:O.seasons}))}const j=Math.max(60,Math.round(E/100*N));l.push({id:k,title:D,posterPath:R,backdropPath:L,type:v?"movie":"tv",isSeries:!v,season:v?void 0:m,episode:v?void 0:b,currentTime:j,duration:N,progressPercent:E,completed:!1,traktImported:!0,lastWatchedAt:C,...U}),r++}l.length>0&&(n?n(l):i&&l.forEach(y=>i(y)),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{action:"playback_import",source:"trakt"}})))}}}catch(h){s.push(h.message)}try{{const h=await Zs("movies",t);if(Array.isArray(h))for(let f=0;f<h.length;f+=5){const y=h.slice(f,f+5);await Promise.all(y.map(async v=>{const w=v.movie?.ids?.tmdb;if(!w)return;const k=`${w}_1_1`,m=p.get(k);if(m&&m.completed)return;const b=v.last_watched_at?new Date(v.last_watched_at).getTime():Date.now();let E=m?.poster_path||m?.posterPath||"",C=m?.backdrop_path||m?.backdropPath||"",x=m?.title||v.movie?.title||"",T=6600;if(!E||!x){const R=await ta(w,!1);R&&(E=R.poster_path||"",C=R.backdrop_path||"",x=R.title||x,R.runtime&&(T=R.runtime*60))}l.push({id:w,title:x,posterPath:E,backdropPath:C,type:"movie",isSeries:!1,currentTime:T,duration:T,progressPercent:100,completed:!0,traktImported:!0,lastWatchedAt:b}),o++}))}}}catch(h){s.push(h.message)}try{{const h=await Zs("shows",t);if(Array.isArray(h))for(let f=0;f<h.length;f+=4){const y=h.slice(f,f+4);await Promise.all(y.map(async v=>{const w=v.show?.ids?.tmdb;if(!w)return;const k=v.show?.title||"",m=await ta(w,!0),b=m?.poster_path||"",E=m?.backdrop_path||"",C=m?.name||m?.title||k,x=m?.episode_run_time?.[0]?m.episode_run_time[0]*60:3e3,T={number_of_episodes:m?.number_of_episodes,number_of_seasons:m?.number_of_seasons,status:m?.status,seasons:m?.seasons},R=Array.isArray(v.seasons)?v.seasons:[];for(const L of R){const D=L.number,N=Array.isArray(L.episodes)?L.episodes:[];for(const U of N){const j=U.number,O=`${w}_${D}_${j}`,B=p.get(O);if(B&&B.completed)continue;const W=U.last_watched_at?new Date(U.last_watched_at).getTime():Date.now();l.push({id:w,title:C,posterPath:b,backdropPath:E,type:"tv",isSeries:!0,season:D,episode:j,currentTime:x,duration:x,progressPercent:100,completed:!0,traktImported:!0,lastWatchedAt:W,...T}),o++}}}))}}}catch(h){s.push(h.message)}if(l.length>0){if(n)n(l);else if(i)for(const h of l)i(h)}return window.dispatchEvent(new CustomEvent("cinepulse_data_changed",{detail:{action:"import",source:"trakt"}})),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{action:"import",source:"trakt"}})),{importedPlaybackCount:r,importedHistoryCount:o,errors:s}}async function Al(e){if(!Xt())throw new Error("Trakt hesabı bağlı değil");const{getWatchHistory:t,saveWatchProgress:i,saveBatchWatchProgress:n}=e,a={pushedMoviesCount:0,pushedEpisodesCount:0,importedPlaybackCount:0,importedHistoryCount:0,errors:[]};if(i||n)try{const r=await Yd(e);a.importedPlaybackCount=r.importedPlaybackCount||0,a.importedHistoryCount=r.importedHistoryCount||0,a.errors.push(...r.errors||[])}catch(r){a.errors.push(`Trakt'tan aktarma: ${r.message}`)}try{const o=(t?t():[]).filter(s=>s.completed&&!s.traktImported);if(o.length>0){const s=await Kd(o);if(s&&s.added){a.pushedMoviesCount=s.added.movies||0,a.pushedEpisodesCount=s.added.episodes||0;const l=Object.values(s.not_found||{}).reduce((d,p)=>d+(Array.isArray(p)?p.length:0),0);l&&a.errors.push(`Trakt ${l} içeriği katalogunda bulamadı`)}}}catch(r){a.errors.push(`Trakt'a gönderme: ${r.message||"Senkronizasyon hatası"}`)}return a.errors.length===0&&localStorage.setItem(ot.LAST_SYNC,String(Date.now())),a}async function Vd(){const e=await di();if(!e)throw new Error("Trakt hesabı bağlı değil");const t=await fetch(`${ht}/sync/history?limit=1000`,{headers:Pt(e)});if(!t.ok)throw new Error("Trakt geçmişi alınamadı");const i=await t.json();if(!Array.isArray(i)||i.length===0)return 0;const n=i.map(o=>o.id).filter(Boolean);if(n.length===0)return 0;const a=await fetch(`${ht}/sync/history/remove`,{method:"POST",headers:Pt(e),body:JSON.stringify({ids:n})});if(!a.ok){const o=await a.text();throw new Error(`Trakt geçmişi silinemedi: ${o}`)}const r=await a.json();return(r.deleted?.movies||0)+(r.deleted?.episodes||0)}let Qt=null;function or(){let e=document.getElementById("trakt-modal");e||(e=document.createElement("div"),e.id="trakt-modal",e.className="modal-backdrop",document.body.appendChild(e));const t=(a="main",r={})=>{const o=Xt(),s=Nd(),l=Oi(),d=zd();let p="Henüz yapılmadı";if(d){const h=new Date(d);p=`${h.toLocaleDateString("tr-TR")} ${h.toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})}`}if(a==="connecting"){const{userCode:h,verificationUrl:f,expiresIn:y}=r;e.innerHTML=`
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
      `;e.classList.remove("hidden"),document.body.style.overflow="hidden",V(e),n(a)},i=()=>{$a(),e.classList.add("hidden"),e.innerHTML="",document.body.style.overflow="",Qt&&(window.removeEventListener("keydown",Qt),Qt=null)},n=a=>{const r=document.getElementById("trakt-close-btn"),o=document.getElementById("trakt-close-footer-btn");if(r&&(r.onclick=i),o&&(o.onclick=i),e.onclick=s=>{s.target===e&&i()},Qt&&window.removeEventListener("keydown",Qt),Qt=s=>{s.key==="Escape"&&i()},window.addEventListener("keydown",Qt),a==="connecting"){const s=document.getElementById("btn-copy-trakt-code");s&&(s.onclick=()=>{const d=s.querySelector(".trakt-code-text")?.textContent;d&&navigator.clipboard.writeText(d).then(()=>{te("Aktivasyon kodu kopyalandı!","success")}).catch(()=>{te(`Kod: ${d}`,"info")})});const l=document.getElementById("btn-cancel-trakt-poll");l&&(l.onclick=()=>{$a(),t("main")})}else{const s=document.getElementById("btn-start-trakt-connect");s&&(s.onclick=async()=>{s.disabled=!0,s.innerHTML="<span>Kod alınıyor...</span>";try{const v=await Hd();t("connecting",{userCode:v.user_code,verificationUrl:v.verification_url,expiresIn:v.expires_in}),qd(v.device_code,v.interval,w=>{const k=document.getElementById("trakt-poll-status-text");k&&(k.textContent=w.message)}).then(()=>{te("Trakt.tv başarıyla bağlandı!","success"),t("main")}).catch(w=>{w.message!=="Auth polling cancelled"&&(te(`Bağlantı hatası: ${w.message}`,"error"),t("main"))})}catch(v){te(`Trakt bağlantı başlatılamadı: ${v.message}`,"error"),t("main")}});const l=document.getElementById("btn-trakt-sync-now");l&&(l.onclick=async()=>{const v=document.getElementById("trakt-sync-icon"),w=document.getElementById("trakt-sync-result");l.disabled=!0,v&&v.classList.add("trakt-spin");try{const k=await Al({getWatchHistory:Be,saveWatchProgress:es,saveBatchWatchProgress:ul});w&&(w.style.display="block",w.innerHTML=`
                <strong>${k.errors.length?"Senkronizasyon kısmen tamamlandı":"✓ Karşılıklı senkronizasyon tamamlandı!"}</strong><br/>
                • ${k.pushedMoviesCount} film & ${k.pushedEpisodesCount} dizi Trakt'a yüklendi<br/>
                • ${k.importedPlaybackCount} yarım kalan & ${k.importedHistoryCount} izlenen Trakt'tan CinePulse'a aktarıldı
              `),k.errors.length?te(`Trakt senkronizasyon uyarısı: ${k.errors.join("; ")}`,"error"):(te("CinePulse ve Trakt başarıyla karşılıklı eşitlendi!","success"),setTimeout(()=>t("main"),2500))}catch(k){te(`Aktarım hatası: ${k.message}`,"error")}finally{l.disabled=!1,v&&v.classList.remove("trakt-spin")}});const d=document.getElementById("btn-clean-trakt-history");d&&(d.onclick=()=>{const v=ld();te(`${v} adet hatalı Trakt kaydı geçmişten temizlendi!`,"success"),t("main")});const p=document.getElementById("btn-wipe-trakt-history");p&&(p.onclick=async()=>{if(confirm("Trakt.tv hesabınızdaki tüm izleme geçmişini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")){p.disabled=!0,p.innerHTML="<span>Sıfırlanıyor...</span>";try{const v=await Vd();te(`Trakt hesabından ${v} adet kayıt tamamen silindi!`,"success"),t("main")}catch(v){te(`Hata: ${v.message}`,"error"),p.disabled=!1,t("main")}}});const h=document.getElementById("trakt-toggle-autosync");h&&(h.onchange=v=>{Vs({autoSyncOnLaunch:v.target.checked}),te(v.target.checked?"Açılışta otomatik eşitleme açıldı":"Açılışta otomatik eşitleme kapatıldı","info")});const f=document.getElementById("trakt-toggle-scrobble");f&&(f.onchange=v=>{Vs({autoScrobble:v.target.checked}),te(v.target.checked?"Otomatik Scrobble açıldı":"Otomatik Scrobble kapatıldı","info")});const y=document.getElementById("btn-trakt-disconnect");y&&(y.onclick=()=>{confirm("Trakt.tv bağlantısını kesmek istediğinize emin misiniz?")&&(Ud(),te("Trakt.tv bağlantısı kesildi","info"),t("main"))})}};t("main")}function Cl(){const e=document.getElementById("data-modal");if(!e)return;const t=vd();e.innerHTML=`
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
  `,e.classList.remove("hidden"),document.body.style.overflow="hidden",V();const i=document.getElementById("data-close-btn"),n=document.getElementById("data-close-footer-btn");let a=null;const r=()=>{e.classList.add("hidden"),e.innerHTML="",document.body.style.overflow="",a&&(window.removeEventListener("keydown",a),a=null)};i&&i.addEventListener("click",r),n&&n.addEventListener("click",r),e.onclick=f=>{f.target===e&&r()},a=f=>{f.key==="Escape"&&r()},window.addEventListener("keydown",a);const o=document.getElementById("btn-export-json");o&&o.addEventListener("click",()=>{yl(),te("JSON yedek dosyası indirildi!","success")});const s=document.getElementById("btn-open-trakt-from-data");s&&s.addEventListener("click",()=>{r(),or()});const l=document.getElementById("json-dropzone"),d=document.getElementById("json-file-input");l&&d&&(l.addEventListener("click",()=>d.click()),l.addEventListener("dragover",f=>{f.preventDefault(),l.style.borderColor="var(--accent-green)"}),l.addEventListener("dragleave",()=>{l.style.borderColor="rgba(99, 102, 241, 0.4)"}),l.addEventListener("drop",f=>{f.preventDefault(),l.style.borderColor="rgba(99, 102, 241, 0.4)",f.dataTransfer.files.length>0&&p(f.dataTransfer.files[0])}),d.addEventListener("change",f=>{f.target.files.length>0&&p(f.target.files[0])}));function p(f){if(!f)return;const y=new FileReader;y.onload=v=>{try{const w=document.querySelector('input[name="import-mode"]:checked'),k=w?w.value:"merge",m=vl(v.target.result,k);m.success?(te(`✓ Yedek yüklendi! (${m.countHistory} izleme kaydı, ${m.countFavs} favori aktarıldı)`,"success"),r()):te(`Yükleme hatası: ${m.message||m.error}`,"error")}catch(w){te(`Yedek dosyası işlenirken hata oluştu: ${w.message}`,"error")}},y.onerror=()=>{te("Dosya okunamadı.","error")},y.readAsText(f)}const h=document.getElementById("btn-clear-all-data");h&&h.addEventListener("click",()=>{confirm("Tüm izleme geçmişinizi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!")&&(bd(),te("Tüm yerel veriler temizlendi.","info"),r())})}let _i=null,tn=!1;function lr(){return window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===!0||document.referrer.includes("android-app://")}function Gd(){if(lr()){tn=!0,Fi(!1);return}window.addEventListener("beforeinstallprompt",t=>{t.preventDefault(),_i=t,Fi(!0)}),window.addEventListener("appinstalled",()=>{_i=null,tn=!0,Fi(!1),te("CinePulse başarıyla cihazınıza yüklendi!","success")}),window.matchMedia("(display-mode: standalone)").addEventListener("change",t=>{t.matches&&(tn=!0,Fi(!1))}),/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream&&!lr()&&setTimeout(()=>{Fi(!0)},1e3)}function Fi(e){document.querySelectorAll(".btn-pwa-install").forEach(i=>{e&&!tn&&!lr()?i.classList.remove("hidden"):i.classList.add("hidden")})}async function Jd(){if(lr()||tn){te("CinePulse zaten bir uygulama olarak yüklü.","info");return}if(_i){try{_i.prompt(),(await _i.userChoice).outcome==="accepted"?te("Yükleme başlatıldı...","success"):te("Yükleme iptal edildi.","info"),_i=null}catch{}return}/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream?Xd():Zd()}function Xd(){let e=document.getElementById("pwa-ios-modal");e||(e=document.createElement("div"),e.id="pwa-ios-modal",e.className="modal-backdrop pwa-guide-modal",e.innerHTML=`
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
    `,document.body.appendChild(e),e.querySelector(".pwa-close-btn").addEventListener("click",()=>{e.classList.add("hidden")}),e.querySelector(".pwa-done-btn").addEventListener("click",()=>{e.classList.add("hidden")}),e.addEventListener("click",t=>{t.target===e&&e.classList.add("hidden")})),e.classList.remove("hidden")}function Zd(){te('Tarayıcınızın adres çubuğundaki "Yükle / Uygulamayı Yükle" simgesine tıklayarak indirebilirsiniz.',"info",5e3)}const Qs="1.1.0",Qd="https://raw.githubusercontent.com/caca1403/cine-pulse/main/public/version.json",Ll="cinepulse_update_snoozed_until";function eu(){return typeof window>"u"?!1:!!(window.Capacitor?.isNativePlatform?.()||window.Capacitor?.getPlatform?.()==="android"||navigator.userAgent.includes("CinePulseAndroid"))}function tu(e,t){if(!e||!t)return!1;const i=d=>String(d).replace(/^v/i,"").split(".").map(p=>parseInt(p,10)||0),[n,a,r]=i(e),[o,s,l]=i(t);return n>o||n===o&&a>s||n===o&&a===s&&r>l}function iu(e){if(document.getElementById("cinepulse-update-modal"))return;const t=document.createElement("div");t.id="cinepulse-update-modal",t.className="cinepulse-modal-overlay",t.style.cssText=`
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
`).filter(Boolean).map(r=>`<li style="margin-bottom: 0.45rem;">${eo(r.replace(/^[•\-\*]\s*/,""))}</li>`).join("");t.innerHTML=`
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
        ${eo(e.title||`CinePulse v${e.version}`)}
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
  `,document.body.appendChild(t),V(t);const n=t.querySelector("#btn-update-later");n&&n.addEventListener("click",()=>{try{localStorage.setItem(Ll,String(Date.now()+12*60*60*1e3))}catch{}t.remove()});const a=t.querySelector("#btn-update-download");a&&a.addEventListener("click",()=>{te("APK indirmesi başlatılıyor...","info"),setTimeout(()=>{try{t.remove()}catch{}},1500)})}function eo(e=""){return String(e).replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t])}async function Il({manual:e=!1}={}){if(!e)try{const t=parseInt(localStorage.getItem(Ll)||"0",10);if(Date.now()<t)return null}catch{}try{const t=await fetch(`${Qd}?_t=${Date.now()}`,{signal:AbortSignal.timeout(6e3),cache:"no-store"});if(!t.ok)throw new Error(`HTTP ${t.status}`);const i=await t.json();if(i&&tu(i.version,Qs))return iu(i),i;if(e)return te(`✓ CinePulse güncel (v${Qs})`,"success"),null}catch{return e&&te("Güncelleme sunucusuna erişilemedi.","error"),null}}function nu(){typeof window>"u"||window.setTimeout(()=>{Il({manual:!1}).catch(()=>{})},4e3)}let Hn=null;function ru(){zt();const e=document.createElement("div");e.id="profile-modal-root",e.className="profile-backdrop",document.body.appendChild(e),Hn=e;const t=(n="select")=>{const a=Vt(),r=mn();n==="select"?e.innerHTML=`
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
            ${a.map(w=>{const k=w.id===r.id,m=w.id!=="prof_1";return`
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
                  ${m?`
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
            ${eu()?`
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
      `),V(e);const o=e.querySelector("#btn-close-profile-modal");o&&(o.onclick=()=>zt());const s=e.querySelector("#btn-show-add-profile");s&&(s.onclick=()=>t("add")),e.querySelectorAll(".btn-delete-profile").forEach(w=>{w.onclick=k=>{k.stopPropagation();const m=w.getAttribute("data-delete-id"),b=Vt().find(C=>C.id===m);if(!b||!confirm(`"${b.name}" profilini silmek istediğinize emin misiniz?`))return;td(m)?(te(`"${b.name}" profili silindi.`,"info"),t("select")):te("Bu profil silinemez.","error")}});const l=e.querySelector("#btn-modal-open-trakt");l&&(l.onclick=()=>{zt(),or()});const d=e.querySelector("#btn-modal-open-backup");d&&(d.onclick=()=>{zt(),Cl()});const p=e.querySelector("#btn-modal-pwa-install");p&&(p.onclick=()=>{Jd()});const h=e.querySelector("#btn-modal-check-update");h&&(h.onclick=()=>{Il({manual:!0})}),e.querySelectorAll(".profile-card[data-profile-id]").forEach(w=>{w.onclick=()=>{const k=w.getAttribute("data-profile-id");if(k){const m=Vt().find(b=>b.id===k);Xn(k),zt(),to(m)}}});const f=e.querySelector("#btn-cancel-add-profile");f&&(f.onclick=()=>t("select"));const y=e.querySelector("#btn-back-to-profiles");y&&(y.onclick=()=>t("select"));const v=e.querySelector("#form-add-profile");if(v){let w="#f59e0b";v.querySelectorAll(".color-dot").forEach(k=>{k.onclick=()=>{v.querySelectorAll(".color-dot").forEach(m=>m.classList.remove("active")),k.classList.add("active"),w=k.getAttribute("data-color")}}),v.onsubmit=k=>{k.preventDefault();const m=v.querySelector("#new-profile-name"),b=v.querySelector("#new-profile-kid-check"),E=m?m.value.trim():"",C=b?b.checked:!1;if(E){const x=ed({name:E,isKid:C,avatar:C?"smile":"user",color:w});Xn(x.id),zt(),to(x)}}}};t("select"),e.onclick=n=>{n.target===e&&zt()};const i=n=>{n.key==="Escape"&&(zt(),window.removeEventListener("keydown",i))};window.addEventListener("keydown",i)}function zt(){if(Hn){try{Hn.remove()}catch{}Hn=null}}function to(e){const t=document.getElementById("profile-switch-curtain");t&&t.remove();const i=document.createElement("div");i.id="profile-switch-curtain",i.className="profile-switch-curtain is-entering",i.innerHTML=`
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
  `,document.body.appendChild(i),V(i),window.dispatchEvent(new CustomEvent("sineflix_profile_changed",{detail:{profile:e}})),setTimeout(()=>{i.classList.remove("is-entering"),i.classList.add("is-leaving"),setTimeout(()=>{i.remove()},450)},600)}const au="modulepreload",su=function(e,t){return new URL(e,t).href},io={},ls=function(t,i,n){let a=Promise.resolve();if(i&&i.length>0){const o=document.getElementsByTagName("link"),s=document.querySelector("meta[property=csp-nonce]"),l=s?.nonce||s?.getAttribute("nonce");a=Promise.allSettled(i.map(d=>{if(d=su(d,n),d in io)return;io[d]=!0;const p=d.endsWith(".css"),h=p?'[rel="stylesheet"]':"";if(!!n)for(let v=o.length-1;v>=0;v--){const w=o[v];if(w.href===d&&(!p||w.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${h}`))return;const y=document.createElement("link");if(y.rel=p?"stylesheet":au,p||(y.as="script"),y.crossOrigin="",y.href=d,l&&y.setAttribute("nonce",l),document.head.appendChild(y),p)return new Promise((v,w)=>{y.addEventListener("load",v),y.addEventListener("error",()=>w(new Error(`Unable to preload CSS for ${d}`)))})}))}function r(o){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=o,window.dispatchEvent(s),!s.defaultPrevented)throw o}return a.then(o=>{for(const s of o||[])s.status==="rejected"&&r(s.reason);return t().catch(r)})};async function Ri(e){return(await ls(()=>import("./PlayerModal-B87HXSlP.js"),[],import.meta.url)).openPlayerModal(e)}let xi=null,Ma=null;const Ui=e=>String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),no=[{label:"🎲 Karışık / Farketmez",id:null},{label:"💥 Aksiyon",movie:28,tv:10759},{label:"🚀 Bilim Kurgu & Fantastik",movie:878,tv:10765},{label:"😂 Komedi",movie:35,tv:35},{label:"🩸 Korku & Gerilim",movie:27,tv:9648},{label:"🎭 Dram",movie:18,tv:18},{label:"🕵️ Suç & Gizem",movie:80,tv:9648},{label:"🎌 Animasyon & Anime",movie:16,tv:16},{label:"💖 Romantik",movie:10749,tv:10749},{label:"🌍 Belgesel",movie:99,tv:99}];function ro({type:e="all"}={}){fi();const t=document.createElement("div");t.id="random-picker-modal-root",t.className="random-picker-backdrop",document.body.appendChild(t),xi=t;let i=e==="tv"?"tv":"all",n=0,a=7;t.innerHTML=`
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
            ${no.map((y,v)=>`
              <button class="random-pill-btn ${v===0?"active":""}" data-genre-idx="${v}">${y.label}</button>
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
  `,V(t);const r=t.querySelector("#btn-close-random-picker");r&&(r.onclick=()=>fi()),t.onclick=y=>{y.target===t&&fi()};const o=y=>{y.key==="Escape"&&fi()};window.addEventListener("keydown",o),Ma=()=>window.removeEventListener("keydown",o);const s=t.querySelectorAll("#random-type-pills .random-pill-btn");s.forEach(y=>{y.onclick=()=>{s.forEach(v=>v.classList.remove("active")),y.classList.add("active"),i=y.getAttribute("data-type")}});const l=t.querySelectorAll("#random-rating-pills .random-pill-btn");l.forEach(y=>{y.onclick=()=>{l.forEach(v=>v.classList.remove("active")),y.classList.add("active"),a=parseFloat(y.getAttribute("data-rating")||"0")}});const d=t.querySelectorAll("#random-genre-pills .random-pill-btn");d.forEach(y=>{y.onclick=()=>{d.forEach(v=>v.classList.remove("active")),y.classList.add("active"),n=parseInt(y.getAttribute("data-genre-idx"),10)}});const p=t.querySelector("#btn-spin-wheel"),h=t.querySelector("#random-spin-stage"),f=async()=>{p&&(p.disabled=!0,p.classList.add("is-spinning")),h.innerHTML=`
      <div class="random-roulette-box">
        <div class="roulette-glow-ring"></div>
        <div class="roulette-roller" id="roulette-roller">
          <div class="roulette-reel-text">Adaylar Karıştırılıyor... 🎲</div>
        </div>
      </div>
    `;let y=i;y==="all"&&(y=Math.random()>.5?"movie":"tv");let v=null;const w=no[n];w&&(v=y==="movie"?w.movie:w.tv);const k=Math.floor(Math.random()*3)+1;let m;try{m=await _l({type:y,genreId:v,minRating:a,page:k,sortBy:"popularity.desc"})}catch{m=[]}if(xi!==t)return;const b=(m||[]).filter(ne=>ne&&(ne.title||ne.name)&&(ne.poster_path||ne.backdrop_path));if(!b||b.length===0){h.innerHTML=`
        <div class="random-idle-placeholder">
          <i data-lucide="frown" style="width: 40px; height: 40px; color: #ef4444;"></i>
          <span>Bu kriterlere uygun yapım bulunamadı. Lütfen filtreleri gevşetip tekrar deneyin.</span>
        </div>
      `,V(h),p&&(p.disabled=!1,p.classList.remove("is-spinning"));return}const E=h.querySelector("#roulette-roller"),C=8;for(let ne=0;ne<C;ne++){const z=b[Math.floor(Math.random()*b.length)],G=z.title||z.name||"Öneri Aranıyor";if(E&&(E.innerHTML=`<div class="roulette-reel-text animate-pulse">${Ui(G)}</div>`),await new Promise(Y=>setTimeout(Y,120+ne*25)),xi!==t)return}const x=b[Math.floor(Math.random()*b.length)],T=x.title||x.name||"Seçilen Yapım",R=x.original_title||x.original_name||T,L=st(x.poster_path,Ze.POSTER_MEDIUM),D=x.vote_average?Number(x.vote_average).toFixed(1):"—",N=(x.release_date||x.first_air_date||"").substring(0,4),U=x.overview&&x.overview.trim().length>10?x.overview:"Harika bir izleme deneyimi sunan sürpriz bir öneri!",j=y==="movie"?"movie":"tv";h.innerHTML=`
      <div class="random-winner-card">
        <div class="winner-poster-wrap">
          <img src="${L}" alt="${Ui(T)}" class="winner-poster" />
          <div class="winner-rating-pill">⭐ ${D}</div>
        </div>
        <div class="winner-details-wrap">
          <div class="winner-badge-row">
            <span class="winner-tag-type">${j==="movie"?"FİLM":"DİZİ"}</span>
            ${N?`<span class="winner-tag-year">${Ui(N)}</span>`:""}
            <span class="winner-tag-match">Popüler öneri</span>
          </div>
          <h3 class="winner-title">${Ui(T)}</h3>
          <p class="winner-overview">${Ui(U)}</p>
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
    `,V(h);const O=h.querySelector("#btn-winner-play");O&&(O.onclick=()=>{fi(),Ri({type:j,tmdbId:x.id,title:T,originalTitle:R,posterPath:x.poster_path,backdropPath:x.backdrop_path,season:1,episode:1})});const B=h.querySelector("#btn-winner-detail");B&&(B.onclick=()=>{fi(),window.location.hash=`#detail?type=${j}&id=${x.id}`});const W=h.querySelector("#btn-winner-retry");W&&(W.onclick=()=>{f()}),p&&(p.disabled=!1,p.classList.remove("is-spinning"),p.innerHTML='<i data-lucide="refresh-cw" style="width: 17px; height: 17px;"></i> <span>Başka Bir Tane Öner</span>',V(p))};p&&(p.onclick=()=>f()),f()}function fi(){if(Ma?.(),Ma=null,xi){try{xi.remove()}catch{}xi=null}}let qn=null;const ia=[{id:"notif_1",title:"Yeni Bölüm Yayında! ⚔️",message:"Kuruluş Osman 6. Sezon 1. Bölüm Full HD olarak platforma eklendi.",time:"12 dk önce",isUnread:!0,type:"tv",tmdbId:"95557",badge:"YENİ BÖLÜM"},{id:"notif_2",title:"Özel Sinema Gösterimi 🍿",message:"Dune: Çöl Gezegeni Bölüm İki - 4K Ultra HD Türkçe Dublaj & Altyazılı yayında!",time:"2 saat önce",isUnread:!0,type:"movie",tmdbId:"693134",badge:"4K VİZYON"},{id:"notif_3",title:"Yeni Anime Bölümü ⚡",message:"Demon Slayer: Hashira Training Arc - Türkçe Altyazılı yeni bölüm izlenmeye hazır.",time:"Dün",isUnread:!1,type:"tv",tmdbId:"85937",badge:"ANİME"},{id:"notif_4",title:"Canlı TV Güncellemesi 📺",message:"Elektronik Program Rehberi (EPG), PiP Mini-Player ve HLS Kalite Menüsü aktif edildi.",time:"2 gün önce",isUnread:!1,type:"livetv",badge:"GÜNCELLEME"}];function Rl(){try{if(typeof window>"u"||!window.localStorage)return ia;const e=localStorage.getItem("sineflix_notifications_v1");return e?JSON.parse(e):ia}catch{return ia}}function ao(e){try{if(typeof window>"u"||!window.localStorage)return;localStorage.setItem("sineflix_notifications_v1",JSON.stringify(e)),window.dispatchEvent(new CustomEvent("sineflix_notifications_updated"))}catch{}}function $l(){return Rl().filter(t=>t.isUnread).length}function ou(){Sn();const e=document.createElement("div");e.id="notification-modal-root",e.className="notif-backdrop",document.body.appendChild(e),qn=e;const t=Rl();e.innerHTML=`
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
  `,V(e);const i=e.querySelector("#btn-close-notif");i&&(i.onclick=()=>Sn()),e.onclick=a=>{a.target===e&&Sn()};const n=e.querySelector("#btn-mark-all-read");n&&(n.onclick=()=>{const a=t.map(r=>({...r,isUnread:!1}));ao(a),e.querySelectorAll(".notif-item.unread").forEach(r=>r.classList.remove("unread")),te("Tüm bildirimler okundu olarak işaretlendi","info"),so()}),e.querySelectorAll(".notif-item").forEach(a=>{a.onclick=()=>{const r=a.getAttribute("data-notif-id"),o=a.getAttribute("data-type"),s=a.getAttribute("data-tmdb-id"),l=t.map(d=>d.id===r?{...d,isUnread:!1}:d);ao(l),a.classList.remove("unread"),so(),Sn(),o==="livetv"?window.location.hash="#livetv":s&&(window.location.hash=`#detail?type=${o}&id=${s}`)}})}function Sn(){if(qn){try{qn.remove()}catch{}qn=null}}function so(){const e=document.getElementById("nav-notif-badge");if(!e)return;const t=$l();t>0?(e.textContent=t,e.classList.remove("hidden")):e.classList.add("hidden")}function Ml(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function lu(e){if(e.__esModule)return e;var t=e.default;if(typeof t=="function"){var i=function n(){return this instanceof n?Reflect.construct(t,arguments,this.constructor):t.apply(this,arguments)};i.prototype=t.prototype}else i={};return Object.defineProperty(i,"__esModule",{value:!0}),Object.keys(e).forEach(function(n){var a=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(i,n,a.get?a:{enumerable:!0,get:function(){return e[n]}})}),i}var Pa={exports:{}},na,oo;function cu(){if(oo)return na;oo=1;var e=1e3,t=e*60,i=t*60,n=i*24,a=n*7,r=n*365.25;na=function(p,h){h=h||{};var f=typeof p;if(f==="string"&&p.length>0)return o(p);if(f==="number"&&isFinite(p))return h.long?l(p):s(p);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(p))};function o(p){if(p=String(p),!(p.length>100)){var h=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(p);if(h){var f=parseFloat(h[1]),y=(h[2]||"ms").toLowerCase();switch(y){case"years":case"year":case"yrs":case"yr":case"y":return f*r;case"weeks":case"week":case"w":return f*a;case"days":case"day":case"d":return f*n;case"hours":case"hour":case"hrs":case"hr":case"h":return f*i;case"minutes":case"minute":case"mins":case"min":case"m":return f*t;case"seconds":case"second":case"secs":case"sec":case"s":return f*e;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return f;default:return}}}}function s(p){var h=Math.abs(p);return h>=n?Math.round(p/n)+"d":h>=i?Math.round(p/i)+"h":h>=t?Math.round(p/t)+"m":h>=e?Math.round(p/e)+"s":p+"ms"}function l(p){var h=Math.abs(p);return h>=n?d(p,h,n,"day"):h>=i?d(p,h,i,"hour"):h>=t?d(p,h,t,"minute"):h>=e?d(p,h,e,"second"):p+" ms"}function d(p,h,f,y){var v=h>=f*1.5;return Math.round(p/f)+" "+y+(v?"s":"")}return na}function du(e){i.debug=i,i.default=i,i.coerce=l,i.disable=o,i.enable=a,i.enabled=s,i.humanize=cu(),i.destroy=d,Object.keys(e).forEach(p=>{i[p]=e[p]}),i.names=[],i.skips=[],i.formatters={};function t(p){let h=0;for(let f=0;f<p.length;f++)h=(h<<5)-h+p.charCodeAt(f),h|=0;return i.colors[Math.abs(h)%i.colors.length]}i.selectColor=t;function i(p){let h,f=null,y,v;function w(...k){if(!w.enabled)return;const m=w,b=Number(new Date),E=b-(h||b);m.diff=E,m.prev=h,m.curr=b,h=b,k[0]=i.coerce(k[0]),typeof k[0]!="string"&&k.unshift("%O");let C=0;k[0]=k[0].replace(/%([a-zA-Z%])/g,(T,R)=>{if(T==="%%")return"%";C++;const L=i.formatters[R];if(typeof L=="function"){const D=k[C];T=L.call(m,D),k.splice(C,1),C--}return T}),i.formatArgs.call(m,k),(m.log||i.log).apply(m,k)}return w.namespace=p,w.useColors=i.useColors(),w.color=i.selectColor(p),w.extend=n,w.destroy=i.destroy,Object.defineProperty(w,"enabled",{enumerable:!0,configurable:!1,get:()=>f!==null?f:(y!==i.namespaces&&(y=i.namespaces,v=i.enabled(p)),v),set:k=>{f=k}}),typeof i.init=="function"&&i.init(w),w}function n(p,h){const f=i(this.namespace+(typeof h>"u"?":":h)+p);return f.log=this.log,f}function a(p){i.save(p),i.namespaces=p,i.names=[],i.skips=[];const h=(typeof p=="string"?p:"").trim().replace(/\s+/g,",").split(",").filter(Boolean);for(const f of h)f[0]==="-"?i.skips.push(f.slice(1)):i.names.push(f)}function r(p,h){let f=0,y=0,v=-1,w=0;for(;f<p.length;)if(y<h.length&&(h[y]===p[f]||h[y]==="*"))h[y]==="*"?(v=y,w=f,y++):(f++,y++);else if(v!==-1)y=v+1,w++,f=w;else return!1;for(;y<h.length&&h[y]==="*";)y++;return y===h.length}function o(){const p=[...i.names,...i.skips.map(h=>"-"+h)].join(",");return i.enable(""),p}function s(p){for(const h of i.skips)if(r(p,h))return!1;for(const h of i.names)if(r(p,h))return!0;return!1}function l(p){return p instanceof Error?p.stack||p.message:p}function d(){}return i.enable(i.load()),i}var uu=du;(function(e,t){var i={};t.formatArgs=a,t.save=r,t.load=o,t.useColors=n,t.storage=s(),t.destroy=(()=>{let d=!1;return()=>{d||(d=!0)}})(),t.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"];function n(){if(typeof window<"u"&&window.process&&(window.process.type==="renderer"||window.process.__nwjs))return!0;if(typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;let d;return typeof document<"u"&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent&&(d=navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/))&&parseInt(d[1],10)>=31||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)}function a(d){if(d[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+d[0]+(this.useColors?"%c ":" ")+"+"+e.exports.humanize(this.diff),!this.useColors)return;const p="color: "+this.color;d.splice(1,0,p,"color: inherit");let h=0,f=0;d[0].replace(/%[a-zA-Z%]/g,y=>{y!=="%%"&&(h++,y==="%c"&&(f=h))}),d.splice(f,0,p)}t.log=console.debug||console.log||(()=>{});function r(d){try{d?t.storage.setItem("debug",d):t.storage.removeItem("debug")}catch{}}function o(){let d;try{d=t.storage.getItem("debug")||t.storage.getItem("DEBUG")}catch{}return!d&&typeof process<"u"&&"env"in process&&(d=i.DEBUG),d}function s(){try{return localStorage}catch{}}e.exports=uu(t);const{formatters:l}=e.exports;l.j=function(d){try{return JSON.stringify(d)}catch(p){return"[UnexpectedJSONParseError]: "+p.message}}})(Pa,Pa.exports);var Tr=Pa.exports,cs={exports:{}},Ei=typeof Reflect=="object"?Reflect:null,lo=Ei&&typeof Ei.apply=="function"?Ei.apply:function(t,i,n){return Function.prototype.apply.call(t,i,n)},Fn;Ei&&typeof Ei.ownKeys=="function"?Fn=Ei.ownKeys:Object.getOwnPropertySymbols?Fn=function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:Fn=function(t){return Object.getOwnPropertyNames(t)};var Pl=Number.isNaN||function(t){return t!==t};function Ce(){Ce.init.call(this)}cs.exports=Ce;cs.exports.once=mu;Ce.EventEmitter=Ce;Ce.prototype._events=void 0;Ce.prototype._eventsCount=0;Ce.prototype._maxListeners=void 0;var co=10;function Ar(e){if(typeof e!="function")throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e)}Object.defineProperty(Ce,"defaultMaxListeners",{enumerable:!0,get:function(){return co},set:function(e){if(typeof e!="number"||e<0||Pl(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");co=e}});Ce.init=function(){(this._events===void 0||this._events===Object.getPrototypeOf(this)._events)&&(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0};Ce.prototype.setMaxListeners=function(t){if(typeof t!="number"||t<0||Pl(t))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+t+".");return this._maxListeners=t,this};function Bl(e){return e._maxListeners===void 0?Ce.defaultMaxListeners:e._maxListeners}Ce.prototype.getMaxListeners=function(){return Bl(this)};Ce.prototype.emit=function(t){for(var i=[],n=1;n<arguments.length;n++)i.push(arguments[n]);var a=t==="error",r=this._events;if(r!==void 0)a=a&&r.error===void 0;else if(!a)return!1;if(a){var o;if(i.length>0&&(o=i[0]),o instanceof Error)throw o;var s=new Error("Unhandled error."+(o?" ("+o.message+")":""));throw s.context=o,s}var l=r[t];if(l===void 0)return!1;if(typeof l=="function")lo(l,this,i);else for(var d=l.length,p=Hl(l,d),n=0;n<d;++n)lo(p[n],this,i);return!0};function Dl(e,t,i,n){var a,r,o;if(Ar(i),r=e._events,r===void 0?(r=e._events=Object.create(null),e._eventsCount=0):(r.newListener!==void 0&&(e.emit("newListener",t,i.listener?i.listener:i),r=e._events),o=r[t]),o===void 0)o=r[t]=i,++e._eventsCount;else if(typeof o=="function"?o=r[t]=n?[i,o]:[o,i]:n?o.unshift(i):o.push(i),a=Bl(e),a>0&&o.length>a&&!o.warned){o.warned=!0;var s=new Error("Possible EventEmitter memory leak detected. "+o.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");s.name="MaxListenersExceededWarning",s.emitter=e,s.type=t,s.count=o.length}return e}Ce.prototype.addListener=function(t,i){return Dl(this,t,i,!1)};Ce.prototype.on=Ce.prototype.addListener;Ce.prototype.prependListener=function(t,i){return Dl(this,t,i,!0)};function pu(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length===0?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function Ol(e,t,i){var n={fired:!1,wrapFn:void 0,target:e,type:t,listener:i},a=pu.bind(n);return a.listener=i,n.wrapFn=a,a}Ce.prototype.once=function(t,i){return Ar(i),this.on(t,Ol(this,t,i)),this};Ce.prototype.prependOnceListener=function(t,i){return Ar(i),this.prependListener(t,Ol(this,t,i)),this};Ce.prototype.removeListener=function(t,i){var n,a,r,o,s;if(Ar(i),a=this._events,a===void 0)return this;if(n=a[t],n===void 0)return this;if(n===i||n.listener===i)--this._eventsCount===0?this._events=Object.create(null):(delete a[t],a.removeListener&&this.emit("removeListener",t,n.listener||i));else if(typeof n!="function"){for(r=-1,o=n.length-1;o>=0;o--)if(n[o]===i||n[o].listener===i){s=n[o].listener,r=o;break}if(r<0)return this;r===0?n.shift():hu(n,r),n.length===1&&(a[t]=n[0]),a.removeListener!==void 0&&this.emit("removeListener",t,s||i)}return this};Ce.prototype.off=Ce.prototype.removeListener;Ce.prototype.removeAllListeners=function(t){var i,n,a;if(n=this._events,n===void 0)return this;if(n.removeListener===void 0)return arguments.length===0?(this._events=Object.create(null),this._eventsCount=0):n[t]!==void 0&&(--this._eventsCount===0?this._events=Object.create(null):delete n[t]),this;if(arguments.length===0){var r=Object.keys(n),o;for(a=0;a<r.length;++a)o=r[a],o!=="removeListener"&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if(i=n[t],typeof i=="function")this.removeListener(t,i);else if(i!==void 0)for(a=i.length-1;a>=0;a--)this.removeListener(t,i[a]);return this};function Nl(e,t,i){var n=e._events;if(n===void 0)return[];var a=n[t];return a===void 0?[]:typeof a=="function"?i?[a.listener||a]:[a]:i?fu(a):Hl(a,a.length)}Ce.prototype.listeners=function(t){return Nl(this,t,!0)};Ce.prototype.rawListeners=function(t){return Nl(this,t,!1)};Ce.listenerCount=function(e,t){return typeof e.listenerCount=="function"?e.listenerCount(t):zl.call(e,t)};Ce.prototype.listenerCount=zl;function zl(e){var t=this._events;if(t!==void 0){var i=t[e];if(typeof i=="function")return 1;if(i!==void 0)return i.length}return 0}Ce.prototype.eventNames=function(){return this._eventsCount>0?Fn(this._events):[]};function Hl(e,t){for(var i=new Array(t),n=0;n<t;++n)i[n]=e[n];return i}function hu(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}function fu(e){for(var t=new Array(e.length),i=0;i<t.length;++i)t[i]=e[i].listener||e[i];return t}function mu(e,t){return new Promise(function(i,n){function a(o){e.removeListener(t,r),n(o)}function r(){typeof e.removeListener=="function"&&e.removeListener("error",a),i([].slice.call(arguments))}ql(e,t,r,{once:!0}),t!=="error"&&gu(e,a,{once:!0})})}function gu(e,t,i){typeof e.on=="function"&&ql(e,"error",t,i)}function ql(e,t,i,n){if(typeof e.on=="function")n.once?e.once(t,i):e.on(t,i);else if(typeof e.addEventListener=="function")e.addEventListener(t,function a(r){n.once&&e.removeEventListener(t,a),i(r)});else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof e)}var Cr=cs.exports,ds={exports:{}},yu=Fl;function Fl(e,t){if(e&&t)return Fl(e)(t);if(typeof e!="function")throw new TypeError("need wrapper function");return Object.keys(e).forEach(function(n){i[n]=e[n]}),i;function i(){for(var n=new Array(arguments.length),a=0;a<n.length;a++)n[a]=arguments[a];var r=e.apply(this,n),o=n[n.length-1];return typeof r=="function"&&r!==o&&Object.keys(o).forEach(function(s){r[s]=o[s]}),r}}var Ul=yu;ds.exports=Ul(Un);ds.exports.strict=Ul(jl);Un.proto=Un(function(){Object.defineProperty(Function.prototype,"once",{value:function(){return Un(this)},configurable:!0}),Object.defineProperty(Function.prototype,"onceStrict",{value:function(){return jl(this)},configurable:!0})});function Un(e){var t=function(){return t.called?t.value:(t.called=!0,t.value=e.apply(this,arguments))};return t.called=!1,t}function jl(e){var t=function(){if(t.called)throw new Error(t.onceError);return t.called=!0,t.value=e.apply(this,arguments)},i=e.name||"Function wrapped with `once`";return t.onceError=i+" shouldn't be called more than once",t.called=!1,t}var vu=ds.exports;let uo;var Lr=typeof queueMicrotask=="function"?queueMicrotask.bind(typeof window<"u"?window:globalThis):e=>(uo||(uo=Promise.resolve())).then(e).catch(t=>setTimeout(()=>{throw t},0));var bu=ku;const wu=Lr;function ku(e,t){let i,n,a,r=!0;Array.isArray(e)?(i=[],n=e.length):(a=Object.keys(e),i={},n=a.length);function o(l){function d(){t&&t(l,i),t=null}r?wu(d):d()}function s(l,d,p){i[l]=p,(--n===0||d)&&o(d)}n?a?a.forEach(function(l){e[l](function(d,p){s(l,d,p)})}):e.forEach(function(l,d){l(function(p,h){s(d,p,h)})}):o(null),r=!1}var _u=function(){if(typeof globalThis>"u")return null;var t={RTCPeerConnection:globalThis.RTCPeerConnection||globalThis.mozRTCPeerConnection||globalThis.webkitRTCPeerConnection,RTCSessionDescription:globalThis.RTCSessionDescription||globalThis.mozRTCSessionDescription||globalThis.webkitRTCSessionDescription,RTCIceCandidate:globalThis.RTCIceCandidate||globalThis.mozRTCIceCandidate||globalThis.webkitRTCIceCandidate};return t.RTCPeerConnection?t:null},Ba={exports:{}},Da={exports:{}},ui={},Ir={};Ir.byteLength=Eu;Ir.toByteArray=Au;Ir.fromByteArray=Iu;var At=[],dt=[],Su=typeof Uint8Array<"u"?Uint8Array:Array,ra="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(var mi=0,xu=ra.length;mi<xu;++mi)At[mi]=ra[mi],dt[ra.charCodeAt(mi)]=mi;dt[45]=62;dt[95]=63;function Kl(e){var t=e.length;if(t%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var i=e.indexOf("=");i===-1&&(i=t);var n=i===t?0:4-i%4;return[i,n]}function Eu(e){var t=Kl(e),i=t[0],n=t[1];return(i+n)*3/4-n}function Tu(e,t,i){return(t+i)*3/4-i}function Au(e){var t,i=Kl(e),n=i[0],a=i[1],r=new Su(Tu(e,n,a)),o=0,s=a>0?n-4:n,l;for(l=0;l<s;l+=4)t=dt[e.charCodeAt(l)]<<18|dt[e.charCodeAt(l+1)]<<12|dt[e.charCodeAt(l+2)]<<6|dt[e.charCodeAt(l+3)],r[o++]=t>>16&255,r[o++]=t>>8&255,r[o++]=t&255;return a===2&&(t=dt[e.charCodeAt(l)]<<2|dt[e.charCodeAt(l+1)]>>4,r[o++]=t&255),a===1&&(t=dt[e.charCodeAt(l)]<<10|dt[e.charCodeAt(l+1)]<<4|dt[e.charCodeAt(l+2)]>>2,r[o++]=t>>8&255,r[o++]=t&255),r}function Cu(e){return At[e>>18&63]+At[e>>12&63]+At[e>>6&63]+At[e&63]}function Lu(e,t,i){for(var n,a=[],r=t;r<i;r+=3)n=(e[r]<<16&16711680)+(e[r+1]<<8&65280)+(e[r+2]&255),a.push(Cu(n));return a.join("")}function Iu(e){for(var t,i=e.length,n=i%3,a=[],r=16383,o=0,s=i-n;o<s;o+=r)a.push(Lu(e,o,o+r>s?s:o+r));return n===1?(t=e[i-1],a.push(At[t>>2]+At[t<<4&63]+"==")):n===2&&(t=(e[i-2]<<8)+e[i-1],a.push(At[t>>10]+At[t>>4&63]+At[t<<2&63]+"=")),a.join("")}var us={};us.read=function(e,t,i,n,a){var r,o,s=a*8-n-1,l=(1<<s)-1,d=l>>1,p=-7,h=i?a-1:0,f=i?-1:1,y=e[t+h];for(h+=f,r=y&(1<<-p)-1,y>>=-p,p+=s;p>0;r=r*256+e[t+h],h+=f,p-=8);for(o=r&(1<<-p)-1,r>>=-p,p+=n;p>0;o=o*256+e[t+h],h+=f,p-=8);if(r===0)r=1-d;else{if(r===l)return o?NaN:(y?-1:1)*(1/0);o=o+Math.pow(2,n),r=r-d}return(y?-1:1)*o*Math.pow(2,r-n)};us.write=function(e,t,i,n,a,r){var o,s,l,d=r*8-a-1,p=(1<<d)-1,h=p>>1,f=a===23?Math.pow(2,-24)-Math.pow(2,-77):0,y=n?0:r-1,v=n?1:-1,w=t<0||t===0&&1/t<0?1:0;for(t=Math.abs(t),isNaN(t)||t===1/0?(s=isNaN(t)?1:0,o=p):(o=Math.floor(Math.log(t)/Math.LN2),t*(l=Math.pow(2,-o))<1&&(o--,l*=2),o+h>=1?t+=f/l:t+=f*Math.pow(2,1-h),t*l>=2&&(o++,l/=2),o+h>=p?(s=0,o=p):o+h>=1?(s=(t*l-1)*Math.pow(2,a),o=o+h):(s=t*Math.pow(2,h-1)*Math.pow(2,a),o=0));a>=8;e[i+y]=s&255,y+=v,s/=256,a-=8);for(o=o<<a|s,d+=a;d>0;e[i+y]=o&255,y+=v,o/=256,d-=8);e[i+y-v]|=w*128};(function(e){const t=Ir,i=us,n=typeof Symbol=="function"&&typeof Symbol.for=="function"?Symbol.for("nodejs.util.inspect.custom"):null;e.Buffer=s,e.SlowBuffer=b,e.INSPECT_MAX_BYTES=50;const a=2147483647;e.kMaxLength=a,s.TYPED_ARRAY_SUPPORT=r(),!s.TYPED_ARRAY_SUPPORT&&typeof console<"u";function r(){try{const g=new Uint8Array(1),c={foo:function(){return 42}};return Object.setPrototypeOf(c,Uint8Array.prototype),Object.setPrototypeOf(g,c),g.foo()===42}catch{return!1}}Object.defineProperty(s.prototype,"parent",{enumerable:!0,get:function(){if(s.isBuffer(this))return this.buffer}}),Object.defineProperty(s.prototype,"offset",{enumerable:!0,get:function(){if(s.isBuffer(this))return this.byteOffset}});function o(g){if(g>a)throw new RangeError('The value "'+g+'" is invalid for option "size"');const c=new Uint8Array(g);return Object.setPrototypeOf(c,s.prototype),c}function s(g,c,u){if(typeof g=="number"){if(typeof c=="string")throw new TypeError('The "string" argument must be of type string. Received type number');return h(g)}return l(g,c,u)}s.poolSize=8192;function l(g,c,u){if(typeof g=="string")return f(g,c);if(ArrayBuffer.isView(g))return v(g);if(g==null)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof g);if(De(g,ArrayBuffer)||g&&De(g.buffer,ArrayBuffer)||typeof SharedArrayBuffer<"u"&&(De(g,SharedArrayBuffer)||g&&De(g.buffer,SharedArrayBuffer)))return w(g,c,u);if(typeof g=="number")throw new TypeError('The "value" argument must not be of type number. Received type number');const _=g.valueOf&&g.valueOf();if(_!=null&&_!==g)return s.from(_,c,u);const I=k(g);if(I)return I;if(typeof Symbol<"u"&&Symbol.toPrimitive!=null&&typeof g[Symbol.toPrimitive]=="function")return s.from(g[Symbol.toPrimitive]("string"),c,u);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof g)}s.from=function(g,c,u){return l(g,c,u)},Object.setPrototypeOf(s.prototype,Uint8Array.prototype),Object.setPrototypeOf(s,Uint8Array);function d(g){if(typeof g!="number")throw new TypeError('"size" argument must be of type number');if(g<0)throw new RangeError('The value "'+g+'" is invalid for option "size"')}function p(g,c,u){return d(g),g<=0?o(g):c!==void 0?typeof u=="string"?o(g).fill(c,u):o(g).fill(c):o(g)}s.alloc=function(g,c,u){return p(g,c,u)};function h(g){return d(g),o(g<0?0:m(g)|0)}s.allocUnsafe=function(g){return h(g)},s.allocUnsafeSlow=function(g){return h(g)};function f(g,c){if((typeof c!="string"||c==="")&&(c="utf8"),!s.isEncoding(c))throw new TypeError("Unknown encoding: "+c);const u=E(g,c)|0;let _=o(u);const I=_.write(g,c);return I!==u&&(_=_.slice(0,I)),_}function y(g){const c=g.length<0?0:m(g.length)|0,u=o(c);for(let _=0;_<c;_+=1)u[_]=g[_]&255;return u}function v(g){if(De(g,Uint8Array)){const c=new Uint8Array(g);return w(c.buffer,c.byteOffset,c.byteLength)}return y(g)}function w(g,c,u){if(c<0||g.byteLength<c)throw new RangeError('"offset" is outside of buffer bounds');if(g.byteLength<c+(u||0))throw new RangeError('"length" is outside of buffer bounds');let _;return c===void 0&&u===void 0?_=new Uint8Array(g):u===void 0?_=new Uint8Array(g,c):_=new Uint8Array(g,c,u),Object.setPrototypeOf(_,s.prototype),_}function k(g){if(s.isBuffer(g)){const c=m(g.length)|0,u=o(c);return u.length===0||g.copy(u,0,0,c),u}if(g.length!==void 0)return typeof g.length!="number"||ze(g.length)?o(0):y(g);if(g.type==="Buffer"&&Array.isArray(g.data))return y(g.data)}function m(g){if(g>=a)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+a.toString(16)+" bytes");return g|0}function b(g){return+g!=g&&(g=0),s.alloc(+g)}s.isBuffer=function(c){return c!=null&&c._isBuffer===!0&&c!==s.prototype},s.compare=function(c,u){if(De(c,Uint8Array)&&(c=s.from(c,c.offset,c.byteLength)),De(u,Uint8Array)&&(u=s.from(u,u.offset,u.byteLength)),!s.isBuffer(c)||!s.isBuffer(u))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(c===u)return 0;let _=c.length,I=u.length;for(let P=0,H=Math.min(_,I);P<H;++P)if(c[P]!==u[P]){_=c[P],I=u[P];break}return _<I?-1:I<_?1:0},s.isEncoding=function(c){switch(String(c).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},s.concat=function(c,u){if(!Array.isArray(c))throw new TypeError('"list" argument must be an Array of Buffers');if(c.length===0)return s.alloc(0);let _;if(u===void 0)for(u=0,_=0;_<c.length;++_)u+=c[_].length;const I=s.allocUnsafe(u);let P=0;for(_=0;_<c.length;++_){let H=c[_];if(De(H,Uint8Array))P+H.length>I.length?(s.isBuffer(H)||(H=s.from(H)),H.copy(I,P)):Uint8Array.prototype.set.call(I,H,P);else if(s.isBuffer(H))H.copy(I,P);else throw new TypeError('"list" argument must be an Array of Buffers');P+=H.length}return I};function E(g,c){if(s.isBuffer(g))return g.length;if(ArrayBuffer.isView(g)||De(g,ArrayBuffer))return g.byteLength;if(typeof g!="string")throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof g);const u=g.length,_=arguments.length>2&&arguments[2]===!0;if(!_&&u===0)return 0;let I=!1;for(;;)switch(c){case"ascii":case"latin1":case"binary":return u;case"utf8":case"utf-8":return pe(g).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return u*2;case"hex":return u>>>1;case"base64":return Ue(g).length;default:if(I)return _?-1:pe(g).length;c=(""+c).toLowerCase(),I=!0}}s.byteLength=E;function C(g,c,u){let _=!1;if((c===void 0||c<0)&&(c=0),c>this.length||((u===void 0||u>this.length)&&(u=this.length),u<=0)||(u>>>=0,c>>>=0,u<=c))return"";for(g||(g="utf8");;)switch(g){case"hex":return Y(this,c,u);case"utf8":case"utf-8":return B(this,c,u);case"ascii":return z(this,c,u);case"latin1":case"binary":return G(this,c,u);case"base64":return O(this,c,u);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return Z(this,c,u);default:if(_)throw new TypeError("Unknown encoding: "+g);g=(g+"").toLowerCase(),_=!0}}s.prototype._isBuffer=!0;function x(g,c,u){const _=g[c];g[c]=g[u],g[u]=_}s.prototype.swap16=function(){const c=this.length;if(c%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let u=0;u<c;u+=2)x(this,u,u+1);return this},s.prototype.swap32=function(){const c=this.length;if(c%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let u=0;u<c;u+=4)x(this,u,u+3),x(this,u+1,u+2);return this},s.prototype.swap64=function(){const c=this.length;if(c%8!==0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let u=0;u<c;u+=8)x(this,u,u+7),x(this,u+1,u+6),x(this,u+2,u+5),x(this,u+3,u+4);return this},s.prototype.toString=function(){const c=this.length;return c===0?"":arguments.length===0?B(this,0,c):C.apply(this,arguments)},s.prototype.toLocaleString=s.prototype.toString,s.prototype.equals=function(c){if(!s.isBuffer(c))throw new TypeError("Argument must be a Buffer");return this===c?!0:s.compare(this,c)===0},s.prototype.inspect=function(){let c="";const u=e.INSPECT_MAX_BYTES;return c=this.toString("hex",0,u).replace(/(.{2})/g,"$1 ").trim(),this.length>u&&(c+=" ... "),"<Buffer "+c+">"},n&&(s.prototype[n]=s.prototype.inspect),s.prototype.compare=function(c,u,_,I,P){if(De(c,Uint8Array)&&(c=s.from(c,c.offset,c.byteLength)),!s.isBuffer(c))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof c);if(u===void 0&&(u=0),_===void 0&&(_=c?c.length:0),I===void 0&&(I=0),P===void 0&&(P=this.length),u<0||_>c.length||I<0||P>this.length)throw new RangeError("out of range index");if(I>=P&&u>=_)return 0;if(I>=P)return-1;if(u>=_)return 1;if(u>>>=0,_>>>=0,I>>>=0,P>>>=0,this===c)return 0;let H=P-I,ue=_-u;const Le=Math.min(H,ue),Se=this.slice(I,P),ge=c.slice(u,_);for(let xe=0;xe<Le;++xe)if(Se[xe]!==ge[xe]){H=Se[xe],ue=ge[xe];break}return H<ue?-1:ue<H?1:0};function T(g,c,u,_,I){if(g.length===0)return-1;if(typeof u=="string"?(_=u,u=0):u>2147483647?u=2147483647:u<-2147483648&&(u=-2147483648),u=+u,ze(u)&&(u=I?0:g.length-1),u<0&&(u=g.length+u),u>=g.length){if(I)return-1;u=g.length-1}else if(u<0)if(I)u=0;else return-1;if(typeof c=="string"&&(c=s.from(c,_)),s.isBuffer(c))return c.length===0?-1:R(g,c,u,_,I);if(typeof c=="number")return c=c&255,typeof Uint8Array.prototype.indexOf=="function"?I?Uint8Array.prototype.indexOf.call(g,c,u):Uint8Array.prototype.lastIndexOf.call(g,c,u):R(g,[c],u,_,I);throw new TypeError("val must be string, number or Buffer")}function R(g,c,u,_,I){let P=1,H=g.length,ue=c.length;if(_!==void 0&&(_=String(_).toLowerCase(),_==="ucs2"||_==="ucs-2"||_==="utf16le"||_==="utf-16le")){if(g.length<2||c.length<2)return-1;P=2,H/=2,ue/=2,u/=2}function Le(ge,xe){return P===1?ge[xe]:ge.readUInt16BE(xe*P)}let Se;if(I){let ge=-1;for(Se=u;Se<H;Se++)if(Le(g,Se)===Le(c,ge===-1?0:Se-ge)){if(ge===-1&&(ge=Se),Se-ge+1===ue)return ge*P}else ge!==-1&&(Se-=Se-ge),ge=-1}else for(u+ue>H&&(u=H-ue),Se=u;Se>=0;Se--){let ge=!0;for(let xe=0;xe<ue;xe++)if(Le(g,Se+xe)!==Le(c,xe)){ge=!1;break}if(ge)return Se}return-1}s.prototype.includes=function(c,u,_){return this.indexOf(c,u,_)!==-1},s.prototype.indexOf=function(c,u,_){return T(this,c,u,_,!0)},s.prototype.lastIndexOf=function(c,u,_){return T(this,c,u,_,!1)};function L(g,c,u,_){u=Number(u)||0;const I=g.length-u;_?(_=Number(_),_>I&&(_=I)):_=I;const P=c.length;_>P/2&&(_=P/2);let H;for(H=0;H<_;++H){const ue=parseInt(c.substr(H*2,2),16);if(ze(ue))return H;g[u+H]=ue}return H}function D(g,c,u,_){return Ie(pe(c,g.length-u),g,u,_)}function N(g,c,u,_){return Ie(Ge(c),g,u,_)}function U(g,c,u,_){return Ie(Ue(c),g,u,_)}function j(g,c,u,_){return Ie(Je(c,g.length-u),g,u,_)}s.prototype.write=function(c,u,_,I){if(u===void 0)I="utf8",_=this.length,u=0;else if(_===void 0&&typeof u=="string")I=u,_=this.length,u=0;else if(isFinite(u))u=u>>>0,isFinite(_)?(_=_>>>0,I===void 0&&(I="utf8")):(I=_,_=void 0);else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");const P=this.length-u;if((_===void 0||_>P)&&(_=P),c.length>0&&(_<0||u<0)||u>this.length)throw new RangeError("Attempt to write outside buffer bounds");I||(I="utf8");let H=!1;for(;;)switch(I){case"hex":return L(this,c,u,_);case"utf8":case"utf-8":return D(this,c,u,_);case"ascii":case"latin1":case"binary":return N(this,c,u,_);case"base64":return U(this,c,u,_);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return j(this,c,u,_);default:if(H)throw new TypeError("Unknown encoding: "+I);I=(""+I).toLowerCase(),H=!0}},s.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function O(g,c,u){return c===0&&u===g.length?t.fromByteArray(g):t.fromByteArray(g.slice(c,u))}function B(g,c,u){u=Math.min(g.length,u);const _=[];let I=c;for(;I<u;){const P=g[I];let H=null,ue=P>239?4:P>223?3:P>191?2:1;if(I+ue<=u){let Le,Se,ge,xe;switch(ue){case 1:P<128&&(H=P);break;case 2:Le=g[I+1],(Le&192)===128&&(xe=(P&31)<<6|Le&63,xe>127&&(H=xe));break;case 3:Le=g[I+1],Se=g[I+2],(Le&192)===128&&(Se&192)===128&&(xe=(P&15)<<12|(Le&63)<<6|Se&63,xe>2047&&(xe<55296||xe>57343)&&(H=xe));break;case 4:Le=g[I+1],Se=g[I+2],ge=g[I+3],(Le&192)===128&&(Se&192)===128&&(ge&192)===128&&(xe=(P&15)<<18|(Le&63)<<12|(Se&63)<<6|ge&63,xe>65535&&xe<1114112&&(H=xe))}}H===null?(H=65533,ue=1):H>65535&&(H-=65536,_.push(H>>>10&1023|55296),H=56320|H&1023),_.push(H),I+=ue}return ne(_)}const W=4096;function ne(g){const c=g.length;if(c<=W)return String.fromCharCode.apply(String,g);let u="",_=0;for(;_<c;)u+=String.fromCharCode.apply(String,g.slice(_,_+=W));return u}function z(g,c,u){let _="";u=Math.min(g.length,u);for(let I=c;I<u;++I)_+=String.fromCharCode(g[I]&127);return _}function G(g,c,u){let _="";u=Math.min(g.length,u);for(let I=c;I<u;++I)_+=String.fromCharCode(g[I]);return _}function Y(g,c,u){const _=g.length;(!c||c<0)&&(c=0),(!u||u<0||u>_)&&(u=_);let I="";for(let P=c;P<u;++P)I+=We[g[P]];return I}function Z(g,c,u){const _=g.slice(c,u);let I="";for(let P=0;P<_.length-1;P+=2)I+=String.fromCharCode(_[P]+_[P+1]*256);return I}s.prototype.slice=function(c,u){const _=this.length;c=~~c,u=u===void 0?_:~~u,c<0?(c+=_,c<0&&(c=0)):c>_&&(c=_),u<0?(u+=_,u<0&&(u=0)):u>_&&(u=_),u<c&&(u=c);const I=this.subarray(c,u);return Object.setPrototypeOf(I,s.prototype),I};function X(g,c,u){if(g%1!==0||g<0)throw new RangeError("offset is not uint");if(g+c>u)throw new RangeError("Trying to access beyond buffer length")}s.prototype.readUintLE=s.prototype.readUIntLE=function(c,u,_){c=c>>>0,u=u>>>0,_||X(c,u,this.length);let I=this[c],P=1,H=0;for(;++H<u&&(P*=256);)I+=this[c+H]*P;return I},s.prototype.readUintBE=s.prototype.readUIntBE=function(c,u,_){c=c>>>0,u=u>>>0,_||X(c,u,this.length);let I=this[c+--u],P=1;for(;u>0&&(P*=256);)I+=this[c+--u]*P;return I},s.prototype.readUint8=s.prototype.readUInt8=function(c,u){return c=c>>>0,u||X(c,1,this.length),this[c]},s.prototype.readUint16LE=s.prototype.readUInt16LE=function(c,u){return c=c>>>0,u||X(c,2,this.length),this[c]|this[c+1]<<8},s.prototype.readUint16BE=s.prototype.readUInt16BE=function(c,u){return c=c>>>0,u||X(c,2,this.length),this[c]<<8|this[c+1]},s.prototype.readUint32LE=s.prototype.readUInt32LE=function(c,u){return c=c>>>0,u||X(c,4,this.length),(this[c]|this[c+1]<<8|this[c+2]<<16)+this[c+3]*16777216},s.prototype.readUint32BE=s.prototype.readUInt32BE=function(c,u){return c=c>>>0,u||X(c,4,this.length),this[c]*16777216+(this[c+1]<<16|this[c+2]<<8|this[c+3])},s.prototype.readBigUInt64LE=je(function(c){c=c>>>0,q(c,"offset");const u=this[c],_=this[c+7];(u===void 0||_===void 0)&&ee(c,this.length-8);const I=u+this[++c]*2**8+this[++c]*2**16+this[++c]*2**24,P=this[++c]+this[++c]*2**8+this[++c]*2**16+_*2**24;return BigInt(I)+(BigInt(P)<<BigInt(32))}),s.prototype.readBigUInt64BE=je(function(c){c=c>>>0,q(c,"offset");const u=this[c],_=this[c+7];(u===void 0||_===void 0)&&ee(c,this.length-8);const I=u*2**24+this[++c]*2**16+this[++c]*2**8+this[++c],P=this[++c]*2**24+this[++c]*2**16+this[++c]*2**8+_;return(BigInt(I)<<BigInt(32))+BigInt(P)}),s.prototype.readIntLE=function(c,u,_){c=c>>>0,u=u>>>0,_||X(c,u,this.length);let I=this[c],P=1,H=0;for(;++H<u&&(P*=256);)I+=this[c+H]*P;return P*=128,I>=P&&(I-=Math.pow(2,8*u)),I},s.prototype.readIntBE=function(c,u,_){c=c>>>0,u=u>>>0,_||X(c,u,this.length);let I=u,P=1,H=this[c+--I];for(;I>0&&(P*=256);)H+=this[c+--I]*P;return P*=128,H>=P&&(H-=Math.pow(2,8*u)),H},s.prototype.readInt8=function(c,u){return c=c>>>0,u||X(c,1,this.length),this[c]&128?(255-this[c]+1)*-1:this[c]},s.prototype.readInt16LE=function(c,u){c=c>>>0,u||X(c,2,this.length);const _=this[c]|this[c+1]<<8;return _&32768?_|4294901760:_},s.prototype.readInt16BE=function(c,u){c=c>>>0,u||X(c,2,this.length);const _=this[c+1]|this[c]<<8;return _&32768?_|4294901760:_},s.prototype.readInt32LE=function(c,u){return c=c>>>0,u||X(c,4,this.length),this[c]|this[c+1]<<8|this[c+2]<<16|this[c+3]<<24},s.prototype.readInt32BE=function(c,u){return c=c>>>0,u||X(c,4,this.length),this[c]<<24|this[c+1]<<16|this[c+2]<<8|this[c+3]},s.prototype.readBigInt64LE=je(function(c){c=c>>>0,q(c,"offset");const u=this[c],_=this[c+7];(u===void 0||_===void 0)&&ee(c,this.length-8);const I=this[c+4]+this[c+5]*2**8+this[c+6]*2**16+(_<<24);return(BigInt(I)<<BigInt(32))+BigInt(u+this[++c]*2**8+this[++c]*2**16+this[++c]*2**24)}),s.prototype.readBigInt64BE=je(function(c){c=c>>>0,q(c,"offset");const u=this[c],_=this[c+7];(u===void 0||_===void 0)&&ee(c,this.length-8);const I=(u<<24)+this[++c]*2**16+this[++c]*2**8+this[++c];return(BigInt(I)<<BigInt(32))+BigInt(this[++c]*2**24+this[++c]*2**16+this[++c]*2**8+_)}),s.prototype.readFloatLE=function(c,u){return c=c>>>0,u||X(c,4,this.length),i.read(this,c,!0,23,4)},s.prototype.readFloatBE=function(c,u){return c=c>>>0,u||X(c,4,this.length),i.read(this,c,!1,23,4)},s.prototype.readDoubleLE=function(c,u){return c=c>>>0,u||X(c,8,this.length),i.read(this,c,!0,52,8)},s.prototype.readDoubleBE=function(c,u){return c=c>>>0,u||X(c,8,this.length),i.read(this,c,!1,52,8)};function ie(g,c,u,_,I,P){if(!s.isBuffer(g))throw new TypeError('"buffer" argument must be a Buffer instance');if(c>I||c<P)throw new RangeError('"value" argument is out of bounds');if(u+_>g.length)throw new RangeError("Index out of range")}s.prototype.writeUintLE=s.prototype.writeUIntLE=function(c,u,_,I){if(c=+c,u=u>>>0,_=_>>>0,!I){const ue=Math.pow(2,8*_)-1;ie(this,c,u,_,ue,0)}let P=1,H=0;for(this[u]=c&255;++H<_&&(P*=256);)this[u+H]=c/P&255;return u+_},s.prototype.writeUintBE=s.prototype.writeUIntBE=function(c,u,_,I){if(c=+c,u=u>>>0,_=_>>>0,!I){const ue=Math.pow(2,8*_)-1;ie(this,c,u,_,ue,0)}let P=_-1,H=1;for(this[u+P]=c&255;--P>=0&&(H*=256);)this[u+P]=c/H&255;return u+_},s.prototype.writeUint8=s.prototype.writeUInt8=function(c,u,_){return c=+c,u=u>>>0,_||ie(this,c,u,1,255,0),this[u]=c&255,u+1},s.prototype.writeUint16LE=s.prototype.writeUInt16LE=function(c,u,_){return c=+c,u=u>>>0,_||ie(this,c,u,2,65535,0),this[u]=c&255,this[u+1]=c>>>8,u+2},s.prototype.writeUint16BE=s.prototype.writeUInt16BE=function(c,u,_){return c=+c,u=u>>>0,_||ie(this,c,u,2,65535,0),this[u]=c>>>8,this[u+1]=c&255,u+2},s.prototype.writeUint32LE=s.prototype.writeUInt32LE=function(c,u,_){return c=+c,u=u>>>0,_||ie(this,c,u,4,4294967295,0),this[u+3]=c>>>24,this[u+2]=c>>>16,this[u+1]=c>>>8,this[u]=c&255,u+4},s.prototype.writeUint32BE=s.prototype.writeUInt32BE=function(c,u,_){return c=+c,u=u>>>0,_||ie(this,c,u,4,4294967295,0),this[u]=c>>>24,this[u+1]=c>>>16,this[u+2]=c>>>8,this[u+3]=c&255,u+4};function fe(g,c,u,_,I){A(c,_,I,g,u,7);let P=Number(c&BigInt(4294967295));g[u++]=P,P=P>>8,g[u++]=P,P=P>>8,g[u++]=P,P=P>>8,g[u++]=P;let H=Number(c>>BigInt(32)&BigInt(4294967295));return g[u++]=H,H=H>>8,g[u++]=H,H=H>>8,g[u++]=H,H=H>>8,g[u++]=H,u}function me(g,c,u,_,I){A(c,_,I,g,u,7);let P=Number(c&BigInt(4294967295));g[u+7]=P,P=P>>8,g[u+6]=P,P=P>>8,g[u+5]=P,P=P>>8,g[u+4]=P;let H=Number(c>>BigInt(32)&BigInt(4294967295));return g[u+3]=H,H=H>>8,g[u+2]=H,H=H>>8,g[u+1]=H,H=H>>8,g[u]=H,u+8}s.prototype.writeBigUInt64LE=je(function(c,u=0){return fe(this,c,u,BigInt(0),BigInt("0xffffffffffffffff"))}),s.prototype.writeBigUInt64BE=je(function(c,u=0){return me(this,c,u,BigInt(0),BigInt("0xffffffffffffffff"))}),s.prototype.writeIntLE=function(c,u,_,I){if(c=+c,u=u>>>0,!I){const Le=Math.pow(2,8*_-1);ie(this,c,u,_,Le-1,-Le)}let P=0,H=1,ue=0;for(this[u]=c&255;++P<_&&(H*=256);)c<0&&ue===0&&this[u+P-1]!==0&&(ue=1),this[u+P]=(c/H>>0)-ue&255;return u+_},s.prototype.writeIntBE=function(c,u,_,I){if(c=+c,u=u>>>0,!I){const Le=Math.pow(2,8*_-1);ie(this,c,u,_,Le-1,-Le)}let P=_-1,H=1,ue=0;for(this[u+P]=c&255;--P>=0&&(H*=256);)c<0&&ue===0&&this[u+P+1]!==0&&(ue=1),this[u+P]=(c/H>>0)-ue&255;return u+_},s.prototype.writeInt8=function(c,u,_){return c=+c,u=u>>>0,_||ie(this,c,u,1,127,-128),c<0&&(c=255+c+1),this[u]=c&255,u+1},s.prototype.writeInt16LE=function(c,u,_){return c=+c,u=u>>>0,_||ie(this,c,u,2,32767,-32768),this[u]=c&255,this[u+1]=c>>>8,u+2},s.prototype.writeInt16BE=function(c,u,_){return c=+c,u=u>>>0,_||ie(this,c,u,2,32767,-32768),this[u]=c>>>8,this[u+1]=c&255,u+2},s.prototype.writeInt32LE=function(c,u,_){return c=+c,u=u>>>0,_||ie(this,c,u,4,2147483647,-2147483648),this[u]=c&255,this[u+1]=c>>>8,this[u+2]=c>>>16,this[u+3]=c>>>24,u+4},s.prototype.writeInt32BE=function(c,u,_){return c=+c,u=u>>>0,_||ie(this,c,u,4,2147483647,-2147483648),c<0&&(c=4294967295+c+1),this[u]=c>>>24,this[u+1]=c>>>16,this[u+2]=c>>>8,this[u+3]=c&255,u+4},s.prototype.writeBigInt64LE=je(function(c,u=0){return fe(this,c,u,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),s.prototype.writeBigInt64BE=je(function(c,u=0){return me(this,c,u,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))});function Q(g,c,u,_,I,P){if(u+_>g.length)throw new RangeError("Index out of range");if(u<0)throw new RangeError("Index out of range")}function $(g,c,u,_,I){return c=+c,u=u>>>0,I||Q(g,c,u,4),i.write(g,c,u,_,23,4),u+4}s.prototype.writeFloatLE=function(c,u,_){return $(this,c,u,!0,_)},s.prototype.writeFloatBE=function(c,u,_){return $(this,c,u,!1,_)};function M(g,c,u,_,I){return c=+c,u=u>>>0,I||Q(g,c,u,8),i.write(g,c,u,_,52,8),u+8}s.prototype.writeDoubleLE=function(c,u,_){return M(this,c,u,!0,_)},s.prototype.writeDoubleBE=function(c,u,_){return M(this,c,u,!1,_)},s.prototype.copy=function(c,u,_,I){if(!s.isBuffer(c))throw new TypeError("argument should be a Buffer");if(_||(_=0),!I&&I!==0&&(I=this.length),u>=c.length&&(u=c.length),u||(u=0),I>0&&I<_&&(I=_),I===_||c.length===0||this.length===0)return 0;if(u<0)throw new RangeError("targetStart out of bounds");if(_<0||_>=this.length)throw new RangeError("Index out of range");if(I<0)throw new RangeError("sourceEnd out of bounds");I>this.length&&(I=this.length),c.length-u<I-_&&(I=c.length-u+_);const P=I-_;return this===c&&typeof Uint8Array.prototype.copyWithin=="function"?this.copyWithin(u,_,I):Uint8Array.prototype.set.call(c,this.subarray(_,I),u),P},s.prototype.fill=function(c,u,_,I){if(typeof c=="string"){if(typeof u=="string"?(I=u,u=0,_=this.length):typeof _=="string"&&(I=_,_=this.length),I!==void 0&&typeof I!="string")throw new TypeError("encoding must be a string");if(typeof I=="string"&&!s.isEncoding(I))throw new TypeError("Unknown encoding: "+I);if(c.length===1){const H=c.charCodeAt(0);(I==="utf8"&&H<128||I==="latin1")&&(c=H)}}else typeof c=="number"?c=c&255:typeof c=="boolean"&&(c=Number(c));if(u<0||this.length<u||this.length<_)throw new RangeError("Out of range index");if(_<=u)return this;u=u>>>0,_=_===void 0?this.length:_>>>0,c||(c=0);let P;if(typeof c=="number")for(P=u;P<_;++P)this[P]=c;else{const H=s.isBuffer(c)?c:s.from(c,I),ue=H.length;if(ue===0)throw new TypeError('The value "'+c+'" is invalid for argument "value"');for(P=0;P<_-u;++P)this[P+u]=H[P%ue]}return this};const K={};function re(g,c,u){K[g]=class extends u{constructor(){super(),Object.defineProperty(this,"message",{value:c.apply(this,arguments),writable:!0,configurable:!0}),this.name=`${this.name} [${g}]`,this.stack,delete this.name}get code(){return g}set code(I){Object.defineProperty(this,"code",{configurable:!0,enumerable:!0,value:I,writable:!0})}toString(){return`${this.name} [${g}]: ${this.message}`}}}re("ERR_BUFFER_OUT_OF_BOUNDS",function(g){return g?`${g} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"},RangeError),re("ERR_INVALID_ARG_TYPE",function(g,c){return`The "${g}" argument must be of type number. Received type ${typeof c}`},TypeError),re("ERR_OUT_OF_RANGE",function(g,c,u){let _=`The value of "${g}" is out of range.`,I=u;return Number.isInteger(u)&&Math.abs(u)>2**32?I=le(String(u)):typeof u=="bigint"&&(I=String(u),(u>BigInt(2)**BigInt(32)||u<-(BigInt(2)**BigInt(32)))&&(I=le(I)),I+="n"),_+=` It must be ${c}. Received ${I}`,_},RangeError);function le(g){let c="",u=g.length;const _=g[0]==="-"?1:0;for(;u>=_+4;u-=3)c=`_${g.slice(u-3,u)}${c}`;return`${g.slice(0,u)}${c}`}function S(g,c,u){q(c,"offset"),(g[c]===void 0||g[c+u]===void 0)&&ee(c,g.length-(u+1))}function A(g,c,u,_,I,P){if(g>u||g<c){const H=typeof c=="bigint"?"n":"";let ue;throw c===0||c===BigInt(0)?ue=`>= 0${H} and < 2${H} ** ${(P+1)*8}${H}`:ue=`>= -(2${H} ** ${(P+1)*8-1}${H}) and < 2 ** ${(P+1)*8-1}${H}`,new K.ERR_OUT_OF_RANGE("value",ue,g)}S(_,I,P)}function q(g,c){if(typeof g!="number")throw new K.ERR_INVALID_ARG_TYPE(c,"number",g)}function ee(g,c,u){throw Math.floor(g)!==g?(q(g,u),new K.ERR_OUT_OF_RANGE("offset","an integer",g)):c<0?new K.ERR_BUFFER_OUT_OF_BOUNDS:new K.ERR_OUT_OF_RANGE("offset",`>= 0 and <= ${c}`,g)}const we=/[^+/0-9A-Za-z-_]/g;function se(g){if(g=g.split("=")[0],g=g.trim().replace(we,""),g.length<2)return"";for(;g.length%4!==0;)g=g+"=";return g}function pe(g,c){c=c||1/0;let u;const _=g.length;let I=null;const P=[];for(let H=0;H<_;++H){if(u=g.charCodeAt(H),u>55295&&u<57344){if(!I){if(u>56319){(c-=3)>-1&&P.push(239,191,189);continue}else if(H+1===_){(c-=3)>-1&&P.push(239,191,189);continue}I=u;continue}if(u<56320){(c-=3)>-1&&P.push(239,191,189),I=u;continue}u=(I-55296<<10|u-56320)+65536}else I&&(c-=3)>-1&&P.push(239,191,189);if(I=null,u<128){if((c-=1)<0)break;P.push(u)}else if(u<2048){if((c-=2)<0)break;P.push(u>>6|192,u&63|128)}else if(u<65536){if((c-=3)<0)break;P.push(u>>12|224,u>>6&63|128,u&63|128)}else if(u<1114112){if((c-=4)<0)break;P.push(u>>18|240,u>>12&63|128,u>>6&63|128,u&63|128)}else throw new Error("Invalid code point")}return P}function Ge(g){const c=[];for(let u=0;u<g.length;++u)c.push(g.charCodeAt(u)&255);return c}function Je(g,c){let u,_,I;const P=[];for(let H=0;H<g.length&&!((c-=2)<0);++H)u=g.charCodeAt(H),_=u>>8,I=u%256,P.push(I),P.push(_);return P}function Ue(g){return t.toByteArray(se(g))}function Ie(g,c,u,_){let I;for(I=0;I<_&&!(I+u>=c.length||I>=g.length);++I)c[I+u]=g[I];return I}function De(g,c){return g instanceof c||g!=null&&g.constructor!=null&&g.constructor.name!=null&&g.constructor.name===c.name}function ze(g){return g!==g}const We=function(){const g="0123456789abcdef",c=new Array(256);for(let u=0;u<16;++u){const _=u*16;for(let I=0;I<16;++I)c[_+I]=g[u]+g[I]}return c}();function je(g){return typeof BigInt>"u"?ae:g}function ae(){throw new Error("BigInt not supported")}})(ui);(function(e,t){var i=ui,n=i.Buffer;function a(o,s){for(var l in o)s[l]=o[l]}n.from&&n.alloc&&n.allocUnsafe&&n.allocUnsafeSlow?e.exports=i:(a(i,t),t.Buffer=r);function r(o,s,l){return n(o,s,l)}r.prototype=Object.create(n.prototype),a(n,r),r.from=function(o,s,l){if(typeof o=="number")throw new TypeError("Argument must not be a number");return n(o,s,l)},r.alloc=function(o,s,l){if(typeof o!="number")throw new TypeError("Argument must be a number");var d=n(o);return s!==void 0?typeof l=="string"?d.fill(s,l):d.fill(s):d.fill(0),d},r.allocUnsafe=function(o){if(typeof o!="number")throw new TypeError("Argument must be a number");return n(o)},r.allocUnsafeSlow=function(o){if(typeof o!="number")throw new TypeError("Argument must be a number");return i.SlowBuffer(o)}})(Da,Da.exports);var Wl=Da.exports,aa=65536,Ru=4294967295;function $u(){throw new Error(`Secure random number generation is not supported by this browser.
Use Chrome, Firefox or Internet Explorer 11`)}var Mu=Wl.Buffer,cr=globalThis.crypto||globalThis.msCrypto;cr&&cr.getRandomValues?Ba.exports=Pu:Ba.exports=$u;function Pu(e,t){if(e>Ru)throw new RangeError("requested too many random bytes");var i=Mu.allocUnsafe(e);if(e>0)if(e>aa)for(var n=0;n<e;n+=aa)cr.getRandomValues(i.slice(n,n+aa));else cr.getRandomValues(i);return typeof t=="function"?process.nextTick(function(){t(null,i)}):i}var ps=Ba.exports,Oa={exports:{}},Yl=Cr.EventEmitter;const Bu={},Du=Object.freeze(Object.defineProperty({__proto__:null,default:Bu},Symbol.toStringTag,{value:"Module"})),pi=lu(Du);var sa,po;function Ou(){if(po)return sa;po=1;function e(v,w){var k=Object.keys(v);if(Object.getOwnPropertySymbols){var m=Object.getOwnPropertySymbols(v);w&&(m=m.filter(function(b){return Object.getOwnPropertyDescriptor(v,b).enumerable})),k.push.apply(k,m)}return k}function t(v){for(var w=1;w<arguments.length;w++){var k=arguments[w]!=null?arguments[w]:{};w%2?e(Object(k),!0).forEach(function(m){i(v,m,k[m])}):Object.getOwnPropertyDescriptors?Object.defineProperties(v,Object.getOwnPropertyDescriptors(k)):e(Object(k)).forEach(function(m){Object.defineProperty(v,m,Object.getOwnPropertyDescriptor(k,m))})}return v}function i(v,w,k){return w=o(w),w in v?Object.defineProperty(v,w,{value:k,enumerable:!0,configurable:!0,writable:!0}):v[w]=k,v}function n(v,w){if(!(v instanceof w))throw new TypeError("Cannot call a class as a function")}function a(v,w){for(var k=0;k<w.length;k++){var m=w[k];m.enumerable=m.enumerable||!1,m.configurable=!0,"value"in m&&(m.writable=!0),Object.defineProperty(v,o(m.key),m)}}function r(v,w,k){return w&&a(v.prototype,w),Object.defineProperty(v,"prototype",{writable:!1}),v}function o(v){var w=s(v,"string");return typeof w=="symbol"?w:String(w)}function s(v,w){if(typeof v!="object"||v===null)return v;var k=v[Symbol.toPrimitive];if(k!==void 0){var m=k.call(v,w);if(typeof m!="object")return m;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(v)}var l=ui,d=l.Buffer,p=pi,h=p.inspect,f=h&&h.custom||"inspect";function y(v,w,k){d.prototype.copy.call(v,w,k)}return sa=function(){function v(){n(this,v),this.head=null,this.tail=null,this.length=0}return r(v,[{key:"push",value:function(k){var m={data:k,next:null};this.length>0?this.tail.next=m:this.head=m,this.tail=m,++this.length}},{key:"unshift",value:function(k){var m={data:k,next:this.head};this.length===0&&(this.tail=m),this.head=m,++this.length}},{key:"shift",value:function(){if(this.length!==0){var k=this.head.data;return this.length===1?this.head=this.tail=null:this.head=this.head.next,--this.length,k}}},{key:"clear",value:function(){this.head=this.tail=null,this.length=0}},{key:"join",value:function(k){if(this.length===0)return"";for(var m=this.head,b=""+m.data;m=m.next;)b+=k+m.data;return b}},{key:"concat",value:function(k){if(this.length===0)return d.alloc(0);for(var m=d.allocUnsafe(k>>>0),b=this.head,E=0;b;)y(b.data,m,E),E+=b.data.length,b=b.next;return m}},{key:"consume",value:function(k,m){var b;return k<this.head.data.length?(b=this.head.data.slice(0,k),this.head.data=this.head.data.slice(k)):k===this.head.data.length?b=this.shift():b=m?this._getString(k):this._getBuffer(k),b}},{key:"first",value:function(){return this.head.data}},{key:"_getString",value:function(k){var m=this.head,b=1,E=m.data;for(k-=E.length;m=m.next;){var C=m.data,x=k>C.length?C.length:k;if(x===C.length?E+=C:E+=C.slice(0,k),k-=x,k===0){x===C.length?(++b,m.next?this.head=m.next:this.head=this.tail=null):(this.head=m,m.data=C.slice(x));break}++b}return this.length-=b,E}},{key:"_getBuffer",value:function(k){var m=d.allocUnsafe(k),b=this.head,E=1;for(b.data.copy(m),k-=b.data.length;b=b.next;){var C=b.data,x=k>C.length?C.length:k;if(C.copy(m,m.length-k,0,x),k-=x,k===0){x===C.length?(++E,b.next?this.head=b.next:this.head=this.tail=null):(this.head=b,b.data=C.slice(x));break}++E}return this.length-=E,m}},{key:f,value:function(k,m){return h(this,t(t({},m),{},{depth:0,customInspect:!1}))}}]),v}(),sa}function Nu(e,t){var i=this,n=this._readableState&&this._readableState.destroyed,a=this._writableState&&this._writableState.destroyed;return n||a?(t?t(e):e&&(this._writableState?this._writableState.errorEmitted||(this._writableState.errorEmitted=!0,process.nextTick(Na,this,e)):process.nextTick(Na,this,e)),this):(this._readableState&&(this._readableState.destroyed=!0),this._writableState&&(this._writableState.destroyed=!0),this._destroy(e||null,function(r){!t&&r?i._writableState?i._writableState.errorEmitted?process.nextTick(jn,i):(i._writableState.errorEmitted=!0,process.nextTick(ho,i,r)):process.nextTick(ho,i,r):t?(process.nextTick(jn,i),t(r)):process.nextTick(jn,i)}),this)}function ho(e,t){Na(e,t),jn(e)}function jn(e){e._writableState&&!e._writableState.emitClose||e._readableState&&!e._readableState.emitClose||e.emit("close")}function zu(){this._readableState&&(this._readableState.destroyed=!1,this._readableState.reading=!1,this._readableState.ended=!1,this._readableState.endEmitted=!1),this._writableState&&(this._writableState.destroyed=!1,this._writableState.ended=!1,this._writableState.ending=!1,this._writableState.finalCalled=!1,this._writableState.prefinished=!1,this._writableState.finished=!1,this._writableState.errorEmitted=!1)}function Na(e,t){e.emit("error",t)}function Hu(e,t){var i=e._readableState,n=e._writableState;i&&i.autoDestroy||n&&n.autoDestroy?e.destroy(t):e.emit("error",t)}var Vl={destroy:Nu,undestroy:zu,errorOrDestroy:Hu},hi={};function qu(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}var Gl={};function mt(e,t,i){i||(i=Error);function n(r,o,s){return typeof t=="string"?t:t(r,o,s)}var a=function(r){qu(o,r);function o(s,l,d){return r.call(this,n(s,l,d))||this}return o}(i);a.prototype.name=i.name,a.prototype.code=e,Gl[e]=a}function fo(e,t){if(Array.isArray(e)){var i=e.length;return e=e.map(function(n){return String(n)}),i>2?"one of ".concat(t," ").concat(e.slice(0,i-1).join(", "),", or ")+e[i-1]:i===2?"one of ".concat(t," ").concat(e[0]," or ").concat(e[1]):"of ".concat(t," ").concat(e[0])}else return"of ".concat(t," ").concat(String(e))}function Fu(e,t,i){return e.substr(0,t.length)===t}function Uu(e,t,i){return(i===void 0||i>e.length)&&(i=e.length),e.substring(i-t.length,i)===t}function ju(e,t,i){return typeof i!="number"&&(i=0),i+t.length>e.length?!1:e.indexOf(t,i)!==-1}mt("ERR_INVALID_OPT_VALUE",function(e,t){return'The value "'+t+'" is invalid for option "'+e+'"'},TypeError);mt("ERR_INVALID_ARG_TYPE",function(e,t,i){var n;typeof t=="string"&&Fu(t,"not ")?(n="must not be",t=t.replace(/^not /,"")):n="must be";var a;if(Uu(e," argument"))a="The ".concat(e," ").concat(n," ").concat(fo(t,"type"));else{var r=ju(e,".")?"property":"argument";a='The "'.concat(e,'" ').concat(r," ").concat(n," ").concat(fo(t,"type"))}return a+=". Received type ".concat(typeof i),a},TypeError);mt("ERR_STREAM_PUSH_AFTER_EOF","stream.push() after EOF");mt("ERR_METHOD_NOT_IMPLEMENTED",function(e){return"The "+e+" method is not implemented"});mt("ERR_STREAM_PREMATURE_CLOSE","Premature close");mt("ERR_STREAM_DESTROYED",function(e){return"Cannot call "+e+" after a stream was destroyed"});mt("ERR_MULTIPLE_CALLBACK","Callback called multiple times");mt("ERR_STREAM_CANNOT_PIPE","Cannot pipe, not readable");mt("ERR_STREAM_WRITE_AFTER_END","write after end");mt("ERR_STREAM_NULL_VALUES","May not write null values to stream",TypeError);mt("ERR_UNKNOWN_ENCODING",function(e){return"Unknown encoding: "+e},TypeError);mt("ERR_STREAM_UNSHIFT_AFTER_END_EVENT","stream.unshift() after end event");hi.codes=Gl;var Ku=hi.codes.ERR_INVALID_OPT_VALUE;function Wu(e,t,i){return e.highWaterMark!=null?e.highWaterMark:t?e[i]:null}function Yu(e,t,i,n){var a=Wu(t,n,i);if(a!=null){if(!(isFinite(a)&&Math.floor(a)===a)||a<0){var r=n?i:"highWaterMark";throw new Ku(r,a)}return Math.floor(a)}return e.objectMode?16:16*1024}var Jl={getHighWaterMark:Yu},za={exports:{}};typeof Object.create=="function"?za.exports=function(t,i){i&&(t.super_=i,t.prototype=Object.create(i.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}))}:za.exports=function(t,i){if(i){t.super_=i;var n=function(){};n.prototype=i.prototype,t.prototype=new n,t.prototype.constructor=t}};var yn=za.exports,Vu=Gu;function Gu(e,t){if(oa("noDeprecation"))return e;var i=!1;function n(){if(!i){if(oa("throwDeprecation"))throw new Error(t);oa("traceDeprecation"),i=!0}return e.apply(this,arguments)}return n}function oa(e){try{if(!globalThis.localStorage)return!1}catch{return!1}var t=globalThis.localStorage[e];return t==null?!1:String(t).toLowerCase()==="true"}var la,mo;function Xl(){if(mo)return la;mo=1,la=L;function e($){var M=this;this.next=null,this.entry=null,this.finish=function(){Q(M,$)}}var t;L.WritableState=T;var i={deprecate:Vu},n=Yl,a=ui.Buffer,r=(typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof self<"u"?self:{}).Uint8Array||function(){};function o($){return a.from($)}function s($){return a.isBuffer($)||$ instanceof r}var l=Vl,d=Jl,p=d.getHighWaterMark,h=hi.codes,f=h.ERR_INVALID_ARG_TYPE,y=h.ERR_METHOD_NOT_IMPLEMENTED,v=h.ERR_MULTIPLE_CALLBACK,w=h.ERR_STREAM_CANNOT_PIPE,k=h.ERR_STREAM_DESTROYED,m=h.ERR_STREAM_NULL_VALUES,b=h.ERR_STREAM_WRITE_AFTER_END,E=h.ERR_UNKNOWN_ENCODING,C=l.errorOrDestroy;yn(L,n);function x(){}function T($,M,K){t=t||$i(),$=$||{},typeof K!="boolean"&&(K=M instanceof t),this.objectMode=!!$.objectMode,K&&(this.objectMode=this.objectMode||!!$.writableObjectMode),this.highWaterMark=p(this,$,"writableHighWaterMark",K),this.finalCalled=!1,this.needDrain=!1,this.ending=!1,this.ended=!1,this.finished=!1,this.destroyed=!1;var re=$.decodeStrings===!1;this.decodeStrings=!re,this.defaultEncoding=$.defaultEncoding||"utf8",this.length=0,this.writing=!1,this.corked=0,this.sync=!0,this.bufferProcessing=!1,this.onwrite=function(le){ne(M,le)},this.writecb=null,this.writelen=0,this.bufferedRequest=null,this.lastBufferedRequest=null,this.pendingcb=0,this.prefinished=!1,this.errorEmitted=!1,this.emitClose=$.emitClose!==!1,this.autoDestroy=!!$.autoDestroy,this.bufferedRequestCount=0,this.corkedRequestsFree=new e(this)}T.prototype.getBuffer=function(){for(var M=this.bufferedRequest,K=[];M;)K.push(M),M=M.next;return K},function(){try{Object.defineProperty(T.prototype,"buffer",{get:i.deprecate(function(){return this.getBuffer()},"_writableState.buffer is deprecated. Use _writableState.getBuffer instead.","DEP0003")})}catch{}}();var R;typeof Symbol=="function"&&Symbol.hasInstance&&typeof Function.prototype[Symbol.hasInstance]=="function"?(R=Function.prototype[Symbol.hasInstance],Object.defineProperty(L,Symbol.hasInstance,{value:function(M){return R.call(this,M)?!0:this!==L?!1:M&&M._writableState instanceof T}})):R=function(M){return M instanceof this};function L($){t=t||$i();var M=this instanceof t;if(!M&&!R.call(L,this))return new L($);this._writableState=new T($,this,M),this.writable=!0,$&&(typeof $.write=="function"&&(this._write=$.write),typeof $.writev=="function"&&(this._writev=$.writev),typeof $.destroy=="function"&&(this._destroy=$.destroy),typeof $.final=="function"&&(this._final=$.final)),n.call(this)}L.prototype.pipe=function(){C(this,new w)};function D($,M){var K=new b;C($,K),process.nextTick(M,K)}function N($,M,K,re){var le;return K===null?le=new m:typeof K!="string"&&!M.objectMode&&(le=new f("chunk",["string","Buffer"],K)),le?(C($,le),process.nextTick(re,le),!1):!0}L.prototype.write=function($,M,K){var re=this._writableState,le=!1,S=!re.objectMode&&s($);return S&&!a.isBuffer($)&&($=o($)),typeof M=="function"&&(K=M,M=null),S?M="buffer":M||(M=re.defaultEncoding),typeof K!="function"&&(K=x),re.ending?D(this,K):(S||N(this,re,$,K))&&(re.pendingcb++,le=j(this,re,S,$,M,K)),le},L.prototype.cork=function(){this._writableState.corked++},L.prototype.uncork=function(){var $=this._writableState;$.corked&&($.corked--,!$.writing&&!$.corked&&!$.bufferProcessing&&$.bufferedRequest&&Y(this,$))},L.prototype.setDefaultEncoding=function(M){if(typeof M=="string"&&(M=M.toLowerCase()),!(["hex","utf8","utf-8","ascii","binary","base64","ucs2","ucs-2","utf16le","utf-16le","raw"].indexOf((M+"").toLowerCase())>-1))throw new E(M);return this._writableState.defaultEncoding=M,this},Object.defineProperty(L.prototype,"writableBuffer",{enumerable:!1,get:function(){return this._writableState&&this._writableState.getBuffer()}});function U($,M,K){return!$.objectMode&&$.decodeStrings!==!1&&typeof M=="string"&&(M=a.from(M,K)),M}Object.defineProperty(L.prototype,"writableHighWaterMark",{enumerable:!1,get:function(){return this._writableState.highWaterMark}});function j($,M,K,re,le,S){if(!K){var A=U(M,re,le);re!==A&&(K=!0,le="buffer",re=A)}var q=M.objectMode?1:re.length;M.length+=q;var ee=M.length<M.highWaterMark;if(ee||(M.needDrain=!0),M.writing||M.corked){var we=M.lastBufferedRequest;M.lastBufferedRequest={chunk:re,encoding:le,isBuf:K,callback:S,next:null},we?we.next=M.lastBufferedRequest:M.bufferedRequest=M.lastBufferedRequest,M.bufferedRequestCount+=1}else O($,M,!1,q,re,le,S);return ee}function O($,M,K,re,le,S,A){M.writelen=re,M.writecb=A,M.writing=!0,M.sync=!0,M.destroyed?M.onwrite(new k("write")):K?$._writev(le,M.onwrite):$._write(le,S,M.onwrite),M.sync=!1}function B($,M,K,re,le){--M.pendingcb,K?(process.nextTick(le,re),process.nextTick(fe,$,M),$._writableState.errorEmitted=!0,C($,re)):(le(re),$._writableState.errorEmitted=!0,C($,re),fe($,M))}function W($){$.writing=!1,$.writecb=null,$.length-=$.writelen,$.writelen=0}function ne($,M){var K=$._writableState,re=K.sync,le=K.writecb;if(typeof le!="function")throw new v;if(W(K),M)B($,K,re,M,le);else{var S=Z(K)||$.destroyed;!S&&!K.corked&&!K.bufferProcessing&&K.bufferedRequest&&Y($,K),re?process.nextTick(z,$,K,S,le):z($,K,S,le)}}function z($,M,K,re){K||G($,M),M.pendingcb--,re(),fe($,M)}function G($,M){M.length===0&&M.needDrain&&(M.needDrain=!1,$.emit("drain"))}function Y($,M){M.bufferProcessing=!0;var K=M.bufferedRequest;if($._writev&&K&&K.next){var re=M.bufferedRequestCount,le=new Array(re),S=M.corkedRequestsFree;S.entry=K;for(var A=0,q=!0;K;)le[A]=K,K.isBuf||(q=!1),K=K.next,A+=1;le.allBuffers=q,O($,M,!0,M.length,le,"",S.finish),M.pendingcb++,M.lastBufferedRequest=null,S.next?(M.corkedRequestsFree=S.next,S.next=null):M.corkedRequestsFree=new e(M),M.bufferedRequestCount=0}else{for(;K;){var ee=K.chunk,we=K.encoding,se=K.callback,pe=M.objectMode?1:ee.length;if(O($,M,!1,pe,ee,we,se),K=K.next,M.bufferedRequestCount--,M.writing)break}K===null&&(M.lastBufferedRequest=null)}M.bufferedRequest=K,M.bufferProcessing=!1}L.prototype._write=function($,M,K){K(new y("_write()"))},L.prototype._writev=null,L.prototype.end=function($,M,K){var re=this._writableState;return typeof $=="function"?(K=$,$=null,M=null):typeof M=="function"&&(K=M,M=null),$!=null&&this.write($,M),re.corked&&(re.corked=1,this.uncork()),re.ending||me(this,re,K),this},Object.defineProperty(L.prototype,"writableLength",{enumerable:!1,get:function(){return this._writableState.length}});function Z($){return $.ending&&$.length===0&&$.bufferedRequest===null&&!$.finished&&!$.writing}function X($,M){$._final(function(K){M.pendingcb--,K&&C($,K),M.prefinished=!0,$.emit("prefinish"),fe($,M)})}function ie($,M){!M.prefinished&&!M.finalCalled&&(typeof $._final=="function"&&!M.destroyed?(M.pendingcb++,M.finalCalled=!0,process.nextTick(X,$,M)):(M.prefinished=!0,$.emit("prefinish")))}function fe($,M){var K=Z(M);if(K&&(ie($,M),M.pendingcb===0&&(M.finished=!0,$.emit("finish"),M.autoDestroy))){var re=$._readableState;(!re||re.autoDestroy&&re.endEmitted)&&$.destroy()}return K}function me($,M,K){M.ending=!0,fe($,M),K&&(M.finished?process.nextTick(K):$.once("finish",K)),M.ended=!0,$.writable=!1}function Q($,M,K){var re=$.entry;for($.entry=null;re;){var le=re.callback;M.pendingcb--,le(K),re=re.next}M.corkedRequestsFree.next=$}return Object.defineProperty(L.prototype,"destroyed",{enumerable:!1,get:function(){return this._writableState===void 0?!1:this._writableState.destroyed},set:function(M){this._writableState&&(this._writableState.destroyed=M)}}),L.prototype.destroy=l.destroy,L.prototype._undestroy=l.undestroy,L.prototype._destroy=function($,M){M($)},la}var ca,go;function $i(){if(go)return ca;go=1;var e=Object.keys||function(d){var p=[];for(var h in d)p.push(h);return p};ca=o;var t=Ql(),i=Xl();yn(o,t);for(var n=e(i.prototype),a=0;a<n.length;a++){var r=n[a];o.prototype[r]||(o.prototype[r]=i.prototype[r])}function o(d){if(!(this instanceof o))return new o(d);t.call(this,d),i.call(this,d),this.allowHalfOpen=!0,d&&(d.readable===!1&&(this.readable=!1),d.writable===!1&&(this.writable=!1),d.allowHalfOpen===!1&&(this.allowHalfOpen=!1,this.once("end",s)))}Object.defineProperty(o.prototype,"writableHighWaterMark",{enumerable:!1,get:function(){return this._writableState.highWaterMark}}),Object.defineProperty(o.prototype,"writableBuffer",{enumerable:!1,get:function(){return this._writableState&&this._writableState.getBuffer()}}),Object.defineProperty(o.prototype,"writableLength",{enumerable:!1,get:function(){return this._writableState.length}});function s(){this._writableState.ended||process.nextTick(l,this)}function l(d){d.end()}return Object.defineProperty(o.prototype,"destroyed",{enumerable:!1,get:function(){return this._readableState===void 0||this._writableState===void 0?!1:this._readableState.destroyed&&this._writableState.destroyed},set:function(p){this._readableState===void 0||this._writableState===void 0||(this._readableState.destroyed=p,this._writableState.destroyed=p)}}),ca}var da={},yo;function vo(){if(yo)return da;yo=1;var e=Wl.Buffer,t=e.isEncoding||function(m){switch(m=""+m,m&&m.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return!0;default:return!1}};function i(m){if(!m)return"utf8";for(var b;;)switch(m){case"utf8":case"utf-8":return"utf8";case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return"utf16le";case"latin1":case"binary":return"latin1";case"base64":case"ascii":case"hex":return m;default:if(b)return;m=(""+m).toLowerCase(),b=!0}}function n(m){var b=i(m);if(typeof b!="string"&&(e.isEncoding===t||!t(m)))throw new Error("Unknown encoding: "+m);return b||m}da.StringDecoder=a;function a(m){this.encoding=n(m);var b;switch(this.encoding){case"utf16le":this.text=h,this.end=f,b=4;break;case"utf8":this.fillLast=l,b=4;break;case"base64":this.text=y,this.end=v,b=3;break;default:this.write=w,this.end=k;return}this.lastNeed=0,this.lastTotal=0,this.lastChar=e.allocUnsafe(b)}a.prototype.write=function(m){if(m.length===0)return"";var b,E;if(this.lastNeed){if(b=this.fillLast(m),b===void 0)return"";E=this.lastNeed,this.lastNeed=0}else E=0;return E<m.length?b?b+this.text(m,E):this.text(m,E):b||""},a.prototype.end=p,a.prototype.text=d,a.prototype.fillLast=function(m){if(this.lastNeed<=m.length)return m.copy(this.lastChar,this.lastTotal-this.lastNeed,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal);m.copy(this.lastChar,this.lastTotal-this.lastNeed,0,m.length),this.lastNeed-=m.length};function r(m){return m<=127?0:m>>5===6?2:m>>4===14?3:m>>3===30?4:m>>6===2?-1:-2}function o(m,b,E){var C=b.length-1;if(C<E)return 0;var x=r(b[C]);return x>=0?(x>0&&(m.lastNeed=x-1),x):--C<E||x===-2?0:(x=r(b[C]),x>=0?(x>0&&(m.lastNeed=x-2),x):--C<E||x===-2?0:(x=r(b[C]),x>=0?(x>0&&(x===2?x=0:m.lastNeed=x-3),x):0))}function s(m,b,E){if((b[0]&192)!==128)return m.lastNeed=0,"�";if(m.lastNeed>1&&b.length>1){if((b[1]&192)!==128)return m.lastNeed=1,"�";if(m.lastNeed>2&&b.length>2&&(b[2]&192)!==128)return m.lastNeed=2,"�"}}function l(m){var b=this.lastTotal-this.lastNeed,E=s(this,m);if(E!==void 0)return E;if(this.lastNeed<=m.length)return m.copy(this.lastChar,b,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal);m.copy(this.lastChar,b,0,m.length),this.lastNeed-=m.length}function d(m,b){var E=o(this,m,b);if(!this.lastNeed)return m.toString("utf8",b);this.lastTotal=E;var C=m.length-(E-this.lastNeed);return m.copy(this.lastChar,0,C),m.toString("utf8",b,C)}function p(m){var b=m&&m.length?this.write(m):"";return this.lastNeed?b+"�":b}function h(m,b){if((m.length-b)%2===0){var E=m.toString("utf16le",b);if(E){var C=E.charCodeAt(E.length-1);if(C>=55296&&C<=56319)return this.lastNeed=2,this.lastTotal=4,this.lastChar[0]=m[m.length-2],this.lastChar[1]=m[m.length-1],E.slice(0,-1)}return E}return this.lastNeed=1,this.lastTotal=2,this.lastChar[0]=m[m.length-1],m.toString("utf16le",b,m.length-1)}function f(m){var b=m&&m.length?this.write(m):"";if(this.lastNeed){var E=this.lastTotal-this.lastNeed;return b+this.lastChar.toString("utf16le",0,E)}return b}function y(m,b){var E=(m.length-b)%3;return E===0?m.toString("base64",b):(this.lastNeed=3-E,this.lastTotal=3,E===1?this.lastChar[0]=m[m.length-1]:(this.lastChar[0]=m[m.length-2],this.lastChar[1]=m[m.length-1]),m.toString("base64",b,m.length-E))}function v(m){var b=m&&m.length?this.write(m):"";return this.lastNeed?b+this.lastChar.toString("base64",0,3-this.lastNeed):b}function w(m){return m.toString(this.encoding)}function k(m){return m&&m.length?this.write(m):""}return da}var bo=hi.codes.ERR_STREAM_PREMATURE_CLOSE;function Ju(e){var t=!1;return function(){if(!t){t=!0;for(var i=arguments.length,n=new Array(i),a=0;a<i;a++)n[a]=arguments[a];e.apply(this,n)}}}function Xu(){}function Zu(e){return e.setHeader&&typeof e.abort=="function"}function Zl(e,t,i){if(typeof t=="function")return Zl(e,null,t);t||(t={}),i=Ju(i||Xu);var n=t.readable||t.readable!==!1&&e.readable,a=t.writable||t.writable!==!1&&e.writable,r=function(){e.writable||s()},o=e._writableState&&e._writableState.finished,s=function(){a=!1,o=!0,n||i.call(e)},l=e._readableState&&e._readableState.endEmitted,d=function(){n=!1,l=!0,a||i.call(e)},p=function(v){i.call(e,v)},h=function(){var v;if(n&&!l)return(!e._readableState||!e._readableState.ended)&&(v=new bo),i.call(e,v);if(a&&!o)return(!e._writableState||!e._writableState.ended)&&(v=new bo),i.call(e,v)},f=function(){e.req.on("finish",s)};return Zu(e)?(e.on("complete",s),e.on("abort",h),e.req?f():e.on("request",f)):a&&!e._writableState&&(e.on("end",r),e.on("close",r)),e.on("end",d),e.on("finish",s),t.error!==!1&&e.on("error",p),e.on("close",h),function(){e.removeListener("complete",s),e.removeListener("abort",h),e.removeListener("request",f),e.req&&e.req.removeListener("finish",s),e.removeListener("end",r),e.removeListener("close",r),e.removeListener("finish",s),e.removeListener("end",d),e.removeListener("error",p),e.removeListener("close",h)}}var hs=Zl,ua,wo;function Qu(){if(wo)return ua;wo=1;var e;function t(E,C,x){return C=i(C),C in E?Object.defineProperty(E,C,{value:x,enumerable:!0,configurable:!0,writable:!0}):E[C]=x,E}function i(E){var C=n(E,"string");return typeof C=="symbol"?C:String(C)}function n(E,C){if(typeof E!="object"||E===null)return E;var x=E[Symbol.toPrimitive];if(x!==void 0){var T=x.call(E,C);if(typeof T!="object")return T;throw new TypeError("@@toPrimitive must return a primitive value.")}return(C==="string"?String:Number)(E)}var a=hs,r=Symbol("lastResolve"),o=Symbol("lastReject"),s=Symbol("error"),l=Symbol("ended"),d=Symbol("lastPromise"),p=Symbol("handlePromise"),h=Symbol("stream");function f(E,C){return{value:E,done:C}}function y(E){var C=E[r];if(C!==null){var x=E[h].read();x!==null&&(E[d]=null,E[r]=null,E[o]=null,C(f(x,!1)))}}function v(E){process.nextTick(y,E)}function w(E,C){return function(x,T){E.then(function(){if(C[l]){x(f(void 0,!0));return}C[p](x,T)},T)}}var k=Object.getPrototypeOf(function(){}),m=Object.setPrototypeOf((e={get stream(){return this[h]},next:function(){var C=this,x=this[s];if(x!==null)return Promise.reject(x);if(this[l])return Promise.resolve(f(void 0,!0));if(this[h].destroyed)return new Promise(function(D,N){process.nextTick(function(){C[s]?N(C[s]):D(f(void 0,!0))})});var T=this[d],R;if(T)R=new Promise(w(T,this));else{var L=this[h].read();if(L!==null)return Promise.resolve(f(L,!1));R=new Promise(this[p])}return this[d]=R,R}},t(e,Symbol.asyncIterator,function(){return this}),t(e,"return",function(){var C=this;return new Promise(function(x,T){C[h].destroy(null,function(R){if(R){T(R);return}x(f(void 0,!0))})})}),e),k),b=function(C){var x,T=Object.create(m,(x={},t(x,h,{value:C,writable:!0}),t(x,r,{value:null,writable:!0}),t(x,o,{value:null,writable:!0}),t(x,s,{value:null,writable:!0}),t(x,l,{value:C._readableState.endEmitted,writable:!0}),t(x,p,{value:function(L,D){var N=T[h].read();N?(T[d]=null,T[r]=null,T[o]=null,L(f(N,!1))):(T[r]=L,T[o]=D)},writable:!0}),x));return T[d]=null,a(C,function(R){if(R&&R.code!=="ERR_STREAM_PREMATURE_CLOSE"){var L=T[o];L!==null&&(T[d]=null,T[r]=null,T[o]=null,L(R)),T[s]=R;return}var D=T[r];D!==null&&(T[d]=null,T[r]=null,T[o]=null,D(f(void 0,!0))),T[l]=!0}),C.on("readable",v.bind(null,T)),T};return ua=b,ua}var pa,ko;function ep(){return ko||(ko=1,pa=function(){throw new Error("Readable.from is not available in the browser")}),pa}var ha,_o;function Ql(){if(_o)return ha;_o=1,ha=D;var e;D.ReadableState=L,Cr.EventEmitter;var t=function(A,q){return A.listeners(q).length},i=Yl,n=ui.Buffer,a=(typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof self<"u"?self:{}).Uint8Array||function(){};function r(S){return n.from(S)}function o(S){return n.isBuffer(S)||S instanceof a}var s=pi,l;s&&s.debuglog?l=s.debuglog("stream"):l=function(){};var d=Ou(),p=Vl,h=Jl,f=h.getHighWaterMark,y=hi.codes,v=y.ERR_INVALID_ARG_TYPE,w=y.ERR_STREAM_PUSH_AFTER_EOF,k=y.ERR_METHOD_NOT_IMPLEMENTED,m=y.ERR_STREAM_UNSHIFT_AFTER_END_EVENT,b,E,C;yn(D,i);var x=p.errorOrDestroy,T=["error","close","destroy","pause","resume"];function R(S,A,q){if(typeof S.prependListener=="function")return S.prependListener(A,q);!S._events||!S._events[A]?S.on(A,q):Array.isArray(S._events[A])?S._events[A].unshift(q):S._events[A]=[q,S._events[A]]}function L(S,A,q){e=e||$i(),S=S||{},typeof q!="boolean"&&(q=A instanceof e),this.objectMode=!!S.objectMode,q&&(this.objectMode=this.objectMode||!!S.readableObjectMode),this.highWaterMark=f(this,S,"readableHighWaterMark",q),this.buffer=new d,this.length=0,this.pipes=null,this.pipesCount=0,this.flowing=null,this.ended=!1,this.endEmitted=!1,this.reading=!1,this.sync=!0,this.needReadable=!1,this.emittedReadable=!1,this.readableListening=!1,this.resumeScheduled=!1,this.paused=!0,this.emitClose=S.emitClose!==!1,this.autoDestroy=!!S.autoDestroy,this.destroyed=!1,this.defaultEncoding=S.defaultEncoding||"utf8",this.awaitDrain=0,this.readingMore=!1,this.decoder=null,this.encoding=null,S.encoding&&(b||(b=vo().StringDecoder),this.decoder=new b(S.encoding),this.encoding=S.encoding)}function D(S){if(e=e||$i(),!(this instanceof D))return new D(S);var A=this instanceof e;this._readableState=new L(S,this,A),this.readable=!0,S&&(typeof S.read=="function"&&(this._read=S.read),typeof S.destroy=="function"&&(this._destroy=S.destroy)),i.call(this)}Object.defineProperty(D.prototype,"destroyed",{enumerable:!1,get:function(){return this._readableState===void 0?!1:this._readableState.destroyed},set:function(A){this._readableState&&(this._readableState.destroyed=A)}}),D.prototype.destroy=p.destroy,D.prototype._undestroy=p.undestroy,D.prototype._destroy=function(S,A){A(S)},D.prototype.push=function(S,A){var q=this._readableState,ee;return q.objectMode?ee=!0:typeof S=="string"&&(A=A||q.defaultEncoding,A!==q.encoding&&(S=n.from(S,A),A=""),ee=!0),N(this,S,A,!1,ee)},D.prototype.unshift=function(S){return N(this,S,null,!0,!1)};function N(S,A,q,ee,we){l("readableAddChunk",A);var se=S._readableState;if(A===null)se.reading=!1,ne(S,se);else{var pe;if(we||(pe=j(se,A)),pe)x(S,pe);else if(se.objectMode||A&&A.length>0)if(typeof A!="string"&&!se.objectMode&&Object.getPrototypeOf(A)!==n.prototype&&(A=r(A)),ee)se.endEmitted?x(S,new m):U(S,se,A,!0);else if(se.ended)x(S,new w);else{if(se.destroyed)return!1;se.reading=!1,se.decoder&&!q?(A=se.decoder.write(A),se.objectMode||A.length!==0?U(S,se,A,!1):Y(S,se)):U(S,se,A,!1)}else ee||(se.reading=!1,Y(S,se))}return!se.ended&&(se.length<se.highWaterMark||se.length===0)}function U(S,A,q,ee){A.flowing&&A.length===0&&!A.sync?(A.awaitDrain=0,S.emit("data",q)):(A.length+=A.objectMode?1:q.length,ee?A.buffer.unshift(q):A.buffer.push(q),A.needReadable&&z(S)),Y(S,A)}function j(S,A){var q;return!o(A)&&typeof A!="string"&&A!==void 0&&!S.objectMode&&(q=new v("chunk",["string","Buffer","Uint8Array"],A)),q}D.prototype.isPaused=function(){return this._readableState.flowing===!1},D.prototype.setEncoding=function(S){b||(b=vo().StringDecoder);var A=new b(S);this._readableState.decoder=A,this._readableState.encoding=this._readableState.decoder.encoding;for(var q=this._readableState.buffer.head,ee="";q!==null;)ee+=A.write(q.data),q=q.next;return this._readableState.buffer.clear(),ee!==""&&this._readableState.buffer.push(ee),this._readableState.length=ee.length,this};var O=1073741824;function B(S){return S>=O?S=O:(S--,S|=S>>>1,S|=S>>>2,S|=S>>>4,S|=S>>>8,S|=S>>>16,S++),S}function W(S,A){return S<=0||A.length===0&&A.ended?0:A.objectMode?1:S!==S?A.flowing&&A.length?A.buffer.head.data.length:A.length:(S>A.highWaterMark&&(A.highWaterMark=B(S)),S<=A.length?S:A.ended?A.length:(A.needReadable=!0,0))}D.prototype.read=function(S){l("read",S),S=parseInt(S,10);var A=this._readableState,q=S;if(S!==0&&(A.emittedReadable=!1),S===0&&A.needReadable&&((A.highWaterMark!==0?A.length>=A.highWaterMark:A.length>0)||A.ended))return l("read: emitReadable",A.length,A.ended),A.length===0&&A.ended?K(this):z(this),null;if(S=W(S,A),S===0&&A.ended)return A.length===0&&K(this),null;var ee=A.needReadable;l("need readable",ee),(A.length===0||A.length-S<A.highWaterMark)&&(ee=!0,l("length less than watermark",ee)),A.ended||A.reading?(ee=!1,l("reading or ended",ee)):ee&&(l("do read"),A.reading=!0,A.sync=!0,A.length===0&&(A.needReadable=!0),this._read(A.highWaterMark),A.sync=!1,A.reading||(S=W(q,A)));var we;return S>0?we=M(S,A):we=null,we===null?(A.needReadable=A.length<=A.highWaterMark,S=0):(A.length-=S,A.awaitDrain=0),A.length===0&&(A.ended||(A.needReadable=!0),q!==S&&A.ended&&K(this)),we!==null&&this.emit("data",we),we};function ne(S,A){if(l("onEofChunk"),!A.ended){if(A.decoder){var q=A.decoder.end();q&&q.length&&(A.buffer.push(q),A.length+=A.objectMode?1:q.length)}A.ended=!0,A.sync?z(S):(A.needReadable=!1,A.emittedReadable||(A.emittedReadable=!0,G(S)))}}function z(S){var A=S._readableState;l("emitReadable",A.needReadable,A.emittedReadable),A.needReadable=!1,A.emittedReadable||(l("emitReadable",A.flowing),A.emittedReadable=!0,process.nextTick(G,S))}function G(S){var A=S._readableState;l("emitReadable_",A.destroyed,A.length,A.ended),!A.destroyed&&(A.length||A.ended)&&(S.emit("readable"),A.emittedReadable=!1),A.needReadable=!A.flowing&&!A.ended&&A.length<=A.highWaterMark,$(S)}function Y(S,A){A.readingMore||(A.readingMore=!0,process.nextTick(Z,S,A))}function Z(S,A){for(;!A.reading&&!A.ended&&(A.length<A.highWaterMark||A.flowing&&A.length===0);){var q=A.length;if(l("maybeReadMore read 0"),S.read(0),q===A.length)break}A.readingMore=!1}D.prototype._read=function(S){x(this,new k("_read()"))},D.prototype.pipe=function(S,A){var q=this,ee=this._readableState;switch(ee.pipesCount){case 0:ee.pipes=S;break;case 1:ee.pipes=[ee.pipes,S];break;default:ee.pipes.push(S);break}ee.pipesCount+=1,l("pipe count=%d opts=%j",ee.pipesCount,A);var we=(!A||A.end!==!1)&&S!==process.stdout&&S!==process.stderr,se=we?Ge:ae;ee.endEmitted?process.nextTick(se):q.once("end",se),S.on("unpipe",pe);function pe(g,c){l("onunpipe"),g===q&&c&&c.hasUnpiped===!1&&(c.hasUnpiped=!0,Ie())}function Ge(){l("onend"),S.end()}var Je=X(q);S.on("drain",Je);var Ue=!1;function Ie(){l("cleanup"),S.removeListener("close",We),S.removeListener("finish",je),S.removeListener("drain",Je),S.removeListener("error",ze),S.removeListener("unpipe",pe),q.removeListener("end",Ge),q.removeListener("end",ae),q.removeListener("data",De),Ue=!0,ee.awaitDrain&&(!S._writableState||S._writableState.needDrain)&&Je()}q.on("data",De);function De(g){l("ondata");var c=S.write(g);l("dest.write",c),c===!1&&((ee.pipesCount===1&&ee.pipes===S||ee.pipesCount>1&&le(ee.pipes,S)!==-1)&&!Ue&&(l("false write response, pause",ee.awaitDrain),ee.awaitDrain++),q.pause())}function ze(g){l("onerror",g),ae(),S.removeListener("error",ze),t(S,"error")===0&&x(S,g)}R(S,"error",ze);function We(){S.removeListener("finish",je),ae()}S.once("close",We);function je(){l("onfinish"),S.removeListener("close",We),ae()}S.once("finish",je);function ae(){l("unpipe"),q.unpipe(S)}return S.emit("pipe",q),ee.flowing||(l("pipe resume"),q.resume()),S};function X(S){return function(){var q=S._readableState;l("pipeOnDrain",q.awaitDrain),q.awaitDrain&&q.awaitDrain--,q.awaitDrain===0&&t(S,"data")&&(q.flowing=!0,$(S))}}D.prototype.unpipe=function(S){var A=this._readableState,q={hasUnpiped:!1};if(A.pipesCount===0)return this;if(A.pipesCount===1)return S&&S!==A.pipes?this:(S||(S=A.pipes),A.pipes=null,A.pipesCount=0,A.flowing=!1,S&&S.emit("unpipe",this,q),this);if(!S){var ee=A.pipes,we=A.pipesCount;A.pipes=null,A.pipesCount=0,A.flowing=!1;for(var se=0;se<we;se++)ee[se].emit("unpipe",this,{hasUnpiped:!1});return this}var pe=le(A.pipes,S);return pe===-1?this:(A.pipes.splice(pe,1),A.pipesCount-=1,A.pipesCount===1&&(A.pipes=A.pipes[0]),S.emit("unpipe",this,q),this)},D.prototype.on=function(S,A){var q=i.prototype.on.call(this,S,A),ee=this._readableState;return S==="data"?(ee.readableListening=this.listenerCount("readable")>0,ee.flowing!==!1&&this.resume()):S==="readable"&&!ee.endEmitted&&!ee.readableListening&&(ee.readableListening=ee.needReadable=!0,ee.flowing=!1,ee.emittedReadable=!1,l("on readable",ee.length,ee.reading),ee.length?z(this):ee.reading||process.nextTick(fe,this)),q},D.prototype.addListener=D.prototype.on,D.prototype.removeListener=function(S,A){var q=i.prototype.removeListener.call(this,S,A);return S==="readable"&&process.nextTick(ie,this),q},D.prototype.removeAllListeners=function(S){var A=i.prototype.removeAllListeners.apply(this,arguments);return(S==="readable"||S===void 0)&&process.nextTick(ie,this),A};function ie(S){var A=S._readableState;A.readableListening=S.listenerCount("readable")>0,A.resumeScheduled&&!A.paused?A.flowing=!0:S.listenerCount("data")>0&&S.resume()}function fe(S){l("readable nexttick read 0"),S.read(0)}D.prototype.resume=function(){var S=this._readableState;return S.flowing||(l("resume"),S.flowing=!S.readableListening,me(this,S)),S.paused=!1,this};function me(S,A){A.resumeScheduled||(A.resumeScheduled=!0,process.nextTick(Q,S,A))}function Q(S,A){l("resume",A.reading),A.reading||S.read(0),A.resumeScheduled=!1,S.emit("resume"),$(S),A.flowing&&!A.reading&&S.read(0)}D.prototype.pause=function(){return l("call pause flowing=%j",this._readableState.flowing),this._readableState.flowing!==!1&&(l("pause"),this._readableState.flowing=!1,this.emit("pause")),this._readableState.paused=!0,this};function $(S){var A=S._readableState;for(l("flow",A.flowing);A.flowing&&S.read()!==null;);}D.prototype.wrap=function(S){var A=this,q=this._readableState,ee=!1;S.on("end",function(){if(l("wrapped end"),q.decoder&&!q.ended){var pe=q.decoder.end();pe&&pe.length&&A.push(pe)}A.push(null)}),S.on("data",function(pe){if(l("wrapped data"),q.decoder&&(pe=q.decoder.write(pe)),!(q.objectMode&&pe==null)&&!(!q.objectMode&&(!pe||!pe.length))){var Ge=A.push(pe);Ge||(ee=!0,S.pause())}});for(var we in S)this[we]===void 0&&typeof S[we]=="function"&&(this[we]=function(Ge){return function(){return S[Ge].apply(S,arguments)}}(we));for(var se=0;se<T.length;se++)S.on(T[se],this.emit.bind(this,T[se]));return this._read=function(pe){l("wrapped _read",pe),ee&&(ee=!1,S.resume())},this},typeof Symbol=="function"&&(D.prototype[Symbol.asyncIterator]=function(){return E===void 0&&(E=Qu()),E(this)}),Object.defineProperty(D.prototype,"readableHighWaterMark",{enumerable:!1,get:function(){return this._readableState.highWaterMark}}),Object.defineProperty(D.prototype,"readableBuffer",{enumerable:!1,get:function(){return this._readableState&&this._readableState.buffer}}),Object.defineProperty(D.prototype,"readableFlowing",{enumerable:!1,get:function(){return this._readableState.flowing},set:function(A){this._readableState&&(this._readableState.flowing=A)}}),D._fromList=M,Object.defineProperty(D.prototype,"readableLength",{enumerable:!1,get:function(){return this._readableState.length}});function M(S,A){if(A.length===0)return null;var q;return A.objectMode?q=A.buffer.shift():!S||S>=A.length?(A.decoder?q=A.buffer.join(""):A.buffer.length===1?q=A.buffer.first():q=A.buffer.concat(A.length),A.buffer.clear()):q=A.buffer.consume(S,A.decoder),q}function K(S){var A=S._readableState;l("endReadable",A.endEmitted),A.endEmitted||(A.ended=!0,process.nextTick(re,A,S))}function re(S,A){if(l("endReadableNT",S.endEmitted,S.length),!S.endEmitted&&S.length===0&&(S.endEmitted=!0,A.readable=!1,A.emit("end"),S.autoDestroy)){var q=A._writableState;(!q||q.autoDestroy&&q.finished)&&A.destroy()}}typeof Symbol=="function"&&(D.from=function(S,A){return C===void 0&&(C=ep()),C(D,S,A)});function le(S,A){for(var q=0,ee=S.length;q<ee;q++)if(S[q]===A)return q;return-1}return ha}var ec=Bt,Rr=hi.codes,tp=Rr.ERR_METHOD_NOT_IMPLEMENTED,ip=Rr.ERR_MULTIPLE_CALLBACK,np=Rr.ERR_TRANSFORM_ALREADY_TRANSFORMING,rp=Rr.ERR_TRANSFORM_WITH_LENGTH_0,$r=$i();yn(Bt,$r);function ap(e,t){var i=this._transformState;i.transforming=!1;var n=i.writecb;if(n===null)return this.emit("error",new ip);i.writechunk=null,i.writecb=null,t!=null&&this.push(t),n(e);var a=this._readableState;a.reading=!1,(a.needReadable||a.length<a.highWaterMark)&&this._read(a.highWaterMark)}function Bt(e){if(!(this instanceof Bt))return new Bt(e);$r.call(this,e),this._transformState={afterTransform:ap.bind(this),needTransform:!1,transforming:!1,writecb:null,writechunk:null,writeencoding:null},this._readableState.needReadable=!0,this._readableState.sync=!1,e&&(typeof e.transform=="function"&&(this._transform=e.transform),typeof e.flush=="function"&&(this._flush=e.flush)),this.on("prefinish",sp)}function sp(){var e=this;typeof this._flush=="function"&&!this._readableState.destroyed?this._flush(function(t,i){So(e,t,i)}):So(this,null,null)}Bt.prototype.push=function(e,t){return this._transformState.needTransform=!1,$r.prototype.push.call(this,e,t)};Bt.prototype._transform=function(e,t,i){i(new tp("_transform()"))};Bt.prototype._write=function(e,t,i){var n=this._transformState;if(n.writecb=i,n.writechunk=e,n.writeencoding=t,!n.transforming){var a=this._readableState;(n.needTransform||a.needReadable||a.length<a.highWaterMark)&&this._read(a.highWaterMark)}};Bt.prototype._read=function(e){var t=this._transformState;t.writechunk!==null&&!t.transforming?(t.transforming=!0,this._transform(t.writechunk,t.writeencoding,t.afterTransform)):t.needTransform=!0};Bt.prototype._destroy=function(e,t){$r.prototype._destroy.call(this,e,function(i){t(i)})};function So(e,t,i){if(t)return e.emit("error",t);if(i!=null&&e.push(i),e._writableState.length)throw new rp;if(e._transformState.transforming)throw new np;return e.push(null)}var op=un,tc=ec;yn(un,tc);function un(e){if(!(this instanceof un))return new un(e);tc.call(this,e)}un.prototype._transform=function(e,t,i){i(null,e)};var fa;function lp(e){var t=!1;return function(){t||(t=!0,e.apply(void 0,arguments))}}var ic=hi.codes,cp=ic.ERR_MISSING_ARGS,dp=ic.ERR_STREAM_DESTROYED;function xo(e){if(e)throw e}function up(e){return e.setHeader&&typeof e.abort=="function"}function pp(e,t,i,n){n=lp(n);var a=!1;e.on("close",function(){a=!0}),fa===void 0&&(fa=hs),fa(e,{readable:t,writable:i},function(o){if(o)return n(o);a=!0,n()});var r=!1;return function(o){if(!a&&!r){if(r=!0,up(e))return e.abort();if(typeof e.destroy=="function")return e.destroy();n(o||new dp("pipe"))}}}function Eo(e){e()}function hp(e,t){return e.pipe(t)}function fp(e){return!e.length||typeof e[e.length-1]!="function"?xo:e.pop()}function mp(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];var n=fp(t);if(Array.isArray(t[0])&&(t=t[0]),t.length<2)throw new cp("streams");var a,r=t.map(function(o,s){var l=s<t.length-1,d=s>0;return pp(o,l,d,function(p){a||(a=p),p&&r.forEach(Eo),!l&&(r.forEach(Eo),n(a))})});return t.reduce(hp)}var gp=mp;(function(e,t){t=e.exports=Ql(),t.Stream=t,t.Readable=t,t.Writable=Xl(),t.Duplex=$i(),t.Transform=ec,t.PassThrough=op,t.finished=hs,t.pipeline=gp})(Oa,Oa.exports);var nc=Oa.exports;function To(e,t){for(const i in t)Object.defineProperty(e,i,{value:t[i],enumerable:!0,configurable:!0});return e}function yp(e,t,i){if(!e||typeof e=="string")throw new TypeError("Please pass an Error to err-code");i||(i={}),typeof t=="object"&&(i=t,t=""),t&&(i.code=t);try{return To(e,i)}catch{i.message=e.message,i.stack=e.stack;const a=function(){};return a.prototype=Object.create(Object.getPrototypeOf(e)),To(new a,i)}}var vp=yp;const bp=Tr("simple-peer"),rc=_u,Ao=ps,wp=nc,ma=Lr,ve=vp,{Buffer:kp}=ui,ga=64*1024,_p=5*1e3,Sp=5*1e3;function Co(e){return e.replace(/a=ice-options:trickle\s\n/g,"")}let Mr=class Ha extends wp.Duplex{constructor(t){if(t=Object.assign({allowHalfOpen:!1},t),super(t),this._id=Ao(4).toString("hex").slice(0,7),this._debug("new peer %o",t),this.channelName=t.initiator?t.channelName||Ao(20).toString("hex"):null,this.initiator=t.initiator||!1,this.channelConfig=t.channelConfig||Ha.channelConfig,this.channelNegotiated=this.channelConfig.negotiated,this.config=Object.assign({},Ha.config,t.config),this.offerOptions=t.offerOptions||{},this.answerOptions=t.answerOptions||{},this.sdpTransform=t.sdpTransform||(i=>i),this.streams=t.streams||(t.stream?[t.stream]:[]),this.trickle=t.trickle!==void 0?t.trickle:!0,this.allowHalfTrickle=t.allowHalfTrickle!==void 0?t.allowHalfTrickle:!1,this.iceCompleteTimeout=t.iceCompleteTimeout||_p,this.destroyed=!1,this.destroying=!1,this._connected=!1,this.remoteAddress=void 0,this.remoteFamily=void 0,this.remotePort=void 0,this.localAddress=void 0,this.localFamily=void 0,this.localPort=void 0,this._wrtc=t.wrtc&&typeof t.wrtc=="object"?t.wrtc:rc(),!this._wrtc)throw ve(typeof window>"u"?new Error("No WebRTC support: Specify `opts.wrtc` option in this environment"):new Error("No WebRTC support: Not a supported browser"),"ERR_WEBRTC_SUPPORT");this._pcReady=!1,this._channelReady=!1,this._iceComplete=!1,this._iceCompleteTimer=null,this._channel=null,this._pendingCandidates=[],this._isNegotiating=!1,this._firstNegotiation=!0,this._batchedNegotiation=!1,this._queuedNegotiation=!1,this._sendersAwaitingStable=[],this._senderMap=new Map,this._closingInterval=null,this._remoteTracks=[],this._remoteStreams=[],this._chunk=null,this._cb=null,this._interval=null;try{this._pc=new this._wrtc.RTCPeerConnection(this.config)}catch(i){this.destroy(ve(i,"ERR_PC_CONSTRUCTOR"));return}this._isReactNativeWebrtc=typeof this._pc._peerConnectionId=="number",this._pc.oniceconnectionstatechange=()=>{this._onIceStateChange()},this._pc.onicegatheringstatechange=()=>{this._onIceStateChange()},this._pc.onconnectionstatechange=()=>{this._onConnectionStateChange()},this._pc.onsignalingstatechange=()=>{this._onSignalingStateChange()},this._pc.onicecandidate=i=>{this._onIceCandidate(i)},typeof this._pc.peerIdentity=="object"&&this._pc.peerIdentity.catch(i=>{this.destroy(ve(i,"ERR_PC_PEER_IDENTITY"))}),this.initiator||this.channelNegotiated?this._setupData({channel:this._pc.createDataChannel(this.channelName,this.channelConfig)}):this._pc.ondatachannel=i=>{this._setupData(i)},this.streams&&this.streams.forEach(i=>{this.addStream(i)}),this._pc.ontrack=i=>{this._onTrack(i)},this._debug("initial negotiation"),this._needsNegotiation(),this._onFinishBound=()=>{this._onFinish()},this.once("finish",this._onFinishBound)}get bufferSize(){return this._channel&&this._channel.bufferedAmount||0}get connected(){return this._connected&&this._channel.readyState==="open"}address(){return{port:this.localPort,family:this.localFamily,address:this.localAddress}}signal(t){if(!this.destroying){if(this.destroyed)throw ve(new Error("cannot signal after peer is destroyed"),"ERR_DESTROYED");if(typeof t=="string")try{t=JSON.parse(t)}catch{t={}}this._debug("signal()"),t.renegotiate&&this.initiator&&(this._debug("got request to renegotiate"),this._needsNegotiation()),t.transceiverRequest&&this.initiator&&(this._debug("got request for transceiver"),this.addTransceiver(t.transceiverRequest.kind,t.transceiverRequest.init)),t.candidate&&(this._pc.remoteDescription&&this._pc.remoteDescription.type?this._addIceCandidate(t.candidate):this._pendingCandidates.push(t.candidate)),t.sdp&&this._pc.setRemoteDescription(new this._wrtc.RTCSessionDescription(t)).then(()=>{this.destroyed||(this._pendingCandidates.forEach(i=>{this._addIceCandidate(i)}),this._pendingCandidates=[],this._pc.remoteDescription.type==="offer"&&this._createAnswer())}).catch(i=>{this.destroy(ve(i,"ERR_SET_REMOTE_DESCRIPTION"))}),!t.sdp&&!t.candidate&&!t.renegotiate&&!t.transceiverRequest&&this.destroy(ve(new Error("signal() called with invalid signal data"),"ERR_SIGNALING"))}}_addIceCandidate(t){const i=new this._wrtc.RTCIceCandidate(t);this._pc.addIceCandidate(i).catch(n=>{!i.address||i.address.endsWith(".local")?void 0:this.destroy(ve(n,"ERR_ADD_ICE_CANDIDATE"))})}send(t){if(!this.destroying){if(this.destroyed)throw ve(new Error("cannot send after peer is destroyed"),"ERR_DESTROYED");this._channel.send(t)}}addTransceiver(t,i){if(!this.destroying){if(this.destroyed)throw ve(new Error("cannot addTransceiver after peer is destroyed"),"ERR_DESTROYED");if(this._debug("addTransceiver()"),this.initiator)try{this._pc.addTransceiver(t,i),this._needsNegotiation()}catch(n){this.destroy(ve(n,"ERR_ADD_TRANSCEIVER"))}else this.emit("signal",{type:"transceiverRequest",transceiverRequest:{kind:t,init:i}})}}addStream(t){if(!this.destroying){if(this.destroyed)throw ve(new Error("cannot addStream after peer is destroyed"),"ERR_DESTROYED");this._debug("addStream()"),t.getTracks().forEach(i=>{this.addTrack(i,t)})}}addTrack(t,i){if(this.destroying)return;if(this.destroyed)throw ve(new Error("cannot addTrack after peer is destroyed"),"ERR_DESTROYED");this._debug("addTrack()");const n=this._senderMap.get(t)||new Map;let a=n.get(i);if(!a)a=this._pc.addTrack(t,i),n.set(i,a),this._senderMap.set(t,n),this._needsNegotiation();else throw a.removed?ve(new Error("Track has been removed. You should enable/disable tracks that you want to re-add."),"ERR_SENDER_REMOVED"):ve(new Error("Track has already been added to that stream."),"ERR_SENDER_ALREADY_ADDED")}replaceTrack(t,i,n){if(this.destroying)return;if(this.destroyed)throw ve(new Error("cannot replaceTrack after peer is destroyed"),"ERR_DESTROYED");this._debug("replaceTrack()");const a=this._senderMap.get(t),r=a?a.get(n):null;if(!r)throw ve(new Error("Cannot replace track that was never added."),"ERR_TRACK_NOT_ADDED");i&&this._senderMap.set(i,a),r.replaceTrack!=null?r.replaceTrack(i):this.destroy(ve(new Error("replaceTrack is not supported in this browser"),"ERR_UNSUPPORTED_REPLACETRACK"))}removeTrack(t,i){if(this.destroying)return;if(this.destroyed)throw ve(new Error("cannot removeTrack after peer is destroyed"),"ERR_DESTROYED");this._debug("removeSender()");const n=this._senderMap.get(t),a=n?n.get(i):null;if(!a)throw ve(new Error("Cannot remove track that was never added."),"ERR_TRACK_NOT_ADDED");try{a.removed=!0,this._pc.removeTrack(a)}catch(r){r.name==="NS_ERROR_UNEXPECTED"?this._sendersAwaitingStable.push(a):this.destroy(ve(r,"ERR_REMOVE_TRACK"))}this._needsNegotiation()}removeStream(t){if(!this.destroying){if(this.destroyed)throw ve(new Error("cannot removeStream after peer is destroyed"),"ERR_DESTROYED");this._debug("removeSenders()"),t.getTracks().forEach(i=>{this.removeTrack(i,t)})}}_needsNegotiation(){this._debug("_needsNegotiation"),!this._batchedNegotiation&&(this._batchedNegotiation=!0,ma(()=>{this._batchedNegotiation=!1,this.initiator||!this._firstNegotiation?(this._debug("starting batched negotiation"),this.negotiate()):this._debug("non-initiator initial negotiation request discarded"),this._firstNegotiation=!1}))}negotiate(){if(!this.destroying){if(this.destroyed)throw ve(new Error("cannot negotiate after peer is destroyed"),"ERR_DESTROYED");this.initiator?this._isNegotiating?(this._queuedNegotiation=!0,this._debug("already negotiating, queueing")):(this._debug("start negotiation"),setTimeout(()=>{this._createOffer()},0)):this._isNegotiating?(this._queuedNegotiation=!0,this._debug("already negotiating, queueing")):(this._debug("requesting negotiation from initiator"),this.emit("signal",{type:"renegotiate",renegotiate:!0})),this._isNegotiating=!0}}destroy(t){this._destroy(t,()=>{})}_destroy(t,i){this.destroyed||this.destroying||(this.destroying=!0,this._debug("destroying (error: %s)",t&&(t.message||t)),ma(()=>{if(this.destroyed=!0,this.destroying=!1,this._debug("destroy (error: %s)",t&&(t.message||t)),this.readable=this.writable=!1,this._readableState.ended||this.push(null),this._writableState.finished||this.end(),this._connected=!1,this._pcReady=!1,this._channelReady=!1,this._remoteTracks=null,this._remoteStreams=null,this._senderMap=null,clearInterval(this._closingInterval),this._closingInterval=null,clearInterval(this._interval),this._interval=null,this._chunk=null,this._cb=null,this._onFinishBound&&this.removeListener("finish",this._onFinishBound),this._onFinishBound=null,this._channel){try{this._channel.close()}catch{}this._channel.onmessage=null,this._channel.onopen=null,this._channel.onclose=null,this._channel.onerror=null}if(this._pc){try{this._pc.close()}catch{}this._pc.oniceconnectionstatechange=null,this._pc.onicegatheringstatechange=null,this._pc.onsignalingstatechange=null,this._pc.onicecandidate=null,this._pc.ontrack=null,this._pc.ondatachannel=null}this._pc=null,this._channel=null,t&&this.emit("error",t),this.emit("close"),i()}))}_setupData(t){if(!t.channel)return this.destroy(ve(new Error("Data channel event is missing `channel` property"),"ERR_DATA_CHANNEL"));this._channel=t.channel,this._channel.binaryType="arraybuffer",typeof this._channel.bufferedAmountLowThreshold=="number"&&(this._channel.bufferedAmountLowThreshold=ga),this.channelName=this._channel.label,this._channel.onmessage=n=>{this._onChannelMessage(n)},this._channel.onbufferedamountlow=()=>{this._onChannelBufferedAmountLow()},this._channel.onopen=()=>{this._onChannelOpen()},this._channel.onclose=()=>{this._onChannelClose()},this._channel.onerror=n=>{const a=n.error instanceof Error?n.error:new Error(`Datachannel error: ${n.message} ${n.filename}:${n.lineno}:${n.colno}`);this.destroy(ve(a,"ERR_DATA_CHANNEL"))};let i=!1;this._closingInterval=setInterval(()=>{this._channel&&this._channel.readyState==="closing"?(i&&this._onChannelClose(),i=!0):i=!1},Sp)}_read(){}_write(t,i,n){if(this.destroyed)return n(ve(new Error("cannot write after peer is destroyed"),"ERR_DATA_CHANNEL"));if(this._connected){try{this.send(t)}catch(a){return this.destroy(ve(a,"ERR_DATA_CHANNEL"))}this._channel.bufferedAmount>ga?(this._debug("start backpressure: bufferedAmount %d",this._channel.bufferedAmount),this._cb=n):n(null)}else this._debug("write before connect"),this._chunk=t,this._cb=n}_onFinish(){if(this.destroyed)return;const t=()=>{setTimeout(()=>this.destroy(),1e3)};this._connected?t():this.once("connect",t)}_startIceCompleteTimeout(){this.destroyed||this._iceCompleteTimer||(this._debug("started iceComplete timeout"),this._iceCompleteTimer=setTimeout(()=>{this._iceComplete||(this._iceComplete=!0,this._debug("iceComplete timeout completed"),this.emit("iceTimeout"),this.emit("_iceComplete"))},this.iceCompleteTimeout))}_createOffer(){this.destroyed||this._pc.createOffer(this.offerOptions).then(t=>{if(this.destroyed)return;!this.trickle&&!this.allowHalfTrickle&&(t.sdp=Co(t.sdp)),t.sdp=this.sdpTransform(t.sdp);const i=()=>{if(this.destroyed)return;const r=this._pc.localDescription||t;this._debug("signal"),this.emit("signal",{type:r.type,sdp:r.sdp})},n=()=>{this._debug("createOffer success"),!this.destroyed&&(this.trickle||this._iceComplete?i():this.once("_iceComplete",i))},a=r=>{this.destroy(ve(r,"ERR_SET_LOCAL_DESCRIPTION"))};this._pc.setLocalDescription(t).then(n).catch(a)}).catch(t=>{this.destroy(ve(t,"ERR_CREATE_OFFER"))})}_requestMissingTransceivers(){this._pc.getTransceivers&&this._pc.getTransceivers().forEach(t=>{!t.mid&&t.sender.track&&!t.requested&&(t.requested=!0,this.addTransceiver(t.sender.track.kind))})}_createAnswer(){this.destroyed||this._pc.createAnswer(this.answerOptions).then(t=>{if(this.destroyed)return;!this.trickle&&!this.allowHalfTrickle&&(t.sdp=Co(t.sdp)),t.sdp=this.sdpTransform(t.sdp);const i=()=>{if(this.destroyed)return;const r=this._pc.localDescription||t;this._debug("signal"),this.emit("signal",{type:r.type,sdp:r.sdp}),this.initiator||this._requestMissingTransceivers()},n=()=>{this.destroyed||(this.trickle||this._iceComplete?i():this.once("_iceComplete",i))},a=r=>{this.destroy(ve(r,"ERR_SET_LOCAL_DESCRIPTION"))};this._pc.setLocalDescription(t).then(n).catch(a)}).catch(t=>{this.destroy(ve(t,"ERR_CREATE_ANSWER"))})}_onConnectionStateChange(){this.destroyed||this._pc.connectionState==="failed"&&this.destroy(ve(new Error("Connection failed."),"ERR_CONNECTION_FAILURE"))}_onIceStateChange(){if(this.destroyed)return;const t=this._pc.iceConnectionState,i=this._pc.iceGatheringState;this._debug("iceStateChange (connection: %s) (gathering: %s)",t,i),this.emit("iceStateChange",t,i),(t==="connected"||t==="completed")&&(this._pcReady=!0,this._maybeReady()),t==="failed"&&this.destroy(ve(new Error("Ice connection failed."),"ERR_ICE_CONNECTION_FAILURE")),t==="closed"&&this.destroy(ve(new Error("Ice connection closed."),"ERR_ICE_CONNECTION_CLOSED"))}getStats(t){const i=n=>(Object.prototype.toString.call(n.values)==="[object Array]"&&n.values.forEach(a=>{Object.assign(n,a)}),n);this._pc.getStats.length===0||this._isReactNativeWebrtc?this._pc.getStats().then(n=>{const a=[];n.forEach(r=>{a.push(i(r))}),t(null,a)},n=>t(n)):this._pc.getStats.length>0?this._pc.getStats(n=>{if(this.destroyed)return;const a=[];n.result().forEach(r=>{const o={};r.names().forEach(s=>{o[s]=r.stat(s)}),o.id=r.id,o.type=r.type,o.timestamp=r.timestamp,a.push(i(o))}),t(null,a)},n=>t(n)):t(null,[])}_maybeReady(){if(this._debug("maybeReady pc %s channel %s",this._pcReady,this._channelReady),this._connected||this._connecting||!this._pcReady||!this._channelReady)return;this._connecting=!0;const t=()=>{this.destroyed||this.getStats((i,n)=>{if(this.destroyed)return;i&&(n=[]);const a={},r={},o={};let s=!1;n.forEach(d=>{(d.type==="remotecandidate"||d.type==="remote-candidate")&&(a[d.id]=d),(d.type==="localcandidate"||d.type==="local-candidate")&&(r[d.id]=d),(d.type==="candidatepair"||d.type==="candidate-pair")&&(o[d.id]=d)});const l=d=>{s=!0;let p=r[d.localCandidateId];p&&(p.ip||p.address)?(this.localAddress=p.ip||p.address,this.localPort=Number(p.port)):p&&p.ipAddress?(this.localAddress=p.ipAddress,this.localPort=Number(p.portNumber)):typeof d.googLocalAddress=="string"&&(p=d.googLocalAddress.split(":"),this.localAddress=p[0],this.localPort=Number(p[1])),this.localAddress&&(this.localFamily=this.localAddress.includes(":")?"IPv6":"IPv4");let h=a[d.remoteCandidateId];h&&(h.ip||h.address)?(this.remoteAddress=h.ip||h.address,this.remotePort=Number(h.port)):h&&h.ipAddress?(this.remoteAddress=h.ipAddress,this.remotePort=Number(h.portNumber)):typeof d.googRemoteAddress=="string"&&(h=d.googRemoteAddress.split(":"),this.remoteAddress=h[0],this.remotePort=Number(h[1])),this.remoteAddress&&(this.remoteFamily=this.remoteAddress.includes(":")?"IPv6":"IPv4"),this._debug("connect local: %s:%s remote: %s:%s",this.localAddress,this.localPort,this.remoteAddress,this.remotePort)};if(n.forEach(d=>{d.type==="transport"&&d.selectedCandidatePairId&&l(o[d.selectedCandidatePairId]),(d.type==="googCandidatePair"&&d.googActiveConnection==="true"||(d.type==="candidatepair"||d.type==="candidate-pair")&&d.selected)&&l(d)}),!s&&(!Object.keys(o).length||Object.keys(r).length)){setTimeout(t,100);return}else this._connecting=!1,this._connected=!0;if(this._chunk){try{this.send(this._chunk)}catch(p){return this.destroy(ve(p,"ERR_DATA_CHANNEL"))}this._chunk=null,this._debug('sent chunk from "write before connect"');const d=this._cb;this._cb=null,d(null)}typeof this._channel.bufferedAmountLowThreshold!="number"&&(this._interval=setInterval(()=>this._onInterval(),150),this._interval.unref&&this._interval.unref()),this._debug("connect"),this.emit("connect")})};t()}_onInterval(){!this._cb||!this._channel||this._channel.bufferedAmount>ga||this._onChannelBufferedAmountLow()}_onSignalingStateChange(){this.destroyed||(this._pc.signalingState==="stable"&&(this._isNegotiating=!1,this._debug("flushing sender queue",this._sendersAwaitingStable),this._sendersAwaitingStable.forEach(t=>{this._pc.removeTrack(t),this._queuedNegotiation=!0}),this._sendersAwaitingStable=[],this._queuedNegotiation?(this._debug("flushing negotiation queue"),this._queuedNegotiation=!1,this._needsNegotiation()):(this._debug("negotiated"),this.emit("negotiated"))),this._debug("signalingStateChange %s",this._pc.signalingState),this.emit("signalingStateChange",this._pc.signalingState))}_onIceCandidate(t){this.destroyed||(t.candidate&&this.trickle?this.emit("signal",{type:"candidate",candidate:{candidate:t.candidate.candidate,sdpMLineIndex:t.candidate.sdpMLineIndex,sdpMid:t.candidate.sdpMid}}):!t.candidate&&!this._iceComplete&&(this._iceComplete=!0,this.emit("_iceComplete")),t.candidate&&this._startIceCompleteTimeout())}_onChannelMessage(t){if(this.destroyed)return;let i=t.data;i instanceof ArrayBuffer&&(i=kp.from(i)),this.push(i)}_onChannelBufferedAmountLow(){if(this.destroyed||!this._cb)return;this._debug("ending backpressure: bufferedAmount %d",this._channel.bufferedAmount);const t=this._cb;this._cb=null,t(null)}_onChannelOpen(){this._connected||this.destroyed||(this._debug("on channel open"),this._channelReady=!0,this._maybeReady())}_onChannelClose(){this.destroyed||(this._debug("on channel close"),this.destroy())}_onTrack(t){this.destroyed||t.streams.forEach(i=>{this._debug("on track"),this.emit("track",t.track,i),this._remoteTracks.push({track:t.track,stream:i}),!this._remoteStreams.some(n=>n.id===i.id)&&(this._remoteStreams.push(i),ma(()=>{this._debug("on stream"),this.emit("stream",i)}))})}_debug(){const t=[].slice.call(arguments);t[0]="["+this._id+"] "+t[0],bp.apply(null,t)}};Mr.WEBRTC_SUPPORT=!!rc();Mr.config={iceServers:[{urls:["stun:stun.l.google.com:19302","stun:global.stun.twilio.com:3478"]}],sdpSemantics:"unified-plan"};Mr.channelConfig={};var ac=Mr,fs={};(function(e){e.DEFAULT_ANNOUNCE_PEERS=50,e.MAX_ANNOUNCE_PEERS=82,e.binaryToHex=i=>(typeof i!="string"&&(i=String(i)),Buffer.from(i,"binary").toString("hex")),e.hexToBinary=i=>(typeof i!="string"&&(i=String(i)),Buffer.from(i,"hex").toString("binary")),e.parseUrl=i=>{const n=new URL(i.replace(/^udp:/,"http:"));return i.match(/^udp:/)&&Object.defineProperties(n,{href:{value:n.href.replace(/^http/,"udp")},protocol:{value:n.protocol.replace(/^http/,"udp")},origin:{value:n.origin.replace(/^http/,"udp")}}),n},Object.assign(e,pi)})(fs);var sc={exports:{}};(function(e){var t=function(){function i(f,y){return y!=null&&f instanceof y}var n;try{n=Map}catch{n=function(){}}var a;try{a=Set}catch{a=function(){}}var r;try{r=Promise}catch{r=function(){}}function o(f,y,v,w,k){typeof y=="object"&&(v=y.depth,w=y.prototype,k=y.includeNonEnumerable,y=y.circular);var m=[],b=[],E=typeof Buffer<"u";typeof y>"u"&&(y=!0),typeof v>"u"&&(v=1/0);function C(x,T){if(x===null)return null;if(T===0)return x;var R,L;if(typeof x!="object")return x;if(i(x,n))R=new n;else if(i(x,a))R=new a;else if(i(x,r))R=new r(function(z,G){x.then(function(Y){z(C(Y,T-1))},function(Y){G(C(Y,T-1))})});else if(o.__isArray(x))R=[];else if(o.__isRegExp(x))R=new RegExp(x.source,h(x)),x.lastIndex&&(R.lastIndex=x.lastIndex);else if(o.__isDate(x))R=new Date(x.getTime());else{if(E&&Buffer.isBuffer(x))return Buffer.allocUnsafe?R=Buffer.allocUnsafe(x.length):R=new Buffer(x.length),x.copy(R),R;i(x,Error)?R=Object.create(x):typeof w>"u"?(L=Object.getPrototypeOf(x),R=Object.create(L)):(R=Object.create(w),L=w)}if(y){var D=m.indexOf(x);if(D!=-1)return b[D];m.push(x),b.push(R)}i(x,n)&&x.forEach(function(z,G){var Y=C(G,T-1),Z=C(z,T-1);R.set(Y,Z)}),i(x,a)&&x.forEach(function(z){var G=C(z,T-1);R.add(G)});for(var N in x){var U;L&&(U=Object.getOwnPropertyDescriptor(L,N)),!(U&&U.set==null)&&(R[N]=C(x[N],T-1))}if(Object.getOwnPropertySymbols)for(var j=Object.getOwnPropertySymbols(x),N=0;N<j.length;N++){var O=j[N],B=Object.getOwnPropertyDescriptor(x,O);B&&!B.enumerable&&!k||(R[O]=C(x[O],T-1),B.enumerable||Object.defineProperty(R,O,{enumerable:!1}))}if(k)for(var W=Object.getOwnPropertyNames(x),N=0;N<W.length;N++){var ne=W[N],B=Object.getOwnPropertyDescriptor(x,ne);B&&B.enumerable||(R[ne]=C(x[ne],T-1),Object.defineProperty(R,ne,{enumerable:!1}))}return R}return C(f,v)}o.clonePrototype=function(y){if(y===null)return null;var v=function(){};return v.prototype=y,new v};function s(f){return Object.prototype.toString.call(f)}o.__objToStr=s;function l(f){return typeof f=="object"&&s(f)==="[object Date]"}o.__isDate=l;function d(f){return typeof f=="object"&&s(f)==="[object Array]"}o.__isArray=d;function p(f){return typeof f=="object"&&s(f)==="[object RegExp]"}o.__isRegExp=p;function h(f){var y="";return f.global&&(y+="g"),f.ignoreCase&&(y+="i"),f.multiline&&(y+="m"),y}return o.__getRegExpFlags=h,o}();e.exports&&(e.exports=t)})(sc);var xp=sc.exports;const Ep=Tr("simple-websocket"),Tp=ps,Ap=nc,Lo=Lr,nn=pi,Qi=typeof nn!="function"?WebSocket:nn,Io=64*1024;let oc=class extends Ap.Duplex{constructor(t={}){if(typeof t=="string"&&(t={url:t}),t=Object.assign({allowHalfOpen:!1},t),super(t),t.url==null&&t.socket==null)throw new Error("Missing required `url` or `socket` option");if(t.url!=null&&t.socket!=null)throw new Error("Must specify either `url` or `socket` option, not both");if(this._id=Tp(4).toString("hex").slice(0,7),this._debug("new websocket: %o",t),this.connected=!1,this.destroyed=!1,this._chunk=null,this._cb=null,this._interval=null,t.socket)this.url=t.socket.url,this._ws=t.socket,this.connected=t.socket.readyState===Qi.OPEN;else{this.url=t.url;try{typeof nn=="function"?this._ws=new Qi(t.url,null,{...t,encoding:void 0}):this._ws=new Qi(t.url)}catch(i){Lo(()=>this.destroy(i));return}}this._ws.binaryType="arraybuffer",t.socket&&this.connected?Lo(()=>this._handleOpen()):this._ws.onopen=()=>this._handleOpen(),this._ws.onmessage=i=>this._handleMessage(i),this._ws.onclose=()=>this._handleClose(),this._ws.onerror=i=>this._handleError(i),this._handleFinishBound=()=>this._handleFinish(),this.once("finish",this._handleFinishBound)}send(t){this._ws.send(t)}destroy(t){this._destroy(t,()=>{})}_destroy(t,i){if(!this.destroyed){if(this._debug("destroy (error: %s)",t&&(t.message||t)),this.readable=this.writable=!1,this._readableState.ended||this.push(null),this._writableState.finished||this.end(),this.connected=!1,this.destroyed=!0,clearInterval(this._interval),this._interval=null,this._chunk=null,this._cb=null,this._handleFinishBound&&this.removeListener("finish",this._handleFinishBound),this._handleFinishBound=null,this._ws){const n=this._ws,a=()=>{n.onclose=null};if(n.readyState===Qi.CLOSED)a();else try{n.onclose=a,n.close()}catch{a()}n.onopen=null,n.onmessage=null,n.onerror=()=>{}}this._ws=null,t&&this.emit("error",t),this.emit("close"),i()}}_read(){}_write(t,i,n){if(this.destroyed)return n(new Error("cannot write after socket is destroyed"));if(this.connected){try{this.send(t)}catch(a){return this.destroy(a)}typeof nn!="function"&&this._ws.bufferedAmount>Io?(this._debug("start backpressure: bufferedAmount %d",this._ws.bufferedAmount),this._cb=n):n(null)}else this._debug("write before connect"),this._chunk=t,this._cb=n}_handleOpen(){if(!(this.connected||this.destroyed)){if(this.connected=!0,this._chunk){try{this.send(this._chunk)}catch(i){return this.destroy(i)}this._chunk=null,this._debug('sent chunk from "write before connect"');const t=this._cb;this._cb=null,t(null)}typeof nn!="function"&&(this._interval=setInterval(()=>this._onInterval(),150),this._interval.unref&&this._interval.unref()),this._debug("connect"),this.emit("connect")}}_handleMessage(t){if(this.destroyed)return;let i=t.data;i instanceof ArrayBuffer&&(i=Buffer.from(i)),this.push(i)}_handleClose(){this.destroyed||(this._debug("on close"),this.destroy())}_handleError(t){this.destroy(new Error(`Error connecting to ${this.url}`))}_handleFinish(){if(this.destroyed)return;const t=()=>{setTimeout(()=>this.destroy(),1e3)};this.connected?t():this.once("connect",t)}_onInterval(){if(!this._cb||!this._ws||this._ws.bufferedAmount>Io)return;this._debug("ending backpressure: bufferedAmount %d",this._ws.bufferedAmount);const t=this._cb;this._cb=null,t(null)}_debug(){const t=[].slice.call(arguments);t[0]="["+this._id+"] "+t[0],Ep.apply(null,t)}};oc.WEBSOCKET_SUPPORT=!!Qi;var Cp=oc;const Lp=Cr;let Ip=class extends Lp{constructor(t,i){super(),this.client=t,this.announceUrl=i,this.interval=null,this.destroyed=!1}setInterval(t){t==null&&(t=this.DEFAULT_ANNOUNCE_INTERVAL),clearInterval(this.interval),t&&(this.interval=setInterval(()=>{this.announce(this.client._defaultAnnounceOpts())},t),this.interval.unref&&this.interval.unref())}};var Rp=Ip;const $p=xp,yt=Tr("bittorrent-tracker:websocket-tracker"),Mp=ac,Pp=ps,Bp=Cp,Dp=pi,Ht=fs,Op=Rp,It={},Np=10*1e3,zp=60*60*1e3,Hp=5*60*1e3,qp=50*1e3;let ms=class extends Op{constructor(t,i){super(t,i),yt("new websocket tracker %s",i),this.peers={},this.socket=null,this.reconnecting=!1,this.retries=0,this.reconnectTimer=null,this.expectingResponse=!1,this._openSocket()}announce(t){if(this.destroyed||this.reconnecting)return;if(!this.socket.connected){this.socket.once("connect",()=>{this.announce(t)});return}const i=Object.assign({},t,{action:"announce",info_hash:this.client._infoHashBinary,peer_id:this.client._peerIdBinary});if(this._trackerId&&(i.trackerid=this._trackerId),t.event==="stopped"||t.event==="completed")this._send(i);else{const n=Math.min(t.numwant,5);this._generateOffers(n,a=>{i.numwant=n,i.offers=a,this._send(i)})}}scrape(t){if(this.destroyed||this.reconnecting)return;if(!this.socket.connected){this.socket.once("connect",()=>{this.scrape(t)});return}const n={action:"scrape",info_hash:Array.isArray(t.infoHash)&&t.infoHash.length>0?t.infoHash.map(a=>a.toString("binary")):t.infoHash&&t.infoHash.toString("binary")||this.client._infoHashBinary};this._send(n)}destroy(t=Ro){if(this.destroyed)return t(null);this.destroyed=!0,clearInterval(this.interval),clearTimeout(this.reconnectTimer);for(const r in this.peers){const o=this.peers[r];clearTimeout(o.trackerTimeout),o.destroy()}if(this.peers=null,this.socket&&(this.socket.removeListener("connect",this._onSocketConnectBound),this.socket.removeListener("data",this._onSocketDataBound),this.socket.removeListener("close",this._onSocketCloseBound),this.socket.removeListener("error",this._onSocketErrorBound),this.socket=null),this._onSocketConnectBound=null,this._onSocketErrorBound=null,this._onSocketDataBound=null,this._onSocketCloseBound=null,It[this.announceUrl]&&(It[this.announceUrl].consumers-=1),It[this.announceUrl].consumers>0)return t();let i=It[this.announceUrl];delete It[this.announceUrl],i.on("error",Ro),i.once("close",t);let n;if(!this.expectingResponse)return a();n=setTimeout(a,Ht.DESTROY_TIMEOUT),i.once("data",a);function a(){n&&(clearTimeout(n),n=null),i.removeListener("data",a),i.destroy(),i=null}}_openSocket(){if(this.destroyed=!1,this.peers||(this.peers={}),this._onSocketConnectBound=()=>{this._onSocketConnect()},this._onSocketErrorBound=t=>{this._onSocketError(t)},this._onSocketDataBound=t=>{this._onSocketData(t)},this._onSocketCloseBound=()=>{this._onSocketClose()},this.socket=It[this.announceUrl],this.socket)It[this.announceUrl].consumers+=1,this.socket.connected&&this._onSocketConnectBound();else{const t=new URL(this.announceUrl);let i;this.client._proxyOpts&&(i=t.protocol==="wss:"?this.client._proxyOpts.httpsAgent:this.client._proxyOpts.httpAgent,!i&&this.client._proxyOpts.socksProxy&&(i=new Dp.Agent($p(this.client._proxyOpts.socksProxy),t.protocol==="wss:"))),this.socket=It[this.announceUrl]=new Bp({url:this.announceUrl,agent:i}),this.socket.consumers=1,this.socket.once("connect",this._onSocketConnectBound)}this.socket.on("data",this._onSocketDataBound),this.socket.once("close",this._onSocketCloseBound),this.socket.once("error",this._onSocketErrorBound)}_onSocketConnect(){this.destroyed||this.reconnecting&&(this.reconnecting=!1,this.retries=0,this.announce(this.client._defaultAnnounceOpts()))}_onSocketData(t){if(!this.destroyed){this.expectingResponse=!1;try{t=JSON.parse(t)}catch{this.client.emit("warning",new Error("Invalid tracker response"));return}t.action==="announce"?this._onAnnounceResponse(t):t.action==="scrape"?this._onScrapeResponse(t):this._onSocketError(new Error(`invalid action in WS response: ${t.action}`))}}_onAnnounceResponse(t){if(t.info_hash!==this.client._infoHashBinary){yt("ignoring websocket data from %s for %s (looking for %s: reused socket)",this.announceUrl,Ht.binaryToHex(t.info_hash),this.client.infoHash);return}if(t.peer_id&&t.peer_id===this.client._peerIdBinary)return;yt("received %s from %s for %s",JSON.stringify(t),this.announceUrl,this.client.infoHash);const i=t["failure reason"];if(i)return this.client.emit("warning",new Error(i));const n=t["warning message"];n&&this.client.emit("warning",new Error(n));const a=t.interval||t["min interval"];a&&this.setInterval(a*1e3);const r=t["tracker id"];if(r&&(this._trackerId=r),t.complete!=null){const s=Object.assign({},t,{announce:this.announceUrl,infoHash:Ht.binaryToHex(t.info_hash)});this.client.emit("update",s)}let o;if(t.offer&&t.peer_id&&(yt("creating peer (from remote offer)"),o=this._createPeer(),o.id=Ht.binaryToHex(t.peer_id),o.once("signal",s=>{const l={action:"announce",info_hash:this.client._infoHashBinary,peer_id:this.client._peerIdBinary,to_peer_id:t.peer_id,answer:s,offer_id:t.offer_id};this._trackerId&&(l.trackerid=this._trackerId),this._send(l)}),this.client.emit("peer",o),o.signal(t.offer)),t.answer&&t.peer_id){const s=Ht.binaryToHex(t.offer_id);o=this.peers[s],o?(o.id=Ht.binaryToHex(t.peer_id),this.client.emit("peer",o),o.signal(t.answer),clearTimeout(o.trackerTimeout),o.trackerTimeout=null,delete this.peers[s]):yt(`got unexpected answer: ${JSON.stringify(t.answer)}`)}}_onScrapeResponse(t){t=t.files||{};const i=Object.keys(t);if(i.length===0){this.client.emit("warning",new Error("invalid scrape response"));return}i.forEach(n=>{const a=Object.assign(t[n],{announce:this.announceUrl,infoHash:Ht.binaryToHex(n)});this.client.emit("scrape",a)})}_onSocketClose(){this.destroyed||(this.destroy(),this._startReconnectTimer())}_onSocketError(t){this.destroyed||(this.destroy(),this.client.emit("warning",t),this._startReconnectTimer())}_startReconnectTimer(){const t=Math.floor(Math.random()*Hp)+Math.min(Math.pow(2,this.retries)*Np,zp);this.reconnecting=!0,clearTimeout(this.reconnectTimer),this.reconnectTimer=setTimeout(()=>{this.retries++,this._openSocket()},t),this.reconnectTimer.unref&&this.reconnectTimer.unref(),yt("reconnecting socket in %s ms",t)}_send(t){if(this.destroyed)return;this.expectingResponse=!0;const i=JSON.stringify(t);yt("send %s",i),this.socket.send(i)}_generateOffers(t,i){const n=this,a=[];yt("generating %s offers",t);for(let s=0;s<t;++s)r();o();function r(){const s=Pp(20).toString("hex");yt("creating peer (from _generateOffers)");const l=n.peers[s]=n._createPeer({initiator:!0});l.once("signal",d=>{a.push({offer:d,offer_id:Ht.hexToBinary(s)}),o()}),l.trackerTimeout=setTimeout(()=>{yt("tracker timeout: destroying peer"),l.trackerTimeout=null,delete n.peers[s],l.destroy()},qp),l.trackerTimeout.unref&&l.trackerTimeout.unref()}function o(){a.length===t&&(yt("generated %s offers",t),i(a))}}_createPeer(t){const i=this;t=Object.assign({trickle:!1,config:i.client._rtcConfig,wrtc:i.client._wrtc},t);const n=new Mp(t);return n.once("error",a),n.once("connect",r),n;function a(o){i.client.emit("warning",new Error(`Connection error: ${o.message}`)),n.destroy()}function r(){n.removeListener("error",a),n.removeListener("connect",r)}}};ms.prototype.DEFAULT_ANNOUNCE_INTERVAL=30*1e3;ms._socketPool=It;function Ro(){}var Fp=ms;const qt=Tr("bittorrent-tracker:client"),Up=Cr,jp=vu,Kp=bu,Wp=ac,Yp=Lr,$o=fs,Mo=pi,Po=pi,Vp=Fp;class qa extends Up{constructor(t={}){if(super(),!t.peerId)throw new Error("Option `peerId` is required");if(!t.infoHash)throw new Error("Option `infoHash` is required");if(!t.announce)throw new Error("Option `announce` is required");if(!process.browser&&!t.port)throw new Error("Option `port` is required");this.peerId=typeof t.peerId=="string"?t.peerId:t.peerId.toString("hex"),this._peerIdBuffer=Buffer.from(this.peerId,"hex"),this._peerIdBinary=this._peerIdBuffer.toString("binary"),this.infoHash=typeof t.infoHash=="string"?t.infoHash.toLowerCase():t.infoHash.toString("hex"),this._infoHashBuffer=Buffer.from(this.infoHash,"hex"),this._infoHashBinary=this._infoHashBuffer.toString("binary"),qt("new client %s",this.infoHash),this.destroyed=!1,this._port=t.port,this._getAnnounceOpts=t.getAnnounceOpts,this._rtcConfig=t.rtcConfig,this._userAgent=t.userAgent,this._proxyOpts=t.proxyOpts,this._wrtc=typeof t.wrtc=="function"?t.wrtc():t.wrtc;let i=typeof t.announce=="string"?[t.announce]:t.announce==null?[]:t.announce;i=i.map(r=>(r=r.toString(),r[r.length-1]==="/"&&(r=r.substring(0,r.length-1)),r)),i=Array.from(new Set(i));const n=this._wrtc!==!1&&(!!this._wrtc||Wp.WEBRTC_SUPPORT),a=r=>{Yp(()=>{this.emit("warning",r)})};this._trackers=i.map(r=>{let o;try{o=$o.parseUrl(r)}catch{return a(new Error(`Invalid tracker URL: ${r}`)),null}const s=o.port;if(s<0||s>65535)return a(new Error(`Invalid tracker port: ${r}`)),null;const l=o.protocol;return(l==="http:"||l==="https:")&&typeof Mo=="function"?new Mo(this,r):l==="udp:"&&typeof Po=="function"?new Po(this,r):(l==="ws:"||l==="wss:")&&n?l==="ws:"&&typeof window<"u"&&window.location.protocol==="https:"?(a(new Error(`Unsupported tracker protocol: ${r}`)),null):new Vp(this,r):(a(new Error(`Unsupported tracker protocol: ${r}`)),null)}).filter(Boolean)}start(t){t=this._defaultAnnounceOpts(t),t.event="started",qt("send `start` %o",t),this._announce(t),this._trackers.forEach(i=>{i.setInterval()})}stop(t){t=this._defaultAnnounceOpts(t),t.event="stopped",qt("send `stop` %o",t),this._announce(t)}complete(t){t||(t={}),t=this._defaultAnnounceOpts(t),t.event="completed",qt("send `complete` %o",t),this._announce(t)}update(t){t=this._defaultAnnounceOpts(t),t.event&&delete t.event,qt("send `update` %o",t),this._announce(t)}_announce(t){this._trackers.forEach(i=>{i.announce(t)})}scrape(t){qt("send `scrape`"),t||(t={}),this._trackers.forEach(i=>{i.scrape(t)})}setInterval(t){qt("setInterval %d",t),this._trackers.forEach(i=>{i.setInterval(t)})}destroy(t){if(this.destroyed)return;this.destroyed=!0,qt("destroy");const i=this._trackers.map(n=>a=>{n.destroy(a)});Kp(i,t),this._trackers=[],this._getAnnounceOpts=null}_defaultAnnounceOpts(t={}){return t.numwant==null&&(t.numwant=$o.DEFAULT_ANNOUNCE_PEERS),t.uploaded==null&&(t.uploaded=0),t.downloaded==null&&(t.downloaded=0),this._getAnnounceOpts&&(t=Object.assign({},t,this._getAnnounceOpts())),t}}qa.scrape=(e,t)=>{if(t=jp(t),!e.infoHash)throw new Error("Option `infoHash` is required");if(!e.announce)throw new Error("Option `announce` is required");const i=Object.assign({},e,{infoHash:Array.isArray(e.infoHash)?e.infoHash[0]:e.infoHash,peerId:Buffer.from("01234567890123456789"),port:6881}),n=new qa(i);n.once("error",t),n.once("warning",t);let a=Array.isArray(e.infoHash)?e.infoHash.length:1;const r={};return n.on("scrape",o=>{if(a-=1,r[o.infoHash]=o,a===0){n.destroy();const s=Object.keys(r);s.length===1?t(null,r[s[0]]):t(null,r)}}),e.infoHash=Array.isArray(e.infoHash)?e.infoHash.map(o=>Buffer.from(o,"hex")):Buffer.from(e.infoHash,"hex"),n.scrape({infoHash:e.infoHash}),n};var Gp=qa;const Jp=Ml(Gp);var lc={exports:{}},Ne=lc.exports={},Et,Tt;function Fa(){throw new Error("setTimeout has not been defined")}function Ua(){throw new Error("clearTimeout has not been defined")}(function(){try{typeof setTimeout=="function"?Et=setTimeout:Et=Fa}catch{Et=Fa}try{typeof clearTimeout=="function"?Tt=clearTimeout:Tt=Ua}catch{Tt=Ua}})();function cc(e){if(Et===setTimeout)return setTimeout(e,0);if((Et===Fa||!Et)&&setTimeout)return Et=setTimeout,setTimeout(e,0);try{return Et(e,0)}catch{try{return Et.call(null,e,0)}catch{return Et.call(this,e,0)}}}function Xp(e){if(Tt===clearTimeout)return clearTimeout(e);if((Tt===Ua||!Tt)&&clearTimeout)return Tt=clearTimeout,clearTimeout(e);try{return Tt(e)}catch{try{return Tt.call(null,e)}catch{return Tt.call(this,e)}}}var Mt=[],Ti=!1,oi,Kn=-1;function Zp(){!Ti||!oi||(Ti=!1,oi.length?Mt=oi.concat(Mt):Kn=-1,Mt.length&&dc())}function dc(){if(!Ti){var e=cc(Zp);Ti=!0;for(var t=Mt.length;t;){for(oi=Mt,Mt=[];++Kn<t;)oi&&oi[Kn].run();Kn=-1,t=Mt.length}oi=null,Ti=!1,Xp(e)}}Ne.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var i=1;i<arguments.length;i++)t[i-1]=arguments[i];Mt.push(new uc(e,t)),Mt.length===1&&!Ti&&cc(dc)};function uc(e,t){this.fun=e,this.array=t}uc.prototype.run=function(){this.fun.apply(null,this.array)};Ne.title="browser";Ne.browser=!0;Ne.env={};Ne.argv=[];Ne.version="";Ne.versions={};function Nt(){}Ne.on=Nt;Ne.addListener=Nt;Ne.once=Nt;Ne.off=Nt;Ne.removeListener=Nt;Ne.removeAllListeners=Nt;Ne.emit=Nt;Ne.prependListener=Nt;Ne.prependOnceListener=Nt;Ne.listeners=function(e){return[]};Ne.binding=function(e){throw new Error("process.binding is not supported")};Ne.cwd=function(){return"/"};Ne.chdir=function(e){throw new Error("process.chdir is not supported")};Ne.umask=function(){return 0};var Qp=lc.exports;const eh=Ml(Qp);globalThis.Buffer||(globalThis.Buffer=ui.Buffer);globalThis.process||(globalThis.process=eh);const th=["wss://tracker.openwebtorrent.com","wss://tracker.btorrent.xyz","wss://tracker.webtorrent.dev","wss://tracker.files.fm:7073/announce","wss://spacetrackr.link:443/announce","wss://tracker.fastcast.nz:443/announce"],ih=160,pc="cinepulse.decision-room.owner.",nh="cinepulse.decision-room.autoplay";function bi(e=12){const t=new Uint8Array(e);return crypto.getRandomValues(t),Array.from(t,i=>i.toString(16).padStart(2,"0")).join("")}function Ke(e=""){const t=String(e).replace(/\D/g,"");return t.length===6?t:""}function xn(e,t="",i=null){if(!e?.id)return;const n=e.type==="tv"?"tv":"movie";try{sessionStorage.setItem(nh,JSON.stringify({id:String(e.id),type:n,roomCode:Ke(t),season:n==="tv"?Math.max(1,Number(e.season)||1):null,episode:n==="tv"?Math.max(1,Number(e.episode)||1):null,initialSync:i||null,createdAt:Date.now()}))}catch{}window.dispatchEvent(new CustomEvent("cinepulse:decision-room-open"));const a=`#detail?type=${n}&id=${e.id}`;window.location.hash===a?window.dispatchEvent(new Event("hashchange")):window.location.hash=a}async function rh(e){const t=new TextEncoder().encode(`cinepulse-decision-room-v1:${e}`),i=await crypto.subtle.digest("SHA-256",t);return Array.from(new Uint8Array(i).slice(0,20),n=>n.toString(16).padStart(2,"0")).join("")}function ah(){const e=new Uint32Array(1);return crypto.getRandomValues(e),String(1e5+e[0]%9e5)}function sh(e){const t=Ke(e);if(t)try{sessionStorage.setItem(`${pc}${t}`,"1")}catch{}}function oh(e){const t=Ke(e);if(!t)return!1;try{return sessionStorage.getItem(`${pc}${t}`)==="1"}catch{return!1}}function lh(){try{return Ke(new URL(window.location.href).searchParams.get("oda")||"")}catch{return""}}function hc(e){const t=new URL(window.location.href);return t.searchParams.set("oda",Ke(e)),t.toString()}function ch(){try{const e=new URL(window.location.href);e.searchParams.delete("oda"),history.replaceState(history.state,"",e.toString())}catch{}}function ja(){const e=["Sinemasever","Gece Kuşu","Patlamış Mısır","Film Avcısı","Koltuğunda"],t=bi(2).toUpperCase();return`${e[Math.floor(Math.random()*e.length)]} ${t}`}class dh{constructor({roomCode:t,nickname:i=ja(),isHost:n=!1}){this.roomCode=Ke(t),this.nickname=String(i||ja()).slice(0,30),this.isHost=!!n,this.selfId=bi(10),this.client=null,this.peers=new Map,this.peerParticipantIds=new WeakMap,this.trackerPeerCount=1,this.announceTimer=null,this.participants=new Map([[this.selfId,{id:this.selfId,nickname:this.nickname,role:this.isHost?"moderator":"participant"}]]),this.listeners=new Set,this.receivedIds=new Set,this.cards=[],this.votes={},this.ratings={},this.suggestions=[],this.syncMode="smooth",this.silentVoting=!1,this.sharedPlayback=null,this.lastPlayerSync=null,this.roomFinish=null,this.chatMessages=[],this.roomSummary=null,this.playbackStartedAt=0,this.roomActivity={reactions:[],chats:[]},this.onPlayerSync=a=>{const r=a.detail;!this.isHost||!r||Ke(r.roomCode)!==this.roomCode||!this.sharedPlayback||String(r.mediaId)!==String(this.sharedPlayback.id)||r.type!==this.sharedPlayback.type||(this.lastPlayerSync=r,this.broadcast({type:"player-sync",sync:r}))},window.addEventListener("cinepulse:player-sync",this.onPlayerSync),this.onRoomFinish=a=>{const r=a.detail;!this.isHost||!r||Ke(r.roomCode)!==this.roomCode||(this.roomFinish=r,this.broadcast({type:"room-finish",finish:r}))},this.onRoomFinishVote=a=>{const r=a.detail;!r||Ke(r.roomCode)!==this.roomCode||!r.optionId||this.broadcast({type:"room-finish-vote",vote:r})},this.onRoomFinishChoice=a=>{const r=a.detail;!this.isHost||!r||Ke(r.roomCode)!==this.roomCode||(this.broadcast({type:"room-finish-choice",choice:r}),this.applyRoomFinishChoice(r))},this.onRoomReaction=a=>{const r=a.detail;if(!r||Ke(r.roomCode)!==this.roomCode||!r.emoji)return;const o={...r,senderId:this.selfId,sentAt:Date.now()};this.recordRoomReaction(o),this.broadcast({type:"room-reaction",reaction:o})},window.addEventListener("cinepulse:room-finish",this.onRoomFinish),window.addEventListener("cinepulse:room-finish-vote",this.onRoomFinishVote),window.addEventListener("cinepulse:room-finish-choice",this.onRoomFinishChoice),window.addEventListener("cinepulse:room-reaction",this.onRoomReaction),this.onRoomChatSend=a=>{const r=a.detail,o=String(r?.text||"").trim().slice(0,240);if(!r||Ke(r.roomCode)!==this.roomCode||!o)return;const s={id:String(r.id||`chat-${Date.now()}-${Math.random().toString(36).slice(2,8)}`),text:o,nickname:this.nickname,senderId:this.selfId,sentAt:Number(r.sentAt)||Date.now(),at:Math.max(0,Number(r.at)||0)};this.chatMessages=[...this.chatMessages,s].slice(-60),this.recordRoomChat(s),this.broadcast({type:"room-chat",chat:s})},window.addEventListener("cinepulse:room-chat-send",this.onRoomChatSend),this.onRoomPlaybackHealth=a=>{const r=a.detail;!r||Ke(r.roomCode)!==this.roomCode||r.senderId===this.selfId||this.broadcast({type:"playback-health",health:{senderId:this.selfId,status:r.status==="buffering"?"buffering":"ready",bufferedAhead:Math.max(0,Number(r.bufferedAhead)||0),reportedAt:Date.now()}})},window.addEventListener("cinepulse:room-playback-health",this.onRoomPlaybackHealth),this.onRoomPlaybackProgress=a=>{const r=a.detail;!r||Ke(r.roomCode)!==this.roomCode||this.broadcast({type:"playback-progress",progress:{senderId:this.selfId,nickname:this.nickname,time:Math.max(0,Number(r.time)||0),playing:!!r.playing,buffering:!!r.buffering,reportedAt:Date.now()}})},window.addEventListener("cinepulse:room-playback-progress",this.onRoomPlaybackProgress),this.onRoomPlaybackCheckpoint=a=>{const r=a.detail;!this.isHost||!r||Ke(r.roomCode)!==this.roomCode||!r.targetId||this.broadcast({type:"playback-checkpoint",checkpoint:{targetId:r.targetId,action:r.action==="resume"?"resume":"hold",mediaId:String(r.mediaId||""),type:r.type==="tv"?"tv":"movie"}})},window.addEventListener("cinepulse:room-playback-checkpoint",this.onRoomPlaybackCheckpoint),this.onRoomPlaybackFinished=a=>{const r=a.detail;!r||Ke(r.roomCode)!==this.roomCode||this.broadcast({type:"playback-finished",finished:{mediaId:String(r.mediaId||""),type:r.type==="tv"?"tv":"movie",season:Math.max(1,Number(r.season)||1),episode:Math.max(1,Number(r.episode)||1),nickname:this.nickname}})},window.addEventListener("cinepulse:room-playback-finished",this.onRoomPlaybackFinished),this.onRoomSummary=a=>{const r=a.detail;if(!this.isHost||!r||Ke(r.roomCode)!==this.roomCode)return;const o=new Map;this.roomActivity.reactions.forEach(p=>o.set(p.emoji,(o.get(p.emoji)||0)+1));const s=Array.from(o.entries()).sort((p,h)=>h[1]-p[1])[0]||null,l=new Map;this.roomActivity.chats.forEach(p=>{const h=Math.floor(Math.max(0,Number(p.at)||0)/60)*60;l.set(h,(l.get(h)||0)+1)});const d=Array.from(l.entries()).sort((p,h)=>h[1]-p[1])[0]||null;this.roomSummary={roomCode:this.roomCode,mediaId:String(r.mediaId||this.sharedPlayback?.id||""),type:r.type==="tv"?"tv":"movie",participants:this.participants.size,watchedSeconds:Math.max(0,Number(r.seconds)||0),topReaction:s?{emoji:s[0],count:s[1]}:null,topTalkSecond:d?d[0]:null,chatCount:this.roomActivity.chats.length},this.broadcast({type:"room-summary",summary:this.roomSummary}),window.dispatchEvent(new CustomEvent("cinepulse:room-summary-remote",{detail:this.roomSummary}))},this.onRoomRhythm=a=>{const r=a.detail;!this.isHost||!r||Ke(r.roomCode)!==this.roomCode||!r.targetId||this.broadcast({type:"room-rhythm",rhythm:r})},window.addEventListener("cinepulse:room-summary",this.onRoomSummary),window.addEventListener("cinepulse:room-rhythm",this.onRoomRhythm),this.destroyed=!1}applyRoomFinishChoice(t){if(this.roomFinish=null,t.action==="open"&&t.card?.id){this.sharedPlayback={id:t.card.id,type:t.card.type==="tv"?"tv":"movie",season:Math.max(1,Number(t.card.season)||1),episode:Math.max(1,Number(t.card.episode)||1)},this.lastPlayerSync=null,this.playbackStartedAt=Date.now(),this.roomSummary=null,this.roomActivity={reactions:[],chats:[]},this.emit(),xn(t.card,this.roomCode);return}t.action==="close"&&(this.sharedPlayback=null,this.lastPlayerSync=null,window.dispatchEvent(new CustomEvent("cinepulse:decision-room-close-player",{detail:{roomCode:this.roomCode}}))),this.emit()}snapshot(){return{roomCode:this.roomCode,nickname:this.nickname,selfId:this.selfId,isHost:this.isHost,peerCount:this.peers.size,trackerPeerCount:this.trackerPeerCount,participants:Array.from(this.participants.values()),cards:this.cards,votes:this.votes,ratings:this.ratings,suggestions:this.suggestions,syncMode:this.syncMode,silentVoting:this.silentVoting,chatMessages:this.chatMessages,roomSummary:this.roomSummary}}subscribe(t){return this.listeners.add(t),t(this.snapshot()),()=>this.listeners.delete(t)}emit(){const t=this.snapshot();if(this.listeners.forEach(i=>i(t)),this.sharedPlayback){const i={roomCode:this.roomCode,isHost:this.isHost,selfId:this.selfId,participants:t.participants,peerCount:t.peerCount,chatMessages:t.chatMessages,syncMode:t.syncMode,silentVoting:t.silentVoting,roomSummary:t.roomSummary};window.__cinepulseDecisionRoomPresence=i,window.dispatchEvent(new CustomEvent("cinepulse:decision-room-presence",{detail:i}))}}async connect(){if(!this.roomCode)throw new Error("Geçersiz oda kodu.");const t=await rh(this.roomCode);this.destroyed||(this.client=new Jp({infoHash:t,peerId:bi(20),announce:th,port:0,rtcConfig:{iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:global.stun.twilio.com:3478"}]}}),this.client.on("peer",i=>this.attachPeer(i)),this.client.on("update",i=>{const n=Number(i?.complete||0)+Number(i?.incomplete||0);this.trackerPeerCount=Math.max(1,n||1),this.emit()}),this.client.on("warning",()=>this.emit()),this.client.on("error",()=>this.emit()),this.client.start({numwant:5,left:1}),this.announceTimer=window.setInterval(()=>{try{this.client?.update({numwant:5,left:1})}catch{}},15e3),this.emit())}attachPeer(t){let i=t.id||bi(8);const n=()=>{this.destroyed||(i=t.id||i,this.peers.set(i,t),this.sendTo(t,{type:"hello",participant:{id:this.selfId,nickname:this.nickname,role:this.isHost?"moderator":"participant"},wantsState:!0}),this.emit())},a=s=>this.receive(s,t),r=()=>{this.peers.delete(i);const s=this.peerParticipantIds.get(t);s&&(Array.from(this.peers.values()).some(d=>this.peerParticipantIds.get(d)===s)||this.participants.delete(s)),this.emit()},o=()=>r();t.once("connect",n),t.on("data",a),t.once("close",r),t.once("error",o)}sendTo(t,i){try{if(!t||t.destroyed||!t.connected)return;t.send(JSON.stringify({...i,id:bi(10),senderId:this.selfId}))}catch{}}broadcast(t){const i={...t,id:bi(10),senderId:this.selfId};this.remember(i.id),this.peers.forEach(n=>{try{!n.destroyed&&n.connected&&n.send(JSON.stringify(i))}catch{}})}remember(t){this.receivedIds.add(t),this.receivedIds.size>ih&&this.receivedIds.delete(this.receivedIds.values().next().value)}receive(t,i){let n;try{n=JSON.parse(typeof t=="string"?t:new TextDecoder().decode(t))}catch{return}if(!(!n?.id||this.receivedIds.has(n.id)||n.senderId===this.selfId)){if(this.remember(n.id),n.type==="hello"&&n.participant?.id&&(this.participants.set(n.participant.id,n.participant),this.peerParticipantIds.set(i,n.participant.id),n.wantsState&&(this.sendTo(i,{type:"hello",participant:{id:this.selfId,nickname:this.nickname,role:this.isHost?"moderator":"participant"}}),this.isHost&&this.sendTo(i,{type:"state",cards:this.cards,votes:this.votes,ratings:this.ratings,suggestions:this.suggestions,syncMode:this.syncMode,silentVoting:this.silentVoting,participants:Array.from(this.participants.values()),sharedPlayback:this.sharedPlayback,lastPlayerSync:this.lastPlayerSync,roomFinish:this.roomFinish,chatMessages:this.chatMessages})),this.emit()),n.type==="state"&&Array.isArray(n.cards)&&!this.isHost){if(this.cards=n.cards.slice(0,12),this.votes=n.votes||{},this.ratings=n.ratings||{},this.suggestions=Array.isArray(n.suggestions)?n.suggestions.slice(-20):[],this.syncMode=n.syncMode==="strict"?"strict":"smooth",this.silentVoting=n.silentVoting===!0,Array.isArray(n.participants)&&n.participants.forEach(a=>{a?.id&&a?.nickname&&this.participants.set(a.id,a)}),n.sharedPlayback?.id){const a={id:n.sharedPlayback.id,type:n.sharedPlayback.type==="tv"?"tv":"movie",season:Math.max(1,Number(n.sharedPlayback.season)||1),episode:Math.max(1,Number(n.sharedPlayback.episode)||1)},r=!this.sharedPlayback||String(this.sharedPlayback.id)!==String(a.id)||this.sharedPlayback.type!==a.type||Number(this.sharedPlayback.season)!==Number(a.season)||Number(this.sharedPlayback.episode)!==Number(a.episode);this.sharedPlayback=a,this.lastPlayerSync=n.lastPlayerSync||null,this.roomFinish=n.roomFinish||null,this.chatMessages=Array.isArray(n.chatMessages)?n.chatMessages.slice(-60):[],r?xn(a,this.roomCode,this.lastPlayerSync):this.lastPlayerSync&&window.dispatchEvent(new CustomEvent("cinepulse:player-sync-remote",{detail:this.lastPlayerSync}))}this.emit()}if(n.type==="cards"&&Array.isArray(n.cards)&&!this.isHost&&(this.cards=n.cards.slice(0,12),this.votes=n.votes||{},this.ratings=n.ratings||{},this.emit()),n.type==="suggestions"&&Array.isArray(n.suggestions)&&!this.isHost&&(this.suggestions=n.suggestions.slice(-20),this.emit()),n.type==="sync-mode"&&!this.isHost&&(this.syncMode=n.syncMode==="strict"?"strict":"smooth",this.emit()),n.type==="silent-voting"&&!this.isHost&&(this.silentVoting=n.enabled===!0,this.emit()),n.type==="suggest-card"&&this.isHost&&n.card?.id){const a=`${n.senderId}:${n.card.type}:${n.card.id}`;if(!this.cards.some(o=>String(o.id)===String(n.card.id)&&o.type===n.card.type)&&!this.suggestions.some(o=>o.id===a)){const o=this.participants.get(n.senderId);this.suggestions=[...this.suggestions,{id:a,card:n.card,nickname:o?.nickname||"Katılımcı"}].slice(-20),this.broadcast({type:"suggestions",suggestions:this.suggestions}),this.emit()}}if(n.type==="playback-health"&&this.isHost&&n.health?.senderId&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-health-remote",{detail:{...n.health,roomCode:this.roomCode,syncMode:this.syncMode}})),n.type==="playback-progress"&&this.isHost&&n.progress?.senderId&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-progress-remote",{detail:{...n.progress,roomCode:this.roomCode}})),n.type==="playback-checkpoint"&&n.checkpoint?.targetId&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-checkpoint-remote",{detail:{...n.checkpoint,roomCode:this.roomCode}})),n.type==="playback-finished"&&n.finished?.mediaId&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-finished-remote",{detail:{...n.finished,roomCode:this.roomCode,senderId:n.senderId}})),n.type==="vote"&&n.cardId&&n.senderId&&(this.votes={...this.votes,[n.cardId]:{...this.votes[n.cardId]||{},[n.senderId]:n.vote==="yes"?"yes":"no"}},this.emit()),n.type==="rating"&&n.cardId&&n.senderId){const a=Math.max(1,Math.min(5,Number(n.rating)||0));if(!a)return;this.ratings={...this.ratings,[n.cardId]:{...this.ratings[n.cardId]||{},[n.senderId]:a}},this.emit()}if(n.type==="open"&&n.card?.id&&(this.sharedPlayback={id:n.card.id,type:n.card.type==="tv"?"tv":"movie",season:Math.max(1,Number(n.card.season)||1),episode:Math.max(1,Number(n.card.episode)||1)},this.emit(),xn(n.card,this.roomCode)),n.type==="player-sync"&&n.sync&&!this.isHost){const a=n.sync;if(!this.sharedPlayback||String(a.mediaId)!==String(this.sharedPlayback.id)||a.type!==this.sharedPlayback.type)return;this.lastPlayerSync=a,window.dispatchEvent(new CustomEvent("cinepulse:player-sync-remote",{detail:a}))}if(n.type==="room-finish"&&n.finish&&!this.isHost&&(this.roomFinish=n.finish,window.dispatchEvent(new CustomEvent("cinepulse:room-finish-remote",{detail:n.finish})),this.emit()),n.type==="room-finish-vote"&&n.vote){const a=n.vote;if(this.roomFinish?.id!==a.finishId)return;this.roomFinish={...this.roomFinish,votes:{...this.roomFinish.votes||{},[n.senderId]:a.optionId}},window.dispatchEvent(new CustomEvent("cinepulse:room-finish-vote-remote",{detail:this.roomFinish})),this.emit()}if(n.type==="room-finish-choice"&&n.choice&&!this.isHost&&this.applyRoomFinishChoice(n.choice),n.type==="room-reaction"&&n.reaction&&(this.recordRoomReaction(n.reaction),window.dispatchEvent(new CustomEvent("cinepulse:room-reaction-remote",{detail:n.reaction}))),n.type==="room-chat"&&n.chat?.text){const a={...n.chat,senderId:n.senderId||n.chat.senderId};this.chatMessages=[...this.chatMessages,a].slice(-60),this.recordRoomChat(a),window.dispatchEvent(new CustomEvent("cinepulse:room-chat-remote",{detail:a}))}n.type==="room-summary"&&n.summary&&(this.roomSummary=n.summary,window.dispatchEvent(new CustomEvent("cinepulse:room-summary-remote",{detail:n.summary})),this.emit()),n.type==="room-rhythm"&&n.rhythm?.targetId&&window.dispatchEvent(new CustomEvent("cinepulse:room-rhythm-remote",{detail:{...n.rhythm,roomCode:this.roomCode}}))}}setCards(t){this.isHost&&(this.cards=Array.isArray(t)?t.slice(0,12):[],this.votes={},this.ratings={},this.broadcast({type:"cards",cards:this.cards,votes:this.votes,ratings:this.ratings}),this.emit())}addCard(t){return!this.isHost||!t?.id||this.cards.length>=12||this.cards.some(i=>String(i.id)===String(t.id)&&i.type===t.type)?!1:(this.cards=[...this.cards,t],this.broadcast({type:"cards",cards:this.cards,votes:this.votes,ratings:this.ratings}),this.emit(),!0)}suggest(t){return this.isHost||!t?.id?!1:(this.broadcast({type:"suggest-card",card:t}),!0)}acceptSuggestion(t){if(!this.isHost)return!1;const i=this.suggestions.find(n=>n.id===t);return!i||this.cards.length>=12?!1:(this.suggestions=this.suggestions.filter(n=>n.id!==t),this.cards.some(n=>String(n.id)===String(i.card.id)&&n.type===i.card.type)||(this.cards=[...this.cards,i.card],this.broadcast({type:"cards",cards:this.cards,votes:this.votes,ratings:this.ratings})),this.broadcast({type:"suggestions",suggestions:this.suggestions}),this.emit(),!0)}dismissSuggestion(t){if(!this.isHost)return!1;const i=this.suggestions.filter(n=>n.id!==t);return i.length===this.suggestions.length?!1:(this.suggestions=i,this.broadcast({type:"suggestions",suggestions:this.suggestions}),this.emit(),!0)}setSyncMode(t){this.isHost&&(this.syncMode=t==="strict"?"strict":"smooth",this.broadcast({type:"sync-mode",syncMode:this.syncMode}),this.emit())}setSilentVoting(t){this.isHost&&(this.silentVoting=t===!0,this.broadcast({type:"silent-voting",enabled:this.silentVoting}),this.emit())}removeCard(t){if(!this.isHost||!t)return!1;const i=this.cards.filter(n=>String(n.id)!==String(t));return i.length===this.cards.length?!1:(this.cards=i,delete this.votes[t],delete this.ratings[t],this.broadcast({type:"cards",cards:this.cards,votes:this.votes,ratings:this.ratings}),this.emit(),!0)}vote(t,i){t&&(this.votes={...this.votes,[t]:{...this.votes[t]||{},[this.selfId]:i==="yes"?"yes":"no"}},this.broadcast({type:"vote",cardId:t,vote:i==="yes"?"yes":"no"}),this.emit())}rate(t,i){if(!t)return;const n=Math.max(1,Math.min(5,Number(i)||0));n&&(this.ratings={...this.ratings,[t]:{...this.ratings[t]||{},[this.selfId]:n}},this.broadcast({type:"rating",cardId:t,rating:n}),this.emit())}openForEveryone(t){if(!t?.id)return;this.sharedPlayback={id:t.id,type:t.type==="tv"?"tv":"movie",season:Math.max(1,Number(t.season)||1),episode:Math.max(1,Number(t.episode)||1)},this.playbackStartedAt=Date.now(),this.roomSummary=null,this.roomActivity={reactions:[],chats:[]},this.emit(),this.broadcast({type:"open",card:t});const i=()=>{this.destroyed||!this.sharedPlayback||this.broadcast({type:"state",cards:this.cards,votes:this.votes,ratings:this.ratings,suggestions:this.suggestions,syncMode:this.syncMode,silentVoting:this.silentVoting,participants:Array.from(this.participants.values()),sharedPlayback:this.sharedPlayback,lastPlayerSync:this.lastPlayerSync,roomFinish:this.roomFinish,chatMessages:this.chatMessages})};window.setTimeout(i,350),window.setTimeout(i,1400),xn(t,this.roomCode)}recordRoomReaction(t){t?.emoji&&(this.roomActivity.reactions=[...this.roomActivity.reactions,{emoji:String(t.emoji),at:Math.max(0,Number(t.at)||0),senderId:t.senderId||""}].slice(-240))}recordRoomChat(t){t?.text&&(this.roomActivity.chats=[...this.roomActivity.chats,{at:Math.max(0,Number(t.at)||0),senderId:t.senderId||""}].slice(-120))}destroy(){this.destroyed=!0,window.removeEventListener("cinepulse:player-sync",this.onPlayerSync),window.removeEventListener("cinepulse:room-finish",this.onRoomFinish),window.removeEventListener("cinepulse:room-finish-vote",this.onRoomFinishVote),window.removeEventListener("cinepulse:room-finish-choice",this.onRoomFinishChoice),window.removeEventListener("cinepulse:room-reaction",this.onRoomReaction),window.removeEventListener("cinepulse:room-chat-send",this.onRoomChatSend),window.removeEventListener("cinepulse:room-playback-health",this.onRoomPlaybackHealth),window.removeEventListener("cinepulse:room-playback-progress",this.onRoomPlaybackProgress),window.removeEventListener("cinepulse:room-playback-checkpoint",this.onRoomPlaybackCheckpoint),window.removeEventListener("cinepulse:room-playback-finished",this.onRoomPlaybackFinished),window.removeEventListener("cinepulse:room-summary",this.onRoomSummary),window.removeEventListener("cinepulse:room-rhythm",this.onRoomRhythm),this.announceTimer&&window.clearInterval(this.announceTimer),this.announceTimer=null,this.peers.forEach(t=>{try{t.destroy()}catch{}}),this.peers.clear();try{this.client?.stop()}catch{}try{this.client?.destroy()}catch{}this.listeners.clear()}}let Dt=null,tt=null,Mi=null,Pi=null;function fc(){Ai(!1);const e=document.createElement("div");e.className="decision-room-backdrop",document.body.appendChild(e),Dt=e,e.innerHTML=`
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
    </section>`,e.querySelector("#btn-close-decision-room").onclick=()=>Ai(!1),e.addEventListener("click",i=>{i.target===e&&Ai(!1)}),e.querySelector("#btn-create-decision-room").onclick=()=>ur({roomCode:ah(),isHost:!0});const t=()=>{const i=e.querySelector("#decision-room-code-input"),n=String(i?.value||"").replace(/\D/g,"").slice(0,6);if(n.length!==6){i?.focus(),te("6 haneli oda kodunu yaz.","warning");return}ur({roomCode:n,isHost:!1})};e.querySelector("#btn-join-decision-room").onclick=t,e.querySelector("#decision-room-code-input").onkeydown=i=>{i.key==="Enter"&&t()},V(e)}function ut(e=""){const t=document.createElement("div");return t.textContent=String(e),t.innerHTML}function uh(e,t){const n=Object.values(t.votes[e.id]||{}).filter(r=>r==="yes").length,a=Math.max(1,t.participants.length);return{yes:n,needed:a,matched:n>=a}}function En(e,t){const i=Object.values(t.ratings?.[e.id]||{}).map(Number).filter(r=>r>=1&&r<=5),n=t.ratings?.[e.id]?.[t.selfId]||0;return{average:i.length?i.reduce((r,o)=>r+o,0)/i.length:0,count:i.length,mine:n}}function mc(){return`
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
    </section>`}function gc(e,t,i=""){const n=e.querySelector("#decision-room-status"),a=e.querySelector("#decision-room-peers"),r=e.querySelector("#decision-room-member-count"),o=e.querySelector("#decision-room-moderator-panel"),s=e.querySelector("#decision-room-signal-status"),l=e.querySelector("#decision-room-suggestion-panel"),d=e.querySelector("#decision-room-suggestions"),p=e.querySelector("#decision-room-silent-vote-summary"),h=e.querySelector("#decision-room-sync-mode"),f=e.querySelector("#decision-room-silent-voting"),y=e.querySelector("#decision-room-deck"),v=e.querySelector("#decision-room-link");n&&(n.textContent=i||(t.peerCount?"Arkadaşların bağlandı, oylar anlık geliyor.":"Oda eşleştiriliyor. Arkadaşına bağlantıyı gönder."));const w=Math.max(t.participants.length,t.trackerPeerCount||1);if(r&&(r.textContent=`${w} kişi`),o&&(o.hidden=!t.isHost),l&&(l.hidden=t.isHost),s&&t.isHost&&(s.textContent=w>t.participants.length?`${w} kişi tracker tarafından görüldü; doğrudan bağlantı hazırlanıyor.`:`${w} kişi aktif bağlantıda.`),a&&(a.innerHTML=t.isHost?t.participants.map(k=>`<span class="decision-room-person ${k.role==="moderator"?"is-moderator":""}"><i data-lucide="${k.role==="moderator"?"crown":"circle-user-round"}"></i>${ut(k.nickname)}${k.id===t.selfId?" (Sen)":""}</span>`).join(""):""),v&&(v.value=hc(t.roomCode)),h&&t.isHost){const k=t.syncMode==="strict";h.querySelector('input[value="smooth"]').checked=!k,h.querySelector('input[value="strict"]').checked=k;const m=h.querySelector("#decision-room-sync-help");m&&(m.textContent=k?"Yavaş bağlantı buffer’a düşünce herkes kısa süre bekler; süreler birlikte kalır.":"İlk açılışta en fazla 2 dakika fark için bir kez hizalar. Moderatörün oynat/duraklat ve sarma komutları herkese gider; otomatik durum paketleri buffer’ı bozmaz. Fark 1,5 dakikaya çıkarsa geride veya önde kalan taraf kısa süre bekler, diğeri yaklaşınca devam eder."),h.querySelectorAll('input[name="room-sync-mode"]').forEach(b=>{b.onchange=()=>tt?.setSyncMode(b.value)})}if(f&&t.isHost&&(f.checked=t.silentVoting===!0,f.onchange=()=>tt?.setSilentVoting(f.checked)),d&&t.isHost&&(d.innerHTML=t.suggestions?.length?`<strong>Katılımcı önerileri</strong>${t.suggestions.map(k=>`<div class="decision-room-suggestion"><span><b>${ut(k.card.title||k.card.name||"İsimsiz içerik")}</b><small>${ut(k.nickname)} önerdi</small></span><button data-accept-suggestion="${ut(k.id)}">Ekle</button><button data-dismiss-suggestion="${ut(k.id)}" aria-label="Reddet">×</button></div>`).join("")}`:"",d.querySelectorAll("[data-accept-suggestion]").forEach(k=>{k.onclick=()=>tt?.acceptSuggestion(k.dataset.acceptSuggestion)}),d.querySelectorAll("[data-dismiss-suggestion]").forEach(k=>{k.onclick=()=>tt?.dismissSuggestion(k.dataset.dismissSuggestion)})),p&&t.isHost&&t.silentVoting){const k=t.cards.map(m=>({card:m,rating:En(m,t)})).filter(m=>m.rating.count>0).sort((m,b)=>b.rating.average-m.rating.average||b.rating.count-m.rating.count).slice(0,3);p.innerHTML=k.length?`<strong><i data-lucide="shield-check"></i> Sessiz oylama özeti</strong>${k.map(({card:m,rating:b},E)=>`<div><b>${E+1}</b><span>${ut(m.title||m.name||"İsimsiz içerik")}</span><em>★ ${b.average.toFixed(1)} · ${b.count} gizli oy</em></div>`).join("")}`:'<strong><i data-lucide="shield-check"></i> Sessiz oylama</strong><small>Katılımcıların yıldızları yalnızca burada ortak sonuç olarak görünür.</small>'}else p&&(p.innerHTML="");if(y){if(!t.cards.length)y.innerHTML='<div class="decision-room-empty"><i data-lucide="sparkles"></i><strong>Adaylar hazırlanıyor</strong><span>Oda sahibi ortak izleme listesi oluşturuyor.</span></div>';else{const k=t.isHost&&t.silentVoting?[...t.cards].sort((m,b)=>En(b,t).average-En(m,t).average):t.cards;y.innerHTML=k.map(m=>{const b=m.title||m.name||"İsimsiz içerik",E=m.type==="tv"?`Dizi · S${Math.max(1,Number(m.season)||1)} B${Math.max(1,Number(m.episode)||1)}`:"Film",C=uh(m,t),x=t.votes[m.id]?.[t.selfId],T=En(m,t),R=[1,2,3,4,5].map(L=>`<button data-room-rating="${L}" data-card-id="${m.id}" class="${T.mine>=L?"active-star":""}" aria-label="${L} yıldız"><i data-lucide="star"></i></button>`).join("");return`<article class="decision-room-card ${C.matched?"matched":""}">
          <img src="${st(m.poster_path,Ze.POSTER_SMALL)}" alt="" loading="lazy" />
          <div class="decision-room-card-body">
            <span>${E} · ★ ${(Number(m.vote_average)||0).toFixed(1)}</span>
            <strong>${ut(b)}</strong>
            <small>${C.matched?"Herkes izlemek istiyor!":`${C.yes}/${C.needed} kişi izlemek istiyor`}</small>
            <div class="decision-room-rating"><span>${t.silentVoting?t.isHost?T.count?`Gizli puan ${T.average.toFixed(1)} · ${T.count} oy`:"Gizli oy bekleniyor":T.mine?"Puanın kaydedildi":"Gizli puan ver":T.count?`Ortak puan ${T.average.toFixed(1)} · ${T.count} oy`:"Puan ver"}</span><div>${R}</div></div>
            <div class="decision-room-votes">
              <button data-room-vote="yes" data-card-id="${m.id}" class="${x==="yes"?"active-yes":""}"><i data-lucide="heart"></i> İzle</button>
              <button data-room-vote="no" data-card-id="${m.id}" class="${x==="no"?"active-no":""}"><i data-lucide="skip-forward"></i> Geç</button>
              ${C.matched?`<button data-room-open="${m.id}" class="decision-room-open"><i data-lucide="play"></i> Birlikte Aç</button>`:""}
              ${t.isHost?`<button data-room-remove="${m.id}" class="decision-room-remove" aria-label="${ut(b)} içeriğini odadan kaldır"><i data-lucide="trash-2"></i> Kaldır</button>`:""}
            </div>
          </div>
        </article>`}).join("")}y.querySelectorAll("[data-room-vote]").forEach(k=>{k.onclick=()=>tt?.vote(k.dataset.cardId,k.dataset.roomVote)}),y.querySelectorAll("[data-room-rating]").forEach(k=>{k.onclick=()=>tt?.rate(k.dataset.cardId,k.dataset.roomRating)}),y.querySelectorAll("[data-room-open]").forEach(k=>{k.onclick=()=>{const m=t.cards.find(b=>String(b.id)===k.dataset.roomOpen);m&&tt?.openForEveryone(m)}}),y.querySelectorAll("[data-room-remove]").forEach(k=>{k.onclick=()=>{tt?.removeCard(k.dataset.roomRemove)&&te("İçerik odadan kaldırıldı.","success")}})}V(e)}function dr(e){return{id:e.id,type:e.type||e.media_type||(e.first_air_date?"tv":"movie"),title:e.title,name:e.name,poster_path:e.poster_path,vote_average:e.vote_average,season:e.type==="tv"||e.media_type==="tv"?Math.max(1,Number(e.season)||1):null,episode:e.type==="tv"||e.media_type==="tv"?Math.max(1,Number(e.episode)||1):null}}function yc(e,t){const i=e.querySelector("#decision-room-content-form"),n=e.querySelector("#decision-room-content-search"),a=e.querySelector("#decision-room-content-results");if(!i||!n||!a||!t.isHost)return;let r=null,o=0;const s=async()=>{const l=n.value.trim();if(l.length<2){a.innerHTML="";return}const d=++o;a.innerHTML='<span class="decision-room-search-status">Aranıyor…</span>';const p=await ss(l).catch(()=>[]);if(d!==o||n.value.trim()!==l)return;const h=p.filter(f=>f?.id&&(f.type==="movie"||f.type==="tv")).slice(0,5);a.innerHTML=h.length?h.map(f=>{const y=dr(f),v=y.type==="tv"?'<span class="decision-room-episode-choice" aria-label="Bölüm seçimi"><label>Sezon <input data-add-season type="number" min="1" value="1" inputmode="numeric" /></label><label>Bölüm <input data-add-episode type="number" min="1" value="1" inputmode="numeric" /></label></span>':"";return`<div class="decision-room-search-result"><button type="button" data-add-room-card="${y.id}" data-add-room-type="${y.type}" title="Odaya ekle"><img src="${st(y.poster_path,Ze.POSTER_SMALL)}" alt="" /><span><strong>${ut(y.title||y.name||"İsimsiz içerik")}</strong><small>${y.type==="tv"?"Dizi":"Film"} · ★ ${(Number(y.vote_average)||0).toFixed(1)}</small></span><i data-lucide="plus"></i></button>${v}</div>`}).join(""):'<span class="decision-room-search-status">Sonuç bulunamadı.</span>',a.querySelectorAll("[data-add-room-card]").forEach(f=>{f.onclick=()=>{const y=h.find(m=>String(m.id)===f.dataset.addRoomCard&&(m.type||m.media_type)===f.dataset.addRoomType);if(!y)return;const v=f.closest(".decision-room-search-result"),w=Number(v?.querySelector("[data-add-season]")?.value)||1,k=Number(v?.querySelector("[data-add-episode]")?.value)||1;t.addCard(dr({...y,season:w,episode:k}))?(n.value="",a.innerHTML="",te("İçerik odaya eklendi.","success")):te("Bu içerik zaten listede veya oda dolu.","warning")}}),V(a)};i.onsubmit=l=>{l.preventDefault(),window.clearTimeout(r),s()},n.oninput=()=>{if(window.clearTimeout(r),n.value.trim().length<2){o+=1,a.innerHTML="";return}r=window.setTimeout(s,220)}}function vc(e,t){const i=e.querySelector("#decision-room-suggestion-form"),n=e.querySelector("#decision-room-suggestion-search"),a=e.querySelector("#decision-room-suggestion-results");if(!i||!n||!a||t.isHost)return;let r=null,o=0;const s=async()=>{const l=n.value.trim();if(l.length<2)return;const d=++o;a.innerHTML='<span class="decision-room-search-status">Aranıyor…</span>';const p=await ss(l).catch(()=>[]);if(d!==o||n.value.trim()!==l)return;const h=p.filter(f=>f?.id&&(f.type==="movie"||f.type==="tv")).slice(0,5);a.innerHTML=h.map(f=>`<div class="decision-room-search-result"><button type="button" data-suggest-card="${f.id}" data-suggest-type="${f.type||f.media_type}"><img src="${st(f.poster_path,Ze.POSTER_SMALL)}" alt="" /><span><strong>${ut(f.title||f.name||"İsimsiz içerik")}</strong><small>${(f.type||f.media_type)==="tv"?"Dizi":"Film"} · Moderatöre öner</small></span><i data-lucide="send"></i></button></div>`).join("")||'<span class="decision-room-search-status">Sonuç bulunamadı.</span>',a.querySelectorAll("[data-suggest-card]").forEach(f=>{f.onclick=()=>{const y=h.find(v=>String(v.id)===f.dataset.suggestCard&&String(v.type||v.media_type)===f.dataset.suggestType);!y||!t.suggest(dr(y))||(n.value="",a.innerHTML="",te("Önerin moderatöre gönderildi.","success"))}}),V(a)};i.onsubmit=l=>{l.preventDefault(),window.clearTimeout(r),s()},n.oninput=()=>{if(window.clearTimeout(r),n.value.trim().length<2){o+=1,a.innerHTML="";return}r=window.setTimeout(s,220)}}async function bc(e,t){const i=t.querySelector("#decision-room-status");i&&(i.textContent="Ortak adaylar hazırlanıyor…");try{const a=(await kl("all","week")||[]).filter(r=>r?.id&&(r.media_type==="movie"||r.media_type==="tv"||r.type==="movie"||r.type==="tv")).slice(0,8).map(dr);if(!a.length)throw new Error("Aday bulunamadı.");e.setCards(a)}catch{i&&(i.textContent="Adaylar şu an yüklenemedi. Biraz sonra yeniden dene.")}}async function ur({roomCode:e=lh(),isHost:t=!1}={}){if(!e){fc();return}Ai(!1);const i=e;t&&sh(i);const n=!!(t||oh(i)),a=ja(),r=document.createElement("div");if(r.id="decision-room-modal-root",r.className="decision-room-backdrop",document.body.appendChild(r),Dt=r,n)try{history.replaceState(history.state,"",hc(i))}catch{}r.innerHTML=`
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
      ${mc()}
      <div id="decision-room-deck" class="decision-room-deck"></div>
      <footer class="decision-room-footer"><span>Oda kapanınca oylar silinir.</span><button id="btn-refresh-decision-cards"><i data-lucide="refresh-cw"></i> Yeni adaylar</button></footer>
    </section>`;const o=()=>Ai(!0);r.querySelector("#btn-close-decision-room").addEventListener("click",o),r.addEventListener("click",d=>{d.target===r&&o()});const s=()=>wc();window.addEventListener("cinepulse:decision-room-open",s,{once:!0}),Pi=()=>window.removeEventListener("cinepulse:decision-room-open",s);const l=new dh({roomCode:i,nickname:a,isHost:n});tt=l,Mi=l.subscribe(d=>gc(r,d)),await l.connect(),!(tt!==l||Dt!==r)&&(yc(r,l),vc(r,l),r.querySelector("#btn-copy-decision-room").onclick=async()=>{try{await navigator.clipboard.writeText(i),te("Oda kodu kopyalandı.","success")}catch{const p=r.querySelector("#decision-room-code"),h=document.createRange();h.selectNodeContents(p),window.getSelection()?.removeAllRanges(),window.getSelection()?.addRange(h),document.execCommand("copy"),window.getSelection()?.removeAllRanges(),te("Oda kodu kopyalandı.","success")}},r.querySelector("#btn-refresh-decision-cards").onclick=()=>bc(tt,r),V(r))}function Ai(e=!0){Pi?.(),Pi=null,Mi?.(),Mi=null,tt?.destroy(),tt=null,Dt?.remove(),Dt=null,e&&ch()}function km(){if(Dt)return;if(!tt){fc();return}const e=tt,t=document.createElement("div");t.id="decision-room-modal-root",t.className="decision-room-backdrop",document.body.appendChild(t),Dt=t,t.innerHTML=`
    <section class="decision-room-dialog" role="dialog" aria-modal="true" aria-label="Ortak Karar Odası">
      <button id="btn-close-decision-room" class="decision-room-close" aria-label="Kapat"><i data-lucide="x"></i></button>
      <header class="decision-room-header"><div class="decision-room-icon"><i data-lucide="users-round"></i></div><div><h2>Birlikte Seç</h2><p>Odan hâlâ açık. Adayları ve katılımcıları buradan gör.</p></div></header>
      <div class="decision-room-code-panel"><span>ODA KODU</span><strong id="decision-room-code">${ut(e.roomCode)}</strong><button id="btn-copy-decision-room"><i data-lucide="copy"></i> Kodu Kopyala</button><small>Arkadaşın “Birlikte Seç” ekranında bu kodu yazsın.</small></div>
      <div class="decision-room-live"><span class="decision-room-live-dot"></span><span id="decision-room-status">Odaya dönüldü.</span><strong id="decision-room-member-count" class="decision-room-member-count">1 kişi</strong></div>
      ${mc()}
      <div id="decision-room-deck" class="decision-room-deck"></div>
      <footer class="decision-room-footer"><span>Oda kapanınca oylar silinir.</span><button id="btn-refresh-decision-cards"><i data-lucide="refresh-cw"></i> Yeni adaylar</button></footer>
    </section>`;const i=()=>Ai(!0);t.querySelector("#btn-close-decision-room").onclick=i,t.addEventListener("click",a=>{a.target===t&&i()});const n=()=>wc();window.addEventListener("cinepulse:decision-room-open",n,{once:!0}),Pi=()=>window.removeEventListener("cinepulse:decision-room-open",n),Mi=e.subscribe(a=>gc(t,a)),yc(t,e),vc(t,e),t.querySelector("#btn-copy-decision-room").onclick=async()=>{try{await navigator.clipboard.writeText(e.roomCode),te("Oda kodu kopyalandı.","success")}catch{te(`Oda kodu: ${e.roomCode}`,"info")}},t.querySelector("#btn-refresh-decision-cards").onclick=()=>bc(e,t),V(t)}function wc(){Pi?.(),Pi=null,Mi?.(),Mi=null,Dt?.remove(),Dt=null}function ph(e="home"){const t=mn(),i=$l(),n=t.isKid;return`
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
  `}let ji=null,Tn=null,Bo=!1;function Do(e){const t=document.getElementById("main-navbar");ji&&window.removeEventListener("scroll",ji),ji=()=>t?.classList.toggle("scrolled",window.scrollY>20),ji(),window.addEventListener("scroll",ji,{passive:!0});const i=document.getElementById("mobile-search-row");document.getElementById("btn-mobile-search-toggle")?.addEventListener("click",()=>{i?.classList.toggle("hidden"),i?.classList.contains("hidden")||(document.getElementById("mobile-search-input")?.focus(),V())}),document.getElementById("btn-mobile-search-close")?.addEventListener("click",()=>{i?.classList.add("hidden")}),document.getElementById("btn-nav-notifications")?.addEventListener("click",ou),document.getElementById("btn-nav-profile")?.addEventListener("click",ru);const n=document.getElementById("nav-hub-li"),a=document.getElementById("btn-desktop-hub"),r=document.getElementById("hub-mega-dropdown");let o;function s(){clearTimeout(o),a?.setAttribute("aria-expanded","true"),r?.classList.add("open")}function l(){clearTimeout(o),a?.setAttribute("aria-expanded","false"),r?.classList.remove("open")}function d(){clearTimeout(o),o=setTimeout(()=>{!n?.matches(":hover")&&!r?.matches(":hover")&&l()},350)}if(n){n.addEventListener("mouseenter",s),n.addEventListener("mouseleave",d),r?.addEventListener("mouseenter",s),r?.addEventListener("mouseleave",d),a?.addEventListener("click",m=>{m.stopPropagation(),s()}),r?.querySelectorAll(".hub-nav-trigger").forEach(m=>{m.addEventListener("click",l)});const w=m=>{m.key==="Escape"&&l()};window.addEventListener("keydown",w);const k=m=>{n.contains(m.target)||l()};document.addEventListener("click",k)}document.getElementById("btn-hub-random-spin")?.addEventListener("click",async()=>{l(),ro()}),document.getElementById("btn-hub-series-recommend")?.addEventListener("click",l),document.getElementById("btn-hub-trakt")?.addEventListener("click",()=>{l(),or()});const p=document.getElementById("mobile-hub-backdrop"),h=document.getElementById("mobile-hub-sheet");let f;function y(){p&&(clearTimeout(f),h?.classList.remove("sheet-closing"),p.classList.remove("hidden"),document.body.style.overflow="hidden")}function v(){p&&(document.body.style.overflow="",h?.classList.add("sheet-closing"),clearTimeout(f),f=setTimeout(()=>{p.classList.add("hidden"),h?.classList.remove("sheet-closing")},280))}document.getElementById("btn-open-mobile-hub")?.addEventListener("click",w=>{w.preventDefault(),y()},{once:!1}),document.getElementById("btn-close-mobile-hub")?.addEventListener("click",v),p?.addEventListener("click",w=>{w.target===p&&v()}),p?.querySelectorAll(".hub-nav-trigger").forEach(w=>{w.addEventListener("click",v)}),document.getElementById("btn-hub-random-spin-mobile")?.addEventListener("click",async()=>{v(),ro()}),document.getElementById("btn-hub-series-recommend-mobile")?.addEventListener("click",v),document.getElementById("btn-hub-trakt-mobile")?.addEventListener("click",()=>{v(),or()}),document.querySelectorAll("[data-open-decision-room]").forEach(w=>{w.addEventListener("click",()=>{l(),v(),ur()})}),Oo("nav-search-input","search-overlay"),Oo("mobile-search-input","mobile-search-overlay"),Bo||(Bo=!0,document.addEventListener("click",w=>{for(const[k,m]of[["nav-search-input","search-overlay"],["mobile-search-input","mobile-search-overlay"]]){const b=document.getElementById(k),E=document.getElementById(m);E&&!b?.contains(w.target)&&!E.contains(w.target)&&E.classList.add("hidden")}})),Tn&&document.removeEventListener("keydown",Tn),Tn=w=>{(w.metaKey||w.ctrlKey)&&w.key.toLowerCase()==="k"&&(w.preventDefault(),window.innerWidth<=992&&i?(i.classList.remove("hidden"),document.getElementById("mobile-search-input")?.focus()):document.getElementById("nav-search-input")?.focus())},window.addEventListener("keydown",Tn)}function Oo(e,t){const i=document.getElementById(e),n=document.getElementById(t);let a=null;!i||!n||(i.addEventListener("input",r=>{const o=r.target.value.trim();if(clearTimeout(a),o.length<2){n.classList.add("hidden"),n.innerHTML="";return}n.innerHTML='<div class="search-no-results" style="display:flex;align-items:center;gap:8px;padding:1rem;color:var(--text-muted);font-size:.85rem;"><span class="tv-loading-spinner" style="width:16px;height:16px;border-width:2px;"></span> Aranıyor...</div>',n.classList.remove("hidden"),a=setTimeout(async()=>{try{let h=function(){n.querySelectorAll(".search-item").forEach(f=>{f.addEventListener("click",()=>{n.classList.add("hidden"),i.value="",document.getElementById("mobile-search-row")?.classList.add("hidden")})})};const s=await ss(o),l=Array.isArray(s)?s.slice(0,8):s?.results?.slice(0,8)||[],d=`
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
          </a>`;if(!l.length){n.innerHTML=`<div class="search-no-results" style="padding-bottom:.5rem;">TMDB Sonucu Bulunamadı</div>${d}`,n.classList.remove("hidden"),V(n),h();return}const p=l.map(f=>{const y=f.media_type==="tv"||!!f.first_air_date||!f.release_date&&!!f.name,v=f.title||f.name||"İsimsiz",w=(f.release_date||f.first_air_date||"").slice(0,4),k=st(f.poster_path,Ze.POSTER_SMALL||Ze.POSTER_MEDIUM);return`
            <a href="#detail?type=${y?"tv":"movie"}&id=${f.id}" class="search-item">
              <img src="${k}" alt="${v}" class="search-item-img" onerror="this.src='https://via.placeholder.com/45x68/1e293b/64748b?text=N/A'" />
              <div class="search-item-info">
                <div class="search-item-title">${v}</div>
                <div class="search-item-meta">
                  <span class="search-badge">${y?"Dizi":"Film"}</span>
                  ${w?`<span>${w}</span>`:""}
                  <span class="search-rating">★ ${(f.vote_average||0).toFixed(1)}</span>
                </div>
              </div>
            </a>`}).join("");n.innerHTML=p+d,n.classList.remove("hidden"),V(n),h()}catch{n.innerHTML='<div class="search-no-results">Arama sırasında bir hata oluştu</div>'}},200)}),i.addEventListener("keydown",r=>{r.key==="Escape"&&(n.classList.add("hidden"),i.blur())}))}let Ki=null;function kc({title:e="Fragman",trailerInfo:t,mediaId:i=null,mediaType:n="movie"}){const a=document.getElementById("trailer-modal");if(!a)return;if(!t||!t.embedUrl){alert("Bu yapım için resmi fragman bulunamadı.");return}const r=t.name||"Resmi Tanıtım",o=i?`#detail?type=${encodeURIComponent(n)}&id=${encodeURIComponent(i)}`:null;a.innerHTML=`
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
  `,a.classList.remove("hidden"),document.body.style.overflow="hidden",V();const s=()=>{a.innerHTML="",a.classList.add("hidden"),document.body.style.overflow="",Ki&&(window.removeEventListener("keydown",Ki),Ki=null)},l=a.querySelector("#btn-close-trailer");l&&l.addEventListener("click",s),a.querySelector(".btn-trailer-detail")?.addEventListener("click",s);const d=a.querySelector(".trailer-modal-overlay");d&&d.addEventListener("click",p=>{p.target===d&&s()}),Ki=p=>{p.key==="Escape"&&s()},window.addEventListener("keydown",Ki)}let rt=0,pr=null,Wn=0;const An=new Map;function hh(){clearInterval(pr),pr=null,Wn++}function gs(e){const t=e?.backdrop_path||e?.poster_path,i=window.innerWidth<=768?Ze.BACKDROP_LARGE:Ze.BACKDROP_XLARGE;return st(t,i)}function ys(e,t="auto"){if(!e)return Promise.resolve(null);if(An.has(e))return An.get(e);const i=new Promise(n=>{const a=new Image;a.decoding="async",a.fetchPriority=t,a.onload=async()=>{try{await a.decode()}catch{}n(e)},a.onerror=()=>{An.delete(e),n(null)},a.src=e});return An.set(e,i),i}function fh(e=[]){const i=Ct()?e.filter(Jt):e;if(!i||i.length===0)return"";rt=0;const n=i.slice(0,10),a=n[0],r=a.id,o=a.first_air_date||a.media_type==="tv"?"tv":"movie",s=a.title||a.name||"Öne Çıkan Yapım",l=a.overview&&a.overview.trim().length>15?a.overview:qe(a,o),d=gs(a),p=a.vote_average?a.vote_average.toFixed(1):"8.8",h=(a.first_air_date||a.release_date||"").substring(0,4),f=ts(r);let y=document.getElementById("hero-backdrop-preload");return y||(y=document.createElement("link"),y.id="hero-backdrop-preload",y.rel="preload",y.as="image",document.head.appendChild(y)),y.href=d,y.fetchPriority="high",window.innerWidth>768&&ys(d,"high"),`
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
            <button class="btn-primary hero-btn-play" id="hero-play-btn" data-id="${r}" data-type="${o}">
              <i data-lucide="play" style="fill: currentColor; width: 17px; height: 17px;"></i>
              <span>Hemen İzle</span>
            </button>

            <button class="btn-secondary hero-btn-trailer" id="hero-trailer-btn" data-id="${r}" data-type="${o}" title="Fragmanı İzle">
              <i data-lucide="clapperboard" style="width: 16px; height: 16px;"></i>
              <span>Fragman</span>
            </button>

            <button class="btn-secondary hero-btn-list-icon" id="hero-list-btn" data-id="${r}" data-type="${o}" title="${f?"Listemden Çıkar":"Listeme Ekle"}">
              <i data-lucide="${f?"check":"plus"}" style="width: 17px; height: 17px; ${f?"color: var(--primary);":""}"></i>
            </button>
          </div>

          <!-- Dot Indicators -->
          <div class="hero-dots-wrapper" id="hero-dots-container">
            ${n.map((v,w)=>`
              <div class="hero-dot ${w===rt?"active":""}" data-index="${w}" role="button" aria-label="Slayt ${w+1}"></div>
            `).join("")}
          </div>
        </div>
      </div>
    </section>
  `}function mh(e=[]){const i=Ct()?e.filter(Jt):e;if(!i||i.length===0)return;const n=i.slice(0,10);rt=0;const a=document.getElementById("hero-play-btn"),r=document.getElementById("hero-list-btn"),o=document.getElementById("hero-trailer-btn"),s=document.getElementById("hero-slider-section"),l=document.getElementById("hero-backdrop-img"),d=document.getElementById("hero-arrow-prev"),p=document.getElementById("hero-arrow-next");(async()=>{if(l&&!l.complete&&await new Promise(T=>{l.addEventListener("load",T,{once:!0}),l.addEventListener("error",T,{once:!0})}),l?.complete&&l.naturalWidth>0)try{await l.decode()}catch{}requestAnimationFrame(()=>{s?.isConnected&&(s.classList.remove("is-loading"),s.setAttribute("aria-busy","false"))})})();const f=()=>n.slice(1,4).forEach(T=>ys(gs(T)));"requestIdleCallback"in window?window.requestIdleCallback(f,{timeout:1500}):setTimeout(f,500),n.slice(0,2).forEach(T=>{const R=T.first_air_date||T.media_type==="tv"?"tv":"movie";dn(R,T.id).catch(()=>null)});function y(){Cn(n[(rt+1)%n.length],(rt+1)%n.length),x()}function v(){Cn(n[(rt-1+n.length)%n.length],(rt-1+n.length)%n.length),x()}d?.addEventListener("click",v),p?.addEventListener("click",y);const w=T=>{if(!s?.isConnected){document.removeEventListener("keydown",w);return}T.key==="ArrowRight"&&y(),T.key==="ArrowLeft"&&v()};document.addEventListener("keydown",w);let k=null,m=!1;const b=50;function E(T){k=T,m=!0}function C(T){if(!m||k===null)return;m=!1;const R=k-T;Math.abs(R)<b||(R>0?y():v(),k=null)}s?.addEventListener("touchstart",T=>E(T.touches[0].clientX),{passive:!0}),s?.addEventListener("touchend",T=>C(T.changedTouches[0].clientX),{passive:!0}),s?.addEventListener("touchcancel",()=>{m=!1,k=null},{passive:!0}),s?.addEventListener("mousedown",T=>{T.button===0&&E(T.clientX)}),s?.addEventListener("mouseup",T=>{T.button===0&&C(T.clientX)}),s?.addEventListener("mouseleave",()=>{m=!1,k=null}),a?.addEventListener("click",()=>{window.location.hash=`#detail?type=${a.getAttribute("data-type")}&id=${a.getAttribute("data-id")}`}),o?.addEventListener("click",async()=>{if(ft().trailersEnabled===!1){te("Fragmanlar yönetici ayarlarından kapatıldı.","info");return}const T=n[rt];if(!T)return;const R=T.first_air_date||T.media_type==="tv"?"tv":"movie",L=o.innerHTML;o.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:17px;height:17px;"></i> <span>Yükleniyor...</span>',V(o);try{const D=await dn(R,T.id,T.title||T.name);D?kc({title:T.title||T.name,trailerInfo:D,mediaId:T.id,mediaType:R}):te("Bu yapım için resmi tanıtım fragmanı bulunamadı.","info")}catch{te("Fragman yüklenirken hata oluştu.","error")}finally{o.innerHTML=L,V(o)}}),r?.addEventListener("click",()=>{const T=n[rt],R=ml(T);te(R?"İzleme listene eklendi!":"İzleme listenden çıkarıldı.",R?"success":"info"),r.title=R?"Listemden Çıkar":"Listeme Ekle",r.innerHTML=`<i data-lucide="${R?"check":"plus"}" style="width: 17px; height: 17px; ${R?"color: var(--primary);":""}"></i>`,V(r)}),document.querySelectorAll(".hero-dot").forEach(T=>{T.addEventListener("click",()=>{const R=parseInt(T.getAttribute("data-index"),10);Cn(n[R],R),x()})});function x(){clearInterval(pr),pr=setInterval(()=>{if(n.length>1){const T=(rt+1)%n.length;Cn(n[T],T)}},6e3)}x()}async function Cn(e,t=rt){if(!e||Ct()&&!Jt(e))return;const i=document.getElementById("hero-backdrop-img"),n=document.getElementById("hero-title-text"),a=document.getElementById("hero-overview-text"),r=document.getElementById("hero-play-btn"),o=document.getElementById("hero-list-btn"),s=document.getElementById("hero-trailer-btn"),l=document.getElementById("hero-rating-badge"),d=document.getElementById("hero-year-badge"),p=document.getElementById("hero-type-badge"),h=e.first_air_date||e.media_type==="tv"?"tv":"movie",f=gs(e),y=e.vote_average?e.vote_average.toFixed(1):"8.5",v=(e.first_air_date||e.release_date||"").substring(0,4),w=++Wn;if(i&&i.src!==f){const b=await ys(f,"high");if(!b||w!==Wn||!i.isConnected)return;i.src=b;try{await i.decode()}catch{}if(w!==Wn||!i.isConnected)return}rt=t;const k=document.querySelector("#hero-slider-section .hero-content");k?.classList.remove("hero-content-committing"),requestAnimationFrame(()=>{k?.isConnected&&k.classList.add("hero-content-committing")}),n&&(n.textContent=e.title||e.name);const m=e.overview&&e.overview.trim().length>15?e.overview:qe(e,h);if(a&&(a.textContent=m),l&&(l.innerHTML=`<i data-lucide="star" style="width:13px;height:13px;fill:currentColor"></i> ${y} IMDb`),d&&(d.textContent=v||"2024"),p&&(p.textContent=h==="tv"?"DİZİ":"FİLM"),r&&(r.setAttribute("data-id",e.id),r.setAttribute("data-type",h)),s&&(s.setAttribute("data-id",e.id),s.setAttribute("data-type",h)),o){o.setAttribute("data-id",e.id),o.setAttribute("data-type",h);const b=ts(e.id);o.title=b?"Listemden Çıkar":"Listeme Ekle",o.innerHTML=`<i data-lucide="${b?"check":"plus"}" style="width:17px;height:17px;${b?"color:var(--primary);":""}"></i>`}V(document.getElementById("hero-slider-section")),document.querySelectorAll(".hero-dot").forEach((b,E)=>{b.classList.toggle("active",E===rt)})}const vs=new Map,hr=new Map;let Ci=null,_c=null;function Sc(){const e=window.location.hash||"#home";e.startsWith("#detail")||(_c=e,window.scrollY>0&&vs.set(e,window.scrollY))}function gh(){Sc(),Ci===null&&(Ci=window.setTimeout(()=>{Ci=null,Pr()},300))}function Pr(){Ci!==null&&(clearTimeout(Ci),Ci=null),(window.location.hash||"#home")===_c&&Sc();for(const[e,t]of vs)if(t>0)try{sessionStorage.setItem(`cinepulse_scroll_${e}`,String(t))}catch{}for(const[e,t]of hr)try{sessionStorage.setItem(`cinepulse_rail_${e}`,String(t))}catch{}}const No=Pr;function yh(e=window.location.hash||"#home"){if(e.startsWith("#detail")){window.scrollTo({top:0,behavior:"instant"});return}document.querySelectorAll(".card-rail").forEach(i=>{if(i.id){let n=hr.get(i.id);if(typeof n!="number")try{const a=sessionStorage.getItem(`cinepulse_rail_${i.id}`);a&&(n=parseFloat(a))}catch{}typeof n=="number"&&n>0&&(i.scrollLeft=n,requestAnimationFrame(()=>{i.scrollLeft=n}))}});let t=vs.get(e);if(typeof t!="number")try{const i=sessionStorage.getItem(`cinepulse_scroll_${e}`);i&&(t=parseFloat(i))}catch{}if(typeof t=="number"&&t>0){const i=(n=0)=>{window.scrollTo({top:t,behavior:"instant"}),n<15&&document.body.scrollHeight<t+window.innerHeight&&setTimeout(()=>i(n+1),60)};requestAnimationFrame(()=>i(0))}else window.scrollTo({top:0,behavior:"instant"})}const vh={},bh="https://cine-pulse-drab.vercel.app";(vh?.VITE_MKV_RELAY_ORIGIN||"").replace(/\/$/,"");function wh(e=""){if(!e||/^https?:\/\//i.test(e))return e;if(typeof window>"u")return`http://127.0.0.1:4000${e}`;const t=window.location?.hostname||"";return!!(window.Capacitor?.isNativePlatform?.()||window.location?.protocol==="capacitor:"||t==="localhost"||t==="127.0.0.1"||t.endsWith("github.io"))?`${bh}${e}`:e}const rn=new Map,fr="cp_fanart_v4_",kh="4e44d9029b1270a757cddc766a1bcb63";function _h(e){if(rn.has(e))return rn.get(e);try{const t=localStorage.getItem(fr+e)||sessionStorage.getItem(fr+e);if(t!==null){const i=t?JSON.parse(t):null;return rn.set(e,i),i}}catch{}}function Ln(e,t){rn.set(e,t);try{const i=t?JSON.stringify(t):"";localStorage.setItem(fr+e,i)}catch{try{sessionStorage.setItem(fr+e,t?JSON.stringify(t):"")}catch{}}}async function Sh(e,t){try{const i=await fetch(`https://api.themoviedb.org/3/${t==="tv"?"tv":"movie"}/${e}/images?api_key=${kh}&include_image_language=tr,en,null`,{signal:AbortSignal.timeout(3500)});if(!i.ok)return null;const n=await i.json(),a=n.logos||[];let r=null;a.length>0&&(a.sort((d,p)=>{const h=f=>f.iso_639_1==="tr"?3:f.iso_639_1==="en"?2:1;return h(p)-h(d)||(p.vote_average||0)-(d.vote_average||0)}),a[0]?.file_path&&(r=`https://image.tmdb.org/t/p/w500${a[0].file_path}`));const s=(n.backdrops||[]).filter(d=>(d.iso_639_1==="tr"||d.iso_639_1==="en")&&(d.aspect_ratio||0)>1.35&&d.file_path);let l=null;return s.length>0&&(s.sort((d,p)=>{const h=f=>f.iso_639_1==="tr"?2:1;return h(p)-h(d)||(p.vote_average||0)-(d.vote_average||0)}),l=`https://image.tmdb.org/t/p/w780${s[0].file_path}`),l||r?{image:l||null,logo:l?null:r}:null}catch{return null}}async function xh(e,t){try{const i=wh(`/api/fanart?type=${t==="tv"?"tv":"movie"}&id=${encodeURIComponent(e)}`),n=await fetch(i,{signal:AbortSignal.timeout(3e3)});if(!n.ok)return null;const a=await n.json();return a.image?{image:a.image,logo:a.logo||null}:null}catch{return null}}async function xc(e,t="movie"){if(!/^\d+$/.test(String(e)))return null;const i=t==="tv"?"tv":"movie",n=`${i}:${e}`,a=_h(n);if(a!==void 0)return a;const r=(async()=>{const s=Sh(e,i),l=xh(e,i),d=await s;if(d)return Ln(n,d),d;const p=await l;return p?(Ln(n,p),p):(Ln(n,null),null)})();rn.set(n,r);const o=await r;return Ln(n,o),o}function zo(e){Array.isArray(e)&&e.forEach((t,i)=>{if(!t?.id)return;const n=t.media_type==="tv"||t.type==="tv"?"tv":"movie";setTimeout(()=>xc(t.id,n),i*30)})}const Eh=dl||["anime","kimetsu","yaiba","iblis keser","demon slayer","naruto","boruto","shingeki","titan"];function Ft(e=""){return String(e).replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t])}function Th(e){return e?/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(e):!1}function bs(e){if(!e)return!1;if(e.isAnime===!0||e.type==="anime"||e.media_type==="anime"||e.id&&Fe(e.id))return!0;const i=(e.genre_ids||(Array.isArray(e.genres)?e.genres.map(r=>typeof r=="object"?r.id:r):[])).some(r=>Number(r)===16),n=e.original_language==="ja"||Array.isArray(e.origin_country)&&e.origin_country.includes("JP");if(i&&n||i&&(e.origin_country?.includes("JP")||e.original_language==="ja")||e.original_language==="ja"&&(i||Th(e.original_name||e.original_title||e.title||e.name))||Array.isArray(e.genres)&&e.genres.map(o=>typeof o=="object"?o.name:String(o)).filter(Boolean).some(o=>/anime/i.test(o)))return e.id&&_e(e.id),!0;if(typeof e.id=="string"&&(e.id.startsWith("ta_")||e.id.startsWith("acx_")||e.id.startsWith("tra_")))return _e(e.id),!0;const a=(e.title||e.name||e.original_title||e.original_name||"").toLowerCase();for(const r of Eh)if(a.includes(r))return e.id&&_e(e.id),!0;return!1}function Ec(e){return e?e.first_air_date||e.number_of_seasons||e.episodesCount||Array.isArray(e.seasons)&&e.seasons.length>0||e.type==="tv"||e.media_type==="tv"?!0:(e.type==="movie"||e.media_type==="movie"||e.release_date&&!e.first_air_date,!1):!1}function ws(e){return e?e.isAnime||e.type==="anime"||bs(e)||e.id&&Fe(e.id)?"anime":e.type==="documentary"||e.media_type==="documentary"||(e.genre_ids||(Array.isArray(e.genres)?e.genres.map(i=>typeof i=="object"?i.id:i):[])).some(i=>Number(i)===99)?"documentary":e.type==="movie"||e.media_type==="movie"?"movie":e.type==="tv"||e.media_type==="tv"||Ec(e)?"tv":"movie":"movie"}function _t(e,t={}){const i=e.id,n=ws(e),a=!!(e.isAnime||n==="anime"||bs(e)||e.id&&Fe(e.id)),r=!!(e.isSeries!==void 0?e.isSeries:Ec(e)),o=r?"tv":"movie";let s=e.title||e.name||"";(!s||xr(s))&&(s=e.title_en||e.name_en||e.original_name||e.original_title||s||"İsimsiz İçerik");const l=s,d=e.poster_path||e.posterPath||e.poster||"",p=e.backdrop_path||e.backdropPath||e.backdrop||"",h=st(d,Ze.POSTER_MEDIUM),f=p?st(p,Ze.BACKDROP_LARGE):h,v=ft().cardLayout==="landscape"?f:h;let w=e.vote_average??e.voteAverage??e.rating,k=w?Number(w).toFixed(1):"";k==="0.0"&&(k="");const m=e.release_date||e.first_air_date||(e.year?String(e.year):""),b=m?String(m).substring(0,4):"";let E=e.progressPercent||0,C=e.season||1,x=e.episode||1,T=e.currentTime||0,R=e.completed||!1,L=!1;if(t.isContinueSection||e.currentTime>0&&!R||e.progressPercent>0&&!R)L=!0;else{const z=Gt(i,C,x);z&&(R=z.completed||!1,!R&&z.duration>0&&z.currentTime>15&&(E=Math.min(100,Math.round(z.currentTime/z.duration*100)),T=z.currentTime,r&&(C=z.season||1,x=z.episode||1)))}let D="FİLM",N="type-movie";a?(D=r?"ANİME DİZİSİ":"ANİME FİLMİ",N="type-anime"):n==="tv"||r?(D="DİZİ",N="type-tv"):n==="documentary"&&(D="BELGESEL",N="type-doc");const U=e.original_title||e.original_name||"",j=encodeURIComponent(l),O=encodeURIComponent(U),B=encodeURIComponent(d||""),W=encodeURIComponent(p||"");return`
    <div class="media-card" 
      data-id="${i}" 
      data-type="${o}" 
      data-isanime="${a?"true":"false"}"
      data-title="${j}" 
      data-originaltitle="${O}"
      data-poster="${B}"
      data-backdrop="${W}"
      data-tmdbid="${i}"
      data-mediatype="${n==="tv"||r?"tv":"movie"}"
      data-isseries="${r?"true":"false"}"
      data-season="${C}" 
      data-episode="${x}" 
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
          onerror="this.onerror=null;this.src='${cn}'"
        />
        <img class="card-fanart-logo" alt="" aria-hidden="true" />
        
        <div class="card-glass-glow"></div>

        <!-- Left Status Pill (Completed / In-Progress with actual progress) -->
        ${R?`
          <div class="card-status-badge card-status-completed" title="Tamamlandı">
            <i data-lucide="check" style="width:10px;height:10px;stroke-width:3;"></i>
            <span>İZLENDİ</span>
          </div>
        `:L&&r&&(T>0||E>0)?`
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
          <span class="card-type-tag ${N}">${D}</span>
          ${b?`<span class="card-year-tag">${b}</span>`:""}
        </div>
      </div>
    </div>
  `}function kt(e){if(!e||(pn(e),e._hasMediaEventsDelegated))return;e._hasMediaEventsDelegated=!0;let t=0;e.addEventListener("click",s=>{if(Date.now()<t){s.preventDefault(),s.stopPropagation();return}if(s.target.closest(".btn-lib-delete")||s.target.closest(".btn-delete-history"))return;const l=s.target.closest(".media-card");if(!l)return;s.preventDefault();const d=l.getAttribute("data-id"),p=l.getAttribute("data-type"),h=l.getAttribute("data-isanime")==="true"||p==="anime"||Fe(d),f=parseInt(l.getAttribute("data-season")||"1",10),y=parseInt(l.getAttribute("data-episode")||"1",10),v=parseFloat(l.getAttribute("data-currenttime")||"0"),w=decodeURIComponent(l.getAttribute("data-title")||""),k=decodeURIComponent(l.getAttribute("data-originaltitle")||""),m=l.getAttribute("data-poster")||"",b=l.getAttribute("data-backdrop")||"",E=l.getAttribute("data-iscontinue")==="true",C=l.getAttribute("data-isseries"),x=l.getAttribute("data-mediatype"),T=C!==null?C==="true":x==="tv"||p==="tv";E&&(l.closest("#continue-watching-rail")||l.closest(".continue-card-wrapper")||v>0)?Ri({type:h?"anime":T?"tv":"movie",isAnime:h,isSeries:T,tmdbId:d,title:T?`${w} - S${f}E${y}`:w,seriesTitle:w,originalTitle:k||w,season:T?f:void 0,episode:T?y:void 0,posterPath:m,backdropPath:b,currentTime:v}):(No(),window.location.hash=`#detail?type=${h?"anime":p}&id=${d}`)}),document.querySelector("link[rel=preconnect][href*=youtube-nocookie]")||["https://www.youtube-nocookie.com","https://i.ytimg.com"].forEach(s=>{const l=document.createElement("link");l.rel="preconnect",l.href=s,l.crossOrigin="anonymous",document.head.appendChild(l)});const i=window.matchMedia("(hover: hover) and (pointer: fine)").matches,n=window.matchMedia("(pointer: coarse)").matches,a=ft(),r=a.hoverPreviewsEnabled!==!1&&a.trailersEnabled!==!1;function o(s,l){if(s.querySelector(".card-hover-video-preview"))return;let d=sessionStorage.getItem("cinepulse_preview_sound")==="on";l.then(p=>{if(!p||!p.key||!p.key.trim()||!s.isConnected||i&&!s.matches(":hover"))return;const h=decodeURIComponent(s.getAttribute("data-title")||"Fragman"),f=s.querySelector(".card-type-tag")?.textContent?.trim()||"",y=s.querySelector(".card-year-tag")?.textContent?.trim()||"",v=s.querySelector(".card-rating-pill span")?.textContent?.trim()||"",w=s.getAttribute("data-id")||"",k=s.getAttribute("data-type")||"movie",m=`#detail?type=${encodeURIComponent(k)}&id=${encodeURIComponent(w)}`,b=encodeURIComponent(p.key),E=document.createElement("div");E.className="card-hover-video-preview";const C=window.innerWidth<=700;if(C&&(document.querySelectorAll(".card-hover-video-preview").forEach(B=>{typeof B._closePreview=="function"?B._closePreview():(B.closest?.(".media-card")?.classList.remove("preview-active"),B.remove())}),document.querySelectorAll(".card-preview-mobile-close-portal").forEach(B=>B.remove()),E.classList.add("is-mobile-sheet")),E.innerHTML=`
        <div class="card-preview-media">
          <iframe
            src="https://www.youtube-nocookie.com/embed/${b}?autoplay=1&mute=1&controls=0&disablekb=1&modestbranding=1&loop=1&playlist=${b}&rel=0&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}"
            frameborder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            tabindex="-1"
            title="${Ft(h)} fragmanı">
          </iframe>
          <div class="card-preview-cinematic-shade"></div>
          <span class="card-preview-badge">FRAGMAN</span>
        </div>
        <button class="card-preview-close-btn" type="button" aria-label="Fragmanı kapat" title="Fragmanı kapat"><i data-lucide="x"></i></button>
        <div class="card-preview-details">
          <div class="card-preview-copy">
            <strong class="card-preview-title">${Ft(h)}</strong>
            <div class="card-preview-meta">
              ${v?`<span class="card-preview-match">${Ft(v)} IMDb</span>`:""}
              ${y?`<span>${Ft(y)}</span>`:""}
              ${f?`<span>${Ft(f)}</span>`:""}
            </div>
          </div>
          <div class="card-preview-actions">
            <a class="card-preview-detail" href="${Ft(m)}" aria-label="${Ft(h)} içerik sayfasına git"><i data-lucide="info"></i><span>İçeriğe Git</span></a>
            <a class="card-preview-open" href="${Ft(p.watchUrl||`https://www.youtube.com/watch?v=${b}`)}" target="_blank" rel="noopener noreferrer" title="YouTube'da aç" aria-label="Fragmanı YouTube'da aç"><i data-lucide="external-link"></i></a>
            <button class="card-preview-sound ${d?"is-on":""}" type="button" aria-label="${d?"Sesi kapat":"Sesi aç"}" title="${d?"Sesi kapat":"Sesi aç"}">
              <i data-lucide="${d?"volume-2":"volume-x"}"></i>
            </button>
          </div>
        </div>
      `,!C){const B=s.getBoundingClientRect(),W=window.innerHeight<520?12:76,ne=Math.min(460,Math.max(390,B.width*2.2),window.innerWidth-32),z=Math.max(240,(window.innerHeight-W-94)*16/9),G=Math.max(240,Math.min(ne,z)),Y=G*9/16+82,Z=Math.max(16,Math.min(window.innerWidth-G-16,B.left+(B.width-G)/2)),X=Math.max(W,Math.min(window.innerHeight-Y-12,B.top+(B.height-Y)/2));E.style.left=`${Z}px`,E.style.top=`${X}px`,E.style.width=`${G}px`}s.classList.add("preview-active"),s.appendChild(E),V();const x=E.querySelector("iframe");let T=null,R=null;C&&(T=document.createElement("button"),T.type="button",T.className="card-preview-mobile-close-portal",T.setAttribute("aria-label","Fragmanı kapat"),T.title="Fragmanı kapat",T.innerHTML='<i data-lucide="x"></i>',R=()=>{const B=E.getBoundingClientRect();T.style.top=`${Math.max(8,B.top+12)}px`,T.style.left=`${Math.max(8,B.right-52)}px`},document.body.appendChild(T),requestAnimationFrame(R),window.addEventListener("resize",R,{passive:!0}),V(T)),E.addEventListener("click",B=>B.stopPropagation()),E.addEventListener("touchend",B=>B.stopPropagation(),{passive:!0});const L=E.querySelector(".card-preview-sound"),D=E.querySelector(".card-preview-close-btn");E.querySelector(".card-preview-detail")?.addEventListener("click",()=>{No(),j()});const N=(B,W=[])=>{x?.contentWindow?.postMessage(JSON.stringify({event:"command",func:B,args:W}),"*")},U=()=>{N(d?"unMute":"mute"),d&&N("setVolume",[75]),L.classList.toggle("is-on",d),L.title=d?"Sesi kapat":"Sesi aç",L.setAttribute("aria-label",L.title),L.innerHTML=`<i data-lucide="${d?"volume-2":"volume-x"}"></i>`,V()},j=()=>{R&&window.removeEventListener("resize",R);try{T?.remove()}catch{}try{E.remove()}catch{}s.classList.remove("preview-active")};E._closePreview=j;const O=window.setTimeout(()=>{E.classList.add("video-ready")},1500);x.addEventListener("load",()=>{window.clearTimeout(O),E.classList.add("video-ready"),d&&window.setTimeout(U,180)},{once:!0}),L.addEventListener("click",B=>{B.preventDefault(),B.stopPropagation(),d=!d,sessionStorage.setItem("cinepulse_preview_sound",d?"on":"off"),U(),window.setTimeout(U,180)}),D&&D.addEventListener("click",B=>{B.preventDefault(),B.stopPropagation(),j()}),T?.addEventListener("click",B=>{B.preventDefault(),B.stopPropagation(),j()})}).catch(()=>{})}if(i&&r){const s=new WeakMap;e.addEventListener("pointerover",l=>{const d=l.target.closest(".media-card");if(!d||l.relatedTarget&&d.contains(l.relatedTarget))return;const p=d.getAttribute("data-id"),h=d.getAttribute("data-type")||"movie",f=dn(h==="tv"?"tv":"movie",p),y=setTimeout(()=>o(d,f),850);s.set(d,y)}),e.addEventListener("pointerout",l=>{const d=l.target.closest(".media-card");if(!d||l.relatedTarget&&d.contains(l.relatedTarget))return;const p=s.get(d);p&&clearTimeout(p),s.delete(d);const h=d.querySelector(".card-hover-video-preview");if(h)try{h.remove()}catch{}d.classList.remove("preview-active")})}if(n&&r){const l=new WeakMap;e.addEventListener("touchstart",p=>{if(p.target.closest(".card-hover-video-preview"))return;const h=p.target.closest(".media-card");if(!h)return;const f={opened:!1,timer:null},y=h.getAttribute("data-id"),v=h.getAttribute("data-type")||"movie",w=dn(v==="tv"?"tv":"movie",y);f.timer=setTimeout(()=>{f.timer=null,f.opened=!0,t=Date.now()+900;try{navigator.vibrate?.(40)}catch{}o(h,w)},600),l.set(h,f)},{passive:!0});const d=p=>{const h=p.target.closest(".media-card"),f=h&&l.get(h);f&&(f.timer&&clearTimeout(f.timer),f.timer=null,(!f.opened||p.type!=="touchend")&&l.delete(h))};e.addEventListener("touchend",d,{passive:!0}),e.addEventListener("touchmove",d,{passive:!0}),e.addEventListener("touchcancel",d,{passive:!0}),e.addEventListener("touchend",p=>{const h=p.target.closest(".media-card");(h&&l.get(h))?.opened&&l.delete(h)},{passive:!0})}}let Wi=null;function Ah(){return Wi||("IntersectionObserver"in window?(Wi=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&(Wi.unobserve(t.target),Tc(t.target))})},{rootMargin:"800px 0px"}),Wi):null)}async function Tc(e){if(!e||e.dataset.fanartState)return;e.dataset.fanartState="loading";const t=e.querySelector(".card-poster-img");if(!t)return;const i=await xc(e.dataset.tmdbid,e.dataset.mediatype||"movie");if(!i?.image&&!i?.logo){e.dataset.fanartState="empty";return}if(!(i.image||t.dataset.backdropSrc||t.src)){e.dataset.fanartState="empty";return}const a=p=>new Promise(h=>{const f=new Image;f.onload=()=>h(!0),f.onerror=()=>h(!1),f.src=p}),[r,o]=await Promise.all([i.image?a(i.image):Promise.resolve(!0),i.logo?a(i.logo):Promise.resolve(!0)]);if(!r||!o||!e.isConnected){e.dataset.fanartState="empty";return}i.image&&(t.dataset.backdropSrc=i.image);const s=e.querySelector(".card-fanart-logo");s&&i.logo&&(s.src=i.logo);const l=e.querySelector(".card-poster-wrapper");l?.classList.remove("card-fanart-placeholder"),l?.classList.toggle("card-fanart-composite",!!i.logo),(ft().cardLayout==="landscape"||document.documentElement.classList.contains("cards-landscape"))&&i.image&&(t.src=i.image),e.dataset.fanartState="loaded"}function pn(e=document){if(!(ft().cardLayout==="landscape"||document.documentElement.classList.contains("cards-landscape")))return;const n=(e&&e.querySelectorAll?e:document).querySelectorAll(".media-card[data-tmdbid]:not([data-fanart-state])");if(!n.length)return;const a=Ah();if(!a){n.forEach(r=>Tc(r));return}n.forEach(r=>a.observe(r))}let et=null,Ut=null,wi=0;const mr=new Map,Ka=new Set,Ch=10*60*1e3;function Lh(){hh();for(const e of Ka)e.disconnect();Ka.clear()}function Ih(e){try{const t=sessionStorage.getItem(`cinepulse_home_fast_v7_${e?"kids":"adult"}`);if(!t)return null;const i=JSON.parse(t);return!i?.savedAt||Date.now()-i.savedAt>Ch?null:i.data?.isKid===e?i.data:null}catch{return null}}function ya(e){try{sessionStorage.setItem(`cinepulse_home_fast_v7_${e.isKid?"kids":"adult"}`,JSON.stringify({savedAt:Date.now(),data:e}))}catch{}}function an(){et=null,Ut=null,wi++;try{sessionStorage.removeItem("cinepulse_home_fast_v2_kids"),sessionStorage.removeItem("cinepulse_home_fast_v2_adult"),sessionStorage.removeItem("cinepulse_home_fast_v3_kids"),sessionStorage.removeItem("cinepulse_home_fast_v3_adult"),sessionStorage.removeItem("cinepulse_home_fast_v4_kids"),sessionStorage.removeItem("cinepulse_home_fast_v4_adult"),sessionStorage.removeItem("cinepulse_home_fast_v5_kids"),sessionStorage.removeItem("cinepulse_home_fast_v5_adult"),sessionStorage.removeItem("cinepulse_home_fast_v6_kids"),sessionStorage.removeItem("cinepulse_home_fast_v6_adult"),sessionStorage.removeItem("cinepulse_home_fast_v7_kids"),sessionStorage.removeItem("cinepulse_home_fast_v7_adult")}catch{}mr.clear(),Object.keys(ke).forEach(e=>{ke[e].page=1,ke[e].loading=!1,ke[e].exhausted=!1})}const ke={"rail-popular-tv":{page:1,loading:!1,exhausted:!1,fetcher:tr},"rail-popular-movies":{page:1,loading:!1,exhausted:!1,fetcher:ir},"rail-top-tv":{page:1,loading:!1,exhausted:!1,fetcher:e=>ki("tv",e)},"rail-top-movies":{page:1,loading:!1,exhausted:!1,fetcher:e=>ki("movie",e)},"rail-anime":{page:1,loading:!1,exhausted:!1,fetcher:nr},"rail-adult-animation":{page:1,loading:!1,exhausted:!1,fetcher:La},"rail-cartoon-series":{page:1,loading:!1,exhausted:!1,fetcher:er},"rail-documentary":{page:1,loading:!1,exhausted:!1,fetcher:rr}};function Me({id:e,icon:t,title:i,accent:n,items:a}){if(!a||a.length===0)return"";const r=mr.get(e)||[],s=[...a,...r].map(l=>_t(l)).join("");return`
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
  `}function Rh(e){return!e||e.length===0?"":`
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
  `}function Ho(e){const t=e.querySelectorAll(".rail-sentinel");t.length!==0&&t.forEach(i=>{const n=i.getAttribute("data-rail"),a=document.getElementById(n);if(!a)return;const r=async()=>{const s=ke[n];if(!s||s.loading||s.exhausted)return;s.loading=!0;const l=document.createElement("div");l.className="rail-loader",l.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:22px;height:22px;color:var(--text-muted);"></i>',i.before(l),V(l);try{const d=new Set(Array.from(a.querySelectorAll(".media-card[data-id]")).map(f=>String(f.getAttribute("data-id"))).filter(Boolean));let p=[];for(let f=0;f<4&&p.length===0;f+=1){s.page+=1;const y=await s.fetcher(s.page);if(!y||y.length===0){s.exhausted=!0;break}p=y.filter(v=>{const w=String(v?.id||"");return!w||d.has(w)?!1:(d.add(w),!0)})}if(l.remove(),p.length===0||!a.isConnected){s.loading=!1;return}const h=mr.get(n)||[];mr.set(n,[...h,...p]),p.forEach(f=>{const y=document.createElement("div");y.innerHTML=_t(f);const v=y.firstElementChild;v&&(a.insertBefore(v,i),v.addEventListener("click",()=>{const w=v.getAttribute("data-id"),k=v.getAttribute("data-type");window.location.hash=`#detail?type=${k}&id=${w}`}))}),V(a),pn(a)}catch{l.remove()}s.loading=!1};a.addEventListener("scroll",()=>{a.scrollWidth-(a.scrollLeft+a.clientWidth)<600&&r()},{passive:!0});const o=new IntersectionObserver(s=>{s.forEach(l=>{l.isIntersecting&&r()})},{root:a,rootMargin:"0px 400px 0px 0px",threshold:0});o.observe(i),Ka.add(o)})}async function $h(){const e=wi,t=Ct();let i,n,a,r,o,s,l,d,p,h,f,y;et||(et=Ih(t));let v=null,w=!1,k=!1;if(et&&et.isKid===t)({trending:i,popularTV:n,popularMovies:a,topRatedTV:r,topRatedMovies:o,animeItems:s,docItems:l,kidsAdventures:d,adultAnimationItems:p,cartoonSeriesItems:h,kidsAnimationItems:f,kidsClassicCartoonItems:y}=et),v=Ut,w=!v;else if(t){if(v=Promise.all([Ws(1),Ra(1),js(1),Ks(1)]).then(L=>{e===wi&&([d,s,f,y]=L,et={isKid:!0,trending:i,popularTV:n,popularMovies:a,kidsAdventures:d,animeItems:s,kidsAnimationItems:f,kidsClassicCartoonItems:y},k&&ya(et),w=!0)}).catch(()=>{w=!0}),Ut=v,v.then(()=>{Ut===v&&(Ut=null)}),[n,a]=await Promise.all([Ca(1),Ia(1)]),i=[...a||[],...n||[]].filter(L=>L.backdrop_path&&Jt(L)).slice(0,10),e!==wi)return null;w||(et={isKid:!0,trending:i,popularTV:n,popularMovies:a})}else{if(v=Promise.all([ki("tv",1),ki("movie",1),nr(1),rr(1),La(1),er(1)]).then(L=>{e===wi&&([r,o,s,l,p,h]=L,et={isKid:!1,trending:i,popularTV:n,popularMovies:a,topRatedTV:r,topRatedMovies:o,animeItems:s,docItems:l,adultAnimationItems:p,cartoonSeriesItems:h},k&&ya(et),w=!0)}).catch(()=>{w=!0}),Ut=v,v.then(()=>{Ut===v&&(Ut=null)}),[i,n,a]=await Promise.all([kl("all","week",1),tr(1),ir(1)]),e!==wi)return null;w||(et={isKid:!1,trending:i,popularTV:n,popularMovies:a})}k=!0,w&&et&&ya(et);const m=w,b=Hs(),E=Ps(b);let C;t?C=[...a||[],...n||[]].filter(D=>D.backdrop_path&&Jt(D)).slice(0,10):C=i;const x=fh(C);t?(ke["rail-kids-animation"]||(ke["rail-kids-animation"]={page:1,loading:!1,exhausted:!1,fetcher:js}),ke["rail-kids-classics"]||(ke["rail-kids-classics"]={page:1,loading:!1,exhausted:!1,fetcher:Ks}),ke["rail-kids-movies"]||(ke["rail-kids-movies"]={page:1,loading:!1,exhausted:!1,fetcher:Ia}),ke["rail-kids-adventures"]||(ke["rail-kids-adventures"]={page:1,loading:!1,exhausted:!1,fetcher:Ws}),ke["rail-anime"]||(ke["rail-anime"]={page:1,loading:!1,exhausted:!1,fetcher:Ra})):(ke["rail-popular-tv"]||(ke["rail-popular-tv"]={page:1,loading:!1,exhausted:!1,fetcher:tr}),ke["rail-popular-movies"]||(ke["rail-popular-movies"]={page:1,loading:!1,exhausted:!1,fetcher:ir}),ke["rail-top-tv"]||(ke["rail-top-tv"]={page:1,loading:!1,exhausted:!1,fetcher:L=>ki("tv",L)}),ke["rail-top-movies"]||(ke["rail-top-movies"]={page:1,loading:!1,exhausted:!1,fetcher:L=>ki("movie",L)}),ke["rail-anime"]||(ke["rail-anime"]={page:1,loading:!1,exhausted:!1,fetcher:nr}),ke["rail-adult-animation"]||(ke["rail-adult-animation"]={page:1,loading:!1,exhausted:!1,fetcher:La}),ke["rail-cartoon-series"]||(ke["rail-cartoon-series"]={page:1,loading:!1,exhausted:!1,fetcher:er})),t||ke["rail-documentary"]||(ke["rail-documentary"]={page:1,loading:!1,exhausted:!1,fetcher:rr}),Object.values(ke).forEach(L=>{L.loading=!1});let T="";return t?T=`
      ${Me({id:"rail-kids-movies",icon:"sparkles",title:"🎈 En Çok Sevilen Animasyon & Çocuk Filmleri",accent:"#ec4899",items:a})}

      ${f&&f.length>0?Me({id:"rail-kids-animation",icon:"sparkles",title:"Çocuk Animasyonları & Yeni Çizgi Diziler",accent:"#fb7185",items:f}):""}

      ${y&&y.length>0?Me({id:"rail-kids-classics",icon:"palette",title:"Çizgi Dizi Dünyası & Unutulmaz Klasikler",accent:"#38bdf8",items:y}):""}

      ${d&&d.length>0?Me({id:"rail-kids-adventures",icon:"compass",title:"⭐ Aile ve Fantastik Sinema Kuşağı",accent:"#38bdf8",items:d}):""}

      ${s&&s.length>0?Me({id:"rail-anime",icon:"smile",title:"🎌 Çocuk & Genç Anime Dünyası",accent:"#a855f7",items:s}):""}
    `:T=`
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

      ${Rh(E)}

      ${T}
    </div>
  `,init:L=>{const D=C&&C.length>0?C:i;D&&D.length>0&&mh(D),kt(L);const N=j=>{j.querySelectorAll(".card-rail").forEach(O=>{const B=O.id;if(B){let W=hr.get(B);if(typeof W!="number")try{const ne=sessionStorage.getItem(`cinepulse_rail_${B}`);ne&&(W=parseFloat(ne))}catch{}typeof W=="number"&&W>0&&(O.scrollLeft=W,requestAnimationFrame(()=>{O.scrollLeft=W})),O.addEventListener("scroll",()=>{hr.set(B,O.scrollLeft)},{passive:!0})}O.addEventListener("wheel",W=>{Math.abs(W.deltaX)>Math.abs(W.deltaY)||(W.preventDefault(),O.scrollBy({left:W.deltaY*2.5,behavior:"smooth"}))},{passive:!1})})};if(N(L),L.querySelectorAll(".spotlight-hero, .spotlight-mini").forEach(j=>{j.addEventListener("click",()=>{const O=j.getAttribute("data-id"),B=j.getAttribute("data-type");O&&B&&(window.location.hash=`#detail?type=${B}&id=${O}`)})}),L.querySelector(".spotlight-hero-btn")?.addEventListener("click",j=>{j.stopPropagation();const O=L.querySelector(".spotlight-hero");if(O){const B=O.getAttribute("data-id"),W=O.getAttribute("data-type");window.location.hash=`#detail?type=${W}&id=${B}`}}),Ho(L),v&&!m){const j=L.querySelector(".home-view");v.then(()=>{if({topRatedTV:r,topRatedMovies:o,animeItems:s,docItems:l,kidsAdventures:d,adultAnimationItems:p,cartoonSeriesItems:h,kidsAnimationItems:f,kidsClassicCartoonItems:y}=et||{},!j?.isConnected||!(window.location.hash||"#home").startsWith("#home"))return;const O=document.createElement("div");O.className="home-more-rails",O.innerHTML=t?`
            ${Me({id:"rail-kids-animation",icon:"sparkles",title:"Çocuk Animasyonları & Yeni Çizgi Diziler",accent:"#fb7185",items:f})}
            ${Me({id:"rail-kids-classics",icon:"palette",title:"Çizgi Dizi Dünyası & Unutulmaz Klasikler",accent:"#38bdf8",items:y})}
            ${Me({id:"rail-kids-adventures",icon:"compass",title:"⭐ Aile ve Fantastik Sinema Kuşağı",accent:"#38bdf8",items:d})}
            ${Me({id:"rail-anime",icon:"smile",title:"🎌 Çocuk & Genç Anime Dünyası",accent:"#a855f7",items:s})}
          `:`
            ${Me({id:"rail-adult-animation",icon:"sparkles",title:"Yetişkin Animasyonları & Çizgi Diziler",accent:"#fb7185",items:p})}
            ${Me({id:"rail-cartoon-series",icon:"wand-2",title:"Çizgi Dizi Dünyası & Unutulmaz Klasikler",accent:"#38bdf8",items:h})}
            ${Me({id:"rail-top-movies",icon:"award",title:"⭐ Sinema Tarihinin Başyapıtları (IMDb 8.5+)",accent:"#fbbf24",items:o})}
            ${Me({id:"rail-top-tv",icon:"star",title:"Kült & En Yüksek Puanlı Diziler",accent:"#34d399",items:r})}
            ${Me({id:"rail-anime",icon:"sparkles",title:"🎌 Popüler Anime Evreni (TR Dublaj & Altyazı)",accent:"#ec4899",items:s})}
            ${Me({id:"rail-documentary",icon:"globe",title:"🌍 İlham Veren Kült Belgeseller",accent:"#38bdf8",items:l})}
          `,j.append(O),V(O),kt(O),N(O),Ho(O)})}L.querySelectorAll(".btn-delete-history").forEach(j=>{j.addEventListener("click",O=>{O.stopPropagation();const B=j.closest(".continue-card-wrapper");if(!B)return;const W=B.getAttribute("data-id");Ea(W),te("İçerik izleme geçmişinden kaldırıldı.","info"),B.style.transition="all 0.28s ease-out",B.style.transform="scale(0.85)",B.style.opacity="0",setTimeout(()=>{B.remove();const ne=L.querySelector("#continue-watching-rail");ne&&ne.children.length===0&&ne.closest(".rail-section")?.remove()},300)})});const U=()=>{if(!(window.location.hash||"#home").startsWith("#home"))return;const j=L.querySelector(".home-view");if(!j?.isConnected)return;const O=Ps(Hs()),B=L.querySelector("#continue-watching-rail")?.closest(".rail-section");if(O&&O.length>0){const ne=O.slice(0,24).map(z=>`
            <div class="continue-card-wrapper" data-id="${z.id}" data-season="${z.season||1}" data-episode="${z.episode||1}">
              ${_t(z,{isContinueSection:!0})}
              <button class="btn-delete-history" title="Geçmişten Kaldır" aria-label="Kaldır">
                <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
              </button>
            </div>
          `).join("");if(B){const z=B.querySelector("#continue-watching-rail");z&&(z.innerHTML=ne)}else{const z=`
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
                    ${ne}
                  </div>
                </div>
              </section>
            `,G=j.querySelector(".hero-slider-section")||j.querySelector(".rail-section");G?G.insertAdjacentHTML("afterend",z):j.insertAdjacentHTML("afterbegin",z)}V(L),kt(L),L.querySelectorAll(".btn-delete-history").forEach(z=>{z.addEventListener("click",G=>{G.stopPropagation();const Y=z.closest(".continue-card-wrapper");if(!Y)return;const Z=Y.getAttribute("data-id");Ea(Z),te("İçerik izleme geçmişinden kaldırıldı.","info"),Y.style.transition="all 0.28s ease-out",Y.style.transform="scale(0.85)",Y.style.opacity="0",setTimeout(()=>{Y.remove();const X=L.querySelector("#continue-watching-rail");X&&X.children.length===0&&X.closest(".rail-section")?.remove()},300)})})}else B&&B.remove()};window.addEventListener("cinepulse_data_changed",U),window.addEventListener("sineflix_data_changed",U)}}}async function Mh({tvId:e,seriesTitle:t,originalTitle:i="",seriesOverview:n="",seasons:a=[],posterPath:r="",backdropPath:o="",isAnime:s=!1,spoilerFree:l=!1}){const d=a.filter(k=>k.season_number>0);d.length===0&&a.length>0&&d.push(a[0]);const p=d.length>0?d[0].season_number:1,h=d.length>0&&d[0].episode_count||10,f=Yr(e,p,h);let y=!!l,v=null;return{html:`
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
  `,init:k=>{if(!k)return;let m=p,b=h;const E=()=>{const N=k.querySelector("#btn-mark-season-all");if(!N)return;const U=Yr(e,m,b),j=N.querySelector("span"),O=N.querySelector("i");j&&(j.textContent=U?"Bu Sezon İzlendi":"Bu Sezonu İzlendi İşaretle"),O&&O.setAttribute("data-lucide",U?"check-circle-2":"check-check"),U?(N.style.background="rgba(16, 185, 129, 0.2)",N.style.borderColor="#10b981",N.style.color="#10b981"):(N.style.background="",N.style.borderColor="",N.style.color=""),V()};Yn(e,t,n,m,k,r,o,i,d,E,s,y);const C=N=>{if(N&&N.detail&&N.detail.isProgressUpdate&&document.getElementById("player-modal"))return;const U=k.querySelector("#episode-grid-container");U&&(U.querySelectorAll(".episode-card").forEach(j=>{const O=parseInt(j.getAttribute("data-season"),10),B=parseInt(j.getAttribute("data-episode"),10),W=Gt(e,O,B),ne=W?W.progressPercent:0,z=W?W.completed||ne>=90:!1,G=W&&!z&&W.currentTime>0,Y=j.querySelector(".badge-watched-status"),Z=j.querySelector(".btn-mark-ep-watched"),X=j.querySelector(".card-progress-fill"),ie=j.querySelector(".btn-mark-ep-halfway");Y&&(z?(Y.innerHTML='<i data-lucide="check" style="width:11px; height:11px"></i> İZLENDİ',Y.style.background="var(--accent-green)",Y.style.color="#fff",Y.style.display="inline-flex"):G?(Y.innerHTML='<i data-lucide="clock" style="width:11px; height:11px"></i> YARIDA',Y.style.background="rgba(245, 158, 11, 0.95)",Y.style.color="#000",Y.style.display="inline-flex"):Y.style.display="none"),Z&&(z?(Z.classList.add("watched"),Z.style.background="#10b981",Z.style.borderColor="#10b981",Z.title="İzlendi işaretini kaldır"):(Z.classList.remove("watched"),Z.style.background="rgba(0,0,0,0.65)",Z.style.borderColor="rgba(255,255,255,0.3)",Z.title="İzlendi olarak işaretle")),ie&&(ie.style.background=G?"#f59e0b":"rgba(0,0,0,0.65)",ie.style.borderColor=G?"#f59e0b":"rgba(255,255,255,0.3)"),X&&(X.style.width=`${ne}%`,X.style.background=z?"var(--accent-green)":"#fbbf24")}),V()),E()};window.addEventListener("sineflix_data_changed",C),k.querySelectorAll(".season-pill").forEach(N=>{N.addEventListener("click",U=>{U.preventDefault(),k.querySelectorAll(".season-pill").forEach(j=>j.classList.remove("active")),N.classList.add("active"),N.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"}),m=parseInt(N.getAttribute("data-season"),10),b=parseInt(N.getAttribute("data-ep-count"),10)||10,Yn(e,t,n,m,k,r,o,i,d,E,s,y),E()})});const x=k.querySelector(".season-pill.active");x&&setTimeout(()=>{x.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})},120);const T=k.querySelector("#season-tabs-bar"),R=k.querySelector("#btn-season-prev"),L=k.querySelector("#btn-season-next");if(T){R?.addEventListener("click",B=>{B.preventDefault(),T.scrollBy({left:-260,behavior:"smooth"})}),L?.addEventListener("click",B=>{B.preventDefault(),T.scrollBy({left:260,behavior:"smooth"})}),T.addEventListener("wheel",B=>{B.deltaY!==0&&T.scrollWidth>T.clientWidth&&(B.preventDefault(),T.scrollLeft+=B.deltaY)},{passive:!1});let N=!1,U=0,j=0,O=!1;T.addEventListener("mousedown",B=>{B.button===0&&(N=!0,O=!1,T.classList.add("dragging"),U=B.pageX-T.offsetLeft,j=T.scrollLeft)}),window.addEventListener("mousemove",B=>{if(!N)return;const ne=(B.pageX-T.offsetLeft-U)*1.5;Math.abs(ne)>4&&(O=!0),T.scrollLeft=j-ne}),window.addEventListener("mouseup",()=>{N&&(N=!1,T.classList.remove("dragging"),setTimeout(()=>{O=!1},50))}),T.addEventListener("click",B=>{O&&(B.preventDefault(),B.stopPropagation())},!0)}const D=k.querySelector("#btn-mark-season-all");D&&D.addEventListener("click",N=>{N.preventDefault();const j=!Yr(e,m,b);dd(e,m,b,j,{title:t,posterPath:r,backdropPath:o,type:s?"anime":"tv",isAnime:s}),te(j?`${m}. Sezonun tüm bölümleri izlendi!`:`${m}. Sezon izlenmedi olarak işaretlendi.`,j?"success":"info");const O=k.querySelector("#episode-grid-container");O&&(O.querySelectorAll(".episode-card").forEach(B=>{const W=B.querySelector(".badge-watched-status"),ne=B.querySelector(".btn-mark-ep-watched");W&&(W.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',W.style.background="var(--accent-green)",W.style.color="#fff",W.style.display=j?"inline-flex":"none"),ne&&(j?(ne.classList.add("watched"),ne.style.background="#10b981",ne.style.borderColor="#10b981",ne.title="İzlendi işaretini kaldır"):(ne.classList.remove("watched"),ne.style.background="rgba(0,0,0,0.65)",ne.style.borderColor="rgba(255,255,255,0.3)",ne.title="İzlendi olarak işaretle"))}),V()),E()}),v=N=>{y=!!N,Yn(e,t,n,m,k,r,o,i,d,E,s,y)}},setSpoilerSafe(k){y=!!k,v?.(y)}}}function Ph(e){const t=Be().filter(i=>String(i?.id)===String(e)&&(Number(i.currentTime)>0||i.completed||Number(i.progressPercent)>0));return t.length?t.reduce((i,n)=>{const a={season:Math.max(1,Number(n.season)||1),episode:Math.max(1,Number(n.episode)||1)};return a.season>i.season||a.season===i.season&&a.episode>i.episode?a:i},{season:1,episode:1}):{season:1,episode:1}}async function Yn(e,t,i,n,a,r="",o="",s="",l=[],d=null,p=!1,h=!1){const f=a.querySelector("#episode-grid-container");if(!f)return;f.innerHTML=`<div style="padding: 3rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;"><i data-lucide="loader-2" class="spin-loader" style="width: 24px; height: 24px; margin-bottom: 0.5rem;"></i><div>${n}. Sezon bölümleri getiriliyor...</div></div>`,V();let y=null;try{y=await Pd(e,n)}catch{}if(!y||!y.episodes||y.episodes.length===0){f.innerHTML=`
      <div style="padding: 3rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;">
        <p style="margin-bottom: 0.75rem;">Bu sezon için bölüm verisi getirilemedi.</p>
        <button id="btn-retry-season-episodes" class="btn-secondary" style="padding: 0.45rem 1rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
          <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
          <span>Tekrar Dene</span>
        </button>
      </div>
    `,V(),a.querySelector("#btn-retry-season-episodes")?.addEventListener("click",()=>{Yn(e,t,i,n,a,r,o,s,l,d,p,h)});return}const v=h?Ph(e):null,w=h?y.episodes.filter(m=>n<v.season||n===v.season&&Number(m.episode_number)<=v.episode+1):y.episodes;if(h&&w.length===0){f.innerHTML='<div class="spoiler-safe-locked"><i data-lucide="shield-check"></i><strong>Bu sezon spoiler korumasında</strong><span>Önceki sezona ilerledikçe bölüm detayları burada açılır.</span></div>',V();return}const k=h?`<div class="spoiler-safe-notice"><i data-lucide="shield-check"></i><span>Spoilersız keşif açık · S${v.season} B${v.episode+1} sonrasının detayları gizli.</span></div>`:"";f.innerHTML=k+w.map(m=>{const b=m.episode_number,E=m.name||`${b}. Bölüm`;let C=m.overview?m.overview.trim():"";(!C||C.length<5)&&(i&&i.length>10?C=`${b}. Bölüm: ${i}`:C=`${t} ${n}. Sezon ${b}. Bölüm Türkçe Dublaj ve Altyazılı yüksek kalitede kesintisiz HD izle.`);const x=C.length>90,T=st(m.still_path,Ze.STILL_MEDIUM),R=m.air_date||"",L=m.runtime?`${m.runtime} dk`:"",D=Gt(e,n,b),N=D?D.progressPercent:0,U=D?D.completed||N>=90:!1,j=D&&!U&&D.currentTime>0,O=N>0?`
      <div class="card-progress-bar">
        <div class="card-progress-fill" style="width: ${N}%; background: ${U?"var(--accent-green)":"#fbbf24"};"></div>
      </div>
    `:"";let B="";return U?B=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.5rem; left: 0.5rem; background: var(--accent-green); z-index: 4;">
          <i data-lucide="check" style="width:11px; height:11px"></i> İZLENDİ
        </span>
      `:j?B=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.5rem; left: 0.5rem; background: rgba(245, 158, 11, 0.95); color: #000; font-weight: 800; z-index: 4;">
          <i data-lucide="clock" style="width:11px; height:11px"></i> YARIDA
        </span>
      `:B=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.5rem; left: 0.5rem; background: var(--accent-green); display: none; z-index: 4;">
          <i data-lucide="check" style="width:11px; height:11px"></i> İZLENDİ
        </span>
      `,`
      <div class="episode-card" data-tv-id="${e}" data-season="${n}" data-episode="${b}" data-title="${E}">
        <div class="episode-thumb-wrap">
          <img src="${T}" alt="${E}" loading="lazy" onerror="this.onerror=null; this.src='${cn}';" />
          <span class="episode-number-chip">${n}x${b<10?"0"+b:b}</span>
          ${B}
          
          <div class="episode-play-overlay">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--primary-gradient); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.6);">
              <i data-lucide="play" style="width: 20px; height: 20px; fill: #fff; color: #fff; margin-left: 2px;"></i>
            </div>
          </div>

          <!-- Top Right Action Controls: Mark Watched & Halfway -->
          <div style="position: absolute; top: 0.5rem; right: 0.5rem; display: flex; gap: 0.35rem; z-index: 5;">
            <button class="btn-mark-ep-halfway" data-tv-id="${e}" data-season="${n}" data-episode="${b}" title="Yarıda Bırakıldı (20. dk)" style="width: 28px; height: 28px; border-radius: 50%; background: ${j?"#f59e0b":"rgba(0,0,0,0.65)"}; border: 1px solid ${j?"#f59e0b":"rgba(255,255,255,0.3)"}; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
              <i data-lucide="clock" style="width: 13px; height: 13px;"></i>
            </button>

            <button class="btn-mark-ep-watched ${U?"watched":""}" data-tv-id="${e}" data-season="${n}" data-episode="${b}" title="${U?"İzlendi işaretini kaldır":"İzlendi olarak işaretle"}" style="width: 28px; height: 28px; border-radius: 50%; background: ${U?"#10b981":"rgba(0,0,0,0.65)"}; border: 1px solid ${U?"#10b981":"rgba(255,255,255,0.3)"}; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
              <i data-lucide="check" style="width: 14px; height: 14px;"></i>
            </button>
          </div>

          ${O}
        </div>

        <div class="episode-info">
          <div class="episode-header-row">
            <span class="episode-title" title="${E}">${b}. ${E}</span>
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
    `}).join(""),V(),a.querySelectorAll(".btn-toggle-overview").forEach(m=>{m.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation();const E=m.closest(".episode-overview-container"),C=E?E.querySelector(".episode-overview"):null;if(!C)return;const x=m.querySelector("span"),T=m.querySelector("i");C.classList.contains("truncated")?(C.classList.remove("truncated"),x&&(x.textContent="Daralt"),T&&T.setAttribute("data-lucide","chevron-up")):(C.classList.add("truncated"),x&&(x.textContent="Devamını Oku"),T&&T.setAttribute("data-lucide","chevron-down")),V()})}),f.querySelectorAll(".btn-mark-ep-watched").forEach(m=>{m.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation();const E=parseInt(m.getAttribute("data-season"),10),C=parseInt(m.getAttribute("data-episode"),10),x=m.closest(".episode-card"),R=hl(e,E,C,{title:t,posterPath:r,backdropPath:o,type:p?"anime":"tv",isAnime:p}).completed;if(te(R?`S${E} B${C} izlendi olarak işaretlendi!`:`S${E} B${C} izlendi işareti kaldırıldı.`,R?"success":"info"),R?(m.classList.add("watched"),m.style.background="#10b981",m.style.borderColor="#10b981",m.title="İzlendi işaretini kaldır"):(m.classList.remove("watched"),m.style.background="rgba(0,0,0,0.65)",m.style.borderColor="rgba(255,255,255,0.3)",m.title="İzlendi olarak işaretle"),x){const L=x.querySelector(".badge-watched-status");L&&(L.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',L.style.background="var(--accent-green)",L.style.color="#fff",L.style.display=R?"inline-flex":"none")}typeof d=="function"&&d(),V()})}),f.querySelectorAll(".btn-mark-ep-halfway").forEach(m=>{m.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation();const E=parseInt(m.getAttribute("data-season"),10),C=parseInt(m.getAttribute("data-episode"),10),x=m.closest(".episode-card");if(Ta(e,E,C,1200,{title:t,posterPath:r,backdropPath:o,type:p?"anime":"tv",isAnime:p,duration:2700}),m.style.background="#f59e0b",m.style.borderColor="#f59e0b",x){const T=x.querySelector(".badge-watched-status");T&&(T.innerHTML='<i data-lucide="clock" style="width:12px; height:12px"></i> YARIDA (20:00)',T.style.background="rgba(245, 158, 11, 0.9)",T.style.color="#000",T.style.display="inline-flex")}te(`S${E} B${C} 20. dakikada yarıda bırakıldı olarak işaretlendi!`,"info"),V()})}),f.querySelectorAll(".episode-card").forEach(m=>{const b=x=>{if(x&&x.target&&(x.target.closest(".btn-mark-ep-watched")||x.target.closest(".btn-mark-ep-halfway")||x.target.closest(".btn-toggle-overview")))return;x&&(x.preventDefault(),x.stopPropagation());const T=parseInt(m.getAttribute("data-season"),10),R=parseInt(m.getAttribute("data-episode"),10),L=m.getAttribute("data-title"),D=Gt(e,T,R),N=D?D.currentTime:0;Ri({type:p?"anime":"tv",isAnime:p,tmdbId:e,title:`${t} - S${T}E${R}: ${L}`,seriesTitle:t,originalTitle:s||t,season:T,episode:R,posterPath:r,backdropPath:o,currentTime:N,seasonsList:l,maxEpisodes:y.episodes?y.episodes.length:0})};m.addEventListener("click",b);const E=m.querySelector(".episode-thumb-wrap");E&&E.addEventListener("click",b);const C=m.querySelector(".btn-play-episode-trigger");C&&C.addEventListener("click",b)})}let Vn=null;async function Bh(e,t="",i=""){gi();const n=document.createElement("div");n.id="cast-explorer-modal-root",n.className="cast-explorer-backdrop",document.body.appendChild(n),Vn=n,n.innerHTML=`
    <div class="cast-explorer-dialog">
      <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
      </button>
      <div class="cast-explorer-loading">
        <div class="cast-explorer-spinner"></div>
        <span>${t||"Oyuncu"} bilgileri ve filmografisi yükleniyor...</span>
      </div>
    </div>
  `,V(n);const a=n.querySelector("#btn-close-cast-explorer");a&&(a.onclick=()=>gi()),n.onclick=R=>{R.target===n&&gi()};const r=R=>{R.key==="Escape"&&(gi(),window.removeEventListener("keydown",r))};window.addEventListener("keydown",r);const o=await Bd(e);if(!o){n.innerHTML=`
      <div class="cast-explorer-dialog">
        <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
          <i data-lucide="x" style="width: 20px; height: 20px;"></i>
        </button>
        <div class="cast-explorer-loading">
          <i data-lucide="alert-circle" style="width: 36px; height: 36px; color: #ef4444;"></i>
          <span>Oyuncu bilgileri alınamadı.</span>
        </div>
      </div>
    `,V(n);return}const s=o.name||t,l=o.profile_path?st(o.profile_path,Ze.POSTER_MEDIUM):i||Qn,d=o.birthday?o.birthday.substring(0,4):"",p=o.place_of_birth||"",h=o.known_for_department==="Acting"?"Oyuncu":o.known_for_department==="Directing"?"Yönetmen":o.known_for_department||"Sanatçı",f=o.biography&&o.biography.trim().length>20?o.biography:`${s}, sinema ve televizyon dünyasında yer aldığı yapımlarla tanınan başarılı bir sanatçıdır.`,y=o.combined_credits?.cast||[],v=o.combined_credits?.crew||[],w=[...y,...v],k=new Set,m=[];for(const R of w){if(!R||!R.id)continue;const L=`${R.media_type||"movie"}_${R.id}`;k.has(L)||(k.add(L),R.poster_path&&m.push(R))}m.sort((R,L)=>(L.popularity||0)-(R.popularity||0));const b=m.filter(R=>R.media_type==="movie"||!R.media_type&&R.title).length,E=m.filter(R=>R.media_type==="tv"||!R.media_type&&R.name).length;n.innerHTML=`
    <div class="cast-explorer-dialog">
      <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
      </button>

      <!-- Actor Hero Header -->
      <div class="cast-explorer-header">
        <div class="cast-explorer-avatar-box">
          <img src="${l}" alt="${s}" class="cast-explorer-avatar" onerror="this.onerror=null; this.src='${Qn}';" />
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
        <button class="cast-tab-btn" data-filter="movie">Filmler (${b})</button>
        <button class="cast-tab-btn" data-filter="tv">Diziler (${E})</button>
      </div>

      <!-- Media Cards Grid -->
      <div class="cast-explorer-grid" id="cast-explorer-grid">
        ${m.map(R=>_t(R)).join("")}
      </div>
    </div>
  `,V(n);const C=n.querySelector("#btn-close-cast-explorer");C&&(C.onclick=()=>gi());const x=n.querySelector("#cast-explorer-grid");x&&(kt(x),x.addEventListener("click",()=>{setTimeout(()=>gi(),150)}));const T=n.querySelectorAll(".cast-tab-btn");T.forEach(R=>{R.onclick=()=>{T.forEach(N=>N.classList.remove("active")),R.classList.add("active");const L=R.getAttribute("data-filter");let D=m;L==="movie"?D=m.filter(N=>N.media_type==="movie"||!N.media_type&&N.title):L==="tv"&&(D=m.filter(N=>N.media_type==="tv"||!N.media_type&&N.name)),x&&(x.innerHTML=D.length>0?D.map(N=>_t(N)).join(""):'<div class="cast-empty-state">Bu kategoride yapım bulunamadı.</div>',V(x))}})}function gi(){if(Vn){try{Vn.remove()}catch{}Vn=null}}const Dh="https://api.tvmaze.com",Oh=5500,Ac=30*60*1e3,Cc="cinepulse_tvmaze_cache_v1",hn=new Map;function Nh(){try{const e=sessionStorage.getItem(Cc);if(!e)return;const t=JSON.parse(e);t&&typeof t=="object"&&Object.entries(t).forEach(([i,n])=>{n?.savedAt&&Date.now()-n.savedAt<Ac&&hn.set(i,n)})}catch{}}function zh(){try{const e={};let t=0;for(const[i,n]of hn.entries()){if(t++>=80)break;e[i]=n}sessionStorage.setItem(Cc,JSON.stringify(e))}catch{}}function ks(e){const t=hn.get(e);if(t){if(Date.now()-t.savedAt>Ac){hn.delete(e);return}return t.data}}function _s(e,t){hn.set(e,{savedAt:Date.now(),data:t}),zh()}async function gr(e){try{const t=await fetch(`${Dh}${e}`,{headers:{Accept:"application/json"},signal:AbortSignal.timeout(Oh)});return t.ok?await t.json():null}catch{return null}}function qo(e){return String(e||"").toLowerCase().replace(/[^a-z0-9çğıöşü ]/gi," ").replace(/\s+/g," ").trim()}function Lc(e,t){const i=qo(e),n=qo(t);return!i||!n?!1:i===n?!0:i.includes(n)||n.includes(i)}function Fo(e){return e?{season:e.season??null,number:e.number??null,name:e.name||"",airdate:e.airdate||"",airstamp:e.airstamp||"",runtime:e.runtime||null}:null}function Hh(e){switch(e){case"Running":return"Devam ediyor";case"Ended":return"Sonlandı";case"To Be Determined":return"Belirsiz";case"In Development":return"Yapım aşamasında";default:return e||""}}async function qh(e){const t=`lookup:${e}`,i=ks(t);if(i!==void 0)return i;const n=await gr(`/lookup/shows?${e}`);return _s(t,n||null),n||null}async function Ic(e){if(!e)return null;const t=`show:${e}`,i=ks(t);if(i!==void 0)return i;const n=await gr(`/shows/${e}?embed[]=nextepisode&embed[]=previousepisode`),a=n?{tvmazeId:n.id,name:n.name||"",status:n.status||"",statusLabel:Hh(n.status),premiered:n.premiered||"",officialSite:n.officialSite||"",thetvdbId:n.externals?.thetvdb??null,imdbId:n.externals?.imdb||"",nextEpisode:Fo(n._embedded?.nextepisode),previousEpisode:Fo(n._embedded?.previousepisode)}:null;return _s(t,a),a}async function Fh(e){const t=String(e||"").trim();if(!t)return null;const i=t.startsWith("tt")?t:`tt${t}`,a=(await qh(`imdb=${encodeURIComponent(i)}`))?.id||null;return a?Ic(a):null}function Rc(e,t){const i=parseInt(String(e?.premiered||"").substring(0,4),10),n=parseInt(String(t||""),10);return!n||!i?0:Math.abs(i-n)}function Uh(e,t,i){let n=null,a=1/0;for(const r of e){if(!r||!Lc(r.name,t))continue;const o=Rc(r,i);if(o>1)continue;const s=o*10+(r.status==="Running"?0:1);s<a&&(a=s,n=r)}return n}async function jh(e,t){const i=String(e||"").trim();if(i.length<2)return null;const n=`search:${i}:${t||""}`,a=ks(n);if(a!==void 0)return a;let r=null;const o=await gr(`/singlesearch/shows?q=${encodeURIComponent(i)}`);if(o&&Lc(o.name,i)&&Rc(o,t)<=1&&(r=o),!r){const l=await gr(`/search/shows?q=${encodeURIComponent(i)}`),d=Array.isArray(l)?l.map(p=>p?.show).filter(Boolean):[];r=Uh(d,i,t)}const s=r?await Ic(r.id):null;return _s(n,s),s}async function Kh({imdbId:e,title:t,year:i}={}){let n=await Fh(e);if(n||(n=await jh(t,i)),!n)return null;const a=n.nextEpisode;return{showName:n.name,statusLabel:n.statusLabel,officialSite:n.officialSite,nextEpisode:a,previousEpisode:n.previousEpisode,nextLabel:a?Wh(a):"",nextAirdateLabel:a?Vh(a.airdate,a.airstamp):""}}function Wh(e){if(!e)return"";const t=e.season!==null&&e.season!==void 0,i=e.number!==null&&e.number!==void 0,n=t&&e.season>=1900;return t&&!n&&i?`S${e.season} B${e.number}`:n&&e.name?e.name:i?`B${e.number}`:e.name||""}const Yh=["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];function Vh(e,t){const i=t?new Date(t):e?new Date(`${e}T21:00:00`):null;if(!i||Number.isNaN(i.getTime()))return e||"";const n=new Date,a=s=>new Date(s.getFullYear(),s.getMonth(),s.getDate()).getTime(),r=Math.round((a(i)-a(n))/864e5),o=t?`${String(i.getHours()).padStart(2,"0")}:${String(i.getMinutes()).padStart(2,"0")}`:"";return r<0?"Yayınlandı":r===0?o?`Bugün ${o}`:"Bugün":r===1?o?`Yarın ${o}`:"Yarın":r<=7?`${r} gün sonra`:`${i.getDate()} ${Yh[i.getMonth()]}`}Nh();const Uo="cinepulse.decision-room.autoplay";function Gh(e,t){try{const i=JSON.parse(sessionStorage.getItem(Uo)||"null");return sessionStorage.removeItem(Uo),i&&String(i.id)===String(t)&&i.type===e&&Date.now()-Number(i.createdAt||0)<15e3?i:null}catch{return null}}function Jh(e){if(!e||e<=0)return"";const t=Math.floor(e/60),i=e%60;return t>0?`${t} sa ${i>0?i+" dk":""} (${e} dk)`:`${e} dk`}async function Xh(e="tv",t){const i=typeof e=="object"&&e!==null?e.type||"tv":e||"tv",n=typeof e=="object"&&e!==null?e.id:t;let a=i==="series"||i==="tv"||i==="anime"?"tv":i==="movie"?"movie":"tv",r=await Ys(a,n);if(r||(a=a==="tv"?"movie":"tv",r=await Ys(a,n)),!r)return{html:'<div class="container" style="padding: 10rem 0; text-align: center;"><h2>İçerik bulunamadı.</h2></div>',init:()=>{}};const o=!!(r.seasons&&r.seasons.length>0)||a==="tv",s=o?"tv":"movie",l=bs(r)||i==="anime"||a==="anime"||Fe(n);l&&_e(n);const d=r.title||r.name||"Detay",p=r.original_title||r.original_name||"",h=st(r.backdrop_path,Ze.BACKDROP_ORIGINAL),f=st(r.poster_path,Ze.POSTER_MEDIUM),y=r.vote_average?r.vote_average.toFixed(1):"8.5",v=(r.first_air_date||r.release_date||"").substring(0,4),w=r.overview&&r.overview.trim().length>15?r.overview:qe(r,s),k=r.genres||[],m=r.runtime?r.runtime*60:6600,b=pd(n),E=ts(n),C=s==="tv"?Vr(n):null,x=s==="movie"?Gt(n,1,1):null,T=s==="movie"?ln(n,1,1):!1,R=s==="tv"?Wr(n,r.seasons||[]):!1,L=s==="movie"?T:R;let D=s==="movie"?"Filmi İzle":"1. Sezon 1. Bölümü İzle";if(s==="tv"&&C){const Q=ii(C.currentTime);D=`Devam Et <span class="play-btn-subinfo">S${C.season} B${C.episode}${Q?" • "+Q:""}</span>`}else s==="movie"&&x&&x.currentTime>0&&(D=`Devam Et <span class="play-btn-subinfo">${ii(x.currentTime)}</span>`);const N=r.credits?.crew?r.credits.crew.filter(Q=>Q.job==="Director").map(Q=>Q.name):[],U=r.created_by?r.created_by.map(Q=>Q.name):[],j=N.length>0?N.slice(0,2).join(", "):U.length>0?U.slice(0,2).join(", "):"",O=(parseFloat(y)/2).toFixed(1),B=Math.floor(O),W=O%1>=.4,ne="★".repeat(Math.min(5,B))+(W&&B<5?"½":""),z=r.credits&&r.credits.cast?r.credits.cast.slice(0,10):[];let G=null,Y=!1;s==="tv"&&r.seasons&&(G=await Mh({tvId:n,seriesTitle:d,originalTitle:p,seriesOverview:w,seasons:r.seasons,posterPath:r.poster_path,backdropPath:r.backdrop_path,isAnime:l,spoilerFree:Y}));const Z=r.recommendations?r.recommendations.results.slice(0,6):[],X=s==="movie"?T?"Film İzlendi":"İzlendi Olarak İşaretle":R?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle",ie=r.runtime?`
    <span class="badge" style="background: rgba(245, 158, 11, 0.18); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); font-weight: 700; display: inline-flex; align-items: center; gap: 0.35rem;">
      <i data-lucide="clock" style="width:13px; height:13px"></i>
      <span>${Jh(r.runtime)}</span>
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
              <img class="detail-poster-img" src="${f}" alt="${d}" onerror="this.onerror=null; this.src='${cn}';" />
            </div>

            <!-- Content Details -->
            <div class="detail-info-col">
              <!-- Frosted Badges Row -->
              <div class="detail-badge-deck">
                <span class="badge badge-type">${l?o?"ANİME DİZİSİ":"ANİME FİLMİ":s==="tv"?"DİZİ":"FİLM"}</span>
                <span class="badge badge-imdb">
                  <i data-lucide="star" style="width:13px; height:13px; fill: currentColor"></i> ${y} IMDb
                </span>
                <span class="badge badge-letterboxd" title="Letterboxd Derecelendirmesi">
                  <span style="letter-spacing: 0.05em; font-weight: 800;">${ne}</span> ${O}
                </span>
                <span class="badge">${v}</span>
                ${ie}
                ${r.number_of_seasons?`<span class="badge">${r.number_of_seasons} Sezon</span>`:""}
                ${r.number_of_episodes?`<span class="badge">${r.number_of_episodes} Bölüm</span>`:""}
                ${s==="tv"?'<span class="badge" id="detail-next-episode-badge" style="display: none; background: rgba(34, 197, 94, 0.16); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.4); font-weight: 700; align-items: center; gap: 0.35rem;"></span>':""}
                ${!r.runtime&&r.episode_run_time&&r.episode_run_time.length>0?`<span class="badge">${r.episode_run_time[0]} dk / bölüm</span>`:""}
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
                ${k.map(Q=>`<span class="detail-genre-chip">${Q.name}</span>`).join("")}
              </div>

              <!-- Storyline -->
              <div class="detail-storyline-wrapper">
                <p class="detail-storyline truncated" id="detail-storyline-text">${w}</p>
                ${w.length>120?'<button class="btn-storyline-expand" id="btn-expand-storyline"><span>Devamını Oku</span><i data-lucide="chevron-down" style="width:14px;height:14px"></i></button>':""}
              </div>

              ${s==="tv"?'<label class="spoiler-discovery-toggle"><input id="detail-spoiler-free-toggle" type="checkbox" /><span><i data-lucide="shield-check"></i><b>Spoilersız keşfet</b><small>İzleme ilerlemenin sonrasındaki bölüm başlıkları, görselleri ve özetleri gizlenir.</small></span></label>':""}

              <!-- Oyuncular & Sanatçılar (Letterboxd & Pentagram Style Carousel with PC Mouse Scroll & Nav Buttons) -->
              ${z.length>0?`
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
                    ${z.map(Q=>{const $=Q.profile_path?st(Q.profile_path,Ze.POSTER_SMALL):Qn,M=Q.character?Q.character.split("/")[0].trim():"";return`
                        <div class="detail-actor-pill" data-person-id="${Q.id}" data-person-name="${Q.name}" title="${Q.name}${M?" ("+M+")":""} • Filmografiyi Gör" style="cursor: pointer;">
                          <img src="${$}" alt="${Q.name}" class="detail-actor-avatar" onerror="this.onerror=null; this.src='${Qn}';" />
                          <div style="display: flex; flex-direction: column; min-width: 0;">
                            <span class="detail-actor-name">${Q.name}</span>
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
                  <button class="btn-action-tile ${b?"active-fav":""}" id="btn-toggle-fav">
                    <i data-lucide="heart" style="${b?"fill: var(--primary); color: var(--primary)":""}"></i>
                    <span>${b?"Favorilerimde":"Favori"}</span>
                  </button>

                  <button class="btn-action-tile ${E?"active-watch":""}" id="btn-toggle-watchlist">
                    <i data-lucide="${E?"check":"plus"}"></i>
                    <span>${E?"Listemde":"Listem"}</span>
                  </button>

                  <button class="btn-action-tile ${L?"active-watched":""}" id="btn-toggle-watched-detail">
                    <i data-lucide="${L?"check-circle-2":"check"}"></i>
                    <span>${X}</span>
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
          ${s==="tv"&&G?G.html:""}

          ${Z.length>0?`
            <div style="margin-top: 4rem;">
              <h2 class="section-title" style="margin-bottom: 1.5rem;">
                <i data-lucide="thumbs-up"></i> Benzer Önerilen Yapımlar
              </h2>
              <div class="media-grid">
                ${Z.map(Q=>_t(Q)).join("")}
              </div>
            </div>
          `:""}
        </div>
      </section>
    </div>
  `,init:Q=>{if(!Q)return;let $=Gh(s,n);const M=Q.querySelector("#btn-detail-back");M&&M.addEventListener("click",ae=>{ae.preventDefault(),window.history.length>1?window.history.back():window.location.hash="#home"}),G&&G.init(Q);const K=Q.querySelector("#detail-spoiler-free-toggle");K&&(K.checked=Y,K.addEventListener("change",()=>{Y=K.checked,G?.setSpoilerSafe(Y),te(Y?"Spoilersız keşif açıldı. Sonraki bölüm detayları gizlendi.":"Spoilersız keşif kapatıldı.","info")}));const re=Q.querySelector("#btn-play-movie"),le=async()=>{if(!re||re.disabled)return;re.disabled=!0;const ae=re.innerHTML;re.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px;fill:currentColor"></i> <span>Yükleniyor...</span>',V();try{const g=Gt(n,1,1);await Ri({type:l?"anime":"movie",isAnime:l,tmdbId:n,title:d,seriesTitle:d,originalTitle:p,posterPath:r.poster_path,backdropPath:r.backdrop_path,duration:m,currentTime:g?g.currentTime:0,roomSync:$?{roomCode:$.roomCode,mediaId:n,type:s,season:1,episode:1,initialSync:$.initialSync||null}:null})}catch{te("Film açılırken hata oluştu, lütfen tekrar deneyin.","error")}finally{re.disabled=!1,re.innerHTML=ae,V()}};re&&re.addEventListener("click",le);const S=Q.querySelector("#btn-resume-series"),A=async()=>{if(!S||S.disabled)return;S.disabled=!0;const ae=S.innerHTML;S.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px;fill:currentColor"></i> <span>Yükleniyor...</span>',V();try{const g=$;$=null;const c=Vr(n),u=g?.season||(c?c.season:1),_=g?.episode||(c?c.episode:1),I=g?0:c?c.currentTime:0;await Ri({type:l?"anime":"tv",isAnime:l,tmdbId:n,title:`${d} - S${u}E${_}`,seriesTitle:d,originalTitle:p,season:u,episode:_,posterPath:r.poster_path,backdropPath:r.backdrop_path,currentTime:I,seasonsList:r.seasons||[],roomSync:g?{roomCode:g.roomCode,mediaId:n,type:s,season:u,episode:_,initialSync:g.initialSync||null}:null})}catch{te("İçerik açılırken hata oluştu, lütfen tekrar deneyin.","error")}finally{S.disabled=!1,S.innerHTML=ae,V()}};S&&S.addEventListener("click",ae=>{ae.preventDefault(),A()}),$&&window.setTimeout(()=>{s==="movie"?le():A()},0);const q=Q.querySelector("#btn-watch-trailer");q&&q.addEventListener("click",async()=>{q.disabled=!0;const ae=q.innerHTML;q.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px"></i> <span>Yükleniyor...</span>',V();try{const g=await dn(s,n,d);g?kc({title:d,trailerInfo:g,mediaId:n,mediaType:l?"anime":s}):te("Bu yapım için resmi fragman bulunamadı.","info")}catch{te("Fragman yüklenirken bir hata oluştu.","error")}finally{q.disabled=!1,q.innerHTML=ae,V()}});const ee=Q.querySelector("#btn-toggle-fav");ee&&ee.addEventListener("click",()=>{const ae=hd({...r,type:l?"anime":s,isAnime:l,media_type:s});te(ae?"Favorilere eklendi!":"Favorilerden çıkarıldı.",ae?"success":"info");const g=ee.querySelector("i"),c=ee.querySelector("span");g&&c&&(g.style.fill=ae?"var(--primary)":"none",g.style.color=ae?"var(--primary)":"currentColor",c.textContent=ae?"Favorilerimde":"Favorilere Ekle")});const we=Q.querySelector("#btn-toggle-watchlist");we&&we.addEventListener("click",()=>{const ae=ml({...r,type:l?"anime":s,isAnime:l,media_type:s});te(ae?"İzleme listesine eklendi!":"İzleme listesinden çıkarıldı.",ae?"success":"info");const g=we.querySelector("i"),c=we.querySelector("span");g&&c&&(g.setAttribute("data-lucide",ae?"check":"plus"),V(),c.textContent=ae?"Listemde":"İzleme Listeme Ekle")});const se=Q.querySelector("#btn-toggle-watched-detail");se&&se.addEventListener("click",ae=>{if(ae.preventDefault(),s==="movie"){const c=hl(n,1,1,{title:d,posterPath:r.poster_path,backdropPath:r.backdrop_path,type:"movie",duration:m}).completed;te(c?"✓ Film izlendi olarak işaretlendi!":"Film izlendi işareti kaldırıldı.",c?"success":"info"),c?se.classList.add("btn-watched-active"):se.classList.remove("btn-watched-active"),se.innerHTML=`
              <i data-lucide="${c?"check-circle-2":"check"}"></i>
              <span>${c?"Film İzlendi":"İzlendi Olarak İşaretle"}</span>
            `,V()}else{const c=!Wr(n,r.seasons||[]);cd(n,r.seasons||[],c,{title:d,posterPath:r.poster_path,backdropPath:r.backdrop_path,type:l?"anime":"tv",isAnime:l}),te(c?"✓ Dizinin tüm bölümleri izlendi olarak işaretlendi!":"Tüm bölümler izlenmedi yapıldı.",c?"success":"info"),c?se.classList.add("btn-watched-active"):se.classList.remove("btn-watched-active"),se.innerHTML=`
              <i data-lucide="${c?"check-circle-2":"check"}"></i>
              <span>${c?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle"}</span>
            `,V(),Q.querySelectorAll(".episode-card").forEach(_=>{const I=_.querySelector(".badge-watched-status"),P=_.querySelector(".btn-mark-ep-watched");I&&(I.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',I.style.background="var(--accent-green)",I.style.color="#fff",I.style.display=c?"inline-flex":"none"),P&&(c?(P.classList.add("watched"),P.style.background="#10b981",P.style.borderColor="#10b981"):(P.classList.remove("watched"),P.style.background="rgba(0,0,0,0.65)",P.style.borderColor="rgba(255,255,255,0.3)"))});const u=Q.querySelector("#btn-mark-season-all");if(u){const _=u.querySelector("span"),I=u.querySelector("i");_&&(_.textContent=c?"Bu Sezon İzlendi":"Bu Sezonu İzlendi İşaretle"),I&&I.setAttribute("data-lucide",c?"check-circle-2":"check-check"),c?(u.style.background="rgba(16, 185, 129, 0.2)",u.style.borderColor="#10b981",u.style.color="#10b981"):(u.style.background="",u.style.borderColor="",u.style.color="")}V()}});const pe=ae=>{if(ae&&ae.detail&&ae.detail.isProgressUpdate&&document.getElementById("player-modal"))return;const g=s==="movie"?ln(n,1,1):!1,c=s==="tv"?Wr(n,r.seasons||[]):!1,u=s==="movie"?g:c;if(se){u?se.classList.add("btn-watched-active"):se.classList.remove("btn-watched-active");const P=s==="movie"?u?"Film İzlendi":"İzlendi Olarak İşaretle":u?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle";se.innerHTML=`
            <i data-lucide="${u?"check-circle-2":"check"}"></i>
            <span>${P}</span>
          `}const _=Q.querySelector("#btn-play-movie");if(_&&s==="movie"){const P=Gt(n,1,1);if(P&&P.currentTime>0&&!P.completed){const H=ii(P.currentTime);_.innerHTML=`<i data-lucide="play" style="fill:currentColor"></i> <span>Devam Et <span class="play-btn-subinfo">${H}</span></span>`}}const I=Q.querySelector("#btn-resume-series");if(I&&s==="tv"){const P=Vr(n);if(P){const H=ii(P.currentTime);I.innerHTML=`<i data-lucide="play" style="fill:currentColor"></i> <span>Devam Et <span class="play-btn-subinfo">S${P.season} B${P.episode}${H?" • "+H:""}</span></span>`}}V()};window.addEventListener("sineflix_data_changed",pe);const Ge=Q.querySelector("#btn-mark-halfway-detail");Ge&&Ge.addEventListener("click",ae=>{if(ae.preventDefault(),s==="movie"){const g=Math.round(m*.5),c=ii(g);Ta(n,1,1,g,{title:d,posterPath:r.poster_path,backdropPath:r.backdrop_path,type:l?"anime":"movie",isAnime:l,duration:m}),te(`⏳ Film ${c} dakikasında yarıda bırakıldı olarak işaretlendi!`,"info");const u=Q.querySelector("#btn-play-movie span");u&&(u.textContent=`Kaldığın Yerden Devam Et (${c})`)}else{const g=C?C.season:1,c=C?C.episode:1;Ta(n,g,c,1200,{title:d,posterPath:r.poster_path,backdropPath:r.backdrop_path,type:l?"anime":"tv",isAnime:l,duration:3e3}),te(`⏳ S${g} B${c} 20. dakikada yarıda bırakıldı olarak işaretlendi!`,"info");const u=Q.querySelector("#btn-resume-series span");u&&(u.textContent=`Kaldığın Yerden Devam Et (S${g} B${c} • 20:00)`)}});const Je=Q.querySelector("#btn-expand-storyline"),Ue=Q.querySelector("#detail-storyline-text");Je&&Ue&&Je.addEventListener("click",()=>{const ae=!Ue.classList.contains("truncated");Ue.classList.toggle("truncated");const g=Je.querySelector("span"),c=Je.querySelector("i");g&&(g.textContent=ae?"Devamını Oku":"Daralt"),c&&(c.style.transform=ae?"rotate(0deg)":"rotate(180deg)")});const Ie=Q.querySelector("#detail-cast-rail"),De=Q.querySelector("#btn-cast-prev"),ze=Q.querySelector("#btn-cast-next");if(Ie){De&&De.addEventListener("click",_=>{_.preventDefault(),Ie.scrollBy({left:-280,behavior:"smooth"})}),ze&&ze.addEventListener("click",_=>{_.preventDefault(),Ie.scrollBy({left:280,behavior:"smooth"})}),Ie.addEventListener("wheel",_=>{_.deltaY!==0&&(_.preventDefault(),Ie.scrollLeft+=_.deltaY)},{passive:!1});let ae=!1,g=0,c=0;Ie.addEventListener("mousedown",_=>{ae=!0,Ie.classList.add("dragging"),g=_.pageX-Ie.offsetLeft,c=Ie.scrollLeft});const u=()=>{ae=!1,Ie.classList.remove("dragging")};Ie.addEventListener("mouseleave",u),Ie.addEventListener("mouseup",u),Ie.addEventListener("mousemove",_=>{if(!ae)return;_.preventDefault();const P=(_.pageX-Ie.offsetLeft-g)*1.5;Ie.scrollLeft=c-P}),Ie.querySelectorAll(".detail-actor-pill").forEach(_=>{_.addEventListener("click",I=>{I.preventDefault();const P=_.getAttribute("data-person-id"),H=_.getAttribute("data-person-name");P&&Bh(P,H)})})}const We=Q.querySelector("#detail-next-episode-badge");We&&s==="tv"&&(async()=>{try{const ae=await Kh({imdbId:r.external_ids?.imdb_id,title:p||d,year:v});if(!ae?.nextEpisode||!We.isConnected)return;const g=ae.nextLabel||"",c=ae.nextAirdateLabel||"";if(!g&&!c||c==="Yayınlandı")return;const u=[g?`Yeni bölüm ${g}`:"Yeni bölüm",c].filter(Boolean).join(" • ");We.innerHTML=`<i data-lucide="calendar-clock" style="width:13px; height:13px"></i><span>${u}</span>`,We.title=`Sonraki bölüm: ${g||"-"}${ae.nextEpisode.name?" — "+ae.nextEpisode.name:""}${c?" • "+c:""} (Kaynak: TVmaze)`,We.style.display="inline-flex",V(We)}catch{}})();const je=Q.querySelector(".media-grid");je&&kt(je)}}}const Zh="cinepulse_offline_db",Qh=1,Bi="downloads",ef="cinepulse-offline-media-v1";let In=null;function $c(){return In?Promise.resolve(In):new Promise((e,t)=>{const i=indexedDB.open(Zh,Qh);i.onupgradeneeded=n=>{const a=n.target.result;if(!a.objectStoreNames.contains(Bi)){const r=a.createObjectStore(Bi,{keyPath:"key"});r.createIndex("tmdbId","tmdbId",{unique:!1}),r.createIndex("downloadedAt","downloadedAt",{unique:!1})}},i.onsuccess=()=>{In=i.result,e(In)},i.onerror=()=>t(i.error)})}function tf(e,t=null,i=null){return t!==null&&i!==null&&t!==void 0&&i!==void 0?`${e}_s${t}_e${i}`:String(e)}async function nf(){try{const e=await $c();return new Promise((t,i)=>{const r=e.transaction(Bi,"readonly").objectStore(Bi).getAll();r.onsuccess=()=>{const o=r.result||[];o.sort((s,l)=>(l.downloadedAt||0)-(s.downloadedAt||0)),t(o)},r.onerror=()=>i(r.error)})}catch{return[]}}async function rf(e,t=null,i=null){try{const n=tf(e,t,i),a=await $c();return await new Promise((r,o)=>{const d=a.transaction(Bi,"readwrite").objectStore(Bi).delete(n);d.onsuccess=()=>r(),d.onerror=()=>o(d.error)}),"caches"in window&&await(await caches.open(ef)).delete(`/offline/${n}`),window.dispatchEvent(new CustomEvent("cinepulse_offline_changed",{detail:{action:"delete",key:n}})),!0}catch{return!1}}function jo(e,t){const i=ws(e);return`
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
  `}function af(){Be();const e=zs(),t=Wt(),i=Yt(),n=Ns(),a=zn().length,r=Gr().length;let o="continue";if(typeof window<"u"&&window.sessionStorage)try{const l=window.sessionStorage.getItem("cp_lib_active_tab");l&&["continue","completed","favorites","watchlist","all-episodes","downloads"].includes(l)&&(o=l)}catch{}return{html:`
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
          <button class="lib-nav-tab ${o==="downloads"?"active":""}" data-tab="downloads">
            <i data-lucide="download"></i>
            <span>İndirilenler</span>
            <span class="lib-tab-badge" id="tab-count-downloads">0</span>
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

        <!-- Tab 6: Offline Downloads -->
        <div class="tab-content ${o==="downloads"?"":"hidden"}" id="tab-downloads"></div>
      </div>
    </div>
  `,init:l=>{if(!l)return;let d=o,p="all",h="recent",f="";const y=l.querySelector("#lib-search-input"),v=l.querySelector("#lib-search-clear"),w=l.querySelector("#lib-sort-select"),k=l.querySelector("#lib-batch-clear-btn");let m=[];(async()=>{try{m=(await nf()).map(Y=>({id:Y.tmdbId,title:Y.title,poster_path:Y.poster,backdrop_path:Y.backdrop,type:Y.type,isSeries:Y.type==="tv"||Y.season!==null&&Y.episode!==null,season:Y.season||1,episode:Y.episode||1,sizeBytes:Y.sizeBytes,isDownloaded:!0,key:Y.key}));const G=l.querySelector("#tab-count-downloads");G&&(G.textContent=m.length),d==="downloads"&&T()}catch{}})();const E=z=>z==="continue"?zn():z==="completed"?Gr():z==="favorites"?Wt():z==="watchlist"?Yt():z==="all-episodes"?zs():z==="downloads"?m:[],C=z=>z==="downloads"?`
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
          `:z==="continue"?`
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
          `:z==="completed"?`
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
          `:z==="favorites"?`
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
          `:z==="watchlist"?`
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
          `;let x=36;const T=()=>{const z=l.querySelector(`#tab-${d}`);if(!z)return;let Y=E(d).filter(Z=>{const X=(Z.title||Z.name||"").toLowerCase(),ie=ws(Z);return(!f||X.includes(f.toLowerCase()))&&(p==="all"||ie===p)});if(h==="rating-desc"?Y.sort((Z,X)=>{const ie=parseFloat(Z.vote_average||Z.voteAverage||Z.rating||0);return parseFloat(X.vote_average||X.voteAverage||X.rating||0)-ie}):h==="title-asc"?Y.sort((Z,X)=>{const ie=Z.title||Z.name||"",fe=X.title||X.name||"";return ie.localeCompare(fe,"tr")}):h==="year-desc"&&Y.sort((Z,X)=>{const ie=parseInt((Z.release_date||Z.first_air_date||Z.year||"0").substring(0,4),10);return parseInt((X.release_date||X.first_air_date||X.year||"0").substring(0,4),10)-ie}),Y.length===0)z.innerHTML=C(d);else{const Z=Y.slice(0,x),X=Y.length>x;z.innerHTML=`
            <div class="media-grid" id="grid-${d}">
              ${Z.map($=>jo($,d)).join("")}
            </div>
            ${X?`
              <div class="lib-load-more-wrap" style="text-align: center; margin: 2rem 0 1rem;">
                <button id="btn-lib-load-more" class="btn-secondary" style="padding: 0.6rem 1.8rem; border-radius: var(--radius-full); font-size: 0.88rem;">
                  <span>Daha Fazla Göster (${Y.length-x} içerik daha)</span>
                </button>
                <div class="lib-scroll-sentinel" style="height: 1px; margin-top: 1rem;"></div>
              </div>
            `:""}
          `;const ie=z.querySelector(`#grid-${d}`),fe=()=>{const $=ie.querySelectorAll(".library-card-item").length;if($>=Y.length){const S=z.querySelector(".lib-load-more-wrap");S&&S.remove();return}const M=Y.slice($,$+36);x=$+M.length;const K=M.map(S=>jo(S,d)).join("");ie.insertAdjacentHTML("beforeend",K);const re=Y.length-x,le=z.querySelector(".lib-load-more-wrap");if(re>0){const S=le?.querySelector("#btn-lib-load-more span");S&&(S.textContent=`Daha Fazla Göster (${re} içerik daha)`)}else le&&le.remove();zo(M),N(ie),V(ie),kt(ie),pn(ie)},me=z.querySelector("#btn-lib-load-more");me&&me.addEventListener("click",fe);const Q=z.querySelector(".lib-scroll-sentinel");Q&&"IntersectionObserver"in window&&new IntersectionObserver(M=>{M.some(K=>K.isIntersecting)&&fe()},{rootMargin:"400px 0px"}).observe(Q),N(z),zo(Z),kt(z),pn(z)}if(k)if(d==="completed"||d==="all-episodes"||d==="continue"){k.classList.remove("hidden");const Z=k.querySelector("span");Z&&(Z.textContent="Temizle"),d==="completed"?k.title="Tamamlananlar listesini temizle":d==="continue"?k.title="İzlemeye devam et listesini temizle":k.title="Bölüm izleme geçmişini temizle"}else k.classList.add("hidden");V()},R=()=>{x=36,T()},L=l.querySelectorAll("#library-tabs .lib-nav-tab");L.forEach(z=>{z.addEventListener("click",G=>{G.preventDefault();const Y=z.getAttribute("data-tab");if(d===Y)return;if(L.forEach(X=>X.classList.remove("active")),z.classList.add("active"),d=Y,typeof window<"u"&&window.sessionStorage)try{window.sessionStorage.setItem("cp_lib_active_tab",Y)}catch{}l.querySelectorAll(".tab-content").forEach(X=>X.classList.add("hidden"));const Z=l.querySelector(`#tab-${d}`);Z&&Z.classList.remove("hidden"),x=36,T()})});const D=()=>{const z=Ns(),G=l.querySelector("#stat-total-watch")||l.querySelector("#stat-total-time"),Y=l.querySelector("#stat-eps-count")||l.querySelector("#stat-episodes-count"),Z=l.querySelector("#stat-movies-count"),X=l.querySelector("#stat-favs-count");G&&(G.textContent=z.formattedTotal||z.formattedTotalTime||"0 dk"),Y&&(Y.textContent=`${z.totalEpisodes??z.episodesCount??0} Bölüm`),Z&&(Z.textContent=`${z.totalMovies??z.moviesCount??0} Film`),X&&(X.textContent=`${Wt().length+Yt().length} Yapım`);const ie=l.querySelector("#tab-count-continue"),fe=l.querySelector("#tab-count-completed"),me=l.querySelector("#tab-count-favorites"),Q=l.querySelector("#tab-count-watchlist"),$=l.querySelector("#tab-count-all-episodes");ie&&(ie.textContent=zn().length),fe&&(fe.textContent=Gr().length),me&&(me.textContent=Wt().length),Q&&(Q.textContent=Yt().length),$&&($.textContent=Be().length)},N=z=>{z&&z.querySelectorAll(".btn-lib-delete").forEach(G=>{G.addEventListener("click",Y=>{Y.stopPropagation();const Z=G.closest(".library-card-item");if(!Z)return;const X=Z.getAttribute("data-id"),ie=parseInt(Z.getAttribute("data-season")||"1",10),fe=parseInt(Z.getAttribute("data-episode")||"1",10),me=Z.getAttribute("data-tab"),Q=decodeURIComponent(Z.getAttribute("data-title")||"İçerik");let $=`"${Q}" kaydını silmek istediğinize emin misiniz?`;me==="all-episodes"?$=`"${Q}" (Sezon ${ie}, Bölüm ${fe}) izleme geçmişinizden silinsin mi?`:me==="continue"?$=`"${Q}" devam et listesinden kaldırılsın mı?`:me==="completed"?$=`"${Q}" tamamlananlar geçmişinden silinsin mi?`:me==="favorites"?$=`"${Q}" favorilerinizden kaldırılsın mı?`:me==="watchlist"?$=`"${Q}" izleme listenizden kaldırılsın mı?`:me==="downloads"&&($=`"${Q}" indirilmiş içerik cihazınızdan silinsin mi?`),window.confirm($)&&(me==="all-episodes"?yd(X,ie,fe):me==="continue"||me==="completed"?Ea(X):me==="favorites"?fd(X):me==="watchlist"?md(X):me==="downloads"&&(rf(X,ie,fe),m=m.filter(M=>!(M.id===X&&M.season===ie&&M.episode===fe))),te("✓ Kayıt başarıyla silindi.","success"),Z.style.transition="all 0.28s ease-out",Z.style.transform="scale(0.85)",Z.style.opacity="0",setTimeout(()=>{Z.remove(),D()},300))})})};y&&y.addEventListener("input",z=>{f=z.target.value.trim(),v&&(v.style.display=f?"block":"none"),R()}),v&&v.addEventListener("click",()=>{y&&(y.value="",f="",v.style.display="none",R(),y.focus())});const U=l.querySelectorAll("#lib-type-filters .lib-segment-btn");U.forEach(z=>{z.addEventListener("click",()=>{U.forEach(G=>G.classList.remove("active")),z.classList.add("active"),p=z.getAttribute("data-filter")||"all",R()})}),w&&w.addEventListener("change",z=>{h=z.target.value,R()}),k&&k.addEventListener("click",()=>{let z="Bu listedeki tüm kayıtları silmek istediğinize emin misiniz?";d==="completed"?z="Tamamlananlar listesindeki tüm kayıtlar temizlensin mi?":d==="continue"?z="İzlemeye devam et listesindeki tüm yarım kalanlar temizlensin mi?":d==="all-episodes"&&(z="Tüm bölüm izleme geçmişiniz sıfırlansın mı?"),window.confirm(z)&&(d==="completed"||d==="continue"?Ds():d==="all-episodes"&&gd(),te("✓ Liste başarıyla temizlendi.","success"),D(),T())});const j=l.querySelector("#lib-export-btn");j&&j.addEventListener("click",()=>yl());const O=l.querySelector("#lib-import-btn"),B=l.querySelector("#lib-file-input");O&&B&&(O.addEventListener("click",()=>B.click()),B.addEventListener("change",z=>{if(z.target.files&&z.target.files.length>0){const G=z.target.files[0],Y=new FileReader;Y.onload=Z=>{const X=vl(Z.target.result,"merge");X.success?(te(`✓ Yedek başarıyla yüklendi! (${X.countHistory} izleme, ${X.countFavs} favori aktarıldı)`,"success"),D(),T()):te(`Yükleme hatası: ${X.message||X.error}`,"error")},Y.onerror=()=>te("Dosya okunamadı.","error"),Y.readAsText(G)}}));const W=l.querySelector("#lib-data-modal-btn");W&&W.addEventListener("click",()=>Cl()),T(),kt(l),V(),sd().then(()=>{D(),T()}).catch(()=>{});const ne=z=>{z&&z.detail&&z.detail.isProgressUpdate&&document.getElementById("player-modal")||(D(),T())};window.addEventListener("sineflix_data_changed",ne)}}}const Te={currentType:"tv",currentGenreId:null,currentSortBy:"popularity.desc",currentMinRating:0,currentPlatform:null,currentYearRange:"all",currentPage:1,allItems:[],isExhausted:!1};async function sf(e="tv"){e&&e!==Te.currentType&&Te.allItems.length===0&&(Te.currentType=e);let t=Te.currentType,i=Te.currentGenreId,n=Te.currentSortBy,a=Te.currentMinRating,r=Te.currentPlatform,o=Te.currentYearRange,s=!1;const l=[{id:null,name:"Tüm Türler"},{id:gt.MYSTERY,name:"🩸 Korku & Gerilim"},{id:gt.ACTION_ADVENTURE,name:"💥 Aksiyon & Macera"},{id:gt.SCI_FI_FANTASY,name:"🚀 Bilim Kurgu & Fantastik"},{id:gt.DRAMA,name:"🎭 Dram"},{id:gt.COMEDY,name:"😂 Komedi"},{id:gt.CRIME,name:"🕵️ Suç & Polisiye"},{id:gt.ANIMATION,name:"🎌 Animasyon & Anime"},{id:gt.DOCUMENTARY,name:"🌍 Belgesel"},{id:gt.FAMILY,name:"👨‍👩‍👧‍👦 Aile & Gençlik"},{id:gt.WAR_POLITICS,name:"⚔️ Savaş & Politika"},{id:gt.WESTERN,name:"🤠 Western"}],d=[{id:null,name:"Tüm Türler"},{id:Ye.HORROR,name:"🩸 Korku"},{id:Ye.THRILLER,name:"⚡ Gerilim"},{id:Ye.ACTION,name:"💥 Aksiyon"},{id:Ye.ADVENTURE,name:"🗺️ Macera"},{id:Ye.SCI_FI,name:"🚀 Bilim Kurgu"},{id:Ye.FANTASY,name:"🧙‍♂️ Fantastik"},{id:Ye.DRAMA,name:"🎭 Dram"},{id:Ye.COMEDY,name:"😂 Komedi"},{id:Ye.CRIME,name:"🕵️ Suç"},{id:Ye.ANIMATION,name:"🎌 Animasyon"},{id:Ye.MYSTERY,name:"🔍 Gizem"},{id:Ye.ROMANCE,name:"💖 Romantik"},{id:Ye.DOCUMENTARY,name:"🌍 Belgesel"},{id:Ye.HISTORY,name:"🏰 Tarih & Savaş"},{id:Ye.FAMILY,name:"👨‍👩‍👧‍👦 Aile"},{id:Ye.MUSIC,name:"🎵 Müzikal"},{id:Ye.WESTERN,name:"🤠 Western"}],p=()=>t==="movie"?d:l,h=Te.allItems.length>0,f=h?Te.allItems.map(v=>_t(v)).join(""):'<div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">İçerikler yükleniyor...</div>';return{html:`
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
          ${f}
        </div>

        <!-- Scroll Sentinel / Loader -->
        <div id="discover-sentinel" style="height: 60px; display: flex; align-items: center; justify-content: center; margin-top: 2rem; color: var(--text-muted);">
          <i data-lucide="loader-2" class="spin-loader" style="width: 28px; height: 28px; display: none;"></i>
        </div>

      </div>
    </div>
  `,init:v=>{if(!v)return;const w=v.querySelector("#discover-type-tv"),k=v.querySelector("#discover-type-movie"),m=v.querySelector("#discover-type-anime"),b=v.querySelector("#discover-type-doc"),E=v.querySelector("#discover-platform-select"),C=v.querySelector("#discover-year-select"),x=v.querySelector("#discover-sort-select"),T=v.querySelector("#discover-rating-select"),R=v.querySelector("#discover-genre-bar"),L=v.querySelector("#discover-media-grid"),D=v.querySelector("#discover-sentinel"),N=D?D.querySelector(".spin-loader"):null;E&&E.addEventListener("change",()=>{r=E.value||null,Te.currentPlatform=r,B()}),C&&C.addEventListener("change",()=>{o=C.value||"all",Te.currentYearRange=o,B()});const U=()=>{const G=p();R.innerHTML=G.map(Y=>`
          <button class="genre-pill-btn ${i===Y.id?"active":""}" data-genre-id="${Y.id||""}">
            ${Y.name}
          </button>
        `).join(""),R.querySelectorAll(".genre-pill-btn").forEach(Y=>{Y.addEventListener("click",()=>{const Z=Y.dataset.genreId?parseInt(Y.dataset.genreId,10):null;i!==Z&&(i=Z,R.querySelectorAll(".genre-pill-btn").forEach(X=>X.classList.remove("active")),Y.classList.add("active"),B())})})};let j=0;const O=async G=>{const Y=G||j;if(s||Te.isExhausted)return;s=!0,N&&(N.style.display="block");const Z=Te.currentPage||1;try{const X=t==="anime"||t==="documentary"?"tv":t,ie=t==="anime",fe=t==="documentary";let me=n;n==="first_air_date.desc"&&X==="movie"&&(me="primary_release_date.desc");let Q=null,$=null;o==="2024-2026"?(Q=2024,$=2026):o==="2020-2023"?(Q=2020,$=2023):o==="2010-2019"?(Q=2010,$=2019):o==="2000-2009"?(Q=2e3,$=2009):o==="1990-1999"?(Q=1990,$=1999):o==="before-1990"&&(Q=1940,$=1989);const M=await _l({type:X,genreId:i,page:Z,sortBy:me,minRating:a,isAnime:ie,isDoc:fe,yearMin:Q,yearMax:$,withNetworks:r});if(Y!==j)return;if(N&&(N.style.display="none"),!M||M.length===0){Z===1&&(L.innerHTML='<div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted); font-size: 1.05rem;">Bu filtre kriterlerine uygun içerik bulunamadı.</div>'),Te.isExhausted=!0;return}Te.allItems=[...Te.allItems,...M],Te.currentType=t,Te.currentGenreId=i,Te.currentSortBy=n,Te.currentMinRating=a;const K=M.map(re=>_t(re)).join("");Z===1?L.innerHTML=K:L.insertAdjacentHTML("beforeend",K),V(),kt(L),Te.currentPage=Z+1}catch{if(Y!==j)return;N&&(N.style.display="none"),Z===1&&(!Te.allItems||Te.allItems.length===0)&&(L.innerHTML=`
              <div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">
                <p style="margin-bottom: 0.75rem;">İçerikler getirilirken bir sorun oluştu.</p>
                <button id="btn-retry-discover" class="btn-secondary" style="padding: 0.5rem 1.2rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
                  <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
                  <span>Tekrar Dene</span>
                </button>
              </div>
            `,V(),L.querySelector("#btn-retry-discover")?.addEventListener("click",()=>{B()}))}finally{Y===j&&(s=!1,N&&(N.style.display="none"))}},B=()=>{j++;const G=j;Te.currentPage=1,Te.allItems=[],Te.isExhausted=!1,s=!1,L.innerHTML=`
          <div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">
            <div class="spin-loader" style="width: 32px; height: 32px; border: 3px solid rgba(245,158,11,0.2); border-top-color: #f59e0b; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem;"></div>
            <div>İçerikler yükleniyor...</div>
          </div>
        `,N&&(N.style.display="none"),O(G)};U(),h||O();let W=null;D&&"IntersectionObserver"in window&&(W=new IntersectionObserver(G=>{G[0].isIntersecting&&O()},{rootMargin:"0px 0px 600px 0px"}),W.observe(D));const ne=()=>{if(s||Te.isExhausted)return;const G=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||0,Y=window.innerHeight,Z=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);G+Y>=Z-700&&O()};window.addEventListener("scroll",ne,{passive:!0}),window.__discoverCleanup=()=>{W?.disconnect(),window.removeEventListener("scroll",ne)};const z=G=>{t!==G&&(t=G,i=null,[w,k,m,b].forEach(Y=>Y?.classList.remove("active")),G==="tv"&&w?.classList.add("active"),G==="movie"&&k?.classList.add("active"),G==="anime"&&m?.classList.add("active"),G==="documentary"&&b?.classList.add("active"),U(),B())};w&&w.addEventListener("click",()=>z("tv")),k&&k.addEventListener("click",()=>z("movie")),m&&m.addEventListener("click",()=>z("anime")),b&&b.addEventListener("click",()=>z("documentary")),x&&x.addEventListener("change",G=>{n=G.target.value,B()}),T&&T.addEventListener("change",G=>{a=parseFloat(G.target.value),B()})}}}const Si={};function of(e){const i=Ct()?`${e}_kids`:e;return(!Si[i]||Si[i].stale)&&(Si[i]={allItems:[],seenIds:new Set,nextPage:1,isExhausted:!1,stale:!1}),Si[i]}function lf(e){if(Ct())switch(e){case"movie":return Ia;case"anime":return Ra;case"documentary":return Md;case"cartoon":return Ca;default:return Ca}switch(e){case"movie":return ir;case"anime":return nr;case"documentary":return rr;case"cartoon":return er;default:return tr}}async function Yi(e="tv"){const t=Ct(),i=t?`${e}_kids`:e;Si[i]&&(Si[i].stale=!0);const n=of(e),a=t?{tv:["Türkiye’de Popüler Çizgi ve Gençlik Dizileri","monitor-play"],movie:["🎈 Animasyon & Çocuk Filmleri","popcorn"],anime:["Türkiye’de Popüler Çocuk ve Genç Animeleri","cat"],documentary:["🐾 Doğa & Hayvan Belgeselleri","globe"]}:{tv:["Tüm Zamanların En Popüler Dizileri","monitor-play"],cartoon:["Çizgi Dizi Dünyası & Unutulmaz Klasikler","wand-2"],movie:["Tüm Zamanların En Popüler Filmleri","popcorn"],anime:["Türkiye’de En Popüler Animeler","cat"],documentary:["Tüm Zamanların En Çok İzlenen Belgeselleri","globe"]},[r,o]=a[e]||a.tv;return{html:`
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
  `,init:d=>{if(!d)return;const p=d.querySelector("#popular-media-grid"),h=d.querySelector("#popular-sentinel");if(!p)return;kt(p);let f=!1;const y=lf(e),v=()=>{h&&(n.isExhausted?h.innerHTML='<p style="color: var(--text-muted); font-size: 0.9rem;">Tüm popüler içerikler listelendi.</p>':h.innerHTML=`
            <div style="display: flex; align-items: center; gap: 0.6rem; color: var(--text-muted); font-size: 0.9rem;">
              <div class="spin-loader" style="width: 20px; height: 20px; border: 2px solid rgba(245,158,11,0.25); border-top-color: #f59e0b; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
              <span>Daha fazla içerik akıyor...</span>
            </div>
          `)},w=E=>{if(!E||E.length===0)return;const C=[];for(const R of E)R&&R.id&&!n.seenIds.has(R.id)&&(n.seenIds.add(R.id),C.push(R));if(C.length===0)return;n.allItems.push(...C);const x=C.map(R=>_t(R)).join("");p.querySelector(".popular-loading-placeholder")?p.innerHTML=x:p.insertAdjacentHTML("beforeend",x),kt(p),V()},k=async(E=3)=>{if(!(f||n.isExhausted)){f=!0,v();try{const C=n.nextPage,x=Array.from({length:E},(U,j)=>C+j);n.nextPage+=E;let T=0;const R=e==="anime"||e==="cartoon"||t&&e==="tv",L=x.map(U=>y(U).catch(()=>[])),D=await Promise.all(L),N=D.flat().filter(Boolean);if(R){const U=e==="cartoon"?"_cartoonScore":"_turkeyPopularityScore";N.sort((j,O)=>(O[U]||0)-(j[U]||0)),T=N.length,w(N)}else for(const U of D)U&&U.length>0&&(T+=U.length,w(U));N.length===0&&(n.isExhausted=!0),v(),requestAnimationFrame(()=>{if(!n.isExhausted&&document.documentElement.scrollHeight<=window.innerHeight+600){f=!1,k(2);return}})}catch{}finally{f=!1,v()}}};k(1);let m=null;h&&"IntersectionObserver"in window&&(m=new IntersectionObserver(E=>{E[0].isIntersecting&&!f&&!n.isExhausted&&k(2)},{rootMargin:"0px 0px 1500px 0px"}),m.observe(h));const b=()=>{if(f||n.isExhausted)return;const E=window.scrollY||0,C=window.innerHeight,x=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);E+C>=x-1200&&k(2)};window.addEventListener("scroll",b,{passive:!0}),window.__popularListCleanup=()=>{m?.disconnect(),window.removeEventListener("scroll",b)}}}}function cf(){const e=new Set;let t=!1;const i=s=>{t?s():e.add(s)},n=(s,l,d,p)=>{t||(s.addEventListener(l,d,p),i(()=>s.removeEventListener(l,d,p)))},a=new Map,r=s=>{const l=a.get(s);l&&(l(),e.delete(l),a.delete(s))},o=(s,l,d)=>{if(t)return null;const p=globalThis[d?"setInterval":"setTimeout"](()=>{d||r(p),t||s()},l),h=()=>globalThis[d?"clearInterval":"clearTimeout"](p);return a.set(p,h),i(h),p};return{on:n,add:i,setTimeout:(s,l)=>o(s,l,!1),setInterval:(s,l)=>o(s,l,!0),clearTimeout:r,clearInterval:r,dispose(){if(!t){t=!0;for(const s of e)s();e.clear(),a.clear()}}}}function _m(e){const t=globalThis.window?.lucide;if(!(!e||!t?.createElement||!t.icons))for(const i of e.querySelectorAll("[data-lucide]:not(svg)")){const n=i.getAttribute("data-lucide"),a=n.replace(/(^|-)(\w)/g,(l,d,p)=>p.toUpperCase()),r=t.icons[a];if(!r)continue;const o=Object.fromEntries(Array.from(i.attributes,l=>[l.name,l.value]));o.class=`lucide lucide-${n} ${o.class||""}`;const s=t.createElement(r);for(const[l,d]of Object.entries(o))s.setAttribute(l,d);i.replaceWith(s)}}function bt(e,t){const i=(e||"").replace(/ (HD|4K|TV|Kanalı)/gi,"").trim(),n=i.slice(0,5).toUpperCase(),r={"TRT 1":{bg:"linear-gradient(135deg, #b91c1c, #ef4444)",text:"#ffffff",tag:"TRT 1"},ATV:{bg:"linear-gradient(135deg, #c2410c, #f97316)",text:"#ffffff",tag:"ATV"},"SHOW TV":{bg:"linear-gradient(135deg, #6b21a8, #ec4899)",text:"#ffffff",tag:"SHOW"},"NOW TV":{bg:"linear-gradient(135deg, #991b1b, #ef4444)",text:"#ffffff",tag:"NOW"},"STAR TV":{bg:"linear-gradient(135deg, #b91c1c, #dc2626)",text:"#ffffff",tag:"STAR"},"KANAL D":{bg:"linear-gradient(135deg, #0369a1, #0284c7)",text:"#ffffff",tag:"KANAL D"},TV8:{bg:"linear-gradient(135deg, #ea580c, #f97316)",text:"#ffffff",tag:"TV8"},"CNBC-E":{bg:"linear-gradient(135deg, #047857, #10b981)",text:"#ffffff",tag:"CNBC-E"},"A2 TV":{bg:"linear-gradient(135deg, #991b1b, #ea580c)",text:"#ffffff",tag:"A2"},"KANAL 7":{bg:"linear-gradient(135deg, #0284c7, #38bdf8)",text:"#ffffff",tag:"KANAL 7"},"BEYAZ TV":{bg:"linear-gradient(135deg, #881337, #e11d48)",text:"#ffffff",tag:"BEYAZ"},TEVE2:{bg:"linear-gradient(135deg, #ca8a04, #eab308)",text:"#000000",tag:"TEVE2"},"TV 360":{bg:"linear-gradient(135deg, #581c87, #9333ea)",text:"#ffffff",tag:"360"},"TRT HABER":{bg:"linear-gradient(135deg, #831843, #db2777)",text:"#ffffff",tag:"HABER"},"A HABER":{bg:"linear-gradient(135deg, #991b1b, #f97316)",text:"#ffffff",tag:"A HABER"},NTV:{bg:"linear-gradient(135deg, #0369a1, #0284c7)",text:"#ffffff",tag:"NTV"},HABERTÜRK:{bg:"linear-gradient(135deg, #991b1b, #dc2626)",text:"#ffffff",tag:"HTÜRK"},"HALK TV":{bg:"linear-gradient(135deg, #b91c1c, #ef4444)",text:"#ffffff",tag:"HALK"},"S SPORT 1 HD":{bg:"linear-gradient(135deg, #065f46, #10b981)",text:"#ffffff",tag:"S SPORT 1"},"S SPORT 2 HD":{bg:"linear-gradient(135deg, #047857, #34d399)",text:"#ffffff",tag:"S SPORT 2"},"BEIN SPORTS HABER HD":{bg:"linear-gradient(135deg, #4c1d95, #7c3aed)",text:"#ffffff",tag:"BEIN HABER"},"BEIN SPORTS 3 HD":{bg:"linear-gradient(135deg, #3b0764, #6d28d9)",text:"#ffffff",tag:"BEIN 3"},"SPOR SMART 1 HD":{bg:"linear-gradient(135deg, #c2410c, #f97316)",text:"#ffffff",tag:"SMART 1"},"SPOR SMART 2 HD":{bg:"linear-gradient(135deg, #9a3412, #ea580c)",text:"#ffffff",tag:"SMART 2"},"EURO SPORT 1 HD":{bg:"linear-gradient(135deg, #1e3a8a, #2563eb)",text:"#ffffff",tag:"EURO 1"},"EURO SPORT 2 HD":{bg:"linear-gradient(135deg, #172554, #1d4ed8)",text:"#ffffff",tag:"EURO 2"},"TIVIBU SPOR 1 HD":{bg:"linear-gradient(135deg, #0284c7, #06b6d4)",text:"#ffffff",tag:"TİVİBU 1"},"TIVIBU SPOR 2 HD":{bg:"linear-gradient(135deg, #0369a1, #0284c7)",text:"#ffffff",tag:"TİVİBU 2"},"TIVIBU SPOR 3 HD":{bg:"linear-gradient(135deg, #075985, #0369a1)",text:"#ffffff",tag:"TİVİBU 3"},"FX KANALI HD":{bg:"linear-gradient(135deg, #18181b, #27272a)",text:"#fbbf24",tag:"FX"},"SINEMA TV HD":{bg:"linear-gradient(135deg, #713f12, #a16207)",text:"#fef08a",tag:"SINEMA"},"NATIONAL GEOGRAPHIC HD":{bg:"linear-gradient(135deg, #000000, #18181b)",text:"#fbbf24",tag:"NAT GEO"},"DISCOVERY CHANNEL HD":{bg:"linear-gradient(135deg, #0284c7, #06b6d4)",text:"#ffffff",tag:"DISCOVERY"},"DMAX HD":{bg:"linear-gradient(135deg, #111827, #1f2937)",text:"#38bdf8",tag:"DMAX"},"TLC HD":{bg:"linear-gradient(135deg, #831843, #db2777)",text:"#ffffff",tag:"TLC"},"CARTOON NETWORK":{bg:"linear-gradient(135deg, #000000, #27272a)",text:"#ffffff",tag:"CARTOON"},"NICKELODEON HD":{bg:"linear-gradient(135deg, #ea580c, #f97316)",text:"#ffffff",tag:"NICK"}}[i.toUpperCase()]||{bg:"linear-gradient(135deg, #1e293b, #334155)",text:"#ffffff",tag:n},o=`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
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
  </svg>`;return`data:image/svg+xml;utf8,${encodeURIComponent(o)}`}const df=[{id:"all",name:"Tüm Kanallar",icon:"tv"},{id:"favorites",name:"⭐ Favorilerim",icon:"star"},{id:"national",name:"Ulusal & Sinema",icon:"home"},{id:"sports",name:"Spor VIP",icon:"trophy"},{id:"news",name:"Haber",icon:"newspaper"},{id:"doc",name:"Belgesel",icon:"compass"},{id:"kids",name:"Çocuk",icon:"smile"},{id:"music",name:"Müzik",icon:"music"}],va=[{id:"ch_trt1",name:"TRT 1",category:"national",logo:"/tv-logos/trt-1.png",quality:"1080p FHD",streamUrl:"https://tv-trt1.medya.trt.com.tr/master.m3u8"},{id:"ch_atv",name:"ATV",category:"national",logo:"/tv-logos/atv.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/atv/atv_1080p.m3u8"},{id:"ch_showtv",name:"Show TV",category:"national",logo:"/tv-logos/show-tv.png",quality:"1080p FHD",streamUrl:"https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/showtv/showtv.m3u8"},{id:"ch_nowtv",name:"NOW TV",category:"national",logo:"/tv-logos/now-tv.png",quality:"1080p FHD",streamUrl:"https://uycyyuuzyh.turknet.ercdn.net/nphindgytw/nowtv/nowtv.m3u8"},{id:"ch_startv",name:"Star TV",category:"national",logo:"/tv-logos/star-tv.png",quality:"1080p FHD",streamUrl:"https://dygvideo.dygdigital.com/live/hls/startv4puhu/live.m3u8"},{id:"ch_kanald",name:"Kanal D",category:"national",logo:"/tv-logos/kanal-d.png",quality:"1080p FHD",streamUrl:"https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/kanald/kanald.m3u8"},{id:"ch_tv8",name:"TV8",category:"national",logo:"/tv-logos/tv8.png",quality:"480p",streamUrl:"https://rkhubpaomb.turknet.ercdn.net/fwjkgpasof/tv8/tv8_480p.m3u8"},{id:"ch_cnbce",name:"CNBC-e",category:"national",logo:"/tv-logos/cnbc-e.png",quality:"1080p FHD",streamUrl:"https://hnpsechtsc.turknet.ercdn.net/xpnvudnlsv/cnbc-e/cnbc-e.m3u8"},{id:"ch_a2",name:"A2 TV",category:"national",logo:"/tv-logos/a2.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/a2tv/a2tv.m3u8"},{id:"ch_kanal7",name:"Kanal 7",category:"national",logo:"/tv-logos/kanal-7.png",quality:"1080p FHD",streamUrl:"https://kanal7-live.daioncdn.net/kanal7/kanal7.m3u8"},{id:"ch_beyaztv",name:"Beyaz TV",category:"national",logo:"/tv-logos/beyaz-tv.png",quality:"1080p FHD",streamUrl:"https://beyaztv-live.daioncdn.net/beyaztv/beyaztv.m3u8"},{id:"ch_teve2",name:"Teve2",category:"national",logo:"/tv-logos/teve2.png",quality:"1080p FHD",streamUrl:"https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/teve2/teve2.m3u8"},{id:"ch_tv360",name:"TV 360",category:"national",logo:"/tv-logos/tv-360.png",quality:"1080p FHD",streamUrl:"https://turkmedya-live.ercdn.net/tv360/tv360.m3u8"},{id:"ch_trthaber",name:"TRT Haber",category:"news",logo:"/tv-logos/trt-haber.png",quality:"1080p FHD",streamUrl:"https://tv-trthaber.medya.trt.com.tr/master.m3u8"},{id:"ch_ahaber",name:"A Haber",category:"news",logo:"/tv-logos/a-haber.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/ahaber/ahaber.m3u8"},{id:"ch_ntv",name:"NTV",category:"news",logo:"/tv-logos/ntv.png",quality:"1080p FHD",streamUrl:"https://dygvideo.dygdigital.com/live/hls/ntv4puhu/live.m3u8"},{id:"ch_haberturk",name:"Habertürk",category:"news",logo:"/tv-logos/haberturk.png",quality:"1080p FHD",streamUrl:"https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/haberturktv/haberturktv.m3u8"},{id:"ch_halktv",name:"Halk TV",category:"news",logo:"/tv-logos/halk-tv.png",quality:"1080p FHD",streamUrl:"https://halktv-live.daioncdn.net/halktv/halktv.m3u8"},{id:"ch_tele1",name:"Tele1",category:"news",logo:"/tv-logos/tele1.png",quality:"1080p FHD",streamUrl:"https://tele1-live.ercdn.net/tele1/tele1.m3u8"},{id:"ch_tv100",name:"TV 100",category:"news",logo:"/tv-logos/tv100.png",quality:"1080p FHD",streamUrl:"https://tv.ensonhaber.com/tv100/tv100.m3u8"},{id:"ch_bloomberg",name:"Bloomberg HT",category:"news",logo:"/tv-logos/bloomberg-ht.png",quality:"1080p FHD",streamUrl:"https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/bloomberght/bloomberght.m3u8"},{id:"ch_tv24",name:"24 TV",category:"news",logo:"/tv-logos/tv24.png",quality:"1080p FHD",streamUrl:"https://tv.ensonhaber.com/tv24/tv24.m3u8"},{id:"ch_ulketv",name:"Ülke TV",category:"news",logo:"/tv-logos/ulke-tv.png",quality:"1080p FHD",streamUrl:"https://livetv.radyotvonline.net/kanal7live/ulketv/playlist.m3u8"},{id:"tvr_ch_141",tvrId:"141",isTvr:!0,name:"S SPORT 1 HD",category:"sports",logo:"/tv-logos/s-sport-1.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://mariuannastluisborg.autos/hls/ss11/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_140",tvrId:"140",isTvr:!0,name:"S SPORT 2 HD",category:"sports",logo:"/tv-logos/s-sport-2.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://mariuannastluisborg.autos/hls/ss22/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_165",tvrId:"165",isTvr:!0,name:"Bein Sports Haber HD",category:"sports",logo:"/tv-logos/bein-sports-haber.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/bshaber/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_147",tvrId:"147",isTvr:!0,name:"Bein Sports 3 HD",category:"sports",logo:"/tv-logos/bein-sports-3.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://mariuannastluisborg.autos/hls/bein3/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_139",tvrId:"139",isTvr:!0,name:"Spor Smart 1 HD",category:"sports",logo:"/tv-logos/spor-smart-1.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sporsmart/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_138",tvrId:"138",isTvr:!0,name:"Spor Smart 2 HD",category:"sports",logo:"/tv-logos/spor-smart-2.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sporsmart2/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_137",tvrId:"137",isTvr:!0,name:"Euro Sport 1 HD",category:"sports",logo:"/tv-logos/eurosport-1.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://mariuannastluisborg.autos/hls/euro1/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_135",tvrId:"135",isTvr:!0,name:"Euro Sport 2 HD",category:"sports",logo:"/tv-logos/eurosport-2.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://mariuannastluisborg.autos/hls/euro2/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_134",tvrId:"134",isTvr:!0,name:"Tivibu Spor 1 HD",category:"sports",logo:"/tv-logos/tivibu-spor.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/tivibu1/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_133",tvrId:"133",isTvr:!0,name:"Tivibu Spor 2 HD",category:"sports",logo:"/tv-logos/tivibu-spor.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/tivibu2/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_132",tvrId:"132",isTvr:!0,name:"Tivibu Spor 3 HD",category:"sports",logo:"/tv-logos/tivibu-spor.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/tivibu3/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"ch_trtspor",name:"TRT Spor",category:"sports",logo:"/tv-logos/trt-spor.png",quality:"1080p FHD",streamUrl:"https://tv-trtspor1.medya.trt.com.tr/master.m3u8"},{id:"ch_trtspor2",name:"TRT Spor Yıldız",category:"sports",logo:"/tv-logos/trt-spor-yildiz.png",quality:"1080p FHD",streamUrl:"https://tv-trtspor2.medya.trt.com.tr/master.m3u8"},{id:"ch_aspor",name:"A Spor",category:"sports",logo:"/tv-logos/a-spor.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/aspor/aspor.m3u8"},{id:"tvr_ch_128",tvrId:"128",isTvr:!0,name:"FB TV HD",category:"sports",logo:"/tv-logos/fb-tv.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/fbtv/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_127",tvrId:"127",isTvr:!0,name:"NBA TV HD",category:"sports",logo:"/tv-logos/nba-tv.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/nbatv/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_126",tvrId:"126",isTvr:!0,name:"HT Spor HD",category:"sports",logo:"/tv-logos/ht-spor.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/htspor/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_121",tvrId:"121",isTvr:!0,name:"Ekol Sport HD",category:"sports",logo:"/tv-logos/ekol-sport.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/ekolsport/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_65",tvrId:"65",isTvr:!0,name:"FX Kanalı HD",category:"national",logo:"/tv-logos/fx.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/fx/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_61",tvrId:"61",isTvr:!0,name:"Sinema TV HD",category:"national",logo:"/tv-logos/sinema-tv.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinema/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_60",tvrId:"60",isTvr:!0,name:"Sinema TV 2 HD",category:"national",logo:"/tv-logos/sinema-tv-2.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinema2/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_59",tvrId:"59",isTvr:!0,name:"Sinema TV Aksiyon HD",category:"national",logo:"/tv-logos/sinema-aksiyon.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinemaaksiyon2/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_57",tvrId:"57",isTvr:!0,name:"Sinema TV Komedi HD",category:"national",logo:"/tv-logos/sinema-komedi.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinemakomedi/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_56",tvrId:"56",isTvr:!0,name:"Sinema TV Yerli HD",category:"national",logo:"/tv-logos/sinema-yerli.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinemayerli/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_55",tvrId:"55",isTvr:!0,name:"Sinema TV Aile HD",category:"national",logo:"/tv-logos/sinema-aile.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinemaaile/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_53",tvrId:"53",isTvr:!0,name:"Sinema TV 1001 HD",category:"national",logo:"/tv-logos/sinema-1001.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinema1001/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_52",tvrId:"52",isTvr:!0,name:"Sinema TV 1002 HD",category:"national",logo:"/tv-logos/sinema-1002.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinema1002/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_89",tvrId:"89",isTvr:!0,name:"National Geographic HD",category:"doc",logo:"/tv-logos/national-geographic.png",quality:"1080p VIP",streamUrl:""},{id:"tvr_ch_88",tvrId:"88",isTvr:!0,name:"Nat Geo Wild HD",category:"doc",logo:"/tv-logos/nat-geo-wild.png",quality:"1080p VIP",streamUrl:""},{id:"tvr_ch_87",tvrId:"87",isTvr:!0,name:"History Channel HD",category:"doc",logo:"/tv-logos/history.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/history/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_86",tvrId:"86",isTvr:!0,name:"BBC Earth HD",category:"doc",logo:"/tv-logos/bbc-earth.svg",quality:"1080p VIP",streamUrl:""},{id:"tvr_ch_79",tvrId:"79",isTvr:!0,name:"Discovery Channel HD",category:"doc",logo:"/tv-logos/discovery.png",quality:"1080p VIP",streamUrl:""},{id:"tvr_ch_78",tvrId:"78",isTvr:!0,name:"Discovery Science HD",category:"doc",logo:"/tv-logos/discovery-science.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/discs/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_81",tvrId:"81",isTvr:!0,name:"DMAX HD",category:"doc",logo:"/tv-logos/dmax.png",quality:"1080p VIP",streamUrl:"/api/live_tv_stream?channel=dmax"},{id:"tvr_ch_83",tvrId:"83",isTvr:!0,name:"TLC HD",category:"doc",logo:"/tv-logos/tlc.png",quality:"1080p VIP",streamUrl:"/api/live_tv_stream?channel=tlc"},{id:"tvr_ch_85",tvrId:"85",isTvr:!0,name:"Tarih TV HD",category:"doc",logo:"/tv-logos/tarih-tv.svg",quality:"1080p VIP",streamUrl:""},{id:"tvr_ch_84",tvrId:"84",isTvr:!0,name:"DocuBox HD",category:"doc",logo:"/tv-logos/docubox.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/docubox/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_32",tvrId:"32",isTvr:!0,name:"Love Nature 4K",category:"doc",logo:"/tv-logos/love-nature.png",quality:"1080p VIP",streamUrl:""},{id:"tvr_ch_30",tvrId:"30",isTvr:!0,name:"Viasat History HD",category:"doc",logo:"/tv-logos/viasat-history.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/history/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"ch_trtbelgesel",name:"TRT Belgesel",category:"doc",logo:"/tv-logos/trt-belgesel.png",quality:"1080p FHD",streamUrl:"https://tv-trtbelgesel.medya.trt.com.tr/master.m3u8"},{id:"ch_tgrtbelgesel",name:"TGRT Belgesel",category:"doc",logo:bt("TGRT Belgesel"),quality:"1080p FHD",streamUrl:"https://b01c02nl.mediatriple.net/videoonlylive/mtsxxkzwwuqtglive/broadcast_5fe462afc6a0e.smil/playlist.m3u8"},{id:"ch_ciftcitv",name:"Çiftçi TV",category:"doc",logo:bt("Çiftçi TV"),quality:"720p",streamUrl:"https://live.artidijitalmedya.com/artidijital_ciftcitv/ciftcitv/chunks.m3u8"},{id:"ch_kanalv",name:"Kanal V",category:"doc",logo:bt("Kanal V"),quality:"720p",streamUrl:"https://live.artidijitalmedya.com/artidijital_kanalv/kanalv/chunks.m3u8"},{id:"tvr_ch_36",tvrId:"36",isTvr:!0,name:"Cartoon Network",category:"kids",logo:"/tv-logos/cartoon-network.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/cartoonnetwork/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_35",tvrId:"35",isTvr:!0,name:"Nickelodeon HD",category:"kids",logo:"/tv-logos/nickelodeon.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("http://fl1.moveonjoy.com/NICKELODEON/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_33",tvrId:"33",isTvr:!0,name:"Disney Junior",category:"kids",logo:"/tv-logos/disney-channel.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://saran-live.ercdn.net/disneyjunior/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"ch_trtcocuk",name:"TRT Çocuk",category:"kids",logo:"/tv-logos/trt-cocuk.png",quality:"1080p FHD",streamUrl:"https://tv-trtcocuk.medya.trt.com.tr/master.m3u8"},{id:"ch_minikago",name:"Minika GO",category:"kids",logo:"/tv-logos/minika-go.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/minikago/minikago.m3u8"},{id:"ch_trtmuzik",name:"TRT Müzik",category:"music",logo:"/tv-logos/trt-muzik.png",quality:"480p",streamUrl:"https://tv-trtmuzik.medya.trt.com.tr/master_480.m3u8"},{id:"ch_kralpop",name:"Kral Pop",category:"music",logo:"/tv-logos/kral-pop.png",quality:"1080p FHD",streamUrl:"https://dygvideo.dygdigital.com/live/hls/kralpoptv/live.m3u8"},{id:"ch_powerturk",name:"Power Türk",category:"music",logo:"/tv-logos/powerturk.png",quality:"1080p FHD",streamUrl:"https://powerlive.daioncdn.net/powerturktv/powerturktv.m3u8"},{id:"ch_dreamturk",name:"Dream Türk",category:"music",logo:"/tv-logos/dream-turk.png",quality:"1080p FHD",streamUrl:"https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/dreamturk/dreamturk.m3u8"},{id:"ch_tempotv",name:"Tempo TV",category:"music",logo:bt("Tempo TV"),quality:"720p",streamUrl:"https://live.artidijitalmedya.com/artidijital_tempotv/tempotv/chunks.m3u8"}],uf=new Set(["hd","full","izle","seyret","film","dizi","anime","turkce","dublaj","altyazili","sezon","bolum","fragman","filmekseni","ekseni","sezonlukdizi","yabancidizi","dizipal","dizibal"]);function Ko(e){return(e||"").toString().normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("tr-TR").replace(/[ıİ]/g,"i").replace(/\bs\d{1,2}\s*e\d{1,3}\b/g," ").replace(/\b(?:sezon|bolum)\s*\d+\b/g," ").replace(/\b\d+\s*(?:sezon|bolum)\b/g," ").replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(t=>t&&!uf.has(t)&&!/^(?:19|20)\d{2}$/.test(t)).join(" ").trim()}function pf(e,t){if(e===t)return 0;if(!e.length)return t.length;if(!t.length)return e.length;const i=Array.from({length:t.length+1},(n,a)=>a);for(let n=1;n<=e.length;n++){let a=i[0];i[0]=n;for(let r=1;r<=t.length;r++){const o=i[r];i[r]=Math.min(i[r]+1,i[r-1]+1,a+(e[n-1]===t[r-1]?0:1)),a=o}}return i[t.length]}function hf(e,t){const i=Ko(e),n=Ko(t);return!i||!n?0:i===n?1:1-pf(i,n)/Math.max(i.length,n.length)}function Wa(e,t,i=.9){return(Array.isArray(t)?t:[t]).filter(Boolean).some(a=>hf(e,a)>=i)}function Sm(e){return e?(e.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i)?.[1]||e.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g," ")||e.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||"").replace(/\s+\d+\s*\.?\s*sezon\b[\s\S]*$/i,"").replace(/\s+[-|]\s*(?:sezonluk\s*dizi|sezonlukdizi|filmekseni|yabanci\s*dizi)[\s\S]*$/i,"").trim():""}const ff="3508611138826751fdf77beaa6f93eb93fd27e6a5acb910e7aad22665513dd6e",mf="666482389dc76bfa57068407418f7dac9f6c14b6868856b169165b9fac7d812e",ni="4F5A9C3D9A86FA54EACEDDD635185/c3c5bd17-e37b-4b94-a944-8a3688a30452",gf="aLhsnd71BqsMC_HZoT8MR_TrfZS1_WcAzYT5nROaUKI",yf="MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDq5iorf3BOWNqObZFRyco/sa7GrDO5r094yhO1FsWRvwoTRneD1ryv+yVLwJrr0IOmjhD2hgyErvs6XRhAmNa18fcMlHJqHlghHA0dt2FnkFlqlZ029/w1inZ8+g5XFjffNp8Xb5T44PrsowlI5Mjfe0JpkHCN20tLkmGdMUes9yQNbKwpUXvBPq/bLYn8IJNoR/kP/4mis7mMeRzWgIupc9AlFx6HH7IZ6NfYmyqDdo7xdSg+WNl/rcuYcPccuN6dIhqWeceSOFiChaGHJMtuEzbHHefRqbK529eNHVTpUmRtfaZu2a+DRXkoz2TU1KCrnSDuNztvlKjiztiJZMdlAgMBAAECggEACCjTmSw1lfsfKGhk7l7gkCLXa95Kc65Dx/HZCmbOmRf2PSIq/6DjcAd8zatUllFpaU0xCKcyYx+C6Y2XTJMijjJn/v9fFBGWxRuo1vnqP8MzX/Dvg5vMnn1/TSsQeXTznuTSVOmS1qxV+wdUyLvtwFmTPoB+cGcIMAlXK7MtBrSD9kCRcpJZgFNUILhn6ISm9NpaqU+5xBBuJRsXaMDvSUTHi1IKK2ZUneetFAgg6BVE5StmORBjMgXfNRIsD+oOHUvtsEczcHnAP2hW19I0lXfwnLhaAicKIECCDpn6cwfBtQWnSDSENCLMemM2O8KYvAizBW4ET3BZBqSDrZEzRwKBgQD/9o7qbE2LEJ19Mkg+4PTqMJ06bFWKUvUB3JuS4Iu/wy9u6tAU7uQySo9vSDDclG8TaDjkz6c2eTmDy7LdFESwLgiHV6cmpm0sieoTMaz1pVkpykifQo1fv2Q60t/co6oEyUWfmdk3iaK6j3MFhjqRpkmZcUYvBYyuRUv8ewKtcwKBgQDq7tRYL2c6cIznwqTJdLuap3eFRP21ymjV/TTp2DrZtVevw9rNYflDK88mIxZdbbAqPT10zbRc3UnqeE2+76UKBAodUJpSPXg2WvA0hZe57q1VnU7gQhMgvDWRPrTG7qbij+FnRtPHWZ1HGLFfl2DSDnFEVsJo2xXQjw5vMTOBxwKBgQDlbKQQ7t5aRZxD+WvUIGKl/skO8seBYnYFIy226tmYGmVLr+Cuwql7gmUqQ7S4Ibul04cbYBzqsKGixlQd4OroV3qBhUlnVUkJ4NwUNDRpQbm3wX5ycX6yUaSPLTBGXdQo0hc7xPRz2UQooCdizjt1DW1uwZ88ymacVbSUK9XsjQKBgGTNhR8xd8GDeXIX+kzWYYjCQm5UY+gUqVboBkQwG1A+lxk7mC5301QXABMFCxubbPMyw6PSf4k5CfYpGHLMsKvTf+OEKjMPXP01l8txZuDIoGcT0Dw5Hav2FaX0meyhicm8oqKFqWjn8qwG1FSHx2tZ9w+zikcjegC64R6kpc0RAoGAO4/tqaXM5CUUWtHanK/1j6KYbFqsKL13FeqIr8TprF4LXpzrzFAPMCmWL6XFq8JZqZj/KNjH9vvt9f7/9QMvI4nZ+0vXihRqdX7LO+XliGRhuXjHp3RlUU4s8eJt9Af7PCFWFX0gwfM8SnkVUTkE3tOQHgk7hM3PUOPH0yZ+gQ8=",vf="MIIDDDCCAfSgAwIBAgIJYFwVX3W1KCXxMA0GCSqGSIb3DQEBCwUAMBgxFjAUBgNVBAMMDWF0dGVzdF9yc2FfdjEwHhcNMjYwOTA4MTUwMjMyWhcNMjcwOTA4MTUwMjMyWjAYMRYwFAYDVQQDDA1hdHRlc3RfcnNhX3YxMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6uYqK39wTljajm2RUcnKP7Guxqwzua9PeMoTtRbFkb8KE0Z3g9a8r_slS8Ca69CDpo4Q9oYMhK77Ol0YQJjWtfH3DJRyah5YIRwNHbdhZ5BZapWdNvf8NYp2fPoOVxY33zafF2-U-OD67KMJSOTI33tCaZBwjdtLS5JhnTFHrPckDWysKVF7wT6v2y2J_CCTaEf5D_-JorO5jHkc1oCLqXPQJRcehx-yGejX2Jsqg3aO8XUoPljZf63LmHD3HLjenSIalnnHkjhYgoWhhyTLbhM2xx3n0amyudvXjR1U6VJkbX2mbtmvg0V5KM9k1NSgq50g7jc7b5So4s7YiWTHZQIDAQABo1kwVzAMBgNVHRMBAf8EAjAAMA4GA1UdDwEB_wQEAwIFoDAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwGAYDVR0RBBEwD4INYXR0ZXN0X3JzYV92MTANBgkqhkiG9w0BAQsFAAOCAQEAREcHgi7mZGgOpu1jBzN89IJIdMSRjYI5AYwhePByZy7U4SOeqq5WTXPsOZdUjGyib1CJzvs44ro8_L9hLfeJCzNTRk9yyAt_EJ6QHAqdyMIBwNSSb3wDg6N7T4x4MJrgoHJ7uRf2iGEdMfazb2aZFyHQjyt4paUCrix5jt7FXY_02pyEQWPLYQb8U6nf8strd4nNdrm9EPAEF7zY7ZXD5L8egXvTkdmvsBRU5OQLftw1JaPkLu85zMQ2hZtscmCQ2ImxxwBlUqS7V_QmaMFHkdJrWQdXF7vU2Ws0qv3qBU7-FJgqGUSuDMFw7sMeeWuVKvg7WjSxolwPZrqIo6ZSUA";function bf(e){let t="";for(let i=0;i<e.length;i++)t+=String.fromCharCode(e[i]);return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"")}function wf(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");for(;t.length%4;)t+="=";const i=atob(t),n=new Uint8Array(i.length);for(let a=0;a<i.length;a++)n[a]=i.charCodeAt(a);return n}function kf(e){const t=new Uint8Array(e.length/2);for(let i=0;i<t.length;i++)t[i]=parseInt(e.substr(i*2,2),16);return t}function Mc(e){return Array.from(e).map(t=>t.toString(16).padStart(2,"0")).join("")}async function _f(e){const t=new TextEncoder().encode(e),i=await crypto.subtle.digest("SHA-256",t);return Mc(new Uint8Array(i))}async function Sf(e,t){const i=new TextEncoder,n=await crypto.subtle.importKey("raw",i.encode(e),{name:"HMAC",hash:"SHA-256"},!1,["sign"]),a=await crypto.subtle.sign("HMAC",n,i.encode(t));return Mc(new Uint8Array(a))}async function Ya(e,t,i=""){const n=Math.floor(Date.now()/1e3).toString(),a=typeof crypto.randomUUID=="function"?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,l=>{const d=Math.random()*16|0;return(l==="x"?d:d&3|8).toString(16)}),r=await _f(i),o=`${e}
${t}
${n}
${a}
${r}`,s=await Sf(ff,o);return{"user-agent":"okhttp/4.12.0","X-Timestamp":n,"X-Nonce":a,"X-Signature":s,"X-App-Version":"110","X-Client-Id":"rectv-android"}}let Rn=null;async function xf(){if(Rn)return Rn;const e=atob(yf),t=new Uint8Array(e.length);for(let i=0;i<e.length;i++)t[i]=e.charCodeAt(i);return Rn=await crypto.subtle.importKey("pkcs8",t,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},!1,["sign"]),Rn}let yi=null,$n=0;const Ef=typeof window>"u";function Va(e){return Ef?`https://a.prectv70.lol/api${e}`:`/api/rtv${e}`}let Wo=0;async function Tf(){const e=Math.floor(Date.now()/1e3);if(yi&&$n>e+120)return yi;if(typeof localStorage<"u"){const t=localStorage.getItem("rectv_jwt_token"),i=parseInt(localStorage.getItem("rectv_jwt_exp")||"0",10);if(t&&i>e+120)return yi=t,$n=i,t}if(Date.now()-Wo<3e5)return null;try{const i={...await Ya("GET","/api/attest/nonce",""),"x-rtv-path":"/attest/nonce"},n=await fetch(Va("/attest/nonce"),{method:"GET",headers:i});if(!n.ok)throw new Error(`Nonce request failed with status ${n.status}`);const r=(await n.json()).nonce;if(!r)throw new Error("Empty nonce returned");const o=wf(r),s=await xf(),l=await crypto.subtle.sign("RSASSA-PKCS1-v1_5",s,o),d=bf(new Uint8Array(l)),p="/api/attest/verify",h=JSON.stringify({certChain:[vf],nonce:r,pkg:"com.rectv.shot",proof:d,sig:gf}),f={...await Ya("POST",p,h),"x-rtv-path":"/attest/verify","Content-Type":"application/json"},y=await fetch(Va("/attest/verify"),{method:"POST",headers:f,body:h});if(!y.ok)throw new Error(`Verify attestation failed with status ${y.status}`);const v=await y.json();if(!v.jwt)throw new Error("Verify did not return JWT");if(yi=v.jwt,$n=v.exp||e+7200,typeof localStorage<"u")try{localStorage.setItem("rectv_jwt_token",yi),localStorage.setItem("rectv_jwt_exp",$n.toString())}catch{}return yi}catch{return Wo=Date.now(),null}}let Mn=null;async function Af(){if(Mn)return Mn;const e=kf(mf);return Mn=await crypto.subtle.importKey("raw",e,{name:"AES-GCM"},!1,["decrypt"]),Mn}async function Ga(e){if(!e)return"";if(e.startsWith("http://")||e.startsWith("https://"))return e;try{const t=atob(e),i=new Uint8Array(t.length);for(let l=0;l<t.length;l++)i[l]=t.charCodeAt(l);const n=i.slice(0,12),a=i.slice(12),r=await Af(),o=await crypto.subtle.decrypt({name:"AES-GCM",iv:n,tagLength:128},r,a);return new TextDecoder("utf-8").decode(o)}catch{return""}}async function ri(e,t="GET",i=""){let n=null;try{n=await Tf()}catch{}const a=`/api${e}`,o={...await Ya(t,a,i),"x-rtv-path":e,...n?{Authorization:`Bearer ${n}`}:{},...i?{"Content-Type":"application/json"}:{}};try{const s=await fetch(Va(e),{method:t,headers:o,signal:AbortSignal.timeout(6e3),...i?{body:i}:{}});if(s.ok)return await s.json()}catch{}return null}async function xm({type:e="movie",title:t="",originalTitle:i="",season:n=1,episode:a=1,year:r=null}){const o=(t||i||"").trim();if(!o)return[];const s=parseInt(n,10)||1,l=parseInt(a,10)||1;try{let d=await ri(`/search/${encodeURIComponent(o)}/${ni}/`);if((!d||!Array.isArray(d.posters)||d.posters.length===0)&&i&&i.toLowerCase()!==o.toLowerCase()&&(d=await ri(`/search/${encodeURIComponent(i.trim())}/${ni}/`)),!d||!Array.isArray(d.posters)||d.posters.length===0)return[];const p=[o,i].filter(Boolean),h=e==="movie";let f=null;const y=w=>{if(!w)return!1;if(Wa(w,p))return!0;const k=w.split(/\s*[-/:]\s*/).filter(Boolean);for(const m of k)if(Wa(m,p))return!0;return!1};for(const w of d.posters)if((h?w.type==="movie":w.type==="serie")&&y(w.title||w.name||"")){f=w;break}if(!f)return[];const v=[];if(h){if(Array.isArray(f.sources))for(const w of f.sources){if(!w.enc_url&&!w.url)continue;const k=w.enc_url?await Ga(w.enc_url):w.url;if(!k||!k.startsWith("http"))continue;const m=`/api/hls_proxy?url=${encodeURIComponent(k)}&ref=https://a.prectv70.lol/`,E=(w.title||"").toLowerCase().includes("dublaj")||(f.label||"").toLowerCase().includes("dublaj")?"🇹🇷 TVR VIP (TR Dublaj)":"⚡ TVR VIP (TR Altyazı)";v.push({id:`tvr_movie_${f.id}_${w.id}`,name:E,displayName:E,badge:"⚡ TVR VIP",source:"TVR VIP",url:m,streamUrl:m,rawStreamUrl:k,quality:"1080p HD",isHls:!0,isDirectVideo:!0,priority:0,getUrl:()=>m})}}else{const w=await ri(`/season/by/serie/${f.id}/${ni}/`);if(Array.isArray(w))for(const k of w){const m=(k.title||k.name||"").toLowerCase(),b=m.match(/(\d+)/)||[];if((b[1]?parseInt(b[1],10):parseInt(k.number||k.season_number||k.num||"0",10)||1)!==s)continue;const C=m.includes("dublaj")||(k.label||"").toLowerCase().includes("dublaj");let x=Array.isArray(k.episodes)?k.episodes:null;if(!x||x.length===0){const T=await ri(`/episode/by/season/${k.id}/${ni}/`);Array.isArray(T)?x=T:T&&Array.isArray(T.episodes)&&(x=T.episodes)}if(!(!Array.isArray(x)||x.length===0))for(const T of x){const L=(T.title||T.name||"").toLowerCase().match(/(\d+)/)||[];if((L[1]?parseInt(L[1],10):parseInt(T.number||T.episode_number||T.num||"0",10)||1)!==l)continue;let N=Array.isArray(T.sources)?T.sources:Array.isArray(T.videos)?T.videos:Array.isArray(T.streams)?T.streams:[];if(N.length===0&&T.id){const U=await ri(`/source/by/episode/${T.id}/${ni}/`);Array.isArray(U)?N=U:U&&Array.isArray(U.sources)&&(N=U.sources)}for(const U of N){const j=U.enc_url||U.encUrl||U.encrypted_url,O=U.url||U.stream_url||U.video||U.link||U.source;if(!j&&!O)continue;const B=j?await Ga(j):O;if(!B||!B.startsWith("http"))continue;const W=`/api/hls_proxy?url=${encodeURIComponent(B)}&ref=https://a.prectv70.lol/`,z=C||(U.title||U.name||"").toLowerCase().includes("dublaj")?`🇹🇷 TVR S${s}E${l} (TR Dublaj)`:`⚡ TVR S${s}E${l} (TR Altyazı)`;v.push({id:`tvr_ep_${f.id}_${T.id||T.number}_${U.id||B.slice(-8)}`,name:z,displayName:z,badge:"⚡ TVR VIP",source:"TVR VIP",url:W,streamUrl:W,rawStreamUrl:B,quality:"1080p HD",isHls:!0,isDirectVideo:!0,priority:0,getUrl:()=>W})}}}}return v}catch{return[]}}const ba=[{id:"tvr_ch_dmax",tvrId:"dmax",isDaion:!0,name:"DMAX",category:"national",logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/DMAX_Logo_2019.svg/200px-DMAX_Logo_2019.svg.png",quality:"HD Canlı",streamUrl:""},{id:"tvr_ch_tlc",tvrId:"tlc",isDaion:!0,name:"TLC",category:"national",logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/TLC_Logo.svg/200px-TLC_Logo.svg.png",quality:"HD Canlı",streamUrl:""}];async function Cf(){try{const e=await ri(`/channel/by/filtres/0/0/0/${ni}/`);if(!Array.isArray(e))return[...ba];const t=new Map([[1,"sports"],[2,"doc"],[3,"national"],[4,"news"],[5,"music"],[6,"national"],[7,"kids"],[8,"national"]]),i=new Set,n=[];for(const a of e){const r=String(a.id||"").trim();if(!r||i.has(r)||String(a.playas||"1")==="0")continue;i.add(r);const o=Number(a.categories?.[0]?.id||0);n.push({id:`tvr_ch_${r}`,tvrId:r,isTvr:!0,name:a.title||a.name||`TVR ${r}`,category:t.get(o)||"national",logo:a.image||a.poster||"",quality:"1080p TVR",streamUrl:""})}for(const a of ba)n.some(o=>{const s=(o.name||"").toLowerCase();return s===a.name.toLowerCase()||s.includes(a.tvrId)})||n.push(a);return n}catch{return[...ba]}}const Vi=new Map,Pn=new Map,Yo=2*60*1e3;async function Bn(e,{forceRefresh:t=!1}={}){if(!e)return null;const i=String(e).replace(/^tvr_ch_/,"");if(i==="dmax"||i==="tlc"||i==="81"||i==="83"){const r=i==="81"||i==="dmax"?"dmax":"tlc",o=`daion_${r}`,s=Vi.get(o);if(!t&&s&&s.expiresAt>Date.now())return s.url;try{const l=await fetch(`/api/live_tv_stream?channel=${r}&json=1`);if(l.ok){const d=await l.json();if(d&&d.url)return Vi.set(o,{url:d.url,expiresAt:Date.now()+Yo}),d.url}}catch{}return`/api/live_tv_stream?channel=${r}`}const n=Vi.get(i);if(!t&&n&&n.expiresAt>Date.now())return n.url;if(Pn.has(i))return Pn.get(i);t&&Vi.delete(i);const a=(async()=>{try{const r=await ri(`/channel/by/${i}/${ni}/`);if(!r||!Array.isArray(r.sources))return null;const o=r.sources.find(d=>!d.locked&&(d.enc_url||d.url));if(!o)return null;const s=o.enc_url?await Ga(o.enc_url):o.url;if(!s||!s.startsWith("http"))return null;const l=`/api/hls_proxy?url=${encodeURIComponent(s)}&ref=https://a.prectv70.lol/`;return Vi.set(i,{url:l,expiresAt:Date.now()+Yo}),l}catch{return null}})();Pn.set(i,a);try{return await a}finally{Pn.delete(i)}}const yr="cinepulse_epg_live_cache",Pc=30*60*1e3;let wt=null,Vo=0,wa=!1,sn=null;const Lf={ch_cnbce:[{start:"07:00",end:"10:00",title:"Sabah Piyasaları & Finans"},{start:"10:00",end:"14:00",title:"Piyasa Ekranı & Global Trendler"},{start:"14:00",end:"18:00",title:"Kapanışa Doğru"},{start:"18:00",end:"20:00",title:"The Simpsons"},{start:"20:00",end:"21:00",title:"Mad Men"},{start:"21:00",end:"23:00",title:"Game of Thrones Kuşağı"},{start:"23:00",end:"01:00",title:"Late Night Show"},{start:"01:00",end:"07:00",title:"Gece Finans & Belgesel"}],tvr_ch_141:[{start:"08:00",end:"11:00",title:"İtalya Serie A Goller"},{start:"11:00",end:"14:00",title:"EuroLeague Özel Kuşağı"},{start:"14:00",end:"17:00",title:"La Liga Günlüğü & Özetler"},{start:"17:00",end:"20:00",title:"Maç Önü & Canlı Stüdyo"},{start:"20:00",end:"23:00",title:"Canlı Futbol / Basketbol Karşılaşması"},{start:"23:00",end:"02:00",title:"Günün Analizi & Tartışma"},{start:"02:00",end:"08:00",title:"Premier Maç Tekrarları"}],tvr_ch_140:[{start:"08:00",end:"12:00",title:"Formula 1 Özel Kuşağı"},{start:"12:00",end:"15:00",title:"NBA Action & En İyi Hareketler"},{start:"15:00",end:"19:00",title:"Uluslararası Voleybol Ligi"},{start:"19:00",end:"22:00",title:"Canlı Basketbol / Tenis Karşılaşması"},{start:"22:00",end:"01:00",title:"Motorsporları Kuşağı"},{start:"01:00",end:"08:00",title:"Gecenin Tekrarları"}]},Go={sports:[{start:"06:00",end:"09:00",title:"Spor Bülteni & Günün Manşetleri"},{start:"09:00",end:"12:00",title:"Maç Özetleri & Goller Kuşağı"},{start:"12:00",end:"14:00",title:"Öğle Sporu & Transfer Raporu"},{start:"14:00",end:"17:00",title:"Uluslararası Ligler & Analiz"},{start:"17:00",end:"19:00",title:"Maç Önü & Stüdyo Analizi"},{start:"19:00",end:"21:30",title:"Canlı Karşılaşma / Canlı Yayın"},{start:"21:30",end:"23:45",title:"Dev Maç Özel Yayını"},{start:"23:45",end:"02:00",title:"Son Sayfa & Tartışma Programı"},{start:"02:00",end:"06:00",title:"Gecenin Maçları (Tekrar)"}],news:[{start:"06:00",end:"09:00",title:"Güne Başlarken & Sabah Raporu"},{start:"09:00",end:"12:00",title:"Ekonomi ve Politika Gündemi"},{start:"12:00",end:"14:00",title:"Gün Ortası Bülteni"},{start:"14:00",end:"17:00",title:"Sıcak Gelişmeler & Canlı Bağlantılar"},{start:"17:00",end:"19:00",title:"Akşam Bülteni & Manşetler"},{start:"19:00",end:"20:30",title:"Ana Haber Bülteni"},{start:"20:30",end:"23:30",title:"Türkiye'nin Nabzı & Açık Oturum"},{start:"23:30",end:"01:30",title:"Gece Raporu & Dünya Basını"},{start:"01:30",end:"06:00",title:"Gece Bülteni"}],doc:[{start:"06:00",end:"09:00",title:"Vahşi Yaşamın İzinde"},{start:"09:00",end:"12:00",title:"Evrenin Gizemleri ve Uzay"},{start:"12:00",end:"15:00",title:"Mega Yapılar & Mühendislik"},{start:"15:00",end:"18:00",title:"Tarihin Bilinmeyen Sayfaları"},{start:"18:00",end:"20:00",title:"Okyanusların Derinlikleri"},{start:"20:00",end:"22:00",title:"Büyük Kediler: Hayatta Kalma"},{start:"22:00",end:"00:30",title:"Dünyanın En Gizemli Keşifleri"},{start:"00:30",end:"06:00",title:"Gece Belgesel Kuşağı"}],kids:[{start:"06:00",end:"09:00",title:"Sabah Neşesi Çizgi Filmler"},{start:"09:00",end:"12:00",title:"Eğlenceli Maceralar & Kahramanlar"},{start:"12:00",end:"15:00",title:"Sevimli Dostlar & Bilim Zamanı"},{start:"15:00",end:"18:00",title:"Süper Kahramanlar Kuşağı"},{start:"18:00",end:"20:30",title:"Akşam Aile Sineması"},{start:"20:30",end:"22:30",title:"Fantastik Çizgi Dizi"},{start:"22:30",end:"06:00",title:"Gece Masalları"}],music:[{start:"06:00",end:"10:00",title:"Güne Enerjik Başla (Top 20 Pop)"},{start:"10:00",end:"14:00",title:"Hit Müzik & Radyo Şarkıları"},{start:"14:00",end:"18:00",title:"Trendler & En Çok Dinlenenler"},{start:"18:00",end:"21:00",title:"Akşam Ritimleri & Klip Kuşağı"},{start:"21:00",end:"23:30",title:"Canlı Akustik & Popüler Klipler"},{start:"23:30",end:"02:00",title:"Gece Chill & Deep House"},{start:"02:00",end:"06:00",title:"Kesintisiz Gece Müziği"}],national:[{start:"06:00",end:"09:00",title:"Sabah Programı & Magazin"},{start:"09:00",end:"12:00",title:"Gündüz Kuşağı Programı"},{start:"12:00",end:"14:00",title:"Gün Ortası & Yemek Programı"},{start:"14:00",end:"17:00",title:"Popüler Dizi Tekrar Kuşağı"},{start:"17:00",end:"19:00",title:"Yarışma Kuşağı"},{start:"19:00",end:"20:00",title:"Akşam Ana Haber"},{start:"20:00",end:"23:30",title:"Prime Time Sinema / Dizi"},{start:"23:30",end:"02:00",title:"Gece Sineması"},{start:"02:00",end:"06:00",title:"Gece Kuşağı"}]};function Jo(e){if(!e||!e.includes(":"))return 0;const[t,i]=e.split(":").map(Number);return(t||0)*60+(i||0)}function If(){try{const e=(typeof window<"u"&&window.sessionStorage?sessionStorage.getItem(yr):null)||(typeof window<"u"&&window.localStorage?localStorage.getItem(yr):null);if(!e)return null;const t=JSON.parse(e);if(t&&t.channels&&Date.now()-(t.updatedAt||0)<12*3600*1e3)return t.channels}catch{}return null}function Rf(e){try{typeof window<"u"&&window.sessionStorage&&sessionStorage.setItem(yr,JSON.stringify({updatedAt:Date.now(),channels:e})),typeof window<"u"&&window.localStorage&&localStorage.removeItem(yr)}catch{}}async function Xo(e=!1){const t=Date.now();if(!e&&wt&&t-Vo<Pc||wa)return wt;wa=!0;try{let i=null;try{i=await fetch("/api/epg")}catch{}if((!i||!i.ok)&&(i=await fetch("/epg-data.json")),i&&i.ok){const n=await i.json();n&&n.channels&&Object.keys(n.channels).length>0&&(wt=n.channels,Vo=t,Rf(n.channels),window.dispatchEvent(new CustomEvent("epg-updated",{detail:{count:Object.keys(n.channels).length}})))}}catch{}finally{wa=!1}return wt}function $f(){if(!wt){const e=If();e&&(wt=e)}Xo(),sn===null&&(sn=setInterval(()=>{Xo(!0)},Pc))}function Mf(){sn!==null&&(clearInterval(sn),sn=null)}function Dn(e){if(!e)return{title:"Canlı Yayın",timeRange:"Canlı Akış",start:"00:00",end:"23:59",progress:50,remainingMin:30,nextTitle:"Yayın Akışı"};const t=Date.now();if(wt&&wt[e.id]&&wt[e.id].length>0){const r=wt[e.id];for(let s=0;s<r.length;s++){const l=r[s];if(t>=l.startTs&&t<l.endTs){const d=Math.max(1,(l.endTs-l.startTs)/6e4),p=Math.max(0,(t-l.startTs)/6e4),h=Math.min(100,Math.max(0,Math.round(p/d*100))),f=Math.max(1,Math.round((l.endTs-t)/6e4)),y=r[s+1];return{title:l.title,timeRange:`${l.start} - ${l.end}`,start:l.start,end:l.end,progress:h,remainingMin:f,nextTitle:y?y.title:"Sonraki Program"}}}const o=r.find(s=>s.startTs>t);if(o)return{title:o.title,timeRange:`${o.start} - ${o.end}`,start:o.start,end:o.end,progress:5,remainingMin:Math.max(1,Math.round((o.endTs-t)/6e4)),nextTitle:"Yayın Başlamak Üzere"}}const i=new Date,n=i.getHours()*60+i.getMinutes();let a=Lf[e.id];a||(a=Go[e.category]||Go.national);for(let r=0;r<a.length;r++){const o=a[r],s=Jo(o.start);let l=Jo(o.end);l<=s&&(l+=24*60);let d=n;if(s>l-24*60&&n<s&&n<l%(24*60)&&(d+=24*60),d>=s&&d<l){const p=l-s,h=d-s,f=Math.min(100,Math.max(0,Math.round(h/p*100))),y=Math.max(1,l-d),v=a[(r+1)%a.length];return{title:o.title,timeRange:`${o.start} - ${o.end}`,start:o.start,end:o.end,progress:f,remainingMin:y,nextTitle:v?v.title:"Sonraki Program"}}}return{title:`${e.name} Canlı Yayın`,timeRange:"Canlı Akış",start:"00:00",end:"23:59",progress:50,remainingMin:30,nextTitle:"Yayın Akışı Devam Ediyor"}}const Bc="cinepulse_live_favs";function Zo(){try{const e=localStorage.getItem(Bc);return e?JSON.parse(e):[]}catch{return[]}}function Pf(e){try{localStorage.setItem(Bc,JSON.stringify(e))}catch{}}function Bf(){const e=Ct(),t=b=>String(b||"").toLocaleUpperCase("tr-TR").replace(/\b(?:HD|FHD|4K|KANALI)\b/g,"").replace(/[^A-ZÇĞİÖŞÜ0-9]/g,""),i=[...va],n=e?i.filter(b=>b.category==="kids"):i;let a=e?"kids":"all",r=e?n.find(b=>b.id==="ch_trtcocuk")||n[0]:i.find(b=>b.id==="ch_trt1")||i[0],o="",s=null,l=!1,d=1,p=null,h=null;function f(b){return Zo().includes(b)}function y(b){let E=Zo();E.includes(b)?(E=E.filter(C=>C!==b),te("Favorilerden çıkarıldı","info")):(E.push(b),te("Favorilere eklendi ⭐","success")),Pf(E),k()}function v(){return n.filter(b=>{let E=!0;a==="favorites"?E=f(b.id):a!=="all"&&(E=b.category===a);const C=!o||b.name.toLowerCase().includes(o.toLowerCase());return E&&C})}function w(b){return n.findIndex(E=>E.id===b.id)}let k=()=>{};return{html:`
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
              ${df.map(b=>`
                <button class="tv-cat-filter-btn ${b.id===a?"active":""}" data-cat="${b.id}">
                  <i data-lucide="${b.icon}" style="width:14px;height:14px;"></i>
                  <span>${b.name}</span>
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
  `,init:b=>{if(!b)return;$f();const E=cf(),{setTimeout:C,clearTimeout:x,setInterval:T,clearInterval:R}=E,L=b.querySelector("#tv-video"),D=b.querySelector("#tv-screen"),N=b.querySelector("#tv-hero-player-section"),U=b.querySelector("#tv-screen-placeholder"),j=b.querySelector("#tv-screen-backdrop");b.querySelector("#tv-osd-topbar");const O=b.querySelector("#tv-top-logo"),B=b.querySelector("#tv-top-name"),W=b.querySelector("#tv-top-num"),ne=b.querySelector("#tv-top-epg-title"),z=b.querySelector("#tv-top-epg-prog");b.querySelector("#tv-pip-header");const G=b.querySelector("#tv-pip-logo"),Y=b.querySelector("#tv-pip-name"),Z=b.querySelector("#tv-pip-epg"),X=b.querySelector("#tv-pip-expand"),ie=b.querySelector("#tv-pip-close"),fe=b.querySelector("#tv-osd"),me=b.querySelector("#tv-osd-logo"),Q=b.querySelector("#tv-osd-name"),$=b.querySelector("#tv-osd-quality"),M=b.querySelector("#tv-osd-chnum"),K=b.querySelector("#tv-osd-epg-sub"),re=b.querySelector("#tv-loading"),le=b.querySelector("#tv-error"),S=b.querySelector("#tv-retry-btn"),A=b.querySelector("#tv-error-next-btn"),q=b.querySelector("#tv-btn-play-pause"),ee=b.querySelector("#tv-btn-prev-ch"),we=b.querySelector("#tv-btn-next-ch"),se=b.querySelector("#tv-btn-sync"),pe=b.querySelector("#tv-btn-mute"),Ge=b.querySelector("#tv-volume-slider"),Je=b.querySelector("#tv-btn-reload"),Ue=b.querySelector("#tv-btn-fullscreen"),Ie=b.querySelector("#tv-btn-quality"),De=b.querySelector("#tv-quality-badge"),ze=b.querySelector("#tv-quality-menu"),We=b.querySelector("#tv-quality-options"),je=b.querySelector("#tv-btn-numpad"),ae=b.querySelector("#tv-numpad-modal"),g=b.querySelector("#tv-numpad-modal-backdrop"),c=b.querySelector("#tv-numpad-close"),u=b.querySelector("#tv-pad-display-val"),_=b.querySelector("#tv-pad-display-sub"),I=b.querySelector("#tv-numpad-hud"),P=b.querySelector("#tv-numpad-hud-digits"),H=b.querySelector("#tv-numpad-hud-name"),ue=b.querySelector("#tv-channel-grid"),Le=b.querySelector("#tv-search"),Se=b.querySelector("#tv-search-clear"),ge=b.querySelector("#tv-category-strip"),xe=b.querySelector("#tv-cat-prev"),xs=b.querySelector("#tv-cat-next"),Es=b.querySelector("#tv-guide-count");function vn(){const F=w(r)+1,J=Dn(r);B&&(B.textContent=r.name),W&&(W.textContent=`CH ${String(F).padStart(2,"0")}`),ne&&(ne.textContent=`${J.title} (${J.timeRange})`),z&&(z.textContent=`%${J.progress}`),O&&(O.src=r.logo,O.onerror=()=>{O.onerror=null,O.src=bt(r.name,r.category)}),Y&&(Y.textContent=r.name),Z&&(Z.textContent=`${J.title} (%${J.progress})`),G&&(G.src=r.logo,G.onerror=()=>{G.onerror=null,G.src=bt(r.name,r.category)})}function Ts(){vn(),ue&&ue.querySelectorAll(".tv-grid-card").forEach(J=>{const ye=J.getAttribute("data-id"),be=i.find(Re=>Re.id===ye);if(!be)return;const ce=Dn(be),Oe=J.querySelector(".tv-epg-title"),Ae=J.querySelector(".tv-epg-time"),nt=J.querySelector(".tv-epg-bar-fill"),oe=J.querySelector(".tv-epg-pct");Oe&&Oe.textContent!==ce.title&&(Oe.textContent=ce.title,Oe.title=ce.title),Ae&&Ae.textContent!==ce.timeRange&&(Ae.textContent=ce.timeRange),nt&&(nt.style.width=`${ce.progress}%`),oe&&oe.textContent!==`%${ce.progress}`&&(oe.textContent=`%${ce.progress}`)})}const Or=()=>{Ts()};E.on(window,"epg-updated",Or);let As=T(()=>{if(!document.body.contains(b)){R(As),window.removeEventListener("epg-updated",Or);return}Ts()},2e4);function Fc(){h&&x(h);const F=w(r),J=Dn(r);me&&(me.src=r.logo,me.onerror=()=>{me.onerror=null,me.src=bt(r.name,r.category)}),Q&&(Q.textContent=r.name),$&&($.textContent=r.quality),M&&(M.textContent=String(F+1).padStart(2,"0")),K&&(K.textContent=`📺 ${J.title} • %${J.progress} tamamlandı`),fe.classList.remove("hidden"),fe.classList.add("tv-osd-show"),h=C(()=>{fe.classList.remove("tv-osd-show"),fe.classList.add("tv-osd-hide"),C(()=>{fe.classList.add("hidden"),fe.classList.remove("tv-osd-hide")},350)},2500)}function bn(){D.classList.add("user-active"),p&&x(p),p=C(()=>{D.classList.remove("user-active"),ze&&ze.classList.add("hidden")},3500)}D.addEventListener("mousemove",bn),D.addEventListener("touchstart",bn,{passive:!0}),j&&(j.addEventListener("click",F=>{F.stopPropagation(),D.classList.contains("user-active")?(D.classList.remove("user-active"),p&&x(p),ze&&ze.classList.add("hidden")):bn()}),j.addEventListener("dblclick",F=>{F.stopPropagation(),Ue&&Ue.click()}));function zi(F){F=Math.max(0,Math.min(1,F)),d=F,L.volume=F,Ge&&(Ge.value=F),F===0?(l=!0,L.muted=!0,pe&&(pe.innerHTML='<i data-lucide="volume-x" style="width:18px;height:18px;color:#ef4444;"></i>')):(l=!1,L.muted=!1,pe&&(pe.innerHTML='<i data-lucide="volume-2" style="width:18px;height:18px;"></i>')),V()}Ge&&Ge.addEventListener("input",F=>{zi(parseFloat(F.target.value))}),pe&&pe.addEventListener("click",F=>{F.stopPropagation(),l?(zi(d||.8),te("Ses açıldı","info")):(L.muted=!0,l=!0,pe.innerHTML='<i data-lucide="volume-x" style="width:18px;height:18px;color:#ef4444;"></i>',V(),te("Sessize alındı","info"))}),q&&q.addEventListener("click",F=>{F.stopPropagation(),L.paused?(L.play(),q.innerHTML='<i data-lucide="pause" style="width:18px;height:18px;"></i>'):(L.pause(),q.innerHTML='<i data-lucide="play" style="width:18px;height:18px;"></i>'),V()}),se&&se.addEventListener("click",F=>{F.stopPropagation(),s&&L.seekable&&L.seekable.length>0?(L.currentTime=L.seekable.end(L.seekable.length-1),L.play(),te("Canlı yayına eşitlendi","info")):Zt(r)});function Nr(F){if(!We||!De)return;if(!F||!F.levels||F.levels.length<=1){De.textContent=r.quality?r.quality.split(" ")[0]:"HD",We.innerHTML=`
            <button class="tv-quality-opt active" data-level="-1">
              <i data-lucide="check" style="width:13px;height:13px;color:#fbbf24;"></i>
              <span>Kaynak Kalite (${r.quality||"1080p"})</span>
            </button>
          `,V();return}const J=F.levels,ye=F.currentLevel;let be=`
          <button class="tv-quality-opt ${ye===-1?"active":""}" data-level="-1">
            ${ye===-1?'<i data-lucide="check" style="width:13px;height:13px;color:#fbbf24;"></i>':'<span style="width:13px;display:inline-block;"></span>'}
            <span>Otomatik (Adaptive)</span>
          </button>
        `;if(J.forEach((ce,Oe)=>{const Ae=ce.height||(ce.attrs&&ce.attrs.RESOLUTION?ce.attrs.RESOLUTION.height:720),nt=Ae>=1080?"1080p FHD":Ae>=720?"720p HD":Ae>=480?"480p SD":`${Ae}p`,oe=ye===Oe;be+=`
            <button class="tv-quality-opt ${oe?"active":""}" data-level="${Oe}">
              ${oe?'<i data-lucide="check" style="width:13px;height:13px;color:#fbbf24;"></i>':'<span style="width:13px;display:inline-block;"></span>'}
              <span>${nt}</span>
            </button>
          `}),We.innerHTML=be,ye===-1)De.textContent="AUTO";else if(J[ye]){const ce=J[ye].height;De.textContent=ce?`${ce}p`:"HD"}We.querySelectorAll(".tv-quality-opt").forEach(ce=>{ce.addEventListener("click",Oe=>{Oe.stopPropagation();const Ae=parseInt(ce.dataset.level,10);if(s){s.currentLevel=Ae,Nr(s),ze&&ze.classList.add("hidden");const nt=ce.querySelector("span").textContent;te(`Kalite ayarlandı: ${nt}`,"success")}})}),V()}Ie&&ze&&(Ie.addEventListener("click",F=>{F.stopPropagation(),ze.classList.toggle("hidden"),bn()}),E.on(document,"click",F=>{F.target.closest("#tv-quality-wrapper")||ze.classList.add("hidden")}));let wn=!1;function Cs(){if(!N||!U||!D||document.fullscreenElement)return;const J=N.getBoundingClientRect().bottom<80;J&&L&&!L.paused&&!wn?D.classList.contains("is-floating-pip")||(D.classList.add("is-floating-pip"),U.classList.add("is-active"),vn()):J||D.classList.contains("is-floating-pip")&&(D.classList.remove("is-floating-pip"),U.classList.remove("is-active"),wn=!1)}E.on(window,"scroll",Cs,{passive:!0}),X&&X.addEventListener("click",F=>{F.stopPropagation(),N&&N.scrollIntoView({behavior:"smooth",block:"start"})}),ie&&ie.addEventListener("click",F=>{F.stopPropagation(),wn=!0,D.classList.remove("is-floating-pip"),U.classList.remove("is-active")});let He="",zr=null;function Hr(F){if(F>=0&&F<i.length){const J=i[F];te(`Kanal ${F+1}: ${J.name}`,"info"),Zt(J),N&&N.scrollIntoView({behavior:"smooth",block:"start"})}else te(`Kanal ${F+1} bulunamadı`,"warning");He="",I&&I.classList.add("hidden"),ae&&ae.classList.add("hidden")}function Ls(){if(!I||!P||!H)return;const F=parseInt(He,10),J=i[F-1];P.textContent=He.padStart(2,"0"),H.textContent=J?J.name:"Geçersiz Kanal",I.classList.remove("hidden"),u&&(u.textContent=He.padStart(2,"0")),_&&(_.textContent=J?J.name:"Geçersiz Kanal"),zr&&x(zr),zr=C(()=>{He&&Hr(F-1)},1300)}je&&ae&&je.addEventListener("click",F=>{F.stopPropagation(),He="",u&&(u.textContent="--"),_&&(_.textContent="Numara tuşlayın"),ae.classList.toggle("hidden")}),c&&c.addEventListener("click",()=>{ae.classList.add("hidden"),He=""}),g&&g.addEventListener("click",()=>{ae.classList.add("hidden"),He=""}),ae&&ae.querySelectorAll(".tv-num-key").forEach(F=>{F.addEventListener("click",J=>{J.stopPropagation();const ye=F.dataset.digit;if(ye==="clear")He="",u&&(u.textContent="--"),_&&(_.textContent="Numara tuşlayın");else if(ye==="ok"){if(He){const be=parseInt(He,10);Hr(be-1)}}else He.length>=2&&(He=""),He+=ye,Ls()})});let Qe=0;async function Zt(F){const J=++Qe;if(r=F,wn=!1,vn(),Fc(),jc(),s){try{s.stopLoad(),s.detachMedia(),s.destroy()}catch{}s=null}if(L)try{L.pause(),L.removeAttribute("src"),L.load()}catch{}re.classList.remove("hidden"),le.classList.add("hidden");const ye=()=>{Qe===J&&(re.classList.add("hidden"),le.classList.add("hidden"))};L.addEventListener("loadeddata",ye,{once:!0}),C(()=>{L.removeEventListener("loadeddata",ye),Qe===J&&L.readyState<2&&oe()},2e4);let be=!1,ce=0,Oe=!1,Ae=!1;async function nt(Ee){if(be||!F.isTvr||!F.tvrId)return!1;be=!0,re.classList.remove("hidden"),le.classList.add("hidden");try{const Pe=await Bn(F.tvrId,{forceRefresh:!0});if(Qe!==J)return!0;if(Pe&&Pe!==Ee)return F.streamUrl=Pe,Lt(Pe),!0}catch{}return!1}function oe(){Qe===J&&(re.classList.add("hidden"),le.classList.remove("hidden"))}function Re(Ee){if(Oe||!/^https?:\/\//i.test(Ee))return!1;Oe=!0;const Pe=`${new URL(Ee).origin}/`,qi=`/api/hls_proxy?url=${encodeURIComponent(Ee)}&ref=${encodeURIComponent(Pe)}`;return F.streamUrl=qi,Lt(qi),!0}function Lt(Ee){if(Qe===J)if(St.isSupported()){if(s){try{s.stopLoad(),s.detachMedia(),s.destroy()}catch{}s=null}const Pe=new St({enableWorker:!0,lowLatencyMode:!0,startLevel:0,capLevelToPlayerSize:!0,backBufferLength:10,maxBufferLength:8,maxMaxBufferLength:15,liveSyncDurationCount:2,liveMaxLatencyDurationCount:5,manifestLoadingTimeOut:12e3,manifestLoadingMaxRetry:1,manifestLoadingRetryDelay:350,levelLoadingTimeOut:14e3,levelLoadingMaxRetry:1,fragLoadingTimeOut:12e3});s=Pe,Pe.loadSource(Ee),Pe.attachMedia(L),Pe.on(St.Events.MANIFEST_PARSED,()=>{if(Qe!==J){try{Pe.stopLoad(),Pe.detachMedia(),Pe.destroy()}catch{}return}Nr(Pe),L.play().catch(()=>{})}),Pe.on(St.Events.ERROR,(qi,jr)=>{if(!(Qe!==J||s!==Pe)&&jr.fatal)if(jr.type===St.ErrorTypes.NETWORK_ERROR)F.isTvr&&F.tvrId?nt(Ee).then(Ms=>{!Ms&&!Re(Ee)&&oe()}):ce<1?(ce+=1,re.classList.remove("hidden"),C(()=>{Qe===J&&s===Pe&&Lt(Ee)},700)):Re(Ee)||oe();else if(jr.type===St.ErrorTypes.MEDIA_ERROR)if(Ae)oe();else{Ae=!0;try{Pe.recoverMediaError()}catch{oe()}}else oe()})}else L.canPlayType("application/vnd.apple.mpegurl")?(L.src=Ee,L.addEventListener("loadedmetadata",()=>{Qe===J&&(Nr(null),L.play().catch(()=>{}))},{once:!0}),L.addEventListener("error",()=>{Qe===J&&nt(Ee).then(Pe=>{!Pe&&!Re(Ee)&&oe()})},{once:!0})):oe()}let St;try{St=(await ls(async()=>{const{default:Ee}=await import("./hls-BuERnqCp.js");return{default:Ee}},[],import.meta.url)).default}catch{oe();return}Qe===J&&(F.isTvr&&F.tvrId&&!F.streamUrl?Bn(F.tvrId).then(Ee=>{Qe===J&&(Ee?(F.streamUrl=Ee,Lt(Ee)):oe())}).catch(()=>{Qe===J&&oe()}):(Lt(F.streamUrl),F.isTvr&&F.tvrId&&Bn(F.tvrId).then(Ee=>{Ee&&(F.streamUrl=Ee)}).catch(()=>{})),L.muted=l,L.volume=d)}function Hi(F){const J=v();if(J.length===0)return;const ye=J.findIndex(ce=>ce.id===r.id);let be;F==="prev"||F==="up"?be=ye<=0?J.length-1:ye-1:be=ye>=J.length-1?0:ye+1,Zt(J[be])}ee&&ee.addEventListener("click",F=>{F.stopPropagation(),Hi("prev")}),we&&we.addEventListener("click",F=>{F.stopPropagation(),Hi("next")}),A&&A.addEventListener("click",()=>Hi("next")),S&&S.addEventListener("click",()=>Zt(r)),Je&&Je.addEventListener("click",()=>{te("Yayın yeniden yükleniyor...","info"),Zt(r)});function Uc(){const F=v();if(Es&&(Es.textContent=`${F.length} KANAL`),F.length===0){ue.innerHTML=`
            <div class="tv-catalog-empty-state">
              <i data-lucide="radio" style="width:40px;height:40px;color:var(--text-muted);"></i>
              <span class="tv-empty-title">Kanal Bulunamadı</span>
              <p class="tv-empty-sub">Arama teriminizi veya kategori filtrenizi değiştirin.</p>
            </div>
          `,V();return}ue.innerHTML=F.map(J=>{const ye=J.id===r.id,be=f(J.id),ce=w(J)+1,Oe=bt(J.name,J.category),Ae=Dn(J);return`
            <div class="tv-grid-card ${ye?"active":""}" data-id="${J.id}">
              <div class="tv-grid-card-top">
                <span class="tv-grid-num">${String(ce).padStart(2,"0")}</span>
                <button class="tv-grid-fav-btn ${be?"is-fav":""}" data-favid="${J.id}" title="${be?"Favorilerden Çıkar":"Favorilere Ekle"}">
                  <i data-lucide="star" style="width:15px;height:15px;${be?"fill:#fbbf24;color:#fbbf24;":""}"></i>
                </button>
              </div>

              <div class="tv-grid-logo-box">
                <img class="tv-grid-logo" src="${J.logo}" alt="${J.name}" onerror="this.onerror=null; this.src='${Oe}';" loading="lazy" />
              </div>

              <div class="tv-grid-info">
                <span class="tv-grid-name" title="${J.name}">${J.name}</span>
                <div class="tv-grid-meta">
                  <span class="tv-grid-quality">${J.quality}</span>
                  ${J.isTvr?'<span class="tv-grid-vip-tag">VIP</span>':""}
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
          `}).join(""),ue.querySelectorAll(".tv-grid-card").forEach(J=>{J.addEventListener("click",ye=>{if(ye.target.closest(".tv-grid-fav-btn"))return;const be=i.find(ce=>ce.id===J.dataset.id);be&&be.id!==r.id&&(Zt(be),N&&N.scrollIntoView({behavior:"smooth",block:"start"}))})}),ue.querySelectorAll(".tv-grid-fav-btn").forEach(J=>{J.addEventListener("click",ye=>{ye.stopPropagation(),y(J.dataset.favid)})}),V()}function jc(){ue&&ue.querySelectorAll(".tv-grid-card").forEach(F=>{const J=F.dataset.id===r.id;F.classList.toggle("active",J);const ye=F.querySelector(".tv-grid-live-indicator");if(!J&&ye&&ye.remove(),J&&!ye){const be=document.createElement("div");be.className="tv-grid-live-indicator",be.innerHTML='<span class="tv-live-dot"></span><span>ŞU AN İZLENİYOR</span>',F.appendChild(be)}})}if(k=()=>{Uc(),vn(),V()},Le&&Le.addEventListener("input",F=>{o=F.target.value.trim(),Se&&Se.classList.toggle("hidden",!o),k()}),Se&&Se.addEventListener("click",()=>{Le.value="",o="",Se.classList.add("hidden"),k()}),ge){xe&&xe.addEventListener("click",ce=>{ce.stopPropagation(),ge.scrollBy({left:-220,behavior:"smooth"})}),xs&&xs.addEventListener("click",ce=>{ce.stopPropagation(),ge.scrollBy({left:220,behavior:"smooth"})}),ge.addEventListener("wheel",ce=>{Math.abs(ce.deltaY)>Math.abs(ce.deltaX)&&(ce.preventDefault(),ge.scrollLeft+=ce.deltaY)},{passive:!1});let F=!1,J=0,ye=0,be=!1;ge.addEventListener("mousedown",ce=>{ce.button===0&&(F=!0,be=!1,J=ce.pageX-ge.offsetLeft,ye=ge.scrollLeft)}),E.on(window,"mousemove",ce=>{if(!F)return;const Ae=(ce.pageX-ge.offsetLeft-J)*1.5;Math.abs(Ae)>6&&(be=!0,ge.classList.add("is-dragging")),ge.scrollLeft=ye-Ae}),E.on(window,"mouseup",()=>{F&&(F=!1,ge.classList.remove("is-dragging"),C(()=>{be=!1},50))}),ge.querySelectorAll(".tv-cat-filter-btn").forEach(ce=>{ce.addEventListener("click",Oe=>{if(be){Oe.preventDefault();return}ge.querySelectorAll(".tv-cat-filter-btn").forEach(Ae=>Ae.classList.remove("active")),ce.classList.add("active"),a=ce.dataset.cat,ce.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"}),k()})})}Ue&&Ue.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen().catch(()=>{}):D.requestFullscreen().catch(()=>{})}),E.on(document,"fullscreenchange",()=>{const F=!!document.fullscreenElement;D.classList.toggle("is-fullscreen",F),Ue&&(Ue.innerHTML=F?'<i data-lucide="minimize-2" style="width:18px;height:18px;"></i>':'<i data-lucide="maximize-2" style="width:18px;height:18px;"></i>',V())});function Is(F){if(document.activeElement!==Le){if(F.key>="0"&&F.key<="9"){He.length>=2&&(He=""),He+=F.key,Ls();return}if(F.key==="Enter"&&He){F.preventDefault();const J=parseInt(He,10);Hr(J-1);return}switch(F.key){case"ArrowUp":case"w":case"W":F.preventDefault(),Hi("prev");break;case"ArrowDown":case"s":case"S":F.preventDefault(),Hi("next");break;case"ArrowRight":F.preventDefault(),zi(d+.05);break;case"ArrowLeft":F.preventDefault(),zi(d-.05);break;case"m":case"M":pe&&pe.click();break;case"f":case"F":Ue&&Ue.click();break;case"r":case"R":Je&&Je.click();break;case" ":F.preventDefault(),q&&q.click();break}}}E.on(document,"keydown",Is);let qr=null,Fr=!1;const Rs=()=>{if(E.dispose(),Mf(),Qe++,R(As),qr&&R(qr),window.removeEventListener("epg-updated",Or),window.removeEventListener("scroll",Cs),s){try{s.stopLoad(),s.detachMedia(),s.destroy()}catch{}s=null}if(L)try{L.pause(),L.removeAttribute("src"),L.load()}catch{}document.removeEventListener("keydown",Is)};window.__LiveTvController={cleanup:Rs};const Ur=new MutationObserver(()=>{document.contains(b)||(Rs(),Ur.disconnect())});Ur.observe(document.body,{childList:!0,subtree:!0}),E.add(()=>Ur.disconnect()),k(),Zt(r),zi(1);const $s=async()=>{if(!(Fr||!document.contains(b))){Fr=!0;try{const F=await Cf();if(!document.contains(b)||!Array.isArray(F))return;const J=new Set(va.map(oe=>t(oe.name))),ye=new Set(va.filter(oe=>oe.tvrId).map(oe=>String(oe.tvrId))),be=F.filter(oe=>{const Re=t(oe.name);return Re&&!J.has(Re)&&!ye.has(String(oe.tvrId))}),ce=await Promise.all(be.map(async oe=>{const Re=await Bn(oe.tvrId,{forceRefresh:!0});if(!Re)return null;const Lt=i.find(Ee=>Ee.isDynamicTvr&&String(Ee.tvrId)===String(oe.tvrId)),St={...oe,isDynamicTvr:!0,streamUrl:Re,logo:oe.logo||bt(oe.name,oe.category)};return Lt?(Object.assign(Lt,St),Lt):St}));if(!document.contains(b))return;const Oe=ce.filter(Boolean),Ae=new Set(Oe.map(oe=>oe.id));let nt=!1;for(let oe=i.length-1;oe>=0;oe--){const Re=i[oe];Re.isDynamicTvr&&!Ae.has(Re.id)&&Re.id!==r.id&&(i.splice(oe,1),nt=!0)}for(const oe of Oe)i.some(Re=>Re.id===oe.id)||(i.push(oe),nt=!0);if(e){for(let oe=n.length-1;oe>=0;oe--){const Re=n[oe];Re.isDynamicTvr&&!Ae.has(Re.id)&&Re.id!==r.id&&n.splice(oe,1)}for(const oe of Oe.filter(Re=>Re.category==="kids"))n.some(Re=>Re.id===oe.id)||n.push(oe)}nt&&k()}catch{}finally{Fr=!1}}};$s(),qr=T($s,30*1e3)}}}const Df=3e4,Of=10*6e4,Nf=5,zf=6e4;let Br=0,on=!1,vr=0,Gn=0,br=0;function Hf(){Br=Date.now()+Df}function qf(){return Dc()||Br>Date.now()}function Dc(){return on&&vr<=Date.now()&&(on=!1,vr=0),on}function Ff(){on=!0,vr=Date.now()+Of,Br=0,Gn=0,br=0}function Uf(){on=!1,vr=0,Br=0}function Ja(){return Math.max(0,Math.ceil((br-Date.now())/1e3))}function jf(){return br>Date.now()||(Gn+=1,Gn>=Nf&&(Gn=0,br=Date.now()+zf)),Ja()}async function Kf(){if(!Dc())return{html:`
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
      `,init:n=>{const a=n.querySelector("#admin-login-form"),r=n.querySelector("#admin-pin-input"),o=n.querySelector("#admin-login-error");a.addEventListener("submit",s=>{s.preventDefault();const l=r.value.trim(),d=Ja();if(d>0){o.textContent=`Çok fazla hatalı deneme. ${d} saniye sonra tekrar deneyin.`,o.style.display="block";return}if(Jc(l))Ff(),window.dispatchEvent(new CustomEvent("cinepulse_admin_state_changed"));else{const p=jf();o.textContent=p>0?`Çok fazla hatalı deneme. ${p} saniye bekleyin.`:"Geçersiz PIN kodu!",o.style.display="block",r.classList.add("admin-input-error"),setTimeout(()=>r.classList.remove("admin-input-error"),400),r.value=""}}),V(n)}};const t=wr();Vt();const i=ft();return{html:`
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
    `,init:n=>{const a=n.querySelector("#admin-lock-btn");a&&a.addEventListener("click",()=>{Uf(),window.location.hash="#home"});const r=n.querySelector("#admin-save-site-settings");r&&r.addEventListener("click",()=>{const h=n.querySelector("#admin-setting-landscape")?.checked===!0,f=n.querySelector("#admin-setting-hover")?.checked===!0,y=n.querySelector("#admin-setting-trailers")?.checked===!0,v=n.querySelector("#admin-setting-autoplay-next")?.checked===!0,w=n.querySelector("#admin-setting-subtitles")?.checked===!0,k=n.querySelector("#admin-setting-resolution")?.value||"1080p";gl({cardLayout:h?"landscape":"portrait",hoverPreviewsEnabled:f,trailersEnabled:y,autoplayNext:v,subtitlesEnabled:w,preferredResolution:k}),document.documentElement.classList.toggle("cards-landscape",h),alert("Tüm profil kontrolleri uygulandı.")});const o=n.querySelector("#admin-add-block-form"),s=n.querySelector("#admin-block-input");o&&s&&o.addEventListener("submit",h=>{h.preventDefault();const f=s.value.trim();f&&(Xc(f),an(),window.location.reload())}),n.querySelectorAll(".admin-tag-del-btn").forEach(h=>{h.addEventListener("click",()=>{const f=h.getAttribute("data-entry");f&&(Zc(f),an(),window.location.reload())})});const l=n.querySelector("#admin-change-pin-form"),d=n.querySelector("#admin-new-pin");l&&d&&l.addEventListener("submit",h=>{h.preventDefault();const f=d.value.trim();f.length>=4&&(Gc(f),alert("Yönetici PIN kodu başarıyla güncellendi!"),d.value="")});const p=n.querySelector("#admin-clear-cache-btn");p&&p.addEventListener("click",()=>{sessionStorage.clear(),an(),alert("Sistem önbelleği başarıyla temizlendi."),window.location.reload()}),V(n)}}}const ci="https://dramadizilerim.com";function Wf(e){return e?e.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-"):""}function Qo(e){return e?e.toLowerCase().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9]/g,""):""}async function li(e,t={}){const i=typeof window<"u";let n=e;if(i)if(e.startsWith("http"))try{const a=new URL(e);n=`/api/ddz${a.pathname}${a.search}`}catch{n=e}else n=`/api/ddz${e.startsWith("/")?"":"/"}${e}`;else n.startsWith("http")||(n=`${ci}${n.startsWith("/")?"":"/"}${n}`);try{const a=await fetch(n,{...t,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Referer:ci,...t.headers||{}},signal:AbortSignal.timeout(t.timeout||6e3)}).catch(()=>null);if(a&&a.ok)return a}catch{}return null}function fn(e){if(!e)return"";try{if(e.includes("image_proxy.php?url=")){const t=e.match(/url=([^&]+)/);if(t)return decodeURIComponent(t[1])}}catch{}return e}async function Oc(e){if(!e||typeof e!="string"||e.trim().length<2)return[];const t=e.trim(),i=`/search?q=${encodeURIComponent(t)}`,n=await li(i);if(!n)return[];const a=await n.text().catch(()=>"");if(!a)return[];const r=[],o=/<a[^>]+href=["'](?:https:\/\/dramadizilerim\.com)?\/dizi\/([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;let s;for(;(s=o.exec(a))!==null;){const l=s[1],d=s[2],p=d.match(/alt=["']([^"']+)["']/i)||d.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i),h=p?p[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():l,f=d.match(/src=["']([^"']+)["']/i),y=f?fn(f[1].replace(/&amp;/g,"&")):"",v=h.toLowerCase().includes("dublaj");r.some(w=>w.slug===l)||r.push({title:h,slug:l,poster:y,isDubbed:v,url:`${ci}/dizi/${l}`})}return r}async function Yf(){const e=await li("/");if(!e)return[];const t=await e.text().catch(()=>"");if(!t)return[];const i=[],n=/<a[^>]+href=["'](?:https:\/\/dramadizilerim\.com)?\/dizi\/([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;let a;for(;(a=n.exec(t))!==null;){const r=a[1],o=a[2],s=o.match(/src=["']([^"']+)["']/i),l=o.match(/alt=["']([^"']+)["']/i)||o.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i),d=l?l[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():r,p=s?fn(s[1].replace(/&amp;/g,"&")):"",h=d.toLowerCase().includes("dublaj");i.some(f=>f.slug===r)||i.push({slug:r,title:d,poster:p,isDubbed:h,badge:h?"🇹🇷 DUBLAJ":"TR ALTYAZI",url:`${ci}/dizi/${r}`})}return i}async function ka({page:e=1,query:t=""}={}){if(t&&t.trim().length>=2)return Oc(t);const i=e>1?`/dizi?page=${e}`:"/dizi",n=await li(i);if(!n)return[];const a=await n.text().catch(()=>"");if(!a)return[];const r=[],o=/<a[^>]+href=["'](?:https:\/\/dramadizilerim\.com)?\/dizi\/([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;let s;for(;(s=o.exec(a))!==null;){const l=s[1],d=s[2],p=d.match(/src=["']([^"']+)["']/i),h=d.match(/alt=["']([^"']+)["']/i)||d.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i),f=h?h[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():l,y=p?fn(p[1].replace(/&amp;/g,"&")):"",v=f.toLowerCase().includes("dublaj");r.some(w=>w.slug===l)||r.push({slug:l,title:f,poster:y,isDubbed:v,badge:v?"🇹🇷 DUBLAJ":"TR ALTYAZI",url:`${ci}/dizi/${l}`})}return r}async function Vf(e){if(!e)return null;const t=await li(`/dizi/${e}`);if(!t)return null;const i=await t.text().catch(()=>"");if(!i)return null;const n=i.match(/<h1[^>]*>(.*?)<\/h1>/i),a=n?n[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():e,r=i.match(/<p class=["'][^"']*description[^"']*["'][^>]*>([\s\S]*?)<\/p>/i)||i.match(/<div class=["'][^"']*synopsis[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)||i.match(/<meta name=["']description["'] content=["']([^"']+)["']/i),o=r?r[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():"Bu kısa dizi için henüz açıklama girilmedi.",s=i.match(/<div class=["'][^"']*poster[^"']*["'][^>]*>[\s\S]*?<img[^>]+src=["']([^"']+)["']/i)||i.match(/<img[^>]+class=["'][^"']*spotlight[^"']*["'][^>]+src=["']([^"']+)["']/i),l=s?fn(s[1].replace(/&amp;/g,"&")):"",d=/<a[^>]+href=["'](?:\/izle\/|https:\/\/dramadizilerim\.com\/izle\/)([a-zA-Z0-9_-]+)\?s=(\d+)&e=(\d+)["'][^>]*>([\s\S]*?)<\/a>/gi,p=[];let h;for(;(h=d.exec(i))!==null;){const f=parseInt(h[2],10)||1,y=parseInt(h[3],10)||1,v=h[4],w=v.match(/class=["']wp-enum["']>([^<]+)</i)||v.match(/alt=["']([^"']+)["']/i),k=w?w[1].trim():`Bölüm ${y}`,m=v.match(/src=["']([^"']+)["']/i),b=m?fn(m[1].replace(/&amp;/g,"&")):"";p.some(E=>E.season===f&&E.episode===y)||p.push({season:f,episode:y,title:k,thumb:b})}return p.sort((f,y)=>f.season-y.season||f.episode-y.episode),{slug:e,title:a,poster:l,description:o,isDubbed:a.toLowerCase().includes("dublaj"),totalEpisodes:p.length,episodes:p}}async function Em({titles:e=[],seriesTitle:t="",season:i=1,episode:n=1,isDub:a=!0}){const r=[...new Set([...e,t])].filter(C=>C&&typeof C=="string"&&C.trim().length>1);if(r.length===0)return[];const o=parseInt(i,10)||1,s=parseInt(n,10)||1;let l=null,d=null;for(const C of r){const x=Wf(C),T=`/izle/${x}?s=${o}&e=${s}`,R=await li(T,{method:"HEAD",timeout:3500});if(R&&R.ok){l=x;break}}if(!l)for(const C of r){const x=await Oc(C);if(x.length>0){for(const L of x)if(Wa(L.title,r,.75)){l=L.slug,d=L;break}if(l)break;const T=Qo(C),R=x.find(L=>{const D=Qo(L.title);return D===T||D.includes(T)||T.includes(D)});if(R){l=R.slug,d=R;break}}}if(!l)return[];const p=`/izle/${l}?s=${o}&e=${s}`,h=await li(p);if(!h)return[];const f=await h.text().catch(()=>"");if(!f)return[];const y=f.match(/(?:data-src|src)=["']([^"']*embed\.php[^"']*)["']/i);if(!y)return[];let v=y[1].replace(/&amp;/g,"&");v.startsWith("http")||(v=`${ci}${v.startsWith("/")?"":"/"}${v}`);const w=await li(v,{headers:{Referer:`${ci}${p}`}});if(!w)return[];const k=await w.text().catch(()=>"");if(!k)return[];const m=[],b=k.match(/let\s+source\s*=\s*["']([^"']+)["']/);let E=b&&b[1].startsWith("http")?b[1]:null;if(!E){const C=k.match(/https?:\/\/[^"'\s\\]+\.(?:m3u8|mp4)[^"'\s\\]*/);C&&(E=C[0])}if(E){const C=E.includes(".m3u8")||E.includes("mpegurl"),R=(d?.title||l).toLowerCase().includes("dublaj")||a===!0?`🇹🇷 DDZ VIP S${o}E${s} (TR Dublaj)`:`⚡ DDZ VIP S${o}E${s} (TR Altyazı)`;m.push({id:`ddz_ep_${l}_${o}_${s}`,name:R,displayName:R,badge:"🎭 DDZ VIP",source:"DDZ VIP",url:E,streamUrl:E,rawStreamUrl:E,quality:"1080p HD",isHls:C,isDirectVideo:!0,priority:2,getUrl:()=>E})}return m}async function Gf(e=null,t=""){let i=t?"search":"trending",n=t||"",a=1,r=[],o=null,s="";const l=[{id:"trending",label:"Trendler",icon:"flame",query:""},{id:"all",label:"Tüm Katalog",icon:"layers",query:""},{id:"dubbed",label:"Türkçe Dublaj",icon:"sparkles",query:"dublaj"},{id:"patron",label:"CEO & Patron",icon:"briefcase",query:"patron"},{id:"kurt",label:"Kurt & Alfa",icon:"moon",query:"kurt"},{id:"intikam",label:"İntikam & Aşk",icon:"heart-crack",query:"intikam"},{id:"milyarder",label:"Milyarder",icon:"crown",query:"milyarder"},{id:"evlilik",label:"Yasak Aşk & Evlilik",icon:"ring",query:"evlilik"}];return{html:`
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
  `,init:async p=>{const h=p.querySelector("#drama-view-root");if(!h)return;const f=h.querySelector("#drama-search-input"),y=h.querySelector("#btn-drama-search-clear");h.querySelector("#drama-search-feedback");const v=h.querySelectorAll(".drama-chip"),w=h.querySelector("#drama-section-title"),k=h.querySelector("#drama-counter-badge"),m=h.querySelector("#drama-cards-grid"),b=h.querySelector("#drama-load-more-wrap"),E=h.querySelector("#btn-drama-load-more"),C=h.querySelector("#drama-detail-modal"),x=h.querySelector("#drama-modal-dialog");let T=null;async function R(O=!1){O||(m.innerHTML=Array.from({length:12}).map(()=>`
            <div class="drama-card-skeleton">
              <div class="skeleton-poster"></div>
              <div class="skeleton-title"></div>
            </div>
          `).join(""),k.textContent="Yükleniyor...");try{let B=[];if(n&&n.trim().length>=2)B=await ka({query:n.trim()}),w.innerHTML=`
              <i data-lucide="search" style="width: 20px; height: 20px; color: #a855f7;"></i>
              <span>"${n}" İçin Arama Sonuçları</span>
            `,b.classList.add("hidden");else{const W=l.find(ne=>ne.id===i)||l[0];i==="trending"?(B=await Yf(),w.innerHTML=`
                <i data-lucide="flame" style="width: 20px; height: 20px; color: #f43f5e;"></i>
                <span>Trend Kısa Diziler</span>
              `,b.classList.add("hidden")):i==="all"?(B=await ka({page:a}),w.innerHTML=`
                <i data-lucide="layers" style="width: 20px; height: 20px; color: #3b82f6;"></i>
                <span>Tüm Kısa Diziler Kataloğu (Sayfa ${a})</span>
              `,b.classList.toggle("hidden",B.length===0)):W.query&&(B=await ka({query:W.query}),w.innerHTML=`
                <i data-lucide="${W.icon}" style="width: 20px; height: 20px; color: #c084fc;"></i>
                <span>${W.label} Serileri</span>
              `,b.classList.add("hidden"))}O?r=[...r,...B]:r=B,L()}catch{m.innerHTML=`
            <div class="drama-empty-state">
              <i data-lucide="alert-circle" style="width: 44px; height: 44px; color: #ef4444;"></i>
              <h3>Diziler yüklenirken bir sorun oluştu</h3>
              <p>Lütfen internet bağlantınızı kontrol edip tekrar deneyin.</p>
              <button class="btn-primary" id="btn-drama-retry">Tekrar Dene</button>
            </div>
          `,h.querySelector("#btn-drama-retry")?.addEventListener("click",()=>R(!1)),V(m)}finally{}}function L(){if(!r||r.length===0){m.innerHTML=`
            <div class="drama-empty-state">
              <i data-lucide="film" style="width: 48px; height: 48px; color: #94a3b8;"></i>
              <h3>Eşleşen Kısa Dizi Bulunamadı</h3>
              <p>Farklı bir anahtar kelime ile arama yapabilir veya Trend kategorisine göz atabilirsiniz.</p>
            </div>
          `,k.textContent="0 Dizi",V(m);return}k.textContent=`${r.length} Dizi`,m.innerHTML=r.map((O,B)=>{const W=O.isDubbed||O.title.toLowerCase().includes("dublaj"),ne=O.poster||"";return`
            <article class="drama-card" data-slug="${O.slug}" tabindex="0" role="button" aria-label="${O.title}">
              <div class="drama-card-poster-wrap">
                ${ne?`
                  <img 
                    src="${ne}" 
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
                <h3 class="drama-card-title" title="${O.title}">${O.title}</h3>
                <div class="drama-card-meta">
                  <span>Reels Series</span>
                  <span>•</span>
                  <span>1080p HD</span>
                </div>
              </div>
            </article>
          `}).join(""),V(m),m.querySelectorAll(".drama-card").forEach(O=>{O.addEventListener("click",()=>{const B=O.getAttribute("data-slug");B&&D(B)}),O.addEventListener("keydown",B=>{if(B.key==="Enter"||B.key===" "){B.preventDefault();const W=O.getAttribute("data-slug");W&&D(W)}})})}async function D(O){if(O){o=null,C.classList.remove("hidden"),document.body.style.overflow="hidden",x.innerHTML=`
          <div class="drama-detail-loading">
            <div class="spin-loader"></div>
            <span>Dizi bilgileri ve bölümler yükleniyor...</span>
          </div>
        `,V(x);try{const B=await Vf(O);if(!B){x.innerHTML=`
              <div class="drama-empty-state">
                <i data-lucide="alert-circle" style="width: 38px; height: 38px; color: #ef4444;"></i>
                <h3>Dizi bilgisi alınamadı</h3>
                <button class="btn-primary" id="btn-close-drama-modal">Kapat</button>
              </div>
            `,h.querySelector("#btn-close-drama-modal")?.addEventListener("click",U),V(x);return}o=B,N()}catch{U(),te("Dizi detayları yüklenemedi.","error")}}}function N(){if(!o)return;const{slug:O,title:B,poster:W,description:ne,episodes:z=[],isDubbed:G}=o,Y=z.length,Z=s?z.filter(ie=>ie.title.toLowerCase().includes(s)||String(ie.episode).includes(s)):z;x.innerHTML=`
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
                  <span class="drama-badge-pill ${G?"badge-dub":"badge-sub"}">
                    ${G?"🇹🇷 TÜRKÇE DUBLAJ":"TR ALTYAZI"}
                  </span>
                  <span class="drama-badge-pill badge-type">MİNİ DİZİ</span>
                  <span class="drama-badge-pill badge-ep-count">${Y} BÖLÜM</span>
                  <span class="drama-badge-pill badge-server">DDZ VIP HLS</span>
                </div>
                <h2 class="drama-detail-title">${B}</h2>
                <p class="drama-detail-desc">${ne||"Bu kısa dizi için henüz özet girilmedi."}</p>
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
              ${Z.map(ie=>{const fe=ln(`ddz_${O}`,ie.season,ie.episode);return`
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
        `,V(x),x.querySelector("#btn-close-drama-modal")?.addEventListener("click",U),x.querySelector("#btn-play-drama-start")?.addEventListener("click",()=>{z.length>0&&j(z[0].season,z[0].episode)}),x.querySelector("#btn-share-drama")?.addEventListener("click",()=>{const ie=`${window.location.origin}${window.location.pathname}#dramas?slug=${O}`;navigator.clipboard?.writeText(ie).then(()=>{te("Dizi bağlantısı panoya kopyalandı!","success")}).catch(()=>{te(`Bağlantı: ${ie}`,"info")})});const X=x.querySelector("#drama-ep-filter-input");X&&X.addEventListener("input",ie=>{s=ie.target.value.toLowerCase().trim(),N(),x.querySelector("#drama-ep-filter-input")?.focus()}),x.querySelectorAll(".drama-ep-card").forEach(ie=>{ie.addEventListener("click",()=>{const fe=parseInt(ie.getAttribute("data-season"),10)||1,me=parseInt(ie.getAttribute("data-episode"),10)||1;j(fe,me)})})}function U(){C.classList.add("hidden"),document.body.style.overflow="",o=null,s=""}C.addEventListener("click",O=>{O.target===C&&U()});function j(O=1,B=1){if(!o)return;const{slug:W,title:ne,poster:z,episodes:G=[]}=o;Ri({type:"tv",tmdbId:`ddz_${W}`,title:`${ne} - B${B}`,seriesTitle:ne,season:O,episode:B,posterPath:z,backdropPath:z,maxEpisodes:G.length,seasonsList:[{season_number:O,episode_count:G.length}]})}f?.addEventListener("input",O=>{const B=O.target.value;y.classList.toggle("hidden",!B),clearTimeout(T),T=setTimeout(()=>{n=B.trim(),a=1,i=n?"search":"trending",v.forEach(W=>W.classList.toggle("active",!n&&W.getAttribute("data-tab-id")==="trending")),R(!1)},350)}),f?.addEventListener("keydown",O=>{O.key==="Enter"&&(O.preventDefault(),clearTimeout(T),n=f.value.trim(),a=1,R(!1))}),y?.addEventListener("click",()=>{f.value="",y.classList.add("hidden"),n="",i="trending",v.forEach(O=>O.classList.toggle("active",O.getAttribute("data-tab-id")==="trending")),R(!1)}),v.forEach(O=>{O.addEventListener("click",()=>{const B=O.getAttribute("data-tab-id");i===B&&!n||(i=B,n="",f&&(f.value=""),y?.classList.add("hidden"),a=1,v.forEach(W=>W.classList.toggle("active",W===O)),R(!1))})}),E?.addEventListener("click",()=>{a++,R(!0)}),await R(!1),e&&D(e)}}}const _a=[{id:"user-circle",icon:"user",label:"Klasik",color:"#f59e0b"},{id:"clapperboard",icon:"clapperboard",label:"Sinema",color:"#ec4899"},{id:"film",icon:"film",label:"Yıldız",color:"#8b5cf6"},{id:"sparkles",icon:"sparkles",label:"Sihirli",color:"#10b981"},{id:"tv",icon:"tv",label:"Dizi Kolik",color:"#3b82f6"},{id:"baby",icon:"baby",label:"Çocuk",color:"#38bdf8"},{id:"smile",icon:"smile",label:"Neşeli",color:"#eab308"},{id:"flame",icon:"flame",label:"Ateşli",color:"#ef4444"}];function Jf(){if(ll()||document.getElementById("profile-onboarding-overlay"))return;const e=document.createElement("div");e.id="profile-onboarding-overlay",e.className="onboarding-overlay",e.innerHTML=`
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
            ${_a.map((o,s)=>`
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
  `,document.body.appendChild(e),window.lucide&&V(e);let t=_a[0].id,i=_a[0].color;e.querySelectorAll(".onboarding-avatar-btn").forEach(o=>{o.addEventListener("click",()=>{e.querySelectorAll(".onboarding-avatar-btn").forEach(s=>s.classList.remove("selected")),o.classList.add("selected"),t=o.getAttribute("data-avatar"),i=o.getAttribute("data-color")})});const n=e.querySelector("#onboarding-form"),a=e.querySelector("#onboarding-name-input"),r=e.querySelector("#onboarding-is-kid");n.addEventListener("submit",o=>{o.preventDefault();const s=a.value.trim();s&&(Yc({name:s,avatar:t,color:i,isKid:r.checked}),e.classList.add("animate-fade-out"),setTimeout(()=>{e.remove(),window.location.reload()},280))})}const Gi=[{icon:"sparkles",eyebrow:"CinePulse rehberi",title:"İzlemeye hazır bir ana ekran",text:"Ana sayfadaki satırları yatay kaydırarak yapımları gez. Arama simgesinden dizi veya film adını yazdığında sonuçlar anında görünür.",hint:"Mobilde alt menüden Diziler, Filmler, Keşfet ve Listem’e geçebilirsin."},{icon:"clapperboard",eyebrow:"Fragman önizleme",title:"Karttan fragmana bak",text:"Telefonda bir içerik kartına kısa süre basılı tut; fragman ekranın alt kısmında açılır. Bilgisayarda kartın üzerine gelmen yeterli.",hint:"Önizlemeyi sağ üstteki çarpıdan kapatabilir, ses simgesinden sesi açabilirsin."},{icon:"list-plus",eyebrow:"Kişisel liste",title:"Listem senin kontrolünde",text:"İçerik detayındaki artı düğmesiyle yapımları Listem’e ekle. Listem sayfasından kaydettiğin yapımları açabilir veya kaldırabilirsin.",hint:"İzleme ilerlemen de aynı tarayıcıda otomatik hatırlanır."},{icon:"shield-check",eyebrow:"Spoilersız keşif",title:"Diziyi güvenle incele",text:"Dizi detayında “Spoilersız keşfet” seçeneğini açarsan, izleme ilerlemenin sonrasındaki bölüm başlıkları, görselleri ve özetleri gizlenir.",hint:"İzlediğin bölüme ve sıradaki bölüme kadar detay görürsün; ilerledikçe yeni bölümler açılır."},{icon:"users-round",eyebrow:"Birlikte Seç",title:"Arkadaşınla aynı odada izle",text:"Üstteki Birlikte Seç düğmesinden oda oluştur veya altı haneli kodla bir odaya katıl. Moderatör içerik ve kaynak seçer; odada emoji ve sohbet de kullanabilirsin.",hint:"Oynatıcıdaki “Odaya dön” düğmesindeki rozet yeni sohbet mesajlarını gösterir."},{icon:"monitor-play",eyebrow:"Oynatıcı",title:"Kontroller elinin altında",text:"İçeriği açınca ekrana bir kez dokunarak kontrolleri göster. Zaman çubuğundan sarabilir, kaynakları değiştirebilir, altyazı ve ses seçebilirsin.",hint:"Tam ekran, ses ve parlaklık ayarları her cihazda sana ait kalır."}];function Xf(){if(!ll()||Kc()||document.getElementById("cinepulse-product-tour"))return;let e=0;const t=document.body.style.overflow,i=document.createElement("section");i.id="cinepulse-product-tour",i.className="product-tour-overlay",i.setAttribute("role","dialog"),i.setAttribute("aria-modal","true"),i.setAttribute("aria-label","CinePulse kullanım rehberi");const n=()=>{Wc(),document.body.style.overflow=t,i.classList.add("is-leaving"),window.setTimeout(()=>i.remove(),180)},a=()=>{const r=Gi[e];i.innerHTML=`
      <div class="product-tour-card">
        <button class="product-tour-skip" type="button" aria-label="Rehberi kapat">Geç <i data-lucide="x"></i></button>
        <div class="product-tour-icon"><i data-lucide="${r.icon}"></i></div>
        <p class="product-tour-eyebrow">${r.eyebrow}</p>
        <h2>${r.title}</h2>
        <p class="product-tour-text">${r.text}</p>
        <div class="product-tour-hint"><i data-lucide="lightbulb"></i><span>${r.hint}</span></div>
        <div class="product-tour-footer">
          <div class="product-tour-progress" aria-label="Adım ${e+1} / ${Gi.length}">
            ${Gi.map((o,s)=>`<span class="${s===e?"is-active":""}"></span>`).join("")}
          </div>
          <div class="product-tour-actions">
            ${e>0?'<button class="product-tour-back" type="button">Geri</button>':""}
            <button class="product-tour-next" type="button">${e===Gi.length-1?"Hazırım":"Devam"} <i data-lucide="arrow-right"></i></button>
          </div>
        </div>
      </div>
    `,V(i),i.querySelector(".product-tour-skip")?.addEventListener("click",n),i.querySelector(".product-tour-back")?.addEventListener("click",()=>{e=Math.max(0,e-1),a()}),i.querySelector(".product-tour-next")?.addEventListener("click",()=>{e>=Gi.length-1?n():(e+=1,a())})};document.body.appendChild(i),document.body.style.overflow="hidden",a()}const On=new Map,Nc=new Set;let el=0;function Zf(e){if(!e)return Promise.resolve(!1);if(On.has(e))return On.get(e);const t=new Promise(i=>{const n=new Image;n.decoding="async",n.onload=async()=>{try{await n.decode()}catch{}Nc.add(e),i(!0)},n.onerror=()=>{On.delete(e),i(!1)},n.src=e});return On.set(e,t),t}function zc(e,t){return t==="landscape"?e.dataset.backdropSrc:e.dataset.posterSrc}function Qf(){const e=window.innerHeight+900;return[...document.querySelectorAll(".card-poster-img")].filter(t=>{const i=t.getBoundingClientRect();return i.bottom>-300&&i.top<e})}function Nn(e){return Promise.all(Qf().map(t=>Zf(zc(t,e))))}function em(e){document.querySelectorAll(".card-poster-img").forEach(t=>{const i=zc(t,e);!i||t.src===i||(Nc.has(i)?t.classList.remove("card-image-pending"):(t.classList.add("card-image-pending"),t.addEventListener("load",()=>t.classList.remove("card-image-pending"),{once:!0})),t.src=i,t.dataset.activeLayout=e)})}function tm(){const e=ft().cardLayout==="landscape"?"landscape":"portrait";return`
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
  `}function im(e=document){const t=e.querySelector("#card-layout-switcher");if(!t)return;const i=[...t.querySelectorAll(".card-layout-option")],a=(ft().cardLayout==="landscape"?"landscape":"portrait")==="landscape"?"portrait":"landscape",r=()=>{t.isConnected&&Nn(a)};window.innerWidth>768&&("requestIdleCallback"in window?window.requestIdleCallback(r,{timeout:1400}):window.setTimeout(r,450)),i.forEach(o=>{const s=o.dataset.layout==="landscape"?"landscape":"portrait";o.addEventListener("pointerenter",()=>{t.isConnected&&Nn(s)},{passive:!0}),o.addEventListener("focus",()=>{t.isConnected&&Nn(s)},{passive:!0}),o.addEventListener("click",async()=>{const l=o.dataset.layout==="landscape"?"landscape":"portrait",d=document.documentElement.classList.contains("cards-landscape")?"landscape":"portrait";if(l===d||t.classList.contains("is-switching"))return;const p=++el;t.classList.add("is-switching"),i.forEach(y=>{y.disabled=!0});const h=window.innerWidth<=768;if(h||await Promise.race([Nn(l),new Promise(y=>window.setTimeout(y,1200))]),p!==el||!t.isConnected)return;const f=()=>{em(l),document.documentElement.classList.toggle("cards-landscape",l==="landscape"),i.forEach(y=>{const v=y.dataset.layout===l;y.classList.toggle("active",v),y.setAttribute("aria-pressed",String(v))})};if(h)f();else if(typeof document.startViewTransition=="function"){const y=document.startViewTransition(f);try{await y.finished}catch{}}else document.documentElement.classList.add("card-layout-changing"),f(),await new Promise(y=>window.setTimeout(y,280)),document.documentElement.classList.remove("card-layout-changing");gl({cardLayout:l}),t.classList.remove("is-switching"),i.forEach(y=>{y.disabled=!1}),l==="landscape"&&pn(document)})})}var Di;(function(e){e.Unimplemented="UNIMPLEMENTED",e.Unavailable="UNAVAILABLE"})(Di||(Di={}));class Sa extends Error{constructor(t,i,n){super(t),this.message=t,this.code=i,this.data=n}}const nm=e=>{var t,i;return e?.androidBridge?"android":!((i=(t=e?.webkit)===null||t===void 0?void 0:t.messageHandlers)===null||i===void 0)&&i.bridge?"ios":"web"},rm=e=>{const t=e.CapacitorCustomPlatform||null,i=e.Capacitor||{},n=i.Plugins=i.Plugins||{},a=()=>t!==null?t.name:nm(e),r=()=>a()!=="web",o=h=>{const f=d.get(h);return!!(f?.platforms.has(a())||s(h))},s=h=>{var f;return(f=i.PluginHeaders)===null||f===void 0?void 0:f.find(y=>y.name===h)},l=h=>e.console.error(h),d=new Map,p=(h,f={})=>{const y=d.get(h);if(y)return y.proxy;const v=a(),w=s(h);let k;const m=async()=>(!k&&v in f?k=typeof f[v]=="function"?k=await f[v]():k=f[v]:t!==null&&!k&&"web"in f&&(k=typeof f.web=="function"?k=await f.web():k=f.web),k),b=(L,D)=>{var N,U;if(w){const j=w?.methods.find(O=>D===O.name);if(j)return j.rtype==="promise"?O=>i.nativePromise(h,D.toString(),O):(O,B)=>i.nativeCallback(h,D.toString(),O,B);if(L)return(N=L[D])===null||N===void 0?void 0:N.bind(L)}else{if(L)return(U=L[D])===null||U===void 0?void 0:U.bind(L);throw new Sa(`"${h}" plugin is not implemented on ${v}`,Di.Unimplemented)}},E=L=>{let D;const N=(...U)=>{const j=m().then(O=>{const B=b(O,L);if(B){const W=B(...U);return D=W?.remove,W}else throw new Sa(`"${h}.${L}()" is not implemented on ${v}`,Di.Unimplemented)});return L==="addListener"&&(j.remove=async()=>D()),j};return N.toString=()=>`${L.toString()}() { [capacitor code] }`,Object.defineProperty(N,"name",{value:L,writable:!1,configurable:!1}),N},C=E("addListener"),x=E("removeListener"),T=(L,D)=>{const N=C({eventName:L},D),U=async()=>{const O=await N;x({eventName:L,callbackId:O},D)},j=new Promise(O=>N.then(()=>O({remove:U})));return j.remove=async()=>{await U()},j},R=new Proxy({},{get(L,D){switch(D){case"$$typeof":return;case"toJSON":return()=>({});case"addListener":return w?T:C;case"removeListener":return x;default:return E(D)}}});return n[h]=R,d.set(h,{name:h,proxy:R,platforms:new Set([...Object.keys(f),...w?[v]:[]])}),R};return i.convertFileSrc||(i.convertFileSrc=h=>h),i.getPlatform=a,i.handleError=l,i.isNativePlatform=r,i.isPluginAvailable=o,i.registerPlugin=p,i.Exception=Sa,i.DEBUG=!!i.DEBUG,i.isLoggingEnabled=!!i.isLoggingEnabled,i},am=e=>e.Capacitor=rm(e),Xa=am(typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof globalThis<"u"?globalThis:{}),Dr=Xa.registerPlugin;class Ss{constructor(){this.listeners={},this.retainedEventArguments={},this.windowListeners={}}addListener(t,i){let n=!1;this.listeners[t]||(this.listeners[t]=[],n=!0),this.listeners[t].push(i);const r=this.windowListeners[t];r&&!r.registered&&this.addWindowListener(r),n&&this.sendRetainedArgumentsForEvent(t);const o=async()=>this.removeListener(t,i);return Promise.resolve({remove:o})}async removeAllListeners(){this.listeners={};for(const t in this.windowListeners)this.removeWindowListener(this.windowListeners[t]);this.windowListeners={}}notifyListeners(t,i,n){const a=this.listeners[t];if(!a){if(n){let r=this.retainedEventArguments[t];r||(r=[]),r.push(i),this.retainedEventArguments[t]=r}return}a.forEach(r=>r(i))}hasListeners(t){var i;return!!(!((i=this.listeners[t])===null||i===void 0)&&i.length)}registerWindowListener(t,i){this.windowListeners[i]={registered:!1,windowEventName:t,pluginEventName:i,handler:n=>{this.notifyListeners(i,n)}}}unimplemented(t="not implemented"){return new Xa.Exception(t,Di.Unimplemented)}unavailable(t="not available"){return new Xa.Exception(t,Di.Unavailable)}async removeListener(t,i){const n=this.listeners[t];if(!n)return;const a=n.indexOf(i);a!==-1&&this.listeners[t].splice(a,1),this.listeners[t].length||this.removeWindowListener(this.windowListeners[t])}addWindowListener(t){window.addEventListener(t.windowEventName,t.handler),t.registered=!0}removeWindowListener(t){t&&(window.removeEventListener(t.windowEventName,t.handler),t.registered=!1)}sendRetainedArgumentsForEvent(t){const i=this.retainedEventArguments[t];i&&(delete this.retainedEventArguments[t],i.forEach(n=>{this.notifyListeners(t,n)}))}}const tl=e=>encodeURIComponent(e).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),il=e=>e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent);class sm extends Ss{async getCookies(){const t=document.cookie,i={};return t.split(";").forEach(n=>{if(n.length<=0)return;let[a,r]=n.replace(/=/,"CAP_COOKIE").split("CAP_COOKIE");a=il(a).trim(),r=il(r).trim(),i[a]=r}),i}async setCookie(t){try{const i=tl(t.key),n=tl(t.value),a=t.expires?`; expires=${t.expires.replace("expires=","")}`:"",r=(t.path||"/").replace("path=",""),o=t.url!=null&&t.url.length>0?`domain=${t.url}`:"";document.cookie=`${i}=${n||""}${a}; path=${r}; ${o};`}catch(i){return Promise.reject(i)}}async deleteCookie(t){try{document.cookie=`${t.key}=; Max-Age=0`}catch(i){return Promise.reject(i)}}async clearCookies(){try{const t=document.cookie.split(";")||[];for(const i of t)document.cookie=i.replace(/^ +/,"").replace(/=.*/,`=;expires=${new Date().toUTCString()};path=/`)}catch(t){return Promise.reject(t)}}async clearAllCookies(){try{await this.clearCookies()}catch(t){return Promise.reject(t)}}}Dr("CapacitorCookies",{web:()=>new sm});const om=async e=>new Promise((t,i)=>{const n=new FileReader;n.onload=()=>{const a=n.result;t(a.indexOf(",")>=0?a.split(",")[1]:a)},n.onerror=a=>i(a),n.readAsDataURL(e)}),lm=(e={})=>{const t=Object.keys(e);return Object.keys(e).map(a=>a.toLocaleLowerCase()).reduce((a,r,o)=>(a[r]=e[t[o]],a),{})},cm=(e,t=!0)=>e?Object.entries(e).reduce((n,a)=>{const[r,o]=a;let s,l;return Array.isArray(o)?(l="",o.forEach(d=>{s=t?encodeURIComponent(d):d,l+=`${r}=${s}&`}),l.slice(0,-1)):(s=t?encodeURIComponent(o):o,l=`${r}=${s}`),`${n}&${l}`},"").substr(1):null,dm=(e,t={})=>{const i=Object.assign({method:e.method||"GET",headers:e.headers},t),a=lm(e.headers)["content-type"]||"";if(typeof e.data=="string")i.body=e.data;else if(a.includes("application/x-www-form-urlencoded")){const r=new URLSearchParams;for(const[o,s]of Object.entries(e.data||{}))r.set(o,s);i.body=r.toString()}else if(a.includes("multipart/form-data")||e.data instanceof FormData){const r=new FormData;if(e.data instanceof FormData)e.data.forEach((s,l)=>{r.append(l,s)});else for(const s of Object.keys(e.data))r.append(s,e.data[s]);i.body=r;const o=new Headers(i.headers);o.delete("content-type"),i.headers=o}else(a.includes("application/json")||typeof e.data=="object")&&(i.body=JSON.stringify(e.data));return i};class um extends Ss{async request(t){const i=dm(t,t.webFetchExtra),n=cm(t.params,t.shouldEncodeUrlParams),a=n?`${t.url}?${n}`:t.url,r=await fetch(a,i),o=r.headers.get("content-type")||"";let{responseType:s="text"}=r.ok?t:{};o.includes("application/json")&&(s="json");let l,d;switch(s){case"arraybuffer":case"blob":d=await r.blob(),l=await om(d);break;case"json":l=await r.json();break;case"document":case"text":default:l=await r.text()}const p={};return r.headers.forEach((h,f)=>{p[f]=h}),{data:l,headers:p,status:r.status,url:r.url}}async get(t){return this.request(Object.assign(Object.assign({},t),{method:"GET"}))}async post(t){return this.request(Object.assign(Object.assign({},t),{method:"POST"}))}async put(t){return this.request(Object.assign(Object.assign({},t),{method:"PUT"}))}async patch(t){return this.request(Object.assign(Object.assign({},t),{method:"PATCH"}))}async delete(t){return this.request(Object.assign(Object.assign({},t),{method:"DELETE"}))}}Dr("CapacitorHttp",{web:()=>new um});var nl;(function(e){e.Dark="DARK",e.Light="LIGHT",e.Default="DEFAULT"})(nl||(nl={}));var rl;(function(e){e.StatusBar="StatusBar",e.NavigationBar="NavigationBar"})(rl||(rl={}));class pm extends Ss{async setStyle(){this.unavailable("not available for web")}async setAnimation(){this.unavailable("not available for web")}async show(){this.unavailable("not available for web")}async hide(){this.unavailable("not available for web")}}Dr("SystemBars",{web:()=>new pm});const al=Dr("App",{web:()=>ls(()=>import("./web-CXOOCx8n.js"),[],import.meta.url).then(e=>new e.AppWeb)});if(typeof window<"u")try{al.addListener("backButton",({canGoBack:e})=>{const t=document.getElementById("player-modal-container")||document.querySelector(".player-modal-overlay");if(t){const a=document.getElementById("player-close-btn");a?a.click():t.remove();return}const i=document.querySelector(".modal-overlay, .decision-modal-overlay, .profile-modal-overlay, .data-manager-modal");if(i){const a=i.querySelector('.modal-close, .btn-modal-close, [data-action="close"]');a?a.click():i.remove();return}const n=window.location.hash||"#home";if(n!=="#home"&&n!==""){e?window.history.back():window.location.hash="#home";return}al.exitApp()})}catch{}"scrollRestoration"in history&&(history.scrollRestoration="manual");"serviceWorker"in navigator&&window.location.protocol.startsWith("http")&&window.addEventListener("load",()=>{const e="20260920-mobile-preview-2",t=`cinepulse-sw-reloaded-${e}`;navigator.serviceWorker.addEventListener("controllerchange",()=>{sessionStorage.getItem(t)||(sessionStorage.setItem(t,"1"),window.location.reload())}),navigator.serviceWorker.register(`/sw.js?build=${e}`,{updateViaCache:"none"}).then(i=>i.update()).catch(()=>{})});Gd();window.addEventListener("keydown",e=>{e.ctrlKey&&e.altKey&&e.shiftKey&&e.key==="F10"&&(e.preventDefault(),e.stopImmediatePropagation(),Hf(),window.location.hash="#admin")},!0);const ei=document.getElementById("app");document.documentElement.classList.toggle("cards-landscape",ft().cardLayout==="landscape");window.addEventListener("scroll",()=>{gh()},{passive:!0});window.addEventListener("pagehide",Pr);let xa=0;async function Ni(){const e=++xa;Lh(),Pr();const t=window.location.hash||"#home";let i="home",n={};if(t.startsWith("#detail")){if(i="detail",t.includes("?")){const l=t.split("?")[1]||"",d=new URLSearchParams(l);n.type=d.get("type")||"tv",n.id=d.get("id")}else if(t.includes("/")){const l=t.split("/");l.length>=3?(n.type=l[1]||"tv",n.id=l[2]):l.length===2&&(n.type="tv",n.id=l[1])}}else if(t==="#series")i="series";else if(t==="#cartoons")i="cartoons";else if(t==="#movies")i="movies";else if(t==="#anime")i="anime";else if(t==="#documentary")i="documentary";else if(t==="#livetv")i="livetv";else if(t==="#discover")i="discover";else if(t==="#library")i="library";else if(t.startsWith("#dramas")){if(i="dramas",t.includes("?")){const l=t.split("?")[1]||"",d=new URLSearchParams(l);n.slug=d.get("slug"),n.q=d.get("q")}}else if(t==="#admin"){if(!qf()){window.location.replace("#home");return}i="admin"}if(window.__popularListCleanup?.(),window.__popularListCleanup=null,window.__discoverCleanup?.(),window.__discoverCleanup=null,window.__LiveTvController&&typeof window.__LiveTvController.cleanup=="function"&&window.__LiveTvController.cleanup(),document.querySelectorAll("video, audio").forEach(l=>{try{l.pause(),l.removeAttribute("src"),l.load()}catch{}}),i==="admin"){const l=await Kf();if(e!==xa)return;ei.innerHTML=`
      <div class="admin-standalone-wrapper" style="min-height: 100vh; background: #07090e; display: flex; flex-direction: column; width: 100%;">
        ${l?l.html:""}
      </div>
    `,l&&typeof l.init=="function"&&l.init(ei),V();return}const a=ph(i),o=new Set(["home","series","cartoons","movies","anime","documentary","discover","library"]).has(i)?tm():"";(i==="home"||i==="detail")&&(ei.innerHTML=`${a}<main class="route-loading" aria-live="polite"><div class="spin-loader"></div><span>İçerikler yükleniyor...</span></main>`,Do(),V(ei));let s=null;i==="home"?s=await $h():i==="detail"?s=await Xh(n.type,n.id):i==="series"?s=await Yi("tv"):i==="cartoons"?s=await Yi("cartoon"):i==="movies"?s=await Yi("movie"):i==="anime"?s=await Yi("anime"):i==="documentary"?s=await Yi("documentary"):i==="livetv"?s=Bf():i==="discover"?s=await sf("tv"):i==="library"?s=af():i==="dramas"&&(s=await Gf(n.slug,n.q)),e===xa&&(ei.innerHTML=`
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
  `,Do(),im(ei),s&&s.init&&s.init(ei),window.lucide&&V(),yh(t))}window.addEventListener("hashchange",Ni);Ni();setTimeout(async()=>{try{const e=String(new URL(window.location.href).searchParams.get("oda")||"").replace(/\D/g,"");if(!/^\d{6}$/.test(e))return;ur({roomCode:e})}catch{}},700);setTimeout(()=>{Jf()},400);setTimeout(()=>{Xf()},1200);const Hc={getWatchHistory:Be,saveWatchProgress:es,saveBatchWatchProgress:ul};window.addEventListener("cinepulse_trakt_auth_changed",e=>{e.detail?.connected&&El(Hc)});El(Hc);nu();const qc=e=>{e&&e.detail&&(e.detail.action==="import"||e.detail.cleared)&&Ni()};window.addEventListener("sineflix_data_changed",qc);window.addEventListener("cinepulse_data_changed",qc);window.addEventListener("sineflix_profile_changed",async()=>{an(),await Ni()});window.addEventListener("cinepulse_admin_state_changed",Ni);window.addEventListener("storage",e=>{if(e.key!=="sineflix_user_settings_v1")return;const t=ft();document.documentElement.classList.toggle("cards-landscape",t.cardLayout==="landscape"),an(),Ni()});document.addEventListener("contextmenu",e=>(e.preventDefault(),!1),{capture:!0}),window.addEventListener("keydown",e=>{const t=(e.key||"").toLowerCase();if(e.key==="F12"||e.keyCode===123)return e.preventDefault(),!1;if(e.ctrlKey||e.metaKey){const i=t;if(e.shiftKey&&(i==="i"||i==="j"||i==="c")||i==="u"||i==="s")return e.preventDefault(),!1}},!0),document.addEventListener("dragstart",e=>e.preventDefault());export{Ss as W,wh as a,Em as b,Fe as c,lt as d,Sm as e,xm as f,Gt as g,ln as h,Wa as i,_m as j,ii as k,km as l,pl as m,cf as n,ns as o,hm as p,es as q,_e as r,te as s,hl as t,gm as u,mm as v,fm as w};
