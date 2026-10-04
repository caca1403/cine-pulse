import{r as ve,c as ps}from"./playerLifecycle-BycGPIoX.js";import{e as Ra,i as Pe,c as mr}from"./dramaDizilerimScraper-k681Hg-U.js";import{ab as Ze,D as Wt,s as G,n as $o,au as xo,p as fr,a as br,x as ui,z as Ot,av as Ao,t as zo,aw as hr,ax as Do,ay as To,az as yr,aA as Co,aB as Io,aC as Bo}from"./index-BofF-q_g.js";import{Hls as At}from"./vendor-hls-BuERnqCp.js";import{g as _o,r as gr,b as vr,i as ms,s as wr,f as Vt,d as Lo,t as Eo}from"./offlineManager-DXKL7uBT.js";import"./vendor-capacitor-VGCIBgSg.js";const Ro="https://wild-credit-e1ae.cagatayca07.workers.dev";function Mo(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-"):""}async function fs(i,s={}){if(typeof window<"u")try{const n=new URL(i),r=await fetch(Ze(`/api/szd${n.pathname}${n.search}`),{...s,headers:{...s.headers||{},"X-Requested-With":"XMLHttpRequest"},signal:AbortSignal.timeout(6e3)}).catch(()=>null);if(r&&r.ok)return r}catch{}try{const n=`${Ro}?url=${encodeURIComponent(i)}`,r=await fetch(n,{...s,signal:AbortSignal.timeout(4e3)}).catch(()=>null);if(r&&r.ok)return r}catch{}try{const n=await fetch(i,{...s,headers:{...s.headers||{},"X-Requested-With":"XMLHttpRequest",Referer:"https://sezonlukdizi.cc/","User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"},signal:AbortSignal.timeout(4e3)}).catch(()=>null);if(n&&n.ok)return n}catch{}return null}async function wa({titles:i=[],seriesTitle:s="",originalTitle:o="",season:n=1,episode:r=1,isDub:c=!0}){const u=[...new Set([...i,s,o])].filter(h=>h&&typeof h=="string"&&h.trim().length>1);if(u.length===0)return[];const d=[];for(const h of u){const v=Mo(h);if(v&&!d.includes(v)&&(d.push(v),v.endsWith("-izle")||d.push(`${v}-izle`),v.startsWith("the-"))){const m=v.replace(/^the-/,"");d.includes(m)||d.push(m)}}const p="https://sezonlukdizi.cc";for(const h of d)try{const v=`${p}/${h}/${n}-sezon-${r}-bolum.html`,m=await fs(v);if(!m)continue;const x=await m.text(),T=Ra(x);if(!Pe(T,u))continue;const y=x.match(/data-id=["'](\d+)["']/i)||x.match(/var\s+bid\s*=\s*["']?(\d+)["']?/i)||x.match(/bid\s*=\s*(\d+)/i),D=y?y[1]:null;if(!D)continue;const M=c?"0":"1",_=`${p}/ajax/dataAlternatif22.asp`,U=await fs(_,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},body:`bid=${D}&dil=${M}`});if(!U)continue;const E=await U.json().catch(()=>null);if(!E||E.status!=="success"||!Array.isArray(E.data)||E.data.length===0)continue;const j=[],f=await Promise.all(E.data.map(async w=>{const ae=`${p}/ajax/dataEmbed22.asp`,se=await fs(ae,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},body:`id=${w.id}`});if(!se)return null;const P=(await se.text().catch(()=>"")).match(/src=["']([^"']+)["']/i);let Q=P?P[1]:null;if(Q&&!Q.includes("reCAPTCHA")&&Q.length>10){if(w.baslik?.toLowerCase().includes("filemoon")||w.baslik?.toLowerCase().includes("videosoft")||Q.includes("bysejikuar")||Q.includes("filemoon")||Q.includes("videoseyred"))return null;Q.startsWith("//")&&(Q="https:"+Q);const ke=w.baslik==="VidMoly"||Q.includes("vidmoly"),ee=Q,be=ke?"VidMoly 1080p":`${w.baslik} HD`;return{id:`szd_${w.id}`,name:be,displayName:be,badge:`⚡ ${w.baslik}`,category:c?"dubbed":"subtitled",url:ee,streamUrl:ee,isHls:!1,isDirectVideo:!1,getUrl:()=>ee}}return null}));if(j.push(...f.filter(Boolean)),j.length>0)return j}catch{}return[]}const Uo="https://ydfvfdizipanel.ru/public/api",Ri="EuXs1Y5oXTrDpGte3E2dNDIu82LLjaoCd6om",Po={hash256:"f4d4bc98a3fc4600e7f2c2bab7533f1f03d8a70ff03c256bb11dc57050536bd0",signature:"308202c3308201aba0030201020204075cec01300d06092a864886f70d01010b050030123110300e0603550403130753696e65776978301e170d3231303932313233333334395a170d3436303931353233333334395a30123110300e0603550403130753696e6577697830820122300d06092a864886f70d01010105000382010f003082010a0282010100b0a2a1bc5c3f16f19c3b2456cfd0a6128ced9f5e2e2c4cca1a100e17b07b86256258f372e76a95a17e9e4a1c048e364835723a95e8ef6d5bdfb5694b50277c65a64f7b012fdf164e5dc93629561f6ca29b7dc82ebb3d6f3c8e8fc6795847fe331ad4a13ed6c059a83804c43d3747526d769580f3a4153752eb22dac66dd15f1582caa43305dc49f55ac7b1b89013e654d2ca8c94c30956659674cc673256c04208f09118bae14cdd72d78f9ee2aece958084a8c2e315deff45726d4fc1f18ec39569ff1abe4f36a8d01090e5f68c07c28763513b88208bcac1a6e1941f6fd8bfdd52f832098ddb2154c8f565bc5d58c7106a19e03787e75c7f34997000e3bcf30203010001a321301f301d0603551d0e04160414b545fc18e74a791d9402b53940ae38b96e9e209c300d06092a864886f70d01010b05000382010100a8a64d9e7c8b5db102af15d3caf94ff8d3e9be9008bb0021117ca2f0762e68583354b126a041bb1fb6e6308e421e4b5a71f779cde63e5d2fc5976bff966c3c4034e852c077d8e74458fbae2ec1db74b1f4082e188bf8ef7c42a44e3fbfb693bb00ee2a727096b42360ddce1bdcd3536f50c8693bcc62a7b7204bcefe2ecf1f7c820bcd63e1d7a6acc8bf6163086915fc5f607cf51bc7a8635f98bb4c65a8f24b7b5a82c7b06868f565cb0d6ac4775c4aac777536ddd1a565f990fd8cbe539185fa7aab610b7855a687a00f4e55536d72873444552c50fd10727dbf298a9be6ed6ae62148dd1de365f3729915dd31975e28a472d752ac14db3db548405cc31e1e",packagename:"com.sinewix","User-Agent":"EasyPlex (Android 14; SM-A546B; Samsung Galaxy A54 5G; tr)",Accept:"application/json"},qo="https://wild-credit-e1ae.cagatayca07.workers.dev";function No(i,s,o=null,n=null){return Pe(s,[i])?o&&n?Math.abs(parseInt(o,10)-parseInt(n,10))<=1:!0:!1}async function Mi(i){const s=i.startsWith("/")?i:`/${i}`,o=`${Uo}${s}`,n=r=>!!(r&&(r.search||r.videos||r.seasons||r.data||r.title||r.id||Array.isArray(r)));try{const r=`${qo}?url=${encodeURIComponent(o)}`,c=await fetch(r,{signal:AbortSignal.timeout(6e3)}).catch(()=>null);if(c&&c.ok){const u=await c.json().catch(()=>null);if(n(u))return u}}catch{}try{const r=Ze(`/api/snx?path=${encodeURIComponent(s)}`),c=await fetch(r,{signal:AbortSignal.timeout(6e3)}).catch(()=>null);if(c&&c.ok){const u=await c.json().catch(()=>null);if(n(u))return u}}catch{}try{const r=await fetch(o,{headers:Po,signal:AbortSignal.timeout(6e3)}).catch(()=>null);if(r&&r.ok){const c=await r.json().catch(()=>null);if(n(c))return c}}catch{}return null}async function Ho({type:i="tv",titles:s=[],seriesTitle:o="",title:n="",originalTitle:r="",year:c=null,season:u=1,episode:d=1,isDub:p=!0,imdbId:h=""}){const v=i==="movie";try{const m=[...Array.isArray(s)?s:[],o,n,r].filter(Boolean),x=[...new Set(m.map(E=>E.replace(/\s*\(\d{4}\).*/,"").trim()).filter(Boolean))];if(x.length===0)return[];let T=null,y=null;if(!v&&h){const E=await Mi(`/search/episode-${Number(d)}/imdbid-${encodeURIComponent(h)}/season-${Number(u)}/${Ri}`);E&&(E.videos||E.streams||E.seasons||E.data)&&(y=E)}for(const E of x){const j=await Mi(`/search/${encodeURIComponent(E)}/${Ri}`),f=j?.search||j?.data||[];if(!Array.isArray(f)||f.length===0)continue;const w=f.filter(ne=>v?ne.type==="movie"||ne.type==="film":ne.type==="serie"||ne.type==="series"||ne.type==="tv"||ne.type==="anime"),se=(w.length>0?w:f).find(ne=>{const P=[ne.title,ne.name,ne.original_name,ne.original_title].filter(Boolean),Q=(ne.release_date||ne.first_air_date||"").substring(0,4);return x.some(ke=>P.some(ee=>No(ke,ee,c,Q)))});if(se){T=se;break}}if(!T&&!y)return[];const D=T?.id,M=T?.type==="anime";let _=[];if(y&&(_=y.videos||y.streams||y.data||[],!Array.isArray(_)&&typeof _=="object"&&(_=Object.values(_))),!y)if(v)_=(await Mi(`/media/detail/${D}/${Ri}`))?.videos||[];else if(M){const E=await Mi(`/animes/show/${D}/${Ri}`);if(E?.seasons&&Array.isArray(E.seasons)){const j=E.seasons.find(f=>f.season_number===Number(u));if(j?.episodes&&Array.isArray(j.episodes)){const f=j.episodes.find(w=>w.episode_number===Number(d));_=f?f.videos||[]:[]}}}else{const E=await Mi(`/series/show/${D}/${Ri}`);if(E?.seasons&&Array.isArray(E.seasons)){const j=E.seasons.find(f=>f.season_number===Number(u));if(j?.episodes&&Array.isArray(j.episodes)){const f=j.episodes.find(w=>w.episode_number===Number(d));_=f?f.videos||[]:[]}}}const U=[];for(const E of _){const j=(E.link||E.url||"").trim();if(!j)continue;const f=j.toLowerCase();if(f.includes("mediafire.com")||f.includes("mega.nz")||f.includes("pichive")||f.includes("turbobit")||f.includes("yadi.sk"))continue;const w=f.includes("trsub")||f.includes(".sub.")||f.includes("altyazi")||E.lang&&E.lang.toLowerCase().includes("sub"),ae=f.includes("dual")||f.includes("trdub")||E.lang&&(E.lang.toLowerCase().includes("dual")||E.lang.toLowerCase().includes("tr")),se=typeof p=="boolean";if(se&&p&&w&&!ae||se&&!p&&!w&&!ae&&f.includes("dub"))continue;const ne=f.includes(".mkv"),P=f.includes(".mp4")||f.includes(".webm")||ne,Q=f.includes(".m3u8"),ke=j.startsWith("http")?Q?Ze(`/api/hls_proxy?url=${encodeURIComponent(j)}`):ne?Ze(`/api/mkv_stream?url=${encodeURIComponent(j)}&ref=${encodeURIComponent("https://ydfvfdizipanel.ru/")}`):P?Ze(`/api/proxy?url=${encodeURIComponent(j)}&ref=${encodeURIComponent("https://ydfvfdizipanel.ru/")}`):j:j,ee=P?ne?"SWX 1080p (MKV)":"SWX 1080p Direct":"SWX VIP 1080p",be=w?"💬 TR Altyazı 1080p":ae?"⚡ SWX Dual 1080p":"⚡ SWX 1080p";U.push({id:`snx_${E.id||Math.random().toString(36).substring(7)}`,name:ee,displayName:ee,badge:be,category:w?"subtitled":ae?"dubbed":p===!1?"subtitled":"dubbed",streamUrl:ke,url:ke,originalEmbedUrl:j,isHls:Q,isDirectVideo:!0,isMkv:ne,source:"SWX",getUrl:()=>ke})}return U}catch{return[]}}const kr="https://wild-credit-e1ae.cagatayca07.workers.dev";function Sr(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^\w\s-]/g," ").replace(/\s+/g," ").trim():""}async function $r({titles:i=[],seriesTitle:s="",title:o="",originalTitle:n="",season:r=1,episode:c=1,isDub:u=!1}){const d=[...new Set([n,s,o,...i])].filter(x=>x&&typeof x=="string"&&x.trim().length>1);if(d.length===0)return[];const p=[],h=new Set;for(const x of d)try{const T=Sr(x);if(!T||T.length<2)continue;const y=`https://animecix.net/secure/search/${encodeURIComponent(T)}`,D=await fetch(`${kr}?url=${encodeURIComponent(y)}`,{signal:AbortSignal.timeout(3500)});if(!D.ok)continue;const M=await D.json();if(!M.results||!Array.isArray(M.results))continue;for(const _ of M.results)if(_&&_.id&&!h.has(_.id)){const U=Sr(_.name||_.name_english||_.name_romanji||_.original_title||"");Pe(U,d)&&(h.add(_.id),p.push(_))}if(p.length>=5)break}catch{}if(p.length===0)return[];const v=[],m=new Set;for(const x of p.slice(0,4))try{const T=`https://animecix.net/secure/episode-videos?titleId=${x.id}&season=${r}&episode=${c}`,y=await fetch(`${kr}?url=${encodeURIComponent(T)}`,{signal:AbortSignal.timeout(4e3)});if(!y.ok)continue;const D=await y.json();if(!Array.isArray(D)||D.length===0)continue;const M=[];for(const _ of D){if(!_||!_.url||typeof _.url!="string")continue;const U=_.url.trim();if(m.has(U)||U.length<5)continue;m.add(U);const j=(_.name||"VIP").replace(/animecix/gi,"AX"),f=_.extra?` • ${_.extra}`:"",w=(j+" "+(_.extra||"")).toLowerCase().includes("dublaj");u&&!w||M.push({id:`acx_${x.id}_${_.id||v.length}_${u?"dub":"sub"}`,name:`AX - ${j} (${u?"1080p TR Dublaj":"1080p Altyazılı"})${f}`,displayName:`AX - ${j} (${u?"1080p TR Dublaj":"1080p Altyazılı"})`,badge:u?"🎌 Dublaj":`🎌 ${j}`,category:u?"dubbed":"subtitled",providerName:j,streamUrl:U,url:U,getUrl:()=>U})}if(M.sort((_,U)=>{const E=j=>{const f=(j.providerName+" "+j.streamUrl).toLowerCase();return f.includes("tau")?1:f.includes("sibnet")?2:f.includes("vidmoly")?3:f.includes("ok.ru")?4:f.includes("mail.ru")?5:f.includes("dood")?6:7};return E(_)-E(U)}),v.push(...M),v.length>=6)break}catch{}return v}const jo="https://wild-credit-e1ae.cagatayca07.workers.dev";function Fo(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-"):""}async function Ko({titles:i=[],seriesTitle:s="",title:o="",originalTitle:n="",season:r=1,episode:c=1,isDub:u=!1}){const d=[...new Set([...i,s,o,n])].filter(h=>h&&typeof h=="string"&&h.trim().length>1);if(d.length===0)return[];const p=[...new Set(d.map(h=>Fo(h)).filter(Boolean))];for(const h of p){if(!h)continue;const v=u?[`https://animetr.co/izle/${h}-turkce-dublaj/bolum-${c}`,`https://animetr.co/izle/${h}-dublaj/bolum-${c}`,`https://animetr.co/izle/${h}/bolum-${c}`]:[`https://animetr.co/izle/${h}/bolum-${c}`,`https://animetr.co/izle/${h}-altyazili/bolum-${c}`];for(const m of v)try{const x=`${jo}?url=${encodeURIComponent(m)}`,T=await fetch(x,{signal:AbortSignal.timeout(3500)}).catch(()=>null);if(!T||!T.ok)continue;const y=await T.text();if(y.includes("Sayfa Bulunamadı")||y.includes("404"))continue;if(u&&!m.includes("dublaj")){const w=y.toLowerCase();if(!w.includes("dublaj")&&!w.includes("türkçe dublaj"))continue}const D=[...y.matchAll(/"embed_url":"([^"]+)","provider":"([^"]+)"/gi)],M=[...y.matchAll(/<iframe[^>]+src="([^"]+)"/gi)].map(w=>w[1]),_=[],U=new Set;for(const w of D){const ae=w[1].replace(/\\/g,""),se=w[2]||"AnimeTR";ae&&!U.has(ae)&&!ae.includes("recaptcha")&&!ae.includes("filemoon")&&!ae.includes("bysejikuar")&&!ae.includes("media.cm")&&!ae.includes("vidoza")&&!ae.includes("voe")&&!ae.includes("cloudvideo")&&(U.add(ae),_.push({provider:se,url:ae}))}for(const w of M)if(w&&!U.has(w)&&!w.includes("recaptcha")&&!w.includes("filemoon")&&!w.includes("bysejikuar")&&!w.includes("media.cm")&&!w.includes("vidoza")&&!w.includes("voe")&&!w.includes("cloudvideo")){U.add(w);let ae="Player";w.includes("vidmoly")?ae="Vidmoly":w.includes("ok.ru")?ae="OK.ru":w.includes("sibnet")?ae="Sibnet":w.includes("drive.google")&&(ae="Google Drive"),_.push({provider:ae,url:w})}if(_.length===0)continue;const E=(w,ae)=>{const se=(w+" "+ae).toLowerCase();return se.includes("vidmoly")?1:se.includes("ok.ru")||se.includes("odnoklassniki")?2:se.includes("vidoza")?3:se.includes("sibnet")?4:se.includes("voe")?5:se.includes("cloudvideo")?6:se.includes("drive.google")?7:8};_.sort((w,ae)=>E(w.provider,w.url)-E(ae.provider,ae.url));const j=new Set,f=[];for(const w of _){const ae=w.provider.toLowerCase();j.has(ae)||(j.add(ae),f.push({id:`antr_${ae}_${c}_${u?"dub":"sub"}_${f.length}`,name:`AnimeTR - ${w.provider} (${u?"1080p TR Dublaj":"1080p Altyazılı"})`,badge:u?"🎌 Dublaj":`🎌 ${w.provider}`,category:u?"dubbed":"subtitled",streamUrl:w.url,url:w.url,getUrl:()=>w.url}))}if(f.length>0)return f.slice(0,6)}catch{}}return[]}const Wo="https://dizisol.com/api";async function Oo(i,s={}){const o=typeof window<"u",n=i.startsWith("/")?i:`/${i}`,r=`${Wo}${n}`,c=s.timeout||3500,u=async()=>{const p=await fetch(r,{...s,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Accept:"application/json, text/plain, */*",...s.headers||{}},signal:AbortSignal.timeout(c)});if(p&&p.ok)return p;throw new Error("Direct fetch failed")},d=async()=>{if(!o)throw new Error("No proxy needed");const p=`/api/dzs${n}`,h=await fetch(p,{...s,signal:AbortSignal.timeout(c)});if(h&&h.ok)return h;throw new Error("Proxy fetch failed")};if(o)try{return await Promise.any([d(),u()])}catch{return null}try{return await u()}catch{return null}}const bs=new Map;async function Es(i,s={}){const o=i.startsWith("/")?i:`/${i}`,n=Date.now(),r=bs.get(o);if(r){if(r.data&&n-r.timestamp<12e4)return r.data;if(r.promise)return r.promise}const c=(async()=>{const u=await Oo(o,s);if(!u)return null;const d=await u.json().catch(()=>null);return d&&bs.set(o,{data:d,timestamp:Date.now()}),d})();return bs.set(o,{promise:c,timestamp:n}),c}async function Mr(i){if(!i||typeof i!="string"||i.trim().length<2)return[];try{const s=await Es(`/movies/search?q=${encodeURIComponent(i.trim())}`,{timeout:3500});return Array.isArray(s)?s:[]}catch{return[]}}function Ur(i){if(!i||typeof i!="string")return"";const s=typeof window<"u",o=i.startsWith("/api/")?`https://dizisol.com${i}`:i;return s?`/api/hls_proxy?url=${encodeURIComponent(o)}&ref=${encodeURIComponent("https://dizisol.com/")}`:o}function Rt(i){return!i||typeof i!="string"?"":typeof window<"u"&&i.includes("dizisol.com")?`/api/hls_proxy?url=${encodeURIComponent(i)}&ref=${encodeURIComponent("https://dizisol.com/")}`:i}function Ba(i){return!(!i||typeof i!="string"||!i.startsWith("/api/")&&!i.startsWith("http://")&&!i.startsWith("https://")||i.includes("picturebox.cloud")||i.includes("setfilmizle::")||i.startsWith("setfilmizle:"))}function _a(i,s=""){let o=10;const n=(i||"").toLowerCase(),r=(s||"").toLowerCase();return r==="vip"?o+=105:r==="cortina"?o+=100:r==="vidmixi"?o+=95:r==="rapidrame"?o+=90:r==="hdfilmdelisi"?o+=85:r==="pal-vds"||r==="dizipal-vds"?o+=80:r==="vidrame"?o+=75:r==="dosyaload"?o+=72:r==="imagestoo"?o+=70:r==="diziyou"?o+=68:r==="fullhd"?o+=65:r==="filmekseni"?o+=60:r==="videoplays"?o+=55:r==="canlidizi"?o+=50:r==="draktar"?o+=45:r==="filmmakinesi"?o+=15:o+=40,n.includes("dizisol.com")&&(o+=10),o}async function xr({titles:i=[],title:s="",originalTitle:o="",tmdbId:n=null,isDub:r=!0}){try{let c=n?Number(n):null;if(!c){const m=[...new Set([...i,s,o])].filter(x=>x&&x.trim().length>1);for(const x of m){const y=(await Mr(x)).find(D=>D.type==="movie");if(y&&y.tmdbId){c=Number(y.tmdbId);break}}}if(!c)return[];const u=await Es(`/movies/by-tmdb/${c}`,{timeout:4e3});if(!u)return[];const d=[];u.subtitleTr&&d.push({label:"Türkçe",src:Rt(u.subtitleTr)}),u.subtitleEn&&d.push({label:"İngilizce",src:Rt(u.subtitleEn)});const p=[],h=new Set;if(Ba(u.m3u8Url)&&(h.add(u.m3u8Url),p.push({url:u.m3u8Url,provider:"VIP",isPrimary:!0,priority:_a(u.m3u8Url,"VIP")})),Array.isArray(u.sources))for(const m of u.sources)!m||!Ba(m.m3u8Url)||h.has(m.m3u8Url)||(h.add(m.m3u8Url),p.push({url:m.m3u8Url,provider:(m.provider||"VIP").toUpperCase(),id:m.id,subtitleTr:m.subtitleTr,subtitleEn:m.subtitleEn,isPrimary:!1,priority:_a(m.m3u8Url,m.provider)}));return p.sort((m,x)=>x.priority-m.priority),p.map((m,x)=>{const T=Ur(m.url),y=[];return m.subtitleTr&&y.push({label:"Türkçe",src:Rt(m.subtitleTr)}),m.subtitleEn&&y.push({label:"İngilizce",src:Rt(m.subtitleEn)}),{id:`dzs_mov_${c}_${m.id||m.provider||x}`,name:x===0?"DS 1080p (HLS)":`DS ${m.provider} 1080p`,displayName:x===0?"DS 1080p (HLS)":`DS ${m.provider} 1080p`,badge:r?"⚡ TR Dublaj":"💬 TR Altyazı",source:"DS",url:T,streamUrl:T,originalEmbedUrl:m.url,quality:"1080p",isHls:!0,isDirectVideo:!0,type:"hls",subtitles:y.length>0?y:d,isDub:r,getUrl:()=>T}})}catch{return[]}}async function La({titles:i=[],seriesTitle:s="",originalTitle:o="",season:n=1,episode:r=1,tmdbId:c=null,isDub:u=!0}){try{let d=c?Number(c):null;if(!d){const y=[...new Set([...i,s,o])].filter(D=>D&&D.trim().length>1);for(const D of y){const _=(await Mr(D)).find(U=>U.type==="tv");if(_&&_.tmdbId){d=Number(_.tmdbId);break}}}if(!d)return[];const p=await Es(`/movies/by-tmdb/${d}/episodes`,{timeout:4500});if(!Array.isArray(p)||p.length===0)return[];const h=p.find(y=>Number(y.season)===Number(n)&&Number(y.episode)===Number(r));if(!h)return[];const v=[];h.subtitleTr&&v.push({label:"Türkçe",src:Rt(h.subtitleTr)}),h.subtitleEn&&v.push({label:"İngilizce",src:Rt(h.subtitleEn)});const m=[],x=new Set;if(Ba(h.m3u8Url)&&(x.add(h.m3u8Url),m.push({url:h.m3u8Url,provider:"VIP",isPrimary:!0,priority:_a(h.m3u8Url,"VIP")})),Array.isArray(h.sources))for(const y of h.sources)!y||!Ba(y.m3u8Url)||x.has(y.m3u8Url)||(x.add(y.m3u8Url),m.push({url:y.m3u8Url,provider:(y.provider||"VIP").toUpperCase(),id:y.id,subtitleTr:y.subtitleTr,subtitleEn:y.subtitleEn,isPrimary:!1,priority:_a(y.m3u8Url,y.provider)}));return m.sort((y,D)=>D.priority-y.priority),m.map((y,D)=>{const M=Ur(y.url),_=[];return y.subtitleTr&&_.push({label:"Türkçe",src:Rt(y.subtitleTr)}),y.subtitleEn&&_.push({label:"İngilizce",src:Rt(y.subtitleEn)}),{id:`dzs_tv_${d}_s${n}_e${r}_${y.id||y.provider||D}`,name:D===0?`DS 1080p (S${n}B${r})`:`DS ${y.provider} 1080p (S${n}B${r})`,displayName:D===0?`DS 1080p (S${n}B${r})`:`DS ${y.provider} 1080p (S${n}B${r})`,badge:u?"⚡ TR Dublaj":"💬 TR Altyazı",source:"DS",url:M,streamUrl:M,originalEmbedUrl:y.url,quality:"1080p",isHls:!0,isDirectVideo:!0,type:"hls",subtitles:_.length>0?_:v,isDub:u,getUrl:()=>M}})}catch{return[]}}async function Pr(i){try{const s=await fetch(`https://dizibal.org/api/stream/embed?code=${encodeURIComponent(i)}&autoplay=1`,{signal:AbortSignal.timeout(6e3)});if(!s.ok)return null;const o=await s.json().catch(()=>null);return o?.success&&o.embedUrl?o.embedUrl:null}catch{return null}}const Vo="https://dizibal.org/api";async function Ni(i,s={}){const o=typeof window<"u",n=i.startsWith("/")?i:`/${i}`,r=i.startsWith("http")?i:`${Vo}${n}`,c=s.timeout||3500,u=async()=>{const p=await fetch(r,{...s,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Accept:"application/json, text/plain, */*",...s.headers||{}},signal:AbortSignal.timeout(c)});if(p&&p.ok)return p;throw new Error("Direct fetch failed")},d=async()=>{if(!o||i.startsWith("http"))throw new Error("No proxy needed");const p=Ze(`/api/dzb${n}`),h=await fetch(p,{...s,signal:AbortSignal.timeout(c)});if(h&&h.ok)return h;throw new Error("Proxy fetch failed")};if(o&&!i.startsWith("http"))try{return await Promise.any([d(),u()])}catch{return null}try{return await u()}catch{return null}}function qr(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""):""}async function Yo(i){if(!i||typeof i!="string"||i.trim().length<2)return[];try{const s=await Ni(`/series?search=${encodeURIComponent(i.trim())}`,{timeout:6500});if(!s)return[];const o=await s.json().catch(()=>null);return o&&Array.isArray(o.data)?o.data:[]}catch{return[]}}async function Xo(i){if(!i||typeof i!="string"||i.trim().length<2)return[];try{const s=await Ni(`/movies?search=${encodeURIComponent(i.trim())}`,{timeout:3500});if(!s)return[];const o=await s.json().catch(()=>null);return o&&Array.isArray(o.data)?o.data:[]}catch{return[]}}async function ka({titles:i=[],seriesTitle:s,originalTitle:o,season:n,episode:r,isDub:c=!1}){const u=[],d=parseInt(n,10)||1,p=parseInt(r,10)||1,h=new Set;Array.isArray(i)&&i.forEach(m=>m&&h.add(m)),s&&h.add(s),o&&h.add(o);let v=null;for(const m of h){const x=qr(m);if(x)try{const T=await Ni(`/series/${x}`,{timeout:5500});if(T){const y=await T.json().catch(()=>null),D=y?.data?.title||y?.data?.name||y?.data?.name_tr||y?.data?.name_en||y?.data?.slug||"";if(y&&y.success&&y.data&&y.data._id&&Pe(D,[...h])){v=y.data;break}}}catch{}}if(!v)for(const m of h){const x=await Yo(m);if(x.length>0&&(v=x.find(T=>{const y=T.title||T.name||T.name_tr||T.name_en||T.slug||"";return Pe(y,[...h])}),v))break}if(!v||!v._id)return[];try{const m=await Ni(`/series/${v._id}/seasons/${d}`,{timeout:6500});if(!m)return[];const x=await m.json().catch(()=>null);if(!x||!x.success||!x.data||!Array.isArray(x.data.episodes))return[];const T=x.data.episodes.find(M=>parseInt(M.episode_number,10)===p);if(!T||!T.src)return[];const y=T.src,D=await Pr(y)||`https://x.ag2m4.cfd/embed-${y}.html?autoplay=1`;D&&u.push({id:`dzb_player_s${d}e${p}`,name:c?"DP DiziBal Player (TR Dublaj)":"DP DiziBal Player (TR Altyazı)",displayName:"DP DiziBal Player",streamUrl:D,url:D,subtitles:[],isHls:!1,isDirectVideo:!1,source:"DP",badge:"🌐 DiziBal Orijinal Player"})}catch{}return u}async function Sa({titles:i=[],title:s,originalTitle:o,isDub:n=!1}){const r=[],c=new Set;Array.isArray(i)&&i.forEach(h=>h&&c.add(h)),s&&c.add(s),o&&c.add(o);let u=null;for(const h of c){const v=qr(h);if(v)try{const m=await Ni(`/movies/${v}`,{timeout:3e3});if(m){const x=await m.json().catch(()=>null),T=x?.data?.title||x?.data?.title_tr||x?.data?.title_en||x?.data?.slug||"";if(x&&x.success&&x.data&&x.data.src&&Pe(T,[...c])){u=x.data;break}}}catch{}}if(!u)for(const h of c){const v=await Xo(h);if(v.length>0&&(u=v.find(m=>{const x=m.title||m.title_tr||m.title_en||m.slug||"";return Pe(x,[...c])}),u))break}if(!u||!u.src)return[];const d=u.src,p=await Pr(d)||`https://x.ag2m4.cfd/embed-${d}.html?autoplay=1`;return p&&r.push({id:"dzb_player_movie",name:n?"DP DiziBal Player (TR Dublaj)":"DP DiziBal Player (TR Altyazı)",displayName:"DP DiziBal Player",streamUrl:p,url:p,subtitles:[],isHls:!1,isDirectVideo:!1,source:"DP",badge:"🌐 DiziBal Orijinal Player"}),r}const Go="https://wild-credit-e1ae.cagatayca07.workers.dev";async function xs(i,s={}){const o=typeof window<"u",n=s.headers?.Referer||s.headers?.referer||"",r=n?`&ref=${encodeURIComponent(n)}`:"",c=o?`/api/proxy?url=${encodeURIComponent(i)}${r}`:`http://localhost:4000/proxy?url=${encodeURIComponent(i)}${r}`;try{const u=await fetch(c,{...s,signal:AbortSignal.timeout(s.timeout||3500)}).catch(()=>null);if(u&&u.ok)return u}catch{}try{const u=await fetch(i,{...s,signal:AbortSignal.timeout(s.timeout||3500)}).catch(()=>null);if(u&&u.ok)return u}catch{}try{const u=`${Go}?url=${encodeURIComponent(i)}${r}`,d=await fetch(u,{...s,signal:AbortSignal.timeout(s.timeout||3500)}).catch(()=>null);if(d&&d.ok)return d}catch{}return null}async function Nr(i){if(!i||typeof i!="string")return null;try{let s=i;s.startsWith("//")&&(s=`https:${s}`),s.startsWith("http")||(s=`https://${s}`);const o=await xs(s,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Referer:"https://vidmoly.net/"},timeout:4e3});if(!o)return null;const n=await o.text();if(!n)return null;const r=n.match(/sources\s*:\s*\[([\s\S]*?)\]/i);let c=null;if(r){const u=r[1].match(/file\s*:\s*["']([^"']+\.m3u8[^"']*)["']/i);u&&(c=u[1])}if(!c){const u=n.match(/https?:\/\/[^"'\s<>]+\.m3u8[^"'\s<>]*/i);u&&(c=u[0])}if(c)return c.startsWith("//")&&(c=`https:${c}`),{url:c,streamUrl:c,isHls:!0,isDirectVideo:!0,type:"hls"}}catch{}return null}async function Zo(i){if(!i||typeof i!="string")return null;try{let s=i;s.startsWith("//")&&(s=`https:${s}`),s.startsWith("http")||(s=`https://${s}`);const o=s.match(/^https?:\/\/([^/]+)/i),r=`https://${o?o[1]:"x.ag2m4.cfd"}`,c=await xs(s,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Referer:"https://dizibal.org/"},timeout:4500});if(!c)return null;const u=await c.text();if(!u)return null;const d=u.match(/fetch\(['"](\/dl\?op=get_stream[^'"]+)['"]\)/i);if(!d)return null;const p=`${r}${d[1]}`,h=await xs(p,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Referer:s,Origin:r,Accept:"*/*"},timeout:4500});if(!h)return null;const v=await h.json().catch(()=>null);if(!v||!v.url)return null;let m=v.url;m.startsWith("//")&&(m=`https:${m}`);const T=typeof window<"u"?`/api/hls_proxy?url=${encodeURIComponent(m)}&ref=${encodeURIComponent(r+"/")}`:m,y=u.match(/["']?subtitle["']?\s*:\s*["']([^"']+)["']/i),D=[];if(y&&y[1]){const M=y[1].split(",");for(const _ of M){const U=_.match(/\[(.*?)\](.*)/);U&&D.push({label:U[1],src:U[2]})}}return{url:T,streamUrl:T,rawUrl:m,isHls:!0,isDirectVideo:!0,type:"hls",subtitles:D}}catch{}return null}async function hs(i){if(!i)return null;const s=(i.url||i.streamUrl||(typeof i.getUrl=="function"?i.getUrl():"")||"").toLowerCase();if(s.includes("ag2m4")||s.includes("agcdn")||s.includes("liderfilm")||i.id&&i.id.startsWith("dbl")){const o=i.url||i.streamUrl||(typeof i.getUrl=="function"?i.getUrl():""),n=await Zo(o);if(n&&(n.url||n.streamUrl)){let r=n.url||n.streamUrl;return r.startsWith("http")&&!r.includes("/api/hls_proxy")&&(r=`/api/hls_proxy?url=${encodeURIComponent(r)}&ref=${encodeURIComponent("https://x.ag2m4.cfd/")}`),{...i,isHls:!0,isDirectVideo:!0,originalEmbedUrl:o,streamUrl:r,url:r,subtitles:n.subtitles,getUrl:()=>r}}}return i}const Jo="https://wild-credit-e1ae.cagatayca07.workers.dev",Hr="https://www.diziyo.so";async function zt(i,s={}){const o=typeof window<"u";let n=i;if(n.startsWith("http"))try{const c=new URL(n);n=c.pathname+c.search}catch{}n=n.replace(/^\/api\/dzyo/,""),n.startsWith("/")||(n=`/${n}`);const r=`${Hr}${n}`;if(o)try{const c=`/api/dzyo${n}`,u=await fetch(c,{...s,signal:AbortSignal.timeout(s.timeout||4e3)}).catch(()=>null);if(u&&u.ok)return u}catch{}try{const c=await fetch(r,{...s,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",Referer:"https://www.diziyo.so/",...s.headers||{}},signal:AbortSignal.timeout(s.timeout||4e3)}).catch(()=>null);if(c&&c.ok)return c}catch{}if(o)try{const c=`/api/proxy?url=${encodeURIComponent(r)}&ref=${encodeURIComponent("https://www.diziyo.so/")}`,u=await fetch(c,{...s,signal:AbortSignal.timeout(s.timeout||4e3)}).catch(()=>null);if(u&&u.ok)return u}catch{}try{const c=`${Jo}?url=${encodeURIComponent(r)}`,u=await fetch(c,{...s,signal:AbortSignal.timeout(s.timeout||4500)}).catch(()=>null);if(u&&u.ok)return u}catch{}return null}function jr(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""):""}async function Fr(i){if(!i||typeof i!="string"||i.trim().length<2)return[];try{const s=await zt(`/arama?q=${encodeURIComponent(i.trim())}`,{timeout:3500});if(!s)return[];const o=await s.text().catch(()=>"");return o?Array.from(new Set(o.match(/href="https:\/\/www\.diziyo\.so\/(?:dizi|film)\/[^"]+"/g)||[])).map(r=>{const c=r.replace('href="',"").replace('"',""),u=c.includes("/dizi/"),d=c.match(/\/(?:dizi|film)\/([^/]+)/);return{url:c,slug:d?d[1]:"",isSeries:u}}):[]}catch{return[]}}async function Kr(i,s){try{const o=await zt(i,{headers:{Referer:s},timeout:4500});if(!o)return null;const n=await o.text(),r=n.match(/name="_token"\s+value="([^"]+)"/),c=n.match(/action="([^"]+)"/);if(!r||!c)return null;const u=r[1],d=c[1];let p="";typeof o.headers.getSetCookie=="function"?p=o.headers.getSetCookie().map(x=>x.split(";")[0].trim()).join("; "):p=(o.headers.get("set-cookie")||"").split(/,\s*(?=[a-zA-Z0-9_-]+=)/).map(T=>T.split(";")[0].trim()).join("; ");const h=await zt(d,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded",Referer:i,Origin:Hr,"x-dzyo-referer":i,...p?{Cookie:p,"x-dzyo-cookie":p}:{}},body:new URLSearchParams({_token:u}),timeout:5e3});if(!h)return null;let v="";(h.ok||h.status===200)&&(v=await h.text().catch(()=>""));let m=h.headers?.get?.("location");if(!m&&v){const x=v.match(/url='([^']+)'/i)||v.match(/url="([^"]+)"/i);x&&(m=x[1])}if(m){const x=await zt(m,{headers:{Referer:d,"x-dzyo-referer":d,...p?{Cookie:p,"x-dzyo-cookie":p}:{}},timeout:4500});if(x){const T=await x.text().catch(()=>"");T&&(v=T)}}if(v){const x=v.match(/src="([^"]+vidmoly[^"]+)"/i);if(x){const y=x[1];return y.startsWith("//")?`https:${y}`:y}const T=v.match(/id="provider-frame"[^>]*src="([^"]+)"/i)||v.match(/<iframe[^>]+class="[^"]*player-watch[^"]*"[^>]*src="([^"]+)"/i)||v.match(/<iframe[^>]+src="([^"]+)"/i);if(T){let y=T[1];if(y.startsWith("//")&&(y=`https:${y}`),!y.includes("diziyo.so")&&!y.includes("/player/video/")&&!y.includes("/player/gate/"))return y}}}catch{}return null}async function Ar({titles:i=[],seriesTitle:s,originalTitle:o,season:n,episode:r,isDub:c=!1}){const u=[],d=parseInt(n,10)||1,p=parseInt(r,10)||1,h=new Set;Array.isArray(i)&&i.forEach(m=>m&&h.add(m)),s&&h.add(s),o&&h.add(o);let v=null;for(const m of h){const x=jr(m);if(!x)continue;const T=`https://www.diziyo.so/dizi/${x}/sezon-${d}/bolum-${p}/`;try{const y=await zt(T,{timeout:5e3});if(y&&y.ok){v=T;break}}catch{}}if(!v)for(const m of h){const T=(await Fr(m)).find(y=>y.isSeries&&Pe(y.slug,[...h]));if(T&&T.slug){const y=`https://www.diziyo.so/dizi/${T.slug}/sezon-${d}/bolum-${p}/`,D=await zt(y,{timeout:3e3});if(D&&D.ok){v=y;break}}}if(!v)return[];try{const m=await zt(v,{timeout:6e3});if(!m)return[];const x=await m.text().catch(()=>"");if(!x)return[];if(!Pe(Ra(x),[...h]))return[];const T=[...x.matchAll(/data-player-source="([^"]+)"[^>]*data-player-language-name="([^"]+)"/gi)];if(T.length===0)return[];let y=null;for(const _ of T){const U=_[1],E=(_[2]||"").toLowerCase();if(c&&(E.includes("dublaj")||E.includes("turkce")||E.includes("tr"))){y=U;break}if(!c&&(E.includes("altyaz")||E.includes("sub"))){y=U;break}}y||(y=T[0][1]);let D=null,M=null;try{if(M=await Kr(y,v),M&&M.includes("vidmoly")){const _=await Nr(M).catch(()=>null);_&&_.streamUrl&&(D=_.streamUrl)}}catch{}D&&u.push({id:`dzy_vidmoly_s${d}e${p}_${c?"dub":"sub"}`,name:c?"Diziyo 1080p VIP (TR Dublaj)":"Diziyo 1080p VIP (TR Altyazı)",displayName:"Diziyo 1080p VIP",streamUrl:D,url:D,isHls:!0,isDirectVideo:!0,source:"Diziyo",badge:c?"⚡ Diziyo Dublaj":"💬 Diziyo Altyazı",getUrl:()=>D}),M&&!M.includes("diziyo.so")&&!M.includes("/player/video/")&&!M.includes("/player/gate/")&&u.push({id:`dzy_player_s${d}e${p}_${c?"dub":"sub"}`,name:c?"Diziyo VIP (TR Dublaj)":"Diziyo VIP (TR Altyazı)",displayName:"Diziyo VIP",streamUrl:M,url:M,isHls:!1,isDirectVideo:!1,source:"Diziyo",badge:c?"⚡ Diziyo Dublaj":"💬 Diziyo Altyazı",getUrl:()=>M})}catch{}return u}async function zr({titles:i=[],title:s,originalTitle:o,isDub:n=!1}){const r=[],c=new Set;Array.isArray(i)&&i.forEach(d=>d&&c.add(d)),s&&c.add(s),o&&c.add(o);let u=null;for(const d of c){const p=jr(d);if(!p)continue;const h=`https://www.diziyo.so/film/${p}/`;try{const v=await zt(h,{timeout:3e3});if(v&&v.ok){u=h;break}}catch{}}if(!u)for(const d of c){const h=(await Fr(d)).find(v=>!v.isSeries&&Pe(v.slug,[...c]));if(h&&h.url){u=h.url;break}}if(!u)return[];try{const d=await zt(u,{timeout:4e3});if(!d)return[];const p=await d.text().catch(()=>"");if(!p)return[];if(!Pe(Ra(p),[...c]))return[];const h=[...p.matchAll(/data-player-source="([^"]+)"[^>]*data-player-language-name="([^"]+)"/gi)];if(h.length===0)return[];let v=null;for(const T of h){const y=T[1],D=(T[2]||"").toLowerCase();if(n&&(D.includes("dublaj")||D.includes("tr"))){v=y;break}if(!n&&(D.includes("altyaz")||D.includes("sub"))){v=y;break}}v||(v=h[0][1]);let m=null,x=null;try{if(x=await Kr(v,u),x&&x.includes("vidmoly")){const T=await Nr(x).catch(()=>null);T&&T.streamUrl&&(m=T.streamUrl)}}catch{}m&&r.push({id:`dzy_vidmoly_movie_${n?"dub":"sub"}`,name:n?"Diziyo 1080p VIP (TR Dublaj)":"Diziyo 1080p VIP (TR Altyazı)",displayName:"Diziyo 1080p VIP",streamUrl:m,url:m,isHls:!0,isDirectVideo:!0,source:"Diziyo",badge:n?"⚡ Diziyo Dublaj":"💬 Diziyo Altyazı",getUrl:()=>m}),x&&!x.includes("diziyo.so")&&!x.includes("/player/video/")&&!x.includes("/player/gate/")&&r.push({id:`dzy_player_movie_${n?"dub":"sub"}`,name:n?"Diziyo VIP (TR Dublaj)":"Diziyo VIP (TR Altyazı)",displayName:"Diziyo VIP",streamUrl:x,url:x,isHls:!1,isDirectVideo:!1,source:"Diziyo",badge:n?"⚡ Diziyo Dublaj":"💬 Diziyo Altyazı",getUrl:()=>x})}catch{}return r}const Qo="https://wild-credit-e1ae.cagatayca07.workers.dev",el="https://www.diziyou.one";function tl(i){return i?i.toString().toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9\s-]/g,"").replace(/[\s_]+/g,"-").replace(/^-+|-+$/g,""):""}async function ys(i,s={}){const o=typeof window<"u";let n=i;if(n.startsWith("http"))try{const c=new URL(n);n=c.pathname+c.search}catch{}n=n.replace(/^\/api\/dzy/,""),n.startsWith("/")||(n=`/${n}`);const r=`${el}${n}`;if(o)try{const c=Ze(`/api/dzy${n}`),u=await fetch(c,{...s,signal:AbortSignal.timeout(s.timeout||4e3)}).catch(()=>null);if(u&&u.ok)return u}catch{}try{const c=await fetch(r,{...s,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Referer:"https://www.diziyou.one/",...s.headers||{}},signal:AbortSignal.timeout(s.timeout||4e3)}).catch(()=>null);if(c&&c.ok)return c}catch{}if(o)try{const c=Ze(`/api/proxy?url=${encodeURIComponent(r)}&ref=${encodeURIComponent("https://www.diziyou.one/")}`),u=await fetch(c,{...s,signal:AbortSignal.timeout(s.timeout||4e3)}).catch(()=>null);if(u&&u.ok)return u}catch{}try{const c=`${Qo}?url=${encodeURIComponent(r)}`,u=await fetch(c,{...s,signal:AbortSignal.timeout(s.timeout||4500)}).catch(()=>null);if(u&&u.ok)return u}catch{}return null}async function il({titles:i=[],title:s="",seriesTitle:o="",originalTitle:n="",season:r=1,episode:c=1,isDub:u=!1}){const d=parseInt(r,10)||1,p=parseInt(c,10)||1,h=Array.from(new Set([o,s,n,...i||[]])).filter(Boolean),v=new Set;for(const y of h){const D=tl(y);D&&(v.add(`/${D}-${d}-sezon-${p}-bolum/`),v.add(`/${D}2-${d}-sezon-${p}-bolum/`),v.add(`/${D}-${d}-sezon-${p}-bolum-izle/`),v.add(`/dizi/${D}-${d}-sezon-${p}-bolum/`))}let x=(await Promise.all([...v].map(async y=>{try{const D=await ys(y,{timeout:4500});if(!D)return null;const M=await D.text();return!M||M.length<500?null:{epPath:y,html:M}}catch{return null}}))).filter(Boolean);if(x.length===0)for(const y of h.slice(0,2))try{const D=await ys(`/?s=${encodeURIComponent(y)}`,{timeout:3500});if(!D)continue;const M=await D.text(),_=new RegExp(`href="([^"]*(?:${d}-sezon-${p}-bolum|bolum)[^"]*)"`,"gi"),U=[...M.matchAll(_)].map(E=>E[1]);for(const E of U.slice(0,3)){const j=await ys(E,{timeout:4e3});if(j){const f=await j.text();if(f&&f.length>500){x.push({epPath:E,html:f});break}}}if(x.length>0)break}catch{}const T=[];for(const y of x){const{html:D}=y;if(!Pe(Ra(D),h))continue;const M=D.match(/<iframe[^>]+src=["']([^"']*(?:player|embed)[^"']*)["']/i),_=D.match(/\/player\/(\d+)\.html/i);if(_){const U=_[1],E=`https://storage.diziyou.one/episodes/${U}/play.m3u8`;T.push({id:`dyu_m3u8_${U}`,name:"Diziyou 1080p (TR Altyazı)",displayName:"Diziyou 1080p",badge:"💬 Diziyou Altyazı",url:E,streamUrl:E,isHls:!0,isDirectVideo:!0,source:"Diziyou",getUrl:()=>E});const j=`https://www.diziyou.one/player/${U}.html`;T.push({id:`dyu_frame_${U}`,name:"Diziyou VIP (TR Altyazı)",displayName:"Diziyou VIP",badge:"💬 Diziyou Web",url:j,streamUrl:j,isHls:!1,isDirectVideo:!1,source:"Diziyou",getUrl:()=>j});break}else if(M){const U=M[1].startsWith("//")?`https:${M[1]}`:M[1];T.push({id:`dyu_frame_${Math.random().toString(36).substring(2,6)}`,name:"Diziyou VIP (TR Altyazı)",displayName:"Diziyou VIP",badge:"💬 Diziyou Web",url:U,streamUrl:U,isHls:!1,isDirectVideo:!1,source:"Diziyou",getUrl:()=>U});break}}return T}const Wr="https://www.hdfilmizle.best";function Ui(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9]/g,""):""}async function As(i,s={}){const o=typeof window<"u",n=s.headers?.Referer||s.headers?.referer||"",r=n?`&ref=${encodeURIComponent(n)}`:"",c=o?`/api/proxy?url=${encodeURIComponent(i)}${r}`:`http://localhost:4000/proxy?url=${encodeURIComponent(i)}${r}`,u={...s.headers||{}};n&&(u["X-Proxy-Referer"]=n);try{const d=await fetch(c,{...s,headers:u,signal:AbortSignal.timeout(s.timeout||4500)}).catch(()=>null);if(d&&d.ok)return d}catch{}try{const d=await fetch(i,{...s,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Accept:"application/json, text/html, */*",...s.headers||{}},signal:AbortSignal.timeout(s.timeout||4500)}).catch(()=>null);if(d&&d.ok)return d}catch{}return null}async function al(i,s=!1){if(!i||typeof i!="string"||i.trim().length<2)return[];try{const n=`${Wr}/wp-json/wp/v2/${s?"dizi":"film"}?search=${encodeURIComponent(i.trim())}`,r=await As(n);if(!r)return[];const c=await r.json().catch(()=>[]);return Array.isArray(c)?c.map(u=>({id:u.id,title:u.title?.rendered||"",link:u.link||"",slug:u.slug||""})):[]}catch{return[]}}async function gs({titles:i=[],title:s="",originalTitle:o="",isDub:n=!0}){const r=[...new Set([...i,s,o])].filter(c=>c&&typeof c=="string"&&c.trim().length>1);if(r.length===0)return[];for(const c of r){const u=await al(c,!1);if(u.length===0)continue;const d=Ui(c),p=u.find(h=>{const v=Ui(h.title),m=Ui(h.slug);return v===d||m===d})||u.find(h=>{const v=Ui(h.title),m=Ui(h.slug);return v.includes(d)||m.includes(d)});if(p)try{const h=await As(p.link);if(!h)continue;const m=(await h.text()).match(/_hdfNonce_\s*=\s*["']([^"']+)["']/i),x=m?m[1]:"",T=n?"tr":"en",y=`${Wr}/ajax/videosrc/?id=${p.id}&lang=${T}&mr=0`,D=await As(y,{headers:{Referer:p.link,"X-HDF-Nonce":x,"X-Requested-With":"XMLHttpRequest"}});if(!D)continue;const M=await D.json().catch(()=>null);if(!M||!M.src)continue;const _=M.src,U=typeof window<"u",E=U?`/api/hls_proxy?url=${encodeURIComponent(_)}&ref=${encodeURIComponent(p.link)}`:_,j=[];if(Array.isArray(M.tracks)){for(const f of M.tracks)if(f.src&&f.label){const w=U?`/api/hls_proxy?url=${encodeURIComponent(f.src)}&ref=${encodeURIComponent(p.link)}`:f.src;j.push({label:f.label,src:w,srclang:f.srclang||"tr"})}}return[{id:`hdfb_mov_${p.id}_${n?"dub":"sub"}`,name:n?"HDF Dublaj 1080p":"HDF Altyazı 1080p",displayName:n?"HDF Dublaj 1080p":"HDF Altyazı 1080p",badge:n?"⚡ TR Dublaj":"💬 TR Altyazı",source:"HDFilmizle",url:E,streamUrl:E,quality:"1080p",isHls:!0,isDirectVideo:!0,type:"hls",subtitles:j,isDub:n,getUrl:()=>E}]}catch{}}return[]}const sl="3508611138826751fdf77beaa6f93eb93fd27e6a5acb910e7aad22665513dd6e",nl="666482389dc76bfa57068407418f7dac9f6c14b6868856b169165b9fac7d812e",Pi="4F5A9C3D9A86FA54EACEDDD635185/c3c5bd17-e37b-4b94-a944-8a3688a30452",rl="aLhsnd71BqsMC_HZoT8MR_TrfZS1_WcAzYT5nROaUKI",ol="MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDq5iorf3BOWNqObZFRyco/sa7GrDO5r094yhO1FsWRvwoTRneD1ryv+yVLwJrr0IOmjhD2hgyErvs6XRhAmNa18fcMlHJqHlghHA0dt2FnkFlqlZ029/w1inZ8+g5XFjffNp8Xb5T44PrsowlI5Mjfe0JpkHCN20tLkmGdMUes9yQNbKwpUXvBPq/bLYn8IJNoR/kP/4mis7mMeRzWgIupc9AlFx6HH7IZ6NfYmyqDdo7xdSg+WNl/rcuYcPccuN6dIhqWeceSOFiChaGHJMtuEzbHHefRqbK529eNHVTpUmRtfaZu2a+DRXkoz2TU1KCrnSDuNztvlKjiztiJZMdlAgMBAAECggEACCjTmSw1lfsfKGhk7l7gkCLXa95Kc65Dx/HZCmbOmRf2PSIq/6DjcAd8zatUllFpaU0xCKcyYx+C6Y2XTJMijjJn/v9fFBGWxRuo1vnqP8MzX/Dvg5vMnn1/TSsQeXTznuTSVOmS1qxV+wdUyLvtwFmTPoB+cGcIMAlXK7MtBrSD9kCRcpJZgFNUILhn6ISm9NpaqU+5xBBuJRsXaMDvSUTHi1IKK2ZUneetFAgg6BVE5StmORBjMgXfNRIsD+oOHUvtsEczcHnAP2hW19I0lXfwnLhaAicKIECCDpn6cwfBtQWnSDSENCLMemM2O8KYvAizBW4ET3BZBqSDrZEzRwKBgQD/9o7qbE2LEJ19Mkg+4PTqMJ06bFWKUvUB3JuS4Iu/wy9u6tAU7uQySo9vSDDclG8TaDjkz6c2eTmDy7LdFESwLgiHV6cmpm0sieoTMaz1pVkpykifQo1fv2Q60t/co6oEyUWfmdk3iaK6j3MFhjqRpkmZcUYvBYyuRUv8ewKtcwKBgQDq7tRYL2c6cIznwqTJdLuap3eFRP21ymjV/TTp2DrZtVevw9rNYflDK88mIxZdbbAqPT10zbRc3UnqeE2+76UKBAodUJpSPXg2WvA0hZe57q1VnU7gQhMgvDWRPrTG7qbij+FnRtPHWZ1HGLFfl2DSDnFEVsJo2xXQjw5vMTOBxwKBgQDlbKQQ7t5aRZxD+WvUIGKl/skO8seBYnYFIy226tmYGmVLr+Cuwql7gmUqQ7S4Ibul04cbYBzqsKGixlQd4OroV3qBhUlnVUkJ4NwUNDRpQbm3wX5ycX6yUaSPLTBGXdQo0hc7xPRz2UQooCdizjt1DW1uwZ88ymacVbSUK9XsjQKBgGTNhR8xd8GDeXIX+kzWYYjCQm5UY+gUqVboBkQwG1A+lxk7mC5301QXABMFCxubbPMyw6PSf4k5CfYpGHLMsKvTf+OEKjMPXP01l8txZuDIoGcT0Dw5Hav2FaX0meyhicm8oqKFqWjn8qwG1FSHx2tZ9w+zikcjegC64R6kpc0RAoGAO4/tqaXM5CUUWtHanK/1j6KYbFqsKL13FeqIr8TprF4LXpzrzFAPMCmWL6XFq8JZqZj/KNjH9vvt9f7/9QMvI4nZ+0vXihRqdX7LO+XliGRhuXjHp3RlUU4s8eJt9Af7PCFWFX0gwfM8SnkVUTkE3tOQHgk7hM3PUOPH0yZ+gQ8=",ll="MIIDDDCCAfSgAwIBAgIJYFwVX3W1KCXxMA0GCSqGSIb3DQEBCwUAMBgxFjAUBgNVBAMMDWF0dGVzdF9yc2FfdjEwHhcNMjYwOTA4MTUwMjMyWhcNMjcwOTA4MTUwMjMyWjAYMRYwFAYDVQQDDA1hdHRlc3RfcnNhX3YxMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6uYqK39wTljajm2RUcnKP7Guxqwzua9PeMoTtRbFkb8KE0Z3g9a8r_slS8Ca69CDpo4Q9oYMhK77Ol0YQJjWtfH3DJRyah5YIRwNHbdhZ5BZapWdNvf8NYp2fPoOVxY33zafF2-U-OD67KMJSOTI33tCaZBwjdtLS5JhnTFHrPckDWysKVF7wT6v2y2J_CCTaEf5D_-JorO5jHkc1oCLqXPQJRcehx-yGejX2Jsqg3aO8XUoPljZf63LmHD3HLjenSIalnnHkjhYgoWhhyTLbhM2xx3n0amyudvXjR1U6VJkbX2mbtmvg0V5KM9k1NSgq50g7jc7b5So4s7YiWTHZQIDAQABo1kwVzAMBgNVHRMBAf8EAjAAMA4GA1UdDwEB_wQEAwIFoDAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwGAYDVR0RBBEwD4INYXR0ZXN0X3JzYV92MTANBgkqhkiG9w0BAQsFAAOCAQEAREcHgi7mZGgOpu1jBzN89IJIdMSRjYI5AYwhePByZy7U4SOeqq5WTXPsOZdUjGyib1CJzvs44ro8_L9hLfeJCzNTRk9yyAt_EJ6QHAqdyMIBwNSSb3wDg6N7T4x4MJrgoHJ7uRf2iGEdMfazb2aZFyHQjyt4paUCrix5jt7FXY_02pyEQWPLYQb8U6nf8strd4nNdrm9EPAEF7zY7ZXD5L8egXvTkdmvsBRU5OQLftw1JaPkLu85zMQ2hZtscmCQ2ImxxwBlUqS7V_QmaMFHkdJrWQdXF7vU2Ws0qv3qBU7-FJgqGUSuDMFw7sMeeWuVKvg7WjSxolwPZrqIo6ZSUA";function cl(i){let s="";for(let o=0;o<i.length;o++)s+=String.fromCharCode(i[o]);return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"")}function dl(i){let s=i.replace(/-/g,"+").replace(/_/g,"/");for(;s.length%4;)s+="=";const o=atob(s),n=new Uint8Array(o.length);for(let r=0;r<o.length;r++)n[r]=o.charCodeAt(r);return n}function ul(i){const s=new Uint8Array(i.length/2);for(let o=0;o<s.length;o++)s[o]=parseInt(i.substr(o*2,2),16);return s}function Or(i){return Array.from(i).map(s=>s.toString(16).padStart(2,"0")).join("")}async function pl(i){const s=new TextEncoder().encode(i),o=await crypto.subtle.digest("SHA-256",s);return Or(new Uint8Array(o))}async function ml(i,s){const o=new TextEncoder,n=await crypto.subtle.importKey("raw",o.encode(i),{name:"HMAC",hash:"SHA-256"},!1,["sign"]),r=await crypto.subtle.sign("HMAC",n,o.encode(s));return Or(new Uint8Array(r))}async function zs(i,s,o=""){const n=Math.floor(Date.now()/1e3).toString(),r=typeof crypto.randomUUID=="function"?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,p=>{const h=Math.random()*16|0;return(p==="x"?h:h&3|8).toString(16)}),c=await pl(o),u=`${i}
${s}
${n}
${r}
${c}`,d=await ml(sl,u);return{"user-agent":"okhttp/4.12.0","X-Timestamp":n,"X-Nonce":r,"X-Signature":d,"X-App-Version":"110","X-Client-Id":"rectv-android"}}let $a=null;async function fl(){if($a)return $a;const i=atob(ol),s=new Uint8Array(i.length);for(let o=0;o<i.length;o++)s[o]=i.charCodeAt(o);return $a=await crypto.subtle.importKey("pkcs8",s,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},!1,["sign"]),$a}let pi=null,xa=0;const bl=typeof window>"u";function Ds(i){return bl?`https://a.prectv70.lol/api${i}`:`/api/rtv${i}`}let Dr=0;async function hl(){const i=Math.floor(Date.now()/1e3);if(pi&&xa>i+120)return pi;if(typeof localStorage<"u"){const s=localStorage.getItem("rectv_jwt_token"),o=parseInt(localStorage.getItem("rectv_jwt_exp")||"0",10);if(s&&o>i+120)return pi=s,xa=o,s}if(Date.now()-Dr<3e5)return null;try{const o={...await zs("GET","/api/attest/nonce",""),"x-rtv-path":"/attest/nonce"},n=await fetch(Ds("/attest/nonce"),{method:"GET",headers:o});if(!n.ok)throw new Error(`Nonce request failed with status ${n.status}`);const c=(await n.json()).nonce;if(!c)throw new Error("Empty nonce returned");const u=dl(c),d=await fl(),p=await crypto.subtle.sign("RSASSA-PKCS1-v1_5",d,u),h=cl(new Uint8Array(p)),v="/api/attest/verify",m=JSON.stringify({certChain:[ll],nonce:c,pkg:"com.rectv.shot",proof:h,sig:rl}),x={...await zs("POST",v,m),"x-rtv-path":"/attest/verify","Content-Type":"application/json"},T=await fetch(Ds("/attest/verify"),{method:"POST",headers:x,body:m});if(!T.ok)throw new Error(`Verify attestation failed with status ${T.status}`);const y=await T.json();if(!y.jwt)throw new Error("Verify did not return JWT");if(pi=y.jwt,xa=y.exp||i+7200,typeof localStorage<"u")try{localStorage.setItem("rectv_jwt_token",pi),localStorage.setItem("rectv_jwt_exp",xa.toString())}catch{}return pi}catch{return Dr=Date.now(),null}}let Aa=null;async function yl(){if(Aa)return Aa;const i=ul(nl);return Aa=await crypto.subtle.importKey("raw",i,{name:"AES-GCM"},!1,["decrypt"]),Aa}async function Tr(i){if(!i)return"";if(i.startsWith("http://")||i.startsWith("https://"))return i;try{const s=atob(i),o=new Uint8Array(s.length);for(let p=0;p<s.length;p++)o[p]=s.charCodeAt(p);const n=o.slice(0,12),r=o.slice(12),c=await yl(),u=await crypto.subtle.decrypt({name:"AES-GCM",iv:n,tagLength:128},c,r);return new TextDecoder("utf-8").decode(u)}catch{return""}}async function qi(i,s="GET",o=""){let n=null;try{n=await hl()}catch{}const r=`/api${i}`,u={...await zs(s,r,o),"x-rtv-path":i,...n?{Authorization:`Bearer ${n}`}:{},...o?{"Content-Type":"application/json"}:{}};try{const d=await fetch(Ds(i),{method:s,headers:u,signal:AbortSignal.timeout(6e3),...o?{body:o}:{}});if(d.ok)return await d.json()}catch{}return null}async function gl({type:i="movie",title:s="",originalTitle:o="",season:n=1,episode:r=1,year:c=null}){const u=(s||o||"").trim();if(!u)return[];const d=parseInt(n,10)||1,p=parseInt(r,10)||1;try{let h=await qi(`/search/${encodeURIComponent(u)}/${Pi}/`);if((!h||!Array.isArray(h.posters)||h.posters.length===0)&&o&&o.toLowerCase()!==u.toLowerCase()&&(h=await qi(`/search/${encodeURIComponent(o.trim())}/${Pi}/`)),!h||!Array.isArray(h.posters)||h.posters.length===0)return[];const v=[u,o].filter(Boolean),m=i==="movie";let x=null;const T=D=>{if(!D)return!1;if(Pe(D,v))return!0;const M=D.split(/\s*[-/:]\s*/).filter(Boolean);for(const _ of M)if(Pe(_,v))return!0;return!1};for(const D of h.posters)if((m?D.type==="movie":D.type==="serie")&&T(D.title||D.name||"")){x=D;break}if(!x)return[];const y=[];if(m){if(Array.isArray(x.sources))for(const D of x.sources){if(!D.enc_url&&!D.url)continue;const M=D.enc_url?await Tr(D.enc_url):D.url;if(!M||!M.startsWith("http"))continue;const _=`/api/hls_proxy?url=${encodeURIComponent(M)}&ref=https://a.prectv70.lol/`,E=(D.title||"").toLowerCase().includes("dublaj")||(x.label||"").toLowerCase().includes("dublaj")?"🇹🇷 TVR VIP (TR Dublaj)":"⚡ TVR VIP (TR Altyazı)";y.push({id:`tvr_movie_${x.id}_${D.id}`,name:E,displayName:E,badge:"⚡ TVR VIP",source:"TVR VIP",url:_,streamUrl:_,rawStreamUrl:M,quality:"1080p HD",isHls:!0,isDirectVideo:!0,priority:0,getUrl:()=>_})}}else{const D=await qi(`/season/by/serie/${x.id}/${Pi}/`);if(Array.isArray(D))for(const M of D){const _=(M.title||M.name||"").toLowerCase(),U=_.match(/(\d+)/)||[];if((U[1]?parseInt(U[1],10):parseInt(M.number||M.season_number||M.num||"0",10)||1)!==d)continue;const j=_.includes("dublaj")||(M.label||"").toLowerCase().includes("dublaj");let f=Array.isArray(M.episodes)?M.episodes:null;if(!f||f.length===0){const w=await qi(`/episode/by/season/${M.id}/${Pi}/`);Array.isArray(w)?f=w:w&&Array.isArray(w.episodes)&&(f=w.episodes)}if(!(!Array.isArray(f)||f.length===0))for(const w of f){const se=(w.title||w.name||"").toLowerCase().match(/(\d+)/)||[];if((se[1]?parseInt(se[1],10):parseInt(w.number||w.episode_number||w.num||"0",10)||1)!==p)continue;let P=Array.isArray(w.sources)?w.sources:Array.isArray(w.videos)?w.videos:Array.isArray(w.streams)?w.streams:[];if(P.length===0&&w.id){const Q=await qi(`/source/by/episode/${w.id}/${Pi}/`);Array.isArray(Q)?P=Q:Q&&Array.isArray(Q.sources)&&(P=Q.sources)}for(const Q of P){const ke=Q.enc_url||Q.encUrl||Q.encrypted_url,ee=Q.url||Q.stream_url||Q.video||Q.link||Q.source;if(!ke&&!ee)continue;const be=ke?await Tr(ke):ee;if(!be||!be.startsWith("http"))continue;const je=`/api/hls_proxy?url=${encodeURIComponent(be)}&ref=https://a.prectv70.lol/`,V=j||(Q.title||Q.name||"").toLowerCase().includes("dublaj")?`🇹🇷 TVR S${d}E${p} (TR Dublaj)`:`⚡ TVR S${d}E${p} (TR Altyazı)`;y.push({id:`tvr_ep_${x.id}_${w.id||w.number}_${Q.id||be.slice(-8)}`,name:V,displayName:V,badge:"⚡ TVR VIP",source:"TVR VIP",url:je,streamUrl:je,rawStreamUrl:be,quality:"1080p HD",isHls:!0,isDirectVideo:!0,priority:0,getUrl:()=>je})}}}}return y}catch{return[]}}const vl="https://wild-credit-e1ae.cagatayca07.workers.dev";function Ts(i){if(!i)return"";try{const s=i.replace(/\\/g,"").replace(/[^A-Za-z0-9+/=]/g,"");if(typeof Buffer<"u")return Buffer.from(s,"base64").toString("utf-8");if(typeof atob<"u"){const o=atob(s);try{const n=new Uint8Array(o.length);for(let r=0;r<o.length;r++)n[r]=o.charCodeAt(r);return new TextDecoder("utf-8").decode(n)}catch{return o}}return""}catch{return""}}const bi=Ts("Y2l6Z2ltYXgub25saW5l"),ht=`https://${bi}`,Cs="/api/kvip",wl="/api/sibnet";function za(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^\w\s-]/g," ").replace(/\s+/g," ").trim():""}async function Hi(i,s={}){const o=typeof window<"u";if(o&&i.includes(bi)){const n=new URL(i),r=`${Cs}${n.pathname}${n.search}`;try{const c=await fetch(r,{...s,signal:AbortSignal.timeout(s.timeout||8e3)}).catch(()=>null);if(c&&c.ok)return c}catch{}}if(o&&i.includes("sibnet.ru")){const n=new URL(i),r=`${wl}${n.pathname}${n.search}`;try{const c=await fetch(r,{...s,signal:AbortSignal.timeout(s.timeout||8e3)}).catch(()=>null);if(c&&c.ok)return c}catch{}}if(o){const n=`/api/proxy?url=${encodeURIComponent(i)}`;try{const r=await fetch(n,{...s,signal:AbortSignal.timeout(s.timeout||8e3)}).catch(()=>null);if(r&&r.ok)return r}catch{}}try{const n=await fetch(i,{...s,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",...i.includes(bi)?{Referer:`${ht}/`}:{},...i.includes("sibnet.ru")?{Referer:"https://video.sibnet.ru/"}:{},...s.headers||{}},signal:AbortSignal.timeout(s.timeout||8e3)}).catch(()=>null);if(n&&n.ok)return n}catch{}try{const n=`${vl}?url=${encodeURIComponent(i)}`,r=await fetch(n,{...s,signal:AbortSignal.timeout(s.timeout||8e3)}).catch(()=>null);if(r&&r.ok)return r}catch{}return null}async function Vr(i){const s=new Set,o=[];for(const n of i)if(!(!n||n.length<2))try{const r=`${ht}/api/search/suggest/?q=${encodeURIComponent(n.trim())}`,c=await Hi(r,{headers:{Accept:"application/json"},timeout:6e3});if(!c)continue;const u=await c.json().catch(()=>null);if(!u||!Array.isArray(u.animes))continue;for(const d of u.animes){if(!d||!d.url||s.has(d.id||d.url))continue;const p=d.title||d.name||d.anime_name||"",h=(d.url||"").replace(/^\/diziler\//,"").replace(/^\/filmler\//,"").replace(/^\/film\//,"").replace(/-izle\/?$/,"").replace(/-/g," ");[p,h].filter(Boolean).some(x=>Pe(x,i,.82)||i.some(T=>{const y=za(T),D=za(x);return!y||!D?!1:D===y}))&&(s.add(d.id||d.url),o.push({...d,cleanTitle:p||h}))}if(o.length===0){const d=await Hi(`${ht}/ara/?q=${encodeURIComponent(n.trim())}`,{timeout:6e3});if(d&&d.ok){const h=[...(await d.text()).matchAll(/<a\s+[^>]*href=["'](\/(?:diziler|filmler|film)\/[^"']+)["'][^>]*data-alt-title=["']([^"']*)["']/gi)];for(const v of h){const m=v[1],x=v[2]||"";s.has(m)||!(Pe(x,i,.82)||i.some(y=>za(y)===za(x)))||(s.add(m),o.push({name:x,url:m,cleanTitle:x}))}}}if(o.length>=4)break}catch{}return o}function kl(i,s,o){const n=Number(s),r=Number(o),c=[new RegExp(`href=["']?([^"'>]*?${n}-sezon-${r}-bolum(?:-izle)?\\/?)["'>]`,"i"),new RegExp(`href=["']?([^"'>]*?sezon-${n}[^"'>]*?bolum-${r}(?:-izle)?\\/?)["'>]`,"i"),new RegExp(`href=["']?([^"'>]*?s0?${n}e0?${r}(?:-izle)?\\/?)["'>]`,"i")];n===1&&c.push(new RegExp(`href=["']?([^"'>]*?${r}-bolum(?:-izle)?\\/?)["'>]`,"i"));for(const d of c){const p=i.match(d);if(p&&p[1])return p[1]}const u=[...i.matchAll(/href=["']?([^"'>]*?bolum-izle\/?)["'>]/gi)];for(const d of u){const p=d[1],h=p.match(/(\d+)-sezon/i),v=p.match(/(\d+)-bolum/i),m=h?Number(h[1]):1,x=v?Number(v[1]):null;if(m===n&&x===r)return p}return null}function Yr(i,s){let o=[];const n=i.match(/serversByLang\s*=\s*JSON\.parse\(atob\(["']([^"']+)["']\)\)/);if(n)try{const r=JSON.parse(Ts(n[1]));r&&(s?o=[...r.dub||[],...r.any||[]]:o=[...r.sub||[],...r.any||[]])}catch{}if(o.length===0){const r=i.match(/servers\s*=\s*JSON\.parse\(atob\(["']([^"']+)["']\)\)/);if(r)try{const c=JSON.parse(Ts(r[1]));Array.isArray(c)&&(o=c.filter(u=>{const d=u.label||u.type||"VIP",p=(u.lang||"").toLowerCase(),h=p==="dub"||d.toLowerCase().includes("dublaj"),v=p==="sub"||d.toLowerCase().includes("altyaz");return s?h||!h&&!v:v||!h&&!v}))}catch{}}return o}async function Xr(i,s,o){const n=[],r=s?"TR Dublaj":"Altyazılı",c=s?"dubbed":"subtitled",u=i.label||i.type||"VIP";if(i.type==="sibnet"&&i.videoId){const d=`https://video.sibnet.ru/shell.php?videoid=${encodeURIComponent(i.videoId)}`;return o.has(d)||(o.add(d),n.push({id:`kvip_sib_embed_${i.videoId}_${s?"dub":"sub"}`,name:`Kids VIP - 1080p (${r})`,displayName:`Kids VIP (${r})`,badge:"⚡ Kids VIP",category:c,streamUrl:d,url:d,type:"embed",quality:"1080p",getUrl:()=>d})),n}if(i.src){const d=i.src.startsWith("http")?i.src:`${ht}${i.src}`;if(!(d.includes("cizgimax.online")||d.includes(bi)||d.includes("/oynat/"))){const h=typeof window<"u"&&d.includes(bi)?d.replace(ht,Cs):d;o.has(h)||(o.add(h),n.push({id:`kvip_embed_${i.embedId||Math.random()}_${s?"dub":"sub"}`,name:`Kids VIP - ${u} (${r})`,displayName:`Kids VIP (${r})`,badge:"⚡ Kids VIP",category:c,streamUrl:h,url:h,type:"embed",getUrl:()=>h}))}}if(i.type==="youtube"&&i.ytId){const d=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(i.ytId)}?autoplay=1&rel=0&playsinline=1`;o.has(d)||(o.add(d),n.push({id:`kvip_youtube_${i.ytId}_${s?"dub":"sub"}`,name:`Kids VIP - HD (${r})`,displayName:`Kids VIP (${r})`,badge:"⚡ Kids VIP",category:c,streamUrl:d,url:d,type:"embed",getUrl:()=>d}))}if(i.streamUrl&&!o.has(i.streamUrl)){o.add(i.streamUrl);const d=i.streamUrl.startsWith("http")?i.streamUrl:`${ht}${i.streamUrl}`,p=typeof window<"u"&&d.includes(bi)?d.replace(ht,Cs):d,h=p.includes(".m3u8")||p.includes("hls");n.push({id:`kvip_stream_${i.embedId||Math.random()}_${s?"dub":"sub"}`,name:`Kids VIP - ${u} (${r})`,displayName:`Kids VIP (${r})`,badge:"⚡ Kids VIP",category:c,streamUrl:p,url:p,isDirectVideo:!h,type:h?"hls":"mp4",getUrl:()=>p})}return n}async function vs({titles:i=[],seriesTitle:s="",title:o="",originalTitle:n="",season:r=1,episode:c=1,isDub:u=!0}){const d=[...new Set([s,o,n,...i])].filter(m=>m&&typeof m=="string"&&m.trim().length>1);if(d.length===0)return[];const p=await Vr(d);if(p.length===0)return[];const h=[],v=new Set;for(const m of p.slice(0,3))try{const x=m.url.startsWith("http")?m.url:`${ht}${m.url}`,T=await Hi(x,{timeout:8e3});if(!T)continue;const y=await T.text(),D=kl(y,r,c);if(!D)continue;const M=D.startsWith("http")?D:`${ht}${D}`,_=await Hi(M,{timeout:8e3});if(!_)continue;const U=await _.text(),E=Yr(U,u);if(!Array.isArray(E)||E.length===0)continue;for(const j of E){const f=await Xr(j,u,v);h.push(...f)}if(h.length>0)break}catch{}return h}async function Da({titles:i=[],title:s="",originalTitle:o="",isDub:n=!0}){const r=[...new Set([s,o,...i])].filter(p=>p&&typeof p=="string"&&p.trim().length>1);if(r.length===0)return[];const c=await Vr(r);if(c.length===0)return[];const u=[],d=new Set;for(const p of c.slice(0,3))try{const h=p.url.startsWith("http")?p.url:`${ht}${p.url}`,v=await Hi(h,{timeout:8e3});if(!v)continue;const m=await v.text(),x=Yr(m,n);if(!Array.isArray(x)||x.length===0)continue;for(const T of x){const y=await Xr(T,n,d);u.push(...y)}if(u.length>0)break}catch{}return u}function Sl({type:i="movie",tmdbId:s,season:o=1,episode:n=1}={}){if(!s)return[];const r=i==="movie",c=parseInt(o,10)||1,u=parseInt(n,10)||1,d=r?`https://vidsrc.me/embed/movie?tmdb=${s}`:`https://vidsrc.me/embed/tv?tmdb=${s}&season=${c}&episode=${u}`,p=r?`https://player.smashystream.com/movie/${s}`:`https://player.smashystream.com/tv/${s}?s=${c}&e=${u}`;return[{id:`vidsrc_me_${s}_s${c}e${u}`,name:r?"VidSrc 1080p (Multi-Sub)":`VidSrc S${c}B${u}`,displayName:"VidSrc (1080p HD)",badge:"🎬 VidSrc 1080p",source:"VidSrc",url:d,streamUrl:d,quality:"1080p HD",isHls:!1,isDirectVideo:!1,category:"subtitled",type:"embed",getUrl:()=>d},{id:`smashystream_${s}_s${c}e${u}`,name:r?"SmashyStream VIP (1080p)":`SmashyStream S${c}B${u}`,displayName:"SmashyStream (1080p)",badge:"⚡ SmashyStream",source:"SmashyStream",url:p,streamUrl:p,quality:"1080p HD",isHls:!1,isDirectVideo:!1,category:"subtitled",type:"embed",getUrl:()=>p}]}async function $l({type:i="movie",tmdbId:s=null,season:o=1,episode:n=1}={}){if(!s)return[];const r=i==="movie",c=parseInt(o,10)||1,u=parseInt(n,10)||1,d=r?`https://player.videasy.to/movie/${s}`:`https://player.videasy.to/tv/${s}/${c}/${u}`,h=[{label:"OpenSubtitles (Türkçe)",src:r?`/api/subtitles?tmdbId=${s||""}&title=${encodeURIComponent(title||"")}&type=movie`:`/api/subtitles?tmdbId=${s||""}&title=${encodeURIComponent(title||"")}&season=${c}&episode=${u}&type=tv`}];return[{id:`torrent_p2p_videasy_${s}_s${c}e${u}`,name:r?"VIP Torrent Akış (1080p)":`VIP Torrent Akış S${c}B${u}`,displayName:"VIP Torrent Akış (1080p)",badge:"⚡ VIP Akış 1080p",source:"VIP Torrent",url:d,streamUrl:d,quality:"1080p HD",isHls:!1,isDirectVideo:!1,category:"subtitled",type:"embed",subtitles:h,getUrl:()=>d}]}const Yt="https://lookmovie2.la";function Cr(i){return i?i.replace(/\s*-\s*S\d+E\d+.*$/i,"").replace(/\s*-\s*S\d+.*$/i,"").replace(/\s*\(\d{4}\).*/,"").trim():""}async function xl(i,s){if(!s)return null;const o=i==="tv"?`${Yt}/api/v1/shows/do-search/?q=${encodeURIComponent(s)}`:`${Yt}/api/v1/movies/do-search/?q=${encodeURIComponent(s)}`;try{const r=typeof window<"u"?`/api/proxy?url=${encodeURIComponent(o)}&ref=${encodeURIComponent("https://lookmovie2.la/")}`:o,c=await fetch(r,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Referer:"https://lookmovie2.la/"},signal:AbortSignal.timeout(5e3)});if(!c.ok)return null;const u=await c.json().catch(()=>null);return!u||!Array.isArray(u.result)||u.result.length===0?null:u.result[0]}catch{return null}}async function Al({type:i="movie",title:s="",originalTitle:o="",season:n=1,episode:r=1}={}){const c=i==="movie",u=parseInt(n,10)||1,d=parseInt(r,10)||1;let p=null;const h=[Cr(s),Cr(o)].filter(Boolean);for(const v of h)if(p=await xl(i,v),p&&p.slug)break;if(!p||!p.slug)return[];try{const v=typeof window<"u",m=c?`${Yt}/movies/play/${p.slug}`:`${Yt}/shows/play/${p.slug}`,x=v?`/api/proxy?url=${encodeURIComponent(m)}&ref=${encodeURIComponent("https://lookmovie2.la/")}`:m,T=await fetch(x,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",Referer:"https://lookmovie2.la/"},signal:AbortSignal.timeout(5500)});if(!T.ok)return[];const y=await T.text();let D=null;if(c){const ne=y.match(/id_movie:\s*(\d+)/),P=y.match(/hash:\s*["']([^"']+)["']/),Q=y.match(/expires:\s*(\d+)/);if(!ne||!P||!Q)return[];D=`${Yt}/api/v1/security/movie-access?id_movie=${ne[1]}&hash=${P[1]}&expires=${Q[1]}`}else{const ne=y.match(/hash:\s*["']([^"']+)["']/),P=y.match(/expires:\s*(\d+)/);if(!ne||!P)return[];let Q=null;const ke=y.split("{");for(const ee of ke)if((ee.includes(`episode: '${d}'`)||ee.includes(`episode: "${d}"`))&&(ee.includes(`season: '${u}'`)||ee.includes(`season: "${u}"`))){const be=ee.match(/id_episode:\s*(\d+)/);if(be){Q=be[1];break}}if(!Q){const ee=new RegExp(`episode:\\s*["']?${d}["']?[\\s\\S]*?id_episode:\\s*(\\d+)[\\s\\S]*?season:\\s*["']?${u}["']?`,"i"),be=y.match(ee);be&&(Q=be[1])}if(!Q)return[];D=`${Yt}/api/v1/security/episode-access?id_episode=${Q}&hash=${ne[1]}&expires=${P[1]}`}const M=v?`/api/proxy?url=${encodeURIComponent(D)}&ref=${encodeURIComponent(m)}`:D,_=await fetch(M,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",Referer:m},signal:AbortSignal.timeout(5500)});if(!_.ok)return[];const U=await _.json().catch(()=>null);if(!U||!U.streams)return[];const E=U.streams||{},j=Object.entries(E).filter(([ne,P])=>typeof P=="string"&&P.startsWith("http")&&P.includes(".m3u8")).map(([ne,P])=>({quality:ne,url:P})),f=["1080p","1080","720p","720","480p","480","auto"];j.sort((ne,P)=>{const Q=f.indexOf(ne.quality),ke=f.indexOf(P.quality);return(Q===-1?99:Q)-(ke===-1?99:ke)});const w=j.length>0?j[0].url:Object.values(E).find(ne=>typeof ne=="string"&&ne.includes(".m3u8"))||null;if(!w)return[];const ae=w,se=[];return Array.isArray(U.subtitles)&&U.subtitles.forEach(ne=>{if(!ne||!ne.file)return;const P=(ne.language||"").toLowerCase(),Q=P.includes("turk")||typeof ne.file=="string"&&ne.file.includes("tr_"),ke=P.includes("eng")||typeof ne.file=="string"&&ne.file.includes("en_");if(Q||ke){let ee="";typeof ne.file=="string"&&(ee=ne.file.startsWith("http")?ne.file:`${Yt}${ne.file}`),ee&&se.push({label:Q?"Türkçe (LookMovie)":"English (LookMovie)",src:`/api/proxy?url=${encodeURIComponent(ee)}&ref=${encodeURIComponent("https://lookmovie2.la/")}`})}}),[{id:`lookmovie_direct_${p.id_show||p.id_movie||p.slug}_s${u}e${d}`,name:c?"LookMovie HLS (1080p TR Altyazı)":`LookMovie HLS S${u}B${d} (TR Altyazı)`,displayName:"LookMovie HLS (1080p)",badge:"🎬 LookMovie Direct",source:"LookMovie",url:ae,streamUrl:ae,quality:"1080p HD",isHls:!0,isDirectVideo:!0,category:"subtitled",subtitles:se,getUrl:()=>ae}]}catch{return[]}}async function zl({type:i="movie",tmdbId:s=null,imdbId:o=null,title:n="",originalTitle:r="",season:c=1,episode:u=1}={}){const d=n||r;if(!d)return[];const p=parseInt(c,10)||1,h=parseInt(u,10)||1,v=i==="movie";try{const m=Ir(d),x=Ir(r),T=Ze(`/api/hdfc_stream?query=${encodeURIComponent(m)}&originalTitle=${encodeURIComponent(x)}&tmdbId=${s||""}&imdbId=${o||""}&season=${p}&episode=${h}&type=${i||(v?"movie":"tv")}`),y=await fetch(T,{signal:AbortSignal.timeout(22e3)}).catch(()=>null);if(!y||!y.ok)return[];const D=await y.json().catch(()=>null);if(!D||!D.success||!D.streamUrl)return[];const M=[],_=[];if(Array.isArray(D.subtitles))for(const E of D.subtitles)E.src&&_.push({label:E.label||"Türkçe (HDFC)",src:E.src});if(!_.some(E=>(E.label||"").toLowerCase().includes("türk")||(E.label||"").toLowerCase().includes("tr"))&&(o||s||n)){const E=encodeURIComponent(n||r||""),j=v?`/api/subtitles?tmdbId=${s||""}&imdbId=${o||""}&title=${E}&type=movie`:`/api/subtitles?tmdbId=${s||""}&imdbId=${o||""}&title=${E}&season=${p}&episode=${h}&type=tv`;_.unshift({label:"OpenSubtitles (Türkçe)",src:j})}return M.push({id:`hdfc_${s||"q"}_${v?"movie":`s${p}e${h}`}`,name:v?"HDFilmCehennemi VIP (1080p HLS)":`HDFilmCehennemi S${p}B${h}`,displayName:"HDFilmCehennemi (1080p)",badge:"🔥 HDFC 1080p HLS",source:"HDFilmCehennemi",url:Ze(D.streamUrl),streamUrl:Ze(D.streamUrl),rawStreamUrl:D.rawStreamUrl,movieUrl:D.movieUrl,quality:"1080p HD",isHls:!0,isDirectVideo:!0,category:"subtitled",type:"direct",subtitles:_,getUrl:()=>Ze(D.streamUrl)}),M}catch{return[]}}function Ir(i){return i?i.replace(/\s*-\s*S\d+E\d+.*$/i,"").replace(/\s*-\s*S\d+.*$/i,"").replace(/\s*-\s*\d+\.\s*Sezon.*$/i,"").replace(/\s*\(\d{4}\).*/,"").trim():""}const dt="https://jetfilmizle.now",Dl="https://wild-credit-e1ae.cagatayca07.workers.dev";function Ea(i){return i?i.toLowerCase().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9]/g,""):""}function Tl(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-"):""}async function hi(i,s={}){const o=typeof window<"u";if(!s.method||s.method==="GET")try{const n=`${Dl}?url=${encodeURIComponent(i)}`,r=await fetch(n,{...s,signal:AbortSignal.timeout(s.timeout||4500)}).catch(()=>null);if(r&&r.ok)return r}catch{}if(o)try{const n=new URL(i),r=`/api/jet${n.pathname}${n.search}`,c=await fetch(r,{...s,headers:{"X-Requested-With":"XMLHttpRequest",...s.headers||{}},signal:AbortSignal.timeout(s.timeout||4500)}).catch(()=>null);if(c&&c.ok)return c}catch{}try{const n=await fetch(i,{...s,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36","X-Requested-With":"XMLHttpRequest",Referer:dt,Origin:dt,...s.headers||{}},signal:AbortSignal.timeout(s.timeout||4500)}).catch(()=>null);if(n&&n.ok)return n}catch{}return null}async function Gr(i,s=!1){if(!i||typeof i!="string"||i.trim().length<2)return[];const o=i.trim(),n=s?`${dt}/diziler?q=${encodeURIComponent(o)}`:`${dt}/arama?q=${encodeURIComponent(o)}`;try{const r=await hi(n,{headers:{Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"},timeout:4500});if(!r)return[];const c=await r.text(),u=[],d=s?/<a[^>]+href=["'](https:\/\/jetfilmizle\.now\/dizi\/[^"']+)["'][^>]*title=["']([^"']+)["']/gi:/<a[^>]+href=["'](https:\/\/jetfilmizle\.now\/(?:film|dizi)\/[^"']+)["'][^>]*title=["']([^"']+)["']/gi;let p;for(;(p=d.exec(c))!==null;){const h=p[1],v=p[2],m=h.split("/").filter(Boolean).pop(),x=v.replace(/Full.*İzle/i,"").replace(/Türkçe Dublaj.*/i,"").replace(/Altyazılı.*/i,"").replace(/HD.*/i,"").replace(/Dizisi.*/i,"").trim();u.some(T=>T.url===h)||u.push({title:x,url:h,slug:m,isSeries:s||h.includes("/dizi/")})}return u}catch{return[]}}async function ws({titles:i=[],title:s="",originalTitle:o="",year:n=null,isDub:r=!0}){const c=[...new Set([...i,s,o])].filter(d=>d&&typeof d=="string"&&d.trim().length>1);if(c.length===0)return[];let u=null;for(const d of c){const h=(await Gr(d,!1)).filter(v=>!v.isSeries);if(h.length>0){const v=Ea(d),m=h.find(x=>{const T=Ea(x.title);return T===v||T.includes(v)||v.includes(T)})||h[0];if(m){u=m.url;break}}}if(!u)return[];try{const d=await hi(u,{headers:{Referer:dt},timeout:4500});if(!d)return[];const p=await d.text(),h=p.match(/name=["']film_id["'][^>]*value=["'](\d+)["']/i)||p.match(/value=["'](\d+)["'][^>]*name=["']film_id["']/i);if(!h)return[];const v=h[1],m=`${dt}/jetplayer`,x=r?"dublaj":"altyazili",T=[],y=[];for(let M=0;M<4;M++)y.push(hi(m,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest",Referer:u,Origin:dt},body:`film_id=${v}&source_index=${M}&player_type=${x}`,timeout:4e3}).then(async _=>{if(!_)return null;const E=(await _.text()).match(/<iframe[^>]+src=['"]([^'"]+)['"]/i);if(!E)return null;let j=E[1];if(j.startsWith("//")&&(j="https:"+j),j.includes("youtube")||j.includes("youtu.be")||j.includes("trailer"))return null;const f=j.includes("vidmoly"),w=j.includes("ok.ru"),ae=j.includes("titan"),se=f?"Jet VidMoly 1080p":w?"Jet OK.ru HD":ae?`Jet Titan VIP ${M+1}`:`Jet VIP ${M+1}`;return{id:`jet_${v}_${M}`,name:se,displayName:se,source:"Jet",url:j,quality:"1080p",type:"iframe",isDub:r}}).catch(()=>null));const D=await Promise.all(y);for(const M of D)M&&M.url&&!T.some(_=>_.url===M.url)&&T.push(M);return T}catch{return[]}}async function ks({titles:i=[],seriesTitle:s="",season:o=1,episode:n=1,isDub:r=!0}){const c=[...new Set([...i,s])].filter(d=>d&&typeof d=="string"&&d.trim().length>1);if(c.length===0)return[];let u=null;for(const d of c){const p=Tl(d),h=[p,`${p}-2025`,`${p}-2024`,`${p}-dizisi`];for(const v of h)try{const m=`${dt}/dizi/${v}`;if(await hi(m,{method:"HEAD",timeout:2e3})){u=m;break}}catch{}if(u)break}if(!u)for(const d of c){const h=(await Gr(d,!0)).filter(v=>v.isSeries);if(h.length>0){const v=Ea(d),m=h.find(x=>{const T=Ea(x.title);return T===v||T.includes(v)||T.includes(T)})||h[0];if(m){u=m.url;break}}}if(!u)return[];try{const d=await hi(u,{headers:{Referer:dt},timeout:4500});if(!d)return[];const p=await d.text(),h=p.match(/name=["']film_id["'][^>]*value=["'](\d+)["']/i)||p.match(/value=["'](\d+)["'][^>]*name=["']film_id["']/i);if(!h)return[];const v=h[1],m=`${dt}/jetplayer`,x=r?"dublaj":"altyazili",T=p.match(new RegExp(`data-source-index=["'](\\d+)["'][^>]*data-season=["']${o}["'][^>]*data-episode=["']${n}["']`,"i"))||p.match(new RegExp(`data-season=["']${o}["'][^>]*data-episode=["']${n}["'][^>]*data-source-index=["'](\\d+)["']`,"i")),y=T?T[1]:n-1,D=await hi(m,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest",Referer:u,Origin:dt},body:`film_id=${v}&source_index=${y}&player_type=${x}`,timeout:4500});if(!D)return[];const _=(await D.text()).match(/<iframe[^>]+src=['"]([^'"]+)['"]/i);if(!_)return[];let U=_[1];if(U.startsWith("//")&&(U="https:"+U),U.includes("youtube")||U.includes("youtu.be")||U.includes("trailer"))return[];const E=U.includes("vidmoly"),j=U.includes("ok.ru"),f=U.includes("titan"),w=E?`Jet VidMoly (S${o}B${n})`:j?`Jet OK.ru (S${o}B${n})`:f?`Jet Titan VIP (S${o}B${n})`:`Jet VIP (S${o}B${n})`;return[{id:`jet_series_${v}_s${o}_e${n}`,name:w,displayName:w,source:"Jet",url:U,quality:"1080p",type:"iframe",isDub:r}]}catch{return[]}}const Cl="https://wild-credit-e1ae.cagatayca07.workers.dev",Il="hlxjl1c2w281ax473rt1ofgrvhyjvi",Bl="035f01015659595301060601525f39060c094e03515b442d13590e1a1c405b085b55031c5c5b475d57035c5c54415a001b04071f4446",_l="15632429",Ll="38534241025665";function Br(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^\w\s-]/g," ").replace(/\s+/g," ").trim():""}function El(){try{const i=new Date().toLocaleString("en-US",{timeZone:"Europe/Istanbul",weekday:"long"}).toLowerCase(),s=`${Il}_${i}`,o=Array.from({length:6},()=>(Math.random()+1).toString(36)[2]).join(""),n=JSON.stringify({[o]:Date.now()}),r=new TextEncoder,c=r.encode(n),u=r.encode(s),d=new Uint8Array(c.length);for(let p=0;p<c.length;p++)d[p]=c[p]^u[p%u.length];return Array.from(d).map(p=>p.toString(16).padStart(2,"0")).join("")}catch{return""}}function Rl(){return{"Cf-Control":El(),device:"browser",language:"tr",site:"main","user-session":Bl,"user-profile":_l,user:Ll,Origin:"https://anizium.co",Referer:"https://anizium.co/"}}async function _r(i,s=4500){const o=typeof window<"u",n=Rl();try{const r=await fetch(i,{headers:n,signal:AbortSignal.timeout(s)});if(r&&r.ok){const c=await r.json().catch(()=>null);if(c)return c}}catch{}if(o)try{const r=`${Cl}?url=${encodeURIComponent(i)}`,c=await fetch(r,{headers:n,signal:AbortSignal.timeout(s)});if(c&&c.ok)return await c.json().catch(()=>null)}catch{}return null}async function Lr({titles:i=[],seriesTitle:s="",title:o="",originalTitle:n="",type:r="tv",season:c=1,episode:u=1,isDub:d=!1}={}){const p=[...new Set([n,s,o,...i])].filter(y=>y&&typeof y=="string"&&y.trim().length>1);if(p.length===0)return[];const h=parseInt(c,10)||1,v=parseInt(u,10)||1,m=r==="movie",x=[],T=new Set;for(const y of p)try{const D=Br(y);if(!D||D.length<2)continue;const M=`https://api.anizium.co/page/search?value=${encodeURIComponent(D)}`,_=await _r(M,3800),U=_?.page?.data||_?.data||[];if(!Array.isArray(U)||U.length===0)continue;for(const E of U.slice(0,3)){if(!E||!E.ID)continue;const j=Br(E.name||E.name_tr||E.name_short||"");if(!Pe(j,p))continue;const f=m?`https://api.anizium.co/anime/source?id=${E.ID}&site=main&plan=free&server=1`:`https://api.anizium.co/anime/source?id=${E.ID}&site=main&plan=free&season=${h}&episode=${v}&server=1`,w=await _r(f,4200);if(!w||!w.success||!Array.isArray(w.groups)||w.groups.length===0)continue;const ae=[];if(Array.isArray(w.subtitles))for(const P of w.subtitles)P&&P.link&&ae.push({label:P.name||(P.group==="tr"?"Türkçe":"İngilizce"),src:P.link});let se=null;if(d?se=w.groups.find(P=>P.group==="trdub"||(P.name||"").toLowerCase().includes("türk")):(se=w.groups.find(P=>P.group==="original"||P.group==="trsub"||(P.name||"").toLowerCase().includes("japon")),se||(se=w.groups.find(P=>P.group!=="trdub"))),!se||!Array.isArray(se.items)||se.items.length===0)continue;const ne=[...se.items].sort((P,Q)=>(Q.quality||0)-(P.quality||0));for(const P of ne){if(!P||!P.link||T.has(P.link)||P.quality<720&&ne.some(be=>be.quality>=720))continue;T.add(P.link);const Q=P.quality>=2160?"4K":P.quality?`${P.quality}p`:"1080p",ke=P.quality>=2160,ee=m?`AZ ${Q}`:`AZ ${Q} (S${h}B${v})`;x.push({id:`az_${E.ID}_${m?"mov":`s${h}e${v}`}_${P.quality||"1080"}_${d?"dub":"sub"}`,name:`${ee} ${d?"TR Dublaj":"TR Altyazı"}`,displayName:`${ee} ${d?"TR Dublaj":"TR Altyazı"}`,badge:ke?`⚡ AZ 4K UHD ${d?"Dublaj":"Altyazı"}`:`⚡ AZ 1080p ${d?"Dublaj":"Altyazı"}`,source:"AZ",url:P.link,streamUrl:P.link,quality:ke?"4K UHD":P.quality?`${P.quality}p`:"1080p",isHls:!1,isDirectVideo:!0,type:"direct",category:d?"dubbed":"subtitled",subtitles:d?[]:ae,isDub:d,getUrl:()=>P.link})}if(x.length>0)break}if(x.length>0)break}catch{}return x}const Ss="v39",Ml="4e44d9029b1270a757cddc766a1bcb63",mi=new Map;function ji(i){return i?i.replace(/\s*-\s*S\d+E\d+.*$/i,"").replace(/\s*-\s*S\d+.*$/i,"").replace(/\s*-\s*\d+\.\s*Sezon.*$/i,"").replace(/\s*\(\d{4}\).*/,"").trim():""}function Zr(i,s){const o=new Set;i&&(o.add(i),o.add(ji(i))),s&&(o.add(s),o.add(ji(s)));const n=new Set(o);for(const r of o){if(!r)continue;const c=r.replace(/\bpart\s+two\b/i,"Part 2").replace(/\bpart\s+three\b/i,"Part 3").replace(/\bpart\s+four\b/i,"Part 4").replace(/\bpart\s+one\b/i,"Part 1").replace(/\bbolum\s+iki\b/i,"Bölüm 2").replace(/\bbolum\s+uc\b/i,"Bölüm 3").replace(/\bpart\s+ii\b/i,"Part 2").replace(/\bpart\s+iii\b/i,"Part 3");n.add(c);const u=r.replace(/\bPart\s+\d+\b/gi,"").replace(/\bBölüm\s+\d+\b/gi,"").replace(/\b(II|III|IV|V|VI)\b/g,"").trim();u&&u.length>2&&n.add(u)}return Array.from(n).filter(Boolean)}async function Ul(i,s,o,n){const r=Zr(o,n);let c=null,u=!1;if(!s)return{candidateTitles:r,detectedYear:c,isAnimation:u};try{const h=await fetch(`https://api.themoviedb.org/3/${i==="movie"?"movie":"tv"}/${s}?api_key=${Ml}&language=tr-TR`,{signal:AbortSignal.timeout(3500)});if(h.ok){const v=await h.json(),m=v.title||v.name,x=v.original_title||v.original_name,T=v.release_date||v.first_air_date;T&&(c=new Date(T).getFullYear()),Array.isArray(v.genres)&&v.genres.some(y=>y.id===16||(y.name||"").toLowerCase().includes("animasyon"))&&(u=!0),m&&r.push(m,ji(m)),x&&r.push(x,ji(x))}}catch{}return{candidateTitles:Array.from(new Set(r.map(p=>(p||"").trim()).filter(Boolean))),detectedYear:c,isAnimation:u}}function Pl(i,s=""){const o=(i.url||i.streamUrl||(typeof i.getUrl=="function"?i.getUrl():"")||"").toLowerCase(),n=(i.displayName||i.name||"").toLowerCase(),r=(i.id||"").toLowerCase();if(r.startsWith("hdfc_")||n.includes("hdfilmcehennemi")||n.includes("hdfc"))return s==="dubbed"||n.includes("dub")?"HDFilmCehennemi Dublaj 1080p":"HDFilmCehennemi Altyazı 1080p";if(r.startsWith("dzb_")||r.startsWith("dzp_")||n.includes("dizibal")||n.includes("dizipal")||n.includes("dp"))return n.includes("player")?s==="dubbed"?"DP DiziBal Player (TR Dublaj)":"DP DiziBal Player (TR Altyazı)":s==="dubbed"||n.includes("dub")?"DP 1080p (TR Dublaj)":s==="subtitled"||n.includes("alt")||n.includes("sub")?"DP 1080p (TR Altyazı)":"DP 1080p";if(r.startsWith("dzs_")||n.includes("dizisol")){let c=(i.displayName||i.name||"DS 1080p (HLS)").replace(/dizisol/gi,"DS").trim();return c.startsWith("DS")||(c=`DS ${c}`),c}return r.startsWith("snx")||n.includes("sinewix")||n.includes("swx")?n.includes("mkv")?"SWX 1080p (MKV)":"SWX 1080p Direct":r.startsWith("tvr_")||r.startsWith("rectv_")||n.includes("rectv")||n.includes("tvr")?i.displayName||i.name||"  TVR VIP 1080p":r.startsWith("lookmovie_")||n.includes("lookmovie")?i.displayName||i.name||"  LookMovie VIP 1080p":r.startsWith("twoembed_")||n.includes("2embed")?i.displayName||i.name||"  2Embed VIP 1080p":r.startsWith("vidsrc_pm")||n.includes("vidsrc alt")?i.displayName||i.name||"  VidSrc Alt 1080p":r.startsWith("vidsrc_")||n.includes("vidsrc")?i.displayName||i.name||"  VidSrc VIP 1080p":r.startsWith("dzy_")||n.includes("diziyo")?o.includes("vidmoly")?"Diziyo VidMoly 1080p":i.displayName||i.name||"Diziyo 1080p":r.startsWith("dyu_")||n.includes("diziyou")?i.displayName||i.name||"Diziyou 1080p":r.startsWith("hdfb_")||n.includes("hdfilmizle")?i.displayName||i.name||"HDF 1080p":r.startsWith("kvip_")||n.includes("kids vip")?i.displayName||i.name||"  Kids VIP Direct 1080p":r.startsWith("az_")||r.startsWith("anizium_")||n.includes("anizium")||n.includes("az ")?i.displayName||i.name||"AZ 4K/1080p VIP":r.startsWith("acx_")||n.includes("animecix")?i.displayName||i.name||"AX Tau Direct 1080p":r.startsWith("szd_")?o.includes("vidmoly")?"SZ VidMoly 1080p":o.includes("sibnet")?"SZ Sibnet HD":i.displayName||i.name||"SZ 1080p":i.displayName||i.name||"VIP 1080p"}function ql(i,s,o){const n=i.streamUrl||i.url||(typeof i.getUrl=="function"?i.getUrl():"")||"",r=Pl(i,s)||o;let c=i.badge||(s==="dubbed"?"  TR Dublaj":"  TR Altyazı");const u=r.toLowerCase();return u.includes("hdfc")||u.includes("hdfilmcehennemi")?c=s==="dubbed"?"  HDFC Dublaj 1080p":"  HDFC Altyazı 1080p":u.includes("dzb")||u.includes("dizibal")||u.includes("dp")?c=s==="dubbed"?"  DP Dublaj":"  DP Altyazı":u.includes("ds")?c=s==="dubbed"?"  DS Dublaj":"  DS Altyazı":u.includes("az ")||u.includes("az 4k")||u.includes("az 1080p")||u.includes("anizium")?c=i.badge||(s==="dubbed"?"  AZ 4K Dublaj":"  AZ 4K Altyazı"):u.includes("swx")?c="  SWX 1080p":u.includes("tvr")?c="  TVR 1080p":u.includes("lookmovie")?c="  LookMovie 1080p":u.includes("2embed")?c="  2Embed 1080p":u.includes("vidsrc")&&(c="  VidSrc 1080p"),{...i,id:i.id||`stream_${Math.random().toString(36).slice(2,9)}`,name:r,displayName:r,streamUrl:n,url:n,badge:c,category:s,isHls:!!(i.isHls||n.includes(".m3u8")),isDirectVideo:!!(i.isDirectVideo||i.isHls||n.includes(".m3u8")||n.includes(".mp4")||n.includes(".mkv")),getUrl:()=>n}}function Nl(i){const s=(i.url||i.streamUrl||(typeof i.getUrl=="function"?i.getUrl():"")||"").toLowerCase();if(!s||s.length<8)return!1;const o=(i.id||"").toLowerCase(),n=(i.displayName||i.name||"").toLowerCase();if(o.startsWith("torrent_p2p_"))return!0;if(i.isTorrent&&!o.startsWith("torrent_p2p_")||o.includes("yts")||n.includes("yts")||s.includes("yts.mx")||s.includes("pichive")||s.includes("hotlinger")||s.includes("diziyo.so")&&!s.includes(".m3u8"))return!1;const r=["recaptcha","media.cm","cloudvideo.tv","vidoza.net","voe.sx","bysejikuar","filemoon","hdfilmdelisi","play.liderfilm"];for(const c of r)if(s.includes(c))return!1;return!0}function Et(i){(i.url||i.streamUrl||(typeof i.getUrl=="function"?i.getUrl():"")||"").toLowerCase();const s=(i.displayName||i.name||"").toLowerCase(),o=(i.id||"").toLowerCase();return o.startsWith("hdfc_")||s.includes("hdfilmcehennemi")||s.includes("hdfc")?0:o.startsWith("dzb_")||o.startsWith("dzp_")||s.includes("dp 1080p")||s.includes("dp ")||s.includes("dizibal")?1:o.startsWith("dzs_")||s.includes("dizisol")||s.includes("ds 1080p")||s.includes("ds ")?2:o.startsWith("snx")||s.includes("sinewix")||s.includes("swx")?i.isMkv||s.includes("mkv")?9:3:o.startsWith("tvr_")||s.includes("tvr")||s.includes("rectv")||o.startsWith("ddz_")||s.includes("dramadizilerim")||s.includes("ddz vip")?4:o.startsWith("lookmovie_")||s.includes("lookmovie")?5:o.startsWith("dzy_")||s.includes("diziyo")?6:o.startsWith("dyu_")||s.includes("diziyou")?7:o.startsWith("szd_")||s.includes("sezonluk")?8:o.startsWith("hdfb_")||s.includes("hdfilmizle")||s.includes("hdf ")?9:o.startsWith("torrent_p2p_")?10:o.startsWith("vidsrc_")||s.includes("vidsrc")?11:o.startsWith("twoembed_")||s.includes("2embed")?12:o.startsWith("smashystream_")||s.includes("smashy")?13:o.startsWith("az_")||o.startsWith("anizium_")||s.includes("anizium")||s.includes("az ")?2:o.startsWith("kvip_")||s.includes("kids vip")?14:o.startsWith("acx_")||s.includes("animecix")?15:o.startsWith("atr_")||s.includes("animetr")?17:20}async function Hl({type:i="movie",tmdbId:s=null,imdbId:o=null,title:n="",originalTitle:r="",seriesTitle:c="",year:u=null,season:d=1,episode:p=1,onUpdate:h=()=>{}}){const v=i==="movie",m=ji(c||n),x=`${i}_${s||m}_s${d}_e${p}`,T=A=>Array.isArray(A)?A.map(V=>{if(!V)return V;const Ce=V.streamUrl||V.url||"";return{...V,streamUrl:Ce,url:Ce,getUrl:()=>Ce}}):[];if(!mi.has(x))try{const A=sessionStorage.getItem(`cp_streams_${Ss}_${x}`);if(A){const V=JSON.parse(A);if(V&&(V.dubbed?.length||V.subtitled?.length)){const Ce={...V,dubbed:T(V.dubbed),subtitled:T(V.subtitled)};mi.set(x,Ce)}}}catch{}if(mi.has(x)){const A=mi.get(x),V={...A,dubbed:T(A.dubbed),subtitled:T(A.subtitled)};h({...V,isComplete:!1}),mi.delete(x);try{sessionStorage.removeItem(`cp_streams_${Ss}_${x}`)}catch{}}let y=Zr(m,r),D=u;const M=s?Ul(i,s,m,r).catch(()=>null):Promise.resolve(null);let _=[],U=[];const E=new Set,j=new Set,f=(A,V)=>{if(!Array.isArray(A)||A.length===0)return[];const Ce=A.filter(Nl),he=[];for(const W of Ce){const qe=ql(W,V,V==="dubbed"?"VIP 1080p":"VIP Altyazılı"),Wi=(qe.streamUrl||qe.url||"").trim().toLowerCase(),ut=`${(qe.id||"").toLowerCase().split("_").slice(0,2).join("_")}||${Wi}`;V==="dubbed"?E.has(ut)||(E.add(ut),_.push(qe),_.sort((Dt,_e)=>Et(Dt)-Et(_e)),he.push(qe)):j.has(ut)||(j.add(ut),U.push(qe),U.sort((Dt,_e)=>Et(Dt)-Et(_e)),he.push(qe))}const q=[...U,..._].find(W=>Array.isArray(W.subtitles)&&W.subtitles.length>0)?.subtitles;if(q&&q.length>0){for(const W of U)(!Array.isArray(W.subtitles)||W.subtitles.length===0)&&(W.subtitles=q);for(const W of _)(!Array.isArray(W.subtitles)||W.subtitles.length===0)&&(W.subtitles=q)}return he.length>0&&h({dubbed:[..._],subtitled:[...U],totalServers:_.length+U.length,isComplete:!1,newStream:he[0],isDubbedStream:V==="dubbed"}),he},w=i==="anime",ae=[gl({type:i,title:m,originalTitle:r,season:d,episode:p,year:D}).then(A=>{if(!Array.isArray(A)||A.length===0)return[];const V=A.filter(he=>{const q=`${he.name||""} ${he.badge||""}`.toLowerCase();return q.includes("dublaj")||q.includes("tr dub")}),Ce=A.filter(he=>{const q=`${he.name||""} ${he.badge||""}`.toLowerCase();return!q.includes("dublaj")&&!q.includes("tr dub")});V.length>0&&f(V,"dubbed"),Ce.length>0&&f(Ce,"subtitled"),V.length===0&&Ce.length===0&&A.length>0&&f(A,"subtitled")}).catch(()=>[]),Ho({type:i,titles:y,title:m,seriesTitle:m,originalTitle:r,year:D,season:d,episode:p,imdbId:o,isDub:null}).then(A=>{if(!Array.isArray(A)||A.length===0)return;const V=A.filter(he=>he.category==="subtitled"||(he.badge||"").includes("Altyazı")),Ce=A.filter(he=>!V.includes(he));f(Ce,"dubbed"),f(V,"subtitled")}).catch(()=>[]),(v?Sa({titles:y,title:m,originalTitle:r}):ka({titles:y,seriesTitle:m,originalTitle:r,season:d,episode:p})).then(A=>{if(!(!Array.isArray(A)||A.length===0))for(const V of A)f([{...V,id:`${V.id}_dub`,name:v?"DP DiziBal Player (TR Dublaj)":`DP DiziBal Player Dublaj S${d}B${p}`,displayName:v?"DP DiziBal Player (TR Dublaj)":`DP DiziBal Player Dublaj (S${d}B${p})`,badge:"  DiziBal Orijinal Player",category:"dubbed"}],"dubbed"),f([{...V,id:`${V.id}_sub`,name:v?"DP DiziBal Player (TR Altyazı)":`DP DiziBal Player Altyazı S${d}B${p}`,displayName:v?"DP DiziBal Player (TR Altyazı)":`DP DiziBal Player Altyazı (S${d}B${p})`,badge:"  DiziBal Orijinal Player",category:"subtitled"}],"subtitled")}).catch(()=>[]),(v?xr({titles:y,tmdbId:s,title:m,originalTitle:r}):La({titles:y,tmdbId:s,seriesTitle:m,originalTitle:r,season:d,episode:p})).then(A=>{if(!(!Array.isArray(A)||A.length===0))for(const V of A)f([{...V,id:`${V.id}_dub`,name:V.name?V.name.replace(/\(Altyazı\)/i,"(TR Dublaj)"):"DS 1080p (TR Dublaj)",displayName:V.displayName?V.displayName.replace(/\(Altyazı\)/i,"(TR Dublaj)"):"DS 1080p (TR Dublaj)",badge:"  TR Dublaj",category:"dubbed"}],"dubbed"),f([{...V,id:`${V.id}_sub`,name:V.name?V.name.replace(/\(Dublaj\)/i,"(TR Altyazı)"):"DS 1080p (TR Altyazı)",displayName:V.displayName?V.displayName.replace(/\(Dublaj\)/i,"(TR Altyazı)"):"DS 1080p (TR Altyazı)",badge:"  TR Altyazı",category:"subtitled"}],"subtitled")}).catch(()=>[]),v?zr({titles:y,title:m,originalTitle:r,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]):Ar({titles:y,seriesTitle:m,originalTitle:r,season:d,episode:p,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]),v?zr({titles:y,title:m,originalTitle:r,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]):Ar({titles:y,seriesTitle:m,originalTitle:r,season:d,episode:p,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]),il({titles:y,seriesTitle:m,title:m,originalTitle:r,season:d,episode:p,isDub:!1}).then(A=>{Array.isArray(A)&&A.length>0&&(f(A,"subtitled"),f(A.map(V=>({...V,id:`${V.id}_dub`,name:(V.name||"Diziyou").replace(/\s*\(TR Altyazı\)/i,""),category:"dubbed"})),"dubbed"))}).catch(()=>[]),wa({titles:y,seriesTitle:m,originalTitle:r,season:d,episode:p,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]),wa({titles:y,seriesTitle:m,originalTitle:r,season:d,episode:p,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]),v?gs({titles:y,title:m,originalTitle:r,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]):Promise.resolve([]),v?gs({titles:y,title:m,originalTitle:r,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]):Promise.resolve([]),v?ws({titles:y,title:m,originalTitle:r,year:D,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]):ks({titles:y,seriesTitle:m,season:d,episode:p,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]),v?ws({titles:y,title:m,originalTitle:r,year:D,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]):ks({titles:y,seriesTitle:m,season:d,episode:p,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]),v?Da({titles:y,title:m,originalTitle:r,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]):vs({titles:y,seriesTitle:m,title:m,originalTitle:r,season:d,episode:p,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]),v?Da({titles:y,title:m,originalTitle:r,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]):vs({titles:y,seriesTitle:m,title:m,originalTitle:r,season:d,episode:p,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]),Promise.resolve(Sl({type:i,tmdbId:s,season:d,episode:p})).then(A=>f(A,"subtitled")).catch(()=>[]),Al({type:i,title:m,originalTitle:r,season:d,episode:p}).then(A=>f(A,"subtitled")).catch(()=>[]),w?$r({titles:y,seriesTitle:m,title:m,originalTitle:r,season:d,episode:p,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]):Promise.resolve([]),w?$r({titles:y,seriesTitle:m,title:m,originalTitle:r,season:d,episode:p,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]):Promise.resolve([]),w?Ko({titles:y,seriesTitle:m,title:m,originalTitle:r,season:d,episode:p,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]):Promise.resolve([]),Lr({type:i,titles:y,seriesTitle:m,title:m,originalTitle:r,season:d,episode:p,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]),Lr({type:i,titles:y,seriesTitle:m,title:m,originalTitle:r,season:d,episode:p,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]),$l({type:i,tmdbId:s,season:d,episode:p}).then(A=>{Array.isArray(A)&&A.length>0&&f(A,"subtitled")}).catch(()=>[]),zl({type:i,tmdbId:s,imdbId:o,title:m,originalTitle:r,season:d,episode:p}).then(A=>{if(!Array.isArray(A)||A.length===0)return[];for(const V of A)f([{...V,id:`${V.id}_dub`,name:v?"HDFilmCehennemi Dublaj 1080p":`HDFilmCehennemi Dublaj S${d}B${p}`,displayName:v?"HDFilmCehennemi Dublaj (1080p)":`HDFilmCehennemi Dublaj (S${d}B${p})`,badge:"  HDFC Dublaj 1080p",category:"dubbed"}],"dubbed"),f([{...V,id:`${V.id}_sub`,name:v?"HDFilmCehennemi Altyazı 1080p":`HDFilmCehennemi Altyazı S${d}B${p}`,displayName:v?"HDFilmCehennemi Altyazı (1080p)":`HDFilmCehennemi Altyazı (S${d}B${p})`,badge:"  HDFC Altyazı 1080p",category:"subtitled"}],"subtitled")}).catch(A=>[]),v?Promise.resolve([]):mr({titles:y,seriesTitle:m,season:d,episode:p,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]),v?Promise.resolve([]):mr({titles:y,seriesTitle:m,season:d,episode:p,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[])],se=M.then(A=>{if(!A?.candidateTitles?.length)return[];const V=A.candidateTitles.filter(he=>!y.includes(he));if(!V.length)return[];y=A.candidateTitles,!D&&A.detectedYear&&(D=A.detectedYear);const Ce=[v?Sa({titles:V,title:m,originalTitle:r,isDub:!1}).then(he=>f(he,"subtitled")):ka({titles:V,seriesTitle:m,originalTitle:r,season:d,episode:p,isDub:!1}).then(he=>f(he,"subtitled")),v?Promise.resolve([]):wa({titles:V,seriesTitle:m,originalTitle:r,season:d,episode:p,isDub:!0}).then(he=>f(he,"dubbed")),v?Promise.resolve([]):wa({titles:V,seriesTitle:m,originalTitle:r,season:d,episode:p,isDub:!1}).then(he=>f(he,"subtitled"))];return Promise.allSettled(Ce)}),ne=v?[ka({titles:y,seriesTitle:m,originalTitle:r,season:d,episode:p,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]),ka({titles:y,seriesTitle:m,originalTitle:r,season:d,episode:p,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]),La({titles:y,tmdbId:s,seriesTitle:m,originalTitle:r,season:d,episode:p}).then(A=>f(A,"subtitled")).catch(()=>[]),vs({titles:y,seriesTitle:m,title:m,originalTitle:r,season:d,episode:p,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]),ks({titles:y,seriesTitle:m,season:d,episode:p,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[])]:[Sa({titles:y,title:m,originalTitle:r,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]),Sa({titles:y,title:m,originalTitle:r,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]),xr({titles:y,tmdbId:s,title:m,originalTitle:r}).then(A=>f(A,"subtitled")).catch(()=>[]),Da({titles:y,title:m,originalTitle:r,isDub:!0}).then(A=>f(A,"dubbed")).catch(()=>[]),Da({titles:y,title:m,originalTitle:r,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]),gs({titles:y,title:m,originalTitle:r,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[]),ws({titles:y,title:m,originalTitle:r,year:D,isDub:!1}).then(A=>f(A,"subtitled")).catch(()=>[])];await Promise.allSettled([...ae,...ne,se]);const P=m||r||"",Q=v?`/api/subtitles?tmdbId=${s||""}&imdbId=${o||""}&title=${encodeURIComponent(P)}&type=movie`:`/api/subtitles?tmdbId=${s||""}&imdbId=${o||""}&title=${encodeURIComponent(P)}&season=${d}&episode=${p}&type=tv`;for(const A of _)!Array.isArray(A.subtitles)||A.subtitles.length===0?A.subtitles=[{label:"OpenSubtitles (Türkçe)",src:Q}]:A.subtitles.some(V=>(V.label||"").includes("Türkçe")||V.src?.includes("/api/subtitles"))||A.subtitles.push({label:"OpenSubtitles (Türkçe)",src:Q});for(const A of U)(!Array.isArray(A.subtitles)||A.subtitles.length===0)&&(A.subtitles=[{label:"OpenSubtitles (Türkçe)",src:Q}]);const ke=A=>{const V=new Set,Ce=[];for(const he of A){const q=(he.id||"").toLowerCase().split("_").slice(0,2).join("_"),W=(he.displayName||he.name||he.id).toLowerCase().trim(),qe=`${q}||${W}`;V.has(qe)||(V.add(qe),Ce.push(he))}return Ce},ee=ke(_).sort((A,V)=>Et(A)-Et(V)),be=ke(U).sort((A,V)=>Et(A)-Et(V)),je={dubbed:ee,subtitled:be,totalServers:ee.length+be.length,isComplete:!0};if(je.totalServers>0){mi.set(x,je);try{sessionStorage.setItem(`cp_streams_${Ss}_${x}`,JSON.stringify(je))}catch{}}return h(je),je}const Fi="cinepulse_source_health_v1",Is="cinepulse_last_source_v1",Jr=180,jl=80;function Ki(i,s={}){try{const o=JSON.parse(localStorage.getItem(i)||"");return o&&typeof o=="object"?o:s}catch{return s}}function Bs(i,s){try{localStorage.setItem(i,JSON.stringify(s))}catch{}}function _s(i,s){return Object.fromEntries(Object.entries(i).sort(([,o],[,n])=>Number(n?.updatedAt||0)-Number(o?.updatedAt||0)).slice(0,s))}function Mt(i){return String(i||"").toLocaleLowerCase("tr-TR").replace(/https?:\/\/[^/]+/g,"").replace(/\b\d{2,}\b/g,"").replace(/[^a-z0-9çğıöşü]+/gi," ").trim()}function Fl(){const i=navigator.userAgent||"",s=/android|iphone|ipad|ipod/i.test(i)?"mobile":"desktop";return`${/firefox/i.test(i)?"firefox":/safari/i.test(i)&&!/chrome|chromium|android/i.test(i)?"safari":/edg/i.test(i)?"edge":"chromium"}-${s}`}function Ls(i,s=""){const o=Mt(i?.source||i?.provider||""),n=Mt(String(i?.id||"").replace(/_[a-z0-9]{5,}$/i,"")),r=Mt(i?.displayName||i?.name||"");return`${Mt(s||i?.category)}|${o||n}|${r||n}`}function Qr(i,s){if(!i||!s)return!1;const o=Ls(i,s.category),n=Ls(s,s.category);if(o===n)return!0;const r=Mt(i.source||i.provider||""),c=Mt(s.provider||""),u=Mt(i.displayName||i.name||""),d=Mt(s.name||"");return!!(r&&c&&r===c&&(!u||!d||u===d||u.includes(d)||d.includes(u)))}function Rs(i,s){return`${Fl()}|${Ls(i,s)}`}function Er(i,{contentKey:s="",category:o=""}={}){if(!Array.isArray(i)||i.length<2)return Array.isArray(i)?i.slice():[];const n=Ki(Fi),r=Ki(Is)[s];return i.map((c,u)=>{const d=n[Rs(c,o)]||{},p=r&&Qr(c,r)?1e3:0,h=Math.min(12,Number(d.successes)||0)*3,v=Math.min(12,Number(d.failures)||0)*7,m=d.lastFailureAt&&Date.now()-d.lastFailureAt<1e3*60*60*6?20:0;return{source:c,index:u,score:p+h-v-m}}).sort((c,u)=>u.score-c.score||c.index-u.index).map(c=>c.source)}function Kl({contentKey:i,category:s="",source:o}){if(!o)return;const n=Ki(Fi),r=Rs(o,s),c=n[r]||{};if(n[r]={successes:Math.min(20,(Number(c.successes)||0)+1),failures:Math.max(0,(Number(c.failures)||0)-1),lastSuccessAt:Date.now(),updatedAt:Date.now()},Bs(Fi,_s(n,Jr)),i){const u=Ki(Is);u[i]={category:s,provider:String(o.source||o.provider||""),id:String(o.id||""),name:String(o.displayName||o.name||""),updatedAt:Date.now()},Bs(Is,_s(u,jl))}}function Rr({category:i="",source:s}){if(!s)return;const o=Ki(Fi),n=Rs(s,i),r=o[n]||{};o[n]={successes:Number(r.successes)||0,failures:Math.min(20,(Number(r.failures)||0)+1),lastFailureAt:Date.now(),updatedAt:Date.now()},Bs(Fi,_s(o,Jr))}const Ta="4e44d9029b1270a757cddc766a1bcb63";let Ca=null,Ia=null,fi=null,me=null,rt=null;async function $s({type:i="movie",isAnime:s=!1,isSeries:o=null,tmdbId:n,title:r="",seriesTitle:c="",originalTitle:u="",season:d=1,episode:p=1,posterPath:h="",backdropPath:v="",playerVariant:m="",seriesOverview:x="",episodeArtworkPath:T="",shortDramaEpisodes:y=[],offlinePlaybackUrl:D="",offlineMediaKind:M="file",currentTime:_=0,duration:U=0,seasonsList:E=[],maxEpisodes:j=0,roomSync:f=null}){const w=document.getElementById("player-modal");if(!w)return;let ae=null;if(Wt()&&!D&&n&&d!==null&&p!==null&&d!==void 0&&p!==void 0)try{ae=(await _o()).find(e=>String(e.tmdbId)===String(n)&&Number(e.season)===Number(d)&&Number(e.episode)===Number(p))}catch{}if(w.classList.toggle("player-variant-short-drama",m==="short-drama"),Ca?.(),ae||D){D&&gr();const e=await vr(n,d,p);if(!e){G("İndirilen video bulunamadı. İndirilenler listesini yenileyin.","error");return}if(D=e,ae){const a=String(ae.seriesTitle||c||r||ae.title||"").replace(/\s*[·-]\s*\d+\.\s*Sezon\s+\d+\.\s*Bölüm.*$/i,"").trim();M=ae.mediaKind||"file",o=!0,i=ae.type==="anime"?"anime":"tv",s=ae.type==="anime"||s,r=a,c=a,u=u||a,h=h||ae.poster||"",v=v||ae.backdrop||"",_=0,U=0,f=null}}const se=!!D,ne=se&&Wt();w.classList.toggle("player-offline-playback",ne);let P=!1,Q=0,ke=0,ee=ps();const be=ps(),{setTimeout:je,clearTimeout:A,setInterval:V,clearInterval:Ce}=be;function he(){ke++;const e=w.querySelector("#hls-video-player"),a=e?e.paused:!0;e&&typeof e._persistProgress=="function"?e._persistProgress(!0,a):Tt(pt,lt,null,!0,!0),ee.dispose(),ee=ps();for(const t of[me,rt])try{t?.destroy()}catch{}me=rt=null;try{destroyTorrentStream()}catch{}w.querySelectorAll("video, audio").forEach(t=>{try{for(t.pause(),t.removeAttribute("src");t.firstChild;)t.removeChild(t.firstChild);t.load()}catch{}}),w.querySelectorAll("iframe").forEach(t=>{try{t.src="about:blank",t.remove()}catch{}})}fi||(fi=window.open),window.open=function(e,a,t){return typeof e=="string"&&["api.themoviedb.org","image.tmdb.org"].some(b=>e.startsWith(b))?fi.call(window,e,a,t):{closed:!0,focus:()=>{},blur:()=>{},close:()=>{},location:{href:""}}},window.onbeforeunload=function(e){document.getElementById("player-modal")&&document.getElementById("player-modal").classList.contains("hidden")};let q=Number(d)||1,W=Number(p)||1,qe=Array.isArray(E)?E:[],Wi=Number(j)||0,Re=q,yi=new Map,ut=!1,Dt=!1,_e=!!(s||i==="anime"||n&&$o(n)||xo({id:n,title:r}));_e&&n&&(se||fr(n));const re=typeof o=="boolean"?o:i==="tv"||i!=="movie"&&(Array.isArray(E)&&E.length>0||d&&Number(d)>1||p&&Number(p)>1),ue=(c||r||"").replace(/\s*-\s*S\d+E\d+.*$/i,"").replace(/\s*-\s*S\d+.*$/i,"").replace(/\s*[·-]\s*\d+\.\s*Sezon.*$/i,"").replace(/\s*:\s*.*$/,"").replace(/\s*\(\d{4}\).*/,"").trim(),eo=document.title;let Xt=x||"",Ut="",gi=[],Ma="",Oi=[],Pt=0,Vi="",Ua=0,ot=[],vi=!1;if(n&&!se){const e=!re&&i==="movie",a=e?`https://api.themoviedb.org/3/movie/${n}?append_to_response=credits,similar,recommendations&api_key=${Ta}&language=tr-TR`:`https://api.themoviedb.org/3/tv/${n}?append_to_response=credits,similar,recommendations&api_key=${Ta}&language=tr-TR`;fetch(a).then(t=>t.json()).then(t=>{if(!P&&t){if(!h&&t.poster_path&&(h=t.poster_path),!v&&t.backdrop_path&&(v=t.backdrop_path),Va(),t.overview&&(Xt=t.overview),Array.isArray(t.genres)&&(gi=t.genres.map(z=>z.name)),e){if(t.runtime&&(Pt=t.runtime),t.release_date&&(Vi=t.release_date.substring(0,4)),t.vote_average&&(Ua=Number(t.vote_average.toFixed(1))),t.credits&&Array.isArray(t.credits.crew)){const S=t.credits.crew.find(k=>k.job==="Director");S&&(Ma=S.name)}t.credits&&Array.isArray(t.credits.cast)&&(Oi=t.credits.cast.slice(0,10)),ot=(t.recommendations?.results?.length>0?t.recommendations.results:t.similar?.results||[]).filter(S=>S.poster_path).slice(0,12),Xs()}const l=t.recommendations?.results?.length>0?t.recommendations.results:t.similar?.results||[];l.length>0&&(ot=l.filter(z=>z.poster_path).slice(0,12),re&&Ys()),Vs();const b=t.original_language==="ja"||Array.isArray(t.origin_country)&&t.origin_country.includes("JP"),$=Array.isArray(t.genres)&&t.genres.some(z=>z.id===16||/anim/i.test(z.name));b&&$&&(_e=!0,fr(n)),re&&Array.isArray(t.seasons)&&t.seasons.length>0&&(qe=t.seasons.filter(z=>z.season_number>0),nn(),(ut||re)&&Nt())}}).catch(()=>{})}const Ms=se?null:br(n,q,W);let Ne=_||(Ms?Ms.currentTime:0),He=!se&&ui(n,q,W);const lt=U>0?U:i==="movie"?6600:3e3;let pt=Ne,Pa=!1;const qa=e=>{[document.getElementById("btn-toggle-watched-player"),document.getElementById("btn-toggle-watched-mobile")].forEach(l=>{if(!l)return;const b=l.querySelector("span"),$=l.querySelector("[data-lucide]");b&&(b.textContent=e?"İzlendi":"İzlendi Yap"),$&&$.setAttribute("data-lucide",e?"check-circle-2":"check"),e?l.classList.add("watched-active"):l.classList.remove("watched-active")});const a=document.getElementById("btn-toggle-list");if(a){const l=a.querySelector("#list-action-label"),b=a.querySelector("[data-lucide]");l&&(l.textContent=e?"İzlendi":"Listeme Ekle"),b&&b.setAttribute("data-lucide",e?"check-circle-2":"plus"),e?a.classList.add("watched-active"):a.classList.remove("watched-active")}if(re){const l=document.getElementById("dizisol-episodes-carousel");if(l){const b=l.querySelector(`.dizisol-ep-card[data-season="${q}"][data-episode="${W}"]`);if(b){b.classList.toggle("is-watched-card",e);const $=b.querySelector(".dizisol-ep-watch-toggle");$&&($.classList.toggle("is-watched",e),$.setAttribute("title",e?"İzlendi (Kaldırmak için tıkla)":"İzlendi Olarak İşaretle"),$.innerHTML=`
              <i data-lucide="${e?"check-circle-2":"eye"}" style="width: 13px; height: 13px;"></i>
              <span class="ep-watch-text">${e?"İzlendi":"İşaretle"}</span>
            `);const z=b.querySelector(".dizisol-ep-title");if(z){const S=z.getAttribute("data-base-title")||z.textContent.replace(/\s*✓.*$/,"");z.textContent=`${S}${e?" ✓":""}`}}}}const t=document.getElementById("btn-toggle-list");t&&ve(t)};let Na=0;const Tt=(e,a,t=null,l=!1,b=!1)=>{if(!n||se)return;const $=Math.max(0,Math.round(e??pt??0)),z=Math.max(0,Math.round(a||lt||0));pt=$;const S=Date.now();if(!l&&S-Na<15e3)return;Na=S;const k=z>0?Math.min(100,Math.round($/z*100)):0,L=t!==null?t:He||k>=90;L&&!He&&(He=!0,qa(!0)),yr({id:n,title:ue,posterPath:h,backdropPath:v,type:_e?"anime":re?"tv":"movie",isAnime:_e,isSeries:re,season:re?q:void 0,episode:re?W:void 0,currentTime:$,duration:z>0?z:lt,completed:L});try{const X={tmdbId:n,seriesTitle:re?u||ue:void 0,title:u||ue,isSeries:!!re,type:re?"tv":"movie",season:re?q:void 0,episode:re?W:void 0};L?Co(X,k):b?Io(X,k):Bo(X,k)}catch{}};function Us(){Ia&&Ce(Ia),Ia=V(()=>{const e=document.getElementById("hls-video-player");e&&!isNaN(e.currentTime)?!e.paused&&!e.seeking&&Tt(e.currentTime,e.duration,null,!1):document.visibilityState==="visible"&&Le&&(pt+=15,Tt(pt,lt,null,!1))},15e3)}const Yi=()=>{const e=document.getElementById("hls-video-player");e&&typeof e._persistProgress=="function"?e._persistProgress(!0,!0):Tt(pt,lt,null,!0,!0)};window.addEventListener("pagehide",Yi),window.addEventListener("beforeunload",Yi);let J="dubbed",K=[],de=0;const Ha=()=>`${i}:${n||ue}:s${q}:e${W}`;let Se={dubbed:[],subtitled:[]},tt=!0,Le=!1,Gt=!1,Zt=null,wi=0,Ps=!1,Fe="smooth",ki=!1,Jt=!1,Si=!1,Qt=0;const ja=new Map,Fa=new Map,ei=new Map,qs=new Map;let Xi=null,Ka=null;function Wa(e){if(!f||!e||e.roomCode!==f.roomCode||String(e.mediaId)!==String(f.mediaId)||e.type!==f.type)return;if(e.action==="fullscreen-request"||e.requestFullscreen){so();return}const a=Number(e.issuedAt)||0;if(a&&a<wi)return;if(e.source&&(e.action!=="state"||!mt)&&(mt=e.source,Ws()||!Os())){Zt=e;return}if(e.type==="tv"&&(Number(e.season)!==q||Number(e.episode)!==W)){Zt=e,Gt=!0,Ht(Number(e.season)||1,Number(e.episode)||1).finally(()=>{Gt=!1});return}const t=w.querySelector("#hls-video-player");if(!t){Zt=e;return}const l=e.action==="state",b=Number(e.time),$=Number.isFinite(b)?b-t.currentTime:0,z=()=>{try{for(let H=0;H<t.buffered.length;H+=1)if(t.buffered.start(H)<=b+.15&&t.buffered.end(H)>=b+1)return!0}catch{}return!1},S=Fe==="smooth",k=S&&!Ps&&l,L=k&&Number.isFinite(b)&&Math.abs($)<=120;S&&l&&(Ps=!0);const X=S?L&&Math.abs($)>.25||!l&&e.action==="seek"&&Number.isFinite(b)&&Math.abs($)>.25:!l&&Number.isFinite(b)&&Math.abs($)>.25||l&&Math.abs($)>18&&t.readyState>=HTMLMediaElement.HAVE_FUTURE_DATA&&z(),oe=typeof e.playing=="boolean"&&e.playing===t.paused&&(!l&&(!S||e.action==="play"||e.action==="pause")||k),Y=!!e.settings&&!l&&!S,N=!!(e.audioTrack&&typeof t._setAudioTrack=="function")&&!l&&!S;if(!X&&!oe&&!Y&&!N){a&&(wi=Math.max(wi,a));return}if(Gt=!0,X)try{t.currentTime=Math.max(0,b)}catch{}Y&&(it.brightness=Math.max(30,Math.min(150,Number(e.settings.brightness)||100)),it.speed=Math.max(.5,Math.min(2,Number(e.settings.speed)||1)),t.style.filter=`brightness(${it.brightness/100})`,t.playbackRate=it.speed,Number.isFinite(Number(e.settings.volume))&&(t.volume=Math.max(0,Math.min(1,Number(e.settings.volume)))),typeof e.settings.muted=="boolean"&&(t.muted=e.settings.muted)),N&&t._setAudioTrack(e.audioTrack,!0),oe&&(e.playing?t.play().catch(()=>{}):t.pause()),a&&(wi=Math.max(wi,a)),window.setTimeout(()=>{Gt=!1},120)}f&&be.on(window,"cinepulse:player-sync-remote",e=>Wa(e.detail)),f?.initialSync&&window.setTimeout(()=>Wa(f.initialSync),0);const it={brightness:100,speed:1};let $i=0;const Oa=[];function Ns(){const e=w.querySelector("#room-chat-unread"),a=w.querySelector("#room-chat-unread-cloud"),t=$i>=1,l=$i>9?"9+":String($i);e&&(e.hidden=!t,e.textContent=l),a&&(a.hidden=!t,a.textContent=l)}function Gi(e,a=!1){if(!e?.text)return;const t=e.id||`${e.senderId||(a?"self":"guest")}:${e.sentAt||""}:${e.text}`;Oa.some(S=>S.fingerprint===t)||Oa.push({...e,fingerprint:t,mine:a});const l=w.querySelector("#room-chat-messages");if(!l||Array.from(l.children).some(S=>S.dataset?.roomChatId===t))return;l.querySelector("p")?.remove();const b=document.createElement("div");b.className=`room-chat-message${a?" mine":""}`,b.dataset.roomChatId=t;const $=document.createElement("strong");$.textContent=a?"Sen":e.nickname||"Misafir";const z=document.createElement("span");for(z.textContent=String(e.text).slice(0,240),b.append($,z),l.appendChild(b);l.children.length>60;)l.firstElementChild?.remove();l.scrollTop=l.scrollHeight}function Hs(e){if(!f)return;let a=w.querySelector("#room-chat-panel"),t=!1;a||(t=!0,a=document.createElement("aside"),a.id="room-chat-panel",a.className="room-chat-panel",a.innerHTML='<header><strong>Oda sohbeti</strong><button type="button" aria-label="Kapat">×</button></header><div id="room-chat-messages" class="room-chat-messages"><p>Oda sohbeti yalnızca bu oturumda kalır.</p></div><form><input maxlength="240" autocomplete="off" placeholder="Mesaj yaz…" /><button type="submit">Gönder</button></form>',a.querySelector("header button").onclick=()=>Hs(!1),a.querySelector("form").onsubmit=b=>{b.preventDefault();const $=a.querySelector("input"),z=$.value.trim();if(!z)return;const S=Date.now(),k=`chat-${S}-${Math.random().toString(36).slice(2,8)}`,L=window.__cinepulseDecisionRoomPresence?.selfId||"self",X=Number(w.querySelector("#hls-video-player")?.currentTime)||0;Gi({id:k,text:z,senderId:L,nickname:"Sen",sentAt:S,at:X},!0),window.dispatchEvent(new CustomEvent("cinepulse:room-chat-send",{detail:{roomCode:f.roomCode,id:k,sentAt:S,at:X,text:z}})),$.value=""},(w.querySelector("#cinema-modal-box")||w).appendChild(a),Oa.forEach(b=>Gi(b,b.mine)));const l=typeof e=="boolean"?e:t||a.classList.contains("hidden");a.classList.toggle("hidden",!l),l&&($i=0,Ns(),a.querySelector("input")?.focus())}function Va(e=null){const a=ti();if(document.title=a,!("mediaSession"in navigator)||typeof MediaMetadata>"u")return;const t=h||v,l=t?t.startsWith("http")?t:`https://image.tmdb.org/t/p/w780${t}`:"";navigator.mediaSession.metadata=new MediaMetadata({title:a,artist:re?`${ue} · Sezon ${q}, Bölüm ${W}`:"Film",album:"",artwork:l?[{src:l,sizes:"342x513",type:"image/jpeg"},{src:l,sizes:"780x1170",type:"image/jpeg"}]:[]}),e&&(navigator.mediaSession.playbackState=e.paused?"paused":"playing")}function to(e){if(!e||!("mediaSession"in navigator)||typeof MediaMetadata>"u")return;Va(e);const a=()=>{const l=Number(e.duration),b=Number(e.currentTime);if(Number.isFinite(l)&&l>0&&Number.isFinite(b))try{navigator.mediaSession.setPositionState({duration:l,position:Math.min(b,l),playbackRate:e.playbackRate||1})}catch{}};["play","pause","seeked","loadedmetadata"].forEach(l=>e.addEventListener(l,()=>{navigator.mediaSession.playbackState=e.paused?"paused":"playing",a()}));const t=(l,b)=>{try{navigator.mediaSession.setActionHandler(l,b)}catch{}};t("play",()=>e.play().catch(()=>{})),t("pause",()=>e.pause()),t("seekbackward",l=>{e.currentTime=Math.max(0,e.currentTime-(l.seekOffset||10))}),t("seekforward",l=>{e.currentTime=Math.min(e.duration||1/0,e.currentTime+(l.seekOffset||10))}),t("seekto",l=>{Number.isFinite(l.seekTime)&&(e.currentTime=l.seekTime)}),a()}Va();function js(e){if(!f||e?.roomCode!==f.roomCode||document.fullscreenElement?.id==="hls-video-player")return;const a=w.querySelector("#player-iframe-wrapper");if(!a)return;const t=document.createElement("span");t.className="room-reaction-burst",t.textContent=e.emoji,t.style.left=`${22+Math.random()*56}%`,a.appendChild(t),window.setTimeout(()=>t.remove(),1800)}function Fs(){if(!f)return;const e=w.querySelector("#player-iframe-wrapper");if(!e||e.querySelector("#room-reaction-dock"))return;const a=document.createElement("div");a.id="room-reaction-dock",a.className="room-reaction-dock",a.innerHTML=["🎬","😂","😱","❤️"].map(t=>`<button type="button" aria-label="${t} tepki gönder">${t}</button>`).join(""),a.querySelectorAll("button").forEach(t=>{t.onclick=l=>{l.stopPropagation();const b={roomCode:f.roomCode,emoji:t.textContent,mediaId:f.mediaId,type:f.type,at:Number(w.querySelector("#hls-video-player")?.currentTime)||0};js(b),window.dispatchEvent(new CustomEvent("cinepulse:room-reaction",{detail:b}))}}),e.appendChild(a)}function io(){let e=null;if(re){const l=xi(q);l&&W<l?e={id:n,type:"tv",season:q,episode:W+1,title:`Sonraki bölüm · S${q} B${W+1}`}:qe.some(b=>b.season_number===q+1)&&(e={id:n,type:"tv",season:q+1,episode:1,title:`Sonraki sezon · S${q+1} B1`})}e||(e={id:n,type:re?"tv":"movie",season:q,episode:W,title:re?"Bu bölümü yeniden izle":"Filmi yeniden izle"});const a=ot[0],t=a?{id:a.id,type:re?"tv":"movie",season:1,episode:1,title:a.title||a.name||"Benzer yapım"}:{...e,title:"Benzer yapım hazırlanıyor"};return[{id:"next",icon:"⏭",label:e.title,card:e},{id:"similar",icon:"✨",label:t.title,card:t},{id:"close",icon:"👋",label:"Odayı kapat",card:null}]}function Zi(e){if(!f||!e||e.roomCode!==f.roomCode)return;const a=w.querySelector("#player-iframe-wrapper");if(!a)return;a.querySelector("#room-finish-overlay")?.remove();const t=e.votes||{},l=L=>Object.values(t).filter(X=>X===L).length,b=Ve();Ka=e;const $=Xi&&String(Xi.mediaId)===String(f.mediaId)?Xi:null,z=L=>{const X=Math.max(0,Math.floor(Number(L)||0));return`${Math.floor(X/60)} dk`},S=L=>{if(!Number.isFinite(Number(L)))return"—";const X=Math.max(0,Math.floor(Number(L)));return`${Math.floor(X/60)}:${String(X%60).padStart(2,"0")}`},k=document.createElement("section");k.id="room-finish-overlay",k.className="room-finish-overlay",k.innerHTML=`
      <div class="room-finish-panel">
        <span class="room-finish-kicker">BİRLİKTE SEÇ</span>
        <h3>${re?"Bölüm bitti. Sırada ne var?":"Film bitti. Sırada ne var?"}</h3>
        <p>${b?"Bir seçeneğe dokun; herkeste aynı anda açılacak.":"Seçimini oylayabilirsin. Moderatör herkese açar."}</p>
        ${$?`<section class="room-watch-summary"><strong><i data-lucide="sparkles"></i> Oda özeti</strong><span><b>${$.participants||1} kişi</b><small>${z($.watchedSeconds)} birlikte</small></span><span><b>${$.topReaction?`${$.topReaction.emoji} ${$.topReaction.count}`:"—"}</b><small>en çok tepki</small></span><span><b>${S($.topTalkSecond)}</b><small>en çok konuşulan an</small></span></section>`:""}
        <div class="room-finish-options">
          ${(e.options||[]).map(L=>`<button type="button" class="room-finish-option" data-option="${L.id}">
            <b>${L.icon}</b><span>${L.label}</span><small>${b?"Herkese aç":`${l(L.id)} oy`}</small>
          </button>`).join("")}
        </div>
      </div>`,k.querySelectorAll("[data-option]").forEach(L=>{L.onclick=X=>{X.stopPropagation();const oe=(e.options||[]).find(Y=>Y.id===L.dataset.option);oe&&(b?window.dispatchEvent(new CustomEvent("cinepulse:room-finish-choice",{detail:{roomCode:f.roomCode,action:oe.id==="close"?"close":"open",card:oe.card}})):(window.dispatchEvent(new CustomEvent("cinepulse:room-finish-vote",{detail:{roomCode:f.roomCode,finishId:e.id,optionId:oe.id}})),L.classList.add("voted")))}}),a.appendChild(k)}function ao(){if(!f||!Ve())return;const e={id:`${f.mediaId}-${Date.now()}`,roomCode:f.roomCode,options:io(),votes:{}},a=w.querySelector("#hls-video-player");window.dispatchEvent(new CustomEvent("cinepulse:room-summary",{detail:{roomCode:f.roomCode,mediaId:f.mediaId,type:f.type,seconds:a?.duration||a?.currentTime||0}})),Zi(e),window.dispatchEvent(new CustomEvent("cinepulse:room-finish",{detail:e}))}function so(){if(!f||Ve())return;w.querySelector("#room-fullscreen-invite")?.remove();const a=document.createElement("button");a.id="room-fullscreen-invite",a.className="room-fullscreen-invite",a.type="button",a.textContent="Moderatör tam ekran önerdi · Aç",a.onclick=()=>{const t=w.querySelector("#hls-video-player"),l=w.querySelector("#video-iframe"),$=w.querySelector("#direct-video-wrapper")||l||t||w.querySelector("#cinema-modal-box");$?.requestFullscreen?.().catch(()=>$?.webkitRequestFullscreen?.()),a.remove()},w.appendChild(a),window.setTimeout(()=>a.remove(),9e3)}function Ks(){!f?.roomCode||!Ve()||window.dispatchEvent(new CustomEvent("cinepulse:player-sync",{detail:{roomCode:f.roomCode,mediaId:f.mediaId,type:f.type,season:q,episode:W,action:"fullscreen-request",requestFullscreen:!0,issuedAt:Date.now()}}))}f&&(be.on(window,"cinepulse:room-finish-remote",e=>Zi(e.detail)),be.on(window,"cinepulse:room-finish-vote-remote",e=>Zi(e.detail)),be.on(window,"cinepulse:room-reaction-remote",e=>js(e.detail)),be.on(window,"cinepulse:room-summary-remote",e=>{const a=e.detail;!a||a.roomCode!==f.roomCode||String(a.mediaId)!==String(f.mediaId)||(Xi=a,Ka&&Zi(Ka))}),be.on(window,"cinepulse:room-chat-remote",e=>{const a=e.detail,t=a?.senderId===window.__cinepulseDecisionRoomPresence?.selfId;Gi(a,t);const l=w.querySelector("#room-chat-panel");!t&&(!l||l.classList.contains("hidden"))&&($i+=1,Ns())}),be.on(window,"cinepulse:room-playback-health-remote",e=>{const a=e.detail;if(!a||a.roomCode!==f.roomCode||!Ve()||Fe!=="strict")return;ja.set(a.senderId,a.status);const t=w.querySelector("#hls-video-player"),l=Array.from(ja.values()).includes("buffering");l&&t&&!t.paused?(ki=!0,t.pause()):!l&&ki&&t?.paused&&(ki=!1,t.play().catch(()=>{}))}),be.on(window,"cinepulse:room-playback-progress-remote",e=>{const a=e.detail;if(!a||a.roomCode!==f.roomCode||!Ve()||Fe!=="smooth")return;Fa.set(a.senderId,a);const t=w.querySelector("#hls-video-player");if(!t||!Number.isFinite(t.currentTime))return;const l=Array.from(Fa.values()).filter(z=>Date.now()-z.reportedAt<25e3),b=l.reduce((z,S)=>Math.max(z,t.currentTime-S.time),0),$=a.time-t.currentTime;l.forEach(z=>{const S=t.currentTime-z.time;if(Math.abs(S)<45)return;const k=qs.get(z.senderId)||0;Date.now()-k<12e3||(qs.set(z.senderId,Date.now()),window.dispatchEvent(new CustomEvent("cinepulse:room-rhythm",{detail:{roomCode:f.roomCode,targetId:z.senderId,mediaId:f.mediaId,type:f.type,drift:S}})))}),b>=90&&!Jt&&!t.paused?(Jt=!0,Qt=Date.now()+2500,t.pause(),G(`${a.nickname||"Katılımcı"} geride kaldı; fark büyümesin diye kısa süre bekleniyor.`,"info")):Jt&&b<=12&&t.paused&&(Jt=!1,Qt=Date.now()+2500,t.play().catch(()=>{}),G("Katılımcı yakaladı; akıcı izleme devam ediyor.","success")),$>=90&&!ei.has(a.senderId)&&(ei.set(a.senderId,a.time),window.dispatchEvent(new CustomEvent("cinepulse:room-playback-checkpoint",{detail:{roomCode:f.roomCode,targetId:a.senderId,action:"hold",mediaId:f.mediaId,type:f.type}})))}),be.on(window,"cinepulse:room-playback-checkpoint-remote",e=>{const a=e.detail,t=window.__cinepulseDecisionRoomPresence?.selfId;if(!a||Fe!=="smooth"||a.roomCode!==f.roomCode||a.targetId!==t||String(a.mediaId)!==String(f.mediaId)||a.type!==f.type)return;const l=w.querySelector("#hls-video-player");l&&(Qt=Date.now()+2500,a.action==="hold"&&!l.paused?(Si=!0,l.pause(),G("Moderatör geride kaldı; sana yaklaşana kadar kısa süre bekleniyor.","info")):a.action==="resume"&&Si&&l.paused&&(Si=!1,l.play().catch(()=>{}),G("Moderatör yakaladı; akıcı izleme devam ediyor.","success")))}),be.on(window,"cinepulse:room-rhythm-remote",e=>{const a=e.detail,t=window.__cinepulseDecisionRoomPresence?.selfId;if(!a||a.roomCode!==f.roomCode||a.targetId!==t||String(a.mediaId)!==String(f.mediaId)||a.type!==f.type)return;const l=w.querySelector("#player-iframe-wrapper");if(!l)return;l.querySelector("#room-rhythm-card")?.remove();const b=Math.round(Math.abs(Number(a.drift)||0)),$=document.createElement("aside");$.id="room-rhythm-card",$.className="room-rhythm-card",$.innerHTML=Number(a.drift)>0?`<i data-lucide="clock-3"></i><span><b>${Math.ceil(b/60)} dk geridesin</b><small>Akıcı izlemeye devam et; oda seni bekliyor.</small></span>`:'<i data-lucide="clock-3"></i><span><b>Öndesin</b><small>Diğer izleyici sana yaklaşıyor.</small></span>',l.appendChild($),ve($),window.setTimeout(()=>$.remove(),8500)}),be.on(window,"cinepulse:room-playback-finished-remote",e=>{const a=e.detail;if(!a||Fe!=="smooth"||a.roomCode!==f.roomCode||String(a.mediaId)!==String(f.mediaId)||a.type!==f.type)return;const t=a.type==="tv"?`S${a.season} B${a.episode}`:"filmi";G(`🎬 ${a.nickname||"Bir katılımcı"} ${t} bitirdi. Sen akıcı izlemeye devam ediyorsun.`,"info")}),be.on(window,"cinepulse:decision-room-close-player",e=>{e.detail?.roomCode===f.roomCode&&Ca?.()}));function xi(e){const a=qe.find(t=>t.season_number===e);return a&&a.episode_count?a.episode_count:Wi>0&&e===q?Wi:0}function ti(){return re?`${ue} • S${q} B${W}`:ue}function at(e){if(!e)return"";const a=t=>typeof t=="string"&&t.startsWith("/api/")?Ze(t):t||"";if(typeof e.getUrl=="function")try{const t=e.getUrl();if(t)return a(t)}catch{}return a(e.streamUrl||e.url||e.originalEmbedUrl||"")}let mt=null;function Ji(e){const a=at(e);return!!(e?.isDirectVideo||e?.isHls||a&&!a.startsWith("magnet:")&&(a.includes(".m3u8")||a.includes(".txt")||a.includes(".mp4")||a.includes(".mkv")||a.includes("mkv_stream")||a.includes(":4000/torrent/")))}function yt(e){if(!Array.isArray(e)||e.length===0||!f)return 0;const a=e.findIndex(Ji);return a>=0?a:0}function Ve(){const e=window.__cinepulseDecisionRoomPresence;return!f||!e||e.roomCode!==f.roomCode||e.isHost!==!1}function Ct(){return Ve()?!0:(G("Bu odada kaynak ve bölüm kontrolü moderatörde.","info"),!1)}function Qi(e=K[de]){return e?{category:J,id:String(e.id||""),provider:String(e.source||""),name:String(e.displayName||e.name||""),quality:String(e.quality||"")}:null}function Ya(e,a){if(!e||!a)return!1;const t=L=>String(L||"").trim().toLocaleLowerCase("tr-TR"),l=t(e.id),b=t(a.id);if(l&&b&&l===b||Qr(e,a))return!0;const $=t(e.source),z=t(a.provider),S=t(e.displayName||e.name),k=t(a.name);return $||z?!!($&&z&&$===z&&(!k||S===k)):!!(S&&k&&S===k)}function ea(){const e=Qi();if(!f?.roomCode||!e)return;const a=w.querySelector("#hls-video-player");window.dispatchEvent(new CustomEvent("cinepulse:player-sync",{detail:{roomCode:f.roomCode,mediaId:f.mediaId,type:f.type,season:q,episode:W,action:"source",source:e,audioTrack:a?._currentAudioTrack||null,settings:{...it,volume:a?.volume??1,muted:!!a?.muted},time:Number.isFinite(a?.currentTime)?a.currentTime:0,playing:!!(a&&!a.paused),issuedAt:Date.now()}}))}function Ws(){if(!f||!mt)return!1;const e=[mt.category,"dubbed","subtitled"].filter((a,t,l)=>(a==="dubbed"||a==="subtitled")&&l.indexOf(a)===t);for(const a of e){const t=Se[a]||[],l=t.findIndex($=>Ya($,mt));if(l<0)continue;const b=J!==a||!Ya(K[de],mt);return J=a,K=t,de=l,Le=!0,document.getElementById("tab-dubbed")?.classList.toggle("active",a==="dubbed"),document.getElementById("tab-subtitled")?.classList.toggle("active",a==="subtitled"),st(),Be(),Ke(),b&&Ie(),b}return!1}function Os(){return mt?["dubbed","subtitled"].some(e=>(Se[e]||[]).some(a=>Ya(a,mt))):!1}function Vs(){const e=document.getElementById("dizisol-genre-chips");e&&Array.isArray(gi)&&gi.length>0&&(e.innerHTML=gi.map(l=>`<span class="dizisol-genre-chip">${l}</span>`).join(""));const a=document.getElementById("dizisol-overview");a&&(re?Ut&&(a.textContent=Ut):Xt&&(a.textContent=Xt));const t=document.querySelector(".dizisol-ep-badge");if(t)if(re)t.textContent=`Sezon ${q} • Bölüm ${W}`;else{const l=Pt?`${Math.floor(Pt/60)}s ${Pt%60}dk`:"",b=Vi||"";t.textContent=["Film",b,l].filter(Boolean).join(" • ")}}function Ys(){const e=document.getElementById("dizisol-similar-section");if(!e)return;if(!ot||ot.length===0){e.innerHTML="";return}const a=ot.map(t=>{const l=t.poster_path?`https://image.tmdb.org/t/p/w342${t.poster_path}`:"",b=t.vote_average?t.vote_average.toFixed(1):"",$=(t.first_air_date||t.release_date||"").substring(0,4),z=t.name||t.title||"";return`
        <div class="player-sim-card" data-sim-id="${t.id}" data-sim-type="tv" data-sim-title="${z}" title="${z} • İncele / İzle">
          <div class="player-sim-poster-box">
            ${l?`<img src="${l}" alt="${z}" class="player-sim-poster" loading="lazy" />`:""}
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
        <span class="player-sim-count" style="font-size: 0.8rem; color: #94a3b8; font-weight: 600;">${ot.length} Yapım</span>
      </div>
      <div class="player-sim-rail" style="display:flex; gap:1rem; overflow-x:auto; padding-bottom:0.75rem; scrollbar-width:none;">
        ${a}
      </div>
    `,ve(e),e.querySelectorAll(".player-sim-card").forEach(t=>{t.addEventListener("click",l=>{l.preventDefault();const b=t.getAttribute("data-sim-id"),$=t.getAttribute("data-sim-type")||"tv";b&&(window.location.hash=`#/${$}/${b}`)})})}function Xs(){if(re){Ys();return}const e=document.getElementById("dizisol-movie-section");if(!e)return;const a=Pt?`${Math.floor(Pt/60)} sa ${Pt%60} dk`:"",t=Oi&&Oi.length>0?Oi.map(b=>{const $=b.profile_path?`https://image.tmdb.org/t/p/w185${b.profile_path}`:"https://image.tmdb.org/t/p/w185/null";return`
            <div class="player-movie-cast-chip" title="${b.name} (${b.character||""})">
              <img src="${$}" alt="${b.name}" class="player-cast-avatar" onerror="this.onerror=null; this.style.display='none';" />
              <div class="player-cast-meta">
                <span class="player-cast-name">${b.name}</span>
                ${b.character?`<span class="player-cast-role">${b.character}</span>`:""}
              </div>
            </div>
          `}).join(""):"",l=ot&&ot.length>0?ot.map(b=>{const $=b.poster_path?`https://image.tmdb.org/t/p/w342${b.poster_path}`:"",z=b.vote_average?b.vote_average.toFixed(1):"",S=(b.release_date||"").substring(0,4);return`
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
        ${Ma?`
          <div class="player-movie-director-tag">
            <span class="meta-tag-label">YÖNETMEN:</span>
            <span class="meta-tag-val">${Ma}</span>
          </div>
        `:""}
        ${a?`
          <div class="player-movie-pill">
            <i data-lucide="clock" style="width:13px;height:13px;color:#f59e0b"></i>
            <span>${a}</span>
          </div>
        `:""}
        ${Ua>0?`
          <div class="player-movie-pill highlight">
            <i data-lucide="star" style="width:13px;height:13px;color:#eab308;fill:#eab308"></i>
            <span>${Ua} / 10</span>
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
      ${l?`
        <div class="player-movie-block">
          <div class="player-movie-block-header">
            <h4>BENZER FİLMLER & ÖNERİLER</h4>
            <span class="player-sim-count">${ot.length} Film</span>
          </div>
          <div class="player-sim-carousel">
            ${l}
          </div>
        </div>
      `:""}
    `,e.querySelectorAll(".player-sim-card").forEach(b=>{b.addEventListener("click",()=>{const $=b.getAttribute("data-sim-id"),z=b.getAttribute("data-sim-title");$&&$s({type:"movie",tmdbId:parseInt($,10),title:z,currentTime:0})})}),ve(e)}async function Gs(e,a){if(m==="short-drama"||!re||!n)return;const t=document.getElementById("dizisol-overview");let l=yi.get(e);if((!l||l.length===0)&&(l=await Ja(e)),P||e!==q||a!==W)return;const b=l?l.find($=>$.episode_number===a):null;if(b&&b.overview&&b.overview.trim().length>0){Ut=b.overview.trim(),t&&(t.textContent=Ut);return}try{const $=await fetch(`https://api.themoviedb.org/3/tv/${n}/season/${e}/episode/${a}?api_key=${Ta}&language=en-US`);if($&&$.ok){const z=await $.json();if(z&&z.overview&&z.overview.trim().length>0){const S=await Do(z.overview.trim());if(P||e!==q||a!==W)return;if(S&&S.trim()){Ut=S.trim(),t&&(t.textContent=Ut);return}}}}catch{}b&&b.name&&!b.name.toLowerCase().includes("bölüm")?t&&(t.textContent=`${b.name} - Bölüm özeti hazırlanıyor...`):Xt&&t&&(t.textContent=Xt)}function ii(){const e=K[de];return e?e.displayName||e.name||"Sunucu":tt?"Kaynak aranıyor...":"Kaynak Bulunamadı"}function Be(){const e=document.getElementById("active-source-chip-label");e&&(e.textContent=`Kaynak: ${ii()} (Değiştir)`);const a=document.getElementById("player-top-source-chip");if(a){const t=ii(),l=a.querySelector("span");l&&(l.textContent=t),a.title=`Aktif Yayın Hattı: ${t}`,K&&K.length>0&&K[de]&&(a.style.display="inline-flex")}vi&&Ke(),po(),f&&aa(),Je()}let gt=!1,vt=null,qt=null,Ye={percent:0,loaded:0,status:""},Zs=0;function Js(e){try{window.CinePulseNative?.startDownloadNotification?.(String(e||"CinePulse indirmesi"))}catch{}}function Qs(e,a){try{const t=Date.now();if(t-Zs<500&&Number(a?.percent)<100)return;Zs=t,window.CinePulseNative?.updateDownloadNotification?.(String(e||"CinePulse indirmesi"),Number(a?.percent)||0,String(a?.status||"İndiriliyor…"),Number(a?.loaded)||0,Number(a?.total)||0)}catch{}}function ta(e,a){try{window.CinePulseNative?.finishDownloadNotification?.(!!e,String(a||""))}catch{}}function ia(e=null,a=null){return e!==null&&a!==null&&e!==void 0&&a!==void 0?`${n}_s${e}_e${a}`:String(n)}function no(e){if(!e)return!1;const a=at(e);return a?e.isDirectVideo||e.isHls||e.isTorrent||/\.(?:m3u8|mp4|m4v|webm|mkv)(?:[?#]|$)/i.test(a)||a.includes("/api/hls_proxy")||a.includes("/api/snx")||a.includes("/api/dzs")||a.includes("/api/rtv")||a.includes("/api/czm")||a.includes("/api/jet")?!0:/^https?:\/\//i.test(a)&&!/^https?:\/\/[^/]+\/?$/i.test(a):!1}function Xa(){const e=[],a=new Set,t=(l,b=null)=>{if(!l)return;const $=at(l);!$||a.has($)||no(l)&&(a.add($),e.push({server:l,streamUrl:$,displayName:l.displayName||l.name||"Yayın Hattı",isDirectVideo:!!(l.isDirectVideo||/\.(?:mp4|m4v|webm|mkv)(?:[?#]|$)/i.test($)),isHls:!!(l.isHls||$.includes(".m3u8")||$.includes("/api/hls_proxy")),isTorrent:!!(l.isTorrent||$.startsWith("magnet:")),category:b||l.category||J}))};t(K[de]);for(const l of K||[])t(l);for(const l of Se?.dubbed||[])t(l,"dubbed");for(const l of Se?.subtitled||[])t(l,"subtitled");return e}function ro(){const e=Xa();return e.find(t=>t.isDirectVideo&&!t.isHls)||e[0]||null}async function Je(){const e=w.querySelector("#btn-player-download"),a=ia(re?q:null,re?W:null),t=gt&&qt===a;if(e&&t){const $=e.querySelector("span"),z=w.querySelector("#player-download-progress"),S=Ye,k=Number(S.total)>0,L=k?Math.floor(S.loaded/S.total*100):0,X=k?S.status==="Tamamlandı"?100:Math.min(99,L):0;e.dataset.downloading="true",e.classList.add("is-downloading"),e.classList.remove("is-downloaded");const oe=k?`%${X}`:S.loaded>0?Vt(S.loaded):"…";if($&&($.textContent=oe),e.title=S.status||"İndirme başlatılıyor…",z){z.hidden=!1,z.classList.toggle("is-indeterminate",!k&&S.loaded>0);const Y=z.querySelector("[data-download-status]"),N=z.querySelector("[data-download-amount]"),H=z.querySelector("[data-download-speed]"),I=z.querySelector("[data-download-bar]");Y&&(Y.textContent=S.status||"İndirme başlatılıyor…"),N&&(N.textContent=k?`${Vt(S.loaded)} / ${Vt(S.total)} · %${X}`:`${Vt(S.loaded)} alındı`),H&&(H.textContent=S.speedBytesPerSecond>0?`${Vt(S.speedBytesPerSecond)}/sn`:"Hız hesaplanıyor…"),I&&(I.style.width=k?`${X}%`:"")}ve(e)}const l=t?!1:await ms(n,re?q:null,re?W:null);if(P)return;if(e&&!t){const $=w.querySelector("#player-download-progress");$&&($.hidden=!0);const z=e.querySelector("span");if(l){e.dataset.downloaded="true",e.classList.add("is-downloaded"),e.classList.remove("is-downloading"),e.title="Bu bölüm cihaza indirildi (İndirilenler menüsünden internetsiz izleyebilirsiniz)",z&&(z.textContent="İndirildi");const S=e.querySelector("i");S&&S.setAttribute("data-lucide","check-circle-2")}else{delete e.dataset.downloaded,delete e.dataset.downloading,e.classList.remove("is-downloaded","is-downloading"),e.title="Bölümü indir / çevrimdışı kaydet",z&&(z.textContent="İndir");const S=e.querySelector("i");S&&S.setAttribute("data-lucide","download")}ve(e)}const b=w.querySelectorAll(".dizisol-ep-download-btn");for(const $ of b){const z=parseInt($.getAttribute("data-season"),10),S=parseInt($.getAttribute("data-episode"),10),k=ia(z,S),L=await ms(n,z,S);$.isConnected&&(gt&&qt===k?($.classList.add("is-downloading"),$.classList.remove("is-downloaded"),$.innerHTML=`<span style="font-size:0.6rem;font-weight:800;color:#38bdf8;">%${Ye.percent}</span>`):L?($.classList.add("is-downloaded"),$.classList.remove("is-downloading"),$.innerHTML='<i data-lucide="check-circle-2" style="width:13px;height:13px;color:#fff;"></i>'):($.classList.remove("is-downloaded","is-downloading"),$.innerHTML='<i data-lucide="download" style="width:13px;height:13px;"></i>'),ve($))}}async function oo(e=null,a=null){const t=re&&(e!==null||a!==null||q!==null),l=t?e!==null?e:q:null,b=t?a!==null?a:W:null,$=ia(l,b),z=w.querySelector("#player-download-popover"),S=w.querySelector("#download-popover-body");if(!z||!S)return;z.classList.remove("hidden");const k=!t||l===q&&b===W;let L=k?Xa():[];if(!k||L.length===0){S.innerHTML=`
        <div class="drawer-loading" style="padding: 2.5rem 1rem; text-align: center;">
          <div class="drawer-spinner" style="margin: 0 auto 1rem;"></div>
          <p style="color:#94a3b8; font-size:0.9rem;">${l}. Sezon ${b}. Bölüm için indirme kaynakları taranıyor...</p>
        </div>
      `;try{const I=await La({titles:[ue,c,u].filter(Boolean),seriesTitle:ue,originalTitle:u,season:l,episode:b,tmdbId:n,isDub:J==="dubbed"});if(Array.isArray(I)&&I.length>0){const ye=I.map(le=>({server:le,streamUrl:at(le),displayName:le.displayName||le.name||"DS 1080p",isDirectVideo:!!le.isDirectVideo,isHls:!!le.isHls,category:J})).filter(le=>le.streamUrl),ie=new Set(L.map(le=>le.streamUrl));L.push(...ye.filter(le=>!ie.has(le.streamUrl)))}}catch{}}if(L.length===0&&k){const I=ro();I&&L.push(I)}const X=await ms(n,l,b),oe=t?`${ue} · ${l}. Sezon ${b}. Bölüm`:ue,Y=t?`${ue}_S${String(l).padStart(2,"0")}E${String(b).padStart(2,"0")}.mp4`:`${ue}.mp4`;let N=0;const H=()=>{const I=L[N]||L[0],ye=gt&&qt===$;S.innerHTML=`
        <div class="dl-modal-header-card">
          <div class="dl-modal-art">
            ${v||h?`<img src="${v||h}" alt="${oe}" />`:'<i data-lucide="film"></i>'}
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

        ${L.length>1?`
          <div class="dl-stream-selector-group">
            <label class="dl-selector-label"><i data-lucide="server" style="width:13px;height:13px"></i> Yayın / İndirme Hattı:</label>
            <div class="dl-stream-chips">
              ${L.map((ie,le)=>`
                <button type="button" class="dl-stream-chip ${le===N?"active":""}" data-stream-idx="${le}">
                  ${ie.displayName||`Hat ${le+1}`}
                  ${ie.isDirectVideo?" • MP4":""}
                </button>
              `).join("")}
            </div>
          </div>
        `:""}

        ${!I&&!X?`
          <div class="dl-no-stream-warning">
            <i data-lucide="alert-circle" style="width:20px;height:20px;color:#f59e0b"></i>
            <p>Bu bölüm için şu anda doğrudan indirilebilir hat taranıyor. Lütfen birkaç saniye sonra tekrar deneyin veya oynatıcıdan başka bir hat seçin.</p>
          </div>
        `:""}

        ${I?`
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
                
                ${ye?`
                  <div class="dl-progress-box">
                    <div class="dl-progress-info">
                      <span>İndiriliyor: %${Ye.percent}</span>
                      <span>${Ye.loaded>0?Vt(Ye.loaded):""}</span>
                    </div>
                    <div class="dl-progress-track">
                      <div class="dl-progress-bar" style="width: ${Ye.percent}%;"></div>
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
      `,ve(S),S.querySelectorAll(".dl-stream-chip").forEach(ie=>{ie.addEventListener("click",()=>{N=parseInt(ie.getAttribute("data-stream-idx"),10)||0,H()})}),S.querySelector("#btn-dl-play-offline")?.addEventListener("click",async()=>{z.classList.add("hidden");try{const ie=await vr(n,l,b);if(!ie)throw new Error("İndirilen video açılamadı.");$s({type:t?"tv":"movie",tmdbId:n,title:oe,seriesTitle:ue,season:l||1,episode:b||1,posterPath:h,backdropPath:v,offlinePlaybackUrl:ie,offlineMediaKind:"hls"})}catch(ie){G(ie?.message||"İndirilen içerik açılamadı.","error")}}),S.querySelector("#btn-dl-delete-offline")?.addEventListener("click",async()=>{window.confirm(`“${oe}” cihazdan silinsin mi?`)&&(await Lo(n,l,b),G("İndirilen içerik silindi.","success"),Je(),H())}),S.querySelector("#btn-dl-native-start")?.addEventListener("click",async()=>{if(I)try{const ie=await hs(I.server||{streamUrl:I.streamUrl})||I.server,le=at(ie)||I.streamUrl;if(!le||le.startsWith("magnet:"))throw new Error("Bu kaynak doğrudan dosya indirmeyi desteklemiyor.");G("📥 İndirme başlatılıyor...","info"),Eo(le,Y)}catch(ie){G(ie?.message||"Kaynak indirme bağlantısına çözümlenemedi.","error")}}),S.querySelector("#btn-dl-copy-link")?.addEventListener("click",async()=>{if(I)try{const ie=typeof I.streamUrl=="string"&&I.streamUrl.startsWith("/api/")?Ze(I.streamUrl):I.streamUrl;await navigator.clipboard.writeText(ie),G("📋 İndirme bağlantısı kopyalandı! 1DM, ADM veya VLC uygulamasına yapıştırabilirsiniz.","success")}catch{G("Bağlantı kopyalanamadı.","error")}}),S.querySelector("#btn-dl-offline-start")?.addEventListener("click",async()=>{if(I){if(gt){G("Şu anda başka bir indirme devam ediyor.","info");return}gt=!0,qt=$,vt=new AbortController,Ye={percent:1,loaded:0,status:"Başlatılıyor..."},Js(oe),Je(),H(),G(`🚀 Çevrimdışı indirme başladı: ${oe}`,"info");try{const ie=await hs(I.server||{streamUrl:I.streamUrl})||I.server,le=at(ie)||I.streamUrl;if(!le||le.startsWith("magnet:"))throw new Error("Bu kaynak uygulama içi indirme için doğrudan video sunmuyor.");await wr({tmdbId:n,type:t?"tv":"movie",title:oe,seriesTitle:t?ue:"",poster:h,backdrop:v,season:l,episode:b,streamUrl:le},Ae=>{Ye=Ae,Qs(oe,Ae);const O=S.querySelector(".dl-progress-bar"),ze=S.querySelector(".dl-progress-info span:first-child"),F=S.querySelector(".dl-progress-info span:last-child");O&&(O.style.width=`${Ae.percent}%`),ze&&(ze.textContent=`İndiriliyor: %${Ae.percent}`),F&&Ae.loaded>0&&(F.textContent=Vt(Ae.loaded)),Je()},vt.signal),ta(!0,"Çevrimdışı izlemek için hazır"),G(`🎉 “${oe}” başarıyla cihaza indirildi! 'İndirilenler' sekmesinden internetsiz izleyebilirsiniz.`,"success")}catch(ie){ta(!1,ie?.message==="İndirme iptal edildi"?"İndirme iptal edildi":ie?.message||"İndirme tamamlanamadı"),ie.message!=="İndirme iptal edildi"?G(ie?.message||"İndirme tamamlanamadı. Başka bir hat deneyin.","error"):G("İndirme iptal edildi.","info")}finally{gt=!1,qt=null,vt=null,Je(),H()}}}),S.querySelector("#btn-dl-cancel-download")?.addEventListener("click",()=>{vt&&vt.abort()})};H()}async function lo(){const e=re?q:null,a=re?W:null,t=ia(e,a);if(gt){G("Bir indirme zaten devam ediyor.","info");return}gt=!0,qt=t,vt=new AbortController,Ye={percent:0,loaded:0,total:0,speedBytesPerSecond:0,updatedAt:Date.now(),status:"Kaynak aranıyor..."},Js(ti()),Je(),G(`“${ti()}” için indirme başlatılıyor…`,"info");let l=!1,b=null;try{let $=Xa();if($.length===0&&re)try{$=(await La({titles:[ue,c,u].filter(Boolean),seriesTitle:ue,originalTitle:u,season:e,episode:a,tmdbId:n,isDub:J==="dubbed"})||[]).map(L=>({server:L,streamUrl:at(L),displayName:L.displayName||L.name||"Dizisol",isDirectVideo:!!L.isDirectVideo,isHls:!!L.isHls,category:J})).filter(L=>L.streamUrl)}catch{}const z=$.filter(k=>k&&!k.isTorrent).filter((k,L,X)=>X.findIndex(oe=>oe.streamUrl===k.streamUrl)===L);if(z.length===0)throw new Error("Bu bölüm için indirilebilir yayın bulunamadı.");let S=!1;for(const k of z.slice(0,5)){if(vt.signal.aborted)throw new Error("İndirme iptal edildi");try{Ye={...Ye,status:`${k.displayName||"Kaynak"} deneniyor...`},Je();const X=k.server===K[de]?k.server:await hs(k.server||{streamUrl:k.streamUrl})||k.server,oe=at(X)||k.streamUrl;if(!oe||oe.startsWith("magnet:"))throw new Error("Torrent kaynağı doğrudan indirilemez.");await wr({tmdbId:n,type:re?"tv":"movie",title:re?`${ue} · ${e}. Sezon ${a}. Bölüm`:ue,seriesTitle:re?ue:"",poster:h,backdrop:v,season:e,episode:a,streamUrl:oe},Y=>{const N=Ye,H=Date.now(),I=Math.max(.1,(H-(N.updatedAt||H))/1e3),ie=Math.max(0,Number(Y.loaded||0)-Number(N.loaded||0))/I;Ye={...Y,speedBytesPerSecond:ie>0?N.speedBytesPerSecond?N.speedBytesPerSecond*.65+ie*.35:ie:N.speedBytesPerSecond,updatedAt:H},Qs(ti(),Ye),(Number(Y.loaded)>0||Number(Y.percent)>5)&&(S=!0),Je()},vt.signal),l=!0,ta(!0,"Çevrimdışı izlemek için hazır"),G(`“${ti()}” indirildi. İndirilenler bölümünden çevrimdışı izleyebilirsin.`,"success");break}catch(L){if(L?.message==="İndirme iptal edildi")throw L;if(b=L,S)break}}if(!l)throw b||new Error("Bu kaynaklardan indirilebilir video alınamadı.")}catch($){ta(!1,$?.message==="İndirme iptal edildi"?"İndirme iptal edildi":$?.message||"İndirme tamamlanamadı"),$?.message!=="İndirme iptal edildi"&&G($?.message||"İndirme başlatılamadı. Kaynak indirilebilir biçimde değil.","error")}finally{gt=!1,qt=null,vt=null,Je()}}function co(){const e=document.getElementById("tab-dubbed-count"),a=document.getElementById("tab-subtitled-count");e&&(e.textContent=String(Se.dubbed?.length||0)),a&&(a.textContent=String(Se.subtitled?.length||0))}function wt(e){const a=document.getElementById("player-sources-popover");a&&(vi=typeof e=="boolean"?e:!vi,vi?(a.classList.remove("hidden"),Ke()):a.classList.add("hidden"))}function Ke(){const e=document.getElementById("sources-popover-list");if(!e)return;const a=document.getElementById("sources-tab-dubbed"),t=document.getElementById("sources-tab-subtitled"),l=document.getElementById("sources-cat-dubbed-count"),b=document.getElementById("sources-cat-subtitled-count"),$=Se?.dubbed||[],z=Se?.subtitled||[];if(l&&(l.textContent=$.length?`(${$.length})`:"(0)"),b&&(b.textContent=z.length?`(${z.length})`:"(0)"),a&&(a.classList.toggle("active",J==="dubbed"),a.onclick=S=>{if(S.preventDefault(),S.stopPropagation(),J!=="dubbed"&&Ct()){J="dubbed",Xe=0;try{localStorage.setItem("cp_preferred_category","dubbed")}catch{}he(),K=Se.dubbed||[],de=yt(K),Le=K.length>0,Be(),Ke(),Ie(),G("🇹🇷 Türkçe Dublaj kaynaklarına geçildi.","info")}}),t&&(t.classList.toggle("active",J==="subtitled"),t.onclick=S=>{if(S.preventDefault(),S.stopPropagation(),J!=="subtitled"&&Ct()){J="subtitled",Xe=0;try{localStorage.setItem("cp_preferred_category","subtitled")}catch{}he(),K=Se.subtitled||[],de=yt(K),Le=K.length>0,Be(),Ke(),Ie(),G("💬 Türkçe Altyazılı kaynaklara geçildi.","info")}}),!K||K.length===0){const S=J==="dubbed"?"subtitled":"dubbed",k=Se?.[S]?.length||0;e.innerHTML=`
        <div style="padding: 1.5rem 1rem; text-align: center; color: #94a3b8; display:flex; flex-direction:column; align-items:center; gap:10px;">
          <p class="sources-empty-text" style="margin:0;">Bu dilde (${J==="dubbed"?"Türkçe Dublaj":"Türkçe Altyazılı"}) yayın hattı bulunamadı.</p>
          ${k>0?`
            <button type="button" class="btn-footer-pill" id="sources-empty-fallback-btn" style="color:#f59e0b; border-color:rgba(245,158,11,0.4);">
              <span>${S==="dubbed"?"🇹🇷 Türkçe Dublaj Kaynaklarını Göster":"💬 Türkçe Altyazılı Kaynakları Göster"} (${k})</span>
            </button>
          `:""}
        </div>
      `;const L=e.querySelector("#sources-empty-fallback-btn");L&&(L.onclick=X=>{X.preventDefault(),S==="dubbed"?a?.click():t?.click()});return}e.innerHTML=K.map((S,k)=>{const L=k===de,X=!!S.failed;let oe="dot-amber",Y='<span class="source-ready-tag">Hazır</span>';return X?(oe="dot-red",Y=`<span class="source-failed-tag"><i data-lucide="alert-triangle" style="width:12px;height:12px"></i> ${S.failReason||"Yanıt Vermedi"}</span>`):L&&(oe="dot-green",Y='<span class="source-active-tag">🟢 Oynatılıyor</span>'),`
        <div class="source-list-item ${L?"active":""} ${X?"failed":""}" data-index="${k}">
          <div class="source-item-left">
            <span class="server-status-dot ${oe}"></span>
            <span class="source-item-name">${S.displayName||S.name}</span>
            <span class="source-item-badge">${S.quality||"1080p"}</span>
          </div>
          <div class="source-item-right">
            ${Y}
          </div>
        </div>
      `}).join(""),e.querySelectorAll(".source-list-item").forEach(S=>{S.addEventListener("click",k=>{k.preventDefault(),k.stopPropagation();const L=parseInt(S.getAttribute("data-index"),10);if(L!==de&&Ct()){if(f&&!Ji(K[L])){G("Birlikte izleme için senkronlanabilir doğrudan bir yayın hattı seçin.","info");return}de=L,Xe=0,wt(!1),Be(),Ie()}})}),ve(e)}function uo(){const e=document.getElementById("player-smart-sources-bar");if(!e)return;if(m==="short-drama"&&(!K||K.length<=1)){e.style.display="none";return}e.style.display="flex";const a=document.getElementById("smart-tab-dubbed"),t=document.getElementById("smart-tab-subtitled"),l=document.getElementById("smart-cat-dubbed-count"),b=document.getElementById("smart-cat-subtitled-count"),$=Se?.dubbed||[],z=Se?.subtitled||[];l&&(l.textContent=$.length?`(${$.length})`:"(0)"),b&&(b.textContent=z.length?`(${z.length})`:"(0)");const S=()=>{const F=document.getElementById("smart-sources-dropdown"),pe=document.getElementById("smart-source-trigger");F&&F.classList.add("hidden"),pe&&pe.classList.remove("is-open")};a&&(a.classList.toggle("active",J==="dubbed"),a.onclick=F=>{F.preventDefault(),F.stopPropagation(),S();const pe=document.getElementById("sources-tab-dubbed");pe&&pe.click()}),t&&(t.classList.toggle("active",J==="subtitled"),t.onclick=F=>{F.preventDefault(),F.stopPropagation(),S();const pe=document.getElementById("sources-tab-subtitled");pe&&pe.click()});const k=document.getElementById("smart-source-trigger"),L=document.getElementById("smart-source-name"),X=document.getElementById("smart-source-dot"),oe=document.getElementById("btn-smart-source-prev"),Y=document.getElementById("btn-smart-source-next"),N=document.getElementById("smart-sources-dropdown"),H=document.getElementById("smart-sources-dropdown-list"),I=document.getElementById("smart-sources-dropdown-count"),ye=K&&K[de],ie=ye?ye.displayName||ye.name||"Sunucu":tt?"Aranıyor...":"Kaynak Yok",le=!!ye?.failed;L&&(L.textContent=ie),X&&(X.className="smart-source-dot "+(ye?le?"dot-failed":"dot-active":"dot-ready"));const Ae=K?K.length:0;I&&(I.textContent=`${Ae} Kaynak`);const O=F=>{if(F!==de&&Ct()){if(f&&!Ji(K[F])){G("Birlikte izleme için senkronlanabilir doğrudan bir yayın hattı seçin.","info");return}de=F,Xe=0,Be(),Ie(),G(`⚡ ${K[F]?.displayName||"Kaynak"} yayınına geçildi.`,"info")}},ze=Ae>1;if(oe&&(oe.disabled=!ze,oe.style.opacity=ze?"1":"0.4",oe.onclick=F=>{if(F.preventDefault(),F.stopPropagation(),!ze)return;const pe=(de-1+Ae)%Ae;O(pe)}),Y&&(Y.disabled=!ze,Y.style.opacity=ze?"1":"0.4",Y.onclick=F=>{if(F.preventDefault(),F.stopPropagation(),!ze)return;const pe=(de+1)%Ae;O(pe)}),k&&(k.onclick=F=>{if(F.preventDefault(),F.stopPropagation(),!N)return;N.classList.contains("hidden")?(N.classList.remove("hidden"),k.classList.add("is-open")):S()}),H)if(!K||K.length===0){const F=J==="dubbed"?"subtitled":"dubbed",pe=Se?.[F]?.length||0;H.innerHTML=`
          <div style="padding: 0.75rem; text-align: center; color: #94a3b8; font-size: 0.76rem;">
            ${tt?"Yayın kaynakları taranıyor...":"Bu dilde kaynak bulunamadı."}
            ${pe>0?`
              <button type="button" class="smart-dropdown-item" id="btn-smart-fallback-cat" style="margin-top: 0.5rem; justify-content: center; width: 100%; border: 1px solid rgba(245,158,11,0.3); color: #fbbf24;">
                ${F==="dubbed"?"🇹🇷 Dublaj Kaynaklarını Aç":"💬 Altyazılı Kaynakları Aç"} (${pe})
              </button>
            `:""}
          </div>
        `;const Me=H.querySelector("#btn-smart-fallback-cat");Me&&(Me.onclick=$e=>{$e.preventDefault(),S(),F==="dubbed"?a?.click():t?.click()})}else{H.innerHTML=K.map((pe,Me)=>{const $e=Me===de,we=!!pe.failed;return`
            <button type="button" class="smart-dropdown-item ${$e?"active":""} ${we?"failed":""}" data-server-idx="${Me}">
              <div class="smart-dropdown-item-left">
                <span class="smart-source-dot ${$e?"dot-active":we?"dot-failed":"dot-ready"}"></span>
                <span class="smart-dropdown-item-name">${pe.displayName||pe.name||"Sunucu"}</span>
              </div>
              <div class="smart-dropdown-item-right">
                <span class="smart-dropdown-badge">${pe.quality||"1080p"}</span>
                ${$e?'<span class="smart-dropdown-playing">Aktif</span>':""}
              </div>
            </button>
          `}).join("")+`
          <button type="button" class="smart-dropdown-item" id="btn-smart-advanced-settings" style="margin-top: 0.35rem; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.5rem; color: #94a3b8; font-size: 0.72rem; justify-content: center;">
            <i data-lucide="sliders-horizontal" style="width:12px;height:12px;margin-right:4px;"></i>
            <span>Gelişmiş Kaynak Ayarları</span>
          </button>
        `,H.querySelectorAll(".smart-dropdown-item[data-server-idx]").forEach(pe=>{pe.addEventListener("click",Me=>{Me.preventDefault(),Me.stopPropagation(),S();const $e=parseInt(pe.getAttribute("data-server-idx"),10);O($e)})});const F=H.querySelector("#btn-smart-advanced-settings");F&&(F.onclick=pe=>{pe.preventDefault(),pe.stopPropagation(),S(),wt(!0)})}e._hasOutsideClickListener||(e._hasOutsideClickListener=!0,document.addEventListener("click",F=>{e.contains(F.target)||S()})),ve(e)}const po=uo;let Xe=0,en=0;function Ga(e="Yayın yanıt vermedi"){const a=document.getElementById("player-iframe-wrapper");if(!a)return;if(me){try{me.destroy()}catch{}me=null}if(rt){try{rt.destroy()}catch{}rt=null}const t=K[de],l=K.findIndex((z,S)=>S>de&&!z.failed),b=l!==-1,$=J==="dubbed"&&Se.subtitled?.length>0;a.innerHTML=`
      <div class="player-error-view" style="display:flex;align-items:center;justify-content:center;height:100%;text-align:center;padding:2rem;">
        <div class="player-error-card" style="background:rgba(20,24,35,0.92);backdrop-filter:blur(16px);padding:2rem;border-radius:16px;border:1px solid rgba(255,255,255,0.12);max-width:460px;box-shadow:0 20px 40px rgba(0,0,0,0.6);">
          <i data-lucide="alert-circle" style="width:44px;height:44px;color:#f59e0b;margin-bottom:1rem;"></i>
          <h3 style="color:#fff;font-size:1.15rem;margin-bottom:0.5rem;">${t?.displayName||t?.name||"Seçili Kaynak"} Yanıt Vermedi</h3>
          <p style="color:#94a3b8;font-size:0.85rem;line-height:1.5;margin-bottom:1.25rem;">
            ${e}. Alternatif yayın hatlarından birine geçiş yapabilir veya diğer dildeki kaynakları deneyebilirsiniz.
          </p>
          <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;">
            ${b?`<button class="btn-primary" id="btn-err-try-next" style="padding:0.55rem 1.1rem;font-size:0.85rem;display:inline-flex;align-items:center;gap:0.4rem;"><i data-lucide="skip-forward" style="width:14px;height:14px"></i> Sıradaki Kaynağa Geç (${K[l].displayName||"Alternatif"})</button>`:""}
            <button class="btn-secondary" id="btn-err-open-sources" style="padding:0.55rem 1.1rem;font-size:0.85rem;display:inline-flex;align-items:center;gap:0.4rem;"><i data-lucide="layers" style="width:14px;height:14px"></i> Tüm Kaynaklar (${K.length})</button>
            ${$?'<button class="btn-secondary" id="btn-err-switch-sub" style="padding:0.55rem 1.1rem;font-size:0.85rem;display:inline-flex;align-items:center;gap:0.4rem;color:#f59e0b;"><i data-lucide="message-square" style="width:14px;height:14px"></i> 💬 Altyazılıya Geç</button>':""}
          </div>
        </div>
      </div>
    `,ve(a),document.getElementById("btn-err-try-next")?.addEventListener("click",()=>{b&&(Xe=0,de=l,Be(),Ie())}),document.getElementById("btn-err-open-sources")?.addEventListener("click",()=>{wt(!0)}),document.getElementById("btn-err-switch-sub")?.addEventListener("click",()=>{Xe=0;const z=document.getElementById("tab-subtitled");z&&z.click()})}function ct(e="Bağlantı yanıt vermedi"){if(P)return;if(f&&!Ve()){G("Moderatör alternatif yayına geçiyor…","info");return}const a=Date.now();if(!(e&&/HTTP\s+(403|404|500|502|503)/i.test(e))&&a-en<2500)return;en=a;const l=K[de];l&&(l.failed=!0,l.failReason=e,se||Rr({category:J,source:l})),Xe++;const b=Math.max(3,K.length-1);if(Xe>b){Ga(e);return}const $=l&&(l.isDirectVideo||l.isHls||l.isMkv||!l.isTorrent);let z=-1;for(let S=1;S<K.length;S++){const k=(de+S)%K.length,L=K[k];if(!(!L||L.failed)&&!($&&(L.isTorrent||L.id?.includes("torrent")||L.streamUrl?.startsWith("magnet:")||L.streamUrl?.includes(":4000/torrent/")))){z=k;break}}if(z!==-1){const S=K[z];G(`⚠️ ${l?.displayName||l?.name||"Mevcut kaynak"} yanıt vermedi. ${S.displayName||S.name} deneniyor...`,"warning"),de=z,Be(),Ie();return}if(na){G("⚠️ Seçili hat yanıt vermedi, alternatif hatlar taranıyor...","info");const S=document.getElementById("player-iframe-wrapper");S&&(S.innerHTML=`
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
        `,ve(S));return}Ga(e)}function mo(){return""}function Za(e){const a=[];Array.isArray(e?.subtitles)&&e.subtitles.length>0&&a.push(...e.subtitles);const l=[...K||[],...Se?.subtitled||[],...Se?.dubbed||[]].find(S=>Array.isArray(S.subtitles)&&S.subtitles.length>0);l&&Array.isArray(l.subtitles)&&l.subtitles.length>0&&l.subtitles.forEach(S=>{a.some(k=>k.src===S.src||k.label&&k.label===S.label)||a.push(S)});const b=c||r||u||"",$=i==="movie"?`/api/subtitles?tmdbId=${n||""}&imdbId=&title=${encodeURIComponent(b)}&type=movie`:`/api/subtitles?tmdbId=${n||""}&imdbId=&title=${encodeURIComponent(b)}&season=${q}&episode=${W}&type=tv`;return a.some(S=>(S.label||"").toLowerCase().includes("opensubtitles")||S.src?.includes("/api/subtitles"))||a.push({label:"OpenSubtitles (Türkçe)",src:$}),a}function tn(e,a){if(!e)return;const t=Za(a),l=J==="subtitled"&&t.length>0?0:-1,b=()=>{try{const $=e.textTracks;if($&&$.length>0)for(let z=0;z<$.length;z++)l>=0&&z===l?$[z].mode="showing":$[z].mode="disabled"}catch{}};e.readyState>=1?b():(e.addEventListener("loadedmetadata",b,{once:!0}),e.addEventListener("canplay",b,{once:!0}))}function fo(){const e=document.getElementById("hls-video-player");if(!e)return;const a=K[de];if(!a)return;const t=Za(a);!t||t.length===0||(e.querySelectorAll("track").length===0&&t.forEach((l,b)=>{let $=l.src;$&&$.startsWith("http")&&($=`/api/proxy?url=${encodeURIComponent($)}`);const z=document.createElement("track");z.kind="subtitles",z.label=l.label||"Altyazı",z.src=$,z.srclang=(l.label||"").toLowerCase().includes("türk")?"tr":"en",J==="subtitled"&&b===0&&(z.default=!0),e.appendChild(z)}),tn(e,a))}function an(){if((tt||na)&&(!K||K.length===0))return`
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
      `;if(J==="dubbed"&&(!K||K.length===0))return`
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
              <span>💬 Türkçe Altyazılı Sunucuları Aç (${Se.subtitled?.length||0} Hat Aktif)</span>
            </button>
            <button id="btn-retry-discovery" class="btn-secondary" style="padding: 0.55rem 1.1rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.4rem;">
              <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
              <span>Yeniden Tara</span>
            </button>
          </div>
        </div>
      `;if(!K||K.length===0)return`
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
      `;const e=K[de];if(!e||e.notFound)return`
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
      `:"",k=Za(e),L=J==="subtitled"&&k.length>0?0:-1,X=k.map((Y,N)=>{let H=Y.src;H&&H.startsWith("http")&&(H=`/api/proxy?url=${encodeURIComponent(H)}`);const I=(Y.label||"").toLowerCase().includes("türk")||(Y.label||"").toLowerCase().includes("tr");return`
          <track 
            kind="subtitles" 
            label="${Y.label||"Altyazı"}" 
            src="${H}" 
            srclang="${I?"tr":"en"}" 
            ${N===L?"default":""}>
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
              <span class="binge-card-title" id="binge-card-title">${ue} • Bölüm ${W+1}</span>
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
                ${re?`
                  <button type="button" class="pill-bar-btn" id="pill-btn-episodes" title="Bölümler">
                    <i data-lucide="list-video" style="width: 14px; height: 14px;"></i>
                    <span>Bölümler</span>
                  </button>
                `:""}
                <button type="button" class="pill-bar-btn" id="pill-btn-similar" title="${re?"Benzer Diziler":"Benzer Filmler"}">
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
    `}function sn(){if(!re)return"";const e=xi(q),a=qe.some(b=>b.season_number===q+1);let t="";e>0?W<e?t=`
          <button id="btn-next-episode" class="btn-primary btn-nav-episode btn-nav-next" data-action="next-ep">
            <span>Sonraki Bölüm (B${W+1})</span>
            <i data-lucide="chevron-right" style="width: 15px; height: 15px;"></i>
          </button>
        `:a?t=`
          <button id="btn-next-episode" class="btn-primary btn-nav-episode btn-nav-next-season" data-action="next-season">
            <span>Sonraki Sezon (S${q+1} B1)</span>
            <i data-lucide="fast-forward" style="width: 15px; height: 15px;"></i>
          </button>
        `:t=`
          <span class="badge-series-finished">
            <i data-lucide="check-check" style="width: 14px; height: 14px;"></i>
            <span>Dizi Tamamlandı</span>
          </span>
        `:a?t=`
          <button id="btn-next-episode" class="btn-primary btn-nav-episode btn-nav-next-season" data-action="next-season">
            <span>Sonraki Sezon (S${q+1} B1)</span>
            <i data-lucide="fast-forward" style="width: 15px; height: 15px;"></i>
          </button>
        `:t=`
          <span class="badge-series-finished">
            <i data-lucide="check-check" style="width: 14px; height: 14px;"></i>
            <span>Dizi Tamamlandı</span>
          </span>
        `;let l="";if(W>1)l=`
        <button id="btn-prev-episode" class="btn-secondary btn-nav-episode btn-nav-prev" data-action="prev-ep">
          <i data-lucide="chevron-left" style="width: 15px; height: 15px;"></i>
          <span>Önceki Bölüm (B${W-1})</span>
        </button>
      `;else if(q>1){const b=xi(q-1)||1;l=`
        <button id="btn-prev-episode" class="btn-secondary btn-nav-episode btn-nav-prev-season" data-action="prev-season" data-prev-season="${q-1}" data-prev-ep="${b}">
          <i data-lucide="rewind" style="width: 15px; height: 15px;"></i>
          <span>Önceki Sezon (S${q-1} B${b})</span>
        </button>
      `}return`${l} ${t}`}function nn(){const e=document.getElementById("player-nav-btn-group");e&&(e.innerHTML=sn(),pn(),ve(w))}w.innerHTML=`
    <!-- Ambient Backdrop Aura Glow -->
    <div class="player-ambient-backdrop" ${v?`style="background-image: url('${v}');"`:""}></div>
    
    <div class="modal-content player-modal-content${ne?" player-offline-mode":""}" id="cinema-modal-box">
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
                <small id="room-player-episode">${re?`S${q} · B${W}`:"Film"}</small>
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
            <span id="player-modal-title" class="player-header-title">${ne&&re?`${ue} · S${q} B${W}`:ue}</span>
            ${re?`<span class="player-header-ep-badge">S${q} B${W}</span>`:""}
            <span class="player-active-stream-badge" id="player-top-source-chip" style="${K[de]?"":"display: none !important;"}" title="Aktif Yayın Hattı: ${ii()}">
              <i data-lucide="zap" style="width: 12px; height: 12px; color: #f59e0b;"></i>
              <span>${ii()}</span>
            </span>
            ${Ne>5?`
              <span id="player-resume-time-badge" class="player-resume-badge" title="Kaldığın Süre">
                <i data-lucide="clock" style="width: 11px; height: 11px;"></i>
                <span>${Ot(Ne)}</span>
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
          ${an()}
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

      ${m==="short-drama"&&(T||v||h)?`
      <section class="short-drama-artwork" aria-label="${ue} kapak görseli">
        <img src="${(T||v||h).startsWith("http")?T||v||h:`https://image.tmdb.org/t/p/w1280${T||v||h}`}" alt="${ue}" />
        <div class="short-drama-artwork-shade"></div>
        <div class="short-drama-artwork-copy"><span>KISA DİZİ · MİNİ SERİ · ${W}. BÖLÜM</span><strong>${ue}</strong></div>
      </section>`:""}

      <!-- Dizisol Cinema Body (Title, Genres, Overview & Carousel) -->
      <div class="dizisol-cinema-body">
        <section class="player-editorial-header" aria-label="İçerik bilgisi">
          <div class="player-editorial-copy">
            <div class="player-title-row">
              <h1 class="dizisol-title">${ue}</h1>
            </div>
            <div class="player-meta-pills">
              ${m==="short-drama"?`<span class="dizisol-ep-badge">${W}. Bölüm${j?` · ${j} bölüm`:""}</span>`:`<span class="dizisol-ep-badge">${i==="tv"?`Sezon ${q} · Bölüm ${W}`:"Film"}</span>
                   <span class="player-meta-dot">HD akış</span>
                   <span class="player-meta-dot">Kaldığın yer kaydedilir</span>`}
            </div>
          </div>

          <div class="player-action-cluster" aria-label="Oynatıcı seçenekleri">
            <details class="player-status-menu">
              <summary class="player-status-trigger" title="İzleme durumu"><i data-lucide="bookmark"></i><span id="list-action-label">${He?"İzlendi":"Listeme ekle"}</span><i data-lucide="chevron-down"></i></summary>
              <div class="player-status-options">
                <button type="button" data-watch-state="toggle"><i data-lucide="check-circle-2"></i>${He?"İzlenmedi olarak işaretle":"İzlendi olarak işaretle"}</button>
                <button type="button" data-watch-state="later"><i data-lucide="clock-3"></i>Daha sonra izle</button>
              </div>
            </details>
            <div class="player-feedback-group" aria-label="Yayın geri bildirimi">
              <button id="btn-report-issue" class="player-icon-action" type="button" title="Kaynakta sorun bildir"><i data-lucide="flag"></i></button>
            </div>
          <div class="player-utility-group">
            <button id="btn-open-sources-drawer" class="player-utility-action active-source-action" type="button" title="Yayın Hatları & Sunucu Seçimi">
              <i data-lucide="layers" style="color: #f59e0b;"></i>
              <span id="active-source-chip-label">Kaynak: ${ii()}</span>
            </button>
            ${Wt()&&!D?'<button id="btn-player-download" class="player-utility-action player-download-action" type="button" title="Bölümü indir / çevrimdışı kaydet"><i data-lucide="download"></i><span>İndir</span></button>':""}
            <button id="btn-player-theater" class="player-utility-action" title="Sinema Modu (Genişlet)"><i data-lucide="scan-line"></i><span>Sinema</span></button>
              <button id="btn-player-share" class="player-icon-action" type="button" title="Paylaş"><i data-lucide="share-2"></i></button>
            </div>
            ${Wt()&&!D?'<div id="player-download-progress" class="player-download-progress" hidden aria-live="polite"><div class="player-download-progress-head"><span data-download-status>İndirme başlatılıyor…</span><strong data-download-amount>0 B alındı</strong></div><div class="player-download-progress-track"><span data-download-bar></span></div><div class="player-download-progress-foot"><span>CinePulse İndirilenler’e kaydediliyor</span><span data-download-speed>Hız hesaplanıyor…</span></div></div>':""}
          </div>
        </section>

        <div class="dizisol-genre-chips" id="dizisol-genre-chips">
          ${gi.map(e=>`<span class="dizisol-genre-chip">${e}</span>`).join("")}
        </div>

          <div class="player-story-block ${m==="short-drama"?"short-drama-story":""}">
            ${m==="short-drama"?'<h2 class="short-drama-story-heading">DİZİ HAKKINDA</h2>':""}
            <p class="dizisol-overview" id="dizisol-overview">
            ${m==="short-drama"?x||"Bu kısa dizi için henüz özet girilmedi.":re?Ut||"Bölüm özeti hazırlanıyor...":Xt||"İçerik bilgileri hazırlanıyor..."}
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
                <span class="smart-source-name" id="smart-source-name">${ii()}</span>
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
        ${re&&m==="short-drama"?`
          <section class="dizisol-seasons-section short-drama-episodes">
            <div class="dizisol-seasons-header"><h4>BÖLÜMLER</h4><span class="dizisol-episodes-count">${y.length||j} Bölüm</span></div>
            <div class="short-drama-episode-rail">
              ${y.map(e=>`
                <button class="short-drama-episode-card ${Number(e.episode)===Number(W)?"is-current":""}" type="button" data-drama-season="${e.season}" data-drama-episode="${e.episode}">
                  <span class="short-drama-episode-image">${e.thumb?`<img loading="lazy" src="${e.thumb}" alt="${e.title}" />`:`<span>${e.episode}</span>`}<b>${Number(e.episode)===Number(W)?"ŞİMDİ OYNUYOR":`${e.episode}. BÖLÜM`}</b></span>
                  <span class="short-drama-episode-name">${e.title}</span>
                </button>`).join("")}
            </div>
          </section>
        `:re?`
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
          ${sn()}
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
  `,ne&&(w.classList.add("player-offline-playback"),w.querySelector(".dizisol-cinema-body")?.remove(),w.querySelector(".player-footer-bar")?.remove(),w.querySelector(".player-header-toggle")?.remove(),w.querySelector(".short-drama-artwork")?.remove()),w.classList.remove("hidden"),document.body.style.overflow="hidden",ve(w),Fs(),Je();const aa=(e=window.__cinepulseDecisionRoomPresence)=>{if(!f||!e||e.roomCode!==f.roomCode)return;if(Fe=e.syncMode==="strict"?"strict":"smooth",Fe!=="strict"&&ki&&(ki=!1,ja.clear(),w.querySelector("#hls-video-player")?.play?.().catch(()=>{})),Fe!=="smooth"&&Jt){Jt=!1,Fa.clear();const S=w.querySelector("#hls-video-player");Qt=Date.now()+2500,S?.play?.().catch(()=>{})}if(Fe!=="smooth"&&ei.clear(),Fe!=="smooth"&&Si){Si=!1;const S=w.querySelector("#hls-video-player");Qt=Date.now()+2500,S?.play?.().catch(()=>{})}Array.isArray(e.chatMessages)&&e.chatMessages.filter(S=>S?.senderId!==e.selfId).forEach(S=>Gi(S));const a=w.querySelector("#room-player-status"),t=w.querySelector("#room-player-members"),l=w.querySelector("#room-player-episode"),b=w.querySelector("#room-player-source"),$=w.querySelector("#room-cloud-member-badge"),z=Fe==="strict"?"Herkesle senkron":"Akıcı mod";if(a&&(a.textContent=e.isHost?`${e.participants.length} kişi bağlı · ${z}`:`${e.participants.length} kişi bağlı · ${z}`),$&&($.textContent=String(e.participants.length||1)),t&&(t.innerHTML=e.participants.slice(0,4).map(S=>`<span title="${S.nickname}">${S.role==="moderator"?"♛":"●"} ${S.nickname}</span>`).join("")),l&&(l.textContent=re?`S${q} · B${W}`:"Film"),b){const S=Qi();b.textContent=S?.name?`Ortak kaynak: ${S.name}`:"Ortak kaynak aranıyor…"}};function bo(){const e=w.querySelector("#btn-room-cloud-toggle"),a=w.querySelector("#room-cloud-popover"),t=w.querySelector("#btn-room-cloud-close");if(!e||!a)return;const l=b=>{a.hidden=!b,e.setAttribute("aria-expanded",String(b)),e.classList.toggle("active",b),b&&ve(a)};e.addEventListener("click",b=>{b.stopPropagation(),l(a.hidden)}),t?.addEventListener("click",b=>{b.stopPropagation(),l(!1)}),be.on(document,"click",b=>{!a.hidden&&!a.contains(b.target)&&!e.contains(b.target)&&l(!1)}),be.on(document,"keydown",b=>{b.key==="Escape"&&!a.hidden&&(l(!1),b.stopPropagation())})}f&&(aa(),bo(),w.querySelector("#btn-room-return")?.addEventListener("click",()=>{Di(),window.setTimeout(()=>Ao(),0)}),w.querySelector("#btn-room-chat")?.addEventListener("click",()=>{const e=w.querySelector("#room-cloud-popover");e&&!e.hidden&&(e.hidden=!0,w.querySelector("#btn-room-cloud-toggle")?.setAttribute("aria-expanded","false"),w.querySelector("#btn-room-cloud-toggle")?.classList.remove("active")),Hs()}),be.on(window,"cinepulse:decision-room-presence",e=>aa(e.detail)));async function Ja(e){if(yi.has(e))return yi.get(e);if(!n)return[];try{const a=await fetch(`https://api.themoviedb.org/3/tv/${n}/season/${e}?api_key=${Ta}&language=tr-TR`);if(a&&a.ok){const l=(await a.json()).episodes||[];return yi.set(e,l),l}}catch{}return[]}async function Nt(){const e=document.getElementById("dizisol-season-tabs"),a=document.getElementById("dizisol-episodes-carousel"),t=document.getElementById("dizisol-episodes-total"),b=qe.map(Y=>{let N=`${Y.season_number}. Sezon`;return Y.season_number===0?N=Y.name||"Özel Bölümler":Y.name&&(Y.name.toLowerCase().includes("sezon")||!Y.name.toLowerCase().includes(ue.toLowerCase()))&&(N=Y.name),`
        <button class="dizisol-season-tab ${Y.season_number===Re?"active":""}" data-season="${Y.season_number}">
          <span>${N}</span>
        </button>
      `}).join("");if(e){e.innerHTML=b,ve(e),e.querySelectorAll(".dizisol-season-tab").forEach(H=>{H.addEventListener("click",()=>{Re=parseInt(H.getAttribute("data-season"),10),H.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"}),Nt()})});const Y=e.querySelector(".dizisol-season-tab.active");Y&&je(()=>{Y.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})},120);const N=document.querySelector(".dizisol-season-tabs-rail")||e;if(N&&!N._hasWheel){N._hasWheel=!0,N.addEventListener("wheel",le=>{le.deltaY!==0&&N.scrollWidth>N.clientWidth&&(le.preventDefault(),N.scrollLeft+=le.deltaY)},{passive:!1});let H=!1,I=0,ye=0,ie=!1;N.addEventListener("mousedown",le=>{le.button===0&&(H=!0,ie=!1,I=le.pageX-N.offsetLeft,ye=N.scrollLeft)}),be.on(window,"mousemove",le=>{if(!H)return;const O=(le.pageX-N.offsetLeft-I)*1.5;Math.abs(O)>4&&(ie=!0),N.scrollLeft=ye-O}),be.on(window,"mouseup",()=>{H&&(H=!1,je(()=>{ie=!1},50))}),N.addEventListener("click",le=>{ie&&(le.preventDefault(),le.stopPropagation())},!0)}}const $=`
      <div class="drawer-loading" style="display:flex;align-items:center;gap:0.75rem;padding:1.5rem;color:#94a3b8;">
        <div class="drawer-spinner" style="width:20px;height:20px;border:2px solid rgba(255,255,255,0.2);border-top-color:#e50914;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
        <p style="margin:0;font-size:0.85rem;">Bölümler yükleniyor...</p>
      </div>
    `;a&&(a.innerHTML=$);const z=Re,S=await Ja(z);if(P||z!==Re)return;const k=S&&S.length>0?S.length:xi(Re)||12;t&&(t.textContent=`${k} Bölüm`);let L="";if(!S||S.length===0?L=Array.from({length:k},(N,H)=>H+1).map(N=>{const H=Re===q&&N===W,I=ui(n,Re,N);return`
          <div class="dizisol-ep-card ${H?"playing":""} ${I?"is-watched-card":""}" data-season="${Re}" data-episode="${N}">
            <div class="dizisol-ep-thumb-box">
              <div class="ep-thumb-fallback" style="display:flex;align-items:center;justify-content:center;height:100%;color:#475569;"><i data-lucide="film" style="width:24px;height:24px"></i></div>
              <div class="dizisol-ep-thumb-scrim"></div>
              <span class="dizisol-ep-badge-num ${H?"active":""}">${N}. Bölüm</span>
              <button class="dizisol-ep-watch-toggle ${I?"is-watched":""}" data-season="${Re}" data-episode="${N}" title="${I?"İzlendi (Kaldırmak için tıkla)":"İzlendi Olarak İşaretle"}">
                <i data-lucide="${I?"check-circle-2":"eye"}" style="width: 13px; height: 13px;"></i>
                <span class="ep-watch-text">${I?"İzlendi":"İşaretle"}</span>
              </button>
              ${Wt()?`<button class="dizisol-ep-download-btn" data-season="${Re}" data-episode="${N}" title="Bu bölümü indir" type="button">
                <i data-lucide="download" style="width:12px;height:12px"></i>
              </button>`:""}
              ${H?`
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
              <h5 class="dizisol-ep-title" data-base-title="${N}. Bölüm" title="${N}. Bölüm">${N}. Bölüm ${I?"✓":""}</h5>
            </div>
          </div>
        `}).join(""):L=S.map(Y=>{const N=Y.episode_number,H=Re===q&&N===W,I=ui(n,Re,N),ye=Y.still_path?`https://image.tmdb.org/t/p/w400${Y.still_path}`:"",ie=Y.runtime?`${Y.runtime} dk`:"",le=Y.air_date?Y.air_date.substring(0,7):"";return`
          <div class="dizisol-ep-card ${H?"playing":""} ${I?"is-watched-card":""}" data-season="${Re}" data-episode="${N}">
            <div class="dizisol-ep-thumb-box">
              ${ye?`<img src="${ye}" alt="B${N}" loading="lazy" />`:'<div class="ep-thumb-fallback" style="display:flex;align-items:center;justify-content:center;height:100%;color:#475569;"><i data-lucide="film" style="width:24px;height:24px"></i></div>'}
              <div class="dizisol-ep-thumb-scrim"></div>
              <span class="dizisol-ep-badge-num ${H?"active":""}">${N}. Bölüm</span>
              <button class="dizisol-ep-watch-toggle ${I?"is-watched":""}" data-season="${Re}" data-episode="${N}" title="${I?"İzlendi (Kaldırmak için tıkla)":"İzlendi Olarak İşaretle"}">
                <i data-lucide="${I?"check-circle-2":"eye"}" style="width: 13px; height: 13px;"></i>
                <span class="ep-watch-text">${I?"İzlendi":"İşaretle"}</span>
              </button>
              ${Wt()?`<button class="dizisol-ep-download-btn" data-season="${Re}" data-episode="${N}" title="Bu bölümü indir" type="button">
                <i data-lucide="download" style="width:12px;height:12px"></i>
              </button>`:""}
              ${ie?`<span class="dizisol-ep-duration">${ie}</span>`:""}
              ${H?`
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
              <h5 class="dizisol-ep-title" data-base-title="${Y.name||`${N}. Bölüm`}" title="${Y.name||`${N}. Bölüm`}">${Y.name||`${N}. Bölüm`}${I?" ✓":""}</h5>
              ${le?`<span class="dizisol-ep-date">${le}</span>`:""}
            </div>
          </div>
        `}).join(""),a){a.innerHTML=L,a.querySelectorAll(".dizisol-ep-watch-toggle").forEach(H=>{H.addEventListener("click",I=>{I.stopPropagation(),I.preventDefault();const ye=parseInt(H.getAttribute("data-season"),10),ie=parseInt(H.getAttribute("data-episode"),10),Ae=zo(n,ye,ie,{title:ue,posterPath:h,backdropPath:v,type:_e?"anime":"tv",isAnime:_e,isSeries:!0}).completed;H.classList.toggle("is-watched",Ae),H.setAttribute("title",Ae?"İzlendi (Kaldırmak için tıkla)":"İzlendi Olarak İşaretle"),H.innerHTML=`
            <i data-lucide="${Ae?"check-circle-2":"eye"}" style="width: 13px; height: 13px;"></i>
            <span class="ep-watch-text">${Ae?"İzlendi":"İşaretle"}</span>
          `,ve(H);const O=H.closest(".dizisol-ep-card");if(O){O.classList.toggle("is-watched-card",Ae);const ze=O.querySelector(".dizisol-ep-title");if(ze){const F=ze.getAttribute("data-base-title")||ze.textContent.replace(/\s*✓.*$/,"");ze.textContent=`${F}${Ae?" ✓":""}`}}ye===q&&ie===W&&(He=Ae,qa(Ae)),G(Ae?`✓ S${ye} B${ie} izlendi olarak işaretlendi.`:`S${ye} B${ie} izlendi işareti kaldırıldı.`,"info")})}),a.querySelectorAll(".dizisol-ep-download-btn").forEach(H=>{H.addEventListener("click",I=>{I.stopPropagation(),I.preventDefault();const ye=parseInt(H.getAttribute("data-season"),10),ie=parseInt(H.getAttribute("data-episode"),10);oo(ye,ie)})}),a.querySelectorAll(".dizisol-ep-card").forEach(H=>{H.addEventListener("click",I=>{if(I.target.closest(".dizisol-ep-watch-toggle")||I.target.closest(".dizisol-ep-download-btn"))return;const ye=parseInt(H.getAttribute("data-season"),10),ie=parseInt(H.getAttribute("data-episode"),10);ye===q&&ie===W||Ht(ye,ie)})});const Y=a.querySelector(".dizisol-ep-card.playing");Y&&je(()=>{Y.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})},150);const N=()=>{const H=a.scrollWidth-a.clientWidth,I=document.getElementById("dizisol-carousel-scroll-thumb");if(I&&H>0){const ye=a.scrollLeft/H;I.style.transform=`translateX(${ye*150}%)`}};a.removeEventListener("scroll",N),a.onscroll=N}const X=document.getElementById("btn-carousel-left"),oe=document.getElementById("btn-carousel-right");X&&a&&(X.onclick=()=>a.scrollBy({left:-360,behavior:"smooth"})),oe&&a&&(oe.onclick=()=>a.scrollBy({left:360,behavior:"smooth"})),ve(w),Je()}re&&!se?(Nt(),Gs(q,W)):se||Xs(),m==="short-drama"&&w.querySelectorAll(".short-drama-episode-card").forEach(e=>{e.addEventListener("click",async()=>{const a=Number(e.dataset.dramaSeason)||1,t=Number(e.dataset.dramaEpisode)||1;if(t===Number(W)&&a===Number(q))return;const l=y.find(b=>Number(b.season)===a&&Number(b.episode)===t);try{await $s({type:"tv",tmdbId:n,title:`${ue} - B${t}`,seriesTitle:ue,season:a,episode:t,posterPath:h,backdropPath:v,playerVariant:m,seriesOverview:x,episodeArtworkPath:l?.thumb||h,shortDramaEpisodes:y,maxEpisodes:j,seasonsList:[{season_number:a,episode_count:j}]})}catch{G("Bölüm açılırken bir sorun oluştu.","error")}})});async function ho(){const e=document.getElementById("player-quick-episodes-rail"),a=document.getElementById("quick-ep-count-text");if(!e)return;e.innerHTML=`
      <div class="quick-ep-loading">
        <div class="quick-ep-spinner"></div>
        <span>Bölümler yükleniyor...</span>
      </div>
    `;const t=q,l=await Ja(t);if(P||t!==q)return;const b=l&&l.length>0?l.length:xi(q)||12;a&&(a.textContent=`${b} Bölüm`),!l||l.length===0?e.innerHTML=Array.from({length:b},(z,S)=>S+1).map(z=>{const S=z===W,k=ui(n,q,z);return`
          <div class="quick-ep-card ${S?"active":""}" data-season="${q}" data-episode="${z}">
            <div class="quick-ep-pill">
              <span class="quick-ep-num">B${z}</span>
              ${S?'<span class="quick-ep-now">Oynatılıyor</span>':""}
              ${k&&!S?'<i data-lucide="check" class="quick-ep-watched"></i>':""}
            </div>
          </div>
        `}).join(""):e.innerHTML=l.map(z=>{const S=z.episode_number,k=S===W,L=ui(n,q,S),X=z.still_path?`https://image.tmdb.org/t/p/w200${z.still_path}`:"";return`
          <div class="quick-ep-card ${k?"active":""}" data-season="${q}" data-episode="${S}">
            ${X?`<div class="quick-ep-thumb"><img src="${X}" alt="B${S}" loading="lazy" /></div>`:""}
            <div class="quick-ep-info">
              <div class="quick-ep-title-row">
                <span class="quick-ep-num">B${S}</span>
                <span class="quick-ep-name">${z.name||`${S}. Bölüm`}</span>
              </div>
              ${k?'<span class="quick-ep-now">Oynatılıyor</span>':L?'<span class="quick-ep-watched-label">İzlendi</span>':""}
            </div>
          </div>
        `}).join(""),e.querySelectorAll(".quick-ep-card").forEach(z=>{z.addEventListener("click",()=>{const S=parseInt(z.getAttribute("data-season"),10),k=parseInt(z.getAttribute("data-episode"),10);S===q&&k===W||Ht(S,k)})}),ve(w);const $=e.querySelector(".quick-ep-card.active");$&&je(()=>{$.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})},100)}function Ai(e){const a=document.getElementById("player-episode-drawer");a&&(ut=typeof e=="boolean"?e:!ut,ut?(a.classList.remove("hidden"),Re=q,Nt()):a.classList.add("hidden"))}const rn=document.getElementById("btn-toggle-drawer"),on=document.getElementById("btn-close-drawer"),ln=document.getElementById("btn-drawer-trigger-mobile");rn&&rn.addEventListener("click",()=>Ai()),on&&on.addEventListener("click",()=>Ai(!1)),ln&&ln.addEventListener("click",()=>Ai());function sa(e){const a=document.getElementById("player-shortcuts-popover");a&&(Dt=typeof e=="boolean"?e:!Dt,Dt?a.classList.remove("hidden"):a.classList.add("hidden"))}const cn=document.getElementById("btn-player-shortcuts"),dn=document.getElementById("btn-close-shortcuts");cn&&cn.addEventListener("click",()=>sa()),dn&&dn.addEventListener("click",()=>sa(!1));const un=document.getElementById("btn-player-fullscreen");un&&un.addEventListener("click",()=>{Ks();const e=document.getElementById("cinema-modal-box")||document.documentElement,a=document.getElementById("video-iframe"),t=document.getElementById("hls-video-player"),b=document.getElementById("direct-video-wrapper")||a||t||e;document.fullscreenElement?document.exitFullscreen?document.exitFullscreen().catch(()=>{}):document.webkitExitFullscreen&&document.webkitExitFullscreen():b&&b.requestFullscreen?b.requestFullscreen().catch(()=>e.requestFullscreen().catch(()=>{})):b&&b.webkitRequestFullscreen?b.webkitRequestFullscreen():e.requestFullscreen&&e.requestFullscreen().catch(()=>{})});function pn(){const e=document.getElementById("btn-prev-episode");e&&e.addEventListener("click",t=>{t.preventDefault();const l=e.getAttribute("data-action");if(l==="prev-ep"&&W>1)Ht(q,W-1);else if(l==="prev-season"){const b=parseInt(e.getAttribute("data-prev-season"),10)||1,$=parseInt(e.getAttribute("data-prev-ep"),10)||1;Ht(b,$)}});const a=document.getElementById("btn-next-episode");a&&a.addEventListener("click",t=>{if(t.preventDefault(),se)return;hr(n,q,W,!0,{title:ue,posterPath:h,backdropPath:v,type:_e?"anime":re?"tv":"movie",isAnime:_e,duration:lt}),a.getAttribute("data-action")==="next-season"?Ht(q+1,1):Ht(q,W+1)})}pn();const Qa=()=>{se||(He=!He,re?hr(n,q,W,He,{title:ue,posterPath:h,backdropPath:v,type:_e?"anime":"tv",isAnime:_e,duration:lt}):To(n,He,{title:ue,posterPath:h,backdropPath:v,type:_e?"anime":"movie",isAnime:_e,duration:lt}),[document.getElementById("btn-toggle-watched-player"),document.getElementById("btn-toggle-watched-mobile")].forEach(e=>{if(!e)return;const a=e.querySelector("span"),t=e.querySelector("[data-lucide]");a&&(a.textContent=He?"İzlendi":"İzlendi Yap"),t&&t.setAttribute("data-lucide",He?"check-circle-2":"check"),He?e.classList.add("watched-active"):e.classList.remove("watched-active")}),G(He?"✓ İzlendi olarak işaretlendi.":"İzlendi işareti kaldırıldı.","success"),re&&Nt(),ve(w))},mn=()=>{se||(yr({id:n,title:ue,posterPath:h,backdropPath:v,type:_e?"anime":re?"tv":"movie",isAnime:_e,isSeries:re,season:q,episode:W,currentTime:1200,duration:lt}),G("⏳ 20. dakikada yarıda bırakıldı olarak kaydedildi.","info"))},fn=document.getElementById("btn-toggle-watched-player"),bn=document.getElementById("btn-toggle-watched-mobile");fn&&fn.addEventListener("click",Qa),bn&&bn.addEventListener("click",Qa);const hn=document.getElementById("btn-halfway-player"),yn=document.getElementById("btn-halfway-mobile");hn&&hn.addEventListener("click",mn),yn&&yn.addEventListener("click",mn);function st(){const e=document.getElementById("player-server-toolbar");if(e){if(e.innerHTML=mo(),!e.dataset.scrollAttached){e.dataset.scrollAttached="true",e.addEventListener("wheel",b=>{b.deltaY!==0&&(b.preventDefault(),e.scrollLeft+=b.deltaY*1.5)},{passive:!1});let a=!1,t,l;e.addEventListener("mousedown",b=>{a=!0,t=b.pageX-e.offsetLeft,l=e.scrollLeft}),e.addEventListener("mouseleave",()=>{a=!1}),e.addEventListener("mouseup",()=>{a=!1}),e.addEventListener("mousemove",b=>{if(!a)return;b.preventDefault();const z=(b.pageX-e.offsetLeft-t)*2;e.scrollLeft=l-z})}e.querySelectorAll(".server-btn").forEach(a=>{a.addEventListener("click",t=>{t.preventDefault();const l=parseInt(a.getAttribute("data-index"),10);if(l!==de&&Ct()){if(f&&!Ji(K[l])){G("Birlikte izleme için senkronlanabilir doğrudan bir yayın hattı seçin.","info");return}de=l,e.querySelectorAll(".server-btn").forEach(b=>b.classList.remove("active")),a.classList.add("active"),a.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"}),Ie()}})})}}function yo(e,a){if(!e)return;const t=document.getElementById("direct-video-wrapper")||e.closest(".direct-video-wrapper");if(!t)return;const{on:l,setTimeout:b,clearTimeout:$,setInterval:z,clearInterval:S}=ee,k=t.querySelector("#custom-btn-play");t.querySelector("#custom-player-controls");const L=t.querySelector("#custom-time-display"),X=t.querySelector("#custom-timeline-container"),oe=t.querySelector("#custom-timeline-played"),Y=t.querySelector("#custom-timeline-buffered"),N=t.querySelector("#custom-timeline-thumb"),H=t.querySelector("#custom-timeline-tooltip"),I=t.querySelector("#custom-volume-wrap"),ye=t.querySelector("#custom-btn-volume"),ie=t.querySelector("#custom-volume-slider"),le=t.querySelector("#custom-volume-badge"),Ae=t.querySelector("#custom-volume-popover"),O=t.querySelector("#custom-btn-fullscreen"),ze=t.querySelector("#custom-btn-more"),F=t.querySelector("#custom-player-menu"),pe=t.querySelector("#custom-menu-main"),Me=t.querySelector("#custom-menu-subview"),$e=t.querySelector("#custom-menu-subview-title"),we=t.querySelector("#custom-menu-options-list"),Ge=t.querySelector("#custom-menu-back-btn"),Te=t.querySelector("#custom-center-play-indicator"),Ue=t.querySelector("#custom-floating-pill-bar");Ue&&pe&&window.matchMedia("(max-width: 1024px)").matches&&pe.prepend(Ue);const Ee=t.querySelector("#custom-center-transport"),Tn=t.querySelector(".custom-controls-transport-row");Ee&&Tn&&Ee.appendChild(Tn);const Cn=t.querySelector("#custom-audio-sub-popover");t.querySelector("#audio-sub-tab-audio"),t.querySelector("#audio-sub-tab-subs"),t.querySelector("#audio-sub-pane-audio"),t.querySelector("#audio-sub-pane-subs"),t.querySelector("#audio-sub-options-audio"),t.querySelector("#audio-sub-options-subs"),t.querySelector("#audio-sub-close-btn"),t.querySelector("#custom-btn-rewind-10"),t.querySelector("#custom-btn-forward-10");const Qe=t.querySelector("#custom-brightness-wrap"),In=t.querySelector("#custom-btn-brightness"),Ti=t.querySelector("#custom-brightness-slider"),Bn=t.querySelector("#custom-brightness-badge"),as=t.querySelector("#custom-brightness-popover");if(f&&!Ve()){t.classList.add("room-participant-locked");let g=0;const B=R=>!!R.closest("#custom-volume-wrap, #custom-brightness-wrap, #custom-btn-fullscreen"),C=R=>{B(R.target)||R.target.closest("video")&&R.type==="click"||R.target.closest("button, input, .custom-timeline-container, .custom-player-menu, .custom-binge-card, .dual-audio-bar")&&(R.preventDefault(),R.stopImmediatePropagation(),Date.now()-g>1800&&(g=Date.now(),G("Oynatma kontrolü moderatörde. Ses, parlaklık ve tam ekran sana açık.","info")))};t.addEventListener("click",C,!0),t.addEventListener("dblclick",C,!0)}const _n=t.querySelector("#custom-btn-screen-lock"),Ci=t.querySelector("#custom-btn-screen-unlock"),ai=t.querySelector("#custom-btn-skip-intro"),jt=t.querySelector("#custom-binge-card"),ca=t.querySelector("#binge-sec-num"),Ln=t.querySelector("#binge-card-jump-btn"),En=t.querySelector("#binge-card-close-btn"),si=t.querySelector("#custom-btn-sleep"),Rn=t.querySelector("#custom-menu-item-sleep-menu"),da=t.querySelector("#custom-menu-active-sleep"),ni=t.querySelector("#custom-sleep-curtain"),ss=t.querySelector("#custom-gesture-hud");t.querySelector("#gesture-hud-icon");const Mn=t.querySelector("#gesture-hud-text"),Un=t.querySelector("#gesture-hud-fill"),Pn=t.querySelector("#player-ambient-glow"),qn=t.querySelector("#player-ambient-canvas");qn&&(qn.style.display="none"),Pn&&(Pn.style.background="radial-gradient(circle at center, rgba(245, 158, 11, 0.16) 0%, rgba(20, 184, 166, 0.08) 50%, transparent 75%)");let It=!1;_n&&(_n.onclick=g=>{g.stopPropagation(),It=!0,t.classList.add("is-screen-locked"),Ci&&Ci.classList.remove("hidden"),St(),t.classList.add("hide-controls"),G("🔒 Ekran kilitlendi. Dokunmalar korumalı.","info")}),Ci&&(Ci.onclick=g=>{g.stopPropagation(),It=!1,t.classList.remove("is-screen-locked"),Ci.classList.add("hidden"),We(),G("🔓 Ekran kilidi açıldı.","success")});let Nn=!1;ai&&(ai.onclick=g=>{g.stopPropagation(),Nn=!0,ai.classList.add("hidden");const B=e.currentTime||0,C=Math.max(B+80,85);e.currentTime=Math.min(e.duration||C,C),G("⚡ İntro başarıyla atlandı!","success")});let ft=null,Hn=!1,Ii=5;const jn=()=>{ft&&(S(ft),ft=null),jt&&jt.classList.add("hidden");const g=document.getElementById("btn-next-episode");g&&(G("Sonraki bölüme geçiliyor...","info"),g.click())};Ln&&(Ln.onclick=g=>{g.stopPropagation(),jn()}),En&&(En.onclick=g=>{g.stopPropagation(),Hn=!0,ft&&(S(ft),ft=null),jt&&jt.classList.add("hidden")});const ua=()=>{const g=e.paused;k&&k.dataset.paused!==String(g)&&(k.dataset.paused=String(g),k.innerHTML=`<i data-lucide="${g?"play":"pause"}" style="width: 20px; height: 20px;"></i>`,ve(k)),g&&t.classList.remove("hide-controls")},pa=()=>{e.paused?(e.play().catch(()=>{}),ns("play")):(e.pause(),ns("pause"))},ri=g=>{const B=e.currentTime||0,C=e.duration||1/0,R=Math.max(0,Math.min(C,B+g));e.currentTime=R,nt?.("seek",{time:R}),ns(g>0?"rotate-cw":"rotate-ccw"),G(g>0?"⏩ +10 saniye":"⏪ -10 saniye","info")};Ee&&l(Ee,"click",g=>{const B=g.target.closest("#custom-btn-play, #custom-btn-rewind-10, #custom-btn-forward-10");B&&(g.preventDefault(),g.stopPropagation(),B.id==="custom-btn-play"?pa():B.id==="custom-btn-rewind-10"?ri(-10):ri(10))},!0);let kt=it.brightness;const ma=(g,B=!0)=>{kt=Math.max(30,Math.min(150,g)),it.brightness=kt,e.style.filter=`brightness(${kt/100})`,Ti&&(Ti.value=kt),Bn&&(Bn.textContent=`%${kt}`);const C=t.querySelector("#custom-menu-active-brightness");C&&(C.textContent=`%${kt}`),B&&typeof nt=="function"&&nt("settings")};as&&(as.onclick=g=>g.stopPropagation(),as.ontouchstart=g=>g.stopPropagation()),Ti&&(Ti.oninput=g=>{g.stopPropagation(),_t(),ma(parseInt(Ti.value,10))}),In&&(In.onclick=g=>{if(g.stopPropagation(),Qe){const B=Qe.classList.contains("is-open");I&&I.classList.remove("is-open"),B?(Qe.classList.remove("is-open"),We()):(Qe.classList.add("is-open"),_t())}});const ns=g=>{Te&&(Te.innerHTML=`<i data-lucide="${g}" style="width: 32px; height: 32px;"></i>`,ve(Te),Te.classList.add("animate"),b(()=>Te.classList.remove("animate"),350))};let Fn=0,Kn=0,bt=null;const Wn=()=>{if(!f?.roomCode||Ve()||Fe!=="smooth")return;const g=Date.now();g-Kn<5e3||(Kn=g,window.dispatchEvent(new CustomEvent("cinepulse:room-playback-progress",{detail:{roomCode:f.roomCode,time:e.currentTime,playing:!e.paused,buffering:!e.paused&&e.readyState<HTMLMediaElement.HAVE_FUTURE_DATA}})))},fa=g=>{if(!f?.roomCode||Ve()||Fe!=="strict")return;let B=0;try{for(let C=0;C<e.buffered.length;C+=1)if(e.buffered.start(C)<=e.currentTime&&e.buffered.end(C)>=e.currentTime){B=Math.max(0,e.buffered.end(C)-e.currentTime);break}}catch{}window.dispatchEvent(new CustomEvent("cinepulse:room-playback-health",{detail:{roomCode:f.roomCode,status:g,bufferedAhead:B}}))},nt=(g,B={})=>{!f?.roomCode||Gt||Date.now()<Qt||!Number.isFinite(e.currentTime)||window.dispatchEvent(new CustomEvent("cinepulse:player-sync",{detail:{roomCode:f.roomCode,mediaId:f.mediaId,type:f.type,season:q,episode:W,action:g,source:Qi(),audioTrack:e._currentAudioTrack||null,settings:{...it,volume:e.volume,muted:e.muted},time:Number.isFinite(B.time)?B.time:e.currentTime||0,playing:typeof B.playing=="boolean"?B.playing:!e.paused,issuedAt:Date.now()}}))};if(e.playbackRate=it.speed,ma(it.brightness,!1),Zt){const g=Zt;Zt=null,window.setTimeout(()=>Wa(g),0)}k&&(k.onclick=g=>{g.stopPropagation(),pa()}),e.onclick=g=>{if(It||f&&!Ve())return;if(Qe&&Qe.classList.contains("is-open")||I&&I.classList.contains("is-open")||F&&!F.classList.contains("hidden")){St();return}g.pointerType==="touch"||window.matchMedia("(pointer: coarse)").matches||pa()},l(e,"play",()=>{ua(),We(),nt("play")}),l(e,"playing",()=>We()),l(e,"playing",()=>{bt&&$(bt),fa("ready")}),l(e,"canplay",()=>{bt&&$(bt),fa("ready")}),l(e,"waiting",()=>{bt&&$(bt),bt=b(()=>fa("buffering"),900)}),l(e,"stalled",()=>{bt&&$(bt),bt=b(()=>fa("buffering"),900)}),l(e,"pause",()=>{ua(),Bi(!0),nt("pause")}),l(e,"ended",()=>{ua(),Tt(e.duration||e.currentTime,e.duration,!0,!0),f?.roomCode&&Fe==="smooth"&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-finished",{detail:{roomCode:f.roomCode,mediaId:f.mediaId,type:f.type,season:q,episode:W}})),ao()}),l(e,"seeking",()=>nt("seek")),l(e,"seeked",()=>{Bi(!0),nt("seek")}),l(e,"ratechange",()=>{it.speed=e.playbackRate||1,nt("settings")}),l(e,"volumechange",()=>nt("settings")),ee.setInterval(Wn,5e3);const Bi=(g=!1,B=null)=>{if(!e)return;const C=e.currentTime,R=e.duration;if(isNaN(C)||C<0)return;const Z=B!==null?B:e.paused;Tt(C,R,null,g,Z)};e._persistProgress=Bi,ee.on(e,"pause",()=>{Bi(!0,!0)}),ee.on(e,"play",()=>{Bi(!0,!1)});const Bt=()=>{const g=e.currentTime||0,B=e.duration||0;pt=Math.round(g),L&&(L.textContent=`${Ot(g)} / ${Ot(B)}`);const C=t.querySelector("#custom-time-current");C&&(C.textContent=Ot(g));const R=t.querySelector("#custom-time-duration");R&&(R.textContent=B>0?Ot(B):"00:00");const Z=t.querySelector("#custom-time-remaining");if(Z){const te=Math.max(0,B-g);Z.textContent=B>0?`-${Ot(te)}`:"0:00"}if(B>0){const te=Math.min(100,Math.max(0,g/B*100));if(oe&&(oe.style.width=`${te}%`),N&&(N.style.left=`${te}%`),e.buffered&&e.buffered.length>0){for(let ce=e.buffered.length-1;ce>=0;ce--)if(e.buffered.start(ce)<=g){const De=e.buffered.end(ce),fe=Math.min(100,De/B*100);Y&&(Y.style.width=`${fe}%`);break}}}if(ai&&(g>=10&&g<=90&&!Nn?ai.classList.remove("hidden"):ai.classList.add("hidden")),jt&&re&&B>70){const te=B-g;te<=40&&te>3&&!Hn&&!ft&&(jt.classList.remove("hidden"),ve(jt),Ii=5,ca&&(ca.textContent=Ii),ft=z(()=>{Ii--,ca&&(ca.textContent=Ii),Ii<=0&&(S(ft),ft=null,jn())},1e3))}};if(l(e,"timeupdate",Bt),ee.on(e,"timeupdate",()=>{const g=Date.now();g-Fn>2e3&&(Fn=g,nt("state")),Wn(),f?.roomCode&&Ve()&&Fe==="smooth"&&ei.size&&ei.forEach((B,C)=>{e.currentTime>=B-20&&(ei.delete(C),window.dispatchEvent(new CustomEvent("cinepulse:room-playback-checkpoint",{detail:{roomCode:f.roomCode,targetId:C,action:"resume",mediaId:f.mediaId,type:f.type}})))})}),l(e,"durationchange",Bt),l(e,"loadedmetadata",Bt),l(e,"canplay",Bt),l(e,"progress",Bt),z(()=>{!e.paused&&!e.ended&&Bt()},300),X){let g=null;const B=C=>{const R=X.getBoundingClientRect();if(!R.width||!Number.isFinite(e.duration)||e.duration<=0)return;const Z=Math.max(0,Math.min(1,(C.clientX-R.left)/R.width));g=Z*e.duration,N&&(N.style.left=`${Z*100}%`),oe&&(oe.style.width=`${Z*100}%`)};l(X,"pointerdown",C=>{C.button!==0||It||(C.preventDefault(),X.setPointerCapture(C.pointerId),B(C))}),l(X,"pointermove",C=>{if(X.hasPointerCapture(C.pointerId)&&B(C),!H)return;const R=X.getBoundingClientRect();if(!R.width)return;const Z=Math.max(0,Math.min(1,(C.clientX-R.left)/R.width));H.textContent=Ot(Z*(e.duration||0)),H.style.left=`${Z*100}%`}),l(X,"pointerup",C=>{const R=g;R!==null&&(e.currentTime=R,nt("seek",{time:R})),g=null,X.hasPointerCapture(C.pointerId)&&X.releasePointerCapture(C.pointerId),We()}),l(X,"pointercancel",()=>{g=null,Bt(),We()})}const Ft=()=>{const g=e.muted?0:e.volume;if(ie&&(ie.value=g),le&&(le.textContent=e.muted?"%0":`%${Math.round(g*100)}`),ye){let B="volume-2";e.muted||g===0?B="volume-x":g<.5&&(B="volume-1"),ye.innerHTML=`<i data-lucide="${B}" style="width: 20px; height: 20px;"></i>`,ve(ye)}};Ae&&(Ae.onclick=g=>g.stopPropagation(),Ae.ontouchstart=g=>g.stopPropagation()),ye&&(ye.onclick=g=>{if(g.stopPropagation(),I){const B=I.classList.contains("is-open");Qe&&Qe.classList.remove("is-open"),window.matchMedia("(pointer: coarse)").matches?B?(I.classList.remove("is-open"),We()):(I.classList.add("is-open"),_t()):(e.muted=!e.muted,Ft())}else e.muted=!e.muted,Ft()}),ie&&(ie.oninput=g=>{g.stopPropagation(),_t(),e.volume=parseFloat(ie.value),e.muted=!1,Ft()});const On=()=>{document.fullscreenElement?document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen&&document.webkitExitFullscreen():t.requestFullscreen?t.requestFullscreen():t.webkitRequestFullscreen?t.webkitRequestFullscreen():e.requestFullscreen?e.requestFullscreen().catch(()=>{}):t.webkitRequestFullscreen&&t.webkitRequestFullscreen()};O&&(O.onclick=g=>{g.stopPropagation(),Ks(),On()}),e.ondblclick=g=>{g.stopPropagation();const B=e.getBoundingClientRect(),C=g.clientX-B.left;C<B.width*.35?ri(-10):C>B.width*.65?ri(10):On()},l(document,"fullscreenchange",()=>{We();const g=!!document.fullscreenElement;O&&(O.innerHTML=`<i data-lucide="${g?"minimize":"maximize"}" style="width: 20px; height: 20px;"></i>`,ve(O))});let _i=null,oi=null;const St=(g=!0)=>{Qe&&Qe.classList.remove("is-open"),I&&I.classList.remove("is-open"),F&&F.classList.add("hidden"),Cn&&Cn.classList.add("hidden"),oi&&($(oi),oi=null),g&&We()},_t=()=>{We(),_i&&$(_i),oi&&$(oi),oi=b(()=>{St()},3500)},Lt=document.getElementById("cinema-modal-box"),We=()=>{if(It){t.classList.add("hide-controls"),Lt&&Lt.classList.add("hide-controls");return}t.classList.remove("hide-controls"),Lt&&Lt.classList.remove("hide-controls"),_i&&$(_i),!e.paused&&!e.ended&&(_i=b(()=>{e.paused||(t.classList.add("hide-controls"),Lt&&Lt.classList.add("hide-controls"),St(!1))},3e3))};let Vn=0;const Yn=()=>{const g=Date.now();g-Vn<300||(Vn=g,We())};if(l(t,"pointerenter",g=>{g.pointerType==="mouse"&&Yn()}),l(t,"pointerdown",Yn),l(w,"focusin",We),l(t,"mouseleave",()=>{e.paused||(t.classList.add("hide-controls"),Lt&&Lt.classList.add("hide-controls"),St(!1))}),ze&&F){ze.onclick=xe=>{xe.stopPropagation(),F.classList.contains("hidden")?(li(),F.classList.remove("hidden"),t.classList.remove("hide-controls"),_t()):St()},l(document,"click",xe=>{(!t.contains(xe.target)||!F.contains(xe.target)&&!ze.contains(xe.target))&&F.classList.add("hidden"),Qe&&!Qe.contains(xe.target)&&Qe.classList.remove("is-open"),I&&!I.contains(xe.target)&&I.classList.remove("is-open")});const g=t.querySelector("#custom-btn-subtitles-audio");g&&F&&(g.onclick=xe=>{if(xe.stopPropagation(),F.classList.contains("hidden")){li();const Kt=t.querySelector("#custom-menu-item-subs");Kt&&Kt.click(),F.classList.remove("hidden"),t.classList.remove("hide-controls"),_t()}else St()});const B=t.querySelector("#pill-btn-fit"),C=t.querySelector("#pill-fit-label");let R="contain";B&&(B.onclick=xe=>{xe.stopPropagation(),R==="contain"?(R="cover",e.style.objectFit="cover",C&&(C.textContent="Kapla"),B.classList.add("active"),G("⛶ Görüntü: Ekranı Kapla (Cover)","info")):R==="cover"?(R="fill",e.style.objectFit="fill",C&&(C.textContent="Yay"),B.classList.add("active"),G("⛶ Görüntü: Ekrana Yay (Fill)","info")):(R="contain",e.style.objectFit="contain",C&&(C.textContent="Sığdır"),B.classList.remove("active"),G("⛶ Görüntü: Orijinal Oran (Contain)","info"))});const Z=t.querySelector("#pill-btn-speed"),te=t.querySelector("#pill-speed-label"),ce=[1,1.25,1.5,2,.75];let De=0;Z&&(Z.onclick=xe=>{xe.stopPropagation(),De=(De+1)%ce.length;const Oe=ce[De];e.playbackRate=Oe,te&&(te.textContent=`${Oe}x`),Z.classList.toggle("active",Oe!==1),G(`⏱ Oynatma Hızı: ${Oe}x`,"info")});const fe=t.querySelector("#pill-btn-subs");fe&&F&&(fe.onclick=xe=>{if(xe.stopPropagation(),!F.classList.contains("hidden")&&$e?.textContent==="Altyazılar"){F.classList.add("hidden");return}Qn(),F.classList.remove("hidden"),t.classList.remove("hide-controls"),_t()});const et=t.querySelector("#pill-btn-audio");et&&F&&(et.onclick=xe=>{if(xe.stopPropagation(),!F.classList.contains("hidden")&&$e?.textContent==="Ses Kanalları"){F.classList.add("hidden");return}Zn(),F.classList.remove("hidden"),t.classList.remove("hide-controls"),_t()});const xt=t.querySelector("#pill-btn-sources");xt&&(xt.onclick=xe=>{xe.stopPropagation(),wt(!0)});const va=(xe,Oe)=>{if(!xe)return;if(document.fullscreenElement)try{document.exitFullscreen?.()}catch{}const Kt=w.querySelector(".player-modal-content")||w.querySelector(".cinema-modal-box")||document.querySelector(".cinema-modal-box");if(Kt){const pr=Kt.getBoundingClientRect(),ko=xe.getBoundingClientRect(),So=Kt.scrollTop+(ko.top-pr.top)-18;Kt.scrollTo({top:Math.max(0,So),behavior:"smooth"})}else xe.scrollIntoView({behavior:"smooth",block:"start"});xe.classList.remove("section-interaction-highlight"),xe.offsetWidth,xe.classList.add("section-interaction-highlight"),b(()=>{xe.classList.remove("section-interaction-highlight")},2200),Oe&&G(Oe,"info")},Li=t.querySelector("#pill-btn-episodes")||t.querySelector("#player-link-episodes");Li&&(Li.onclick=xe=>{xe.stopPropagation();const Oe=w.querySelector(".dizisol-seasons-section")||w.querySelector("#dizisol-seasons-section");va(Oe,"Bölümler listesine gidildi")});const Ei=t.querySelector("#pill-btn-similar")||t.querySelector("#player-link-similar");Ei&&(Ei.onclick=xe=>{xe.stopPropagation();const Oe=w.querySelector("#dizisol-similar-section")||w.querySelector("#dizisol-movie-section")||w.querySelector(".dizisol-seasons-section");va(Oe,"Benzer yapımlar bölümüne gidildi")})}const li=()=>{pe&&pe.classList.remove("hidden"),Me&&Me.classList.add("hidden"),Xn()},ci=(g,B)=>{pe&&pe.classList.add("hidden"),Me&&Me.classList.remove("hidden"),$e&&($e.textContent=g),we&&(we.innerHTML=B,ve(we)),ve(Ge)};Ge&&(Ge.onclick=g=>{g.stopPropagation(),li()});const Xn=()=>{const g=t.querySelector("#custom-menu-active-audio");if(g)if(me&&me.audioTracks&&me.audioTracks.length>1){const te=me.audioTracks[me.audioTrack];let ce=te?te.name||te.lang||`Ses ${me.audioTrack+1}`:"Otomatik";/tr|turk/i.test(ce)?ce="Türkçe Dublaj":/en|eng|orig/i.test(ce)&&(ce="Orijinal (İngilizce)"),g.textContent=ce}else e._currentAudioTrack?g.textContent=e._currentAudioTrack==="dubbed"?"Türkçe Dublaj":"Orijinal Ses":g.textContent=J==="dubbed"?"Türkçe Dublaj":"Orijinal Ses";const B=t.querySelector("#custom-menu-active-sub");if(B){let te="Kapalı";const ce=e.textTracks;if(ce&&ce.length>0){for(let De=0;De<ce.length;De++)if(ce[De].mode==="showing"){te=ce[De].label||"Türkçe";break}}B.textContent=te}const C=t.querySelector("#custom-menu-active-sub-style");if(C){const te={small:"Küçük",medium:"Normal",large:"Büyük",xlarge:"Çok Büyük"};C.textContent=te[ge?.fontSize]||"Özelleştir"}const R=t.querySelector("#custom-menu-active-speed");if(R){const te=e.playbackRate||1;R.textContent=te===1?"Normal":`${te}x`}const Z=t.querySelector("#custom-menu-active-brightness");Z&&(Z.textContent=`%${kt}`)},Gn=t.querySelector("#custom-menu-item-audio");Gn&&(Gn.onclick=g=>{g.stopPropagation(),Zn()});function Zn(){let g="";if(me&&me.audioTracks&&me.audioTracks.length>1)g+='<p style="color:#94a3b8;font-size:10.5px;font-weight:700;text-transform:uppercase;margin:2px 0 6px 6px;">VİDEO SES KANALLARI</p>',me.audioTracks.forEach((R,Z)=>{const te=me.audioTrack===Z;let ce=R.name||R.lang||`Kanal ${Z+1}`;/tr|turk/i.test(ce)||/tr|turk/i.test(R.lang||"")?ce="🇹🇷 Türkçe Dublaj":(/en|eng|orig/i.test(ce)||/en|eng/i.test(R.lang||""))&&(ce="🇬🇧 Orijinal (İngilizce)"),g+=`
            <div class="custom-menu-opt-row ${te?"active":""}" data-hls-track="${Z}">
              <span>${ce}</span>
              ${te?'<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>':""}
            </div>
          `});else if(e._setAudioTrack){const R=e._currentAudioTrack||"dubbed";g+='<p style="color:#94a3b8;font-size:10.5px;font-weight:700;text-transform:uppercase;margin:2px 0 6px 6px;">VİDEO SES KANALLARI</p>',g+=`
          <div class="custom-menu-opt-row ${R==="dubbed"?"active":""}" data-dual-track="dubbed">
            <span>🇹🇷 Türkçe Dublaj</span>
            ${R==="dubbed"?'<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>':""}
          </div>
          <div class="custom-menu-opt-row ${R==="original"?"active":""}" data-dual-track="original">
            <span>🇬🇧 Orijinal Ses</span>
            ${R==="original"?'<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>':""}
          </div>
        `}else g+='<p style="color:#94a3b8;font-size:10.5px;font-weight:700;text-transform:uppercase;margin:2px 0 6px 6px;">VİDEO SES KANALLARI</p>',g+=`
          <div class="custom-menu-opt-row active" style="cursor:default;">
            <span>${J==="dubbed"?"🇹🇷 Türkçe Dublaj (Tek Kanal)":"🇬🇧 Orijinal Ses (Tek Kanal)"}</span>
            <i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>
          </div>
          <p style="color:#64748b;font-size:11px;margin:6px 6px 4px;line-height:1.4;">
            Bu hatta tek bir ses kanalı mevcut.
          </p>
        `;const B=J==="dubbed"?"subtitled":"dubbed",C=Se?.[B]?.length||0;if(g+=`
        <div class="custom-menu-opt-row" id="quick-audio-switch-cat-btn" style="border: 1px solid rgba(245,158,11,0.35); background: rgba(245,158,11,0.1); margin-top: 10px; border-radius: 8px;">
          <span>${B==="dubbed"?"🇹🇷 Dublaj Yayınlara Geç":"💬 Altyazılı Yayınlara Geç"} ${C>0?`(${C})`:""}</span>
          <i data-lucide="arrow-right-left" style="width:14px;height:14px;color:#f59e0b;"></i>
        </div>
      `,ci("Ses Kanalları",g),we){we.querySelectorAll("[data-hls-track]").forEach(Z=>{Z.onclick=te=>{te.stopPropagation();const ce=parseInt(Z.getAttribute("data-hls-track"),10);if(me){me.audioTrack=ce;const De=me.audioTracks[ce],fe=De?.name||De?.lang||`Kanal ${ce+1}`;G(`✓ Ses kanalı değiştirildi: ${fe}`,"success")}F.classList.add("hidden")}}),we.querySelectorAll("[data-dual-track]").forEach(Z=>{Z.onclick=te=>{te.stopPropagation();const ce=Z.getAttribute("data-dual-track");e._setAudioTrack&&e._setAudioTrack(ce),F.classList.add("hidden")}});const R=we.querySelector("#quick-audio-switch-cat-btn");R&&(R.onclick=Z=>{Z.stopPropagation(),F.classList.add("hidden");const te=B;J=te,Xe=0;try{localStorage.setItem("cp_preferred_category",te)}catch{}he(),K=Se[te]||[],de=yt(K),Le=K.length>0,Be(),Ke(),Ie(),G(te==="dubbed"?"🇹🇷 Türkçe Dublaj yayınlara geçildi.":"💬 Türkçe Altyazılı yayınlara geçildi.","info")})}}const Jn=t.querySelector("#custom-menu-item-subs");Jn&&(Jn.onclick=g=>{g.stopPropagation(),Qn()});function Qn(){const g=e.textTracks;let B=-1;if(g){for(let R=0;R<g.length;R++)if(g[R].mode==="showing"){B=R;break}}let C=`
        <div class="custom-menu-opt-row ${B===-1?"active":""}" data-sub-idx="-1">
          <span>Kapalı</span>
          ${B===-1?'<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>':""}
        </div>
      `;if(g&&g.length>0)for(let R=0;R<g.length;R++){const Z=g[R],te=B===R;C+=`
            <div class="custom-menu-opt-row ${te?"active":""}" data-sub-idx="${R}">
              <span>${Z.label||`Altyazı ${R+1}`}</span>
              ${te?'<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>':""}
            </div>
          `}if(C+=`
        <div class="custom-menu-opt-row" id="subs-switch-to-sub-sources-btn" style="border: 1px solid rgba(96,165,250,0.35); background: rgba(96,165,250,0.1); margin-top: 10px; border-radius: 8px;">
          <span>💬 Türkçe Altyazılı Yayın Hatlarını Aç</span>
          <i data-lucide="layers" style="width:14px;height:14px;color:#60a5fa;"></i>
        </div>
      `,ci("Altyazılar",C),we){we.querySelectorAll("[data-sub-idx]").forEach(Z=>{Z.onclick=te=>{te.stopPropagation();const ce=parseInt(Z.getAttribute("data-sub-idx"),10);if(g)for(let fe=0;fe<g.length;fe++)g[fe].mode=fe===ce?"showing":"disabled";G(ce===-1?"Altyazı kapatıldı":`✓ Altyazı: ${g[ce]?.label||"Açık"}`,"info");const De=t.querySelector("#custom-menu-active-sub");De&&(De.textContent=ce===-1?"Kapalı":g[ce]?.label||"Açık"),F.classList.add("hidden")}});const R=we.querySelector("#subs-switch-to-sub-sources-btn");R&&(R.onclick=Z=>{Z.stopPropagation(),F.classList.add("hidden"),wt(!0);const te=document.getElementById("sources-tab-subtitled");te&&te.click()})}}const rs={fontSize:"medium",color:"#ffffff",fontFamily:"sans",bg:"semi",position:"bottom",bottomOffset:25};let ge={...rs};try{const g=localStorage.getItem("cinepulse_subtitle_style");g&&(ge={...rs,...JSON.parse(g)})}catch{}const ba=(g=ge)=>{let B=document.getElementById("cinepulse-sub-custom-style");B||(B=document.createElement("style"),B.id="cinepulse-sub-custom-style",document.head.appendChild(B));const C={small:"14px",medium:"19px",large:"25px",xlarge:"33px"},R={sans:"Inter, system-ui, -apple-system, sans-serif",serif:"Georgia, Cambria, serif",mono:'"JetBrains Mono", Consolas, monospace'},Z={trans:"transparent",semi:"rgba(0, 0, 0, 0.75)",solid:"rgba(0, 0, 0, 0.95)"},te=g.bg==="trans"?"0 0 4px #000, 0 0 6px #000, 2px 2px 2px #000, -2px -2px 2px #000":"0 2px 4px rgba(0,0,0,0.85)",ce=typeof g.bottomOffset=="number"?g.bottomOffset:25;if(B.textContent=`
        video::cue {
          font-family: ${R[g.fontFamily]||R.sans} !important;
          font-size: ${C[g.fontSize]||C.medium} !important;
          color: ${g.color||"#ffffff"} !important;
          background-color: ${Z[g.bg]||Z.semi} !important;
          text-shadow: ${te} !important;
          line-height: 1.35 !important;
          transform: translateY(-${ce}px) !important;
        }
        #custom-html5-video::cue {
          font-family: ${R[g.fontFamily]||R.sans} !important;
          font-size: ${C[g.fontSize]||C.medium} !important;
          color: ${g.color||"#ffffff"} !important;
          background-color: ${Z[g.bg]||Z.semi} !important;
          text-shadow: ${te} !important;
          line-height: 1.35 !important;
          transform: translateY(-${ce}px) !important;
        }
      `,e&&e.textTracks)try{const De=g.position==="top"?2:g.position==="middle"?8:-Math.max(1,Math.round(ce/18)+1);for(let fe=0;fe<e.textTracks.length;fe++){const et=e.textTracks[fe];if(et.cues)for(let xt=0;xt<et.cues.length;xt++)et.cues[xt].line=De}}catch{}};ba(ge);const er=t.querySelector("#custom-menu-item-sub-style");er&&(er.onclick=g=>{g.stopPropagation(),tr()});const tr=()=>{const g=()=>{const C={sans:"Inter, sans-serif",serif:"Georgia, serif",mono:"monospace"},R={small:"12px",medium:"15px",large:"18px",xlarge:"22px"},Z={trans:"transparent",semi:"rgba(0, 0, 0, 0.75)",solid:"rgba(0, 0, 0, 0.95)"},te=ge.bg==="trans"?"0 0 3px #000, 1px 1px 1px #000":"0 1px 3px rgba(0,0,0,0.8)";return`
          font-family: ${C[ge.fontFamily]};
          font-size: ${R[ge.fontSize]};
          color: ${ge.color};
          background-color: ${Z[ge.bg]};
          text-shadow: ${te};
          padding: 4px 8px;
          border-radius: 4px;
          display: inline-block;
          transition: all 0.15s ease;
        `},B=`
        <div class="custom-sub-settings-panel">
          <!-- Canlı Önizleme -->
          <div class="sub-preview-box">
            <span id="sub-preview-text" style="${g()}">
              Örnek Altyazı Metni
            </span>
          </div>

          <!-- 1. Yazı Boyutu -->
          <div>
            <div class="sub-style-group-label">Yazı Boyutu</div>
            <div class="sub-style-btn-grid">
              <button class="sub-style-btn ${ge.fontSize==="small"?"active":""}" data-sub-key="fontSize" data-sub-val="small">Küçük</button>
              <button class="sub-style-btn ${ge.fontSize==="medium"?"active":""}" data-sub-key="fontSize" data-sub-val="medium">Normal</button>
              <button class="sub-style-btn ${ge.fontSize==="large"?"active":""}" data-sub-key="fontSize" data-sub-val="large">Büyük</button>
              <button class="sub-style-btn ${ge.fontSize==="xlarge"?"active":""}" data-sub-key="fontSize" data-sub-val="xlarge">Çok Büyük</button>
            </div>
          </div>

          <!-- 2. Yazı Rengi -->
          <div>
            <div class="sub-style-group-label">Yazı Rengi</div>
            <div class="sub-style-btn-grid">
              <button class="sub-style-btn ${ge.color==="#ffffff"?"active":""}" data-sub-key="color" data-sub-val="#ffffff">
                <span style="display:inline-block;width:9px;height:9px;background:#ffffff;border-radius:50%;"></span> Beyaz
              </button>
              <button class="sub-style-btn ${ge.color==="#facc15"?"active":""}" data-sub-key="color" data-sub-val="#facc15">
                <span style="display:inline-block;width:9px;height:9px;background:#facc15;border-radius:50%;"></span> Sarı
              </button>
              <button class="sub-style-btn ${ge.color==="#4ade80"?"active":""}" data-sub-key="color" data-sub-val="#4ade80">
                <span style="display:inline-block;width:9px;height:9px;background:#4ade80;border-radius:50%;"></span> Yeşil
              </button>
              <button class="sub-style-btn ${ge.color==="#38bdf8"?"active":""}" data-sub-key="color" data-sub-val="#38bdf8">
                <span style="display:inline-block;width:9px;height:9px;background:#38bdf8;border-radius:50%;"></span> Mavi
              </button>
            </div>
          </div>

          <!-- 3. Yazı Tipi -->
          <div>
            <div class="sub-style-group-label">Yazı Tipi</div>
            <div class="sub-style-btn-grid" style="grid-template-columns: repeat(3, 1fr);">
              <button class="sub-style-btn ${ge.fontFamily==="sans"?"active":""}" data-sub-key="fontFamily" data-sub-val="sans">Sans-Serif</button>
              <button class="sub-style-btn ${ge.fontFamily==="serif"?"active":""}" data-sub-key="fontFamily" data-sub-val="serif">Serif</button>
              <button class="sub-style-btn ${ge.fontFamily==="mono"?"active":""}" data-sub-key="fontFamily" data-sub-val="mono">Monospace</button>
            </div>
          </div>

          <!-- 4. Arka Plan Opaklığı -->
          <div>
            <div class="sub-style-group-label">Arka Plan Opaklığı</div>
            <div class="sub-style-btn-grid" style="grid-template-columns: repeat(3, 1fr);">
              <button class="sub-style-btn ${ge.bg==="trans"?"active":""}" data-sub-key="bg" data-sub-val="trans">Saydam</button>
              <button class="sub-style-btn ${ge.bg==="semi"?"active":""}" data-sub-key="bg" data-sub-val="semi">Yarı Saydam</button>
              <button class="sub-style-btn ${ge.bg==="solid"?"active":""}" data-sub-key="bg" data-sub-val="solid">Katı Siyah</button>
            </div>
          </div>

          <!-- 5. Dikey Konum -->
          <div>
            <div class="sub-style-group-label">Dikey Konum</div>
            <div class="sub-style-btn-grid" style="grid-template-columns: repeat(3, 1fr);">
              <button class="sub-style-btn ${ge.position==="bottom"?"active":""}" data-sub-key="position" data-sub-val="bottom">Alt (Standart)</button>
              <button class="sub-style-btn ${ge.position==="middle"?"active":""}" data-sub-key="position" data-sub-val="middle">Orta</button>
              <button class="sub-style-btn ${ge.position==="top"?"active":""}" data-sub-key="position" data-sub-val="top">Üst</button>
            </div>
          </div>

          <!-- 6. Manuel Yükseklik / Alt Boşluk (Height Adjustment) -->
          <div>
            <div class="sub-style-group-label" style="display:flex;justify-content:space-between;align-items:center;">
              <span>Altyazı Yüksekliği (Alt Mesafe)</span>
              <span id="sub-bottom-offset-display" style="color:#60a5fa;font-weight:600;font-size:0.85rem;">${ge.bottomOffset||25}px</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;margin-top:6px;">
              <button id="btn-sub-offset-dec" class="sub-style-btn" style="padding:4px 10px;font-size:1.1rem;font-weight:bold;line-height:1;min-width:32px;">-</button>
              <input type="range" id="sub-offset-slider" min="0" max="150" step="5" value="${ge.bottomOffset||25}" style="flex:1;accent-color:#3b82f6;cursor:pointer;height:6px;border-radius:3px;">
              <button id="btn-sub-offset-inc" class="sub-style-btn" style="padding:4px 10px;font-size:1.1rem;font-weight:bold;line-height:1;min-width:32px;">+</button>
            </div>
          </div>

          <!-- Sıfırla Butonu -->
          <button id="sub-style-reset-btn" class="sub-style-btn" style="width:100%;margin-top:8px;color:#f87171;border-color:rgba(248,113,113,0.3);background:rgba(239,68,68,0.1);">
            <i data-lucide="rotate-ccw" style="width:13px;height:13px;"></i> Varsayılan Ayarlara Sıfırla
          </button>
        </div>
      `;if(ci("Altyazı Stili & Ayarları",B),we){we.querySelectorAll(".sub-style-btn[data-sub-key]").forEach(fe=>{fe.onclick=et=>{et.stopPropagation();const xt=fe.getAttribute("data-sub-key"),va=fe.getAttribute("data-sub-val");ge[xt]=va;try{localStorage.setItem("cinepulse_subtitle_style",JSON.stringify(ge))}catch{}ba(ge),fe.parentElement.querySelectorAll(".sub-style-btn").forEach(Ei=>Ei.classList.remove("active")),fe.classList.add("active");const Li=we.querySelector("#sub-preview-text");Li&&(Li.style.cssText=g())}});const C=we.querySelector("#sub-offset-slider"),R=we.querySelector("#sub-bottom-offset-display"),Z=we.querySelector("#btn-sub-offset-dec"),te=we.querySelector("#btn-sub-offset-inc"),ce=fe=>{const et=Math.max(0,Math.min(150,parseInt(fe,10)||25));ge.bottomOffset=et,C&&(C.value=et),R&&(R.textContent=`${et}px`);try{localStorage.setItem("cinepulse_subtitle_style",JSON.stringify(ge))}catch{}ba(ge)};C&&(C.oninput=fe=>{fe.stopPropagation(),ce(fe.target.value)}),Z&&(Z.onclick=fe=>{fe.stopPropagation(),ce((ge.bottomOffset||25)-5)}),te&&(te.onclick=fe=>{fe.stopPropagation(),ce((ge.bottomOffset||25)+5)});const De=we.querySelector("#sub-style-reset-btn");De&&(De.onclick=fe=>{fe.stopPropagation(),ge={...rs};try{localStorage.setItem("cinepulse_subtitle_style",JSON.stringify(ge))}catch{}ba(ge),tr(),G("Altyazı stili varsayılana sıfırlandı","info")})}},ir=t.querySelector("#custom-menu-item-speed");ir&&(ir.onclick=g=>{g.stopPropagation(),vo()});const vo=()=>{const g=[.5,.75,1,1.25,1.5,2],B=e.playbackRate||1;let C="";g.forEach(R=>{const Z=B===R;C+=`
          <div class="custom-menu-opt-row ${Z?"active":""}" data-speed="${R}">
            <span>${R===1?"Normal (1x)":`${R}x`}</span>
            ${Z?'<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>':""}
          </div>
        `}),ci("Oynatma hızı",C),we&&we.querySelectorAll("[data-speed]").forEach(R=>{R.onclick=Z=>{Z.stopPropagation();const te=parseFloat(R.getAttribute("data-speed"));e.playbackRate=te,it.speed=te,nt("settings"),G(`Oynatma Hızı: ${te===1?"Normal":`${te}x`}`,"info"),li()}})},ar=t.querySelector("#custom-menu-item-brightness-menu");ar&&(ar.onclick=g=>{g.stopPropagation(),wo()});const wo=()=>{const g=[{label:"%50 (Gece Modu)",val:50},{label:"%75 (Kısık)",val:75},{label:"%100 (Normal)",val:100},{label:"%125 (Canlı)",val:125},{label:"%150 (Maksimum)",val:150}];let B="";g.forEach(C=>{const R=kt===C.val;B+=`
          <div class="custom-menu-opt-row ${R?"active":""}" data-brightness="${C.val}">
            <span>${C.label}</span>
            ${R?'<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>':""}
          </div>
        `}),ci("Parlaklık",B),we&&we.querySelectorAll("[data-brightness]").forEach(C=>{C.onclick=R=>{R.stopPropagation();const Z=parseInt(C.getAttribute("data-brightness"),10);ma(Z),G(`Parlaklık: %${Z}`,"info"),li()}})},sr=t.querySelector("#custom-menu-item-pip");sr&&(sr.onclick=async g=>{g.stopPropagation(),F.classList.add("hidden");try{document.pictureInPictureElement?await document.exitPictureInPicture():e.requestPictureInPicture&&await e.requestPictureInPicture()}catch{G("Pencere içinde pencere desteklenmiyor.","error")}});let ha=null,ya=null,di="Kapalı";const nr=()=>{e.pause(),ni&&(ni.classList.remove("hidden"),ve(ni)),G("🌙 Uyku Modu: Süre doldu, yayın duraklatıldı.","info"),os()},os=()=>{ya&&(e.removeEventListener("ended",ya),ya=null),ha&&($(ha),ha=null),di="Kapalı",da&&(da.textContent=di),si&&(si.style.color="#c084fc")},rr=(g,B)=>{if(os(),di=B,da&&(da.textContent=di),si&&(si.style.color="#a855f7"),g==="end-of-episode"){G("🌙 Uyku Zamanlayıcısı: Bölüm bitince yayın durdurulacak.","info");const R=()=>{e.removeEventListener("ended",R),nr()};ya=R,l(e,"ended",R);return}const C=g*60;G(`🌙 Uyku Zamanlayıcısı: ${B} sonra kapatılacak.`,"success"),ha=b(()=>{nr()},C*1e3)};ni&&(ni.onclick=g=>{g.stopPropagation(),ni.classList.add("hidden"),e.play().catch(()=>{})});const or=()=>{const g=[{label:"Kapalı (İptal Et)",val:0},{label:"15 Dakika",val:15},{label:"30 Dakika",val:30},{label:"45 Dakika",val:45},{label:"60 Dakika (1 Saat)",val:60},{label:"Bölüm Bitince",val:"end-of-episode"}];let B="";g.forEach(C=>{const R=C.val===0&&di==="Kapalı"||di===C.label;B+=`
          <div class="custom-menu-opt-row ${R?"active":""}" data-sleep-val="${C.val}" data-sleep-label="${C.label}">
            <span>${C.label}</span>
            ${R?'<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>':""}
          </div>
        `}),ci("Uyku Zamanlayıcısı",B),we&&we.querySelectorAll("[data-sleep-val]").forEach(C=>{C.onclick=R=>{R.stopPropagation();const Z=C.getAttribute("data-sleep-val"),te=C.getAttribute("data-sleep-label");Z==="0"?(os(),G("Uyku zamanlayıcısı kapatıldı","info")):Z==="end-of-episode"?rr("end-of-episode","Bölüm Bitince"):rr(parseInt(Z,10),te),li()}})};Rn&&(Rn.onclick=g=>{g.stopPropagation(),or()}),si&&(si.onclick=g=>{g.stopPropagation(),F.classList.contains("hidden")?(St(),F.classList.remove("hidden"),or()):St()});const ls=t.querySelector("#gesture-hud-icon-wrap");let lr="",cs=null;const cr=(g,B,C)=>{ss&&(ls&&lr!==g&&(lr=g,ls.innerHTML=`<i data-lucide="${g}" style="width: 24px; height: 24px;"></i>`,ve(ls)),Mn&&(Mn.textContent=B),Un&&(Un.style.height=`${Math.max(0,Math.min(100,C))}%`),ss.classList.remove("hidden"),cs&&$(cs),cs=b(()=>{ss.classList.add("hidden")},700))};let ds=0,dr=0,$t=null,ga=0,us=0;function ur(g,B){try{let C=t.querySelector(`.seek-ripple-${g}`);C||(C=document.createElement("div"),C.className=`custom-seek-ripple seek-ripple-${g}`,C.innerHTML=`
            <div class="seek-ripple-content">
              <i data-lucide="${g==="left"?"rotate-ccw":"rotate-cw"}" style="width: 32px; height: 32px;"></i>
              <span>${Math.abs(B)} saniye</span>
            </div>
          `,t.appendChild(C),ve(C)),C.classList.remove("animating"),C.offsetWidth,C.classList.add("animating"),b(()=>{C.classList.remove("animating")},650)}catch{}}l(t,"touchstart",g=>{if(It||g.touches.length!==1)return;const B=g.target;if(B.closest(".custom-player-controls")||B.closest(".custom-player-menu")||B.closest(".custom-skip-intro-btn")||B.closest(".custom-binge-card")||B.closest(".custom-screen-lock-btn")||B.closest(".custom-screen-unlock-badge")||B.closest(".custom-sleep-curtain"))return;const C=g.touches[0],R=t.getBoundingClientRect(),Z=C.clientX-R.left,te=Date.now();if(te-us<320){us=0,g.preventDefault(),Z<R.width*.4?(ri(-10),ur("left",-10)):Z>R.width*.6?(ri(10),ur("right",10)):pa(),$t=null,We();return}us=te,We(),ds=C.clientX,dr=C.clientY,$t=null},{passive:!1}),l(t,"touchmove",g=>{if(It||g.touches.length!==1)return;const B=g.target;if(B.closest(".custom-player-controls")||B.closest(".custom-player-menu")||B.closest(".custom-skip-intro-btn")||B.closest(".custom-binge-card")||B.closest(".custom-screen-lock-btn")||B.closest(".custom-screen-unlock-badge"))return;const C=g.touches[0],R=C.clientX-ds,Z=dr-C.clientY,te=t.getBoundingClientRect();if(!$t&&Math.abs(Z)>12&&Math.abs(Z)>Math.abs(R)*1.2&&(ds-te.left<te.width*.5?($t="brightness",ga=kt):($t="volume",ga=e.muted?0:e.volume)),$t){g.preventDefault();const De=Z/(te.height*.8);if($t==="brightness"){const fe=Math.max(30,Math.min(150,Math.round(ga+De*100)));ma(fe),cr("sun",`%${fe}`,(fe-30)/120*100)}else if($t==="volume"){const fe=Math.max(0,Math.min(1,ga+De));e.volume=fe,e.muted=!1,Ft(),cr(fe===0?"volume-x":fe<.5?"volume-1":"volume-2",`%${Math.round(fe*100)}`,fe*100)}}},{passive:!1}),l(t,"touchend",()=>{$t=null},{passive:!0}),l(window,"keydown",g=>{It||document.activeElement&&(document.activeElement.tagName==="INPUT"||document.activeElement.tagName==="TEXTAREA")||!w||w.classList.contains("hidden")||(g.code==="ArrowUp"?(g.preventDefault(),e.volume=Math.min(1,e.volume+.1),e.muted=!1,Ft()):g.code==="ArrowDown"&&(g.preventDefault(),e.volume=Math.max(0,e.volume-.1),Ft()))}),ua(),We(),Ft(),Bt(),Xn(),ve(t)}async function Ie(){if(P)return;he();const e=ke,a=document.getElementById("player-iframe-wrapper");if(!a)return;if(me){try{me.destroy()}catch{}me=null}let t=K[de];ea(),a.innerHTML=an(),ve(a),Fs(),Je();const l=document.getElementById("player-popout-btn");l&&(l.href=at(t)||"#");const b=document.getElementById("btn-switch-vip-direct");b&&b.addEventListener("click",()=>{const k=K.findIndex(L=>L&&(L.isDirectVideo||L.isHls||L.streamUrl&&!L.streamUrl.startsWith("magnet:")&&!L.isTorrent));if(k!==-1&&k!==de)de=k,Xe=0,Be(),Ie();else{const L=document.getElementById("tab-dubbed");L&&L.click()}});const $=document.getElementById("btn-switch-subtitled-fallback");$&&$.addEventListener("click",()=>{if(J==="dubbed"){const k=document.getElementById("tab-subtitled");k&&k.click()}else{const k=document.getElementById("tab-dubbed");k&&k.click()}});const z=document.getElementById("btn-retry-discovery");if(z&&z.addEventListener("click",()=>{ts()}),!!(t?.isDirectVideo||t?.isHls||t?.streamUrl&&!t.streamUrl.startsWith("magnet:")&&(t.streamUrl.includes(".m3u8")||t.streamUrl.includes(".txt")||t.streamUrl.includes(".mp4")||t.streamUrl.includes(".mkv")||t.streamUrl.includes(":4000/torrent/")))){if(me){try{me.destroy()}catch{}me=null}if(rt){try{rt.destroy()}catch{}rt=null}const k=document.getElementById("hls-video-player"),L=at(t);if(k&&L){const X=L.includes(".m3u8")||L.includes(".txt")||t.isHls,oe=t?.source==="DS"&&/filmmakinesi/i.test([t?.id,t?.name,t?.displayName,t?.provider].filter(Boolean).join(" ")),Y=t?.source==="DS";if(X&&At.isSupported()){const O=new At({enableWorker:!0,lowLatencyMode:!1,startFragPrefetch:!0,progressive:!0,backBufferLength:30,maxBufferLength:30,maxMaxBufferLength:600,maxBufferSize:314572800,maxBufferHole:.5,highBufferWatchdogPeriod:2,nudgeOffset:.2,nudgeMaxRetry:6,abrEwmaDefaultEstimate:5e6,abrEwmaFastVoD:3,abrBandWidthFactor:.92,fragLoadingTimeOut:oe?8e3:Y?12e3:2e4,manifestLoadingTimeOut:15e3,levelLoadingTimeOut:15e3,fragLoadingMaxRetry:oe?1:Y?3:6,manifestLoadingMaxRetry:4,levelLoadingMaxRetry:4,xhrSetup:Te=>{try{Te.referrerPolicy="no-referrer"}catch{}}});me=O;const ze=()=>{if(Ne>0){const Te=k.duration;if(Te&&isFinite(Te)&&Te>10&&Ne>=Te-15){k.currentTime=0;return}k.currentTime=Ne}};O.loadSource(L),O.attachMedia(k);const F=Ne>0?Ne:0;let pe=!1,Me=F,$e=Date.now();ee.on(k,"timeupdate",()=>{k.currentTime>F+.25&&(pe=!0),Math.abs(k.currentTime-Me)>.1&&(Me=k.currentTime,$e=Date.now())}),oe?(ee.on(k,"seeking",()=>{$e=Date.now()}),ee.setInterval(()=>{if(!(P||e!==ke||me!==O)&&!(k.paused||k.ended||Date.now()-$e<8e3)){try{O.destroy()}catch{}me===O&&(me=null),ct("DS FILMMAKİNESİ akışı durdu")}},2e3)):Y&&(ee.on(k,"seeking",()=>{$e=Date.now()}),ee.setInterval(()=>{if(!(P||e!==ke||me!==O)&&!(k.paused||k.ended||Date.now()-$e<15e3)){if(!pe&&Date.now()-$e>2e4){try{O.destroy()}catch{}me===O&&(me=null),ct("DS akışı oynatmayı başlatamadı");return}if(pe){try{O.destroy()}catch{}me===O&&(me=null),ct("DS akışı durdu")}}},3e3)),t.source==="HDFilmizle"&&ee.setTimeout(()=>{if(!(P||e!==ke||pe)&&k.currentTime<=F+.25){try{O.destroy()}catch{}me===O&&(me=null),ct("HDF akışı oynatmayı başlatamadı")}},18e3),O.on(At.Events.MANIFEST_PARSED,()=>{if(O.audioTracks&&O.audioTracks.length>1){const Ue=O.audioTracks.findIndex(Ee=>/tr|tur|turk/i.test(Ee.name||"")||/tr|tur/i.test(Ee.lang||""));Ue!==-1&&O.audioTrack!==Ue&&(O.audioTrack=Ue)}ze();const Te=k.play();Te!==void 0&&Te.catch(()=>{k.muted=!0,k.play().catch(()=>{})})}),O.on(At.Events.AUDIO_TRACKS_UPDATED,()=>{const Te=document.querySelector("#custom-menu-active-audio");if(Te&&O.audioTracks&&O.audioTracks.length>1){const Ue=O.audioTracks[O.audioTrack];let Ee=Ue?Ue.name||Ue.lang||`Ses ${O.audioTrack+1}`:"Otomatik";/tr|turk/i.test(Ee)?Ee="Türkçe Dublaj":/en|eng|orig/i.test(Ee)&&(Ee="Orijinal (İngilizce)"),Te.textContent=Ee}}),ee.on(k,"loadedmetadata",ze,{once:!0});let we=0,Ge=0;O.on(At.Events.ERROR,(Te,Ue)=>{if(!(P||e!==ke||me!==O)&&Ue.fatal){if(Ue.response&&Ue.response.code>=400){try{O.destroy()}catch{}me=null,ct(`Sunucu Hatası (HTTP ${Ue.response.code})`);return}switch(Ue.type){case At.ErrorTypes.NETWORK_ERROR:if(we++,we>2){try{O.destroy()}catch{}me=null,ct("Ağ Hatası (Bağlantı koptu)")}else O.startLoad();break;case At.ErrorTypes.MEDIA_ERROR:if(Ge++,Ge<=2)O.recoverMediaError();else if(Ge<=4){try{O.swapAudioCodec()}catch{}O.recoverMediaError()}else{try{O.destroy()}catch{}me=null,ct("Medya Çözümleme Hatası")}break;default:try{O.destroy()}catch{}me=null,ct("Oynatma Hatası");break}}})}else if(X&&k.canPlayType("application/vnd.apple.mpegurl")){k.src=L;const O=()=>{if(Ne>0){const F=k.duration;F&&isFinite(F)&&F>10&&Ne>=F-15?k.currentTime=0:k.currentTime=Ne}const ze=k.play();ze!==void 0&&ze.catch(()=>{k.muted=!0,k.play().catch(()=>{})})};ee.on(k,"loadedmetadata",O,{once:!0}),ee.on(k,"canplay",O,{once:!0}),O(),ee.on(k,"error",()=>{P||e!==ke||ct("Yerel HLS oynatıcı hatası")})}else{k.src=L;const O=()=>{if(Ne>0){const F=k.duration;F&&isFinite(F)&&F>10&&Ne>=F-15?k.currentTime=0:k.currentTime=Ne}const ze=k.play();ze!==void 0&&ze.catch(()=>{k.muted=!0,k.play().catch(()=>{})})};ee.on(k,"loadedmetadata",O,{once:!0}),ee.on(k,"canplay",O,{once:!0}),O(),ee.on(k,"error",()=>{P||e!==ke||ct("Video Oynatma Hatası")})}const N=()=>{k&&k.muted&&(k.muted=!1)};ee.on(k,"click",N,{once:!0});const H=document.getElementById("custom-player-controls");H&&ee.on(H,"click",N,{once:!0});const I=document.getElementById("dubbed-audio-source"),ye=document.getElementById("btn-audio-original"),ie=document.getElementById("btn-audio-dubbed");if(I&&t.dubbedAudioUrl){let O=J==="dubbed"?"dubbed":"original",ze=!1;const F=()=>{if(ze||!I||!t.dubbedAudioUrl)return;ze=!0;const $e=t.dubbedAudioUrl;if(($e.includes(".m3u8")||t.dubbedAudioIsHls)&&At.isSupported()){const Ge=new At({enableWorker:!0,lowLatencyMode:!1,backBufferLength:30,maxBufferLength:30,maxMaxBufferLength:60,maxBufferSize:3e7,fragLoadingTimeOut:25e3});rt=Ge,Ge.loadSource($e),Ge.attachMedia(I)}else I.src=$e},pe=($e,we=!1)=>{if(O=$e,k._currentAudioTrack=$e,$e==="dubbed"){if(ie&&ie.classList.add("active"),ye&&ye.classList.remove("active"),!I||t.streamUrl===t.dubbedAudioUrl){k.muted=!1,we||(ea(),G("🇹🇷 Türkçe Dublaj sesi aktif.","success"));return}if(F(),k.muted=!0,I.muted=!1,I.volume=k.volume,k.currentTime>0&&Math.abs(I.currentTime-k.currentTime)>.3)try{I.currentTime=k.currentTime}catch{}k.paused||I.play().catch(()=>{k.muted=!1}),we||(ea(),G("🇹🇷 Türkçe Dublaj sesi aktif edildi.","success"))}else{if(ye&&ye.classList.add("active"),ie&&ie.classList.remove("active"),k.muted=!1,I){I.muted=!0;try{I.pause()}catch{}}we||(ea(),G("🇬🇧 Orijinal ses aktif edildi.","info"))}};k._setAudioTrack=pe,k._currentAudioTrack=O,ye&&(ye.onclick=$e=>{$e.stopPropagation(),pe("original")}),ie&&(ie.onclick=$e=>{$e.stopPropagation(),pe("dubbed")}),pe(J==="dubbed"?"dubbed":"original",!0),ee.on(k,"canplay",()=>{if(O==="dubbed"){if(Math.abs(I.currentTime-k.currentTime)>.3)try{I.currentTime=k.currentTime}catch{}k.paused||I.play().catch(()=>{})}},{once:!0}),ee.on(k,"play",()=>{O==="dubbed"&&(I.currentTime=k.currentTime,I.play().catch(()=>{}))}),ee.on(k,"pause",()=>{O==="dubbed"&&I.pause()}),ee.on(k,"seeking",()=>{O==="dubbed"&&(I.currentTime=k.currentTime)}),ee.on(k,"seeked",()=>{O==="dubbed"&&(I.currentTime=k.currentTime,k.paused||I.play().catch(()=>{}))}),ee.on(k,"waiting",()=>{O==="dubbed"&&I.pause()}),ee.on(k,"playing",()=>{O==="dubbed"&&(Math.abs(I.currentTime-k.currentTime)>.25&&(I.currentTime=k.currentTime),I.play().catch(()=>{}))}),ee.on(k,"volumechange",()=>{O==="dubbed"&&(I.volume=k.volume,I.muted=k.muted)}),ee.on(k,"timeupdate",()=>{O==="dubbed"&&!k.paused&&Math.abs(I.currentTime-k.currentTime)>.3&&(I.currentTime=k.currentTime)})}let le=!1;const Ae=()=>{se||le||P||e!==ke||(le=!0,Kl({contentKey:Ha(),category:J,source:t}))};ee.on(k,"playing",Ae),ee.on(k,"timeupdate",Ae),ee.on(k,"error",()=>{se||Rr({category:J,source:t})}),tn(k,t),yo(k),to(k)}}}function go(e){if(document.getElementById("dubbed-found-banner"))return;const a=document.getElementById("player-iframe-wrapper");if(!a)return;const t=document.createElement("div");t.id="dubbed-found-banner",t.className="dubbed-found-banner",t.innerHTML=`
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
    `,a.appendChild(t),ve(t),document.getElementById("btn-switch-to-new-dubbed")?.addEventListener("click",l=>{l.stopPropagation(),t.remove();const b=document.getElementById("tab-dubbed");b&&b.click()}),document.getElementById("btn-close-dubbed-banner")?.addEventListener("click",l=>{l.stopPropagation(),t.remove()})}let na=!1,es=!1;function ts({isEpisodeSwitch:e=!1}={}){const a=++Q,t=Date.now();let l=0;tt=!0,na=!0,Le=!1,es=!1,Xe=0,Se={dubbed:[],subtitled:[]},K=[],st(),Ie();const b=je(()=>{if(P||a!==Q||Le)return;const $=J==="dubbed"?"subtitled":"dubbed";(Se[J]||[]).length===0&&(Se[$]||[]).length>0&&(J=$,document.getElementById("tab-dubbed")?.classList.toggle("active",J==="dubbed"),document.getElementById("tab-subtitled")?.classList.toggle("active",J==="subtitled"),Le=!0,tt=!1,K=Se[J],de=yt(K),st(),Be(),Ke(),Ie())},1800);Hl({type:i,tmdbId:n,title:ue,seriesTitle:ue,originalTitle:u,season:q,episode:W,onUpdate:({dubbed:$=[],subtitled:z=[],isComplete:S=!1,newStream:k=null,isDubbedStream:L=!1})=>{if(P||a!==Q)return;if(Se={dubbed:Er($,{contentKey:Ha(),category:"dubbed"}),subtitled:Er(z,{contentKey:Ha(),category:"subtitled"})},co(),na=!S,Je(),mt){if(Ws())return;if(!Os()){S&&(tt=!1,st(),Be(),Ga(`${mt.name||"Moderatörün seçtiği kaynak"} bu cihazda bulunamadı`));return}}if(J==="subtitled"&&L&&k&&!es&&Le&&(es=!0,go(k)),!Le){if(Se[J]?.length>0){A(b),Le=!0,tt=!1,K=Se[J],de=yt(K),st(),Be(),Ke(),Ie();return}const Y=Date.now()-t,N=J==="dubbed"?"subtitled":"dubbed",H=Se[N]||[];if((S||Y>=1800)&&H.length>0){A(b),J=N,document.getElementById("tab-dubbed")?.classList.toggle("active",J==="dubbed"),document.getElementById("tab-subtitled")?.classList.toggle("active",J==="subtitled"),Le=!0,tt=!1,K=H,de=yt(K),st(),Be(),Ke(),Ie();return}if(S){A(b),tt=!1,st(),Be(),Ke(),Ie();return}}const X=K[de];if(K=Se[J]||[],X&&Le){const Y=K.findIndex(N=>N.id&&N.id===X.id||N.url&&N.url===X.url);Y!==-1&&(de=Y)}if(!Le&&K.length>0){Le=!0,tt=!1,de=yt(K),st(),Be(),Ke(),Ie();return}if(!!(document.querySelector(".player-error-view")||document.querySelector(".player-loading-overlay"))&&K.length>0){const Y=K.findIndex(N=>!N.failed);if(Y!==-1&&(Y!==de||K[de]?.failed)){de=Y,Xe=0,st(),Be(),Ke(),Ie();return}}l||(l=requestAnimationFrame(()=>{l=0,!(P||a!==Q)&&(Be(),Ke(),fo())}))}})}D?(Se={dubbed:[{source:"OFFLINE",name:"Cihaza indirilen",displayName:"Cihaza indirilen",streamUrl:D,isDirectVideo:M!=="hls",isHls:M==="hls"}],subtitled:[]},K=Se.dubbed,de=0,tt=!1,Le=!0,st(),Ie()):ts(),i==="tv"&&!se&&Nt(),Us();async function Ht(e,a){if(!se&&!Pa&&!(f&&!Gt&&!Ct())){Pa=!0;try{he(),q=e,W=a,aa(),f?.roomCode&&window.dispatchEvent(new CustomEvent("cinepulse:player-sync",{detail:{roomCode:f.roomCode,mediaId:f.mediaId,type:f.type,season:q,episode:W,action:"episode",source:Qi(),audioTrack:w.querySelector("#hls-video-player")?._currentAudioTrack||null,time:0,playing:!0,issuedAt:Date.now()}}));const t=document.getElementById("player-modal-title");t&&(t.textContent=ti());const l=document.getElementById("player-resume-time-badge");l&&l.remove();const b=document.getElementById("player-iframe-wrapper");b&&(b.innerHTML=`
          <div class="player-loading-overlay">
            <div class="player-loader-core">
              <div class="player-loader-spinner"></div>
              <i data-lucide="play" class="player-loader-icon"></i>
            </div>
            <div class="player-loader-text">
              <h3>${ue}</h3>
              <p class="player-loader-sub">Sezon ${q} • Bölüm ${W} Yükleniyor...</p>
              <p class="player-loader-hint">Yeni bölüm akış hatları taranıyor...</p>
            </div>
          </div>
        `,ve(w));const $=br(n,q,W);Ne=$?$.currentTime:0,He=ui(n,q,W),pt=Ne,Na=0,ts({isEpisodeSwitch:!0}),qa(He),nn(),re&&(Vs(),Nt(),Gs(e,a),ho()),Us(),ve(w)}catch{G("Bölüm değiştirilirken bir sorun oluştu.","error")}finally{Pa=!1}}}const ra=document.getElementById("tab-dubbed"),oa=document.getElementById("tab-subtitled");ra&&ra.addEventListener("click",e=>{if(e.preventDefault(),e.stopPropagation(),J!=="dubbed"&&Ct()){J="dubbed",Xe=0;try{localStorage.setItem("cp_preferred_category","dubbed")}catch{}oa.classList.remove("active"),ra.classList.add("active"),he(),K=Se.dubbed||[],de=yt(K),Le=K.length>0,st(),Be(),Ke(),Ie(),G("🇹🇷 Türkçe Dublaj sunucularına geçildi.","info")}}),oa&&oa.addEventListener("click",e=>{if(e.preventDefault(),e.stopPropagation(),J!=="subtitled"&&Ct()){J="subtitled",Xe=0;try{localStorage.setItem("cp_preferred_category","subtitled")}catch{}ra.classList.remove("active"),oa.classList.add("active"),he(),K=Se.subtitled||[],de=yt(K),Le=K.length>0,st(),Be(),Ke(),Ie(),G("💬 Türkçe Altyazılı VIP sunucularına geçildi.","info")}});const gn=document.getElementById("btn-open-sources-drawer"),vn=document.getElementById("btn-close-sources-popover"),wn=document.getElementById("sources-popover-backdrop");gn&&gn.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),wt()}),vn&&vn.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),wt(!1)}),wn&&wn.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),wt(!1)});const kn=w.querySelector("#btn-player-download");kn&&kn.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),lo()});const Sn=w.querySelector("#btn-close-download-popover"),$n=w.querySelector("#download-popover-backdrop");Sn&&Sn.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),w.querySelector("#player-download-popover")?.classList.add("hidden")}),$n&&$n.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),w.querySelector("#player-download-popover")?.classList.add("hidden")});const zi=document.getElementById("btn-player-theater");zi&&zi.addEventListener("click",()=>{const e=document.getElementById("cinema-modal-box");if(e){e.classList.toggle("theater-mode"),zi.classList.toggle("active");const a=e.classList.contains("theater-mode"),t=zi.querySelector("span"),l=zi.querySelector("[data-lucide]");if(t&&(t.textContent=a?"Genişletildi":"Sinema"),l&&l.setAttribute("data-lucide",a?"minimize-2":"tv"),ve(w),a){const b=document.querySelector(".player-stage-wrapper");b&&b.scrollIntoView({behavior:"smooth",block:"start"})}G(a?"🎥 Sinema Modu (Genişletilmiş Sahne) Aktif Edildi.":"Normal Görünüme Dönüldü.","info")}});const la=document.getElementById("btn-player-reco-toggle"),xn=document.getElementById("player-reco-panel");la&&xn&&la.addEventListener("click",()=>{const e=xn.classList.toggle("is-open");la.classList.toggle("is-open",e);const a=la.querySelector("span");re?a&&(a.textContent=e?"Benzer Yapımlar & Öneriler (Kapat)":"Benzer Yapımlar & Öneriler"):a&&(a.textContent=e?"Film Detayları & Öneriler (Kapat)":"Film Detayları & Öneriler")});const is=document.getElementById("dizisol-overview");is&&is.addEventListener("click",()=>{is.classList.toggle("expanded")});const An=document.getElementById("btn-report-issue");An&&An.addEventListener("click",()=>{const e=K[de];G(`✅ Bildirim alındı: ${e?.name||"Yayın"} için sistem hata kaydı oluşturuldu. Sıradaki kaynağa geçiliyor...`,"success"),ct("Kullanıcı hata bildirdi")}),w.querySelectorAll("[data-watch-state]").forEach(e=>{e.addEventListener("click",()=>{e.getAttribute("data-watch-state")==="toggle"?Qa():(Tt(pt,lt,!1,!0),G("Daha sonra izlemek için listenize kaydedildi.","success")),e.closest("details")?.removeAttribute("open")})}),w.querySelector("#btn-player-share")?.addEventListener("click",async()=>{const e={title:ue,text:`${ue} CinePulse'ta izleniyor.`,url:window.location.href};try{navigator.share?await navigator.share(e):(await navigator.clipboard?.writeText(window.location.href),G("Bağlantı kopyalandı.","success"))}catch{}});const zn=document.getElementById("player-close-btn"),Di=()=>{if(P)return;if(P=!0,Q++,w.querySelector("#hls-video-player")||Tt(pt,lt,null,!0),he(),be.dispose(),Ca=null,document.title=eo,Ce(Ia),window.removeEventListener("pagehide",Yi),window.removeEventListener("beforeunload",Yi),me){try{me.destroy()}catch{}me=null}if(rt){try{rt.destroy()}catch{}rt=null}gr(),fi&&(window.open=fi,fi=null);try{w.querySelectorAll("video, audio").forEach(t=>{try{t.pause(),t.removeAttribute("src"),t.load()}catch{}})}catch{}w.querySelectorAll("iframe").forEach(a=>{try{a.src="about:blank",a.remove()}catch{}}),w.classList.add("hidden"),w.classList.remove("player-offline-playback"),w.innerHTML="",document.body.style.overflow="",document.removeEventListener("keydown",Dn)};Ca=Di,zn&&zn.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),Di()}),w.onclick=e=>{e.target===w&&Di()};const Dn=e=>{if(!(document.activeElement?.isContentEditable||["input","textarea","select"].includes(document.activeElement?.tagName?.toLowerCase()))&&!(document.activeElement?.tagName==="BUTTON"&&(e.code==="Space"||e.key==="Enter"))&&!(w.querySelector(".is-screen-locked")&&e.key!=="Escape")){if(f&&!Ve()&&!["Escape","f","F","m","M"].includes(e.key)){e.preventDefault();return}if(e.key==="Escape")vi?wt(!1):Dt?sa(!1):ut?Ai(!1):Di();else if(e.key==="f"||e.key==="F"){e.preventDefault();const a=document.getElementById("cinema-modal-box")||document.documentElement;document.fullscreenElement?document.exitFullscreen().catch(()=>{}):a.requestFullscreen().catch(()=>{})}else if(e.key==="e"||e.key==="E"||e.key==="b"||e.key==="B")re&&(e.preventDefault(),Ai());else if(e.key==="?"||e.key==="/")e.preventDefault(),sa();else if(e.key==="n"||e.key==="N"){const a=document.getElementById("btn-next-episode");a&&a.click()}else if(e.key==="p"||e.key==="P"){const a=document.getElementById("btn-prev-episode");a&&a.click()}else if(e.code==="Space"||e.key==="k"||e.key==="K"){const a=document.getElementById("hls-video-player");a&&(e.preventDefault(),a.paused?a.play().catch(()=>{}):a.pause())}else if(e.key==="ArrowRight"){const a=document.getElementById("hls-video-player");a&&(e.preventDefault(),a.currentTime=Math.min(a.duration||99999,a.currentTime+10))}else if(e.key==="ArrowLeft"){const a=document.getElementById("hls-video-player");a&&(e.preventDefault(),a.currentTime=Math.max(0,a.currentTime-10))}else if(e.key==="m"||e.key==="M"){const a=document.getElementById("hls-video-player");a&&(e.preventDefault(),a.muted=!a.muted,G(a.muted?"🔇 Ses kapatıldı":"🔊 Ses açıldı","info"))}}};document.addEventListener("keydown",Dn)}export{$s as openPlayerModal};
