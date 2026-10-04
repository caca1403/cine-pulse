import{r as ge,c as fs}from"./playerLifecycle-BycGPIoX.js";import{e as Ua,i as Pe,d as wa,g as ka}from"./dramalarScraper-BUEPBRCz.js";import{ab as Xe,D as Wt,s as G,n as xo,au as Ao,p as br,a as hr,x as mi,z as Ot,av as zo,t as Do,aw as yr,ax as To,ay as Co,az as gr,aA as Io,aB as Bo,aC as _o}from"./index-1v-iW0I5.js";import{Hls as Dt}from"./vendor-hls-BuERnqCp.js";import{g as Lo,r as vr,b as wr,i as bs,s as kr,f as Vt,d as Eo,t as Ro}from"./offlineManager-BFYCQUt6.js";import"./vendor-capacitor-VGCIBgSg.js";const Mo="https://wild-credit-e1ae.cagatayca07.workers.dev";function Uo(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-"):""}async function hs(i,s={}){if(typeof window<"u")try{const n=new URL(i),r=await fetch(Xe(`/api/szd${n.pathname}${n.search}`),{...s,headers:{...s.headers||{},"X-Requested-With":"XMLHttpRequest"},signal:AbortSignal.timeout(6e3)}).catch(()=>null);if(r&&r.ok)return r}catch{}try{const n=`${Mo}?url=${encodeURIComponent(i)}`,r=await fetch(n,{...s,signal:AbortSignal.timeout(4e3)}).catch(()=>null);if(r&&r.ok)return r}catch{}try{const n=await fetch(i,{...s,headers:{...s.headers||{},"X-Requested-With":"XMLHttpRequest",Referer:"https://sezonlukdizi.cc/","User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"},signal:AbortSignal.timeout(4e3)}).catch(()=>null);if(n&&n.ok)return n}catch{}return null}async function Sa({titles:i=[],seriesTitle:s="",originalTitle:o="",season:n=1,episode:r=1,isDub:d=!0}){const u=[...new Set([...i,s,o])].filter(y=>y&&typeof y=="string"&&y.trim().length>1);if(u.length===0)return[];const l=[];for(const y of u){const g=Uo(y);if(g&&!l.includes(g)&&(l.push(g),g.endsWith("-izle")||l.push(`${g}-izle`),g.startsWith("the-"))){const m=g.replace(/^the-/,"");l.includes(m)||l.push(m)}}const p="https://sezonlukdizi.cc";for(const y of l)try{const g=`${p}/${y}/${n}-sezon-${r}-bolum.html`,m=await hs(g);if(!m)continue;const x=await m.text(),T=Ua(x);if(!Pe(T,u))continue;const h=x.match(/data-id=["'](\d+)["']/i)||x.match(/var\s+bid\s*=\s*["']?(\d+)["']?/i)||x.match(/bid\s*=\s*(\d+)/i),D=h?h[1]:null;if(!D)continue;const U=d?"0":"1",I=`${p}/ajax/dataAlternatif22.asp`,P=await hs(I,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},body:`bid=${D}&dil=${U}`});if(!P)continue;const R=await P.json().catch(()=>null);if(!R||R.status!=="success"||!Array.isArray(R.data)||R.data.length===0)continue;const F=[],f=await Promise.all(R.data.map(async w=>{const se=`${p}/ajax/dataEmbed22.asp`,ne=await hs(se,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},body:`id=${w.id}`});if(!ne)return null;const N=(await ne.text().catch(()=>"")).match(/src=["']([^"']+)["']/i);let te=N?N[1]:null;if(te&&!te.includes("reCAPTCHA")&&te.length>10){if(w.baslik?.toLowerCase().includes("filemoon")||w.baslik?.toLowerCase().includes("videosoft")||te.includes("bysejikuar")||te.includes("filemoon")||te.includes("videoseyred"))return null;te.startsWith("//")&&(te="https:"+te);const ve=w.baslik==="VidMoly"||te.includes("vidmoly"),Q=te,be=ve?"VidMoly 1080p":`${w.baslik} HD`;return{id:`szd_${w.id}`,name:be,displayName:be,badge:`⚡ ${w.baslik}`,category:d?"dubbed":"subtitled",url:Q,streamUrl:Q,isHls:!1,isDirectVideo:!1,getUrl:()=>Q}}return null}));if(F.push(...f.filter(Boolean)),F.length>0)return F}catch{}return[]}const Po="https://ydfvfdizipanel.ru/public/api",Mi="EuXs1Y5oXTrDpGte3E2dNDIu82LLjaoCd6om",qo={hash256:"f4d4bc98a3fc4600e7f2c2bab7533f1f03d8a70ff03c256bb11dc57050536bd0",signature:"308202c3308201aba0030201020204075cec01300d06092a864886f70d01010b050030123110300e0603550403130753696e65776978301e170d3231303932313233333334395a170d3436303931353233333334395a30123110300e0603550403130753696e6577697830820122300d06092a864886f70d01010105000382010f003082010a0282010100b0a2a1bc5c3f16f19c3b2456cfd0a6128ced9f5e2e2c4cca1a100e17b07b86256258f372e76a95a17e9e4a1c048e364835723a95e8ef6d5bdfb5694b50277c65a64f7b012fdf164e5dc93629561f6ca29b7dc82ebb3d6f3c8e8fc6795847fe331ad4a13ed6c059a83804c43d3747526d769580f3a4153752eb22dac66dd15f1582caa43305dc49f55ac7b1b89013e654d2ca8c94c30956659674cc673256c04208f09118bae14cdd72d78f9ee2aece958084a8c2e315deff45726d4fc1f18ec39569ff1abe4f36a8d01090e5f68c07c28763513b88208bcac1a6e1941f6fd8bfdd52f832098ddb2154c8f565bc5d58c7106a19e03787e75c7f34997000e3bcf30203010001a321301f301d0603551d0e04160414b545fc18e74a791d9402b53940ae38b96e9e209c300d06092a864886f70d01010b05000382010100a8a64d9e7c8b5db102af15d3caf94ff8d3e9be9008bb0021117ca2f0762e68583354b126a041bb1fb6e6308e421e4b5a71f779cde63e5d2fc5976bff966c3c4034e852c077d8e74458fbae2ec1db74b1f4082e188bf8ef7c42a44e3fbfb693bb00ee2a727096b42360ddce1bdcd3536f50c8693bcc62a7b7204bcefe2ecf1f7c820bcd63e1d7a6acc8bf6163086915fc5f607cf51bc7a8635f98bb4c65a8f24b7b5a82c7b06868f565cb0d6ac4775c4aac777536ddd1a565f990fd8cbe539185fa7aab610b7855a687a00f4e55536d72873444552c50fd10727dbf298a9be6ed6ae62148dd1de365f3729915dd31975e28a472d752ac14db3db548405cc31e1e",packagename:"com.sinewix","User-Agent":"EasyPlex (Android 14; SM-A546B; Samsung Galaxy A54 5G; tr)",Accept:"application/json"},No="https://wild-credit-e1ae.cagatayca07.workers.dev";function Ho(i,s,o=null,n=null){return Pe(s,[i])?o&&n?Math.abs(parseInt(o,10)-parseInt(n,10))<=1:!0:!1}async function Ui(i){const s=i.startsWith("/")?i:`/${i}`,o=`${Po}${s}`,n=r=>!!(r&&(r.search||r.videos||r.seasons||r.data||r.title||r.id||Array.isArray(r)));try{const r=`${No}?url=${encodeURIComponent(o)}`,d=await fetch(r,{signal:AbortSignal.timeout(6e3)}).catch(()=>null);if(d&&d.ok){const u=await d.json().catch(()=>null);if(n(u))return u}}catch{}try{const r=Xe(`/api/snx?path=${encodeURIComponent(s)}`),d=await fetch(r,{signal:AbortSignal.timeout(6e3)}).catch(()=>null);if(d&&d.ok){const u=await d.json().catch(()=>null);if(n(u))return u}}catch{}try{const r=await fetch(o,{headers:qo,signal:AbortSignal.timeout(6e3)}).catch(()=>null);if(r&&r.ok){const d=await r.json().catch(()=>null);if(n(d))return d}}catch{}return null}async function jo({type:i="tv",titles:s=[],seriesTitle:o="",title:n="",originalTitle:r="",year:d=null,season:u=1,episode:l=1,isDub:p=!0,imdbId:y=""}){const g=i==="movie";try{const m=[...Array.isArray(s)?s:[],o,n,r].filter(Boolean),x=[...new Set(m.map(R=>R.replace(/\s*\(\d{4}\).*/,"").trim()).filter(Boolean))];if(x.length===0)return[];let T=null,h=null;if(!g&&y){const R=await Ui(`/search/episode-${Number(l)}/imdbid-${encodeURIComponent(y)}/season-${Number(u)}/${Mi}`);R&&(R.videos||R.streams||R.seasons||R.data)&&(h=R)}for(const R of x){const F=await Ui(`/search/${encodeURIComponent(R)}/${Mi}`),f=F?.search||F?.data||[];if(!Array.isArray(f)||f.length===0)continue;const w=f.filter(re=>g?re.type==="movie"||re.type==="film":re.type==="serie"||re.type==="series"||re.type==="tv"||re.type==="anime"),ne=(w.length>0?w:f).find(re=>{const N=[re.title,re.name,re.original_name,re.original_title].filter(Boolean),te=(re.release_date||re.first_air_date||"").substring(0,4);return x.some(ve=>N.some(Q=>Ho(ve,Q,d,te)))});if(ne){T=ne;break}}if(!T&&!h)return[];const D=T?.id,U=T?.type==="anime";let I=[];if(h&&(I=h.videos||h.streams||h.data||[],!Array.isArray(I)&&typeof I=="object"&&(I=Object.values(I))),!h)if(g)I=(await Ui(`/media/detail/${D}/${Mi}`))?.videos||[];else if(U){const R=await Ui(`/animes/show/${D}/${Mi}`);if(R?.seasons&&Array.isArray(R.seasons)){const F=R.seasons.find(f=>f.season_number===Number(u));if(F?.episodes&&Array.isArray(F.episodes)){const f=F.episodes.find(w=>w.episode_number===Number(l));I=f?f.videos||[]:[]}}}else{const R=await Ui(`/series/show/${D}/${Mi}`);if(R?.seasons&&Array.isArray(R.seasons)){const F=R.seasons.find(f=>f.season_number===Number(u));if(F?.episodes&&Array.isArray(F.episodes)){const f=F.episodes.find(w=>w.episode_number===Number(l));I=f?f.videos||[]:[]}}}const P=[];for(const R of I){const F=(R.link||R.url||"").trim();if(!F)continue;const f=F.toLowerCase();if(f.includes("mediafire.com")||f.includes("mega.nz")||f.includes("pichive")||f.includes("turbobit")||f.includes("yadi.sk"))continue;const w=f.includes("trsub")||f.includes(".sub.")||f.includes("altyazi")||R.lang&&R.lang.toLowerCase().includes("sub"),se=f.includes("dual")||f.includes("trdub")||R.lang&&(R.lang.toLowerCase().includes("dual")||R.lang.toLowerCase().includes("tr")),ne=typeof p=="boolean";if(ne&&p&&w&&!se||ne&&!p&&!w&&!se&&f.includes("dub"))continue;const re=f.includes(".mkv"),N=f.includes(".mp4")||f.includes(".webm")||re,te=f.includes(".m3u8"),ve=F.startsWith("http")?te?Xe(`/api/hls_proxy?url=${encodeURIComponent(F)}`):re?Xe(`/api/mkv_stream?url=${encodeURIComponent(F)}&ref=${encodeURIComponent("https://ydfvfdizipanel.ru/")}`):N?Xe(`/api/proxy?url=${encodeURIComponent(F)}&ref=${encodeURIComponent("https://ydfvfdizipanel.ru/")}`):F:F,Q=N?re?"SWX 1080p (MKV)":"SWX 1080p Direct":"SWX VIP 1080p",be=w?"💬 TR Altyazı 1080p":se?"⚡ SWX Dual 1080p":"⚡ SWX 1080p";P.push({id:`snx_${R.id||Math.random().toString(36).substring(7)}`,name:Q,displayName:Q,badge:be,category:w?"subtitled":se?"dubbed":p===!1?"subtitled":"dubbed",streamUrl:ve,url:ve,originalEmbedUrl:F,isHls:te,isDirectVideo:!0,isMkv:re,source:"SWX",getUrl:()=>ve})}return P}catch{return[]}}const Sr="https://wild-credit-e1ae.cagatayca07.workers.dev";function $r(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^\w\s-]/g," ").replace(/\s+/g," ").trim():""}async function xr({titles:i=[],seriesTitle:s="",title:o="",originalTitle:n="",season:r=1,episode:d=1,isDub:u=!1}){const l=[...new Set([n,s,o,...i])].filter(x=>x&&typeof x=="string"&&x.trim().length>1);if(l.length===0)return[];const p=[],y=new Set;for(const x of l)try{const T=$r(x);if(!T||T.length<2)continue;const h=`https://animecix.net/secure/search/${encodeURIComponent(T)}`,D=await fetch(`${Sr}?url=${encodeURIComponent(h)}`,{signal:AbortSignal.timeout(3500)});if(!D.ok)continue;const U=await D.json();if(!U.results||!Array.isArray(U.results))continue;for(const I of U.results)if(I&&I.id&&!y.has(I.id)){const P=$r(I.name||I.name_english||I.name_romanji||I.original_title||"");Pe(P,l)&&(y.add(I.id),p.push(I))}if(p.length>=5)break}catch{}if(p.length===0)return[];const g=[],m=new Set;for(const x of p.slice(0,4))try{const T=`https://animecix.net/secure/episode-videos?titleId=${x.id}&season=${r}&episode=${d}`,h=await fetch(`${Sr}?url=${encodeURIComponent(T)}`,{signal:AbortSignal.timeout(4e3)});if(!h.ok)continue;const D=await h.json();if(!Array.isArray(D)||D.length===0)continue;const U=[];for(const I of D){if(!I||!I.url||typeof I.url!="string")continue;const P=I.url.trim();if(m.has(P)||P.length<5)continue;m.add(P);const F=(I.name||"VIP").replace(/animecix/gi,"AX"),f=I.extra?` • ${I.extra}`:"",w=(F+" "+(I.extra||"")).toLowerCase().includes("dublaj");u&&!w||U.push({id:`acx_${x.id}_${I.id||g.length}_${u?"dub":"sub"}`,name:`AX - ${F} (${u?"1080p TR Dublaj":"1080p Altyazılı"})${f}`,displayName:`AX - ${F} (${u?"1080p TR Dublaj":"1080p Altyazılı"})`,badge:u?"🎌 Dublaj":`🎌 ${F}`,category:u?"dubbed":"subtitled",providerName:F,streamUrl:P,url:P,getUrl:()=>P})}if(U.sort((I,P)=>{const R=F=>{const f=(F.providerName+" "+F.streamUrl).toLowerCase();return f.includes("tau")?1:f.includes("sibnet")?2:f.includes("vidmoly")?3:f.includes("ok.ru")?4:f.includes("mail.ru")?5:f.includes("dood")?6:7};return R(I)-R(P)}),g.push(...U),g.length>=6)break}catch{}return g}const Fo="https://wild-credit-e1ae.cagatayca07.workers.dev";function Ko(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-"):""}async function Wo({titles:i=[],seriesTitle:s="",title:o="",originalTitle:n="",season:r=1,episode:d=1,isDub:u=!1}){const l=[...new Set([...i,s,o,n])].filter(y=>y&&typeof y=="string"&&y.trim().length>1);if(l.length===0)return[];const p=[...new Set(l.map(y=>Ko(y)).filter(Boolean))];for(const y of p){if(!y)continue;const g=u?[`https://animetr.co/izle/${y}-turkce-dublaj/bolum-${d}`,`https://animetr.co/izle/${y}-dublaj/bolum-${d}`,`https://animetr.co/izle/${y}/bolum-${d}`]:[`https://animetr.co/izle/${y}/bolum-${d}`,`https://animetr.co/izle/${y}-altyazili/bolum-${d}`];for(const m of g)try{const x=`${Fo}?url=${encodeURIComponent(m)}`,T=await fetch(x,{signal:AbortSignal.timeout(3500)}).catch(()=>null);if(!T||!T.ok)continue;const h=await T.text();if(h.includes("Sayfa Bulunamadı")||h.includes("404"))continue;if(u&&!m.includes("dublaj")){const w=h.toLowerCase();if(!w.includes("dublaj")&&!w.includes("türkçe dublaj"))continue}const D=[...h.matchAll(/"embed_url":"([^"]+)","provider":"([^"]+)"/gi)],U=[...h.matchAll(/<iframe[^>]+src="([^"]+)"/gi)].map(w=>w[1]),I=[],P=new Set;for(const w of D){const se=w[1].replace(/\\/g,""),ne=w[2]||"AnimeTR";se&&!P.has(se)&&!se.includes("recaptcha")&&!se.includes("filemoon")&&!se.includes("bysejikuar")&&!se.includes("media.cm")&&!se.includes("vidoza")&&!se.includes("voe")&&!se.includes("cloudvideo")&&(P.add(se),I.push({provider:ne,url:se}))}for(const w of U)if(w&&!P.has(w)&&!w.includes("recaptcha")&&!w.includes("filemoon")&&!w.includes("bysejikuar")&&!w.includes("media.cm")&&!w.includes("vidoza")&&!w.includes("voe")&&!w.includes("cloudvideo")){P.add(w);let se="Player";w.includes("vidmoly")?se="Vidmoly":w.includes("ok.ru")?se="OK.ru":w.includes("sibnet")?se="Sibnet":w.includes("drive.google")&&(se="Google Drive"),I.push({provider:se,url:w})}if(I.length===0)continue;const R=(w,se)=>{const ne=(w+" "+se).toLowerCase();return ne.includes("vidmoly")?1:ne.includes("ok.ru")||ne.includes("odnoklassniki")?2:ne.includes("vidoza")?3:ne.includes("sibnet")?4:ne.includes("voe")?5:ne.includes("cloudvideo")?6:ne.includes("drive.google")?7:8};I.sort((w,se)=>R(w.provider,w.url)-R(se.provider,se.url));const F=new Set,f=[];for(const w of I){const se=w.provider.toLowerCase();F.has(se)||(F.add(se),f.push({id:`antr_${se}_${d}_${u?"dub":"sub"}_${f.length}`,name:`AnimeTR - ${w.provider} (${u?"1080p TR Dublaj":"1080p Altyazılı"})`,badge:u?"🎌 Dublaj":`🎌 ${w.provider}`,category:u?"dubbed":"subtitled",streamUrl:w.url,url:w.url,getUrl:()=>w.url}))}if(f.length>0)return f.slice(0,6)}catch{}}return[]}const Oo="https://dizisol.com/api";async function Vo(i,s={}){const o=typeof window<"u",n=i.startsWith("/")?i:`/${i}`,r=`${Oo}${n}`,d=s.timeout||3500,u=async()=>{const p=await fetch(r,{...s,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Accept:"application/json, text/plain, */*",...s.headers||{}},signal:AbortSignal.timeout(d)});if(p&&p.ok)return p;throw new Error("Direct fetch failed")},l=async()=>{if(!o)throw new Error("No proxy needed");const p=`/api/dzs${n}`,y=await fetch(p,{...s,signal:AbortSignal.timeout(d)});if(y&&y.ok)return y;throw new Error("Proxy fetch failed")};if(o)try{return await Promise.any([l(),u()])}catch{return null}try{return await u()}catch{return null}}const ys=new Map;async function Ms(i,s={}){const o=i.startsWith("/")?i:`/${i}`,n=Date.now(),r=ys.get(o);if(r){if(r.data&&n-r.timestamp<12e4)return r.data;if(r.promise)return r.promise}const d=(async()=>{const u=await Vo(o,s);if(!u)return null;const l=await u.json().catch(()=>null);return l&&ys.set(o,{data:l,timestamp:Date.now()}),l})();return ys.set(o,{promise:d,timestamp:n}),d}async function Ur(i){if(!i||typeof i!="string"||i.trim().length<2)return[];try{const s=await Ms(`/movies/search?q=${encodeURIComponent(i.trim())}`,{timeout:3500});return Array.isArray(s)?s:[]}catch{return[]}}function Pr(i){if(!i||typeof i!="string")return"";const s=typeof window<"u",o=i.startsWith("/api/")?`https://dizisol.com${i}`:i;return s?`/api/hls_proxy?url=${encodeURIComponent(o)}&ref=${encodeURIComponent("https://dizisol.com/")}`:o}function Rt(i){return!i||typeof i!="string"?"":typeof window<"u"&&i.includes("dizisol.com")?`/api/hls_proxy?url=${encodeURIComponent(i)}&ref=${encodeURIComponent("https://dizisol.com/")}`:i}function La(i){return!(!i||typeof i!="string"||!i.startsWith("/api/")&&!i.startsWith("http://")&&!i.startsWith("https://")||i.includes("picturebox.cloud")||i.includes("setfilmizle::")||i.startsWith("setfilmizle:"))}function Ea(i,s=""){let o=10;const n=(i||"").toLowerCase(),r=(s||"").toLowerCase();return r==="vip"?o+=105:r==="cortina"?o+=100:r==="vidmixi"?o+=95:r==="rapidrame"?o+=90:r==="hdfilmdelisi"?o+=85:r==="pal-vds"||r==="dizipal-vds"?o+=80:r==="vidrame"?o+=75:r==="dosyaload"?o+=72:r==="imagestoo"?o+=70:r==="diziyou"?o+=68:r==="fullhd"?o+=65:r==="filmekseni"?o+=60:r==="videoplays"?o+=55:r==="canlidizi"?o+=50:r==="draktar"?o+=45:r==="filmmakinesi"?o+=15:o+=40,n.includes("dizisol.com")&&(o+=10),o}async function Ar({titles:i=[],title:s="",originalTitle:o="",tmdbId:n=null,isDub:r=!0}){try{let d=n?Number(n):null;if(!d){const m=[...new Set([...i,s,o])].filter(x=>x&&x.trim().length>1);for(const x of m){const h=(await Ur(x)).find(D=>D.type==="movie");if(h&&h.tmdbId){d=Number(h.tmdbId);break}}}if(!d)return[];const u=await Ms(`/movies/by-tmdb/${d}`,{timeout:4e3});if(!u)return[];const l=[];u.subtitleTr&&l.push({label:"Türkçe",src:Rt(u.subtitleTr)}),u.subtitleEn&&l.push({label:"İngilizce",src:Rt(u.subtitleEn)});const p=[],y=new Set;if(La(u.m3u8Url)&&(y.add(u.m3u8Url),p.push({url:u.m3u8Url,provider:"VIP",isPrimary:!0,priority:Ea(u.m3u8Url,"VIP")})),Array.isArray(u.sources))for(const m of u.sources)!m||!La(m.m3u8Url)||y.has(m.m3u8Url)||(y.add(m.m3u8Url),p.push({url:m.m3u8Url,provider:(m.provider||"VIP").toUpperCase(),id:m.id,subtitleTr:m.subtitleTr,subtitleEn:m.subtitleEn,isPrimary:!1,priority:Ea(m.m3u8Url,m.provider)}));return p.sort((m,x)=>x.priority-m.priority),p.map((m,x)=>{const T=Pr(m.url),h=[];return m.subtitleTr&&h.push({label:"Türkçe",src:Rt(m.subtitleTr)}),m.subtitleEn&&h.push({label:"İngilizce",src:Rt(m.subtitleEn)}),{id:`dzs_mov_${d}_${m.id||m.provider||x}`,name:x===0?"DS 1080p (HLS)":`DS ${m.provider} 1080p`,displayName:x===0?"DS 1080p (HLS)":`DS ${m.provider} 1080p`,badge:r?"⚡ TR Dublaj":"💬 TR Altyazı",source:"DS",url:T,streamUrl:T,originalEmbedUrl:m.url,quality:"1080p",isHls:!0,isDirectVideo:!0,type:"hls",subtitles:h.length>0?h:l,isDub:r,getUrl:()=>T}})}catch{return[]}}async function Ra({titles:i=[],seriesTitle:s="",originalTitle:o="",season:n=1,episode:r=1,tmdbId:d=null,isDub:u=!0}){try{let l=d?Number(d):null;if(!l){const h=[...new Set([...i,s,o])].filter(D=>D&&D.trim().length>1);for(const D of h){const I=(await Ur(D)).find(P=>P.type==="tv");if(I&&I.tmdbId){l=Number(I.tmdbId);break}}}if(!l)return[];const p=await Ms(`/movies/by-tmdb/${l}/episodes`,{timeout:4500});if(!Array.isArray(p)||p.length===0)return[];const y=p.find(h=>Number(h.season)===Number(n)&&Number(h.episode)===Number(r));if(!y)return[];const g=[];y.subtitleTr&&g.push({label:"Türkçe",src:Rt(y.subtitleTr)}),y.subtitleEn&&g.push({label:"İngilizce",src:Rt(y.subtitleEn)});const m=[],x=new Set;if(La(y.m3u8Url)&&(x.add(y.m3u8Url),m.push({url:y.m3u8Url,provider:"VIP",isPrimary:!0,priority:Ea(y.m3u8Url,"VIP")})),Array.isArray(y.sources))for(const h of y.sources)!h||!La(h.m3u8Url)||x.has(h.m3u8Url)||(x.add(h.m3u8Url),m.push({url:h.m3u8Url,provider:(h.provider||"VIP").toUpperCase(),id:h.id,subtitleTr:h.subtitleTr,subtitleEn:h.subtitleEn,isPrimary:!1,priority:Ea(h.m3u8Url,h.provider)}));return m.sort((h,D)=>D.priority-h.priority),m.map((h,D)=>{const U=Pr(h.url),I=[];return h.subtitleTr&&I.push({label:"Türkçe",src:Rt(h.subtitleTr)}),h.subtitleEn&&I.push({label:"İngilizce",src:Rt(h.subtitleEn)}),{id:`dzs_tv_${l}_s${n}_e${r}_${h.id||h.provider||D}`,name:D===0?`DS 1080p (S${n}B${r})`:`DS ${h.provider} 1080p (S${n}B${r})`,displayName:D===0?`DS 1080p (S${n}B${r})`:`DS ${h.provider} 1080p (S${n}B${r})`,badge:u?"⚡ TR Dublaj":"💬 TR Altyazı",source:"DS",url:U,streamUrl:U,originalEmbedUrl:h.url,quality:"1080p",isHls:!0,isDirectVideo:!0,type:"hls",subtitles:I.length>0?I:g,isDub:u,getUrl:()=>U}})}catch{return[]}}async function qr(i){try{const s=await fetch(`https://dizibal.org/api/stream/embed?code=${encodeURIComponent(i)}&autoplay=1`,{signal:AbortSignal.timeout(6e3)});if(!s.ok)return null;const o=await s.json().catch(()=>null);return o?.success&&o.embedUrl?o.embedUrl:null}catch{return null}}const Yo="https://dizibal.org/api";async function Hi(i,s={}){const o=typeof window<"u",n=i.startsWith("/")?i:`/${i}`,r=i.startsWith("http")?i:`${Yo}${n}`,d=s.timeout||3500,u=async()=>{const p=await fetch(r,{...s,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Accept:"application/json, text/plain, */*",...s.headers||{}},signal:AbortSignal.timeout(d)});if(p&&p.ok)return p;throw new Error("Direct fetch failed")},l=async()=>{if(!o||i.startsWith("http"))throw new Error("No proxy needed");const p=Xe(`/api/dzb${n}`),y=await fetch(p,{...s,signal:AbortSignal.timeout(d)});if(y&&y.ok)return y;throw new Error("Proxy fetch failed")};if(o&&!i.startsWith("http"))try{return await Promise.any([l(),u()])}catch{return null}try{return await u()}catch{return null}}function Nr(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""):""}async function Xo(i){if(!i||typeof i!="string"||i.trim().length<2)return[];try{const s=await Hi(`/series?search=${encodeURIComponent(i.trim())}`,{timeout:6500});if(!s)return[];const o=await s.json().catch(()=>null);return o&&Array.isArray(o.data)?o.data:[]}catch{return[]}}async function Go(i){if(!i||typeof i!="string"||i.trim().length<2)return[];try{const s=await Hi(`/movies?search=${encodeURIComponent(i.trim())}`,{timeout:3500});if(!s)return[];const o=await s.json().catch(()=>null);return o&&Array.isArray(o.data)?o.data:[]}catch{return[]}}async function $a({titles:i=[],seriesTitle:s,originalTitle:o,season:n,episode:r,isDub:d=!1}){const u=[],l=parseInt(n,10)||1,p=parseInt(r,10)||1,y=new Set;Array.isArray(i)&&i.forEach(m=>m&&y.add(m)),s&&y.add(s),o&&y.add(o);let g=null;for(const m of y){const x=Nr(m);if(x)try{const T=await Hi(`/series/${x}`,{timeout:5500});if(T){const h=await T.json().catch(()=>null),D=h?.data?.title||h?.data?.name||h?.data?.name_tr||h?.data?.name_en||h?.data?.slug||"";if(h&&h.success&&h.data&&h.data._id&&Pe(D,[...y])){g=h.data;break}}}catch{}}if(!g)for(const m of y){const x=await Xo(m);if(x.length>0&&(g=x.find(T=>{const h=T.title||T.name||T.name_tr||T.name_en||T.slug||"";return Pe(h,[...y])}),g))break}if(!g||!g._id)return[];try{const m=await Hi(`/series/${g._id}/seasons/${l}`,{timeout:6500});if(!m)return[];const x=await m.json().catch(()=>null);if(!x||!x.success||!x.data||!Array.isArray(x.data.episodes))return[];const T=x.data.episodes.find(U=>parseInt(U.episode_number,10)===p);if(!T||!T.src)return[];const h=T.src,D=await qr(h)||`https://x.ag2m4.cfd/embed-${h}.html?autoplay=1`;D&&u.push({id:`dzb_player_s${l}e${p}`,name:d?"DP DiziBal Player (TR Dublaj)":"DP DiziBal Player (TR Altyazı)",displayName:"DP DiziBal Player",streamUrl:D,url:D,subtitles:[],isHls:!1,isDirectVideo:!1,source:"DP",badge:"🌐 DiziBal Orijinal Player"})}catch{}return u}async function xa({titles:i=[],title:s,originalTitle:o,isDub:n=!1}){const r=[],d=new Set;Array.isArray(i)&&i.forEach(y=>y&&d.add(y)),s&&d.add(s),o&&d.add(o);let u=null;for(const y of d){const g=Nr(y);if(g)try{const m=await Hi(`/movies/${g}`,{timeout:3e3});if(m){const x=await m.json().catch(()=>null),T=x?.data?.title||x?.data?.title_tr||x?.data?.title_en||x?.data?.slug||"";if(x&&x.success&&x.data&&x.data.src&&Pe(T,[...d])){u=x.data;break}}}catch{}}if(!u)for(const y of d){const g=await Go(y);if(g.length>0&&(u=g.find(m=>{const x=m.title||m.title_tr||m.title_en||m.slug||"";return Pe(x,[...d])}),u))break}if(!u||!u.src)return[];const l=u.src,p=await qr(l)||`https://x.ag2m4.cfd/embed-${l}.html?autoplay=1`;return p&&r.push({id:"dzb_player_movie",name:n?"DP DiziBal Player (TR Dublaj)":"DP DiziBal Player (TR Altyazı)",displayName:"DP DiziBal Player",streamUrl:p,url:p,subtitles:[],isHls:!1,isDirectVideo:!1,source:"DP",badge:"🌐 DiziBal Orijinal Player"}),r}const Zo="https://wild-credit-e1ae.cagatayca07.workers.dev";async function zs(i,s={}){const o=typeof window<"u",n=s.headers?.Referer||s.headers?.referer||"",r=n?`&ref=${encodeURIComponent(n)}`:"",d=o?`/api/proxy?url=${encodeURIComponent(i)}${r}`:`http://localhost:4000/proxy?url=${encodeURIComponent(i)}${r}`;try{const u=await fetch(d,{...s,signal:AbortSignal.timeout(s.timeout||3500)}).catch(()=>null);if(u&&u.ok)return u}catch{}try{const u=await fetch(i,{...s,signal:AbortSignal.timeout(s.timeout||3500)}).catch(()=>null);if(u&&u.ok)return u}catch{}try{const u=`${Zo}?url=${encodeURIComponent(i)}${r}`,l=await fetch(u,{...s,signal:AbortSignal.timeout(s.timeout||3500)}).catch(()=>null);if(l&&l.ok)return l}catch{}return null}async function Hr(i){if(!i||typeof i!="string")return null;try{let s=i;s.startsWith("//")&&(s=`https:${s}`),s.startsWith("http")||(s=`https://${s}`);const o=await zs(s,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Referer:"https://vidmoly.net/"},timeout:4e3});if(!o)return null;const n=await o.text();if(!n)return null;const r=n.match(/sources\s*:\s*\[([\s\S]*?)\]/i);let d=null;if(r){const u=r[1].match(/file\s*:\s*["']([^"']+\.m3u8[^"']*)["']/i);u&&(d=u[1])}if(!d){const u=n.match(/https?:\/\/[^"'\s<>]+\.m3u8[^"'\s<>]*/i);u&&(d=u[0])}if(d)return d.startsWith("//")&&(d=`https:${d}`),{url:d,streamUrl:d,isHls:!0,isDirectVideo:!0,type:"hls"}}catch{}return null}async function Jo(i){if(!i||typeof i!="string")return null;try{let s=i;s.startsWith("//")&&(s=`https:${s}`),s.startsWith("http")||(s=`https://${s}`);const o=s.match(/^https?:\/\/([^/]+)/i),r=`https://${o?o[1]:"x.ag2m4.cfd"}`,d=await zs(s,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Referer:"https://dizibal.org/"},timeout:4500});if(!d)return null;const u=await d.text();if(!u)return null;const l=u.match(/fetch\(['"](\/dl\?op=get_stream[^'"]+)['"]\)/i);if(!l)return null;const p=`${r}${l[1]}`,y=await zs(p,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Referer:s,Origin:r,Accept:"*/*"},timeout:4500});if(!y)return null;const g=await y.json().catch(()=>null);if(!g||!g.url)return null;let m=g.url;m.startsWith("//")&&(m=`https:${m}`);const T=typeof window<"u"?`/api/hls_proxy?url=${encodeURIComponent(m)}&ref=${encodeURIComponent(r+"/")}`:m,h=u.match(/["']?subtitle["']?\s*:\s*["']([^"']+)["']/i),D=[];if(h&&h[1]){const U=h[1].split(",");for(const I of U){const P=I.match(/\[(.*?)\](.*)/);P&&D.push({label:P[1],src:P[2]})}}return{url:T,streamUrl:T,rawUrl:m,isHls:!0,isDirectVideo:!0,type:"hls",subtitles:D}}catch{}return null}async function gs(i){if(!i)return null;const s=(i.url||i.streamUrl||(typeof i.getUrl=="function"?i.getUrl():"")||"").toLowerCase();if(s.includes("ag2m4")||s.includes("agcdn")||s.includes("liderfilm")||i.id&&i.id.startsWith("dbl")){const o=i.url||i.streamUrl||(typeof i.getUrl=="function"?i.getUrl():""),n=await Jo(o);if(n&&(n.url||n.streamUrl)){let r=n.url||n.streamUrl;return r.startsWith("http")&&!r.includes("/api/hls_proxy")&&(r=`/api/hls_proxy?url=${encodeURIComponent(r)}&ref=${encodeURIComponent("https://x.ag2m4.cfd/")}`),{...i,isHls:!0,isDirectVideo:!0,originalEmbedUrl:o,streamUrl:r,url:r,subtitles:n.subtitles,getUrl:()=>r}}}return i}const Qo="https://wild-credit-e1ae.cagatayca07.workers.dev",jr="https://www.diziyo.so";async function Tt(i,s={}){const o=typeof window<"u";let n=i;if(n.startsWith("http"))try{const d=new URL(n);n=d.pathname+d.search}catch{}n=n.replace(/^\/api\/dzyo/,""),n.startsWith("/")||(n=`/${n}`);const r=`${jr}${n}`;if(o)try{const d=`/api/dzyo${n}`,u=await fetch(d,{...s,signal:AbortSignal.timeout(s.timeout||4e3)}).catch(()=>null);if(u&&u.ok)return u}catch{}try{const d=await fetch(r,{...s,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",Referer:"https://www.diziyo.so/",...s.headers||{}},signal:AbortSignal.timeout(s.timeout||4e3)}).catch(()=>null);if(d&&d.ok)return d}catch{}if(o)try{const d=`/api/proxy?url=${encodeURIComponent(r)}&ref=${encodeURIComponent("https://www.diziyo.so/")}`,u=await fetch(d,{...s,signal:AbortSignal.timeout(s.timeout||4e3)}).catch(()=>null);if(u&&u.ok)return u}catch{}try{const d=`${Qo}?url=${encodeURIComponent(r)}`,u=await fetch(d,{...s,signal:AbortSignal.timeout(s.timeout||4500)}).catch(()=>null);if(u&&u.ok)return u}catch{}return null}function Fr(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""):""}async function Kr(i){if(!i||typeof i!="string"||i.trim().length<2)return[];try{const s=await Tt(`/arama?q=${encodeURIComponent(i.trim())}`,{timeout:3500});if(!s)return[];const o=await s.text().catch(()=>"");return o?Array.from(new Set(o.match(/href="https:\/\/www\.diziyo\.so\/(?:dizi|film)\/[^"]+"/g)||[])).map(r=>{const d=r.replace('href="',"").replace('"',""),u=d.includes("/dizi/"),l=d.match(/\/(?:dizi|film)\/([^/]+)/);return{url:d,slug:l?l[1]:"",isSeries:u}}):[]}catch{return[]}}async function Wr(i,s){try{const o=await Tt(i,{headers:{Referer:s},timeout:4500});if(!o)return null;const n=await o.text(),r=n.match(/name="_token"\s+value="([^"]+)"/),d=n.match(/action="([^"]+)"/);if(!r||!d)return null;const u=r[1],l=d[1];let p="";typeof o.headers.getSetCookie=="function"?p=o.headers.getSetCookie().map(x=>x.split(";")[0].trim()).join("; "):p=(o.headers.get("set-cookie")||"").split(/,\s*(?=[a-zA-Z0-9_-]+=)/).map(T=>T.split(";")[0].trim()).join("; ");const y=await Tt(l,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded",Referer:i,Origin:jr,"x-dzyo-referer":i,...p?{Cookie:p,"x-dzyo-cookie":p}:{}},body:new URLSearchParams({_token:u}),timeout:5e3});if(!y)return null;let g="";(y.ok||y.status===200)&&(g=await y.text().catch(()=>""));let m=y.headers?.get?.("location");if(!m&&g){const x=g.match(/url='([^']+)'/i)||g.match(/url="([^"]+)"/i);x&&(m=x[1])}if(m){const x=await Tt(m,{headers:{Referer:l,"x-dzyo-referer":l,...p?{Cookie:p,"x-dzyo-cookie":p}:{}},timeout:4500});if(x){const T=await x.text().catch(()=>"");T&&(g=T)}}if(g){const x=g.match(/src="([^"]+vidmoly[^"]+)"/i);if(x){const h=x[1];return h.startsWith("//")?`https:${h}`:h}const T=g.match(/id="provider-frame"[^>]*src="([^"]+)"/i)||g.match(/<iframe[^>]+class="[^"]*player-watch[^"]*"[^>]*src="([^"]+)"/i)||g.match(/<iframe[^>]+src="([^"]+)"/i);if(T){let h=T[1];if(h.startsWith("//")&&(h=`https:${h}`),!h.includes("diziyo.so")&&!h.includes("/player/video/")&&!h.includes("/player/gate/"))return h}}}catch{}return null}async function zr({titles:i=[],seriesTitle:s,originalTitle:o,season:n,episode:r,isDub:d=!1}){const u=[],l=parseInt(n,10)||1,p=parseInt(r,10)||1,y=new Set;Array.isArray(i)&&i.forEach(m=>m&&y.add(m)),s&&y.add(s),o&&y.add(o);let g=null;for(const m of y){const x=Fr(m);if(!x)continue;const T=`https://www.diziyo.so/dizi/${x}/sezon-${l}/bolum-${p}/`;try{const h=await Tt(T,{timeout:5e3});if(h&&h.ok){g=T;break}}catch{}}if(!g)for(const m of y){const T=(await Kr(m)).find(h=>h.isSeries&&Pe(h.slug,[...y]));if(T&&T.slug){const h=`https://www.diziyo.so/dizi/${T.slug}/sezon-${l}/bolum-${p}/`,D=await Tt(h,{timeout:3e3});if(D&&D.ok){g=h;break}}}if(!g)return[];try{const m=await Tt(g,{timeout:6e3});if(!m)return[];const x=await m.text().catch(()=>"");if(!x)return[];if(!Pe(Ua(x),[...y]))return[];const T=[...x.matchAll(/data-player-source="([^"]+)"[^>]*data-player-language-name="([^"]+)"/gi)];if(T.length===0)return[];let h=null;for(const I of T){const P=I[1],R=(I[2]||"").toLowerCase();if(d&&(R.includes("dublaj")||R.includes("turkce")||R.includes("tr"))){h=P;break}if(!d&&(R.includes("altyaz")||R.includes("sub"))){h=P;break}}h||(h=T[0][1]);let D=null,U=null;try{if(U=await Wr(h,g),U&&U.includes("vidmoly")){const I=await Hr(U).catch(()=>null);I&&I.streamUrl&&(D=I.streamUrl)}}catch{}D&&u.push({id:`dzy_vidmoly_s${l}e${p}_${d?"dub":"sub"}`,name:d?"Diziyo 1080p VIP (TR Dublaj)":"Diziyo 1080p VIP (TR Altyazı)",displayName:"Diziyo 1080p VIP",streamUrl:D,url:D,isHls:!0,isDirectVideo:!0,source:"Diziyo",badge:d?"⚡ Diziyo Dublaj":"💬 Diziyo Altyazı",getUrl:()=>D}),U&&!U.includes("diziyo.so")&&!U.includes("/player/video/")&&!U.includes("/player/gate/")&&u.push({id:`dzy_player_s${l}e${p}_${d?"dub":"sub"}`,name:d?"Diziyo VIP (TR Dublaj)":"Diziyo VIP (TR Altyazı)",displayName:"Diziyo VIP",streamUrl:U,url:U,isHls:!1,isDirectVideo:!1,source:"Diziyo",badge:d?"⚡ Diziyo Dublaj":"💬 Diziyo Altyazı",getUrl:()=>U})}catch{}return u}async function Dr({titles:i=[],title:s,originalTitle:o,isDub:n=!1}){const r=[],d=new Set;Array.isArray(i)&&i.forEach(l=>l&&d.add(l)),s&&d.add(s),o&&d.add(o);let u=null;for(const l of d){const p=Fr(l);if(!p)continue;const y=`https://www.diziyo.so/film/${p}/`;try{const g=await Tt(y,{timeout:3e3});if(g&&g.ok){u=y;break}}catch{}}if(!u)for(const l of d){const y=(await Kr(l)).find(g=>!g.isSeries&&Pe(g.slug,[...d]));if(y&&y.url){u=y.url;break}}if(!u)return[];try{const l=await Tt(u,{timeout:4e3});if(!l)return[];const p=await l.text().catch(()=>"");if(!p)return[];if(!Pe(Ua(p),[...d]))return[];const y=[...p.matchAll(/data-player-source="([^"]+)"[^>]*data-player-language-name="([^"]+)"/gi)];if(y.length===0)return[];let g=null;for(const T of y){const h=T[1],D=(T[2]||"").toLowerCase();if(n&&(D.includes("dublaj")||D.includes("tr"))){g=h;break}if(!n&&(D.includes("altyaz")||D.includes("sub"))){g=h;break}}g||(g=y[0][1]);let m=null,x=null;try{if(x=await Wr(g,u),x&&x.includes("vidmoly")){const T=await Hr(x).catch(()=>null);T&&T.streamUrl&&(m=T.streamUrl)}}catch{}m&&r.push({id:`dzy_vidmoly_movie_${n?"dub":"sub"}`,name:n?"Diziyo 1080p VIP (TR Dublaj)":"Diziyo 1080p VIP (TR Altyazı)",displayName:"Diziyo 1080p VIP",streamUrl:m,url:m,isHls:!0,isDirectVideo:!0,source:"Diziyo",badge:n?"⚡ Diziyo Dublaj":"💬 Diziyo Altyazı",getUrl:()=>m}),x&&!x.includes("diziyo.so")&&!x.includes("/player/video/")&&!x.includes("/player/gate/")&&r.push({id:`dzy_player_movie_${n?"dub":"sub"}`,name:n?"Diziyo VIP (TR Dublaj)":"Diziyo VIP (TR Altyazı)",displayName:"Diziyo VIP",streamUrl:x,url:x,isHls:!1,isDirectVideo:!1,source:"Diziyo",badge:n?"⚡ Diziyo Dublaj":"💬 Diziyo Altyazı",getUrl:()=>x})}catch{}return r}const el="https://wild-credit-e1ae.cagatayca07.workers.dev",tl="https://www.diziyou.one";function il(i){return i?i.toString().toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9\s-]/g,"").replace(/[\s_]+/g,"-").replace(/^-+|-+$/g,""):""}async function vs(i,s={}){const o=typeof window<"u";let n=i;if(n.startsWith("http"))try{const d=new URL(n);n=d.pathname+d.search}catch{}n=n.replace(/^\/api\/dzy/,""),n.startsWith("/")||(n=`/${n}`);const r=`${tl}${n}`;if(o)try{const d=Xe(`/api/dzy${n}`),u=await fetch(d,{...s,signal:AbortSignal.timeout(s.timeout||4e3)}).catch(()=>null);if(u&&u.ok)return u}catch{}try{const d=await fetch(r,{...s,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Referer:"https://www.diziyou.one/",...s.headers||{}},signal:AbortSignal.timeout(s.timeout||4e3)}).catch(()=>null);if(d&&d.ok)return d}catch{}if(o)try{const d=Xe(`/api/proxy?url=${encodeURIComponent(r)}&ref=${encodeURIComponent("https://www.diziyou.one/")}`),u=await fetch(d,{...s,signal:AbortSignal.timeout(s.timeout||4e3)}).catch(()=>null);if(u&&u.ok)return u}catch{}try{const d=`${el}?url=${encodeURIComponent(r)}`,u=await fetch(d,{...s,signal:AbortSignal.timeout(s.timeout||4500)}).catch(()=>null);if(u&&u.ok)return u}catch{}return null}async function al({titles:i=[],title:s="",seriesTitle:o="",originalTitle:n="",season:r=1,episode:d=1,isDub:u=!1}){const l=parseInt(r,10)||1,p=parseInt(d,10)||1,y=Array.from(new Set([o,s,n,...i||[]])).filter(Boolean),g=new Set;for(const h of y){const D=il(h);D&&(g.add(`/${D}-${l}-sezon-${p}-bolum/`),g.add(`/${D}2-${l}-sezon-${p}-bolum/`),g.add(`/${D}-${l}-sezon-${p}-bolum-izle/`),g.add(`/dizi/${D}-${l}-sezon-${p}-bolum/`))}let x=(await Promise.all([...g].map(async h=>{try{const D=await vs(h,{timeout:4500});if(!D)return null;const U=await D.text();return!U||U.length<500?null:{epPath:h,html:U}}catch{return null}}))).filter(Boolean);if(x.length===0)for(const h of y.slice(0,2))try{const D=await vs(`/?s=${encodeURIComponent(h)}`,{timeout:3500});if(!D)continue;const U=await D.text(),I=new RegExp(`href="([^"]*(?:${l}-sezon-${p}-bolum|bolum)[^"]*)"`,"gi"),P=[...U.matchAll(I)].map(R=>R[1]);for(const R of P.slice(0,3)){const F=await vs(R,{timeout:4e3});if(F){const f=await F.text();if(f&&f.length>500){x.push({epPath:R,html:f});break}}}if(x.length>0)break}catch{}const T=[];for(const h of x){const{html:D}=h;if(!Pe(Ua(D),y))continue;const U=D.match(/<iframe[^>]+src=["']([^"']*(?:player|embed)[^"']*)["']/i),I=D.match(/\/player\/(\d+)\.html/i);if(I){const P=I[1],R=`https://storage.diziyou.one/episodes/${P}/play.m3u8`;T.push({id:`dyu_m3u8_${P}`,name:"Diziyou 1080p (TR Altyazı)",displayName:"Diziyou 1080p",badge:"💬 Diziyou Altyazı",url:R,streamUrl:R,isHls:!0,isDirectVideo:!0,source:"Diziyou",getUrl:()=>R});const F=`https://www.diziyou.one/player/${P}.html`;T.push({id:`dyu_frame_${P}`,name:"Diziyou VIP (TR Altyazı)",displayName:"Diziyou VIP",badge:"💬 Diziyou Web",url:F,streamUrl:F,isHls:!1,isDirectVideo:!1,source:"Diziyou",getUrl:()=>F});break}else if(U){const P=U[1].startsWith("//")?`https:${U[1]}`:U[1];T.push({id:`dyu_frame_${Math.random().toString(36).substring(2,6)}`,name:"Diziyou VIP (TR Altyazı)",displayName:"Diziyou VIP",badge:"💬 Diziyou Web",url:P,streamUrl:P,isHls:!1,isDirectVideo:!1,source:"Diziyou",getUrl:()=>P});break}}return T}const Or="https://www.hdfilmizle.best";function Pi(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9]/g,""):""}async function Ds(i,s={}){const o=typeof window<"u",n=s.headers?.Referer||s.headers?.referer||"",r=n?`&ref=${encodeURIComponent(n)}`:"",d=o?`/api/proxy?url=${encodeURIComponent(i)}${r}`:`http://localhost:4000/proxy?url=${encodeURIComponent(i)}${r}`,u={...s.headers||{}};n&&(u["X-Proxy-Referer"]=n);try{const l=await fetch(d,{...s,headers:u,signal:AbortSignal.timeout(s.timeout||4500)}).catch(()=>null);if(l&&l.ok)return l}catch{}try{const l=await fetch(i,{...s,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Accept:"application/json, text/html, */*",...s.headers||{}},signal:AbortSignal.timeout(s.timeout||4500)}).catch(()=>null);if(l&&l.ok)return l}catch{}return null}async function sl(i,s=!1){if(!i||typeof i!="string"||i.trim().length<2)return[];try{const n=`${Or}/wp-json/wp/v2/${s?"dizi":"film"}?search=${encodeURIComponent(i.trim())}`,r=await Ds(n);if(!r)return[];const d=await r.json().catch(()=>[]);return Array.isArray(d)?d.map(u=>({id:u.id,title:u.title?.rendered||"",link:u.link||"",slug:u.slug||""})):[]}catch{return[]}}async function ws({titles:i=[],title:s="",originalTitle:o="",isDub:n=!0}){const r=[...new Set([...i,s,o])].filter(d=>d&&typeof d=="string"&&d.trim().length>1);if(r.length===0)return[];for(const d of r){const u=await sl(d,!1);if(u.length===0)continue;const l=Pi(d),p=u.find(y=>{const g=Pi(y.title),m=Pi(y.slug);return g===l||m===l})||u.find(y=>{const g=Pi(y.title),m=Pi(y.slug);return g.includes(l)||m.includes(l)});if(p)try{const y=await Ds(p.link);if(!y)continue;const m=(await y.text()).match(/_hdfNonce_\s*=\s*["']([^"']+)["']/i),x=m?m[1]:"",T=n?"tr":"en",h=`${Or}/ajax/videosrc/?id=${p.id}&lang=${T}&mr=0`,D=await Ds(h,{headers:{Referer:p.link,"X-HDF-Nonce":x,"X-Requested-With":"XMLHttpRequest"}});if(!D)continue;const U=await D.json().catch(()=>null);if(!U||!U.src)continue;const I=U.src,P=typeof window<"u",R=P?`/api/hls_proxy?url=${encodeURIComponent(I)}&ref=${encodeURIComponent(p.link)}`:I,F=[];if(Array.isArray(U.tracks)){for(const f of U.tracks)if(f.src&&f.label){const w=P?`/api/hls_proxy?url=${encodeURIComponent(f.src)}&ref=${encodeURIComponent(p.link)}`:f.src;F.push({label:f.label,src:w,srclang:f.srclang||"tr"})}}return[{id:`hdfb_mov_${p.id}_${n?"dub":"sub"}`,name:n?"HDF Dublaj 1080p":"HDF Altyazı 1080p",displayName:n?"HDF Dublaj 1080p":"HDF Altyazı 1080p",badge:n?"⚡ TR Dublaj":"💬 TR Altyazı",source:"HDFilmizle",url:R,streamUrl:R,quality:"1080p",isHls:!0,isDirectVideo:!0,type:"hls",subtitles:F,isDub:n,getUrl:()=>R}]}catch{}}return[]}const nl="3508611138826751fdf77beaa6f93eb93fd27e6a5acb910e7aad22665513dd6e",rl="666482389dc76bfa57068407418f7dac9f6c14b6868856b169165b9fac7d812e",qi="4F5A9C3D9A86FA54EACEDDD635185/c3c5bd17-e37b-4b94-a944-8a3688a30452",ol="aLhsnd71BqsMC_HZoT8MR_TrfZS1_WcAzYT5nROaUKI",ll="MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDq5iorf3BOWNqObZFRyco/sa7GrDO5r094yhO1FsWRvwoTRneD1ryv+yVLwJrr0IOmjhD2hgyErvs6XRhAmNa18fcMlHJqHlghHA0dt2FnkFlqlZ029/w1inZ8+g5XFjffNp8Xb5T44PrsowlI5Mjfe0JpkHCN20tLkmGdMUes9yQNbKwpUXvBPq/bLYn8IJNoR/kP/4mis7mMeRzWgIupc9AlFx6HH7IZ6NfYmyqDdo7xdSg+WNl/rcuYcPccuN6dIhqWeceSOFiChaGHJMtuEzbHHefRqbK529eNHVTpUmRtfaZu2a+DRXkoz2TU1KCrnSDuNztvlKjiztiJZMdlAgMBAAECggEACCjTmSw1lfsfKGhk7l7gkCLXa95Kc65Dx/HZCmbOmRf2PSIq/6DjcAd8zatUllFpaU0xCKcyYx+C6Y2XTJMijjJn/v9fFBGWxRuo1vnqP8MzX/Dvg5vMnn1/TSsQeXTznuTSVOmS1qxV+wdUyLvtwFmTPoB+cGcIMAlXK7MtBrSD9kCRcpJZgFNUILhn6ISm9NpaqU+5xBBuJRsXaMDvSUTHi1IKK2ZUneetFAgg6BVE5StmORBjMgXfNRIsD+oOHUvtsEczcHnAP2hW19I0lXfwnLhaAicKIECCDpn6cwfBtQWnSDSENCLMemM2O8KYvAizBW4ET3BZBqSDrZEzRwKBgQD/9o7qbE2LEJ19Mkg+4PTqMJ06bFWKUvUB3JuS4Iu/wy9u6tAU7uQySo9vSDDclG8TaDjkz6c2eTmDy7LdFESwLgiHV6cmpm0sieoTMaz1pVkpykifQo1fv2Q60t/co6oEyUWfmdk3iaK6j3MFhjqRpkmZcUYvBYyuRUv8ewKtcwKBgQDq7tRYL2c6cIznwqTJdLuap3eFRP21ymjV/TTp2DrZtVevw9rNYflDK88mIxZdbbAqPT10zbRc3UnqeE2+76UKBAodUJpSPXg2WvA0hZe57q1VnU7gQhMgvDWRPrTG7qbij+FnRtPHWZ1HGLFfl2DSDnFEVsJo2xXQjw5vMTOBxwKBgQDlbKQQ7t5aRZxD+WvUIGKl/skO8seBYnYFIy226tmYGmVLr+Cuwql7gmUqQ7S4Ibul04cbYBzqsKGixlQd4OroV3qBhUlnVUkJ4NwUNDRpQbm3wX5ycX6yUaSPLTBGXdQo0hc7xPRz2UQooCdizjt1DW1uwZ88ymacVbSUK9XsjQKBgGTNhR8xd8GDeXIX+kzWYYjCQm5UY+gUqVboBkQwG1A+lxk7mC5301QXABMFCxubbPMyw6PSf4k5CfYpGHLMsKvTf+OEKjMPXP01l8txZuDIoGcT0Dw5Hav2FaX0meyhicm8oqKFqWjn8qwG1FSHx2tZ9w+zikcjegC64R6kpc0RAoGAO4/tqaXM5CUUWtHanK/1j6KYbFqsKL13FeqIr8TprF4LXpzrzFAPMCmWL6XFq8JZqZj/KNjH9vvt9f7/9QMvI4nZ+0vXihRqdX7LO+XliGRhuXjHp3RlUU4s8eJt9Af7PCFWFX0gwfM8SnkVUTkE3tOQHgk7hM3PUOPH0yZ+gQ8=",cl="MIIDDDCCAfSgAwIBAgIJYFwVX3W1KCXxMA0GCSqGSIb3DQEBCwUAMBgxFjAUBgNVBAMMDWF0dGVzdF9yc2FfdjEwHhcNMjYwOTA4MTUwMjMyWhcNMjcwOTA4MTUwMjMyWjAYMRYwFAYDVQQDDA1hdHRlc3RfcnNhX3YxMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6uYqK39wTljajm2RUcnKP7Guxqwzua9PeMoTtRbFkb8KE0Z3g9a8r_slS8Ca69CDpo4Q9oYMhK77Ol0YQJjWtfH3DJRyah5YIRwNHbdhZ5BZapWdNvf8NYp2fPoOVxY33zafF2-U-OD67KMJSOTI33tCaZBwjdtLS5JhnTFHrPckDWysKVF7wT6v2y2J_CCTaEf5D_-JorO5jHkc1oCLqXPQJRcehx-yGejX2Jsqg3aO8XUoPljZf63LmHD3HLjenSIalnnHkjhYgoWhhyTLbhM2xx3n0amyudvXjR1U6VJkbX2mbtmvg0V5KM9k1NSgq50g7jc7b5So4s7YiWTHZQIDAQABo1kwVzAMBgNVHRMBAf8EAjAAMA4GA1UdDwEB_wQEAwIFoDAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwGAYDVR0RBBEwD4INYXR0ZXN0X3JzYV92MTANBgkqhkiG9w0BAQsFAAOCAQEAREcHgi7mZGgOpu1jBzN89IJIdMSRjYI5AYwhePByZy7U4SOeqq5WTXPsOZdUjGyib1CJzvs44ro8_L9hLfeJCzNTRk9yyAt_EJ6QHAqdyMIBwNSSb3wDg6N7T4x4MJrgoHJ7uRf2iGEdMfazb2aZFyHQjyt4paUCrix5jt7FXY_02pyEQWPLYQb8U6nf8strd4nNdrm9EPAEF7zY7ZXD5L8egXvTkdmvsBRU5OQLftw1JaPkLu85zMQ2hZtscmCQ2ImxxwBlUqS7V_QmaMFHkdJrWQdXF7vU2Ws0qv3qBU7-FJgqGUSuDMFw7sMeeWuVKvg7WjSxolwPZrqIo6ZSUA";function dl(i){let s="";for(let o=0;o<i.length;o++)s+=String.fromCharCode(i[o]);return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"")}function ul(i){let s=i.replace(/-/g,"+").replace(/_/g,"/");for(;s.length%4;)s+="=";const o=atob(s),n=new Uint8Array(o.length);for(let r=0;r<o.length;r++)n[r]=o.charCodeAt(r);return n}function pl(i){const s=new Uint8Array(i.length/2);for(let o=0;o<s.length;o++)s[o]=parseInt(i.substr(o*2,2),16);return s}function Vr(i){return Array.from(i).map(s=>s.toString(16).padStart(2,"0")).join("")}async function ml(i){const s=new TextEncoder().encode(i),o=await crypto.subtle.digest("SHA-256",s);return Vr(new Uint8Array(o))}async function fl(i,s){const o=new TextEncoder,n=await crypto.subtle.importKey("raw",o.encode(i),{name:"HMAC",hash:"SHA-256"},!1,["sign"]),r=await crypto.subtle.sign("HMAC",n,o.encode(s));return Vr(new Uint8Array(r))}async function Ts(i,s,o=""){const n=Math.floor(Date.now()/1e3).toString(),r=typeof crypto.randomUUID=="function"?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,p=>{const y=Math.random()*16|0;return(p==="x"?y:y&3|8).toString(16)}),d=await ml(o),u=`${i}
${s}
${n}
${r}
${d}`,l=await fl(nl,u);return{"user-agent":"okhttp/4.12.0","X-Timestamp":n,"X-Nonce":r,"X-Signature":l,"X-App-Version":"110","X-Client-Id":"rectv-android"}}let Aa=null;async function bl(){if(Aa)return Aa;const i=atob(ll),s=new Uint8Array(i.length);for(let o=0;o<i.length;o++)s[o]=i.charCodeAt(o);return Aa=await crypto.subtle.importKey("pkcs8",s,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},!1,["sign"]),Aa}let fi=null,za=0;const hl=typeof window>"u";function Cs(i){return hl?`https://a.prectv70.lol/api${i}`:`/api/rtv${i}`}let Tr=0;async function yl(){const i=Math.floor(Date.now()/1e3);if(fi&&za>i+120)return fi;if(typeof localStorage<"u"){const s=localStorage.getItem("rectv_jwt_token"),o=parseInt(localStorage.getItem("rectv_jwt_exp")||"0",10);if(s&&o>i+120)return fi=s,za=o,s}if(Date.now()-Tr<3e5)return null;try{const o={...await Ts("GET","/api/attest/nonce",""),"x-rtv-path":"/attest/nonce"},n=await fetch(Cs("/attest/nonce"),{method:"GET",headers:o});if(!n.ok)throw new Error(`Nonce request failed with status ${n.status}`);const d=(await n.json()).nonce;if(!d)throw new Error("Empty nonce returned");const u=ul(d),l=await bl(),p=await crypto.subtle.sign("RSASSA-PKCS1-v1_5",l,u),y=dl(new Uint8Array(p)),g="/api/attest/verify",m=JSON.stringify({certChain:[cl],nonce:d,pkg:"com.rectv.shot",proof:y,sig:ol}),x={...await Ts("POST",g,m),"x-rtv-path":"/attest/verify","Content-Type":"application/json"},T=await fetch(Cs("/attest/verify"),{method:"POST",headers:x,body:m});if(!T.ok)throw new Error(`Verify attestation failed with status ${T.status}`);const h=await T.json();if(!h.jwt)throw new Error("Verify did not return JWT");if(fi=h.jwt,za=h.exp||i+7200,typeof localStorage<"u")try{localStorage.setItem("rectv_jwt_token",fi),localStorage.setItem("rectv_jwt_exp",za.toString())}catch{}return fi}catch{return Tr=Date.now(),null}}let Da=null;async function gl(){if(Da)return Da;const i=pl(rl);return Da=await crypto.subtle.importKey("raw",i,{name:"AES-GCM"},!1,["decrypt"]),Da}async function Cr(i){if(!i)return"";if(i.startsWith("http://")||i.startsWith("https://"))return i;try{const s=atob(i),o=new Uint8Array(s.length);for(let p=0;p<s.length;p++)o[p]=s.charCodeAt(p);const n=o.slice(0,12),r=o.slice(12),d=await gl(),u=await crypto.subtle.decrypt({name:"AES-GCM",iv:n,tagLength:128},d,r);return new TextDecoder("utf-8").decode(u)}catch{return""}}async function Ni(i,s="GET",o=""){let n=null;try{n=await yl()}catch{}const r=`/api${i}`,u={...await Ts(s,r,o),"x-rtv-path":i,...n?{Authorization:`Bearer ${n}`}:{},...o?{"Content-Type":"application/json"}:{}};try{const l=await fetch(Cs(i),{method:s,headers:u,signal:AbortSignal.timeout(6e3),...o?{body:o}:{}});if(l.ok)return await l.json()}catch{}return null}async function vl({type:i="movie",title:s="",originalTitle:o="",season:n=1,episode:r=1,year:d=null}){const u=(s||o||"").trim();if(!u)return[];const l=parseInt(n,10)||1,p=parseInt(r,10)||1;try{let y=await Ni(`/search/${encodeURIComponent(u)}/${qi}/`);if((!y||!Array.isArray(y.posters)||y.posters.length===0)&&o&&o.toLowerCase()!==u.toLowerCase()&&(y=await Ni(`/search/${encodeURIComponent(o.trim())}/${qi}/`)),!y||!Array.isArray(y.posters)||y.posters.length===0)return[];const g=[u,o].filter(Boolean),m=i==="movie";let x=null;const T=D=>{if(!D)return!1;if(Pe(D,g))return!0;const U=D.split(/\s*[-/:]\s*/).filter(Boolean);for(const I of U)if(Pe(I,g))return!0;return!1};for(const D of y.posters)if((m?D.type==="movie":D.type==="serie")&&T(D.title||D.name||"")){x=D;break}if(!x)return[];const h=[];if(m){if(Array.isArray(x.sources))for(const D of x.sources){if(!D.enc_url&&!D.url)continue;const U=D.enc_url?await Cr(D.enc_url):D.url;if(!U||!U.startsWith("http"))continue;const I=`/api/hls_proxy?url=${encodeURIComponent(U)}&ref=https://a.prectv70.lol/`,R=(D.title||"").toLowerCase().includes("dublaj")||(x.label||"").toLowerCase().includes("dublaj")?"🇹🇷 TVR VIP (TR Dublaj)":"⚡ TVR VIP (TR Altyazı)";h.push({id:`tvr_movie_${x.id}_${D.id}`,name:R,displayName:R,badge:"⚡ TVR VIP",source:"TVR VIP",url:I,streamUrl:I,rawStreamUrl:U,quality:"1080p HD",isHls:!0,isDirectVideo:!0,priority:0,getUrl:()=>I})}}else{const D=await Ni(`/season/by/serie/${x.id}/${qi}/`);if(Array.isArray(D))for(const U of D){const I=(U.title||U.name||"").toLowerCase(),P=I.match(/(\d+)/)||[];if((P[1]?parseInt(P[1],10):parseInt(U.number||U.season_number||U.num||"0",10)||1)!==l)continue;const F=I.includes("dublaj")||(U.label||"").toLowerCase().includes("dublaj");let f=Array.isArray(U.episodes)?U.episodes:null;if(!f||f.length===0){const w=await Ni(`/episode/by/season/${U.id}/${qi}/`);Array.isArray(w)?f=w:w&&Array.isArray(w.episodes)&&(f=w.episodes)}if(!(!Array.isArray(f)||f.length===0))for(const w of f){const ne=(w.title||w.name||"").toLowerCase().match(/(\d+)/)||[];if((ne[1]?parseInt(ne[1],10):parseInt(w.number||w.episode_number||w.num||"0",10)||1)!==p)continue;let N=Array.isArray(w.sources)?w.sources:Array.isArray(w.videos)?w.videos:Array.isArray(w.streams)?w.streams:[];if(N.length===0&&w.id){const te=await Ni(`/source/by/episode/${w.id}/${qi}/`);Array.isArray(te)?N=te:te&&Array.isArray(te.sources)&&(N=te.sources)}for(const te of N){const ve=te.enc_url||te.encUrl||te.encrypted_url,Q=te.url||te.stream_url||te.video||te.link||te.source;if(!ve&&!Q)continue;const be=ve?await Cr(ve):Q;if(!be||!be.startsWith("http"))continue;const et=`/api/hls_proxy?url=${encodeURIComponent(be)}&ref=https://a.prectv70.lol/`,A=F||(te.title||te.name||"").toLowerCase().includes("dublaj")?`🇹🇷 TVR S${l}E${p} (TR Dublaj)`:`⚡ TVR S${l}E${p} (TR Altyazı)`;h.push({id:`tvr_ep_${x.id}_${w.id||w.number}_${te.id||be.slice(-8)}`,name:A,displayName:A,badge:"⚡ TVR VIP",source:"TVR VIP",url:et,streamUrl:et,rawStreamUrl:be,quality:"1080p HD",isHls:!0,isDirectVideo:!0,priority:0,getUrl:()=>et})}}}}return h}catch{return[]}}const wl="https://wild-credit-e1ae.cagatayca07.workers.dev";function Is(i){if(!i)return"";try{const s=i.replace(/\\/g,"").replace(/[^A-Za-z0-9+/=]/g,"");if(typeof Buffer<"u")return Buffer.from(s,"base64").toString("utf-8");if(typeof atob<"u"){const o=atob(s);try{const n=new Uint8Array(o.length);for(let r=0;r<o.length;r++)n[r]=o.charCodeAt(r);return new TextDecoder("utf-8").decode(n)}catch{return o}}return""}catch{return""}}const hi=Is("Y2l6Z2ltYXgub25saW5l"),yt=`https://${hi}`,Bs="/api/kvip",kl="/api/sibnet";function Ta(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^\w\s-]/g," ").replace(/\s+/g," ").trim():""}async function ji(i,s={}){const o=typeof window<"u";if(o&&i.includes(hi)){const n=new URL(i),r=`${Bs}${n.pathname}${n.search}`;try{const d=await fetch(r,{...s,signal:AbortSignal.timeout(s.timeout||8e3)}).catch(()=>null);if(d&&d.ok)return d}catch{}}if(o&&i.includes("sibnet.ru")){const n=new URL(i),r=`${kl}${n.pathname}${n.search}`;try{const d=await fetch(r,{...s,signal:AbortSignal.timeout(s.timeout||8e3)}).catch(()=>null);if(d&&d.ok)return d}catch{}}if(o){const n=`/api/proxy?url=${encodeURIComponent(i)}`;try{const r=await fetch(n,{...s,signal:AbortSignal.timeout(s.timeout||8e3)}).catch(()=>null);if(r&&r.ok)return r}catch{}}try{const n=await fetch(i,{...s,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",...i.includes(hi)?{Referer:`${yt}/`}:{},...i.includes("sibnet.ru")?{Referer:"https://video.sibnet.ru/"}:{},...s.headers||{}},signal:AbortSignal.timeout(s.timeout||8e3)}).catch(()=>null);if(n&&n.ok)return n}catch{}try{const n=`${wl}?url=${encodeURIComponent(i)}`,r=await fetch(n,{...s,signal:AbortSignal.timeout(s.timeout||8e3)}).catch(()=>null);if(r&&r.ok)return r}catch{}return null}async function Yr(i){const s=new Set,o=[];for(const n of i)if(!(!n||n.length<2))try{const r=`${yt}/api/search/suggest/?q=${encodeURIComponent(n.trim())}`,d=await ji(r,{headers:{Accept:"application/json"},timeout:6e3});if(!d)continue;const u=await d.json().catch(()=>null);if(!u||!Array.isArray(u.animes))continue;for(const l of u.animes){if(!l||!l.url||s.has(l.id||l.url))continue;const p=l.title||l.name||l.anime_name||"",y=(l.url||"").replace(/^\/diziler\//,"").replace(/^\/filmler\//,"").replace(/^\/film\//,"").replace(/-izle\/?$/,"").replace(/-/g," ");[p,y].filter(Boolean).some(x=>Pe(x,i,.82)||i.some(T=>{const h=Ta(T),D=Ta(x);return!h||!D?!1:D===h}))&&(s.add(l.id||l.url),o.push({...l,cleanTitle:p||y}))}if(o.length===0){const l=await ji(`${yt}/ara/?q=${encodeURIComponent(n.trim())}`,{timeout:6e3});if(l&&l.ok){const y=[...(await l.text()).matchAll(/<a\s+[^>]*href=["'](\/(?:diziler|filmler|film)\/[^"']+)["'][^>]*data-alt-title=["']([^"']*)["']/gi)];for(const g of y){const m=g[1],x=g[2]||"";s.has(m)||!(Pe(x,i,.82)||i.some(h=>Ta(h)===Ta(x)))||(s.add(m),o.push({name:x,url:m,cleanTitle:x}))}}}if(o.length>=4)break}catch{}return o}function Sl(i,s,o){const n=Number(s),r=Number(o),d=[new RegExp(`href=["']?([^"'>]*?${n}-sezon-${r}-bolum(?:-izle)?\\/?)["'>]`,"i"),new RegExp(`href=["']?([^"'>]*?sezon-${n}[^"'>]*?bolum-${r}(?:-izle)?\\/?)["'>]`,"i"),new RegExp(`href=["']?([^"'>]*?s0?${n}e0?${r}(?:-izle)?\\/?)["'>]`,"i")];n===1&&d.push(new RegExp(`href=["']?([^"'>]*?${r}-bolum(?:-izle)?\\/?)["'>]`,"i"));for(const l of d){const p=i.match(l);if(p&&p[1])return p[1]}const u=[...i.matchAll(/href=["']?([^"'>]*?bolum-izle\/?)["'>]/gi)];for(const l of u){const p=l[1],y=p.match(/(\d+)-sezon/i),g=p.match(/(\d+)-bolum/i),m=y?Number(y[1]):1,x=g?Number(g[1]):null;if(m===n&&x===r)return p}return null}function Xr(i,s){let o=[];const n=i.match(/serversByLang\s*=\s*JSON\.parse\(atob\(["']([^"']+)["']\)\)/);if(n)try{const r=JSON.parse(Is(n[1]));r&&(s?o=[...r.dub||[],...r.any||[]]:o=[...r.sub||[],...r.any||[]])}catch{}if(o.length===0){const r=i.match(/servers\s*=\s*JSON\.parse\(atob\(["']([^"']+)["']\)\)/);if(r)try{const d=JSON.parse(Is(r[1]));Array.isArray(d)&&(o=d.filter(u=>{const l=u.label||u.type||"VIP",p=(u.lang||"").toLowerCase(),y=p==="dub"||l.toLowerCase().includes("dublaj"),g=p==="sub"||l.toLowerCase().includes("altyaz");return s?y||!y&&!g:g||!y&&!g}))}catch{}}return o}async function Gr(i,s,o){const n=[],r=s?"TR Dublaj":"Altyazılı",d=s?"dubbed":"subtitled",u=i.label||i.type||"VIP";if(i.type==="sibnet"&&i.videoId){const l=`https://video.sibnet.ru/shell.php?videoid=${encodeURIComponent(i.videoId)}`;return o.has(l)||(o.add(l),n.push({id:`kvip_sib_embed_${i.videoId}_${s?"dub":"sub"}`,name:`Kids VIP - 1080p (${r})`,displayName:`Kids VIP (${r})`,badge:"⚡ Kids VIP",category:d,streamUrl:l,url:l,type:"embed",quality:"1080p",getUrl:()=>l})),n}if(i.src){const l=i.src.startsWith("http")?i.src:`${yt}${i.src}`;if(!(l.includes("cizgimax.online")||l.includes(hi)||l.includes("/oynat/"))){const y=typeof window<"u"&&l.includes(hi)?l.replace(yt,Bs):l;o.has(y)||(o.add(y),n.push({id:`kvip_embed_${i.embedId||Math.random()}_${s?"dub":"sub"}`,name:`Kids VIP - ${u} (${r})`,displayName:`Kids VIP (${r})`,badge:"⚡ Kids VIP",category:d,streamUrl:y,url:y,type:"embed",getUrl:()=>y}))}}if(i.type==="youtube"&&i.ytId){const l=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(i.ytId)}?autoplay=1&rel=0&playsinline=1`;o.has(l)||(o.add(l),n.push({id:`kvip_youtube_${i.ytId}_${s?"dub":"sub"}`,name:`Kids VIP - HD (${r})`,displayName:`Kids VIP (${r})`,badge:"⚡ Kids VIP",category:d,streamUrl:l,url:l,type:"embed",getUrl:()=>l}))}if(i.streamUrl&&!o.has(i.streamUrl)){o.add(i.streamUrl);const l=i.streamUrl.startsWith("http")?i.streamUrl:`${yt}${i.streamUrl}`,p=typeof window<"u"&&l.includes(hi)?l.replace(yt,Bs):l,y=p.includes(".m3u8")||p.includes("hls");n.push({id:`kvip_stream_${i.embedId||Math.random()}_${s?"dub":"sub"}`,name:`Kids VIP - ${u} (${r})`,displayName:`Kids VIP (${r})`,badge:"⚡ Kids VIP",category:d,streamUrl:p,url:p,isDirectVideo:!y,type:y?"hls":"mp4",getUrl:()=>p})}return n}async function ks({titles:i=[],seriesTitle:s="",title:o="",originalTitle:n="",season:r=1,episode:d=1,isDub:u=!0}){const l=[...new Set([s,o,n,...i])].filter(m=>m&&typeof m=="string"&&m.trim().length>1);if(l.length===0)return[];const p=await Yr(l);if(p.length===0)return[];const y=[],g=new Set;for(const m of p.slice(0,3))try{const x=m.url.startsWith("http")?m.url:`${yt}${m.url}`,T=await ji(x,{timeout:8e3});if(!T)continue;const h=await T.text(),D=Sl(h,r,d);if(!D)continue;const U=D.startsWith("http")?D:`${yt}${D}`,I=await ji(U,{timeout:8e3});if(!I)continue;const P=await I.text(),R=Xr(P,u);if(!Array.isArray(R)||R.length===0)continue;for(const F of R){const f=await Gr(F,u,g);y.push(...f)}if(y.length>0)break}catch{}return y}async function Ca({titles:i=[],title:s="",originalTitle:o="",isDub:n=!0}){const r=[...new Set([s,o,...i])].filter(p=>p&&typeof p=="string"&&p.trim().length>1);if(r.length===0)return[];const d=await Yr(r);if(d.length===0)return[];const u=[],l=new Set;for(const p of d.slice(0,3))try{const y=p.url.startsWith("http")?p.url:`${yt}${p.url}`,g=await ji(y,{timeout:8e3});if(!g)continue;const m=await g.text(),x=Xr(m,n);if(!Array.isArray(x)||x.length===0)continue;for(const T of x){const h=await Gr(T,n,l);u.push(...h)}if(u.length>0)break}catch{}return u}function $l({type:i="movie",tmdbId:s,season:o=1,episode:n=1}={}){if(!s)return[];const r=i==="movie",d=parseInt(o,10)||1,u=parseInt(n,10)||1,l=r?`https://player.smashystream.com/movie/${s}`:`https://player.smashystream.com/tv/${s}?s=${d}&e=${u}`;return[{id:`smashystream_${s}_s${d}e${u}`,name:r?"SmashyStream VIP (1080p)":`SmashyStream S${d}B${u}`,displayName:"SmashyStream (1080p)",badge:"⚡ SmashyStream",source:"SmashyStream",url:l,streamUrl:l,quality:"1080p HD",isHls:!1,isDirectVideo:!1,category:"subtitled",type:"embed",getUrl:()=>l}]}async function xl({type:i="movie",tmdbId:s=null,season:o=1,episode:n=1}={}){if(!s)return[];const r=i==="movie",d=parseInt(o,10)||1,u=parseInt(n,10)||1,l=r?`https://player.videasy.to/movie/${s}`:`https://player.videasy.to/tv/${s}/${d}/${u}`,y=[{label:"OpenSubtitles (Türkçe)",src:r?`/api/subtitles?tmdbId=${s||""}&title=${encodeURIComponent(title||"")}&type=movie`:`/api/subtitles?tmdbId=${s||""}&title=${encodeURIComponent(title||"")}&season=${d}&episode=${u}&type=tv`}];return[{id:`torrent_p2p_videasy_${s}_s${d}e${u}`,name:r?"VIP Torrent Akış (1080p)":`VIP Torrent Akış S${d}B${u}`,displayName:"VIP Torrent Akış (1080p)",badge:"⚡ VIP Akış 1080p",source:"VIP Torrent",url:l,streamUrl:l,quality:"1080p HD",isHls:!1,isDirectVideo:!1,category:"subtitled",type:"embed",subtitles:y,getUrl:()=>l}]}const Xt="https://lookmovie2.la";function Ir(i){return i?i.replace(/\s*-\s*S\d+E\d+.*$/i,"").replace(/\s*-\s*S\d+.*$/i,"").replace(/\s*\(\d{4}\).*/,"").trim():""}async function Al(i,s){if(!s)return null;const o=i==="tv"?`${Xt}/api/v1/shows/do-search/?q=${encodeURIComponent(s)}`:`${Xt}/api/v1/movies/do-search/?q=${encodeURIComponent(s)}`;try{const r=typeof window<"u"?`/api/proxy?url=${encodeURIComponent(o)}&ref=${encodeURIComponent("https://lookmovie2.la/")}`:o,d=await fetch(r,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Referer:"https://lookmovie2.la/"},signal:AbortSignal.timeout(5e3)});if(!d.ok)return null;const u=await d.json().catch(()=>null);return!u||!Array.isArray(u.result)||u.result.length===0?null:u.result[0]}catch{return null}}async function zl({type:i="movie",title:s="",originalTitle:o="",season:n=1,episode:r=1}={}){const d=i==="movie",u=parseInt(n,10)||1,l=parseInt(r,10)||1;let p=null;const y=[Ir(s),Ir(o)].filter(Boolean);for(const g of y)if(p=await Al(i,g),p&&p.slug)break;if(!p||!p.slug)return[];try{const g=typeof window<"u",m=d?`${Xt}/movies/play/${p.slug}`:`${Xt}/shows/play/${p.slug}`,x=g?`/api/proxy?url=${encodeURIComponent(m)}&ref=${encodeURIComponent("https://lookmovie2.la/")}`:m,T=await fetch(x,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",Referer:"https://lookmovie2.la/"},signal:AbortSignal.timeout(5500)});if(!T.ok)return[];const h=await T.text();let D=null;if(d){const re=h.match(/id_movie:\s*(\d+)/),N=h.match(/hash:\s*["']([^"']+)["']/),te=h.match(/expires:\s*(\d+)/);if(!re||!N||!te)return[];D=`${Xt}/api/v1/security/movie-access?id_movie=${re[1]}&hash=${N[1]}&expires=${te[1]}`}else{const re=h.match(/hash:\s*["']([^"']+)["']/),N=h.match(/expires:\s*(\d+)/);if(!re||!N)return[];let te=null;const ve=h.split("{");for(const Q of ve)if((Q.includes(`episode: '${l}'`)||Q.includes(`episode: "${l}"`))&&(Q.includes(`season: '${u}'`)||Q.includes(`season: "${u}"`))){const be=Q.match(/id_episode:\s*(\d+)/);if(be){te=be[1];break}}if(!te){const Q=new RegExp(`episode:\\s*["']?${l}["']?[\\s\\S]*?id_episode:\\s*(\\d+)[\\s\\S]*?season:\\s*["']?${u}["']?`,"i"),be=h.match(Q);be&&(te=be[1])}if(!te)return[];D=`${Xt}/api/v1/security/episode-access?id_episode=${te}&hash=${re[1]}&expires=${N[1]}`}const U=g?`/api/proxy?url=${encodeURIComponent(D)}&ref=${encodeURIComponent(m)}`:D,I=await fetch(U,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",Referer:m},signal:AbortSignal.timeout(5500)});if(!I.ok)return[];const P=await I.json().catch(()=>null);if(!P||!P.streams)return[];const R=P.streams||{},F=Object.entries(R).filter(([re,N])=>typeof N=="string"&&N.startsWith("http")&&N.includes(".m3u8")).map(([re,N])=>({quality:re,url:N})),f=["1080p","1080","720p","720","480p","480","auto"];F.sort((re,N)=>{const te=f.indexOf(re.quality),ve=f.indexOf(N.quality);return(te===-1?99:te)-(ve===-1?99:ve)});const w=F.length>0?F[0].url:Object.values(R).find(re=>typeof re=="string"&&re.includes(".m3u8"))||null;if(!w)return[];const se=w,ne=[];return Array.isArray(P.subtitles)&&P.subtitles.forEach(re=>{if(!re||!re.file)return;const N=(re.language||"").toLowerCase(),te=N.includes("turk")||typeof re.file=="string"&&re.file.includes("tr_"),ve=N.includes("eng")||typeof re.file=="string"&&re.file.includes("en_");if(te||ve){let Q="";typeof re.file=="string"&&(Q=re.file.startsWith("http")?re.file:`${Xt}${re.file}`),Q&&ne.push({label:te?"Türkçe (LookMovie)":"English (LookMovie)",src:`/api/proxy?url=${encodeURIComponent(Q)}&ref=${encodeURIComponent("https://lookmovie2.la/")}`})}}),[{id:`lookmovie_direct_${p.id_show||p.id_movie||p.slug}_s${u}e${l}`,name:d?"LookMovie HLS (1080p TR Altyazı)":`LookMovie HLS S${u}B${l} (TR Altyazı)`,displayName:"LookMovie HLS (1080p)",badge:"🎬 LookMovie Direct",source:"LookMovie",url:se,streamUrl:se,quality:"1080p HD",isHls:!0,isDirectVideo:!0,category:"subtitled",subtitles:ne,getUrl:()=>se}]}catch{return[]}}async function Dl({type:i="movie",tmdbId:s=null,imdbId:o=null,title:n="",originalTitle:r="",season:d=1,episode:u=1}={}){const l=n||r;if(!l)return[];const p=parseInt(d,10)||1,y=parseInt(u,10)||1,g=i==="movie";try{const m=Br(l),x=Br(r),T=Xe(`/api/hdfc_stream?query=${encodeURIComponent(m)}&originalTitle=${encodeURIComponent(x)}&tmdbId=${s||""}&imdbId=${o||""}&season=${p}&episode=${y}&type=${i||(g?"movie":"tv")}`),h=await fetch(T,{signal:AbortSignal.timeout(22e3)}).catch(()=>null);if(!h||!h.ok)return[];const D=await h.json().catch(()=>null);if(!D||!D.success||!D.streamUrl)return[];const U=[],I=[];if(Array.isArray(D.subtitles))for(const R of D.subtitles)R.src&&I.push({label:R.label||"Türkçe (HDFC)",src:R.src});if(!I.some(R=>(R.label||"").toLowerCase().includes("türk")||(R.label||"").toLowerCase().includes("tr"))&&(o||s||n)){const R=encodeURIComponent(n||r||""),F=g?`/api/subtitles?tmdbId=${s||""}&imdbId=${o||""}&title=${R}&type=movie`:`/api/subtitles?tmdbId=${s||""}&imdbId=${o||""}&title=${R}&season=${p}&episode=${y}&type=tv`;I.unshift({label:"OpenSubtitles (Türkçe)",src:F})}return U.push({id:`hdfc_${s||"q"}_${g?"movie":`s${p}e${y}`}`,name:g?"HDFilmCehennemi VIP (1080p HLS)":`HDFilmCehennemi S${p}B${y}`,displayName:"HDFilmCehennemi (1080p)",badge:"🔥 HDFC 1080p HLS",source:"HDFilmCehennemi",url:Xe(D.streamUrl),streamUrl:Xe(D.streamUrl),rawStreamUrl:D.rawStreamUrl,movieUrl:D.movieUrl,quality:"1080p HD",isHls:!0,isDirectVideo:!0,category:"subtitled",type:"direct",subtitles:I,getUrl:()=>Xe(D.streamUrl)}),U}catch{return[]}}function Br(i){return i?i.replace(/\s*-\s*S\d+E\d+.*$/i,"").replace(/\s*-\s*S\d+.*$/i,"").replace(/\s*-\s*\d+\.\s*Sezon.*$/i,"").replace(/\s*\(\d{4}\).*/,"").trim():""}const ut="https://jetfilmizle.now",Tl="https://wild-credit-e1ae.cagatayca07.workers.dev";function Ma(i){return i?i.toLowerCase().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9]/g,""):""}function Cl(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-"):""}async function yi(i,s={}){const o=typeof window<"u";if(!s.method||s.method==="GET")try{const n=`${Tl}?url=${encodeURIComponent(i)}`,r=await fetch(n,{...s,signal:AbortSignal.timeout(s.timeout||4500)}).catch(()=>null);if(r&&r.ok)return r}catch{}if(o)try{const n=new URL(i),r=`/api/jet${n.pathname}${n.search}`,d=await fetch(r,{...s,headers:{"X-Requested-With":"XMLHttpRequest",...s.headers||{}},signal:AbortSignal.timeout(s.timeout||4500)}).catch(()=>null);if(d&&d.ok)return d}catch{}try{const n=await fetch(i,{...s,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36","X-Requested-With":"XMLHttpRequest",Referer:ut,Origin:ut,...s.headers||{}},signal:AbortSignal.timeout(s.timeout||4500)}).catch(()=>null);if(n&&n.ok)return n}catch{}return null}async function Zr(i,s=!1){if(!i||typeof i!="string"||i.trim().length<2)return[];const o=i.trim(),n=s?`${ut}/diziler?q=${encodeURIComponent(o)}`:`${ut}/arama?q=${encodeURIComponent(o)}`;try{const r=await yi(n,{headers:{Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"},timeout:4500});if(!r)return[];const d=await r.text(),u=[],l=s?/<a[^>]+href=["'](https:\/\/jetfilmizle\.now\/dizi\/[^"']+)["'][^>]*title=["']([^"']+)["']/gi:/<a[^>]+href=["'](https:\/\/jetfilmizle\.now\/(?:film|dizi)\/[^"']+)["'][^>]*title=["']([^"']+)["']/gi;let p;for(;(p=l.exec(d))!==null;){const y=p[1],g=p[2],m=y.split("/").filter(Boolean).pop(),x=g.replace(/Full.*İzle/i,"").replace(/Türkçe Dublaj.*/i,"").replace(/Altyazılı.*/i,"").replace(/HD.*/i,"").replace(/Dizisi.*/i,"").trim();u.some(T=>T.url===y)||u.push({title:x,url:y,slug:m,isSeries:s||y.includes("/dizi/")})}return u}catch{return[]}}async function Ss({titles:i=[],title:s="",originalTitle:o="",year:n=null,isDub:r=!0}){const d=[...new Set([...i,s,o])].filter(l=>l&&typeof l=="string"&&l.trim().length>1);if(d.length===0)return[];let u=null;for(const l of d){const y=(await Zr(l,!1)).filter(g=>!g.isSeries);if(y.length>0){const g=Ma(l),m=y.find(x=>{const T=Ma(x.title);return T===g||T.includes(g)||g.includes(T)})||y[0];if(m){u=m.url;break}}}if(!u)return[];try{const l=await yi(u,{headers:{Referer:ut},timeout:4500});if(!l)return[];const p=await l.text(),y=p.match(/name=["']film_id["'][^>]*value=["'](\d+)["']/i)||p.match(/value=["'](\d+)["'][^>]*name=["']film_id["']/i);if(!y)return[];const g=y[1],m=`${ut}/jetplayer`,x=r?"dublaj":"altyazili",T=[],h=[];for(let U=0;U<4;U++)h.push(yi(m,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest",Referer:u,Origin:ut},body:`film_id=${g}&source_index=${U}&player_type=${x}`,timeout:4e3}).then(async I=>{if(!I)return null;const R=(await I.text()).match(/<iframe[^>]+src=['"]([^'"]+)['"]/i);if(!R)return null;let F=R[1];if(F.startsWith("//")&&(F="https:"+F),F.includes("youtube")||F.includes("youtu.be")||F.includes("trailer"))return null;const f=F.includes("vidmoly"),w=F.includes("ok.ru"),se=F.includes("titan"),ne=f?"Jet VidMoly 1080p":w?"Jet OK.ru HD":se?`Jet Titan VIP ${U+1}`:`Jet VIP ${U+1}`;return{id:`jet_${g}_${U}`,name:ne,displayName:ne,source:"Jet",url:F,quality:"1080p",type:"iframe",isDub:r}}).catch(()=>null));const D=await Promise.all(h);for(const U of D)U&&U.url&&!T.some(I=>I.url===U.url)&&T.push(U);return T}catch{return[]}}async function $s({titles:i=[],seriesTitle:s="",season:o=1,episode:n=1,isDub:r=!0}){const d=[...new Set([...i,s])].filter(l=>l&&typeof l=="string"&&l.trim().length>1);if(d.length===0)return[];let u=null;for(const l of d){const p=Cl(l),y=[p,`${p}-2025`,`${p}-2024`,`${p}-dizisi`];for(const g of y)try{const m=`${ut}/dizi/${g}`;if(await yi(m,{method:"HEAD",timeout:2e3})){u=m;break}}catch{}if(u)break}if(!u)for(const l of d){const y=(await Zr(l,!0)).filter(g=>g.isSeries);if(y.length>0){const g=Ma(l),m=y.find(x=>{const T=Ma(x.title);return T===g||T.includes(g)||T.includes(T)})||y[0];if(m){u=m.url;break}}}if(!u)return[];try{const l=await yi(u,{headers:{Referer:ut},timeout:4500});if(!l)return[];const p=await l.text(),y=p.match(/name=["']film_id["'][^>]*value=["'](\d+)["']/i)||p.match(/value=["'](\d+)["'][^>]*name=["']film_id["']/i);if(!y)return[];const g=y[1],m=`${ut}/jetplayer`,x=r?"dublaj":"altyazili",T=p.match(new RegExp(`data-source-index=["'](\\d+)["'][^>]*data-season=["']${o}["'][^>]*data-episode=["']${n}["']`,"i"))||p.match(new RegExp(`data-season=["']${o}["'][^>]*data-episode=["']${n}["'][^>]*data-source-index=["'](\\d+)["']`,"i")),h=T?T[1]:n-1,D=await yi(m,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest",Referer:u,Origin:ut},body:`film_id=${g}&source_index=${h}&player_type=${x}`,timeout:4500});if(!D)return[];const I=(await D.text()).match(/<iframe[^>]+src=['"]([^'"]+)['"]/i);if(!I)return[];let P=I[1];if(P.startsWith("//")&&(P="https:"+P),P.includes("youtube")||P.includes("youtu.be")||P.includes("trailer"))return[];const R=P.includes("vidmoly"),F=P.includes("ok.ru"),f=P.includes("titan"),w=R?`Jet VidMoly (S${o}B${n})`:F?`Jet OK.ru (S${o}B${n})`:f?`Jet Titan VIP (S${o}B${n})`:`Jet VIP (S${o}B${n})`;return[{id:`jet_series_${g}_s${o}_e${n}`,name:w,displayName:w,source:"Jet",url:P,quality:"1080p",type:"iframe",isDub:r}]}catch{return[]}}const Il="https://wild-credit-e1ae.cagatayca07.workers.dev",Bl="hlxjl1c2w281ax473rt1ofgrvhyjvi",_l="035f01015659595301060601525f39060c094e03515b442d13590e1a1c405b085b55031c5c5b475d57035c5c54415a001b04071f4446",Ll="15632429",El="38534241025665";function _r(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^\w\s-]/g," ").replace(/\s+/g," ").trim():""}function Rl(){try{const i=new Date().toLocaleString("en-US",{timeZone:"Europe/Istanbul",weekday:"long"}).toLowerCase(),s=`${Bl}_${i}`,o=Array.from({length:6},()=>(Math.random()+1).toString(36)[2]).join(""),n=JSON.stringify({[o]:Date.now()}),r=new TextEncoder,d=r.encode(n),u=r.encode(s),l=new Uint8Array(d.length);for(let p=0;p<d.length;p++)l[p]=d[p]^u[p%u.length];return Array.from(l).map(p=>p.toString(16).padStart(2,"0")).join("")}catch{return""}}function Ml(){return{"Cf-Control":Rl(),device:"browser",language:"tr",site:"main","user-session":_l,"user-profile":Ll,user:El,Origin:"https://anizium.co",Referer:"https://anizium.co/"}}async function Lr(i,s=4500){const o=typeof window<"u",n=Ml();try{const r=await fetch(i,{headers:n,signal:AbortSignal.timeout(s)});if(r&&r.ok){const d=await r.json().catch(()=>null);if(d)return d}}catch{}if(o)try{const r=`${Il}?url=${encodeURIComponent(i)}`,d=await fetch(r,{headers:n,signal:AbortSignal.timeout(s)});if(d&&d.ok)return await d.json().catch(()=>null)}catch{}return null}async function Er({titles:i=[],seriesTitle:s="",title:o="",originalTitle:n="",type:r="tv",season:d=1,episode:u=1,isDub:l=!1}={}){const p=[...new Set([n,s,o,...i])].filter(h=>h&&typeof h=="string"&&h.trim().length>1);if(p.length===0)return[];const y=parseInt(d,10)||1,g=parseInt(u,10)||1,m=r==="movie",x=[],T=new Set;for(const h of p)try{const D=_r(h);if(!D||D.length<2)continue;const U=`https://api.anizium.co/page/search?value=${encodeURIComponent(D)}`,I=await Lr(U,3800),P=I?.page?.data||I?.data||[];if(!Array.isArray(P)||P.length===0)continue;for(const R of P.slice(0,3)){if(!R||!R.ID)continue;const F=_r(R.name||R.name_tr||R.name_short||"");if(!Pe(F,p))continue;const f=m?`https://api.anizium.co/anime/source?id=${R.ID}&site=main&plan=free&server=1`:`https://api.anizium.co/anime/source?id=${R.ID}&site=main&plan=free&season=${y}&episode=${g}&server=1`,w=await Lr(f,4200);if(!w||!w.success||!Array.isArray(w.groups)||w.groups.length===0)continue;const se=[];if(Array.isArray(w.subtitles))for(const N of w.subtitles)N&&N.link&&se.push({label:N.name||(N.group==="tr"?"Türkçe":"İngilizce"),src:N.link});let ne=null;if(l?ne=w.groups.find(N=>N.group==="trdub"||(N.name||"").toLowerCase().includes("türk")):(ne=w.groups.find(N=>N.group==="original"||N.group==="trsub"||(N.name||"").toLowerCase().includes("japon")),ne||(ne=w.groups.find(N=>N.group!=="trdub"))),!ne||!Array.isArray(ne.items)||ne.items.length===0)continue;const re=[...ne.items].sort((N,te)=>(te.quality||0)-(N.quality||0));for(const N of re){if(!N||!N.link||T.has(N.link)||N.quality<720&&re.some(be=>be.quality>=720))continue;T.add(N.link);const te=N.quality>=2160?"4K":N.quality?`${N.quality}p`:"1080p",ve=N.quality>=2160,Q=m?`AZ ${te}`:`AZ ${te} (S${y}B${g})`;x.push({id:`az_${R.ID}_${m?"mov":`s${y}e${g}`}_${N.quality||"1080"}_${l?"dub":"sub"}`,name:`${Q} ${l?"TR Dublaj":"TR Altyazı"}`,displayName:`${Q} ${l?"TR Dublaj":"TR Altyazı"}`,badge:ve?`⚡ AZ 4K UHD ${l?"Dublaj":"Altyazı"}`:`⚡ AZ 1080p ${l?"Dublaj":"Altyazı"}`,source:"AZ",url:N.link,streamUrl:N.link,quality:ve?"4K UHD":N.quality?`${N.quality}p`:"1080p",isHls:!1,isDirectVideo:!0,type:"direct",category:l?"dubbed":"subtitled",subtitles:l?[]:se,isDub:l,getUrl:()=>N.link})}if(x.length>0)break}if(x.length>0)break}catch{}return x}const xs="v39",Ul="4e44d9029b1270a757cddc766a1bcb63",Yt=new Map;function Fi(i){return i?i.replace(/\s*-\s*S\d+E\d+.*$/i,"").replace(/\s*-\s*S\d+.*$/i,"").replace(/\s*-\s*\d+\.\s*Sezon.*$/i,"").replace(/\s*\(\d{4}\).*/,"").trim():""}function Jr(i,s){const o=new Set;i&&(o.add(i),o.add(Fi(i))),s&&(o.add(s),o.add(Fi(s)));const n=new Set(o);for(const r of o){if(!r)continue;const d=r.replace(/\bpart\s+two\b/i,"Part 2").replace(/\bpart\s+three\b/i,"Part 3").replace(/\bpart\s+four\b/i,"Part 4").replace(/\bpart\s+one\b/i,"Part 1").replace(/\bbolum\s+iki\b/i,"Bölüm 2").replace(/\bbolum\s+uc\b/i,"Bölüm 3").replace(/\bpart\s+ii\b/i,"Part 2").replace(/\bpart\s+iii\b/i,"Part 3");n.add(d);const u=r.replace(/\bPart\s+\d+\b/gi,"").replace(/\bBölüm\s+\d+\b/gi,"").replace(/\b(II|III|IV|V|VI)\b/g,"").trim();u&&u.length>2&&n.add(u)}return Array.from(n).filter(Boolean)}async function Pl(i,s,o,n){const r=Jr(o,n);let d=null,u=!1;if(!s)return{candidateTitles:r,detectedYear:d,isAnimation:u};try{const y=await fetch(`https://api.themoviedb.org/3/${i==="movie"?"movie":"tv"}/${s}?api_key=${Ul}&language=tr-TR`,{signal:AbortSignal.timeout(3500)});if(y.ok){const g=await y.json(),m=g.title||g.name,x=g.original_title||g.original_name,T=g.release_date||g.first_air_date;T&&(d=new Date(T).getFullYear()),Array.isArray(g.genres)&&g.genres.some(h=>h.id===16||(h.name||"").toLowerCase().includes("animasyon"))&&(u=!0),m&&r.push(m,Fi(m)),x&&r.push(x,Fi(x))}}catch{}return{candidateTitles:Array.from(new Set(r.map(p=>(p||"").trim()).filter(Boolean))),detectedYear:d,isAnimation:u}}function ql(i,s=""){const o=(i.url||i.streamUrl||(typeof i.getUrl=="function"?i.getUrl():"")||"").toLowerCase(),n=(i.displayName||i.name||"").toLowerCase(),r=(i.id||"").toLowerCase();if(r.startsWith("hdfc_")||n.includes("hdfilmcehennemi")||n.includes("hdfc"))return s==="dubbed"||n.includes("dub")?"HDFilmCehennemi Dublaj 1080p":"HDFilmCehennemi Altyazı 1080p";if(r.startsWith("dzb_")||r.startsWith("dzp_")||n.includes("dizibal")||n.includes("dizipal")||n.includes("dp"))return n.includes("player")?s==="dubbed"?"DP DiziBal Player (TR Dublaj)":"DP DiziBal Player (TR Altyazı)":s==="dubbed"||n.includes("dub")?"DP 1080p (TR Dublaj)":s==="subtitled"||n.includes("alt")||n.includes("sub")?"DP 1080p (TR Altyazı)":"DP 1080p";if(r.startsWith("dzs_")||n.includes("dizisol")){let d=(i.displayName||i.name||"DS 1080p (HLS)").replace(/dizisol/gi,"DS").trim();return d.startsWith("DS")||(d=`DS ${d}`),d}return r.startsWith("snx")||n.includes("sinewix")||n.includes("swx")?n.includes("mkv")?"SWX 1080p (MKV)":"SWX 1080p Direct":r.startsWith("tvr_")||r.startsWith("rectv_")||n.includes("rectv")||n.includes("tvr")?i.displayName||i.name||"  TVR VIP 1080p":r.startsWith("lookmovie_")||n.includes("lookmovie")?i.displayName||i.name||"  LookMovie VIP 1080p":r.startsWith("twoembed_")||n.includes("2embed")?i.displayName||i.name||"  2Embed VIP 1080p":r.startsWith("dml_")||n.includes("dramalar")?i.displayName||i.name||"  Dramalar VIP 1080p":r.startsWith("ddz_")||n.includes("dramadizilerim")?i.displayName||i.name||"  DDZ VIP 1080p":r.startsWith("dzy_")||n.includes("diziyo")?o.includes("vidmoly")?"Diziyo VidMoly 1080p":i.displayName||i.name||"Diziyo 1080p":r.startsWith("dyu_")||n.includes("diziyou")?i.displayName||i.name||"Diziyou 1080p":r.startsWith("hdfb_")||n.includes("hdfilmizle")?i.displayName||i.name||"HDF 1080p":r.startsWith("kvip_")||n.includes("kids vip")?i.displayName||i.name||"  Kids VIP Direct 1080p":r.startsWith("az_")||r.startsWith("anizium_")||n.includes("anizium")||n.includes("az ")?i.displayName||i.name||"AZ 4K/1080p VIP":r.startsWith("acx_")||n.includes("animecix")?i.displayName||i.name||"AX Tau Direct 1080p":r.startsWith("szd_")?o.includes("vidmoly")?"SZ VidMoly 1080p":o.includes("sibnet")?"SZ Sibnet HD":i.displayName||i.name||"SZ 1080p":i.displayName||i.name||"VIP 1080p"}function Nl(i,s,o){const n=i.streamUrl||i.url||(typeof i.getUrl=="function"?i.getUrl():"")||"",r=ql(i,s)||o;let d=i.badge||(s==="dubbed"?"  TR Dublaj":"  TR Altyazı");const u=r.toLowerCase();return u.includes("hdfc")||u.includes("hdfilmcehennemi")?d=s==="dubbed"?"  HDFC Dublaj 1080p":"  HDFC Altyazı 1080p":u.includes("dzb")||u.includes("dizibal")||u.includes("dp")?d=s==="dubbed"?"  DP Dublaj":"  DP Altyazı":u.includes("ds")?d=s==="dubbed"?"  DS Dublaj":"  DS Altyazı":u.includes("az ")||u.includes("az 4k")||u.includes("az 1080p")||u.includes("anizium")?d=i.badge||(s==="dubbed"?"  AZ 4K Dublaj":"  AZ 4K Altyazı"):u.includes("swx")?d="  SWX 1080p":u.includes("tvr")?d="  TVR 1080p":u.includes("lookmovie")?d="  LookMovie 1080p":u.includes("2embed")?d="  2Embed 1080p":u.includes("dramalar")||id.startsWith("dml_")?d="👑 Dramalar VIP":(u.includes("dramadizilerim")||id.startsWith("ddz_"))&&(d="🎭 DDZ VIP"),{...i,id:i.id||`stream_${Math.random().toString(36).slice(2,9)}`,name:r,displayName:r,streamUrl:n,url:n,badge:d,category:s,isHls:!!(i.isHls||n.includes(".m3u8")),isDirectVideo:!!(i.isDirectVideo||i.isHls||n.includes(".m3u8")||n.includes(".mp4")||n.includes(".mkv")),getUrl:()=>n}}function Hl(i){const s=(i.url||i.streamUrl||(typeof i.getUrl=="function"?i.getUrl():"")||"").toLowerCase();if(!s||s.length<8)return!1;const o=(i.id||"").toLowerCase(),n=(i.displayName||i.name||"").toLowerCase();if(o.startsWith("torrent_p2p_"))return!0;if(i.isTorrent&&!o.startsWith("torrent_p2p_")||o.includes("yts")||n.includes("yts")||s.includes("yts.mx")||s.includes("pichive")||s.includes("hotlinger")||s.includes("diziyo.so")&&!s.includes(".m3u8"))return!1;const r=["recaptcha","media.cm","cloudvideo.tv","vidoza.net","voe.sx","bysejikuar","filemoon","hdfilmdelisi","play.liderfilm"];for(const d of r)if(s.includes(d))return!1;return!0}function rt(i){(i.url||i.streamUrl||(typeof i.getUrl=="function"?i.getUrl():"")||"").toLowerCase();const s=(i.displayName||i.name||"").toLowerCase(),o=(i.id||"").toLowerCase();return o.startsWith("hdfc_")||s.includes("hdfilmcehennemi")||s.includes("hdfc")?0:o.startsWith("dzb_")||o.startsWith("dzp_")||s.includes("dp 1080p")||s.includes("dp ")||s.includes("dizibal")?1:o.startsWith("dzs_")||s.includes("dizisol")||s.includes("ds 1080p")||s.includes("ds ")?2:o.startsWith("snx")||s.includes("sinewix")||s.includes("swx")?i.isMkv||s.includes("mkv")?9:3:o.startsWith("tvr_")||s.includes("tvr")||s.includes("rectv")?4:o.startsWith("dml_")||s.includes("dramalar")?1:o.startsWith("ddz_")||s.includes("dramadizilerim")||s.includes("ddz vip")?2:o.startsWith("lookmovie_")||s.includes("lookmovie")?5:o.startsWith("dzy_")||s.includes("diziyo")?6:o.startsWith("dyu_")||s.includes("diziyou")?7:o.startsWith("szd_")||s.includes("sezonluk")?8:o.startsWith("hdfb_")||s.includes("hdfilmizle")||s.includes("hdf ")?9:o.startsWith("torrent_p2p_")?10:o.startsWith("twoembed_")||s.includes("2embed")?12:o.startsWith("smashystream_")||s.includes("smashy")?13:o.startsWith("az_")||o.startsWith("anizium_")||s.includes("anizium")||s.includes("az ")?2:o.startsWith("kvip_")||s.includes("kids vip")?14:o.startsWith("acx_")||s.includes("animecix")?15:o.startsWith("atr_")||s.includes("animetr")?17:20}async function jl({type:i="movie",tmdbId:s=null,imdbId:o=null,title:n="",originalTitle:r="",seriesTitle:d="",year:u=null,season:l=1,episode:p=1,onUpdate:y=()=>{}}){const g=i==="movie",m=Fi(d||n),x=`${i}_${s||m}_s${l}_e${p}`,T=A=>Array.isArray(A)?A.map(O=>{if(!O)return O;const $e=O.streamUrl||O.url||"";return{...O,streamUrl:$e,url:$e,getUrl:()=>$e}}):[];if(!Yt.has(x))try{const A=sessionStorage.getItem(`cp_streams_${xs}_${x}`);if(A){const O=JSON.parse(A);if(O&&(O.dubbed?.length||O.subtitled?.length)){const $e={...O,dubbed:T(O.dubbed),subtitled:T(O.subtitled)};Yt.set(x,$e)}}}catch{}if(Yt.has(x)){const A=Yt.get(x),O={...A,dubbed:T(A.dubbed),subtitled:T(A.subtitled)};y({...O,isComplete:!1}),Yt.delete(x);try{sessionStorage.removeItem(`cp_streams_${xs}_${x}`)}catch{}}let h=Jr(m,r),D=u;const U=s?Pl(i,s,m,r).catch(()=>null):Promise.resolve(null);let I=[],P=[];const R=new Set,F=new Set,f=(A,O)=>{if(!Array.isArray(A)||A.length===0)return[];const $e=A.filter(Hl),L=[];for(const Te of $e){const Ge=Nl(Te,O,O==="dubbed"?"VIP 1080p":"VIP Altyazılı"),_e=(Ge.streamUrl||Ge.url||"").trim().toLowerCase(),gt=`${(Ge.id||"").toLowerCase().split("_").slice(0,2).join("_")}||${_e}`;O==="dubbed"?R.has(gt)||(R.add(gt),I.push(Ge),I.sort((Le,ae)=>rt(Le)-rt(ae)),L.push(Ge)):F.has(gt)||(F.add(gt),P.push(Ge),P.sort((Le,ae)=>rt(Le)-rt(ae)),L.push(Ge))}const q=[...P,...I].find(Te=>Array.isArray(Te.subtitles)&&Te.subtitles.length>0)?.subtitles;if(q&&q.length>0){for(const Te of P)(!Array.isArray(Te.subtitles)||Te.subtitles.length===0)&&(Te.subtitles=q);for(const Te of I)(!Array.isArray(Te.subtitles)||Te.subtitles.length===0)&&(Te.subtitles=q)}return L.length>0&&y({dubbed:[...I],subtitled:[...P],totalServers:I.length+P.length,isComplete:!1,newStream:L[0],isDubbedStream:O==="dubbed"}),L},w=i==="anime";if(!!(s&&(String(s).startsWith("ddz_")||String(s).startsWith("dml_"))||i==="short-drama")){const A=[wa({titles:h,seriesTitle:m,season:l,episode:p,isDub:!0}).then(q=>f(q,"dubbed")).catch(()=>[]),wa({titles:h,seriesTitle:m,season:l,episode:p,isDub:!1}).then(q=>f(q,"subtitled")).catch(()=>[]),ka({titles:h,seriesTitle:m,season:l,episode:p,isDub:!0}).then(q=>f(q,"dubbed")).catch(()=>[]),ka({titles:h,seriesTitle:m,season:l,episode:p,isDub:!1}).then(q=>f(q,"subtitled")).catch(()=>[])];await Promise.allSettled(A);const O=I.sort((q,Te)=>rt(q)-rt(Te)),$e=P.sort((q,Te)=>rt(q)-rt(Te)),L={dubbed:O,subtitled:$e,totalServers:O.length+$e.length,isComplete:!0};return y(L),Yt.set(x,L),L}const ne=[vl({type:i,title:m,originalTitle:r,season:l,episode:p,year:D}).then(A=>{if(!Array.isArray(A)||A.length===0)return[];const O=A.filter(L=>{const q=`${L.name||""} ${L.badge||""}`.toLowerCase();return q.includes("dublaj")||q.includes("tr dub")}),$e=A.filter(L=>{const q=`${L.name||""} ${L.badge||""}`.toLowerCase();return!q.includes("dublaj")&&!q.includes("tr dub")});O.length>0&&f(O,"dubbed"),$e.length>0&&f($e,"subtitled"),O.length===0&&$e.length===0&&A.length>0&&f(A,"subtitled")}).catch(()=>[]),jo({type:i,titles:h,title:m,seriesTitle:m,originalTitle:r,year:D,season:l,episode:p,imdbId:o,isDub:null}).then(A=>{if(!Array.isArray(A)||A.length===0)return;const O=A.filter(L=>L.category==="subtitled"||(L.badge||"").includes("Altyazı")),$e=A.filter(L=>!O.includes(L));f($e,"dubbed"),f(O,"subtitled")}).catch(()=>[]),(g?xa({titles:h,title:m,originalTitle:r}):$a({titles:h,seriesTitle:m,originalTitle:r,season:l,episode:p})).then(A=>{if(!(!Array.isArray(A)||A.length===0))for(const O of A)f([{...O,id:`${O.id}_dub`,name:g?"DP DiziBal Player (TR Dublaj)":`DP DiziBal Player Dublaj S${l}B${p}`,displayName:g?"DP DiziBal Player (TR Dublaj)":`DP DiziBal Player Dublaj (S${l}B${p})`,badge:"  DiziBal Orijinal Player",category:"dubbed"}],"dubbed"),f([{...O,id:`${O.id}_sub`,name:g?"DP DiziBal Player (TR Altyazı)":`DP DiziBal Player Altyazı S${l}B${p}`,displayName:g?"DP DiziBal Player (TR Altyazı)":`DP DiziBal Player Altyazı (S${l}B${p})`,badge:"  DiziBal Orijinal Player",category:"subtitled"}],"subtitled")}).catch(()=>[]),(g?Ar({titles:h,tmdbId:s,title:m,originalTitle:r}):Ra({titles:h,tmdbId:s,seriesTitle:m,originalTitle:r,season:l,episode:p})).then(A=>{if(!(!Array.isArray(A)||A.length===0))for(const O of A)f([{...O,id:`${O.id}_dub`,name:O.name?O.name.replace(/\(Altyazı\)/i,"(TR Dublaj)"):"DS 1080p (TR Dublaj)",displayName:O.displayName?O.displayName.replace(/\(Altyazı\)/i,"(TR Dublaj)"):"DS 1080p (TR Dublaj)",badge:"  TR Dublaj",category:"dubbed"}],"dubbed"),f([{...O,id:`${O.id}_sub`,name:O.name?O.name.replace(/\(Dublaj\)/i,"(TR Altyazı)"):"DS 1080p (TR Altyazı)",displayName:O.displayName?O.displayName.replace(/\(Dublaj\)/i,"(TR Altyazı)"):"DS 1080p (TR Altyazı)",badge:"  TR Altyazı",category:"subtitled"}],"subtitled")}).catch(()=>[]),g?Dr({titles:h,title:m,originalTitle:r,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]):zr({titles:h,seriesTitle:m,originalTitle:r,season:l,episode:p,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]),g?Dr({titles:h,title:m,originalTitle:r,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]):zr({titles:h,seriesTitle:m,originalTitle:r,season:l,episode:p,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]),al({titles:h,seriesTitle:m,title:m,originalTitle:r,season:l,episode:p,isDub:!1}).then(A=>{Array.isArray(A)&&A.length>0&&(f(A,"subtitled"),f(A.map(O=>({...O,id:`${O.id}_dub`,name:(O.name||"Diziyou").replace(/\s*\(TR Altyazı\)/i,""),category:"dubbed"})),"dubbed"))}).catch(()=>[]),Sa({titles:h,seriesTitle:m,originalTitle:r,season:l,episode:p,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]),Sa({titles:h,seriesTitle:m,originalTitle:r,season:l,episode:p,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]),g?ws({titles:h,title:m,originalTitle:r,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]):Promise.resolve([]),g?ws({titles:h,title:m,originalTitle:r,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]):Promise.resolve([]),g?Ss({titles:h,title:m,originalTitle:r,year:D,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]):$s({titles:h,seriesTitle:m,season:l,episode:p,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]),g?Ss({titles:h,title:m,originalTitle:r,year:D,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]):$s({titles:h,seriesTitle:m,season:l,episode:p,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]),g?Ca({titles:h,title:m,originalTitle:r,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]):ks({titles:h,seriesTitle:m,title:m,originalTitle:r,season:l,episode:p,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]),g?Ca({titles:h,title:m,originalTitle:r,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]):ks({titles:h,seriesTitle:m,title:m,originalTitle:r,season:l,episode:p,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]),Promise.resolve($l({type:i,tmdbId:s,season:l,episode:p})).then(A=>f(A,"subtitled")).catch(()=>[]),zl({type:i,title:m,originalTitle:r,season:l,episode:p}).then(A=>f(A,"subtitled")).catch(()=>[]),w?xr({titles:h,seriesTitle:m,title:m,originalTitle:r,season:l,episode:p,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]):Promise.resolve([]),w?xr({titles:h,seriesTitle:m,title:m,originalTitle:r,season:l,episode:p,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]):Promise.resolve([]),w?Wo({titles:h,seriesTitle:m,title:m,originalTitle:r,season:l,episode:p,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]):Promise.resolve([]),Er({type:i,titles:h,seriesTitle:m,title:m,originalTitle:r,season:l,episode:p,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]),Er({type:i,titles:h,seriesTitle:m,title:m,originalTitle:r,season:l,episode:p,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]),xl({type:i,tmdbId:s,season:l,episode:p}).then(A=>{Array.isArray(A)&&A.length>0&&f(A,"subtitled")}).catch(()=>[]),Dl({type:i,tmdbId:s,imdbId:o,title:m,originalTitle:r,season:l,episode:p}).then(A=>{if(!Array.isArray(A)||A.length===0)return[];for(const O of A)f([{...O,id:`${O.id}_dub`,name:g?"HDFilmCehennemi Dublaj 1080p":`HDFilmCehennemi Dublaj S${l}B${p}`,displayName:g?"HDFilmCehennemi Dublaj (1080p)":`HDFilmCehennemi Dublaj (S${l}B${p})`,badge:"  HDFC Dublaj 1080p",category:"dubbed"}],"dubbed"),f([{...O,id:`${O.id}_sub`,name:g?"HDFilmCehennemi Altyazı 1080p":`HDFilmCehennemi Altyazı S${l}B${p}`,displayName:g?"HDFilmCehennemi Altyazı (1080p)":`HDFilmCehennemi Altyazı (S${l}B${p})`,badge:"  HDFC Altyazı 1080p",category:"subtitled"}],"subtitled")}).catch(A=>[]),g?Promise.resolve([]):wa({titles:h,seriesTitle:m,season:l,episode:p,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]),g?Promise.resolve([]):wa({titles:h,seriesTitle:m,season:l,episode:p,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]),g?Promise.resolve([]):ka({titles:h,seriesTitle:m,season:l,episode:p,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]),g?Promise.resolve([]):ka({titles:h,seriesTitle:m,season:l,episode:p,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[])],re=U.then(A=>{if(!A?.candidateTitles?.length)return[];const O=A.candidateTitles.filter(L=>!h.includes(L));if(!O.length)return[];h=A.candidateTitles,!D&&A.detectedYear&&(D=A.detectedYear);const $e=[g?xa({titles:O,title:m,originalTitle:r,isDub:!1}).then(L=>f(L,"subtitled")):$a({titles:O,seriesTitle:m,originalTitle:r,season:l,episode:p,isDub:!1}).then(L=>f(L,"subtitled")),g?Promise.resolve([]):Sa({titles:O,seriesTitle:m,originalTitle:r,season:l,episode:p,isDub:!0}).then(L=>f(L,"dubbed")),g?Promise.resolve([]):Sa({titles:O,seriesTitle:m,originalTitle:r,season:l,episode:p,isDub:!1}).then(L=>f(L,"subtitled"))];return Promise.allSettled($e)}),N=g?[$a({titles:h,seriesTitle:m,originalTitle:r,season:l,episode:p,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]),$a({titles:h,seriesTitle:m,originalTitle:r,season:l,episode:p,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]),Ra({titles:h,tmdbId:s,seriesTitle:m,originalTitle:r,season:l,episode:p}).then(A=>f(A,"subtitled")).catch(()=>[]),ks({titles:h,seriesTitle:m,title:m,originalTitle:r,season:l,episode:p,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]),$s({titles:h,seriesTitle:m,season:l,episode:p,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[])]:[xa({titles:h,title:m,originalTitle:r,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]),xa({titles:h,title:m,originalTitle:r,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]),Ar({titles:h,tmdbId:s,title:m,originalTitle:r}).then(A=>f(A,"subtitled")).catch(()=>[]),Ca({titles:h,title:m,originalTitle:r,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]),Ca({titles:h,title:m,originalTitle:r,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]),ws({titles:h,title:m,originalTitle:r,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]),Ss({titles:h,title:m,originalTitle:r,year:D,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[])];await Promise.allSettled([...ne,...N,re]);const te=m||r||"",ve=g?`/api/subtitles?tmdbId=${s||""}&imdbId=${o||""}&title=${encodeURIComponent(te)}&type=movie`:`/api/subtitles?tmdbId=${s||""}&imdbId=${o||""}&title=${encodeURIComponent(te)}&season=${l}&episode=${p}&type=tv`;for(const A of I)!Array.isArray(A.subtitles)||A.subtitles.length===0?A.subtitles=[{label:"OpenSubtitles (Türkçe)",src:ve}]:A.subtitles.some(O=>(O.label||"").includes("Türkçe")||O.src?.includes("/api/subtitles"))||A.subtitles.push({label:"OpenSubtitles (Türkçe)",src:ve});for(const A of P)(!Array.isArray(A.subtitles)||A.subtitles.length===0)&&(A.subtitles=[{label:"OpenSubtitles (Türkçe)",src:ve}]);const Q=A=>{const O=new Set,$e=[];for(const L of A){const q=(L.id||"").toLowerCase().split("_").slice(0,2).join("_"),Te=(L.displayName||L.name||L.id).toLowerCase().trim(),Ge=`${q}||${Te}`;O.has(Ge)||(O.add(Ge),$e.push(L))}return $e},be=Q(I).sort((A,O)=>rt(A)-rt(O)),et=Q(P).sort((A,O)=>rt(A)-rt(O)),pt={dubbed:be,subtitled:et,totalServers:be.length+et.length,isComplete:!0};if(pt.totalServers>0){Yt.set(x,pt);try{sessionStorage.setItem(`cp_streams_${xs}_${x}`,JSON.stringify(pt))}catch{}}return y(pt),pt}const Ki="cinepulse_source_health_v1",_s="cinepulse_last_source_v1",Qr=180,Fl=80;function Wi(i,s={}){try{const o=JSON.parse(localStorage.getItem(i)||"");return o&&typeof o=="object"?o:s}catch{return s}}function Ls(i,s){try{localStorage.setItem(i,JSON.stringify(s))}catch{}}function Es(i,s){return Object.fromEntries(Object.entries(i).sort(([,o],[,n])=>Number(n?.updatedAt||0)-Number(o?.updatedAt||0)).slice(0,s))}function Mt(i){return String(i||"").toLocaleLowerCase("tr-TR").replace(/https?:\/\/[^/]+/g,"").replace(/\b\d{2,}\b/g,"").replace(/[^a-z0-9çğıöşü]+/gi," ").trim()}function Kl(){const i=navigator.userAgent||"",s=/android|iphone|ipad|ipod/i.test(i)?"mobile":"desktop";return`${/firefox/i.test(i)?"firefox":/safari/i.test(i)&&!/chrome|chromium|android/i.test(i)?"safari":/edg/i.test(i)?"edge":"chromium"}-${s}`}function Rs(i,s=""){const o=Mt(i?.source||i?.provider||""),n=Mt(String(i?.id||"").replace(/_[a-z0-9]{5,}$/i,"")),r=Mt(i?.displayName||i?.name||"");return`${Mt(s||i?.category)}|${o||n}|${r||n}`}function eo(i,s){if(!i||!s)return!1;const o=Rs(i,s.category),n=Rs(s,s.category);if(o===n)return!0;const r=Mt(i.source||i.provider||""),d=Mt(s.provider||""),u=Mt(i.displayName||i.name||""),l=Mt(s.name||"");return!!(r&&d&&r===d&&(!u||!l||u===l||u.includes(l)||l.includes(u)))}function Us(i,s){return`${Kl()}|${Rs(i,s)}`}function Rr(i,{contentKey:s="",category:o=""}={}){if(!Array.isArray(i)||i.length<2)return Array.isArray(i)?i.slice():[];const n=Wi(Ki),r=Wi(_s)[s];return i.map((d,u)=>{const l=n[Us(d,o)]||{},p=r&&eo(d,r)?1e3:0,y=Math.min(12,Number(l.successes)||0)*3,g=Math.min(12,Number(l.failures)||0)*7,m=l.lastFailureAt&&Date.now()-l.lastFailureAt<1e3*60*60*6?20:0;return{source:d,index:u,score:p+y-g-m}}).sort((d,u)=>u.score-d.score||d.index-u.index).map(d=>d.source)}function Wl({contentKey:i,category:s="",source:o}){if(!o)return;const n=Wi(Ki),r=Us(o,s),d=n[r]||{};if(n[r]={successes:Math.min(20,(Number(d.successes)||0)+1),failures:Math.max(0,(Number(d.failures)||0)-1),lastSuccessAt:Date.now(),updatedAt:Date.now()},Ls(Ki,Es(n,Qr)),i){const u=Wi(_s);u[i]={category:s,provider:String(o.source||o.provider||""),id:String(o.id||""),name:String(o.displayName||o.name||""),updatedAt:Date.now()},Ls(_s,Es(u,Fl))}}function Mr({category:i="",source:s}){if(!s)return;const o=Wi(Ki),n=Us(s,i),r=o[n]||{};o[n]={successes:Number(r.successes)||0,failures:Math.min(20,(Number(r.failures)||0)+1),lastFailureAt:Date.now(),updatedAt:Date.now()},Ls(Ki,Es(o,Qr))}const Ia="4e44d9029b1270a757cddc766a1bcb63";let Ba=null,_a=null,bi=null,me=null,ot=null;async function As({type:i="movie",isAnime:s=!1,isSeries:o=null,tmdbId:n,title:r="",seriesTitle:d="",originalTitle:u="",season:l=1,episode:p=1,posterPath:y="",backdropPath:g="",playerVariant:m="",seriesOverview:x="",episodeArtworkPath:T="",shortDramaEpisodes:h=[],offlinePlaybackUrl:D="",offlineMediaKind:U="file",currentTime:I=0,duration:P=0,seasonsList:R=[],maxEpisodes:F=0,roomSync:f=null}){const w=document.getElementById("player-modal");if(!w)return;let se=null;if(Wt()&&!D&&n&&l!==null&&p!==null&&l!==void 0&&p!==void 0)try{se=(await Lo()).find(e=>String(e.tmdbId)===String(n)&&Number(e.season)===Number(l)&&Number(e.episode)===Number(p))}catch{}if(w.classList.toggle("player-variant-short-drama",m==="short-drama"),Ba?.(),se||D){D&&vr();const e=await wr(n,l,p);if(!e){G("İndirilen video bulunamadı. İndirilenler listesini yenileyin.","error");return}if(D=e,se){const a=String(se.seriesTitle||d||r||se.title||"").replace(/\s*[·-]\s*\d+\.\s*Sezon\s+\d+\.\s*Bölüm.*$/i,"").trim();U=se.mediaKind||"file",o=!0,i=se.type==="anime"?"anime":"tv",s=se.type==="anime"||s,r=a,d=a,u=u||a,y=y||se.poster||"",g=g||se.backdrop||"",I=0,P=0,f=null}}const ne=!!D,re=ne&&Wt();w.classList.toggle("player-offline-playback",re);let N=!1,te=0,ve=0,Q=fs();const be=fs(),{setTimeout:et,clearTimeout:pt,setInterval:A,clearInterval:O}=be;function $e(){ve++;const e=w.querySelector("#hls-video-player"),a=e?e.paused:!0;e&&typeof e._persistProgress=="function"?e._persistProgress(!0,a):Ct(mt,ct,null,!0,!0),Q.dispose(),Q=fs();for(const t of[me,ot])try{t?.destroy()}catch{}me=ot=null;try{destroyTorrentStream()}catch{}w.querySelectorAll("video, audio").forEach(t=>{try{for(t.pause(),t.removeAttribute("src");t.firstChild;)t.removeChild(t.firstChild);t.load()}catch{}}),w.querySelectorAll("iframe").forEach(t=>{try{t.src="about:blank",t.remove()}catch{}})}bi||(bi=window.open),window.open=function(e,a,t){return typeof e=="string"&&["api.themoviedb.org","image.tmdb.org"].some(b=>e.startsWith(b))?bi.call(window,e,a,t):{closed:!0,focus:()=>{},blur:()=>{},close:()=>{},location:{href:""}}},window.onbeforeunload=function(e){document.getElementById("player-modal")&&document.getElementById("player-modal").classList.contains("hidden")};let L=Number(l)||1,q=Number(p)||1,Te=Array.isArray(R)?R:[],Ge=Number(F)||0,_e=L,gi=new Map,Gt=!1,gt=!1,Le=!!(s||i==="anime"||n&&xo(n)||Ao({id:n,title:r}));Le&&n&&(ne||br(n));const ae=typeof o=="boolean"?o:i==="tv"||i!=="movie"&&(Array.isArray(R)&&R.length>0||l&&Number(l)>1||p&&Number(p)>1),ue=(d||r||"").replace(/\s*-\s*S\d+E\d+.*$/i,"").replace(/\s*-\s*S\d+.*$/i,"").replace(/\s*[·-]\s*\d+\.\s*Sezon.*$/i,"").replace(/\s*:\s*.*$/,"").replace(/\s*\(\d{4}\).*/,"").trim(),to=document.title;let Zt=x||"",Ut="",vi=[],Pa="",Oi=[],Pt=0,Vi="",qa=0,lt=[],wi=!1;if(n&&!ne){const e=!ae&&i==="movie",a=e?`https://api.themoviedb.org/3/movie/${n}?append_to_response=credits,similar,recommendations&api_key=${Ia}&language=tr-TR`:`https://api.themoviedb.org/3/tv/${n}?append_to_response=credits,similar,recommendations&api_key=${Ia}&language=tr-TR`;fetch(a).then(t=>t.json()).then(t=>{if(!N&&t){if(!y&&t.poster_path&&(y=t.poster_path),!g&&t.backdrop_path&&(g=t.backdrop_path),Xa(),t.overview&&(Zt=t.overview),Array.isArray(t.genres)&&(vi=t.genres.map(z=>z.name)),e){if(t.runtime&&(Pt=t.runtime),t.release_date&&(Vi=t.release_date.substring(0,4)),t.vote_average&&(qa=Number(t.vote_average.toFixed(1))),t.credits&&Array.isArray(t.credits.crew)){const S=t.credits.crew.find(k=>k.job==="Director");S&&(Pa=S.name)}t.credits&&Array.isArray(t.credits.cast)&&(Oi=t.credits.cast.slice(0,10)),lt=(t.recommendations?.results?.length>0?t.recommendations.results:t.similar?.results||[]).filter(S=>S.poster_path).slice(0,12),Zs()}const c=t.recommendations?.results?.length>0?t.recommendations.results:t.similar?.results||[];c.length>0&&(lt=c.filter(z=>z.poster_path).slice(0,12),ae&&Gs()),Xs();const b=t.original_language==="ja"||Array.isArray(t.origin_country)&&t.origin_country.includes("JP"),$=Array.isArray(t.genres)&&t.genres.some(z=>z.id===16||/anim/i.test(z.name));b&&$&&(Le=!0,br(n)),ae&&Array.isArray(t.seasons)&&t.seasons.length>0&&(Te=t.seasons.filter(z=>z.season_number>0),on(),(Gt||ae)&&Nt())}}).catch(()=>{})}const Ps=ne?null:hr(n,L,q);let qe=I||(Ps?Ps.currentTime:0),Ne=!ne&&mi(n,L,q);const ct=P>0?P:i==="movie"?6600:3e3;let mt=qe,Na=!1;const Ha=e=>{[document.getElementById("btn-toggle-watched-player"),document.getElementById("btn-toggle-watched-mobile")].forEach(c=>{if(!c)return;const b=c.querySelector("span"),$=c.querySelector("[data-lucide]");b&&(b.textContent=e?"İzlendi":"İzlendi Yap"),$&&$.setAttribute("data-lucide",e?"check-circle-2":"check"),e?c.classList.add("watched-active"):c.classList.remove("watched-active")});const a=document.getElementById("btn-toggle-list");if(a){const c=a.querySelector("#list-action-label"),b=a.querySelector("[data-lucide]");c&&(c.textContent=e?"İzlendi":"Listeme Ekle"),b&&b.setAttribute("data-lucide",e?"check-circle-2":"plus"),e?a.classList.add("watched-active"):a.classList.remove("watched-active")}if(ae){const c=document.getElementById("dizisol-episodes-carousel");if(c){const b=c.querySelector(`.dizisol-ep-card[data-season="${L}"][data-episode="${q}"]`);if(b){b.classList.toggle("is-watched-card",e);const $=b.querySelector(".dizisol-ep-watch-toggle");$&&($.classList.toggle("is-watched",e),$.setAttribute("title",e?"İzlendi (Kaldırmak için tıkla)":"İzlendi Olarak İşaretle"),$.innerHTML=`
              <i data-lucide="${e?"check-circle-2":"eye"}" style="width: 13px; height: 13px;"></i>
              <span class="ep-watch-text">${e?"İzlendi":"İşaretle"}</span>
            `);const z=b.querySelector(".dizisol-ep-title");if(z){const S=z.getAttribute("data-base-title")||z.textContent.replace(/\s*✓.*$/,"");z.textContent=`${S}${e?" ✓":""}`}}}}const t=document.getElementById("btn-toggle-list");t&&ge(t)};let ja=0;const Ct=(e,a,t=null,c=!1,b=!1)=>{if(!n||ne)return;const $=Math.max(0,Math.round(e??mt??0)),z=Math.max(0,Math.round(a||ct||0));mt=$;const S=Date.now();if(!c&&S-ja<15e3)return;ja=S;const k=z>0?Math.min(100,Math.round($/z*100)):0,E=t!==null?t:Ne||k>=90;E&&!Ne&&(Ne=!0,Ha(!0)),gr({id:n,title:ue,posterPath:y,backdropPath:g,type:Le?"anime":ae?"tv":"movie",isAnime:Le,isSeries:ae,season:ae?L:void 0,episode:ae?q:void 0,currentTime:$,duration:z>0?z:ct,completed:E});try{const X={tmdbId:n,seriesTitle:ae?u||ue:void 0,title:u||ue,isSeries:!!ae,type:ae?"tv":"movie",season:ae?L:void 0,episode:ae?q:void 0};E?Io(X,k):b?Bo(X,k):_o(X,k)}catch{}};function qs(){_a&&O(_a),_a=A(()=>{const e=document.getElementById("hls-video-player");e&&!isNaN(e.currentTime)?!e.paused&&!e.seeking&&Ct(e.currentTime,e.duration,null,!1):document.visibilityState==="visible"&&Ee&&(mt+=15,Ct(mt,ct,null,!1))},15e3)}const Yi=()=>{const e=document.getElementById("hls-video-player");e&&typeof e._persistProgress=="function"?e._persistProgress(!0,!0):Ct(mt,ct,null,!0,!0)};window.addEventListener("pagehide",Yi),window.addEventListener("beforeunload",Yi);let J="dubbed",W=[],de=0;const Fa=()=>`${i}:${n||ue}:s${L}:e${q}`;let ke={dubbed:[],subtitled:[]},tt=!0,Ee=!1,Jt=!1,Qt=null,ki=0,Ns=!1,He="smooth",Si=!1,ei=!1,$i=!1,ti=0;const Ka=new Map,Wa=new Map,ii=new Map,Hs=new Map;let Xi=null,Oa=null;function Va(e){if(!f||!e||e.roomCode!==f.roomCode||String(e.mediaId)!==String(f.mediaId)||e.type!==f.type)return;if(e.action==="fullscreen-request"||e.requestFullscreen){no();return}const a=Number(e.issuedAt)||0;if(a&&a<ki)return;if(e.source&&(e.action!=="state"||!ft)&&(ft=e.source,Vs()||!Ys())){Qt=e;return}if(e.type==="tv"&&(Number(e.season)!==L||Number(e.episode)!==q)){Qt=e,Jt=!0,Ht(Number(e.season)||1,Number(e.episode)||1).finally(()=>{Jt=!1});return}const t=w.querySelector("#hls-video-player");if(!t){Qt=e;return}const c=e.action==="state",b=Number(e.time),$=Number.isFinite(b)?b-t.currentTime:0,z=()=>{try{for(let j=0;j<t.buffered.length;j+=1)if(t.buffered.start(j)<=b+.15&&t.buffered.end(j)>=b+1)return!0}catch{}return!1},S=He==="smooth",k=S&&!Ns&&c,E=k&&Number.isFinite(b)&&Math.abs($)<=120;S&&c&&(Ns=!0);const X=S?E&&Math.abs($)>.25||!c&&e.action==="seek"&&Number.isFinite(b)&&Math.abs($)>.25:!c&&Number.isFinite(b)&&Math.abs($)>.25||c&&Math.abs($)>18&&t.readyState>=HTMLMediaElement.HAVE_FUTURE_DATA&&z(),oe=typeof e.playing=="boolean"&&e.playing===t.paused&&(!c&&(!S||e.action==="play"||e.action==="pause")||k),Y=!!e.settings&&!c&&!S,H=!!(e.audioTrack&&typeof t._setAudioTrack=="function")&&!c&&!S;if(!X&&!oe&&!Y&&!H){a&&(ki=Math.max(ki,a));return}if(Jt=!0,X)try{t.currentTime=Math.max(0,b)}catch{}Y&&(it.brightness=Math.max(30,Math.min(150,Number(e.settings.brightness)||100)),it.speed=Math.max(.5,Math.min(2,Number(e.settings.speed)||1)),t.style.filter=`brightness(${it.brightness/100})`,t.playbackRate=it.speed,Number.isFinite(Number(e.settings.volume))&&(t.volume=Math.max(0,Math.min(1,Number(e.settings.volume)))),typeof e.settings.muted=="boolean"&&(t.muted=e.settings.muted)),H&&t._setAudioTrack(e.audioTrack,!0),oe&&(e.playing?t.play().catch(()=>{}):t.pause()),a&&(ki=Math.max(ki,a)),window.setTimeout(()=>{Jt=!1},120)}f&&be.on(window,"cinepulse:player-sync-remote",e=>Va(e.detail)),f?.initialSync&&window.setTimeout(()=>Va(f.initialSync),0);const it={brightness:100,speed:1};let xi=0;const Ya=[];function js(){const e=w.querySelector("#room-chat-unread"),a=w.querySelector("#room-chat-unread-cloud"),t=xi>=1,c=xi>9?"9+":String(xi);e&&(e.hidden=!t,e.textContent=c),a&&(a.hidden=!t,a.textContent=c)}function Gi(e,a=!1){if(!e?.text)return;const t=e.id||`${e.senderId||(a?"self":"guest")}:${e.sentAt||""}:${e.text}`;Ya.some(S=>S.fingerprint===t)||Ya.push({...e,fingerprint:t,mine:a});const c=w.querySelector("#room-chat-messages");if(!c||Array.from(c.children).some(S=>S.dataset?.roomChatId===t))return;c.querySelector("p")?.remove();const b=document.createElement("div");b.className=`room-chat-message${a?" mine":""}`,b.dataset.roomChatId=t;const $=document.createElement("strong");$.textContent=a?"Sen":e.nickname||"Misafir";const z=document.createElement("span");for(z.textContent=String(e.text).slice(0,240),b.append($,z),c.appendChild(b);c.children.length>60;)c.firstElementChild?.remove();c.scrollTop=c.scrollHeight}function Fs(e){if(!f)return;let a=w.querySelector("#room-chat-panel"),t=!1;a||(t=!0,a=document.createElement("aside"),a.id="room-chat-panel",a.className="room-chat-panel",a.innerHTML='<header><strong>Oda sohbeti</strong><button type="button" aria-label="Kapat">×</button></header><div id="room-chat-messages" class="room-chat-messages"><p>Oda sohbeti yalnızca bu oturumda kalır.</p></div><form><input maxlength="240" autocomplete="off" placeholder="Mesaj yaz…" /><button type="submit">Gönder</button></form>',a.querySelector("header button").onclick=()=>Fs(!1),a.querySelector("form").onsubmit=b=>{b.preventDefault();const $=a.querySelector("input"),z=$.value.trim();if(!z)return;const S=Date.now(),k=`chat-${S}-${Math.random().toString(36).slice(2,8)}`,E=window.__cinepulseDecisionRoomPresence?.selfId||"self",X=Number(w.querySelector("#hls-video-player")?.currentTime)||0;Gi({id:k,text:z,senderId:E,nickname:"Sen",sentAt:S,at:X},!0),window.dispatchEvent(new CustomEvent("cinepulse:room-chat-send",{detail:{roomCode:f.roomCode,id:k,sentAt:S,at:X,text:z}})),$.value=""},(w.querySelector("#cinema-modal-box")||w).appendChild(a),Ya.forEach(b=>Gi(b,b.mine)));const c=typeof e=="boolean"?e:t||a.classList.contains("hidden");a.classList.toggle("hidden",!c),c&&(xi=0,js(),a.querySelector("input")?.focus())}function Xa(e=null){const a=ai();if(document.title=a,!("mediaSession"in navigator)||typeof MediaMetadata>"u")return;const t=y||g,c=t?t.startsWith("http")?t:`https://image.tmdb.org/t/p/w780${t}`:"";navigator.mediaSession.metadata=new MediaMetadata({title:a,artist:ae?`${ue} · Sezon ${L}, Bölüm ${q}`:"Film",album:"",artwork:c?[{src:c,sizes:"342x513",type:"image/jpeg"},{src:c,sizes:"780x1170",type:"image/jpeg"}]:[]}),e&&(navigator.mediaSession.playbackState=e.paused?"paused":"playing")}function io(e){if(!e||!("mediaSession"in navigator)||typeof MediaMetadata>"u")return;Xa(e);const a=()=>{const c=Number(e.duration),b=Number(e.currentTime);if(Number.isFinite(c)&&c>0&&Number.isFinite(b))try{navigator.mediaSession.setPositionState({duration:c,position:Math.min(b,c),playbackRate:e.playbackRate||1})}catch{}};["play","pause","seeked","loadedmetadata"].forEach(c=>e.addEventListener(c,()=>{navigator.mediaSession.playbackState=e.paused?"paused":"playing",a()}));const t=(c,b)=>{try{navigator.mediaSession.setActionHandler(c,b)}catch{}};t("play",()=>e.play().catch(()=>{})),t("pause",()=>e.pause()),t("seekbackward",c=>{e.currentTime=Math.max(0,e.currentTime-(c.seekOffset||10))}),t("seekforward",c=>{e.currentTime=Math.min(e.duration||1/0,e.currentTime+(c.seekOffset||10))}),t("seekto",c=>{Number.isFinite(c.seekTime)&&(e.currentTime=c.seekTime)}),a()}Xa();function Ks(e){if(!f||e?.roomCode!==f.roomCode||document.fullscreenElement?.id==="hls-video-player")return;const a=w.querySelector("#player-iframe-wrapper");if(!a)return;const t=document.createElement("span");t.className="room-reaction-burst",t.textContent=e.emoji,t.style.left=`${22+Math.random()*56}%`,a.appendChild(t),window.setTimeout(()=>t.remove(),1800)}function Ws(){if(!f)return;const e=w.querySelector("#player-iframe-wrapper");if(!e||e.querySelector("#room-reaction-dock"))return;const a=document.createElement("div");a.id="room-reaction-dock",a.className="room-reaction-dock",a.innerHTML=["🎬","😂","😱","❤️"].map(t=>`<button type="button" aria-label="${t} tepki gönder">${t}</button>`).join(""),a.querySelectorAll("button").forEach(t=>{t.onclick=c=>{c.stopPropagation();const b={roomCode:f.roomCode,emoji:t.textContent,mediaId:f.mediaId,type:f.type,at:Number(w.querySelector("#hls-video-player")?.currentTime)||0};Ks(b),window.dispatchEvent(new CustomEvent("cinepulse:room-reaction",{detail:b}))}}),e.appendChild(a)}function ao(){let e=null;if(ae){const c=Ai(L);c&&q<c?e={id:n,type:"tv",season:L,episode:q+1,title:`Sonraki bölüm · S${L} B${q+1}`}:Te.some(b=>b.season_number===L+1)&&(e={id:n,type:"tv",season:L+1,episode:1,title:`Sonraki sezon · S${L+1} B1`})}e||(e={id:n,type:ae?"tv":"movie",season:L,episode:q,title:ae?"Bu bölümü yeniden izle":"Filmi yeniden izle"});const a=lt[0],t=a?{id:a.id,type:ae?"tv":"movie",season:1,episode:1,title:a.title||a.name||"Benzer yapım"}:{...e,title:"Benzer yapım hazırlanıyor"};return[{id:"next",icon:"⏭",label:e.title,card:e},{id:"similar",icon:"✨",label:t.title,card:t},{id:"close",icon:"👋",label:"Odayı kapat",card:null}]}function Zi(e){if(!f||!e||e.roomCode!==f.roomCode)return;const a=w.querySelector("#player-iframe-wrapper");if(!a)return;a.querySelector("#room-finish-overlay")?.remove();const t=e.votes||{},c=E=>Object.values(t).filter(X=>X===E).length,b=We();Oa=e;const $=Xi&&String(Xi.mediaId)===String(f.mediaId)?Xi:null,z=E=>{const X=Math.max(0,Math.floor(Number(E)||0));return`${Math.floor(X/60)} dk`},S=E=>{if(!Number.isFinite(Number(E)))return"—";const X=Math.max(0,Math.floor(Number(E)));return`${Math.floor(X/60)}:${String(X%60).padStart(2,"0")}`},k=document.createElement("section");k.id="room-finish-overlay",k.className="room-finish-overlay",k.innerHTML=`
      <div class="room-finish-panel">
        <span class="room-finish-kicker">BİRLİKTE SEÇ</span>
        <h3>${ae?"Bölüm bitti. Sırada ne var?":"Film bitti. Sırada ne var?"}</h3>
        <p>${b?"Bir seçeneğe dokun; herkeste aynı anda açılacak.":"Seçimini oylayabilirsin. Moderatör herkese açar."}</p>
        ${$?`<section class="room-watch-summary"><strong><i data-lucide="sparkles"></i> Oda özeti</strong><span><b>${$.participants||1} kişi</b><small>${z($.watchedSeconds)} birlikte</small></span><span><b>${$.topReaction?`${$.topReaction.emoji} ${$.topReaction.count}`:"—"}</b><small>en çok tepki</small></span><span><b>${S($.topTalkSecond)}</b><small>en çok konuşulan an</small></span></section>`:""}
        <div class="room-finish-options">
          ${(e.options||[]).map(E=>`<button type="button" class="room-finish-option" data-option="${E.id}">
            <b>${E.icon}</b><span>${E.label}</span><small>${b?"Herkese aç":`${c(E.id)} oy`}</small>
          </button>`).join("")}
        </div>
      </div>`,k.querySelectorAll("[data-option]").forEach(E=>{E.onclick=X=>{X.stopPropagation();const oe=(e.options||[]).find(Y=>Y.id===E.dataset.option);oe&&(b?window.dispatchEvent(new CustomEvent("cinepulse:room-finish-choice",{detail:{roomCode:f.roomCode,action:oe.id==="close"?"close":"open",card:oe.card}})):(window.dispatchEvent(new CustomEvent("cinepulse:room-finish-vote",{detail:{roomCode:f.roomCode,finishId:e.id,optionId:oe.id}})),E.classList.add("voted")))}}),a.appendChild(k)}function so(){if(!f||!We())return;const e={id:`${f.mediaId}-${Date.now()}`,roomCode:f.roomCode,options:ao(),votes:{}},a=w.querySelector("#hls-video-player");window.dispatchEvent(new CustomEvent("cinepulse:room-summary",{detail:{roomCode:f.roomCode,mediaId:f.mediaId,type:f.type,seconds:a?.duration||a?.currentTime||0}})),Zi(e),window.dispatchEvent(new CustomEvent("cinepulse:room-finish",{detail:e}))}function no(){if(!f||We())return;w.querySelector("#room-fullscreen-invite")?.remove();const a=document.createElement("button");a.id="room-fullscreen-invite",a.className="room-fullscreen-invite",a.type="button",a.textContent="Moderatör tam ekran önerdi · Aç",a.onclick=()=>{const t=w.querySelector("#hls-video-player"),c=w.querySelector("#video-iframe"),$=w.querySelector("#direct-video-wrapper")||c||t||w.querySelector("#cinema-modal-box");$?.requestFullscreen?.().catch(()=>$?.webkitRequestFullscreen?.()),a.remove()},w.appendChild(a),window.setTimeout(()=>a.remove(),9e3)}function Os(){!f?.roomCode||!We()||window.dispatchEvent(new CustomEvent("cinepulse:player-sync",{detail:{roomCode:f.roomCode,mediaId:f.mediaId,type:f.type,season:L,episode:q,action:"fullscreen-request",requestFullscreen:!0,issuedAt:Date.now()}}))}f&&(be.on(window,"cinepulse:room-finish-remote",e=>Zi(e.detail)),be.on(window,"cinepulse:room-finish-vote-remote",e=>Zi(e.detail)),be.on(window,"cinepulse:room-reaction-remote",e=>Ks(e.detail)),be.on(window,"cinepulse:room-summary-remote",e=>{const a=e.detail;!a||a.roomCode!==f.roomCode||String(a.mediaId)!==String(f.mediaId)||(Xi=a,Oa&&Zi(Oa))}),be.on(window,"cinepulse:room-chat-remote",e=>{const a=e.detail,t=a?.senderId===window.__cinepulseDecisionRoomPresence?.selfId;Gi(a,t);const c=w.querySelector("#room-chat-panel");!t&&(!c||c.classList.contains("hidden"))&&(xi+=1,js())}),be.on(window,"cinepulse:room-playback-health-remote",e=>{const a=e.detail;if(!a||a.roomCode!==f.roomCode||!We()||He!=="strict")return;Ka.set(a.senderId,a.status);const t=w.querySelector("#hls-video-player"),c=Array.from(Ka.values()).includes("buffering");c&&t&&!t.paused?(Si=!0,t.pause()):!c&&Si&&t?.paused&&(Si=!1,t.play().catch(()=>{}))}),be.on(window,"cinepulse:room-playback-progress-remote",e=>{const a=e.detail;if(!a||a.roomCode!==f.roomCode||!We()||He!=="smooth")return;Wa.set(a.senderId,a);const t=w.querySelector("#hls-video-player");if(!t||!Number.isFinite(t.currentTime))return;const c=Array.from(Wa.values()).filter(z=>Date.now()-z.reportedAt<25e3),b=c.reduce((z,S)=>Math.max(z,t.currentTime-S.time),0),$=a.time-t.currentTime;c.forEach(z=>{const S=t.currentTime-z.time;if(Math.abs(S)<45)return;const k=Hs.get(z.senderId)||0;Date.now()-k<12e3||(Hs.set(z.senderId,Date.now()),window.dispatchEvent(new CustomEvent("cinepulse:room-rhythm",{detail:{roomCode:f.roomCode,targetId:z.senderId,mediaId:f.mediaId,type:f.type,drift:S}})))}),b>=90&&!ei&&!t.paused?(ei=!0,ti=Date.now()+2500,t.pause(),G(`${a.nickname||"Katılımcı"} geride kaldı; fark büyümesin diye kısa süre bekleniyor.`,"info")):ei&&b<=12&&t.paused&&(ei=!1,ti=Date.now()+2500,t.play().catch(()=>{}),G("Katılımcı yakaladı; akıcı izleme devam ediyor.","success")),$>=90&&!ii.has(a.senderId)&&(ii.set(a.senderId,a.time),window.dispatchEvent(new CustomEvent("cinepulse:room-playback-checkpoint",{detail:{roomCode:f.roomCode,targetId:a.senderId,action:"hold",mediaId:f.mediaId,type:f.type}})))}),be.on(window,"cinepulse:room-playback-checkpoint-remote",e=>{const a=e.detail,t=window.__cinepulseDecisionRoomPresence?.selfId;if(!a||He!=="smooth"||a.roomCode!==f.roomCode||a.targetId!==t||String(a.mediaId)!==String(f.mediaId)||a.type!==f.type)return;const c=w.querySelector("#hls-video-player");c&&(ti=Date.now()+2500,a.action==="hold"&&!c.paused?($i=!0,c.pause(),G("Moderatör geride kaldı; sana yaklaşana kadar kısa süre bekleniyor.","info")):a.action==="resume"&&$i&&c.paused&&($i=!1,c.play().catch(()=>{}),G("Moderatör yakaladı; akıcı izleme devam ediyor.","success")))}),be.on(window,"cinepulse:room-rhythm-remote",e=>{const a=e.detail,t=window.__cinepulseDecisionRoomPresence?.selfId;if(!a||a.roomCode!==f.roomCode||a.targetId!==t||String(a.mediaId)!==String(f.mediaId)||a.type!==f.type)return;const c=w.querySelector("#player-iframe-wrapper");if(!c)return;c.querySelector("#room-rhythm-card")?.remove();const b=Math.round(Math.abs(Number(a.drift)||0)),$=document.createElement("aside");$.id="room-rhythm-card",$.className="room-rhythm-card",$.innerHTML=Number(a.drift)>0?`<i data-lucide="clock-3"></i><span><b>${Math.ceil(b/60)} dk geridesin</b><small>Akıcı izlemeye devam et; oda seni bekliyor.</small></span>`:'<i data-lucide="clock-3"></i><span><b>Öndesin</b><small>Diğer izleyici sana yaklaşıyor.</small></span>',c.appendChild($),ge($),window.setTimeout(()=>$.remove(),8500)}),be.on(window,"cinepulse:room-playback-finished-remote",e=>{const a=e.detail;if(!a||He!=="smooth"||a.roomCode!==f.roomCode||String(a.mediaId)!==String(f.mediaId)||a.type!==f.type)return;const t=a.type==="tv"?`S${a.season} B${a.episode}`:"filmi";G(`🎬 ${a.nickname||"Bir katılımcı"} ${t} bitirdi. Sen akıcı izlemeye devam ediyorsun.`,"info")}),be.on(window,"cinepulse:decision-room-close-player",e=>{e.detail?.roomCode===f.roomCode&&Ba?.()}));function Ai(e){const a=Te.find(t=>t.season_number===e);return a&&a.episode_count?a.episode_count:Ge>0&&e===L?Ge:0}function ai(){return ae?`${ue} • S${L} B${q}`:ue}function at(e){if(!e)return"";const a=t=>typeof t=="string"&&t.startsWith("/api/")?Xe(t):t||"";if(typeof e.getUrl=="function")try{const t=e.getUrl();if(t)return a(t)}catch{}return a(e.streamUrl||e.url||e.originalEmbedUrl||"")}let ft=null;function Ji(e){const a=at(e);return!!(e?.isDirectVideo||e?.isHls||a&&!a.startsWith("magnet:")&&(a.includes(".m3u8")||a.includes(".txt")||a.includes(".mp4")||a.includes(".mkv")||a.includes("mkv_stream")||a.includes(":4000/torrent/")))}function vt(e){if(!Array.isArray(e)||e.length===0||!f)return 0;const a=e.findIndex(Ji);return a>=0?a:0}function We(){const e=window.__cinepulseDecisionRoomPresence;return!f||!e||e.roomCode!==f.roomCode||e.isHost!==!1}function It(){return We()?!0:(G("Bu odada kaynak ve bölüm kontrolü moderatörde.","info"),!1)}function Qi(e=W[de]){return e?{category:J,id:String(e.id||""),provider:String(e.source||""),name:String(e.displayName||e.name||""),quality:String(e.quality||"")}:null}function Ga(e,a){if(!e||!a)return!1;const t=E=>String(E||"").trim().toLocaleLowerCase("tr-TR"),c=t(e.id),b=t(a.id);if(c&&b&&c===b||eo(e,a))return!0;const $=t(e.source),z=t(a.provider),S=t(e.displayName||e.name),k=t(a.name);return $||z?!!($&&z&&$===z&&(!k||S===k)):!!(S&&k&&S===k)}function ea(){const e=Qi();if(!f?.roomCode||!e)return;const a=w.querySelector("#hls-video-player");window.dispatchEvent(new CustomEvent("cinepulse:player-sync",{detail:{roomCode:f.roomCode,mediaId:f.mediaId,type:f.type,season:L,episode:q,action:"source",source:e,audioTrack:a?._currentAudioTrack||null,settings:{...it,volume:a?.volume??1,muted:!!a?.muted},time:Number.isFinite(a?.currentTime)?a.currentTime:0,playing:!!(a&&!a.paused),issuedAt:Date.now()}}))}function Vs(){if(!f||!ft)return!1;const e=[ft.category,"dubbed","subtitled"].filter((a,t,c)=>(a==="dubbed"||a==="subtitled")&&c.indexOf(a)===t);for(const a of e){const t=ke[a]||[],c=t.findIndex($=>Ga($,ft));if(c<0)continue;const b=J!==a||!Ga(W[de],ft);return J=a,W=t,de=c,Ee=!0,document.getElementById("tab-dubbed")?.classList.toggle("active",a==="dubbed"),document.getElementById("tab-subtitled")?.classList.toggle("active",a==="subtitled"),st(),Be(),je(),b&&Ie(),b}return!1}function Ys(){return ft?["dubbed","subtitled"].some(e=>(ke[e]||[]).some(a=>Ga(a,ft))):!1}function Xs(){const e=document.getElementById("dizisol-genre-chips");e&&Array.isArray(vi)&&vi.length>0&&(e.innerHTML=vi.map(c=>`<span class="dizisol-genre-chip">${c}</span>`).join(""));const a=document.getElementById("dizisol-overview");a&&(ae?Ut&&(a.textContent=Ut):Zt&&(a.textContent=Zt));const t=document.querySelector(".dizisol-ep-badge");if(t)if(ae)t.textContent=`Sezon ${L} • Bölüm ${q}`;else{const c=Pt?`${Math.floor(Pt/60)}s ${Pt%60}dk`:"",b=Vi||"";t.textContent=["Film",b,c].filter(Boolean).join(" • ")}}function Gs(){const e=document.getElementById("dizisol-similar-section");if(!e)return;if(!lt||lt.length===0){e.innerHTML="";return}const a=lt.map(t=>{const c=t.poster_path?`https://image.tmdb.org/t/p/w342${t.poster_path}`:"",b=t.vote_average?t.vote_average.toFixed(1):"",$=(t.first_air_date||t.release_date||"").substring(0,4),z=t.name||t.title||"";return`
        <div class="player-sim-card" data-sim-id="${t.id}" data-sim-type="tv" data-sim-title="${z}" title="${z} • İncele / İzle">
          <div class="player-sim-poster-box">
            ${c?`<img src="${c}" alt="${z}" class="player-sim-poster" loading="lazy" />`:""}
            <div class="player-sim-play-hover">
              <i data-lucide="play" style="width:24px;height:24px;fill:#f59e0b;color:#f59e0b;"></i>
            </div>
            ${b?`<span class="player-sim-badge">★ ${b}</span>`:""}
          </div>
          <div class="player-sim-info">
            <span class="player-sim-title">${z}</span>
            ${$?`<span class="player-sim-year">${$}</span>`:""}
          </div>
        </div>
      `}).join("");e.innerHTML=`
      <div class="dizisol-seasons-header" style="margin-top: 2rem; margin-bottom: 0.85rem;">
        <h4 style="display:flex; align-items:center; gap: 8px; font-size: 1.05rem; font-weight: 800; letter-spacing: 0.04em; color: #fff;">
          <i data-lucide="sparkles" style="width:16px;height:16px;color:#f59e0b;"></i>
          BENZER YAPIMLAR & ÖNERİLER
        </h4>
        <span class="player-sim-count" style="font-size: 0.8rem; color: #94a3b8; font-weight: 600;">${lt.length} Yapım</span>
      </div>
      <div class="player-sim-rail" style="display:flex; gap:1rem; overflow-x:auto; padding-bottom:0.75rem; scrollbar-width:none;">
        ${a}
      </div>
    `,ge(e),e.querySelectorAll(".player-sim-card").forEach(t=>{t.addEventListener("click",c=>{c.preventDefault();const b=t.getAttribute("data-sim-id"),$=t.getAttribute("data-sim-type")||"tv";b&&(window.location.hash=`#/${$}/${b}`)})})}function Zs(){if(ae){Gs();return}const e=document.getElementById("dizisol-movie-section");if(!e)return;const a=Pt?`${Math.floor(Pt/60)} sa ${Pt%60} dk`:"",t=Oi&&Oi.length>0?Oi.map(b=>{const $=b.profile_path?`https://image.tmdb.org/t/p/w185${b.profile_path}`:"https://image.tmdb.org/t/p/w185/null";return`
            <div class="player-movie-cast-chip" title="${b.name} (${b.character||""})">
              <img src="${$}" alt="${b.name}" class="player-cast-avatar" onerror="this.onerror=null; this.style.display='none';" />
              <div class="player-cast-meta">
                <span class="player-cast-name">${b.name}</span>
                ${b.character?`<span class="player-cast-role">${b.character}</span>`:""}
              </div>
            </div>
          `}).join(""):"",c=lt&&lt.length>0?lt.map(b=>{const $=b.poster_path?`https://image.tmdb.org/t/p/w342${b.poster_path}`:"",z=b.vote_average?b.vote_average.toFixed(1):"",S=(b.release_date||"").substring(0,4);return`
            <div class="player-sim-card" data-sim-id="${b.id}" data-sim-title="${b.title||""}" title="${b.title||""} • İzle">
              <div class="player-sim-poster-box">
                ${$?`<img src="${$}" alt="${b.title||""}" class="player-sim-poster" loading="lazy" />`:""}
                <div class="player-sim-play-hover">
                  <i data-lucide="play" style="width:24px;height:24px;fill:#fff;color:#fff;"></i>
                </div>
                ${z?`<span class="player-sim-badge">★ ${z}</span>`:""}
              </div>
              <div class="player-sim-info">
                <span class="player-sim-title">${b.title||""}</span>
                ${S?`<span class="player-sim-year">${S}</span>`:""}
              </div>
            </div>
          `}).join(""):"";e.innerHTML=`
      <!-- Movie Quick Meta Pills Bar -->
      <div class="player-movie-meta-bar">
        ${Pa?`
          <div class="player-movie-director-tag">
            <span class="meta-tag-label">YÖNETMEN:</span>
            <span class="meta-tag-val">${Pa}</span>
          </div>
        `:""}
        ${a?`
          <div class="player-movie-pill">
            <i data-lucide="clock" style="width:13px;height:13px;color:#f59e0b"></i>
            <span>${a}</span>
          </div>
        `:""}
        ${qa>0?`
          <div class="player-movie-pill highlight">
            <i data-lucide="star" style="width:13px;height:13px;color:#eab308;fill:#eab308"></i>
            <span>${qa} / 10</span>
          </div>
        `:""}
        ${Vi?`
          <div class="player-movie-pill">
            <i data-lucide="calendar" style="width:13px;height:13px;color:#60a5fa"></i>
            <span>${Vi}</span>
          </div>
        `:""}
      </div>

      <!-- Cast Chips Rail -->
      ${t?`
        <div class="player-movie-block">
          <div class="player-movie-block-header">
            <h4>OYUNCULAR & EKİP</h4>
          </div>
          <div class="player-movie-cast-rail">
            ${t}
          </div>
        </div>
      `:""}

      <!-- Similar Movies Rail -->
      ${c?`
        <div class="player-movie-block">
          <div class="player-movie-block-header">
            <h4>BENZER FİLMLER & ÖNERİLER</h4>
            <span class="player-sim-count">${lt.length} Film</span>
          </div>
          <div class="player-sim-carousel">
            ${c}
          </div>
        </div>
      `:""}
    `,e.querySelectorAll(".player-sim-card").forEach(b=>{b.addEventListener("click",()=>{const $=b.getAttribute("data-sim-id"),z=b.getAttribute("data-sim-title");$&&As({type:"movie",tmdbId:parseInt($,10),title:z,currentTime:0})})}),ge(e)}async function Js(e,a){if(m==="short-drama"||!ae||!n)return;const t=document.getElementById("dizisol-overview");let c=gi.get(e);if((!c||c.length===0)&&(c=await es(e)),N||e!==L||a!==q)return;const b=c?c.find($=>$.episode_number===a):null;if(b&&b.overview&&b.overview.trim().length>0){Ut=b.overview.trim(),t&&(t.textContent=Ut);return}try{const $=await fetch(`https://api.themoviedb.org/3/tv/${n}/season/${e}/episode/${a}?api_key=${Ia}&language=en-US`);if($&&$.ok){const z=await $.json();if(z&&z.overview&&z.overview.trim().length>0){const S=await To(z.overview.trim());if(N||e!==L||a!==q)return;if(S&&S.trim()){Ut=S.trim(),t&&(t.textContent=Ut);return}}}}catch{}b&&b.name&&!b.name.toLowerCase().includes("bölüm")?t&&(t.textContent=`${b.name} - Bölüm özeti hazırlanıyor...`):Zt&&t&&(t.textContent=Zt)}function si(){const e=W[de];return e?e.displayName||e.name||"Sunucu":tt?"Kaynak aranıyor...":"Kaynak Bulunamadı"}function Be(){const e=document.getElementById("active-source-chip-label");e&&(e.textContent=`Kaynak: ${si()} (Değiştir)`);const a=document.getElementById("player-top-source-chip");if(a){const t=si(),c=a.querySelector("span");c&&(c.textContent=t),a.title=`Aktif Yayın Hattı: ${t}`,W&&W.length>0&&W[de]&&(a.style.display="inline-flex")}wi&&je(),mo(),f&&aa(),Ze()}let wt=!1,kt=null,qt=null,Oe={percent:0,loaded:0,status:""},Qs=0;function en(e){try{window.CinePulseNative?.startDownloadNotification?.(String(e||"CinePulse indirmesi"))}catch{}}function tn(e,a){try{const t=Date.now();if(t-Qs<500&&Number(a?.percent)<100)return;Qs=t,window.CinePulseNative?.updateDownloadNotification?.(String(e||"CinePulse indirmesi"),Number(a?.percent)||0,String(a?.status||"İndiriliyor…"),Number(a?.loaded)||0,Number(a?.total)||0)}catch{}}function ta(e,a){try{window.CinePulseNative?.finishDownloadNotification?.(!!e,String(a||""))}catch{}}function ia(e=null,a=null){return e!==null&&a!==null&&e!==void 0&&a!==void 0?`${n}_s${e}_e${a}`:String(n)}function ro(e){if(!e)return!1;const a=at(e);return a?e.isDirectVideo||e.isHls||e.isTorrent||/\.(?:m3u8|mp4|m4v|webm|mkv)(?:[?#]|$)/i.test(a)||a.includes("/api/hls_proxy")||a.includes("/api/snx")||a.includes("/api/dzs")||a.includes("/api/rtv")||a.includes("/api/czm")||a.includes("/api/jet")?!0:/^https?:\/\//i.test(a)&&!/^https?:\/\/[^/]+\/?$/i.test(a):!1}function Za(){const e=[],a=new Set,t=(c,b=null)=>{if(!c)return;const $=at(c);!$||a.has($)||ro(c)&&(a.add($),e.push({server:c,streamUrl:$,displayName:c.displayName||c.name||"Yayın Hattı",isDirectVideo:!!(c.isDirectVideo||/\.(?:mp4|m4v|webm|mkv)(?:[?#]|$)/i.test($)),isHls:!!(c.isHls||$.includes(".m3u8")||$.includes("/api/hls_proxy")),isTorrent:!!(c.isTorrent||$.startsWith("magnet:")),category:b||c.category||J}))};t(W[de]);for(const c of W||[])t(c);for(const c of ke?.dubbed||[])t(c,"dubbed");for(const c of ke?.subtitled||[])t(c,"subtitled");return e}function oo(){const e=Za();return e.find(t=>t.isDirectVideo&&!t.isHls)||e[0]||null}async function Ze(){const e=w.querySelector("#btn-player-download"),a=ia(ae?L:null,ae?q:null),t=wt&&qt===a;if(e&&t){const $=e.querySelector("span"),z=w.querySelector("#player-download-progress"),S=Oe,k=Number(S.total)>0,E=k?Math.floor(S.loaded/S.total*100):0,X=k?S.status==="Tamamlandı"?100:Math.min(99,E):0;e.dataset.downloading="true",e.classList.add("is-downloading"),e.classList.remove("is-downloaded");const oe=k?`%${X}`:S.loaded>0?Vt(S.loaded):"…";if($&&($.textContent=oe),e.title=S.status||"İndirme başlatılıyor…",z){z.hidden=!1,z.classList.toggle("is-indeterminate",!k&&S.loaded>0);const Y=z.querySelector("[data-download-status]"),H=z.querySelector("[data-download-amount]"),j=z.querySelector("[data-download-speed]"),B=z.querySelector("[data-download-bar]");Y&&(Y.textContent=S.status||"İndirme başlatılıyor…"),H&&(H.textContent=k?`${Vt(S.loaded)} / ${Vt(S.total)} · %${X}`:`${Vt(S.loaded)} alındı`),j&&(j.textContent=S.speedBytesPerSecond>0?`${Vt(S.speedBytesPerSecond)}/sn`:"Hız hesaplanıyor…"),B&&(B.style.width=k?`${X}%`:"")}ge(e)}const c=t?!1:await bs(n,ae?L:null,ae?q:null);if(N)return;if(e&&!t){const $=w.querySelector("#player-download-progress");$&&($.hidden=!0);const z=e.querySelector("span");if(c){e.dataset.downloaded="true",e.classList.add("is-downloaded"),e.classList.remove("is-downloading"),e.title="Bu bölüm cihaza indirildi (İndirilenler menüsünden internetsiz izleyebilirsiniz)",z&&(z.textContent="İndirildi");const S=e.querySelector("i");S&&S.setAttribute("data-lucide","check-circle-2")}else{delete e.dataset.downloaded,delete e.dataset.downloading,e.classList.remove("is-downloaded","is-downloading"),e.title="Bölümü indir / çevrimdışı kaydet",z&&(z.textContent="İndir");const S=e.querySelector("i");S&&S.setAttribute("data-lucide","download")}ge(e)}const b=w.querySelectorAll(".dizisol-ep-download-btn");for(const $ of b){const z=parseInt($.getAttribute("data-season"),10),S=parseInt($.getAttribute("data-episode"),10),k=ia(z,S),E=await bs(n,z,S);$.isConnected&&(wt&&qt===k?($.classList.add("is-downloading"),$.classList.remove("is-downloaded"),$.innerHTML=`<span style="font-size:0.6rem;font-weight:800;color:#38bdf8;">%${Oe.percent}</span>`):E?($.classList.add("is-downloaded"),$.classList.remove("is-downloading"),$.innerHTML='<i data-lucide="check-circle-2" style="width:13px;height:13px;color:#fff;"></i>'):($.classList.remove("is-downloaded","is-downloading"),$.innerHTML='<i data-lucide="download" style="width:13px;height:13px;"></i>'),ge($))}}async function lo(e=null,a=null){const t=ae&&(e!==null||a!==null||L!==null),c=t?e!==null?e:L:null,b=t?a!==null?a:q:null,$=ia(c,b),z=w.querySelector("#player-download-popover"),S=w.querySelector("#download-popover-body");if(!z||!S)return;z.classList.remove("hidden");const k=!t||c===L&&b===q;let E=k?Za():[];if(!k||E.length===0){S.innerHTML=`
        <div class="drawer-loading" style="padding: 2.5rem 1rem; text-align: center;">
          <div class="drawer-spinner" style="margin: 0 auto 1rem;"></div>
          <p style="color:#94a3b8; font-size:0.9rem;">${c}. Sezon ${b}. Bölüm için indirme kaynakları taranıyor...</p>
        </div>
      `;try{const B=await Ra({titles:[ue,d,u].filter(Boolean),seriesTitle:ue,originalTitle:u,season:c,episode:b,tmdbId:n,isDub:J==="dubbed"});if(Array.isArray(B)&&B.length>0){const he=B.map(le=>({server:le,streamUrl:at(le),displayName:le.displayName||le.name||"DS 1080p",isDirectVideo:!!le.isDirectVideo,isHls:!!le.isHls,category:J})).filter(le=>le.streamUrl),ie=new Set(E.map(le=>le.streamUrl));E.push(...he.filter(le=>!ie.has(le.streamUrl)))}}catch{}}if(E.length===0&&k){const B=oo();B&&E.push(B)}const X=await bs(n,c,b),oe=t?`${ue} · ${c}. Sezon ${b}. Bölüm`:ue,Y=t?`${ue}_S${String(c).padStart(2,"0")}E${String(b).padStart(2,"0")}.mp4`:`${ue}.mp4`;let H=0;const j=()=>{const B=E[H]||E[0],he=wt&&qt===$;S.innerHTML=`
        <div class="dl-modal-header-card">
          <div class="dl-modal-art">
            ${g||y?`<img src="${g||y}" alt="${oe}" />`:'<i data-lucide="film"></i>'}
          </div>
          <div class="dl-modal-meta">
            <h4>${oe}</h4>
            <div class="dl-modal-tags">
              <span class="dl-tag-badge dl-badge-res">1080p Full HD</span>
              <span class="dl-tag-badge dl-badge-cat">${J==="dubbed"?"🇹🇷 Türkçe Dublaj":"💬 Türkçe Altyazı"}</span>
              ${X?'<span class="dl-tag-badge dl-badge-ready"><i data-lucide="check-circle-2" style="width:12px;height:12px"></i> İndirildi</span>':""}
            </div>
          </div>
        </div>

        ${X?`
          <div class="dl-downloaded-box">
            <div class="dl-box-icon"><i data-lucide="shield-check" style="width:24px;height:24px;color:#10b981"></i></div>
            <div class="dl-box-text">
              <strong>Bu içerik cihazınızda çevrimdışı kayıtlı!</strong>
              <p>İnternet bağlantınız olmasa dahi kesintisiz olarak izleyebilirsiniz.</p>
            </div>
          </div>
          <div class="dl-card-actions" style="display:grid; grid-template-columns: 1fr 1fr; gap:0.6rem; margin-top: 0.5rem;">
            <button type="button" class="btn-primary dl-btn-play-offline" id="btn-dl-play-offline" style="padding:0.75rem 1rem; border-radius:12px; display:flex; align-items:center; justify-content:center; gap:0.5rem; font-weight:700;">
              <i data-lucide="play" style="width:16px;height:16px;fill:currentColor"></i>
              <span>İnternetsiz Oynat</span>
            </button>
            <button type="button" class="btn-secondary dl-btn-delete-offline" id="btn-dl-delete-offline" style="padding:0.75rem 1rem; border-radius:12px; display:flex; align-items:center; justify-content:center; gap:0.5rem; color:#ef4444; border-color:rgba(239,68,68,0.3); font-weight:700;">
              <i data-lucide="trash-2" style="width:16px;height:16px"></i>
              <span>Cihazdan Sil</span>
            </button>
          </div>
        `:""}

        ${E.length>1?`
          <div class="dl-stream-selector-group">
            <label class="dl-selector-label"><i data-lucide="server" style="width:13px;height:13px"></i> Yayın / İndirme Hattı:</label>
            <div class="dl-stream-chips">
              ${E.map((ie,le)=>`
                <button type="button" class="dl-stream-chip ${le===H?"active":""}" data-stream-idx="${le}">
                  ${ie.displayName||`Hat ${le+1}`}
                  ${ie.isDirectVideo?" • MP4":""}
                </button>
              `).join("")}
            </div>
          </div>
        `:""}

        ${!B&&!X?`
          <div class="dl-no-stream-warning">
            <i data-lucide="alert-circle" style="width:20px;height:20px;color:#f59e0b"></i>
            <p>Bu bölüm için şu anda doğrudan indirilebilir hat taranıyor. Lütfen birkaç saniye sonra tekrar deneyin veya oynatıcıdan başka bir hat seçin.</p>
          </div>
        `:""}

        ${B?`
          <div class="dl-options-container">
            <!-- OPTION 1: CİHAZA İNDİR (1DM / ADM / TARAYICI) -->
            <div class="dl-option-card">
              <div class="dl-card-icon-wrap" style="background:rgba(59,130,246,0.15); color:#60a5fa; border:1px solid rgba(59,130,246,0.3);">
                <i data-lucide="folder-down" style="width:20px;height:20px"></i>
              </div>
              <div class="dl-card-content">
                <h5>Cihaz Hafızasına İndir (/Download)</h5>
                <p>VLC, MX Player, 1DM, ADM veya telefon tarayıcınız ile doğrudan cihaz hafızasına kaydeder. Galeride görünür.</p>
                <div class="dl-card-actions">
                  <button type="button" class="btn-primary dl-btn-native-download" id="btn-dl-native-start" style="padding:0.55rem 1rem; border-radius:10px; display:inline-flex; align-items:center; gap:0.4rem; font-weight:700; background:linear-gradient(135deg,#2563eb,#1d4ed8);">
                    <i data-lucide="download" style="width:14px;height:14px"></i>
                    <span>Cihaza İndir</span>
                  </button>
                  <button type="button" class="btn-secondary dl-btn-copy-url" id="btn-dl-copy-link" style="padding:0.55rem 0.85rem; border-radius:10px; display:inline-flex; align-items:center; gap:0.35rem; font-size:0.78rem;">
                    <i data-lucide="copy" style="width:13px;height:13px"></i>
                    <span>Bağlantıyı Kopyala</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- OPTION 2: UYGULAMA İÇİ ÇEVRİMDIŞI İNDİR -->
            <div class="dl-option-card ${X?"is-disabled-card":""}">
              <div class="dl-card-icon-wrap" style="background:rgba(16,185,129,0.15); color:#34d399; border:1px solid rgba(16,185,129,0.3);">
                <i data-lucide="cloud-download" style="width:20px;height:20px"></i>
              </div>
              <div class="dl-card-content">
                <h5>Uygulama İçi Çevrimdışı İndir</h5>
                <p>CinePulse içinde saklar. İnternetiniz olmadığında 'İndirilenler' sekmesinden internetsiz izleyebilirsiniz.</p>
                
                ${he?`
                  <div class="dl-progress-box">
                    <div class="dl-progress-info">
                      <span>İndiriliyor: %${Oe.percent}</span>
                      <span>${Oe.loaded>0?Vt(Oe.loaded):""}</span>
                    </div>
                    <div class="dl-progress-track">
                      <div class="dl-progress-bar" style="width: ${Oe.percent}%;"></div>
                    </div>
                    <button type="button" class="dl-btn-cancel" id="btn-dl-cancel-download">
                      <i data-lucide="x" style="width:13px;height:13px"></i> İndirmeyi İptal Et
                    </button>
                  </div>
                `:X?`
                  <span class="dl-status-downloaded-label"><i data-lucide="check" style="width:13px;height:13px"></i> Zaten İndirildi</span>
                `:`
                  <button type="button" class="btn-primary dl-btn-offline-start" id="btn-dl-offline-start" style="padding:0.55rem 1rem; border-radius:10px; display:inline-flex; align-items:center; gap:0.4rem; font-weight:700; background:linear-gradient(135deg,#059669,#10b981);">
                    <i data-lucide="smartphone" style="width:14px;height:14px"></i>
                    <span>Uygulama İçi İndir</span>
                  </button>
                `}
              </div>
            </div>
          </div>
        `:""}
      `,ge(S),S.querySelectorAll(".dl-stream-chip").forEach(ie=>{ie.addEventListener("click",()=>{H=parseInt(ie.getAttribute("data-stream-idx"),10)||0,j()})}),S.querySelector("#btn-dl-play-offline")?.addEventListener("click",async()=>{z.classList.add("hidden");try{const ie=await wr(n,c,b);if(!ie)throw new Error("İndirilen video açılamadı.");As({type:t?"tv":"movie",tmdbId:n,title:oe,seriesTitle:ue,season:c||1,episode:b||1,posterPath:y,backdropPath:g,offlinePlaybackUrl:ie,offlineMediaKind:"hls"})}catch(ie){G(ie?.message||"İndirilen içerik açılamadı.","error")}}),S.querySelector("#btn-dl-delete-offline")?.addEventListener("click",async()=>{window.confirm(`“${oe}” cihazdan silinsin mi?`)&&(await Eo(n,c,b),G("İndirilen içerik silindi.","success"),Ze(),j())}),S.querySelector("#btn-dl-native-start")?.addEventListener("click",async()=>{if(B)try{const ie=await gs(B.server||{streamUrl:B.streamUrl})||B.server,le=at(ie)||B.streamUrl;if(!le||le.startsWith("magnet:"))throw new Error("Bu kaynak doğrudan dosya indirmeyi desteklemiyor.");G("📥 İndirme başlatılıyor...","info"),Ro(le,Y)}catch(ie){G(ie?.message||"Kaynak indirme bağlantısına çözümlenemedi.","error")}}),S.querySelector("#btn-dl-copy-link")?.addEventListener("click",async()=>{if(B)try{const ie=typeof B.streamUrl=="string"&&B.streamUrl.startsWith("/api/")?Xe(B.streamUrl):B.streamUrl;await navigator.clipboard.writeText(ie),G("📋 İndirme bağlantısı kopyalandı! 1DM, ADM veya VLC uygulamasına yapıştırabilirsiniz.","success")}catch{G("Bağlantı kopyalanamadı.","error")}}),S.querySelector("#btn-dl-offline-start")?.addEventListener("click",async()=>{if(B){if(wt){G("Şu anda başka bir indirme devam ediyor.","info");return}wt=!0,qt=$,kt=new AbortController,Oe={percent:1,loaded:0,status:"Başlatılıyor..."},en(oe),Ze(),j(),G(`🚀 Çevrimdışı indirme başladı: ${oe}`,"info");try{const ie=await gs(B.server||{streamUrl:B.streamUrl})||B.server,le=at(ie)||B.streamUrl;if(!le||le.startsWith("magnet:"))throw new Error("Bu kaynak uygulama içi indirme için doğrudan video sunmuyor.");await kr({tmdbId:n,type:t?"tv":"movie",title:oe,seriesTitle:t?ue:"",poster:y,backdrop:g,season:c,episode:b,streamUrl:le},Ae=>{Oe=Ae,tn(oe,Ae);const V=S.querySelector(".dl-progress-bar"),ze=S.querySelector(".dl-progress-info span:first-child"),K=S.querySelector(".dl-progress-info span:last-child");V&&(V.style.width=`${Ae.percent}%`),ze&&(ze.textContent=`İndiriliyor: %${Ae.percent}`),K&&Ae.loaded>0&&(K.textContent=Vt(Ae.loaded)),Ze()},kt.signal),ta(!0,"Çevrimdışı izlemek için hazır"),G(`🎉 “${oe}” başarıyla cihaza indirildi! 'İndirilenler' sekmesinden internetsiz izleyebilirsiniz.`,"success")}catch(ie){ta(!1,ie?.message==="İndirme iptal edildi"?"İndirme iptal edildi":ie?.message||"İndirme tamamlanamadı"),ie.message!=="İndirme iptal edildi"?G(ie?.message||"İndirme tamamlanamadı. Başka bir hat deneyin.","error"):G("İndirme iptal edildi.","info")}finally{wt=!1,qt=null,kt=null,Ze(),j()}}}),S.querySelector("#btn-dl-cancel-download")?.addEventListener("click",()=>{kt&&kt.abort()})};j()}async function co(){const e=ae?L:null,a=ae?q:null,t=ia(e,a);if(wt){G("Bir indirme zaten devam ediyor.","info");return}wt=!0,qt=t,kt=new AbortController,Oe={percent:0,loaded:0,total:0,speedBytesPerSecond:0,updatedAt:Date.now(),status:"Kaynak aranıyor..."},en(ai()),Ze(),G(`“${ai()}” için indirme başlatılıyor…`,"info");let c=!1,b=null;try{let $=Za();if($.length===0&&ae)try{$=(await Ra({titles:[ue,d,u].filter(Boolean),seriesTitle:ue,originalTitle:u,season:e,episode:a,tmdbId:n,isDub:J==="dubbed"})||[]).map(E=>({server:E,streamUrl:at(E),displayName:E.displayName||E.name||"Dizisol",isDirectVideo:!!E.isDirectVideo,isHls:!!E.isHls,category:J})).filter(E=>E.streamUrl)}catch{}const z=$.filter(k=>k&&!k.isTorrent).filter((k,E,X)=>X.findIndex(oe=>oe.streamUrl===k.streamUrl)===E);if(z.length===0)throw new Error("Bu bölüm için indirilebilir yayın bulunamadı.");let S=!1;for(const k of z.slice(0,5)){if(kt.signal.aborted)throw new Error("İndirme iptal edildi");try{Oe={...Oe,status:`${k.displayName||"Kaynak"} deneniyor...`},Ze();const X=k.server===W[de]?k.server:await gs(k.server||{streamUrl:k.streamUrl})||k.server,oe=at(X)||k.streamUrl;if(!oe||oe.startsWith("magnet:"))throw new Error("Torrent kaynağı doğrudan indirilemez.");await kr({tmdbId:n,type:ae?"tv":"movie",title:ae?`${ue} · ${e}. Sezon ${a}. Bölüm`:ue,seriesTitle:ae?ue:"",poster:y,backdrop:g,season:e,episode:a,streamUrl:oe},Y=>{const H=Oe,j=Date.now(),B=Math.max(.1,(j-(H.updatedAt||j))/1e3),ie=Math.max(0,Number(Y.loaded||0)-Number(H.loaded||0))/B;Oe={...Y,speedBytesPerSecond:ie>0?H.speedBytesPerSecond?H.speedBytesPerSecond*.65+ie*.35:ie:H.speedBytesPerSecond,updatedAt:j},tn(ai(),Oe),(Number(Y.loaded)>0||Number(Y.percent)>5)&&(S=!0),Ze()},kt.signal),c=!0,ta(!0,"Çevrimdışı izlemek için hazır"),G(`“${ai()}” indirildi. İndirilenler bölümünden çevrimdışı izleyebilirsin.`,"success");break}catch(E){if(E?.message==="İndirme iptal edildi")throw E;if(b=E,S)break}}if(!c)throw b||new Error("Bu kaynaklardan indirilebilir video alınamadı.")}catch($){ta(!1,$?.message==="İndirme iptal edildi"?"İndirme iptal edildi":$?.message||"İndirme tamamlanamadı"),$?.message!=="İndirme iptal edildi"&&G($?.message||"İndirme başlatılamadı. Kaynak indirilebilir biçimde değil.","error")}finally{wt=!1,qt=null,kt=null,Ze()}}function uo(){const e=document.getElementById("tab-dubbed-count"),a=document.getElementById("tab-subtitled-count");e&&(e.textContent=String(ke.dubbed?.length||0)),a&&(a.textContent=String(ke.subtitled?.length||0))}function St(e){const a=document.getElementById("player-sources-popover");a&&(wi=typeof e=="boolean"?e:!wi,wi?(a.classList.remove("hidden"),je()):a.classList.add("hidden"))}function je(){const e=document.getElementById("sources-popover-list");if(!e)return;const a=document.getElementById("sources-tab-dubbed"),t=document.getElementById("sources-tab-subtitled"),c=document.getElementById("sources-cat-dubbed-count"),b=document.getElementById("sources-cat-subtitled-count"),$=ke?.dubbed||[],z=ke?.subtitled||[];if(c&&(c.textContent=$.length?`(${$.length})`:"(0)"),b&&(b.textContent=z.length?`(${z.length})`:"(0)"),a&&(a.classList.toggle("active",J==="dubbed"),a.onclick=S=>{if(S.preventDefault(),S.stopPropagation(),J!=="dubbed"&&It()){J="dubbed",Ve=0;try{localStorage.setItem("cp_preferred_category","dubbed")}catch{}$e(),W=ke.dubbed||[],de=vt(W),Ee=W.length>0,Be(),je(),Ie(),G("🇹🇷 Türkçe Dublaj kaynaklarına geçildi.","info")}}),t&&(t.classList.toggle("active",J==="subtitled"),t.onclick=S=>{if(S.preventDefault(),S.stopPropagation(),J!=="subtitled"&&It()){J="subtitled",Ve=0;try{localStorage.setItem("cp_preferred_category","subtitled")}catch{}$e(),W=ke.subtitled||[],de=vt(W),Ee=W.length>0,Be(),je(),Ie(),G("💬 Türkçe Altyazılı kaynaklara geçildi.","info")}}),!W||W.length===0){const S=J==="dubbed"?"subtitled":"dubbed",k=ke?.[S]?.length||0;e.innerHTML=`
        <div style="padding: 1.5rem 1rem; text-align: center; color: #94a3b8; display:flex; flex-direction:column; align-items:center; gap:10px;">
          <p class="sources-empty-text" style="margin:0;">Bu dilde (${J==="dubbed"?"Türkçe Dublaj":"Türkçe Altyazılı"}) yayın hattı bulunamadı.</p>
          ${k>0?`
            <button type="button" class="btn-footer-pill" id="sources-empty-fallback-btn" style="color:#f59e0b; border-color:rgba(245,158,11,0.4);">
              <span>${S==="dubbed"?"🇹🇷 Türkçe Dublaj Kaynaklarını Göster":"💬 Türkçe Altyazılı Kaynakları Göster"} (${k})</span>
            </button>
          `:""}
        </div>
      `;const E=e.querySelector("#sources-empty-fallback-btn");E&&(E.onclick=X=>{X.preventDefault(),S==="dubbed"?a?.click():t?.click()});return}e.innerHTML=W.map((S,k)=>{const E=k===de,X=!!S.failed;let oe="dot-amber",Y='<span class="source-ready-tag">Hazır</span>';return X?(oe="dot-red",Y=`<span class="source-failed-tag"><i data-lucide="alert-triangle" style="width:12px;height:12px"></i> ${S.failReason||"Yanıt Vermedi"}</span>`):E&&(oe="dot-green",Y='<span class="source-active-tag">🟢 Oynatılıyor</span>'),`
        <div class="source-list-item ${E?"active":""} ${X?"failed":""}" data-index="${k}">
          <div class="source-item-left">
            <span class="server-status-dot ${oe}"></span>
            <span class="source-item-name">${S.displayName||S.name}</span>
            <span class="source-item-badge">${S.quality||"1080p"}</span>
          </div>
          <div class="source-item-right">
            ${Y}
          </div>
        </div>
      `}).join(""),e.querySelectorAll(".source-list-item").forEach(S=>{S.addEventListener("click",k=>{k.preventDefault(),k.stopPropagation();const E=parseInt(S.getAttribute("data-index"),10);if(E!==de&&It()){if(f&&!Ji(W[E])){G("Birlikte izleme için senkronlanabilir doğrudan bir yayın hattı seçin.","info");return}de=E,Ve=0,St(!1),Be(),Ie()}})}),ge(e)}function po(){const e=document.getElementById("player-smart-sources-bar");if(!e)return;if(m==="short-drama"&&(!W||W.length<=1)){e.style.display="none";return}e.style.display="flex";const a=document.getElementById("smart-tab-dubbed"),t=document.getElementById("smart-tab-subtitled"),c=document.getElementById("smart-cat-dubbed-count"),b=document.getElementById("smart-cat-subtitled-count"),$=ke?.dubbed||[],z=ke?.subtitled||[];c&&(c.textContent=$.length?`(${$.length})`:"(0)"),b&&(b.textContent=z.length?`(${z.length})`:"(0)");const S=()=>{const K=document.getElementById("smart-sources-dropdown"),pe=document.getElementById("smart-source-trigger");K&&K.classList.add("hidden"),pe&&pe.classList.remove("is-open")};a&&(a.classList.toggle("active",J==="dubbed"),a.onclick=K=>{K.preventDefault(),K.stopPropagation(),S();const pe=document.getElementById("sources-tab-dubbed");pe&&pe.click()}),t&&(t.classList.toggle("active",J==="subtitled"),t.onclick=K=>{K.preventDefault(),K.stopPropagation(),S();const pe=document.getElementById("sources-tab-subtitled");pe&&pe.click()});const k=document.getElementById("smart-source-trigger"),E=document.getElementById("smart-source-name"),X=document.getElementById("smart-source-dot"),oe=document.getElementById("btn-smart-source-prev"),Y=document.getElementById("btn-smart-source-next"),H=document.getElementById("smart-sources-dropdown"),j=document.getElementById("smart-sources-dropdown-list"),B=document.getElementById("smart-sources-dropdown-count"),he=W&&W[de],ie=he?he.displayName||he.name||"Sunucu":tt?"Aranıyor...":"Kaynak Yok",le=!!he?.failed;E&&(E.textContent=ie),X&&(X.className="smart-source-dot "+(he?le?"dot-failed":"dot-active":"dot-ready"));const Ae=W?W.length:0;B&&(B.textContent=`${Ae} Kaynak`);const V=K=>{if(K!==de&&It()){if(f&&!Ji(W[K])){G("Birlikte izleme için senkronlanabilir doğrudan bir yayın hattı seçin.","info");return}de=K,Ve=0,Be(),Ie(),G(`⚡ ${W[K]?.displayName||"Kaynak"} yayınına geçildi.`,"info")}},ze=Ae>1;if(oe&&(oe.disabled=!ze,oe.style.opacity=ze?"1":"0.4",oe.onclick=K=>{if(K.preventDefault(),K.stopPropagation(),!ze)return;const pe=(de-1+Ae)%Ae;V(pe)}),Y&&(Y.disabled=!ze,Y.style.opacity=ze?"1":"0.4",Y.onclick=K=>{if(K.preventDefault(),K.stopPropagation(),!ze)return;const pe=(de+1)%Ae;V(pe)}),k&&(k.onclick=K=>{if(K.preventDefault(),K.stopPropagation(),!H)return;H.classList.contains("hidden")?(H.classList.remove("hidden"),k.classList.add("is-open")):S()}),j)if(!W||W.length===0){const K=J==="dubbed"?"subtitled":"dubbed",pe=ke?.[K]?.length||0;j.innerHTML=`
          <div style="padding: 0.75rem; text-align: center; color: #94a3b8; font-size: 0.76rem;">
            ${tt?"Yayın kaynakları taranıyor...":"Bu dilde kaynak bulunamadı."}
            ${pe>0?`
              <button type="button" class="smart-dropdown-item" id="btn-smart-fallback-cat" style="margin-top: 0.5rem; justify-content: center; width: 100%; border: 1px solid rgba(245,158,11,0.3); color: #fbbf24;">
                ${K==="dubbed"?"🇹🇷 Dublaj Kaynaklarını Aç":"💬 Altyazılı Kaynakları Aç"} (${pe})
              </button>
            `:""}
          </div>
        `;const Me=j.querySelector("#btn-smart-fallback-cat");Me&&(Me.onclick=Se=>{Se.preventDefault(),S(),K==="dubbed"?a?.click():t?.click()})}else{j.innerHTML=W.map((pe,Me)=>{const Se=Me===de,we=!!pe.failed;return`
            <button type="button" class="smart-dropdown-item ${Se?"active":""} ${we?"failed":""}" data-server-idx="${Me}">
              <div class="smart-dropdown-item-left">
                <span class="smart-source-dot ${Se?"dot-active":we?"dot-failed":"dot-ready"}"></span>
                <span class="smart-dropdown-item-name">${pe.displayName||pe.name||"Sunucu"}</span>
              </div>
              <div class="smart-dropdown-item-right">
                <span class="smart-dropdown-badge">${pe.quality||"1080p"}</span>
                ${Se?'<span class="smart-dropdown-playing">Aktif</span>':""}
              </div>
            </button>
          `}).join("")+`
          <button type="button" class="smart-dropdown-item" id="btn-smart-advanced-settings" style="margin-top: 0.35rem; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.5rem; color: #94a3b8; font-size: 0.72rem; justify-content: center;">
            <i data-lucide="sliders-horizontal" style="width:12px;height:12px;margin-right:4px;"></i>
            <span>Gelişmiş Kaynak Ayarları</span>
          </button>
        `,j.querySelectorAll(".smart-dropdown-item[data-server-idx]").forEach(pe=>{pe.addEventListener("click",Me=>{Me.preventDefault(),Me.stopPropagation(),S();const Se=parseInt(pe.getAttribute("data-server-idx"),10);V(Se)})});const K=j.querySelector("#btn-smart-advanced-settings");K&&(K.onclick=pe=>{pe.preventDefault(),pe.stopPropagation(),S(),St(!0)})}e._hasOutsideClickListener||(e._hasOutsideClickListener=!0,document.addEventListener("click",K=>{e.contains(K.target)||S()})),ge(e)}const mo=po;let Ve=0,an=0;function Ja(e="Yayın yanıt vermedi"){const a=document.getElementById("player-iframe-wrapper");if(!a)return;if(me){try{me.destroy()}catch{}me=null}if(ot){try{ot.destroy()}catch{}ot=null}const t=W[de],c=W.findIndex((z,S)=>S>de&&!z.failed),b=c!==-1,$=J==="dubbed"&&ke.subtitled?.length>0;a.innerHTML=`
      <div class="player-error-view" style="display:flex;align-items:center;justify-content:center;height:100%;text-align:center;padding:2rem;">
        <div class="player-error-card" style="background:rgba(20,24,35,0.92);backdrop-filter:blur(16px);padding:2rem;border-radius:16px;border:1px solid rgba(255,255,255,0.12);max-width:460px;box-shadow:0 20px 40px rgba(0,0,0,0.6);">
          <i data-lucide="alert-circle" style="width:44px;height:44px;color:#f59e0b;margin-bottom:1rem;"></i>
          <h3 style="color:#fff;font-size:1.15rem;margin-bottom:0.5rem;">${t?.displayName||t?.name||"Seçili Kaynak"} Yanıt Vermedi</h3>
          <p style="color:#94a3b8;font-size:0.85rem;line-height:1.5;margin-bottom:1.25rem;">
            ${e}. Alternatif yayın hatlarından birine geçiş yapabilir veya diğer dildeki kaynakları deneyebilirsiniz.
          </p>
          <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;">
            ${b?`<button class="btn-primary" id="btn-err-try-next" style="padding:0.55rem 1.1rem;font-size:0.85rem;display:inline-flex;align-items:center;gap:0.4rem;"><i data-lucide="skip-forward" style="width:14px;height:14px"></i> Sıradaki Kaynağa Geç (${W[c].displayName||"Alternatif"})</button>`:""}
            <button class="btn-secondary" id="btn-err-open-sources" style="padding:0.55rem 1.1rem;font-size:0.85rem;display:inline-flex;align-items:center;gap:0.4rem;"><i data-lucide="layers" style="width:14px;height:14px"></i> Tüm Kaynaklar (${W.length})</button>
            ${$?'<button class="btn-secondary" id="btn-err-switch-sub" style="padding:0.55rem 1.1rem;font-size:0.85rem;display:inline-flex;align-items:center;gap:0.4rem;color:#f59e0b;"><i data-lucide="message-square" style="width:14px;height:14px"></i> 💬 Altyazılıya Geç</button>':""}
          </div>
        </div>
      </div>
    `,ge(a),document.getElementById("btn-err-try-next")?.addEventListener("click",()=>{b&&(Ve=0,de=c,Be(),Ie())}),document.getElementById("btn-err-open-sources")?.addEventListener("click",()=>{St(!0)}),document.getElementById("btn-err-switch-sub")?.addEventListener("click",()=>{Ve=0;const z=document.getElementById("tab-subtitled");z&&z.click()})}function dt(e="Bağlantı yanıt vermedi"){if(N)return;if(f&&!We()){G("Moderatör alternatif yayına geçiyor…","info");return}const a=Date.now();if(!(e&&/HTTP\s+(403|404|500|502|503)/i.test(e))&&a-an<2500)return;an=a;const c=W[de];c&&(c.failed=!0,c.failReason=e,ne||Mr({category:J,source:c})),Ve++;const b=Math.max(3,W.length-1);if(Ve>b){Ja(e);return}const $=c&&(c.isDirectVideo||c.isHls||c.isMkv||!c.isTorrent);let z=-1;for(let S=1;S<W.length;S++){const k=(de+S)%W.length,E=W[k];if(!(!E||E.failed)&&!($&&(E.isTorrent||E.id?.includes("torrent")||E.streamUrl?.startsWith("magnet:")||E.streamUrl?.includes(":4000/torrent/")))){z=k;break}}if(z!==-1){const S=W[z];G(`⚠️ ${c?.displayName||c?.name||"Mevcut kaynak"} yanıt vermedi. ${S.displayName||S.name} deneniyor...`,"warning"),de=z,Be(),Ie();return}if(na){G("⚠️ Seçili hat yanıt vermedi, alternatif hatlar taranıyor...","info");const S=document.getElementById("player-iframe-wrapper");S&&(S.innerHTML=`
          <div class="player-loading-overlay">
            <div class="player-loader-core">
              <div class="player-loader-spinner"></div>
              <i data-lucide="play" class="player-loader-icon"></i>
            </div>
            <div class="player-loader-text">
              <h3>${ue}</h3>
              <p class="player-loader-sub">Alternatif Yayın Hatları Taranıyor...</p>
              <p class="player-loader-hint">Bir önceki hat yanıt vermedi, yeni kaynak bağlanıyor...</p>
            </div>
          </div>
        `,ge(S));return}Ja(e)}function fo(){return""}function Qa(e){const a=[];Array.isArray(e?.subtitles)&&e.subtitles.length>0&&a.push(...e.subtitles);const c=[...W||[],...ke?.subtitled||[],...ke?.dubbed||[]].find(S=>Array.isArray(S.subtitles)&&S.subtitles.length>0);c&&Array.isArray(c.subtitles)&&c.subtitles.length>0&&c.subtitles.forEach(S=>{a.some(k=>k.src===S.src||k.label&&k.label===S.label)||a.push(S)});const b=d||r||u||"",$=i==="movie"?`/api/subtitles?tmdbId=${n||""}&imdbId=&title=${encodeURIComponent(b)}&type=movie`:`/api/subtitles?tmdbId=${n||""}&imdbId=&title=${encodeURIComponent(b)}&season=${L}&episode=${q}&type=tv`;return a.some(S=>(S.label||"").toLowerCase().includes("opensubtitles")||S.src?.includes("/api/subtitles"))||a.push({label:"OpenSubtitles (Türkçe)",src:$}),a}function sn(e,a){if(!e)return;const t=Qa(a),c=J==="subtitled"&&t.length>0?0:-1,b=()=>{try{const $=e.textTracks;if($&&$.length>0)for(let z=0;z<$.length;z++)c>=0&&z===c?$[z].mode="showing":$[z].mode="disabled"}catch{}};e.readyState>=1?b():(e.addEventListener("loadedmetadata",b,{once:!0}),e.addEventListener("canplay",b,{once:!0}))}function bo(){const e=document.getElementById("hls-video-player");if(!e)return;const a=W[de];if(!a)return;const t=Qa(a);!t||t.length===0||(e.querySelectorAll("track").length===0&&t.forEach((c,b)=>{let $=c.src;$&&$.startsWith("http")&&($=`/api/proxy?url=${encodeURIComponent($)}`);const z=document.createElement("track");z.kind="subtitles",z.label=c.label||"Altyazı",z.src=$,z.srclang=(c.label||"").toLowerCase().includes("türk")?"tr":"en",J==="subtitled"&&b===0&&(z.default=!0),e.appendChild(z)}),sn(e,a))}function nn(){if((tt||na)&&(!W||W.length===0))return`
        <div class="player-loading-overlay">
          <div class="player-loader-core">
            <div class="player-loader-spinner"></div>
            <i data-lucide="play" class="player-loader-icon"></i>
          </div>
          <div class="player-loader-text">
            <h3>${ue}</h3>
            <p class="player-loader-sub">${J==="subtitled"?"💬 Türkçe Altyazılı":"🇹🇷 Türkçe Dublaj"} Yayınlar Aranıyor...</p>
            <p class="player-loader-hint">Türkiye ve küresel CDN hatları taranıyor...</p>
          </div>
        </div>
      `;if(J==="dubbed"&&(!W||W.length===0))return`
        <div class="player-not-found-container">
          <div class="not-found-icon-wrap">
            <i data-lucide="volume-x" style="width: 38px; height: 38px; color: #f59e0b;"></i>
          </div>
          <h3>Türkçe Dublaj Henüz Mevcut Değil</h3>
          <p>
            "${ue}" yapımı için resmi veya aktif Türkçe Dublaj akışı bulunamadı. Türkçe Altyazılı yüksek kaliteli (1080p / 4K) kaynaklardan hemen izleyebilirsiniz.
          </p>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center;">
            <button id="btn-switch-subtitled-fallback" class="btn-primary btn-switch-category-fallback">
              <i data-lucide="repeat" style="width: 16px; height: 16px;"></i>
              <span>💬 Türkçe Altyazılı Sunucuları Aç (${ke.subtitled?.length||0} Hat Aktif)</span>
            </button>
            <button id="btn-retry-discovery" class="btn-secondary" style="padding: 0.55rem 1.1rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.4rem;">
              <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
              <span>Yeniden Tara</span>
            </button>
          </div>
        </div>
      `;if(!W||W.length===0)return`
        <div class="player-not-found-container">
          <div class="not-found-icon-wrap">
            <i data-lucide="video-off" style="width: 38px; height: 38px; color: #ef4444;"></i>
          </div>
          <h3>Aktif Yayın Kaynağı Bulunamadı</h3>
          <p>
            "${ue}" içeriği için seçili sunucularda anlık sinyal alınamadı.
          </p>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center;">
            <button id="btn-retry-discovery" class="btn-primary" style="padding: 0.55rem 1.2rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.4rem;">
              <i data-lucide="refresh-cw" style="width: 15px; height: 15px;"></i>
              <span>Tekrar Tara</span>
            </button>
            <button id="btn-switch-subtitled-fallback" class="btn-secondary" style="padding: 0.55rem 1.1rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.4rem;">
              <i data-lucide="repeat" style="width: 14px; height: 14px;"></i>
              <span>${J==="dubbed"?"💬 Altyazılıya Geç":"🇹🇷 Dublaja Geç"}</span>
            </button>
          </div>
        </div>
      `;const e=W[de];if(!e||e.notFound)return`
        <div class="player-not-found-container">
          <div class="not-found-icon-wrap">
            <i data-lucide="video-off" style="width: 38px; height: 38px; color: #ef4444;"></i>
          </div>
          <h3>${J==="dubbed"?"Dublaj Sunucularda Bulunamadı":"Altyazılı Sunucularda Bulunamadı"}</h3>
          <p>
            "${ue}" içeriği seçili kategorideki aktif depolarda yer almamaktadır.
          </p>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center;">
            <button id="btn-switch-subtitled-fallback" class="btn-primary btn-switch-category-fallback">
              <i data-lucide="repeat" style="width: 16px; height: 16px;"></i>
              <span>${J==="dubbed"?"💬 Türkçe Altyazılı VidAPI & VIP Sunuculara Geç":"🇹🇷 Türkçe Dublaj Sunucularına Geç"}</span>
            </button>
            <button id="btn-retry-discovery" class="btn-secondary" style="padding: 0.55rem 1.1rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.4rem;">
              <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
              <span>Yeniden Tara</span>
            </button>
          </div>
        </div>
      `;if(!!(e.isDirectVideo||e.isHls||e.streamUrl&&!e.streamUrl.startsWith("magnet:")&&(e.streamUrl.includes(".m3u8")||e.streamUrl.includes(".mp4")||e.streamUrl.includes(".mkv")||e.streamUrl.includes(":4000/torrent/")))){const b=at(e),$=e.dubbedAudioUrl&&b===e.dubbedAudioUrl,z=e.dubbedAudioUrl&&e.dubbedAudioUrl.length>5&&!$,S=z?`
        <div class="dual-audio-bar" id="dual-audio-bar">
          <div class="dual-audio-label">
            <i data-lucide="headphones" style="width: 14px; height: 14px; color: #f59e0b;"></i>
            <span>Ses Kaynağı:</span>
          </div>
          <div class="dual-audio-toggle">
            <button id="btn-audio-original" class="dual-audio-btn ${J==="subtitled"?"active":""}" title="Orijinal Ses">
              <span>🇬🇧 Orijinal</span>
            </button>
            <button id="btn-audio-dubbed" class="dual-audio-btn ${J==="dubbed"?"active":""}" title="Türkçe Dublaj Sesi">
              <span>🇹🇷 TR Dublaj</span>
            </button>
          </div>
          <span class="dual-audio-source-name" title="${e.dubbedAudioName||""}">
            Ses: ${e.dubbedAudioName||"TR Dublaj"}
          </span>
        </div>
      `:"",k=Qa(e),E=J==="subtitled"&&k.length>0?0:-1,X=k.map((Y,H)=>{let j=Y.src;j&&j.startsWith("http")&&(j=`/api/proxy?url=${encodeURIComponent(j)}`);const B=(Y.label||"").toLowerCase().includes("türk")||(Y.label||"").toLowerCase().includes("tr");return`
          <track 
            kind="subtitles" 
            label="${Y.label||"Altyazı"}" 
            src="${j}" 
            srclang="${B?"tr":"en"}" 
            ${H===E?"default":""}>
        `}).join("");return`
        <div class="direct-video-wrapper" id="direct-video-wrapper">
          <!-- Cinema Ambient Glow Layer (YouTube Style) -->
          <div class="player-ambient-glow" id="player-ambient-glow">
            <canvas id="player-ambient-canvas" class="player-ambient-canvas"></canvas>
          </div>

          ${S}
          <video 
            id="hls-video-player" 
            autoplay 
            playsinline
            webkit-playsinline
            crossorigin="anonymous"
            preload="auto">
            ${X}
          </video>
          ${z?`
        <video id="dubbed-audio-source" style="position: absolute; left: -9999px; top: -9999px; width: 1px; height: 1px; opacity: 0; pointer-events: none;" preload="auto"></video>
      `:""}
          <!-- Screen Lock / Unlock Overlay Buttons -->
          <button class="custom-screen-lock-btn" id="custom-btn-screen-lock" title="Ekranı Kilitle">
            <i data-lucide="unlock" style="width: 16px; height: 16px;"></i>
          </button>
          <button class="custom-screen-unlock-badge hidden" id="custom-btn-screen-unlock" title="Kilidi Aç">
            <i data-lucide="lock" style="width: 15px; height: 15px; color: #fbbf24;"></i>
            <span>Ekran Kilitli • Dokunarak Aç</span>
          </button>

          <!-- Center Click Ripple Animation -->
          <div class="custom-center-play-indicator" id="custom-center-play-indicator">
            <i data-lucide="play" style="width: 32px; height: 32px;"></i>
          </div>

          <!-- Mobile Gesture HUD (Brightness / Volume Visualizer) -->
          <div class="custom-gesture-hud hidden" id="custom-gesture-hud">
            <div class="gesture-hud-icon-wrap" id="gesture-hud-icon-wrap">
              <i data-lucide="sun" id="gesture-hud-icon" style="width: 24px; height: 24px;"></i>
            </div>
            <span class="gesture-hud-text" id="gesture-hud-text">%100</span>
            <div class="gesture-hud-bar">
              <div class="gesture-hud-fill" id="gesture-hud-fill" style="height: 100%;"></div>
            </div>
          </div>

          <!-- Sleep Curtain (Active when sleep timer fires) -->
          <div class="custom-sleep-curtain hidden" id="custom-sleep-curtain">
            <div class="sleep-curtain-box">
              <i data-lucide="moon" style="width: 44px; height: 44px; color: #c084fc;"></i>
              <h3>Uyku Modu Aktif 🌙</h3>
              <p>Zamanlayıcı süresi doldu ve yayın duraklatıldı. Devam etmek için ekrana dokunun.</p>
            </div>
          </div>

          <!-- Skip Intro Button (Appears around 0:10 - 1:30) -->
          <button class="custom-skip-intro-btn hidden" id="custom-btn-skip-intro" title="Jeneriği Atla">
            <i data-lucide="fast-forward" style="width: 15px; height: 15px;"></i>
            <span>İntroyu Atla</span>
          </button>

          <!-- Auto Next Episode Binge Countdown Card (Netflix-Style) -->
          <div class="custom-binge-card hidden" id="custom-binge-card">
            <div class="binge-card-body">
              <span class="binge-card-tag">SONRAKİ BÖLÜM</span>
              <span class="binge-card-title" id="binge-card-title">${ue} • Bölüm ${q+1}</span>
              <span class="binge-card-sub"><b id="binge-sec-num">5</b> saniye içinde başlıyor...</span>
            </div>
            <button class="binge-card-jump-btn" id="binge-card-jump-btn">
              <i data-lucide="play" style="width: 14px; height: 14px;"></i>
              <span>Hemen Geç</span>
            </button>
            <button class="binge-card-close-btn" id="binge-card-close-btn" title="Kapat">
              <i data-lucide="x" style="width: 13px; height: 13px;"></i>
            </button>
          </div>

          <!-- Center Transport Controls Overlay (Image 2 Stremio Style: Rewind 10, Play/Pause, Forward 10) -->
          <div class="custom-center-transport-overlay" id="custom-center-transport">
          </div>

          <!-- Bottom Custom Control Bar (Matching Image 2: Stremio Floating Capsule Player) -->
          <div class="custom-player-controls" id="custom-player-controls">
            <!-- Timeline Scrubber -->
            <div class="custom-timeline-container" id="custom-timeline-container">
              <div class="custom-timeline-bg">
                <div class="custom-timeline-buffered" id="custom-timeline-buffered"></div>
                <div class="custom-timeline-played" id="custom-timeline-played"></div>
              </div>
              <div class="custom-timeline-thumb" id="custom-timeline-thumb"></div>
              <div class="custom-timeline-tooltip" id="custom-timeline-tooltip">0:00</div>
            </div>

            <!-- Player tools sit on their own row directly below the timeline. -->
            <div class="custom-controls-row">
              <div class="custom-controls-left-stack">
                <div class="custom-controls-left-time" aria-label="Oynatma süresi">
                  <span class="custom-time-current" id="custom-time-current">00:00</span>
                  <span class="custom-time-separator">/</span>
                  <span class="custom-time-duration" id="custom-time-duration">00:00</span>
                </div>
                <div class="custom-controls-transport-row" aria-label="Oynatma kontrolleri">
                  <button class="compact-transport-btn" id="custom-btn-rewind-10" title="10 Saniye Geri (←)">
                    <i data-lucide="rotate-ccw" style="width: 13px; height: 13px;"></i><span>10</span>
                  </button>
                  <button class="compact-transport-btn compact-play-btn" id="custom-btn-play" title="Oynat / Duraklat (Space)">
                    <i data-lucide="pause" id="center-play-icon" style="width: 14px; height: 14px;"></i>
                  </button>
                  <button class="compact-transport-btn" id="custom-btn-forward-10" title="10 Saniye İleri (→)">
                    <i data-lucide="rotate-cw" style="width: 13px; height: 13px;"></i><span>10</span>
                  </button>
                </div>
              </div>
              <!-- Center: Stremio-Style Glassmorphic Floating Pill Bar -->
              <div class="custom-floating-pill-bar" id="custom-floating-pill-bar">
                <button type="button" class="pill-bar-btn" id="pill-btn-speed" title="Oynatma Hızı">
                  <i data-lucide="gauge" style="width: 14px; height: 14px;"></i>
                  <span id="pill-speed-label">1x</span>
                </button>
                <button type="button" class="pill-bar-btn" id="pill-btn-subs" title="Altyazı Seçenekleri">
                  <i data-lucide="subtitles" style="width: 14px; height: 14px;"></i>
                  <span>Altyazı</span>
                </button>
                <button type="button" class="pill-bar-btn" id="pill-btn-audio" title="Ses Kanalı (Dublaj / Orijinal)">
                  <i data-lucide="headphones" style="width: 14px; height: 14px;"></i>
                  <span>Ses</span>
                </button>
                <button type="button" class="pill-bar-btn" id="pill-btn-sources" title="Yayın Hatları / Sunucular">
                  <i data-lucide="layers" style="width: 14px; height: 14px;"></i>
                  <span>Kaynaklar</span>
                </button>
                ${ae?`
                  <button type="button" class="pill-bar-btn" id="pill-btn-episodes" title="Bölümler">
                    <i data-lucide="list-video" style="width: 14px; height: 14px;"></i>
                    <span>Bölümler</span>
                  </button>
                `:""}
                <button type="button" class="pill-bar-btn" id="pill-btn-similar" title="${ae?"Benzer Diziler":"Benzer Filmler"}">
                  <i data-lucide="sparkles" style="width: 14px; height: 14px;"></i>
                  <span>Benzerleri</span>
                </button>
              </div>

              <!-- Times and playback actions stay on the lower row. -->
              <div class="custom-controls-right-actions">
                <div class="custom-player-time-remaining hidden" id="custom-time-remaining">-00:00</div>
                <div class="custom-time-display hidden" id="custom-time-display">0:00 / 0:00</div>

                <!-- Volume Wrap (Vertical Popover Upwards) -->
                <div class="custom-slider-popup-wrap custom-volume-wrap" id="custom-volume-wrap" title="Ses Seviyesi">
                  <button class="custom-ctrl-btn" id="custom-btn-volume" title="Ses">
                    <i data-lucide="volume-2" style="width: 20px; height: 20px;"></i>
                  </button>
                  <div class="custom-vertical-slider-popover" id="custom-volume-popover">
                    <span class="custom-slider-val-badge" id="custom-volume-badge">%100</span>
                    <div class="custom-vertical-track-wrap">
                      <input type="range" class="custom-vertical-slider" id="custom-volume-slider" min="0" max="1" step="0.05" value="1" />
                    </div>
                  </div>
                </div>

                <!-- Brightness Wrap (Vertical Popover Upwards) -->
                <div class="custom-slider-popup-wrap custom-brightness-wrap" id="custom-brightness-wrap" title="Parlaklık">
                  <button class="custom-ctrl-btn" id="custom-btn-brightness" title="Parlaklık">
                    <i data-lucide="sun" style="width: 20px; height: 20px;"></i>
                  </button>
                  <div class="custom-vertical-slider-popover" id="custom-brightness-popover">
                    <span class="custom-slider-val-badge" id="custom-brightness-badge">%100</span>
                    <div class="custom-vertical-track-wrap">
                      <input type="range" class="custom-vertical-slider" id="custom-brightness-slider" min="30" max="150" step="1" value="100" />
                    </div>
                  </div>
                </div>

                <!-- Hidden proxy for subtitles/audio menu trigger -->
                <button class="custom-ctrl-btn hidden" id="custom-btn-subtitles-audio" title="Ses ve Altyazı" style="display:none !important;">
                  <i data-lucide="message-square" style="width: 20px; height: 20px;"></i>
                </button>

                <!-- Fullscreen Button -->
                <button class="custom-ctrl-btn" id="custom-btn-fullscreen" title="Tam Ekran (F)">
                  <i data-lucide="maximize" style="width: 20px; height: 20px;"></i>
                </button>

                <!-- Three-Dots / Extra Settings Button (⋮) -->
                <button class="custom-ctrl-btn" id="custom-btn-more" title="Diğer Seçenekler">
                  <i data-lucide="more-vertical" style="width: 18px; height: 18px;"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Three-Dots Context Menu -->
          <div class="custom-player-menu hidden" id="custom-player-menu">
            <!-- Main View -->
            <div class="custom-menu-view" id="custom-menu-main">
              <!-- Item 1: Oynatma hızı -->
              <div class="custom-menu-item" id="custom-menu-item-speed">
                <div class="custom-menu-item-icon">
                  <i data-lucide="gauge" style="width: 17px; height: 17px; color: #f59e0b;"></i>
                </div>
                <div class="custom-menu-item-body">
                  <span class="custom-menu-item-title">Oynatma Hızı</span>
                  <span class="custom-menu-item-sub" id="custom-menu-active-speed">Normal</span>
                </div>
                <i data-lucide="chevron-right" style="width: 15px; height: 15px; color: #94a3b8;"></i>
              </div>

              <!-- Item 2: Uygulama Zamanlayıcısı -->
              <div class="custom-menu-item" id="custom-menu-item-sleep-menu">
                <div class="custom-menu-item-icon">
                  <i data-lucide="timer" style="width: 17px; height: 17px; color: #fbbf24;"></i>
                </div>
                <div class="custom-menu-item-body">
                  <span class="custom-menu-item-title">Uygulama Zamanlayıcısı</span>
                  <span class="custom-menu-item-sub" id="custom-menu-active-sleep">Kapalı</span>
                </div>
                <i data-lucide="chevron-right" style="width: 15px; height: 15px; color: #94a3b8;"></i>
              </div>

              <!-- Item 3: Pencere içinde pencere -->
              <div class="custom-menu-item" id="custom-menu-item-pip">
                <div class="custom-menu-item-icon">
                  <i data-lucide="picture-in-picture-2" style="width: 17px; height: 17px; color: #34d399;"></i>
                </div>
                <div class="custom-menu-item-body">
                  <span class="custom-menu-item-title">Pencere içinde pencere</span>
                </div>
              </div>

              <!-- Item 4: Altyazı Stili & Ayarları -->
              <div class="custom-menu-item" id="custom-menu-item-sub-style">
                <div class="custom-menu-item-icon">
                  <i data-lucide="palette" style="width: 17px; height: 17px; color: #ec4899;"></i>
                </div>
                <div class="custom-menu-item-body">
                  <span class="custom-menu-item-title">Altyazı Stili & Ayarları</span>
                  <span class="custom-menu-item-sub" id="custom-menu-active-sub-style">Özelleştir</span>
                </div>
                <i data-lucide="chevron-right" style="width: 15px; height: 15px; color: #94a3b8;"></i>
              </div>

            </div>

            <!-- Submenu View -->
            <div class="custom-menu-view hidden" id="custom-menu-subview">
              <div class="custom-menu-back-header" id="custom-menu-back-btn">
                <i data-lucide="chevron-left" style="width: 15px; height: 15px;"></i>
                <span id="custom-menu-subview-title">Geri</span>
              </div>
              <div class="custom-menu-options-list" id="custom-menu-options-list"></div>
            </div>
          </div>

          <!-- Dedicated Audio & Subtitle Popover Modal (Floating directly above Pill Bar) -->
          <div class="custom-audio-sub-popover hidden" id="custom-audio-sub-popover">
            <div class="audio-sub-popover-header">
              <div class="audio-sub-tab-group">
                <button type="button" class="audio-sub-tab-btn active" id="audio-sub-tab-audio">
                  <i data-lucide="headphones" style="width: 13px; height: 13px;"></i>
                  <span>Dublaj & Ses</span>
                </button>
                <button type="button" class="audio-sub-tab-btn" id="audio-sub-tab-subs">
                  <i data-lucide="subtitles" style="width: 13px; height: 13px;"></i>
                  <span>Altyazı</span>
                </button>
              </div>
              <button type="button" class="audio-sub-close-btn" id="audio-sub-close-btn" title="Kapat">
                <i data-lucide="x" style="width: 14px; height: 14px;"></i>
              </button>
            </div>

            <!-- Content Pane for Audio & Dubbing -->
            <div class="audio-sub-pane" id="audio-sub-pane-audio">
              <div class="audio-sub-section-head">
                <span>YAYIN DİLİ & KANALLAR</span>
              </div>
              <div class="audio-sub-options-list" id="audio-sub-options-audio"></div>
            </div>

            <!-- Content Pane for Subtitles -->
            <div class="audio-sub-pane hidden" id="audio-sub-pane-subs">
              <div class="audio-sub-section-head">
                <span>ALTYAZI SEÇENEKLERİ</span>
              </div>
              <div class="audio-sub-options-list" id="audio-sub-options-subs"></div>
            </div>
          </div>
        </div>
      `}const t=at(e);return`
      <iframe 
        id="video-iframe"
        name="player_${(e.displayName||e.name||"Kaynak").replace(/[^a-z0-9]/gi,"_")}"
        src="${t}" 
        allowfullscreen="true"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
        loading="eager"
        referrerpolicy="no-referrer-when-downgrade"
        allow="autoplay *; encrypted-media *; fullscreen *; picture-in-picture *; accelerometer *; gyroscope *; clipboard-write *; web-share *"
        style="width:100%;height:100%;border:none;display:block;background:#000;">
      </iframe>
    `}function rn(){if(!ae)return"";const e=Ai(L),a=Te.some(b=>b.season_number===L+1);let t="";e>0?q<e?t=`
          <button id="btn-next-episode" class="btn-primary btn-nav-episode btn-nav-next" data-action="next-ep">
            <span>Sonraki Bölüm (B${q+1})</span>
            <i data-lucide="chevron-right" style="width: 15px; height: 15px;"></i>
          </button>
        `:a?t=`
          <button id="btn-next-episode" class="btn-primary btn-nav-episode btn-nav-next-season" data-action="next-season">
            <span>Sonraki Sezon (S${L+1} B1)</span>
            <i data-lucide="fast-forward" style="width: 15px; height: 15px;"></i>
          </button>
        `:t=`
          <span class="badge-series-finished">
            <i data-lucide="check-check" style="width: 14px; height: 14px;"></i>
            <span>Dizi Tamamlandı</span>
          </span>
        `:a?t=`
          <button id="btn-next-episode" class="btn-primary btn-nav-episode btn-nav-next-season" data-action="next-season">
            <span>Sonraki Sezon (S${L+1} B1)</span>
            <i data-lucide="fast-forward" style="width: 15px; height: 15px;"></i>
          </button>
        `:t=`
          <span class="badge-series-finished">
            <i data-lucide="check-check" style="width: 14px; height: 14px;"></i>
            <span>Dizi Tamamlandı</span>
          </span>
        `;let c="";if(q>1)c=`
        <button id="btn-prev-episode" class="btn-secondary btn-nav-episode btn-nav-prev" data-action="prev-ep">
          <i data-lucide="chevron-left" style="width: 15px; height: 15px;"></i>
          <span>Önceki Bölüm (B${q-1})</span>
        </button>
      `;else if(L>1){const b=Ai(L-1)||1;c=`
        <button id="btn-prev-episode" class="btn-secondary btn-nav-episode btn-nav-prev-season" data-action="prev-season" data-prev-season="${L-1}" data-prev-ep="${b}">
          <i data-lucide="rewind" style="width: 15px; height: 15px;"></i>
          <span>Önceki Sezon (S${L-1} B${b})</span>
        </button>
      `}return`${c} ${t}`}function on(){const e=document.getElementById("player-nav-btn-group");e&&(e.innerHTML=rn(),fn(),ge(w))}w.innerHTML=`
    <!-- Ambient Backdrop Aura Glow -->
    <div class="player-ambient-backdrop" ${g?`style="background-image: url('${g}');"`:""}></div>
    
    <div class="modal-content player-modal-content${re?" player-offline-mode":""}" id="cinema-modal-box">
      ${f?`<aside id="room-player-hud" class="room-player-hud room-player-cloud-hud" aria-live="polite">
        <!-- Açılır Bulut Butonu (Cloud Floating Trigger) -->
        <button id="btn-room-cloud-toggle" class="room-cloud-pill-btn" type="button" aria-expanded="false" aria-label="Birlikte İzleme ve Sohbet Bulutu" title="Birlikte İzleme Menüsü">
          <span class="room-player-live-dot"></span>
          <span class="room-cloud-icon-wrap"><i data-lucide="cloud"></i></span>
          <span class="room-cloud-title">Birlikte İzleme</span>
          <span id="room-cloud-member-badge" class="room-cloud-member-badge" title="Bağlı Kişi Sayısı">1</span>
          <b id="room-chat-unread-cloud" class="room-chat-unread-badge" hidden>0</b>
          <i data-lucide="chevron-up" class="room-cloud-chevron"></i>
        </button>

        <!-- Açılan Bulut Kartı / Popover (Cloud Bubble Panel) -->
        <div id="room-cloud-popover" class="room-cloud-popover" hidden>
          <div class="room-cloud-header">
            <div class="room-cloud-header-left">
              <span class="room-player-live-dot"></span>
              <strong>Birlikte İzleme</strong>
            </div>
            <button id="btn-room-cloud-close" class="room-cloud-close" type="button" title="Kapat" aria-label="Kapat">
              <i data-lucide="x"></i>
            </button>
          </div>

          <div class="room-cloud-body">
            <div class="room-cloud-info-grid">
              <div class="room-cloud-info-row">
                <i data-lucide="activity"></i>
                <small id="room-player-status">Oda eşitleniyor…</small>
              </div>
              <div class="room-cloud-info-row">
                <i data-lucide="film"></i>
                <small id="room-player-episode">${ae?`S${L} · B${q}`:"Film"}</small>
              </div>
              <div class="room-cloud-info-row">
                <i data-lucide="radio"></i>
                <small id="room-player-source">Ortak kaynak aranıyor…</small>
              </div>
            </div>

            <div class="room-cloud-members-section">
              <div id="room-player-members" class="room-player-members"></div>
            </div>
          </div>

          <div class="room-player-actions room-cloud-actions">
            <button id="btn-room-return" class="room-player-return" type="button"><i data-lucide="users-round"></i><span>Odaya dön</span></button>
            <button id="btn-room-chat" class="room-player-chat" type="button" aria-label="Oda sohbeti"><i data-lucide="message-circle"></i><span class="room-chat-label">Sohbet</span><b id="room-chat-unread" hidden>0</b></button>
          </div>
        </div>
      </aside>`:""}
      
      <!-- Top Cinematic Glassmorphism Bar -->
      <div class="player-cinema-bar">
        
        <!-- Left: Close Button, Title & Indicators -->
        <div class="player-header-left">
          <button id="player-close-btn" class="btn-player-close" title="Geri Dön / Kapat (ESC)">
            <i data-lucide="chevron-left" style="width: 22px; height: 22px;"></i>
          </button>
          
          <div class="player-title-box">
            <span id="player-modal-title" class="player-header-title">${re&&ae?`${ue} · S${L} B${q}`:ue}</span>
            ${ae?`<span class="player-header-ep-badge">S${L} B${q}</span>`:""}
            <span class="player-active-stream-badge" id="player-top-source-chip" style="${W[de]?"":"display: none !important;"}" title="Aktif Yayın Hattı: ${si()}">
              <i data-lucide="zap" style="width: 12px; height: 12px; color: #f59e0b;"></i>
              <span>${si()}</span>
            </span>
            ${qe>5?`
              <span id="player-resume-time-badge" class="player-resume-badge" title="Kaldığın Süre">
                <i data-lucide="clock" style="width: 11px; height: 11px;"></i>
                <span>${Ot(qe)}</span>
              </span>
            `:""}
          </div>
        </div>

        <!-- Hidden proxy for backward compatibility with tab-dubbed / tab-subtitled -->
        <div class="player-header-toggle" style="display: none !important;">
          <button id="tab-dubbed" class="cinema-tab-btn ${J==="dubbed"?"active":""}">
            <span class="tab-flag">🇹🇷</span>
            <span>Dublaj</span>
            <span class="tab-source-count" id="tab-dubbed-count">0</span>
          </button>
          <button id="tab-subtitled" class="cinema-tab-btn ${J==="subtitled"?"active":""}">
            <span class="tab-flag">💬</span>
            <span>Altyazılı</span>
            <span class="tab-source-count" id="tab-subtitled-count">0</span>
          </button>
        </div>

        <!-- Right: Action Icons (Shortcuts, Fullscreen, External) -->
        <div class="player-header-right">
          <button id="btn-player-shortcuts" class="btn-player-tool desktop-only-tool" title="Klavye Kısayolları (?)">
            <i data-lucide="keyboard" style="width: 16px; height: 16px;"></i>
          </button>

          <button id="btn-player-fullscreen" class="btn-player-tool" title="Tam Ekran / Sinema Modu (F)">
            <i data-lucide="maximize-2" style="width: 16px; height: 16px;"></i>
          </button>

          <a id="player-popout-btn" href="#" target="_blank" class="btn-player-tool desktop-only-tool" title="Harici Pencerede Aç">
            <i data-lucide="external-link" style="width: 16px; height: 16px;"></i>
          </a>
        </div>
      </div>

      <!-- Center Player Video Container -->
          <div class="player-stage-wrapper">
        <div class="player-iframe-container" id="player-iframe-wrapper">
          ${nn()}
        </div>

        <!-- Keyboard Shortcuts Help Popover -->
        <div class="shortcuts-popover hidden" id="player-shortcuts-popover">
          <div class="shortcuts-header">
            <h4><i data-lucide="keyboard" style="width: 16px; height: 16px; color: var(--primary);"></i> Klavye Kısayolları</h4>
            <button id="btn-close-shortcuts" class="btn-close-drawer"><i data-lucide="x" style="width: 14px; height: 14px;"></i></button>
          </div>
          <div class="shortcuts-grid">
            <div class="shortcut-item"><kbd>F</kbd><span>Tam Ekran / Sinema Modu</span></div>
            <div class="shortcut-item"><kbd>Space</kbd> / <kbd>K</kbd><span>Oynat / Duraklat</span></div>
            <div class="shortcut-item"><kbd>→</kbd> / <kbd>←</kbd><span>10 Saniye İleri / Geri</span></div>
            <div class="shortcut-item"><kbd>N</kbd><span>Sonraki Bölüm</span></div>
            <div class="shortcut-item"><kbd>P</kbd><span>Önceki Bölüm</span></div>
            <div class="shortcut-item"><kbd>M</kbd><span>Sesi Aç / Kapat</span></div>
            <div class="shortcut-item"><kbd>ESC</kbd><span>Oynatıcıyı Kapat</span></div>
          </div>
        </div>
      </div>

      ${m==="short-drama"&&(T||g||y)?`
      <section class="short-drama-artwork" aria-label="${ue} kapak görseli">
        <img src="${(T||g||y).startsWith("http")?T||g||y:`https://image.tmdb.org/t/p/w1280${T||g||y}`}" alt="${ue}" />
        <div class="short-drama-artwork-shade"></div>
        <div class="short-drama-artwork-copy"><span>KISA DİZİ · MİNİ SERİ · ${q}. BÖLÜM</span><strong>${ue}</strong></div>
      </section>`:""}

      <!-- Dizisol Cinema Body (Title, Genres, Overview & Carousel) -->
      <div class="dizisol-cinema-body">
        <section class="player-editorial-header" aria-label="İçerik bilgisi">
          <div class="player-editorial-copy">
            <div class="player-title-row">
              <h1 class="dizisol-title">${ue}</h1>
            </div>
            <div class="player-meta-pills">
              ${m==="short-drama"?`<span class="dizisol-ep-badge">${q}. Bölüm${F?` · ${F} bölüm`:""}</span>`:`<span class="dizisol-ep-badge">${i==="tv"?`Sezon ${L} · Bölüm ${q}`:"Film"}</span>
                   <span class="player-meta-dot">HD akış</span>
                   <span class="player-meta-dot">Kaldığın yer kaydedilir</span>`}
            </div>
          </div>

          <div class="player-action-cluster" aria-label="Oynatıcı seçenekleri">
            <details class="player-status-menu">
              <summary class="player-status-trigger" title="İzleme durumu"><i data-lucide="bookmark"></i><span id="list-action-label">${Ne?"İzlendi":"Listeme ekle"}</span><i data-lucide="chevron-down"></i></summary>
              <div class="player-status-options">
                <button type="button" data-watch-state="toggle"><i data-lucide="check-circle-2"></i>${Ne?"İzlenmedi olarak işaretle":"İzlendi olarak işaretle"}</button>
                <button type="button" data-watch-state="later"><i data-lucide="clock-3"></i>Daha sonra izle</button>
              </div>
            </details>
            <div class="player-feedback-group" aria-label="Yayın geri bildirimi">
              <button id="btn-report-issue" class="player-icon-action" type="button" title="Kaynakta sorun bildir"><i data-lucide="flag"></i></button>
            </div>
          <div class="player-utility-group">
            <button id="btn-open-sources-drawer" class="player-utility-action active-source-action" type="button" title="Yayın Hatları & Sunucu Seçimi">
              <i data-lucide="layers" style="color: #f59e0b;"></i>
              <span id="active-source-chip-label">Kaynak: ${si()}</span>
            </button>
            ${Wt()&&!D?'<button id="btn-player-download" class="player-utility-action player-download-action" type="button" title="Bölümü indir / çevrimdışı kaydet"><i data-lucide="download"></i><span>İndir</span></button>':""}
            <button id="btn-player-theater" class="player-utility-action" title="Sinema Modu (Genişlet)"><i data-lucide="scan-line"></i><span>Sinema</span></button>
              <button id="btn-player-share" class="player-icon-action" type="button" title="Paylaş"><i data-lucide="share-2"></i></button>
            </div>
            ${Wt()&&!D?'<div id="player-download-progress" class="player-download-progress" hidden aria-live="polite"><div class="player-download-progress-head"><span data-download-status>İndirme başlatılıyor…</span><strong data-download-amount>0 B alındı</strong></div><div class="player-download-progress-track"><span data-download-bar></span></div><div class="player-download-progress-foot"><span>CinePulse İndirilenler’e kaydediliyor</span><span data-download-speed>Hız hesaplanıyor…</span></div></div>':""}
          </div>
        </section>

        <div class="dizisol-genre-chips" id="dizisol-genre-chips">
          ${vi.map(e=>`<span class="dizisol-genre-chip">${e}</span>`).join("")}
        </div>

          <div class="player-story-block ${m==="short-drama"?"short-drama-story":""}">
            ${m==="short-drama"?'<h2 class="short-drama-story-heading">DİZİ HAKKINDA</h2>':""}
            <p class="dizisol-overview" id="dizisol-overview">
            ${m==="short-drama"?x||"Bu kısa dizi için henüz özet girilmedi.":ae?Ut||"Bölüm özeti hazırlanıyor...":Zt||"İçerik bilgileri hazırlanıyor..."}
            </p>
          </div>

        <!-- AKILLI VE KOMPAKT KAYNAK & DİL ÇUBUĞU (Smart Sources Bar) -->
        <div class="player-smart-sources-bar" id="player-smart-sources-bar" ${m==="short-drama"?'style="display:none;"':""}>
          <div class="smart-sources-lang-group">
            <span class="smart-sources-label"><i data-lucide="layers" style="width:13px;height:13px;color:#f59e0b;"></i> Ses &amp; Dil:</span>
            <div class="smart-sources-cat-tabs" id="smart-sources-cat-tabs">
              <button type="button" class="smart-cat-tab ${J==="dubbed"?"active":""}" data-cat="dubbed" id="smart-tab-dubbed">
                <span>🇹🇷 Dublaj</span>
                <span class="smart-cat-count" id="smart-cat-dubbed-count"></span>
              </button>
              <button type="button" class="smart-cat-tab ${J==="subtitled"?"active":""}" data-cat="subtitled" id="smart-tab-subtitled">
                <span>💬 Altyazılı</span>
                <span class="smart-cat-count" id="smart-cat-subtitled-count"></span>
              </button>
            </div>
          </div>

          <div class="smart-sources-picker-wrap">
            <span class="smart-sources-label">Yayın:</span>
            <div class="smart-sources-picker-controls">
              <button type="button" class="smart-source-nav-btn" id="btn-smart-source-prev" title="Önceki Kaynak (1 tıkla geç)">
                <i data-lucide="chevron-left" style="width:14px;height:14px;"></i>
              </button>

              <button type="button" class="smart-source-trigger" id="smart-source-trigger" title="Yayın Kaynağını Değiştir">
                <span class="smart-source-dot dot-active" id="smart-source-dot"></span>
                <span class="smart-source-name" id="smart-source-name">${si()}</span>
                <i data-lucide="chevron-down" class="smart-source-arrow" id="smart-source-arrow" style="width:13px;height:13px;"></i>
              </button>

              <button type="button" class="smart-source-nav-btn" id="btn-smart-source-next" title="Sonraki Kaynak (1 tıkla geç)">
                <i data-lucide="chevron-right" style="width:14px;height:14px;"></i>
              </button>
            </div>

            <!-- Floating Glassmorphic Dropdown for Fast Direct Selection -->
            <div class="smart-sources-dropdown hidden" id="smart-sources-dropdown">
              <div class="smart-sources-dropdown-header">
                <span>Tüm Yayın Sunucuları</span>
                <span id="smart-sources-dropdown-count">0 Kaynak</span>
              </div>
              <div class="smart-sources-dropdown-list" id="smart-sources-dropdown-list">
                <!-- Dynamically rendered list of servers -->
              </div>
            </div>
          </div>
        </div>

        <!-- SEZONLAR SECTION (Only for TV Series) -->
        ${ae&&m==="short-drama"?`
          <section class="dizisol-seasons-section short-drama-episodes">
            <div class="dizisol-seasons-header"><h4>BÖLÜMLER</h4><span class="dizisol-episodes-count">${h.length||F} Bölüm</span></div>
            <div class="short-drama-episode-rail">
              ${h.map(e=>`
                <button class="short-drama-episode-card ${Number(e.episode)===Number(q)?"is-current":""}" type="button" data-drama-season="${e.season}" data-drama-episode="${e.episode}">
                  <span class="short-drama-episode-image">${e.thumb?`<img loading="lazy" src="${e.thumb}" alt="${e.title}" />`:`<span>${e.episode}</span>`}<b>${Number(e.episode)===Number(q)?"ŞİMDİ OYNUYOR":`${e.episode}. BÖLÜM`}</b></span>
                  <span class="short-drama-episode-name">${e.title}</span>
                </button>`).join("")}
            </div>
          </section>
        `:ae?`
          <div class="dizisol-seasons-section">
            <div class="dizisol-seasons-header">
              <h4>SEZONLAR</h4>
              <span class="dizisol-episodes-count" id="dizisol-episodes-total">Bölümler Yükleniyor...</span>
            </div>
            
            <!-- Season Tabs -->
            <div class="dizisol-season-tabs-rail">
              <div class="dizisol-season-tabs" id="dizisol-season-tabs">
                <!-- Injected dynamically -->
              </div>
            </div>

            <!-- Episodes Carousel -->
            <div class="dizisol-carousel-wrapper">
              <button class="carousel-nav-btn left" id="btn-carousel-left" title="Önceki Bölümler">
                <i data-lucide="chevron-left" style="width:20px;height:20px"></i>
              </button>
              <div class="dizisol-episodes-carousel" id="dizisol-episodes-carousel">
                <div class="drawer-loading">
                  <div class="drawer-spinner"></div>
                  <p>Bölümler hazırlanıyor...</p>
                </div>
              </div>
              <button class="carousel-nav-btn right" id="btn-carousel-right" title="Sonraki Bölümler">
                <i data-lucide="chevron-right" style="width:20px;height:20px"></i>
              </button>
            </div>
            <div class="dizisol-carousel-scroll-track" id="dizisol-carousel-scroll-track">
              <div class="dizisol-carousel-scroll-thumb" id="dizisol-carousel-scroll-thumb"></div>
            </div>
          </div>
          <!-- BENZER DİZİLER SECTION — collapsible -->
          <button type="button" class="player-reco-toggle" id="btn-player-reco-toggle">
            <i data-lucide="sparkles"></i>
            <span>Benzer Yapımlar &amp; Öneriler</span>
            <i data-lucide="chevron-down" class="chevron-icon"></i>
          </button>
          <div class="player-reco-panel" id="player-reco-panel">
            <div class="player-reco-panel-inner">
              <div class="dizisol-similar-section" id="dizisol-similar-section"></div>
            </div>
          </div>
        `:`
          <!-- FILM BILGI, EKIP VE BENZER FILMLER (Only for Movies) -->
          <!-- Reco toggle for movies -->
          <button type="button" class="player-reco-toggle" id="btn-player-reco-toggle">
            <i data-lucide="sparkles"></i>
            <span>Film Detayları &amp; Öneriler</span>
            <i data-lucide="chevron-down" class="chevron-icon"></i>
          </button>
          <div class="player-reco-panel" id="player-reco-panel">
            <div class="player-reco-panel-inner">
              <div class="dizisol-movie-section" id="dizisol-movie-section">
                <div class="drawer-loading" style="display:flex;align-items:center;gap:0.75rem;padding:1.5rem;color:#9ca3af;">
                  <div class="drawer-spinner" style="width:20px;height:20px;border:2px solid rgba(245,158,11,0.2);border-top-color:#f59e0b;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
                  <p style="margin:0;font-size:0.85rem;">Film detayları ve benzer öneriler hazırlanıyor...</p>
                </div>
              </div>
            </div>
          </div>
        `}
      </div>

      <!-- Modern Footer Action Bar -->
      <div class="player-footer-bar">
        <div class="player-footer-left">
          <button id="btn-halfway-player" class="btn-footer-pill" title="Kaldığım Yeri Kaydet (20. dk)">
            <i data-lucide="clock" style="width: 14px; height: 14px; color: #fbbf24;"></i>
            <span>⏳ Yarıda Bırak</span>
          </button>
          <span class="player-status-badge">
            <i data-lucide="shield-check" style="width: 13px; height: 13px; color: #10b981;"></i>
            <span>Akıllı Güven Koruması Aktif</span>
          </span>
        </div>
        <div id="player-nav-btn-group" class="player-footer-right player-nav-btn-row">
          ${rn()}
        </div>
      </div>
    </div>

    <!-- Floating Glassmorphism Source Selector Modal -->
    <div class="player-sources-popover hidden" id="player-sources-popover">
      <div class="sources-popover-backdrop" id="sources-popover-backdrop"></div>
      <div class="sources-popover-content">
        <div class="sources-popover-header">
          <div class="sources-header-title">
            <i data-lucide="layers" style="width:16px;height:16px;color:#f59e0b"></i>
            <h4>Yayın Hatları & Sunucular</h4>
          </div>
          <button class="btn-close-popover" id="btn-close-sources-popover">
            <i data-lucide="x" style="width:16px;height:16px"></i>
          </button>
        </div>
        <div class="sources-popover-body">
          <div class="sources-category-tabs" id="sources-category-tabs">
            <button type="button" class="sources-cat-tab ${J==="dubbed"?"active":""}" data-cat="dubbed" id="sources-tab-dubbed">
              <span class="cat-tab-icon">🇹🇷</span>
              <span class="cat-tab-label">Türkçe Dublaj</span>
              <span class="cat-tab-count" id="sources-cat-dubbed-count"></span>
            </button>
            <button type="button" class="sources-cat-tab ${J==="subtitled"?"active":""}" data-cat="subtitled" id="sources-tab-subtitled">
              <span class="cat-tab-icon">💬</span>
              <span class="cat-tab-label">Türkçe Altyazılı</span>
              <span class="cat-tab-count" id="sources-cat-subtitled-count"></span>
            </button>
          </div>
          <p class="sources-popover-info">
            Yayınlar güven sıralamasına göre otomatik açılır. Herhangi bir hat yanıt vermezse sistem sıradaki hatta kesintisiz geçiş yapar.
          </p>
          <div class="sources-list" id="sources-popover-list">
            <!-- Rendered sources -->
          </div>
        </div>
      </div>
    </div>

    ${Wt()?`<!-- Floating Glassmorphism Download Hub Modal -->
    <div class="player-download-popover hidden" id="player-download-popover">
      <div class="download-popover-backdrop" id="download-popover-backdrop"></div>
      <div class="download-popover-content">
        <div class="download-popover-header">
          <div class="download-header-title">
            <i data-lucide="download" style="width:18px;height:18px;color:#10b981"></i>
            <h4 id="download-popover-heading">İndirme Merkezi</h4>
          </div>
          <button class="btn-close-popover" id="btn-close-download-popover" type="button" title="Kapat">
            <i data-lucide="x" style="width:16px;height:16px"></i>
          </button>
        </div>
        <div class="download-popover-body" id="download-popover-body">
          <!-- Rendered dynamically by openDownloadModal -->
        </div>
      </div>
    </div>
    `:""}
  `,re&&(w.classList.add("player-offline-playback"),w.querySelector(".dizisol-cinema-body")?.remove(),w.querySelector(".player-footer-bar")?.remove(),w.querySelector(".player-header-toggle")?.remove(),w.querySelector(".short-drama-artwork")?.remove()),w.classList.remove("hidden"),document.body.style.overflow="hidden",ge(w),Ws(),Ze();const aa=(e=window.__cinepulseDecisionRoomPresence)=>{if(!f||!e||e.roomCode!==f.roomCode)return;if(He=e.syncMode==="strict"?"strict":"smooth",He!=="strict"&&Si&&(Si=!1,Ka.clear(),w.querySelector("#hls-video-player")?.play?.().catch(()=>{})),He!=="smooth"&&ei){ei=!1,Wa.clear();const S=w.querySelector("#hls-video-player");ti=Date.now()+2500,S?.play?.().catch(()=>{})}if(He!=="smooth"&&ii.clear(),He!=="smooth"&&$i){$i=!1;const S=w.querySelector("#hls-video-player");ti=Date.now()+2500,S?.play?.().catch(()=>{})}Array.isArray(e.chatMessages)&&e.chatMessages.filter(S=>S?.senderId!==e.selfId).forEach(S=>Gi(S));const a=w.querySelector("#room-player-status"),t=w.querySelector("#room-player-members"),c=w.querySelector("#room-player-episode"),b=w.querySelector("#room-player-source"),$=w.querySelector("#room-cloud-member-badge"),z=He==="strict"?"Herkesle senkron":"Akıcı mod";if(a&&(a.textContent=e.isHost?`${e.participants.length} kişi bağlı · ${z}`:`${e.participants.length} kişi bağlı · ${z}`),$&&($.textContent=String(e.participants.length||1)),t&&(t.innerHTML=e.participants.slice(0,4).map(S=>`<span title="${S.nickname}">${S.role==="moderator"?"♛":"●"} ${S.nickname}</span>`).join("")),c&&(c.textContent=ae?`S${L} · B${q}`:"Film"),b){const S=Qi();b.textContent=S?.name?`Ortak kaynak: ${S.name}`:"Ortak kaynak aranıyor…"}};function ho(){const e=w.querySelector("#btn-room-cloud-toggle"),a=w.querySelector("#room-cloud-popover"),t=w.querySelector("#btn-room-cloud-close");if(!e||!a)return;const c=b=>{a.hidden=!b,e.setAttribute("aria-expanded",String(b)),e.classList.toggle("active",b),b&&ge(a)};e.addEventListener("click",b=>{b.stopPropagation(),c(a.hidden)}),t?.addEventListener("click",b=>{b.stopPropagation(),c(!1)}),be.on(document,"click",b=>{!a.hidden&&!a.contains(b.target)&&!e.contains(b.target)&&c(!1)}),be.on(document,"keydown",b=>{b.key==="Escape"&&!a.hidden&&(c(!1),b.stopPropagation())})}f&&(aa(),ho(),w.querySelector("#btn-room-return")?.addEventListener("click",()=>{Ti(),window.setTimeout(()=>zo(),0)}),w.querySelector("#btn-room-chat")?.addEventListener("click",()=>{const e=w.querySelector("#room-cloud-popover");e&&!e.hidden&&(e.hidden=!0,w.querySelector("#btn-room-cloud-toggle")?.setAttribute("aria-expanded","false"),w.querySelector("#btn-room-cloud-toggle")?.classList.remove("active")),Fs()}),be.on(window,"cinepulse:decision-room-presence",e=>aa(e.detail)));async function es(e){if(gi.has(e))return gi.get(e);if(!n)return[];try{const a=await fetch(`https://api.themoviedb.org/3/tv/${n}/season/${e}?api_key=${Ia}&language=tr-TR`);if(a&&a.ok){const c=(await a.json()).episodes||[];return gi.set(e,c),c}}catch{}return[]}async function Nt(){const e=document.getElementById("dizisol-season-tabs"),a=document.getElementById("dizisol-episodes-carousel"),t=document.getElementById("dizisol-episodes-total"),b=Te.map(Y=>{let H=`${Y.season_number}. Sezon`;return Y.season_number===0?H=Y.name||"Özel Bölümler":Y.name&&(Y.name.toLowerCase().includes("sezon")||!Y.name.toLowerCase().includes(ue.toLowerCase()))&&(H=Y.name),`
        <button class="dizisol-season-tab ${Y.season_number===_e?"active":""}" data-season="${Y.season_number}">
          <span>${H}</span>
        </button>
      `}).join("");if(e){e.innerHTML=b,ge(e),e.querySelectorAll(".dizisol-season-tab").forEach(j=>{j.addEventListener("click",()=>{_e=parseInt(j.getAttribute("data-season"),10),j.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"}),Nt()})});const Y=e.querySelector(".dizisol-season-tab.active");Y&&et(()=>{Y.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})},120);const H=document.querySelector(".dizisol-season-tabs-rail")||e;if(H&&!H._hasWheel){H._hasWheel=!0,H.addEventListener("wheel",le=>{le.deltaY!==0&&H.scrollWidth>H.clientWidth&&(le.preventDefault(),H.scrollLeft+=le.deltaY)},{passive:!1});let j=!1,B=0,he=0,ie=!1;H.addEventListener("mousedown",le=>{le.button===0&&(j=!0,ie=!1,B=le.pageX-H.offsetLeft,he=H.scrollLeft)}),be.on(window,"mousemove",le=>{if(!j)return;const V=(le.pageX-H.offsetLeft-B)*1.5;Math.abs(V)>4&&(ie=!0),H.scrollLeft=he-V}),be.on(window,"mouseup",()=>{j&&(j=!1,et(()=>{ie=!1},50))}),H.addEventListener("click",le=>{ie&&(le.preventDefault(),le.stopPropagation())},!0)}}const $=`
      <div class="drawer-loading" style="display:flex;align-items:center;gap:0.75rem;padding:1.5rem;color:#94a3b8;">
        <div class="drawer-spinner" style="width:20px;height:20px;border:2px solid rgba(255,255,255,0.2);border-top-color:#e50914;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
        <p style="margin:0;font-size:0.85rem;">Bölümler yükleniyor...</p>
      </div>
    `;a&&(a.innerHTML=$);const z=_e,S=await es(z);if(N||z!==_e)return;const k=S&&S.length>0?S.length:Ai(_e)||12;t&&(t.textContent=`${k} Bölüm`);let E="";if(!S||S.length===0?E=Array.from({length:k},(H,j)=>j+1).map(H=>{const j=_e===L&&H===q,B=mi(n,_e,H);return`
          <div class="dizisol-ep-card ${j?"playing":""} ${B?"is-watched-card":""}" data-season="${_e}" data-episode="${H}">
            <div class="dizisol-ep-thumb-box">
              <div class="ep-thumb-fallback" style="display:flex;align-items:center;justify-content:center;height:100%;color:#475569;"><i data-lucide="film" style="width:24px;height:24px"></i></div>
              <div class="dizisol-ep-thumb-scrim"></div>
              <span class="dizisol-ep-badge-num ${j?"active":""}">${H}. Bölüm</span>
              <button class="dizisol-ep-watch-toggle ${B?"is-watched":""}" data-season="${_e}" data-episode="${H}" title="${B?"İzlendi (Kaldırmak için tıkla)":"İzlendi Olarak İşaretle"}">
                <i data-lucide="${B?"check-circle-2":"eye"}" style="width: 13px; height: 13px;"></i>
                <span class="ep-watch-text">${B?"İzlendi":"İşaretle"}</span>
              </button>
              ${Wt()?`<button class="dizisol-ep-download-btn" data-season="${_e}" data-episode="${H}" title="Bu bölümü indir" type="button">
                <i data-lucide="download" style="width:12px;height:12px"></i>
              </button>`:""}
              ${j?`
                <div class="dizisol-ep-play-circle">
                  <i data-lucide="play" style="width:16px;height:16px;fill:#0b0f19;color:#0b0f19;margin-left:2px;"></i>
                </div>
              `:`
                <div class="dizisol-ep-play-overlay">
                  <i data-lucide="play" style="width:28px;height:28px;"></i>
                </div>
              `}
            </div>
            <div class="dizisol-ep-info">
              <h5 class="dizisol-ep-title" data-base-title="${H}. Bölüm" title="${H}. Bölüm">${H}. Bölüm ${B?"✓":""}</h5>
            </div>
          </div>
        `}).join(""):E=S.map(Y=>{const H=Y.episode_number,j=_e===L&&H===q,B=mi(n,_e,H),he=Y.still_path?`https://image.tmdb.org/t/p/w400${Y.still_path}`:"",ie=Y.runtime?`${Y.runtime} dk`:"",le=Y.air_date?Y.air_date.substring(0,7):"";return`
          <div class="dizisol-ep-card ${j?"playing":""} ${B?"is-watched-card":""}" data-season="${_e}" data-episode="${H}">
            <div class="dizisol-ep-thumb-box">
              ${he?`<img src="${he}" alt="B${H}" loading="lazy" />`:'<div class="ep-thumb-fallback" style="display:flex;align-items:center;justify-content:center;height:100%;color:#475569;"><i data-lucide="film" style="width:24px;height:24px"></i></div>'}
              <div class="dizisol-ep-thumb-scrim"></div>
              <span class="dizisol-ep-badge-num ${j?"active":""}">${H}. Bölüm</span>
              <button class="dizisol-ep-watch-toggle ${B?"is-watched":""}" data-season="${_e}" data-episode="${H}" title="${B?"İzlendi (Kaldırmak için tıkla)":"İzlendi Olarak İşaretle"}">
                <i data-lucide="${B?"check-circle-2":"eye"}" style="width: 13px; height: 13px;"></i>
                <span class="ep-watch-text">${B?"İzlendi":"İşaretle"}</span>
              </button>
              ${Wt()?`<button class="dizisol-ep-download-btn" data-season="${_e}" data-episode="${H}" title="Bu bölümü indir" type="button">
                <i data-lucide="download" style="width:12px;height:12px"></i>
              </button>`:""}
              ${ie?`<span class="dizisol-ep-duration">${ie}</span>`:""}
              ${j?`
                <div class="dizisol-ep-play-circle">
                  <i data-lucide="play" style="width:16px;height:16px;fill:#0b0f19;color:#0b0f19;margin-left:2px;"></i>
                </div>
              `:`
                <div class="dizisol-ep-play-overlay">
                  <i data-lucide="play" style="width:28px;height:28px;"></i>
                </div>
              `}
            </div>
            <div class="dizisol-ep-info">
              <h5 class="dizisol-ep-title" data-base-title="${Y.name||`${H}. Bölüm`}" title="${Y.name||`${H}. Bölüm`}">${Y.name||`${H}. Bölüm`}${B?" ✓":""}</h5>
              ${le?`<span class="dizisol-ep-date">${le}</span>`:""}
            </div>
          </div>
        `}).join(""),a){a.innerHTML=E,a.querySelectorAll(".dizisol-ep-watch-toggle").forEach(j=>{j.addEventListener("click",B=>{B.stopPropagation(),B.preventDefault();const he=parseInt(j.getAttribute("data-season"),10),ie=parseInt(j.getAttribute("data-episode"),10),Ae=Do(n,he,ie,{title:ue,posterPath:y,backdropPath:g,type:Le?"anime":"tv",isAnime:Le,isSeries:!0}).completed;j.classList.toggle("is-watched",Ae),j.setAttribute("title",Ae?"İzlendi (Kaldırmak için tıkla)":"İzlendi Olarak İşaretle"),j.innerHTML=`
            <i data-lucide="${Ae?"check-circle-2":"eye"}" style="width: 13px; height: 13px;"></i>
            <span class="ep-watch-text">${Ae?"İzlendi":"İşaretle"}</span>
          `,ge(j);const V=j.closest(".dizisol-ep-card");if(V){V.classList.toggle("is-watched-card",Ae);const ze=V.querySelector(".dizisol-ep-title");if(ze){const K=ze.getAttribute("data-base-title")||ze.textContent.replace(/\s*✓.*$/,"");ze.textContent=`${K}${Ae?" ✓":""}`}}he===L&&ie===q&&(Ne=Ae,Ha(Ae)),G(Ae?`✓ S${he} B${ie} izlendi olarak işaretlendi.`:`S${he} B${ie} izlendi işareti kaldırıldı.`,"info")})}),a.querySelectorAll(".dizisol-ep-download-btn").forEach(j=>{j.addEventListener("click",B=>{B.stopPropagation(),B.preventDefault();const he=parseInt(j.getAttribute("data-season"),10),ie=parseInt(j.getAttribute("data-episode"),10);lo(he,ie)})}),a.querySelectorAll(".dizisol-ep-card").forEach(j=>{j.addEventListener("click",B=>{if(B.target.closest(".dizisol-ep-watch-toggle")||B.target.closest(".dizisol-ep-download-btn"))return;const he=parseInt(j.getAttribute("data-season"),10),ie=parseInt(j.getAttribute("data-episode"),10);he===L&&ie===q||Ht(he,ie)})});const Y=a.querySelector(".dizisol-ep-card.playing");Y&&et(()=>{Y.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})},150);const H=()=>{const j=a.scrollWidth-a.clientWidth,B=document.getElementById("dizisol-carousel-scroll-thumb");if(B&&j>0){const he=a.scrollLeft/j;B.style.transform=`translateX(${he*150}%)`}};a.removeEventListener("scroll",H),a.onscroll=H}const X=document.getElementById("btn-carousel-left"),oe=document.getElementById("btn-carousel-right");X&&a&&(X.onclick=()=>a.scrollBy({left:-360,behavior:"smooth"})),oe&&a&&(oe.onclick=()=>a.scrollBy({left:360,behavior:"smooth"})),ge(w),Ze()}ae&&!ne?(Nt(),Js(L,q)):ne||Zs(),m==="short-drama"&&w.querySelectorAll(".short-drama-episode-card").forEach(e=>{e.addEventListener("click",async()=>{const a=Number(e.dataset.dramaSeason)||1,t=Number(e.dataset.dramaEpisode)||1;if(t===Number(q)&&a===Number(L))return;const c=h.find(b=>Number(b.season)===a&&Number(b.episode)===t);try{await As({type:"tv",tmdbId:n,title:`${ue} - B${t}`,seriesTitle:ue,season:a,episode:t,posterPath:y,backdropPath:g,playerVariant:m,seriesOverview:x,episodeArtworkPath:c?.thumb||y,shortDramaEpisodes:h,maxEpisodes:F,seasonsList:[{season_number:a,episode_count:F}]})}catch{G("Bölüm açılırken bir sorun oluştu.","error")}})});async function yo(){const e=document.getElementById("player-quick-episodes-rail"),a=document.getElementById("quick-ep-count-text");if(!e)return;e.innerHTML=`
      <div class="quick-ep-loading">
        <div class="quick-ep-spinner"></div>
        <span>Bölümler yükleniyor...</span>
      </div>
    `;const t=L,c=await es(t);if(N||t!==L)return;const b=c&&c.length>0?c.length:Ai(L)||12;a&&(a.textContent=`${b} Bölüm`),!c||c.length===0?e.innerHTML=Array.from({length:b},(z,S)=>S+1).map(z=>{const S=z===q,k=mi(n,L,z);return`
          <div class="quick-ep-card ${S?"active":""}" data-season="${L}" data-episode="${z}">
            <div class="quick-ep-pill">
              <span class="quick-ep-num">B${z}</span>
              ${S?'<span class="quick-ep-now">Oynatılıyor</span>':""}
              ${k&&!S?'<i data-lucide="check" class="quick-ep-watched"></i>':""}
            </div>
          </div>
        `}).join(""):e.innerHTML=c.map(z=>{const S=z.episode_number,k=S===q,E=mi(n,L,S),X=z.still_path?`https://image.tmdb.org/t/p/w200${z.still_path}`:"";return`
          <div class="quick-ep-card ${k?"active":""}" data-season="${L}" data-episode="${S}">
            ${X?`<div class="quick-ep-thumb"><img src="${X}" alt="B${S}" loading="lazy" /></div>`:""}
            <div class="quick-ep-info">
              <div class="quick-ep-title-row">
                <span class="quick-ep-num">B${S}</span>
                <span class="quick-ep-name">${z.name||`${S}. Bölüm`}</span>
              </div>
              ${k?'<span class="quick-ep-now">Oynatılıyor</span>':E?'<span class="quick-ep-watched-label">İzlendi</span>':""}
            </div>
          </div>
        `}).join(""),e.querySelectorAll(".quick-ep-card").forEach(z=>{z.addEventListener("click",()=>{const S=parseInt(z.getAttribute("data-season"),10),k=parseInt(z.getAttribute("data-episode"),10);S===L&&k===q||Ht(S,k)})}),ge(w);const $=e.querySelector(".quick-ep-card.active");$&&et(()=>{$.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})},100)}function zi(e){const a=document.getElementById("player-episode-drawer");a&&(Gt=typeof e=="boolean"?e:!Gt,Gt?(a.classList.remove("hidden"),_e=L,Nt()):a.classList.add("hidden"))}const ln=document.getElementById("btn-toggle-drawer"),cn=document.getElementById("btn-close-drawer"),dn=document.getElementById("btn-drawer-trigger-mobile");ln&&ln.addEventListener("click",()=>zi()),cn&&cn.addEventListener("click",()=>zi(!1)),dn&&dn.addEventListener("click",()=>zi());function sa(e){const a=document.getElementById("player-shortcuts-popover");a&&(gt=typeof e=="boolean"?e:!gt,gt?a.classList.remove("hidden"):a.classList.add("hidden"))}const un=document.getElementById("btn-player-shortcuts"),pn=document.getElementById("btn-close-shortcuts");un&&un.addEventListener("click",()=>sa()),pn&&pn.addEventListener("click",()=>sa(!1));const mn=document.getElementById("btn-player-fullscreen");mn&&mn.addEventListener("click",()=>{Os();const e=document.getElementById("cinema-modal-box")||document.documentElement,a=document.getElementById("video-iframe"),t=document.getElementById("hls-video-player"),b=document.getElementById("direct-video-wrapper")||a||t||e;document.fullscreenElement?document.exitFullscreen?document.exitFullscreen().catch(()=>{}):document.webkitExitFullscreen&&document.webkitExitFullscreen():b&&b.requestFullscreen?b.requestFullscreen().catch(()=>e.requestFullscreen().catch(()=>{})):b&&b.webkitRequestFullscreen?b.webkitRequestFullscreen():e.requestFullscreen&&e.requestFullscreen().catch(()=>{})});function fn(){const e=document.getElementById("btn-prev-episode");e&&e.addEventListener("click",t=>{t.preventDefault();const c=e.getAttribute("data-action");if(c==="prev-ep"&&q>1)Ht(L,q-1);else if(c==="prev-season"){const b=parseInt(e.getAttribute("data-prev-season"),10)||1,$=parseInt(e.getAttribute("data-prev-ep"),10)||1;Ht(b,$)}});const a=document.getElementById("btn-next-episode");a&&a.addEventListener("click",t=>{if(t.preventDefault(),ne)return;yr(n,L,q,!0,{title:ue,posterPath:y,backdropPath:g,type:Le?"anime":ae?"tv":"movie",isAnime:Le,duration:ct}),a.getAttribute("data-action")==="next-season"?Ht(L+1,1):Ht(L,q+1)})}fn();const ts=()=>{ne||(Ne=!Ne,ae?yr(n,L,q,Ne,{title:ue,posterPath:y,backdropPath:g,type:Le?"anime":"tv",isAnime:Le,duration:ct}):Co(n,Ne,{title:ue,posterPath:y,backdropPath:g,type:Le?"anime":"movie",isAnime:Le,duration:ct}),[document.getElementById("btn-toggle-watched-player"),document.getElementById("btn-toggle-watched-mobile")].forEach(e=>{if(!e)return;const a=e.querySelector("span"),t=e.querySelector("[data-lucide]");a&&(a.textContent=Ne?"İzlendi":"İzlendi Yap"),t&&t.setAttribute("data-lucide",Ne?"check-circle-2":"check"),Ne?e.classList.add("watched-active"):e.classList.remove("watched-active")}),G(Ne?"✓ İzlendi olarak işaretlendi.":"İzlendi işareti kaldırıldı.","success"),ae&&Nt(),ge(w))},bn=()=>{ne||(gr({id:n,title:ue,posterPath:y,backdropPath:g,type:Le?"anime":ae?"tv":"movie",isAnime:Le,isSeries:ae,season:L,episode:q,currentTime:1200,duration:ct}),G("⏳ 20. dakikada yarıda bırakıldı olarak kaydedildi.","info"))},hn=document.getElementById("btn-toggle-watched-player"),yn=document.getElementById("btn-toggle-watched-mobile");hn&&hn.addEventListener("click",ts),yn&&yn.addEventListener("click",ts);const gn=document.getElementById("btn-halfway-player"),vn=document.getElementById("btn-halfway-mobile");gn&&gn.addEventListener("click",bn),vn&&vn.addEventListener("click",bn);function st(){const e=document.getElementById("player-server-toolbar");if(e){if(e.innerHTML=fo(),!e.dataset.scrollAttached){e.dataset.scrollAttached="true",e.addEventListener("wheel",b=>{b.deltaY!==0&&(b.preventDefault(),e.scrollLeft+=b.deltaY*1.5)},{passive:!1});let a=!1,t,c;e.addEventListener("mousedown",b=>{a=!0,t=b.pageX-e.offsetLeft,c=e.scrollLeft}),e.addEventListener("mouseleave",()=>{a=!1}),e.addEventListener("mouseup",()=>{a=!1}),e.addEventListener("mousemove",b=>{if(!a)return;b.preventDefault();const z=(b.pageX-e.offsetLeft-t)*2;e.scrollLeft=c-z})}e.querySelectorAll(".server-btn").forEach(a=>{a.addEventListener("click",t=>{t.preventDefault();const c=parseInt(a.getAttribute("data-index"),10);if(c!==de&&It()){if(f&&!Ji(W[c])){G("Birlikte izleme için senkronlanabilir doğrudan bir yayın hattı seçin.","info");return}de=c,e.querySelectorAll(".server-btn").forEach(b=>b.classList.remove("active")),a.classList.add("active"),a.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"}),Ie()}})})}}function go(e,a){if(!e)return;const t=document.getElementById("direct-video-wrapper")||e.closest(".direct-video-wrapper");if(!t)return;const{on:c,setTimeout:b,clearTimeout:$,setInterval:z,clearInterval:S}=Q,k=t.querySelector("#custom-btn-play");t.querySelector("#custom-player-controls");const E=t.querySelector("#custom-time-display"),X=t.querySelector("#custom-timeline-container"),oe=t.querySelector("#custom-timeline-played"),Y=t.querySelector("#custom-timeline-buffered"),H=t.querySelector("#custom-timeline-thumb"),j=t.querySelector("#custom-timeline-tooltip"),B=t.querySelector("#custom-volume-wrap"),he=t.querySelector("#custom-btn-volume"),ie=t.querySelector("#custom-volume-slider"),le=t.querySelector("#custom-volume-badge"),Ae=t.querySelector("#custom-volume-popover"),V=t.querySelector("#custom-btn-fullscreen"),ze=t.querySelector("#custom-btn-more"),K=t.querySelector("#custom-player-menu"),pe=t.querySelector("#custom-menu-main"),Me=t.querySelector("#custom-menu-subview"),Se=t.querySelector("#custom-menu-subview-title"),we=t.querySelector("#custom-menu-options-list"),Ye=t.querySelector("#custom-menu-back-btn"),Ce=t.querySelector("#custom-center-play-indicator"),Ue=t.querySelector("#custom-floating-pill-bar");Ue&&pe&&window.matchMedia("(max-width: 1024px)").matches&&pe.prepend(Ue);const Re=t.querySelector("#custom-center-transport"),In=t.querySelector(".custom-controls-transport-row");Re&&In&&Re.appendChild(In);const Bn=t.querySelector("#custom-audio-sub-popover");t.querySelector("#audio-sub-tab-audio"),t.querySelector("#audio-sub-tab-subs"),t.querySelector("#audio-sub-pane-audio"),t.querySelector("#audio-sub-pane-subs"),t.querySelector("#audio-sub-options-audio"),t.querySelector("#audio-sub-options-subs"),t.querySelector("#audio-sub-close-btn"),t.querySelector("#custom-btn-rewind-10"),t.querySelector("#custom-btn-forward-10");const Je=t.querySelector("#custom-brightness-wrap"),_n=t.querySelector("#custom-btn-brightness"),Ci=t.querySelector("#custom-brightness-slider"),Ln=t.querySelector("#custom-brightness-badge"),ns=t.querySelector("#custom-brightness-popover");if(f&&!We()){t.classList.add("room-participant-locked");let v=0;const _=M=>!!M.closest("#custom-volume-wrap, #custom-brightness-wrap, #custom-btn-fullscreen"),C=M=>{_(M.target)||M.target.closest("video")&&M.type==="click"||M.target.closest("button, input, .custom-timeline-container, .custom-player-menu, .custom-binge-card, .dual-audio-bar")&&(M.preventDefault(),M.stopImmediatePropagation(),Date.now()-v>1800&&(v=Date.now(),G("Oynatma kontrolü moderatörde. Ses, parlaklık ve tam ekran sana açık.","info")))};t.addEventListener("click",C,!0),t.addEventListener("dblclick",C,!0)}const En=t.querySelector("#custom-btn-screen-lock"),Ii=t.querySelector("#custom-btn-screen-unlock"),ni=t.querySelector("#custom-btn-skip-intro"),jt=t.querySelector("#custom-binge-card"),ca=t.querySelector("#binge-sec-num"),Rn=t.querySelector("#binge-card-jump-btn"),Mn=t.querySelector("#binge-card-close-btn"),ri=t.querySelector("#custom-btn-sleep"),Un=t.querySelector("#custom-menu-item-sleep-menu"),da=t.querySelector("#custom-menu-active-sleep"),oi=t.querySelector("#custom-sleep-curtain"),rs=t.querySelector("#custom-gesture-hud");t.querySelector("#gesture-hud-icon");const Pn=t.querySelector("#gesture-hud-text"),qn=t.querySelector("#gesture-hud-fill"),Nn=t.querySelector("#player-ambient-glow"),Hn=t.querySelector("#player-ambient-canvas");Hn&&(Hn.style.display="none"),Nn&&(Nn.style.background="radial-gradient(circle at center, rgba(245, 158, 11, 0.16) 0%, rgba(20, 184, 166, 0.08) 50%, transparent 75%)");let Bt=!1;En&&(En.onclick=v=>{v.stopPropagation(),Bt=!0,t.classList.add("is-screen-locked"),Ii&&Ii.classList.remove("hidden"),xt(),t.classList.add("hide-controls"),G("🔒 Ekran kilitlendi. Dokunmalar korumalı.","info")}),Ii&&(Ii.onclick=v=>{v.stopPropagation(),Bt=!1,t.classList.remove("is-screen-locked"),Ii.classList.add("hidden"),Fe(),G("🔓 Ekran kilidi açıldı.","success")});let jn=!1;ni&&(ni.onclick=v=>{v.stopPropagation(),jn=!0,ni.classList.add("hidden");const _=e.currentTime||0,C=Math.max(_+80,85);e.currentTime=Math.min(e.duration||C,C),G("⚡ İntro başarıyla atlandı!","success")});let bt=null,Fn=!1,Bi=5;const Kn=()=>{bt&&(S(bt),bt=null),jt&&jt.classList.add("hidden");const v=document.getElementById("btn-next-episode");v&&(G("Sonraki bölüme geçiliyor...","info"),v.click())};Rn&&(Rn.onclick=v=>{v.stopPropagation(),Kn()}),Mn&&(Mn.onclick=v=>{v.stopPropagation(),Fn=!0,bt&&(S(bt),bt=null),jt&&jt.classList.add("hidden")});const ua=()=>{const v=e.paused;k&&k.dataset.paused!==String(v)&&(k.dataset.paused=String(v),k.innerHTML=`<i data-lucide="${v?"play":"pause"}" style="width: 20px; height: 20px;"></i>`,ge(k)),v&&t.classList.remove("hide-controls")},pa=()=>{e.paused?(e.play().catch(()=>{}),os("play")):(e.pause(),os("pause"))},li=v=>{const _=e.currentTime||0,C=e.duration||1/0,M=Math.max(0,Math.min(C,_+v));e.currentTime=M,nt?.("seek",{time:M}),os(v>0?"rotate-cw":"rotate-ccw"),G(v>0?"⏩ +10 saniye":"⏪ -10 saniye","info")};Re&&c(Re,"click",v=>{const _=v.target.closest("#custom-btn-play, #custom-btn-rewind-10, #custom-btn-forward-10");_&&(v.preventDefault(),v.stopPropagation(),_.id==="custom-btn-play"?pa():_.id==="custom-btn-rewind-10"?li(-10):li(10))},!0);let $t=it.brightness;const ma=(v,_=!0)=>{$t=Math.max(30,Math.min(150,v)),it.brightness=$t,e.style.filter=`brightness(${$t/100})`,Ci&&(Ci.value=$t),Ln&&(Ln.textContent=`%${$t}`);const C=t.querySelector("#custom-menu-active-brightness");C&&(C.textContent=`%${$t}`),_&&typeof nt=="function"&&nt("settings")};ns&&(ns.onclick=v=>v.stopPropagation(),ns.ontouchstart=v=>v.stopPropagation()),Ci&&(Ci.oninput=v=>{v.stopPropagation(),Lt(),ma(parseInt(Ci.value,10))}),_n&&(_n.onclick=v=>{if(v.stopPropagation(),Je){const _=Je.classList.contains("is-open");B&&B.classList.remove("is-open"),_?(Je.classList.remove("is-open"),Fe()):(Je.classList.add("is-open"),Lt())}});const os=v=>{Ce&&(Ce.innerHTML=`<i data-lucide="${v}" style="width: 32px; height: 32px;"></i>`,ge(Ce),Ce.classList.add("animate"),b(()=>Ce.classList.remove("animate"),350))};let Wn=0,On=0,ht=null;const Vn=()=>{if(!f?.roomCode||We()||He!=="smooth")return;const v=Date.now();v-On<5e3||(On=v,window.dispatchEvent(new CustomEvent("cinepulse:room-playback-progress",{detail:{roomCode:f.roomCode,time:e.currentTime,playing:!e.paused,buffering:!e.paused&&e.readyState<HTMLMediaElement.HAVE_FUTURE_DATA}})))},fa=v=>{if(!f?.roomCode||We()||He!=="strict")return;let _=0;try{for(let C=0;C<e.buffered.length;C+=1)if(e.buffered.start(C)<=e.currentTime&&e.buffered.end(C)>=e.currentTime){_=Math.max(0,e.buffered.end(C)-e.currentTime);break}}catch{}window.dispatchEvent(new CustomEvent("cinepulse:room-playback-health",{detail:{roomCode:f.roomCode,status:v,bufferedAhead:_}}))},nt=(v,_={})=>{!f?.roomCode||Jt||Date.now()<ti||!Number.isFinite(e.currentTime)||window.dispatchEvent(new CustomEvent("cinepulse:player-sync",{detail:{roomCode:f.roomCode,mediaId:f.mediaId,type:f.type,season:L,episode:q,action:v,source:Qi(),audioTrack:e._currentAudioTrack||null,settings:{...it,volume:e.volume,muted:e.muted},time:Number.isFinite(_.time)?_.time:e.currentTime||0,playing:typeof _.playing=="boolean"?_.playing:!e.paused,issuedAt:Date.now()}}))};if(e.playbackRate=it.speed,ma(it.brightness,!1),Qt){const v=Qt;Qt=null,window.setTimeout(()=>Va(v),0)}k&&(k.onclick=v=>{v.stopPropagation(),pa()}),e.onclick=v=>{if(Bt||f&&!We())return;if(Je&&Je.classList.contains("is-open")||B&&B.classList.contains("is-open")||K&&!K.classList.contains("hidden")){xt();return}v.pointerType==="touch"||window.matchMedia("(pointer: coarse)").matches||pa()},c(e,"play",()=>{ua(),Fe(),nt("play")}),c(e,"playing",()=>Fe()),c(e,"playing",()=>{ht&&$(ht),fa("ready")}),c(e,"canplay",()=>{ht&&$(ht),fa("ready")}),c(e,"waiting",()=>{ht&&$(ht),ht=b(()=>fa("buffering"),900)}),c(e,"stalled",()=>{ht&&$(ht),ht=b(()=>fa("buffering"),900)}),c(e,"pause",()=>{ua(),_i(!0),nt("pause")}),c(e,"ended",()=>{ua(),Ct(e.duration||e.currentTime,e.duration,!0,!0),f?.roomCode&&He==="smooth"&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-finished",{detail:{roomCode:f.roomCode,mediaId:f.mediaId,type:f.type,season:L,episode:q}})),so()}),c(e,"seeking",()=>nt("seek")),c(e,"seeked",()=>{_i(!0),nt("seek")}),c(e,"ratechange",()=>{it.speed=e.playbackRate||1,nt("settings")}),c(e,"volumechange",()=>nt("settings")),Q.setInterval(Vn,5e3);const _i=(v=!1,_=null)=>{if(!e)return;const C=e.currentTime,M=e.duration;if(isNaN(C)||C<0)return;const Z=_!==null?_:e.paused;Ct(C,M,null,v,Z)};e._persistProgress=_i,Q.on(e,"pause",()=>{_i(!0,!0)}),Q.on(e,"play",()=>{_i(!0,!1)});const _t=()=>{const v=e.currentTime||0,_=e.duration||0;mt=Math.round(v),E&&(E.textContent=`${Ot(v)} / ${Ot(_)}`);const C=t.querySelector("#custom-time-current");C&&(C.textContent=Ot(v));const M=t.querySelector("#custom-time-duration");M&&(M.textContent=_>0?Ot(_):"00:00");const Z=t.querySelector("#custom-time-remaining");if(Z){const ee=Math.max(0,_-v);Z.textContent=_>0?`-${Ot(ee)}`:"0:00"}if(_>0){const ee=Math.min(100,Math.max(0,v/_*100));if(oe&&(oe.style.width=`${ee}%`),H&&(H.style.left=`${ee}%`),e.buffered&&e.buffered.length>0){for(let ce=e.buffered.length-1;ce>=0;ce--)if(e.buffered.start(ce)<=v){const De=e.buffered.end(ce),fe=Math.min(100,De/_*100);Y&&(Y.style.width=`${fe}%`);break}}}if(ni&&(v>=10&&v<=90&&!jn?ni.classList.remove("hidden"):ni.classList.add("hidden")),jt&&ae&&_>70){const ee=_-v;ee<=40&&ee>3&&!Fn&&!bt&&(jt.classList.remove("hidden"),ge(jt),Bi=5,ca&&(ca.textContent=Bi),bt=z(()=>{Bi--,ca&&(ca.textContent=Bi),Bi<=0&&(S(bt),bt=null,Kn())},1e3))}};if(c(e,"timeupdate",_t),Q.on(e,"timeupdate",()=>{const v=Date.now();v-Wn>2e3&&(Wn=v,nt("state")),Vn(),f?.roomCode&&We()&&He==="smooth"&&ii.size&&ii.forEach((_,C)=>{e.currentTime>=_-20&&(ii.delete(C),window.dispatchEvent(new CustomEvent("cinepulse:room-playback-checkpoint",{detail:{roomCode:f.roomCode,targetId:C,action:"resume",mediaId:f.mediaId,type:f.type}})))})}),c(e,"durationchange",_t),c(e,"loadedmetadata",_t),c(e,"canplay",_t),c(e,"progress",_t),z(()=>{!e.paused&&!e.ended&&_t()},300),X){let v=null;const _=C=>{const M=X.getBoundingClientRect();if(!M.width||!Number.isFinite(e.duration)||e.duration<=0)return;const Z=Math.max(0,Math.min(1,(C.clientX-M.left)/M.width));v=Z*e.duration,H&&(H.style.left=`${Z*100}%`),oe&&(oe.style.width=`${Z*100}%`)};c(X,"pointerdown",C=>{C.button!==0||Bt||(C.preventDefault(),X.setPointerCapture(C.pointerId),_(C))}),c(X,"pointermove",C=>{if(X.hasPointerCapture(C.pointerId)&&_(C),!j)return;const M=X.getBoundingClientRect();if(!M.width)return;const Z=Math.max(0,Math.min(1,(C.clientX-M.left)/M.width));j.textContent=Ot(Z*(e.duration||0)),j.style.left=`${Z*100}%`}),c(X,"pointerup",C=>{const M=v;M!==null&&(e.currentTime=M,nt("seek",{time:M})),v=null,X.hasPointerCapture(C.pointerId)&&X.releasePointerCapture(C.pointerId),Fe()}),c(X,"pointercancel",()=>{v=null,_t(),Fe()})}const Ft=()=>{const v=e.muted?0:e.volume;if(ie&&(ie.value=v),le&&(le.textContent=e.muted?"%0":`%${Math.round(v*100)}`),he){let _="volume-2";e.muted||v===0?_="volume-x":v<.5&&(_="volume-1"),he.innerHTML=`<i data-lucide="${_}" style="width: 20px; height: 20px;"></i>`,ge(he)}};Ae&&(Ae.onclick=v=>v.stopPropagation(),Ae.ontouchstart=v=>v.stopPropagation()),he&&(he.onclick=v=>{if(v.stopPropagation(),B){const _=B.classList.contains("is-open");Je&&Je.classList.remove("is-open"),window.matchMedia("(pointer: coarse)").matches?_?(B.classList.remove("is-open"),Fe()):(B.classList.add("is-open"),Lt()):(e.muted=!e.muted,Ft())}else e.muted=!e.muted,Ft()}),ie&&(ie.oninput=v=>{v.stopPropagation(),Lt(),e.volume=parseFloat(ie.value),e.muted=!1,Ft()});const Yn=()=>{document.fullscreenElement?document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen&&document.webkitExitFullscreen():t.requestFullscreen?t.requestFullscreen():t.webkitRequestFullscreen?t.webkitRequestFullscreen():e.requestFullscreen?e.requestFullscreen().catch(()=>{}):t.webkitRequestFullscreen&&t.webkitRequestFullscreen()};V&&(V.onclick=v=>{v.stopPropagation(),Os(),Yn()}),e.ondblclick=v=>{v.stopPropagation();const _=e.getBoundingClientRect(),C=v.clientX-_.left;C<_.width*.35?li(-10):C>_.width*.65?li(10):Yn()},c(document,"fullscreenchange",()=>{Fe();const v=!!document.fullscreenElement;V&&(V.innerHTML=`<i data-lucide="${v?"minimize":"maximize"}" style="width: 20px; height: 20px;"></i>`,ge(V))});let Li=null,ci=null;const xt=(v=!0)=>{Je&&Je.classList.remove("is-open"),B&&B.classList.remove("is-open"),K&&K.classList.add("hidden"),Bn&&Bn.classList.add("hidden"),ci&&($(ci),ci=null),v&&Fe()},Lt=()=>{Fe(),Li&&$(Li),ci&&$(ci),ci=b(()=>{xt()},3500)},Et=document.getElementById("cinema-modal-box"),Fe=()=>{if(Bt){t.classList.add("hide-controls"),Et&&Et.classList.add("hide-controls");return}t.classList.remove("hide-controls"),Et&&Et.classList.remove("hide-controls"),Li&&$(Li),!e.paused&&!e.ended&&(Li=b(()=>{e.paused||(t.classList.add("hide-controls"),Et&&Et.classList.add("hide-controls"),xt(!1))},3e3))};let Xn=0;const Gn=()=>{const v=Date.now();v-Xn<300||(Xn=v,Fe())};if(c(t,"pointerenter",v=>{v.pointerType==="mouse"&&Gn()}),c(t,"pointerdown",Gn),c(w,"focusin",Fe),c(t,"mouseleave",()=>{e.paused||(t.classList.add("hide-controls"),Et&&Et.classList.add("hide-controls"),xt(!1))}),ze&&K){ze.onclick=xe=>{xe.stopPropagation(),K.classList.contains("hidden")?(di(),K.classList.remove("hidden"),t.classList.remove("hide-controls"),Lt()):xt()},c(document,"click",xe=>{(!t.contains(xe.target)||!K.contains(xe.target)&&!ze.contains(xe.target))&&K.classList.add("hidden"),Je&&!Je.contains(xe.target)&&Je.classList.remove("is-open"),B&&!B.contains(xe.target)&&B.classList.remove("is-open")});const v=t.querySelector("#custom-btn-subtitles-audio");v&&K&&(v.onclick=xe=>{if(xe.stopPropagation(),K.classList.contains("hidden")){di();const Kt=t.querySelector("#custom-menu-item-subs");Kt&&Kt.click(),K.classList.remove("hidden"),t.classList.remove("hide-controls"),Lt()}else xt()});const _=t.querySelector("#pill-btn-fit"),C=t.querySelector("#pill-fit-label");let M="contain";_&&(_.onclick=xe=>{xe.stopPropagation(),M==="contain"?(M="cover",e.style.objectFit="cover",C&&(C.textContent="Kapla"),_.classList.add("active"),G("⛶ Görüntü: Ekranı Kapla (Cover)","info")):M==="cover"?(M="fill",e.style.objectFit="fill",C&&(C.textContent="Yay"),_.classList.add("active"),G("⛶ Görüntü: Ekrana Yay (Fill)","info")):(M="contain",e.style.objectFit="contain",C&&(C.textContent="Sığdır"),_.classList.remove("active"),G("⛶ Görüntü: Orijinal Oran (Contain)","info"))});const Z=t.querySelector("#pill-btn-speed"),ee=t.querySelector("#pill-speed-label"),ce=[1,1.25,1.5,2,.75];let De=0;Z&&(Z.onclick=xe=>{xe.stopPropagation(),De=(De+1)%ce.length;const Ke=ce[De];e.playbackRate=Ke,ee&&(ee.textContent=`${Ke}x`),Z.classList.toggle("active",Ke!==1),G(`⏱ Oynatma Hızı: ${Ke}x`,"info")});const fe=t.querySelector("#pill-btn-subs");fe&&K&&(fe.onclick=xe=>{if(xe.stopPropagation(),!K.classList.contains("hidden")&&Se?.textContent==="Altyazılar"){K.classList.add("hidden");return}tr(),K.classList.remove("hidden"),t.classList.remove("hide-controls"),Lt()});const Qe=t.querySelector("#pill-btn-audio");Qe&&K&&(Qe.onclick=xe=>{if(xe.stopPropagation(),!K.classList.contains("hidden")&&Se?.textContent==="Ses Kanalları"){K.classList.add("hidden");return}Qn(),K.classList.remove("hidden"),t.classList.remove("hide-controls"),Lt()});const zt=t.querySelector("#pill-btn-sources");zt&&(zt.onclick=xe=>{xe.stopPropagation(),St(!0)});const va=(xe,Ke)=>{if(!xe)return;if(document.fullscreenElement)try{document.exitFullscreen?.()}catch{}const Kt=w.querySelector(".player-modal-content")||w.querySelector(".cinema-modal-box")||document.querySelector(".cinema-modal-box");if(Kt){const fr=Kt.getBoundingClientRect(),So=xe.getBoundingClientRect(),$o=Kt.scrollTop+(So.top-fr.top)-18;Kt.scrollTo({top:Math.max(0,$o),behavior:"smooth"})}else xe.scrollIntoView({behavior:"smooth",block:"start"});xe.classList.remove("section-interaction-highlight"),xe.offsetWidth,xe.classList.add("section-interaction-highlight"),b(()=>{xe.classList.remove("section-interaction-highlight")},2200),Ke&&G(Ke,"info")},Ei=t.querySelector("#pill-btn-episodes")||t.querySelector("#player-link-episodes");Ei&&(Ei.onclick=xe=>{xe.stopPropagation();const Ke=w.querySelector(".dizisol-seasons-section")||w.querySelector("#dizisol-seasons-section");va(Ke,"Bölümler listesine gidildi")});const Ri=t.querySelector("#pill-btn-similar")||t.querySelector("#player-link-similar");Ri&&(Ri.onclick=xe=>{xe.stopPropagation();const Ke=w.querySelector("#dizisol-similar-section")||w.querySelector("#dizisol-movie-section")||w.querySelector(".dizisol-seasons-section");va(Ke,"Benzer yapımlar bölümüne gidildi")})}const di=()=>{pe&&pe.classList.remove("hidden"),Me&&Me.classList.add("hidden"),Zn()},ui=(v,_)=>{pe&&pe.classList.add("hidden"),Me&&Me.classList.remove("hidden"),Se&&(Se.textContent=v),we&&(we.innerHTML=_,ge(we)),ge(Ye)};Ye&&(Ye.onclick=v=>{v.stopPropagation(),di()});const Zn=()=>{const v=t.querySelector("#custom-menu-active-audio");if(v)if(me&&me.audioTracks&&me.audioTracks.length>1){const ee=me.audioTracks[me.audioTrack];let ce=ee?ee.name||ee.lang||`Ses ${me.audioTrack+1}`:"Otomatik";/tr|turk/i.test(ce)?ce="Türkçe Dublaj":/en|eng|orig/i.test(ce)&&(ce="Orijinal (İngilizce)"),v.textContent=ce}else e._currentAudioTrack?v.textContent=e._currentAudioTrack==="dubbed"?"Türkçe Dublaj":"Orijinal Ses":v.textContent=J==="dubbed"?"Türkçe Dublaj":"Orijinal Ses";const _=t.querySelector("#custom-menu-active-sub");if(_){let ee="Kapalı";const ce=e.textTracks;if(ce&&ce.length>0){for(let De=0;De<ce.length;De++)if(ce[De].mode==="showing"){ee=ce[De].label||"Türkçe";break}}_.textContent=ee}const C=t.querySelector("#custom-menu-active-sub-style");if(C){const ee={small:"Küçük",medium:"Normal",large:"Büyük",xlarge:"Çok Büyük"};C.textContent=ee[ye?.fontSize]||"Özelleştir"}const M=t.querySelector("#custom-menu-active-speed");if(M){const ee=e.playbackRate||1;M.textContent=ee===1?"Normal":`${ee}x`}const Z=t.querySelector("#custom-menu-active-brightness");Z&&(Z.textContent=`%${$t}`)},Jn=t.querySelector("#custom-menu-item-audio");Jn&&(Jn.onclick=v=>{v.stopPropagation(),Qn()});function Qn(){let v="";if(me&&me.audioTracks&&me.audioTracks.length>1)v+='<p style="color:#94a3b8;font-size:10.5px;font-weight:700;text-transform:uppercase;margin:2px 0 6px 6px;">VİDEO SES KANALLARI</p>',me.audioTracks.forEach((M,Z)=>{const ee=me.audioTrack===Z;let ce=M.name||M.lang||`Kanal ${Z+1}`;/tr|turk/i.test(ce)||/tr|turk/i.test(M.lang||"")?ce="🇹🇷 Türkçe Dublaj":(/en|eng|orig/i.test(ce)||/en|eng/i.test(M.lang||""))&&(ce="🇬🇧 Orijinal (İngilizce)"),v+=`
            <div class="custom-menu-opt-row ${ee?"active":""}" data-hls-track="${Z}">
              <span>${ce}</span>
              ${ee?'<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>':""}
            </div>
          `});else if(e._setAudioTrack){const M=e._currentAudioTrack||"dubbed";v+='<p style="color:#94a3b8;font-size:10.5px;font-weight:700;text-transform:uppercase;margin:2px 0 6px 6px;">VİDEO SES KANALLARI</p>',v+=`
          <div class="custom-menu-opt-row ${M==="dubbed"?"active":""}" data-dual-track="dubbed">
            <span>🇹🇷 Türkçe Dublaj</span>
            ${M==="dubbed"?'<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>':""}
          </div>
          <div class="custom-menu-opt-row ${M==="original"?"active":""}" data-dual-track="original">
            <span>🇬🇧 Orijinal Ses</span>
            ${M==="original"?'<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>':""}
          </div>
        `}else v+='<p style="color:#94a3b8;font-size:10.5px;font-weight:700;text-transform:uppercase;margin:2px 0 6px 6px;">VİDEO SES KANALLARI</p>',v+=`
          <div class="custom-menu-opt-row active" style="cursor:default;">
            <span>${J==="dubbed"?"🇹🇷 Türkçe Dublaj (Tek Kanal)":"🇬🇧 Orijinal Ses (Tek Kanal)"}</span>
            <i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>
          </div>
          <p style="color:#64748b;font-size:11px;margin:6px 6px 4px;line-height:1.4;">
            Bu hatta tek bir ses kanalı mevcut.
          </p>
        `;const _=J==="dubbed"?"subtitled":"dubbed",C=ke?.[_]?.length||0;if(v+=`
        <div class="custom-menu-opt-row" id="quick-audio-switch-cat-btn" style="border: 1px solid rgba(245,158,11,0.35); background: rgba(245,158,11,0.1); margin-top: 10px; border-radius: 8px;">
          <span>${_==="dubbed"?"🇹🇷 Dublaj Yayınlara Geç":"💬 Altyazılı Yayınlara Geç"} ${C>0?`(${C})`:""}</span>
          <i data-lucide="arrow-right-left" style="width:14px;height:14px;color:#f59e0b;"></i>
        </div>
      `,ui("Ses Kanalları",v),we){we.querySelectorAll("[data-hls-track]").forEach(Z=>{Z.onclick=ee=>{ee.stopPropagation();const ce=parseInt(Z.getAttribute("data-hls-track"),10);if(me){me.audioTrack=ce;const De=me.audioTracks[ce],fe=De?.name||De?.lang||`Kanal ${ce+1}`;G(`✓ Ses kanalı değiştirildi: ${fe}`,"success")}K.classList.add("hidden")}}),we.querySelectorAll("[data-dual-track]").forEach(Z=>{Z.onclick=ee=>{ee.stopPropagation();const ce=Z.getAttribute("data-dual-track");e._setAudioTrack&&e._setAudioTrack(ce),K.classList.add("hidden")}});const M=we.querySelector("#quick-audio-switch-cat-btn");M&&(M.onclick=Z=>{Z.stopPropagation(),K.classList.add("hidden");const ee=_;J=ee,Ve=0;try{localStorage.setItem("cp_preferred_category",ee)}catch{}$e(),W=ke[ee]||[],de=vt(W),Ee=W.length>0,Be(),je(),Ie(),G(ee==="dubbed"?"🇹🇷 Türkçe Dublaj yayınlara geçildi.":"💬 Türkçe Altyazılı yayınlara geçildi.","info")})}}const er=t.querySelector("#custom-menu-item-subs");er&&(er.onclick=v=>{v.stopPropagation(),tr()});function tr(){const v=e.textTracks;let _=-1;if(v){for(let M=0;M<v.length;M++)if(v[M].mode==="showing"){_=M;break}}let C=`
        <div class="custom-menu-opt-row ${_===-1?"active":""}" data-sub-idx="-1">
          <span>Kapalı</span>
          ${_===-1?'<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>':""}
        </div>
      `;if(v&&v.length>0)for(let M=0;M<v.length;M++){const Z=v[M],ee=_===M;C+=`
            <div class="custom-menu-opt-row ${ee?"active":""}" data-sub-idx="${M}">
              <span>${Z.label||`Altyazı ${M+1}`}</span>
              ${ee?'<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>':""}
            </div>
          `}if(C+=`
        <div class="custom-menu-opt-row" id="subs-switch-to-sub-sources-btn" style="border: 1px solid rgba(96,165,250,0.35); background: rgba(96,165,250,0.1); margin-top: 10px; border-radius: 8px;">
          <span>💬 Türkçe Altyazılı Yayın Hatlarını Aç</span>
          <i data-lucide="layers" style="width:14px;height:14px;color:#60a5fa;"></i>
        </div>
      `,ui("Altyazılar",C),we){we.querySelectorAll("[data-sub-idx]").forEach(Z=>{Z.onclick=ee=>{ee.stopPropagation();const ce=parseInt(Z.getAttribute("data-sub-idx"),10);if(v)for(let fe=0;fe<v.length;fe++)v[fe].mode=fe===ce?"showing":"disabled";G(ce===-1?"Altyazı kapatıldı":`✓ Altyazı: ${v[ce]?.label||"Açık"}`,"info");const De=t.querySelector("#custom-menu-active-sub");De&&(De.textContent=ce===-1?"Kapalı":v[ce]?.label||"Açık"),K.classList.add("hidden")}});const M=we.querySelector("#subs-switch-to-sub-sources-btn");M&&(M.onclick=Z=>{Z.stopPropagation(),K.classList.add("hidden"),St(!0);const ee=document.getElementById("sources-tab-subtitled");ee&&ee.click()})}}const ls={fontSize:"medium",color:"#ffffff",fontFamily:"sans",bg:"semi",position:"bottom",bottomOffset:25};let ye={...ls};try{const v=localStorage.getItem("cinepulse_subtitle_style");v&&(ye={...ls,...JSON.parse(v)})}catch{}const ba=(v=ye)=>{let _=document.getElementById("cinepulse-sub-custom-style");_||(_=document.createElement("style"),_.id="cinepulse-sub-custom-style",document.head.appendChild(_));const C={small:"14px",medium:"19px",large:"25px",xlarge:"33px"},M={sans:"Inter, system-ui, -apple-system, sans-serif",serif:"Georgia, Cambria, serif",mono:'"JetBrains Mono", Consolas, monospace'},Z={trans:"transparent",semi:"rgba(0, 0, 0, 0.75)",solid:"rgba(0, 0, 0, 0.95)"},ee=v.bg==="trans"?"0 0 4px #000, 0 0 6px #000, 2px 2px 2px #000, -2px -2px 2px #000":"0 2px 4px rgba(0,0,0,0.85)",ce=typeof v.bottomOffset=="number"?v.bottomOffset:25;if(_.textContent=`
        video::cue {
          font-family: ${M[v.fontFamily]||M.sans} !important;
          font-size: ${C[v.fontSize]||C.medium} !important;
          color: ${v.color||"#ffffff"} !important;
          background-color: ${Z[v.bg]||Z.semi} !important;
          text-shadow: ${ee} !important;
          line-height: 1.35 !important;
          transform: translateY(-${ce}px) !important;
        }
        #custom-html5-video::cue {
          font-family: ${M[v.fontFamily]||M.sans} !important;
          font-size: ${C[v.fontSize]||C.medium} !important;
          color: ${v.color||"#ffffff"} !important;
          background-color: ${Z[v.bg]||Z.semi} !important;
          text-shadow: ${ee} !important;
          line-height: 1.35 !important;
          transform: translateY(-${ce}px) !important;
        }
      `,e&&e.textTracks)try{const De=v.position==="top"?2:v.position==="middle"?8:-Math.max(1,Math.round(ce/18)+1);for(let fe=0;fe<e.textTracks.length;fe++){const Qe=e.textTracks[fe];if(Qe.cues)for(let zt=0;zt<Qe.cues.length;zt++)Qe.cues[zt].line=De}}catch{}};ba(ye);const ir=t.querySelector("#custom-menu-item-sub-style");ir&&(ir.onclick=v=>{v.stopPropagation(),ar()});const ar=()=>{const v=()=>{const C={sans:"Inter, sans-serif",serif:"Georgia, serif",mono:"monospace"},M={small:"12px",medium:"15px",large:"18px",xlarge:"22px"},Z={trans:"transparent",semi:"rgba(0, 0, 0, 0.75)",solid:"rgba(0, 0, 0, 0.95)"},ee=ye.bg==="trans"?"0 0 3px #000, 1px 1px 1px #000":"0 1px 3px rgba(0,0,0,0.8)";return`
          font-family: ${C[ye.fontFamily]};
          font-size: ${M[ye.fontSize]};
          color: ${ye.color};
          background-color: ${Z[ye.bg]};
          text-shadow: ${ee};
          padding: 4px 8px;
          border-radius: 4px;
          display: inline-block;
          transition: all 0.15s ease;
        `},_=`
        <div class="custom-sub-settings-panel">
          <!-- Canlı Önizleme -->
          <div class="sub-preview-box">
            <span id="sub-preview-text" style="${v()}">
              Örnek Altyazı Metni
            </span>
          </div>

          <!-- 1. Yazı Boyutu -->
          <div>
            <div class="sub-style-group-label">Yazı Boyutu</div>
            <div class="sub-style-btn-grid">
              <button class="sub-style-btn ${ye.fontSize==="small"?"active":""}" data-sub-key="fontSize" data-sub-val="small">Küçük</button>
              <button class="sub-style-btn ${ye.fontSize==="medium"?"active":""}" data-sub-key="fontSize" data-sub-val="medium">Normal</button>
              <button class="sub-style-btn ${ye.fontSize==="large"?"active":""}" data-sub-key="fontSize" data-sub-val="large">Büyük</button>
              <button class="sub-style-btn ${ye.fontSize==="xlarge"?"active":""}" data-sub-key="fontSize" data-sub-val="xlarge">Çok Büyük</button>
            </div>
          </div>

          <!-- 2. Yazı Rengi -->
          <div>
            <div class="sub-style-group-label">Yazı Rengi</div>
            <div class="sub-style-btn-grid">
              <button class="sub-style-btn ${ye.color==="#ffffff"?"active":""}" data-sub-key="color" data-sub-val="#ffffff">
                <span style="display:inline-block;width:9px;height:9px;background:#ffffff;border-radius:50%;"></span> Beyaz
              </button>
              <button class="sub-style-btn ${ye.color==="#facc15"?"active":""}" data-sub-key="color" data-sub-val="#facc15">
                <span style="display:inline-block;width:9px;height:9px;background:#facc15;border-radius:50%;"></span> Sarı
              </button>
              <button class="sub-style-btn ${ye.color==="#4ade80"?"active":""}" data-sub-key="color" data-sub-val="#4ade80">
                <span style="display:inline-block;width:9px;height:9px;background:#4ade80;border-radius:50%;"></span> Yeşil
              </button>
              <button class="sub-style-btn ${ye.color==="#38bdf8"?"active":""}" data-sub-key="color" data-sub-val="#38bdf8">
                <span style="display:inline-block;width:9px;height:9px;background:#38bdf8;border-radius:50%;"></span> Mavi
              </button>
            </div>
          </div>

          <!-- 3. Yazı Tipi -->
          <div>
            <div class="sub-style-group-label">Yazı Tipi</div>
            <div class="sub-style-btn-grid" style="grid-template-columns: repeat(3, 1fr);">
              <button class="sub-style-btn ${ye.fontFamily==="sans"?"active":""}" data-sub-key="fontFamily" data-sub-val="sans">Sans-Serif</button>
              <button class="sub-style-btn ${ye.fontFamily==="serif"?"active":""}" data-sub-key="fontFamily" data-sub-val="serif">Serif</button>
              <button class="sub-style-btn ${ye.fontFamily==="mono"?"active":""}" data-sub-key="fontFamily" data-sub-val="mono">Monospace</button>
            </div>
          </div>

          <!-- 4. Arka Plan Opaklığı -->
          <div>
            <div class="sub-style-group-label">Arka Plan Opaklığı</div>
            <div class="sub-style-btn-grid" style="grid-template-columns: repeat(3, 1fr);">
              <button class="sub-style-btn ${ye.bg==="trans"?"active":""}" data-sub-key="bg" data-sub-val="trans">Saydam</button>
              <button class="sub-style-btn ${ye.bg==="semi"?"active":""}" data-sub-key="bg" data-sub-val="semi">Yarı Saydam</button>
              <button class="sub-style-btn ${ye.bg==="solid"?"active":""}" data-sub-key="bg" data-sub-val="solid">Katı Siyah</button>
            </div>
          </div>

          <!-- 5. Dikey Konum -->
          <div>
            <div class="sub-style-group-label">Dikey Konum</div>
            <div class="sub-style-btn-grid" style="grid-template-columns: repeat(3, 1fr);">
              <button class="sub-style-btn ${ye.position==="bottom"?"active":""}" data-sub-key="position" data-sub-val="bottom">Alt (Standart)</button>
              <button class="sub-style-btn ${ye.position==="middle"?"active":""}" data-sub-key="position" data-sub-val="middle">Orta</button>
              <button class="sub-style-btn ${ye.position==="top"?"active":""}" data-sub-key="position" data-sub-val="top">Üst</button>
            </div>
          </div>

          <!-- 6. Manuel Yükseklik / Alt Boşluk (Height Adjustment) -->
          <div>
            <div class="sub-style-group-label" style="display:flex;justify-content:space-between;align-items:center;">
              <span>Altyazı Yüksekliği (Alt Mesafe)</span>
              <span id="sub-bottom-offset-display" style="color:#60a5fa;font-weight:600;font-size:0.85rem;">${ye.bottomOffset||25}px</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;margin-top:6px;">
              <button id="btn-sub-offset-dec" class="sub-style-btn" style="padding:4px 10px;font-size:1.1rem;font-weight:bold;line-height:1;min-width:32px;">-</button>
              <input type="range" id="sub-offset-slider" min="0" max="150" step="5" value="${ye.bottomOffset||25}" style="flex:1;accent-color:#3b82f6;cursor:pointer;height:6px;border-radius:3px;">
              <button id="btn-sub-offset-inc" class="sub-style-btn" style="padding:4px 10px;font-size:1.1rem;font-weight:bold;line-height:1;min-width:32px;">+</button>
            </div>
          </div>

          <!-- Sıfırla Butonu -->
          <button id="sub-style-reset-btn" class="sub-style-btn" style="width:100%;margin-top:8px;color:#f87171;border-color:rgba(248,113,113,0.3);background:rgba(239,68,68,0.1);">
            <i data-lucide="rotate-ccw" style="width:13px;height:13px;"></i> Varsayılan Ayarlara Sıfırla
          </button>
        </div>
      `;if(ui("Altyazı Stili & Ayarları",_),we){we.querySelectorAll(".sub-style-btn[data-sub-key]").forEach(fe=>{fe.onclick=Qe=>{Qe.stopPropagation();const zt=fe.getAttribute("data-sub-key"),va=fe.getAttribute("data-sub-val");ye[zt]=va;try{localStorage.setItem("cinepulse_subtitle_style",JSON.stringify(ye))}catch{}ba(ye),fe.parentElement.querySelectorAll(".sub-style-btn").forEach(Ri=>Ri.classList.remove("active")),fe.classList.add("active");const Ei=we.querySelector("#sub-preview-text");Ei&&(Ei.style.cssText=v())}});const C=we.querySelector("#sub-offset-slider"),M=we.querySelector("#sub-bottom-offset-display"),Z=we.querySelector("#btn-sub-offset-dec"),ee=we.querySelector("#btn-sub-offset-inc"),ce=fe=>{const Qe=Math.max(0,Math.min(150,parseInt(fe,10)||25));ye.bottomOffset=Qe,C&&(C.value=Qe),M&&(M.textContent=`${Qe}px`);try{localStorage.setItem("cinepulse_subtitle_style",JSON.stringify(ye))}catch{}ba(ye)};C&&(C.oninput=fe=>{fe.stopPropagation(),ce(fe.target.value)}),Z&&(Z.onclick=fe=>{fe.stopPropagation(),ce((ye.bottomOffset||25)-5)}),ee&&(ee.onclick=fe=>{fe.stopPropagation(),ce((ye.bottomOffset||25)+5)});const De=we.querySelector("#sub-style-reset-btn");De&&(De.onclick=fe=>{fe.stopPropagation(),ye={...ls};try{localStorage.setItem("cinepulse_subtitle_style",JSON.stringify(ye))}catch{}ba(ye),ar(),G("Altyazı stili varsayılana sıfırlandı","info")})}},sr=t.querySelector("#custom-menu-item-speed");sr&&(sr.onclick=v=>{v.stopPropagation(),wo()});const wo=()=>{const v=[.5,.75,1,1.25,1.5,2],_=e.playbackRate||1;let C="";v.forEach(M=>{const Z=_===M;C+=`
          <div class="custom-menu-opt-row ${Z?"active":""}" data-speed="${M}">
            <span>${M===1?"Normal (1x)":`${M}x`}</span>
            ${Z?'<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>':""}
          </div>
        `}),ui("Oynatma hızı",C),we&&we.querySelectorAll("[data-speed]").forEach(M=>{M.onclick=Z=>{Z.stopPropagation();const ee=parseFloat(M.getAttribute("data-speed"));e.playbackRate=ee,it.speed=ee,nt("settings"),G(`Oynatma Hızı: ${ee===1?"Normal":`${ee}x`}`,"info"),di()}})},nr=t.querySelector("#custom-menu-item-brightness-menu");nr&&(nr.onclick=v=>{v.stopPropagation(),ko()});const ko=()=>{const v=[{label:"%50 (Gece Modu)",val:50},{label:"%75 (Kısık)",val:75},{label:"%100 (Normal)",val:100},{label:"%125 (Canlı)",val:125},{label:"%150 (Maksimum)",val:150}];let _="";v.forEach(C=>{const M=$t===C.val;_+=`
          <div class="custom-menu-opt-row ${M?"active":""}" data-brightness="${C.val}">
            <span>${C.label}</span>
            ${M?'<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>':""}
          </div>
        `}),ui("Parlaklık",_),we&&we.querySelectorAll("[data-brightness]").forEach(C=>{C.onclick=M=>{M.stopPropagation();const Z=parseInt(C.getAttribute("data-brightness"),10);ma(Z),G(`Parlaklık: %${Z}`,"info"),di()}})},rr=t.querySelector("#custom-menu-item-pip");rr&&(rr.onclick=async v=>{v.stopPropagation(),K.classList.add("hidden");try{document.pictureInPictureElement?await document.exitPictureInPicture():e.requestPictureInPicture&&await e.requestPictureInPicture()}catch{G("Pencere içinde pencere desteklenmiyor.","error")}});let ha=null,ya=null,pi="Kapalı";const or=()=>{e.pause(),oi&&(oi.classList.remove("hidden"),ge(oi)),G("🌙 Uyku Modu: Süre doldu, yayın duraklatıldı.","info"),cs()},cs=()=>{ya&&(e.removeEventListener("ended",ya),ya=null),ha&&($(ha),ha=null),pi="Kapalı",da&&(da.textContent=pi),ri&&(ri.style.color="#c084fc")},lr=(v,_)=>{if(cs(),pi=_,da&&(da.textContent=pi),ri&&(ri.style.color="#a855f7"),v==="end-of-episode"){G("🌙 Uyku Zamanlayıcısı: Bölüm bitince yayın durdurulacak.","info");const M=()=>{e.removeEventListener("ended",M),or()};ya=M,c(e,"ended",M);return}const C=v*60;G(`🌙 Uyku Zamanlayıcısı: ${_} sonra kapatılacak.`,"success"),ha=b(()=>{or()},C*1e3)};oi&&(oi.onclick=v=>{v.stopPropagation(),oi.classList.add("hidden"),e.play().catch(()=>{})});const cr=()=>{const v=[{label:"Kapalı (İptal Et)",val:0},{label:"15 Dakika",val:15},{label:"30 Dakika",val:30},{label:"45 Dakika",val:45},{label:"60 Dakika (1 Saat)",val:60},{label:"Bölüm Bitince",val:"end-of-episode"}];let _="";v.forEach(C=>{const M=C.val===0&&pi==="Kapalı"||pi===C.label;_+=`
          <div class="custom-menu-opt-row ${M?"active":""}" data-sleep-val="${C.val}" data-sleep-label="${C.label}">
            <span>${C.label}</span>
            ${M?'<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>':""}
          </div>
        `}),ui("Uyku Zamanlayıcısı",_),we&&we.querySelectorAll("[data-sleep-val]").forEach(C=>{C.onclick=M=>{M.stopPropagation();const Z=C.getAttribute("data-sleep-val"),ee=C.getAttribute("data-sleep-label");Z==="0"?(cs(),G("Uyku zamanlayıcısı kapatıldı","info")):Z==="end-of-episode"?lr("end-of-episode","Bölüm Bitince"):lr(parseInt(Z,10),ee),di()}})};Un&&(Un.onclick=v=>{v.stopPropagation(),cr()}),ri&&(ri.onclick=v=>{v.stopPropagation(),K.classList.contains("hidden")?(xt(),K.classList.remove("hidden"),cr()):xt()});const ds=t.querySelector("#gesture-hud-icon-wrap");let dr="",us=null;const ur=(v,_,C)=>{rs&&(ds&&dr!==v&&(dr=v,ds.innerHTML=`<i data-lucide="${v}" style="width: 24px; height: 24px;"></i>`,ge(ds)),Pn&&(Pn.textContent=_),qn&&(qn.style.height=`${Math.max(0,Math.min(100,C))}%`),rs.classList.remove("hidden"),us&&$(us),us=b(()=>{rs.classList.add("hidden")},700))};let ps=0,pr=0,At=null,ga=0,ms=0;function mr(v,_){try{let C=t.querySelector(`.seek-ripple-${v}`);C||(C=document.createElement("div"),C.className=`custom-seek-ripple seek-ripple-${v}`,C.innerHTML=`
            <div class="seek-ripple-content">
              <i data-lucide="${v==="left"?"rotate-ccw":"rotate-cw"}" style="width: 32px; height: 32px;"></i>
              <span>${Math.abs(_)} saniye</span>
            </div>
          `,t.appendChild(C),ge(C)),C.classList.remove("animating"),C.offsetWidth,C.classList.add("animating"),b(()=>{C.classList.remove("animating")},650)}catch{}}c(t,"touchstart",v=>{if(Bt||v.touches.length!==1)return;const _=v.target;if(_.closest(".custom-player-controls")||_.closest(".custom-player-menu")||_.closest(".custom-skip-intro-btn")||_.closest(".custom-binge-card")||_.closest(".custom-screen-lock-btn")||_.closest(".custom-screen-unlock-badge")||_.closest(".custom-sleep-curtain"))return;const C=v.touches[0],M=t.getBoundingClientRect(),Z=C.clientX-M.left,ee=Date.now();if(ee-ms<320){ms=0,v.preventDefault(),Z<M.width*.4?(li(-10),mr("left",-10)):Z>M.width*.6?(li(10),mr("right",10)):pa(),At=null,Fe();return}ms=ee,Fe(),ps=C.clientX,pr=C.clientY,At=null},{passive:!1}),c(t,"touchmove",v=>{if(Bt||v.touches.length!==1)return;const _=v.target;if(_.closest(".custom-player-controls")||_.closest(".custom-player-menu")||_.closest(".custom-skip-intro-btn")||_.closest(".custom-binge-card")||_.closest(".custom-screen-lock-btn")||_.closest(".custom-screen-unlock-badge"))return;const C=v.touches[0],M=C.clientX-ps,Z=pr-C.clientY,ee=t.getBoundingClientRect();if(!At&&Math.abs(Z)>12&&Math.abs(Z)>Math.abs(M)*1.2&&(ps-ee.left<ee.width*.5?(At="brightness",ga=$t):(At="volume",ga=e.muted?0:e.volume)),At){v.preventDefault();const De=Z/(ee.height*.8);if(At==="brightness"){const fe=Math.max(30,Math.min(150,Math.round(ga+De*100)));ma(fe),ur("sun",`%${fe}`,(fe-30)/120*100)}else if(At==="volume"){const fe=Math.max(0,Math.min(1,ga+De));e.volume=fe,e.muted=!1,Ft(),ur(fe===0?"volume-x":fe<.5?"volume-1":"volume-2",`%${Math.round(fe*100)}`,fe*100)}}},{passive:!1}),c(t,"touchend",()=>{At=null},{passive:!0}),c(window,"keydown",v=>{Bt||document.activeElement&&(document.activeElement.tagName==="INPUT"||document.activeElement.tagName==="TEXTAREA")||!w||w.classList.contains("hidden")||(v.code==="ArrowUp"?(v.preventDefault(),e.volume=Math.min(1,e.volume+.1),e.muted=!1,Ft()):v.code==="ArrowDown"&&(v.preventDefault(),e.volume=Math.max(0,e.volume-.1),Ft()))}),ua(),Fe(),Ft(),_t(),Zn(),ge(t)}async function Ie(){if(N)return;$e();const e=ve,a=document.getElementById("player-iframe-wrapper");if(!a)return;if(me){try{me.destroy()}catch{}me=null}let t=W[de];ea(),a.innerHTML=nn(),ge(a),Ws(),Ze();const c=document.getElementById("player-popout-btn");c&&(c.href=at(t)||"#");const b=document.getElementById("btn-switch-vip-direct");b&&b.addEventListener("click",()=>{const k=W.findIndex(E=>E&&(E.isDirectVideo||E.isHls||E.streamUrl&&!E.streamUrl.startsWith("magnet:")&&!E.isTorrent));if(k!==-1&&k!==de)de=k,Ve=0,Be(),Ie();else{const E=document.getElementById("tab-dubbed");E&&E.click()}});const $=document.getElementById("btn-switch-subtitled-fallback");$&&$.addEventListener("click",()=>{if(J==="dubbed"){const k=document.getElementById("tab-subtitled");k&&k.click()}else{const k=document.getElementById("tab-dubbed");k&&k.click()}});const z=document.getElementById("btn-retry-discovery");if(z&&z.addEventListener("click",()=>{as()}),!!(t?.isDirectVideo||t?.isHls||t?.streamUrl&&!t.streamUrl.startsWith("magnet:")&&(t.streamUrl.includes(".m3u8")||t.streamUrl.includes(".txt")||t.streamUrl.includes(".mp4")||t.streamUrl.includes(".mkv")||t.streamUrl.includes(":4000/torrent/")))){if(me){try{me.destroy()}catch{}me=null}if(ot){try{ot.destroy()}catch{}ot=null}const k=document.getElementById("hls-video-player"),E=at(t);if(k&&E){const X=E.includes(".m3u8")||E.includes(".txt")||t.isHls,oe=t?.source==="DS"&&/filmmakinesi/i.test([t?.id,t?.name,t?.displayName,t?.provider].filter(Boolean).join(" ")),Y=t?.source==="DS";if(X&&Dt.isSupported()){const V=new Dt({enableWorker:!0,lowLatencyMode:!1,startFragPrefetch:!0,progressive:!0,backBufferLength:30,maxBufferLength:30,maxMaxBufferLength:600,maxBufferSize:314572800,maxBufferHole:.5,highBufferWatchdogPeriod:2,nudgeOffset:.2,nudgeMaxRetry:6,abrEwmaDefaultEstimate:5e6,abrEwmaFastVoD:3,abrBandWidthFactor:.92,fragLoadingTimeOut:oe?8e3:Y?12e3:2e4,manifestLoadingTimeOut:15e3,levelLoadingTimeOut:15e3,fragLoadingMaxRetry:oe?1:Y?3:6,manifestLoadingMaxRetry:4,levelLoadingMaxRetry:4,xhrSetup:Ce=>{try{Ce.referrerPolicy="no-referrer"}catch{}}});me=V;const ze=()=>{if(qe>0){const Ce=k.duration;if(Ce&&isFinite(Ce)&&Ce>10&&qe>=Ce-15){k.currentTime=0;return}k.currentTime=qe}};V.loadSource(E),V.attachMedia(k);const K=qe>0?qe:0;let pe=!1,Me=K,Se=Date.now();Q.on(k,"timeupdate",()=>{k.currentTime>K+.25&&(pe=!0),Math.abs(k.currentTime-Me)>.1&&(Me=k.currentTime,Se=Date.now())}),oe?(Q.on(k,"seeking",()=>{Se=Date.now()}),Q.setInterval(()=>{if(!(N||e!==ve||me!==V)&&!(k.paused||k.ended||Date.now()-Se<8e3)){try{V.destroy()}catch{}me===V&&(me=null),dt("DS FILMMAKİNESİ akışı durdu")}},2e3)):Y&&(Q.on(k,"seeking",()=>{Se=Date.now()}),Q.setInterval(()=>{if(!(N||e!==ve||me!==V)&&!(k.paused||k.ended||Date.now()-Se<15e3)){if(!pe&&Date.now()-Se>2e4){try{V.destroy()}catch{}me===V&&(me=null),dt("DS akışı oynatmayı başlatamadı");return}if(pe){try{V.destroy()}catch{}me===V&&(me=null),dt("DS akışı durdu")}}},3e3)),t.source==="HDFilmizle"&&Q.setTimeout(()=>{if(!(N||e!==ve||pe)&&k.currentTime<=K+.25){try{V.destroy()}catch{}me===V&&(me=null),dt("HDF akışı oynatmayı başlatamadı")}},18e3),V.on(Dt.Events.MANIFEST_PARSED,()=>{if(V.audioTracks&&V.audioTracks.length>1){const Ue=V.audioTracks.findIndex(Re=>/tr|tur|turk/i.test(Re.name||"")||/tr|tur/i.test(Re.lang||""));Ue!==-1&&V.audioTrack!==Ue&&(V.audioTrack=Ue)}ze();const Ce=k.play();Ce!==void 0&&Ce.catch(()=>{k.muted=!0,k.play().catch(()=>{})})}),V.on(Dt.Events.AUDIO_TRACKS_UPDATED,()=>{const Ce=document.querySelector("#custom-menu-active-audio");if(Ce&&V.audioTracks&&V.audioTracks.length>1){const Ue=V.audioTracks[V.audioTrack];let Re=Ue?Ue.name||Ue.lang||`Ses ${V.audioTrack+1}`:"Otomatik";/tr|turk/i.test(Re)?Re="Türkçe Dublaj":/en|eng|orig/i.test(Re)&&(Re="Orijinal (İngilizce)"),Ce.textContent=Re}}),Q.on(k,"loadedmetadata",ze,{once:!0});let we=0,Ye=0;V.on(Dt.Events.ERROR,(Ce,Ue)=>{if(!(N||e!==ve||me!==V)&&Ue.fatal){if(Ue.response&&Ue.response.code>=400){try{V.destroy()}catch{}me=null,dt(`Sunucu Hatası (HTTP ${Ue.response.code})`);return}switch(Ue.type){case Dt.ErrorTypes.NETWORK_ERROR:if(we++,we>2){try{V.destroy()}catch{}me=null,dt("Ağ Hatası (Bağlantı koptu)")}else V.startLoad();break;case Dt.ErrorTypes.MEDIA_ERROR:if(Ye++,Ye<=2)V.recoverMediaError();else if(Ye<=4){try{V.swapAudioCodec()}catch{}V.recoverMediaError()}else{try{V.destroy()}catch{}me=null,dt("Medya Çözümleme Hatası")}break;default:try{V.destroy()}catch{}me=null,dt("Oynatma Hatası");break}}})}else if(X&&k.canPlayType("application/vnd.apple.mpegurl")){k.src=E;const V=()=>{if(qe>0){const K=k.duration;K&&isFinite(K)&&K>10&&qe>=K-15?k.currentTime=0:k.currentTime=qe}const ze=k.play();ze!==void 0&&ze.catch(()=>{k.muted=!0,k.play().catch(()=>{})})};Q.on(k,"loadedmetadata",V,{once:!0}),Q.on(k,"canplay",V,{once:!0}),V(),Q.on(k,"error",()=>{N||e!==ve||dt("Yerel HLS oynatıcı hatası")})}else{k.src=E;const V=()=>{if(qe>0){const K=k.duration;K&&isFinite(K)&&K>10&&qe>=K-15?k.currentTime=0:k.currentTime=qe}const ze=k.play();ze!==void 0&&ze.catch(()=>{k.muted=!0,k.play().catch(()=>{})})};Q.on(k,"loadedmetadata",V,{once:!0}),Q.on(k,"canplay",V,{once:!0}),V(),Q.on(k,"error",()=>{N||e!==ve||dt("Video Oynatma Hatası")})}const H=()=>{k&&k.muted&&(k.muted=!1)};Q.on(k,"click",H,{once:!0});const j=document.getElementById("custom-player-controls");j&&Q.on(j,"click",H,{once:!0});const B=document.getElementById("dubbed-audio-source"),he=document.getElementById("btn-audio-original"),ie=document.getElementById("btn-audio-dubbed");if(B&&t.dubbedAudioUrl){let V=J==="dubbed"?"dubbed":"original",ze=!1;const K=()=>{if(ze||!B||!t.dubbedAudioUrl)return;ze=!0;const Se=t.dubbedAudioUrl;if((Se.includes(".m3u8")||t.dubbedAudioIsHls)&&Dt.isSupported()){const Ye=new Dt({enableWorker:!0,lowLatencyMode:!1,backBufferLength:30,maxBufferLength:30,maxMaxBufferLength:60,maxBufferSize:3e7,fragLoadingTimeOut:25e3});ot=Ye,Ye.loadSource(Se),Ye.attachMedia(B)}else B.src=Se},pe=(Se,we=!1)=>{if(V=Se,k._currentAudioTrack=Se,Se==="dubbed"){if(ie&&ie.classList.add("active"),he&&he.classList.remove("active"),!B||t.streamUrl===t.dubbedAudioUrl){k.muted=!1,we||(ea(),G("🇹🇷 Türkçe Dublaj sesi aktif.","success"));return}if(K(),k.muted=!0,B.muted=!1,B.volume=k.volume,k.currentTime>0&&Math.abs(B.currentTime-k.currentTime)>.3)try{B.currentTime=k.currentTime}catch{}k.paused||B.play().catch(()=>{k.muted=!1}),we||(ea(),G("🇹🇷 Türkçe Dublaj sesi aktif edildi.","success"))}else{if(he&&he.classList.add("active"),ie&&ie.classList.remove("active"),k.muted=!1,B){B.muted=!0;try{B.pause()}catch{}}we||(ea(),G("🇬🇧 Orijinal ses aktif edildi.","info"))}};k._setAudioTrack=pe,k._currentAudioTrack=V,he&&(he.onclick=Se=>{Se.stopPropagation(),pe("original")}),ie&&(ie.onclick=Se=>{Se.stopPropagation(),pe("dubbed")}),pe(J==="dubbed"?"dubbed":"original",!0),Q.on(k,"canplay",()=>{if(V==="dubbed"){if(Math.abs(B.currentTime-k.currentTime)>.3)try{B.currentTime=k.currentTime}catch{}k.paused||B.play().catch(()=>{})}},{once:!0}),Q.on(k,"play",()=>{V==="dubbed"&&(B.currentTime=k.currentTime,B.play().catch(()=>{}))}),Q.on(k,"pause",()=>{V==="dubbed"&&B.pause()}),Q.on(k,"seeking",()=>{V==="dubbed"&&(B.currentTime=k.currentTime)}),Q.on(k,"seeked",()=>{V==="dubbed"&&(B.currentTime=k.currentTime,k.paused||B.play().catch(()=>{}))}),Q.on(k,"waiting",()=>{V==="dubbed"&&B.pause()}),Q.on(k,"playing",()=>{V==="dubbed"&&(Math.abs(B.currentTime-k.currentTime)>.25&&(B.currentTime=k.currentTime),B.play().catch(()=>{}))}),Q.on(k,"volumechange",()=>{V==="dubbed"&&(B.volume=k.volume,B.muted=k.muted)}),Q.on(k,"timeupdate",()=>{V==="dubbed"&&!k.paused&&Math.abs(B.currentTime-k.currentTime)>.3&&(B.currentTime=k.currentTime)})}let le=!1;const Ae=()=>{ne||le||N||e!==ve||(le=!0,Wl({contentKey:Fa(),category:J,source:t}))};Q.on(k,"playing",Ae),Q.on(k,"timeupdate",Ae),Q.on(k,"error",()=>{ne||Mr({category:J,source:t})}),sn(k,t),go(k),io(k)}}}function vo(e){if(document.getElementById("dubbed-found-banner"))return;const a=document.getElementById("player-iframe-wrapper");if(!a)return;const t=document.createElement("div");t.id="dubbed-found-banner",t.className="dubbed-found-banner",t.innerHTML=`
      <div class="dubbed-found-text">
        <i data-lucide="sparkles" style="width: 15px; height: 15px; color: #f59e0b;"></i>
        <span>🇹🇷 Türkçe Dublaj Yayını Bulundu! (${e.displayName||"1080p"})</span>
      </div>
      <button class="dubbed-found-btn" id="btn-switch-to-new-dubbed">
        <span>Dublaja Geç</span>
        <i data-lucide="arrow-right" style="width: 13px; height: 13px;"></i>
      </button>
      <button class="dubbed-found-close" id="btn-close-dubbed-banner" title="Kapat">
        <i data-lucide="x" style="width: 14px; height: 14px;"></i>
      </button>
    `,a.appendChild(t),ge(t),document.getElementById("btn-switch-to-new-dubbed")?.addEventListener("click",c=>{c.stopPropagation(),t.remove();const b=document.getElementById("tab-dubbed");b&&b.click()}),document.getElementById("btn-close-dubbed-banner")?.addEventListener("click",c=>{c.stopPropagation(),t.remove()})}let na=!1,is=!1;function as({isEpisodeSwitch:e=!1}={}){const a=++te,t=Date.now();let c=0;tt=!0,na=!0,Ee=!1,is=!1,Ve=0,ke={dubbed:[],subtitled:[]},W=[],st(),Ie();const b=et(()=>{if(N||a!==te||Ee)return;const $=J==="dubbed"?"subtitled":"dubbed";(ke[J]||[]).length===0&&(ke[$]||[]).length>0&&(J=$,document.getElementById("tab-dubbed")?.classList.toggle("active",J==="dubbed"),document.getElementById("tab-subtitled")?.classList.toggle("active",J==="subtitled"),Ee=!0,tt=!1,W=ke[J],de=vt(W),st(),Be(),je(),Ie())},1800);jl({type:i,tmdbId:n,title:ue,seriesTitle:ue,originalTitle:u,season:L,episode:q,onUpdate:({dubbed:$=[],subtitled:z=[],isComplete:S=!1,newStream:k=null,isDubbedStream:E=!1})=>{if(N||a!==te)return;if(ke={dubbed:Rr($,{contentKey:Fa(),category:"dubbed"}),subtitled:Rr(z,{contentKey:Fa(),category:"subtitled"})},uo(),na=!S,Ze(),ft){if(Vs())return;if(!Ys()){S&&(tt=!1,st(),Be(),Ja(`${ft.name||"Moderatörün seçtiği kaynak"} bu cihazda bulunamadı`));return}}if(J==="subtitled"&&E&&k&&!is&&Ee&&(is=!0,vo(k)),!Ee){if(ke[J]?.length>0){pt(b),Ee=!0,tt=!1,W=ke[J],de=vt(W),st(),Be(),je(),Ie();return}const Y=Date.now()-t,H=J==="dubbed"?"subtitled":"dubbed",j=ke[H]||[];if((S||Y>=1800)&&j.length>0){pt(b),J=H,document.getElementById("tab-dubbed")?.classList.toggle("active",J==="dubbed"),document.getElementById("tab-subtitled")?.classList.toggle("active",J==="subtitled"),Ee=!0,tt=!1,W=j,de=vt(W),st(),Be(),je(),Ie();return}if(S){pt(b),tt=!1,st(),Be(),je(),Ie();return}}const X=W[de];if(W=ke[J]||[],X&&Ee){const Y=W.findIndex(H=>H.id&&H.id===X.id||H.url&&H.url===X.url);Y!==-1&&(de=Y)}if(!Ee&&W.length>0){Ee=!0,tt=!1,de=vt(W),st(),Be(),je(),Ie();return}if(!!(document.querySelector(".player-error-view")||document.querySelector(".player-loading-overlay"))&&W.length>0){const Y=W.findIndex(H=>!H.failed);if(Y!==-1&&(Y!==de||W[de]?.failed)){de=Y,Ve=0,st(),Be(),je(),Ie();return}}c||(c=requestAnimationFrame(()=>{c=0,!(N||a!==te)&&(Be(),je(),bo())}))}})}D?(ke={dubbed:[{source:"OFFLINE",name:"Cihaza indirilen",displayName:"Cihaza indirilen",streamUrl:D,isDirectVideo:U!=="hls",isHls:U==="hls"}],subtitled:[]},W=ke.dubbed,de=0,tt=!1,Ee=!0,st(),Ie()):as(),i==="tv"&&!ne&&Nt(),qs();async function Ht(e,a){if(!ne&&!Na&&!(f&&!Jt&&!It())){Na=!0;try{$e(),L=e,q=a,aa(),f?.roomCode&&window.dispatchEvent(new CustomEvent("cinepulse:player-sync",{detail:{roomCode:f.roomCode,mediaId:f.mediaId,type:f.type,season:L,episode:q,action:"episode",source:Qi(),audioTrack:w.querySelector("#hls-video-player")?._currentAudioTrack||null,time:0,playing:!0,issuedAt:Date.now()}}));const t=document.getElementById("player-modal-title");t&&(t.textContent=ai());const c=document.getElementById("player-resume-time-badge");c&&c.remove();const b=document.getElementById("player-iframe-wrapper");b&&(b.innerHTML=`
          <div class="player-loading-overlay">
            <div class="player-loader-core">
              <div class="player-loader-spinner"></div>
              <i data-lucide="play" class="player-loader-icon"></i>
            </div>
            <div class="player-loader-text">
              <h3>${ue}</h3>
              <p class="player-loader-sub">Sezon ${L} • Bölüm ${q} Yükleniyor...</p>
              <p class="player-loader-hint">Yeni bölüm akış hatları taranıyor...</p>
            </div>
          </div>
        `,ge(w));const $=hr(n,L,q);qe=$?$.currentTime:0,Ne=mi(n,L,q),mt=qe,ja=0,as({isEpisodeSwitch:!0}),Ha(Ne),on(),ae&&(Xs(),Nt(),Js(e,a),yo()),qs(),ge(w)}catch{G("Bölüm değiştirilirken bir sorun oluştu.","error")}finally{Na=!1}}}const ra=document.getElementById("tab-dubbed"),oa=document.getElementById("tab-subtitled");ra&&ra.addEventListener("click",e=>{if(e.preventDefault(),e.stopPropagation(),J!=="dubbed"&&It()){J="dubbed",Ve=0;try{localStorage.setItem("cp_preferred_category","dubbed")}catch{}oa.classList.remove("active"),ra.classList.add("active"),$e(),W=ke.dubbed||[],de=vt(W),Ee=W.length>0,st(),Be(),je(),Ie(),G("🇹🇷 Türkçe Dublaj sunucularına geçildi.","info")}}),oa&&oa.addEventListener("click",e=>{if(e.preventDefault(),e.stopPropagation(),J!=="subtitled"&&It()){J="subtitled",Ve=0;try{localStorage.setItem("cp_preferred_category","subtitled")}catch{}ra.classList.remove("active"),oa.classList.add("active"),$e(),W=ke.subtitled||[],de=vt(W),Ee=W.length>0,st(),Be(),je(),Ie(),G("💬 Türkçe Altyazılı VIP sunucularına geçildi.","info")}});const wn=document.getElementById("btn-open-sources-drawer"),kn=document.getElementById("btn-close-sources-popover"),Sn=document.getElementById("sources-popover-backdrop");wn&&wn.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),St()}),kn&&kn.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),St(!1)}),Sn&&Sn.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),St(!1)});const $n=w.querySelector("#btn-player-download");$n&&$n.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),co()});const xn=w.querySelector("#btn-close-download-popover"),An=w.querySelector("#download-popover-backdrop");xn&&xn.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),w.querySelector("#player-download-popover")?.classList.add("hidden")}),An&&An.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),w.querySelector("#player-download-popover")?.classList.add("hidden")});const Di=document.getElementById("btn-player-theater");Di&&Di.addEventListener("click",()=>{const e=document.getElementById("cinema-modal-box");if(e){e.classList.toggle("theater-mode"),Di.classList.toggle("active");const a=e.classList.contains("theater-mode"),t=Di.querySelector("span"),c=Di.querySelector("[data-lucide]");if(t&&(t.textContent=a?"Genişletildi":"Sinema"),c&&c.setAttribute("data-lucide",a?"minimize-2":"tv"),ge(w),a){const b=document.querySelector(".player-stage-wrapper");b&&b.scrollIntoView({behavior:"smooth",block:"start"})}G(a?"🎥 Sinema Modu (Genişletilmiş Sahne) Aktif Edildi.":"Normal Görünüme Dönüldü.","info")}});const la=document.getElementById("btn-player-reco-toggle"),zn=document.getElementById("player-reco-panel");la&&zn&&la.addEventListener("click",()=>{const e=zn.classList.toggle("is-open");la.classList.toggle("is-open",e);const a=la.querySelector("span");ae?a&&(a.textContent=e?"Benzer Yapımlar & Öneriler (Kapat)":"Benzer Yapımlar & Öneriler"):a&&(a.textContent=e?"Film Detayları & Öneriler (Kapat)":"Film Detayları & Öneriler")});const ss=document.getElementById("dizisol-overview");ss&&ss.addEventListener("click",()=>{ss.classList.toggle("expanded")});const Dn=document.getElementById("btn-report-issue");Dn&&Dn.addEventListener("click",()=>{const e=W[de];G(`✅ Bildirim alındı: ${e?.name||"Yayın"} için sistem hata kaydı oluşturuldu. Sıradaki kaynağa geçiliyor...`,"success"),dt("Kullanıcı hata bildirdi")}),w.querySelectorAll("[data-watch-state]").forEach(e=>{e.addEventListener("click",()=>{e.getAttribute("data-watch-state")==="toggle"?ts():(Ct(mt,ct,!1,!0),G("Daha sonra izlemek için listenize kaydedildi.","success")),e.closest("details")?.removeAttribute("open")})}),w.querySelector("#btn-player-share")?.addEventListener("click",async()=>{const e={title:ue,text:`${ue} CinePulse'ta izleniyor.`,url:window.location.href};try{navigator.share?await navigator.share(e):(await navigator.clipboard?.writeText(window.location.href),G("Bağlantı kopyalandı.","success"))}catch{}});const Tn=document.getElementById("player-close-btn"),Ti=()=>{if(N)return;if(N=!0,te++,w.querySelector("#hls-video-player")||Ct(mt,ct,null,!0),$e(),be.dispose(),Ba=null,document.title=to,O(_a),window.removeEventListener("pagehide",Yi),window.removeEventListener("beforeunload",Yi),me){try{me.destroy()}catch{}me=null}if(ot){try{ot.destroy()}catch{}ot=null}vr(),bi&&(window.open=bi,bi=null);try{w.querySelectorAll("video, audio").forEach(t=>{try{t.pause(),t.removeAttribute("src"),t.load()}catch{}})}catch{}w.querySelectorAll("iframe").forEach(a=>{try{a.src="about:blank",a.remove()}catch{}}),w.classList.add("hidden"),w.classList.remove("player-offline-playback"),w.innerHTML="",document.body.style.overflow="",document.removeEventListener("keydown",Cn)};Ba=Ti,Tn&&Tn.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),Ti()}),w.onclick=e=>{e.target===w&&Ti()};const Cn=e=>{if(!(document.activeElement?.isContentEditable||["input","textarea","select"].includes(document.activeElement?.tagName?.toLowerCase()))&&!(document.activeElement?.tagName==="BUTTON"&&(e.code==="Space"||e.key==="Enter"))&&!(w.querySelector(".is-screen-locked")&&e.key!=="Escape")){if(f&&!We()&&!["Escape","f","F","m","M"].includes(e.key)){e.preventDefault();return}if(e.key==="Escape")wi?St(!1):gt?sa(!1):Gt?zi(!1):Ti();else if(e.key==="f"||e.key==="F"){e.preventDefault();const a=document.getElementById("cinema-modal-box")||document.documentElement;document.fullscreenElement?document.exitFullscreen().catch(()=>{}):a.requestFullscreen().catch(()=>{})}else if(e.key==="e"||e.key==="E"||e.key==="b"||e.key==="B")ae&&(e.preventDefault(),zi());else if(e.key==="?"||e.key==="/")e.preventDefault(),sa();else if(e.key==="n"||e.key==="N"){const a=document.getElementById("btn-next-episode");a&&a.click()}else if(e.key==="p"||e.key==="P"){const a=document.getElementById("btn-prev-episode");a&&a.click()}else if(e.code==="Space"||e.key==="k"||e.key==="K"){const a=document.getElementById("hls-video-player");a&&(e.preventDefault(),a.paused?a.play().catch(()=>{}):a.pause())}else if(e.key==="ArrowRight"){const a=document.getElementById("hls-video-player");a&&(e.preventDefault(),a.currentTime=Math.min(a.duration||99999,a.currentTime+10))}else if(e.key==="ArrowLeft"){const a=document.getElementById("hls-video-player");a&&(e.preventDefault(),a.currentTime=Math.max(0,a.currentTime-10))}else if(e.key==="m"||e.key==="M"){const a=document.getElementById("hls-video-player");a&&(e.preventDefault(),a.muted=!a.muted,G(a.muted?"🔇 Ses kapatıldı":"🔊 Ses açıldı","info"))}}};document.addEventListener("keydown",Cn)}export{As as openPlayerModal};
