const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./PlayerModal-DuX3K7Od.js","./hls-BuERnqCp.js"])))=>i.map(i=>d[i]);
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function i(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(r){if(r.ep)return;r.ep=!0;const a=i(r);fetch(r.href,a)}})();function J(e=document){const t=window.lucide;if(!t?.icons||!t?.createElement||!e)return;const i="[data-lucide]:not(svg)",n=e.matches?.(i)?[e,...e.querySelectorAll(i)]:e.querySelectorAll(i);for(const r of n){const a=r.getAttribute("data-lucide"),o=a.replace(/(^|-)(\w)/g,(d,p,h)=>h.toUpperCase()),s=t.icons[o];if(!s)continue;const l=t.createElement(s);for(const{name:d,value:p}of r.attributes)d!=="class"&&l.setAttribute(d,p);l.classList.add("lucide",`lucide-${a}`);for(const d of r.classList)d!=="lucide"&&!d.startsWith("lucide-")&&l.classList.add(d);r.replaceWith(l)}}const de={WATCH_HISTORY:"sineflix_watch_history_v1",FAVORITES:"sineflix_favorites_v1",WATCHLIST:"sineflix_watchlist_v1",USER_SETTINGS:"sineflix_user_settings_v1",ANIME_IDS:"sineflix_anime_ids_v1"};let vt=null;function dl(){if(vt)return vt;try{if(typeof window>"u"||!window.localStorage)return vt=new Set,vt;const e=localStorage.getItem(de.ANIME_IDS);if(!e)return vt=new Set,vt;const t=JSON.parse(e);return vt=new Set(Array.isArray(t)?t.map(String):[]),vt}catch{return vt=new Set,vt}}function we(e){if(e)try{const t=dl(),i=String(e);t.has(i)||(t.add(i),typeof window<"u"&&window.localStorage&&localStorage.setItem(de.ANIME_IDS,JSON.stringify(Array.from(t))))}catch{}}function He(e){return e?dl().has(String(e)):!1}let Qe=null,Ge=null,at=null,nn=null,li=null,rn=null,an=null,Gt=null,Bi=null,Ei=null,Zn=null,ct=null,ui=null,Vt=null,Et=null;function Ht(){nn=null,li=null,rn=null,an=null}function Er(){Qe=null,Ge=null,at=null,Ht(),Gt=null,Bi=null,Ei=null,Zn=null,vt=null,ct=null,ui=null,Vt=null,Et=null}function Zt(){if(ct)return ct;const e=[{id:"prof_1",name:"Profilim",avatar:"user-circle",isKid:!1,color:"#f59e0b"},{id:"prof_kids",name:"Çocuk Modu 🎈",avatar:"baby",isKid:!0,color:"#38bdf8"}];try{if(typeof window>"u"||!window.localStorage)return ct=e,ct;const t=localStorage.getItem("sineflix_profiles_list_v1");if(!t)return ct=e,ct;let i=JSON.parse(t);return i.some(r=>r.id==="prof_cinema")&&(i=i.filter(r=>r.id!=="prof_cinema"),localStorage.setItem("sineflix_profiles_list_v1",JSON.stringify(i))),ct=i,ct}catch{return ct=e,ct}}function is(e){try{if(ct=e,ui=null,typeof window>"u"||!window.localStorage)return;localStorage.setItem("sineflix_profiles_list_v1",JSON.stringify(e)),window.dispatchEvent(new CustomEvent("sineflix_profiles_updated"))}catch{}}function ul(){try{return typeof window>"u"||!window.localStorage?!0:localStorage.getItem("cinepulse_onboarding_completed")==="true"}catch{return!0}}function Gc(){try{return typeof window>"u"||!window.localStorage?!0:localStorage.getItem("cinepulse_product_tour_completed")==="true"}catch{return!0}}function Vc(){try{if(typeof window>"u"||!window.localStorage)return;localStorage.setItem("cinepulse_product_tour_completed","true")}catch{}}function Jc({name:e,avatar:t="user-circle",color:i="#f59e0b",isKid:n=!1}){try{if(typeof window>"u"||!window.localStorage)return;const r=(e||"").trim()||(n?"Çocuk":"Profilim");let a=Zt();const o=a.findIndex(l=>l.id==="prof_1"),s={id:"prof_1",name:r,avatar:t,color:i,isKid:!!n};return o!==-1?a[o]=s:a.unshift(s),is(a),Qn("prof_1"),localStorage.setItem("cinepulse_onboarding_completed","true"),window.dispatchEvent(new CustomEvent("sineflix_profile_changed",{detail:{profileId:"prof_1"}})),s}catch{return null}}const Jr="1403";function Xc(){try{return typeof window>"u"||!window.localStorage?Jr:localStorage.getItem("cinepulse_admin_pin")||Jr}catch{return Jr}}function Zc(e){try{return typeof window>"u"||!window.localStorage||!e||String(e).length<4?!1:(localStorage.setItem("cinepulse_admin_pin",String(e)),!0)}catch{return!1}}function Qc(e){return String(e).trim()===Xc().trim()}function xr(){if(Et)return Et;const e=["clitoris","le clitoris","erotik","porn"];try{if(typeof window>"u"||!window.localStorage)return Et=e,e;const t=localStorage.getItem("cinepulse_blocked_content");return t?(Et=JSON.parse(t),Et):(Et=e,e)}catch{return Et=e,e}}function ed(e){if(!e)return;const t=xr(),i=String(e).trim().toLowerCase();if(!t.includes(i)){t.push(i),Et=t;try{localStorage.setItem("cinepulse_blocked_content",JSON.stringify(t))}catch{}}}function td(e){if(!e)return;let t=xr();const i=String(e).trim().toLowerCase();t=t.filter(n=>String(n).toLowerCase()!==i),Et=t;try{localStorage.setItem("cinepulse_blocked_content",JSON.stringify(t))}catch{}}function id(e){if(!e)return!1;const t=xr(),i=String(e.id||""),n=`${e.title||""} ${e.name||""} ${e.original_title||""} ${e.original_name||""}`.toLowerCase();return t.some(r=>{const a=String(r).toLowerCase().trim();return a?i===a?!0:n.includes(a):!1})}function wn(){if(ui)return ui;try{const e=Zt(),t=typeof window<"u"&&window.localStorage&&localStorage.getItem("sineflix_active_profile_id")||"prof_1";return ui=e.find(i=>i.id===t)||e[0],ui}catch{return{id:"prof_1",name:"Profilim",avatar:"user-circle",isKid:!1,color:"#f59e0b"}}}function Qn(e){try{if(typeof window>"u"||!window.localStorage)return;localStorage.setItem("sineflix_active_profile_id",e),ui=null,Er(),window.dispatchEvent(new CustomEvent("sineflix_profile_changed",{detail:{profileId:e}}))}catch{}}function Lt(){return wn()?.isKid===!0}function ei(e){if(!e||e.adult===!0||id(e))return!1;const t=[27,80,10752,10768,53,18],i=e.genre_ids||(Array.isArray(e.genres)?e.genres.map(s=>typeof s=="object"?s.id:s):[]);if(i.some(s=>t.includes(Number(s))))return!1;const n=`${e.title||""} ${e.name||""} ${e.overview||""}`.toLowerCase();if(["cinayet","katil","vahşet","kanlı","erotik","dehşet","intikam","mafya","uyuşturucu","şiddet","tecavüz","seri katil","katliam","korku","kan donduran","murder","killer","horror","bloody","psychopath","terror","revenge","savaş","war","battle","death","ölüm"].some(s=>n.includes(s)))return!1;const a=[16,10751,10762];return i.some(s=>a.includes(Number(s)))}function Ns(e=[]){return Array.isArray(e)?Lt()?e.filter(ei):e:[]}function nd({name:e,isKid:t=!1,avatar:i="user-circle",color:n="#f59e0b"}){const r=Zt(),a={id:`prof_${Date.now()}`,name:e.trim()||"Yeni Profil",avatar:i,isKid:!!t,color:n};return r.push(a),is(r),a}function rd(e){if(e==="prof_1")return!1;let t=Zt();return t=t.filter(i=>i.id!==e),is(t),wn()?.id===e&&Qn("prof_1"),!0}function Pt(e){if(e===de.WATCH_HISTORY||e===de.FAVORITES||e===de.WATCHLIST){const t=wn();if(t&&t.id&&t.id!=="prof_1")return`${e}_${t.id}`}return e}function pt(e,t=[]){try{if(typeof window>"u"||!window.localStorage)return t;const i=Pt(e),n=localStorage.getItem(i);return n?JSON.parse(n):t}catch{return t}}const ad="cinepulse_storage_v1",Di="keyval_store";let Ln=null;function pl(){return Ln||(typeof window>"u"||!window.indexedDB?Promise.resolve(null):(Ln=new Promise(e=>{try{const t=window.indexedDB.open(ad,1);t.onupgradeneeded=()=>{const i=t.result;i.objectStoreNames.contains(Di)||i.createObjectStore(Di)},t.onsuccess=()=>e(t.result),t.onerror=()=>e(null)}catch{e(null)}}),Ln))}async function sd(e){try{const t=await pl();return t?new Promise(i=>{try{const a=t.transaction(Di,"readonly").objectStore(Di).get(e);a.onsuccess=()=>i(a.result!==void 0?a.result:null),a.onerror=()=>i(null)}catch{i(null)}}):null}catch{return null}}async function on(e,t){try{const i=await pl();return i?new Promise(n=>{try{const r=i.transaction(Di,"readwrite");r.objectStore(Di).put(t,e),r.oncomplete=()=>n(!0),r.onerror=()=>n(!1)}catch{n(!1)}}):!1}catch{return!1}}async function od(){if(!(typeof window>"u"||!window.indexedDB))try{const e=Pt(de.WATCH_HISTORY),t=await sd(e);if(Array.isArray(t)&&t.length>0){const i=Qe&&Qe.length||0;t.length>=i&&(Qe=t.sort((n,r)=>(r.lastWatchedAt||0)-(n.lastWatchedAt||0)),Ge=null,at=null,Ht(),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{key:e,value:Qe}})))}}catch{}}typeof window<"u"&&setTimeout(od,80);const Mt=new Map;function Hs(){if(!(typeof window>"u")){for(const[e,t]of Mt.entries())try{t.timer&&clearTimeout(t.timer),on(e,t.value),window.localStorage&&localStorage.setItem(e,JSON.stringify(t.value))}catch{}Mt.clear()}}typeof window<"u"&&(window.addEventListener("beforeunload",Hs),window.addEventListener("pagehide",Hs));function Re(e,t,i={}){try{if(typeof window>"u")return;const n=Pt(e);if(on(n,t),window.localStorage)if(i.isProgressUpdate){Mt.has(n)&&clearTimeout(Mt.get(n).timer);const r=setTimeout(()=>{try{localStorage.setItem(n,JSON.stringify(t))}catch{}Mt.delete(n)},2500);Mt.set(n,{timer:r,value:t})}else{Mt.has(n)&&(clearTimeout(Mt.get(n).timer),Mt.delete(n));try{localStorage.setItem(n,JSON.stringify(t))}catch{}}window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{key:n,value:t,...i}}))}catch{}}const fl=["anime","kimetsu","yaiba","iblis keser","demon slayer","naruto","boruto","shingeki","titan","titana saldırı","jujutsu","kaisen","one piece","death note","bleach","dragon ball","hunter x hunter","chainsaw man","tokyo ghoul","my hero academia","boku no hero","kahramanlık akademim","fullmetal","alchemist","simyacı","sword art online","solo leveling","black clover","vinland saga","spy x family","cyberpunk: edgerunners","haikyuu","one punch","berserk","mob psycho","overlord","evangelion","cowboy bebop","code geass","frieren","dr. stone","blue lock","steins;gate","jojo","kaiju no. 8","gintama","fairy tail","violet evergarden","hell's paradise","jigokuraku","dandadan","wind breaker","mushoku tensei","re:zero","delicious in dungeon","dungeon meshi","mashle","baki","hajime no ippo","slamdunk","slam dunk","kuroko","initial d","great teacher onizuka","monster","dororo","fire force","soul eater","noragami","erased","parasyte","psycho-pass","fate/zero","fate/stay","made in abyss","your lie in april","shigatsu wa kimi","anohana","toradora","clannad","classroom of the elite","elite sınıfı","no game no life","konosuba","slime datta ken","shield hero","kalkan kahramanı","goblin slayer","akame ga kill","kill la kill","gurren lagann","darling in the franxx","promised neverland","seven deadly sins","nanatsu no taizai","yedi ölümcül günah","tokyo revengers","blue exorcist","ao no exorcist","d.gray-man","inuyasha","yu yu hakusho","sailor moon","pokemon","digimon","yu-gi-oh","beyblade","captain tsubasa","tsubasa","record of ragnarok","shuumatsu no valkyrie","golden kamuy","dorohedoro","pluto","trigun","hellsing","elfen lied","rurouni kenshin","samurai champloo","fruits basket","horimiya","my dress-up darling","komi can't communicate","rent-a-girlfriend","kaguya-sama","lycoris recoil","zom 100","undead unluck","dead mount death play","seraph of the end","owari no seraph","bungo stray dogs","bungou stray dogs","assassination classroom","suikast sınıfı","black butler","kuroshitsuji","spirited away","ruhların kaçışı","howl's moving castle","yürüyen şato","my neighbor totoro","komşum totoro","princess mononoke","prenses mononoke","your name","kimi no na wa","senin adın","weathering with you","suzume","a silent voice","sessizliğin sesi","koe no katachi","akira","shangri-la frontier","oshi no ko","the eminence in shadow","bocchi the rock"];function ld(e){return e?/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(e):!1}function ot(e){if(!e)return!1;if(e.isAnime===!0||e.type==="anime"||e.media_type==="anime"||e.id&&He(e.id))return!0;const i=(e.genre_ids||(Array.isArray(e.genres)?e.genres.map(a=>typeof a=="object"?a.id:a):[])).some(a=>Number(a)===16),n=e.original_language==="ja"||Array.isArray(e.origin_country)&&e.origin_country.includes("JP");if(i&&n||i&&(e.origin_country?.includes("JP")||e.original_language==="ja")||e.original_language==="ja"&&(i||ld(e.original_name||e.original_title||e.title||e.name))||Array.isArray(e.genres)&&e.genres.map(o=>typeof o=="object"?o.name:String(o)).filter(Boolean).some(o=>/anime/i.test(o)))return e.id&&we(e.id),!0;if(typeof e.id=="string"&&(e.id.startsWith("ta_")||e.id.startsWith("acx_")||e.id.startsWith("tra_")))return we(e.id),!0;const r=(e.title||e.name||e.original_title||e.original_name||"").toLowerCase();for(const a of fl)if(r.includes(a))return e.id&&we(e.id),!0;return!1}function ns(e){return e?e.isSeries===!0||e.type==="tv"||e.media_type==="tv"?!1:e.type==="movie"||e.media_type==="movie"?!0:e.first_air_date||e.number_of_seasons||e.episodesCount||Array.isArray(e.seasons)&&e.seasons.length>0||e.season>1||e.episode>1?!1:!!(e.release_date&&!e.first_air_date):!0}function Me(){return Qe||(Qe=pt(de.WATCH_HISTORY,[]).sort((t,i)=>(i.lastWatchedAt||0)-(t.lastWatchedAt||0)),Qe)}async function cd(){const e=Me();let t=!1;const i="4e44d9029b1270a757cddc766a1bcb63";let n=0;for(let r=0;r<e.length;r++){const a=e[r];if(a.isAnime||a.type==="anime"){a.id&&we(a.id);continue}if(!(a.isAnime===!1&&a.type!=="anime")){if(He(a.id)||ot(a)){a.isAnime=!0,a.type="anime",we(a.id),t=!0;continue}if(n<5&&a.id&&!isNaN(Number(a.id))){n++;try{const o=await fetch(`https://api.themoviedb.org/3/tv/${a.id}?api_key=${i}&language=tr-TR`);if(o.ok){const s=await o.json(),l=s.original_language==="ja"||Array.isArray(s.origin_country)&&s.origin_country.includes("JP"),d=Array.isArray(s.genres)&&s.genres.some(p=>p.id===16||/anim/i.test(p.name));l&&d&&(a.isAnime=!0,a.type="anime",a.isSeries=!0,a.original_language="ja",we(a.id),t=!0)}}catch{}}}}t&&(Ht(),Re(de.WATCH_HISTORY,e))}function Tr(){if(Ge)return Ge;const e=Me();Ge=new Map,at=new Map;for(let t=0;t<e.length;t++){const i=e[t],n=`${i.id}_${i.season||1}_${i.episode||1}`;Ge.has(n)||Ge.set(n,i);const r=String(i.id);at.has(r)||at.set(r,i)}return Ge}function er(e){if(!e||typeof e!="string")return"";let t=e.replace(/^(undefined|null|\/undefined|\/null)$/i,"");if(!t||t.startsWith("data:")||t.startsWith("http"))return t;try{for(;t.includes("%");){const i=decodeURIComponent(t);if(i===t)break;t=i}}catch{}return t=t.replace(/^\/+/,"/"),t.startsWith("/")||(t=`/${t}`),t==="/"||t==="/null"||t==="/undefined"?"":t}function kn(e,t,i,n=[]){const r=n.find(d=>d.id==e&&(d.posterPath||d.poster_path));let a=t||(r?r.posterPath||r.poster_path:""),o=i||(r?r.backdropPath||r.backdrop_path:"");const s=er(a),l=er(o);return{resolvedPoster:s||"",resolvedBackdrop:l||""}}function rs({id:e,title:t,posterPath:i,poster_path:n,backdropPath:r,backdrop_path:a,type:o,isAnime:s=!1,isSeries:l=!1,season:d=1,episode:p=1,currentTime:h=0,duration:m=0,completed:v=!1,genres:y=[],genre_ids:b=[],original_language:w="",origin_country:f=[],...k}){if(!e)return;const x=Me(),L=x.findIndex(K=>K.id==e&&K.season==d&&K.episode==p),S=x.find(K=>K.id==e),A=!!(s||o==="anime"||He(e)||L>=0&&(x[L].isAnime||x[L].type==="anime")||S&&(S.isAnime||S.type==="anime")||ot({id:e,title:t,type:o,genres:y,genre_ids:b,original_language:w,origin_country:f,...k}));A&&we(e);const C=!!(l||o==="tv"||k.first_air_date||k.number_of_seasons||k.episodesCount||Array.isArray(k.seasons)&&k.seasons.length>0||d>1||p>1||L>=0&&(x[L].isSeries||x[L].type==="tv"||x[L].season>1||x[L].episode>1)||S&&(S.isSeries||S.type==="tv"||S.season>1||S.episode>1));let $=A?"anime":C?"tv":"movie";const{resolvedPoster:N,resolvedBackdrop:O}=kn(e,i||n,r||a,x),G=m>0?m:$==="movie"?6600:3e3,U=G>0?Math.min(100,Math.round(h/G*100)):0,z=v||U>=90,D={...k,id:e,title:t||(L>=0?x[L].title:S?S.title:"İçerik"),posterPath:N,poster_path:N,backdropPath:O,backdrop_path:O,type:$,isAnime:A,isSeries:C,genres:y&&y.length>0?y:L>=0?x[L].genres:S?S.genres:[],genre_ids:b&&b.length>0?b:L>=0?x[L].genre_ids:S?S.genre_ids:[],original_language:w||(L>=0?x[L].original_language:S?S.original_language:""),origin_country:f&&f.length>0?f:L>=0?x[L].origin_country:S?S.origin_country:[],season:Number(d),episode:Number(p),currentTime:Math.round(h),duration:Math.round(G),progressPercent:U,completed:z,lastWatchedAt:k.lastWatchedAt?Number(k.lastWatchedAt):Date.now()};L>=0?x[L]=D:x.unshift(D),x.sort((K,ne)=>(ne.lastWatchedAt||0)-(K.lastWatchedAt||0)),Qe=x,Ge&&Ge.set(`${e}_${d}_${p}`,D),at&&at.set(String(e),D),Ht(),Re(de.WATCH_HISTORY,x,{isProgressUpdate:!0})}function hl(e=[]){if(!Array.isArray(e)||e.length===0)return;const t=Me(),i=new Map;for(let o=0;o<t.length;o++){const s=t[o],l=`${s.id}_${s.season||1}_${s.episode||1}`;i.set(l,s)}for(const o of e){if(!o||!o.id)continue;const s=Number(o.season||1),l=Number(o.episode||1),d=`${o.id}_${s}_${l}`,p=i.get(d);if(p&&p.lastWatchedAt&&o.lastWatchedAt&&p.lastWatchedAt>o.lastWatchedAt&&p.completed&&o.completed)continue;const h=!!(o.isAnime||o.type==="anime"||He(o.id)||p&&(p.isAnime||p.type==="anime")||ot(o));h&&we(o.id);const m=!!(o.isSeries||o.type==="tv"||o.first_air_date||s>1||l>1||p&&(p.isSeries||p.type==="tv")),v=h?"anime":m?"tv":"movie",{resolvedPoster:y,resolvedBackdrop:b}=kn(o.id,o.posterPath||o.poster_path,o.backdropPath||o.backdrop_path,t),w=o.duration>0?o.duration:v==="movie"?6600:3e3,f=o.currentTime!==void 0?o.currentTime:o.completed?w:0,k=o.progressPercent!==void 0?o.progressPercent:w>0?Math.min(100,Math.round(f/w*100)):0,x=o.completed===!1?!1:o.completed||k>=90,L={...p||{},...o,id:o.id,title:o.title||p?.title||"İçerik",posterPath:y,poster_path:y,backdropPath:b,backdrop_path:b,type:v,isAnime:h,isSeries:m,season:s,episode:l,currentTime:Math.round(f),duration:Math.round(w),progressPercent:k,completed:x,lastWatchedAt:o.lastWatchedAt?Number(o.lastWatchedAt):p?.lastWatchedAt||Date.now()};i.set(d,L)}const n=Array.from(i.values()).sort((o,s)=>(s.lastWatchedAt||0)-(o.lastWatchedAt||0));Qe=n,Ge=null,at=null,Ht();const r=n.filter(o=>!o.completed).length,a=n.filter(o=>o.completed).length;r>0,Re(de.WATCH_HISTORY,n)}function dd(e,t=1,i=1){let n=Me();n=n.filter(r=>!(r.id==e&&r.season==t&&r.episode==i)),Qe=n,Ge&&Ge.delete(`${e}_${t}_${i}`),Ht(),Re(de.WATCH_HISTORY,n)}function Ca(e){let t=Me();t=t.filter(i=>i.id!=e),Qe=t,Ge=null,Ht(),Re(de.WATCH_HISTORY,t)}function qs(){let e=Me();e=e.filter(t=>!t.completed&&t.progressPercent<90),Re(de.WATCH_HISTORY,e)}function ud(){let e=Me();const t=e.length;return e=e.filter(i=>!(i.currentTime===1e3&&i.duration===1e3)),Qe=e,Ge=null,Ht(),Re(de.WATCH_HISTORY,e),t-e.length}function Qt(e,t=1,i=1){return Tr().get(`${e}_${t}_${i}`)||null}function mn(e,t=1,i=1){const n=Qt(e,t,i);return!!(n&&(n.completed||n.progressPercent>=90))}function ml(e,t=1,i=1,n=!0,r={}){const a=Me(),o=a.findIndex(y=>y.id==e&&y.season==t&&y.episode==i),s=a.find(y=>y.id==e),l=!!(r.isAnime||r.type==="anime"||He(e)||o>=0&&(a[o].isAnime||a[o].type==="anime")||s&&(s.isAnime||s.type==="anime")||ot({id:e,title:r.title,...r}));l&&we(e);const d=r.type==="movie"&&!l,p=r.duration||(d?6600:3e3),{resolvedPoster:h,resolvedBackdrop:m}=kn(e,r.posterPath||r.poster_path,r.backdropPath||r.backdrop_path,a),v={id:e,title:r.title||(o>=0?a[o].title:"İçerik"),posterPath:h,poster_path:h,backdropPath:m,backdrop_path:m,type:l?"anime":d?"movie":"tv",isAnime:l,isSeries:!d,season:Number(t),episode:Number(i),currentTime:n?p:0,duration:p,progressPercent:n?100:0,completed:!!n,lastWatchedAt:Date.now()};o>=0?a[o]=v:a.push(v),Re(de.WATCH_HISTORY,a)}function nm(e,t=!0,i={}){ml(e,1,1,t,{...i,type:i.type||"movie"})}function gl(e,t=1,i=1,n={}){const r=mn(e,t,i);return ml(e,t,i,!r,n),{completed:!r}}function pd(e,t=[],i=!0,n={}){const r=Me(),a=n.title||"Dizi",o=!!(n.isAnime||n.type==="anime"||He(e)||ot({id:e,title:a}));o&&we(e);const s=o?"anime":"tv",l=n.duration||3e3,{resolvedPoster:d,resolvedBackdrop:p}=kn(e,n.posterPath||n.poster_path,n.backdropPath||n.backdrop_path,r);for(const h of t){const m=h.season_number;if(m===0&&t.length>1)continue;const v=h.episode_count||10;for(let y=1;y<=v;y++){const b=r.findIndex(f=>f.id==e&&f.season==m&&f.episode==y),w={id:e,title:a,posterPath:d,poster_path:d,backdropPath:p,backdrop_path:p,type:s,isAnime:o,isSeries:!0,season:Number(m),episode:y,currentTime:i?l:0,duration:l,progressPercent:i?100:0,completed:!!i,lastWatchedAt:Date.now()};b>=0?r[b]=w:r.push(w)}}Re(de.WATCH_HISTORY,r)}function fd(e,t,i=10,n=!0,r={}){const a=Me(),o=r.title||"Dizi",s=!!(r.isAnime||r.type==="anime"||He(e)||ot({id:e,title:o}));s&&we(e);const l=s?"anime":"tv",d=r.duration||3e3,{resolvedPoster:p,resolvedBackdrop:h}=kn(e,r.posterPath||r.poster_path,r.backdropPath||r.backdrop_path,a);for(let m=1;m<=i;m++){const v=a.findIndex(b=>b.id==e&&b.season==t&&b.episode==m),y={id:e,title:o,posterPath:p,poster_path:p,backdropPath:h,backdrop_path:h,type:l,isAnime:s,isSeries:!0,season:Number(t),episode:m,currentTime:n?d:0,duration:d,progressPercent:n?100:0,completed:!!n,lastWatchedAt:Date.now()};v>=0?a[v]=y:a.push(y)}Re(de.WATCH_HISTORY,a)}function Xr(e,t=[]){if(!t||t.length===0)return mn(e,1,1);const i=Tr();for(const n of t){const r=n.season_number;if(r===0&&t.length>1)continue;const a=n.episode_count||1;for(let o=1;o<=a;o++){const s=i.get(`${e}_${r}_${o}`);if(!s||!s.completed&&s.progressPercent<90)return!1}}return!0}function Zr(e,t,i=10){const n=Tr();for(let r=1;r<=i;r++){const a=n.get(`${e}_${t}_${r}`);if(!a||!a.completed&&a.progressPercent<90)return!1}return!0}function La(e,t=1,i=1,n=1500,r={}){const a=!!(r.isAnime||r.type==="anime"||He(e)||ot({id:e,title:r.title,...r}));a&&we(e);const o=r.type==="movie"&&!a,s=r.duration||(o?6600:3e3),l=n||Math.round(s*.5);return rs({id:e,title:r.title||"İçerik",posterPath:r.posterPath||r.poster_path||"",backdropPath:r.backdropPath||r.backdrop_path||"",type:a?"anime":o?"movie":"tv",isAnime:a,isSeries:!o,season:t,episode:i,currentTime:l,duration:s,completed:!1})}function Qr(e){return e?(at||Tr(),at&&at.has(String(e))?at.get(String(e)):Me().find(i=>i.id==e)||null):null}function ci(e){if(!e||e<=0)return"";const t=Math.floor(e/60),i=Math.floor(e%60);if(t>=60){const n=Math.floor(t/60),r=t%60;return`${n}sa ${r>0?r+"dk":""}`}return`${t}:${i<10?"0":""}${i}`}function Fs(e,t){(!t||t<=0)&&(t=3e3);const i=Math.max(0,t-(e||0)),n=Math.round(i/60);if(n<=0)return"Bitti";if(n>=60){const r=Math.floor(n/60),a=n%60;return`${r}sa ${a>0?a+"dk":""} kaldı`}return`${n} dk kaldı`}function hd(e){if(!e||e<=0)return"0 dakika";const t=Math.floor(e/86400),i=Math.floor(e%86400/3600),n=Math.floor(e%3600/60),r=[];return t>0&&r.push(`${t} gün`),i>0&&r.push(`${i} saat`),(n>0||r.length===0)&&r.push(`${n} dk`),r.join(" ")}function Us(){if(an)return an;const e=Me();let t=0,i=0,n=0;for(const a of e){const o=ns(a),s=a.duration&&a.duration>0?a.duration:o?6600:3e3;a.completed?t+=s:a.currentTime>0?t+=a.currentTime:a.progressPercent&&a.progressPercent>0?t+=Math.round(a.progressPercent/100*s):t+=s,o?i++:n++}const r=hd(t);return an={totalSeconds:t,totalMinutes:Math.floor(t/60),totalHours:(t/3600).toFixed(1),formattedTotalTime:r,formattedTotal:r,moviesCount:i,totalMovies:i,episodesCount:n,totalEpisodes:n,totalEntries:e.length},an}function qn(){if(li)return li;const e=Me();if(!e||e.length===0)return li=[],li;const t=new Map;for(const n of e){const r=n.id;t.has(r)||t.set(r,[]),t.get(r).push(n)}const i=[];for(const[n,r]of t.entries()){r.sort((l,d)=>(d.lastWatchedAt||0)-(l.lastWatchedAt||0));const a=r[0],o=!!(a.isAnime||a.type==="anime"||He(a.id)||ot(a));if(o&&we(a.id),r.some(l=>l.isSeries===!0||l.type==="tv"||l.type==="anime"||l.first_air_date||l.number_of_seasons||l.season&&l.season>1||l.episode&&l.episode>1||Array.isArray(l.seasons)&&l.seasons.length>0)){if(r.every($=>$.completed||$.progressPercent>=85))continue;const l=r.find($=>!$.completed&&$.currentTime>0&&$.progressPercent<100);let d=l?l.season||1:a.season||1;const p=new Set;for(const $ of r)$.season===d&&($.completed||$.progressPercent>=90)&&p.add($.episode);let h=1,m=!1,v=0,y=a;if(l&&l.season===d)h=l.episode||1,m=!0,v=l.currentTime||0,y=l;else{for(;p.has(h)&&h<=999;)h++;const $=r.find(N=>N.season===d&&N.episode===h);$&&!$.completed&&$.currentTime>0&&(m=!0,v=$.currentTime,y=$)}const b=r.find($=>$.number_of_seasons||$.status||Array.isArray($.seasons)&&$.seasons.length>0)||a,w=b.status==="Ended"||b.status==="Canceled",k=(Array.isArray(b.seasons)?b.seasons.find($=>$.season_number===d):null)?.episode_count||b.season_episodes_count,x=b.number_of_seasons||(Array.isArray(b.seasons)?b.seasons.filter($=>$.season_number>0).length:0);if(k&&h>k){if(x&&d<x)d++,h=1,m=!1,v=0;else if(w&&!m)continue}if(w&&b.number_of_episodes&&!m&&r.filter(N=>N.completed||N.progressPercent>=90).length>=b.number_of_episodes||p.size===0&&!m&&a.currentTime<=0)continue;const L=y.duration||3e3,S=Fs(v,L),A=o?"Anime Dizisi • ":"";let C="";m&&v>0?C=`${A}S${d} B${h} • Kaldığın: ${ci(v)} • ${S}`:p.size>0||h>1?C=`${A}S${d} B${h} • Sıradaki Bölüm`:C=`${A}S${d} B${h} • Sıradaki Bölüm`,i.push({...a,...y,id:a.id,title:a.title||y.title,posterPath:a.posterPath||y.posterPath,poster_path:a.poster_path||y.poster_path,backdropPath:a.backdropPath||y.backdropPath,backdrop_path:a.backdrop_path||y.backdrop_path,type:o?"anime":"tv",isAnime:o,isSeries:!0,season:d,episode:h,currentTime:m?v:0,subtitle:C})}else{if(a.completed||a.progressPercent>=90)continue;if(a.currentTime>0){const d=a.duration||6600,p=Fs(a.currentTime,d),h=o?"Anime Filmi • ":"";i.push({...a,type:o?"anime":"movie",isAnime:o,isSeries:!1,subtitle:`${h}Kaldığın: ${ci(a.currentTime)} • ${p}`})}}}return i.sort((n,r)=>(r.lastWatchedAt||0)-(n.lastWatchedAt||0)),li=i,li}function ea(){if(rn)return rn;const e=Me(),t=new Map;for(const n of e){const r=n.id;t.has(r)||t.set(r,[]),t.get(r).push(n)}const i=[];for(const[n,r]of t.entries()){r.sort((l,d)=>(d.lastWatchedAt||0)-(l.lastWatchedAt||0));const a=r[0],o=!!(a.isAnime||a.type==="anime"||He(a.id)||ot(a));o&&we(a.id),ns(a)?(a.completed||a.progressPercent>=90)&&i.push({...a,type:o?"anime":"movie",isAnime:o,isSeries:!1,completed:!0,subtitle:o?"✓ Anime Filmi İzlendi":"✓ Film İzlendi"}):r.every(d=>d.completed||d.progressPercent>=85)&&r.length>0&&i.push({...a,type:o?"anime":"tv",isAnime:o,isSeries:!0,completed:!0,subtitle:o?`✓ ${r.length} Bölüm Anime İzlendi`:`✓ ${r.length} Bölüm İzlendi`})}return i.sort((n,r)=>(r.lastWatchedAt||0)-(n.lastWatchedAt||0)),rn=i,rn}function js(){if(nn)return nn;const e=Me(),t=new Map;for(const n of e){const r=n.id;t.has(r)||t.set(r,[]),t.get(r).push(n)}const i=[];for(const[n,r]of t.entries()){r.sort((d,p)=>(p.lastWatchedAt||0)-(d.lastWatchedAt||0));const a=r[0],o=!!(a.isAnime||a.type==="anime"||He(a.id)||ot(a));o&&we(a.id);const s=ns(a),l=o?"anime":s?"movie":"tv";if(s){const d=o?"Anime Filmi • ":"";i.push({...a,type:l,isAnime:o,isSeries:!1,subtitle:a.completed?`✓ ${d}İzlendi`:a.progressPercent>0?`${d}%${a.progressPercent} İzlendi`:d.replace(" • ","")})}else{const d=r.filter(h=>h.completed||h.progressPercent>=85).length,p=o?"Anime Dizisi • ":"";i.push({...a,type:l,isAnime:o,isSeries:!0,subtitle:d>0?`${p}${d} Bölüm İzlendi`:`${p}S${a.season||1} B${a.episode||1}`})}}return i.sort((n,r)=>(r.lastWatchedAt||0)-(n.lastWatchedAt||0)),nn=i,nn}function Ks(){return qn()}function yl(e){if(!e)return e;let t=e.type;const i=!!(e.isAnime||e.type==="anime"||He(e.id)||ot(e));i?(t="anime",e.id&&we(e.id)):(!t||t==="movie")&&(e.isSeries||e.first_air_date||e.media_type==="tv"||e.number_of_seasons||e.episodesCount||!e.title&&e.name?t="tv":t=t||"movie");const n=!!(e.isSeries!==void 0?e.isSeries:t==="tv"||e.first_air_date||e.number_of_seasons||e.episodesCount||e.season&&e.season>1||e.episode&&e.episode>1),r=er(e.poster_path||e.posterPath||e.poster||""),a=er(e.backdrop_path||e.backdropPath||e.backdrop||"");return{...e,type:t,isAnime:i,isSeries:n,poster_path:r,posterPath:r,backdrop_path:a,backdropPath:a}}function Jt(){return Gt||(Gt=pt(de.FAVORITES,[]).map(yl),Bi=new Set(Gt.map(t=>String(t.id))),Gt)}function md(e){return e?(Bi||Jt(),Bi.has(String(e))):!1}function gd(e){if(!e||!e.id)return!1;let t=Jt();const i=t.findIndex(r=>r.id==e.id);let n=!1;if(i>=0)t.splice(i,1);else{const r=!!(e.isAnime||e.type==="anime"||He(e.id)||ot(e));r&&we(e.id);let a=r?"anime":e.type;a||(a=e.first_air_date||e.media_type==="tv"||e.number_of_seasons||!e.title&&e.name?"tv":"movie");const o=e.poster_path||e.posterPath||e.poster||"",s=e.backdrop_path||e.backdropPath||e.backdrop||"";t.unshift({id:e.id,title:e.title||e.name||"İsimsiz",poster_path:o,posterPath:o,backdrop_path:s,backdropPath:s,vote_average:e.vote_average||e.voteAverage||8,release_date:e.release_date||e.first_air_date||"",first_air_date:e.first_air_date||"",genre_ids:e.genre_ids||(Array.isArray(e.genres)?e.genres.map(l=>typeof l=="object"?l.id:l):[]),genres:e.genres||[],original_language:e.original_language||"",origin_country:e.origin_country||[],isAnime:r,type:a,addedAt:Date.now()}),n=!0}return Gt=t,Bi=new Set(t.map(r=>String(r.id))),Re(de.FAVORITES,t),n}function yd(e){let t=Jt();return t=t.filter(i=>i.id!=e),Gt=t,Bi=new Set(t.map(i=>String(i.id))),Re(de.FAVORITES,t),t}function Xt(){return Ei||(Ei=pt(de.WATCHLIST,[]).map(yl),Zn=new Set(Ei.map(t=>String(t.id))),Ei)}function as(e){return e?(Zn||Xt(),Zn.has(String(e))):!1}function vl(e){if(!e||!e.id)return!1;let t=Xt();const i=t.findIndex(r=>r.id==e.id);let n=!1;if(i>=0)t.splice(i,1);else{const r=!!(e.isAnime||e.type==="anime"||He(e.id)||ot(e));r&&we(e.id);let a=r?"anime":e.type;a||(a=e.first_air_date||e.media_type==="tv"||e.number_of_seasons||!e.title&&e.name?"tv":"movie");const o=e.poster_path||e.posterPath||e.poster||"",s=e.backdrop_path||e.backdropPath||e.backdrop||"";t.unshift({id:e.id,title:e.title||e.name||"İsimsiz",poster_path:o,posterPath:o,backdrop_path:s,backdropPath:s,vote_average:e.vote_average||e.voteAverage||8,release_date:e.release_date||e.first_air_date||"",first_air_date:e.first_air_date||"",genre_ids:e.genre_ids||(Array.isArray(e.genres)?e.genres.map(l=>typeof l=="object"?l.id:l):[]),genres:e.genres||[],original_language:e.original_language||"",origin_country:e.origin_country||[],isAnime:r,type:a,addedAt:Date.now()}),n=!0}return Re(de.WATCHLIST,t),n}function vd(e){let t=Xt();return t=t.filter(i=>i.id!=e),Re(de.WATCHLIST,t),t}function bd(){Qe=[],Ge=new Map,at=new Map,Ht(),Re(de.WATCH_HISTORY,[])}function wd(e,t=1,i=1){return dd(e,t,i)}function $t(){return Vt||(Vt=pt(de.USER_SETTINGS,{autoplayNext:!0,preferredResolution:"1080p",theme:"dark",subtitlesEnabled:!0,cardLayout:"portrait",hoverPreviewsEnabled:!0,trailersEnabled:!0}),Vt)}function bl(e){Vt={...$t(),...e},Re(de.USER_SETTINGS,Vt),typeof window<"u"&&window.dispatchEvent(new CustomEvent("cinepulse_settings_changed",{detail:Vt}))}function wl(){const e=pt(de.WATCH_HISTORY,[]),t=pt(de.FAVORITES,[]),i=pt(de.WATCHLIST,[]),n=pt(de.USER_SETTINGS,{}),r={version:"1.0.0",exportDate:new Date().toISOString(),appName:"CinePulse Studio",watchHistory:e,favorites:t,watchlist:i,userSettings:n,data:{watchHistory:e,favorites:t,watchlist:i,userSettings:n}},a=JSON.stringify(r,null,2),o=`cinepulse_yedek_${new Date().toISOString().split("T")[0]}.json`,s=window.CinePulseNative?.saveJsonBackup?.(a,o);if(s!==void 0){if(!String(s).startsWith("OK"))throw new Error(String(s).replace(/^ERROR:/,"")||"JSON yedeği kaydedilemedi.");return o}const l=new Blob([a],{type:"application/json;charset=utf-8"}),d=URL.createObjectURL(l),p=document.createElement("a");return p.href=d,p.download=o,document.body.appendChild(p),p.click(),setTimeout(()=>{document.body.removeChild(p),URL.revokeObjectURL(d)},1e3),o}function kl(e,t="merge"){try{let i=null;if(typeof e=="string"?i=JSON.parse(e.trim()):typeof e=="object"&&e!==null&&(i=e),!i)throw new Error("Geçersiz veya boş yedek dosyası.");let n=[],r=[],a=[],o={};if(Array.isArray(i)?n=i:typeof i=="object"&&(n=i.watchHistory||i.data?.watchHistory||i.sineflix_watch_history_v1||i.history||[],r=i.favorites||i.data?.favorites||i.sineflix_favorites_v1||[],a=i.watchlist||i.data?.watchlist||i.sineflix_watchlist_v1||[],o=i.userSettings||i.data?.userSettings||i.sineflix_user_settings_v1||{}),Array.isArray(n)||(n=[]),Array.isArray(r)||(r=[]),Array.isArray(a)||(a=[]),t==="replace")Re(de.WATCH_HISTORY,n),Re(de.FAVORITES,r),Re(de.WATCHLIST,a),o&&typeof o=="object"&&Re(de.USER_SETTINGS,o);else{const s=pt(de.WATCH_HISTORY,[]),l=new Map;s.forEach(b=>{const w=`${b.id}_${b.season||1}_${b.episode||1}`;l.set(w,b)}),n.forEach(b=>{const w=`${b.id}_${b.season||1}_${b.episode||1}`;if(!l.has(w))l.set(w,b);else{const f=l.get(w);((b.lastWatchedAt||0)>=(f.lastWatchedAt||0)||b.completed)&&l.set(w,{...f,...b})}});const d=Array.from(l.values()).sort((b,w)=>(w.lastWatchedAt||0)-(b.lastWatchedAt||0));Re(de.WATCH_HISTORY,d);const p=pt(de.FAVORITES,[]),h=new Map;p.forEach(b=>h.set(String(b.id),b)),r.forEach(b=>{h.has(String(b.id))||h.set(String(b.id),b)}),Re(de.FAVORITES,Array.from(h.values()));const m=pt(de.WATCHLIST,[]),v=new Map;m.forEach(b=>v.set(String(b.id),b)),a.forEach(b=>{v.has(String(b.id))||v.set(String(b.id),b)}),Re(de.WATCHLIST,Array.from(v.values()));const y=pt(de.USER_SETTINGS,{});Re(de.USER_SETTINGS,{...y,...o})}return Er(),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{action:"import"}})),window.dispatchEvent(new CustomEvent("cinepulse_data_changed",{detail:{action:"import"}})),{success:!0,countHistory:n.length,countFavs:r.length,countWatchlist:a.length,message:`${n.length} izleme kaydı ve ${r.length} favori başarıyla aktarıldı.`}}catch(i){return{success:!1,error:i.message,message:"Yedek dosyası okunamadı: "+i.message}}}function kd(){const e=Me(),t=Jt(),i=Xt(),n=JSON.stringify({history:e,favorites:t,watchlist:i}),r=new Blob([n]).size,a=(r/1024).toFixed(1);return{historyCount:e.length,favoritesCount:t.length,watchlistCount:i.length,bytes:r,kb:a}}function _d(){Er();try{on(Pt(de.WATCH_HISTORY),[]),on(Pt(de.FAVORITES),[]),on(Pt(de.WATCHLIST),[])}catch{}typeof window<"u"&&window.localStorage&&(localStorage.removeItem(Pt(de.WATCH_HISTORY)),localStorage.removeItem(Pt(de.FAVORITES)),localStorage.removeItem(Pt(de.WATCHLIST))),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{cleared:!0}}))}function Sd(){if(!(typeof window>"u"||!window.localStorage))try{localStorage.removeItem("cinepulse_epg_live_cache"),localStorage.removeItem("sineflix_epg_cache_v2");for(let t=0;t<localStorage.length;t++){const i=localStorage.key(t);i&&(i.startsWith("cinepulse_home_fast_")||i.startsWith("sineflix_home_fast_"))&&localStorage.removeItem(i)}const e=localStorage.getItem("sineflix_notifications_v1");if(e)try{const t=JSON.parse(e);Array.isArray(t)&&t.length>25&&localStorage.setItem("sineflix_notifications_v1",JSON.stringify(t.slice(0,25)))}catch{}}catch{}}Sd();const Ed="https://api.themoviedb.org/3",ss=["4e44d9029b1270a757cddc766a1bcb63","844dba0bfd8f3a4f3799f6130ef9e335"];let $a=0;function xd(){return ss[$a]}function Ws(){$a=($a+1)%ss.length}const Ke={POSTER_SMALL:"https://image.tmdb.org/t/p/w185",POSTER_MEDIUM:"https://image.tmdb.org/t/p/w342",BACKDROP_LARGE:"https://image.tmdb.org/t/p/w780",BACKDROP_XLARGE:"https://image.tmdb.org/t/p/w1280",BACKDROP_ORIGINAL:"https://image.tmdb.org/t/p/original",STILL_MEDIUM:"https://image.tmdb.org/t/p/w300"},Td='<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750"><rect width="500" height="750" fill="#0b0f19"/><circle cx="250" cy="300" r="160" fill="#f59e0b" opacity="0.25"/><g transform="translate(190, 230) scale(2.5)" fill="none" stroke="#f59e0b" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></g><text x="250" y="430" font-family="sans-serif" font-weight="800" font-size="30" fill="#ffffff" text-anchor="middle">Cine<tspan fill="#f59e0b">Pulse</tspan></text><text x="250" y="470" font-family="sans-serif" font-weight="500" font-size="16" fill="#64748b" text-anchor="middle">Görsel Yüklenemedi</text></svg>',wt=`data:image/svg+xml,${encodeURIComponent(Td)}`,Ad='<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#1e293b"/><circle cx="50" cy="40" r="18" fill="#64748b"/><path d="M 20 85 C 20 65, 80 65, 80 85 Z" fill="#64748b"/></svg>',tr=`data:image/svg+xml,${encodeURIComponent(Ad)}`;function it(e,t=Ke.POSTER_MEDIUM){if(!e||e==="null"||e==="undefined"||e==="")return wt;if(e.startsWith("http")||e.startsWith("data:"))return e;let i=e;try{for(;i.includes("%");){const n=decodeURIComponent(i);if(n===i)break;i=n}}catch{}return i=i.replace(/^\/+/,"/"),i.startsWith("/")||(i=`/${i}`),i==="/"||i==="/null"||i==="/undefined"?wt:`${t}${i}`}const ta={};async function os(e){if(!e||e.trim().length===0)return"";if(ta[e])return ta[e];try{const t=`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=tr&dt=t&q=${encodeURIComponent(e)}`,i=await fetch(t,{signal:AbortSignal.timeout(1200)});if(i.ok){const n=await i.json();if(n&&n[0]){const r=n[0].map(a=>a[0]).join("");return ta[e]=r,r}}}catch{}return e}const ia=new Map;async function pe(e,t={}){const i=`${e}_${JSON.stringify(t)}`;if(ia.has(i))return ia.get(i);for(let n=0;n<ss.length;n++)try{const r=new URL(`${Ed}${e}`);r.searchParams.append("api_key",xd());for(let o in t)t[o]!==void 0&&t[o]!==null&&r.searchParams.append(o,t[o]);const a=await fetch(r.toString(),{signal:AbortSignal.timeout(6e3)});if(a.ok){const o=await a.json();return ia.set(i,o),o}else Ws()}catch{Ws()}return null}const Cd=new Set([64,84,4370]),Ld=new Set([10764]),$d=["hayalet hikayeleri","a haunting","altin pesinde","gold rush","olumcul av","deadliest catch","hurda avcilari","salvage hunters","tamirat tadilat","wheeler dealers","agir yasamlar","my 600-lb life","evlilige 90 gun","90 day fiance","pasta ustalari","cake boss","agac ev ustalari","treehouse masters","alaska yi kurtarmak","alaskayi kurtarmak","alaska: the last frontier","oto kurtarma kulubu","fast n loud","nehir canavarlari","river monsters","kupon delileri","extreme couponing","temizlik bagimlilari","obsessive compulsive cleaners","asiri cimriler","extreme cheapskates","restoran kurtarma","depo savaslari","storage wars","gumruk kontrol","border security","nasil yapilir","how it's made","how its made","dmax","tlc"],Rd=new Set([3072,34634,3126,45814,1356,45598,61498,59792,29849,23067,44383,44372]);function We(e){if(!e||e.id&&Rd.has(Number(e.id))||(e.genre_ids||(Array.isArray(e.genres)?e.genres.map(r=>typeof r=="object"?r.id:r):[])).some(r=>Ld.has(Number(r))))return!0;const i=e.networks||[];if(Array.isArray(i)&&i.some(r=>Cd.has(Number(r.id||r))))return!0;const n=(e.title||e.name||e.original_title||e.original_name||"").toLowerCase().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c");for(const r of $d)if(n.includes(r))return!0;return!!(Lt()&&!ei(e))}const ls=[[180,["rafadan tayfa","kral sakir","niloya","pepee"]],[225,["miraculous","gumball","adventure time","regular show","teen titans go","ben 10","spongebob","sunger bob"]],[130,["masha and the bear","masa ile koca ayi","winx","scooby doo","ninjago","paw patrol","pijamaskeliler"]],[150,["samurai jack","johnny test","johnny bravo","dexter laboratory","powerpuff girls","courage cowardly dog"]],[110,["avatar the last airbender","avatar son hava bukucu","gravity falls","steven universe","the owl house","amphibia"]]],Ys=[[180,["naruto","one piece","attack on titan","shingeki no kyojin","demon slayer","kimetsu no yaiba"]],[160,["jujutsu kaisen","death note","solo leveling","bleach","dragon ball"]],[140,["pokemon","beyblade","captain tsubasa","yu gi oh","bakugan","my hero academia","boku no hero"]],[120,["hunter x hunter","tokyo ghoul","fullmetal alchemist","vinland saga","monster","jojo","haikyuu","blue lock"]],[105,["chainsaw man","one punch man","spy x family","black clover","frieren","kaiju no 8","dandadan"]]],Id=[[320,["rick and morty","invincible","arcane","bojack horseman"]],[280,["south park","family guy","american dad","futurama","the simpsons"]],[250,["love death robots","harley quinn","archer","solar opposites"]],[220,["castlevania","blue eye samurai","the legend of vox machina","spawn","primal"]],[200,["big mouth","f is for family","disenchantment","inside job","smiling friends","hazbin hotel","helluva boss"]],[180,["boondocks","paradise pd","brickleberry","final space","scavengers reign","pantheon","undone","creature commandos"]]];function Ar(e=""){return String(e).toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ı/g,"i").replace(/[^a-z0-9]+/g," ").trim()}function cs(e){const t=String(e?.original_language||"").toLowerCase(),i=Array.isArray(e?.origin_country)?e.origin_country.map(n=>String(n).toUpperCase()):[];return["ja","zh","ko"].includes(t)||i.some(n=>["JP","CN","KR"].includes(n))}function Md(e,t=!1){const i=Ar([e.name,e.title,e.original_name,e.original_title].filter(Boolean).join(" ")),n=t?Ys:[...ls,...Ys];for(const[r,a]of n)if(a.some(o=>i.includes(o)))return r;return 0}function Gs(e){const t=Ar([e.name,e.title,e.original_name,e.original_title].filter(Boolean).join(" "));for(const[i,n]of Id)if(n.some(r=>t.includes(r)))return i;return 0}function _l(e){const t=Ar([e.name,e.title,e.original_name,e.original_title].filter(Boolean).join(" "));return ls.some(([,i])=>i.some(n=>t.includes(n)))}function Pd(e){const t=Ar([e.name,e.title,e.original_name,e.original_title].filter(Boolean).join(" "));for(const[i,n]of ls)if(n.some(r=>t.includes(r)))return i;return 0}function Cr(e,{animeOnly:t=!1}={}){return e.map(i=>{const n=Math.min(220,Number(i.popularity)||0),r=Math.min(95,Math.log10((Number(i.vote_count)||0)+1)*22),a=Math.max(0,(Number(i.vote_average)||0)-5)*5,o=!t&&i.origin_country?.includes("TR")?115:0,s=n+r+a+o+Md(i,t);return{...i,_turkeyPopularityScore:Math.round(s*100)/100}}).sort((i,n)=>n._turkeyPopularityScore-i._turkeyPopularityScore)}async function Ra(e=1){const[t,i,n,r,a]=await Promise.all([pe("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16",without_genres:"27,80,53,10752,18","vote_count.gte":10,include_adult:!1}),pe("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"10762",without_genres:"27,80,53","vote_count.gte":5,include_adult:!1}),pe("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16",with_origin_country:"TR",without_genres:"27,80,53,10752,18",include_adult:!1}),pe("/discover/tv",{sort_by:"vote_count.desc",page:e+2,language:"tr-TR",with_genres:"16",without_genres:"27,80,53,10752,18","vote_count.gte":10,include_adult:!1}),e===1?pe("/trending/tv/week",{language:"tr-TR"}):Promise.resolve(null)]),o=(a?.results||[]).filter(d=>(d.genre_ids||[]).includes(16)),s=[...t?.results||[],...i?.results||[],...n?.results||[],...r?.results||[],...o],l=new Map;for(const d of s)d&&d.id&&!l.has(d.id)&&l.set(d.id,d);return Cr(Array.from(l.values()).filter(d=>(d.poster_path||d.backdrop_path)&&!We(d)).map(d=>({...d,type:"tv",media_type:"tv",isSeries:!0,overview:(d.overview||"").trim()||Ne(d,"tv")})))}function Bd(e){const t=new Map;for(const i of e)i?.id&&!t.has(i.id)&&t.set(i.id,i);return Cr(Array.from(t.values()).filter(i=>{const n=(i.genre_ids||[]).map(Number);return(i.poster_path||i.backdrop_path)&&n.includes(16)&&(n.includes(10751)||n.includes(10762)||_l(i))&&!cs(i)&&ei(i)&&!We(i)}).map(i=>({...i,type:"tv",media_type:"tv",isSeries:!0,overview:(i.overview||"").trim()||Ne(i,"tv")})))}async function Sl(e,t,i){const n=await Promise.all(t.map(([r,a])=>pe("/discover/tv",{sort_by:i,page:e,language:"tr-TR",with_genres:"16",without_genres:"18,27,53,80,99,10752,10764,10766,10767","first_air_date.gte":r,"first_air_date.lte":a,include_adult:!1})));return Bd(n.flatMap(r=>r?.results||[]))}async function Vs(e=1){return Sl(e,[["2020-01-01","2099-12-31"],["2015-01-01","2019-12-31"]],"popularity.desc")}async function Js(e=1){return Sl(e,[["2010-01-01","2014-12-31"],["2000-01-01","2009-12-31"],["1990-01-01","1999-12-31"],["1900-01-01","1989-12-31"]],"vote_count.desc")}async function Ia(e=1){const[t,i,n]=await Promise.all([pe("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16",without_genres:"10751,10762","vote_count.gte":80,include_adult:!1}),pe("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"16",without_genres:"10751,10762","vote_average.gte":6.5,"vote_count.gte":150,include_adult:!1}),e===1?pe("/trending/tv/week",{language:"tr-TR"}):Promise.resolve(null)]),r=(n?.results||[]).filter(o=>(o.genre_ids||[]).includes(16)),a=new Map;for(const o of[...t?.results||[],...i?.results||[],...r])o?.id&&!a.has(o.id)&&a.set(o.id,o);return Array.from(a.values()).filter(o=>{const s=(o.genre_ids||[]).map(Number);return(o.poster_path||o.backdrop_path)&&s.includes(16)&&!s.includes(10751)&&!s.includes(10762)&&!cs(o)&&!_l(o)&&(e===1?Gs(o)>0:!0)&&!We(o)}).map(o=>{const s=Math.min(250,Number(o.popularity)||0),l=Math.min(130,Math.log10((Number(o.vote_count)||0)+1)*30),d=Math.max(0,(Number(o.vote_average)||0)-5)*8;return{...o,type:"tv",media_type:"tv",isSeries:!0,overview:(o.overview||"").trim()||Ne(o,"tv"),_adultAnimationScore:s+l+d+Gs(o)}}).sort((o,s)=>s._adultAnimationScore-o._adultAnimationScore)}async function ir(e=1){const t=[["2020-01-01","2099-12-31"],["2015-01-01","2019-12-31"],["2010-01-01","2014-12-31"],["2000-01-01","2009-12-31"],["1990-01-01","1999-12-31"],["1980-01-01","1989-12-31"],["1900-01-01","1979-12-31"]],i=await Promise.all(t.map(([r,a])=>pe("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"16",without_genres:"27,80,53,99,10764,10766,10767","first_air_date.gte":r,"first_air_date.lte":a,include_adult:!1}))),n=new Map;for(const r of i)for(const a of r?.results||[])a?.id&&!n.has(a.id)&&n.set(a.id,a);return Array.from(n.values()).filter(r=>{const a=(r.genre_ids||[]).map(Number);return(r.poster_path||r.backdrop_path)&&a.includes(16)&&!a.includes(99)&&!cs(r)&&!Lr(r.name||r.title||"")&&!We(r)}).map(r=>{const a=parseInt(String(r.first_air_date||"").slice(0,4),10)||9999,o=Math.min(220,Number(r.popularity)||0),s=Math.min(115,Math.log10((Number(r.vote_count)||0)+1)*27),l=a<=2018?35:0;return{...r,type:"tv",media_type:"tv",isSeries:!0,overview:(r.overview||"").trim()||Ne(r,"tv"),_cartoonScore:o+s+l+Pd(r)}}).sort((r,a)=>a._cartoonScore-r._cartoonScore)}async function Ma(e=1){const t=await pe("/discover/movie",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"16,10751",without_genres:"27,80,53,10752","vote_count.gte":40});return!t||!t.results?[]:t.results.filter(i=>(i.poster_path||i.backdrop_path)&&!We(i)).map(i=>({...i,type:"movie",media_type:"movie",overview:(i.overview||"").trim()||Ne(i,"movie")}))}async function Xs(e=1){const t=await pe("/discover/movie",{sort_by:"vote_average.desc",page:e,language:"tr-TR",with_genres:"12,14,10751","vote_count.gte":150,without_genres:"27,80,53"});return!t||!t.results?[]:t.results.filter(i=>(i.poster_path||i.backdrop_path)&&!We(i)).map(i=>({...i,type:"movie",media_type:"movie",overview:(i.overview||"").trim()||Ne(i,"movie")}))}async function El(e="all",t="week",i=1){const[n,r]=await Promise.all([pe(`/trending/${e}/${t}`,{page:i,language:"tr-TR"}),pe(`/trending/${e}/${t}`,{page:i,language:"en-US"})]);if(!n||!n.results)return[];const a=new Map((r?.results||[]).map(o=>[o.id,o.overview]));return n.results.filter(o=>(o.poster_path||o.backdrop_path)&&!We(o)).map(o=>{const l=o.media_type==="tv"||!!o.first_air_date?"tv":"movie",d=(o.overview||"").trim(),p=(a.get(o.id)||"").trim();return{...o,type:l,media_type:l,overview:d||p||Ne(o,l)}})}async function nr(e=1){const t=await pe("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR","vote_count.gte":300,without_genres:"16"});return!t||!t.results?[]:t.results.filter(i=>(i.poster_path||i.backdrop_path)&&!We(i)).map(i=>{const n=(i.overview||"").trim();return{...i,type:"tv",media_type:"tv",overview:n||Ne(i,"tv")}})}async function rr(e=1){const t=await pe("/discover/movie",{sort_by:"vote_count.desc",page:e,language:"tr-TR","vote_count.gte":500});return!t||!t.results?[]:t.results.filter(i=>(i.poster_path||i.backdrop_path)&&!We(i)).map(i=>{const n=(i.overview||"").trim();return{...i,type:"movie",media_type:"movie",overview:n||Ne(i,"movie")}})}function Lr(e){return e?/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\u1100-\u11ff\u3130-\u318f\ua960-\ua97f\ud7b0-\ud7ff\u0600-\u06ff\u0400-\u04ff\u0e00-\u0e7f]/.test(e):!1}async function ar(e=1){const[t,i,n,r]=await Promise.all([pe("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16",with_original_language:"ja","vote_count.gte":50}),pe("/discover/tv",{sort_by:"popularity.desc",page:e,language:"en-US",with_genres:"16",with_original_language:"ja","vote_count.gte":50}),pe("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"16",with_original_language:"ja","vote_count.gte":100}),e===1?pe("/trending/tv/week",{language:"tr-TR"}):Promise.resolve(null)]);if(!t||!t.results)return[];const a=new Map((i?.results||[]).map(s=>[s.id,s.name||s.title])),o=new Map([...t.results||[],...n?.results||[],...(r?.results||[]).filter(s=>s.original_language==="ja"&&(s.genre_ids||[]).includes(16))].map(s=>[s.id,s]));return Cr(Array.from(o.values()).filter(s=>(s.poster_path||s.backdrop_path)&&!We(s)).map(s=>{let l=s.name||s.title||"";return(!l||Lr(l))&&(l=a.get(s.id)||s.original_name||s.original_title||l),s.id&&we(s.id),{...s,name:l,title:l,type:"anime",media_type:"anime",isAnime:!0,isSeries:!0,overview:s.overview||Ne(s,"tv")}}),{animeOnly:!0})}async function Pa(e=1){const[t,i]=await Promise.all([pe("/discover/tv",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"16,10762",with_original_language:"ja",without_genres:"27,80,53,10752,18","vote_count.gte":10}),pe("/discover/tv",{sort_by:"popularity.desc",page:e,language:"en-US",with_genres:"16,10762",with_original_language:"ja",without_genres:"27,80,53,10752,18","vote_count.gte":10})]);if(!t||!t.results)return[];const n=new Map((i?.results||[]).map(r=>[r.id,r.name||r.title]));return Cr(t.results.filter(r=>(r.poster_path||r.backdrop_path)&&!We(r)).map(r=>{let a=r.name||r.title||"";return(!a||Lr(a))&&(a=n.get(r.id)||r.original_name||r.original_title||a),r.id&&we(r.id),{...r,name:a,title:a,type:"anime",media_type:"anime",isAnime:!0,isSeries:!0,overview:r.overview||Ne(r,"tv")}}),{animeOnly:!0})}async function sr(e=1){const[t,i]=await Promise.all([pe("/discover/movie",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"99","vote_count.gte":40}),pe("/discover/tv",{sort_by:"vote_count.desc",page:e,language:"tr-TR",with_genres:"99","vote_count.gte":30})]),n=(t?.results||[]).filter(a=>(a.poster_path||a.backdrop_path)&&!We(a)).map(a=>({...a,type:"movie",media_type:"movie",overview:(a.overview||"").trim()||Ne(a,"movie")})),r=(i?.results||[]).filter(a=>(a.poster_path||a.backdrop_path)&&!We(a)).map(a=>({...a,type:"tv",media_type:"tv",overview:(a.overview||"").trim()||Ne(a,"tv")}));return[...n,...r].sort((a,o)=>(o.vote_count||0)-(a.vote_count||0))}async function Dd(e=1){const t=await pe("/discover/movie",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"99,10751",without_genres:"27,80,53,10752","vote_count.gte":10}),i=await pe("/discover/movie",{sort_by:"popularity.desc",page:e,language:"tr-TR",with_genres:"99,16",without_genres:"27,80,53","vote_count.gte":5}),n=t?.results||[],r=i?.results||[],a=new Set,o=[];for(const l of[...n,...r])l&&l.id&&!a.has(l.id)&&(a.add(l.id),o.push(l));const s=["jackass","murder","killer","war","drug","crime","sex","violent","savaş","cinayet","uyuşturucu"];return o.filter(l=>{if(!(l.poster_path||l.backdrop_path)||We(l))return!1;const d=`${l.title||""} ${l.name||""} ${l.overview||""}`.toLowerCase();return!s.some(p=>d.includes(p))}).map(l=>({...l,type:"movie",media_type:"movie",overview:l.overview||Ne(l,"movie")}))}async function Ai(e="tv",t=1){const[i,n]=await Promise.all([pe(`/${e}/top_rated`,{page:t,language:"tr-TR"}),pe(`/${e}/top_rated`,{page:t,language:"en-US"})]);if(!i||!i.results)return[];const r=new Map((n?.results||[]).map(a=>[a.id,a.overview]));return Promise.all(i.results.filter(a=>(a.poster_path||a.backdrop_path)&&!We(a)).map(async a=>{let o=(a.overview||"").trim();const s=(r.get(a.id)||"").trim();return(!o||o.length<15)&&s&&s.length>10&&(o=await os(s)),{...a,type:e,media_type:e,overview:o||s||Ne(a,e)}}))}async function xl({type:e="tv",genreId:t=null,page:i=1,sortBy:n="popularity.desc",minRating:r=0,isAnime:a=!1,isDoc:o=!1,yearMin:s=null,yearMax:l=null,withNetworks:d=null,withProviders:p=null}){const h={sort_by:n,page:i,language:"tr-TR"};return a?(h.with_genres=t?`16,${t}`:"16",h.with_original_language="ja"):o?h.with_genres=t?`99,${t}`:"99":t&&(h.with_genres=t),r>0&&(h["vote_average.gte"]=r,h["vote_count.gte"]=40),s&&(e==="movie"?h["primary_release_date.gte"]=`${s}-01-01`:h["first_air_date.gte"]=`${s}-01-01`),l&&(e==="movie"?h["primary_release_date.lte"]=`${l}-12-31`:h["first_air_date.lte"]=`${l}-12-31`),d&&(e==="tv"?h.with_networks=d:(h.with_watch_providers=p||d,h.watch_region="TR")),((await pe(e==="movie"?"/discover/movie":"/discover/tv",h))?.results||[]).filter(b=>(b.poster_path||b.backdrop_path)&&!We(b)).map(b=>(a&&b.id&&we(b.id),{...b,type:a?"anime":e,media_type:a?"anime":e,isAnime:a,isSeries:e==="tv"}))}function Ne(e,t="tv"){if(!e)return"Sürükleyici atmosferi ve zengin hikaye örgüsüyle izleyicileri ekran başına kilitleyen etkileyici bir yapım.";const i=e.title||e.name||"Bu yapım",n=t==="tv"||e.media_type==="tv"||!!e.first_air_date||e.seasons&&e.seasons.length>0||!!e.number_of_seasons,r=n?"dizi":"film";let a=[];Array.isArray(e.genres)&&e.genres.length>0&&(a=e.genres.map(k=>typeof k=="string"?k:k.name).filter(Boolean));const o=a.length>0?a.slice(0,3).join(", "):n?"Dram ve Gerilim":"Sinema",s=e.release_date||e.first_air_date||(e.year?String(e.year):""),l=s?` ${s.slice(0,4)} yılında izleyiciyle buluşan ve`:"",d=Number(e.vote_average||e.rating||0),p=d>0?`IMDb'de ${d.toFixed(1)}/10 gibi başarılı bir puana sahip olan`:"Eleştirmenler ve izleyiciler tarafından büyük beğeni toplayan";let h="";const m=e.credits?.cast||[];if(m.length>0){const k=m.slice(0,3).map(x=>x.name).filter(Boolean).join(", ");k&&(h=` Başrollerinde ${k} gibi başarılı isimlerin yer aldığı`)}let v="";const y=e.credits?.crew?.filter(k=>k.job==="Director").map(k=>k.name)||[],b=e.created_by?.map(k=>k.name)||[],w=y[0]||b[0];w&&(v=` ${w} imzalı`);let f="";return e.tagline&&e.tagline.trim().length>6&&(f=` "${e.tagline.trim()}" temasıyla dikkat çeken yapım,`),`${i}, ${o} türünde öne çıkan${l}${v}${h} etkileyici bir ${r} deneyimi sunuyor.${f} ${p} yapım, beklenmedik ters köşeleri, derin karakter gelişimleri ve soluksuz temposuyla izleyenlere unutulmaz anlar vadediyor.`}async function Zs(e="tv",t){const i=await pe(`/${e}/${t}`,{append_to_response:"credits,similar,recommendations,videos,external_ids",language:"tr-TR"});if(!i)return null;(i.original_language==="ja"||Array.isArray(i.origin_country)&&i.origin_country.includes("JP"))&&Array.isArray(i.genres)&&i.genres.some(s=>s.id===16||/anim/i.test(s.name))&&i.id&&we(i.id);let r=(i.overview||"").trim();if(!r||r.length<15)try{const s=await pe(`/${e}/${t}`,{language:"en-US"});if(s&&s.overview&&s.overview.trim().length>10){const l=await os(s.overview.trim());l&&l.length>15&&(i.overview=l)}}catch{}(!i.overview||i.overview.trim().length<15)&&(i.overview=Ne(i,e));let a=i.videos?.results||[];if(!a.some(s=>s.site==="YouTube"&&(s.type==="Trailer"||s.type==="Teaser")))try{const l=(await pe(`/${e}/${t}/videos`,{language:"en-US"}))?.results||[];l.length>0&&(i.videos=i.videos||{},i.videos.results=[...a,...l])}catch{}return i}const $n=new Map;function na(e,t){if(!e||e.site!=="YouTube"||!e.key)return-1;let n={Trailer:500,Teaser:360,Promo:280,"Opening Credits":240,Clip:160,Featurette:100}[e.type]||50;return e.official===!0&&(n+=1e3),t==="tr"?n+=50:t==="en"?n+=25:t==="ja"&&(n+=15),/official|resmi|final trailer|main trailer|tanıtım|fragman/i.test(e.name||"")&&(n+=80),/fan|concept|reaction|breakdown/i.test(e.name||"")&&(n-=800),n}function gn(e="tv",t,i=""){if($t().trailersEnabled===!1)return Promise.resolve(null);const n=`${e}:${t}`;if($n.has(n))return $n.get(n);const r=(async()=>{try{const[a,o,s]=await Promise.all([pe(`/${e}/${t}/videos`,{language:"tr-TR"}).catch(()=>null),pe(`/${e}/${t}/videos`,{language:"en-US"}).catch(()=>null),pe(`/${e}/${t}/videos`,{include_video_language:"tr,en,ja,ko,null"}).catch(()=>null)]),l=new Set,d=[],p=(m,v)=>{if(Array.isArray(m))for(const y of m)y&&y.key&&!l.has(y.key)&&(l.add(y.key),d.push({video:y,language:v||y.iso_639_1||"en"}))};p(a?.results,"tr"),p(o?.results,"en"),p(s?.results,""),d.sort((m,v)=>na(v.video,v.language)-na(m.video,m.language));const h=d.find(m=>na(m.video,m.language)>=0)?.video;if(h?.key){const m=h.key.trim(),v=encodeURIComponent(m);return{key:m,name:h.name||"Resmi Fragman",site:h.site,type:h.type,embedUrl:`https://www.youtube.com/embed/${v}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,watchUrl:`https://www.youtube.com/watch?v=${v}`}}if(i&&typeof i=="string"&&i.trim().length>1){const m=i.trim(),v=`${m} Fragman`;return{key:"",name:`${m} Tanıtım`,site:"YouTube",type:"Trailer",embedUrl:`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(v)}&autoplay=1&rel=0`,watchUrl:`https://www.youtube.com/results?search_query=${encodeURIComponent(v)}`}}}catch{}return null})();return $n.set(n,r),r.then(a=>{a||$n.delete(n)}),r}async function zd(e,t=1){const i=await pe(`/tv/${e}/season/${t}`,{language:"tr-TR"});if(!i||!i.episodes)return i;const n=await pe(`/tv/${e}/season/${t}`,{language:"en-US"});return await Promise.all(i.episodes.map(async(r,a)=>{let o=r.overview?r.overview.trim():"";(!o||o.length<5)&&n&&n.episodes&&n.episodes[a]&&n.episodes[a].overview&&(o=n.episodes[a].overview),o&&(!r.overview||r.overview.length<5)&&(r.overview=await os(o))})),i}async function ds(e,t=1){if(!e||!e.trim())return[];const i=e.trim().toLowerCase(),[n,r,a]=await Promise.all([pe("/search/multi",{query:i,page:t,language:"tr-TR",include_adult:!1}),pe("/search/multi",{query:i,page:t,language:"en-US",include_adult:!1}),pe("/search/tv",{query:i,page:t,language:"tr-TR",include_adult:!1})]),o=new Map,s=d=>{if(Array.isArray(d)){for(const p of d)if(!(!p||!p.id)&&!(!p.poster_path&&!p.backdrop_path)&&!We(p)&&!o.has(p.id)){const h=p.media_type==="tv"||!!p.first_air_date||p.name&&!p.title;o.set(p.id,{...p,type:h?"tv":"movie",media_type:h?"tv":"movie"})}}};s(n?.results),s(r?.results),s(a?.results);const l=Array.from(o.values());return l.sort((d,p)=>{const h=(d.title||d.name||d.original_title||d.original_name||"").toLowerCase(),m=(p.title||p.name||p.original_title||p.original_name||"").toLowerCase(),v=h===i?100:h.startsWith(i)?50:0,y=m===i?100:m.startsWith(i)?50:0,b=v+Math.min(100,(d.vote_count||0)/50)+(d.popularity||0)*.5;return y+Math.min(100,(p.vote_count||0)/50)+(p.popularity||0)*.5-b}),l}const gt={ACTION_ADVENTURE:10759,ANIMATION:16,COMEDY:35,CRIME:80,DOCUMENTARY:99,DRAMA:18,FAMILY:10751,MYSTERY:9648,SCI_FI_FANTASY:10765,WAR_POLITICS:10768,WESTERN:37},je={ACTION:28,ADVENTURE:12,ANIMATION:16,COMEDY:35,CRIME:80,DOCUMENTARY:99,DRAMA:18,FAMILY:10751,FANTASY:14,HISTORY:36,HORROR:27,MUSIC:10402,MYSTERY:9648,ROMANCE:10749,SCI_FI:878,THRILLER:53,WESTERN:37};async function Od(e){if(!e)return null;const t=await pe(`/person/${e}`,{language:"tr-TR",append_to_response:"combined_credits"});if(!t||!t.biography||t.biography.trim().length===0){const i=await pe(`/person/${e}`,{language:"en-US",append_to_response:"combined_credits"});if(i)if(t)t.biography=i.biography,!t.combined_credits&&i.combined_credits&&(t.combined_credits=i.combined_credits);else return i}return t}function Z(e,t="info",i=3500){const n=document.getElementById("toast-container");if(!n)return;const r=document.createElement("div");r.className=`toast toast-${t}`;let a="info";t==="success"&&(a="check-circle"),t==="error"&&(a="alert-circle"),r.innerHTML=`
    <i data-lucide="${a}"></i>
    <span>${e}</span>
  `,n.appendChild(r),J(),setTimeout(()=>{r.style.opacity="0",r.style.transform="translateX(100%)",r.style.transition="all 0.3s ease-out",setTimeout(()=>{r.parentNode&&r.parentNode.removeChild(r)},300)},i)}const ht="https://api.trakt.tv",Nd="AsVFyJXykTMViLCXPMAvFGtk7B_npj5Y3STpzljYnwY",Hd="4b6l8YaAG-GzyY6cSPFR5ea66xrXYEqrrHhn3FiWa7k",st={TOKEN:"cinepulse_trakt_token",USER:"cinepulse_trakt_user",SETTINGS:"cinepulse_trakt_settings",LAST_SYNC:"cinepulse_trakt_last_sync"};let pi=null,or=null,lr=0;function $r(){return localStorage.getItem("cinepulse_trakt_custom_client_id")||Nd}function Tl(){return localStorage.getItem("cinepulse_trakt_custom_client_secret")||Hd}function Ui(){try{const e=localStorage.getItem(st.SETTINGS);if(e)return JSON.parse(e)}catch{}return{autoScrobble:!0,scrobbleThreshold:80,autoSyncOnLaunch:!0}}function Qs(e){const i={...Ui(),...e};return localStorage.setItem(st.SETTINGS,JSON.stringify(i)),i}const eo=15*60*1e3;let to=!1,ra=!1,Al=0;function Cl(e){if(to){ii()&&io(e);return}to=!0;const t=()=>{document.visibilityState!=="hidden"&&(Date.now()-Al<eo||io(e))};window.setTimeout(t,4e3),window.setInterval(t,eo),document.addEventListener("visibilitychange",t)}async function io(e){if(!(!Ui().autoSyncOnLaunch||!ii()||ra)){ra=!0,Al=Date.now();try{(await $l(e)).errors.length}catch{}finally{ra=!1}}}function Ll(){try{const e=localStorage.getItem(st.TOKEN);return e?JSON.parse(e):null}catch{return null}}function ii(){const e=Ll();return!!(e&&e.access_token)}function qd(){try{const e=localStorage.getItem(st.USER);return e?JSON.parse(e):null}catch{return null}}function Fd(){const e=localStorage.getItem(st.LAST_SYNC);return e?Number(e):null}async function yi(){const e=Ll();if(!e||!e.access_token)return null;const t=Math.floor(Date.now()/1e3);if((e.created_at||0)+(e.expires_in||0)-t<86400&&e.refresh_token)try{const n=await Kd(e.refresh_token);if(n?.access_token)return n.access_token}catch{}return e.access_token}async function Ud(){const e=$r(),t=await fetch(`${ht}/oauth/device/code`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({client_id:e})});if(!t.ok){const i=await t.text();throw new Error(`Device code error (${t.status}): ${i}`)}return await t.json()}function jd(e,t=5,i=()=>{}){pi&&pi.abort(),pi=new AbortController;const{signal:n}=pi;return new Promise((r,a)=>{const o=$r(),s=Tl();let l=Math.max(t,5)*1e3;const d=async()=>{if(n.aborted){a(new Error("Auth polling cancelled"));return}try{const p=await fetch(`${ht}/oauth/device/token`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:e,client_id:o,client_secret:s}),signal:n});if(p.status===200){const m=await p.json();localStorage.setItem(st.TOKEN,JSON.stringify(m));let v=null;try{v=await Yd(m.access_token),v&&localStorage.setItem(st.USER,JSON.stringify(v))}catch{}window.dispatchEvent(new CustomEvent("cinepulse_trakt_auth_changed",{detail:{connected:!0,user:v}})),r(m);return}if(p.status===400){i({status:"pending",message:"Kullanıcı onayı bekleniyor..."}),n.aborted||setTimeout(d,l);return}if(p.status===404)throw new Error("Geçersiz cihaz kodu.");if(p.status===409)throw new Error("Bu kod zaten kullanılmış.");if(p.status===410)throw new Error("Kodun süresi doldu. Lütfen tekrar deneyin.");if(p.status===429){l+=2e3,n.aborted||setTimeout(d,l);return}const h=await p.text();throw new Error(`Trakt auth failed: ${h}`)}catch(p){if(n.aborted)return;a(p)}};setTimeout(d,l)})}function Ba(){pi&&(pi.abort(),pi=null)}async function Kd(e){const t=$r(),i=Tl(),n=await fetch(`${ht}/oauth/token`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refresh_token:e,client_id:t,client_secret:i,grant_type:"refresh_token"})});if(!n.ok)throw new Error("Token refresh failed");const r=await n.json();return localStorage.setItem(st.TOKEN,JSON.stringify(r)),r}function Wd(){Ba(),localStorage.removeItem(st.TOKEN),localStorage.removeItem(st.USER),localStorage.removeItem(st.LAST_SYNC),window.dispatchEvent(new CustomEvent("cinepulse_trakt_auth_changed",{detail:{connected:!1}}))}function zt(e){return{"Content-Type":"application/json","trakt-api-version":"2","trakt-api-key":$r(),Authorization:`Bearer ${e}`}}async function Yd(e=null){const t=e||await yi();if(!t)return null;const i=await fetch(`${ht}/users/me?extended=full`,{headers:zt(t)});if(!i.ok)return null;const n=await i.json();return localStorage.setItem(st.USER,JSON.stringify(n)),n}function us(e,t=0){const i=Math.min(100,Math.max(0,Math.round(t))),n=e.tmdbId||e.id;return(e.isSeries===!0?!0:e.isSeries===!1||e.type==="movie"?!1:!!(e.type==="tv"||e.season&&Number(e.season)>0&&e.type!=="movie"))?{show:{title:e.seriesTitle||e.title||"",ids:{tmdb:Number(n)||void 0}},episode:{season:Math.max(1,Number(e.season)||1),number:Math.max(1,Number(e.episode)||1)},progress:i,app_version:"2.0.0",app_date:"2026-09-25"}:{movie:{title:e.title||"",ids:{tmdb:Number(n)||void 0}},progress:i,app_version:"2.0.0",app_date:"2026-09-25"}}async function rm(e,t=0){if(!Ui().autoScrobble||!ii())return null;const n=Date.now();if(or==="start"&&n-lr<8e3)return null;const r=await yi();if(!r)return null;try{const a=us(e,t),o=await fetch(`${ht}/scrobble/start`,{method:"POST",headers:zt(r),body:JSON.stringify(a)});if(o.ok)return or="start",lr=n,await o.json()}catch{}return null}async function am(e,t=0){if(!Ui().autoScrobble||!ii())return null;const n=await yi();if(!n)return null;try{const r=us(e,t),a=await fetch(`${ht}/scrobble/pause`,{method:"POST",headers:zt(n),body:JSON.stringify(r),keepalive:!0});if(a.ok)return or="pause",lr=Date.now(),await a.json()}catch{}return null}async function sm(e,t=100){if(!Ui().autoScrobble||!ii())return null;const n=await yi();if(!n)return null;try{const r=us(e,t),a=await fetch(`${ht}/scrobble/stop`,{method:"POST",headers:zt(n),body:JSON.stringify(r),keepalive:!0});if(a.ok)return or="stop",lr=Date.now(),await a.json()}catch{}return null}async function Gd(e){const t=await yi();if(!t||!e||!e.length)return null;const i=[],n=new Map;for(const s of e){const l=s.tmdbId||s.id,d=Number(l);if(!d||isNaN(d))continue;const p=new Date(Number(s.lastWatchedAt)||s.lastWatchedAt||Date.now()),h=Number.isNaN(p.getTime())?new Date().toISOString():p.toISOString();if(s.type==="movie"?!1:!!(s.isSeries||s.type==="tv"||s.type==="anime")){const v=Math.max(1,Number(s.season)||1),y=Math.max(1,Number(s.episode)||1);n.has(d)||n.set(d,{title:s.title||"",ids:{tmdb:d},seasonsMap:new Map});const b=n.get(d);b.seasonsMap.has(v)||b.seasonsMap.set(v,[]),b.seasonsMap.get(v).push({number:y,watched_at:h})}else i.push({title:s.title||"",watched_at:h,ids:{tmdb:d}})}const r=Array.from(n.values()).map(s=>({title:s.title,ids:s.ids,seasons:Array.from(s.seasonsMap.entries()).map(([l,d])=>({number:l,episodes:d}))}));if(i.length===0&&r.length===0)return null;const a={};i.length>0&&(a.movies=i),r.length>0&&(a.shows=r);const o=await fetch(`${ht}/sync/history`,{method:"POST",headers:zt(t),body:JSON.stringify(a)});if(!o.ok){const s=await o.text();throw new Error(`Trakt API Hatası (${o.status}): ${s}`)}return await o.json()}const Vd="4e44d9029b1270a757cddc766a1bcb63",aa=new Map;async function sa(e,t=!1){const i=`${t?"tv":"movie"}_${e}`;if(aa.has(i))return aa.get(i);try{const r=await fetch(`https://api.themoviedb.org/3/${t?"tv":"movie"}/${e}?api_key=${Vd}&language=tr-TR`);if(r.ok){const a=await r.json();return aa.set(i,a),a}}catch{}return null}async function no(e,t){const i=[],n=new Set,r=e==="shows"?100:250;for(let a=1;;a++){const o=new URLSearchParams({page:String(a),limit:String(r)});e==="shows"&&o.set("extended","progress");const s=await fetch(`${ht}/sync/watched/${e}?${o}`,{headers:zt(t)});if(!s.ok)throw new Error(`İzlenen ${e==="shows"?"diziler":"filmler"} alınamadı (${s.status})`);const l=await s.json();if(!Array.isArray(l))throw new Error("Trakt izlenenler yanıtı geçersiz");if(l.length===0)break;let d=0;for(const h of l){const m=h[e==="shows"?"show":"movie"]?.ids?.trakt;m&&n.has(m)||(m&&n.add(m),i.push(h),d++)}if(!d)break;const p=Number(s.headers?.get("X-Pagination-Page-Count"));if(p&&a>=p||!p&&l.length<r)break}return i}async function Jd(e){const t=await yi();if(!t)return{importedPlaybackCount:0,importedHistoryCount:0};const{saveWatchProgress:i,saveBatchWatchProgress:n,getWatchHistory:r}=e;if(!i&&!n)return{importedPlaybackCount:0,importedHistoryCount:0};let a=0,o=0;const s=[],l=[],d=r?r():[],p=new Map;for(const h of d){const m=`${h.id}_${h.season||1}_${h.episode||1}`;p.set(m,h)}try{const h=await fetch(`${ht}/sync/playback?extended=full&limit=50`,{headers:zt(t),signal:AbortSignal.timeout(8e3)});if(h.ok){const m=await h.json();if(Array.isArray(m)){for(const v of m){const y=v.type==="movie",b=y?v.movie:v.show||v.episode,w=y?v.movie?.ids?.tmdb||b?.ids?.tmdb:v.show?.ids?.tmdb||v.episode?.ids?.tmdb||b?.ids?.tmdb;if(!w)continue;const f=y?1:v.episode?.season||1,k=y?1:v.episode?.number||1,x=Math.min(99,Math.max(1,Math.round(v.progress||0))),L=v.paused_at?new Date(v.paused_at).getTime():Date.now(),S=`${w}_${f}_${k}`,A=p.get(S);let C=A?.poster_path||A?.posterPath||"",$=A?.backdrop_path||A?.backdropPath||"",N=A?.title||v.show?.title||b?.title||"",O=y?6600:3e3,G={};if(!C||!N){const z=await sa(w,!y);z&&(C=z.poster_path||"",$=z.backdrop_path||"",N=z.title||z.name||N,z.runtime?O=z.runtime*60:z.episode_run_time?.[0]&&(O=z.episode_run_time[0]*60),y||(G={number_of_episodes:z.number_of_episodes,number_of_seasons:z.number_of_seasons,status:z.status,seasons:z.seasons}))}const U=Math.max(60,Math.round(x/100*O));l.push({id:w,title:N,posterPath:C,backdropPath:$,type:y?"movie":"tv",isSeries:!y,season:y?void 0:f,episode:y?void 0:k,currentTime:U,duration:O,progressPercent:x,completed:!1,traktImported:!0,lastWatchedAt:L,...G}),a++}l.length>0&&(n?n(l):i&&l.forEach(v=>i(v)),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{action:"playback_import",source:"trakt"}})))}}}catch(h){s.push(h.message)}try{{const h=await no("movies",t);if(Array.isArray(h))for(let m=0;m<h.length;m+=5){const v=h.slice(m,m+5);await Promise.all(v.map(async y=>{const b=y.movie?.ids?.tmdb;if(!b)return;const w=`${b}_1_1`,f=p.get(w);if(f&&f.completed)return;const k=y.last_watched_at?new Date(y.last_watched_at).getTime():Date.now();let x=f?.poster_path||f?.posterPath||"",L=f?.backdrop_path||f?.backdropPath||"",S=f?.title||y.movie?.title||"",A=6600;if(!x||!S){const C=await sa(b,!1);C&&(x=C.poster_path||"",L=C.backdrop_path||"",S=C.title||S,C.runtime&&(A=C.runtime*60))}l.push({id:b,title:S,posterPath:x,backdropPath:L,type:"movie",isSeries:!1,currentTime:A,duration:A,progressPercent:100,completed:!0,traktImported:!0,lastWatchedAt:k}),o++}))}}}catch(h){s.push(h.message)}try{{const h=await no("shows",t);if(Array.isArray(h))for(let m=0;m<h.length;m+=4){const v=h.slice(m,m+4);await Promise.all(v.map(async y=>{const b=y.show?.ids?.tmdb;if(!b)return;const w=y.show?.title||"",f=await sa(b,!0),k=f?.poster_path||"",x=f?.backdrop_path||"",L=f?.name||f?.title||w,S=f?.episode_run_time?.[0]?f.episode_run_time[0]*60:3e3,A={number_of_episodes:f?.number_of_episodes,number_of_seasons:f?.number_of_seasons,status:f?.status,seasons:f?.seasons},C=Array.isArray(y.seasons)?y.seasons:[];for(const $ of C){const N=$.number,O=Array.isArray($.episodes)?$.episodes:[];for(const G of O){const U=G.number,z=`${b}_${N}_${U}`,D=p.get(z);if(D&&D.completed)continue;const K=G.last_watched_at?new Date(G.last_watched_at).getTime():Date.now();l.push({id:b,title:L,posterPath:k,backdropPath:x,type:"tv",isSeries:!0,season:N,episode:U,currentTime:S,duration:S,progressPercent:100,completed:!0,traktImported:!0,lastWatchedAt:K,...A}),o++}}}))}}}catch(h){s.push(h.message)}if(l.length>0){if(n)n(l);else if(i)for(const h of l)i(h)}return window.dispatchEvent(new CustomEvent("cinepulse_data_changed",{detail:{action:"import",source:"trakt"}})),window.dispatchEvent(new CustomEvent("sineflix_data_changed",{detail:{action:"import",source:"trakt"}})),{importedPlaybackCount:a,importedHistoryCount:o,errors:s}}async function $l(e){if(!ii())throw new Error("Trakt hesabı bağlı değil");const{getWatchHistory:t,saveWatchProgress:i,saveBatchWatchProgress:n}=e,r={pushedMoviesCount:0,pushedEpisodesCount:0,importedPlaybackCount:0,importedHistoryCount:0,errors:[]};if(i||n)try{const a=await Jd(e);r.importedPlaybackCount=a.importedPlaybackCount||0,r.importedHistoryCount=a.importedHistoryCount||0,r.errors.push(...a.errors||[])}catch(a){r.errors.push(`Trakt'tan aktarma: ${a.message}`)}try{const o=(t?t():[]).filter(s=>s.completed&&!s.traktImported);if(o.length>0){const s=await Gd(o);if(s&&s.added){r.pushedMoviesCount=s.added.movies||0,r.pushedEpisodesCount=s.added.episodes||0;const l=Object.values(s.not_found||{}).reduce((d,p)=>d+(Array.isArray(p)?p.length:0),0);l&&r.errors.push(`Trakt ${l} içeriği katalogunda bulamadı`)}}}catch(a){r.errors.push(`Trakt'a gönderme: ${a.message||"Senkronizasyon hatası"}`)}return r.errors.length===0&&localStorage.setItem(st.LAST_SYNC,String(Date.now())),r}async function Xd(){const e=await yi();if(!e)throw new Error("Trakt hesabı bağlı değil");const t=await fetch(`${ht}/sync/history?limit=1000`,{headers:zt(e)});if(!t.ok)throw new Error("Trakt geçmişi alınamadı");const i=await t.json();if(!Array.isArray(i)||i.length===0)return 0;const n=i.map(o=>o.id).filter(Boolean);if(n.length===0)return 0;const r=await fetch(`${ht}/sync/history/remove`,{method:"POST",headers:zt(e),body:JSON.stringify({ids:n})});if(!r.ok){const o=await r.text();throw new Error(`Trakt geçmişi silinemedi: ${o}`)}const a=await r.json();return(a.deleted?.movies||0)+(a.deleted?.episodes||0)}let si=null;function cr(){let e=document.getElementById("trakt-modal");e||(e=document.createElement("div"),e.id="trakt-modal",e.className="modal-backdrop",document.body.appendChild(e));const t=(r="main",a={})=>{const o=ii(),s=qd(),l=Ui(),d=Fd();let p="Henüz yapılmadı";if(d){const h=new Date(d);p=`${h.toLocaleDateString("tr-TR")} ${h.toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})}`}if(r==="connecting"){const{userCode:h,verificationUrl:m,expiresIn:v}=a;e.innerHTML=`
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
      `;e.classList.remove("hidden"),document.body.style.overflow="hidden",J(e),n(r)},i=()=>{Ba(),e.classList.add("hidden"),e.innerHTML="",document.body.style.overflow="",si&&(window.removeEventListener("keydown",si),si=null)},n=r=>{const a=document.getElementById("trakt-close-btn"),o=document.getElementById("trakt-close-footer-btn");if(a&&(a.onclick=i),o&&(o.onclick=i),e.onclick=s=>{s.target===e&&i()},si&&window.removeEventListener("keydown",si),si=s=>{s.key==="Escape"&&i()},window.addEventListener("keydown",si),r==="connecting"){const s=document.getElementById("btn-copy-trakt-code");s&&(s.onclick=()=>{const d=s.querySelector(".trakt-code-text")?.textContent;d&&navigator.clipboard.writeText(d).then(()=>{Z("Aktivasyon kodu kopyalandı!","success")}).catch(()=>{Z(`Kod: ${d}`,"info")})});const l=document.getElementById("btn-cancel-trakt-poll");l&&(l.onclick=()=>{Ba(),t("main")})}else{const s=document.getElementById("btn-start-trakt-connect");s&&(s.onclick=async()=>{s.disabled=!0,s.innerHTML="<span>Kod alınıyor...</span>";try{const y=await Ud();t("connecting",{userCode:y.user_code,verificationUrl:y.verification_url,expiresIn:y.expires_in}),jd(y.device_code,y.interval,b=>{const w=document.getElementById("trakt-poll-status-text");w&&(w.textContent=b.message)}).then(()=>{Z("Trakt.tv başarıyla bağlandı!","success"),t("main")}).catch(b=>{b.message!=="Auth polling cancelled"&&(Z(`Bağlantı hatası: ${b.message}`,"error"),t("main"))})}catch(y){Z(`Trakt bağlantı başlatılamadı: ${y.message}`,"error"),t("main")}});const l=document.getElementById("btn-trakt-sync-now");l&&(l.onclick=async()=>{const y=document.getElementById("trakt-sync-icon"),b=document.getElementById("trakt-sync-result");l.disabled=!0,y&&y.classList.add("trakt-spin");try{const w=await $l({getWatchHistory:Me,saveWatchProgress:rs,saveBatchWatchProgress:hl});b&&(b.style.display="block",b.innerHTML=`
                <strong>${w.errors.length?"Senkronizasyon kısmen tamamlandı":"✓ Karşılıklı senkronizasyon tamamlandı!"}</strong><br/>
                • ${w.pushedMoviesCount} film & ${w.pushedEpisodesCount} dizi Trakt'a yüklendi<br/>
                • ${w.importedPlaybackCount} yarım kalan & ${w.importedHistoryCount} izlenen Trakt'tan CinePulse'a aktarıldı
              `),w.errors.length?Z(`Trakt senkronizasyon uyarısı: ${w.errors.join("; ")}`,"error"):(Z("CinePulse ve Trakt başarıyla karşılıklı eşitlendi!","success"),setTimeout(()=>t("main"),2500))}catch(w){Z(`Aktarım hatası: ${w.message}`,"error")}finally{l.disabled=!1,y&&y.classList.remove("trakt-spin")}});const d=document.getElementById("btn-clean-trakt-history");d&&(d.onclick=()=>{const y=ud();Z(`${y} adet hatalı Trakt kaydı geçmişten temizlendi!`,"success"),t("main")});const p=document.getElementById("btn-wipe-trakt-history");p&&(p.onclick=async()=>{if(confirm("Trakt.tv hesabınızdaki tüm izleme geçmişini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")){p.disabled=!0,p.innerHTML="<span>Sıfırlanıyor...</span>";try{const y=await Xd();Z(`Trakt hesabından ${y} adet kayıt tamamen silindi!`,"success"),t("main")}catch(y){Z(`Hata: ${y.message}`,"error"),p.disabled=!1,t("main")}}});const h=document.getElementById("trakt-toggle-autosync");h&&(h.onchange=y=>{Qs({autoSyncOnLaunch:y.target.checked}),Z(y.target.checked?"Açılışta otomatik eşitleme açıldı":"Açılışta otomatik eşitleme kapatıldı","info")});const m=document.getElementById("trakt-toggle-scrobble");m&&(m.onchange=y=>{Qs({autoScrobble:y.target.checked}),Z(y.target.checked?"Otomatik Scrobble açıldı":"Otomatik Scrobble kapatıldı","info")});const v=document.getElementById("btn-trakt-disconnect");v&&(v.onclick=()=>{confirm("Trakt.tv bağlantısını kesmek istediğinize emin misiniz?")&&(Wd(),Z("Trakt.tv bağlantısı kesildi","info"),t("main"))})}};t("main")}function Rl(){const e=document.getElementById("data-modal");if(!e)return;const t=kd();e.innerHTML=`
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
            <div>• Bağlantı: <strong>${ii()?'<span style="color:#4ade80;">● Bağlı</span>':'<span style="color:#94a3b8;">○ Bağlı Değil</span>'}</strong></div>
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
  `,e.classList.remove("hidden"),document.body.style.overflow="hidden",J();const i=document.getElementById("data-close-btn"),n=document.getElementById("data-close-footer-btn");let r=null;const a=()=>{e.classList.add("hidden"),e.innerHTML="",document.body.style.overflow="",r&&(window.removeEventListener("keydown",r),r=null)};i&&i.addEventListener("click",a),n&&n.addEventListener("click",a),e.onclick=m=>{m.target===e&&a()},r=m=>{m.key==="Escape"&&a()},window.addEventListener("keydown",r);const o=document.getElementById("btn-export-json");o&&o.addEventListener("click",()=>{try{wl(),Z("JSON yedekleme tamamlandı.","success")}catch(m){Z(m?.message||"JSON yedeği kaydedilemedi.","error")}});const s=document.getElementById("btn-open-trakt-from-data");s&&s.addEventListener("click",()=>{a(),cr()});const l=document.getElementById("json-dropzone"),d=document.getElementById("json-file-input");l&&d&&(l.addEventListener("click",()=>d.click()),l.addEventListener("dragover",m=>{m.preventDefault(),l.style.borderColor="var(--accent-green)"}),l.addEventListener("dragleave",()=>{l.style.borderColor="rgba(99, 102, 241, 0.4)"}),l.addEventListener("drop",m=>{m.preventDefault(),l.style.borderColor="rgba(99, 102, 241, 0.4)",m.dataTransfer.files.length>0&&p(m.dataTransfer.files[0])}),d.addEventListener("change",m=>{m.target.files.length>0&&p(m.target.files[0])}));function p(m){if(!m)return;const v=new FileReader;v.onload=y=>{try{const b=document.querySelector('input[name="import-mode"]:checked'),w=b?b.value:"merge",f=kl(y.target.result,w);f.success?(Z(`✓ Yedek yüklendi! (${f.countHistory} izleme kaydı, ${f.countFavs} favori aktarıldı)`,"success"),a()):Z(`Yükleme hatası: ${f.message||f.error}`,"error")}catch(b){Z(`Yedek dosyası işlenirken hata oluştu: ${b.message}`,"error")}},v.onerror=()=>{Z("Dosya okunamadı.","error")},v.readAsText(m)}const h=document.getElementById("btn-clear-all-data");h&&h.addEventListener("click",()=>{confirm("Tüm izleme geçmişinizi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!")&&(_d(),Z("Tüm yerel veriler temizlendi.","info"),a())})}let Ci=null,ln=!1;function dr(){return window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===!0||document.referrer.includes("android-app://")}function Zd(){if(dr()){ln=!0,Gi(!1);return}window.addEventListener("beforeinstallprompt",t=>{t.preventDefault(),Ci=t,Gi(!0)}),window.addEventListener("appinstalled",()=>{Ci=null,ln=!0,Gi(!1),Z("CinePulse başarıyla cihazınıza yüklendi!","success")}),window.matchMedia("(display-mode: standalone)").addEventListener("change",t=>{t.matches&&(ln=!0,Gi(!1))}),/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream&&!dr()&&setTimeout(()=>{Gi(!0)},1e3)}function Gi(e){document.querySelectorAll(".btn-pwa-install").forEach(i=>{e&&!ln&&!dr()?i.classList.remove("hidden"):i.classList.add("hidden")})}async function Qd(){if(dr()||ln){Z("CinePulse zaten bir uygulama olarak yüklü.","info");return}if(Ci){try{Ci.prompt(),(await Ci.userChoice).outcome==="accepted"?Z("Yükleme başlatıldı...","success"):Z("Yükleme iptal edildi.","info"),Ci=null}catch{}return}/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream?eu():tu()}function eu(){let e=document.getElementById("pwa-ios-modal");e||(e=document.createElement("div"),e.id="pwa-ios-modal",e.className="modal-backdrop pwa-guide-modal",e.innerHTML=`
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
    `,document.body.appendChild(e),e.querySelector(".pwa-close-btn").addEventListener("click",()=>{e.classList.add("hidden")}),e.querySelector(".pwa-done-btn").addEventListener("click",()=>{e.classList.add("hidden")}),e.addEventListener("click",t=>{t.target===e&&e.classList.add("hidden")})),e.classList.remove("hidden")}function tu(){Z('Tarayıcınızın adres çubuğundaki "Yükle / Uygulamayı Yükle" simgesine tıklayarak indirebilirsiniz.',"info",5e3)}const iu="modulepreload",nu=function(e,t){return new URL(e,t).href},ro={},ps=function(t,i,n){let r=Promise.resolve();if(i&&i.length>0){const o=document.getElementsByTagName("link"),s=document.querySelector("meta[property=csp-nonce]"),l=s?.nonce||s?.getAttribute("nonce");r=Promise.allSettled(i.map(d=>{if(d=nu(d,n),d in ro)return;ro[d]=!0;const p=d.endsWith(".css"),h=p?'[rel="stylesheet"]':"";if(!!n)for(let y=o.length-1;y>=0;y--){const b=o[y];if(b.href===d&&(!p||b.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${h}`))return;const v=document.createElement("link");if(v.rel=p?"stylesheet":iu,p||(v.as="script"),v.crossOrigin="",v.href=d,l&&v.setAttribute("nonce",l),document.head.appendChild(v),p)return new Promise((y,b)=>{v.addEventListener("load",y),v.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${d}`)))})}))}function a(o){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=o,window.dispatchEvent(s),!s.defaultPrevented)throw o}return r.then(o=>{for(const s of o||[])s.status==="rejected"&&a(s.reason);return t().catch(a)})};var zi;(function(e){e.Unimplemented="UNIMPLEMENTED",e.Unavailable="UNAVAILABLE"})(zi||(zi={}));class oa extends Error{constructor(t,i,n){super(t),this.message=t,this.code=i,this.data=n}}const ru=e=>{var t,i;return e?.androidBridge?"android":!((i=(t=e?.webkit)===null||t===void 0?void 0:t.messageHandlers)===null||i===void 0)&&i.bridge?"ios":"web"},au=e=>{const t=e.CapacitorCustomPlatform||null,i=e.Capacitor||{},n=i.Plugins=i.Plugins||{},r=()=>t!==null?t.name:ru(e),a=()=>r()!=="web",o=h=>{const m=d.get(h);return!!(m?.platforms.has(r())||s(h))},s=h=>{var m;return(m=i.PluginHeaders)===null||m===void 0?void 0:m.find(v=>v.name===h)},l=h=>e.console.error(h),d=new Map,p=(h,m={})=>{const v=d.get(h);if(v)return v.proxy;const y=r(),b=s(h);let w;const f=async()=>(!w&&y in m?w=typeof m[y]=="function"?w=await m[y]():w=m[y]:t!==null&&!w&&"web"in m&&(w=typeof m.web=="function"?w=await m.web():w=m.web),w),k=($,N)=>{var O,G;if(b){const U=b?.methods.find(z=>N===z.name);if(U)return U.rtype==="promise"?z=>i.nativePromise(h,N.toString(),z):(z,D)=>i.nativeCallback(h,N.toString(),z,D);if($)return(O=$[N])===null||O===void 0?void 0:O.bind($)}else{if($)return(G=$[N])===null||G===void 0?void 0:G.bind($);throw new oa(`"${h}" plugin is not implemented on ${y}`,zi.Unimplemented)}},x=$=>{let N;const O=(...G)=>{const U=f().then(z=>{const D=k(z,$);if(D){const K=D(...G);return N=K?.remove,K}else throw new oa(`"${h}.${$}()" is not implemented on ${y}`,zi.Unimplemented)});return $==="addListener"&&(U.remove=async()=>N()),U};return O.toString=()=>`${$.toString()}() { [capacitor code] }`,Object.defineProperty(O,"name",{value:$,writable:!1,configurable:!1}),O},L=x("addListener"),S=x("removeListener"),A=($,N)=>{const O=L({eventName:$},N),G=async()=>{const z=await O;S({eventName:$,callbackId:z},N)},U=new Promise(z=>O.then(()=>z({remove:G})));return U.remove=async()=>{await G()},U},C=new Proxy({},{get($,N){switch(N){case"$$typeof":return;case"toJSON":return()=>({});case"addListener":return b?A:L;case"removeListener":return S;default:return x(N)}}});return n[h]=C,d.set(h,{name:h,proxy:C,platforms:new Set([...Object.keys(m),...b?[y]:[]])}),C};return i.convertFileSrc||(i.convertFileSrc=h=>h),i.getPlatform=r,i.handleError=l,i.isNativePlatform=a,i.isPluginAvailable=o,i.registerPlugin=p,i.Exception=oa,i.DEBUG=!!i.DEBUG,i.isLoggingEnabled=!!i.isLoggingEnabled,i},su=e=>e.Capacitor=au(e),Da=su(typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof globalThis<"u"?globalThis:{}),Rr=Da.registerPlugin;class fs{constructor(){this.listeners={},this.retainedEventArguments={},this.windowListeners={}}addListener(t,i){let n=!1;this.listeners[t]||(this.listeners[t]=[],n=!0),this.listeners[t].push(i);const a=this.windowListeners[t];a&&!a.registered&&this.addWindowListener(a),n&&this.sendRetainedArgumentsForEvent(t);const o=async()=>this.removeListener(t,i);return Promise.resolve({remove:o})}async removeAllListeners(){this.listeners={};for(const t in this.windowListeners)this.removeWindowListener(this.windowListeners[t]);this.windowListeners={}}notifyListeners(t,i,n){const r=this.listeners[t];if(!r){if(n){let a=this.retainedEventArguments[t];a||(a=[]),a.push(i),this.retainedEventArguments[t]=a}return}r.forEach(a=>a(i))}hasListeners(t){var i;return!!(!((i=this.listeners[t])===null||i===void 0)&&i.length)}registerWindowListener(t,i){this.windowListeners[i]={registered:!1,windowEventName:t,pluginEventName:i,handler:n=>{this.notifyListeners(i,n)}}}unimplemented(t="not implemented"){return new Da.Exception(t,zi.Unimplemented)}unavailable(t="not available"){return new Da.Exception(t,zi.Unavailable)}async removeListener(t,i){const n=this.listeners[t];if(!n)return;const r=n.indexOf(i);r!==-1&&this.listeners[t].splice(r,1),this.listeners[t].length||this.removeWindowListener(this.windowListeners[t])}addWindowListener(t){window.addEventListener(t.windowEventName,t.handler),t.registered=!0}removeWindowListener(t){t&&(window.removeEventListener(t.windowEventName,t.handler),t.registered=!1)}sendRetainedArgumentsForEvent(t){const i=this.retainedEventArguments[t];i&&(delete this.retainedEventArguments[t],i.forEach(n=>{this.notifyListeners(t,n)}))}}const ao=e=>encodeURIComponent(e).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),so=e=>e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent);class ou extends fs{async getCookies(){const t=document.cookie,i={};return t.split(";").forEach(n=>{if(n.length<=0)return;let[r,a]=n.replace(/=/,"CAP_COOKIE").split("CAP_COOKIE");r=so(r).trim(),a=so(a).trim(),i[r]=a}),i}async setCookie(t){try{const i=ao(t.key),n=ao(t.value),r=t.expires?`; expires=${t.expires.replace("expires=","")}`:"",a=(t.path||"/").replace("path=",""),o=t.url!=null&&t.url.length>0?`domain=${t.url}`:"";document.cookie=`${i}=${n||""}${r}; path=${a}; ${o};`}catch(i){return Promise.reject(i)}}async deleteCookie(t){try{document.cookie=`${t.key}=; Max-Age=0`}catch(i){return Promise.reject(i)}}async clearCookies(){try{const t=document.cookie.split(";")||[];for(const i of t)document.cookie=i.replace(/^ +/,"").replace(/=.*/,`=;expires=${new Date().toUTCString()};path=/`)}catch(t){return Promise.reject(t)}}async clearAllCookies(){try{await this.clearCookies()}catch(t){return Promise.reject(t)}}}Rr("CapacitorCookies",{web:()=>new ou});const lu=async e=>new Promise((t,i)=>{const n=new FileReader;n.onload=()=>{const r=n.result;t(r.indexOf(",")>=0?r.split(",")[1]:r)},n.onerror=r=>i(r),n.readAsDataURL(e)}),cu=(e={})=>{const t=Object.keys(e);return Object.keys(e).map(r=>r.toLocaleLowerCase()).reduce((r,a,o)=>(r[a]=e[t[o]],r),{})},du=(e,t=!0)=>e?Object.entries(e).reduce((n,r)=>{const[a,o]=r;let s,l;return Array.isArray(o)?(l="",o.forEach(d=>{s=t?encodeURIComponent(d):d,l+=`${a}=${s}&`}),l.slice(0,-1)):(s=t?encodeURIComponent(o):o,l=`${a}=${s}`),`${n}&${l}`},"").substr(1):null,uu=(e,t={})=>{const i=Object.assign({method:e.method||"GET",headers:e.headers},t),r=cu(e.headers)["content-type"]||"";if(typeof e.data=="string")i.body=e.data;else if(r.includes("application/x-www-form-urlencoded")){const a=new URLSearchParams;for(const[o,s]of Object.entries(e.data||{}))a.set(o,s);i.body=a.toString()}else if(r.includes("multipart/form-data")||e.data instanceof FormData){const a=new FormData;if(e.data instanceof FormData)e.data.forEach((s,l)=>{a.append(l,s)});else for(const s of Object.keys(e.data))a.append(s,e.data[s]);i.body=a;const o=new Headers(i.headers);o.delete("content-type"),i.headers=o}else(r.includes("application/json")||typeof e.data=="object")&&(i.body=JSON.stringify(e.data));return i};class pu extends fs{async request(t){const i=uu(t,t.webFetchExtra),n=du(t.params,t.shouldEncodeUrlParams),r=n?`${t.url}?${n}`:t.url,a=await fetch(r,i),o=a.headers.get("content-type")||"";let{responseType:s="text"}=a.ok?t:{};o.includes("application/json")&&(s="json");let l,d;switch(s){case"arraybuffer":case"blob":d=await a.blob(),l=await lu(d);break;case"json":l=await a.json();break;case"document":case"text":default:l=await a.text()}const p={};return a.headers.forEach((h,m)=>{p[m]=h}),{data:l,headers:p,status:a.status,url:a.url}}async get(t){return this.request(Object.assign(Object.assign({},t),{method:"GET"}))}async post(t){return this.request(Object.assign(Object.assign({},t),{method:"POST"}))}async put(t){return this.request(Object.assign(Object.assign({},t),{method:"PUT"}))}async patch(t){return this.request(Object.assign(Object.assign({},t),{method:"PATCH"}))}async delete(t){return this.request(Object.assign(Object.assign({},t),{method:"DELETE"}))}}Rr("CapacitorHttp",{web:()=>new pu});var oo;(function(e){e.Dark="DARK",e.Light="LIGHT",e.Default="DEFAULT"})(oo||(oo={}));var lo;(function(e){e.StatusBar="StatusBar",e.NavigationBar="NavigationBar"})(lo||(lo={}));class fu extends fs{async setStyle(){this.unavailable("not available for web")}async setAnimation(){this.unavailable("not available for web")}async show(){this.unavailable("not available for web")}async hide(){this.unavailable("not available for web")}}Rr("SystemBars",{web:()=>new fu});const za=Rr("App",{web:()=>ps(()=>import("./web-DX0iqB3n.js"),[],import.meta.url).then(e=>new e.AppWeb)}),co="1.1.33",hu="https://cine-pulse-drab.vercel.app/version.json";let Vi=null,di=0,uo=!1;const Il=6e4;function Oa(){return typeof window>"u"?!1:!!(window.Capacitor?.isNativePlatform?.()||window.Capacitor?.getPlatform?.()==="android"||navigator.userAgent.includes("CinePulseAndroid"))}function mu(e,t){if(!e||!t)return!1;const i=d=>String(d).replace(/^v/i,"").split(".").map(p=>parseInt(p,10)||0),[n,r,a]=i(e),[o,s,l]=i(t);return n>o||n===o&&r>s||n===o&&r===s&&a>l}function gu(e){if(document.getElementById("cinepulse-update-modal"))return;const t=e.downloadUrl||"https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk",i=e.githubDownloadUrl||"https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk",n=document.createElement("div");n.id="cinepulse-update-modal",n.className="cinepulse-modal-overlay",n.style.cssText=`
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
`).filter(Boolean).map(d=>`<li style="margin-bottom: 0.45rem;">${po(d.replace(/^[•\-\*]\s*/,""))}</li>`).join("");n.innerHTML=`
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
        ${po(e.title||`CinePulse v${e.version}`)}
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
  `,document.body.appendChild(n),J(n);const a=n.querySelector("#btn-update-later");a&&a.addEventListener("click",()=>{n.remove()});const o=d=>{if(Z("APK indirmesi başlatılıyor...","info"),Oa()){if(window.CinePulseNative?.downloadApk)try{window.CinePulseNative.downloadApk(d),Z("İndirme bildirimi açıldı. İndirme bitince bildirime dokunup Android kurulum ekranını aç.","success"),n.remove();return}catch{}try{window.open(d,"_system")||(window.location.href=d)}catch{window.location.href=d}}else window.location.assign(d);setTimeout(()=>{try{n.remove()}catch{}},2e3)},s=n.querySelector("#btn-update-download");s&&s.addEventListener("click",d=>{d.preventDefault(),o(t)});const l=n.querySelector("#btn-update-github");l&&l.addEventListener("click",d=>{Oa()&&(d.preventDefault(),o(i))})}function po(e=""){return String(e).replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t])}async function Ml({manual:e=!1}={}){return Vi||(!e&&Date.now()-di<Il?null:(Vi=yu({manual:e}).finally(()=>{Vi=null}),Vi))}async function yu({manual:e}){try{const t=await fetch(`${hu}?_t=${Date.now()}`,{signal:AbortSignal.timeout(6e3),cache:"no-store"});if(!t.ok)throw new Error(`HTTP ${t.status}`);const i=await t.json();if(!i?.version)throw new Error("Sürüm bilgisi eksik");if(di=Date.now(),i&&mu(i.version,co))return gu(i),i;if(e)return Z(`✓ CinePulse güncel (v${co})`,"success"),null}catch{return e&&Z("Güncelleme sunucusuna erişilemedi.","error"),null}}function vu(){if(typeof window>"u"||uo)return;uo=!0;let e=null,t=0;const i=[0,5e3,15e3,3e4],n=async()=>{if(di&&Date.now()-di<Il)return;const r=di;await Ml({manual:!1}),!di||di===r?t<i.length&&(e=window.setTimeout(n,i[t++])):t=i.length};e=window.setTimeout(n,2500);try{za.addListener("appStateChange",({isActive:r})=>{r&&(e&&window.clearTimeout(e),t=0,e=window.setTimeout(n,1200))})}catch{}document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&(e&&window.clearTimeout(e),t=0,e=window.setTimeout(n,1200))})}let Fn=null;function bu(){Ut();const e=document.createElement("div");e.id="profile-modal-root",e.className="profile-backdrop",document.body.appendChild(e),Fn=e;const t=(n="select")=>{const r=Zt(),a=wn();n==="select"?e.innerHTML=`
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
            ${r.map(b=>{const w=b.id===a.id,f=b.id!=="prof_1";return`
                <div class="profile-card-wrapper">
                  <div class="profile-card ${w?"is-active":""}" data-profile-id="${b.id}">
                    <div class="profile-avatar-wrap" style="border-color: ${b.color||"#f59e0b"}; background: ${b.color||"#f59e0b"}22;">
                      <i data-lucide="${b.avatar||"user"}" style="width: 44px; height: 44px; color: ${b.color||"#f59e0b"};"></i>
                      ${w?`
                        <div class="profile-active-check">
                          <i data-lucide="check" style="width: 14px; height: 14px;"></i>
                        </div>
                      `:""}
                    </div>
                    <span class="profile-name">${b.name}</span>
                    ${b.isKid?'<span class="profile-kid-badge">Çocuk</span>':""}
                  </div>
                  ${f?`
                    <button class="btn-delete-profile" data-delete-id="${b.id}" title="Profili Sil">
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
            ${Oa()?`
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
                ${["#f59e0b","#38bdf8","#ec4899","#10b981","#a855f7","#ef4444"].map((b,w)=>`
                  <button type="button" class="color-dot ${w===0?"active":""}" data-color="${b}" style="background: ${b};"></button>
                `).join("")}
              </div>
            </div>

            <div class="profile-form-actions">
              <button type="button" class="btn-secondary" id="btn-back-to-profiles">İptal</button>
              <button type="submit" class="btn-primary">Kaydet & Oluştur</button>
            </div>
          </form>
        </div>
      `),J(e);const o=e.querySelector("#btn-close-profile-modal");o&&(o.onclick=()=>Ut());const s=e.querySelector("#btn-show-add-profile");s&&(s.onclick=()=>t("add")),e.querySelectorAll(".btn-delete-profile").forEach(b=>{b.onclick=w=>{w.stopPropagation();const f=b.getAttribute("data-delete-id"),k=Zt().find(L=>L.id===f);if(!k||!confirm(`"${k.name}" profilini silmek istediğinize emin misiniz?`))return;rd(f)?(Z(`"${k.name}" profili silindi.`,"info"),t("select")):Z("Bu profil silinemez.","error")}});const l=e.querySelector("#btn-modal-open-trakt");l&&(l.onclick=()=>{Ut(),cr()});const d=e.querySelector("#btn-modal-open-backup");d&&(d.onclick=()=>{Ut(),Rl()});const p=e.querySelector("#btn-modal-pwa-install");p&&(p.onclick=()=>{Qd()});const h=e.querySelector("#btn-modal-check-update");h&&(h.onclick=()=>{Ml({manual:!0})}),e.querySelectorAll(".profile-card[data-profile-id]").forEach(b=>{b.onclick=()=>{const w=b.getAttribute("data-profile-id");if(w){const f=Zt().find(k=>k.id===w);Qn(w),Ut(),fo(f)}}});const m=e.querySelector("#btn-cancel-add-profile");m&&(m.onclick=()=>t("select"));const v=e.querySelector("#btn-back-to-profiles");v&&(v.onclick=()=>t("select"));const y=e.querySelector("#form-add-profile");if(y){let b="#f59e0b";y.querySelectorAll(".color-dot").forEach(w=>{w.onclick=()=>{y.querySelectorAll(".color-dot").forEach(f=>f.classList.remove("active")),w.classList.add("active"),b=w.getAttribute("data-color")}}),y.onsubmit=w=>{w.preventDefault();const f=y.querySelector("#new-profile-name"),k=y.querySelector("#new-profile-kid-check"),x=f?f.value.trim():"",L=k?k.checked:!1;if(x){const S=nd({name:x,isKid:L,avatar:L?"smile":"user",color:b});Qn(S.id),Ut(),fo(S)}}}};t("select"),e.onclick=n=>{n.target===e&&Ut()};const i=n=>{n.key==="Escape"&&(Ut(),window.removeEventListener("keydown",i))};window.addEventListener("keydown",i)}function Ut(){if(Fn){try{Fn.remove()}catch{}Fn=null}}function fo(e){const t=document.getElementById("profile-switch-curtain");t&&t.remove();const i=document.createElement("div");i.id="profile-switch-curtain",i.className="profile-switch-curtain is-entering",i.innerHTML=`
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
  `,document.body.appendChild(i),J(i),window.dispatchEvent(new CustomEvent("sineflix_profile_changed",{detail:{profile:e}})),setTimeout(()=>{i.classList.remove("is-entering"),i.classList.add("is-leaving"),setTimeout(()=>{i.remove()},450)},600)}async function ti(e){return(await ps(()=>import("./PlayerModal-DuX3K7Od.js"),__vite__mapDeps([0,1]),import.meta.url)).openPlayerModal(e)}let $i=null,Na=null;const Ji=e=>String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),ho=[{label:"🎲 Karışık / Farketmez",id:null},{label:"💥 Aksiyon",movie:28,tv:10759},{label:"🚀 Bilim Kurgu & Fantastik",movie:878,tv:10765},{label:"😂 Komedi",movie:35,tv:35},{label:"🩸 Korku & Gerilim",movie:27,tv:9648},{label:"🎭 Dram",movie:18,tv:18},{label:"🕵️ Suç & Gizem",movie:80,tv:9648},{label:"🎌 Animasyon & Anime",movie:16,tv:16},{label:"💖 Romantik",movie:10749,tv:10749},{label:"🌍 Belgesel",movie:99,tv:99}];function mo({type:e="all"}={}){ki();const t=document.createElement("div");t.id="random-picker-modal-root",t.className="random-picker-backdrop",document.body.appendChild(t),$i=t;let i=e==="tv"?"tv":"all",n=0,r=7;t.innerHTML=`
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
            ${ho.map((v,y)=>`
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
  `,J(t);const a=t.querySelector("#btn-close-random-picker");a&&(a.onclick=()=>ki()),t.onclick=v=>{v.target===t&&ki()};const o=v=>{v.key==="Escape"&&ki()};window.addEventListener("keydown",o),Na=()=>window.removeEventListener("keydown",o);const s=t.querySelectorAll("#random-type-pills .random-pill-btn");s.forEach(v=>{v.onclick=()=>{s.forEach(y=>y.classList.remove("active")),v.classList.add("active"),i=v.getAttribute("data-type")}});const l=t.querySelectorAll("#random-rating-pills .random-pill-btn");l.forEach(v=>{v.onclick=()=>{l.forEach(y=>y.classList.remove("active")),v.classList.add("active"),r=parseFloat(v.getAttribute("data-rating")||"0")}});const d=t.querySelectorAll("#random-genre-pills .random-pill-btn");d.forEach(v=>{v.onclick=()=>{d.forEach(y=>y.classList.remove("active")),v.classList.add("active"),n=parseInt(v.getAttribute("data-genre-idx"),10)}});const p=t.querySelector("#btn-spin-wheel"),h=t.querySelector("#random-spin-stage"),m=async()=>{p&&(p.disabled=!0,p.classList.add("is-spinning")),h.innerHTML=`
      <div class="random-roulette-box">
        <div class="roulette-glow-ring"></div>
        <div class="roulette-roller" id="roulette-roller">
          <div class="roulette-reel-text">Adaylar Karıştırılıyor... 🎲</div>
        </div>
      </div>
    `;let v=i;v==="all"&&(v=Math.random()>.5?"movie":"tv");let y=null;const b=ho[n];b&&(y=v==="movie"?b.movie:b.tv);const w=Math.floor(Math.random()*3)+1;let f;try{f=await xl({type:v,genreId:y,minRating:r,page:w,sortBy:"popularity.desc"})}catch{f=[]}if($i!==t)return;const k=(f||[]).filter(ne=>ne&&(ne.title||ne.name)&&(ne.poster_path||ne.backdrop_path));if(!k||k.length===0){h.innerHTML=`
        <div class="random-idle-placeholder">
          <i data-lucide="frown" style="width: 40px; height: 40px; color: #ef4444;"></i>
          <span>Bu kriterlere uygun yapım bulunamadı. Lütfen filtreleri gevşetip tekrar deneyin.</span>
        </div>
      `,J(h),p&&(p.disabled=!1,p.classList.remove("is-spinning"));return}const x=h.querySelector("#roulette-roller"),L=8;for(let ne=0;ne<L;ne++){const Q=k[Math.floor(Math.random()*k.length)],re=Q.title||Q.name||"Öneri Aranıyor";if(x&&(x.innerHTML=`<div class="roulette-reel-text animate-pulse">${Ji(re)}</div>`),await new Promise(H=>setTimeout(H,120+ne*25)),$i!==t)return}const S=k[Math.floor(Math.random()*k.length)],A=S.title||S.name||"Seçilen Yapım",C=S.original_title||S.original_name||A,$=it(S.poster_path,Ke.POSTER_MEDIUM),N=S.vote_average?Number(S.vote_average).toFixed(1):"—",O=(S.release_date||S.first_air_date||"").substring(0,4),G=S.overview&&S.overview.trim().length>10?S.overview:"Harika bir izleme deneyimi sunan sürpriz bir öneri!",U=v==="movie"?"movie":"tv";h.innerHTML=`
      <div class="random-winner-card">
        <div class="winner-poster-wrap">
          <img src="${$}" alt="${Ji(A)}" class="winner-poster" />
          <div class="winner-rating-pill">⭐ ${N}</div>
        </div>
        <div class="winner-details-wrap">
          <div class="winner-badge-row">
            <span class="winner-tag-type">${U==="movie"?"FİLM":"DİZİ"}</span>
            ${O?`<span class="winner-tag-year">${Ji(O)}</span>`:""}
            <span class="winner-tag-match">Popüler öneri</span>
          </div>
          <h3 class="winner-title">${Ji(A)}</h3>
          <p class="winner-overview">${Ji(G)}</p>
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
    `,J(h);const z=h.querySelector("#btn-winner-play");z&&(z.onclick=()=>{ki(),ti({type:U,tmdbId:S.id,title:A,originalTitle:C,posterPath:S.poster_path,backdropPath:S.backdrop_path,season:1,episode:1})});const D=h.querySelector("#btn-winner-detail");D&&(D.onclick=()=>{ki(),window.location.hash=`#detail?type=${U}&id=${S.id}`});const K=h.querySelector("#btn-winner-retry");K&&(K.onclick=()=>{m()}),p&&(p.disabled=!1,p.classList.remove("is-spinning"),p.innerHTML='<i data-lucide="refresh-cw" style="width: 17px; height: 17px;"></i> <span>Başka Bir Tane Öner</span>',J(p))};p&&(p.onclick=()=>m()),m()}function ki(){if(Na?.(),Na=null,$i){try{$i.remove()}catch{}$i=null}}let Un=null;const la=[{id:"notif_1",title:"Yeni Bölüm Yayında! ⚔️",message:"Kuruluş Osman 6. Sezon 1. Bölüm Full HD olarak platforma eklendi.",time:"12 dk önce",isUnread:!0,type:"tv",tmdbId:"95557",badge:"YENİ BÖLÜM"},{id:"notif_2",title:"Özel Sinema Gösterimi 🍿",message:"Dune: Çöl Gezegeni Bölüm İki - 4K Ultra HD Türkçe Dublaj & Altyazılı yayında!",time:"2 saat önce",isUnread:!0,type:"movie",tmdbId:"693134",badge:"4K VİZYON"},{id:"notif_3",title:"Yeni Anime Bölümü ⚡",message:"Demon Slayer: Hashira Training Arc - Türkçe Altyazılı yeni bölüm izlenmeye hazır.",time:"Dün",isUnread:!1,type:"tv",tmdbId:"85937",badge:"ANİME"},{id:"notif_4",title:"Canlı TV Güncellemesi 📺",message:"Elektronik Program Rehberi (EPG), PiP Mini-Player ve HLS Kalite Menüsü aktif edildi.",time:"2 gün önce",isUnread:!1,type:"livetv",badge:"GÜNCELLEME"}];function Pl(){try{if(typeof window>"u"||!window.localStorage)return la;const e=localStorage.getItem("sineflix_notifications_v1");return e?JSON.parse(e):la}catch{return la}}function go(e){try{if(typeof window>"u"||!window.localStorage)return;localStorage.setItem("sineflix_notifications_v1",JSON.stringify(e)),window.dispatchEvent(new CustomEvent("sineflix_notifications_updated"))}catch{}}function Bl(){return Pl().filter(t=>t.isUnread).length}function wu(){Rn();const e=document.createElement("div");e.id="notification-modal-root",e.className="notif-backdrop",document.body.appendChild(e),Un=e;const t=Pl();e.innerHTML=`
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
  `,J(e);const i=e.querySelector("#btn-close-notif");i&&(i.onclick=()=>Rn()),e.onclick=r=>{r.target===e&&Rn()};const n=e.querySelector("#btn-mark-all-read");n&&(n.onclick=()=>{const r=t.map(a=>({...a,isUnread:!1}));go(r),e.querySelectorAll(".notif-item.unread").forEach(a=>a.classList.remove("unread")),Z("Tüm bildirimler okundu olarak işaretlendi","info"),yo()}),e.querySelectorAll(".notif-item").forEach(r=>{r.onclick=()=>{const a=r.getAttribute("data-notif-id"),o=r.getAttribute("data-type"),s=r.getAttribute("data-tmdb-id"),l=t.map(d=>d.id===a?{...d,isUnread:!1}:d);go(l),r.classList.remove("unread"),yo(),Rn(),o==="livetv"?window.location.hash="#livetv":s&&(window.location.hash=`#detail?type=${o}&id=${s}`)}})}function Rn(){if(Un){try{Un.remove()}catch{}Un=null}}function yo(){const e=document.getElementById("nav-notif-badge");if(!e)return;const t=Bl();t>0?(e.textContent=t,e.classList.remove("hidden")):e.classList.add("hidden")}function Dl(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function ku(e){if(e.__esModule)return e;var t=e.default;if(typeof t=="function"){var i=function n(){return this instanceof n?Reflect.construct(t,arguments,this.constructor):t.apply(this,arguments)};i.prototype=t.prototype}else i={};return Object.defineProperty(i,"__esModule",{value:!0}),Object.keys(e).forEach(function(n){var r=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(i,n,r.get?r:{enumerable:!0,get:function(){return e[n]}})}),i}var Ha={exports:{}},ca,vo;function _u(){if(vo)return ca;vo=1;var e=1e3,t=e*60,i=t*60,n=i*24,r=n*7,a=n*365.25;ca=function(p,h){h=h||{};var m=typeof p;if(m==="string"&&p.length>0)return o(p);if(m==="number"&&isFinite(p))return h.long?l(p):s(p);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(p))};function o(p){if(p=String(p),!(p.length>100)){var h=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(p);if(h){var m=parseFloat(h[1]),v=(h[2]||"ms").toLowerCase();switch(v){case"years":case"year":case"yrs":case"yr":case"y":return m*a;case"weeks":case"week":case"w":return m*r;case"days":case"day":case"d":return m*n;case"hours":case"hour":case"hrs":case"hr":case"h":return m*i;case"minutes":case"minute":case"mins":case"min":case"m":return m*t;case"seconds":case"second":case"secs":case"sec":case"s":return m*e;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return m;default:return}}}}function s(p){var h=Math.abs(p);return h>=n?Math.round(p/n)+"d":h>=i?Math.round(p/i)+"h":h>=t?Math.round(p/t)+"m":h>=e?Math.round(p/e)+"s":p+"ms"}function l(p){var h=Math.abs(p);return h>=n?d(p,h,n,"day"):h>=i?d(p,h,i,"hour"):h>=t?d(p,h,t,"minute"):h>=e?d(p,h,e,"second"):p+" ms"}function d(p,h,m,v){var y=h>=m*1.5;return Math.round(p/m)+" "+v+(y?"s":"")}return ca}function Su(e){i.debug=i,i.default=i,i.coerce=l,i.disable=o,i.enable=r,i.enabled=s,i.humanize=_u(),i.destroy=d,Object.keys(e).forEach(p=>{i[p]=e[p]}),i.names=[],i.skips=[],i.formatters={};function t(p){let h=0;for(let m=0;m<p.length;m++)h=(h<<5)-h+p.charCodeAt(m),h|=0;return i.colors[Math.abs(h)%i.colors.length]}i.selectColor=t;function i(p){let h,m=null,v,y;function b(...w){if(!b.enabled)return;const f=b,k=Number(new Date),x=k-(h||k);f.diff=x,f.prev=h,f.curr=k,h=k,w[0]=i.coerce(w[0]),typeof w[0]!="string"&&w.unshift("%O");let L=0;w[0]=w[0].replace(/%([a-zA-Z%])/g,(A,C)=>{if(A==="%%")return"%";L++;const $=i.formatters[C];if(typeof $=="function"){const N=w[L];A=$.call(f,N),w.splice(L,1),L--}return A}),i.formatArgs.call(f,w),(f.log||i.log).apply(f,w)}return b.namespace=p,b.useColors=i.useColors(),b.color=i.selectColor(p),b.extend=n,b.destroy=i.destroy,Object.defineProperty(b,"enabled",{enumerable:!0,configurable:!1,get:()=>m!==null?m:(v!==i.namespaces&&(v=i.namespaces,y=i.enabled(p)),y),set:w=>{m=w}}),typeof i.init=="function"&&i.init(b),b}function n(p,h){const m=i(this.namespace+(typeof h>"u"?":":h)+p);return m.log=this.log,m}function r(p){i.save(p),i.namespaces=p,i.names=[],i.skips=[];const h=(typeof p=="string"?p:"").trim().replace(/\s+/g,",").split(",").filter(Boolean);for(const m of h)m[0]==="-"?i.skips.push(m.slice(1)):i.names.push(m)}function a(p,h){let m=0,v=0,y=-1,b=0;for(;m<p.length;)if(v<h.length&&(h[v]===p[m]||h[v]==="*"))h[v]==="*"?(y=v,b=m,v++):(m++,v++);else if(y!==-1)v=y+1,b++,m=b;else return!1;for(;v<h.length&&h[v]==="*";)v++;return v===h.length}function o(){const p=[...i.names,...i.skips.map(h=>"-"+h)].join(",");return i.enable(""),p}function s(p){for(const h of i.skips)if(a(p,h))return!1;for(const h of i.names)if(a(p,h))return!0;return!1}function l(p){return p instanceof Error?p.stack||p.message:p}function d(){}return i.enable(i.load()),i}var Eu=Su;(function(e,t){var i={};t.formatArgs=r,t.save=a,t.load=o,t.useColors=n,t.storage=s(),t.destroy=(()=>{let d=!1;return()=>{d||(d=!0)}})(),t.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"];function n(){if(typeof window<"u"&&window.process&&(window.process.type==="renderer"||window.process.__nwjs))return!0;if(typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;let d;return typeof document<"u"&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent&&(d=navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/))&&parseInt(d[1],10)>=31||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)}function r(d){if(d[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+d[0]+(this.useColors?"%c ":" ")+"+"+e.exports.humanize(this.diff),!this.useColors)return;const p="color: "+this.color;d.splice(1,0,p,"color: inherit");let h=0,m=0;d[0].replace(/%[a-zA-Z%]/g,v=>{v!=="%%"&&(h++,v==="%c"&&(m=h))}),d.splice(m,0,p)}t.log=console.debug||console.log||(()=>{});function a(d){try{d?t.storage.setItem("debug",d):t.storage.removeItem("debug")}catch{}}function o(){let d;try{d=t.storage.getItem("debug")||t.storage.getItem("DEBUG")}catch{}return!d&&typeof process<"u"&&"env"in process&&(d=i.DEBUG),d}function s(){try{return localStorage}catch{}}e.exports=Eu(t);const{formatters:l}=e.exports;l.j=function(d){try{return JSON.stringify(d)}catch(p){return"[UnexpectedJSONParseError]: "+p.message}}})(Ha,Ha.exports);var Ir=Ha.exports,hs={exports:{}},Ri=typeof Reflect=="object"?Reflect:null,bo=Ri&&typeof Ri.apply=="function"?Ri.apply:function(t,i,n){return Function.prototype.apply.call(t,i,n)},jn;Ri&&typeof Ri.ownKeys=="function"?jn=Ri.ownKeys:Object.getOwnPropertySymbols?jn=function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:jn=function(t){return Object.getOwnPropertyNames(t)};var zl=Number.isNaN||function(t){return t!==t};function Te(){Te.init.call(this)}hs.exports=Te;hs.exports.once=Cu;Te.EventEmitter=Te;Te.prototype._events=void 0;Te.prototype._eventsCount=0;Te.prototype._maxListeners=void 0;var wo=10;function Mr(e){if(typeof e!="function")throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e)}Object.defineProperty(Te,"defaultMaxListeners",{enumerable:!0,get:function(){return wo},set:function(e){if(typeof e!="number"||e<0||zl(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");wo=e}});Te.init=function(){(this._events===void 0||this._events===Object.getPrototypeOf(this)._events)&&(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0};Te.prototype.setMaxListeners=function(t){if(typeof t!="number"||t<0||zl(t))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+t+".");return this._maxListeners=t,this};function Ol(e){return e._maxListeners===void 0?Te.defaultMaxListeners:e._maxListeners}Te.prototype.getMaxListeners=function(){return Ol(this)};Te.prototype.emit=function(t){for(var i=[],n=1;n<arguments.length;n++)i.push(arguments[n]);var r=t==="error",a=this._events;if(a!==void 0)r=r&&a.error===void 0;else if(!r)return!1;if(r){var o;if(i.length>0&&(o=i[0]),o instanceof Error)throw o;var s=new Error("Unhandled error."+(o?" ("+o.message+")":""));throw s.context=o,s}var l=a[t];if(l===void 0)return!1;if(typeof l=="function")bo(l,this,i);else for(var d=l.length,p=Ul(l,d),n=0;n<d;++n)bo(p[n],this,i);return!0};function Nl(e,t,i,n){var r,a,o;if(Mr(i),a=e._events,a===void 0?(a=e._events=Object.create(null),e._eventsCount=0):(a.newListener!==void 0&&(e.emit("newListener",t,i.listener?i.listener:i),a=e._events),o=a[t]),o===void 0)o=a[t]=i,++e._eventsCount;else if(typeof o=="function"?o=a[t]=n?[i,o]:[o,i]:n?o.unshift(i):o.push(i),r=Ol(e),r>0&&o.length>r&&!o.warned){o.warned=!0;var s=new Error("Possible EventEmitter memory leak detected. "+o.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");s.name="MaxListenersExceededWarning",s.emitter=e,s.type=t,s.count=o.length}return e}Te.prototype.addListener=function(t,i){return Nl(this,t,i,!1)};Te.prototype.on=Te.prototype.addListener;Te.prototype.prependListener=function(t,i){return Nl(this,t,i,!0)};function xu(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length===0?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function Hl(e,t,i){var n={fired:!1,wrapFn:void 0,target:e,type:t,listener:i},r=xu.bind(n);return r.listener=i,n.wrapFn=r,r}Te.prototype.once=function(t,i){return Mr(i),this.on(t,Hl(this,t,i)),this};Te.prototype.prependOnceListener=function(t,i){return Mr(i),this.prependListener(t,Hl(this,t,i)),this};Te.prototype.removeListener=function(t,i){var n,r,a,o,s;if(Mr(i),r=this._events,r===void 0)return this;if(n=r[t],n===void 0)return this;if(n===i||n.listener===i)--this._eventsCount===0?this._events=Object.create(null):(delete r[t],r.removeListener&&this.emit("removeListener",t,n.listener||i));else if(typeof n!="function"){for(a=-1,o=n.length-1;o>=0;o--)if(n[o]===i||n[o].listener===i){s=n[o].listener,a=o;break}if(a<0)return this;a===0?n.shift():Tu(n,a),n.length===1&&(r[t]=n[0]),r.removeListener!==void 0&&this.emit("removeListener",t,s||i)}return this};Te.prototype.off=Te.prototype.removeListener;Te.prototype.removeAllListeners=function(t){var i,n,r;if(n=this._events,n===void 0)return this;if(n.removeListener===void 0)return arguments.length===0?(this._events=Object.create(null),this._eventsCount=0):n[t]!==void 0&&(--this._eventsCount===0?this._events=Object.create(null):delete n[t]),this;if(arguments.length===0){var a=Object.keys(n),o;for(r=0;r<a.length;++r)o=a[r],o!=="removeListener"&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if(i=n[t],typeof i=="function")this.removeListener(t,i);else if(i!==void 0)for(r=i.length-1;r>=0;r--)this.removeListener(t,i[r]);return this};function ql(e,t,i){var n=e._events;if(n===void 0)return[];var r=n[t];return r===void 0?[]:typeof r=="function"?i?[r.listener||r]:[r]:i?Au(r):Ul(r,r.length)}Te.prototype.listeners=function(t){return ql(this,t,!0)};Te.prototype.rawListeners=function(t){return ql(this,t,!1)};Te.listenerCount=function(e,t){return typeof e.listenerCount=="function"?e.listenerCount(t):Fl.call(e,t)};Te.prototype.listenerCount=Fl;function Fl(e){var t=this._events;if(t!==void 0){var i=t[e];if(typeof i=="function")return 1;if(i!==void 0)return i.length}return 0}Te.prototype.eventNames=function(){return this._eventsCount>0?jn(this._events):[]};function Ul(e,t){for(var i=new Array(t),n=0;n<t;++n)i[n]=e[n];return i}function Tu(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}function Au(e){for(var t=new Array(e.length),i=0;i<t.length;++i)t[i]=e[i].listener||e[i];return t}function Cu(e,t){return new Promise(function(i,n){function r(o){e.removeListener(t,a),n(o)}function a(){typeof e.removeListener=="function"&&e.removeListener("error",r),i([].slice.call(arguments))}jl(e,t,a,{once:!0}),t!=="error"&&Lu(e,r,{once:!0})})}function Lu(e,t,i){typeof e.on=="function"&&jl(e,"error",t,i)}function jl(e,t,i,n){if(typeof e.on=="function")n.once?e.once(t,i):e.on(t,i);else if(typeof e.addEventListener=="function")e.addEventListener(t,function r(a){n.once&&e.removeEventListener(t,r),i(a)});else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof e)}var Pr=hs.exports,ms={exports:{}},$u=Kl;function Kl(e,t){if(e&&t)return Kl(e)(t);if(typeof e!="function")throw new TypeError("need wrapper function");return Object.keys(e).forEach(function(n){i[n]=e[n]}),i;function i(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];var a=e.apply(this,n),o=n[n.length-1];return typeof a=="function"&&a!==o&&Object.keys(o).forEach(function(s){a[s]=o[s]}),a}}var Wl=$u;ms.exports=Wl(Kn);ms.exports.strict=Wl(Yl);Kn.proto=Kn(function(){Object.defineProperty(Function.prototype,"once",{value:function(){return Kn(this)},configurable:!0}),Object.defineProperty(Function.prototype,"onceStrict",{value:function(){return Yl(this)},configurable:!0})});function Kn(e){var t=function(){return t.called?t.value:(t.called=!0,t.value=e.apply(this,arguments))};return t.called=!1,t}function Yl(e){var t=function(){if(t.called)throw new Error(t.onceError);return t.called=!0,t.value=e.apply(this,arguments)},i=e.name||"Function wrapped with `once`";return t.onceError=i+" shouldn't be called more than once",t.called=!1,t}var Ru=ms.exports;let ko;var Br=typeof queueMicrotask=="function"?queueMicrotask.bind(typeof window<"u"?window:globalThis):e=>(ko||(ko=Promise.resolve())).then(e).catch(t=>setTimeout(()=>{throw t},0));var Iu=Pu;const Mu=Br;function Pu(e,t){let i,n,r,a=!0;Array.isArray(e)?(i=[],n=e.length):(r=Object.keys(e),i={},n=r.length);function o(l){function d(){t&&t(l,i),t=null}a?Mu(d):d()}function s(l,d,p){i[l]=p,(--n===0||d)&&o(d)}n?r?r.forEach(function(l){e[l](function(d,p){s(l,d,p)})}):e.forEach(function(l,d){l(function(p,h){s(d,p,h)})}):o(null),a=!1}var Bu=function(){if(typeof globalThis>"u")return null;var t={RTCPeerConnection:globalThis.RTCPeerConnection||globalThis.mozRTCPeerConnection||globalThis.webkitRTCPeerConnection,RTCSessionDescription:globalThis.RTCSessionDescription||globalThis.mozRTCSessionDescription||globalThis.webkitRTCSessionDescription,RTCIceCandidate:globalThis.RTCIceCandidate||globalThis.mozRTCIceCandidate||globalThis.webkitRTCIceCandidate};return t.RTCPeerConnection?t:null},qa={exports:{}},Fa={exports:{}},vi={},Dr={};Dr.byteLength=Ou;Dr.toByteArray=Hu;Dr.fromByteArray=Uu;var Ct=[],dt=[],Du=typeof Uint8Array<"u"?Uint8Array:Array,da="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(var _i=0,zu=da.length;_i<zu;++_i)Ct[_i]=da[_i],dt[da.charCodeAt(_i)]=_i;dt[45]=62;dt[95]=63;function Gl(e){var t=e.length;if(t%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var i=e.indexOf("=");i===-1&&(i=t);var n=i===t?0:4-i%4;return[i,n]}function Ou(e){var t=Gl(e),i=t[0],n=t[1];return(i+n)*3/4-n}function Nu(e,t,i){return(t+i)*3/4-i}function Hu(e){var t,i=Gl(e),n=i[0],r=i[1],a=new Du(Nu(e,n,r)),o=0,s=r>0?n-4:n,l;for(l=0;l<s;l+=4)t=dt[e.charCodeAt(l)]<<18|dt[e.charCodeAt(l+1)]<<12|dt[e.charCodeAt(l+2)]<<6|dt[e.charCodeAt(l+3)],a[o++]=t>>16&255,a[o++]=t>>8&255,a[o++]=t&255;return r===2&&(t=dt[e.charCodeAt(l)]<<2|dt[e.charCodeAt(l+1)]>>4,a[o++]=t&255),r===1&&(t=dt[e.charCodeAt(l)]<<10|dt[e.charCodeAt(l+1)]<<4|dt[e.charCodeAt(l+2)]>>2,a[o++]=t>>8&255,a[o++]=t&255),a}function qu(e){return Ct[e>>18&63]+Ct[e>>12&63]+Ct[e>>6&63]+Ct[e&63]}function Fu(e,t,i){for(var n,r=[],a=t;a<i;a+=3)n=(e[a]<<16&16711680)+(e[a+1]<<8&65280)+(e[a+2]&255),r.push(qu(n));return r.join("")}function Uu(e){for(var t,i=e.length,n=i%3,r=[],a=16383,o=0,s=i-n;o<s;o+=a)r.push(Fu(e,o,o+a>s?s:o+a));return n===1?(t=e[i-1],r.push(Ct[t>>2]+Ct[t<<4&63]+"==")):n===2&&(t=(e[i-2]<<8)+e[i-1],r.push(Ct[t>>10]+Ct[t>>4&63]+Ct[t<<2&63]+"=")),r.join("")}var gs={};gs.read=function(e,t,i,n,r){var a,o,s=r*8-n-1,l=(1<<s)-1,d=l>>1,p=-7,h=i?r-1:0,m=i?-1:1,v=e[t+h];for(h+=m,a=v&(1<<-p)-1,v>>=-p,p+=s;p>0;a=a*256+e[t+h],h+=m,p-=8);for(o=a&(1<<-p)-1,a>>=-p,p+=n;p>0;o=o*256+e[t+h],h+=m,p-=8);if(a===0)a=1-d;else{if(a===l)return o?NaN:(v?-1:1)*(1/0);o=o+Math.pow(2,n),a=a-d}return(v?-1:1)*o*Math.pow(2,a-n)};gs.write=function(e,t,i,n,r,a){var o,s,l,d=a*8-r-1,p=(1<<d)-1,h=p>>1,m=r===23?Math.pow(2,-24)-Math.pow(2,-77):0,v=n?0:a-1,y=n?1:-1,b=t<0||t===0&&1/t<0?1:0;for(t=Math.abs(t),isNaN(t)||t===1/0?(s=isNaN(t)?1:0,o=p):(o=Math.floor(Math.log(t)/Math.LN2),t*(l=Math.pow(2,-o))<1&&(o--,l*=2),o+h>=1?t+=m/l:t+=m*Math.pow(2,1-h),t*l>=2&&(o++,l/=2),o+h>=p?(s=0,o=p):o+h>=1?(s=(t*l-1)*Math.pow(2,r),o=o+h):(s=t*Math.pow(2,h-1)*Math.pow(2,r),o=0));r>=8;e[i+v]=s&255,v+=y,s/=256,r-=8);for(o=o<<r|s,d+=r;d>0;e[i+v]=o&255,v+=y,o/=256,d-=8);e[i+v-y]|=b*128};(function(e){const t=Dr,i=gs,n=typeof Symbol=="function"&&typeof Symbol.for=="function"?Symbol.for("nodejs.util.inspect.custom"):null;e.Buffer=s,e.SlowBuffer=k,e.INSPECT_MAX_BYTES=50;const r=2147483647;e.kMaxLength=r,s.TYPED_ARRAY_SUPPORT=a(),!s.TYPED_ARRAY_SUPPORT&&typeof console<"u";function a(){try{const g=new Uint8Array(1),c={foo:function(){return 42}};return Object.setPrototypeOf(c,Uint8Array.prototype),Object.setPrototypeOf(g,c),g.foo()===42}catch{return!1}}Object.defineProperty(s.prototype,"parent",{enumerable:!0,get:function(){if(s.isBuffer(this))return this.buffer}}),Object.defineProperty(s.prototype,"offset",{enumerable:!0,get:function(){if(s.isBuffer(this))return this.byteOffset}});function o(g){if(g>r)throw new RangeError('The value "'+g+'" is invalid for option "size"');const c=new Uint8Array(g);return Object.setPrototypeOf(c,s.prototype),c}function s(g,c,u){if(typeof g=="number"){if(typeof c=="string")throw new TypeError('The "string" argument must be of type string. Received type number');return h(g)}return l(g,c,u)}s.poolSize=8192;function l(g,c,u){if(typeof g=="string")return m(g,c);if(ArrayBuffer.isView(g))return y(g);if(g==null)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof g);if(Ae(g,ArrayBuffer)||g&&Ae(g.buffer,ArrayBuffer)||typeof SharedArrayBuffer<"u"&&(Ae(g,SharedArrayBuffer)||g&&Ae(g.buffer,SharedArrayBuffer)))return b(g,c,u);if(typeof g=="number")throw new TypeError('The "value" argument must not be of type number. Received type number');const _=g.valueOf&&g.valueOf();if(_!=null&&_!==g)return s.from(_,c,u);const R=w(g);if(R)return R;if(typeof Symbol<"u"&&Symbol.toPrimitive!=null&&typeof g[Symbol.toPrimitive]=="function")return s.from(g[Symbol.toPrimitive]("string"),c,u);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof g)}s.from=function(g,c,u){return l(g,c,u)},Object.setPrototypeOf(s.prototype,Uint8Array.prototype),Object.setPrototypeOf(s,Uint8Array);function d(g){if(typeof g!="number")throw new TypeError('"size" argument must be of type number');if(g<0)throw new RangeError('The value "'+g+'" is invalid for option "size"')}function p(g,c,u){return d(g),g<=0?o(g):c!==void 0?typeof u=="string"?o(g).fill(c,u):o(g).fill(c):o(g)}s.alloc=function(g,c,u){return p(g,c,u)};function h(g){return d(g),o(g<0?0:f(g)|0)}s.allocUnsafe=function(g){return h(g)},s.allocUnsafeSlow=function(g){return h(g)};function m(g,c){if((typeof c!="string"||c==="")&&(c="utf8"),!s.isEncoding(c))throw new TypeError("Unknown encoding: "+c);const u=x(g,c)|0;let _=o(u);const R=_.write(g,c);return R!==u&&(_=_.slice(0,R)),_}function v(g){const c=g.length<0?0:f(g.length)|0,u=o(c);for(let _=0;_<c;_+=1)u[_]=g[_]&255;return u}function y(g){if(Ae(g,Uint8Array)){const c=new Uint8Array(g);return b(c.buffer,c.byteOffset,c.byteLength)}return v(g)}function b(g,c,u){if(c<0||g.byteLength<c)throw new RangeError('"offset" is outside of buffer bounds');if(g.byteLength<c+(u||0))throw new RangeError('"length" is outside of buffer bounds');let _;return c===void 0&&u===void 0?_=new Uint8Array(g):u===void 0?_=new Uint8Array(g,c):_=new Uint8Array(g,c,u),Object.setPrototypeOf(_,s.prototype),_}function w(g){if(s.isBuffer(g)){const c=f(g.length)|0,u=o(c);return u.length===0||g.copy(u,0,0,c),u}if(g.length!==void 0)return typeof g.length!="number"||Ve(g.length)?o(0):v(g);if(g.type==="Buffer"&&Array.isArray(g.data))return v(g.data)}function f(g){if(g>=r)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+r.toString(16)+" bytes");return g|0}function k(g){return+g!=g&&(g=0),s.alloc(+g)}s.isBuffer=function(c){return c!=null&&c._isBuffer===!0&&c!==s.prototype},s.compare=function(c,u){if(Ae(c,Uint8Array)&&(c=s.from(c,c.offset,c.byteLength)),Ae(u,Uint8Array)&&(u=s.from(u,u.offset,u.byteLength)),!s.isBuffer(c)||!s.isBuffer(u))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(c===u)return 0;let _=c.length,R=u.length;for(let B=0,F=Math.min(_,R);B<F;++B)if(c[B]!==u[B]){_=c[B],R=u[B];break}return _<R?-1:R<_?1:0},s.isEncoding=function(c){switch(String(c).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},s.concat=function(c,u){if(!Array.isArray(c))throw new TypeError('"list" argument must be an Array of Buffers');if(c.length===0)return s.alloc(0);let _;if(u===void 0)for(u=0,_=0;_<c.length;++_)u+=c[_].length;const R=s.allocUnsafe(u);let B=0;for(_=0;_<c.length;++_){let F=c[_];if(Ae(F,Uint8Array))B+F.length>R.length?(s.isBuffer(F)||(F=s.from(F)),F.copy(R,B)):Uint8Array.prototype.set.call(R,F,B);else if(s.isBuffer(F))F.copy(R,B);else throw new TypeError('"list" argument must be an Array of Buffers');B+=F.length}return R};function x(g,c){if(s.isBuffer(g))return g.length;if(ArrayBuffer.isView(g)||Ae(g,ArrayBuffer))return g.byteLength;if(typeof g!="string")throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof g);const u=g.length,_=arguments.length>2&&arguments[2]===!0;if(!_&&u===0)return 0;let R=!1;for(;;)switch(c){case"ascii":case"latin1":case"binary":return u;case"utf8":case"utf-8":return me(g).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return u*2;case"hex":return u>>>1;case"base64":return lt(g).length;default:if(R)return _?-1:me(g).length;c=(""+c).toLowerCase(),R=!0}}s.byteLength=x;function L(g,c,u){let _=!1;if((c===void 0||c<0)&&(c=0),c>this.length||((u===void 0||u>this.length)&&(u=this.length),u<=0)||(u>>>=0,c>>>=0,u<=c))return"";for(g||(g="utf8");;)switch(g){case"hex":return H(this,c,u);case"utf8":case"utf-8":return D(this,c,u);case"ascii":return Q(this,c,u);case"latin1":case"binary":return re(this,c,u);case"base64":return z(this,c,u);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return oe(this,c,u);default:if(_)throw new TypeError("Unknown encoding: "+g);g=(g+"").toLowerCase(),_=!0}}s.prototype._isBuffer=!0;function S(g,c,u){const _=g[c];g[c]=g[u],g[u]=_}s.prototype.swap16=function(){const c=this.length;if(c%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let u=0;u<c;u+=2)S(this,u,u+1);return this},s.prototype.swap32=function(){const c=this.length;if(c%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let u=0;u<c;u+=4)S(this,u,u+3),S(this,u+1,u+2);return this},s.prototype.swap64=function(){const c=this.length;if(c%8!==0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let u=0;u<c;u+=8)S(this,u,u+7),S(this,u+1,u+6),S(this,u+2,u+5),S(this,u+3,u+4);return this},s.prototype.toString=function(){const c=this.length;return c===0?"":arguments.length===0?D(this,0,c):L.apply(this,arguments)},s.prototype.toLocaleString=s.prototype.toString,s.prototype.equals=function(c){if(!s.isBuffer(c))throw new TypeError("Argument must be a Buffer");return this===c?!0:s.compare(this,c)===0},s.prototype.inspect=function(){let c="";const u=e.INSPECT_MAX_BYTES;return c=this.toString("hex",0,u).replace(/(.{2})/g,"$1 ").trim(),this.length>u&&(c+=" ... "),"<Buffer "+c+">"},n&&(s.prototype[n]=s.prototype.inspect),s.prototype.compare=function(c,u,_,R,B){if(Ae(c,Uint8Array)&&(c=s.from(c,c.offset,c.byteLength)),!s.isBuffer(c))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof c);if(u===void 0&&(u=0),_===void 0&&(_=c?c.length:0),R===void 0&&(R=0),B===void 0&&(B=this.length),u<0||_>c.length||R<0||B>this.length)throw new RangeError("out of range index");if(R>=B&&u>=_)return 0;if(R>=B)return-1;if(u>=_)return 1;if(u>>>=0,_>>>=0,R>>>=0,B>>>=0,this===c)return 0;let F=B-R,ue=_-u;const xe=Math.min(F,ue),he=this.slice(R,B),Ce=c.slice(u,_);for(let _e=0;_e<xe;++_e)if(he[_e]!==Ce[_e]){F=he[_e],ue=Ce[_e];break}return F<ue?-1:ue<F?1:0};function A(g,c,u,_,R){if(g.length===0)return-1;if(typeof u=="string"?(_=u,u=0):u>2147483647?u=2147483647:u<-2147483648&&(u=-2147483648),u=+u,Ve(u)&&(u=R?0:g.length-1),u<0&&(u=g.length+u),u>=g.length){if(R)return-1;u=g.length-1}else if(u<0)if(R)u=0;else return-1;if(typeof c=="string"&&(c=s.from(c,_)),s.isBuffer(c))return c.length===0?-1:C(g,c,u,_,R);if(typeof c=="number")return c=c&255,typeof Uint8Array.prototype.indexOf=="function"?R?Uint8Array.prototype.indexOf.call(g,c,u):Uint8Array.prototype.lastIndexOf.call(g,c,u):C(g,[c],u,_,R);throw new TypeError("val must be string, number or Buffer")}function C(g,c,u,_,R){let B=1,F=g.length,ue=c.length;if(_!==void 0&&(_=String(_).toLowerCase(),_==="ucs2"||_==="ucs-2"||_==="utf16le"||_==="utf-16le")){if(g.length<2||c.length<2)return-1;B=2,F/=2,ue/=2,u/=2}function xe(Ce,_e){return B===1?Ce[_e]:Ce.readUInt16BE(_e*B)}let he;if(R){let Ce=-1;for(he=u;he<F;he++)if(xe(g,he)===xe(c,Ce===-1?0:he-Ce)){if(Ce===-1&&(Ce=he),he-Ce+1===ue)return Ce*B}else Ce!==-1&&(he-=he-Ce),Ce=-1}else for(u+ue>F&&(u=F-ue),he=u;he>=0;he--){let Ce=!0;for(let _e=0;_e<ue;_e++)if(xe(g,he+_e)!==xe(c,_e)){Ce=!1;break}if(Ce)return he}return-1}s.prototype.includes=function(c,u,_){return this.indexOf(c,u,_)!==-1},s.prototype.indexOf=function(c,u,_){return A(this,c,u,_,!0)},s.prototype.lastIndexOf=function(c,u,_){return A(this,c,u,_,!1)};function $(g,c,u,_){u=Number(u)||0;const R=g.length-u;_?(_=Number(_),_>R&&(_=R)):_=R;const B=c.length;_>B/2&&(_=B/2);let F;for(F=0;F<_;++F){const ue=parseInt(c.substr(F*2,2),16);if(Ve(ue))return F;g[u+F]=ue}return F}function N(g,c,u,_){return Ee(me(c,g.length-u),g,u,_)}function O(g,c,u,_){return Ee(Ye(c),g,u,_)}function G(g,c,u,_){return Ee(lt(c),g,u,_)}function U(g,c,u,_){return Ee(De(c,g.length-u),g,u,_)}s.prototype.write=function(c,u,_,R){if(u===void 0)R="utf8",_=this.length,u=0;else if(_===void 0&&typeof u=="string")R=u,_=this.length,u=0;else if(isFinite(u))u=u>>>0,isFinite(_)?(_=_>>>0,R===void 0&&(R="utf8")):(R=_,_=void 0);else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");const B=this.length-u;if((_===void 0||_>B)&&(_=B),c.length>0&&(_<0||u<0)||u>this.length)throw new RangeError("Attempt to write outside buffer bounds");R||(R="utf8");let F=!1;for(;;)switch(R){case"hex":return $(this,c,u,_);case"utf8":case"utf-8":return N(this,c,u,_);case"ascii":case"latin1":case"binary":return O(this,c,u,_);case"base64":return G(this,c,u,_);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return U(this,c,u,_);default:if(F)throw new TypeError("Unknown encoding: "+R);R=(""+R).toLowerCase(),F=!0}},s.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function z(g,c,u){return c===0&&u===g.length?t.fromByteArray(g):t.fromByteArray(g.slice(c,u))}function D(g,c,u){u=Math.min(g.length,u);const _=[];let R=c;for(;R<u;){const B=g[R];let F=null,ue=B>239?4:B>223?3:B>191?2:1;if(R+ue<=u){let xe,he,Ce,_e;switch(ue){case 1:B<128&&(F=B);break;case 2:xe=g[R+1],(xe&192)===128&&(_e=(B&31)<<6|xe&63,_e>127&&(F=_e));break;case 3:xe=g[R+1],he=g[R+2],(xe&192)===128&&(he&192)===128&&(_e=(B&15)<<12|(xe&63)<<6|he&63,_e>2047&&(_e<55296||_e>57343)&&(F=_e));break;case 4:xe=g[R+1],he=g[R+2],Ce=g[R+3],(xe&192)===128&&(he&192)===128&&(Ce&192)===128&&(_e=(B&15)<<18|(xe&63)<<12|(he&63)<<6|Ce&63,_e>65535&&_e<1114112&&(F=_e))}}F===null?(F=65533,ue=1):F>65535&&(F-=65536,_.push(F>>>10&1023|55296),F=56320|F&1023),_.push(F),R+=ue}return ne(_)}const K=4096;function ne(g){const c=g.length;if(c<=K)return String.fromCharCode.apply(String,g);let u="",_=0;for(;_<c;)u+=String.fromCharCode.apply(String,g.slice(_,_+=K));return u}function Q(g,c,u){let _="";u=Math.min(g.length,u);for(let R=c;R<u;++R)_+=String.fromCharCode(g[R]&127);return _}function re(g,c,u){let _="";u=Math.min(g.length,u);for(let R=c;R<u;++R)_+=String.fromCharCode(g[R]);return _}function H(g,c,u){const _=g.length;(!c||c<0)&&(c=0),(!u||u<0||u>_)&&(u=_);let R="";for(let B=c;B<u;++B)R+=Je[g[B]];return R}function oe(g,c,u){const _=g.slice(c,u);let R="";for(let B=0;B<_.length-1;B+=2)R+=String.fromCharCode(_[B]+_[B+1]*256);return R}s.prototype.slice=function(c,u){const _=this.length;c=~~c,u=u===void 0?_:~~u,c<0?(c+=_,c<0&&(c=0)):c>_&&(c=_),u<0?(u+=_,u<0&&(u=0)):u>_&&(u=_),u<c&&(u=c);const R=this.subarray(c,u);return Object.setPrototypeOf(R,s.prototype),R};function V(g,c,u){if(g%1!==0||g<0)throw new RangeError("offset is not uint");if(g+c>u)throw new RangeError("Trying to access beyond buffer length")}s.prototype.readUintLE=s.prototype.readUIntLE=function(c,u,_){c=c>>>0,u=u>>>0,_||V(c,u,this.length);let R=this[c],B=1,F=0;for(;++F<u&&(B*=256);)R+=this[c+F]*B;return R},s.prototype.readUintBE=s.prototype.readUIntBE=function(c,u,_){c=c>>>0,u=u>>>0,_||V(c,u,this.length);let R=this[c+--u],B=1;for(;u>0&&(B*=256);)R+=this[c+--u]*B;return R},s.prototype.readUint8=s.prototype.readUInt8=function(c,u){return c=c>>>0,u||V(c,1,this.length),this[c]},s.prototype.readUint16LE=s.prototype.readUInt16LE=function(c,u){return c=c>>>0,u||V(c,2,this.length),this[c]|this[c+1]<<8},s.prototype.readUint16BE=s.prototype.readUInt16BE=function(c,u){return c=c>>>0,u||V(c,2,this.length),this[c]<<8|this[c+1]},s.prototype.readUint32LE=s.prototype.readUInt32LE=function(c,u){return c=c>>>0,u||V(c,4,this.length),(this[c]|this[c+1]<<8|this[c+2]<<16)+this[c+3]*16777216},s.prototype.readUint32BE=s.prototype.readUInt32BE=function(c,u){return c=c>>>0,u||V(c,4,this.length),this[c]*16777216+(this[c+1]<<16|this[c+2]<<8|this[c+3])},s.prototype.readBigUInt64LE=$e(function(c){c=c>>>0,q(c,"offset");const u=this[c],_=this[c+7];(u===void 0||_===void 0)&&ee(c,this.length-8);const R=u+this[++c]*2**8+this[++c]*2**16+this[++c]*2**24,B=this[++c]+this[++c]*2**8+this[++c]*2**16+_*2**24;return BigInt(R)+(BigInt(B)<<BigInt(32))}),s.prototype.readBigUInt64BE=$e(function(c){c=c>>>0,q(c,"offset");const u=this[c],_=this[c+7];(u===void 0||_===void 0)&&ee(c,this.length-8);const R=u*2**24+this[++c]*2**16+this[++c]*2**8+this[++c],B=this[++c]*2**24+this[++c]*2**16+this[++c]*2**8+_;return(BigInt(R)<<BigInt(32))+BigInt(B)}),s.prototype.readIntLE=function(c,u,_){c=c>>>0,u=u>>>0,_||V(c,u,this.length);let R=this[c],B=1,F=0;for(;++F<u&&(B*=256);)R+=this[c+F]*B;return B*=128,R>=B&&(R-=Math.pow(2,8*u)),R},s.prototype.readIntBE=function(c,u,_){c=c>>>0,u=u>>>0,_||V(c,u,this.length);let R=u,B=1,F=this[c+--R];for(;R>0&&(B*=256);)F+=this[c+--R]*B;return B*=128,F>=B&&(F-=Math.pow(2,8*u)),F},s.prototype.readInt8=function(c,u){return c=c>>>0,u||V(c,1,this.length),this[c]&128?(255-this[c]+1)*-1:this[c]},s.prototype.readInt16LE=function(c,u){c=c>>>0,u||V(c,2,this.length);const _=this[c]|this[c+1]<<8;return _&32768?_|4294901760:_},s.prototype.readInt16BE=function(c,u){c=c>>>0,u||V(c,2,this.length);const _=this[c+1]|this[c]<<8;return _&32768?_|4294901760:_},s.prototype.readInt32LE=function(c,u){return c=c>>>0,u||V(c,4,this.length),this[c]|this[c+1]<<8|this[c+2]<<16|this[c+3]<<24},s.prototype.readInt32BE=function(c,u){return c=c>>>0,u||V(c,4,this.length),this[c]<<24|this[c+1]<<16|this[c+2]<<8|this[c+3]},s.prototype.readBigInt64LE=$e(function(c){c=c>>>0,q(c,"offset");const u=this[c],_=this[c+7];(u===void 0||_===void 0)&&ee(c,this.length-8);const R=this[c+4]+this[c+5]*2**8+this[c+6]*2**16+(_<<24);return(BigInt(R)<<BigInt(32))+BigInt(u+this[++c]*2**8+this[++c]*2**16+this[++c]*2**24)}),s.prototype.readBigInt64BE=$e(function(c){c=c>>>0,q(c,"offset");const u=this[c],_=this[c+7];(u===void 0||_===void 0)&&ee(c,this.length-8);const R=(u<<24)+this[++c]*2**16+this[++c]*2**8+this[++c];return(BigInt(R)<<BigInt(32))+BigInt(this[++c]*2**24+this[++c]*2**16+this[++c]*2**8+_)}),s.prototype.readFloatLE=function(c,u){return c=c>>>0,u||V(c,4,this.length),i.read(this,c,!0,23,4)},s.prototype.readFloatBE=function(c,u){return c=c>>>0,u||V(c,4,this.length),i.read(this,c,!1,23,4)},s.prototype.readDoubleLE=function(c,u){return c=c>>>0,u||V(c,8,this.length),i.read(this,c,!0,52,8)},s.prototype.readDoubleBE=function(c,u){return c=c>>>0,u||V(c,8,this.length),i.read(this,c,!1,52,8)};function W(g,c,u,_,R,B){if(!s.isBuffer(g))throw new TypeError('"buffer" argument must be a Buffer instance');if(c>R||c<B)throw new RangeError('"value" argument is out of bounds');if(u+_>g.length)throw new RangeError("Index out of range")}s.prototype.writeUintLE=s.prototype.writeUIntLE=function(c,u,_,R){if(c=+c,u=u>>>0,_=_>>>0,!R){const ue=Math.pow(2,8*_)-1;W(this,c,u,_,ue,0)}let B=1,F=0;for(this[u]=c&255;++F<_&&(B*=256);)this[u+F]=c/B&255;return u+_},s.prototype.writeUintBE=s.prototype.writeUIntBE=function(c,u,_,R){if(c=+c,u=u>>>0,_=_>>>0,!R){const ue=Math.pow(2,8*_)-1;W(this,c,u,_,ue,0)}let B=_-1,F=1;for(this[u+B]=c&255;--B>=0&&(F*=256);)this[u+B]=c/F&255;return u+_},s.prototype.writeUint8=s.prototype.writeUInt8=function(c,u,_){return c=+c,u=u>>>0,_||W(this,c,u,1,255,0),this[u]=c&255,u+1},s.prototype.writeUint16LE=s.prototype.writeUInt16LE=function(c,u,_){return c=+c,u=u>>>0,_||W(this,c,u,2,65535,0),this[u]=c&255,this[u+1]=c>>>8,u+2},s.prototype.writeUint16BE=s.prototype.writeUInt16BE=function(c,u,_){return c=+c,u=u>>>0,_||W(this,c,u,2,65535,0),this[u]=c>>>8,this[u+1]=c&255,u+2},s.prototype.writeUint32LE=s.prototype.writeUInt32LE=function(c,u,_){return c=+c,u=u>>>0,_||W(this,c,u,4,4294967295,0),this[u+3]=c>>>24,this[u+2]=c>>>16,this[u+1]=c>>>8,this[u]=c&255,u+4},s.prototype.writeUint32BE=s.prototype.writeUInt32BE=function(c,u,_){return c=+c,u=u>>>0,_||W(this,c,u,4,4294967295,0),this[u]=c>>>24,this[u+1]=c>>>16,this[u+2]=c>>>8,this[u+3]=c&255,u+4};function ae(g,c,u,_,R){T(c,_,R,g,u,7);let B=Number(c&BigInt(4294967295));g[u++]=B,B=B>>8,g[u++]=B,B=B>>8,g[u++]=B,B=B>>8,g[u++]=B;let F=Number(c>>BigInt(32)&BigInt(4294967295));return g[u++]=F,F=F>>8,g[u++]=F,F=F>>8,g[u++]=F,F=F>>8,g[u++]=F,u}function fe(g,c,u,_,R){T(c,_,R,g,u,7);let B=Number(c&BigInt(4294967295));g[u+7]=B,B=B>>8,g[u+6]=B,B=B>>8,g[u+5]=B,B=B>>8,g[u+4]=B;let F=Number(c>>BigInt(32)&BigInt(4294967295));return g[u+3]=F,F=F>>8,g[u+2]=F,F=F>>8,g[u+1]=F,F=F>>8,g[u]=F,u+8}s.prototype.writeBigUInt64LE=$e(function(c,u=0){return ae(this,c,u,BigInt(0),BigInt("0xffffffffffffffff"))}),s.prototype.writeBigUInt64BE=$e(function(c,u=0){return fe(this,c,u,BigInt(0),BigInt("0xffffffffffffffff"))}),s.prototype.writeIntLE=function(c,u,_,R){if(c=+c,u=u>>>0,!R){const xe=Math.pow(2,8*_-1);W(this,c,u,_,xe-1,-xe)}let B=0,F=1,ue=0;for(this[u]=c&255;++B<_&&(F*=256);)c<0&&ue===0&&this[u+B-1]!==0&&(ue=1),this[u+B]=(c/F>>0)-ue&255;return u+_},s.prototype.writeIntBE=function(c,u,_,R){if(c=+c,u=u>>>0,!R){const xe=Math.pow(2,8*_-1);W(this,c,u,_,xe-1,-xe)}let B=_-1,F=1,ue=0;for(this[u+B]=c&255;--B>=0&&(F*=256);)c<0&&ue===0&&this[u+B+1]!==0&&(ue=1),this[u+B]=(c/F>>0)-ue&255;return u+_},s.prototype.writeInt8=function(c,u,_){return c=+c,u=u>>>0,_||W(this,c,u,1,127,-128),c<0&&(c=255+c+1),this[u]=c&255,u+1},s.prototype.writeInt16LE=function(c,u,_){return c=+c,u=u>>>0,_||W(this,c,u,2,32767,-32768),this[u]=c&255,this[u+1]=c>>>8,u+2},s.prototype.writeInt16BE=function(c,u,_){return c=+c,u=u>>>0,_||W(this,c,u,2,32767,-32768),this[u]=c>>>8,this[u+1]=c&255,u+2},s.prototype.writeInt32LE=function(c,u,_){return c=+c,u=u>>>0,_||W(this,c,u,4,2147483647,-2147483648),this[u]=c&255,this[u+1]=c>>>8,this[u+2]=c>>>16,this[u+3]=c>>>24,u+4},s.prototype.writeInt32BE=function(c,u,_){return c=+c,u=u>>>0,_||W(this,c,u,4,2147483647,-2147483648),c<0&&(c=4294967295+c+1),this[u]=c>>>24,this[u+1]=c>>>16,this[u+2]=c>>>8,this[u+3]=c&255,u+4},s.prototype.writeBigInt64LE=$e(function(c,u=0){return ae(this,c,u,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),s.prototype.writeBigInt64BE=$e(function(c,u=0){return fe(this,c,u,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))});function X(g,c,u,_,R,B){if(u+_>g.length)throw new RangeError("Index out of range");if(u<0)throw new RangeError("Index out of range")}function I(g,c,u,_,R){return c=+c,u=u>>>0,R||X(g,c,u,4),i.write(g,c,u,_,23,4),u+4}s.prototype.writeFloatLE=function(c,u,_){return I(this,c,u,!0,_)},s.prototype.writeFloatBE=function(c,u,_){return I(this,c,u,!1,_)};function M(g,c,u,_,R){return c=+c,u=u>>>0,R||X(g,c,u,8),i.write(g,c,u,_,52,8),u+8}s.prototype.writeDoubleLE=function(c,u,_){return M(this,c,u,!0,_)},s.prototype.writeDoubleBE=function(c,u,_){return M(this,c,u,!1,_)},s.prototype.copy=function(c,u,_,R){if(!s.isBuffer(c))throw new TypeError("argument should be a Buffer");if(_||(_=0),!R&&R!==0&&(R=this.length),u>=c.length&&(u=c.length),u||(u=0),R>0&&R<_&&(R=_),R===_||c.length===0||this.length===0)return 0;if(u<0)throw new RangeError("targetStart out of bounds");if(_<0||_>=this.length)throw new RangeError("Index out of range");if(R<0)throw new RangeError("sourceEnd out of bounds");R>this.length&&(R=this.length),c.length-u<R-_&&(R=c.length-u+_);const B=R-_;return this===c&&typeof Uint8Array.prototype.copyWithin=="function"?this.copyWithin(u,_,R):Uint8Array.prototype.set.call(c,this.subarray(_,R),u),B},s.prototype.fill=function(c,u,_,R){if(typeof c=="string"){if(typeof u=="string"?(R=u,u=0,_=this.length):typeof _=="string"&&(R=_,_=this.length),R!==void 0&&typeof R!="string")throw new TypeError("encoding must be a string");if(typeof R=="string"&&!s.isEncoding(R))throw new TypeError("Unknown encoding: "+R);if(c.length===1){const F=c.charCodeAt(0);(R==="utf8"&&F<128||R==="latin1")&&(c=F)}}else typeof c=="number"?c=c&255:typeof c=="boolean"&&(c=Number(c));if(u<0||this.length<u||this.length<_)throw new RangeError("Out of range index");if(_<=u)return this;u=u>>>0,_=_===void 0?this.length:_>>>0,c||(c=0);let B;if(typeof c=="number")for(B=u;B<_;++B)this[B]=c;else{const F=s.isBuffer(c)?c:s.from(c,R),ue=F.length;if(ue===0)throw new TypeError('The value "'+c+'" is invalid for argument "value"');for(B=0;B<_-u;++B)this[B+u]=F[B%ue]}return this};const P={};function j(g,c,u){P[g]=class extends u{constructor(){super(),Object.defineProperty(this,"message",{value:c.apply(this,arguments),writable:!0,configurable:!0}),this.name=`${this.name} [${g}]`,this.stack,delete this.name}get code(){return g}set code(R){Object.defineProperty(this,"code",{configurable:!0,enumerable:!0,value:R,writable:!0})}toString(){return`${this.name} [${g}]: ${this.message}`}}}j("ERR_BUFFER_OUT_OF_BOUNDS",function(g){return g?`${g} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"},RangeError),j("ERR_INVALID_ARG_TYPE",function(g,c){return`The "${g}" argument must be of type number. Received type ${typeof c}`},TypeError),j("ERR_OUT_OF_RANGE",function(g,c,u){let _=`The value of "${g}" is out of range.`,R=u;return Number.isInteger(u)&&Math.abs(u)>2**32?R=ie(String(u)):typeof u=="bigint"&&(R=String(u),(u>BigInt(2)**BigInt(32)||u<-(BigInt(2)**BigInt(32)))&&(R=ie(R)),R+="n"),_+=` It must be ${c}. Received ${R}`,_},RangeError);function ie(g){let c="",u=g.length;const _=g[0]==="-"?1:0;for(;u>=_+4;u-=3)c=`_${g.slice(u-3,u)}${c}`;return`${g.slice(0,u)}${c}`}function E(g,c,u){q(c,"offset"),(g[c]===void 0||g[c+u]===void 0)&&ee(c,g.length-(u+1))}function T(g,c,u,_,R,B){if(g>u||g<c){const F=typeof c=="bigint"?"n":"";let ue;throw c===0||c===BigInt(0)?ue=`>= 0${F} and < 2${F} ** ${(B+1)*8}${F}`:ue=`>= -(2${F} ** ${(B+1)*8-1}${F}) and < 2 ** ${(B+1)*8-1}${F}`,new P.ERR_OUT_OF_RANGE("value",ue,g)}E(_,R,B)}function q(g,c){if(typeof g!="number")throw new P.ERR_INVALID_ARG_TYPE(c,"number",g)}function ee(g,c,u){throw Math.floor(g)!==g?(q(g,u),new P.ERR_OUT_OF_RANGE("offset","an integer",g)):c<0?new P.ERR_BUFFER_OUT_OF_BOUNDS:new P.ERR_OUT_OF_RANGE("offset",`>= 0 and <= ${c}`,g)}const ye=/[^+/0-9A-Za-z-_]/g;function se(g){if(g=g.split("=")[0],g=g.trim().replace(ye,""),g.length<2)return"";for(;g.length%4!==0;)g=g+"=";return g}function me(g,c){c=c||1/0;let u;const _=g.length;let R=null;const B=[];for(let F=0;F<_;++F){if(u=g.charCodeAt(F),u>55295&&u<57344){if(!R){if(u>56319){(c-=3)>-1&&B.push(239,191,189);continue}else if(F+1===_){(c-=3)>-1&&B.push(239,191,189);continue}R=u;continue}if(u<56320){(c-=3)>-1&&B.push(239,191,189),R=u;continue}u=(R-55296<<10|u-56320)+65536}else R&&(c-=3)>-1&&B.push(239,191,189);if(R=null,u<128){if((c-=1)<0)break;B.push(u)}else if(u<2048){if((c-=2)<0)break;B.push(u>>6|192,u&63|128)}else if(u<65536){if((c-=3)<0)break;B.push(u>>12|224,u>>6&63|128,u&63|128)}else if(u<1114112){if((c-=4)<0)break;B.push(u>>18|240,u>>12&63|128,u>>6&63|128,u&63|128)}else throw new Error("Invalid code point")}return B}function Ye(g){const c=[];for(let u=0;u<g.length;++u)c.push(g.charCodeAt(u)&255);return c}function De(g,c){let u,_,R;const B=[];for(let F=0;F<g.length&&!((c-=2)<0);++F)u=g.charCodeAt(F),_=u>>8,R=u%256,B.push(R),B.push(_);return B}function lt(g){return t.toByteArray(se(g))}function Ee(g,c,u,_){let R;for(R=0;R<_&&!(R+u>=c.length||R>=g.length);++R)c[R+u]=g[R];return R}function Ae(g,c){return g instanceof c||g!=null&&g.constructor!=null&&g.constructor.name!=null&&g.constructor.name===c.name}function Ve(g){return g!==g}const Je=function(){const g="0123456789abcdef",c=new Array(256);for(let u=0;u<16;++u){const _=u*16;for(let R=0;R<16;++R)c[_+R]=g[u]+g[R]}return c}();function $e(g){return typeof BigInt>"u"?le:g}function le(){throw new Error("BigInt not supported")}})(vi);(function(e,t){var i=vi,n=i.Buffer;function r(o,s){for(var l in o)s[l]=o[l]}n.from&&n.alloc&&n.allocUnsafe&&n.allocUnsafeSlow?e.exports=i:(r(i,t),t.Buffer=a);function a(o,s,l){return n(o,s,l)}a.prototype=Object.create(n.prototype),r(n,a),a.from=function(o,s,l){if(typeof o=="number")throw new TypeError("Argument must not be a number");return n(o,s,l)},a.alloc=function(o,s,l){if(typeof o!="number")throw new TypeError("Argument must be a number");var d=n(o);return s!==void 0?typeof l=="string"?d.fill(s,l):d.fill(s):d.fill(0),d},a.allocUnsafe=function(o){if(typeof o!="number")throw new TypeError("Argument must be a number");return n(o)},a.allocUnsafeSlow=function(o){if(typeof o!="number")throw new TypeError("Argument must be a number");return i.SlowBuffer(o)}})(Fa,Fa.exports);var Vl=Fa.exports,ua=65536,ju=4294967295;function Ku(){throw new Error(`Secure random number generation is not supported by this browser.
Use Chrome, Firefox or Internet Explorer 11`)}var Wu=Vl.Buffer,ur=globalThis.crypto||globalThis.msCrypto;ur&&ur.getRandomValues?qa.exports=Yu:qa.exports=Ku;function Yu(e,t){if(e>ju)throw new RangeError("requested too many random bytes");var i=Wu.allocUnsafe(e);if(e>0)if(e>ua)for(var n=0;n<e;n+=ua)ur.getRandomValues(i.slice(n,n+ua));else ur.getRandomValues(i);return typeof t=="function"?process.nextTick(function(){t(null,i)}):i}var ys=qa.exports,Ua={exports:{}},Jl=Pr.EventEmitter;const Gu={},Vu=Object.freeze(Object.defineProperty({__proto__:null,default:Gu},Symbol.toStringTag,{value:"Module"})),bi=ku(Vu);var pa,_o;function Ju(){if(_o)return pa;_o=1;function e(y,b){var w=Object.keys(y);if(Object.getOwnPropertySymbols){var f=Object.getOwnPropertySymbols(y);b&&(f=f.filter(function(k){return Object.getOwnPropertyDescriptor(y,k).enumerable})),w.push.apply(w,f)}return w}function t(y){for(var b=1;b<arguments.length;b++){var w=arguments[b]!=null?arguments[b]:{};b%2?e(Object(w),!0).forEach(function(f){i(y,f,w[f])}):Object.getOwnPropertyDescriptors?Object.defineProperties(y,Object.getOwnPropertyDescriptors(w)):e(Object(w)).forEach(function(f){Object.defineProperty(y,f,Object.getOwnPropertyDescriptor(w,f))})}return y}function i(y,b,w){return b=o(b),b in y?Object.defineProperty(y,b,{value:w,enumerable:!0,configurable:!0,writable:!0}):y[b]=w,y}function n(y,b){if(!(y instanceof b))throw new TypeError("Cannot call a class as a function")}function r(y,b){for(var w=0;w<b.length;w++){var f=b[w];f.enumerable=f.enumerable||!1,f.configurable=!0,"value"in f&&(f.writable=!0),Object.defineProperty(y,o(f.key),f)}}function a(y,b,w){return b&&r(y.prototype,b),Object.defineProperty(y,"prototype",{writable:!1}),y}function o(y){var b=s(y,"string");return typeof b=="symbol"?b:String(b)}function s(y,b){if(typeof y!="object"||y===null)return y;var w=y[Symbol.toPrimitive];if(w!==void 0){var f=w.call(y,b);if(typeof f!="object")return f;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(y)}var l=vi,d=l.Buffer,p=bi,h=p.inspect,m=h&&h.custom||"inspect";function v(y,b,w){d.prototype.copy.call(y,b,w)}return pa=function(){function y(){n(this,y),this.head=null,this.tail=null,this.length=0}return a(y,[{key:"push",value:function(w){var f={data:w,next:null};this.length>0?this.tail.next=f:this.head=f,this.tail=f,++this.length}},{key:"unshift",value:function(w){var f={data:w,next:this.head};this.length===0&&(this.tail=f),this.head=f,++this.length}},{key:"shift",value:function(){if(this.length!==0){var w=this.head.data;return this.length===1?this.head=this.tail=null:this.head=this.head.next,--this.length,w}}},{key:"clear",value:function(){this.head=this.tail=null,this.length=0}},{key:"join",value:function(w){if(this.length===0)return"";for(var f=this.head,k=""+f.data;f=f.next;)k+=w+f.data;return k}},{key:"concat",value:function(w){if(this.length===0)return d.alloc(0);for(var f=d.allocUnsafe(w>>>0),k=this.head,x=0;k;)v(k.data,f,x),x+=k.data.length,k=k.next;return f}},{key:"consume",value:function(w,f){var k;return w<this.head.data.length?(k=this.head.data.slice(0,w),this.head.data=this.head.data.slice(w)):w===this.head.data.length?k=this.shift():k=f?this._getString(w):this._getBuffer(w),k}},{key:"first",value:function(){return this.head.data}},{key:"_getString",value:function(w){var f=this.head,k=1,x=f.data;for(w-=x.length;f=f.next;){var L=f.data,S=w>L.length?L.length:w;if(S===L.length?x+=L:x+=L.slice(0,w),w-=S,w===0){S===L.length?(++k,f.next?this.head=f.next:this.head=this.tail=null):(this.head=f,f.data=L.slice(S));break}++k}return this.length-=k,x}},{key:"_getBuffer",value:function(w){var f=d.allocUnsafe(w),k=this.head,x=1;for(k.data.copy(f),w-=k.data.length;k=k.next;){var L=k.data,S=w>L.length?L.length:w;if(L.copy(f,f.length-w,0,S),w-=S,w===0){S===L.length?(++x,k.next?this.head=k.next:this.head=this.tail=null):(this.head=k,k.data=L.slice(S));break}++x}return this.length-=x,f}},{key:m,value:function(w,f){return h(this,t(t({},f),{},{depth:0,customInspect:!1}))}}]),y}(),pa}function Xu(e,t){var i=this,n=this._readableState&&this._readableState.destroyed,r=this._writableState&&this._writableState.destroyed;return n||r?(t?t(e):e&&(this._writableState?this._writableState.errorEmitted||(this._writableState.errorEmitted=!0,process.nextTick(ja,this,e)):process.nextTick(ja,this,e)),this):(this._readableState&&(this._readableState.destroyed=!0),this._writableState&&(this._writableState.destroyed=!0),this._destroy(e||null,function(a){!t&&a?i._writableState?i._writableState.errorEmitted?process.nextTick(Wn,i):(i._writableState.errorEmitted=!0,process.nextTick(So,i,a)):process.nextTick(So,i,a):t?(process.nextTick(Wn,i),t(a)):process.nextTick(Wn,i)}),this)}function So(e,t){ja(e,t),Wn(e)}function Wn(e){e._writableState&&!e._writableState.emitClose||e._readableState&&!e._readableState.emitClose||e.emit("close")}function Zu(){this._readableState&&(this._readableState.destroyed=!1,this._readableState.reading=!1,this._readableState.ended=!1,this._readableState.endEmitted=!1),this._writableState&&(this._writableState.destroyed=!1,this._writableState.ended=!1,this._writableState.ending=!1,this._writableState.finalCalled=!1,this._writableState.prefinished=!1,this._writableState.finished=!1,this._writableState.errorEmitted=!1)}function ja(e,t){e.emit("error",t)}function Qu(e,t){var i=e._readableState,n=e._writableState;i&&i.autoDestroy||n&&n.autoDestroy?e.destroy(t):e.emit("error",t)}var Xl={destroy:Xu,undestroy:Zu,errorOrDestroy:Qu},wi={};function ep(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}var Zl={};function mt(e,t,i){i||(i=Error);function n(a,o,s){return typeof t=="string"?t:t(a,o,s)}var r=function(a){ep(o,a);function o(s,l,d){return a.call(this,n(s,l,d))||this}return o}(i);r.prototype.name=i.name,r.prototype.code=e,Zl[e]=r}function Eo(e,t){if(Array.isArray(e)){var i=e.length;return e=e.map(function(n){return String(n)}),i>2?"one of ".concat(t," ").concat(e.slice(0,i-1).join(", "),", or ")+e[i-1]:i===2?"one of ".concat(t," ").concat(e[0]," or ").concat(e[1]):"of ".concat(t," ").concat(e[0])}else return"of ".concat(t," ").concat(String(e))}function tp(e,t,i){return e.substr(0,t.length)===t}function ip(e,t,i){return(i===void 0||i>e.length)&&(i=e.length),e.substring(i-t.length,i)===t}function np(e,t,i){return typeof i!="number"&&(i=0),i+t.length>e.length?!1:e.indexOf(t,i)!==-1}mt("ERR_INVALID_OPT_VALUE",function(e,t){return'The value "'+t+'" is invalid for option "'+e+'"'},TypeError);mt("ERR_INVALID_ARG_TYPE",function(e,t,i){var n;typeof t=="string"&&tp(t,"not ")?(n="must not be",t=t.replace(/^not /,"")):n="must be";var r;if(ip(e," argument"))r="The ".concat(e," ").concat(n," ").concat(Eo(t,"type"));else{var a=np(e,".")?"property":"argument";r='The "'.concat(e,'" ').concat(a," ").concat(n," ").concat(Eo(t,"type"))}return r+=". Received type ".concat(typeof i),r},TypeError);mt("ERR_STREAM_PUSH_AFTER_EOF","stream.push() after EOF");mt("ERR_METHOD_NOT_IMPLEMENTED",function(e){return"The "+e+" method is not implemented"});mt("ERR_STREAM_PREMATURE_CLOSE","Premature close");mt("ERR_STREAM_DESTROYED",function(e){return"Cannot call "+e+" after a stream was destroyed"});mt("ERR_MULTIPLE_CALLBACK","Callback called multiple times");mt("ERR_STREAM_CANNOT_PIPE","Cannot pipe, not readable");mt("ERR_STREAM_WRITE_AFTER_END","write after end");mt("ERR_STREAM_NULL_VALUES","May not write null values to stream",TypeError);mt("ERR_UNKNOWN_ENCODING",function(e){return"Unknown encoding: "+e},TypeError);mt("ERR_STREAM_UNSHIFT_AFTER_END_EVENT","stream.unshift() after end event");wi.codes=Zl;var rp=wi.codes.ERR_INVALID_OPT_VALUE;function ap(e,t,i){return e.highWaterMark!=null?e.highWaterMark:t?e[i]:null}function sp(e,t,i,n){var r=ap(t,n,i);if(r!=null){if(!(isFinite(r)&&Math.floor(r)===r)||r<0){var a=n?i:"highWaterMark";throw new rp(a,r)}return Math.floor(r)}return e.objectMode?16:16*1024}var Ql={getHighWaterMark:sp},Ka={exports:{}};typeof Object.create=="function"?Ka.exports=function(t,i){i&&(t.super_=i,t.prototype=Object.create(i.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}))}:Ka.exports=function(t,i){if(i){t.super_=i;var n=function(){};n.prototype=i.prototype,t.prototype=new n,t.prototype.constructor=t}};var _n=Ka.exports,op=lp;function lp(e,t){if(fa("noDeprecation"))return e;var i=!1;function n(){if(!i){if(fa("throwDeprecation"))throw new Error(t);fa("traceDeprecation"),i=!0}return e.apply(this,arguments)}return n}function fa(e){try{if(!globalThis.localStorage)return!1}catch{return!1}var t=globalThis.localStorage[e];return t==null?!1:String(t).toLowerCase()==="true"}var ha,xo;function ec(){if(xo)return ha;xo=1,ha=$;function e(I){var M=this;this.next=null,this.entry=null,this.finish=function(){X(M,I)}}var t;$.WritableState=A;var i={deprecate:op},n=Jl,r=vi.Buffer,a=(typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof self<"u"?self:{}).Uint8Array||function(){};function o(I){return r.from(I)}function s(I){return r.isBuffer(I)||I instanceof a}var l=Xl,d=Ql,p=d.getHighWaterMark,h=wi.codes,m=h.ERR_INVALID_ARG_TYPE,v=h.ERR_METHOD_NOT_IMPLEMENTED,y=h.ERR_MULTIPLE_CALLBACK,b=h.ERR_STREAM_CANNOT_PIPE,w=h.ERR_STREAM_DESTROYED,f=h.ERR_STREAM_NULL_VALUES,k=h.ERR_STREAM_WRITE_AFTER_END,x=h.ERR_UNKNOWN_ENCODING,L=l.errorOrDestroy;_n($,n);function S(){}function A(I,M,P){t=t||Oi(),I=I||{},typeof P!="boolean"&&(P=M instanceof t),this.objectMode=!!I.objectMode,P&&(this.objectMode=this.objectMode||!!I.writableObjectMode),this.highWaterMark=p(this,I,"writableHighWaterMark",P),this.finalCalled=!1,this.needDrain=!1,this.ending=!1,this.ended=!1,this.finished=!1,this.destroyed=!1;var j=I.decodeStrings===!1;this.decodeStrings=!j,this.defaultEncoding=I.defaultEncoding||"utf8",this.length=0,this.writing=!1,this.corked=0,this.sync=!0,this.bufferProcessing=!1,this.onwrite=function(ie){ne(M,ie)},this.writecb=null,this.writelen=0,this.bufferedRequest=null,this.lastBufferedRequest=null,this.pendingcb=0,this.prefinished=!1,this.errorEmitted=!1,this.emitClose=I.emitClose!==!1,this.autoDestroy=!!I.autoDestroy,this.bufferedRequestCount=0,this.corkedRequestsFree=new e(this)}A.prototype.getBuffer=function(){for(var M=this.bufferedRequest,P=[];M;)P.push(M),M=M.next;return P},function(){try{Object.defineProperty(A.prototype,"buffer",{get:i.deprecate(function(){return this.getBuffer()},"_writableState.buffer is deprecated. Use _writableState.getBuffer instead.","DEP0003")})}catch{}}();var C;typeof Symbol=="function"&&Symbol.hasInstance&&typeof Function.prototype[Symbol.hasInstance]=="function"?(C=Function.prototype[Symbol.hasInstance],Object.defineProperty($,Symbol.hasInstance,{value:function(M){return C.call(this,M)?!0:this!==$?!1:M&&M._writableState instanceof A}})):C=function(M){return M instanceof this};function $(I){t=t||Oi();var M=this instanceof t;if(!M&&!C.call($,this))return new $(I);this._writableState=new A(I,this,M),this.writable=!0,I&&(typeof I.write=="function"&&(this._write=I.write),typeof I.writev=="function"&&(this._writev=I.writev),typeof I.destroy=="function"&&(this._destroy=I.destroy),typeof I.final=="function"&&(this._final=I.final)),n.call(this)}$.prototype.pipe=function(){L(this,new b)};function N(I,M){var P=new k;L(I,P),process.nextTick(M,P)}function O(I,M,P,j){var ie;return P===null?ie=new f:typeof P!="string"&&!M.objectMode&&(ie=new m("chunk",["string","Buffer"],P)),ie?(L(I,ie),process.nextTick(j,ie),!1):!0}$.prototype.write=function(I,M,P){var j=this._writableState,ie=!1,E=!j.objectMode&&s(I);return E&&!r.isBuffer(I)&&(I=o(I)),typeof M=="function"&&(P=M,M=null),E?M="buffer":M||(M=j.defaultEncoding),typeof P!="function"&&(P=S),j.ending?N(this,P):(E||O(this,j,I,P))&&(j.pendingcb++,ie=U(this,j,E,I,M,P)),ie},$.prototype.cork=function(){this._writableState.corked++},$.prototype.uncork=function(){var I=this._writableState;I.corked&&(I.corked--,!I.writing&&!I.corked&&!I.bufferProcessing&&I.bufferedRequest&&H(this,I))},$.prototype.setDefaultEncoding=function(M){if(typeof M=="string"&&(M=M.toLowerCase()),!(["hex","utf8","utf-8","ascii","binary","base64","ucs2","ucs-2","utf16le","utf-16le","raw"].indexOf((M+"").toLowerCase())>-1))throw new x(M);return this._writableState.defaultEncoding=M,this},Object.defineProperty($.prototype,"writableBuffer",{enumerable:!1,get:function(){return this._writableState&&this._writableState.getBuffer()}});function G(I,M,P){return!I.objectMode&&I.decodeStrings!==!1&&typeof M=="string"&&(M=r.from(M,P)),M}Object.defineProperty($.prototype,"writableHighWaterMark",{enumerable:!1,get:function(){return this._writableState.highWaterMark}});function U(I,M,P,j,ie,E){if(!P){var T=G(M,j,ie);j!==T&&(P=!0,ie="buffer",j=T)}var q=M.objectMode?1:j.length;M.length+=q;var ee=M.length<M.highWaterMark;if(ee||(M.needDrain=!0),M.writing||M.corked){var ye=M.lastBufferedRequest;M.lastBufferedRequest={chunk:j,encoding:ie,isBuf:P,callback:E,next:null},ye?ye.next=M.lastBufferedRequest:M.bufferedRequest=M.lastBufferedRequest,M.bufferedRequestCount+=1}else z(I,M,!1,q,j,ie,E);return ee}function z(I,M,P,j,ie,E,T){M.writelen=j,M.writecb=T,M.writing=!0,M.sync=!0,M.destroyed?M.onwrite(new w("write")):P?I._writev(ie,M.onwrite):I._write(ie,E,M.onwrite),M.sync=!1}function D(I,M,P,j,ie){--M.pendingcb,P?(process.nextTick(ie,j),process.nextTick(ae,I,M),I._writableState.errorEmitted=!0,L(I,j)):(ie(j),I._writableState.errorEmitted=!0,L(I,j),ae(I,M))}function K(I){I.writing=!1,I.writecb=null,I.length-=I.writelen,I.writelen=0}function ne(I,M){var P=I._writableState,j=P.sync,ie=P.writecb;if(typeof ie!="function")throw new y;if(K(P),M)D(I,P,j,M,ie);else{var E=oe(P)||I.destroyed;!E&&!P.corked&&!P.bufferProcessing&&P.bufferedRequest&&H(I,P),j?process.nextTick(Q,I,P,E,ie):Q(I,P,E,ie)}}function Q(I,M,P,j){P||re(I,M),M.pendingcb--,j(),ae(I,M)}function re(I,M){M.length===0&&M.needDrain&&(M.needDrain=!1,I.emit("drain"))}function H(I,M){M.bufferProcessing=!0;var P=M.bufferedRequest;if(I._writev&&P&&P.next){var j=M.bufferedRequestCount,ie=new Array(j),E=M.corkedRequestsFree;E.entry=P;for(var T=0,q=!0;P;)ie[T]=P,P.isBuf||(q=!1),P=P.next,T+=1;ie.allBuffers=q,z(I,M,!0,M.length,ie,"",E.finish),M.pendingcb++,M.lastBufferedRequest=null,E.next?(M.corkedRequestsFree=E.next,E.next=null):M.corkedRequestsFree=new e(M),M.bufferedRequestCount=0}else{for(;P;){var ee=P.chunk,ye=P.encoding,se=P.callback,me=M.objectMode?1:ee.length;if(z(I,M,!1,me,ee,ye,se),P=P.next,M.bufferedRequestCount--,M.writing)break}P===null&&(M.lastBufferedRequest=null)}M.bufferedRequest=P,M.bufferProcessing=!1}$.prototype._write=function(I,M,P){P(new v("_write()"))},$.prototype._writev=null,$.prototype.end=function(I,M,P){var j=this._writableState;return typeof I=="function"?(P=I,I=null,M=null):typeof M=="function"&&(P=M,M=null),I!=null&&this.write(I,M),j.corked&&(j.corked=1,this.uncork()),j.ending||fe(this,j,P),this},Object.defineProperty($.prototype,"writableLength",{enumerable:!1,get:function(){return this._writableState.length}});function oe(I){return I.ending&&I.length===0&&I.bufferedRequest===null&&!I.finished&&!I.writing}function V(I,M){I._final(function(P){M.pendingcb--,P&&L(I,P),M.prefinished=!0,I.emit("prefinish"),ae(I,M)})}function W(I,M){!M.prefinished&&!M.finalCalled&&(typeof I._final=="function"&&!M.destroyed?(M.pendingcb++,M.finalCalled=!0,process.nextTick(V,I,M)):(M.prefinished=!0,I.emit("prefinish")))}function ae(I,M){var P=oe(M);if(P&&(W(I,M),M.pendingcb===0&&(M.finished=!0,I.emit("finish"),M.autoDestroy))){var j=I._readableState;(!j||j.autoDestroy&&j.endEmitted)&&I.destroy()}return P}function fe(I,M,P){M.ending=!0,ae(I,M),P&&(M.finished?process.nextTick(P):I.once("finish",P)),M.ended=!0,I.writable=!1}function X(I,M,P){var j=I.entry;for(I.entry=null;j;){var ie=j.callback;M.pendingcb--,ie(P),j=j.next}M.corkedRequestsFree.next=I}return Object.defineProperty($.prototype,"destroyed",{enumerable:!1,get:function(){return this._writableState===void 0?!1:this._writableState.destroyed},set:function(M){this._writableState&&(this._writableState.destroyed=M)}}),$.prototype.destroy=l.destroy,$.prototype._undestroy=l.undestroy,$.prototype._destroy=function(I,M){M(I)},ha}var ma,To;function Oi(){if(To)return ma;To=1;var e=Object.keys||function(d){var p=[];for(var h in d)p.push(h);return p};ma=o;var t=ic(),i=ec();_n(o,t);for(var n=e(i.prototype),r=0;r<n.length;r++){var a=n[r];o.prototype[a]||(o.prototype[a]=i.prototype[a])}function o(d){if(!(this instanceof o))return new o(d);t.call(this,d),i.call(this,d),this.allowHalfOpen=!0,d&&(d.readable===!1&&(this.readable=!1),d.writable===!1&&(this.writable=!1),d.allowHalfOpen===!1&&(this.allowHalfOpen=!1,this.once("end",s)))}Object.defineProperty(o.prototype,"writableHighWaterMark",{enumerable:!1,get:function(){return this._writableState.highWaterMark}}),Object.defineProperty(o.prototype,"writableBuffer",{enumerable:!1,get:function(){return this._writableState&&this._writableState.getBuffer()}}),Object.defineProperty(o.prototype,"writableLength",{enumerable:!1,get:function(){return this._writableState.length}});function s(){this._writableState.ended||process.nextTick(l,this)}function l(d){d.end()}return Object.defineProperty(o.prototype,"destroyed",{enumerable:!1,get:function(){return this._readableState===void 0||this._writableState===void 0?!1:this._readableState.destroyed&&this._writableState.destroyed},set:function(p){this._readableState===void 0||this._writableState===void 0||(this._readableState.destroyed=p,this._writableState.destroyed=p)}}),ma}var ga={},Ao;function Co(){if(Ao)return ga;Ao=1;var e=Vl.Buffer,t=e.isEncoding||function(f){switch(f=""+f,f&&f.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return!0;default:return!1}};function i(f){if(!f)return"utf8";for(var k;;)switch(f){case"utf8":case"utf-8":return"utf8";case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return"utf16le";case"latin1":case"binary":return"latin1";case"base64":case"ascii":case"hex":return f;default:if(k)return;f=(""+f).toLowerCase(),k=!0}}function n(f){var k=i(f);if(typeof k!="string"&&(e.isEncoding===t||!t(f)))throw new Error("Unknown encoding: "+f);return k||f}ga.StringDecoder=r;function r(f){this.encoding=n(f);var k;switch(this.encoding){case"utf16le":this.text=h,this.end=m,k=4;break;case"utf8":this.fillLast=l,k=4;break;case"base64":this.text=v,this.end=y,k=3;break;default:this.write=b,this.end=w;return}this.lastNeed=0,this.lastTotal=0,this.lastChar=e.allocUnsafe(k)}r.prototype.write=function(f){if(f.length===0)return"";var k,x;if(this.lastNeed){if(k=this.fillLast(f),k===void 0)return"";x=this.lastNeed,this.lastNeed=0}else x=0;return x<f.length?k?k+this.text(f,x):this.text(f,x):k||""},r.prototype.end=p,r.prototype.text=d,r.prototype.fillLast=function(f){if(this.lastNeed<=f.length)return f.copy(this.lastChar,this.lastTotal-this.lastNeed,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal);f.copy(this.lastChar,this.lastTotal-this.lastNeed,0,f.length),this.lastNeed-=f.length};function a(f){return f<=127?0:f>>5===6?2:f>>4===14?3:f>>3===30?4:f>>6===2?-1:-2}function o(f,k,x){var L=k.length-1;if(L<x)return 0;var S=a(k[L]);return S>=0?(S>0&&(f.lastNeed=S-1),S):--L<x||S===-2?0:(S=a(k[L]),S>=0?(S>0&&(f.lastNeed=S-2),S):--L<x||S===-2?0:(S=a(k[L]),S>=0?(S>0&&(S===2?S=0:f.lastNeed=S-3),S):0))}function s(f,k,x){if((k[0]&192)!==128)return f.lastNeed=0,"�";if(f.lastNeed>1&&k.length>1){if((k[1]&192)!==128)return f.lastNeed=1,"�";if(f.lastNeed>2&&k.length>2&&(k[2]&192)!==128)return f.lastNeed=2,"�"}}function l(f){var k=this.lastTotal-this.lastNeed,x=s(this,f);if(x!==void 0)return x;if(this.lastNeed<=f.length)return f.copy(this.lastChar,k,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal);f.copy(this.lastChar,k,0,f.length),this.lastNeed-=f.length}function d(f,k){var x=o(this,f,k);if(!this.lastNeed)return f.toString("utf8",k);this.lastTotal=x;var L=f.length-(x-this.lastNeed);return f.copy(this.lastChar,0,L),f.toString("utf8",k,L)}function p(f){var k=f&&f.length?this.write(f):"";return this.lastNeed?k+"�":k}function h(f,k){if((f.length-k)%2===0){var x=f.toString("utf16le",k);if(x){var L=x.charCodeAt(x.length-1);if(L>=55296&&L<=56319)return this.lastNeed=2,this.lastTotal=4,this.lastChar[0]=f[f.length-2],this.lastChar[1]=f[f.length-1],x.slice(0,-1)}return x}return this.lastNeed=1,this.lastTotal=2,this.lastChar[0]=f[f.length-1],f.toString("utf16le",k,f.length-1)}function m(f){var k=f&&f.length?this.write(f):"";if(this.lastNeed){var x=this.lastTotal-this.lastNeed;return k+this.lastChar.toString("utf16le",0,x)}return k}function v(f,k){var x=(f.length-k)%3;return x===0?f.toString("base64",k):(this.lastNeed=3-x,this.lastTotal=3,x===1?this.lastChar[0]=f[f.length-1]:(this.lastChar[0]=f[f.length-2],this.lastChar[1]=f[f.length-1]),f.toString("base64",k,f.length-x))}function y(f){var k=f&&f.length?this.write(f):"";return this.lastNeed?k+this.lastChar.toString("base64",0,3-this.lastNeed):k}function b(f){return f.toString(this.encoding)}function w(f){return f&&f.length?this.write(f):""}return ga}var Lo=wi.codes.ERR_STREAM_PREMATURE_CLOSE;function cp(e){var t=!1;return function(){if(!t){t=!0;for(var i=arguments.length,n=new Array(i),r=0;r<i;r++)n[r]=arguments[r];e.apply(this,n)}}}function dp(){}function up(e){return e.setHeader&&typeof e.abort=="function"}function tc(e,t,i){if(typeof t=="function")return tc(e,null,t);t||(t={}),i=cp(i||dp);var n=t.readable||t.readable!==!1&&e.readable,r=t.writable||t.writable!==!1&&e.writable,a=function(){e.writable||s()},o=e._writableState&&e._writableState.finished,s=function(){r=!1,o=!0,n||i.call(e)},l=e._readableState&&e._readableState.endEmitted,d=function(){n=!1,l=!0,r||i.call(e)},p=function(y){i.call(e,y)},h=function(){var y;if(n&&!l)return(!e._readableState||!e._readableState.ended)&&(y=new Lo),i.call(e,y);if(r&&!o)return(!e._writableState||!e._writableState.ended)&&(y=new Lo),i.call(e,y)},m=function(){e.req.on("finish",s)};return up(e)?(e.on("complete",s),e.on("abort",h),e.req?m():e.on("request",m)):r&&!e._writableState&&(e.on("end",a),e.on("close",a)),e.on("end",d),e.on("finish",s),t.error!==!1&&e.on("error",p),e.on("close",h),function(){e.removeListener("complete",s),e.removeListener("abort",h),e.removeListener("request",m),e.req&&e.req.removeListener("finish",s),e.removeListener("end",a),e.removeListener("close",a),e.removeListener("finish",s),e.removeListener("end",d),e.removeListener("error",p),e.removeListener("close",h)}}var vs=tc,ya,$o;function pp(){if($o)return ya;$o=1;var e;function t(x,L,S){return L=i(L),L in x?Object.defineProperty(x,L,{value:S,enumerable:!0,configurable:!0,writable:!0}):x[L]=S,x}function i(x){var L=n(x,"string");return typeof L=="symbol"?L:String(L)}function n(x,L){if(typeof x!="object"||x===null)return x;var S=x[Symbol.toPrimitive];if(S!==void 0){var A=S.call(x,L);if(typeof A!="object")return A;throw new TypeError("@@toPrimitive must return a primitive value.")}return(L==="string"?String:Number)(x)}var r=vs,a=Symbol("lastResolve"),o=Symbol("lastReject"),s=Symbol("error"),l=Symbol("ended"),d=Symbol("lastPromise"),p=Symbol("handlePromise"),h=Symbol("stream");function m(x,L){return{value:x,done:L}}function v(x){var L=x[a];if(L!==null){var S=x[h].read();S!==null&&(x[d]=null,x[a]=null,x[o]=null,L(m(S,!1)))}}function y(x){process.nextTick(v,x)}function b(x,L){return function(S,A){x.then(function(){if(L[l]){S(m(void 0,!0));return}L[p](S,A)},A)}}var w=Object.getPrototypeOf(function(){}),f=Object.setPrototypeOf((e={get stream(){return this[h]},next:function(){var L=this,S=this[s];if(S!==null)return Promise.reject(S);if(this[l])return Promise.resolve(m(void 0,!0));if(this[h].destroyed)return new Promise(function(N,O){process.nextTick(function(){L[s]?O(L[s]):N(m(void 0,!0))})});var A=this[d],C;if(A)C=new Promise(b(A,this));else{var $=this[h].read();if($!==null)return Promise.resolve(m($,!1));C=new Promise(this[p])}return this[d]=C,C}},t(e,Symbol.asyncIterator,function(){return this}),t(e,"return",function(){var L=this;return new Promise(function(S,A){L[h].destroy(null,function(C){if(C){A(C);return}S(m(void 0,!0))})})}),e),w),k=function(L){var S,A=Object.create(f,(S={},t(S,h,{value:L,writable:!0}),t(S,a,{value:null,writable:!0}),t(S,o,{value:null,writable:!0}),t(S,s,{value:null,writable:!0}),t(S,l,{value:L._readableState.endEmitted,writable:!0}),t(S,p,{value:function($,N){var O=A[h].read();O?(A[d]=null,A[a]=null,A[o]=null,$(m(O,!1))):(A[a]=$,A[o]=N)},writable:!0}),S));return A[d]=null,r(L,function(C){if(C&&C.code!=="ERR_STREAM_PREMATURE_CLOSE"){var $=A[o];$!==null&&(A[d]=null,A[a]=null,A[o]=null,$(C)),A[s]=C;return}var N=A[a];N!==null&&(A[d]=null,A[a]=null,A[o]=null,N(m(void 0,!0))),A[l]=!0}),L.on("readable",y.bind(null,A)),A};return ya=k,ya}var va,Ro;function fp(){return Ro||(Ro=1,va=function(){throw new Error("Readable.from is not available in the browser")}),va}var ba,Io;function ic(){if(Io)return ba;Io=1,ba=N;var e;N.ReadableState=$,Pr.EventEmitter;var t=function(T,q){return T.listeners(q).length},i=Jl,n=vi.Buffer,r=(typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof self<"u"?self:{}).Uint8Array||function(){};function a(E){return n.from(E)}function o(E){return n.isBuffer(E)||E instanceof r}var s=bi,l;s&&s.debuglog?l=s.debuglog("stream"):l=function(){};var d=Ju(),p=Xl,h=Ql,m=h.getHighWaterMark,v=wi.codes,y=v.ERR_INVALID_ARG_TYPE,b=v.ERR_STREAM_PUSH_AFTER_EOF,w=v.ERR_METHOD_NOT_IMPLEMENTED,f=v.ERR_STREAM_UNSHIFT_AFTER_END_EVENT,k,x,L;_n(N,i);var S=p.errorOrDestroy,A=["error","close","destroy","pause","resume"];function C(E,T,q){if(typeof E.prependListener=="function")return E.prependListener(T,q);!E._events||!E._events[T]?E.on(T,q):Array.isArray(E._events[T])?E._events[T].unshift(q):E._events[T]=[q,E._events[T]]}function $(E,T,q){e=e||Oi(),E=E||{},typeof q!="boolean"&&(q=T instanceof e),this.objectMode=!!E.objectMode,q&&(this.objectMode=this.objectMode||!!E.readableObjectMode),this.highWaterMark=m(this,E,"readableHighWaterMark",q),this.buffer=new d,this.length=0,this.pipes=null,this.pipesCount=0,this.flowing=null,this.ended=!1,this.endEmitted=!1,this.reading=!1,this.sync=!0,this.needReadable=!1,this.emittedReadable=!1,this.readableListening=!1,this.resumeScheduled=!1,this.paused=!0,this.emitClose=E.emitClose!==!1,this.autoDestroy=!!E.autoDestroy,this.destroyed=!1,this.defaultEncoding=E.defaultEncoding||"utf8",this.awaitDrain=0,this.readingMore=!1,this.decoder=null,this.encoding=null,E.encoding&&(k||(k=Co().StringDecoder),this.decoder=new k(E.encoding),this.encoding=E.encoding)}function N(E){if(e=e||Oi(),!(this instanceof N))return new N(E);var T=this instanceof e;this._readableState=new $(E,this,T),this.readable=!0,E&&(typeof E.read=="function"&&(this._read=E.read),typeof E.destroy=="function"&&(this._destroy=E.destroy)),i.call(this)}Object.defineProperty(N.prototype,"destroyed",{enumerable:!1,get:function(){return this._readableState===void 0?!1:this._readableState.destroyed},set:function(T){this._readableState&&(this._readableState.destroyed=T)}}),N.prototype.destroy=p.destroy,N.prototype._undestroy=p.undestroy,N.prototype._destroy=function(E,T){T(E)},N.prototype.push=function(E,T){var q=this._readableState,ee;return q.objectMode?ee=!0:typeof E=="string"&&(T=T||q.defaultEncoding,T!==q.encoding&&(E=n.from(E,T),T=""),ee=!0),O(this,E,T,!1,ee)},N.prototype.unshift=function(E){return O(this,E,null,!0,!1)};function O(E,T,q,ee,ye){l("readableAddChunk",T);var se=E._readableState;if(T===null)se.reading=!1,ne(E,se);else{var me;if(ye||(me=U(se,T)),me)S(E,me);else if(se.objectMode||T&&T.length>0)if(typeof T!="string"&&!se.objectMode&&Object.getPrototypeOf(T)!==n.prototype&&(T=a(T)),ee)se.endEmitted?S(E,new f):G(E,se,T,!0);else if(se.ended)S(E,new b);else{if(se.destroyed)return!1;se.reading=!1,se.decoder&&!q?(T=se.decoder.write(T),se.objectMode||T.length!==0?G(E,se,T,!1):H(E,se)):G(E,se,T,!1)}else ee||(se.reading=!1,H(E,se))}return!se.ended&&(se.length<se.highWaterMark||se.length===0)}function G(E,T,q,ee){T.flowing&&T.length===0&&!T.sync?(T.awaitDrain=0,E.emit("data",q)):(T.length+=T.objectMode?1:q.length,ee?T.buffer.unshift(q):T.buffer.push(q),T.needReadable&&Q(E)),H(E,T)}function U(E,T){var q;return!o(T)&&typeof T!="string"&&T!==void 0&&!E.objectMode&&(q=new y("chunk",["string","Buffer","Uint8Array"],T)),q}N.prototype.isPaused=function(){return this._readableState.flowing===!1},N.prototype.setEncoding=function(E){k||(k=Co().StringDecoder);var T=new k(E);this._readableState.decoder=T,this._readableState.encoding=this._readableState.decoder.encoding;for(var q=this._readableState.buffer.head,ee="";q!==null;)ee+=T.write(q.data),q=q.next;return this._readableState.buffer.clear(),ee!==""&&this._readableState.buffer.push(ee),this._readableState.length=ee.length,this};var z=1073741824;function D(E){return E>=z?E=z:(E--,E|=E>>>1,E|=E>>>2,E|=E>>>4,E|=E>>>8,E|=E>>>16,E++),E}function K(E,T){return E<=0||T.length===0&&T.ended?0:T.objectMode?1:E!==E?T.flowing&&T.length?T.buffer.head.data.length:T.length:(E>T.highWaterMark&&(T.highWaterMark=D(E)),E<=T.length?E:T.ended?T.length:(T.needReadable=!0,0))}N.prototype.read=function(E){l("read",E),E=parseInt(E,10);var T=this._readableState,q=E;if(E!==0&&(T.emittedReadable=!1),E===0&&T.needReadable&&((T.highWaterMark!==0?T.length>=T.highWaterMark:T.length>0)||T.ended))return l("read: emitReadable",T.length,T.ended),T.length===0&&T.ended?P(this):Q(this),null;if(E=K(E,T),E===0&&T.ended)return T.length===0&&P(this),null;var ee=T.needReadable;l("need readable",ee),(T.length===0||T.length-E<T.highWaterMark)&&(ee=!0,l("length less than watermark",ee)),T.ended||T.reading?(ee=!1,l("reading or ended",ee)):ee&&(l("do read"),T.reading=!0,T.sync=!0,T.length===0&&(T.needReadable=!0),this._read(T.highWaterMark),T.sync=!1,T.reading||(E=K(q,T)));var ye;return E>0?ye=M(E,T):ye=null,ye===null?(T.needReadable=T.length<=T.highWaterMark,E=0):(T.length-=E,T.awaitDrain=0),T.length===0&&(T.ended||(T.needReadable=!0),q!==E&&T.ended&&P(this)),ye!==null&&this.emit("data",ye),ye};function ne(E,T){if(l("onEofChunk"),!T.ended){if(T.decoder){var q=T.decoder.end();q&&q.length&&(T.buffer.push(q),T.length+=T.objectMode?1:q.length)}T.ended=!0,T.sync?Q(E):(T.needReadable=!1,T.emittedReadable||(T.emittedReadable=!0,re(E)))}}function Q(E){var T=E._readableState;l("emitReadable",T.needReadable,T.emittedReadable),T.needReadable=!1,T.emittedReadable||(l("emitReadable",T.flowing),T.emittedReadable=!0,process.nextTick(re,E))}function re(E){var T=E._readableState;l("emitReadable_",T.destroyed,T.length,T.ended),!T.destroyed&&(T.length||T.ended)&&(E.emit("readable"),T.emittedReadable=!1),T.needReadable=!T.flowing&&!T.ended&&T.length<=T.highWaterMark,I(E)}function H(E,T){T.readingMore||(T.readingMore=!0,process.nextTick(oe,E,T))}function oe(E,T){for(;!T.reading&&!T.ended&&(T.length<T.highWaterMark||T.flowing&&T.length===0);){var q=T.length;if(l("maybeReadMore read 0"),E.read(0),q===T.length)break}T.readingMore=!1}N.prototype._read=function(E){S(this,new w("_read()"))},N.prototype.pipe=function(E,T){var q=this,ee=this._readableState;switch(ee.pipesCount){case 0:ee.pipes=E;break;case 1:ee.pipes=[ee.pipes,E];break;default:ee.pipes.push(E);break}ee.pipesCount+=1,l("pipe count=%d opts=%j",ee.pipesCount,T);var ye=(!T||T.end!==!1)&&E!==process.stdout&&E!==process.stderr,se=ye?Ye:le;ee.endEmitted?process.nextTick(se):q.once("end",se),E.on("unpipe",me);function me(g,c){l("onunpipe"),g===q&&c&&c.hasUnpiped===!1&&(c.hasUnpiped=!0,Ee())}function Ye(){l("onend"),E.end()}var De=V(q);E.on("drain",De);var lt=!1;function Ee(){l("cleanup"),E.removeListener("close",Je),E.removeListener("finish",$e),E.removeListener("drain",De),E.removeListener("error",Ve),E.removeListener("unpipe",me),q.removeListener("end",Ye),q.removeListener("end",le),q.removeListener("data",Ae),lt=!0,ee.awaitDrain&&(!E._writableState||E._writableState.needDrain)&&De()}q.on("data",Ae);function Ae(g){l("ondata");var c=E.write(g);l("dest.write",c),c===!1&&((ee.pipesCount===1&&ee.pipes===E||ee.pipesCount>1&&ie(ee.pipes,E)!==-1)&&!lt&&(l("false write response, pause",ee.awaitDrain),ee.awaitDrain++),q.pause())}function Ve(g){l("onerror",g),le(),E.removeListener("error",Ve),t(E,"error")===0&&S(E,g)}C(E,"error",Ve);function Je(){E.removeListener("finish",$e),le()}E.once("close",Je);function $e(){l("onfinish"),E.removeListener("close",Je),le()}E.once("finish",$e);function le(){l("unpipe"),q.unpipe(E)}return E.emit("pipe",q),ee.flowing||(l("pipe resume"),q.resume()),E};function V(E){return function(){var q=E._readableState;l("pipeOnDrain",q.awaitDrain),q.awaitDrain&&q.awaitDrain--,q.awaitDrain===0&&t(E,"data")&&(q.flowing=!0,I(E))}}N.prototype.unpipe=function(E){var T=this._readableState,q={hasUnpiped:!1};if(T.pipesCount===0)return this;if(T.pipesCount===1)return E&&E!==T.pipes?this:(E||(E=T.pipes),T.pipes=null,T.pipesCount=0,T.flowing=!1,E&&E.emit("unpipe",this,q),this);if(!E){var ee=T.pipes,ye=T.pipesCount;T.pipes=null,T.pipesCount=0,T.flowing=!1;for(var se=0;se<ye;se++)ee[se].emit("unpipe",this,{hasUnpiped:!1});return this}var me=ie(T.pipes,E);return me===-1?this:(T.pipes.splice(me,1),T.pipesCount-=1,T.pipesCount===1&&(T.pipes=T.pipes[0]),E.emit("unpipe",this,q),this)},N.prototype.on=function(E,T){var q=i.prototype.on.call(this,E,T),ee=this._readableState;return E==="data"?(ee.readableListening=this.listenerCount("readable")>0,ee.flowing!==!1&&this.resume()):E==="readable"&&!ee.endEmitted&&!ee.readableListening&&(ee.readableListening=ee.needReadable=!0,ee.flowing=!1,ee.emittedReadable=!1,l("on readable",ee.length,ee.reading),ee.length?Q(this):ee.reading||process.nextTick(ae,this)),q},N.prototype.addListener=N.prototype.on,N.prototype.removeListener=function(E,T){var q=i.prototype.removeListener.call(this,E,T);return E==="readable"&&process.nextTick(W,this),q},N.prototype.removeAllListeners=function(E){var T=i.prototype.removeAllListeners.apply(this,arguments);return(E==="readable"||E===void 0)&&process.nextTick(W,this),T};function W(E){var T=E._readableState;T.readableListening=E.listenerCount("readable")>0,T.resumeScheduled&&!T.paused?T.flowing=!0:E.listenerCount("data")>0&&E.resume()}function ae(E){l("readable nexttick read 0"),E.read(0)}N.prototype.resume=function(){var E=this._readableState;return E.flowing||(l("resume"),E.flowing=!E.readableListening,fe(this,E)),E.paused=!1,this};function fe(E,T){T.resumeScheduled||(T.resumeScheduled=!0,process.nextTick(X,E,T))}function X(E,T){l("resume",T.reading),T.reading||E.read(0),T.resumeScheduled=!1,E.emit("resume"),I(E),T.flowing&&!T.reading&&E.read(0)}N.prototype.pause=function(){return l("call pause flowing=%j",this._readableState.flowing),this._readableState.flowing!==!1&&(l("pause"),this._readableState.flowing=!1,this.emit("pause")),this._readableState.paused=!0,this};function I(E){var T=E._readableState;for(l("flow",T.flowing);T.flowing&&E.read()!==null;);}N.prototype.wrap=function(E){var T=this,q=this._readableState,ee=!1;E.on("end",function(){if(l("wrapped end"),q.decoder&&!q.ended){var me=q.decoder.end();me&&me.length&&T.push(me)}T.push(null)}),E.on("data",function(me){if(l("wrapped data"),q.decoder&&(me=q.decoder.write(me)),!(q.objectMode&&me==null)&&!(!q.objectMode&&(!me||!me.length))){var Ye=T.push(me);Ye||(ee=!0,E.pause())}});for(var ye in E)this[ye]===void 0&&typeof E[ye]=="function"&&(this[ye]=function(Ye){return function(){return E[Ye].apply(E,arguments)}}(ye));for(var se=0;se<A.length;se++)E.on(A[se],this.emit.bind(this,A[se]));return this._read=function(me){l("wrapped _read",me),ee&&(ee=!1,E.resume())},this},typeof Symbol=="function"&&(N.prototype[Symbol.asyncIterator]=function(){return x===void 0&&(x=pp()),x(this)}),Object.defineProperty(N.prototype,"readableHighWaterMark",{enumerable:!1,get:function(){return this._readableState.highWaterMark}}),Object.defineProperty(N.prototype,"readableBuffer",{enumerable:!1,get:function(){return this._readableState&&this._readableState.buffer}}),Object.defineProperty(N.prototype,"readableFlowing",{enumerable:!1,get:function(){return this._readableState.flowing},set:function(T){this._readableState&&(this._readableState.flowing=T)}}),N._fromList=M,Object.defineProperty(N.prototype,"readableLength",{enumerable:!1,get:function(){return this._readableState.length}});function M(E,T){if(T.length===0)return null;var q;return T.objectMode?q=T.buffer.shift():!E||E>=T.length?(T.decoder?q=T.buffer.join(""):T.buffer.length===1?q=T.buffer.first():q=T.buffer.concat(T.length),T.buffer.clear()):q=T.buffer.consume(E,T.decoder),q}function P(E){var T=E._readableState;l("endReadable",T.endEmitted),T.endEmitted||(T.ended=!0,process.nextTick(j,T,E))}function j(E,T){if(l("endReadableNT",E.endEmitted,E.length),!E.endEmitted&&E.length===0&&(E.endEmitted=!0,T.readable=!1,T.emit("end"),E.autoDestroy)){var q=T._writableState;(!q||q.autoDestroy&&q.finished)&&T.destroy()}}typeof Symbol=="function"&&(N.from=function(E,T){return L===void 0&&(L=fp()),L(N,E,T)});function ie(E,T){for(var q=0,ee=E.length;q<ee;q++)if(E[q]===T)return q;return-1}return ba}var nc=Ot,zr=wi.codes,hp=zr.ERR_METHOD_NOT_IMPLEMENTED,mp=zr.ERR_MULTIPLE_CALLBACK,gp=zr.ERR_TRANSFORM_ALREADY_TRANSFORMING,yp=zr.ERR_TRANSFORM_WITH_LENGTH_0,Or=Oi();_n(Ot,Or);function vp(e,t){var i=this._transformState;i.transforming=!1;var n=i.writecb;if(n===null)return this.emit("error",new mp);i.writechunk=null,i.writecb=null,t!=null&&this.push(t),n(e);var r=this._readableState;r.reading=!1,(r.needReadable||r.length<r.highWaterMark)&&this._read(r.highWaterMark)}function Ot(e){if(!(this instanceof Ot))return new Ot(e);Or.call(this,e),this._transformState={afterTransform:vp.bind(this),needTransform:!1,transforming:!1,writecb:null,writechunk:null,writeencoding:null},this._readableState.needReadable=!0,this._readableState.sync=!1,e&&(typeof e.transform=="function"&&(this._transform=e.transform),typeof e.flush=="function"&&(this._flush=e.flush)),this.on("prefinish",bp)}function bp(){var e=this;typeof this._flush=="function"&&!this._readableState.destroyed?this._flush(function(t,i){Mo(e,t,i)}):Mo(this,null,null)}Ot.prototype.push=function(e,t){return this._transformState.needTransform=!1,Or.prototype.push.call(this,e,t)};Ot.prototype._transform=function(e,t,i){i(new hp("_transform()"))};Ot.prototype._write=function(e,t,i){var n=this._transformState;if(n.writecb=i,n.writechunk=e,n.writeencoding=t,!n.transforming){var r=this._readableState;(n.needTransform||r.needReadable||r.length<r.highWaterMark)&&this._read(r.highWaterMark)}};Ot.prototype._read=function(e){var t=this._transformState;t.writechunk!==null&&!t.transforming?(t.transforming=!0,this._transform(t.writechunk,t.writeencoding,t.afterTransform)):t.needTransform=!0};Ot.prototype._destroy=function(e,t){Or.prototype._destroy.call(this,e,function(i){t(i)})};function Mo(e,t,i){if(t)return e.emit("error",t);if(i!=null&&e.push(i),e._writableState.length)throw new yp;if(e._transformState.transforming)throw new gp;return e.push(null)}var wp=yn,rc=nc;_n(yn,rc);function yn(e){if(!(this instanceof yn))return new yn(e);rc.call(this,e)}yn.prototype._transform=function(e,t,i){i(null,e)};var wa;function kp(e){var t=!1;return function(){t||(t=!0,e.apply(void 0,arguments))}}var ac=wi.codes,_p=ac.ERR_MISSING_ARGS,Sp=ac.ERR_STREAM_DESTROYED;function Po(e){if(e)throw e}function Ep(e){return e.setHeader&&typeof e.abort=="function"}function xp(e,t,i,n){n=kp(n);var r=!1;e.on("close",function(){r=!0}),wa===void 0&&(wa=vs),wa(e,{readable:t,writable:i},function(o){if(o)return n(o);r=!0,n()});var a=!1;return function(o){if(!r&&!a){if(a=!0,Ep(e))return e.abort();if(typeof e.destroy=="function")return e.destroy();n(o||new Sp("pipe"))}}}function Bo(e){e()}function Tp(e,t){return e.pipe(t)}function Ap(e){return!e.length||typeof e[e.length-1]!="function"?Po:e.pop()}function Cp(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];var n=Ap(t);if(Array.isArray(t[0])&&(t=t[0]),t.length<2)throw new _p("streams");var r,a=t.map(function(o,s){var l=s<t.length-1,d=s>0;return xp(o,l,d,function(p){r||(r=p),p&&a.forEach(Bo),!l&&(a.forEach(Bo),n(r))})});return t.reduce(Tp)}var Lp=Cp;(function(e,t){t=e.exports=ic(),t.Stream=t,t.Readable=t,t.Writable=ec(),t.Duplex=Oi(),t.Transform=nc,t.PassThrough=wp,t.finished=vs,t.pipeline=Lp})(Ua,Ua.exports);var sc=Ua.exports;function Do(e,t){for(const i in t)Object.defineProperty(e,i,{value:t[i],enumerable:!0,configurable:!0});return e}function $p(e,t,i){if(!e||typeof e=="string")throw new TypeError("Please pass an Error to err-code");i||(i={}),typeof t=="object"&&(i=t,t=""),t&&(i.code=t);try{return Do(e,i)}catch{i.message=e.message,i.stack=e.stack;const r=function(){};return r.prototype=Object.create(Object.getPrototypeOf(e)),Do(new r,i)}}var Rp=$p;const Ip=Ir("simple-peer"),oc=Bu,zo=ys,Mp=sc,ka=Br,ge=Rp,{Buffer:Pp}=vi,_a=64*1024,Bp=5*1e3,Dp=5*1e3;function Oo(e){return e.replace(/a=ice-options:trickle\s\n/g,"")}let Nr=class Wa extends Mp.Duplex{constructor(t){if(t=Object.assign({allowHalfOpen:!1},t),super(t),this._id=zo(4).toString("hex").slice(0,7),this._debug("new peer %o",t),this.channelName=t.initiator?t.channelName||zo(20).toString("hex"):null,this.initiator=t.initiator||!1,this.channelConfig=t.channelConfig||Wa.channelConfig,this.channelNegotiated=this.channelConfig.negotiated,this.config=Object.assign({},Wa.config,t.config),this.offerOptions=t.offerOptions||{},this.answerOptions=t.answerOptions||{},this.sdpTransform=t.sdpTransform||(i=>i),this.streams=t.streams||(t.stream?[t.stream]:[]),this.trickle=t.trickle!==void 0?t.trickle:!0,this.allowHalfTrickle=t.allowHalfTrickle!==void 0?t.allowHalfTrickle:!1,this.iceCompleteTimeout=t.iceCompleteTimeout||Bp,this.destroyed=!1,this.destroying=!1,this._connected=!1,this.remoteAddress=void 0,this.remoteFamily=void 0,this.remotePort=void 0,this.localAddress=void 0,this.localFamily=void 0,this.localPort=void 0,this._wrtc=t.wrtc&&typeof t.wrtc=="object"?t.wrtc:oc(),!this._wrtc)throw ge(typeof window>"u"?new Error("No WebRTC support: Specify `opts.wrtc` option in this environment"):new Error("No WebRTC support: Not a supported browser"),"ERR_WEBRTC_SUPPORT");this._pcReady=!1,this._channelReady=!1,this._iceComplete=!1,this._iceCompleteTimer=null,this._channel=null,this._pendingCandidates=[],this._isNegotiating=!1,this._firstNegotiation=!0,this._batchedNegotiation=!1,this._queuedNegotiation=!1,this._sendersAwaitingStable=[],this._senderMap=new Map,this._closingInterval=null,this._remoteTracks=[],this._remoteStreams=[],this._chunk=null,this._cb=null,this._interval=null;try{this._pc=new this._wrtc.RTCPeerConnection(this.config)}catch(i){this.destroy(ge(i,"ERR_PC_CONSTRUCTOR"));return}this._isReactNativeWebrtc=typeof this._pc._peerConnectionId=="number",this._pc.oniceconnectionstatechange=()=>{this._onIceStateChange()},this._pc.onicegatheringstatechange=()=>{this._onIceStateChange()},this._pc.onconnectionstatechange=()=>{this._onConnectionStateChange()},this._pc.onsignalingstatechange=()=>{this._onSignalingStateChange()},this._pc.onicecandidate=i=>{this._onIceCandidate(i)},typeof this._pc.peerIdentity=="object"&&this._pc.peerIdentity.catch(i=>{this.destroy(ge(i,"ERR_PC_PEER_IDENTITY"))}),this.initiator||this.channelNegotiated?this._setupData({channel:this._pc.createDataChannel(this.channelName,this.channelConfig)}):this._pc.ondatachannel=i=>{this._setupData(i)},this.streams&&this.streams.forEach(i=>{this.addStream(i)}),this._pc.ontrack=i=>{this._onTrack(i)},this._debug("initial negotiation"),this._needsNegotiation(),this._onFinishBound=()=>{this._onFinish()},this.once("finish",this._onFinishBound)}get bufferSize(){return this._channel&&this._channel.bufferedAmount||0}get connected(){return this._connected&&this._channel.readyState==="open"}address(){return{port:this.localPort,family:this.localFamily,address:this.localAddress}}signal(t){if(!this.destroying){if(this.destroyed)throw ge(new Error("cannot signal after peer is destroyed"),"ERR_DESTROYED");if(typeof t=="string")try{t=JSON.parse(t)}catch{t={}}this._debug("signal()"),t.renegotiate&&this.initiator&&(this._debug("got request to renegotiate"),this._needsNegotiation()),t.transceiverRequest&&this.initiator&&(this._debug("got request for transceiver"),this.addTransceiver(t.transceiverRequest.kind,t.transceiverRequest.init)),t.candidate&&(this._pc.remoteDescription&&this._pc.remoteDescription.type?this._addIceCandidate(t.candidate):this._pendingCandidates.push(t.candidate)),t.sdp&&this._pc.setRemoteDescription(new this._wrtc.RTCSessionDescription(t)).then(()=>{this.destroyed||(this._pendingCandidates.forEach(i=>{this._addIceCandidate(i)}),this._pendingCandidates=[],this._pc.remoteDescription.type==="offer"&&this._createAnswer())}).catch(i=>{this.destroy(ge(i,"ERR_SET_REMOTE_DESCRIPTION"))}),!t.sdp&&!t.candidate&&!t.renegotiate&&!t.transceiverRequest&&this.destroy(ge(new Error("signal() called with invalid signal data"),"ERR_SIGNALING"))}}_addIceCandidate(t){const i=new this._wrtc.RTCIceCandidate(t);this._pc.addIceCandidate(i).catch(n=>{!i.address||i.address.endsWith(".local")?void 0:this.destroy(ge(n,"ERR_ADD_ICE_CANDIDATE"))})}send(t){if(!this.destroying){if(this.destroyed)throw ge(new Error("cannot send after peer is destroyed"),"ERR_DESTROYED");this._channel.send(t)}}addTransceiver(t,i){if(!this.destroying){if(this.destroyed)throw ge(new Error("cannot addTransceiver after peer is destroyed"),"ERR_DESTROYED");if(this._debug("addTransceiver()"),this.initiator)try{this._pc.addTransceiver(t,i),this._needsNegotiation()}catch(n){this.destroy(ge(n,"ERR_ADD_TRANSCEIVER"))}else this.emit("signal",{type:"transceiverRequest",transceiverRequest:{kind:t,init:i}})}}addStream(t){if(!this.destroying){if(this.destroyed)throw ge(new Error("cannot addStream after peer is destroyed"),"ERR_DESTROYED");this._debug("addStream()"),t.getTracks().forEach(i=>{this.addTrack(i,t)})}}addTrack(t,i){if(this.destroying)return;if(this.destroyed)throw ge(new Error("cannot addTrack after peer is destroyed"),"ERR_DESTROYED");this._debug("addTrack()");const n=this._senderMap.get(t)||new Map;let r=n.get(i);if(!r)r=this._pc.addTrack(t,i),n.set(i,r),this._senderMap.set(t,n),this._needsNegotiation();else throw r.removed?ge(new Error("Track has been removed. You should enable/disable tracks that you want to re-add."),"ERR_SENDER_REMOVED"):ge(new Error("Track has already been added to that stream."),"ERR_SENDER_ALREADY_ADDED")}replaceTrack(t,i,n){if(this.destroying)return;if(this.destroyed)throw ge(new Error("cannot replaceTrack after peer is destroyed"),"ERR_DESTROYED");this._debug("replaceTrack()");const r=this._senderMap.get(t),a=r?r.get(n):null;if(!a)throw ge(new Error("Cannot replace track that was never added."),"ERR_TRACK_NOT_ADDED");i&&this._senderMap.set(i,r),a.replaceTrack!=null?a.replaceTrack(i):this.destroy(ge(new Error("replaceTrack is not supported in this browser"),"ERR_UNSUPPORTED_REPLACETRACK"))}removeTrack(t,i){if(this.destroying)return;if(this.destroyed)throw ge(new Error("cannot removeTrack after peer is destroyed"),"ERR_DESTROYED");this._debug("removeSender()");const n=this._senderMap.get(t),r=n?n.get(i):null;if(!r)throw ge(new Error("Cannot remove track that was never added."),"ERR_TRACK_NOT_ADDED");try{r.removed=!0,this._pc.removeTrack(r)}catch(a){a.name==="NS_ERROR_UNEXPECTED"?this._sendersAwaitingStable.push(r):this.destroy(ge(a,"ERR_REMOVE_TRACK"))}this._needsNegotiation()}removeStream(t){if(!this.destroying){if(this.destroyed)throw ge(new Error("cannot removeStream after peer is destroyed"),"ERR_DESTROYED");this._debug("removeSenders()"),t.getTracks().forEach(i=>{this.removeTrack(i,t)})}}_needsNegotiation(){this._debug("_needsNegotiation"),!this._batchedNegotiation&&(this._batchedNegotiation=!0,ka(()=>{this._batchedNegotiation=!1,this.initiator||!this._firstNegotiation?(this._debug("starting batched negotiation"),this.negotiate()):this._debug("non-initiator initial negotiation request discarded"),this._firstNegotiation=!1}))}negotiate(){if(!this.destroying){if(this.destroyed)throw ge(new Error("cannot negotiate after peer is destroyed"),"ERR_DESTROYED");this.initiator?this._isNegotiating?(this._queuedNegotiation=!0,this._debug("already negotiating, queueing")):(this._debug("start negotiation"),setTimeout(()=>{this._createOffer()},0)):this._isNegotiating?(this._queuedNegotiation=!0,this._debug("already negotiating, queueing")):(this._debug("requesting negotiation from initiator"),this.emit("signal",{type:"renegotiate",renegotiate:!0})),this._isNegotiating=!0}}destroy(t){this._destroy(t,()=>{})}_destroy(t,i){this.destroyed||this.destroying||(this.destroying=!0,this._debug("destroying (error: %s)",t&&(t.message||t)),ka(()=>{if(this.destroyed=!0,this.destroying=!1,this._debug("destroy (error: %s)",t&&(t.message||t)),this.readable=this.writable=!1,this._readableState.ended||this.push(null),this._writableState.finished||this.end(),this._connected=!1,this._pcReady=!1,this._channelReady=!1,this._remoteTracks=null,this._remoteStreams=null,this._senderMap=null,clearInterval(this._closingInterval),this._closingInterval=null,clearInterval(this._interval),this._interval=null,this._chunk=null,this._cb=null,this._onFinishBound&&this.removeListener("finish",this._onFinishBound),this._onFinishBound=null,this._channel){try{this._channel.close()}catch{}this._channel.onmessage=null,this._channel.onopen=null,this._channel.onclose=null,this._channel.onerror=null}if(this._pc){try{this._pc.close()}catch{}this._pc.oniceconnectionstatechange=null,this._pc.onicegatheringstatechange=null,this._pc.onsignalingstatechange=null,this._pc.onicecandidate=null,this._pc.ontrack=null,this._pc.ondatachannel=null}this._pc=null,this._channel=null,t&&this.emit("error",t),this.emit("close"),i()}))}_setupData(t){if(!t.channel)return this.destroy(ge(new Error("Data channel event is missing `channel` property"),"ERR_DATA_CHANNEL"));this._channel=t.channel,this._channel.binaryType="arraybuffer",typeof this._channel.bufferedAmountLowThreshold=="number"&&(this._channel.bufferedAmountLowThreshold=_a),this.channelName=this._channel.label,this._channel.onmessage=n=>{this._onChannelMessage(n)},this._channel.onbufferedamountlow=()=>{this._onChannelBufferedAmountLow()},this._channel.onopen=()=>{this._onChannelOpen()},this._channel.onclose=()=>{this._onChannelClose()},this._channel.onerror=n=>{const r=n.error instanceof Error?n.error:new Error(`Datachannel error: ${n.message} ${n.filename}:${n.lineno}:${n.colno}`);this.destroy(ge(r,"ERR_DATA_CHANNEL"))};let i=!1;this._closingInterval=setInterval(()=>{this._channel&&this._channel.readyState==="closing"?(i&&this._onChannelClose(),i=!0):i=!1},Dp)}_read(){}_write(t,i,n){if(this.destroyed)return n(ge(new Error("cannot write after peer is destroyed"),"ERR_DATA_CHANNEL"));if(this._connected){try{this.send(t)}catch(r){return this.destroy(ge(r,"ERR_DATA_CHANNEL"))}this._channel.bufferedAmount>_a?(this._debug("start backpressure: bufferedAmount %d",this._channel.bufferedAmount),this._cb=n):n(null)}else this._debug("write before connect"),this._chunk=t,this._cb=n}_onFinish(){if(this.destroyed)return;const t=()=>{setTimeout(()=>this.destroy(),1e3)};this._connected?t():this.once("connect",t)}_startIceCompleteTimeout(){this.destroyed||this._iceCompleteTimer||(this._debug("started iceComplete timeout"),this._iceCompleteTimer=setTimeout(()=>{this._iceComplete||(this._iceComplete=!0,this._debug("iceComplete timeout completed"),this.emit("iceTimeout"),this.emit("_iceComplete"))},this.iceCompleteTimeout))}_createOffer(){this.destroyed||this._pc.createOffer(this.offerOptions).then(t=>{if(this.destroyed)return;!this.trickle&&!this.allowHalfTrickle&&(t.sdp=Oo(t.sdp)),t.sdp=this.sdpTransform(t.sdp);const i=()=>{if(this.destroyed)return;const a=this._pc.localDescription||t;this._debug("signal"),this.emit("signal",{type:a.type,sdp:a.sdp})},n=()=>{this._debug("createOffer success"),!this.destroyed&&(this.trickle||this._iceComplete?i():this.once("_iceComplete",i))},r=a=>{this.destroy(ge(a,"ERR_SET_LOCAL_DESCRIPTION"))};this._pc.setLocalDescription(t).then(n).catch(r)}).catch(t=>{this.destroy(ge(t,"ERR_CREATE_OFFER"))})}_requestMissingTransceivers(){this._pc.getTransceivers&&this._pc.getTransceivers().forEach(t=>{!t.mid&&t.sender.track&&!t.requested&&(t.requested=!0,this.addTransceiver(t.sender.track.kind))})}_createAnswer(){this.destroyed||this._pc.createAnswer(this.answerOptions).then(t=>{if(this.destroyed)return;!this.trickle&&!this.allowHalfTrickle&&(t.sdp=Oo(t.sdp)),t.sdp=this.sdpTransform(t.sdp);const i=()=>{if(this.destroyed)return;const a=this._pc.localDescription||t;this._debug("signal"),this.emit("signal",{type:a.type,sdp:a.sdp}),this.initiator||this._requestMissingTransceivers()},n=()=>{this.destroyed||(this.trickle||this._iceComplete?i():this.once("_iceComplete",i))},r=a=>{this.destroy(ge(a,"ERR_SET_LOCAL_DESCRIPTION"))};this._pc.setLocalDescription(t).then(n).catch(r)}).catch(t=>{this.destroy(ge(t,"ERR_CREATE_ANSWER"))})}_onConnectionStateChange(){this.destroyed||this._pc.connectionState==="failed"&&this.destroy(ge(new Error("Connection failed."),"ERR_CONNECTION_FAILURE"))}_onIceStateChange(){if(this.destroyed)return;const t=this._pc.iceConnectionState,i=this._pc.iceGatheringState;this._debug("iceStateChange (connection: %s) (gathering: %s)",t,i),this.emit("iceStateChange",t,i),(t==="connected"||t==="completed")&&(this._pcReady=!0,this._maybeReady()),t==="failed"&&this.destroy(ge(new Error("Ice connection failed."),"ERR_ICE_CONNECTION_FAILURE")),t==="closed"&&this.destroy(ge(new Error("Ice connection closed."),"ERR_ICE_CONNECTION_CLOSED"))}getStats(t){const i=n=>(Object.prototype.toString.call(n.values)==="[object Array]"&&n.values.forEach(r=>{Object.assign(n,r)}),n);this._pc.getStats.length===0||this._isReactNativeWebrtc?this._pc.getStats().then(n=>{const r=[];n.forEach(a=>{r.push(i(a))}),t(null,r)},n=>t(n)):this._pc.getStats.length>0?this._pc.getStats(n=>{if(this.destroyed)return;const r=[];n.result().forEach(a=>{const o={};a.names().forEach(s=>{o[s]=a.stat(s)}),o.id=a.id,o.type=a.type,o.timestamp=a.timestamp,r.push(i(o))}),t(null,r)},n=>t(n)):t(null,[])}_maybeReady(){if(this._debug("maybeReady pc %s channel %s",this._pcReady,this._channelReady),this._connected||this._connecting||!this._pcReady||!this._channelReady)return;this._connecting=!0;const t=()=>{this.destroyed||this.getStats((i,n)=>{if(this.destroyed)return;i&&(n=[]);const r={},a={},o={};let s=!1;n.forEach(d=>{(d.type==="remotecandidate"||d.type==="remote-candidate")&&(r[d.id]=d),(d.type==="localcandidate"||d.type==="local-candidate")&&(a[d.id]=d),(d.type==="candidatepair"||d.type==="candidate-pair")&&(o[d.id]=d)});const l=d=>{s=!0;let p=a[d.localCandidateId];p&&(p.ip||p.address)?(this.localAddress=p.ip||p.address,this.localPort=Number(p.port)):p&&p.ipAddress?(this.localAddress=p.ipAddress,this.localPort=Number(p.portNumber)):typeof d.googLocalAddress=="string"&&(p=d.googLocalAddress.split(":"),this.localAddress=p[0],this.localPort=Number(p[1])),this.localAddress&&(this.localFamily=this.localAddress.includes(":")?"IPv6":"IPv4");let h=r[d.remoteCandidateId];h&&(h.ip||h.address)?(this.remoteAddress=h.ip||h.address,this.remotePort=Number(h.port)):h&&h.ipAddress?(this.remoteAddress=h.ipAddress,this.remotePort=Number(h.portNumber)):typeof d.googRemoteAddress=="string"&&(h=d.googRemoteAddress.split(":"),this.remoteAddress=h[0],this.remotePort=Number(h[1])),this.remoteAddress&&(this.remoteFamily=this.remoteAddress.includes(":")?"IPv6":"IPv4"),this._debug("connect local: %s:%s remote: %s:%s",this.localAddress,this.localPort,this.remoteAddress,this.remotePort)};if(n.forEach(d=>{d.type==="transport"&&d.selectedCandidatePairId&&l(o[d.selectedCandidatePairId]),(d.type==="googCandidatePair"&&d.googActiveConnection==="true"||(d.type==="candidatepair"||d.type==="candidate-pair")&&d.selected)&&l(d)}),!s&&(!Object.keys(o).length||Object.keys(a).length)){setTimeout(t,100);return}else this._connecting=!1,this._connected=!0;if(this._chunk){try{this.send(this._chunk)}catch(p){return this.destroy(ge(p,"ERR_DATA_CHANNEL"))}this._chunk=null,this._debug('sent chunk from "write before connect"');const d=this._cb;this._cb=null,d(null)}typeof this._channel.bufferedAmountLowThreshold!="number"&&(this._interval=setInterval(()=>this._onInterval(),150),this._interval.unref&&this._interval.unref()),this._debug("connect"),this.emit("connect")})};t()}_onInterval(){!this._cb||!this._channel||this._channel.bufferedAmount>_a||this._onChannelBufferedAmountLow()}_onSignalingStateChange(){this.destroyed||(this._pc.signalingState==="stable"&&(this._isNegotiating=!1,this._debug("flushing sender queue",this._sendersAwaitingStable),this._sendersAwaitingStable.forEach(t=>{this._pc.removeTrack(t),this._queuedNegotiation=!0}),this._sendersAwaitingStable=[],this._queuedNegotiation?(this._debug("flushing negotiation queue"),this._queuedNegotiation=!1,this._needsNegotiation()):(this._debug("negotiated"),this.emit("negotiated"))),this._debug("signalingStateChange %s",this._pc.signalingState),this.emit("signalingStateChange",this._pc.signalingState))}_onIceCandidate(t){this.destroyed||(t.candidate&&this.trickle?this.emit("signal",{type:"candidate",candidate:{candidate:t.candidate.candidate,sdpMLineIndex:t.candidate.sdpMLineIndex,sdpMid:t.candidate.sdpMid}}):!t.candidate&&!this._iceComplete&&(this._iceComplete=!0,this.emit("_iceComplete")),t.candidate&&this._startIceCompleteTimeout())}_onChannelMessage(t){if(this.destroyed)return;let i=t.data;i instanceof ArrayBuffer&&(i=Pp.from(i)),this.push(i)}_onChannelBufferedAmountLow(){if(this.destroyed||!this._cb)return;this._debug("ending backpressure: bufferedAmount %d",this._channel.bufferedAmount);const t=this._cb;this._cb=null,t(null)}_onChannelOpen(){this._connected||this.destroyed||(this._debug("on channel open"),this._channelReady=!0,this._maybeReady())}_onChannelClose(){this.destroyed||(this._debug("on channel close"),this.destroy())}_onTrack(t){this.destroyed||t.streams.forEach(i=>{this._debug("on track"),this.emit("track",t.track,i),this._remoteTracks.push({track:t.track,stream:i}),!this._remoteStreams.some(n=>n.id===i.id)&&(this._remoteStreams.push(i),ka(()=>{this._debug("on stream"),this.emit("stream",i)}))})}_debug(){const t=[].slice.call(arguments);t[0]="["+this._id+"] "+t[0],Ip.apply(null,t)}};Nr.WEBRTC_SUPPORT=!!oc();Nr.config={iceServers:[{urls:["stun:stun.l.google.com:19302","stun:global.stun.twilio.com:3478"]}],sdpSemantics:"unified-plan"};Nr.channelConfig={};var lc=Nr,bs={};(function(e){e.DEFAULT_ANNOUNCE_PEERS=50,e.MAX_ANNOUNCE_PEERS=82,e.binaryToHex=i=>(typeof i!="string"&&(i=String(i)),Buffer.from(i,"binary").toString("hex")),e.hexToBinary=i=>(typeof i!="string"&&(i=String(i)),Buffer.from(i,"hex").toString("binary")),e.parseUrl=i=>{const n=new URL(i.replace(/^udp:/,"http:"));return i.match(/^udp:/)&&Object.defineProperties(n,{href:{value:n.href.replace(/^http/,"udp")},protocol:{value:n.protocol.replace(/^http/,"udp")},origin:{value:n.origin.replace(/^http/,"udp")}}),n},Object.assign(e,bi)})(bs);var cc={exports:{}};(function(e){var t=function(){function i(m,v){return v!=null&&m instanceof v}var n;try{n=Map}catch{n=function(){}}var r;try{r=Set}catch{r=function(){}}var a;try{a=Promise}catch{a=function(){}}function o(m,v,y,b,w){typeof v=="object"&&(y=v.depth,b=v.prototype,w=v.includeNonEnumerable,v=v.circular);var f=[],k=[],x=typeof Buffer<"u";typeof v>"u"&&(v=!0),typeof y>"u"&&(y=1/0);function L(S,A){if(S===null)return null;if(A===0)return S;var C,$;if(typeof S!="object")return S;if(i(S,n))C=new n;else if(i(S,r))C=new r;else if(i(S,a))C=new a(function(Q,re){S.then(function(H){Q(L(H,A-1))},function(H){re(L(H,A-1))})});else if(o.__isArray(S))C=[];else if(o.__isRegExp(S))C=new RegExp(S.source,h(S)),S.lastIndex&&(C.lastIndex=S.lastIndex);else if(o.__isDate(S))C=new Date(S.getTime());else{if(x&&Buffer.isBuffer(S))return Buffer.allocUnsafe?C=Buffer.allocUnsafe(S.length):C=new Buffer(S.length),S.copy(C),C;i(S,Error)?C=Object.create(S):typeof b>"u"?($=Object.getPrototypeOf(S),C=Object.create($)):(C=Object.create(b),$=b)}if(v){var N=f.indexOf(S);if(N!=-1)return k[N];f.push(S),k.push(C)}i(S,n)&&S.forEach(function(Q,re){var H=L(re,A-1),oe=L(Q,A-1);C.set(H,oe)}),i(S,r)&&S.forEach(function(Q){var re=L(Q,A-1);C.add(re)});for(var O in S){var G;$&&(G=Object.getOwnPropertyDescriptor($,O)),!(G&&G.set==null)&&(C[O]=L(S[O],A-1))}if(Object.getOwnPropertySymbols)for(var U=Object.getOwnPropertySymbols(S),O=0;O<U.length;O++){var z=U[O],D=Object.getOwnPropertyDescriptor(S,z);D&&!D.enumerable&&!w||(C[z]=L(S[z],A-1),D.enumerable||Object.defineProperty(C,z,{enumerable:!1}))}if(w)for(var K=Object.getOwnPropertyNames(S),O=0;O<K.length;O++){var ne=K[O],D=Object.getOwnPropertyDescriptor(S,ne);D&&D.enumerable||(C[ne]=L(S[ne],A-1),Object.defineProperty(C,ne,{enumerable:!1}))}return C}return L(m,y)}o.clonePrototype=function(v){if(v===null)return null;var y=function(){};return y.prototype=v,new y};function s(m){return Object.prototype.toString.call(m)}o.__objToStr=s;function l(m){return typeof m=="object"&&s(m)==="[object Date]"}o.__isDate=l;function d(m){return typeof m=="object"&&s(m)==="[object Array]"}o.__isArray=d;function p(m){return typeof m=="object"&&s(m)==="[object RegExp]"}o.__isRegExp=p;function h(m){var v="";return m.global&&(v+="g"),m.ignoreCase&&(v+="i"),m.multiline&&(v+="m"),v}return o.__getRegExpFlags=h,o}();e.exports&&(e.exports=t)})(cc);var zp=cc.exports;const Op=Ir("simple-websocket"),Np=ys,Hp=sc,No=Br,cn=bi,sn=typeof cn!="function"?WebSocket:cn,Ho=64*1024;let dc=class extends Hp.Duplex{constructor(t={}){if(typeof t=="string"&&(t={url:t}),t=Object.assign({allowHalfOpen:!1},t),super(t),t.url==null&&t.socket==null)throw new Error("Missing required `url` or `socket` option");if(t.url!=null&&t.socket!=null)throw new Error("Must specify either `url` or `socket` option, not both");if(this._id=Np(4).toString("hex").slice(0,7),this._debug("new websocket: %o",t),this.connected=!1,this.destroyed=!1,this._chunk=null,this._cb=null,this._interval=null,t.socket)this.url=t.socket.url,this._ws=t.socket,this.connected=t.socket.readyState===sn.OPEN;else{this.url=t.url;try{typeof cn=="function"?this._ws=new sn(t.url,null,{...t,encoding:void 0}):this._ws=new sn(t.url)}catch(i){No(()=>this.destroy(i));return}}this._ws.binaryType="arraybuffer",t.socket&&this.connected?No(()=>this._handleOpen()):this._ws.onopen=()=>this._handleOpen(),this._ws.onmessage=i=>this._handleMessage(i),this._ws.onclose=()=>this._handleClose(),this._ws.onerror=i=>this._handleError(i),this._handleFinishBound=()=>this._handleFinish(),this.once("finish",this._handleFinishBound)}send(t){this._ws.send(t)}destroy(t){this._destroy(t,()=>{})}_destroy(t,i){if(!this.destroyed){if(this._debug("destroy (error: %s)",t&&(t.message||t)),this.readable=this.writable=!1,this._readableState.ended||this.push(null),this._writableState.finished||this.end(),this.connected=!1,this.destroyed=!0,clearInterval(this._interval),this._interval=null,this._chunk=null,this._cb=null,this._handleFinishBound&&this.removeListener("finish",this._handleFinishBound),this._handleFinishBound=null,this._ws){const n=this._ws,r=()=>{n.onclose=null};if(n.readyState===sn.CLOSED)r();else try{n.onclose=r,n.close()}catch{r()}n.onopen=null,n.onmessage=null,n.onerror=()=>{}}this._ws=null,t&&this.emit("error",t),this.emit("close"),i()}}_read(){}_write(t,i,n){if(this.destroyed)return n(new Error("cannot write after socket is destroyed"));if(this.connected){try{this.send(t)}catch(r){return this.destroy(r)}typeof cn!="function"&&this._ws.bufferedAmount>Ho?(this._debug("start backpressure: bufferedAmount %d",this._ws.bufferedAmount),this._cb=n):n(null)}else this._debug("write before connect"),this._chunk=t,this._cb=n}_handleOpen(){if(!(this.connected||this.destroyed)){if(this.connected=!0,this._chunk){try{this.send(this._chunk)}catch(i){return this.destroy(i)}this._chunk=null,this._debug('sent chunk from "write before connect"');const t=this._cb;this._cb=null,t(null)}typeof cn!="function"&&(this._interval=setInterval(()=>this._onInterval(),150),this._interval.unref&&this._interval.unref()),this._debug("connect"),this.emit("connect")}}_handleMessage(t){if(this.destroyed)return;let i=t.data;i instanceof ArrayBuffer&&(i=Buffer.from(i)),this.push(i)}_handleClose(){this.destroyed||(this._debug("on close"),this.destroy())}_handleError(t){this.destroy(new Error(`Error connecting to ${this.url}`))}_handleFinish(){if(this.destroyed)return;const t=()=>{setTimeout(()=>this.destroy(),1e3)};this.connected?t():this.once("connect",t)}_onInterval(){if(!this._cb||!this._ws||this._ws.bufferedAmount>Ho)return;this._debug("ending backpressure: bufferedAmount %d",this._ws.bufferedAmount);const t=this._cb;this._cb=null,t(null)}_debug(){const t=[].slice.call(arguments);t[0]="["+this._id+"] "+t[0],Op.apply(null,t)}};dc.WEBSOCKET_SUPPORT=!!sn;var qp=dc;const Fp=Pr;let Up=class extends Fp{constructor(t,i){super(),this.client=t,this.announceUrl=i,this.interval=null,this.destroyed=!1}setInterval(t){t==null&&(t=this.DEFAULT_ANNOUNCE_INTERVAL),clearInterval(this.interval),t&&(this.interval=setInterval(()=>{this.announce(this.client._defaultAnnounceOpts())},t),this.interval.unref&&this.interval.unref())}};var jp=Up;const Kp=zp,yt=Ir("bittorrent-tracker:websocket-tracker"),Wp=lc,Yp=ys,Gp=qp,Vp=bi,jt=bs,Jp=jp,It={},Xp=10*1e3,Zp=60*60*1e3,Qp=5*60*1e3,ef=50*1e3;let ws=class extends Jp{constructor(t,i){super(t,i),yt("new websocket tracker %s",i),this.peers={},this.socket=null,this.reconnecting=!1,this.retries=0,this.reconnectTimer=null,this.expectingResponse=!1,this._openSocket()}announce(t){if(this.destroyed||this.reconnecting)return;if(!this.socket.connected){this.socket.once("connect",()=>{this.announce(t)});return}const i=Object.assign({},t,{action:"announce",info_hash:this.client._infoHashBinary,peer_id:this.client._peerIdBinary});if(this._trackerId&&(i.trackerid=this._trackerId),t.event==="stopped"||t.event==="completed")this._send(i);else{const n=Math.min(t.numwant,5);this._generateOffers(n,r=>{i.numwant=n,i.offers=r,this._send(i)})}}scrape(t){if(this.destroyed||this.reconnecting)return;if(!this.socket.connected){this.socket.once("connect",()=>{this.scrape(t)});return}const n={action:"scrape",info_hash:Array.isArray(t.infoHash)&&t.infoHash.length>0?t.infoHash.map(r=>r.toString("binary")):t.infoHash&&t.infoHash.toString("binary")||this.client._infoHashBinary};this._send(n)}destroy(t=qo){if(this.destroyed)return t(null);this.destroyed=!0,clearInterval(this.interval),clearTimeout(this.reconnectTimer);for(const a in this.peers){const o=this.peers[a];clearTimeout(o.trackerTimeout),o.destroy()}if(this.peers=null,this.socket&&(this.socket.removeListener("connect",this._onSocketConnectBound),this.socket.removeListener("data",this._onSocketDataBound),this.socket.removeListener("close",this._onSocketCloseBound),this.socket.removeListener("error",this._onSocketErrorBound),this.socket=null),this._onSocketConnectBound=null,this._onSocketErrorBound=null,this._onSocketDataBound=null,this._onSocketCloseBound=null,It[this.announceUrl]&&(It[this.announceUrl].consumers-=1),It[this.announceUrl].consumers>0)return t();let i=It[this.announceUrl];delete It[this.announceUrl],i.on("error",qo),i.once("close",t);let n;if(!this.expectingResponse)return r();n=setTimeout(r,jt.DESTROY_TIMEOUT),i.once("data",r);function r(){n&&(clearTimeout(n),n=null),i.removeListener("data",r),i.destroy(),i=null}}_openSocket(){if(this.destroyed=!1,this.peers||(this.peers={}),this._onSocketConnectBound=()=>{this._onSocketConnect()},this._onSocketErrorBound=t=>{this._onSocketError(t)},this._onSocketDataBound=t=>{this._onSocketData(t)},this._onSocketCloseBound=()=>{this._onSocketClose()},this.socket=It[this.announceUrl],this.socket)It[this.announceUrl].consumers+=1,this.socket.connected&&this._onSocketConnectBound();else{const t=new URL(this.announceUrl);let i;this.client._proxyOpts&&(i=t.protocol==="wss:"?this.client._proxyOpts.httpsAgent:this.client._proxyOpts.httpAgent,!i&&this.client._proxyOpts.socksProxy&&(i=new Vp.Agent(Kp(this.client._proxyOpts.socksProxy),t.protocol==="wss:"))),this.socket=It[this.announceUrl]=new Gp({url:this.announceUrl,agent:i}),this.socket.consumers=1,this.socket.once("connect",this._onSocketConnectBound)}this.socket.on("data",this._onSocketDataBound),this.socket.once("close",this._onSocketCloseBound),this.socket.once("error",this._onSocketErrorBound)}_onSocketConnect(){this.destroyed||this.reconnecting&&(this.reconnecting=!1,this.retries=0,this.announce(this.client._defaultAnnounceOpts()))}_onSocketData(t){if(!this.destroyed){this.expectingResponse=!1;try{t=JSON.parse(t)}catch{this.client.emit("warning",new Error("Invalid tracker response"));return}t.action==="announce"?this._onAnnounceResponse(t):t.action==="scrape"?this._onScrapeResponse(t):this._onSocketError(new Error(`invalid action in WS response: ${t.action}`))}}_onAnnounceResponse(t){if(t.info_hash!==this.client._infoHashBinary){yt("ignoring websocket data from %s for %s (looking for %s: reused socket)",this.announceUrl,jt.binaryToHex(t.info_hash),this.client.infoHash);return}if(t.peer_id&&t.peer_id===this.client._peerIdBinary)return;yt("received %s from %s for %s",JSON.stringify(t),this.announceUrl,this.client.infoHash);const i=t["failure reason"];if(i)return this.client.emit("warning",new Error(i));const n=t["warning message"];n&&this.client.emit("warning",new Error(n));const r=t.interval||t["min interval"];r&&this.setInterval(r*1e3);const a=t["tracker id"];if(a&&(this._trackerId=a),t.complete!=null){const s=Object.assign({},t,{announce:this.announceUrl,infoHash:jt.binaryToHex(t.info_hash)});this.client.emit("update",s)}let o;if(t.offer&&t.peer_id&&(yt("creating peer (from remote offer)"),o=this._createPeer(),o.id=jt.binaryToHex(t.peer_id),o.once("signal",s=>{const l={action:"announce",info_hash:this.client._infoHashBinary,peer_id:this.client._peerIdBinary,to_peer_id:t.peer_id,answer:s,offer_id:t.offer_id};this._trackerId&&(l.trackerid=this._trackerId),this._send(l)}),this.client.emit("peer",o),o.signal(t.offer)),t.answer&&t.peer_id){const s=jt.binaryToHex(t.offer_id);o=this.peers[s],o?(o.id=jt.binaryToHex(t.peer_id),this.client.emit("peer",o),o.signal(t.answer),clearTimeout(o.trackerTimeout),o.trackerTimeout=null,delete this.peers[s]):yt(`got unexpected answer: ${JSON.stringify(t.answer)}`)}}_onScrapeResponse(t){t=t.files||{};const i=Object.keys(t);if(i.length===0){this.client.emit("warning",new Error("invalid scrape response"));return}i.forEach(n=>{const r=Object.assign(t[n],{announce:this.announceUrl,infoHash:jt.binaryToHex(n)});this.client.emit("scrape",r)})}_onSocketClose(){this.destroyed||(this.destroy(),this._startReconnectTimer())}_onSocketError(t){this.destroyed||(this.destroy(),this.client.emit("warning",t),this._startReconnectTimer())}_startReconnectTimer(){const t=Math.floor(Math.random()*Qp)+Math.min(Math.pow(2,this.retries)*Xp,Zp);this.reconnecting=!0,clearTimeout(this.reconnectTimer),this.reconnectTimer=setTimeout(()=>{this.retries++,this._openSocket()},t),this.reconnectTimer.unref&&this.reconnectTimer.unref(),yt("reconnecting socket in %s ms",t)}_send(t){if(this.destroyed)return;this.expectingResponse=!0;const i=JSON.stringify(t);yt("send %s",i),this.socket.send(i)}_generateOffers(t,i){const n=this,r=[];yt("generating %s offers",t);for(let s=0;s<t;++s)a();o();function a(){const s=Yp(20).toString("hex");yt("creating peer (from _generateOffers)");const l=n.peers[s]=n._createPeer({initiator:!0});l.once("signal",d=>{r.push({offer:d,offer_id:jt.hexToBinary(s)}),o()}),l.trackerTimeout=setTimeout(()=>{yt("tracker timeout: destroying peer"),l.trackerTimeout=null,delete n.peers[s],l.destroy()},ef),l.trackerTimeout.unref&&l.trackerTimeout.unref()}function o(){r.length===t&&(yt("generated %s offers",t),i(r))}}_createPeer(t){const i=this;t=Object.assign({trickle:!1,config:i.client._rtcConfig,wrtc:i.client._wrtc},t);const n=new Wp(t);return n.once("error",r),n.once("connect",a),n;function r(o){i.client.emit("warning",new Error(`Connection error: ${o.message}`)),n.destroy()}function a(){n.removeListener("error",r),n.removeListener("connect",a)}}};ws.prototype.DEFAULT_ANNOUNCE_INTERVAL=30*1e3;ws._socketPool=It;function qo(){}var tf=ws;const Kt=Ir("bittorrent-tracker:client"),nf=Pr,rf=Ru,af=Iu,sf=lc,of=Br,Fo=bs,Uo=bi,jo=bi,lf=tf;class Ya extends nf{constructor(t={}){if(super(),!t.peerId)throw new Error("Option `peerId` is required");if(!t.infoHash)throw new Error("Option `infoHash` is required");if(!t.announce)throw new Error("Option `announce` is required");if(!process.browser&&!t.port)throw new Error("Option `port` is required");this.peerId=typeof t.peerId=="string"?t.peerId:t.peerId.toString("hex"),this._peerIdBuffer=Buffer.from(this.peerId,"hex"),this._peerIdBinary=this._peerIdBuffer.toString("binary"),this.infoHash=typeof t.infoHash=="string"?t.infoHash.toLowerCase():t.infoHash.toString("hex"),this._infoHashBuffer=Buffer.from(this.infoHash,"hex"),this._infoHashBinary=this._infoHashBuffer.toString("binary"),Kt("new client %s",this.infoHash),this.destroyed=!1,this._port=t.port,this._getAnnounceOpts=t.getAnnounceOpts,this._rtcConfig=t.rtcConfig,this._userAgent=t.userAgent,this._proxyOpts=t.proxyOpts,this._wrtc=typeof t.wrtc=="function"?t.wrtc():t.wrtc;let i=typeof t.announce=="string"?[t.announce]:t.announce==null?[]:t.announce;i=i.map(a=>(a=a.toString(),a[a.length-1]==="/"&&(a=a.substring(0,a.length-1)),a)),i=Array.from(new Set(i));const n=this._wrtc!==!1&&(!!this._wrtc||sf.WEBRTC_SUPPORT),r=a=>{of(()=>{this.emit("warning",a)})};this._trackers=i.map(a=>{let o;try{o=Fo.parseUrl(a)}catch{return r(new Error(`Invalid tracker URL: ${a}`)),null}const s=o.port;if(s<0||s>65535)return r(new Error(`Invalid tracker port: ${a}`)),null;const l=o.protocol;return(l==="http:"||l==="https:")&&typeof Uo=="function"?new Uo(this,a):l==="udp:"&&typeof jo=="function"?new jo(this,a):(l==="ws:"||l==="wss:")&&n?l==="ws:"&&typeof window<"u"&&window.location.protocol==="https:"?(r(new Error(`Unsupported tracker protocol: ${a}`)),null):new lf(this,a):(r(new Error(`Unsupported tracker protocol: ${a}`)),null)}).filter(Boolean)}start(t){t=this._defaultAnnounceOpts(t),t.event="started",Kt("send `start` %o",t),this._announce(t),this._trackers.forEach(i=>{i.setInterval()})}stop(t){t=this._defaultAnnounceOpts(t),t.event="stopped",Kt("send `stop` %o",t),this._announce(t)}complete(t){t||(t={}),t=this._defaultAnnounceOpts(t),t.event="completed",Kt("send `complete` %o",t),this._announce(t)}update(t){t=this._defaultAnnounceOpts(t),t.event&&delete t.event,Kt("send `update` %o",t),this._announce(t)}_announce(t){this._trackers.forEach(i=>{i.announce(t)})}scrape(t){Kt("send `scrape`"),t||(t={}),this._trackers.forEach(i=>{i.scrape(t)})}setInterval(t){Kt("setInterval %d",t),this._trackers.forEach(i=>{i.setInterval(t)})}destroy(t){if(this.destroyed)return;this.destroyed=!0,Kt("destroy");const i=this._trackers.map(n=>r=>{n.destroy(r)});af(i,t),this._trackers=[],this._getAnnounceOpts=null}_defaultAnnounceOpts(t={}){return t.numwant==null&&(t.numwant=Fo.DEFAULT_ANNOUNCE_PEERS),t.uploaded==null&&(t.uploaded=0),t.downloaded==null&&(t.downloaded=0),this._getAnnounceOpts&&(t=Object.assign({},t,this._getAnnounceOpts())),t}}Ya.scrape=(e,t)=>{if(t=rf(t),!e.infoHash)throw new Error("Option `infoHash` is required");if(!e.announce)throw new Error("Option `announce` is required");const i=Object.assign({},e,{infoHash:Array.isArray(e.infoHash)?e.infoHash[0]:e.infoHash,peerId:Buffer.from("01234567890123456789"),port:6881}),n=new Ya(i);n.once("error",t),n.once("warning",t);let r=Array.isArray(e.infoHash)?e.infoHash.length:1;const a={};return n.on("scrape",o=>{if(r-=1,a[o.infoHash]=o,r===0){n.destroy();const s=Object.keys(a);s.length===1?t(null,a[s[0]]):t(null,a)}}),e.infoHash=Array.isArray(e.infoHash)?e.infoHash.map(o=>Buffer.from(o,"hex")):Buffer.from(e.infoHash,"hex"),n.scrape({infoHash:e.infoHash}),n};var cf=Ya;const df=Dl(cf);var uc={exports:{}},Be=uc.exports={},xt,Tt;function Ga(){throw new Error("setTimeout has not been defined")}function Va(){throw new Error("clearTimeout has not been defined")}(function(){try{typeof setTimeout=="function"?xt=setTimeout:xt=Ga}catch{xt=Ga}try{typeof clearTimeout=="function"?Tt=clearTimeout:Tt=Va}catch{Tt=Va}})();function pc(e){if(xt===setTimeout)return setTimeout(e,0);if((xt===Ga||!xt)&&setTimeout)return xt=setTimeout,setTimeout(e,0);try{return xt(e,0)}catch{try{return xt.call(null,e,0)}catch{return xt.call(this,e,0)}}}function uf(e){if(Tt===clearTimeout)return clearTimeout(e);if((Tt===Va||!Tt)&&clearTimeout)return Tt=clearTimeout,clearTimeout(e);try{return Tt(e)}catch{try{return Tt.call(null,e)}catch{return Tt.call(this,e)}}}var Dt=[],Ii=!1,fi,Yn=-1;function pf(){!Ii||!fi||(Ii=!1,fi.length?Dt=fi.concat(Dt):Yn=-1,Dt.length&&fc())}function fc(){if(!Ii){var e=pc(pf);Ii=!0;for(var t=Dt.length;t;){for(fi=Dt,Dt=[];++Yn<t;)fi&&fi[Yn].run();Yn=-1,t=Dt.length}fi=null,Ii=!1,uf(e)}}Be.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var i=1;i<arguments.length;i++)t[i-1]=arguments[i];Dt.push(new hc(e,t)),Dt.length===1&&!Ii&&pc(fc)};function hc(e,t){this.fun=e,this.array=t}hc.prototype.run=function(){this.fun.apply(null,this.array)};Be.title="browser";Be.browser=!0;Be.env={};Be.argv=[];Be.version="";Be.versions={};function qt(){}Be.on=qt;Be.addListener=qt;Be.once=qt;Be.off=qt;Be.removeListener=qt;Be.removeAllListeners=qt;Be.emit=qt;Be.prependListener=qt;Be.prependOnceListener=qt;Be.listeners=function(e){return[]};Be.binding=function(e){throw new Error("process.binding is not supported")};Be.cwd=function(){return"/"};Be.chdir=function(e){throw new Error("process.chdir is not supported")};Be.umask=function(){return 0};var ff=uc.exports;const hf=Dl(ff);globalThis.Buffer||(globalThis.Buffer=vi.Buffer);globalThis.process||(globalThis.process=hf);const mf=["wss://tracker.openwebtorrent.com","wss://tracker.btorrent.xyz","wss://tracker.webtorrent.dev","wss://tracker.files.fm:7073/announce","wss://spacetrackr.link:443/announce","wss://tracker.fastcast.nz:443/announce"],gf=160,mc="cinepulse.decision-room.owner.",yf="cinepulse.decision-room.autoplay";function xi(e=12){const t=new Uint8Array(e);return crypto.getRandomValues(t),Array.from(t,i=>i.toString(16).padStart(2,"0")).join("")}function qe(e=""){const t=String(e).replace(/\D/g,"");return t.length===6?t:""}function In(e,t="",i=null){if(!e?.id)return;const n=e.type==="tv"?"tv":"movie";try{sessionStorage.setItem(yf,JSON.stringify({id:String(e.id),type:n,roomCode:qe(t),season:n==="tv"?Math.max(1,Number(e.season)||1):null,episode:n==="tv"?Math.max(1,Number(e.episode)||1):null,initialSync:i||null,createdAt:Date.now()}))}catch{}window.dispatchEvent(new CustomEvent("cinepulse:decision-room-open"));const r=`#detail?type=${n}&id=${e.id}`;window.location.hash===r?window.dispatchEvent(new Event("hashchange")):window.location.hash=r}async function vf(e){const t=new TextEncoder().encode(`cinepulse-decision-room-v1:${e}`),i=await crypto.subtle.digest("SHA-256",t);return Array.from(new Uint8Array(i).slice(0,20),n=>n.toString(16).padStart(2,"0")).join("")}function bf(){const e=new Uint32Array(1);return crypto.getRandomValues(e),String(1e5+e[0]%9e5)}function wf(e){const t=qe(e);if(t)try{sessionStorage.setItem(`${mc}${t}`,"1")}catch{}}function kf(e){const t=qe(e);if(!t)return!1;try{return sessionStorage.getItem(`${mc}${t}`)==="1"}catch{return!1}}function _f(){try{return qe(new URL(window.location.href).searchParams.get("oda")||"")}catch{return""}}function gc(e){const t=new URL(window.location.href);return t.searchParams.set("oda",qe(e)),t.toString()}function Sf(){try{const e=new URL(window.location.href);e.searchParams.delete("oda"),history.replaceState(history.state,"",e.toString())}catch{}}function Ja(){const e=["Sinemasever","Gece Kuşu","Patlamış Mısır","Film Avcısı","Koltuğunda"],t=xi(2).toUpperCase();return`${e[Math.floor(Math.random()*e.length)]} ${t}`}class Ef{constructor({roomCode:t,nickname:i=Ja(),isHost:n=!1}){this.roomCode=qe(t),this.nickname=String(i||Ja()).slice(0,30),this.isHost=!!n,this.selfId=xi(10),this.client=null,this.peers=new Map,this.peerParticipantIds=new WeakMap,this.trackerPeerCount=1,this.announceTimer=null,this.participants=new Map([[this.selfId,{id:this.selfId,nickname:this.nickname,role:this.isHost?"moderator":"participant"}]]),this.listeners=new Set,this.receivedIds=new Set,this.cards=[],this.votes={},this.ratings={},this.suggestions=[],this.syncMode="smooth",this.silentVoting=!1,this.sharedPlayback=null,this.lastPlayerSync=null,this.roomFinish=null,this.chatMessages=[],this.roomSummary=null,this.playbackStartedAt=0,this.roomActivity={reactions:[],chats:[]},this.onPlayerSync=r=>{const a=r.detail;!this.isHost||!a||qe(a.roomCode)!==this.roomCode||!this.sharedPlayback||String(a.mediaId)!==String(this.sharedPlayback.id)||a.type!==this.sharedPlayback.type||(this.lastPlayerSync=a,this.broadcast({type:"player-sync",sync:a}))},window.addEventListener("cinepulse:player-sync",this.onPlayerSync),this.onRoomFinish=r=>{const a=r.detail;!this.isHost||!a||qe(a.roomCode)!==this.roomCode||(this.roomFinish=a,this.broadcast({type:"room-finish",finish:a}))},this.onRoomFinishVote=r=>{const a=r.detail;!a||qe(a.roomCode)!==this.roomCode||!a.optionId||this.broadcast({type:"room-finish-vote",vote:a})},this.onRoomFinishChoice=r=>{const a=r.detail;!this.isHost||!a||qe(a.roomCode)!==this.roomCode||(this.broadcast({type:"room-finish-choice",choice:a}),this.applyRoomFinishChoice(a))},this.onRoomReaction=r=>{const a=r.detail;if(!a||qe(a.roomCode)!==this.roomCode||!a.emoji)return;const o={...a,senderId:this.selfId,sentAt:Date.now()};this.recordRoomReaction(o),this.broadcast({type:"room-reaction",reaction:o})},window.addEventListener("cinepulse:room-finish",this.onRoomFinish),window.addEventListener("cinepulse:room-finish-vote",this.onRoomFinishVote),window.addEventListener("cinepulse:room-finish-choice",this.onRoomFinishChoice),window.addEventListener("cinepulse:room-reaction",this.onRoomReaction),this.onRoomChatSend=r=>{const a=r.detail,o=String(a?.text||"").trim().slice(0,240);if(!a||qe(a.roomCode)!==this.roomCode||!o)return;const s={id:String(a.id||`chat-${Date.now()}-${Math.random().toString(36).slice(2,8)}`),text:o,nickname:this.nickname,senderId:this.selfId,sentAt:Number(a.sentAt)||Date.now(),at:Math.max(0,Number(a.at)||0)};this.chatMessages=[...this.chatMessages,s].slice(-60),this.recordRoomChat(s),this.broadcast({type:"room-chat",chat:s})},window.addEventListener("cinepulse:room-chat-send",this.onRoomChatSend),this.onRoomPlaybackHealth=r=>{const a=r.detail;!a||qe(a.roomCode)!==this.roomCode||a.senderId===this.selfId||this.broadcast({type:"playback-health",health:{senderId:this.selfId,status:a.status==="buffering"?"buffering":"ready",bufferedAhead:Math.max(0,Number(a.bufferedAhead)||0),reportedAt:Date.now()}})},window.addEventListener("cinepulse:room-playback-health",this.onRoomPlaybackHealth),this.onRoomPlaybackProgress=r=>{const a=r.detail;!a||qe(a.roomCode)!==this.roomCode||this.broadcast({type:"playback-progress",progress:{senderId:this.selfId,nickname:this.nickname,time:Math.max(0,Number(a.time)||0),playing:!!a.playing,buffering:!!a.buffering,reportedAt:Date.now()}})},window.addEventListener("cinepulse:room-playback-progress",this.onRoomPlaybackProgress),this.onRoomPlaybackCheckpoint=r=>{const a=r.detail;!this.isHost||!a||qe(a.roomCode)!==this.roomCode||!a.targetId||this.broadcast({type:"playback-checkpoint",checkpoint:{targetId:a.targetId,action:a.action==="resume"?"resume":"hold",mediaId:String(a.mediaId||""),type:a.type==="tv"?"tv":"movie"}})},window.addEventListener("cinepulse:room-playback-checkpoint",this.onRoomPlaybackCheckpoint),this.onRoomPlaybackFinished=r=>{const a=r.detail;!a||qe(a.roomCode)!==this.roomCode||this.broadcast({type:"playback-finished",finished:{mediaId:String(a.mediaId||""),type:a.type==="tv"?"tv":"movie",season:Math.max(1,Number(a.season)||1),episode:Math.max(1,Number(a.episode)||1),nickname:this.nickname}})},window.addEventListener("cinepulse:room-playback-finished",this.onRoomPlaybackFinished),this.onRoomSummary=r=>{const a=r.detail;if(!this.isHost||!a||qe(a.roomCode)!==this.roomCode)return;const o=new Map;this.roomActivity.reactions.forEach(p=>o.set(p.emoji,(o.get(p.emoji)||0)+1));const s=Array.from(o.entries()).sort((p,h)=>h[1]-p[1])[0]||null,l=new Map;this.roomActivity.chats.forEach(p=>{const h=Math.floor(Math.max(0,Number(p.at)||0)/60)*60;l.set(h,(l.get(h)||0)+1)});const d=Array.from(l.entries()).sort((p,h)=>h[1]-p[1])[0]||null;this.roomSummary={roomCode:this.roomCode,mediaId:String(a.mediaId||this.sharedPlayback?.id||""),type:a.type==="tv"?"tv":"movie",participants:this.participants.size,watchedSeconds:Math.max(0,Number(a.seconds)||0),topReaction:s?{emoji:s[0],count:s[1]}:null,topTalkSecond:d?d[0]:null,chatCount:this.roomActivity.chats.length},this.broadcast({type:"room-summary",summary:this.roomSummary}),window.dispatchEvent(new CustomEvent("cinepulse:room-summary-remote",{detail:this.roomSummary}))},this.onRoomRhythm=r=>{const a=r.detail;!this.isHost||!a||qe(a.roomCode)!==this.roomCode||!a.targetId||this.broadcast({type:"room-rhythm",rhythm:a})},window.addEventListener("cinepulse:room-summary",this.onRoomSummary),window.addEventListener("cinepulse:room-rhythm",this.onRoomRhythm),this.destroyed=!1}applyRoomFinishChoice(t){if(this.roomFinish=null,t.action==="open"&&t.card?.id){this.sharedPlayback={id:t.card.id,type:t.card.type==="tv"?"tv":"movie",season:Math.max(1,Number(t.card.season)||1),episode:Math.max(1,Number(t.card.episode)||1)},this.lastPlayerSync=null,this.playbackStartedAt=Date.now(),this.roomSummary=null,this.roomActivity={reactions:[],chats:[]},this.emit(),In(t.card,this.roomCode);return}t.action==="close"&&(this.sharedPlayback=null,this.lastPlayerSync=null,window.dispatchEvent(new CustomEvent("cinepulse:decision-room-close-player",{detail:{roomCode:this.roomCode}}))),this.emit()}snapshot(){return{roomCode:this.roomCode,nickname:this.nickname,selfId:this.selfId,isHost:this.isHost,peerCount:this.peers.size,trackerPeerCount:this.trackerPeerCount,participants:Array.from(this.participants.values()),cards:this.cards,votes:this.votes,ratings:this.ratings,suggestions:this.suggestions,syncMode:this.syncMode,silentVoting:this.silentVoting,chatMessages:this.chatMessages,roomSummary:this.roomSummary}}subscribe(t){return this.listeners.add(t),t(this.snapshot()),()=>this.listeners.delete(t)}emit(){const t=this.snapshot();if(this.listeners.forEach(i=>i(t)),this.sharedPlayback){const i={roomCode:this.roomCode,isHost:this.isHost,selfId:this.selfId,participants:t.participants,peerCount:t.peerCount,chatMessages:t.chatMessages,syncMode:t.syncMode,silentVoting:t.silentVoting,roomSummary:t.roomSummary};window.__cinepulseDecisionRoomPresence=i,window.dispatchEvent(new CustomEvent("cinepulse:decision-room-presence",{detail:i}))}}async connect(){if(!this.roomCode)throw new Error("Geçersiz oda kodu.");const t=await vf(this.roomCode);this.destroyed||(this.client=new df({infoHash:t,peerId:xi(20),announce:mf,port:0,rtcConfig:{iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:global.stun.twilio.com:3478"}]}}),this.client.on("peer",i=>this.attachPeer(i)),this.client.on("update",i=>{const n=Number(i?.complete||0)+Number(i?.incomplete||0);this.trackerPeerCount=Math.max(1,n||1),this.emit()}),this.client.on("warning",()=>this.emit()),this.client.on("error",()=>this.emit()),this.client.start({numwant:5,left:1}),this.announceTimer=window.setInterval(()=>{try{this.client?.update({numwant:5,left:1})}catch{}},15e3),this.emit())}attachPeer(t){let i=t.id||xi(8);const n=()=>{this.destroyed||(i=t.id||i,this.peers.set(i,t),this.sendTo(t,{type:"hello",participant:{id:this.selfId,nickname:this.nickname,role:this.isHost?"moderator":"participant"},wantsState:!0}),this.emit())},r=s=>this.receive(s,t),a=()=>{this.peers.delete(i);const s=this.peerParticipantIds.get(t);s&&(Array.from(this.peers.values()).some(d=>this.peerParticipantIds.get(d)===s)||this.participants.delete(s)),this.emit()},o=()=>a();t.once("connect",n),t.on("data",r),t.once("close",a),t.once("error",o)}sendTo(t,i){try{if(!t||t.destroyed||!t.connected)return;t.send(JSON.stringify({...i,id:xi(10),senderId:this.selfId}))}catch{}}broadcast(t){const i={...t,id:xi(10),senderId:this.selfId};this.remember(i.id),this.peers.forEach(n=>{try{!n.destroyed&&n.connected&&n.send(JSON.stringify(i))}catch{}})}remember(t){this.receivedIds.add(t),this.receivedIds.size>gf&&this.receivedIds.delete(this.receivedIds.values().next().value)}receive(t,i){let n;try{n=JSON.parse(typeof t=="string"?t:new TextDecoder().decode(t))}catch{return}if(!(!n?.id||this.receivedIds.has(n.id)||n.senderId===this.selfId)){if(this.remember(n.id),n.type==="hello"&&n.participant?.id&&(this.participants.set(n.participant.id,n.participant),this.peerParticipantIds.set(i,n.participant.id),n.wantsState&&(this.sendTo(i,{type:"hello",participant:{id:this.selfId,nickname:this.nickname,role:this.isHost?"moderator":"participant"}}),this.isHost&&this.sendTo(i,{type:"state",cards:this.cards,votes:this.votes,ratings:this.ratings,suggestions:this.suggestions,syncMode:this.syncMode,silentVoting:this.silentVoting,participants:Array.from(this.participants.values()),sharedPlayback:this.sharedPlayback,lastPlayerSync:this.lastPlayerSync,roomFinish:this.roomFinish,chatMessages:this.chatMessages})),this.emit()),n.type==="state"&&Array.isArray(n.cards)&&!this.isHost){if(this.cards=n.cards.slice(0,12),this.votes=n.votes||{},this.ratings=n.ratings||{},this.suggestions=Array.isArray(n.suggestions)?n.suggestions.slice(-20):[],this.syncMode=n.syncMode==="strict"?"strict":"smooth",this.silentVoting=n.silentVoting===!0,Array.isArray(n.participants)&&n.participants.forEach(r=>{r?.id&&r?.nickname&&this.participants.set(r.id,r)}),n.sharedPlayback?.id){const r={id:n.sharedPlayback.id,type:n.sharedPlayback.type==="tv"?"tv":"movie",season:Math.max(1,Number(n.sharedPlayback.season)||1),episode:Math.max(1,Number(n.sharedPlayback.episode)||1)},a=!this.sharedPlayback||String(this.sharedPlayback.id)!==String(r.id)||this.sharedPlayback.type!==r.type||Number(this.sharedPlayback.season)!==Number(r.season)||Number(this.sharedPlayback.episode)!==Number(r.episode);this.sharedPlayback=r,this.lastPlayerSync=n.lastPlayerSync||null,this.roomFinish=n.roomFinish||null,this.chatMessages=Array.isArray(n.chatMessages)?n.chatMessages.slice(-60):[],a?In(r,this.roomCode,this.lastPlayerSync):this.lastPlayerSync&&window.dispatchEvent(new CustomEvent("cinepulse:player-sync-remote",{detail:this.lastPlayerSync}))}this.emit()}if(n.type==="cards"&&Array.isArray(n.cards)&&!this.isHost&&(this.cards=n.cards.slice(0,12),this.votes=n.votes||{},this.ratings=n.ratings||{},this.emit()),n.type==="suggestions"&&Array.isArray(n.suggestions)&&!this.isHost&&(this.suggestions=n.suggestions.slice(-20),this.emit()),n.type==="sync-mode"&&!this.isHost&&(this.syncMode=n.syncMode==="strict"?"strict":"smooth",this.emit()),n.type==="silent-voting"&&!this.isHost&&(this.silentVoting=n.enabled===!0,this.emit()),n.type==="suggest-card"&&this.isHost&&n.card?.id){const r=`${n.senderId}:${n.card.type}:${n.card.id}`;if(!this.cards.some(o=>String(o.id)===String(n.card.id)&&o.type===n.card.type)&&!this.suggestions.some(o=>o.id===r)){const o=this.participants.get(n.senderId);this.suggestions=[...this.suggestions,{id:r,card:n.card,nickname:o?.nickname||"Katılımcı"}].slice(-20),this.broadcast({type:"suggestions",suggestions:this.suggestions}),this.emit()}}if(n.type==="playback-health"&&this.isHost&&n.health?.senderId&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-health-remote",{detail:{...n.health,roomCode:this.roomCode,syncMode:this.syncMode}})),n.type==="playback-progress"&&this.isHost&&n.progress?.senderId&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-progress-remote",{detail:{...n.progress,roomCode:this.roomCode}})),n.type==="playback-checkpoint"&&n.checkpoint?.targetId&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-checkpoint-remote",{detail:{...n.checkpoint,roomCode:this.roomCode}})),n.type==="playback-finished"&&n.finished?.mediaId&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-finished-remote",{detail:{...n.finished,roomCode:this.roomCode,senderId:n.senderId}})),n.type==="vote"&&n.cardId&&n.senderId&&(this.votes={...this.votes,[n.cardId]:{...this.votes[n.cardId]||{},[n.senderId]:n.vote==="yes"?"yes":"no"}},this.emit()),n.type==="rating"&&n.cardId&&n.senderId){const r=Math.max(1,Math.min(5,Number(n.rating)||0));if(!r)return;this.ratings={...this.ratings,[n.cardId]:{...this.ratings[n.cardId]||{},[n.senderId]:r}},this.emit()}if(n.type==="open"&&n.card?.id&&(this.sharedPlayback={id:n.card.id,type:n.card.type==="tv"?"tv":"movie",season:Math.max(1,Number(n.card.season)||1),episode:Math.max(1,Number(n.card.episode)||1)},this.emit(),In(n.card,this.roomCode)),n.type==="player-sync"&&n.sync&&!this.isHost){const r=n.sync;if(!this.sharedPlayback||String(r.mediaId)!==String(this.sharedPlayback.id)||r.type!==this.sharedPlayback.type)return;this.lastPlayerSync=r,window.dispatchEvent(new CustomEvent("cinepulse:player-sync-remote",{detail:r}))}if(n.type==="room-finish"&&n.finish&&!this.isHost&&(this.roomFinish=n.finish,window.dispatchEvent(new CustomEvent("cinepulse:room-finish-remote",{detail:n.finish})),this.emit()),n.type==="room-finish-vote"&&n.vote){const r=n.vote;if(this.roomFinish?.id!==r.finishId)return;this.roomFinish={...this.roomFinish,votes:{...this.roomFinish.votes||{},[n.senderId]:r.optionId}},window.dispatchEvent(new CustomEvent("cinepulse:room-finish-vote-remote",{detail:this.roomFinish})),this.emit()}if(n.type==="room-finish-choice"&&n.choice&&!this.isHost&&this.applyRoomFinishChoice(n.choice),n.type==="room-reaction"&&n.reaction&&(this.recordRoomReaction(n.reaction),window.dispatchEvent(new CustomEvent("cinepulse:room-reaction-remote",{detail:n.reaction}))),n.type==="room-chat"&&n.chat?.text){const r={...n.chat,senderId:n.senderId||n.chat.senderId};this.chatMessages=[...this.chatMessages,r].slice(-60),this.recordRoomChat(r),window.dispatchEvent(new CustomEvent("cinepulse:room-chat-remote",{detail:r}))}n.type==="room-summary"&&n.summary&&(this.roomSummary=n.summary,window.dispatchEvent(new CustomEvent("cinepulse:room-summary-remote",{detail:n.summary})),this.emit()),n.type==="room-rhythm"&&n.rhythm?.targetId&&window.dispatchEvent(new CustomEvent("cinepulse:room-rhythm-remote",{detail:{...n.rhythm,roomCode:this.roomCode}}))}}setCards(t){this.isHost&&(this.cards=Array.isArray(t)?t.slice(0,12):[],this.votes={},this.ratings={},this.broadcast({type:"cards",cards:this.cards,votes:this.votes,ratings:this.ratings}),this.emit())}addCard(t){return!this.isHost||!t?.id||this.cards.length>=12||this.cards.some(i=>String(i.id)===String(t.id)&&i.type===t.type)?!1:(this.cards=[...this.cards,t],this.broadcast({type:"cards",cards:this.cards,votes:this.votes,ratings:this.ratings}),this.emit(),!0)}suggest(t){return this.isHost||!t?.id?!1:(this.broadcast({type:"suggest-card",card:t}),!0)}acceptSuggestion(t){if(!this.isHost)return!1;const i=this.suggestions.find(n=>n.id===t);return!i||this.cards.length>=12?!1:(this.suggestions=this.suggestions.filter(n=>n.id!==t),this.cards.some(n=>String(n.id)===String(i.card.id)&&n.type===i.card.type)||(this.cards=[...this.cards,i.card],this.broadcast({type:"cards",cards:this.cards,votes:this.votes,ratings:this.ratings})),this.broadcast({type:"suggestions",suggestions:this.suggestions}),this.emit(),!0)}dismissSuggestion(t){if(!this.isHost)return!1;const i=this.suggestions.filter(n=>n.id!==t);return i.length===this.suggestions.length?!1:(this.suggestions=i,this.broadcast({type:"suggestions",suggestions:this.suggestions}),this.emit(),!0)}setSyncMode(t){this.isHost&&(this.syncMode=t==="strict"?"strict":"smooth",this.broadcast({type:"sync-mode",syncMode:this.syncMode}),this.emit())}setSilentVoting(t){this.isHost&&(this.silentVoting=t===!0,this.broadcast({type:"silent-voting",enabled:this.silentVoting}),this.emit())}removeCard(t){if(!this.isHost||!t)return!1;const i=this.cards.filter(n=>String(n.id)!==String(t));return i.length===this.cards.length?!1:(this.cards=i,delete this.votes[t],delete this.ratings[t],this.broadcast({type:"cards",cards:this.cards,votes:this.votes,ratings:this.ratings}),this.emit(),!0)}vote(t,i){t&&(this.votes={...this.votes,[t]:{...this.votes[t]||{},[this.selfId]:i==="yes"?"yes":"no"}},this.broadcast({type:"vote",cardId:t,vote:i==="yes"?"yes":"no"}),this.emit())}rate(t,i){if(!t)return;const n=Math.max(1,Math.min(5,Number(i)||0));n&&(this.ratings={...this.ratings,[t]:{...this.ratings[t]||{},[this.selfId]:n}},this.broadcast({type:"rating",cardId:t,rating:n}),this.emit())}openForEveryone(t){if(!t?.id)return;this.sharedPlayback={id:t.id,type:t.type==="tv"?"tv":"movie",season:Math.max(1,Number(t.season)||1),episode:Math.max(1,Number(t.episode)||1)},this.playbackStartedAt=Date.now(),this.roomSummary=null,this.roomActivity={reactions:[],chats:[]},this.emit(),this.broadcast({type:"open",card:t});const i=()=>{this.destroyed||!this.sharedPlayback||this.broadcast({type:"state",cards:this.cards,votes:this.votes,ratings:this.ratings,suggestions:this.suggestions,syncMode:this.syncMode,silentVoting:this.silentVoting,participants:Array.from(this.participants.values()),sharedPlayback:this.sharedPlayback,lastPlayerSync:this.lastPlayerSync,roomFinish:this.roomFinish,chatMessages:this.chatMessages})};window.setTimeout(i,350),window.setTimeout(i,1400),In(t,this.roomCode)}recordRoomReaction(t){t?.emoji&&(this.roomActivity.reactions=[...this.roomActivity.reactions,{emoji:String(t.emoji),at:Math.max(0,Number(t.at)||0),senderId:t.senderId||""}].slice(-240))}recordRoomChat(t){t?.text&&(this.roomActivity.chats=[...this.roomActivity.chats,{at:Math.max(0,Number(t.at)||0),senderId:t.senderId||""}].slice(-120))}destroy(){this.destroyed=!0,window.removeEventListener("cinepulse:player-sync",this.onPlayerSync),window.removeEventListener("cinepulse:room-finish",this.onRoomFinish),window.removeEventListener("cinepulse:room-finish-vote",this.onRoomFinishVote),window.removeEventListener("cinepulse:room-finish-choice",this.onRoomFinishChoice),window.removeEventListener("cinepulse:room-reaction",this.onRoomReaction),window.removeEventListener("cinepulse:room-chat-send",this.onRoomChatSend),window.removeEventListener("cinepulse:room-playback-health",this.onRoomPlaybackHealth),window.removeEventListener("cinepulse:room-playback-progress",this.onRoomPlaybackProgress),window.removeEventListener("cinepulse:room-playback-checkpoint",this.onRoomPlaybackCheckpoint),window.removeEventListener("cinepulse:room-playback-finished",this.onRoomPlaybackFinished),window.removeEventListener("cinepulse:room-summary",this.onRoomSummary),window.removeEventListener("cinepulse:room-rhythm",this.onRoomRhythm),this.announceTimer&&window.clearInterval(this.announceTimer),this.announceTimer=null,this.peers.forEach(t=>{try{t.destroy()}catch{}}),this.peers.clear();try{this.client?.stop()}catch{}try{this.client?.destroy()}catch{}this.listeners.clear()}}let Nt=null,Ze=null,Ni=null,Hi=null;function yc(){Mi(!1);const e=document.createElement("div");e.className="decision-room-backdrop",document.body.appendChild(e),Nt=e,e.innerHTML=`
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
    </section>`,e.querySelector("#btn-close-decision-room").onclick=()=>Mi(!1),e.addEventListener("click",i=>{i.target===e&&Mi(!1)}),e.querySelector("#btn-create-decision-room").onclick=()=>fr({roomCode:bf(),isHost:!0});const t=()=>{const i=e.querySelector("#decision-room-code-input"),n=String(i?.value||"").replace(/\D/g,"").slice(0,6);if(n.length!==6){i?.focus(),Z("6 haneli oda kodunu yaz.","warning");return}fr({roomCode:n,isHost:!1})};e.querySelector("#btn-join-decision-room").onclick=t,e.querySelector("#decision-room-code-input").onkeydown=i=>{i.key==="Enter"&&t()},J(e)}function ut(e=""){const t=document.createElement("div");return t.textContent=String(e),t.innerHTML}function xf(e,t){const n=Object.values(t.votes[e.id]||{}).filter(a=>a==="yes").length,r=Math.max(1,t.participants.length);return{yes:n,needed:r,matched:n>=r}}function Mn(e,t){const i=Object.values(t.ratings?.[e.id]||{}).map(Number).filter(a=>a>=1&&a<=5),n=t.ratings?.[e.id]?.[t.selfId]||0;return{average:i.length?i.reduce((a,o)=>a+o,0)/i.length:0,count:i.length,mine:n}}function vc(){return`
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
    </section>`}function bc(e,t,i=""){const n=e.querySelector("#decision-room-status"),r=e.querySelector("#decision-room-peers"),a=e.querySelector("#decision-room-member-count"),o=e.querySelector("#decision-room-moderator-panel"),s=e.querySelector("#decision-room-signal-status"),l=e.querySelector("#decision-room-suggestion-panel"),d=e.querySelector("#decision-room-suggestions"),p=e.querySelector("#decision-room-silent-vote-summary"),h=e.querySelector("#decision-room-sync-mode"),m=e.querySelector("#decision-room-silent-voting"),v=e.querySelector("#decision-room-deck"),y=e.querySelector("#decision-room-link");n&&(n.textContent=i||(t.peerCount?"Arkadaşların bağlandı, oylar anlık geliyor.":"Oda eşleştiriliyor. Arkadaşına bağlantıyı gönder."));const b=Math.max(t.participants.length,t.trackerPeerCount||1);if(a&&(a.textContent=`${b} kişi`),o&&(o.hidden=!t.isHost),l&&(l.hidden=t.isHost),s&&t.isHost&&(s.textContent=b>t.participants.length?`${b} kişi tracker tarafından görüldü; doğrudan bağlantı hazırlanıyor.`:`${b} kişi aktif bağlantıda.`),r&&(r.innerHTML=t.isHost?t.participants.map(w=>`<span class="decision-room-person ${w.role==="moderator"?"is-moderator":""}"><i data-lucide="${w.role==="moderator"?"crown":"circle-user-round"}"></i>${ut(w.nickname)}${w.id===t.selfId?" (Sen)":""}</span>`).join(""):""),y&&(y.value=gc(t.roomCode)),h&&t.isHost){const w=t.syncMode==="strict";h.querySelector('input[value="smooth"]').checked=!w,h.querySelector('input[value="strict"]').checked=w;const f=h.querySelector("#decision-room-sync-help");f&&(f.textContent=w?"Yavaş bağlantı buffer’a düşünce herkes kısa süre bekler; süreler birlikte kalır.":"İlk açılışta en fazla 2 dakika fark için bir kez hizalar. Moderatörün oynat/duraklat ve sarma komutları herkese gider; otomatik durum paketleri buffer’ı bozmaz. Fark 1,5 dakikaya çıkarsa geride veya önde kalan taraf kısa süre bekler, diğeri yaklaşınca devam eder."),h.querySelectorAll('input[name="room-sync-mode"]').forEach(k=>{k.onchange=()=>Ze?.setSyncMode(k.value)})}if(m&&t.isHost&&(m.checked=t.silentVoting===!0,m.onchange=()=>Ze?.setSilentVoting(m.checked)),d&&t.isHost&&(d.innerHTML=t.suggestions?.length?`<strong>Katılımcı önerileri</strong>${t.suggestions.map(w=>`<div class="decision-room-suggestion"><span><b>${ut(w.card.title||w.card.name||"İsimsiz içerik")}</b><small>${ut(w.nickname)} önerdi</small></span><button data-accept-suggestion="${ut(w.id)}">Ekle</button><button data-dismiss-suggestion="${ut(w.id)}" aria-label="Reddet">×</button></div>`).join("")}`:"",d.querySelectorAll("[data-accept-suggestion]").forEach(w=>{w.onclick=()=>Ze?.acceptSuggestion(w.dataset.acceptSuggestion)}),d.querySelectorAll("[data-dismiss-suggestion]").forEach(w=>{w.onclick=()=>Ze?.dismissSuggestion(w.dataset.dismissSuggestion)})),p&&t.isHost&&t.silentVoting){const w=t.cards.map(f=>({card:f,rating:Mn(f,t)})).filter(f=>f.rating.count>0).sort((f,k)=>k.rating.average-f.rating.average||k.rating.count-f.rating.count).slice(0,3);p.innerHTML=w.length?`<strong><i data-lucide="shield-check"></i> Sessiz oylama özeti</strong>${w.map(({card:f,rating:k},x)=>`<div><b>${x+1}</b><span>${ut(f.title||f.name||"İsimsiz içerik")}</span><em>★ ${k.average.toFixed(1)} · ${k.count} gizli oy</em></div>`).join("")}`:'<strong><i data-lucide="shield-check"></i> Sessiz oylama</strong><small>Katılımcıların yıldızları yalnızca burada ortak sonuç olarak görünür.</small>'}else p&&(p.innerHTML="");if(v){if(!t.cards.length)v.innerHTML='<div class="decision-room-empty"><i data-lucide="sparkles"></i><strong>Adaylar hazırlanıyor</strong><span>Oda sahibi ortak izleme listesi oluşturuyor.</span></div>';else{const w=t.isHost&&t.silentVoting?[...t.cards].sort((f,k)=>Mn(k,t).average-Mn(f,t).average):t.cards;v.innerHTML=w.map(f=>{const k=f.title||f.name||"İsimsiz içerik",x=f.type==="tv"?`Dizi · S${Math.max(1,Number(f.season)||1)} B${Math.max(1,Number(f.episode)||1)}`:"Film",L=xf(f,t),S=t.votes[f.id]?.[t.selfId],A=Mn(f,t),C=[1,2,3,4,5].map($=>`<button data-room-rating="${$}" data-card-id="${f.id}" class="${A.mine>=$?"active-star":""}" aria-label="${$} yıldız"><i data-lucide="star"></i></button>`).join("");return`<article class="decision-room-card ${L.matched?"matched":""}">
          <img src="${it(f.poster_path,Ke.POSTER_SMALL)}" alt="" loading="lazy" />
          <div class="decision-room-card-body">
            <span>${x} · ★ ${(Number(f.vote_average)||0).toFixed(1)}</span>
            <strong>${ut(k)}</strong>
            <small>${L.matched?"Herkes izlemek istiyor!":`${L.yes}/${L.needed} kişi izlemek istiyor`}</small>
            <div class="decision-room-rating"><span>${t.silentVoting?t.isHost?A.count?`Gizli puan ${A.average.toFixed(1)} · ${A.count} oy`:"Gizli oy bekleniyor":A.mine?"Puanın kaydedildi":"Gizli puan ver":A.count?`Ortak puan ${A.average.toFixed(1)} · ${A.count} oy`:"Puan ver"}</span><div>${C}</div></div>
            <div class="decision-room-votes">
              <button data-room-vote="yes" data-card-id="${f.id}" class="${S==="yes"?"active-yes":""}"><i data-lucide="heart"></i> İzle</button>
              <button data-room-vote="no" data-card-id="${f.id}" class="${S==="no"?"active-no":""}"><i data-lucide="skip-forward"></i> Geç</button>
              ${L.matched?`<button data-room-open="${f.id}" class="decision-room-open"><i data-lucide="play"></i> Birlikte Aç</button>`:""}
              ${t.isHost?`<button data-room-remove="${f.id}" class="decision-room-remove" aria-label="${ut(k)} içeriğini odadan kaldır"><i data-lucide="trash-2"></i> Kaldır</button>`:""}
            </div>
          </div>
        </article>`}).join("")}v.querySelectorAll("[data-room-vote]").forEach(w=>{w.onclick=()=>Ze?.vote(w.dataset.cardId,w.dataset.roomVote)}),v.querySelectorAll("[data-room-rating]").forEach(w=>{w.onclick=()=>Ze?.rate(w.dataset.cardId,w.dataset.roomRating)}),v.querySelectorAll("[data-room-open]").forEach(w=>{w.onclick=()=>{const f=t.cards.find(k=>String(k.id)===w.dataset.roomOpen);f&&Ze?.openForEveryone(f)}}),v.querySelectorAll("[data-room-remove]").forEach(w=>{w.onclick=()=>{Ze?.removeCard(w.dataset.roomRemove)&&Z("İçerik odadan kaldırıldı.","success")}})}J(e)}function pr(e){return{id:e.id,type:e.type||e.media_type||(e.first_air_date?"tv":"movie"),title:e.title,name:e.name,poster_path:e.poster_path,vote_average:e.vote_average,season:e.type==="tv"||e.media_type==="tv"?Math.max(1,Number(e.season)||1):null,episode:e.type==="tv"||e.media_type==="tv"?Math.max(1,Number(e.episode)||1):null}}function wc(e,t){const i=e.querySelector("#decision-room-content-form"),n=e.querySelector("#decision-room-content-search"),r=e.querySelector("#decision-room-content-results");if(!i||!n||!r||!t.isHost)return;let a=null,o=0;const s=async()=>{const l=n.value.trim();if(l.length<2){r.innerHTML="";return}const d=++o;r.innerHTML='<span class="decision-room-search-status">Aranıyor…</span>';const p=await ds(l).catch(()=>[]);if(d!==o||n.value.trim()!==l)return;const h=p.filter(m=>m?.id&&(m.type==="movie"||m.type==="tv")).slice(0,5);r.innerHTML=h.length?h.map(m=>{const v=pr(m),y=v.type==="tv"?'<span class="decision-room-episode-choice" aria-label="Bölüm seçimi"><label>Sezon <input data-add-season type="number" min="1" value="1" inputmode="numeric" /></label><label>Bölüm <input data-add-episode type="number" min="1" value="1" inputmode="numeric" /></label></span>':"";return`<div class="decision-room-search-result"><button type="button" data-add-room-card="${v.id}" data-add-room-type="${v.type}" title="Odaya ekle"><img src="${it(v.poster_path,Ke.POSTER_SMALL)}" alt="" /><span><strong>${ut(v.title||v.name||"İsimsiz içerik")}</strong><small>${v.type==="tv"?"Dizi":"Film"} · ★ ${(Number(v.vote_average)||0).toFixed(1)}</small></span><i data-lucide="plus"></i></button>${y}</div>`}).join(""):'<span class="decision-room-search-status">Sonuç bulunamadı.</span>',r.querySelectorAll("[data-add-room-card]").forEach(m=>{m.onclick=()=>{const v=h.find(f=>String(f.id)===m.dataset.addRoomCard&&(f.type||f.media_type)===m.dataset.addRoomType);if(!v)return;const y=m.closest(".decision-room-search-result"),b=Number(y?.querySelector("[data-add-season]")?.value)||1,w=Number(y?.querySelector("[data-add-episode]")?.value)||1;t.addCard(pr({...v,season:b,episode:w}))?(n.value="",r.innerHTML="",Z("İçerik odaya eklendi.","success")):Z("Bu içerik zaten listede veya oda dolu.","warning")}}),J(r)};i.onsubmit=l=>{l.preventDefault(),window.clearTimeout(a),s()},n.oninput=()=>{if(window.clearTimeout(a),n.value.trim().length<2){o+=1,r.innerHTML="";return}a=window.setTimeout(s,220)}}function kc(e,t){const i=e.querySelector("#decision-room-suggestion-form"),n=e.querySelector("#decision-room-suggestion-search"),r=e.querySelector("#decision-room-suggestion-results");if(!i||!n||!r||t.isHost)return;let a=null,o=0;const s=async()=>{const l=n.value.trim();if(l.length<2)return;const d=++o;r.innerHTML='<span class="decision-room-search-status">Aranıyor…</span>';const p=await ds(l).catch(()=>[]);if(d!==o||n.value.trim()!==l)return;const h=p.filter(m=>m?.id&&(m.type==="movie"||m.type==="tv")).slice(0,5);r.innerHTML=h.map(m=>`<div class="decision-room-search-result"><button type="button" data-suggest-card="${m.id}" data-suggest-type="${m.type||m.media_type}"><img src="${it(m.poster_path,Ke.POSTER_SMALL)}" alt="" /><span><strong>${ut(m.title||m.name||"İsimsiz içerik")}</strong><small>${(m.type||m.media_type)==="tv"?"Dizi":"Film"} · Moderatöre öner</small></span><i data-lucide="send"></i></button></div>`).join("")||'<span class="decision-room-search-status">Sonuç bulunamadı.</span>',r.querySelectorAll("[data-suggest-card]").forEach(m=>{m.onclick=()=>{const v=h.find(y=>String(y.id)===m.dataset.suggestCard&&String(y.type||y.media_type)===m.dataset.suggestType);!v||!t.suggest(pr(v))||(n.value="",r.innerHTML="",Z("Önerin moderatöre gönderildi.","success"))}}),J(r)};i.onsubmit=l=>{l.preventDefault(),window.clearTimeout(a),s()},n.oninput=()=>{if(window.clearTimeout(a),n.value.trim().length<2){o+=1,r.innerHTML="";return}a=window.setTimeout(s,220)}}async function _c(e,t){const i=t.querySelector("#decision-room-status");i&&(i.textContent="Ortak adaylar hazırlanıyor…");try{const r=(await El("all","week")||[]).filter(a=>a?.id&&(a.media_type==="movie"||a.media_type==="tv"||a.type==="movie"||a.type==="tv")).slice(0,8).map(pr);if(!r.length)throw new Error("Aday bulunamadı.");e.setCards(r)}catch{i&&(i.textContent="Adaylar şu an yüklenemedi. Biraz sonra yeniden dene.")}}async function fr({roomCode:e=_f(),isHost:t=!1}={}){if(!e){yc();return}Mi(!1);const i=e;t&&wf(i);const n=!!(t||kf(i)),r=Ja(),a=document.createElement("div");if(a.id="decision-room-modal-root",a.className="decision-room-backdrop",document.body.appendChild(a),Nt=a,n)try{history.replaceState(history.state,"",gc(i))}catch{}a.innerHTML=`
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
      ${vc()}
      <div id="decision-room-deck" class="decision-room-deck"></div>
      <footer class="decision-room-footer"><span>Oda kapanınca oylar silinir.</span><button id="btn-refresh-decision-cards"><i data-lucide="refresh-cw"></i> Yeni adaylar</button></footer>
    </section>`;const o=()=>Mi(!0);a.querySelector("#btn-close-decision-room").addEventListener("click",o),a.addEventListener("click",d=>{d.target===a&&o()});const s=()=>Sc();window.addEventListener("cinepulse:decision-room-open",s,{once:!0}),Hi=()=>window.removeEventListener("cinepulse:decision-room-open",s);const l=new Ef({roomCode:i,nickname:r,isHost:n});Ze=l,Ni=l.subscribe(d=>bc(a,d)),await l.connect(),!(Ze!==l||Nt!==a)&&(wc(a,l),kc(a,l),a.querySelector("#btn-copy-decision-room").onclick=async()=>{try{await navigator.clipboard.writeText(i),Z("Oda kodu kopyalandı.","success")}catch{const p=a.querySelector("#decision-room-code"),h=document.createRange();h.selectNodeContents(p),window.getSelection()?.removeAllRanges(),window.getSelection()?.addRange(h),document.execCommand("copy"),window.getSelection()?.removeAllRanges(),Z("Oda kodu kopyalandı.","success")}},a.querySelector("#btn-refresh-decision-cards").onclick=()=>_c(Ze,a),J(a))}function Mi(e=!0){Hi?.(),Hi=null,Ni?.(),Ni=null,Ze?.destroy(),Ze=null,Nt?.remove(),Nt=null,e&&Sf()}function um(){if(Nt)return;if(!Ze){yc();return}const e=Ze,t=document.createElement("div");t.id="decision-room-modal-root",t.className="decision-room-backdrop",document.body.appendChild(t),Nt=t,t.innerHTML=`
    <section class="decision-room-dialog" role="dialog" aria-modal="true" aria-label="Ortak Karar Odası">
      <button id="btn-close-decision-room" class="decision-room-close" aria-label="Kapat"><i data-lucide="x"></i></button>
      <header class="decision-room-header"><div class="decision-room-icon"><i data-lucide="users-round"></i></div><div><h2>Birlikte Seç</h2><p>Odan hâlâ açık. Adayları ve katılımcıları buradan gör.</p></div></header>
      <div class="decision-room-code-panel"><span>ODA KODU</span><strong id="decision-room-code">${ut(e.roomCode)}</strong><button id="btn-copy-decision-room"><i data-lucide="copy"></i> Kodu Kopyala</button><small>Arkadaşın “Birlikte Seç” ekranında bu kodu yazsın.</small></div>
      <div class="decision-room-live"><span class="decision-room-live-dot"></span><span id="decision-room-status">Odaya dönüldü.</span><strong id="decision-room-member-count" class="decision-room-member-count">1 kişi</strong></div>
      ${vc()}
      <div id="decision-room-deck" class="decision-room-deck"></div>
      <footer class="decision-room-footer"><span>Oda kapanınca oylar silinir.</span><button id="btn-refresh-decision-cards"><i data-lucide="refresh-cw"></i> Yeni adaylar</button></footer>
    </section>`;const i=()=>Mi(!0);t.querySelector("#btn-close-decision-room").onclick=i,t.addEventListener("click",r=>{r.target===t&&i()});const n=()=>Sc();window.addEventListener("cinepulse:decision-room-open",n,{once:!0}),Hi=()=>window.removeEventListener("cinepulse:decision-room-open",n),Ni=e.subscribe(r=>bc(t,r)),wc(t,e),kc(t,e),t.querySelector("#btn-copy-decision-room").onclick=async()=>{try{await navigator.clipboard.writeText(e.roomCode),Z("Oda kodu kopyalandı.","success")}catch{Z(`Oda kodu: ${e.roomCode}`,"info")}},t.querySelector("#btn-refresh-decision-cards").onclick=()=>_c(e,t),J(t)}function Sc(){Hi?.(),Hi=null,Ni?.(),Ni=null,Nt?.remove(),Nt=null}function Tf(e="home"){const t=wn(),i=Bl(),n=t.isKid;return`
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
  `}let Xi=null,Pn=null,Ko=!1;function Wo(e){const t=document.getElementById("main-navbar");Xi&&window.removeEventListener("scroll",Xi),Xi=()=>t?.classList.toggle("scrolled",window.scrollY>20),Xi(),window.addEventListener("scroll",Xi,{passive:!0});const i=document.getElementById("mobile-search-row");document.getElementById("btn-mobile-search-toggle")?.addEventListener("click",()=>{i?.classList.toggle("hidden"),i?.classList.contains("hidden")||(document.getElementById("mobile-search-input")?.focus(),J())}),document.getElementById("btn-mobile-search-close")?.addEventListener("click",()=>{i?.classList.add("hidden")}),document.getElementById("btn-nav-notifications")?.addEventListener("click",wu),document.getElementById("btn-nav-profile")?.addEventListener("click",bu);const n=document.getElementById("nav-hub-li"),r=document.getElementById("btn-desktop-hub"),a=document.getElementById("hub-mega-dropdown");let o;function s(){clearTimeout(o),r?.setAttribute("aria-expanded","true"),a?.classList.add("open")}function l(){clearTimeout(o),r?.setAttribute("aria-expanded","false"),a?.classList.remove("open")}function d(){clearTimeout(o),o=setTimeout(()=>{!n?.matches(":hover")&&!a?.matches(":hover")&&l()},350)}if(n){n.addEventListener("mouseenter",s),n.addEventListener("mouseleave",d),a?.addEventListener("mouseenter",s),a?.addEventListener("mouseleave",d),r?.addEventListener("click",f=>{f.stopPropagation(),s()}),a?.querySelectorAll(".hub-nav-trigger").forEach(f=>{f.addEventListener("click",l)});const b=f=>{f.key==="Escape"&&l()};window.addEventListener("keydown",b);const w=f=>{n.contains(f.target)||l()};document.addEventListener("click",w)}document.getElementById("btn-hub-random-spin")?.addEventListener("click",async()=>{l(),mo()}),document.getElementById("btn-hub-series-recommend")?.addEventListener("click",l),document.getElementById("btn-hub-trakt")?.addEventListener("click",()=>{l(),cr()});const p=document.getElementById("mobile-hub-backdrop"),h=document.getElementById("mobile-hub-sheet");let m;function v(){p&&(clearTimeout(m),h?.classList.remove("sheet-closing"),p.classList.remove("hidden"),document.body.style.overflow="hidden")}function y(){p&&(document.body.style.overflow="",h?.classList.add("sheet-closing"),clearTimeout(m),m=setTimeout(()=>{p.classList.add("hidden"),h?.classList.remove("sheet-closing")},280))}document.getElementById("btn-open-mobile-hub")?.addEventListener("click",b=>{b.preventDefault(),v()},{once:!1}),document.getElementById("btn-close-mobile-hub")?.addEventListener("click",y),p?.addEventListener("click",b=>{b.target===p&&y()}),p?.querySelectorAll(".hub-nav-trigger").forEach(b=>{b.addEventListener("click",y)}),document.getElementById("btn-hub-random-spin-mobile")?.addEventListener("click",async()=>{y(),mo()}),document.getElementById("btn-hub-series-recommend-mobile")?.addEventListener("click",y),document.getElementById("btn-hub-trakt-mobile")?.addEventListener("click",()=>{y(),cr()}),document.querySelectorAll("[data-open-decision-room]").forEach(b=>{b.addEventListener("click",()=>{l(),y(),fr()})}),Yo("nav-search-input","search-overlay"),Yo("mobile-search-input","mobile-search-overlay"),Ko||(Ko=!0,document.addEventListener("click",b=>{for(const[w,f]of[["nav-search-input","search-overlay"],["mobile-search-input","mobile-search-overlay"]]){const k=document.getElementById(w),x=document.getElementById(f);x&&!k?.contains(b.target)&&!x.contains(b.target)&&x.classList.add("hidden")}})),Pn&&document.removeEventListener("keydown",Pn),Pn=b=>{(b.metaKey||b.ctrlKey)&&b.key.toLowerCase()==="k"&&(b.preventDefault(),window.innerWidth<=992&&i?(i.classList.remove("hidden"),document.getElementById("mobile-search-input")?.focus()):document.getElementById("nav-search-input")?.focus())},window.addEventListener("keydown",Pn)}function Yo(e,t){const i=document.getElementById(e),n=document.getElementById(t);let r=null;!i||!n||(i.addEventListener("input",a=>{const o=a.target.value.trim();if(clearTimeout(r),o.length<2){n.classList.add("hidden"),n.innerHTML="";return}n.innerHTML='<div class="search-no-results" style="display:flex;align-items:center;gap:8px;padding:1rem;color:var(--text-muted);font-size:.85rem;"><span class="tv-loading-spinner" style="width:16px;height:16px;border-width:2px;"></span> Aranıyor...</div>',n.classList.remove("hidden"),r=setTimeout(async()=>{try{let h=function(){n.querySelectorAll(".search-item").forEach(m=>{m.addEventListener("click",()=>{n.classList.add("hidden"),i.value="",document.getElementById("mobile-search-row")?.classList.add("hidden")})})};const s=await ds(o),l=Array.isArray(s)?s.slice(0,8):s?.results?.slice(0,8)||[],d=`
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
          </a>`;if(!l.length){n.innerHTML=`<div class="search-no-results" style="padding-bottom:.5rem;">TMDB Sonucu Bulunamadı</div>${d}`,n.classList.remove("hidden"),J(n),h();return}const p=l.map(m=>{const v=m.media_type==="tv"||!!m.first_air_date||!m.release_date&&!!m.name,y=m.title||m.name||"İsimsiz",b=(m.release_date||m.first_air_date||"").slice(0,4),w=it(m.poster_path,Ke.POSTER_SMALL||Ke.POSTER_MEDIUM);return`
            <a href="#detail?type=${v?"tv":"movie"}&id=${m.id}" class="search-item">
              <img src="${w}" alt="${y}" class="search-item-img" onerror="this.src='https://via.placeholder.com/45x68/1e293b/64748b?text=N/A'" />
              <div class="search-item-info">
                <div class="search-item-title">${y}</div>
                <div class="search-item-meta">
                  <span class="search-badge">${v?"Dizi":"Film"}</span>
                  ${b?`<span>${b}</span>`:""}
                  <span class="search-rating">★ ${(m.vote_average||0).toFixed(1)}</span>
                </div>
              </div>
            </a>`}).join("");n.innerHTML=p+d,n.classList.remove("hidden"),J(n),h()}catch{n.innerHTML='<div class="search-no-results">Arama sırasında bir hata oluştu</div>'}},200)}),i.addEventListener("keydown",a=>{a.key==="Escape"&&(n.classList.add("hidden"),i.blur())}))}let Zi=null;function Ec({title:e="Fragman",trailerInfo:t,mediaId:i=null,mediaType:n="movie"}){const r=document.getElementById("trailer-modal");if(!r)return;if(!t||!t.embedUrl){alert("Bu yapım için resmi fragman bulunamadı.");return}const a=t.name||"Resmi Tanıtım",o=i?`#detail?type=${encodeURIComponent(n)}&id=${encodeURIComponent(i)}`:null;r.innerHTML=`
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
  `,r.classList.remove("hidden"),document.body.style.overflow="hidden",J();const s=()=>{r.innerHTML="",r.classList.add("hidden"),document.body.style.overflow="",Zi&&(window.removeEventListener("keydown",Zi),Zi=null)},l=r.querySelector("#btn-close-trailer");l&&l.addEventListener("click",s),r.querySelector(".btn-trailer-detail")?.addEventListener("click",s);const d=r.querySelector(".trailer-modal-overlay");d&&d.addEventListener("click",p=>{p.target===d&&s()}),Zi=p=>{p.key==="Escape"&&s()},window.addEventListener("keydown",Zi)}let rt=0,hr=null,Gn=0;const Bn=new Map;function Af(){clearInterval(hr),hr=null,Gn++}function ks(e){const t=e?.backdrop_path||e?.poster_path,i=window.innerWidth<=768?Ke.BACKDROP_LARGE:Ke.BACKDROP_XLARGE;return it(t,i)}function _s(e,t="auto"){if(!e)return Promise.resolve(null);if(Bn.has(e))return Bn.get(e);const i=new Promise(n=>{const r=new Image;r.decoding="async",r.fetchPriority=t,r.onload=async()=>{try{await r.decode()}catch{}n(e)},r.onerror=()=>{Bn.delete(e),n(null)},r.src=e});return Bn.set(e,i),i}function Cf(e=[]){const i=Lt()?e.filter(ei):e;if(!i||i.length===0)return"";rt=0;const n=i.slice(0,10),r=n[0],a=r.id,o=r.first_air_date||r.media_type==="tv"?"tv":"movie",s=r.title||r.name||"Öne Çıkan Yapım",l=r.overview&&r.overview.trim().length>15?r.overview:Ne(r,o),d=ks(r),p=r.vote_average?r.vote_average.toFixed(1):"8.8",h=(r.first_air_date||r.release_date||"").substring(0,4),m=as(a);let v=document.getElementById("hero-backdrop-preload");return v||(v=document.createElement("link"),v.id="hero-backdrop-preload",v.rel="preload",v.as="image",document.head.appendChild(v)),v.href=d,v.fetchPriority="high",window.innerWidth>768&&_s(d,"high"),`
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

            <button class="btn-secondary hero-btn-list-icon" id="hero-list-btn" data-id="${a}" data-type="${o}" title="${m?"Listemden Çıkar":"Listeme Ekle"}">
              <i data-lucide="${m?"check":"plus"}" style="width: 17px; height: 17px; ${m?"color: var(--primary);":""}"></i>
            </button>
          </div>

          <!-- Dot Indicators -->
          <div class="hero-dots-wrapper" id="hero-dots-container">
            ${n.map((y,b)=>`
              <div class="hero-dot ${b===rt?"active":""}" data-index="${b}" role="button" aria-label="Slayt ${b+1}"></div>
            `).join("")}
          </div>
        </div>
      </div>
    </section>
  `}function Lf(e=[]){const i=Lt()?e.filter(ei):e;if(!i||i.length===0)return;const n=i.slice(0,10);rt=0;const r=document.getElementById("hero-play-btn"),a=document.getElementById("hero-list-btn"),o=document.getElementById("hero-trailer-btn"),s=document.getElementById("hero-slider-section"),l=document.getElementById("hero-backdrop-img"),d=document.getElementById("hero-arrow-prev"),p=document.getElementById("hero-arrow-next");(async()=>{if(l&&!l.complete&&await new Promise(A=>{l.addEventListener("load",A,{once:!0}),l.addEventListener("error",A,{once:!0})}),l?.complete&&l.naturalWidth>0)try{await l.decode()}catch{}requestAnimationFrame(()=>{s?.isConnected&&(s.classList.remove("is-loading"),s.setAttribute("aria-busy","false"))})})();const m=()=>n.slice(1,4).forEach(A=>_s(ks(A)));"requestIdleCallback"in window?window.requestIdleCallback(m,{timeout:1500}):setTimeout(m,500),n.slice(0,2).forEach(A=>{const C=A.first_air_date||A.media_type==="tv"?"tv":"movie";gn(C,A.id).catch(()=>null)});function v(){Dn(n[(rt+1)%n.length],(rt+1)%n.length),S()}function y(){Dn(n[(rt-1+n.length)%n.length],(rt-1+n.length)%n.length),S()}d?.addEventListener("click",y),p?.addEventListener("click",v);const b=A=>{if(!s?.isConnected){document.removeEventListener("keydown",b);return}A.key==="ArrowRight"&&v(),A.key==="ArrowLeft"&&y()};document.addEventListener("keydown",b);let w=null,f=!1;const k=50;function x(A){w=A,f=!0}function L(A){if(!f||w===null)return;f=!1;const C=w-A;Math.abs(C)<k||(C>0?v():y(),w=null)}s?.addEventListener("touchstart",A=>x(A.touches[0].clientX),{passive:!0}),s?.addEventListener("touchend",A=>L(A.changedTouches[0].clientX),{passive:!0}),s?.addEventListener("touchcancel",()=>{f=!1,w=null},{passive:!0}),s?.addEventListener("mousedown",A=>{A.button===0&&x(A.clientX)}),s?.addEventListener("mouseup",A=>{A.button===0&&L(A.clientX)}),s?.addEventListener("mouseleave",()=>{f=!1,w=null}),r?.addEventListener("click",()=>{window.location.hash=`#detail?type=${r.getAttribute("data-type")}&id=${r.getAttribute("data-id")}`}),o?.addEventListener("click",async()=>{if($t().trailersEnabled===!1){Z("Fragmanlar yönetici ayarlarından kapatıldı.","info");return}const A=n[rt];if(!A)return;const C=A.first_air_date||A.media_type==="tv"?"tv":"movie",$=o.innerHTML;o.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:17px;height:17px;"></i> <span>Yükleniyor...</span>',J(o);try{const N=await gn(C,A.id,A.title||A.name);N?Ec({title:A.title||A.name,trailerInfo:N,mediaId:A.id,mediaType:C}):Z("Bu yapım için resmi tanıtım fragmanı bulunamadı.","info")}catch{Z("Fragman yüklenirken hata oluştu.","error")}finally{o.innerHTML=$,J(o)}}),a?.addEventListener("click",()=>{const A=n[rt],C=vl(A);Z(C?"İzleme listene eklendi!":"İzleme listenden çıkarıldı.",C?"success":"info"),a.title=C?"Listemden Çıkar":"Listeme Ekle",a.innerHTML=`<i data-lucide="${C?"check":"plus"}" style="width: 17px; height: 17px; ${C?"color: var(--primary);":""}"></i>`,J(a)}),document.querySelectorAll(".hero-dot").forEach(A=>{A.addEventListener("click",()=>{const C=parseInt(A.getAttribute("data-index"),10);Dn(n[C],C),S()})});function S(){clearInterval(hr),hr=setInterval(()=>{if(n.length>1){const A=(rt+1)%n.length;Dn(n[A],A)}},6e3)}S()}async function Dn(e,t=rt){if(!e||Lt()&&!ei(e))return;const i=document.getElementById("hero-backdrop-img"),n=document.getElementById("hero-title-text"),r=document.getElementById("hero-overview-text"),a=document.getElementById("hero-play-btn"),o=document.getElementById("hero-list-btn"),s=document.getElementById("hero-trailer-btn"),l=document.getElementById("hero-rating-badge"),d=document.getElementById("hero-year-badge"),p=document.getElementById("hero-type-badge"),h=e.first_air_date||e.media_type==="tv"?"tv":"movie",m=ks(e),v=e.vote_average?e.vote_average.toFixed(1):"8.5",y=(e.first_air_date||e.release_date||"").substring(0,4),b=++Gn;if(i&&i.src!==m){const k=await _s(m,"high");if(!k||b!==Gn||!i.isConnected)return;i.src=k;try{await i.decode()}catch{}if(b!==Gn||!i.isConnected)return}rt=t;const w=document.querySelector("#hero-slider-section .hero-content");w?.classList.remove("hero-content-committing"),requestAnimationFrame(()=>{w?.isConnected&&w.classList.add("hero-content-committing")}),n&&(n.textContent=e.title||e.name);const f=e.overview&&e.overview.trim().length>15?e.overview:Ne(e,h);if(r&&(r.textContent=f),l&&(l.innerHTML=`<i data-lucide="star" style="width:13px;height:13px;fill:currentColor"></i> ${v} IMDb`),d&&(d.textContent=y||"2024"),p&&(p.textContent=h==="tv"?"DİZİ":"FİLM"),a&&(a.setAttribute("data-id",e.id),a.setAttribute("data-type",h)),s&&(s.setAttribute("data-id",e.id),s.setAttribute("data-type",h)),o){o.setAttribute("data-id",e.id),o.setAttribute("data-type",h);const k=as(e.id);o.title=k?"Listemden Çıkar":"Listeme Ekle",o.innerHTML=`<i data-lucide="${k?"check":"plus"}" style="width:17px;height:17px;${k?"color:var(--primary);":""}"></i>`}J(document.getElementById("hero-slider-section")),document.querySelectorAll(".hero-dot").forEach((k,x)=>{k.classList.toggle("active",x===rt)})}const Ss=new Map,mr=new Map;let Pi=null,xc=null;function Tc(){const e=window.location.hash||"#home";e.startsWith("#detail")||(xc=e,window.scrollY>0&&Ss.set(e,window.scrollY))}function $f(){Tc(),Pi===null&&(Pi=window.setTimeout(()=>{Pi=null,Hr()},300))}function Hr(){Pi!==null&&(clearTimeout(Pi),Pi=null),(window.location.hash||"#home")===xc&&Tc();for(const[e,t]of Ss)if(t>0)try{sessionStorage.setItem(`cinepulse_scroll_${e}`,String(t))}catch{}for(const[e,t]of mr)try{sessionStorage.setItem(`cinepulse_rail_${e}`,String(t))}catch{}}const Go=Hr;function Rf(e=window.location.hash||"#home"){if(e.startsWith("#detail")){window.scrollTo({top:0,behavior:"instant"});return}document.querySelectorAll(".card-rail").forEach(i=>{if(i.id){let n=mr.get(i.id);if(typeof n!="number")try{const r=sessionStorage.getItem(`cinepulse_rail_${i.id}`);r&&(n=parseFloat(r))}catch{}typeof n=="number"&&n>0&&(i.scrollLeft=n,requestAnimationFrame(()=>{i.scrollLeft=n}))}});let t=Ss.get(e);if(typeof t!="number")try{const i=sessionStorage.getItem(`cinepulse_scroll_${e}`);i&&(t=parseFloat(i))}catch{}if(typeof t=="number"&&t>0){const i=(n=0)=>{window.scrollTo({top:t,behavior:"instant"}),n<15&&document.body.scrollHeight<t+window.innerHeight&&setTimeout(()=>i(n+1),60)};requestAnimationFrame(()=>i(0))}else window.scrollTo({top:0,behavior:"instant"})}const If={},Mf="https://cine-pulse-drab.vercel.app";(If?.VITE_MKV_RELAY_ORIGIN||"").replace(/\/$/,"");function nt(e=""){if(!e||/^https?:\/\//i.test(e))return e;if(typeof window>"u")return`http://127.0.0.1:4000${e}`;const t=window.location?.hostname||"";return!!(window.Capacitor?.isNativePlatform?.()||window.location?.protocol==="capacitor:"||t==="localhost"||t==="127.0.0.1"||t.endsWith("github.io"))?`${Mf}${e}`:e}const dn=new Map,gr="cp_fanart_v4_",Pf="4e44d9029b1270a757cddc766a1bcb63";function Bf(e){if(dn.has(e))return dn.get(e);try{const t=localStorage.getItem(gr+e)||sessionStorage.getItem(gr+e);if(t!==null){const i=t?JSON.parse(t):null;return dn.set(e,i),i}}catch{}}function zn(e,t){dn.set(e,t);try{const i=t?JSON.stringify(t):"";localStorage.setItem(gr+e,i)}catch{try{sessionStorage.setItem(gr+e,t?JSON.stringify(t):"")}catch{}}}async function Df(e,t){try{const i=await fetch(`https://api.themoviedb.org/3/${t==="tv"?"tv":"movie"}/${e}/images?api_key=${Pf}&include_image_language=tr,en,null`,{signal:AbortSignal.timeout(3500)});if(!i.ok)return null;const n=await i.json(),r=n.logos||[];let a=null;r.length>0&&(r.sort((d,p)=>{const h=m=>m.iso_639_1==="tr"?3:m.iso_639_1==="en"?2:1;return h(p)-h(d)||(p.vote_average||0)-(d.vote_average||0)}),r[0]?.file_path&&(a=`https://image.tmdb.org/t/p/w500${r[0].file_path}`));const s=(n.backdrops||[]).filter(d=>(d.iso_639_1==="tr"||d.iso_639_1==="en")&&(d.aspect_ratio||0)>1.35&&d.file_path);let l=null;return s.length>0&&(s.sort((d,p)=>{const h=m=>m.iso_639_1==="tr"?2:1;return h(p)-h(d)||(p.vote_average||0)-(d.vote_average||0)}),l=`https://image.tmdb.org/t/p/w780${s[0].file_path}`),l||a?{image:l||null,logo:l?null:a}:null}catch{return null}}async function zf(e,t){try{const i=nt(`/api/fanart?type=${t==="tv"?"tv":"movie"}&id=${encodeURIComponent(e)}`),n=await fetch(i,{signal:AbortSignal.timeout(3e3)});if(!n.ok)return null;const r=await n.json();return r.image?{image:r.image,logo:r.logo||null}:null}catch{return null}}async function Ac(e,t="movie"){if(!/^\d+$/.test(String(e)))return null;const i=t==="tv"?"tv":"movie",n=`${i}:${e}`,r=Bf(n);if(r!==void 0)return r;const a=(async()=>{const s=Df(e,i),l=zf(e,i),d=await s;if(d)return zn(n,d),d;const p=await l;return p?(zn(n,p),p):(zn(n,null),null)})();dn.set(n,a);const o=await a;return zn(n,o),o}function Vo(e){Array.isArray(e)&&e.forEach((t,i)=>{if(!t?.id)return;const n=t.media_type==="tv"||t.type==="tv"?"tv":"movie";setTimeout(()=>Ac(t.id,n),i*30)})}const Of=fl||["anime","kimetsu","yaiba","iblis keser","demon slayer","naruto","boruto","shingeki","titan"];function Wt(e=""){return String(e).replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t])}function Nf(e){return e?/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(e):!1}function Es(e){if(!e)return!1;if(e.isAnime===!0||e.type==="anime"||e.media_type==="anime"||e.id&&He(e.id))return!0;const i=(e.genre_ids||(Array.isArray(e.genres)?e.genres.map(a=>typeof a=="object"?a.id:a):[])).some(a=>Number(a)===16),n=e.original_language==="ja"||Array.isArray(e.origin_country)&&e.origin_country.includes("JP");if(i&&n||i&&(e.origin_country?.includes("JP")||e.original_language==="ja")||e.original_language==="ja"&&(i||Nf(e.original_name||e.original_title||e.title||e.name))||Array.isArray(e.genres)&&e.genres.map(o=>typeof o=="object"?o.name:String(o)).filter(Boolean).some(o=>/anime/i.test(o)))return e.id&&we(e.id),!0;if(typeof e.id=="string"&&(e.id.startsWith("ta_")||e.id.startsWith("acx_")||e.id.startsWith("tra_")))return we(e.id),!0;const r=(e.title||e.name||e.original_title||e.original_name||"").toLowerCase();for(const a of Of)if(r.includes(a))return e.id&&we(e.id),!0;return!1}function Cc(e){return e?e.first_air_date||e.number_of_seasons||e.episodesCount||Array.isArray(e.seasons)&&e.seasons.length>0||e.type==="tv"||e.media_type==="tv"?!0:(e.type==="movie"||e.media_type==="movie"||e.release_date&&!e.first_air_date,!1):!1}function xs(e){return e?e.isAnime||e.type==="anime"||Es(e)||e.id&&He(e.id)?"anime":e.type==="documentary"||e.media_type==="documentary"||(e.genre_ids||(Array.isArray(e.genres)?e.genres.map(i=>typeof i=="object"?i.id:i):[])).some(i=>Number(i)===99)?"documentary":e.type==="movie"||e.media_type==="movie"?"movie":e.type==="tv"||e.media_type==="tv"||Cc(e)?"tv":"movie":"movie"}function kt(e,t={}){const i=e.id,n=xs(e),r=!!(e.isAnime||n==="anime"||Es(e)||e.id&&He(e.id)),a=!!(e.isSeries!==void 0?e.isSeries:Cc(e)),o=a?"tv":"movie";let s=e.title||e.name||"";(!s||Lr(s))&&(s=e.title_en||e.name_en||e.original_name||e.original_title||s||"İsimsiz İçerik");const l=s,d=e.poster_path||e.posterPath||e.poster||"",p=e.backdrop_path||e.backdropPath||e.backdrop||"",h=it(d,Ke.POSTER_MEDIUM),m=p?it(p,Ke.BACKDROP_LARGE):h,y=$t().cardLayout==="landscape"?m:h;let b=e.vote_average??e.voteAverage??e.rating,w=b?Number(b).toFixed(1):"";w==="0.0"&&(w="");const f=e.release_date||e.first_air_date||(e.year?String(e.year):""),k=f?String(f).substring(0,4):"";let x=e.progressPercent||0,L=e.season||1,S=e.episode||1,A=e.currentTime||0,C=e.completed||!1,$=!1;if(t.isContinueSection||e.currentTime>0&&!C||e.progressPercent>0&&!C)$=!0;else{const Q=Qt(i,L,S);Q&&(C=Q.completed||!1,!C&&Q.duration>0&&Q.currentTime>15&&(x=Math.min(100,Math.round(Q.currentTime/Q.duration*100)),A=Q.currentTime,a&&(L=Q.season||1,S=Q.episode||1)))}let N="FİLM",O="type-movie";r?(N=a?"ANİME DİZİSİ":"ANİME FİLMİ",O="type-anime"):n==="tv"||a?(N="DİZİ",O="type-tv"):n==="documentary"&&(N="BELGESEL",O="type-doc");const G=e.original_title||e.original_name||"",U=encodeURIComponent(l),z=encodeURIComponent(G),D=encodeURIComponent(d||""),K=encodeURIComponent(p||"");return`
    <div class="media-card" 
      data-id="${i}" 
      data-type="${o}" 
      data-isanime="${r?"true":"false"}"
      data-title="${U}" 
      data-originaltitle="${z}"
      data-poster="${D}"
      data-backdrop="${K}"
      data-tmdbid="${i}"
      data-mediatype="${n==="tv"||a?"tv":"movie"}"
      data-isseries="${a?"true":"false"}"
      data-season="${L}" 
      data-episode="${S}" 
      data-currenttime="${A}"
      data-iscontinue="${$?"true":"false"}"
      tabindex="0"
      role="button"
      aria-label="${l}">
      
      <div class="card-poster-wrapper ${p?"":"card-fanart-portrait-fallback"}">
        <img 
          src="${y}"
          data-poster-src="${h}"
          data-backdrop-src="${m}"
          alt="${l}" 
          class="card-poster-img" 
          loading="lazy" 
          decoding="async"
          onerror="this.onerror=null;this.src='${wt}'"
        />
        <img class="card-fanart-logo" alt="" aria-hidden="true" />
        
        <div class="card-glass-glow"></div>

        <!-- Left Status Pill (Completed / In-Progress with actual progress) -->
        ${C?`
          <div class="card-status-badge card-status-completed" title="Tamamlandı">
            <i data-lucide="check" style="width:10px;height:10px;stroke-width:3;"></i>
            <span>İZLENDİ</span>
          </div>
        `:$&&a&&(A>0||x>0)?`
          <div class="card-status-badge card-status-continue" title="Kaldığın Bölüm">
            <i data-lucide="clock" style="width:10px;height:10px;"></i>
            <span>S${L} B${S}</span>
          </div>
        `:""}

        <!-- Rating Pill Floating Top Right -->
        ${w?`
          <div class="card-rating-pill">
            <i data-lucide="star" style="width:11px;height:11px;fill:#f59e0b;stroke:#f59e0b;"></i>
            <span>${w}</span>
          </div>
        `:""}

        <!-- Hover Quick Play Overlay -->
        <div class="card-hover-overlay">
          <div class="card-play-btn-circle">
            <i data-lucide="play" style="width:20px;height:20px;fill:currentColor;margin-left:2px;"></i>
          </div>
          <span class="card-hover-action-text">${$?"İzlemeye Devam Et":"İncele & Oynat"}</span>
        </div>

        <!-- Progress Bar at bottom if watch in progress -->
        ${x>0&&!C?`
          <div class="card-progress-bar-bg">
            <div class="card-progress-bar-fill" style="width: ${x}%;"></div>
          </div>
        `:""}
      </div>

      <div class="card-info">
        <h3 class="card-title" title="${l}">${l}</h3>
        <div class="card-meta">
          <span class="card-type-tag ${O}">${N}</span>
          ${k?`<span class="card-year-tag">${k}</span>`:""}
        </div>
      </div>
    </div>
  `}function ft(e){if(!e||(qi(e),e._hasMediaEventsDelegated))return;e._hasMediaEventsDelegated=!0;let t=0;e.addEventListener("click",s=>{if(Date.now()<t){s.preventDefault(),s.stopPropagation();return}if(s.target.closest(".btn-lib-delete")||s.target.closest(".btn-delete-history"))return;const l=s.target.closest(".media-card");if(!l)return;s.preventDefault();const d=l.getAttribute("data-id"),p=l.getAttribute("data-type"),h=l.getAttribute("data-isanime")==="true"||p==="anime"||He(d),m=parseInt(l.getAttribute("data-season")||"1",10),v=parseInt(l.getAttribute("data-episode")||"1",10),y=parseFloat(l.getAttribute("data-currenttime")||"0"),b=decodeURIComponent(l.getAttribute("data-title")||""),w=decodeURIComponent(l.getAttribute("data-originaltitle")||""),f=l.getAttribute("data-poster")||"",k=l.getAttribute("data-backdrop")||"",x=l.getAttribute("data-iscontinue")==="true",L=l.getAttribute("data-isseries"),S=l.getAttribute("data-mediatype"),A=L!==null?L==="true":S==="tv"||p==="tv";x&&(l.closest("#continue-watching-rail")||l.closest(".continue-card-wrapper")||y>0)?ti({type:h?"anime":A?"tv":"movie",isAnime:h,isSeries:A,tmdbId:d,title:A?`${b} - S${m}E${v}`:b,seriesTitle:b,originalTitle:w||b,season:A?m:void 0,episode:A?v:void 0,posterPath:f,backdropPath:k,currentTime:y}):(Go(),window.location.hash=`#detail?type=${h?"anime":p}&id=${d}`)}),document.querySelector("link[rel=preconnect][href*=youtube-nocookie]")||["https://www.youtube-nocookie.com","https://i.ytimg.com"].forEach(s=>{const l=document.createElement("link");l.rel="preconnect",l.href=s,l.crossOrigin="anonymous",document.head.appendChild(l)});const i=window.matchMedia("(hover: hover) and (pointer: fine)").matches,n=window.matchMedia("(pointer: coarse)").matches,r=$t(),a=r.hoverPreviewsEnabled!==!1&&r.trailersEnabled!==!1;function o(s,l){if(s.querySelector(".card-hover-video-preview"))return;let d=sessionStorage.getItem("cinepulse_preview_sound")==="on";l.then(p=>{if(!p||!p.key||!p.key.trim()||!s.isConnected||i&&!s.matches(":hover"))return;const h=decodeURIComponent(s.getAttribute("data-title")||"Fragman"),m=s.querySelector(".card-type-tag")?.textContent?.trim()||"",v=s.querySelector(".card-year-tag")?.textContent?.trim()||"",y=s.querySelector(".card-rating-pill span")?.textContent?.trim()||"",b=s.getAttribute("data-id")||"",w=s.getAttribute("data-type")||"movie",f=`#detail?type=${encodeURIComponent(w)}&id=${encodeURIComponent(b)}`,k=encodeURIComponent(p.key),x=document.createElement("div");x.className="card-hover-video-preview";const L=window.innerWidth<=700;if(L&&(document.querySelectorAll(".card-hover-video-preview").forEach(D=>{typeof D._closePreview=="function"?D._closePreview():(D.closest?.(".media-card")?.classList.remove("preview-active"),D.remove())}),document.querySelectorAll(".card-preview-mobile-close-portal").forEach(D=>D.remove()),x.classList.add("is-mobile-sheet")),x.innerHTML=`
        <div class="card-preview-media">
          <iframe
            src="https://www.youtube-nocookie.com/embed/${k}?autoplay=1&mute=1&controls=0&disablekb=1&modestbranding=1&loop=1&playlist=${k}&rel=0&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}"
            frameborder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            tabindex="-1"
            title="${Wt(h)} fragmanı">
          </iframe>
          <div class="card-preview-cinematic-shade"></div>
          <span class="card-preview-badge">FRAGMAN</span>
        </div>
        <button class="card-preview-close-btn" type="button" aria-label="Fragmanı kapat" title="Fragmanı kapat"><i data-lucide="x"></i></button>
        <div class="card-preview-details">
          <div class="card-preview-copy">
            <strong class="card-preview-title">${Wt(h)}</strong>
            <div class="card-preview-meta">
              ${y?`<span class="card-preview-match">${Wt(y)} IMDb</span>`:""}
              ${v?`<span>${Wt(v)}</span>`:""}
              ${m?`<span>${Wt(m)}</span>`:""}
            </div>
          </div>
          <div class="card-preview-actions">
            <a class="card-preview-detail" href="${Wt(f)}" aria-label="${Wt(h)} içerik sayfasına git"><i data-lucide="info"></i><span>İçeriğe Git</span></a>
            <a class="card-preview-open" href="${Wt(p.watchUrl||`https://www.youtube.com/watch?v=${k}`)}" target="_blank" rel="noopener noreferrer" title="YouTube'da aç" aria-label="Fragmanı YouTube'da aç"><i data-lucide="external-link"></i></a>
            <button class="card-preview-sound ${d?"is-on":""}" type="button" aria-label="${d?"Sesi kapat":"Sesi aç"}" title="${d?"Sesi kapat":"Sesi aç"}">
              <i data-lucide="${d?"volume-2":"volume-x"}"></i>
            </button>
          </div>
        </div>
      `,!L){const D=s.getBoundingClientRect(),K=window.innerHeight<520?12:76,ne=Math.min(460,Math.max(390,D.width*2.2),window.innerWidth-32),Q=Math.max(240,(window.innerHeight-K-94)*16/9),re=Math.max(240,Math.min(ne,Q)),H=re*9/16+82,oe=Math.max(16,Math.min(window.innerWidth-re-16,D.left+(D.width-re)/2)),V=Math.max(K,Math.min(window.innerHeight-H-12,D.top+(D.height-H)/2));x.style.left=`${oe}px`,x.style.top=`${V}px`,x.style.width=`${re}px`}s.classList.add("preview-active"),s.appendChild(x),J();const S=x.querySelector("iframe");let A=null,C=null;L&&(A=document.createElement("button"),A.type="button",A.className="card-preview-mobile-close-portal",A.setAttribute("aria-label","Fragmanı kapat"),A.title="Fragmanı kapat",A.innerHTML='<i data-lucide="x"></i>',C=()=>{const D=x.getBoundingClientRect();A.style.top=`${Math.max(8,D.top+12)}px`,A.style.left=`${Math.max(8,D.right-52)}px`},document.body.appendChild(A),requestAnimationFrame(C),window.addEventListener("resize",C,{passive:!0}),J(A)),x.addEventListener("click",D=>D.stopPropagation()),x.addEventListener("touchend",D=>D.stopPropagation(),{passive:!0});const $=x.querySelector(".card-preview-sound"),N=x.querySelector(".card-preview-close-btn");x.querySelector(".card-preview-detail")?.addEventListener("click",()=>{Go(),U()});const O=(D,K=[])=>{S?.contentWindow?.postMessage(JSON.stringify({event:"command",func:D,args:K}),"*")},G=()=>{O(d?"unMute":"mute"),d&&O("setVolume",[75]),$.classList.toggle("is-on",d),$.title=d?"Sesi kapat":"Sesi aç",$.setAttribute("aria-label",$.title),$.innerHTML=`<i data-lucide="${d?"volume-2":"volume-x"}"></i>`,J()},U=()=>{C&&window.removeEventListener("resize",C);try{A?.remove()}catch{}try{x.remove()}catch{}s.classList.remove("preview-active")};x._closePreview=U;const z=window.setTimeout(()=>{x.classList.add("video-ready")},1500);S.addEventListener("load",()=>{window.clearTimeout(z),x.classList.add("video-ready"),d&&window.setTimeout(G,180)},{once:!0}),$.addEventListener("click",D=>{D.preventDefault(),D.stopPropagation(),d=!d,sessionStorage.setItem("cinepulse_preview_sound",d?"on":"off"),G(),window.setTimeout(G,180)}),N&&N.addEventListener("click",D=>{D.preventDefault(),D.stopPropagation(),U()}),A?.addEventListener("click",D=>{D.preventDefault(),D.stopPropagation(),U()})}).catch(()=>{})}if(i&&a){const s=new WeakMap;e.addEventListener("pointerover",l=>{const d=l.target.closest(".media-card");if(!d||l.relatedTarget&&d.contains(l.relatedTarget))return;const p=d.getAttribute("data-id"),h=d.getAttribute("data-type")||"movie",m=gn(h==="tv"?"tv":"movie",p),v=setTimeout(()=>o(d,m),850);s.set(d,v)}),e.addEventListener("pointerout",l=>{const d=l.target.closest(".media-card");if(!d||l.relatedTarget&&d.contains(l.relatedTarget))return;const p=s.get(d);p&&clearTimeout(p),s.delete(d);const h=d.querySelector(".card-hover-video-preview");if(h)try{h.remove()}catch{}d.classList.remove("preview-active")})}if(n&&a){const l=new WeakMap;e.addEventListener("touchstart",p=>{if(p.target.closest(".card-hover-video-preview"))return;const h=p.target.closest(".media-card");if(!h)return;const m={opened:!1,timer:null},v=h.getAttribute("data-id"),y=h.getAttribute("data-type")||"movie",b=gn(y==="tv"?"tv":"movie",v);m.timer=setTimeout(()=>{m.timer=null,m.opened=!0,t=Date.now()+900;try{navigator.vibrate?.(40)}catch{}o(h,b)},600),l.set(h,m)},{passive:!0});const d=p=>{const h=p.target.closest(".media-card"),m=h&&l.get(h);m&&(m.timer&&clearTimeout(m.timer),m.timer=null,(!m.opened||p.type!=="touchend")&&l.delete(h))};e.addEventListener("touchend",d,{passive:!0}),e.addEventListener("touchmove",d,{passive:!0}),e.addEventListener("touchcancel",d,{passive:!0}),e.addEventListener("touchend",p=>{const h=p.target.closest(".media-card");(h&&l.get(h))?.opened&&l.delete(h)},{passive:!0})}}let Qi=null;function Hf(){return Qi||("IntersectionObserver"in window?(Qi=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&(Qi.unobserve(t.target),Xa(t.target))})},{rootMargin:"800px 0px"}),Qi):null)}async function Xa(e){if(!e||e.dataset.fanartState==="loaded"||e.dataset.fanartState==="loading")return;e.dataset.fanartState="loading";const t=e.querySelector(".card-poster-img");if(t)try{const i=await Ac(e.dataset.tmdbid,e.dataset.mediatype||"movie");if(!e.isConnected)return;if(!i?.image&&!i?.logo){e.dataset.fanartState="empty";return}i.image&&(t.dataset.backdropSrc=i.image,($t().cardLayout==="landscape"||document.documentElement.classList.contains("cards-landscape"))&&(t.src=i.image));const n=e.querySelector(".card-fanart-logo");if(n&&i.logo){n.src=i.logo;const r=e.querySelector(".card-poster-wrapper");r?.classList.remove("card-fanart-placeholder"),r?.classList.toggle("card-fanart-composite",!0)}e.dataset.fanartState="loaded"}catch{e.dataset.fanartState="empty"}}function qi(e=document,t=!1){const n=(e&&e.querySelectorAll?e:document).querySelectorAll('.media-card[data-tmdbid]:not([data-fanart-state="loaded"])');if(!n.length)return;if(t){n.forEach(a=>Xa(a));return}const r=Hf();if(!r){n.forEach(a=>Xa(a));return}n.forEach(a=>r.observe(a))}let Xe=null,Yt=null,Ti=0;const yr=new Map,Za=new Set,qf=10*60*1e3;function Ff(){Af();for(const e of Za)e.disconnect();Za.clear()}function Uf(e){try{const t=sessionStorage.getItem(`cinepulse_home_fast_v7_${e?"kids":"adult"}`);if(!t)return null;const i=JSON.parse(t);return!i?.savedAt||Date.now()-i.savedAt>qf?null:i.data?.isKid===e?i.data:null}catch{return null}}function Sa(e){try{sessionStorage.setItem(`cinepulse_home_fast_v7_${e.isKid?"kids":"adult"}`,JSON.stringify({savedAt:Date.now(),data:e}))}catch{}}function un(){Xe=null,Yt=null,Ti++;try{sessionStorage.removeItem("cinepulse_home_fast_v2_kids"),sessionStorage.removeItem("cinepulse_home_fast_v2_adult"),sessionStorage.removeItem("cinepulse_home_fast_v3_kids"),sessionStorage.removeItem("cinepulse_home_fast_v3_adult"),sessionStorage.removeItem("cinepulse_home_fast_v4_kids"),sessionStorage.removeItem("cinepulse_home_fast_v4_adult"),sessionStorage.removeItem("cinepulse_home_fast_v5_kids"),sessionStorage.removeItem("cinepulse_home_fast_v5_adult"),sessionStorage.removeItem("cinepulse_home_fast_v6_kids"),sessionStorage.removeItem("cinepulse_home_fast_v6_adult"),sessionStorage.removeItem("cinepulse_home_fast_v7_kids"),sessionStorage.removeItem("cinepulse_home_fast_v7_adult")}catch{}yr.clear(),Object.keys(be).forEach(e=>{be[e].page=1,be[e].loading=!1,be[e].exhausted=!1})}const be={"rail-popular-tv":{page:1,loading:!1,exhausted:!1,fetcher:nr},"rail-popular-movies":{page:1,loading:!1,exhausted:!1,fetcher:rr},"rail-top-tv":{page:1,loading:!1,exhausted:!1,fetcher:e=>Ai("tv",e)},"rail-top-movies":{page:1,loading:!1,exhausted:!1,fetcher:e=>Ai("movie",e)},"rail-anime":{page:1,loading:!1,exhausted:!1,fetcher:ar},"rail-adult-animation":{page:1,loading:!1,exhausted:!1,fetcher:Ia},"rail-cartoon-series":{page:1,loading:!1,exhausted:!1,fetcher:ir},"rail-documentary":{page:1,loading:!1,exhausted:!1,fetcher:sr}};function Ie({id:e,icon:t,title:i,accent:n,items:r}){if(!r||r.length===0)return"";const a=yr.get(e)||[],s=[...r,...a].map(l=>kt(l)).join("");return`
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
  `}function jf(e){return!e||e.length===0?"":`
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
      ${kt(n,{isContinueSection:!0})}
      <button class="btn-delete-history" title="Geçmişten Kaldır" aria-label="Kaldır">
        <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
      </button>
    </div>
  `).join("")}
        </div>
      </div>
    </section>
  `}function Jo(e){const t=e.querySelectorAll(".rail-sentinel");t.length!==0&&t.forEach(i=>{const n=i.getAttribute("data-rail"),r=document.getElementById(n);if(!r)return;const a=async()=>{const s=be[n];if(!s||s.loading||s.exhausted)return;s.loading=!0;const l=document.createElement("div");l.className="rail-loader",l.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:22px;height:22px;color:var(--text-muted);"></i>',i.before(l),J(l);try{const d=new Set(Array.from(r.querySelectorAll(".media-card[data-id]")).map(m=>String(m.getAttribute("data-id"))).filter(Boolean));let p=[];for(let m=0;m<4&&p.length===0;m+=1){s.page+=1;const v=await s.fetcher(s.page);if(!v||v.length===0){s.exhausted=!0;break}p=v.filter(y=>{const b=String(y?.id||"");return!b||d.has(b)?!1:(d.add(b),!0)})}if(l.remove(),p.length===0||!r.isConnected){s.loading=!1;return}const h=yr.get(n)||[];yr.set(n,[...h,...p]),p.forEach(m=>{const v=document.createElement("div");v.innerHTML=kt(m);const y=v.firstElementChild;y&&(r.insertBefore(y,i),y.addEventListener("click",()=>{const b=y.getAttribute("data-id"),w=y.getAttribute("data-type");window.location.hash=`#detail?type=${w}&id=${b}`}))}),J(r),qi(r)}catch{l.remove()}s.loading=!1};r.addEventListener("scroll",()=>{r.scrollWidth-(r.scrollLeft+r.clientWidth)<600&&a()},{passive:!0});const o=new IntersectionObserver(s=>{s.forEach(l=>{l.isIntersecting&&a()})},{root:r,rootMargin:"0px 400px 0px 0px",threshold:0});o.observe(i),Za.add(o)})}async function Kf(){const e=Ti,t=Lt();let i,n,r,a,o,s,l,d,p,h,m,v;Xe||(Xe=Uf(t));let y=null,b=!1,w=!1;if(Xe&&Xe.isKid===t)({trending:i,popularTV:n,popularMovies:r,topRatedTV:a,topRatedMovies:o,animeItems:s,docItems:l,kidsAdventures:d,adultAnimationItems:p,cartoonSeriesItems:h,kidsAnimationItems:m,kidsClassicCartoonItems:v}=Xe),y=Yt,b=!y;else if(t){if(y=Promise.all([Xs(1),Pa(1),Vs(1),Js(1)]).then($=>{e===Ti&&([d,s,m,v]=$,Xe={isKid:!0,trending:i,popularTV:n,popularMovies:r,kidsAdventures:d,animeItems:s,kidsAnimationItems:m,kidsClassicCartoonItems:v},w&&Sa(Xe),b=!0)}).catch(()=>{b=!0}),Yt=y,y.then(()=>{Yt===y&&(Yt=null)}),[n,r]=await Promise.all([Ra(1),Ma(1)]),i=[...r||[],...n||[]].filter($=>$.backdrop_path&&ei($)).slice(0,10),e!==Ti)return null;b||(Xe={isKid:!0,trending:i,popularTV:n,popularMovies:r})}else{if(y=Promise.all([Ai("tv",1),Ai("movie",1),ar(1),sr(1),Ia(1),ir(1)]).then($=>{e===Ti&&([a,o,s,l,p,h]=$,Xe={isKid:!1,trending:i,popularTV:n,popularMovies:r,topRatedTV:a,topRatedMovies:o,animeItems:s,docItems:l,adultAnimationItems:p,cartoonSeriesItems:h},w&&Sa(Xe),b=!0)}).catch(()=>{b=!0}),Yt=y,y.then(()=>{Yt===y&&(Yt=null)}),[i,n,r]=await Promise.all([El("all","week",1),nr(1),rr(1)]),e!==Ti)return null;b||(Xe={isKid:!1,trending:i,popularTV:n,popularMovies:r})}w=!0,b&&Xe&&Sa(Xe);const f=b,k=Ks(),x=Ns(k);let L;t?L=[...r||[],...n||[]].filter(N=>N.backdrop_path&&ei(N)).slice(0,10):L=i;const S=Cf(L);t?(be["rail-kids-animation"]||(be["rail-kids-animation"]={page:1,loading:!1,exhausted:!1,fetcher:Vs}),be["rail-kids-classics"]||(be["rail-kids-classics"]={page:1,loading:!1,exhausted:!1,fetcher:Js}),be["rail-kids-movies"]||(be["rail-kids-movies"]={page:1,loading:!1,exhausted:!1,fetcher:Ma}),be["rail-kids-adventures"]||(be["rail-kids-adventures"]={page:1,loading:!1,exhausted:!1,fetcher:Xs}),be["rail-anime"]||(be["rail-anime"]={page:1,loading:!1,exhausted:!1,fetcher:Pa})):(be["rail-popular-tv"]||(be["rail-popular-tv"]={page:1,loading:!1,exhausted:!1,fetcher:nr}),be["rail-popular-movies"]||(be["rail-popular-movies"]={page:1,loading:!1,exhausted:!1,fetcher:rr}),be["rail-top-tv"]||(be["rail-top-tv"]={page:1,loading:!1,exhausted:!1,fetcher:$=>Ai("tv",$)}),be["rail-top-movies"]||(be["rail-top-movies"]={page:1,loading:!1,exhausted:!1,fetcher:$=>Ai("movie",$)}),be["rail-anime"]||(be["rail-anime"]={page:1,loading:!1,exhausted:!1,fetcher:ar}),be["rail-adult-animation"]||(be["rail-adult-animation"]={page:1,loading:!1,exhausted:!1,fetcher:Ia}),be["rail-cartoon-series"]||(be["rail-cartoon-series"]={page:1,loading:!1,exhausted:!1,fetcher:ir})),t||be["rail-documentary"]||(be["rail-documentary"]={page:1,loading:!1,exhausted:!1,fetcher:sr}),Object.values(be).forEach($=>{$.loading=!1});let A="";return t?A=`
      ${Ie({id:"rail-kids-movies",icon:"sparkles",title:"🎈 En Çok Sevilen Animasyon & Çocuk Filmleri",accent:"#ec4899",items:r})}

      ${m&&m.length>0?Ie({id:"rail-kids-animation",icon:"sparkles",title:"Çocuk Animasyonları & Yeni Çizgi Diziler",accent:"#fb7185",items:m}):""}

      ${v&&v.length>0?Ie({id:"rail-kids-classics",icon:"palette",title:"Çizgi Dizi Dünyası & Unutulmaz Klasikler",accent:"#38bdf8",items:v}):""}

      ${d&&d.length>0?Ie({id:"rail-kids-adventures",icon:"compass",title:"⭐ Aile ve Fantastik Sinema Kuşağı",accent:"#38bdf8",items:d}):""}

      ${s&&s.length>0?Ie({id:"rail-anime",icon:"smile",title:"🎌 Çocuk & Genç Anime Dünyası",accent:"#a855f7",items:s}):""}
    `:A=`
      ${Ie({id:"rail-popular-tv",icon:"tv-2",title:"Trend Diziler & Yapımlar",accent:"#14b8a6",items:n})}

      ${p&&p.length>0?Ie({id:"rail-adult-animation",icon:"sparkles",title:"Yetişkin Animasyonları & Çizgi Diziler",accent:"#fb7185",items:p}):""}

      ${h&&h.length>0?Ie({id:"rail-cartoon-series",icon:"wand-2",title:"Çizgi Dizi Dünyası & Unutulmaz Klasikler",accent:"#38bdf8",items:h}):""}

      ${Ie({id:"rail-popular-movies",icon:"clapperboard",title:"Tüm Zamanların En Popüler Filmleri",accent:"#a78bfa",items:r})}

      ${Ie({id:"rail-top-movies",icon:"award",title:"⭐ Sinema Tarihinin Başyapıtları (IMDb 8.5+)",accent:"#fbbf24",items:o})}

      ${Ie({id:"rail-top-tv",icon:"star",title:"Kült & En Yüksek Puanlı Diziler",accent:"#34d399",items:a})}

      ${s&&s.length>0?Ie({id:"rail-anime",icon:"sparkles",title:"🎌 Popüler Anime Evreni (TR Dublaj & Altyazı)",accent:"#ec4899",items:s}):""}

      ${l&&l.length>0?Ie({id:"rail-documentary",icon:"globe",title:"🌍 İlham Veren Kült Belgeseller",accent:"#38bdf8",items:l}):""}
    `,{html:`
    <div class="home-view ${t?"is-kids-mode":""}">
      ${S}

      ${jf(x)}

      ${A}
    </div>
  `,init:$=>{const N=L&&L.length>0?L:i;N&&N.length>0&&Lf(N),ft($);const O=U=>{U.querySelectorAll(".card-rail").forEach(z=>{const D=z.id;if(D){let K=mr.get(D);if(typeof K!="number")try{const ne=sessionStorage.getItem(`cinepulse_rail_${D}`);ne&&(K=parseFloat(ne))}catch{}typeof K=="number"&&K>0&&(z.scrollLeft=K,requestAnimationFrame(()=>{z.scrollLeft=K})),z.addEventListener("scroll",()=>{mr.set(D,z.scrollLeft)},{passive:!0})}z.addEventListener("wheel",K=>{Math.abs(K.deltaX)>Math.abs(K.deltaY)||(K.preventDefault(),z.scrollBy({left:K.deltaY*2.5,behavior:"smooth"}))},{passive:!1})})};if(O($),$.querySelectorAll(".spotlight-hero, .spotlight-mini").forEach(U=>{U.addEventListener("click",()=>{const z=U.getAttribute("data-id"),D=U.getAttribute("data-type");z&&D&&(window.location.hash=`#detail?type=${D}&id=${z}`)})}),$.querySelector(".spotlight-hero-btn")?.addEventListener("click",U=>{U.stopPropagation();const z=$.querySelector(".spotlight-hero");if(z){const D=z.getAttribute("data-id"),K=z.getAttribute("data-type");window.location.hash=`#detail?type=${K}&id=${D}`}}),Jo($),y&&!f){const U=$.querySelector(".home-view");y.then(()=>{if({topRatedTV:a,topRatedMovies:o,animeItems:s,docItems:l,kidsAdventures:d,adultAnimationItems:p,cartoonSeriesItems:h,kidsAnimationItems:m,kidsClassicCartoonItems:v}=Xe||{},!U?.isConnected||!(window.location.hash||"#home").startsWith("#home"))return;const z=document.createElement("div");z.className="home-more-rails",z.innerHTML=t?`
            ${Ie({id:"rail-kids-animation",icon:"sparkles",title:"Çocuk Animasyonları & Yeni Çizgi Diziler",accent:"#fb7185",items:m})}
            ${Ie({id:"rail-kids-classics",icon:"palette",title:"Çizgi Dizi Dünyası & Unutulmaz Klasikler",accent:"#38bdf8",items:v})}
            ${Ie({id:"rail-kids-adventures",icon:"compass",title:"⭐ Aile ve Fantastik Sinema Kuşağı",accent:"#38bdf8",items:d})}
            ${Ie({id:"rail-anime",icon:"smile",title:"🎌 Çocuk & Genç Anime Dünyası",accent:"#a855f7",items:s})}
          `:`
            ${Ie({id:"rail-adult-animation",icon:"sparkles",title:"Yetişkin Animasyonları & Çizgi Diziler",accent:"#fb7185",items:p})}
            ${Ie({id:"rail-cartoon-series",icon:"wand-2",title:"Çizgi Dizi Dünyası & Unutulmaz Klasikler",accent:"#38bdf8",items:h})}
            ${Ie({id:"rail-top-movies",icon:"award",title:"⭐ Sinema Tarihinin Başyapıtları (IMDb 8.5+)",accent:"#fbbf24",items:o})}
            ${Ie({id:"rail-top-tv",icon:"star",title:"Kült & En Yüksek Puanlı Diziler",accent:"#34d399",items:a})}
            ${Ie({id:"rail-anime",icon:"sparkles",title:"🎌 Popüler Anime Evreni (TR Dublaj & Altyazı)",accent:"#ec4899",items:s})}
            ${Ie({id:"rail-documentary",icon:"globe",title:"🌍 İlham Veren Kült Belgeseller",accent:"#38bdf8",items:l})}
          `,U.append(z),J(z),ft(z),O(z),Jo(z)})}$.querySelectorAll(".btn-delete-history").forEach(U=>{U.addEventListener("click",z=>{z.stopPropagation();const D=U.closest(".continue-card-wrapper");if(!D)return;const K=D.getAttribute("data-id");Ca(K),Z("İçerik izleme geçmişinden kaldırıldı.","info"),D.style.transition="all 0.28s ease-out",D.style.transform="scale(0.85)",D.style.opacity="0",setTimeout(()=>{D.remove();const ne=$.querySelector("#continue-watching-rail");ne&&ne.children.length===0&&ne.closest(".rail-section")?.remove()},300)})});const G=()=>{if(!(window.location.hash||"#home").startsWith("#home"))return;const U=$.querySelector(".home-view");if(!U?.isConnected)return;const z=Ns(Ks()),D=$.querySelector("#continue-watching-rail")?.closest(".rail-section");if(z&&z.length>0){const ne=z.slice(0,24).map(Q=>`
            <div class="continue-card-wrapper" data-id="${Q.id}" data-season="${Q.season||1}" data-episode="${Q.episode||1}">
              ${kt(Q,{isContinueSection:!0})}
              <button class="btn-delete-history" title="Geçmişten Kaldır" aria-label="Kaldır">
                <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
              </button>
            </div>
          `).join("");if(D){const Q=D.querySelector("#continue-watching-rail");Q&&(Q.innerHTML=ne)}else{const Q=`
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
            `,re=U.querySelector(".hero-slider-section")||U.querySelector(".rail-section");re?re.insertAdjacentHTML("afterend",Q):U.insertAdjacentHTML("afterbegin",Q)}J($),ft($),$.querySelectorAll(".btn-delete-history").forEach(Q=>{Q.addEventListener("click",re=>{re.stopPropagation();const H=Q.closest(".continue-card-wrapper");if(!H)return;const oe=H.getAttribute("data-id");Ca(oe),Z("İçerik izleme geçmişinden kaldırıldı.","info"),H.style.transition="all 0.28s ease-out",H.style.transform="scale(0.85)",H.style.opacity="0",setTimeout(()=>{H.remove();const V=$.querySelector("#continue-watching-rail");V&&V.children.length===0&&V.closest(".rail-section")?.remove()},300)})})}else D&&D.remove()};window.addEventListener("cinepulse_data_changed",G),window.addEventListener("sineflix_data_changed",G)}}}async function Wf({tvId:e,seriesTitle:t,originalTitle:i="",seriesOverview:n="",seasons:r=[],posterPath:a="",backdropPath:o="",isAnime:s=!1,spoilerFree:l=!1}){const d=r.filter(w=>w.season_number>0);d.length===0&&r.length>0&&d.push(r[0]);const p=d.length>0?d[0].season_number:1,h=d.length>0&&d[0].episode_count||10,m=Zr(e,p,h);let v=!!l,y=null;return{html:`
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
          ${d.map(w=>`
            <button class="season-pill ${w.season_number===p?"active":""}" data-season="${w.season_number}" data-ep-count="${w.episode_count||10}">
              ${w.name||`${w.season_number}. Sezon`} <span style="opacity: 0.75; font-size: 0.72rem; margin-left: 0.2rem;">(${w.episode_count} Bölüm)</span>
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
  `,init:w=>{if(!w)return;let f=p,k=h;const x=()=>{const O=w.querySelector("#btn-mark-season-all");if(!O)return;const G=Zr(e,f,k),U=O.querySelector("span"),z=O.querySelector("i");U&&(U.textContent=G?"Bu Sezon İzlendi":"Bu Sezonu İzlendi İşaretle"),z&&z.setAttribute("data-lucide",G?"check-circle-2":"check-check"),G?(O.style.background="rgba(16, 185, 129, 0.2)",O.style.borderColor="#10b981",O.style.color="#10b981"):(O.style.background="",O.style.borderColor="",O.style.color=""),J()};Vn(e,t,n,f,w,a,o,i,d,x,s,v);const L=O=>{if(O&&O.detail&&O.detail.isProgressUpdate&&document.getElementById("player-modal"))return;const G=w.querySelector("#episode-grid-container");G&&(G.querySelectorAll(".episode-card").forEach(U=>{const z=parseInt(U.getAttribute("data-season"),10),D=parseInt(U.getAttribute("data-episode"),10),K=Qt(e,z,D),ne=K?K.progressPercent:0,Q=K?K.completed||ne>=90:!1,re=K&&!Q&&K.currentTime>0,H=U.querySelector(".badge-watched-status"),oe=U.querySelector(".btn-mark-ep-watched"),V=U.querySelector(".card-progress-fill"),W=U.querySelector(".btn-mark-ep-halfway");H&&(Q?(H.innerHTML='<i data-lucide="check" style="width:11px; height:11px"></i> İZLENDİ',H.style.background="var(--accent-green)",H.style.color="#fff",H.style.display="inline-flex"):re?(H.innerHTML='<i data-lucide="clock" style="width:11px; height:11px"></i> YARIDA',H.style.background="rgba(245, 158, 11, 0.95)",H.style.color="#000",H.style.display="inline-flex"):H.style.display="none"),oe&&(Q?(oe.classList.add("watched"),oe.style.background="#10b981",oe.style.borderColor="#10b981",oe.title="İzlendi işaretini kaldır"):(oe.classList.remove("watched"),oe.style.background="rgba(0,0,0,0.65)",oe.style.borderColor="rgba(255,255,255,0.3)",oe.title="İzlendi olarak işaretle")),W&&(W.style.background=re?"#f59e0b":"rgba(0,0,0,0.65)",W.style.borderColor=re?"#f59e0b":"rgba(255,255,255,0.3)"),V&&(V.style.width=`${ne}%`,V.style.background=Q?"var(--accent-green)":"#fbbf24")}),J()),x()};window.addEventListener("sineflix_data_changed",L),w.querySelectorAll(".season-pill").forEach(O=>{O.addEventListener("click",G=>{G.preventDefault(),w.querySelectorAll(".season-pill").forEach(U=>U.classList.remove("active")),O.classList.add("active"),O.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"}),f=parseInt(O.getAttribute("data-season"),10),k=parseInt(O.getAttribute("data-ep-count"),10)||10,Vn(e,t,n,f,w,a,o,i,d,x,s,v),x()})});const S=w.querySelector(".season-pill.active");S&&setTimeout(()=>{S.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})},120);const A=w.querySelector("#season-tabs-bar"),C=w.querySelector("#btn-season-prev"),$=w.querySelector("#btn-season-next");if(A){C?.addEventListener("click",D=>{D.preventDefault(),A.scrollBy({left:-260,behavior:"smooth"})}),$?.addEventListener("click",D=>{D.preventDefault(),A.scrollBy({left:260,behavior:"smooth"})}),A.addEventListener("wheel",D=>{D.deltaY!==0&&A.scrollWidth>A.clientWidth&&(D.preventDefault(),A.scrollLeft+=D.deltaY)},{passive:!1});let O=!1,G=0,U=0,z=!1;A.addEventListener("mousedown",D=>{D.button===0&&(O=!0,z=!1,A.classList.add("dragging"),G=D.pageX-A.offsetLeft,U=A.scrollLeft)}),window.addEventListener("mousemove",D=>{if(!O)return;const ne=(D.pageX-A.offsetLeft-G)*1.5;Math.abs(ne)>4&&(z=!0),A.scrollLeft=U-ne}),window.addEventListener("mouseup",()=>{O&&(O=!1,A.classList.remove("dragging"),setTimeout(()=>{z=!1},50))}),A.addEventListener("click",D=>{z&&(D.preventDefault(),D.stopPropagation())},!0)}const N=w.querySelector("#btn-mark-season-all");N&&N.addEventListener("click",O=>{O.preventDefault();const U=!Zr(e,f,k);fd(e,f,k,U,{title:t,posterPath:a,backdropPath:o,type:s?"anime":"tv",isAnime:s}),Z(U?`${f}. Sezonun tüm bölümleri izlendi!`:`${f}. Sezon izlenmedi olarak işaretlendi.`,U?"success":"info");const z=w.querySelector("#episode-grid-container");z&&(z.querySelectorAll(".episode-card").forEach(D=>{const K=D.querySelector(".badge-watched-status"),ne=D.querySelector(".btn-mark-ep-watched");K&&(K.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',K.style.background="var(--accent-green)",K.style.color="#fff",K.style.display=U?"inline-flex":"none"),ne&&(U?(ne.classList.add("watched"),ne.style.background="#10b981",ne.style.borderColor="#10b981",ne.title="İzlendi işaretini kaldır"):(ne.classList.remove("watched"),ne.style.background="rgba(0,0,0,0.65)",ne.style.borderColor="rgba(255,255,255,0.3)",ne.title="İzlendi olarak işaretle"))}),J()),x()}),y=O=>{v=!!O,Vn(e,t,n,f,w,a,o,i,d,x,s,v)}},setSpoilerSafe(w){v=!!w,y?.(v)}}}function Yf(e){const t=Me().filter(i=>String(i?.id)===String(e)&&(Number(i.currentTime)>0||i.completed||Number(i.progressPercent)>0));return t.length?t.reduce((i,n)=>{const r={season:Math.max(1,Number(n.season)||1),episode:Math.max(1,Number(n.episode)||1)};return r.season>i.season||r.season===i.season&&r.episode>i.episode?r:i},{season:1,episode:1}):{season:1,episode:1}}async function Vn(e,t,i,n,r,a="",o="",s="",l=[],d=null,p=!1,h=!1){const m=r.querySelector("#episode-grid-container");if(!m)return;m.innerHTML=`<div style="padding: 3rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;"><i data-lucide="loader-2" class="spin-loader" style="width: 24px; height: 24px; margin-bottom: 0.5rem;"></i><div>${n}. Sezon bölümleri getiriliyor...</div></div>`,J();let v=null;try{v=await zd(e,n)}catch{}if(!v||!v.episodes||v.episodes.length===0){m.innerHTML=`
      <div style="padding: 3rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;">
        <p style="margin-bottom: 0.75rem;">Bu sezon için bölüm verisi getirilemedi.</p>
        <button id="btn-retry-season-episodes" class="btn-secondary" style="padding: 0.45rem 1rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
          <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
          <span>Tekrar Dene</span>
        </button>
      </div>
    `,J(),r.querySelector("#btn-retry-season-episodes")?.addEventListener("click",()=>{Vn(e,t,i,n,r,a,o,s,l,d,p,h)});return}const y=h?Yf(e):null,b=h?v.episodes.filter(f=>n<y.season||n===y.season&&Number(f.episode_number)<=y.episode+1):v.episodes;if(h&&b.length===0){m.innerHTML='<div class="spoiler-safe-locked"><i data-lucide="shield-check"></i><strong>Bu sezon spoiler korumasında</strong><span>Önceki sezona ilerledikçe bölüm detayları burada açılır.</span></div>',J();return}const w=h?`<div class="spoiler-safe-notice"><i data-lucide="shield-check"></i><span>Spoilersız keşif açık · S${y.season} B${y.episode+1} sonrasının detayları gizli.</span></div>`:"";m.innerHTML=w+b.map(f=>{const k=f.episode_number;let x=(f.name||"").trim();x=x.replace(new RegExp(`^(?:${k}\\s*[\\.\\:\\-]\\s*)+(?:Bölüm\\s*[\\:\\-]\\s*)?`,"i"),""),x=x.replace(new RegExp(`^Bölüm\\s*${k}\\s*[\\:\\-]\\s*`,"i"),""),x=x.trim();const L=x?`${k}. Bölüm: ${x}`:`${k}. Bölüm`;let S=f.overview?f.overview.trim():"";(!S||S.length<5)&&(i&&i.length>10?S=`${k}. Bölüm: ${i}`:S=`${t} ${n}. Sezon ${k}. Bölüm Türkçe Dublaj ve Altyazılı yüksek kalitede kesintisiz HD izle.`);const A=S.length>90,C=it(f.still_path,Ke.STILL_MEDIUM),$=f.air_date||"",N=f.runtime?`${f.runtime} dk`:"",O=Qt(e,n,k),G=O?O.progressPercent:0,U=O?O.completed||G>=90:!1,z=O&&!U&&O.currentTime>0,D=G>0?`
      <div class="card-progress-bar">
        <div class="card-progress-fill" style="width: ${G}%; background: ${U?"var(--accent-green)":"#fbbf24"};"></div>
      </div>
    `:"";let K="";return U?K=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.5rem; left: 0.5rem; background: var(--accent-green); z-index: 4;">
          <i data-lucide="check" style="width:11px; height:11px"></i> İZLENDİ
        </span>
      `:z?K=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.5rem; left: 0.5rem; background: rgba(245, 158, 11, 0.95); color: #000; font-weight: 800; z-index: 4;">
          <i data-lucide="clock" style="width:11px; height:11px"></i> YARIDA
        </span>
      `:K=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.5rem; left: 0.5rem; background: var(--accent-green); display: none; z-index: 4;">
          <i data-lucide="check" style="width:11px; height:11px"></i> İZLENDİ
        </span>
      `,`
      <div class="episode-card" data-tv-id="${e}" data-season="${n}" data-episode="${k}" data-title="${L}">
        <div class="episode-thumb-wrap">
          <img src="${C}" alt="${L}" loading="lazy" onerror="this.onerror=null; this.src='${wt}';" />
          <span class="episode-number-chip">${n}x${k<10?"0"+k:k}</span>
          ${K}
          
          <div class="episode-play-overlay">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--primary-gradient); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.6);">
              <i data-lucide="play" style="width: 20px; height: 20px; fill: #fff; color: #fff; margin-left: 2px;"></i>
            </div>
          </div>

          <!-- Top Right Action Controls: Mark Watched & Halfway -->
          <div style="position: absolute; top: 0.5rem; right: 0.5rem; display: flex; gap: 0.35rem; z-index: 5;">
            <button class="btn-mark-ep-halfway" data-tv-id="${e}" data-season="${n}" data-episode="${k}" title="Yarıda Bırakıldı (20. dk)" style="width: 28px; height: 28px; border-radius: 50%; background: ${z?"#f59e0b":"rgba(0,0,0,0.65)"}; border: 1px solid ${z?"#f59e0b":"rgba(255,255,255,0.3)"}; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
              <i data-lucide="clock" style="width: 13px; height: 13px;"></i>
            </button>

            <button class="btn-mark-ep-watched ${U?"watched":""}" data-tv-id="${e}" data-season="${n}" data-episode="${k}" title="${U?"İzlendi işaretini kaldır":"İzlendi olarak işaretle"}" style="width: 28px; height: 28px; border-radius: 50%; background: ${U?"#10b981":"rgba(0,0,0,0.65)"}; border: 1px solid ${U?"#10b981":"rgba(255,255,255,0.3)"}; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
              <i data-lucide="check" style="width: 14px; height: 14px;"></i>
            </button>
          </div>

          ${D}
        </div>

        <div class="episode-info">
          <div class="episode-header-row">
            <span class="episode-title" title="${L}">${L}</span>
            <span class="episode-duration">${N||$}</span>
          </div>
          
          <div class="episode-overview-container">
            <div class="episode-overview ${A?"truncated":""}" data-full="${S}">
              ${S}
            </div>
            ${A?`
              <button class="btn-toggle-overview" style="color: var(--primary); font-weight: 700; font-size: 0.78rem; margin-top: 0.25rem; display: inline-flex; align-items: center; gap: 0.2rem; cursor: pointer; background: none; border: none; padding: 0;">
                <span>Devamını Oku</span>
                <i data-lucide="chevron-down" style="width: 12px; height: 12px;"></i>
              </button>
            `:""}
          </div>

          <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: auto; padding-top: 0.45rem; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06);">
            <span>${$}</span>
            <span class="btn-play-episode-trigger" style="color: var(--primary); font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.25rem;">
              <span>Oynat</span>
              <i data-lucide="play" style="width: 11px; height: 11px; fill: currentColor;"></i>
            </span>
          </div>
        </div>
      </div>
    `}).join(""),J(),r.querySelectorAll(".btn-toggle-overview").forEach(f=>{f.addEventListener("click",k=>{k.preventDefault(),k.stopPropagation();const x=f.closest(".episode-overview-container"),L=x?x.querySelector(".episode-overview"):null;if(!L)return;const S=f.querySelector("span"),A=f.querySelector("i");L.classList.contains("truncated")?(L.classList.remove("truncated"),S&&(S.textContent="Daralt"),A&&A.setAttribute("data-lucide","chevron-up")):(L.classList.add("truncated"),S&&(S.textContent="Devamını Oku"),A&&A.setAttribute("data-lucide","chevron-down")),J()})}),m.querySelectorAll(".btn-mark-ep-watched").forEach(f=>{f.addEventListener("click",k=>{k.preventDefault(),k.stopPropagation();const x=parseInt(f.getAttribute("data-season"),10),L=parseInt(f.getAttribute("data-episode"),10),S=f.closest(".episode-card"),C=gl(e,x,L,{title:t,posterPath:a,backdropPath:o,type:p?"anime":"tv",isAnime:p}).completed;if(Z(C?`S${x} B${L} izlendi olarak işaretlendi!`:`S${x} B${L} izlendi işareti kaldırıldı.`,C?"success":"info"),C?(f.classList.add("watched"),f.style.background="#10b981",f.style.borderColor="#10b981",f.title="İzlendi işaretini kaldır"):(f.classList.remove("watched"),f.style.background="rgba(0,0,0,0.65)",f.style.borderColor="rgba(255,255,255,0.3)",f.title="İzlendi olarak işaretle"),S){const $=S.querySelector(".badge-watched-status");$&&($.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',$.style.background="var(--accent-green)",$.style.color="#fff",$.style.display=C?"inline-flex":"none")}typeof d=="function"&&d(),J()})}),m.querySelectorAll(".btn-mark-ep-halfway").forEach(f=>{f.addEventListener("click",k=>{k.preventDefault(),k.stopPropagation();const x=parseInt(f.getAttribute("data-season"),10),L=parseInt(f.getAttribute("data-episode"),10),S=f.closest(".episode-card");if(La(e,x,L,1200,{title:t,posterPath:a,backdropPath:o,type:p?"anime":"tv",isAnime:p,duration:2700}),f.style.background="#f59e0b",f.style.borderColor="#f59e0b",S){const A=S.querySelector(".badge-watched-status");A&&(A.innerHTML='<i data-lucide="clock" style="width:12px; height:12px"></i> YARIDA (20:00)',A.style.background="rgba(245, 158, 11, 0.9)",A.style.color="#000",A.style.display="inline-flex")}Z(`S${x} B${L} 20. dakikada yarıda bırakıldı olarak işaretlendi!`,"info"),J()})}),m.querySelectorAll(".episode-card").forEach(f=>{const k=S=>{if(S&&S.target&&(S.target.closest(".btn-mark-ep-watched")||S.target.closest(".btn-mark-ep-halfway")||S.target.closest(".btn-toggle-overview")))return;S&&(S.preventDefault(),S.stopPropagation());const A=parseInt(f.getAttribute("data-season"),10),C=parseInt(f.getAttribute("data-episode"),10),$=f.getAttribute("data-title"),N=Qt(e,A,C),O=N?N.currentTime:0;ti({type:p?"anime":"tv",isAnime:p,tmdbId:e,title:`${t} - S${A}E${C}: ${$}`,seriesTitle:t,originalTitle:s||t,season:A,episode:C,posterPath:a,backdropPath:o,currentTime:O,seasonsList:l,maxEpisodes:v.episodes?v.episodes.length:0})};f.addEventListener("click",k);const x=f.querySelector(".episode-thumb-wrap");x&&x.addEventListener("click",k);const L=f.querySelector(".btn-play-episode-trigger");L&&L.addEventListener("click",k)})}let Jn=null;async function Gf(e,t="",i=""){Si();const n=document.createElement("div");n.id="cast-explorer-modal-root",n.className="cast-explorer-backdrop",document.body.appendChild(n),Jn=n,n.innerHTML=`
    <div class="cast-explorer-dialog">
      <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
      </button>
      <div class="cast-explorer-loading">
        <div class="cast-explorer-spinner"></div>
        <span>${t||"Oyuncu"} bilgileri ve filmografisi yükleniyor...</span>
      </div>
    </div>
  `,J(n);const r=n.querySelector("#btn-close-cast-explorer");r&&(r.onclick=()=>Si()),n.onclick=C=>{C.target===n&&Si()};const a=C=>{C.key==="Escape"&&(Si(),window.removeEventListener("keydown",a))};window.addEventListener("keydown",a);const o=await Od(e);if(!o){n.innerHTML=`
      <div class="cast-explorer-dialog">
        <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
          <i data-lucide="x" style="width: 20px; height: 20px;"></i>
        </button>
        <div class="cast-explorer-loading">
          <i data-lucide="alert-circle" style="width: 36px; height: 36px; color: #ef4444;"></i>
          <span>Oyuncu bilgileri alınamadı.</span>
        </div>
      </div>
    `,J(n);return}const s=o.name||t,l=o.profile_path?it(o.profile_path,Ke.POSTER_MEDIUM):i||tr,d=o.birthday?o.birthday.substring(0,4):"",p=o.place_of_birth||"",h=o.known_for_department==="Acting"?"Oyuncu":o.known_for_department==="Directing"?"Yönetmen":o.known_for_department||"Sanatçı",m=o.biography&&o.biography.trim().length>20?o.biography:`${s}, sinema ve televizyon dünyasında yer aldığı yapımlarla tanınan başarılı bir sanatçıdır.`,v=o.combined_credits?.cast||[],y=o.combined_credits?.crew||[],b=[...v,...y],w=new Set,f=[];for(const C of b){if(!C||!C.id)continue;const $=`${C.media_type||"movie"}_${C.id}`;w.has($)||(w.add($),C.poster_path&&f.push(C))}f.sort((C,$)=>($.popularity||0)-(C.popularity||0));const k=f.filter(C=>C.media_type==="movie"||!C.media_type&&C.title).length,x=f.filter(C=>C.media_type==="tv"||!C.media_type&&C.name).length;n.innerHTML=`
    <div class="cast-explorer-dialog">
      <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
      </button>

      <!-- Actor Hero Header -->
      <div class="cast-explorer-header">
        <div class="cast-explorer-avatar-box">
          <img src="${l}" alt="${s}" class="cast-explorer-avatar" onerror="this.onerror=null; this.src='${tr}';" />
        </div>
        <div class="cast-explorer-bio-box">
          <div class="cast-explorer-name-row">
            <h2>${s}</h2>
            <span class="cast-explorer-dept-tag">${h}</span>
          </div>
          <div class="cast-explorer-meta-row">
            ${d?`<span><i data-lucide="calendar" style="width:13px;height:13px;"></i> D: ${d}</span>`:""}
            ${p?`<span><i data-lucide="map-pin" style="width:13px;height:13px;"></i> ${p}</span>`:""}
            <span><i data-lucide="film" style="width:13px;height:13px;"></i> ${f.length} Yapım</span>
          </div>
          <p class="cast-explorer-bio-text">${m}</p>
        </div>
      </div>

      <!-- Filmography Tabs -->
      <div class="cast-explorer-tabs">
        <button class="cast-tab-btn active" data-filter="all">Tümü (${f.length})</button>
        <button class="cast-tab-btn" data-filter="movie">Filmler (${k})</button>
        <button class="cast-tab-btn" data-filter="tv">Diziler (${x})</button>
      </div>

      <!-- Media Cards Grid -->
      <div class="cast-explorer-grid" id="cast-explorer-grid">
        ${f.map(C=>kt(C)).join("")}
      </div>
    </div>
  `,J(n);const L=n.querySelector("#btn-close-cast-explorer");L&&(L.onclick=()=>Si());const S=n.querySelector("#cast-explorer-grid");S&&(ft(S),S.addEventListener("click",()=>{setTimeout(()=>Si(),150)}));const A=n.querySelectorAll(".cast-tab-btn");A.forEach(C=>{C.onclick=()=>{A.forEach(O=>O.classList.remove("active")),C.classList.add("active");const $=C.getAttribute("data-filter");let N=f;$==="movie"?N=f.filter(O=>O.media_type==="movie"||!O.media_type&&O.title):$==="tv"&&(N=f.filter(O=>O.media_type==="tv"||!O.media_type&&O.name)),S&&(S.innerHTML=N.length>0?N.map(O=>kt(O)).join(""):'<div class="cast-empty-state">Bu kategoride yapım bulunamadı.</div>',J(S))}})}function Si(){if(Jn){try{Jn.remove()}catch{}Jn=null}}const Vf="https://api.tvmaze.com",Jf=5500,Lc=30*60*1e3,$c="cinepulse_tvmaze_cache_v1",vn=new Map;function Xf(){try{const e=sessionStorage.getItem($c);if(!e)return;const t=JSON.parse(e);t&&typeof t=="object"&&Object.entries(t).forEach(([i,n])=>{n?.savedAt&&Date.now()-n.savedAt<Lc&&vn.set(i,n)})}catch{}}function Zf(){try{const e={};let t=0;for(const[i,n]of vn.entries()){if(t++>=80)break;e[i]=n}sessionStorage.setItem($c,JSON.stringify(e))}catch{}}function Ts(e){const t=vn.get(e);if(t){if(Date.now()-t.savedAt>Lc){vn.delete(e);return}return t.data}}function As(e,t){vn.set(e,{savedAt:Date.now(),data:t}),Zf()}async function vr(e){try{const t=await fetch(`${Vf}${e}`,{headers:{Accept:"application/json"},signal:AbortSignal.timeout(Jf)});return t.ok?await t.json():null}catch{return null}}function Xo(e){return String(e||"").toLowerCase().replace(/[^a-z0-9çğıöşü ]/gi," ").replace(/\s+/g," ").trim()}function Rc(e,t){const i=Xo(e),n=Xo(t);return!i||!n?!1:i===n?!0:i.includes(n)||n.includes(i)}function Zo(e){return e?{season:e.season??null,number:e.number??null,name:e.name||"",airdate:e.airdate||"",airstamp:e.airstamp||"",runtime:e.runtime||null}:null}function Qf(e){switch(e){case"Running":return"Devam ediyor";case"Ended":return"Sonlandı";case"To Be Determined":return"Belirsiz";case"In Development":return"Yapım aşamasında";default:return e||""}}async function eh(e){const t=`lookup:${e}`,i=Ts(t);if(i!==void 0)return i;const n=await vr(`/lookup/shows?${e}`);return As(t,n||null),n||null}async function Ic(e){if(!e)return null;const t=`show:${e}`,i=Ts(t);if(i!==void 0)return i;const n=await vr(`/shows/${e}?embed[]=nextepisode&embed[]=previousepisode`),r=n?{tvmazeId:n.id,name:n.name||"",status:n.status||"",statusLabel:Qf(n.status),premiered:n.premiered||"",officialSite:n.officialSite||"",thetvdbId:n.externals?.thetvdb??null,imdbId:n.externals?.imdb||"",nextEpisode:Zo(n._embedded?.nextepisode),previousEpisode:Zo(n._embedded?.previousepisode)}:null;return As(t,r),r}async function th(e){const t=String(e||"").trim();if(!t)return null;const i=t.startsWith("tt")?t:`tt${t}`,r=(await eh(`imdb=${encodeURIComponent(i)}`))?.id||null;return r?Ic(r):null}function Mc(e,t){const i=parseInt(String(e?.premiered||"").substring(0,4),10),n=parseInt(String(t||""),10);return!n||!i?0:Math.abs(i-n)}function ih(e,t,i){let n=null,r=1/0;for(const a of e){if(!a||!Rc(a.name,t))continue;const o=Mc(a,i);if(o>1)continue;const s=o*10+(a.status==="Running"?0:1);s<r&&(r=s,n=a)}return n}async function nh(e,t){const i=String(e||"").trim();if(i.length<2)return null;const n=`search:${i}:${t||""}`,r=Ts(n);if(r!==void 0)return r;let a=null;const o=await vr(`/singlesearch/shows?q=${encodeURIComponent(i)}`);if(o&&Rc(o.name,i)&&Mc(o,t)<=1&&(a=o),!a){const l=await vr(`/search/shows?q=${encodeURIComponent(i)}`),d=Array.isArray(l)?l.map(p=>p?.show).filter(Boolean):[];a=ih(d,i,t)}const s=a?await Ic(a.id):null;return As(n,s),s}async function rh({imdbId:e,title:t,year:i}={}){let n=await th(e);if(n||(n=await nh(t,i)),!n)return null;const r=n.nextEpisode;return{showName:n.name,statusLabel:n.statusLabel,officialSite:n.officialSite,nextEpisode:r,previousEpisode:n.previousEpisode,nextLabel:r?ah(r):"",nextAirdateLabel:r?oh(r.airdate,r.airstamp):""}}function ah(e){if(!e)return"";const t=e.season!==null&&e.season!==void 0,i=e.number!==null&&e.number!==void 0,n=t&&e.season>=1900;return t&&!n&&i?`S${e.season} B${e.number}`:n&&e.name?e.name:i?`B${e.number}`:e.name||""}const sh=["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];function oh(e,t){const i=t?new Date(t):e?new Date(`${e}T21:00:00`):null;if(!i||Number.isNaN(i.getTime()))return e||"";const n=new Date,r=s=>new Date(s.getFullYear(),s.getMonth(),s.getDate()).getTime(),a=Math.round((r(i)-r(n))/864e5),o=t?`${String(i.getHours()).padStart(2,"0")}:${String(i.getMinutes()).padStart(2,"0")}`:"";return a<0?"Yayınlandı":a===0?o?`Bugün ${o}`:"Bugün":a===1?o?`Yarın ${o}`:"Yarın":a<=7?`${a} gün sonra`:`${i.getDate()} ${sh[i.getMonth()]}`}Xf();const Qo="cinepulse.decision-room.autoplay";function lh(e,t){try{const i=JSON.parse(sessionStorage.getItem(Qo)||"null");return sessionStorage.removeItem(Qo),i&&String(i.id)===String(t)&&i.type===e&&Date.now()-Number(i.createdAt||0)<15e3?i:null}catch{return null}}function ch(e){if(!e||e<=0)return"";const t=Math.floor(e/60),i=e%60;return t>0?`${t} sa ${i>0?i+" dk":""} (${e} dk)`:`${e} dk`}async function dh(e="tv",t){const i=typeof e=="object"&&e!==null?e.type||"tv":e||"tv",n=typeof e=="object"&&e!==null?e.id:t;let r=i==="series"||i==="tv"||i==="anime"?"tv":i==="movie"?"movie":"tv",a=await Zs(r,n);if(a||(r=r==="tv"?"movie":"tv",a=await Zs(r,n)),!a)return{html:'<div class="container" style="padding: 10rem 0; text-align: center;"><h2>İçerik bulunamadı.</h2></div>',init:()=>{}};const o=!!(a.seasons&&a.seasons.length>0)||r==="tv",s=o?"tv":"movie",l=Es(a)||i==="anime"||r==="anime"||He(n);l&&we(n);const d=a.title||a.name||"Detay",p=a.original_title||a.original_name||"",h=it(a.backdrop_path,Ke.BACKDROP_ORIGINAL),m=it(a.poster_path,Ke.POSTER_MEDIUM),v=a.vote_average?a.vote_average.toFixed(1):"8.5",y=(a.first_air_date||a.release_date||"").substring(0,4),b=a.overview&&a.overview.trim().length>15?a.overview:Ne(a,s),w=a.genres||[],f=a.runtime?a.runtime*60:6600,k=md(n),x=as(n),L=s==="tv"?Qr(n):null,S=s==="movie"?Qt(n,1,1):null,A=s==="movie"?mn(n,1,1):!1,C=s==="tv"?Xr(n,a.seasons||[]):!1,$=s==="movie"?A:C;let N=s==="movie"?"Filmi İzle":"1. Sezon 1. Bölümü İzle";if(s==="tv"&&L){const X=ci(L.currentTime);N=`Devam Et <span class="play-btn-subinfo">S${L.season} B${L.episode}${X?" • "+X:""}</span>`}else s==="movie"&&S&&S.currentTime>0&&(N=`Devam Et <span class="play-btn-subinfo">${ci(S.currentTime)}</span>`);const O=a.credits?.crew?a.credits.crew.filter(X=>X.job==="Director").map(X=>X.name):[],G=a.created_by?a.created_by.map(X=>X.name):[],U=O.length>0?O.slice(0,2).join(", "):G.length>0?G.slice(0,2).join(", "):"",z=(parseFloat(v)/2).toFixed(1),D=Math.floor(z),K=z%1>=.4,ne="★".repeat(Math.min(5,D))+(K&&D<5?"½":""),Q=a.credits&&a.credits.cast?a.credits.cast.slice(0,10):[];let re=null,H=!1;s==="tv"&&a.seasons&&(re=await Wf({tvId:n,seriesTitle:d,originalTitle:p,seriesOverview:b,seasons:a.seasons,posterPath:a.poster_path,backdropPath:a.backdrop_path,isAnime:l,spoilerFree:H}));const oe=a.recommendations?a.recommendations.results.slice(0,6):[],V=s==="movie"?A?"Film İzlendi":"İzlendi Olarak İşaretle":C?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle",W=a.runtime?`
    <span class="badge" style="background: rgba(245, 158, 11, 0.18); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); font-weight: 700; display: inline-flex; align-items: center; gap: 0.35rem;">
      <i data-lucide="clock" style="width:13px; height:13px"></i>
      <span>${ch(a.runtime)}</span>
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
              <img class="detail-poster-img" src="${m}" alt="${d}" onerror="this.onerror=null; this.src='${wt}';" />
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
                ${W}
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
                ${U?`
                  <span class="detail-director-pill">
                    <strong style="color: var(--primary);">${s==="tv"?"YARATICI":"YÖNETMEN"}:</strong> ${U}
                  </span>
                `:""}
              </div>

              <!-- Genres -->
              <div class="detail-genre-row">
                ${w.map(X=>`<span class="detail-genre-chip">${X.name}</span>`).join("")}
              </div>

              <!-- Storyline -->
              <div class="detail-storyline-wrapper">
                <p class="detail-storyline truncated" id="detail-storyline-text">${b}</p>
                ${b.length>120?'<button class="btn-storyline-expand" id="btn-expand-storyline"><span>Devamını Oku</span><i data-lucide="chevron-down" style="width:14px;height:14px"></i></button>':""}
              </div>

              ${s==="tv"?'<label class="spoiler-discovery-toggle"><input id="detail-spoiler-free-toggle" type="checkbox" /><span><i data-lucide="shield-check"></i><b>Spoilersız keşfet</b><small>İzleme ilerlemenin sonrasındaki bölüm başlıkları, görselleri ve özetleri gizlenir.</small></span></label>':""}

              <!-- Oyuncular & Sanatçılar (Letterboxd & Pentagram Style Carousel with PC Mouse Scroll & Nav Buttons) -->
              ${Q.length>0?`
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
                    ${Q.map(X=>{const I=X.profile_path?it(X.profile_path,Ke.POSTER_SMALL):tr,M=X.character?X.character.split("/")[0].trim():"";return`
                        <div class="detail-actor-pill" data-person-id="${X.id}" data-person-name="${X.name}" title="${X.name}${M?" ("+M+")":""} • Filmografiyi Gör" style="cursor: pointer;">
                          <img src="${I}" alt="${X.name}" class="detail-actor-avatar" onerror="this.onerror=null; this.src='${tr}';" />
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
                  <button class="btn-action-tile ${k?"active-fav":""}" id="btn-toggle-fav">
                    <i data-lucide="heart" style="${k?"fill: var(--primary); color: var(--primary)":""}"></i>
                    <span>${k?"Favorilerimde":"Favori"}</span>
                  </button>

                  <button class="btn-action-tile ${x?"active-watch":""}" id="btn-toggle-watchlist">
                    <i data-lucide="${x?"check":"plus"}"></i>
                    <span>${x?"Listemde":"Listem"}</span>
                  </button>

                  <button class="btn-action-tile ${$?"active-watched":""}" id="btn-toggle-watched-detail">
                    <i data-lucide="${$?"check-circle-2":"check"}"></i>
                    <span>${V}</span>
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

          ${oe.length>0?`
            <div style="margin-top: 4rem;">
              <h2 class="section-title" style="margin-bottom: 1.5rem;">
                <i data-lucide="thumbs-up"></i> Benzer Önerilen Yapımlar
              </h2>
              <div class="media-grid">
                ${oe.map(X=>kt(X)).join("")}
              </div>
            </div>
          `:""}
        </div>
      </section>
    </div>
  `,init:X=>{if(!X)return;let I=lh(s,n);const M=X.querySelector("#btn-detail-back");M&&M.addEventListener("click",le=>{le.preventDefault(),window.history.length>1?window.history.back():window.location.hash="#home"}),re&&re.init(X);const P=X.querySelector("#detail-spoiler-free-toggle");P&&(P.checked=H,P.addEventListener("change",()=>{H=P.checked,re?.setSpoilerSafe(H),Z(H?"Spoilersız keşif açıldı. Sonraki bölüm detayları gizlendi.":"Spoilersız keşif kapatıldı.","info")}));const j=X.querySelector("#btn-play-movie"),ie=async()=>{if(!j||j.disabled)return;j.disabled=!0;const le=j.innerHTML;j.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px;fill:currentColor"></i> <span>Yükleniyor...</span>',J();try{const g=Qt(n,1,1);await ti({type:l?"anime":"movie",isAnime:l,tmdbId:n,title:d,seriesTitle:d,originalTitle:p,posterPath:a.poster_path,backdropPath:a.backdrop_path,duration:f,currentTime:g?g.currentTime:0,roomSync:I?{roomCode:I.roomCode,mediaId:n,type:s,season:1,episode:1,initialSync:I.initialSync||null}:null})}catch{Z("Film açılırken hata oluştu, lütfen tekrar deneyin.","error")}finally{j.disabled=!1,j.innerHTML=le,J()}};j&&j.addEventListener("click",ie);const E=X.querySelector("#btn-resume-series"),T=async()=>{if(!E||E.disabled)return;E.disabled=!0;const le=E.innerHTML;E.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px;fill:currentColor"></i> <span>Yükleniyor...</span>',J();try{const g=I;I=null;const c=Qr(n),u=g?.season||(c?c.season:1),_=g?.episode||(c?c.episode:1),R=g?0:c?c.currentTime:0;await ti({type:l?"anime":"tv",isAnime:l,tmdbId:n,title:`${d} - S${u}E${_}`,seriesTitle:d,originalTitle:p,season:u,episode:_,posterPath:a.poster_path,backdropPath:a.backdrop_path,currentTime:R,seasonsList:a.seasons||[],roomSync:g?{roomCode:g.roomCode,mediaId:n,type:s,season:u,episode:_,initialSync:g.initialSync||null}:null})}catch{Z("İçerik açılırken hata oluştu, lütfen tekrar deneyin.","error")}finally{E.disabled=!1,E.innerHTML=le,J()}};E&&E.addEventListener("click",le=>{le.preventDefault(),T()}),I&&window.setTimeout(()=>{s==="movie"?ie():T()},0);const q=X.querySelector("#btn-watch-trailer");q&&q.addEventListener("click",async()=>{q.disabled=!0;const le=q.innerHTML;q.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px"></i> <span>Yükleniyor...</span>',J();try{const g=await gn(s,n,d);g?Ec({title:d,trailerInfo:g,mediaId:n,mediaType:l?"anime":s}):Z("Bu yapım için resmi fragman bulunamadı.","info")}catch{Z("Fragman yüklenirken bir hata oluştu.","error")}finally{q.disabled=!1,q.innerHTML=le,J()}});const ee=X.querySelector("#btn-toggle-fav");ee&&ee.addEventListener("click",()=>{const le=gd({...a,type:l?"anime":s,isAnime:l,media_type:s});Z(le?"Favorilere eklendi!":"Favorilerden çıkarıldı.",le?"success":"info");const g=ee.querySelector("i"),c=ee.querySelector("span");g&&c&&(g.style.fill=le?"var(--primary)":"none",g.style.color=le?"var(--primary)":"currentColor",c.textContent=le?"Favorilerimde":"Favorilere Ekle")});const ye=X.querySelector("#btn-toggle-watchlist");ye&&ye.addEventListener("click",()=>{const le=vl({...a,type:l?"anime":s,isAnime:l,media_type:s});Z(le?"İzleme listesine eklendi!":"İzleme listesinden çıkarıldı.",le?"success":"info");const g=ye.querySelector("i"),c=ye.querySelector("span");g&&c&&(g.setAttribute("data-lucide",le?"check":"plus"),J(),c.textContent=le?"Listemde":"İzleme Listeme Ekle")});const se=X.querySelector("#btn-toggle-watched-detail");se&&se.addEventListener("click",le=>{if(le.preventDefault(),s==="movie"){const c=gl(n,1,1,{title:d,posterPath:a.poster_path,backdropPath:a.backdrop_path,type:"movie",duration:f}).completed;Z(c?"✓ Film izlendi olarak işaretlendi!":"Film izlendi işareti kaldırıldı.",c?"success":"info"),c?se.classList.add("btn-watched-active"):se.classList.remove("btn-watched-active"),se.innerHTML=`
              <i data-lucide="${c?"check-circle-2":"check"}"></i>
              <span>${c?"Film İzlendi":"İzlendi Olarak İşaretle"}</span>
            `,J()}else{const c=!Xr(n,a.seasons||[]);pd(n,a.seasons||[],c,{title:d,posterPath:a.poster_path,backdropPath:a.backdrop_path,type:l?"anime":"tv",isAnime:l}),Z(c?"✓ Dizinin tüm bölümleri izlendi olarak işaretlendi!":"Tüm bölümler izlenmedi yapıldı.",c?"success":"info"),c?se.classList.add("btn-watched-active"):se.classList.remove("btn-watched-active"),se.innerHTML=`
              <i data-lucide="${c?"check-circle-2":"check"}"></i>
              <span>${c?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle"}</span>
            `,J(),X.querySelectorAll(".episode-card").forEach(_=>{const R=_.querySelector(".badge-watched-status"),B=_.querySelector(".btn-mark-ep-watched");R&&(R.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',R.style.background="var(--accent-green)",R.style.color="#fff",R.style.display=c?"inline-flex":"none"),B&&(c?(B.classList.add("watched"),B.style.background="#10b981",B.style.borderColor="#10b981"):(B.classList.remove("watched"),B.style.background="rgba(0,0,0,0.65)",B.style.borderColor="rgba(255,255,255,0.3)"))});const u=X.querySelector("#btn-mark-season-all");if(u){const _=u.querySelector("span"),R=u.querySelector("i");_&&(_.textContent=c?"Bu Sezon İzlendi":"Bu Sezonu İzlendi İşaretle"),R&&R.setAttribute("data-lucide",c?"check-circle-2":"check-check"),c?(u.style.background="rgba(16, 185, 129, 0.2)",u.style.borderColor="#10b981",u.style.color="#10b981"):(u.style.background="",u.style.borderColor="",u.style.color="")}J()}});const me=le=>{if(le&&le.detail&&le.detail.isProgressUpdate&&document.getElementById("player-modal"))return;const g=s==="movie"?mn(n,1,1):!1,c=s==="tv"?Xr(n,a.seasons||[]):!1,u=s==="movie"?g:c;if(se){u?se.classList.add("btn-watched-active"):se.classList.remove("btn-watched-active");const B=s==="movie"?u?"Film İzlendi":"İzlendi Olarak İşaretle":u?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle";se.innerHTML=`
            <i data-lucide="${u?"check-circle-2":"check"}"></i>
            <span>${B}</span>
          `}const _=X.querySelector("#btn-play-movie");if(_&&s==="movie"){const B=Qt(n,1,1);if(B&&B.currentTime>0&&!B.completed){const F=ci(B.currentTime);_.innerHTML=`<i data-lucide="play" style="fill:currentColor"></i> <span>Devam Et <span class="play-btn-subinfo">${F}</span></span>`}}const R=X.querySelector("#btn-resume-series");if(R&&s==="tv"){const B=Qr(n);if(B){const F=ci(B.currentTime);R.innerHTML=`<i data-lucide="play" style="fill:currentColor"></i> <span>Devam Et <span class="play-btn-subinfo">S${B.season} B${B.episode}${F?" • "+F:""}</span></span>`}}J()};window.addEventListener("sineflix_data_changed",me);const Ye=X.querySelector("#btn-mark-halfway-detail");Ye&&Ye.addEventListener("click",le=>{if(le.preventDefault(),s==="movie"){const g=Math.round(f*.5),c=ci(g);La(n,1,1,g,{title:d,posterPath:a.poster_path,backdropPath:a.backdrop_path,type:l?"anime":"movie",isAnime:l,duration:f}),Z(`⏳ Film ${c} dakikasında yarıda bırakıldı olarak işaretlendi!`,"info");const u=X.querySelector("#btn-play-movie span");u&&(u.textContent=`Kaldığın Yerden Devam Et (${c})`)}else{const g=L?L.season:1,c=L?L.episode:1;La(n,g,c,1200,{title:d,posterPath:a.poster_path,backdropPath:a.backdrop_path,type:l?"anime":"tv",isAnime:l,duration:3e3}),Z(`⏳ S${g} B${c} 20. dakikada yarıda bırakıldı olarak işaretlendi!`,"info");const u=X.querySelector("#btn-resume-series span");u&&(u.textContent=`Kaldığın Yerden Devam Et (S${g} B${c} • 20:00)`)}});const De=X.querySelector("#btn-expand-storyline"),lt=X.querySelector("#detail-storyline-text");De&&lt&&De.addEventListener("click",()=>{const le=!lt.classList.contains("truncated");lt.classList.toggle("truncated");const g=De.querySelector("span"),c=De.querySelector("i");g&&(g.textContent=le?"Devamını Oku":"Daralt"),c&&(c.style.transform=le?"rotate(0deg)":"rotate(180deg)")});const Ee=X.querySelector("#detail-cast-rail"),Ae=X.querySelector("#btn-cast-prev"),Ve=X.querySelector("#btn-cast-next");if(Ee){Ae&&Ae.addEventListener("click",_=>{_.preventDefault(),Ee.scrollBy({left:-280,behavior:"smooth"})}),Ve&&Ve.addEventListener("click",_=>{_.preventDefault(),Ee.scrollBy({left:280,behavior:"smooth"})}),Ee.addEventListener("wheel",_=>{_.deltaY!==0&&(_.preventDefault(),Ee.scrollLeft+=_.deltaY)},{passive:!1});let le=!1,g=0,c=0;Ee.addEventListener("mousedown",_=>{le=!0,Ee.classList.add("dragging"),g=_.pageX-Ee.offsetLeft,c=Ee.scrollLeft});const u=()=>{le=!1,Ee.classList.remove("dragging")};Ee.addEventListener("mouseleave",u),Ee.addEventListener("mouseup",u),Ee.addEventListener("mousemove",_=>{if(!le)return;_.preventDefault();const B=(_.pageX-Ee.offsetLeft-g)*1.5;Ee.scrollLeft=c-B}),Ee.querySelectorAll(".detail-actor-pill").forEach(_=>{_.addEventListener("click",R=>{R.preventDefault();const B=_.getAttribute("data-person-id"),F=_.getAttribute("data-person-name");B&&Gf(B,F)})})}const Je=X.querySelector("#detail-next-episode-badge");Je&&s==="tv"&&(async()=>{try{const le=await rh({imdbId:a.external_ids?.imdb_id,title:p||d,year:y});if(!le?.nextEpisode||!Je.isConnected)return;const g=le.nextLabel||"",c=le.nextAirdateLabel||"";if(!g&&!c||c==="Yayınlandı")return;const u=[g?`Yeni bölüm ${g}`:"Yeni bölüm",c].filter(Boolean).join(" • ");Je.innerHTML=`<i data-lucide="calendar-clock" style="width:13px; height:13px"></i><span>${u}</span>`,Je.title=`Sonraki bölüm: ${g||"-"}${le.nextEpisode.name?" — "+le.nextEpisode.name:""}${c?" • "+c:""} (Kaynak: TVmaze)`,Je.style.display="inline-flex",J(Je)}catch{}})();const $e=X.querySelector(".media-grid");$e&&ft($e)}}}const uh="cinepulse_offline_db",ph=1,tt="downloads",hi="cinepulse-offline-media-v1";let On=null,pn=[];const br=new Map,Nn=new Map;async function qr(e,t={},i=12e4){const n=new AbortController,r=t.signal,a=()=>n.abort();if(r?.aborted)throw new Error("İndirme iptal edildi");r?.addEventListener("abort",a,{once:!0});let o=!1;const s=setTimeout(()=>{o=!0,n.abort()},i);try{return await fetch(e,{...t,signal:n.signal})}catch(l){throw r?.aborted?new Error("İndirme iptal edildi"):o?new Error("Yayın kaynağı yanıt vermedi. İndirme durduruldu."):l}finally{clearTimeout(s),r?.removeEventListener("abort",a)}}function Pc(e){return Fi().then(t=>new Promise((i,n)=>{const r=t.transaction(tt,"readonly").objectStore(tt).get(e);r.onsuccess=()=>i(r.result||null),r.onerror=()=>n(r.error)}))}function Cs(e,t){return new Request(new URL(`/__cinepulse_offline__/${encodeURIComponent(e)}/${t}`,location.origin))}function wr(e){return new Request(new URL(`/__cinepulse_offline_posters__/${encodeURIComponent(e)}`,location.origin))}function fh(e){return!e||e==="null"||e==="undefined"||e.startsWith("data:")?"":/^https?:\/\//i.test(e)?e:e.startsWith("/api/")?nt(e):`https://image.tmdb.org/t/p/w342/${e.replace(/^\/+/,"")}`}async function Bc(e,t){if(!e||!t||t.startsWith("data:"))return!1;if(Nn.has(e))return Nn.get(e);const i=(async()=>{const n=await caches.open(hi),r=wr(e);if(await n.match(r))return!0;const a=fh(t);if(!a)return!1;const o=[a];a.startsWith(nt("/"))||o.push(nt(`/api/img_proxy?url=${encodeURIComponent(a)}`));for(const s of o)try{const l=await qr(s,{cache:"no-store"},12e3),d=l.headers.get("content-type")||"";if(!l.ok||!d.startsWith("image/"))continue;return await n.put(r,l.clone()),!0}catch{}return!1})().finally(()=>Nn.delete(e));return Nn.set(e,i),i}async function hh(e,t=""){if(!e)return"";const i=br.get(e);if(i)return i;try{const n=await caches.open(hi);let r=await n.match(wr(e));if(!r&&t&&navigator.onLine!==!1&&(await Bc(e,t),r=await n.match(wr(e))),!r)return"";const a=URL.createObjectURL(await r.blob());return br.set(e,a),a}catch{return""}}function Ls(e){if(!e||typeof e!="string")return{target:null,ref:null};try{const t=e.startsWith("http")?e:`http://localhost${e.startsWith("/")?"":"/"}${e}`,i=new URL(t),n=i.searchParams.get("url"),r=i.searchParams.get("ref");return{target:n||null,ref:r||null}}catch{return{target:null,ref:null}}}async function mh(){try{const e=window.CinePulseNative?.getDeviceStorageInfo?.();if(e){const t=JSON.parse(e);if(Number.isFinite(t.total)&&Number.isFinite(t.free))return t}}catch{}try{const{quota:e=0,usage:t=0}=await navigator.storage.estimate();return{total:e,free:Math.max(0,e-t),isOriginQuota:!0}}catch{return{total:0,free:0,isOriginQuota:!0}}}function Qa(e,t){const i=(e||"").trim();if(!i)return"";if(i.startsWith("/api/hls_proxy?"))return nt(i);if(/^https?:\/\//i.test(i)&&i.includes("/api/hls_proxy?"))return i;try{const{target:n,ref:r}=Ls(t),a=new URL(i,n||t).href;return a.includes("/api/hls_proxy?")?a:nt(`/api/hls_proxy?url=${encodeURIComponent(a)}${r?`&ref=${encodeURIComponent(r)}`:""}`)}catch{return i}}function Dc(e){if(e.startsWith("/api/"))return nt(e);if(!/^https?:\/\//i.test(e)||e.includes("/api/hls_proxy?"))return e;const{target:t,ref:i}=Ls(e),n=t||e,r=/\.m3u8(?:[?#]|$)/i.test(n);return nt(`/api/hls_proxy?url=${encodeURIComponent(n)}${i?`&ref=${encodeURIComponent(i)}`:""}${r?"":"&download=1"}`)}function pm(e,t="video.mp4"){if(!e)return!1;const i=typeof e=="string"&&e.startsWith("/api/")?nt(e):e;try{const n=document.createElement("a");return n.href=i,n.setAttribute("download",t),n.setAttribute("target","_blank"),n.rel="noopener noreferrer",n.style.display="none",document.body.appendChild(n),n.click(),setTimeout(()=>{try{n.remove()}catch{}},1e3),!0}catch{try{return window.open(i,"_system"),!0}catch{return window.location.href=i,!0}}}async function gh(e,t,i,n,r,a,o=null){if(o?.aborted)throw new Error("İndirme iptal edildi");let s=null;const{target:l,ref:d}=Ls(n),p=[],h=n.startsWith("/api/")?nt(n):n;p.push(h),l&&/^https?:\/\//i.test(l)?p.push(nt(`/api/hls_proxy?url=${encodeURIComponent(l)}${d?`&ref=${encodeURIComponent(d)}`:""}`)):n.includes("/api/hls_proxy")||p.push(Dc(n));let m=null;for(let y=0;y<p.length;y++){if(o?.aborted)throw new Error("İndirme iptal edildi");const b=p[y];try{if(s=await qr(b,{cache:"no-store",signal:o}),s&&s.ok)break}catch(w){if(w.name==="AbortError"||o?.aborted)throw new Error("İndirme iptal edildi");m=w,y<p.length-1&&await new Promise(f=>setTimeout(f,250*(y+1)))}}if(!s||!s.ok)throw new Error(`Bölüm parçası indirilemedi (HTTP ${s?.status||m?.message||"ağ hatası"})`);const v=await s.blob();return await e.put(Cs(t,i),new Response(v,{headers:{"Content-Type":s.headers.get("content-type")||"application/octet-stream"}})),a.loaded+=v.size,a.done+=1,r({percent:0,loaded:a.loaded,total:0,done:a.done,count:a.count,status:`${a.done}/${a.count} parça alındı`}),v.size}function el(e,t){const i=e.split(/\r?\n/),n=[];for(let r=0;r<i.length;r+=1){if(!i[r].startsWith("#EXT-X-STREAM-INF:"))continue;const a=Number(i[r].match(/(?:AVERAGE-)?BANDWIDTH=(\d+)/)?.[1])||0,o=i.slice(r+1).find(s=>s&&!s.startsWith("#"));o&&n.push({bandwidth:a,url:Qa(o.trim(),t)})}return n.length?(n.sort((r,a)=>Math.abs(r.bandwidth-22e5)-Math.abs(a.bandwidth-22e5)),n[0]?.url||null):null}async function yh(e,t,i,n,r,a=null){let o=i.url||i.url,s=n,l=el(s,o),d=0;for(;l&&d<3;){if(a?.aborted)throw new Error("İndirme iptal edildi");d++;const S=await qr(l,{cache:"no-store",signal:a});if(!S.ok)throw new Error(`Bölüm listesi alınamadı (HTTP ${S.status})`);o=S.url||l,s=await S.text(),l=el(s,o)}if(s.includes("#EXT-X-ENDLIST")||(s+=`
#EXT-X-ENDLIST
`),s.includes("#EXT-X-BYTERANGE"))throw new Error("Bu kaynak parçalı byte aralığı kullanıyor; başka bir yayın hattı seçin.");const p=s.split(/\r?\n/),h=[],m=[];let v=0;for(const S of p){if(!S){m.push(S);continue}if(S.startsWith("#EXT-X-BYTERANGE"))throw new Error("Bu kaynak parçalı byte aralığı kullanıyor; başka bir yayın hattı seçin.");if(S.startsWith("#EXT-X-KEY:")||S.startsWith("#EXT-X-MAP:")){const A=S.match(/URI="([^"]+)"/);if(A){const C=v++,$=Qa(A[1],o);h.push({index:C,url:$}),m.push(S.replace(A[0],`URI="__CP_OFFLINE_RESOURCE_${C}__"`))}else m.push(S);continue}if(S.startsWith("#"))m.push(S);else{const A=v++,C=Qa(S.trim(),o);h.push({index:A,url:C}),m.push(`__CP_OFFLINE_RESOURCE_${A}__`)}}const y=h.length;if(!y)throw new Error("Bu bölümde indirilebilir video parçası bulunamadı.");const b={done:0,count:y,loaded:0},w=h.map(S=>S.index),f=4;let k=0;async function x(){for(;k<h.length;){if(a?.aborted)throw new Error("İndirme iptal edildi");const S=h[k++];if(!S)break;await gh(e,t,S.index,S.url,r,b,a)}}const L=Array.from({length:Math.min(f,h.length)},()=>x());return await Promise.all(L),{playlistTemplate:m.join(`
`),resourceKeys:w,sizeBytes:b.loaded}}function Fi(){return On?Promise.resolve(On):new Promise((e,t)=>{const i=indexedDB.open(uh,ph);i.onupgradeneeded=n=>{const r=n.target.result;if(!r.objectStoreNames.contains(tt)){const a=r.createObjectStore(tt,{keyPath:"key"});a.createIndex("tmdbId","tmdbId",{unique:!1}),a.createIndex("downloadedAt","downloadedAt",{unique:!1})}},i.onsuccess=()=>{On=i.result,e(On)},i.onerror=()=>t(i.error)})}function Fr(e,t=null,i=null){return t!==null&&i!==null&&t!==void 0&&i!==void 0?`${e}_s${t}_e${i}`:String(e)}async function $s(){try{const e=await Fi();return new Promise((t,i)=>{const a=e.transaction(tt,"readonly").objectStore(tt).getAll();a.onsuccess=()=>{const o=a.result||[];o.sort((s,l)=>(l.downloadedAt||0)-(s.downloadedAt||0)),t(o)},a.onerror=()=>i(a.error)})}catch{return[]}}async function fm(e,t=null,i=null){try{const n=await Fi(),r=Fr(e,t,i);return new Promise(a=>{const l=n.transaction(tt,"readonly").objectStore(tt).get(r);l.onsuccess=()=>a(!!l.result),l.onerror=()=>a(!1)})}catch{return!1}}async function zc(e,t=null,i=null){try{const n=Fr(e,t,i),r=await Pc(n);if(!r||!("caches"in window))return null;const a=await caches.open(hi);if(r.mediaKind==="hls"){let s=r.playlistTemplate||"";for(const d of r.resourceKeys||[]){const p=await a.match(Cs(n,d));if(!p)throw new Error("İndirilen bölüm dosyası eksik.");const h=URL.createObjectURL(await p.blob());pn.push(h),s=s.replaceAll(`__CP_OFFLINE_RESOURCE_${d}__`,h)}const l=URL.createObjectURL(new Blob([s],{type:"application/vnd.apple.mpegurl"}));return pn.push(l),l}const o=await a.match(`/offline/${n}`);if(o){const s=URL.createObjectURL(await o.blob());return pn.push(s),s}return null}catch{return null}}function hm(){pn.forEach(e=>{try{URL.revokeObjectURL(e)}catch{}}),pn=[]}async function mm(e,t=()=>{},i=null){const{tmdbId:n,type:r,title:a,seriesTitle:o="",poster:s,backdrop:l,season:d,episode:p,streamUrl:h}=e;if(!h)throw new Error("İndirilecek medya bağlantısı bulunamadı.");if(!("caches"in window))throw new Error("Bu cihaz çevrimdışı depolamayı desteklemiyor.");if(typeof navigator<"u"&&navigator.storage&&navigator.storage.persist)try{await navigator.storage.persist()}catch{}const m=Fr(n,d,p),v=`/offline/${m}`,y=s?r==="tv"?`series_${n}`:`media_${m}`:"",b=y?Bc(y,s).catch(()=>!1):Promise.resolve(!1),w=Dc(h);t({percent:5,loaded:0,total:0,status:"Başlatılıyor..."});try{if(i?.aborted)throw new Error("İndirme iptal edildi");const f=await qr(w,{cache:"no-store",signal:i});if(!f.ok)throw new Error(`İndirme başarısız (${f.status})`);const k=f.headers.get("content-type")||"";if(/mpegurl|vnd\.apple\.mpegurl/i.test(k)||/\.m3u8(?:[?#]|$)/i.test(h)||/\.m3u8(?:[?#]|$)/i.test(w)){const O=await f.text();if(!O.includes("#EXTM3U"))throw new Error("Kaynak HLS bölüm akışı döndürmedi.");const G=await caches.open(hi),U=await yh(G,m,f,O,t,i);y&&(t({percent:99,loaded:U.sizeBytes,total:U.sizeBytes,status:"Afiş çevrimdışı kullanıma kaydediliyor…"}),await b);const z=await Fi(),D={key:m,tmdbId:String(n),type:r||"tv",title:a||"İsimsiz İçerik",seriesTitle:o||"",poster:s||"",backdrop:l||"",season:d!==null?Number(d):null,episode:p!==null?Number(p):null,sizeBytes:U.sizeBytes,downloadedAt:Date.now(),mediaKind:"hls",posterCacheKey:y,playlistTemplate:U.playlistTemplate,resourceKeys:U.resourceKeys};return await new Promise((K,ne)=>{const Q=z.transaction(tt,"readwrite").objectStore(tt).put(D);Q.onsuccess=K,Q.onerror=()=>ne(Q.error)}),t({percent:100,loaded:U.sizeBytes,total:U.sizeBytes,status:"Tamamlandı"}),window.dispatchEvent(new CustomEvent("cinepulse_offline_changed",{detail:{action:"add",key:m}})),!0}const L=f.headers.get("content-length"),S=L?parseInt(L,10):0;let A=0,C;if(f.body&&S>0){const O=f.body.getReader(),G=[];for(;;){if(i?.aborted)throw new Error("İndirme iptal edildi");const{done:U,value:z}=await O.read();if(U)break;G.push(z),A+=z.length;const D=Math.min(99,Math.round(A/S*100));if(t({percent:D,loaded:A,total:S,status:`%${D} indiriliyor...`}),A>=S){O.cancel().catch(()=>{});break}}C=new Blob(G,{type:f.headers.get("content-type")||"video/mp4"})}else if(f.body){const O=f.body.getReader(),G=[];for(;;){if(i?.aborted)throw new Error("İndirme iptal edildi");const{done:U,value:z}=await O.read();if(U)break;G.push(z),A+=z.length,t({percent:0,loaded:A,total:0,status:`${Bt(A)} alındı`})}C=new Blob(G,{type:f.headers.get("content-type")||"video/mp4"})}else C=await f.blob(),A=C.size,t({percent:0,loaded:A,total:0,status:`${Bt(A)} alındı`});if(i?.aborted)throw new Error("İndirme iptal edildi");t({percent:99,loaded:C.size,total:S||C.size,status:"İndirme tamamlandı, cihaz depolamasına yazılıyor…"}),"caches"in window&&await(await caches.open(hi)).put(v,new Response(C,{headers:{"Content-Type":C.type||"video/mp4","Content-Length":String(C.size)}})),t({percent:99,loaded:C.size,total:S||C.size,status:"Video kaydedildi, İndirilenler listesi güncelleniyor…"}),y&&(t({percent:99,loaded:C.size,total:S||C.size,status:"Afiş çevrimdışı kullanıma kaydediliyor…"}),await b);const $=await Fi(),N={key:m,tmdbId:String(n),type:r||"movie",title:a||"İsimsiz İçerik",seriesTitle:o||"",poster:s||"",backdrop:l||"",season:d!==null?Number(d):null,episode:p!==null?Number(p):null,sizeBytes:C.size,downloadedAt:Date.now(),mimeType:C.type||"video/mp4",mediaKind:"file",posterCacheKey:y};return await new Promise((O,G)=>{const D=$.transaction(tt,"readwrite").objectStore(tt).put(N);D.onsuccess=()=>O(),D.onerror=()=>G(D.error)}),t({percent:100,loaded:C.size,total:C.size,status:"Tamamlandı"}),window.dispatchEvent(new CustomEvent("cinepulse_offline_changed",{detail:{action:"add",key:m}})),!0}catch(f){try{const k=await caches.open(hi);await k.delete(v);const x=new URL(`/__cinepulse_offline__/${encodeURIComponent(m)}/`,location.origin).href;await Promise.all((await k.keys()).filter(L=>L.url.startsWith(x)).map(L=>k.delete(L)))}catch{}throw f}}async function es(e,t=null,i=null){try{const n=Fr(e,t,i),r=await Fi(),a=await Pc(n);if(await new Promise((o,s)=>{const p=r.transaction(tt,"readwrite").objectStore(tt).delete(n);p.onsuccess=()=>o(),p.onerror=()=>s(p.error)}),"caches"in window){const o=await caches.open(hi);await o.delete(`/offline/${n}`);for(const s of a?.resourceKeys||[])await o.delete(Cs(n,s));if(a?.posterCacheKey&&!(await $s()).some(l=>l.posterCacheKey===a.posterCacheKey)){await o.delete(wr(a.posterCacheKey));const l=br.get(a.posterCacheKey);l&&URL.revokeObjectURL(l),br.delete(a.posterCacheKey)}}return window.dispatchEvent(new CustomEvent("cinepulse_offline_changed",{detail:{action:"delete",key:n}})),!0}catch{return!1}}function Bt(e){if(!e||e<=0)return"0 B";const t=1024,i=["B","KB","MB","GB","TB"],n=Math.floor(Math.log(e)/Math.log(t));return parseFloat((e/Math.pow(t,n)).toFixed(1))+" "+i[n]}const Rt=e=>String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]);function tl(e,t){const i=xs(e);return`
    <div class="continue-card-wrapper library-card-item" 
         data-id="${e.id}" 
         data-season="${e.season||1}" 
         data-episode="${e.episode||1}" 
         data-tab="${t}"
         data-type="${i}"
         data-title="${encodeURIComponent(e.title||e.name||"İçerik")}"
         data-rating="${e.vote_average||e.voteAverage||e.rating||0}"
         data-year="${(e.release_date||e.first_air_date||e.year||"2024").substring(0,4)}">
      ${kt({...e,type:i},{isContinueSection:t==="continue"})}
      <button class="btn-delete-history btn-lib-delete" title="Listeden / Geçmişten Sil" aria-label="Sil">
        <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
      </button>
    </div>
  `}function vh(){Me();const t=js(),i=Jt(),n=Xt(),r=Us(),a=qn().length,o=ea().length;let s="continue";if(typeof window<"u"&&window.sessionStorage)try{const d=window.sessionStorage.getItem("cp_lib_active_tab");d&&["continue","completed","favorites","watchlist","all-episodes","downloads"].includes(d)&&(s=d)}catch{}return{html:`
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
  `,init:d=>{if(!d)return;let p=s,h="all",m="recent",v="";const y=d.querySelector("#lib-search-input"),b=d.querySelector("#lib-search-clear"),w=d.querySelector("#lib-sort-select"),f=d.querySelector("#lib-batch-clear-btn");let k=[];const x=async()=>{try{k=(await $s()).map(V=>({id:V.tmdbId,title:String(V.seriesTitle||V.title).replace(/\s*[·-]\s*\d+\.\s*Sezon\s+\d+\.\s*Bölüm.*$/i,"").trim(),episodeTitle:V.title,poster_path:V.poster,backdrop_path:V.backdrop,type:V.type,isSeries:V.type==="tv"||V.season!==null&&V.episode!==null,season:V.season??null,episode:V.episode??null,sizeBytes:V.sizeBytes,mediaKind:V.mediaKind||"file",isDownloaded:!0,key:V.key,downloadedAt:V.downloadedAt}));const oe=d.querySelector("#tab-count-downloads");oe&&(oe.textContent=k.length),p==="downloads"&&C()}catch{}};x();const L=H=>H==="continue"?qn():H==="completed"?ea():H==="favorites"?Jt():H==="watchlist"?Xt():H==="all-episodes"?js():H==="downloads"?k:[],S=H=>H==="downloads"?`
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
          `;let A=36;const C=()=>{const H=d.querySelector(`#tab-${p}`);if(!H)return;let V=L(p).filter(W=>{const ae=(W.title||W.name||"").toLowerCase(),fe=xs(W);return(!v||ae.includes(v.toLowerCase()))&&(h==="all"||fe===h)});if(m==="rating-desc"?V.sort((W,ae)=>{const fe=parseFloat(W.vote_average||W.voteAverage||W.rating||0);return parseFloat(ae.vote_average||ae.voteAverage||ae.rating||0)-fe}):m==="title-asc"?V.sort((W,ae)=>{const fe=W.title||W.name||"",X=ae.title||ae.name||"";return fe.localeCompare(X,"tr")}):m==="year-desc"&&V.sort((W,ae)=>{const fe=parseInt((W.release_date||W.first_air_date||W.year||"0").substring(0,4),10);return parseInt((ae.release_date||ae.first_air_date||ae.year||"0").substring(0,4),10)-fe}),V.length===0)H.innerHTML=S(p);else if(p==="downloads"){const W=new Map,ae=[];V.forEach(P=>{if(P.season!==null&&P.episode!==null){const j=String(P.id);W.has(j)||W.set(j,[]),W.get(j).push(P)}else ae.push(P)});const X=[...[...W.values()].map(P=>({id:P[0].id,title:P[0].title,poster_path:P.find(j=>j.poster_path)?.poster_path||"",episodes:P.sort((j,ie)=>j.season-ie.season||j.episode-ie.episode),latest:Math.max(...P.map(j=>j.downloadedAt||0))})).map(P=>({...P,cardType:"series"})),...ae.map(P=>({...P,cardType:"movie"}))].sort((P,j)=>(j.latest||j.downloadedAt||0)-(P.latest||P.downloadedAt||0));H.innerHTML=`
            <div class="offline-download-list offline-download-poster-grid">
              ${X.map((P,j)=>P.cardType==="series"?`
                <article class="offline-series-card" data-series-index="${j}">
                  <button class="offline-series-toggle" type="button" aria-expanded="false">
                    <span class="offline-series-poster"><img src="${Rt(P.poster_path||wt)}" alt="${Rt(P.title)} afişi" loading="lazy"><span class="offline-series-ready"><i data-lucide="check"></i> İNDİRİLDİ</span></span>
                    <span class="offline-series-summary"><strong>${Rt(P.title)}</strong><small>${P.episodes.length} bölüm · ${new Set(P.episodes.map(ie=>ie.season)).size} sezon</small></span>
                    <i data-lucide="chevron-down" class="offline-series-chevron"></i>
                  </button>
                  <div class="offline-series-episodes" hidden>${[...new Set(P.episodes.map(ie=>ie.season))].sort((ie,E)=>ie-E).map(ie=>`<section class="offline-series-season"><h3>Sezon ${ie}</h3>${P.episodes.filter(E=>E.season===ie).map(E=>`<article class="offline-series-episode" data-offline-key="${Rt(E.key)}"><span class="offline-series-episode-no">${String(E.episode).padStart(2,"0")}</span><span class="offline-series-episode-copy"><strong>${Rt(E.episodeTitle||E.title)}</strong><small>Bölüm ${E.episode} · ${Bt(E.sizeBytes)}</small></span><button class="offline-play-btn" type="button" aria-label="Oynat"><i data-lucide="play"></i></button><button class="btn-delete-history btn-lib-delete" title="Cihazdan sil" aria-label="Cihazdan sil"><i data-lucide="trash-2"></i></button></article>`).join("")}</section>`).join("")}</div>
                </article>`:`
                <article class="offline-series-card offline-movie-card" data-offline-key="${Rt(P.key)}">
                  <span class="offline-series-poster"><img src="${Rt(P.poster_path||wt)}" alt="${Rt(P.title)} afişi" loading="lazy"><span class="offline-series-ready"><i data-lucide="check"></i> İNDİRİLDİ</span></span>
                  <span class="offline-series-summary"><strong>${Rt(P.title)}</strong><small>Film · ${Bt(P.sizeBytes)}</small></span>
                  <div class="offline-movie-actions"><button class="offline-play-btn" type="button"><i data-lucide="play"></i><span>Oynat</span></button><button class="btn-delete-history btn-lib-delete" title="Cihazdan sil" aria-label="Cihazdan sil"><i data-lucide="trash-2"></i></button></div>
                </article>`).join("")}
            </div>`;const I=async(P,j)=>{if(!j)return;const ie=P.querySelector(".offline-play-btn");ie.disabled=!0;try{const E=await zc(j.id,j.season,j.episode);if(!E)throw new Error("İndirilen video dosyası bulunamadı.");ti({type:j.type==="movie"?"movie":"tv",isSeries:j.season!==null&&j.episode!==null,tmdbId:j.id,title:j.season!==null&&j.episode!==null?j.title.replace(/\s*[·-]\s*\d+\.\s*Sezon\s+\d+\.\s*Bölüm.*$/i,"").trim():j.title,seriesTitle:j.season!==null&&j.episode!==null?j.title.replace(/\s*[·-]\s*\d+\.\s*Sezon\s+\d+\.\s*Bölüm.*$/i,"").trim():"",season:j.season||1,episode:j.episode||1,posterPath:j.poster_path||"",backdropPath:j.backdrop_path||"",offlinePlaybackUrl:E,offlineMediaKind:j.mediaKind})}catch(E){Z(E?.message||"İndirilen içerik açılamadı.","error")}finally{ie.disabled=!1}},M=async P=>{if(!P||!window.confirm(`“${P.title}” indirilenlerden silinsin mi?`))return;await es(P.id,P.season,P.episode),k=k.filter(ie=>String(ie.key)!==String(P.key));const j=d.querySelector("#tab-count-downloads");j&&(j.textContent=String(k.length)),C(),Z("İndirilen içerik cihazdan silindi.","success")};H.querySelectorAll(".offline-series-card:not(.offline-movie-card)").forEach((P,j)=>{const ie=X.filter(q=>q.cardType==="series")[j],E=P.querySelector(".offline-series-toggle"),T=P.querySelector(".offline-series-episodes");E.addEventListener("click",()=>{const q=E.getAttribute("aria-expanded")!=="true";E.setAttribute("aria-expanded",String(q)),T.hidden=!q}),P.querySelectorAll(".offline-series-episode").forEach(q=>{const ee=ie.episodes.find(ye=>String(ye.key)===q.dataset.offlineKey);q.querySelector(".offline-play-btn").addEventListener("click",()=>I(q,ee)),q.querySelector(".btn-lib-delete").addEventListener("click",()=>M(ee))})}),H.querySelectorAll(".offline-movie-card").forEach(P=>{const j=ae.find(ie=>String(ie.key)===P.dataset.offlineKey);P.querySelector(".offline-play-btn").addEventListener("click",()=>I(P,j)),P.querySelector(".btn-lib-delete").addEventListener("click",()=>M(j))}),J(H);return}else{const W=V.slice(0,A),ae=V.length>A;H.innerHTML=`
            <div class="media-grid" id="grid-${p}">
              ${W.map(P=>tl(P,p)).join("")}
            </div>
            ${ae?`
              <div class="lib-load-more-wrap" style="text-align: center; margin: 2rem 0 1rem;">
                <button id="btn-lib-load-more" class="btn-secondary" style="padding: 0.6rem 1.8rem; border-radius: var(--radius-full); font-size: 0.88rem;">
                  <span>Daha Fazla Göster (${V.length-A} içerik daha)</span>
                </button>
                <div class="lib-scroll-sentinel" style="height: 1px; margin-top: 1rem;"></div>
              </div>
            `:""}
          `;const fe=H.querySelector(`#grid-${p}`),X=()=>{const P=fe.querySelectorAll(".library-card-item").length;if(P>=V.length){const q=H.querySelector(".lib-load-more-wrap");q&&q.remove();return}const j=V.slice(P,P+36);A=P+j.length;const ie=j.map(q=>tl(q,p)).join("");fe.insertAdjacentHTML("beforeend",ie);const E=V.length-A,T=H.querySelector(".lib-load-more-wrap");if(E>0){const q=T?.querySelector("#btn-lib-load-more span");q&&(q.textContent=`Daha Fazla Göster (${E} içerik daha)`)}else T&&T.remove();Vo(j),G(fe),J(fe),ft(fe),qi(fe)},I=H.querySelector("#btn-lib-load-more");I&&I.addEventListener("click",X);const M=H.querySelector(".lib-scroll-sentinel");M&&"IntersectionObserver"in window&&new IntersectionObserver(j=>{j.some(ie=>ie.isIntersecting)&&X()},{rootMargin:"400px 0px"}).observe(M),G(H),Vo(W),ft(H),qi(H)}if(f)if(p==="completed"||p==="all-episodes"||p==="continue"){f.classList.remove("hidden");const W=f.querySelector("span");W&&(W.textContent="Temizle"),p==="completed"?f.title="Tamamlananlar listesini temizle":p==="continue"?f.title="İzlemeye devam et listesini temizle":f.title="Bölüm izleme geçmişini temizle"}else f.classList.add("hidden");J()},$=()=>{A=36,C()},N=d.querySelectorAll("#library-tabs .lib-nav-tab");N.forEach(H=>{H.addEventListener("click",oe=>{oe.preventDefault();const V=H.getAttribute("data-tab");if(p===V)return;if(N.forEach(ae=>ae.classList.remove("active")),H.classList.add("active"),p=V,typeof window<"u"&&window.sessionStorage)try{window.sessionStorage.setItem("cp_lib_active_tab",V)}catch{}d.querySelectorAll(".tab-content").forEach(ae=>ae.classList.add("hidden"));const W=d.querySelector(`#tab-${p}`);W&&W.classList.remove("hidden"),A=36,C()})});const O=()=>{const H=Us(),oe=d.querySelector("#stat-total-watch")||d.querySelector("#stat-total-time"),V=d.querySelector("#stat-eps-count")||d.querySelector("#stat-episodes-count"),W=d.querySelector("#stat-movies-count"),ae=d.querySelector("#stat-favs-count");oe&&(oe.textContent=H.formattedTotal||H.formattedTotalTime||"0 dk"),V&&(V.textContent=`${H.totalEpisodes??H.episodesCount??0} Bölüm`),W&&(W.textContent=`${H.totalMovies??H.moviesCount??0} Film`),ae&&(ae.textContent=`${Jt().length+Xt().length} Yapım`);const fe=d.querySelector("#tab-count-continue"),X=d.querySelector("#tab-count-completed"),I=d.querySelector("#tab-count-favorites"),M=d.querySelector("#tab-count-watchlist"),P=d.querySelector("#tab-count-all-episodes");fe&&(fe.textContent=qn().length),X&&(X.textContent=ea().length),I&&(I.textContent=Jt().length),M&&(M.textContent=Xt().length),P&&(P.textContent=Me().length)},G=H=>{H&&H.querySelectorAll(".btn-lib-delete").forEach(oe=>{oe.addEventListener("click",V=>{V.stopPropagation();const W=oe.closest(".library-card-item");if(!W)return;const ae=W.getAttribute("data-id"),fe=parseInt(W.getAttribute("data-season")||"1",10),X=parseInt(W.getAttribute("data-episode")||"1",10),I=W.getAttribute("data-tab"),M=decodeURIComponent(W.getAttribute("data-title")||"İçerik");let P=`"${M}" kaydını silmek istediğinize emin misiniz?`;if(I==="all-episodes"?P=`"${M}" (Sezon ${fe}, Bölüm ${X}) izleme geçmişinizden silinsin mi?`:I==="continue"?P=`"${M}" devam et listesinden kaldırılsın mı?`:I==="completed"?P=`"${M}" tamamlananlar geçmişinden silinsin mi?`:I==="favorites"?P=`"${M}" favorilerinizden kaldırılsın mı?`:I==="watchlist"?P=`"${M}" izleme listenizden kaldırılsın mı?`:I==="downloads"&&(P=`"${M}" indirilmiş içerik cihazınızdan silinsin mi?`),window.confirm(P)){if(I==="all-episodes")wd(ae,fe,X);else if(I==="continue"||I==="completed")Ca(ae);else if(I==="favorites")yd(ae);else if(I==="watchlist")vd(ae);else if(I==="downloads"){const j=k.find(ie=>String(ie.id)===String(ae)&&(ie.season||1)===fe&&(ie.episode||1)===X);es(ae,j?.season??null,j?.episode??null),k=k.filter(ie=>!(ie.id===ae&&ie.season===fe&&ie.episode===X))}Z("✓ Kayıt başarıyla silindi.","success"),W.style.transition="all 0.28s ease-out",W.style.transform="scale(0.85)",W.style.opacity="0",setTimeout(()=>{W.remove(),O()},300)}})})};y&&y.addEventListener("input",H=>{v=H.target.value.trim(),b&&(b.style.display=v?"block":"none"),$()}),b&&b.addEventListener("click",()=>{y&&(y.value="",v="",b.style.display="none",$(),y.focus())});const U=d.querySelectorAll("#lib-type-filters .lib-segment-btn");U.forEach(H=>{H.addEventListener("click",()=>{U.forEach(oe=>oe.classList.remove("active")),H.classList.add("active"),h=H.getAttribute("data-filter")||"all",$()})}),w&&w.addEventListener("change",H=>{m=H.target.value,$()}),f&&f.addEventListener("click",()=>{let H="Bu listedeki tüm kayıtları silmek istediğinize emin misiniz?";p==="completed"?H="Tamamlananlar listesindeki tüm kayıtlar temizlensin mi?":p==="continue"?H="İzlemeye devam et listesindeki tüm yarım kalanlar temizlensin mi?":p==="all-episodes"&&(H="Tüm bölüm izleme geçmişiniz sıfırlansın mı?"),window.confirm(H)&&(p==="completed"||p==="continue"?qs():p==="all-episodes"&&bd(),Z("✓ Liste başarıyla temizlendi.","success"),O(),C())});const z=d.querySelector("#lib-export-btn");z&&z.addEventListener("click",()=>{try{wl(),Z("JSON yedekleme tamamlandı.","success")}catch(H){Z(H?.message||"JSON yedeği kaydedilemedi.","error")}});const D=d.querySelector("#lib-import-btn"),K=d.querySelector("#lib-file-input");D&&K&&(D.addEventListener("click",()=>K.click()),K.addEventListener("change",H=>{if(H.target.files&&H.target.files.length>0){const oe=H.target.files[0],V=new FileReader;V.onload=W=>{const ae=kl(W.target.result,"merge");ae.success?(Er(),O(),C(),ft(d),J(),Z(`✓ Yedek başarıyla yüklendi! (${ae.countHistory} izleme, ${ae.countFavs} favori aktarıldı)`,"success")):Z(`Yükleme hatası: ${ae.message||ae.error}`,"error")},V.onerror=()=>Z("Dosya okunamadı.","error"),V.readAsText(oe)}}));const ne=d.querySelector("#lib-data-modal-btn");ne&&ne.addEventListener("click",()=>Rl()),C(),ft(d),J(),cd().then(()=>{O(),C()}).catch(()=>{});const Q=H=>{H&&H.detail&&H.detail.isProgressUpdate&&document.getElementById("player-modal")||(O(),C())};window.addEventListener("sineflix_data_changed",Q),window.addEventListener("cinepulse_data_changed",Q);const re=()=>x();window.addEventListener("cinepulse_offline_changed",re)}}}const St=e=>String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),bh=(e,t)=>Number(e.season)-Number(t.season)||Number(e.episode)-Number(t.episode),il=e=>String(e?.seriesTitle||e?.title||"").replace(/\s*[·-]\s*\d+\.\s*Sezon\s+\d+\.\s*Bölüm.*$/i,"").trim();function wh(){return{html:`
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
      </section>`,init:e=>{const t=e.querySelector("#downloads-page"),i=t?.querySelector("#downloads-list");if(!t||!i)return;const n=async()=>{try{const{total:s=0,free:l=0,isOriginQuota:d=!1}=await mh(),p=Math.max(0,s-l),h=s?Math.min(100,Math.round(p/s*100)):0;t.querySelector("#downloads-storage-text").textContent=s?`${Bt(l)} boş · ${Bt(s)} toplam${d?" (uygulama alanı)":""}`:"Depolama bilgisi alınamadı",t.querySelector("#downloads-storage-fill").style.width=`${h}%`}catch{t.querySelector("#downloads-storage-text").textContent="Depolama bilgisi alınamadı"}},r=async(s,l)=>{l.disabled=!0;try{const d=await zc(s.tmdbId,s.season,s.episode);if(!d)throw new Error("İndirilen video bulunamadı.");const p=s.season!==null&&s.episode!==null,h=il(s);ti({type:s.type==="movie"?"movie":"tv",isSeries:p,isAnime:s.type==="anime",tmdbId:s.tmdbId,title:p?h:s.title,seriesTitle:p?h:"",season:s.season||1,episode:s.episode||1,posterPath:s.poster||"",backdropPath:s.backdrop||"",offlinePlaybackUrl:d,offlineMediaKind:s.mediaKind||"file"})}catch(d){Z(d?.message||"İndirilen içerik açılamadı.","error")}finally{l.disabled=!1}},a=async s=>{const l=s.season!==null?`${s.title} · S${s.season} B${s.episode}`:s.title;window.confirm(`“${l}” cihazdan silinsin mi?`)&&(await es(s.tmdbId,s.season,s.episode),await o(),await n(),Z("İndirilen içerik silindi.","success"))},o=async()=>{const s=await $s();if(!t.isConnected)return;const l=new Map,d=[];for(const m of s)if(m.season!==null&&m.episode!==null){const v=String(m.tmdbId);l.has(v)||l.set(v,[]),l.get(v).push(m)}else d.push(m);const h=[...[...l.values()].map(m=>({title:il(m[0]),tmdbId:m[0].tmdbId,poster:m.find(v=>v.poster)?.poster||"",posterCacheKey:m.find(v=>v.posterCacheKey)?.posterCacheKey||`series_${m[0].tmdbId}`,backdrop:m.find(v=>v.backdrop)?.backdrop||"",episodes:m.sort(bh),latest:Math.max(...m.map(v=>v.downloadedAt||0)),type:"series"})),...d.map(m=>({...m,type:"movie-card"}))].sort((m,v)=>(v.latest||v.downloadedAt||0)-(m.latest||m.downloadedAt||0));if(t.querySelector("#downloads-total").textContent=`${h.length} içerik · ${s.length} dosya`,!h.length){i.innerHTML='<div class="downloads-empty"><i data-lucide="cloud-download"></i><h3>Henüz içerik indirmedin</h3><p>Bir bölümü oynatıcıda açıp <b>İndir</b> düğmesine bas. İndirme ilerlemesini oradan görebilirsin.</p><a href="#home" class="downloads-browse-btn"><i data-lucide="compass"></i> İçeriklere göz at</a></div>',J(i);return}i.innerHTML=h.map((m,v)=>{const y=St(it(m.poster||"",Ke.POSTER_MEDIUM)),b=St(m.poster||""),w=St(m.posterCacheKey||(m.type==="movie-card"?`media_${m.key}`:""));if(m.type==="series"){const f=m.episodes.reduce((x,L)=>x+(Number(L.sizeBytes)||0),0),k=[...new Set(m.episodes.map(x=>Number(x.season)))].sort((x,L)=>x-L);return`<article class="download-series-card" data-group="${v}">
              <button type="button" class="download-series-open" aria-expanded="false">
                <span class="download-series-poster"><img src="${y||wt}" data-offline-poster-key="${w}" data-offline-poster-source="${b}" onerror="this.onerror=null;this.src='${wt}'" alt="${St(m.title)} afişi" loading="lazy"></span>
                <span class="download-series-info"><strong>${St(m.title)}</strong><span>${m.episodes.length} bölüm · ${k.length} sezon</span><small>${Bt(f)} · İnternetsiz izlenebilir</small><span class="download-ready-inline"><i data-lucide="check"></i> İNDİRİLDİ</span></span>
                <span class="download-series-chevron"><i data-lucide="chevron-down"></i></span>
              </button>
              <div class="download-episodes" hidden>${k.map(x=>{const L=m.episodes.filter(S=>Number(S.season)===x);return`<details class="download-season"><summary>Sezon ${x}<small>${L.length} indirilen bölüm</small></summary><div class="download-season-list">${L.map(S=>`<article class="download-episode-row" data-item-key="${St(S.key)}"><span class="download-episode-number">${String(S.episode).padStart(2,"0")}</span><span class="download-episode-info"><strong>${St(S.title)}</strong><small>Bölüm ${S.episode} · ${Bt(S.sizeBytes)} · ${new Date(S.downloadedAt||Date.now()).toLocaleDateString("tr-TR")}</small></span><button class="download-episode-play" type="button" aria-label="Bölüm ${S.episode} oynat"><i data-lucide="play"></i></button><button class="download-episode-delete" type="button" aria-label="Bölüm ${S.episode} sil"><i data-lucide="trash-2"></i></button></article>`).join("")}</div></details>`}).join("")}</div>
            </article>`}return`<article class="download-movie-card" data-item-key="${St(m.key)}">
            <span class="download-series-poster"><img src="${y||wt}" data-offline-poster-key="${w}" data-offline-poster-source="${b}" onerror="this.onerror=null;this.src='${wt}'" alt="${St(m.title)} afişi" loading="lazy"></span>
            <div class="download-series-info"><strong>${St(m.title)}</strong><span>Film</span><small>${Bt(m.sizeBytes)} · İnternetsiz izlenebilir</small><span class="download-ready-inline"><i data-lucide="check"></i> İNDİRİLDİ</span></div>
            <div class="download-movie-actions"><button class="download-movie-play" type="button"><i data-lucide="play"></i> Oynat</button><button class="download-episode-delete" type="button" aria-label="Filmi sil"><i data-lucide="trash-2"></i></button></div>
          </article>`}).join(""),J(i),i.querySelectorAll("img[data-offline-poster-key]").forEach(async m=>{const v=await hh(m.dataset.offlinePosterKey,m.dataset.offlinePosterSource||"");v&&m.isConnected&&(m.onerror=null,m.src=v)}),i.querySelectorAll(".download-series-card").forEach((m,v)=>{const y=h.filter(f=>f.type==="series")[v],b=m.querySelector(".download-series-open"),w=m.querySelector(".download-episodes");b.addEventListener("click",()=>{const f=b.getAttribute("aria-expanded")!=="true";f&&i.querySelectorAll('.download-series-open[aria-expanded="true"]').forEach(k=>{k!==b&&(k.setAttribute("aria-expanded","false"),k.closest(".download-series-card")?.querySelector(".download-episodes")?.setAttribute("hidden",""))}),b.setAttribute("aria-expanded",String(f)),w.hidden=!f}),m.querySelectorAll(".download-episode-row").forEach((f,k)=>{const x=y.episodes.find(L=>String(L.key)===f.dataset.itemKey);f.querySelector(".download-episode-play").addEventListener("click",L=>r(x,L.currentTarget)),f.querySelector(".download-episode-delete").addEventListener("click",()=>a(x))})}),i.querySelectorAll(".download-movie-card").forEach(m=>{const v=d.find(y=>String(y.key)===m.dataset.itemKey);m.querySelector(".download-movie-play").addEventListener("click",y=>r(v,y.currentTarget)),m.querySelector(".download-episode-delete").addEventListener("click",()=>a(v))})};n(),o(),window.addEventListener("cinepulse_offline_changed",()=>{o(),n()}),J(t)}}}const Se={currentType:"tv",currentGenreId:null,currentSortBy:"popularity.desc",currentMinRating:0,currentPlatform:null,currentYearRange:"all",currentPage:1,allItems:[],isExhausted:!1};async function kh(e="tv"){e&&e!==Se.currentType&&Se.allItems.length===0&&(Se.currentType=e);let t=Se.currentType,i=Se.currentGenreId,n=Se.currentSortBy,r=Se.currentMinRating,a=Se.currentPlatform,o=Se.currentYearRange,s=!1;const l=[{id:null,name:"Tüm Türler"},{id:gt.MYSTERY,name:"🩸 Korku & Gerilim"},{id:gt.ACTION_ADVENTURE,name:"💥 Aksiyon & Macera"},{id:gt.SCI_FI_FANTASY,name:"🚀 Bilim Kurgu & Fantastik"},{id:gt.DRAMA,name:"🎭 Dram"},{id:gt.COMEDY,name:"😂 Komedi"},{id:gt.CRIME,name:"🕵️ Suç & Polisiye"},{id:gt.ANIMATION,name:"🎌 Animasyon & Anime"},{id:gt.DOCUMENTARY,name:"🌍 Belgesel"},{id:gt.FAMILY,name:"👨‍👩‍👧‍👦 Aile & Gençlik"},{id:gt.WAR_POLITICS,name:"⚔️ Savaş & Politika"},{id:gt.WESTERN,name:"🤠 Western"}],d=[{id:null,name:"Tüm Türler"},{id:je.HORROR,name:"🩸 Korku"},{id:je.THRILLER,name:"⚡ Gerilim"},{id:je.ACTION,name:"💥 Aksiyon"},{id:je.ADVENTURE,name:"🗺️ Macera"},{id:je.SCI_FI,name:"🚀 Bilim Kurgu"},{id:je.FANTASY,name:"🧙‍♂️ Fantastik"},{id:je.DRAMA,name:"🎭 Dram"},{id:je.COMEDY,name:"😂 Komedi"},{id:je.CRIME,name:"🕵️ Suç"},{id:je.ANIMATION,name:"🎌 Animasyon"},{id:je.MYSTERY,name:"🔍 Gizem"},{id:je.ROMANCE,name:"💖 Romantik"},{id:je.DOCUMENTARY,name:"🌍 Belgesel"},{id:je.HISTORY,name:"🏰 Tarih & Savaş"},{id:je.FAMILY,name:"👨‍👩‍👧‍👦 Aile"},{id:je.MUSIC,name:"🎵 Müzikal"},{id:je.WESTERN,name:"🤠 Western"}],p=()=>t==="movie"?d:l,h=Se.allItems.length>0,m=h?Se.allItems.map(y=>kt(y)).join(""):'<div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">İçerikler yükleniyor...</div>';return{html:`
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
  `,init:y=>{if(!y)return;const b=y.querySelector("#discover-type-tv"),w=y.querySelector("#discover-type-movie"),f=y.querySelector("#discover-type-anime"),k=y.querySelector("#discover-type-doc"),x=y.querySelector("#discover-platform-select"),L=y.querySelector("#discover-year-select"),S=y.querySelector("#discover-sort-select"),A=y.querySelector("#discover-rating-select"),C=y.querySelector("#discover-genre-bar"),$=y.querySelector("#discover-media-grid"),N=y.querySelector("#discover-sentinel"),O=N?N.querySelector(".spin-loader"):null;x&&x.addEventListener("change",()=>{a=x.value||null,Se.currentPlatform=a,D()}),L&&L.addEventListener("change",()=>{o=L.value||"all",Se.currentYearRange=o,D()});const G=()=>{const re=p();C.innerHTML=re.map(H=>`
          <button class="genre-pill-btn ${i===H.id?"active":""}" data-genre-id="${H.id||""}">
            ${H.name}
          </button>
        `).join(""),C.querySelectorAll(".genre-pill-btn").forEach(H=>{H.addEventListener("click",()=>{const oe=H.dataset.genreId?parseInt(H.dataset.genreId,10):null;i!==oe&&(i=oe,C.querySelectorAll(".genre-pill-btn").forEach(V=>V.classList.remove("active")),H.classList.add("active"),D())})})};let U=0;const z=async re=>{const H=re||U;if(s||Se.isExhausted)return;s=!0,O&&(O.style.display="block");const oe=Se.currentPage||1;try{const V=t==="anime"||t==="documentary"?"tv":t,W=t==="anime",ae=t==="documentary";let fe=n;n==="first_air_date.desc"&&V==="movie"&&(fe="primary_release_date.desc");let X=null,I=null;o==="2024-2026"?(X=2024,I=2026):o==="2020-2023"?(X=2020,I=2023):o==="2010-2019"?(X=2010,I=2019):o==="2000-2009"?(X=2e3,I=2009):o==="1990-1999"?(X=1990,I=1999):o==="before-1990"&&(X=1940,I=1989);const M=await xl({type:V,genreId:i,page:oe,sortBy:fe,minRating:r,isAnime:W,isDoc:ae,yearMin:X,yearMax:I,withNetworks:a});if(H!==U)return;if(O&&(O.style.display="none"),!M||M.length===0){oe===1&&($.innerHTML='<div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted); font-size: 1.05rem;">Bu filtre kriterlerine uygun içerik bulunamadı.</div>'),Se.isExhausted=!0;return}Se.allItems=[...Se.allItems,...M],Se.currentType=t,Se.currentGenreId=i,Se.currentSortBy=n,Se.currentMinRating=r;const P=M.map(j=>kt(j)).join("");oe===1?$.innerHTML=P:$.insertAdjacentHTML("beforeend",P),J(),ft($),Se.currentPage=oe+1}catch{if(H!==U)return;O&&(O.style.display="none"),oe===1&&(!Se.allItems||Se.allItems.length===0)&&($.innerHTML=`
              <div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">
                <p style="margin-bottom: 0.75rem;">İçerikler getirilirken bir sorun oluştu.</p>
                <button id="btn-retry-discover" class="btn-secondary" style="padding: 0.5rem 1.2rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
                  <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
                  <span>Tekrar Dene</span>
                </button>
              </div>
            `,J(),$.querySelector("#btn-retry-discover")?.addEventListener("click",()=>{D()}))}finally{H===U&&(s=!1,O&&(O.style.display="none"))}},D=()=>{U++;const re=U;Se.currentPage=1,Se.allItems=[],Se.isExhausted=!1,s=!1,$.innerHTML=`
          <div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">
            <div class="spin-loader" style="width: 32px; height: 32px; border: 3px solid rgba(245,158,11,0.2); border-top-color: #f59e0b; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem;"></div>
            <div>İçerikler yükleniyor...</div>
          </div>
        `,O&&(O.style.display="none"),z(re)};G(),h||z();let K=null;N&&"IntersectionObserver"in window&&(K=new IntersectionObserver(re=>{re[0].isIntersecting&&z()},{rootMargin:"0px 0px 600px 0px"}),K.observe(N));const ne=()=>{if(s||Se.isExhausted)return;const re=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||0,H=window.innerHeight,oe=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);re+H>=oe-700&&z()};window.addEventListener("scroll",ne,{passive:!0}),window.__discoverCleanup=()=>{K?.disconnect(),window.removeEventListener("scroll",ne)};const Q=re=>{t!==re&&(t=re,i=null,[b,w,f,k].forEach(H=>H?.classList.remove("active")),re==="tv"&&b?.classList.add("active"),re==="movie"&&w?.classList.add("active"),re==="anime"&&f?.classList.add("active"),re==="documentary"&&k?.classList.add("active"),G(),D())};b&&b.addEventListener("click",()=>Q("tv")),w&&w.addEventListener("click",()=>Q("movie")),f&&f.addEventListener("click",()=>Q("anime")),k&&k.addEventListener("click",()=>Q("documentary")),S&&S.addEventListener("change",re=>{n=re.target.value,D()}),A&&A.addEventListener("change",re=>{r=parseFloat(re.target.value),D()})}}}const Li={};function _h(e){const i=Lt()?`${e}_kids`:e;return(!Li[i]||Li[i].stale)&&(Li[i]={allItems:[],seenIds:new Set,nextPage:1,isExhausted:!1,stale:!1}),Li[i]}function Sh(e){if(Lt())switch(e){case"movie":return Ma;case"anime":return Pa;case"documentary":return Dd;case"cartoon":return Ra;default:return Ra}switch(e){case"movie":return rr;case"anime":return ar;case"documentary":return sr;case"cartoon":return ir;default:return nr}}async function en(e="tv"){const t=Lt(),i=t?`${e}_kids`:e;Li[i]&&(Li[i].stale=!0);const n=_h(e),r=t?{tv:["Türkiye’de Popüler Çizgi ve Gençlik Dizileri","monitor-play"],movie:["🎈 Animasyon & Çocuk Filmleri","popcorn"],anime:["Türkiye’de Popüler Çocuk ve Genç Animeleri","cat"],documentary:["🐾 Doğa & Hayvan Belgeselleri","globe"]}:{tv:["Tüm Zamanların En Popüler Dizileri","monitor-play"],cartoon:["Çizgi Dizi Dünyası & Unutulmaz Klasikler","wand-2"],movie:["Tüm Zamanların En Popüler Filmleri","popcorn"],anime:["Türkiye’de En Popüler Animeler","cat"],documentary:["Tüm Zamanların En Çok İzlenen Belgeselleri","globe"]},[a,o]=r[e]||r.tv;return{html:`
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
  `,init:d=>{if(!d)return;const p=d.querySelector("#popular-media-grid"),h=d.querySelector("#popular-sentinel");if(!p)return;ft(p);let m=!1;const v=Sh(e),y=()=>{h&&(n.isExhausted?h.innerHTML='<p style="color: var(--text-muted); font-size: 0.9rem;">Tüm popüler içerikler listelendi.</p>':h.innerHTML=`
            <div style="display: flex; align-items: center; gap: 0.6rem; color: var(--text-muted); font-size: 0.9rem;">
              <div class="spin-loader" style="width: 20px; height: 20px; border: 2px solid rgba(245,158,11,0.25); border-top-color: #f59e0b; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
              <span>Daha fazla içerik akıyor...</span>
            </div>
          `)},b=x=>{if(!x||x.length===0)return;const L=[];for(const C of x)C&&C.id&&!n.seenIds.has(C.id)&&(n.seenIds.add(C.id),L.push(C));if(L.length===0)return;n.allItems.push(...L);const S=L.map(C=>kt(C)).join("");p.querySelector(".popular-loading-placeholder")?p.innerHTML=S:p.insertAdjacentHTML("beforeend",S),ft(p),J()},w=async(x=3)=>{if(!(m||n.isExhausted)){m=!0,y();try{const L=n.nextPage,S=Array.from({length:x},(G,U)=>L+U);n.nextPage+=x;let A=0;const C=e==="anime"||e==="cartoon"||t&&e==="tv",$=S.map(G=>v(G).catch(()=>[])),N=await Promise.all($),O=N.flat().filter(Boolean);if(C){const G=e==="cartoon"?"_cartoonScore":"_turkeyPopularityScore";O.sort((U,z)=>(z[G]||0)-(U[G]||0)),A=O.length,b(O)}else for(const G of N)G&&G.length>0&&(A+=G.length,b(G));O.length===0&&(n.isExhausted=!0),y(),requestAnimationFrame(()=>{if(!n.isExhausted&&document.documentElement.scrollHeight<=window.innerHeight+600){m=!1,w(2);return}})}catch{}finally{m=!1,y()}}};w(1);let f=null;h&&"IntersectionObserver"in window&&(f=new IntersectionObserver(x=>{x[0].isIntersecting&&!m&&!n.isExhausted&&w(2)},{rootMargin:"0px 0px 1500px 0px"}),f.observe(h));const k=()=>{if(m||n.isExhausted)return;const x=window.scrollY||0,L=window.innerHeight,S=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);x+L>=S-1200&&w(2)};window.addEventListener("scroll",k,{passive:!0}),window.__popularListCleanup=()=>{f?.disconnect(),window.removeEventListener("scroll",k)}}}}function Eh(){const e=new Set;let t=!1;const i=s=>{t?s():e.add(s)},n=(s,l,d,p)=>{t||(s.addEventListener(l,d,p),i(()=>s.removeEventListener(l,d,p)))},r=new Map,a=s=>{const l=r.get(s);l&&(l(),e.delete(l),r.delete(s))},o=(s,l,d)=>{if(t)return null;const p=globalThis[d?"setInterval":"setTimeout"](()=>{d||a(p),t||s()},l),h=()=>globalThis[d?"clearInterval":"clearTimeout"](p);return r.set(p,h),i(h),p};return{on:n,add:i,setTimeout:(s,l)=>o(s,l,!1),setInterval:(s,l)=>o(s,l,!0),clearTimeout:a,clearInterval:a,dispose(){if(!t){t=!0;for(const s of e)s();e.clear(),r.clear()}}}}function gm(e){const t=globalThis.window?.lucide;if(!(!e||!t?.createElement||!t.icons))for(const i of e.querySelectorAll("[data-lucide]:not(svg)")){const n=i.getAttribute("data-lucide"),r=n.replace(/(^|-)(\w)/g,(l,d,p)=>p.toUpperCase()),a=t.icons[r];if(!a)continue;const o=Object.fromEntries(Array.from(i.attributes,l=>[l.name,l.value]));o.class=`lucide lucide-${n} ${o.class||""}`;const s=t.createElement(a);for(const[l,d]of Object.entries(o))s.setAttribute(l,d);i.replaceWith(s)}}function At(e,t){const i=(e||"").replace(/ (HD|4K|TV|Kanalı)/gi,"").trim(),n=i.slice(0,5).toUpperCase(),a={"TRT 1":{bg:"linear-gradient(135deg, #b91c1c, #ef4444)",text:"#ffffff",tag:"TRT 1"},ATV:{bg:"linear-gradient(135deg, #c2410c, #f97316)",text:"#ffffff",tag:"ATV"},"SHOW TV":{bg:"linear-gradient(135deg, #6b21a8, #ec4899)",text:"#ffffff",tag:"SHOW"},"NOW TV":{bg:"linear-gradient(135deg, #991b1b, #ef4444)",text:"#ffffff",tag:"NOW"},"STAR TV":{bg:"linear-gradient(135deg, #b91c1c, #dc2626)",text:"#ffffff",tag:"STAR"},"KANAL D":{bg:"linear-gradient(135deg, #0369a1, #0284c7)",text:"#ffffff",tag:"KANAL D"},TV8:{bg:"linear-gradient(135deg, #ea580c, #f97316)",text:"#ffffff",tag:"TV8"},"CNBC-E":{bg:"linear-gradient(135deg, #047857, #10b981)",text:"#ffffff",tag:"CNBC-E"},"A2 TV":{bg:"linear-gradient(135deg, #991b1b, #ea580c)",text:"#ffffff",tag:"A2"},"KANAL 7":{bg:"linear-gradient(135deg, #0284c7, #38bdf8)",text:"#ffffff",tag:"KANAL 7"},"BEYAZ TV":{bg:"linear-gradient(135deg, #881337, #e11d48)",text:"#ffffff",tag:"BEYAZ"},TEVE2:{bg:"linear-gradient(135deg, #ca8a04, #eab308)",text:"#000000",tag:"TEVE2"},"TV 360":{bg:"linear-gradient(135deg, #581c87, #9333ea)",text:"#ffffff",tag:"360"},"TRT HABER":{bg:"linear-gradient(135deg, #831843, #db2777)",text:"#ffffff",tag:"HABER"},"A HABER":{bg:"linear-gradient(135deg, #991b1b, #f97316)",text:"#ffffff",tag:"A HABER"},NTV:{bg:"linear-gradient(135deg, #0369a1, #0284c7)",text:"#ffffff",tag:"NTV"},HABERTÜRK:{bg:"linear-gradient(135deg, #991b1b, #dc2626)",text:"#ffffff",tag:"HTÜRK"},"HALK TV":{bg:"linear-gradient(135deg, #b91c1c, #ef4444)",text:"#ffffff",tag:"HALK"},"S SPORT 1 HD":{bg:"linear-gradient(135deg, #065f46, #10b981)",text:"#ffffff",tag:"S SPORT 1"},"S SPORT 2 HD":{bg:"linear-gradient(135deg, #047857, #34d399)",text:"#ffffff",tag:"S SPORT 2"},"BEIN SPORTS HABER HD":{bg:"linear-gradient(135deg, #4c1d95, #7c3aed)",text:"#ffffff",tag:"BEIN HABER"},"BEIN SPORTS 3 HD":{bg:"linear-gradient(135deg, #3b0764, #6d28d9)",text:"#ffffff",tag:"BEIN 3"},"SPOR SMART 1 HD":{bg:"linear-gradient(135deg, #c2410c, #f97316)",text:"#ffffff",tag:"SMART 1"},"SPOR SMART 2 HD":{bg:"linear-gradient(135deg, #9a3412, #ea580c)",text:"#ffffff",tag:"SMART 2"},"EURO SPORT 1 HD":{bg:"linear-gradient(135deg, #1e3a8a, #2563eb)",text:"#ffffff",tag:"EURO 1"},"EURO SPORT 2 HD":{bg:"linear-gradient(135deg, #172554, #1d4ed8)",text:"#ffffff",tag:"EURO 2"},"TIVIBU SPOR 1 HD":{bg:"linear-gradient(135deg, #0284c7, #06b6d4)",text:"#ffffff",tag:"TİVİBU 1"},"TIVIBU SPOR 2 HD":{bg:"linear-gradient(135deg, #0369a1, #0284c7)",text:"#ffffff",tag:"TİVİBU 2"},"TIVIBU SPOR 3 HD":{bg:"linear-gradient(135deg, #075985, #0369a1)",text:"#ffffff",tag:"TİVİBU 3"},"FX KANALI HD":{bg:"linear-gradient(135deg, #18181b, #27272a)",text:"#fbbf24",tag:"FX"},"SINEMA TV HD":{bg:"linear-gradient(135deg, #713f12, #a16207)",text:"#fef08a",tag:"SINEMA"},"NATIONAL GEOGRAPHIC HD":{bg:"linear-gradient(135deg, #000000, #18181b)",text:"#fbbf24",tag:"NAT GEO"},"DISCOVERY CHANNEL HD":{bg:"linear-gradient(135deg, #0284c7, #06b6d4)",text:"#ffffff",tag:"DISCOVERY"},"DMAX HD":{bg:"linear-gradient(135deg, #111827, #1f2937)",text:"#38bdf8",tag:"DMAX"},"TLC HD":{bg:"linear-gradient(135deg, #831843, #db2777)",text:"#ffffff",tag:"TLC"},"CARTOON NETWORK":{bg:"linear-gradient(135deg, #000000, #27272a)",text:"#ffffff",tag:"CARTOON"},"NICKELODEON HD":{bg:"linear-gradient(135deg, #ea580c, #f97316)",text:"#ffffff",tag:"NICK"}}[i.toUpperCase()]||{bg:"linear-gradient(135deg, #1e293b, #334155)",text:"#ffffff",tag:n},o=`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
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
  </svg>`;return`data:image/svg+xml;utf8,${encodeURIComponent(o)}`}const xh=[{id:"all",name:"Tüm Kanallar",icon:"tv"},{id:"favorites",name:"⭐ Favorilerim",icon:"star"},{id:"national",name:"Ulusal & Sinema",icon:"home"},{id:"sports",name:"Spor",icon:"trophy"},{id:"news",name:"Haber",icon:"newspaper"},{id:"doc",name:"Belgesel",icon:"compass"},{id:"kids",name:"Çocuk",icon:"smile"},{id:"music",name:"Müzik",icon:"music"}],Th=[{id:"ch_trt1",name:"TRT 1",category:"national",logo:"/tv-logos/trt-1.png",quality:"1080p FHD",streamUrl:"https://tv-trt1.medya.trt.com.tr/master.m3u8"},{id:"ch_atv",name:"ATV",category:"national",logo:"/tv-logos/atv.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/atv/atv_1080p.m3u8"},{id:"ch_showtv",name:"Show TV",category:"national",logo:"/tv-logos/show-tv.png",quality:"1080p FHD",streamUrl:"https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/showtv/showtv.m3u8"},{id:"ch_nowtv",name:"NOW TV",category:"national",logo:"/tv-logos/now-tv.png",quality:"1080p FHD",streamUrl:"https://uycyyuuzyh.turknet.ercdn.net/nphindgytw/nowtv/nowtv.m3u8"},{id:"ch_startv",name:"Star TV",category:"national",logo:"/tv-logos/star-tv.png",quality:"1080p FHD",streamUrl:"https://dygvideo.dygdigital.com/live/hls/startv4puhu/live.m3u8"},{id:"ch_kanald",name:"Kanal D",category:"national",logo:"/tv-logos/kanal-d.png",quality:"1080p FHD",streamUrl:"https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/kanald/kanald.m3u8"},{id:"ch_tv8",name:"TV8",category:"national",logo:"/tv-logos/tv8.png",quality:"480p",streamUrl:"https://rkhubpaomb.turknet.ercdn.net/fwjkgpasof/tv8/tv8_480p.m3u8"},{id:"ch_cnbce",name:"CNBC-e",category:"national",logo:"/tv-logos/cnbc-e.png",quality:"1080p FHD",streamUrl:"https://hnpsechtsc.turknet.ercdn.net/xpnvudnlsv/cnbc-e/cnbc-e.m3u8"},{id:"ch_a2",name:"A2 TV",category:"national",logo:"/tv-logos/a2.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/a2tv/a2tv.m3u8"},{id:"ch_kanal7",name:"Kanal 7",category:"national",logo:"/tv-logos/kanal-7.png",quality:"1080p FHD",streamUrl:"https://kanal7-live.daioncdn.net/kanal7/kanal7.m3u8"},{id:"ch_beyaztv",name:"Beyaz TV",category:"national",logo:"/tv-logos/beyaz-tv.png",quality:"1080p FHD",streamUrl:"https://beyaztv-live.daioncdn.net/beyaztv/beyaztv.m3u8"},{id:"ch_teve2",name:"Teve2",category:"national",logo:"/tv-logos/teve2.png",quality:"1080p FHD",streamUrl:"https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/teve2/teve2.m3u8"},{id:"ch_tv360",name:"TV 360",category:"national",logo:"/tv-logos/tv-360.png",quality:"1080p FHD",streamUrl:"https://turkmedya-live.ercdn.net/tv360/tv360.m3u8"},{id:"ch_trthaber",name:"TRT Haber",category:"news",logo:"/tv-logos/trt-haber.png",quality:"1080p FHD",streamUrl:"https://tv-trthaber.medya.trt.com.tr/master.m3u8"},{id:"ch_ahaber",name:"A Haber",category:"news",logo:"/tv-logos/a-haber.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/ahaber/ahaber.m3u8"},{id:"ch_ntv",name:"NTV",category:"news",logo:"/tv-logos/ntv.png",quality:"1080p FHD",streamUrl:"https://dygvideo.dygdigital.com/live/hls/ntv4puhu/live.m3u8"},{id:"ch_haberturk",name:"Habertürk",category:"news",logo:"/tv-logos/haberturk.png",quality:"1080p FHD",streamUrl:"https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/haberturktv/haberturktv.m3u8"},{id:"ch_halktv",name:"Halk TV",category:"news",logo:"/tv-logos/halk-tv.png",quality:"1080p FHD",streamUrl:"https://halktv-live.daioncdn.net/halktv/halktv.m3u8"},{id:"ch_tele1",name:"Tele1",category:"news",logo:"/tv-logos/tele1.png",quality:"1080p FHD",streamUrl:"https://tele1-live.ercdn.net/tele1/tele1.m3u8"},{id:"ch_tv100",name:"TV 100",category:"news",logo:"/tv-logos/tv100.png",quality:"1080p FHD",streamUrl:"https://tv.ensonhaber.com/tv100/tv100.m3u8"},{id:"ch_bloomberg",name:"Bloomberg HT",category:"news",logo:"/tv-logos/bloomberg-ht.png",quality:"1080p FHD",streamUrl:"https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/bloomberght/bloomberght.m3u8"},{id:"ch_tv24",name:"24 TV",category:"news",logo:"/tv-logos/tv24.png",quality:"1080p FHD",streamUrl:"https://tv.ensonhaber.com/tv24/tv24.m3u8"},{id:"ch_ulketv",name:"Ülke TV",category:"news",logo:"/tv-logos/ulke-tv.png",quality:"1080p FHD",streamUrl:"https://livetv.radyotvonline.net/kanal7live/ulketv/playlist.m3u8"},{id:"ch_trtspor",name:"TRT Spor",category:"sports",logo:"/tv-logos/trt-spor.png",quality:"1080p FHD",streamUrl:"https://tv-trtspor1.medya.trt.com.tr/master.m3u8"},{id:"ch_trtspor2",name:"TRT Spor Yıldız",category:"sports",logo:"/tv-logos/trt-spor-yildiz.png",quality:"1080p FHD",streamUrl:"https://tv-trtspor2.medya.trt.com.tr/master.m3u8"},{id:"ch_aspor",name:"A Spor",category:"sports",logo:"/tv-logos/a-spor.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/aspor/aspor.m3u8"},{id:"ch_dmax",officialLiveId:"dmax",name:"DMAX HD",category:"doc",logo:"/tv-logos/dmax.png",quality:"1080p",streamUrl:"/api/live_tv_stream?channel=dmax"},{id:"ch_tlc",officialLiveId:"tlc",name:"TLC HD",category:"doc",logo:"/tv-logos/tlc.png",quality:"1080p",streamUrl:"/api/live_tv_stream?channel=tlc"},{id:"ch_trtbelgesel",name:"TRT Belgesel",category:"doc",logo:"/tv-logos/trt-belgesel.png",quality:"1080p FHD",streamUrl:"https://tv-trtbelgesel.medya.trt.com.tr/master.m3u8"},{id:"ch_tgrtbelgesel",name:"TGRT Belgesel",category:"doc",logo:At("TGRT Belgesel"),quality:"1080p FHD",streamUrl:"https://b01c02nl.mediatriple.net/videoonlylive/mtsxxkzwwuqtglive/broadcast_5fe462afc6a0e.smil/playlist.m3u8"},{id:"ch_ciftcitv",name:"Çiftçi TV",category:"doc",logo:At("Çiftçi TV"),quality:"720p",streamUrl:"https://live.artidijitalmedya.com/artidijital_ciftcitv/ciftcitv/chunks.m3u8"},{id:"ch_kanalv",name:"Kanal V",category:"doc",logo:At("Kanal V"),quality:"720p",streamUrl:"https://live.artidijitalmedya.com/artidijital_kanalv/kanalv/chunks.m3u8"},{id:"ch_trtcocuk",name:"TRT Çocuk",category:"kids",logo:"/tv-logos/trt-cocuk.png",quality:"1080p FHD",streamUrl:"https://tv-trtcocuk.medya.trt.com.tr/master.m3u8"},{id:"ch_minikago",name:"Minika GO",category:"kids",logo:"/tv-logos/minika-go.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/minikago/minikago.m3u8"},{id:"ch_trtmuzik",name:"TRT Müzik",category:"music",logo:"/tv-logos/trt-muzik.png",quality:"480p",streamUrl:"https://tv-trtmuzik.medya.trt.com.tr/master_480.m3u8"},{id:"ch_kralpop",name:"Kral Pop",category:"music",logo:"/tv-logos/kral-pop.png",quality:"1080p FHD",streamUrl:"https://dygvideo.dygdigital.com/live/hls/kralpoptv/live.m3u8"},{id:"ch_powerturk",name:"Power Türk",category:"music",logo:"/tv-logos/powerturk.png",quality:"1080p FHD",streamUrl:"https://powerlive.daioncdn.net/powerturktv/powerturktv.m3u8"},{id:"ch_dreamturk",name:"Dream Türk",category:"music",logo:"/tv-logos/dream-turk.png",quality:"1080p FHD",streamUrl:"https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/dreamturk/dreamturk.m3u8"},{id:"ch_tempotv",name:"Tempo TV",category:"music",logo:At("Tempo TV"),quality:"720p",streamUrl:"https://live.artidijitalmedya.com/artidijital_tempotv/tempotv/chunks.m3u8"}],kr="cinepulse_epg_live_cache",Oc=30*60*1e3;let bt=null,nl=0,Ea=!1,fn=null;const Ah={ch_cnbce:[{start:"07:00",end:"10:00",title:"Sabah Piyasaları & Finans"},{start:"10:00",end:"14:00",title:"Piyasa Ekranı & Global Trendler"},{start:"14:00",end:"18:00",title:"Kapanışa Doğru"},{start:"18:00",end:"20:00",title:"The Simpsons"},{start:"20:00",end:"21:00",title:"Mad Men"},{start:"21:00",end:"23:00",title:"Game of Thrones Kuşağı"},{start:"23:00",end:"01:00",title:"Late Night Show"},{start:"01:00",end:"07:00",title:"Gece Finans & Belgesel"}]},rl={sports:[{start:"06:00",end:"09:00",title:"Spor Bülteni & Günün Manşetleri"},{start:"09:00",end:"12:00",title:"Maç Özetleri & Goller Kuşağı"},{start:"12:00",end:"14:00",title:"Öğle Sporu & Transfer Raporu"},{start:"14:00",end:"17:00",title:"Uluslararası Ligler & Analiz"},{start:"17:00",end:"19:00",title:"Maç Önü & Stüdyo Analizi"},{start:"19:00",end:"21:30",title:"Canlı Karşılaşma / Canlı Yayın"},{start:"21:30",end:"23:45",title:"Dev Maç Özel Yayını"},{start:"23:45",end:"02:00",title:"Son Sayfa & Tartışma Programı"},{start:"02:00",end:"06:00",title:"Gecenin Maçları (Tekrar)"}],news:[{start:"06:00",end:"09:00",title:"Güne Başlarken & Sabah Raporu"},{start:"09:00",end:"12:00",title:"Ekonomi ve Politika Gündemi"},{start:"12:00",end:"14:00",title:"Gün Ortası Bülteni"},{start:"14:00",end:"17:00",title:"Sıcak Gelişmeler & Canlı Bağlantılar"},{start:"17:00",end:"19:00",title:"Akşam Bülteni & Manşetler"},{start:"19:00",end:"20:30",title:"Ana Haber Bülteni"},{start:"20:30",end:"23:30",title:"Türkiye'nin Nabzı & Açık Oturum"},{start:"23:30",end:"01:30",title:"Gece Raporu & Dünya Basını"},{start:"01:30",end:"06:00",title:"Gece Bülteni"}],doc:[{start:"06:00",end:"09:00",title:"Vahşi Yaşamın İzinde"},{start:"09:00",end:"12:00",title:"Evrenin Gizemleri ve Uzay"},{start:"12:00",end:"15:00",title:"Mega Yapılar & Mühendislik"},{start:"15:00",end:"18:00",title:"Tarihin Bilinmeyen Sayfaları"},{start:"18:00",end:"20:00",title:"Okyanusların Derinlikleri"},{start:"20:00",end:"22:00",title:"Büyük Kediler: Hayatta Kalma"},{start:"22:00",end:"00:30",title:"Dünyanın En Gizemli Keşifleri"},{start:"00:30",end:"06:00",title:"Gece Belgesel Kuşağı"}],kids:[{start:"06:00",end:"09:00",title:"Sabah Neşesi Çizgi Filmler"},{start:"09:00",end:"12:00",title:"Eğlenceli Maceralar & Kahramanlar"},{start:"12:00",end:"15:00",title:"Sevimli Dostlar & Bilim Zamanı"},{start:"15:00",end:"18:00",title:"Süper Kahramanlar Kuşağı"},{start:"18:00",end:"20:30",title:"Akşam Aile Sineması"},{start:"20:30",end:"22:30",title:"Fantastik Çizgi Dizi"},{start:"22:30",end:"06:00",title:"Gece Masalları"}],music:[{start:"06:00",end:"10:00",title:"Güne Enerjik Başla (Top 20 Pop)"},{start:"10:00",end:"14:00",title:"Hit Müzik & Radyo Şarkıları"},{start:"14:00",end:"18:00",title:"Trendler & En Çok Dinlenenler"},{start:"18:00",end:"21:00",title:"Akşam Ritimleri & Klip Kuşağı"},{start:"21:00",end:"23:30",title:"Canlı Akustik & Popüler Klipler"},{start:"23:30",end:"02:00",title:"Gece Chill & Deep House"},{start:"02:00",end:"06:00",title:"Kesintisiz Gece Müziği"}],national:[{start:"06:00",end:"09:00",title:"Sabah Programı & Magazin"},{start:"09:00",end:"12:00",title:"Gündüz Kuşağı Programı"},{start:"12:00",end:"14:00",title:"Gün Ortası & Yemek Programı"},{start:"14:00",end:"17:00",title:"Popüler Dizi Tekrar Kuşağı"},{start:"17:00",end:"19:00",title:"Yarışma Kuşağı"},{start:"19:00",end:"20:00",title:"Akşam Ana Haber"},{start:"20:00",end:"23:30",title:"Prime Time Sinema / Dizi"},{start:"23:30",end:"02:00",title:"Gece Sineması"},{start:"02:00",end:"06:00",title:"Gece Kuşağı"}]};function al(e){if(!e||!e.includes(":"))return 0;const[t,i]=e.split(":").map(Number);return(t||0)*60+(i||0)}function Ch(){try{const e=(typeof window<"u"&&window.sessionStorage?sessionStorage.getItem(kr):null)||(typeof window<"u"&&window.localStorage?localStorage.getItem(kr):null);if(!e)return null;const t=JSON.parse(e);if(t&&t.channels&&Date.now()-(t.updatedAt||0)<12*3600*1e3)return t.channels}catch{}return null}function Lh(e){try{typeof window<"u"&&window.sessionStorage&&sessionStorage.setItem(kr,JSON.stringify({updatedAt:Date.now(),channels:e})),typeof window<"u"&&window.localStorage&&localStorage.removeItem(kr)}catch{}}async function sl(e=!1){const t=Date.now();if(!e&&bt&&t-nl<Oc||Ea)return bt;Ea=!0;try{let i=null;try{i=await fetch("/api/epg")}catch{}if((!i||!i.ok)&&(i=await fetch("/epg-data.json")),i&&i.ok){const n=await i.json();n&&n.channels&&Object.keys(n.channels).length>0&&(bt=n.channels,nl=t,Lh(n.channels),window.dispatchEvent(new CustomEvent("epg-updated",{detail:{count:Object.keys(n.channels).length}})))}}catch{}finally{Ea=!1}return bt}function $h(){if(!bt){const e=Ch();e&&(bt=e)}sl(),fn===null&&(fn=setInterval(()=>{sl(!0)},Oc))}function Rh(){fn!==null&&(clearInterval(fn),fn=null)}function Hn(e){if(!e)return{title:"Canlı Yayın",timeRange:"Canlı Akış",start:"00:00",end:"23:59",progress:50,remainingMin:30,nextTitle:"Yayın Akışı"};const t=Date.now();if(bt&&bt[e.id]&&bt[e.id].length>0){const a=bt[e.id];for(let s=0;s<a.length;s++){const l=a[s];if(t>=l.startTs&&t<l.endTs){const d=Math.max(1,(l.endTs-l.startTs)/6e4),p=Math.max(0,(t-l.startTs)/6e4),h=Math.min(100,Math.max(0,Math.round(p/d*100))),m=Math.max(1,Math.round((l.endTs-t)/6e4)),v=a[s+1];return{title:l.title,timeRange:`${l.start} - ${l.end}`,start:l.start,end:l.end,progress:h,remainingMin:m,nextTitle:v?v.title:"Sonraki Program"}}}const o=a.find(s=>s.startTs>t);if(o)return{title:o.title,timeRange:`${o.start} - ${o.end}`,start:o.start,end:o.end,progress:5,remainingMin:Math.max(1,Math.round((o.endTs-t)/6e4)),nextTitle:"Yayın Başlamak Üzere"}}const i=new Date,n=i.getHours()*60+i.getMinutes();let r=Ah[e.id];r||(r=rl[e.category]||rl.national);for(let a=0;a<r.length;a++){const o=r[a],s=al(o.start);let l=al(o.end);l<=s&&(l+=24*60);let d=n;if(s>l-24*60&&n<s&&n<l%(24*60)&&(d+=24*60),d>=s&&d<l){const p=l-s,h=d-s,m=Math.min(100,Math.max(0,Math.round(h/p*100))),v=Math.max(1,l-d),y=r[(a+1)%r.length];return{title:o.title,timeRange:`${o.start} - ${o.end}`,start:o.start,end:o.end,progress:m,remainingMin:v,nextTitle:y?y.title:"Sonraki Program"}}}return{title:`${e.name} Canlı Yayın`,timeRange:"Canlı Akış",start:"00:00",end:"23:59",progress:50,remainingMin:30,nextTitle:"Yayın Akışı Devam Ediyor"}}const Nc="cinepulse_live_favs";function ol(){try{const e=localStorage.getItem(Nc);return e?JSON.parse(e):[]}catch{return[]}}function Ih(e){try{localStorage.setItem(Nc,JSON.stringify(e))}catch{}}function Mh(){const e=Lt(),t=[...Th],i=e?t.filter(f=>f.category==="kids"):t;let n=e?"kids":"all",r=e?i.find(f=>f.id==="ch_trtcocuk")||i[0]:t.find(f=>f.id==="ch_trt1")||t[0],a="",o=null,s=!1,l=1,d=null,p=null;function h(f){return ol().includes(f)}function m(f){let k=ol();k.includes(f)?(k=k.filter(x=>x!==f),Z("Favorilerden çıkarıldı","info")):(k.push(f),Z("Favorilere eklendi ⭐","success")),Ih(k),b()}function v(){return i.filter(f=>{let k=!0;n==="favorites"?k=h(f.id):n!=="all"&&(k=f.category===n);const x=!a||f.name.toLowerCase().includes(a.toLowerCase());return k&&x})}function y(f){return i.findIndex(k=>k.id===f.id)}let b=()=>{};return{html:`
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
              <img class="tv-pip-logo" id="tv-pip-logo" src="${r.logo}" alt="" onerror="this.onerror=null; this.src='${At(r.name,r.category)}';" />
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
                <img id="tv-top-logo" class="tv-top-logo" src="${r.logo}" alt="" onerror="this.onerror=null; this.src='${At(r.name,r.category)}';" />
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
              ${xh.map(f=>`
                <button class="tv-cat-filter-btn ${f.id===n?"active":""}" data-cat="${f.id}">
                  <i data-lucide="${f.icon}" style="width:14px;height:14px;"></i>
                  <span>${f.name}</span>
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
  `,init:f=>{if(!f)return;$h();const k=Eh(),{setTimeout:x,clearTimeout:L,setInterval:S,clearInterval:A}=k,C=f.querySelector("#tv-video"),$=f.querySelector("#tv-screen"),N=f.querySelector("#tv-hero-player-section"),O=f.querySelector("#tv-screen-placeholder"),G=f.querySelector("#tv-screen-backdrop");f.querySelector("#tv-osd-topbar");const U=f.querySelector("#tv-top-logo"),z=f.querySelector("#tv-top-name"),D=f.querySelector("#tv-top-num"),K=f.querySelector("#tv-top-epg-title"),ne=f.querySelector("#tv-top-epg-prog");f.querySelector("#tv-pip-header");const Q=f.querySelector("#tv-pip-logo"),re=f.querySelector("#tv-pip-name"),H=f.querySelector("#tv-pip-epg"),oe=f.querySelector("#tv-pip-expand"),V=f.querySelector("#tv-pip-close"),W=f.querySelector("#tv-osd"),ae=f.querySelector("#tv-osd-logo"),fe=f.querySelector("#tv-osd-name"),X=f.querySelector("#tv-osd-quality"),I=f.querySelector("#tv-osd-chnum"),M=f.querySelector("#tv-osd-epg-sub"),P=f.querySelector("#tv-loading"),j=f.querySelector("#tv-error"),ie=f.querySelector("#tv-retry-btn"),E=f.querySelector("#tv-error-next-btn"),T=f.querySelector("#tv-btn-play-pause"),q=f.querySelector("#tv-btn-prev-ch"),ee=f.querySelector("#tv-btn-next-ch"),ye=f.querySelector("#tv-btn-sync"),se=f.querySelector("#tv-btn-mute"),me=f.querySelector("#tv-volume-slider"),Ye=f.querySelector("#tv-btn-reload"),De=f.querySelector("#tv-btn-fullscreen"),lt=f.querySelector("#tv-btn-quality"),Ee=f.querySelector("#tv-quality-badge"),Ae=f.querySelector("#tv-quality-menu"),Ve=f.querySelector("#tv-quality-options"),Je=f.querySelector("#tv-btn-numpad"),$e=f.querySelector("#tv-numpad-modal"),le=f.querySelector("#tv-numpad-modal-backdrop"),g=f.querySelector("#tv-numpad-close"),c=f.querySelector("#tv-pad-display-val"),u=f.querySelector("#tv-pad-display-sub"),_=f.querySelector("#tv-numpad-hud"),R=f.querySelector("#tv-numpad-hud-digits"),B=f.querySelector("#tv-numpad-hud-name"),F=f.querySelector("#tv-channel-grid"),ue=f.querySelector("#tv-search"),xe=f.querySelector("#tv-search-clear"),he=f.querySelector("#tv-category-strip"),Ce=f.querySelector("#tv-cat-prev"),_e=f.querySelector("#tv-cat-next"),Rs=f.querySelector("#tv-guide-count");function Sn(){const Y=y(r)+1,te=Hn(r);z&&(z.textContent=r.name),D&&(D.textContent=`CH ${String(Y).padStart(2,"0")}`),K&&(K.textContent=`${te.title} (${te.timeRange})`),ne&&(ne.textContent=`%${te.progress}`),U&&(U.src=r.logo,U.onerror=()=>{U.onerror=null,U.src=At(r.name,r.category)}),re&&(re.textContent=r.name),H&&(H.textContent=`${te.title} (%${te.progress})`),Q&&(Q.src=r.logo,Q.onerror=()=>{Q.onerror=null,Q.src=At(r.name,r.category)})}function Is(){Sn(),F&&F.querySelectorAll(".tv-grid-card").forEach(te=>{const ve=te.getAttribute("data-id"),ke=t.find(Tn=>Tn.id===ve);if(!ke)return;const ce=Hn(ke),Fe=te.querySelector(".tv-epg-title"),Le=te.querySelector(".tv-epg-time"),_t=te.querySelector(".tv-epg-bar-fill"),Ue=te.querySelector(".tv-epg-pct");Fe&&Fe.textContent!==ce.title&&(Fe.textContent=ce.title,Fe.title=ce.title),Le&&Le.textContent!==ce.timeRange&&(Le.textContent=ce.timeRange),_t&&(_t.style.width=`${ce.progress}%`),Ue&&Ue.textContent!==`%${ce.progress}`&&(Ue.textContent=`%${ce.progress}`)})}const Kr=()=>{Is()};k.on(window,"epg-updated",Kr);let Ms=S(()=>{if(!document.body.contains(f)){A(Ms),window.removeEventListener("epg-updated",Kr);return}Is()},2e4);function Kc(){p&&L(p);const Y=y(r),te=Hn(r);ae&&(ae.src=r.logo,ae.onerror=()=>{ae.onerror=null,ae.src=At(r.name,r.category)}),fe&&(fe.textContent=r.name),X&&(X.textContent=r.quality),I&&(I.textContent=String(Y+1).padStart(2,"0")),M&&(M.textContent=`📺 ${te.title} • %${te.progress} tamamlandı`),W.classList.remove("hidden"),W.classList.add("tv-osd-show"),p=x(()=>{W.classList.remove("tv-osd-show"),W.classList.add("tv-osd-hide"),x(()=>{W.classList.add("hidden"),W.classList.remove("tv-osd-hide")},350)},2500)}function En(){$.classList.add("user-active"),d&&L(d),d=x(()=>{$.classList.remove("user-active"),Ae&&Ae.classList.add("hidden")},3500)}$.addEventListener("mousemove",En),$.addEventListener("touchstart",En,{passive:!0}),G&&(G.addEventListener("click",Y=>{Y.stopPropagation(),$.classList.contains("user-active")?($.classList.remove("user-active"),d&&L(d),Ae&&Ae.classList.add("hidden")):En()}),G.addEventListener("dblclick",Y=>{Y.stopPropagation(),De&&De.click()}));function Ki(Y){Y=Math.max(0,Math.min(1,Y)),l=Y,C.volume=Y,me&&(me.value=Y),Y===0?(s=!0,C.muted=!0,se&&(se.innerHTML='<i data-lucide="volume-x" style="width:18px;height:18px;color:#ef4444;"></i>')):(s=!1,C.muted=!1,se&&(se.innerHTML='<i data-lucide="volume-2" style="width:18px;height:18px;"></i>')),J()}me&&me.addEventListener("input",Y=>{Ki(parseFloat(Y.target.value))}),se&&se.addEventListener("click",Y=>{Y.stopPropagation(),s?(Ki(l||.8),Z("Ses açıldı","info")):(C.muted=!0,s=!0,se.innerHTML='<i data-lucide="volume-x" style="width:18px;height:18px;color:#ef4444;"></i>',J(),Z("Sessize alındı","info"))}),T&&T.addEventListener("click",Y=>{Y.stopPropagation(),C.paused?(C.play(),T.innerHTML='<i data-lucide="pause" style="width:18px;height:18px;"></i>'):(C.pause(),T.innerHTML='<i data-lucide="play" style="width:18px;height:18px;"></i>'),J()}),ye&&ye.addEventListener("click",Y=>{Y.stopPropagation(),o&&C.seekable&&C.seekable.length>0?(C.currentTime=C.seekable.end(C.seekable.length-1),C.play(),Z("Canlı yayına eşitlendi","info")):ni(r)});function Wr(Y){if(!Ve||!Ee)return;if(!Y||!Y.levels||Y.levels.length<=1){Ee.textContent=r.quality?r.quality.split(" ")[0]:"HD",Ve.innerHTML=`
            <button class="tv-quality-opt active" data-level="-1">
              <i data-lucide="check" style="width:13px;height:13px;color:#fbbf24;"></i>
              <span>Kaynak Kalite (${r.quality||"1080p"})</span>
            </button>
          `,J();return}const te=Y.levels,ve=Y.currentLevel;let ke=`
          <button class="tv-quality-opt ${ve===-1?"active":""}" data-level="-1">
            ${ve===-1?'<i data-lucide="check" style="width:13px;height:13px;color:#fbbf24;"></i>':'<span style="width:13px;display:inline-block;"></span>'}
            <span>Otomatik (Adaptive)</span>
          </button>
        `;if(te.forEach((ce,Fe)=>{const Le=ce.height||(ce.attrs&&ce.attrs.RESOLUTION?ce.attrs.RESOLUTION.height:720),_t=Le>=1080?"1080p FHD":Le>=720?"720p HD":Le>=480?"480p SD":`${Le}p`,Ue=ve===Fe;ke+=`
            <button class="tv-quality-opt ${Ue?"active":""}" data-level="${Fe}">
              ${Ue?'<i data-lucide="check" style="width:13px;height:13px;color:#fbbf24;"></i>':'<span style="width:13px;display:inline-block;"></span>'}
              <span>${_t}</span>
            </button>
          `}),Ve.innerHTML=ke,ve===-1)Ee.textContent="AUTO";else if(te[ve]){const ce=te[ve].height;Ee.textContent=ce?`${ce}p`:"HD"}Ve.querySelectorAll(".tv-quality-opt").forEach(ce=>{ce.addEventListener("click",Fe=>{Fe.stopPropagation();const Le=parseInt(ce.dataset.level,10);if(o){o.currentLevel=Le,Wr(o),Ae&&Ae.classList.add("hidden");const _t=ce.querySelector("span").textContent;Z(`Kalite ayarlandı: ${_t}`,"success")}})}),J()}lt&&Ae&&(lt.addEventListener("click",Y=>{Y.stopPropagation(),Ae.classList.toggle("hidden"),En()}),k.on(document,"click",Y=>{Y.target.closest("#tv-quality-wrapper")||Ae.classList.add("hidden")}));let xn=!1;function Ps(){if(!N||!O||!$||document.fullscreenElement)return;const te=N.getBoundingClientRect().bottom<80;te&&C&&!C.paused&&!xn?$.classList.contains("is-floating-pip")||($.classList.add("is-floating-pip"),O.classList.add("is-active"),Sn()):te||$.classList.contains("is-floating-pip")&&($.classList.remove("is-floating-pip"),O.classList.remove("is-active"),xn=!1)}k.on(window,"scroll",Ps,{passive:!0}),oe&&oe.addEventListener("click",Y=>{Y.stopPropagation(),N&&N.scrollIntoView({behavior:"smooth",block:"start"})}),V&&V.addEventListener("click",Y=>{Y.stopPropagation(),xn=!0,$.classList.remove("is-floating-pip"),O.classList.remove("is-active")});let Oe="",Yr=null;function Gr(Y){if(Y>=0&&Y<t.length){const te=t[Y];Z(`Kanal ${Y+1}: ${te.name}`,"info"),ni(te),N&&N.scrollIntoView({behavior:"smooth",block:"start"})}else Z(`Kanal ${Y+1} bulunamadı`,"warning");Oe="",_&&_.classList.add("hidden"),$e&&$e.classList.add("hidden")}function Bs(){if(!_||!R||!B)return;const Y=parseInt(Oe,10),te=t[Y-1];R.textContent=Oe.padStart(2,"0"),B.textContent=te?te.name:"Geçersiz Kanal",_.classList.remove("hidden"),c&&(c.textContent=Oe.padStart(2,"0")),u&&(u.textContent=te?te.name:"Geçersiz Kanal"),Yr&&L(Yr),Yr=x(()=>{Oe&&Gr(Y-1)},1300)}Je&&$e&&Je.addEventListener("click",Y=>{Y.stopPropagation(),Oe="",c&&(c.textContent="--"),u&&(u.textContent="Numara tuşlayın"),$e.classList.toggle("hidden")}),g&&g.addEventListener("click",()=>{$e.classList.add("hidden"),Oe=""}),le&&le.addEventListener("click",()=>{$e.classList.add("hidden"),Oe=""}),$e&&$e.querySelectorAll(".tv-num-key").forEach(Y=>{Y.addEventListener("click",te=>{te.stopPropagation();const ve=Y.dataset.digit;if(ve==="clear")Oe="",c&&(c.textContent="--"),u&&(u.textContent="Numara tuşlayın");else if(ve==="ok"){if(Oe){const ke=parseInt(Oe,10);Gr(ke-1)}}else Oe.length>=2&&(Oe=""),Oe+=ve,Bs()})});let et=0;async function ni(Y){const te=++et;if(r=Y,xn=!1,Sn(),Kc(),Yc(),o){try{o.stopLoad(),o.detachMedia(),o.destroy()}catch{}o=null}if(C)try{C.pause(),C.removeAttribute("src"),C.load()}catch{}P.classList.remove("hidden"),j.classList.add("hidden");const ve=()=>{et===te&&(P.classList.add("hidden"),j.classList.add("hidden"))};C.addEventListener("loadeddata",ve,{once:!0}),x(()=>{C.removeEventListener("loadeddata",ve),et===te&&C.readyState<2&&Ue()},2e4);let ke=0,ce=0,Fe=!1,Le=!1;async function _t(Pe,ze=!0){if(!Y.officialLiveId||ze&&ke>=2)return!1;ze&&(ke+=1),P.classList.remove("hidden"),j.classList.add("hidden");try{const Ft=nt(`/api/live_tv_stream?channel=${encodeURIComponent(Y.officialLiveId)}&json=1&refresh=1&_=${Date.now()}`),ai=await fetch(Ft,{cache:"no-store",headers:{Accept:"application/json"}});if(!ai.ok)throw new Error(`Live resolver ${ai.status}`);const Yi=await ai.json(),Os=Yi?.proxiedUrl||Yi?.url||"",Cn=Os?nt(Os):"";if(!Cn)throw new Error("Live stream URL missing");if(Y.streamUrl=Cn,Cn!==Pe||ze)return An(Cn),!0}catch{}return!1}function Ue(){et===te&&(P.classList.add("hidden"),j.classList.remove("hidden"))}function Tn(Pe){if(Fe||!/^https?:\/\//i.test(Pe))return!1;Fe=!0;const ze=`${new URL(Pe).origin}/`,Ft=`/api/hls_proxy?url=${encodeURIComponent(Pe)}&ref=${encodeURIComponent(ze)}`;return Y.streamUrl=Ft,An(Ft),!0}function An(Pe){if(et===te)if(Pe=nt(Pe),ri.isSupported()){if(o){try{o.stopLoad(),o.detachMedia(),o.destroy()}catch{}o=null}const ze=new ri({enableWorker:!0,lowLatencyMode:!0,startLevel:0,capLevelToPlayerSize:!0,backBufferLength:10,maxBufferLength:8,maxMaxBufferLength:15,liveSyncDurationCount:2,liveMaxLatencyDurationCount:5,manifestLoadingTimeOut:12e3,manifestLoadingMaxRetry:1,manifestLoadingRetryDelay:350,levelLoadingTimeOut:14e3,levelLoadingMaxRetry:1,fragLoadingTimeOut:12e3});o=ze,ze.loadSource(Pe),ze.attachMedia(C),ze.on(ri.Events.MANIFEST_PARSED,()=>{if(et!==te){try{ze.stopLoad(),ze.detachMedia(),ze.destroy()}catch{}return}Wr(ze),C.play().catch(()=>{})}),ze.on(ri.Events.ERROR,(Ft,ai)=>{if(!(et!==te||o!==ze)&&ai.fatal)if(ai.type===ri.ErrorTypes.NETWORK_ERROR)Y.officialLiveId?_t(Pe).then(Yi=>{Yi||Ue()}):ce<1?(ce+=1,P.classList.remove("hidden"),x(()=>{et===te&&o===ze&&An(Pe)},700)):Tn(Pe)||Ue();else if(ai.type===ri.ErrorTypes.MEDIA_ERROR)if(Le)Ue();else{Le=!0;try{ze.recoverMediaError()}catch{Ue()}}else Ue()})}else C.canPlayType("application/vnd.apple.mpegurl")?(C.src=Pe,C.addEventListener("loadedmetadata",()=>{et===te&&(Wr(null),C.play().catch(()=>{}))},{once:!0}),C.addEventListener("error",()=>{et===te&&(Tn(Pe)||Ue())},{once:!0})):Ue()}let ri;try{ri=(await ps(async()=>{const{default:Pe}=await import("./hls-BuERnqCp.js");return{default:Pe}},[],import.meta.url)).default}catch{Ue();return}et===te&&(Y.officialLiveId?_t("",!0).then(Pe=>{Pe||et!==te||_t("",!0).then(ze=>{!ze&&et===te&&Ue()})}):An(Y.streamUrl),C.muted=s,C.volume=l)}function Wi(Y){const te=v();if(te.length===0)return;const ve=te.findIndex(ce=>ce.id===r.id);let ke;Y==="prev"||Y==="up"?ke=ve<=0?te.length-1:ve-1:ke=ve>=te.length-1?0:ve+1,ni(te[ke])}q&&q.addEventListener("click",Y=>{Y.stopPropagation(),Wi("prev")}),ee&&ee.addEventListener("click",Y=>{Y.stopPropagation(),Wi("next")}),E&&E.addEventListener("click",()=>Wi("next")),ie&&ie.addEventListener("click",()=>ni(r)),Ye&&Ye.addEventListener("click",()=>{Z("Yayın yeniden yükleniyor...","info"),ni(r)});function Wc(){const Y=v();if(Rs&&(Rs.textContent=`${Y.length} KANAL`),Y.length===0){F.innerHTML=`
            <div class="tv-catalog-empty-state">
              <i data-lucide="radio" style="width:40px;height:40px;color:var(--text-muted);"></i>
              <span class="tv-empty-title">Kanal Bulunamadı</span>
              <p class="tv-empty-sub">Arama teriminizi veya kategori filtrenizi değiştirin.</p>
            </div>
          `,J();return}F.innerHTML=Y.map(te=>{const ve=te.id===r.id,ke=h(te.id),ce=y(te)+1,Fe=At(te.name,te.category),Le=Hn(te);return`
            <div class="tv-grid-card ${ve?"active":""}" data-id="${te.id}">
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
                  <span class="tv-epg-title" title="${Le.title}">${Le.title}</span>
                  <span class="tv-epg-time">${Le.timeRange}</span>
                </div>
                <div class="tv-epg-bar">
                  <div class="tv-epg-fill" style="width: ${Le.progress}%"></div>
                </div>
                <div class="tv-epg-footer">
                  <span class="tv-epg-pct">%${Le.progress} tamamlandı</span>
                  <span class="tv-epg-rem">${Le.remainingMin} dk kaldı</span>
                </div>
              </div>

              ${ve?'<div class="tv-grid-live-indicator"><span class="tv-live-dot"></span> <span>ŞU AN İZLENİYOR</span></div>':""}
            </div>
          `}).join(""),F.querySelectorAll(".tv-grid-card").forEach(te=>{te.addEventListener("click",ve=>{if(ve.target.closest(".tv-grid-fav-btn"))return;const ke=t.find(ce=>ce.id===te.dataset.id);ke&&ke.id!==r.id&&(ni(ke),N&&N.scrollIntoView({behavior:"smooth",block:"start"}))})}),F.querySelectorAll(".tv-grid-fav-btn").forEach(te=>{te.addEventListener("click",ve=>{ve.stopPropagation(),m(te.dataset.favid)})}),J()}function Yc(){F&&F.querySelectorAll(".tv-grid-card").forEach(Y=>{const te=Y.dataset.id===r.id;Y.classList.toggle("active",te);const ve=Y.querySelector(".tv-grid-live-indicator");if(!te&&ve&&ve.remove(),te&&!ve){const ke=document.createElement("div");ke.className="tv-grid-live-indicator",ke.innerHTML='<span class="tv-live-dot"></span><span>ŞU AN İZLENİYOR</span>',Y.appendChild(ke)}})}if(b=()=>{Wc(),Sn(),J()},ue&&ue.addEventListener("input",Y=>{a=Y.target.value.trim(),xe&&xe.classList.toggle("hidden",!a),b()}),xe&&xe.addEventListener("click",()=>{ue.value="",a="",xe.classList.add("hidden"),b()}),he){Ce&&Ce.addEventListener("click",ce=>{ce.stopPropagation(),he.scrollBy({left:-220,behavior:"smooth"})}),_e&&_e.addEventListener("click",ce=>{ce.stopPropagation(),he.scrollBy({left:220,behavior:"smooth"})}),he.addEventListener("wheel",ce=>{Math.abs(ce.deltaY)>Math.abs(ce.deltaX)&&(ce.preventDefault(),he.scrollLeft+=ce.deltaY)},{passive:!1});let Y=!1,te=0,ve=0,ke=!1;he.addEventListener("mousedown",ce=>{ce.button===0&&(Y=!0,ke=!1,te=ce.pageX-he.offsetLeft,ve=he.scrollLeft)}),k.on(window,"mousemove",ce=>{if(!Y)return;const Le=(ce.pageX-he.offsetLeft-te)*1.5;Math.abs(Le)>6&&(ke=!0,he.classList.add("is-dragging")),he.scrollLeft=ve-Le}),k.on(window,"mouseup",()=>{Y&&(Y=!1,he.classList.remove("is-dragging"),x(()=>{ke=!1},50))}),he.querySelectorAll(".tv-cat-filter-btn").forEach(ce=>{ce.addEventListener("click",Fe=>{if(ke){Fe.preventDefault();return}he.querySelectorAll(".tv-cat-filter-btn").forEach(Le=>Le.classList.remove("active")),ce.classList.add("active"),n=ce.dataset.cat,ce.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"}),b()})})}De&&De.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen().catch(()=>{}):$.requestFullscreen().catch(()=>{})}),k.on(document,"fullscreenchange",()=>{const Y=!!document.fullscreenElement;$.classList.toggle("is-fullscreen",Y),De&&(De.innerHTML=Y?'<i data-lucide="minimize-2" style="width:18px;height:18px;"></i>':'<i data-lucide="maximize-2" style="width:18px;height:18px;"></i>',J())});function Ds(Y){if(document.activeElement!==ue){if(Y.key>="0"&&Y.key<="9"){Oe.length>=2&&(Oe=""),Oe+=Y.key,Bs();return}if(Y.key==="Enter"&&Oe){Y.preventDefault();const te=parseInt(Oe,10);Gr(te-1);return}switch(Y.key){case"ArrowUp":case"w":case"W":Y.preventDefault(),Wi("prev");break;case"ArrowDown":case"s":case"S":Y.preventDefault(),Wi("next");break;case"ArrowRight":Y.preventDefault(),Ki(l+.05);break;case"ArrowLeft":Y.preventDefault(),Ki(l-.05);break;case"m":case"M":se&&se.click();break;case"f":case"F":De&&De.click();break;case"r":case"R":Ye&&Ye.click();break;case" ":Y.preventDefault(),T&&T.click();break}}}k.on(document,"keydown",Ds);const zs=()=>{if(k.dispose(),Rh(),et++,A(Ms),window.removeEventListener("epg-updated",Kr),window.removeEventListener("scroll",Ps),o){try{o.stopLoad(),o.detachMedia(),o.destroy()}catch{}o=null}if(C)try{C.pause(),C.removeAttribute("src"),C.load()}catch{}document.removeEventListener("keydown",Ds)};window.__LiveTvController={cleanup:zs};const Vr=new MutationObserver(()=>{document.contains(f)||(zs(),Vr.disconnect())});Vr.observe(document.body,{childList:!0,subtree:!0}),k.add(()=>Vr.disconnect()),b(),ni(r),Ki(1)}}}const Ph=3e4,Bh=10*6e4,Dh=5,zh=6e4;let Ur=0,hn=!1,_r=0,Xn=0,Sr=0;function Oh(){Ur=Date.now()+Ph}function Nh(){return Hc()||Ur>Date.now()}function Hc(){return hn&&_r<=Date.now()&&(hn=!1,_r=0),hn}function Hh(){hn=!0,_r=Date.now()+Bh,Ur=0,Xn=0,Sr=0}function qh(){hn=!1,_r=0,Ur=0}function ts(){return Math.max(0,Math.ceil((Sr-Date.now())/1e3))}function Fh(){return Sr>Date.now()||(Xn+=1,Xn>=Dh&&(Xn=0,Sr=Date.now()+zh)),ts()}async function Uh(){if(!Hc())return{html:`
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
      `,init:n=>{const r=n.querySelector("#admin-login-form"),a=n.querySelector("#admin-pin-input"),o=n.querySelector("#admin-login-error");r.addEventListener("submit",s=>{s.preventDefault();const l=a.value.trim(),d=ts();if(d>0){o.textContent=`Çok fazla hatalı deneme. ${d} saniye sonra tekrar deneyin.`,o.style.display="block";return}if(Qc(l))Hh(),window.dispatchEvent(new CustomEvent("cinepulse_admin_state_changed"));else{const p=Fh();o.textContent=p>0?`Çok fazla hatalı deneme. ${p} saniye bekleyin.`:"Geçersiz PIN kodu!",o.style.display="block",a.classList.add("admin-input-error"),setTimeout(()=>a.classList.remove("admin-input-error"),400),a.value=""}}),J(n)}};const t=xr();Zt();const i=$t();return{html:`
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
    `,init:n=>{const r=n.querySelector("#admin-lock-btn");r&&r.addEventListener("click",()=>{qh(),window.location.hash="#home"});const a=n.querySelector("#admin-save-site-settings");a&&a.addEventListener("click",()=>{const h=n.querySelector("#admin-setting-landscape")?.checked===!0,m=n.querySelector("#admin-setting-hover")?.checked===!0,v=n.querySelector("#admin-setting-trailers")?.checked===!0,y=n.querySelector("#admin-setting-autoplay-next")?.checked===!0,b=n.querySelector("#admin-setting-subtitles")?.checked===!0,w=n.querySelector("#admin-setting-resolution")?.value||"1080p";bl({cardLayout:h?"landscape":"portrait",hoverPreviewsEnabled:m,trailersEnabled:v,autoplayNext:y,subtitlesEnabled:b,preferredResolution:w}),document.documentElement.classList.toggle("cards-landscape",h),alert("Tüm profil kontrolleri uygulandı.")});const o=n.querySelector("#admin-add-block-form"),s=n.querySelector("#admin-block-input");o&&s&&o.addEventListener("submit",h=>{h.preventDefault();const m=s.value.trim();m&&(ed(m),un(),window.location.reload())}),n.querySelectorAll(".admin-tag-del-btn").forEach(h=>{h.addEventListener("click",()=>{const m=h.getAttribute("data-entry");m&&(td(m),un(),window.location.reload())})});const l=n.querySelector("#admin-change-pin-form"),d=n.querySelector("#admin-new-pin");l&&d&&l.addEventListener("submit",h=>{h.preventDefault();const m=d.value.trim();m.length>=4&&(Zc(m),alert("Yönetici PIN kodu başarıyla güncellendi!"),d.value="")});const p=n.querySelector("#admin-clear-cache-btn");p&&p.addEventListener("click",()=>{sessionStorage.clear(),un(),alert("Sistem önbelleği başarıyla temizlendi."),window.location.reload()}),J(n)}}}const jh=new Set(["hd","full","izle","seyret","film","dizi","anime","turkce","dublaj","altyazili","sezon","bolum","fragman","filmekseni","ekseni","sezonlukdizi","yabancidizi","dizipal","dizibal"]);function ll(e){return(e||"").toString().normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("tr-TR").replace(/[ıİ]/g,"i").replace(/\bs\d{1,2}\s*e\d{1,3}\b/g," ").replace(/\b(?:sezon|bolum)\s*\d+\b/g," ").replace(/\b\d+\s*(?:sezon|bolum)\b/g," ").replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(t=>t&&!jh.has(t)&&!/^(?:19|20)\d{2}$/.test(t)).join(" ").trim()}function Kh(e,t){if(e===t)return 0;if(!e.length)return t.length;if(!t.length)return e.length;const i=Array.from({length:t.length+1},(n,r)=>r);for(let n=1;n<=e.length;n++){let r=i[0];i[0]=n;for(let a=1;a<=t.length;a++){const o=i[a];i[a]=Math.min(i[a]+1,i[a-1]+1,r+(e[n-1]===t[a-1]?0:1)),r=o}}return i[t.length]}function Wh(e,t){const i=ll(e),n=ll(t);return!i||!n?0:i===n?1:1-Kh(i,n)/Math.max(i.length,n.length)}function Yh(e,t,i=.9){return(Array.isArray(t)?t:[t]).filter(Boolean).some(r=>Wh(e,r)>=i)}function ym(e){return e?(e.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i)?.[1]||e.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g," ")||e.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||"").replace(/\s+\d+\s*\.?\s*sezon\b[\s\S]*$/i,"").replace(/\s+[-|]\s*(?:sezonluk\s*dizi|sezonlukdizi|filmekseni|yabanci\s*dizi)[\s\S]*$/i,"").trim():""}const gi="https://dramadizilerim.com";function Gh(e){return e?e.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-"):""}function cl(e){return e?e.toLowerCase().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9]/g,""):""}async function mi(e,t={}){const i=typeof window<"u";let n=e;if(i)if(e.startsWith("http"))try{const r=new URL(e);n=`/api/ddz${r.pathname}${r.search}`}catch{n=e}else n=`/api/ddz${e.startsWith("/")?"":"/"}${e}`;else n.startsWith("http")||(n=`${gi}${n.startsWith("/")?"":"/"}${n}`);try{const r=await fetch(n,{...t,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Referer:gi,...t.headers||{}},signal:AbortSignal.timeout(t.timeout||6e3)}).catch(()=>null);if(r&&r.ok)return r}catch{}return null}function bn(e){if(!e)return"";try{if(e.includes("image_proxy.php?url=")){const t=e.match(/url=([^&]+)/);if(t)return decodeURIComponent(t[1])}}catch{}return e}async function qc(e){if(!e||typeof e!="string"||e.trim().length<2)return[];const t=e.trim(),i=`/search?q=${encodeURIComponent(t)}`,n=await mi(i);if(!n)return[];const r=await n.text().catch(()=>"");if(!r)return[];const a=[],o=/<a[^>]+href=["'](?:https:\/\/dramadizilerim\.com)?\/dizi\/([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;let s;for(;(s=o.exec(r))!==null;){const l=s[1],d=s[2],p=d.match(/alt=["']([^"']+)["']/i)||d.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i),h=p?p[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():l,m=d.match(/src=["']([^"']+)["']/i),v=m?bn(m[1].replace(/&amp;/g,"&")):"",y=h.toLowerCase().includes("dublaj");a.some(b=>b.slug===l)||a.push({title:h,slug:l,poster:v,isDubbed:y,url:`${gi}/dizi/${l}`})}return a}async function Vh(){const e=await mi("/");if(!e)return[];const t=await e.text().catch(()=>"");if(!t)return[];const i=[],n=/<a[^>]+href=["'](?:https:\/\/dramadizilerim\.com)?\/dizi\/([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;let r;for(;(r=n.exec(t))!==null;){const a=r[1],o=r[2],s=o.match(/src=["']([^"']+)["']/i),l=o.match(/alt=["']([^"']+)["']/i)||o.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i),d=l?l[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():a,p=s?bn(s[1].replace(/&amp;/g,"&")):"",h=d.toLowerCase().includes("dublaj");i.some(m=>m.slug===a)||i.push({slug:a,title:d,poster:p,isDubbed:h,badge:h?"🇹🇷 DUBLAJ":"TR ALTYAZI",url:`${gi}/dizi/${a}`})}return i}async function xa({page:e=1,query:t=""}={}){if(t&&t.trim().length>=2)return qc(t);const i=e>1?`/dizi?page=${e}`:"/dizi",n=await mi(i);if(!n)return[];const r=await n.text().catch(()=>"");if(!r)return[];const a=[],o=/<a[^>]+href=["'](?:https:\/\/dramadizilerim\.com)?\/dizi\/([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;let s;for(;(s=o.exec(r))!==null;){const l=s[1],d=s[2],p=d.match(/src=["']([^"']+)["']/i),h=d.match(/alt=["']([^"']+)["']/i)||d.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i),m=h?h[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():l,v=p?bn(p[1].replace(/&amp;/g,"&")):"",y=m.toLowerCase().includes("dublaj");a.some(b=>b.slug===l)||a.push({slug:l,title:m,poster:v,isDubbed:y,badge:y?"🇹🇷 DUBLAJ":"TR ALTYAZI",url:`${gi}/dizi/${l}`})}return a}async function Jh(e){if(!e)return null;const t=await mi(`/dizi/${e}`);if(!t)return null;const i=await t.text().catch(()=>"");if(!i)return null;const n=i.match(/<h1[^>]*>(.*?)<\/h1>/i),r=n?n[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").trim():e;let a="";const s=[...i.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(v=>v[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,"&").trim()).filter(v=>{if(v.length<25)return!1;const y=v.toLowerCase();return!(y.includes("çerez")||y.includes("cookie")||y.includes("reklam")||y.includes("tüm hakları")||y.includes("bildirim")||y.includes("yapay zeka")||y.includes("bize bildirin")||y.includes("aradığınız dizi"))});if(s.length>0&&(s.sort((v,y)=>y.length-v.length),a=s[0]),!a||a.length<25){const v=i.match(/<meta\s+(?:property=["']og:description["']|name=["']description["'])\s+content=["']([^"']+)["']/i)||i.match(/<meta\s+content=["']([^"']+)["']\s+(?:property=["']og:description["']|name=["']description["'])/i);if(v&&v[1]&&v[1].trim().length>15){const y=v[1].replace(/<[^>]+>/g,"").replace(/&#039;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,"&").trim();y.toLowerCase().includes("aradığınız dizi")||(a=y)}}(!a||a.includes("Bu dizi için konu özeti henüz eklenmedi"))&&(a=`${r} - Tüm bölümleri yüksek kalitede, kesintisiz ve donmadan Türkçe dublaj ve altyazı seçenekleriyle CinePulse Kısa Dizi Evreni'nde izleyin.`);const l=i.match(/<div class=["'][^"']*poster[^"']*["'][^>]*>[\s\S]*?<img[^>]+src=["']([^"']+)["']/i)||i.match(/<img[^>]+class=["'][^"']*spotlight[^"']*["'][^>]+src=["']([^"']+)["']/i),d=l?bn(l[1].replace(/&amp;/g,"&")):"",p=/<a[^>]+href=["'](?:\/izle\/|https:\/\/dramadizilerim\.com\/izle\/)([a-zA-Z0-9_-]+)\?s=(\d+)&e=(\d+)["'][^>]*>([\s\S]*?)<\/a>/gi,h=[];let m;for(;(m=p.exec(i))!==null;){const v=parseInt(m[2],10)||1,y=parseInt(m[3],10)||1,b=m[4],w=b.match(/class=["']wp-enum["']>([^<]+)</i)||b.match(/alt=["']([^"']+)["']/i),f=w?w[1].trim():`Bölüm ${y}`,k=b.match(/src=["']([^"']+)["']/i),x=k?bn(k[1].replace(/&amp;/g,"&")):"";h.some(L=>L.season===v&&L.episode===y)||h.push({season:v,episode:y,title:f,thumb:x})}return h.sort((v,y)=>v.season-y.season||v.episode-y.episode),{slug:e,title:r,poster:d,description:a,isDubbed:r.toLowerCase().includes("dublaj"),totalEpisodes:h.length,episodes:h}}async function vm({titles:e=[],seriesTitle:t="",season:i=1,episode:n=1,isDub:r=!0}){const a=[...new Set([...e,t])].filter(L=>L&&typeof L=="string"&&L.trim().length>1);if(a.length===0)return[];const o=parseInt(i,10)||1,s=parseInt(n,10)||1;let l=null,d=null;for(const L of a){const S=Gh(L),A=`/izle/${S}?s=${o}&e=${s}`,C=await mi(A,{method:"HEAD",timeout:3500});if(C&&C.ok){l=S;break}}if(!l)for(const L of a){const S=await qc(L);if(S.length>0){for(const $ of S)if(Yh($.title,a,.75)){l=$.slug,d=$;break}if(l)break;const A=cl(L),C=S.find($=>{const N=cl($.title);return N===A||N.includes(A)||A.includes(N)});if(C){l=C.slug,d=C;break}}}if(!l)return[];const p=`/izle/${l}?s=${o}&e=${s}`,h=await mi(p);if(!h)return[];const m=await h.text().catch(()=>"");if(!m)return[];const v=m.match(/(?:data-src|src)=["']([^"']*embed\.php[^"']*)["']/i);if(!v)return[];let y=v[1].replace(/&amp;/g,"&");y.startsWith("http")||(y=`${gi}${y.startsWith("/")?"":"/"}${y}`);const b=await mi(y,{headers:{Referer:`${gi}${p}`}});if(!b)return[];const w=await b.text().catch(()=>"");if(!w)return[];const f=[],k=w.match(/let\s+source\s*=\s*["']([^"']+)["']/);let x=k&&k[1].startsWith("http")?k[1]:null;if(!x){const L=w.match(/https?:\/\/[^"'\s\\]+\.(?:m3u8|mp4)[^"'\s\\]*/);L&&(x=L[0])}if(x){const L=x.includes(".m3u8")||x.includes("mpegurl"),C=(d?.title||l).toLowerCase().includes("dublaj")||r===!0?`🇹🇷 DDZ VIP S${o}E${s} (TR Dublaj)`:`⚡ DDZ VIP S${o}E${s} (TR Altyazı)`;f.push({id:`ddz_ep_${l}_${o}_${s}`,name:C,displayName:C,badge:"🎭 DDZ VIP",source:"DDZ VIP",url:x,streamUrl:x,rawStreamUrl:x,quality:"1080p HD",isHls:L,isDirectVideo:!0,priority:2,getUrl:()=>x})}return f}async function Xh(e=null,t=""){let i=t?"search":"trending",n=t||"",r=1,a=[],o=null,s="";const l=[{id:"trending",label:"Trendler",icon:"flame",query:""},{id:"all",label:"Tüm Katalog",icon:"layers",query:""},{id:"dubbed",label:"Türkçe Dublaj",icon:"sparkles",query:"dublaj"},{id:"patron",label:"CEO & Patron",icon:"briefcase",query:"patron"},{id:"kurt",label:"Kurt & Alfa",icon:"moon",query:"kurt"},{id:"intikam",label:"İntikam & Aşk",icon:"heart-crack",query:"intikam"},{id:"milyarder",label:"Milyarder",icon:"crown",query:"milyarder"},{id:"evlilik",label:"Yasak Aşk & Evlilik",icon:"ring",query:"evlilik"}];return{html:`
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
  `,init:async p=>{const h=p.querySelector("#drama-view-root");if(!h)return;const m=h.querySelector("#drama-search-input"),v=h.querySelector("#btn-drama-search-clear");h.querySelector("#drama-search-feedback");const y=h.querySelectorAll(".drama-chip"),b=h.querySelector("#drama-section-title"),w=h.querySelector("#drama-counter-badge"),f=h.querySelector("#drama-cards-grid"),k=h.querySelector("#drama-load-more-wrap"),x=h.querySelector("#btn-drama-load-more"),L=h.querySelector("#drama-detail-modal"),S=h.querySelector("#drama-modal-dialog");let A=null;async function C(z=!1){z||(f.innerHTML=Array.from({length:12}).map(()=>`
            <div class="drama-card-skeleton">
              <div class="skeleton-poster"></div>
              <div class="skeleton-title"></div>
            </div>
          `).join(""),w.textContent="Yükleniyor...");try{let D=[];if(n&&n.trim().length>=2)D=await xa({query:n.trim()}),b.innerHTML=`
              <i data-lucide="search" style="width: 20px; height: 20px; color: #a855f7;"></i>
              <span>"${n}" İçin Arama Sonuçları</span>
            `,k.classList.add("hidden");else{const K=l.find(ne=>ne.id===i)||l[0];i==="trending"?(D=await Vh(),b.innerHTML=`
                <i data-lucide="flame" style="width: 20px; height: 20px; color: #f43f5e;"></i>
                <span>Trend Kısa Diziler</span>
              `,k.classList.add("hidden")):i==="all"?(D=await xa({page:r}),b.innerHTML=`
                <i data-lucide="layers" style="width: 20px; height: 20px; color: #3b82f6;"></i>
                <span>Tüm Kısa Diziler Kataloğu (Sayfa ${r})</span>
              `,k.classList.toggle("hidden",D.length===0)):K.query&&(D=await xa({query:K.query}),b.innerHTML=`
                <i data-lucide="${K.icon}" style="width: 20px; height: 20px; color: #c084fc;"></i>
                <span>${K.label} Serileri</span>
              `,k.classList.add("hidden"))}z?a=[...a,...D]:a=D,$()}catch{f.innerHTML=`
            <div class="drama-empty-state">
              <i data-lucide="alert-circle" style="width: 44px; height: 44px; color: #ef4444;"></i>
              <h3>Diziler yüklenirken bir sorun oluştu</h3>
              <p>Lütfen internet bağlantınızı kontrol edip tekrar deneyin.</p>
              <button class="btn-primary" id="btn-drama-retry">Tekrar Dene</button>
            </div>
          `,h.querySelector("#btn-drama-retry")?.addEventListener("click",()=>C(!1)),J(f)}finally{}}function $(){if(!a||a.length===0){f.innerHTML=`
            <div class="drama-empty-state">
              <i data-lucide="film" style="width: 48px; height: 48px; color: #94a3b8;"></i>
              <h3>Eşleşen Kısa Dizi Bulunamadı</h3>
              <p>Farklı bir anahtar kelime ile arama yapabilir veya Trend kategorisine göz atabilirsiniz.</p>
            </div>
          `,w.textContent="0 Dizi",J(f);return}w.textContent=`${a.length} Dizi`,f.innerHTML=a.map((z,D)=>{const K=z.isDubbed||z.title.toLowerCase().includes("dublaj"),ne=z.poster||"";return`
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
                  <span class="drama-badge-pill ${K?"badge-dub":"badge-sub"}">
                    ${K?"🇹🇷 DUBLAJ":"TR ALTYAZI"}
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
          `}).join(""),J(f),f.querySelectorAll(".drama-card").forEach(z=>{z.addEventListener("click",()=>{const D=z.getAttribute("data-slug");D&&N(D)}),z.addEventListener("keydown",D=>{if(D.key==="Enter"||D.key===" "){D.preventDefault();const K=z.getAttribute("data-slug");K&&N(K)}})})}async function N(z){if(z){o=null,L.classList.remove("hidden"),document.body.style.overflow="hidden",S.innerHTML=`
          <div class="drama-detail-loading">
            <div class="spin-loader"></div>
            <span>Dizi bilgileri ve bölümler yükleniyor...</span>
          </div>
        `,J(S);try{const D=await Jh(z);if(!D){S.innerHTML=`
              <div class="drama-empty-state">
                <i data-lucide="alert-circle" style="width: 38px; height: 38px; color: #ef4444;"></i>
                <h3>Dizi bilgisi alınamadı</h3>
                <button class="btn-primary" id="btn-close-drama-modal">Kapat</button>
              </div>
            `,h.querySelector("#btn-close-drama-modal")?.addEventListener("click",G),J(S);return}o=D,O()}catch{G(),Z("Dizi detayları yüklenemedi.","error")}}}function O(){if(!o)return;const{slug:z,title:D,poster:K,description:ne,episodes:Q=[],isDubbed:re}=o,H=Q.length,oe=s?Q.filter(W=>W.title.toLowerCase().includes(s)||String(W.episode).includes(s)):Q;S.innerHTML=`
          <button class="drama-modal-close-btn" id="btn-close-drama-modal" title="Kapat">
            <i data-lucide="x" style="width: 20px; height: 20px;"></i>
          </button>

          <div class="drama-detail-hero">
            <div class="drama-detail-backdrop-blur" style="background-image: url('${K||""}');"></div>
            <div class="drama-detail-hero-content">
              <div class="drama-detail-poster-wrap">
                <img src="${K||""}" alt="${D}" class="drama-detail-poster" />
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
                <h2 class="drama-detail-title">${D}</h2>
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
              ${oe.map(W=>{const ae=mn(`ddz_${z}`,W.season,W.episode);return`
                  <button 
                    class="drama-ep-card ${ae?"is-watched":""}" 
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
                      ${ae?'<div class="drama-ep-watched-tag"><i data-lucide="check" style="width: 12px; height: 12px;"></i></div>':""}
                    </div>
                    <div class="drama-ep-title-wrap">
                      <span class="drama-ep-name">${W.title}</span>
                      <span class="drama-ep-action-hint">İzle</span>
                    </div>
                  </button>
                `}).join("")}
            </div>
          </div>
        `,J(S),S.querySelector("#btn-close-drama-modal")?.addEventListener("click",G),S.querySelector("#btn-play-drama-start")?.addEventListener("click",()=>{Q.length>0&&U(Q[0].season,Q[0].episode)}),S.querySelector("#btn-share-drama")?.addEventListener("click",()=>{const W=`${window.location.origin}${window.location.pathname}#dramas?slug=${z}`;navigator.clipboard?.writeText(W).then(()=>{Z("Dizi bağlantısı panoya kopyalandı!","success")}).catch(()=>{Z(`Bağlantı: ${W}`,"info")})});const V=S.querySelector("#drama-ep-filter-input");V&&V.addEventListener("input",W=>{s=W.target.value.toLowerCase().trim(),O(),S.querySelector("#drama-ep-filter-input")?.focus()}),S.querySelectorAll(".drama-ep-card").forEach(W=>{W.addEventListener("click",()=>{const ae=parseInt(W.getAttribute("data-season"),10)||1,fe=parseInt(W.getAttribute("data-episode"),10)||1;U(ae,fe)})})}function G(){L.classList.add("hidden"),document.body.style.overflow="",o=null,s=""}L.addEventListener("click",z=>{z.target===L&&G()});function U(z=1,D=1){if(!o)return;const{slug:K,title:ne,poster:Q,description:re,episodes:H=[]}=o,oe=H.find(V=>V.season===z&&V.episode===D)?.thumb||"";ti({type:"tv",tmdbId:`ddz_${K}`,title:`${ne} - B${D}`,seriesTitle:ne,season:z,episode:D,posterPath:Q,backdropPath:Q,playerVariant:"short-drama",seriesOverview:re||"",episodeArtworkPath:oe||Q,shortDramaEpisodes:H,maxEpisodes:H.length,seasonsList:[{season_number:z,episode_count:H.length}]})}m?.addEventListener("input",z=>{const D=z.target.value;v.classList.toggle("hidden",!D),clearTimeout(A),A=setTimeout(()=>{n=D.trim(),r=1,i=n?"search":"trending",y.forEach(K=>K.classList.toggle("active",!n&&K.getAttribute("data-tab-id")==="trending")),C(!1)},350)}),m?.addEventListener("keydown",z=>{z.key==="Enter"&&(z.preventDefault(),clearTimeout(A),n=m.value.trim(),r=1,C(!1))}),v?.addEventListener("click",()=>{m.value="",v.classList.add("hidden"),n="",i="trending",y.forEach(z=>z.classList.toggle("active",z.getAttribute("data-tab-id")==="trending")),C(!1)}),y.forEach(z=>{z.addEventListener("click",()=>{const D=z.getAttribute("data-tab-id");i===D&&!n||(i=D,n="",m&&(m.value=""),v?.classList.add("hidden"),r=1,y.forEach(K=>K.classList.toggle("active",K===z)),C(!1))})}),x?.addEventListener("click",()=>{r++,C(!0)}),await C(!1),e&&N(e)}}}const Ta=[{id:"user-circle",icon:"user",label:"Klasik",color:"#f59e0b"},{id:"clapperboard",icon:"clapperboard",label:"Sinema",color:"#ec4899"},{id:"film",icon:"film",label:"Yıldız",color:"#8b5cf6"},{id:"sparkles",icon:"sparkles",label:"Sihirli",color:"#10b981"},{id:"tv",icon:"tv",label:"Dizi Kolik",color:"#3b82f6"},{id:"baby",icon:"baby",label:"Çocuk",color:"#38bdf8"},{id:"smile",icon:"smile",label:"Neşeli",color:"#eab308"},{id:"flame",icon:"flame",label:"Ateşli",color:"#ef4444"}];function Zh(){if(ul()||document.getElementById("profile-onboarding-overlay"))return;const e=document.createElement("div");e.id="profile-onboarding-overlay",e.className="onboarding-overlay",e.innerHTML=`
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
  `,document.body.appendChild(e),window.lucide&&J(e);let t=Ta[0].id,i=Ta[0].color;e.querySelectorAll(".onboarding-avatar-btn").forEach(o=>{o.addEventListener("click",()=>{e.querySelectorAll(".onboarding-avatar-btn").forEach(s=>s.classList.remove("selected")),o.classList.add("selected"),t=o.getAttribute("data-avatar"),i=o.getAttribute("data-color")})});const n=e.querySelector("#onboarding-form"),r=e.querySelector("#onboarding-name-input"),a=e.querySelector("#onboarding-is-kid");n.addEventListener("submit",o=>{o.preventDefault();const s=r.value.trim();s&&(Jc({name:s,avatar:t,color:i,isKid:a.checked}),e.classList.add("animate-fade-out"),setTimeout(()=>{e.remove(),window.location.reload()},280))})}const tn=[{icon:"sparkles",eyebrow:"CinePulse rehberi",title:"İzlemeye hazır bir ana ekran",text:"Ana sayfadaki satırları yatay kaydırarak yapımları gez. Arama simgesinden dizi veya film adını yazdığında sonuçlar anında görünür.",hint:"Mobilde alt menüden Diziler, Filmler, Keşfet ve Listem’e geçebilirsin."},{icon:"clapperboard",eyebrow:"Fragman önizleme",title:"Karttan fragmana bak",text:"Telefonda bir içerik kartına kısa süre basılı tut; fragman ekranın alt kısmında açılır. Bilgisayarda kartın üzerine gelmen yeterli.",hint:"Önizlemeyi sağ üstteki çarpıdan kapatabilir, ses simgesinden sesi açabilirsin."},{icon:"list-plus",eyebrow:"Kişisel liste",title:"Listem senin kontrolünde",text:"İçerik detayındaki artı düğmesiyle yapımları Listem’e ekle. Listem sayfasından kaydettiğin yapımları açabilir veya kaldırabilirsin.",hint:"İzleme ilerlemen de aynı tarayıcıda otomatik hatırlanır."},{icon:"shield-check",eyebrow:"Spoilersız keşif",title:"Diziyi güvenle incele",text:"Dizi detayında “Spoilersız keşfet” seçeneğini açarsan, izleme ilerlemenin sonrasındaki bölüm başlıkları, görselleri ve özetleri gizlenir.",hint:"İzlediğin bölüme ve sıradaki bölüme kadar detay görürsün; ilerledikçe yeni bölümler açılır."},{icon:"users-round",eyebrow:"Birlikte Seç",title:"Arkadaşınla aynı odada izle",text:"Üstteki Birlikte Seç düğmesinden oda oluştur veya altı haneli kodla bir odaya katıl. Moderatör içerik ve kaynak seçer; odada emoji ve sohbet de kullanabilirsin.",hint:"Oynatıcıdaki “Odaya dön” düğmesindeki rozet yeni sohbet mesajlarını gösterir."},{icon:"monitor-play",eyebrow:"Oynatıcı",title:"Kontroller elinin altında",text:"İçeriği açınca ekrana bir kez dokunarak kontrolleri göster. Zaman çubuğundan sarabilir, kaynakları değiştirebilir, altyazı ve ses seçebilirsin.",hint:"Tam ekran, ses ve parlaklık ayarları her cihazda sana ait kalır."}];function Qh(){if(!ul()||Gc()||document.getElementById("cinepulse-product-tour"))return;let e=0;const t=document.body.style.overflow,i=document.createElement("section");i.id="cinepulse-product-tour",i.className="product-tour-overlay",i.setAttribute("role","dialog"),i.setAttribute("aria-modal","true"),i.setAttribute("aria-label","CinePulse kullanım rehberi");const n=()=>{Vc(),document.body.style.overflow=t,i.classList.add("is-leaving"),window.setTimeout(()=>i.remove(),180)},r=()=>{const a=tn[e];i.innerHTML=`
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
    `,J(i),i.querySelector(".product-tour-skip")?.addEventListener("click",n),i.querySelector(".product-tour-back")?.addEventListener("click",()=>{e=Math.max(0,e-1),r()}),i.querySelector(".product-tour-next")?.addEventListener("click",()=>{e>=tn.length-1?n():(e+=1,r())})};document.body.appendChild(i),document.body.style.overflow="hidden",r()}function em(e){const t=e==="landscape";document.querySelectorAll(".card-poster-img").forEach(n=>{const r=t?n.dataset.backdropSrc||n.src:n.dataset.posterSrc||n.src;!r||n.src===r||(n.src=r,n.dataset.activeLayout=e)})}function tm(){const e=$t().cardLayout==="landscape"?"landscape":"portrait";return`
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
  `}function im(e=document){const t=e.querySelector("#card-layout-switcher");if(!t)return;const i=[...t.querySelectorAll(".card-layout-option")],n=()=>{t.isConnected&&qi(document,!1)};"requestIdleCallback"in window?window.requestIdleCallback(n,{timeout:1e3}):setTimeout(n,300),i.forEach(r=>{r.addEventListener("click",a=>{a.preventDefault();const o=r.dataset.layout==="landscape"?"landscape":"portrait",s=o==="landscape",l=document.documentElement.classList.contains("cards-landscape")?"landscape":"portrait";o!==l&&(document.documentElement.classList.toggle("cards-landscape",s),i.forEach(d=>{const p=d.dataset.layout===o;d.classList.toggle("active",p),d.setAttribute("aria-pressed",String(p))}),em(o),bl({cardLayout:o}),s&&qi(document,!0))})})}const jr=!!(window.Capacitor?.isNativePlatform?.()&&window.Capacitor?.getPlatform?.()==="android");document.documentElement.classList.toggle("native-android",jr);const Fc=matchMedia("(max-width: 768px)");document.documentElement.classList.toggle("mobile-web",!jr&&Fc.matches);Fc.addEventListener?.("change",e=>{document.documentElement.classList.toggle("mobile-web",!jr&&e.matches)});if(jr){const e=window.fetch.bind(window),t="https://cine-pulse-drab.vercel.app";window.fetch=(i,n)=>{if(typeof i=="string"&&i.startsWith("/api/"))i=`${t}${i}`;else if(i instanceof URL&&i.origin===window.location.origin&&i.pathname.startsWith("/api/"))i=`${t}${i.pathname}${i.search}${i.hash}`;else if(typeof Request<"u"&&i instanceof Request){const r=new URL(i.url);r.origin===window.location.origin&&r.pathname.startsWith("/api/")&&(i=new Request(`${t}${r.pathname}${r.search}${r.hash}`,i))}return e(i,n)}}if(typeof window<"u")try{za.addListener("backButton",({canGoBack:e})=>{const t=document.getElementById("player-modal-container")||document.querySelector(".player-modal-overlay");if(t){const r=document.getElementById("player-close-btn");r?r.click():t.remove();return}const i=document.querySelector(".modal-overlay, .decision-modal-overlay, .profile-modal-overlay, .data-manager-modal");if(i){const r=i.querySelector('.modal-close, .btn-modal-close, [data-action="close"]');r?r.click():i.remove();return}const n=window.location.hash||"#home";if(n!=="#home"&&n!==""){e?window.history.back():window.location.hash="#home";return}za.exitApp()})}catch{}"scrollRestoration"in history&&(history.scrollRestoration="manual");"serviceWorker"in navigator&&window.location.protocol.startsWith("http")&&window.addEventListener("load",()=>{const e="20260920-mobile-preview-2",t=`cinepulse-sw-reloaded-${e}`;navigator.serviceWorker.addEventListener("controllerchange",()=>{sessionStorage.getItem(t)||(sessionStorage.setItem(t,"1"),window.location.reload())}),navigator.serviceWorker.register(`/sw.js?build=${e}`,{updateViaCache:"none"}).then(i=>i.update()).catch(()=>{})});Zd();window.addEventListener("keydown",e=>{e.ctrlKey&&e.altKey&&e.shiftKey&&e.key==="F10"&&(e.preventDefault(),e.stopImmediatePropagation(),Oh(),window.location.hash="#admin")},!0);const oi=document.getElementById("app");document.documentElement.classList.toggle("cards-landscape",$t().cardLayout==="landscape");typeof navigator<"u"&&navigator.onLine===!1&&window.location.hash!=="#downloads"&&(window.location.hash="#downloads");window.addEventListener("scroll",()=>{$f()},{passive:!0});window.addEventListener("pagehide",Hr);let Aa=0;async function ji(){const e=++Aa;Ff(),Hr();const t=window.location.hash||"#home";let i="home",n={};if(t.startsWith("#detail")){if(i="detail",t.includes("?")){const l=t.split("?")[1]||"",d=new URLSearchParams(l);n.type=d.get("type")||"tv",n.id=d.get("id")}else if(t.includes("/")){const l=t.split("/");l.length>=3?(n.type=l[1]||"tv",n.id=l[2]):l.length===2&&(n.type="tv",n.id=l[1])}}else if(t==="#series")i="series";else if(t==="#cartoons")i="cartoons";else if(t==="#movies")i="movies";else if(t==="#anime")i="anime";else if(t==="#documentary")i="documentary";else if(t==="#livetv")i="livetv";else if(t==="#discover")i="discover";else if(t==="#library")i="library";else if(t==="#downloads")i="downloads";else if(t.startsWith("#dramas")){if(i="dramas",t.includes("?")){const l=t.split("?")[1]||"",d=new URLSearchParams(l);n.slug=d.get("slug"),n.q=d.get("q")}}else if(t==="#admin"){if(!Nh()){window.location.replace("#home");return}i="admin"}if(window.__popularListCleanup?.(),window.__popularListCleanup=null,window.__discoverCleanup?.(),window.__discoverCleanup=null,window.__LiveTvController&&typeof window.__LiveTvController.cleanup=="function"&&window.__LiveTvController.cleanup(),document.querySelectorAll("video, audio").forEach(l=>{try{l.pause(),l.removeAttribute("src"),l.load()}catch{}}),i==="admin"){const l=await Uh();if(e!==Aa)return;oi.innerHTML=`
      <div class="admin-standalone-wrapper" style="min-height: 100vh; background: #07090e; display: flex; flex-direction: column; width: 100%;">
        ${l?l.html:""}
      </div>
    `,l&&typeof l.init=="function"&&l.init(oi),J();return}const r=Tf(i),o=new Set(["home","series","cartoons","movies","anime","documentary","discover","library"]).has(i)?tm():"";(i==="home"||i==="detail")&&(oi.innerHTML=`${r}<main class="route-loading" aria-live="polite"><div class="spin-loader"></div><span>İçerikler yükleniyor...</span></main>`,Wo(),J(oi));let s=null;i==="home"?s=await Kf():i==="detail"?s=await dh(n.type,n.id):i==="series"?s=await en("tv"):i==="cartoons"?s=await en("cartoon"):i==="movies"?s=await en("movie"):i==="anime"?s=await en("anime"):i==="documentary"?s=await en("documentary"):i==="livetv"?s=Mh():i==="discover"?s=await kh("tv"):i==="library"?s=vh():i==="downloads"?s=wh():i==="dramas"&&(s=await Xh(n.slug,n.q)),e===Aa&&(oi.innerHTML=`
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
  `,Wo(),im(oi),s&&s.init&&s.init(oi),window.lucide&&J(),Rf(t))}window.addEventListener("hashchange",ji);window.addEventListener("offline",()=>{window.location.hash!=="#downloads"&&(window.location.hash="#downloads")});ji();setTimeout(async()=>{try{const e=String(new URL(window.location.href).searchParams.get("oda")||"").replace(/\D/g,"");if(!/^\d{6}$/.test(e))return;fr({roomCode:e})}catch{}},700);setTimeout(()=>{Zh()},400);setTimeout(()=>{Qh()},1200);const Uc={getWatchHistory:Me,saveWatchProgress:rs,saveBatchWatchProgress:hl};window.addEventListener("cinepulse_trakt_auth_changed",e=>{e.detail?.connected&&Cl(Uc)});Cl(Uc);vu();const jc=e=>{e&&e.detail&&(e.detail.action==="import"||e.detail.cleared)&&ji()};window.addEventListener("sineflix_data_changed",jc);window.addEventListener("cinepulse_data_changed",jc);window.addEventListener("sineflix_profile_changed",async()=>{un(),await ji()});window.addEventListener("cinepulse_admin_state_changed",ji);window.addEventListener("storage",e=>{if(e.key!=="sineflix_user_settings_v1")return;const t=$t();document.documentElement.classList.toggle("cards-landscape",t.cardLayout==="landscape"),un(),ji()});export{am as A,rm as B,Bt as C,es as D,pm as E,fs as W,nt as a,Oa as b,zc as c,He as d,ym as e,vm as f,$s as g,ot as h,Yh as i,we as j,Qt as k,mn as l,gm as m,ci as n,um as o,ml as p,Eh as q,hm as r,Z as s,fm as t,gl as u,os as v,nm as w,rs as x,mm as y,sm as z};
