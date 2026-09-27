const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./PlayerModal-pp3cnk3D.js","./hls-BuERnqCp.js"])))=>i.map(i=>d[i]);
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function i(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(r){if(r.ep)return;r.ep=!0;const a=i(r);fetch(r.href,a)}})();function J(e=document){const t=window.lucide;if(!t?.icons||!t?.createElement||!e)return;const i="[data-lucide]:not(svg)",n=e.matches?.(i)?[e,...e.querySelectorAll(i)]:e.querySelectorAll(i);for(const r of n){const a=r.getAttribute("data-lucide"),o=a.replace(/(^|-)(\w)/g,(d,p,h)=>h.toUpperCase()),s=t.icons[o];if(!s)continue;const l=t.createElement(s);for(const{name:d,value:p}of r.attributes)d!=="class"&&l.setAttribute(d,p);l.classList.add("lucide",`lucide-${a}`);for(const d of r.classList)d!=="lucide"&&!d.startsWith("lucide-")&&l.classList.add(d);r.replaceWith(l)}}const de={WATCH_HISTORY:"sineflix_watch_history_v1",FAVORITES:"sineflix_favorites_v1",WATCHLIST:"sineflix_watchlist_v1",USER_SETTINGS:"sineflix_user_settings_v1",ANIME_IDS:"sineflix_anime_ids_v1"};let kt=null;function $l(){if(kt)return kt;try{if(typeof window>"u"||!window.localStorage)return kt=new Set,kt;const e=localStorage.getItem(de.ANIME_IDS);if(!e)return kt=new Set,kt;const t=JSON.parse(e);return kt=new Set(Array.isArray(t)?t.map(String):[]),kt}catch{return kt=new Set,kt}}function Se(e){if(e)try{const t=$l(),i=String(e);t.has(i)||(t.add(i),typeof window<"u"&&window.localStorage&&localStorage.setItem(de.ANIME_IDS,JSON.stringify(Array.from(t))))}catch{}}function Fe(e){return e?$l().has(String(e)):!1}let nt=null,et=null,ct=null,un=null,pi=null,pn=null,fn=null,Xt=null,Ui=null,$i=null,cr=null,pt=null,yi=null,Zt=null,At=null;function Ut(){un=null,pi=null,pn=null,fn=null}function Br(){nt=null,et=null,ct=null,Ut(),Xt=null,Ui=null,$i=null,cr=null,kt=null,pt=null,yi=null,Zt=null,At=null}function ti(){if(pt)return pt;const e=[{id:"prof_1",name:"Profilim",avatar:"user-circle",isKid:!1,color:"#f59e0b"},{id:"prof_kids",name:"Çocuk Modu 🎈",avatar:"baby",isKid:!0,color:"#38bdf8"}];try{if(typeof window>"u"||!window.localStorage)return pt=e,pt;const t=localStorage.getItem("sineflix_profiles_list_v1");if(!t)return pt=e,pt;let i=JSON.parse(t);return i.some(r=>r.id==="prof_cinema")&&(i=i.filter(r=>r.id!=="prof_cinema"),localStorage.setItem("sineflix_profiles_list_v1",JSON.stringify(i))),pt=i,pt}catch{return pt=e,pt}}function ks(e){try{if(pt=e,yi=null,typeof window>"u"||!window.localStorage)return;localStorage.setItem("sineflix_profiles_list_v1",JSON.stringify(e)),window.dispatchEvent(new CustomEvent("sineflix_profiles_updated"))}catch{}}function Ml(){try{return typeof window>"u"||!window.localStorage?!0:localStorage.getItem("cinepulse_onboarding_completed")==="true"}catch{return!0}}function yd(){try{return typeof window>"u"||!window.localStorage?!0:localStorage.getItem("cinepulse_product_tour_completed")==="true"}catch{return!0}}function vd(){try{if(typeof window>"u"||!window.localStorage)return;localStorage.setItem("cinepulse_product_tour_completed","true")}catch{}}function bd({name:e,avatar:t="user-circle",color:i="#f59e0b",isKid:n=!1}){try{if(typeof window>"u"||!window.localStorage)return;const r=(e||"").trim()||(n?"Çocuk":"Profilim");let a=ti();const o=a.findIndex(l=>l.id==="prof_1"),s={id:"prof_1",name:r,avatar:t,color:i,isKid:!!n};return o!==-1?a[o]=s:a.unshift(s),ks(a),dr("prof_1"),localStorage.setItem("cinepulse_onboarding_completed","true"),window.dispatchEvent(new CustomEvent("sineflix_profile_changed",{detail:{profileId:"prof_1"}})),s}catch{return null}}const ca="1403";function wd(){try{return typeof window>"u"||!window.localStorage?ca:localStorage.getItem("cinepulse_admin_pin")||ca}catch{return ca}}function kd(e){try{return typeof window>"u"||!window.localStorage||!e||String(e).length<4?!1:(localStorage.setItem("cinepulse_admin_pin",String(e)),!0)}catch{return!1}}function _d(e){return String(e).trim()===wd().trim()}function Dr(){if(At)return At;const e=["clitoris","le clitoris","erotik","porn"];try{if(typeof window>"u"||!window.localStorage)return At=e,e;const t=localStorage.getItem("cinepulse_blocked_content");return t?(At=JSON.parse(t),At):(At=e,e)}catch{return At=e,e}}function Sd(e){if(!e)return;const t=Dr(),i=String(e).trim().toLowerCase();if(!t.includes(i)){t.push(i),At=t;try{localStorage.setItem("cinepulse_blocked_content",JSON.stringify(t))}catch{}}}function xd(e){if(!e)return;let t=Dr();const i=String(e).trim().toLowerCase();t=t.filter(n=>String(n).toLowerCase()!==i),At=t;try{localStorage.setItem("cinepulse_blocked_content",JSON.stringify(t))}catch{}}function Ed(e){if(!e)return!1;const t=Dr(),i=String(e.id||""),n=`${e.title||""} ${e.name||""} ${e.original_title||""} ${e.original_name||""}`.toLowerCase();return t.some(r=>{const a=String(r).toLowerCase().trim();return a?i===a?!0:n.includes(a):!1})}function Cn(){if(yi)return yi;try{const e=ti(),t=typeof window<"u"&&window.localStorage&&localStorage.getItem("sineflix_active_profile_id")||"prof_1";return yi=e.find(i=>i.id===t)||e[0],yi}catch{return{id:"prof_1",name:"Profilim",avatar:"user-circle",isKid:!1,color:"#f59e0b"}}}function dr(e){try{if(typeof window>"u"||!window.localStorage)return;localStorage.setItem("sineflix_active_profile_id",e),yi=null,Br(),window.dispatchEvent(new CustomEvent("sineflix_profile_changed",{detail:{profileId:e}}))}catch{}}function Rt(){return Cn()?.isKid===!0}function ni(e){if(!e||e.adult===!0||Ed(e))return!1;const t=[27,80,10752,10768,53,18],i=e.genre_ids||(Array.isArray(e.genres)?e.genres.map(s=>typeof s=="object"?s.id:s):[]);if(i.some(s=>t.includes(Number(s))))return!1;const n=`${e.title||""} ${e.name||""} ${e.overview||""}`.toLowerCase();if(["cinayet","katil","vahşet","kanlı","erotik","dehşet","intikam","mafya","uyuşturucu","şiddet","tecavüz","seri katil","katliam","korku","kan donduran","murder","killer","horror","bloody","psychopath","terror","revenge","savaş","war","battle","death","ölüm"].some(s=>n.includes(s)))return!1;const a=[16,10751,10762];return i.some(s=>a.includes(Number(s)))}function so(e=[]){return Array.isArray(e)?Rt()?e.filter(ni):e:[]}function Td({name:e,isKid:t=!1,avatar:i="user-circle",color:n="#f59e0b"}){const r=ti(),a={id:`prof_${Date.now()}`,name:e.trim()||"Yeni Profil",avatar:i,isKid:!!t,color:n};return r.push(a),ks(r),a}function Ad(e){if(e==="prof_1")return!1;let t=ti();return t=t.filter(i=>i.id!==e),ks(t),Cn()?.id===e&&dr("prof_1"),!0}function zt(e){if(e===de.WATCH_HISTORY||e===de.FAVORITES||e===de.WATCHLIST){const t=Cn();if(t&&t.id&&t.id!=="prof_1")return`${e}_${t.id}`}return e}function mt(e,t=[]){try{if(typeof window>"u"||!window.localStorage)return t;const i=zt(e),n=localStorage.getItem(i);return n?JSON.parse(n):t}catch{return t}}const Cd="cinepulse_storage_v1",ji="keyval_store";let Bn=null;function Pl(){return Bn||(typeof window>"u"||!window.indexedDB?Promise.resolve(null):(Bn=new Promise(e=>{try{const t=window.indexedDB.open(Cd,1);t.onupgradeneeded=()=>{const i=t.result;i.objectStoreNames.contains(ji)||i.createObjectStore(ji)},t.onsuccess=()=>e(t.result),t.onerror=()=>e(null)}catch{e(null)}}),Bn))}async function Ld(e){try{const t=await Pl();return t?new Promise(i=>{try{const a=t.transaction(ji,"readonly").objectStore(ji).get(e);a.onsuccess=()=>i(a.result!==void 0?a.result:null),a.onerror=()=>i(null)}catch{i(null)}}):null}catch{return null}}async function mn(e,t){try{const i=await Pl();return i?new Promise(n=>{try{const r=i.transaction(ji,"readwrite");r.objectStore(ji).put(t,e),r.oncomplete=()=>n(!0),r.onerror=()=>n(!1)}catch{n(!1)}}):!1}catch{return!1}}async function Id(){if(!(typeof window>"u"||!window.indexedDB))try{const e=zt(de.WATCH_HISTORY),t=await Ld(e);if(Array.isArray(t)&&t.length>0){const i=nt&&nt.length||0;t.length>=i&&(nt=t.sort((n,r)=>(r.lastWatchedAt||0)-(n.lastWatchedAt||0)),et=null,ct=null,Ut(),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{key:e,value:nt}})))}}catch{}}typeof window<"u"&&setTimeout(Id,80);const Dt=new Map;function oo(){if(!(typeof window>"u")){for(const[e,t]of Dt.entries())try{t.timer&&clearTimeout(t.timer),mn(e,t.value),window.localStorage&&localStorage.setItem(e,JSON.stringify(t.value))}catch{}Dt.clear()}}typeof window<"u"&&(window.addEventListener("beforeunload",oo),window.addEventListener("pagehide",oo));function Me(e,t,i={}){try{if(typeof window>"u")return;const n=zt(e);if(mn(n,t),window.localStorage)if(i.isProgressUpdate){Dt.has(n)&&clearTimeout(Dt.get(n).timer);const r=setTimeout(()=>{try{localStorage.setItem(n,JSON.stringify(t))}catch{}Dt.delete(n)},2500);Dt.set(n,{timer:r,value:t})}else{Dt.has(n)&&(clearTimeout(Dt.get(n).timer),Dt.delete(n));try{localStorage.setItem(n,JSON.stringify(t))}catch{}}window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{key:n,value:t,...i}}))}catch{}}const Bl=["anime","kimetsu","yaiba","iblis keser","demon slayer","naruto","boruto","shingeki","titan","titana saldırı","jujutsu","kaisen","one piece","death note","bleach","dragon ball","hunter x hunter","chainsaw man","tokyo ghoul","my hero academia","boku no hero","kahramanlık akademim","fullmetal","alchemist","simyacı","sword art online","solo leveling","black clover","vinland saga","spy x family","cyberpunk: edgerunners","haikyuu","one punch","berserk","mob psycho","overlord","evangelion","cowboy bebop","code geass","frieren","dr. stone","blue lock","steins;gate","jojo","kaiju no. 8","gintama","fairy tail","violet evergarden","hell's paradise","jigokuraku","dandadan","wind breaker","mushoku tensei","re:zero","delicious in dungeon","dungeon meshi","mashle","baki","hajime no ippo","slamdunk","slam dunk","kuroko","initial d","great teacher onizuka","monster","dororo","fire force","soul eater","noragami","erased","parasyte","psycho-pass","fate/zero","fate/stay","made in abyss","your lie in april","shigatsu wa kimi","anohana","toradora","clannad","classroom of the elite","elite sınıfı","no game no life","konosuba","slime datta ken","shield hero","kalkan kahramanı","goblin slayer","akame ga kill","kill la kill","gurren lagann","darling in the franxx","promised neverland","seven deadly sins","nanatsu no taizai","yedi ölümcül günah","tokyo revengers","blue exorcist","ao no exorcist","d.gray-man","inuyasha","yu yu hakusho","sailor moon","pokemon","digimon","yu-gi-oh","beyblade","captain tsubasa","tsubasa","record of ragnarok","shuumatsu no valkyrie","golden kamuy","dorohedoro","pluto","trigun","hellsing","elfen lied","rurouni kenshin","samurai champloo","fruits basket","horimiya","my dress-up darling","komi can't communicate","rent-a-girlfriend","kaguya-sama","lycoris recoil","zom 100","undead unluck","dead mount death play","seraph of the end","owari no seraph","bungo stray dogs","bungou stray dogs","assassination classroom","suikast sınıfı","black butler","kuroshitsuji","spirited away","ruhların kaçışı","howl's moving castle","yürüyen şato","my neighbor totoro","komşum totoro","princess mononoke","prenses mononoke","your name","kimi no na wa","senin adın","weathering with you","suzume","a silent voice","sessizliğin sesi","koe no katachi","akira","shangri-la frontier","oshi no ko","the eminence in shadow","bocchi the rock"];function Rd(e){return e?/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(e):!1}function ut(e){if(!e)return!1;if(e.isAnime===!0||e.type==="anime"||e.media_type==="anime"||e.id&&Fe(e.id))return!0;const i=(e.genre_ids||(Array.isArray(e.genres)?e.genres.map(a=>typeof a=="object"?a.id:a):[])).some(a=>Number(a)===16),n=e.original_language==="ja"||Array.isArray(e.origin_country)&&e.origin_country.includes("JP");if(i&&n||i&&(e.origin_country?.includes("JP")||e.original_language==="ja")||e.original_language==="ja"&&(i||Rd(e.original_name||e.original_title||e.title||e.name))||Array.isArray(e.genres)&&e.genres.map(o=>typeof o=="object"?o.name:String(o)).filter(Boolean).some(o=>/anime/i.test(o)))return e.id&&Se(e.id),!0;if(typeof e.id=="string"&&(e.id.startsWith("ta_")||e.id.startsWith("acx_")||e.id.startsWith("tra_")))return Se(e.id),!0;const r=(e.title||e.name||e.original_title||e.original_name||"").toLowerCase();for(const a of Bl)if(r.includes(a))return e.id&&Se(e.id),!0;return!1}function _s(e){return e?e.isSeries===!0||e.type==="tv"||e.media_type==="tv"?!1:e.type==="movie"||e.media_type==="movie"?!0:e.first_air_date||e.number_of_seasons||e.episodesCount||Array.isArray(e.seasons)&&e.seasons.length>0||e.season>1||e.episode>1?!1:!!(e.release_date&&!e.first_air_date):!0}function Be(){return nt||(nt=mt(de.WATCH_HISTORY,[]).sort((t,i)=>(i.lastWatchedAt||0)-(t.lastWatchedAt||0)),nt)}async function $d(){const e=Be();let t=!1;const i="4e44d9029b1270a757cddc766a1bcb63";let n=0;for(let r=0;r<e.length;r++){const a=e[r];if(a.isAnime||a.type==="anime"){a.id&&Se(a.id);continue}if(!(a.isAnime===!1&&a.type!=="anime")){if(Fe(a.id)||ut(a)){a.isAnime=!0,a.type="anime",Se(a.id),t=!0;continue}if(n<5&&a.id&&!isNaN(Number(a.id))){n++;try{const o=await fetch(`https://api.themoviedb.org/3/tv/${a.id}?api_key=${i}&language=tr-TR`);if(o.ok){const s=await o.json(),l=s.original_language==="ja"||Array.isArray(s.origin_country)&&s.origin_country.includes("JP"),d=Array.isArray(s.genres)&&s.genres.some(p=>p.id===16||/anim/i.test(p.name));l&&d&&(a.isAnime=!0,a.type="anime",a.isSeries=!0,a.original_language="ja",Se(a.id),t=!0)}}catch{}}}}t&&(Ut(),Me(de.WATCH_HISTORY,e))}function zr(){if(et)return et;const e=Be();et=new Map,ct=new Map;for(let t=0;t<e.length;t++){const i=e[t],n=`${i.id}_${i.season||1}_${i.episode||1}`;et.has(n)||et.set(n,i);const r=String(i.id);ct.has(r)||ct.set(r,i)}return et}function ur(e){if(!e||typeof e!="string")return"";let t=e.replace(/^(undefined|null|\/undefined|\/null)$/i,"");if(!t||t.startsWith("data:")||t.startsWith("http"))return t;try{for(;t.includes("%");){const i=decodeURIComponent(t);if(i===t)break;t=i}}catch{}return t=t.replace(/^\/+/,"/"),t.startsWith("/")||(t=`/${t}`),t==="/"||t==="/null"||t==="/undefined"?"":t}function Ln(e,t,i,n=[]){const r=n.find(d=>d.id==e&&(d.posterPath||d.poster_path));let a=t||(r?r.posterPath||r.poster_path:""),o=i||(r?r.backdropPath||r.backdrop_path:"");const s=ur(a),l=ur(o);return{resolvedPoster:s||"",resolvedBackdrop:l||""}}function Ss({id:e,title:t,posterPath:i,poster_path:n,backdropPath:r,backdrop_path:a,type:o,isAnime:s=!1,isSeries:l=!1,season:d=1,episode:p=1,currentTime:h=0,duration:f=0,completed:v=!1,genres:y=[],genre_ids:w=[],original_language:k="",origin_country:m=[],...b}){if(!e)return;const E=Be(),C=E.findIndex(Y=>Y.id==e&&Y.season==d&&Y.episode==p),_=E.find(Y=>Y.id==e),T=!!(s||o==="anime"||Fe(e)||C>=0&&(E[C].isAnime||E[C].type==="anime")||_&&(_.isAnime||_.type==="anime")||ut({id:e,title:t,type:o,genres:y,genre_ids:w,original_language:k,origin_country:m,...b}));T&&Se(e);const I=!!(l||o==="tv"||b.first_air_date||b.number_of_seasons||b.episodesCount||Array.isArray(b.seasons)&&b.seasons.length>0||d>1||p>1||C>=0&&(E[C].isSeries||E[C].type==="tv"||E[C].season>1||E[C].episode>1)||_&&(_.isSeries||_.type==="tv"||_.season>1||_.episode>1));let L=T?"anime":I?"tv":"movie";const{resolvedPoster:N,resolvedBackdrop:O}=Ln(e,i||n,r||a,E),K=f>0?f:L==="movie"?6600:3e3,F=K>0?Math.min(100,Math.round(h/K*100)):0,z=v||F>=90,P={...b,id:e,title:t||(C>=0?E[C].title:_?_.title:"İçerik"),posterPath:N,poster_path:N,backdropPath:O,backdrop_path:O,type:L,isAnime:T,isSeries:I,genres:y&&y.length>0?y:C>=0?E[C].genres:_?_.genres:[],genre_ids:w&&w.length>0?w:C>=0?E[C].genre_ids:_?_.genre_ids:[],original_language:k||(C>=0?E[C].original_language:_?_.original_language:""),origin_country:m&&m.length>0?m:C>=0?E[C].origin_country:_?_.origin_country:[],season:Number(d),episode:Number(p),currentTime:Math.round(h),duration:Math.round(K),progressPercent:F,completed:z,lastWatchedAt:b.lastWatchedAt?Number(b.lastWatchedAt):Date.now()};C>=0?E[C]=P:E.unshift(P),E.sort((Y,ne)=>(ne.lastWatchedAt||0)-(Y.lastWatchedAt||0)),nt=E,et&&et.set(`${e}_${d}_${p}`,P),ct&&ct.set(String(e),P),Ut(),Me(de.WATCH_HISTORY,E,{isProgressUpdate:!0})}function Dl(e=[]){if(!Array.isArray(e)||e.length===0)return;const t=Be(),i=new Map;for(let o=0;o<t.length;o++){const s=t[o],l=`${s.id}_${s.season||1}_${s.episode||1}`;i.set(l,s)}for(const o of e){if(!o||!o.id)continue;const s=Number(o.season||1),l=Number(o.episode||1),d=`${o.id}_${s}_${l}`,p=i.get(d);if(p&&p.lastWatchedAt&&o.lastWatchedAt&&p.lastWatchedAt>o.lastWatchedAt&&p.completed&&o.completed)continue;const h=!!(o.isAnime||o.type==="anime"||Fe(o.id)||p&&(p.isAnime||p.type==="anime")||ut(o));h&&Se(o.id);const f=!!(o.isSeries||o.type==="tv"||o.first_air_date||s>1||l>1||p&&(p.isSeries||p.type==="tv")),v=h?"anime":f?"tv":"movie",{resolvedPoster:y,resolvedBackdrop:w}=Ln(o.id,o.posterPath||o.poster_path,o.backdropPath||o.backdrop_path,t),k=o.duration>0?o.duration:v==="movie"?6600:3e3,m=o.currentTime!==void 0?o.currentTime:o.completed?k:0,b=o.progressPercent!==void 0?o.progressPercent:k>0?Math.min(100,Math.round(m/k*100)):0,E=o.completed===!1?!1:o.completed||b>=90,C={...p||{},...o,id:o.id,title:o.title||p?.title||"İçerik",posterPath:y,poster_path:y,backdropPath:w,backdrop_path:w,type:v,isAnime:h,isSeries:f,season:s,episode:l,currentTime:Math.round(m),duration:Math.round(k),progressPercent:b,completed:E,lastWatchedAt:o.lastWatchedAt?Number(o.lastWatchedAt):p?.lastWatchedAt||Date.now()};i.set(d,C)}const n=Array.from(i.values()).sort((o,s)=>(s.lastWatchedAt||0)-(o.lastWatchedAt||0));nt=n,et=null,ct=null,Ut();const r=n.filter(o=>!o.completed).length,a=n.filter(o=>o.completed).length;r>0,Me(de.WATCH_HISTORY,n)}function Md(e,t=1,i=1){let n=Be();n=n.filter(r=>!(r.id==e&&r.season==t&&r.episode==i)),nt=n,et&&et.delete(`${e}_${t}_${i}`),Ut(),Me(de.WATCH_HISTORY,n)}function Ua(e){let t=Be();t=t.filter(i=>i.id!=e),nt=t,et=null,Ut(),Me(de.WATCH_HISTORY,t)}function lo(){let e=Be();e=e.filter(t=>!t.completed&&t.progressPercent<90),Me(de.WATCH_HISTORY,e)}function Pd(){let e=Be();const t=e.length;return e=e.filter(i=>!(i.currentTime===1e3&&i.duration===1e3)),nt=e,et=null,Ut(),Me(de.WATCH_HISTORY,e),t-e.length}function ii(e,t=1,i=1){return zr().get(`${e}_${t}_${i}`)||null}function Sn(e,t=1,i=1){const n=ii(e,t,i);return!!(n&&(n.completed||n.progressPercent>=90))}function zl(e,t=1,i=1,n=!0,r={}){const a=Be(),o=a.findIndex(y=>y.id==e&&y.season==t&&y.episode==i),s=a.find(y=>y.id==e),l=!!(r.isAnime||r.type==="anime"||Fe(e)||o>=0&&(a[o].isAnime||a[o].type==="anime")||s&&(s.isAnime||s.type==="anime")||ut({id:e,title:r.title,...r}));l&&Se(e);const d=r.type==="movie"&&!l,p=r.duration||(d?6600:3e3),{resolvedPoster:h,resolvedBackdrop:f}=Ln(e,r.posterPath||r.poster_path,r.backdropPath||r.backdrop_path,a),v={id:e,title:r.title||(o>=0?a[o].title:"İçerik"),posterPath:h,poster_path:h,backdropPath:f,backdrop_path:f,type:l?"anime":d?"movie":"tv",isAnime:l,isSeries:!d,season:Number(t),episode:Number(i),currentTime:n?p:0,duration:p,progressPercent:n?100:0,completed:!!n,lastWatchedAt:Date.now()};o>=0?a[o]=v:a.push(v),Me(de.WATCH_HISTORY,a)}function Nm(e,t=!0,i={}){zl(e,1,1,t,{...i,type:i.type||"movie"})}function Ol(e,t=1,i=1,n={}){const r=Sn(e,t,i);return zl(e,t,i,!r,n),{completed:!r}}function Bd(e,t=[],i=!0,n={}){const r=Be(),a=n.title||"Dizi",o=!!(n.isAnime||n.type==="anime"||Fe(e)||ut({id:e,title:a}));o&&Se(e);const s=o?"anime":"tv",l=n.duration||3e3,{resolvedPoster:d,resolvedBackdrop:p}=Ln(e,n.posterPath||n.poster_path,n.backdropPath||n.backdrop_path,r);for(const h of t){const f=h.season_number;if(f===0&&t.length>1)continue;const v=h.episode_count||10;for(let y=1;y<=v;y++){const w=r.findIndex(m=>m.id==e&&m.season==f&&m.episode==y),k={id:e,title:a,posterPath:d,poster_path:d,backdropPath:p,backdrop_path:p,type:s,isAnime:o,isSeries:!0,season:Number(f),episode:y,currentTime:i?l:0,duration:l,progressPercent:i?100:0,completed:!!i,lastWatchedAt:Date.now()};w>=0?r[w]=k:r.push(k)}}Me(de.WATCH_HISTORY,r)}function Dd(e,t,i=10,n=!0,r={}){const a=Be(),o=r.title||"Dizi",s=!!(r.isAnime||r.type==="anime"||Fe(e)||ut({id:e,title:o}));s&&Se(e);const l=s?"anime":"tv",d=r.duration||3e3,{resolvedPoster:p,resolvedBackdrop:h}=Ln(e,r.posterPath||r.poster_path,r.backdropPath||r.backdrop_path,a);for(let f=1;f<=i;f++){const v=a.findIndex(w=>w.id==e&&w.season==t&&w.episode==f),y={id:e,title:o,posterPath:p,poster_path:p,backdropPath:h,backdrop_path:h,type:l,isAnime:s,isSeries:!0,season:Number(t),episode:f,currentTime:n?d:0,duration:d,progressPercent:n?100:0,completed:!!n,lastWatchedAt:Date.now()};v>=0?a[v]=y:a.push(y)}Me(de.WATCH_HISTORY,a)}function da(e,t=[]){if(!t||t.length===0)return Sn(e,1,1);const i=zr();for(const n of t){const r=n.season_number;if(r===0&&t.length>1)continue;const a=n.episode_count||1;for(let o=1;o<=a;o++){const s=i.get(`${e}_${r}_${o}`);if(!s||!s.completed&&s.progressPercent<90)return!1}}return!0}function ua(e,t,i=10){const n=zr();for(let r=1;r<=i;r++){const a=n.get(`${e}_${t}_${r}`);if(!a||!a.completed&&a.progressPercent<90)return!1}return!0}function ja(e,t=1,i=1,n=1500,r={}){const a=!!(r.isAnime||r.type==="anime"||Fe(e)||ut({id:e,title:r.title,...r}));a&&Se(e);const o=r.type==="movie"&&!a,s=r.duration||(o?6600:3e3),l=n||Math.round(s*.5);return Ss({id:e,title:r.title||"İçerik",posterPath:r.posterPath||r.poster_path||"",backdropPath:r.backdropPath||r.backdrop_path||"",type:a?"anime":o?"movie":"tv",isAnime:a,isSeries:!o,season:t,episode:i,currentTime:l,duration:s,completed:!1})}function pa(e){return e?(ct||zr(),ct&&ct.has(String(e))?ct.get(String(e)):Be().find(i=>i.id==e)||null):null}function fi(e){if(!e||e<=0)return"";const t=Math.floor(e/60),i=Math.floor(e%60);if(t>=60){const n=Math.floor(t/60),r=t%60;return`${n}sa ${r>0?r+"dk":""}`}return`${t}:${i<10?"0":""}${i}`}function co(e,t){(!t||t<=0)&&(t=3e3);const i=Math.max(0,t-(e||0)),n=Math.round(i/60);if(n<=0)return"Bitti";if(n>=60){const r=Math.floor(n/60),a=n%60;return`${r}sa ${a>0?a+"dk":""} kaldı`}return`${n} dk kaldı`}function zd(e){if(!e||e<=0)return"0 dakika";const t=Math.floor(e/86400),i=Math.floor(e%86400/3600),n=Math.floor(e%3600/60),r=[];return t>0&&r.push(`${t} gün`),i>0&&r.push(`${i} saat`),(n>0||r.length===0)&&r.push(`${n} dk`),r.join(" ")}function uo(){if(fn)return fn;const e=Be();let t=0,i=0,n=0;for(const a of e){const o=_s(a),s=a.duration&&a.duration>0?a.duration:o?6600:3e3;a.completed?t+=s:a.currentTime>0?t+=a.currentTime:a.progressPercent&&a.progressPercent>0?t+=Math.round(a.progressPercent/100*s):t+=s,o?i++:n++}const r=zd(t);return fn={totalSeconds:t,totalMinutes:Math.floor(t/60),totalHours:(t/3600).toFixed(1),formattedTotalTime:r,formattedTotal:r,moviesCount:i,totalMovies:i,episodesCount:n,totalEpisodes:n,totalEntries:e.length},fn}function Zn(){if(pi)return pi;const e=Be();if(!e||e.length===0)return pi=[],pi;const t=new Map;for(const n of e){const r=n.id;t.has(r)||t.set(r,[]),t.get(r).push(n)}const i=[];for(const[n,r]of t.entries()){r.sort((l,d)=>(d.lastWatchedAt||0)-(l.lastWatchedAt||0));const a=r[0],o=!!(a.isAnime||a.type==="anime"||Fe(a.id)||ut(a));if(o&&Se(a.id),r.some(l=>l.isSeries===!0||l.type==="tv"||l.type==="anime"||l.first_air_date||l.number_of_seasons||l.season&&l.season>1||l.episode&&l.episode>1||Array.isArray(l.seasons)&&l.seasons.length>0)){if(r.every(L=>L.completed||L.progressPercent>=85))continue;const l=r.find(L=>!L.completed&&L.currentTime>0&&L.progressPercent<100);let d=l?l.season||1:a.season||1;const p=new Set;for(const L of r)L.season===d&&(L.completed||L.progressPercent>=90)&&p.add(L.episode);let h=1,f=!1,v=0,y=a;if(l&&l.season===d)h=l.episode||1,f=!0,v=l.currentTime||0,y=l;else{for(;p.has(h)&&h<=999;)h++;const L=r.find(N=>N.season===d&&N.episode===h);L&&!L.completed&&L.currentTime>0&&(f=!0,v=L.currentTime,y=L)}const w=r.find(L=>L.number_of_seasons||L.status||Array.isArray(L.seasons)&&L.seasons.length>0)||a,k=w.status==="Ended"||w.status==="Canceled",b=(Array.isArray(w.seasons)?w.seasons.find(L=>L.season_number===d):null)?.episode_count||w.season_episodes_count,E=w.number_of_seasons||(Array.isArray(w.seasons)?w.seasons.filter(L=>L.season_number>0).length:0);if(b&&h>b){if(E&&d<E)d++,h=1,f=!1,v=0;else if(k&&!f)continue}if(k&&w.number_of_episodes&&!f&&r.filter(N=>N.completed||N.progressPercent>=90).length>=w.number_of_episodes||p.size===0&&!f&&a.currentTime<=0)continue;const C=y.duration||3e3,_=co(v,C),T=o?"Anime Dizisi • ":"";let I="";f&&v>0?I=`${T}S${d} B${h} • Kaldığın: ${fi(v)} • ${_}`:p.size>0||h>1?I=`${T}S${d} B${h} • Sıradaki Bölüm`:I=`${T}S${d} B${h} • Sıradaki Bölüm`,i.push({...a,...y,id:a.id,title:a.title||y.title,posterPath:a.posterPath||y.posterPath,poster_path:a.poster_path||y.poster_path,backdropPath:a.backdropPath||y.backdropPath,backdrop_path:a.backdrop_path||y.backdrop_path,type:o?"anime":"tv",isAnime:o,isSeries:!0,season:d,episode:h,currentTime:f?v:0,subtitle:I})}else{if(a.completed||a.progressPercent>=90)continue;if(a.currentTime>0){const d=a.duration||6600,p=co(a.currentTime,d),h=o?"Anime Filmi • ":"";i.push({...a,type:o?"anime":"movie",isAnime:o,isSeries:!1,subtitle:`${h}Kaldığın: ${fi(a.currentTime)} • ${p}`})}}}return i.sort((n,r)=>(r.lastWatchedAt||0)-(n.lastWatchedAt||0)),pi=i,pi}function fa(){if(pn)return pn;const e=Be(),t=new Map;for(const n of e){const r=n.id;t.has(r)||t.set(r,[]),t.get(r).push(n)}const i=[];for(const[n,r]of t.entries()){r.sort((l,d)=>(d.lastWatchedAt||0)-(l.lastWatchedAt||0));const a=r[0],o=!!(a.isAnime||a.type==="anime"||Fe(a.id)||ut(a));o&&Se(a.id),_s(a)?(a.completed||a.progressPercent>=90)&&i.push({...a,type:o?"anime":"movie",isAnime:o,isSeries:!1,completed:!0,subtitle:o?"✓ Anime Filmi İzlendi":"✓ Film İzlendi"}):r.every(d=>d.completed||d.progressPercent>=85)&&r.length>0&&i.push({...a,type:o?"anime":"tv",isAnime:o,isSeries:!0,completed:!0,subtitle:o?`✓ ${r.length} Bölüm Anime İzlendi`:`✓ ${r.length} Bölüm İzlendi`})}return i.sort((n,r)=>(r.lastWatchedAt||0)-(n.lastWatchedAt||0)),pn=i,pn}function po(){if(un)return un;const e=Be(),t=new Map;for(const n of e){const r=n.id;t.has(r)||t.set(r,[]),t.get(r).push(n)}const i=[];for(const[n,r]of t.entries()){r.sort((d,p)=>(p.lastWatchedAt||0)-(d.lastWatchedAt||0));const a=r[0],o=!!(a.isAnime||a.type==="anime"||Fe(a.id)||ut(a));o&&Se(a.id);const s=_s(a),l=o?"anime":s?"movie":"tv";if(s){const d=o?"Anime Filmi • ":"";i.push({...a,type:l,isAnime:o,isSeries:!1,subtitle:a.completed?`✓ ${d}İzlendi`:a.progressPercent>0?`${d}%${a.progressPercent} İzlendi`:d.replace(" • ","")})}else{const d=r.filter(h=>h.completed||h.progressPercent>=85).length,p=o?"Anime Dizisi • ":"";i.push({...a,type:l,isAnime:o,isSeries:!0,subtitle:d>0?`${p}${d} Bölüm İzlendi`:`${p}S${a.season||1} B${a.episode||1}`})}}return i.sort((n,r)=>(r.lastWatchedAt||0)-(n.lastWatchedAt||0)),un=i,un}function fo(){return Zn()}function Nl(e){if(!e)return e;let t=e.type;const i=!!(e.isAnime||e.type==="anime"||Fe(e.id)||ut(e));i?(t="anime",e.id&&Se(e.id)):(!t||t==="movie")&&(e.isSeries||e.first_air_date||e.media_type==="tv"||e.number_of_seasons||e.episodesCount||!e.title&&e.name?t="tv":t=t||"movie");const n=!!(e.isSeries!==void 0?e.isSeries:t==="tv"||e.first_air_date||e.number_of_seasons||e.episodesCount||e.season&&e.season>1||e.episode&&e.episode>1),r=ur(e.poster_path||e.posterPath||e.poster||""),a=ur(e.backdrop_path||e.backdropPath||e.backdrop||"");return{...e,type:t,isAnime:i,isSeries:n,poster_path:r,posterPath:r,backdrop_path:a,backdropPath:a}}function Qt(){return Xt||(Xt=mt(de.FAVORITES,[]).map(Nl),Ui=new Set(Xt.map(t=>String(t.id))),Xt)}function Od(e){return e?(Ui||Qt(),Ui.has(String(e))):!1}function Nd(e){if(!e||!e.id)return!1;let t=Qt();const i=t.findIndex(r=>r.id==e.id);let n=!1;if(i>=0)t.splice(i,1);else{const r=!!(e.isAnime||e.type==="anime"||Fe(e.id)||ut(e));r&&Se(e.id);let a=r?"anime":e.type;a||(a=e.first_air_date||e.media_type==="tv"||e.number_of_seasons||!e.title&&e.name?"tv":"movie");const o=e.poster_path||e.posterPath||e.poster||"",s=e.backdrop_path||e.backdropPath||e.backdrop||"";t.unshift({id:e.id,title:e.title||e.name||"İsimsiz",poster_path:o,posterPath:o,backdrop_path:s,backdropPath:s,vote_average:e.vote_average||e.voteAverage||8,release_date:e.release_date||e.first_air_date||"",first_air_date:e.first_air_date||"",genre_ids:e.genre_ids||(Array.isArray(e.genres)?e.genres.map(l=>typeof l=="object"?l.id:l):[]),genres:e.genres||[],original_language:e.original_language||"",origin_country:e.origin_country||[],isAnime:r,type:a,addedAt:Date.now()}),n=!0}return Xt=t,Ui=new Set(t.map(r=>String(r.id))),Me(de.FAVORITES,t),n}function Hd(e){let t=Qt();return t=t.filter(i=>i.id!=e),Xt=t,Ui=new Set(t.map(i=>String(i.id))),Me(de.FAVORITES,t),t}function ei(){return $i||($i=mt(de.WATCHLIST,[]).map(Nl),cr=new Set($i.map(t=>String(t.id))),$i)}function xs(e){return e?(cr||ei(),cr.has(String(e))):!1}function Hl(e){if(!e||!e.id)return!1;let t=ei();const i=t.findIndex(r=>r.id==e.id);let n=!1;if(i>=0)t.splice(i,1);else{const r=!!(e.isAnime||e.type==="anime"||Fe(e.id)||ut(e));r&&Se(e.id);let a=r?"anime":e.type;a||(a=e.first_air_date||e.media_type==="tv"||e.number_of_seasons||!e.title&&e.name?"tv":"movie");const o=e.poster_path||e.posterPath||e.poster||"",s=e.backdrop_path||e.backdropPath||e.backdrop||"";t.unshift({id:e.id,title:e.title||e.name||"İsimsiz",poster_path:o,posterPath:o,backdrop_path:s,backdropPath:s,vote_average:e.vote_average||e.voteAverage||8,release_date:e.release_date||e.first_air_date||"",first_air_date:e.first_air_date||"",genre_ids:e.genre_ids||(Array.isArray(e.genres)?e.genres.map(l=>typeof l=="object"?l.id:l):[]),genres:e.genres||[],original_language:e.original_language||"",origin_country:e.origin_country||[],isAnime:r,type:a,addedAt:Date.now()}),n=!0}return Me(de.WATCHLIST,t),n}function qd(e){let t=ei();return t=t.filter(i=>i.id!=e),Me(de.WATCHLIST,t),t}function Fd(){nt=[],et=new Map,ct=new Map,Ut(),Me(de.WATCH_HISTORY,[])}function Ud(e,t=1,i=1){return Md(e,t,i)}function $t(){return Zt||(Zt=mt(de.USER_SETTINGS,{autoplayNext:!0,preferredResolution:"1080p",theme:"dark",subtitlesEnabled:!0,cardLayout:"portrait",hoverPreviewsEnabled:!0,trailersEnabled:!0}),Zt)}function ql(e){Zt={...$t(),...e},Me(de.USER_SETTINGS,Zt),typeof window<"u"&&window.dispatchEvent(new CustomEvent("cinepulse_settings_changed",{detail:Zt}))}function Fl(){const e=mt(de.WATCH_HISTORY,[]),t=mt(de.FAVORITES,[]),i=mt(de.WATCHLIST,[]),n=mt(de.USER_SETTINGS,{}),r={version:"1.0.0",exportDate:new Date().toISOString(),appName:"CinePulse Studio",watchHistory:e,favorites:t,watchlist:i,userSettings:n,data:{watchHistory:e,favorites:t,watchlist:i,userSettings:n}},a=JSON.stringify(r,null,2),o=new Blob([a],{type:"application/json;charset=utf-8"}),s=URL.createObjectURL(o),l=document.createElement("a");l.href=s,l.download=`cinepulse_yedek_${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(l),l.click(),setTimeout(()=>{document.body.removeChild(l),URL.revokeObjectURL(s)},1e3)}function Ul(e,t="merge"){try{let i=null;if(typeof e=="string"?i=JSON.parse(e.trim()):typeof e=="object"&&e!==null&&(i=e),!i)throw new Error("Geçersiz veya boş yedek dosyası.");let n=[],r=[],a=[],o={};if(Array.isArray(i)?n=i:typeof i=="object"&&(n=i.watchHistory||i.data?.watchHistory||i.sineflix_watch_history_v1||i.history||[],r=i.favorites||i.data?.favorites||i.sineflix_favorites_v1||[],a=i.watchlist||i.data?.watchlist||i.sineflix_watchlist_v1||[],o=i.userSettings||i.data?.userSettings||i.sineflix_user_settings_v1||{}),Array.isArray(n)||(n=[]),Array.isArray(r)||(r=[]),Array.isArray(a)||(a=[]),t==="replace")Me(de.WATCH_HISTORY,n),Me(de.FAVORITES,r),Me(de.WATCHLIST,a),o&&typeof o=="object"&&Me(de.USER_SETTINGS,o);else{const s=mt(de.WATCH_HISTORY,[]),l=new Map;s.forEach(w=>{const k=`${w.id}_${w.season||1}_${w.episode||1}`;l.set(k,w)}),n.forEach(w=>{const k=`${w.id}_${w.season||1}_${w.episode||1}`;if(!l.has(k))l.set(k,w);else{const m=l.get(k);((w.lastWatchedAt||0)>=(m.lastWatchedAt||0)||w.completed)&&l.set(k,{...m,...w})}});const d=Array.from(l.values()).sort((w,k)=>(k.lastWatchedAt||0)-(w.lastWatchedAt||0));Me(de.WATCH_HISTORY,d);const p=mt(de.FAVORITES,[]),h=new Map;p.forEach(w=>h.set(String(w.id),w)),r.forEach(w=>{h.has(String(w.id))||h.set(String(w.id),w)}),Me(de.FAVORITES,Array.from(h.values()));const f=mt(de.WATCHLIST,[]),v=new Map;f.forEach(w=>v.set(String(w.id),w)),a.forEach(w=>{v.has(String(w.id))||v.set(String(w.id),w)}),Me(de.WATCHLIST,Array.from(v.values()));const y=mt(de.USER_SETTINGS,{});Me(de.USER_SETTINGS,{...y,...o})}return Br(),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{action:"import"}})),window.dispatchEvent(new CustomEvent("cinepulse_data_changed",{detail:{action:"import"}})),{success:!0,countHistory:n.length,countFavs:r.length,countWatchlist:a.length,message:`${n.length} izleme kaydı ve ${r.length} favori başarıyla aktarıldı.`}}catch(i){return{success:!1,error:i.message,message:"Yedek dosyası okunamadı: "+i.message}}}function jd(){const e=Be(),t=Qt(),i=ei(),n=JSON.stringify({history:e,favorites:t,watchlist:i}),r=new Blob([n]).size,a=(r/1024).toFixed(1);return{historyCount:e.length,favoritesCount:t.length,watchlistCount:i.length,bytes:r,kb:a}}function Kd(){Br();try{mn(zt(de.WATCH_HISTORY),[]),mn(zt(de.FAVORITES),[]),mn(zt(de.WATCHLIST),[])}catch{}typeof window<"u"&&window.localStorage&&(localStorage.removeItem(zt(de.WATCH_HISTORY)),localStorage.removeItem(zt(de.FAVORITES)),localStorage.removeItem(zt(de.WATCHLIST))),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{cleared:!0}}))}function Wd(){if(!(typeof window>"u"||!window.localStorage))try{localStorage.removeItem("cinepulse_epg_live_cache"),localStorage.removeItem("sineflix_epg_cache_v2");for(let t=0;t<localStorage.length;t++){const i=localStorage.key(t);i&&(i.startsWith("cinepulse_home_fast_")||i.startsWith("sineflix_home_fast_"))&&localStorage.removeItem(i)}const e=localStorage.getItem("sineflix_notifications_v1");if(e)try{const t=JSON.parse(e);Array.isArray(t)&&t.length>25&&localStorage.setItem("sineflix_notifications_v1",JSON.stringify(t.slice(0,25)))}catch{}}catch{}}Wd();const Yd="https://api.themoviedb.org/3",Es=["4e44d9029b1270a757cddc766a1bcb63","844dba0bfd8f3a4f3799f6130ef9e335"];let Ka=0;function Vd(){return Es[Ka]}function ho(){Ka=(Ka+1)%Es.length}const Je={POSTER_SMALL:"https://image.tmdb.org/t/p/w185",POSTER_MEDIUM:"https://image.tmdb.org/t/p/w342",BACKDROP_LARGE:"https://image.tmdb.org/t/p/w780",BACKDROP_XLARGE:"https://image.tmdb.org/t/p/w1280",BACKDROP_ORIGINAL:"https://image.tmdb.org/t/p/original",STILL_MEDIUM:"https://image.tmdb.org/t/p/w300"},Gd='<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750"><rect width="500" height="750" fill="#0b0f19"/><circle cx="250" cy="300" r="160" fill="#f59e0b" opacity="0.25"/><g transform="translate(190, 230) scale(2.5)" fill="none" stroke="#f59e0b" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></g><text x="250" y="430" font-family="sans-serif" font-weight="800" font-size="30" fill="#ffffff" text-anchor="middle">Cine<tspan fill="#f59e0b">Pulse</tspan></text><text x="250" y="470" font-family="sans-serif" font-weight="500" font-size="16" fill="#64748b" text-anchor="middle">Görsel Yüklenemedi</text></svg>',xt=`data:image/svg+xml,${encodeURIComponent(Gd)}`,Jd='<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#1e293b"/><circle cx="50" cy="40" r="18" fill="#64748b"/><path d="M 20 85 C 20 65, 80 65, 80 85 Z" fill="#64748b"/></svg>',pr=`data:image/svg+xml,${encodeURIComponent(Jd)}`;function at(e,t=Je.POSTER_MEDIUM){if(!e||e==="null"||e==="undefined"||e==="")return xt;if(e.startsWith("http")||e.startsWith("data:"))return e;let i=e;try{for(;i.includes("%");){const n=decodeURIComponent(i);if(n===i)break;i=n}}catch{}return i=i.replace(/^\/+/,"/"),i.startsWith("/")||(i=`/${i}`),i==="/"||i==="/null"||i==="/undefined"?xt:`${t}${i}`}const ha={};async function Ts(e){if(!e||e.trim().length===0)return"";if(ha[e])return ha[e];try{const t=`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=tr&dt=t&q=${encodeURIComponent(e)}`,i=await fetch(t,{signal:AbortSignal.timeout(1200)});if(i.ok){const n=await i.json();if(n&&n[0]){const r=n[0].map(a=>a[0]).join("");return ha[e]=r,r}}}catch{}return e}const ma=new Map;async function me(e,t={}){const i=`${e}_${JSON.stringify(t)}`;if(ma.has(i))return ma.get(i);for(let n=0;n<Es.length;n++)try{const r=new URL(`${Yd}${e}`);r.searchParams.append("api_key",Vd());for(let o in t)t[o]!==void 0&&t[o]!==null&&r.searchParams.append(o,t[o]);const a=await fetch(r.toString(),{signal:AbortSignal.timeout(6e3)});if(a.ok){const o=await a.json();return ma.set(i,o),o}else ho()}catch{ho()}return null}const Xd=new Set([64,84,4370]),Zd=new Set([10764]),Qd=["hayalet hikayeleri","a haunting","altin pesinde","gold rush","olumcul av","deadliest catch","hurda avcilari","salvage hunters","tamirat tadilat","wheeler dealers","agir yasamlar","my 600-lb life","evlilige 90 gun","90 day fiance","pasta ustalari","cake boss","agac ev ustalari","treehouse masters","alaska yi kurtarmak","alaskayi kurtarmak","alaska: the last frontier","oto kurtarma kulubu","fast n loud","nehir canavarlari","river monsters","kupon delileri","extreme couponing","temizlik bagimlilari","obsessive compulsive cleaners","asiri cimriler","extreme cheapskates","restoran kurtarma","depo savaslari","storage wars","gumruk kontrol","border security","nasil yapilir","how it's made","how its made","dmax","tlc"],eu=new Set([3072,34634,3126,45814,1356,45598,61498,59792,29849,23067,44383,44372]);function Xe(e){if(!e||e.id&&eu.has(Number(e.id))||(e.genre_ids||(Array.isArray(e.genres)?e.genres.map(r=>typeof r=="object"?r.id:r):[])).some(r=>Zd.has(Number(r))))return!0;const i=e.networks||[];if(Array.isArray(i)&&i.some(r=>Xd.has(Number(r.id||r))))return!0;const n=(e.title||e.name||e.original_title||e.original_name||"").toLowerCase().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c");for(const r of Qd)if(n.includes(r))return!0;return!!(Rt()&&!ni(e))}const As=[[180,["rafadan tayfa","kral sakir","niloya","pepee"]],[225,["miraculous","gumball","adventure time","regular show","teen titans go","ben 10","spongebob","sunger bob"]],[130,["masha and the bear","masa ile koca ayi","winx","scooby doo","ninjago","paw patrol","pijamaskeliler"]],[150,["samurai jack","johnny test","johnny bravo","dexter laboratory","powerpuff girls","courage cowardly dog"]],[110,["avatar the last airbender","avatar son hava bukucu","gravity falls","steven universe","the owl house","amphibia"]]],mo=[[180,["naruto","one piece","attack on titan","shingeki no kyojin","demon slayer","kimetsu no yaiba"]],[160,["jujutsu kaisen","death note","solo leveling","bleach","dragon ball"]],[140,["pokemon","beyblade","captain tsubasa","yu gi oh","bakugan","my hero academia","boku no hero"]],[120,["hunter x hunter","tokyo ghoul","fullmetal alchemist","vinland saga","monster","jojo","haikyuu","blue lock"]],[105,["chainsaw man","one punch man","spy x family","black clover","frieren","kaiju no 8","dandadan"]]],tu=[[320,["rick and morty","invincible","arcane","bojack horseman"]],[280,["south park","family guy","american dad","futurama","the simpsons"]],[250,["love death robots","harley quinn","archer","solar opposites"]],[220,["castlevania","blue eye samurai","the legend of vox machina","spawn","primal"]],[200,["big mouth","f is for family","disenchantment","inside job","smiling friends","hazbin hotel","helluva boss"]],[180,["boondocks","paradise pd","brickleberry","final space","scavengers reign","pantheon","undone","creature commandos"]]];function Or(e=""){return String(e).toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ı/g,"i").replace(/[^a-z0-9]+/g," ").trim()}function Cs(e){const t=String(e?.original_language||"").toLowerCase(),i=Array.isArray(e?.origin_country)?e.origin_country.map(n=>String(n).toUpperCase()):[];return["ja","zh","ko"].includes(t)||i.some(n=>["JP","CN","KR"].includes(n))}function iu(e,t=!1){const i=Or([e.name,e.title,e.original_name,e.original_title].filter(Boolean).join(" ")),n=t?mo:[...As,...mo];for(const[r,a]of n)if(a.some(o=>i.includes(o)))return r;return 0}function go(e){const t=Or([e.name,e.title,e.original_name,e.original_title].filter(Boolean).join(" "));for(const[i,n]of tu)if(n.some(r=>t.includes(r)))return i;return 0}function jl(e){const t=Or([e.name,e.title,e.original_name,e.original_title].filter(Boolean).join(" "));return As.some(([,i])=>i.some(n=>t.includes(n)))}function nu(e){const t=Or([e.name,e.title,e.original_name,e.original_title].filter(Boolean).join(" "));for(const[i,n]of As)if(n.some(r=>t.includes(r)))return i;return 0}function Nr(e,{animeOnly:t=!1}={}){return e.map(i=>{const n=Math.min(220,Number(i.popularity)||0),r=Math.min(95,Math.log10((Number(i.vote_count)||0)+1)*22),a=Math.max(0,(Number(i.vote_average)||0)-5)*5,o=!t&&i.origin_country?.includes("TR")?115:0,s=n+r+a+o+iu(i,t);return{...i,_turkeyPopularityScore:Math.round(s*100)/100}}).sort((i,n)=>n._turkeyPopularityScore-i._turkeyPopularityScore)}async function Wa(e=1){const[t,i,n,r,a]=await Promise.all([me("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16",without_genres:"27,80,53,10752,18","vote_count.gte":10,include_adult:!1}),me("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"10762",without_genres:"27,80,53","vote_count.gte":5,include_adult:!1}),me("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16",with_origin_country:"TR",without_genres:"27,80,53,10752,18",include_adult:!1}),me("/discover/tv",{sort_by:"vote_count.desc",page:e+2,language:"tr-TR",with_genres:"16",without_genres:"27,80,53,10752,18","vote_count.gte":10,include_adult:!1}),e===1?me("/trending/tv/week",{language:"tr-TR"}):Promise.resolve(null)]),o=(a?.results||[]).filter(d=>(d.genre_ids||[]).includes(16)),s=[...t?.results||[],...i?.results||[],...n?.results||[],...r?.results||[],...o],l=new Map;for(const d of s)d&&d.id&&!l.has(d.id)&&l.set(d.id,d);return Nr(Array.from(l.values()).filter(d=>(d.poster_path||d.backdrop_path)&&!Xe(d)).map(d=>({...d,type:"tv",media_type:"tv",isSeries:!0,overview:(d.overview||"").trim()||qe(d,"tv")})))}function ru(e){const t=new Map;for(const i of e)i?.id&&!t.has(i.id)&&t.set(i.id,i);return Nr(Array.from(t.values()).filter(i=>{const n=(i.genre_ids||[]).map(Number);return(i.poster_path||i.backdrop_path)&&n.includes(16)&&(n.includes(10751)||n.includes(10762)||jl(i))&&!Cs(i)&&ni(i)&&!Xe(i)}).map(i=>({...i,type:"tv",media_type:"tv",isSeries:!0,overview:(i.overview||"").trim()||qe(i,"tv")})))}async function Kl(e,t,i){const n=await Promise.all(t.map(([r,a])=>me("/discover/tv",{sort_by:i,page:e,language:"tr-TR",with_genres:"16",without_genres:"18,27,53,80,99,10752,10764,10766,10767","first_air_date.gte":r,"first_air_date.lte":a,include_adult:!1})));return ru(n.flatMap(r=>r?.results||[]))}async function yo(e=1){return Kl(e,[["2020-01-01","2099-12-31"],["2015-01-01","2019-12-31"]],"popularity.desc")}async function vo(e=1){return Kl(e,[["2010-01-01","2014-12-31"],["2000-01-01","2009-12-31"],["1990-01-01","1999-12-31"],["1900-01-01","1989-12-31"]],"vote_count.desc")}async function Ya(e=1){const[t,i,n]=await Promise.all([me("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16",without_genres:"10751,10762","vote_count.gte":80,include_adult:!1}),me("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"16",without_genres:"10751,10762","vote_average.gte":6.5,"vote_count.gte":150,include_adult:!1}),e===1?me("/trending/tv/week",{language:"tr-TR"}):Promise.resolve(null)]),r=(n?.results||[]).filter(o=>(o.genre_ids||[]).includes(16)),a=new Map;for(const o of[...t?.results||[],...i?.results||[],...r])o?.id&&!a.has(o.id)&&a.set(o.id,o);return Array.from(a.values()).filter(o=>{const s=(o.genre_ids||[]).map(Number);return(o.poster_path||o.backdrop_path)&&s.includes(16)&&!s.includes(10751)&&!s.includes(10762)&&!Cs(o)&&!jl(o)&&(e===1?go(o)>0:!0)&&!Xe(o)}).map(o=>{const s=Math.min(250,Number(o.popularity)||0),l=Math.min(130,Math.log10((Number(o.vote_count)||0)+1)*30),d=Math.max(0,(Number(o.vote_average)||0)-5)*8;return{...o,type:"tv",media_type:"tv",isSeries:!0,overview:(o.overview||"").trim()||qe(o,"tv"),_adultAnimationScore:s+l+d+go(o)}}).sort((o,s)=>s._adultAnimationScore-o._adultAnimationScore)}async function fr(e=1){const t=[["2020-01-01","2099-12-31"],["2015-01-01","2019-12-31"],["2010-01-01","2014-12-31"],["2000-01-01","2009-12-31"],["1990-01-01","1999-12-31"],["1980-01-01","1989-12-31"],["1900-01-01","1979-12-31"]],i=await Promise.all(t.map(([r,a])=>me("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"16",without_genres:"27,80,53,99,10764,10766,10767","first_air_date.gte":r,"first_air_date.lte":a,include_adult:!1}))),n=new Map;for(const r of i)for(const a of r?.results||[])a?.id&&!n.has(a.id)&&n.set(a.id,a);return Array.from(n.values()).filter(r=>{const a=(r.genre_ids||[]).map(Number);return(r.poster_path||r.backdrop_path)&&a.includes(16)&&!a.includes(99)&&!Cs(r)&&!Hr(r.name||r.title||"")&&!Xe(r)}).map(r=>{const a=parseInt(String(r.first_air_date||"").slice(0,4),10)||9999,o=Math.min(220,Number(r.popularity)||0),s=Math.min(115,Math.log10((Number(r.vote_count)||0)+1)*27),l=a<=2018?35:0;return{...r,type:"tv",media_type:"tv",isSeries:!0,overview:(r.overview||"").trim()||qe(r,"tv"),_cartoonScore:o+s+l+nu(r)}}).sort((r,a)=>a._cartoonScore-r._cartoonScore)}async function Va(e=1){const t=await me("/discover/movie",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"16,10751",without_genres:"27,80,53,10752","vote_count.gte":40});return!t||!t.results?[]:t.results.filter(i=>(i.poster_path||i.backdrop_path)&&!Xe(i)).map(i=>({...i,type:"movie",media_type:"movie",overview:(i.overview||"").trim()||qe(i,"movie")}))}async function bo(e=1){const t=await me("/discover/movie",{sort_by:"vote_average.desc",page:e,language:"tr-TR",with_genres:"12,14,10751","vote_count.gte":150,without_genres:"27,80,53"});return!t||!t.results?[]:t.results.filter(i=>(i.poster_path||i.backdrop_path)&&!Xe(i)).map(i=>({...i,type:"movie",media_type:"movie",overview:(i.overview||"").trim()||qe(i,"movie")}))}async function Wl(e="all",t="week",i=1){const[n,r]=await Promise.all([me(`/trending/${e}/${t}`,{page:i,language:"tr-TR"}),me(`/trending/${e}/${t}`,{page:i,language:"en-US"})]);if(!n||!n.results)return[];const a=new Map((r?.results||[]).map(o=>[o.id,o.overview]));return n.results.filter(o=>(o.poster_path||o.backdrop_path)&&!Xe(o)).map(o=>{const l=o.media_type==="tv"||!!o.first_air_date?"tv":"movie",d=(o.overview||"").trim(),p=(a.get(o.id)||"").trim();return{...o,type:l,media_type:l,overview:d||p||qe(o,l)}})}async function hr(e=1){const t=await me("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR","vote_count.gte":300,without_genres:"16"});return!t||!t.results?[]:t.results.filter(i=>(i.poster_path||i.backdrop_path)&&!Xe(i)).map(i=>{const n=(i.overview||"").trim();return{...i,type:"tv",media_type:"tv",overview:n||qe(i,"tv")}})}async function mr(e=1){const t=await me("/discover/movie",{sort_by:"vote_count.desc",page:e,language:"tr-TR","vote_count.gte":500});return!t||!t.results?[]:t.results.filter(i=>(i.poster_path||i.backdrop_path)&&!Xe(i)).map(i=>{const n=(i.overview||"").trim();return{...i,type:"movie",media_type:"movie",overview:n||qe(i,"movie")}})}function Hr(e){return e?/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\u1100-\u11ff\u3130-\u318f\ua960-\ua97f\ud7b0-\ud7ff\u0600-\u06ff\u0400-\u04ff\u0e00-\u0e7f]/.test(e):!1}async function gr(e=1){const[t,i,n,r]=await Promise.all([me("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16",with_original_language:"ja","vote_count.gte":50}),me("/discover/tv",{sort_by:"popularity.desc",page:e,language:"en-US",with_genres:"16",with_original_language:"ja","vote_count.gte":50}),me("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"16",with_original_language:"ja","vote_count.gte":100}),e===1?me("/trending/tv/week",{language:"tr-TR"}):Promise.resolve(null)]);if(!t||!t.results)return[];const a=new Map((i?.results||[]).map(s=>[s.id,s.name||s.title])),o=new Map([...t.results||[],...n?.results||[],...(r?.results||[]).filter(s=>s.original_language==="ja"&&(s.genre_ids||[]).includes(16))].map(s=>[s.id,s]));return Nr(Array.from(o.values()).filter(s=>(s.poster_path||s.backdrop_path)&&!Xe(s)).map(s=>{let l=s.name||s.title||"";return(!l||Hr(l))&&(l=a.get(s.id)||s.original_name||s.original_title||l),s.id&&Se(s.id),{...s,name:l,title:l,type:"anime",media_type:"anime",isAnime:!0,isSeries:!0,overview:s.overview||qe(s,"tv")}}),{animeOnly:!0})}async function Ga(e=1){const[t,i]=await Promise.all([me("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16,10762",with_original_language:"ja",without_genres:"27,80,53,10752,18","vote_count.gte":10}),me("/discover/tv",{sort_by:"popularity.desc",page:e,language:"en-US",with_genres:"16,10762",with_original_language:"ja",without_genres:"27,80,53,10752,18","vote_count.gte":10})]);if(!t||!t.results)return[];const n=new Map((i?.results||[]).map(r=>[r.id,r.name||r.title]));return Nr(t.results.filter(r=>(r.poster_path||r.backdrop_path)&&!Xe(r)).map(r=>{let a=r.name||r.title||"";return(!a||Hr(a))&&(a=n.get(r.id)||r.original_name||r.original_title||a),r.id&&Se(r.id),{...r,name:a,title:a,type:"anime",media_type:"anime",isAnime:!0,isSeries:!0,overview:r.overview||qe(r,"tv")}}),{animeOnly:!0})}async function yr(e=1){const[t,i]=await Promise.all([me("/discover/movie",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"99","vote_count.gte":40}),me("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"99","vote_count.gte":30})]),n=(t?.results||[]).filter(a=>(a.poster_path||a.backdrop_path)&&!Xe(a)).map(a=>({...a,type:"movie",media_type:"movie",overview:(a.overview||"").trim()||qe(a,"movie")})),r=(i?.results||[]).filter(a=>(a.poster_path||a.backdrop_path)&&!Xe(a)).map(a=>({...a,type:"tv",media_type:"tv",overview:(a.overview||"").trim()||qe(a,"tv")}));return[...n,...r].sort((a,o)=>(o.vote_count||0)-(a.vote_count||0))}async function au(e=1){const t=await me("/discover/movie",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"99,10751",without_genres:"27,80,53,10752","vote_count.gte":10}),i=await me("/discover/movie",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"99,16",without_genres:"27,80,53","vote_count.gte":5}),n=t?.results||[],r=i?.results||[],a=new Set,o=[];for(const l of[...n,...r])l&&l.id&&!a.has(l.id)&&(a.add(l.id),o.push(l));const s=["jackass","murder","killer","war","drug","crime","sex","violent","savaş","cinayet","uyuşturucu"];return o.filter(l=>{if(!(l.poster_path||l.backdrop_path)||Xe(l))return!1;const d=`${l.title||""} ${l.name||""} ${l.overview||""}`.toLowerCase();return!s.some(p=>d.includes(p))}).map(l=>({...l,type:"movie",media_type:"movie",overview:l.overview||qe(l,"movie")}))}async function Bi(e="tv",t=1){const[i,n]=await Promise.all([me(`/${e}/top_rated`,{page:t,language:"tr-TR"}),me(`/${e}/top_rated`,{page:t,language:"en-US"})]);if(!i||!i.results)return[];const r=new Map((n?.results||[]).map(a=>[a.id,a.overview]));return Promise.all(i.results.filter(a=>(a.poster_path||a.backdrop_path)&&!Xe(a)).map(async a=>{let o=(a.overview||"").trim();const s=(r.get(a.id)||"").trim();return(!o||o.length<15)&&s&&s.length>10&&(o=await Ts(s)),{...a,type:e,media_type:e,overview:o||s||qe(a,e)}}))}async function Yl({type:e="tv",genreId:t=null,page:i=1,sortBy:n="popularity.desc",minRating:r=0,isAnime:a=!1,isDoc:o=!1,yearMin:s=null,yearMax:l=null,withNetworks:d=null,withProviders:p=null}){const h={sort_by:n,page:i,language:"tr-TR"};return a?(h.with_genres=t?`16,${t}`:"16",h.with_original_language="ja"):o?h.with_genres=t?`99,${t}`:"99":t&&(h.with_genres=t),r>0&&(h["vote_average.gte"]=r,h["vote_count.gte"]=40),s&&(e==="movie"?h["primary_release_date.gte"]=`${s}-01-01`:h["first_air_date.gte"]=`${s}-01-01`),l&&(e==="movie"?h["primary_release_date.lte"]=`${l}-12-31`:h["first_air_date.lte"]=`${l}-12-31`),d&&(e==="tv"?h.with_networks=d:(h.with_watch_providers=p||d,h.watch_region="TR")),((await me(e==="movie"?"/discover/movie":"/discover/tv",h))?.results||[]).filter(w=>(w.poster_path||w.backdrop_path)&&!Xe(w)).map(w=>(a&&w.id&&Se(w.id),{...w,type:a?"anime":e,media_type:a?"anime":e,isAnime:a,isSeries:e==="tv"}))}function qe(e,t="tv"){if(!e)return"Sürükleyici atmosferi ve zengin hikaye örgüsüyle izleyicileri ekran başına kilitleyen etkileyici bir yapım.";const i=e.title||e.name||"Bu yapım",n=t==="tv"||e.media_type==="tv"||!!e.first_air_date||e.seasons&&e.seasons.length>0||!!e.number_of_seasons,r=n?"dizi":"film";let a=[];Array.isArray(e.genres)&&e.genres.length>0&&(a=e.genres.map(b=>typeof b=="string"?b:b.name).filter(Boolean));const o=a.length>0?a.slice(0,3).join(", "):n?"Dram ve Gerilim":"Sinema",s=e.release_date||e.first_air_date||(e.year?String(e.year):""),l=s?` ${s.slice(0,4)} yılında izleyiciyle buluşan ve`:"",d=Number(e.vote_average||e.rating||0),p=d>0?`IMDb'de ${d.toFixed(1)}/10 gibi başarılı bir puana sahip olan`:"Eleştirmenler ve izleyiciler tarafından büyük beğeni toplayan";let h="";const f=e.credits?.cast||[];if(f.length>0){const b=f.slice(0,3).map(E=>E.name).filter(Boolean).join(", ");b&&(h=` Başrollerinde ${b} gibi başarılı isimlerin yer aldığı`)}let v="";const y=e.credits?.crew?.filter(b=>b.job==="Director").map(b=>b.name)||[],w=e.created_by?.map(b=>b.name)||[],k=y[0]||w[0];k&&(v=` ${k} imzalı`);let m="";return e.tagline&&e.tagline.trim().length>6&&(m=` "${e.tagline.trim()}" temasıyla dikkat çeken yapım,`),`${i}, ${o} türünde öne çıkan${l}${v}${h} etkileyici bir ${r} deneyimi sunuyor.${m} ${p} yapım, beklenmedik ters köşeleri, derin karakter gelişimleri ve soluksuz temposuyla izleyenlere unutulmaz anlar vadediyor.`}async function wo(e="tv",t){const i=await me(`/${e}/${t}`,{append_to_response:"credits,similar,recommendations,videos,external_ids",language:"tr-TR"});if(!i)return null;(i.original_language==="ja"||Array.isArray(i.origin_country)&&i.origin_country.includes("JP"))&&Array.isArray(i.genres)&&i.genres.some(s=>s.id===16||/anim/i.test(s.name))&&i.id&&Se(i.id);let r=(i.overview||"").trim();if(!r||r.length<15)try{const s=await me(`/${e}/${t}`,{language:"en-US"});if(s&&s.overview&&s.overview.trim().length>10){const l=await Ts(s.overview.trim());l&&l.length>15&&(i.overview=l)}}catch{}(!i.overview||i.overview.trim().length<15)&&(i.overview=qe(i,e));let a=i.videos?.results||[];if(!a.some(s=>s.site==="YouTube"&&(s.type==="Trailer"||s.type==="Teaser")))try{const l=(await me(`/${e}/${t}/videos`,{language:"en-US"}))?.results||[];l.length>0&&(i.videos=i.videos||{},i.videos.results=[...a,...l])}catch{}return i}const Dn=new Map;function ga(e,t){if(!e||e.site!=="YouTube"||!e.key)return-1;let n={Trailer:500,Teaser:360,Promo:280,"Opening Credits":240,Clip:160,Featurette:100}[e.type]||50;return e.official===!0&&(n+=1e3),t==="tr"?n+=50:t==="en"?n+=25:t==="ja"&&(n+=15),/official|resmi|final trailer|main trailer|tanıtım|fragman/i.test(e.name||"")&&(n+=80),/fan|concept|reaction|breakdown/i.test(e.name||"")&&(n-=800),n}function xn(e="tv",t,i=""){if($t().trailersEnabled===!1)return Promise.resolve(null);const n=`${e}:${t}`;if(Dn.has(n))return Dn.get(n);const r=(async()=>{try{const[a,o,s]=await Promise.all([me(`/${e}/${t}/videos`,{language:"tr-TR"}).catch(()=>null),me(`/${e}/${t}/videos`,{language:"en-US"}).catch(()=>null),me(`/${e}/${t}/videos`,{include_video_language:"tr,en,ja,ko,null"}).catch(()=>null)]),l=new Set,d=[],p=(f,v)=>{if(Array.isArray(f))for(const y of f)y&&y.key&&!l.has(y.key)&&(l.add(y.key),d.push({video:y,language:v||y.iso_639_1||"en"}))};p(a?.results,"tr"),p(o?.results,"en"),p(s?.results,""),d.sort((f,v)=>ga(v.video,v.language)-ga(f.video,f.language));const h=d.find(f=>ga(f.video,f.language)>=0)?.video;if(h?.key){const f=h.key.trim(),v=encodeURIComponent(f);return{key:f,name:h.name||"Resmi Fragman",site:h.site,type:h.type,embedUrl:`https://www.youtube.com/embed/${v}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,watchUrl:`https://www.youtube.com/watch?v=${v}`}}if(i&&typeof i=="string"&&i.trim().length>1){const f=i.trim(),v=`${f} Fragman`;return{key:"",name:`${f} Tanıtım`,site:"YouTube",type:"Trailer",embedUrl:`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(v)}&autoplay=1&rel=0`,watchUrl:`https://www.youtube.com/results?search_query=${encodeURIComponent(v)}`}}}catch{}return null})();return Dn.set(n,r),r.then(a=>{a||Dn.delete(n)}),r}async function su(e,t=1){const i=await me(`/tv/${e}/season/${t}`,{language:"tr-TR"});if(!i||!i.episodes)return i;const n=await me(`/tv/${e}/season/${t}`,{language:"en-US"});return await Promise.all(i.episodes.map(async(r,a)=>{let o=r.overview?r.overview.trim():"";(!o||o.length<5)&&n&&n.episodes&&n.episodes[a]&&n.episodes[a].overview&&(o=n.episodes[a].overview),o&&(!r.overview||r.overview.length<5)&&(r.overview=await Ts(o))})),i}async function Ls(e,t=1){if(!e||!e.trim())return[];const i=e.trim().toLowerCase(),[n,r,a]=await Promise.all([me("/search/multi",{query:i,page:t,language:"tr-TR",include_adult:!1}),me("/search/multi",{query:i,page:t,language:"en-US",include_adult:!1}),me("/search/tv",{query:i,page:t,language:"tr-TR",include_adult:!1})]),o=new Map,s=d=>{if(Array.isArray(d)){for(const p of d)if(!(!p||!p.id)&&!(!p.poster_path&&!p.backdrop_path)&&!Xe(p)&&!o.has(p.id)){const h=p.media_type==="tv"||!!p.first_air_date||p.name&&!p.title;o.set(p.id,{...p,type:h?"tv":"movie",media_type:h?"tv":"movie"})}}};s(n?.results),s(r?.results),s(a?.results);const l=Array.from(o.values());return l.sort((d,p)=>{const h=(d.title||d.name||d.original_title||d.original_name||"").toLowerCase(),f=(p.title||p.name||p.original_title||p.original_name||"").toLowerCase(),v=h===i?100:h.startsWith(i)?50:0,y=f===i?100:f.startsWith(i)?50:0,w=v+Math.min(100,(d.vote_count||0)/50)+(d.popularity||0)*.5;return y+Math.min(100,(p.vote_count||0)/50)+(p.popularity||0)*.5-w}),l}const bt={ACTION_ADVENTURE:10759,ANIMATION:16,COMEDY:35,CRIME:80,DOCUMENTARY:99,DRAMA:18,FAMILY:10751,MYSTERY:9648,SCI_FI_FANTASY:10765,WAR_POLITICS:10768,WESTERN:37},Ge={ACTION:28,ADVENTURE:12,ANIMATION:16,COMEDY:35,CRIME:80,DOCUMENTARY:99,DRAMA:18,FAMILY:10751,FANTASY:14,HISTORY:36,HORROR:27,MUSIC:10402,MYSTERY:9648,ROMANCE:10749,SCI_FI:878,THRILLER:53,WESTERN:37};async function ou(e){if(!e)return null;const t=await me(`/person/${e}`,{language:"tr-TR",append_to_response:"combined_credits"});if(!t||!t.biography||t.biography.trim().length===0){const i=await me(`/person/${e}`,{language:"en-US",append_to_response:"combined_credits"});if(i)if(t)t.biography=i.biography,!t.combined_credits&&i.combined_credits&&(t.combined_credits=i.combined_credits);else return i}return t}function Q(e,t="info",i=3500){const n=document.getElementById("toast-container");if(!n)return;const r=document.createElement("div");r.className=`toast toast-${t}`;let a="info";t==="success"&&(a="check-circle"),t==="error"&&(a="alert-circle"),r.innerHTML=`
    <i data-lucide="${a}"></i>
    <span>${e}</span>
  `,n.appendChild(r),J(),setTimeout(()=>{r.style.opacity="0",r.style.transform="translateX(100%)",r.style.transition="all 0.3s ease-out",setTimeout(()=>{r.parentNode&&r.parentNode.removeChild(r)},300)},i)}const yt="https://api.trakt.tv",lu="AsVFyJXykTMViLCXPMAvFGtk7B_npj5Y3STpzljYnwY",cu="4b6l8YaAG-GzyY6cSPFR5ea66xrXYEqrrHhn3FiWa7k",dt={TOKEN:"cinepulse_trakt_token",USER:"cinepulse_trakt_user",SETTINGS:"cinepulse_trakt_settings",LAST_SYNC:"cinepulse_trakt_last_sync"};let vi=null,vr=null,br=0;function qr(){return localStorage.getItem("cinepulse_trakt_custom_client_id")||lu}function Vl(){return localStorage.getItem("cinepulse_trakt_custom_client_secret")||cu}function Xi(){try{const e=localStorage.getItem(dt.SETTINGS);if(e)return JSON.parse(e)}catch{}return{autoScrobble:!0,scrobbleThreshold:80,autoSyncOnLaunch:!0}}function ko(e){const i={...Xi(),...e};return localStorage.setItem(dt.SETTINGS,JSON.stringify(i)),i}const _o=15*60*1e3;let So=!1,ya=!1,Gl=0;function Jl(e){if(So){ai()&&xo(e);return}So=!0;const t=()=>{document.visibilityState!=="hidden"&&(Date.now()-Gl<_o||xo(e))};window.setTimeout(t,4e3),window.setInterval(t,_o),document.addEventListener("visibilitychange",t)}async function xo(e){if(!(!Xi().autoSyncOnLaunch||!ai()||ya)){ya=!0,Gl=Date.now();try{(await Zl(e)).errors.length}catch{}finally{ya=!1}}}function Xl(){try{const e=localStorage.getItem(dt.TOKEN);return e?JSON.parse(e):null}catch{return null}}function ai(){const e=Xl();return!!(e&&e.access_token)}function du(){try{const e=localStorage.getItem(dt.USER);return e?JSON.parse(e):null}catch{return null}}function uu(){const e=localStorage.getItem(dt.LAST_SYNC);return e?Number(e):null}async function Si(){const e=Xl();if(!e||!e.access_token)return null;const t=Math.floor(Date.now()/1e3);if((e.created_at||0)+(e.expires_in||0)-t<86400&&e.refresh_token)try{const n=await hu(e.refresh_token);if(n?.access_token)return n.access_token}catch{}return e.access_token}async function pu(){const e=qr(),t=await fetch(`${yt}/oauth/device/code`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({client_id:e})});if(!t.ok){const i=await t.text();throw new Error(`Device code error (${t.status}): ${i}`)}return await t.json()}function fu(e,t=5,i=()=>{}){vi&&vi.abort(),vi=new AbortController;const{signal:n}=vi;return new Promise((r,a)=>{const o=qr(),s=Vl();let l=Math.max(t,5)*1e3;const d=async()=>{if(n.aborted){a(new Error("Auth polling cancelled"));return}try{const p=await fetch(`${yt}/oauth/device/token`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:e,client_id:o,client_secret:s}),signal:n});if(p.status===200){const f=await p.json();localStorage.setItem(dt.TOKEN,JSON.stringify(f));let v=null;try{v=await gu(f.access_token),v&&localStorage.setItem(dt.USER,JSON.stringify(v))}catch{}window.dispatchEvent(new CustomEvent("cinepulse_trakt_auth_changed",{detail:{connected:!0,user:v}})),r(f);return}if(p.status===400){i({status:"pending",message:"Kullanıcı onayı bekleniyor..."}),n.aborted||setTimeout(d,l);return}if(p.status===404)throw new Error("Geçersiz cihaz kodu.");if(p.status===409)throw new Error("Bu kod zaten kullanılmış.");if(p.status===410)throw new Error("Kodun süresi doldu. Lütfen tekrar deneyin.");if(p.status===429){l+=2e3,n.aborted||setTimeout(d,l);return}const h=await p.text();throw new Error(`Trakt auth failed: ${h}`)}catch(p){if(n.aborted)return;a(p)}};setTimeout(d,l)})}function Ja(){vi&&(vi.abort(),vi=null)}async function hu(e){const t=qr(),i=Vl(),n=await fetch(`${yt}/oauth/token`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refresh_token:e,client_id:t,client_secret:i,grant_type:"refresh_token"})});if(!n.ok)throw new Error("Token refresh failed");const r=await n.json();return localStorage.setItem(dt.TOKEN,JSON.stringify(r)),r}function mu(){Ja(),localStorage.removeItem(dt.TOKEN),localStorage.removeItem(dt.USER),localStorage.removeItem(dt.LAST_SYNC),window.dispatchEvent(new CustomEvent("cinepulse_trakt_auth_changed",{detail:{connected:!1}}))}function Ht(e){return{"Content-Type":"application/json","trakt-api-version":"2","trakt-api-key":qr(),Authorization:`Bearer ${e}`}}async function gu(e=null){const t=e||await Si();if(!t)return null;const i=await fetch(`${yt}/users/me?extended=full`,{headers:Ht(t)});if(!i.ok)return null;const n=await i.json();return localStorage.setItem(dt.USER,JSON.stringify(n)),n}function Is(e,t=0){const i=Math.min(100,Math.max(0,Math.round(t))),n=e.tmdbId||e.id;return(e.isSeries===!0?!0:e.isSeries===!1||e.type==="movie"?!1:!!(e.type==="tv"||e.season&&Number(e.season)>0&&e.type!=="movie"))?{show:{title:e.seriesTitle||e.title||"",ids:{tmdb:Number(n)||void 0}},episode:{season:Math.max(1,Number(e.season)||1),number:Math.max(1,Number(e.episode)||1)},progress:i,app_version:"2.0.0",app_date:"2026-09-25"}:{movie:{title:e.title||"",ids:{tmdb:Number(n)||void 0}},progress:i,app_version:"2.0.0",app_date:"2026-09-25"}}async function Hm(e,t=0){if(!Xi().autoScrobble||!ai())return null;const n=Date.now();if(vr==="start"&&n-br<8e3)return null;const r=await Si();if(!r)return null;try{const a=Is(e,t),o=await fetch(`${yt}/scrobble/start`,{method:"POST",headers:Ht(r),body:JSON.stringify(a)});if(o.ok)return vr="start",br=n,await o.json()}catch{}return null}async function qm(e,t=0){if(!Xi().autoScrobble||!ai())return null;const n=await Si();if(!n)return null;try{const r=Is(e,t),a=await fetch(`${yt}/scrobble/pause`,{method:"POST",headers:Ht(n),body:JSON.stringify(r),keepalive:!0});if(a.ok)return vr="pause",br=Date.now(),await a.json()}catch{}return null}async function Fm(e,t=100){if(!Xi().autoScrobble||!ai())return null;const n=await Si();if(!n)return null;try{const r=Is(e,t),a=await fetch(`${yt}/scrobble/stop`,{method:"POST",headers:Ht(n),body:JSON.stringify(r),keepalive:!0});if(a.ok)return vr="stop",br=Date.now(),await a.json()}catch{}return null}async function yu(e){const t=await Si();if(!t||!e||!e.length)return null;const i=[],n=new Map;for(const s of e){const l=s.tmdbId||s.id,d=Number(l);if(!d||isNaN(d))continue;const p=new Date(Number(s.lastWatchedAt)||s.lastWatchedAt||Date.now()),h=Number.isNaN(p.getTime())?new Date().toISOString():p.toISOString();if(s.type==="movie"?!1:!!(s.isSeries||s.type==="tv"||s.type==="anime")){const v=Math.max(1,Number(s.season)||1),y=Math.max(1,Number(s.episode)||1);n.has(d)||n.set(d,{title:s.title||"",ids:{tmdb:d},seasonsMap:new Map});const w=n.get(d);w.seasonsMap.has(v)||w.seasonsMap.set(v,[]),w.seasonsMap.get(v).push({number:y,watched_at:h})}else i.push({title:s.title||"",watched_at:h,ids:{tmdb:d}})}const r=Array.from(n.values()).map(s=>({title:s.title,ids:s.ids,seasons:Array.from(s.seasonsMap.entries()).map(([l,d])=>({number:l,episodes:d}))}));if(i.length===0&&r.length===0)return null;const a={};i.length>0&&(a.movies=i),r.length>0&&(a.shows=r);const o=await fetch(`${yt}/sync/history`,{method:"POST",headers:Ht(t),body:JSON.stringify(a)});if(!o.ok){const s=await o.text();throw new Error(`Trakt API Hatası (${o.status}): ${s}`)}return await o.json()}const vu="4e44d9029b1270a757cddc766a1bcb63",va=new Map;async function ba(e,t=!1){const i=`${t?"tv":"movie"}_${e}`;if(va.has(i))return va.get(i);try{const r=await fetch(`https://api.themoviedb.org/3/${t?"tv":"movie"}/${e}?api_key=${vu}&language=tr-TR`);if(r.ok){const a=await r.json();return va.set(i,a),a}}catch{}return null}async function Eo(e,t){const i=[],n=new Set,r=e==="shows"?100:250;for(let a=1;;a++){const o=new URLSearchParams({page:String(a),limit:String(r)});e==="shows"&&o.set("extended","progress");const s=await fetch(`${yt}/sync/watched/${e}?${o}`,{headers:Ht(t)});if(!s.ok)throw new Error(`İzlenen ${e==="shows"?"diziler":"filmler"} alınamadı (${s.status})`);const l=await s.json();if(!Array.isArray(l))throw new Error("Trakt izlenenler yanıtı geçersiz");if(l.length===0)break;let d=0;for(const h of l){const f=h[e==="shows"?"show":"movie"]?.ids?.trakt;f&&n.has(f)||(f&&n.add(f),i.push(h),d++)}if(!d)break;const p=Number(s.headers?.get("X-Pagination-Page-Count"));if(p&&a>=p||!p&&l.length<r)break}return i}async function bu(e){const t=await Si();if(!t)return{importedPlaybackCount:0,importedHistoryCount:0};const{saveWatchProgress:i,saveBatchWatchProgress:n,getWatchHistory:r}=e;if(!i&&!n)return{importedPlaybackCount:0,importedHistoryCount:0};let a=0,o=0;const s=[],l=[],d=r?r():[],p=new Map;for(const h of d){const f=`${h.id}_${h.season||1}_${h.episode||1}`;p.set(f,h)}try{const h=await fetch(`${yt}/sync/playback?extended=full&limit=50`,{headers:Ht(t),signal:AbortSignal.timeout(8e3)});if(h.ok){const f=await h.json();if(Array.isArray(f)){for(const v of f){const y=v.type==="movie",w=y?v.movie:v.show||v.episode,k=y?v.movie?.ids?.tmdb||w?.ids?.tmdb:v.show?.ids?.tmdb||v.episode?.ids?.tmdb||w?.ids?.tmdb;if(!k)continue;const m=y?1:v.episode?.season||1,b=y?1:v.episode?.number||1,E=Math.min(99,Math.max(1,Math.round(v.progress||0))),C=v.paused_at?new Date(v.paused_at).getTime():Date.now(),_=`${k}_${m}_${b}`,T=p.get(_);let I=T?.poster_path||T?.posterPath||"",L=T?.backdrop_path||T?.backdropPath||"",N=T?.title||v.show?.title||w?.title||"",O=y?6600:3e3,K={};if(!I||!N){const z=await ba(k,!y);z&&(I=z.poster_path||"",L=z.backdrop_path||"",N=z.title||z.name||N,z.runtime?O=z.runtime*60:z.episode_run_time?.[0]&&(O=z.episode_run_time[0]*60),y||(K={number_of_episodes:z.number_of_episodes,number_of_seasons:z.number_of_seasons,status:z.status,seasons:z.seasons}))}const F=Math.max(60,Math.round(E/100*O));l.push({id:k,title:N,posterPath:I,backdropPath:L,type:y?"movie":"tv",isSeries:!y,season:y?void 0:m,episode:y?void 0:b,currentTime:F,duration:O,progressPercent:E,completed:!1,traktImported:!0,lastWatchedAt:C,...K}),a++}l.length>0&&(n?n(l):i&&l.forEach(v=>i(v)),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{action:"playback_import",source:"trakt"}})))}}}catch(h){s.push(h.message)}try{{const h=await Eo("movies",t);if(Array.isArray(h))for(let f=0;f<h.length;f+=5){const v=h.slice(f,f+5);await Promise.all(v.map(async y=>{const w=y.movie?.ids?.tmdb;if(!w)return;const k=`${w}_1_1`,m=p.get(k);if(m&&m.completed)return;const b=y.last_watched_at?new Date(y.last_watched_at).getTime():Date.now();let E=m?.poster_path||m?.posterPath||"",C=m?.backdrop_path||m?.backdropPath||"",_=m?.title||y.movie?.title||"",T=6600;if(!E||!_){const I=await ba(w,!1);I&&(E=I.poster_path||"",C=I.backdrop_path||"",_=I.title||_,I.runtime&&(T=I.runtime*60))}l.push({id:w,title:_,posterPath:E,backdropPath:C,type:"movie",isSeries:!1,currentTime:T,duration:T,progressPercent:100,completed:!0,traktImported:!0,lastWatchedAt:b}),o++}))}}}catch(h){s.push(h.message)}try{{const h=await Eo("shows",t);if(Array.isArray(h))for(let f=0;f<h.length;f+=4){const v=h.slice(f,f+4);await Promise.all(v.map(async y=>{const w=y.show?.ids?.tmdb;if(!w)return;const k=y.show?.title||"",m=await ba(w,!0),b=m?.poster_path||"",E=m?.backdrop_path||"",C=m?.name||m?.title||k,_=m?.episode_run_time?.[0]?m.episode_run_time[0]*60:3e3,T={number_of_episodes:m?.number_of_episodes,number_of_seasons:m?.number_of_seasons,status:m?.status,seasons:m?.seasons},I=Array.isArray(y.seasons)?y.seasons:[];for(const L of I){const N=L.number,O=Array.isArray(L.episodes)?L.episodes:[];for(const K of O){const F=K.number,z=`${w}_${N}_${F}`,P=p.get(z);if(P&&P.completed)continue;const Y=K.last_watched_at?new Date(K.last_watched_at).getTime():Date.now();l.push({id:w,title:C,posterPath:b,backdropPath:E,type:"tv",isSeries:!0,season:N,episode:F,currentTime:_,duration:_,progressPercent:100,completed:!0,traktImported:!0,lastWatchedAt:Y,...T}),o++}}}))}}}catch(h){s.push(h.message)}if(l.length>0){if(n)n(l);else if(i)for(const h of l)i(h)}return window.dispatchEvent(new CustomEvent("cinepulse_data_changed",{detail:{action:"import",source:"trakt"}})),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{action:"import",source:"trakt"}})),{importedPlaybackCount:a,importedHistoryCount:o,errors:s}}async function Zl(e){if(!ai())throw new Error("Trakt hesabı bağlı değil");const{getWatchHistory:t,saveWatchProgress:i,saveBatchWatchProgress:n}=e,r={pushedMoviesCount:0,pushedEpisodesCount:0,importedPlaybackCount:0,importedHistoryCount:0,errors:[]};if(i||n)try{const a=await bu(e);r.importedPlaybackCount=a.importedPlaybackCount||0,r.importedHistoryCount=a.importedHistoryCount||0,r.errors.push(...a.errors||[])}catch(a){r.errors.push(`Trakt'tan aktarma: ${a.message}`)}try{const o=(t?t():[]).filter(s=>s.completed&&!s.traktImported);if(o.length>0){const s=await yu(o);if(s&&s.added){r.pushedMoviesCount=s.added.movies||0,r.pushedEpisodesCount=s.added.episodes||0;const l=Object.values(s.not_found||{}).reduce((d,p)=>d+(Array.isArray(p)?p.length:0),0);l&&r.errors.push(`Trakt ${l} içeriği katalogunda bulamadı`)}}}catch(a){r.errors.push(`Trakt'a gönderme: ${a.message||"Senkronizasyon hatası"}`)}return r.errors.length===0&&localStorage.setItem(dt.LAST_SYNC,String(Date.now())),r}async function wu(){const e=await Si();if(!e)throw new Error("Trakt hesabı bağlı değil");const t=await fetch(`${yt}/sync/history?limit=1000`,{headers:Ht(e)});if(!t.ok)throw new Error("Trakt geçmişi alınamadı");const i=await t.json();if(!Array.isArray(i)||i.length===0)return 0;const n=i.map(o=>o.id).filter(Boolean);if(n.length===0)return 0;const r=await fetch(`${yt}/sync/history/remove`,{method:"POST",headers:Ht(e),body:JSON.stringify({ids:n})});if(!r.ok){const o=await r.text();throw new Error(`Trakt geçmişi silinemedi: ${o}`)}const a=await r.json();return(a.deleted?.movies||0)+(a.deleted?.episodes||0)}let di=null;function wr(){let e=document.getElementById("trakt-modal");e||(e=document.createElement("div"),e.id="trakt-modal",e.className="modal-backdrop",document.body.appendChild(e));const t=(r="main",a={})=>{const o=ai(),s=du(),l=Xi(),d=uu();let p="Henüz yapılmadı";if(d){const h=new Date(d);p=`${h.toLocaleDateString("tr-TR")} ${h.toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})}`}if(r==="connecting"){const{userCode:h,verificationUrl:f,expiresIn:v}=a;e.innerHTML=`
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
      `;e.classList.remove("hidden"),document.body.style.overflow="hidden",J(e),n(r)},i=()=>{Ja(),e.classList.add("hidden"),e.innerHTML="",document.body.style.overflow="",di&&(window.removeEventListener("keydown",di),di=null)},n=r=>{const a=document.getElementById("trakt-close-btn"),o=document.getElementById("trakt-close-footer-btn");if(a&&(a.onclick=i),o&&(o.onclick=i),e.onclick=s=>{s.target===e&&i()},di&&window.removeEventListener("keydown",di),di=s=>{s.key==="Escape"&&i()},window.addEventListener("keydown",di),r==="connecting"){const s=document.getElementById("btn-copy-trakt-code");s&&(s.onclick=()=>{const d=s.querySelector(".trakt-code-text")?.textContent;d&&navigator.clipboard.writeText(d).then(()=>{Q("Aktivasyon kodu kopyalandı!","success")}).catch(()=>{Q(`Kod: ${d}`,"info")})});const l=document.getElementById("btn-cancel-trakt-poll");l&&(l.onclick=()=>{Ja(),t("main")})}else{const s=document.getElementById("btn-start-trakt-connect");s&&(s.onclick=async()=>{s.disabled=!0,s.innerHTML="<span>Kod alınıyor...</span>";try{const y=await pu();t("connecting",{userCode:y.user_code,verificationUrl:y.verification_url,expiresIn:y.expires_in}),fu(y.device_code,y.interval,w=>{const k=document.getElementById("trakt-poll-status-text");k&&(k.textContent=w.message)}).then(()=>{Q("Trakt.tv başarıyla bağlandı!","success"),t("main")}).catch(w=>{w.message!=="Auth polling cancelled"&&(Q(`Bağlantı hatası: ${w.message}`,"error"),t("main"))})}catch(y){Q(`Trakt bağlantı başlatılamadı: ${y.message}`,"error"),t("main")}});const l=document.getElementById("btn-trakt-sync-now");l&&(l.onclick=async()=>{const y=document.getElementById("trakt-sync-icon"),w=document.getElementById("trakt-sync-result");l.disabled=!0,y&&y.classList.add("trakt-spin");try{const k=await Zl({getWatchHistory:Be,saveWatchProgress:Ss,saveBatchWatchProgress:Dl});w&&(w.style.display="block",w.innerHTML=`
                <strong>${k.errors.length?"Senkronizasyon kısmen tamamlandı":"✓ Karşılıklı senkronizasyon tamamlandı!"}</strong><br/>
                • ${k.pushedMoviesCount} film & ${k.pushedEpisodesCount} dizi Trakt'a yüklendi<br/>
                • ${k.importedPlaybackCount} yarım kalan & ${k.importedHistoryCount} izlenen Trakt'tan CinePulse'a aktarıldı
              `),k.errors.length?Q(`Trakt senkronizasyon uyarısı: ${k.errors.join("; ")}`,"error"):(Q("CinePulse ve Trakt başarıyla karşılıklı eşitlendi!","success"),setTimeout(()=>t("main"),2500))}catch(k){Q(`Aktarım hatası: ${k.message}`,"error")}finally{l.disabled=!1,y&&y.classList.remove("trakt-spin")}});const d=document.getElementById("btn-clean-trakt-history");d&&(d.onclick=()=>{const y=Pd();Q(`${y} adet hatalı Trakt kaydı geçmişten temizlendi!`,"success"),t("main")});const p=document.getElementById("btn-wipe-trakt-history");p&&(p.onclick=async()=>{if(confirm("Trakt.tv hesabınızdaki tüm izleme geçmişini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")){p.disabled=!0,p.innerHTML="<span>Sıfırlanıyor...</span>";try{const y=await wu();Q(`Trakt hesabından ${y} adet kayıt tamamen silindi!`,"success"),t("main")}catch(y){Q(`Hata: ${y.message}`,"error"),p.disabled=!1,t("main")}}});const h=document.getElementById("trakt-toggle-autosync");h&&(h.onchange=y=>{ko({autoSyncOnLaunch:y.target.checked}),Q(y.target.checked?"Açılışta otomatik eşitleme açıldı":"Açılışta otomatik eşitleme kapatıldı","info")});const f=document.getElementById("trakt-toggle-scrobble");f&&(f.onchange=y=>{ko({autoScrobble:y.target.checked}),Q(y.target.checked?"Otomatik Scrobble açıldı":"Otomatik Scrobble kapatıldı","info")});const v=document.getElementById("btn-trakt-disconnect");v&&(v.onclick=()=>{confirm("Trakt.tv bağlantısını kesmek istediğinize emin misiniz?")&&(mu(),Q("Trakt.tv bağlantısı kesildi","info"),t("main"))})}};t("main")}function Ql(){const e=document.getElementById("data-modal");if(!e)return;const t=jd();e.innerHTML=`
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
            <div>• Bağlantı: <strong>${ai()?'<span style="color:#4ade80;">● Bağlı</span>':'<span style="color:#94a3b8;">○ Bağlı Değil</span>'}</strong></div>
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
  `,e.classList.remove("hidden"),document.body.style.overflow="hidden",J();const i=document.getElementById("data-close-btn"),n=document.getElementById("data-close-footer-btn");let r=null;const a=()=>{e.classList.add("hidden"),e.innerHTML="",document.body.style.overflow="",r&&(window.removeEventListener("keydown",r),r=null)};i&&i.addEventListener("click",a),n&&n.addEventListener("click",a),e.onclick=f=>{f.target===e&&a()},r=f=>{f.key==="Escape"&&a()},window.addEventListener("keydown",r);const o=document.getElementById("btn-export-json");o&&o.addEventListener("click",()=>{Fl(),Q("JSON yedek dosyası indirildi!","success")});const s=document.getElementById("btn-open-trakt-from-data");s&&s.addEventListener("click",()=>{a(),wr()});const l=document.getElementById("json-dropzone"),d=document.getElementById("json-file-input");l&&d&&(l.addEventListener("click",()=>d.click()),l.addEventListener("dragover",f=>{f.preventDefault(),l.style.borderColor="var(--accent-green)"}),l.addEventListener("dragleave",()=>{l.style.borderColor="rgba(99, 102, 241, 0.4)"}),l.addEventListener("drop",f=>{f.preventDefault(),l.style.borderColor="rgba(99, 102, 241, 0.4)",f.dataTransfer.files.length>0&&p(f.dataTransfer.files[0])}),d.addEventListener("change",f=>{f.target.files.length>0&&p(f.target.files[0])}));function p(f){if(!f)return;const v=new FileReader;v.onload=y=>{try{const w=document.querySelector('input[name="import-mode"]:checked'),k=w?w.value:"merge",m=Ul(y.target.result,k);m.success?(Q(`✓ Yedek yüklendi! (${m.countHistory} izleme kaydı, ${m.countFavs} favori aktarıldı)`,"success"),a()):Q(`Yükleme hatası: ${m.message||m.error}`,"error")}catch(w){Q(`Yedek dosyası işlenirken hata oluştu: ${w.message}`,"error")}},v.onerror=()=>{Q("Dosya okunamadı.","error")},v.readAsText(f)}const h=document.getElementById("btn-clear-all-data");h&&h.addEventListener("click",()=>{confirm("Tüm izleme geçmişinizi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!")&&(Kd(),Q("Tüm yerel veriler temizlendi.","info"),a())})}let Di=null,gn=!1;function kr(){return window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===!0||document.referrer.includes("android-app://")}function ku(){if(kr()){gn=!0,tn(!1);return}window.addEventListener("beforeinstallprompt",t=>{t.preventDefault(),Di=t,tn(!0)}),window.addEventListener("appinstalled",()=>{Di=null,gn=!0,tn(!1),Q("CinePulse başarıyla cihazınıza yüklendi!","success")}),window.matchMedia("(display-mode: standalone)").addEventListener("change",t=>{t.matches&&(gn=!0,tn(!1))}),/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream&&!kr()&&setTimeout(()=>{tn(!0)},1e3)}function tn(e){document.querySelectorAll(".btn-pwa-install").forEach(i=>{e&&!gn&&!kr()?i.classList.remove("hidden"):i.classList.add("hidden")})}async function _u(){if(kr()||gn){Q("CinePulse zaten bir uygulama olarak yüklü.","info");return}if(Di){try{Di.prompt(),(await Di.userChoice).outcome==="accepted"?Q("Yükleme başlatıldı...","success"):Q("Yükleme iptal edildi.","info"),Di=null}catch{}return}/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream?Su():xu()}function Su(){let e=document.getElementById("pwa-ios-modal");e||(e=document.createElement("div"),e.id="pwa-ios-modal",e.className="modal-backdrop pwa-guide-modal",e.innerHTML=`
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
    `,document.body.appendChild(e),e.querySelector(".pwa-close-btn").addEventListener("click",()=>{e.classList.add("hidden")}),e.querySelector(".pwa-done-btn").addEventListener("click",()=>{e.classList.add("hidden")}),e.addEventListener("click",t=>{t.target===e&&e.classList.add("hidden")})),e.classList.remove("hidden")}function xu(){Q('Tarayıcınızın adres çubuğundaki "Yükle / Uygulamayı Yükle" simgesine tıklayarak indirebilirsiniz.',"info",5e3)}const Eu="modulepreload",Tu=function(e,t){return new URL(e,t).href},To={},Rs=function(t,i,n){let r=Promise.resolve();if(i&&i.length>0){const o=document.getElementsByTagName("link"),s=document.querySelector("meta[property=csp-nonce]"),l=s?.nonce||s?.getAttribute("nonce");r=Promise.allSettled(i.map(d=>{if(d=Tu(d,n),d in To)return;To[d]=!0;const p=d.endsWith(".css"),h=p?'[rel="stylesheet"]':"";if(!!n)for(let y=o.length-1;y>=0;y--){const w=o[y];if(w.href===d&&(!p||w.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${h}`))return;const v=document.createElement("link");if(v.rel=p?"stylesheet":Eu,p||(v.as="script"),v.crossOrigin="",v.href=d,l&&v.setAttribute("nonce",l),document.head.appendChild(v),p)return new Promise((y,w)=>{v.addEventListener("load",y),v.addEventListener("error",()=>w(new Error(`Unable to preload CSS for ${d}`)))})}))}function a(o){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=o,window.dispatchEvent(s),!s.defaultPrevented)throw o}return r.then(o=>{for(const s of o||[])s.status==="rejected"&&a(s.reason);return t().catch(a)})};var Ki;(function(e){e.Unimplemented="UNIMPLEMENTED",e.Unavailable="UNAVAILABLE"})(Ki||(Ki={}));class wa extends Error{constructor(t,i,n){super(t),this.message=t,this.code=i,this.data=n}}const Au=e=>{var t,i;return e?.androidBridge?"android":!((i=(t=e?.webkit)===null||t===void 0?void 0:t.messageHandlers)===null||i===void 0)&&i.bridge?"ios":"web"},Cu=e=>{const t=e.CapacitorCustomPlatform||null,i=e.Capacitor||{},n=i.Plugins=i.Plugins||{},r=()=>t!==null?t.name:Au(e),a=()=>r()!=="web",o=h=>{const f=d.get(h);return!!(f?.platforms.has(r())||s(h))},s=h=>{var f;return(f=i.PluginHeaders)===null||f===void 0?void 0:f.find(v=>v.name===h)},l=h=>e.console.error(h),d=new Map,p=(h,f={})=>{const v=d.get(h);if(v)return v.proxy;const y=r(),w=s(h);let k;const m=async()=>(!k&&y in f?k=typeof f[y]=="function"?k=await f[y]():k=f[y]:t!==null&&!k&&"web"in f&&(k=typeof f.web=="function"?k=await f.web():k=f.web),k),b=(L,N)=>{var O,K;if(w){const F=w?.methods.find(z=>N===z.name);if(F)return F.rtype==="promise"?z=>i.nativePromise(h,N.toString(),z):(z,P)=>i.nativeCallback(h,N.toString(),z,P);if(L)return(O=L[N])===null||O===void 0?void 0:O.bind(L)}else{if(L)return(K=L[N])===null||K===void 0?void 0:K.bind(L);throw new wa(`"${h}" plugin is not implemented on ${y}`,Ki.Unimplemented)}},E=L=>{let N;const O=(...K)=>{const F=m().then(z=>{const P=b(z,L);if(P){const Y=P(...K);return N=Y?.remove,Y}else throw new wa(`"${h}.${L}()" is not implemented on ${y}`,Ki.Unimplemented)});return L==="addListener"&&(F.remove=async()=>N()),F};return O.toString=()=>`${L.toString()}() { [capacitor code] }`,Object.defineProperty(O,"name",{value:L,writable:!1,configurable:!1}),O},C=E("addListener"),_=E("removeListener"),T=(L,N)=>{const O=C({eventName:L},N),K=async()=>{const z=await O;_({eventName:L,callbackId:z},N)},F=new Promise(z=>O.then(()=>z({remove:K})));return F.remove=async()=>{await K()},F},I=new Proxy({},{get(L,N){switch(N){case"$$typeof":return;case"toJSON":return()=>({});case"addListener":return w?T:C;case"removeListener":return _;default:return E(N)}}});return n[h]=I,d.set(h,{name:h,proxy:I,platforms:new Set([...Object.keys(f),...w?[y]:[]])}),I};return i.convertFileSrc||(i.convertFileSrc=h=>h),i.getPlatform=r,i.handleError=l,i.isNativePlatform=a,i.isPluginAvailable=o,i.registerPlugin=p,i.Exception=wa,i.DEBUG=!!i.DEBUG,i.isLoggingEnabled=!!i.isLoggingEnabled,i},Lu=e=>e.Capacitor=Cu(e),Xa=Lu(typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof globalThis<"u"?globalThis:{}),Fr=Xa.registerPlugin;class $s{constructor(){this.listeners={},this.retainedEventArguments={},this.windowListeners={}}addListener(t,i){let n=!1;this.listeners[t]||(this.listeners[t]=[],n=!0),this.listeners[t].push(i);const a=this.windowListeners[t];a&&!a.registered&&this.addWindowListener(a),n&&this.sendRetainedArgumentsForEvent(t);const o=async()=>this.removeListener(t,i);return Promise.resolve({remove:o})}async removeAllListeners(){this.listeners={};for(const t in this.windowListeners)this.removeWindowListener(this.windowListeners[t]);this.windowListeners={}}notifyListeners(t,i,n){const r=this.listeners[t];if(!r){if(n){let a=this.retainedEventArguments[t];a||(a=[]),a.push(i),this.retainedEventArguments[t]=a}return}r.forEach(a=>a(i))}hasListeners(t){var i;return!!(!((i=this.listeners[t])===null||i===void 0)&&i.length)}registerWindowListener(t,i){this.windowListeners[i]={registered:!1,windowEventName:t,pluginEventName:i,handler:n=>{this.notifyListeners(i,n)}}}unimplemented(t="not implemented"){return new Xa.Exception(t,Ki.Unimplemented)}unavailable(t="not available"){return new Xa.Exception(t,Ki.Unavailable)}async removeListener(t,i){const n=this.listeners[t];if(!n)return;const r=n.indexOf(i);r!==-1&&this.listeners[t].splice(r,1),this.listeners[t].length||this.removeWindowListener(this.windowListeners[t])}addWindowListener(t){window.addEventListener(t.windowEventName,t.handler),t.registered=!0}removeWindowListener(t){t&&(window.removeEventListener(t.windowEventName,t.handler),t.registered=!1)}sendRetainedArgumentsForEvent(t){const i=this.retainedEventArguments[t];i&&(delete this.retainedEventArguments[t],i.forEach(n=>{this.notifyListeners(t,n)}))}}const Ao=e=>encodeURIComponent(e).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),Co=e=>e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent);class Iu extends $s{async getCookies(){const t=document.cookie,i={};return t.split(";").forEach(n=>{if(n.length<=0)return;let[r,a]=n.replace(/=/,"CAP_COOKIE").split("CAP_COOKIE");r=Co(r).trim(),a=Co(a).trim(),i[r]=a}),i}async setCookie(t){try{const i=Ao(t.key),n=Ao(t.value),r=t.expires?`; expires=${t.expires.replace("expires=","")}`:"",a=(t.path||"/").replace("path=",""),o=t.url!=null&&t.url.length>0?`domain=${t.url}`:"";document.cookie=`${i}=${n||""}${r}; path=${a}; ${o};`}catch(i){return Promise.reject(i)}}async deleteCookie(t){try{document.cookie=`${t.key}=; Max-Age=0`}catch(i){return Promise.reject(i)}}async clearCookies(){try{const t=document.cookie.split(";")||[];for(const i of t)document.cookie=i.replace(/^ +/,"").replace(/=.*/,`=;expires=${new Date().toUTCString()};path=/`)}catch(t){return Promise.reject(t)}}async clearAllCookies(){try{await this.clearCookies()}catch(t){return Promise.reject(t)}}}Fr("CapacitorCookies",{web:()=>new Iu});const Ru=async e=>new Promise((t,i)=>{const n=new FileReader;n.onload=()=>{const r=n.result;t(r.indexOf(",")>=0?r.split(",")[1]:r)},n.onerror=r=>i(r),n.readAsDataURL(e)}),$u=(e={})=>{const t=Object.keys(e);return Object.keys(e).map(r=>r.toLocaleLowerCase()).reduce((r,a,o)=>(r[a]=e[t[o]],r),{})},Mu=(e,t=!0)=>e?Object.entries(e).reduce((n,r)=>{const[a,o]=r;let s,l;return Array.isArray(o)?(l="",o.forEach(d=>{s=t?encodeURIComponent(d):d,l+=`${a}=${s}&`}),l.slice(0,-1)):(s=t?encodeURIComponent(o):o,l=`${a}=${s}`),`${n}&${l}`},"").substr(1):null,Pu=(e,t={})=>{const i=Object.assign({method:e.method||"GET",headers:e.headers},t),r=$u(e.headers)["content-type"]||"";if(typeof e.data=="string")i.body=e.data;else if(r.includes("application/x-www-form-urlencoded")){const a=new URLSearchParams;for(const[o,s]of Object.entries(e.data||{}))a.set(o,s);i.body=a.toString()}else if(r.includes("multipart/form-data")||e.data instanceof FormData){const a=new FormData;if(e.data instanceof FormData)e.data.forEach((s,l)=>{a.append(l,s)});else for(const s of Object.keys(e.data))a.append(s,e.data[s]);i.body=a;const o=new Headers(i.headers);o.delete("content-type"),i.headers=o}else(r.includes("application/json")||typeof e.data=="object")&&(i.body=JSON.stringify(e.data));return i};class Bu extends $s{async request(t){const i=Pu(t,t.webFetchExtra),n=Mu(t.params,t.shouldEncodeUrlParams),r=n?`${t.url}?${n}`:t.url,a=await fetch(r,i),o=a.headers.get("content-type")||"";let{responseType:s="text"}=a.ok?t:{};o.includes("application/json")&&(s="json");let l,d;switch(s){case"arraybuffer":case"blob":d=await a.blob(),l=await Ru(d);break;case"json":l=await a.json();break;case"document":case"text":default:l=await a.text()}const p={};return a.headers.forEach((h,f)=>{p[f]=h}),{data:l,headers:p,status:a.status,url:a.url}}async get(t){return this.request(Object.assign(Object.assign({},t),{method:"GET"}))}async post(t){return this.request(Object.assign(Object.assign({},t),{method:"POST"}))}async put(t){return this.request(Object.assign(Object.assign({},t),{method:"PUT"}))}async patch(t){return this.request(Object.assign(Object.assign({},t),{method:"PATCH"}))}async delete(t){return this.request(Object.assign(Object.assign({},t),{method:"DELETE"}))}}Fr("CapacitorHttp",{web:()=>new Bu});var Lo;(function(e){e.Dark="DARK",e.Light="LIGHT",e.Default="DEFAULT"})(Lo||(Lo={}));var Io;(function(e){e.StatusBar="StatusBar",e.NavigationBar="NavigationBar"})(Io||(Io={}));class Du extends $s{async setStyle(){this.unavailable("not available for web")}async setAnimation(){this.unavailable("not available for web")}async show(){this.unavailable("not available for web")}async hide(){this.unavailable("not available for web")}}Fr("SystemBars",{web:()=>new Du});const Za=Fr("App",{web:()=>Rs(()=>import("./web-B3qU1D7u.js"),[],import.meta.url).then(e=>new e.AppWeb)}),Ro="1.1.28",zu="https://cine-pulse-drab.vercel.app/version.json";let nn=null,hi=0,$o=!1;const ec=6e4;function Qa(){return typeof window>"u"?!1:!!(window.Capacitor?.isNativePlatform?.()||window.Capacitor?.getPlatform?.()==="android"||navigator.userAgent.includes("CinePulseAndroid"))}function Ou(e,t){if(!e||!t)return!1;const i=d=>String(d).replace(/^v/i,"").split(".").map(p=>parseInt(p,10)||0),[n,r,a]=i(e),[o,s,l]=i(t);return n>o||n===o&&r>s||n===o&&r===s&&a>l}function Nu(e){if(document.getElementById("cinepulse-update-modal"))return;const t=e.downloadUrl||"https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk",i=e.githubDownloadUrl||"https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk",n=document.createElement("div");n.id="cinepulse-update-modal",n.className="cinepulse-modal-overlay",n.style.cssText=`
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
`).filter(Boolean).map(d=>`<li style="margin-bottom: 0.45rem;">${Mo(d.replace(/^[•\-\*]\s*/,""))}</li>`).join("");n.innerHTML=`
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
        ${Mo(e.title||`CinePulse v${e.version}`)}
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
          <span>Hemen İndir (Güncel APK)</span>
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
          <span>GitHub APK (Yedek)</span>
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
  `,document.body.appendChild(n),J(n);const a=n.querySelector("#btn-update-later");a&&a.addEventListener("click",()=>{n.remove()});const o=d=>{if(Q("APK indirmesi başlatılıyor...","info"),Qa()){if(window.CinePulseNative?.downloadApk)try{window.CinePulseNative.downloadApk(d),Q("APK Android İndirme Yöneticisi’ne eklendi. İlerleme bildirim çubuğunda görünecek.","success"),n.remove();return}catch{}try{window.open(d,"_system")||(window.location.href=d)}catch{window.location.href=d}}else window.location.assign(d);setTimeout(()=>{try{n.remove()}catch{}},2e3)},s=n.querySelector("#btn-update-download");s&&s.addEventListener("click",d=>{d.preventDefault(),o(t)});const l=n.querySelector("#btn-update-github");l&&l.addEventListener("click",d=>{Qa()&&(d.preventDefault(),o(i))})}function Mo(e=""){return String(e).replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t])}async function tc({manual:e=!1}={}){return nn||(!e&&Date.now()-hi<ec?null:(nn=Hu({manual:e}).finally(()=>{nn=null}),nn))}async function Hu({manual:e}){try{const t=await fetch(`${zu}?_t=${Date.now()}`,{signal:AbortSignal.timeout(6e3),cache:"no-store"});if(!t.ok)throw new Error(`HTTP ${t.status}`);const i=await t.json();if(!i?.version)throw new Error("Sürüm bilgisi eksik");if(hi=Date.now(),i&&Ou(i.version,Ro))return Nu(i),i;if(e)return Q(`✓ CinePulse güncel (v${Ro})`,"success"),null}catch{return e&&Q("Güncelleme sunucusuna erişilemedi.","error"),null}}function qu(){if(typeof window>"u"||$o)return;$o=!0;let e=null,t=0;const i=[0,5e3,15e3,3e4],n=async()=>{if(hi&&Date.now()-hi<ec)return;const r=hi;await tc({manual:!1}),!hi||hi===r?t<i.length&&(e=window.setTimeout(n,i[t++])):t=i.length};e=window.setTimeout(n,2500);try{Za.addListener("appStateChange",({isActive:r})=>{r&&(e&&window.clearTimeout(e),t=0,e=window.setTimeout(n,1200))})}catch{}document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&(e&&window.clearTimeout(e),t=0,e=window.setTimeout(n,1200))})}let Qn=null;function Fu(){Wt();const e=document.createElement("div");e.id="profile-modal-root",e.className="profile-backdrop",document.body.appendChild(e),Qn=e;const t=(n="select")=>{const r=ti(),a=Cn();n==="select"?e.innerHTML=`
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
            ${r.map(w=>{const k=w.id===a.id,m=w.id!=="prof_1";return`
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
            ${Qa()?`
              <button class="btn-manage-profiles" id="btn-modal-check-update" title="Güncellemeleri Denetle">
                <i data-lucide="refresh-cw" style="width: 15px; height: 15px; color: #10b981;"></i>
                <span>Güncelleme</span>
              </button>
            `:`
              <a class="btn-manage-profiles" id="btn-modal-apk-download" href="https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk" download="cinepulse.apk" target="_blank" rel="noopener noreferrer" title="Android APK İndir" style="text-decoration: none;">
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
      `),J(e);const o=e.querySelector("#btn-close-profile-modal");o&&(o.onclick=()=>Wt());const s=e.querySelector("#btn-show-add-profile");s&&(s.onclick=()=>t("add")),e.querySelectorAll(".btn-delete-profile").forEach(w=>{w.onclick=k=>{k.stopPropagation();const m=w.getAttribute("data-delete-id"),b=ti().find(C=>C.id===m);if(!b||!confirm(`"${b.name}" profilini silmek istediğinize emin misiniz?`))return;Ad(m)?(Q(`"${b.name}" profili silindi.`,"info"),t("select")):Q("Bu profil silinemez.","error")}});const l=e.querySelector("#btn-modal-open-trakt");l&&(l.onclick=()=>{Wt(),wr()});const d=e.querySelector("#btn-modal-open-backup");d&&(d.onclick=()=>{Wt(),Ql()});const p=e.querySelector("#btn-modal-pwa-install");p&&(p.onclick=()=>{_u()});const h=e.querySelector("#btn-modal-check-update");h&&(h.onclick=()=>{tc({manual:!0})}),e.querySelectorAll(".profile-card[data-profile-id]").forEach(w=>{w.onclick=()=>{const k=w.getAttribute("data-profile-id");if(k){const m=ti().find(b=>b.id===k);dr(k),Wt(),Po(m)}}});const f=e.querySelector("#btn-cancel-add-profile");f&&(f.onclick=()=>t("select"));const v=e.querySelector("#btn-back-to-profiles");v&&(v.onclick=()=>t("select"));const y=e.querySelector("#form-add-profile");if(y){let w="#f59e0b";y.querySelectorAll(".color-dot").forEach(k=>{k.onclick=()=>{y.querySelectorAll(".color-dot").forEach(m=>m.classList.remove("active")),k.classList.add("active"),w=k.getAttribute("data-color")}}),y.onsubmit=k=>{k.preventDefault();const m=y.querySelector("#new-profile-name"),b=y.querySelector("#new-profile-kid-check"),E=m?m.value.trim():"",C=b?b.checked:!1;if(E){const _=Td({name:E,isKid:C,avatar:C?"smile":"user",color:w});dr(_.id),Wt(),Po(_)}}}};t("select"),e.onclick=n=>{n.target===e&&Wt()};const i=n=>{n.key==="Escape"&&(Wt(),window.removeEventListener("keydown",i))};window.addEventListener("keydown",i)}function Wt(){if(Qn){try{Qn.remove()}catch{}Qn=null}}function Po(e){const t=document.getElementById("profile-switch-curtain");t&&t.remove();const i=document.createElement("div");i.id="profile-switch-curtain",i.className="profile-switch-curtain is-entering",i.innerHTML=`
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
  `,document.body.appendChild(i),J(i),window.dispatchEvent(new CustomEvent("sineflix_profile_changed",{detail:{profile:e}})),setTimeout(()=>{i.classList.remove("is-entering"),i.classList.add("is-leaving"),setTimeout(()=>{i.remove()},450)},600)}async function ri(e){return(await Rs(()=>import("./PlayerModal-pp3cnk3D.js"),__vite__mapDeps([0,1]),import.meta.url)).openPlayerModal(e)}let Oi=null,es=null;const rn=e=>String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),Bo=[{label:"🎲 Karışık / Farketmez",id:null},{label:"💥 Aksiyon",movie:28,tv:10759},{label:"🚀 Bilim Kurgu & Fantastik",movie:878,tv:10765},{label:"😂 Komedi",movie:35,tv:35},{label:"🩸 Korku & Gerilim",movie:27,tv:9648},{label:"🎭 Dram",movie:18,tv:18},{label:"🕵️ Suç & Gizem",movie:80,tv:9648},{label:"🎌 Animasyon & Anime",movie:16,tv:16},{label:"💖 Romantik",movie:10749,tv:10749},{label:"🌍 Belgesel",movie:99,tv:99}];function Do({type:e="all"}={}){Ci();const t=document.createElement("div");t.id="random-picker-modal-root",t.className="random-picker-backdrop",document.body.appendChild(t),Oi=t;let i=e==="tv"?"tv":"all",n=0,r=7;t.innerHTML=`
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
            ${Bo.map((v,y)=>`
              <button class="random-pill-btn ${y===0?"active":""}" data-genre-idx="${y}">${v.label}</button>
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
  `,J(t);const a=t.querySelector("#btn-close-random-picker");a&&(a.onclick=()=>Ci()),t.onclick=v=>{v.target===t&&Ci()};const o=v=>{v.key==="Escape"&&Ci()};window.addEventListener("keydown",o),es=()=>window.removeEventListener("keydown",o);const s=t.querySelectorAll("#random-type-pills .random-pill-btn");s.forEach(v=>{v.onclick=()=>{s.forEach(y=>y.classList.remove("active")),v.classList.add("active"),i=v.getAttribute("data-type")}});const l=t.querySelectorAll("#random-rating-pills .random-pill-btn");l.forEach(v=>{v.onclick=()=>{l.forEach(y=>y.classList.remove("active")),v.classList.add("active"),r=parseFloat(v.getAttribute("data-rating")||"0")}});const d=t.querySelectorAll("#random-genre-pills .random-pill-btn");d.forEach(v=>{v.onclick=()=>{d.forEach(y=>y.classList.remove("active")),v.classList.add("active"),n=parseInt(v.getAttribute("data-genre-idx"),10)}});const p=t.querySelector("#btn-spin-wheel"),h=t.querySelector("#random-spin-stage"),f=async()=>{p&&(p.disabled=!0,p.classList.add("is-spinning")),h.innerHTML=`
      <div class="random-roulette-box">
        <div class="roulette-glow-ring"></div>
        <div class="roulette-roller" id="roulette-roller">
          <div class="roulette-reel-text">Adaylar Karıştırılıyor... 🎲</div>
        </div>
      </div>
    `;let v=i;v==="all"&&(v=Math.random()>.5?"movie":"tv");let y=null;const w=Bo[n];w&&(y=v==="movie"?w.movie:w.tv);const k=Math.floor(Math.random()*3)+1;let m;try{m=await Yl({type:v,genreId:y,minRating:r,page:k,sortBy:"popularity.desc"})}catch{m=[]}if(Oi!==t)return;const b=(m||[]).filter(ne=>ne&&(ne.title||ne.name)&&(ne.poster_path||ne.backdrop_path));if(!b||b.length===0){h.innerHTML=`
        <div class="random-idle-placeholder">
          <i data-lucide="frown" style="width: 40px; height: 40px; color: #ef4444;"></i>
          <span>Bu kriterlere uygun yapım bulunamadı. Lütfen filtreleri gevşetip tekrar deneyin.</span>
        </div>
      `,J(h),p&&(p.disabled=!1,p.classList.remove("is-spinning"));return}const E=h.querySelector("#roulette-roller"),C=8;for(let ne=0;ne<C;ne++){const ee=b[Math.floor(Math.random()*b.length)],re=ee.title||ee.name||"Öneri Aranıyor";if(E&&(E.innerHTML=`<div class="roulette-reel-text animate-pulse">${rn(re)}</div>`),await new Promise(H=>setTimeout(H,120+ne*25)),Oi!==t)return}const _=b[Math.floor(Math.random()*b.length)],T=_.title||_.name||"Seçilen Yapım",I=_.original_title||_.original_name||T,L=at(_.poster_path,Je.POSTER_MEDIUM),N=_.vote_average?Number(_.vote_average).toFixed(1):"—",O=(_.release_date||_.first_air_date||"").substring(0,4),K=_.overview&&_.overview.trim().length>10?_.overview:"Harika bir izleme deneyimi sunan sürpriz bir öneri!",F=v==="movie"?"movie":"tv";h.innerHTML=`
      <div class="random-winner-card">
        <div class="winner-poster-wrap">
          <img src="${L}" alt="${rn(T)}" class="winner-poster" />
          <div class="winner-rating-pill">⭐ ${N}</div>
        </div>
        <div class="winner-details-wrap">
          <div class="winner-badge-row">
            <span class="winner-tag-type">${F==="movie"?"FİLM":"DİZİ"}</span>
            ${O?`<span class="winner-tag-year">${rn(O)}</span>`:""}
            <span class="winner-tag-match">Popüler öneri</span>
          </div>
          <h3 class="winner-title">${rn(T)}</h3>
          <p class="winner-overview">${rn(K)}</p>
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
    `,J(h);const z=h.querySelector("#btn-winner-play");z&&(z.onclick=()=>{Ci(),ri({type:F,tmdbId:_.id,title:T,originalTitle:I,posterPath:_.poster_path,backdropPath:_.backdrop_path,season:1,episode:1})});const P=h.querySelector("#btn-winner-detail");P&&(P.onclick=()=>{Ci(),window.location.hash=`#detail?type=${F}&id=${_.id}`});const Y=h.querySelector("#btn-winner-retry");Y&&(Y.onclick=()=>{f()}),p&&(p.disabled=!1,p.classList.remove("is-spinning"),p.innerHTML='<i data-lucide="refresh-cw" style="width: 17px; height: 17px;"></i> <span>Başka Bir Tane Öner</span>',J(p))};p&&(p.onclick=()=>f()),f()}function Ci(){if(es?.(),es=null,Oi){try{Oi.remove()}catch{}Oi=null}}let er=null;const ka=[{id:"notif_1",title:"Yeni Bölüm Yayında! ⚔️",message:"Kuruluş Osman 6. Sezon 1. Bölüm Full HD olarak platforma eklendi.",time:"12 dk önce",isUnread:!0,type:"tv",tmdbId:"95557",badge:"YENİ BÖLÜM"},{id:"notif_2",title:"Özel Sinema Gösterimi 🍿",message:"Dune: Çöl Gezegeni Bölüm İki - 4K Ultra HD Türkçe Dublaj & Altyazılı yayında!",time:"2 saat önce",isUnread:!0,type:"movie",tmdbId:"693134",badge:"4K VİZYON"},{id:"notif_3",title:"Yeni Anime Bölümü ⚡",message:"Demon Slayer: Hashira Training Arc - Türkçe Altyazılı yeni bölüm izlenmeye hazır.",time:"Dün",isUnread:!1,type:"tv",tmdbId:"85937",badge:"ANİME"},{id:"notif_4",title:"Canlı TV Güncellemesi 📺",message:"Elektronik Program Rehberi (EPG), PiP Mini-Player ve HLS Kalite Menüsü aktif edildi.",time:"2 gün önce",isUnread:!1,type:"livetv",badge:"GÜNCELLEME"}];function ic(){try{if(typeof window>"u"||!window.localStorage)return ka;const e=localStorage.getItem("sineflix_notifications_v1");return e?JSON.parse(e):ka}catch{return ka}}function zo(e){try{if(typeof window>"u"||!window.localStorage)return;localStorage.setItem("sineflix_notifications_v1",JSON.stringify(e)),window.dispatchEvent(new CustomEvent("sineflix_notifications_updated"))}catch{}}function nc(){return ic().filter(t=>t.isUnread).length}function Uu(){zn();const e=document.createElement("div");e.id="notification-modal-root",e.className="notif-backdrop",document.body.appendChild(e),er=e;const t=ic();e.innerHTML=`
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
  `,J(e);const i=e.querySelector("#btn-close-notif");i&&(i.onclick=()=>zn()),e.onclick=r=>{r.target===e&&zn()};const n=e.querySelector("#btn-mark-all-read");n&&(n.onclick=()=>{const r=t.map(a=>({...a,isUnread:!1}));zo(r),e.querySelectorAll(".notif-item.unread").forEach(a=>a.classList.remove("unread")),Q("Tüm bildirimler okundu olarak işaretlendi","info"),Oo()}),e.querySelectorAll(".notif-item").forEach(r=>{r.onclick=()=>{const a=r.getAttribute("data-notif-id"),o=r.getAttribute("data-type"),s=r.getAttribute("data-tmdb-id"),l=t.map(d=>d.id===a?{...d,isUnread:!1}:d);zo(l),r.classList.remove("unread"),Oo(),zn(),o==="livetv"?window.location.hash="#livetv":s&&(window.location.hash=`#detail?type=${o}&id=${s}`)}})}function zn(){if(er){try{er.remove()}catch{}er=null}}function Oo(){const e=document.getElementById("nav-notif-badge");if(!e)return;const t=nc();t>0?(e.textContent=t,e.classList.remove("hidden")):e.classList.add("hidden")}function rc(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function ju(e){if(e.__esModule)return e;var t=e.default;if(typeof t=="function"){var i=function n(){return this instanceof n?Reflect.construct(t,arguments,this.constructor):t.apply(this,arguments)};i.prototype=t.prototype}else i={};return Object.defineProperty(i,"__esModule",{value:!0}),Object.keys(e).forEach(function(n){var r=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(i,n,r.get?r:{enumerable:!0,get:function(){return e[n]}})}),i}var ts={exports:{}},_a,No;function Ku(){if(No)return _a;No=1;var e=1e3,t=e*60,i=t*60,n=i*24,r=n*7,a=n*365.25;_a=function(p,h){h=h||{};var f=typeof p;if(f==="string"&&p.length>0)return o(p);if(f==="number"&&isFinite(p))return h.long?l(p):s(p);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(p))};function o(p){if(p=String(p),!(p.length>100)){var h=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(p);if(h){var f=parseFloat(h[1]),v=(h[2]||"ms").toLowerCase();switch(v){case"years":case"year":case"yrs":case"yr":case"y":return f*a;case"weeks":case"week":case"w":return f*r;case"days":case"day":case"d":return f*n;case"hours":case"hour":case"hrs":case"hr":case"h":return f*i;case"minutes":case"minute":case"mins":case"min":case"m":return f*t;case"seconds":case"second":case"secs":case"sec":case"s":return f*e;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return f;default:return}}}}function s(p){var h=Math.abs(p);return h>=n?Math.round(p/n)+"d":h>=i?Math.round(p/i)+"h":h>=t?Math.round(p/t)+"m":h>=e?Math.round(p/e)+"s":p+"ms"}function l(p){var h=Math.abs(p);return h>=n?d(p,h,n,"day"):h>=i?d(p,h,i,"hour"):h>=t?d(p,h,t,"minute"):h>=e?d(p,h,e,"second"):p+" ms"}function d(p,h,f,v){var y=h>=f*1.5;return Math.round(p/f)+" "+v+(y?"s":"")}return _a}function Wu(e){i.debug=i,i.default=i,i.coerce=l,i.disable=o,i.enable=r,i.enabled=s,i.humanize=Ku(),i.destroy=d,Object.keys(e).forEach(p=>{i[p]=e[p]}),i.names=[],i.skips=[],i.formatters={};function t(p){let h=0;for(let f=0;f<p.length;f++)h=(h<<5)-h+p.charCodeAt(f),h|=0;return i.colors[Math.abs(h)%i.colors.length]}i.selectColor=t;function i(p){let h,f=null,v,y;function w(...k){if(!w.enabled)return;const m=w,b=Number(new Date),E=b-(h||b);m.diff=E,m.prev=h,m.curr=b,h=b,k[0]=i.coerce(k[0]),typeof k[0]!="string"&&k.unshift("%O");let C=0;k[0]=k[0].replace(/%([a-zA-Z%])/g,(T,I)=>{if(T==="%%")return"%";C++;const L=i.formatters[I];if(typeof L=="function"){const N=k[C];T=L.call(m,N),k.splice(C,1),C--}return T}),i.formatArgs.call(m,k),(m.log||i.log).apply(m,k)}return w.namespace=p,w.useColors=i.useColors(),w.color=i.selectColor(p),w.extend=n,w.destroy=i.destroy,Object.defineProperty(w,"enabled",{enumerable:!0,configurable:!1,get:()=>f!==null?f:(v!==i.namespaces&&(v=i.namespaces,y=i.enabled(p)),y),set:k=>{f=k}}),typeof i.init=="function"&&i.init(w),w}function n(p,h){const f=i(this.namespace+(typeof h>"u"?":":h)+p);return f.log=this.log,f}function r(p){i.save(p),i.namespaces=p,i.names=[],i.skips=[];const h=(typeof p=="string"?p:"").trim().replace(/\s+/g,",").split(",").filter(Boolean);for(const f of h)f[0]==="-"?i.skips.push(f.slice(1)):i.names.push(f)}function a(p,h){let f=0,v=0,y=-1,w=0;for(;f<p.length;)if(v<h.length&&(h[v]===p[f]||h[v]==="*"))h[v]==="*"?(y=v,w=f,v++):(f++,v++);else if(y!==-1)v=y+1,w++,f=w;else return!1;for(;v<h.length&&h[v]==="*";)v++;return v===h.length}function o(){const p=[...i.names,...i.skips.map(h=>"-"+h)].join(",");return i.enable(""),p}function s(p){for(const h of i.skips)if(a(p,h))return!1;for(const h of i.names)if(a(p,h))return!0;return!1}function l(p){return p instanceof Error?p.stack||p.message:p}function d(){}return i.enable(i.load()),i}var Yu=Wu;(function(e,t){var i={};t.formatArgs=r,t.save=a,t.load=o,t.useColors=n,t.storage=s(),t.destroy=(()=>{let d=!1;return()=>{d||(d=!0)}})(),t.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"];function n(){if(typeof window<"u"&&window.process&&(window.process.type==="renderer"||window.process.__nwjs))return!0;if(typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;let d;return typeof document<"u"&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent&&(d=navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/))&&parseInt(d[1],10)>=31||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)}function r(d){if(d[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+d[0]+(this.useColors?"%c ":" ")+"+"+e.exports.humanize(this.diff),!this.useColors)return;const p="color: "+this.color;d.splice(1,0,p,"color: inherit");let h=0,f=0;d[0].replace(/%[a-zA-Z%]/g,v=>{v!=="%%"&&(h++,v==="%c"&&(f=h))}),d.splice(f,0,p)}t.log=console.debug||console.log||(()=>{});function a(d){try{d?t.storage.setItem("debug",d):t.storage.removeItem("debug")}catch{}}function o(){let d;try{d=t.storage.getItem("debug")||t.storage.getItem("DEBUG")}catch{}return!d&&typeof process<"u"&&"env"in process&&(d=i.DEBUG),d}function s(){try{return localStorage}catch{}}e.exports=Yu(t);const{formatters:l}=e.exports;l.j=function(d){try{return JSON.stringify(d)}catch(p){return"[UnexpectedJSONParseError]: "+p.message}}})(ts,ts.exports);var Ur=ts.exports,Ms={exports:{}},Ni=typeof Reflect=="object"?Reflect:null,Ho=Ni&&typeof Ni.apply=="function"?Ni.apply:function(t,i,n){return Function.prototype.apply.call(t,i,n)},tr;Ni&&typeof Ni.ownKeys=="function"?tr=Ni.ownKeys:Object.getOwnPropertySymbols?tr=function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:tr=function(t){return Object.getOwnPropertyNames(t)};var ac=Number.isNaN||function(t){return t!==t};function Le(){Le.init.call(this)}Ms.exports=Le;Ms.exports.once=Xu;Le.EventEmitter=Le;Le.prototype._events=void 0;Le.prototype._eventsCount=0;Le.prototype._maxListeners=void 0;var qo=10;function jr(e){if(typeof e!="function")throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e)}Object.defineProperty(Le,"defaultMaxListeners",{enumerable:!0,get:function(){return qo},set:function(e){if(typeof e!="number"||e<0||ac(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");qo=e}});Le.init=function(){(this._events===void 0||this._events===Object.getPrototypeOf(this)._events)&&(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0};Le.prototype.setMaxListeners=function(t){if(typeof t!="number"||t<0||ac(t))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+t+".");return this._maxListeners=t,this};function sc(e){return e._maxListeners===void 0?Le.defaultMaxListeners:e._maxListeners}Le.prototype.getMaxListeners=function(){return sc(this)};Le.prototype.emit=function(t){for(var i=[],n=1;n<arguments.length;n++)i.push(arguments[n]);var r=t==="error",a=this._events;if(a!==void 0)r=r&&a.error===void 0;else if(!r)return!1;if(r){var o;if(i.length>0&&(o=i[0]),o instanceof Error)throw o;var s=new Error("Unhandled error."+(o?" ("+o.message+")":""));throw s.context=o,s}var l=a[t];if(l===void 0)return!1;if(typeof l=="function")Ho(l,this,i);else for(var d=l.length,p=uc(l,d),n=0;n<d;++n)Ho(p[n],this,i);return!0};function oc(e,t,i,n){var r,a,o;if(jr(i),a=e._events,a===void 0?(a=e._events=Object.create(null),e._eventsCount=0):(a.newListener!==void 0&&(e.emit("newListener",t,i.listener?i.listener:i),a=e._events),o=a[t]),o===void 0)o=a[t]=i,++e._eventsCount;else if(typeof o=="function"?o=a[t]=n?[i,o]:[o,i]:n?o.unshift(i):o.push(i),r=sc(e),r>0&&o.length>r&&!o.warned){o.warned=!0;var s=new Error("Possible EventEmitter memory leak detected. "+o.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");s.name="MaxListenersExceededWarning",s.emitter=e,s.type=t,s.count=o.length}return e}Le.prototype.addListener=function(t,i){return oc(this,t,i,!1)};Le.prototype.on=Le.prototype.addListener;Le.prototype.prependListener=function(t,i){return oc(this,t,i,!0)};function Vu(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length===0?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function lc(e,t,i){var n={fired:!1,wrapFn:void 0,target:e,type:t,listener:i},r=Vu.bind(n);return r.listener=i,n.wrapFn=r,r}Le.prototype.once=function(t,i){return jr(i),this.on(t,lc(this,t,i)),this};Le.prototype.prependOnceListener=function(t,i){return jr(i),this.prependListener(t,lc(this,t,i)),this};Le.prototype.removeListener=function(t,i){var n,r,a,o,s;if(jr(i),r=this._events,r===void 0)return this;if(n=r[t],n===void 0)return this;if(n===i||n.listener===i)--this._eventsCount===0?this._events=Object.create(null):(delete r[t],r.removeListener&&this.emit("removeListener",t,n.listener||i));else if(typeof n!="function"){for(a=-1,o=n.length-1;o>=0;o--)if(n[o]===i||n[o].listener===i){s=n[o].listener,a=o;break}if(a<0)return this;a===0?n.shift():Gu(n,a),n.length===1&&(r[t]=n[0]),r.removeListener!==void 0&&this.emit("removeListener",t,s||i)}return this};Le.prototype.off=Le.prototype.removeListener;Le.prototype.removeAllListeners=function(t){var i,n,r;if(n=this._events,n===void 0)return this;if(n.removeListener===void 0)return arguments.length===0?(this._events=Object.create(null),this._eventsCount=0):n[t]!==void 0&&(--this._eventsCount===0?this._events=Object.create(null):delete n[t]),this;if(arguments.length===0){var a=Object.keys(n),o;for(r=0;r<a.length;++r)o=a[r],o!=="removeListener"&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if(i=n[t],typeof i=="function")this.removeListener(t,i);else if(i!==void 0)for(r=i.length-1;r>=0;r--)this.removeListener(t,i[r]);return this};function cc(e,t,i){var n=e._events;if(n===void 0)return[];var r=n[t];return r===void 0?[]:typeof r=="function"?i?[r.listener||r]:[r]:i?Ju(r):uc(r,r.length)}Le.prototype.listeners=function(t){return cc(this,t,!0)};Le.prototype.rawListeners=function(t){return cc(this,t,!1)};Le.listenerCount=function(e,t){return typeof e.listenerCount=="function"?e.listenerCount(t):dc.call(e,t)};Le.prototype.listenerCount=dc;function dc(e){var t=this._events;if(t!==void 0){var i=t[e];if(typeof i=="function")return 1;if(i!==void 0)return i.length}return 0}Le.prototype.eventNames=function(){return this._eventsCount>0?tr(this._events):[]};function uc(e,t){for(var i=new Array(t),n=0;n<t;++n)i[n]=e[n];return i}function Gu(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}function Ju(e){for(var t=new Array(e.length),i=0;i<t.length;++i)t[i]=e[i].listener||e[i];return t}function Xu(e,t){return new Promise(function(i,n){function r(o){e.removeListener(t,a),n(o)}function a(){typeof e.removeListener=="function"&&e.removeListener("error",r),i([].slice.call(arguments))}pc(e,t,a,{once:!0}),t!=="error"&&Zu(e,r,{once:!0})})}function Zu(e,t,i){typeof e.on=="function"&&pc(e,"error",t,i)}function pc(e,t,i,n){if(typeof e.on=="function")n.once?e.once(t,i):e.on(t,i);else if(typeof e.addEventListener=="function")e.addEventListener(t,function r(a){n.once&&e.removeEventListener(t,r),i(a)});else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof e)}var Kr=Ms.exports,Ps={exports:{}},Qu=fc;function fc(e,t){if(e&&t)return fc(e)(t);if(typeof e!="function")throw new TypeError("need wrapper function");return Object.keys(e).forEach(function(n){i[n]=e[n]}),i;function i(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];var a=e.apply(this,n),o=n[n.length-1];return typeof a=="function"&&a!==o&&Object.keys(o).forEach(function(s){a[s]=o[s]}),a}}var hc=Qu;Ps.exports=hc(ir);Ps.exports.strict=hc(mc);ir.proto=ir(function(){Object.defineProperty(Function.prototype,"once",{value:function(){return ir(this)},configurable:!0}),Object.defineProperty(Function.prototype,"onceStrict",{value:function(){return mc(this)},configurable:!0})});function ir(e){var t=function(){return t.called?t.value:(t.called=!0,t.value=e.apply(this,arguments))};return t.called=!1,t}function mc(e){var t=function(){if(t.called)throw new Error(t.onceError);return t.called=!0,t.value=e.apply(this,arguments)},i=e.name||"Function wrapped with `once`";return t.onceError=i+" shouldn't be called more than once",t.called=!1,t}var ep=Ps.exports;let Fo;var Wr=typeof queueMicrotask=="function"?queueMicrotask.bind(typeof window<"u"?window:globalThis):e=>(Fo||(Fo=Promise.resolve())).then(e).catch(t=>setTimeout(()=>{throw t},0));var tp=np;const ip=Wr;function np(e,t){let i,n,r,a=!0;Array.isArray(e)?(i=[],n=e.length):(r=Object.keys(e),i={},n=r.length);function o(l){function d(){t&&t(l,i),t=null}a?ip(d):d()}function s(l,d,p){i[l]=p,(--n===0||d)&&o(d)}n?r?r.forEach(function(l){e[l](function(d,p){s(l,d,p)})}):e.forEach(function(l,d){l(function(p,h){s(d,p,h)})}):o(null),a=!1}var rp=function(){if(typeof globalThis>"u")return null;var t={RTCPeerConnection:globalThis.RTCPeerConnection||globalThis.mozRTCPeerConnection||globalThis.webkitRTCPeerConnection,RTCSessionDescription:globalThis.RTCSessionDescription||globalThis.mozRTCSessionDescription||globalThis.webkitRTCSessionDescription,RTCIceCandidate:globalThis.RTCIceCandidate||globalThis.mozRTCIceCandidate||globalThis.webkitRTCIceCandidate};return t.RTCPeerConnection?t:null},is={exports:{}},ns={exports:{}},xi={},Yr={};Yr.byteLength=op;Yr.toByteArray=cp;Yr.fromByteArray=pp;var It=[],ft=[],ap=typeof Uint8Array<"u"?Uint8Array:Array,Sa="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(var Li=0,sp=Sa.length;Li<sp;++Li)It[Li]=Sa[Li],ft[Sa.charCodeAt(Li)]=Li;ft[45]=62;ft[95]=63;function gc(e){var t=e.length;if(t%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var i=e.indexOf("=");i===-1&&(i=t);var n=i===t?0:4-i%4;return[i,n]}function op(e){var t=gc(e),i=t[0],n=t[1];return(i+n)*3/4-n}function lp(e,t,i){return(t+i)*3/4-i}function cp(e){var t,i=gc(e),n=i[0],r=i[1],a=new ap(lp(e,n,r)),o=0,s=r>0?n-4:n,l;for(l=0;l<s;l+=4)t=ft[e.charCodeAt(l)]<<18|ft[e.charCodeAt(l+1)]<<12|ft[e.charCodeAt(l+2)]<<6|ft[e.charCodeAt(l+3)],a[o++]=t>>16&255,a[o++]=t>>8&255,a[o++]=t&255;return r===2&&(t=ft[e.charCodeAt(l)]<<2|ft[e.charCodeAt(l+1)]>>4,a[o++]=t&255),r===1&&(t=ft[e.charCodeAt(l)]<<10|ft[e.charCodeAt(l+1)]<<4|ft[e.charCodeAt(l+2)]>>2,a[o++]=t>>8&255,a[o++]=t&255),a}function dp(e){return It[e>>18&63]+It[e>>12&63]+It[e>>6&63]+It[e&63]}function up(e,t,i){for(var n,r=[],a=t;a<i;a+=3)n=(e[a]<<16&16711680)+(e[a+1]<<8&65280)+(e[a+2]&255),r.push(dp(n));return r.join("")}function pp(e){for(var t,i=e.length,n=i%3,r=[],a=16383,o=0,s=i-n;o<s;o+=a)r.push(up(e,o,o+a>s?s:o+a));return n===1?(t=e[i-1],r.push(It[t>>2]+It[t<<4&63]+"==")):n===2&&(t=(e[i-2]<<8)+e[i-1],r.push(It[t>>10]+It[t>>4&63]+It[t<<2&63]+"=")),r.join("")}var Bs={};Bs.read=function(e,t,i,n,r){var a,o,s=r*8-n-1,l=(1<<s)-1,d=l>>1,p=-7,h=i?r-1:0,f=i?-1:1,v=e[t+h];for(h+=f,a=v&(1<<-p)-1,v>>=-p,p+=s;p>0;a=a*256+e[t+h],h+=f,p-=8);for(o=a&(1<<-p)-1,a>>=-p,p+=n;p>0;o=o*256+e[t+h],h+=f,p-=8);if(a===0)a=1-d;else{if(a===l)return o?NaN:(v?-1:1)*(1/0);o=o+Math.pow(2,n),a=a-d}return(v?-1:1)*o*Math.pow(2,a-n)};Bs.write=function(e,t,i,n,r,a){var o,s,l,d=a*8-r-1,p=(1<<d)-1,h=p>>1,f=r===23?Math.pow(2,-24)-Math.pow(2,-77):0,v=n?0:a-1,y=n?1:-1,w=t<0||t===0&&1/t<0?1:0;for(t=Math.abs(t),isNaN(t)||t===1/0?(s=isNaN(t)?1:0,o=p):(o=Math.floor(Math.log(t)/Math.LN2),t*(l=Math.pow(2,-o))<1&&(o--,l*=2),o+h>=1?t+=f/l:t+=f*Math.pow(2,1-h),t*l>=2&&(o++,l/=2),o+h>=p?(s=0,o=p):o+h>=1?(s=(t*l-1)*Math.pow(2,r),o=o+h):(s=t*Math.pow(2,h-1)*Math.pow(2,r),o=0));r>=8;e[i+v]=s&255,v+=y,s/=256,r-=8);for(o=o<<r|s,d+=r;d>0;e[i+v]=o&255,v+=y,o/=256,d-=8);e[i+v-y]|=w*128};(function(e){const t=Yr,i=Bs,n=typeof Symbol=="function"&&typeof Symbol.for=="function"?Symbol.for("nodejs.util.inspect.custom"):null;e.Buffer=s,e.SlowBuffer=b,e.INSPECT_MAX_BYTES=50;const r=2147483647;e.kMaxLength=r,s.TYPED_ARRAY_SUPPORT=a(),!s.TYPED_ARRAY_SUPPORT&&typeof console<"u";function a(){try{const g=new Uint8Array(1),c={foo:function(){return 42}};return Object.setPrototypeOf(c,Uint8Array.prototype),Object.setPrototypeOf(g,c),g.foo()===42}catch{return!1}}Object.defineProperty(s.prototype,"parent",{enumerable:!0,get:function(){if(s.isBuffer(this))return this.buffer}}),Object.defineProperty(s.prototype,"offset",{enumerable:!0,get:function(){if(s.isBuffer(this))return this.byteOffset}});function o(g){if(g>r)throw new RangeError('The value "'+g+'" is invalid for option "size"');const c=new Uint8Array(g);return Object.setPrototypeOf(c,s.prototype),c}function s(g,c,u){if(typeof g=="number"){if(typeof c=="string")throw new TypeError('The "string" argument must be of type string. Received type number');return h(g)}return l(g,c,u)}s.poolSize=8192;function l(g,c,u){if(typeof g=="string")return f(g,c);if(ArrayBuffer.isView(g))return y(g);if(g==null)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof g);if(De(g,ArrayBuffer)||g&&De(g.buffer,ArrayBuffer)||typeof SharedArrayBuffer<"u"&&(De(g,SharedArrayBuffer)||g&&De(g.buffer,SharedArrayBuffer)))return w(g,c,u);if(typeof g=="number")throw new TypeError('The "value" argument must not be of type number. Received type number');const S=g.valueOf&&g.valueOf();if(S!=null&&S!==g)return s.from(S,c,u);const R=k(g);if(R)return R;if(typeof Symbol<"u"&&Symbol.toPrimitive!=null&&typeof g[Symbol.toPrimitive]=="function")return s.from(g[Symbol.toPrimitive]("string"),c,u);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof g)}s.from=function(g,c,u){return l(g,c,u)},Object.setPrototypeOf(s.prototype,Uint8Array.prototype),Object.setPrototypeOf(s,Uint8Array);function d(g){if(typeof g!="number")throw new TypeError('"size" argument must be of type number');if(g<0)throw new RangeError('The value "'+g+'" is invalid for option "size"')}function p(g,c,u){return d(g),g<=0?o(g):c!==void 0?typeof u=="string"?o(g).fill(c,u):o(g).fill(c):o(g)}s.alloc=function(g,c,u){return p(g,c,u)};function h(g){return d(g),o(g<0?0:m(g)|0)}s.allocUnsafe=function(g){return h(g)},s.allocUnsafeSlow=function(g){return h(g)};function f(g,c){if((typeof c!="string"||c==="")&&(c="utf8"),!s.isEncoding(c))throw new TypeError("Unknown encoding: "+c);const u=E(g,c)|0;let S=o(u);const R=S.write(g,c);return R!==u&&(S=S.slice(0,R)),S}function v(g){const c=g.length<0?0:m(g.length)|0,u=o(c);for(let S=0;S<c;S+=1)u[S]=g[S]&255;return u}function y(g){if(De(g,Uint8Array)){const c=new Uint8Array(g);return w(c.buffer,c.byteOffset,c.byteLength)}return v(g)}function w(g,c,u){if(c<0||g.byteLength<c)throw new RangeError('"offset" is outside of buffer bounds');if(g.byteLength<c+(u||0))throw new RangeError('"length" is outside of buffer bounds');let S;return c===void 0&&u===void 0?S=new Uint8Array(g):u===void 0?S=new Uint8Array(g,c):S=new Uint8Array(g,c,u),Object.setPrototypeOf(S,s.prototype),S}function k(g){if(s.isBuffer(g)){const c=m(g.length)|0,u=o(c);return u.length===0||g.copy(u,0,0,c),u}if(g.length!==void 0)return typeof g.length!="number"||Ne(g.length)?o(0):v(g);if(g.type==="Buffer"&&Array.isArray(g.data))return v(g.data)}function m(g){if(g>=r)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+r.toString(16)+" bytes");return g|0}function b(g){return+g!=g&&(g=0),s.alloc(+g)}s.isBuffer=function(c){return c!=null&&c._isBuffer===!0&&c!==s.prototype},s.compare=function(c,u){if(De(c,Uint8Array)&&(c=s.from(c,c.offset,c.byteLength)),De(u,Uint8Array)&&(u=s.from(u,u.offset,u.byteLength)),!s.isBuffer(c)||!s.isBuffer(u))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(c===u)return 0;let S=c.length,R=u.length;for(let D=0,U=Math.min(S,R);D<U;++D)if(c[D]!==u[D]){S=c[D],R=u[D];break}return S<R?-1:R<S?1:0},s.isEncoding=function(c){switch(String(c).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},s.concat=function(c,u){if(!Array.isArray(c))throw new TypeError('"list" argument must be an Array of Buffers');if(c.length===0)return s.alloc(0);let S;if(u===void 0)for(u=0,S=0;S<c.length;++S)u+=c[S].length;const R=s.allocUnsafe(u);let D=0;for(S=0;S<c.length;++S){let U=c[S];if(De(U,Uint8Array))D+U.length>R.length?(s.isBuffer(U)||(U=s.from(U)),U.copy(R,D)):Uint8Array.prototype.set.call(R,U,D);else if(s.isBuffer(U))U.copy(R,D);else throw new TypeError('"list" argument must be an Array of Buffers');D+=U.length}return R};function E(g,c){if(s.isBuffer(g))return g.length;if(ArrayBuffer.isView(g)||De(g,ArrayBuffer))return g.byteLength;if(typeof g!="string")throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof g);const u=g.length,S=arguments.length>2&&arguments[2]===!0;if(!S&&u===0)return 0;let R=!1;for(;;)switch(c){case"ascii":case"latin1":case"binary":return u;case"utf8":case"utf-8":return he(g).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return u*2;case"hex":return u>>>1;case"base64":return Ue(g).length;default:if(R)return S?-1:he(g).length;c=(""+c).toLowerCase(),R=!0}}s.byteLength=E;function C(g,c,u){let S=!1;if((c===void 0||c<0)&&(c=0),c>this.length||((u===void 0||u>this.length)&&(u=this.length),u<=0)||(u>>>=0,c>>>=0,u<=c))return"";for(g||(g="utf8");;)switch(g){case"hex":return H(this,c,u);case"utf8":case"utf-8":return P(this,c,u);case"ascii":return ee(this,c,u);case"latin1":case"binary":return re(this,c,u);case"base64":return z(this,c,u);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return se(this,c,u);default:if(S)throw new TypeError("Unknown encoding: "+g);g=(g+"").toLowerCase(),S=!0}}s.prototype._isBuffer=!0;function _(g,c,u){const S=g[c];g[c]=g[u],g[u]=S}s.prototype.swap16=function(){const c=this.length;if(c%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let u=0;u<c;u+=2)_(this,u,u+1);return this},s.prototype.swap32=function(){const c=this.length;if(c%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let u=0;u<c;u+=4)_(this,u,u+3),_(this,u+1,u+2);return this},s.prototype.swap64=function(){const c=this.length;if(c%8!==0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let u=0;u<c;u+=8)_(this,u,u+7),_(this,u+1,u+6),_(this,u+2,u+5),_(this,u+3,u+4);return this},s.prototype.toString=function(){const c=this.length;return c===0?"":arguments.length===0?P(this,0,c):C.apply(this,arguments)},s.prototype.toLocaleString=s.prototype.toString,s.prototype.equals=function(c){if(!s.isBuffer(c))throw new TypeError("Argument must be a Buffer");return this===c?!0:s.compare(this,c)===0},s.prototype.inspect=function(){let c="";const u=e.INSPECT_MAX_BYTES;return c=this.toString("hex",0,u).replace(/(.{2})/g,"$1 ").trim(),this.length>u&&(c+=" ... "),"<Buffer "+c+">"},n&&(s.prototype[n]=s.prototype.inspect),s.prototype.compare=function(c,u,S,R,D){if(De(c,Uint8Array)&&(c=s.from(c,c.offset,c.byteLength)),!s.isBuffer(c))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof c);if(u===void 0&&(u=0),S===void 0&&(S=c?c.length:0),R===void 0&&(R=0),D===void 0&&(D=this.length),u<0||S>c.length||R<0||D>this.length)throw new RangeError("out of range index");if(R>=D&&u>=S)return 0;if(R>=D)return-1;if(u>=S)return 1;if(u>>>=0,S>>>=0,R>>>=0,D>>>=0,this===c)return 0;let U=D-R,ue=S-u;const Ie=Math.min(U,ue),xe=this.slice(R,D),ge=c.slice(u,S);for(let Ee=0;Ee<Ie;++Ee)if(xe[Ee]!==ge[Ee]){U=xe[Ee],ue=ge[Ee];break}return U<ue?-1:ue<U?1:0};function T(g,c,u,S,R){if(g.length===0)return-1;if(typeof u=="string"?(S=u,u=0):u>2147483647?u=2147483647:u<-2147483648&&(u=-2147483648),u=+u,Ne(u)&&(u=R?0:g.length-1),u<0&&(u=g.length+u),u>=g.length){if(R)return-1;u=g.length-1}else if(u<0)if(R)u=0;else return-1;if(typeof c=="string"&&(c=s.from(c,S)),s.isBuffer(c))return c.length===0?-1:I(g,c,u,S,R);if(typeof c=="number")return c=c&255,typeof Uint8Array.prototype.indexOf=="function"?R?Uint8Array.prototype.indexOf.call(g,c,u):Uint8Array.prototype.lastIndexOf.call(g,c,u):I(g,[c],u,S,R);throw new TypeError("val must be string, number or Buffer")}function I(g,c,u,S,R){let D=1,U=g.length,ue=c.length;if(S!==void 0&&(S=String(S).toLowerCase(),S==="ucs2"||S==="ucs-2"||S==="utf16le"||S==="utf-16le")){if(g.length<2||c.length<2)return-1;D=2,U/=2,ue/=2,u/=2}function Ie(ge,Ee){return D===1?ge[Ee]:ge.readUInt16BE(Ee*D)}let xe;if(R){let ge=-1;for(xe=u;xe<U;xe++)if(Ie(g,xe)===Ie(c,ge===-1?0:xe-ge)){if(ge===-1&&(ge=xe),xe-ge+1===ue)return ge*D}else ge!==-1&&(xe-=xe-ge),ge=-1}else for(u+ue>U&&(u=U-ue),xe=u;xe>=0;xe--){let ge=!0;for(let Ee=0;Ee<ue;Ee++)if(Ie(g,xe+Ee)!==Ie(c,Ee)){ge=!1;break}if(ge)return xe}return-1}s.prototype.includes=function(c,u,S){return this.indexOf(c,u,S)!==-1},s.prototype.indexOf=function(c,u,S){return T(this,c,u,S,!0)},s.prototype.lastIndexOf=function(c,u,S){return T(this,c,u,S,!1)};function L(g,c,u,S){u=Number(u)||0;const R=g.length-u;S?(S=Number(S),S>R&&(S=R)):S=R;const D=c.length;S>D/2&&(S=D/2);let U;for(U=0;U<S;++U){const ue=parseInt(c.substr(U*2,2),16);if(Ne(ue))return U;g[u+U]=ue}return U}function N(g,c,u,S){return Re(he(c,g.length-u),g,u,S)}function O(g,c,u,S){return Re(Ze(c),g,u,S)}function K(g,c,u,S){return Re(Ue(c),g,u,S)}function F(g,c,u,S){return Re(Qe(c,g.length-u),g,u,S)}s.prototype.write=function(c,u,S,R){if(u===void 0)R="utf8",S=this.length,u=0;else if(S===void 0&&typeof u=="string")R=u,S=this.length,u=0;else if(isFinite(u))u=u>>>0,isFinite(S)?(S=S>>>0,R===void 0&&(R="utf8")):(R=S,S=void 0);else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");const D=this.length-u;if((S===void 0||S>D)&&(S=D),c.length>0&&(S<0||u<0)||u>this.length)throw new RangeError("Attempt to write outside buffer bounds");R||(R="utf8");let U=!1;for(;;)switch(R){case"hex":return L(this,c,u,S);case"utf8":case"utf-8":return N(this,c,u,S);case"ascii":case"latin1":case"binary":return O(this,c,u,S);case"base64":return K(this,c,u,S);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return F(this,c,u,S);default:if(U)throw new TypeError("Unknown encoding: "+R);R=(""+R).toLowerCase(),U=!0}},s.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function z(g,c,u){return c===0&&u===g.length?t.fromByteArray(g):t.fromByteArray(g.slice(c,u))}function P(g,c,u){u=Math.min(g.length,u);const S=[];let R=c;for(;R<u;){const D=g[R];let U=null,ue=D>239?4:D>223?3:D>191?2:1;if(R+ue<=u){let Ie,xe,ge,Ee;switch(ue){case 1:D<128&&(U=D);break;case 2:Ie=g[R+1],(Ie&192)===128&&(Ee=(D&31)<<6|Ie&63,Ee>127&&(U=Ee));break;case 3:Ie=g[R+1],xe=g[R+2],(Ie&192)===128&&(xe&192)===128&&(Ee=(D&15)<<12|(Ie&63)<<6|xe&63,Ee>2047&&(Ee<55296||Ee>57343)&&(U=Ee));break;case 4:Ie=g[R+1],xe=g[R+2],ge=g[R+3],(Ie&192)===128&&(xe&192)===128&&(ge&192)===128&&(Ee=(D&15)<<18|(Ie&63)<<12|(xe&63)<<6|ge&63,Ee>65535&&Ee<1114112&&(U=Ee))}}U===null?(U=65533,ue=1):U>65535&&(U-=65536,S.push(U>>>10&1023|55296),U=56320|U&1023),S.push(U),R+=ue}return ne(S)}const Y=4096;function ne(g){const c=g.length;if(c<=Y)return String.fromCharCode.apply(String,g);let u="",S=0;for(;S<c;)u+=String.fromCharCode.apply(String,g.slice(S,S+=Y));return u}function ee(g,c,u){let S="";u=Math.min(g.length,u);for(let R=c;R<u;++R)S+=String.fromCharCode(g[R]&127);return S}function re(g,c,u){let S="";u=Math.min(g.length,u);for(let R=c;R<u;++R)S+=String.fromCharCode(g[R]);return S}function H(g,c,u){const S=g.length;(!c||c<0)&&(c=0),(!u||u<0||u>S)&&(u=S);let R="";for(let D=c;D<u;++D)R+=We[g[D]];return R}function se(g,c,u){const S=g.slice(c,u);let R="";for(let D=0;D<S.length-1;D+=2)R+=String.fromCharCode(S[D]+S[D+1]*256);return R}s.prototype.slice=function(c,u){const S=this.length;c=~~c,u=u===void 0?S:~~u,c<0?(c+=S,c<0&&(c=0)):c>S&&(c=S),u<0?(u+=S,u<0&&(u=0)):u>S&&(u=S),u<c&&(u=c);const R=this.subarray(c,u);return Object.setPrototypeOf(R,s.prototype),R};function G(g,c,u){if(g%1!==0||g<0)throw new RangeError("offset is not uint");if(g+c>u)throw new RangeError("Trying to access beyond buffer length")}s.prototype.readUintLE=s.prototype.readUIntLE=function(c,u,S){c=c>>>0,u=u>>>0,S||G(c,u,this.length);let R=this[c],D=1,U=0;for(;++U<u&&(D*=256);)R+=this[c+U]*D;return R},s.prototype.readUintBE=s.prototype.readUIntBE=function(c,u,S){c=c>>>0,u=u>>>0,S||G(c,u,this.length);let R=this[c+--u],D=1;for(;u>0&&(D*=256);)R+=this[c+--u]*D;return R},s.prototype.readUint8=s.prototype.readUInt8=function(c,u){return c=c>>>0,u||G(c,1,this.length),this[c]},s.prototype.readUint16LE=s.prototype.readUInt16LE=function(c,u){return c=c>>>0,u||G(c,2,this.length),this[c]|this[c+1]<<8},s.prototype.readUint16BE=s.prototype.readUInt16BE=function(c,u){return c=c>>>0,u||G(c,2,this.length),this[c]<<8|this[c+1]},s.prototype.readUint32LE=s.prototype.readUInt32LE=function(c,u){return c=c>>>0,u||G(c,4,this.length),(this[c]|this[c+1]<<8|this[c+2]<<16)+this[c+3]*16777216},s.prototype.readUint32BE=s.prototype.readUInt32BE=function(c,u){return c=c>>>0,u||G(c,4,this.length),this[c]*16777216+(this[c+1]<<16|this[c+2]<<8|this[c+3])},s.prototype.readBigUInt64LE=je(function(c){c=c>>>0,q(c,"offset");const u=this[c],S=this[c+7];(u===void 0||S===void 0)&&te(c,this.length-8);const R=u+this[++c]*2**8+this[++c]*2**16+this[++c]*2**24,D=this[++c]+this[++c]*2**8+this[++c]*2**16+S*2**24;return BigInt(R)+(BigInt(D)<<BigInt(32))}),s.prototype.readBigUInt64BE=je(function(c){c=c>>>0,q(c,"offset");const u=this[c],S=this[c+7];(u===void 0||S===void 0)&&te(c,this.length-8);const R=u*2**24+this[++c]*2**16+this[++c]*2**8+this[++c],D=this[++c]*2**24+this[++c]*2**16+this[++c]*2**8+S;return(BigInt(R)<<BigInt(32))+BigInt(D)}),s.prototype.readIntLE=function(c,u,S){c=c>>>0,u=u>>>0,S||G(c,u,this.length);let R=this[c],D=1,U=0;for(;++U<u&&(D*=256);)R+=this[c+U]*D;return D*=128,R>=D&&(R-=Math.pow(2,8*u)),R},s.prototype.readIntBE=function(c,u,S){c=c>>>0,u=u>>>0,S||G(c,u,this.length);let R=u,D=1,U=this[c+--R];for(;R>0&&(D*=256);)U+=this[c+--R]*D;return D*=128,U>=D&&(U-=Math.pow(2,8*u)),U},s.prototype.readInt8=function(c,u){return c=c>>>0,u||G(c,1,this.length),this[c]&128?(255-this[c]+1)*-1:this[c]},s.prototype.readInt16LE=function(c,u){c=c>>>0,u||G(c,2,this.length);const S=this[c]|this[c+1]<<8;return S&32768?S|4294901760:S},s.prototype.readInt16BE=function(c,u){c=c>>>0,u||G(c,2,this.length);const S=this[c+1]|this[c]<<8;return S&32768?S|4294901760:S},s.prototype.readInt32LE=function(c,u){return c=c>>>0,u||G(c,4,this.length),this[c]|this[c+1]<<8|this[c+2]<<16|this[c+3]<<24},s.prototype.readInt32BE=function(c,u){return c=c>>>0,u||G(c,4,this.length),this[c]<<24|this[c+1]<<16|this[c+2]<<8|this[c+3]},s.prototype.readBigInt64LE=je(function(c){c=c>>>0,q(c,"offset");const u=this[c],S=this[c+7];(u===void 0||S===void 0)&&te(c,this.length-8);const R=this[c+4]+this[c+5]*2**8+this[c+6]*2**16+(S<<24);return(BigInt(R)<<BigInt(32))+BigInt(u+this[++c]*2**8+this[++c]*2**16+this[++c]*2**24)}),s.prototype.readBigInt64BE=je(function(c){c=c>>>0,q(c,"offset");const u=this[c],S=this[c+7];(u===void 0||S===void 0)&&te(c,this.length-8);const R=(u<<24)+this[++c]*2**16+this[++c]*2**8+this[++c];return(BigInt(R)<<BigInt(32))+BigInt(this[++c]*2**24+this[++c]*2**16+this[++c]*2**8+S)}),s.prototype.readFloatLE=function(c,u){return c=c>>>0,u||G(c,4,this.length),i.read(this,c,!0,23,4)},s.prototype.readFloatBE=function(c,u){return c=c>>>0,u||G(c,4,this.length),i.read(this,c,!1,23,4)},s.prototype.readDoubleLE=function(c,u){return c=c>>>0,u||G(c,8,this.length),i.read(this,c,!0,52,8)},s.prototype.readDoubleBE=function(c,u){return c=c>>>0,u||G(c,8,this.length),i.read(this,c,!1,52,8)};function V(g,c,u,S,R,D){if(!s.isBuffer(g))throw new TypeError('"buffer" argument must be a Buffer instance');if(c>R||c<D)throw new RangeError('"value" argument is out of bounds');if(u+S>g.length)throw new RangeError("Index out of range")}s.prototype.writeUintLE=s.prototype.writeUIntLE=function(c,u,S,R){if(c=+c,u=u>>>0,S=S>>>0,!R){const ue=Math.pow(2,8*S)-1;V(this,c,u,S,ue,0)}let D=1,U=0;for(this[u]=c&255;++U<S&&(D*=256);)this[u+U]=c/D&255;return u+S},s.prototype.writeUintBE=s.prototype.writeUIntBE=function(c,u,S,R){if(c=+c,u=u>>>0,S=S>>>0,!R){const ue=Math.pow(2,8*S)-1;V(this,c,u,S,ue,0)}let D=S-1,U=1;for(this[u+D]=c&255;--D>=0&&(U*=256);)this[u+D]=c/U&255;return u+S},s.prototype.writeUint8=s.prototype.writeUInt8=function(c,u,S){return c=+c,u=u>>>0,S||V(this,c,u,1,255,0),this[u]=c&255,u+1},s.prototype.writeUint16LE=s.prototype.writeUInt16LE=function(c,u,S){return c=+c,u=u>>>0,S||V(this,c,u,2,65535,0),this[u]=c&255,this[u+1]=c>>>8,u+2},s.prototype.writeUint16BE=s.prototype.writeUInt16BE=function(c,u,S){return c=+c,u=u>>>0,S||V(this,c,u,2,65535,0),this[u]=c>>>8,this[u+1]=c&255,u+2},s.prototype.writeUint32LE=s.prototype.writeUInt32LE=function(c,u,S){return c=+c,u=u>>>0,S||V(this,c,u,4,4294967295,0),this[u+3]=c>>>24,this[u+2]=c>>>16,this[u+1]=c>>>8,this[u]=c&255,u+4},s.prototype.writeUint32BE=s.prototype.writeUInt32BE=function(c,u,S){return c=+c,u=u>>>0,S||V(this,c,u,4,4294967295,0),this[u]=c>>>24,this[u+1]=c>>>16,this[u+2]=c>>>8,this[u+3]=c&255,u+4};function ae(g,c,u,S,R){A(c,S,R,g,u,7);let D=Number(c&BigInt(4294967295));g[u++]=D,D=D>>8,g[u++]=D,D=D>>8,g[u++]=D,D=D>>8,g[u++]=D;let U=Number(c>>BigInt(32)&BigInt(4294967295));return g[u++]=U,U=U>>8,g[u++]=U,U=U>>8,g[u++]=U,U=U>>8,g[u++]=U,u}function fe(g,c,u,S,R){A(c,S,R,g,u,7);let D=Number(c&BigInt(4294967295));g[u+7]=D,D=D>>8,g[u+6]=D,D=D>>8,g[u+5]=D,D=D>>8,g[u+4]=D;let U=Number(c>>BigInt(32)&BigInt(4294967295));return g[u+3]=U,U=U>>8,g[u+2]=U,U=U>>8,g[u+1]=U,U=U>>8,g[u]=U,u+8}s.prototype.writeBigUInt64LE=je(function(c,u=0){return ae(this,c,u,BigInt(0),BigInt("0xffffffffffffffff"))}),s.prototype.writeBigUInt64BE=je(function(c,u=0){return fe(this,c,u,BigInt(0),BigInt("0xffffffffffffffff"))}),s.prototype.writeIntLE=function(c,u,S,R){if(c=+c,u=u>>>0,!R){const Ie=Math.pow(2,8*S-1);V(this,c,u,S,Ie-1,-Ie)}let D=0,U=1,ue=0;for(this[u]=c&255;++D<S&&(U*=256);)c<0&&ue===0&&this[u+D-1]!==0&&(ue=1),this[u+D]=(c/U>>0)-ue&255;return u+S},s.prototype.writeIntBE=function(c,u,S,R){if(c=+c,u=u>>>0,!R){const Ie=Math.pow(2,8*S-1);V(this,c,u,S,Ie-1,-Ie)}let D=S-1,U=1,ue=0;for(this[u+D]=c&255;--D>=0&&(U*=256);)c<0&&ue===0&&this[u+D+1]!==0&&(ue=1),this[u+D]=(c/U>>0)-ue&255;return u+S},s.prototype.writeInt8=function(c,u,S){return c=+c,u=u>>>0,S||V(this,c,u,1,127,-128),c<0&&(c=255+c+1),this[u]=c&255,u+1},s.prototype.writeInt16LE=function(c,u,S){return c=+c,u=u>>>0,S||V(this,c,u,2,32767,-32768),this[u]=c&255,this[u+1]=c>>>8,u+2},s.prototype.writeInt16BE=function(c,u,S){return c=+c,u=u>>>0,S||V(this,c,u,2,32767,-32768),this[u]=c>>>8,this[u+1]=c&255,u+2},s.prototype.writeInt32LE=function(c,u,S){return c=+c,u=u>>>0,S||V(this,c,u,4,2147483647,-2147483648),this[u]=c&255,this[u+1]=c>>>8,this[u+2]=c>>>16,this[u+3]=c>>>24,u+4},s.prototype.writeInt32BE=function(c,u,S){return c=+c,u=u>>>0,S||V(this,c,u,4,2147483647,-2147483648),c<0&&(c=4294967295+c+1),this[u]=c>>>24,this[u+1]=c>>>16,this[u+2]=c>>>8,this[u+3]=c&255,u+4},s.prototype.writeBigInt64LE=je(function(c,u=0){return ae(this,c,u,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),s.prototype.writeBigInt64BE=je(function(c,u=0){return fe(this,c,u,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))});function X(g,c,u,S,R,D){if(u+S>g.length)throw new RangeError("Index out of range");if(u<0)throw new RangeError("Index out of range")}function $(g,c,u,S,R){return c=+c,u=u>>>0,R||X(g,c,u,4),i.write(g,c,u,S,23,4),u+4}s.prototype.writeFloatLE=function(c,u,S){return $(this,c,u,!0,S)},s.prototype.writeFloatBE=function(c,u,S){return $(this,c,u,!1,S)};function M(g,c,u,S,R){return c=+c,u=u>>>0,R||X(g,c,u,8),i.write(g,c,u,S,52,8),u+8}s.prototype.writeDoubleLE=function(c,u,S){return M(this,c,u,!0,S)},s.prototype.writeDoubleBE=function(c,u,S){return M(this,c,u,!1,S)},s.prototype.copy=function(c,u,S,R){if(!s.isBuffer(c))throw new TypeError("argument should be a Buffer");if(S||(S=0),!R&&R!==0&&(R=this.length),u>=c.length&&(u=c.length),u||(u=0),R>0&&R<S&&(R=S),R===S||c.length===0||this.length===0)return 0;if(u<0)throw new RangeError("targetStart out of bounds");if(S<0||S>=this.length)throw new RangeError("Index out of range");if(R<0)throw new RangeError("sourceEnd out of bounds");R>this.length&&(R=this.length),c.length-u<R-S&&(R=c.length-u+S);const D=R-S;return this===c&&typeof Uint8Array.prototype.copyWithin=="function"?this.copyWithin(u,S,R):Uint8Array.prototype.set.call(c,this.subarray(S,R),u),D},s.prototype.fill=function(c,u,S,R){if(typeof c=="string"){if(typeof u=="string"?(R=u,u=0,S=this.length):typeof S=="string"&&(R=S,S=this.length),R!==void 0&&typeof R!="string")throw new TypeError("encoding must be a string");if(typeof R=="string"&&!s.isEncoding(R))throw new TypeError("Unknown encoding: "+R);if(c.length===1){const U=c.charCodeAt(0);(R==="utf8"&&U<128||R==="latin1")&&(c=U)}}else typeof c=="number"?c=c&255:typeof c=="boolean"&&(c=Number(c));if(u<0||this.length<u||this.length<S)throw new RangeError("Out of range index");if(S<=u)return this;u=u>>>0,S=S===void 0?this.length:S>>>0,c||(c=0);let D;if(typeof c=="number")for(D=u;D<S;++D)this[D]=c;else{const U=s.isBuffer(c)?c:s.from(c,R),ue=U.length;if(ue===0)throw new TypeError('The value "'+c+'" is invalid for argument "value"');for(D=0;D<S-u;++D)this[D+u]=U[D%ue]}return this};const B={};function W(g,c,u){B[g]=class extends u{constructor(){super(),Object.defineProperty(this,"message",{value:c.apply(this,arguments),writable:!0,configurable:!0}),this.name=`${this.name} [${g}]`,this.stack,delete this.name}get code(){return g}set code(R){Object.defineProperty(this,"code",{configurable:!0,enumerable:!0,value:R,writable:!0})}toString(){return`${this.name} [${g}]: ${this.message}`}}}W("ERR_BUFFER_OUT_OF_BOUNDS",function(g){return g?`${g} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"},RangeError),W("ERR_INVALID_ARG_TYPE",function(g,c){return`The "${g}" argument must be of type number. Received type ${typeof c}`},TypeError),W("ERR_OUT_OF_RANGE",function(g,c,u){let S=`The value of "${g}" is out of range.`,R=u;return Number.isInteger(u)&&Math.abs(u)>2**32?R=ie(String(u)):typeof u=="bigint"&&(R=String(u),(u>BigInt(2)**BigInt(32)||u<-(BigInt(2)**BigInt(32)))&&(R=ie(R)),R+="n"),S+=` It must be ${c}. Received ${R}`,S},RangeError);function ie(g){let c="",u=g.length;const S=g[0]==="-"?1:0;for(;u>=S+4;u-=3)c=`_${g.slice(u-3,u)}${c}`;return`${g.slice(0,u)}${c}`}function x(g,c,u){q(c,"offset"),(g[c]===void 0||g[c+u]===void 0)&&te(c,g.length-(u+1))}function A(g,c,u,S,R,D){if(g>u||g<c){const U=typeof c=="bigint"?"n":"";let ue;throw c===0||c===BigInt(0)?ue=`>= 0${U} and < 2${U} ** ${(D+1)*8}${U}`:ue=`>= -(2${U} ** ${(D+1)*8-1}${U}) and < 2 ** ${(D+1)*8-1}${U}`,new B.ERR_OUT_OF_RANGE("value",ue,g)}x(S,R,D)}function q(g,c){if(typeof g!="number")throw new B.ERR_INVALID_ARG_TYPE(c,"number",g)}function te(g,c,u){throw Math.floor(g)!==g?(q(g,u),new B.ERR_OUT_OF_RANGE("offset","an integer",g)):c<0?new B.ERR_BUFFER_OUT_OF_BOUNDS:new B.ERR_OUT_OF_RANGE("offset",`>= 0 and <= ${c}`,g)}const be=/[^+/0-9A-Za-z-_]/g;function le(g){if(g=g.split("=")[0],g=g.trim().replace(be,""),g.length<2)return"";for(;g.length%4!==0;)g=g+"=";return g}function he(g,c){c=c||1/0;let u;const S=g.length;let R=null;const D=[];for(let U=0;U<S;++U){if(u=g.charCodeAt(U),u>55295&&u<57344){if(!R){if(u>56319){(c-=3)>-1&&D.push(239,191,189);continue}else if(U+1===S){(c-=3)>-1&&D.push(239,191,189);continue}R=u;continue}if(u<56320){(c-=3)>-1&&D.push(239,191,189),R=u;continue}u=(R-55296<<10|u-56320)+65536}else R&&(c-=3)>-1&&D.push(239,191,189);if(R=null,u<128){if((c-=1)<0)break;D.push(u)}else if(u<2048){if((c-=2)<0)break;D.push(u>>6|192,u&63|128)}else if(u<65536){if((c-=3)<0)break;D.push(u>>12|224,u>>6&63|128,u&63|128)}else if(u<1114112){if((c-=4)<0)break;D.push(u>>18|240,u>>12&63|128,u>>6&63|128,u&63|128)}else throw new Error("Invalid code point")}return D}function Ze(g){const c=[];for(let u=0;u<g.length;++u)c.push(g.charCodeAt(u)&255);return c}function Qe(g,c){let u,S,R;const D=[];for(let U=0;U<g.length&&!((c-=2)<0);++U)u=g.charCodeAt(U),S=u>>8,R=u%256,D.push(R),D.push(S);return D}function Ue(g){return t.toByteArray(le(g))}function Re(g,c,u,S){let R;for(R=0;R<S&&!(R+u>=c.length||R>=g.length);++R)c[R+u]=g[R];return R}function De(g,c){return g instanceof c||g!=null&&g.constructor!=null&&g.constructor.name!=null&&g.constructor.name===c.name}function Ne(g){return g!==g}const We=function(){const g="0123456789abcdef",c=new Array(256);for(let u=0;u<16;++u){const S=u*16;for(let R=0;R<16;++R)c[S+R]=g[u]+g[R]}return c}();function je(g){return typeof BigInt>"u"?oe:g}function oe(){throw new Error("BigInt not supported")}})(xi);(function(e,t){var i=xi,n=i.Buffer;function r(o,s){for(var l in o)s[l]=o[l]}n.from&&n.alloc&&n.allocUnsafe&&n.allocUnsafeSlow?e.exports=i:(r(i,t),t.Buffer=a);function a(o,s,l){return n(o,s,l)}a.prototype=Object.create(n.prototype),r(n,a),a.from=function(o,s,l){if(typeof o=="number")throw new TypeError("Argument must not be a number");return n(o,s,l)},a.alloc=function(o,s,l){if(typeof o!="number")throw new TypeError("Argument must be a number");var d=n(o);return s!==void 0?typeof l=="string"?d.fill(s,l):d.fill(s):d.fill(0),d},a.allocUnsafe=function(o){if(typeof o!="number")throw new TypeError("Argument must be a number");return n(o)},a.allocUnsafeSlow=function(o){if(typeof o!="number")throw new TypeError("Argument must be a number");return i.SlowBuffer(o)}})(ns,ns.exports);var yc=ns.exports,xa=65536,fp=4294967295;function hp(){throw new Error(`Secure random number generation is not supported by this browser.
Use Chrome, Firefox or Internet Explorer 11`)}var mp=yc.Buffer,_r=globalThis.crypto||globalThis.msCrypto;_r&&_r.getRandomValues?is.exports=gp:is.exports=hp;function gp(e,t){if(e>fp)throw new RangeError("requested too many random bytes");var i=mp.allocUnsafe(e);if(e>0)if(e>xa)for(var n=0;n<e;n+=xa)_r.getRandomValues(i.slice(n,n+xa));else _r.getRandomValues(i);return typeof t=="function"?process.nextTick(function(){t(null,i)}):i}var Ds=is.exports,rs={exports:{}},vc=Kr.EventEmitter;const yp={},vp=Object.freeze(Object.defineProperty({__proto__:null,default:yp},Symbol.toStringTag,{value:"Module"})),Ei=ju(vp);var Ea,Uo;function bp(){if(Uo)return Ea;Uo=1;function e(y,w){var k=Object.keys(y);if(Object.getOwnPropertySymbols){var m=Object.getOwnPropertySymbols(y);w&&(m=m.filter(function(b){return Object.getOwnPropertyDescriptor(y,b).enumerable})),k.push.apply(k,m)}return k}function t(y){for(var w=1;w<arguments.length;w++){var k=arguments[w]!=null?arguments[w]:{};w%2?e(Object(k),!0).forEach(function(m){i(y,m,k[m])}):Object.getOwnPropertyDescriptors?Object.defineProperties(y,Object.getOwnPropertyDescriptors(k)):e(Object(k)).forEach(function(m){Object.defineProperty(y,m,Object.getOwnPropertyDescriptor(k,m))})}return y}function i(y,w,k){return w=o(w),w in y?Object.defineProperty(y,w,{value:k,enumerable:!0,configurable:!0,writable:!0}):y[w]=k,y}function n(y,w){if(!(y instanceof w))throw new TypeError("Cannot call a class as a function")}function r(y,w){for(var k=0;k<w.length;k++){var m=w[k];m.enumerable=m.enumerable||!1,m.configurable=!0,"value"in m&&(m.writable=!0),Object.defineProperty(y,o(m.key),m)}}function a(y,w,k){return w&&r(y.prototype,w),Object.defineProperty(y,"prototype",{writable:!1}),y}function o(y){var w=s(y,"string");return typeof w=="symbol"?w:String(w)}function s(y,w){if(typeof y!="object"||y===null)return y;var k=y[Symbol.toPrimitive];if(k!==void 0){var m=k.call(y,w);if(typeof m!="object")return m;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(y)}var l=xi,d=l.Buffer,p=Ei,h=p.inspect,f=h&&h.custom||"inspect";function v(y,w,k){d.prototype.copy.call(y,w,k)}return Ea=function(){function y(){n(this,y),this.head=null,this.tail=null,this.length=0}return a(y,[{key:"push",value:function(k){var m={data:k,next:null};this.length>0?this.tail.next=m:this.head=m,this.tail=m,++this.length}},{key:"unshift",value:function(k){var m={data:k,next:this.head};this.length===0&&(this.tail=m),this.head=m,++this.length}},{key:"shift",value:function(){if(this.length!==0){var k=this.head.data;return this.length===1?this.head=this.tail=null:this.head=this.head.next,--this.length,k}}},{key:"clear",value:function(){this.head=this.tail=null,this.length=0}},{key:"join",value:function(k){if(this.length===0)return"";for(var m=this.head,b=""+m.data;m=m.next;)b+=k+m.data;return b}},{key:"concat",value:function(k){if(this.length===0)return d.alloc(0);for(var m=d.allocUnsafe(k>>>0),b=this.head,E=0;b;)v(b.data,m,E),E+=b.data.length,b=b.next;return m}},{key:"consume",value:function(k,m){var b;return k<this.head.data.length?(b=this.head.data.slice(0,k),this.head.data=this.head.data.slice(k)):k===this.head.data.length?b=this.shift():b=m?this._getString(k):this._getBuffer(k),b}},{key:"first",value:function(){return this.head.data}},{key:"_getString",value:function(k){var m=this.head,b=1,E=m.data;for(k-=E.length;m=m.next;){var C=m.data,_=k>C.length?C.length:k;if(_===C.length?E+=C:E+=C.slice(0,k),k-=_,k===0){_===C.length?(++b,m.next?this.head=m.next:this.head=this.tail=null):(this.head=m,m.data=C.slice(_));break}++b}return this.length-=b,E}},{key:"_getBuffer",value:function(k){var m=d.allocUnsafe(k),b=this.head,E=1;for(b.data.copy(m),k-=b.data.length;b=b.next;){var C=b.data,_=k>C.length?C.length:k;if(C.copy(m,m.length-k,0,_),k-=_,k===0){_===C.length?(++E,b.next?this.head=b.next:this.head=this.tail=null):(this.head=b,b.data=C.slice(_));break}++E}return this.length-=E,m}},{key:f,value:function(k,m){return h(this,t(t({},m),{},{depth:0,customInspect:!1}))}}]),y}(),Ea}function wp(e,t){var i=this,n=this._readableState&&this._readableState.destroyed,r=this._writableState&&this._writableState.destroyed;return n||r?(t?t(e):e&&(this._writableState?this._writableState.errorEmitted||(this._writableState.errorEmitted=!0,process.nextTick(as,this,e)):process.nextTick(as,this,e)),this):(this._readableState&&(this._readableState.destroyed=!0),this._writableState&&(this._writableState.destroyed=!0),this._destroy(e||null,function(a){!t&&a?i._writableState?i._writableState.errorEmitted?process.nextTick(nr,i):(i._writableState.errorEmitted=!0,process.nextTick(jo,i,a)):process.nextTick(jo,i,a):t?(process.nextTick(nr,i),t(a)):process.nextTick(nr,i)}),this)}function jo(e,t){as(e,t),nr(e)}function nr(e){e._writableState&&!e._writableState.emitClose||e._readableState&&!e._readableState.emitClose||e.emit("close")}function kp(){this._readableState&&(this._readableState.destroyed=!1,this._readableState.reading=!1,this._readableState.ended=!1,this._readableState.endEmitted=!1),this._writableState&&(this._writableState.destroyed=!1,this._writableState.ended=!1,this._writableState.ending=!1,this._writableState.finalCalled=!1,this._writableState.prefinished=!1,this._writableState.finished=!1,this._writableState.errorEmitted=!1)}function as(e,t){e.emit("error",t)}function _p(e,t){var i=e._readableState,n=e._writableState;i&&i.autoDestroy||n&&n.autoDestroy?e.destroy(t):e.emit("error",t)}var bc={destroy:wp,undestroy:kp,errorOrDestroy:_p},Ti={};function Sp(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}var wc={};function vt(e,t,i){i||(i=Error);function n(a,o,s){return typeof t=="string"?t:t(a,o,s)}var r=function(a){Sp(o,a);function o(s,l,d){return a.call(this,n(s,l,d))||this}return o}(i);r.prototype.name=i.name,r.prototype.code=e,wc[e]=r}function Ko(e,t){if(Array.isArray(e)){var i=e.length;return e=e.map(function(n){return String(n)}),i>2?"one of ".concat(t," ").concat(e.slice(0,i-1).join(", "),", or ")+e[i-1]:i===2?"one of ".concat(t," ").concat(e[0]," or ").concat(e[1]):"of ".concat(t," ").concat(e[0])}else return"of ".concat(t," ").concat(String(e))}function xp(e,t,i){return e.substr(0,t.length)===t}function Ep(e,t,i){return(i===void 0||i>e.length)&&(i=e.length),e.substring(i-t.length,i)===t}function Tp(e,t,i){return typeof i!="number"&&(i=0),i+t.length>e.length?!1:e.indexOf(t,i)!==-1}vt("ERR_INVALID_OPT_VALUE",function(e,t){return'The value "'+t+'" is invalid for option "'+e+'"'},TypeError);vt("ERR_INVALID_ARG_TYPE",function(e,t,i){var n;typeof t=="string"&&xp(t,"not ")?(n="must not be",t=t.replace(/^not /,"")):n="must be";var r;if(Ep(e," argument"))r="The ".concat(e," ").concat(n," ").concat(Ko(t,"type"));else{var a=Tp(e,".")?"property":"argument";r='The "'.concat(e,'" ').concat(a," ").concat(n," ").concat(Ko(t,"type"))}return r+=". Received type ".concat(typeof i),r},TypeError);vt("ERR_STREAM_PUSH_AFTER_EOF","stream.push() after EOF");vt("ERR_METHOD_NOT_IMPLEMENTED",function(e){return"The "+e+" method is not implemented"});vt("ERR_STREAM_PREMATURE_CLOSE","Premature close");vt("ERR_STREAM_DESTROYED",function(e){return"Cannot call "+e+" after a stream was destroyed"});vt("ERR_MULTIPLE_CALLBACK","Callback called multiple times");vt("ERR_STREAM_CANNOT_PIPE","Cannot pipe, not readable");vt("ERR_STREAM_WRITE_AFTER_END","write after end");vt("ERR_STREAM_NULL_VALUES","May not write null values to stream",TypeError);vt("ERR_UNKNOWN_ENCODING",function(e){return"Unknown encoding: "+e},TypeError);vt("ERR_STREAM_UNSHIFT_AFTER_END_EVENT","stream.unshift() after end event");Ti.codes=wc;var Ap=Ti.codes.ERR_INVALID_OPT_VALUE;function Cp(e,t,i){return e.highWaterMark!=null?e.highWaterMark:t?e[i]:null}function Lp(e,t,i,n){var r=Cp(t,n,i);if(r!=null){if(!(isFinite(r)&&Math.floor(r)===r)||r<0){var a=n?i:"highWaterMark";throw new Ap(a,r)}return Math.floor(r)}return e.objectMode?16:16*1024}var kc={getHighWaterMark:Lp},ss={exports:{}};typeof Object.create=="function"?ss.exports=function(t,i){i&&(t.super_=i,t.prototype=Object.create(i.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}))}:ss.exports=function(t,i){if(i){t.super_=i;var n=function(){};n.prototype=i.prototype,t.prototype=new n,t.prototype.constructor=t}};var In=ss.exports,Ip=Rp;function Rp(e,t){if(Ta("noDeprecation"))return e;var i=!1;function n(){if(!i){if(Ta("throwDeprecation"))throw new Error(t);Ta("traceDeprecation"),i=!0}return e.apply(this,arguments)}return n}function Ta(e){try{if(!globalThis.localStorage)return!1}catch{return!1}var t=globalThis.localStorage[e];return t==null?!1:String(t).toLowerCase()==="true"}var Aa,Wo;function _c(){if(Wo)return Aa;Wo=1,Aa=L;function e($){var M=this;this.next=null,this.entry=null,this.finish=function(){X(M,$)}}var t;L.WritableState=T;var i={deprecate:Ip},n=vc,r=xi.Buffer,a=(typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof self<"u"?self:{}).Uint8Array||function(){};function o($){return r.from($)}function s($){return r.isBuffer($)||$ instanceof a}var l=bc,d=kc,p=d.getHighWaterMark,h=Ti.codes,f=h.ERR_INVALID_ARG_TYPE,v=h.ERR_METHOD_NOT_IMPLEMENTED,y=h.ERR_MULTIPLE_CALLBACK,w=h.ERR_STREAM_CANNOT_PIPE,k=h.ERR_STREAM_DESTROYED,m=h.ERR_STREAM_NULL_VALUES,b=h.ERR_STREAM_WRITE_AFTER_END,E=h.ERR_UNKNOWN_ENCODING,C=l.errorOrDestroy;In(L,n);function _(){}function T($,M,B){t=t||Wi(),$=$||{},typeof B!="boolean"&&(B=M instanceof t),this.objectMode=!!$.objectMode,B&&(this.objectMode=this.objectMode||!!$.writableObjectMode),this.highWaterMark=p(this,$,"writableHighWaterMark",B),this.finalCalled=!1,this.needDrain=!1,this.ending=!1,this.ended=!1,this.finished=!1,this.destroyed=!1;var W=$.decodeStrings===!1;this.decodeStrings=!W,this.defaultEncoding=$.defaultEncoding||"utf8",this.length=0,this.writing=!1,this.corked=0,this.sync=!0,this.bufferProcessing=!1,this.onwrite=function(ie){ne(M,ie)},this.writecb=null,this.writelen=0,this.bufferedRequest=null,this.lastBufferedRequest=null,this.pendingcb=0,this.prefinished=!1,this.errorEmitted=!1,this.emitClose=$.emitClose!==!1,this.autoDestroy=!!$.autoDestroy,this.bufferedRequestCount=0,this.corkedRequestsFree=new e(this)}T.prototype.getBuffer=function(){for(var M=this.bufferedRequest,B=[];M;)B.push(M),M=M.next;return B},function(){try{Object.defineProperty(T.prototype,"buffer",{get:i.deprecate(function(){return this.getBuffer()},"_writableState.buffer is deprecated. Use _writableState.getBuffer instead.","DEP0003")})}catch{}}();var I;typeof Symbol=="function"&&Symbol.hasInstance&&typeof Function.prototype[Symbol.hasInstance]=="function"?(I=Function.prototype[Symbol.hasInstance],Object.defineProperty(L,Symbol.hasInstance,{value:function(M){return I.call(this,M)?!0:this!==L?!1:M&&M._writableState instanceof T}})):I=function(M){return M instanceof this};function L($){t=t||Wi();var M=this instanceof t;if(!M&&!I.call(L,this))return new L($);this._writableState=new T($,this,M),this.writable=!0,$&&(typeof $.write=="function"&&(this._write=$.write),typeof $.writev=="function"&&(this._writev=$.writev),typeof $.destroy=="function"&&(this._destroy=$.destroy),typeof $.final=="function"&&(this._final=$.final)),n.call(this)}L.prototype.pipe=function(){C(this,new w)};function N($,M){var B=new b;C($,B),process.nextTick(M,B)}function O($,M,B,W){var ie;return B===null?ie=new m:typeof B!="string"&&!M.objectMode&&(ie=new f("chunk",["string","Buffer"],B)),ie?(C($,ie),process.nextTick(W,ie),!1):!0}L.prototype.write=function($,M,B){var W=this._writableState,ie=!1,x=!W.objectMode&&s($);return x&&!r.isBuffer($)&&($=o($)),typeof M=="function"&&(B=M,M=null),x?M="buffer":M||(M=W.defaultEncoding),typeof B!="function"&&(B=_),W.ending?N(this,B):(x||O(this,W,$,B))&&(W.pendingcb++,ie=F(this,W,x,$,M,B)),ie},L.prototype.cork=function(){this._writableState.corked++},L.prototype.uncork=function(){var $=this._writableState;$.corked&&($.corked--,!$.writing&&!$.corked&&!$.bufferProcessing&&$.bufferedRequest&&H(this,$))},L.prototype.setDefaultEncoding=function(M){if(typeof M=="string"&&(M=M.toLowerCase()),!(["hex","utf8","utf-8","ascii","binary","base64","ucs2","ucs-2","utf16le","utf-16le","raw"].indexOf((M+"").toLowerCase())>-1))throw new E(M);return this._writableState.defaultEncoding=M,this},Object.defineProperty(L.prototype,"writableBuffer",{enumerable:!1,get:function(){return this._writableState&&this._writableState.getBuffer()}});function K($,M,B){return!$.objectMode&&$.decodeStrings!==!1&&typeof M=="string"&&(M=r.from(M,B)),M}Object.defineProperty(L.prototype,"writableHighWaterMark",{enumerable:!1,get:function(){return this._writableState.highWaterMark}});function F($,M,B,W,ie,x){if(!B){var A=K(M,W,ie);W!==A&&(B=!0,ie="buffer",W=A)}var q=M.objectMode?1:W.length;M.length+=q;var te=M.length<M.highWaterMark;if(te||(M.needDrain=!0),M.writing||M.corked){var be=M.lastBufferedRequest;M.lastBufferedRequest={chunk:W,encoding:ie,isBuf:B,callback:x,next:null},be?be.next=M.lastBufferedRequest:M.bufferedRequest=M.lastBufferedRequest,M.bufferedRequestCount+=1}else z($,M,!1,q,W,ie,x);return te}function z($,M,B,W,ie,x,A){M.writelen=W,M.writecb=A,M.writing=!0,M.sync=!0,M.destroyed?M.onwrite(new k("write")):B?$._writev(ie,M.onwrite):$._write(ie,x,M.onwrite),M.sync=!1}function P($,M,B,W,ie){--M.pendingcb,B?(process.nextTick(ie,W),process.nextTick(ae,$,M),$._writableState.errorEmitted=!0,C($,W)):(ie(W),$._writableState.errorEmitted=!0,C($,W),ae($,M))}function Y($){$.writing=!1,$.writecb=null,$.length-=$.writelen,$.writelen=0}function ne($,M){var B=$._writableState,W=B.sync,ie=B.writecb;if(typeof ie!="function")throw new y;if(Y(B),M)P($,B,W,M,ie);else{var x=se(B)||$.destroyed;!x&&!B.corked&&!B.bufferProcessing&&B.bufferedRequest&&H($,B),W?process.nextTick(ee,$,B,x,ie):ee($,B,x,ie)}}function ee($,M,B,W){B||re($,M),M.pendingcb--,W(),ae($,M)}function re($,M){M.length===0&&M.needDrain&&(M.needDrain=!1,$.emit("drain"))}function H($,M){M.bufferProcessing=!0;var B=M.bufferedRequest;if($._writev&&B&&B.next){var W=M.bufferedRequestCount,ie=new Array(W),x=M.corkedRequestsFree;x.entry=B;for(var A=0,q=!0;B;)ie[A]=B,B.isBuf||(q=!1),B=B.next,A+=1;ie.allBuffers=q,z($,M,!0,M.length,ie,"",x.finish),M.pendingcb++,M.lastBufferedRequest=null,x.next?(M.corkedRequestsFree=x.next,x.next=null):M.corkedRequestsFree=new e(M),M.bufferedRequestCount=0}else{for(;B;){var te=B.chunk,be=B.encoding,le=B.callback,he=M.objectMode?1:te.length;if(z($,M,!1,he,te,be,le),B=B.next,M.bufferedRequestCount--,M.writing)break}B===null&&(M.lastBufferedRequest=null)}M.bufferedRequest=B,M.bufferProcessing=!1}L.prototype._write=function($,M,B){B(new v("_write()"))},L.prototype._writev=null,L.prototype.end=function($,M,B){var W=this._writableState;return typeof $=="function"?(B=$,$=null,M=null):typeof M=="function"&&(B=M,M=null),$!=null&&this.write($,M),W.corked&&(W.corked=1,this.uncork()),W.ending||fe(this,W,B),this},Object.defineProperty(L.prototype,"writableLength",{enumerable:!1,get:function(){return this._writableState.length}});function se($){return $.ending&&$.length===0&&$.bufferedRequest===null&&!$.finished&&!$.writing}function G($,M){$._final(function(B){M.pendingcb--,B&&C($,B),M.prefinished=!0,$.emit("prefinish"),ae($,M)})}function V($,M){!M.prefinished&&!M.finalCalled&&(typeof $._final=="function"&&!M.destroyed?(M.pendingcb++,M.finalCalled=!0,process.nextTick(G,$,M)):(M.prefinished=!0,$.emit("prefinish")))}function ae($,M){var B=se(M);if(B&&(V($,M),M.pendingcb===0&&(M.finished=!0,$.emit("finish"),M.autoDestroy))){var W=$._readableState;(!W||W.autoDestroy&&W.endEmitted)&&$.destroy()}return B}function fe($,M,B){M.ending=!0,ae($,M),B&&(M.finished?process.nextTick(B):$.once("finish",B)),M.ended=!0,$.writable=!1}function X($,M,B){var W=$.entry;for($.entry=null;W;){var ie=W.callback;M.pendingcb--,ie(B),W=W.next}M.corkedRequestsFree.next=$}return Object.defineProperty(L.prototype,"destroyed",{enumerable:!1,get:function(){return this._writableState===void 0?!1:this._writableState.destroyed},set:function(M){this._writableState&&(this._writableState.destroyed=M)}}),L.prototype.destroy=l.destroy,L.prototype._undestroy=l.undestroy,L.prototype._destroy=function($,M){M($)},Aa}var Ca,Yo;function Wi(){if(Yo)return Ca;Yo=1;var e=Object.keys||function(d){var p=[];for(var h in d)p.push(h);return p};Ca=o;var t=xc(),i=_c();In(o,t);for(var n=e(i.prototype),r=0;r<n.length;r++){var a=n[r];o.prototype[a]||(o.prototype[a]=i.prototype[a])}function o(d){if(!(this instanceof o))return new o(d);t.call(this,d),i.call(this,d),this.allowHalfOpen=!0,d&&(d.readable===!1&&(this.readable=!1),d.writable===!1&&(this.writable=!1),d.allowHalfOpen===!1&&(this.allowHalfOpen=!1,this.once("end",s)))}Object.defineProperty(o.prototype,"writableHighWaterMark",{enumerable:!1,get:function(){return this._writableState.highWaterMark}}),Object.defineProperty(o.prototype,"writableBuffer",{enumerable:!1,get:function(){return this._writableState&&this._writableState.getBuffer()}}),Object.defineProperty(o.prototype,"writableLength",{enumerable:!1,get:function(){return this._writableState.length}});function s(){this._writableState.ended||process.nextTick(l,this)}function l(d){d.end()}return Object.defineProperty(o.prototype,"destroyed",{enumerable:!1,get:function(){return this._readableState===void 0||this._writableState===void 0?!1:this._readableState.destroyed&&this._writableState.destroyed},set:function(p){this._readableState===void 0||this._writableState===void 0||(this._readableState.destroyed=p,this._writableState.destroyed=p)}}),Ca}var La={},Vo;function Go(){if(Vo)return La;Vo=1;var e=yc.Buffer,t=e.isEncoding||function(m){switch(m=""+m,m&&m.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return!0;default:return!1}};function i(m){if(!m)return"utf8";for(var b;;)switch(m){case"utf8":case"utf-8":return"utf8";case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return"utf16le";case"latin1":case"binary":return"latin1";case"base64":case"ascii":case"hex":return m;default:if(b)return;m=(""+m).toLowerCase(),b=!0}}function n(m){var b=i(m);if(typeof b!="string"&&(e.isEncoding===t||!t(m)))throw new Error("Unknown encoding: "+m);return b||m}La.StringDecoder=r;function r(m){this.encoding=n(m);var b;switch(this.encoding){case"utf16le":this.text=h,this.end=f,b=4;break;case"utf8":this.fillLast=l,b=4;break;case"base64":this.text=v,this.end=y,b=3;break;default:this.write=w,this.end=k;return}this.lastNeed=0,this.lastTotal=0,this.lastChar=e.allocUnsafe(b)}r.prototype.write=function(m){if(m.length===0)return"";var b,E;if(this.lastNeed){if(b=this.fillLast(m),b===void 0)return"";E=this.lastNeed,this.lastNeed=0}else E=0;return E<m.length?b?b+this.text(m,E):this.text(m,E):b||""},r.prototype.end=p,r.prototype.text=d,r.prototype.fillLast=function(m){if(this.lastNeed<=m.length)return m.copy(this.lastChar,this.lastTotal-this.lastNeed,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal);m.copy(this.lastChar,this.lastTotal-this.lastNeed,0,m.length),this.lastNeed-=m.length};function a(m){return m<=127?0:m>>5===6?2:m>>4===14?3:m>>3===30?4:m>>6===2?-1:-2}function o(m,b,E){var C=b.length-1;if(C<E)return 0;var _=a(b[C]);return _>=0?(_>0&&(m.lastNeed=_-1),_):--C<E||_===-2?0:(_=a(b[C]),_>=0?(_>0&&(m.lastNeed=_-2),_):--C<E||_===-2?0:(_=a(b[C]),_>=0?(_>0&&(_===2?_=0:m.lastNeed=_-3),_):0))}function s(m,b,E){if((b[0]&192)!==128)return m.lastNeed=0,"�";if(m.lastNeed>1&&b.length>1){if((b[1]&192)!==128)return m.lastNeed=1,"�";if(m.lastNeed>2&&b.length>2&&(b[2]&192)!==128)return m.lastNeed=2,"�"}}function l(m){var b=this.lastTotal-this.lastNeed,E=s(this,m);if(E!==void 0)return E;if(this.lastNeed<=m.length)return m.copy(this.lastChar,b,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal);m.copy(this.lastChar,b,0,m.length),this.lastNeed-=m.length}function d(m,b){var E=o(this,m,b);if(!this.lastNeed)return m.toString("utf8",b);this.lastTotal=E;var C=m.length-(E-this.lastNeed);return m.copy(this.lastChar,0,C),m.toString("utf8",b,C)}function p(m){var b=m&&m.length?this.write(m):"";return this.lastNeed?b+"�":b}function h(m,b){if((m.length-b)%2===0){var E=m.toString("utf16le",b);if(E){var C=E.charCodeAt(E.length-1);if(C>=55296&&C<=56319)return this.lastNeed=2,this.lastTotal=4,this.lastChar[0]=m[m.length-2],this.lastChar[1]=m[m.length-1],E.slice(0,-1)}return E}return this.lastNeed=1,this.lastTotal=2,this.lastChar[0]=m[m.length-1],m.toString("utf16le",b,m.length-1)}function f(m){var b=m&&m.length?this.write(m):"";if(this.lastNeed){var E=this.lastTotal-this.lastNeed;return b+this.lastChar.toString("utf16le",0,E)}return b}function v(m,b){var E=(m.length-b)%3;return E===0?m.toString("base64",b):(this.lastNeed=3-E,this.lastTotal=3,E===1?this.lastChar[0]=m[m.length-1]:(this.lastChar[0]=m[m.length-2],this.lastChar[1]=m[m.length-1]),m.toString("base64",b,m.length-E))}function y(m){var b=m&&m.length?this.write(m):"";return this.lastNeed?b+this.lastChar.toString("base64",0,3-this.lastNeed):b}function w(m){return m.toString(this.encoding)}function k(m){return m&&m.length?this.write(m):""}return La}var Jo=Ti.codes.ERR_STREAM_PREMATURE_CLOSE;function $p(e){var t=!1;return function(){if(!t){t=!0;for(var i=arguments.length,n=new Array(i),r=0;r<i;r++)n[r]=arguments[r];e.apply(this,n)}}}function Mp(){}function Pp(e){return e.setHeader&&typeof e.abort=="function"}function Sc(e,t,i){if(typeof t=="function")return Sc(e,null,t);t||(t={}),i=$p(i||Mp);var n=t.readable||t.readable!==!1&&e.readable,r=t.writable||t.writable!==!1&&e.writable,a=function(){e.writable||s()},o=e._writableState&&e._writableState.finished,s=function(){r=!1,o=!0,n||i.call(e)},l=e._readableState&&e._readableState.endEmitted,d=function(){n=!1,l=!0,r||i.call(e)},p=function(y){i.call(e,y)},h=function(){var y;if(n&&!l)return(!e._readableState||!e._readableState.ended)&&(y=new Jo),i.call(e,y);if(r&&!o)return(!e._writableState||!e._writableState.ended)&&(y=new Jo),i.call(e,y)},f=function(){e.req.on("finish",s)};return Pp(e)?(e.on("complete",s),e.on("abort",h),e.req?f():e.on("request",f)):r&&!e._writableState&&(e.on("end",a),e.on("close",a)),e.on("end",d),e.on("finish",s),t.error!==!1&&e.on("error",p),e.on("close",h),function(){e.removeListener("complete",s),e.removeListener("abort",h),e.removeListener("request",f),e.req&&e.req.removeListener("finish",s),e.removeListener("end",a),e.removeListener("close",a),e.removeListener("finish",s),e.removeListener("end",d),e.removeListener("error",p),e.removeListener("close",h)}}var zs=Sc,Ia,Xo;function Bp(){if(Xo)return Ia;Xo=1;var e;function t(E,C,_){return C=i(C),C in E?Object.defineProperty(E,C,{value:_,enumerable:!0,configurable:!0,writable:!0}):E[C]=_,E}function i(E){var C=n(E,"string");return typeof C=="symbol"?C:String(C)}function n(E,C){if(typeof E!="object"||E===null)return E;var _=E[Symbol.toPrimitive];if(_!==void 0){var T=_.call(E,C);if(typeof T!="object")return T;throw new TypeError("@@toPrimitive must return a primitive value.")}return(C==="string"?String:Number)(E)}var r=zs,a=Symbol("lastResolve"),o=Symbol("lastReject"),s=Symbol("error"),l=Symbol("ended"),d=Symbol("lastPromise"),p=Symbol("handlePromise"),h=Symbol("stream");function f(E,C){return{value:E,done:C}}function v(E){var C=E[a];if(C!==null){var _=E[h].read();_!==null&&(E[d]=null,E[a]=null,E[o]=null,C(f(_,!1)))}}function y(E){process.nextTick(v,E)}function w(E,C){return function(_,T){E.then(function(){if(C[l]){_(f(void 0,!0));return}C[p](_,T)},T)}}var k=Object.getPrototypeOf(function(){}),m=Object.setPrototypeOf((e={get stream(){return this[h]},next:function(){var C=this,_=this[s];if(_!==null)return Promise.reject(_);if(this[l])return Promise.resolve(f(void 0,!0));if(this[h].destroyed)return new Promise(function(N,O){process.nextTick(function(){C[s]?O(C[s]):N(f(void 0,!0))})});var T=this[d],I;if(T)I=new Promise(w(T,this));else{var L=this[h].read();if(L!==null)return Promise.resolve(f(L,!1));I=new Promise(this[p])}return this[d]=I,I}},t(e,Symbol.asyncIterator,function(){return this}),t(e,"return",function(){var C=this;return new Promise(function(_,T){C[h].destroy(null,function(I){if(I){T(I);return}_(f(void 0,!0))})})}),e),k),b=function(C){var _,T=Object.create(m,(_={},t(_,h,{value:C,writable:!0}),t(_,a,{value:null,writable:!0}),t(_,o,{value:null,writable:!0}),t(_,s,{value:null,writable:!0}),t(_,l,{value:C._readableState.endEmitted,writable:!0}),t(_,p,{value:function(L,N){var O=T[h].read();O?(T[d]=null,T[a]=null,T[o]=null,L(f(O,!1))):(T[a]=L,T[o]=N)},writable:!0}),_));return T[d]=null,r(C,function(I){if(I&&I.code!=="ERR_STREAM_PREMATURE_CLOSE"){var L=T[o];L!==null&&(T[d]=null,T[a]=null,T[o]=null,L(I)),T[s]=I;return}var N=T[a];N!==null&&(T[d]=null,T[a]=null,T[o]=null,N(f(void 0,!0))),T[l]=!0}),C.on("readable",y.bind(null,T)),T};return Ia=b,Ia}var Ra,Zo;function Dp(){return Zo||(Zo=1,Ra=function(){throw new Error("Readable.from is not available in the browser")}),Ra}var $a,Qo;function xc(){if(Qo)return $a;Qo=1,$a=N;var e;N.ReadableState=L,Kr.EventEmitter;var t=function(A,q){return A.listeners(q).length},i=vc,n=xi.Buffer,r=(typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof self<"u"?self:{}).Uint8Array||function(){};function a(x){return n.from(x)}function o(x){return n.isBuffer(x)||x instanceof r}var s=Ei,l;s&&s.debuglog?l=s.debuglog("stream"):l=function(){};var d=bp(),p=bc,h=kc,f=h.getHighWaterMark,v=Ti.codes,y=v.ERR_INVALID_ARG_TYPE,w=v.ERR_STREAM_PUSH_AFTER_EOF,k=v.ERR_METHOD_NOT_IMPLEMENTED,m=v.ERR_STREAM_UNSHIFT_AFTER_END_EVENT,b,E,C;In(N,i);var _=p.errorOrDestroy,T=["error","close","destroy","pause","resume"];function I(x,A,q){if(typeof x.prependListener=="function")return x.prependListener(A,q);!x._events||!x._events[A]?x.on(A,q):Array.isArray(x._events[A])?x._events[A].unshift(q):x._events[A]=[q,x._events[A]]}function L(x,A,q){e=e||Wi(),x=x||{},typeof q!="boolean"&&(q=A instanceof e),this.objectMode=!!x.objectMode,q&&(this.objectMode=this.objectMode||!!x.readableObjectMode),this.highWaterMark=f(this,x,"readableHighWaterMark",q),this.buffer=new d,this.length=0,this.pipes=null,this.pipesCount=0,this.flowing=null,this.ended=!1,this.endEmitted=!1,this.reading=!1,this.sync=!0,this.needReadable=!1,this.emittedReadable=!1,this.readableListening=!1,this.resumeScheduled=!1,this.paused=!0,this.emitClose=x.emitClose!==!1,this.autoDestroy=!!x.autoDestroy,this.destroyed=!1,this.defaultEncoding=x.defaultEncoding||"utf8",this.awaitDrain=0,this.readingMore=!1,this.decoder=null,this.encoding=null,x.encoding&&(b||(b=Go().StringDecoder),this.decoder=new b(x.encoding),this.encoding=x.encoding)}function N(x){if(e=e||Wi(),!(this instanceof N))return new N(x);var A=this instanceof e;this._readableState=new L(x,this,A),this.readable=!0,x&&(typeof x.read=="function"&&(this._read=x.read),typeof x.destroy=="function"&&(this._destroy=x.destroy)),i.call(this)}Object.defineProperty(N.prototype,"destroyed",{enumerable:!1,get:function(){return this._readableState===void 0?!1:this._readableState.destroyed},set:function(A){this._readableState&&(this._readableState.destroyed=A)}}),N.prototype.destroy=p.destroy,N.prototype._undestroy=p.undestroy,N.prototype._destroy=function(x,A){A(x)},N.prototype.push=function(x,A){var q=this._readableState,te;return q.objectMode?te=!0:typeof x=="string"&&(A=A||q.defaultEncoding,A!==q.encoding&&(x=n.from(x,A),A=""),te=!0),O(this,x,A,!1,te)},N.prototype.unshift=function(x){return O(this,x,null,!0,!1)};function O(x,A,q,te,be){l("readableAddChunk",A);var le=x._readableState;if(A===null)le.reading=!1,ne(x,le);else{var he;if(be||(he=F(le,A)),he)_(x,he);else if(le.objectMode||A&&A.length>0)if(typeof A!="string"&&!le.objectMode&&Object.getPrototypeOf(A)!==n.prototype&&(A=a(A)),te)le.endEmitted?_(x,new m):K(x,le,A,!0);else if(le.ended)_(x,new w);else{if(le.destroyed)return!1;le.reading=!1,le.decoder&&!q?(A=le.decoder.write(A),le.objectMode||A.length!==0?K(x,le,A,!1):H(x,le)):K(x,le,A,!1)}else te||(le.reading=!1,H(x,le))}return!le.ended&&(le.length<le.highWaterMark||le.length===0)}function K(x,A,q,te){A.flowing&&A.length===0&&!A.sync?(A.awaitDrain=0,x.emit("data",q)):(A.length+=A.objectMode?1:q.length,te?A.buffer.unshift(q):A.buffer.push(q),A.needReadable&&ee(x)),H(x,A)}function F(x,A){var q;return!o(A)&&typeof A!="string"&&A!==void 0&&!x.objectMode&&(q=new y("chunk",["string","Buffer","Uint8Array"],A)),q}N.prototype.isPaused=function(){return this._readableState.flowing===!1},N.prototype.setEncoding=function(x){b||(b=Go().StringDecoder);var A=new b(x);this._readableState.decoder=A,this._readableState.encoding=this._readableState.decoder.encoding;for(var q=this._readableState.buffer.head,te="";q!==null;)te+=A.write(q.data),q=q.next;return this._readableState.buffer.clear(),te!==""&&this._readableState.buffer.push(te),this._readableState.length=te.length,this};var z=1073741824;function P(x){return x>=z?x=z:(x--,x|=x>>>1,x|=x>>>2,x|=x>>>4,x|=x>>>8,x|=x>>>16,x++),x}function Y(x,A){return x<=0||A.length===0&&A.ended?0:A.objectMode?1:x!==x?A.flowing&&A.length?A.buffer.head.data.length:A.length:(x>A.highWaterMark&&(A.highWaterMark=P(x)),x<=A.length?x:A.ended?A.length:(A.needReadable=!0,0))}N.prototype.read=function(x){l("read",x),x=parseInt(x,10);var A=this._readableState,q=x;if(x!==0&&(A.emittedReadable=!1),x===0&&A.needReadable&&((A.highWaterMark!==0?A.length>=A.highWaterMark:A.length>0)||A.ended))return l("read: emitReadable",A.length,A.ended),A.length===0&&A.ended?B(this):ee(this),null;if(x=Y(x,A),x===0&&A.ended)return A.length===0&&B(this),null;var te=A.needReadable;l("need readable",te),(A.length===0||A.length-x<A.highWaterMark)&&(te=!0,l("length less than watermark",te)),A.ended||A.reading?(te=!1,l("reading or ended",te)):te&&(l("do read"),A.reading=!0,A.sync=!0,A.length===0&&(A.needReadable=!0),this._read(A.highWaterMark),A.sync=!1,A.reading||(x=Y(q,A)));var be;return x>0?be=M(x,A):be=null,be===null?(A.needReadable=A.length<=A.highWaterMark,x=0):(A.length-=x,A.awaitDrain=0),A.length===0&&(A.ended||(A.needReadable=!0),q!==x&&A.ended&&B(this)),be!==null&&this.emit("data",be),be};function ne(x,A){if(l("onEofChunk"),!A.ended){if(A.decoder){var q=A.decoder.end();q&&q.length&&(A.buffer.push(q),A.length+=A.objectMode?1:q.length)}A.ended=!0,A.sync?ee(x):(A.needReadable=!1,A.emittedReadable||(A.emittedReadable=!0,re(x)))}}function ee(x){var A=x._readableState;l("emitReadable",A.needReadable,A.emittedReadable),A.needReadable=!1,A.emittedReadable||(l("emitReadable",A.flowing),A.emittedReadable=!0,process.nextTick(re,x))}function re(x){var A=x._readableState;l("emitReadable_",A.destroyed,A.length,A.ended),!A.destroyed&&(A.length||A.ended)&&(x.emit("readable"),A.emittedReadable=!1),A.needReadable=!A.flowing&&!A.ended&&A.length<=A.highWaterMark,$(x)}function H(x,A){A.readingMore||(A.readingMore=!0,process.nextTick(se,x,A))}function se(x,A){for(;!A.reading&&!A.ended&&(A.length<A.highWaterMark||A.flowing&&A.length===0);){var q=A.length;if(l("maybeReadMore read 0"),x.read(0),q===A.length)break}A.readingMore=!1}N.prototype._read=function(x){_(this,new k("_read()"))},N.prototype.pipe=function(x,A){var q=this,te=this._readableState;switch(te.pipesCount){case 0:te.pipes=x;break;case 1:te.pipes=[te.pipes,x];break;default:te.pipes.push(x);break}te.pipesCount+=1,l("pipe count=%d opts=%j",te.pipesCount,A);var be=(!A||A.end!==!1)&&x!==process.stdout&&x!==process.stderr,le=be?Ze:oe;te.endEmitted?process.nextTick(le):q.once("end",le),x.on("unpipe",he);function he(g,c){l("onunpipe"),g===q&&c&&c.hasUnpiped===!1&&(c.hasUnpiped=!0,Re())}function Ze(){l("onend"),x.end()}var Qe=G(q);x.on("drain",Qe);var Ue=!1;function Re(){l("cleanup"),x.removeListener("close",We),x.removeListener("finish",je),x.removeListener("drain",Qe),x.removeListener("error",Ne),x.removeListener("unpipe",he),q.removeListener("end",Ze),q.removeListener("end",oe),q.removeListener("data",De),Ue=!0,te.awaitDrain&&(!x._writableState||x._writableState.needDrain)&&Qe()}q.on("data",De);function De(g){l("ondata");var c=x.write(g);l("dest.write",c),c===!1&&((te.pipesCount===1&&te.pipes===x||te.pipesCount>1&&ie(te.pipes,x)!==-1)&&!Ue&&(l("false write response, pause",te.awaitDrain),te.awaitDrain++),q.pause())}function Ne(g){l("onerror",g),oe(),x.removeListener("error",Ne),t(x,"error")===0&&_(x,g)}I(x,"error",Ne);function We(){x.removeListener("finish",je),oe()}x.once("close",We);function je(){l("onfinish"),x.removeListener("close",We),oe()}x.once("finish",je);function oe(){l("unpipe"),q.unpipe(x)}return x.emit("pipe",q),te.flowing||(l("pipe resume"),q.resume()),x};function G(x){return function(){var q=x._readableState;l("pipeOnDrain",q.awaitDrain),q.awaitDrain&&q.awaitDrain--,q.awaitDrain===0&&t(x,"data")&&(q.flowing=!0,$(x))}}N.prototype.unpipe=function(x){var A=this._readableState,q={hasUnpiped:!1};if(A.pipesCount===0)return this;if(A.pipesCount===1)return x&&x!==A.pipes?this:(x||(x=A.pipes),A.pipes=null,A.pipesCount=0,A.flowing=!1,x&&x.emit("unpipe",this,q),this);if(!x){var te=A.pipes,be=A.pipesCount;A.pipes=null,A.pipesCount=0,A.flowing=!1;for(var le=0;le<be;le++)te[le].emit("unpipe",this,{hasUnpiped:!1});return this}var he=ie(A.pipes,x);return he===-1?this:(A.pipes.splice(he,1),A.pipesCount-=1,A.pipesCount===1&&(A.pipes=A.pipes[0]),x.emit("unpipe",this,q),this)},N.prototype.on=function(x,A){var q=i.prototype.on.call(this,x,A),te=this._readableState;return x==="data"?(te.readableListening=this.listenerCount("readable")>0,te.flowing!==!1&&this.resume()):x==="readable"&&!te.endEmitted&&!te.readableListening&&(te.readableListening=te.needReadable=!0,te.flowing=!1,te.emittedReadable=!1,l("on readable",te.length,te.reading),te.length?ee(this):te.reading||process.nextTick(ae,this)),q},N.prototype.addListener=N.prototype.on,N.prototype.removeListener=function(x,A){var q=i.prototype.removeListener.call(this,x,A);return x==="readable"&&process.nextTick(V,this),q},N.prototype.removeAllListeners=function(x){var A=i.prototype.removeAllListeners.apply(this,arguments);return(x==="readable"||x===void 0)&&process.nextTick(V,this),A};function V(x){var A=x._readableState;A.readableListening=x.listenerCount("readable")>0,A.resumeScheduled&&!A.paused?A.flowing=!0:x.listenerCount("data")>0&&x.resume()}function ae(x){l("readable nexttick read 0"),x.read(0)}N.prototype.resume=function(){var x=this._readableState;return x.flowing||(l("resume"),x.flowing=!x.readableListening,fe(this,x)),x.paused=!1,this};function fe(x,A){A.resumeScheduled||(A.resumeScheduled=!0,process.nextTick(X,x,A))}function X(x,A){l("resume",A.reading),A.reading||x.read(0),A.resumeScheduled=!1,x.emit("resume"),$(x),A.flowing&&!A.reading&&x.read(0)}N.prototype.pause=function(){return l("call pause flowing=%j",this._readableState.flowing),this._readableState.flowing!==!1&&(l("pause"),this._readableState.flowing=!1,this.emit("pause")),this._readableState.paused=!0,this};function $(x){var A=x._readableState;for(l("flow",A.flowing);A.flowing&&x.read()!==null;);}N.prototype.wrap=function(x){var A=this,q=this._readableState,te=!1;x.on("end",function(){if(l("wrapped end"),q.decoder&&!q.ended){var he=q.decoder.end();he&&he.length&&A.push(he)}A.push(null)}),x.on("data",function(he){if(l("wrapped data"),q.decoder&&(he=q.decoder.write(he)),!(q.objectMode&&he==null)&&!(!q.objectMode&&(!he||!he.length))){var Ze=A.push(he);Ze||(te=!0,x.pause())}});for(var be in x)this[be]===void 0&&typeof x[be]=="function"&&(this[be]=function(Ze){return function(){return x[Ze].apply(x,arguments)}}(be));for(var le=0;le<T.length;le++)x.on(T[le],this.emit.bind(this,T[le]));return this._read=function(he){l("wrapped _read",he),te&&(te=!1,x.resume())},this},typeof Symbol=="function"&&(N.prototype[Symbol.asyncIterator]=function(){return E===void 0&&(E=Bp()),E(this)}),Object.defineProperty(N.prototype,"readableHighWaterMark",{enumerable:!1,get:function(){return this._readableState.highWaterMark}}),Object.defineProperty(N.prototype,"readableBuffer",{enumerable:!1,get:function(){return this._readableState&&this._readableState.buffer}}),Object.defineProperty(N.prototype,"readableFlowing",{enumerable:!1,get:function(){return this._readableState.flowing},set:function(A){this._readableState&&(this._readableState.flowing=A)}}),N._fromList=M,Object.defineProperty(N.prototype,"readableLength",{enumerable:!1,get:function(){return this._readableState.length}});function M(x,A){if(A.length===0)return null;var q;return A.objectMode?q=A.buffer.shift():!x||x>=A.length?(A.decoder?q=A.buffer.join(""):A.buffer.length===1?q=A.buffer.first():q=A.buffer.concat(A.length),A.buffer.clear()):q=A.buffer.consume(x,A.decoder),q}function B(x){var A=x._readableState;l("endReadable",A.endEmitted),A.endEmitted||(A.ended=!0,process.nextTick(W,A,x))}function W(x,A){if(l("endReadableNT",x.endEmitted,x.length),!x.endEmitted&&x.length===0&&(x.endEmitted=!0,A.readable=!1,A.emit("end"),x.autoDestroy)){var q=A._writableState;(!q||q.autoDestroy&&q.finished)&&A.destroy()}}typeof Symbol=="function"&&(N.from=function(x,A){return C===void 0&&(C=Dp()),C(N,x,A)});function ie(x,A){for(var q=0,te=x.length;q<te;q++)if(x[q]===A)return q;return-1}return $a}var Ec=qt,Vr=Ti.codes,zp=Vr.ERR_METHOD_NOT_IMPLEMENTED,Op=Vr.ERR_MULTIPLE_CALLBACK,Np=Vr.ERR_TRANSFORM_ALREADY_TRANSFORMING,Hp=Vr.ERR_TRANSFORM_WITH_LENGTH_0,Gr=Wi();In(qt,Gr);function qp(e,t){var i=this._transformState;i.transforming=!1;var n=i.writecb;if(n===null)return this.emit("error",new Op);i.writechunk=null,i.writecb=null,t!=null&&this.push(t),n(e);var r=this._readableState;r.reading=!1,(r.needReadable||r.length<r.highWaterMark)&&this._read(r.highWaterMark)}function qt(e){if(!(this instanceof qt))return new qt(e);Gr.call(this,e),this._transformState={afterTransform:qp.bind(this),needTransform:!1,transforming:!1,writecb:null,writechunk:null,writeencoding:null},this._readableState.needReadable=!0,this._readableState.sync=!1,e&&(typeof e.transform=="function"&&(this._transform=e.transform),typeof e.flush=="function"&&(this._flush=e.flush)),this.on("prefinish",Fp)}function Fp(){var e=this;typeof this._flush=="function"&&!this._readableState.destroyed?this._flush(function(t,i){el(e,t,i)}):el(this,null,null)}qt.prototype.push=function(e,t){return this._transformState.needTransform=!1,Gr.prototype.push.call(this,e,t)};qt.prototype._transform=function(e,t,i){i(new zp("_transform()"))};qt.prototype._write=function(e,t,i){var n=this._transformState;if(n.writecb=i,n.writechunk=e,n.writeencoding=t,!n.transforming){var r=this._readableState;(n.needTransform||r.needReadable||r.length<r.highWaterMark)&&this._read(r.highWaterMark)}};qt.prototype._read=function(e){var t=this._transformState;t.writechunk!==null&&!t.transforming?(t.transforming=!0,this._transform(t.writechunk,t.writeencoding,t.afterTransform)):t.needTransform=!0};qt.prototype._destroy=function(e,t){Gr.prototype._destroy.call(this,e,function(i){t(i)})};function el(e,t,i){if(t)return e.emit("error",t);if(i!=null&&e.push(i),e._writableState.length)throw new Hp;if(e._transformState.transforming)throw new Np;return e.push(null)}var Up=En,Tc=Ec;In(En,Tc);function En(e){if(!(this instanceof En))return new En(e);Tc.call(this,e)}En.prototype._transform=function(e,t,i){i(null,e)};var Ma;function jp(e){var t=!1;return function(){t||(t=!0,e.apply(void 0,arguments))}}var Ac=Ti.codes,Kp=Ac.ERR_MISSING_ARGS,Wp=Ac.ERR_STREAM_DESTROYED;function tl(e){if(e)throw e}function Yp(e){return e.setHeader&&typeof e.abort=="function"}function Vp(e,t,i,n){n=jp(n);var r=!1;e.on("close",function(){r=!0}),Ma===void 0&&(Ma=zs),Ma(e,{readable:t,writable:i},function(o){if(o)return n(o);r=!0,n()});var a=!1;return function(o){if(!r&&!a){if(a=!0,Yp(e))return e.abort();if(typeof e.destroy=="function")return e.destroy();n(o||new Wp("pipe"))}}}function il(e){e()}function Gp(e,t){return e.pipe(t)}function Jp(e){return!e.length||typeof e[e.length-1]!="function"?tl:e.pop()}function Xp(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];var n=Jp(t);if(Array.isArray(t[0])&&(t=t[0]),t.length<2)throw new Kp("streams");var r,a=t.map(function(o,s){var l=s<t.length-1,d=s>0;return Vp(o,l,d,function(p){r||(r=p),p&&a.forEach(il),!l&&(a.forEach(il),n(r))})});return t.reduce(Gp)}var Zp=Xp;(function(e,t){t=e.exports=xc(),t.Stream=t,t.Readable=t,t.Writable=_c(),t.Duplex=Wi(),t.Transform=Ec,t.PassThrough=Up,t.finished=zs,t.pipeline=Zp})(rs,rs.exports);var Cc=rs.exports;function nl(e,t){for(const i in t)Object.defineProperty(e,i,{value:t[i],enumerable:!0,configurable:!0});return e}function Qp(e,t,i){if(!e||typeof e=="string")throw new TypeError("Please pass an Error to err-code");i||(i={}),typeof t=="object"&&(i=t,t=""),t&&(i.code=t);try{return nl(e,i)}catch{i.message=e.message,i.stack=e.stack;const r=function(){};return r.prototype=Object.create(Object.getPrototypeOf(e)),nl(new r,i)}}var ef=Qp;const tf=Ur("simple-peer"),Lc=rp,rl=Ds,nf=Cc,Pa=Wr,ve=ef,{Buffer:rf}=xi,Ba=64*1024,af=5*1e3,sf=5*1e3;function al(e){return e.replace(/a=ice-options:trickle\s\n/g,"")}let Jr=class os extends nf.Duplex{constructor(t){if(t=Object.assign({allowHalfOpen:!1},t),super(t),this._id=rl(4).toString("hex").slice(0,7),this._debug("new peer %o",t),this.channelName=t.initiator?t.channelName||rl(20).toString("hex"):null,this.initiator=t.initiator||!1,this.channelConfig=t.channelConfig||os.channelConfig,this.channelNegotiated=this.channelConfig.negotiated,this.config=Object.assign({},os.config,t.config),this.offerOptions=t.offerOptions||{},this.answerOptions=t.answerOptions||{},this.sdpTransform=t.sdpTransform||(i=>i),this.streams=t.streams||(t.stream?[t.stream]:[]),this.trickle=t.trickle!==void 0?t.trickle:!0,this.allowHalfTrickle=t.allowHalfTrickle!==void 0?t.allowHalfTrickle:!1,this.iceCompleteTimeout=t.iceCompleteTimeout||af,this.destroyed=!1,this.destroying=!1,this._connected=!1,this.remoteAddress=void 0,this.remoteFamily=void 0,this.remotePort=void 0,this.localAddress=void 0,this.localFamily=void 0,this.localPort=void 0,this._wrtc=t.wrtc&&typeof t.wrtc=="object"?t.wrtc:Lc(),!this._wrtc)throw ve(typeof window>"u"?new Error("No WebRTC support: Specify `opts.wrtc` option in this environment"):new Error("No WebRTC support: Not a supported browser"),"ERR_WEBRTC_SUPPORT");this._pcReady=!1,this._channelReady=!1,this._iceComplete=!1,this._iceCompleteTimer=null,this._channel=null,this._pendingCandidates=[],this._isNegotiating=!1,this._firstNegotiation=!0,this._batchedNegotiation=!1,this._queuedNegotiation=!1,this._sendersAwaitingStable=[],this._senderMap=new Map,this._closingInterval=null,this._remoteTracks=[],this._remoteStreams=[],this._chunk=null,this._cb=null,this._interval=null;try{this._pc=new this._wrtc.RTCPeerConnection(this.config)}catch(i){this.destroy(ve(i,"ERR_PC_CONSTRUCTOR"));return}this._isReactNativeWebrtc=typeof this._pc._peerConnectionId=="number",this._pc.oniceconnectionstatechange=()=>{this._onIceStateChange()},this._pc.onicegatheringstatechange=()=>{this._onIceStateChange()},this._pc.onconnectionstatechange=()=>{this._onConnectionStateChange()},this._pc.onsignalingstatechange=()=>{this._onSignalingStateChange()},this._pc.onicecandidate=i=>{this._onIceCandidate(i)},typeof this._pc.peerIdentity=="object"&&this._pc.peerIdentity.catch(i=>{this.destroy(ve(i,"ERR_PC_PEER_IDENTITY"))}),this.initiator||this.channelNegotiated?this._setupData({channel:this._pc.createDataChannel(this.channelName,this.channelConfig)}):this._pc.ondatachannel=i=>{this._setupData(i)},this.streams&&this.streams.forEach(i=>{this.addStream(i)}),this._pc.ontrack=i=>{this._onTrack(i)},this._debug("initial negotiation"),this._needsNegotiation(),this._onFinishBound=()=>{this._onFinish()},this.once("finish",this._onFinishBound)}get bufferSize(){return this._channel&&this._channel.bufferedAmount||0}get connected(){return this._connected&&this._channel.readyState==="open"}address(){return{port:this.localPort,family:this.localFamily,address:this.localAddress}}signal(t){if(!this.destroying){if(this.destroyed)throw ve(new Error("cannot signal after peer is destroyed"),"ERR_DESTROYED");if(typeof t=="string")try{t=JSON.parse(t)}catch{t={}}this._debug("signal()"),t.renegotiate&&this.initiator&&(this._debug("got request to renegotiate"),this._needsNegotiation()),t.transceiverRequest&&this.initiator&&(this._debug("got request for transceiver"),this.addTransceiver(t.transceiverRequest.kind,t.transceiverRequest.init)),t.candidate&&(this._pc.remoteDescription&&this._pc.remoteDescription.type?this._addIceCandidate(t.candidate):this._pendingCandidates.push(t.candidate)),t.sdp&&this._pc.setRemoteDescription(new this._wrtc.RTCSessionDescription(t)).then(()=>{this.destroyed||(this._pendingCandidates.forEach(i=>{this._addIceCandidate(i)}),this._pendingCandidates=[],this._pc.remoteDescription.type==="offer"&&this._createAnswer())}).catch(i=>{this.destroy(ve(i,"ERR_SET_REMOTE_DESCRIPTION"))}),!t.sdp&&!t.candidate&&!t.renegotiate&&!t.transceiverRequest&&this.destroy(ve(new Error("signal() called with invalid signal data"),"ERR_SIGNALING"))}}_addIceCandidate(t){const i=new this._wrtc.RTCIceCandidate(t);this._pc.addIceCandidate(i).catch(n=>{!i.address||i.address.endsWith(".local")?void 0:this.destroy(ve(n,"ERR_ADD_ICE_CANDIDATE"))})}send(t){if(!this.destroying){if(this.destroyed)throw ve(new Error("cannot send after peer is destroyed"),"ERR_DESTROYED");this._channel.send(t)}}addTransceiver(t,i){if(!this.destroying){if(this.destroyed)throw ve(new Error("cannot addTransceiver after peer is destroyed"),"ERR_DESTROYED");if(this._debug("addTransceiver()"),this.initiator)try{this._pc.addTransceiver(t,i),this._needsNegotiation()}catch(n){this.destroy(ve(n,"ERR_ADD_TRANSCEIVER"))}else this.emit("signal",{type:"transceiverRequest",transceiverRequest:{kind:t,init:i}})}}addStream(t){if(!this.destroying){if(this.destroyed)throw ve(new Error("cannot addStream after peer is destroyed"),"ERR_DESTROYED");this._debug("addStream()"),t.getTracks().forEach(i=>{this.addTrack(i,t)})}}addTrack(t,i){if(this.destroying)return;if(this.destroyed)throw ve(new Error("cannot addTrack after peer is destroyed"),"ERR_DESTROYED");this._debug("addTrack()");const n=this._senderMap.get(t)||new Map;let r=n.get(i);if(!r)r=this._pc.addTrack(t,i),n.set(i,r),this._senderMap.set(t,n),this._needsNegotiation();else throw r.removed?ve(new Error("Track has been removed. You should enable/disable tracks that you want to re-add."),"ERR_SENDER_REMOVED"):ve(new Error("Track has already been added to that stream."),"ERR_SENDER_ALREADY_ADDED")}replaceTrack(t,i,n){if(this.destroying)return;if(this.destroyed)throw ve(new Error("cannot replaceTrack after peer is destroyed"),"ERR_DESTROYED");this._debug("replaceTrack()");const r=this._senderMap.get(t),a=r?r.get(n):null;if(!a)throw ve(new Error("Cannot replace track that was never added."),"ERR_TRACK_NOT_ADDED");i&&this._senderMap.set(i,r),a.replaceTrack!=null?a.replaceTrack(i):this.destroy(ve(new Error("replaceTrack is not supported in this browser"),"ERR_UNSUPPORTED_REPLACETRACK"))}removeTrack(t,i){if(this.destroying)return;if(this.destroyed)throw ve(new Error("cannot removeTrack after peer is destroyed"),"ERR_DESTROYED");this._debug("removeSender()");const n=this._senderMap.get(t),r=n?n.get(i):null;if(!r)throw ve(new Error("Cannot remove track that was never added."),"ERR_TRACK_NOT_ADDED");try{r.removed=!0,this._pc.removeTrack(r)}catch(a){a.name==="NS_ERROR_UNEXPECTED"?this._sendersAwaitingStable.push(r):this.destroy(ve(a,"ERR_REMOVE_TRACK"))}this._needsNegotiation()}removeStream(t){if(!this.destroying){if(this.destroyed)throw ve(new Error("cannot removeStream after peer is destroyed"),"ERR_DESTROYED");this._debug("removeSenders()"),t.getTracks().forEach(i=>{this.removeTrack(i,t)})}}_needsNegotiation(){this._debug("_needsNegotiation"),!this._batchedNegotiation&&(this._batchedNegotiation=!0,Pa(()=>{this._batchedNegotiation=!1,this.initiator||!this._firstNegotiation?(this._debug("starting batched negotiation"),this.negotiate()):this._debug("non-initiator initial negotiation request discarded"),this._firstNegotiation=!1}))}negotiate(){if(!this.destroying){if(this.destroyed)throw ve(new Error("cannot negotiate after peer is destroyed"),"ERR_DESTROYED");this.initiator?this._isNegotiating?(this._queuedNegotiation=!0,this._debug("already negotiating, queueing")):(this._debug("start negotiation"),setTimeout(()=>{this._createOffer()},0)):this._isNegotiating?(this._queuedNegotiation=!0,this._debug("already negotiating, queueing")):(this._debug("requesting negotiation from initiator"),this.emit("signal",{type:"renegotiate",renegotiate:!0})),this._isNegotiating=!0}}destroy(t){this._destroy(t,()=>{})}_destroy(t,i){this.destroyed||this.destroying||(this.destroying=!0,this._debug("destroying (error: %s)",t&&(t.message||t)),Pa(()=>{if(this.destroyed=!0,this.destroying=!1,this._debug("destroy (error: %s)",t&&(t.message||t)),this.readable=this.writable=!1,this._readableState.ended||this.push(null),this._writableState.finished||this.end(),this._connected=!1,this._pcReady=!1,this._channelReady=!1,this._remoteTracks=null,this._remoteStreams=null,this._senderMap=null,clearInterval(this._closingInterval),this._closingInterval=null,clearInterval(this._interval),this._interval=null,this._chunk=null,this._cb=null,this._onFinishBound&&this.removeListener("finish",this._onFinishBound),this._onFinishBound=null,this._channel){try{this._channel.close()}catch{}this._channel.onmessage=null,this._channel.onopen=null,this._channel.onclose=null,this._channel.onerror=null}if(this._pc){try{this._pc.close()}catch{}this._pc.oniceconnectionstatechange=null,this._pc.onicegatheringstatechange=null,this._pc.onsignalingstatechange=null,this._pc.onicecandidate=null,this._pc.ontrack=null,this._pc.ondatachannel=null}this._pc=null,this._channel=null,t&&this.emit("error",t),this.emit("close"),i()}))}_setupData(t){if(!t.channel)return this.destroy(ve(new Error("Data channel event is missing `channel` property"),"ERR_DATA_CHANNEL"));this._channel=t.channel,this._channel.binaryType="arraybuffer",typeof this._channel.bufferedAmountLowThreshold=="number"&&(this._channel.bufferedAmountLowThreshold=Ba),this.channelName=this._channel.label,this._channel.onmessage=n=>{this._onChannelMessage(n)},this._channel.onbufferedamountlow=()=>{this._onChannelBufferedAmountLow()},this._channel.onopen=()=>{this._onChannelOpen()},this._channel.onclose=()=>{this._onChannelClose()},this._channel.onerror=n=>{const r=n.error instanceof Error?n.error:new Error(`Datachannel error: ${n.message} ${n.filename}:${n.lineno}:${n.colno}`);this.destroy(ve(r,"ERR_DATA_CHANNEL"))};let i=!1;this._closingInterval=setInterval(()=>{this._channel&&this._channel.readyState==="closing"?(i&&this._onChannelClose(),i=!0):i=!1},sf)}_read(){}_write(t,i,n){if(this.destroyed)return n(ve(new Error("cannot write after peer is destroyed"),"ERR_DATA_CHANNEL"));if(this._connected){try{this.send(t)}catch(r){return this.destroy(ve(r,"ERR_DATA_CHANNEL"))}this._channel.bufferedAmount>Ba?(this._debug("start backpressure: bufferedAmount %d",this._channel.bufferedAmount),this._cb=n):n(null)}else this._debug("write before connect"),this._chunk=t,this._cb=n}_onFinish(){if(this.destroyed)return;const t=()=>{setTimeout(()=>this.destroy(),1e3)};this._connected?t():this.once("connect",t)}_startIceCompleteTimeout(){this.destroyed||this._iceCompleteTimer||(this._debug("started iceComplete timeout"),this._iceCompleteTimer=setTimeout(()=>{this._iceComplete||(this._iceComplete=!0,this._debug("iceComplete timeout completed"),this.emit("iceTimeout"),this.emit("_iceComplete"))},this.iceCompleteTimeout))}_createOffer(){this.destroyed||this._pc.createOffer(this.offerOptions).then(t=>{if(this.destroyed)return;!this.trickle&&!this.allowHalfTrickle&&(t.sdp=al(t.sdp)),t.sdp=this.sdpTransform(t.sdp);const i=()=>{if(this.destroyed)return;const a=this._pc.localDescription||t;this._debug("signal"),this.emit("signal",{type:a.type,sdp:a.sdp})},n=()=>{this._debug("createOffer success"),!this.destroyed&&(this.trickle||this._iceComplete?i():this.once("_iceComplete",i))},r=a=>{this.destroy(ve(a,"ERR_SET_LOCAL_DESCRIPTION"))};this._pc.setLocalDescription(t).then(n).catch(r)}).catch(t=>{this.destroy(ve(t,"ERR_CREATE_OFFER"))})}_requestMissingTransceivers(){this._pc.getTransceivers&&this._pc.getTransceivers().forEach(t=>{!t.mid&&t.sender.track&&!t.requested&&(t.requested=!0,this.addTransceiver(t.sender.track.kind))})}_createAnswer(){this.destroyed||this._pc.createAnswer(this.answerOptions).then(t=>{if(this.destroyed)return;!this.trickle&&!this.allowHalfTrickle&&(t.sdp=al(t.sdp)),t.sdp=this.sdpTransform(t.sdp);const i=()=>{if(this.destroyed)return;const a=this._pc.localDescription||t;this._debug("signal"),this.emit("signal",{type:a.type,sdp:a.sdp}),this.initiator||this._requestMissingTransceivers()},n=()=>{this.destroyed||(this.trickle||this._iceComplete?i():this.once("_iceComplete",i))},r=a=>{this.destroy(ve(a,"ERR_SET_LOCAL_DESCRIPTION"))};this._pc.setLocalDescription(t).then(n).catch(r)}).catch(t=>{this.destroy(ve(t,"ERR_CREATE_ANSWER"))})}_onConnectionStateChange(){this.destroyed||this._pc.connectionState==="failed"&&this.destroy(ve(new Error("Connection failed."),"ERR_CONNECTION_FAILURE"))}_onIceStateChange(){if(this.destroyed)return;const t=this._pc.iceConnectionState,i=this._pc.iceGatheringState;this._debug("iceStateChange (connection: %s) (gathering: %s)",t,i),this.emit("iceStateChange",t,i),(t==="connected"||t==="completed")&&(this._pcReady=!0,this._maybeReady()),t==="failed"&&this.destroy(ve(new Error("Ice connection failed."),"ERR_ICE_CONNECTION_FAILURE")),t==="closed"&&this.destroy(ve(new Error("Ice connection closed."),"ERR_ICE_CONNECTION_CLOSED"))}getStats(t){const i=n=>(Object.prototype.toString.call(n.values)==="[object Array]"&&n.values.forEach(r=>{Object.assign(n,r)}),n);this._pc.getStats.length===0||this._isReactNativeWebrtc?this._pc.getStats().then(n=>{const r=[];n.forEach(a=>{r.push(i(a))}),t(null,r)},n=>t(n)):this._pc.getStats.length>0?this._pc.getStats(n=>{if(this.destroyed)return;const r=[];n.result().forEach(a=>{const o={};a.names().forEach(s=>{o[s]=a.stat(s)}),o.id=a.id,o.type=a.type,o.timestamp=a.timestamp,r.push(i(o))}),t(null,r)},n=>t(n)):t(null,[])}_maybeReady(){if(this._debug("maybeReady pc %s channel %s",this._pcReady,this._channelReady),this._connected||this._connecting||!this._pcReady||!this._channelReady)return;this._connecting=!0;const t=()=>{this.destroyed||this.getStats((i,n)=>{if(this.destroyed)return;i&&(n=[]);const r={},a={},o={};let s=!1;n.forEach(d=>{(d.type==="remotecandidate"||d.type==="remote-candidate")&&(r[d.id]=d),(d.type==="localcandidate"||d.type==="local-candidate")&&(a[d.id]=d),(d.type==="candidatepair"||d.type==="candidate-pair")&&(o[d.id]=d)});const l=d=>{s=!0;let p=a[d.localCandidateId];p&&(p.ip||p.address)?(this.localAddress=p.ip||p.address,this.localPort=Number(p.port)):p&&p.ipAddress?(this.localAddress=p.ipAddress,this.localPort=Number(p.portNumber)):typeof d.googLocalAddress=="string"&&(p=d.googLocalAddress.split(":"),this.localAddress=p[0],this.localPort=Number(p[1])),this.localAddress&&(this.localFamily=this.localAddress.includes(":")?"IPv6":"IPv4");let h=r[d.remoteCandidateId];h&&(h.ip||h.address)?(this.remoteAddress=h.ip||h.address,this.remotePort=Number(h.port)):h&&h.ipAddress?(this.remoteAddress=h.ipAddress,this.remotePort=Number(h.portNumber)):typeof d.googRemoteAddress=="string"&&(h=d.googRemoteAddress.split(":"),this.remoteAddress=h[0],this.remotePort=Number(h[1])),this.remoteAddress&&(this.remoteFamily=this.remoteAddress.includes(":")?"IPv6":"IPv4"),this._debug("connect local: %s:%s remote: %s:%s",this.localAddress,this.localPort,this.remoteAddress,this.remotePort)};if(n.forEach(d=>{d.type==="transport"&&d.selectedCandidatePairId&&l(o[d.selectedCandidatePairId]),(d.type==="googCandidatePair"&&d.googActiveConnection==="true"||(d.type==="candidatepair"||d.type==="candidate-pair")&&d.selected)&&l(d)}),!s&&(!Object.keys(o).length||Object.keys(a).length)){setTimeout(t,100);return}else this._connecting=!1,this._connected=!0;if(this._chunk){try{this.send(this._chunk)}catch(p){return this.destroy(ve(p,"ERR_DATA_CHANNEL"))}this._chunk=null,this._debug('sent chunk from "write before connect"');const d=this._cb;this._cb=null,d(null)}typeof this._channel.bufferedAmountLowThreshold!="number"&&(this._interval=setInterval(()=>this._onInterval(),150),this._interval.unref&&this._interval.unref()),this._debug("connect"),this.emit("connect")})};t()}_onInterval(){!this._cb||!this._channel||this._channel.bufferedAmount>Ba||this._onChannelBufferedAmountLow()}_onSignalingStateChange(){this.destroyed||(this._pc.signalingState==="stable"&&(this._isNegotiating=!1,this._debug("flushing sender queue",this._sendersAwaitingStable),this._sendersAwaitingStable.forEach(t=>{this._pc.removeTrack(t),this._queuedNegotiation=!0}),this._sendersAwaitingStable=[],this._queuedNegotiation?(this._debug("flushing negotiation queue"),this._queuedNegotiation=!1,this._needsNegotiation()):(this._debug("negotiated"),this.emit("negotiated"))),this._debug("signalingStateChange %s",this._pc.signalingState),this.emit("signalingStateChange",this._pc.signalingState))}_onIceCandidate(t){this.destroyed||(t.candidate&&this.trickle?this.emit("signal",{type:"candidate",candidate:{candidate:t.candidate.candidate,sdpMLineIndex:t.candidate.sdpMLineIndex,sdpMid:t.candidate.sdpMid}}):!t.candidate&&!this._iceComplete&&(this._iceComplete=!0,this.emit("_iceComplete")),t.candidate&&this._startIceCompleteTimeout())}_onChannelMessage(t){if(this.destroyed)return;let i=t.data;i instanceof ArrayBuffer&&(i=rf.from(i)),this.push(i)}_onChannelBufferedAmountLow(){if(this.destroyed||!this._cb)return;this._debug("ending backpressure: bufferedAmount %d",this._channel.bufferedAmount);const t=this._cb;this._cb=null,t(null)}_onChannelOpen(){this._connected||this.destroyed||(this._debug("on channel open"),this._channelReady=!0,this._maybeReady())}_onChannelClose(){this.destroyed||(this._debug("on channel close"),this.destroy())}_onTrack(t){this.destroyed||t.streams.forEach(i=>{this._debug("on track"),this.emit("track",t.track,i),this._remoteTracks.push({track:t.track,stream:i}),!this._remoteStreams.some(n=>n.id===i.id)&&(this._remoteStreams.push(i),Pa(()=>{this._debug("on stream"),this.emit("stream",i)}))})}_debug(){const t=[].slice.call(arguments);t[0]="["+this._id+"] "+t[0],tf.apply(null,t)}};Jr.WEBRTC_SUPPORT=!!Lc();Jr.config={iceServers:[{urls:["stun:stun.l.google.com:19302","stun:global.stun.twilio.com:3478"]}],sdpSemantics:"unified-plan"};Jr.channelConfig={};var Ic=Jr,Os={};(function(e){e.DEFAULT_ANNOUNCE_PEERS=50,e.MAX_ANNOUNCE_PEERS=82,e.binaryToHex=i=>(typeof i!="string"&&(i=String(i)),Buffer.from(i,"binary").toString("hex")),e.hexToBinary=i=>(typeof i!="string"&&(i=String(i)),Buffer.from(i,"hex").toString("binary")),e.parseUrl=i=>{const n=new URL(i.replace(/^udp:/,"http:"));return i.match(/^udp:/)&&Object.defineProperties(n,{href:{value:n.href.replace(/^http/,"udp")},protocol:{value:n.protocol.replace(/^http/,"udp")},origin:{value:n.origin.replace(/^http/,"udp")}}),n},Object.assign(e,Ei)})(Os);var Rc={exports:{}};(function(e){var t=function(){function i(f,v){return v!=null&&f instanceof v}var n;try{n=Map}catch{n=function(){}}var r;try{r=Set}catch{r=function(){}}var a;try{a=Promise}catch{a=function(){}}function o(f,v,y,w,k){typeof v=="object"&&(y=v.depth,w=v.prototype,k=v.includeNonEnumerable,v=v.circular);var m=[],b=[],E=typeof Buffer<"u";typeof v>"u"&&(v=!0),typeof y>"u"&&(y=1/0);function C(_,T){if(_===null)return null;if(T===0)return _;var I,L;if(typeof _!="object")return _;if(i(_,n))I=new n;else if(i(_,r))I=new r;else if(i(_,a))I=new a(function(ee,re){_.then(function(H){ee(C(H,T-1))},function(H){re(C(H,T-1))})});else if(o.__isArray(_))I=[];else if(o.__isRegExp(_))I=new RegExp(_.source,h(_)),_.lastIndex&&(I.lastIndex=_.lastIndex);else if(o.__isDate(_))I=new Date(_.getTime());else{if(E&&Buffer.isBuffer(_))return Buffer.allocUnsafe?I=Buffer.allocUnsafe(_.length):I=new Buffer(_.length),_.copy(I),I;i(_,Error)?I=Object.create(_):typeof w>"u"?(L=Object.getPrototypeOf(_),I=Object.create(L)):(I=Object.create(w),L=w)}if(v){var N=m.indexOf(_);if(N!=-1)return b[N];m.push(_),b.push(I)}i(_,n)&&_.forEach(function(ee,re){var H=C(re,T-1),se=C(ee,T-1);I.set(H,se)}),i(_,r)&&_.forEach(function(ee){var re=C(ee,T-1);I.add(re)});for(var O in _){var K;L&&(K=Object.getOwnPropertyDescriptor(L,O)),!(K&&K.set==null)&&(I[O]=C(_[O],T-1))}if(Object.getOwnPropertySymbols)for(var F=Object.getOwnPropertySymbols(_),O=0;O<F.length;O++){var z=F[O],P=Object.getOwnPropertyDescriptor(_,z);P&&!P.enumerable&&!k||(I[z]=C(_[z],T-1),P.enumerable||Object.defineProperty(I,z,{enumerable:!1}))}if(k)for(var Y=Object.getOwnPropertyNames(_),O=0;O<Y.length;O++){var ne=Y[O],P=Object.getOwnPropertyDescriptor(_,ne);P&&P.enumerable||(I[ne]=C(_[ne],T-1),Object.defineProperty(I,ne,{enumerable:!1}))}return I}return C(f,y)}o.clonePrototype=function(v){if(v===null)return null;var y=function(){};return y.prototype=v,new y};function s(f){return Object.prototype.toString.call(f)}o.__objToStr=s;function l(f){return typeof f=="object"&&s(f)==="[object Date]"}o.__isDate=l;function d(f){return typeof f=="object"&&s(f)==="[object Array]"}o.__isArray=d;function p(f){return typeof f=="object"&&s(f)==="[object RegExp]"}o.__isRegExp=p;function h(f){var v="";return f.global&&(v+="g"),f.ignoreCase&&(v+="i"),f.multiline&&(v+="m"),v}return o.__getRegExpFlags=h,o}();e.exports&&(e.exports=t)})(Rc);var of=Rc.exports;const lf=Ur("simple-websocket"),cf=Ds,df=Cc,sl=Wr,yn=Ei,hn=typeof yn!="function"?WebSocket:yn,ol=64*1024;let $c=class extends df.Duplex{constructor(t={}){if(typeof t=="string"&&(t={url:t}),t=Object.assign({allowHalfOpen:!1},t),super(t),t.url==null&&t.socket==null)throw new Error("Missing required `url` or `socket` option");if(t.url!=null&&t.socket!=null)throw new Error("Must specify either `url` or `socket` option, not both");if(this._id=cf(4).toString("hex").slice(0,7),this._debug("new websocket: %o",t),this.connected=!1,this.destroyed=!1,this._chunk=null,this._cb=null,this._interval=null,t.socket)this.url=t.socket.url,this._ws=t.socket,this.connected=t.socket.readyState===hn.OPEN;else{this.url=t.url;try{typeof yn=="function"?this._ws=new hn(t.url,null,{...t,encoding:void 0}):this._ws=new hn(t.url)}catch(i){sl(()=>this.destroy(i));return}}this._ws.binaryType="arraybuffer",t.socket&&this.connected?sl(()=>this._handleOpen()):this._ws.onopen=()=>this._handleOpen(),this._ws.onmessage=i=>this._handleMessage(i),this._ws.onclose=()=>this._handleClose(),this._ws.onerror=i=>this._handleError(i),this._handleFinishBound=()=>this._handleFinish(),this.once("finish",this._handleFinishBound)}send(t){this._ws.send(t)}destroy(t){this._destroy(t,()=>{})}_destroy(t,i){if(!this.destroyed){if(this._debug("destroy (error: %s)",t&&(t.message||t)),this.readable=this.writable=!1,this._readableState.ended||this.push(null),this._writableState.finished||this.end(),this.connected=!1,this.destroyed=!0,clearInterval(this._interval),this._interval=null,this._chunk=null,this._cb=null,this._handleFinishBound&&this.removeListener("finish",this._handleFinishBound),this._handleFinishBound=null,this._ws){const n=this._ws,r=()=>{n.onclose=null};if(n.readyState===hn.CLOSED)r();else try{n.onclose=r,n.close()}catch{r()}n.onopen=null,n.onmessage=null,n.onerror=()=>{}}this._ws=null,t&&this.emit("error",t),this.emit("close"),i()}}_read(){}_write(t,i,n){if(this.destroyed)return n(new Error("cannot write after socket is destroyed"));if(this.connected){try{this.send(t)}catch(r){return this.destroy(r)}typeof yn!="function"&&this._ws.bufferedAmount>ol?(this._debug("start backpressure: bufferedAmount %d",this._ws.bufferedAmount),this._cb=n):n(null)}else this._debug("write before connect"),this._chunk=t,this._cb=n}_handleOpen(){if(!(this.connected||this.destroyed)){if(this.connected=!0,this._chunk){try{this.send(this._chunk)}catch(i){return this.destroy(i)}this._chunk=null,this._debug('sent chunk from "write before connect"');const t=this._cb;this._cb=null,t(null)}typeof yn!="function"&&(this._interval=setInterval(()=>this._onInterval(),150),this._interval.unref&&this._interval.unref()),this._debug("connect"),this.emit("connect")}}_handleMessage(t){if(this.destroyed)return;let i=t.data;i instanceof ArrayBuffer&&(i=Buffer.from(i)),this.push(i)}_handleClose(){this.destroyed||(this._debug("on close"),this.destroy())}_handleError(t){this.destroy(new Error(`Error connecting to ${this.url}`))}_handleFinish(){if(this.destroyed)return;const t=()=>{setTimeout(()=>this.destroy(),1e3)};this.connected?t():this.once("connect",t)}_onInterval(){if(!this._cb||!this._ws||this._ws.bufferedAmount>ol)return;this._debug("ending backpressure: bufferedAmount %d",this._ws.bufferedAmount);const t=this._cb;this._cb=null,t(null)}_debug(){const t=[].slice.call(arguments);t[0]="["+this._id+"] "+t[0],lf.apply(null,t)}};$c.WEBSOCKET_SUPPORT=!!hn;var uf=$c;const pf=Kr;let ff=class extends pf{constructor(t,i){super(),this.client=t,this.announceUrl=i,this.interval=null,this.destroyed=!1}setInterval(t){t==null&&(t=this.DEFAULT_ANNOUNCE_INTERVAL),clearInterval(this.interval),t&&(this.interval=setInterval(()=>{this.announce(this.client._defaultAnnounceOpts())},t),this.interval.unref&&this.interval.unref())}};var hf=ff;const mf=of,wt=Ur("bittorrent-tracker:websocket-tracker"),gf=Ic,yf=Ds,vf=uf,bf=Ei,Yt=Os,wf=hf,Bt={},kf=10*1e3,_f=60*60*1e3,Sf=5*60*1e3,xf=50*1e3;let Ns=class extends wf{constructor(t,i){super(t,i),wt("new websocket tracker %s",i),this.peers={},this.socket=null,this.reconnecting=!1,this.retries=0,this.reconnectTimer=null,this.expectingResponse=!1,this._openSocket()}announce(t){if(this.destroyed||this.reconnecting)return;if(!this.socket.connected){this.socket.once("connect",()=>{this.announce(t)});return}const i=Object.assign({},t,{action:"announce",info_hash:this.client._infoHashBinary,peer_id:this.client._peerIdBinary});if(this._trackerId&&(i.trackerid=this._trackerId),t.event==="stopped"||t.event==="completed")this._send(i);else{const n=Math.min(t.numwant,5);this._generateOffers(n,r=>{i.numwant=n,i.offers=r,this._send(i)})}}scrape(t){if(this.destroyed||this.reconnecting)return;if(!this.socket.connected){this.socket.once("connect",()=>{this.scrape(t)});return}const n={action:"scrape",info_hash:Array.isArray(t.infoHash)&&t.infoHash.length>0?t.infoHash.map(r=>r.toString("binary")):t.infoHash&&t.infoHash.toString("binary")||this.client._infoHashBinary};this._send(n)}destroy(t=ll){if(this.destroyed)return t(null);this.destroyed=!0,clearInterval(this.interval),clearTimeout(this.reconnectTimer);for(const a in this.peers){const o=this.peers[a];clearTimeout(o.trackerTimeout),o.destroy()}if(this.peers=null,this.socket&&(this.socket.removeListener("connect",this._onSocketConnectBound),this.socket.removeListener("data",this._onSocketDataBound),this.socket.removeListener("close",this._onSocketCloseBound),this.socket.removeListener("error",this._onSocketErrorBound),this.socket=null),this._onSocketConnectBound=null,this._onSocketErrorBound=null,this._onSocketDataBound=null,this._onSocketCloseBound=null,Bt[this.announceUrl]&&(Bt[this.announceUrl].consumers-=1),Bt[this.announceUrl].consumers>0)return t();let i=Bt[this.announceUrl];delete Bt[this.announceUrl],i.on("error",ll),i.once("close",t);let n;if(!this.expectingResponse)return r();n=setTimeout(r,Yt.DESTROY_TIMEOUT),i.once("data",r);function r(){n&&(clearTimeout(n),n=null),i.removeListener("data",r),i.destroy(),i=null}}_openSocket(){if(this.destroyed=!1,this.peers||(this.peers={}),this._onSocketConnectBound=()=>{this._onSocketConnect()},this._onSocketErrorBound=t=>{this._onSocketError(t)},this._onSocketDataBound=t=>{this._onSocketData(t)},this._onSocketCloseBound=()=>{this._onSocketClose()},this.socket=Bt[this.announceUrl],this.socket)Bt[this.announceUrl].consumers+=1,this.socket.connected&&this._onSocketConnectBound();else{const t=new URL(this.announceUrl);let i;this.client._proxyOpts&&(i=t.protocol==="wss:"?this.client._proxyOpts.httpsAgent:this.client._proxyOpts.httpAgent,!i&&this.client._proxyOpts.socksProxy&&(i=new bf.Agent(mf(this.client._proxyOpts.socksProxy),t.protocol==="wss:"))),this.socket=Bt[this.announceUrl]=new vf({url:this.announceUrl,agent:i}),this.socket.consumers=1,this.socket.once("connect",this._onSocketConnectBound)}this.socket.on("data",this._onSocketDataBound),this.socket.once("close",this._onSocketCloseBound),this.socket.once("error",this._onSocketErrorBound)}_onSocketConnect(){this.destroyed||this.reconnecting&&(this.reconnecting=!1,this.retries=0,this.announce(this.client._defaultAnnounceOpts()))}_onSocketData(t){if(!this.destroyed){this.expectingResponse=!1;try{t=JSON.parse(t)}catch{this.client.emit("warning",new Error("Invalid tracker response"));return}t.action==="announce"?this._onAnnounceResponse(t):t.action==="scrape"?this._onScrapeResponse(t):this._onSocketError(new Error(`invalid action in WS response: ${t.action}`))}}_onAnnounceResponse(t){if(t.info_hash!==this.client._infoHashBinary){wt("ignoring websocket data from %s for %s (looking for %s: reused socket)",this.announceUrl,Yt.binaryToHex(t.info_hash),this.client.infoHash);return}if(t.peer_id&&t.peer_id===this.client._peerIdBinary)return;wt("received %s from %s for %s",JSON.stringify(t),this.announceUrl,this.client.infoHash);const i=t["failure reason"];if(i)return this.client.emit("warning",new Error(i));const n=t["warning message"];n&&this.client.emit("warning",new Error(n));const r=t.interval||t["min interval"];r&&this.setInterval(r*1e3);const a=t["tracker id"];if(a&&(this._trackerId=a),t.complete!=null){const s=Object.assign({},t,{announce:this.announceUrl,infoHash:Yt.binaryToHex(t.info_hash)});this.client.emit("update",s)}let o;if(t.offer&&t.peer_id&&(wt("creating peer (from remote offer)"),o=this._createPeer(),o.id=Yt.binaryToHex(t.peer_id),o.once("signal",s=>{const l={action:"announce",info_hash:this.client._infoHashBinary,peer_id:this.client._peerIdBinary,to_peer_id:t.peer_id,answer:s,offer_id:t.offer_id};this._trackerId&&(l.trackerid=this._trackerId),this._send(l)}),this.client.emit("peer",o),o.signal(t.offer)),t.answer&&t.peer_id){const s=Yt.binaryToHex(t.offer_id);o=this.peers[s],o?(o.id=Yt.binaryToHex(t.peer_id),this.client.emit("peer",o),o.signal(t.answer),clearTimeout(o.trackerTimeout),o.trackerTimeout=null,delete this.peers[s]):wt(`got unexpected answer: ${JSON.stringify(t.answer)}`)}}_onScrapeResponse(t){t=t.files||{};const i=Object.keys(t);if(i.length===0){this.client.emit("warning",new Error("invalid scrape response"));return}i.forEach(n=>{const r=Object.assign(t[n],{announce:this.announceUrl,infoHash:Yt.binaryToHex(n)});this.client.emit("scrape",r)})}_onSocketClose(){this.destroyed||(this.destroy(),this._startReconnectTimer())}_onSocketError(t){this.destroyed||(this.destroy(),this.client.emit("warning",t),this._startReconnectTimer())}_startReconnectTimer(){const t=Math.floor(Math.random()*Sf)+Math.min(Math.pow(2,this.retries)*kf,_f);this.reconnecting=!0,clearTimeout(this.reconnectTimer),this.reconnectTimer=setTimeout(()=>{this.retries++,this._openSocket()},t),this.reconnectTimer.unref&&this.reconnectTimer.unref(),wt("reconnecting socket in %s ms",t)}_send(t){if(this.destroyed)return;this.expectingResponse=!0;const i=JSON.stringify(t);wt("send %s",i),this.socket.send(i)}_generateOffers(t,i){const n=this,r=[];wt("generating %s offers",t);for(let s=0;s<t;++s)a();o();function a(){const s=yf(20).toString("hex");wt("creating peer (from _generateOffers)");const l=n.peers[s]=n._createPeer({initiator:!0});l.once("signal",d=>{r.push({offer:d,offer_id:Yt.hexToBinary(s)}),o()}),l.trackerTimeout=setTimeout(()=>{wt("tracker timeout: destroying peer"),l.trackerTimeout=null,delete n.peers[s],l.destroy()},xf),l.trackerTimeout.unref&&l.trackerTimeout.unref()}function o(){r.length===t&&(wt("generated %s offers",t),i(r))}}_createPeer(t){const i=this;t=Object.assign({trickle:!1,config:i.client._rtcConfig,wrtc:i.client._wrtc},t);const n=new gf(t);return n.once("error",r),n.once("connect",a),n;function r(o){i.client.emit("warning",new Error(`Connection error: ${o.message}`)),n.destroy()}function a(){n.removeListener("error",r),n.removeListener("connect",a)}}};Ns.prototype.DEFAULT_ANNOUNCE_INTERVAL=30*1e3;Ns._socketPool=Bt;function ll(){}var Ef=Ns;const Vt=Ur("bittorrent-tracker:client"),Tf=Kr,Af=ep,Cf=tp,Lf=Ic,If=Wr,cl=Os,dl=Ei,ul=Ei,Rf=Ef;class ls extends Tf{constructor(t={}){if(super(),!t.peerId)throw new Error("Option `peerId` is required");if(!t.infoHash)throw new Error("Option `infoHash` is required");if(!t.announce)throw new Error("Option `announce` is required");if(!process.browser&&!t.port)throw new Error("Option `port` is required");this.peerId=typeof t.peerId=="string"?t.peerId:t.peerId.toString("hex"),this._peerIdBuffer=Buffer.from(this.peerId,"hex"),this._peerIdBinary=this._peerIdBuffer.toString("binary"),this.infoHash=typeof t.infoHash=="string"?t.infoHash.toLowerCase():t.infoHash.toString("hex"),this._infoHashBuffer=Buffer.from(this.infoHash,"hex"),this._infoHashBinary=this._infoHashBuffer.toString("binary"),Vt("new client %s",this.infoHash),this.destroyed=!1,this._port=t.port,this._getAnnounceOpts=t.getAnnounceOpts,this._rtcConfig=t.rtcConfig,this._userAgent=t.userAgent,this._proxyOpts=t.proxyOpts,this._wrtc=typeof t.wrtc=="function"?t.wrtc():t.wrtc;let i=typeof t.announce=="string"?[t.announce]:t.announce==null?[]:t.announce;i=i.map(a=>(a=a.toString(),a[a.length-1]==="/"&&(a=a.substring(0,a.length-1)),a)),i=Array.from(new Set(i));const n=this._wrtc!==!1&&(!!this._wrtc||Lf.WEBRTC_SUPPORT),r=a=>{If(()=>{this.emit("warning",a)})};this._trackers=i.map(a=>{let o;try{o=cl.parseUrl(a)}catch{return r(new Error(`Invalid tracker URL: ${a}`)),null}const s=o.port;if(s<0||s>65535)return r(new Error(`Invalid tracker port: ${a}`)),null;const l=o.protocol;return(l==="http:"||l==="https:")&&typeof dl=="function"?new dl(this,a):l==="udp:"&&typeof ul=="function"?new ul(this,a):(l==="ws:"||l==="wss:")&&n?l==="ws:"&&typeof window<"u"&&window.location.protocol==="https:"?(r(new Error(`Unsupported tracker protocol: ${a}`)),null):new Rf(this,a):(r(new Error(`Unsupported tracker protocol: ${a}`)),null)}).filter(Boolean)}start(t){t=this._defaultAnnounceOpts(t),t.event="started",Vt("send `start` %o",t),this._announce(t),this._trackers.forEach(i=>{i.setInterval()})}stop(t){t=this._defaultAnnounceOpts(t),t.event="stopped",Vt("send `stop` %o",t),this._announce(t)}complete(t){t||(t={}),t=this._defaultAnnounceOpts(t),t.event="completed",Vt("send `complete` %o",t),this._announce(t)}update(t){t=this._defaultAnnounceOpts(t),t.event&&delete t.event,Vt("send `update` %o",t),this._announce(t)}_announce(t){this._trackers.forEach(i=>{i.announce(t)})}scrape(t){Vt("send `scrape`"),t||(t={}),this._trackers.forEach(i=>{i.scrape(t)})}setInterval(t){Vt("setInterval %d",t),this._trackers.forEach(i=>{i.setInterval(t)})}destroy(t){if(this.destroyed)return;this.destroyed=!0,Vt("destroy");const i=this._trackers.map(n=>r=>{n.destroy(r)});Cf(i,t),this._trackers=[],this._getAnnounceOpts=null}_defaultAnnounceOpts(t={}){return t.numwant==null&&(t.numwant=cl.DEFAULT_ANNOUNCE_PEERS),t.uploaded==null&&(t.uploaded=0),t.downloaded==null&&(t.downloaded=0),this._getAnnounceOpts&&(t=Object.assign({},t,this._getAnnounceOpts())),t}}ls.scrape=(e,t)=>{if(t=Af(t),!e.infoHash)throw new Error("Option `infoHash` is required");if(!e.announce)throw new Error("Option `announce` is required");const i=Object.assign({},e,{infoHash:Array.isArray(e.infoHash)?e.infoHash[0]:e.infoHash,peerId:Buffer.from("01234567890123456789"),port:6881}),n=new ls(i);n.once("error",t),n.once("warning",t);let r=Array.isArray(e.infoHash)?e.infoHash.length:1;const a={};return n.on("scrape",o=>{if(r-=1,a[o.infoHash]=o,r===0){n.destroy();const s=Object.keys(a);s.length===1?t(null,a[s[0]]):t(null,a)}}),e.infoHash=Array.isArray(e.infoHash)?e.infoHash.map(o=>Buffer.from(o,"hex")):Buffer.from(e.infoHash,"hex"),n.scrape({infoHash:e.infoHash}),n};var $f=ls;const Mf=rc($f);var Mc={exports:{}},Oe=Mc.exports={},Ct,Lt;function cs(){throw new Error("setTimeout has not been defined")}function ds(){throw new Error("clearTimeout has not been defined")}(function(){try{typeof setTimeout=="function"?Ct=setTimeout:Ct=cs}catch{Ct=cs}try{typeof clearTimeout=="function"?Lt=clearTimeout:Lt=ds}catch{Lt=ds}})();function Pc(e){if(Ct===setTimeout)return setTimeout(e,0);if((Ct===cs||!Ct)&&setTimeout)return Ct=setTimeout,setTimeout(e,0);try{return Ct(e,0)}catch{try{return Ct.call(null,e,0)}catch{return Ct.call(this,e,0)}}}function Pf(e){if(Lt===clearTimeout)return clearTimeout(e);if((Lt===ds||!Lt)&&clearTimeout)return Lt=clearTimeout,clearTimeout(e);try{return Lt(e)}catch{try{return Lt.call(null,e)}catch{return Lt.call(this,e)}}}var Nt=[],Hi=!1,bi,rr=-1;function Bf(){!Hi||!bi||(Hi=!1,bi.length?Nt=bi.concat(Nt):rr=-1,Nt.length&&Bc())}function Bc(){if(!Hi){var e=Pc(Bf);Hi=!0;for(var t=Nt.length;t;){for(bi=Nt,Nt=[];++rr<t;)bi&&bi[rr].run();rr=-1,t=Nt.length}bi=null,Hi=!1,Pf(e)}}Oe.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var i=1;i<arguments.length;i++)t[i-1]=arguments[i];Nt.push(new Dc(e,t)),Nt.length===1&&!Hi&&Pc(Bc)};function Dc(e,t){this.fun=e,this.array=t}Dc.prototype.run=function(){this.fun.apply(null,this.array)};Oe.title="browser";Oe.browser=!0;Oe.env={};Oe.argv=[];Oe.version="";Oe.versions={};function jt(){}Oe.on=jt;Oe.addListener=jt;Oe.once=jt;Oe.off=jt;Oe.removeListener=jt;Oe.removeAllListeners=jt;Oe.emit=jt;Oe.prependListener=jt;Oe.prependOnceListener=jt;Oe.listeners=function(e){return[]};Oe.binding=function(e){throw new Error("process.binding is not supported")};Oe.cwd=function(){return"/"};Oe.chdir=function(e){throw new Error("process.chdir is not supported")};Oe.umask=function(){return 0};var Df=Mc.exports;const zf=rc(Df);globalThis.Buffer||(globalThis.Buffer=xi.Buffer);globalThis.process||(globalThis.process=zf);const Of=["wss://tracker.openwebtorrent.com","wss://tracker.btorrent.xyz","wss://tracker.webtorrent.dev","wss://tracker.files.fm:7073/announce","wss://spacetrackr.link:443/announce","wss://tracker.fastcast.nz:443/announce"],Nf=160,zc="cinepulse.decision-room.owner.",Hf="cinepulse.decision-room.autoplay";function Mi(e=12){const t=new Uint8Array(e);return crypto.getRandomValues(t),Array.from(t,i=>i.toString(16).padStart(2,"0")).join("")}function Ke(e=""){const t=String(e).replace(/\D/g,"");return t.length===6?t:""}function On(e,t="",i=null){if(!e?.id)return;const n=e.type==="tv"?"tv":"movie";try{sessionStorage.setItem(Hf,JSON.stringify({id:String(e.id),type:n,roomCode:Ke(t),season:n==="tv"?Math.max(1,Number(e.season)||1):null,episode:n==="tv"?Math.max(1,Number(e.episode)||1):null,initialSync:i||null,createdAt:Date.now()}))}catch{}window.dispatchEvent(new CustomEvent("cinepulse:decision-room-open"));const r=`#detail?type=${n}&id=${e.id}`;window.location.hash===r?window.dispatchEvent(new Event("hashchange")):window.location.hash=r}async function qf(e){const t=new TextEncoder().encode(`cinepulse-decision-room-v1:${e}`),i=await crypto.subtle.digest("SHA-256",t);return Array.from(new Uint8Array(i).slice(0,20),n=>n.toString(16).padStart(2,"0")).join("")}function Ff(){const e=new Uint32Array(1);return crypto.getRandomValues(e),String(1e5+e[0]%9e5)}function Uf(e){const t=Ke(e);if(t)try{sessionStorage.setItem(`${zc}${t}`,"1")}catch{}}function jf(e){const t=Ke(e);if(!t)return!1;try{return sessionStorage.getItem(`${zc}${t}`)==="1"}catch{return!1}}function Kf(){try{return Ke(new URL(window.location.href).searchParams.get("oda")||"")}catch{return""}}function Oc(e){const t=new URL(window.location.href);return t.searchParams.set("oda",Ke(e)),t.toString()}function Wf(){try{const e=new URL(window.location.href);e.searchParams.delete("oda"),history.replaceState(history.state,"",e.toString())}catch{}}function us(){const e=["Sinemasever","Gece Kuşu","Patlamış Mısır","Film Avcısı","Koltuğunda"],t=Mi(2).toUpperCase();return`${e[Math.floor(Math.random()*e.length)]} ${t}`}class Yf{constructor({roomCode:t,nickname:i=us(),isHost:n=!1}){this.roomCode=Ke(t),this.nickname=String(i||us()).slice(0,30),this.isHost=!!n,this.selfId=Mi(10),this.client=null,this.peers=new Map,this.peerParticipantIds=new WeakMap,this.trackerPeerCount=1,this.announceTimer=null,this.participants=new Map([[this.selfId,{id:this.selfId,nickname:this.nickname,role:this.isHost?"moderator":"participant"}]]),this.listeners=new Set,this.receivedIds=new Set,this.cards=[],this.votes={},this.ratings={},this.suggestions=[],this.syncMode="smooth",this.silentVoting=!1,this.sharedPlayback=null,this.lastPlayerSync=null,this.roomFinish=null,this.chatMessages=[],this.roomSummary=null,this.playbackStartedAt=0,this.roomActivity={reactions:[],chats:[]},this.onPlayerSync=r=>{const a=r.detail;!this.isHost||!a||Ke(a.roomCode)!==this.roomCode||!this.sharedPlayback||String(a.mediaId)!==String(this.sharedPlayback.id)||a.type!==this.sharedPlayback.type||(this.lastPlayerSync=a,this.broadcast({type:"player-sync",sync:a}))},window.addEventListener("cinepulse:player-sync",this.onPlayerSync),this.onRoomFinish=r=>{const a=r.detail;!this.isHost||!a||Ke(a.roomCode)!==this.roomCode||(this.roomFinish=a,this.broadcast({type:"room-finish",finish:a}))},this.onRoomFinishVote=r=>{const a=r.detail;!a||Ke(a.roomCode)!==this.roomCode||!a.optionId||this.broadcast({type:"room-finish-vote",vote:a})},this.onRoomFinishChoice=r=>{const a=r.detail;!this.isHost||!a||Ke(a.roomCode)!==this.roomCode||(this.broadcast({type:"room-finish-choice",choice:a}),this.applyRoomFinishChoice(a))},this.onRoomReaction=r=>{const a=r.detail;if(!a||Ke(a.roomCode)!==this.roomCode||!a.emoji)return;const o={...a,senderId:this.selfId,sentAt:Date.now()};this.recordRoomReaction(o),this.broadcast({type:"room-reaction",reaction:o})},window.addEventListener("cinepulse:room-finish",this.onRoomFinish),window.addEventListener("cinepulse:room-finish-vote",this.onRoomFinishVote),window.addEventListener("cinepulse:room-finish-choice",this.onRoomFinishChoice),window.addEventListener("cinepulse:room-reaction",this.onRoomReaction),this.onRoomChatSend=r=>{const a=r.detail,o=String(a?.text||"").trim().slice(0,240);if(!a||Ke(a.roomCode)!==this.roomCode||!o)return;const s={id:String(a.id||`chat-${Date.now()}-${Math.random().toString(36).slice(2,8)}`),text:o,nickname:this.nickname,senderId:this.selfId,sentAt:Number(a.sentAt)||Date.now(),at:Math.max(0,Number(a.at)||0)};this.chatMessages=[...this.chatMessages,s].slice(-60),this.recordRoomChat(s),this.broadcast({type:"room-chat",chat:s})},window.addEventListener("cinepulse:room-chat-send",this.onRoomChatSend),this.onRoomPlaybackHealth=r=>{const a=r.detail;!a||Ke(a.roomCode)!==this.roomCode||a.senderId===this.selfId||this.broadcast({type:"playback-health",health:{senderId:this.selfId,status:a.status==="buffering"?"buffering":"ready",bufferedAhead:Math.max(0,Number(a.bufferedAhead)||0),reportedAt:Date.now()}})},window.addEventListener("cinepulse:room-playback-health",this.onRoomPlaybackHealth),this.onRoomPlaybackProgress=r=>{const a=r.detail;!a||Ke(a.roomCode)!==this.roomCode||this.broadcast({type:"playback-progress",progress:{senderId:this.selfId,nickname:this.nickname,time:Math.max(0,Number(a.time)||0),playing:!!a.playing,buffering:!!a.buffering,reportedAt:Date.now()}})},window.addEventListener("cinepulse:room-playback-progress",this.onRoomPlaybackProgress),this.onRoomPlaybackCheckpoint=r=>{const a=r.detail;!this.isHost||!a||Ke(a.roomCode)!==this.roomCode||!a.targetId||this.broadcast({type:"playback-checkpoint",checkpoint:{targetId:a.targetId,action:a.action==="resume"?"resume":"hold",mediaId:String(a.mediaId||""),type:a.type==="tv"?"tv":"movie"}})},window.addEventListener("cinepulse:room-playback-checkpoint",this.onRoomPlaybackCheckpoint),this.onRoomPlaybackFinished=r=>{const a=r.detail;!a||Ke(a.roomCode)!==this.roomCode||this.broadcast({type:"playback-finished",finished:{mediaId:String(a.mediaId||""),type:a.type==="tv"?"tv":"movie",season:Math.max(1,Number(a.season)||1),episode:Math.max(1,Number(a.episode)||1),nickname:this.nickname}})},window.addEventListener("cinepulse:room-playback-finished",this.onRoomPlaybackFinished),this.onRoomSummary=r=>{const a=r.detail;if(!this.isHost||!a||Ke(a.roomCode)!==this.roomCode)return;const o=new Map;this.roomActivity.reactions.forEach(p=>o.set(p.emoji,(o.get(p.emoji)||0)+1));const s=Array.from(o.entries()).sort((p,h)=>h[1]-p[1])[0]||null,l=new Map;this.roomActivity.chats.forEach(p=>{const h=Math.floor(Math.max(0,Number(p.at)||0)/60)*60;l.set(h,(l.get(h)||0)+1)});const d=Array.from(l.entries()).sort((p,h)=>h[1]-p[1])[0]||null;this.roomSummary={roomCode:this.roomCode,mediaId:String(a.mediaId||this.sharedPlayback?.id||""),type:a.type==="tv"?"tv":"movie",participants:this.participants.size,watchedSeconds:Math.max(0,Number(a.seconds)||0),topReaction:s?{emoji:s[0],count:s[1]}:null,topTalkSecond:d?d[0]:null,chatCount:this.roomActivity.chats.length},this.broadcast({type:"room-summary",summary:this.roomSummary}),window.dispatchEvent(new CustomEvent("cinepulse:room-summary-remote",{detail:this.roomSummary}))},this.onRoomRhythm=r=>{const a=r.detail;!this.isHost||!a||Ke(a.roomCode)!==this.roomCode||!a.targetId||this.broadcast({type:"room-rhythm",rhythm:a})},window.addEventListener("cinepulse:room-summary",this.onRoomSummary),window.addEventListener("cinepulse:room-rhythm",this.onRoomRhythm),this.destroyed=!1}applyRoomFinishChoice(t){if(this.roomFinish=null,t.action==="open"&&t.card?.id){this.sharedPlayback={id:t.card.id,type:t.card.type==="tv"?"tv":"movie",season:Math.max(1,Number(t.card.season)||1),episode:Math.max(1,Number(t.card.episode)||1)},this.lastPlayerSync=null,this.playbackStartedAt=Date.now(),this.roomSummary=null,this.roomActivity={reactions:[],chats:[]},this.emit(),On(t.card,this.roomCode);return}t.action==="close"&&(this.sharedPlayback=null,this.lastPlayerSync=null,window.dispatchEvent(new CustomEvent("cinepulse:decision-room-close-player",{detail:{roomCode:this.roomCode}}))),this.emit()}snapshot(){return{roomCode:this.roomCode,nickname:this.nickname,selfId:this.selfId,isHost:this.isHost,peerCount:this.peers.size,trackerPeerCount:this.trackerPeerCount,participants:Array.from(this.participants.values()),cards:this.cards,votes:this.votes,ratings:this.ratings,suggestions:this.suggestions,syncMode:this.syncMode,silentVoting:this.silentVoting,chatMessages:this.chatMessages,roomSummary:this.roomSummary}}subscribe(t){return this.listeners.add(t),t(this.snapshot()),()=>this.listeners.delete(t)}emit(){const t=this.snapshot();if(this.listeners.forEach(i=>i(t)),this.sharedPlayback){const i={roomCode:this.roomCode,isHost:this.isHost,selfId:this.selfId,participants:t.participants,peerCount:t.peerCount,chatMessages:t.chatMessages,syncMode:t.syncMode,silentVoting:t.silentVoting,roomSummary:t.roomSummary};window.__cinepulseDecisionRoomPresence=i,window.dispatchEvent(new CustomEvent("cinepulse:decision-room-presence",{detail:i}))}}async connect(){if(!this.roomCode)throw new Error("Geçersiz oda kodu.");const t=await qf(this.roomCode);this.destroyed||(this.client=new Mf({infoHash:t,peerId:Mi(20),announce:Of,port:0,rtcConfig:{iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:global.stun.twilio.com:3478"}]}}),this.client.on("peer",i=>this.attachPeer(i)),this.client.on("update",i=>{const n=Number(i?.complete||0)+Number(i?.incomplete||0);this.trackerPeerCount=Math.max(1,n||1),this.emit()}),this.client.on("warning",()=>this.emit()),this.client.on("error",()=>this.emit()),this.client.start({numwant:5,left:1}),this.announceTimer=window.setInterval(()=>{try{this.client?.update({numwant:5,left:1})}catch{}},15e3),this.emit())}attachPeer(t){let i=t.id||Mi(8);const n=()=>{this.destroyed||(i=t.id||i,this.peers.set(i,t),this.sendTo(t,{type:"hello",participant:{id:this.selfId,nickname:this.nickname,role:this.isHost?"moderator":"participant"},wantsState:!0}),this.emit())},r=s=>this.receive(s,t),a=()=>{this.peers.delete(i);const s=this.peerParticipantIds.get(t);s&&(Array.from(this.peers.values()).some(d=>this.peerParticipantIds.get(d)===s)||this.participants.delete(s)),this.emit()},o=()=>a();t.once("connect",n),t.on("data",r),t.once("close",a),t.once("error",o)}sendTo(t,i){try{if(!t||t.destroyed||!t.connected)return;t.send(JSON.stringify({...i,id:Mi(10),senderId:this.selfId}))}catch{}}broadcast(t){const i={...t,id:Mi(10),senderId:this.selfId};this.remember(i.id),this.peers.forEach(n=>{try{!n.destroyed&&n.connected&&n.send(JSON.stringify(i))}catch{}})}remember(t){this.receivedIds.add(t),this.receivedIds.size>Nf&&this.receivedIds.delete(this.receivedIds.values().next().value)}receive(t,i){let n;try{n=JSON.parse(typeof t=="string"?t:new TextDecoder().decode(t))}catch{return}if(!(!n?.id||this.receivedIds.has(n.id)||n.senderId===this.selfId)){if(this.remember(n.id),n.type==="hello"&&n.participant?.id&&(this.participants.set(n.participant.id,n.participant),this.peerParticipantIds.set(i,n.participant.id),n.wantsState&&(this.sendTo(i,{type:"hello",participant:{id:this.selfId,nickname:this.nickname,role:this.isHost?"moderator":"participant"}}),this.isHost&&this.sendTo(i,{type:"state",cards:this.cards,votes:this.votes,ratings:this.ratings,suggestions:this.suggestions,syncMode:this.syncMode,silentVoting:this.silentVoting,participants:Array.from(this.participants.values()),sharedPlayback:this.sharedPlayback,lastPlayerSync:this.lastPlayerSync,roomFinish:this.roomFinish,chatMessages:this.chatMessages})),this.emit()),n.type==="state"&&Array.isArray(n.cards)&&!this.isHost){if(this.cards=n.cards.slice(0,12),this.votes=n.votes||{},this.ratings=n.ratings||{},this.suggestions=Array.isArray(n.suggestions)?n.suggestions.slice(-20):[],this.syncMode=n.syncMode==="strict"?"strict":"smooth",this.silentVoting=n.silentVoting===!0,Array.isArray(n.participants)&&n.participants.forEach(r=>{r?.id&&r?.nickname&&this.participants.set(r.id,r)}),n.sharedPlayback?.id){const r={id:n.sharedPlayback.id,type:n.sharedPlayback.type==="tv"?"tv":"movie",season:Math.max(1,Number(n.sharedPlayback.season)||1),episode:Math.max(1,Number(n.sharedPlayback.episode)||1)},a=!this.sharedPlayback||String(this.sharedPlayback.id)!==String(r.id)||this.sharedPlayback.type!==r.type||Number(this.sharedPlayback.season)!==Number(r.season)||Number(this.sharedPlayback.episode)!==Number(r.episode);this.sharedPlayback=r,this.lastPlayerSync=n.lastPlayerSync||null,this.roomFinish=n.roomFinish||null,this.chatMessages=Array.isArray(n.chatMessages)?n.chatMessages.slice(-60):[],a?On(r,this.roomCode,this.lastPlayerSync):this.lastPlayerSync&&window.dispatchEvent(new CustomEvent("cinepulse:player-sync-remote",{detail:this.lastPlayerSync}))}this.emit()}if(n.type==="cards"&&Array.isArray(n.cards)&&!this.isHost&&(this.cards=n.cards.slice(0,12),this.votes=n.votes||{},this.ratings=n.ratings||{},this.emit()),n.type==="suggestions"&&Array.isArray(n.suggestions)&&!this.isHost&&(this.suggestions=n.suggestions.slice(-20),this.emit()),n.type==="sync-mode"&&!this.isHost&&(this.syncMode=n.syncMode==="strict"?"strict":"smooth",this.emit()),n.type==="silent-voting"&&!this.isHost&&(this.silentVoting=n.enabled===!0,this.emit()),n.type==="suggest-card"&&this.isHost&&n.card?.id){const r=`${n.senderId}:${n.card.type}:${n.card.id}`;if(!this.cards.some(o=>String(o.id)===String(n.card.id)&&o.type===n.card.type)&&!this.suggestions.some(o=>o.id===r)){const o=this.participants.get(n.senderId);this.suggestions=[...this.suggestions,{id:r,card:n.card,nickname:o?.nickname||"Katılımcı"}].slice(-20),this.broadcast({type:"suggestions",suggestions:this.suggestions}),this.emit()}}if(n.type==="playback-health"&&this.isHost&&n.health?.senderId&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-health-remote",{detail:{...n.health,roomCode:this.roomCode,syncMode:this.syncMode}})),n.type==="playback-progress"&&this.isHost&&n.progress?.senderId&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-progress-remote",{detail:{...n.progress,roomCode:this.roomCode}})),n.type==="playback-checkpoint"&&n.checkpoint?.targetId&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-checkpoint-remote",{detail:{...n.checkpoint,roomCode:this.roomCode}})),n.type==="playback-finished"&&n.finished?.mediaId&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-finished-remote",{detail:{...n.finished,roomCode:this.roomCode,senderId:n.senderId}})),n.type==="vote"&&n.cardId&&n.senderId&&(this.votes={...this.votes,[n.cardId]:{...this.votes[n.cardId]||{},[n.senderId]:n.vote==="yes"?"yes":"no"}},this.emit()),n.type==="rating"&&n.cardId&&n.senderId){const r=Math.max(1,Math.min(5,Number(n.rating)||0));if(!r)return;this.ratings={...this.ratings,[n.cardId]:{...this.ratings[n.cardId]||{},[n.senderId]:r}},this.emit()}if(n.type==="open"&&n.card?.id&&(this.sharedPlayback={id:n.card.id,type:n.card.type==="tv"?"tv":"movie",season:Math.max(1,Number(n.card.season)||1),episode:Math.max(1,Number(n.card.episode)||1)},this.emit(),On(n.card,this.roomCode)),n.type==="player-sync"&&n.sync&&!this.isHost){const r=n.sync;if(!this.sharedPlayback||String(r.mediaId)!==String(this.sharedPlayback.id)||r.type!==this.sharedPlayback.type)return;this.lastPlayerSync=r,window.dispatchEvent(new CustomEvent("cinepulse:player-sync-remote",{detail:r}))}if(n.type==="room-finish"&&n.finish&&!this.isHost&&(this.roomFinish=n.finish,window.dispatchEvent(new CustomEvent("cinepulse:room-finish-remote",{detail:n.finish})),this.emit()),n.type==="room-finish-vote"&&n.vote){const r=n.vote;if(this.roomFinish?.id!==r.finishId)return;this.roomFinish={...this.roomFinish,votes:{...this.roomFinish.votes||{},[n.senderId]:r.optionId}},window.dispatchEvent(new CustomEvent("cinepulse:room-finish-vote-remote",{detail:this.roomFinish})),this.emit()}if(n.type==="room-finish-choice"&&n.choice&&!this.isHost&&this.applyRoomFinishChoice(n.choice),n.type==="room-reaction"&&n.reaction&&(this.recordRoomReaction(n.reaction),window.dispatchEvent(new CustomEvent("cinepulse:room-reaction-remote",{detail:n.reaction}))),n.type==="room-chat"&&n.chat?.text){const r={...n.chat,senderId:n.senderId||n.chat.senderId};this.chatMessages=[...this.chatMessages,r].slice(-60),this.recordRoomChat(r),window.dispatchEvent(new CustomEvent("cinepulse:room-chat-remote",{detail:r}))}n.type==="room-summary"&&n.summary&&(this.roomSummary=n.summary,window.dispatchEvent(new CustomEvent("cinepulse:room-summary-remote",{detail:n.summary})),this.emit()),n.type==="room-rhythm"&&n.rhythm?.targetId&&window.dispatchEvent(new CustomEvent("cinepulse:room-rhythm-remote",{detail:{...n.rhythm,roomCode:this.roomCode}}))}}setCards(t){this.isHost&&(this.cards=Array.isArray(t)?t.slice(0,12):[],this.votes={},this.ratings={},this.broadcast({type:"cards",cards:this.cards,votes:this.votes,ratings:this.ratings}),this.emit())}addCard(t){return!this.isHost||!t?.id||this.cards.length>=12||this.cards.some(i=>String(i.id)===String(t.id)&&i.type===t.type)?!1:(this.cards=[...this.cards,t],this.broadcast({type:"cards",cards:this.cards,votes:this.votes,ratings:this.ratings}),this.emit(),!0)}suggest(t){return this.isHost||!t?.id?!1:(this.broadcast({type:"suggest-card",card:t}),!0)}acceptSuggestion(t){if(!this.isHost)return!1;const i=this.suggestions.find(n=>n.id===t);return!i||this.cards.length>=12?!1:(this.suggestions=this.suggestions.filter(n=>n.id!==t),this.cards.some(n=>String(n.id)===String(i.card.id)&&n.type===i.card.type)||(this.cards=[...this.cards,i.card],this.broadcast({type:"cards",cards:this.cards,votes:this.votes,ratings:this.ratings})),this.broadcast({type:"suggestions",suggestions:this.suggestions}),this.emit(),!0)}dismissSuggestion(t){if(!this.isHost)return!1;const i=this.suggestions.filter(n=>n.id!==t);return i.length===this.suggestions.length?!1:(this.suggestions=i,this.broadcast({type:"suggestions",suggestions:this.suggestions}),this.emit(),!0)}setSyncMode(t){this.isHost&&(this.syncMode=t==="strict"?"strict":"smooth",this.broadcast({type:"sync-mode",syncMode:this.syncMode}),this.emit())}setSilentVoting(t){this.isHost&&(this.silentVoting=t===!0,this.broadcast({type:"silent-voting",enabled:this.silentVoting}),this.emit())}removeCard(t){if(!this.isHost||!t)return!1;const i=this.cards.filter(n=>String(n.id)!==String(t));return i.length===this.cards.length?!1:(this.cards=i,delete this.votes[t],delete this.ratings[t],this.broadcast({type:"cards",cards:this.cards,votes:this.votes,ratings:this.ratings}),this.emit(),!0)}vote(t,i){t&&(this.votes={...this.votes,[t]:{...this.votes[t]||{},[this.selfId]:i==="yes"?"yes":"no"}},this.broadcast({type:"vote",cardId:t,vote:i==="yes"?"yes":"no"}),this.emit())}rate(t,i){if(!t)return;const n=Math.max(1,Math.min(5,Number(i)||0));n&&(this.ratings={...this.ratings,[t]:{...this.ratings[t]||{},[this.selfId]:n}},this.broadcast({type:"rating",cardId:t,rating:n}),this.emit())}openForEveryone(t){if(!t?.id)return;this.sharedPlayback={id:t.id,type:t.type==="tv"?"tv":"movie",season:Math.max(1,Number(t.season)||1),episode:Math.max(1,Number(t.episode)||1)},this.playbackStartedAt=Date.now(),this.roomSummary=null,this.roomActivity={reactions:[],chats:[]},this.emit(),this.broadcast({type:"open",card:t});const i=()=>{this.destroyed||!this.sharedPlayback||this.broadcast({type:"state",cards:this.cards,votes:this.votes,ratings:this.ratings,suggestions:this.suggestions,syncMode:this.syncMode,silentVoting:this.silentVoting,participants:Array.from(this.participants.values()),sharedPlayback:this.sharedPlayback,lastPlayerSync:this.lastPlayerSync,roomFinish:this.roomFinish,chatMessages:this.chatMessages})};window.setTimeout(i,350),window.setTimeout(i,1400),On(t,this.roomCode)}recordRoomReaction(t){t?.emoji&&(this.roomActivity.reactions=[...this.roomActivity.reactions,{emoji:String(t.emoji),at:Math.max(0,Number(t.at)||0),senderId:t.senderId||""}].slice(-240))}recordRoomChat(t){t?.text&&(this.roomActivity.chats=[...this.roomActivity.chats,{at:Math.max(0,Number(t.at)||0),senderId:t.senderId||""}].slice(-120))}destroy(){this.destroyed=!0,window.removeEventListener("cinepulse:player-sync",this.onPlayerSync),window.removeEventListener("cinepulse:room-finish",this.onRoomFinish),window.removeEventListener("cinepulse:room-finish-vote",this.onRoomFinishVote),window.removeEventListener("cinepulse:room-finish-choice",this.onRoomFinishChoice),window.removeEventListener("cinepulse:room-reaction",this.onRoomReaction),window.removeEventListener("cinepulse:room-chat-send",this.onRoomChatSend),window.removeEventListener("cinepulse:room-playback-health",this.onRoomPlaybackHealth),window.removeEventListener("cinepulse:room-playback-progress",this.onRoomPlaybackProgress),window.removeEventListener("cinepulse:room-playback-checkpoint",this.onRoomPlaybackCheckpoint),window.removeEventListener("cinepulse:room-playback-finished",this.onRoomPlaybackFinished),window.removeEventListener("cinepulse:room-summary",this.onRoomSummary),window.removeEventListener("cinepulse:room-rhythm",this.onRoomRhythm),this.announceTimer&&window.clearInterval(this.announceTimer),this.announceTimer=null,this.peers.forEach(t=>{try{t.destroy()}catch{}}),this.peers.clear();try{this.client?.stop()}catch{}try{this.client?.destroy()}catch{}this.listeners.clear()}}let Ft=null,it=null,Yi=null,Vi=null;function Nc(){qi(!1);const e=document.createElement("div");e.className="decision-room-backdrop",document.body.appendChild(e),Ft=e,e.innerHTML=`
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
    </section>`,e.querySelector("#btn-close-decision-room").onclick=()=>qi(!1),e.addEventListener("click",i=>{i.target===e&&qi(!1)}),e.querySelector("#btn-create-decision-room").onclick=()=>xr({roomCode:Ff(),isHost:!0});const t=()=>{const i=e.querySelector("#decision-room-code-input"),n=String(i?.value||"").replace(/\D/g,"").slice(0,6);if(n.length!==6){i?.focus(),Q("6 haneli oda kodunu yaz.","warning");return}xr({roomCode:n,isHost:!1})};e.querySelector("#btn-join-decision-room").onclick=t,e.querySelector("#decision-room-code-input").onkeydown=i=>{i.key==="Enter"&&t()},J(e)}function ht(e=""){const t=document.createElement("div");return t.textContent=String(e),t.innerHTML}function Vf(e,t){const n=Object.values(t.votes[e.id]||{}).filter(a=>a==="yes").length,r=Math.max(1,t.participants.length);return{yes:n,needed:r,matched:n>=r}}function Nn(e,t){const i=Object.values(t.ratings?.[e.id]||{}).map(Number).filter(a=>a>=1&&a<=5),n=t.ratings?.[e.id]?.[t.selfId]||0;return{average:i.length?i.reduce((a,o)=>a+o,0)/i.length:0,count:i.length,mine:n}}function Hc(){return`
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
    </section>`}function qc(e,t,i=""){const n=e.querySelector("#decision-room-status"),r=e.querySelector("#decision-room-peers"),a=e.querySelector("#decision-room-member-count"),o=e.querySelector("#decision-room-moderator-panel"),s=e.querySelector("#decision-room-signal-status"),l=e.querySelector("#decision-room-suggestion-panel"),d=e.querySelector("#decision-room-suggestions"),p=e.querySelector("#decision-room-silent-vote-summary"),h=e.querySelector("#decision-room-sync-mode"),f=e.querySelector("#decision-room-silent-voting"),v=e.querySelector("#decision-room-deck"),y=e.querySelector("#decision-room-link");n&&(n.textContent=i||(t.peerCount?"Arkadaşların bağlandı, oylar anlık geliyor.":"Oda eşleştiriliyor. Arkadaşına bağlantıyı gönder."));const w=Math.max(t.participants.length,t.trackerPeerCount||1);if(a&&(a.textContent=`${w} kişi`),o&&(o.hidden=!t.isHost),l&&(l.hidden=t.isHost),s&&t.isHost&&(s.textContent=w>t.participants.length?`${w} kişi tracker tarafından görüldü; doğrudan bağlantı hazırlanıyor.`:`${w} kişi aktif bağlantıda.`),r&&(r.innerHTML=t.isHost?t.participants.map(k=>`<span class="decision-room-person ${k.role==="moderator"?"is-moderator":""}"><i data-lucide="${k.role==="moderator"?"crown":"circle-user-round"}"></i>${ht(k.nickname)}${k.id===t.selfId?" (Sen)":""}</span>`).join(""):""),y&&(y.value=Oc(t.roomCode)),h&&t.isHost){const k=t.syncMode==="strict";h.querySelector('input[value="smooth"]').checked=!k,h.querySelector('input[value="strict"]').checked=k;const m=h.querySelector("#decision-room-sync-help");m&&(m.textContent=k?"Yavaş bağlantı buffer’a düşünce herkes kısa süre bekler; süreler birlikte kalır.":"İlk açılışta en fazla 2 dakika fark için bir kez hizalar. Moderatörün oynat/duraklat ve sarma komutları herkese gider; otomatik durum paketleri buffer’ı bozmaz. Fark 1,5 dakikaya çıkarsa geride veya önde kalan taraf kısa süre bekler, diğeri yaklaşınca devam eder."),h.querySelectorAll('input[name="room-sync-mode"]').forEach(b=>{b.onchange=()=>it?.setSyncMode(b.value)})}if(f&&t.isHost&&(f.checked=t.silentVoting===!0,f.onchange=()=>it?.setSilentVoting(f.checked)),d&&t.isHost&&(d.innerHTML=t.suggestions?.length?`<strong>Katılımcı önerileri</strong>${t.suggestions.map(k=>`<div class="decision-room-suggestion"><span><b>${ht(k.card.title||k.card.name||"İsimsiz içerik")}</b><small>${ht(k.nickname)} önerdi</small></span><button data-accept-suggestion="${ht(k.id)}">Ekle</button><button data-dismiss-suggestion="${ht(k.id)}" aria-label="Reddet">×</button></div>`).join("")}`:"",d.querySelectorAll("[data-accept-suggestion]").forEach(k=>{k.onclick=()=>it?.acceptSuggestion(k.dataset.acceptSuggestion)}),d.querySelectorAll("[data-dismiss-suggestion]").forEach(k=>{k.onclick=()=>it?.dismissSuggestion(k.dataset.dismissSuggestion)})),p&&t.isHost&&t.silentVoting){const k=t.cards.map(m=>({card:m,rating:Nn(m,t)})).filter(m=>m.rating.count>0).sort((m,b)=>b.rating.average-m.rating.average||b.rating.count-m.rating.count).slice(0,3);p.innerHTML=k.length?`<strong><i data-lucide="shield-check"></i> Sessiz oylama özeti</strong>${k.map(({card:m,rating:b},E)=>`<div><b>${E+1}</b><span>${ht(m.title||m.name||"İsimsiz içerik")}</span><em>★ ${b.average.toFixed(1)} · ${b.count} gizli oy</em></div>`).join("")}`:'<strong><i data-lucide="shield-check"></i> Sessiz oylama</strong><small>Katılımcıların yıldızları yalnızca burada ortak sonuç olarak görünür.</small>'}else p&&(p.innerHTML="");if(v){if(!t.cards.length)v.innerHTML='<div class="decision-room-empty"><i data-lucide="sparkles"></i><strong>Adaylar hazırlanıyor</strong><span>Oda sahibi ortak izleme listesi oluşturuyor.</span></div>';else{const k=t.isHost&&t.silentVoting?[...t.cards].sort((m,b)=>Nn(b,t).average-Nn(m,t).average):t.cards;v.innerHTML=k.map(m=>{const b=m.title||m.name||"İsimsiz içerik",E=m.type==="tv"?`Dizi · S${Math.max(1,Number(m.season)||1)} B${Math.max(1,Number(m.episode)||1)}`:"Film",C=Vf(m,t),_=t.votes[m.id]?.[t.selfId],T=Nn(m,t),I=[1,2,3,4,5].map(L=>`<button data-room-rating="${L}" data-card-id="${m.id}" class="${T.mine>=L?"active-star":""}" aria-label="${L} yıldız"><i data-lucide="star"></i></button>`).join("");return`<article class="decision-room-card ${C.matched?"matched":""}">
          <img src="${at(m.poster_path,Je.POSTER_SMALL)}" alt="" loading="lazy" />
          <div class="decision-room-card-body">
            <span>${E} · ★ ${(Number(m.vote_average)||0).toFixed(1)}</span>
            <strong>${ht(b)}</strong>
            <small>${C.matched?"Herkes izlemek istiyor!":`${C.yes}/${C.needed} kişi izlemek istiyor`}</small>
            <div class="decision-room-rating"><span>${t.silentVoting?t.isHost?T.count?`Gizli puan ${T.average.toFixed(1)} · ${T.count} oy`:"Gizli oy bekleniyor":T.mine?"Puanın kaydedildi":"Gizli puan ver":T.count?`Ortak puan ${T.average.toFixed(1)} · ${T.count} oy`:"Puan ver"}</span><div>${I}</div></div>
            <div class="decision-room-votes">
              <button data-room-vote="yes" data-card-id="${m.id}" class="${_==="yes"?"active-yes":""}"><i data-lucide="heart"></i> İzle</button>
              <button data-room-vote="no" data-card-id="${m.id}" class="${_==="no"?"active-no":""}"><i data-lucide="skip-forward"></i> Geç</button>
              ${C.matched?`<button data-room-open="${m.id}" class="decision-room-open"><i data-lucide="play"></i> Birlikte Aç</button>`:""}
              ${t.isHost?`<button data-room-remove="${m.id}" class="decision-room-remove" aria-label="${ht(b)} içeriğini odadan kaldır"><i data-lucide="trash-2"></i> Kaldır</button>`:""}
            </div>
          </div>
        </article>`}).join("")}v.querySelectorAll("[data-room-vote]").forEach(k=>{k.onclick=()=>it?.vote(k.dataset.cardId,k.dataset.roomVote)}),v.querySelectorAll("[data-room-rating]").forEach(k=>{k.onclick=()=>it?.rate(k.dataset.cardId,k.dataset.roomRating)}),v.querySelectorAll("[data-room-open]").forEach(k=>{k.onclick=()=>{const m=t.cards.find(b=>String(b.id)===k.dataset.roomOpen);m&&it?.openForEveryone(m)}}),v.querySelectorAll("[data-room-remove]").forEach(k=>{k.onclick=()=>{it?.removeCard(k.dataset.roomRemove)&&Q("İçerik odadan kaldırıldı.","success")}})}J(e)}function Sr(e){return{id:e.id,type:e.type||e.media_type||(e.first_air_date?"tv":"movie"),title:e.title,name:e.name,poster_path:e.poster_path,vote_average:e.vote_average,season:e.type==="tv"||e.media_type==="tv"?Math.max(1,Number(e.season)||1):null,episode:e.type==="tv"||e.media_type==="tv"?Math.max(1,Number(e.episode)||1):null}}function Fc(e,t){const i=e.querySelector("#decision-room-content-form"),n=e.querySelector("#decision-room-content-search"),r=e.querySelector("#decision-room-content-results");if(!i||!n||!r||!t.isHost)return;let a=null,o=0;const s=async()=>{const l=n.value.trim();if(l.length<2){r.innerHTML="";return}const d=++o;r.innerHTML='<span class="decision-room-search-status">Aranıyor…</span>';const p=await Ls(l).catch(()=>[]);if(d!==o||n.value.trim()!==l)return;const h=p.filter(f=>f?.id&&(f.type==="movie"||f.type==="tv")).slice(0,5);r.innerHTML=h.length?h.map(f=>{const v=Sr(f),y=v.type==="tv"?'<span class="decision-room-episode-choice" aria-label="Bölüm seçimi"><label>Sezon <input data-add-season type="number" min="1" value="1" inputmode="numeric" /></label><label>Bölüm <input data-add-episode type="number" min="1" value="1" inputmode="numeric" /></label></span>':"";return`<div class="decision-room-search-result"><button type="button" data-add-room-card="${v.id}" data-add-room-type="${v.type}" title="Odaya ekle"><img src="${at(v.poster_path,Je.POSTER_SMALL)}" alt="" /><span><strong>${ht(v.title||v.name||"İsimsiz içerik")}</strong><small>${v.type==="tv"?"Dizi":"Film"} · ★ ${(Number(v.vote_average)||0).toFixed(1)}</small></span><i data-lucide="plus"></i></button>${y}</div>`}).join(""):'<span class="decision-room-search-status">Sonuç bulunamadı.</span>',r.querySelectorAll("[data-add-room-card]").forEach(f=>{f.onclick=()=>{const v=h.find(m=>String(m.id)===f.dataset.addRoomCard&&(m.type||m.media_type)===f.dataset.addRoomType);if(!v)return;const y=f.closest(".decision-room-search-result"),w=Number(y?.querySelector("[data-add-season]")?.value)||1,k=Number(y?.querySelector("[data-add-episode]")?.value)||1;t.addCard(Sr({...v,season:w,episode:k}))?(n.value="",r.innerHTML="",Q("İçerik odaya eklendi.","success")):Q("Bu içerik zaten listede veya oda dolu.","warning")}}),J(r)};i.onsubmit=l=>{l.preventDefault(),window.clearTimeout(a),s()},n.oninput=()=>{if(window.clearTimeout(a),n.value.trim().length<2){o+=1,r.innerHTML="";return}a=window.setTimeout(s,220)}}function Uc(e,t){const i=e.querySelector("#decision-room-suggestion-form"),n=e.querySelector("#decision-room-suggestion-search"),r=e.querySelector("#decision-room-suggestion-results");if(!i||!n||!r||t.isHost)return;let a=null,o=0;const s=async()=>{const l=n.value.trim();if(l.length<2)return;const d=++o;r.innerHTML='<span class="decision-room-search-status">Aranıyor…</span>';const p=await Ls(l).catch(()=>[]);if(d!==o||n.value.trim()!==l)return;const h=p.filter(f=>f?.id&&(f.type==="movie"||f.type==="tv")).slice(0,5);r.innerHTML=h.map(f=>`<div class="decision-room-search-result"><button type="button" data-suggest-card="${f.id}" data-suggest-type="${f.type||f.media_type}"><img src="${at(f.poster_path,Je.POSTER_SMALL)}" alt="" /><span><strong>${ht(f.title||f.name||"İsimsiz içerik")}</strong><small>${(f.type||f.media_type)==="tv"?"Dizi":"Film"} · Moderatöre öner</small></span><i data-lucide="send"></i></button></div>`).join("")||'<span class="decision-room-search-status">Sonuç bulunamadı.</span>',r.querySelectorAll("[data-suggest-card]").forEach(f=>{f.onclick=()=>{const v=h.find(y=>String(y.id)===f.dataset.suggestCard&&String(y.type||y.media_type)===f.dataset.suggestType);!v||!t.suggest(Sr(v))||(n.value="",r.innerHTML="",Q("Önerin moderatöre gönderildi.","success"))}}),J(r)};i.onsubmit=l=>{l.preventDefault(),window.clearTimeout(a),s()},n.oninput=()=>{if(window.clearTimeout(a),n.value.trim().length<2){o+=1,r.innerHTML="";return}a=window.setTimeout(s,220)}}async function jc(e,t){const i=t.querySelector("#decision-room-status");i&&(i.textContent="Ortak adaylar hazırlanıyor…");try{const r=(await Wl("all","week")||[]).filter(a=>a?.id&&(a.media_type==="movie"||a.media_type==="tv"||a.type==="movie"||a.type==="tv")).slice(0,8).map(Sr);if(!r.length)throw new Error("Aday bulunamadı.");e.setCards(r)}catch{i&&(i.textContent="Adaylar şu an yüklenemedi. Biraz sonra yeniden dene.")}}async function xr({roomCode:e=Kf(),isHost:t=!1}={}){if(!e){Nc();return}qi(!1);const i=e;t&&Uf(i);const n=!!(t||jf(i)),r=us(),a=document.createElement("div");if(a.id="decision-room-modal-root",a.className="decision-room-backdrop",document.body.appendChild(a),Ft=a,n)try{history.replaceState(history.state,"",Oc(i))}catch{}a.innerHTML=`
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
      ${Hc()}
      <div id="decision-room-deck" class="decision-room-deck"></div>
      <footer class="decision-room-footer"><span>Oda kapanınca oylar silinir.</span><button id="btn-refresh-decision-cards"><i data-lucide="refresh-cw"></i> Yeni adaylar</button></footer>
    </section>`;const o=()=>qi(!0);a.querySelector("#btn-close-decision-room").addEventListener("click",o),a.addEventListener("click",d=>{d.target===a&&o()});const s=()=>Kc();window.addEventListener("cinepulse:decision-room-open",s,{once:!0}),Vi=()=>window.removeEventListener("cinepulse:decision-room-open",s);const l=new Yf({roomCode:i,nickname:r,isHost:n});it=l,Yi=l.subscribe(d=>qc(a,d)),await l.connect(),!(it!==l||Ft!==a)&&(Fc(a,l),Uc(a,l),a.querySelector("#btn-copy-decision-room").onclick=async()=>{try{await navigator.clipboard.writeText(i),Q("Oda kodu kopyalandı.","success")}catch{const p=a.querySelector("#decision-room-code"),h=document.createRange();h.selectNodeContents(p),window.getSelection()?.removeAllRanges(),window.getSelection()?.addRange(h),document.execCommand("copy"),window.getSelection()?.removeAllRanges(),Q("Oda kodu kopyalandı.","success")}},a.querySelector("#btn-refresh-decision-cards").onclick=()=>jc(it,a),J(a))}function qi(e=!0){Vi?.(),Vi=null,Yi?.(),Yi=null,it?.destroy(),it=null,Ft?.remove(),Ft=null,e&&Wf()}function Ym(){if(Ft)return;if(!it){Nc();return}const e=it,t=document.createElement("div");t.id="decision-room-modal-root",t.className="decision-room-backdrop",document.body.appendChild(t),Ft=t,t.innerHTML=`
    <section class="decision-room-dialog" role="dialog" aria-modal="true" aria-label="Ortak Karar Odası">
      <button id="btn-close-decision-room" class="decision-room-close" aria-label="Kapat"><i data-lucide="x"></i></button>
      <header class="decision-room-header"><div class="decision-room-icon"><i data-lucide="users-round"></i></div><div><h2>Birlikte Seç</h2><p>Odan hâlâ açık. Adayları ve katılımcıları buradan gör.</p></div></header>
      <div class="decision-room-code-panel"><span>ODA KODU</span><strong id="decision-room-code">${ht(e.roomCode)}</strong><button id="btn-copy-decision-room"><i data-lucide="copy"></i> Kodu Kopyala</button><small>Arkadaşın “Birlikte Seç” ekranında bu kodu yazsın.</small></div>
      <div class="decision-room-live"><span class="decision-room-live-dot"></span><span id="decision-room-status">Odaya dönüldü.</span><strong id="decision-room-member-count" class="decision-room-member-count">1 kişi</strong></div>
      ${Hc()}
      <div id="decision-room-deck" class="decision-room-deck"></div>
      <footer class="decision-room-footer"><span>Oda kapanınca oylar silinir.</span><button id="btn-refresh-decision-cards"><i data-lucide="refresh-cw"></i> Yeni adaylar</button></footer>
    </section>`;const i=()=>qi(!0);t.querySelector("#btn-close-decision-room").onclick=i,t.addEventListener("click",r=>{r.target===t&&i()});const n=()=>Kc();window.addEventListener("cinepulse:decision-room-open",n,{once:!0}),Vi=()=>window.removeEventListener("cinepulse:decision-room-open",n),Yi=e.subscribe(r=>qc(t,r)),Fc(t,e),Uc(t,e),t.querySelector("#btn-copy-decision-room").onclick=async()=>{try{await navigator.clipboard.writeText(e.roomCode),Q("Oda kodu kopyalandı.","success")}catch{Q(`Oda kodu: ${e.roomCode}`,"info")}},t.querySelector("#btn-refresh-decision-cards").onclick=()=>jc(e,t),J(t)}function Kc(){Vi?.(),Vi=null,Yi?.(),Yi=null,Ft?.remove(),Ft=null}function Gf(e="home"){const t=Cn(),i=nc(),n=t.isKid;return`
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
                      <a href="https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk" download="cinepulse.apk" target="_blank" rel="noopener noreferrer" id="btn-hub-apk" class="hub-mega-item hub-tool-btn" aria-label="CinePulse Android APK İndir">
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

      ${`<a href="#downloads" class="dynamic-dock-item ${e==="downloads"?"active":""}" id="dock-item-downloads">
        <div class="dock-icon-rel">
          <i data-lucide="arrow-down-circle"></i>
          <span class="dock-download-badge" id="dock-downloads-badge" style="display:none;"></span>
        </div>
        <span>İndirilenler</span>
      </a>`}

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
  `}let an=null,Hn=null,pl=!1;function fl(e){const t=document.getElementById("main-navbar");an&&window.removeEventListener("scroll",an),an=()=>t?.classList.toggle("scrolled",window.scrollY>20),an(),window.addEventListener("scroll",an,{passive:!0});const i=document.getElementById("mobile-search-row");document.getElementById("btn-mobile-search-toggle")?.addEventListener("click",()=>{i?.classList.toggle("hidden"),i?.classList.contains("hidden")||(document.getElementById("mobile-search-input")?.focus(),J())}),document.getElementById("btn-mobile-search-close")?.addEventListener("click",()=>{i?.classList.add("hidden")}),document.getElementById("btn-nav-notifications")?.addEventListener("click",Uu),document.getElementById("btn-nav-profile")?.addEventListener("click",Fu);const n=document.getElementById("nav-hub-li"),r=document.getElementById("btn-desktop-hub"),a=document.getElementById("hub-mega-dropdown");let o;function s(){clearTimeout(o),r?.setAttribute("aria-expanded","true"),a?.classList.add("open")}function l(){clearTimeout(o),r?.setAttribute("aria-expanded","false"),a?.classList.remove("open")}function d(){clearTimeout(o),o=setTimeout(()=>{!n?.matches(":hover")&&!a?.matches(":hover")&&l()},350)}if(n){n.addEventListener("mouseenter",s),n.addEventListener("mouseleave",d),a?.addEventListener("mouseenter",s),a?.addEventListener("mouseleave",d),r?.addEventListener("click",m=>{m.stopPropagation(),s()}),a?.querySelectorAll(".hub-nav-trigger").forEach(m=>{m.addEventListener("click",l)});const w=m=>{m.key==="Escape"&&l()};window.addEventListener("keydown",w);const k=m=>{n.contains(m.target)||l()};document.addEventListener("click",k)}document.getElementById("btn-hub-random-spin")?.addEventListener("click",async()=>{l(),Do()}),document.getElementById("btn-hub-series-recommend")?.addEventListener("click",l),document.getElementById("btn-hub-trakt")?.addEventListener("click",()=>{l(),wr()});const p=document.getElementById("mobile-hub-backdrop"),h=document.getElementById("mobile-hub-sheet");let f;function v(){p&&(clearTimeout(f),h?.classList.remove("sheet-closing"),p.classList.remove("hidden"),document.body.style.overflow="hidden")}function y(){p&&(document.body.style.overflow="",h?.classList.add("sheet-closing"),clearTimeout(f),f=setTimeout(()=>{p.classList.add("hidden"),h?.classList.remove("sheet-closing")},280))}document.getElementById("btn-open-mobile-hub")?.addEventListener("click",w=>{w.preventDefault(),v()},{once:!1}),document.getElementById("btn-close-mobile-hub")?.addEventListener("click",y),p?.addEventListener("click",w=>{w.target===p&&y()}),p?.querySelectorAll(".hub-nav-trigger").forEach(w=>{w.addEventListener("click",y)}),document.getElementById("btn-hub-random-spin-mobile")?.addEventListener("click",async()=>{y(),Do()}),document.getElementById("btn-hub-series-recommend-mobile")?.addEventListener("click",y),document.getElementById("btn-hub-trakt-mobile")?.addEventListener("click",()=>{y(),wr()}),document.querySelectorAll("[data-open-decision-room]").forEach(w=>{w.addEventListener("click",()=>{l(),y(),xr()})}),hl("nav-search-input","search-overlay"),hl("mobile-search-input","mobile-search-overlay"),pl||(pl=!0,document.addEventListener("click",w=>{for(const[k,m]of[["nav-search-input","search-overlay"],["mobile-search-input","mobile-search-overlay"]]){const b=document.getElementById(k),E=document.getElementById(m);E&&!b?.contains(w.target)&&!E.contains(w.target)&&E.classList.add("hidden")}})),Hn&&document.removeEventListener("keydown",Hn),Hn=w=>{(w.metaKey||w.ctrlKey)&&w.key.toLowerCase()==="k"&&(w.preventDefault(),window.innerWidth<=992&&i?(i.classList.remove("hidden"),document.getElementById("mobile-search-input")?.focus()):document.getElementById("nav-search-input")?.focus())},window.addEventListener("keydown",Hn)}function hl(e,t){const i=document.getElementById(e),n=document.getElementById(t);let r=null;!i||!n||(i.addEventListener("input",a=>{const o=a.target.value.trim();if(clearTimeout(r),o.length<2){n.classList.add("hidden"),n.innerHTML="";return}n.innerHTML='<div class="search-no-results" style="display:flex;align-items:center;gap:8px;padding:1rem;color:var(--text-muted);font-size:.85rem;"><span class="tv-loading-spinner" style="width:16px;height:16px;border-width:2px;"></span> Aranıyor...</div>',n.classList.remove("hidden"),r=setTimeout(async()=>{try{let h=function(){n.querySelectorAll(".search-item").forEach(f=>{f.addEventListener("click",()=>{n.classList.add("hidden"),i.value="",document.getElementById("mobile-search-row")?.classList.add("hidden")})})};const s=await Ls(o),l=Array.isArray(s)?s.slice(0,8):s?.results?.slice(0,8)||[],d=`
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
          </a>`;if(!l.length){n.innerHTML=`<div class="search-no-results" style="padding-bottom:.5rem;">TMDB Sonucu Bulunamadı</div>${d}`,n.classList.remove("hidden"),J(n),h();return}const p=l.map(f=>{const v=f.media_type==="tv"||!!f.first_air_date||!f.release_date&&!!f.name,y=f.title||f.name||"İsimsiz",w=(f.release_date||f.first_air_date||"").slice(0,4),k=at(f.poster_path,Je.POSTER_SMALL||Je.POSTER_MEDIUM);return`
            <a href="#detail?type=${v?"tv":"movie"}&id=${f.id}" class="search-item">
              <img src="${k}" alt="${y}" class="search-item-img" onerror="this.src='https://via.placeholder.com/45x68/1e293b/64748b?text=N/A'" />
              <div class="search-item-info">
                <div class="search-item-title">${y}</div>
                <div class="search-item-meta">
                  <span class="search-badge">${v?"Dizi":"Film"}</span>
                  ${w?`<span>${w}</span>`:""}
                  <span class="search-rating">★ ${(f.vote_average||0).toFixed(1)}</span>
                </div>
              </div>
            </a>`}).join("");n.innerHTML=p+d,n.classList.remove("hidden"),J(n),h()}catch{n.innerHTML='<div class="search-no-results">Arama sırasında bir hata oluştu</div>'}},200)}),i.addEventListener("keydown",a=>{a.key==="Escape"&&(n.classList.add("hidden"),i.blur())}))}let sn=null;function Wc({title:e="Fragman",trailerInfo:t,mediaId:i=null,mediaType:n="movie"}){const r=document.getElementById("trailer-modal");if(!r)return;if(!t||!t.embedUrl){alert("Bu yapım için resmi fragman bulunamadı.");return}const a=t.name||"Resmi Tanıtım",o=i?`#detail?type=${encodeURIComponent(n)}&id=${encodeURIComponent(i)}`:null;r.innerHTML=`
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
  `,r.classList.remove("hidden"),document.body.style.overflow="hidden",J();const s=()=>{r.innerHTML="",r.classList.add("hidden"),document.body.style.overflow="",sn&&(window.removeEventListener("keydown",sn),sn=null)},l=r.querySelector("#btn-close-trailer");l&&l.addEventListener("click",s),r.querySelector(".btn-trailer-detail")?.addEventListener("click",s);const d=r.querySelector(".trailer-modal-overlay");d&&d.addEventListener("click",p=>{p.target===d&&s()}),sn=p=>{p.key==="Escape"&&s()},window.addEventListener("keydown",sn)}let lt=0,Er=null,ar=0;const qn=new Map;function Jf(){clearInterval(Er),Er=null,ar++}function Hs(e){const t=e?.backdrop_path||e?.poster_path,i=window.innerWidth<=768?Je.BACKDROP_LARGE:Je.BACKDROP_XLARGE;return at(t,i)}function qs(e,t="auto"){if(!e)return Promise.resolve(null);if(qn.has(e))return qn.get(e);const i=new Promise(n=>{const r=new Image;r.decoding="async",r.fetchPriority=t,r.onload=async()=>{try{await r.decode()}catch{}n(e)},r.onerror=()=>{qn.delete(e),n(null)},r.src=e});return qn.set(e,i),i}function Xf(e=[]){const i=Rt()?e.filter(ni):e;if(!i||i.length===0)return"";lt=0;const n=i.slice(0,10),r=n[0],a=r.id,o=r.first_air_date||r.media_type==="tv"?"tv":"movie",s=r.title||r.name||"Öne Çıkan Yapım",l=r.overview&&r.overview.trim().length>15?r.overview:qe(r,o),d=Hs(r),p=r.vote_average?r.vote_average.toFixed(1):"8.8",h=(r.first_air_date||r.release_date||"").substring(0,4),f=xs(a);let v=document.getElementById("hero-backdrop-preload");return v||(v=document.createElement("link"),v.id="hero-backdrop-preload",v.rel="preload",v.as="image",document.head.appendChild(v)),v.href=d,v.fetchPriority="high",window.innerWidth>768&&qs(d,"high"),`
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
            ${n.map((y,w)=>`
              <div class="hero-dot ${w===lt?"active":""}" data-index="${w}" role="button" aria-label="Slayt ${w+1}"></div>
            `).join("")}
          </div>
        </div>
      </div>
    </section>
  `}function Zf(e=[]){const i=Rt()?e.filter(ni):e;if(!i||i.length===0)return;const n=i.slice(0,10);lt=0;const r=document.getElementById("hero-play-btn"),a=document.getElementById("hero-list-btn"),o=document.getElementById("hero-trailer-btn"),s=document.getElementById("hero-slider-section"),l=document.getElementById("hero-backdrop-img"),d=document.getElementById("hero-arrow-prev"),p=document.getElementById("hero-arrow-next");(async()=>{if(l&&!l.complete&&await new Promise(T=>{l.addEventListener("load",T,{once:!0}),l.addEventListener("error",T,{once:!0})}),l?.complete&&l.naturalWidth>0)try{await l.decode()}catch{}requestAnimationFrame(()=>{s?.isConnected&&(s.classList.remove("is-loading"),s.setAttribute("aria-busy","false"))})})();const f=()=>n.slice(1,4).forEach(T=>qs(Hs(T)));"requestIdleCallback"in window?window.requestIdleCallback(f,{timeout:1500}):setTimeout(f,500),n.slice(0,2).forEach(T=>{const I=T.first_air_date||T.media_type==="tv"?"tv":"movie";xn(I,T.id).catch(()=>null)});function v(){Fn(n[(lt+1)%n.length],(lt+1)%n.length),_()}function y(){Fn(n[(lt-1+n.length)%n.length],(lt-1+n.length)%n.length),_()}d?.addEventListener("click",y),p?.addEventListener("click",v);const w=T=>{if(!s?.isConnected){document.removeEventListener("keydown",w);return}T.key==="ArrowRight"&&v(),T.key==="ArrowLeft"&&y()};document.addEventListener("keydown",w);let k=null,m=!1;const b=50;function E(T){k=T,m=!0}function C(T){if(!m||k===null)return;m=!1;const I=k-T;Math.abs(I)<b||(I>0?v():y(),k=null)}s?.addEventListener("touchstart",T=>E(T.touches[0].clientX),{passive:!0}),s?.addEventListener("touchend",T=>C(T.changedTouches[0].clientX),{passive:!0}),s?.addEventListener("touchcancel",()=>{m=!1,k=null},{passive:!0}),s?.addEventListener("mousedown",T=>{T.button===0&&E(T.clientX)}),s?.addEventListener("mouseup",T=>{T.button===0&&C(T.clientX)}),s?.addEventListener("mouseleave",()=>{m=!1,k=null}),r?.addEventListener("click",()=>{window.location.hash=`#detail?type=${r.getAttribute("data-type")}&id=${r.getAttribute("data-id")}`}),o?.addEventListener("click",async()=>{if($t().trailersEnabled===!1){Q("Fragmanlar yönetici ayarlarından kapatıldı.","info");return}const T=n[lt];if(!T)return;const I=T.first_air_date||T.media_type==="tv"?"tv":"movie",L=o.innerHTML;o.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:17px;height:17px;"></i> <span>Yükleniyor...</span>',J(o);try{const N=await xn(I,T.id,T.title||T.name);N?Wc({title:T.title||T.name,trailerInfo:N,mediaId:T.id,mediaType:I}):Q("Bu yapım için resmi tanıtım fragmanı bulunamadı.","info")}catch{Q("Fragman yüklenirken hata oluştu.","error")}finally{o.innerHTML=L,J(o)}}),a?.addEventListener("click",()=>{const T=n[lt],I=Hl(T);Q(I?"İzleme listene eklendi!":"İzleme listenden çıkarıldı.",I?"success":"info"),a.title=I?"Listemden Çıkar":"Listeme Ekle",a.innerHTML=`<i data-lucide="${I?"check":"plus"}" style="width: 17px; height: 17px; ${I?"color: var(--primary);":""}"></i>`,J(a)}),document.querySelectorAll(".hero-dot").forEach(T=>{T.addEventListener("click",()=>{const I=parseInt(T.getAttribute("data-index"),10);Fn(n[I],I),_()})});function _(){clearInterval(Er),Er=setInterval(()=>{if(n.length>1){const T=(lt+1)%n.length;Fn(n[T],T)}},6e3)}_()}async function Fn(e,t=lt){if(!e||Rt()&&!ni(e))return;const i=document.getElementById("hero-backdrop-img"),n=document.getElementById("hero-title-text"),r=document.getElementById("hero-overview-text"),a=document.getElementById("hero-play-btn"),o=document.getElementById("hero-list-btn"),s=document.getElementById("hero-trailer-btn"),l=document.getElementById("hero-rating-badge"),d=document.getElementById("hero-year-badge"),p=document.getElementById("hero-type-badge"),h=e.first_air_date||e.media_type==="tv"?"tv":"movie",f=Hs(e),v=e.vote_average?e.vote_average.toFixed(1):"8.5",y=(e.first_air_date||e.release_date||"").substring(0,4),w=++ar;if(i&&i.src!==f){const b=await qs(f,"high");if(!b||w!==ar||!i.isConnected)return;i.src=b;try{await i.decode()}catch{}if(w!==ar||!i.isConnected)return}lt=t;const k=document.querySelector("#hero-slider-section .hero-content");k?.classList.remove("hero-content-committing"),requestAnimationFrame(()=>{k?.isConnected&&k.classList.add("hero-content-committing")}),n&&(n.textContent=e.title||e.name);const m=e.overview&&e.overview.trim().length>15?e.overview:qe(e,h);if(r&&(r.textContent=m),l&&(l.innerHTML=`<i data-lucide="star" style="width:13px;height:13px;fill:currentColor"></i> ${v} IMDb`),d&&(d.textContent=y||"2024"),p&&(p.textContent=h==="tv"?"DİZİ":"FİLM"),a&&(a.setAttribute("data-id",e.id),a.setAttribute("data-type",h)),s&&(s.setAttribute("data-id",e.id),s.setAttribute("data-type",h)),o){o.setAttribute("data-id",e.id),o.setAttribute("data-type",h);const b=xs(e.id);o.title=b?"Listemden Çıkar":"Listeme Ekle",o.innerHTML=`<i data-lucide="${b?"check":"plus"}" style="width:17px;height:17px;${b?"color:var(--primary);":""}"></i>`}J(document.getElementById("hero-slider-section")),document.querySelectorAll(".hero-dot").forEach((b,E)=>{b.classList.toggle("active",E===lt)})}const Fs=new Map,Tr=new Map;let Fi=null,Yc=null;function Vc(){const e=window.location.hash||"#home";e.startsWith("#detail")||(Yc=e,window.scrollY>0&&Fs.set(e,window.scrollY))}function Qf(){Vc(),Fi===null&&(Fi=window.setTimeout(()=>{Fi=null,Xr()},300))}function Xr(){Fi!==null&&(clearTimeout(Fi),Fi=null),(window.location.hash||"#home")===Yc&&Vc();for(const[e,t]of Fs)if(t>0)try{sessionStorage.setItem(`cinepulse_scroll_${e}`,String(t))}catch{}for(const[e,t]of Tr)try{sessionStorage.setItem(`cinepulse_rail_${e}`,String(t))}catch{}}const ml=Xr;function eh(e=window.location.hash||"#home"){if(e.startsWith("#detail")){window.scrollTo({top:0,behavior:"instant"});return}document.querySelectorAll(".card-rail").forEach(i=>{if(i.id){let n=Tr.get(i.id);if(typeof n!="number")try{const r=sessionStorage.getItem(`cinepulse_rail_${i.id}`);r&&(n=parseFloat(r))}catch{}typeof n=="number"&&n>0&&(i.scrollLeft=n,requestAnimationFrame(()=>{i.scrollLeft=n}))}});let t=Fs.get(e);if(typeof t!="number")try{const i=sessionStorage.getItem(`cinepulse_scroll_${e}`);i&&(t=parseFloat(i))}catch{}if(typeof t=="number"&&t>0){const i=(n=0)=>{window.scrollTo({top:t,behavior:"instant"}),n<15&&document.body.scrollHeight<t+window.innerHeight&&setTimeout(()=>i(n+1),60)};requestAnimationFrame(()=>i(0))}else window.scrollTo({top:0,behavior:"instant"})}const th={},ih="https://cine-pulse-drab.vercel.app";(th?.VITE_MKV_RELAY_ORIGIN||"").replace(/\/$/,"");function st(e=""){if(!e||/^https?:\/\//i.test(e))return e;if(typeof window>"u")return`http://127.0.0.1:4000${e}`;const t=window.location?.hostname||"";return!!(window.Capacitor?.isNativePlatform?.()||window.location?.protocol==="capacitor:"||t==="localhost"||t==="127.0.0.1"||t.endsWith("github.io"))?`${ih}${e}`:e}const vn=new Map,Ar="cp_fanart_v4_",nh="4e44d9029b1270a757cddc766a1bcb63";function rh(e){if(vn.has(e))return vn.get(e);try{const t=localStorage.getItem(Ar+e)||sessionStorage.getItem(Ar+e);if(t!==null){const i=t?JSON.parse(t):null;return vn.set(e,i),i}}catch{}}function Un(e,t){vn.set(e,t);try{const i=t?JSON.stringify(t):"";localStorage.setItem(Ar+e,i)}catch{try{sessionStorage.setItem(Ar+e,t?JSON.stringify(t):"")}catch{}}}async function ah(e,t){try{const i=await fetch(`https://api.themoviedb.org/3/${t==="tv"?"tv":"movie"}/${e}/images?api_key=${nh}&include_image_language=tr,en,null`,{signal:AbortSignal.timeout(3500)});if(!i.ok)return null;const n=await i.json(),r=n.logos||[];let a=null;r.length>0&&(r.sort((d,p)=>{const h=f=>f.iso_639_1==="tr"?3:f.iso_639_1==="en"?2:1;return h(p)-h(d)||(p.vote_average||0)-(d.vote_average||0)}),r[0]?.file_path&&(a=`https://image.tmdb.org/t/p/w500${r[0].file_path}`));const s=(n.backdrops||[]).filter(d=>(d.iso_639_1==="tr"||d.iso_639_1==="en")&&(d.aspect_ratio||0)>1.35&&d.file_path);let l=null;return s.length>0&&(s.sort((d,p)=>{const h=f=>f.iso_639_1==="tr"?2:1;return h(p)-h(d)||(p.vote_average||0)-(d.vote_average||0)}),l=`https://image.tmdb.org/t/p/w780${s[0].file_path}`),l||a?{image:l||null,logo:l?null:a}:null}catch{return null}}async function sh(e,t){try{const i=st(`/api/fanart?type=${t==="tv"?"tv":"movie"}&id=${encodeURIComponent(e)}`),n=await fetch(i,{signal:AbortSignal.timeout(3e3)});if(!n.ok)return null;const r=await n.json();return r.image?{image:r.image,logo:r.logo||null}:null}catch{return null}}async function Gc(e,t="movie"){if(!/^\d+$/.test(String(e)))return null;const i=t==="tv"?"tv":"movie",n=`${i}:${e}`,r=rh(n);if(r!==void 0)return r;const a=(async()=>{const s=ah(e,i),l=sh(e,i),d=await s;if(d)return Un(n,d),d;const p=await l;return p?(Un(n,p),p):(Un(n,null),null)})();vn.set(n,a);const o=await a;return Un(n,o),o}function gl(e){Array.isArray(e)&&e.forEach((t,i)=>{if(!t?.id)return;const n=t.media_type==="tv"||t.type==="tv"?"tv":"movie";setTimeout(()=>Gc(t.id,n),i*30)})}const oh=Bl||["anime","kimetsu","yaiba","iblis keser","demon slayer","naruto","boruto","shingeki","titan"];function Gt(e=""){return String(e).replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t])}function lh(e){return e?/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(e):!1}function Us(e){if(!e)return!1;if(e.isAnime===!0||e.type==="anime"||e.media_type==="anime"||e.id&&Fe(e.id))return!0;const i=(e.genre_ids||(Array.isArray(e.genres)?e.genres.map(a=>typeof a=="object"?a.id:a):[])).some(a=>Number(a)===16),n=e.original_language==="ja"||Array.isArray(e.origin_country)&&e.origin_country.includes("JP");if(i&&n||i&&(e.origin_country?.includes("JP")||e.original_language==="ja")||e.original_language==="ja"&&(i||lh(e.original_name||e.original_title||e.title||e.name))||Array.isArray(e.genres)&&e.genres.map(o=>typeof o=="object"?o.name:String(o)).filter(Boolean).some(o=>/anime/i.test(o)))return e.id&&Se(e.id),!0;if(typeof e.id=="string"&&(e.id.startsWith("ta_")||e.id.startsWith("acx_")||e.id.startsWith("tra_")))return Se(e.id),!0;const r=(e.title||e.name||e.original_title||e.original_name||"").toLowerCase();for(const a of oh)if(r.includes(a))return e.id&&Se(e.id),!0;return!1}function Jc(e){return e?e.first_air_date||e.number_of_seasons||e.episodesCount||Array.isArray(e.seasons)&&e.seasons.length>0||e.type==="tv"||e.media_type==="tv"?!0:(e.type==="movie"||e.media_type==="movie"||e.release_date&&!e.first_air_date,!1):!1}function js(e){return e?e.isAnime||e.type==="anime"||Us(e)||e.id&&Fe(e.id)?"anime":e.type==="documentary"||e.media_type==="documentary"||(e.genre_ids||(Array.isArray(e.genres)?e.genres.map(i=>typeof i=="object"?i.id:i):[])).some(i=>Number(i)===99)?"documentary":e.type==="movie"||e.media_type==="movie"?"movie":e.type==="tv"||e.media_type==="tv"||Jc(e)?"tv":"movie":"movie"}function Et(e,t={}){const i=e.id,n=js(e),r=!!(e.isAnime||n==="anime"||Us(e)||e.id&&Fe(e.id)),a=!!(e.isSeries!==void 0?e.isSeries:Jc(e)),o=a?"tv":"movie";let s=e.title||e.name||"";(!s||Hr(s))&&(s=e.title_en||e.name_en||e.original_name||e.original_title||s||"İsimsiz İçerik");const l=s,d=e.poster_path||e.posterPath||e.poster||"",p=e.backdrop_path||e.backdropPath||e.backdrop||"",h=at(d,Je.POSTER_MEDIUM),f=p?at(p,Je.BACKDROP_LARGE):h,y=$t().cardLayout==="landscape"?f:h;let w=e.vote_average??e.voteAverage??e.rating,k=w?Number(w).toFixed(1):"";k==="0.0"&&(k="");const m=e.release_date||e.first_air_date||(e.year?String(e.year):""),b=m?String(m).substring(0,4):"";let E=e.progressPercent||0,C=e.season||1,_=e.episode||1,T=e.currentTime||0,I=e.completed||!1,L=!1;if(t.isContinueSection||e.currentTime>0&&!I||e.progressPercent>0&&!I)L=!0;else{const ee=ii(i,C,_);ee&&(I=ee.completed||!1,!I&&ee.duration>0&&ee.currentTime>15&&(E=Math.min(100,Math.round(ee.currentTime/ee.duration*100)),T=ee.currentTime,a&&(C=ee.season||1,_=ee.episode||1)))}let N="FİLM",O="type-movie";r?(N=a?"ANİME DİZİSİ":"ANİME FİLMİ",O="type-anime"):n==="tv"||a?(N="DİZİ",O="type-tv"):n==="documentary"&&(N="BELGESEL",O="type-doc");const K=e.original_title||e.original_name||"",F=encodeURIComponent(l),z=encodeURIComponent(K),P=encodeURIComponent(d||""),Y=encodeURIComponent(p||"");return`
    <div class="media-card" 
      data-id="${i}" 
      data-type="${o}" 
      data-isanime="${r?"true":"false"}"
      data-title="${F}" 
      data-originaltitle="${z}"
      data-poster="${P}"
      data-backdrop="${Y}"
      data-tmdbid="${i}"
      data-mediatype="${n==="tv"||a?"tv":"movie"}"
      data-isseries="${a?"true":"false"}"
      data-season="${C}" 
      data-episode="${_}" 
      data-currenttime="${T}"
      data-iscontinue="${L?"true":"false"}"
      tabindex="0"
      role="button"
      aria-label="${l}">
      
      <div class="card-poster-wrapper ${p?"":"card-fanart-portrait-fallback"}">
        <img 
          src="${y}"
          data-poster-src="${h}"
          data-backdrop-src="${f}"
          alt="${l}" 
          class="card-poster-img" 
          loading="lazy" 
          decoding="async"
          onerror="this.onerror=null;this.src='${xt}'"
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
            <span>S${C} B${_}</span>
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
          <span class="card-type-tag ${O}">${N}</span>
          ${b?`<span class="card-year-tag">${b}</span>`:""}
        </div>
      </div>
    </div>
  `}function gt(e){if(!e||(Gi(e),e._hasMediaEventsDelegated))return;e._hasMediaEventsDelegated=!0;let t=0;e.addEventListener("click",s=>{if(Date.now()<t){s.preventDefault(),s.stopPropagation();return}if(s.target.closest(".btn-lib-delete")||s.target.closest(".btn-delete-history"))return;const l=s.target.closest(".media-card");if(!l)return;s.preventDefault();const d=l.getAttribute("data-id"),p=l.getAttribute("data-type"),h=l.getAttribute("data-isanime")==="true"||p==="anime"||Fe(d),f=parseInt(l.getAttribute("data-season")||"1",10),v=parseInt(l.getAttribute("data-episode")||"1",10),y=parseFloat(l.getAttribute("data-currenttime")||"0"),w=decodeURIComponent(l.getAttribute("data-title")||""),k=decodeURIComponent(l.getAttribute("data-originaltitle")||""),m=l.getAttribute("data-poster")||"",b=l.getAttribute("data-backdrop")||"",E=l.getAttribute("data-iscontinue")==="true",C=l.getAttribute("data-isseries"),_=l.getAttribute("data-mediatype"),T=C!==null?C==="true":_==="tv"||p==="tv";E&&(l.closest("#continue-watching-rail")||l.closest(".continue-card-wrapper")||y>0)?ri({type:h?"anime":T?"tv":"movie",isAnime:h,isSeries:T,tmdbId:d,title:T?`${w} - S${f}E${v}`:w,seriesTitle:w,originalTitle:k||w,season:T?f:void 0,episode:T?v:void 0,posterPath:m,backdropPath:b,currentTime:y}):(ml(),window.location.hash=`#detail?type=${h?"anime":p}&id=${d}`)}),document.querySelector("link[rel=preconnect][href*=youtube-nocookie]")||["https://www.youtube-nocookie.com","https://i.ytimg.com"].forEach(s=>{const l=document.createElement("link");l.rel="preconnect",l.href=s,l.crossOrigin="anonymous",document.head.appendChild(l)});const i=window.matchMedia("(hover: hover) and (pointer: fine)").matches,n=window.matchMedia("(pointer: coarse)").matches,r=$t(),a=r.hoverPreviewsEnabled!==!1&&r.trailersEnabled!==!1;function o(s,l){if(s.querySelector(".card-hover-video-preview"))return;let d=sessionStorage.getItem("cinepulse_preview_sound")==="on";l.then(p=>{if(!p||!p.key||!p.key.trim()||!s.isConnected||i&&!s.matches(":hover"))return;const h=decodeURIComponent(s.getAttribute("data-title")||"Fragman"),f=s.querySelector(".card-type-tag")?.textContent?.trim()||"",v=s.querySelector(".card-year-tag")?.textContent?.trim()||"",y=s.querySelector(".card-rating-pill span")?.textContent?.trim()||"",w=s.getAttribute("data-id")||"",k=s.getAttribute("data-type")||"movie",m=`#detail?type=${encodeURIComponent(k)}&id=${encodeURIComponent(w)}`,b=encodeURIComponent(p.key),E=document.createElement("div");E.className="card-hover-video-preview";const C=window.innerWidth<=700;if(C&&(document.querySelectorAll(".card-hover-video-preview").forEach(P=>{typeof P._closePreview=="function"?P._closePreview():(P.closest?.(".media-card")?.classList.remove("preview-active"),P.remove())}),document.querySelectorAll(".card-preview-mobile-close-portal").forEach(P=>P.remove()),E.classList.add("is-mobile-sheet")),E.innerHTML=`
        <div class="card-preview-media">
          <iframe
            src="https://www.youtube-nocookie.com/embed/${b}?autoplay=1&mute=1&controls=0&disablekb=1&modestbranding=1&loop=1&playlist=${b}&rel=0&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}"
            frameborder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            tabindex="-1"
            title="${Gt(h)} fragmanı">
          </iframe>
          <div class="card-preview-cinematic-shade"></div>
          <span class="card-preview-badge">FRAGMAN</span>
        </div>
        <button class="card-preview-close-btn" type="button" aria-label="Fragmanı kapat" title="Fragmanı kapat"><i data-lucide="x"></i></button>
        <div class="card-preview-details">
          <div class="card-preview-copy">
            <strong class="card-preview-title">${Gt(h)}</strong>
            <div class="card-preview-meta">
              ${y?`<span class="card-preview-match">${Gt(y)} IMDb</span>`:""}
              ${v?`<span>${Gt(v)}</span>`:""}
              ${f?`<span>${Gt(f)}</span>`:""}
            </div>
          </div>
          <div class="card-preview-actions">
            <a class="card-preview-detail" href="${Gt(m)}" aria-label="${Gt(h)} içerik sayfasına git"><i data-lucide="info"></i><span>İçeriğe Git</span></a>
            <a class="card-preview-open" href="${Gt(p.watchUrl||`https://www.youtube.com/watch?v=${b}`)}" target="_blank" rel="noopener noreferrer" title="YouTube'da aç" aria-label="Fragmanı YouTube'da aç"><i data-lucide="external-link"></i></a>
            <button class="card-preview-sound ${d?"is-on":""}" type="button" aria-label="${d?"Sesi kapat":"Sesi aç"}" title="${d?"Sesi kapat":"Sesi aç"}">
              <i data-lucide="${d?"volume-2":"volume-x"}"></i>
            </button>
          </div>
        </div>
      `,!C){const P=s.getBoundingClientRect(),Y=window.innerHeight<520?12:76,ne=Math.min(460,Math.max(390,P.width*2.2),window.innerWidth-32),ee=Math.max(240,(window.innerHeight-Y-94)*16/9),re=Math.max(240,Math.min(ne,ee)),H=re*9/16+82,se=Math.max(16,Math.min(window.innerWidth-re-16,P.left+(P.width-re)/2)),G=Math.max(Y,Math.min(window.innerHeight-H-12,P.top+(P.height-H)/2));E.style.left=`${se}px`,E.style.top=`${G}px`,E.style.width=`${re}px`}s.classList.add("preview-active"),s.appendChild(E),J();const _=E.querySelector("iframe");let T=null,I=null;C&&(T=document.createElement("button"),T.type="button",T.className="card-preview-mobile-close-portal",T.setAttribute("aria-label","Fragmanı kapat"),T.title="Fragmanı kapat",T.innerHTML='<i data-lucide="x"></i>',I=()=>{const P=E.getBoundingClientRect();T.style.top=`${Math.max(8,P.top+12)}px`,T.style.left=`${Math.max(8,P.right-52)}px`},document.body.appendChild(T),requestAnimationFrame(I),window.addEventListener("resize",I,{passive:!0}),J(T)),E.addEventListener("click",P=>P.stopPropagation()),E.addEventListener("touchend",P=>P.stopPropagation(),{passive:!0});const L=E.querySelector(".card-preview-sound"),N=E.querySelector(".card-preview-close-btn");E.querySelector(".card-preview-detail")?.addEventListener("click",()=>{ml(),F()});const O=(P,Y=[])=>{_?.contentWindow?.postMessage(JSON.stringify({event:"command",func:P,args:Y}),"*")},K=()=>{O(d?"unMute":"mute"),d&&O("setVolume",[75]),L.classList.toggle("is-on",d),L.title=d?"Sesi kapat":"Sesi aç",L.setAttribute("aria-label",L.title),L.innerHTML=`<i data-lucide="${d?"volume-2":"volume-x"}"></i>`,J()},F=()=>{I&&window.removeEventListener("resize",I);try{T?.remove()}catch{}try{E.remove()}catch{}s.classList.remove("preview-active")};E._closePreview=F;const z=window.setTimeout(()=>{E.classList.add("video-ready")},1500);_.addEventListener("load",()=>{window.clearTimeout(z),E.classList.add("video-ready"),d&&window.setTimeout(K,180)},{once:!0}),L.addEventListener("click",P=>{P.preventDefault(),P.stopPropagation(),d=!d,sessionStorage.setItem("cinepulse_preview_sound",d?"on":"off"),K(),window.setTimeout(K,180)}),N&&N.addEventListener("click",P=>{P.preventDefault(),P.stopPropagation(),F()}),T?.addEventListener("click",P=>{P.preventDefault(),P.stopPropagation(),F()})}).catch(()=>{})}if(i&&a){const s=new WeakMap;e.addEventListener("pointerover",l=>{const d=l.target.closest(".media-card");if(!d||l.relatedTarget&&d.contains(l.relatedTarget))return;const p=d.getAttribute("data-id"),h=d.getAttribute("data-type")||"movie",f=xn(h==="tv"?"tv":"movie",p),v=setTimeout(()=>o(d,f),850);s.set(d,v)}),e.addEventListener("pointerout",l=>{const d=l.target.closest(".media-card");if(!d||l.relatedTarget&&d.contains(l.relatedTarget))return;const p=s.get(d);p&&clearTimeout(p),s.delete(d);const h=d.querySelector(".card-hover-video-preview");if(h)try{h.remove()}catch{}d.classList.remove("preview-active")})}if(n&&a){const l=new WeakMap;e.addEventListener("touchstart",p=>{if(p.target.closest(".card-hover-video-preview"))return;const h=p.target.closest(".media-card");if(!h)return;const f={opened:!1,timer:null},v=h.getAttribute("data-id"),y=h.getAttribute("data-type")||"movie",w=xn(y==="tv"?"tv":"movie",v);f.timer=setTimeout(()=>{f.timer=null,f.opened=!0,t=Date.now()+900;try{navigator.vibrate?.(40)}catch{}o(h,w)},600),l.set(h,f)},{passive:!0});const d=p=>{const h=p.target.closest(".media-card"),f=h&&l.get(h);f&&(f.timer&&clearTimeout(f.timer),f.timer=null,(!f.opened||p.type!=="touchend")&&l.delete(h))};e.addEventListener("touchend",d,{passive:!0}),e.addEventListener("touchmove",d,{passive:!0}),e.addEventListener("touchcancel",d,{passive:!0}),e.addEventListener("touchend",p=>{const h=p.target.closest(".media-card");(h&&l.get(h))?.opened&&l.delete(h)},{passive:!0})}}let on=null;function ch(){return on||("IntersectionObserver"in window?(on=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&(on.unobserve(t.target),ps(t.target))})},{rootMargin:"800px 0px"}),on):null)}async function ps(e){if(!e||e.dataset.fanartState==="loaded"||e.dataset.fanartState==="loading")return;e.dataset.fanartState="loading";const t=e.querySelector(".card-poster-img");if(t)try{const i=await Gc(e.dataset.tmdbid,e.dataset.mediatype||"movie");if(!e.isConnected)return;if(!i?.image&&!i?.logo){e.dataset.fanartState="empty";return}i.image&&(t.dataset.backdropSrc=i.image,($t().cardLayout==="landscape"||document.documentElement.classList.contains("cards-landscape"))&&(t.src=i.image));const n=e.querySelector(".card-fanart-logo");if(n&&i.logo){n.src=i.logo;const r=e.querySelector(".card-poster-wrapper");r?.classList.remove("card-fanart-placeholder"),r?.classList.toggle("card-fanart-composite",!0)}e.dataset.fanartState="loaded"}catch{e.dataset.fanartState="empty"}}function Gi(e=document,t=!1){const n=(e&&e.querySelectorAll?e:document).querySelectorAll('.media-card[data-tmdbid]:not([data-fanart-state="loaded"])');if(!n.length)return;if(t){n.forEach(a=>ps(a));return}const r=ch();if(!r){n.forEach(a=>ps(a));return}n.forEach(a=>r.observe(a))}let tt=null,Jt=null,Pi=0;const Cr=new Map,fs=new Set,dh=10*60*1e3;function uh(){Jf();for(const e of fs)e.disconnect();fs.clear()}function ph(e){try{const t=sessionStorage.getItem(`cinepulse_home_fast_v7_${e?"kids":"adult"}`);if(!t)return null;const i=JSON.parse(t);return!i?.savedAt||Date.now()-i.savedAt>dh?null:i.data?.isKid===e?i.data:null}catch{return null}}function Da(e){try{sessionStorage.setItem(`cinepulse_home_fast_v7_${e.isKid?"kids":"adult"}`,JSON.stringify({savedAt:Date.now(),data:e}))}catch{}}function bn(){tt=null,Jt=null,Pi++;try{sessionStorage.removeItem("cinepulse_home_fast_v2_kids"),sessionStorage.removeItem("cinepulse_home_fast_v2_adult"),sessionStorage.removeItem("cinepulse_home_fast_v3_kids"),sessionStorage.removeItem("cinepulse_home_fast_v3_adult"),sessionStorage.removeItem("cinepulse_home_fast_v4_kids"),sessionStorage.removeItem("cinepulse_home_fast_v4_adult"),sessionStorage.removeItem("cinepulse_home_fast_v5_kids"),sessionStorage.removeItem("cinepulse_home_fast_v5_adult"),sessionStorage.removeItem("cinepulse_home_fast_v6_kids"),sessionStorage.removeItem("cinepulse_home_fast_v6_adult"),sessionStorage.removeItem("cinepulse_home_fast_v7_kids"),sessionStorage.removeItem("cinepulse_home_fast_v7_adult")}catch{}Cr.clear(),Object.keys(_e).forEach(e=>{_e[e].page=1,_e[e].loading=!1,_e[e].exhausted=!1})}const _e={"rail-popular-tv":{page:1,loading:!1,exhausted:!1,fetcher:hr},"rail-popular-movies":{page:1,loading:!1,exhausted:!1,fetcher:mr},"rail-top-tv":{page:1,loading:!1,exhausted:!1,fetcher:e=>Bi("tv",e)},"rail-top-movies":{page:1,loading:!1,exhausted:!1,fetcher:e=>Bi("movie",e)},"rail-anime":{page:1,loading:!1,exhausted:!1,fetcher:gr},"rail-adult-animation":{page:1,loading:!1,exhausted:!1,fetcher:Ya},"rail-cartoon-series":{page:1,loading:!1,exhausted:!1,fetcher:fr},"rail-documentary":{page:1,loading:!1,exhausted:!1,fetcher:yr}};function Pe({id:e,icon:t,title:i,accent:n,items:r}){if(!r||r.length===0)return"";const a=Cr.get(e)||[],s=[...r,...a].map(l=>Et(l)).join("");return`
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
  `}function fh(e){return!e||e.length===0?"":`
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
      ${Et(n,{isContinueSection:!0})}
      <button class="btn-delete-history" title="Geçmişten Kaldır" aria-label="Kaldır">
        <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
      </button>
    </div>
  `).join("")}
        </div>
      </div>
    </section>
  `}function yl(e){const t=e.querySelectorAll(".rail-sentinel");t.length!==0&&t.forEach(i=>{const n=i.getAttribute("data-rail"),r=document.getElementById(n);if(!r)return;const a=async()=>{const s=_e[n];if(!s||s.loading||s.exhausted)return;s.loading=!0;const l=document.createElement("div");l.className="rail-loader",l.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:22px;height:22px;color:var(--text-muted);"></i>',i.before(l),J(l);try{const d=new Set(Array.from(r.querySelectorAll(".media-card[data-id]")).map(f=>String(f.getAttribute("data-id"))).filter(Boolean));let p=[];for(let f=0;f<4&&p.length===0;f+=1){s.page+=1;const v=await s.fetcher(s.page);if(!v||v.length===0){s.exhausted=!0;break}p=v.filter(y=>{const w=String(y?.id||"");return!w||d.has(w)?!1:(d.add(w),!0)})}if(l.remove(),p.length===0||!r.isConnected){s.loading=!1;return}const h=Cr.get(n)||[];Cr.set(n,[...h,...p]),p.forEach(f=>{const v=document.createElement("div");v.innerHTML=Et(f);const y=v.firstElementChild;y&&(r.insertBefore(y,i),y.addEventListener("click",()=>{const w=y.getAttribute("data-id"),k=y.getAttribute("data-type");window.location.hash=`#detail?type=${k}&id=${w}`}))}),J(r),Gi(r)}catch{l.remove()}s.loading=!1};r.addEventListener("scroll",()=>{r.scrollWidth-(r.scrollLeft+r.clientWidth)<600&&a()},{passive:!0});const o=new IntersectionObserver(s=>{s.forEach(l=>{l.isIntersecting&&a()})},{root:r,rootMargin:"0px 400px 0px 0px",threshold:0});o.observe(i),fs.add(o)})}async function hh(){const e=Pi,t=Rt();let i,n,r,a,o,s,l,d,p,h,f,v;tt||(tt=ph(t));let y=null,w=!1,k=!1;if(tt&&tt.isKid===t)({trending:i,popularTV:n,popularMovies:r,topRatedTV:a,topRatedMovies:o,animeItems:s,docItems:l,kidsAdventures:d,adultAnimationItems:p,cartoonSeriesItems:h,kidsAnimationItems:f,kidsClassicCartoonItems:v}=tt),y=Jt,w=!y;else if(t){if(y=Promise.all([bo(1),Ga(1),yo(1),vo(1)]).then(L=>{e===Pi&&([d,s,f,v]=L,tt={isKid:!0,trending:i,popularTV:n,popularMovies:r,kidsAdventures:d,animeItems:s,kidsAnimationItems:f,kidsClassicCartoonItems:v},k&&Da(tt),w=!0)}).catch(()=>{w=!0}),Jt=y,y.then(()=>{Jt===y&&(Jt=null)}),[n,r]=await Promise.all([Wa(1),Va(1)]),i=[...r||[],...n||[]].filter(L=>L.backdrop_path&&ni(L)).slice(0,10),e!==Pi)return null;w||(tt={isKid:!0,trending:i,popularTV:n,popularMovies:r})}else{if(y=Promise.all([Bi("tv",1),Bi("movie",1),gr(1),yr(1),Ya(1),fr(1)]).then(L=>{e===Pi&&([a,o,s,l,p,h]=L,tt={isKid:!1,trending:i,popularTV:n,popularMovies:r,topRatedTV:a,topRatedMovies:o,animeItems:s,docItems:l,adultAnimationItems:p,cartoonSeriesItems:h},k&&Da(tt),w=!0)}).catch(()=>{w=!0}),Jt=y,y.then(()=>{Jt===y&&(Jt=null)}),[i,n,r]=await Promise.all([Wl("all","week",1),hr(1),mr(1)]),e!==Pi)return null;w||(tt={isKid:!1,trending:i,popularTV:n,popularMovies:r})}k=!0,w&&tt&&Da(tt);const m=w,b=fo(),E=so(b);let C;t?C=[...r||[],...n||[]].filter(N=>N.backdrop_path&&ni(N)).slice(0,10):C=i;const _=Xf(C);t?(_e["rail-kids-animation"]||(_e["rail-kids-animation"]={page:1,loading:!1,exhausted:!1,fetcher:yo}),_e["rail-kids-classics"]||(_e["rail-kids-classics"]={page:1,loading:!1,exhausted:!1,fetcher:vo}),_e["rail-kids-movies"]||(_e["rail-kids-movies"]={page:1,loading:!1,exhausted:!1,fetcher:Va}),_e["rail-kids-adventures"]||(_e["rail-kids-adventures"]={page:1,loading:!1,exhausted:!1,fetcher:bo}),_e["rail-anime"]||(_e["rail-anime"]={page:1,loading:!1,exhausted:!1,fetcher:Ga})):(_e["rail-popular-tv"]||(_e["rail-popular-tv"]={page:1,loading:!1,exhausted:!1,fetcher:hr}),_e["rail-popular-movies"]||(_e["rail-popular-movies"]={page:1,loading:!1,exhausted:!1,fetcher:mr}),_e["rail-top-tv"]||(_e["rail-top-tv"]={page:1,loading:!1,exhausted:!1,fetcher:L=>Bi("tv",L)}),_e["rail-top-movies"]||(_e["rail-top-movies"]={page:1,loading:!1,exhausted:!1,fetcher:L=>Bi("movie",L)}),_e["rail-anime"]||(_e["rail-anime"]={page:1,loading:!1,exhausted:!1,fetcher:gr}),_e["rail-adult-animation"]||(_e["rail-adult-animation"]={page:1,loading:!1,exhausted:!1,fetcher:Ya}),_e["rail-cartoon-series"]||(_e["rail-cartoon-series"]={page:1,loading:!1,exhausted:!1,fetcher:fr})),t||_e["rail-documentary"]||(_e["rail-documentary"]={page:1,loading:!1,exhausted:!1,fetcher:yr}),Object.values(_e).forEach(L=>{L.loading=!1});let T="";return t?T=`
      ${Pe({id:"rail-kids-movies",icon:"sparkles",title:"🎈 En Çok Sevilen Animasyon & Çocuk Filmleri",accent:"#ec4899",items:r})}

      ${f&&f.length>0?Pe({id:"rail-kids-animation",icon:"sparkles",title:"Çocuk Animasyonları & Yeni Çizgi Diziler",accent:"#fb7185",items:f}):""}

      ${v&&v.length>0?Pe({id:"rail-kids-classics",icon:"palette",title:"Çizgi Dizi Dünyası & Unutulmaz Klasikler",accent:"#38bdf8",items:v}):""}

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
      ${_}

      ${fh(E)}

      ${T}
    </div>
  `,init:L=>{const N=C&&C.length>0?C:i;N&&N.length>0&&Zf(N),gt(L);const O=F=>{F.querySelectorAll(".card-rail").forEach(z=>{const P=z.id;if(P){let Y=Tr.get(P);if(typeof Y!="number")try{const ne=sessionStorage.getItem(`cinepulse_rail_${P}`);ne&&(Y=parseFloat(ne))}catch{}typeof Y=="number"&&Y>0&&(z.scrollLeft=Y,requestAnimationFrame(()=>{z.scrollLeft=Y})),z.addEventListener("scroll",()=>{Tr.set(P,z.scrollLeft)},{passive:!0})}z.addEventListener("wheel",Y=>{Math.abs(Y.deltaX)>Math.abs(Y.deltaY)||(Y.preventDefault(),z.scrollBy({left:Y.deltaY*2.5,behavior:"smooth"}))},{passive:!1})})};if(O(L),L.querySelectorAll(".spotlight-hero, .spotlight-mini").forEach(F=>{F.addEventListener("click",()=>{const z=F.getAttribute("data-id"),P=F.getAttribute("data-type");z&&P&&(window.location.hash=`#detail?type=${P}&id=${z}`)})}),L.querySelector(".spotlight-hero-btn")?.addEventListener("click",F=>{F.stopPropagation();const z=L.querySelector(".spotlight-hero");if(z){const P=z.getAttribute("data-id"),Y=z.getAttribute("data-type");window.location.hash=`#detail?type=${Y}&id=${P}`}}),yl(L),y&&!m){const F=L.querySelector(".home-view");y.then(()=>{if({topRatedTV:a,topRatedMovies:o,animeItems:s,docItems:l,kidsAdventures:d,adultAnimationItems:p,cartoonSeriesItems:h,kidsAnimationItems:f,kidsClassicCartoonItems:v}=tt||{},!F?.isConnected||!(window.location.hash||"#home").startsWith("#home"))return;const z=document.createElement("div");z.className="home-more-rails",z.innerHTML=t?`
            ${Pe({id:"rail-kids-animation",icon:"sparkles",title:"Çocuk Animasyonları & Yeni Çizgi Diziler",accent:"#fb7185",items:f})}
            ${Pe({id:"rail-kids-classics",icon:"palette",title:"Çizgi Dizi Dünyası & Unutulmaz Klasikler",accent:"#38bdf8",items:v})}
            ${Pe({id:"rail-kids-adventures",icon:"compass",title:"⭐ Aile ve Fantastik Sinema Kuşağı",accent:"#38bdf8",items:d})}
            ${Pe({id:"rail-anime",icon:"smile",title:"🎌 Çocuk & Genç Anime Dünyası",accent:"#a855f7",items:s})}
          `:`
            ${Pe({id:"rail-adult-animation",icon:"sparkles",title:"Yetişkin Animasyonları & Çizgi Diziler",accent:"#fb7185",items:p})}
            ${Pe({id:"rail-cartoon-series",icon:"wand-2",title:"Çizgi Dizi Dünyası & Unutulmaz Klasikler",accent:"#38bdf8",items:h})}
            ${Pe({id:"rail-top-movies",icon:"award",title:"⭐ Sinema Tarihinin Başyapıtları (IMDb 8.5+)",accent:"#fbbf24",items:o})}
            ${Pe({id:"rail-top-tv",icon:"star",title:"Kült & En Yüksek Puanlı Diziler",accent:"#34d399",items:a})}
            ${Pe({id:"rail-anime",icon:"sparkles",title:"🎌 Popüler Anime Evreni (TR Dublaj & Altyazı)",accent:"#ec4899",items:s})}
            ${Pe({id:"rail-documentary",icon:"globe",title:"🌍 İlham Veren Kült Belgeseller",accent:"#38bdf8",items:l})}
          `,F.append(z),J(z),gt(z),O(z),yl(z)})}L.querySelectorAll(".btn-delete-history").forEach(F=>{F.addEventListener("click",z=>{z.stopPropagation();const P=F.closest(".continue-card-wrapper");if(!P)return;const Y=P.getAttribute("data-id");Ua(Y),Q("İçerik izleme geçmişinden kaldırıldı.","info"),P.style.transition="all 0.28s ease-out",P.style.transform="scale(0.85)",P.style.opacity="0",setTimeout(()=>{P.remove();const ne=L.querySelector("#continue-watching-rail");ne&&ne.children.length===0&&ne.closest(".rail-section")?.remove()},300)})});const K=()=>{if(!(window.location.hash||"#home").startsWith("#home"))return;const F=L.querySelector(".home-view");if(!F?.isConnected)return;const z=so(fo()),P=L.querySelector("#continue-watching-rail")?.closest(".rail-section");if(z&&z.length>0){const ne=z.slice(0,24).map(ee=>`
            <div class="continue-card-wrapper" data-id="${ee.id}" data-season="${ee.season||1}" data-episode="${ee.episode||1}">
              ${Et(ee,{isContinueSection:!0})}
              <button class="btn-delete-history" title="Geçmişten Kaldır" aria-label="Kaldır">
                <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
              </button>
            </div>
          `).join("");if(P){const ee=P.querySelector("#continue-watching-rail");ee&&(ee.innerHTML=ne)}else{const ee=`
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
            `,re=F.querySelector(".hero-slider-section")||F.querySelector(".rail-section");re?re.insertAdjacentHTML("afterend",ee):F.insertAdjacentHTML("afterbegin",ee)}J(L),gt(L),L.querySelectorAll(".btn-delete-history").forEach(ee=>{ee.addEventListener("click",re=>{re.stopPropagation();const H=ee.closest(".continue-card-wrapper");if(!H)return;const se=H.getAttribute("data-id");Ua(se),Q("İçerik izleme geçmişinden kaldırıldı.","info"),H.style.transition="all 0.28s ease-out",H.style.transform="scale(0.85)",H.style.opacity="0",setTimeout(()=>{H.remove();const G=L.querySelector("#continue-watching-rail");G&&G.children.length===0&&G.closest(".rail-section")?.remove()},300)})})}else P&&P.remove()};window.addEventListener("cinepulse_data_changed",K),window.addEventListener("sineflix_data_changed",K)}}}async function mh({tvId:e,seriesTitle:t,originalTitle:i="",seriesOverview:n="",seasons:r=[],posterPath:a="",backdropPath:o="",isAnime:s=!1,spoilerFree:l=!1}){const d=r.filter(k=>k.season_number>0);d.length===0&&r.length>0&&d.push(r[0]);const p=d.length>0?d[0].season_number:1,h=d.length>0&&d[0].episode_count||10,f=ua(e,p,h);let v=!!l,y=null;return{html:`
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
  `,init:k=>{if(!k)return;let m=p,b=h;const E=()=>{const O=k.querySelector("#btn-mark-season-all");if(!O)return;const K=ua(e,m,b),F=O.querySelector("span"),z=O.querySelector("i");F&&(F.textContent=K?"Bu Sezon İzlendi":"Bu Sezonu İzlendi İşaretle"),z&&z.setAttribute("data-lucide",K?"check-circle-2":"check-check"),K?(O.style.background="rgba(16, 185, 129, 0.2)",O.style.borderColor="#10b981",O.style.color="#10b981"):(O.style.background="",O.style.borderColor="",O.style.color=""),J()};sr(e,t,n,m,k,a,o,i,d,E,s,v);const C=O=>{if(O&&O.detail&&O.detail.isProgressUpdate&&document.getElementById("player-modal"))return;const K=k.querySelector("#episode-grid-container");K&&(K.querySelectorAll(".episode-card").forEach(F=>{const z=parseInt(F.getAttribute("data-season"),10),P=parseInt(F.getAttribute("data-episode"),10),Y=ii(e,z,P),ne=Y?Y.progressPercent:0,ee=Y?Y.completed||ne>=90:!1,re=Y&&!ee&&Y.currentTime>0,H=F.querySelector(".badge-watched-status"),se=F.querySelector(".btn-mark-ep-watched"),G=F.querySelector(".card-progress-fill"),V=F.querySelector(".btn-mark-ep-halfway");H&&(ee?(H.innerHTML='<i data-lucide="check" style="width:11px; height:11px"></i> İZLENDİ',H.style.background="var(--accent-green)",H.style.color="#fff",H.style.display="inline-flex"):re?(H.innerHTML='<i data-lucide="clock" style="width:11px; height:11px"></i> YARIDA',H.style.background="rgba(245, 158, 11, 0.95)",H.style.color="#000",H.style.display="inline-flex"):H.style.display="none"),se&&(ee?(se.classList.add("watched"),se.style.background="#10b981",se.style.borderColor="#10b981",se.title="İzlendi işaretini kaldır"):(se.classList.remove("watched"),se.style.background="rgba(0,0,0,0.65)",se.style.borderColor="rgba(255,255,255,0.3)",se.title="İzlendi olarak işaretle")),V&&(V.style.background=re?"#f59e0b":"rgba(0,0,0,0.65)",V.style.borderColor=re?"#f59e0b":"rgba(255,255,255,0.3)"),G&&(G.style.width=`${ne}%`,G.style.background=ee?"var(--accent-green)":"#fbbf24")}),J()),E()};window.addEventListener("sineflix_data_changed",C),k.querySelectorAll(".season-pill").forEach(O=>{O.addEventListener("click",K=>{K.preventDefault(),k.querySelectorAll(".season-pill").forEach(F=>F.classList.remove("active")),O.classList.add("active"),O.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"}),m=parseInt(O.getAttribute("data-season"),10),b=parseInt(O.getAttribute("data-ep-count"),10)||10,sr(e,t,n,m,k,a,o,i,d,E,s,v),E()})});const _=k.querySelector(".season-pill.active");_&&setTimeout(()=>{_.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})},120);const T=k.querySelector("#season-tabs-bar"),I=k.querySelector("#btn-season-prev"),L=k.querySelector("#btn-season-next");if(T){I?.addEventListener("click",P=>{P.preventDefault(),T.scrollBy({left:-260,behavior:"smooth"})}),L?.addEventListener("click",P=>{P.preventDefault(),T.scrollBy({left:260,behavior:"smooth"})}),T.addEventListener("wheel",P=>{P.deltaY!==0&&T.scrollWidth>T.clientWidth&&(P.preventDefault(),T.scrollLeft+=P.deltaY)},{passive:!1});let O=!1,K=0,F=0,z=!1;T.addEventListener("mousedown",P=>{P.button===0&&(O=!0,z=!1,T.classList.add("dragging"),K=P.pageX-T.offsetLeft,F=T.scrollLeft)}),window.addEventListener("mousemove",P=>{if(!O)return;const ne=(P.pageX-T.offsetLeft-K)*1.5;Math.abs(ne)>4&&(z=!0),T.scrollLeft=F-ne}),window.addEventListener("mouseup",()=>{O&&(O=!1,T.classList.remove("dragging"),setTimeout(()=>{z=!1},50))}),T.addEventListener("click",P=>{z&&(P.preventDefault(),P.stopPropagation())},!0)}const N=k.querySelector("#btn-mark-season-all");N&&N.addEventListener("click",O=>{O.preventDefault();const F=!ua(e,m,b);Dd(e,m,b,F,{title:t,posterPath:a,backdropPath:o,type:s?"anime":"tv",isAnime:s}),Q(F?`${m}. Sezonun tüm bölümleri izlendi!`:`${m}. Sezon izlenmedi olarak işaretlendi.`,F?"success":"info");const z=k.querySelector("#episode-grid-container");z&&(z.querySelectorAll(".episode-card").forEach(P=>{const Y=P.querySelector(".badge-watched-status"),ne=P.querySelector(".btn-mark-ep-watched");Y&&(Y.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',Y.style.background="var(--accent-green)",Y.style.color="#fff",Y.style.display=F?"inline-flex":"none"),ne&&(F?(ne.classList.add("watched"),ne.style.background="#10b981",ne.style.borderColor="#10b981",ne.title="İzlendi işaretini kaldır"):(ne.classList.remove("watched"),ne.style.background="rgba(0,0,0,0.65)",ne.style.borderColor="rgba(255,255,255,0.3)",ne.title="İzlendi olarak işaretle"))}),J()),E()}),y=O=>{v=!!O,sr(e,t,n,m,k,a,o,i,d,E,s,v)}},setSpoilerSafe(k){v=!!k,y?.(v)}}}function gh(e){const t=Be().filter(i=>String(i?.id)===String(e)&&(Number(i.currentTime)>0||i.completed||Number(i.progressPercent)>0));return t.length?t.reduce((i,n)=>{const r={season:Math.max(1,Number(n.season)||1),episode:Math.max(1,Number(n.episode)||1)};return r.season>i.season||r.season===i.season&&r.episode>i.episode?r:i},{season:1,episode:1}):{season:1,episode:1}}async function sr(e,t,i,n,r,a="",o="",s="",l=[],d=null,p=!1,h=!1){const f=r.querySelector("#episode-grid-container");if(!f)return;f.innerHTML=`<div style="padding: 3rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;"><i data-lucide="loader-2" class="spin-loader" style="width: 24px; height: 24px; margin-bottom: 0.5rem;"></i><div>${n}. Sezon bölümleri getiriliyor...</div></div>`,J();let v=null;try{v=await su(e,n)}catch{}if(!v||!v.episodes||v.episodes.length===0){f.innerHTML=`
      <div style="padding: 3rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;">
        <p style="margin-bottom: 0.75rem;">Bu sezon için bölüm verisi getirilemedi.</p>
        <button id="btn-retry-season-episodes" class="btn-secondary" style="padding: 0.45rem 1rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
          <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
          <span>Tekrar Dene</span>
        </button>
      </div>
    `,J(),r.querySelector("#btn-retry-season-episodes")?.addEventListener("click",()=>{sr(e,t,i,n,r,a,o,s,l,d,p,h)});return}const y=h?gh(e):null,w=h?v.episodes.filter(m=>n<y.season||n===y.season&&Number(m.episode_number)<=y.episode+1):v.episodes;if(h&&w.length===0){f.innerHTML='<div class="spoiler-safe-locked"><i data-lucide="shield-check"></i><strong>Bu sezon spoiler korumasında</strong><span>Önceki sezona ilerledikçe bölüm detayları burada açılır.</span></div>',J();return}const k=h?`<div class="spoiler-safe-notice"><i data-lucide="shield-check"></i><span>Spoilersız keşif açık · S${y.season} B${y.episode+1} sonrasının detayları gizli.</span></div>`:"";f.innerHTML=k+w.map(m=>{const b=m.episode_number;let E=(m.name||"").trim();E=E.replace(new RegExp(`^(?:${b}\\s*[\\.\\:\\-]\\s*)+(?:Bölüm\\s*[\\:\\-]\\s*)?`,"i"),""),E=E.replace(new RegExp(`^Bölüm\\s*${b}\\s*[\\:\\-]\\s*`,"i"),""),E=E.trim();const C=E?`${b}. Bölüm: ${E}`:`${b}. Bölüm`;let _=m.overview?m.overview.trim():"";(!_||_.length<5)&&(i&&i.length>10?_=`${b}. Bölüm: ${i}`:_=`${t} ${n}. Sezon ${b}. Bölüm Türkçe Dublaj ve Altyazılı yüksek kalitede kesintisiz HD izle.`);const T=_.length>90,I=at(m.still_path,Je.STILL_MEDIUM),L=m.air_date||"",N=m.runtime?`${m.runtime} dk`:"",O=ii(e,n,b),K=O?O.progressPercent:0,F=O?O.completed||K>=90:!1,z=O&&!F&&O.currentTime>0,P=K>0?`
      <div class="card-progress-bar">
        <div class="card-progress-fill" style="width: ${K}%; background: ${F?"var(--accent-green)":"#fbbf24"};"></div>
      </div>
    `:"";let Y="";return F?Y=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.5rem; left: 0.5rem; background: var(--accent-green); z-index: 4;">
          <i data-lucide="check" style="width:11px; height:11px"></i> İZLENDİ
        </span>
      `:z?Y=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.5rem; left: 0.5rem; background: rgba(245, 158, 11, 0.95); color: #000; font-weight: 800; z-index: 4;">
          <i data-lucide="clock" style="width:11px; height:11px"></i> YARIDA
        </span>
      `:Y=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.5rem; left: 0.5rem; background: var(--accent-green); display: none; z-index: 4;">
          <i data-lucide="check" style="width:11px; height:11px"></i> İZLENDİ
        </span>
      `,`
      <div class="episode-card" data-tv-id="${e}" data-season="${n}" data-episode="${b}" data-title="${C}">
        <div class="episode-thumb-wrap">
          <img src="${I}" alt="${C}" loading="lazy" onerror="this.onerror=null; this.src='${xt}';" />
          <span class="episode-number-chip">${n}x${b<10?"0"+b:b}</span>
          ${Y}
          
          <div class="episode-play-overlay">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--primary-gradient); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.6);">
              <i data-lucide="play" style="width: 20px; height: 20px; fill: #fff; color: #fff; margin-left: 2px;"></i>
            </div>
          </div>

          <!-- Top Right Action Controls: Mark Watched & Halfway -->
          <div style="position: absolute; top: 0.5rem; right: 0.5rem; display: flex; gap: 0.35rem; z-index: 5;">
            <button class="btn-mark-ep-halfway" data-tv-id="${e}" data-season="${n}" data-episode="${b}" title="Yarıda Bırakıldı (20. dk)" style="width: 28px; height: 28px; border-radius: 50%; background: ${z?"#f59e0b":"rgba(0,0,0,0.65)"}; border: 1px solid ${z?"#f59e0b":"rgba(255,255,255,0.3)"}; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
              <i data-lucide="clock" style="width: 13px; height: 13px;"></i>
            </button>

            <button class="btn-mark-ep-watched ${F?"watched":""}" data-tv-id="${e}" data-season="${n}" data-episode="${b}" title="${F?"İzlendi işaretini kaldır":"İzlendi olarak işaretle"}" style="width: 28px; height: 28px; border-radius: 50%; background: ${F?"#10b981":"rgba(0,0,0,0.65)"}; border: 1px solid ${F?"#10b981":"rgba(255,255,255,0.3)"}; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
              <i data-lucide="check" style="width: 14px; height: 14px;"></i>
            </button>
          </div>

          ${P}
        </div>

        <div class="episode-info">
          <div class="episode-header-row">
            <span class="episode-title" title="${C}">${C}</span>
            <span class="episode-duration">${N||L}</span>
          </div>
          
          <div class="episode-overview-container">
            <div class="episode-overview ${T?"truncated":""}" data-full="${_}">
              ${_}
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
    `}).join(""),J(),r.querySelectorAll(".btn-toggle-overview").forEach(m=>{m.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation();const E=m.closest(".episode-overview-container"),C=E?E.querySelector(".episode-overview"):null;if(!C)return;const _=m.querySelector("span"),T=m.querySelector("i");C.classList.contains("truncated")?(C.classList.remove("truncated"),_&&(_.textContent="Daralt"),T&&T.setAttribute("data-lucide","chevron-up")):(C.classList.add("truncated"),_&&(_.textContent="Devamını Oku"),T&&T.setAttribute("data-lucide","chevron-down")),J()})}),f.querySelectorAll(".btn-mark-ep-watched").forEach(m=>{m.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation();const E=parseInt(m.getAttribute("data-season"),10),C=parseInt(m.getAttribute("data-episode"),10),_=m.closest(".episode-card"),I=Ol(e,E,C,{title:t,posterPath:a,backdropPath:o,type:p?"anime":"tv",isAnime:p}).completed;if(Q(I?`S${E} B${C} izlendi olarak işaretlendi!`:`S${E} B${C} izlendi işareti kaldırıldı.`,I?"success":"info"),I?(m.classList.add("watched"),m.style.background="#10b981",m.style.borderColor="#10b981",m.title="İzlendi işaretini kaldır"):(m.classList.remove("watched"),m.style.background="rgba(0,0,0,0.65)",m.style.borderColor="rgba(255,255,255,0.3)",m.title="İzlendi olarak işaretle"),_){const L=_.querySelector(".badge-watched-status");L&&(L.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',L.style.background="var(--accent-green)",L.style.color="#fff",L.style.display=I?"inline-flex":"none")}typeof d=="function"&&d(),J()})}),f.querySelectorAll(".btn-mark-ep-halfway").forEach(m=>{m.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation();const E=parseInt(m.getAttribute("data-season"),10),C=parseInt(m.getAttribute("data-episode"),10),_=m.closest(".episode-card");if(ja(e,E,C,1200,{title:t,posterPath:a,backdropPath:o,type:p?"anime":"tv",isAnime:p,duration:2700}),m.style.background="#f59e0b",m.style.borderColor="#f59e0b",_){const T=_.querySelector(".badge-watched-status");T&&(T.innerHTML='<i data-lucide="clock" style="width:12px; height:12px"></i> YARIDA (20:00)',T.style.background="rgba(245, 158, 11, 0.9)",T.style.color="#000",T.style.display="inline-flex")}Q(`S${E} B${C} 20. dakikada yarıda bırakıldı olarak işaretlendi!`,"info"),J()})}),f.querySelectorAll(".episode-card").forEach(m=>{const b=_=>{if(_&&_.target&&(_.target.closest(".btn-mark-ep-watched")||_.target.closest(".btn-mark-ep-halfway")||_.target.closest(".btn-toggle-overview")))return;_&&(_.preventDefault(),_.stopPropagation());const T=parseInt(m.getAttribute("data-season"),10),I=parseInt(m.getAttribute("data-episode"),10),L=m.getAttribute("data-title"),N=ii(e,T,I),O=N?N.currentTime:0;ri({type:p?"anime":"tv",isAnime:p,tmdbId:e,title:`${t} - S${T}E${I}: ${L}`,seriesTitle:t,originalTitle:s||t,season:T,episode:I,posterPath:a,backdropPath:o,currentTime:O,seasonsList:l,maxEpisodes:v.episodes?v.episodes.length:0})};m.addEventListener("click",b);const E=m.querySelector(".episode-thumb-wrap");E&&E.addEventListener("click",b);const C=m.querySelector(".btn-play-episode-trigger");C&&C.addEventListener("click",b)})}let or=null;async function yh(e,t="",i=""){Ii();const n=document.createElement("div");n.id="cast-explorer-modal-root",n.className="cast-explorer-backdrop",document.body.appendChild(n),or=n,n.innerHTML=`
    <div class="cast-explorer-dialog">
      <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
      </button>
      <div class="cast-explorer-loading">
        <div class="cast-explorer-spinner"></div>
        <span>${t||"Oyuncu"} bilgileri ve filmografisi yükleniyor...</span>
      </div>
    </div>
  `,J(n);const r=n.querySelector("#btn-close-cast-explorer");r&&(r.onclick=()=>Ii()),n.onclick=I=>{I.target===n&&Ii()};const a=I=>{I.key==="Escape"&&(Ii(),window.removeEventListener("keydown",a))};window.addEventListener("keydown",a);const o=await ou(e);if(!o){n.innerHTML=`
      <div class="cast-explorer-dialog">
        <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
          <i data-lucide="x" style="width: 20px; height: 20px;"></i>
        </button>
        <div class="cast-explorer-loading">
          <i data-lucide="alert-circle" style="width: 36px; height: 36px; color: #ef4444;"></i>
          <span>Oyuncu bilgileri alınamadı.</span>
        </div>
      </div>
    `,J(n);return}const s=o.name||t,l=o.profile_path?at(o.profile_path,Je.POSTER_MEDIUM):i||pr,d=o.birthday?o.birthday.substring(0,4):"",p=o.place_of_birth||"",h=o.known_for_department==="Acting"?"Oyuncu":o.known_for_department==="Directing"?"Yönetmen":o.known_for_department||"Sanatçı",f=o.biography&&o.biography.trim().length>20?o.biography:`${s}, sinema ve televizyon dünyasında yer aldığı yapımlarla tanınan başarılı bir sanatçıdır.`,v=o.combined_credits?.cast||[],y=o.combined_credits?.crew||[],w=[...v,...y],k=new Set,m=[];for(const I of w){if(!I||!I.id)continue;const L=`${I.media_type||"movie"}_${I.id}`;k.has(L)||(k.add(L),I.poster_path&&m.push(I))}m.sort((I,L)=>(L.popularity||0)-(I.popularity||0));const b=m.filter(I=>I.media_type==="movie"||!I.media_type&&I.title).length,E=m.filter(I=>I.media_type==="tv"||!I.media_type&&I.name).length;n.innerHTML=`
    <div class="cast-explorer-dialog">
      <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
      </button>

      <!-- Actor Hero Header -->
      <div class="cast-explorer-header">
        <div class="cast-explorer-avatar-box">
          <img src="${l}" alt="${s}" class="cast-explorer-avatar" onerror="this.onerror=null; this.src='${pr}';" />
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
        ${m.map(I=>Et(I)).join("")}
      </div>
    </div>
  `,J(n);const C=n.querySelector("#btn-close-cast-explorer");C&&(C.onclick=()=>Ii());const _=n.querySelector("#cast-explorer-grid");_&&(gt(_),_.addEventListener("click",()=>{setTimeout(()=>Ii(),150)}));const T=n.querySelectorAll(".cast-tab-btn");T.forEach(I=>{I.onclick=()=>{T.forEach(O=>O.classList.remove("active")),I.classList.add("active");const L=I.getAttribute("data-filter");let N=m;L==="movie"?N=m.filter(O=>O.media_type==="movie"||!O.media_type&&O.title):L==="tv"&&(N=m.filter(O=>O.media_type==="tv"||!O.media_type&&O.name)),_&&(_.innerHTML=N.length>0?N.map(O=>Et(O)).join(""):'<div class="cast-empty-state">Bu kategoride yapım bulunamadı.</div>',J(_))}})}function Ii(){if(or){try{or.remove()}catch{}or=null}}const vh="https://api.tvmaze.com",bh=5500,Xc=30*60*1e3,Zc="cinepulse_tvmaze_cache_v1",Tn=new Map;function wh(){try{const e=sessionStorage.getItem(Zc);if(!e)return;const t=JSON.parse(e);t&&typeof t=="object"&&Object.entries(t).forEach(([i,n])=>{n?.savedAt&&Date.now()-n.savedAt<Xc&&Tn.set(i,n)})}catch{}}function kh(){try{const e={};let t=0;for(const[i,n]of Tn.entries()){if(t++>=80)break;e[i]=n}sessionStorage.setItem(Zc,JSON.stringify(e))}catch{}}function Ks(e){const t=Tn.get(e);if(t){if(Date.now()-t.savedAt>Xc){Tn.delete(e);return}return t.data}}function Ws(e,t){Tn.set(e,{savedAt:Date.now(),data:t}),kh()}async function Lr(e){try{const t=await fetch(`${vh}${e}`,{headers:{Accept:"application/json"},signal:AbortSignal.timeout(bh)});return t.ok?await t.json():null}catch{return null}}function vl(e){return String(e||"").toLowerCase().replace(/[^a-z0-9çğıöşü ]/gi," ").replace(/\s+/g," ").trim()}function Qc(e,t){const i=vl(e),n=vl(t);return!i||!n?!1:i===n?!0:i.includes(n)||n.includes(i)}function bl(e){return e?{season:e.season??null,number:e.number??null,name:e.name||"",airdate:e.airdate||"",airstamp:e.airstamp||"",runtime:e.runtime||null}:null}function _h(e){switch(e){case"Running":return"Devam ediyor";case"Ended":return"Sonlandı";case"To Be Determined":return"Belirsiz";case"In Development":return"Yapım aşamasında";default:return e||""}}async function Sh(e){const t=`lookup:${e}`,i=Ks(t);if(i!==void 0)return i;const n=await Lr(`/lookup/shows?${e}`);return Ws(t,n||null),n||null}async function ed(e){if(!e)return null;const t=`show:${e}`,i=Ks(t);if(i!==void 0)return i;const n=await Lr(`/shows/${e}?embed[]=nextepisode&embed[]=previousepisode`),r=n?{tvmazeId:n.id,name:n.name||"",status:n.status||"",statusLabel:_h(n.status),premiered:n.premiered||"",officialSite:n.officialSite||"",thetvdbId:n.externals?.thetvdb??null,imdbId:n.externals?.imdb||"",nextEpisode:bl(n._embedded?.nextepisode),previousEpisode:bl(n._embedded?.previousepisode)}:null;return Ws(t,r),r}async function xh(e){const t=String(e||"").trim();if(!t)return null;const i=t.startsWith("tt")?t:`tt${t}`,r=(await Sh(`imdb=${encodeURIComponent(i)}`))?.id||null;return r?ed(r):null}function td(e,t){const i=parseInt(String(e?.premiered||"").substring(0,4),10),n=parseInt(String(t||""),10);return!n||!i?0:Math.abs(i-n)}function Eh(e,t,i){let n=null,r=1/0;for(const a of e){if(!a||!Qc(a.name,t))continue;const o=td(a,i);if(o>1)continue;const s=o*10+(a.status==="Running"?0:1);s<r&&(r=s,n=a)}return n}async function Th(e,t){const i=String(e||"").trim();if(i.length<2)return null;const n=`search:${i}:${t||""}`,r=Ks(n);if(r!==void 0)return r;let a=null;const o=await Lr(`/singlesearch/shows?q=${encodeURIComponent(i)}`);if(o&&Qc(o.name,i)&&td(o,t)<=1&&(a=o),!a){const l=await Lr(`/search/shows?q=${encodeURIComponent(i)}`),d=Array.isArray(l)?l.map(p=>p?.show).filter(Boolean):[];a=Eh(d,i,t)}const s=a?await ed(a.id):null;return Ws(n,s),s}async function Ah({imdbId:e,title:t,year:i}={}){let n=await xh(e);if(n||(n=await Th(t,i)),!n)return null;const r=n.nextEpisode;return{showName:n.name,statusLabel:n.statusLabel,officialSite:n.officialSite,nextEpisode:r,previousEpisode:n.previousEpisode,nextLabel:r?Ch(r):"",nextAirdateLabel:r?Ih(r.airdate,r.airstamp):""}}function Ch(e){if(!e)return"";const t=e.season!==null&&e.season!==void 0,i=e.number!==null&&e.number!==void 0,n=t&&e.season>=1900;return t&&!n&&i?`S${e.season} B${e.number}`:n&&e.name?e.name:i?`B${e.number}`:e.name||""}const Lh=["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];function Ih(e,t){const i=t?new Date(t):e?new Date(`${e}T21:00:00`):null;if(!i||Number.isNaN(i.getTime()))return e||"";const n=new Date,r=s=>new Date(s.getFullYear(),s.getMonth(),s.getDate()).getTime(),a=Math.round((r(i)-r(n))/864e5),o=t?`${String(i.getHours()).padStart(2,"0")}:${String(i.getMinutes()).padStart(2,"0")}`:"";return a<0?"Yayınlandı":a===0?o?`Bugün ${o}`:"Bugün":a===1?o?`Yarın ${o}`:"Yarın":a<=7?`${a} gün sonra`:`${i.getDate()} ${Lh[i.getMonth()]}`}wh();const wl="cinepulse.decision-room.autoplay";function Rh(e,t){try{const i=JSON.parse(sessionStorage.getItem(wl)||"null");return sessionStorage.removeItem(wl),i&&String(i.id)===String(t)&&i.type===e&&Date.now()-Number(i.createdAt||0)<15e3?i:null}catch{return null}}function $h(e){if(!e||e<=0)return"";const t=Math.floor(e/60),i=e%60;return t>0?`${t} sa ${i>0?i+" dk":""} (${e} dk)`:`${e} dk`}async function Mh(e="tv",t){const i=typeof e=="object"&&e!==null?e.type||"tv":e||"tv",n=typeof e=="object"&&e!==null?e.id:t;let r=i==="series"||i==="tv"||i==="anime"?"tv":i==="movie"?"movie":"tv",a=await wo(r,n);if(a||(r=r==="tv"?"movie":"tv",a=await wo(r,n)),!a)return{html:'<div class="container" style="padding: 10rem 0; text-align: center;"><h2>İçerik bulunamadı.</h2></div>',init:()=>{}};const o=!!(a.seasons&&a.seasons.length>0)||r==="tv",s=o?"tv":"movie",l=Us(a)||i==="anime"||r==="anime"||Fe(n);l&&Se(n);const d=a.title||a.name||"Detay",p=a.original_title||a.original_name||"",h=at(a.backdrop_path,Je.BACKDROP_ORIGINAL),f=at(a.poster_path,Je.POSTER_MEDIUM),v=a.vote_average?a.vote_average.toFixed(1):"8.5",y=(a.first_air_date||a.release_date||"").substring(0,4),w=a.overview&&a.overview.trim().length>15?a.overview:qe(a,s),k=a.genres||[],m=a.runtime?a.runtime*60:6600,b=Od(n),E=xs(n),C=s==="tv"?pa(n):null,_=s==="movie"?ii(n,1,1):null,T=s==="movie"?Sn(n,1,1):!1,I=s==="tv"?da(n,a.seasons||[]):!1,L=s==="movie"?T:I;let N=s==="movie"?"Filmi İzle":"1. Sezon 1. Bölümü İzle";if(s==="tv"&&C){const X=fi(C.currentTime);N=`Devam Et <span class="play-btn-subinfo">S${C.season} B${C.episode}${X?" • "+X:""}</span>`}else s==="movie"&&_&&_.currentTime>0&&(N=`Devam Et <span class="play-btn-subinfo">${fi(_.currentTime)}</span>`);const O=a.credits?.crew?a.credits.crew.filter(X=>X.job==="Director").map(X=>X.name):[],K=a.created_by?a.created_by.map(X=>X.name):[],F=O.length>0?O.slice(0,2).join(", "):K.length>0?K.slice(0,2).join(", "):"",z=(parseFloat(v)/2).toFixed(1),P=Math.floor(z),Y=z%1>=.4,ne="★".repeat(Math.min(5,P))+(Y&&P<5?"½":""),ee=a.credits&&a.credits.cast?a.credits.cast.slice(0,10):[];let re=null,H=!1;s==="tv"&&a.seasons&&(re=await mh({tvId:n,seriesTitle:d,originalTitle:p,seriesOverview:w,seasons:a.seasons,posterPath:a.poster_path,backdropPath:a.backdrop_path,isAnime:l,spoilerFree:H}));const se=a.recommendations?a.recommendations.results.slice(0,6):[],G=s==="movie"?T?"Film İzlendi":"İzlendi Olarak İşaretle":I?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle",V=a.runtime?`
    <span class="badge" style="background: rgba(245, 158, 11, 0.18); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); font-weight: 700; display: inline-flex; align-items: center; gap: 0.35rem;">
      <i data-lucide="clock" style="width:13px; height:13px"></i>
      <span>${$h(a.runtime)}</span>
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
              <img class="detail-poster-img" src="${f}" alt="${d}" onerror="this.onerror=null; this.src='${xt}';" />
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
                  <span style="letter-spacing: 0.05em; font-weight: 800;">${ne}</span> ${z}
                </span>
                <span class="badge">${y}</span>
                ${V}
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
                ${F?`
                  <span class="detail-director-pill">
                    <strong style="color: var(--primary);">${s==="tv"?"YARATICI":"YÖNETMEN"}:</strong> ${F}
                  </span>
                `:""}
              </div>

              <!-- Genres -->
              <div class="detail-genre-row">
                ${k.map(X=>`<span class="detail-genre-chip">${X.name}</span>`).join("")}
              </div>

              <!-- Storyline -->
              <div class="detail-storyline-wrapper">
                <p class="detail-storyline truncated" id="detail-storyline-text">${w}</p>
                ${w.length>120?'<button class="btn-storyline-expand" id="btn-expand-storyline"><span>Devamını Oku</span><i data-lucide="chevron-down" style="width:14px;height:14px"></i></button>':""}
              </div>

              ${s==="tv"?'<label class="spoiler-discovery-toggle"><input id="detail-spoiler-free-toggle" type="checkbox" /><span><i data-lucide="shield-check"></i><b>Spoilersız keşfet</b><small>İzleme ilerlemenin sonrasındaki bölüm başlıkları, görselleri ve özetleri gizlenir.</small></span></label>':""}

              <!-- Oyuncular & Sanatçılar (Letterboxd & Pentagram Style Carousel with PC Mouse Scroll & Nav Buttons) -->
              ${ee.length>0?`
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
                    ${ee.map(X=>{const $=X.profile_path?at(X.profile_path,Je.POSTER_SMALL):pr,M=X.character?X.character.split("/")[0].trim():"";return`
                        <div class="detail-actor-pill" data-person-id="${X.id}" data-person-name="${X.name}" title="${X.name}${M?" ("+M+")":""} • Filmografiyi Gör" style="cursor: pointer;">
                          <img src="${$}" alt="${X.name}" class="detail-actor-avatar" onerror="this.onerror=null; this.src='${pr}';" />
                          <div style="display: flex; flex-direction: column; min-width: 0;">
                            <span class="detail-actor-name">${X.name}</span>
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
                    <span>${G}</span>
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

          ${se.length>0?`
            <div style="margin-top: 4rem;">
              <h2 class="section-title" style="margin-bottom: 1.5rem;">
                <i data-lucide="thumbs-up"></i> Benzer Önerilen Yapımlar
              </h2>
              <div class="media-grid">
                ${se.map(X=>Et(X)).join("")}
              </div>
            </div>
          `:""}
        </div>
      </section>
    </div>
  `,init:X=>{if(!X)return;let $=Rh(s,n);const M=X.querySelector("#btn-detail-back");M&&M.addEventListener("click",oe=>{oe.preventDefault(),window.history.length>1?window.history.back():window.location.hash="#home"}),re&&re.init(X);const B=X.querySelector("#detail-spoiler-free-toggle");B&&(B.checked=H,B.addEventListener("change",()=>{H=B.checked,re?.setSpoilerSafe(H),Q(H?"Spoilersız keşif açıldı. Sonraki bölüm detayları gizlendi.":"Spoilersız keşif kapatıldı.","info")}));const W=X.querySelector("#btn-play-movie"),ie=async()=>{if(!W||W.disabled)return;W.disabled=!0;const oe=W.innerHTML;W.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px;fill:currentColor"></i> <span>Yükleniyor...</span>',J();try{const g=ii(n,1,1);await ri({type:l?"anime":"movie",isAnime:l,tmdbId:n,title:d,seriesTitle:d,originalTitle:p,posterPath:a.poster_path,backdropPath:a.backdrop_path,duration:m,currentTime:g?g.currentTime:0,roomSync:$?{roomCode:$.roomCode,mediaId:n,type:s,season:1,episode:1,initialSync:$.initialSync||null}:null})}catch{Q("Film açılırken hata oluştu, lütfen tekrar deneyin.","error")}finally{W.disabled=!1,W.innerHTML=oe,J()}};W&&W.addEventListener("click",ie);const x=X.querySelector("#btn-resume-series"),A=async()=>{if(!x||x.disabled)return;x.disabled=!0;const oe=x.innerHTML;x.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px;fill:currentColor"></i> <span>Yükleniyor...</span>',J();try{const g=$;$=null;const c=pa(n),u=g?.season||(c?c.season:1),S=g?.episode||(c?c.episode:1),R=g?0:c?c.currentTime:0;await ri({type:l?"anime":"tv",isAnime:l,tmdbId:n,title:`${d} - S${u}E${S}`,seriesTitle:d,originalTitle:p,season:u,episode:S,posterPath:a.poster_path,backdropPath:a.backdrop_path,currentTime:R,seasonsList:a.seasons||[],roomSync:g?{roomCode:g.roomCode,mediaId:n,type:s,season:u,episode:S,initialSync:g.initialSync||null}:null})}catch{Q("İçerik açılırken hata oluştu, lütfen tekrar deneyin.","error")}finally{x.disabled=!1,x.innerHTML=oe,J()}};x&&x.addEventListener("click",oe=>{oe.preventDefault(),A()}),$&&window.setTimeout(()=>{s==="movie"?ie():A()},0);const q=X.querySelector("#btn-watch-trailer");q&&q.addEventListener("click",async()=>{q.disabled=!0;const oe=q.innerHTML;q.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px"></i> <span>Yükleniyor...</span>',J();try{const g=await xn(s,n,d);g?Wc({title:d,trailerInfo:g,mediaId:n,mediaType:l?"anime":s}):Q("Bu yapım için resmi fragman bulunamadı.","info")}catch{Q("Fragman yüklenirken bir hata oluştu.","error")}finally{q.disabled=!1,q.innerHTML=oe,J()}});const te=X.querySelector("#btn-toggle-fav");te&&te.addEventListener("click",()=>{const oe=Nd({...a,type:l?"anime":s,isAnime:l,media_type:s});Q(oe?"Favorilere eklendi!":"Favorilerden çıkarıldı.",oe?"success":"info");const g=te.querySelector("i"),c=te.querySelector("span");g&&c&&(g.style.fill=oe?"var(--primary)":"none",g.style.color=oe?"var(--primary)":"currentColor",c.textContent=oe?"Favorilerimde":"Favorilere Ekle")});const be=X.querySelector("#btn-toggle-watchlist");be&&be.addEventListener("click",()=>{const oe=Hl({...a,type:l?"anime":s,isAnime:l,media_type:s});Q(oe?"İzleme listesine eklendi!":"İzleme listesinden çıkarıldı.",oe?"success":"info");const g=be.querySelector("i"),c=be.querySelector("span");g&&c&&(g.setAttribute("data-lucide",oe?"check":"plus"),J(),c.textContent=oe?"Listemde":"İzleme Listeme Ekle")});const le=X.querySelector("#btn-toggle-watched-detail");le&&le.addEventListener("click",oe=>{if(oe.preventDefault(),s==="movie"){const c=Ol(n,1,1,{title:d,posterPath:a.poster_path,backdropPath:a.backdrop_path,type:"movie",duration:m}).completed;Q(c?"✓ Film izlendi olarak işaretlendi!":"Film izlendi işareti kaldırıldı.",c?"success":"info"),c?le.classList.add("btn-watched-active"):le.classList.remove("btn-watched-active"),le.innerHTML=`
              <i data-lucide="${c?"check-circle-2":"check"}"></i>
              <span>${c?"Film İzlendi":"İzlendi Olarak İşaretle"}</span>
            `,J()}else{const c=!da(n,a.seasons||[]);Bd(n,a.seasons||[],c,{title:d,posterPath:a.poster_path,backdropPath:a.backdrop_path,type:l?"anime":"tv",isAnime:l}),Q(c?"✓ Dizinin tüm bölümleri izlendi olarak işaretlendi!":"Tüm bölümler izlenmedi yapıldı.",c?"success":"info"),c?le.classList.add("btn-watched-active"):le.classList.remove("btn-watched-active"),le.innerHTML=`
              <i data-lucide="${c?"check-circle-2":"check"}"></i>
              <span>${c?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle"}</span>
            `,J(),X.querySelectorAll(".episode-card").forEach(S=>{const R=S.querySelector(".badge-watched-status"),D=S.querySelector(".btn-mark-ep-watched");R&&(R.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',R.style.background="var(--accent-green)",R.style.color="#fff",R.style.display=c?"inline-flex":"none"),D&&(c?(D.classList.add("watched"),D.style.background="#10b981",D.style.borderColor="#10b981"):(D.classList.remove("watched"),D.style.background="rgba(0,0,0,0.65)",D.style.borderColor="rgba(255,255,255,0.3)"))});const u=X.querySelector("#btn-mark-season-all");if(u){const S=u.querySelector("span"),R=u.querySelector("i");S&&(S.textContent=c?"Bu Sezon İzlendi":"Bu Sezonu İzlendi İşaretle"),R&&R.setAttribute("data-lucide",c?"check-circle-2":"check-check"),c?(u.style.background="rgba(16, 185, 129, 0.2)",u.style.borderColor="#10b981",u.style.color="#10b981"):(u.style.background="",u.style.borderColor="",u.style.color="")}J()}});const he=oe=>{if(oe&&oe.detail&&oe.detail.isProgressUpdate&&document.getElementById("player-modal"))return;const g=s==="movie"?Sn(n,1,1):!1,c=s==="tv"?da(n,a.seasons||[]):!1,u=s==="movie"?g:c;if(le){u?le.classList.add("btn-watched-active"):le.classList.remove("btn-watched-active");const D=s==="movie"?u?"Film İzlendi":"İzlendi Olarak İşaretle":u?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle";le.innerHTML=`
            <i data-lucide="${u?"check-circle-2":"check"}"></i>
            <span>${D}</span>
          `}const S=X.querySelector("#btn-play-movie");if(S&&s==="movie"){const D=ii(n,1,1);if(D&&D.currentTime>0&&!D.completed){const U=fi(D.currentTime);S.innerHTML=`<i data-lucide="play" style="fill:currentColor"></i> <span>Devam Et <span class="play-btn-subinfo">${U}</span></span>`}}const R=X.querySelector("#btn-resume-series");if(R&&s==="tv"){const D=pa(n);if(D){const U=fi(D.currentTime);R.innerHTML=`<i data-lucide="play" style="fill:currentColor"></i> <span>Devam Et <span class="play-btn-subinfo">S${D.season} B${D.episode}${U?" • "+U:""}</span></span>`}}J()};window.addEventListener("sineflix_data_changed",he);const Ze=X.querySelector("#btn-mark-halfway-detail");Ze&&Ze.addEventListener("click",oe=>{if(oe.preventDefault(),s==="movie"){const g=Math.round(m*.5),c=fi(g);ja(n,1,1,g,{title:d,posterPath:a.poster_path,backdropPath:a.backdrop_path,type:l?"anime":"movie",isAnime:l,duration:m}),Q(`⏳ Film ${c} dakikasında yarıda bırakıldı olarak işaretlendi!`,"info");const u=X.querySelector("#btn-play-movie span");u&&(u.textContent=`Kaldığın Yerden Devam Et (${c})`)}else{const g=C?C.season:1,c=C?C.episode:1;ja(n,g,c,1200,{title:d,posterPath:a.poster_path,backdropPath:a.backdrop_path,type:l?"anime":"tv",isAnime:l,duration:3e3}),Q(`⏳ S${g} B${c} 20. dakikada yarıda bırakıldı olarak işaretlendi!`,"info");const u=X.querySelector("#btn-resume-series span");u&&(u.textContent=`Kaldığın Yerden Devam Et (S${g} B${c} • 20:00)`)}});const Qe=X.querySelector("#btn-expand-storyline"),Ue=X.querySelector("#detail-storyline-text");Qe&&Ue&&Qe.addEventListener("click",()=>{const oe=!Ue.classList.contains("truncated");Ue.classList.toggle("truncated");const g=Qe.querySelector("span"),c=Qe.querySelector("i");g&&(g.textContent=oe?"Devamını Oku":"Daralt"),c&&(c.style.transform=oe?"rotate(0deg)":"rotate(180deg)")});const Re=X.querySelector("#detail-cast-rail"),De=X.querySelector("#btn-cast-prev"),Ne=X.querySelector("#btn-cast-next");if(Re){De&&De.addEventListener("click",S=>{S.preventDefault(),Re.scrollBy({left:-280,behavior:"smooth"})}),Ne&&Ne.addEventListener("click",S=>{S.preventDefault(),Re.scrollBy({left:280,behavior:"smooth"})}),Re.addEventListener("wheel",S=>{S.deltaY!==0&&(S.preventDefault(),Re.scrollLeft+=S.deltaY)},{passive:!1});let oe=!1,g=0,c=0;Re.addEventListener("mousedown",S=>{oe=!0,Re.classList.add("dragging"),g=S.pageX-Re.offsetLeft,c=Re.scrollLeft});const u=()=>{oe=!1,Re.classList.remove("dragging")};Re.addEventListener("mouseleave",u),Re.addEventListener("mouseup",u),Re.addEventListener("mousemove",S=>{if(!oe)return;S.preventDefault();const D=(S.pageX-Re.offsetLeft-g)*1.5;Re.scrollLeft=c-D}),Re.querySelectorAll(".detail-actor-pill").forEach(S=>{S.addEventListener("click",R=>{R.preventDefault();const D=S.getAttribute("data-person-id"),U=S.getAttribute("data-person-name");D&&yh(D,U)})})}const We=X.querySelector("#detail-next-episode-badge");We&&s==="tv"&&(async()=>{try{const oe=await Ah({imdbId:a.external_ids?.imdb_id,title:p||d,year:y});if(!oe?.nextEpisode||!We.isConnected)return;const g=oe.nextLabel||"",c=oe.nextAirdateLabel||"";if(!g&&!c||c==="Yayınlandı")return;const u=[g?`Yeni bölüm ${g}`:"Yeni bölüm",c].filter(Boolean).join(" • ");We.innerHTML=`<i data-lucide="calendar-clock" style="width:13px; height:13px"></i><span>${u}</span>`,We.title=`Sonraki bölüm: ${g||"-"}${oe.nextEpisode.name?" — "+oe.nextEpisode.name:""}${c?" • "+c:""} (Kaynak: TVmaze)`,We.style.display="inline-flex",J(We)}catch{}})();const je=X.querySelector(".media-grid");je&&gt(je)}}}const Ph="cinepulse_offline_db",Bh=1,rt="downloads",wi="cinepulse-offline-media-v1";let jn=null,wn=[];const Ir=new Map,Kn=new Map;async function Zr(e,t={},i=12e4){const n=new AbortController,r=t.signal,a=()=>n.abort();if(r?.aborted)throw new Error("İndirme iptal edildi");r?.addEventListener("abort",a,{once:!0});let o=!1;const s=setTimeout(()=>{o=!0,n.abort()},i);try{return await fetch(e,{...t,signal:n.signal})}catch(l){throw r?.aborted?new Error("İndirme iptal edildi"):o?new Error("Yayın kaynağı yanıt vermedi. İndirme durduruldu."):l}finally{clearTimeout(s),r?.removeEventListener("abort",a)}}function id(e){return Ji().then(t=>new Promise((i,n)=>{const r=t.transaction(rt,"readonly").objectStore(rt).get(e);r.onsuccess=()=>i(r.result||null),r.onerror=()=>n(r.error)}))}function Ys(e,t){return new Request(new URL(`/__cinepulse_offline__/${encodeURIComponent(e)}/${t}`,location.origin))}function Rr(e){return new Request(new URL(`/__cinepulse_offline_posters__/${encodeURIComponent(e)}`,location.origin))}function Dh(e){return!e||e==="null"||e==="undefined"||e.startsWith("data:")?"":/^https?:\/\//i.test(e)?e:e.startsWith("/api/")?st(e):`https://image.tmdb.org/t/p/w342/${e.replace(/^\/+/,"")}`}async function nd(e,t){if(!e||!t||t.startsWith("data:"))return!1;if(Kn.has(e))return Kn.get(e);const i=(async()=>{const n=await caches.open(wi),r=Rr(e);if(await n.match(r))return!0;const a=Dh(t);if(!a)return!1;const o=[a];a.startsWith(st("/"))||o.push(st(`/api/img_proxy?url=${encodeURIComponent(a)}`));for(const s of o)try{const l=await Zr(s,{cache:"no-store"},12e3),d=l.headers.get("content-type")||"";if(!l.ok||!d.startsWith("image/"))continue;return await n.put(r,l.clone()),!0}catch{}return!1})().finally(()=>Kn.delete(e));return Kn.set(e,i),i}async function zh(e,t=""){if(!e)return"";const i=Ir.get(e);if(i)return i;try{const n=await caches.open(wi);let r=await n.match(Rr(e));if(!r&&t&&navigator.onLine!==!1&&(await nd(e,t),r=await n.match(Rr(e))),!r)return"";const a=URL.createObjectURL(await r.blob());return Ir.set(e,a),a}catch{return""}}function Vs(e){if(!e||typeof e!="string")return{target:null,ref:null};try{const t=e.startsWith("http")?e:`http://localhost${e.startsWith("/")?"":"/"}${e}`,i=new URL(t),n=i.searchParams.get("url"),r=i.searchParams.get("ref");return{target:n||null,ref:r||null}}catch{return{target:null,ref:null}}}async function Oh(){try{const e=window.CinePulseNative?.getDeviceStorageInfo?.();if(e){const t=JSON.parse(e);if(Number.isFinite(t.total)&&Number.isFinite(t.free))return t}}catch{}try{const{quota:e=0,usage:t=0}=await navigator.storage.estimate();return{total:e,free:Math.max(0,e-t),isOriginQuota:!0}}catch{return{total:0,free:0,isOriginQuota:!0}}}function hs(e,t){const i=(e||"").trim();if(!i)return"";if(i.startsWith("/api/hls_proxy?"))return st(i);if(/^https?:\/\//i.test(i)&&i.includes("/api/hls_proxy?"))return i;try{const{target:n,ref:r}=Vs(t),a=new URL(i,n||t).href;return a.includes("/api/hls_proxy?")?a:st(`/api/hls_proxy?url=${encodeURIComponent(a)}${r?`&ref=${encodeURIComponent(r)}`:""}`)}catch{return i}}function rd(e){if(e.startsWith("/api/"))return st(e);if(!/^https?:\/\//i.test(e)||e.includes("/api/hls_proxy?"))return e;const{target:t,ref:i}=Vs(e),n=t||e,r=/\.m3u8(?:[?#]|$)/i.test(n);return st(`/api/hls_proxy?url=${encodeURIComponent(n)}${i?`&ref=${encodeURIComponent(i)}`:""}${r?"":"&download=1"}`)}function Vm(e,t="video.mp4"){if(!e)return!1;const i=typeof e=="string"&&e.startsWith("/api/")?st(e):e;try{const n=document.createElement("a");return n.href=i,n.setAttribute("download",t),n.setAttribute("target","_blank"),n.rel="noopener noreferrer",n.style.display="none",document.body.appendChild(n),n.click(),setTimeout(()=>{try{n.remove()}catch{}},1e3),!0}catch{try{return window.open(i,"_system"),!0}catch{return window.location.href=i,!0}}}async function Nh(e,t,i,n,r,a,o=null){if(o?.aborted)throw new Error("İndirme iptal edildi");let s=null;const{target:l,ref:d}=Vs(n),p=[],h=n.startsWith("/api/")?st(n):n;p.push(h),l&&/^https?:\/\//i.test(l)?p.push(st(`/api/hls_proxy?url=${encodeURIComponent(l)}${d?`&ref=${encodeURIComponent(d)}`:""}`)):n.includes("/api/hls_proxy")||p.push(rd(n));let f=null;for(let y=0;y<p.length;y++){if(o?.aborted)throw new Error("İndirme iptal edildi");const w=p[y];try{if(s=await Zr(w,{cache:"no-store",signal:o}),s&&s.ok)break}catch(k){if(k.name==="AbortError"||o?.aborted)throw new Error("İndirme iptal edildi");f=k,y<p.length-1&&await new Promise(m=>setTimeout(m,250*(y+1)))}}if(!s||!s.ok)throw new Error(`Bölüm parçası indirilemedi (HTTP ${s?.status||f?.message||"ağ hatası"})`);const v=await s.blob();return await e.put(Ys(t,i),new Response(v,{headers:{"Content-Type":s.headers.get("content-type")||"application/octet-stream"}})),a.loaded+=v.size,a.done+=1,r({percent:0,loaded:a.loaded,total:0,done:a.done,count:a.count,status:`${a.done}/${a.count} parça alındı`}),v.size}function kl(e,t){const i=e.split(/\r?\n/),n=[];for(let r=0;r<i.length;r+=1){if(!i[r].startsWith("#EXT-X-STREAM-INF:"))continue;const a=Number(i[r].match(/(?:AVERAGE-)?BANDWIDTH=(\d+)/)?.[1])||0,o=i.slice(r+1).find(s=>s&&!s.startsWith("#"));o&&n.push({bandwidth:a,url:hs(o.trim(),t)})}return n.length?(n.sort((r,a)=>Math.abs(r.bandwidth-22e5)-Math.abs(a.bandwidth-22e5)),n[0]?.url||null):null}async function Hh(e,t,i,n,r,a=null){let o=i.url||i.url,s=n,l=kl(s,o),d=0;for(;l&&d<3;){if(a?.aborted)throw new Error("İndirme iptal edildi");d++;const _=await Zr(l,{cache:"no-store",signal:a});if(!_.ok)throw new Error(`Bölüm listesi alınamadı (HTTP ${_.status})`);o=_.url||l,s=await _.text(),l=kl(s,o)}if(s.includes("#EXT-X-ENDLIST")||(s+=`
#EXT-X-ENDLIST
`),s.includes("#EXT-X-BYTERANGE"))throw new Error("Bu kaynak parçalı byte aralığı kullanıyor; başka bir yayın hattı seçin.");const p=s.split(/\r?\n/),h=[],f=[];let v=0;for(const _ of p){if(!_){f.push(_);continue}if(_.startsWith("#EXT-X-BYTERANGE"))throw new Error("Bu kaynak parçalı byte aralığı kullanıyor; başka bir yayın hattı seçin.");if(_.startsWith("#EXT-X-KEY:")||_.startsWith("#EXT-X-MAP:")){const T=_.match(/URI="([^"]+)"/);if(T){const I=v++,L=hs(T[1],o);h.push({index:I,url:L}),f.push(_.replace(T[0],`URI="__CP_OFFLINE_RESOURCE_${I}__"`))}else f.push(_);continue}if(_.startsWith("#"))f.push(_);else{const T=v++,I=hs(_.trim(),o);h.push({index:T,url:I}),f.push(`__CP_OFFLINE_RESOURCE_${T}__`)}}const y=h.length;if(!y)throw new Error("Bu bölümde indirilebilir video parçası bulunamadı.");const w={done:0,count:y,loaded:0},k=h.map(_=>_.index),m=4;let b=0;async function E(){for(;b<h.length;){if(a?.aborted)throw new Error("İndirme iptal edildi");const _=h[b++];if(!_)break;await Nh(e,t,_.index,_.url,r,w,a)}}const C=Array.from({length:Math.min(m,h.length)},()=>E());return await Promise.all(C),{playlistTemplate:f.join(`
`),resourceKeys:k,sizeBytes:w.loaded}}function Ji(){return jn?Promise.resolve(jn):new Promise((e,t)=>{const i=indexedDB.open(Ph,Bh);i.onupgradeneeded=n=>{const r=n.target.result;if(!r.objectStoreNames.contains(rt)){const a=r.createObjectStore(rt,{keyPath:"key"});a.createIndex("tmdbId","tmdbId",{unique:!1}),a.createIndex("downloadedAt","downloadedAt",{unique:!1})}},i.onsuccess=()=>{jn=i.result,e(jn)},i.onerror=()=>t(i.error)})}function Qr(e,t=null,i=null){return t!==null&&i!==null&&t!==void 0&&i!==void 0?`${e}_s${t}_e${i}`:String(e)}async function Gs(){try{const e=await Ji();return new Promise((t,i)=>{const a=e.transaction(rt,"readonly").objectStore(rt).getAll();a.onsuccess=()=>{const o=a.result||[];o.sort((s,l)=>(l.downloadedAt||0)-(s.downloadedAt||0)),t(o)},a.onerror=()=>i(a.error)})}catch{return[]}}async function Gm(e,t=null,i=null){try{const n=await Ji(),r=Qr(e,t,i);return new Promise(a=>{const l=n.transaction(rt,"readonly").objectStore(rt).get(r);l.onsuccess=()=>a(!!l.result),l.onerror=()=>a(!1)})}catch{return!1}}async function ad(e,t=null,i=null){try{const n=Qr(e,t,i),r=await id(n);if(!r||!("caches"in window))return null;const a=await caches.open(wi);if(r.mediaKind==="hls"){let s=r.playlistTemplate||"";for(const d of r.resourceKeys||[]){const p=await a.match(Ys(n,d));if(!p)throw new Error("İndirilen bölüm dosyası eksik.");const h=URL.createObjectURL(await p.blob());wn.push(h),s=s.replaceAll(`__CP_OFFLINE_RESOURCE_${d}__`,h)}const l=URL.createObjectURL(new Blob([s],{type:"application/vnd.apple.mpegurl"}));return wn.push(l),l}const o=await a.match(`/offline/${n}`);if(o){const s=URL.createObjectURL(await o.blob());return wn.push(s),s}return null}catch{return null}}function Jm(){wn.forEach(e=>{try{URL.revokeObjectURL(e)}catch{}}),wn=[]}async function Xm(e,t=()=>{},i=null){const{tmdbId:n,type:r,title:a,seriesTitle:o="",poster:s,backdrop:l,season:d,episode:p,streamUrl:h}=e;if(!h)throw new Error("İndirilecek medya bağlantısı bulunamadı.");if(!("caches"in window))throw new Error("Bu cihaz çevrimdışı depolamayı desteklemiyor.");if(typeof navigator<"u"&&navigator.storage&&navigator.storage.persist)try{await navigator.storage.persist()}catch{}const f=Qr(n,d,p),v=`/offline/${f}`,y=s?r==="tv"?`series_${n}`:`media_${f}`:"",w=y?nd(y,s).catch(()=>!1):Promise.resolve(!1),k=rd(h);t({percent:5,loaded:0,total:0,status:"Başlatılıyor..."});try{if(i?.aborted)throw new Error("İndirme iptal edildi");const m=await Zr(k,{cache:"no-store",signal:i});if(!m.ok)throw new Error(`İndirme başarısız (${m.status})`);const b=m.headers.get("content-type")||"";if(/mpegurl|vnd\.apple\.mpegurl/i.test(b)||/\.m3u8(?:[?#]|$)/i.test(h)||/\.m3u8(?:[?#]|$)/i.test(k)){const O=await m.text();if(!O.includes("#EXTM3U"))throw new Error("Kaynak HLS bölüm akışı döndürmedi.");const K=await caches.open(wi),F=await Hh(K,f,m,O,t,i);y&&(t({percent:99,loaded:F.sizeBytes,total:F.sizeBytes,status:"Afiş çevrimdışı kullanıma kaydediliyor…"}),await w);const z=await Ji(),P={key:f,tmdbId:String(n),type:r||"tv",title:a||"İsimsiz İçerik",seriesTitle:o||"",poster:s||"",backdrop:l||"",season:d!==null?Number(d):null,episode:p!==null?Number(p):null,sizeBytes:F.sizeBytes,downloadedAt:Date.now(),mediaKind:"hls",posterCacheKey:y,playlistTemplate:F.playlistTemplate,resourceKeys:F.resourceKeys};return await new Promise((Y,ne)=>{const ee=z.transaction(rt,"readwrite").objectStore(rt).put(P);ee.onsuccess=Y,ee.onerror=()=>ne(ee.error)}),t({percent:100,loaded:F.sizeBytes,total:F.sizeBytes,status:"Tamamlandı"}),window.dispatchEvent(new CustomEvent("cinepulse_offline_changed",{detail:{action:"add",key:f}})),!0}const C=m.headers.get("content-length"),_=C?parseInt(C,10):0;let T=0,I;if(m.body&&_>0){const O=m.body.getReader(),K=[];for(;;){if(i?.aborted)throw new Error("İndirme iptal edildi");const{done:F,value:z}=await O.read();if(F)break;K.push(z),T+=z.length;const P=Math.min(99,Math.round(T/_*100));if(t({percent:P,loaded:T,total:_,status:`%${P} indiriliyor...`}),T>=_){O.cancel().catch(()=>{});break}}I=new Blob(K,{type:m.headers.get("content-type")||"video/mp4"})}else if(m.body){const O=m.body.getReader(),K=[];for(;;){if(i?.aborted)throw new Error("İndirme iptal edildi");const{done:F,value:z}=await O.read();if(F)break;K.push(z),T+=z.length,t({percent:0,loaded:T,total:0,status:`${Ot(T)} alındı`})}I=new Blob(K,{type:m.headers.get("content-type")||"video/mp4"})}else I=await m.blob(),T=I.size,t({percent:0,loaded:T,total:0,status:`${Ot(T)} alındı`});if(i?.aborted)throw new Error("İndirme iptal edildi");t({percent:99,loaded:I.size,total:_||I.size,status:"İndirme tamamlandı, cihaz depolamasına yazılıyor…"}),"caches"in window&&await(await caches.open(wi)).put(v,new Response(I,{headers:{"Content-Type":I.type||"video/mp4","Content-Length":String(I.size)}})),t({percent:99,loaded:I.size,total:_||I.size,status:"Video kaydedildi, İndirilenler listesi güncelleniyor…"}),y&&(t({percent:99,loaded:I.size,total:_||I.size,status:"Afiş çevrimdışı kullanıma kaydediliyor…"}),await w);const L=await Ji(),N={key:f,tmdbId:String(n),type:r||"movie",title:a||"İsimsiz İçerik",seriesTitle:o||"",poster:s||"",backdrop:l||"",season:d!==null?Number(d):null,episode:p!==null?Number(p):null,sizeBytes:I.size,downloadedAt:Date.now(),mimeType:I.type||"video/mp4",mediaKind:"file",posterCacheKey:y};return await new Promise((O,K)=>{const P=L.transaction(rt,"readwrite").objectStore(rt).put(N);P.onsuccess=()=>O(),P.onerror=()=>K(P.error)}),t({percent:100,loaded:I.size,total:I.size,status:"Tamamlandı"}),window.dispatchEvent(new CustomEvent("cinepulse_offline_changed",{detail:{action:"add",key:f}})),!0}catch(m){try{const b=await caches.open(wi);await b.delete(v);const E=new URL(`/__cinepulse_offline__/${encodeURIComponent(f)}/`,location.origin).href;await Promise.all((await b.keys()).filter(C=>C.url.startsWith(E)).map(C=>b.delete(C)))}catch{}throw m}}async function ms(e,t=null,i=null){try{const n=Qr(e,t,i),r=await Ji(),a=await id(n);if(await new Promise((o,s)=>{const p=r.transaction(rt,"readwrite").objectStore(rt).delete(n);p.onsuccess=()=>o(),p.onerror=()=>s(p.error)}),"caches"in window){const o=await caches.open(wi);await o.delete(`/offline/${n}`);for(const s of a?.resourceKeys||[])await o.delete(Ys(n,s));if(a?.posterCacheKey&&!(await Gs()).some(l=>l.posterCacheKey===a.posterCacheKey)){await o.delete(Rr(a.posterCacheKey));const l=Ir.get(a.posterCacheKey);l&&URL.revokeObjectURL(l),Ir.delete(a.posterCacheKey)}}return window.dispatchEvent(new CustomEvent("cinepulse_offline_changed",{detail:{action:"delete",key:n}})),!0}catch{return!1}}function Ot(e){if(!e||e<=0)return"0 B";const t=1024,i=["B","KB","MB","GB","TB"],n=Math.floor(Math.log(e)/Math.log(t));return parseFloat((e/Math.pow(t,n)).toFixed(1))+" "+i[n]}const Pt=e=>String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]);function _l(e,t){const i=js(e);return`
    <div class="continue-card-wrapper library-card-item" 
         data-id="${e.id}" 
         data-season="${e.season||1}" 
         data-episode="${e.episode||1}" 
         data-tab="${t}"
         data-type="${i}"
         data-title="${encodeURIComponent(e.title||e.name||"İçerik")}"
         data-rating="${e.vote_average||e.voteAverage||e.rating||0}"
         data-year="${(e.release_date||e.first_air_date||e.year||"2024").substring(0,4)}">
      ${Et({...e,type:i},{isContinueSection:t==="continue"})}
      <button class="btn-delete-history btn-lib-delete" title="Listeden / Geçmişten Sil" aria-label="Sil">
        <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
      </button>
    </div>
  `}function qh(){Be();const t=po(),i=Qt(),n=ei(),r=uo(),a=Zn().length,o=fa().length;let s="continue";if(typeof window<"u"&&window.sessionStorage)try{const d=window.sessionStorage.getItem("cp_lib_active_tab");d&&["continue","completed","favorites","watchlist","all-episodes","downloads"].includes(d)&&(s=d)}catch{}return{html:`
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
          ${`<button class="lib-nav-tab ${s==="downloads"?"active":""}" data-tab="downloads">
            <i data-lucide="download"></i>
            <span>İndirilenler</span>
            <span class="lib-tab-badge" id="tab-count-downloads">0</span>
          </button>`}
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
        ${`<div class="tab-content ${s==="downloads"?"":"hidden"}" id="tab-downloads"></div>`}
      </div>
    </div>
  `,init:d=>{if(!d)return;let p=s,h="all",f="recent",v="";const y=d.querySelector("#lib-search-input"),w=d.querySelector("#lib-search-clear"),k=d.querySelector("#lib-sort-select"),m=d.querySelector("#lib-batch-clear-btn");let b=[];const E=async()=>{try{b=(await Gs()).map(G=>({id:G.tmdbId,title:G.seriesTitle||G.title.replace(/\s*[·-]\s*\d+\. Sezon\s+\d+\. Bölüm\s*$/i,""),episodeTitle:G.title,poster_path:G.poster,backdrop_path:G.backdrop,type:G.type,isSeries:G.type==="tv"||G.season!==null&&G.episode!==null,season:G.season??null,episode:G.episode??null,sizeBytes:G.sizeBytes,mediaKind:G.mediaKind||"file",isDownloaded:!0,key:G.key,downloadedAt:G.downloadedAt}));const se=d.querySelector("#tab-count-downloads");se&&(se.textContent=b.length),p==="downloads"&&I()}catch{}};E();const C=H=>H==="continue"?Zn():H==="completed"?fa():H==="favorites"?Qt():H==="watchlist"?ei():H==="all-episodes"?po():H==="downloads"?b:[],_=H=>H==="downloads"?`
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
          `:H==="continue"?`
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
          `:H==="completed"?`
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
          `:H==="favorites"?`
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
          `:H==="watchlist"?`
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
          `;let T=36;const I=()=>{const H=d.querySelector(`#tab-${p}`);if(!H)return;let G=C(p).filter(V=>{const ae=(V.title||V.name||"").toLowerCase(),fe=js(V);return(!v||ae.includes(v.toLowerCase()))&&(h==="all"||fe===h)});if(f==="rating-desc"?G.sort((V,ae)=>{const fe=parseFloat(V.vote_average||V.voteAverage||V.rating||0);return parseFloat(ae.vote_average||ae.voteAverage||ae.rating||0)-fe}):f==="title-asc"?G.sort((V,ae)=>{const fe=V.title||V.name||"",X=ae.title||ae.name||"";return fe.localeCompare(X,"tr")}):f==="year-desc"&&G.sort((V,ae)=>{const fe=parseInt((V.release_date||V.first_air_date||V.year||"0").substring(0,4),10);return parseInt((ae.release_date||ae.first_air_date||ae.year||"0").substring(0,4),10)-fe}),G.length===0)H.innerHTML=_(p);else if(p==="downloads"){const V=new Map,ae=[];G.forEach(B=>{if(B.season!==null&&B.episode!==null){const W=String(B.id);V.has(W)||V.set(W,[]),V.get(W).push(B)}else ae.push(B)});const X=[...[...V.values()].map(B=>({id:B[0].id,title:B[0].title,poster_path:B.find(W=>W.poster_path)?.poster_path||"",episodes:B.sort((W,ie)=>W.season-ie.season||W.episode-ie.episode),latest:Math.max(...B.map(W=>W.downloadedAt||0))})).map(B=>({...B,cardType:"series"})),...ae.map(B=>({...B,cardType:"movie"}))].sort((B,W)=>(W.latest||W.downloadedAt||0)-(B.latest||B.downloadedAt||0));H.innerHTML=`
            <div class="offline-download-list offline-download-poster-grid">
              ${X.map((B,W)=>B.cardType==="series"?`
                <article class="offline-series-card" data-series-index="${W}">
                  <button class="offline-series-toggle" type="button" aria-expanded="false">
                    <span class="offline-series-poster"><img src="${Pt(B.poster_path||xt)}" alt="${Pt(B.title)} afişi" loading="lazy"><span class="offline-series-ready"><i data-lucide="check"></i> İNDİRİLDİ</span></span>
                    <span class="offline-series-summary"><strong>${Pt(B.title)}</strong><small>${B.episodes.length} bölüm · ${new Set(B.episodes.map(ie=>ie.season)).size} sezon</small></span>
                    <i data-lucide="chevron-down" class="offline-series-chevron"></i>
                  </button>
                  <div class="offline-series-episodes" hidden>${[...new Set(B.episodes.map(ie=>ie.season))].sort((ie,x)=>ie-x).map(ie=>`<section class="offline-series-season"><h3>Sezon ${ie}</h3>${B.episodes.filter(x=>x.season===ie).map(x=>`<article class="offline-series-episode" data-offline-key="${Pt(x.key)}"><span class="offline-series-episode-no">${String(x.episode).padStart(2,"0")}</span><span class="offline-series-episode-copy"><strong>${Pt(x.episodeTitle||x.title)}</strong><small>Bölüm ${x.episode} · ${Ot(x.sizeBytes)}</small></span><button class="offline-play-btn" type="button" aria-label="Oynat"><i data-lucide="play"></i></button><button class="btn-delete-history btn-lib-delete" title="Cihazdan sil" aria-label="Cihazdan sil"><i data-lucide="trash-2"></i></button></article>`).join("")}</section>`).join("")}</div>
                </article>`:`
                <article class="offline-series-card offline-movie-card" data-offline-key="${Pt(B.key)}">
                  <span class="offline-series-poster"><img src="${Pt(B.poster_path||xt)}" alt="${Pt(B.title)} afişi" loading="lazy"><span class="offline-series-ready"><i data-lucide="check"></i> İNDİRİLDİ</span></span>
                  <span class="offline-series-summary"><strong>${Pt(B.title)}</strong><small>Film · ${Ot(B.sizeBytes)}</small></span>
                  <div class="offline-movie-actions"><button class="offline-play-btn" type="button"><i data-lucide="play"></i><span>Oynat</span></button><button class="btn-delete-history btn-lib-delete" title="Cihazdan sil" aria-label="Cihazdan sil"><i data-lucide="trash-2"></i></button></div>
                </article>`).join("")}
            </div>`;const $=async(B,W)=>{if(!W)return;const ie=B.querySelector(".offline-play-btn");ie.disabled=!0;try{const x=await ad(W.id,W.season,W.episode);if(!x)throw new Error("İndirilen video dosyası bulunamadı.");ri({type:W.type==="movie"?"movie":"tv",tmdbId:W.id,title:W.title,seriesTitle:W.title,season:W.season||1,episode:W.episode||1,posterPath:W.poster_path||"",backdropPath:W.backdrop_path||"",offlinePlaybackUrl:x,offlineMediaKind:W.mediaKind})}catch(x){Q(x?.message||"İndirilen içerik açılamadı.","error")}finally{ie.disabled=!1}},M=async B=>{if(!B||!window.confirm(`“${B.title}” indirilenlerden silinsin mi?`))return;await ms(B.id,B.season,B.episode),b=b.filter(ie=>String(ie.key)!==String(B.key));const W=d.querySelector("#tab-count-downloads");W&&(W.textContent=String(b.length)),I(),Q("İndirilen içerik cihazdan silindi.","success")};H.querySelectorAll(".offline-series-card:not(.offline-movie-card)").forEach((B,W)=>{const ie=X.filter(q=>q.cardType==="series")[W],x=B.querySelector(".offline-series-toggle"),A=B.querySelector(".offline-series-episodes");x.addEventListener("click",()=>{const q=x.getAttribute("aria-expanded")!=="true";x.setAttribute("aria-expanded",String(q)),A.hidden=!q}),B.querySelectorAll(".offline-series-episode").forEach(q=>{const te=ie.episodes.find(be=>String(be.key)===q.dataset.offlineKey);q.querySelector(".offline-play-btn").addEventListener("click",()=>$(q,te)),q.querySelector(".btn-lib-delete").addEventListener("click",()=>M(te))})}),H.querySelectorAll(".offline-movie-card").forEach(B=>{const W=ae.find(ie=>String(ie.key)===B.dataset.offlineKey);B.querySelector(".offline-play-btn").addEventListener("click",()=>$(B,W)),B.querySelector(".btn-lib-delete").addEventListener("click",()=>M(W))}),J(H);return}else{const V=G.slice(0,T),ae=G.length>T;H.innerHTML=`
            <div class="media-grid" id="grid-${p}">
              ${V.map(B=>_l(B,p)).join("")}
            </div>
            ${ae?`
              <div class="lib-load-more-wrap" style="text-align: center; margin: 2rem 0 1rem;">
                <button id="btn-lib-load-more" class="btn-secondary" style="padding: 0.6rem 1.8rem; border-radius: var(--radius-full); font-size: 0.88rem;">
                  <span>Daha Fazla Göster (${G.length-T} içerik daha)</span>
                </button>
                <div class="lib-scroll-sentinel" style="height: 1px; margin-top: 1rem;"></div>
              </div>
            `:""}
          `;const fe=H.querySelector(`#grid-${p}`),X=()=>{const B=fe.querySelectorAll(".library-card-item").length;if(B>=G.length){const q=H.querySelector(".lib-load-more-wrap");q&&q.remove();return}const W=G.slice(B,B+36);T=B+W.length;const ie=W.map(q=>_l(q,p)).join("");fe.insertAdjacentHTML("beforeend",ie);const x=G.length-T,A=H.querySelector(".lib-load-more-wrap");if(x>0){const q=A?.querySelector("#btn-lib-load-more span");q&&(q.textContent=`Daha Fazla Göster (${x} içerik daha)`)}else A&&A.remove();gl(W),K(fe),J(fe),gt(fe),Gi(fe)},$=H.querySelector("#btn-lib-load-more");$&&$.addEventListener("click",X);const M=H.querySelector(".lib-scroll-sentinel");M&&"IntersectionObserver"in window&&new IntersectionObserver(W=>{W.some(ie=>ie.isIntersecting)&&X()},{rootMargin:"400px 0px"}).observe(M),K(H),gl(V),gt(H),Gi(H)}if(m)if(p==="completed"||p==="all-episodes"||p==="continue"){m.classList.remove("hidden");const V=m.querySelector("span");V&&(V.textContent="Temizle"),p==="completed"?m.title="Tamamlananlar listesini temizle":p==="continue"?m.title="İzlemeye devam et listesini temizle":m.title="Bölüm izleme geçmişini temizle"}else m.classList.add("hidden");J()},L=()=>{T=36,I()},N=d.querySelectorAll("#library-tabs .lib-nav-tab");N.forEach(H=>{H.addEventListener("click",se=>{se.preventDefault();const G=H.getAttribute("data-tab");if(p===G)return;if(N.forEach(ae=>ae.classList.remove("active")),H.classList.add("active"),p=G,typeof window<"u"&&window.sessionStorage)try{window.sessionStorage.setItem("cp_lib_active_tab",G)}catch{}d.querySelectorAll(".tab-content").forEach(ae=>ae.classList.add("hidden"));const V=d.querySelector(`#tab-${p}`);V&&V.classList.remove("hidden"),T=36,I()})});const O=()=>{const H=uo(),se=d.querySelector("#stat-total-watch")||d.querySelector("#stat-total-time"),G=d.querySelector("#stat-eps-count")||d.querySelector("#stat-episodes-count"),V=d.querySelector("#stat-movies-count"),ae=d.querySelector("#stat-favs-count");se&&(se.textContent=H.formattedTotal||H.formattedTotalTime||"0 dk"),G&&(G.textContent=`${H.totalEpisodes??H.episodesCount??0} Bölüm`),V&&(V.textContent=`${H.totalMovies??H.moviesCount??0} Film`),ae&&(ae.textContent=`${Qt().length+ei().length} Yapım`);const fe=d.querySelector("#tab-count-continue"),X=d.querySelector("#tab-count-completed"),$=d.querySelector("#tab-count-favorites"),M=d.querySelector("#tab-count-watchlist"),B=d.querySelector("#tab-count-all-episodes");fe&&(fe.textContent=Zn().length),X&&(X.textContent=fa().length),$&&($.textContent=Qt().length),M&&(M.textContent=ei().length),B&&(B.textContent=Be().length)},K=H=>{H&&H.querySelectorAll(".btn-lib-delete").forEach(se=>{se.addEventListener("click",G=>{G.stopPropagation();const V=se.closest(".library-card-item");if(!V)return;const ae=V.getAttribute("data-id"),fe=parseInt(V.getAttribute("data-season")||"1",10),X=parseInt(V.getAttribute("data-episode")||"1",10),$=V.getAttribute("data-tab"),M=decodeURIComponent(V.getAttribute("data-title")||"İçerik");let B=`"${M}" kaydını silmek istediğinize emin misiniz?`;if($==="all-episodes"?B=`"${M}" (Sezon ${fe}, Bölüm ${X}) izleme geçmişinizden silinsin mi?`:$==="continue"?B=`"${M}" devam et listesinden kaldırılsın mı?`:$==="completed"?B=`"${M}" tamamlananlar geçmişinden silinsin mi?`:$==="favorites"?B=`"${M}" favorilerinizden kaldırılsın mı?`:$==="watchlist"?B=`"${M}" izleme listenizden kaldırılsın mı?`:$==="downloads"&&(B=`"${M}" indirilmiş içerik cihazınızdan silinsin mi?`),window.confirm(B)){if($==="all-episodes")Ud(ae,fe,X);else if($==="continue"||$==="completed")Ua(ae);else if($==="favorites")Hd(ae);else if($==="watchlist")qd(ae);else if($==="downloads"){const W=b.find(ie=>String(ie.id)===String(ae)&&(ie.season||1)===fe&&(ie.episode||1)===X);ms(ae,W?.season??null,W?.episode??null),b=b.filter(ie=>!(ie.id===ae&&ie.season===fe&&ie.episode===X))}Q("✓ Kayıt başarıyla silindi.","success"),V.style.transition="all 0.28s ease-out",V.style.transform="scale(0.85)",V.style.opacity="0",setTimeout(()=>{V.remove(),O()},300)}})})};y&&y.addEventListener("input",H=>{v=H.target.value.trim(),w&&(w.style.display=v?"block":"none"),L()}),w&&w.addEventListener("click",()=>{y&&(y.value="",v="",w.style.display="none",L(),y.focus())});const F=d.querySelectorAll("#lib-type-filters .lib-segment-btn");F.forEach(H=>{H.addEventListener("click",()=>{F.forEach(se=>se.classList.remove("active")),H.classList.add("active"),h=H.getAttribute("data-filter")||"all",L()})}),k&&k.addEventListener("change",H=>{f=H.target.value,L()}),m&&m.addEventListener("click",()=>{let H="Bu listedeki tüm kayıtları silmek istediğinize emin misiniz?";p==="completed"?H="Tamamlananlar listesindeki tüm kayıtlar temizlensin mi?":p==="continue"?H="İzlemeye devam et listesindeki tüm yarım kalanlar temizlensin mi?":p==="all-episodes"&&(H="Tüm bölüm izleme geçmişiniz sıfırlansın mı?"),window.confirm(H)&&(p==="completed"||p==="continue"?lo():p==="all-episodes"&&Fd(),Q("✓ Liste başarıyla temizlendi.","success"),O(),I())});const z=d.querySelector("#lib-export-btn");z&&z.addEventListener("click",()=>Fl());const P=d.querySelector("#lib-import-btn"),Y=d.querySelector("#lib-file-input");P&&Y&&(P.addEventListener("click",()=>Y.click()),Y.addEventListener("change",H=>{if(H.target.files&&H.target.files.length>0){const se=H.target.files[0],G=new FileReader;G.onload=V=>{const ae=Ul(V.target.result,"merge");ae.success?(Br(),O(),I(),gt(d),J(),Q(`✓ Yedek başarıyla yüklendi! (${ae.countHistory} izleme, ${ae.countFavs} favori aktarıldı)`,"success")):Q(`Yükleme hatası: ${ae.message||ae.error}`,"error")},G.onerror=()=>Q("Dosya okunamadı.","error"),G.readAsText(se)}}));const ne=d.querySelector("#lib-data-modal-btn");ne&&ne.addEventListener("click",()=>Ql()),I(),gt(d),J(),$d().then(()=>{O(),I()}).catch(()=>{});const ee=H=>{H&&H.detail&&H.detail.isProgressUpdate&&document.getElementById("player-modal")||(O(),I())};window.addEventListener("sineflix_data_changed",ee),window.addEventListener("cinepulse_data_changed",ee);const re=()=>E();window.addEventListener("cinepulse_offline_changed",re)}}}const Tt=e=>String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),Fh=(e,t)=>Number(e.season)-Number(t.season)||Number(e.episode)-Number(t.episode);function Uh(){return{html:`
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
        <div class="downloads-list-heading"><h2>Kaydedilen diziler ve filmler</h2><span id="downloads-total">0 içerik</span></div>
        <div class="downloads-list" id="downloads-list"><div class="downloads-loading"><i data-lucide="loader-circle"></i><span>İndirilenler yükleniyor…</span></div></div>
      </section>`,init:e=>{const t=e.querySelector("#downloads-page"),i=t?.querySelector("#downloads-list");if(!t||!i)return;const n=async()=>{try{const{total:s=0,free:l=0,isOriginQuota:d=!1}=await Oh(),p=Math.max(0,s-l),h=s?Math.min(100,Math.round(p/s*100)):0;t.querySelector("#downloads-storage-text").textContent=s?`${Ot(l)} boş · ${Ot(s)} toplam${d?" (uygulama alanı)":""}`:"Depolama bilgisi alınamadı",t.querySelector("#downloads-storage-fill").style.width=`${h}%`}catch{t.querySelector("#downloads-storage-text").textContent="Depolama bilgisi alınamadı"}},r=async(s,l)=>{l.disabled=!0;try{const d=await ad(s.tmdbId,s.season,s.episode);if(!d)throw new Error("İndirilen video bulunamadı.");ri({type:s.type==="movie"?"movie":"tv",tmdbId:s.tmdbId,title:s.title,seriesTitle:s.title,season:s.season||1,episode:s.episode||1,posterPath:s.poster||"",backdropPath:s.backdrop||"",offlinePlaybackUrl:d,offlineMediaKind:s.mediaKind||"file"})}catch(d){Q(d?.message||"İndirilen içerik açılamadı.","error")}finally{l.disabled=!1}},a=async s=>{const l=s.season!==null?`${s.title} · S${s.season} B${s.episode}`:s.title;window.confirm(`“${l}” cihazdan silinsin mi?`)&&(await ms(s.tmdbId,s.season,s.episode),await o(),await n(),Q("İndirilen içerik silindi.","success"))},o=async()=>{const s=await Gs();if(!t.isConnected)return;const l=new Map,d=[];for(const f of s)if(f.season!==null&&f.episode!==null){const v=String(f.tmdbId);l.has(v)||l.set(v,[]),l.get(v).push(f)}else d.push(f);const h=[...[...l.values()].map(f=>({title:f[0].seriesTitle||f[0].title.replace(/\s*[·-]\s*\d+\. Sezon\s+\d+\. Bölüm\s*$/i,""),tmdbId:f[0].tmdbId,poster:f.find(v=>v.poster)?.poster||"",posterCacheKey:f.find(v=>v.posterCacheKey)?.posterCacheKey||`series_${f[0].tmdbId}`,backdrop:f.find(v=>v.backdrop)?.backdrop||"",episodes:f.sort(Fh),latest:Math.max(...f.map(v=>v.downloadedAt||0)),type:"series"})),...d.map(f=>({...f,type:"movie-card"}))].sort((f,v)=>(v.latest||v.downloadedAt||0)-(f.latest||f.downloadedAt||0));if(t.querySelector("#downloads-total").textContent=`${h.length} içerik · ${s.length} dosya`,!h.length){i.innerHTML='<div class="downloads-empty"><i data-lucide="cloud-download"></i><h3>Henüz içerik indirmedin</h3><p>Bir bölümü oynatıcıda açıp <b>İndir</b> düğmesine bas. İndirme ilerlemesini oradan görebilirsin.</p><a href="#home" class="downloads-browse-btn"><i data-lucide="compass"></i> İçeriklere göz at</a></div>',J(i);return}i.innerHTML=h.map((f,v)=>{const y=Tt(at(f.poster||"",Je.POSTER_MEDIUM)),w=Tt(f.poster||""),k=Tt(f.posterCacheKey||(f.type==="movie-card"?`media_${f.key}`:""));if(f.type==="series"){const m=f.episodes.reduce((E,C)=>E+(Number(C.sizeBytes)||0),0),b=[...new Set(f.episodes.map(E=>Number(E.season)))].sort((E,C)=>E-C);return`<article class="download-series-card" data-group="${v}">
              <button type="button" class="download-series-open" aria-expanded="false">
                <span class="download-series-poster"><img src="${y||xt}" data-offline-poster-key="${k}" data-offline-poster-source="${w}" onerror="this.onerror=null;this.src='${xt}'" alt="${Tt(f.title)} afişi" loading="lazy"><span class="download-ready"><i data-lucide="check"></i> İNDİRİLDİ</span></span>
                <span class="download-series-info"><strong>${Tt(f.title)}</strong><span>${f.episodes.length} bölüm · ${b.length} sezon</span><small>${Ot(m)} · İnternetsiz izlenebilir</small></span>
                <span class="download-series-chevron"><i data-lucide="chevron-down"></i></span>
              </button>
              <div class="download-episodes" hidden>${b.map(E=>{const C=f.episodes.filter(_=>Number(_.season)===E);return`<details class="download-season"><summary>Sezon ${E}<small>${C.length} indirilen bölüm</small></summary><div class="download-season-list">${C.map(_=>`<article class="download-episode-row" data-item-key="${Tt(_.key)}"><span class="download-episode-number">${String(_.episode).padStart(2,"0")}</span><span class="download-episode-info"><strong>${Tt(_.title)}</strong><small>Bölüm ${_.episode} · ${Ot(_.sizeBytes)} · ${new Date(_.downloadedAt||Date.now()).toLocaleDateString("tr-TR")}</small></span><button class="download-episode-play" type="button" aria-label="Bölüm ${_.episode} oynat"><i data-lucide="play"></i></button><button class="download-episode-delete" type="button" aria-label="Bölüm ${_.episode} sil"><i data-lucide="trash-2"></i></button></article>`).join("")}</div></details>`}).join("")}</div>
            </article>`}return`<article class="download-movie-card" data-item-key="${Tt(f.key)}">
            <span class="download-series-poster"><img src="${y||xt}" data-offline-poster-key="${k}" data-offline-poster-source="${w}" onerror="this.onerror=null;this.src='${xt}'" alt="${Tt(f.title)} afişi" loading="lazy"><span class="download-ready"><i data-lucide="check"></i> İNDİRİLDİ</span></span>
            <div class="download-series-info"><strong>${Tt(f.title)}</strong><span>Film</span><small>${Ot(f.sizeBytes)} · İnternetsiz izlenebilir</small></div>
            <div class="download-movie-actions"><button class="download-movie-play" type="button"><i data-lucide="play"></i> Oynat</button><button class="download-episode-delete" type="button" aria-label="Filmi sil"><i data-lucide="trash-2"></i></button></div>
          </article>`}).join(""),J(i),i.querySelectorAll("img[data-offline-poster-key]").forEach(async f=>{const v=await zh(f.dataset.offlinePosterKey,f.dataset.offlinePosterSource||"");v&&f.isConnected&&(f.onerror=null,f.src=v)}),i.querySelectorAll(".download-series-card").forEach((f,v)=>{const y=h.filter(m=>m.type==="series")[v],w=f.querySelector(".download-series-open"),k=f.querySelector(".download-episodes");w.addEventListener("click",()=>{const m=w.getAttribute("aria-expanded")!=="true";m&&i.querySelectorAll('.download-series-open[aria-expanded="true"]').forEach(b=>{b!==w&&(b.setAttribute("aria-expanded","false"),b.closest(".download-series-card")?.querySelector(".download-episodes")?.setAttribute("hidden",""))}),w.setAttribute("aria-expanded",String(m)),k.hidden=!m}),f.querySelectorAll(".download-episode-row").forEach((m,b)=>{const E=y.episodes.find(C=>String(C.key)===m.dataset.itemKey);m.querySelector(".download-episode-play").addEventListener("click",C=>r(E,C.currentTarget)),m.querySelector(".download-episode-delete").addEventListener("click",()=>a(E))})}),i.querySelectorAll(".download-movie-card").forEach(f=>{const v=d.find(y=>String(y.key)===f.dataset.itemKey);f.querySelector(".download-movie-play").addEventListener("click",y=>r(v,y.currentTarget)),f.querySelector(".download-episode-delete").addEventListener("click",()=>a(v))})};n(),o(),window.addEventListener("cinepulse_offline_changed",()=>{o(),n()}),J(t)}}}const Te={currentType:"tv",currentGenreId:null,currentSortBy:"popularity.desc",currentMinRating:0,currentPlatform:null,currentYearRange:"all",currentPage:1,allItems:[],isExhausted:!1};async function jh(e="tv"){e&&e!==Te.currentType&&Te.allItems.length===0&&(Te.currentType=e);let t=Te.currentType,i=Te.currentGenreId,n=Te.currentSortBy,r=Te.currentMinRating,a=Te.currentPlatform,o=Te.currentYearRange,s=!1;const l=[{id:null,name:"Tüm Türler"},{id:bt.MYSTERY,name:"🩸 Korku & Gerilim"},{id:bt.ACTION_ADVENTURE,name:"💥 Aksiyon & Macera"},{id:bt.SCI_FI_FANTASY,name:"🚀 Bilim Kurgu & Fantastik"},{id:bt.DRAMA,name:"🎭 Dram"},{id:bt.COMEDY,name:"😂 Komedi"},{id:bt.CRIME,name:"🕵️ Suç & Polisiye"},{id:bt.ANIMATION,name:"🎌 Animasyon & Anime"},{id:bt.DOCUMENTARY,name:"🌍 Belgesel"},{id:bt.FAMILY,name:"👨‍👩‍👧‍👦 Aile & Gençlik"},{id:bt.WAR_POLITICS,name:"⚔️ Savaş & Politika"},{id:bt.WESTERN,name:"🤠 Western"}],d=[{id:null,name:"Tüm Türler"},{id:Ge.HORROR,name:"🩸 Korku"},{id:Ge.THRILLER,name:"⚡ Gerilim"},{id:Ge.ACTION,name:"💥 Aksiyon"},{id:Ge.ADVENTURE,name:"🗺️ Macera"},{id:Ge.SCI_FI,name:"🚀 Bilim Kurgu"},{id:Ge.FANTASY,name:"🧙‍♂️ Fantastik"},{id:Ge.DRAMA,name:"🎭 Dram"},{id:Ge.COMEDY,name:"😂 Komedi"},{id:Ge.CRIME,name:"🕵️ Suç"},{id:Ge.ANIMATION,name:"🎌 Animasyon"},{id:Ge.MYSTERY,name:"🔍 Gizem"},{id:Ge.ROMANCE,name:"💖 Romantik"},{id:Ge.DOCUMENTARY,name:"🌍 Belgesel"},{id:Ge.HISTORY,name:"🏰 Tarih & Savaş"},{id:Ge.FAMILY,name:"👨‍👩‍👧‍👦 Aile"},{id:Ge.MUSIC,name:"🎵 Müzikal"},{id:Ge.WESTERN,name:"🤠 Western"}],p=()=>t==="movie"?d:l,h=Te.allItems.length>0,f=h?Te.allItems.map(y=>Et(y)).join(""):'<div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">İçerikler yükleniyor...</div>';return{html:`
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
  `,init:y=>{if(!y)return;const w=y.querySelector("#discover-type-tv"),k=y.querySelector("#discover-type-movie"),m=y.querySelector("#discover-type-anime"),b=y.querySelector("#discover-type-doc"),E=y.querySelector("#discover-platform-select"),C=y.querySelector("#discover-year-select"),_=y.querySelector("#discover-sort-select"),T=y.querySelector("#discover-rating-select"),I=y.querySelector("#discover-genre-bar"),L=y.querySelector("#discover-media-grid"),N=y.querySelector("#discover-sentinel"),O=N?N.querySelector(".spin-loader"):null;E&&E.addEventListener("change",()=>{a=E.value||null,Te.currentPlatform=a,P()}),C&&C.addEventListener("change",()=>{o=C.value||"all",Te.currentYearRange=o,P()});const K=()=>{const re=p();I.innerHTML=re.map(H=>`
          <button class="genre-pill-btn ${i===H.id?"active":""}" data-genre-id="${H.id||""}">
            ${H.name}
          </button>
        `).join(""),I.querySelectorAll(".genre-pill-btn").forEach(H=>{H.addEventListener("click",()=>{const se=H.dataset.genreId?parseInt(H.dataset.genreId,10):null;i!==se&&(i=se,I.querySelectorAll(".genre-pill-btn").forEach(G=>G.classList.remove("active")),H.classList.add("active"),P())})})};let F=0;const z=async re=>{const H=re||F;if(s||Te.isExhausted)return;s=!0,O&&(O.style.display="block");const se=Te.currentPage||1;try{const G=t==="anime"||t==="documentary"?"tv":t,V=t==="anime",ae=t==="documentary";let fe=n;n==="first_air_date.desc"&&G==="movie"&&(fe="primary_release_date.desc");let X=null,$=null;o==="2024-2026"?(X=2024,$=2026):o==="2020-2023"?(X=2020,$=2023):o==="2010-2019"?(X=2010,$=2019):o==="2000-2009"?(X=2e3,$=2009):o==="1990-1999"?(X=1990,$=1999):o==="before-1990"&&(X=1940,$=1989);const M=await Yl({type:G,genreId:i,page:se,sortBy:fe,minRating:r,isAnime:V,isDoc:ae,yearMin:X,yearMax:$,withNetworks:a});if(H!==F)return;if(O&&(O.style.display="none"),!M||M.length===0){se===1&&(L.innerHTML='<div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted); font-size: 1.05rem;">Bu filtre kriterlerine uygun içerik bulunamadı.</div>'),Te.isExhausted=!0;return}Te.allItems=[...Te.allItems,...M],Te.currentType=t,Te.currentGenreId=i,Te.currentSortBy=n,Te.currentMinRating=r;const B=M.map(W=>Et(W)).join("");se===1?L.innerHTML=B:L.insertAdjacentHTML("beforeend",B),J(),gt(L),Te.currentPage=se+1}catch{if(H!==F)return;O&&(O.style.display="none"),se===1&&(!Te.allItems||Te.allItems.length===0)&&(L.innerHTML=`
              <div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">
                <p style="margin-bottom: 0.75rem;">İçerikler getirilirken bir sorun oluştu.</p>
                <button id="btn-retry-discover" class="btn-secondary" style="padding: 0.5rem 1.2rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
                  <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
                  <span>Tekrar Dene</span>
                </button>
              </div>
            `,J(),L.querySelector("#btn-retry-discover")?.addEventListener("click",()=>{P()}))}finally{H===F&&(s=!1,O&&(O.style.display="none"))}},P=()=>{F++;const re=F;Te.currentPage=1,Te.allItems=[],Te.isExhausted=!1,s=!1,L.innerHTML=`
          <div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">
            <div class="spin-loader" style="width: 32px; height: 32px; border: 3px solid rgba(245,158,11,0.2); border-top-color: #f59e0b; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem;"></div>
            <div>İçerikler yükleniyor...</div>
          </div>
        `,O&&(O.style.display="none"),z(re)};K(),h||z();let Y=null;N&&"IntersectionObserver"in window&&(Y=new IntersectionObserver(re=>{re[0].isIntersecting&&z()},{rootMargin:"0px 0px 600px 0px"}),Y.observe(N));const ne=()=>{if(s||Te.isExhausted)return;const re=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||0,H=window.innerHeight,se=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);re+H>=se-700&&z()};window.addEventListener("scroll",ne,{passive:!0}),window.__discoverCleanup=()=>{Y?.disconnect(),window.removeEventListener("scroll",ne)};const ee=re=>{t!==re&&(t=re,i=null,[w,k,m,b].forEach(H=>H?.classList.remove("active")),re==="tv"&&w?.classList.add("active"),re==="movie"&&k?.classList.add("active"),re==="anime"&&m?.classList.add("active"),re==="documentary"&&b?.classList.add("active"),K(),P())};w&&w.addEventListener("click",()=>ee("tv")),k&&k.addEventListener("click",()=>ee("movie")),m&&m.addEventListener("click",()=>ee("anime")),b&&b.addEventListener("click",()=>ee("documentary")),_&&_.addEventListener("change",re=>{n=re.target.value,P()}),T&&T.addEventListener("change",re=>{r=parseFloat(re.target.value),P()})}}}const zi={};function Kh(e){const i=Rt()?`${e}_kids`:e;return(!zi[i]||zi[i].stale)&&(zi[i]={allItems:[],seenIds:new Set,nextPage:1,isExhausted:!1,stale:!1}),zi[i]}function Wh(e){if(Rt())switch(e){case"movie":return Va;case"anime":return Ga;case"documentary":return au;case"cartoon":return Wa;default:return Wa}switch(e){case"movie":return mr;case"anime":return gr;case"documentary":return yr;case"cartoon":return fr;default:return hr}}async function ln(e="tv"){const t=Rt(),i=t?`${e}_kids`:e;zi[i]&&(zi[i].stale=!0);const n=Kh(e),r=t?{tv:["Türkiye’de Popüler Çizgi ve Gençlik Dizileri","monitor-play"],movie:["🎈 Animasyon & Çocuk Filmleri","popcorn"],anime:["Türkiye’de Popüler Çocuk ve Genç Animeleri","cat"],documentary:["🐾 Doğa & Hayvan Belgeselleri","globe"]}:{tv:["Tüm Zamanların En Popüler Dizileri","monitor-play"],cartoon:["Çizgi Dizi Dünyası & Unutulmaz Klasikler","wand-2"],movie:["Tüm Zamanların En Popüler Filmleri","popcorn"],anime:["Türkiye’de En Popüler Animeler","cat"],documentary:["Tüm Zamanların En Çok İzlenen Belgeselleri","globe"]},[a,o]=r[e]||r.tv;return{html:`
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
  `,init:d=>{if(!d)return;const p=d.querySelector("#popular-media-grid"),h=d.querySelector("#popular-sentinel");if(!p)return;gt(p);let f=!1;const v=Wh(e),y=()=>{h&&(n.isExhausted?h.innerHTML='<p style="color: var(--text-muted); font-size: 0.9rem;">Tüm popüler içerikler listelendi.</p>':h.innerHTML=`
            <div style="display: flex; align-items: center; gap: 0.6rem; color: var(--text-muted); font-size: 0.9rem;">
              <div class="spin-loader" style="width: 20px; height: 20px; border: 2px solid rgba(245,158,11,0.25); border-top-color: #f59e0b; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
              <span>Daha fazla içerik akıyor...</span>
            </div>
          `)},w=E=>{if(!E||E.length===0)return;const C=[];for(const I of E)I&&I.id&&!n.seenIds.has(I.id)&&(n.seenIds.add(I.id),C.push(I));if(C.length===0)return;n.allItems.push(...C);const _=C.map(I=>Et(I)).join("");p.querySelector(".popular-loading-placeholder")?p.innerHTML=_:p.insertAdjacentHTML("beforeend",_),gt(p),J()},k=async(E=3)=>{if(!(f||n.isExhausted)){f=!0,y();try{const C=n.nextPage,_=Array.from({length:E},(K,F)=>C+F);n.nextPage+=E;let T=0;const I=e==="anime"||e==="cartoon"||t&&e==="tv",L=_.map(K=>v(K).catch(()=>[])),N=await Promise.all(L),O=N.flat().filter(Boolean);if(I){const K=e==="cartoon"?"_cartoonScore":"_turkeyPopularityScore";O.sort((F,z)=>(z[K]||0)-(F[K]||0)),T=O.length,w(O)}else for(const K of N)K&&K.length>0&&(T+=K.length,w(K));O.length===0&&(n.isExhausted=!0),y(),requestAnimationFrame(()=>{if(!n.isExhausted&&document.documentElement.scrollHeight<=window.innerHeight+600){f=!1,k(2);return}})}catch{}finally{f=!1,y()}}};k(1);let m=null;h&&"IntersectionObserver"in window&&(m=new IntersectionObserver(E=>{E[0].isIntersecting&&!f&&!n.isExhausted&&k(2)},{rootMargin:"0px 0px 1500px 0px"}),m.observe(h));const b=()=>{if(f||n.isExhausted)return;const E=window.scrollY||0,C=window.innerHeight,_=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);E+C>=_-1200&&k(2)};window.addEventListener("scroll",b,{passive:!0}),window.__popularListCleanup=()=>{m?.disconnect(),window.removeEventListener("scroll",b)}}}}function Yh(){const e=new Set;let t=!1;const i=s=>{t?s():e.add(s)},n=(s,l,d,p)=>{t||(s.addEventListener(l,d,p),i(()=>s.removeEventListener(l,d,p)))},r=new Map,a=s=>{const l=r.get(s);l&&(l(),e.delete(l),r.delete(s))},o=(s,l,d)=>{if(t)return null;const p=globalThis[d?"setInterval":"setTimeout"](()=>{d||a(p),t||s()},l),h=()=>globalThis[d?"clearInterval":"clearTimeout"](p);return r.set(p,h),i(h),p};return{on:n,add:i,setTimeout:(s,l)=>o(s,l,!1),setInterval:(s,l)=>o(s,l,!0),clearTimeout:a,clearInterval:a,dispose(){if(!t){t=!0;for(const s of e)s();e.clear(),r.clear()}}}}function Zm(e){const t=globalThis.window?.lucide;if(!(!e||!t?.createElement||!t.icons))for(const i of e.querySelectorAll("[data-lucide]:not(svg)")){const n=i.getAttribute("data-lucide"),r=n.replace(/(^|-)(\w)/g,(l,d,p)=>p.toUpperCase()),a=t.icons[r];if(!a)continue;const o=Object.fromEntries(Array.from(i.attributes,l=>[l.name,l.value]));o.class=`lucide lucide-${n} ${o.class||""}`;const s=t.createElement(a);for(const[l,d]of Object.entries(o))s.setAttribute(l,d);i.replaceWith(s)}}function _t(e,t){const i=(e||"").replace(/ (HD|4K|TV|Kanalı)/gi,"").trim(),n=i.slice(0,5).toUpperCase(),a={"TRT 1":{bg:"linear-gradient(135deg, #b91c1c, #ef4444)",text:"#ffffff",tag:"TRT 1"},ATV:{bg:"linear-gradient(135deg, #c2410c, #f97316)",text:"#ffffff",tag:"ATV"},"SHOW TV":{bg:"linear-gradient(135deg, #6b21a8, #ec4899)",text:"#ffffff",tag:"SHOW"},"NOW TV":{bg:"linear-gradient(135deg, #991b1b, #ef4444)",text:"#ffffff",tag:"NOW"},"STAR TV":{bg:"linear-gradient(135deg, #b91c1c, #dc2626)",text:"#ffffff",tag:"STAR"},"KANAL D":{bg:"linear-gradient(135deg, #0369a1, #0284c7)",text:"#ffffff",tag:"KANAL D"},TV8:{bg:"linear-gradient(135deg, #ea580c, #f97316)",text:"#ffffff",tag:"TV8"},"CNBC-E":{bg:"linear-gradient(135deg, #047857, #10b981)",text:"#ffffff",tag:"CNBC-E"},"A2 TV":{bg:"linear-gradient(135deg, #991b1b, #ea580c)",text:"#ffffff",tag:"A2"},"KANAL 7":{bg:"linear-gradient(135deg, #0284c7, #38bdf8)",text:"#ffffff",tag:"KANAL 7"},"BEYAZ TV":{bg:"linear-gradient(135deg, #881337, #e11d48)",text:"#ffffff",tag:"BEYAZ"},TEVE2:{bg:"linear-gradient(135deg, #ca8a04, #eab308)",text:"#000000",tag:"TEVE2"},"TV 360":{bg:"linear-gradient(135deg, #581c87, #9333ea)",text:"#ffffff",tag:"360"},"TRT HABER":{bg:"linear-gradient(135deg, #831843, #db2777)",text:"#ffffff",tag:"HABER"},"A HABER":{bg:"linear-gradient(135deg, #991b1b, #f97316)",text:"#ffffff",tag:"A HABER"},NTV:{bg:"linear-gradient(135deg, #0369a1, #0284c7)",text:"#ffffff",tag:"NTV"},HABERTÜRK:{bg:"linear-gradient(135deg, #991b1b, #dc2626)",text:"#ffffff",tag:"HTÜRK"},"HALK TV":{bg:"linear-gradient(135deg, #b91c1c, #ef4444)",text:"#ffffff",tag:"HALK"},"S SPORT 1 HD":{bg:"linear-gradient(135deg, #065f46, #10b981)",text:"#ffffff",tag:"S SPORT 1"},"S SPORT 2 HD":{bg:"linear-gradient(135deg, #047857, #34d399)",text:"#ffffff",tag:"S SPORT 2"},"BEIN SPORTS HABER HD":{bg:"linear-gradient(135deg, #4c1d95, #7c3aed)",text:"#ffffff",tag:"BEIN HABER"},"BEIN SPORTS 3 HD":{bg:"linear-gradient(135deg, #3b0764, #6d28d9)",text:"#ffffff",tag:"BEIN 3"},"SPOR SMART 1 HD":{bg:"linear-gradient(135deg, #c2410c, #f97316)",text:"#ffffff",tag:"SMART 1"},"SPOR SMART 2 HD":{bg:"linear-gradient(135deg, #9a3412, #ea580c)",text:"#ffffff",tag:"SMART 2"},"EURO SPORT 1 HD":{bg:"linear-gradient(135deg, #1e3a8a, #2563eb)",text:"#ffffff",tag:"EURO 1"},"EURO SPORT 2 HD":{bg:"linear-gradient(135deg, #172554, #1d4ed8)",text:"#ffffff",tag:"EURO 2"},"TIVIBU SPOR 1 HD":{bg:"linear-gradient(135deg, #0284c7, #06b6d4)",text:"#ffffff",tag:"TİVİBU 1"},"TIVIBU SPOR 2 HD":{bg:"linear-gradient(135deg, #0369a1, #0284c7)",text:"#ffffff",tag:"TİVİBU 2"},"TIVIBU SPOR 3 HD":{bg:"linear-gradient(135deg, #075985, #0369a1)",text:"#ffffff",tag:"TİVİBU 3"},"FX KANALI HD":{bg:"linear-gradient(135deg, #18181b, #27272a)",text:"#fbbf24",tag:"FX"},"SINEMA TV HD":{bg:"linear-gradient(135deg, #713f12, #a16207)",text:"#fef08a",tag:"SINEMA"},"NATIONAL GEOGRAPHIC HD":{bg:"linear-gradient(135deg, #000000, #18181b)",text:"#fbbf24",tag:"NAT GEO"},"DISCOVERY CHANNEL HD":{bg:"linear-gradient(135deg, #0284c7, #06b6d4)",text:"#ffffff",tag:"DISCOVERY"},"DMAX HD":{bg:"linear-gradient(135deg, #111827, #1f2937)",text:"#38bdf8",tag:"DMAX"},"TLC HD":{bg:"linear-gradient(135deg, #831843, #db2777)",text:"#ffffff",tag:"TLC"},"CARTOON NETWORK":{bg:"linear-gradient(135deg, #000000, #27272a)",text:"#ffffff",tag:"CARTOON"},"NICKELODEON HD":{bg:"linear-gradient(135deg, #ea580c, #f97316)",text:"#ffffff",tag:"NICK"}}[i.toUpperCase()]||{bg:"linear-gradient(135deg, #1e293b, #334155)",text:"#ffffff",tag:n},o=`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
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
  </svg>`;return`data:image/svg+xml;utf8,${encodeURIComponent(o)}`}const Vh=[{id:"all",name:"Tüm Kanallar",icon:"tv"},{id:"favorites",name:"⭐ Favorilerim",icon:"star"},{id:"national",name:"Ulusal & Sinema",icon:"home"},{id:"sports",name:"Spor VIP",icon:"trophy"},{id:"news",name:"Haber",icon:"newspaper"},{id:"doc",name:"Belgesel",icon:"compass"},{id:"kids",name:"Çocuk",icon:"smile"},{id:"music",name:"Müzik",icon:"music"}],za=[{id:"ch_trt1",name:"TRT 1",category:"national",logo:"/tv-logos/trt-1.png",quality:"1080p FHD",streamUrl:"https://tv-trt1.medya.trt.com.tr/master.m3u8"},{id:"ch_atv",name:"ATV",category:"national",logo:"/tv-logos/atv.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/atv/atv_1080p.m3u8"},{id:"ch_showtv",name:"Show TV",category:"national",logo:"/tv-logos/show-tv.png",quality:"1080p FHD",streamUrl:"https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/showtv/showtv.m3u8"},{id:"ch_nowtv",name:"NOW TV",category:"national",logo:"/tv-logos/now-tv.png",quality:"1080p FHD",streamUrl:"https://uycyyuuzyh.turknet.ercdn.net/nphindgytw/nowtv/nowtv.m3u8"},{id:"ch_startv",name:"Star TV",category:"national",logo:"/tv-logos/star-tv.png",quality:"1080p FHD",streamUrl:"https://dygvideo.dygdigital.com/live/hls/startv4puhu/live.m3u8"},{id:"ch_kanald",name:"Kanal D",category:"national",logo:"/tv-logos/kanal-d.png",quality:"1080p FHD",streamUrl:"https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/kanald/kanald.m3u8"},{id:"ch_tv8",name:"TV8",category:"national",logo:"/tv-logos/tv8.png",quality:"480p",streamUrl:"https://rkhubpaomb.turknet.ercdn.net/fwjkgpasof/tv8/tv8_480p.m3u8"},{id:"ch_cnbce",name:"CNBC-e",category:"national",logo:"/tv-logos/cnbc-e.png",quality:"1080p FHD",streamUrl:"https://hnpsechtsc.turknet.ercdn.net/xpnvudnlsv/cnbc-e/cnbc-e.m3u8"},{id:"ch_a2",name:"A2 TV",category:"national",logo:"/tv-logos/a2.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/a2tv/a2tv.m3u8"},{id:"ch_kanal7",name:"Kanal 7",category:"national",logo:"/tv-logos/kanal-7.png",quality:"1080p FHD",streamUrl:"https://kanal7-live.daioncdn.net/kanal7/kanal7.m3u8"},{id:"ch_beyaztv",name:"Beyaz TV",category:"national",logo:"/tv-logos/beyaz-tv.png",quality:"1080p FHD",streamUrl:"https://beyaztv-live.daioncdn.net/beyaztv/beyaztv.m3u8"},{id:"ch_teve2",name:"Teve2",category:"national",logo:"/tv-logos/teve2.png",quality:"1080p FHD",streamUrl:"https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/teve2/teve2.m3u8"},{id:"ch_tv360",name:"TV 360",category:"national",logo:"/tv-logos/tv-360.png",quality:"1080p FHD",streamUrl:"https://turkmedya-live.ercdn.net/tv360/tv360.m3u8"},{id:"ch_trthaber",name:"TRT Haber",category:"news",logo:"/tv-logos/trt-haber.png",quality:"1080p FHD",streamUrl:"https://tv-trthaber.medya.trt.com.tr/master.m3u8"},{id:"ch_ahaber",name:"A Haber",category:"news",logo:"/tv-logos/a-haber.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/ahaber/ahaber.m3u8"},{id:"ch_ntv",name:"NTV",category:"news",logo:"/tv-logos/ntv.png",quality:"1080p FHD",streamUrl:"https://dygvideo.dygdigital.com/live/hls/ntv4puhu/live.m3u8"},{id:"ch_haberturk",name:"Habertürk",category:"news",logo:"/tv-logos/haberturk.png",quality:"1080p FHD",streamUrl:"https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/haberturktv/haberturktv.m3u8"},{id:"ch_halktv",name:"Halk TV",category:"news",logo:"/tv-logos/halk-tv.png",quality:"1080p FHD",streamUrl:"https://halktv-live.daioncdn.net/halktv/halktv.m3u8"},{id:"ch_tele1",name:"Tele1",category:"news",logo:"/tv-logos/tele1.png",quality:"1080p FHD",streamUrl:"https://tele1-live.ercdn.net/tele1/tele1.m3u8"},{id:"ch_tv100",name:"TV 100",category:"news",logo:"/tv-logos/tv100.png",quality:"1080p FHD",streamUrl:"https://tv.ensonhaber.com/tv100/tv100.m3u8"},{id:"ch_bloomberg",name:"Bloomberg HT",category:"news",logo:"/tv-logos/bloomberg-ht.png",quality:"1080p FHD",streamUrl:"https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/bloomberght/bloomberght.m3u8"},{id:"ch_tv24",name:"24 TV",category:"news",logo:"/tv-logos/tv24.png",quality:"1080p FHD",streamUrl:"https://tv.ensonhaber.com/tv24/tv24.m3u8"},{id:"ch_ulketv",name:"Ülke TV",category:"news",logo:"/tv-logos/ulke-tv.png",quality:"1080p FHD",streamUrl:"https://livetv.radyotvonline.net/kanal7live/ulketv/playlist.m3u8"},{id:"tvr_ch_141",tvrId:"141",isTvr:!0,name:"S SPORT 1 HD",category:"sports",logo:"/tv-logos/s-sport-1.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://mariuannastluisborg.autos/hls/ss11/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_140",tvrId:"140",isTvr:!0,name:"S SPORT 2 HD",category:"sports",logo:"/tv-logos/s-sport-2.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://mariuannastluisborg.autos/hls/ss22/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_165",tvrId:"165",isTvr:!0,name:"Bein Sports Haber HD",category:"sports",logo:"/tv-logos/bein-sports-haber.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/bshaber/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_147",tvrId:"147",isTvr:!0,name:"Bein Sports 3 HD",category:"sports",logo:"/tv-logos/bein-sports-3.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://mariuannastluisborg.autos/hls/bein3/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_139",tvrId:"139",isTvr:!0,name:"Spor Smart 1 HD",category:"sports",logo:"/tv-logos/spor-smart-1.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sporsmart/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_138",tvrId:"138",isTvr:!0,name:"Spor Smart 2 HD",category:"sports",logo:"/tv-logos/spor-smart-2.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sporsmart2/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_137",tvrId:"137",isTvr:!0,name:"Euro Sport 1 HD",category:"sports",logo:"/tv-logos/eurosport-1.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://mariuannastluisborg.autos/hls/euro1/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_135",tvrId:"135",isTvr:!0,name:"Euro Sport 2 HD",category:"sports",logo:"/tv-logos/eurosport-2.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://mariuannastluisborg.autos/hls/euro2/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_134",tvrId:"134",isTvr:!0,name:"Tivibu Spor 1 HD",category:"sports",logo:"/tv-logos/tivibu-spor.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/tivibu1/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_133",tvrId:"133",isTvr:!0,name:"Tivibu Spor 2 HD",category:"sports",logo:"/tv-logos/tivibu-spor.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/tivibu2/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_132",tvrId:"132",isTvr:!0,name:"Tivibu Spor 3 HD",category:"sports",logo:"/tv-logos/tivibu-spor.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/tivibu3/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"ch_trtspor",name:"TRT Spor",category:"sports",logo:"/tv-logos/trt-spor.png",quality:"1080p FHD",streamUrl:"https://tv-trtspor1.medya.trt.com.tr/master.m3u8"},{id:"ch_trtspor2",name:"TRT Spor Yıldız",category:"sports",logo:"/tv-logos/trt-spor-yildiz.png",quality:"1080p FHD",streamUrl:"https://tv-trtspor2.medya.trt.com.tr/master.m3u8"},{id:"ch_aspor",name:"A Spor",category:"sports",logo:"/tv-logos/a-spor.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/aspor/aspor.m3u8"},{id:"tvr_ch_128",tvrId:"128",isTvr:!0,name:"FB TV HD",category:"sports",logo:"/tv-logos/fb-tv.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/fbtv/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_127",tvrId:"127",isTvr:!0,name:"NBA TV HD",category:"sports",logo:"/tv-logos/nba-tv.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/nbatv/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_126",tvrId:"126",isTvr:!0,name:"HT Spor HD",category:"sports",logo:"/tv-logos/ht-spor.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/htspor/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_121",tvrId:"121",isTvr:!0,name:"Ekol Sport HD",category:"sports",logo:"/tv-logos/ekol-sport.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/ekolsport/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_65",tvrId:"65",isTvr:!0,name:"FX Kanalı HD",category:"national",logo:"/tv-logos/fx.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/fx/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_61",tvrId:"61",isTvr:!0,name:"Sinema TV HD",category:"national",logo:"/tv-logos/sinema-tv.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinema/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_60",tvrId:"60",isTvr:!0,name:"Sinema TV 2 HD",category:"national",logo:"/tv-logos/sinema-tv-2.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinema2/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_59",tvrId:"59",isTvr:!0,name:"Sinema TV Aksiyon HD",category:"national",logo:"/tv-logos/sinema-aksiyon.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinemaaksiyon2/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_57",tvrId:"57",isTvr:!0,name:"Sinema TV Komedi HD",category:"national",logo:"/tv-logos/sinema-komedi.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinemakomedi/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_56",tvrId:"56",isTvr:!0,name:"Sinema TV Yerli HD",category:"national",logo:"/tv-logos/sinema-yerli.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinemayerli/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_55",tvrId:"55",isTvr:!0,name:"Sinema TV Aile HD",category:"national",logo:"/tv-logos/sinema-aile.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinemaaile/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_53",tvrId:"53",isTvr:!0,name:"Sinema TV 1001 HD",category:"national",logo:"/tv-logos/sinema-1001.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinema1001/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_52",tvrId:"52",isTvr:!0,name:"Sinema TV 1002 HD",category:"national",logo:"/tv-logos/sinema-1002.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/sinema1002/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_89",tvrId:"89",isTvr:!0,name:"National Geographic HD",category:"doc",logo:"/tv-logos/national-geographic.png",quality:"1080p VIP",streamUrl:""},{id:"tvr_ch_88",tvrId:"88",isTvr:!0,name:"Nat Geo Wild HD",category:"doc",logo:"/tv-logos/nat-geo-wild.png",quality:"1080p VIP",streamUrl:""},{id:"tvr_ch_87",tvrId:"87",isTvr:!0,name:"History Channel HD",category:"doc",logo:"/tv-logos/history.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/history/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_86",tvrId:"86",isTvr:!0,name:"BBC Earth HD",category:"doc",logo:"/tv-logos/bbc-earth.svg",quality:"1080p VIP",streamUrl:""},{id:"tvr_ch_79",tvrId:"79",isTvr:!0,name:"Discovery Channel HD",category:"doc",logo:"/tv-logos/discovery.png",quality:"1080p VIP",streamUrl:""},{id:"tvr_ch_78",tvrId:"78",isTvr:!0,name:"Discovery Science HD",category:"doc",logo:"/tv-logos/discovery-science.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/discs/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_81",tvrId:"81",isTvr:!0,officialLiveId:"dmax",name:"DMAX HD",category:"doc",logo:"/tv-logos/dmax.png",quality:"1080p",streamUrl:"/api/live_tv_stream?channel=dmax"},{id:"tvr_ch_83",tvrId:"83",isTvr:!0,officialLiveId:"tlc",name:"TLC HD",category:"doc",logo:"/tv-logos/tlc.png",quality:"1080p",streamUrl:"/api/live_tv_stream?channel=tlc"},{id:"tvr_ch_85",tvrId:"85",isTvr:!0,name:"Tarih TV HD",category:"doc",logo:"/tv-logos/tarih-tv.svg",quality:"1080p VIP",streamUrl:""},{id:"tvr_ch_84",tvrId:"84",isTvr:!0,name:"DocuBox HD",category:"doc",logo:"/tv-logos/docubox.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/docubox/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_32",tvrId:"32",isTvr:!0,name:"Love Nature 4K",category:"doc",logo:"/tv-logos/love-nature.png",quality:"1080p VIP",streamUrl:""},{id:"tvr_ch_30",tvrId:"30",isTvr:!0,name:"Viasat History HD",category:"doc",logo:"/tv-logos/viasat-history.svg",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/history/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"ch_trtbelgesel",name:"TRT Belgesel",category:"doc",logo:"/tv-logos/trt-belgesel.png",quality:"1080p FHD",streamUrl:"https://tv-trtbelgesel.medya.trt.com.tr/master.m3u8"},{id:"ch_tgrtbelgesel",name:"TGRT Belgesel",category:"doc",logo:_t("TGRT Belgesel"),quality:"1080p FHD",streamUrl:"https://b01c02nl.mediatriple.net/videoonlylive/mtsxxkzwwuqtglive/broadcast_5fe462afc6a0e.smil/playlist.m3u8"},{id:"ch_ciftcitv",name:"Çiftçi TV",category:"doc",logo:_t("Çiftçi TV"),quality:"720p",streamUrl:"https://live.artidijitalmedya.com/artidijital_ciftcitv/ciftcitv/chunks.m3u8"},{id:"ch_kanalv",name:"Kanal V",category:"doc",logo:_t("Kanal V"),quality:"720p",streamUrl:"https://live.artidijitalmedya.com/artidijital_kanalv/kanalv/chunks.m3u8"},{id:"tvr_ch_36",tvrId:"36",isTvr:!0,name:"Cartoon Network",category:"kids",logo:"/tv-logos/cartoon-network.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://lord.mariuannastluisborg.autos/cartoonnetwork/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_35",tvrId:"35",isTvr:!0,name:"Nickelodeon HD",category:"kids",logo:"/tv-logos/nickelodeon.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("http://fl1.moveonjoy.com/NICKELODEON/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"tvr_ch_33",tvrId:"33",isTvr:!0,name:"Disney Junior",category:"kids",logo:"/tv-logos/disney-channel.png",quality:"1080p VIP",streamUrl:"/api/hls_proxy?url="+encodeURIComponent("https://saran-live.ercdn.net/disneyjunior/index.m3u8")+"&ref=https://a.prectv70.lol/"},{id:"ch_trtcocuk",name:"TRT Çocuk",category:"kids",logo:"/tv-logos/trt-cocuk.png",quality:"1080p FHD",streamUrl:"https://tv-trtcocuk.medya.trt.com.tr/master.m3u8"},{id:"ch_minikago",name:"Minika GO",category:"kids",logo:"/tv-logos/minika-go.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/minikago/minikago.m3u8"},{id:"ch_trtmuzik",name:"TRT Müzik",category:"music",logo:"/tv-logos/trt-muzik.png",quality:"480p",streamUrl:"https://tv-trtmuzik.medya.trt.com.tr/master_480.m3u8"},{id:"ch_kralpop",name:"Kral Pop",category:"music",logo:"/tv-logos/kral-pop.png",quality:"1080p FHD",streamUrl:"https://dygvideo.dygdigital.com/live/hls/kralpoptv/live.m3u8"},{id:"ch_powerturk",name:"Power Türk",category:"music",logo:"/tv-logos/powerturk.png",quality:"1080p FHD",streamUrl:"https://powerlive.daioncdn.net/powerturktv/powerturktv.m3u8"},{id:"ch_dreamturk",name:"Dream Türk",category:"music",logo:"/tv-logos/dream-turk.png",quality:"1080p FHD",streamUrl:"https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/dreamturk/dreamturk.m3u8"},{id:"ch_tempotv",name:"Tempo TV",category:"music",logo:_t("Tempo TV"),quality:"720p",streamUrl:"https://live.artidijitalmedya.com/artidijital_tempotv/tempotv/chunks.m3u8"}],Gh=new Set(["hd","full","izle","seyret","film","dizi","anime","turkce","dublaj","altyazili","sezon","bolum","fragman","filmekseni","ekseni","sezonlukdizi","yabancidizi","dizipal","dizibal"]);function Sl(e){return(e||"").toString().normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("tr-TR").replace(/[ıİ]/g,"i").replace(/\bs\d{1,2}\s*e\d{1,3}\b/g," ").replace(/\b(?:sezon|bolum)\s*\d+\b/g," ").replace(/\b\d+\s*(?:sezon|bolum)\b/g," ").replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(t=>t&&!Gh.has(t)&&!/^(?:19|20)\d{2}$/.test(t)).join(" ").trim()}function Jh(e,t){if(e===t)return 0;if(!e.length)return t.length;if(!t.length)return e.length;const i=Array.from({length:t.length+1},(n,r)=>r);for(let n=1;n<=e.length;n++){let r=i[0];i[0]=n;for(let a=1;a<=t.length;a++){const o=i[a];i[a]=Math.min(i[a]+1,i[a-1]+1,r+(e[n-1]===t[a-1]?0:1)),r=o}}return i[t.length]}function Xh(e,t){const i=Sl(e),n=Sl(t);return!i||!n?0:i===n?1:1-Jh(i,n)/Math.max(i.length,n.length)}function gs(e,t,i=.9){return(Array.isArray(t)?t:[t]).filter(Boolean).some(r=>Xh(e,r)>=i)}function Qm(e){return e?(e.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i)?.[1]||e.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g," ")||e.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||"").replace(/\s+\d+\s*\.?\s*sezon\b[\s\S]*$/i,"").replace(/\s+[-|]\s*(?:sezonluk\s*dizi|sezonlukdizi|filmekseni|yabanci\s*dizi)[\s\S]*$/i,"").trim():""}const Zh="3508611138826751fdf77beaa6f93eb93fd27e6a5acb910e7aad22665513dd6e",Qh="666482389dc76bfa57068407418f7dac9f6c14b6868856b169165b9fac7d812e",mi="4F5A9C3D9A86FA54EACEDDD635185/c3c5bd17-e37b-4b94-a944-8a3688a30452",em="aLhsnd71BqsMC_HZoT8MR_TrfZS1_WcAzYT5nROaUKI",tm="MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDq5iorf3BOWNqObZFRyco/sa7GrDO5r094yhO1FsWRvwoTRneD1ryv+yVLwJrr0IOmjhD2hgyErvs6XRhAmNa18fcMlHJqHlghHA0dt2FnkFlqlZ029/w1inZ8+g5XFjffNp8Xb5T44PrsowlI5Mjfe0JpkHCN20tLkmGdMUes9yQNbKwpUXvBPq/bLYn8IJNoR/kP/4mis7mMeRzWgIupc9AlFx6HH7IZ6NfYmyqDdo7xdSg+WNl/rcuYcPccuN6dIhqWeceSOFiChaGHJMtuEzbHHefRqbK529eNHVTpUmRtfaZu2a+DRXkoz2TU1KCrnSDuNztvlKjiztiJZMdlAgMBAAECggEACCjTmSw1lfsfKGhk7l7gkCLXa95Kc65Dx/HZCmbOmRf2PSIq/6DjcAd8zatUllFpaU0xCKcyYx+C6Y2XTJMijjJn/v9fFBGWxRuo1vnqP8MzX/Dvg5vMnn1/TSsQeXTznuTSVOmS1qxV+wdUyLvtwFmTPoB+cGcIMAlXK7MtBrSD9kCRcpJZgFNUILhn6ISm9NpaqU+5xBBuJRsXaMDvSUTHi1IKK2ZUneetFAgg6BVE5StmORBjMgXfNRIsD+oOHUvtsEczcHnAP2hW19I0lXfwnLhaAicKIECCDpn6cwfBtQWnSDSENCLMemM2O8KYvAizBW4ET3BZBqSDrZEzRwKBgQD/9o7qbE2LEJ19Mkg+4PTqMJ06bFWKUvUB3JuS4Iu/wy9u6tAU7uQySo9vSDDclG8TaDjkz6c2eTmDy7LdFESwLgiHV6cmpm0sieoTMaz1pVkpykifQo1fv2Q60t/co6oEyUWfmdk3iaK6j3MFhjqRpkmZcUYvBYyuRUv8ewKtcwKBgQDq7tRYL2c6cIznwqTJdLuap3eFRP21ymjV/TTp2DrZtVevw9rNYflDK88mIxZdbbAqPT10zbRc3UnqeE2+76UKBAodUJpSPXg2WvA0hZe57q1VnU7gQhMgvDWRPrTG7qbij+FnRtPHWZ1HGLFfl2DSDnFEVsJo2xXQjw5vMTOBxwKBgQDlbKQQ7t5aRZxD+WvUIGKl/skO8seBYnYFIy226tmYGmVLr+Cuwql7gmUqQ7S4Ibul04cbYBzqsKGixlQd4OroV3qBhUlnVUkJ4NwUNDRpQbm3wX5ycX6yUaSPLTBGXdQo0hc7xPRz2UQooCdizjt1DW1uwZ88ymacVbSUK9XsjQKBgGTNhR8xd8GDeXIX+kzWYYjCQm5UY+gUqVboBkQwG1A+lxk7mC5301QXABMFCxubbPMyw6PSf4k5CfYpGHLMsKvTf+OEKjMPXP01l8txZuDIoGcT0Dw5Hav2FaX0meyhicm8oqKFqWjn8qwG1FSHx2tZ9w+zikcjegC64R6kpc0RAoGAO4/tqaXM5CUUWtHanK/1j6KYbFqsKL13FeqIr8TprF4LXpzrzFAPMCmWL6XFq8JZqZj/KNjH9vvt9f7/9QMvI4nZ+0vXihRqdX7LO+XliGRhuXjHp3RlUU4s8eJt9Af7PCFWFX0gwfM8SnkVUTkE3tOQHgk7hM3PUOPH0yZ+gQ8=",im="MIIDDDCCAfSgAwIBAgIJYFwVX3W1KCXxMA0GCSqGSIb3DQEBCwUAMBgxFjAUBgNVBAMMDWF0dGVzdF9yc2FfdjEwHhcNMjYwOTA4MTUwMjMyWhcNMjcwOTA4MTUwMjMyWjAYMRYwFAYDVQQDDA1hdHRlc3RfcnNhX3YxMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6uYqK39wTljajm2RUcnKP7Guxqwzua9PeMoTtRbFkb8KE0Z3g9a8r_slS8Ca69CDpo4Q9oYMhK77Ol0YQJjWtfH3DJRyah5YIRwNHbdhZ5BZapWdNvf8NYp2fPoOVxY33zafF2-U-OD67KMJSOTI33tCaZBwjdtLS5JhnTFHrPckDWysKVF7wT6v2y2J_CCTaEf5D_-JorO5jHkc1oCLqXPQJRcehx-yGejX2Jsqg3aO8XUoPljZf63LmHD3HLjenSIalnnHkjhYgoWhhyTLbhM2xx3n0amyudvXjR1U6VJkbX2mbtmvg0V5KM9k1NSgq50g7jc7b5So4s7YiWTHZQIDAQABo1kwVzAMBgNVHRMBAf8EAjAAMA4GA1UdDwEB_wQEAwIFoDAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwGAYDVR0RBBEwD4INYXR0ZXN0X3JzYV92MTANBgkqhkiG9w0BAQsFAAOCAQEAREcHgi7mZGgOpu1jBzN89IJIdMSRjYI5AYwhePByZy7U4SOeqq5WTXPsOZdUjGyib1CJzvs44ro8_L9hLfeJCzNTRk9yyAt_EJ6QHAqdyMIBwNSSb3wDg6N7T4x4MJrgoHJ7uRf2iGEdMfazb2aZFyHQjyt4paUCrix5jt7FXY_02pyEQWPLYQb8U6nf8strd4nNdrm9EPAEF7zY7ZXD5L8egXvTkdmvsBRU5OQLftw1JaPkLu85zMQ2hZtscmCQ2ImxxwBlUqS7V_QmaMFHkdJrWQdXF7vU2Ws0qv3qBU7-FJgqGUSuDMFw7sMeeWuVKvg7WjSxolwPZrqIo6ZSUA";function nm(e){let t="";for(let i=0;i<e.length;i++)t+=String.fromCharCode(e[i]);return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"")}function rm(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");for(;t.length%4;)t+="=";const i=atob(t),n=new Uint8Array(i.length);for(let r=0;r<i.length;r++)n[r]=i.charCodeAt(r);return n}function am(e){const t=new Uint8Array(e.length/2);for(let i=0;i<t.length;i++)t[i]=parseInt(e.substr(i*2,2),16);return t}function sd(e){return Array.from(e).map(t=>t.toString(16).padStart(2,"0")).join("")}async function sm(e){const t=new TextEncoder().encode(e),i=await crypto.subtle.digest("SHA-256",t);return sd(new Uint8Array(i))}async function om(e,t){const i=new TextEncoder,n=await crypto.subtle.importKey("raw",i.encode(e),{name:"HMAC",hash:"SHA-256"},!1,["sign"]),r=await crypto.subtle.sign("HMAC",n,i.encode(t));return sd(new Uint8Array(r))}async function ys(e,t,i=""){const n=Math.floor(Date.now()/1e3).toString(),r=typeof crypto.randomUUID=="function"?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,l=>{const d=Math.random()*16|0;return(l==="x"?d:d&3|8).toString(16)}),a=await sm(i),o=`${e}
${t}
${n}
${r}
${a}`,s=await om(Zh,o);return{"user-agent":"okhttp/4.12.0","X-Timestamp":n,"X-Nonce":r,"X-Signature":s,"X-App-Version":"110","X-Client-Id":"rectv-android"}}let Wn=null;async function lm(){if(Wn)return Wn;const e=atob(tm),t=new Uint8Array(e.length);for(let i=0;i<e.length;i++)t[i]=e.charCodeAt(i);return Wn=await crypto.subtle.importKey("pkcs8",t,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},!1,["sign"]),Wn}let Ri=null,Yn=0;const cm=typeof window>"u";function vs(e){return cm?`https://a.prectv70.lol/api${e}`:`/api/rtv${e}`}let xl=0;async function dm(){const e=Math.floor(Date.now()/1e3);if(Ri&&Yn>e+120)return Ri;if(typeof localStorage<"u"){const t=localStorage.getItem("rectv_jwt_token"),i=parseInt(localStorage.getItem("rectv_jwt_exp")||"0",10);if(t&&i>e+120)return Ri=t,Yn=i,t}if(Date.now()-xl<3e5)return null;try{const i={...await ys("GET","/api/attest/nonce",""),"x-rtv-path":"/attest/nonce"},n=await fetch(vs("/attest/nonce"),{method:"GET",headers:i});if(!n.ok)throw new Error(`Nonce request failed with status ${n.status}`);const a=(await n.json()).nonce;if(!a)throw new Error("Empty nonce returned");const o=rm(a),s=await lm(),l=await crypto.subtle.sign("RSASSA-PKCS1-v1_5",s,o),d=nm(new Uint8Array(l)),p="/api/attest/verify",h=JSON.stringify({certChain:[im],nonce:a,pkg:"com.rectv.shot",proof:d,sig:em}),f={...await ys("POST",p,h),"x-rtv-path":"/attest/verify","Content-Type":"application/json"},v=await fetch(vs("/attest/verify"),{method:"POST",headers:f,body:h});if(!v.ok)throw new Error(`Verify attestation failed with status ${v.status}`);const y=await v.json();if(!y.jwt)throw new Error("Verify did not return JWT");if(Ri=y.jwt,Yn=y.exp||e+7200,typeof localStorage<"u")try{localStorage.setItem("rectv_jwt_token",Ri),localStorage.setItem("rectv_jwt_exp",Yn.toString())}catch{}return Ri}catch{return xl=Date.now(),null}}let Vn=null;async function um(){if(Vn)return Vn;const e=am(Qh);return Vn=await crypto.subtle.importKey("raw",e,{name:"AES-GCM"},!1,["decrypt"]),Vn}async function bs(e){if(!e)return"";if(e.startsWith("http://")||e.startsWith("https://"))return e;try{const t=atob(e),i=new Uint8Array(t.length);for(let l=0;l<t.length;l++)i[l]=t.charCodeAt(l);const n=i.slice(0,12),r=i.slice(12),a=await um(),o=await crypto.subtle.decrypt({name:"AES-GCM",iv:n,tagLength:128},a,r);return new TextDecoder("utf-8").decode(o)}catch{return""}}async function gi(e,t="GET",i=""){let n=null;try{n=await dm()}catch{}const r=`/api${e}`,o={...await ys(t,r,i),"x-rtv-path":e,...n?{Authorization:`Bearer ${n}`}:{},...i?{"Content-Type":"application/json"}:{}};try{const s=await fetch(vs(e),{method:t,headers:o,signal:AbortSignal.timeout(6e3),...i?{body:i}:{}});if(s.ok)return await s.json()}catch{}return null}async function eg({type:e="movie",title:t="",originalTitle:i="",season:n=1,episode:r=1,year:a=null}){const o=(t||i||"").trim();if(!o)return[];const s=parseInt(n,10)||1,l=parseInt(r,10)||1;try{let d=await gi(`/search/${encodeURIComponent(o)}/${mi}/`);if((!d||!Array.isArray(d.posters)||d.posters.length===0)&&i&&i.toLowerCase()!==o.toLowerCase()&&(d=await gi(`/search/${encodeURIComponent(i.trim())}/${mi}/`)),!d||!Array.isArray(d.posters)||d.posters.length===0)return[];const p=[o,i].filter(Boolean),h=e==="movie";let f=null;const v=w=>{if(!w)return!1;if(gs(w,p))return!0;const k=w.split(/\s*[-/:]\s*/).filter(Boolean);for(const m of k)if(gs(m,p))return!0;return!1};for(const w of d.posters)if((h?w.type==="movie":w.type==="serie")&&v(w.title||w.name||"")){f=w;break}if(!f)return[];const y=[];if(h){if(Array.isArray(f.sources))for(const w of f.sources){if(!w.enc_url&&!w.url)continue;const k=w.enc_url?await bs(w.enc_url):w.url;if(!k||!k.startsWith("http"))continue;const m=`/api/hls_proxy?url=${encodeURIComponent(k)}&ref=https://a.prectv70.lol/`,E=(w.title||"").toLowerCase().includes("dublaj")||(f.label||"").toLowerCase().includes("dublaj")?"🇹🇷 TVR VIP (TR Dublaj)":"⚡ TVR VIP (TR Altyazı)";y.push({id:`tvr_movie_${f.id}_${w.id}`,name:E,displayName:E,badge:"⚡ TVR VIP",source:"TVR VIP",url:m,streamUrl:m,rawStreamUrl:k,quality:"1080p HD",isHls:!0,isDirectVideo:!0,priority:0,getUrl:()=>m})}}else{const w=await gi(`/season/by/serie/${f.id}/${mi}/`);if(Array.isArray(w))for(const k of w){const m=(k.title||k.name||"").toLowerCase(),b=m.match(/(\d+)/)||[];if((b[1]?parseInt(b[1],10):parseInt(k.number||k.season_number||k.num||"0",10)||1)!==s)continue;const C=m.includes("dublaj")||(k.label||"").toLowerCase().includes("dublaj");let _=Array.isArray(k.episodes)?k.episodes:null;if(!_||_.length===0){const T=await gi(`/episode/by/season/${k.id}/${mi}/`);Array.isArray(T)?_=T:T&&Array.isArray(T.episodes)&&(_=T.episodes)}if(!(!Array.isArray(_)||_.length===0))for(const T of _){const L=(T.title||T.name||"").toLowerCase().match(/(\d+)/)||[];if((L[1]?parseInt(L[1],10):parseInt(T.number||T.episode_number||T.num||"0",10)||1)!==l)continue;let O=Array.isArray(T.sources)?T.sources:Array.isArray(T.videos)?T.videos:Array.isArray(T.streams)?T.streams:[];if(O.length===0&&T.id){const K=await gi(`/source/by/episode/${T.id}/${mi}/`);Array.isArray(K)?O=K:K&&Array.isArray(K.sources)&&(O=K.sources)}for(const K of O){const F=K.enc_url||K.encUrl||K.encrypted_url,z=K.url||K.stream_url||K.video||K.link||K.source;if(!F&&!z)continue;const P=F?await bs(F):z;if(!P||!P.startsWith("http"))continue;const Y=`/api/hls_proxy?url=${encodeURIComponent(P)}&ref=https://a.prectv70.lol/`,ee=C||(K.title||K.name||"").toLowerCase().includes("dublaj")?`🇹🇷 TVR S${s}E${l} (TR Dublaj)`:`⚡ TVR S${s}E${l} (TR Altyazı)`;y.push({id:`tvr_ep_${f.id}_${T.id||T.number}_${K.id||P.slice(-8)}`,name:ee,displayName:ee,badge:"⚡ TVR VIP",source:"TVR VIP",url:Y,streamUrl:Y,rawStreamUrl:P,quality:"1080p HD",isHls:!0,isDirectVideo:!0,priority:0,getUrl:()=>Y})}}}}return y}catch{return[]}}const Oa=[{id:"tvr_ch_dmax",tvrId:"dmax",isDaion:!0,name:"DMAX",category:"national",logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/DMAX_Logo_2019.svg/200px-DMAX_Logo_2019.svg.png",quality:"HD Canlı",streamUrl:""},{id:"tvr_ch_tlc",tvrId:"tlc",isDaion:!0,name:"TLC",category:"national",logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/TLC_Logo.svg/200px-TLC_Logo.svg.png",quality:"HD Canlı",streamUrl:""}];async function pm(){try{const e=await gi(`/channel/by/filtres/0/0/0/${mi}/`);if(!Array.isArray(e))return[...Oa];const t=new Map([[1,"sports"],[2,"doc"],[3,"national"],[4,"news"],[5,"music"],[6,"national"],[7,"kids"],[8,"national"]]),i=new Set,n=[];for(const r of e){const a=String(r.id||"").trim();if(!a||i.has(a)||String(r.playas||"1")==="0")continue;i.add(a);const o=Number(r.categories?.[0]?.id||0);n.push({id:`tvr_ch_${a}`,tvrId:a,isTvr:!0,name:r.title||r.name||`TVR ${a}`,category:t.get(o)||"national",logo:r.image||r.poster||"",quality:"1080p TVR",streamUrl:""})}for(const r of Oa)n.some(o=>{const s=(o.name||"").toLowerCase();return s===r.name.toLowerCase()||s.includes(r.tvrId)})||n.push(r);return n}catch{return[...Oa]}}const cn=new Map,Gn=new Map,El=2*60*1e3;async function Jn(e,{forceRefresh:t=!1}={}){if(!e)return null;const i=String(e).replace(/^tvr_ch_/,"");if(i==="dmax"||i==="tlc"||i==="81"||i==="83"){const a=i==="81"||i==="dmax"?"dmax":"tlc",o=`daion_${a}`,s=cn.get(o);if(!t&&s&&s.expiresAt>Date.now())return s.url;try{const l=await fetch(`/api/live_tv_stream?channel=${a}&json=1`);if(l.ok){const d=await l.json(),p=d?.proxiedUrl||d?.url||d?.raw;if(p)return cn.set(o,{url:p,expiresAt:Date.now()+El}),p}}catch{}if(i!=="81"&&i!=="83")return`/api/live_tv_stream?channel=${a}`}const n=cn.get(i);if(!t&&n&&n.expiresAt>Date.now())return n.url;if(Gn.has(i))return Gn.get(i);t&&cn.delete(i);const r=(async()=>{try{const a=await gi(`/channel/by/${i}/${mi}/`);if(!a||!Array.isArray(a.sources))return null;const o=a.sources.find(d=>!d.locked&&(d.enc_url||d.url));if(!o)return null;const s=o.enc_url?await bs(o.enc_url):o.url;if(!s||!s.startsWith("http"))return null;const l=`/api/hls_proxy?url=${encodeURIComponent(s)}&ref=https://a.prectv70.lol/`;return cn.set(i,{url:l,expiresAt:Date.now()+El}),l}catch{return null}})();Gn.set(i,r);try{return await r}finally{Gn.delete(i)}}const $r="cinepulse_epg_live_cache",od=30*60*1e3;let St=null,Tl=0,Na=!1,kn=null;const fm={ch_cnbce:[{start:"07:00",end:"10:00",title:"Sabah Piyasaları & Finans"},{start:"10:00",end:"14:00",title:"Piyasa Ekranı & Global Trendler"},{start:"14:00",end:"18:00",title:"Kapanışa Doğru"},{start:"18:00",end:"20:00",title:"The Simpsons"},{start:"20:00",end:"21:00",title:"Mad Men"},{start:"21:00",end:"23:00",title:"Game of Thrones Kuşağı"},{start:"23:00",end:"01:00",title:"Late Night Show"},{start:"01:00",end:"07:00",title:"Gece Finans & Belgesel"}],tvr_ch_141:[{start:"08:00",end:"11:00",title:"İtalya Serie A Goller"},{start:"11:00",end:"14:00",title:"EuroLeague Özel Kuşağı"},{start:"14:00",end:"17:00",title:"La Liga Günlüğü & Özetler"},{start:"17:00",end:"20:00",title:"Maç Önü & Canlı Stüdyo"},{start:"20:00",end:"23:00",title:"Canlı Futbol / Basketbol Karşılaşması"},{start:"23:00",end:"02:00",title:"Günün Analizi & Tartışma"},{start:"02:00",end:"08:00",title:"Premier Maç Tekrarları"}],tvr_ch_140:[{start:"08:00",end:"12:00",title:"Formula 1 Özel Kuşağı"},{start:"12:00",end:"15:00",title:"NBA Action & En İyi Hareketler"},{start:"15:00",end:"19:00",title:"Uluslararası Voleybol Ligi"},{start:"19:00",end:"22:00",title:"Canlı Basketbol / Tenis Karşılaşması"},{start:"22:00",end:"01:00",title:"Motorsporları Kuşağı"},{start:"01:00",end:"08:00",title:"Gecenin Tekrarları"}]},Al={sports:[{start:"06:00",end:"09:00",title:"Spor Bülteni & Günün Manşetleri"},{start:"09:00",end:"12:00",title:"Maç Özetleri & Goller Kuşağı"},{start:"12:00",end:"14:00",title:"Öğle Sporu & Transfer Raporu"},{start:"14:00",end:"17:00",title:"Uluslararası Ligler & Analiz"},{start:"17:00",end:"19:00",title:"Maç Önü & Stüdyo Analizi"},{start:"19:00",end:"21:30",title:"Canlı Karşılaşma / Canlı Yayın"},{start:"21:30",end:"23:45",title:"Dev Maç Özel Yayını"},{start:"23:45",end:"02:00",title:"Son Sayfa & Tartışma Programı"},{start:"02:00",end:"06:00",title:"Gecenin Maçları (Tekrar)"}],news:[{start:"06:00",end:"09:00",title:"Güne Başlarken & Sabah Raporu"},{start:"09:00",end:"12:00",title:"Ekonomi ve Politika Gündemi"},{start:"12:00",end:"14:00",title:"Gün Ortası Bülteni"},{start:"14:00",end:"17:00",title:"Sıcak Gelişmeler & Canlı Bağlantılar"},{start:"17:00",end:"19:00",title:"Akşam Bülteni & Manşetler"},{start:"19:00",end:"20:30",title:"Ana Haber Bülteni"},{start:"20:30",end:"23:30",title:"Türkiye'nin Nabzı & Açık Oturum"},{start:"23:30",end:"01:30",title:"Gece Raporu & Dünya Basını"},{start:"01:30",end:"06:00",title:"Gece Bülteni"}],doc:[{start:"06:00",end:"09:00",title:"Vahşi Yaşamın İzinde"},{start:"09:00",end:"12:00",title:"Evrenin Gizemleri ve Uzay"},{start:"12:00",end:"15:00",title:"Mega Yapılar & Mühendislik"},{start:"15:00",end:"18:00",title:"Tarihin Bilinmeyen Sayfaları"},{start:"18:00",end:"20:00",title:"Okyanusların Derinlikleri"},{start:"20:00",end:"22:00",title:"Büyük Kediler: Hayatta Kalma"},{start:"22:00",end:"00:30",title:"Dünyanın En Gizemli Keşifleri"},{start:"00:30",end:"06:00",title:"Gece Belgesel Kuşağı"}],kids:[{start:"06:00",end:"09:00",title:"Sabah Neşesi Çizgi Filmler"},{start:"09:00",end:"12:00",title:"Eğlenceli Maceralar & Kahramanlar"},{start:"12:00",end:"15:00",title:"Sevimli Dostlar & Bilim Zamanı"},{start:"15:00",end:"18:00",title:"Süper Kahramanlar Kuşağı"},{start:"18:00",end:"20:30",title:"Akşam Aile Sineması"},{start:"20:30",end:"22:30",title:"Fantastik Çizgi Dizi"},{start:"22:30",end:"06:00",title:"Gece Masalları"}],music:[{start:"06:00",end:"10:00",title:"Güne Enerjik Başla (Top 20 Pop)"},{start:"10:00",end:"14:00",title:"Hit Müzik & Radyo Şarkıları"},{start:"14:00",end:"18:00",title:"Trendler & En Çok Dinlenenler"},{start:"18:00",end:"21:00",title:"Akşam Ritimleri & Klip Kuşağı"},{start:"21:00",end:"23:30",title:"Canlı Akustik & Popüler Klipler"},{start:"23:30",end:"02:00",title:"Gece Chill & Deep House"},{start:"02:00",end:"06:00",title:"Kesintisiz Gece Müziği"}],national:[{start:"06:00",end:"09:00",title:"Sabah Programı & Magazin"},{start:"09:00",end:"12:00",title:"Gündüz Kuşağı Programı"},{start:"12:00",end:"14:00",title:"Gün Ortası & Yemek Programı"},{start:"14:00",end:"17:00",title:"Popüler Dizi Tekrar Kuşağı"},{start:"17:00",end:"19:00",title:"Yarışma Kuşağı"},{start:"19:00",end:"20:00",title:"Akşam Ana Haber"},{start:"20:00",end:"23:30",title:"Prime Time Sinema / Dizi"},{start:"23:30",end:"02:00",title:"Gece Sineması"},{start:"02:00",end:"06:00",title:"Gece Kuşağı"}]};function Cl(e){if(!e||!e.includes(":"))return 0;const[t,i]=e.split(":").map(Number);return(t||0)*60+(i||0)}function hm(){try{const e=(typeof window<"u"&&window.sessionStorage?sessionStorage.getItem($r):null)||(typeof window<"u"&&window.localStorage?localStorage.getItem($r):null);if(!e)return null;const t=JSON.parse(e);if(t&&t.channels&&Date.now()-(t.updatedAt||0)<12*3600*1e3)return t.channels}catch{}return null}function mm(e){try{typeof window<"u"&&window.sessionStorage&&sessionStorage.setItem($r,JSON.stringify({updatedAt:Date.now(),channels:e})),typeof window<"u"&&window.localStorage&&localStorage.removeItem($r)}catch{}}async function Ll(e=!1){const t=Date.now();if(!e&&St&&t-Tl<od||Na)return St;Na=!0;try{let i=null;try{i=await fetch("/api/epg")}catch{}if((!i||!i.ok)&&(i=await fetch("/epg-data.json")),i&&i.ok){const n=await i.json();n&&n.channels&&Object.keys(n.channels).length>0&&(St=n.channels,Tl=t,mm(n.channels),window.dispatchEvent(new CustomEvent("epg-updated",{detail:{count:Object.keys(n.channels).length}})))}}catch{}finally{Na=!1}return St}function gm(){if(!St){const e=hm();e&&(St=e)}Ll(),kn===null&&(kn=setInterval(()=>{Ll(!0)},od))}function ym(){kn!==null&&(clearInterval(kn),kn=null)}function Xn(e){if(!e)return{title:"Canlı Yayın",timeRange:"Canlı Akış",start:"00:00",end:"23:59",progress:50,remainingMin:30,nextTitle:"Yayın Akışı"};const t=Date.now();if(St&&St[e.id]&&St[e.id].length>0){const a=St[e.id];for(let s=0;s<a.length;s++){const l=a[s];if(t>=l.startTs&&t<l.endTs){const d=Math.max(1,(l.endTs-l.startTs)/6e4),p=Math.max(0,(t-l.startTs)/6e4),h=Math.min(100,Math.max(0,Math.round(p/d*100))),f=Math.max(1,Math.round((l.endTs-t)/6e4)),v=a[s+1];return{title:l.title,timeRange:`${l.start} - ${l.end}`,start:l.start,end:l.end,progress:h,remainingMin:f,nextTitle:v?v.title:"Sonraki Program"}}}const o=a.find(s=>s.startTs>t);if(o)return{title:o.title,timeRange:`${o.start} - ${o.end}`,start:o.start,end:o.end,progress:5,remainingMin:Math.max(1,Math.round((o.endTs-t)/6e4)),nextTitle:"Yayın Başlamak Üzere"}}const i=new Date,n=i.getHours()*60+i.getMinutes();let r=fm[e.id];r||(r=Al[e.category]||Al.national);for(let a=0;a<r.length;a++){const o=r[a],s=Cl(o.start);let l=Cl(o.end);l<=s&&(l+=24*60);let d=n;if(s>l-24*60&&n<s&&n<l%(24*60)&&(d+=24*60),d>=s&&d<l){const p=l-s,h=d-s,f=Math.min(100,Math.max(0,Math.round(h/p*100))),v=Math.max(1,l-d),y=r[(a+1)%r.length];return{title:o.title,timeRange:`${o.start} - ${o.end}`,start:o.start,end:o.end,progress:f,remainingMin:v,nextTitle:y?y.title:"Sonraki Program"}}}return{title:`${e.name} Canlı Yayın`,timeRange:"Canlı Akış",start:"00:00",end:"23:59",progress:50,remainingMin:30,nextTitle:"Yayın Akışı Devam Ediyor"}}const ld="cinepulse_live_favs";function Il(){try{const e=localStorage.getItem(ld);return e?JSON.parse(e):[]}catch{return[]}}function vm(e){try{localStorage.setItem(ld,JSON.stringify(e))}catch{}}function bm(){const e=Rt(),t=b=>String(b||"").toLocaleUpperCase("tr-TR").replace(/\b(?:HD|FHD|4K|KANALI)\b/g,"").replace(/[^A-ZÇĞİÖŞÜ0-9]/g,""),i=[...za],n=e?i.filter(b=>b.category==="kids"):i;let r=e?"kids":"all",a=e?n.find(b=>b.id==="ch_trtcocuk")||n[0]:i.find(b=>b.id==="ch_trt1")||i[0],o="",s=null,l=!1,d=1,p=null,h=null;function f(b){return Il().includes(b)}function v(b){let E=Il();E.includes(b)?(E=E.filter(C=>C!==b),Q("Favorilerden çıkarıldı","info")):(E.push(b),Q("Favorilere eklendi ⭐","success")),vm(E),k()}function y(){return n.filter(b=>{let E=!0;r==="favorites"?E=f(b.id):r!=="all"&&(E=b.category===r);const C=!o||b.name.toLowerCase().includes(o.toLowerCase());return E&&C})}function w(b){return n.findIndex(E=>E.id===b.id)}let k=()=>{};return{html:`
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
              ${Vh.map(b=>`
                <button class="tv-cat-filter-btn ${b.id===r?"active":""}" data-cat="${b.id}">
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
  `,init:b=>{if(!b)return;gm();const E=Yh(),{setTimeout:C,clearTimeout:_,setInterval:T,clearInterval:I}=E,L=b.querySelector("#tv-video"),N=b.querySelector("#tv-screen"),O=b.querySelector("#tv-hero-player-section"),K=b.querySelector("#tv-screen-placeholder"),F=b.querySelector("#tv-screen-backdrop");b.querySelector("#tv-osd-topbar");const z=b.querySelector("#tv-top-logo"),P=b.querySelector("#tv-top-name"),Y=b.querySelector("#tv-top-num"),ne=b.querySelector("#tv-top-epg-title"),ee=b.querySelector("#tv-top-epg-prog");b.querySelector("#tv-pip-header");const re=b.querySelector("#tv-pip-logo"),H=b.querySelector("#tv-pip-name"),se=b.querySelector("#tv-pip-epg"),G=b.querySelector("#tv-pip-expand"),V=b.querySelector("#tv-pip-close"),ae=b.querySelector("#tv-osd"),fe=b.querySelector("#tv-osd-logo"),X=b.querySelector("#tv-osd-name"),$=b.querySelector("#tv-osd-quality"),M=b.querySelector("#tv-osd-chnum"),B=b.querySelector("#tv-osd-epg-sub"),W=b.querySelector("#tv-loading"),ie=b.querySelector("#tv-error"),x=b.querySelector("#tv-retry-btn"),A=b.querySelector("#tv-error-next-btn"),q=b.querySelector("#tv-btn-play-pause"),te=b.querySelector("#tv-btn-prev-ch"),be=b.querySelector("#tv-btn-next-ch"),le=b.querySelector("#tv-btn-sync"),he=b.querySelector("#tv-btn-mute"),Ze=b.querySelector("#tv-volume-slider"),Qe=b.querySelector("#tv-btn-reload"),Ue=b.querySelector("#tv-btn-fullscreen"),Re=b.querySelector("#tv-btn-quality"),De=b.querySelector("#tv-quality-badge"),Ne=b.querySelector("#tv-quality-menu"),We=b.querySelector("#tv-quality-options"),je=b.querySelector("#tv-btn-numpad"),oe=b.querySelector("#tv-numpad-modal"),g=b.querySelector("#tv-numpad-modal-backdrop"),c=b.querySelector("#tv-numpad-close"),u=b.querySelector("#tv-pad-display-val"),S=b.querySelector("#tv-pad-display-sub"),R=b.querySelector("#tv-numpad-hud"),D=b.querySelector("#tv-numpad-hud-digits"),U=b.querySelector("#tv-numpad-hud-name"),ue=b.querySelector("#tv-channel-grid"),Ie=b.querySelector("#tv-search"),xe=b.querySelector("#tv-search-clear"),ge=b.querySelector("#tv-category-strip"),Ee=b.querySelector("#tv-cat-prev"),Js=b.querySelector("#tv-cat-next"),Xs=b.querySelector("#tv-guide-count");function Rn(){const j=w(a)+1,Z=Xn(a);P&&(P.textContent=a.name),Y&&(Y.textContent=`CH ${String(j).padStart(2,"0")}`),ne&&(ne.textContent=`${Z.title} (${Z.timeRange})`),ee&&(ee.textContent=`%${Z.progress}`),z&&(z.src=a.logo,z.onerror=()=>{z.onerror=null,z.src=_t(a.name,a.category)}),H&&(H.textContent=a.name),se&&(se.textContent=`${Z.title} (%${Z.progress})`),re&&(re.src=a.logo,re.onerror=()=>{re.onerror=null,re.src=_t(a.name,a.category)})}function Zs(){Rn(),ue&&ue.querySelectorAll(".tv-grid-card").forEach(Z=>{const ye=Z.getAttribute("data-id"),we=i.find($e=>$e.id===ye);if(!we)return;const ce=Xn(we),ze=Z.querySelector(".tv-epg-title"),Ae=Z.querySelector(".tv-epg-time"),ot=Z.querySelector(".tv-epg-bar-fill"),pe=Z.querySelector(".tv-epg-pct");ze&&ze.textContent!==ce.title&&(ze.textContent=ce.title,ze.title=ce.title),Ae&&Ae.textContent!==ce.timeRange&&(Ae.textContent=ce.timeRange),ot&&(ot.style.width=`${ce.progress}%`),pe&&pe.textContent!==`%${ce.progress}`&&(pe.textContent=`%${ce.progress}`)})}const ia=()=>{Zs()};E.on(window,"epg-updated",ia);let Qs=T(()=>{if(!document.body.contains(b)){I(Qs),window.removeEventListener("epg-updated",ia);return}Zs()},2e4);function hd(){h&&_(h);const j=w(a),Z=Xn(a);fe&&(fe.src=a.logo,fe.onerror=()=>{fe.onerror=null,fe.src=_t(a.name,a.category)}),X&&(X.textContent=a.name),$&&($.textContent=a.quality),M&&(M.textContent=String(j+1).padStart(2,"0")),B&&(B.textContent=`📺 ${Z.title} • %${Z.progress} tamamlandı`),ae.classList.remove("hidden"),ae.classList.add("tv-osd-show"),h=C(()=>{ae.classList.remove("tv-osd-show"),ae.classList.add("tv-osd-hide"),C(()=>{ae.classList.add("hidden"),ae.classList.remove("tv-osd-hide")},350)},2500)}function $n(){N.classList.add("user-active"),p&&_(p),p=C(()=>{N.classList.remove("user-active"),Ne&&Ne.classList.add("hidden")},3500)}N.addEventListener("mousemove",$n),N.addEventListener("touchstart",$n,{passive:!0}),F&&(F.addEventListener("click",j=>{j.stopPropagation(),N.classList.contains("user-active")?(N.classList.remove("user-active"),p&&_(p),Ne&&Ne.classList.add("hidden")):$n()}),F.addEventListener("dblclick",j=>{j.stopPropagation(),Ue&&Ue.click()}));function Qi(j){j=Math.max(0,Math.min(1,j)),d=j,L.volume=j,Ze&&(Ze.value=j),j===0?(l=!0,L.muted=!0,he&&(he.innerHTML='<i data-lucide="volume-x" style="width:18px;height:18px;color:#ef4444;"></i>')):(l=!1,L.muted=!1,he&&(he.innerHTML='<i data-lucide="volume-2" style="width:18px;height:18px;"></i>')),J()}Ze&&Ze.addEventListener("input",j=>{Qi(parseFloat(j.target.value))}),he&&he.addEventListener("click",j=>{j.stopPropagation(),l?(Qi(d||.8),Q("Ses açıldı","info")):(L.muted=!0,l=!0,he.innerHTML='<i data-lucide="volume-x" style="width:18px;height:18px;color:#ef4444;"></i>',J(),Q("Sessize alındı","info"))}),q&&q.addEventListener("click",j=>{j.stopPropagation(),L.paused?(L.play(),q.innerHTML='<i data-lucide="pause" style="width:18px;height:18px;"></i>'):(L.pause(),q.innerHTML='<i data-lucide="play" style="width:18px;height:18px;"></i>'),J()}),le&&le.addEventListener("click",j=>{j.stopPropagation(),s&&L.seekable&&L.seekable.length>0?(L.currentTime=L.seekable.end(L.seekable.length-1),L.play(),Q("Canlı yayına eşitlendi","info")):si(a)});function na(j){if(!We||!De)return;if(!j||!j.levels||j.levels.length<=1){De.textContent=a.quality?a.quality.split(" ")[0]:"HD",We.innerHTML=`
            <button class="tv-quality-opt active" data-level="-1">
              <i data-lucide="check" style="width:13px;height:13px;color:#fbbf24;"></i>
              <span>Kaynak Kalite (${a.quality||"1080p"})</span>
            </button>
          `,J();return}const Z=j.levels,ye=j.currentLevel;let we=`
          <button class="tv-quality-opt ${ye===-1?"active":""}" data-level="-1">
            ${ye===-1?'<i data-lucide="check" style="width:13px;height:13px;color:#fbbf24;"></i>':'<span style="width:13px;display:inline-block;"></span>'}
            <span>Otomatik (Adaptive)</span>
          </button>
        `;if(Z.forEach((ce,ze)=>{const Ae=ce.height||(ce.attrs&&ce.attrs.RESOLUTION?ce.attrs.RESOLUTION.height:720),ot=Ae>=1080?"1080p FHD":Ae>=720?"720p HD":Ae>=480?"480p SD":`${Ae}p`,pe=ye===ze;we+=`
            <button class="tv-quality-opt ${pe?"active":""}" data-level="${ze}">
              ${pe?'<i data-lucide="check" style="width:13px;height:13px;color:#fbbf24;"></i>':'<span style="width:13px;display:inline-block;"></span>'}
              <span>${ot}</span>
            </button>
          `}),We.innerHTML=we,ye===-1)De.textContent="AUTO";else if(Z[ye]){const ce=Z[ye].height;De.textContent=ce?`${ce}p`:"HD"}We.querySelectorAll(".tv-quality-opt").forEach(ce=>{ce.addEventListener("click",ze=>{ze.stopPropagation();const Ae=parseInt(ce.dataset.level,10);if(s){s.currentLevel=Ae,na(s),Ne&&Ne.classList.add("hidden");const ot=ce.querySelector("span").textContent;Q(`Kalite ayarlandı: ${ot}`,"success")}})}),J()}Re&&Ne&&(Re.addEventListener("click",j=>{j.stopPropagation(),Ne.classList.toggle("hidden"),$n()}),E.on(document,"click",j=>{j.target.closest("#tv-quality-wrapper")||Ne.classList.add("hidden")}));let Mn=!1;function eo(){if(!O||!K||!N||document.fullscreenElement)return;const Z=O.getBoundingClientRect().bottom<80;Z&&L&&!L.paused&&!Mn?N.classList.contains("is-floating-pip")||(N.classList.add("is-floating-pip"),K.classList.add("is-active"),Rn()):Z||N.classList.contains("is-floating-pip")&&(N.classList.remove("is-floating-pip"),K.classList.remove("is-active"),Mn=!1)}E.on(window,"scroll",eo,{passive:!0}),G&&G.addEventListener("click",j=>{j.stopPropagation(),O&&O.scrollIntoView({behavior:"smooth",block:"start"})}),V&&V.addEventListener("click",j=>{j.stopPropagation(),Mn=!0,N.classList.remove("is-floating-pip"),K.classList.remove("is-active")});let He="",ra=null;function aa(j){if(j>=0&&j<i.length){const Z=i[j];Q(`Kanal ${j+1}: ${Z.name}`,"info"),si(Z),O&&O.scrollIntoView({behavior:"smooth",block:"start"})}else Q(`Kanal ${j+1} bulunamadı`,"warning");He="",R&&R.classList.add("hidden"),oe&&oe.classList.add("hidden")}function to(){if(!R||!D||!U)return;const j=parseInt(He,10),Z=i[j-1];D.textContent=He.padStart(2,"0"),U.textContent=Z?Z.name:"Geçersiz Kanal",R.classList.remove("hidden"),u&&(u.textContent=He.padStart(2,"0")),S&&(S.textContent=Z?Z.name:"Geçersiz Kanal"),ra&&_(ra),ra=C(()=>{He&&aa(j-1)},1300)}je&&oe&&je.addEventListener("click",j=>{j.stopPropagation(),He="",u&&(u.textContent="--"),S&&(S.textContent="Numara tuşlayın"),oe.classList.toggle("hidden")}),c&&c.addEventListener("click",()=>{oe.classList.add("hidden"),He=""}),g&&g.addEventListener("click",()=>{oe.classList.add("hidden"),He=""}),oe&&oe.querySelectorAll(".tv-num-key").forEach(j=>{j.addEventListener("click",Z=>{Z.stopPropagation();const ye=j.dataset.digit;if(ye==="clear")He="",u&&(u.textContent="--"),S&&(S.textContent="Numara tuşlayın");else if(ye==="ok"){if(He){const we=parseInt(He,10);aa(we-1)}}else He.length>=2&&(He=""),He+=ye,to()})});let Ye=0;async function si(j){const Z=++Ye;if(a=j,Mn=!1,Rn(),hd(),gd(),s){try{s.stopLoad(),s.detachMedia(),s.destroy()}catch{}s=null}if(L)try{L.pause(),L.removeAttribute("src"),L.load()}catch{}W.classList.remove("hidden"),ie.classList.add("hidden");const ye=()=>{Ye===Z&&(W.classList.add("hidden"),ie.classList.add("hidden"))};L.addEventListener("loadeddata",ye,{once:!0}),C(()=>{L.removeEventListener("loadeddata",ye),Ye===Z&&L.readyState<2&&Ve()},2e4);let we=!1,ce=0,ze=0,Ae=!1,ot=!1;async function pe(ke,Ce=!0){if(!j.officialLiveId||Ce&&ce>=2)return!1;Ce&&(ce+=1),we=!0,W.classList.remove("hidden"),ie.classList.add("hidden");try{const Kt=st(`/api/live_tv_stream?channel=${encodeURIComponent(j.officialLiveId)}&json=1&refresh=1&_=${Date.now()}`),li=await fetch(Kt,{cache:"no-store",headers:{Accept:"application/json"}});if(!li.ok)throw new Error(`Live resolver ${li.status}`);const ci=await li.json(),ao=ci?.proxiedUrl||ci?.url||"",Pn=ao?st(ao):"";if(!Pn)throw new Error("Live stream URL missing");if(j.streamUrl=Pn,Pn!==ke||Ce)return Mt(Pn),!0}catch{}return!1}async function $e(ke){if(j.officialLiveId)return pe(ke);if(we||!j.isTvr||!j.tvrId)return!1;we=!0,W.classList.remove("hidden"),ie.classList.add("hidden");try{const Ce=await Jn(j.tvrId,{forceRefresh:!0});if(Ye!==Z)return!0;if(Ce&&Ce!==ke)return j.streamUrl=Ce,Mt(Ce),!0}catch{}return!1}function Ve(){Ye===Z&&(W.classList.add("hidden"),ie.classList.remove("hidden"))}function Ai(ke){if(Ae||!/^https?:\/\//i.test(ke))return!1;Ae=!0;const Ce=`${new URL(ke).origin}/`,Kt=`/api/hls_proxy?url=${encodeURIComponent(ke)}&ref=${encodeURIComponent(Ce)}`;return j.streamUrl=Kt,Mt(Kt),!0}function Mt(ke){if(Ye===Z)if(ke=st(ke),oi.isSupported()){if(s){try{s.stopLoad(),s.detachMedia(),s.destroy()}catch{}s=null}const Ce=new oi({enableWorker:!0,lowLatencyMode:!0,startLevel:0,capLevelToPlayerSize:!0,backBufferLength:10,maxBufferLength:8,maxMaxBufferLength:15,liveSyncDurationCount:2,liveMaxLatencyDurationCount:5,manifestLoadingTimeOut:12e3,manifestLoadingMaxRetry:1,manifestLoadingRetryDelay:350,levelLoadingTimeOut:14e3,levelLoadingMaxRetry:1,fragLoadingTimeOut:12e3});s=Ce,Ce.loadSource(ke),Ce.attachMedia(L),Ce.on(oi.Events.MANIFEST_PARSED,()=>{if(Ye!==Z){try{Ce.stopLoad(),Ce.detachMedia(),Ce.destroy()}catch{}return}na(Ce),L.play().catch(()=>{})}),Ce.on(oi.Events.ERROR,(Kt,li)=>{if(!(Ye!==Z||s!==Ce)&&li.fatal)if(li.type===oi.ErrorTypes.NETWORK_ERROR)j.officialLiveId?pe(ke).then(ci=>{ci||Ve()}):j.isTvr&&j.tvrId?$e(ke).then(ci=>{!ci&&!Ai(ke)&&Ve()}):ze<1?(ze+=1,W.classList.remove("hidden"),C(()=>{Ye===Z&&s===Ce&&Mt(ke)},700)):Ai(ke)||Ve();else if(li.type===oi.ErrorTypes.MEDIA_ERROR)if(ot)Ve();else{ot=!0;try{Ce.recoverMediaError()}catch{Ve()}}else Ve()})}else L.canPlayType("application/vnd.apple.mpegurl")?(L.src=ke,L.addEventListener("loadedmetadata",()=>{Ye===Z&&(na(null),L.play().catch(()=>{}))},{once:!0}),L.addEventListener("error",()=>{Ye===Z&&$e(ke).then(Ce=>{!Ce&&!Ai(ke)&&Ve()})},{once:!0})):Ve()}let oi;try{oi=(await Rs(async()=>{const{default:ke}=await import("./hls-BuERnqCp.js");return{default:ke}},[],import.meta.url)).default}catch{Ve();return}Ye===Z&&(j.officialLiveId?pe("",!0).then(ke=>{ke||Ye!==Z||pe("",!0).then(Ce=>{!Ce&&Ye===Z&&Ve()})}):j.isTvr&&j.tvrId&&!j.streamUrl?Jn(j.tvrId).then(ke=>{Ye===Z&&(ke?(j.streamUrl=ke,Mt(ke)):Ve())}).catch(()=>{Ye===Z&&Ve()}):(Mt(j.streamUrl),j.isTvr&&j.tvrId&&Jn(j.tvrId).then(ke=>{ke&&(j.streamUrl=ke)}).catch(()=>{})),L.muted=l,L.volume=d)}function en(j){const Z=y();if(Z.length===0)return;const ye=Z.findIndex(ce=>ce.id===a.id);let we;j==="prev"||j==="up"?we=ye<=0?Z.length-1:ye-1:we=ye>=Z.length-1?0:ye+1,si(Z[we])}te&&te.addEventListener("click",j=>{j.stopPropagation(),en("prev")}),be&&be.addEventListener("click",j=>{j.stopPropagation(),en("next")}),A&&A.addEventListener("click",()=>en("next")),x&&x.addEventListener("click",()=>si(a)),Qe&&Qe.addEventListener("click",()=>{Q("Yayın yeniden yükleniyor...","info"),si(a)});function md(){const j=y();if(Xs&&(Xs.textContent=`${j.length} KANAL`),j.length===0){ue.innerHTML=`
            <div class="tv-catalog-empty-state">
              <i data-lucide="radio" style="width:40px;height:40px;color:var(--text-muted);"></i>
              <span class="tv-empty-title">Kanal Bulunamadı</span>
              <p class="tv-empty-sub">Arama teriminizi veya kategori filtrenizi değiştirin.</p>
            </div>
          `,J();return}ue.innerHTML=j.map(Z=>{const ye=Z.id===a.id,we=f(Z.id),ce=w(Z)+1,ze=_t(Z.name,Z.category),Ae=Xn(Z);return`
            <div class="tv-grid-card ${ye?"active":""}" data-id="${Z.id}">
              <div class="tv-grid-card-top">
                <span class="tv-grid-num">${String(ce).padStart(2,"0")}</span>
                <button class="tv-grid-fav-btn ${we?"is-fav":""}" data-favid="${Z.id}" title="${we?"Favorilerden Çıkar":"Favorilere Ekle"}">
                  <i data-lucide="star" style="width:15px;height:15px;${we?"fill:#fbbf24;color:#fbbf24;":""}"></i>
                </button>
              </div>

              <div class="tv-grid-logo-box">
                <img class="tv-grid-logo" src="${Z.logo}" alt="${Z.name}" onerror="this.onerror=null; this.src='${ze}';" loading="lazy" />
              </div>

              <div class="tv-grid-info">
                <span class="tv-grid-name" title="${Z.name}">${Z.name}</span>
                <div class="tv-grid-meta">
                  <span class="tv-grid-quality">${Z.quality}</span>
                  ${Z.isTvr?'<span class="tv-grid-vip-tag">VIP</span>':""}
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
          `}).join(""),ue.querySelectorAll(".tv-grid-card").forEach(Z=>{Z.addEventListener("click",ye=>{if(ye.target.closest(".tv-grid-fav-btn"))return;const we=i.find(ce=>ce.id===Z.dataset.id);we&&we.id!==a.id&&(si(we),O&&O.scrollIntoView({behavior:"smooth",block:"start"}))})}),ue.querySelectorAll(".tv-grid-fav-btn").forEach(Z=>{Z.addEventListener("click",ye=>{ye.stopPropagation(),v(Z.dataset.favid)})}),J()}function gd(){ue&&ue.querySelectorAll(".tv-grid-card").forEach(j=>{const Z=j.dataset.id===a.id;j.classList.toggle("active",Z);const ye=j.querySelector(".tv-grid-live-indicator");if(!Z&&ye&&ye.remove(),Z&&!ye){const we=document.createElement("div");we.className="tv-grid-live-indicator",we.innerHTML='<span class="tv-live-dot"></span><span>ŞU AN İZLENİYOR</span>',j.appendChild(we)}})}if(k=()=>{md(),Rn(),J()},Ie&&Ie.addEventListener("input",j=>{o=j.target.value.trim(),xe&&xe.classList.toggle("hidden",!o),k()}),xe&&xe.addEventListener("click",()=>{Ie.value="",o="",xe.classList.add("hidden"),k()}),ge){Ee&&Ee.addEventListener("click",ce=>{ce.stopPropagation(),ge.scrollBy({left:-220,behavior:"smooth"})}),Js&&Js.addEventListener("click",ce=>{ce.stopPropagation(),ge.scrollBy({left:220,behavior:"smooth"})}),ge.addEventListener("wheel",ce=>{Math.abs(ce.deltaY)>Math.abs(ce.deltaX)&&(ce.preventDefault(),ge.scrollLeft+=ce.deltaY)},{passive:!1});let j=!1,Z=0,ye=0,we=!1;ge.addEventListener("mousedown",ce=>{ce.button===0&&(j=!0,we=!1,Z=ce.pageX-ge.offsetLeft,ye=ge.scrollLeft)}),E.on(window,"mousemove",ce=>{if(!j)return;const Ae=(ce.pageX-ge.offsetLeft-Z)*1.5;Math.abs(Ae)>6&&(we=!0,ge.classList.add("is-dragging")),ge.scrollLeft=ye-Ae}),E.on(window,"mouseup",()=>{j&&(j=!1,ge.classList.remove("is-dragging"),C(()=>{we=!1},50))}),ge.querySelectorAll(".tv-cat-filter-btn").forEach(ce=>{ce.addEventListener("click",ze=>{if(we){ze.preventDefault();return}ge.querySelectorAll(".tv-cat-filter-btn").forEach(Ae=>Ae.classList.remove("active")),ce.classList.add("active"),r=ce.dataset.cat,ce.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"}),k()})})}Ue&&Ue.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen().catch(()=>{}):N.requestFullscreen().catch(()=>{})}),E.on(document,"fullscreenchange",()=>{const j=!!document.fullscreenElement;N.classList.toggle("is-fullscreen",j),Ue&&(Ue.innerHTML=j?'<i data-lucide="minimize-2" style="width:18px;height:18px;"></i>':'<i data-lucide="maximize-2" style="width:18px;height:18px;"></i>',J())});function io(j){if(document.activeElement!==Ie){if(j.key>="0"&&j.key<="9"){He.length>=2&&(He=""),He+=j.key,to();return}if(j.key==="Enter"&&He){j.preventDefault();const Z=parseInt(He,10);aa(Z-1);return}switch(j.key){case"ArrowUp":case"w":case"W":j.preventDefault(),en("prev");break;case"ArrowDown":case"s":case"S":j.preventDefault(),en("next");break;case"ArrowRight":j.preventDefault(),Qi(d+.05);break;case"ArrowLeft":j.preventDefault(),Qi(d-.05);break;case"m":case"M":he&&he.click();break;case"f":case"F":Ue&&Ue.click();break;case"r":case"R":Qe&&Qe.click();break;case" ":j.preventDefault(),q&&q.click();break}}}E.on(document,"keydown",io);let sa=null,oa=!1;const no=()=>{if(E.dispose(),ym(),Ye++,I(Qs),sa&&I(sa),window.removeEventListener("epg-updated",ia),window.removeEventListener("scroll",eo),s){try{s.stopLoad(),s.detachMedia(),s.destroy()}catch{}s=null}if(L)try{L.pause(),L.removeAttribute("src"),L.load()}catch{}document.removeEventListener("keydown",io)};window.__LiveTvController={cleanup:no};const la=new MutationObserver(()=>{document.contains(b)||(no(),la.disconnect())});la.observe(document.body,{childList:!0,subtree:!0}),E.add(()=>la.disconnect()),k(),si(a),Qi(1);const ro=async()=>{if(!(oa||!document.contains(b))){oa=!0;try{const j=await pm();if(!document.contains(b)||!Array.isArray(j))return;const Z=new Set(za.map(pe=>t(pe.name))),ye=new Set(za.filter(pe=>pe.tvrId).map(pe=>String(pe.tvrId))),we=j.filter(pe=>{const $e=t(pe.name);return $e&&!Z.has($e)&&!ye.has(String(pe.tvrId))}),ce=await Promise.all(we.map(async pe=>{const $e=await Jn(pe.tvrId,{forceRefresh:!0});if(!$e)return null;const Ve=i.find(Mt=>Mt.isDynamicTvr&&String(Mt.tvrId)===String(pe.tvrId)),Ai={...pe,isDynamicTvr:!0,streamUrl:$e,logo:pe.logo||_t(pe.name,pe.category)};return Ve?(Object.assign(Ve,Ai),Ve):Ai}));if(!document.contains(b))return;const ze=ce.filter(Boolean),Ae=new Set(ze.map(pe=>pe.id));let ot=!1;for(let pe=i.length-1;pe>=0;pe--){const $e=i[pe];$e.isDynamicTvr&&!Ae.has($e.id)&&$e.id!==a.id&&(i.splice(pe,1),ot=!0)}for(const pe of ze)i.some($e=>$e.id===pe.id)||(i.push(pe),ot=!0);if(e){for(let pe=n.length-1;pe>=0;pe--){const $e=n[pe];$e.isDynamicTvr&&!Ae.has($e.id)&&$e.id!==a.id&&n.splice(pe,1)}for(const pe of ze.filter($e=>$e.category==="kids"))n.some($e=>$e.id===pe.id)||n.push(pe)}ot&&k()}catch{}finally{oa=!1}}};ro(),sa=T(ro,30*1e3)}}}const wm=3e4,km=10*6e4,_m=5,Sm=6e4;let ea=0,_n=!1,Mr=0,lr=0,Pr=0;function xm(){ea=Date.now()+wm}function Em(){return cd()||ea>Date.now()}function cd(){return _n&&Mr<=Date.now()&&(_n=!1,Mr=0),_n}function Tm(){_n=!0,Mr=Date.now()+km,ea=0,lr=0,Pr=0}function Am(){_n=!1,Mr=0,ea=0}function ws(){return Math.max(0,Math.ceil((Pr-Date.now())/1e3))}function Cm(){return Pr>Date.now()||(lr+=1,lr>=_m&&(lr=0,Pr=Date.now()+Sm)),ws()}async function Lm(){if(!cd())return{html:`
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
      `,init:n=>{const r=n.querySelector("#admin-login-form"),a=n.querySelector("#admin-pin-input"),o=n.querySelector("#admin-login-error");r.addEventListener("submit",s=>{s.preventDefault();const l=a.value.trim(),d=ws();if(d>0){o.textContent=`Çok fazla hatalı deneme. ${d} saniye sonra tekrar deneyin.`,o.style.display="block";return}if(_d(l))Tm(),window.dispatchEvent(new CustomEvent("cinepulse_admin_state_changed"));else{const p=Cm();o.textContent=p>0?`Çok fazla hatalı deneme. ${p} saniye bekleyin.`:"Geçersiz PIN kodu!",o.style.display="block",a.classList.add("admin-input-error"),setTimeout(()=>a.classList.remove("admin-input-error"),400),a.value=""}}),J(n)}};const t=Dr();ti();const i=$t();return{html:`
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
    `,init:n=>{const r=n.querySelector("#admin-lock-btn");r&&r.addEventListener("click",()=>{Am(),window.location.hash="#home"});const a=n.querySelector("#admin-save-site-settings");a&&a.addEventListener("click",()=>{const h=n.querySelector("#admin-setting-landscape")?.checked===!0,f=n.querySelector("#admin-setting-hover")?.checked===!0,v=n.querySelector("#admin-setting-trailers")?.checked===!0,y=n.querySelector("#admin-setting-autoplay-next")?.checked===!0,w=n.querySelector("#admin-setting-subtitles")?.checked===!0,k=n.querySelector("#admin-setting-resolution")?.value||"1080p";ql({cardLayout:h?"landscape":"portrait",hoverPreviewsEnabled:f,trailersEnabled:v,autoplayNext:y,subtitlesEnabled:w,preferredResolution:k}),document.documentElement.classList.toggle("cards-landscape",h),alert("Tüm profil kontrolleri uygulandı.")});const o=n.querySelector("#admin-add-block-form"),s=n.querySelector("#admin-block-input");o&&s&&o.addEventListener("submit",h=>{h.preventDefault();const f=s.value.trim();f&&(Sd(f),bn(),window.location.reload())}),n.querySelectorAll(".admin-tag-del-btn").forEach(h=>{h.addEventListener("click",()=>{const f=h.getAttribute("data-entry");f&&(xd(f),bn(),window.location.reload())})});const l=n.querySelector("#admin-change-pin-form"),d=n.querySelector("#admin-new-pin");l&&d&&l.addEventListener("submit",h=>{h.preventDefault();const f=d.value.trim();f.length>=4&&(kd(f),alert("Yönetici PIN kodu başarıyla güncellendi!"),d.value="")});const p=n.querySelector("#admin-clear-cache-btn");p&&p.addEventListener("click",()=>{sessionStorage.clear(),bn(),alert("Sistem önbelleği başarıyla temizlendi."),window.location.reload()}),J(n)}}}const _i="https://dramadizilerim.com";function Im(e){return e?e.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-"):""}function Rl(e){return e?e.toLowerCase().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9]/g,""):""}async function ki(e,t={}){const i=typeof window<"u";let n=e;if(i)if(e.startsWith("http"))try{const r=new URL(e);n=`/api/ddz${r.pathname}${r.search}`}catch{n=e}else n=`/api/ddz${e.startsWith("/")?"":"/"}${e}`;else n.startsWith("http")||(n=`${_i}${n.startsWith("/")?"":"/"}${n}`);try{const r=await fetch(n,{...t,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Referer:_i,...t.headers||{}},signal:AbortSignal.timeout(t.timeout||6e3)}).catch(()=>null);if(r&&r.ok)return r}catch{}return null}function An(e){if(!e)return"";try{if(e.includes("image_proxy.php?url=")){const t=e.match(/url=([^&]+)/);if(t)return decodeURIComponent(t[1])}}catch{}return e}async function dd(e){if(!e||typeof e!="string"||e.trim().length<2)return[];const t=e.trim(),i=`/search?q=${encodeURIComponent(t)}`,n=await ki(i);if(!n)return[];const r=await n.text().catch(()=>"");if(!r)return[];const a=[],o=/<a[^>]+href=["'](?:https:\/\/dramadizilerim\.com)?\/dizi\/([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;let s;for(;(s=o.exec(r))!==null;){const l=s[1],d=s[2],p=d.match(/alt=["']([^"']+)["']/i)||d.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i),h=p?p[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():l,f=d.match(/src=["']([^"']+)["']/i),v=f?An(f[1].replace(/&amp;/g,"&")):"",y=h.toLowerCase().includes("dublaj");a.some(w=>w.slug===l)||a.push({title:h,slug:l,poster:v,isDubbed:y,url:`${_i}/dizi/${l}`})}return a}async function Rm(){const e=await ki("/");if(!e)return[];const t=await e.text().catch(()=>"");if(!t)return[];const i=[],n=/<a[^>]+href=["'](?:https:\/\/dramadizilerim\.com)?\/dizi\/([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;let r;for(;(r=n.exec(t))!==null;){const a=r[1],o=r[2],s=o.match(/src=["']([^"']+)["']/i),l=o.match(/alt=["']([^"']+)["']/i)||o.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i),d=l?l[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():a,p=s?An(s[1].replace(/&amp;/g,"&")):"",h=d.toLowerCase().includes("dublaj");i.some(f=>f.slug===a)||i.push({slug:a,title:d,poster:p,isDubbed:h,badge:h?"🇹🇷 DUBLAJ":"TR ALTYAZI",url:`${_i}/dizi/${a}`})}return i}async function Ha({page:e=1,query:t=""}={}){if(t&&t.trim().length>=2)return dd(t);const i=e>1?`/dizi?page=${e}`:"/dizi",n=await ki(i);if(!n)return[];const r=await n.text().catch(()=>"");if(!r)return[];const a=[],o=/<a[^>]+href=["'](?:https:\/\/dramadizilerim\.com)?\/dizi\/([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;let s;for(;(s=o.exec(r))!==null;){const l=s[1],d=s[2],p=d.match(/src=["']([^"']+)["']/i),h=d.match(/alt=["']([^"']+)["']/i)||d.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i),f=h?h[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():l,v=p?An(p[1].replace(/&amp;/g,"&")):"",y=f.toLowerCase().includes("dublaj");a.some(w=>w.slug===l)||a.push({slug:l,title:f,poster:v,isDubbed:y,badge:y?"🇹🇷 DUBLAJ":"TR ALTYAZI",url:`${_i}/dizi/${l}`})}return a}async function $m(e){if(!e)return null;const t=await ki(`/dizi/${e}`);if(!t)return null;const i=await t.text().catch(()=>"");if(!i)return null;const n=i.match(/<h1[^>]*>(.*?)<\/h1>/i),r=n?n[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():e;let a="";const s=[...i.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(v=>v[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,"&").trim()).filter(v=>{if(v.length<25)return!1;const y=v.toLowerCase();return!(y.includes("çerez")||y.includes("cookie")||y.includes("reklam")||y.includes("tüm hakları")||y.includes("bildirim")||y.includes("yapay zeka")||y.includes("bize bildirin")||y.includes("aradığınız dizi"))});if(s.length>0&&(s.sort((v,y)=>y.length-v.length),a=s[0]),!a||a.length<25){const v=i.match(/<meta\s+(?:property=["']og:description["']|name=["']description["'])\s+content=["']([^"']+)["']/i)||i.match(/<meta\s+content=["']([^"']+)["']\s+(?:property=["']og:description["']|name=["']description["'])/i);if(v&&v[1]&&v[1].trim().length>15){const y=v[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,"&").trim();y.toLowerCase().includes("aradığınız dizi")||(a=y)}}(!a||a.includes("Bu dizi için konu özeti henüz eklenmedi"))&&(a=`${r} - Tüm bölümleri yüksek kalitede, kesintisiz ve donmadan Türkçe dublaj ve altyazı seçenekleriyle CinePulse Kısa Dizi Evreni'nde izleyin.`);const l=i.match(/<div class=["'][^"']*poster[^"']*["'][^>]*>[\s\S]*?<img[^>]+src=["']([^"']+)["']/i)||i.match(/<img[^>]+class=["'][^"']*spotlight[^"']*["'][^>]+src=["']([^"']+)["']/i),d=l?An(l[1].replace(/&amp;/g,"&")):"",p=/<a[^>]+href=["'](?:\/izle\/|https:\/\/dramadizilerim\.com\/izle\/)([a-zA-Z0-9_-]+)\?s=(\d+)&e=(\d+)["'][^>]*>([\s\S]*?)<\/a>/gi,h=[];let f;for(;(f=p.exec(i))!==null;){const v=parseInt(f[2],10)||1,y=parseInt(f[3],10)||1,w=f[4],k=w.match(/class=["']wp-enum["']>([^<]+)</i)||w.match(/alt=["']([^"']+)["']/i),m=k?k[1].trim():`Bölüm ${y}`,b=w.match(/src=["']([^"']+)["']/i),E=b?An(b[1].replace(/&amp;/g,"&")):"";h.some(C=>C.season===v&&C.episode===y)||h.push({season:v,episode:y,title:m,thumb:E})}return h.sort((v,y)=>v.season-y.season||v.episode-y.episode),{slug:e,title:r,poster:d,description:a,isDubbed:r.toLowerCase().includes("dublaj"),totalEpisodes:h.length,episodes:h}}async function tg({titles:e=[],seriesTitle:t="",season:i=1,episode:n=1,isDub:r=!0}){const a=[...new Set([...e,t])].filter(C=>C&&typeof C=="string"&&C.trim().length>1);if(a.length===0)return[];const o=parseInt(i,10)||1,s=parseInt(n,10)||1;let l=null,d=null;for(const C of a){const _=Im(C),T=`/izle/${_}?s=${o}&e=${s}`,I=await ki(T,{method:"HEAD",timeout:3500});if(I&&I.ok){l=_;break}}if(!l)for(const C of a){const _=await dd(C);if(_.length>0){for(const L of _)if(gs(L.title,a,.75)){l=L.slug,d=L;break}if(l)break;const T=Rl(C),I=_.find(L=>{const N=Rl(L.title);return N===T||N.includes(T)||T.includes(N)});if(I){l=I.slug,d=I;break}}}if(!l)return[];const p=`/izle/${l}?s=${o}&e=${s}`,h=await ki(p);if(!h)return[];const f=await h.text().catch(()=>"");if(!f)return[];const v=f.match(/(?:data-src|src)=["']([^"']*embed\.php[^"']*)["']/i);if(!v)return[];let y=v[1].replace(/&amp;/g,"&");y.startsWith("http")||(y=`${_i}${y.startsWith("/")?"":"/"}${y}`);const w=await ki(y,{headers:{Referer:`${_i}${p}`}});if(!w)return[];const k=await w.text().catch(()=>"");if(!k)return[];const m=[],b=k.match(/let\s+source\s*=\s*["']([^"']+)["']/);let E=b&&b[1].startsWith("http")?b[1]:null;if(!E){const C=k.match(/https?:\/\/[^"'\s\\]+\.(?:m3u8|mp4)[^"'\s\\]*/);C&&(E=C[0])}if(E){const C=E.includes(".m3u8")||E.includes("mpegurl"),I=(d?.title||l).toLowerCase().includes("dublaj")||r===!0?`🇹🇷 DDZ VIP S${o}E${s} (TR Dublaj)`:`⚡ DDZ VIP S${o}E${s} (TR Altyazı)`;m.push({id:`ddz_ep_${l}_${o}_${s}`,name:I,displayName:I,badge:"🎭 DDZ VIP",source:"DDZ VIP",url:E,streamUrl:E,rawStreamUrl:E,quality:"1080p HD",isHls:C,isDirectVideo:!0,priority:2,getUrl:()=>E})}return m}async function Mm(e=null,t=""){let i=t?"search":"trending",n=t||"",r=1,a=[],o=null,s="";const l=[{id:"trending",label:"Trendler",icon:"flame",query:""},{id:"all",label:"Tüm Katalog",icon:"layers",query:""},{id:"dubbed",label:"Türkçe Dublaj",icon:"sparkles",query:"dublaj"},{id:"patron",label:"CEO & Patron",icon:"briefcase",query:"patron"},{id:"kurt",label:"Kurt & Alfa",icon:"moon",query:"kurt"},{id:"intikam",label:"İntikam & Aşk",icon:"heart-crack",query:"intikam"},{id:"milyarder",label:"Milyarder",icon:"crown",query:"milyarder"},{id:"evlilik",label:"Yasak Aşk & Evlilik",icon:"ring",query:"evlilik"}];return{html:`
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
  `,init:async p=>{const h=p.querySelector("#drama-view-root");if(!h)return;const f=h.querySelector("#drama-search-input"),v=h.querySelector("#btn-drama-search-clear");h.querySelector("#drama-search-feedback");const y=h.querySelectorAll(".drama-chip"),w=h.querySelector("#drama-section-title"),k=h.querySelector("#drama-counter-badge"),m=h.querySelector("#drama-cards-grid"),b=h.querySelector("#drama-load-more-wrap"),E=h.querySelector("#btn-drama-load-more"),C=h.querySelector("#drama-detail-modal"),_=h.querySelector("#drama-modal-dialog");let T=null;async function I(z=!1){z||(m.innerHTML=Array.from({length:12}).map(()=>`
            <div class="drama-card-skeleton">
              <div class="skeleton-poster"></div>
              <div class="skeleton-title"></div>
            </div>
          `).join(""),k.textContent="Yükleniyor...");try{let P=[];if(n&&n.trim().length>=2)P=await Ha({query:n.trim()}),w.innerHTML=`
              <i data-lucide="search" style="width: 20px; height: 20px; color: #a855f7;"></i>
              <span>"${n}" İçin Arama Sonuçları</span>
            `,b.classList.add("hidden");else{const Y=l.find(ne=>ne.id===i)||l[0];i==="trending"?(P=await Rm(),w.innerHTML=`
                <i data-lucide="flame" style="width: 20px; height: 20px; color: #f43f5e;"></i>
                <span>Trend Kısa Diziler</span>
              `,b.classList.add("hidden")):i==="all"?(P=await Ha({page:r}),w.innerHTML=`
                <i data-lucide="layers" style="width: 20px; height: 20px; color: #3b82f6;"></i>
                <span>Tüm Kısa Diziler Kataloğu (Sayfa ${r})</span>
              `,b.classList.toggle("hidden",P.length===0)):Y.query&&(P=await Ha({query:Y.query}),w.innerHTML=`
                <i data-lucide="${Y.icon}" style="width: 20px; height: 20px; color: #c084fc;"></i>
                <span>${Y.label} Serileri</span>
              `,b.classList.add("hidden"))}z?a=[...a,...P]:a=P,L()}catch{m.innerHTML=`
            <div class="drama-empty-state">
              <i data-lucide="alert-circle" style="width: 44px; height: 44px; color: #ef4444;"></i>
              <h3>Diziler yüklenirken bir sorun oluştu</h3>
              <p>Lütfen internet bağlantınızı kontrol edip tekrar deneyin.</p>
              <button class="btn-primary" id="btn-drama-retry">Tekrar Dene</button>
            </div>
          `,h.querySelector("#btn-drama-retry")?.addEventListener("click",()=>I(!1)),J(m)}finally{}}function L(){if(!a||a.length===0){m.innerHTML=`
            <div class="drama-empty-state">
              <i data-lucide="film" style="width: 48px; height: 48px; color: #94a3b8;"></i>
              <h3>Eşleşen Kısa Dizi Bulunamadı</h3>
              <p>Farklı bir anahtar kelime ile arama yapabilir veya Trend kategorisine göz atabilirsiniz.</p>
            </div>
          `,k.textContent="0 Dizi",J(m);return}k.textContent=`${a.length} Dizi`,m.innerHTML=a.map((z,P)=>{const Y=z.isDubbed||z.title.toLowerCase().includes("dublaj"),ne=z.poster||"";return`
            <article class="drama-card" data-slug="${z.slug}" tabindex="0" role="button" aria-label="${z.title}">
              <div class="drama-card-poster-wrap">
                ${ne?`
                  <img 
                    src="${ne}" 
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
                  <span class="drama-badge-pill ${Y?"badge-dub":"badge-sub"}">
                    ${Y?"🇹🇷 DUBLAJ":"TR ALTYAZI"}
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
          `}).join(""),J(m),m.querySelectorAll(".drama-card").forEach(z=>{z.addEventListener("click",()=>{const P=z.getAttribute("data-slug");P&&N(P)}),z.addEventListener("keydown",P=>{if(P.key==="Enter"||P.key===" "){P.preventDefault();const Y=z.getAttribute("data-slug");Y&&N(Y)}})})}async function N(z){if(z){o=null,C.classList.remove("hidden"),document.body.style.overflow="hidden",_.innerHTML=`
          <div class="drama-detail-loading">
            <div class="spin-loader"></div>
            <span>Dizi bilgileri ve bölümler yükleniyor...</span>
          </div>
        `,J(_);try{const P=await $m(z);if(!P){_.innerHTML=`
              <div class="drama-empty-state">
                <i data-lucide="alert-circle" style="width: 38px; height: 38px; color: #ef4444;"></i>
                <h3>Dizi bilgisi alınamadı</h3>
                <button class="btn-primary" id="btn-close-drama-modal">Kapat</button>
              </div>
            `,h.querySelector("#btn-close-drama-modal")?.addEventListener("click",K),J(_);return}o=P,O()}catch{K(),Q("Dizi detayları yüklenemedi.","error")}}}function O(){if(!o)return;const{slug:z,title:P,poster:Y,description:ne,episodes:ee=[],isDubbed:re}=o,H=ee.length,se=s?ee.filter(V=>V.title.toLowerCase().includes(s)||String(V.episode).includes(s)):ee;_.innerHTML=`
          <button class="drama-modal-close-btn" id="btn-close-drama-modal" title="Kapat">
            <i data-lucide="x" style="width: 20px; height: 20px;"></i>
          </button>

          <div class="drama-detail-hero">
            <div class="drama-detail-backdrop-blur" style="background-image: url('${Y||""}');"></div>
            <div class="drama-detail-hero-content">
              <div class="drama-detail-poster-wrap">
                <img src="${Y||""}" alt="${P}" class="drama-detail-poster" />
              </div>
              <div class="drama-detail-info">
                <div class="drama-detail-badges">
                  <span class="drama-badge-pill ${re?"badge-dub":"badge-sub"}">
                    ${re?"🇹🇷 TÜRKÇE DUBLAJ":"TR ALTYAZI"}
                  </span>
                  <span class="drama-badge-pill badge-type">MİNİ DİZİ</span>
                  <span class="drama-badge-pill badge-ep-count">${H} BÖLÜM</span>
                  <span class="drama-badge-pill badge-server">DDZ VIP HLS</span>
                </div>
                <h2 class="drama-detail-title">${P}</h2>
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
                <h3>Bölümler (${H})</h3>
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
              ${se.map(V=>{const ae=Sn(`ddz_${z}`,V.season,V.episode);return`
                  <button 
                    class="drama-ep-card ${ae?"is-watched":""}" 
                    data-season="${V.season}" 
                    data-episode="${V.episode}"
                  >
                    <div class="drama-ep-thumb-wrap">
                      ${V.thumb?`
                        <img src="${V.thumb}" alt="${V.title}" loading="lazy" />
                      `:`
                        <div class="drama-ep-fallback-thumb">
                          <i data-lucide="play" style="width: 16px; height: 16px; color: #c084fc;"></i>
                        </div>
                      `}
                      <span class="drama-ep-num-pill">${V.episode}</span>
                      ${ae?'<div class="drama-ep-watched-tag"><i data-lucide="check" style="width: 12px; height: 12px;"></i></div>':""}
                    </div>
                    <div class="drama-ep-title-wrap">
                      <span class="drama-ep-name">${V.title}</span>
                      <span class="drama-ep-action-hint">İzle</span>
                    </div>
                  </button>
                `}).join("")}
            </div>
          </div>
        `,J(_),_.querySelector("#btn-close-drama-modal")?.addEventListener("click",K),_.querySelector("#btn-play-drama-start")?.addEventListener("click",()=>{ee.length>0&&F(ee[0].season,ee[0].episode)}),_.querySelector("#btn-share-drama")?.addEventListener("click",()=>{const V=`${window.location.origin}${window.location.pathname}#dramas?slug=${z}`;navigator.clipboard?.writeText(V).then(()=>{Q("Dizi bağlantısı panoya kopyalandı!","success")}).catch(()=>{Q(`Bağlantı: ${V}`,"info")})});const G=_.querySelector("#drama-ep-filter-input");G&&G.addEventListener("input",V=>{s=V.target.value.toLowerCase().trim(),O(),_.querySelector("#drama-ep-filter-input")?.focus()}),_.querySelectorAll(".drama-ep-card").forEach(V=>{V.addEventListener("click",()=>{const ae=parseInt(V.getAttribute("data-season"),10)||1,fe=parseInt(V.getAttribute("data-episode"),10)||1;F(ae,fe)})})}function K(){C.classList.add("hidden"),document.body.style.overflow="",o=null,s=""}C.addEventListener("click",z=>{z.target===C&&K()});function F(z=1,P=1){if(!o)return;const{slug:Y,title:ne,poster:ee,description:re,episodes:H=[]}=o,se=H.find(G=>G.season===z&&G.episode===P)?.thumb||"";ri({type:"tv",tmdbId:`ddz_${Y}`,title:`${ne} - B${P}`,seriesTitle:ne,season:z,episode:P,posterPath:ee,backdropPath:ee,playerVariant:"short-drama",seriesOverview:re||"",episodeArtworkPath:se||ee,shortDramaEpisodes:H,maxEpisodes:H.length,seasonsList:[{season_number:z,episode_count:H.length}]})}f?.addEventListener("input",z=>{const P=z.target.value;v.classList.toggle("hidden",!P),clearTimeout(T),T=setTimeout(()=>{n=P.trim(),r=1,i=n?"search":"trending",y.forEach(Y=>Y.classList.toggle("active",!n&&Y.getAttribute("data-tab-id")==="trending")),I(!1)},350)}),f?.addEventListener("keydown",z=>{z.key==="Enter"&&(z.preventDefault(),clearTimeout(T),n=f.value.trim(),r=1,I(!1))}),v?.addEventListener("click",()=>{f.value="",v.classList.add("hidden"),n="",i="trending",y.forEach(z=>z.classList.toggle("active",z.getAttribute("data-tab-id")==="trending")),I(!1)}),y.forEach(z=>{z.addEventListener("click",()=>{const P=z.getAttribute("data-tab-id");i===P&&!n||(i=P,n="",f&&(f.value=""),v?.classList.add("hidden"),r=1,y.forEach(Y=>Y.classList.toggle("active",Y===z)),I(!1))})}),E?.addEventListener("click",()=>{r++,I(!0)}),await I(!1),e&&N(e)}}}const qa=[{id:"user-circle",icon:"user",label:"Klasik",color:"#f59e0b"},{id:"clapperboard",icon:"clapperboard",label:"Sinema",color:"#ec4899"},{id:"film",icon:"film",label:"Yıldız",color:"#8b5cf6"},{id:"sparkles",icon:"sparkles",label:"Sihirli",color:"#10b981"},{id:"tv",icon:"tv",label:"Dizi Kolik",color:"#3b82f6"},{id:"baby",icon:"baby",label:"Çocuk",color:"#38bdf8"},{id:"smile",icon:"smile",label:"Neşeli",color:"#eab308"},{id:"flame",icon:"flame",label:"Ateşli",color:"#ef4444"}];function Pm(){if(Ml()||document.getElementById("profile-onboarding-overlay"))return;const e=document.createElement("div");e.id="profile-onboarding-overlay",e.className="onboarding-overlay",e.innerHTML=`
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
            ${qa.map((o,s)=>`
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
  `,document.body.appendChild(e),window.lucide&&J(e);let t=qa[0].id,i=qa[0].color;e.querySelectorAll(".onboarding-avatar-btn").forEach(o=>{o.addEventListener("click",()=>{e.querySelectorAll(".onboarding-avatar-btn").forEach(s=>s.classList.remove("selected")),o.classList.add("selected"),t=o.getAttribute("data-avatar"),i=o.getAttribute("data-color")})});const n=e.querySelector("#onboarding-form"),r=e.querySelector("#onboarding-name-input"),a=e.querySelector("#onboarding-is-kid");n.addEventListener("submit",o=>{o.preventDefault();const s=r.value.trim();s&&(bd({name:s,avatar:t,color:i,isKid:a.checked}),e.classList.add("animate-fade-out"),setTimeout(()=>{e.remove(),window.location.reload()},280))})}const dn=[{icon:"sparkles",eyebrow:"CinePulse rehberi",title:"İzlemeye hazır bir ana ekran",text:"Ana sayfadaki satırları yatay kaydırarak yapımları gez. Arama simgesinden dizi veya film adını yazdığında sonuçlar anında görünür.",hint:"Mobilde alt menüden Diziler, Filmler, Keşfet ve Listem’e geçebilirsin."},{icon:"clapperboard",eyebrow:"Fragman önizleme",title:"Karttan fragmana bak",text:"Telefonda bir içerik kartına kısa süre basılı tut; fragman ekranın alt kısmında açılır. Bilgisayarda kartın üzerine gelmen yeterli.",hint:"Önizlemeyi sağ üstteki çarpıdan kapatabilir, ses simgesinden sesi açabilirsin."},{icon:"list-plus",eyebrow:"Kişisel liste",title:"Listem senin kontrolünde",text:"İçerik detayındaki artı düğmesiyle yapımları Listem’e ekle. Listem sayfasından kaydettiğin yapımları açabilir veya kaldırabilirsin.",hint:"İzleme ilerlemen de aynı tarayıcıda otomatik hatırlanır."},{icon:"shield-check",eyebrow:"Spoilersız keşif",title:"Diziyi güvenle incele",text:"Dizi detayında “Spoilersız keşfet” seçeneğini açarsan, izleme ilerlemenin sonrasındaki bölüm başlıkları, görselleri ve özetleri gizlenir.",hint:"İzlediğin bölüme ve sıradaki bölüme kadar detay görürsün; ilerledikçe yeni bölümler açılır."},{icon:"users-round",eyebrow:"Birlikte Seç",title:"Arkadaşınla aynı odada izle",text:"Üstteki Birlikte Seç düğmesinden oda oluştur veya altı haneli kodla bir odaya katıl. Moderatör içerik ve kaynak seçer; odada emoji ve sohbet de kullanabilirsin.",hint:"Oynatıcıdaki “Odaya dön” düğmesindeki rozet yeni sohbet mesajlarını gösterir."},{icon:"monitor-play",eyebrow:"Oynatıcı",title:"Kontroller elinin altında",text:"İçeriği açınca ekrana bir kez dokunarak kontrolleri göster. Zaman çubuğundan sarabilir, kaynakları değiştirebilir, altyazı ve ses seçebilirsin.",hint:"Tam ekran, ses ve parlaklık ayarları her cihazda sana ait kalır."}];function Bm(){if(!Ml()||yd()||document.getElementById("cinepulse-product-tour"))return;let e=0;const t=document.body.style.overflow,i=document.createElement("section");i.id="cinepulse-product-tour",i.className="product-tour-overlay",i.setAttribute("role","dialog"),i.setAttribute("aria-modal","true"),i.setAttribute("aria-label","CinePulse kullanım rehberi");const n=()=>{vd(),document.body.style.overflow=t,i.classList.add("is-leaving"),window.setTimeout(()=>i.remove(),180)},r=()=>{const a=dn[e];i.innerHTML=`
      <div class="product-tour-card">
        <button class="product-tour-skip" type="button" aria-label="Rehberi kapat">Geç <i data-lucide="x"></i></button>
        <div class="product-tour-icon"><i data-lucide="${a.icon}"></i></div>
        <p class="product-tour-eyebrow">${a.eyebrow}</p>
        <h2>${a.title}</h2>
        <p class="product-tour-text">${a.text}</p>
        <div class="product-tour-hint"><i data-lucide="lightbulb"></i><span>${a.hint}</span></div>
        <div class="product-tour-footer">
          <div class="product-tour-progress" aria-label="Adım ${e+1} / ${dn.length}">
            ${dn.map((o,s)=>`<span class="${s===e?"is-active":""}"></span>`).join("")}
          </div>
          <div class="product-tour-actions">
            ${e>0?'<button class="product-tour-back" type="button">Geri</button>':""}
            <button class="product-tour-next" type="button">${e===dn.length-1?"Hazırım":"Devam"} <i data-lucide="arrow-right"></i></button>
          </div>
        </div>
      </div>
    `,J(i),i.querySelector(".product-tour-skip")?.addEventListener("click",n),i.querySelector(".product-tour-back")?.addEventListener("click",()=>{e=Math.max(0,e-1),r()}),i.querySelector(".product-tour-next")?.addEventListener("click",()=>{e>=dn.length-1?n():(e+=1,r())})};document.body.appendChild(i),document.body.style.overflow="hidden",r()}function Dm(e){const t=e==="landscape";document.querySelectorAll(".card-poster-img").forEach(n=>{const r=t?n.dataset.backdropSrc||n.src:n.dataset.posterSrc||n.src;!r||n.src===r||(n.src=r,n.dataset.activeLayout=e)})}function zm(){const e=$t().cardLayout==="landscape"?"landscape":"portrait";return`
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
  `}function Om(e=document){const t=e.querySelector("#card-layout-switcher");if(!t)return;const i=[...t.querySelectorAll(".card-layout-option")],n=()=>{t.isConnected&&Gi(document,!1)};"requestIdleCallback"in window?window.requestIdleCallback(n,{timeout:1e3}):setTimeout(n,300),i.forEach(r=>{r.addEventListener("click",a=>{a.preventDefault();const o=r.dataset.layout==="landscape"?"landscape":"portrait",s=o==="landscape",l=document.documentElement.classList.contains("cards-landscape")?"landscape":"portrait";o!==l&&(document.documentElement.classList.toggle("cards-landscape",s),i.forEach(d=>{const p=d.dataset.layout===o;d.classList.toggle("active",p),d.setAttribute("aria-pressed",String(p))}),Dm(o),ql({cardLayout:o}),s&&Gi(document,!0))})})}const ta=!!(window.Capacitor?.isNativePlatform?.()&&window.Capacitor?.getPlatform?.()==="android");document.documentElement.classList.toggle("native-android",ta);const ud=matchMedia("(max-width: 768px)");document.documentElement.classList.toggle("mobile-web",!ta&&ud.matches);ud.addEventListener?.("change",e=>{document.documentElement.classList.toggle("mobile-web",!ta&&e.matches)});if(ta){const e=window.fetch.bind(window),t="https://cine-pulse-drab.vercel.app";window.fetch=(i,n)=>{if(typeof i=="string"&&i.startsWith("/api/"))i=`${t}${i}`;else if(i instanceof URL&&i.origin===window.location.origin&&i.pathname.startsWith("/api/"))i=`${t}${i.pathname}${i.search}${i.hash}`;else if(typeof Request<"u"&&i instanceof Request){const r=new URL(i.url);r.origin===window.location.origin&&r.pathname.startsWith("/api/")&&(i=new Request(`${t}${r.pathname}${r.search}${r.hash}`,i))}return e(i,n)}}if(typeof window<"u")try{Za.addListener("backButton",({canGoBack:e})=>{const t=document.getElementById("player-modal-container")||document.querySelector(".player-modal-overlay");if(t){const r=document.getElementById("player-close-btn");r?r.click():t.remove();return}const i=document.querySelector(".modal-overlay, .decision-modal-overlay, .profile-modal-overlay, .data-manager-modal");if(i){const r=i.querySelector('.modal-close, .btn-modal-close, [data-action="close"]');r?r.click():i.remove();return}const n=window.location.hash||"#home";if(n!=="#home"&&n!==""){e?window.history.back():window.location.hash="#home";return}Za.exitApp()})}catch{}"scrollRestoration"in history&&(history.scrollRestoration="manual");"serviceWorker"in navigator&&window.location.protocol.startsWith("http")&&window.addEventListener("load",()=>{const e="20260920-mobile-preview-2",t=`cinepulse-sw-reloaded-${e}`;navigator.serviceWorker.addEventListener("controllerchange",()=>{sessionStorage.getItem(t)||(sessionStorage.setItem(t,"1"),window.location.reload())}),navigator.serviceWorker.register(`/sw.js?build=${e}`,{updateViaCache:"none"}).then(i=>i.update()).catch(()=>{})});ku();window.addEventListener("keydown",e=>{e.ctrlKey&&e.altKey&&e.shiftKey&&e.key==="F10"&&(e.preventDefault(),e.stopImmediatePropagation(),xm(),window.location.hash="#admin")},!0);const ui=document.getElementById("app");document.documentElement.classList.toggle("cards-landscape",$t().cardLayout==="landscape");typeof navigator<"u"&&navigator.onLine===!1&&window.location.hash!=="#downloads"&&(window.location.hash="#downloads");window.addEventListener("scroll",()=>{Qf()},{passive:!0});window.addEventListener("pagehide",Xr);let Fa=0;async function Zi(){const e=++Fa;uh(),Xr();const t=window.location.hash||"#home";let i="home",n={};if(t.startsWith("#detail")){if(i="detail",t.includes("?")){const l=t.split("?")[1]||"",d=new URLSearchParams(l);n.type=d.get("type")||"tv",n.id=d.get("id")}else if(t.includes("/")){const l=t.split("/");l.length>=3?(n.type=l[1]||"tv",n.id=l[2]):l.length===2&&(n.type="tv",n.id=l[1])}}else if(t==="#series")i="series";else if(t==="#cartoons")i="cartoons";else if(t==="#movies")i="movies";else if(t==="#anime")i="anime";else if(t==="#documentary")i="documentary";else if(t==="#livetv")i="livetv";else if(t==="#discover")i="discover";else if(t==="#library")i="library";else if(t==="#downloads")i="downloads";else if(t.startsWith("#dramas")){if(i="dramas",t.includes("?")){const l=t.split("?")[1]||"",d=new URLSearchParams(l);n.slug=d.get("slug"),n.q=d.get("q")}}else if(t==="#admin"){if(!Em()){window.location.replace("#home");return}i="admin"}if(window.__popularListCleanup?.(),window.__popularListCleanup=null,window.__discoverCleanup?.(),window.__discoverCleanup=null,window.__LiveTvController&&typeof window.__LiveTvController.cleanup=="function"&&window.__LiveTvController.cleanup(),document.querySelectorAll("video, audio").forEach(l=>{try{l.pause(),l.removeAttribute("src"),l.load()}catch{}}),i==="admin"){const l=await Lm();if(e!==Fa)return;ui.innerHTML=`
      <div class="admin-standalone-wrapper" style="min-height: 100vh; background: #07090e; display: flex; flex-direction: column; width: 100%;">
        ${l?l.html:""}
      </div>
    `,l&&typeof l.init=="function"&&l.init(ui),J();return}const r=Gf(i),o=new Set(["home","series","cartoons","movies","anime","documentary","discover","library"]).has(i)?zm():"";(i==="home"||i==="detail")&&(ui.innerHTML=`${r}<main class="route-loading" aria-live="polite"><div class="spin-loader"></div><span>İçerikler yükleniyor...</span></main>`,fl(),J(ui));let s=null;i==="home"?s=await hh():i==="detail"?s=await Mh(n.type,n.id):i==="series"?s=await ln("tv"):i==="cartoons"?s=await ln("cartoon"):i==="movies"?s=await ln("movie"):i==="anime"?s=await ln("anime"):i==="documentary"?s=await ln("documentary"):i==="livetv"?s=bm():i==="discover"?s=await jh("tv"):i==="library"?s=qh():i==="downloads"?s=Uh():i==="dramas"&&(s=await Mm(n.slug,n.q)),e===Fa&&(ui.innerHTML=`
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
  `,fl(),Om(ui),s&&s.init&&s.init(ui),window.lucide&&J(),eh(t))}window.addEventListener("hashchange",Zi);window.addEventListener("offline",()=>{window.location.hash!=="#downloads"&&(window.location.hash="#downloads")});Zi();setTimeout(async()=>{try{const e=String(new URL(window.location.href).searchParams.get("oda")||"").replace(/\D/g,"");if(!/^\d{6}$/.test(e))return;xr({roomCode:e})}catch{}},700);setTimeout(()=>{Pm()},400);setTimeout(()=>{Bm()},1200);const pd={getWatchHistory:Be,saveWatchProgress:Ss,saveBatchWatchProgress:Dl};window.addEventListener("cinepulse_trakt_auth_changed",e=>{e.detail?.connected&&Jl(pd)});Jl(pd);qu();const fd=e=>{e&&e.detail&&(e.detail.action==="import"||e.detail.cleared)&&Zi()};window.addEventListener("sineflix_data_changed",fd);window.addEventListener("cinepulse_data_changed",fd);window.addEventListener("sineflix_profile_changed",async()=>{bn(),await Zi()});window.addEventListener("cinepulse_admin_state_changed",Zi);window.addEventListener("storage",e=>{if(e.key!=="sineflix_user_settings_v1")return;const t=$t();document.documentElement.classList.toggle("cards-landscape",t.cardLayout==="landscape"),bn(),Zi()});export{Ot as A,ad as B,ms as C,Vm as D,$s as W,st as a,tg as b,Fe as c,ut as d,Qm as e,eg as f,ii as g,Sn as h,gs as i,Zm as j,fi as k,Ym as l,zl as m,Jm as n,Yh as o,Gm as p,Ts as q,Se as r,Q as s,Ol as t,Nm as u,Ss as v,Xm as w,Fm as x,qm as y,Hm as z};
