const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./PlayerModal-DttVbhFh.js","./hls-BuERnqCp.js"])))=>i.map(i=>d[i]);
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function i(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(r){if(r.ep)return;r.ep=!0;const a=i(r);fetch(r.href,a)}})();function Z(e=document){const t=window.lucide;if(!t?.icons||!t?.createElement||!e)return;const i="[data-lucide]:not(svg)",n=e.matches?.(i)?[e,...e.querySelectorAll(i)]:e.querySelectorAll(i);for(const r of n){const a=r.getAttribute("data-lucide"),o=a.replace(/(^|-)(\w)/g,(u,f,h)=>h.toUpperCase()),s=t.icons[o];if(!s)continue;const c=t.createElement(s);for(const{name:u,value:f}of r.attributes)u!=="class"&&c.setAttribute(u,f);c.classList.add("lucide",`lucide-${a}`);for(const u of r.classList)u!=="lucide"&&!u.startsWith("lucide-")&&c.classList.add(u);r.replaceWith(c)}}const de={WATCH_HISTORY:"sineflix_watch_history_v1",FAVORITES:"sineflix_favorites_v1",WATCHLIST:"sineflix_watchlist_v1",USER_SETTINGS:"sineflix_user_settings_v1",ANIME_IDS:"sineflix_anime_ids_v1"};let wt=null;function cl(){if(wt)return wt;try{if(typeof window>"u"||!window.localStorage)return wt=new Set,wt;const e=localStorage.getItem(de.ANIME_IDS);if(!e)return wt=new Set,wt;const t=JSON.parse(e);return wt=new Set(Array.isArray(t)?t.map(String):[]),wt}catch{return wt=new Set,wt}}function we(e){if(e)try{const t=cl(),i=String(e);t.has(i)||(t.add(i),typeof window<"u"&&window.localStorage&&localStorage.setItem(de.ANIME_IDS,JSON.stringify(Array.from(t))))}catch{}}function ze(e){return e?cl().has(String(e)):!1}let Ze=null,We=null,st=null,nn=null,oi=null,rn=null,an=null,Gt=null,Di=null,Ei=null,Xn=null,dt=null,di=null,Vt=null,Et=null;function Ft(){nn=null,oi=null,rn=null,an=null}function Er(){Ze=null,We=null,st=null,Ft(),Gt=null,Di=null,Ei=null,Xn=null,wt=null,dt=null,di=null,Vt=null,Et=null}function Dt(){if(dt)return dt;const e=[{id:"prof_1",name:"Profilim",avatar:"user-circle",isKid:!1,color:"#f59e0b"},{id:"prof_kids",name:"Çocuk Modu 🎈",avatar:"baby",isKid:!0,color:"#38bdf8"}];try{if(typeof window>"u"||!window.localStorage)return dt=e,dt;const t=localStorage.getItem("sineflix_profiles_list_v1");if(!t)return dt=e,dt;let i=JSON.parse(t);return i.some(r=>r.id==="prof_cinema")&&(i=i.filter(r=>r.id!=="prof_cinema"),localStorage.setItem("sineflix_profiles_list_v1",JSON.stringify(i))),dt=i,dt}catch{return dt=e,dt}}function ts(e){try{if(dt=e,di=null,typeof window>"u"||!window.localStorage)return;localStorage.setItem("sineflix_profiles_list_v1",JSON.stringify(e)),window.dispatchEvent(new CustomEvent("sineflix_profiles_updated"))}catch{}}function dl(){try{return typeof window>"u"||!window.localStorage?!0:localStorage.getItem("cinepulse_onboarding_completed")==="true"}catch{return!0}}function Gc(){try{return typeof window>"u"||!window.localStorage?!0:localStorage.getItem("cinepulse_product_tour_completed")==="true"}catch{return!0}}function Vc(){try{if(typeof window>"u"||!window.localStorage)return;localStorage.setItem("cinepulse_product_tour_completed","true")}catch{}}function Jc({name:e,avatar:t="user-circle",color:i="#f59e0b",isKid:n=!1}){try{if(typeof window>"u"||!window.localStorage)return;const r=(e||"").trim()||(n?"Çocuk":"Profilim");let a=Dt();const o=a.findIndex(c=>c.id==="prof_1"),s={id:"prof_1",name:r,avatar:t,color:i,isKid:!!n};return o!==-1?a[o]=s:a.unshift(s),ts(a),Qn("prof_1"),localStorage.setItem("cinepulse_onboarding_completed","true"),window.dispatchEvent(new CustomEvent("sineflix_profile_changed",{detail:{profileId:"prof_1"}})),s}catch{return null}}const Jr="1403";function Zc(){try{return typeof window>"u"||!window.localStorage?Jr:localStorage.getItem("cinepulse_admin_pin")||Jr}catch{return Jr}}function Xc(e){try{return typeof window>"u"||!window.localStorage||!e||String(e).length<4?!1:(localStorage.setItem("cinepulse_admin_pin",String(e)),!0)}catch{return!1}}function Qc(e){return String(e).trim()===Zc().trim()}function Tr(){if(Et)return Et;const e=["clitoris","le clitoris","erotik","porn"];try{if(typeof window>"u"||!window.localStorage)return Et=e,e;const t=localStorage.getItem("cinepulse_blocked_content");return t?(Et=JSON.parse(t),Et):(Et=e,e)}catch{return Et=e,e}}function ed(e){if(!e)return;const t=Tr(),i=String(e).trim().toLowerCase();if(!t.includes(i)){t.push(i),Et=t;try{localStorage.setItem("cinepulse_blocked_content",JSON.stringify(t))}catch{}}}function td(e){if(!e)return;let t=Tr();const i=String(e).trim().toLowerCase();t=t.filter(n=>String(n).toLowerCase()!==i),Et=t;try{localStorage.setItem("cinepulse_blocked_content",JSON.stringify(t))}catch{}}function id(e){if(!e)return!1;const t=Tr(),i=String(e.id||""),n=`${e.title||""} ${e.name||""} ${e.original_title||""} ${e.original_name||""}`.toLowerCase();return t.some(r=>{const a=String(r).toLowerCase().trim();return a?i===a?!0:n.includes(a):!1})}function wn(){if(di)return di;try{const e=Dt(),t=typeof window<"u"&&window.localStorage&&localStorage.getItem("sineflix_active_profile_id")||"prof_1";return di=e.find(i=>i.id===t)||e[0],di}catch{return{id:"prof_1",name:"Profilim",avatar:"user-circle",isKid:!1,color:"#f59e0b"}}}function Qn(e){try{if(typeof window>"u"||!window.localStorage)return;localStorage.setItem("sineflix_active_profile_id",e),di=null,Er(),window.dispatchEvent(new CustomEvent("sineflix_profile_changed",{detail:{profileId:e}}))}catch{}}function $t(){return wn()?.isKid===!0}function Qt(e){if(!e||e.adult===!0||id(e))return!1;const t=[27,80,10752,10768,53,18],i=e.genre_ids||(Array.isArray(e.genres)?e.genres.map(s=>typeof s=="object"?s.id:s):[]);if(i.some(s=>t.includes(Number(s))))return!1;const n=`${e.title||""} ${e.name||""} ${e.overview||""}`.toLowerCase();if(["cinayet","katil","vahşet","kanlı","erotik","dehşet","intikam","mafya","uyuşturucu","şiddet","tecavüz","seri katil","katliam","korku","kan donduran","murder","killer","horror","bloody","psychopath","terror","revenge","savaş","war","battle","death","ölüm"].some(s=>n.includes(s)))return!1;const a=[16,10751,10762];return i.some(s=>a.includes(Number(s)))}function Os(e=[]){return Array.isArray(e)?$t()?e.filter(Qt):e:[]}function nd({name:e,isKid:t=!1,avatar:i="user-circle",color:n="#f59e0b"}){const r=Dt(),a={id:`prof_${Date.now()}`,name:e.trim()||"Yeni Profil",avatar:i,isKid:!!t,color:n};return r.push(a),ts(r),a}function rd(e){if(e==="prof_1")return!1;let t=Dt();return t=t.filter(i=>i.id!==e),ts(t),wn()?.id===e&&Qn("prof_1"),!0}function Pt(e){if(e===de.WATCH_HISTORY||e===de.FAVORITES||e===de.WATCHLIST){const t=wn();if(t&&t.id&&t.id!=="prof_1")return`${e}_${t.id}`}return e}function ft(e,t=[]){try{if(typeof window>"u"||!window.localStorage)return t;const i=Pt(e),n=localStorage.getItem(i);return n?JSON.parse(n):t}catch{return t}}const ad="cinepulse_storage_v1",zi="keyval_store";let Ln=null;function ul(){return Ln||(typeof window>"u"||!window.indexedDB?Promise.resolve(null):(Ln=new Promise(e=>{try{const t=window.indexedDB.open(ad,1);t.onupgradeneeded=()=>{const i=t.result;i.objectStoreNames.contains(zi)||i.createObjectStore(zi)},t.onsuccess=()=>e(t.result),t.onerror=()=>e(null)}catch{e(null)}}),Ln))}async function sd(e){try{const t=await ul();return t?new Promise(i=>{try{const a=t.transaction(zi,"readonly").objectStore(zi).get(e);a.onsuccess=()=>i(a.result!==void 0?a.result:null),a.onerror=()=>i(null)}catch{i(null)}}):null}catch{return null}}async function on(e,t){try{const i=await ul();return i?new Promise(n=>{try{const r=i.transaction(zi,"readwrite");r.objectStore(zi).put(t,e),r.oncomplete=()=>n(!0),r.onerror=()=>n(!1)}catch{n(!1)}}):!1}catch{return!1}}async function od(){if(!(typeof window>"u"||!window.indexedDB))try{const e=Pt(de.WATCH_HISTORY),t=await sd(e);if(Array.isArray(t)&&t.length>0){const i=Ze&&Ze.length||0;t.length>=i&&(Ze=t.sort((n,r)=>(r.lastWatchedAt||0)-(n.lastWatchedAt||0)),We=null,st=null,Ft(),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{key:e,value:Ze}})))}}catch{}}typeof window<"u"&&setTimeout(od,80);const Mt=new Map;function Ns(){if(!(typeof window>"u")){for(const[e,t]of Mt.entries())try{t.timer&&clearTimeout(t.timer),on(e,t.value),window.localStorage&&localStorage.setItem(e,JSON.stringify(t.value))}catch{}Mt.clear()}}typeof window<"u"&&(window.addEventListener("beforeunload",Ns),window.addEventListener("pagehide",Ns));function Le(e,t,i={}){try{if(typeof window>"u")return;const n=Pt(e);if(on(n,t),window.localStorage)if(i.isProgressUpdate){Mt.has(n)&&clearTimeout(Mt.get(n).timer);const r=setTimeout(()=>{try{localStorage.setItem(n,JSON.stringify(t))}catch{}Mt.delete(n)},2500);Mt.set(n,{timer:r,value:t})}else{Mt.has(n)&&(clearTimeout(Mt.get(n).timer),Mt.delete(n));try{localStorage.setItem(n,JSON.stringify(t))}catch{}}window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{key:n,value:t,...i}}))}catch{}}const pl=["anime","kimetsu","yaiba","iblis keser","demon slayer","naruto","boruto","shingeki","titan","titana saldırı","jujutsu","kaisen","one piece","death note","bleach","dragon ball","hunter x hunter","chainsaw man","tokyo ghoul","my hero academia","boku no hero","kahramanlık akademim","fullmetal","alchemist","simyacı","sword art online","solo leveling","black clover","vinland saga","spy x family","cyberpunk: edgerunners","haikyuu","one punch","berserk","mob psycho","overlord","evangelion","cowboy bebop","code geass","frieren","dr. stone","blue lock","steins;gate","jojo","kaiju no. 8","gintama","fairy tail","violet evergarden","hell's paradise","jigokuraku","dandadan","wind breaker","mushoku tensei","re:zero","delicious in dungeon","dungeon meshi","mashle","baki","hajime no ippo","slamdunk","slam dunk","kuroko","initial d","great teacher onizuka","monster","dororo","fire force","soul eater","noragami","erased","parasyte","psycho-pass","fate/zero","fate/stay","made in abyss","your lie in april","shigatsu wa kimi","anohana","toradora","clannad","classroom of the elite","elite sınıfı","no game no life","konosuba","slime datta ken","shield hero","kalkan kahramanı","goblin slayer","akame ga kill","kill la kill","gurren lagann","darling in the franxx","promised neverland","seven deadly sins","nanatsu no taizai","yedi ölümcül günah","tokyo revengers","blue exorcist","ao no exorcist","d.gray-man","inuyasha","yu yu hakusho","sailor moon","pokemon","digimon","yu-gi-oh","beyblade","captain tsubasa","tsubasa","record of ragnarok","shuumatsu no valkyrie","golden kamuy","dorohedoro","pluto","trigun","hellsing","elfen lied","rurouni kenshin","samurai champloo","fruits basket","horimiya","my dress-up darling","komi can't communicate","rent-a-girlfriend","kaguya-sama","lycoris recoil","zom 100","undead unluck","dead mount death play","seraph of the end","owari no seraph","bungo stray dogs","bungou stray dogs","assassination classroom","suikast sınıfı","black butler","kuroshitsuji","spirited away","ruhların kaçışı","howl's moving castle","yürüyen şato","my neighbor totoro","komşum totoro","princess mononoke","prenses mononoke","your name","kimi no na wa","senin adın","weathering with you","suzume","a silent voice","sessizliğin sesi","koe no katachi","akira","shangri-la frontier","oshi no ko","the eminence in shadow","bocchi the rock"];function ld(e){return e?/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(e):!1}function lt(e){if(!e)return!1;if(e.isAnime===!0||e.type==="anime"||e.media_type==="anime"||e.id&&ze(e.id))return!0;const i=(e.genre_ids||(Array.isArray(e.genres)?e.genres.map(a=>typeof a=="object"?a.id:a):[])).some(a=>Number(a)===16),n=e.original_language==="ja"||Array.isArray(e.origin_country)&&e.origin_country.includes("JP");if(i&&n||i&&(e.origin_country?.includes("JP")||e.original_language==="ja")||e.original_language==="ja"&&(i||ld(e.original_name||e.original_title||e.title||e.name))||Array.isArray(e.genres)&&e.genres.map(o=>typeof o=="object"?o.name:String(o)).filter(Boolean).some(o=>/anime/i.test(o)))return e.id&&we(e.id),!0;if(typeof e.id=="string"&&(e.id.startsWith("ta_")||e.id.startsWith("acx_")||e.id.startsWith("tra_")))return we(e.id),!0;const r=(e.title||e.name||e.original_title||e.original_name||"").toLowerCase();for(const a of pl)if(r.includes(a))return e.id&&we(e.id),!0;return!1}function is(e){return e?e.isSeries===!0||e.type==="tv"||e.media_type==="tv"?!1:e.type==="movie"||e.media_type==="movie"?!0:e.first_air_date||e.number_of_seasons||e.episodesCount||Array.isArray(e.seasons)&&e.seasons.length>0||e.season>1||e.episode>1?!1:!!(e.release_date&&!e.first_air_date):!0}function Re(){return Ze||(Ze=ft(de.WATCH_HISTORY,[]).sort((t,i)=>(i.lastWatchedAt||0)-(t.lastWatchedAt||0)),Ze)}async function cd(){const e=Re();let t=!1;const i="4e44d9029b1270a757cddc766a1bcb63";let n=0;for(let r=0;r<e.length;r++){const a=e[r];if(a.isAnime||a.type==="anime"){a.id&&we(a.id);continue}if(!(a.isAnime===!1&&a.type!=="anime")){if(ze(a.id)||lt(a)){a.isAnime=!0,a.type="anime",we(a.id),t=!0;continue}if(n<5&&a.id&&!isNaN(Number(a.id))){n++;try{const o=await fetch(`https://api.themoviedb.org/3/tv/${a.id}?api_key=${i}&language=tr-TR`);if(o.ok){const s=await o.json(),c=s.original_language==="ja"||Array.isArray(s.origin_country)&&s.origin_country.includes("JP"),u=Array.isArray(s.genres)&&s.genres.some(f=>f.id===16||/anim/i.test(f.name));c&&u&&(a.isAnime=!0,a.type="anime",a.isSeries=!0,a.original_language="ja",we(a.id),t=!0)}}catch{}}}}t&&(Ft(),Le(de.WATCH_HISTORY,e))}function Ar(){if(We)return We;const e=Re();We=new Map,st=new Map;for(let t=0;t<e.length;t++){const i=e[t],n=`${i.id}_${i.season||1}_${i.episode||1}`;We.has(n)||We.set(n,i);const r=String(i.id);st.has(r)||st.set(r,i)}return We}function er(e){if(!e||typeof e!="string")return"";let t=e.replace(/^(undefined|null|\/undefined|\/null)$/i,"");if(!t||t.startsWith("data:")||t.startsWith("http"))return t;try{for(;t.includes("%");){const i=decodeURIComponent(t);if(i===t)break;t=i}}catch{}return t=t.replace(/^\/+/,"/"),t.startsWith("/")||(t=`/${t}`),t==="/"||t==="/null"||t==="/undefined"?"":t}function kn(e,t,i,n=[]){const r=n.find(u=>u.id==e&&(u.posterPath||u.poster_path));let a=t||(r?r.posterPath||r.poster_path:""),o=i||(r?r.backdropPath||r.backdrop_path:"");const s=er(a),c=er(o);return{resolvedPoster:s||"",resolvedBackdrop:c||""}}function ns({id:e,title:t,posterPath:i,poster_path:n,backdropPath:r,backdrop_path:a,type:o,isAnime:s=!1,isSeries:c=!1,season:u=1,episode:f=1,currentTime:h=0,duration:m=0,completed:y=!1,genres:g=[],genre_ids:w=[],original_language:_="",origin_country:p=[],...k}){if(!e)return;const T=Re(),C=T.findIndex(j=>j.id==e&&j.season==u&&j.episode==f),S=T.find(j=>j.id==e),$=!!(s||o==="anime"||ze(e)||C>=0&&(T[C].isAnime||T[C].type==="anime")||S&&(S.isAnime||S.type==="anime")||lt({id:e,title:t,type:o,genres:g,genre_ids:w,original_language:_,origin_country:p,...k}));$&&we(e);const L=!!(c||o==="tv"||k.first_air_date||k.number_of_seasons||k.episodesCount||Array.isArray(k.seasons)&&k.seasons.length>0||u>1||f>1||C>=0&&(T[C].isSeries||T[C].type==="tv"||T[C].season>1||T[C].episode>1)||S&&(S.isSeries||S.type==="tv"||S.season>1||S.episode>1));let P=$?"anime":L?"tv":"movie";const{resolvedPoster:B,resolvedBackdrop:z}=kn(e,i||n,r||a,T),Y=m>0?m:P==="movie"?6600:3e3,K=Y>0?Math.min(100,Math.round(h/Y*100)):0,N=y||K>=90,q={...k,id:e,title:t||(C>=0?T[C].title:S?S.title:"İçerik"),posterPath:B,poster_path:B,backdropPath:z,backdrop_path:z,type:P,isAnime:$,isSeries:L,genres:g&&g.length>0?g:C>=0?T[C].genres:S?S.genres:[],genre_ids:w&&w.length>0?w:C>=0?T[C].genre_ids:S?S.genre_ids:[],original_language:_||(C>=0?T[C].original_language:S?S.original_language:""),origin_country:p&&p.length>0?p:C>=0?T[C].origin_country:S?S.origin_country:[],season:Number(u),episode:Number(f),currentTime:Math.round(h),duration:Math.round(Y),progressPercent:K,completed:N,lastWatchedAt:k.lastWatchedAt?Number(k.lastWatchedAt):Date.now()};C>=0?T[C]=q:T.unshift(q),T.sort((j,Q)=>(Q.lastWatchedAt||0)-(j.lastWatchedAt||0)),Ze=T,We&&We.set(`${e}_${u}_${f}`,q),st&&st.set(String(e),q),Ft(),Le(de.WATCH_HISTORY,T,{isProgressUpdate:!0})}function fl(e=[]){if(!Array.isArray(e)||e.length===0)return;const t=Re(),i=new Map;for(let o=0;o<t.length;o++){const s=t[o],c=`${s.id}_${s.season||1}_${s.episode||1}`;i.set(c,s)}for(const o of e){if(!o||!o.id)continue;const s=Number(o.season||1),c=Number(o.episode||1),u=`${o.id}_${s}_${c}`,f=i.get(u);if(f&&f.lastWatchedAt&&o.lastWatchedAt&&f.lastWatchedAt>o.lastWatchedAt&&f.completed&&o.completed)continue;const h=!!(o.isAnime||o.type==="anime"||ze(o.id)||f&&(f.isAnime||f.type==="anime")||lt(o));h&&we(o.id);const m=!!(o.isSeries||o.type==="tv"||o.first_air_date||s>1||c>1||f&&(f.isSeries||f.type==="tv")),y=h?"anime":m?"tv":"movie",{resolvedPoster:g,resolvedBackdrop:w}=kn(o.id,o.posterPath||o.poster_path,o.backdropPath||o.backdrop_path,t),_=o.duration>0?o.duration:y==="movie"?6600:3e3,p=o.currentTime!==void 0?o.currentTime:o.completed?_:0,k=o.progressPercent!==void 0?o.progressPercent:_>0?Math.min(100,Math.round(p/_*100)):0,T=o.completed===!1?!1:o.completed||k>=90,C={...f||{},...o,id:o.id,title:o.title||f?.title||"İçerik",posterPath:g,poster_path:g,backdropPath:w,backdrop_path:w,type:y,isAnime:h,isSeries:m,season:s,episode:c,currentTime:Math.round(p),duration:Math.round(_),progressPercent:k,completed:T,lastWatchedAt:o.lastWatchedAt?Number(o.lastWatchedAt):f?.lastWatchedAt||Date.now()};i.set(u,C)}const n=Array.from(i.values()).sort((o,s)=>(s.lastWatchedAt||0)-(o.lastWatchedAt||0));Ze=n,We=null,st=null,Ft();const r=n.filter(o=>!o.completed).length,a=n.filter(o=>o.completed).length;r>0,Le(de.WATCH_HISTORY,n)}function dd(e,t=1,i=1){let n=Re();n=n.filter(r=>!(r.id==e&&r.season==t&&r.episode==i)),Ze=n,We&&We.delete(`${e}_${t}_${i}`),Ft(),Le(de.WATCH_HISTORY,n)}function Ca(e){let t=Re();t=t.filter(i=>i.id!=e),Ze=t,We=null,Ft(),Le(de.WATCH_HISTORY,t)}function qs(){let e=Re();e=e.filter(t=>!t.completed&&t.progressPercent<90),Le(de.WATCH_HISTORY,e)}function ud(){let e=Re();const t=e.length;return e=e.filter(i=>!(i.currentTime===1e3&&i.duration===1e3)),Ze=e,We=null,Ft(),Le(de.WATCH_HISTORY,e),t-e.length}function Xt(e,t=1,i=1){return Ar().get(`${e}_${t}_${i}`)||null}function mn(e,t=1,i=1){const n=Xt(e,t,i);return!!(n&&(n.completed||n.progressPercent>=90))}function hl(e,t=1,i=1,n=!0,r={}){const a=Re(),o=a.findIndex(g=>g.id==e&&g.season==t&&g.episode==i),s=a.find(g=>g.id==e),c=!!(r.isAnime||r.type==="anime"||ze(e)||o>=0&&(a[o].isAnime||a[o].type==="anime")||s&&(s.isAnime||s.type==="anime")||lt({id:e,title:r.title,...r}));c&&we(e);const u=r.type==="movie"&&!c,f=r.duration||(u?6600:3e3),{resolvedPoster:h,resolvedBackdrop:m}=kn(e,r.posterPath||r.poster_path,r.backdropPath||r.backdrop_path,a),y={id:e,title:r.title||(o>=0?a[o].title:"İçerik"),posterPath:h,poster_path:h,backdropPath:m,backdrop_path:m,type:c?"anime":u?"movie":"tv",isAnime:c,isSeries:!u,season:Number(t),episode:Number(i),currentTime:n?f:0,duration:f,progressPercent:n?100:0,completed:!!n,lastWatchedAt:Date.now()};o>=0?a[o]=y:a.push(y),Le(de.WATCH_HISTORY,a)}function nm(e,t=!0,i={}){hl(e,1,1,t,{...i,type:i.type||"movie"})}function ml(e,t=1,i=1,n={}){const r=mn(e,t,i);return hl(e,t,i,!r,n),{completed:!r}}function pd(e,t=[],i=!0,n={}){const r=Re(),a=n.title||"Dizi",o=!!(n.isAnime||n.type==="anime"||ze(e)||lt({id:e,title:a}));o&&we(e);const s=o?"anime":"tv",c=n.duration||3e3,{resolvedPoster:u,resolvedBackdrop:f}=kn(e,n.posterPath||n.poster_path,n.backdropPath||n.backdrop_path,r);for(const h of t){const m=h.season_number;if(m===0&&t.length>1)continue;const y=h.episode_count||10;for(let g=1;g<=y;g++){const w=r.findIndex(p=>p.id==e&&p.season==m&&p.episode==g),_={id:e,title:a,posterPath:u,poster_path:u,backdropPath:f,backdrop_path:f,type:s,isAnime:o,isSeries:!0,season:Number(m),episode:g,currentTime:i?c:0,duration:c,progressPercent:i?100:0,completed:!!i,lastWatchedAt:Date.now()};w>=0?r[w]=_:r.push(_)}}Le(de.WATCH_HISTORY,r)}function fd(e,t,i=10,n=!0,r={}){const a=Re(),o=r.title||"Dizi",s=!!(r.isAnime||r.type==="anime"||ze(e)||lt({id:e,title:o}));s&&we(e);const c=s?"anime":"tv",u=r.duration||3e3,{resolvedPoster:f,resolvedBackdrop:h}=kn(e,r.posterPath||r.poster_path,r.backdropPath||r.backdrop_path,a);for(let m=1;m<=i;m++){const y=a.findIndex(w=>w.id==e&&w.season==t&&w.episode==m),g={id:e,title:o,posterPath:f,poster_path:f,backdropPath:h,backdrop_path:h,type:c,isAnime:s,isSeries:!0,season:Number(t),episode:m,currentTime:n?u:0,duration:u,progressPercent:n?100:0,completed:!!n,lastWatchedAt:Date.now()};y>=0?a[y]=g:a.push(g)}Le(de.WATCH_HISTORY,a)}function Zr(e,t=[]){if(!t||t.length===0)return mn(e,1,1);const i=Ar();for(const n of t){const r=n.season_number;if(r===0&&t.length>1)continue;const a=n.episode_count||1;for(let o=1;o<=a;o++){const s=i.get(`${e}_${r}_${o}`);if(!s||!s.completed&&s.progressPercent<90)return!1}}return!0}function Xr(e,t,i=10){const n=Ar();for(let r=1;r<=i;r++){const a=n.get(`${e}_${t}_${r}`);if(!a||!a.completed&&a.progressPercent<90)return!1}return!0}function La(e,t=1,i=1,n=1500,r={}){const a=!!(r.isAnime||r.type==="anime"||ze(e)||lt({id:e,title:r.title,...r}));a&&we(e);const o=r.type==="movie"&&!a,s=r.duration||(o?6600:3e3),c=n||Math.round(s*.5);return ns({id:e,title:r.title||"İçerik",posterPath:r.posterPath||r.poster_path||"",backdropPath:r.backdropPath||r.backdrop_path||"",type:a?"anime":o?"movie":"tv",isAnime:a,isSeries:!o,season:t,episode:i,currentTime:c,duration:s,completed:!1})}function Qr(e){return e?(st||Ar(),st&&st.has(String(e))?st.get(String(e)):Re().find(i=>i.id==e)||null):null}function li(e){if(!e||e<=0)return"";const t=Math.floor(e/60),i=Math.floor(e%60);if(t>=60){const n=Math.floor(t/60),r=t%60;return`${n}sa ${r>0?r+"dk":""}`}return`${t}:${i<10?"0":""}${i}`}function Fs(e,t){(!t||t<=0)&&(t=3e3);const i=Math.max(0,t-(e||0)),n=Math.round(i/60);if(n<=0)return"Bitti";if(n>=60){const r=Math.floor(n/60),a=n%60;return`${r}sa ${a>0?a+"dk":""} kaldı`}return`${n} dk kaldı`}function hd(e){if(!e||e<=0)return"0 dakika";const t=Math.floor(e/86400),i=Math.floor(e%86400/3600),n=Math.floor(e%3600/60),r=[];return t>0&&r.push(`${t} gün`),i>0&&r.push(`${i} saat`),(n>0||r.length===0)&&r.push(`${n} dk`),r.join(" ")}function Hs(){if(an)return an;const e=Re();let t=0,i=0,n=0;for(const a of e){const o=is(a),s=a.duration&&a.duration>0?a.duration:o?6600:3e3;a.completed?t+=s:a.currentTime>0?t+=a.currentTime:a.progressPercent&&a.progressPercent>0?t+=Math.round(a.progressPercent/100*s):t+=s,o?i++:n++}const r=hd(t);return an={totalSeconds:t,totalMinutes:Math.floor(t/60),totalHours:(t/3600).toFixed(1),formattedTotalTime:r,formattedTotal:r,moviesCount:i,totalMovies:i,episodesCount:n,totalEpisodes:n,totalEntries:e.length},an}function Fn(){if(oi)return oi;const e=Re();if(!e||e.length===0)return oi=[],oi;const t=new Map;for(const n of e){const r=n.id;t.has(r)||t.set(r,[]),t.get(r).push(n)}const i=[];for(const[n,r]of t.entries()){r.sort((c,u)=>(u.lastWatchedAt||0)-(c.lastWatchedAt||0));const a=r[0],o=!!(a.isAnime||a.type==="anime"||ze(a.id)||lt(a));if(o&&we(a.id),r.some(c=>c.isSeries===!0||c.type==="tv"||c.type==="anime"||c.first_air_date||c.number_of_seasons||c.season&&c.season>1||c.episode&&c.episode>1||Array.isArray(c.seasons)&&c.seasons.length>0)){if(r.every(P=>P.completed||P.progressPercent>=85))continue;const c=r.find(P=>!P.completed&&P.currentTime>0&&P.progressPercent<100);let u=c?c.season||1:a.season||1;const f=new Set;for(const P of r)P.season===u&&(P.completed||P.progressPercent>=90)&&f.add(P.episode);let h=1,m=!1,y=0,g=a;if(c&&c.season===u)h=c.episode||1,m=!0,y=c.currentTime||0,g=c;else{for(;f.has(h)&&h<=999;)h++;const P=r.find(B=>B.season===u&&B.episode===h);P&&!P.completed&&P.currentTime>0&&(m=!0,y=P.currentTime,g=P)}const w=r.find(P=>P.number_of_seasons||P.status||Array.isArray(P.seasons)&&P.seasons.length>0)||a,_=w.status==="Ended"||w.status==="Canceled",k=(Array.isArray(w.seasons)?w.seasons.find(P=>P.season_number===u):null)?.episode_count||w.season_episodes_count,T=w.number_of_seasons||(Array.isArray(w.seasons)?w.seasons.filter(P=>P.season_number>0).length:0);if(k&&h>k){if(T&&u<T)u++,h=1,m=!1,y=0;else if(_&&!m)continue}if(_&&w.number_of_episodes&&!m&&r.filter(B=>B.completed||B.progressPercent>=90).length>=w.number_of_episodes||f.size===0&&!m&&a.currentTime<=0)continue;const C=g.duration||3e3,S=Fs(y,C),$=o?"Anime Dizisi • ":"";let L="";m&&y>0?L=`${$}S${u} B${h} • Kaldığın: ${li(y)} • ${S}`:f.size>0||h>1?L=`${$}S${u} B${h} • Sıradaki Bölüm`:L=`${$}S${u} B${h} • Sıradaki Bölüm`,i.push({...a,...g,id:a.id,title:a.title||g.title,posterPath:a.posterPath||g.posterPath,poster_path:a.poster_path||g.poster_path,backdropPath:a.backdropPath||g.backdropPath,backdrop_path:a.backdrop_path||g.backdrop_path,type:o?"anime":"tv",isAnime:o,isSeries:!0,season:u,episode:h,currentTime:m?y:0,subtitle:L})}else{if(a.completed||a.progressPercent>=90)continue;if(a.currentTime>0){const u=a.duration||6600,f=Fs(a.currentTime,u),h=o?"Anime Filmi • ":"";i.push({...a,type:o?"anime":"movie",isAnime:o,isSeries:!1,subtitle:`${h}Kaldığın: ${li(a.currentTime)} • ${f}`})}}}return i.sort((n,r)=>(r.lastWatchedAt||0)-(n.lastWatchedAt||0)),oi=i,oi}function ea(){if(rn)return rn;const e=Re(),t=new Map;for(const n of e){const r=n.id;t.has(r)||t.set(r,[]),t.get(r).push(n)}const i=[];for(const[n,r]of t.entries()){r.sort((c,u)=>(u.lastWatchedAt||0)-(c.lastWatchedAt||0));const a=r[0],o=!!(a.isAnime||a.type==="anime"||ze(a.id)||lt(a));o&&we(a.id),is(a)?(a.completed||a.progressPercent>=90)&&i.push({...a,type:o?"anime":"movie",isAnime:o,isSeries:!1,completed:!0,subtitle:o?"✓ Anime Filmi İzlendi":"✓ Film İzlendi"}):r.every(u=>u.completed||u.progressPercent>=85)&&r.length>0&&i.push({...a,type:o?"anime":"tv",isAnime:o,isSeries:!0,completed:!0,subtitle:o?`✓ ${r.length} Bölüm Anime İzlendi`:`✓ ${r.length} Bölüm İzlendi`})}return i.sort((n,r)=>(r.lastWatchedAt||0)-(n.lastWatchedAt||0)),rn=i,rn}function Us(){if(nn)return nn;const e=Re(),t=new Map;for(const n of e){const r=n.id;t.has(r)||t.set(r,[]),t.get(r).push(n)}const i=[];for(const[n,r]of t.entries()){r.sort((u,f)=>(f.lastWatchedAt||0)-(u.lastWatchedAt||0));const a=r[0],o=!!(a.isAnime||a.type==="anime"||ze(a.id)||lt(a));o&&we(a.id);const s=is(a),c=o?"anime":s?"movie":"tv";if(s){const u=o?"Anime Filmi • ":"";i.push({...a,type:c,isAnime:o,isSeries:!1,subtitle:a.completed?`✓ ${u}İzlendi`:a.progressPercent>0?`${u}%${a.progressPercent} İzlendi`:u.replace(" • ","")})}else{const u=r.filter(h=>h.completed||h.progressPercent>=85).length,f=o?"Anime Dizisi • ":"";i.push({...a,type:c,isAnime:o,isSeries:!0,subtitle:u>0?`${f}${u} Bölüm İzlendi`:`${f}S${a.season||1} B${a.episode||1}`})}}return i.sort((n,r)=>(r.lastWatchedAt||0)-(n.lastWatchedAt||0)),nn=i,nn}function js(){return Fn()}function gl(e){if(!e)return e;let t=e.type;const i=!!(e.isAnime||e.type==="anime"||ze(e.id)||lt(e));i?(t="anime",e.id&&we(e.id)):(!t||t==="movie")&&(e.isSeries||e.first_air_date||e.media_type==="tv"||e.number_of_seasons||e.episodesCount||!e.title&&e.name?t="tv":t=t||"movie");const n=!!(e.isSeries!==void 0?e.isSeries:t==="tv"||e.first_air_date||e.number_of_seasons||e.episodesCount||e.season&&e.season>1||e.episode&&e.episode>1),r=er(e.poster_path||e.posterPath||e.poster||""),a=er(e.backdrop_path||e.backdropPath||e.backdrop||"");return{...e,type:t,isAnime:i,isSeries:n,poster_path:r,posterPath:r,backdrop_path:a,backdropPath:a}}function Jt(){return Gt||(Gt=ft(de.FAVORITES,[]).map(gl),Di=new Set(Gt.map(t=>String(t.id))),Gt)}function md(e){return e?(Di||Jt(),Di.has(String(e))):!1}function gd(e){if(!e||!e.id)return!1;let t=Jt();const i=t.findIndex(r=>r.id==e.id);let n=!1;if(i>=0)t.splice(i,1);else{const r=!!(e.isAnime||e.type==="anime"||ze(e.id)||lt(e));r&&we(e.id);let a=r?"anime":e.type;a||(a=e.first_air_date||e.media_type==="tv"||e.number_of_seasons||!e.title&&e.name?"tv":"movie");const o=e.poster_path||e.posterPath||e.poster||"",s=e.backdrop_path||e.backdropPath||e.backdrop||"";t.unshift({id:e.id,title:e.title||e.name||"İsimsiz",poster_path:o,posterPath:o,backdrop_path:s,backdropPath:s,vote_average:e.vote_average||e.voteAverage||8,release_date:e.release_date||e.first_air_date||"",first_air_date:e.first_air_date||"",genre_ids:e.genre_ids||(Array.isArray(e.genres)?e.genres.map(c=>typeof c=="object"?c.id:c):[]),genres:e.genres||[],original_language:e.original_language||"",origin_country:e.origin_country||[],isAnime:r,type:a,addedAt:Date.now()}),n=!0}return Gt=t,Di=new Set(t.map(r=>String(r.id))),Le(de.FAVORITES,t),n}function yd(e){let t=Jt();return t=t.filter(i=>i.id!=e),Gt=t,Di=new Set(t.map(i=>String(i.id))),Le(de.FAVORITES,t),t}function Zt(){return Ei||(Ei=ft(de.WATCHLIST,[]).map(gl),Xn=new Set(Ei.map(t=>String(t.id))),Ei)}function rs(e){return e?(Xn||Zt(),Xn.has(String(e))):!1}function yl(e){if(!e||!e.id)return!1;let t=Zt();const i=t.findIndex(r=>r.id==e.id);let n=!1;if(i>=0)t.splice(i,1);else{const r=!!(e.isAnime||e.type==="anime"||ze(e.id)||lt(e));r&&we(e.id);let a=r?"anime":e.type;a||(a=e.first_air_date||e.media_type==="tv"||e.number_of_seasons||!e.title&&e.name?"tv":"movie");const o=e.poster_path||e.posterPath||e.poster||"",s=e.backdrop_path||e.backdropPath||e.backdrop||"";t.unshift({id:e.id,title:e.title||e.name||"İsimsiz",poster_path:o,posterPath:o,backdrop_path:s,backdropPath:s,vote_average:e.vote_average||e.voteAverage||8,release_date:e.release_date||e.first_air_date||"",first_air_date:e.first_air_date||"",genre_ids:e.genre_ids||(Array.isArray(e.genres)?e.genres.map(c=>typeof c=="object"?c.id:c):[]),genres:e.genres||[],original_language:e.original_language||"",origin_country:e.origin_country||[],isAnime:r,type:a,addedAt:Date.now()}),n=!0}return Le(de.WATCHLIST,t),n}function vd(e){let t=Zt();return t=t.filter(i=>i.id!=e),Le(de.WATCHLIST,t),t}function bd(){Ze=[],We=new Map,st=new Map,Ft(),Le(de.WATCH_HISTORY,[])}function wd(e,t=1,i=1){return dd(e,t,i)}function Rt(){return Vt||(Vt=ft(de.USER_SETTINGS,{autoplayNext:!0,preferredResolution:"1080p",theme:"dark",subtitlesEnabled:!0,cardLayout:"portrait",hoverPreviewsEnabled:!1,trailersEnabled:!0}),Vt)}function vl(e){Vt={...Rt(),...e},Le(de.USER_SETTINGS,Vt),typeof window<"u"&&window.dispatchEvent(new CustomEvent("cinepulse_settings_changed",{detail:Vt}))}function bl(){const e=ft(de.WATCH_HISTORY,[]),t=ft(de.FAVORITES,[]),i=ft(de.WATCHLIST,[]),n=ft(de.USER_SETTINGS,{}),r={version:"1.0.0",exportDate:new Date().toISOString(),appName:"CinePulse Studio",watchHistory:e,favorites:t,watchlist:i,userSettings:n,data:{watchHistory:e,favorites:t,watchlist:i,userSettings:n}},a=JSON.stringify(r,null,2),o=`cinepulse_yedek_${new Date().toISOString().split("T")[0]}.json`,s=window.CinePulseNative?.saveJsonBackup?.(a,o);if(s!==void 0){if(!String(s).startsWith("OK"))throw new Error(String(s).replace(/^ERROR:/,"")||"JSON yedeği kaydedilemedi.");return o}const c=new Blob([a],{type:"application/json;charset=utf-8"}),u=URL.createObjectURL(c),f=document.createElement("a");return f.href=u,f.download=o,document.body.appendChild(f),f.click(),setTimeout(()=>{document.body.removeChild(f),URL.revokeObjectURL(u)},1e3),o}function wl(e,t="merge"){try{let i=null;if(typeof e=="string"?i=JSON.parse(e.trim()):typeof e=="object"&&e!==null&&(i=e),!i)throw new Error("Geçersiz veya boş yedek dosyası.");let n=[],r=[],a=[],o={};if(Array.isArray(i)?n=i:typeof i=="object"&&(n=i.watchHistory||i.data?.watchHistory||i.sineflix_watch_history_v1||i.history||[],r=i.favorites||i.data?.favorites||i.sineflix_favorites_v1||[],a=i.watchlist||i.data?.watchlist||i.sineflix_watchlist_v1||[],o=i.userSettings||i.data?.userSettings||i.sineflix_user_settings_v1||{}),Array.isArray(n)||(n=[]),Array.isArray(r)||(r=[]),Array.isArray(a)||(a=[]),t==="replace")Le(de.WATCH_HISTORY,n),Le(de.FAVORITES,r),Le(de.WATCHLIST,a),o&&typeof o=="object"&&Le(de.USER_SETTINGS,o);else{const s=ft(de.WATCH_HISTORY,[]),c=new Map;s.forEach(w=>{const _=`${w.id}_${w.season||1}_${w.episode||1}`;c.set(_,w)}),n.forEach(w=>{const _=`${w.id}_${w.season||1}_${w.episode||1}`;if(!c.has(_))c.set(_,w);else{const p=c.get(_);((w.lastWatchedAt||0)>=(p.lastWatchedAt||0)||w.completed)&&c.set(_,{...p,...w})}});const u=Array.from(c.values()).sort((w,_)=>(_.lastWatchedAt||0)-(w.lastWatchedAt||0));Le(de.WATCH_HISTORY,u);const f=ft(de.FAVORITES,[]),h=new Map;f.forEach(w=>h.set(String(w.id),w)),r.forEach(w=>{h.has(String(w.id))||h.set(String(w.id),w)}),Le(de.FAVORITES,Array.from(h.values()));const m=ft(de.WATCHLIST,[]),y=new Map;m.forEach(w=>y.set(String(w.id),w)),a.forEach(w=>{y.has(String(w.id))||y.set(String(w.id),w)}),Le(de.WATCHLIST,Array.from(y.values()));const g=ft(de.USER_SETTINGS,{});Le(de.USER_SETTINGS,{...g,...o})}return Er(),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{action:"import"}})),window.dispatchEvent(new CustomEvent("cinepulse_data_changed",{detail:{action:"import"}})),{success:!0,countHistory:n.length,countFavs:r.length,countWatchlist:a.length,message:`${n.length} izleme kaydı ve ${r.length} favori başarıyla aktarıldı.`}}catch(i){return{success:!1,error:i.message,message:"Yedek dosyası okunamadı: "+i.message}}}function kd(){const e=Re(),t=Jt(),i=Zt(),n=JSON.stringify({history:e,favorites:t,watchlist:i}),r=new Blob([n]).size,a=(r/1024).toFixed(1);return{historyCount:e.length,favoritesCount:t.length,watchlistCount:i.length,bytes:r,kb:a}}function _d(){Er();try{on(Pt(de.WATCH_HISTORY),[]),on(Pt(de.FAVORITES),[]),on(Pt(de.WATCHLIST),[])}catch{}typeof window<"u"&&window.localStorage&&(localStorage.removeItem(Pt(de.WATCH_HISTORY)),localStorage.removeItem(Pt(de.FAVORITES)),localStorage.removeItem(Pt(de.WATCHLIST))),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{cleared:!0}}))}function Sd(){if(!(typeof window>"u"||!window.localStorage))try{localStorage.removeItem("cinepulse_epg_live_cache"),localStorage.removeItem("sineflix_epg_cache_v2");for(let t=0;t<localStorage.length;t++){const i=localStorage.key(t);i&&(i.startsWith("cinepulse_home_fast_")||i.startsWith("sineflix_home_fast_"))&&localStorage.removeItem(i)}const e=localStorage.getItem("sineflix_notifications_v1");if(e)try{const t=JSON.parse(e);Array.isArray(t)&&t.length>25&&localStorage.setItem("sineflix_notifications_v1",JSON.stringify(t.slice(0,25)))}catch{}}catch{}}Sd();const xd="https://api.themoviedb.org/3",as=["4e44d9029b1270a757cddc766a1bcb63","844dba0bfd8f3a4f3799f6130ef9e335"];let $a=0;function Ed(){return as[$a]}function Ks(){$a=($a+1)%as.length}const je={POSTER_SMALL:"https://image.tmdb.org/t/p/w185",POSTER_MEDIUM:"https://image.tmdb.org/t/p/w342",BACKDROP_LARGE:"https://image.tmdb.org/t/p/w780",BACKDROP_XLARGE:"https://image.tmdb.org/t/p/w1280",BACKDROP_ORIGINAL:"https://image.tmdb.org/t/p/original",STILL_MEDIUM:"https://image.tmdb.org/t/p/w300"},Td='<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750"><rect width="500" height="750" fill="#0b0f19"/><circle cx="250" cy="300" r="160" fill="#f59e0b" opacity="0.25"/><g transform="translate(190, 230) scale(2.5)" fill="none" stroke="#f59e0b" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></g><text x="250" y="430" font-family="sans-serif" font-weight="800" font-size="30" fill="#ffffff" text-anchor="middle">Cine<tspan fill="#f59e0b">Pulse</tspan></text><text x="250" y="470" font-family="sans-serif" font-weight="500" font-size="16" fill="#64748b" text-anchor="middle">Görsel Yüklenemedi</text></svg>',ht=`data:image/svg+xml,${encodeURIComponent(Td)}`,Ad='<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#1e293b"/><circle cx="50" cy="40" r="18" fill="#64748b"/><path d="M 20 85 C 20 65, 80 65, 80 85 Z" fill="#64748b"/></svg>',tr=`data:image/svg+xml,${encodeURIComponent(Ad)}`;function Xe(e,t=je.POSTER_MEDIUM){if(!e||e==="null"||e==="undefined"||e==="")return ht;if(e.startsWith("http")||e.startsWith("data:"))return e;let i=e;try{for(;i.includes("%");){const n=decodeURIComponent(i);if(n===i)break;i=n}}catch{}return i=i.replace(/^\/+/,"/"),i.startsWith("/")||(i=`/${i}`),i==="/"||i==="/null"||i==="/undefined"?ht:`${t}${i}`}const ta={};async function ss(e){if(!e||e.trim().length===0)return"";if(ta[e])return ta[e];try{const t=`https://translate.googleapis.com/translate_a/single?client=dict-chrome-ex&sl=auto&tl=tr&dt=t&q=${encodeURIComponent(e)}`,i=await fetch(t,{signal:AbortSignal.timeout(3e3),headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}});if(i.ok){const n=await i.json();if(n&&n[0]){const r=n[0].map(a=>a[0]).join("");if(r&&r.trim().length>0)return ta[e]=r,r}}}catch{}return e}const ia=new Map;async function pe(e,t={}){const i=`${e}_${JSON.stringify(t)}`;if(ia.has(i))return ia.get(i);for(let n=0;n<as.length;n++)try{const r=new URL(`${xd}${e}`);r.searchParams.append("api_key",Ed());for(let o in t)t[o]!==void 0&&t[o]!==null&&r.searchParams.append(o,t[o]);const a=await fetch(r.toString(),{signal:AbortSignal.timeout(6e3)});if(a.ok){const o=await a.json();return ia.set(i,o),o}else Ks()}catch{Ks()}return null}const Cd=new Set([64,84,4370]),Ld=new Set([10764]),$d=["hayalet hikayeleri","a haunting","altin pesinde","gold rush","olumcul av","deadliest catch","hurda avcilari","salvage hunters","tamirat tadilat","wheeler dealers","agir yasamlar","my 600-lb life","evlilige 90 gun","90 day fiance","pasta ustalari","cake boss","agac ev ustalari","treehouse masters","alaska yi kurtarmak","alaskayi kurtarmak","alaska: the last frontier","oto kurtarma kulubu","fast n loud","nehir canavarlari","river monsters","kupon delileri","extreme couponing","temizlik bagimlilari","obsessive compulsive cleaners","asiri cimriler","extreme cheapskates","restoran kurtarma","depo savaslari","storage wars","gumruk kontrol","border security","nasil yapilir","how it's made","how its made","dmax","tlc"],Rd=new Set([3072,34634,3126,45814,1356,45598,61498,59792,29849,23067,44383,44372]);function Ke(e){if(!e||e.id&&Rd.has(Number(e.id))||(e.genre_ids||(Array.isArray(e.genres)?e.genres.map(r=>typeof r=="object"?r.id:r):[])).some(r=>Ld.has(Number(r))))return!0;const i=e.networks||[];if(Array.isArray(i)&&i.some(r=>Cd.has(Number(r.id||r))))return!0;const n=(e.title||e.name||e.original_title||e.original_name||"").toLowerCase().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c");for(const r of $d)if(n.includes(r))return!0;return!!($t()&&!Qt(e))}const os=[[180,["rafadan tayfa","kral sakir","niloya","pepee"]],[225,["miraculous","gumball","adventure time","regular show","teen titans go","ben 10","spongebob","sunger bob"]],[130,["masha and the bear","masa ile koca ayi","winx","scooby doo","ninjago","paw patrol","pijamaskeliler"]],[150,["samurai jack","johnny test","johnny bravo","dexter laboratory","powerpuff girls","courage cowardly dog"]],[110,["avatar the last airbender","avatar son hava bukucu","gravity falls","steven universe","the owl house","amphibia"]]],Ws=[[180,["naruto","one piece","attack on titan","shingeki no kyojin","demon slayer","kimetsu no yaiba"]],[160,["jujutsu kaisen","death note","solo leveling","bleach","dragon ball"]],[140,["pokemon","beyblade","captain tsubasa","yu gi oh","bakugan","my hero academia","boku no hero"]],[120,["hunter x hunter","tokyo ghoul","fullmetal alchemist","vinland saga","monster","jojo","haikyuu","blue lock"]],[105,["chainsaw man","one punch man","spy x family","black clover","frieren","kaiju no 8","dandadan"]]],Id=[[320,["rick and morty","invincible","arcane","bojack horseman"]],[280,["south park","family guy","american dad","futurama","the simpsons"]],[250,["love death robots","harley quinn","archer","solar opposites"]],[220,["castlevania","blue eye samurai","the legend of vox machina","spawn","primal"]],[200,["big mouth","f is for family","disenchantment","inside job","smiling friends","hazbin hotel","helluva boss"]],[180,["boondocks","paradise pd","brickleberry","final space","scavengers reign","pantheon","undone","creature commandos"]]];function Cr(e=""){return String(e).toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ı/g,"i").replace(/[^a-z0-9]+/g," ").trim()}function ls(e){const t=String(e?.original_language||"").toLowerCase(),i=Array.isArray(e?.origin_country)?e.origin_country.map(n=>String(n).toUpperCase()):[];return["ja","zh","ko"].includes(t)||i.some(n=>["JP","CN","KR"].includes(n))}function Md(e,t=!1){const i=Cr([e.name,e.title,e.original_name,e.original_title].filter(Boolean).join(" ")),n=t?Ws:[...os,...Ws];for(const[r,a]of n)if(a.some(o=>i.includes(o)))return r;return 0}function Ys(e){const t=Cr([e.name,e.title,e.original_name,e.original_title].filter(Boolean).join(" "));for(const[i,n]of Id)if(n.some(r=>t.includes(r)))return i;return 0}function kl(e){const t=Cr([e.name,e.title,e.original_name,e.original_title].filter(Boolean).join(" "));return os.some(([,i])=>i.some(n=>t.includes(n)))}function Pd(e){const t=Cr([e.name,e.title,e.original_name,e.original_title].filter(Boolean).join(" "));for(const[i,n]of os)if(n.some(r=>t.includes(r)))return i;return 0}function Lr(e,{animeOnly:t=!1}={}){return e.map(i=>{const n=Math.min(220,Number(i.popularity)||0),r=Math.min(95,Math.log10((Number(i.vote_count)||0)+1)*22),a=Math.max(0,(Number(i.vote_average)||0)-5)*5,o=!t&&i.origin_country?.includes("TR")?115:0,s=n+r+a+o+Md(i,t);return{...i,_turkeyPopularityScore:Math.round(s*100)/100}}).sort((i,n)=>n._turkeyPopularityScore-i._turkeyPopularityScore)}async function Ra(e=1){const[t,i,n,r,a]=await Promise.all([pe("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16",without_genres:"27,80,53,10752,18","vote_count.gte":10,include_adult:!1}),pe("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"10762",without_genres:"27,80,53","vote_count.gte":5,include_adult:!1}),pe("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16",with_origin_country:"TR",without_genres:"27,80,53,10752,18",include_adult:!1}),pe("/discover/tv",{sort_by:"vote_count.desc",page:e+2,language:"tr-TR",with_genres:"16",without_genres:"27,80,53,10752,18","vote_count.gte":10,include_adult:!1}),e===1?pe("/trending/tv/week",{language:"tr-TR"}):Promise.resolve(null)]),o=(a?.results||[]).filter(u=>(u.genre_ids||[]).includes(16)),s=[...t?.results||[],...i?.results||[],...n?.results||[],...r?.results||[],...o],c=new Map;for(const u of s)u&&u.id&&!c.has(u.id)&&c.set(u.id,u);return Lr(Array.from(c.values()).filter(u=>(u.poster_path||u.backdrop_path)&&!Ke(u)).map(u=>({...u,type:"tv",media_type:"tv",isSeries:!0,overview:(u.overview||"").trim()||De(u,"tv")})))}function Bd(e){const t=new Map;for(const i of e)i?.id&&!t.has(i.id)&&t.set(i.id,i);return Lr(Array.from(t.values()).filter(i=>{const n=(i.genre_ids||[]).map(Number);return(i.poster_path||i.backdrop_path)&&n.includes(16)&&(n.includes(10751)||n.includes(10762)||kl(i))&&!ls(i)&&Qt(i)&&!Ke(i)}).map(i=>({...i,type:"tv",media_type:"tv",isSeries:!0,overview:(i.overview||"").trim()||De(i,"tv")})))}async function _l(e,t,i){const n=await Promise.all(t.map(([r,a])=>pe("/discover/tv",{sort_by:i,page:e,language:"tr-TR",with_genres:"16",without_genres:"18,27,53,80,99,10752,10764,10766,10767","first_air_date.gte":r,"first_air_date.lte":a,include_adult:!1})));return Bd(n.flatMap(r=>r?.results||[]))}async function Gs(e=1){return _l(e,[["2020-01-01","2099-12-31"],["2015-01-01","2019-12-31"]],"popularity.desc")}async function Vs(e=1){return _l(e,[["2010-01-01","2014-12-31"],["2000-01-01","2009-12-31"],["1990-01-01","1999-12-31"],["1900-01-01","1989-12-31"]],"vote_count.desc")}async function Ia(e=1){const[t,i,n]=await Promise.all([pe("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16",without_genres:"10751,10762","vote_count.gte":80,include_adult:!1}),pe("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"16",without_genres:"10751,10762","vote_average.gte":6.5,"vote_count.gte":150,include_adult:!1}),e===1?pe("/trending/tv/week",{language:"tr-TR"}):Promise.resolve(null)]),r=(n?.results||[]).filter(o=>(o.genre_ids||[]).includes(16)),a=new Map;for(const o of[...t?.results||[],...i?.results||[],...r])o?.id&&!a.has(o.id)&&a.set(o.id,o);return Array.from(a.values()).filter(o=>{const s=(o.genre_ids||[]).map(Number);return(o.poster_path||o.backdrop_path)&&s.includes(16)&&!s.includes(10751)&&!s.includes(10762)&&!ls(o)&&!kl(o)&&(e===1?Ys(o)>0:!0)&&!Ke(o)}).map(o=>{const s=Math.min(250,Number(o.popularity)||0),c=Math.min(130,Math.log10((Number(o.vote_count)||0)+1)*30),u=Math.max(0,(Number(o.vote_average)||0)-5)*8;return{...o,type:"tv",media_type:"tv",isSeries:!0,overview:(o.overview||"").trim()||De(o,"tv"),_adultAnimationScore:s+c+u+Ys(o)}}).sort((o,s)=>s._adultAnimationScore-o._adultAnimationScore)}async function ir(e=1){const t=[["2020-01-01","2099-12-31"],["2015-01-01","2019-12-31"],["2010-01-01","2014-12-31"],["2000-01-01","2009-12-31"],["1990-01-01","1999-12-31"],["1980-01-01","1989-12-31"],["1900-01-01","1979-12-31"]],i=await Promise.all(t.map(([r,a])=>pe("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"16",without_genres:"27,80,53,99,10764,10766,10767","first_air_date.gte":r,"first_air_date.lte":a,include_adult:!1}))),n=new Map;for(const r of i)for(const a of r?.results||[])a?.id&&!n.has(a.id)&&n.set(a.id,a);return Array.from(n.values()).filter(r=>{const a=(r.genre_ids||[]).map(Number);return(r.poster_path||r.backdrop_path)&&a.includes(16)&&!a.includes(99)&&!ls(r)&&!$r(r.name||r.title||"")&&!Ke(r)}).map(r=>{const a=parseInt(String(r.first_air_date||"").slice(0,4),10)||9999,o=Math.min(220,Number(r.popularity)||0),s=Math.min(115,Math.log10((Number(r.vote_count)||0)+1)*27),c=a<=2018?35:0;return{...r,type:"tv",media_type:"tv",isSeries:!0,overview:(r.overview||"").trim()||De(r,"tv"),_cartoonScore:o+s+c+Pd(r)}}).sort((r,a)=>a._cartoonScore-r._cartoonScore)}async function Ma(e=1){const t=await pe("/discover/movie",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"16,10751",without_genres:"27,80,53,10752","vote_count.gte":40});return!t||!t.results?[]:t.results.filter(i=>(i.poster_path||i.backdrop_path)&&!Ke(i)).map(i=>({...i,type:"movie",media_type:"movie",overview:(i.overview||"").trim()||De(i,"movie")}))}async function Js(e=1){const t=await pe("/discover/movie",{sort_by:"vote_average.desc",page:e,language:"tr-TR",with_genres:"12,14,10751","vote_count.gte":150,without_genres:"27,80,53"});return!t||!t.results?[]:t.results.filter(i=>(i.poster_path||i.backdrop_path)&&!Ke(i)).map(i=>({...i,type:"movie",media_type:"movie",overview:(i.overview||"").trim()||De(i,"movie")}))}async function Sl(e="all",t="week",i=1){const[n,r]=await Promise.all([pe(`/trending/${e}/${t}`,{page:i,language:"tr-TR"}),pe(`/trending/${e}/${t}`,{page:i,language:"en-US"})]);if(!n||!n.results)return[];const a=new Map((r?.results||[]).map(o=>[o.id,o.overview]));return n.results.filter(o=>(o.poster_path||o.backdrop_path)&&!Ke(o)).map(o=>{const c=o.media_type==="tv"||!!o.first_air_date?"tv":"movie",u=(o.overview||"").trim(),f=(a.get(o.id)||"").trim();return{...o,type:c,media_type:c,overview:u||f||De(o,c)}})}async function nr(e=1){const t=await pe("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR","vote_count.gte":300,without_genres:"16"});return!t||!t.results?[]:t.results.filter(i=>(i.poster_path||i.backdrop_path)&&!Ke(i)).map(i=>{const n=(i.overview||"").trim();return{...i,type:"tv",media_type:"tv",overview:n||De(i,"tv")}})}async function rr(e=1){const t=await pe("/discover/movie",{sort_by:"vote_count.desc",page:e,language:"tr-TR","vote_count.gte":500});return!t||!t.results?[]:t.results.filter(i=>(i.poster_path||i.backdrop_path)&&!Ke(i)).map(i=>{const n=(i.overview||"").trim();return{...i,type:"movie",media_type:"movie",overview:n||De(i,"movie")}})}function $r(e){return e?/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\u1100-\u11ff\u3130-\u318f\ua960-\ua97f\ud7b0-\ud7ff\u0600-\u06ff\u0400-\u04ff\u0e00-\u0e7f]/.test(e):!1}async function ar(e=1){const[t,i,n,r]=await Promise.all([pe("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16",with_original_language:"ja","vote_count.gte":50}),pe("/discover/tv",{sort_by:"popularity.desc",page:e,language:"en-US",with_genres:"16",with_original_language:"ja","vote_count.gte":50}),pe("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"16",with_original_language:"ja","vote_count.gte":100}),e===1?pe("/trending/tv/week",{language:"tr-TR"}):Promise.resolve(null)]);if(!t||!t.results)return[];const a=new Map((i?.results||[]).map(s=>[s.id,s.name||s.title])),o=new Map([...t.results||[],...n?.results||[],...(r?.results||[]).filter(s=>s.original_language==="ja"&&(s.genre_ids||[]).includes(16))].map(s=>[s.id,s]));return Lr(Array.from(o.values()).filter(s=>(s.poster_path||s.backdrop_path)&&!Ke(s)).map(s=>{let c=s.name||s.title||"";return(!c||$r(c))&&(c=a.get(s.id)||s.original_name||s.original_title||c),s.id&&we(s.id),{...s,name:c,title:c,type:"anime",media_type:"anime",isAnime:!0,isSeries:!0,overview:s.overview||De(s,"tv")}}),{animeOnly:!0})}async function Pa(e=1){const[t,i]=await Promise.all([pe("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16,10762",with_original_language:"ja",without_genres:"27,80,53,10752,18","vote_count.gte":10}),pe("/discover/tv",{sort_by:"popularity.desc",page:e,language:"en-US",with_genres:"16,10762",with_original_language:"ja",without_genres:"27,80,53,10752,18","vote_count.gte":10})]);if(!t||!t.results)return[];const n=new Map((i?.results||[]).map(r=>[r.id,r.name||r.title]));return Lr(t.results.filter(r=>(r.poster_path||r.backdrop_path)&&!Ke(r)).map(r=>{let a=r.name||r.title||"";return(!a||$r(a))&&(a=n.get(r.id)||r.original_name||r.original_title||a),r.id&&we(r.id),{...r,name:a,title:a,type:"anime",media_type:"anime",isAnime:!0,isSeries:!0,overview:r.overview||De(r,"tv")}}),{animeOnly:!0})}async function sr(e=1){const[t,i]=await Promise.all([pe("/discover/movie",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"99","vote_count.gte":40}),pe("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"99","vote_count.gte":30})]),n=(t?.results||[]).filter(a=>(a.poster_path||a.backdrop_path)&&!Ke(a)).map(a=>({...a,type:"movie",media_type:"movie",overview:(a.overview||"").trim()||De(a,"movie")})),r=(i?.results||[]).filter(a=>(a.poster_path||a.backdrop_path)&&!Ke(a)).map(a=>({...a,type:"tv",media_type:"tv",overview:(a.overview||"").trim()||De(a,"tv")}));return[...n,...r].sort((a,o)=>(o.vote_count||0)-(a.vote_count||0))}async function Dd(e=1){const t=await pe("/discover/movie",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"99,10751",without_genres:"27,80,53,10752","vote_count.gte":10}),i=await pe("/discover/movie",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"99,16",without_genres:"27,80,53","vote_count.gte":5}),n=t?.results||[],r=i?.results||[],a=new Set,o=[];for(const c of[...n,...r])c&&c.id&&!a.has(c.id)&&(a.add(c.id),o.push(c));const s=["jackass","murder","killer","war","drug","crime","sex","violent","savaş","cinayet","uyuşturucu"];return o.filter(c=>{if(!(c.poster_path||c.backdrop_path)||Ke(c))return!1;const u=`${c.title||""} ${c.name||""} ${c.overview||""}`.toLowerCase();return!s.some(f=>u.includes(f))}).map(c=>({...c,type:"movie",media_type:"movie",overview:c.overview||De(c,"movie")}))}async function Ci(e="tv",t=1){const[i,n]=await Promise.all([pe(`/${e}/top_rated`,{page:t,language:"tr-TR"}),pe(`/${e}/top_rated`,{page:t,language:"en-US"})]);if(!i||!i.results)return[];const r=new Map((n?.results||[]).map(a=>[a.id,a.overview]));return Promise.all(i.results.filter(a=>(a.poster_path||a.backdrop_path)&&!Ke(a)).map(async a=>{let o=(a.overview||"").trim();const s=(r.get(a.id)||"").trim();return(!o||o.length<15)&&s&&s.length>10&&(o=await ss(s)),{...a,type:e,media_type:e,overview:o||s||De(a,e)}}))}async function xl({type:e="tv",genreId:t=null,page:i=1,sortBy:n="popularity.desc",minRating:r=0,isAnime:a=!1,isDoc:o=!1,yearMin:s=null,yearMax:c=null,withNetworks:u=null,withProviders:f=null}){const h={sort_by:n,page:i,language:"tr-TR"};return a?(h.with_genres=t?`16,${t}`:"16",h.with_original_language="ja"):o?h.with_genres=t?`99,${t}`:"99":t&&(h.with_genres=t),r>0&&(h["vote_average.gte"]=r,h["vote_count.gte"]=40),s&&(e==="movie"?h["primary_release_date.gte"]=`${s}-01-01`:h["first_air_date.gte"]=`${s}-01-01`),c&&(e==="movie"?h["primary_release_date.lte"]=`${c}-12-31`:h["first_air_date.lte"]=`${c}-12-31`),u&&(e==="tv"?h.with_networks=u:(h.with_watch_providers=f||u,h.watch_region="TR")),((await pe(e==="movie"?"/discover/movie":"/discover/tv",h))?.results||[]).filter(w=>(w.poster_path||w.backdrop_path)&&!Ke(w)).map(w=>(a&&w.id&&we(w.id),{...w,type:a?"anime":e,media_type:a?"anime":e,isAnime:a,isSeries:e==="tv"}))}function De(e,t="tv"){if(!e)return"Sürükleyici atmosferi ve zengin hikaye örgüsüyle izleyicileri ekran başına kilitleyen etkileyici bir yapım.";const i=e.title||e.name||"Bu yapım",n=t==="tv"||e.media_type==="tv"||!!e.first_air_date||e.seasons&&e.seasons.length>0||!!e.number_of_seasons,r=n?"dizi":"film";let a=[];Array.isArray(e.genres)&&e.genres.length>0&&(a=e.genres.map(k=>typeof k=="string"?k:k.name).filter(Boolean));const o=a.length>0?a.slice(0,3).join(", "):n?"Dram ve Gerilim":"Sinema",s=e.release_date||e.first_air_date||(e.year?String(e.year):""),c=s?` ${s.slice(0,4)} yılında izleyiciyle buluşan ve`:"",u=Number(e.vote_average||e.rating||0),f=u>0?`IMDb'de ${u.toFixed(1)}/10 gibi başarılı bir puana sahip olan`:"Eleştirmenler ve izleyiciler tarafından büyük beğeni toplayan";let h="";const m=e.credits?.cast||[];if(m.length>0){const k=m.slice(0,3).map(T=>T.name).filter(Boolean).join(", ");k&&(h=` Başrollerinde ${k} gibi başarılı isimlerin yer aldığı`)}let y="";const g=e.credits?.crew?.filter(k=>k.job==="Director").map(k=>k.name)||[],w=e.created_by?.map(k=>k.name)||[],_=g[0]||w[0];_&&(y=` ${_} imzalı`);let p="";return e.tagline&&e.tagline.trim().length>6&&(p=` "${e.tagline.trim()}" temasıyla dikkat çeken yapım,`),`${i}, ${o} türünde öne çıkan${c}${y}${h} etkileyici bir ${r} deneyimi sunuyor.${p} ${f} yapım, beklenmedik ters köşeleri, derin karakter gelişimleri ve soluksuz temposuyla izleyenlere unutulmaz anlar vadediyor.`}async function Zs(e="tv",t){const i=await pe(`/${e}/${t}`,{append_to_response:"credits,similar,recommendations,videos,external_ids",language:"tr-TR"});if(!i)return null;(i.original_language==="ja"||Array.isArray(i.origin_country)&&i.origin_country.includes("JP"))&&Array.isArray(i.genres)&&i.genres.some(s=>s.id===16||/anim/i.test(s.name))&&i.id&&we(i.id);let r=(i.overview||"").trim();if(!r||r.length<180)try{const s=await pe(`/${e}/${t}`,{language:"en-US"});if(s&&s.overview&&s.overview.trim().length>r.length+30){const c=await ss(s.overview.trim());c&&c.length>r.length&&(i.overview=c)}}catch{}(!i.overview||i.overview.trim().length<20)&&(i.overview=De(i,e));let a=i.videos?.results||[];if(!a.some(s=>s.site==="YouTube"&&(s.type==="Trailer"||s.type==="Teaser")))try{const c=(await pe(`/${e}/${t}/videos`,{language:"en-US"}))?.results||[];c.length>0&&(i.videos=i.videos||{},i.videos.results=[...a,...c])}catch{}return i}const $n=new Map;function na(e,t){if(!e||e.site!=="YouTube"||!e.key)return-1;let n={Trailer:500,Teaser:360,Promo:280,"Opening Credits":240,Clip:160,Featurette:100}[e.type]||50;return e.official===!0&&(n+=1e3),t==="tr"?n+=50:t==="en"?n+=25:t==="ja"&&(n+=15),/official|resmi|final trailer|main trailer|tanıtım|fragman/i.test(e.name||"")&&(n+=80),/fan|concept|reaction|breakdown/i.test(e.name||"")&&(n-=800),n}function zd(e="tv",t,i=""){if(Rt().trailersEnabled===!1)return Promise.resolve(null);const n=`${e}:${t}`;if($n.has(n))return $n.get(n);const r=(async()=>{try{const[a,o,s]=await Promise.all([pe(`/${e}/${t}/videos`,{language:"tr-TR"}).catch(()=>null),pe(`/${e}/${t}/videos`,{language:"en-US"}).catch(()=>null),pe(`/${e}/${t}/videos`,{include_video_language:"tr,en,ja,ko,null"}).catch(()=>null)]),c=new Set,u=[],f=(m,y)=>{if(Array.isArray(m))for(const g of m)g&&g.key&&!c.has(g.key)&&(c.add(g.key),u.push({video:g,language:y||g.iso_639_1||"en"}))};f(a?.results,"tr"),f(o?.results,"en"),f(s?.results,""),u.sort((m,y)=>na(y.video,y.language)-na(m.video,m.language));const h=u.find(m=>na(m.video,m.language)>=0)?.video;if(h?.key){const m=h.key.trim(),y=encodeURIComponent(m);return{key:m,name:h.name||"Resmi Fragman",site:h.site,type:h.type,embedUrl:`https://www.youtube.com/embed/${y}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,watchUrl:`https://www.youtube.com/watch?v=${y}`}}if(i&&typeof i=="string"&&i.trim().length>1){const m=i.trim(),y=`${m} Fragman`;return{key:"",name:`${m} Tanıtım`,site:"YouTube",type:"Trailer",embedUrl:`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(y)}&autoplay=1&rel=0`,watchUrl:`https://www.youtube.com/results?search_query=${encodeURIComponent(y)}`}}}catch{}return null})();return $n.set(n,r),r.then(a=>{a||$n.delete(n)}),r}async function Od(e,t=1){const i=await pe(`/tv/${e}/season/${t}`,{language:"tr-TR"});if(!i||!i.episodes)return i;const n=await pe(`/tv/${e}/season/${t}`,{language:"en-US"});return await Promise.all(i.episodes.map(async(r,a)=>{let o=r.overview?r.overview.trim():"";(!o||o.length<5)&&n&&n.episodes&&n.episodes[a]&&n.episodes[a].overview&&(o=n.episodes[a].overview),o&&(!r.overview||r.overview.length<5)&&(r.overview=await ss(o))})),i}async function cs(e,t=1){if(!e||!e.trim())return[];const i=e.trim().toLowerCase(),[n,r,a]=await Promise.all([pe("/search/multi",{query:i,page:t,language:"tr-TR",include_adult:!1}),pe("/search/multi",{query:i,page:t,language:"en-US",include_adult:!1}),pe("/search/tv",{query:i,page:t,language:"tr-TR",include_adult:!1})]),o=new Map,s=u=>{if(Array.isArray(u)){for(const f of u)if(!(!f||!f.id)&&!(!f.poster_path&&!f.backdrop_path)&&!Ke(f)&&!o.has(f.id)){const h=f.media_type==="tv"||!!f.first_air_date||f.name&&!f.title;o.set(f.id,{...f,type:h?"tv":"movie",media_type:h?"tv":"movie"})}}};s(n?.results),s(r?.results),s(a?.results);const c=Array.from(o.values());return c.sort((u,f)=>{const h=(u.title||u.name||u.original_title||u.original_name||"").toLowerCase(),m=(f.title||f.name||f.original_title||f.original_name||"").toLowerCase(),y=h===i?100:h.startsWith(i)?50:0,g=m===i?100:m.startsWith(i)?50:0,w=y+Math.min(100,(u.vote_count||0)/50)+(u.popularity||0)*.5;return g+Math.min(100,(f.vote_count||0)/50)+(f.popularity||0)*.5-w}),c}const vt={ACTION_ADVENTURE:10759,ANIMATION:16,COMEDY:35,CRIME:80,DOCUMENTARY:99,DRAMA:18,FAMILY:10751,MYSTERY:9648,SCI_FI_FANTASY:10765,WAR_POLITICS:10768,WESTERN:37},Ue={ACTION:28,ADVENTURE:12,ANIMATION:16,COMEDY:35,CRIME:80,DOCUMENTARY:99,DRAMA:18,FAMILY:10751,FANTASY:14,HISTORY:36,HORROR:27,MUSIC:10402,MYSTERY:9648,ROMANCE:10749,SCI_FI:878,THRILLER:53,WESTERN:37};async function Nd(e){if(!e)return null;const t=await pe(`/person/${e}`,{language:"tr-TR",append_to_response:"combined_credits"});if(!t||!t.biography||t.biography.trim().length===0){const i=await pe(`/person/${e}`,{language:"en-US",append_to_response:"combined_credits"});if(i)if(t)t.biography=i.biography,!t.combined_credits&&i.combined_credits&&(t.combined_credits=i.combined_credits);else return i}return t}function X(e,t="info",i=3500){const n=document.getElementById("toast-container");if(!n)return;const r=document.createElement("div");r.className=`toast toast-${t}`;let a="info";t==="success"&&(a="check-circle"),t==="error"&&(a="alert-circle"),r.innerHTML=`
    <i data-lucide="${a}"></i>
    <span>${e}</span>
  `,n.appendChild(r),Z(),setTimeout(()=>{r.style.opacity="0",r.style.transform="translateX(100%)",r.style.transition="all 0.3s ease-out",setTimeout(()=>{r.parentNode&&r.parentNode.removeChild(r)},300)},i)}const gt="https://api.trakt.tv",qd="AsVFyJXykTMViLCXPMAvFGtk7B_npj5Y3STpzljYnwY",Fd="4b6l8YaAG-GzyY6cSPFR5ea66xrXYEqrrHhn3FiWa7k",ot={TOKEN:"cinepulse_trakt_token",USER:"cinepulse_trakt_user",SETTINGS:"cinepulse_trakt_settings",LAST_SYNC:"cinepulse_trakt_last_sync"};let ui=null,or=null,lr=0;function Rr(){return localStorage.getItem("cinepulse_trakt_custom_client_id")||qd}function El(){return localStorage.getItem("cinepulse_trakt_custom_client_secret")||Fd}function Ui(){try{const e=localStorage.getItem(ot.SETTINGS);if(e)return JSON.parse(e)}catch{}return{autoScrobble:!0,scrobbleThreshold:80,autoSyncOnLaunch:!0}}function Xs(e){const i={...Ui(),...e};return localStorage.setItem(ot.SETTINGS,JSON.stringify(i)),i}const Qs=15*60*1e3;let eo=!1,ra=!1,Tl=0;function Al(e){if(eo){ti()&&to(e);return}eo=!0;const t=()=>{document.visibilityState!=="hidden"&&(Date.now()-Tl<Qs||to(e))};window.setTimeout(t,4e3),window.setInterval(t,Qs),document.addEventListener("visibilitychange",t)}async function to(e){if(!(!Ui().autoSyncOnLaunch||!ti()||ra)){ra=!0,Tl=Date.now();try{(await Ll(e)).errors.length}catch{}finally{ra=!1}}}function Cl(){try{const e=localStorage.getItem(ot.TOKEN);return e?JSON.parse(e):null}catch{return null}}function ti(){const e=Cl();return!!(e&&e.access_token)}function Hd(){try{const e=localStorage.getItem(ot.USER);return e?JSON.parse(e):null}catch{return null}}function Ud(){const e=localStorage.getItem(ot.LAST_SYNC);return e?Number(e):null}async function yi(){const e=Cl();if(!e||!e.access_token)return null;const t=Math.floor(Date.now()/1e3);if((e.created_at||0)+(e.expires_in||0)-t<86400&&e.refresh_token)try{const n=await Wd(e.refresh_token);if(n?.access_token)return n.access_token}catch{}return e.access_token}async function jd(){const e=Rr(),t=await fetch(`${gt}/oauth/device/code`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({client_id:e})});if(!t.ok){const i=await t.text();throw new Error(`Device code error (${t.status}): ${i}`)}return await t.json()}function Kd(e,t=5,i=()=>{}){ui&&ui.abort(),ui=new AbortController;const{signal:n}=ui;return new Promise((r,a)=>{const o=Rr(),s=El();let c=Math.max(t,5)*1e3;const u=async()=>{if(n.aborted){a(new Error("Auth polling cancelled"));return}try{const f=await fetch(`${gt}/oauth/device/token`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:e,client_id:o,client_secret:s}),signal:n});if(f.status===200){const m=await f.json();localStorage.setItem(ot.TOKEN,JSON.stringify(m));let y=null;try{y=await Gd(m.access_token),y&&localStorage.setItem(ot.USER,JSON.stringify(y))}catch{}window.dispatchEvent(new CustomEvent("cinepulse_trakt_auth_changed",{detail:{connected:!0,user:y}})),r(m);return}if(f.status===400){i({status:"pending",message:"Kullanıcı onayı bekleniyor..."}),n.aborted||setTimeout(u,c);return}if(f.status===404)throw new Error("Geçersiz cihaz kodu.");if(f.status===409)throw new Error("Bu kod zaten kullanılmış.");if(f.status===410)throw new Error("Kodun süresi doldu. Lütfen tekrar deneyin.");if(f.status===429){c+=2e3,n.aborted||setTimeout(u,c);return}const h=await f.text();throw new Error(`Trakt auth failed: ${h}`)}catch(f){if(n.aborted)return;a(f)}};setTimeout(u,c)})}function Ba(){ui&&(ui.abort(),ui=null)}async function Wd(e){const t=Rr(),i=El(),n=await fetch(`${gt}/oauth/token`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refresh_token:e,client_id:t,client_secret:i,grant_type:"refresh_token"})});if(!n.ok)throw new Error("Token refresh failed");const r=await n.json();return localStorage.setItem(ot.TOKEN,JSON.stringify(r)),r}function Yd(){Ba(),localStorage.removeItem(ot.TOKEN),localStorage.removeItem(ot.USER),localStorage.removeItem(ot.LAST_SYNC),window.dispatchEvent(new CustomEvent("cinepulse_trakt_auth_changed",{detail:{connected:!1}}))}function Ot(e){return{"Content-Type":"application/json","trakt-api-version":"2","trakt-api-key":Rr(),Authorization:`Bearer ${e}`}}async function Gd(e=null){const t=e||await yi();if(!t)return null;const i=await fetch(`${gt}/users/me?extended=full`,{headers:Ot(t)});if(!i.ok)return null;const n=await i.json();return localStorage.setItem(ot.USER,JSON.stringify(n)),n}function ds(e,t=0){const i=Math.min(100,Math.max(0,Math.round(t))),n=e.tmdbId||e.id;return(e.isSeries===!0?!0:e.isSeries===!1||e.type==="movie"?!1:!!(e.type==="tv"||e.season&&Number(e.season)>0&&e.type!=="movie"))?{show:{title:e.seriesTitle||e.title||"",ids:{tmdb:Number(n)||void 0}},episode:{season:Math.max(1,Number(e.season)||1),number:Math.max(1,Number(e.episode)||1)},progress:i,app_version:"2.0.0",app_date:"2026-09-25"}:{movie:{title:e.title||"",ids:{tmdb:Number(n)||void 0}},progress:i,app_version:"2.0.0",app_date:"2026-09-25"}}async function rm(e,t=0){if(!Ui().autoScrobble||!ti())return null;const n=Date.now();if(or==="start"&&n-lr<8e3)return null;const r=await yi();if(!r)return null;try{const a=ds(e,t),o=await fetch(`${gt}/scrobble/start`,{method:"POST",headers:Ot(r),body:JSON.stringify(a)});if(o.ok)return or="start",lr=n,await o.json()}catch{}return null}async function am(e,t=0){if(!Ui().autoScrobble||!ti())return null;const n=await yi();if(!n)return null;try{const r=ds(e,t),a=await fetch(`${gt}/scrobble/pause`,{method:"POST",headers:Ot(n),body:JSON.stringify(r),keepalive:!0});if(a.ok)return or="pause",lr=Date.now(),await a.json()}catch{}return null}async function sm(e,t=100){if(!Ui().autoScrobble||!ti())return null;const n=await yi();if(!n)return null;try{const r=ds(e,t),a=await fetch(`${gt}/scrobble/stop`,{method:"POST",headers:Ot(n),body:JSON.stringify(r),keepalive:!0});if(a.ok)return or="stop",lr=Date.now(),await a.json()}catch{}return null}async function Vd(e){const t=await yi();if(!t||!e||!e.length)return null;const i=[],n=new Map;for(const s of e){const c=s.tmdbId||s.id,u=Number(c);if(!u||isNaN(u))continue;const f=new Date(Number(s.lastWatchedAt)||s.lastWatchedAt||Date.now()),h=Number.isNaN(f.getTime())?new Date().toISOString():f.toISOString();if(s.type==="movie"?!1:!!(s.isSeries||s.type==="tv"||s.type==="anime")){const y=Math.max(1,Number(s.season)||1),g=Math.max(1,Number(s.episode)||1);n.has(u)||n.set(u,{title:s.title||"",ids:{tmdb:u},seasonsMap:new Map});const w=n.get(u);w.seasonsMap.has(y)||w.seasonsMap.set(y,[]),w.seasonsMap.get(y).push({number:g,watched_at:h})}else i.push({title:s.title||"",watched_at:h,ids:{tmdb:u}})}const r=Array.from(n.values()).map(s=>({title:s.title,ids:s.ids,seasons:Array.from(s.seasonsMap.entries()).map(([c,u])=>({number:c,episodes:u}))}));if(i.length===0&&r.length===0)return null;const a={};i.length>0&&(a.movies=i),r.length>0&&(a.shows=r);const o=await fetch(`${gt}/sync/history`,{method:"POST",headers:Ot(t),body:JSON.stringify(a)});if(!o.ok){const s=await o.text();throw new Error(`Trakt API Hatası (${o.status}): ${s}`)}return await o.json()}const Jd="4e44d9029b1270a757cddc766a1bcb63",aa=new Map;async function sa(e,t=!1){const i=`${t?"tv":"movie"}_${e}`;if(aa.has(i))return aa.get(i);try{const r=await fetch(`https://api.themoviedb.org/3/${t?"tv":"movie"}/${e}?api_key=${Jd}&language=tr-TR`);if(r.ok){const a=await r.json();return aa.set(i,a),a}}catch{}return null}async function io(e,t){const i=[],n=new Set,r=e==="shows"?100:250;for(let a=1;;a++){const o=new URLSearchParams({page:String(a),limit:String(r)});e==="shows"&&o.set("extended","progress");const s=await fetch(`${gt}/sync/watched/${e}?${o}`,{headers:Ot(t)});if(!s.ok)throw new Error(`İzlenen ${e==="shows"?"diziler":"filmler"} alınamadı (${s.status})`);const c=await s.json();if(!Array.isArray(c))throw new Error("Trakt izlenenler yanıtı geçersiz");if(c.length===0)break;let u=0;for(const h of c){const m=h[e==="shows"?"show":"movie"]?.ids?.trakt;m&&n.has(m)||(m&&n.add(m),i.push(h),u++)}if(!u)break;const f=Number(s.headers?.get("X-Pagination-Page-Count"));if(f&&a>=f||!f&&c.length<r)break}return i}async function Zd(e){const t=await yi();if(!t)return{importedPlaybackCount:0,importedHistoryCount:0};const{saveWatchProgress:i,saveBatchWatchProgress:n,getWatchHistory:r}=e;if(!i&&!n)return{importedPlaybackCount:0,importedHistoryCount:0};let a=0,o=0;const s=[],c=[],u=r?r():[],f=new Map;for(const h of u){const m=`${h.id}_${h.season||1}_${h.episode||1}`;f.set(m,h)}try{const h=await fetch(`${gt}/sync/playback?extended=full&limit=50`,{headers:Ot(t),signal:AbortSignal.timeout(8e3)});if(h.ok){const m=await h.json();if(Array.isArray(m)){for(const y of m){const g=y.type==="movie",w=g?y.movie:y.show||y.episode,_=g?y.movie?.ids?.tmdb||w?.ids?.tmdb:y.show?.ids?.tmdb||y.episode?.ids?.tmdb||w?.ids?.tmdb;if(!_)continue;const p=g?1:y.episode?.season||1,k=g?1:y.episode?.number||1,T=Math.min(99,Math.max(1,Math.round(y.progress||0))),C=y.paused_at?new Date(y.paused_at).getTime():Date.now(),S=`${_}_${p}_${k}`,$=f.get(S);let L=$?.poster_path||$?.posterPath||"",P=$?.backdrop_path||$?.backdropPath||"",B=$?.title||y.show?.title||w?.title||"",z=g?6600:3e3,Y={};if(!L||!B){const N=await sa(_,!g);N&&(L=N.poster_path||"",P=N.backdrop_path||"",B=N.title||N.name||B,N.runtime?z=N.runtime*60:N.episode_run_time?.[0]&&(z=N.episode_run_time[0]*60),g||(Y={number_of_episodes:N.number_of_episodes,number_of_seasons:N.number_of_seasons,status:N.status,seasons:N.seasons}))}const K=Math.max(60,Math.round(T/100*z));c.push({id:_,title:B,posterPath:L,backdropPath:P,type:g?"movie":"tv",isSeries:!g,season:g?void 0:p,episode:g?void 0:k,currentTime:K,duration:z,progressPercent:T,completed:!1,traktImported:!0,lastWatchedAt:C,...Y}),a++}c.length>0&&(n?n(c):i&&c.forEach(y=>i(y)),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{action:"playback_import",source:"trakt"}})))}}}catch(h){s.push(h.message)}try{{const h=await io("movies",t);if(Array.isArray(h))for(let m=0;m<h.length;m+=5){const y=h.slice(m,m+5);await Promise.all(y.map(async g=>{const w=g.movie?.ids?.tmdb;if(!w)return;const _=`${w}_1_1`,p=f.get(_);if(p&&p.completed)return;const k=g.last_watched_at?new Date(g.last_watched_at).getTime():Date.now();let T=p?.poster_path||p?.posterPath||"",C=p?.backdrop_path||p?.backdropPath||"",S=p?.title||g.movie?.title||"",$=6600;if(!T||!S){const L=await sa(w,!1);L&&(T=L.poster_path||"",C=L.backdrop_path||"",S=L.title||S,L.runtime&&($=L.runtime*60))}c.push({id:w,title:S,posterPath:T,backdropPath:C,type:"movie",isSeries:!1,currentTime:$,duration:$,progressPercent:100,completed:!0,traktImported:!0,lastWatchedAt:k}),o++}))}}}catch(h){s.push(h.message)}try{{const h=await io("shows",t);if(Array.isArray(h))for(let m=0;m<h.length;m+=4){const y=h.slice(m,m+4);await Promise.all(y.map(async g=>{const w=g.show?.ids?.tmdb;if(!w)return;const _=g.show?.title||"",p=await sa(w,!0),k=p?.poster_path||"",T=p?.backdrop_path||"",C=p?.name||p?.title||_,S=p?.episode_run_time?.[0]?p.episode_run_time[0]*60:3e3,$={number_of_episodes:p?.number_of_episodes,number_of_seasons:p?.number_of_seasons,status:p?.status,seasons:p?.seasons},L=Array.isArray(g.seasons)?g.seasons:[];for(const P of L){const B=P.number,z=Array.isArray(P.episodes)?P.episodes:[];for(const Y of z){const K=Y.number,N=`${w}_${B}_${K}`,q=f.get(N);if(q&&q.completed)continue;const j=Y.last_watched_at?new Date(Y.last_watched_at).getTime():Date.now();c.push({id:w,title:C,posterPath:k,backdropPath:T,type:"tv",isSeries:!0,season:B,episode:K,currentTime:S,duration:S,progressPercent:100,completed:!0,traktImported:!0,lastWatchedAt:j,...$}),o++}}}))}}}catch(h){s.push(h.message)}if(c.length>0){if(n)n(c);else if(i)for(const h of c)i(h)}return window.dispatchEvent(new CustomEvent("cinepulse_data_changed",{detail:{action:"import",source:"trakt"}})),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{action:"import",source:"trakt"}})),{importedPlaybackCount:a,importedHistoryCount:o,errors:s}}async function Ll(e){if(!ti())throw new Error("Trakt hesabı bağlı değil");const{getWatchHistory:t,saveWatchProgress:i,saveBatchWatchProgress:n}=e,r={pushedMoviesCount:0,pushedEpisodesCount:0,importedPlaybackCount:0,importedHistoryCount:0,errors:[]};if(i||n)try{const a=await Zd(e);r.importedPlaybackCount=a.importedPlaybackCount||0,r.importedHistoryCount=a.importedHistoryCount||0,r.errors.push(...a.errors||[])}catch(a){r.errors.push(`Trakt'tan aktarma: ${a.message}`)}try{const o=(t?t():[]).filter(s=>s.completed&&!s.traktImported);if(o.length>0){const s=await Vd(o);if(s&&s.added){r.pushedMoviesCount=s.added.movies||0,r.pushedEpisodesCount=s.added.episodes||0;const c=Object.values(s.not_found||{}).reduce((u,f)=>u+(Array.isArray(f)?f.length:0),0);c&&r.errors.push(`Trakt ${c} içeriği katalogunda bulamadı`)}}}catch(a){r.errors.push(`Trakt'a gönderme: ${a.message||"Senkronizasyon hatası"}`)}return r.errors.length===0&&localStorage.setItem(ot.LAST_SYNC,String(Date.now())),r}async function Xd(){const e=await yi();if(!e)throw new Error("Trakt hesabı bağlı değil");const t=await fetch(`${gt}/sync/history?limit=1000`,{headers:Ot(e)});if(!t.ok)throw new Error("Trakt geçmişi alınamadı");const i=await t.json();if(!Array.isArray(i)||i.length===0)return 0;const n=i.map(o=>o.id).filter(Boolean);if(n.length===0)return 0;const r=await fetch(`${gt}/sync/history/remove`,{method:"POST",headers:Ot(e),body:JSON.stringify({ids:n})});if(!r.ok){const o=await r.text();throw new Error(`Trakt geçmişi silinemedi: ${o}`)}const a=await r.json();return(a.deleted?.movies||0)+(a.deleted?.episodes||0)}let ai=null;function cr(){let e=document.getElementById("trakt-modal");e||(e=document.createElement("div"),e.id="trakt-modal",e.className="modal-backdrop",document.body.appendChild(e));const t=(r="main",a={})=>{const o=ti(),s=Hd(),c=Ui(),u=Ud();let f="Henüz yapılmadı";if(u){const h=new Date(u);f=`${h.toLocaleDateString("tr-TR")} ${h.toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})}`}if(r==="connecting"){const{userCode:h,verificationUrl:m,expiresIn:y}=a;e.innerHTML=`
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
              <a href="${m||"https://trakt.tv/activate"}" target="_blank" rel="noopener noreferrer" class="btn-primary trakt-btn-glow" style="padding: 0.75rem 1.6rem; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
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
                    <span>Son Eşitleme: <strong>${f}</strong></span>
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
                    <input type="checkbox" id="trakt-toggle-autosync" ${c.autoSyncOnLaunch?"checked":""} />
                    <span class="slider-round"></span>
                  </label>
                </div>
                <div class="trakt-setting-row">
                  <div>
                    <div class="trakt-setting-title">Otomatik Scrobble (Canlı Takip)</div>
                    <div class="trakt-setting-sub">Oynatıcı açıkken içeriğin izleme durumunu Trakt'a anlık bildirir.</div>
                  </div>
                  <label class="switch-toggle">
                    <input type="checkbox" id="trakt-toggle-scrobble" ${c.autoScrobble?"checked":""} />
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
      `;e.classList.remove("hidden"),document.body.style.overflow="hidden",Z(e),n(r)},i=()=>{Ba(),e.classList.add("hidden"),e.innerHTML="",document.body.style.overflow="",ai&&(window.removeEventListener("keydown",ai),ai=null)},n=r=>{const a=document.getElementById("trakt-close-btn"),o=document.getElementById("trakt-close-footer-btn");if(a&&(a.onclick=i),o&&(o.onclick=i),e.onclick=s=>{s.target===e&&i()},ai&&window.removeEventListener("keydown",ai),ai=s=>{s.key==="Escape"&&i()},window.addEventListener("keydown",ai),r==="connecting"){const s=document.getElementById("btn-copy-trakt-code");s&&(s.onclick=()=>{const u=s.querySelector(".trakt-code-text")?.textContent;u&&navigator.clipboard.writeText(u).then(()=>{X("Aktivasyon kodu kopyalandı!","success")}).catch(()=>{X(`Kod: ${u}`,"info")})});const c=document.getElementById("btn-cancel-trakt-poll");c&&(c.onclick=()=>{Ba(),t("main")})}else{const s=document.getElementById("btn-start-trakt-connect");s&&(s.onclick=async()=>{s.disabled=!0,s.innerHTML="<span>Kod alınıyor...</span>";try{const g=await jd();t("connecting",{userCode:g.user_code,verificationUrl:g.verification_url,expiresIn:g.expires_in}),Kd(g.device_code,g.interval,w=>{const _=document.getElementById("trakt-poll-status-text");_&&(_.textContent=w.message)}).then(()=>{X("Trakt.tv başarıyla bağlandı!","success"),t("main")}).catch(w=>{w.message!=="Auth polling cancelled"&&(X(`Bağlantı hatası: ${w.message}`,"error"),t("main"))})}catch(g){X(`Trakt bağlantı başlatılamadı: ${g.message}`,"error"),t("main")}});const c=document.getElementById("btn-trakt-sync-now");c&&(c.onclick=async()=>{const g=document.getElementById("trakt-sync-icon"),w=document.getElementById("trakt-sync-result");c.disabled=!0,g&&g.classList.add("trakt-spin");try{const _=await Ll({getWatchHistory:Re,saveWatchProgress:ns,saveBatchWatchProgress:fl});w&&(w.style.display="block",w.innerHTML=`
                <strong>${_.errors.length?"Senkronizasyon kısmen tamamlandı":"✓ Karşılıklı senkronizasyon tamamlandı!"}</strong><br/>
                • ${_.pushedMoviesCount} film & ${_.pushedEpisodesCount} dizi Trakt'a yüklendi<br/>
                • ${_.importedPlaybackCount} yarım kalan & ${_.importedHistoryCount} izlenen Trakt'tan CinePulse'a aktarıldı
              `),_.errors.length?X(`Trakt senkronizasyon uyarısı: ${_.errors.join("; ")}`,"error"):(X("CinePulse ve Trakt başarıyla karşılıklı eşitlendi!","success"),setTimeout(()=>t("main"),2500))}catch(_){X(`Aktarım hatası: ${_.message}`,"error")}finally{c.disabled=!1,g&&g.classList.remove("trakt-spin")}});const u=document.getElementById("btn-clean-trakt-history");u&&(u.onclick=()=>{const g=ud();X(`${g} adet hatalı Trakt kaydı geçmişten temizlendi!`,"success"),t("main")});const f=document.getElementById("btn-wipe-trakt-history");f&&(f.onclick=async()=>{if(confirm("Trakt.tv hesabınızdaki tüm izleme geçmişini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")){f.disabled=!0,f.innerHTML="<span>Sıfırlanıyor...</span>";try{const g=await Xd();X(`Trakt hesabından ${g} adet kayıt tamamen silindi!`,"success"),t("main")}catch(g){X(`Hata: ${g.message}`,"error"),f.disabled=!1,t("main")}}});const h=document.getElementById("trakt-toggle-autosync");h&&(h.onchange=g=>{Xs({autoSyncOnLaunch:g.target.checked}),X(g.target.checked?"Açılışta otomatik eşitleme açıldı":"Açılışta otomatik eşitleme kapatıldı","info")});const m=document.getElementById("trakt-toggle-scrobble");m&&(m.onchange=g=>{Xs({autoScrobble:g.target.checked}),X(g.target.checked?"Otomatik Scrobble açıldı":"Otomatik Scrobble kapatıldı","info")});const y=document.getElementById("btn-trakt-disconnect");y&&(y.onclick=()=>{confirm("Trakt.tv bağlantısını kesmek istediğinize emin misiniz?")&&(Yd(),X("Trakt.tv bağlantısı kesildi","info"),t("main"))})}};t("main")}function $l(){const e=document.getElementById("data-modal");if(!e)return;const t=kd();e.innerHTML=`
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
            <div>• Bağlantı: <strong>${ti()?'<span style="color:#4ade80;">● Bağlı</span>':'<span style="color:#94a3b8;">○ Bağlı Değil</span>'}</strong></div>
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
  `,e.classList.remove("hidden"),document.body.style.overflow="hidden",Z();const i=document.getElementById("data-close-btn"),n=document.getElementById("data-close-footer-btn");let r=null;const a=()=>{e.classList.add("hidden"),e.innerHTML="",document.body.style.overflow="",r&&(window.removeEventListener("keydown",r),r=null)};i&&i.addEventListener("click",a),n&&n.addEventListener("click",a),e.onclick=m=>{m.target===e&&a()},r=m=>{m.key==="Escape"&&a()},window.addEventListener("keydown",r);const o=document.getElementById("btn-export-json");o&&o.addEventListener("click",()=>{try{bl(),X("JSON yedekleme tamamlandı.","success")}catch(m){X(m?.message||"JSON yedeği kaydedilemedi.","error")}});const s=document.getElementById("btn-open-trakt-from-data");s&&s.addEventListener("click",()=>{a(),cr()});const c=document.getElementById("json-dropzone"),u=document.getElementById("json-file-input");c&&u&&(c.addEventListener("click",()=>u.click()),c.addEventListener("dragover",m=>{m.preventDefault(),c.style.borderColor="var(--accent-green)"}),c.addEventListener("dragleave",()=>{c.style.borderColor="rgba(99, 102, 241, 0.4)"}),c.addEventListener("drop",m=>{m.preventDefault(),c.style.borderColor="rgba(99, 102, 241, 0.4)",m.dataTransfer.files.length>0&&f(m.dataTransfer.files[0])}),u.addEventListener("change",m=>{m.target.files.length>0&&f(m.target.files[0])}));function f(m){if(!m)return;const y=new FileReader;y.onload=g=>{try{const w=document.querySelector('input[name="import-mode"]:checked'),_=w?w.value:"merge",p=wl(g.target.result,_);p.success?(X(`✓ Yedek yüklendi! (${p.countHistory} izleme kaydı, ${p.countFavs} favori aktarıldı)`,"success"),a()):X(`Yükleme hatası: ${p.message||p.error}`,"error")}catch(w){X(`Yedek dosyası işlenirken hata oluştu: ${w.message}`,"error")}},y.onerror=()=>{X("Dosya okunamadı.","error")},y.readAsText(m)}const h=document.getElementById("btn-clear-all-data");h&&h.addEventListener("click",()=>{confirm("Tüm izleme geçmişinizi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!")&&(_d(),X("Tüm yerel veriler temizlendi.","info"),a())})}let Li=null,ln=!1;function dr(){return window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===!0||document.referrer.includes("android-app://")}function Qd(){if(dr()){ln=!0,Gi(!1);return}window.addEventListener("beforeinstallprompt",t=>{t.preventDefault(),Li=t,Gi(!0)}),window.addEventListener("appinstalled",()=>{Li=null,ln=!0,Gi(!1),X("CinePulse başarıyla cihazınıza yüklendi!","success")}),window.matchMedia("(display-mode: standalone)").addEventListener("change",t=>{t.matches&&(ln=!0,Gi(!1))}),/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream&&!dr()&&setTimeout(()=>{Gi(!0)},1e3)}function Gi(e){document.querySelectorAll(".btn-pwa-install").forEach(i=>{e&&!ln&&!dr()?i.classList.remove("hidden"):i.classList.add("hidden")})}async function eu(){if(dr()||ln){X("CinePulse zaten bir uygulama olarak yüklü.","info");return}if(Li){try{Li.prompt(),(await Li.userChoice).outcome==="accepted"?X("Yükleme başlatıldı...","success"):X("Yükleme iptal edildi.","info"),Li=null}catch{}return}/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream?tu():iu()}function tu(){let e=document.getElementById("pwa-ios-modal");e||(e=document.createElement("div"),e.id="pwa-ios-modal",e.className="modal-backdrop pwa-guide-modal",e.innerHTML=`
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
    `,document.body.appendChild(e),e.querySelector(".pwa-close-btn").addEventListener("click",()=>{e.classList.add("hidden")}),e.querySelector(".pwa-done-btn").addEventListener("click",()=>{e.classList.add("hidden")}),e.addEventListener("click",t=>{t.target===e&&e.classList.add("hidden")})),e.classList.remove("hidden")}function iu(){X('Tarayıcınızın adres çubuğundaki "Yükle / Uygulamayı Yükle" simgesine tıklayarak indirebilirsiniz.',"info",5e3)}const nu="modulepreload",ru=function(e,t){return new URL(e,t).href},no={},us=function(t,i,n){let r=Promise.resolve();if(i&&i.length>0){const o=document.getElementsByTagName("link"),s=document.querySelector("meta[property=csp-nonce]"),c=s?.nonce||s?.getAttribute("nonce");r=Promise.allSettled(i.map(u=>{if(u=ru(u,n),u in no)return;no[u]=!0;const f=u.endsWith(".css"),h=f?'[rel="stylesheet"]':"";if(!!n)for(let g=o.length-1;g>=0;g--){const w=o[g];if(w.href===u&&(!f||w.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${h}`))return;const y=document.createElement("link");if(y.rel=f?"stylesheet":nu,f||(y.as="script"),y.crossOrigin="",y.href=u,c&&y.setAttribute("nonce",c),document.head.appendChild(y),f)return new Promise((g,w)=>{y.addEventListener("load",g),y.addEventListener("error",()=>w(new Error(`Unable to preload CSS for ${u}`)))})}))}function a(o){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=o,window.dispatchEvent(s),!s.defaultPrevented)throw o}return r.then(o=>{for(const s of o||[])s.status==="rejected"&&a(s.reason);return t().catch(a)})};var Oi;(function(e){e.Unimplemented="UNIMPLEMENTED",e.Unavailable="UNAVAILABLE"})(Oi||(Oi={}));class oa extends Error{constructor(t,i,n){super(t),this.message=t,this.code=i,this.data=n}}const au=e=>{var t,i;return e?.androidBridge?"android":!((i=(t=e?.webkit)===null||t===void 0?void 0:t.messageHandlers)===null||i===void 0)&&i.bridge?"ios":"web"},su=e=>{const t=e.CapacitorCustomPlatform||null,i=e.Capacitor||{},n=i.Plugins=i.Plugins||{},r=()=>t!==null?t.name:au(e),a=()=>r()!=="web",o=h=>{const m=u.get(h);return!!(m?.platforms.has(r())||s(h))},s=h=>{var m;return(m=i.PluginHeaders)===null||m===void 0?void 0:m.find(y=>y.name===h)},c=h=>e.console.error(h),u=new Map,f=(h,m={})=>{const y=u.get(h);if(y)return y.proxy;const g=r(),w=s(h);let _;const p=async()=>(!_&&g in m?_=typeof m[g]=="function"?_=await m[g]():_=m[g]:t!==null&&!_&&"web"in m&&(_=typeof m.web=="function"?_=await m.web():_=m.web),_),k=(P,B)=>{var z,Y;if(w){const K=w?.methods.find(N=>B===N.name);if(K)return K.rtype==="promise"?N=>i.nativePromise(h,B.toString(),N):(N,q)=>i.nativeCallback(h,B.toString(),N,q);if(P)return(z=P[B])===null||z===void 0?void 0:z.bind(P)}else{if(P)return(Y=P[B])===null||Y===void 0?void 0:Y.bind(P);throw new oa(`"${h}" plugin is not implemented on ${g}`,Oi.Unimplemented)}},T=P=>{let B;const z=(...Y)=>{const K=p().then(N=>{const q=k(N,P);if(q){const j=q(...Y);return B=j?.remove,j}else throw new oa(`"${h}.${P}()" is not implemented on ${g}`,Oi.Unimplemented)});return P==="addListener"&&(K.remove=async()=>B()),K};return z.toString=()=>`${P.toString()}() { [capacitor code] }`,Object.defineProperty(z,"name",{value:P,writable:!1,configurable:!1}),z},C=T("addListener"),S=T("removeListener"),$=(P,B)=>{const z=C({eventName:P},B),Y=async()=>{const N=await z;S({eventName:P,callbackId:N},B)},K=new Promise(N=>z.then(()=>N({remove:Y})));return K.remove=async()=>{await Y()},K},L=new Proxy({},{get(P,B){switch(B){case"$$typeof":return;case"toJSON":return()=>({});case"addListener":return w?$:C;case"removeListener":return S;default:return T(B)}}});return n[h]=L,u.set(h,{name:h,proxy:L,platforms:new Set([...Object.keys(m),...w?[g]:[]])}),L};return i.convertFileSrc||(i.convertFileSrc=h=>h),i.getPlatform=r,i.handleError=c,i.isNativePlatform=a,i.isPluginAvailable=o,i.registerPlugin=f,i.Exception=oa,i.DEBUG=!!i.DEBUG,i.isLoggingEnabled=!!i.isLoggingEnabled,i},ou=e=>e.Capacitor=su(e),Da=ou(typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof globalThis<"u"?globalThis:{}),Ir=Da.registerPlugin;class ps{constructor(){this.listeners={},this.retainedEventArguments={},this.windowListeners={}}addListener(t,i){let n=!1;this.listeners[t]||(this.listeners[t]=[],n=!0),this.listeners[t].push(i);const a=this.windowListeners[t];a&&!a.registered&&this.addWindowListener(a),n&&this.sendRetainedArgumentsForEvent(t);const o=async()=>this.removeListener(t,i);return Promise.resolve({remove:o})}async removeAllListeners(){this.listeners={};for(const t in this.windowListeners)this.removeWindowListener(this.windowListeners[t]);this.windowListeners={}}notifyListeners(t,i,n){const r=this.listeners[t];if(!r){if(n){let a=this.retainedEventArguments[t];a||(a=[]),a.push(i),this.retainedEventArguments[t]=a}return}r.forEach(a=>a(i))}hasListeners(t){var i;return!!(!((i=this.listeners[t])===null||i===void 0)&&i.length)}registerWindowListener(t,i){this.windowListeners[i]={registered:!1,windowEventName:t,pluginEventName:i,handler:n=>{this.notifyListeners(i,n)}}}unimplemented(t="not implemented"){return new Da.Exception(t,Oi.Unimplemented)}unavailable(t="not available"){return new Da.Exception(t,Oi.Unavailable)}async removeListener(t,i){const n=this.listeners[t];if(!n)return;const r=n.indexOf(i);r!==-1&&this.listeners[t].splice(r,1),this.listeners[t].length||this.removeWindowListener(this.windowListeners[t])}addWindowListener(t){window.addEventListener(t.windowEventName,t.handler),t.registered=!0}removeWindowListener(t){t&&(window.removeEventListener(t.windowEventName,t.handler),t.registered=!1)}sendRetainedArgumentsForEvent(t){const i=this.retainedEventArguments[t];i&&(delete this.retainedEventArguments[t],i.forEach(n=>{this.notifyListeners(t,n)}))}}const ro=e=>encodeURIComponent(e).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),ao=e=>e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent);class lu extends ps{async getCookies(){const t=document.cookie,i={};return t.split(";").forEach(n=>{if(n.length<=0)return;let[r,a]=n.replace(/=/,"CAP_COOKIE").split("CAP_COOKIE");r=ao(r).trim(),a=ao(a).trim(),i[r]=a}),i}async setCookie(t){try{const i=ro(t.key),n=ro(t.value),r=t.expires?`; expires=${t.expires.replace("expires=","")}`:"",a=(t.path||"/").replace("path=",""),o=t.url!=null&&t.url.length>0?`domain=${t.url}`:"";document.cookie=`${i}=${n||""}${r}; path=${a}; ${o};`}catch(i){return Promise.reject(i)}}async deleteCookie(t){try{document.cookie=`${t.key}=; Max-Age=0`}catch(i){return Promise.reject(i)}}async clearCookies(){try{const t=document.cookie.split(";")||[];for(const i of t)document.cookie=i.replace(/^ +/,"").replace(/=.*/,`=;expires=${new Date().toUTCString()};path=/`)}catch(t){return Promise.reject(t)}}async clearAllCookies(){try{await this.clearCookies()}catch(t){return Promise.reject(t)}}}Ir("CapacitorCookies",{web:()=>new lu});const cu=async e=>new Promise((t,i)=>{const n=new FileReader;n.onload=()=>{const r=n.result;t(r.indexOf(",")>=0?r.split(",")[1]:r)},n.onerror=r=>i(r),n.readAsDataURL(e)}),du=(e={})=>{const t=Object.keys(e);return Object.keys(e).map(r=>r.toLocaleLowerCase()).reduce((r,a,o)=>(r[a]=e[t[o]],r),{})},uu=(e,t=!0)=>e?Object.entries(e).reduce((n,r)=>{const[a,o]=r;let s,c;return Array.isArray(o)?(c="",o.forEach(u=>{s=t?encodeURIComponent(u):u,c+=`${a}=${s}&`}),c.slice(0,-1)):(s=t?encodeURIComponent(o):o,c=`${a}=${s}`),`${n}&${c}`},"").substr(1):null,pu=(e,t={})=>{const i=Object.assign({method:e.method||"GET",headers:e.headers},t),r=du(e.headers)["content-type"]||"";if(typeof e.data=="string")i.body=e.data;else if(r.includes("application/x-www-form-urlencoded")){const a=new URLSearchParams;for(const[o,s]of Object.entries(e.data||{}))a.set(o,s);i.body=a.toString()}else if(r.includes("multipart/form-data")||e.data instanceof FormData){const a=new FormData;if(e.data instanceof FormData)e.data.forEach((s,c)=>{a.append(c,s)});else for(const s of Object.keys(e.data))a.append(s,e.data[s]);i.body=a;const o=new Headers(i.headers);o.delete("content-type"),i.headers=o}else(r.includes("application/json")||typeof e.data=="object")&&(i.body=JSON.stringify(e.data));return i};class fu extends ps{async request(t){const i=pu(t,t.webFetchExtra),n=uu(t.params,t.shouldEncodeUrlParams),r=n?`${t.url}?${n}`:t.url,a=await fetch(r,i),o=a.headers.get("content-type")||"";let{responseType:s="text"}=a.ok?t:{};o.includes("application/json")&&(s="json");let c,u;switch(s){case"arraybuffer":case"blob":u=await a.blob(),c=await cu(u);break;case"json":c=await a.json();break;case"document":case"text":default:c=await a.text()}const f={};return a.headers.forEach((h,m)=>{f[m]=h}),{data:c,headers:f,status:a.status,url:a.url}}async get(t){return this.request(Object.assign(Object.assign({},t),{method:"GET"}))}async post(t){return this.request(Object.assign(Object.assign({},t),{method:"POST"}))}async put(t){return this.request(Object.assign(Object.assign({},t),{method:"PUT"}))}async patch(t){return this.request(Object.assign(Object.assign({},t),{method:"PATCH"}))}async delete(t){return this.request(Object.assign(Object.assign({},t),{method:"DELETE"}))}}Ir("CapacitorHttp",{web:()=>new fu});var so;(function(e){e.Dark="DARK",e.Light="LIGHT",e.Default="DEFAULT"})(so||(so={}));var oo;(function(e){e.StatusBar="StatusBar",e.NavigationBar="NavigationBar"})(oo||(oo={}));class hu extends ps{async setStyle(){this.unavailable("not available for web")}async setAnimation(){this.unavailable("not available for web")}async show(){this.unavailable("not available for web")}async hide(){this.unavailable("not available for web")}}Ir("SystemBars",{web:()=>new hu});const za=Ir("App",{web:()=>us(()=>import("./web-CSLohTTE.js"),[],import.meta.url).then(e=>new e.AppWeb)}),lo="1.1.33",mu="https://cine-pulse-drab.vercel.app/version.json";let Vi=null,ci=0,co=!1;const Rl=6e4;function gn(){return typeof window>"u"?!1:!!(window.Capacitor?.isNativePlatform?.()||window.Capacitor?.getPlatform?.()==="android"||navigator.userAgent.includes("CinePulseAndroid"))}function gu(e,t){if(!e||!t)return!1;const i=u=>String(u).replace(/^v/i,"").split(".").map(f=>parseInt(f,10)||0),[n,r,a]=i(e),[o,s,c]=i(t);return n>o||n===o&&r>s||n===o&&r===s&&a>c}function yu(e){if(document.getElementById("cinepulse-update-modal"))return;const t=e.downloadUrl||"https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk",i=e.githubDownloadUrl||"https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk",n=document.createElement("div");n.id="cinepulse-update-modal",n.className="cinepulse-modal-overlay",n.style.cssText=`
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
`).filter(Boolean).map(u=>`<li style="margin-bottom: 0.45rem;">${uo(u.replace(/^[•\-\*]\s*/,""))}</li>`).join("");n.innerHTML=`
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
        ${uo(e.title||`CinePulse v${e.version}`)}
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
  `,document.body.appendChild(n),Z(n);const a=n.querySelector("#btn-update-later");a&&a.addEventListener("click",()=>{n.remove()});const o=u=>{if(X("APK indirmesi başlatılıyor...","info"),gn()){if(window.CinePulseNative?.downloadApk)try{window.CinePulseNative.downloadApk(u),X("İndirme bildirimi açıldı. İndirme bitince bildirime dokunup Android kurulum ekranını aç.","success"),n.remove();return}catch{}try{window.open(u,"_system")||(window.location.href=u)}catch{window.location.href=u}}else window.location.assign(u);setTimeout(()=>{try{n.remove()}catch{}},2e3)},s=n.querySelector("#btn-update-download");s&&s.addEventListener("click",u=>{u.preventDefault(),o(t)});const c=n.querySelector("#btn-update-github");c&&c.addEventListener("click",u=>{gn()&&(u.preventDefault(),o(i))})}function uo(e=""){return String(e).replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t])}async function Il({manual:e=!1}={}){return Vi||(!e&&Date.now()-ci<Rl?null:(Vi=vu({manual:e}).finally(()=>{Vi=null}),Vi))}async function vu({manual:e}){try{const t=await fetch(`${mu}?_t=${Date.now()}`,{signal:AbortSignal.timeout(6e3),cache:"no-store"});if(!t.ok)throw new Error(`HTTP ${t.status}`);const i=await t.json();if(!i?.version)throw new Error("Sürüm bilgisi eksik");if(ci=Date.now(),i&&gu(i.version,lo))return yu(i),i;if(e)return X(`✓ CinePulse güncel (v${lo})`,"success"),null}catch{return e&&X("Güncelleme sunucusuna erişilemedi.","error"),null}}function bu(){if(typeof window>"u"||co)return;co=!0;let e=null,t=0;const i=[0,5e3,15e3,3e4],n=async()=>{if(ci&&Date.now()-ci<Rl)return;const r=ci;await Il({manual:!1}),!ci||ci===r?t<i.length&&(e=window.setTimeout(n,i[t++])):t=i.length};e=window.setTimeout(n,2500);try{za.addListener("appStateChange",({isActive:r})=>{r&&(e&&window.clearTimeout(e),t=0,e=window.setTimeout(n,1200))})}catch{}document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&(e&&window.clearTimeout(e),t=0,e=window.setTimeout(n,1200))})}let Hn=null;function wu(){jt();const e=document.createElement("div");e.id="profile-modal-root",e.className="profile-backdrop",document.body.appendChild(e),Hn=e;let t=!1;const i=(r="select")=>{const a=Dt(),o=wn();r==="select"?e.innerHTML=`
        <div class="profile-dialog netflix-profile-dialog">
          <button class="profile-close-btn" id="btn-close-profile-modal" title="Kapat">
            <i data-lucide="x" style="width: 22px; height: 22px;"></i>
          </button>

          <div class="profile-brand-header">
            <div class="brand-logo-icon">
              <i data-lucide="clapperboard" style="width: 20px; height: 20px; color: #fff;"></i>
            </div>
            <span class="brand-name">Cine<span class="brand-highlight">Pulse</span></span>
          </div>

          <div class="profile-top-title">
            <h2 class="profile-main-heading">Kim İzliyor?</h2>
          </div>

          <!-- Profiles Grid -->
          <div class="profile-cards-grid netflix-cards-grid">
            ${a.map(p=>{const k=p.id===o.id,T=p.id!=="prof_1",C=p.color||(p.isKid?"#e5a00d":"#0071eb");return`
                <div class="profile-card-wrapper">
                  <div class="profile-card netflix-card ${k?"is-active":""} ${t?"is-managing-mode":""}" data-profile-id="${p.id}">
                    <div class="profile-avatar-wrap netflix-avatar-square ${p.isKid?"is-kid-square":""}" style="background: ${C};">
                      <i data-lucide="${p.isKid?"smile":p.avatar||"smile"}" class="netflix-smile-icon"></i>
                      ${p.isKid?'<div class="netflix-kids-bottom-banner">ÇOCUK</div>':""}
                      
                      ${k&&!t?`
                        <div class="profile-active-check" title="Aktif Profil">
                          <i data-lucide="check" style="width: 14px; height: 14px; stroke-width: 3;"></i>
                        </div>
                      `:""}

                      ${t?`
                        <div class="netflix-avatar-manage-overlay">
                          <i data-lucide="pencil" style="width: 28px; height: 28px; color: #fff;"></i>
                        </div>
                      `:""}
                    </div>
                    <span class="profile-name netflix-profile-name">${p.name}</span>
                  </div>

                  ${t&&T?`
                    <button class="btn-delete-profile netflix-delete-btn" data-delete-id="${p.id}" title="Profili Sil">
                      <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                    </button>
                  `:""}
                </div>
              `}).join("")}

            <!-- Add Profile Card -->
            <div class="profile-card-wrapper">
              <div class="profile-card netflix-card profile-card-add" id="btn-show-add-profile">
                <div class="profile-avatar-wrap netflix-avatar-square netflix-avatar-add">
                  <i data-lucide="plus-circle" style="width: 52px; height: 52px; color: #808080; stroke-width: 1.5;"></i>
                </div>
                <span class="profile-name netflix-profile-name">Profil Ekle</span>
              </div>
            </div>
          </div>

          <!-- Netflix Manage Profiles Button -->
          <div class="netflix-manage-action-bar">
            <button class="btn-netflix-manage ${t?"is-active-done":""}" id="btn-toggle-manage-profiles">
              ${t?"Tamamlandı":"Profilleri Yönet"}
            </button>
          </div>

          <!-- Bottom Management Bar -->
          <div class="profile-footer-bar netflix-footer-subbar">
            <button class="btn-manage-profiles" id="btn-modal-open-trakt" title="Trakt.tv Senkronizasyonu">
              <i data-lucide="tv" style="width: 14px; height: 14px; color: #ed1c24;"></i>
              <span>Trakt.tv</span>
            </button>
            <button class="btn-manage-profiles" id="btn-modal-open-backup" title="Yedekleme & Veri Yönetimi">
              <i data-lucide="hard-drive-download" style="width: 14px; height: 14px; color: #38bdf8;"></i>
              <span>Veri & Yedek</span>
            </button>
            ${gn()?`
              <button class="btn-manage-profiles" id="btn-modal-check-update" title="Güncellemeleri Denetle">
                <i data-lucide="refresh-cw" style="width: 14px; height: 14px; color: #10b981;"></i>
                <span>Güncelleme</span>
              </button>
            `:`
              <a class="btn-manage-profiles" id="btn-modal-apk-download" href="https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk" download="cinepulse.apk" target="_blank" rel="noopener noreferrer" title="Android APK İndir" style="text-decoration: none;">
                <i data-lucide="smartphone" style="width: 14px; height: 14px; color: #10b981;"></i>
                <span>Android APK</span>
              </a>
              <button class="btn-manage-profiles" id="btn-modal-pwa-install" title="CinePulse Web Uygulamasını Yükle">
                <i data-lucide="download" style="width: 14px; height: 14px; color: #f59e0b;"></i>
                <span>Web Uygulaması</span>
              </button>
            `}
          </div>
        </div>
      `:r==="add"&&(e.innerHTML=`
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
                ${["#f59e0b","#38bdf8","#ec4899","#10b981","#a855f7","#ef4444"].map((p,k)=>`
                  <button type="button" class="color-dot ${k===0?"active":""}" data-color="${p}" style="background: ${p};"></button>
                `).join("")}
              </div>
            </div>

            <div class="profile-form-actions">
              <button type="button" class="btn-secondary" id="btn-back-to-profiles">İptal</button>
              <button type="submit" class="btn-primary">Kaydet & Oluştur</button>
            </div>
          </form>
        </div>
      `),Z(e);const s=e.querySelector("#btn-close-profile-modal");s&&(s.onclick=()=>jt());const c=e.querySelector("#btn-show-add-profile");c&&(c.onclick=()=>i("add"));const u=e.querySelector("#btn-toggle-manage-profiles");u&&(u.onclick=()=>{t=!t,i("select")}),e.querySelectorAll(".btn-delete-profile").forEach(p=>{p.onclick=k=>{k.stopPropagation();const T=p.getAttribute("data-delete-id"),C=Dt().find($=>$.id===T);if(!C||!confirm(`"${C.name}" profilini silmek istediğinize emin misiniz?`))return;rd(T)?(X(`"${C.name}" profili silindi.`,"info"),i("select")):X("Bu profil silinemez.","error")}});const f=e.querySelector("#btn-modal-open-trakt");f&&(f.onclick=()=>{jt(),cr()});const h=e.querySelector("#btn-modal-open-backup");h&&(h.onclick=()=>{jt(),$l()});const m=e.querySelector("#btn-modal-pwa-install");m&&(m.onclick=()=>{eu()});const y=e.querySelector("#btn-modal-check-update");y&&(y.onclick=()=>{Il({manual:!0})}),e.querySelectorAll(".profile-card[data-profile-id]").forEach(p=>{p.onclick=()=>{const k=p.getAttribute("data-profile-id");if(!k)return;if(t){const C=Dt().find($=>$.id===k);if(!C)return;const S=prompt(`"${C.name}" profilinin yeni adını girin:`,C.name);S&&S.trim()&&S.trim()!==C.name&&(C.name=S.trim(),X("Profil güncellendi.","info"),i("select"));return}const T=Dt().find(C=>C.id===k);Qn(k),jt(),po(T)}});const g=e.querySelector("#btn-cancel-add-profile");g&&(g.onclick=()=>i("select"));const w=e.querySelector("#btn-back-to-profiles");w&&(w.onclick=()=>i("select"));const _=e.querySelector("#form-add-profile");if(_){let p="#f59e0b";_.querySelectorAll(".color-dot").forEach(k=>{k.onclick=()=>{_.querySelectorAll(".color-dot").forEach(T=>T.classList.remove("active")),k.classList.add("active"),p=k.getAttribute("data-color")}}),_.onsubmit=k=>{k.preventDefault();const T=_.querySelector("#new-profile-name"),C=_.querySelector("#new-profile-kid-check"),S=T?T.value.trim():"",$=C?C.checked:!1;if(S){const L=nd({name:S,isKid:$,avatar:$?"smile":"user",color:p});Qn(L.id),jt(),po(L)}}}};i("select"),e.onclick=r=>{r.target===e&&jt()};const n=r=>{r.key==="Escape"&&(jt(),window.removeEventListener("keydown",n))};window.addEventListener("keydown",n)}function jt(){if(Hn){try{Hn.remove()}catch{}Hn=null}}function po(e){const t=document.getElementById("profile-switch-curtain");t&&t.remove();const i=document.createElement("div");i.id="profile-switch-curtain",i.className="profile-switch-curtain is-entering",i.innerHTML=`
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
  `,document.body.appendChild(i),Z(i),window.dispatchEvent(new CustomEvent("sineflix_profile_changed",{detail:{profile:e}})),setTimeout(()=>{i.classList.remove("is-entering"),i.classList.add("is-leaving"),setTimeout(()=>{i.remove()},450)},600)}async function ei(e){return(await us(()=>import("./PlayerModal-DttVbhFh.js"),__vite__mapDeps([0,1]),import.meta.url)).openPlayerModal(e)}let Ri=null,Oa=null;const Ji=e=>String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),fo=[{label:"🎲 Karışık / Farketmez",id:null},{label:"💥 Aksiyon",movie:28,tv:10759},{label:"🚀 Bilim Kurgu & Fantastik",movie:878,tv:10765},{label:"😂 Komedi",movie:35,tv:35},{label:"🩸 Korku & Gerilim",movie:27,tv:9648},{label:"🎭 Dram",movie:18,tv:18},{label:"🕵️ Suç & Gizem",movie:80,tv:9648},{label:"🎌 Animasyon & Anime",movie:16,tv:16},{label:"💖 Romantik",movie:10749,tv:10749},{label:"🌍 Belgesel",movie:99,tv:99}];function ho({type:e="all"}={}){_i();const t=document.createElement("div");t.id="random-picker-modal-root",t.className="random-picker-backdrop",document.body.appendChild(t),Ri=t;let i=e==="tv"?"tv":"all",n=0,r=7;t.innerHTML=`
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
            ${fo.map((y,g)=>`
              <button class="random-pill-btn ${g===0?"active":""}" data-genre-idx="${g}">${y.label}</button>
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
  `,Z(t);const a=t.querySelector("#btn-close-random-picker");a&&(a.onclick=()=>_i()),t.onclick=y=>{y.target===t&&_i()};const o=y=>{y.key==="Escape"&&_i()};window.addEventListener("keydown",o),Oa=()=>window.removeEventListener("keydown",o);const s=t.querySelectorAll("#random-type-pills .random-pill-btn");s.forEach(y=>{y.onclick=()=>{s.forEach(g=>g.classList.remove("active")),y.classList.add("active"),i=y.getAttribute("data-type")}});const c=t.querySelectorAll("#random-rating-pills .random-pill-btn");c.forEach(y=>{y.onclick=()=>{c.forEach(g=>g.classList.remove("active")),y.classList.add("active"),r=parseFloat(y.getAttribute("data-rating")||"0")}});const u=t.querySelectorAll("#random-genre-pills .random-pill-btn");u.forEach(y=>{y.onclick=()=>{u.forEach(g=>g.classList.remove("active")),y.classList.add("active"),n=parseInt(y.getAttribute("data-genre-idx"),10)}});const f=t.querySelector("#btn-spin-wheel"),h=t.querySelector("#random-spin-stage"),m=async()=>{f&&(f.disabled=!0,f.classList.add("is-spinning")),h.innerHTML=`
      <div class="random-roulette-box">
        <div class="roulette-glow-ring"></div>
        <div class="roulette-roller" id="roulette-roller">
          <div class="roulette-reel-text">Adaylar Karıştırılıyor... 🎲</div>
        </div>
      </div>
    `;let y=i;y==="all"&&(y=Math.random()>.5?"movie":"tv");let g=null;const w=fo[n];w&&(g=y==="movie"?w.movie:w.tv);const _=Math.floor(Math.random()*3)+1;let p;try{p=await xl({type:y,genreId:g,minRating:r,page:_,sortBy:"popularity.desc"})}catch{p=[]}if(Ri!==t)return;const k=(p||[]).filter(Q=>Q&&(Q.title||Q.name)&&(Q.poster_path||Q.backdrop_path));if(!k||k.length===0){h.innerHTML=`
        <div class="random-idle-placeholder">
          <i data-lucide="frown" style="width: 40px; height: 40px; color: #ef4444;"></i>
          <span>Bu kriterlere uygun yapım bulunamadı. Lütfen filtreleri gevşetip tekrar deneyin.</span>
        </div>
      `,Z(h),f&&(f.disabled=!1,f.classList.remove("is-spinning"));return}const T=h.querySelector("#roulette-roller"),C=8;for(let Q=0;Q<C;Q++){const ie=k[Math.floor(Math.random()*k.length)],ne=ie.title||ie.name||"Öneri Aranıyor";if(T&&(T.innerHTML=`<div class="roulette-reel-text animate-pulse">${Ji(ne)}</div>`),await new Promise(O=>setTimeout(O,120+Q*25)),Ri!==t)return}const S=k[Math.floor(Math.random()*k.length)],$=S.title||S.name||"Seçilen Yapım",L=S.original_title||S.original_name||$,P=Xe(S.poster_path,je.POSTER_MEDIUM),B=S.vote_average?Number(S.vote_average).toFixed(1):"—",z=(S.release_date||S.first_air_date||"").substring(0,4),Y=S.overview&&S.overview.trim().length>10?S.overview:"Harika bir izleme deneyimi sunan sürpriz bir öneri!",K=y==="movie"?"movie":"tv";h.innerHTML=`
      <div class="random-winner-card">
        <div class="winner-poster-wrap">
          <img src="${P}" alt="${Ji($)}" class="winner-poster" />
          <div class="winner-rating-pill">⭐ ${B}</div>
        </div>
        <div class="winner-details-wrap">
          <div class="winner-badge-row">
            <span class="winner-tag-type">${K==="movie"?"FİLM":"DİZİ"}</span>
            ${z?`<span class="winner-tag-year">${Ji(z)}</span>`:""}
            <span class="winner-tag-match">Popüler öneri</span>
          </div>
          <h3 class="winner-title">${Ji($)}</h3>
          <p class="winner-overview">${Ji(Y)}</p>
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
    `,Z(h);const N=h.querySelector("#btn-winner-play");N&&(N.onclick=()=>{_i(),ei({type:K,tmdbId:S.id,title:$,originalTitle:L,posterPath:S.poster_path,backdropPath:S.backdrop_path,season:1,episode:1})});const q=h.querySelector("#btn-winner-detail");q&&(q.onclick=()=>{_i(),window.location.hash=`#detail?type=${K}&id=${S.id}`});const j=h.querySelector("#btn-winner-retry");j&&(j.onclick=()=>{m()}),f&&(f.disabled=!1,f.classList.remove("is-spinning"),f.innerHTML='<i data-lucide="refresh-cw" style="width: 17px; height: 17px;"></i> <span>Başka Bir Tane Öner</span>',Z(f))};f&&(f.onclick=()=>m()),m()}function _i(){if(Oa?.(),Oa=null,Ri){try{Ri.remove()}catch{}Ri=null}}let Un=null;const la=[{id:"notif_1",title:"Yeni Bölüm Yayında! ⚔️",message:"Kuruluş Osman 6. Sezon 1. Bölüm Full HD olarak platforma eklendi.",time:"12 dk önce",isUnread:!0,type:"tv",tmdbId:"95557",badge:"YENİ BÖLÜM"},{id:"notif_2",title:"Özel Sinema Gösterimi 🍿",message:"Dune: Çöl Gezegeni Bölüm İki - 4K Ultra HD Türkçe Dublaj & Altyazılı yayında!",time:"2 saat önce",isUnread:!0,type:"movie",tmdbId:"693134",badge:"4K VİZYON"},{id:"notif_3",title:"Yeni Anime Bölümü ⚡",message:"Demon Slayer: Hashira Training Arc - Türkçe Altyazılı yeni bölüm izlenmeye hazır.",time:"Dün",isUnread:!1,type:"tv",tmdbId:"85937",badge:"ANİME"},{id:"notif_4",title:"Canlı TV Güncellemesi 📺",message:"Elektronik Program Rehberi (EPG), PiP Mini-Player ve HLS Kalite Menüsü aktif edildi.",time:"2 gün önce",isUnread:!1,type:"livetv",badge:"GÜNCELLEME"}];function Ml(){try{if(typeof window>"u"||!window.localStorage)return la;const e=localStorage.getItem("sineflix_notifications_v1");return e?JSON.parse(e):la}catch{return la}}function mo(e){try{if(typeof window>"u"||!window.localStorage)return;localStorage.setItem("sineflix_notifications_v1",JSON.stringify(e)),window.dispatchEvent(new CustomEvent("sineflix_notifications_updated"))}catch{}}function Pl(){return Ml().filter(t=>t.isUnread).length}function ku(){Rn();const e=document.createElement("div");e.id="notification-modal-root",e.className="notif-backdrop",document.body.appendChild(e),Un=e;const t=Ml();e.innerHTML=`
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
  `,Z(e);const i=e.querySelector("#btn-close-notif");i&&(i.onclick=()=>Rn()),e.onclick=r=>{r.target===e&&Rn()};const n=e.querySelector("#btn-mark-all-read");n&&(n.onclick=()=>{const r=t.map(a=>({...a,isUnread:!1}));mo(r),e.querySelectorAll(".notif-item.unread").forEach(a=>a.classList.remove("unread")),X("Tüm bildirimler okundu olarak işaretlendi","info"),go()}),e.querySelectorAll(".notif-item").forEach(r=>{r.onclick=()=>{const a=r.getAttribute("data-notif-id"),o=r.getAttribute("data-type"),s=r.getAttribute("data-tmdb-id"),c=t.map(u=>u.id===a?{...u,isUnread:!1}:u);mo(c),r.classList.remove("unread"),go(),Rn(),o==="livetv"?window.location.hash="#livetv":s&&(window.location.hash=`#detail?type=${o}&id=${s}`)}})}function Rn(){if(Un){try{Un.remove()}catch{}Un=null}}function go(){const e=document.getElementById("nav-notif-badge");if(!e)return;const t=Pl();t>0?(e.textContent=t,e.classList.remove("hidden")):e.classList.add("hidden")}function Bl(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function _u(e){if(e.__esModule)return e;var t=e.default;if(typeof t=="function"){var i=function n(){return this instanceof n?Reflect.construct(t,arguments,this.constructor):t.apply(this,arguments)};i.prototype=t.prototype}else i={};return Object.defineProperty(i,"__esModule",{value:!0}),Object.keys(e).forEach(function(n){var r=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(i,n,r.get?r:{enumerable:!0,get:function(){return e[n]}})}),i}var Na={exports:{}},ca,yo;function Su(){if(yo)return ca;yo=1;var e=1e3,t=e*60,i=t*60,n=i*24,r=n*7,a=n*365.25;ca=function(f,h){h=h||{};var m=typeof f;if(m==="string"&&f.length>0)return o(f);if(m==="number"&&isFinite(f))return h.long?c(f):s(f);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(f))};function o(f){if(f=String(f),!(f.length>100)){var h=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(f);if(h){var m=parseFloat(h[1]),y=(h[2]||"ms").toLowerCase();switch(y){case"years":case"year":case"yrs":case"yr":case"y":return m*a;case"weeks":case"week":case"w":return m*r;case"days":case"day":case"d":return m*n;case"hours":case"hour":case"hrs":case"hr":case"h":return m*i;case"minutes":case"minute":case"mins":case"min":case"m":return m*t;case"seconds":case"second":case"secs":case"sec":case"s":return m*e;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return m;default:return}}}}function s(f){var h=Math.abs(f);return h>=n?Math.round(f/n)+"d":h>=i?Math.round(f/i)+"h":h>=t?Math.round(f/t)+"m":h>=e?Math.round(f/e)+"s":f+"ms"}function c(f){var h=Math.abs(f);return h>=n?u(f,h,n,"day"):h>=i?u(f,h,i,"hour"):h>=t?u(f,h,t,"minute"):h>=e?u(f,h,e,"second"):f+" ms"}function u(f,h,m,y){var g=h>=m*1.5;return Math.round(f/m)+" "+y+(g?"s":"")}return ca}function xu(e){i.debug=i,i.default=i,i.coerce=c,i.disable=o,i.enable=r,i.enabled=s,i.humanize=Su(),i.destroy=u,Object.keys(e).forEach(f=>{i[f]=e[f]}),i.names=[],i.skips=[],i.formatters={};function t(f){let h=0;for(let m=0;m<f.length;m++)h=(h<<5)-h+f.charCodeAt(m),h|=0;return i.colors[Math.abs(h)%i.colors.length]}i.selectColor=t;function i(f){let h,m=null,y,g;function w(..._){if(!w.enabled)return;const p=w,k=Number(new Date),T=k-(h||k);p.diff=T,p.prev=h,p.curr=k,h=k,_[0]=i.coerce(_[0]),typeof _[0]!="string"&&_.unshift("%O");let C=0;_[0]=_[0].replace(/%([a-zA-Z%])/g,($,L)=>{if($==="%%")return"%";C++;const P=i.formatters[L];if(typeof P=="function"){const B=_[C];$=P.call(p,B),_.splice(C,1),C--}return $}),i.formatArgs.call(p,_),(p.log||i.log).apply(p,_)}return w.namespace=f,w.useColors=i.useColors(),w.color=i.selectColor(f),w.extend=n,w.destroy=i.destroy,Object.defineProperty(w,"enabled",{enumerable:!0,configurable:!1,get:()=>m!==null?m:(y!==i.namespaces&&(y=i.namespaces,g=i.enabled(f)),g),set:_=>{m=_}}),typeof i.init=="function"&&i.init(w),w}function n(f,h){const m=i(this.namespace+(typeof h>"u"?":":h)+f);return m.log=this.log,m}function r(f){i.save(f),i.namespaces=f,i.names=[],i.skips=[];const h=(typeof f=="string"?f:"").trim().replace(/\s+/g,",").split(",").filter(Boolean);for(const m of h)m[0]==="-"?i.skips.push(m.slice(1)):i.names.push(m)}function a(f,h){let m=0,y=0,g=-1,w=0;for(;m<f.length;)if(y<h.length&&(h[y]===f[m]||h[y]==="*"))h[y]==="*"?(g=y,w=m,y++):(m++,y++);else if(g!==-1)y=g+1,w++,m=w;else return!1;for(;y<h.length&&h[y]==="*";)y++;return y===h.length}function o(){const f=[...i.names,...i.skips.map(h=>"-"+h)].join(",");return i.enable(""),f}function s(f){for(const h of i.skips)if(a(f,h))return!1;for(const h of i.names)if(a(f,h))return!0;return!1}function c(f){return f instanceof Error?f.stack||f.message:f}function u(){}return i.enable(i.load()),i}var Eu=xu;(function(e,t){var i={};t.formatArgs=r,t.save=a,t.load=o,t.useColors=n,t.storage=s(),t.destroy=(()=>{let u=!1;return()=>{u||(u=!0)}})(),t.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"];function n(){if(typeof window<"u"&&window.process&&(window.process.type==="renderer"||window.process.__nwjs))return!0;if(typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;let u;return typeof document<"u"&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent&&(u=navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/))&&parseInt(u[1],10)>=31||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)}function r(u){if(u[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+u[0]+(this.useColors?"%c ":" ")+"+"+e.exports.humanize(this.diff),!this.useColors)return;const f="color: "+this.color;u.splice(1,0,f,"color: inherit");let h=0,m=0;u[0].replace(/%[a-zA-Z%]/g,y=>{y!=="%%"&&(h++,y==="%c"&&(m=h))}),u.splice(m,0,f)}t.log=console.debug||console.log||(()=>{});function a(u){try{u?t.storage.setItem("debug",u):t.storage.removeItem("debug")}catch{}}function o(){let u;try{u=t.storage.getItem("debug")||t.storage.getItem("DEBUG")}catch{}return!u&&typeof process<"u"&&"env"in process&&(u=i.DEBUG),u}function s(){try{return localStorage}catch{}}e.exports=Eu(t);const{formatters:c}=e.exports;c.j=function(u){try{return JSON.stringify(u)}catch(f){return"[UnexpectedJSONParseError]: "+f.message}}})(Na,Na.exports);var Mr=Na.exports,fs={exports:{}},Ii=typeof Reflect=="object"?Reflect:null,vo=Ii&&typeof Ii.apply=="function"?Ii.apply:function(t,i,n){return Function.prototype.apply.call(t,i,n)},jn;Ii&&typeof Ii.ownKeys=="function"?jn=Ii.ownKeys:Object.getOwnPropertySymbols?jn=function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:jn=function(t){return Object.getOwnPropertyNames(t)};var Dl=Number.isNaN||function(t){return t!==t};function xe(){xe.init.call(this)}fs.exports=xe;fs.exports.once=Lu;xe.EventEmitter=xe;xe.prototype._events=void 0;xe.prototype._eventsCount=0;xe.prototype._maxListeners=void 0;var bo=10;function Pr(e){if(typeof e!="function")throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e)}Object.defineProperty(xe,"defaultMaxListeners",{enumerable:!0,get:function(){return bo},set:function(e){if(typeof e!="number"||e<0||Dl(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");bo=e}});xe.init=function(){(this._events===void 0||this._events===Object.getPrototypeOf(this)._events)&&(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0};xe.prototype.setMaxListeners=function(t){if(typeof t!="number"||t<0||Dl(t))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+t+".");return this._maxListeners=t,this};function zl(e){return e._maxListeners===void 0?xe.defaultMaxListeners:e._maxListeners}xe.prototype.getMaxListeners=function(){return zl(this)};xe.prototype.emit=function(t){for(var i=[],n=1;n<arguments.length;n++)i.push(arguments[n]);var r=t==="error",a=this._events;if(a!==void 0)r=r&&a.error===void 0;else if(!r)return!1;if(r){var o;if(i.length>0&&(o=i[0]),o instanceof Error)throw o;var s=new Error("Unhandled error."+(o?" ("+o.message+")":""));throw s.context=o,s}var c=a[t];if(c===void 0)return!1;if(typeof c=="function")vo(c,this,i);else for(var u=c.length,f=Hl(c,u),n=0;n<u;++n)vo(f[n],this,i);return!0};function Ol(e,t,i,n){var r,a,o;if(Pr(i),a=e._events,a===void 0?(a=e._events=Object.create(null),e._eventsCount=0):(a.newListener!==void 0&&(e.emit("newListener",t,i.listener?i.listener:i),a=e._events),o=a[t]),o===void 0)o=a[t]=i,++e._eventsCount;else if(typeof o=="function"?o=a[t]=n?[i,o]:[o,i]:n?o.unshift(i):o.push(i),r=zl(e),r>0&&o.length>r&&!o.warned){o.warned=!0;var s=new Error("Possible EventEmitter memory leak detected. "+o.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");s.name="MaxListenersExceededWarning",s.emitter=e,s.type=t,s.count=o.length}return e}xe.prototype.addListener=function(t,i){return Ol(this,t,i,!1)};xe.prototype.on=xe.prototype.addListener;xe.prototype.prependListener=function(t,i){return Ol(this,t,i,!0)};function Tu(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length===0?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function Nl(e,t,i){var n={fired:!1,wrapFn:void 0,target:e,type:t,listener:i},r=Tu.bind(n);return r.listener=i,n.wrapFn=r,r}xe.prototype.once=function(t,i){return Pr(i),this.on(t,Nl(this,t,i)),this};xe.prototype.prependOnceListener=function(t,i){return Pr(i),this.prependListener(t,Nl(this,t,i)),this};xe.prototype.removeListener=function(t,i){var n,r,a,o,s;if(Pr(i),r=this._events,r===void 0)return this;if(n=r[t],n===void 0)return this;if(n===i||n.listener===i)--this._eventsCount===0?this._events=Object.create(null):(delete r[t],r.removeListener&&this.emit("removeListener",t,n.listener||i));else if(typeof n!="function"){for(a=-1,o=n.length-1;o>=0;o--)if(n[o]===i||n[o].listener===i){s=n[o].listener,a=o;break}if(a<0)return this;a===0?n.shift():Au(n,a),n.length===1&&(r[t]=n[0]),r.removeListener!==void 0&&this.emit("removeListener",t,s||i)}return this};xe.prototype.off=xe.prototype.removeListener;xe.prototype.removeAllListeners=function(t){var i,n,r;if(n=this._events,n===void 0)return this;if(n.removeListener===void 0)return arguments.length===0?(this._events=Object.create(null),this._eventsCount=0):n[t]!==void 0&&(--this._eventsCount===0?this._events=Object.create(null):delete n[t]),this;if(arguments.length===0){var a=Object.keys(n),o;for(r=0;r<a.length;++r)o=a[r],o!=="removeListener"&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if(i=n[t],typeof i=="function")this.removeListener(t,i);else if(i!==void 0)for(r=i.length-1;r>=0;r--)this.removeListener(t,i[r]);return this};function ql(e,t,i){var n=e._events;if(n===void 0)return[];var r=n[t];return r===void 0?[]:typeof r=="function"?i?[r.listener||r]:[r]:i?Cu(r):Hl(r,r.length)}xe.prototype.listeners=function(t){return ql(this,t,!0)};xe.prototype.rawListeners=function(t){return ql(this,t,!1)};xe.listenerCount=function(e,t){return typeof e.listenerCount=="function"?e.listenerCount(t):Fl.call(e,t)};xe.prototype.listenerCount=Fl;function Fl(e){var t=this._events;if(t!==void 0){var i=t[e];if(typeof i=="function")return 1;if(i!==void 0)return i.length}return 0}xe.prototype.eventNames=function(){return this._eventsCount>0?jn(this._events):[]};function Hl(e,t){for(var i=new Array(t),n=0;n<t;++n)i[n]=e[n];return i}function Au(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}function Cu(e){for(var t=new Array(e.length),i=0;i<t.length;++i)t[i]=e[i].listener||e[i];return t}function Lu(e,t){return new Promise(function(i,n){function r(o){e.removeListener(t,a),n(o)}function a(){typeof e.removeListener=="function"&&e.removeListener("error",r),i([].slice.call(arguments))}Ul(e,t,a,{once:!0}),t!=="error"&&$u(e,r,{once:!0})})}function $u(e,t,i){typeof e.on=="function"&&Ul(e,"error",t,i)}function Ul(e,t,i,n){if(typeof e.on=="function")n.once?e.once(t,i):e.on(t,i);else if(typeof e.addEventListener=="function")e.addEventListener(t,function r(a){n.once&&e.removeEventListener(t,r),i(a)});else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof e)}var Br=fs.exports,hs={exports:{}},Ru=jl;function jl(e,t){if(e&&t)return jl(e)(t);if(typeof e!="function")throw new TypeError("need wrapper function");return Object.keys(e).forEach(function(n){i[n]=e[n]}),i;function i(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];var a=e.apply(this,n),o=n[n.length-1];return typeof a=="function"&&a!==o&&Object.keys(o).forEach(function(s){a[s]=o[s]}),a}}var Kl=Ru;hs.exports=Kl(Kn);hs.exports.strict=Kl(Wl);Kn.proto=Kn(function(){Object.defineProperty(Function.prototype,"once",{value:function(){return Kn(this)},configurable:!0}),Object.defineProperty(Function.prototype,"onceStrict",{value:function(){return Wl(this)},configurable:!0})});function Kn(e){var t=function(){return t.called?t.value:(t.called=!0,t.value=e.apply(this,arguments))};return t.called=!1,t}function Wl(e){var t=function(){if(t.called)throw new Error(t.onceError);return t.called=!0,t.value=e.apply(this,arguments)},i=e.name||"Function wrapped with `once`";return t.onceError=i+" shouldn't be called more than once",t.called=!1,t}var Iu=hs.exports;let wo;var Dr=typeof queueMicrotask=="function"?queueMicrotask.bind(typeof window<"u"?window:globalThis):e=>(wo||(wo=Promise.resolve())).then(e).catch(t=>setTimeout(()=>{throw t},0));var Mu=Bu;const Pu=Dr;function Bu(e,t){let i,n,r,a=!0;Array.isArray(e)?(i=[],n=e.length):(r=Object.keys(e),i={},n=r.length);function o(c){function u(){t&&t(c,i),t=null}a?Pu(u):u()}function s(c,u,f){i[c]=f,(--n===0||u)&&o(u)}n?r?r.forEach(function(c){e[c](function(u,f){s(c,u,f)})}):e.forEach(function(c,u){c(function(f,h){s(u,f,h)})}):o(null),a=!1}var Du=function(){if(typeof globalThis>"u")return null;var t={RTCPeerConnection:globalThis.RTCPeerConnection||globalThis.mozRTCPeerConnection||globalThis.webkitRTCPeerConnection,RTCSessionDescription:globalThis.RTCSessionDescription||globalThis.mozRTCSessionDescription||globalThis.webkitRTCSessionDescription,RTCIceCandidate:globalThis.RTCIceCandidate||globalThis.mozRTCIceCandidate||globalThis.webkitRTCIceCandidate};return t.RTCPeerConnection?t:null},qa={exports:{}},Fa={exports:{}},vi={},zr={};zr.byteLength=Nu;zr.toByteArray=Fu;zr.fromByteArray=ju;var Lt=[],ut=[],zu=typeof Uint8Array<"u"?Uint8Array:Array,da="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(var Si=0,Ou=da.length;Si<Ou;++Si)Lt[Si]=da[Si],ut[da.charCodeAt(Si)]=Si;ut[45]=62;ut[95]=63;function Yl(e){var t=e.length;if(t%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var i=e.indexOf("=");i===-1&&(i=t);var n=i===t?0:4-i%4;return[i,n]}function Nu(e){var t=Yl(e),i=t[0],n=t[1];return(i+n)*3/4-n}function qu(e,t,i){return(t+i)*3/4-i}function Fu(e){var t,i=Yl(e),n=i[0],r=i[1],a=new zu(qu(e,n,r)),o=0,s=r>0?n-4:n,c;for(c=0;c<s;c+=4)t=ut[e.charCodeAt(c)]<<18|ut[e.charCodeAt(c+1)]<<12|ut[e.charCodeAt(c+2)]<<6|ut[e.charCodeAt(c+3)],a[o++]=t>>16&255,a[o++]=t>>8&255,a[o++]=t&255;return r===2&&(t=ut[e.charCodeAt(c)]<<2|ut[e.charCodeAt(c+1)]>>4,a[o++]=t&255),r===1&&(t=ut[e.charCodeAt(c)]<<10|ut[e.charCodeAt(c+1)]<<4|ut[e.charCodeAt(c+2)]>>2,a[o++]=t>>8&255,a[o++]=t&255),a}function Hu(e){return Lt[e>>18&63]+Lt[e>>12&63]+Lt[e>>6&63]+Lt[e&63]}function Uu(e,t,i){for(var n,r=[],a=t;a<i;a+=3)n=(e[a]<<16&16711680)+(e[a+1]<<8&65280)+(e[a+2]&255),r.push(Hu(n));return r.join("")}function ju(e){for(var t,i=e.length,n=i%3,r=[],a=16383,o=0,s=i-n;o<s;o+=a)r.push(Uu(e,o,o+a>s?s:o+a));return n===1?(t=e[i-1],r.push(Lt[t>>2]+Lt[t<<4&63]+"==")):n===2&&(t=(e[i-2]<<8)+e[i-1],r.push(Lt[t>>10]+Lt[t>>4&63]+Lt[t<<2&63]+"=")),r.join("")}var ms={};ms.read=function(e,t,i,n,r){var a,o,s=r*8-n-1,c=(1<<s)-1,u=c>>1,f=-7,h=i?r-1:0,m=i?-1:1,y=e[t+h];for(h+=m,a=y&(1<<-f)-1,y>>=-f,f+=s;f>0;a=a*256+e[t+h],h+=m,f-=8);for(o=a&(1<<-f)-1,a>>=-f,f+=n;f>0;o=o*256+e[t+h],h+=m,f-=8);if(a===0)a=1-u;else{if(a===c)return o?NaN:(y?-1:1)*(1/0);o=o+Math.pow(2,n),a=a-u}return(y?-1:1)*o*Math.pow(2,a-n)};ms.write=function(e,t,i,n,r,a){var o,s,c,u=a*8-r-1,f=(1<<u)-1,h=f>>1,m=r===23?Math.pow(2,-24)-Math.pow(2,-77):0,y=n?0:a-1,g=n?1:-1,w=t<0||t===0&&1/t<0?1:0;for(t=Math.abs(t),isNaN(t)||t===1/0?(s=isNaN(t)?1:0,o=f):(o=Math.floor(Math.log(t)/Math.LN2),t*(c=Math.pow(2,-o))<1&&(o--,c*=2),o+h>=1?t+=m/c:t+=m*Math.pow(2,1-h),t*c>=2&&(o++,c/=2),o+h>=f?(s=0,o=f):o+h>=1?(s=(t*c-1)*Math.pow(2,r),o=o+h):(s=t*Math.pow(2,h-1)*Math.pow(2,r),o=0));r>=8;e[i+y]=s&255,y+=g,s/=256,r-=8);for(o=o<<r|s,u+=r;u>0;e[i+y]=o&255,y+=g,o/=256,u-=8);e[i+y-g]|=w*128};(function(e){const t=zr,i=ms,n=typeof Symbol=="function"&&typeof Symbol.for=="function"?Symbol.for("nodejs.util.inspect.custom"):null;e.Buffer=s,e.SlowBuffer=k,e.INSPECT_MAX_BYTES=50;const r=2147483647;e.kMaxLength=r,s.TYPED_ARRAY_SUPPORT=a(),!s.TYPED_ARRAY_SUPPORT&&typeof console<"u";function a(){try{const v=new Uint8Array(1),l={foo:function(){return 42}};return Object.setPrototypeOf(l,Uint8Array.prototype),Object.setPrototypeOf(v,l),v.foo()===42}catch{return!1}}Object.defineProperty(s.prototype,"parent",{enumerable:!0,get:function(){if(s.isBuffer(this))return this.buffer}}),Object.defineProperty(s.prototype,"offset",{enumerable:!0,get:function(){if(s.isBuffer(this))return this.byteOffset}});function o(v){if(v>r)throw new RangeError('The value "'+v+'" is invalid for option "size"');const l=new Uint8Array(v);return Object.setPrototypeOf(l,s.prototype),l}function s(v,l,d){if(typeof v=="number"){if(typeof l=="string")throw new TypeError('The "string" argument must be of type string. Received type number');return h(v)}return c(v,l,d)}s.poolSize=8192;function c(v,l,d){if(typeof v=="string")return m(v,l);if(ArrayBuffer.isView(v))return g(v);if(v==null)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof v);if(Ee(v,ArrayBuffer)||v&&Ee(v.buffer,ArrayBuffer)||typeof SharedArrayBuffer<"u"&&(Ee(v,SharedArrayBuffer)||v&&Ee(v.buffer,SharedArrayBuffer)))return w(v,l,d);if(typeof v=="number")throw new TypeError('The "value" argument must not be of type number. Received type number');const b=v.valueOf&&v.valueOf();if(b!=null&&b!==v)return s.from(b,l,d);const R=_(v);if(R)return R;if(typeof Symbol<"u"&&Symbol.toPrimitive!=null&&typeof v[Symbol.toPrimitive]=="function")return s.from(v[Symbol.toPrimitive]("string"),l,d);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof v)}s.from=function(v,l,d){return c(v,l,d)},Object.setPrototypeOf(s.prototype,Uint8Array.prototype),Object.setPrototypeOf(s,Uint8Array);function u(v){if(typeof v!="number")throw new TypeError('"size" argument must be of type number');if(v<0)throw new RangeError('The value "'+v+'" is invalid for option "size"')}function f(v,l,d){return u(v),v<=0?o(v):l!==void 0?typeof d=="string"?o(v).fill(l,d):o(v).fill(l):o(v)}s.alloc=function(v,l,d){return f(v,l,d)};function h(v){return u(v),o(v<0?0:p(v)|0)}s.allocUnsafe=function(v){return h(v)},s.allocUnsafeSlow=function(v){return h(v)};function m(v,l){if((typeof l!="string"||l==="")&&(l="utf8"),!s.isEncoding(l))throw new TypeError("Unknown encoding: "+l);const d=T(v,l)|0;let b=o(d);const R=b.write(v,l);return R!==d&&(b=b.slice(0,R)),b}function y(v){const l=v.length<0?0:p(v.length)|0,d=o(l);for(let b=0;b<l;b+=1)d[b]=v[b]&255;return d}function g(v){if(Ee(v,Uint8Array)){const l=new Uint8Array(v);return w(l.buffer,l.byteOffset,l.byteLength)}return y(v)}function w(v,l,d){if(l<0||v.byteLength<l)throw new RangeError('"offset" is outside of buffer bounds');if(v.byteLength<l+(d||0))throw new RangeError('"length" is outside of buffer bounds');let b;return l===void 0&&d===void 0?b=new Uint8Array(v):d===void 0?b=new Uint8Array(v,l):b=new Uint8Array(v,l,d),Object.setPrototypeOf(b,s.prototype),b}function _(v){if(s.isBuffer(v)){const l=p(v.length)|0,d=o(l);return d.length===0||v.copy(d,0,0,l),d}if(v.length!==void 0)return typeof v.length!="number"||Qe(v.length)?o(0):y(v);if(v.type==="Buffer"&&Array.isArray(v.data))return y(v.data)}function p(v){if(v>=r)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+r.toString(16)+" bytes");return v|0}function k(v){return+v!=v&&(v=0),s.alloc(+v)}s.isBuffer=function(l){return l!=null&&l._isBuffer===!0&&l!==s.prototype},s.compare=function(l,d){if(Ee(l,Uint8Array)&&(l=s.from(l,l.offset,l.byteLength)),Ee(d,Uint8Array)&&(d=s.from(d,d.offset,d.byteLength)),!s.isBuffer(l)||!s.isBuffer(d))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(l===d)return 0;let b=l.length,R=d.length;for(let D=0,F=Math.min(b,R);D<F;++D)if(l[D]!==d[D]){b=l[D],R=d[D];break}return b<R?-1:R<b?1:0},s.isEncoding=function(l){switch(String(l).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},s.concat=function(l,d){if(!Array.isArray(l))throw new TypeError('"list" argument must be an Array of Buffers');if(l.length===0)return s.alloc(0);let b;if(d===void 0)for(d=0,b=0;b<l.length;++b)d+=l[b].length;const R=s.allocUnsafe(d);let D=0;for(b=0;b<l.length;++b){let F=l[b];if(Ee(F,Uint8Array))D+F.length>R.length?(s.isBuffer(F)||(F=s.from(F)),F.copy(R,D)):Uint8Array.prototype.set.call(R,F,D);else if(s.isBuffer(F))F.copy(R,D);else throw new TypeError('"list" argument must be an Array of Buffers');D+=F.length}return R};function T(v,l){if(s.isBuffer(v))return v.length;if(ArrayBuffer.isView(v)||Ee(v,ArrayBuffer))return v.byteLength;if(typeof v!="string")throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof v);const d=v.length,b=arguments.length>2&&arguments[2]===!0;if(!b&&d===0)return 0;let R=!1;for(;;)switch(l){case"ascii":case"latin1":case"binary":return d;case"utf8":case"utf-8":return le(v).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return d*2;case"hex":return d>>>1;case"base64":return nt(v).length;default:if(R)return b?-1:le(v).length;l=(""+l).toLowerCase(),R=!0}}s.byteLength=T;function C(v,l,d){let b=!1;if((l===void 0||l<0)&&(l=0),l>this.length||((d===void 0||d>this.length)&&(d=this.length),d<=0)||(d>>>=0,l>>>=0,d<=l))return"";for(v||(v="utf8");;)switch(v){case"hex":return O(this,l,d);case"utf8":case"utf-8":return q(this,l,d);case"ascii":return ie(this,l,d);case"latin1":case"binary":return ne(this,l,d);case"base64":return N(this,l,d);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return se(this,l,d);default:if(b)throw new TypeError("Unknown encoding: "+v);v=(v+"").toLowerCase(),b=!0}}s.prototype._isBuffer=!0;function S(v,l,d){const b=v[l];v[l]=v[d],v[d]=b}s.prototype.swap16=function(){const l=this.length;if(l%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let d=0;d<l;d+=2)S(this,d,d+1);return this},s.prototype.swap32=function(){const l=this.length;if(l%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let d=0;d<l;d+=4)S(this,d,d+3),S(this,d+1,d+2);return this},s.prototype.swap64=function(){const l=this.length;if(l%8!==0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let d=0;d<l;d+=8)S(this,d,d+7),S(this,d+1,d+6),S(this,d+2,d+5),S(this,d+3,d+4);return this},s.prototype.toString=function(){const l=this.length;return l===0?"":arguments.length===0?q(this,0,l):C.apply(this,arguments)},s.prototype.toLocaleString=s.prototype.toString,s.prototype.equals=function(l){if(!s.isBuffer(l))throw new TypeError("Argument must be a Buffer");return this===l?!0:s.compare(this,l)===0},s.prototype.inspect=function(){let l="";const d=e.INSPECT_MAX_BYTES;return l=this.toString("hex",0,d).replace(/(.{2})/g,"$1 ").trim(),this.length>d&&(l+=" ... "),"<Buffer "+l+">"},n&&(s.prototype[n]=s.prototype.inspect),s.prototype.compare=function(l,d,b,R,D){if(Ee(l,Uint8Array)&&(l=s.from(l,l.offset,l.byteLength)),!s.isBuffer(l))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof l);if(d===void 0&&(d=0),b===void 0&&(b=l?l.length:0),R===void 0&&(R=0),D===void 0&&(D=this.length),d<0||b>l.length||R<0||D>this.length)throw new RangeError("out of range index");if(R>=D&&d>=b)return 0;if(R>=D)return-1;if(d>=b)return 1;if(d>>>=0,b>>>=0,R>>>=0,D>>>=0,this===l)return 0;let F=D-R,ae=b-d;const ve=Math.min(F,ae),fe=this.slice(R,D),Te=l.slice(d,b);for(let _e=0;_e<ve;++_e)if(fe[_e]!==Te[_e]){F=fe[_e],ae=Te[_e];break}return F<ae?-1:ae<F?1:0};function $(v,l,d,b,R){if(v.length===0)return-1;if(typeof d=="string"?(b=d,d=0):d>2147483647?d=2147483647:d<-2147483648&&(d=-2147483648),d=+d,Qe(d)&&(d=R?0:v.length-1),d<0&&(d=v.length+d),d>=v.length){if(R)return-1;d=v.length-1}else if(d<0)if(R)d=0;else return-1;if(typeof l=="string"&&(l=s.from(l,b)),s.isBuffer(l))return l.length===0?-1:L(v,l,d,b,R);if(typeof l=="number")return l=l&255,typeof Uint8Array.prototype.indexOf=="function"?R?Uint8Array.prototype.indexOf.call(v,l,d):Uint8Array.prototype.lastIndexOf.call(v,l,d):L(v,[l],d,b,R);throw new TypeError("val must be string, number or Buffer")}function L(v,l,d,b,R){let D=1,F=v.length,ae=l.length;if(b!==void 0&&(b=String(b).toLowerCase(),b==="ucs2"||b==="ucs-2"||b==="utf16le"||b==="utf-16le")){if(v.length<2||l.length<2)return-1;D=2,F/=2,ae/=2,d/=2}function ve(Te,_e){return D===1?Te[_e]:Te.readUInt16BE(_e*D)}let fe;if(R){let Te=-1;for(fe=d;fe<F;fe++)if(ve(v,fe)===ve(l,Te===-1?0:fe-Te)){if(Te===-1&&(Te=fe),fe-Te+1===ae)return Te*D}else Te!==-1&&(fe-=fe-Te),Te=-1}else for(d+ae>F&&(d=F-ae),fe=d;fe>=0;fe--){let Te=!0;for(let _e=0;_e<ae;_e++)if(ve(v,fe+_e)!==ve(l,_e)){Te=!1;break}if(Te)return fe}return-1}s.prototype.includes=function(l,d,b){return this.indexOf(l,d,b)!==-1},s.prototype.indexOf=function(l,d,b){return $(this,l,d,b,!0)},s.prototype.lastIndexOf=function(l,d,b){return $(this,l,d,b,!1)};function P(v,l,d,b){d=Number(d)||0;const R=v.length-d;b?(b=Number(b),b>R&&(b=R)):b=R;const D=l.length;b>D/2&&(b=D/2);let F;for(F=0;F<b;++F){const ae=parseInt(l.substr(F*2,2),16);if(Qe(ae))return F;v[d+F]=ae}return F}function B(v,l,d,b){return Ge(le(l,v.length-d),v,d,b)}function z(v,l,d,b){return Ge(Ye(l),v,d,b)}function Y(v,l,d,b){return Ge(nt(l),v,d,b)}function K(v,l,d,b){return Ge(Oe(l,v.length-d),v,d,b)}s.prototype.write=function(l,d,b,R){if(d===void 0)R="utf8",b=this.length,d=0;else if(b===void 0&&typeof d=="string")R=d,b=this.length,d=0;else if(isFinite(d))d=d>>>0,isFinite(b)?(b=b>>>0,R===void 0&&(R="utf8")):(R=b,b=void 0);else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");const D=this.length-d;if((b===void 0||b>D)&&(b=D),l.length>0&&(b<0||d<0)||d>this.length)throw new RangeError("Attempt to write outside buffer bounds");R||(R="utf8");let F=!1;for(;;)switch(R){case"hex":return P(this,l,d,b);case"utf8":case"utf-8":return B(this,l,d,b);case"ascii":case"latin1":case"binary":return z(this,l,d,b);case"base64":return Y(this,l,d,b);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return K(this,l,d,b);default:if(F)throw new TypeError("Unknown encoding: "+R);R=(""+R).toLowerCase(),F=!0}},s.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function N(v,l,d){return l===0&&d===v.length?t.fromByteArray(v):t.fromByteArray(v.slice(l,d))}function q(v,l,d){d=Math.min(v.length,d);const b=[];let R=l;for(;R<d;){const D=v[R];let F=null,ae=D>239?4:D>223?3:D>191?2:1;if(R+ae<=d){let ve,fe,Te,_e;switch(ae){case 1:D<128&&(F=D);break;case 2:ve=v[R+1],(ve&192)===128&&(_e=(D&31)<<6|ve&63,_e>127&&(F=_e));break;case 3:ve=v[R+1],fe=v[R+2],(ve&192)===128&&(fe&192)===128&&(_e=(D&15)<<12|(ve&63)<<6|fe&63,_e>2047&&(_e<55296||_e>57343)&&(F=_e));break;case 4:ve=v[R+1],fe=v[R+2],Te=v[R+3],(ve&192)===128&&(fe&192)===128&&(Te&192)===128&&(_e=(D&15)<<18|(ve&63)<<12|(fe&63)<<6|Te&63,_e>65535&&_e<1114112&&(F=_e))}}F===null?(F=65533,ae=1):F>65535&&(F-=65536,b.push(F>>>10&1023|55296),F=56320|F&1023),b.push(F),R+=ae}return Q(b)}const j=4096;function Q(v){const l=v.length;if(l<=j)return String.fromCharCode.apply(String,v);let d="",b=0;for(;b<l;)d+=String.fromCharCode.apply(String,v.slice(b,b+=j));return d}function ie(v,l,d){let b="";d=Math.min(v.length,d);for(let R=l;R<d;++R)b+=String.fromCharCode(v[R]&127);return b}function ne(v,l,d){let b="";d=Math.min(v.length,d);for(let R=l;R<d;++R)b+=String.fromCharCode(v[R]);return b}function O(v,l,d){const b=v.length;(!l||l<0)&&(l=0),(!d||d<0||d>b)&&(d=b);let R="";for(let D=l;D<d;++D)R+=ct[v[D]];return R}function se(v,l,d){const b=v.slice(l,d);let R="";for(let D=0;D<b.length-1;D+=2)R+=String.fromCharCode(b[D]+b[D+1]*256);return R}s.prototype.slice=function(l,d){const b=this.length;l=~~l,d=d===void 0?b:~~d,l<0?(l+=b,l<0&&(l=0)):l>b&&(l=b),d<0?(d+=b,d<0&&(d=0)):d>b&&(d=b),d<l&&(d=l);const R=this.subarray(l,d);return Object.setPrototypeOf(R,s.prototype),R};function V(v,l,d){if(v%1!==0||v<0)throw new RangeError("offset is not uint");if(v+l>d)throw new RangeError("Trying to access beyond buffer length")}s.prototype.readUintLE=s.prototype.readUIntLE=function(l,d,b){l=l>>>0,d=d>>>0,b||V(l,d,this.length);let R=this[l],D=1,F=0;for(;++F<d&&(D*=256);)R+=this[l+F]*D;return R},s.prototype.readUintBE=s.prototype.readUIntBE=function(l,d,b){l=l>>>0,d=d>>>0,b||V(l,d,this.length);let R=this[l+--d],D=1;for(;d>0&&(D*=256);)R+=this[l+--d]*D;return R},s.prototype.readUint8=s.prototype.readUInt8=function(l,d){return l=l>>>0,d||V(l,1,this.length),this[l]},s.prototype.readUint16LE=s.prototype.readUInt16LE=function(l,d){return l=l>>>0,d||V(l,2,this.length),this[l]|this[l+1]<<8},s.prototype.readUint16BE=s.prototype.readUInt16BE=function(l,d){return l=l>>>0,d||V(l,2,this.length),this[l]<<8|this[l+1]},s.prototype.readUint32LE=s.prototype.readUInt32LE=function(l,d){return l=l>>>0,d||V(l,4,this.length),(this[l]|this[l+1]<<8|this[l+2]<<16)+this[l+3]*16777216},s.prototype.readUint32BE=s.prototype.readUInt32BE=function(l,d){return l=l>>>0,d||V(l,4,this.length),this[l]*16777216+(this[l+1]<<16|this[l+2]<<8|this[l+3])},s.prototype.readBigUInt64LE=Ce(function(l){l=l>>>0,U(l,"offset");const d=this[l],b=this[l+7];(d===void 0||b===void 0)&&ee(l,this.length-8);const R=d+this[++l]*2**8+this[++l]*2**16+this[++l]*2**24,D=this[++l]+this[++l]*2**8+this[++l]*2**16+b*2**24;return BigInt(R)+(BigInt(D)<<BigInt(32))}),s.prototype.readBigUInt64BE=Ce(function(l){l=l>>>0,U(l,"offset");const d=this[l],b=this[l+7];(d===void 0||b===void 0)&&ee(l,this.length-8);const R=d*2**24+this[++l]*2**16+this[++l]*2**8+this[++l],D=this[++l]*2**24+this[++l]*2**16+this[++l]*2**8+b;return(BigInt(R)<<BigInt(32))+BigInt(D)}),s.prototype.readIntLE=function(l,d,b){l=l>>>0,d=d>>>0,b||V(l,d,this.length);let R=this[l],D=1,F=0;for(;++F<d&&(D*=256);)R+=this[l+F]*D;return D*=128,R>=D&&(R-=Math.pow(2,8*d)),R},s.prototype.readIntBE=function(l,d,b){l=l>>>0,d=d>>>0,b||V(l,d,this.length);let R=d,D=1,F=this[l+--R];for(;R>0&&(D*=256);)F+=this[l+--R]*D;return D*=128,F>=D&&(F-=Math.pow(2,8*d)),F},s.prototype.readInt8=function(l,d){return l=l>>>0,d||V(l,1,this.length),this[l]&128?(255-this[l]+1)*-1:this[l]},s.prototype.readInt16LE=function(l,d){l=l>>>0,d||V(l,2,this.length);const b=this[l]|this[l+1]<<8;return b&32768?b|4294901760:b},s.prototype.readInt16BE=function(l,d){l=l>>>0,d||V(l,2,this.length);const b=this[l+1]|this[l]<<8;return b&32768?b|4294901760:b},s.prototype.readInt32LE=function(l,d){return l=l>>>0,d||V(l,4,this.length),this[l]|this[l+1]<<8|this[l+2]<<16|this[l+3]<<24},s.prototype.readInt32BE=function(l,d){return l=l>>>0,d||V(l,4,this.length),this[l]<<24|this[l+1]<<16|this[l+2]<<8|this[l+3]},s.prototype.readBigInt64LE=Ce(function(l){l=l>>>0,U(l,"offset");const d=this[l],b=this[l+7];(d===void 0||b===void 0)&&ee(l,this.length-8);const R=this[l+4]+this[l+5]*2**8+this[l+6]*2**16+(b<<24);return(BigInt(R)<<BigInt(32))+BigInt(d+this[++l]*2**8+this[++l]*2**16+this[++l]*2**24)}),s.prototype.readBigInt64BE=Ce(function(l){l=l>>>0,U(l,"offset");const d=this[l],b=this[l+7];(d===void 0||b===void 0)&&ee(l,this.length-8);const R=(d<<24)+this[++l]*2**16+this[++l]*2**8+this[++l];return(BigInt(R)<<BigInt(32))+BigInt(this[++l]*2**24+this[++l]*2**16+this[++l]*2**8+b)}),s.prototype.readFloatLE=function(l,d){return l=l>>>0,d||V(l,4,this.length),i.read(this,l,!0,23,4)},s.prototype.readFloatBE=function(l,d){return l=l>>>0,d||V(l,4,this.length),i.read(this,l,!1,23,4)},s.prototype.readDoubleLE=function(l,d){return l=l>>>0,d||V(l,8,this.length),i.read(this,l,!0,52,8)},s.prototype.readDoubleBE=function(l,d){return l=l>>>0,d||V(l,8,this.length),i.read(this,l,!1,52,8)};function W(v,l,d,b,R,D){if(!s.isBuffer(v))throw new TypeError('"buffer" argument must be a Buffer instance');if(l>R||l<D)throw new RangeError('"value" argument is out of bounds');if(d+b>v.length)throw new RangeError("Index out of range")}s.prototype.writeUintLE=s.prototype.writeUIntLE=function(l,d,b,R){if(l=+l,d=d>>>0,b=b>>>0,!R){const ae=Math.pow(2,8*b)-1;W(this,l,d,b,ae,0)}let D=1,F=0;for(this[d]=l&255;++F<b&&(D*=256);)this[d+F]=l/D&255;return d+b},s.prototype.writeUintBE=s.prototype.writeUIntBE=function(l,d,b,R){if(l=+l,d=d>>>0,b=b>>>0,!R){const ae=Math.pow(2,8*b)-1;W(this,l,d,b,ae,0)}let D=b-1,F=1;for(this[d+D]=l&255;--D>=0&&(F*=256);)this[d+D]=l/F&255;return d+b},s.prototype.writeUint8=s.prototype.writeUInt8=function(l,d,b){return l=+l,d=d>>>0,b||W(this,l,d,1,255,0),this[d]=l&255,d+1},s.prototype.writeUint16LE=s.prototype.writeUInt16LE=function(l,d,b){return l=+l,d=d>>>0,b||W(this,l,d,2,65535,0),this[d]=l&255,this[d+1]=l>>>8,d+2},s.prototype.writeUint16BE=s.prototype.writeUInt16BE=function(l,d,b){return l=+l,d=d>>>0,b||W(this,l,d,2,65535,0),this[d]=l>>>8,this[d+1]=l&255,d+2},s.prototype.writeUint32LE=s.prototype.writeUInt32LE=function(l,d,b){return l=+l,d=d>>>0,b||W(this,l,d,4,4294967295,0),this[d+3]=l>>>24,this[d+2]=l>>>16,this[d+1]=l>>>8,this[d]=l&255,d+4},s.prototype.writeUint32BE=s.prototype.writeUInt32BE=function(l,d,b){return l=+l,d=d>>>0,b||W(this,l,d,4,4294967295,0),this[d]=l>>>24,this[d+1]=l>>>16,this[d+2]=l>>>8,this[d+3]=l&255,d+4};function re(v,l,d,b,R){E(l,b,R,v,d,7);let D=Number(l&BigInt(4294967295));v[d++]=D,D=D>>8,v[d++]=D,D=D>>8,v[d++]=D,D=D>>8,v[d++]=D;let F=Number(l>>BigInt(32)&BigInt(4294967295));return v[d++]=F,F=F>>8,v[d++]=F,F=F>>8,v[d++]=F,F=F>>8,v[d++]=F,d}function ue(v,l,d,b,R){E(l,b,R,v,d,7);let D=Number(l&BigInt(4294967295));v[d+7]=D,D=D>>8,v[d+6]=D,D=D>>8,v[d+5]=D,D=D>>8,v[d+4]=D;let F=Number(l>>BigInt(32)&BigInt(4294967295));return v[d+3]=F,F=F>>8,v[d+2]=F,F=F>>8,v[d+1]=F,F=F>>8,v[d]=F,d+8}s.prototype.writeBigUInt64LE=Ce(function(l,d=0){return re(this,l,d,BigInt(0),BigInt("0xffffffffffffffff"))}),s.prototype.writeBigUInt64BE=Ce(function(l,d=0){return ue(this,l,d,BigInt(0),BigInt("0xffffffffffffffff"))}),s.prototype.writeIntLE=function(l,d,b,R){if(l=+l,d=d>>>0,!R){const ve=Math.pow(2,8*b-1);W(this,l,d,b,ve-1,-ve)}let D=0,F=1,ae=0;for(this[d]=l&255;++D<b&&(F*=256);)l<0&&ae===0&&this[d+D-1]!==0&&(ae=1),this[d+D]=(l/F>>0)-ae&255;return d+b},s.prototype.writeIntBE=function(l,d,b,R){if(l=+l,d=d>>>0,!R){const ve=Math.pow(2,8*b-1);W(this,l,d,b,ve-1,-ve)}let D=b-1,F=1,ae=0;for(this[d+D]=l&255;--D>=0&&(F*=256);)l<0&&ae===0&&this[d+D+1]!==0&&(ae=1),this[d+D]=(l/F>>0)-ae&255;return d+b},s.prototype.writeInt8=function(l,d,b){return l=+l,d=d>>>0,b||W(this,l,d,1,127,-128),l<0&&(l=255+l+1),this[d]=l&255,d+1},s.prototype.writeInt16LE=function(l,d,b){return l=+l,d=d>>>0,b||W(this,l,d,2,32767,-32768),this[d]=l&255,this[d+1]=l>>>8,d+2},s.prototype.writeInt16BE=function(l,d,b){return l=+l,d=d>>>0,b||W(this,l,d,2,32767,-32768),this[d]=l>>>8,this[d+1]=l&255,d+2},s.prototype.writeInt32LE=function(l,d,b){return l=+l,d=d>>>0,b||W(this,l,d,4,2147483647,-2147483648),this[d]=l&255,this[d+1]=l>>>8,this[d+2]=l>>>16,this[d+3]=l>>>24,d+4},s.prototype.writeInt32BE=function(l,d,b){return l=+l,d=d>>>0,b||W(this,l,d,4,2147483647,-2147483648),l<0&&(l=4294967295+l+1),this[d]=l>>>24,this[d+1]=l>>>16,this[d+2]=l>>>8,this[d+3]=l&255,d+4},s.prototype.writeBigInt64LE=Ce(function(l,d=0){return re(this,l,d,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),s.prototype.writeBigInt64BE=Ce(function(l,d=0){return ue(this,l,d,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))});function he(v,l,d,b,R,D){if(d+b>v.length)throw new RangeError("Index out of range");if(d<0)throw new RangeError("Index out of range")}function A(v,l,d,b,R){return l=+l,d=d>>>0,R||he(v,l,d,4),i.write(v,l,d,b,23,4),d+4}s.prototype.writeFloatLE=function(l,d,b){return A(this,l,d,!0,b)},s.prototype.writeFloatBE=function(l,d,b){return A(this,l,d,!1,b)};function M(v,l,d,b,R){return l=+l,d=d>>>0,R||he(v,l,d,8),i.write(v,l,d,b,52,8),d+8}s.prototype.writeDoubleLE=function(l,d,b){return M(this,l,d,!0,b)},s.prototype.writeDoubleBE=function(l,d,b){return M(this,l,d,!1,b)},s.prototype.copy=function(l,d,b,R){if(!s.isBuffer(l))throw new TypeError("argument should be a Buffer");if(b||(b=0),!R&&R!==0&&(R=this.length),d>=l.length&&(d=l.length),d||(d=0),R>0&&R<b&&(R=b),R===b||l.length===0||this.length===0)return 0;if(d<0)throw new RangeError("targetStart out of bounds");if(b<0||b>=this.length)throw new RangeError("Index out of range");if(R<0)throw new RangeError("sourceEnd out of bounds");R>this.length&&(R=this.length),l.length-d<R-b&&(R=l.length-d+b);const D=R-b;return this===l&&typeof Uint8Array.prototype.copyWithin=="function"?this.copyWithin(d,b,R):Uint8Array.prototype.set.call(l,this.subarray(b,R),d),D},s.prototype.fill=function(l,d,b,R){if(typeof l=="string"){if(typeof d=="string"?(R=d,d=0,b=this.length):typeof b=="string"&&(R=b,b=this.length),R!==void 0&&typeof R!="string")throw new TypeError("encoding must be a string");if(typeof R=="string"&&!s.isEncoding(R))throw new TypeError("Unknown encoding: "+R);if(l.length===1){const F=l.charCodeAt(0);(R==="utf8"&&F<128||R==="latin1")&&(l=F)}}else typeof l=="number"?l=l&255:typeof l=="boolean"&&(l=Number(l));if(d<0||this.length<d||this.length<b)throw new RangeError("Out of range index");if(b<=d)return this;d=d>>>0,b=b===void 0?this.length:b>>>0,l||(l=0);let D;if(typeof l=="number")for(D=d;D<b;++D)this[D]=l;else{const F=s.isBuffer(l)?l:s.from(l,R),ae=F.length;if(ae===0)throw new TypeError('The value "'+l+'" is invalid for argument "value"');for(D=0;D<b-d;++D)this[D+d]=F[D%ae]}return this};const I={};function H(v,l,d){I[v]=class extends d{constructor(){super(),Object.defineProperty(this,"message",{value:l.apply(this,arguments),writable:!0,configurable:!0}),this.name=`${this.name} [${v}]`,this.stack,delete this.name}get code(){return v}set code(R){Object.defineProperty(this,"code",{configurable:!0,enumerable:!0,value:R,writable:!0})}toString(){return`${this.name} [${v}]: ${this.message}`}}}H("ERR_BUFFER_OUT_OF_BOUNDS",function(v){return v?`${v} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"},RangeError),H("ERR_INVALID_ARG_TYPE",function(v,l){return`The "${v}" argument must be of type number. Received type ${typeof l}`},TypeError),H("ERR_OUT_OF_RANGE",function(v,l,d){let b=`The value of "${v}" is out of range.`,R=d;return Number.isInteger(d)&&Math.abs(d)>2**32?R=J(String(d)):typeof d=="bigint"&&(R=String(d),(d>BigInt(2)**BigInt(32)||d<-(BigInt(2)**BigInt(32)))&&(R=J(R)),R+="n"),b+=` It must be ${l}. Received ${R}`,b},RangeError);function J(v){let l="",d=v.length;const b=v[0]==="-"?1:0;for(;d>=b+4;d-=3)l=`_${v.slice(d-3,d)}${l}`;return`${v.slice(0,d)}${l}`}function x(v,l,d){U(l,"offset"),(v[l]===void 0||v[l+d]===void 0)&&ee(l,v.length-(d+1))}function E(v,l,d,b,R,D){if(v>d||v<l){const F=typeof l=="bigint"?"n":"";let ae;throw l===0||l===BigInt(0)?ae=`>= 0${F} and < 2${F} ** ${(D+1)*8}${F}`:ae=`>= -(2${F} ** ${(D+1)*8-1}${F}) and < 2 ** ${(D+1)*8-1}${F}`,new I.ERR_OUT_OF_RANGE("value",ae,v)}x(b,R,D)}function U(v,l){if(typeof v!="number")throw new I.ERR_INVALID_ARG_TYPE(l,"number",v)}function ee(v,l,d){throw Math.floor(v)!==v?(U(v,d),new I.ERR_OUT_OF_RANGE("offset","an integer",v)):l<0?new I.ERR_BUFFER_OUT_OF_BOUNDS:new I.ERR_OUT_OF_RANGE("offset",`>= 0 and <= ${l}`,v)}const ge=/[^+/0-9A-Za-z-_]/g;function oe(v){if(v=v.split("=")[0],v=v.trim().replace(ge,""),v.length<2)return"";for(;v.length%4!==0;)v=v+"=";return v}function le(v,l){l=l||1/0;let d;const b=v.length;let R=null;const D=[];for(let F=0;F<b;++F){if(d=v.charCodeAt(F),d>55295&&d<57344){if(!R){if(d>56319){(l-=3)>-1&&D.push(239,191,189);continue}else if(F+1===b){(l-=3)>-1&&D.push(239,191,189);continue}R=d;continue}if(d<56320){(l-=3)>-1&&D.push(239,191,189),R=d;continue}d=(R-55296<<10|d-56320)+65536}else R&&(l-=3)>-1&&D.push(239,191,189);if(R=null,d<128){if((l-=1)<0)break;D.push(d)}else if(d<2048){if((l-=2)<0)break;D.push(d>>6|192,d&63|128)}else if(d<65536){if((l-=3)<0)break;D.push(d>>12|224,d>>6&63|128,d&63|128)}else if(d<1114112){if((l-=4)<0)break;D.push(d>>18|240,d>>12&63|128,d>>6&63|128,d&63|128)}else throw new Error("Invalid code point")}return D}function Ye(v){const l=[];for(let d=0;d<v.length;++d)l.push(v.charCodeAt(d)&255);return l}function Oe(v,l){let d,b,R;const D=[];for(let F=0;F<v.length&&!((l-=2)<0);++F)d=v.charCodeAt(F),b=d>>8,R=d%256,D.push(R),D.push(b);return D}function nt(v){return t.toByteArray(oe(v))}function Ge(v,l,d,b){let R;for(R=0;R<b&&!(R+d>=l.length||R>=v.length);++R)l[R+d]=v[R];return R}function Ee(v,l){return v instanceof l||v!=null&&v.constructor!=null&&v.constructor.name!=null&&v.constructor.name===l.name}function Qe(v){return v!==v}const ct=function(){const v="0123456789abcdef",l=new Array(256);for(let d=0;d<16;++d){const b=d*16;for(let R=0;R<16;++R)l[b+R]=v[d]+v[R]}return l}();function Ce(v){return typeof BigInt>"u"?qe:v}function qe(){throw new Error("BigInt not supported")}})(vi);(function(e,t){var i=vi,n=i.Buffer;function r(o,s){for(var c in o)s[c]=o[c]}n.from&&n.alloc&&n.allocUnsafe&&n.allocUnsafeSlow?e.exports=i:(r(i,t),t.Buffer=a);function a(o,s,c){return n(o,s,c)}a.prototype=Object.create(n.prototype),r(n,a),a.from=function(o,s,c){if(typeof o=="number")throw new TypeError("Argument must not be a number");return n(o,s,c)},a.alloc=function(o,s,c){if(typeof o!="number")throw new TypeError("Argument must be a number");var u=n(o);return s!==void 0?typeof c=="string"?u.fill(s,c):u.fill(s):u.fill(0),u},a.allocUnsafe=function(o){if(typeof o!="number")throw new TypeError("Argument must be a number");return n(o)},a.allocUnsafeSlow=function(o){if(typeof o!="number")throw new TypeError("Argument must be a number");return i.SlowBuffer(o)}})(Fa,Fa.exports);var Gl=Fa.exports,ua=65536,Ku=4294967295;function Wu(){throw new Error(`Secure random number generation is not supported by this browser.
Use Chrome, Firefox or Internet Explorer 11`)}var Yu=Gl.Buffer,ur=globalThis.crypto||globalThis.msCrypto;ur&&ur.getRandomValues?qa.exports=Gu:qa.exports=Wu;function Gu(e,t){if(e>Ku)throw new RangeError("requested too many random bytes");var i=Yu.allocUnsafe(e);if(e>0)if(e>ua)for(var n=0;n<e;n+=ua)ur.getRandomValues(i.slice(n,n+ua));else ur.getRandomValues(i);return typeof t=="function"?process.nextTick(function(){t(null,i)}):i}var gs=qa.exports,Ha={exports:{}},Vl=Br.EventEmitter;const Vu={},Ju=Object.freeze(Object.defineProperty({__proto__:null,default:Vu},Symbol.toStringTag,{value:"Module"})),bi=_u(Ju);var pa,ko;function Zu(){if(ko)return pa;ko=1;function e(g,w){var _=Object.keys(g);if(Object.getOwnPropertySymbols){var p=Object.getOwnPropertySymbols(g);w&&(p=p.filter(function(k){return Object.getOwnPropertyDescriptor(g,k).enumerable})),_.push.apply(_,p)}return _}function t(g){for(var w=1;w<arguments.length;w++){var _=arguments[w]!=null?arguments[w]:{};w%2?e(Object(_),!0).forEach(function(p){i(g,p,_[p])}):Object.getOwnPropertyDescriptors?Object.defineProperties(g,Object.getOwnPropertyDescriptors(_)):e(Object(_)).forEach(function(p){Object.defineProperty(g,p,Object.getOwnPropertyDescriptor(_,p))})}return g}function i(g,w,_){return w=o(w),w in g?Object.defineProperty(g,w,{value:_,enumerable:!0,configurable:!0,writable:!0}):g[w]=_,g}function n(g,w){if(!(g instanceof w))throw new TypeError("Cannot call a class as a function")}function r(g,w){for(var _=0;_<w.length;_++){var p=w[_];p.enumerable=p.enumerable||!1,p.configurable=!0,"value"in p&&(p.writable=!0),Object.defineProperty(g,o(p.key),p)}}function a(g,w,_){return w&&r(g.prototype,w),Object.defineProperty(g,"prototype",{writable:!1}),g}function o(g){var w=s(g,"string");return typeof w=="symbol"?w:String(w)}function s(g,w){if(typeof g!="object"||g===null)return g;var _=g[Symbol.toPrimitive];if(_!==void 0){var p=_.call(g,w);if(typeof p!="object")return p;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(g)}var c=vi,u=c.Buffer,f=bi,h=f.inspect,m=h&&h.custom||"inspect";function y(g,w,_){u.prototype.copy.call(g,w,_)}return pa=function(){function g(){n(this,g),this.head=null,this.tail=null,this.length=0}return a(g,[{key:"push",value:function(_){var p={data:_,next:null};this.length>0?this.tail.next=p:this.head=p,this.tail=p,++this.length}},{key:"unshift",value:function(_){var p={data:_,next:this.head};this.length===0&&(this.tail=p),this.head=p,++this.length}},{key:"shift",value:function(){if(this.length!==0){var _=this.head.data;return this.length===1?this.head=this.tail=null:this.head=this.head.next,--this.length,_}}},{key:"clear",value:function(){this.head=this.tail=null,this.length=0}},{key:"join",value:function(_){if(this.length===0)return"";for(var p=this.head,k=""+p.data;p=p.next;)k+=_+p.data;return k}},{key:"concat",value:function(_){if(this.length===0)return u.alloc(0);for(var p=u.allocUnsafe(_>>>0),k=this.head,T=0;k;)y(k.data,p,T),T+=k.data.length,k=k.next;return p}},{key:"consume",value:function(_,p){var k;return _<this.head.data.length?(k=this.head.data.slice(0,_),this.head.data=this.head.data.slice(_)):_===this.head.data.length?k=this.shift():k=p?this._getString(_):this._getBuffer(_),k}},{key:"first",value:function(){return this.head.data}},{key:"_getString",value:function(_){var p=this.head,k=1,T=p.data;for(_-=T.length;p=p.next;){var C=p.data,S=_>C.length?C.length:_;if(S===C.length?T+=C:T+=C.slice(0,_),_-=S,_===0){S===C.length?(++k,p.next?this.head=p.next:this.head=this.tail=null):(this.head=p,p.data=C.slice(S));break}++k}return this.length-=k,T}},{key:"_getBuffer",value:function(_){var p=u.allocUnsafe(_),k=this.head,T=1;for(k.data.copy(p),_-=k.data.length;k=k.next;){var C=k.data,S=_>C.length?C.length:_;if(C.copy(p,p.length-_,0,S),_-=S,_===0){S===C.length?(++T,k.next?this.head=k.next:this.head=this.tail=null):(this.head=k,k.data=C.slice(S));break}++T}return this.length-=T,p}},{key:m,value:function(_,p){return h(this,t(t({},p),{},{depth:0,customInspect:!1}))}}]),g}(),pa}function Xu(e,t){var i=this,n=this._readableState&&this._readableState.destroyed,r=this._writableState&&this._writableState.destroyed;return n||r?(t?t(e):e&&(this._writableState?this._writableState.errorEmitted||(this._writableState.errorEmitted=!0,process.nextTick(Ua,this,e)):process.nextTick(Ua,this,e)),this):(this._readableState&&(this._readableState.destroyed=!0),this._writableState&&(this._writableState.destroyed=!0),this._destroy(e||null,function(a){!t&&a?i._writableState?i._writableState.errorEmitted?process.nextTick(Wn,i):(i._writableState.errorEmitted=!0,process.nextTick(_o,i,a)):process.nextTick(_o,i,a):t?(process.nextTick(Wn,i),t(a)):process.nextTick(Wn,i)}),this)}function _o(e,t){Ua(e,t),Wn(e)}function Wn(e){e._writableState&&!e._writableState.emitClose||e._readableState&&!e._readableState.emitClose||e.emit("close")}function Qu(){this._readableState&&(this._readableState.destroyed=!1,this._readableState.reading=!1,this._readableState.ended=!1,this._readableState.endEmitted=!1),this._writableState&&(this._writableState.destroyed=!1,this._writableState.ended=!1,this._writableState.ending=!1,this._writableState.finalCalled=!1,this._writableState.prefinished=!1,this._writableState.finished=!1,this._writableState.errorEmitted=!1)}function Ua(e,t){e.emit("error",t)}function ep(e,t){var i=e._readableState,n=e._writableState;i&&i.autoDestroy||n&&n.autoDestroy?e.destroy(t):e.emit("error",t)}var Jl={destroy:Xu,undestroy:Qu,errorOrDestroy:ep},wi={};function tp(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}var Zl={};function yt(e,t,i){i||(i=Error);function n(a,o,s){return typeof t=="string"?t:t(a,o,s)}var r=function(a){tp(o,a);function o(s,c,u){return a.call(this,n(s,c,u))||this}return o}(i);r.prototype.name=i.name,r.prototype.code=e,Zl[e]=r}function So(e,t){if(Array.isArray(e)){var i=e.length;return e=e.map(function(n){return String(n)}),i>2?"one of ".concat(t," ").concat(e.slice(0,i-1).join(", "),", or ")+e[i-1]:i===2?"one of ".concat(t," ").concat(e[0]," or ").concat(e[1]):"of ".concat(t," ").concat(e[0])}else return"of ".concat(t," ").concat(String(e))}function ip(e,t,i){return e.substr(0,t.length)===t}function np(e,t,i){return(i===void 0||i>e.length)&&(i=e.length),e.substring(i-t.length,i)===t}function rp(e,t,i){return typeof i!="number"&&(i=0),i+t.length>e.length?!1:e.indexOf(t,i)!==-1}yt("ERR_INVALID_OPT_VALUE",function(e,t){return'The value "'+t+'" is invalid for option "'+e+'"'},TypeError);yt("ERR_INVALID_ARG_TYPE",function(e,t,i){var n;typeof t=="string"&&ip(t,"not ")?(n="must not be",t=t.replace(/^not /,"")):n="must be";var r;if(np(e," argument"))r="The ".concat(e," ").concat(n," ").concat(So(t,"type"));else{var a=rp(e,".")?"property":"argument";r='The "'.concat(e,'" ').concat(a," ").concat(n," ").concat(So(t,"type"))}return r+=". Received type ".concat(typeof i),r},TypeError);yt("ERR_STREAM_PUSH_AFTER_EOF","stream.push() after EOF");yt("ERR_METHOD_NOT_IMPLEMENTED",function(e){return"The "+e+" method is not implemented"});yt("ERR_STREAM_PREMATURE_CLOSE","Premature close");yt("ERR_STREAM_DESTROYED",function(e){return"Cannot call "+e+" after a stream was destroyed"});yt("ERR_MULTIPLE_CALLBACK","Callback called multiple times");yt("ERR_STREAM_CANNOT_PIPE","Cannot pipe, not readable");yt("ERR_STREAM_WRITE_AFTER_END","write after end");yt("ERR_STREAM_NULL_VALUES","May not write null values to stream",TypeError);yt("ERR_UNKNOWN_ENCODING",function(e){return"Unknown encoding: "+e},TypeError);yt("ERR_STREAM_UNSHIFT_AFTER_END_EVENT","stream.unshift() after end event");wi.codes=Zl;var ap=wi.codes.ERR_INVALID_OPT_VALUE;function sp(e,t,i){return e.highWaterMark!=null?e.highWaterMark:t?e[i]:null}function op(e,t,i,n){var r=sp(t,n,i);if(r!=null){if(!(isFinite(r)&&Math.floor(r)===r)||r<0){var a=n?i:"highWaterMark";throw new ap(a,r)}return Math.floor(r)}return e.objectMode?16:16*1024}var Xl={getHighWaterMark:op},ja={exports:{}};typeof Object.create=="function"?ja.exports=function(t,i){i&&(t.super_=i,t.prototype=Object.create(i.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}))}:ja.exports=function(t,i){if(i){t.super_=i;var n=function(){};n.prototype=i.prototype,t.prototype=new n,t.prototype.constructor=t}};var _n=ja.exports,lp=cp;function cp(e,t){if(fa("noDeprecation"))return e;var i=!1;function n(){if(!i){if(fa("throwDeprecation"))throw new Error(t);fa("traceDeprecation"),i=!0}return e.apply(this,arguments)}return n}function fa(e){try{if(!globalThis.localStorage)return!1}catch{return!1}var t=globalThis.localStorage[e];return t==null?!1:String(t).toLowerCase()==="true"}var ha,xo;function Ql(){if(xo)return ha;xo=1,ha=P;function e(A){var M=this;this.next=null,this.entry=null,this.finish=function(){he(M,A)}}var t;P.WritableState=$;var i={deprecate:lp},n=Vl,r=vi.Buffer,a=(typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof self<"u"?self:{}).Uint8Array||function(){};function o(A){return r.from(A)}function s(A){return r.isBuffer(A)||A instanceof a}var c=Jl,u=Xl,f=u.getHighWaterMark,h=wi.codes,m=h.ERR_INVALID_ARG_TYPE,y=h.ERR_METHOD_NOT_IMPLEMENTED,g=h.ERR_MULTIPLE_CALLBACK,w=h.ERR_STREAM_CANNOT_PIPE,_=h.ERR_STREAM_DESTROYED,p=h.ERR_STREAM_NULL_VALUES,k=h.ERR_STREAM_WRITE_AFTER_END,T=h.ERR_UNKNOWN_ENCODING,C=c.errorOrDestroy;_n(P,n);function S(){}function $(A,M,I){t=t||Ni(),A=A||{},typeof I!="boolean"&&(I=M instanceof t),this.objectMode=!!A.objectMode,I&&(this.objectMode=this.objectMode||!!A.writableObjectMode),this.highWaterMark=f(this,A,"writableHighWaterMark",I),this.finalCalled=!1,this.needDrain=!1,this.ending=!1,this.ended=!1,this.finished=!1,this.destroyed=!1;var H=A.decodeStrings===!1;this.decodeStrings=!H,this.defaultEncoding=A.defaultEncoding||"utf8",this.length=0,this.writing=!1,this.corked=0,this.sync=!0,this.bufferProcessing=!1,this.onwrite=function(J){Q(M,J)},this.writecb=null,this.writelen=0,this.bufferedRequest=null,this.lastBufferedRequest=null,this.pendingcb=0,this.prefinished=!1,this.errorEmitted=!1,this.emitClose=A.emitClose!==!1,this.autoDestroy=!!A.autoDestroy,this.bufferedRequestCount=0,this.corkedRequestsFree=new e(this)}$.prototype.getBuffer=function(){for(var M=this.bufferedRequest,I=[];M;)I.push(M),M=M.next;return I},function(){try{Object.defineProperty($.prototype,"buffer",{get:i.deprecate(function(){return this.getBuffer()},"_writableState.buffer is deprecated. Use _writableState.getBuffer instead.","DEP0003")})}catch{}}();var L;typeof Symbol=="function"&&Symbol.hasInstance&&typeof Function.prototype[Symbol.hasInstance]=="function"?(L=Function.prototype[Symbol.hasInstance],Object.defineProperty(P,Symbol.hasInstance,{value:function(M){return L.call(this,M)?!0:this!==P?!1:M&&M._writableState instanceof $}})):L=function(M){return M instanceof this};function P(A){t=t||Ni();var M=this instanceof t;if(!M&&!L.call(P,this))return new P(A);this._writableState=new $(A,this,M),this.writable=!0,A&&(typeof A.write=="function"&&(this._write=A.write),typeof A.writev=="function"&&(this._writev=A.writev),typeof A.destroy=="function"&&(this._destroy=A.destroy),typeof A.final=="function"&&(this._final=A.final)),n.call(this)}P.prototype.pipe=function(){C(this,new w)};function B(A,M){var I=new k;C(A,I),process.nextTick(M,I)}function z(A,M,I,H){var J;return I===null?J=new p:typeof I!="string"&&!M.objectMode&&(J=new m("chunk",["string","Buffer"],I)),J?(C(A,J),process.nextTick(H,J),!1):!0}P.prototype.write=function(A,M,I){var H=this._writableState,J=!1,x=!H.objectMode&&s(A);return x&&!r.isBuffer(A)&&(A=o(A)),typeof M=="function"&&(I=M,M=null),x?M="buffer":M||(M=H.defaultEncoding),typeof I!="function"&&(I=S),H.ending?B(this,I):(x||z(this,H,A,I))&&(H.pendingcb++,J=K(this,H,x,A,M,I)),J},P.prototype.cork=function(){this._writableState.corked++},P.prototype.uncork=function(){var A=this._writableState;A.corked&&(A.corked--,!A.writing&&!A.corked&&!A.bufferProcessing&&A.bufferedRequest&&O(this,A))},P.prototype.setDefaultEncoding=function(M){if(typeof M=="string"&&(M=M.toLowerCase()),!(["hex","utf8","utf-8","ascii","binary","base64","ucs2","ucs-2","utf16le","utf-16le","raw"].indexOf((M+"").toLowerCase())>-1))throw new T(M);return this._writableState.defaultEncoding=M,this},Object.defineProperty(P.prototype,"writableBuffer",{enumerable:!1,get:function(){return this._writableState&&this._writableState.getBuffer()}});function Y(A,M,I){return!A.objectMode&&A.decodeStrings!==!1&&typeof M=="string"&&(M=r.from(M,I)),M}Object.defineProperty(P.prototype,"writableHighWaterMark",{enumerable:!1,get:function(){return this._writableState.highWaterMark}});function K(A,M,I,H,J,x){if(!I){var E=Y(M,H,J);H!==E&&(I=!0,J="buffer",H=E)}var U=M.objectMode?1:H.length;M.length+=U;var ee=M.length<M.highWaterMark;if(ee||(M.needDrain=!0),M.writing||M.corked){var ge=M.lastBufferedRequest;M.lastBufferedRequest={chunk:H,encoding:J,isBuf:I,callback:x,next:null},ge?ge.next=M.lastBufferedRequest:M.bufferedRequest=M.lastBufferedRequest,M.bufferedRequestCount+=1}else N(A,M,!1,U,H,J,x);return ee}function N(A,M,I,H,J,x,E){M.writelen=H,M.writecb=E,M.writing=!0,M.sync=!0,M.destroyed?M.onwrite(new _("write")):I?A._writev(J,M.onwrite):A._write(J,x,M.onwrite),M.sync=!1}function q(A,M,I,H,J){--M.pendingcb,I?(process.nextTick(J,H),process.nextTick(re,A,M),A._writableState.errorEmitted=!0,C(A,H)):(J(H),A._writableState.errorEmitted=!0,C(A,H),re(A,M))}function j(A){A.writing=!1,A.writecb=null,A.length-=A.writelen,A.writelen=0}function Q(A,M){var I=A._writableState,H=I.sync,J=I.writecb;if(typeof J!="function")throw new g;if(j(I),M)q(A,I,H,M,J);else{var x=se(I)||A.destroyed;!x&&!I.corked&&!I.bufferProcessing&&I.bufferedRequest&&O(A,I),H?process.nextTick(ie,A,I,x,J):ie(A,I,x,J)}}function ie(A,M,I,H){I||ne(A,M),M.pendingcb--,H(),re(A,M)}function ne(A,M){M.length===0&&M.needDrain&&(M.needDrain=!1,A.emit("drain"))}function O(A,M){M.bufferProcessing=!0;var I=M.bufferedRequest;if(A._writev&&I&&I.next){var H=M.bufferedRequestCount,J=new Array(H),x=M.corkedRequestsFree;x.entry=I;for(var E=0,U=!0;I;)J[E]=I,I.isBuf||(U=!1),I=I.next,E+=1;J.allBuffers=U,N(A,M,!0,M.length,J,"",x.finish),M.pendingcb++,M.lastBufferedRequest=null,x.next?(M.corkedRequestsFree=x.next,x.next=null):M.corkedRequestsFree=new e(M),M.bufferedRequestCount=0}else{for(;I;){var ee=I.chunk,ge=I.encoding,oe=I.callback,le=M.objectMode?1:ee.length;if(N(A,M,!1,le,ee,ge,oe),I=I.next,M.bufferedRequestCount--,M.writing)break}I===null&&(M.lastBufferedRequest=null)}M.bufferedRequest=I,M.bufferProcessing=!1}P.prototype._write=function(A,M,I){I(new y("_write()"))},P.prototype._writev=null,P.prototype.end=function(A,M,I){var H=this._writableState;return typeof A=="function"?(I=A,A=null,M=null):typeof M=="function"&&(I=M,M=null),A!=null&&this.write(A,M),H.corked&&(H.corked=1,this.uncork()),H.ending||ue(this,H,I),this},Object.defineProperty(P.prototype,"writableLength",{enumerable:!1,get:function(){return this._writableState.length}});function se(A){return A.ending&&A.length===0&&A.bufferedRequest===null&&!A.finished&&!A.writing}function V(A,M){A._final(function(I){M.pendingcb--,I&&C(A,I),M.prefinished=!0,A.emit("prefinish"),re(A,M)})}function W(A,M){!M.prefinished&&!M.finalCalled&&(typeof A._final=="function"&&!M.destroyed?(M.pendingcb++,M.finalCalled=!0,process.nextTick(V,A,M)):(M.prefinished=!0,A.emit("prefinish")))}function re(A,M){var I=se(M);if(I&&(W(A,M),M.pendingcb===0&&(M.finished=!0,A.emit("finish"),M.autoDestroy))){var H=A._readableState;(!H||H.autoDestroy&&H.endEmitted)&&A.destroy()}return I}function ue(A,M,I){M.ending=!0,re(A,M),I&&(M.finished?process.nextTick(I):A.once("finish",I)),M.ended=!0,A.writable=!1}function he(A,M,I){var H=A.entry;for(A.entry=null;H;){var J=H.callback;M.pendingcb--,J(I),H=H.next}M.corkedRequestsFree.next=A}return Object.defineProperty(P.prototype,"destroyed",{enumerable:!1,get:function(){return this._writableState===void 0?!1:this._writableState.destroyed},set:function(M){this._writableState&&(this._writableState.destroyed=M)}}),P.prototype.destroy=c.destroy,P.prototype._undestroy=c.undestroy,P.prototype._destroy=function(A,M){M(A)},ha}var ma,Eo;function Ni(){if(Eo)return ma;Eo=1;var e=Object.keys||function(u){var f=[];for(var h in u)f.push(h);return f};ma=o;var t=tc(),i=Ql();_n(o,t);for(var n=e(i.prototype),r=0;r<n.length;r++){var a=n[r];o.prototype[a]||(o.prototype[a]=i.prototype[a])}function o(u){if(!(this instanceof o))return new o(u);t.call(this,u),i.call(this,u),this.allowHalfOpen=!0,u&&(u.readable===!1&&(this.readable=!1),u.writable===!1&&(this.writable=!1),u.allowHalfOpen===!1&&(this.allowHalfOpen=!1,this.once("end",s)))}Object.defineProperty(o.prototype,"writableHighWaterMark",{enumerable:!1,get:function(){return this._writableState.highWaterMark}}),Object.defineProperty(o.prototype,"writableBuffer",{enumerable:!1,get:function(){return this._writableState&&this._writableState.getBuffer()}}),Object.defineProperty(o.prototype,"writableLength",{enumerable:!1,get:function(){return this._writableState.length}});function s(){this._writableState.ended||process.nextTick(c,this)}function c(u){u.end()}return Object.defineProperty(o.prototype,"destroyed",{enumerable:!1,get:function(){return this._readableState===void 0||this._writableState===void 0?!1:this._readableState.destroyed&&this._writableState.destroyed},set:function(f){this._readableState===void 0||this._writableState===void 0||(this._readableState.destroyed=f,this._writableState.destroyed=f)}}),ma}var ga={},To;function Ao(){if(To)return ga;To=1;var e=Gl.Buffer,t=e.isEncoding||function(p){switch(p=""+p,p&&p.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return!0;default:return!1}};function i(p){if(!p)return"utf8";for(var k;;)switch(p){case"utf8":case"utf-8":return"utf8";case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return"utf16le";case"latin1":case"binary":return"latin1";case"base64":case"ascii":case"hex":return p;default:if(k)return;p=(""+p).toLowerCase(),k=!0}}function n(p){var k=i(p);if(typeof k!="string"&&(e.isEncoding===t||!t(p)))throw new Error("Unknown encoding: "+p);return k||p}ga.StringDecoder=r;function r(p){this.encoding=n(p);var k;switch(this.encoding){case"utf16le":this.text=h,this.end=m,k=4;break;case"utf8":this.fillLast=c,k=4;break;case"base64":this.text=y,this.end=g,k=3;break;default:this.write=w,this.end=_;return}this.lastNeed=0,this.lastTotal=0,this.lastChar=e.allocUnsafe(k)}r.prototype.write=function(p){if(p.length===0)return"";var k,T;if(this.lastNeed){if(k=this.fillLast(p),k===void 0)return"";T=this.lastNeed,this.lastNeed=0}else T=0;return T<p.length?k?k+this.text(p,T):this.text(p,T):k||""},r.prototype.end=f,r.prototype.text=u,r.prototype.fillLast=function(p){if(this.lastNeed<=p.length)return p.copy(this.lastChar,this.lastTotal-this.lastNeed,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal);p.copy(this.lastChar,this.lastTotal-this.lastNeed,0,p.length),this.lastNeed-=p.length};function a(p){return p<=127?0:p>>5===6?2:p>>4===14?3:p>>3===30?4:p>>6===2?-1:-2}function o(p,k,T){var C=k.length-1;if(C<T)return 0;var S=a(k[C]);return S>=0?(S>0&&(p.lastNeed=S-1),S):--C<T||S===-2?0:(S=a(k[C]),S>=0?(S>0&&(p.lastNeed=S-2),S):--C<T||S===-2?0:(S=a(k[C]),S>=0?(S>0&&(S===2?S=0:p.lastNeed=S-3),S):0))}function s(p,k,T){if((k[0]&192)!==128)return p.lastNeed=0,"�";if(p.lastNeed>1&&k.length>1){if((k[1]&192)!==128)return p.lastNeed=1,"�";if(p.lastNeed>2&&k.length>2&&(k[2]&192)!==128)return p.lastNeed=2,"�"}}function c(p){var k=this.lastTotal-this.lastNeed,T=s(this,p);if(T!==void 0)return T;if(this.lastNeed<=p.length)return p.copy(this.lastChar,k,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal);p.copy(this.lastChar,k,0,p.length),this.lastNeed-=p.length}function u(p,k){var T=o(this,p,k);if(!this.lastNeed)return p.toString("utf8",k);this.lastTotal=T;var C=p.length-(T-this.lastNeed);return p.copy(this.lastChar,0,C),p.toString("utf8",k,C)}function f(p){var k=p&&p.length?this.write(p):"";return this.lastNeed?k+"�":k}function h(p,k){if((p.length-k)%2===0){var T=p.toString("utf16le",k);if(T){var C=T.charCodeAt(T.length-1);if(C>=55296&&C<=56319)return this.lastNeed=2,this.lastTotal=4,this.lastChar[0]=p[p.length-2],this.lastChar[1]=p[p.length-1],T.slice(0,-1)}return T}return this.lastNeed=1,this.lastTotal=2,this.lastChar[0]=p[p.length-1],p.toString("utf16le",k,p.length-1)}function m(p){var k=p&&p.length?this.write(p):"";if(this.lastNeed){var T=this.lastTotal-this.lastNeed;return k+this.lastChar.toString("utf16le",0,T)}return k}function y(p,k){var T=(p.length-k)%3;return T===0?p.toString("base64",k):(this.lastNeed=3-T,this.lastTotal=3,T===1?this.lastChar[0]=p[p.length-1]:(this.lastChar[0]=p[p.length-2],this.lastChar[1]=p[p.length-1]),p.toString("base64",k,p.length-T))}function g(p){var k=p&&p.length?this.write(p):"";return this.lastNeed?k+this.lastChar.toString("base64",0,3-this.lastNeed):k}function w(p){return p.toString(this.encoding)}function _(p){return p&&p.length?this.write(p):""}return ga}var Co=wi.codes.ERR_STREAM_PREMATURE_CLOSE;function dp(e){var t=!1;return function(){if(!t){t=!0;for(var i=arguments.length,n=new Array(i),r=0;r<i;r++)n[r]=arguments[r];e.apply(this,n)}}}function up(){}function pp(e){return e.setHeader&&typeof e.abort=="function"}function ec(e,t,i){if(typeof t=="function")return ec(e,null,t);t||(t={}),i=dp(i||up);var n=t.readable||t.readable!==!1&&e.readable,r=t.writable||t.writable!==!1&&e.writable,a=function(){e.writable||s()},o=e._writableState&&e._writableState.finished,s=function(){r=!1,o=!0,n||i.call(e)},c=e._readableState&&e._readableState.endEmitted,u=function(){n=!1,c=!0,r||i.call(e)},f=function(g){i.call(e,g)},h=function(){var g;if(n&&!c)return(!e._readableState||!e._readableState.ended)&&(g=new Co),i.call(e,g);if(r&&!o)return(!e._writableState||!e._writableState.ended)&&(g=new Co),i.call(e,g)},m=function(){e.req.on("finish",s)};return pp(e)?(e.on("complete",s),e.on("abort",h),e.req?m():e.on("request",m)):r&&!e._writableState&&(e.on("end",a),e.on("close",a)),e.on("end",u),e.on("finish",s),t.error!==!1&&e.on("error",f),e.on("close",h),function(){e.removeListener("complete",s),e.removeListener("abort",h),e.removeListener("request",m),e.req&&e.req.removeListener("finish",s),e.removeListener("end",a),e.removeListener("close",a),e.removeListener("finish",s),e.removeListener("end",u),e.removeListener("error",f),e.removeListener("close",h)}}var ys=ec,ya,Lo;function fp(){if(Lo)return ya;Lo=1;var e;function t(T,C,S){return C=i(C),C in T?Object.defineProperty(T,C,{value:S,enumerable:!0,configurable:!0,writable:!0}):T[C]=S,T}function i(T){var C=n(T,"string");return typeof C=="symbol"?C:String(C)}function n(T,C){if(typeof T!="object"||T===null)return T;var S=T[Symbol.toPrimitive];if(S!==void 0){var $=S.call(T,C);if(typeof $!="object")return $;throw new TypeError("@@toPrimitive must return a primitive value.")}return(C==="string"?String:Number)(T)}var r=ys,a=Symbol("lastResolve"),o=Symbol("lastReject"),s=Symbol("error"),c=Symbol("ended"),u=Symbol("lastPromise"),f=Symbol("handlePromise"),h=Symbol("stream");function m(T,C){return{value:T,done:C}}function y(T){var C=T[a];if(C!==null){var S=T[h].read();S!==null&&(T[u]=null,T[a]=null,T[o]=null,C(m(S,!1)))}}function g(T){process.nextTick(y,T)}function w(T,C){return function(S,$){T.then(function(){if(C[c]){S(m(void 0,!0));return}C[f](S,$)},$)}}var _=Object.getPrototypeOf(function(){}),p=Object.setPrototypeOf((e={get stream(){return this[h]},next:function(){var C=this,S=this[s];if(S!==null)return Promise.reject(S);if(this[c])return Promise.resolve(m(void 0,!0));if(this[h].destroyed)return new Promise(function(B,z){process.nextTick(function(){C[s]?z(C[s]):B(m(void 0,!0))})});var $=this[u],L;if($)L=new Promise(w($,this));else{var P=this[h].read();if(P!==null)return Promise.resolve(m(P,!1));L=new Promise(this[f])}return this[u]=L,L}},t(e,Symbol.asyncIterator,function(){return this}),t(e,"return",function(){var C=this;return new Promise(function(S,$){C[h].destroy(null,function(L){if(L){$(L);return}S(m(void 0,!0))})})}),e),_),k=function(C){var S,$=Object.create(p,(S={},t(S,h,{value:C,writable:!0}),t(S,a,{value:null,writable:!0}),t(S,o,{value:null,writable:!0}),t(S,s,{value:null,writable:!0}),t(S,c,{value:C._readableState.endEmitted,writable:!0}),t(S,f,{value:function(P,B){var z=$[h].read();z?($[u]=null,$[a]=null,$[o]=null,P(m(z,!1))):($[a]=P,$[o]=B)},writable:!0}),S));return $[u]=null,r(C,function(L){if(L&&L.code!=="ERR_STREAM_PREMATURE_CLOSE"){var P=$[o];P!==null&&($[u]=null,$[a]=null,$[o]=null,P(L)),$[s]=L;return}var B=$[a];B!==null&&($[u]=null,$[a]=null,$[o]=null,B(m(void 0,!0))),$[c]=!0}),C.on("readable",g.bind(null,$)),$};return ya=k,ya}var va,$o;function hp(){return $o||($o=1,va=function(){throw new Error("Readable.from is not available in the browser")}),va}var ba,Ro;function tc(){if(Ro)return ba;Ro=1,ba=B;var e;B.ReadableState=P,Br.EventEmitter;var t=function(E,U){return E.listeners(U).length},i=Vl,n=vi.Buffer,r=(typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof self<"u"?self:{}).Uint8Array||function(){};function a(x){return n.from(x)}function o(x){return n.isBuffer(x)||x instanceof r}var s=bi,c;s&&s.debuglog?c=s.debuglog("stream"):c=function(){};var u=Zu(),f=Jl,h=Xl,m=h.getHighWaterMark,y=wi.codes,g=y.ERR_INVALID_ARG_TYPE,w=y.ERR_STREAM_PUSH_AFTER_EOF,_=y.ERR_METHOD_NOT_IMPLEMENTED,p=y.ERR_STREAM_UNSHIFT_AFTER_END_EVENT,k,T,C;_n(B,i);var S=f.errorOrDestroy,$=["error","close","destroy","pause","resume"];function L(x,E,U){if(typeof x.prependListener=="function")return x.prependListener(E,U);!x._events||!x._events[E]?x.on(E,U):Array.isArray(x._events[E])?x._events[E].unshift(U):x._events[E]=[U,x._events[E]]}function P(x,E,U){e=e||Ni(),x=x||{},typeof U!="boolean"&&(U=E instanceof e),this.objectMode=!!x.objectMode,U&&(this.objectMode=this.objectMode||!!x.readableObjectMode),this.highWaterMark=m(this,x,"readableHighWaterMark",U),this.buffer=new u,this.length=0,this.pipes=null,this.pipesCount=0,this.flowing=null,this.ended=!1,this.endEmitted=!1,this.reading=!1,this.sync=!0,this.needReadable=!1,this.emittedReadable=!1,this.readableListening=!1,this.resumeScheduled=!1,this.paused=!0,this.emitClose=x.emitClose!==!1,this.autoDestroy=!!x.autoDestroy,this.destroyed=!1,this.defaultEncoding=x.defaultEncoding||"utf8",this.awaitDrain=0,this.readingMore=!1,this.decoder=null,this.encoding=null,x.encoding&&(k||(k=Ao().StringDecoder),this.decoder=new k(x.encoding),this.encoding=x.encoding)}function B(x){if(e=e||Ni(),!(this instanceof B))return new B(x);var E=this instanceof e;this._readableState=new P(x,this,E),this.readable=!0,x&&(typeof x.read=="function"&&(this._read=x.read),typeof x.destroy=="function"&&(this._destroy=x.destroy)),i.call(this)}Object.defineProperty(B.prototype,"destroyed",{enumerable:!1,get:function(){return this._readableState===void 0?!1:this._readableState.destroyed},set:function(E){this._readableState&&(this._readableState.destroyed=E)}}),B.prototype.destroy=f.destroy,B.prototype._undestroy=f.undestroy,B.prototype._destroy=function(x,E){E(x)},B.prototype.push=function(x,E){var U=this._readableState,ee;return U.objectMode?ee=!0:typeof x=="string"&&(E=E||U.defaultEncoding,E!==U.encoding&&(x=n.from(x,E),E=""),ee=!0),z(this,x,E,!1,ee)},B.prototype.unshift=function(x){return z(this,x,null,!0,!1)};function z(x,E,U,ee,ge){c("readableAddChunk",E);var oe=x._readableState;if(E===null)oe.reading=!1,Q(x,oe);else{var le;if(ge||(le=K(oe,E)),le)S(x,le);else if(oe.objectMode||E&&E.length>0)if(typeof E!="string"&&!oe.objectMode&&Object.getPrototypeOf(E)!==n.prototype&&(E=a(E)),ee)oe.endEmitted?S(x,new p):Y(x,oe,E,!0);else if(oe.ended)S(x,new w);else{if(oe.destroyed)return!1;oe.reading=!1,oe.decoder&&!U?(E=oe.decoder.write(E),oe.objectMode||E.length!==0?Y(x,oe,E,!1):O(x,oe)):Y(x,oe,E,!1)}else ee||(oe.reading=!1,O(x,oe))}return!oe.ended&&(oe.length<oe.highWaterMark||oe.length===0)}function Y(x,E,U,ee){E.flowing&&E.length===0&&!E.sync?(E.awaitDrain=0,x.emit("data",U)):(E.length+=E.objectMode?1:U.length,ee?E.buffer.unshift(U):E.buffer.push(U),E.needReadable&&ie(x)),O(x,E)}function K(x,E){var U;return!o(E)&&typeof E!="string"&&E!==void 0&&!x.objectMode&&(U=new g("chunk",["string","Buffer","Uint8Array"],E)),U}B.prototype.isPaused=function(){return this._readableState.flowing===!1},B.prototype.setEncoding=function(x){k||(k=Ao().StringDecoder);var E=new k(x);this._readableState.decoder=E,this._readableState.encoding=this._readableState.decoder.encoding;for(var U=this._readableState.buffer.head,ee="";U!==null;)ee+=E.write(U.data),U=U.next;return this._readableState.buffer.clear(),ee!==""&&this._readableState.buffer.push(ee),this._readableState.length=ee.length,this};var N=1073741824;function q(x){return x>=N?x=N:(x--,x|=x>>>1,x|=x>>>2,x|=x>>>4,x|=x>>>8,x|=x>>>16,x++),x}function j(x,E){return x<=0||E.length===0&&E.ended?0:E.objectMode?1:x!==x?E.flowing&&E.length?E.buffer.head.data.length:E.length:(x>E.highWaterMark&&(E.highWaterMark=q(x)),x<=E.length?x:E.ended?E.length:(E.needReadable=!0,0))}B.prototype.read=function(x){c("read",x),x=parseInt(x,10);var E=this._readableState,U=x;if(x!==0&&(E.emittedReadable=!1),x===0&&E.needReadable&&((E.highWaterMark!==0?E.length>=E.highWaterMark:E.length>0)||E.ended))return c("read: emitReadable",E.length,E.ended),E.length===0&&E.ended?I(this):ie(this),null;if(x=j(x,E),x===0&&E.ended)return E.length===0&&I(this),null;var ee=E.needReadable;c("need readable",ee),(E.length===0||E.length-x<E.highWaterMark)&&(ee=!0,c("length less than watermark",ee)),E.ended||E.reading?(ee=!1,c("reading or ended",ee)):ee&&(c("do read"),E.reading=!0,E.sync=!0,E.length===0&&(E.needReadable=!0),this._read(E.highWaterMark),E.sync=!1,E.reading||(x=j(U,E)));var ge;return x>0?ge=M(x,E):ge=null,ge===null?(E.needReadable=E.length<=E.highWaterMark,x=0):(E.length-=x,E.awaitDrain=0),E.length===0&&(E.ended||(E.needReadable=!0),U!==x&&E.ended&&I(this)),ge!==null&&this.emit("data",ge),ge};function Q(x,E){if(c("onEofChunk"),!E.ended){if(E.decoder){var U=E.decoder.end();U&&U.length&&(E.buffer.push(U),E.length+=E.objectMode?1:U.length)}E.ended=!0,E.sync?ie(x):(E.needReadable=!1,E.emittedReadable||(E.emittedReadable=!0,ne(x)))}}function ie(x){var E=x._readableState;c("emitReadable",E.needReadable,E.emittedReadable),E.needReadable=!1,E.emittedReadable||(c("emitReadable",E.flowing),E.emittedReadable=!0,process.nextTick(ne,x))}function ne(x){var E=x._readableState;c("emitReadable_",E.destroyed,E.length,E.ended),!E.destroyed&&(E.length||E.ended)&&(x.emit("readable"),E.emittedReadable=!1),E.needReadable=!E.flowing&&!E.ended&&E.length<=E.highWaterMark,A(x)}function O(x,E){E.readingMore||(E.readingMore=!0,process.nextTick(se,x,E))}function se(x,E){for(;!E.reading&&!E.ended&&(E.length<E.highWaterMark||E.flowing&&E.length===0);){var U=E.length;if(c("maybeReadMore read 0"),x.read(0),U===E.length)break}E.readingMore=!1}B.prototype._read=function(x){S(this,new _("_read()"))},B.prototype.pipe=function(x,E){var U=this,ee=this._readableState;switch(ee.pipesCount){case 0:ee.pipes=x;break;case 1:ee.pipes=[ee.pipes,x];break;default:ee.pipes.push(x);break}ee.pipesCount+=1,c("pipe count=%d opts=%j",ee.pipesCount,E);var ge=(!E||E.end!==!1)&&x!==process.stdout&&x!==process.stderr,oe=ge?Ye:qe;ee.endEmitted?process.nextTick(oe):U.once("end",oe),x.on("unpipe",le);function le(v,l){c("onunpipe"),v===U&&l&&l.hasUnpiped===!1&&(l.hasUnpiped=!0,Ge())}function Ye(){c("onend"),x.end()}var Oe=V(U);x.on("drain",Oe);var nt=!1;function Ge(){c("cleanup"),x.removeListener("close",ct),x.removeListener("finish",Ce),x.removeListener("drain",Oe),x.removeListener("error",Qe),x.removeListener("unpipe",le),U.removeListener("end",Ye),U.removeListener("end",qe),U.removeListener("data",Ee),nt=!0,ee.awaitDrain&&(!x._writableState||x._writableState.needDrain)&&Oe()}U.on("data",Ee);function Ee(v){c("ondata");var l=x.write(v);c("dest.write",l),l===!1&&((ee.pipesCount===1&&ee.pipes===x||ee.pipesCount>1&&J(ee.pipes,x)!==-1)&&!nt&&(c("false write response, pause",ee.awaitDrain),ee.awaitDrain++),U.pause())}function Qe(v){c("onerror",v),qe(),x.removeListener("error",Qe),t(x,"error")===0&&S(x,v)}L(x,"error",Qe);function ct(){x.removeListener("finish",Ce),qe()}x.once("close",ct);function Ce(){c("onfinish"),x.removeListener("close",ct),qe()}x.once("finish",Ce);function qe(){c("unpipe"),U.unpipe(x)}return x.emit("pipe",U),ee.flowing||(c("pipe resume"),U.resume()),x};function V(x){return function(){var U=x._readableState;c("pipeOnDrain",U.awaitDrain),U.awaitDrain&&U.awaitDrain--,U.awaitDrain===0&&t(x,"data")&&(U.flowing=!0,A(x))}}B.prototype.unpipe=function(x){var E=this._readableState,U={hasUnpiped:!1};if(E.pipesCount===0)return this;if(E.pipesCount===1)return x&&x!==E.pipes?this:(x||(x=E.pipes),E.pipes=null,E.pipesCount=0,E.flowing=!1,x&&x.emit("unpipe",this,U),this);if(!x){var ee=E.pipes,ge=E.pipesCount;E.pipes=null,E.pipesCount=0,E.flowing=!1;for(var oe=0;oe<ge;oe++)ee[oe].emit("unpipe",this,{hasUnpiped:!1});return this}var le=J(E.pipes,x);return le===-1?this:(E.pipes.splice(le,1),E.pipesCount-=1,E.pipesCount===1&&(E.pipes=E.pipes[0]),x.emit("unpipe",this,U),this)},B.prototype.on=function(x,E){var U=i.prototype.on.call(this,x,E),ee=this._readableState;return x==="data"?(ee.readableListening=this.listenerCount("readable")>0,ee.flowing!==!1&&this.resume()):x==="readable"&&!ee.endEmitted&&!ee.readableListening&&(ee.readableListening=ee.needReadable=!0,ee.flowing=!1,ee.emittedReadable=!1,c("on readable",ee.length,ee.reading),ee.length?ie(this):ee.reading||process.nextTick(re,this)),U},B.prototype.addListener=B.prototype.on,B.prototype.removeListener=function(x,E){var U=i.prototype.removeListener.call(this,x,E);return x==="readable"&&process.nextTick(W,this),U},B.prototype.removeAllListeners=function(x){var E=i.prototype.removeAllListeners.apply(this,arguments);return(x==="readable"||x===void 0)&&process.nextTick(W,this),E};function W(x){var E=x._readableState;E.readableListening=x.listenerCount("readable")>0,E.resumeScheduled&&!E.paused?E.flowing=!0:x.listenerCount("data")>0&&x.resume()}function re(x){c("readable nexttick read 0"),x.read(0)}B.prototype.resume=function(){var x=this._readableState;return x.flowing||(c("resume"),x.flowing=!x.readableListening,ue(this,x)),x.paused=!1,this};function ue(x,E){E.resumeScheduled||(E.resumeScheduled=!0,process.nextTick(he,x,E))}function he(x,E){c("resume",E.reading),E.reading||x.read(0),E.resumeScheduled=!1,x.emit("resume"),A(x),E.flowing&&!E.reading&&x.read(0)}B.prototype.pause=function(){return c("call pause flowing=%j",this._readableState.flowing),this._readableState.flowing!==!1&&(c("pause"),this._readableState.flowing=!1,this.emit("pause")),this._readableState.paused=!0,this};function A(x){var E=x._readableState;for(c("flow",E.flowing);E.flowing&&x.read()!==null;);}B.prototype.wrap=function(x){var E=this,U=this._readableState,ee=!1;x.on("end",function(){if(c("wrapped end"),U.decoder&&!U.ended){var le=U.decoder.end();le&&le.length&&E.push(le)}E.push(null)}),x.on("data",function(le){if(c("wrapped data"),U.decoder&&(le=U.decoder.write(le)),!(U.objectMode&&le==null)&&!(!U.objectMode&&(!le||!le.length))){var Ye=E.push(le);Ye||(ee=!0,x.pause())}});for(var ge in x)this[ge]===void 0&&typeof x[ge]=="function"&&(this[ge]=function(Ye){return function(){return x[Ye].apply(x,arguments)}}(ge));for(var oe=0;oe<$.length;oe++)x.on($[oe],this.emit.bind(this,$[oe]));return this._read=function(le){c("wrapped _read",le),ee&&(ee=!1,x.resume())},this},typeof Symbol=="function"&&(B.prototype[Symbol.asyncIterator]=function(){return T===void 0&&(T=fp()),T(this)}),Object.defineProperty(B.prototype,"readableHighWaterMark",{enumerable:!1,get:function(){return this._readableState.highWaterMark}}),Object.defineProperty(B.prototype,"readableBuffer",{enumerable:!1,get:function(){return this._readableState&&this._readableState.buffer}}),Object.defineProperty(B.prototype,"readableFlowing",{enumerable:!1,get:function(){return this._readableState.flowing},set:function(E){this._readableState&&(this._readableState.flowing=E)}}),B._fromList=M,Object.defineProperty(B.prototype,"readableLength",{enumerable:!1,get:function(){return this._readableState.length}});function M(x,E){if(E.length===0)return null;var U;return E.objectMode?U=E.buffer.shift():!x||x>=E.length?(E.decoder?U=E.buffer.join(""):E.buffer.length===1?U=E.buffer.first():U=E.buffer.concat(E.length),E.buffer.clear()):U=E.buffer.consume(x,E.decoder),U}function I(x){var E=x._readableState;c("endReadable",E.endEmitted),E.endEmitted||(E.ended=!0,process.nextTick(H,E,x))}function H(x,E){if(c("endReadableNT",x.endEmitted,x.length),!x.endEmitted&&x.length===0&&(x.endEmitted=!0,E.readable=!1,E.emit("end"),x.autoDestroy)){var U=E._writableState;(!U||U.autoDestroy&&U.finished)&&E.destroy()}}typeof Symbol=="function"&&(B.from=function(x,E){return C===void 0&&(C=hp()),C(B,x,E)});function J(x,E){for(var U=0,ee=x.length;U<ee;U++)if(x[U]===E)return U;return-1}return ba}var ic=Nt,Or=wi.codes,mp=Or.ERR_METHOD_NOT_IMPLEMENTED,gp=Or.ERR_MULTIPLE_CALLBACK,yp=Or.ERR_TRANSFORM_ALREADY_TRANSFORMING,vp=Or.ERR_TRANSFORM_WITH_LENGTH_0,Nr=Ni();_n(Nt,Nr);function bp(e,t){var i=this._transformState;i.transforming=!1;var n=i.writecb;if(n===null)return this.emit("error",new gp);i.writechunk=null,i.writecb=null,t!=null&&this.push(t),n(e);var r=this._readableState;r.reading=!1,(r.needReadable||r.length<r.highWaterMark)&&this._read(r.highWaterMark)}function Nt(e){if(!(this instanceof Nt))return new Nt(e);Nr.call(this,e),this._transformState={afterTransform:bp.bind(this),needTransform:!1,transforming:!1,writecb:null,writechunk:null,writeencoding:null},this._readableState.needReadable=!0,this._readableState.sync=!1,e&&(typeof e.transform=="function"&&(this._transform=e.transform),typeof e.flush=="function"&&(this._flush=e.flush)),this.on("prefinish",wp)}function wp(){var e=this;typeof this._flush=="function"&&!this._readableState.destroyed?this._flush(function(t,i){Io(e,t,i)}):Io(this,null,null)}Nt.prototype.push=function(e,t){return this._transformState.needTransform=!1,Nr.prototype.push.call(this,e,t)};Nt.prototype._transform=function(e,t,i){i(new mp("_transform()"))};Nt.prototype._write=function(e,t,i){var n=this._transformState;if(n.writecb=i,n.writechunk=e,n.writeencoding=t,!n.transforming){var r=this._readableState;(n.needTransform||r.needReadable||r.length<r.highWaterMark)&&this._read(r.highWaterMark)}};Nt.prototype._read=function(e){var t=this._transformState;t.writechunk!==null&&!t.transforming?(t.transforming=!0,this._transform(t.writechunk,t.writeencoding,t.afterTransform)):t.needTransform=!0};Nt.prototype._destroy=function(e,t){Nr.prototype._destroy.call(this,e,function(i){t(i)})};function Io(e,t,i){if(t)return e.emit("error",t);if(i!=null&&e.push(i),e._writableState.length)throw new vp;if(e._transformState.transforming)throw new yp;return e.push(null)}var kp=yn,nc=ic;_n(yn,nc);function yn(e){if(!(this instanceof yn))return new yn(e);nc.call(this,e)}yn.prototype._transform=function(e,t,i){i(null,e)};var wa;function _p(e){var t=!1;return function(){t||(t=!0,e.apply(void 0,arguments))}}var rc=wi.codes,Sp=rc.ERR_MISSING_ARGS,xp=rc.ERR_STREAM_DESTROYED;function Mo(e){if(e)throw e}function Ep(e){return e.setHeader&&typeof e.abort=="function"}function Tp(e,t,i,n){n=_p(n);var r=!1;e.on("close",function(){r=!0}),wa===void 0&&(wa=ys),wa(e,{readable:t,writable:i},function(o){if(o)return n(o);r=!0,n()});var a=!1;return function(o){if(!r&&!a){if(a=!0,Ep(e))return e.abort();if(typeof e.destroy=="function")return e.destroy();n(o||new xp("pipe"))}}}function Po(e){e()}function Ap(e,t){return e.pipe(t)}function Cp(e){return!e.length||typeof e[e.length-1]!="function"?Mo:e.pop()}function Lp(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];var n=Cp(t);if(Array.isArray(t[0])&&(t=t[0]),t.length<2)throw new Sp("streams");var r,a=t.map(function(o,s){var c=s<t.length-1,u=s>0;return Tp(o,c,u,function(f){r||(r=f),f&&a.forEach(Po),!c&&(a.forEach(Po),n(r))})});return t.reduce(Ap)}var $p=Lp;(function(e,t){t=e.exports=tc(),t.Stream=t,t.Readable=t,t.Writable=Ql(),t.Duplex=Ni(),t.Transform=ic,t.PassThrough=kp,t.finished=ys,t.pipeline=$p})(Ha,Ha.exports);var ac=Ha.exports;function Bo(e,t){for(const i in t)Object.defineProperty(e,i,{value:t[i],enumerable:!0,configurable:!0});return e}function Rp(e,t,i){if(!e||typeof e=="string")throw new TypeError("Please pass an Error to err-code");i||(i={}),typeof t=="object"&&(i=t,t=""),t&&(i.code=t);try{return Bo(e,i)}catch{i.message=e.message,i.stack=e.stack;const r=function(){};return r.prototype=Object.create(Object.getPrototypeOf(e)),Bo(new r,i)}}var Ip=Rp;const Mp=Mr("simple-peer"),sc=Du,Do=gs,Pp=ac,ka=Dr,me=Ip,{Buffer:Bp}=vi,_a=64*1024,Dp=5*1e3,zp=5*1e3;function zo(e){return e.replace(/a=ice-options:trickle\s\n/g,"")}let qr=class Ka extends Pp.Duplex{constructor(t){if(t=Object.assign({allowHalfOpen:!1},t),super(t),this._id=Do(4).toString("hex").slice(0,7),this._debug("new peer %o",t),this.channelName=t.initiator?t.channelName||Do(20).toString("hex"):null,this.initiator=t.initiator||!1,this.channelConfig=t.channelConfig||Ka.channelConfig,this.channelNegotiated=this.channelConfig.negotiated,this.config=Object.assign({},Ka.config,t.config),this.offerOptions=t.offerOptions||{},this.answerOptions=t.answerOptions||{},this.sdpTransform=t.sdpTransform||(i=>i),this.streams=t.streams||(t.stream?[t.stream]:[]),this.trickle=t.trickle!==void 0?t.trickle:!0,this.allowHalfTrickle=t.allowHalfTrickle!==void 0?t.allowHalfTrickle:!1,this.iceCompleteTimeout=t.iceCompleteTimeout||Dp,this.destroyed=!1,this.destroying=!1,this._connected=!1,this.remoteAddress=void 0,this.remoteFamily=void 0,this.remotePort=void 0,this.localAddress=void 0,this.localFamily=void 0,this.localPort=void 0,this._wrtc=t.wrtc&&typeof t.wrtc=="object"?t.wrtc:sc(),!this._wrtc)throw me(typeof window>"u"?new Error("No WebRTC support: Specify `opts.wrtc` option in this environment"):new Error("No WebRTC support: Not a supported browser"),"ERR_WEBRTC_SUPPORT");this._pcReady=!1,this._channelReady=!1,this._iceComplete=!1,this._iceCompleteTimer=null,this._channel=null,this._pendingCandidates=[],this._isNegotiating=!1,this._firstNegotiation=!0,this._batchedNegotiation=!1,this._queuedNegotiation=!1,this._sendersAwaitingStable=[],this._senderMap=new Map,this._closingInterval=null,this._remoteTracks=[],this._remoteStreams=[],this._chunk=null,this._cb=null,this._interval=null;try{this._pc=new this._wrtc.RTCPeerConnection(this.config)}catch(i){this.destroy(me(i,"ERR_PC_CONSTRUCTOR"));return}this._isReactNativeWebrtc=typeof this._pc._peerConnectionId=="number",this._pc.oniceconnectionstatechange=()=>{this._onIceStateChange()},this._pc.onicegatheringstatechange=()=>{this._onIceStateChange()},this._pc.onconnectionstatechange=()=>{this._onConnectionStateChange()},this._pc.onsignalingstatechange=()=>{this._onSignalingStateChange()},this._pc.onicecandidate=i=>{this._onIceCandidate(i)},typeof this._pc.peerIdentity=="object"&&this._pc.peerIdentity.catch(i=>{this.destroy(me(i,"ERR_PC_PEER_IDENTITY"))}),this.initiator||this.channelNegotiated?this._setupData({channel:this._pc.createDataChannel(this.channelName,this.channelConfig)}):this._pc.ondatachannel=i=>{this._setupData(i)},this.streams&&this.streams.forEach(i=>{this.addStream(i)}),this._pc.ontrack=i=>{this._onTrack(i)},this._debug("initial negotiation"),this._needsNegotiation(),this._onFinishBound=()=>{this._onFinish()},this.once("finish",this._onFinishBound)}get bufferSize(){return this._channel&&this._channel.bufferedAmount||0}get connected(){return this._connected&&this._channel.readyState==="open"}address(){return{port:this.localPort,family:this.localFamily,address:this.localAddress}}signal(t){if(!this.destroying){if(this.destroyed)throw me(new Error("cannot signal after peer is destroyed"),"ERR_DESTROYED");if(typeof t=="string")try{t=JSON.parse(t)}catch{t={}}this._debug("signal()"),t.renegotiate&&this.initiator&&(this._debug("got request to renegotiate"),this._needsNegotiation()),t.transceiverRequest&&this.initiator&&(this._debug("got request for transceiver"),this.addTransceiver(t.transceiverRequest.kind,t.transceiverRequest.init)),t.candidate&&(this._pc.remoteDescription&&this._pc.remoteDescription.type?this._addIceCandidate(t.candidate):this._pendingCandidates.push(t.candidate)),t.sdp&&this._pc.setRemoteDescription(new this._wrtc.RTCSessionDescription(t)).then(()=>{this.destroyed||(this._pendingCandidates.forEach(i=>{this._addIceCandidate(i)}),this._pendingCandidates=[],this._pc.remoteDescription.type==="offer"&&this._createAnswer())}).catch(i=>{this.destroy(me(i,"ERR_SET_REMOTE_DESCRIPTION"))}),!t.sdp&&!t.candidate&&!t.renegotiate&&!t.transceiverRequest&&this.destroy(me(new Error("signal() called with invalid signal data"),"ERR_SIGNALING"))}}_addIceCandidate(t){const i=new this._wrtc.RTCIceCandidate(t);this._pc.addIceCandidate(i).catch(n=>{!i.address||i.address.endsWith(".local")?void 0:this.destroy(me(n,"ERR_ADD_ICE_CANDIDATE"))})}send(t){if(!this.destroying){if(this.destroyed)throw me(new Error("cannot send after peer is destroyed"),"ERR_DESTROYED");this._channel.send(t)}}addTransceiver(t,i){if(!this.destroying){if(this.destroyed)throw me(new Error("cannot addTransceiver after peer is destroyed"),"ERR_DESTROYED");if(this._debug("addTransceiver()"),this.initiator)try{this._pc.addTransceiver(t,i),this._needsNegotiation()}catch(n){this.destroy(me(n,"ERR_ADD_TRANSCEIVER"))}else this.emit("signal",{type:"transceiverRequest",transceiverRequest:{kind:t,init:i}})}}addStream(t){if(!this.destroying){if(this.destroyed)throw me(new Error("cannot addStream after peer is destroyed"),"ERR_DESTROYED");this._debug("addStream()"),t.getTracks().forEach(i=>{this.addTrack(i,t)})}}addTrack(t,i){if(this.destroying)return;if(this.destroyed)throw me(new Error("cannot addTrack after peer is destroyed"),"ERR_DESTROYED");this._debug("addTrack()");const n=this._senderMap.get(t)||new Map;let r=n.get(i);if(!r)r=this._pc.addTrack(t,i),n.set(i,r),this._senderMap.set(t,n),this._needsNegotiation();else throw r.removed?me(new Error("Track has been removed. You should enable/disable tracks that you want to re-add."),"ERR_SENDER_REMOVED"):me(new Error("Track has already been added to that stream."),"ERR_SENDER_ALREADY_ADDED")}replaceTrack(t,i,n){if(this.destroying)return;if(this.destroyed)throw me(new Error("cannot replaceTrack after peer is destroyed"),"ERR_DESTROYED");this._debug("replaceTrack()");const r=this._senderMap.get(t),a=r?r.get(n):null;if(!a)throw me(new Error("Cannot replace track that was never added."),"ERR_TRACK_NOT_ADDED");i&&this._senderMap.set(i,r),a.replaceTrack!=null?a.replaceTrack(i):this.destroy(me(new Error("replaceTrack is not supported in this browser"),"ERR_UNSUPPORTED_REPLACETRACK"))}removeTrack(t,i){if(this.destroying)return;if(this.destroyed)throw me(new Error("cannot removeTrack after peer is destroyed"),"ERR_DESTROYED");this._debug("removeSender()");const n=this._senderMap.get(t),r=n?n.get(i):null;if(!r)throw me(new Error("Cannot remove track that was never added."),"ERR_TRACK_NOT_ADDED");try{r.removed=!0,this._pc.removeTrack(r)}catch(a){a.name==="NS_ERROR_UNEXPECTED"?this._sendersAwaitingStable.push(r):this.destroy(me(a,"ERR_REMOVE_TRACK"))}this._needsNegotiation()}removeStream(t){if(!this.destroying){if(this.destroyed)throw me(new Error("cannot removeStream after peer is destroyed"),"ERR_DESTROYED");this._debug("removeSenders()"),t.getTracks().forEach(i=>{this.removeTrack(i,t)})}}_needsNegotiation(){this._debug("_needsNegotiation"),!this._batchedNegotiation&&(this._batchedNegotiation=!0,ka(()=>{this._batchedNegotiation=!1,this.initiator||!this._firstNegotiation?(this._debug("starting batched negotiation"),this.negotiate()):this._debug("non-initiator initial negotiation request discarded"),this._firstNegotiation=!1}))}negotiate(){if(!this.destroying){if(this.destroyed)throw me(new Error("cannot negotiate after peer is destroyed"),"ERR_DESTROYED");this.initiator?this._isNegotiating?(this._queuedNegotiation=!0,this._debug("already negotiating, queueing")):(this._debug("start negotiation"),setTimeout(()=>{this._createOffer()},0)):this._isNegotiating?(this._queuedNegotiation=!0,this._debug("already negotiating, queueing")):(this._debug("requesting negotiation from initiator"),this.emit("signal",{type:"renegotiate",renegotiate:!0})),this._isNegotiating=!0}}destroy(t){this._destroy(t,()=>{})}_destroy(t,i){this.destroyed||this.destroying||(this.destroying=!0,this._debug("destroying (error: %s)",t&&(t.message||t)),ka(()=>{if(this.destroyed=!0,this.destroying=!1,this._debug("destroy (error: %s)",t&&(t.message||t)),this.readable=this.writable=!1,this._readableState.ended||this.push(null),this._writableState.finished||this.end(),this._connected=!1,this._pcReady=!1,this._channelReady=!1,this._remoteTracks=null,this._remoteStreams=null,this._senderMap=null,clearInterval(this._closingInterval),this._closingInterval=null,clearInterval(this._interval),this._interval=null,this._chunk=null,this._cb=null,this._onFinishBound&&this.removeListener("finish",this._onFinishBound),this._onFinishBound=null,this._channel){try{this._channel.close()}catch{}this._channel.onmessage=null,this._channel.onopen=null,this._channel.onclose=null,this._channel.onerror=null}if(this._pc){try{this._pc.close()}catch{}this._pc.oniceconnectionstatechange=null,this._pc.onicegatheringstatechange=null,this._pc.onsignalingstatechange=null,this._pc.onicecandidate=null,this._pc.ontrack=null,this._pc.ondatachannel=null}this._pc=null,this._channel=null,t&&this.emit("error",t),this.emit("close"),i()}))}_setupData(t){if(!t.channel)return this.destroy(me(new Error("Data channel event is missing `channel` property"),"ERR_DATA_CHANNEL"));this._channel=t.channel,this._channel.binaryType="arraybuffer",typeof this._channel.bufferedAmountLowThreshold=="number"&&(this._channel.bufferedAmountLowThreshold=_a),this.channelName=this._channel.label,this._channel.onmessage=n=>{this._onChannelMessage(n)},this._channel.onbufferedamountlow=()=>{this._onChannelBufferedAmountLow()},this._channel.onopen=()=>{this._onChannelOpen()},this._channel.onclose=()=>{this._onChannelClose()},this._channel.onerror=n=>{const r=n.error instanceof Error?n.error:new Error(`Datachannel error: ${n.message} ${n.filename}:${n.lineno}:${n.colno}`);this.destroy(me(r,"ERR_DATA_CHANNEL"))};let i=!1;this._closingInterval=setInterval(()=>{this._channel&&this._channel.readyState==="closing"?(i&&this._onChannelClose(),i=!0):i=!1},zp)}_read(){}_write(t,i,n){if(this.destroyed)return n(me(new Error("cannot write after peer is destroyed"),"ERR_DATA_CHANNEL"));if(this._connected){try{this.send(t)}catch(r){return this.destroy(me(r,"ERR_DATA_CHANNEL"))}this._channel.bufferedAmount>_a?(this._debug("start backpressure: bufferedAmount %d",this._channel.bufferedAmount),this._cb=n):n(null)}else this._debug("write before connect"),this._chunk=t,this._cb=n}_onFinish(){if(this.destroyed)return;const t=()=>{setTimeout(()=>this.destroy(),1e3)};this._connected?t():this.once("connect",t)}_startIceCompleteTimeout(){this.destroyed||this._iceCompleteTimer||(this._debug("started iceComplete timeout"),this._iceCompleteTimer=setTimeout(()=>{this._iceComplete||(this._iceComplete=!0,this._debug("iceComplete timeout completed"),this.emit("iceTimeout"),this.emit("_iceComplete"))},this.iceCompleteTimeout))}_createOffer(){this.destroyed||this._pc.createOffer(this.offerOptions).then(t=>{if(this.destroyed)return;!this.trickle&&!this.allowHalfTrickle&&(t.sdp=zo(t.sdp)),t.sdp=this.sdpTransform(t.sdp);const i=()=>{if(this.destroyed)return;const a=this._pc.localDescription||t;this._debug("signal"),this.emit("signal",{type:a.type,sdp:a.sdp})},n=()=>{this._debug("createOffer success"),!this.destroyed&&(this.trickle||this._iceComplete?i():this.once("_iceComplete",i))},r=a=>{this.destroy(me(a,"ERR_SET_LOCAL_DESCRIPTION"))};this._pc.setLocalDescription(t).then(n).catch(r)}).catch(t=>{this.destroy(me(t,"ERR_CREATE_OFFER"))})}_requestMissingTransceivers(){this._pc.getTransceivers&&this._pc.getTransceivers().forEach(t=>{!t.mid&&t.sender.track&&!t.requested&&(t.requested=!0,this.addTransceiver(t.sender.track.kind))})}_createAnswer(){this.destroyed||this._pc.createAnswer(this.answerOptions).then(t=>{if(this.destroyed)return;!this.trickle&&!this.allowHalfTrickle&&(t.sdp=zo(t.sdp)),t.sdp=this.sdpTransform(t.sdp);const i=()=>{if(this.destroyed)return;const a=this._pc.localDescription||t;this._debug("signal"),this.emit("signal",{type:a.type,sdp:a.sdp}),this.initiator||this._requestMissingTransceivers()},n=()=>{this.destroyed||(this.trickle||this._iceComplete?i():this.once("_iceComplete",i))},r=a=>{this.destroy(me(a,"ERR_SET_LOCAL_DESCRIPTION"))};this._pc.setLocalDescription(t).then(n).catch(r)}).catch(t=>{this.destroy(me(t,"ERR_CREATE_ANSWER"))})}_onConnectionStateChange(){this.destroyed||this._pc.connectionState==="failed"&&this.destroy(me(new Error("Connection failed."),"ERR_CONNECTION_FAILURE"))}_onIceStateChange(){if(this.destroyed)return;const t=this._pc.iceConnectionState,i=this._pc.iceGatheringState;this._debug("iceStateChange (connection: %s) (gathering: %s)",t,i),this.emit("iceStateChange",t,i),(t==="connected"||t==="completed")&&(this._pcReady=!0,this._maybeReady()),t==="failed"&&this.destroy(me(new Error("Ice connection failed."),"ERR_ICE_CONNECTION_FAILURE")),t==="closed"&&this.destroy(me(new Error("Ice connection closed."),"ERR_ICE_CONNECTION_CLOSED"))}getStats(t){const i=n=>(Object.prototype.toString.call(n.values)==="[object Array]"&&n.values.forEach(r=>{Object.assign(n,r)}),n);this._pc.getStats.length===0||this._isReactNativeWebrtc?this._pc.getStats().then(n=>{const r=[];n.forEach(a=>{r.push(i(a))}),t(null,r)},n=>t(n)):this._pc.getStats.length>0?this._pc.getStats(n=>{if(this.destroyed)return;const r=[];n.result().forEach(a=>{const o={};a.names().forEach(s=>{o[s]=a.stat(s)}),o.id=a.id,o.type=a.type,o.timestamp=a.timestamp,r.push(i(o))}),t(null,r)},n=>t(n)):t(null,[])}_maybeReady(){if(this._debug("maybeReady pc %s channel %s",this._pcReady,this._channelReady),this._connected||this._connecting||!this._pcReady||!this._channelReady)return;this._connecting=!0;const t=()=>{this.destroyed||this.getStats((i,n)=>{if(this.destroyed)return;i&&(n=[]);const r={},a={},o={};let s=!1;n.forEach(u=>{(u.type==="remotecandidate"||u.type==="remote-candidate")&&(r[u.id]=u),(u.type==="localcandidate"||u.type==="local-candidate")&&(a[u.id]=u),(u.type==="candidatepair"||u.type==="candidate-pair")&&(o[u.id]=u)});const c=u=>{s=!0;let f=a[u.localCandidateId];f&&(f.ip||f.address)?(this.localAddress=f.ip||f.address,this.localPort=Number(f.port)):f&&f.ipAddress?(this.localAddress=f.ipAddress,this.localPort=Number(f.portNumber)):typeof u.googLocalAddress=="string"&&(f=u.googLocalAddress.split(":"),this.localAddress=f[0],this.localPort=Number(f[1])),this.localAddress&&(this.localFamily=this.localAddress.includes(":")?"IPv6":"IPv4");let h=r[u.remoteCandidateId];h&&(h.ip||h.address)?(this.remoteAddress=h.ip||h.address,this.remotePort=Number(h.port)):h&&h.ipAddress?(this.remoteAddress=h.ipAddress,this.remotePort=Number(h.portNumber)):typeof u.googRemoteAddress=="string"&&(h=u.googRemoteAddress.split(":"),this.remoteAddress=h[0],this.remotePort=Number(h[1])),this.remoteAddress&&(this.remoteFamily=this.remoteAddress.includes(":")?"IPv6":"IPv4"),this._debug("connect local: %s:%s remote: %s:%s",this.localAddress,this.localPort,this.remoteAddress,this.remotePort)};if(n.forEach(u=>{u.type==="transport"&&u.selectedCandidatePairId&&c(o[u.selectedCandidatePairId]),(u.type==="googCandidatePair"&&u.googActiveConnection==="true"||(u.type==="candidatepair"||u.type==="candidate-pair")&&u.selected)&&c(u)}),!s&&(!Object.keys(o).length||Object.keys(a).length)){setTimeout(t,100);return}else this._connecting=!1,this._connected=!0;if(this._chunk){try{this.send(this._chunk)}catch(f){return this.destroy(me(f,"ERR_DATA_CHANNEL"))}this._chunk=null,this._debug('sent chunk from "write before connect"');const u=this._cb;this._cb=null,u(null)}typeof this._channel.bufferedAmountLowThreshold!="number"&&(this._interval=setInterval(()=>this._onInterval(),150),this._interval.unref&&this._interval.unref()),this._debug("connect"),this.emit("connect")})};t()}_onInterval(){!this._cb||!this._channel||this._channel.bufferedAmount>_a||this._onChannelBufferedAmountLow()}_onSignalingStateChange(){this.destroyed||(this._pc.signalingState==="stable"&&(this._isNegotiating=!1,this._debug("flushing sender queue",this._sendersAwaitingStable),this._sendersAwaitingStable.forEach(t=>{this._pc.removeTrack(t),this._queuedNegotiation=!0}),this._sendersAwaitingStable=[],this._queuedNegotiation?(this._debug("flushing negotiation queue"),this._queuedNegotiation=!1,this._needsNegotiation()):(this._debug("negotiated"),this.emit("negotiated"))),this._debug("signalingStateChange %s",this._pc.signalingState),this.emit("signalingStateChange",this._pc.signalingState))}_onIceCandidate(t){this.destroyed||(t.candidate&&this.trickle?this.emit("signal",{type:"candidate",candidate:{candidate:t.candidate.candidate,sdpMLineIndex:t.candidate.sdpMLineIndex,sdpMid:t.candidate.sdpMid}}):!t.candidate&&!this._iceComplete&&(this._iceComplete=!0,this.emit("_iceComplete")),t.candidate&&this._startIceCompleteTimeout())}_onChannelMessage(t){if(this.destroyed)return;let i=t.data;i instanceof ArrayBuffer&&(i=Bp.from(i)),this.push(i)}_onChannelBufferedAmountLow(){if(this.destroyed||!this._cb)return;this._debug("ending backpressure: bufferedAmount %d",this._channel.bufferedAmount);const t=this._cb;this._cb=null,t(null)}_onChannelOpen(){this._connected||this.destroyed||(this._debug("on channel open"),this._channelReady=!0,this._maybeReady())}_onChannelClose(){this.destroyed||(this._debug("on channel close"),this.destroy())}_onTrack(t){this.destroyed||t.streams.forEach(i=>{this._debug("on track"),this.emit("track",t.track,i),this._remoteTracks.push({track:t.track,stream:i}),!this._remoteStreams.some(n=>n.id===i.id)&&(this._remoteStreams.push(i),ka(()=>{this._debug("on stream"),this.emit("stream",i)}))})}_debug(){const t=[].slice.call(arguments);t[0]="["+this._id+"] "+t[0],Mp.apply(null,t)}};qr.WEBRTC_SUPPORT=!!sc();qr.config={iceServers:[{urls:["stun:stun.l.google.com:19302","stun:global.stun.twilio.com:3478"]}],sdpSemantics:"unified-plan"};qr.channelConfig={};var oc=qr,vs={};(function(e){e.DEFAULT_ANNOUNCE_PEERS=50,e.MAX_ANNOUNCE_PEERS=82,e.binaryToHex=i=>(typeof i!="string"&&(i=String(i)),Buffer.from(i,"binary").toString("hex")),e.hexToBinary=i=>(typeof i!="string"&&(i=String(i)),Buffer.from(i,"hex").toString("binary")),e.parseUrl=i=>{const n=new URL(i.replace(/^udp:/,"http:"));return i.match(/^udp:/)&&Object.defineProperties(n,{href:{value:n.href.replace(/^http/,"udp")},protocol:{value:n.protocol.replace(/^http/,"udp")},origin:{value:n.origin.replace(/^http/,"udp")}}),n},Object.assign(e,bi)})(vs);var lc={exports:{}};(function(e){var t=function(){function i(m,y){return y!=null&&m instanceof y}var n;try{n=Map}catch{n=function(){}}var r;try{r=Set}catch{r=function(){}}var a;try{a=Promise}catch{a=function(){}}function o(m,y,g,w,_){typeof y=="object"&&(g=y.depth,w=y.prototype,_=y.includeNonEnumerable,y=y.circular);var p=[],k=[],T=typeof Buffer<"u";typeof y>"u"&&(y=!0),typeof g>"u"&&(g=1/0);function C(S,$){if(S===null)return null;if($===0)return S;var L,P;if(typeof S!="object")return S;if(i(S,n))L=new n;else if(i(S,r))L=new r;else if(i(S,a))L=new a(function(ie,ne){S.then(function(O){ie(C(O,$-1))},function(O){ne(C(O,$-1))})});else if(o.__isArray(S))L=[];else if(o.__isRegExp(S))L=new RegExp(S.source,h(S)),S.lastIndex&&(L.lastIndex=S.lastIndex);else if(o.__isDate(S))L=new Date(S.getTime());else{if(T&&Buffer.isBuffer(S))return Buffer.allocUnsafe?L=Buffer.allocUnsafe(S.length):L=new Buffer(S.length),S.copy(L),L;i(S,Error)?L=Object.create(S):typeof w>"u"?(P=Object.getPrototypeOf(S),L=Object.create(P)):(L=Object.create(w),P=w)}if(y){var B=p.indexOf(S);if(B!=-1)return k[B];p.push(S),k.push(L)}i(S,n)&&S.forEach(function(ie,ne){var O=C(ne,$-1),se=C(ie,$-1);L.set(O,se)}),i(S,r)&&S.forEach(function(ie){var ne=C(ie,$-1);L.add(ne)});for(var z in S){var Y;P&&(Y=Object.getOwnPropertyDescriptor(P,z)),!(Y&&Y.set==null)&&(L[z]=C(S[z],$-1))}if(Object.getOwnPropertySymbols)for(var K=Object.getOwnPropertySymbols(S),z=0;z<K.length;z++){var N=K[z],q=Object.getOwnPropertyDescriptor(S,N);q&&!q.enumerable&&!_||(L[N]=C(S[N],$-1),q.enumerable||Object.defineProperty(L,N,{enumerable:!1}))}if(_)for(var j=Object.getOwnPropertyNames(S),z=0;z<j.length;z++){var Q=j[z],q=Object.getOwnPropertyDescriptor(S,Q);q&&q.enumerable||(L[Q]=C(S[Q],$-1),Object.defineProperty(L,Q,{enumerable:!1}))}return L}return C(m,g)}o.clonePrototype=function(y){if(y===null)return null;var g=function(){};return g.prototype=y,new g};function s(m){return Object.prototype.toString.call(m)}o.__objToStr=s;function c(m){return typeof m=="object"&&s(m)==="[object Date]"}o.__isDate=c;function u(m){return typeof m=="object"&&s(m)==="[object Array]"}o.__isArray=u;function f(m){return typeof m=="object"&&s(m)==="[object RegExp]"}o.__isRegExp=f;function h(m){var y="";return m.global&&(y+="g"),m.ignoreCase&&(y+="i"),m.multiline&&(y+="m"),y}return o.__getRegExpFlags=h,o}();e.exports&&(e.exports=t)})(lc);var Op=lc.exports;const Np=Mr("simple-websocket"),qp=gs,Fp=ac,Oo=Dr,cn=bi,sn=typeof cn!="function"?WebSocket:cn,No=64*1024;let cc=class extends Fp.Duplex{constructor(t={}){if(typeof t=="string"&&(t={url:t}),t=Object.assign({allowHalfOpen:!1},t),super(t),t.url==null&&t.socket==null)throw new Error("Missing required `url` or `socket` option");if(t.url!=null&&t.socket!=null)throw new Error("Must specify either `url` or `socket` option, not both");if(this._id=qp(4).toString("hex").slice(0,7),this._debug("new websocket: %o",t),this.connected=!1,this.destroyed=!1,this._chunk=null,this._cb=null,this._interval=null,t.socket)this.url=t.socket.url,this._ws=t.socket,this.connected=t.socket.readyState===sn.OPEN;else{this.url=t.url;try{typeof cn=="function"?this._ws=new sn(t.url,null,{...t,encoding:void 0}):this._ws=new sn(t.url)}catch(i){Oo(()=>this.destroy(i));return}}this._ws.binaryType="arraybuffer",t.socket&&this.connected?Oo(()=>this._handleOpen()):this._ws.onopen=()=>this._handleOpen(),this._ws.onmessage=i=>this._handleMessage(i),this._ws.onclose=()=>this._handleClose(),this._ws.onerror=i=>this._handleError(i),this._handleFinishBound=()=>this._handleFinish(),this.once("finish",this._handleFinishBound)}send(t){this._ws.send(t)}destroy(t){this._destroy(t,()=>{})}_destroy(t,i){if(!this.destroyed){if(this._debug("destroy (error: %s)",t&&(t.message||t)),this.readable=this.writable=!1,this._readableState.ended||this.push(null),this._writableState.finished||this.end(),this.connected=!1,this.destroyed=!0,clearInterval(this._interval),this._interval=null,this._chunk=null,this._cb=null,this._handleFinishBound&&this.removeListener("finish",this._handleFinishBound),this._handleFinishBound=null,this._ws){const n=this._ws,r=()=>{n.onclose=null};if(n.readyState===sn.CLOSED)r();else try{n.onclose=r,n.close()}catch{r()}n.onopen=null,n.onmessage=null,n.onerror=()=>{}}this._ws=null,t&&this.emit("error",t),this.emit("close"),i()}}_read(){}_write(t,i,n){if(this.destroyed)return n(new Error("cannot write after socket is destroyed"));if(this.connected){try{this.send(t)}catch(r){return this.destroy(r)}typeof cn!="function"&&this._ws.bufferedAmount>No?(this._debug("start backpressure: bufferedAmount %d",this._ws.bufferedAmount),this._cb=n):n(null)}else this._debug("write before connect"),this._chunk=t,this._cb=n}_handleOpen(){if(!(this.connected||this.destroyed)){if(this.connected=!0,this._chunk){try{this.send(this._chunk)}catch(i){return this.destroy(i)}this._chunk=null,this._debug('sent chunk from "write before connect"');const t=this._cb;this._cb=null,t(null)}typeof cn!="function"&&(this._interval=setInterval(()=>this._onInterval(),150),this._interval.unref&&this._interval.unref()),this._debug("connect"),this.emit("connect")}}_handleMessage(t){if(this.destroyed)return;let i=t.data;i instanceof ArrayBuffer&&(i=Buffer.from(i)),this.push(i)}_handleClose(){this.destroyed||(this._debug("on close"),this.destroy())}_handleError(t){this.destroy(new Error(`Error connecting to ${this.url}`))}_handleFinish(){if(this.destroyed)return;const t=()=>{setTimeout(()=>this.destroy(),1e3)};this.connected?t():this.once("connect",t)}_onInterval(){if(!this._cb||!this._ws||this._ws.bufferedAmount>No)return;this._debug("ending backpressure: bufferedAmount %d",this._ws.bufferedAmount);const t=this._cb;this._cb=null,t(null)}_debug(){const t=[].slice.call(arguments);t[0]="["+this._id+"] "+t[0],Np.apply(null,t)}};cc.WEBSOCKET_SUPPORT=!!sn;var Hp=cc;const Up=Br;let jp=class extends Up{constructor(t,i){super(),this.client=t,this.announceUrl=i,this.interval=null,this.destroyed=!1}setInterval(t){t==null&&(t=this.DEFAULT_ANNOUNCE_INTERVAL),clearInterval(this.interval),t&&(this.interval=setInterval(()=>{this.announce(this.client._defaultAnnounceOpts())},t),this.interval.unref&&this.interval.unref())}};var Kp=jp;const Wp=Op,bt=Mr("bittorrent-tracker:websocket-tracker"),Yp=oc,Gp=gs,Vp=Hp,Jp=bi,Kt=vs,Zp=Kp,It={},Xp=10*1e3,Qp=60*60*1e3,ef=5*60*1e3,tf=50*1e3;let bs=class extends Zp{constructor(t,i){super(t,i),bt("new websocket tracker %s",i),this.peers={},this.socket=null,this.reconnecting=!1,this.retries=0,this.reconnectTimer=null,this.expectingResponse=!1,this._openSocket()}announce(t){if(this.destroyed||this.reconnecting)return;if(!this.socket.connected){this.socket.once("connect",()=>{this.announce(t)});return}const i=Object.assign({},t,{action:"announce",info_hash:this.client._infoHashBinary,peer_id:this.client._peerIdBinary});if(this._trackerId&&(i.trackerid=this._trackerId),t.event==="stopped"||t.event==="completed")this._send(i);else{const n=Math.min(t.numwant,5);this._generateOffers(n,r=>{i.numwant=n,i.offers=r,this._send(i)})}}scrape(t){if(this.destroyed||this.reconnecting)return;if(!this.socket.connected){this.socket.once("connect",()=>{this.scrape(t)});return}const n={action:"scrape",info_hash:Array.isArray(t.infoHash)&&t.infoHash.length>0?t.infoHash.map(r=>r.toString("binary")):t.infoHash&&t.infoHash.toString("binary")||this.client._infoHashBinary};this._send(n)}destroy(t=qo){if(this.destroyed)return t(null);this.destroyed=!0,clearInterval(this.interval),clearTimeout(this.reconnectTimer);for(const a in this.peers){const o=this.peers[a];clearTimeout(o.trackerTimeout),o.destroy()}if(this.peers=null,this.socket&&(this.socket.removeListener("connect",this._onSocketConnectBound),this.socket.removeListener("data",this._onSocketDataBound),this.socket.removeListener("close",this._onSocketCloseBound),this.socket.removeListener("error",this._onSocketErrorBound),this.socket=null),this._onSocketConnectBound=null,this._onSocketErrorBound=null,this._onSocketDataBound=null,this._onSocketCloseBound=null,It[this.announceUrl]&&(It[this.announceUrl].consumers-=1),It[this.announceUrl].consumers>0)return t();let i=It[this.announceUrl];delete It[this.announceUrl],i.on("error",qo),i.once("close",t);let n;if(!this.expectingResponse)return r();n=setTimeout(r,Kt.DESTROY_TIMEOUT),i.once("data",r);function r(){n&&(clearTimeout(n),n=null),i.removeListener("data",r),i.destroy(),i=null}}_openSocket(){if(this.destroyed=!1,this.peers||(this.peers={}),this._onSocketConnectBound=()=>{this._onSocketConnect()},this._onSocketErrorBound=t=>{this._onSocketError(t)},this._onSocketDataBound=t=>{this._onSocketData(t)},this._onSocketCloseBound=()=>{this._onSocketClose()},this.socket=It[this.announceUrl],this.socket)It[this.announceUrl].consumers+=1,this.socket.connected&&this._onSocketConnectBound();else{const t=new URL(this.announceUrl);let i;this.client._proxyOpts&&(i=t.protocol==="wss:"?this.client._proxyOpts.httpsAgent:this.client._proxyOpts.httpAgent,!i&&this.client._proxyOpts.socksProxy&&(i=new Jp.Agent(Wp(this.client._proxyOpts.socksProxy),t.protocol==="wss:"))),this.socket=It[this.announceUrl]=new Vp({url:this.announceUrl,agent:i}),this.socket.consumers=1,this.socket.once("connect",this._onSocketConnectBound)}this.socket.on("data",this._onSocketDataBound),this.socket.once("close",this._onSocketCloseBound),this.socket.once("error",this._onSocketErrorBound)}_onSocketConnect(){this.destroyed||this.reconnecting&&(this.reconnecting=!1,this.retries=0,this.announce(this.client._defaultAnnounceOpts()))}_onSocketData(t){if(!this.destroyed){this.expectingResponse=!1;try{t=JSON.parse(t)}catch{this.client.emit("warning",new Error("Invalid tracker response"));return}t.action==="announce"?this._onAnnounceResponse(t):t.action==="scrape"?this._onScrapeResponse(t):this._onSocketError(new Error(`invalid action in WS response: ${t.action}`))}}_onAnnounceResponse(t){if(t.info_hash!==this.client._infoHashBinary){bt("ignoring websocket data from %s for %s (looking for %s: reused socket)",this.announceUrl,Kt.binaryToHex(t.info_hash),this.client.infoHash);return}if(t.peer_id&&t.peer_id===this.client._peerIdBinary)return;bt("received %s from %s for %s",JSON.stringify(t),this.announceUrl,this.client.infoHash);const i=t["failure reason"];if(i)return this.client.emit("warning",new Error(i));const n=t["warning message"];n&&this.client.emit("warning",new Error(n));const r=t.interval||t["min interval"];r&&this.setInterval(r*1e3);const a=t["tracker id"];if(a&&(this._trackerId=a),t.complete!=null){const s=Object.assign({},t,{announce:this.announceUrl,infoHash:Kt.binaryToHex(t.info_hash)});this.client.emit("update",s)}let o;if(t.offer&&t.peer_id&&(bt("creating peer (from remote offer)"),o=this._createPeer(),o.id=Kt.binaryToHex(t.peer_id),o.once("signal",s=>{const c={action:"announce",info_hash:this.client._infoHashBinary,peer_id:this.client._peerIdBinary,to_peer_id:t.peer_id,answer:s,offer_id:t.offer_id};this._trackerId&&(c.trackerid=this._trackerId),this._send(c)}),this.client.emit("peer",o),o.signal(t.offer)),t.answer&&t.peer_id){const s=Kt.binaryToHex(t.offer_id);o=this.peers[s],o?(o.id=Kt.binaryToHex(t.peer_id),this.client.emit("peer",o),o.signal(t.answer),clearTimeout(o.trackerTimeout),o.trackerTimeout=null,delete this.peers[s]):bt(`got unexpected answer: ${JSON.stringify(t.answer)}`)}}_onScrapeResponse(t){t=t.files||{};const i=Object.keys(t);if(i.length===0){this.client.emit("warning",new Error("invalid scrape response"));return}i.forEach(n=>{const r=Object.assign(t[n],{announce:this.announceUrl,infoHash:Kt.binaryToHex(n)});this.client.emit("scrape",r)})}_onSocketClose(){this.destroyed||(this.destroy(),this._startReconnectTimer())}_onSocketError(t){this.destroyed||(this.destroy(),this.client.emit("warning",t),this._startReconnectTimer())}_startReconnectTimer(){const t=Math.floor(Math.random()*ef)+Math.min(Math.pow(2,this.retries)*Xp,Qp);this.reconnecting=!0,clearTimeout(this.reconnectTimer),this.reconnectTimer=setTimeout(()=>{this.retries++,this._openSocket()},t),this.reconnectTimer.unref&&this.reconnectTimer.unref(),bt("reconnecting socket in %s ms",t)}_send(t){if(this.destroyed)return;this.expectingResponse=!0;const i=JSON.stringify(t);bt("send %s",i),this.socket.send(i)}_generateOffers(t,i){const n=this,r=[];bt("generating %s offers",t);for(let s=0;s<t;++s)a();o();function a(){const s=Gp(20).toString("hex");bt("creating peer (from _generateOffers)");const c=n.peers[s]=n._createPeer({initiator:!0});c.once("signal",u=>{r.push({offer:u,offer_id:Kt.hexToBinary(s)}),o()}),c.trackerTimeout=setTimeout(()=>{bt("tracker timeout: destroying peer"),c.trackerTimeout=null,delete n.peers[s],c.destroy()},tf),c.trackerTimeout.unref&&c.trackerTimeout.unref()}function o(){r.length===t&&(bt("generated %s offers",t),i(r))}}_createPeer(t){const i=this;t=Object.assign({trickle:!1,config:i.client._rtcConfig,wrtc:i.client._wrtc},t);const n=new Yp(t);return n.once("error",r),n.once("connect",a),n;function r(o){i.client.emit("warning",new Error(`Connection error: ${o.message}`)),n.destroy()}function a(){n.removeListener("error",r),n.removeListener("connect",a)}}};bs.prototype.DEFAULT_ANNOUNCE_INTERVAL=30*1e3;bs._socketPool=It;function qo(){}var nf=bs;const Wt=Mr("bittorrent-tracker:client"),rf=Br,af=Iu,sf=Mu,of=oc,lf=Dr,Fo=vs,Ho=bi,Uo=bi,cf=nf;class Wa extends rf{constructor(t={}){if(super(),!t.peerId)throw new Error("Option `peerId` is required");if(!t.infoHash)throw new Error("Option `infoHash` is required");if(!t.announce)throw new Error("Option `announce` is required");if(!process.browser&&!t.port)throw new Error("Option `port` is required");this.peerId=typeof t.peerId=="string"?t.peerId:t.peerId.toString("hex"),this._peerIdBuffer=Buffer.from(this.peerId,"hex"),this._peerIdBinary=this._peerIdBuffer.toString("binary"),this.infoHash=typeof t.infoHash=="string"?t.infoHash.toLowerCase():t.infoHash.toString("hex"),this._infoHashBuffer=Buffer.from(this.infoHash,"hex"),this._infoHashBinary=this._infoHashBuffer.toString("binary"),Wt("new client %s",this.infoHash),this.destroyed=!1,this._port=t.port,this._getAnnounceOpts=t.getAnnounceOpts,this._rtcConfig=t.rtcConfig,this._userAgent=t.userAgent,this._proxyOpts=t.proxyOpts,this._wrtc=typeof t.wrtc=="function"?t.wrtc():t.wrtc;let i=typeof t.announce=="string"?[t.announce]:t.announce==null?[]:t.announce;i=i.map(a=>(a=a.toString(),a[a.length-1]==="/"&&(a=a.substring(0,a.length-1)),a)),i=Array.from(new Set(i));const n=this._wrtc!==!1&&(!!this._wrtc||of.WEBRTC_SUPPORT),r=a=>{lf(()=>{this.emit("warning",a)})};this._trackers=i.map(a=>{let o;try{o=Fo.parseUrl(a)}catch{return r(new Error(`Invalid tracker URL: ${a}`)),null}const s=o.port;if(s<0||s>65535)return r(new Error(`Invalid tracker port: ${a}`)),null;const c=o.protocol;return(c==="http:"||c==="https:")&&typeof Ho=="function"?new Ho(this,a):c==="udp:"&&typeof Uo=="function"?new Uo(this,a):(c==="ws:"||c==="wss:")&&n?c==="ws:"&&typeof window<"u"&&window.location.protocol==="https:"?(r(new Error(`Unsupported tracker protocol: ${a}`)),null):new cf(this,a):(r(new Error(`Unsupported tracker protocol: ${a}`)),null)}).filter(Boolean)}start(t){t=this._defaultAnnounceOpts(t),t.event="started",Wt("send `start` %o",t),this._announce(t),this._trackers.forEach(i=>{i.setInterval()})}stop(t){t=this._defaultAnnounceOpts(t),t.event="stopped",Wt("send `stop` %o",t),this._announce(t)}complete(t){t||(t={}),t=this._defaultAnnounceOpts(t),t.event="completed",Wt("send `complete` %o",t),this._announce(t)}update(t){t=this._defaultAnnounceOpts(t),t.event&&delete t.event,Wt("send `update` %o",t),this._announce(t)}_announce(t){this._trackers.forEach(i=>{i.announce(t)})}scrape(t){Wt("send `scrape`"),t||(t={}),this._trackers.forEach(i=>{i.scrape(t)})}setInterval(t){Wt("setInterval %d",t),this._trackers.forEach(i=>{i.setInterval(t)})}destroy(t){if(this.destroyed)return;this.destroyed=!0,Wt("destroy");const i=this._trackers.map(n=>r=>{n.destroy(r)});sf(i,t),this._trackers=[],this._getAnnounceOpts=null}_defaultAnnounceOpts(t={}){return t.numwant==null&&(t.numwant=Fo.DEFAULT_ANNOUNCE_PEERS),t.uploaded==null&&(t.uploaded=0),t.downloaded==null&&(t.downloaded=0),this._getAnnounceOpts&&(t=Object.assign({},t,this._getAnnounceOpts())),t}}Wa.scrape=(e,t)=>{if(t=af(t),!e.infoHash)throw new Error("Option `infoHash` is required");if(!e.announce)throw new Error("Option `announce` is required");const i=Object.assign({},e,{infoHash:Array.isArray(e.infoHash)?e.infoHash[0]:e.infoHash,peerId:Buffer.from("01234567890123456789"),port:6881}),n=new Wa(i);n.once("error",t),n.once("warning",t);let r=Array.isArray(e.infoHash)?e.infoHash.length:1;const a={};return n.on("scrape",o=>{if(r-=1,a[o.infoHash]=o,r===0){n.destroy();const s=Object.keys(a);s.length===1?t(null,a[s[0]]):t(null,a)}}),e.infoHash=Array.isArray(e.infoHash)?e.infoHash.map(o=>Buffer.from(o,"hex")):Buffer.from(e.infoHash,"hex"),n.scrape({infoHash:e.infoHash}),n};var df=Wa;const uf=Bl(df);var dc={exports:{}},Me=dc.exports={},Tt,At;function Ya(){throw new Error("setTimeout has not been defined")}function Ga(){throw new Error("clearTimeout has not been defined")}(function(){try{typeof setTimeout=="function"?Tt=setTimeout:Tt=Ya}catch{Tt=Ya}try{typeof clearTimeout=="function"?At=clearTimeout:At=Ga}catch{At=Ga}})();function uc(e){if(Tt===setTimeout)return setTimeout(e,0);if((Tt===Ya||!Tt)&&setTimeout)return Tt=setTimeout,setTimeout(e,0);try{return Tt(e,0)}catch{try{return Tt.call(null,e,0)}catch{return Tt.call(this,e,0)}}}function pf(e){if(At===clearTimeout)return clearTimeout(e);if((At===Ga||!At)&&clearTimeout)return At=clearTimeout,clearTimeout(e);try{return At(e)}catch{try{return At.call(null,e)}catch{return At.call(this,e)}}}var zt=[],Mi=!1,pi,Yn=-1;function ff(){!Mi||!pi||(Mi=!1,pi.length?zt=pi.concat(zt):Yn=-1,zt.length&&pc())}function pc(){if(!Mi){var e=uc(ff);Mi=!0;for(var t=zt.length;t;){for(pi=zt,zt=[];++Yn<t;)pi&&pi[Yn].run();Yn=-1,t=zt.length}pi=null,Mi=!1,pf(e)}}Me.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var i=1;i<arguments.length;i++)t[i-1]=arguments[i];zt.push(new fc(e,t)),zt.length===1&&!Mi&&uc(pc)};function fc(e,t){this.fun=e,this.array=t}fc.prototype.run=function(){this.fun.apply(null,this.array)};Me.title="browser";Me.browser=!0;Me.env={};Me.argv=[];Me.version="";Me.versions={};function Ht(){}Me.on=Ht;Me.addListener=Ht;Me.once=Ht;Me.off=Ht;Me.removeListener=Ht;Me.removeAllListeners=Ht;Me.emit=Ht;Me.prependListener=Ht;Me.prependOnceListener=Ht;Me.listeners=function(e){return[]};Me.binding=function(e){throw new Error("process.binding is not supported")};Me.cwd=function(){return"/"};Me.chdir=function(e){throw new Error("process.chdir is not supported")};Me.umask=function(){return 0};var hf=dc.exports;const mf=Bl(hf);globalThis.Buffer||(globalThis.Buffer=vi.Buffer);globalThis.process||(globalThis.process=mf);const gf=["wss://tracker.openwebtorrent.com","wss://tracker.btorrent.xyz","wss://tracker.webtorrent.dev","wss://tracker.files.fm:7073/announce","wss://spacetrackr.link:443/announce","wss://tracker.fastcast.nz:443/announce"],yf=160,hc="cinepulse.decision-room.owner.",vf="cinepulse.decision-room.autoplay";function Ti(e=12){const t=new Uint8Array(e);return crypto.getRandomValues(t),Array.from(t,i=>i.toString(16).padStart(2,"0")).join("")}function Ne(e=""){const t=String(e).replace(/\D/g,"");return t.length===6?t:""}function In(e,t="",i=null){if(!e?.id)return;const n=e.type==="tv"?"tv":"movie";try{sessionStorage.setItem(vf,JSON.stringify({id:String(e.id),type:n,roomCode:Ne(t),season:n==="tv"?Math.max(1,Number(e.season)||1):null,episode:n==="tv"?Math.max(1,Number(e.episode)||1):null,initialSync:i||null,createdAt:Date.now()}))}catch{}window.dispatchEvent(new CustomEvent("cinepulse:decision-room-open"));const r=`#detail?type=${n}&id=${e.id}`;window.location.hash===r?window.dispatchEvent(new Event("hashchange")):window.location.hash=r}async function bf(e){const t=new TextEncoder().encode(`cinepulse-decision-room-v1:${e}`),i=await crypto.subtle.digest("SHA-256",t);return Array.from(new Uint8Array(i).slice(0,20),n=>n.toString(16).padStart(2,"0")).join("")}function wf(){const e=new Uint32Array(1);return crypto.getRandomValues(e),String(1e5+e[0]%9e5)}function kf(e){const t=Ne(e);if(t)try{sessionStorage.setItem(`${hc}${t}`,"1")}catch{}}function _f(e){const t=Ne(e);if(!t)return!1;try{return sessionStorage.getItem(`${hc}${t}`)==="1"}catch{return!1}}function Sf(){try{return Ne(new URL(window.location.href).searchParams.get("oda")||"")}catch{return""}}function mc(e){const t=new URL(window.location.href);return t.searchParams.set("oda",Ne(e)),t.toString()}function xf(){try{const e=new URL(window.location.href);e.searchParams.delete("oda"),history.replaceState(history.state,"",e.toString())}catch{}}function Va(){const e=["Sinemasever","Gece Kuşu","Patlamış Mısır","Film Avcısı","Koltuğunda"],t=Ti(2).toUpperCase();return`${e[Math.floor(Math.random()*e.length)]} ${t}`}class Ef{constructor({roomCode:t,nickname:i=Va(),isHost:n=!1}){this.roomCode=Ne(t),this.nickname=String(i||Va()).slice(0,30),this.isHost=!!n,this.selfId=Ti(10),this.client=null,this.peers=new Map,this.peerParticipantIds=new WeakMap,this.trackerPeerCount=1,this.announceTimer=null,this.participants=new Map([[this.selfId,{id:this.selfId,nickname:this.nickname,role:this.isHost?"moderator":"participant"}]]),this.listeners=new Set,this.receivedIds=new Set,this.cards=[],this.votes={},this.ratings={},this.suggestions=[],this.syncMode="smooth",this.silentVoting=!1,this.sharedPlayback=null,this.lastPlayerSync=null,this.roomFinish=null,this.chatMessages=[],this.roomSummary=null,this.playbackStartedAt=0,this.roomActivity={reactions:[],chats:[]},this.onPlayerSync=r=>{const a=r.detail;!this.isHost||!a||Ne(a.roomCode)!==this.roomCode||!this.sharedPlayback||String(a.mediaId)!==String(this.sharedPlayback.id)||a.type!==this.sharedPlayback.type||(this.lastPlayerSync=a,this.broadcast({type:"player-sync",sync:a}))},window.addEventListener("cinepulse:player-sync",this.onPlayerSync),this.onRoomFinish=r=>{const a=r.detail;!this.isHost||!a||Ne(a.roomCode)!==this.roomCode||(this.roomFinish=a,this.broadcast({type:"room-finish",finish:a}))},this.onRoomFinishVote=r=>{const a=r.detail;!a||Ne(a.roomCode)!==this.roomCode||!a.optionId||this.broadcast({type:"room-finish-vote",vote:a})},this.onRoomFinishChoice=r=>{const a=r.detail;!this.isHost||!a||Ne(a.roomCode)!==this.roomCode||(this.broadcast({type:"room-finish-choice",choice:a}),this.applyRoomFinishChoice(a))},this.onRoomReaction=r=>{const a=r.detail;if(!a||Ne(a.roomCode)!==this.roomCode||!a.emoji)return;const o={...a,senderId:this.selfId,sentAt:Date.now()};this.recordRoomReaction(o),this.broadcast({type:"room-reaction",reaction:o})},window.addEventListener("cinepulse:room-finish",this.onRoomFinish),window.addEventListener("cinepulse:room-finish-vote",this.onRoomFinishVote),window.addEventListener("cinepulse:room-finish-choice",this.onRoomFinishChoice),window.addEventListener("cinepulse:room-reaction",this.onRoomReaction),this.onRoomChatSend=r=>{const a=r.detail,o=String(a?.text||"").trim().slice(0,240);if(!a||Ne(a.roomCode)!==this.roomCode||!o)return;const s={id:String(a.id||`chat-${Date.now()}-${Math.random().toString(36).slice(2,8)}`),text:o,nickname:this.nickname,senderId:this.selfId,sentAt:Number(a.sentAt)||Date.now(),at:Math.max(0,Number(a.at)||0)};this.chatMessages=[...this.chatMessages,s].slice(-60),this.recordRoomChat(s),this.broadcast({type:"room-chat",chat:s})},window.addEventListener("cinepulse:room-chat-send",this.onRoomChatSend),this.onRoomPlaybackHealth=r=>{const a=r.detail;!a||Ne(a.roomCode)!==this.roomCode||a.senderId===this.selfId||this.broadcast({type:"playback-health",health:{senderId:this.selfId,status:a.status==="buffering"?"buffering":"ready",bufferedAhead:Math.max(0,Number(a.bufferedAhead)||0),reportedAt:Date.now()}})},window.addEventListener("cinepulse:room-playback-health",this.onRoomPlaybackHealth),this.onRoomPlaybackProgress=r=>{const a=r.detail;!a||Ne(a.roomCode)!==this.roomCode||this.broadcast({type:"playback-progress",progress:{senderId:this.selfId,nickname:this.nickname,time:Math.max(0,Number(a.time)||0),playing:!!a.playing,buffering:!!a.buffering,reportedAt:Date.now()}})},window.addEventListener("cinepulse:room-playback-progress",this.onRoomPlaybackProgress),this.onRoomPlaybackCheckpoint=r=>{const a=r.detail;!this.isHost||!a||Ne(a.roomCode)!==this.roomCode||!a.targetId||this.broadcast({type:"playback-checkpoint",checkpoint:{targetId:a.targetId,action:a.action==="resume"?"resume":"hold",mediaId:String(a.mediaId||""),type:a.type==="tv"?"tv":"movie"}})},window.addEventListener("cinepulse:room-playback-checkpoint",this.onRoomPlaybackCheckpoint),this.onRoomPlaybackFinished=r=>{const a=r.detail;!a||Ne(a.roomCode)!==this.roomCode||this.broadcast({type:"playback-finished",finished:{mediaId:String(a.mediaId||""),type:a.type==="tv"?"tv":"movie",season:Math.max(1,Number(a.season)||1),episode:Math.max(1,Number(a.episode)||1),nickname:this.nickname}})},window.addEventListener("cinepulse:room-playback-finished",this.onRoomPlaybackFinished),this.onRoomSummary=r=>{const a=r.detail;if(!this.isHost||!a||Ne(a.roomCode)!==this.roomCode)return;const o=new Map;this.roomActivity.reactions.forEach(f=>o.set(f.emoji,(o.get(f.emoji)||0)+1));const s=Array.from(o.entries()).sort((f,h)=>h[1]-f[1])[0]||null,c=new Map;this.roomActivity.chats.forEach(f=>{const h=Math.floor(Math.max(0,Number(f.at)||0)/60)*60;c.set(h,(c.get(h)||0)+1)});const u=Array.from(c.entries()).sort((f,h)=>h[1]-f[1])[0]||null;this.roomSummary={roomCode:this.roomCode,mediaId:String(a.mediaId||this.sharedPlayback?.id||""),type:a.type==="tv"?"tv":"movie",participants:this.participants.size,watchedSeconds:Math.max(0,Number(a.seconds)||0),topReaction:s?{emoji:s[0],count:s[1]}:null,topTalkSecond:u?u[0]:null,chatCount:this.roomActivity.chats.length},this.broadcast({type:"room-summary",summary:this.roomSummary}),window.dispatchEvent(new CustomEvent("cinepulse:room-summary-remote",{detail:this.roomSummary}))},this.onRoomRhythm=r=>{const a=r.detail;!this.isHost||!a||Ne(a.roomCode)!==this.roomCode||!a.targetId||this.broadcast({type:"room-rhythm",rhythm:a})},window.addEventListener("cinepulse:room-summary",this.onRoomSummary),window.addEventListener("cinepulse:room-rhythm",this.onRoomRhythm),this.destroyed=!1}applyRoomFinishChoice(t){if(this.roomFinish=null,t.action==="open"&&t.card?.id){this.sharedPlayback={id:t.card.id,type:t.card.type==="tv"?"tv":"movie",season:Math.max(1,Number(t.card.season)||1),episode:Math.max(1,Number(t.card.episode)||1)},this.lastPlayerSync=null,this.playbackStartedAt=Date.now(),this.roomSummary=null,this.roomActivity={reactions:[],chats:[]},this.emit(),In(t.card,this.roomCode);return}t.action==="close"&&(this.sharedPlayback=null,this.lastPlayerSync=null,window.dispatchEvent(new CustomEvent("cinepulse:decision-room-close-player",{detail:{roomCode:this.roomCode}}))),this.emit()}snapshot(){return{roomCode:this.roomCode,nickname:this.nickname,selfId:this.selfId,isHost:this.isHost,peerCount:this.peers.size,trackerPeerCount:this.trackerPeerCount,participants:Array.from(this.participants.values()),cards:this.cards,votes:this.votes,ratings:this.ratings,suggestions:this.suggestions,syncMode:this.syncMode,silentVoting:this.silentVoting,chatMessages:this.chatMessages,roomSummary:this.roomSummary}}subscribe(t){return this.listeners.add(t),t(this.snapshot()),()=>this.listeners.delete(t)}emit(){const t=this.snapshot();if(this.listeners.forEach(i=>i(t)),this.sharedPlayback){const i={roomCode:this.roomCode,isHost:this.isHost,selfId:this.selfId,participants:t.participants,peerCount:t.peerCount,chatMessages:t.chatMessages,syncMode:t.syncMode,silentVoting:t.silentVoting,roomSummary:t.roomSummary};window.__cinepulseDecisionRoomPresence=i,window.dispatchEvent(new CustomEvent("cinepulse:decision-room-presence",{detail:i}))}}async connect(){if(!this.roomCode)throw new Error("Geçersiz oda kodu.");const t=await bf(this.roomCode);this.destroyed||(this.client=new uf({infoHash:t,peerId:Ti(20),announce:gf,port:0,rtcConfig:{iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:global.stun.twilio.com:3478"}]}}),this.client.on("peer",i=>this.attachPeer(i)),this.client.on("update",i=>{const n=Number(i?.complete||0)+Number(i?.incomplete||0);this.trackerPeerCount=Math.max(1,n||1),this.emit()}),this.client.on("warning",()=>this.emit()),this.client.on("error",()=>this.emit()),this.client.start({numwant:5,left:1}),this.announceTimer=window.setInterval(()=>{try{this.client?.update({numwant:5,left:1})}catch{}},15e3),this.emit())}attachPeer(t){let i=t.id||Ti(8);const n=()=>{this.destroyed||(i=t.id||i,this.peers.set(i,t),this.sendTo(t,{type:"hello",participant:{id:this.selfId,nickname:this.nickname,role:this.isHost?"moderator":"participant"},wantsState:!0}),this.emit())},r=s=>this.receive(s,t),a=()=>{this.peers.delete(i);const s=this.peerParticipantIds.get(t);s&&(Array.from(this.peers.values()).some(u=>this.peerParticipantIds.get(u)===s)||this.participants.delete(s)),this.emit()},o=()=>a();t.once("connect",n),t.on("data",r),t.once("close",a),t.once("error",o)}sendTo(t,i){try{if(!t||t.destroyed||!t.connected)return;t.send(JSON.stringify({...i,id:Ti(10),senderId:this.selfId}))}catch{}}broadcast(t){const i={...t,id:Ti(10),senderId:this.selfId};this.remember(i.id),this.peers.forEach(n=>{try{!n.destroyed&&n.connected&&n.send(JSON.stringify(i))}catch{}})}remember(t){this.receivedIds.add(t),this.receivedIds.size>yf&&this.receivedIds.delete(this.receivedIds.values().next().value)}receive(t,i){let n;try{n=JSON.parse(typeof t=="string"?t:new TextDecoder().decode(t))}catch{return}if(!(!n?.id||this.receivedIds.has(n.id)||n.senderId===this.selfId)){if(this.remember(n.id),n.type==="hello"&&n.participant?.id&&(this.participants.set(n.participant.id,n.participant),this.peerParticipantIds.set(i,n.participant.id),n.wantsState&&(this.sendTo(i,{type:"hello",participant:{id:this.selfId,nickname:this.nickname,role:this.isHost?"moderator":"participant"}}),this.isHost&&this.sendTo(i,{type:"state",cards:this.cards,votes:this.votes,ratings:this.ratings,suggestions:this.suggestions,syncMode:this.syncMode,silentVoting:this.silentVoting,participants:Array.from(this.participants.values()),sharedPlayback:this.sharedPlayback,lastPlayerSync:this.lastPlayerSync,roomFinish:this.roomFinish,chatMessages:this.chatMessages})),this.emit()),n.type==="state"&&Array.isArray(n.cards)&&!this.isHost){if(this.cards=n.cards.slice(0,12),this.votes=n.votes||{},this.ratings=n.ratings||{},this.suggestions=Array.isArray(n.suggestions)?n.suggestions.slice(-20):[],this.syncMode=n.syncMode==="strict"?"strict":"smooth",this.silentVoting=n.silentVoting===!0,Array.isArray(n.participants)&&n.participants.forEach(r=>{r?.id&&r?.nickname&&this.participants.set(r.id,r)}),n.sharedPlayback?.id){const r={id:n.sharedPlayback.id,type:n.sharedPlayback.type==="tv"?"tv":"movie",season:Math.max(1,Number(n.sharedPlayback.season)||1),episode:Math.max(1,Number(n.sharedPlayback.episode)||1)},a=!this.sharedPlayback||String(this.sharedPlayback.id)!==String(r.id)||this.sharedPlayback.type!==r.type||Number(this.sharedPlayback.season)!==Number(r.season)||Number(this.sharedPlayback.episode)!==Number(r.episode);this.sharedPlayback=r,this.lastPlayerSync=n.lastPlayerSync||null,this.roomFinish=n.roomFinish||null,this.chatMessages=Array.isArray(n.chatMessages)?n.chatMessages.slice(-60):[],a?In(r,this.roomCode,this.lastPlayerSync):this.lastPlayerSync&&window.dispatchEvent(new CustomEvent("cinepulse:player-sync-remote",{detail:this.lastPlayerSync}))}this.emit()}if(n.type==="cards"&&Array.isArray(n.cards)&&!this.isHost&&(this.cards=n.cards.slice(0,12),this.votes=n.votes||{},this.ratings=n.ratings||{},this.emit()),n.type==="suggestions"&&Array.isArray(n.suggestions)&&!this.isHost&&(this.suggestions=n.suggestions.slice(-20),this.emit()),n.type==="sync-mode"&&!this.isHost&&(this.syncMode=n.syncMode==="strict"?"strict":"smooth",this.emit()),n.type==="silent-voting"&&!this.isHost&&(this.silentVoting=n.enabled===!0,this.emit()),n.type==="suggest-card"&&this.isHost&&n.card?.id){const r=`${n.senderId}:${n.card.type}:${n.card.id}`;if(!this.cards.some(o=>String(o.id)===String(n.card.id)&&o.type===n.card.type)&&!this.suggestions.some(o=>o.id===r)){const o=this.participants.get(n.senderId);this.suggestions=[...this.suggestions,{id:r,card:n.card,nickname:o?.nickname||"Katılımcı"}].slice(-20),this.broadcast({type:"suggestions",suggestions:this.suggestions}),this.emit()}}if(n.type==="playback-health"&&this.isHost&&n.health?.senderId&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-health-remote",{detail:{...n.health,roomCode:this.roomCode,syncMode:this.syncMode}})),n.type==="playback-progress"&&this.isHost&&n.progress?.senderId&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-progress-remote",{detail:{...n.progress,roomCode:this.roomCode}})),n.type==="playback-checkpoint"&&n.checkpoint?.targetId&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-checkpoint-remote",{detail:{...n.checkpoint,roomCode:this.roomCode}})),n.type==="playback-finished"&&n.finished?.mediaId&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-finished-remote",{detail:{...n.finished,roomCode:this.roomCode,senderId:n.senderId}})),n.type==="vote"&&n.cardId&&n.senderId&&(this.votes={...this.votes,[n.cardId]:{...this.votes[n.cardId]||{},[n.senderId]:n.vote==="yes"?"yes":"no"}},this.emit()),n.type==="rating"&&n.cardId&&n.senderId){const r=Math.max(1,Math.min(5,Number(n.rating)||0));if(!r)return;this.ratings={...this.ratings,[n.cardId]:{...this.ratings[n.cardId]||{},[n.senderId]:r}},this.emit()}if(n.type==="open"&&n.card?.id&&(this.sharedPlayback={id:n.card.id,type:n.card.type==="tv"?"tv":"movie",season:Math.max(1,Number(n.card.season)||1),episode:Math.max(1,Number(n.card.episode)||1)},this.emit(),In(n.card,this.roomCode)),n.type==="player-sync"&&n.sync&&!this.isHost){const r=n.sync;if(!this.sharedPlayback||String(r.mediaId)!==String(this.sharedPlayback.id)||r.type!==this.sharedPlayback.type)return;this.lastPlayerSync=r,window.dispatchEvent(new CustomEvent("cinepulse:player-sync-remote",{detail:r}))}if(n.type==="room-finish"&&n.finish&&!this.isHost&&(this.roomFinish=n.finish,window.dispatchEvent(new CustomEvent("cinepulse:room-finish-remote",{detail:n.finish})),this.emit()),n.type==="room-finish-vote"&&n.vote){const r=n.vote;if(this.roomFinish?.id!==r.finishId)return;this.roomFinish={...this.roomFinish,votes:{...this.roomFinish.votes||{},[n.senderId]:r.optionId}},window.dispatchEvent(new CustomEvent("cinepulse:room-finish-vote-remote",{detail:this.roomFinish})),this.emit()}if(n.type==="room-finish-choice"&&n.choice&&!this.isHost&&this.applyRoomFinishChoice(n.choice),n.type==="room-reaction"&&n.reaction&&(this.recordRoomReaction(n.reaction),window.dispatchEvent(new CustomEvent("cinepulse:room-reaction-remote",{detail:n.reaction}))),n.type==="room-chat"&&n.chat?.text){const r={...n.chat,senderId:n.senderId||n.chat.senderId};this.chatMessages=[...this.chatMessages,r].slice(-60),this.recordRoomChat(r),window.dispatchEvent(new CustomEvent("cinepulse:room-chat-remote",{detail:r}))}n.type==="room-summary"&&n.summary&&(this.roomSummary=n.summary,window.dispatchEvent(new CustomEvent("cinepulse:room-summary-remote",{detail:n.summary})),this.emit()),n.type==="room-rhythm"&&n.rhythm?.targetId&&window.dispatchEvent(new CustomEvent("cinepulse:room-rhythm-remote",{detail:{...n.rhythm,roomCode:this.roomCode}}))}}setCards(t){this.isHost&&(this.cards=Array.isArray(t)?t.slice(0,12):[],this.votes={},this.ratings={},this.broadcast({type:"cards",cards:this.cards,votes:this.votes,ratings:this.ratings}),this.emit())}addCard(t){return!this.isHost||!t?.id||this.cards.length>=12||this.cards.some(i=>String(i.id)===String(t.id)&&i.type===t.type)?!1:(this.cards=[...this.cards,t],this.broadcast({type:"cards",cards:this.cards,votes:this.votes,ratings:this.ratings}),this.emit(),!0)}suggest(t){return this.isHost||!t?.id?!1:(this.broadcast({type:"suggest-card",card:t}),!0)}acceptSuggestion(t){if(!this.isHost)return!1;const i=this.suggestions.find(n=>n.id===t);return!i||this.cards.length>=12?!1:(this.suggestions=this.suggestions.filter(n=>n.id!==t),this.cards.some(n=>String(n.id)===String(i.card.id)&&n.type===i.card.type)||(this.cards=[...this.cards,i.card],this.broadcast({type:"cards",cards:this.cards,votes:this.votes,ratings:this.ratings})),this.broadcast({type:"suggestions",suggestions:this.suggestions}),this.emit(),!0)}dismissSuggestion(t){if(!this.isHost)return!1;const i=this.suggestions.filter(n=>n.id!==t);return i.length===this.suggestions.length?!1:(this.suggestions=i,this.broadcast({type:"suggestions",suggestions:this.suggestions}),this.emit(),!0)}setSyncMode(t){this.isHost&&(this.syncMode=t==="strict"?"strict":"smooth",this.broadcast({type:"sync-mode",syncMode:this.syncMode}),this.emit())}setSilentVoting(t){this.isHost&&(this.silentVoting=t===!0,this.broadcast({type:"silent-voting",enabled:this.silentVoting}),this.emit())}removeCard(t){if(!this.isHost||!t)return!1;const i=this.cards.filter(n=>String(n.id)!==String(t));return i.length===this.cards.length?!1:(this.cards=i,delete this.votes[t],delete this.ratings[t],this.broadcast({type:"cards",cards:this.cards,votes:this.votes,ratings:this.ratings}),this.emit(),!0)}vote(t,i){t&&(this.votes={...this.votes,[t]:{...this.votes[t]||{},[this.selfId]:i==="yes"?"yes":"no"}},this.broadcast({type:"vote",cardId:t,vote:i==="yes"?"yes":"no"}),this.emit())}rate(t,i){if(!t)return;const n=Math.max(1,Math.min(5,Number(i)||0));n&&(this.ratings={...this.ratings,[t]:{...this.ratings[t]||{},[this.selfId]:n}},this.broadcast({type:"rating",cardId:t,rating:n}),this.emit())}openForEveryone(t){if(!t?.id)return;this.sharedPlayback={id:t.id,type:t.type==="tv"?"tv":"movie",season:Math.max(1,Number(t.season)||1),episode:Math.max(1,Number(t.episode)||1)},this.playbackStartedAt=Date.now(),this.roomSummary=null,this.roomActivity={reactions:[],chats:[]},this.emit(),this.broadcast({type:"open",card:t});const i=()=>{this.destroyed||!this.sharedPlayback||this.broadcast({type:"state",cards:this.cards,votes:this.votes,ratings:this.ratings,suggestions:this.suggestions,syncMode:this.syncMode,silentVoting:this.silentVoting,participants:Array.from(this.participants.values()),sharedPlayback:this.sharedPlayback,lastPlayerSync:this.lastPlayerSync,roomFinish:this.roomFinish,chatMessages:this.chatMessages})};window.setTimeout(i,350),window.setTimeout(i,1400),In(t,this.roomCode)}recordRoomReaction(t){t?.emoji&&(this.roomActivity.reactions=[...this.roomActivity.reactions,{emoji:String(t.emoji),at:Math.max(0,Number(t.at)||0),senderId:t.senderId||""}].slice(-240))}recordRoomChat(t){t?.text&&(this.roomActivity.chats=[...this.roomActivity.chats,{at:Math.max(0,Number(t.at)||0),senderId:t.senderId||""}].slice(-120))}destroy(){this.destroyed=!0,window.removeEventListener("cinepulse:player-sync",this.onPlayerSync),window.removeEventListener("cinepulse:room-finish",this.onRoomFinish),window.removeEventListener("cinepulse:room-finish-vote",this.onRoomFinishVote),window.removeEventListener("cinepulse:room-finish-choice",this.onRoomFinishChoice),window.removeEventListener("cinepulse:room-reaction",this.onRoomReaction),window.removeEventListener("cinepulse:room-chat-send",this.onRoomChatSend),window.removeEventListener("cinepulse:room-playback-health",this.onRoomPlaybackHealth),window.removeEventListener("cinepulse:room-playback-progress",this.onRoomPlaybackProgress),window.removeEventListener("cinepulse:room-playback-checkpoint",this.onRoomPlaybackCheckpoint),window.removeEventListener("cinepulse:room-playback-finished",this.onRoomPlaybackFinished),window.removeEventListener("cinepulse:room-summary",this.onRoomSummary),window.removeEventListener("cinepulse:room-rhythm",this.onRoomRhythm),this.announceTimer&&window.clearInterval(this.announceTimer),this.announceTimer=null,this.peers.forEach(t=>{try{t.destroy()}catch{}}),this.peers.clear();try{this.client?.stop()}catch{}try{this.client?.destroy()}catch{}this.listeners.clear()}}let qt=null,Je=null,qi=null,Fi=null;function gc(){Pi(!1);const e=document.createElement("div");e.className="decision-room-backdrop",document.body.appendChild(e),qt=e,e.innerHTML=`
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
    </section>`,e.querySelector("#btn-close-decision-room").onclick=()=>Pi(!1),e.addEventListener("click",i=>{i.target===e&&Pi(!1)}),e.querySelector("#btn-create-decision-room").onclick=()=>fr({roomCode:wf(),isHost:!0});const t=()=>{const i=e.querySelector("#decision-room-code-input"),n=String(i?.value||"").replace(/\D/g,"").slice(0,6);if(n.length!==6){i?.focus(),X("6 haneli oda kodunu yaz.","warning");return}fr({roomCode:n,isHost:!1})};e.querySelector("#btn-join-decision-room").onclick=t,e.querySelector("#decision-room-code-input").onkeydown=i=>{i.key==="Enter"&&t()},Z(e)}function pt(e=""){const t=document.createElement("div");return t.textContent=String(e),t.innerHTML}function Tf(e,t){const n=Object.values(t.votes[e.id]||{}).filter(a=>a==="yes").length,r=Math.max(1,t.participants.length);return{yes:n,needed:r,matched:n>=r}}function Mn(e,t){const i=Object.values(t.ratings?.[e.id]||{}).map(Number).filter(a=>a>=1&&a<=5),n=t.ratings?.[e.id]?.[t.selfId]||0;return{average:i.length?i.reduce((a,o)=>a+o,0)/i.length:0,count:i.length,mine:n}}function yc(){return`
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
    </section>`}function vc(e,t,i=""){const n=e.querySelector("#decision-room-status"),r=e.querySelector("#decision-room-peers"),a=e.querySelector("#decision-room-member-count"),o=e.querySelector("#decision-room-moderator-panel"),s=e.querySelector("#decision-room-signal-status"),c=e.querySelector("#decision-room-suggestion-panel"),u=e.querySelector("#decision-room-suggestions"),f=e.querySelector("#decision-room-silent-vote-summary"),h=e.querySelector("#decision-room-sync-mode"),m=e.querySelector("#decision-room-silent-voting"),y=e.querySelector("#decision-room-deck"),g=e.querySelector("#decision-room-link");n&&(n.textContent=i||(t.peerCount?"Arkadaşların bağlandı, oylar anlık geliyor.":"Oda eşleştiriliyor. Arkadaşına bağlantıyı gönder."));const w=Math.max(t.participants.length,t.trackerPeerCount||1);if(a&&(a.textContent=`${w} kişi`),o&&(o.hidden=!t.isHost),c&&(c.hidden=t.isHost),s&&t.isHost&&(s.textContent=w>t.participants.length?`${w} kişi tracker tarafından görüldü; doğrudan bağlantı hazırlanıyor.`:`${w} kişi aktif bağlantıda.`),r&&(r.innerHTML=t.isHost?t.participants.map(_=>`<span class="decision-room-person ${_.role==="moderator"?"is-moderator":""}"><i data-lucide="${_.role==="moderator"?"crown":"circle-user-round"}"></i>${pt(_.nickname)}${_.id===t.selfId?" (Sen)":""}</span>`).join(""):""),g&&(g.value=mc(t.roomCode)),h&&t.isHost){const _=t.syncMode==="strict";h.querySelector('input[value="smooth"]').checked=!_,h.querySelector('input[value="strict"]').checked=_;const p=h.querySelector("#decision-room-sync-help");p&&(p.textContent=_?"Yavaş bağlantı buffer’a düşünce herkes kısa süre bekler; süreler birlikte kalır.":"İlk açılışta en fazla 2 dakika fark için bir kez hizalar. Moderatörün oynat/duraklat ve sarma komutları herkese gider; otomatik durum paketleri buffer’ı bozmaz. Fark 1,5 dakikaya çıkarsa geride veya önde kalan taraf kısa süre bekler, diğeri yaklaşınca devam eder."),h.querySelectorAll('input[name="room-sync-mode"]').forEach(k=>{k.onchange=()=>Je?.setSyncMode(k.value)})}if(m&&t.isHost&&(m.checked=t.silentVoting===!0,m.onchange=()=>Je?.setSilentVoting(m.checked)),u&&t.isHost&&(u.innerHTML=t.suggestions?.length?`<strong>Katılımcı önerileri</strong>${t.suggestions.map(_=>`<div class="decision-room-suggestion"><span><b>${pt(_.card.title||_.card.name||"İsimsiz içerik")}</b><small>${pt(_.nickname)} önerdi</small></span><button data-accept-suggestion="${pt(_.id)}">Ekle</button><button data-dismiss-suggestion="${pt(_.id)}" aria-label="Reddet">×</button></div>`).join("")}`:"",u.querySelectorAll("[data-accept-suggestion]").forEach(_=>{_.onclick=()=>Je?.acceptSuggestion(_.dataset.acceptSuggestion)}),u.querySelectorAll("[data-dismiss-suggestion]").forEach(_=>{_.onclick=()=>Je?.dismissSuggestion(_.dataset.dismissSuggestion)})),f&&t.isHost&&t.silentVoting){const _=t.cards.map(p=>({card:p,rating:Mn(p,t)})).filter(p=>p.rating.count>0).sort((p,k)=>k.rating.average-p.rating.average||k.rating.count-p.rating.count).slice(0,3);f.innerHTML=_.length?`<strong><i data-lucide="shield-check"></i> Sessiz oylama özeti</strong>${_.map(({card:p,rating:k},T)=>`<div><b>${T+1}</b><span>${pt(p.title||p.name||"İsimsiz içerik")}</span><em>★ ${k.average.toFixed(1)} · ${k.count} gizli oy</em></div>`).join("")}`:'<strong><i data-lucide="shield-check"></i> Sessiz oylama</strong><small>Katılımcıların yıldızları yalnızca burada ortak sonuç olarak görünür.</small>'}else f&&(f.innerHTML="");if(y){if(!t.cards.length)y.innerHTML='<div class="decision-room-empty"><i data-lucide="sparkles"></i><strong>Adaylar hazırlanıyor</strong><span>Oda sahibi ortak izleme listesi oluşturuyor.</span></div>';else{const _=t.isHost&&t.silentVoting?[...t.cards].sort((p,k)=>Mn(k,t).average-Mn(p,t).average):t.cards;y.innerHTML=_.map(p=>{const k=p.title||p.name||"İsimsiz içerik",T=p.type==="tv"?`Dizi · S${Math.max(1,Number(p.season)||1)} B${Math.max(1,Number(p.episode)||1)}`:"Film",C=Tf(p,t),S=t.votes[p.id]?.[t.selfId],$=Mn(p,t),L=[1,2,3,4,5].map(P=>`<button data-room-rating="${P}" data-card-id="${p.id}" class="${$.mine>=P?"active-star":""}" aria-label="${P} yıldız"><i data-lucide="star"></i></button>`).join("");return`<article class="decision-room-card ${C.matched?"matched":""}">
          <img src="${Xe(p.poster_path,je.POSTER_SMALL)}" alt="" loading="lazy" />
          <div class="decision-room-card-body">
            <span>${T} · ★ ${(Number(p.vote_average)||0).toFixed(1)}</span>
            <strong>${pt(k)}</strong>
            <small>${C.matched?"Herkes izlemek istiyor!":`${C.yes}/${C.needed} kişi izlemek istiyor`}</small>
            <div class="decision-room-rating"><span>${t.silentVoting?t.isHost?$.count?`Gizli puan ${$.average.toFixed(1)} · ${$.count} oy`:"Gizli oy bekleniyor":$.mine?"Puanın kaydedildi":"Gizli puan ver":$.count?`Ortak puan ${$.average.toFixed(1)} · ${$.count} oy`:"Puan ver"}</span><div>${L}</div></div>
            <div class="decision-room-votes">
              <button data-room-vote="yes" data-card-id="${p.id}" class="${S==="yes"?"active-yes":""}"><i data-lucide="heart"></i> İzle</button>
              <button data-room-vote="no" data-card-id="${p.id}" class="${S==="no"?"active-no":""}"><i data-lucide="skip-forward"></i> Geç</button>
              ${C.matched?`<button data-room-open="${p.id}" class="decision-room-open"><i data-lucide="play"></i> Birlikte Aç</button>`:""}
              ${t.isHost?`<button data-room-remove="${p.id}" class="decision-room-remove" aria-label="${pt(k)} içeriğini odadan kaldır"><i data-lucide="trash-2"></i> Kaldır</button>`:""}
            </div>
          </div>
        </article>`}).join("")}y.querySelectorAll("[data-room-vote]").forEach(_=>{_.onclick=()=>Je?.vote(_.dataset.cardId,_.dataset.roomVote)}),y.querySelectorAll("[data-room-rating]").forEach(_=>{_.onclick=()=>Je?.rate(_.dataset.cardId,_.dataset.roomRating)}),y.querySelectorAll("[data-room-open]").forEach(_=>{_.onclick=()=>{const p=t.cards.find(k=>String(k.id)===_.dataset.roomOpen);p&&Je?.openForEveryone(p)}}),y.querySelectorAll("[data-room-remove]").forEach(_=>{_.onclick=()=>{Je?.removeCard(_.dataset.roomRemove)&&X("İçerik odadan kaldırıldı.","success")}})}Z(e)}function pr(e){return{id:e.id,type:e.type||e.media_type||(e.first_air_date?"tv":"movie"),title:e.title,name:e.name,poster_path:e.poster_path,vote_average:e.vote_average,season:e.type==="tv"||e.media_type==="tv"?Math.max(1,Number(e.season)||1):null,episode:e.type==="tv"||e.media_type==="tv"?Math.max(1,Number(e.episode)||1):null}}function bc(e,t){const i=e.querySelector("#decision-room-content-form"),n=e.querySelector("#decision-room-content-search"),r=e.querySelector("#decision-room-content-results");if(!i||!n||!r||!t.isHost)return;let a=null,o=0;const s=async()=>{const c=n.value.trim();if(c.length<2){r.innerHTML="";return}const u=++o;r.innerHTML='<span class="decision-room-search-status">Aranıyor…</span>';const f=await cs(c).catch(()=>[]);if(u!==o||n.value.trim()!==c)return;const h=f.filter(m=>m?.id&&(m.type==="movie"||m.type==="tv")).slice(0,5);r.innerHTML=h.length?h.map(m=>{const y=pr(m),g=y.type==="tv"?'<span class="decision-room-episode-choice" aria-label="Bölüm seçimi"><label>Sezon <input data-add-season type="number" min="1" value="1" inputmode="numeric" /></label><label>Bölüm <input data-add-episode type="number" min="1" value="1" inputmode="numeric" /></label></span>':"";return`<div class="decision-room-search-result"><button type="button" data-add-room-card="${y.id}" data-add-room-type="${y.type}" title="Odaya ekle"><img src="${Xe(y.poster_path,je.POSTER_SMALL)}" alt="" /><span><strong>${pt(y.title||y.name||"İsimsiz içerik")}</strong><small>${y.type==="tv"?"Dizi":"Film"} · ★ ${(Number(y.vote_average)||0).toFixed(1)}</small></span><i data-lucide="plus"></i></button>${g}</div>`}).join(""):'<span class="decision-room-search-status">Sonuç bulunamadı.</span>',r.querySelectorAll("[data-add-room-card]").forEach(m=>{m.onclick=()=>{const y=h.find(p=>String(p.id)===m.dataset.addRoomCard&&(p.type||p.media_type)===m.dataset.addRoomType);if(!y)return;const g=m.closest(".decision-room-search-result"),w=Number(g?.querySelector("[data-add-season]")?.value)||1,_=Number(g?.querySelector("[data-add-episode]")?.value)||1;t.addCard(pr({...y,season:w,episode:_}))?(n.value="",r.innerHTML="",X("İçerik odaya eklendi.","success")):X("Bu içerik zaten listede veya oda dolu.","warning")}}),Z(r)};i.onsubmit=c=>{c.preventDefault(),window.clearTimeout(a),s()},n.oninput=()=>{if(window.clearTimeout(a),n.value.trim().length<2){o+=1,r.innerHTML="";return}a=window.setTimeout(s,220)}}function wc(e,t){const i=e.querySelector("#decision-room-suggestion-form"),n=e.querySelector("#decision-room-suggestion-search"),r=e.querySelector("#decision-room-suggestion-results");if(!i||!n||!r||t.isHost)return;let a=null,o=0;const s=async()=>{const c=n.value.trim();if(c.length<2)return;const u=++o;r.innerHTML='<span class="decision-room-search-status">Aranıyor…</span>';const f=await cs(c).catch(()=>[]);if(u!==o||n.value.trim()!==c)return;const h=f.filter(m=>m?.id&&(m.type==="movie"||m.type==="tv")).slice(0,5);r.innerHTML=h.map(m=>`<div class="decision-room-search-result"><button type="button" data-suggest-card="${m.id}" data-suggest-type="${m.type||m.media_type}"><img src="${Xe(m.poster_path,je.POSTER_SMALL)}" alt="" /><span><strong>${pt(m.title||m.name||"İsimsiz içerik")}</strong><small>${(m.type||m.media_type)==="tv"?"Dizi":"Film"} · Moderatöre öner</small></span><i data-lucide="send"></i></button></div>`).join("")||'<span class="decision-room-search-status">Sonuç bulunamadı.</span>',r.querySelectorAll("[data-suggest-card]").forEach(m=>{m.onclick=()=>{const y=h.find(g=>String(g.id)===m.dataset.suggestCard&&String(g.type||g.media_type)===m.dataset.suggestType);!y||!t.suggest(pr(y))||(n.value="",r.innerHTML="",X("Önerin moderatöre gönderildi.","success"))}}),Z(r)};i.onsubmit=c=>{c.preventDefault(),window.clearTimeout(a),s()},n.oninput=()=>{if(window.clearTimeout(a),n.value.trim().length<2){o+=1,r.innerHTML="";return}a=window.setTimeout(s,220)}}async function kc(e,t){const i=t.querySelector("#decision-room-status");i&&(i.textContent="Ortak adaylar hazırlanıyor…");try{const r=(await Sl("all","week")||[]).filter(a=>a?.id&&(a.media_type==="movie"||a.media_type==="tv"||a.type==="movie"||a.type==="tv")).slice(0,8).map(pr);if(!r.length)throw new Error("Aday bulunamadı.");e.setCards(r)}catch{i&&(i.textContent="Adaylar şu an yüklenemedi. Biraz sonra yeniden dene.")}}async function fr({roomCode:e=Sf(),isHost:t=!1}={}){if(!e){gc();return}Pi(!1);const i=e;t&&kf(i);const n=!!(t||_f(i)),r=Va(),a=document.createElement("div");if(a.id="decision-room-modal-root",a.className="decision-room-backdrop",document.body.appendChild(a),qt=a,n)try{history.replaceState(history.state,"",mc(i))}catch{}a.innerHTML=`
    <section class="decision-room-dialog" role="dialog" aria-modal="true" aria-label="Ortak Karar Odası">
      <button id="btn-close-decision-room" class="decision-room-close" aria-label="Kapat"><i data-lucide="x"></i></button>
      <header class="decision-room-header">
        <div class="decision-room-icon"><i data-lucide="users-round"></i></div>
        <div><h2>Birlikte Seç</h2><p>Herkesin istediği içeriği birlikte bulun.</p></div>
      </header>
      <div class="decision-room-code-panel">
        <span>ODA KODU</span>
        <strong id="decision-room-code">${pt(i)}</strong>
        <button id="btn-copy-decision-room"><i data-lucide="copy"></i> Kodu Kopyala</button>
        <small>Arkadaşın “Birlikte Seç” ekranında bu kodu yazsın.</small>
      </div>
      <div class="decision-room-live"><span class="decision-room-live-dot"></span><span id="decision-room-status">Oda hazırlanıyor…</span><strong id="decision-room-member-count" class="decision-room-member-count">1 kişi</strong></div>
      ${yc()}
      <div id="decision-room-deck" class="decision-room-deck"></div>
      <footer class="decision-room-footer"><span>Oda kapanınca oylar silinir.</span><button id="btn-refresh-decision-cards"><i data-lucide="refresh-cw"></i> Yeni adaylar</button></footer>
    </section>`;const o=()=>Pi(!0);a.querySelector("#btn-close-decision-room").addEventListener("click",o),a.addEventListener("click",u=>{u.target===a&&o()});const s=()=>_c();window.addEventListener("cinepulse:decision-room-open",s,{once:!0}),Fi=()=>window.removeEventListener("cinepulse:decision-room-open",s);const c=new Ef({roomCode:i,nickname:r,isHost:n});Je=c,qi=c.subscribe(u=>vc(a,u)),await c.connect(),!(Je!==c||qt!==a)&&(bc(a,c),wc(a,c),a.querySelector("#btn-copy-decision-room").onclick=async()=>{try{await navigator.clipboard.writeText(i),X("Oda kodu kopyalandı.","success")}catch{const f=a.querySelector("#decision-room-code"),h=document.createRange();h.selectNodeContents(f),window.getSelection()?.removeAllRanges(),window.getSelection()?.addRange(h),document.execCommand("copy"),window.getSelection()?.removeAllRanges(),X("Oda kodu kopyalandı.","success")}},a.querySelector("#btn-refresh-decision-cards").onclick=()=>kc(Je,a),Z(a))}function Pi(e=!0){Fi?.(),Fi=null,qi?.(),qi=null,Je?.destroy(),Je=null,qt?.remove(),qt=null,e&&xf()}function um(){if(qt)return;if(!Je){gc();return}const e=Je,t=document.createElement("div");t.id="decision-room-modal-root",t.className="decision-room-backdrop",document.body.appendChild(t),qt=t,t.innerHTML=`
    <section class="decision-room-dialog" role="dialog" aria-modal="true" aria-label="Ortak Karar Odası">
      <button id="btn-close-decision-room" class="decision-room-close" aria-label="Kapat"><i data-lucide="x"></i></button>
      <header class="decision-room-header"><div class="decision-room-icon"><i data-lucide="users-round"></i></div><div><h2>Birlikte Seç</h2><p>Odan hâlâ açık. Adayları ve katılımcıları buradan gör.</p></div></header>
      <div class="decision-room-code-panel"><span>ODA KODU</span><strong id="decision-room-code">${pt(e.roomCode)}</strong><button id="btn-copy-decision-room"><i data-lucide="copy"></i> Kodu Kopyala</button><small>Arkadaşın “Birlikte Seç” ekranında bu kodu yazsın.</small></div>
      <div class="decision-room-live"><span class="decision-room-live-dot"></span><span id="decision-room-status">Odaya dönüldü.</span><strong id="decision-room-member-count" class="decision-room-member-count">1 kişi</strong></div>
      ${yc()}
      <div id="decision-room-deck" class="decision-room-deck"></div>
      <footer class="decision-room-footer"><span>Oda kapanınca oylar silinir.</span><button id="btn-refresh-decision-cards"><i data-lucide="refresh-cw"></i> Yeni adaylar</button></footer>
    </section>`;const i=()=>Pi(!0);t.querySelector("#btn-close-decision-room").onclick=i,t.addEventListener("click",r=>{r.target===t&&i()});const n=()=>_c();window.addEventListener("cinepulse:decision-room-open",n,{once:!0}),Fi=()=>window.removeEventListener("cinepulse:decision-room-open",n),qi=e.subscribe(r=>vc(t,r)),bc(t,e),wc(t,e),t.querySelector("#btn-copy-decision-room").onclick=async()=>{try{await navigator.clipboard.writeText(e.roomCode),X("Oda kodu kopyalandı.","success")}catch{X(`Oda kodu: ${e.roomCode}`,"info")}},t.querySelector("#btn-refresh-decision-cards").onclick=()=>kc(e,t),Z(t)}function _c(){Fi?.(),Fi=null,qi?.(),qi=null,qt?.remove(),qt=null}function Af(e="home"){const t=wn(),i=Pl(),n=t.isKid,r=gn();return`
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
            <input type="text" id="nav-search-input" class="search-input" placeholder="Dizi, film veya oyuncu ara..." autocomplete="off" />
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
  `}let Zi=null,Pn=null,jo=!1;function Ko(e){const t=document.getElementById("main-navbar");Zi&&window.removeEventListener("scroll",Zi),Zi=()=>t?.classList.toggle("scrolled",window.scrollY>20),Zi(),window.addEventListener("scroll",Zi,{passive:!0});const i=document.getElementById("mobile-search-row");document.getElementById("btn-mobile-search-toggle")?.addEventListener("click",()=>{i?.classList.toggle("hidden"),i?.classList.contains("hidden")||(document.getElementById("mobile-search-input")?.focus(),Z())}),document.getElementById("btn-mobile-search-close")?.addEventListener("click",()=>{i?.classList.add("hidden")}),document.getElementById("btn-nav-notifications")?.addEventListener("click",ku),document.getElementById("btn-nav-profile")?.addEventListener("click",wu);const n=document.getElementById("nav-hub-li"),r=document.getElementById("btn-desktop-hub"),a=document.getElementById("hub-mega-dropdown");let o;function s(){clearTimeout(o),r?.setAttribute("aria-expanded","true"),a?.classList.add("open")}function c(){clearTimeout(o),r?.setAttribute("aria-expanded","false"),a?.classList.remove("open")}function u(){clearTimeout(o),o=setTimeout(()=>{!n?.matches(":hover")&&!a?.matches(":hover")&&c()},350)}if(n){n.addEventListener("mouseenter",s),n.addEventListener("mouseleave",u),a?.addEventListener("mouseenter",s),a?.addEventListener("mouseleave",u),r?.addEventListener("click",p=>{p.stopPropagation(),s()}),a?.querySelectorAll(".hub-nav-trigger").forEach(p=>{p.addEventListener("click",c)});const w=p=>{p.key==="Escape"&&c()};window.addEventListener("keydown",w);const _=p=>{n.contains(p.target)||c()};document.addEventListener("click",_)}document.getElementById("btn-hub-random-spin")?.addEventListener("click",async()=>{c(),ho()}),document.getElementById("btn-hub-series-recommend")?.addEventListener("click",c),document.getElementById("btn-hub-trakt")?.addEventListener("click",()=>{c(),cr()});const f=document.getElementById("mobile-hub-backdrop"),h=document.getElementById("mobile-hub-sheet");let m;function y(){f&&(clearTimeout(m),h?.classList.remove("sheet-closing"),f.classList.remove("hidden"),document.body.style.overflow="hidden")}function g(){f&&(document.body.style.overflow="",h?.classList.add("sheet-closing"),clearTimeout(m),m=setTimeout(()=>{f.classList.add("hidden"),h?.classList.remove("sheet-closing")},280))}document.getElementById("btn-open-mobile-hub")?.addEventListener("click",w=>{w.preventDefault(),y()},{once:!1}),document.getElementById("btn-close-mobile-hub")?.addEventListener("click",g),f?.addEventListener("click",w=>{w.target===f&&g()}),f?.querySelectorAll(".hub-nav-trigger").forEach(w=>{w.addEventListener("click",g)}),document.getElementById("btn-hub-random-spin-mobile")?.addEventListener("click",async()=>{g(),ho()}),document.getElementById("btn-hub-series-recommend-mobile")?.addEventListener("click",g),document.getElementById("btn-hub-trakt-mobile")?.addEventListener("click",()=>{g(),cr()}),document.querySelectorAll("[data-open-decision-room]").forEach(w=>{w.addEventListener("click",()=>{c(),g(),fr()})}),Wo("nav-search-input","search-overlay"),Wo("mobile-search-input","mobile-search-overlay"),jo||(jo=!0,document.addEventListener("click",w=>{for(const[_,p]of[["nav-search-input","search-overlay"],["mobile-search-input","mobile-search-overlay"]]){const k=document.getElementById(_),T=document.getElementById(p);T&&!k?.contains(w.target)&&!T.contains(w.target)&&T.classList.add("hidden")}})),Pn&&document.removeEventListener("keydown",Pn),Pn=w=>{(w.metaKey||w.ctrlKey)&&w.key.toLowerCase()==="k"&&(w.preventDefault(),window.innerWidth<=992&&i?(i.classList.remove("hidden"),document.getElementById("mobile-search-input")?.focus()):document.getElementById("nav-search-input")?.focus())},window.addEventListener("keydown",Pn)}function Wo(e,t){const i=document.getElementById(e),n=document.getElementById(t);let r=null;!i||!n||(i.addEventListener("input",a=>{const o=a.target.value.trim();if(clearTimeout(r),o.length<2){n.classList.add("hidden"),n.innerHTML="";return}n.innerHTML='<div class="search-no-results" style="display:flex;align-items:center;gap:8px;padding:1rem;color:var(--text-muted);font-size:.85rem;"><span class="tv-loading-spinner" style="width:16px;height:16px;border-width:2px;"></span> Aranıyor...</div>',n.classList.remove("hidden"),r=setTimeout(async()=>{try{let h=function(){n.querySelectorAll(".search-item").forEach(m=>{m.addEventListener("click",()=>{n.classList.add("hidden"),i.value="",document.getElementById("mobile-search-row")?.classList.add("hidden")})})};const s=await cs(o),c=Array.isArray(s)?s.slice(0,8):s?.results?.slice(0,8)||[],u=`
          <a href="#dramas?q=${encodeURIComponent(o)}" class="search-item search-item-drama" style="background:linear-gradient(135deg,rgba(88,28,135,.35),rgba(30,27,75,.55));border:1px solid rgba(168,85,247,.3);border-radius:10px;margin-top:6px;padding:.6rem .75rem;">
            <div style="width:36px;height:48px;border-radius:6px;background:rgba(168,85,247,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i data-lucide="sparkles" style="width:18px;height:18px;color:#c084fc;"></i>
            </div>
            <div class="search-item-info">
              <div class="search-item-title" style="color:#f3e8ff;font-weight:750;">Kısa Dizilerde Ara: "${o}"</div>
              <div class="search-item-meta">
                <span class="search-badge" style="background:#a855f7;color:#fff;">Özel Hub</span>
                <span style="color:#c4b5fd;">ReelShort & DramaBox</span>
              </div>
            </div>
          </a>`;if(!c.length){n.innerHTML=`<div class="search-no-results" style="padding-bottom:.5rem;">TMDB Sonucu Bulunamadı</div>${u}`,n.classList.remove("hidden"),Z(n),h();return}const f=c.map(m=>{const y=m.media_type==="tv"||!!m.first_air_date||!m.release_date&&!!m.name,g=m.title||m.name||"İsimsiz",w=(m.release_date||m.first_air_date||"").slice(0,4),_=Xe(m.poster_path,je.POSTER_SMALL||je.POSTER_MEDIUM);return`
            <a href="#detail?type=${y?"tv":"movie"}&id=${m.id}" class="search-item">
              <img src="${_}" alt="${g}" class="search-item-img" onerror="this.src='https://via.placeholder.com/45x68/1e293b/64748b?text=N/A'" />
              <div class="search-item-info">
                <div class="search-item-title">${g}</div>
                <div class="search-item-meta">
                  <span class="search-badge">${y?"Dizi":"Film"}</span>
                  ${w?`<span>${w}</span>`:""}
                  <span class="search-rating">★ ${(m.vote_average||0).toFixed(1)}</span>
                </div>
              </div>
            </a>`}).join("");n.innerHTML=f+u,n.classList.remove("hidden"),Z(n),h()}catch{n.innerHTML='<div class="search-no-results">Arama sırasında bir hata oluştu</div>'}},200)}),i.addEventListener("keydown",a=>{a.key==="Escape"&&(n.classList.add("hidden"),i.blur())}))}let Xi=null;function Sc({title:e="Fragman",trailerInfo:t,mediaId:i=null,mediaType:n="movie"}){const r=document.getElementById("trailer-modal");if(!r)return;if(!t||!t.embedUrl){alert("Bu yapım için resmi fragman bulunamadı.");return}const a=t.name||"Resmi Tanıtım",o=i?`#detail?type=${encodeURIComponent(n)}&id=${encodeURIComponent(i)}`:null;r.innerHTML=`
    <div class="trailer-modal-overlay">
      <div class="trailer-modal-dialog">
        
        <!-- Header Bar -->
        <div class="trailer-header">
          <div class="trailer-header-left">
            <span class="trailer-badge">
              <i data-lucide="youtube" style="width: 14px; height: 14px; fill: #f59e0b; color: #f59e0b;"></i>
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

        ${o&&!window.location.hash.startsWith("#detail")?`<div class="trailer-footer"><a class="btn-trailer-detail" href="${o}"><i data-lucide="info"></i><span>İçerik Sayfasına Git</span><i data-lucide="arrow-right"></i></a></div>`:""}

      </div>
    </div>
  `,r.classList.remove("hidden"),document.body.style.overflow="hidden",Z();const s=()=>{r.innerHTML="",r.classList.add("hidden"),document.body.style.overflow="",Xi&&(window.removeEventListener("keydown",Xi),Xi=null)},c=r.querySelector("#btn-close-trailer");c&&c.addEventListener("click",s),r.querySelector(".btn-trailer-detail")?.addEventListener("click",s);const u=r.querySelector(".trailer-modal-overlay");u&&u.addEventListener("click",f=>{f.target===u&&s()}),Xi=f=>{f.key==="Escape"&&s()},window.addEventListener("keydown",Xi)}let at=0,hr=null,Gn=0;const Bn=new Map;function Cf(){clearInterval(hr),hr=null,Gn++}function ws(e){const t=e?.backdrop_path||e?.poster_path,i=window.innerWidth<=768||window.devicePixelRatio<=1?je.BACKDROP_LARGE:je.BACKDROP_XLARGE;return Xe(t,i)}function ks(e,t="auto"){if(!e)return Promise.resolve(null);if(Bn.has(e))return Bn.get(e);const i=new Promise(n=>{const r=new Image;r.decoding="async",r.fetchPriority=t,r.onload=async()=>{try{await r.decode()}catch{}n(e)},r.onerror=()=>{Bn.delete(e),n(null)},r.src=e});return Bn.set(e,i),i}function Lf(e=[]){const i=$t()?e.filter(Qt):e;if(!i||i.length===0)return"";at=0;const n=i.slice(0,10),r=n[0],a=r.id,o=r.first_air_date||r.media_type==="tv"?"tv":"movie",s=r.title||r.name||"Öne Çıkan Yapım",c=r.overview&&r.overview.trim().length>15?r.overview:De(r,o),u=ws(r),f=r.vote_average?r.vote_average.toFixed(1):"8.8",h=(r.first_air_date||r.release_date||"").substring(0,4),m=rs(a);let y=document.getElementById("hero-backdrop-preload");return y||(y=document.createElement("link"),y.id="hero-backdrop-preload",y.rel="preload",y.as="image",document.head.appendChild(y)),y.href=u,y.fetchPriority="high",window.innerWidth>768&&ks(u,"high"),`
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
              <i data-lucide="star" style="width:12px; height:12px; fill: currentColor"></i> ${f} IMDb
            </span>
            <span class="badge" id="hero-year-badge">${h}</span>
            <span class="badge badge-type" id="hero-type-badge">${o==="tv"?"DİZİ":"FİLM"}</span>
          </div>

          <h1 class="hero-title" id="hero-title-text">${s}</h1>
          <p class="hero-overview" id="hero-overview-text">${c}</p>

          <div class="hero-actions">
            <button class="btn-primary hero-btn-play" id="hero-play-btn" data-id="${a}" data-type="${o}">
              <i data-lucide="play" style="fill: currentColor; width: 17px; height: 17px;"></i>
              <span>Hemen İzle</span>
            </button>

            <button class="btn-secondary hero-btn-trailer" id="hero-trailer-btn" data-id="${a}" data-type="${o}" title="Fragmanı İzle">
              <i data-lucide="clapperboard" style="width: 16px; height: 16px;"></i>
              <span>Fragman</span>
            </button>

            <button class="btn-secondary hero-btn-list-icon" id="hero-list-btn" data-id="${a}" data-type="${o}" title="${m?"Listemden Çıkar":"Listeme Ekle"}">
              <i data-lucide="${m?"check":"plus"}" style="width: 17px; height: 17px; ${m?"color: var(--primary);":""}"></i>
            </button>
          </div>

          <!-- Dot Indicators -->
          <div class="hero-dots-wrapper" id="hero-dots-container">
            ${n.map((g,w)=>`
              <div class="hero-dot ${w===at?"active":""}" data-index="${w}" role="button" aria-label="Slayt ${w+1}"></div>
            `).join("")}
          </div>
        </div>
      </div>
    </section>
  `}function $f(e=[]){const i=$t()?e.filter(Qt):e;if(!i||i.length===0)return;const n=i.slice(0,10);at=0;const r=document.getElementById("hero-play-btn"),a=document.getElementById("hero-list-btn"),o=document.getElementById("hero-trailer-btn"),s=document.getElementById("hero-slider-section"),c=document.getElementById("hero-backdrop-img"),u=document.getElementById("hero-arrow-prev"),f=document.getElementById("hero-arrow-next");(async()=>{if(c&&!c.complete&&await new Promise($=>{c.addEventListener("load",$,{once:!0}),c.addEventListener("error",$,{once:!0})}),c?.complete&&c.naturalWidth>0)try{await c.decode()}catch{}requestAnimationFrame(()=>{s?.isConnected&&(s.classList.remove("is-loading"),s.setAttribute("aria-busy","false"))})})();const m=()=>n.slice(1,4).forEach($=>ks(ws($)));"requestIdleCallback"in window?window.requestIdleCallback(m,{timeout:1500}):setTimeout(m,500);function y(){Dn(n[(at+1)%n.length],(at+1)%n.length),S()}function g(){Dn(n[(at-1+n.length)%n.length],(at-1+n.length)%n.length),S()}u?.addEventListener("click",g),f?.addEventListener("click",y);const w=$=>{if(!s?.isConnected){document.removeEventListener("keydown",w);return}$.key==="ArrowRight"&&y(),$.key==="ArrowLeft"&&g()};document.addEventListener("keydown",w);let _=null,p=!1;const k=50;function T($){_=$,p=!0}function C($){if(!p||_===null)return;p=!1;const L=_-$;Math.abs(L)<k||(L>0?y():g(),_=null)}s?.addEventListener("touchstart",$=>T($.touches[0].clientX),{passive:!0}),s?.addEventListener("touchend",$=>C($.changedTouches[0].clientX),{passive:!0}),s?.addEventListener("touchcancel",()=>{p=!1,_=null},{passive:!0}),s?.addEventListener("mousedown",$=>{$.button===0&&T($.clientX)}),s?.addEventListener("mouseup",$=>{$.button===0&&C($.clientX)}),s?.addEventListener("mouseleave",()=>{p=!1,_=null}),r?.addEventListener("click",()=>{window.location.hash=`#detail?type=${r.getAttribute("data-type")}&id=${r.getAttribute("data-id")}`}),o?.addEventListener("click",async()=>{if(Rt().trailersEnabled===!1){X("Fragmanlar yönetici ayarlarından kapatıldı.","info");return}const $=n[at];if(!$)return;const L=$.first_air_date||$.media_type==="tv"?"tv":"movie",P=o.innerHTML;o.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:17px;height:17px;"></i> <span>Yükleniyor...</span>',Z(o);try{const B=await fetchMediaTrailer(L,$.id,$.title||$.name);B?Sc({title:$.title||$.name,trailerInfo:B,mediaId:$.id,mediaType:L}):X("Bu yapım için resmi tanıtım fragmanı bulunamadı.","info")}catch{X("Fragman yüklenirken hata oluştu.","error")}finally{o.innerHTML=P,Z(o)}}),a?.addEventListener("click",()=>{const $=n[at],L=yl($);X(L?"İzleme listene eklendi!":"İzleme listenden çıkarıldı.",L?"success":"info"),a.title=L?"Listemden Çıkar":"Listeme Ekle",a.innerHTML=`<i data-lucide="${L?"check":"plus"}" style="width: 17px; height: 17px; ${L?"color: var(--primary);":""}"></i>`,Z(a)}),document.querySelectorAll(".hero-dot").forEach($=>{$.addEventListener("click",()=>{const L=parseInt($.getAttribute("data-index"),10);Dn(n[L],L),S()})});function S(){clearInterval(hr),!window.matchMedia("(hover: hover) and (pointer: fine)").matches&&(hr=setInterval(()=>{if(n.length>1){const $=(at+1)%n.length;Dn(n[$],$)}},6e3))}S()}async function Dn(e,t=at){if(!e||$t()&&!Qt(e))return;const i=document.getElementById("hero-backdrop-img"),n=document.getElementById("hero-title-text"),r=document.getElementById("hero-overview-text"),a=document.getElementById("hero-play-btn"),o=document.getElementById("hero-list-btn"),s=document.getElementById("hero-trailer-btn"),c=document.getElementById("hero-rating-badge"),u=document.getElementById("hero-year-badge"),f=document.getElementById("hero-type-badge"),h=e.first_air_date||e.media_type==="tv"?"tv":"movie",m=ws(e),y=e.vote_average?e.vote_average.toFixed(1):"8.5",g=(e.first_air_date||e.release_date||"").substring(0,4),w=++Gn;if(i&&i.src!==m){const k=await ks(m,"high");if(!k||w!==Gn||!i.isConnected)return;i.src=k;try{await i.decode()}catch{}if(w!==Gn||!i.isConnected)return}at=t;const _=document.querySelector("#hero-slider-section .hero-content");_?.classList.remove("hero-content-committing"),requestAnimationFrame(()=>{_?.isConnected&&_.classList.add("hero-content-committing")}),n&&(n.textContent=e.title||e.name);const p=e.overview&&e.overview.trim().length>15?e.overview:De(e,h);if(r&&(r.textContent=p),c&&(c.innerHTML=`<i data-lucide="star" style="width:13px;height:13px;fill:currentColor"></i> ${y} IMDb`),u&&(u.textContent=g||"2024"),f&&(f.textContent=h==="tv"?"DİZİ":"FİLM"),a&&(a.setAttribute("data-id",e.id),a.setAttribute("data-type",h)),s&&(s.setAttribute("data-id",e.id),s.setAttribute("data-type",h)),o){o.setAttribute("data-id",e.id),o.setAttribute("data-type",h);const k=rs(e.id);o.title=k?"Listemden Çıkar":"Listeme Ekle",o.innerHTML=`<i data-lucide="${k?"check":"plus"}" style="width:17px;height:17px;${k?"color:var(--primary);":""}"></i>`}Z(document.getElementById("hero-slider-section")),document.querySelectorAll(".hero-dot").forEach((k,T)=>{k.classList.toggle("active",T===at)})}const _s=new Map,mr=new Map;let fi=null,xc=null;function Ec(){const e=window.location.hash||"#home";e.startsWith("#detail")||(xc=e,window.scrollY>0&&_s.set(e,window.scrollY))}function Rf(){Ec(),fi!==null&&clearTimeout(fi),fi=window.setTimeout(()=>{fi=null,Fr()},1500)}function Fr(){fi!==null&&(clearTimeout(fi),fi=null),(window.location.hash||"#home")===xc&&Ec();for(const[e,t]of _s)if(t>0)try{sessionStorage.setItem(`cinepulse_scroll_${e}`,String(t))}catch{}for(const[e,t]of mr)try{sessionStorage.setItem(`cinepulse_rail_${e}`,String(t))}catch{}}const If=Fr;function Mf(e=window.location.hash||"#home"){if(e.startsWith("#detail")){window.scrollTo({top:0,behavior:"instant"});return}document.querySelectorAll(".card-rail").forEach(i=>{if(i.id){let n=mr.get(i.id);if(typeof n!="number")try{const r=sessionStorage.getItem(`cinepulse_rail_${i.id}`);r&&(n=parseFloat(r))}catch{}typeof n=="number"&&n>0&&(i.scrollLeft=n,requestAnimationFrame(()=>{i.scrollLeft=n}))}});let t=_s.get(e);if(typeof t!="number")try{const i=sessionStorage.getItem(`cinepulse_scroll_${e}`);i&&(t=parseFloat(i))}catch{}if(typeof t=="number"&&t>0){const i=(n=0)=>{window.scrollTo({top:t,behavior:"instant"}),n<15&&document.body.scrollHeight<t+window.innerHeight&&setTimeout(()=>i(n+1),60)};requestAnimationFrame(()=>i(0))}else window.scrollTo({top:0,behavior:"instant"})}const Pf={},Bf="https://cine-pulse-drab.vercel.app";(Pf?.VITE_MKV_RELAY_ORIGIN||"").replace(/\/$/,"");function it(e=""){if(!e||/^https?:\/\//i.test(e))return e;if(typeof window>"u")return`http://127.0.0.1:4000${e}`;const t=window.location?.hostname||"";return!!(window.Capacitor?.isNativePlatform?.()||window.location?.protocol==="capacitor:"||t==="localhost"||t==="127.0.0.1"||t.endsWith("github.io"))?`${Bf}${e}`:e}const dn=new Map,gr="cp_fanart_v4_",Df="4e44d9029b1270a757cddc766a1bcb63";function zf(e){if(dn.has(e))return dn.get(e);try{const t=localStorage.getItem(gr+e)||sessionStorage.getItem(gr+e);if(t!==null){const i=t?JSON.parse(t):null;return dn.set(e,i),i}}catch{}}function zn(e,t){dn.set(e,t);try{const i=t?JSON.stringify(t):"";localStorage.setItem(gr+e,i)}catch{try{sessionStorage.setItem(gr+e,t?JSON.stringify(t):"")}catch{}}}async function Of(e,t){try{const i=await fetch(`https://api.themoviedb.org/3/${t==="tv"?"tv":"movie"}/${e}/images?api_key=${Df}&include_image_language=tr,en,null`,{signal:AbortSignal.timeout(3500)});if(!i.ok)return null;const n=await i.json(),r=n.logos||[];let a=null;r.length>0&&(r.sort((u,f)=>{const h=m=>m.iso_639_1==="tr"?3:m.iso_639_1==="en"?2:1;return h(f)-h(u)||(f.vote_average||0)-(u.vote_average||0)}),r[0]?.file_path&&(a=`https://image.tmdb.org/t/p/w500${r[0].file_path}`));const s=(n.backdrops||[]).filter(u=>(u.iso_639_1==="tr"||u.iso_639_1==="en")&&(u.aspect_ratio||0)>1.35&&u.file_path);let c=null;return s.length>0&&(s.sort((u,f)=>{const h=m=>m.iso_639_1==="tr"?2:1;return h(f)-h(u)||(f.vote_average||0)-(u.vote_average||0)}),c=`https://image.tmdb.org/t/p/w780${s[0].file_path}`),c||a?{image:c||null,logo:c?null:a}:null}catch{return null}}async function Nf(e,t){try{const i=it(`/api/fanart?type=${t==="tv"?"tv":"movie"}&id=${encodeURIComponent(e)}`),n=await fetch(i,{signal:AbortSignal.timeout(3e3)});if(!n.ok)return null;const r=await n.json();return r.image?{image:r.image,logo:r.logo||null}:null}catch{return null}}async function Tc(e,t="movie"){if(!/^\d+$/.test(String(e)))return null;const i=t==="tv"?"tv":"movie",n=`${i}:${e}`,r=zf(n);if(r!==void 0)return r;const a=(async()=>{const s=Of(e,i),c=Nf(e,i),u=await s;if(u)return zn(n,u),u;const f=await c;return f?(zn(n,f),f):(zn(n,null),null)})();dn.set(n,a);const o=await a;return zn(n,o),o}function Yo(e){Array.isArray(e)&&e.forEach((t,i)=>{if(!t?.id)return;const n=t.media_type==="tv"||t.type==="tv"?"tv":"movie";setTimeout(()=>Tc(t.id,n),i*30)})}const qf=pl||["anime","kimetsu","yaiba","iblis keser","demon slayer","naruto","boruto","shingeki","titan"];function Ff(e){return e?/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(e):!1}function Ss(e){if(!e)return!1;if(e.isAnime===!0||e.type==="anime"||e.media_type==="anime"||e.id&&ze(e.id))return!0;const i=(e.genre_ids||(Array.isArray(e.genres)?e.genres.map(a=>typeof a=="object"?a.id:a):[])).some(a=>Number(a)===16),n=e.original_language==="ja"||Array.isArray(e.origin_country)&&e.origin_country.includes("JP");if(i&&n||i&&(e.origin_country?.includes("JP")||e.original_language==="ja")||e.original_language==="ja"&&(i||Ff(e.original_name||e.original_title||e.title||e.name))||Array.isArray(e.genres)&&e.genres.map(o=>typeof o=="object"?o.name:String(o)).filter(Boolean).some(o=>/anime/i.test(o)))return e.id&&we(e.id),!0;if(typeof e.id=="string"&&(e.id.startsWith("ta_")||e.id.startsWith("acx_")||e.id.startsWith("tra_")))return we(e.id),!0;const r=(e.title||e.name||e.original_title||e.original_name||"").toLowerCase();for(const a of qf)if(r.includes(a))return e.id&&we(e.id),!0;return!1}function Ac(e){return e?e.first_air_date||e.number_of_seasons||e.episodesCount||Array.isArray(e.seasons)&&e.seasons.length>0||e.type==="tv"||e.media_type==="tv"?!0:(e.type==="movie"||e.media_type==="movie"||e.release_date&&!e.first_air_date,!1):!1}function xs(e){return e?e.isAnime||e.type==="anime"||Ss(e)||e.id&&ze(e.id)?"anime":e.type==="documentary"||e.media_type==="documentary"||(e.genre_ids||(Array.isArray(e.genres)?e.genres.map(i=>typeof i=="object"?i.id:i):[])).some(i=>Number(i)===99)?"documentary":e.type==="movie"||e.media_type==="movie"?"movie":e.type==="tv"||e.media_type==="tv"||Ac(e)?"tv":"movie":"movie"}function _t(e,t={}){const i=e.id,n=xs(e),r=!!(e.isAnime||n==="anime"||Ss(e)||e.id&&ze(e.id)),a=!!(e.isSeries!==void 0?e.isSeries:Ac(e)),o=a?"tv":"movie";let s=e.title||e.name||"";(!s||$r(s))&&(s=e.title_en||e.name_en||e.original_name||e.original_title||s||"İsimsiz İçerik");const c=s,u=e.poster_path||e.posterPath||e.poster||"",f=e.backdrop_path||e.backdropPath||e.backdrop||"",h=Xe(u,je.POSTER_MEDIUM),m=f?Xe(f,je.BACKDROP_LARGE):h,w=Rt().cardLayout==="landscape"?m:h;let _=e.vote_average??e.voteAverage??e.rating,p=_?Number(_).toFixed(1):"";p==="0.0"&&(p="");const k=e.release_date||e.first_air_date||(e.year?String(e.year):""),T=k?String(k).substring(0,4):"";let C=e.progressPercent||0,S=e.season||1,$=e.episode||1,L=e.currentTime||0,P=e.completed||!1,B=!1;if(t.isContinueSection||e.currentTime>0&&!P||e.progressPercent>0&&!P)B=!0;else{const O=t.skipProgressLookup?null:Xt(i,S,$);O&&(P=O.completed||!1,!P&&O.duration>0&&O.currentTime>15&&(B=!0,C=Math.min(100,Math.round(O.currentTime/O.duration*100)),L=O.currentTime,a&&(S=O.season||1,$=O.episode||1)))}let z="FİLM",Y="type-movie",K="Film";r?(z=a?"ANİME DİZİSİ":"ANİME FİLMİ",Y="type-anime",K=a?"Anime Dizisi":"Anime Filmi"):n==="tv"||a?(z="DİZİ",Y="type-tv",K="Dizi"):n==="documentary"&&(z="BELGESEL",Y="type-doc",K="Belgesel");const N=e.original_title||e.original_name||"",q=encodeURIComponent(c),j=encodeURIComponent(N),Q=encodeURIComponent(u||""),ie=encodeURIComponent(f||"");return`
    <div class="media-card" 
      data-id="${i}" 
      data-type="${o}" 
      data-isanime="${r?"true":"false"}"
      data-title="${q}" 
      data-originaltitle="${j}"
      data-poster="${Q}"
      data-backdrop="${ie}"
      data-overview="${encodeURIComponent(e.overview||"")}"
      data-year="${T}"
      data-rating="${p}"
      data-tmdbid="${i}"
      data-mediatype="${n==="tv"||a?"tv":"movie"}"
      data-isseries="${a?"true":"false"}"
      data-season="${S}" 
      data-episode="${$}" 
      data-currenttime="${L}"
      data-iscontinue="${B?"true":"false"}"
      tabindex="0"
      role="button"
      aria-label="${c}">
      
      <div class="card-poster-wrapper ${f?"":"card-fanart-portrait-fallback"}">
        <img 
          src="${w}"
          data-poster-src="${h}"
          data-backdrop-src="${m}"
          alt="${c}" 
          class="card-poster-img" 
          loading="lazy" 
          decoding="async"
          onerror="this.onerror=null;this.src='${ht}'"
        />
        <img class="card-fanart-logo" alt="" aria-hidden="true" />
        
        <div class="card-glass-glow"></div>

        <!-- Left Status Pill (Completed / In-Progress with actual progress) -->
        ${P?`
          <div class="card-status-badge card-status-completed" title="Tamamlandı">
            <i data-lucide="check" style="width:10px;height:10px;stroke-width:3;"></i>
            <span>İZLENDİ</span>
          </div>
        `:B&&a&&(L>0||C>0)?`
          <div class="card-status-badge card-status-continue" title="Kaldığın Bölüm">
            <i data-lucide="clock" style="width:10px;height:10px;"></i>
            <span>S${S} B${$}</span>
          </div>
        `:""}

        <!-- Top meta strip: year + rating over poster -->
        ${T||p?`
          <div class="card-top-strip">
            ${T?`<span class="card-top-year">${T}</span>`:"<span></span>"}
            ${p?`<span class="card-top-rating"><i data-lucide="star" style="width:10px;height:10px;fill:#f59e0b;stroke:#f59e0b;"></i>${p}</span>`:""}
          </div>
        `:""}

        <!-- Hover Quick Play Overlay -->
        <div class="card-hover-overlay">
          <div class="card-play-btn-circle">
            <i data-lucide="play" style="width:20px;height:20px;fill:currentColor;margin-left:2px;"></i>
          </div>
          <span class="card-hover-title">${c}</span>
          <span class="card-hover-action-text">${B?"İzlemeye Devam Et":"İncele & Oynat"}</span>
        </div>

        <!-- Bottom Cinematic Gradient Overlay with Title & Meta (Apple TV / Stremio Vurgusu) -->
        <div class="card-bottom-cinematic-overlay">
          <h3 class="card-cinematic-title" title="${c}">${c}</h3>
          <div class="card-cinematic-meta">
            <span class="card-cinematic-type">${K}</span>
            ${T?`<span class="card-cinematic-dot">•</span><span class="card-cinematic-year">${T}</span>`:""}
          </div>
        </div>

        <!-- Progress Bar at bottom if watch in progress -->
        ${C>0&&!P?`
          <div class="card-progress-bar-bg">
            <div class="card-progress-bar-fill" style="width: ${C}%;"></div>
          </div>
        `:""}
      </div>

      <div class="card-info">
        <h3 class="card-title" title="${c}">${c}</h3>
        <div class="card-meta">
          <span class="card-type-tag ${Y}">${z}</span>
          ${T?`<span class="card-year-tag">${T}</span>`:""}
        </div>
      </div>
    </div>
  `}function mt(e){if(!e||e._hasMediaEventsDelegated)return;e._hasMediaEventsDelegated=!0;let t=0;e.addEventListener("click",i=>{if(Date.now()<t){i.preventDefault(),i.stopPropagation();return}if(i.target.closest(".btn-lib-delete")||i.target.closest(".btn-delete-history"))return;const n=i.target.closest(".media-card");if(!n)return;i.preventDefault();const r=n.getAttribute("data-id"),a=n.getAttribute("data-type"),o=n.getAttribute("data-isanime")==="true"||a==="anime"||ze(r),s=parseInt(n.getAttribute("data-season")||"1",10),c=parseInt(n.getAttribute("data-episode")||"1",10),u=parseFloat(n.getAttribute("data-currenttime")||"0"),f=decodeURIComponent(n.getAttribute("data-title")||""),h=decodeURIComponent(n.getAttribute("data-originaltitle")||""),m=n.getAttribute("data-poster")||"",y=n.getAttribute("data-backdrop")||"",g=n.getAttribute("data-iscontinue")==="true",w=n.getAttribute("data-isseries"),_=n.getAttribute("data-mediatype"),p=w!==null?w==="true":_==="tv"||a==="tv";g?ei({type:o?"anime":p?"tv":"movie",isAnime:o,isSeries:p,tmdbId:r,title:p?`${f} - S${s}E${c}`:f,seriesTitle:f,originalTitle:h||f,season:p?s:void 0,episode:p?c:void 0,posterPath:m,backdropPath:y,currentTime:u}):(If(),window.location.hash=`#detail?type=${o?"anime":a}&id=${r}`)})}let Qi=null;function Hf(){return Qi||("IntersectionObserver"in window?(Qi=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&(Qi.unobserve(t.target),Ja(t.target))})},{rootMargin:"150px 0px"}),Qi):null)}async function Ja(e){if(!e||e.dataset.fanartState==="loaded"||e.dataset.fanartState==="loading")return;e.dataset.fanartState="loading";const t=e.querySelector(".card-poster-img");if(t)try{const i=await Tc(e.dataset.tmdbid,e.dataset.mediatype||"movie");if(!e.isConnected)return;if(!i?.image&&!i?.logo){e.dataset.fanartState="empty";return}i.image&&(t.dataset.backdropSrc=i.image,(Rt().cardLayout==="landscape"||document.documentElement.classList.contains("cards-landscape"))&&(t.src=i.image));const n=e.querySelector(".card-fanart-logo");if(n&&i.logo){n.src=i.logo;const r=e.querySelector(".card-poster-wrapper");r?.classList.remove("card-fanart-placeholder"),r?.classList.toggle("card-fanart-composite",!0)}e.dataset.fanartState="loaded"}catch{e.dataset.fanartState="empty"}}function yr(e=document,t=!1){if(!(Rt().cardLayout==="landscape"||document.documentElement.classList.contains("cards-landscape")))return;const r=(e&&e.querySelectorAll?e:document).querySelectorAll('.media-card[data-tmdbid]:not([data-fanart-state="loaded"])');if(!r.length)return;if(t){r.forEach(o=>Ja(o));return}const a=Hf();if(!a){r.forEach(o=>Ja(o));return}r.forEach(o=>a.observe(o))}let Ve=null,Yt=null,Ai=0;const vr=new Map,Za=new Set,Bi=new Map,Uf=10*60*1e3;function jf(){Cf();for(const e of Za)e.disconnect();Za.clear()}function Kf(e){try{const t=sessionStorage.getItem(`cinepulse_home_fast_v7_${e?"kids":"adult"}`);if(!t)return null;const i=JSON.parse(t);return!i?.savedAt||Date.now()-i.savedAt>Uf?null:i.data?.isKid===e?i.data:null}catch{return null}}function Sa(e){try{sessionStorage.setItem(`cinepulse_home_fast_v7_${e.isKid?"kids":"adult"}`,JSON.stringify({savedAt:Date.now(),data:e}))}catch{}}function un(){Ve=null,Yt=null,Ai++;try{sessionStorage.removeItem("cinepulse_home_fast_v2_kids"),sessionStorage.removeItem("cinepulse_home_fast_v2_adult"),sessionStorage.removeItem("cinepulse_home_fast_v3_kids"),sessionStorage.removeItem("cinepulse_home_fast_v3_adult"),sessionStorage.removeItem("cinepulse_home_fast_v4_kids"),sessionStorage.removeItem("cinepulse_home_fast_v4_adult"),sessionStorage.removeItem("cinepulse_home_fast_v5_kids"),sessionStorage.removeItem("cinepulse_home_fast_v5_adult"),sessionStorage.removeItem("cinepulse_home_fast_v6_kids"),sessionStorage.removeItem("cinepulse_home_fast_v6_adult"),sessionStorage.removeItem("cinepulse_home_fast_v7_kids"),sessionStorage.removeItem("cinepulse_home_fast_v7_adult")}catch{}vr.clear(),Bi.clear(),Object.keys(be).forEach(e=>{be[e].page=1,be[e].loading=!1,be[e].exhausted=!1})}const be={"rail-popular-tv":{page:1,loading:!1,exhausted:!1,fetcher:nr},"rail-popular-movies":{page:1,loading:!1,exhausted:!1,fetcher:rr},"rail-top-tv":{page:1,loading:!1,exhausted:!1,fetcher:e=>Ci("tv",e)},"rail-top-movies":{page:1,loading:!1,exhausted:!1,fetcher:e=>Ci("movie",e)},"rail-anime":{page:1,loading:!1,exhausted:!1,fetcher:ar},"rail-adult-animation":{page:1,loading:!1,exhausted:!1,fetcher:Ia},"rail-cartoon-series":{page:1,loading:!1,exhausted:!1,fetcher:ir},"rail-documentary":{page:1,loading:!1,exhausted:!1,fetcher:sr}};function $e({id:e,icon:t,title:i,accent:n,items:r}){if(!r||r.length===0)return"";const a=vr.get(e)||[],c=[...r.slice(0,8),...a].map(u=>_t(u,{skipProgressLookup:!0})).join("");return`
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
          ${c}
          <div class="rail-sentinel" data-rail="${e}"></div>
        </div>
      </div>
    </section>
  `}function Wf(e){return!e||e.length===0?"":`
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
          ${e.slice(0,12).map(n=>`
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
  `}function Go(e){const t=e.querySelectorAll(".rail-sentinel");t.length!==0&&t.forEach(i=>{const n=i.getAttribute("data-rail"),r=document.getElementById(n);if(!r)return;const a=async()=>{const s=be[n];if(!s||s.loading||s.exhausted)return;s.loading=!0;const c=document.createElement("div");c.className="rail-loader",c.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:22px;height:22px;color:var(--text-muted);"></i>',i.before(c),Z(c);try{const u=new Set(Array.from(r.querySelectorAll(".media-card[data-id]")).map(y=>String(y.getAttribute("data-id"))).filter(Boolean));let f=[];const h=Bi.get(n)||[];h.length>0&&(f=h.splice(0,8),Bi.set(n,h));for(let y=0;h.length===0&&y<4&&f.length===0;y+=1){s.page+=1;const g=await s.fetcher(s.page);if(!g||g.length===0){s.exhausted=!0;break}f=g.filter(w=>{const _=String(w?.id||"");return!_||u.has(_)?!1:(u.add(_),!0)})}if(c.remove(),f.length===0||!r.isConnected){s.loading=!1;return}const m=vr.get(n)||[];vr.set(n,[...m,...f]),f.forEach(y=>{const g=document.createElement("div");g.innerHTML=_t(y);const w=g.firstElementChild;w&&(r.insertBefore(w,i),w.addEventListener("click",()=>{const _=w.getAttribute("data-id"),p=w.getAttribute("data-type");window.location.hash=`#detail?type=${p}&id=${_}`}))}),Z(r)}catch{c.remove()}s.loading=!1},o=new IntersectionObserver(s=>{s.forEach(c=>{const u=be[n],f=(Bi.get(n)?.length||0)>0;c.isIntersecting&&(f||u&&!u.exhausted)&&a()})},{root:r,rootMargin:"0px 100px 0px 0px",threshold:0});o.observe(i),Za.add(o)})}async function Yf(){const e=Ai,t=$t();let i,n,r,a,o,s,c,u,f,h,m,y;Ve||(Ve=Kf(t));let g=null,w=!1,_=!1;if(Ve&&Ve.isKid===t)({trending:i,popularTV:n,popularMovies:r,topRatedTV:a,topRatedMovies:o,animeItems:s,docItems:c,kidsAdventures:u,adultAnimationItems:f,cartoonSeriesItems:h,kidsAnimationItems:m,kidsClassicCartoonItems:y}=Ve),g=Yt,w=!g;else if(t){if(g=Promise.all([Js(1),Pa(1),Gs(1),Vs(1)]).then(B=>{e===Ai&&([u,s,m,y]=B,Ve={isKid:!0,trending:i,popularTV:n,popularMovies:r,kidsAdventures:u,animeItems:s,kidsAnimationItems:m,kidsClassicCartoonItems:y},_&&Sa(Ve),w=!0)}).catch(()=>{w=!0}),Yt=g,g.then(()=>{Yt===g&&(Yt=null)}),[n,r]=await Promise.all([Ra(1),Ma(1)]),i=[...r||[],...n||[]].filter(B=>B.backdrop_path&&Qt(B)).slice(0,10),e!==Ai)return null;w||(Ve={isKid:!0,trending:i,popularTV:n,popularMovies:r})}else{if(g=Promise.all([Ci("tv",1),Ci("movie",1),ar(1),sr(1),Ia(1),ir(1)]).then(B=>{e===Ai&&([a,o,s,c,f,h]=B,Ve={isKid:!1,trending:i,popularTV:n,popularMovies:r,topRatedTV:a,topRatedMovies:o,animeItems:s,docItems:c,adultAnimationItems:f,cartoonSeriesItems:h},_&&Sa(Ve),w=!0)}).catch(()=>{w=!0}),Yt=g,g.then(()=>{Yt===g&&(Yt=null)}),[i,n,r]=await Promise.all([Sl("all","week",1),nr(1),rr(1)]),e!==Ai)return null;w||(Ve={isKid:!1,trending:i,popularTV:n,popularMovies:r})}_=!0,w&&Ve&&Sa(Ve);const p=w,k=js(),T=Os(k);let C;t?C=[...r||[],...n||[]].filter(z=>z.backdrop_path&&Qt(z)).slice(0,10):C=i;const S=t?{"rail-kids-movies":r,"rail-kids-animation":m,"rail-kids-classics":y,"rail-kids-adventures":u,"rail-anime":s}:{"rail-popular-tv":n,"rail-adult-animation":f,"rail-cartoon-series":h,"rail-popular-movies":r,"rail-top-movies":o,"rail-top-tv":a,"rail-anime":s,"rail-documentary":c};for(const[B,z]of Object.entries(S)){const Y=(z||[]).slice(8);Y.length?Bi.set(B,Y):Bi.delete(B)}const $=Lf(C);t?(be["rail-kids-animation"]||(be["rail-kids-animation"]={page:1,loading:!1,exhausted:!1,fetcher:Gs}),be["rail-kids-classics"]||(be["rail-kids-classics"]={page:1,loading:!1,exhausted:!1,fetcher:Vs}),be["rail-kids-movies"]||(be["rail-kids-movies"]={page:1,loading:!1,exhausted:!1,fetcher:Ma}),be["rail-kids-adventures"]||(be["rail-kids-adventures"]={page:1,loading:!1,exhausted:!1,fetcher:Js}),be["rail-anime"]||(be["rail-anime"]={page:1,loading:!1,exhausted:!1,fetcher:Pa})):(be["rail-popular-tv"]||(be["rail-popular-tv"]={page:1,loading:!1,exhausted:!1,fetcher:nr}),be["rail-popular-movies"]||(be["rail-popular-movies"]={page:1,loading:!1,exhausted:!1,fetcher:rr}),be["rail-top-tv"]||(be["rail-top-tv"]={page:1,loading:!1,exhausted:!1,fetcher:B=>Ci("tv",B)}),be["rail-top-movies"]||(be["rail-top-movies"]={page:1,loading:!1,exhausted:!1,fetcher:B=>Ci("movie",B)}),be["rail-anime"]||(be["rail-anime"]={page:1,loading:!1,exhausted:!1,fetcher:ar}),be["rail-adult-animation"]||(be["rail-adult-animation"]={page:1,loading:!1,exhausted:!1,fetcher:Ia}),be["rail-cartoon-series"]||(be["rail-cartoon-series"]={page:1,loading:!1,exhausted:!1,fetcher:ir})),t||be["rail-documentary"]||(be["rail-documentary"]={page:1,loading:!1,exhausted:!1,fetcher:sr}),Object.values(be).forEach(B=>{B.loading=!1});let L="";return t?L=`
      ${$e({id:"rail-kids-movies",icon:"sparkles",title:"  En Çok Sevilen Animasyon & Çocuk Filmleri",accent:"#ec4899",items:r})}

      ${m&&m.length>0?$e({id:"rail-kids-animation",icon:"sparkles",title:"Çocuk Animasyonları & Yeni Çizgi Diziler",accent:"#fb7185",items:m}):""}

      ${y&&y.length>0?$e({id:"rail-kids-classics",icon:"palette",title:"Çizgi Dizi Dünyası & Unutulmaz Klasikler",accent:"#38bdf8",items:y}):""}

      ${u&&u.length>0?$e({id:"rail-kids-adventures",icon:"compass",title:"  Aile ve Fantastik Sinema Kuşağı",accent:"#38bdf8",items:u}):""}

      ${s&&s.length>0?$e({id:"rail-anime",icon:"smile",title:"  Çocuk & Genç Anime Dünyası",accent:"#a855f7",items:s}):""}
    `:L=`
      ${$e({id:"rail-popular-tv",icon:"tv-2",title:"Trend Diziler & Yapımlar",accent:"#14b8a6",items:n})}

      ${f&&f.length>0?$e({id:"rail-adult-animation",icon:"sparkles",title:"Yetişkin Animasyonları & Çizgi Diziler",accent:"#fb7185",items:f}):""}

      ${h&&h.length>0?$e({id:"rail-cartoon-series",icon:"wand-2",title:"Çizgi Dizi Dünyası & Unutulmaz Klasikler",accent:"#38bdf8",items:h}):""}

      ${$e({id:"rail-popular-movies",icon:"clapperboard",title:"Tüm Zamanların En Popüler Filmleri",accent:"#a78bfa",items:r})}

      ${$e({id:"rail-top-movies",icon:"award",title:"  Sinema Tarihinin Başyapıtları (IMDb 8.5+)",accent:"#fbbf24",items:o})}

      ${$e({id:"rail-top-tv",icon:"star",title:"Kült & En Yüksek Puanlı Diziler",accent:"#34d399",items:a})}

      ${s&&s.length>0?$e({id:"rail-anime",icon:"sparkles",title:"  Popüler Anime Evreni (TR Dublaj & Altyazı)",accent:"#ec4899",items:s}):""}

      ${c&&c.length>0?$e({id:"rail-documentary",icon:"globe",title:"  İlham Veren Kült Belgeseller",accent:"#38bdf8",items:c}):""}
    `,{html:`
    <div class="home-view ${t?"is-kids-mode":""}">
      ${$}

      ${Wf(T)}

      ${L}
    </div>
  `,init:B=>{const z=C&&C.length>0?C:i;z&&z.length>0&&$f(z),mt(B);const Y=N=>{N.querySelectorAll(".card-rail").forEach(q=>{const j=q.id;if(j){let Q=mr.get(j);if(typeof Q!="number")try{const ie=sessionStorage.getItem(`cinepulse_rail_${j}`);ie&&(Q=parseFloat(ie))}catch{}typeof Q=="number"&&Q>0&&(q.scrollLeft=Q,requestAnimationFrame(()=>{q.scrollLeft=Q})),q.addEventListener("scroll",()=>{mr.set(j,q.scrollLeft)},{passive:!0})}q.addEventListener("wheel",Q=>{Math.abs(Q.deltaX)>Math.abs(Q.deltaY)||(Q.preventDefault(),q.scrollLeft+=Q.deltaY)},{passive:!1})})};if(Y(B),B.querySelectorAll(".spotlight-hero, .spotlight-mini").forEach(N=>{N.addEventListener("click",()=>{const q=N.getAttribute("data-id"),j=N.getAttribute("data-type");q&&j&&(window.location.hash=`#detail?type=${j}&id=${q}`)})}),B.querySelector(".spotlight-hero-btn")?.addEventListener("click",N=>{N.stopPropagation();const q=B.querySelector(".spotlight-hero");if(q){const j=q.getAttribute("data-id"),Q=q.getAttribute("data-type");window.location.hash=`#detail?type=${Q}&id=${j}`}}),Go(B),g&&!p){const N=B.querySelector(".home-view");g.then(()=>{if({topRatedTV:a,topRatedMovies:o,animeItems:s,docItems:c,kidsAdventures:u,adultAnimationItems:f,cartoonSeriesItems:h,kidsAnimationItems:m,kidsClassicCartoonItems:y}=Ve||{},!N?.isConnected||!(window.location.hash||"#home").startsWith("#home"))return;const q=document.createElement("div");q.className="home-more-rails",q.innerHTML=t?`
            ${$e({id:"rail-kids-animation",icon:"sparkles",title:"Çocuk Animasyonları & Yeni Çizgi Diziler",accent:"#fb7185",items:m})}
            ${$e({id:"rail-kids-classics",icon:"palette",title:"Çizgi Dizi Dünyası & Unutulmaz Klasikler",accent:"#38bdf8",items:y})}
            ${$e({id:"rail-kids-adventures",icon:"compass",title:"  Aile ve Fantastik Sinema Kuşağı",accent:"#38bdf8",items:u})}
            ${$e({id:"rail-anime",icon:"smile",title:"  Çocuk & Genç Anime Dünyası",accent:"#a855f7",items:s})}
          `:`
            ${$e({id:"rail-adult-animation",icon:"sparkles",title:"Yetişkin Animasyonları & Çizgi Diziler",accent:"#fb7185",items:f})}
            ${$e({id:"rail-cartoon-series",icon:"wand-2",title:"Çizgi Dizi Dünyası & Unutulmaz Klasikler",accent:"#38bdf8",items:h})}
            ${$e({id:"rail-top-movies",icon:"award",title:"  Sinema Tarihinin Başyapıtları (IMDb 8.5+)",accent:"#fbbf24",items:o})}
            ${$e({id:"rail-top-tv",icon:"star",title:"Kült & En Yüksek Puanlı Diziler",accent:"#34d399",items:a})}
            ${$e({id:"rail-anime",icon:"sparkles",title:"  Popüler Anime Evreni (TR Dublaj & Altyazı)",accent:"#ec4899",items:s})}
            ${$e({id:"rail-documentary",icon:"globe",title:"  İlham Veren Kült Belgeseller",accent:"#38bdf8",items:c})}
          `,N.append(q),Z(q),mt(q),Y(q),Go(q)})}B.querySelectorAll(".btn-delete-history").forEach(N=>{N.addEventListener("click",q=>{q.stopPropagation();const j=N.closest(".continue-card-wrapper");if(!j)return;const Q=j.getAttribute("data-id");Ca(Q),X("İçerik izleme geçmişinden kaldırıldı.","info"),j.style.transition="all 0.28s ease-out",j.style.transform="scale(0.85)",j.style.opacity="0",setTimeout(()=>{j.remove();const ie=B.querySelector("#continue-watching-rail");ie&&ie.children.length===0&&ie.closest(".rail-section")?.remove()},300)})});const K=()=>{if(!(window.location.hash||"#home").startsWith("#home"))return;const N=B.querySelector(".home-view");if(!N?.isConnected)return;const q=Os(js()),j=B.querySelector("#continue-watching-rail")?.closest(".rail-section");if(q&&q.length>0){const ie=q.slice(0,24).map(ne=>`
            <div class="continue-card-wrapper" data-id="${ne.id}" data-season="${ne.season||1}" data-episode="${ne.episode||1}">
              ${_t(ne,{isContinueSection:!0})}
              <button class="btn-delete-history" title="Geçmişten Kaldır" aria-label="Kaldır">
                <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
              </button>
            </div>
          `).join("");if(j){const ne=j.querySelector("#continue-watching-rail");ne&&(ne.innerHTML=ie)}else{const ne=`
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
            `,O=N.querySelector(".hero-slider-section")||N.querySelector(".rail-section");O?O.insertAdjacentHTML("afterend",ne):N.insertAdjacentHTML("afterbegin",ne)}Z(B),mt(B),B.querySelectorAll(".btn-delete-history").forEach(ne=>{ne.addEventListener("click",O=>{O.stopPropagation();const se=ne.closest(".continue-card-wrapper");if(!se)return;const V=se.getAttribute("data-id");Ca(V),X("İçerik izleme geçmişinden kaldırıldı.","info"),se.style.transition="all 0.28s ease-out",se.style.transform="scale(0.85)",se.style.opacity="0",setTimeout(()=>{se.remove();const W=B.querySelector("#continue-watching-rail");W&&W.children.length===0&&W.closest(".rail-section")?.remove()},300)})})}else j&&j.remove()};window.addEventListener("cinepulse_data_changed",K),window.addEventListener("sineflix_data_changed",K)}}}async function Gf({tvId:e,seriesTitle:t,originalTitle:i="",seriesOverview:n="",seasons:r=[],posterPath:a="",backdropPath:o="",isAnime:s=!1,spoilerFree:c=!1}){const u=r.filter(_=>_.season_number>0);u.length===0&&r.length>0&&u.push(r[0]);const f=u.length>0?u[0].season_number:1,h=u.length>0&&u[0].episode_count||10,m=Xr(e,f,h);let y=!!c,g=null;return{html:`
    <div class="season-selector-wrapper">
      <div class="season-selector-header">
        <div style="display: flex; align-items: center; gap: 0.65rem;">
          <span class="rail-icon-pill" style="--rail-color: #f59e0b; width: 28px; height: 28px;">
            <i data-lucide="layers" style="width: 15px; height: 15px;"></i>
          </span>
          <h2 class="season-selector-title" style="margin: 0;">Sezonlar ve Bölümler</h2>
        </div>

        <!-- Bulk Mark Current Season Watched Button -->
        <button id="btn-mark-season-all" class="btn-secondary" style="padding: 0.45rem 1.1rem; font-size: 0.82rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.45rem; cursor: pointer; ${m?"background: rgba(16, 185, 129, 0.2); border-color: #10b981; color: #10b981;":""}">
          <i data-lucide="${m?"check-circle-2":"check-check"}" style="width: 14px; height: 14px;"></i>
          <span>${m?"Bu Sezon İzlendi":"Bu Sezonu İzlendi İşaretle"}</span>
        </button>
      </div>

      <!-- Luxury Segmented Season Pills Track with PC Arrows & Scroll Support -->
      <div class="season-tabs-wrapper" style="position: relative; display: flex; align-items: center; margin-bottom: 1.5rem; width: 100%;">
        <button class="season-nav-arrow left" id="btn-season-prev" title="Önceki Sezonlar" aria-label="Geri">
          <i data-lucide="chevron-left" style="width:16px;height:16px;"></i>
        </button>
        <div class="season-pills-track" id="season-tabs-bar">
          ${u.map(_=>`
            <button class="season-pill ${_.season_number===f?"active":""}" data-season="${_.season_number}" data-ep-count="${_.episode_count||10}">
              ${_.name||`${_.season_number}. Sezon`} <span style="opacity: 0.75; font-size: 0.72rem; margin-left: 0.2rem;">(${_.episode_count} Bölüm)</span>
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
  `,init:_=>{if(!_)return;let p=f,k=h;const T=()=>{const z=_.querySelector("#btn-mark-season-all");if(!z)return;const Y=Xr(e,p,k),K=z.querySelector("span"),N=z.querySelector("i");K&&(K.textContent=Y?"Bu Sezon İzlendi":"Bu Sezonu İzlendi İşaretle"),N&&N.setAttribute("data-lucide",Y?"check-circle-2":"check-check"),Y?(z.style.background="rgba(16, 185, 129, 0.2)",z.style.borderColor="#10b981",z.style.color="#10b981"):(z.style.background="",z.style.borderColor="",z.style.color=""),Z()};Vn(e,t,n,p,_,a,o,i,u,T,s,y);const C=z=>{if(z&&z.detail&&z.detail.isProgressUpdate&&document.getElementById("player-modal"))return;const Y=_.querySelector("#episode-grid-container");Y&&(Y.querySelectorAll(".episode-card").forEach(K=>{const N=parseInt(K.getAttribute("data-season"),10),q=parseInt(K.getAttribute("data-episode"),10),j=Xt(e,N,q),Q=j?j.progressPercent:0,ie=j?j.completed||Q>=90:!1,ne=j&&!ie&&j.currentTime>0,O=K.querySelector(".badge-watched-status"),se=K.querySelector(".btn-mark-ep-watched"),V=K.querySelector(".card-progress-fill"),W=K.querySelector(".btn-mark-ep-halfway");O&&(ie?(O.innerHTML='<i data-lucide="check" style="width:10px; height:10px"></i> İZLENDİ',O.style.background="var(--accent-green)",O.style.color="#fff",O.style.fontSize="0.68rem",O.style.fontWeight="800",O.style.padding="0.2rem 0.45rem",O.style.borderRadius="4px",O.style.whiteSpace="nowrap",O.style.display="inline-flex"):ne?(O.innerHTML='<i data-lucide="clock" style="width:10px; height:10px"></i> YARIDA',O.style.background="#f59e0b",O.style.color="#000",O.style.fontSize="0.68rem",O.style.fontWeight="850",O.style.padding="0.2rem 0.45rem",O.style.borderRadius="4px",O.style.whiteSpace="nowrap",O.style.display="inline-flex"):O.style.display="none"),se&&(ie?(se.classList.add("watched"),se.style.background="#10b981",se.style.borderColor="#10b981",se.title="İzlendi işaretini kaldır"):(se.classList.remove("watched"),se.style.background="rgba(0,0,0,0.65)",se.style.borderColor="rgba(255,255,255,0.3)",se.title="İzlendi olarak işaretle")),W&&(W.style.background=ne?"#f59e0b":"rgba(0,0,0,0.65)",W.style.borderColor=ne?"#f59e0b":"rgba(255,255,255,0.3)"),V&&(V.style.width=`${Q}%`,V.style.background=ie?"var(--accent-green)":"#fbbf24")}),Z()),T()};window.addEventListener("sineflix_data_changed",C),_.querySelectorAll(".season-pill").forEach(z=>{z.addEventListener("click",Y=>{Y.preventDefault(),_.querySelectorAll(".season-pill").forEach(K=>K.classList.remove("active")),z.classList.add("active"),z.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"}),p=parseInt(z.getAttribute("data-season"),10),k=parseInt(z.getAttribute("data-ep-count"),10)||10,Vn(e,t,n,p,_,a,o,i,u,T,s,y),T()})});const S=_.querySelector(".season-pill.active");S&&setTimeout(()=>{S.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})},120);const $=_.querySelector("#season-tabs-bar"),L=_.querySelector("#btn-season-prev"),P=_.querySelector("#btn-season-next");if($){L?.addEventListener("click",q=>{q.preventDefault(),$.scrollBy({left:-260,behavior:"smooth"})}),P?.addEventListener("click",q=>{q.preventDefault(),$.scrollBy({left:260,behavior:"smooth"})}),$.addEventListener("wheel",q=>{q.deltaY!==0&&$.scrollWidth>$.clientWidth&&(q.preventDefault(),$.scrollLeft+=q.deltaY)},{passive:!1});let z=!1,Y=0,K=0,N=!1;$.addEventListener("mousedown",q=>{q.button===0&&(z=!0,N=!1,$.classList.add("dragging"),Y=q.pageX-$.offsetLeft,K=$.scrollLeft)}),window.addEventListener("mousemove",q=>{if(!z)return;const Q=(q.pageX-$.offsetLeft-Y)*1.5;Math.abs(Q)>4&&(N=!0),$.scrollLeft=K-Q}),window.addEventListener("mouseup",()=>{z&&(z=!1,$.classList.remove("dragging"),setTimeout(()=>{N=!1},50))}),$.addEventListener("click",q=>{N&&(q.preventDefault(),q.stopPropagation())},!0)}const B=_.querySelector("#btn-mark-season-all");B&&B.addEventListener("click",z=>{z.preventDefault();const K=!Xr(e,p,k);fd(e,p,k,K,{title:t,posterPath:a,backdropPath:o,type:s?"anime":"tv",isAnime:s}),X(K?`${p}. Sezonun tüm bölümleri izlendi!`:`${p}. Sezon izlenmedi olarak işaretlendi.`,K?"success":"info");const N=_.querySelector("#episode-grid-container");N&&(N.querySelectorAll(".episode-card").forEach(q=>{const j=q.querySelector(".badge-watched-status"),Q=q.querySelector(".btn-mark-ep-watched");j&&(j.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',j.style.background="var(--accent-green)",j.style.color="#fff",j.style.display=K?"inline-flex":"none"),Q&&(K?(Q.classList.add("watched"),Q.style.background="#10b981",Q.style.borderColor="#10b981",Q.title="İzlendi işaretini kaldır"):(Q.classList.remove("watched"),Q.style.background="rgba(0,0,0,0.65)",Q.style.borderColor="rgba(255,255,255,0.3)",Q.title="İzlendi olarak işaretle"))}),Z()),T()}),g=z=>{y=!!z,Vn(e,t,n,p,_,a,o,i,u,T,s,y)}},setSpoilerSafe(_){y=!!_,g?.(y)}}}function Vf(e){const t=Re().filter(i=>String(i?.id)===String(e)&&(Number(i.currentTime)>0||i.completed||Number(i.progressPercent)>0));return t.length?t.reduce((i,n)=>{const r={season:Math.max(1,Number(n.season)||1),episode:Math.max(1,Number(n.episode)||1)};return r.season>i.season||r.season===i.season&&r.episode>i.episode?r:i},{season:1,episode:1}):{season:1,episode:1}}async function Vn(e,t,i,n,r,a="",o="",s="",c=[],u=null,f=!1,h=!1){const m=r.querySelector("#episode-grid-container");if(!m)return;m.innerHTML=`<div style="padding: 3rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;"><i data-lucide="loader-2" class="spin-loader" style="width: 24px; height: 24px; margin-bottom: 0.5rem;"></i><div>${n}. Sezon bölümleri getiriliyor...</div></div>`,Z();let y=null;try{y=await Od(e,n)}catch{}if(!y||!y.episodes||y.episodes.length===0){m.innerHTML=`
      <div style="padding: 3rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;">
        <p style="margin-bottom: 0.75rem;">Bu sezon için bölüm verisi getirilemedi.</p>
        <button id="btn-retry-season-episodes" class="btn-secondary" style="padding: 0.45rem 1rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
          <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
          <span>Tekrar Dene</span>
        </button>
      </div>
    `,Z(),r.querySelector("#btn-retry-season-episodes")?.addEventListener("click",()=>{Vn(e,t,i,n,r,a,o,s,c,u,f,h)});return}const g=h?Vf(e):null,w=h?y.episodes.filter(p=>n<g.season||n===g.season&&Number(p.episode_number)<=g.episode+1):y.episodes;if(h&&w.length===0){m.innerHTML='<div class="spoiler-safe-locked"><i data-lucide="shield-check"></i><strong>Bu sezon spoiler korumasında</strong><span>Önceki sezona ilerledikçe bölüm detayları burada açılır.</span></div>',Z();return}const _=h?`<div class="spoiler-safe-notice"><i data-lucide="shield-check"></i><span>Spoilersız keşif açık · S${g.season} B${g.episode+1} sonrasının detayları gizli.</span></div>`:"";m.innerHTML=_+w.map(p=>{const k=p.episode_number;let T=(p.name||"").trim();T=T.replace(new RegExp(`^(?:${k}\\s*[\\.\\:\\-]\\s*)+(?:Bölüm\\s*[\\:\\-]\\s*)?`,"i"),""),T=T.replace(new RegExp(`^Bölüm\\s*${k}\\s*[\\:\\-]\\s*`,"i"),""),T=T.trim();const C=T?`${k}. Bölüm: ${T}`:`${k}. Bölüm`;let S=p.overview?p.overview.trim():"";(!S||S.length<5)&&(i&&i.length>10?S=`${k}. Bölüm: ${i}`:S=`${t} ${n}. Sezon ${k}. Bölüm Türkçe Dublaj ve Altyazılı yüksek kalitede kesintisiz HD izle.`);const $=S.length>90,L=Xe(p.still_path,je.STILL_MEDIUM),P=p.air_date||"",B=p.runtime?`${p.runtime} dk`:"",z=Xt(e,n,k),Y=z?z.progressPercent:0,K=z?z.completed||Y>=90:!1,N=z&&!K&&z.currentTime>0,q=Y>0?`
      <div class="card-progress-bar">
        <div class="card-progress-fill" style="width: ${Y}%; background: ${K?"var(--accent-green)":"#fbbf24"};"></div>
      </div>
    `:"";let j="";return K?j=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.4rem; left: 0.4rem; background: var(--accent-green); color: #fff; z-index: 4; font-size: 0.68rem; font-weight: 800; padding: 0.2rem 0.45rem; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px; line-height: 1; white-space: nowrap;">
          <i data-lucide="check" style="width:10px; height:10px"></i> İZLENDİ
        </span>
      `:N?j=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.4rem; left: 0.4rem; background: #f59e0b; color: #000; font-weight: 850; z-index: 4; font-size: 0.68rem; padding: 0.2rem 0.45rem; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px; line-height: 1; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.5);">
          <i data-lucide="clock" style="width:10px; height:10px"></i> YARIDA
        </span>
      `:j=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.4rem; left: 0.4rem; background: var(--accent-green); color: #fff; display: none; z-index: 4; font-size: 0.68rem; font-weight: 800; padding: 0.2rem 0.45rem; border-radius: 4px; line-height: 1; white-space: nowrap;">
          <i data-lucide="check" style="width:10px; height:10px"></i> İZLENDİ
        </span>
      `,`
      <div class="episode-card" data-tv-id="${e}" data-season="${n}" data-episode="${k}" data-title="${C}">
        <div class="episode-thumb-wrap">
          <img src="${L}" alt="${C}" loading="lazy" onerror="this.onerror=null; this.src='${ht}';" />
          <span class="episode-number-chip">${n}x${k<10?"0"+k:k}</span>
          ${j}
          
          <div class="episode-play-overlay">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--primary-gradient); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.6);">
              <i data-lucide="play" style="width: 20px; height: 20px; fill: #fff; color: #fff; margin-left: 2px;"></i>
            </div>
          </div>

          <!-- Top Right Action Controls: Mark Watched & Halfway -->
          <div style="position: absolute; top: 0.5rem; right: 0.5rem; display: flex; gap: 0.35rem; z-index: 5;">
            <button class="btn-mark-ep-halfway" data-tv-id="${e}" data-season="${n}" data-episode="${k}" title="Yarıda Bırakıldı (20. dk)" style="width: 28px; height: 28px; border-radius: 50%; background: ${N?"#f59e0b":"rgba(0,0,0,0.65)"}; border: 1px solid ${N?"#f59e0b":"rgba(255,255,255,0.3)"}; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
              <i data-lucide="clock" style="width: 13px; height: 13px;"></i>
            </button>

            <button class="btn-mark-ep-watched ${K?"watched":""}" data-tv-id="${e}" data-season="${n}" data-episode="${k}" title="${K?"İzlendi işaretini kaldır":"İzlendi olarak işaretle"}" style="width: 28px; height: 28px; border-radius: 50%; background: ${K?"#10b981":"rgba(0,0,0,0.65)"}; border: 1px solid ${K?"#10b981":"rgba(255,255,255,0.3)"}; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
              <i data-lucide="check" style="width: 14px; height: 14px;"></i>
            </button>
          </div>

          ${q}
        </div>

        <div class="episode-info">
          <div class="episode-header-row">
            <span class="episode-title" title="${C}">${C}</span>
            <span class="episode-duration">${B||P}</span>
          </div>
          
          <div class="episode-overview-container">
            <div class="episode-overview ${$?"truncated":""}" data-full="${S}">
              ${S}
            </div>
            ${$?`
              <button class="btn-toggle-overview" style="color: var(--primary); font-weight: 700; font-size: 0.78rem; margin-top: 0.25rem; display: inline-flex; align-items: center; gap: 0.2rem; cursor: pointer; background: none; border: none; padding: 0;">
                <span>Devamını Oku</span>
                <i data-lucide="chevron-down" style="width: 12px; height: 12px;"></i>
              </button>
            `:""}
          </div>

          <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: auto; padding-top: 0.45rem; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06);">
            <span>${P}</span>
            <span class="btn-play-episode-trigger" style="color: var(--primary); font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.25rem;">
              <span>Oynat</span>
              <i data-lucide="play" style="width: 11px; height: 11px; fill: currentColor;"></i>
            </span>
          </div>
        </div>
      </div>
    `}).join(""),Z(),r.querySelectorAll(".btn-toggle-overview").forEach(p=>{p.addEventListener("click",k=>{k.preventDefault(),k.stopPropagation();const T=p.closest(".episode-overview-container"),C=T?T.querySelector(".episode-overview"):null;if(!C)return;const S=p.querySelector("span"),$=p.querySelector("i");C.classList.contains("truncated")?(C.classList.remove("truncated"),S&&(S.textContent="Daralt"),$&&$.setAttribute("data-lucide","chevron-up")):(C.classList.add("truncated"),S&&(S.textContent="Devamını Oku"),$&&$.setAttribute("data-lucide","chevron-down")),Z()})}),m.querySelectorAll(".btn-mark-ep-watched").forEach(p=>{p.addEventListener("click",k=>{k.preventDefault(),k.stopPropagation();const T=parseInt(p.getAttribute("data-season"),10),C=parseInt(p.getAttribute("data-episode"),10),S=p.closest(".episode-card"),L=ml(e,T,C,{title:t,posterPath:a,backdropPath:o,type:f?"anime":"tv",isAnime:f}).completed;if(X(L?`S${T} B${C} izlendi olarak işaretlendi!`:`S${T} B${C} izlendi işareti kaldırıldı.`,L?"success":"info"),L?(p.classList.add("watched"),p.style.background="#10b981",p.style.borderColor="#10b981",p.title="İzlendi işaretini kaldır"):(p.classList.remove("watched"),p.style.background="rgba(0,0,0,0.65)",p.style.borderColor="rgba(255,255,255,0.3)",p.title="İzlendi olarak işaretle"),S){const P=S.querySelector(".badge-watched-status");P&&(P.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',P.style.background="var(--accent-green)",P.style.color="#fff",P.style.display=L?"inline-flex":"none")}typeof u=="function"&&u(),Z()})}),m.querySelectorAll(".btn-mark-ep-halfway").forEach(p=>{p.addEventListener("click",k=>{k.preventDefault(),k.stopPropagation();const T=parseInt(p.getAttribute("data-season"),10),C=parseInt(p.getAttribute("data-episode"),10),S=p.closest(".episode-card");if(La(e,T,C,1200,{title:t,posterPath:a,backdropPath:o,type:f?"anime":"tv",isAnime:f,duration:2700}),p.style.background="#f59e0b",p.style.borderColor="#f59e0b",S){const $=S.querySelector(".badge-watched-status");$&&($.innerHTML='<i data-lucide="clock" style="width:10px; height:10px"></i> YARIDA',$.style.background="#f59e0b",$.style.color="#000",$.style.fontWeight="850",$.style.padding="0.2rem 0.45rem",$.style.borderRadius="4px",$.style.fontSize="0.68rem",$.style.whiteSpace="nowrap",$.style.display="inline-flex")}X(`S${T} B${C} 20. dakikada yarıda bırakıldı olarak işaretlendi!`,"info"),Z()})}),m.querySelectorAll(".episode-card").forEach(p=>{const k=S=>{if(S&&S.target&&(S.target.closest(".btn-mark-ep-watched")||S.target.closest(".btn-mark-ep-halfway")||S.target.closest(".btn-toggle-overview")))return;S&&(S.preventDefault(),S.stopPropagation());const $=parseInt(p.getAttribute("data-season"),10),L=parseInt(p.getAttribute("data-episode"),10),P=p.getAttribute("data-title"),B=Xt(e,$,L),z=B?B.currentTime:0;ei({type:f?"anime":"tv",isAnime:f,tmdbId:e,title:`${t} - S${$}E${L}: ${P}`,seriesTitle:t,originalTitle:s||t,season:$,episode:L,posterPath:a,backdropPath:o,currentTime:z,seasonsList:c,maxEpisodes:y.episodes?y.episodes.length:0})};p.addEventListener("click",k);const T=p.querySelector(".episode-thumb-wrap");T&&T.addEventListener("click",k);const C=p.querySelector(".btn-play-episode-trigger");C&&C.addEventListener("click",k)})}let Jn=null;async function Jf(e,t="",i=""){xi();const n=document.createElement("div");n.id="cast-explorer-modal-root",n.className="cast-explorer-backdrop",document.body.appendChild(n),Jn=n,n.innerHTML=`
    <div class="cast-explorer-dialog">
      <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
      </button>
      <div class="cast-explorer-loading">
        <div class="cast-explorer-spinner"></div>
        <span>${t||"Oyuncu"} bilgileri ve filmografisi yükleniyor...</span>
      </div>
    </div>
  `,Z(n);const r=n.querySelector("#btn-close-cast-explorer");r&&(r.onclick=()=>xi()),n.onclick=L=>{L.target===n&&xi()};const a=L=>{L.key==="Escape"&&(xi(),window.removeEventListener("keydown",a))};window.addEventListener("keydown",a);const o=await Nd(e);if(!o){n.innerHTML=`
      <div class="cast-explorer-dialog">
        <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
          <i data-lucide="x" style="width: 20px; height: 20px;"></i>
        </button>
        <div class="cast-explorer-loading">
          <i data-lucide="alert-circle" style="width: 36px; height: 36px; color: #ef4444;"></i>
          <span>Oyuncu bilgileri alınamadı.</span>
        </div>
      </div>
    `,Z(n);return}const s=o.name||t,c=o.profile_path?Xe(o.profile_path,je.POSTER_MEDIUM):i||tr,u=o.birthday?o.birthday.substring(0,4):"",f=o.place_of_birth||"",h=o.known_for_department==="Acting"?"Oyuncu":o.known_for_department==="Directing"?"Yönetmen":o.known_for_department||"Sanatçı",m=o.biography&&o.biography.trim().length>20?o.biography:`${s}, sinema ve televizyon dünyasında yer aldığı yapımlarla tanınan başarılı bir sanatçıdır.`,y=o.combined_credits?.cast||[],g=o.combined_credits?.crew||[],w=[...y,...g],_=new Set,p=[];for(const L of w){if(!L||!L.id)continue;const P=`${L.media_type||"movie"}_${L.id}`;_.has(P)||(_.add(P),L.poster_path&&p.push(L))}p.sort((L,P)=>(P.popularity||0)-(L.popularity||0));const k=p.filter(L=>L.media_type==="movie"||!L.media_type&&L.title).length,T=p.filter(L=>L.media_type==="tv"||!L.media_type&&L.name).length;n.innerHTML=`
    <div class="cast-explorer-dialog">
      <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
      </button>

      <!-- Actor Hero Header -->
      <div class="cast-explorer-header">
        <div class="cast-explorer-avatar-box">
          <img src="${c}" alt="${s}" class="cast-explorer-avatar" onerror="this.onerror=null; this.src='${tr}';" />
        </div>
        <div class="cast-explorer-bio-box">
          <div class="cast-explorer-name-row">
            <h2>${s}</h2>
            <span class="cast-explorer-dept-tag">${h}</span>
          </div>
          <div class="cast-explorer-meta-row">
            ${u?`<span><i data-lucide="calendar" style="width:13px;height:13px;"></i> D: ${u}</span>`:""}
            ${f?`<span><i data-lucide="map-pin" style="width:13px;height:13px;"></i> ${f}</span>`:""}
            <span><i data-lucide="film" style="width:13px;height:13px;"></i> ${p.length} Yapım</span>
          </div>
          <p class="cast-explorer-bio-text">${m}</p>
        </div>
      </div>

      <!-- Filmography Tabs -->
      <div class="cast-explorer-tabs">
        <button class="cast-tab-btn active" data-filter="all">Tümü (${p.length})</button>
        <button class="cast-tab-btn" data-filter="movie">Filmler (${k})</button>
        <button class="cast-tab-btn" data-filter="tv">Diziler (${T})</button>
      </div>

      <!-- Media Cards Grid -->
      <div class="cast-explorer-grid" id="cast-explorer-grid">
        ${p.map(L=>_t(L)).join("")}
      </div>
    </div>
  `,Z(n);const C=n.querySelector("#btn-close-cast-explorer");C&&(C.onclick=()=>xi());const S=n.querySelector("#cast-explorer-grid");S&&(mt(S),S.addEventListener("click",()=>{setTimeout(()=>xi(),150)}));const $=n.querySelectorAll(".cast-tab-btn");$.forEach(L=>{L.onclick=()=>{$.forEach(z=>z.classList.remove("active")),L.classList.add("active");const P=L.getAttribute("data-filter");let B=p;P==="movie"?B=p.filter(z=>z.media_type==="movie"||!z.media_type&&z.title):P==="tv"&&(B=p.filter(z=>z.media_type==="tv"||!z.media_type&&z.name)),S&&(S.innerHTML=B.length>0?B.map(z=>_t(z)).join(""):'<div class="cast-empty-state">Bu kategoride yapım bulunamadı.</div>',Z(S))}})}function xi(){if(Jn){try{Jn.remove()}catch{}Jn=null}}const Zf="https://api.tvmaze.com",Xf=5500,Cc=30*60*1e3,Lc="cinepulse_tvmaze_cache_v1",vn=new Map;function Qf(){try{const e=sessionStorage.getItem(Lc);if(!e)return;const t=JSON.parse(e);t&&typeof t=="object"&&Object.entries(t).forEach(([i,n])=>{n?.savedAt&&Date.now()-n.savedAt<Cc&&vn.set(i,n)})}catch{}}function eh(){try{const e={};let t=0;for(const[i,n]of vn.entries()){if(t++>=80)break;e[i]=n}sessionStorage.setItem(Lc,JSON.stringify(e))}catch{}}function Es(e){const t=vn.get(e);if(t){if(Date.now()-t.savedAt>Cc){vn.delete(e);return}return t.data}}function Ts(e,t){vn.set(e,{savedAt:Date.now(),data:t}),eh()}async function br(e){try{const t=await fetch(`${Zf}${e}`,{headers:{Accept:"application/json"},signal:AbortSignal.timeout(Xf)});return t.ok?await t.json():null}catch{return null}}function Vo(e){return String(e||"").toLowerCase().replace(/[^a-z0-9çğıöşü ]/gi," ").replace(/\s+/g," ").trim()}function $c(e,t){const i=Vo(e),n=Vo(t);return!i||!n?!1:i===n?!0:i.includes(n)||n.includes(i)}function Jo(e){return e?{season:e.season??null,number:e.number??null,name:e.name||"",airdate:e.airdate||"",airstamp:e.airstamp||"",runtime:e.runtime||null}:null}function th(e){switch(e){case"Running":return"Devam ediyor";case"Ended":return"Sonlandı";case"To Be Determined":return"Belirsiz";case"In Development":return"Yapım aşamasında";default:return e||""}}async function ih(e){const t=`lookup:${e}`,i=Es(t);if(i!==void 0)return i;const n=await br(`/lookup/shows?${e}`);return Ts(t,n||null),n||null}async function Rc(e){if(!e)return null;const t=`show:${e}`,i=Es(t);if(i!==void 0)return i;const n=await br(`/shows/${e}?embed[]=nextepisode&embed[]=previousepisode`),r=n?{tvmazeId:n.id,name:n.name||"",status:n.status||"",statusLabel:th(n.status),premiered:n.premiered||"",officialSite:n.officialSite||"",thetvdbId:n.externals?.thetvdb??null,imdbId:n.externals?.imdb||"",nextEpisode:Jo(n._embedded?.nextepisode),previousEpisode:Jo(n._embedded?.previousepisode)}:null;return Ts(t,r),r}async function nh(e){const t=String(e||"").trim();if(!t)return null;const i=t.startsWith("tt")?t:`tt${t}`,r=(await ih(`imdb=${encodeURIComponent(i)}`))?.id||null;return r?Rc(r):null}function Ic(e,t){const i=parseInt(String(e?.premiered||"").substring(0,4),10),n=parseInt(String(t||""),10);return!n||!i?0:Math.abs(i-n)}function rh(e,t,i){let n=null,r=1/0;for(const a of e){if(!a||!$c(a.name,t))continue;const o=Ic(a,i);if(o>1)continue;const s=o*10+(a.status==="Running"?0:1);s<r&&(r=s,n=a)}return n}async function ah(e,t){const i=String(e||"").trim();if(i.length<2)return null;const n=`search:${i}:${t||""}`,r=Es(n);if(r!==void 0)return r;let a=null;const o=await br(`/singlesearch/shows?q=${encodeURIComponent(i)}`);if(o&&$c(o.name,i)&&Ic(o,t)<=1&&(a=o),!a){const c=await br(`/search/shows?q=${encodeURIComponent(i)}`),u=Array.isArray(c)?c.map(f=>f?.show).filter(Boolean):[];a=rh(u,i,t)}const s=a?await Rc(a.id):null;return Ts(n,s),s}async function sh({imdbId:e,title:t,year:i}={}){let n=await nh(e);if(n||(n=await ah(t,i)),!n)return null;const r=n.nextEpisode;return{showName:n.name,statusLabel:n.statusLabel,officialSite:n.officialSite,nextEpisode:r,previousEpisode:n.previousEpisode,nextLabel:r?oh(r):"",nextAirdateLabel:r?ch(r.airdate,r.airstamp):""}}function oh(e){if(!e)return"";const t=e.season!==null&&e.season!==void 0,i=e.number!==null&&e.number!==void 0,n=t&&e.season>=1900;return t&&!n&&i?`S${e.season} B${e.number}`:n&&e.name?e.name:i?`B${e.number}`:e.name||""}const lh=["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];function ch(e,t){const i=t?new Date(t):e?new Date(`${e}T21:00:00`):null;if(!i||Number.isNaN(i.getTime()))return e||"";const n=new Date,r=s=>new Date(s.getFullYear(),s.getMonth(),s.getDate()).getTime(),a=Math.round((r(i)-r(n))/864e5),o=t?`${String(i.getHours()).padStart(2,"0")}:${String(i.getMinutes()).padStart(2,"0")}`:"";return a<0?"Yayınlandı":a===0?o?`Bugün ${o}`:"Bugün":a===1?o?`Yarın ${o}`:"Yarın":a<=7?`${a} gün sonra`:`${i.getDate()} ${lh[i.getMonth()]}`}Qf();const Zo="cinepulse.decision-room.autoplay";function dh(e,t){try{const i=JSON.parse(sessionStorage.getItem(Zo)||"null");return sessionStorage.removeItem(Zo),i&&String(i.id)===String(t)&&i.type===e&&Date.now()-Number(i.createdAt||0)<15e3?i:null}catch{return null}}function Xo(e){if(!e||e<=0)return"";const t=Math.floor(e/60),i=e%60;return t>0?`${t} sa ${i>0?i+" dk":""} (${e} dk)`:`${e} dk`}async function uh(e="tv",t){const i=typeof e=="object"&&e!==null?e.type||"tv":e||"tv",n=typeof e=="object"&&e!==null?e.id:t;let r=i==="series"||i==="tv"||i==="anime"?"tv":i==="movie"?"movie":"tv",a=await Zs(r,n);if(a||(r=r==="tv"?"movie":"tv",a=await Zs(r,n)),!a)return{html:'<div class="container" style="padding: 10rem 0; text-align: center;"><h2>İçerik bulunamadı.</h2></div>',init:()=>{}};const o=!!(a.seasons&&a.seasons.length>0)||r==="tv",s=o?"tv":"movie",c=Ss(a)||i==="anime"||r==="anime"||ze(n);c&&we(n);const u=a.title||a.name||"Detay",f=a.original_title||a.original_name||"",h=Xe(a.backdrop_path,je.BACKDROP_ORIGINAL);Xe(a.poster_path,je.POSTER_MEDIUM);const m=a.vote_average?a.vote_average.toFixed(1):"8.5",y=(a.first_air_date||a.release_date||"").substring(0,4),g=a.overview&&a.overview.trim().length>15?a.overview:De(a,s),w=a.genres||[],_=a.runtime?a.runtime*60:6600,p=md(n),k=rs(n),T=s==="tv"?Qr(n):null,C=s==="movie"?Xt(n,1,1):null,S=s==="movie"?mn(n,1,1):!1,$=s==="tv"?Zr(n,a.seasons||[]):!1,L=s==="movie"?S:$;let P=s==="movie"?"Filmi İzle":"1. Sezon 1. Bölümü İzle";if(s==="tv"&&T){const A=li(T.currentTime);P=`Devam Et <span class="play-btn-subinfo">S${T.season} B${T.episode}${A?" • "+A:""}</span>`}else s==="movie"&&C&&C.currentTime>0&&(P=`Devam Et <span class="play-btn-subinfo">${li(C.currentTime)}</span>`);const B=a.credits?.crew?a.credits.crew.filter(A=>A.job==="Director").map(A=>A.name):[],z=a.created_by?a.created_by.map(A=>A.name):[],Y=B.length>0?B.slice(0,2).join(", "):z.length>0?z.slice(0,2).join(", "):"",K=(parseFloat(m)/2).toFixed(1),N=Math.floor(K),q=K%1>=.4,j="★".repeat(Math.min(5,N))+(q&&N<5?"½":""),Q=a.credits&&a.credits.cast?a.credits.cast.slice(0,24):[];let ie=null,ne=!1;s==="tv"&&a.seasons&&(ie=await Gf({tvId:n,seriesTitle:u,originalTitle:f,seriesOverview:g,seasons:a.seasons,posterPath:a.poster_path,backdropPath:a.backdrop_path,isAnime:c,spoilerFree:ne}));const O=a.recommendations?a.recommendations.results.slice(0,6):[],se=s==="movie"?S?"Film İzlendi":"İzlendi Olarak İşaretle":$?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle",V=a.runtime?`
    <span>${Xo(a.runtime)}</span>
  `:"",W=c?o?"ANİME DİZİSİ":"ANİME FİLMİ":s==="tv"?"DİZİ":"FİLM",re=(a.videos?.results||[]).filter(A=>A.site==="YouTube");re.sort((A,M)=>{const I={Trailer:1,Teaser:2,Clip:3,"Behind the Scenes":4};return(I[A.type]||9)-(I[M.type]||9)});const ue=re.slice(0,3);return{html:`
    <div class="detail-view">
      <div class="detail-hero-banner">
        <div class="detail-backdrop-img" style="background-image: url('${h}')"></div>
        <div class="detail-backdrop-gradient"></div>

        <div class="detail-container">
          <!-- Top Back Action -->
          <button class="detail-back-btn" id="btn-detail-back" title="Önceki Sayfaya Geri Dön">
            <i data-lucide="arrow-left" style="width:16px;height:16px;"></i>
            <span>Geri Dön</span>
          </button>
          
          <div class="detail-hero-content">
            <!-- Left/Center Primary Info Column (Netflix Mulan Layout) -->
            <div class="detail-info-col">
              
              <!-- Giant Cinematic Title (Image 2 Mulan style) -->
              <h1 class="detail-heading-title">${u}</h1>

              <!-- Editorial Subtitle (Original Title & Creator / Director) -->
              <div class="detail-editorial-sub">
                ${f&&f!==u?`<span class="detail-orig-name">${f}</span>`:""}
                ${Y?`
                  <span class="detail-director-pill">
                    <strong style="color: var(--primary);">${s==="tv"?"YARATICI":"YÖNETMEN"}:</strong> ${Y}
                  </span>
                `:""}
              </div>

              <!-- Rich Storyline / Overview (Longer, comfortable breathing room, no premature clamp) -->
              <div class="detail-storyline-wrapper">
                <p class="detail-storyline ${g.length>550?"truncated":""}" id="detail-storyline-text">${g}</p>
                ${g.length>550?'<button class="btn-storyline-expand" id="btn-expand-storyline"><span>Devamını Oku</span><i data-lucide="chevron-down" style="width:14px;height:14px"></i></button>':""}
              </div>

              <!-- Clean Metadata Line (Directly under story, matching Netflix Mulan) -->
              <div class="detail-meta-line">
                <span class="detail-meta-rating">
                  <i data-lucide="star" style="width:14px; height:14px; fill: #f59e0b; color: #f59e0b;"></i> ${m}
                </span>
                <span>${y}</span>
                ${w.length>0?`<span>${w.slice(0,3).map(A=>A.name).join(" • ")}</span>`:""}
                ${V}
                ${a.number_of_seasons?`<span>${a.number_of_seasons} Sezon</span>`:""}
                ${a.number_of_episodes?`<span>${a.number_of_episodes} Bölüm</span>`:""}
                <span class="detail-meta-type">${W}</span>
              </div>

              <!-- Hero Actions (Play + Secondary Options) -->
              <div class="detail-action-deck">
                <div class="detail-action-main-row">
                  ${s==="movie"?`
                    <button class="btn-play-primary" id="btn-play-movie">
                      <i data-lucide="play" style="fill: currentColor; width: 20px; height: 20px;"></i>
                      <span>${P}</span>
                    </button>
                  `:`
                    <button class="btn-play-primary" id="btn-resume-series">
                      <i data-lucide="play" style="fill: currentColor; width: 20px; height: 20px;"></i>
                      <span>${P}</span>
                    </button>
                  `}

                  <button class="btn-detail-trailer" id="btn-watch-trailer">
                    <i data-lucide="youtube" style="width: 18px; height: 18px;"></i>
                    <span>Fragman İzle</span>
                  </button>

                  <button class="btn-action-tile ${k?"active-watch":""}" id="btn-toggle-watchlist">
                    <i data-lucide="${k?"check":"plus"}"></i>
                    <span>${k?"Listemde":"Listem"}</span>
                  </button>

                  <button class="btn-action-tile ${p?"active-fav":""}" id="btn-toggle-fav">
                    <i data-lucide="heart" style="${p?"fill: var(--primary); color: var(--primary)":""}"></i>
                    <span>${p?"Favorilerimde":"Favori"}</span>
                  </button>

                  <button class="btn-action-tile ${L?"active-watched":""}" id="btn-toggle-watched-detail">
                    <i data-lucide="${L?"check-circle-2":"check"}"></i>
                    <span>${se}</span>
                  </button>

                  <button class="btn-action-tile" id="btn-mark-halfway-detail" title="Kaldığım Yer">
                    <i data-lucide="clock" style="color: #fbbf24;"></i>
                    <span>Yarıda Bırak</span>
                  </button>
                </div>

                ${s==="tv"?`
                  <div class="detail-spoiler-inline-row">
                    <label class="spoiler-discovery-pill">
                      <input id="detail-spoiler-free-toggle" type="checkbox" />
                      <i data-lucide="shield-check"></i>
                      <span>Spoilersız Keşfet</span>
                    </label>
                  </div>
                `:""}
              </div>

              <!-- Netflix Style Bottom "Trailers" Strip (Image 2) with Horizontal Inline Expansion -->
              ${ue.length>0?`
                <div class="detail-hero-trailers-section">
                  <span class="hero-trailers-label">Trailers</span>
                  <div class="hero-trailers-track" id="hero-trailers-track">
                    ${ue.map((A,M)=>`
                      <div class="hero-trailer-expand-card" data-video-key="${A.key}" data-video-title="${A.name||"Fragman "+(M+1)}" data-video-type="${A.type||"Fragman"}">
                        <!-- Compact State -->
                        <div class="trailer-compact-view">
                          <img src="https://img.youtube.com/vi/${A.key}/mqdefault.jpg" alt="${A.name||"Trailer"}" loading="lazy" />
                          <div class="trailer-thumb-overlay">
                            <div class="trailer-play-chip">
                              <i data-lucide="play" style="width: 14px; height: 14px; fill: currentColor;"></i>
                            </div>
                            <span class="trailer-compact-name">${A.name||"Fragman "+(M+1)}</span>
                          </div>
                        </div>

                        <!-- Inline Expanded State (Active on click) -->
                        <div class="trailer-expanded-view">
                          <div class="trailer-expanded-player"></div>
                          <div class="trailer-expanded-info">
                            <div class="trailer-expanded-header">
                              <span class="trailer-expanded-tag">${A.type||"FRAGMAN"}</span>
                              <button class="trailer-expanded-close" title="Kapat" type="button">
                                <i data-lucide="x" style="width: 14px; height: 14px;"></i>
                              </button>
                            </div>
                            <h4 class="trailer-expanded-title">${A.name||`${u} Fragman`}</h4>
                            <div class="trailer-expanded-meta">
                              <span>HD 1080p</span>
                              <span>•</span>
                              <span>Orijinal Ses</span>
                            </div>
                            <p class="trailer-expanded-desc">${(g||"").substring(0,110)}...</p>
                          </div>
                        </div>
                      </div>
                    `).join("")}
                  </div>
                </div>
              `:""}

            </div>

          </div>
        </div>
      </div>

      <!-- Netflix Sub-Navigation Tabs Bar (Images 3 & 4) -->
      <div class="netflix-detail-tabs-bar">
        <div class="container">
          <div class="netflix-tabs-track">
            ${s==="tv"&&ie?`
              <button class="netflix-tab-btn active" data-tab="episodes">
                <span>BÖLÜMLER</span>
              </button>
            `:""}

            <button class="netflix-tab-btn ${s==="movie"?"active":""}" data-tab="cast">
              <span>OYUNCULAR</span>
            </button>

            <button class="netflix-tab-btn" data-tab="overview">
              <span>GENEL BAKIŞ</span>
            </button>

            <button class="netflix-tab-btn" data-tab="trailers">
              <span>FRAGMANLAR</span>
            </button>

            ${O.length>0?`
              <button class="netflix-tab-btn" data-tab="recommendations">
                <span>BENZERLERİ</span>
              </button>
            `:""}
          </div>
        </div>
      </div>

      <!-- Netflix Tab Content Panes -->
      <div class="netflix-tab-content-area">
        <div class="container">

          ${s==="tv"&&ie?`
            <!-- Tab Pane: Episodes (Image 3) -->
            <div class="netflix-tab-pane active" id="tab-pane-episodes">
              ${ie.html}
            </div>
          `:""}

          <!-- Tab Pane: Dedicated Cast Grid (Image 4) -->
          <div class="netflix-tab-pane ${s==="movie"?"active":""}" id="tab-pane-cast">
            <div class="netflix-pane-header">
              <div class="netflix-pane-title-group">
                <h2 class="netflix-pane-title">
                  <i data-lucide="users" style="color: #f59e0b; width: 20px; height: 20px;"></i>
                  <span>Oyuncu Kadrosu & Karakterler</span>
                </h2>
                <p class="netflix-pane-subtitle">Karakteri canlandıran oyuncular ve filmografileri</p>
              </div>
              <span class="netflix-pane-count-pill">${Q.length} Oyuncu</span>
            </div>

            ${Q.length>0?`
              <div class="netflix-cast-grid">
                ${Q.map((A,M)=>{const I=A.profile_path?Xe(A.profile_path,je.POSTER_MEDIUM):tr,H=A.character?A.character.split("/")[0].trim():"",J=(A.popularity?Math.min(9.9,Math.max(6.5,A.popularity/3.5+6)):8.5).toFixed(1);return`
                    <div class="netflix-cast-card ${M>=12?"cast-card-hidden":""}" data-person-id="${A.id}" data-person-name="${A.name}" title="${A.name}${H?" ("+H+")":""} • Filmografiyi Gör">
                      <div class="netflix-cast-photo-wrap">
                        <img src="${I}" alt="${A.name}" loading="lazy" onerror="this.onerror=null; this.src='${tr}';" />
                        <div class="netflix-cast-card-hover">
                          <i data-lucide="sparkles" style="width:20px;height:20px;color:#fff;"></i>
                          <span>Filmografi</span>
                        </div>
                      </div>
                      <div class="netflix-cast-info">
                        <h4 class="netflix-cast-name">${A.name}</h4>
                        ${H?`<p class="netflix-cast-character">As ${H}</p>`:""}
                        <div class="netflix-cast-rating">
                          <i data-lucide="star" style="width:11px;height:11px;fill:#f59e0b;stroke:#f59e0b;"></i>
                          <span>${J} / 10</span>
                        </div>
                      </div>
                    </div>
                  `}).join("")}
              </div>

              ${Q.length>12?`
                <div style="text-align: center; margin: 2.5rem 0 1rem;">
                  <button class="btn-netflix-show-more" id="btn-show-more-cast">
                    <span>Tüm Oyuncuları Göster (${Q.length})</span>
                    <i data-lucide="chevron-down" style="width:16px;height:16px;"></i>
                  </button>
                </div>
              `:""}
            `:`
              <div class="netflix-empty-tab-state">
                <i data-lucide="user-x" style="width:40px;height:40px;color:#666;"></i>
                <p>Bu yapım için oyuncu bilgisi bulunamadı.</p>
              </div>
            `}
          </div>

          <!-- Tab Pane: Overview & Technical Details -->
          <div class="netflix-tab-pane" id="tab-pane-overview">
            <div class="netflix-overview-pane-grid">
              <div class="netflix-overview-main-col">
                <h3 class="netflix-subheading">Özet & Hikaye</h3>
                <p class="netflix-full-overview">${g||"Bu içerik için henüz özet eklenmedi."}</p>
              </div>

              <div class="netflix-overview-specs-col">
                <h3 class="netflix-subheading">Teknik Detaylar</h3>
                <div class="netflix-specs-table">
                  ${f?`
                    <div class="spec-row">
                      <span class="spec-label">Orijinal Başlık</span>
                      <span class="spec-val">${f}</span>
                    </div>
                  `:""}
                  ${Y?`
                    <div class="spec-row">
                      <span class="spec-label">${s==="tv"?"Yaratıcı":"Yönetmen"}</span>
                      <span class="spec-val">${Y}</span>
                    </div>
                  `:""}
                  ${a.release_date||a.first_air_date?`
                    <div class="spec-row">
                      <span class="spec-label">Yayın Tarihi</span>
                      <span class="spec-val">${a.release_date||a.first_air_date}</span>
                    </div>
                  `:""}
                  ${a.status?`
                    <div class="spec-row">
                      <span class="spec-label">Yayın Durumu</span>
                      <span class="spec-val">${a.status}</span>
                    </div>
                  `:""}
                  ${a.runtime?`
                    <div class="spec-row">
                      <span class="spec-label">Film Süresi</span>
                      <span class="spec-val">${Xo(a.runtime)}</span>
                    </div>
                  `:""}
                  ${a.number_of_seasons?`
                    <div class="spec-row">
                      <span class="spec-label">Toplam Sezon</span>
                      <span class="spec-val">${a.number_of_seasons} Sezon</span>
                    </div>
                  `:""}
                  ${a.number_of_episodes?`
                    <div class="spec-row">
                      <span class="spec-label">Toplam Bölüm</span>
                      <span class="spec-val">${a.number_of_episodes} Bölüm</span>
                    </div>
                  `:""}
                  <div class="spec-row">
                    <span class="spec-label">IMDb Puanı</span>
                    <span class="spec-val" style="color: #fbbf24; font-weight: 750;">★ ${m} / 10</span>
                  </div>
                  <div class="spec-row">
                    <span class="spec-label">Letterboxd</span>
                    <span class="spec-val" style="color: #00e054; font-weight: 750;">${j} (${K})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab Pane: Trailers & Clips -->
          <div class="netflix-tab-pane" id="tab-pane-trailers">
            <div class="netflix-pane-header">
              <div class="netflix-pane-title-group">
                <h2 class="netflix-pane-title">
                  <i data-lucide="youtube" style="color: #f59e0b; width: 20px; height: 20px;"></i>
                  <span>Resmi Fragmanlar & Klipler</span>
                </h2>
                <p class="netflix-pane-subtitle">Resmi Türkçe ve orijinal tanıtım fragmanları</p>
              </div>
            </div>

            <div class="netflix-trailers-showcase">
              ${ue.map((A,M)=>`
                <div class="hero-trailer-expand-card netflix-pane-trailer-card" data-video-key="${A.key}" data-video-title="${A.name||"Fragman "+(M+1)}" data-video-type="${A.type||"Fragman"}">
                  <div class="trailer-compact-view">
                    <img src="https://img.youtube.com/vi/${A.key}/mqdefault.jpg" alt="${A.name||"Trailer"}" loading="lazy" />
                    <div class="trailer-thumb-overlay">
                      <div class="trailer-play-chip">
                        <i data-lucide="play" style="width: 14px; height: 14px; fill: currentColor;"></i>
                      </div>
                      <span class="trailer-compact-name">${A.name||"Fragman "+(M+1)}</span>
                    </div>
                  </div>
                  <div class="trailer-expanded-view">
                    <div class="trailer-expanded-player"></div>
                    <div class="trailer-expanded-info">
                      <div class="trailer-expanded-header">
                        <span class="trailer-expanded-tag">${A.type||"RESMİ FRAGMAN"}</span>
                        <button class="trailer-expanded-close" title="Kapat" type="button">
                          <i data-lucide="x" style="width: 14px; height: 14px;"></i>
                        </button>
                      </div>
                      <h4 class="trailer-expanded-title">${A.name||`${u} Fragman`}</h4>
                      <div class="trailer-expanded-meta">
                        <span>HD 1080p</span>
                        <span>•</span>
                        <span>YouTube</span>
                      </div>
                      <p class="trailer-expanded-desc">${(g||"").substring(0,110)}...</p>
                    </div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          ${O.length>0?`
            <!-- Tab Pane: More Like This (Image 3 / 4) -->
            <div class="netflix-tab-pane" id="tab-pane-recommendations">
              <div class="netflix-pane-header">
                <div class="netflix-pane-title-group">
                  <h2 class="netflix-pane-title">
                    <i data-lucide="thumbs-up" style="color: #f59e0b; width: 20px; height: 20px;"></i>
                    <span>Benzer Önerilen Yapımlar</span>
                  </h2>
                  <p class="netflix-pane-subtitle">Bu yapımı seven izleyicilerin en çok beğendiği diğer içerikler</p>
                </div>
              </div>
              <div class="media-grid">
                ${O.map(A=>_t(A)).join("")}
              </div>
            </div>
          `:""}

        </div>
      </div>
    </div>
  `,init:A=>{if(!A)return;let M=dh(s,n);const I=A.querySelector("#btn-detail-back");I&&I.addEventListener("click",l=>{l.preventDefault(),window.history.length>1?window.history.back():window.location.hash="#home"}),ie&&ie.init(A);const H=A.querySelector("#detail-spoiler-free-toggle");H&&(H.checked=ne,H.addEventListener("change",()=>{ne=H.checked,ie?.setSpoilerSafe(ne),X(ne?"Spoilersız keşif açıldı. Sonraki bölüm detayları gizlendi.":"Spoilersız keşif kapatıldı.","info")}));const J=A.querySelector("#btn-play-movie"),x=async()=>{if(!J||J.disabled)return;J.disabled=!0;const l=J.innerHTML;J.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px;fill:currentColor"></i> <span>Yükleniyor...</span>',Z();try{const d=Xt(n,1,1);await ei({type:c?"anime":"movie",isAnime:c,tmdbId:n,title:u,seriesTitle:u,originalTitle:f,posterPath:a.poster_path,backdropPath:a.backdrop_path,duration:_,currentTime:d?d.currentTime:0,roomSync:M?{roomCode:M.roomCode,mediaId:n,type:s,season:1,episode:1,initialSync:M.initialSync||null}:null})}catch{X("Film açılırken hata oluştu, lütfen tekrar deneyin.","error")}finally{J.disabled=!1,J.innerHTML=l,Z()}};J&&J.addEventListener("click",x);const E=A.querySelector("#btn-resume-series"),U=async()=>{if(!E||E.disabled)return;E.disabled=!0;const l=E.innerHTML;E.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px;fill:currentColor"></i> <span>Yükleniyor...</span>',Z();try{const d=M;M=null;const b=Qr(n),R=d?.season||(b?b.season:1),D=d?.episode||(b?b.episode:1),F=d?0:b?b.currentTime:0;await ei({type:c?"anime":"tv",isAnime:c,tmdbId:n,title:`${u} - S${R}E${D}`,seriesTitle:u,originalTitle:f,season:R,episode:D,posterPath:a.poster_path,backdropPath:a.backdrop_path,currentTime:F,seasonsList:a.seasons||[],roomSync:d?{roomCode:d.roomCode,mediaId:n,type:s,season:R,episode:D,initialSync:d.initialSync||null}:null})}catch{X("İçerik açılırken hata oluştu, lütfen tekrar deneyin.","error")}finally{E.disabled=!1,E.innerHTML=l,Z()}};E&&E.addEventListener("click",l=>{l.preventDefault(),U()}),M&&window.setTimeout(()=>{s==="movie"?x():U()},0);const ee=A.querySelector("#btn-watch-trailer");ee&&ee.addEventListener("click",async()=>{const l=A.querySelector(".hero-trailer-expand-card");if(l)l.click(),l.scrollIntoView({behavior:"smooth",block:"nearest"});else{ee.disabled=!0;try{const d=await zd(s,n,u);d?Sc({title:u,trailerInfo:d,mediaId:n,mediaType:c?"anime":s}):X("Bu yapım için resmi fragman bulunamadı.","info")}catch{}ee.disabled=!1}}),A.querySelectorAll(".hero-trailer-expand-card").forEach(l=>{l.addEventListener("click",d=>{if(d.target.closest(".trailer-expanded-close")){d.stopPropagation(),l.classList.remove("is-expanded");const D=l.querySelector(".trailer-expanded-player");D&&(D.innerHTML="");return}if(l.classList.contains("is-expanded"))return;A.querySelectorAll(".hero-trailer-expand-card.is-expanded").forEach(D=>{D.classList.remove("is-expanded");const F=D.querySelector(".trailer-expanded-player");F&&(F.innerHTML="")});const b=l.getAttribute("data-video-key");if(!b)return;l.classList.add("is-expanded");const R=l.querySelector(".trailer-expanded-player");R&&(R.innerHTML=`
              <iframe 
                src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(b)}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&playsinline=1"
                frameborder="0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowfullscreen
                class="trailer-inline-iframe"
                title="${u} Fragman">
              </iframe>
            `),Z()})});const ge=A.querySelector("#btn-toggle-fav");ge&&ge.addEventListener("click",()=>{const l=gd({...a,type:c?"anime":s,isAnime:c,media_type:s});X(l?"Favorilere eklendi!":"Favorilerden çıkarıldı.",l?"success":"info");const d=ge.querySelector("i"),b=ge.querySelector("span");d&&b&&(d.style.fill=l?"var(--primary)":"none",d.style.color=l?"var(--primary)":"currentColor",b.textContent=l?"Favorilerimde":"Favorilere Ekle")});const oe=A.querySelector("#btn-toggle-watchlist");oe&&oe.addEventListener("click",()=>{const l=yl({...a,type:c?"anime":s,isAnime:c,media_type:s});X(l?"İzleme listesine eklendi!":"İzleme listesinden çıkarıldı.",l?"success":"info");const d=oe.querySelector("i"),b=oe.querySelector("span");d&&b&&(d.setAttribute("data-lucide",l?"check":"plus"),Z(),b.textContent=l?"Listemde":"İzleme Listeme Ekle")});const le=A.querySelector("#btn-toggle-watched-detail");le&&le.addEventListener("click",l=>{if(l.preventDefault(),s==="movie"){const b=ml(n,1,1,{title:u,posterPath:a.poster_path,backdropPath:a.backdrop_path,type:"movie",duration:_}).completed;X(b?"✓ Film izlendi olarak işaretlendi!":"Film izlendi işareti kaldırıldı.",b?"success":"info"),b?le.classList.add("btn-watched-active"):le.classList.remove("btn-watched-active"),le.innerHTML=`
              <i data-lucide="${b?"check-circle-2":"check"}"></i>
              <span>${b?"Film İzlendi":"İzlendi Olarak İşaretle"}</span>
            `,Z()}else{const b=!Zr(n,a.seasons||[]);pd(n,a.seasons||[],b,{title:u,posterPath:a.poster_path,backdropPath:a.backdrop_path,type:c?"anime":"tv",isAnime:c}),X(b?"✓ Dizinin tüm bölümleri izlendi olarak işaretlendi!":"Tüm bölümler izlenmedi yapıldı.",b?"success":"info"),b?le.classList.add("btn-watched-active"):le.classList.remove("btn-watched-active"),le.innerHTML=`
              <i data-lucide="${b?"check-circle-2":"check"}"></i>
              <span>${b?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle"}</span>
            `,Z(),A.querySelectorAll(".episode-card").forEach(D=>{const F=D.querySelector(".badge-watched-status"),ae=D.querySelector(".btn-mark-ep-watched");F&&(F.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',F.style.background="var(--accent-green)",F.style.color="#fff",F.style.display=b?"inline-flex":"none"),ae&&(b?(ae.classList.add("watched"),ae.style.background="#10b981",ae.style.borderColor="#10b981"):(ae.classList.remove("watched"),ae.style.background="rgba(0,0,0,0.65)",ae.style.borderColor="rgba(255,255,255,0.3)"))});const R=A.querySelector("#btn-mark-season-all");if(R){const D=R.querySelector("span"),F=R.querySelector("i");D&&(D.textContent=b?"Bu Sezon İzlendi":"Bu Sezonu İzlendi İşaretle"),F&&F.setAttribute("data-lucide",b?"check-circle-2":"check-check"),b?(R.style.background="rgba(16, 185, 129, 0.2)",R.style.borderColor="#10b981",R.style.color="#10b981"):(R.style.background="",R.style.borderColor="",R.style.color="")}Z()}});const Ye=l=>{if(l&&l.detail&&l.detail.isProgressUpdate&&document.getElementById("player-modal"))return;const d=s==="movie"?mn(n,1,1):!1,b=s==="tv"?Zr(n,a.seasons||[]):!1,R=s==="movie"?d:b;if(le){R?le.classList.add("btn-watched-active"):le.classList.remove("btn-watched-active");const ae=s==="movie"?R?"Film İzlendi":"İzlendi Olarak İşaretle":R?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle";le.innerHTML=`
            <i data-lucide="${R?"check-circle-2":"check"}"></i>
            <span>${ae}</span>
          `}const D=A.querySelector("#btn-play-movie");if(D&&s==="movie"){const ae=Xt(n,1,1);if(ae&&ae.currentTime>0&&!ae.completed){const ve=li(ae.currentTime);D.innerHTML=`<i data-lucide="play" style="fill:currentColor"></i> <span>Devam Et <span class="play-btn-subinfo">${ve}</span></span>`}}const F=A.querySelector("#btn-resume-series");if(F&&s==="tv"){const ae=Qr(n);if(ae){const ve=li(ae.currentTime);F.innerHTML=`<i data-lucide="play" style="fill:currentColor"></i> <span>Devam Et <span class="play-btn-subinfo">S${ae.season} B${ae.episode}${ve?" • "+ve:""}</span></span>`}}Z()};window.addEventListener("sineflix_data_changed",Ye);const Oe=A.querySelector("#btn-mark-halfway-detail");Oe&&Oe.addEventListener("click",l=>{if(l.preventDefault(),s==="movie"){const d=Math.round(_*.5),b=li(d);La(n,1,1,d,{title:u,posterPath:a.poster_path,backdropPath:a.backdrop_path,type:c?"anime":"movie",isAnime:c,duration:_}),X(`⏳ Film ${b} dakikasında yarıda bırakıldı olarak işaretlendi!`,"info");const R=A.querySelector("#btn-play-movie span");R&&(R.textContent=`Kaldığın Yerden Devam Et (${b})`)}else{const d=T?T.season:1,b=T?T.episode:1;La(n,d,b,1200,{title:u,posterPath:a.poster_path,backdropPath:a.backdrop_path,type:c?"anime":"tv",isAnime:c,duration:3e3}),X(`⏳ S${d} B${b} 20. dakikada yarıda bırakıldı olarak işaretlendi!`,"info");const R=A.querySelector("#btn-resume-series span");R&&(R.textContent=`Kaldığın Yerden Devam Et (S${d} B${b} • 20:00)`)}});const nt=A.querySelector("#btn-expand-storyline"),Ge=A.querySelector("#detail-storyline-text");nt&&Ge&&nt.addEventListener("click",()=>{const l=!Ge.classList.contains("truncated");Ge.classList.toggle("truncated");const d=nt.querySelector("span"),b=nt.querySelector("i");d&&(d.textContent=l?"Devamını Oku":"Daralt"),b&&(b.style.transform=l?"rotate(0deg)":"rotate(180deg)")});const Ee=A.querySelectorAll(".netflix-tab-btn"),Qe=A.querySelectorAll(".netflix-tab-pane");Ee.forEach(l=>{l.addEventListener("click",d=>{d.preventDefault();const b=l.getAttribute("data-tab");Ee.forEach(D=>D.classList.remove("active")),Qe.forEach(D=>D.classList.remove("active")),l.classList.add("active");const R=A.querySelector(`#tab-pane-${b}`);R&&(R.classList.add("active"),Z(R))})}),A.querySelectorAll(".netflix-cast-card").forEach(l=>{l.addEventListener("click",d=>{d.preventDefault();const b=l.getAttribute("data-person-id"),R=l.getAttribute("data-person-name");b&&Jf(b,R)})});const ct=A.querySelector("#btn-show-more-cast");ct&&ct.addEventListener("click",l=>{l.preventDefault(),A.querySelectorAll(".netflix-cast-card.cast-card-hidden").forEach(b=>b.classList.remove("cast-card-hidden")),ct.style.display="none",Z()});const Ce=A.querySelector("#btn-pane-play-trailer");Ce&&Ce.addEventListener("click",()=>{const l=A.querySelector("#btn-watch-trailer");l&&l.click()});const qe=A.querySelector("#detail-next-episode-badge");qe&&s==="tv"&&(async()=>{try{const l=await sh({imdbId:a.external_ids?.imdb_id,title:f||u,year:y});if(!l?.nextEpisode||!qe.isConnected)return;const d=l.nextLabel||"",b=l.nextAirdateLabel||"";if(!d&&!b||b==="Yayınlandı")return;const R=[d?`Yeni bölüm ${d}`:"Yeni bölüm",b].filter(Boolean).join(" • ");qe.innerHTML=`<i data-lucide="calendar-clock" style="width:13px; height:13px"></i><span>${R}</span>`,qe.title=`Sonraki bölüm: ${d||"-"}${l.nextEpisode.name?" — "+l.nextEpisode.name:""}${b?" • "+b:""} (Kaynak: TVmaze)`,qe.style.display="inline-flex",Z(qe)}catch{}})();const v=A.querySelector(".media-grid");v&&mt(v)}}}const ph="cinepulse_offline_db",fh=1,tt="downloads",hi="cinepulse-offline-media-v1";let On=null,pn=[];const wr=new Map,Nn=new Map;async function Hr(e,t={},i=12e4){const n=new AbortController,r=t.signal,a=()=>n.abort();if(r?.aborted)throw new Error("İndirme iptal edildi");r?.addEventListener("abort",a,{once:!0});let o=!1;const s=setTimeout(()=>{o=!0,n.abort()},i);try{return await fetch(e,{...t,signal:n.signal})}catch(c){throw r?.aborted?new Error("İndirme iptal edildi"):o?new Error("Yayın kaynağı yanıt vermedi. İndirme durduruldu."):c}finally{clearTimeout(s),r?.removeEventListener("abort",a)}}function Mc(e){return Hi().then(t=>new Promise((i,n)=>{const r=t.transaction(tt,"readonly").objectStore(tt).get(e);r.onsuccess=()=>i(r.result||null),r.onerror=()=>n(r.error)}))}function As(e,t){return new Request(new URL(`/__cinepulse_offline__/${encodeURIComponent(e)}/${t}`,location.origin))}function kr(e){return new Request(new URL(`/__cinepulse_offline_posters__/${encodeURIComponent(e)}`,location.origin))}function hh(e){return!e||e==="null"||e==="undefined"||e.startsWith("data:")?"":/^https?:\/\//i.test(e)?e:e.startsWith("/api/")?it(e):`https://image.tmdb.org/t/p/w342/${e.replace(/^\/+/,"")}`}async function Pc(e,t){if(!e||!t||t.startsWith("data:"))return!1;if(Nn.has(e))return Nn.get(e);const i=(async()=>{const n=await caches.open(hi),r=kr(e);if(await n.match(r))return!0;const a=hh(t);if(!a)return!1;const o=[a];a.startsWith(it("/"))||o.push(it(`/api/img_proxy?url=${encodeURIComponent(a)}`));for(const s of o)try{const c=await Hr(s,{cache:"no-store"},12e3),u=c.headers.get("content-type")||"";if(!c.ok||!u.startsWith("image/"))continue;return await n.put(r,c.clone()),!0}catch{}return!1})().finally(()=>Nn.delete(e));return Nn.set(e,i),i}async function Bc(e,t=""){if(!e)return"";const i=wr.get(e);if(i)return i;try{const n=await caches.open(hi);let r=await n.match(kr(e));if(!r&&t&&navigator.onLine!==!1&&(await Pc(e,t),r=await n.match(kr(e))),!r)return"";const a=URL.createObjectURL(await r.blob());return wr.set(e,a),a}catch{return""}}function Cs(e){if(!e||typeof e!="string")return{target:null,ref:null};try{const t=e.startsWith("http")?e:`http://localhost${e.startsWith("/")?"":"/"}${e}`,i=new URL(t),n=i.searchParams.get("url"),r=i.searchParams.get("ref");return{target:n||null,ref:r||null}}catch{return{target:null,ref:null}}}async function mh(){try{const e=window.CinePulseNative?.getDeviceStorageInfo?.();if(e){const t=JSON.parse(e);if(Number.isFinite(t.total)&&Number.isFinite(t.free))return t}}catch{}try{const{quota:e=0,usage:t=0}=await navigator.storage.estimate();return{total:e,free:Math.max(0,e-t),isOriginQuota:!0}}catch{return{total:0,free:0,isOriginQuota:!0}}}function Xa(e,t){const i=(e||"").trim();if(!i)return"";if(i.startsWith("/api/hls_proxy?"))return it(i);if(/^https?:\/\//i.test(i)&&i.includes("/api/hls_proxy?"))return i;try{const{target:n,ref:r}=Cs(t),a=new URL(i,n||t).href;return a.includes("/api/hls_proxy?")?a:it(`/api/hls_proxy?url=${encodeURIComponent(a)}${r?`&ref=${encodeURIComponent(r)}`:""}`)}catch{return i}}function Dc(e){if(e.startsWith("/api/"))return it(e);if(!/^https?:\/\//i.test(e)||e.includes("/api/hls_proxy?"))return e;const{target:t,ref:i}=Cs(e),n=t||e,r=/\.m3u8(?:[?#]|$)/i.test(n);return it(`/api/hls_proxy?url=${encodeURIComponent(n)}${i?`&ref=${encodeURIComponent(i)}`:""}${r?"":"&download=1"}`)}function pm(e,t="video.mp4"){if(!e)return!1;const i=typeof e=="string"&&e.startsWith("/api/")?it(e):e;try{const n=document.createElement("a");return n.href=i,n.setAttribute("download",t),n.setAttribute("target","_blank"),n.rel="noopener noreferrer",n.style.display="none",document.body.appendChild(n),n.click(),setTimeout(()=>{try{n.remove()}catch{}},1e3),!0}catch{try{return window.open(i,"_system"),!0}catch{return window.location.href=i,!0}}}async function gh(e,t,i,n,r,a,o=null){if(o?.aborted)throw new Error("İndirme iptal edildi");let s=null;const{target:c,ref:u}=Cs(n),f=[],h=n.startsWith("/api/")?it(n):n;f.push(h),c&&/^https?:\/\//i.test(c)?f.push(it(`/api/hls_proxy?url=${encodeURIComponent(c)}${u?`&ref=${encodeURIComponent(u)}`:""}`)):n.includes("/api/hls_proxy")||f.push(Dc(n));let m=null;for(let g=0;g<f.length;g++){if(o?.aborted)throw new Error("İndirme iptal edildi");const w=f[g];try{if(s=await Hr(w,{cache:"no-store",signal:o}),s&&s.ok)break}catch(_){if(_.name==="AbortError"||o?.aborted)throw new Error("İndirme iptal edildi");m=_,g<f.length-1&&await new Promise(p=>setTimeout(p,250*(g+1)))}}if(!s||!s.ok)throw new Error(`Bölüm parçası indirilemedi (HTTP ${s?.status||m?.message||"ağ hatası"})`);const y=await s.blob();return await e.put(As(t,i),new Response(y,{headers:{"Content-Type":s.headers.get("content-type")||"application/octet-stream"}})),a.loaded+=y.size,a.done+=1,r({percent:0,loaded:a.loaded,total:0,done:a.done,count:a.count,status:`${a.done}/${a.count} parça alındı`}),y.size}function Qo(e,t){const i=e.split(/\r?\n/),n=[];for(let r=0;r<i.length;r+=1){if(!i[r].startsWith("#EXT-X-STREAM-INF:"))continue;const a=Number(i[r].match(/(?:AVERAGE-)?BANDWIDTH=(\d+)/)?.[1])||0,o=i.slice(r+1).find(s=>s&&!s.startsWith("#"));o&&n.push({bandwidth:a,url:Xa(o.trim(),t)})}return n.length?(n.sort((r,a)=>Math.abs(r.bandwidth-22e5)-Math.abs(a.bandwidth-22e5)),n[0]?.url||null):null}async function yh(e,t,i,n,r,a=null){let o=i.url||i.url,s=n,c=Qo(s,o),u=0;for(;c&&u<3;){if(a?.aborted)throw new Error("İndirme iptal edildi");u++;const S=await Hr(c,{cache:"no-store",signal:a});if(!S.ok)throw new Error(`Bölüm listesi alınamadı (HTTP ${S.status})`);o=S.url||c,s=await S.text(),c=Qo(s,o)}if(s.includes("#EXT-X-ENDLIST")||(s+=`
#EXT-X-ENDLIST
`),s.includes("#EXT-X-BYTERANGE"))throw new Error("Bu kaynak parçalı byte aralığı kullanıyor; başka bir yayın hattı seçin.");const f=s.split(/\r?\n/),h=[],m=[];let y=0;for(const S of f){if(!S){m.push(S);continue}if(S.startsWith("#EXT-X-BYTERANGE"))throw new Error("Bu kaynak parçalı byte aralığı kullanıyor; başka bir yayın hattı seçin.");if(S.startsWith("#EXT-X-KEY:")||S.startsWith("#EXT-X-MAP:")){const $=S.match(/URI="([^"]+)"/);if($){const L=y++,P=Xa($[1],o);h.push({index:L,url:P}),m.push(S.replace($[0],`URI="__CP_OFFLINE_RESOURCE_${L}__"`))}else m.push(S);continue}if(S.startsWith("#"))m.push(S);else{const $=y++,L=Xa(S.trim(),o);h.push({index:$,url:L}),m.push(`__CP_OFFLINE_RESOURCE_${$}__`)}}const g=h.length;if(!g)throw new Error("Bu bölümde indirilebilir video parçası bulunamadı.");const w={done:0,count:g,loaded:0},_=h.map(S=>S.index),p=4;let k=0;async function T(){for(;k<h.length;){if(a?.aborted)throw new Error("İndirme iptal edildi");const S=h[k++];if(!S)break;await gh(e,t,S.index,S.url,r,w,a)}}const C=Array.from({length:Math.min(p,h.length)},()=>T());return await Promise.all(C),{playlistTemplate:m.join(`
`),resourceKeys:_,sizeBytes:w.loaded}}function Hi(){return On?Promise.resolve(On):new Promise((e,t)=>{const i=indexedDB.open(ph,fh);i.onupgradeneeded=n=>{const r=n.target.result;if(!r.objectStoreNames.contains(tt)){const a=r.createObjectStore(tt,{keyPath:"key"});a.createIndex("tmdbId","tmdbId",{unique:!1}),a.createIndex("downloadedAt","downloadedAt",{unique:!1})}},i.onsuccess=()=>{On=i.result,e(On)},i.onerror=()=>t(i.error)})}function Ur(e,t=null,i=null){return t!==null&&i!==null&&t!==void 0&&i!==void 0?`${e}_s${t}_e${i}`:String(e)}async function Ls(){try{const e=await Hi();return new Promise((t,i)=>{const a=e.transaction(tt,"readonly").objectStore(tt).getAll();a.onsuccess=()=>{const o=a.result||[];o.sort((s,c)=>(c.downloadedAt||0)-(s.downloadedAt||0)),t(o)},a.onerror=()=>i(a.error)})}catch{return[]}}async function fm(e,t=null,i=null){try{const n=await Hi(),r=Ur(e,t,i);return new Promise(a=>{const c=n.transaction(tt,"readonly").objectStore(tt).get(r);c.onsuccess=()=>a(!!c.result),c.onerror=()=>a(!1)})}catch{return!1}}async function zc(e,t=null,i=null){try{const n=Ur(e,t,i),r=await Mc(n);if(!r||!("caches"in window))return null;const a=await caches.open(hi);if(r.mediaKind==="hls"){let s=r.playlistTemplate||"";for(const u of r.resourceKeys||[]){const f=await a.match(As(n,u));if(!f)throw new Error("İndirilen bölüm dosyası eksik.");const h=URL.createObjectURL(await f.blob());pn.push(h),s=s.replaceAll(`__CP_OFFLINE_RESOURCE_${u}__`,h)}const c=URL.createObjectURL(new Blob([s],{type:"application/vnd.apple.mpegurl"}));return pn.push(c),c}const o=await a.match(`/offline/${n}`);if(o){const s=URL.createObjectURL(await o.blob());return pn.push(s),s}return null}catch{return null}}function hm(){pn.forEach(e=>{try{URL.revokeObjectURL(e)}catch{}}),pn=[]}async function mm(e,t=()=>{},i=null){const{tmdbId:n,type:r,title:a,seriesTitle:o="",poster:s,backdrop:c,season:u,episode:f,streamUrl:h}=e;if(!h)throw new Error("İndirilecek medya bağlantısı bulunamadı.");if(!("caches"in window))throw new Error("Bu cihaz çevrimdışı depolamayı desteklemiyor.");if(typeof navigator<"u"&&navigator.storage&&navigator.storage.persist)try{await navigator.storage.persist()}catch{}const m=Ur(n,u,f),y=`/offline/${m}`,g=s?r==="tv"?`series_${n}`:`media_${m}`:"",w=g?Pc(g,s).catch(()=>!1):Promise.resolve(!1),_=Dc(h);t({percent:5,loaded:0,total:0,status:"Başlatılıyor..."});try{if(i?.aborted)throw new Error("İndirme iptal edildi");const p=await Hr(_,{cache:"no-store",signal:i});if(!p.ok)throw new Error(`İndirme başarısız (${p.status})`);const k=p.headers.get("content-type")||"";if(/mpegurl|vnd\.apple\.mpegurl/i.test(k)||/\.m3u8(?:[?#]|$)/i.test(h)||/\.m3u8(?:[?#]|$)/i.test(_)){const z=await p.text();if(!z.includes("#EXTM3U"))throw new Error("Kaynak HLS bölüm akışı döndürmedi.");const Y=await caches.open(hi),K=await yh(Y,m,p,z,t,i);g&&(t({percent:99,loaded:K.sizeBytes,total:K.sizeBytes,status:"Afiş çevrimdışı kullanıma kaydediliyor…"}),await w);const N=await Hi(),q={key:m,tmdbId:String(n),type:r||"tv",title:a||"İsimsiz İçerik",seriesTitle:o||"",poster:s||"",backdrop:c||"",season:u!==null?Number(u):null,episode:f!==null?Number(f):null,sizeBytes:K.sizeBytes,downloadedAt:Date.now(),mediaKind:"hls",posterCacheKey:g,playlistTemplate:K.playlistTemplate,resourceKeys:K.resourceKeys};return await new Promise((j,Q)=>{const ie=N.transaction(tt,"readwrite").objectStore(tt).put(q);ie.onsuccess=j,ie.onerror=()=>Q(ie.error)}),t({percent:100,loaded:K.sizeBytes,total:K.sizeBytes,status:"Tamamlandı"}),window.dispatchEvent(new CustomEvent("cinepulse_offline_changed",{detail:{action:"add",key:m}})),!0}const C=p.headers.get("content-length"),S=C?parseInt(C,10):0;let $=0,L;if(p.body&&S>0){const z=p.body.getReader(),Y=[];for(;;){if(i?.aborted)throw new Error("İndirme iptal edildi");const{done:K,value:N}=await z.read();if(K)break;Y.push(N),$+=N.length;const q=Math.min(99,Math.round($/S*100));if(t({percent:q,loaded:$,total:S,status:`%${q} indiriliyor...`}),$>=S){z.cancel().catch(()=>{});break}}L=new Blob(Y,{type:p.headers.get("content-type")||"video/mp4"})}else if(p.body){const z=p.body.getReader(),Y=[];for(;;){if(i?.aborted)throw new Error("İndirme iptal edildi");const{done:K,value:N}=await z.read();if(K)break;Y.push(N),$+=N.length,t({percent:0,loaded:$,total:0,status:`${Bt($)} alındı`})}L=new Blob(Y,{type:p.headers.get("content-type")||"video/mp4"})}else L=await p.blob(),$=L.size,t({percent:0,loaded:$,total:0,status:`${Bt($)} alındı`});if(i?.aborted)throw new Error("İndirme iptal edildi");t({percent:99,loaded:L.size,total:S||L.size,status:"İndirme tamamlandı, cihaz depolamasına yazılıyor…"}),"caches"in window&&await(await caches.open(hi)).put(y,new Response(L,{headers:{"Content-Type":L.type||"video/mp4","Content-Length":String(L.size)}})),t({percent:99,loaded:L.size,total:S||L.size,status:"Video kaydedildi, İndirilenler listesi güncelleniyor…"}),g&&(t({percent:99,loaded:L.size,total:S||L.size,status:"Afiş çevrimdışı kullanıma kaydediliyor…"}),await w);const P=await Hi(),B={key:m,tmdbId:String(n),type:r||"movie",title:a||"İsimsiz İçerik",seriesTitle:o||"",poster:s||"",backdrop:c||"",season:u!==null?Number(u):null,episode:f!==null?Number(f):null,sizeBytes:L.size,downloadedAt:Date.now(),mimeType:L.type||"video/mp4",mediaKind:"file",posterCacheKey:g};return await new Promise((z,Y)=>{const q=P.transaction(tt,"readwrite").objectStore(tt).put(B);q.onsuccess=()=>z(),q.onerror=()=>Y(q.error)}),t({percent:100,loaded:L.size,total:L.size,status:"Tamamlandı"}),window.dispatchEvent(new CustomEvent("cinepulse_offline_changed",{detail:{action:"add",key:m}})),!0}catch(p){try{const k=await caches.open(hi);await k.delete(y);const T=new URL(`/__cinepulse_offline__/${encodeURIComponent(m)}/`,location.origin).href;await Promise.all((await k.keys()).filter(C=>C.url.startsWith(T)).map(C=>k.delete(C)))}catch{}throw p}}async function Qa(e,t=null,i=null){try{const n=Ur(e,t,i),r=await Hi(),a=await Mc(n);if(await new Promise((o,s)=>{const f=r.transaction(tt,"readwrite").objectStore(tt).delete(n);f.onsuccess=()=>o(),f.onerror=()=>s(f.error)}),"caches"in window){const o=await caches.open(hi);await o.delete(`/offline/${n}`);for(const s of a?.resourceKeys||[])await o.delete(As(n,s));if(a?.posterCacheKey&&!(await Ls()).some(c=>c.posterCacheKey===a.posterCacheKey)){await o.delete(kr(a.posterCacheKey));const c=wr.get(a.posterCacheKey);c&&URL.revokeObjectURL(c),wr.delete(a.posterCacheKey)}}return window.dispatchEvent(new CustomEvent("cinepulse_offline_changed",{detail:{action:"delete",key:n}})),!0}catch{return!1}}function Bt(e){if(!e||e<=0)return"0 B";const t=1024,i=["B","KB","MB","GB","TB"],n=Math.floor(Math.log(e)/Math.log(t));return parseFloat((e/Math.pow(t,n)).toFixed(1))+" "+i[n]}const rt=e=>String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]);function el(e,t){const i=xs(e);return`
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
  `}function vh(){const e=gn();Re();const t=Us(),i=Jt(),n=Zt(),r=Hs(),a=Fn().length,o=ea().length;let s="continue";if(typeof window<"u"&&window.sessionStorage)try{const u=window.sessionStorage.getItem("cp_lib_active_tab");u&&["continue","completed","favorites","watchlist","all-episodes",...e?["downloads"]:[]].includes(u)&&(s=u)}catch{}return{html:`
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
  `,init:u=>{if(!u)return;let f=s,h="all",m="recent",y="";const g=u.querySelector("#lib-search-input"),w=u.querySelector("#lib-search-clear"),_=u.querySelector("#lib-sort-select"),p=u.querySelector("#lib-batch-clear-btn");let k=[];const T=async()=>{try{k=(await Ls()).map(V=>({id:V.tmdbId,title:String(V.seriesTitle||V.title).replace(/\s*[·-]\s*\d+\.\s*Sezon\s+\d+\.\s*Bölüm.*$/i,"").trim(),episodeTitle:V.title,poster_path:Xe(V.poster),poster_source:V.poster||"",poster_cache_key:V.posterCacheKey||"",backdrop_path:V.backdrop,type:V.type,isSeries:V.type==="tv"||V.season!==null&&V.episode!==null,season:V.season??null,episode:V.episode??null,sizeBytes:V.sizeBytes,mediaKind:V.mediaKind||"file",isDownloaded:!0,key:V.key,downloadedAt:V.downloadedAt}));const se=u.querySelector("#tab-count-downloads");se&&(se.textContent=k.length),f==="downloads"&&L()}catch{}};e&&T();const C=O=>O==="continue"?Fn():O==="completed"?ea():O==="favorites"?Jt():O==="watchlist"?Zt():O==="all-episodes"?Us():O==="downloads"?k:[],S=O=>O==="downloads"?`
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
          `:O==="continue"?`
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
          `:O==="completed"?`
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
          `:O==="favorites"?`
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
          `:O==="watchlist"?`
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
          `;let $=36;const L=()=>{const O=u.querySelector(`#tab-${f}`);if(!O)return;let V=C(f).filter(W=>{const re=(W.title||W.name||"").toLowerCase(),ue=xs(W);return(!y||re.includes(y.toLowerCase()))&&(h==="all"||ue===h)});if(m==="rating-desc"?V.sort((W,re)=>{const ue=parseFloat(W.vote_average||W.voteAverage||W.rating||0);return parseFloat(re.vote_average||re.voteAverage||re.rating||0)-ue}):m==="title-asc"?V.sort((W,re)=>{const ue=W.title||W.name||"",he=re.title||re.name||"";return ue.localeCompare(he,"tr")}):m==="year-desc"&&V.sort((W,re)=>{const ue=parseInt((W.release_date||W.first_air_date||W.year||"0").substring(0,4),10);return parseInt((re.release_date||re.first_air_date||re.year||"0").substring(0,4),10)-ue}),V.length===0)O.innerHTML=S(f);else if(f==="downloads"){const W=new Map,re=[];V.forEach(I=>{if(I.season!==null&&I.episode!==null){const H=String(I.id);W.has(H)||W.set(H,[]),W.get(H).push(I)}else re.push(I)});const he=[...[...W.values()].map(I=>({id:I[0].id,title:I[0].title,poster_path:I.find(H=>H.poster_path)?.poster_path||ht,poster_source:I.find(H=>H.poster_source)?.poster_source||"",poster_cache_key:I.find(H=>H.poster_cache_key)?.poster_cache_key||"",episodes:I.sort((H,J)=>H.season-J.season||H.episode-J.episode),latest:Math.max(...I.map(H=>H.downloadedAt||0))})).map(I=>({...I,cardType:"series"})),...re.map(I=>({...I,cardType:"movie"}))].sort((I,H)=>(H.latest||H.downloadedAt||0)-(I.latest||I.downloadedAt||0));O.innerHTML=`
            <div class="offline-download-list offline-download-poster-grid">
              ${he.map((I,H)=>I.cardType==="series"?`
                <article class="offline-series-card" data-series-index="${H}">
                  <button class="offline-series-toggle" type="button" aria-expanded="false">
                    <span class="offline-series-poster"><img src="${rt(I.poster_path||ht)}" data-offline-poster-key="${rt(I.poster_cache_key)}" data-offline-poster-source="${rt(I.poster_source)}" alt="${rt(I.title)} afişi" loading="lazy"><span class="offline-series-ready"><i data-lucide="check"></i> İNDİRİLDİ</span></span>
                    <span class="offline-series-summary"><strong>${rt(I.title)}</strong><small>${I.episodes.length} bölüm · ${new Set(I.episodes.map(J=>J.season)).size} sezon</small></span>
                    <i data-lucide="chevron-down" class="offline-series-chevron"></i>
                  </button>
                  <div class="offline-series-episodes" hidden>${[...new Set(I.episodes.map(J=>J.season))].sort((J,x)=>J-x).map(J=>`<section class="offline-series-season"><h3>Sezon ${J}</h3>${I.episodes.filter(x=>x.season===J).map(x=>`<article class="offline-series-episode" data-offline-key="${rt(x.key)}"><span class="offline-series-episode-no">${String(x.episode).padStart(2,"0")}</span><span class="offline-series-episode-copy"><strong>${rt(x.episodeTitle||x.title)}</strong><small>Bölüm ${x.episode} · ${Bt(x.sizeBytes)}</small></span><button class="offline-play-btn" type="button" aria-label="Oynat"><i data-lucide="play"></i></button><button class="btn-delete-history btn-lib-delete" title="Cihazdan sil" aria-label="Cihazdan sil"><i data-lucide="trash-2"></i></button></article>`).join("")}</section>`).join("")}</div>
                </article>`:`
                <article class="offline-series-card offline-movie-card" data-offline-key="${rt(I.key)}">
                  <span class="offline-series-poster"><img src="${rt(I.poster_path||ht)}" data-offline-poster-key="${rt(I.poster_cache_key)}" data-offline-poster-source="${rt(I.poster_source)}" alt="${rt(I.title)} afişi" loading="lazy"><span class="offline-series-ready"><i data-lucide="check"></i> İNDİRİLDİ</span></span>
                  <span class="offline-series-summary"><strong>${rt(I.title)}</strong><small>Film · ${Bt(I.sizeBytes)}</small></span>
                  <div class="offline-movie-actions"><button class="offline-play-btn" type="button"><i data-lucide="play"></i><span>Oynat</span></button><button class="btn-delete-history btn-lib-delete" title="Cihazdan sil" aria-label="Cihazdan sil"><i data-lucide="trash-2"></i></button></div>
                </article>`).join("")}
            </div>`,O.querySelectorAll(".offline-series-poster img").forEach(async I=>{I.addEventListener("error",()=>{I.dataset.fallbackApplied!=="true"&&(I.dataset.fallbackApplied="true",I.src=ht)},{once:!0});const H=I.dataset.offlinePosterKey;if(!H)return;const J=await Bc(H,I.dataset.offlinePosterSource||"");J&&I.isConnected&&(I.src=J)});const A=async(I,H)=>{if(!H)return;const J=I.querySelector(".offline-play-btn");J.disabled=!0;try{const x=await zc(H.id,H.season,H.episode);if(!x)throw new Error("İndirilen video dosyası bulunamadı.");ei({type:H.type==="movie"?"movie":"tv",isSeries:H.season!==null&&H.episode!==null,tmdbId:H.id,title:H.season!==null&&H.episode!==null?H.title.replace(/\s*[·-]\s*\d+\.\s*Sezon\s+\d+\.\s*Bölüm.*$/i,"").trim():H.title,seriesTitle:H.season!==null&&H.episode!==null?H.title.replace(/\s*[·-]\s*\d+\.\s*Sezon\s+\d+\.\s*Bölüm.*$/i,"").trim():"",season:H.season||1,episode:H.episode||1,posterPath:H.poster_path||"",backdropPath:H.backdrop_path||"",offlinePlaybackUrl:x,offlineMediaKind:H.mediaKind})}catch(x){X(x?.message||"İndirilen içerik açılamadı.","error")}finally{J.disabled=!1}},M=async I=>{if(!I||!window.confirm(`“${I.title}” indirilenlerden silinsin mi?`))return;await Qa(I.id,I.season,I.episode),k=k.filter(J=>String(J.key)!==String(I.key));const H=u.querySelector("#tab-count-downloads");H&&(H.textContent=String(k.length)),L(),X("İndirilen içerik cihazdan silindi.","success")};O.querySelectorAll(".offline-series-card:not(.offline-movie-card)").forEach((I,H)=>{const J=he.filter(U=>U.cardType==="series")[H],x=I.querySelector(".offline-series-toggle"),E=I.querySelector(".offline-series-episodes");x.addEventListener("click",()=>{const U=x.getAttribute("aria-expanded")!=="true";x.setAttribute("aria-expanded",String(U)),E.hidden=!U}),I.querySelectorAll(".offline-series-episode").forEach(U=>{const ee=J.episodes.find(ge=>String(ge.key)===U.dataset.offlineKey);U.querySelector(".offline-play-btn").addEventListener("click",()=>A(U,ee)),U.querySelector(".btn-lib-delete").addEventListener("click",()=>M(ee))})}),O.querySelectorAll(".offline-movie-card").forEach(I=>{const H=re.find(J=>String(J.key)===I.dataset.offlineKey);I.querySelector(".offline-play-btn").addEventListener("click",()=>A(I,H)),I.querySelector(".btn-lib-delete").addEventListener("click",()=>M(H))}),Z(O);return}else{const W=V.slice(0,$),re=V.length>$;O.innerHTML=`
            <div class="media-grid" id="grid-${f}">
              ${W.map(I=>el(I,f)).join("")}
            </div>
            ${re?`
              <div class="lib-load-more-wrap" style="text-align: center; margin: 2rem 0 1rem;">
                <button id="btn-lib-load-more" class="btn-secondary" style="padding: 0.6rem 1.8rem; border-radius: var(--radius-full); font-size: 0.88rem;">
                  <span>Daha Fazla Göster (${V.length-$} içerik daha)</span>
                </button>
                <div class="lib-scroll-sentinel" style="height: 1px; margin-top: 1rem;"></div>
              </div>
            `:""}
          `;const ue=O.querySelector(`#grid-${f}`),he=()=>{const I=ue.querySelectorAll(".library-card-item").length;if(I>=V.length){const U=O.querySelector(".lib-load-more-wrap");U&&U.remove();return}const H=V.slice(I,I+36);$=I+H.length;const J=H.map(U=>el(U,f)).join("");ue.insertAdjacentHTML("beforeend",J);const x=V.length-$,E=O.querySelector(".lib-load-more-wrap");if(x>0){const U=E?.querySelector("#btn-lib-load-more span");U&&(U.textContent=`Daha Fazla Göster (${x} içerik daha)`)}else E&&E.remove();Yo(H),Y(ue),Z(ue),mt(ue),yr(ue)},A=O.querySelector("#btn-lib-load-more");A&&A.addEventListener("click",he);const M=O.querySelector(".lib-scroll-sentinel");M&&"IntersectionObserver"in window&&new IntersectionObserver(H=>{H.some(J=>J.isIntersecting)&&he()},{rootMargin:"400px 0px"}).observe(M),Y(O),Yo(W),mt(O),yr(O)}if(p)if(f==="completed"||f==="all-episodes"||f==="continue"){p.classList.remove("hidden");const W=p.querySelector("span");W&&(W.textContent="Temizle"),f==="completed"?p.title="Tamamlananlar listesini temizle":f==="continue"?p.title="İzlemeye devam et listesini temizle":p.title="Bölüm izleme geçmişini temizle"}else p.classList.add("hidden");Z()},P=()=>{$=36,L()},B=u.querySelectorAll("#library-tabs .lib-nav-tab");B.forEach(O=>{O.addEventListener("click",se=>{se.preventDefault();const V=O.getAttribute("data-tab");if(f===V)return;if(B.forEach(re=>re.classList.remove("active")),O.classList.add("active"),f=V,typeof window<"u"&&window.sessionStorage)try{window.sessionStorage.setItem("cp_lib_active_tab",V)}catch{}u.querySelectorAll(".tab-content").forEach(re=>re.classList.add("hidden"));const W=u.querySelector(`#tab-${f}`);W&&W.classList.remove("hidden"),$=36,L()})});const z=()=>{const O=Hs(),se=u.querySelector("#stat-total-watch")||u.querySelector("#stat-total-time"),V=u.querySelector("#stat-eps-count")||u.querySelector("#stat-episodes-count"),W=u.querySelector("#stat-movies-count"),re=u.querySelector("#stat-favs-count");se&&(se.textContent=O.formattedTotal||O.formattedTotalTime||"0 dk"),V&&(V.textContent=`${O.totalEpisodes??O.episodesCount??0} Bölüm`),W&&(W.textContent=`${O.totalMovies??O.moviesCount??0} Film`),re&&(re.textContent=`${Jt().length+Zt().length} Yapım`);const ue=u.querySelector("#tab-count-continue"),he=u.querySelector("#tab-count-completed"),A=u.querySelector("#tab-count-favorites"),M=u.querySelector("#tab-count-watchlist"),I=u.querySelector("#tab-count-all-episodes");ue&&(ue.textContent=Fn().length),he&&(he.textContent=ea().length),A&&(A.textContent=Jt().length),M&&(M.textContent=Zt().length),I&&(I.textContent=Re().length)},Y=O=>{O&&O.querySelectorAll(".btn-lib-delete").forEach(se=>{se.addEventListener("click",V=>{V.stopPropagation();const W=se.closest(".library-card-item");if(!W)return;const re=W.getAttribute("data-id"),ue=parseInt(W.getAttribute("data-season")||"1",10),he=parseInt(W.getAttribute("data-episode")||"1",10),A=W.getAttribute("data-tab"),M=decodeURIComponent(W.getAttribute("data-title")||"İçerik");let I=`"${M}" kaydını silmek istediğinize emin misiniz?`;if(A==="all-episodes"?I=`"${M}" (Sezon ${ue}, Bölüm ${he}) izleme geçmişinizden silinsin mi?`:A==="continue"?I=`"${M}" devam et listesinden kaldırılsın mı?`:A==="completed"?I=`"${M}" tamamlananlar geçmişinden silinsin mi?`:A==="favorites"?I=`"${M}" favorilerinizden kaldırılsın mı?`:A==="watchlist"?I=`"${M}" izleme listenizden kaldırılsın mı?`:A==="downloads"&&(I=`"${M}" indirilmiş içerik cihazınızdan silinsin mi?`),window.confirm(I)){if(A==="all-episodes")wd(re,ue,he);else if(A==="continue"||A==="completed")Ca(re);else if(A==="favorites")yd(re);else if(A==="watchlist")vd(re);else if(A==="downloads"){const H=k.find(J=>String(J.id)===String(re)&&(J.season||1)===ue&&(J.episode||1)===he);Qa(re,H?.season??null,H?.episode??null),k=k.filter(J=>!(J.id===re&&J.season===ue&&J.episode===he))}X("✓ Kayıt başarıyla silindi.","success"),W.style.transition="all 0.28s ease-out",W.style.transform="scale(0.85)",W.style.opacity="0",setTimeout(()=>{W.remove(),z()},300)}})})};g&&g.addEventListener("input",O=>{y=O.target.value.trim(),w&&(w.style.display=y?"block":"none"),P()}),w&&w.addEventListener("click",()=>{g&&(g.value="",y="",w.style.display="none",P(),g.focus())});const K=u.querySelectorAll("#lib-type-filters .lib-segment-btn");K.forEach(O=>{O.addEventListener("click",()=>{K.forEach(se=>se.classList.remove("active")),O.classList.add("active"),h=O.getAttribute("data-filter")||"all",P()})}),_&&_.addEventListener("change",O=>{m=O.target.value,P()}),p&&p.addEventListener("click",()=>{let O="Bu listedeki tüm kayıtları silmek istediğinize emin misiniz?";f==="completed"?O="Tamamlananlar listesindeki tüm kayıtlar temizlensin mi?":f==="continue"?O="İzlemeye devam et listesindeki tüm yarım kalanlar temizlensin mi?":f==="all-episodes"&&(O="Tüm bölüm izleme geçmişiniz sıfırlansın mı?"),window.confirm(O)&&(f==="completed"||f==="continue"?qs():f==="all-episodes"&&bd(),X("✓ Liste başarıyla temizlendi.","success"),z(),L())});const N=u.querySelector("#lib-export-btn");N&&N.addEventListener("click",()=>{try{bl(),X("JSON yedekleme tamamlandı.","success")}catch(O){X(O?.message||"JSON yedeği kaydedilemedi.","error")}});const q=u.querySelector("#lib-import-btn"),j=u.querySelector("#lib-file-input");q&&j&&(q.addEventListener("click",()=>j.click()),j.addEventListener("change",O=>{if(O.target.files&&O.target.files.length>0){const se=O.target.files[0],V=new FileReader;V.onload=W=>{const re=wl(W.target.result,"merge");re.success?(Er(),z(),L(),mt(u),Z(),X(`✓ Yedek başarıyla yüklendi! (${re.countHistory} izleme, ${re.countFavs} favori aktarıldı)`,"success")):X(`Yükleme hatası: ${re.message||re.error}`,"error")},V.onerror=()=>X("Dosya okunamadı.","error"),V.readAsText(se)}}));const Q=u.querySelector("#lib-data-modal-btn");Q&&Q.addEventListener("click",()=>$l()),L(),mt(u),Z(),cd().then(()=>{z(),L()}).catch(()=>{});const ie=O=>{O&&O.detail&&O.detail.isProgressUpdate&&document.getElementById("player-modal")||(z(),L())};window.addEventListener("sineflix_data_changed",ie),window.addEventListener("cinepulse_data_changed",ie);const ne=()=>T();window.addEventListener("cinepulse_offline_changed",ne)}}}const xt=e=>String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),bh=(e,t)=>Number(e.season)-Number(t.season)||Number(e.episode)-Number(t.episode),tl=e=>String(e?.seriesTitle||e?.title||"").replace(/\s*[·-]\s*\d+\.\s*Sezon\s+\d+\.\s*Bölüm.*$/i,"").trim();function wh(){return{html:`
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
      </section>`,init:e=>{const t=e.querySelector("#downloads-page"),i=t?.querySelector("#downloads-list");if(!t||!i)return;const n=async()=>{try{const{total:s=0,free:c=0,isOriginQuota:u=!1}=await mh(),f=Math.max(0,s-c),h=s?Math.min(100,Math.round(f/s*100)):0;t.querySelector("#downloads-storage-text").textContent=s?`${Bt(c)} boş · ${Bt(s)} toplam${u?" (uygulama alanı)":""}`:"Depolama bilgisi alınamadı",t.querySelector("#downloads-storage-fill").style.width=`${h}%`}catch{t.querySelector("#downloads-storage-text").textContent="Depolama bilgisi alınamadı"}},r=async(s,c)=>{c.disabled=!0;try{const u=await zc(s.tmdbId,s.season,s.episode);if(!u)throw new Error("İndirilen video bulunamadı.");const f=s.season!==null&&s.episode!==null,h=tl(s);ei({type:s.type==="movie"?"movie":"tv",isSeries:f,isAnime:s.type==="anime",tmdbId:s.tmdbId,title:f?h:s.title,seriesTitle:f?h:"",season:s.season||1,episode:s.episode||1,posterPath:s.poster||"",backdropPath:s.backdrop||"",offlinePlaybackUrl:u,offlineMediaKind:s.mediaKind||"file"})}catch(u){X(u?.message||"İndirilen içerik açılamadı.","error")}finally{c.disabled=!1}},a=async s=>{const c=s.season!==null?`${s.title} · S${s.season} B${s.episode}`:s.title;window.confirm(`“${c}” cihazdan silinsin mi?`)&&(await Qa(s.tmdbId,s.season,s.episode),await o(),await n(),X("İndirilen içerik silindi.","success"))},o=async()=>{const s=await Ls();if(!t.isConnected)return;const c=new Map,u=[];for(const m of s)if(m.season!==null&&m.episode!==null){const y=String(m.tmdbId);c.has(y)||c.set(y,[]),c.get(y).push(m)}else u.push(m);const h=[...[...c.values()].map(m=>({title:tl(m[0]),tmdbId:m[0].tmdbId,poster:m.find(y=>y.poster)?.poster||"",posterCacheKey:m.find(y=>y.posterCacheKey)?.posterCacheKey||`series_${m[0].tmdbId}`,backdrop:m.find(y=>y.backdrop)?.backdrop||"",episodes:m.sort(bh),latest:Math.max(...m.map(y=>y.downloadedAt||0)),type:"series"})),...u.map(m=>({...m,type:"movie-card"}))].sort((m,y)=>(y.latest||y.downloadedAt||0)-(m.latest||m.downloadedAt||0));if(t.querySelector("#downloads-total").textContent=`${h.length} içerik · ${s.length} dosya`,!h.length){i.innerHTML='<div class="downloads-empty"><i data-lucide="cloud-download"></i><h3>Henüz içerik indirmedin</h3><p>Bir bölümü oynatıcıda açıp <b>İndir</b> düğmesine bas. İndirme ilerlemesini oradan görebilirsin.</p><a href="#home" class="downloads-browse-btn"><i data-lucide="compass"></i> İçeriklere göz at</a></div>',Z(i);return}i.innerHTML=h.map((m,y)=>{const g=xt(Xe(m.poster||"",je.POSTER_MEDIUM)),w=xt(m.poster||""),_=xt(m.posterCacheKey||(m.type==="movie-card"?`media_${m.key}`:""));if(m.type==="series"){const p=m.episodes.reduce((T,C)=>T+(Number(C.sizeBytes)||0),0),k=[...new Set(m.episodes.map(T=>Number(T.season)))].sort((T,C)=>T-C);return`<article class="download-series-card" data-group="${y}">
              <button type="button" class="download-series-open" aria-expanded="false">
                <span class="download-series-poster"><img src="${g||ht}" data-offline-poster-key="${_}" data-offline-poster-source="${w}" onerror="this.onerror=null;this.src='${ht}'" alt="${xt(m.title)} afişi" loading="lazy"></span>
                <span class="download-series-info"><strong>${xt(m.title)}</strong><span>${m.episodes.length} bölüm · ${k.length} sezon</span><small>${Bt(p)} · İnternetsiz izlenebilir</small><span class="download-ready-inline"><i data-lucide="check"></i> İNDİRİLDİ</span></span>
                <span class="download-series-chevron"><i data-lucide="chevron-down"></i></span>
              </button>
              <div class="download-episodes" hidden>${k.map(T=>{const C=m.episodes.filter(S=>Number(S.season)===T);return`<details class="download-season"><summary>Sezon ${T}<small>${C.length} indirilen bölüm</small></summary><div class="download-season-list">${C.map(S=>`<article class="download-episode-row" data-item-key="${xt(S.key)}"><span class="download-episode-number">${String(S.episode).padStart(2,"0")}</span><span class="download-episode-info"><strong>${xt(S.title)}</strong><small>Bölüm ${S.episode} · ${Bt(S.sizeBytes)} · ${new Date(S.downloadedAt||Date.now()).toLocaleDateString("tr-TR")}</small></span><button class="download-episode-play" type="button" aria-label="Bölüm ${S.episode} oynat"><i data-lucide="play"></i></button><button class="download-episode-delete" type="button" aria-label="Bölüm ${S.episode} sil"><i data-lucide="trash-2"></i></button></article>`).join("")}</div></details>`}).join("")}</div>
            </article>`}return`<article class="download-movie-card" data-item-key="${xt(m.key)}">
            <span class="download-series-poster"><img src="${g||ht}" data-offline-poster-key="${_}" data-offline-poster-source="${w}" onerror="this.onerror=null;this.src='${ht}'" alt="${xt(m.title)} afişi" loading="lazy"></span>
            <div class="download-series-info"><strong>${xt(m.title)}</strong><span>Film</span><small>${Bt(m.sizeBytes)} · İnternetsiz izlenebilir</small><span class="download-ready-inline"><i data-lucide="check"></i> İNDİRİLDİ</span></div>
            <div class="download-movie-actions"><button class="download-movie-play" type="button"><i data-lucide="play"></i> Oynat</button><button class="download-episode-delete" type="button" aria-label="Filmi sil"><i data-lucide="trash-2"></i></button></div>
          </article>`}).join(""),Z(i),i.querySelectorAll("img[data-offline-poster-key]").forEach(async m=>{const y=await Bc(m.dataset.offlinePosterKey,m.dataset.offlinePosterSource||"");y&&m.isConnected&&(m.onerror=null,m.src=y)}),i.querySelectorAll(".download-series-card").forEach((m,y)=>{const g=h.filter(p=>p.type==="series")[y],w=m.querySelector(".download-series-open"),_=m.querySelector(".download-episodes");w.addEventListener("click",()=>{const p=w.getAttribute("aria-expanded")!=="true";p&&i.querySelectorAll('.download-series-open[aria-expanded="true"]').forEach(k=>{k!==w&&(k.setAttribute("aria-expanded","false"),k.closest(".download-series-card")?.querySelector(".download-episodes")?.setAttribute("hidden",""))}),w.setAttribute("aria-expanded",String(p)),_.hidden=!p}),m.querySelectorAll(".download-episode-row").forEach((p,k)=>{const T=g.episodes.find(C=>String(C.key)===p.dataset.itemKey);p.querySelector(".download-episode-play").addEventListener("click",C=>r(T,C.currentTarget)),p.querySelector(".download-episode-delete").addEventListener("click",()=>a(T))})}),i.querySelectorAll(".download-movie-card").forEach(m=>{const y=u.find(g=>String(g.key)===m.dataset.itemKey);m.querySelector(".download-movie-play").addEventListener("click",g=>r(y,g.currentTarget)),m.querySelector(".download-episode-delete").addEventListener("click",()=>a(y))})};n(),o(),window.addEventListener("cinepulse_offline_changed",()=>{o(),n()}),Z(t)}}}const Se={currentType:"tv",currentGenreId:null,currentSortBy:"popularity.desc",currentMinRating:0,currentPlatform:null,currentYearRange:"all",currentPage:1,allItems:[],isExhausted:!1};async function kh(e="tv"){e&&e!==Se.currentType&&Se.allItems.length===0&&(Se.currentType=e);let t=Se.currentType,i=Se.currentGenreId,n=Se.currentSortBy,r=Se.currentMinRating,a=Se.currentPlatform,o=Se.currentYearRange,s=!1;const c=[{id:null,name:"Tüm Türler"},{id:vt.MYSTERY,name:"🩸 Korku & Gerilim"},{id:vt.ACTION_ADVENTURE,name:"💥 Aksiyon & Macera"},{id:vt.SCI_FI_FANTASY,name:"🚀 Bilim Kurgu & Fantastik"},{id:vt.DRAMA,name:"🎭 Dram"},{id:vt.COMEDY,name:"😂 Komedi"},{id:vt.CRIME,name:"🕵️ Suç & Polisiye"},{id:vt.ANIMATION,name:"🎌 Animasyon & Anime"},{id:vt.DOCUMENTARY,name:"🌍 Belgesel"},{id:vt.FAMILY,name:"👨‍👩‍👧‍👦 Aile & Gençlik"},{id:vt.WAR_POLITICS,name:"⚔️ Savaş & Politika"},{id:vt.WESTERN,name:"🤠 Western"}],u=[{id:null,name:"Tüm Türler"},{id:Ue.HORROR,name:"🩸 Korku"},{id:Ue.THRILLER,name:"⚡ Gerilim"},{id:Ue.ACTION,name:"💥 Aksiyon"},{id:Ue.ADVENTURE,name:"🗺️ Macera"},{id:Ue.SCI_FI,name:"🚀 Bilim Kurgu"},{id:Ue.FANTASY,name:"🧙‍♂️ Fantastik"},{id:Ue.DRAMA,name:"🎭 Dram"},{id:Ue.COMEDY,name:"😂 Komedi"},{id:Ue.CRIME,name:"🕵️ Suç"},{id:Ue.ANIMATION,name:"🎌 Animasyon"},{id:Ue.MYSTERY,name:"🔍 Gizem"},{id:Ue.ROMANCE,name:"💖 Romantik"},{id:Ue.DOCUMENTARY,name:"🌍 Belgesel"},{id:Ue.HISTORY,name:"🏰 Tarih & Savaş"},{id:Ue.FAMILY,name:"👨‍👩‍👧‍👦 Aile"},{id:Ue.MUSIC,name:"🎵 Müzikal"},{id:Ue.WESTERN,name:"🤠 Western"}],f=()=>t==="movie"?u:c,h=Se.allItems.length>0,m=h?Se.allItems.map(g=>_t(g)).join(""):'<div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">İçerikler yükleniyor...</div>';return{html:`
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
          ${m}
        </div>

        <!-- Scroll Sentinel / Loader -->
        <div id="discover-sentinel" style="height: 60px; display: flex; align-items: center; justify-content: center; margin-top: 2rem; color: var(--text-muted);">
          <i data-lucide="loader-2" class="spin-loader" style="width: 28px; height: 28px; display: none;"></i>
        </div>

      </div>
    </div>
  `,init:g=>{if(!g)return;const w=g.querySelector("#discover-type-tv"),_=g.querySelector("#discover-type-movie"),p=g.querySelector("#discover-type-anime"),k=g.querySelector("#discover-type-doc"),T=g.querySelector("#discover-platform-select"),C=g.querySelector("#discover-year-select"),S=g.querySelector("#discover-sort-select"),$=g.querySelector("#discover-rating-select"),L=g.querySelector("#discover-genre-bar"),P=g.querySelector("#discover-media-grid"),B=g.querySelector("#discover-sentinel"),z=B?B.querySelector(".spin-loader"):null;T&&T.addEventListener("change",()=>{a=T.value||null,Se.currentPlatform=a,q()}),C&&C.addEventListener("change",()=>{o=C.value||"all",Se.currentYearRange=o,q()});const Y=()=>{const ne=f();L.innerHTML=ne.map(O=>`
          <button class="genre-pill-btn ${i===O.id?"active":""}" data-genre-id="${O.id||""}">
            ${O.name}
          </button>
        `).join(""),L.querySelectorAll(".genre-pill-btn").forEach(O=>{O.addEventListener("click",()=>{const se=O.dataset.genreId?parseInt(O.dataset.genreId,10):null;i!==se&&(i=se,L.querySelectorAll(".genre-pill-btn").forEach(V=>V.classList.remove("active")),O.classList.add("active"),q())})})};let K=0;const N=async ne=>{const O=ne||K;if(s||Se.isExhausted)return;s=!0,z&&(z.style.display="block");const se=Se.currentPage||1;try{const V=t==="anime"||t==="documentary"?"tv":t,W=t==="anime",re=t==="documentary";let ue=n;n==="first_air_date.desc"&&V==="movie"&&(ue="primary_release_date.desc");let he=null,A=null;o==="2024-2026"?(he=2024,A=2026):o==="2020-2023"?(he=2020,A=2023):o==="2010-2019"?(he=2010,A=2019):o==="2000-2009"?(he=2e3,A=2009):o==="1990-1999"?(he=1990,A=1999):o==="before-1990"&&(he=1940,A=1989);const M=await xl({type:V,genreId:i,page:se,sortBy:ue,minRating:r,isAnime:W,isDoc:re,yearMin:he,yearMax:A,withNetworks:a});if(O!==K)return;if(z&&(z.style.display="none"),!M||M.length===0){se===1&&(P.innerHTML='<div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted); font-size: 1.05rem;">Bu filtre kriterlerine uygun içerik bulunamadı.</div>'),Se.isExhausted=!0;return}Se.allItems=[...Se.allItems,...M],Se.currentType=t,Se.currentGenreId=i,Se.currentSortBy=n,Se.currentMinRating=r;const I=M.map(H=>_t(H)).join("");se===1?P.innerHTML=I:P.insertAdjacentHTML("beforeend",I),Z(),mt(P),Se.currentPage=se+1}catch{if(O!==K)return;z&&(z.style.display="none"),se===1&&(!Se.allItems||Se.allItems.length===0)&&(P.innerHTML=`
              <div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">
                <p style="margin-bottom: 0.75rem;">İçerikler getirilirken bir sorun oluştu.</p>
                <button id="btn-retry-discover" class="btn-secondary" style="padding: 0.5rem 1.2rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
                  <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
                  <span>Tekrar Dene</span>
                </button>
              </div>
            `,Z(),P.querySelector("#btn-retry-discover")?.addEventListener("click",()=>{q()}))}finally{O===K&&(s=!1,z&&(z.style.display="none"))}},q=()=>{K++;const ne=K;Se.currentPage=1,Se.allItems=[],Se.isExhausted=!1,s=!1,P.innerHTML=`
          <div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">
            <div class="spin-loader" style="width: 32px; height: 32px; border: 3px solid rgba(245,158,11,0.2); border-top-color: #f59e0b; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem;"></div>
            <div>İçerikler yükleniyor...</div>
          </div>
        `,z&&(z.style.display="none"),N(ne)};Y(),h||N();let j=null;B&&"IntersectionObserver"in window&&(j=new IntersectionObserver(ne=>{ne[0].isIntersecting&&N()},{rootMargin:"0px 0px 600px 0px"}),j.observe(B));const Q=()=>{if(s||Se.isExhausted)return;const ne=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||0,O=window.innerHeight,se=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);ne+O>=se-700&&N()};window.addEventListener("scroll",Q,{passive:!0}),window.__discoverCleanup=()=>{j?.disconnect(),window.removeEventListener("scroll",Q)};const ie=ne=>{t!==ne&&(t=ne,i=null,[w,_,p,k].forEach(O=>O?.classList.remove("active")),ne==="tv"&&w?.classList.add("active"),ne==="movie"&&_?.classList.add("active"),ne==="anime"&&p?.classList.add("active"),ne==="documentary"&&k?.classList.add("active"),Y(),q())};w&&w.addEventListener("click",()=>ie("tv")),_&&_.addEventListener("click",()=>ie("movie")),p&&p.addEventListener("click",()=>ie("anime")),k&&k.addEventListener("click",()=>ie("documentary")),S&&S.addEventListener("change",ne=>{n=ne.target.value,q()}),$&&$.addEventListener("change",ne=>{r=parseFloat(ne.target.value),q()})}}}const $i={};function _h(e){const i=$t()?`${e}_kids`:e;return(!$i[i]||$i[i].stale)&&($i[i]={allItems:[],seenIds:new Set,nextPage:1,isExhausted:!1,stale:!1}),$i[i]}function Sh(e){if($t())switch(e){case"movie":return Ma;case"anime":return Pa;case"documentary":return Dd;case"cartoon":return Ra;default:return Ra}switch(e){case"movie":return rr;case"anime":return ar;case"documentary":return sr;case"cartoon":return ir;default:return nr}}async function en(e="tv"){const t=$t(),i=t?`${e}_kids`:e;$i[i]&&($i[i].stale=!0);const n=_h(e),r=t?{tv:["Türkiye’de Popüler Çizgi ve Gençlik Dizileri","monitor-play"],movie:["🎈 Animasyon & Çocuk Filmleri","popcorn"],anime:["Türkiye’de Popüler Çocuk ve Genç Animeleri","cat"],documentary:["🐾 Doğa & Hayvan Belgeselleri","globe"]}:{tv:["Tüm Zamanların En Popüler Dizileri","monitor-play"],cartoon:["Çizgi Dizi Dünyası & Unutulmaz Klasikler","wand-2"],movie:["Tüm Zamanların En Popüler Filmleri","popcorn"],anime:["Türkiye’de En Popüler Animeler","cat"],documentary:["Tüm Zamanların En Çok İzlenen Belgeselleri","globe"]},[a,o]=r[e]||r.tv;return{html:`
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
  `,init:u=>{if(!u)return;const f=u.querySelector("#popular-media-grid"),h=u.querySelector("#popular-sentinel");if(!f)return;mt(f);let m=!1;const y=Sh(e),g=()=>{h&&(n.isExhausted?h.innerHTML='<p style="color: var(--text-muted); font-size: 0.9rem;">Tüm popüler içerikler listelendi.</p>':h.innerHTML=`
            <div style="display: flex; align-items: center; gap: 0.6rem; color: var(--text-muted); font-size: 0.9rem;">
              <div class="spin-loader" style="width: 20px; height: 20px; border: 2px solid rgba(245,158,11,0.25); border-top-color: #f59e0b; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
              <span>Daha fazla içerik akıyor...</span>
            </div>
          `)},w=T=>{if(!T||T.length===0)return;const C=[];for(const L of T)L&&L.id&&!n.seenIds.has(L.id)&&(n.seenIds.add(L.id),C.push(L));if(C.length===0)return;n.allItems.push(...C);const S=C.map(L=>_t(L)).join("");f.querySelector(".popular-loading-placeholder")?f.innerHTML=S:f.insertAdjacentHTML("beforeend",S),mt(f),Z()},_=async(T=3)=>{if(!(m||n.isExhausted)){m=!0,g();try{const C=n.nextPage,S=Array.from({length:T},(Y,K)=>C+K);n.nextPage+=T;let $=0;const L=e==="anime"||e==="cartoon"||t&&e==="tv",P=S.map(Y=>y(Y).catch(()=>[])),B=await Promise.all(P),z=B.flat().filter(Boolean);if(L){const Y=e==="cartoon"?"_cartoonScore":"_turkeyPopularityScore";z.sort((K,N)=>(N[Y]||0)-(K[Y]||0)),$=z.length,w(z)}else for(const Y of B)Y&&Y.length>0&&($+=Y.length,w(Y));z.length===0&&(n.isExhausted=!0),g(),requestAnimationFrame(()=>{if(!n.isExhausted&&document.documentElement.scrollHeight<=window.innerHeight+600){m=!1,_(2);return}})}catch{}finally{m=!1,g()}}};_(1);let p=null;h&&"IntersectionObserver"in window&&(p=new IntersectionObserver(T=>{T[0].isIntersecting&&!m&&!n.isExhausted&&_(2)},{rootMargin:"0px 0px 1500px 0px"}),p.observe(h));const k=()=>{if(m||n.isExhausted)return;const T=window.scrollY||0,C=window.innerHeight,S=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);T+C>=S-1200&&_(2)};window.addEventListener("scroll",k,{passive:!0}),window.__popularListCleanup=()=>{p?.disconnect(),window.removeEventListener("scroll",k)}}}}function xh(){const e=new Set;let t=!1;const i=s=>{t?s():e.add(s)},n=(s,c,u,f)=>{t||(s.addEventListener(c,u,f),i(()=>s.removeEventListener(c,u,f)))},r=new Map,a=s=>{const c=r.get(s);c&&(c(),e.delete(c),r.delete(s))},o=(s,c,u)=>{if(t)return null;const f=globalThis[u?"setInterval":"setTimeout"](()=>{u||a(f),t||s()},c),h=()=>globalThis[u?"clearInterval":"clearTimeout"](f);return r.set(f,h),i(h),f};return{on:n,add:i,setTimeout:(s,c)=>o(s,c,!1),setInterval:(s,c)=>o(s,c,!0),clearTimeout:a,clearInterval:a,dispose(){if(!t){t=!0;for(const s of e)s();e.clear(),r.clear()}}}}function gm(e){const t=globalThis.window?.lucide;if(!(!e||!t?.createElement||!t.icons))for(const i of e.querySelectorAll("[data-lucide]:not(svg)")){const n=i.getAttribute("data-lucide"),r=n.replace(/(^|-)(\w)/g,(c,u,f)=>f.toUpperCase()),a=t.icons[r];if(!a)continue;const o=Object.fromEntries(Array.from(i.attributes,c=>[c.name,c.value]));o.class=`lucide lucide-${n} ${o.class||""}`;const s=t.createElement(a);for(const[c,u]of Object.entries(o))s.setAttribute(c,u);i.replaceWith(s)}}function Ct(e,t){const i=(e||"").replace(/ (HD|4K|TV|Kanalı)/gi,"").trim(),n=i.slice(0,5).toUpperCase(),a={"TRT 1":{bg:"linear-gradient(135deg, #b91c1c, #ef4444)",text:"#ffffff",tag:"TRT 1"},ATV:{bg:"linear-gradient(135deg, #c2410c, #f97316)",text:"#ffffff",tag:"ATV"},"SHOW TV":{bg:"linear-gradient(135deg, #6b21a8, #ec4899)",text:"#ffffff",tag:"SHOW"},"NOW TV":{bg:"linear-gradient(135deg, #991b1b, #ef4444)",text:"#ffffff",tag:"NOW"},"STAR TV":{bg:"linear-gradient(135deg, #b91c1c, #dc2626)",text:"#ffffff",tag:"STAR"},"KANAL D":{bg:"linear-gradient(135deg, #0369a1, #0284c7)",text:"#ffffff",tag:"KANAL D"},TV8:{bg:"linear-gradient(135deg, #ea580c, #f97316)",text:"#ffffff",tag:"TV8"},"CNBC-E":{bg:"linear-gradient(135deg, #047857, #10b981)",text:"#ffffff",tag:"CNBC-E"},"A2 TV":{bg:"linear-gradient(135deg, #991b1b, #ea580c)",text:"#ffffff",tag:"A2"},"KANAL 7":{bg:"linear-gradient(135deg, #0284c7, #38bdf8)",text:"#ffffff",tag:"KANAL 7"},"BEYAZ TV":{bg:"linear-gradient(135deg, #881337, #e11d48)",text:"#ffffff",tag:"BEYAZ"},TEVE2:{bg:"linear-gradient(135deg, #ca8a04, #eab308)",text:"#000000",tag:"TEVE2"},"TV 360":{bg:"linear-gradient(135deg, #581c87, #9333ea)",text:"#ffffff",tag:"360"},"TRT HABER":{bg:"linear-gradient(135deg, #831843, #db2777)",text:"#ffffff",tag:"HABER"},"A HABER":{bg:"linear-gradient(135deg, #991b1b, #f97316)",text:"#ffffff",tag:"A HABER"},NTV:{bg:"linear-gradient(135deg, #0369a1, #0284c7)",text:"#ffffff",tag:"NTV"},HABERTÜRK:{bg:"linear-gradient(135deg, #991b1b, #dc2626)",text:"#ffffff",tag:"HTÜRK"},"HALK TV":{bg:"linear-gradient(135deg, #b91c1c, #ef4444)",text:"#ffffff",tag:"HALK"},"S SPORT 1 HD":{bg:"linear-gradient(135deg, #065f46, #10b981)",text:"#ffffff",tag:"S SPORT 1"},"S SPORT 2 HD":{bg:"linear-gradient(135deg, #047857, #34d399)",text:"#ffffff",tag:"S SPORT 2"},"BEIN SPORTS HABER HD":{bg:"linear-gradient(135deg, #4c1d95, #7c3aed)",text:"#ffffff",tag:"BEIN HABER"},"BEIN SPORTS 3 HD":{bg:"linear-gradient(135deg, #3b0764, #6d28d9)",text:"#ffffff",tag:"BEIN 3"},"SPOR SMART 1 HD":{bg:"linear-gradient(135deg, #c2410c, #f97316)",text:"#ffffff",tag:"SMART 1"},"SPOR SMART 2 HD":{bg:"linear-gradient(135deg, #9a3412, #ea580c)",text:"#ffffff",tag:"SMART 2"},"EURO SPORT 1 HD":{bg:"linear-gradient(135deg, #1e3a8a, #2563eb)",text:"#ffffff",tag:"EURO 1"},"EURO SPORT 2 HD":{bg:"linear-gradient(135deg, #172554, #1d4ed8)",text:"#ffffff",tag:"EURO 2"},"TIVIBU SPOR 1 HD":{bg:"linear-gradient(135deg, #0284c7, #06b6d4)",text:"#ffffff",tag:"TİVİBU 1"},"TIVIBU SPOR 2 HD":{bg:"linear-gradient(135deg, #0369a1, #0284c7)",text:"#ffffff",tag:"TİVİBU 2"},"TIVIBU SPOR 3 HD":{bg:"linear-gradient(135deg, #075985, #0369a1)",text:"#ffffff",tag:"TİVİBU 3"},"FX KANALI HD":{bg:"linear-gradient(135deg, #18181b, #27272a)",text:"#fbbf24",tag:"FX"},"SINEMA TV HD":{bg:"linear-gradient(135deg, #713f12, #a16207)",text:"#fef08a",tag:"SINEMA"},"NATIONAL GEOGRAPHIC HD":{bg:"linear-gradient(135deg, #000000, #18181b)",text:"#fbbf24",tag:"NAT GEO"},"DISCOVERY CHANNEL HD":{bg:"linear-gradient(135deg, #0284c7, #06b6d4)",text:"#ffffff",tag:"DISCOVERY"},"DMAX HD":{bg:"linear-gradient(135deg, #111827, #1f2937)",text:"#38bdf8",tag:"DMAX"},"TLC HD":{bg:"linear-gradient(135deg, #831843, #db2777)",text:"#ffffff",tag:"TLC"},"CARTOON NETWORK":{bg:"linear-gradient(135deg, #000000, #27272a)",text:"#ffffff",tag:"CARTOON"},"NICKELODEON HD":{bg:"linear-gradient(135deg, #ea580c, #f97316)",text:"#ffffff",tag:"NICK"}}[i.toUpperCase()]||{bg:"linear-gradient(135deg, #1e293b, #334155)",text:"#ffffff",tag:n},o=`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
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
  </svg>`;return`data:image/svg+xml;utf8,${encodeURIComponent(o)}`}const Eh=[{id:"all",name:"Tüm Kanallar",icon:"tv"},{id:"favorites",name:"⭐ Favorilerim",icon:"star"},{id:"national",name:"Ulusal & Sinema",icon:"home"},{id:"sports",name:"Spor",icon:"trophy"},{id:"news",name:"Haber",icon:"newspaper"},{id:"doc",name:"Belgesel",icon:"compass"},{id:"kids",name:"Çocuk",icon:"smile"},{id:"music",name:"Müzik",icon:"music"}],Th=[{id:"ch_trt1",name:"TRT 1",category:"national",logo:"/tv-logos/trt-1.png",quality:"1080p FHD",streamUrl:"https://tv-trt1.medya.trt.com.tr/master.m3u8"},{id:"ch_atv",name:"ATV",category:"national",logo:"/tv-logos/atv.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/atv/atv_1080p.m3u8"},{id:"ch_showtv",name:"Show TV",category:"national",logo:"/tv-logos/show-tv.png",quality:"1080p FHD",streamUrl:"https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/showtv/showtv.m3u8"},{id:"ch_nowtv",name:"NOW TV",category:"national",logo:"/tv-logos/now-tv.png",quality:"1080p FHD",streamUrl:"https://uycyyuuzyh.turknet.ercdn.net/nphindgytw/nowtv/nowtv.m3u8"},{id:"ch_startv",name:"Star TV",category:"national",logo:"/tv-logos/star-tv.png",quality:"1080p FHD",streamUrl:"https://dygvideo.dygdigital.com/live/hls/startv4puhu/live.m3u8"},{id:"ch_kanald",name:"Kanal D",category:"national",logo:"/tv-logos/kanal-d.png",quality:"1080p FHD",streamUrl:"https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/kanald/kanald.m3u8"},{id:"ch_tv8",name:"TV8",category:"national",logo:"/tv-logos/tv8.png",quality:"480p",streamUrl:"https://rkhubpaomb.turknet.ercdn.net/fwjkgpasof/tv8/tv8_480p.m3u8"},{id:"ch_cnbce",name:"CNBC-e",category:"national",logo:"/tv-logos/cnbc-e.png",quality:"1080p FHD",streamUrl:"https://hnpsechtsc.turknet.ercdn.net/xpnvudnlsv/cnbc-e/cnbc-e.m3u8"},{id:"ch_a2",name:"A2 TV",category:"national",logo:"/tv-logos/a2.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/a2tv/a2tv.m3u8"},{id:"ch_kanal7",name:"Kanal 7",category:"national",logo:"/tv-logos/kanal-7.png",quality:"1080p FHD",streamUrl:"https://kanal7-live.daioncdn.net/kanal7/kanal7.m3u8"},{id:"ch_beyaztv",name:"Beyaz TV",category:"national",logo:"/tv-logos/beyaz-tv.png",quality:"1080p FHD",streamUrl:"https://beyaztv-live.daioncdn.net/beyaztv/beyaztv.m3u8"},{id:"ch_teve2",name:"Teve2",category:"national",logo:"/tv-logos/teve2.png",quality:"1080p FHD",streamUrl:"https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/teve2/teve2.m3u8"},{id:"ch_tv360",name:"TV 360",category:"national",logo:"/tv-logos/tv-360.png",quality:"1080p FHD",streamUrl:"https://turkmedya-live.ercdn.net/tv360/tv360.m3u8"},{id:"ch_trthaber",name:"TRT Haber",category:"news",logo:"/tv-logos/trt-haber.png",quality:"1080p FHD",streamUrl:"https://tv-trthaber.medya.trt.com.tr/master.m3u8"},{id:"ch_ahaber",name:"A Haber",category:"news",logo:"/tv-logos/a-haber.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/ahaber/ahaber.m3u8"},{id:"ch_ntv",name:"NTV",category:"news",logo:"/tv-logos/ntv.png",quality:"1080p FHD",streamUrl:"https://dygvideo.dygdigital.com/live/hls/ntv4puhu/live.m3u8"},{id:"ch_haberturk",name:"Habertürk",category:"news",logo:"/tv-logos/haberturk.png",quality:"1080p FHD",streamUrl:"https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/haberturktv/haberturktv.m3u8"},{id:"ch_halktv",name:"Halk TV",category:"news",logo:"/tv-logos/halk-tv.png",quality:"1080p FHD",streamUrl:"https://halktv-live.daioncdn.net/halktv/halktv.m3u8"},{id:"ch_tele1",name:"Tele1",category:"news",logo:"/tv-logos/tele1.png",quality:"1080p FHD",streamUrl:"https://tele1-live.ercdn.net/tele1/tele1.m3u8"},{id:"ch_tv100",name:"TV 100",category:"news",logo:"/tv-logos/tv100.png",quality:"1080p FHD",streamUrl:"https://tv.ensonhaber.com/tv100/tv100.m3u8"},{id:"ch_bloomberg",name:"Bloomberg HT",category:"news",logo:"/tv-logos/bloomberg-ht.png",quality:"1080p FHD",streamUrl:"https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/bloomberght/bloomberght.m3u8"},{id:"ch_tv24",name:"24 TV",category:"news",logo:"/tv-logos/tv24.png",quality:"1080p FHD",streamUrl:"https://tv.ensonhaber.com/tv24/tv24.m3u8"},{id:"ch_ulketv",name:"Ülke TV",category:"news",logo:"/tv-logos/ulke-tv.png",quality:"1080p FHD",streamUrl:"https://livetv.radyotvonline.net/kanal7live/ulketv/playlist.m3u8"},{id:"ch_trtspor",name:"TRT Spor",category:"sports",logo:"/tv-logos/trt-spor.png",quality:"1080p FHD",streamUrl:"https://tv-trtspor1.medya.trt.com.tr/master.m3u8"},{id:"ch_trtspor2",name:"TRT Spor Yıldız",category:"sports",logo:"/tv-logos/trt-spor-yildiz.png",quality:"1080p FHD",streamUrl:"https://tv-trtspor2.medya.trt.com.tr/master.m3u8"},{id:"ch_aspor",name:"A Spor",category:"sports",logo:"/tv-logos/a-spor.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/aspor/aspor.m3u8"},{id:"ch_dmax",officialLiveId:"dmax",name:"DMAX HD",category:"doc",logo:"/tv-logos/dmax.png",quality:"1080p",streamUrl:"/api/live_tv_stream?channel=dmax"},{id:"ch_tlc",officialLiveId:"tlc",name:"TLC HD",category:"doc",logo:"/tv-logos/tlc.png",quality:"1080p",streamUrl:"/api/live_tv_stream?channel=tlc"},{id:"ch_trtbelgesel",name:"TRT Belgesel",category:"doc",logo:"/tv-logos/trt-belgesel.png",quality:"1080p FHD",streamUrl:"https://tv-trtbelgesel.medya.trt.com.tr/master.m3u8"},{id:"ch_tgrtbelgesel",name:"TGRT Belgesel",category:"doc",logo:Ct("TGRT Belgesel"),quality:"1080p FHD",streamUrl:"https://b01c02nl.mediatriple.net/videoonlylive/mtsxxkzwwuqtglive/broadcast_5fe462afc6a0e.smil/playlist.m3u8"},{id:"ch_ciftcitv",name:"Çiftçi TV",category:"doc",logo:Ct("Çiftçi TV"),quality:"720p",streamUrl:"https://live.artidijitalmedya.com/artidijital_ciftcitv/ciftcitv/chunks.m3u8"},{id:"ch_kanalv",name:"Kanal V",category:"doc",logo:Ct("Kanal V"),quality:"720p",streamUrl:"https://live.artidijitalmedya.com/artidijital_kanalv/kanalv/chunks.m3u8"},{id:"ch_trtcocuk",name:"TRT Çocuk",category:"kids",logo:"/tv-logos/trt-cocuk.png",quality:"1080p FHD",streamUrl:"https://tv-trtcocuk.medya.trt.com.tr/master.m3u8"},{id:"ch_minikago",name:"Minika GO",category:"kids",logo:"/tv-logos/minika-go.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/minikago/minikago.m3u8"},{id:"ch_trtmuzik",name:"TRT Müzik",category:"music",logo:"/tv-logos/trt-muzik.png",quality:"480p",streamUrl:"https://tv-trtmuzik.medya.trt.com.tr/master_480.m3u8"},{id:"ch_kralpop",name:"Kral Pop",category:"music",logo:"/tv-logos/kral-pop.png",quality:"1080p FHD",streamUrl:"https://dygvideo.dygdigital.com/live/hls/kralpoptv/live.m3u8"},{id:"ch_powerturk",name:"Power Türk",category:"music",logo:"/tv-logos/powerturk.png",quality:"1080p FHD",streamUrl:"https://powerlive.daioncdn.net/powerturktv/powerturktv.m3u8"},{id:"ch_dreamturk",name:"Dream Türk",category:"music",logo:"/tv-logos/dream-turk.png",quality:"1080p FHD",streamUrl:"https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/dreamturk/dreamturk.m3u8"},{id:"ch_tempotv",name:"Tempo TV",category:"music",logo:Ct("Tempo TV"),quality:"720p",streamUrl:"https://live.artidijitalmedya.com/artidijital_tempotv/tempotv/chunks.m3u8"}],_r="cinepulse_epg_live_cache",Oc=30*60*1e3;let kt=null,il=0,xa=!1,fn=null;const Ah={ch_cnbce:[{start:"07:00",end:"10:00",title:"Sabah Piyasaları & Finans"},{start:"10:00",end:"14:00",title:"Piyasa Ekranı & Global Trendler"},{start:"14:00",end:"18:00",title:"Kapanışa Doğru"},{start:"18:00",end:"20:00",title:"The Simpsons"},{start:"20:00",end:"21:00",title:"Mad Men"},{start:"21:00",end:"23:00",title:"Game of Thrones Kuşağı"},{start:"23:00",end:"01:00",title:"Late Night Show"},{start:"01:00",end:"07:00",title:"Gece Finans & Belgesel"}]},nl={sports:[{start:"06:00",end:"09:00",title:"Spor Bülteni & Günün Manşetleri"},{start:"09:00",end:"12:00",title:"Maç Özetleri & Goller Kuşağı"},{start:"12:00",end:"14:00",title:"Öğle Sporu & Transfer Raporu"},{start:"14:00",end:"17:00",title:"Uluslararası Ligler & Analiz"},{start:"17:00",end:"19:00",title:"Maç Önü & Stüdyo Analizi"},{start:"19:00",end:"21:30",title:"Canlı Karşılaşma / Canlı Yayın"},{start:"21:30",end:"23:45",title:"Dev Maç Özel Yayını"},{start:"23:45",end:"02:00",title:"Son Sayfa & Tartışma Programı"},{start:"02:00",end:"06:00",title:"Gecenin Maçları (Tekrar)"}],news:[{start:"06:00",end:"09:00",title:"Güne Başlarken & Sabah Raporu"},{start:"09:00",end:"12:00",title:"Ekonomi ve Politika Gündemi"},{start:"12:00",end:"14:00",title:"Gün Ortası Bülteni"},{start:"14:00",end:"17:00",title:"Sıcak Gelişmeler & Canlı Bağlantılar"},{start:"17:00",end:"19:00",title:"Akşam Bülteni & Manşetler"},{start:"19:00",end:"20:30",title:"Ana Haber Bülteni"},{start:"20:30",end:"23:30",title:"Türkiye'nin Nabzı & Açık Oturum"},{start:"23:30",end:"01:30",title:"Gece Raporu & Dünya Basını"},{start:"01:30",end:"06:00",title:"Gece Bülteni"}],doc:[{start:"06:00",end:"09:00",title:"Vahşi Yaşamın İzinde"},{start:"09:00",end:"12:00",title:"Evrenin Gizemleri ve Uzay"},{start:"12:00",end:"15:00",title:"Mega Yapılar & Mühendislik"},{start:"15:00",end:"18:00",title:"Tarihin Bilinmeyen Sayfaları"},{start:"18:00",end:"20:00",title:"Okyanusların Derinlikleri"},{start:"20:00",end:"22:00",title:"Büyük Kediler: Hayatta Kalma"},{start:"22:00",end:"00:30",title:"Dünyanın En Gizemli Keşifleri"},{start:"00:30",end:"06:00",title:"Gece Belgesel Kuşağı"}],kids:[{start:"06:00",end:"09:00",title:"Sabah Neşesi Çizgi Filmler"},{start:"09:00",end:"12:00",title:"Eğlenceli Maceralar & Kahramanlar"},{start:"12:00",end:"15:00",title:"Sevimli Dostlar & Bilim Zamanı"},{start:"15:00",end:"18:00",title:"Süper Kahramanlar Kuşağı"},{start:"18:00",end:"20:30",title:"Akşam Aile Sineması"},{start:"20:30",end:"22:30",title:"Fantastik Çizgi Dizi"},{start:"22:30",end:"06:00",title:"Gece Masalları"}],music:[{start:"06:00",end:"10:00",title:"Güne Enerjik Başla (Top 20 Pop)"},{start:"10:00",end:"14:00",title:"Hit Müzik & Radyo Şarkıları"},{start:"14:00",end:"18:00",title:"Trendler & En Çok Dinlenenler"},{start:"18:00",end:"21:00",title:"Akşam Ritimleri & Klip Kuşağı"},{start:"21:00",end:"23:30",title:"Canlı Akustik & Popüler Klipler"},{start:"23:30",end:"02:00",title:"Gece Chill & Deep House"},{start:"02:00",end:"06:00",title:"Kesintisiz Gece Müziği"}],national:[{start:"06:00",end:"09:00",title:"Sabah Programı & Magazin"},{start:"09:00",end:"12:00",title:"Gündüz Kuşağı Programı"},{start:"12:00",end:"14:00",title:"Gün Ortası & Yemek Programı"},{start:"14:00",end:"17:00",title:"Popüler Dizi Tekrar Kuşağı"},{start:"17:00",end:"19:00",title:"Yarışma Kuşağı"},{start:"19:00",end:"20:00",title:"Akşam Ana Haber"},{start:"20:00",end:"23:30",title:"Prime Time Sinema / Dizi"},{start:"23:30",end:"02:00",title:"Gece Sineması"},{start:"02:00",end:"06:00",title:"Gece Kuşağı"}]};function rl(e){if(!e||!e.includes(":"))return 0;const[t,i]=e.split(":").map(Number);return(t||0)*60+(i||0)}function Ch(){try{const e=(typeof window<"u"&&window.sessionStorage?sessionStorage.getItem(_r):null)||(typeof window<"u"&&window.localStorage?localStorage.getItem(_r):null);if(!e)return null;const t=JSON.parse(e);if(t&&t.channels&&Date.now()-(t.updatedAt||0)<12*3600*1e3)return t.channels}catch{}return null}function Lh(e){try{typeof window<"u"&&window.sessionStorage&&sessionStorage.setItem(_r,JSON.stringify({updatedAt:Date.now(),channels:e})),typeof window<"u"&&window.localStorage&&localStorage.removeItem(_r)}catch{}}async function al(e=!1){const t=Date.now();if(!e&&kt&&t-il<Oc||xa)return kt;xa=!0;try{let i=null;try{i=await fetch("/api/epg")}catch{}if((!i||!i.ok)&&(i=await fetch("/epg-data.json")),i&&i.ok){const n=await i.json();n&&n.channels&&Object.keys(n.channels).length>0&&(kt=n.channels,il=t,Lh(n.channels),window.dispatchEvent(new CustomEvent("epg-updated",{detail:{count:Object.keys(n.channels).length}})))}}catch{}finally{xa=!1}return kt}function $h(){if(!kt){const e=Ch();e&&(kt=e)}al(),fn===null&&(fn=setInterval(()=>{al(!0)},Oc))}function Rh(){fn!==null&&(clearInterval(fn),fn=null)}function qn(e){if(!e)return{title:"Canlı Yayın",timeRange:"Canlı Akış",start:"00:00",end:"23:59",progress:50,remainingMin:30,nextTitle:"Yayın Akışı"};const t=Date.now();if(kt&&kt[e.id]&&kt[e.id].length>0){const a=kt[e.id];for(let s=0;s<a.length;s++){const c=a[s];if(t>=c.startTs&&t<c.endTs){const u=Math.max(1,(c.endTs-c.startTs)/6e4),f=Math.max(0,(t-c.startTs)/6e4),h=Math.min(100,Math.max(0,Math.round(f/u*100))),m=Math.max(1,Math.round((c.endTs-t)/6e4)),y=a[s+1];return{title:c.title,timeRange:`${c.start} - ${c.end}`,start:c.start,end:c.end,progress:h,remainingMin:m,nextTitle:y?y.title:"Sonraki Program"}}}const o=a.find(s=>s.startTs>t);if(o)return{title:o.title,timeRange:`${o.start} - ${o.end}`,start:o.start,end:o.end,progress:5,remainingMin:Math.max(1,Math.round((o.endTs-t)/6e4)),nextTitle:"Yayın Başlamak Üzere"}}const i=new Date,n=i.getHours()*60+i.getMinutes();let r=Ah[e.id];r||(r=nl[e.category]||nl.national);for(let a=0;a<r.length;a++){const o=r[a],s=rl(o.start);let c=rl(o.end);c<=s&&(c+=24*60);let u=n;if(s>c-24*60&&n<s&&n<c%(24*60)&&(u+=24*60),u>=s&&u<c){const f=c-s,h=u-s,m=Math.min(100,Math.max(0,Math.round(h/f*100))),y=Math.max(1,c-u),g=r[(a+1)%r.length];return{title:o.title,timeRange:`${o.start} - ${o.end}`,start:o.start,end:o.end,progress:m,remainingMin:y,nextTitle:g?g.title:"Sonraki Program"}}}return{title:`${e.name} Canlı Yayın`,timeRange:"Canlı Akış",start:"00:00",end:"23:59",progress:50,remainingMin:30,nextTitle:"Yayın Akışı Devam Ediyor"}}const Nc="cinepulse_live_favs";function sl(){try{const e=localStorage.getItem(Nc);return e?JSON.parse(e):[]}catch{return[]}}function Ih(e){try{localStorage.setItem(Nc,JSON.stringify(e))}catch{}}function Mh(){const e=$t(),t=[...Th],i=e?t.filter(p=>p.category==="kids"):t;let n=e?"kids":"all",r=e?i.find(p=>p.id==="ch_trtcocuk")||i[0]:t.find(p=>p.id==="ch_trt1")||t[0],a="",o=null,s=!1,c=1,u=null,f=null;function h(p){return sl().includes(p)}function m(p){let k=sl();k.includes(p)?(k=k.filter(T=>T!==p),X("Favorilerden çıkarıldı","info")):(k.push(p),X("Favorilere eklendi ⭐","success")),Ih(k),w()}function y(){return i.filter(p=>{let k=!0;n==="favorites"?k=h(p.id):n!=="all"&&(k=p.category===n);const T=!a||p.name.toLowerCase().includes(a.toLowerCase());return k&&T})}function g(p){return i.findIndex(k=>k.id===p.id)}let w=()=>{};return{html:`
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
              <img class="tv-pip-logo" id="tv-pip-logo" src="${r.logo}" alt="" onerror="this.onerror=null; this.src='${Ct(r.name,r.category)}';" />
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
                <img id="tv-top-logo" class="tv-top-logo" src="${r.logo}" alt="" onerror="this.onerror=null; this.src='${Ct(r.name,r.category)}';" />
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
              ${Eh.map(p=>`
                <button class="tv-cat-filter-btn ${p.id===n?"active":""}" data-cat="${p.id}">
                  <i data-lucide="${p.icon}" style="width:14px;height:14px;"></i>
                  <span>${p.name}</span>
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
  `,init:p=>{if(!p)return;$h();const k=xh(),{setTimeout:T,clearTimeout:C,setInterval:S,clearInterval:$}=k,L=p.querySelector("#tv-video"),P=p.querySelector("#tv-screen"),B=p.querySelector("#tv-hero-player-section"),z=p.querySelector("#tv-screen-placeholder"),Y=p.querySelector("#tv-screen-backdrop");p.querySelector("#tv-osd-topbar");const K=p.querySelector("#tv-top-logo"),N=p.querySelector("#tv-top-name"),q=p.querySelector("#tv-top-num"),j=p.querySelector("#tv-top-epg-title"),Q=p.querySelector("#tv-top-epg-prog");p.querySelector("#tv-pip-header");const ie=p.querySelector("#tv-pip-logo"),ne=p.querySelector("#tv-pip-name"),O=p.querySelector("#tv-pip-epg"),se=p.querySelector("#tv-pip-expand"),V=p.querySelector("#tv-pip-close"),W=p.querySelector("#tv-osd"),re=p.querySelector("#tv-osd-logo"),ue=p.querySelector("#tv-osd-name"),he=p.querySelector("#tv-osd-quality"),A=p.querySelector("#tv-osd-chnum"),M=p.querySelector("#tv-osd-epg-sub"),I=p.querySelector("#tv-loading"),H=p.querySelector("#tv-error"),J=p.querySelector("#tv-retry-btn"),x=p.querySelector("#tv-error-next-btn"),E=p.querySelector("#tv-btn-play-pause"),U=p.querySelector("#tv-btn-prev-ch"),ee=p.querySelector("#tv-btn-next-ch"),ge=p.querySelector("#tv-btn-sync"),oe=p.querySelector("#tv-btn-mute"),le=p.querySelector("#tv-volume-slider"),Ye=p.querySelector("#tv-btn-reload"),Oe=p.querySelector("#tv-btn-fullscreen"),nt=p.querySelector("#tv-btn-quality"),Ge=p.querySelector("#tv-quality-badge"),Ee=p.querySelector("#tv-quality-menu"),Qe=p.querySelector("#tv-quality-options"),ct=p.querySelector("#tv-btn-numpad"),Ce=p.querySelector("#tv-numpad-modal"),qe=p.querySelector("#tv-numpad-modal-backdrop"),v=p.querySelector("#tv-numpad-close"),l=p.querySelector("#tv-pad-display-val"),d=p.querySelector("#tv-pad-display-sub"),b=p.querySelector("#tv-numpad-hud"),R=p.querySelector("#tv-numpad-hud-digits"),D=p.querySelector("#tv-numpad-hud-name"),F=p.querySelector("#tv-channel-grid"),ae=p.querySelector("#tv-search"),ve=p.querySelector("#tv-search-clear"),fe=p.querySelector("#tv-category-strip"),Te=p.querySelector("#tv-cat-prev"),_e=p.querySelector("#tv-cat-next"),$s=p.querySelector("#tv-guide-count");function Sn(){const G=g(r)+1,te=qn(r);N&&(N.textContent=r.name),q&&(q.textContent=`CH ${String(G).padStart(2,"0")}`),j&&(j.textContent=`${te.title} (${te.timeRange})`),Q&&(Q.textContent=`%${te.progress}`),K&&(K.src=r.logo,K.onerror=()=>{K.onerror=null,K.src=Ct(r.name,r.category)}),ne&&(ne.textContent=r.name),O&&(O.textContent=`${te.title} (%${te.progress})`),ie&&(ie.src=r.logo,ie.onerror=()=>{ie.onerror=null,ie.src=Ct(r.name,r.category)})}function Rs(){Sn(),F&&F.querySelectorAll(".tv-grid-card").forEach(te=>{const ye=te.getAttribute("data-id"),ke=t.find(Tn=>Tn.id===ye);if(!ke)return;const ce=qn(ke),Fe=te.querySelector(".tv-epg-title"),Ae=te.querySelector(".tv-epg-time"),St=te.querySelector(".tv-epg-bar-fill"),He=te.querySelector(".tv-epg-pct");Fe&&Fe.textContent!==ce.title&&(Fe.textContent=ce.title,Fe.title=ce.title),Ae&&Ae.textContent!==ce.timeRange&&(Ae.textContent=ce.timeRange),St&&(St.style.width=`${ce.progress}%`),He&&He.textContent!==`%${ce.progress}`&&(He.textContent=`%${ce.progress}`)})}const Kr=()=>{Rs()};k.on(window,"epg-updated",Kr);let Is=S(()=>{if(!document.body.contains(p)){$(Is),window.removeEventListener("epg-updated",Kr);return}Rs()},2e4);function Kc(){f&&C(f);const G=g(r),te=qn(r);re&&(re.src=r.logo,re.onerror=()=>{re.onerror=null,re.src=Ct(r.name,r.category)}),ue&&(ue.textContent=r.name),he&&(he.textContent=r.quality),A&&(A.textContent=String(G+1).padStart(2,"0")),M&&(M.textContent=`📺 ${te.title} • %${te.progress} tamamlandı`),W.classList.remove("hidden"),W.classList.add("tv-osd-show"),f=T(()=>{W.classList.remove("tv-osd-show"),W.classList.add("tv-osd-hide"),T(()=>{W.classList.add("hidden"),W.classList.remove("tv-osd-hide")},350)},2500)}function xn(){P.classList.add("user-active"),u&&C(u),u=T(()=>{P.classList.remove("user-active"),Ee&&Ee.classList.add("hidden")},3500)}P.addEventListener("mousemove",xn),P.addEventListener("touchstart",xn,{passive:!0}),Y&&(Y.addEventListener("click",G=>{G.stopPropagation(),P.classList.contains("user-active")?(P.classList.remove("user-active"),u&&C(u),Ee&&Ee.classList.add("hidden")):xn()}),Y.addEventListener("dblclick",G=>{G.stopPropagation(),Oe&&Oe.click()}));function Ki(G){G=Math.max(0,Math.min(1,G)),c=G,L.volume=G,le&&(le.value=G),G===0?(s=!0,L.muted=!0,oe&&(oe.innerHTML='<i data-lucide="volume-x" style="width:18px;height:18px;color:#ef4444;"></i>')):(s=!1,L.muted=!1,oe&&(oe.innerHTML='<i data-lucide="volume-2" style="width:18px;height:18px;"></i>')),Z()}le&&le.addEventListener("input",G=>{Ki(parseFloat(G.target.value))}),oe&&oe.addEventListener("click",G=>{G.stopPropagation(),s?(Ki(c||.8),X("Ses açıldı","info")):(L.muted=!0,s=!0,oe.innerHTML='<i data-lucide="volume-x" style="width:18px;height:18px;color:#ef4444;"></i>',Z(),X("Sessize alındı","info"))}),E&&E.addEventListener("click",G=>{G.stopPropagation(),L.paused?(L.play(),E.innerHTML='<i data-lucide="pause" style="width:18px;height:18px;"></i>'):(L.pause(),E.innerHTML='<i data-lucide="play" style="width:18px;height:18px;"></i>'),Z()}),ge&&ge.addEventListener("click",G=>{G.stopPropagation(),o&&L.seekable&&L.seekable.length>0?(L.currentTime=L.seekable.end(L.seekable.length-1),L.play(),X("Canlı yayına eşitlendi","info")):ii(r)});function Wr(G){if(!Qe||!Ge)return;if(!G||!G.levels||G.levels.length<=1){Ge.textContent=r.quality?r.quality.split(" ")[0]:"HD",Qe.innerHTML=`
            <button class="tv-quality-opt active" data-level="-1">
              <i data-lucide="check" style="width:13px;height:13px;color:#fbbf24;"></i>
              <span>Kaynak Kalite (${r.quality||"1080p"})</span>
            </button>
          `,Z();return}const te=G.levels,ye=G.currentLevel;let ke=`
          <button class="tv-quality-opt ${ye===-1?"active":""}" data-level="-1">
            ${ye===-1?'<i data-lucide="check" style="width:13px;height:13px;color:#fbbf24;"></i>':'<span style="width:13px;display:inline-block;"></span>'}
            <span>Otomatik (Adaptive)</span>
          </button>
        `;if(te.forEach((ce,Fe)=>{const Ae=ce.height||(ce.attrs&&ce.attrs.RESOLUTION?ce.attrs.RESOLUTION.height:720),St=Ae>=1080?"1080p FHD":Ae>=720?"720p HD":Ae>=480?"480p SD":`${Ae}p`,He=ye===Fe;ke+=`
            <button class="tv-quality-opt ${He?"active":""}" data-level="${Fe}">
              ${He?'<i data-lucide="check" style="width:13px;height:13px;color:#fbbf24;"></i>':'<span style="width:13px;display:inline-block;"></span>'}
              <span>${St}</span>
            </button>
          `}),Qe.innerHTML=ke,ye===-1)Ge.textContent="AUTO";else if(te[ye]){const ce=te[ye].height;Ge.textContent=ce?`${ce}p`:"HD"}Qe.querySelectorAll(".tv-quality-opt").forEach(ce=>{ce.addEventListener("click",Fe=>{Fe.stopPropagation();const Ae=parseInt(ce.dataset.level,10);if(o){o.currentLevel=Ae,Wr(o),Ee&&Ee.classList.add("hidden");const St=ce.querySelector("span").textContent;X(`Kalite ayarlandı: ${St}`,"success")}})}),Z()}nt&&Ee&&(nt.addEventListener("click",G=>{G.stopPropagation(),Ee.classList.toggle("hidden"),xn()}),k.on(document,"click",G=>{G.target.closest("#tv-quality-wrapper")||Ee.classList.add("hidden")}));let En=!1;function Ms(){if(!B||!z||!P||document.fullscreenElement)return;const te=B.getBoundingClientRect().bottom<80;te&&L&&!L.paused&&!En?P.classList.contains("is-floating-pip")||(P.classList.add("is-floating-pip"),z.classList.add("is-active"),Sn()):te||P.classList.contains("is-floating-pip")&&(P.classList.remove("is-floating-pip"),z.classList.remove("is-active"),En=!1)}k.on(window,"scroll",Ms,{passive:!0}),se&&se.addEventListener("click",G=>{G.stopPropagation(),B&&B.scrollIntoView({behavior:"smooth",block:"start"})}),V&&V.addEventListener("click",G=>{G.stopPropagation(),En=!0,P.classList.remove("is-floating-pip"),z.classList.remove("is-active")});let Be="",Yr=null;function Gr(G){if(G>=0&&G<t.length){const te=t[G];X(`Kanal ${G+1}: ${te.name}`,"info"),ii(te),B&&B.scrollIntoView({behavior:"smooth",block:"start"})}else X(`Kanal ${G+1} bulunamadı`,"warning");Be="",b&&b.classList.add("hidden"),Ce&&Ce.classList.add("hidden")}function Ps(){if(!b||!R||!D)return;const G=parseInt(Be,10),te=t[G-1];R.textContent=Be.padStart(2,"0"),D.textContent=te?te.name:"Geçersiz Kanal",b.classList.remove("hidden"),l&&(l.textContent=Be.padStart(2,"0")),d&&(d.textContent=te?te.name:"Geçersiz Kanal"),Yr&&C(Yr),Yr=T(()=>{Be&&Gr(G-1)},1300)}ct&&Ce&&ct.addEventListener("click",G=>{G.stopPropagation(),Be="",l&&(l.textContent="--"),d&&(d.textContent="Numara tuşlayın"),Ce.classList.toggle("hidden")}),v&&v.addEventListener("click",()=>{Ce.classList.add("hidden"),Be=""}),qe&&qe.addEventListener("click",()=>{Ce.classList.add("hidden"),Be=""}),Ce&&Ce.querySelectorAll(".tv-num-key").forEach(G=>{G.addEventListener("click",te=>{te.stopPropagation();const ye=G.dataset.digit;if(ye==="clear")Be="",l&&(l.textContent="--"),d&&(d.textContent="Numara tuşlayın");else if(ye==="ok"){if(Be){const ke=parseInt(Be,10);Gr(ke-1)}}else Be.length>=2&&(Be=""),Be+=ye,Ps()})});let et=0;async function ii(G){const te=++et;if(r=G,En=!1,Sn(),Kc(),Yc(),o){try{o.stopLoad(),o.detachMedia(),o.destroy()}catch{}o=null}if(L)try{L.pause(),L.removeAttribute("src"),L.load()}catch{}I.classList.remove("hidden"),H.classList.add("hidden");const ye=()=>{et===te&&(I.classList.add("hidden"),H.classList.add("hidden"))};L.addEventListener("loadeddata",ye,{once:!0}),T(()=>{L.removeEventListener("loadeddata",ye),et===te&&L.readyState<2&&He()},2e4);let ke=0,ce=0,Fe=!1,Ae=!1;async function St(Ie,Pe=!0){if(!G.officialLiveId||Pe&&ke>=2)return!1;Pe&&(ke+=1),I.classList.remove("hidden"),H.classList.add("hidden");try{const Ut=it(`/api/live_tv_stream?channel=${encodeURIComponent(G.officialLiveId)}&json=1&refresh=1&_=${Date.now()}`),ri=await fetch(Ut,{cache:"no-store",headers:{Accept:"application/json"}});if(!ri.ok)throw new Error(`Live resolver ${ri.status}`);const Yi=await ri.json(),zs=Yi?.proxiedUrl||Yi?.url||"",Cn=zs?it(zs):"";if(!Cn)throw new Error("Live stream URL missing");if(G.streamUrl=Cn,Cn!==Ie||Pe)return An(Cn),!0}catch{}return!1}function He(){et===te&&(I.classList.add("hidden"),H.classList.remove("hidden"))}function Tn(Ie){if(Fe||!/^https?:\/\//i.test(Ie))return!1;Fe=!0;const Pe=`${new URL(Ie).origin}/`,Ut=`/api/hls_proxy?url=${encodeURIComponent(Ie)}&ref=${encodeURIComponent(Pe)}`;return G.streamUrl=Ut,An(Ut),!0}function An(Ie){if(et===te)if(Ie=it(Ie),ni.isSupported()){if(o){try{o.stopLoad(),o.detachMedia(),o.destroy()}catch{}o=null}const Pe=new ni({enableWorker:!0,lowLatencyMode:!0,startLevel:0,capLevelToPlayerSize:!0,backBufferLength:10,maxBufferLength:8,maxMaxBufferLength:15,liveSyncDurationCount:2,liveMaxLatencyDurationCount:5,manifestLoadingTimeOut:12e3,manifestLoadingMaxRetry:1,manifestLoadingRetryDelay:350,levelLoadingTimeOut:14e3,levelLoadingMaxRetry:1,fragLoadingTimeOut:12e3});o=Pe,Pe.loadSource(Ie),Pe.attachMedia(L),Pe.on(ni.Events.MANIFEST_PARSED,()=>{if(et!==te){try{Pe.stopLoad(),Pe.detachMedia(),Pe.destroy()}catch{}return}Wr(Pe),L.play().catch(()=>{})}),Pe.on(ni.Events.ERROR,(Ut,ri)=>{if(!(et!==te||o!==Pe)&&ri.fatal)if(ri.type===ni.ErrorTypes.NETWORK_ERROR)G.officialLiveId?St(Ie).then(Yi=>{Yi||He()}):ce<1?(ce+=1,I.classList.remove("hidden"),T(()=>{et===te&&o===Pe&&An(Ie)},700)):Tn(Ie)||He();else if(ri.type===ni.ErrorTypes.MEDIA_ERROR)if(Ae)He();else{Ae=!0;try{Pe.recoverMediaError()}catch{He()}}else He()})}else L.canPlayType("application/vnd.apple.mpegurl")?(L.src=Ie,L.addEventListener("loadedmetadata",()=>{et===te&&(Wr(null),L.play().catch(()=>{}))},{once:!0}),L.addEventListener("error",()=>{et===te&&(Tn(Ie)||He())},{once:!0})):He()}let ni;try{ni=(await us(async()=>{const{default:Ie}=await import("./hls-BuERnqCp.js");return{default:Ie}},[],import.meta.url)).default}catch{He();return}et===te&&(G.officialLiveId?St("",!0).then(Ie=>{Ie||et!==te||St("",!0).then(Pe=>{!Pe&&et===te&&He()})}):An(G.streamUrl),L.muted=s,L.volume=c)}function Wi(G){const te=y();if(te.length===0)return;const ye=te.findIndex(ce=>ce.id===r.id);let ke;G==="prev"||G==="up"?ke=ye<=0?te.length-1:ye-1:ke=ye>=te.length-1?0:ye+1,ii(te[ke])}U&&U.addEventListener("click",G=>{G.stopPropagation(),Wi("prev")}),ee&&ee.addEventListener("click",G=>{G.stopPropagation(),Wi("next")}),x&&x.addEventListener("click",()=>Wi("next")),J&&J.addEventListener("click",()=>ii(r)),Ye&&Ye.addEventListener("click",()=>{X("Yayın yeniden yükleniyor...","info"),ii(r)});function Wc(){const G=y();if($s&&($s.textContent=`${G.length} KANAL`),G.length===0){F.innerHTML=`
            <div class="tv-catalog-empty-state">
              <i data-lucide="radio" style="width:40px;height:40px;color:var(--text-muted);"></i>
              <span class="tv-empty-title">Kanal Bulunamadı</span>
              <p class="tv-empty-sub">Arama teriminizi veya kategori filtrenizi değiştirin.</p>
            </div>
          `,Z();return}F.innerHTML=G.map(te=>{const ye=te.id===r.id,ke=h(te.id),ce=g(te)+1,Fe=Ct(te.name,te.category),Ae=qn(te);return`
            <div class="tv-grid-card ${ye?"active":""}" data-id="${te.id}">
              <div class="tv-grid-card-top">
                <span class="tv-grid-num">${String(ce).padStart(2,"0")}</span>
                <button class="tv-grid-fav-btn ${ke?"is-fav":""}" data-favid="${te.id}" title="${ke?"Favorilerden Çıkar":"Favorilere Ekle"}">
                  <i data-lucide="star" style="width:15px;height:15px;${ke?"fill:#fbbf24;color:#fbbf24;":""}"></i>
                </button>
              </div>

              <div class="tv-grid-logo-box">
                <img class="tv-grid-logo" src="${te.logo}" alt="${te.name}" onerror="this.onerror=null; this.src='${Fe}';" loading="lazy" />
              </div>

              <div class="tv-grid-info">
                <span class="tv-grid-name" title="${te.name}">${te.name}</span>
                <div class="tv-grid-meta">
                  <span class="tv-grid-quality">${te.quality}</span>
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
          `}).join(""),F.querySelectorAll(".tv-grid-card").forEach(te=>{te.addEventListener("click",ye=>{if(ye.target.closest(".tv-grid-fav-btn"))return;const ke=t.find(ce=>ce.id===te.dataset.id);ke&&ke.id!==r.id&&(ii(ke),B&&B.scrollIntoView({behavior:"smooth",block:"start"}))})}),F.querySelectorAll(".tv-grid-fav-btn").forEach(te=>{te.addEventListener("click",ye=>{ye.stopPropagation(),m(te.dataset.favid)})}),Z()}function Yc(){F&&F.querySelectorAll(".tv-grid-card").forEach(G=>{const te=G.dataset.id===r.id;G.classList.toggle("active",te);const ye=G.querySelector(".tv-grid-live-indicator");if(!te&&ye&&ye.remove(),te&&!ye){const ke=document.createElement("div");ke.className="tv-grid-live-indicator",ke.innerHTML='<span class="tv-live-dot"></span><span>ŞU AN İZLENİYOR</span>',G.appendChild(ke)}})}if(w=()=>{Wc(),Sn(),Z()},ae&&ae.addEventListener("input",G=>{a=G.target.value.trim(),ve&&ve.classList.toggle("hidden",!a),w()}),ve&&ve.addEventListener("click",()=>{ae.value="",a="",ve.classList.add("hidden"),w()}),fe){Te&&Te.addEventListener("click",ce=>{ce.stopPropagation(),fe.scrollBy({left:-220,behavior:"smooth"})}),_e&&_e.addEventListener("click",ce=>{ce.stopPropagation(),fe.scrollBy({left:220,behavior:"smooth"})}),fe.addEventListener("wheel",ce=>{Math.abs(ce.deltaY)>Math.abs(ce.deltaX)&&(ce.preventDefault(),fe.scrollLeft+=ce.deltaY)},{passive:!1});let G=!1,te=0,ye=0,ke=!1;fe.addEventListener("mousedown",ce=>{ce.button===0&&(G=!0,ke=!1,te=ce.pageX-fe.offsetLeft,ye=fe.scrollLeft)}),k.on(window,"mousemove",ce=>{if(!G)return;const Ae=(ce.pageX-fe.offsetLeft-te)*1.5;Math.abs(Ae)>6&&(ke=!0,fe.classList.add("is-dragging")),fe.scrollLeft=ye-Ae}),k.on(window,"mouseup",()=>{G&&(G=!1,fe.classList.remove("is-dragging"),T(()=>{ke=!1},50))}),fe.querySelectorAll(".tv-cat-filter-btn").forEach(ce=>{ce.addEventListener("click",Fe=>{if(ke){Fe.preventDefault();return}fe.querySelectorAll(".tv-cat-filter-btn").forEach(Ae=>Ae.classList.remove("active")),ce.classList.add("active"),n=ce.dataset.cat,ce.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"}),w()})})}Oe&&Oe.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen().catch(()=>{}):P.requestFullscreen().catch(()=>{})}),k.on(document,"fullscreenchange",()=>{const G=!!document.fullscreenElement;P.classList.toggle("is-fullscreen",G),Oe&&(Oe.innerHTML=G?'<i data-lucide="minimize-2" style="width:18px;height:18px;"></i>':'<i data-lucide="maximize-2" style="width:18px;height:18px;"></i>',Z())});function Bs(G){if(document.activeElement!==ae){if(G.key>="0"&&G.key<="9"){Be.length>=2&&(Be=""),Be+=G.key,Ps();return}if(G.key==="Enter"&&Be){G.preventDefault();const te=parseInt(Be,10);Gr(te-1);return}switch(G.key){case"ArrowUp":case"w":case"W":G.preventDefault(),Wi("prev");break;case"ArrowDown":case"s":case"S":G.preventDefault(),Wi("next");break;case"ArrowRight":G.preventDefault(),Ki(c+.05);break;case"ArrowLeft":G.preventDefault(),Ki(c-.05);break;case"m":case"M":oe&&oe.click();break;case"f":case"F":Oe&&Oe.click();break;case"r":case"R":Ye&&Ye.click();break;case" ":G.preventDefault(),E&&E.click();break}}}k.on(document,"keydown",Bs);const Ds=()=>{if(k.dispose(),Rh(),et++,$(Is),window.removeEventListener("epg-updated",Kr),window.removeEventListener("scroll",Ms),o){try{o.stopLoad(),o.detachMedia(),o.destroy()}catch{}o=null}if(L)try{L.pause(),L.removeAttribute("src"),L.load()}catch{}document.removeEventListener("keydown",Bs)};window.__LiveTvController={cleanup:Ds};const Vr=new MutationObserver(()=>{document.contains(p)||(Ds(),Vr.disconnect())});Vr.observe(document.body,{childList:!0,subtree:!0}),k.add(()=>Vr.disconnect()),w(),ii(r),Ki(1)}}}const Ph=3e4,Bh=10*6e4,Dh=5,zh=6e4;let jr=0,hn=!1,Sr=0,Zn=0,xr=0;function Oh(){jr=Date.now()+Ph}function Nh(){return qc()||jr>Date.now()}function qc(){return hn&&Sr<=Date.now()&&(hn=!1,Sr=0),hn}function qh(){hn=!0,Sr=Date.now()+Bh,jr=0,Zn=0,xr=0}function Fh(){hn=!1,Sr=0,jr=0}function es(){return Math.max(0,Math.ceil((xr-Date.now())/1e3))}function Hh(){return xr>Date.now()||(Zn+=1,Zn>=Dh&&(Zn=0,xr=Date.now()+zh)),es()}async function Uh(){if(!qc())return{html:`
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
      `,init:n=>{const r=n.querySelector("#admin-login-form"),a=n.querySelector("#admin-pin-input"),o=n.querySelector("#admin-login-error");r.addEventListener("submit",s=>{s.preventDefault();const c=a.value.trim(),u=es();if(u>0){o.textContent=`Çok fazla hatalı deneme. ${u} saniye sonra tekrar deneyin.`,o.style.display="block";return}if(Qc(c))qh(),window.dispatchEvent(new CustomEvent("cinepulse_admin_state_changed"));else{const f=Hh();o.textContent=f>0?`Çok fazla hatalı deneme. ${f} saniye bekleyin.`:"Geçersiz PIN kodu!",o.style.display="block",a.classList.add("admin-input-error"),setTimeout(()=>a.classList.remove("admin-input-error"),400),a.value=""}}),Z(n)}};const t=Tr();Dt();const i=Rt();return{html:`
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
    `,init:n=>{const r=n.querySelector("#admin-lock-btn");r&&r.addEventListener("click",()=>{Fh(),window.location.hash="#home"});const a=n.querySelector("#admin-save-site-settings");a&&a.addEventListener("click",()=>{const h=n.querySelector("#admin-setting-landscape")?.checked===!0,m=n.querySelector("#admin-setting-hover")?.checked===!0,y=n.querySelector("#admin-setting-trailers")?.checked===!0,g=n.querySelector("#admin-setting-autoplay-next")?.checked===!0,w=n.querySelector("#admin-setting-subtitles")?.checked===!0,_=n.querySelector("#admin-setting-resolution")?.value||"1080p";vl({cardLayout:h?"landscape":"portrait",hoverPreviewsEnabled:m,trailersEnabled:y,autoplayNext:g,subtitlesEnabled:w,preferredResolution:_}),document.documentElement.classList.toggle("cards-landscape",h),alert("Tüm profil kontrolleri uygulandı.")});const o=n.querySelector("#admin-add-block-form"),s=n.querySelector("#admin-block-input");o&&s&&o.addEventListener("submit",h=>{h.preventDefault();const m=s.value.trim();m&&(ed(m),un(),window.location.reload())}),n.querySelectorAll(".admin-tag-del-btn").forEach(h=>{h.addEventListener("click",()=>{const m=h.getAttribute("data-entry");m&&(td(m),un(),window.location.reload())})});const c=n.querySelector("#admin-change-pin-form"),u=n.querySelector("#admin-new-pin");c&&u&&c.addEventListener("submit",h=>{h.preventDefault();const m=u.value.trim();m.length>=4&&(Xc(m),alert("Yönetici PIN kodu başarıyla güncellendi!"),u.value="")});const f=n.querySelector("#admin-clear-cache-btn");f&&f.addEventListener("click",()=>{sessionStorage.clear(),un(),alert("Sistem önbelleği başarıyla temizlendi."),window.location.reload()}),Z(n)}}}const jh=new Set(["hd","full","izle","seyret","film","dizi","anime","turkce","dublaj","altyazili","sezon","bolum","fragman","filmekseni","ekseni","sezonlukdizi","yabancidizi","dizipal","dizibal"]);function ol(e){return(e||"").toString().normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("tr-TR").replace(/[ıİ]/g,"i").replace(/\bs\d{1,2}\s*e\d{1,3}\b/g," ").replace(/\b(?:sezon|bolum)\s*\d+\b/g," ").replace(/\b\d+\s*(?:sezon|bolum)\b/g," ").replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(t=>t&&!jh.has(t)&&!/^(?:19|20)\d{2}$/.test(t)).join(" ").trim()}function Kh(e,t){if(e===t)return 0;if(!e.length)return t.length;if(!t.length)return e.length;const i=Array.from({length:t.length+1},(n,r)=>r);for(let n=1;n<=e.length;n++){let r=i[0];i[0]=n;for(let a=1;a<=t.length;a++){const o=i[a];i[a]=Math.min(i[a]+1,i[a-1]+1,r+(e[n-1]===t[a-1]?0:1)),r=o}}return i[t.length]}function Wh(e,t){const i=ol(e),n=ol(t);return!i||!n?0:i===n?1:1-Kh(i,n)/Math.max(i.length,n.length)}function Yh(e,t,i=.9){return(Array.isArray(t)?t:[t]).filter(Boolean).some(r=>Wh(e,r)>=i)}function ym(e){return e?(e.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i)?.[1]||e.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g," ")||e.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||"").replace(/\s+\d+\s*\.?\s*sezon\b[\s\S]*$/i,"").replace(/\s+[-|]\s*(?:sezonluk\s*dizi|sezonlukdizi|filmekseni|yabanci\s*dizi)[\s\S]*$/i,"").trim():""}const gi="https://dramadizilerim.com";function Gh(e){return e?e.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-"):""}function ll(e){return e?e.toLowerCase().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9]/g,""):""}async function mi(e,t={}){const i=typeof window<"u";let n=e;if(i)if(e.startsWith("http"))try{const r=new URL(e);n=`/api/ddz${r.pathname}${r.search}`}catch{n=e}else n=`/api/ddz${e.startsWith("/")?"":"/"}${e}`;else n.startsWith("http")||(n=`${gi}${n.startsWith("/")?"":"/"}${n}`);try{const r=await fetch(n,{...t,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Referer:gi,...t.headers||{}},signal:AbortSignal.timeout(t.timeout||6e3)}).catch(()=>null);if(r&&r.ok)return r}catch{}return null}function bn(e){if(!e)return"";try{if(e.includes("image_proxy.php?url=")){const t=e.match(/url=([^&]+)/);if(t)return decodeURIComponent(t[1])}}catch{}return e}async function Fc(e){if(!e||typeof e!="string"||e.trim().length<2)return[];const t=e.trim(),i=`/search?q=${encodeURIComponent(t)}`,n=await mi(i);if(!n)return[];const r=await n.text().catch(()=>"");if(!r)return[];const a=[],o=/<a[^>]+href=["'](?:https:\/\/dramadizilerim\.com)?\/dizi\/([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;let s;for(;(s=o.exec(r))!==null;){const c=s[1],u=s[2],f=u.match(/alt=["']([^"']+)["']/i)||u.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i),h=f?f[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():c,m=u.match(/src=["']([^"']+)["']/i),y=m?bn(m[1].replace(/&amp;/g,"&")):"",g=h.toLowerCase().includes("dublaj");a.some(w=>w.slug===c)||a.push({title:h,slug:c,poster:y,isDubbed:g,url:`${gi}/dizi/${c}`})}return a}async function Vh(){const e=await mi("/");if(!e)return[];const t=await e.text().catch(()=>"");if(!t)return[];const i=[],n=/<a[^>]+href=["'](?:https:\/\/dramadizilerim\.com)?\/dizi\/([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;let r;for(;(r=n.exec(t))!==null;){const a=r[1],o=r[2],s=o.match(/src=["']([^"']+)["']/i),c=o.match(/alt=["']([^"']+)["']/i)||o.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i),u=c?c[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():a,f=s?bn(s[1].replace(/&amp;/g,"&")):"",h=u.toLowerCase().includes("dublaj");i.some(m=>m.slug===a)||i.push({slug:a,title:u,poster:f,isDubbed:h,badge:h?"🇹🇷 DUBLAJ":"TR ALTYAZI",url:`${gi}/dizi/${a}`})}return i}async function Ea({page:e=1,query:t=""}={}){if(t&&t.trim().length>=2)return Fc(t);const i=e>1?`/dizi?page=${e}`:"/dizi",n=await mi(i);if(!n)return[];const r=await n.text().catch(()=>"");if(!r)return[];const a=[],o=/<a[^>]+href=["'](?:https:\/\/dramadizilerim\.com)?\/dizi\/([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;let s;for(;(s=o.exec(r))!==null;){const c=s[1],u=s[2],f=u.match(/src=["']([^"']+)["']/i),h=u.match(/alt=["']([^"']+)["']/i)||u.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i),m=h?h[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():c,y=f?bn(f[1].replace(/&amp;/g,"&")):"",g=m.toLowerCase().includes("dublaj");a.some(w=>w.slug===c)||a.push({slug:c,title:m,poster:y,isDubbed:g,badge:g?"🇹🇷 DUBLAJ":"TR ALTYAZI",url:`${gi}/dizi/${c}`})}return a}async function Jh(e){if(!e)return null;const t=await mi(`/dizi/${e}`);if(!t)return null;const i=await t.text().catch(()=>"");if(!i)return null;const n=i.match(/<h1[^>]*>(.*?)<\/h1>/i),r=n?n[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():e;let a="";const s=[...i.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(y=>y[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,"&").trim()).filter(y=>{if(y.length<25)return!1;const g=y.toLowerCase();return!(g.includes("çerez")||g.includes("cookie")||g.includes("reklam")||g.includes("tüm hakları")||g.includes("bildirim")||g.includes("yapay zeka")||g.includes("bize bildirin")||g.includes("aradığınız dizi"))});if(s.length>0&&(s.sort((y,g)=>g.length-y.length),a=s[0]),!a||a.length<25){const y=i.match(/<meta\s+(?:property=["']og:description["']|name=["']description["'])\s+content=["']([^"']+)["']/i)||i.match(/<meta\s+content=["']([^"']+)["']\s+(?:property=["']og:description["']|name=["']description["'])/i);if(y&&y[1]&&y[1].trim().length>15){const g=y[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,"&").trim();g.toLowerCase().includes("aradığınız dizi")||(a=g)}}(!a||a.includes("Bu dizi için konu özeti henüz eklenmedi"))&&(a=`${r} - Tüm bölümleri yüksek kalitede, kesintisiz ve donmadan Türkçe dublaj ve altyazı seçenekleriyle CinePulse Kısa Dizi Evreni'nde izleyin.`);const c=i.match(/<div class=["'][^"']*poster[^"']*["'][^>]*>[\s\S]*?<img[^>]+src=["']([^"']+)["']/i)||i.match(/<img[^>]+class=["'][^"']*spotlight[^"']*["'][^>]+src=["']([^"']+)["']/i),u=c?bn(c[1].replace(/&amp;/g,"&")):"",f=/<a[^>]+href=["'](?:\/izle\/|https:\/\/dramadizilerim\.com\/izle\/)([a-zA-Z0-9_-]+)\?s=(\d+)&e=(\d+)["'][^>]*>([\s\S]*?)<\/a>/gi,h=[];let m;for(;(m=f.exec(i))!==null;){const y=parseInt(m[2],10)||1,g=parseInt(m[3],10)||1,w=m[4],_=w.match(/class=["']wp-enum["']>([^<]+)</i)||w.match(/alt=["']([^"']+)["']/i),p=_?_[1].trim():`Bölüm ${g}`,k=w.match(/src=["']([^"']+)["']/i),T=k?bn(k[1].replace(/&amp;/g,"&")):"";h.some(C=>C.season===y&&C.episode===g)||h.push({season:y,episode:g,title:p,thumb:T})}return h.sort((y,g)=>y.season-g.season||y.episode-g.episode),{slug:e,title:r,poster:u,description:a,isDubbed:r.toLowerCase().includes("dublaj"),totalEpisodes:h.length,episodes:h}}async function vm({titles:e=[],seriesTitle:t="",season:i=1,episode:n=1,isDub:r=!0}){const a=[...new Set([...e,t])].filter(C=>C&&typeof C=="string"&&C.trim().length>1);if(a.length===0)return[];const o=parseInt(i,10)||1,s=parseInt(n,10)||1;let c=null,u=null;for(const C of a){const S=Gh(C),$=`/izle/${S}?s=${o}&e=${s}`,L=await mi($,{method:"HEAD",timeout:3500});if(L&&L.ok){c=S;break}}if(!c)for(const C of a){const S=await Fc(C);if(S.length>0){for(const P of S)if(Yh(P.title,a,.75)){c=P.slug,u=P;break}if(c)break;const $=ll(C),L=S.find(P=>{const B=ll(P.title);return B===$||B.includes($)||$.includes(B)});if(L){c=L.slug,u=L;break}}}if(!c)return[];const f=`/izle/${c}?s=${o}&e=${s}`,h=await mi(f);if(!h)return[];const m=await h.text().catch(()=>"");if(!m)return[];const y=m.match(/(?:data-src|src)=["']([^"']*embed\.php[^"']*)["']/i);if(!y)return[];let g=y[1].replace(/&amp;/g,"&");g.startsWith("http")||(g=`${gi}${g.startsWith("/")?"":"/"}${g}`);const w=await mi(g,{headers:{Referer:`${gi}${f}`}});if(!w)return[];const _=await w.text().catch(()=>"");if(!_)return[];const p=[],k=_.match(/let\s+source\s*=\s*["']([^"']+)["']/);let T=k&&k[1].startsWith("http")?k[1]:null;if(!T){const C=_.match(/https?:\/\/[^"'\s\\]+\.(?:m3u8|mp4)[^"'\s\\]*/);C&&(T=C[0])}if(T){const C=T.includes(".m3u8")||T.includes("mpegurl"),L=(u?.title||c).toLowerCase().includes("dublaj")||r===!0?`🇹🇷 DDZ VIP S${o}E${s} (TR Dublaj)`:`⚡ DDZ VIP S${o}E${s} (TR Altyazı)`;p.push({id:`ddz_ep_${c}_${o}_${s}`,name:L,displayName:L,badge:"🎭 DDZ VIP",source:"DDZ VIP",url:T,streamUrl:T,rawStreamUrl:T,quality:"1080p HD",isHls:C,isDirectVideo:!0,priority:2,getUrl:()=>T})}return p}async function Zh(e=null,t=""){let i=t?"search":"trending",n=t||"",r=1,a=[],o=null,s="";const c=[{id:"trending",label:"Trendler",icon:"flame",query:""},{id:"all",label:"Tüm Katalog",icon:"layers",query:""},{id:"dubbed",label:"Türkçe Dublaj",icon:"sparkles",query:"dublaj"},{id:"patron",label:"CEO & Patron",icon:"briefcase",query:"patron"},{id:"kurt",label:"Kurt & Alfa",icon:"moon",query:"kurt"},{id:"intikam",label:"İntikam & Aşk",icon:"heart-crack",query:"intikam"},{id:"milyarder",label:"Milyarder",icon:"crown",query:"milyarder"},{id:"evlilik",label:"Yasak Aşk & Evlilik",icon:"ring",query:"evlilik"}];return{html:`
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
            ${c.map(f=>`
              <button 
                class="drama-chip ${i===f.id?"active":""}" 
                data-tab-id="${f.id}"
                data-tab-query="${f.query}"
              >
                <i data-lucide="${f.icon}" style="width: 14px; height: 14px;"></i>
                <span>${f.label}</span>
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
  `,init:async f=>{const h=f.querySelector("#drama-view-root");if(!h)return;const m=h.querySelector("#drama-search-input"),y=h.querySelector("#btn-drama-search-clear");h.querySelector("#drama-search-feedback");const g=h.querySelectorAll(".drama-chip"),w=h.querySelector("#drama-section-title"),_=h.querySelector("#drama-counter-badge"),p=h.querySelector("#drama-cards-grid"),k=h.querySelector("#drama-load-more-wrap"),T=h.querySelector("#btn-drama-load-more"),C=h.querySelector("#drama-detail-modal"),S=h.querySelector("#drama-modal-dialog");let $=null;async function L(N=!1){N||(p.innerHTML=Array.from({length:12}).map(()=>`
            <div class="drama-card-skeleton">
              <div class="skeleton-poster"></div>
              <div class="skeleton-title"></div>
            </div>
          `).join(""),_.textContent="Yükleniyor...");try{let q=[];if(n&&n.trim().length>=2)q=await Ea({query:n.trim()}),w.innerHTML=`
              <i data-lucide="search" style="width: 20px; height: 20px; color: #a855f7;"></i>
              <span>"${n}" İçin Arama Sonuçları</span>
            `,k.classList.add("hidden");else{const j=c.find(Q=>Q.id===i)||c[0];i==="trending"?(q=await Vh(),w.innerHTML=`
                <i data-lucide="flame" style="width: 20px; height: 20px; color: #f43f5e;"></i>
                <span>Trend Kısa Diziler</span>
              `,k.classList.add("hidden")):i==="all"?(q=await Ea({page:r}),w.innerHTML=`
                <i data-lucide="layers" style="width: 20px; height: 20px; color: #3b82f6;"></i>
                <span>Tüm Kısa Diziler Kataloğu (Sayfa ${r})</span>
              `,k.classList.toggle("hidden",q.length===0)):j.query&&(q=await Ea({query:j.query}),w.innerHTML=`
                <i data-lucide="${j.icon}" style="width: 20px; height: 20px; color: #c084fc;"></i>
                <span>${j.label} Serileri</span>
              `,k.classList.add("hidden"))}N?a=[...a,...q]:a=q,P()}catch{p.innerHTML=`
            <div class="drama-empty-state">
              <i data-lucide="alert-circle" style="width: 44px; height: 44px; color: #ef4444;"></i>
              <h3>Diziler yüklenirken bir sorun oluştu</h3>
              <p>Lütfen internet bağlantınızı kontrol edip tekrar deneyin.</p>
              <button class="btn-primary" id="btn-drama-retry">Tekrar Dene</button>
            </div>
          `,h.querySelector("#btn-drama-retry")?.addEventListener("click",()=>L(!1)),Z(p)}finally{}}function P(){if(!a||a.length===0){p.innerHTML=`
            <div class="drama-empty-state">
              <i data-lucide="film" style="width: 48px; height: 48px; color: #94a3b8;"></i>
              <h3>Eşleşen Kısa Dizi Bulunamadı</h3>
              <p>Farklı bir anahtar kelime ile arama yapabilir veya Trend kategorisine göz atabilirsiniz.</p>
            </div>
          `,_.textContent="0 Dizi",Z(p);return}_.textContent=`${a.length} Dizi`,p.innerHTML=a.map((N,q)=>{const j=N.isDubbed||N.title.toLowerCase().includes("dublaj"),Q=N.poster||"";return`
            <article class="drama-card" data-slug="${N.slug}" tabindex="0" role="button" aria-label="${N.title}">
              <div class="drama-card-poster-wrap">
                ${Q?`
                  <img 
                    src="${Q}" 
                    alt="${N.title}" 
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
                  <span class="drama-badge-pill ${j?"badge-dub":"badge-sub"}">
                    ${j?"🇹🇷 DUBLAJ":"TR ALTYAZI"}
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
                <h3 class="drama-card-title" title="${N.title}">${N.title}</h3>
                <div class="drama-card-meta">
                  <span>Reels Series</span>
                  <span>•</span>
                  <span>1080p HD</span>
                </div>
              </div>
            </article>
          `}).join(""),Z(p),p.querySelectorAll(".drama-card").forEach(N=>{N.addEventListener("click",()=>{const q=N.getAttribute("data-slug");q&&B(q)}),N.addEventListener("keydown",q=>{if(q.key==="Enter"||q.key===" "){q.preventDefault();const j=N.getAttribute("data-slug");j&&B(j)}})})}async function B(N){if(N){o=null,C.classList.remove("hidden"),document.body.style.overflow="hidden",S.innerHTML=`
          <div class="drama-detail-loading">
            <div class="spin-loader"></div>
            <span>Dizi bilgileri ve bölümler yükleniyor...</span>
          </div>
        `,Z(S);try{const q=await Jh(N);if(!q){S.innerHTML=`
              <div class="drama-empty-state">
                <i data-lucide="alert-circle" style="width: 38px; height: 38px; color: #ef4444;"></i>
                <h3>Dizi bilgisi alınamadı</h3>
                <button class="btn-primary" id="btn-close-drama-modal">Kapat</button>
              </div>
            `,h.querySelector("#btn-close-drama-modal")?.addEventListener("click",Y),Z(S);return}o=q,z()}catch{Y(),X("Dizi detayları yüklenemedi.","error")}}}function z(){if(!o)return;const{slug:N,title:q,poster:j,description:Q,episodes:ie=[],isDubbed:ne}=o,O=ie.length,se=s?ie.filter(W=>W.title.toLowerCase().includes(s)||String(W.episode).includes(s)):ie;S.innerHTML=`
          <button class="drama-modal-close-btn" id="btn-close-drama-modal" title="Kapat">
            <i data-lucide="x" style="width: 20px; height: 20px;"></i>
          </button>

          <div class="drama-detail-hero">
            <div class="drama-detail-backdrop-blur" style="background-image: url('${j||""}');"></div>
            <div class="drama-detail-hero-content">
              <div class="drama-detail-poster-wrap">
                <img src="${j||""}" alt="${q}" class="drama-detail-poster" />
              </div>
              <div class="drama-detail-info">
                <div class="drama-detail-badges">
                  <span class="drama-badge-pill ${ne?"badge-dub":"badge-sub"}">
                    ${ne?"🇹🇷 TÜRKÇE DUBLAJ":"TR ALTYAZI"}
                  </span>
                  <span class="drama-badge-pill badge-type">MİNİ DİZİ</span>
                  <span class="drama-badge-pill badge-ep-count">${O} BÖLÜM</span>
                  <span class="drama-badge-pill badge-server">DDZ VIP HLS</span>
                </div>
                <h2 class="drama-detail-title">${q}</h2>
                <p class="drama-detail-desc">${Q||"Bu kısa dizi için henüz özet girilmedi."}</p>
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
                <h3>Bölümler (${O})</h3>
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
              ${se.map(W=>{const re=mn(`ddz_${N}`,W.season,W.episode);return`
                  <button 
                    class="drama-ep-card ${re?"is-watched":""}" 
                    data-season="${W.season}" 
                    data-episode="${W.episode}"
                  >
                    <div class="drama-ep-thumb-wrap">
                      ${W.thumb?`
                        <img src="${W.thumb}" alt="${W.title}" loading="lazy" />
                      `:`
                        <div class="drama-ep-fallback-thumb">
                          <i data-lucide="play" style="width: 16px; height: 16px; color: #c084fc;"></i>
                        </div>
                      `}
                      <span class="drama-ep-num-pill">${W.episode}</span>
                      ${re?'<div class="drama-ep-watched-tag"><i data-lucide="check" style="width: 12px; height: 12px;"></i></div>':""}
                    </div>
                    <div class="drama-ep-title-wrap">
                      <span class="drama-ep-name">${W.title}</span>
                      <span class="drama-ep-action-hint">İzle</span>
                    </div>
                  </button>
                `}).join("")}
            </div>
          </div>
        `,Z(S),S.querySelector("#btn-close-drama-modal")?.addEventListener("click",Y),S.querySelector("#btn-play-drama-start")?.addEventListener("click",()=>{ie.length>0&&K(ie[0].season,ie[0].episode)}),S.querySelector("#btn-share-drama")?.addEventListener("click",()=>{const W=`${window.location.origin}${window.location.pathname}#dramas?slug=${N}`;navigator.clipboard?.writeText(W).then(()=>{X("Dizi bağlantısı panoya kopyalandı!","success")}).catch(()=>{X(`Bağlantı: ${W}`,"info")})});const V=S.querySelector("#drama-ep-filter-input");V&&V.addEventListener("input",W=>{s=W.target.value.toLowerCase().trim(),z(),S.querySelector("#drama-ep-filter-input")?.focus()}),S.querySelectorAll(".drama-ep-card").forEach(W=>{W.addEventListener("click",()=>{const re=parseInt(W.getAttribute("data-season"),10)||1,ue=parseInt(W.getAttribute("data-episode"),10)||1;K(re,ue)})})}function Y(){C.classList.add("hidden"),document.body.style.overflow="",o=null,s=""}C.addEventListener("click",N=>{N.target===C&&Y()});function K(N=1,q=1){if(!o)return;const{slug:j,title:Q,poster:ie,description:ne,episodes:O=[]}=o,se=O.find(V=>V.season===N&&V.episode===q)?.thumb||"";ei({type:"tv",tmdbId:`ddz_${j}`,title:`${Q} - B${q}`,seriesTitle:Q,season:N,episode:q,posterPath:ie,backdropPath:ie,playerVariant:"short-drama",seriesOverview:ne||"",episodeArtworkPath:se||ie,shortDramaEpisodes:O,maxEpisodes:O.length,seasonsList:[{season_number:N,episode_count:O.length}]})}m?.addEventListener("input",N=>{const q=N.target.value;y.classList.toggle("hidden",!q),clearTimeout($),$=setTimeout(()=>{n=q.trim(),r=1,i=n?"search":"trending",g.forEach(j=>j.classList.toggle("active",!n&&j.getAttribute("data-tab-id")==="trending")),L(!1)},350)}),m?.addEventListener("keydown",N=>{N.key==="Enter"&&(N.preventDefault(),clearTimeout($),n=m.value.trim(),r=1,L(!1))}),y?.addEventListener("click",()=>{m.value="",y.classList.add("hidden"),n="",i="trending",g.forEach(N=>N.classList.toggle("active",N.getAttribute("data-tab-id")==="trending")),L(!1)}),g.forEach(N=>{N.addEventListener("click",()=>{const q=N.getAttribute("data-tab-id");i===q&&!n||(i=q,n="",m&&(m.value=""),y?.classList.add("hidden"),r=1,g.forEach(j=>j.classList.toggle("active",j===N)),L(!1))})}),T?.addEventListener("click",()=>{r++,L(!0)}),await L(!1),e&&B(e)}}}const Ta=[{id:"user-circle",icon:"user",label:"Klasik",color:"#f59e0b"},{id:"clapperboard",icon:"clapperboard",label:"Sinema",color:"#ec4899"},{id:"film",icon:"film",label:"Yıldız",color:"#8b5cf6"},{id:"sparkles",icon:"sparkles",label:"Sihirli",color:"#10b981"},{id:"tv",icon:"tv",label:"Dizi Kolik",color:"#3b82f6"},{id:"baby",icon:"baby",label:"Çocuk",color:"#38bdf8"},{id:"smile",icon:"smile",label:"Neşeli",color:"#eab308"},{id:"flame",icon:"flame",label:"Ateşli",color:"#ef4444"}];function Xh(){if(dl()||document.getElementById("profile-onboarding-overlay"))return;const e=document.createElement("div");e.id="profile-onboarding-overlay",e.className="onboarding-overlay",e.innerHTML=`
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
            ${Ta.map((o,s)=>`
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
  `,document.body.appendChild(e),window.lucide&&Z(e);let t=Ta[0].id,i=Ta[0].color;e.querySelectorAll(".onboarding-avatar-btn").forEach(o=>{o.addEventListener("click",()=>{e.querySelectorAll(".onboarding-avatar-btn").forEach(s=>s.classList.remove("selected")),o.classList.add("selected"),t=o.getAttribute("data-avatar"),i=o.getAttribute("data-color")})});const n=e.querySelector("#onboarding-form"),r=e.querySelector("#onboarding-name-input"),a=e.querySelector("#onboarding-is-kid");n.addEventListener("submit",o=>{o.preventDefault();const s=r.value.trim();s&&(Jc({name:s,avatar:t,color:i,isKid:a.checked}),e.classList.add("animate-fade-out"),setTimeout(()=>{e.remove(),window.location.reload()},280))})}const tn=[{icon:"sparkles",eyebrow:"CinePulse rehberi",title:"İzlemeye hazır bir ana ekran",text:"Ana sayfadaki satırları yatay kaydırarak yapımları gez. Arama simgesinden dizi veya film adını yazdığında sonuçlar anında görünür.",hint:"Mobilde alt menüden Diziler, Filmler, Keşfet ve Listem’e geçebilirsin."},{icon:"clapperboard",eyebrow:"Fragman önizleme",title:"Karttan fragmana bak",text:"Telefonda bir içerik kartına kısa süre basılı tut; fragman ekranın alt kısmında açılır. Bilgisayarda kartın üzerine gelmen yeterli.",hint:"Önizlemeyi sağ üstteki çarpıdan kapatabilir, ses simgesinden sesi açabilirsin."},{icon:"list-plus",eyebrow:"Kişisel liste",title:"Listem senin kontrolünde",text:"İçerik detayındaki artı düğmesiyle yapımları Listem’e ekle. Listem sayfasından kaydettiğin yapımları açabilir veya kaldırabilirsin.",hint:"İzleme ilerlemen de aynı tarayıcıda otomatik hatırlanır."},{icon:"shield-check",eyebrow:"Spoilersız keşif",title:"Diziyi güvenle incele",text:"Dizi detayında “Spoilersız keşfet” seçeneğini açarsan, izleme ilerlemenin sonrasındaki bölüm başlıkları, görselleri ve özetleri gizlenir.",hint:"İzlediğin bölüme ve sıradaki bölüme kadar detay görürsün; ilerledikçe yeni bölümler açılır."},{icon:"users-round",eyebrow:"Birlikte Seç",title:"Arkadaşınla aynı odada izle",text:"Üstteki Birlikte Seç düğmesinden oda oluştur veya altı haneli kodla bir odaya katıl. Moderatör içerik ve kaynak seçer; odada emoji ve sohbet de kullanabilirsin.",hint:"Oynatıcıdaki “Odaya dön” düğmesindeki rozet yeni sohbet mesajlarını gösterir."},{icon:"monitor-play",eyebrow:"Oynatıcı",title:"Kontroller elinin altında",text:"İçeriği açınca ekrana bir kez dokunarak kontrolleri göster. Zaman çubuğundan sarabilir, kaynakları değiştirebilir, altyazı ve ses seçebilirsin.",hint:"Tam ekran, ses ve parlaklık ayarları her cihazda sana ait kalır."}];function Qh(){if(!dl()||Gc()||document.getElementById("cinepulse-product-tour"))return;let e=0;const t=document.body.style.overflow,i=document.createElement("section");i.id="cinepulse-product-tour",i.className="product-tour-overlay",i.setAttribute("role","dialog"),i.setAttribute("aria-modal","true"),i.setAttribute("aria-label","CinePulse kullanım rehberi");const n=()=>{Vc(),document.body.style.overflow=t,i.classList.add("is-leaving"),window.setTimeout(()=>i.remove(),180)},r=()=>{const a=tn[e];i.innerHTML=`
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
    `,Z(i),i.querySelector(".product-tour-skip")?.addEventListener("click",n),i.querySelector(".product-tour-back")?.addEventListener("click",()=>{e=Math.max(0,e-1),r()}),i.querySelector(".product-tour-next")?.addEventListener("click",()=>{e>=tn.length-1?n():(e+=1,r())})};document.body.appendChild(i),document.body.style.overflow="hidden",r()}function em(e){const t=e==="landscape";document.querySelectorAll(".card-poster-img").forEach(n=>{const r=t?n.dataset.backdropSrc||n.src:n.dataset.posterSrc||n.src;!r||n.src===r||(n.src=r,n.dataset.activeLayout=e)})}function tm(){const e=Rt().cardLayout==="landscape"?"landscape":"portrait";return`
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
  `}function im(e=document){const t=e.querySelector("#card-layout-switcher");if(!t)return;const i=[...t.querySelectorAll(".card-layout-option")],n=()=>{t.isConnected&&yr(document,!1)};"requestIdleCallback"in window?window.requestIdleCallback(n,{timeout:1e3}):setTimeout(n,300),i.forEach(r=>{r.addEventListener("click",a=>{a.preventDefault();const o=r.dataset.layout==="landscape"?"landscape":"portrait",s=o==="landscape",c=document.documentElement.classList.contains("cards-landscape")?"landscape":"portrait";o!==c&&(document.documentElement.classList.toggle("cards-landscape",s),i.forEach(u=>{const f=u.dataset.layout===o;u.classList.toggle("active",f),u.setAttribute("aria-pressed",String(f))}),em(o),vl({cardLayout:o}),s&&yr(document,!0))})})}const ki=!!(window.Capacitor?.isNativePlatform?.()&&window.Capacitor?.getPlatform?.()==="android");document.documentElement.classList.toggle("native-android",ki);const Hc=matchMedia("(max-width: 768px)");document.documentElement.classList.toggle("mobile-web",!ki&&Hc.matches);Hc.addEventListener?.("change",e=>{document.documentElement.classList.toggle("mobile-web",!ki&&e.matches)});if(ki){const e=window.fetch.bind(window),t="https://cine-pulse-drab.vercel.app";window.fetch=(i,n)=>{if(typeof i=="string"&&i.startsWith("/api/"))i=`${t}${i}`;else if(i instanceof URL&&i.origin===window.location.origin&&i.pathname.startsWith("/api/"))i=`${t}${i.pathname}${i.search}${i.hash}`;else if(typeof Request<"u"&&i instanceof Request){const r=new URL(i.url);r.origin===window.location.origin&&r.pathname.startsWith("/api/")&&(i=new Request(`${t}${r.pathname}${r.search}${r.hash}`,i))}return e(i,n)}}if(typeof window<"u")try{za.addListener("backButton",({canGoBack:e})=>{const t=document.getElementById("player-modal-container")||document.querySelector(".player-modal-overlay");if(t){const r=document.getElementById("player-close-btn");r?r.click():t.remove();return}const i=document.querySelector(".modal-overlay, .decision-modal-overlay, .profile-modal-overlay, .data-manager-modal");if(i){const r=i.querySelector('.modal-close, .btn-modal-close, [data-action="close"]');r?r.click():i.remove();return}const n=window.location.hash||"#home";if(n!=="#home"&&n!==""){e?window.history.back():window.location.hash="#home";return}za.exitApp()})}catch{}"scrollRestoration"in history&&(history.scrollRestoration="manual");"serviceWorker"in navigator&&window.location.protocol.startsWith("http")&&window.addEventListener("load",()=>{const e="20260920-mobile-preview-2",t=`cinepulse-sw-reloaded-${e}`;navigator.serviceWorker.addEventListener("controllerchange",()=>{sessionStorage.getItem(t)||(sessionStorage.setItem(t,"1"),window.location.reload())}),navigator.serviceWorker.register(`/sw.js?build=${e}`,{updateViaCache:"none"}).then(i=>i.update()).catch(()=>{})});Qd();window.addEventListener("keydown",e=>{e.ctrlKey&&e.altKey&&e.shiftKey&&e.key==="F10"&&(e.preventDefault(),e.stopImmediatePropagation(),Oh(),window.location.hash="#admin")},!0);const si=document.getElementById("app");document.documentElement.classList.toggle("cards-landscape",Rt().cardLayout==="landscape");ki&&typeof navigator<"u"&&navigator.onLine===!1&&window.location.hash!=="#downloads"&&(window.location.hash="#downloads");window.addEventListener("scroll",()=>{Rf()},{passive:!0});window.addEventListener("pagehide",Fr);let Aa=0;async function ji(){const e=++Aa;jf(),Fr();const t=window.location.hash||"#home";let i="home",n={};if(t.startsWith("#detail")){if(i="detail",t.includes("?")){const c=t.split("?")[1]||"",u=new URLSearchParams(c);n.type=u.get("type")||"tv",n.id=u.get("id")}else if(t.includes("/")){const c=t.split("/");c.length>=3?(n.type=c[1]||"tv",n.id=c[2]):c.length===2&&(n.type="tv",n.id=c[1])}}else if(t==="#series")i="series";else if(t==="#cartoons")i="cartoons";else if(t==="#movies")i="movies";else if(t==="#anime")i="anime";else if(t==="#documentary")i="documentary";else if(t==="#livetv")i="livetv";else if(t==="#discover")i="discover";else if(t==="#library")i="library";else if(t==="#downloads"){if(!ki){window.location.replace("#library");return}i="downloads"}else if(t.startsWith("#dramas")){if(i="dramas",t.includes("?")){const c=t.split("?")[1]||"",u=new URLSearchParams(c);n.slug=u.get("slug"),n.q=u.get("q")}}else if(t==="#admin"){if(!Nh()){window.location.replace("#home");return}i="admin"}if(window.__popularListCleanup?.(),window.__popularListCleanup=null,window.__discoverCleanup?.(),window.__discoverCleanup=null,window.__LiveTvController&&typeof window.__LiveTvController.cleanup=="function"&&window.__LiveTvController.cleanup(),document.querySelectorAll("video, audio").forEach(c=>{try{c.pause(),c.removeAttribute("src"),c.load()}catch{}}),i==="admin"){const c=await Uh();if(e!==Aa)return;si.innerHTML=`
      <div class="admin-standalone-wrapper" style="min-height: 100vh; background: #07090e; display: flex; flex-direction: column; width: 100%;">
        ${c?c.html:""}
      </div>
    `,c&&typeof c.init=="function"&&c.init(si),Z();return}const r=Af(i),o=new Set(["home","series","cartoons","movies","anime","documentary","discover","library"]).has(i)?tm():"";(i==="home"||i==="detail")&&(si.innerHTML=`${r}<main class="route-loading" aria-live="polite"><div class="spin-loader"></div><span>İçerikler yükleniyor...</span></main>`,Ko(),Z(si));let s=null;i==="home"?s=await Yf():i==="detail"?s=await uh(n.type,n.id):i==="series"?s=await en("tv"):i==="cartoons"?s=await en("cartoon"):i==="movies"?s=await en("movie"):i==="anime"?s=await en("anime"):i==="documentary"?s=await en("documentary"):i==="livetv"?s=Mh():i==="discover"?s=await kh("tv"):i==="library"?s=vh():i==="downloads"?s=wh():i==="dramas"&&(s=await Zh(n.slug,n.q)),e===Aa&&(si.innerHTML=`
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
  `,Ko(),im(si),s&&s.init&&s.init(si),window.lucide&&Z(),Mf(t))}window.addEventListener("hashchange",ji);window.addEventListener("offline",()=>{ki&&window.location.hash!=="#downloads"&&(window.location.hash="#downloads")});ji();setTimeout(async()=>{try{const e=String(new URL(window.location.href).searchParams.get("oda")||"").replace(/\D/g,"");if(!/^\d{6}$/.test(e))return;fr({roomCode:e})}catch{}},700);setTimeout(()=>{Xh()},400);setTimeout(()=>{Qh()},1200);const Uc={getWatchHistory:Re,saveWatchProgress:ns,saveBatchWatchProgress:fl};window.addEventListener("cinepulse_trakt_auth_changed",e=>{e.detail?.connected&&Al(Uc)});Al(Uc);bu();const jc=e=>{e&&e.detail&&(e.detail.action==="import"||e.detail.cleared)&&ji()};window.addEventListener("sineflix_data_changed",jc);window.addEventListener("cinepulse_data_changed",jc);window.addEventListener("sineflix_profile_changed",async()=>{un(),await ji()});window.addEventListener("cinepulse_admin_state_changed",ji);window.addEventListener("storage",e=>{if(e.key!=="sineflix_user_settings_v1")return;const t=Rt();document.documentElement.classList.toggle("cards-landscape",t.cardLayout==="landscape"),un(),ji()});export{am as A,rm as B,Bt as C,Qa as D,pm as E,ps as W,it as a,gn as b,zc as c,ze as d,ym as e,vm as f,Ls as g,lt as h,Yh as i,we as j,Xt as k,mn as l,gm as m,li as n,um as o,hl as p,xh as q,hm as r,X as s,ml as t,fm as u,ss as v,nm as w,ns as x,mm as y,sm as z};
