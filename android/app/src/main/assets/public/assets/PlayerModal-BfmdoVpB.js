import{e as ua,i as qe,a as Xe,f as qr,b as Pn,c as Nr,d as Hr,r as qn,g as Nn,h as Zt,s as ee,j as de,k as Qi,l as jr,m as Hn,n as Wr,o as Oa,p as Fa,t as Or,q as Fr,u as Kr,v as jn,w as Vr,x as Yr,y as Xr,z as Gr,A as Zr,B as Jr,C as Qr,D as Wn}from"./index-DB_My51g.js";import{Hls as ut}from"./hls-BuERnqCp.js";const eo="https://wild-credit-e1ae.cagatayca07.workers.dev";function to(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-"):""}async function Ka(i,s={}){if(typeof window<"u")try{const r=new URL(i),n=await fetch(Xe(`/api/szd${r.pathname}${r.search}`),{...s,headers:{...s.headers||{},"X-Requested-With":"XMLHttpRequest"},signal:AbortSignal.timeout(6e3)}).catch(()=>null);if(n&&n.ok)return n}catch{}try{const r=`${eo}?url=${encodeURIComponent(i)}`,n=await fetch(r,{...s,signal:AbortSignal.timeout(4e3)}).catch(()=>null);if(n&&n.ok)return n}catch{}try{const r=await fetch(i,{...s,headers:{...s.headers||{},"X-Requested-With":"XMLHttpRequest",Referer:"https://sezonlukdizi.cc/","User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"},signal:AbortSignal.timeout(4e3)}).catch(()=>null);if(r&&r.ok)return r}catch{}return null}async function ea({titles:i=[],seriesTitle:s="",originalTitle:d="",season:r=1,episode:n=1,isDub:l=!0}){const u=[...new Set([...i,s,d])].filter(g=>g&&typeof g=="string"&&g.trim().length>1);if(u.length===0)return[];const c=[];for(const g of u){const v=to(g);if(v&&!c.includes(v)&&(c.push(v),v.endsWith("-izle")||c.push(`${v}-izle`),v.startsWith("the-"))){const m=v.replace(/^the-/,"");c.includes(m)||c.push(m)}}const p="https://sezonlukdizi.cc";for(const g of c)try{const v=`${p}/${g}/${r}-sezon-${n}-bolum.html`,m=await Ka(v);if(!m)continue;const $=await m.text(),D=ua($);if(!qe(D,u))continue;const y=$.match(/data-id=["'](\d+)["']/i)||$.match(/var\s+bid\s*=\s*["']?(\d+)["']?/i)||$.match(/bid\s*=\s*(\d+)/i),C=y?y[1]:null;if(!C)continue;const N=l?"0":"1",B=`${p}/ajax/dataAlternatif22.asp`,q=await Ka(B,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},body:`bid=${C}&dil=${N}`});if(!q)continue;const L=await q.json().catch(()=>null);if(!L||L.status!=="success"||!Array.isArray(L.data)||L.data.length===0)continue;const U=[],f=await Promise.all(L.data.map(async w=>{const F=`${p}/ajax/dataEmbed22.asp`,se=await Ka(F,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},body:`id=${w.id}`});if(!se)return null;const R=(await se.text().catch(()=>"")).match(/src=["']([^"']+)["']/i);let V=R?R[1]:null;if(V&&!V.includes("reCAPTCHA")&&V.length>10){if(w.baslik?.toLowerCase().includes("filemoon")||w.baslik?.toLowerCase().includes("videosoft")||V.includes("bysejikuar")||V.includes("filemoon")||V.includes("videoseyred"))return null;V.startsWith("//")&&(V="https:"+V);const ge=w.baslik==="VidMoly"||V.includes("vidmoly"),pe=V,Ae=ge?"VidMoly 1080p":`${w.baslik} HD`;return{id:`szd_${w.id}`,name:Ae,displayName:Ae,badge:`⚡ ${w.baslik}`,category:l?"dubbed":"subtitled",url:pe,streamUrl:pe,isHls:!1,isDirectVideo:!1,getUrl:()=>pe}}return null}));if(U.push(...f.filter(Boolean)),U.length>0)return U}catch{}return[]}const io="https://ydfvfdizipanel.ru/public/api",$i="EuXs1Y5oXTrDpGte3E2dNDIu82LLjaoCd6om",ao={hash256:"f4d4bc98a3fc4600e7f2c2bab7533f1f03d8a70ff03c256bb11dc57050536bd0",signature:"308202c3308201aba0030201020204075cec01300d06092a864886f70d01010b050030123110300e0603550403130753696e65776978301e170d3231303932313233333334395a170d3436303931353233333334395a30123110300e0603550403130753696e6577697830820122300d06092a864886f70d01010105000382010f003082010a0282010100b0a2a1bc5c3f16f19c3b2456cfd0a6128ced9f5e2e2c4cca1a100e17b07b86256258f372e76a95a17e9e4a1c048e364835723a95e8ef6d5bdfb5694b50277c65a64f7b012fdf164e5dc93629561f6ca29b7dc82ebb3d6f3c8e8fc6795847fe331ad4a13ed6c059a83804c43d3747526d769580f3a4153752eb22dac66dd15f1582caa43305dc49f55ac7b1b89013e654d2ca8c94c30956659674cc673256c04208f09118bae14cdd72d78f9ee2aece958084a8c2e315deff45726d4fc1f18ec39569ff1abe4f36a8d01090e5f68c07c28763513b88208bcac1a6e1941f6fd8bfdd52f832098ddb2154c8f565bc5d58c7106a19e03787e75c7f34997000e3bcf30203010001a321301f301d0603551d0e04160414b545fc18e74a791d9402b53940ae38b96e9e209c300d06092a864886f70d01010b05000382010100a8a64d9e7c8b5db102af15d3caf94ff8d3e9be9008bb0021117ca2f0762e68583354b126a041bb1fb6e6308e421e4b5a71f779cde63e5d2fc5976bff966c3c4034e852c077d8e74458fbae2ec1db74b1f4082e188bf8ef7c42a44e3fbfb693bb00ee2a727096b42360ddce1bdcd3536f50c8693bcc62a7b7204bcefe2ecf1f7c820bcd63e1d7a6acc8bf6163086915fc5f607cf51bc7a8635f98bb4c65a8f24b7b5a82c7b06868f565cb0d6ac4775c4aac777536ddd1a565f990fd8cbe539185fa7aab610b7855a687a00f4e55536d72873444552c50fd10727dbf298a9be6ed6ae62148dd1de365f3729915dd31975e28a472d752ac14db3db548405cc31e1e",packagename:"com.sinewix","User-Agent":"EasyPlex (Android 14; SM-A546B; Samsung Galaxy A54 5G; tr)",Accept:"application/json"},so="https://wild-credit-e1ae.cagatayca07.workers.dev";function no(i,s,d=null,r=null){return qe(s,[i])?d&&r?Math.abs(parseInt(d,10)-parseInt(r,10))<=1:!0:!1}async function Si(i){const s=i.startsWith("/")?i:`/${i}`,d=`${io}${s}`,r=n=>!!(n&&(n.search||n.videos||n.seasons||n.data||n.title||n.id||Array.isArray(n)));try{const n=`${so}?url=${encodeURIComponent(d)}`,l=await fetch(n,{signal:AbortSignal.timeout(6e3)}).catch(()=>null);if(l&&l.ok){const u=await l.json().catch(()=>null);if(r(u))return u}}catch{}try{const n=Xe(`/api/snx?path=${encodeURIComponent(s)}`),l=await fetch(n,{signal:AbortSignal.timeout(6e3)}).catch(()=>null);if(l&&l.ok){const u=await l.json().catch(()=>null);if(r(u))return u}}catch{}try{const n=await fetch(d,{headers:ao,signal:AbortSignal.timeout(6e3)}).catch(()=>null);if(n&&n.ok){const l=await n.json().catch(()=>null);if(r(l))return l}}catch{}return null}async function ro({type:i="tv",titles:s=[],seriesTitle:d="",title:r="",originalTitle:n="",year:l=null,season:u=1,episode:c=1,isDub:p=!0,imdbId:g=""}){const v=i==="movie";try{const m=[...Array.isArray(s)?s:[],d,r,n].filter(Boolean),$=[...new Set(m.map(L=>L.replace(/\s*\(\d{4}\).*/,"").trim()).filter(Boolean))];if($.length===0)return[];let D=null,y=null;if(!v&&g){const L=await Si(`/search/episode-${Number(c)}/imdbid-${encodeURIComponent(g)}/season-${Number(u)}/${$i}`);L&&(L.videos||L.streams||L.seasons||L.data)&&(y=L)}for(const L of $){const U=await Si(`/search/${encodeURIComponent(L)}/${$i}`),f=U?.search||U?.data||[];if(!Array.isArray(f)||f.length===0)continue;const w=f.filter(K=>v?K.type==="movie"||K.type==="film":K.type==="serie"||K.type==="series"||K.type==="tv"||K.type==="anime"),se=(w.length>0?w:f).find(K=>{const R=[K.title,K.name,K.original_name,K.original_title].filter(Boolean),V=(K.release_date||K.first_air_date||"").substring(0,4);return $.some(ge=>R.some(pe=>no(ge,pe,l,V)))});if(se){D=se;break}}if(!D&&!y)return[];const C=D?.id,N=D?.type==="anime";let B=[];if(y&&(B=y.videos||y.streams||y.data||[],!Array.isArray(B)&&typeof B=="object"&&(B=Object.values(B))),!y)if(v)B=(await Si(`/media/detail/${C}/${$i}`))?.videos||[];else if(N){const L=await Si(`/animes/show/${C}/${$i}`);if(L?.seasons&&Array.isArray(L.seasons)){const U=L.seasons.find(f=>f.season_number===Number(u));if(U?.episodes&&Array.isArray(U.episodes)){const f=U.episodes.find(w=>w.episode_number===Number(c));B=f?f.videos||[]:[]}}}else{const L=await Si(`/series/show/${C}/${$i}`);if(L?.seasons&&Array.isArray(L.seasons)){const U=L.seasons.find(f=>f.season_number===Number(u));if(U?.episodes&&Array.isArray(U.episodes)){const f=U.episodes.find(w=>w.episode_number===Number(c));B=f?f.videos||[]:[]}}}const q=[];for(const L of B){const U=(L.link||L.url||"").trim();if(!U)continue;const f=U.toLowerCase();if(f.includes("mediafire.com")||f.includes("mega.nz")||f.includes("pichive")||f.includes("turbobit")||f.includes("yadi.sk"))continue;const w=f.includes("trsub")||f.includes(".sub.")||f.includes("altyazi")||L.lang&&L.lang.toLowerCase().includes("sub"),F=f.includes("dual")||f.includes("trdub")||L.lang&&(L.lang.toLowerCase().includes("dual")||L.lang.toLowerCase().includes("tr")),se=typeof p=="boolean";if(se&&p&&w&&!F||se&&!p&&!w&&!F&&f.includes("dub"))continue;const K=f.includes(".mkv"),R=f.includes(".mp4")||f.includes(".webm")||K,V=f.includes(".m3u8"),ge=U.startsWith("http")?V?Xe(`/api/hls_proxy?url=${encodeURIComponent(U)}`):K?Xe(`/api/mkv_stream?url=${encodeURIComponent(U)}&ref=${encodeURIComponent("https://ydfvfdizipanel.ru/")}`):R?Xe(`/api/proxy?url=${encodeURIComponent(U)}&ref=${encodeURIComponent("https://ydfvfdizipanel.ru/")}`):U:U,pe=R?K?"SWX 1080p (MKV)":"SWX 1080p Direct":"SWX VIP 1080p",Ae=w?"💬 TR Altyazı 1080p":F?"⚡ SWX Dual 1080p":"⚡ SWX 1080p";q.push({id:`snx_${L.id||Math.random().toString(36).substring(7)}`,name:pe,displayName:pe,badge:Ae,category:w?"subtitled":F?"dubbed":p===!1?"subtitled":"dubbed",streamUrl:ge,url:ge,originalEmbedUrl:U,isHls:V,isDirectVideo:!0,isMkv:K,source:"SWX",getUrl:()=>ge})}return q}catch{return[]}}const On="https://wild-credit-e1ae.cagatayca07.workers.dev";function Fn(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^\w\s-]/g," ").replace(/\s+/g," ").trim():""}async function Kn({titles:i=[],seriesTitle:s="",title:d="",originalTitle:r="",season:n=1,episode:l=1,isDub:u=!1}){const c=[...new Set([r,s,d,...i])].filter($=>$&&typeof $=="string"&&$.trim().length>1);if(c.length===0)return[];const p=[],g=new Set;for(const $ of c)try{const D=Fn($);if(!D||D.length<2)continue;const y=`https://animecix.net/secure/search/${encodeURIComponent(D)}`,C=await fetch(`${On}?url=${encodeURIComponent(y)}`,{signal:AbortSignal.timeout(3500)});if(!C.ok)continue;const N=await C.json();if(!N.results||!Array.isArray(N.results))continue;for(const B of N.results)if(B&&B.id&&!g.has(B.id)){const q=Fn(B.name||B.name_english||B.name_romanji||B.original_title||"");qe(q,c)&&(g.add(B.id),p.push(B))}if(p.length>=5)break}catch{}if(p.length===0)return[];const v=[],m=new Set;for(const $ of p.slice(0,4))try{const D=`https://animecix.net/secure/episode-videos?titleId=${$.id}&season=${n}&episode=${l}`,y=await fetch(`${On}?url=${encodeURIComponent(D)}`,{signal:AbortSignal.timeout(4e3)});if(!y.ok)continue;const C=await y.json();if(!Array.isArray(C)||C.length===0)continue;const N=[];for(const B of C){if(!B||!B.url||typeof B.url!="string")continue;const q=B.url.trim();if(m.has(q)||q.length<5)continue;m.add(q);const U=(B.name||"VIP").replace(/animecix/gi,"AX"),f=B.extra?` • ${B.extra}`:"",w=(U+" "+(B.extra||"")).toLowerCase().includes("dublaj");u&&!w||N.push({id:`acx_${$.id}_${B.id||v.length}_${u?"dub":"sub"}`,name:`AX - ${U} (${u?"1080p TR Dublaj":"1080p Altyazılı"})${f}`,displayName:`AX - ${U} (${u?"1080p TR Dublaj":"1080p Altyazılı"})`,badge:u?"🎌 Dublaj":`🎌 ${U}`,category:u?"dubbed":"subtitled",providerName:U,streamUrl:q,url:q,getUrl:()=>q})}if(N.sort((B,q)=>{const L=U=>{const f=(U.providerName+" "+U.streamUrl).toLowerCase();return f.includes("tau")?1:f.includes("sibnet")?2:f.includes("vidmoly")?3:f.includes("ok.ru")?4:f.includes("mail.ru")?5:f.includes("dood")?6:7};return L(B)-L(q)}),v.push(...N),v.length>=6)break}catch{}return v}const oo="https://wild-credit-e1ae.cagatayca07.workers.dev";function lo(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-"):""}async function co({titles:i=[],seriesTitle:s="",title:d="",originalTitle:r="",season:n=1,episode:l=1,isDub:u=!1}){const c=[...new Set([...i,s,d,r])].filter(g=>g&&typeof g=="string"&&g.trim().length>1);if(c.length===0)return[];const p=[...new Set(c.map(g=>lo(g)).filter(Boolean))];for(const g of p){if(!g)continue;const v=u?[`https://animetr.co/izle/${g}-turkce-dublaj/bolum-${l}`,`https://animetr.co/izle/${g}-dublaj/bolum-${l}`,`https://animetr.co/izle/${g}/bolum-${l}`]:[`https://animetr.co/izle/${g}/bolum-${l}`,`https://animetr.co/izle/${g}-altyazili/bolum-${l}`];for(const m of v)try{const $=`${oo}?url=${encodeURIComponent(m)}`,D=await fetch($,{signal:AbortSignal.timeout(3500)}).catch(()=>null);if(!D||!D.ok)continue;const y=await D.text();if(y.includes("Sayfa Bulunamadı")||y.includes("404"))continue;if(u&&!m.includes("dublaj")){const w=y.toLowerCase();if(!w.includes("dublaj")&&!w.includes("türkçe dublaj"))continue}const C=[...y.matchAll(/"embed_url":"([^"]+)","provider":"([^"]+)"/gi)],N=[...y.matchAll(/<iframe[^>]+src="([^"]+)"/gi)].map(w=>w[1]),B=[],q=new Set;for(const w of C){const F=w[1].replace(/\\/g,""),se=w[2]||"AnimeTR";F&&!q.has(F)&&!F.includes("recaptcha")&&!F.includes("filemoon")&&!F.includes("bysejikuar")&&!F.includes("media.cm")&&!F.includes("vidoza")&&!F.includes("voe")&&!F.includes("cloudvideo")&&(q.add(F),B.push({provider:se,url:F}))}for(const w of N)if(w&&!q.has(w)&&!w.includes("recaptcha")&&!w.includes("filemoon")&&!w.includes("bysejikuar")&&!w.includes("media.cm")&&!w.includes("vidoza")&&!w.includes("voe")&&!w.includes("cloudvideo")){q.add(w);let F="Player";w.includes("vidmoly")?F="Vidmoly":w.includes("ok.ru")?F="OK.ru":w.includes("sibnet")?F="Sibnet":w.includes("drive.google")&&(F="Google Drive"),B.push({provider:F,url:w})}if(B.length===0)continue;const L=(w,F)=>{const se=(w+" "+F).toLowerCase();return se.includes("vidmoly")?1:se.includes("ok.ru")||se.includes("odnoklassniki")?2:se.includes("vidoza")?3:se.includes("sibnet")?4:se.includes("voe")?5:se.includes("cloudvideo")?6:se.includes("drive.google")?7:8};B.sort((w,F)=>L(w.provider,w.url)-L(F.provider,F.url));const U=new Set,f=[];for(const w of B){const F=w.provider.toLowerCase();U.has(F)||(U.add(F),f.push({id:`antr_${F}_${l}_${u?"dub":"sub"}_${f.length}`,name:`AnimeTR - ${w.provider} (${u?"1080p TR Dublaj":"1080p Altyazılı"})`,badge:u?"🎌 Dublaj":`🎌 ${w.provider}`,category:u?"dubbed":"subtitled",streamUrl:w.url,url:w.url,getUrl:()=>w.url}))}if(f.length>0)return f.slice(0,6)}catch{}}return[]}const uo="https://dizisol.com/api";async function po(i,s={}){const d=typeof window<"u",r=i.startsWith("/")?i:`/${i}`,n=`${uo}${r}`,l=s.timeout||3500,u=async()=>{const p=await fetch(n,{...s,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Accept:"application/json, text/plain, */*",...s.headers||{}},signal:AbortSignal.timeout(l)});if(p&&p.ok)return p;throw new Error("Direct fetch failed")},c=async()=>{if(!d)throw new Error("No proxy needed");const p=`/api/dzs${r}`,g=await fetch(p,{...s,signal:AbortSignal.timeout(l)});if(g&&g.ok)return g;throw new Error("Proxy fetch failed")};if(d)try{return await Promise.any([c(),u()])}catch{return null}try{return await u()}catch{return null}}const Va=new Map;async function cs(i,s={}){const d=i.startsWith("/")?i:`/${i}`,r=Date.now(),n=Va.get(d);if(n){if(n.data&&r-n.timestamp<12e4)return n.data;if(n.promise)return n.promise}const l=(async()=>{const u=await po(d,s);if(!u)return null;const c=await u.json().catch(()=>null);return c&&Va.set(d,{data:c,timestamp:Date.now()}),c})();return Va.set(d,{promise:l,timestamp:r}),l}async function ar(i){if(!i||typeof i!="string"||i.trim().length<2)return[];try{const s=await cs(`/movies/search?q=${encodeURIComponent(i.trim())}`,{timeout:3500});return Array.isArray(s)?s:[]}catch{return[]}}function sr(i){if(!i||typeof i!="string")return"";const s=typeof window<"u",d=i.startsWith("/api/")?`https://dizisol.com${i}`:i;return s?`/api/hls_proxy?url=${encodeURIComponent(d)}&ref=${encodeURIComponent("https://dizisol.com/")}`:d}function $t(i){return!i||typeof i!="string"?"":typeof window<"u"&&i.includes("dizisol.com")?`/api/hls_proxy?url=${encodeURIComponent(i)}&ref=${encodeURIComponent("https://dizisol.com/")}`:i}function la(i){return!(!i||typeof i!="string"||!i.startsWith("/api/")&&!i.startsWith("http://")&&!i.startsWith("https://")||i.includes("picturebox.cloud")||i.includes("setfilmizle::")||i.startsWith("setfilmizle:"))}function ca(i,s=""){let d=10;const r=(i||"").toLowerCase(),n=(s||"").toLowerCase();return n==="vip"?d+=105:n==="cortina"?d+=100:n==="vidmixi"?d+=95:n==="rapidrame"?d+=90:n==="hdfilmdelisi"?d+=85:n==="pal-vds"||n==="dizipal-vds"?d+=80:n==="vidrame"?d+=75:n==="dosyaload"?d+=72:n==="imagestoo"?d+=70:n==="diziyou"?d+=68:n==="fullhd"?d+=65:n==="filmekseni"?d+=60:n==="videoplays"?d+=55:n==="canlidizi"?d+=50:n==="draktar"?d+=45:n==="filmmakinesi"?d+=15:d+=40,r.includes("dizisol.com")&&(d+=10),d}async function Vn({titles:i=[],title:s="",originalTitle:d="",tmdbId:r=null,isDub:n=!0}){try{let l=r?Number(r):null;if(!l){const m=[...new Set([...i,s,d])].filter($=>$&&$.trim().length>1);for(const $ of m){const y=(await ar($)).find(C=>C.type==="movie");if(y&&y.tmdbId){l=Number(y.tmdbId);break}}}if(!l)return[];const u=await cs(`/movies/by-tmdb/${l}`,{timeout:4e3});if(!u)return[];const c=[];u.subtitleTr&&c.push({label:"Türkçe",src:$t(u.subtitleTr)}),u.subtitleEn&&c.push({label:"İngilizce",src:$t(u.subtitleEn)});const p=[],g=new Set;if(la(u.m3u8Url)&&(g.add(u.m3u8Url),p.push({url:u.m3u8Url,provider:"VIP",isPrimary:!0,priority:ca(u.m3u8Url,"VIP")})),Array.isArray(u.sources))for(const m of u.sources)!m||!la(m.m3u8Url)||g.has(m.m3u8Url)||(g.add(m.m3u8Url),p.push({url:m.m3u8Url,provider:(m.provider||"VIP").toUpperCase(),id:m.id,subtitleTr:m.subtitleTr,subtitleEn:m.subtitleEn,isPrimary:!1,priority:ca(m.m3u8Url,m.provider)}));return p.sort((m,$)=>$.priority-m.priority),p.map((m,$)=>{const D=sr(m.url),y=[];return m.subtitleTr&&y.push({label:"Türkçe",src:$t(m.subtitleTr)}),m.subtitleEn&&y.push({label:"İngilizce",src:$t(m.subtitleEn)}),{id:`dzs_mov_${l}_${m.id||m.provider||$}`,name:$===0?"DS 1080p (HLS)":`DS ${m.provider} 1080p`,displayName:$===0?"DS 1080p (HLS)":`DS ${m.provider} 1080p`,badge:n?"⚡ TR Dublaj":"💬 TR Altyazı",source:"DS",url:D,streamUrl:D,originalEmbedUrl:m.url,quality:"1080p",isHls:!0,isDirectVideo:!0,type:"hls",subtitles:y.length>0?y:c,isDub:n,getUrl:()=>D}})}catch{return[]}}async function ts({titles:i=[],seriesTitle:s="",originalTitle:d="",season:r=1,episode:n=1,tmdbId:l=null,isDub:u=!0}){try{let c=l?Number(l):null;if(!c){const y=[...new Set([...i,s,d])].filter(C=>C&&C.trim().length>1);for(const C of y){const B=(await ar(C)).find(q=>q.type==="tv");if(B&&B.tmdbId){c=Number(B.tmdbId);break}}}if(!c)return[];const p=await cs(`/movies/by-tmdb/${c}/episodes`,{timeout:4500});if(!Array.isArray(p)||p.length===0)return[];const g=p.find(y=>Number(y.season)===Number(r)&&Number(y.episode)===Number(n));if(!g)return[];const v=[];g.subtitleTr&&v.push({label:"Türkçe",src:$t(g.subtitleTr)}),g.subtitleEn&&v.push({label:"İngilizce",src:$t(g.subtitleEn)});const m=[],$=new Set;if(la(g.m3u8Url)&&($.add(g.m3u8Url),m.push({url:g.m3u8Url,provider:"VIP",isPrimary:!0,priority:ca(g.m3u8Url,"VIP")})),Array.isArray(g.sources))for(const y of g.sources)!y||!la(y.m3u8Url)||$.has(y.m3u8Url)||($.add(y.m3u8Url),m.push({url:y.m3u8Url,provider:(y.provider||"VIP").toUpperCase(),id:y.id,subtitleTr:y.subtitleTr,subtitleEn:y.subtitleEn,isPrimary:!1,priority:ca(y.m3u8Url,y.provider)}));return m.sort((y,C)=>C.priority-y.priority),m.map((y,C)=>{const N=sr(y.url),B=[];return y.subtitleTr&&B.push({label:"Türkçe",src:$t(y.subtitleTr)}),y.subtitleEn&&B.push({label:"İngilizce",src:$t(y.subtitleEn)}),{id:`dzs_tv_${c}_s${r}_e${n}_${y.id||y.provider||C}`,name:C===0?`DS 1080p (S${r}B${n})`:`DS ${y.provider} 1080p (S${r}B${n})`,displayName:C===0?`DS 1080p (S${r}B${n})`:`DS ${y.provider} 1080p (S${r}B${n})`,badge:u?"⚡ TR Dublaj":"💬 TR Altyazı",source:"DS",url:N,streamUrl:N,originalEmbedUrl:y.url,quality:"1080p",isHls:!0,isDirectVideo:!0,type:"hls",subtitles:B.length>0?B:v,isDub:u,getUrl:()=>N}})}catch{return[]}}async function nr(i){try{const s=await fetch(`https://dizibal.org/api/stream/embed?code=${encodeURIComponent(i)}&autoplay=1`,{signal:AbortSignal.timeout(6e3)});if(!s.ok)return null;const d=await s.json().catch(()=>null);return d?.success&&d.embedUrl?d.embedUrl:null}catch{return null}}const mo="https://dizibal.org/api";async function zi(i,s={}){const d=typeof window<"u",r=i.startsWith("/")?i:`/${i}`,n=i.startsWith("http")?i:`${mo}${r}`,l=s.timeout||3500,u=async()=>{const p=await fetch(n,{...s,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Accept:"application/json, text/plain, */*",...s.headers||{}},signal:AbortSignal.timeout(l)});if(p&&p.ok)return p;throw new Error("Direct fetch failed")},c=async()=>{if(!d||i.startsWith("http"))throw new Error("No proxy needed");const p=Xe(`/api/dzb${r}`),g=await fetch(p,{...s,signal:AbortSignal.timeout(l)});if(g&&g.ok)return g;throw new Error("Proxy fetch failed")};if(d&&!i.startsWith("http"))try{return await Promise.any([c(),u()])}catch{return null}try{return await u()}catch{return null}}function rr(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""):""}async function fo(i){if(!i||typeof i!="string"||i.trim().length<2)return[];try{const s=await zi(`/series?search=${encodeURIComponent(i.trim())}`,{timeout:6500});if(!s)return[];const d=await s.json().catch(()=>null);return d&&Array.isArray(d.data)?d.data:[]}catch{return[]}}async function ho(i){if(!i||typeof i!="string"||i.trim().length<2)return[];try{const s=await zi(`/movies?search=${encodeURIComponent(i.trim())}`,{timeout:3500});if(!s)return[];const d=await s.json().catch(()=>null);return d&&Array.isArray(d.data)?d.data:[]}catch{return[]}}async function ta({titles:i=[],seriesTitle:s,originalTitle:d,season:r,episode:n,isDub:l=!1}){const u=[],c=parseInt(r,10)||1,p=parseInt(n,10)||1,g=new Set;Array.isArray(i)&&i.forEach(m=>m&&g.add(m)),s&&g.add(s),d&&g.add(d);let v=null;for(const m of g){const $=rr(m);if($)try{const D=await zi(`/series/${$}`,{timeout:5500});if(D){const y=await D.json().catch(()=>null),C=y?.data?.title||y?.data?.name||y?.data?.name_tr||y?.data?.name_en||y?.data?.slug||"";if(y&&y.success&&y.data&&y.data._id&&qe(C,[...g])){v=y.data;break}}}catch{}}if(!v)for(const m of g){const $=await fo(m);if($.length>0&&(v=$.find(D=>{const y=D.title||D.name||D.name_tr||D.name_en||D.slug||"";return qe(y,[...g])}),v))break}if(!v||!v._id)return[];try{const m=await zi(`/series/${v._id}/seasons/${c}`,{timeout:6500});if(!m)return[];const $=await m.json().catch(()=>null);if(!$||!$.success||!$.data||!Array.isArray($.data.episodes))return[];const D=$.data.episodes.find(N=>parseInt(N.episode_number,10)===p);if(!D||!D.src)return[];const y=D.src,C=await nr(y)||`https://x.ag2m4.cfd/embed-${y}.html?autoplay=1`;C&&u.push({id:`dzb_player_s${c}e${p}`,name:l?"DP DiziBal Player (TR Dublaj)":"DP DiziBal Player (TR Altyazı)",displayName:"DP DiziBal Player",streamUrl:C,url:C,subtitles:[],isHls:!1,isDirectVideo:!1,source:"DP",badge:"🌐 DiziBal Orijinal Player"})}catch{}return u}async function ia({titles:i=[],title:s,originalTitle:d,isDub:r=!1}){const n=[],l=new Set;Array.isArray(i)&&i.forEach(g=>g&&l.add(g)),s&&l.add(s),d&&l.add(d);let u=null;for(const g of l){const v=rr(g);if(v)try{const m=await zi(`/movies/${v}`,{timeout:3e3});if(m){const $=await m.json().catch(()=>null),D=$?.data?.title||$?.data?.title_tr||$?.data?.title_en||$?.data?.slug||"";if($&&$.success&&$.data&&$.data.src&&qe(D,[...l])){u=$.data;break}}}catch{}}if(!u)for(const g of l){const v=await ho(g);if(v.length>0&&(u=v.find(m=>{const $=m.title||m.title_tr||m.title_en||m.slug||"";return qe($,[...l])}),u))break}if(!u||!u.src)return[];const c=u.src,p=await nr(c)||`https://x.ag2m4.cfd/embed-${c}.html?autoplay=1`;return p&&n.push({id:"dzb_player_movie",name:r?"DP DiziBal Player (TR Dublaj)":"DP DiziBal Player (TR Altyazı)",displayName:"DP DiziBal Player",streamUrl:p,url:p,subtitles:[],isHls:!1,isDirectVideo:!1,source:"DP",badge:"🌐 DiziBal Orijinal Player"}),n}const bo="https://wild-credit-e1ae.cagatayca07.workers.dev";async function yo(i,s={}){const d=typeof window<"u",r=s.headers?.Referer||s.headers?.referer||"",n=r?`&ref=${encodeURIComponent(r)}`:"",l=d?`/api/proxy?url=${encodeURIComponent(i)}${n}`:`http://localhost:4000/proxy?url=${encodeURIComponent(i)}${n}`;try{const u=await fetch(l,{...s,signal:AbortSignal.timeout(s.timeout||3500)}).catch(()=>null);if(u&&u.ok)return u}catch{}try{const u=await fetch(i,{...s,signal:AbortSignal.timeout(s.timeout||3500)}).catch(()=>null);if(u&&u.ok)return u}catch{}try{const u=`${bo}?url=${encodeURIComponent(i)}${n}`,c=await fetch(u,{...s,signal:AbortSignal.timeout(s.timeout||3500)}).catch(()=>null);if(c&&c.ok)return c}catch{}return null}async function or(i){if(!i||typeof i!="string")return null;try{let s=i;s.startsWith("//")&&(s=`https:${s}`),s.startsWith("http")||(s=`https://${s}`);const d=await yo(s,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Referer:"https://vidmoly.net/"},timeout:4e3});if(!d)return null;const r=await d.text();if(!r)return null;const n=r.match(/sources\s*:\s*\[([\s\S]*?)\]/i);let l=null;if(n){const u=n[1].match(/file\s*:\s*["']([^"']+\.m3u8[^"']*)["']/i);u&&(l=u[1])}if(!l){const u=r.match(/https?:\/\/[^"'\s<>]+\.m3u8[^"'\s<>]*/i);u&&(l=u[0])}if(l)return l.startsWith("//")&&(l=`https:${l}`),{url:l,streamUrl:l,isHls:!0,isDirectVideo:!0,type:"hls"}}catch{}return null}const go="https://wild-credit-e1ae.cagatayca07.workers.dev",lr="https://www.diziyo.so";async function pt(i,s={}){const d=typeof window<"u";let r=i;if(r.startsWith("http"))try{const l=new URL(r);r=l.pathname+l.search}catch{}r=r.replace(/^\/api\/dzyo/,""),r.startsWith("/")||(r=`/${r}`);const n=`${lr}${r}`;if(d)try{const l=`/api/dzyo${r}`,u=await fetch(l,{...s,signal:AbortSignal.timeout(s.timeout||4e3)}).catch(()=>null);if(u&&u.ok)return u}catch{}try{const l=await fetch(n,{...s,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",Referer:"https://www.diziyo.so/",...s.headers||{}},signal:AbortSignal.timeout(s.timeout||4e3)}).catch(()=>null);if(l&&l.ok)return l}catch{}if(d)try{const l=`/api/proxy?url=${encodeURIComponent(n)}&ref=${encodeURIComponent("https://www.diziyo.so/")}`,u=await fetch(l,{...s,signal:AbortSignal.timeout(s.timeout||4e3)}).catch(()=>null);if(u&&u.ok)return u}catch{}try{const l=`${go}?url=${encodeURIComponent(n)}`,u=await fetch(l,{...s,signal:AbortSignal.timeout(s.timeout||4500)}).catch(()=>null);if(u&&u.ok)return u}catch{}return null}function cr(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""):""}async function dr(i){if(!i||typeof i!="string"||i.trim().length<2)return[];try{const s=await pt(`/arama?q=${encodeURIComponent(i.trim())}`,{timeout:3500});if(!s)return[];const d=await s.text().catch(()=>"");return d?Array.from(new Set(d.match(/href="https:\/\/www\.diziyo\.so\/(?:dizi|film)\/[^"]+"/g)||[])).map(n=>{const l=n.replace('href="',"").replace('"',""),u=l.includes("/dizi/"),c=l.match(/\/(?:dizi|film)\/([^/]+)/);return{url:l,slug:c?c[1]:"",isSeries:u}}):[]}catch{return[]}}async function ur(i,s){try{const d=await pt(i,{headers:{Referer:s},timeout:4500});if(!d)return null;const r=await d.text(),n=r.match(/name="_token"\s+value="([^"]+)"/),l=r.match(/action="([^"]+)"/);if(!n||!l)return null;const u=n[1],c=l[1];let p="";typeof d.headers.getSetCookie=="function"?p=d.headers.getSetCookie().map($=>$.split(";")[0].trim()).join("; "):p=(d.headers.get("set-cookie")||"").split(/,\s*(?=[a-zA-Z0-9_-]+=)/).map(D=>D.split(";")[0].trim()).join("; ");const g=await pt(c,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded",Referer:i,Origin:lr,"x-dzyo-referer":i,...p?{Cookie:p,"x-dzyo-cookie":p}:{}},body:new URLSearchParams({_token:u}),timeout:5e3});if(!g)return null;let v="";(g.ok||g.status===200)&&(v=await g.text().catch(()=>""));let m=g.headers?.get?.("location");if(!m&&v){const $=v.match(/url='([^']+)'/i)||v.match(/url="([^"]+)"/i);$&&(m=$[1])}if(m){const $=await pt(m,{headers:{Referer:c,"x-dzyo-referer":c,...p?{Cookie:p,"x-dzyo-cookie":p}:{}},timeout:4500});if($){const D=await $.text().catch(()=>"");D&&(v=D)}}if(v){const $=v.match(/src="([^"]+vidmoly[^"]+)"/i);if($){const y=$[1];return y.startsWith("//")?`https:${y}`:y}const D=v.match(/id="provider-frame"[^>]*src="([^"]+)"/i)||v.match(/<iframe[^>]+class="[^"]*player-watch[^"]*"[^>]*src="([^"]+)"/i)||v.match(/<iframe[^>]+src="([^"]+)"/i);if(D){let y=D[1];if(y.startsWith("//")&&(y=`https:${y}`),!y.includes("diziyo.so")&&!y.includes("/player/video/")&&!y.includes("/player/gate/"))return y}}}catch{}return null}async function Yn({titles:i=[],seriesTitle:s,originalTitle:d,season:r,episode:n,isDub:l=!1}){const u=[],c=parseInt(r,10)||1,p=parseInt(n,10)||1,g=new Set;Array.isArray(i)&&i.forEach(m=>m&&g.add(m)),s&&g.add(s),d&&g.add(d);let v=null;for(const m of g){const $=cr(m);if(!$)continue;const D=`https://www.diziyo.so/dizi/${$}/sezon-${c}/bolum-${p}/`;try{const y=await pt(D,{timeout:5e3});if(y&&y.ok){v=D;break}}catch{}}if(!v)for(const m of g){const D=(await dr(m)).find(y=>y.isSeries&&qe(y.slug,[...g]));if(D&&D.slug){const y=`https://www.diziyo.so/dizi/${D.slug}/sezon-${c}/bolum-${p}/`,C=await pt(y,{timeout:3e3});if(C&&C.ok){v=y;break}}}if(!v)return[];try{const m=await pt(v,{timeout:6e3});if(!m)return[];const $=await m.text().catch(()=>"");if(!$)return[];if(!qe(ua($),[...g]))return[];const D=[...$.matchAll(/data-player-source="([^"]+)"[^>]*data-player-language-name="([^"]+)"/gi)];if(D.length===0)return[];let y=null;for(const B of D){const q=B[1],L=(B[2]||"").toLowerCase();if(l&&(L.includes("dublaj")||L.includes("turkce")||L.includes("tr"))){y=q;break}if(!l&&(L.includes("altyaz")||L.includes("sub"))){y=q;break}}y||(y=D[0][1]);let C=null,N=null;try{if(N=await ur(y,v),N&&N.includes("vidmoly")){const B=await or(N).catch(()=>null);B&&B.streamUrl&&(C=B.streamUrl)}}catch{}C&&u.push({id:`dzy_vidmoly_s${c}e${p}_${l?"dub":"sub"}`,name:l?"Diziyo 1080p VIP (TR Dublaj)":"Diziyo 1080p VIP (TR Altyazı)",displayName:"Diziyo 1080p VIP",streamUrl:C,url:C,isHls:!0,isDirectVideo:!0,source:"Diziyo",badge:l?"⚡ Diziyo Dublaj":"💬 Diziyo Altyazı",getUrl:()=>C}),N&&!N.includes("diziyo.so")&&!N.includes("/player/video/")&&!N.includes("/player/gate/")&&u.push({id:`dzy_player_s${c}e${p}_${l?"dub":"sub"}`,name:l?"Diziyo VIP (TR Dublaj)":"Diziyo VIP (TR Altyazı)",displayName:"Diziyo VIP",streamUrl:N,url:N,isHls:!1,isDirectVideo:!1,source:"Diziyo",badge:l?"⚡ Diziyo Dublaj":"💬 Diziyo Altyazı",getUrl:()=>N})}catch{}return u}async function Xn({titles:i=[],title:s,originalTitle:d,isDub:r=!1}){const n=[],l=new Set;Array.isArray(i)&&i.forEach(c=>c&&l.add(c)),s&&l.add(s),d&&l.add(d);let u=null;for(const c of l){const p=cr(c);if(!p)continue;const g=`https://www.diziyo.so/film/${p}/`;try{const v=await pt(g,{timeout:3e3});if(v&&v.ok){u=g;break}}catch{}}if(!u)for(const c of l){const g=(await dr(c)).find(v=>!v.isSeries&&qe(v.slug,[...l]));if(g&&g.url){u=g.url;break}}if(!u)return[];try{const c=await pt(u,{timeout:4e3});if(!c)return[];const p=await c.text().catch(()=>"");if(!p)return[];if(!qe(ua(p),[...l]))return[];const g=[...p.matchAll(/data-player-source="([^"]+)"[^>]*data-player-language-name="([^"]+)"/gi)];if(g.length===0)return[];let v=null;for(const D of g){const y=D[1],C=(D[2]||"").toLowerCase();if(r&&(C.includes("dublaj")||C.includes("tr"))){v=y;break}if(!r&&(C.includes("altyaz")||C.includes("sub"))){v=y;break}}v||(v=g[0][1]);let m=null,$=null;try{if($=await ur(v,u),$&&$.includes("vidmoly")){const D=await or($).catch(()=>null);D&&D.streamUrl&&(m=D.streamUrl)}}catch{}m&&n.push({id:`dzy_vidmoly_movie_${r?"dub":"sub"}`,name:r?"Diziyo 1080p VIP (TR Dublaj)":"Diziyo 1080p VIP (TR Altyazı)",displayName:"Diziyo 1080p VIP",streamUrl:m,url:m,isHls:!0,isDirectVideo:!0,source:"Diziyo",badge:r?"⚡ Diziyo Dublaj":"💬 Diziyo Altyazı",getUrl:()=>m}),$&&!$.includes("diziyo.so")&&!$.includes("/player/video/")&&!$.includes("/player/gate/")&&n.push({id:`dzy_player_movie_${r?"dub":"sub"}`,name:r?"Diziyo VIP (TR Dublaj)":"Diziyo VIP (TR Altyazı)",displayName:"Diziyo VIP",streamUrl:$,url:$,isHls:!1,isDirectVideo:!1,source:"Diziyo",badge:r?"⚡ Diziyo Dublaj":"💬 Diziyo Altyazı",getUrl:()=>$})}catch{}return n}const vo="https://wild-credit-e1ae.cagatayca07.workers.dev",wo="https://www.diziyou.one";function ko(i){return i?i.toString().toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9\s-]/g,"").replace(/[\s_]+/g,"-").replace(/^-+|-+$/g,""):""}async function Ya(i,s={}){const d=typeof window<"u";let r=i;if(r.startsWith("http"))try{const l=new URL(r);r=l.pathname+l.search}catch{}r=r.replace(/^\/api\/dzy/,""),r.startsWith("/")||(r=`/${r}`);const n=`${wo}${r}`;if(d)try{const l=Xe(`/api/dzy${r}`),u=await fetch(l,{...s,signal:AbortSignal.timeout(s.timeout||4e3)}).catch(()=>null);if(u&&u.ok)return u}catch{}try{const l=await fetch(n,{...s,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Referer:"https://www.diziyou.one/",...s.headers||{}},signal:AbortSignal.timeout(s.timeout||4e3)}).catch(()=>null);if(l&&l.ok)return l}catch{}if(d)try{const l=Xe(`/api/proxy?url=${encodeURIComponent(n)}&ref=${encodeURIComponent("https://www.diziyou.one/")}`),u=await fetch(l,{...s,signal:AbortSignal.timeout(s.timeout||4e3)}).catch(()=>null);if(u&&u.ok)return u}catch{}try{const l=`${vo}?url=${encodeURIComponent(n)}`,u=await fetch(l,{...s,signal:AbortSignal.timeout(s.timeout||4500)}).catch(()=>null);if(u&&u.ok)return u}catch{}return null}async function $o({titles:i=[],title:s="",seriesTitle:d="",originalTitle:r="",season:n=1,episode:l=1,isDub:u=!1}){const c=parseInt(n,10)||1,p=parseInt(l,10)||1,g=Array.from(new Set([d,s,r,...i||[]])).filter(Boolean),v=new Set;for(const y of g){const C=ko(y);C&&(v.add(`/${C}-${c}-sezon-${p}-bolum/`),v.add(`/${C}2-${c}-sezon-${p}-bolum/`),v.add(`/${C}-${c}-sezon-${p}-bolum-izle/`),v.add(`/dizi/${C}-${c}-sezon-${p}-bolum/`))}let $=(await Promise.all([...v].map(async y=>{try{const C=await Ya(y,{timeout:4500});if(!C)return null;const N=await C.text();return!N||N.length<500?null:{epPath:y,html:N}}catch{return null}}))).filter(Boolean);if($.length===0)for(const y of g.slice(0,2))try{const C=await Ya(`/?s=${encodeURIComponent(y)}`,{timeout:3500});if(!C)continue;const N=await C.text(),B=new RegExp(`href="([^"]*(?:${c}-sezon-${p}-bolum|bolum)[^"]*)"`,"gi"),q=[...N.matchAll(B)].map(L=>L[1]);for(const L of q.slice(0,3)){const U=await Ya(L,{timeout:4e3});if(U){const f=await U.text();if(f&&f.length>500){$.push({epPath:L,html:f});break}}}if($.length>0)break}catch{}const D=[];for(const y of $){const{html:C}=y;if(!qe(ua(C),g))continue;const N=C.match(/<iframe[^>]+src=["']([^"']*(?:player|embed)[^"']*)["']/i),B=C.match(/\/player\/(\d+)\.html/i);if(B){const q=B[1],L=`https://storage.diziyou.one/episodes/${q}/play.m3u8`;D.push({id:`dyu_m3u8_${q}`,name:"Diziyou 1080p (TR Altyazı)",displayName:"Diziyou 1080p",badge:"💬 Diziyou Altyazı",url:L,streamUrl:L,isHls:!0,isDirectVideo:!0,source:"Diziyou",getUrl:()=>L});const U=`https://www.diziyou.one/player/${q}.html`;D.push({id:`dyu_frame_${q}`,name:"Diziyou VIP (TR Altyazı)",displayName:"Diziyou VIP",badge:"💬 Diziyou Web",url:U,streamUrl:U,isHls:!1,isDirectVideo:!1,source:"Diziyou",getUrl:()=>U});break}else if(N){const q=N[1].startsWith("//")?`https:${N[1]}`:N[1];D.push({id:`dyu_frame_${Math.random().toString(36).substring(2,6)}`,name:"Diziyou VIP (TR Altyazı)",displayName:"Diziyou VIP",badge:"💬 Diziyou Web",url:q,streamUrl:q,isHls:!1,isDirectVideo:!1,source:"Diziyou",getUrl:()=>q});break}}return D}const pr="https://www.hdfilmizle.best";function xi(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9]/g,""):""}async function is(i,s={}){const d=typeof window<"u",r=s.headers?.Referer||s.headers?.referer||"",n=r?`&ref=${encodeURIComponent(r)}`:"",l=d?`/api/proxy?url=${encodeURIComponent(i)}${n}`:`http://localhost:4000/proxy?url=${encodeURIComponent(i)}${n}`,u={...s.headers||{}};r&&(u["X-Proxy-Referer"]=r);try{const c=await fetch(l,{...s,headers:u,signal:AbortSignal.timeout(s.timeout||4500)}).catch(()=>null);if(c&&c.ok)return c}catch{}try{const c=await fetch(i,{...s,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Accept:"application/json, text/html, */*",...s.headers||{}},signal:AbortSignal.timeout(s.timeout||4500)}).catch(()=>null);if(c&&c.ok)return c}catch{}return null}async function So(i,s=!1){if(!i||typeof i!="string"||i.trim().length<2)return[];try{const r=`${pr}/wp-json/wp/v2/${s?"dizi":"film"}?search=${encodeURIComponent(i.trim())}`,n=await is(r);if(!n)return[];const l=await n.json().catch(()=>[]);return Array.isArray(l)?l.map(u=>({id:u.id,title:u.title?.rendered||"",link:u.link||"",slug:u.slug||""})):[]}catch{return[]}}async function Xa({titles:i=[],title:s="",originalTitle:d="",isDub:r=!0}){const n=[...new Set([...i,s,d])].filter(l=>l&&typeof l=="string"&&l.trim().length>1);if(n.length===0)return[];for(const l of n){const u=await So(l,!1);if(u.length===0)continue;const c=xi(l),p=u.find(g=>{const v=xi(g.title),m=xi(g.slug);return v===c||m===c})||u.find(g=>{const v=xi(g.title),m=xi(g.slug);return v.includes(c)||m.includes(c)});if(p)try{const g=await is(p.link);if(!g)continue;const m=(await g.text()).match(/_hdfNonce_\s*=\s*["']([^"']+)["']/i),$=m?m[1]:"",D=r?"tr":"en",y=`${pr}/ajax/videosrc/?id=${p.id}&lang=${D}&mr=0`,C=await is(y,{headers:{Referer:p.link,"X-HDF-Nonce":$,"X-Requested-With":"XMLHttpRequest"}});if(!C)continue;const N=await C.json().catch(()=>null);if(!N||!N.src)continue;const B=N.src,q=typeof window<"u",L=q?`/api/hls_proxy?url=${encodeURIComponent(B)}&ref=${encodeURIComponent(p.link)}`:B,U=[];if(Array.isArray(N.tracks)){for(const f of N.tracks)if(f.src&&f.label){const w=q?`/api/hls_proxy?url=${encodeURIComponent(f.src)}&ref=${encodeURIComponent(p.link)}`:f.src;U.push({label:f.label,src:w,srclang:f.srclang||"tr"})}}return[{id:`hdfb_mov_${p.id}_${r?"dub":"sub"}`,name:r?"HDF Dublaj 1080p":"HDF Altyazı 1080p",displayName:r?"HDF Dublaj 1080p":"HDF Altyazı 1080p",badge:r?"⚡ TR Dublaj":"💬 TR Altyazı",source:"HDFilmizle",url:L,streamUrl:L,quality:"1080p",isHls:!0,isDirectVideo:!0,type:"hls",subtitles:U,isDub:r,getUrl:()=>L}]}catch{}}return[]}const xo="https://wild-credit-e1ae.cagatayca07.workers.dev";function as(i){if(!i)return"";try{const s=i.replace(/\\/g,"").replace(/[^A-Za-z0-9+/=]/g,"");if(typeof Buffer<"u")return Buffer.from(s,"base64").toString("utf-8");if(typeof atob<"u"){const d=atob(s);try{const r=new Uint8Array(d.length);for(let n=0;n<d.length;n++)r[n]=d.charCodeAt(n);return new TextDecoder("utf-8").decode(r)}catch{return d}}return""}catch{return""}}const ei=as("Y2l6Z2ltYXgub25saW5l"),rt=`https://${ei}`,ss="/api/kvip",zo="/api/sibnet";function aa(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^\w\s-]/g," ").replace(/\s+/g," ").trim():""}async function Ai(i,s={}){const d=typeof window<"u";if(d&&i.includes(ei)){const r=new URL(i),n=`${ss}${r.pathname}${r.search}`;try{const l=await fetch(n,{...s,signal:AbortSignal.timeout(s.timeout||8e3)}).catch(()=>null);if(l&&l.ok)return l}catch{}}if(d&&i.includes("sibnet.ru")){const r=new URL(i),n=`${zo}${r.pathname}${r.search}`;try{const l=await fetch(n,{...s,signal:AbortSignal.timeout(s.timeout||8e3)}).catch(()=>null);if(l&&l.ok)return l}catch{}}if(d){const r=`/api/proxy?url=${encodeURIComponent(i)}`;try{const n=await fetch(r,{...s,signal:AbortSignal.timeout(s.timeout||8e3)}).catch(()=>null);if(n&&n.ok)return n}catch{}}try{const r=await fetch(i,{...s,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",...i.includes(ei)?{Referer:`${rt}/`}:{},...i.includes("sibnet.ru")?{Referer:"https://video.sibnet.ru/"}:{},...s.headers||{}},signal:AbortSignal.timeout(s.timeout||8e3)}).catch(()=>null);if(r&&r.ok)return r}catch{}try{const r=`${xo}?url=${encodeURIComponent(i)}`,n=await fetch(r,{...s,signal:AbortSignal.timeout(s.timeout||8e3)}).catch(()=>null);if(n&&n.ok)return n}catch{}return null}async function mr(i){const s=new Set,d=[];for(const r of i)if(!(!r||r.length<2))try{const n=`${rt}/api/search/suggest/?q=${encodeURIComponent(r.trim())}`,l=await Ai(n,{headers:{Accept:"application/json"},timeout:6e3});if(!l)continue;const u=await l.json().catch(()=>null);if(!u||!Array.isArray(u.animes))continue;for(const c of u.animes){if(!c||!c.url||s.has(c.id||c.url))continue;const p=c.title||c.name||c.anime_name||"",g=(c.url||"").replace(/^\/diziler\//,"").replace(/^\/filmler\//,"").replace(/^\/film\//,"").replace(/-izle\/?$/,"").replace(/-/g," ");[p,g].filter(Boolean).some($=>qe($,i,.82)||i.some(D=>{const y=aa(D),C=aa($);return!y||!C?!1:C===y}))&&(s.add(c.id||c.url),d.push({...c,cleanTitle:p||g}))}if(d.length===0){const c=await Ai(`${rt}/ara/?q=${encodeURIComponent(r.trim())}`,{timeout:6e3});if(c&&c.ok){const g=[...(await c.text()).matchAll(/<a\s+[^>]*href=["'](\/(?:diziler|filmler|film)\/[^"']+)["'][^>]*data-alt-title=["']([^"']*)["']/gi)];for(const v of g){const m=v[1],$=v[2]||"";s.has(m)||!(qe($,i,.82)||i.some(y=>aa(y)===aa($)))||(s.add(m),d.push({name:$,url:m,cleanTitle:$}))}}}if(d.length>=4)break}catch{}return d}function Ao(i,s,d){const r=Number(s),n=Number(d),l=[new RegExp(`href=["']?([^"'>]*?${r}-sezon-${n}-bolum(?:-izle)?\\/?)["'>]`,"i"),new RegExp(`href=["']?([^"'>]*?sezon-${r}[^"'>]*?bolum-${n}(?:-izle)?\\/?)["'>]`,"i"),new RegExp(`href=["']?([^"'>]*?s0?${r}e0?${n}(?:-izle)?\\/?)["'>]`,"i")];r===1&&l.push(new RegExp(`href=["']?([^"'>]*?${n}-bolum(?:-izle)?\\/?)["'>]`,"i"));for(const c of l){const p=i.match(c);if(p&&p[1])return p[1]}const u=[...i.matchAll(/href=["']?([^"'>]*?bolum-izle\/?)["'>]/gi)];for(const c of u){const p=c[1],g=p.match(/(\d+)-sezon/i),v=p.match(/(\d+)-bolum/i),m=g?Number(g[1]):1,$=v?Number(v[1]):null;if(m===r&&$===n)return p}return null}function fr(i,s){let d=[];const r=i.match(/serversByLang\s*=\s*JSON\.parse\(atob\(["']([^"']+)["']\)\)/);if(r)try{const n=JSON.parse(as(r[1]));n&&(s?d=[...n.dub||[],...n.any||[]]:d=[...n.sub||[],...n.any||[]])}catch{}if(d.length===0){const n=i.match(/servers\s*=\s*JSON\.parse\(atob\(["']([^"']+)["']\)\)/);if(n)try{const l=JSON.parse(as(n[1]));Array.isArray(l)&&(d=l.filter(u=>{const c=u.label||u.type||"VIP",p=(u.lang||"").toLowerCase(),g=p==="dub"||c.toLowerCase().includes("dublaj"),v=p==="sub"||c.toLowerCase().includes("altyaz");return s?g||!g&&!v:v||!g&&!v}))}catch{}}return d}async function hr(i,s,d){const r=[],n=s?"TR Dublaj":"Altyazılı",l=s?"dubbed":"subtitled",u=i.label||i.type||"VIP";if(i.type==="sibnet"&&i.videoId){const c=`https://video.sibnet.ru/shell.php?videoid=${encodeURIComponent(i.videoId)}`;return d.has(c)||(d.add(c),r.push({id:`kvip_sib_embed_${i.videoId}_${s?"dub":"sub"}`,name:`Kids VIP - 1080p (${n})`,displayName:`Kids VIP (${n})`,badge:"⚡ Kids VIP",category:l,streamUrl:c,url:c,type:"embed",quality:"1080p",getUrl:()=>c})),r}if(i.src){const c=i.src.startsWith("http")?i.src:`${rt}${i.src}`;if(!(c.includes("cizgimax.online")||c.includes(ei)||c.includes("/oynat/"))){const g=typeof window<"u"&&c.includes(ei)?c.replace(rt,ss):c;d.has(g)||(d.add(g),r.push({id:`kvip_embed_${i.embedId||Math.random()}_${s?"dub":"sub"}`,name:`Kids VIP - ${u} (${n})`,displayName:`Kids VIP (${n})`,badge:"⚡ Kids VIP",category:l,streamUrl:g,url:g,type:"embed",getUrl:()=>g}))}}if(i.type==="youtube"&&i.ytId){const c=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(i.ytId)}?autoplay=1&rel=0&playsinline=1`;d.has(c)||(d.add(c),r.push({id:`kvip_youtube_${i.ytId}_${s?"dub":"sub"}`,name:`Kids VIP - HD (${n})`,displayName:`Kids VIP (${n})`,badge:"⚡ Kids VIP",category:l,streamUrl:c,url:c,type:"embed",getUrl:()=>c}))}if(i.streamUrl&&!d.has(i.streamUrl)){d.add(i.streamUrl);const c=i.streamUrl.startsWith("http")?i.streamUrl:`${rt}${i.streamUrl}`,p=typeof window<"u"&&c.includes(ei)?c.replace(rt,ss):c,g=p.includes(".m3u8")||p.includes("hls");r.push({id:`kvip_stream_${i.embedId||Math.random()}_${s?"dub":"sub"}`,name:`Kids VIP - ${u} (${n})`,displayName:`Kids VIP (${n})`,badge:"⚡ Kids VIP",category:l,streamUrl:p,url:p,isDirectVideo:!g,type:g?"hls":"mp4",getUrl:()=>p})}return r}async function Ga({titles:i=[],seriesTitle:s="",title:d="",originalTitle:r="",season:n=1,episode:l=1,isDub:u=!0}){const c=[...new Set([s,d,r,...i])].filter(m=>m&&typeof m=="string"&&m.trim().length>1);if(c.length===0)return[];const p=await mr(c);if(p.length===0)return[];const g=[],v=new Set;for(const m of p.slice(0,3))try{const $=m.url.startsWith("http")?m.url:`${rt}${m.url}`,D=await Ai($,{timeout:8e3});if(!D)continue;const y=await D.text(),C=Ao(y,n,l);if(!C)continue;const N=C.startsWith("http")?C:`${rt}${C}`,B=await Ai(N,{timeout:8e3});if(!B)continue;const q=await B.text(),L=fr(q,u);if(!Array.isArray(L)||L.length===0)continue;for(const U of L){const f=await hr(U,u,v);g.push(...f)}if(g.length>0)break}catch{}return g}async function sa({titles:i=[],title:s="",originalTitle:d="",isDub:r=!0}){const n=[...new Set([s,d,...i])].filter(p=>p&&typeof p=="string"&&p.trim().length>1);if(n.length===0)return[];const l=await mr(n);if(l.length===0)return[];const u=[],c=new Set;for(const p of l.slice(0,3))try{const g=p.url.startsWith("http")?p.url:`${rt}${p.url}`,v=await Ai(g,{timeout:8e3});if(!v)continue;const m=await v.text(),$=fr(m,r);if(!Array.isArray($)||$.length===0)continue;for(const D of $){const y=await hr(D,r,c);u.push(...y)}if(u.length>0)break}catch{}return u}function To({type:i="movie",tmdbId:s,season:d=1,episode:r=1}={}){if(!s)return[];const n=i==="movie",l=parseInt(d,10)||1,u=parseInt(r,10)||1,c=n?`https://vidsrc.me/embed/movie?tmdb=${s}`:`https://vidsrc.me/embed/tv?tmdb=${s}&season=${l}&episode=${u}`,p=n?`https://player.smashystream.com/movie/${s}`:`https://player.smashystream.com/tv/${s}?s=${l}&e=${u}`;return[{id:`vidsrc_me_${s}_s${l}e${u}`,name:n?"VidSrc 1080p (Multi-Sub)":`VidSrc S${l}B${u}`,displayName:"VidSrc (1080p HD)",badge:"🎬 VidSrc 1080p",source:"VidSrc",url:c,streamUrl:c,quality:"1080p HD",isHls:!1,isDirectVideo:!1,category:"subtitled",type:"embed",getUrl:()=>c},{id:`smashystream_${s}_s${l}e${u}`,name:n?"SmashyStream VIP (1080p)":`SmashyStream S${l}B${u}`,displayName:"SmashyStream (1080p)",badge:"⚡ SmashyStream",source:"SmashyStream",url:p,streamUrl:p,quality:"1080p HD",isHls:!1,isDirectVideo:!1,category:"subtitled",type:"embed",getUrl:()=>p}]}async function Do({type:i="movie",tmdbId:s=null,season:d=1,episode:r=1}={}){if(!s)return[];const n=i==="movie",l=parseInt(d,10)||1,u=parseInt(r,10)||1,c=n?`https://player.videasy.to/movie/${s}`:`https://player.videasy.to/tv/${s}/${l}/${u}`,g=[{label:"OpenSubtitles (Türkçe)",src:n?`/api/subtitles?tmdbId=${s||""}&title=${encodeURIComponent(title||"")}&type=movie`:`/api/subtitles?tmdbId=${s||""}&title=${encodeURIComponent(title||"")}&season=${l}&episode=${u}&type=tv`}];return[{id:`torrent_p2p_videasy_${s}_s${l}e${u}`,name:n?"VIP Torrent Akış (1080p)":`VIP Torrent Akış S${l}B${u}`,displayName:"VIP Torrent Akış (1080p)",badge:"⚡ VIP Akış 1080p",source:"VIP Torrent",url:c,streamUrl:c,quality:"1080p HD",isHls:!1,isDirectVideo:!1,category:"subtitled",type:"embed",subtitles:g,getUrl:()=>c}]}const Bt="https://lookmovie2.la";function Gn(i){return i?i.replace(/\s*-\s*S\d+E\d+.*$/i,"").replace(/\s*-\s*S\d+.*$/i,"").replace(/\s*\(\d{4}\).*/,"").trim():""}async function _o(i,s){if(!s)return null;const d=i==="tv"?`${Bt}/api/v1/shows/do-search/?q=${encodeURIComponent(s)}`:`${Bt}/api/v1/movies/do-search/?q=${encodeURIComponent(s)}`;try{const n=typeof window<"u"?`/api/proxy?url=${encodeURIComponent(d)}&ref=${encodeURIComponent("https://lookmovie2.la/")}`:d,l=await fetch(n,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",Referer:"https://lookmovie2.la/"},signal:AbortSignal.timeout(5e3)});if(!l.ok)return null;const u=await l.json().catch(()=>null);return!u||!Array.isArray(u.result)||u.result.length===0?null:u.result[0]}catch{return null}}async function Co({type:i="movie",title:s="",originalTitle:d="",season:r=1,episode:n=1}={}){const l=i==="movie",u=parseInt(r,10)||1,c=parseInt(n,10)||1;let p=null;const g=[Gn(s),Gn(d)].filter(Boolean);for(const v of g)if(p=await _o(i,v),p&&p.slug)break;if(!p||!p.slug)return[];try{const v=typeof window<"u",m=l?`${Bt}/movies/play/${p.slug}`:`${Bt}/shows/play/${p.slug}`,$=v?`/api/proxy?url=${encodeURIComponent(m)}&ref=${encodeURIComponent("https://lookmovie2.la/")}`:m,D=await fetch($,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",Referer:"https://lookmovie2.la/"},signal:AbortSignal.timeout(5500)});if(!D.ok)return[];const y=await D.text();let C=null;if(l){const K=y.match(/id_movie:\s*(\d+)/),R=y.match(/hash:\s*["']([^"']+)["']/),V=y.match(/expires:\s*(\d+)/);if(!K||!R||!V)return[];C=`${Bt}/api/v1/security/movie-access?id_movie=${K[1]}&hash=${R[1]}&expires=${V[1]}`}else{const K=y.match(/hash:\s*["']([^"']+)["']/),R=y.match(/expires:\s*(\d+)/);if(!K||!R)return[];let V=null;const ge=y.split("{");for(const pe of ge)if((pe.includes(`episode: '${c}'`)||pe.includes(`episode: "${c}"`))&&(pe.includes(`season: '${u}'`)||pe.includes(`season: "${u}"`))){const Ae=pe.match(/id_episode:\s*(\d+)/);if(Ae){V=Ae[1];break}}if(!V){const pe=new RegExp(`episode:\\s*["']?${c}["']?[\\s\\S]*?id_episode:\\s*(\\d+)[\\s\\S]*?season:\\s*["']?${u}["']?`,"i"),Ae=y.match(pe);Ae&&(V=Ae[1])}if(!V)return[];C=`${Bt}/api/v1/security/episode-access?id_episode=${V}&hash=${K[1]}&expires=${R[1]}`}const N=v?`/api/proxy?url=${encodeURIComponent(C)}&ref=${encodeURIComponent(m)}`:C,B=await fetch(N,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",Referer:m},signal:AbortSignal.timeout(5500)});if(!B.ok)return[];const q=await B.json().catch(()=>null);if(!q||!q.streams)return[];const L=q.streams||{},U=Object.entries(L).filter(([K,R])=>typeof R=="string"&&R.startsWith("http")&&R.includes(".m3u8")).map(([K,R])=>({quality:K,url:R})),f=["1080p","1080","720p","720","480p","480","auto"];U.sort((K,R)=>{const V=f.indexOf(K.quality),ge=f.indexOf(R.quality);return(V===-1?99:V)-(ge===-1?99:ge)});const w=U.length>0?U[0].url:Object.values(L).find(K=>typeof K=="string"&&K.includes(".m3u8"))||null;if(!w)return[];const F=w,se=[];return Array.isArray(q.subtitles)&&q.subtitles.forEach(K=>{if(!K||!K.file)return;const R=(K.language||"").toLowerCase(),V=R.includes("turk")||typeof K.file=="string"&&K.file.includes("tr_"),ge=R.includes("eng")||typeof K.file=="string"&&K.file.includes("en_");if(V||ge){let pe="";typeof K.file=="string"&&(pe=K.file.startsWith("http")?K.file:`${Bt}${K.file}`),pe&&se.push({label:V?"Türkçe (LookMovie)":"English (LookMovie)",src:`/api/proxy?url=${encodeURIComponent(pe)}&ref=${encodeURIComponent("https://lookmovie2.la/")}`})}}),[{id:`lookmovie_direct_${p.id_show||p.id_movie||p.slug}_s${u}e${c}`,name:l?"LookMovie HLS (1080p TR Altyazı)":`LookMovie HLS S${u}B${c} (TR Altyazı)`,displayName:"LookMovie HLS (1080p)",badge:"🎬 LookMovie Direct",source:"LookMovie",url:F,streamUrl:F,quality:"1080p HD",isHls:!0,isDirectVideo:!0,category:"subtitled",subtitles:se,getUrl:()=>F}]}catch{return[]}}async function Io({type:i="movie",tmdbId:s=null,imdbId:d=null,title:r="",originalTitle:n="",season:l=1,episode:u=1}={}){const c=r||n;if(!c)return[];const p=parseInt(l,10)||1,g=parseInt(u,10)||1,v=i==="movie";try{const m=Zn(c),$=Zn(n),D=Xe(`/api/hdfc_stream?query=${encodeURIComponent(m)}&originalTitle=${encodeURIComponent($)}&tmdbId=${s||""}&imdbId=${d||""}&season=${p}&episode=${g}&type=${i||(v?"movie":"tv")}`),y=await fetch(D,{signal:AbortSignal.timeout(22e3)}).catch(()=>null);if(!y||!y.ok)return[];const C=await y.json().catch(()=>null);if(!C||!C.success||!C.streamUrl)return[];const N=[],B=[];if(Array.isArray(C.subtitles))for(const L of C.subtitles)L.src&&B.push({label:L.label||"Türkçe (HDFC)",src:L.src});if(!B.some(L=>(L.label||"").toLowerCase().includes("türk")||(L.label||"").toLowerCase().includes("tr"))&&(d||s||r)){const L=encodeURIComponent(r||n||""),U=v?`/api/subtitles?tmdbId=${s||""}&imdbId=${d||""}&title=${L}&type=movie`:`/api/subtitles?tmdbId=${s||""}&imdbId=${d||""}&title=${L}&season=${p}&episode=${g}&type=tv`;B.unshift({label:"OpenSubtitles (Türkçe)",src:U})}return N.push({id:`hdfc_${s||"q"}_${v?"movie":`s${p}e${g}`}`,name:v?"HDFilmCehennemi VIP (1080p HLS)":`HDFilmCehennemi S${p}B${g}`,displayName:"HDFilmCehennemi (1080p)",badge:"🔥 HDFC 1080p HLS",source:"HDFilmCehennemi",url:Xe(C.streamUrl),streamUrl:Xe(C.streamUrl),rawStreamUrl:C.rawStreamUrl,movieUrl:C.movieUrl,quality:"1080p HD",isHls:!0,isDirectVideo:!0,category:"subtitled",type:"direct",subtitles:B,getUrl:()=>Xe(C.streamUrl)}),N}catch{return[]}}function Zn(i){return i?i.replace(/\s*-\s*S\d+E\d+.*$/i,"").replace(/\s*-\s*S\d+.*$/i,"").replace(/\s*-\s*\d+\.\s*Sezon.*$/i,"").replace(/\s*\(\d{4}\).*/,"").trim():""}const Je="https://jetfilmizle.now",Lo="https://wild-credit-e1ae.cagatayca07.workers.dev";function da(i){return i?i.toLowerCase().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9]/g,""):""}function Bo(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-"):""}async function ti(i,s={}){const d=typeof window<"u";if(!s.method||s.method==="GET")try{const r=`${Lo}?url=${encodeURIComponent(i)}`,n=await fetch(r,{...s,signal:AbortSignal.timeout(s.timeout||4500)}).catch(()=>null);if(n&&n.ok)return n}catch{}if(d)try{const r=new URL(i),n=`/api/jet${r.pathname}${r.search}`,l=await fetch(n,{...s,headers:{"X-Requested-With":"XMLHttpRequest",...s.headers||{}},signal:AbortSignal.timeout(s.timeout||4500)}).catch(()=>null);if(l&&l.ok)return l}catch{}try{const r=await fetch(i,{...s,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36","X-Requested-With":"XMLHttpRequest",Referer:Je,Origin:Je,...s.headers||{}},signal:AbortSignal.timeout(s.timeout||4500)}).catch(()=>null);if(r&&r.ok)return r}catch{}return null}async function br(i,s=!1){if(!i||typeof i!="string"||i.trim().length<2)return[];const d=i.trim(),r=s?`${Je}/diziler?q=${encodeURIComponent(d)}`:`${Je}/arama?q=${encodeURIComponent(d)}`;try{const n=await ti(r,{headers:{Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"},timeout:4500});if(!n)return[];const l=await n.text(),u=[],c=s?/<a[^>]+href=["'](https:\/\/jetfilmizle\.now\/dizi\/[^"']+)["'][^>]*title=["']([^"']+)["']/gi:/<a[^>]+href=["'](https:\/\/jetfilmizle\.now\/(?:film|dizi)\/[^"']+)["'][^>]*title=["']([^"']+)["']/gi;let p;for(;(p=c.exec(l))!==null;){const g=p[1],v=p[2],m=g.split("/").filter(Boolean).pop(),$=v.replace(/Full.*İzle/i,"").replace(/Türkçe Dublaj.*/i,"").replace(/Altyazılı.*/i,"").replace(/HD.*/i,"").replace(/Dizisi.*/i,"").trim();u.some(D=>D.url===g)||u.push({title:$,url:g,slug:m,isSeries:s||g.includes("/dizi/")})}return u}catch{return[]}}async function Za({titles:i=[],title:s="",originalTitle:d="",year:r=null,isDub:n=!0}){const l=[...new Set([...i,s,d])].filter(c=>c&&typeof c=="string"&&c.trim().length>1);if(l.length===0)return[];let u=null;for(const c of l){const g=(await br(c,!1)).filter(v=>!v.isSeries);if(g.length>0){const v=da(c),m=g.find($=>{const D=da($.title);return D===v||D.includes(v)||v.includes(D)})||g[0];if(m){u=m.url;break}}}if(!u)return[];try{const c=await ti(u,{headers:{Referer:Je},timeout:4500});if(!c)return[];const p=await c.text(),g=p.match(/name=["']film_id["'][^>]*value=["'](\d+)["']/i)||p.match(/value=["'](\d+)["'][^>]*name=["']film_id["']/i);if(!g)return[];const v=g[1],m=`${Je}/jetplayer`,$=n?"dublaj":"altyazili",D=[],y=[];for(let N=0;N<4;N++)y.push(ti(m,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest",Referer:u,Origin:Je},body:`film_id=${v}&source_index=${N}&player_type=${$}`,timeout:4e3}).then(async B=>{if(!B)return null;const L=(await B.text()).match(/<iframe[^>]+src=['"]([^'"]+)['"]/i);if(!L)return null;let U=L[1];if(U.startsWith("//")&&(U="https:"+U),U.includes("youtube")||U.includes("youtu.be")||U.includes("trailer"))return null;const f=U.includes("vidmoly"),w=U.includes("ok.ru"),F=U.includes("titan"),se=f?"Jet VidMoly 1080p":w?"Jet OK.ru HD":F?`Jet Titan VIP ${N+1}`:`Jet VIP ${N+1}`;return{id:`jet_${v}_${N}`,name:se,displayName:se,source:"Jet",url:U,quality:"1080p",type:"iframe",isDub:n}}).catch(()=>null));const C=await Promise.all(y);for(const N of C)N&&N.url&&!D.some(B=>B.url===N.url)&&D.push(N);return D}catch{return[]}}async function Ja({titles:i=[],seriesTitle:s="",season:d=1,episode:r=1,isDub:n=!0}){const l=[...new Set([...i,s])].filter(c=>c&&typeof c=="string"&&c.trim().length>1);if(l.length===0)return[];let u=null;for(const c of l){const p=Bo(c),g=[p,`${p}-2025`,`${p}-2024`,`${p}-dizisi`];for(const v of g)try{const m=`${Je}/dizi/${v}`;if(await ti(m,{method:"HEAD",timeout:2e3})){u=m;break}}catch{}if(u)break}if(!u)for(const c of l){const g=(await br(c,!0)).filter(v=>v.isSeries);if(g.length>0){const v=da(c),m=g.find($=>{const D=da($.title);return D===v||D.includes(v)||D.includes(D)})||g[0];if(m){u=m.url;break}}}if(!u)return[];try{const c=await ti(u,{headers:{Referer:Je},timeout:4500});if(!c)return[];const p=await c.text(),g=p.match(/name=["']film_id["'][^>]*value=["'](\d+)["']/i)||p.match(/value=["'](\d+)["'][^>]*name=["']film_id["']/i);if(!g)return[];const v=g[1],m=`${Je}/jetplayer`,$=n?"dublaj":"altyazili",D=p.match(new RegExp(`data-source-index=["'](\\d+)["'][^>]*data-season=["']${d}["'][^>]*data-episode=["']${r}["']`,"i"))||p.match(new RegExp(`data-season=["']${d}["'][^>]*data-episode=["']${r}["'][^>]*data-source-index=["'](\\d+)["']`,"i")),y=D?D[1]:r-1,C=await ti(m,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest",Referer:u,Origin:Je},body:`film_id=${v}&source_index=${y}&player_type=${$}`,timeout:4500});if(!C)return[];const B=(await C.text()).match(/<iframe[^>]+src=['"]([^'"]+)['"]/i);if(!B)return[];let q=B[1];if(q.startsWith("//")&&(q="https:"+q),q.includes("youtube")||q.includes("youtu.be")||q.includes("trailer"))return[];const L=q.includes("vidmoly"),U=q.includes("ok.ru"),f=q.includes("titan"),w=L?`Jet VidMoly (S${d}B${r})`:U?`Jet OK.ru (S${d}B${r})`:f?`Jet Titan VIP (S${d}B${r})`:`Jet VIP (S${d}B${r})`;return[{id:`jet_series_${v}_s${d}_e${r}`,name:w,displayName:w,source:"Jet",url:q,quality:"1080p",type:"iframe",isDub:n}]}catch{return[]}}const Mo="https://wild-credit-e1ae.cagatayca07.workers.dev",Ro="hlxjl1c2w281ax473rt1ofgrvhyjvi",Eo="035f01015659595301060601525f39060c094e03515b442d13590e1a1c405b085b55031c5c5b475d57035c5c54415a001b04071f4446",Uo="15632429",Po="38534241025665";function Jn(i){return i?i.toLowerCase().trim().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^\w\s-]/g," ").replace(/\s+/g," ").trim():""}function qo(){try{const i=new Date().toLocaleString("en-US",{timeZone:"Europe/Istanbul",weekday:"long"}).toLowerCase(),s=`${Ro}_${i}`,d=Array.from({length:6},()=>(Math.random()+1).toString(36)[2]).join(""),r=JSON.stringify({[d]:Date.now()}),n=new TextEncoder,l=n.encode(r),u=n.encode(s),c=new Uint8Array(l.length);for(let p=0;p<l.length;p++)c[p]=l[p]^u[p%u.length];return Array.from(c).map(p=>p.toString(16).padStart(2,"0")).join("")}catch{return""}}function No(){return{"Cf-Control":qo(),device:"browser",language:"tr",site:"main","user-session":Eo,"user-profile":Uo,user:Po,Origin:"https://anizium.co",Referer:"https://anizium.co/"}}async function Qn(i,s=4500){const d=typeof window<"u",r=No();try{const n=await fetch(i,{headers:r,signal:AbortSignal.timeout(s)});if(n&&n.ok){const l=await n.json().catch(()=>null);if(l)return l}}catch{}if(d)try{const n=`${Mo}?url=${encodeURIComponent(i)}`,l=await fetch(n,{headers:r,signal:AbortSignal.timeout(s)});if(l&&l.ok)return await l.json().catch(()=>null)}catch{}return null}async function er({titles:i=[],seriesTitle:s="",title:d="",originalTitle:r="",type:n="tv",season:l=1,episode:u=1,isDub:c=!1}={}){const p=[...new Set([r,s,d,...i])].filter(y=>y&&typeof y=="string"&&y.trim().length>1);if(p.length===0)return[];const g=parseInt(l,10)||1,v=parseInt(u,10)||1,m=n==="movie",$=[],D=new Set;for(const y of p)try{const C=Jn(y);if(!C||C.length<2)continue;const N=`https://api.anizium.co/page/search?value=${encodeURIComponent(C)}`,B=await Qn(N,3800),q=B?.page?.data||B?.data||[];if(!Array.isArray(q)||q.length===0)continue;for(const L of q.slice(0,3)){if(!L||!L.ID)continue;const U=Jn(L.name||L.name_tr||L.name_short||"");if(!qe(U,p))continue;const f=m?`https://api.anizium.co/anime/source?id=${L.ID}&site=main&plan=free&server=1`:`https://api.anizium.co/anime/source?id=${L.ID}&site=main&plan=free&season=${g}&episode=${v}&server=1`,w=await Qn(f,4200);if(!w||!w.success||!Array.isArray(w.groups)||w.groups.length===0)continue;const F=[];if(Array.isArray(w.subtitles))for(const R of w.subtitles)R&&R.link&&F.push({label:R.name||(R.group==="tr"?"Türkçe":"İngilizce"),src:R.link});let se=null;if(c?se=w.groups.find(R=>R.group==="trdub"||(R.name||"").toLowerCase().includes("türk")):(se=w.groups.find(R=>R.group==="original"||R.group==="trsub"||(R.name||"").toLowerCase().includes("japon")),se||(se=w.groups.find(R=>R.group!=="trdub"))),!se||!Array.isArray(se.items)||se.items.length===0)continue;const K=[...se.items].sort((R,V)=>(V.quality||0)-(R.quality||0));for(const R of K){if(!R||!R.link||D.has(R.link)||R.quality<720&&K.some(Ae=>Ae.quality>=720))continue;D.add(R.link);const V=R.quality>=2160?"4K":R.quality?`${R.quality}p`:"1080p",ge=R.quality>=2160,pe=m?`AZ ${V}`:`AZ ${V} (S${g}B${v})`;$.push({id:`az_${L.ID}_${m?"mov":`s${g}e${v}`}_${R.quality||"1080"}_${c?"dub":"sub"}`,name:`${pe} ${c?"TR Dublaj":"TR Altyazı"}`,displayName:`${pe} ${c?"TR Dublaj":"TR Altyazı"}`,badge:ge?`⚡ AZ 4K UHD ${c?"Dublaj":"Altyazı"}`:`⚡ AZ 1080p ${c?"Dublaj":"Altyazı"}`,source:"AZ",url:R.link,streamUrl:R.link,quality:ge?"4K UHD":R.quality?`${R.quality}p`:"1080p",isHls:!1,isDirectVideo:!0,type:"direct",category:c?"dubbed":"subtitled",subtitles:c?[]:F,isDub:c,getUrl:()=>R.link})}if($.length>0)break}if($.length>0)break}catch{}return $}const Qa="v39",Ho="4e44d9029b1270a757cddc766a1bcb63",Jt=new Map;function Ti(i){return i?i.replace(/\s*-\s*S\d+E\d+.*$/i,"").replace(/\s*-\s*S\d+.*$/i,"").replace(/\s*-\s*\d+\.\s*Sezon.*$/i,"").replace(/\s*\(\d{4}\).*/,"").trim():""}function yr(i,s){const d=new Set;i&&(d.add(i),d.add(Ti(i))),s&&(d.add(s),d.add(Ti(s)));const r=new Set(d);for(const n of d){if(!n)continue;const l=n.replace(/\bpart\s+two\b/i,"Part 2").replace(/\bpart\s+three\b/i,"Part 3").replace(/\bpart\s+four\b/i,"Part 4").replace(/\bpart\s+one\b/i,"Part 1").replace(/\bbolum\s+iki\b/i,"Bölüm 2").replace(/\bbolum\s+uc\b/i,"Bölüm 3").replace(/\bpart\s+ii\b/i,"Part 2").replace(/\bpart\s+iii\b/i,"Part 3");r.add(l);const u=n.replace(/\bPart\s+\d+\b/gi,"").replace(/\bBölüm\s+\d+\b/gi,"").replace(/\b(II|III|IV|V|VI)\b/g,"").trim();u&&u.length>2&&r.add(u)}return Array.from(r).filter(Boolean)}async function jo(i,s,d,r){const n=yr(d,r);let l=null,u=!1;if(!s)return{candidateTitles:n,detectedYear:l,isAnimation:u};try{const g=await fetch(`https://api.themoviedb.org/3/${i==="movie"?"movie":"tv"}/${s}?api_key=${Ho}&language=tr-TR`,{signal:AbortSignal.timeout(3500)});if(g.ok){const v=await g.json(),m=v.title||v.name,$=v.original_title||v.original_name,D=v.release_date||v.first_air_date;D&&(l=new Date(D).getFullYear()),Array.isArray(v.genres)&&v.genres.some(y=>y.id===16||(y.name||"").toLowerCase().includes("animasyon"))&&(u=!0),m&&n.push(m,Ti(m)),$&&n.push($,Ti($))}}catch{}return{candidateTitles:Array.from(new Set(n.map(p=>(p||"").trim()).filter(Boolean))),detectedYear:l,isAnimation:u}}function Wo(i,s=""){const d=(i.url||i.streamUrl||(typeof i.getUrl=="function"?i.getUrl():"")||"").toLowerCase(),r=(i.displayName||i.name||"").toLowerCase(),n=(i.id||"").toLowerCase();if(n.startsWith("hdfc_")||r.includes("hdfilmcehennemi")||r.includes("hdfc"))return s==="dubbed"||r.includes("dub")?"HDFilmCehennemi Dublaj 1080p":"HDFilmCehennemi Altyazı 1080p";if(n.startsWith("dzb_")||n.startsWith("dzp_")||r.includes("dizibal")||r.includes("dizipal")||r.includes("dp"))return r.includes("player")?s==="dubbed"?"DP DiziBal Player (TR Dublaj)":"DP DiziBal Player (TR Altyazı)":s==="dubbed"||r.includes("dub")?"DP 1080p (TR Dublaj)":s==="subtitled"||r.includes("alt")||r.includes("sub")?"DP 1080p (TR Altyazı)":"DP 1080p";if(n.startsWith("dzs_")||r.includes("dizisol")){let l=(i.displayName||i.name||"DS 1080p (HLS)").replace(/dizisol/gi,"DS").trim();return l.startsWith("DS")||(l=`DS ${l}`),l}return n.startsWith("snx")||r.includes("sinewix")||r.includes("swx")?r.includes("mkv")?"SWX 1080p (MKV)":"SWX 1080p Direct":n.startsWith("tvr_")||n.startsWith("rectv_")||r.includes("rectv")||r.includes("tvr")?i.displayName||i.name||"⚡ TVR VIP 1080p":n.startsWith("lookmovie_")||r.includes("lookmovie")?i.displayName||i.name||"🎬 LookMovie VIP 1080p":n.startsWith("twoembed_")||r.includes("2embed")?i.displayName||i.name||"⚡ 2Embed VIP 1080p":n.startsWith("vidsrc_pm")||r.includes("vidsrc alt")?i.displayName||i.name||"⚡ VidSrc Alt 1080p":n.startsWith("vidsrc_")||r.includes("vidsrc")?i.displayName||i.name||"🎬 VidSrc VIP 1080p":n.startsWith("dzy_")||r.includes("diziyo")?d.includes("vidmoly")?"Diziyo VidMoly 1080p":i.displayName||i.name||"Diziyo 1080p":n.startsWith("dyu_")||r.includes("diziyou")?i.displayName||i.name||"Diziyou 1080p":n.startsWith("hdfb_")||r.includes("hdfilmizle")?i.displayName||i.name||"HDF 1080p":n.startsWith("kvip_")||r.includes("kids vip")?i.displayName||i.name||"⚡ Kids VIP Direct 1080p":n.startsWith("az_")||n.startsWith("anizium_")||r.includes("anizium")||r.includes("az ")?i.displayName||i.name||"AZ 4K/1080p VIP":n.startsWith("acx_")||r.includes("animecix")?i.displayName||i.name||"AX Tau Direct 1080p":n.startsWith("szd_")?d.includes("vidmoly")?"SZ VidMoly 1080p":d.includes("sibnet")?"SZ Sibnet HD":i.displayName||i.name||"SZ 1080p":i.displayName||i.name||"VIP 1080p"}function Oo(i,s,d){const r=i.streamUrl||i.url||(typeof i.getUrl=="function"?i.getUrl():"")||"",n=Wo(i,s)||d;let l=i.badge||(s==="dubbed"?"⚡ TR Dublaj":"💬 TR Altyazı");const u=n.toLowerCase();return u.includes("hdfc")||u.includes("hdfilmcehennemi")?l=s==="dubbed"?"🔥 HDFC Dublaj 1080p":"💬 HDFC Altyazı 1080p":u.includes("dzb")||u.includes("dizibal")||u.includes("dp")?l=s==="dubbed"?"⚡ DP Dublaj":"💬 DP Altyazı":u.includes("ds")?l=s==="dubbed"?"⚡ DS Dublaj":"💬 DS Altyazı":u.includes("az ")||u.includes("az 4k")||u.includes("az 1080p")||u.includes("anizium")?l=i.badge||(s==="dubbed"?"⚡ AZ 4K Dublaj":"⚡ AZ 4K Altyazı"):u.includes("swx")?l="⚡ SWX 1080p":u.includes("tvr")?l="⚡ TVR 1080p":u.includes("lookmovie")?l="🎬 LookMovie 1080p":u.includes("2embed")?l="⚡ 2Embed 1080p":u.includes("vidsrc")&&(l="🎬 VidSrc 1080p"),{...i,id:i.id||`stream_${Math.random().toString(36).slice(2,9)}`,name:n,displayName:n,streamUrl:r,url:r,badge:l,category:s,isHls:!!(i.isHls||r.includes(".m3u8")),isDirectVideo:!!(i.isDirectVideo||i.isHls||r.includes(".m3u8")||r.includes(".mp4")||r.includes(".mkv")),getUrl:()=>r}}function Fo(i){const s=(i.url||i.streamUrl||(typeof i.getUrl=="function"?i.getUrl():"")||"").toLowerCase();if(!s||s.length<8)return!1;const d=(i.id||"").toLowerCase(),r=(i.displayName||i.name||"").toLowerCase();if(d.startsWith("torrent_p2p_"))return!0;if(i.isTorrent&&!d.startsWith("torrent_p2p_")||d.includes("yts")||r.includes("yts")||s.includes("yts.mx")||s.includes("pichive")||s.includes("hotlinger")||s.includes("diziyo.so")&&!s.includes(".m3u8"))return!1;const n=["recaptcha","media.cm","cloudvideo.tv","vidoza.net","voe.sx","bysejikuar","filemoon","hdfilmdelisi","play.liderfilm"];for(const l of n)if(s.includes(l))return!1;return!0}function kt(i){(i.url||i.streamUrl||(typeof i.getUrl=="function"?i.getUrl():"")||"").toLowerCase();const s=(i.displayName||i.name||"").toLowerCase(),d=(i.id||"").toLowerCase();return d.startsWith("hdfc_")||s.includes("hdfilmcehennemi")||s.includes("hdfc")?0:d.startsWith("dzb_")||d.startsWith("dzp_")||s.includes("dp 1080p")||s.includes("dp ")||s.includes("dizibal")?1:d.startsWith("dzs_")||s.includes("dizisol")||s.includes("ds 1080p")||s.includes("ds ")?2:d.startsWith("snx")||s.includes("sinewix")||s.includes("swx")?i.isMkv||s.includes("mkv")?9:3:d.startsWith("tvr_")||s.includes("tvr")||s.includes("rectv")||d.startsWith("ddz_")||s.includes("dramadizilerim")||s.includes("ddz vip")?4:d.startsWith("lookmovie_")||s.includes("lookmovie")?5:d.startsWith("dzy_")||s.includes("diziyo")?6:d.startsWith("dyu_")||s.includes("diziyou")?7:d.startsWith("szd_")||s.includes("sezonluk")?8:d.startsWith("hdfb_")||s.includes("hdfilmizle")||s.includes("hdf ")?9:d.startsWith("torrent_p2p_")?10:d.startsWith("vidsrc_")||s.includes("vidsrc")?11:d.startsWith("twoembed_")||s.includes("2embed")?12:d.startsWith("smashystream_")||s.includes("smashy")?13:d.startsWith("az_")||d.startsWith("anizium_")||s.includes("anizium")||s.includes("az ")?2:d.startsWith("kvip_")||s.includes("kids vip")?14:d.startsWith("acx_")||s.includes("animecix")?15:d.startsWith("atr_")||s.includes("animetr")?17:20}async function Ko({type:i="movie",tmdbId:s=null,imdbId:d=null,title:r="",originalTitle:n="",seriesTitle:l="",year:u=null,season:c=1,episode:p=1,onUpdate:g=()=>{}}){const v=i==="movie",m=Ti(l||r),$=`${i}_${s||m}_s${c}_e${p}`,D=S=>Array.isArray(S)?S.map(z=>{if(!z)return z;const P=z.streamUrl||z.url||"";return{...z,streamUrl:P,url:P,getUrl:()=>P}}):[];if(!Jt.has($))try{const S=sessionStorage.getItem(`cp_streams_${Qa}_${$}`);if(S){const z=JSON.parse(S);if(z&&(z.dubbed?.length||z.subtitled?.length)){const P={...z,dubbed:D(z.dubbed),subtitled:D(z.subtitled)};Jt.set($,P)}}}catch{}if(Jt.has($)){const S=Jt.get($),z={...S,dubbed:D(S.dubbed),subtitled:D(S.subtitled)};g({...z,isComplete:!1}),Jt.delete($);try{sessionStorage.removeItem(`cp_streams_${Qa}_${$}`)}catch{}}let y=yr(m,n),C=u;const N=s?jo(i,s,m,n).catch(()=>null):Promise.resolve(null);let B=[],q=[];const L=new Set,U=new Set,f=(S,z)=>{if(!Array.isArray(S)||S.length===0)return[];const P=S.filter(Fo),oe=[];for(const ue of P){const Be=Oo(ue,z,z==="dubbed"?"VIP 1080p":"VIP Altyazılı"),xt=(Be.streamUrl||Be.url||"").trim().toLowerCase(),Q=`${(Be.id||"").toLowerCase().split("_").slice(0,2).join("_")}||${xt}`;z==="dubbed"?L.has(Q)||(L.add(Q),B.push(Be),B.sort((Ci,ne)=>kt(Ci)-kt(ne)),oe.push(Be)):U.has(Q)||(U.add(Q),q.push(Be),q.sort((Ci,ne)=>kt(Ci)-kt(ne)),oe.push(Be))}const Le=[...q,...B].find(ue=>Array.isArray(ue.subtitles)&&ue.subtitles.length>0)?.subtitles;if(Le&&Le.length>0){for(const ue of q)(!Array.isArray(ue.subtitles)||ue.subtitles.length===0)&&(ue.subtitles=Le);for(const ue of B)(!Array.isArray(ue.subtitles)||ue.subtitles.length===0)&&(ue.subtitles=Le)}return oe.length>0&&g({dubbed:[...B],subtitled:[...q],totalServers:B.length+q.length,isComplete:!1,newStream:oe[0],isDubbedStream:z==="dubbed"}),oe},w=i==="anime",F=[qr({type:i,title:m,originalTitle:n,season:c,episode:p,year:C}).then(S=>{if(!Array.isArray(S)||S.length===0)return[];const z=S.filter(oe=>{const Le=`${oe.name||""} ${oe.badge||""}`.toLowerCase();return Le.includes("dublaj")||Le.includes("tr dub")}),P=S.filter(oe=>{const Le=`${oe.name||""} ${oe.badge||""}`.toLowerCase();return!Le.includes("dublaj")&&!Le.includes("tr dub")});z.length>0&&f(z,"dubbed"),P.length>0&&f(P,"subtitled"),z.length===0&&P.length===0&&S.length>0&&f(S,"subtitled")}).catch(()=>[]),ro({type:i,titles:y,title:m,seriesTitle:m,originalTitle:n,year:C,season:c,episode:p,imdbId:d,isDub:null}).then(S=>{if(!Array.isArray(S)||S.length===0)return;const z=S.filter(oe=>oe.category==="subtitled"||(oe.badge||"").includes("Altyazı")),P=S.filter(oe=>!z.includes(oe));f(P,"dubbed"),f(z,"subtitled")}).catch(()=>[]),(v?ia({titles:y,title:m,originalTitle:n}):ta({titles:y,seriesTitle:m,originalTitle:n,season:c,episode:p})).then(S=>{if(!(!Array.isArray(S)||S.length===0))for(const z of S)f([{...z,id:`${z.id}_dub`,name:v?"DP DiziBal Player (TR Dublaj)":`DP DiziBal Player Dublaj S${c}B${p}`,displayName:v?"DP DiziBal Player (TR Dublaj)":`DP DiziBal Player Dublaj (S${c}B${p})`,badge:"🌐 DiziBal Orijinal Player",category:"dubbed"}],"dubbed"),f([{...z,id:`${z.id}_sub`,name:v?"DP DiziBal Player (TR Altyazı)":`DP DiziBal Player Altyazı S${c}B${p}`,displayName:v?"DP DiziBal Player (TR Altyazı)":`DP DiziBal Player Altyazı (S${c}B${p})`,badge:"🌐 DiziBal Orijinal Player",category:"subtitled"}],"subtitled")}).catch(()=>[]),(v?Vn({titles:y,tmdbId:s,title:m,originalTitle:n}):ts({titles:y,tmdbId:s,seriesTitle:m,originalTitle:n,season:c,episode:p})).then(S=>{if(!(!Array.isArray(S)||S.length===0))for(const z of S)f([{...z,id:`${z.id}_dub`,name:z.name?z.name.replace(/\(Altyazı\)/i,"(TR Dublaj)"):"DS 1080p (TR Dublaj)",displayName:z.displayName?z.displayName.replace(/\(Altyazı\)/i,"(TR Dublaj)"):"DS 1080p (TR Dublaj)",badge:"⚡ TR Dublaj",category:"dubbed"}],"dubbed"),f([{...z,id:`${z.id}_sub`,name:z.name?z.name.replace(/\(Dublaj\)/i,"(TR Altyazı)"):"DS 1080p (TR Altyazı)",displayName:z.displayName?z.displayName.replace(/\(Dublaj\)/i,"(TR Altyazı)"):"DS 1080p (TR Altyazı)",badge:"💬 TR Altyazı",category:"subtitled"}],"subtitled")}).catch(()=>[]),v?Xn({titles:y,title:m,originalTitle:n,isDub:!0}).then(S=>f(S,"dubbed")).catch(()=>[]):Yn({titles:y,seriesTitle:m,originalTitle:n,season:c,episode:p,isDub:!0}).then(S=>f(S,"dubbed")).catch(()=>[]),v?Xn({titles:y,title:m,originalTitle:n,isDub:!1}).then(S=>f(S,"subtitled")).catch(()=>[]):Yn({titles:y,seriesTitle:m,originalTitle:n,season:c,episode:p,isDub:!1}).then(S=>f(S,"subtitled")).catch(()=>[]),$o({titles:y,seriesTitle:m,title:m,originalTitle:n,season:c,episode:p,isDub:!1}).then(S=>{Array.isArray(S)&&S.length>0&&(f(S,"subtitled"),f(S.map(z=>({...z,id:`${z.id}_dub`,name:(z.name||"Diziyou").replace(/\s*\(TR Altyazı\)/i,""),category:"dubbed"})),"dubbed"))}).catch(()=>[]),ea({titles:y,seriesTitle:m,originalTitle:n,season:c,episode:p,isDub:!0}).then(S=>f(S,"dubbed")).catch(()=>[]),ea({titles:y,seriesTitle:m,originalTitle:n,season:c,episode:p,isDub:!1}).then(S=>f(S,"subtitled")).catch(()=>[]),v?Xa({titles:y,title:m,originalTitle:n,isDub:!0}).then(S=>f(S,"dubbed")).catch(()=>[]):Promise.resolve([]),v?Xa({titles:y,title:m,originalTitle:n,isDub:!1}).then(S=>f(S,"subtitled")).catch(()=>[]):Promise.resolve([]),v?Za({titles:y,title:m,originalTitle:n,year:C,isDub:!0}).then(S=>f(S,"dubbed")).catch(()=>[]):Ja({titles:y,seriesTitle:m,season:c,episode:p,isDub:!0}).then(S=>f(S,"dubbed")).catch(()=>[]),v?Za({titles:y,title:m,originalTitle:n,year:C,isDub:!1}).then(S=>f(S,"subtitled")).catch(()=>[]):Ja({titles:y,seriesTitle:m,season:c,episode:p,isDub:!1}).then(S=>f(S,"subtitled")).catch(()=>[]),v?sa({titles:y,title:m,originalTitle:n,isDub:!0}).then(S=>f(S,"dubbed")).catch(()=>[]):Ga({titles:y,seriesTitle:m,title:m,originalTitle:n,season:c,episode:p,isDub:!0}).then(S=>f(S,"dubbed")).catch(()=>[]),v?sa({titles:y,title:m,originalTitle:n,isDub:!1}).then(S=>f(S,"subtitled")).catch(()=>[]):Ga({titles:y,seriesTitle:m,title:m,originalTitle:n,season:c,episode:p,isDub:!1}).then(S=>f(S,"subtitled")).catch(()=>[]),Promise.resolve(To({type:i,tmdbId:s,season:c,episode:p})).then(S=>f(S,"subtitled")).catch(()=>[]),Co({type:i,title:m,originalTitle:n,season:c,episode:p}).then(S=>f(S,"subtitled")).catch(()=>[]),w?Kn({titles:y,seriesTitle:m,title:m,originalTitle:n,season:c,episode:p,isDub:!0}).then(S=>f(S,"dubbed")).catch(()=>[]):Promise.resolve([]),w?Kn({titles:y,seriesTitle:m,title:m,originalTitle:n,season:c,episode:p,isDub:!1}).then(S=>f(S,"subtitled")).catch(()=>[]):Promise.resolve([]),w?co({titles:y,seriesTitle:m,title:m,originalTitle:n,season:c,episode:p,isDub:!0}).then(S=>f(S,"dubbed")).catch(()=>[]):Promise.resolve([]),er({type:i,titles:y,seriesTitle:m,title:m,originalTitle:n,season:c,episode:p,isDub:!0}).then(S=>f(S,"dubbed")).catch(()=>[]),er({type:i,titles:y,seriesTitle:m,title:m,originalTitle:n,season:c,episode:p,isDub:!1}).then(S=>f(S,"subtitled")).catch(()=>[]),Do({type:i,tmdbId:s,season:c,episode:p}).then(S=>{Array.isArray(S)&&S.length>0&&f(S,"subtitled")}).catch(()=>[]),Io({type:i,tmdbId:s,imdbId:d,title:m,originalTitle:n,season:c,episode:p}).then(S=>{if(!Array.isArray(S)||S.length===0)return[];for(const z of S)f([{...z,id:`${z.id}_dub`,name:v?"HDFilmCehennemi Dublaj 1080p":`HDFilmCehennemi Dublaj S${c}B${p}`,displayName:v?"HDFilmCehennemi Dublaj (1080p)":`HDFilmCehennemi Dublaj (S${c}B${p})`,badge:"🔥 HDFC Dublaj 1080p",category:"dubbed"}],"dubbed"),f([{...z,id:`${z.id}_sub`,name:v?"HDFilmCehennemi Altyazı 1080p":`HDFilmCehennemi Altyazı S${c}B${p}`,displayName:v?"HDFilmCehennemi Altyazı (1080p)":`HDFilmCehennemi Altyazı (S${c}B${p})`,badge:"💬 HDFC Altyazı 1080p",category:"subtitled"}],"subtitled")}).catch(S=>[]),v?Promise.resolve([]):Pn({titles:y,seriesTitle:m,season:c,episode:p,isDub:!0}).then(S=>f(S,"dubbed")).catch(()=>[]),v?Promise.resolve([]):Pn({titles:y,seriesTitle:m,season:c,episode:p,isDub:!1}).then(S=>f(S,"subtitled")).catch(()=>[])],se=N.then(S=>{if(!S?.candidateTitles?.length)return[];const z=S.candidateTitles.filter(oe=>!y.includes(oe));if(!z.length)return[];y=S.candidateTitles,!C&&S.detectedYear&&(C=S.detectedYear);const P=[v?ia({titles:z,title:m,originalTitle:n,isDub:!1}).then(oe=>f(oe,"subtitled")):ta({titles:z,seriesTitle:m,originalTitle:n,season:c,episode:p,isDub:!1}).then(oe=>f(oe,"subtitled")),v?Promise.resolve([]):ea({titles:z,seriesTitle:m,originalTitle:n,season:c,episode:p,isDub:!0}).then(oe=>f(oe,"dubbed")),v?Promise.resolve([]):ea({titles:z,seriesTitle:m,originalTitle:n,season:c,episode:p,isDub:!1}).then(oe=>f(oe,"subtitled"))];return Promise.allSettled(P)}),K=v?[ta({titles:y,seriesTitle:m,originalTitle:n,season:c,episode:p,isDub:!0}).then(S=>f(S,"dubbed")).catch(()=>[]),ta({titles:y,seriesTitle:m,originalTitle:n,season:c,episode:p,isDub:!1}).then(S=>f(S,"subtitled")).catch(()=>[]),ts({titles:y,tmdbId:s,seriesTitle:m,originalTitle:n,season:c,episode:p}).then(S=>f(S,"subtitled")).catch(()=>[]),Ga({titles:y,seriesTitle:m,title:m,originalTitle:n,season:c,episode:p,isDub:!1}).then(S=>f(S,"subtitled")).catch(()=>[]),Ja({titles:y,seriesTitle:m,season:c,episode:p,isDub:!1}).then(S=>f(S,"subtitled")).catch(()=>[])]:[ia({titles:y,title:m,originalTitle:n,isDub:!0}).then(S=>f(S,"dubbed")).catch(()=>[]),ia({titles:y,title:m,originalTitle:n,isDub:!1}).then(S=>f(S,"subtitled")).catch(()=>[]),Vn({titles:y,tmdbId:s,title:m,originalTitle:n}).then(S=>f(S,"subtitled")).catch(()=>[]),sa({titles:y,title:m,originalTitle:n,isDub:!0}).then(S=>f(S,"dubbed")).catch(()=>[]),sa({titles:y,title:m,originalTitle:n,isDub:!1}).then(S=>f(S,"subtitled")).catch(()=>[]),Xa({titles:y,title:m,originalTitle:n,isDub:!1}).then(S=>f(S,"subtitled")).catch(()=>[]),Za({titles:y,title:m,originalTitle:n,year:C,isDub:!1}).then(S=>f(S,"subtitled")).catch(()=>[])];await Promise.allSettled([...F,...K,se]);const R=m||n||"",V=v?`/api/subtitles?tmdbId=${s||""}&imdbId=${d||""}&title=${encodeURIComponent(R)}&type=movie`:`/api/subtitles?tmdbId=${s||""}&imdbId=${d||""}&title=${encodeURIComponent(R)}&season=${c}&episode=${p}&type=tv`;for(const S of B)!Array.isArray(S.subtitles)||S.subtitles.length===0?S.subtitles=[{label:"OpenSubtitles (Türkçe)",src:V}]:S.subtitles.some(z=>(z.label||"").includes("Türkçe")||z.src?.includes("/api/subtitles"))||S.subtitles.push({label:"OpenSubtitles (Türkçe)",src:V});for(const S of q)(!Array.isArray(S.subtitles)||S.subtitles.length===0)&&(S.subtitles=[{label:"OpenSubtitles (Türkçe)",src:V}]);const ge=S=>{const z=new Set,P=[];for(const oe of S){const Le=(oe.id||"").toLowerCase().split("_").slice(0,2).join("_"),ue=(oe.displayName||oe.name||oe.id).toLowerCase().trim(),Be=`${Le}||${ue}`;z.has(Be)||(z.add(Be),P.push(oe))}return P},pe=ge(B).sort((S,z)=>kt(S)-kt(z)),Ae=ge(q).sort((S,z)=>kt(S)-kt(z)),mt={dubbed:pe,subtitled:Ae,totalServers:pe.length+Ae.length,isComplete:!0};if(mt.totalServers>0){Jt.set($,mt);try{sessionStorage.setItem(`cp_streams_${Qa}_${$}`,JSON.stringify(mt))}catch{}}return g(mt),mt}const Di="cinepulse_source_health_v1",ns="cinepulse_last_source_v1",gr=180,Vo=80;function _i(i,s={}){try{const d=JSON.parse(localStorage.getItem(i)||"");return d&&typeof d=="object"?d:s}catch{return s}}function rs(i,s){try{localStorage.setItem(i,JSON.stringify(s))}catch{}}function os(i,s){return Object.fromEntries(Object.entries(i).sort(([,d],[,r])=>Number(r?.updatedAt||0)-Number(d?.updatedAt||0)).slice(0,s))}function St(i){return String(i||"").toLocaleLowerCase("tr-TR").replace(/https?:\/\/[^/]+/g,"").replace(/\b\d{2,}\b/g,"").replace(/[^a-z0-9çğıöşü]+/gi," ").trim()}function Yo(){const i=navigator.userAgent||"",s=/android|iphone|ipad|ipod/i.test(i)?"mobile":"desktop";return`${/firefox/i.test(i)?"firefox":/safari/i.test(i)&&!/chrome|chromium|android/i.test(i)?"safari":/edg/i.test(i)?"edge":"chromium"}-${s}`}function ls(i,s=""){const d=St(i?.source||i?.provider||""),r=St(String(i?.id||"").replace(/_[a-z0-9]{5,}$/i,"")),n=St(i?.displayName||i?.name||"");return`${St(s||i?.category)}|${d||r}|${n||r}`}function vr(i,s){if(!i||!s)return!1;const d=ls(i,s.category),r=ls(s,s.category);if(d===r)return!0;const n=St(i.source||i.provider||""),l=St(s.provider||""),u=St(i.displayName||i.name||""),c=St(s.name||"");return!!(n&&l&&n===l&&(!u||!c||u===c||u.includes(c)||c.includes(u)))}function ds(i,s){return`${Yo()}|${ls(i,s)}`}function tr(i,{contentKey:s="",category:d=""}={}){if(!Array.isArray(i)||i.length<2)return Array.isArray(i)?i.slice():[];const r=_i(Di),n=_i(ns)[s];return i.map((l,u)=>{const c=r[ds(l,d)]||{},p=n&&vr(l,n)?1e3:0,g=Math.min(12,Number(c.successes)||0)*3,v=Math.min(12,Number(c.failures)||0)*7,m=c.lastFailureAt&&Date.now()-c.lastFailureAt<1e3*60*60*6?20:0;return{source:l,index:u,score:p+g-v-m}}).sort((l,u)=>u.score-l.score||l.index-u.index).map(l=>l.source)}function Xo({contentKey:i,category:s="",source:d}){if(!d)return;const r=_i(Di),n=ds(d,s),l=r[n]||{};if(r[n]={successes:Math.min(20,(Number(l.successes)||0)+1),failures:Math.max(0,(Number(l.failures)||0)-1),lastSuccessAt:Date.now(),updatedAt:Date.now()},rs(Di,os(r,gr)),i){const u=_i(ns);u[i]={category:s,provider:String(d.source||d.provider||""),id:String(d.id||""),name:String(d.displayName||d.name||""),updatedAt:Date.now()},rs(ns,os(u,Vo))}}function ir({category:i="",source:s}){if(!s)return;const d=_i(Di),r=ds(s,i),n=d[r]||{};d[r]={successes:Number(n.successes)||0,failures:Math.min(20,(Number(n.failures)||0)+1),lastFailureAt:Date.now(),updatedAt:Date.now()},rs(Di,os(d,gr))}const na="4e44d9029b1270a757cddc766a1bcb63";let ra=null,oa=null,Qt=null,ae=null,Ye=null;async function es({type:i="movie",isAnime:s=!1,isSeries:d=null,tmdbId:r,title:n="",seriesTitle:l="",originalTitle:u="",season:c=1,episode:p=1,posterPath:g="",backdropPath:v="",playerVariant:m="",seriesOverview:$="",episodeArtworkPath:D="",shortDramaEpisodes:y=[],offlinePlaybackUrl:C="",offlineMediaKind:N="file",currentTime:B=0,duration:q=0,seasonsList:L=[],maxEpisodes:U=0,roomSync:f=null}){const w=document.getElementById("player-modal");if(!w)return;w.classList.toggle("player-variant-short-drama",m==="short-drama"),ra?.();let F=!1,se=0,K=0,R=Oa();const V=Oa(),{setTimeout:ge,clearTimeout:pe,setInterval:Ae,clearInterval:mt}=V;function S(){K++;const e=w.querySelector("#hls-video-player"),a=e?e.paused:!0;e&&typeof e._persistProgress=="function"?e._persistProgress(!0,a):ft(Qe,Ge,null,!0,!0),R.dispose(),R=Oa();for(const t of[ae,Ye])try{t?.destroy()}catch{}ae=Ye=null;try{destroyTorrentStream()}catch{}w.querySelectorAll("video, audio").forEach(t=>{try{for(t.pause(),t.removeAttribute("src");t.firstChild;)t.removeChild(t.firstChild);t.load()}catch{}}),w.querySelectorAll("iframe").forEach(t=>{try{t.src="about:blank",t.remove()}catch{}})}Qt||(Qt=window.open),window.open=function(e,a,t){return typeof e=="string"&&["api.themoviedb.org","image.tmdb.org"].some(h=>e.startsWith(h))?Qt.call(window,e,a,t):{closed:!0,focus:()=>{},blur:()=>{},close:()=>{},location:{href:""}}},window.onbeforeunload=function(e){document.getElementById("player-modal")&&document.getElementById("player-modal").classList.contains("hidden")};let z=Number(c)||1,P=Number(p)||1,oe=Array.isArray(L)?L:[],Le=Number(U)||0,ue=z,Be=new Map,xt=!1,ii=!1,Me=!!(s||i==="anime"||r&&Nr(r)||Hr({id:r,title:n}));Me&&r&&qn(r);const Q=typeof d=="boolean"?d:i==="tv"||i!=="movie"&&(Array.isArray(L)&&L.length>0||c&&Number(c)>1||p&&Number(p)>1),ne=(l||n||"").replace(/\s*-\s*S\d+E\d+.*$/i,"").replace(/\s*-\s*S\d+.*$/i,"").replace(/\s*-\s*\d+\.\s*Sezon.*$/i,"").replace(/\s*:\s*.*$/,"").replace(/\s*\(\d{4}\).*/,"").trim(),wr=document.title;let Mt=$||"",zt="",ai=[],pa="",Ii=[],At=0,Li="",ma=0,Tt=[],si=!1;if(r){const e=!Q&&i==="movie",a=e?`https://api.themoviedb.org/3/movie/${r}?append_to_response=credits,similar,recommendations&api_key=${na}&language=tr-TR`:`https://api.themoviedb.org/3/tv/${r}?append_to_response=credits,similar,recommendations&api_key=${na}&language=tr-TR`;fetch(a).then(t=>t.json()).then(t=>{if(!F&&t){if(!g&&t.poster_path&&(g=t.poster_path),!v&&t.backdrop_path&&(v=t.backdrop_path),Sa(),t.overview&&(Mt=t.overview),Array.isArray(t.genres)&&(ai=t.genres.map(T=>T.name)),e){if(t.runtime&&(At=t.runtime),t.release_date&&(Li=t.release_date.substring(0,4)),t.vote_average&&(ma=Number(t.vote_average.toFixed(1))),t.credits&&Array.isArray(t.credits.crew)){const A=t.credits.crew.find(k=>k.job==="Director");A&&(pa=A.name)}t.credits&&Array.isArray(t.credits.cast)&&(Ii=t.credits.cast.slice(0,10)),Tt=(t.recommendations?.results?.length>0?t.recommendations.results:t.similar?.results||[]).filter(A=>A.poster_path).slice(0,12),xs()}const o=t.recommendations?.results?.length>0?t.recommendations.results:t.similar?.results||[];o.length>0&&(Tt=o.filter(T=>T.poster_path).slice(0,12)),Ss();const h=t.original_language==="ja"||Array.isArray(t.origin_country)&&t.origin_country.includes("JP"),x=Array.isArray(t.genres)&&t.genres.some(T=>T.id===16||/anim/i.test(T.name));h&&x&&(Me=!0,qn(r)),Q&&t.seasons&&oe.length===0&&(oe=t.seasons.filter(T=>T.season_number>0),Bs(),xt&&Dt())}}).catch(()=>{})}const us=Nn(r,z,P);let De=B||(us?us.currentTime:0),_e=Zt(r,z,P);const Ge=q>0?q:i==="movie"?6600:3e3;let Qe=De,fa=!1;const ha=e=>{[document.getElementById("btn-toggle-watched-player"),document.getElementById("btn-toggle-watched-mobile")].forEach(o=>{if(!o)return;const h=o.querySelector("span"),x=o.querySelector("[data-lucide]");h&&(h.textContent=e?"İzlendi":"İzlendi Yap"),x&&x.setAttribute("data-lucide",e?"check-circle-2":"check"),e?o.classList.add("watched-active"):o.classList.remove("watched-active")});const a=document.getElementById("btn-toggle-list");if(a){const o=a.querySelector("#list-action-label"),h=a.querySelector("[data-lucide]");o&&(o.textContent=e?"İzlendi":"Listeme Ekle"),h&&h.setAttribute("data-lucide",e?"check-circle-2":"plus"),e?a.classList.add("watched-active"):a.classList.remove("watched-active")}if(Q){const o=document.getElementById("dizisol-episodes-carousel");if(o){const h=o.querySelector(`.dizisol-ep-card[data-season="${z}"][data-episode="${P}"]`);if(h){h.classList.toggle("is-watched-card",e);const x=h.querySelector(".dizisol-ep-watch-toggle");x&&(x.classList.toggle("is-watched",e),x.setAttribute("title",e?"İzlendi (Kaldırmak için tıkla)":"İzlendi Olarak İşaretle"),x.innerHTML=`
              <i data-lucide="${e?"check-circle-2":"eye"}" style="width: 13px; height: 13px;"></i>
              <span class="ep-watch-text">${e?"İzlendi":"İşaretle"}</span>
            `);const T=h.querySelector(".dizisol-ep-title");if(T){const A=T.getAttribute("data-base-title")||T.textContent.replace(/\s*✓.*$/,"");T.textContent=`${A}${e?" ✓":""}`}}}}const t=document.getElementById("btn-toggle-list");t&&de(t)};let ba=0;const ft=(e,a,t=null,o=!1,h=!1)=>{if(!r)return;const x=Math.max(0,Math.round(e??Qe??0)),T=Math.max(0,Math.round(a||Ge||0));Qe=x;const A=Date.now();if(!o&&A-ba<15e3)return;ba=A;const k=T>0?Math.min(100,Math.round(x/T*100)):0,H=t!==null?t:_e||k>=90;H&&!_e&&(_e=!0,ha(!0)),jn({id:r,title:ne,posterPath:g,backdropPath:v,type:Me?"anime":Q?"tv":"movie",isAnime:Me,isSeries:Q,season:Q?z:void 0,episode:Q?P:void 0,currentTime:x,duration:T>0?T:Ge,completed:H});try{const X={tmdbId:r,seriesTitle:Q?u||ne:void 0,title:u||ne,isSeries:!!Q,type:Q?"tv":"movie",season:Q?z:void 0,episode:Q?P:void 0};H?Vr(X,k):h?Yr(X,k):Xr(X,k)}catch{}};function ps(){oa&&mt(oa),oa=Ae(()=>{const e=document.getElementById("hls-video-player");e&&!isNaN(e.currentTime)?!e.paused&&!e.seeking&&ft(e.currentTime,e.duration,null,!1):document.visibilityState==="visible"&&Re&&(Qe+=15,ft(Qe,Ge,null,!1))},15e3)}const Bi=()=>{const e=document.getElementById("hls-video-player");e&&typeof e._persistProgress=="function"?e._persistProgress(!0,!0):ft(Qe,Ge,null,!0,!0)};window.addEventListener("pagehide",Bi),window.addEventListener("beforeunload",Bi);let te="dubbed",Y=[],ce=0;const ya=()=>`${i}:${r||ne}:s${z}:e${P}`;let we={dubbed:[],subtitled:[]},et=!0,Re=!1,Rt=!1,Et=null,ni=0,ms=!1,Ee="smooth",ri=!1,Ut=!1,oi=!1,Pt=0;const ga=new Map,va=new Map,qt=new Map,fs=new Map;let Mi=null,wa=null;function ka(e){if(!f||!e||e.roomCode!==f.roomCode||String(e.mediaId)!==String(f.mediaId)||e.type!==f.type)return;if(e.action==="fullscreen-request"||e.requestFullscreen){xr();return}const a=Number(e.issuedAt)||0;if(a&&a<ni)return;if(e.source&&(e.action!=="state"||!tt)&&(tt=e.source,ks()||!$s())){Et=e;return}if(e.type==="tv"&&(Number(e.season)!==z||Number(e.episode)!==P)){Et=e,Rt=!0,_t(Number(e.season)||1,Number(e.episode)||1).finally(()=>{Rt=!1});return}const t=w.querySelector("#hls-video-player");if(!t){Et=e;return}const o=e.action==="state",h=Number(e.time),x=Number.isFinite(h)?h-t.currentTime:0,T=()=>{try{for(let O=0;O<t.buffered.length;O+=1)if(t.buffered.start(O)<=h+.15&&t.buffered.end(O)>=h+1)return!0}catch{}return!1},A=Ee==="smooth",k=A&&!ms&&o,H=k&&Number.isFinite(h)&&Math.abs(x)<=120;A&&o&&(ms=!0);const X=A?H&&Math.abs(x)>.25||!o&&e.action==="seek"&&Number.isFinite(h)&&Math.abs(x)>.25:!o&&Number.isFinite(h)&&Math.abs(x)>.25||o&&Math.abs(x)>18&&t.readyState>=HTMLMediaElement.HAVE_FUTURE_DATA&&T(),be=typeof e.playing=="boolean"&&e.playing===t.paused&&(!o&&(!A||e.action==="play"||e.action==="pause")||k),G=!!e.settings&&!o&&!A,j=!!(e.audioTrack&&typeof t._setAudioTrack=="function")&&!o&&!A;if(!X&&!be&&!G&&!j){a&&(ni=Math.max(ni,a));return}if(Rt=!0,X)try{t.currentTime=Math.max(0,h)}catch{}G&&(Oe.brightness=Math.max(30,Math.min(150,Number(e.settings.brightness)||100)),Oe.speed=Math.max(.5,Math.min(2,Number(e.settings.speed)||1)),t.style.filter=`brightness(${Oe.brightness/100})`,t.playbackRate=Oe.speed,Number.isFinite(Number(e.settings.volume))&&(t.volume=Math.max(0,Math.min(1,Number(e.settings.volume)))),typeof e.settings.muted=="boolean"&&(t.muted=e.settings.muted)),j&&t._setAudioTrack(e.audioTrack,!0),be&&(e.playing?t.play().catch(()=>{}):t.pause()),a&&(ni=Math.max(ni,a)),window.setTimeout(()=>{Rt=!1},120)}f&&V.on(window,"cinepulse:player-sync-remote",e=>ka(e.detail)),f?.initialSync&&window.setTimeout(()=>ka(f.initialSync),0);const Oe={brightness:100,speed:1};let li=0;const $a=[];function hs(){const e=w.querySelector("#room-chat-unread"),a=w.querySelector("#room-chat-unread-cloud"),t=li>=1,o=li>9?"9+":String(li);e&&(e.hidden=!t,e.textContent=o),a&&(a.hidden=!t,a.textContent=o)}function Ri(e,a=!1){if(!e?.text)return;const t=e.id||`${e.senderId||(a?"self":"guest")}:${e.sentAt||""}:${e.text}`;$a.some(A=>A.fingerprint===t)||$a.push({...e,fingerprint:t,mine:a});const o=w.querySelector("#room-chat-messages");if(!o||Array.from(o.children).some(A=>A.dataset?.roomChatId===t))return;o.querySelector("p")?.remove();const h=document.createElement("div");h.className=`room-chat-message${a?" mine":""}`,h.dataset.roomChatId=t;const x=document.createElement("strong");x.textContent=a?"Sen":e.nickname||"Misafir";const T=document.createElement("span");for(T.textContent=String(e.text).slice(0,240),h.append(x,T),o.appendChild(h);o.children.length>60;)o.firstElementChild?.remove();o.scrollTop=o.scrollHeight}function bs(e){if(!f)return;let a=w.querySelector("#room-chat-panel"),t=!1;a||(t=!0,a=document.createElement("aside"),a.id="room-chat-panel",a.className="room-chat-panel",a.innerHTML='<header><strong>Oda sohbeti</strong><button type="button" aria-label="Kapat">×</button></header><div id="room-chat-messages" class="room-chat-messages"><p>Oda sohbeti yalnızca bu oturumda kalır.</p></div><form><input maxlength="240" autocomplete="off" placeholder="Mesaj yaz…" /><button type="submit">Gönder</button></form>',a.querySelector("header button").onclick=()=>bs(!1),a.querySelector("form").onsubmit=h=>{h.preventDefault();const x=a.querySelector("input"),T=x.value.trim();if(!T)return;const A=Date.now(),k=`chat-${A}-${Math.random().toString(36).slice(2,8)}`,H=window.__cinepulseDecisionRoomPresence?.selfId||"self",X=Number(w.querySelector("#hls-video-player")?.currentTime)||0;Ri({id:k,text:T,senderId:H,nickname:"Sen",sentAt:A,at:X},!0),window.dispatchEvent(new CustomEvent("cinepulse:room-chat-send",{detail:{roomCode:f.roomCode,id:k,sentAt:A,at:X,text:T}})),x.value=""},(w.querySelector("#cinema-modal-box")||w).appendChild(a),$a.forEach(h=>Ri(h,h.mine)));const o=typeof e=="boolean"?e:t||a.classList.contains("hidden");a.classList.toggle("hidden",!o),o&&(li=0,hs(),a.querySelector("input")?.focus())}function Sa(e=null){const a=ws();if(document.title=a,!("mediaSession"in navigator)||typeof MediaMetadata>"u")return;const t=g||v,o=t?t.startsWith("http")?t:`https://image.tmdb.org/t/p/w780${t}`:"";navigator.mediaSession.metadata=new MediaMetadata({title:a,artist:Q?`${ne} · Sezon ${z}, Bölüm ${P}`:"Film",album:"",artwork:o?[{src:o,sizes:"342x513",type:"image/jpeg"},{src:o,sizes:"780x1170",type:"image/jpeg"}]:[]}),e&&(navigator.mediaSession.playbackState=e.paused?"paused":"playing")}function kr(e){if(!e||!("mediaSession"in navigator)||typeof MediaMetadata>"u")return;Sa(e);const a=()=>{const o=Number(e.duration),h=Number(e.currentTime);if(Number.isFinite(o)&&o>0&&Number.isFinite(h))try{navigator.mediaSession.setPositionState({duration:o,position:Math.min(h,o),playbackRate:e.playbackRate||1})}catch{}};["play","pause","seeked","loadedmetadata"].forEach(o=>e.addEventListener(o,()=>{navigator.mediaSession.playbackState=e.paused?"paused":"playing",a()}));const t=(o,h)=>{try{navigator.mediaSession.setActionHandler(o,h)}catch{}};t("play",()=>e.play().catch(()=>{})),t("pause",()=>e.pause()),t("seekbackward",o=>{e.currentTime=Math.max(0,e.currentTime-(o.seekOffset||10))}),t("seekforward",o=>{e.currentTime=Math.min(e.duration||1/0,e.currentTime+(o.seekOffset||10))}),t("seekto",o=>{Number.isFinite(o.seekTime)&&(e.currentTime=o.seekTime)}),a()}Sa();function ys(e){if(!f||e?.roomCode!==f.roomCode||document.fullscreenElement?.id==="hls-video-player")return;const a=w.querySelector("#player-iframe-wrapper");if(!a)return;const t=document.createElement("span");t.className="room-reaction-burst",t.textContent=e.emoji,t.style.left=`${22+Math.random()*56}%`,a.appendChild(t),window.setTimeout(()=>t.remove(),1800)}function gs(){if(!f)return;const e=w.querySelector("#player-iframe-wrapper");if(!e||e.querySelector("#room-reaction-dock"))return;const a=document.createElement("div");a.id="room-reaction-dock",a.className="room-reaction-dock",a.innerHTML=["🎬","😂","😱","❤️"].map(t=>`<button type="button" aria-label="${t} tepki gönder">${t}</button>`).join(""),a.querySelectorAll("button").forEach(t=>{t.onclick=o=>{o.stopPropagation();const h={roomCode:f.roomCode,emoji:t.textContent,mediaId:f.mediaId,type:f.type,at:Number(w.querySelector("#hls-video-player")?.currentTime)||0};ys(h),window.dispatchEvent(new CustomEvent("cinepulse:room-reaction",{detail:h}))}}),e.appendChild(a)}function $r(){let e=null;if(Q){const o=ci(z);o&&P<o?e={id:r,type:"tv",season:z,episode:P+1,title:`Sonraki bölüm · S${z} B${P+1}`}:oe.some(h=>h.season_number===z+1)&&(e={id:r,type:"tv",season:z+1,episode:1,title:`Sonraki sezon · S${z+1} B1`})}e||(e={id:r,type:Q?"tv":"movie",season:z,episode:P,title:Q?"Bu bölümü yeniden izle":"Filmi yeniden izle"});const a=Tt[0],t=a?{id:a.id,type:Q?"tv":"movie",season:1,episode:1,title:a.title||a.name||"Benzer yapım"}:{...e,title:"Benzer yapım hazırlanıyor"};return[{id:"next",icon:"⏭",label:e.title,card:e},{id:"similar",icon:"✨",label:t.title,card:t},{id:"close",icon:"👋",label:"Odayı kapat",card:null}]}function Ei(e){if(!f||!e||e.roomCode!==f.roomCode)return;const a=w.querySelector("#player-iframe-wrapper");if(!a)return;a.querySelector("#room-finish-overlay")?.remove();const t=e.votes||{},o=H=>Object.values(t).filter(X=>X===H).length,h=Ne();wa=e;const x=Mi&&String(Mi.mediaId)===String(f.mediaId)?Mi:null,T=H=>{const X=Math.max(0,Math.floor(Number(H)||0));return`${Math.floor(X/60)} dk`},A=H=>{if(!Number.isFinite(Number(H)))return"—";const X=Math.max(0,Math.floor(Number(H)));return`${Math.floor(X/60)}:${String(X%60).padStart(2,"0")}`},k=document.createElement("section");k.id="room-finish-overlay",k.className="room-finish-overlay",k.innerHTML=`
      <div class="room-finish-panel">
        <span class="room-finish-kicker">BİRLİKTE SEÇ</span>
        <h3>${Q?"Bölüm bitti. Sırada ne var?":"Film bitti. Sırada ne var?"}</h3>
        <p>${h?"Bir seçeneğe dokun; herkeste aynı anda açılacak.":"Seçimini oylayabilirsin. Moderatör herkese açar."}</p>
        ${x?`<section class="room-watch-summary"><strong><i data-lucide="sparkles"></i> Oda özeti</strong><span><b>${x.participants||1} kişi</b><small>${T(x.watchedSeconds)} birlikte</small></span><span><b>${x.topReaction?`${x.topReaction.emoji} ${x.topReaction.count}`:"—"}</b><small>en çok tepki</small></span><span><b>${A(x.topTalkSecond)}</b><small>en çok konuşulan an</small></span></section>`:""}
        <div class="room-finish-options">
          ${(e.options||[]).map(H=>`<button type="button" class="room-finish-option" data-option="${H.id}">
            <b>${H.icon}</b><span>${H.label}</span><small>${h?"Herkese aç":`${o(H.id)} oy`}</small>
          </button>`).join("")}
        </div>
      </div>`,k.querySelectorAll("[data-option]").forEach(H=>{H.onclick=X=>{X.stopPropagation();const be=(e.options||[]).find(G=>G.id===H.dataset.option);be&&(h?window.dispatchEvent(new CustomEvent("cinepulse:room-finish-choice",{detail:{roomCode:f.roomCode,action:be.id==="close"?"close":"open",card:be.card}})):(window.dispatchEvent(new CustomEvent("cinepulse:room-finish-vote",{detail:{roomCode:f.roomCode,finishId:e.id,optionId:be.id}})),H.classList.add("voted")))}}),a.appendChild(k)}function Sr(){if(!f||!Ne())return;const e={id:`${f.mediaId}-${Date.now()}`,roomCode:f.roomCode,options:$r(),votes:{}},a=w.querySelector("#hls-video-player");window.dispatchEvent(new CustomEvent("cinepulse:room-summary",{detail:{roomCode:f.roomCode,mediaId:f.mediaId,type:f.type,seconds:a?.duration||a?.currentTime||0}})),Ei(e),window.dispatchEvent(new CustomEvent("cinepulse:room-finish",{detail:e}))}function xr(){if(!f||Ne())return;w.querySelector("#room-fullscreen-invite")?.remove();const a=document.createElement("button");a.id="room-fullscreen-invite",a.className="room-fullscreen-invite",a.type="button",a.textContent="Moderatör tam ekran önerdi · Aç",a.onclick=()=>{const t=w.querySelector("#hls-video-player"),o=w.querySelector("#video-iframe"),x=w.querySelector("#direct-video-wrapper")||o||t||w.querySelector("#cinema-modal-box");x?.requestFullscreen?.().catch(()=>x?.webkitRequestFullscreen?.()),a.remove()},w.appendChild(a),window.setTimeout(()=>a.remove(),9e3)}function vs(){!f?.roomCode||!Ne()||window.dispatchEvent(new CustomEvent("cinepulse:player-sync",{detail:{roomCode:f.roomCode,mediaId:f.mediaId,type:f.type,season:z,episode:P,action:"fullscreen-request",requestFullscreen:!0,issuedAt:Date.now()}}))}f&&(V.on(window,"cinepulse:room-finish-remote",e=>Ei(e.detail)),V.on(window,"cinepulse:room-finish-vote-remote",e=>Ei(e.detail)),V.on(window,"cinepulse:room-reaction-remote",e=>ys(e.detail)),V.on(window,"cinepulse:room-summary-remote",e=>{const a=e.detail;!a||a.roomCode!==f.roomCode||String(a.mediaId)!==String(f.mediaId)||(Mi=a,wa&&Ei(wa))}),V.on(window,"cinepulse:room-chat-remote",e=>{const a=e.detail,t=a?.senderId===window.__cinepulseDecisionRoomPresence?.selfId;Ri(a,t);const o=w.querySelector("#room-chat-panel");!t&&(!o||o.classList.contains("hidden"))&&(li+=1,hs())}),V.on(window,"cinepulse:room-playback-health-remote",e=>{const a=e.detail;if(!a||a.roomCode!==f.roomCode||!Ne()||Ee!=="strict")return;ga.set(a.senderId,a.status);const t=w.querySelector("#hls-video-player"),o=Array.from(ga.values()).includes("buffering");o&&t&&!t.paused?(ri=!0,t.pause()):!o&&ri&&t?.paused&&(ri=!1,t.play().catch(()=>{}))}),V.on(window,"cinepulse:room-playback-progress-remote",e=>{const a=e.detail;if(!a||a.roomCode!==f.roomCode||!Ne()||Ee!=="smooth")return;va.set(a.senderId,a);const t=w.querySelector("#hls-video-player");if(!t||!Number.isFinite(t.currentTime))return;const o=Array.from(va.values()).filter(T=>Date.now()-T.reportedAt<25e3),h=o.reduce((T,A)=>Math.max(T,t.currentTime-A.time),0),x=a.time-t.currentTime;o.forEach(T=>{const A=t.currentTime-T.time;if(Math.abs(A)<45)return;const k=fs.get(T.senderId)||0;Date.now()-k<12e3||(fs.set(T.senderId,Date.now()),window.dispatchEvent(new CustomEvent("cinepulse:room-rhythm",{detail:{roomCode:f.roomCode,targetId:T.senderId,mediaId:f.mediaId,type:f.type,drift:A}})))}),h>=90&&!Ut&&!t.paused?(Ut=!0,Pt=Date.now()+2500,t.pause(),ee(`${a.nickname||"Katılımcı"} geride kaldı; fark büyümesin diye kısa süre bekleniyor.`,"info")):Ut&&h<=12&&t.paused&&(Ut=!1,Pt=Date.now()+2500,t.play().catch(()=>{}),ee("Katılımcı yakaladı; akıcı izleme devam ediyor.","success")),x>=90&&!qt.has(a.senderId)&&(qt.set(a.senderId,a.time),window.dispatchEvent(new CustomEvent("cinepulse:room-playback-checkpoint",{detail:{roomCode:f.roomCode,targetId:a.senderId,action:"hold",mediaId:f.mediaId,type:f.type}})))}),V.on(window,"cinepulse:room-playback-checkpoint-remote",e=>{const a=e.detail,t=window.__cinepulseDecisionRoomPresence?.selfId;if(!a||Ee!=="smooth"||a.roomCode!==f.roomCode||a.targetId!==t||String(a.mediaId)!==String(f.mediaId)||a.type!==f.type)return;const o=w.querySelector("#hls-video-player");o&&(Pt=Date.now()+2500,a.action==="hold"&&!o.paused?(oi=!0,o.pause(),ee("Moderatör geride kaldı; sana yaklaşana kadar kısa süre bekleniyor.","info")):a.action==="resume"&&oi&&o.paused&&(oi=!1,o.play().catch(()=>{}),ee("Moderatör yakaladı; akıcı izleme devam ediyor.","success")))}),V.on(window,"cinepulse:room-rhythm-remote",e=>{const a=e.detail,t=window.__cinepulseDecisionRoomPresence?.selfId;if(!a||a.roomCode!==f.roomCode||a.targetId!==t||String(a.mediaId)!==String(f.mediaId)||a.type!==f.type)return;const o=w.querySelector("#player-iframe-wrapper");if(!o)return;o.querySelector("#room-rhythm-card")?.remove();const h=Math.round(Math.abs(Number(a.drift)||0)),x=document.createElement("aside");x.id="room-rhythm-card",x.className="room-rhythm-card",x.innerHTML=Number(a.drift)>0?`<i data-lucide="clock-3"></i><span><b>${Math.ceil(h/60)} dk geridesin</b><small>Akıcı izlemeye devam et; oda seni bekliyor.</small></span>`:'<i data-lucide="clock-3"></i><span><b>Öndesin</b><small>Diğer izleyici sana yaklaşıyor.</small></span>',o.appendChild(x),de(x),window.setTimeout(()=>x.remove(),8500)}),V.on(window,"cinepulse:room-playback-finished-remote",e=>{const a=e.detail;if(!a||Ee!=="smooth"||a.roomCode!==f.roomCode||String(a.mediaId)!==String(f.mediaId)||a.type!==f.type)return;const t=a.type==="tv"?`S${a.season} B${a.episode}`:"filmi";ee(`🎬 ${a.nickname||"Bir katılımcı"} ${t} bitirdi. Sen akıcı izlemeye devam ediyorsun.`,"info")}),V.on(window,"cinepulse:decision-room-close-player",e=>{e.detail?.roomCode===f.roomCode&&ra?.()}));function ci(e){const a=oe.find(t=>t.season_number===e);return a&&a.episode_count?a.episode_count:Le>0&&e===z?Le:0}function ws(){return Q?`${ne} • S${z} B${P}`:ne}function ht(e){if(!e)return"";const a=t=>typeof t=="string"&&t.startsWith("/api/")?apiUrl(t):t||"";if(typeof e.getUrl=="function")try{const t=e.getUrl();if(t)return a(t)}catch{}return a(e.streamUrl||e.url||e.originalEmbedUrl||"")}let tt=null;function xa(e){const a=ht(e);return!!(e?.isDirectVideo||e?.isHls||a&&!a.startsWith("magnet:")&&(a.includes(".m3u8")||a.includes(".txt")||a.includes(".mp4")||a.includes(".mkv")||a.includes("mkv_stream")||a.includes(":4000/torrent/")))}function Nt(e){if(!Array.isArray(e)||e.length===0||!f)return 0;const a=e.findIndex(xa);return a>=0?a:0}function Ne(){const e=window.__cinepulseDecisionRoomPresence;return!f||!e||e.roomCode!==f.roomCode||e.isHost!==!1}function di(){return Ne()?!0:(ee("Bu odada kaynak ve bölüm kontrolü moderatörde.","info"),!1)}function Ui(e=Y[ce]){return e?{category:te,id:String(e.id||""),provider:String(e.source||""),name:String(e.displayName||e.name||""),quality:String(e.quality||"")}:null}function za(e,a){if(!e||!a)return!1;const t=H=>String(H||"").trim().toLocaleLowerCase("tr-TR"),o=t(e.id),h=t(a.id);if(o&&h&&o===h||vr(e,a))return!0;const x=t(e.source),T=t(a.provider),A=t(e.displayName||e.name),k=t(a.name);return x||T?!!(x&&T&&x===T&&(!k||A===k)):!!(A&&k&&A===k)}function Pi(){const e=Ui();if(!f?.roomCode||!e)return;const a=w.querySelector("#hls-video-player");window.dispatchEvent(new CustomEvent("cinepulse:player-sync",{detail:{roomCode:f.roomCode,mediaId:f.mediaId,type:f.type,season:z,episode:P,action:"source",source:e,audioTrack:a?._currentAudioTrack||null,settings:{...Oe,volume:a?.volume??1,muted:!!a?.muted},time:Number.isFinite(a?.currentTime)?a.currentTime:0,playing:!!(a&&!a.paused),issuedAt:Date.now()}}))}function ks(){if(!f||!tt)return!1;const e=[tt.category,"dubbed","subtitled"].filter((a,t,o)=>(a==="dubbed"||a==="subtitled")&&o.indexOf(a)===t);for(const a of e){const t=we[a]||[],o=t.findIndex(x=>za(x,tt));if(o<0)continue;const h=te!==a||!za(Y[ce],tt);return te=a,Y=t,ce=o,Re=!0,document.getElementById("tab-dubbed")?.classList.toggle("active",a==="dubbed"),document.getElementById("tab-subtitled")?.classList.toggle("active",a==="subtitled"),Ke(),Ue(),Fe(),h&&Ce(),h}return!1}function $s(){return tt?["dubbed","subtitled"].some(e=>(we[e]||[]).some(a=>za(a,tt))):!1}function Ss(){const e=document.getElementById("dizisol-genre-chips");e&&Array.isArray(ai)&&ai.length>0&&(e.innerHTML=ai.map(o=>`<span class="dizisol-genre-chip">${o}</span>`).join(""));const a=document.getElementById("dizisol-overview");a&&(Q?zt&&(a.textContent=zt):Mt&&(a.textContent=Mt));const t=document.querySelector(".dizisol-ep-badge");if(t)if(Q)t.textContent=`Sezon ${z} • Bölüm ${P}`;else{const o=At?`${Math.floor(At/60)}s ${At%60}dk`:"",h=Li||"";t.textContent=["Film",h,o].filter(Boolean).join(" • ")}}function xs(){if(Q)return;const e=document.getElementById("dizisol-movie-section");if(!e)return;const a=At?`${Math.floor(At/60)} sa ${At%60} dk`:"",t=Ii&&Ii.length>0?Ii.map(h=>{const x=h.profile_path?`https://image.tmdb.org/t/p/w185${h.profile_path}`:"https://image.tmdb.org/t/p/w185/null";return`
            <div class="player-movie-cast-chip" title="${h.name} (${h.character||""})">
              <img src="${x}" alt="${h.name}" class="player-cast-avatar" onerror="this.onerror=null; this.style.display='none';" />
              <div class="player-cast-meta">
                <span class="player-cast-name">${h.name}</span>
                ${h.character?`<span class="player-cast-role">${h.character}</span>`:""}
              </div>
            </div>
          `}).join(""):"",o=Tt&&Tt.length>0?Tt.map(h=>{const x=h.poster_path?`https://image.tmdb.org/t/p/w342${h.poster_path}`:"",T=h.vote_average?h.vote_average.toFixed(1):"",A=(h.release_date||"").substring(0,4);return`
            <div class="player-sim-card" data-sim-id="${h.id}" data-sim-title="${h.title||""}" title="${h.title||""} • İzle">
              <div class="player-sim-poster-box">
                ${x?`<img src="${x}" alt="${h.title||""}" class="player-sim-poster" loading="lazy" />`:""}
                <div class="player-sim-play-hover">
                  <i data-lucide="play" style="width:24px;height:24px;fill:#fff;color:#fff;"></i>
                </div>
                ${T?`<span class="player-sim-badge">★ ${T}</span>`:""}
              </div>
              <div class="player-sim-info">
                <span class="player-sim-title">${h.title||""}</span>
                ${A?`<span class="player-sim-year">${A}</span>`:""}
              </div>
            </div>
          `}).join(""):"";e.innerHTML=`
      <!-- Movie Quick Meta Pills Bar -->
      <div class="player-movie-meta-bar">
        ${pa?`
          <div class="player-movie-director-tag">
            <span class="meta-tag-label">YÖNETMEN:</span>
            <span class="meta-tag-val">${pa}</span>
          </div>
        `:""}
        ${a?`
          <div class="player-movie-pill">
            <i data-lucide="clock" style="width:13px;height:13px;color:#f59e0b"></i>
            <span>${a}</span>
          </div>
        `:""}
        ${ma>0?`
          <div class="player-movie-pill highlight">
            <i data-lucide="star" style="width:13px;height:13px;color:#eab308;fill:#eab308"></i>
            <span>${ma} / 10</span>
          </div>
        `:""}
        ${Li?`
          <div class="player-movie-pill">
            <i data-lucide="calendar" style="width:13px;height:13px;color:#60a5fa"></i>
            <span>${Li}</span>
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
      ${o?`
        <div class="player-movie-block">
          <div class="player-movie-block-header">
            <h4>BENZER FİLMLER & ÖNERİLER</h4>
            <span class="player-sim-count">${Tt.length} Film</span>
          </div>
          <div class="player-sim-carousel">
            ${o}
          </div>
        </div>
      `:""}
    `,e.querySelectorAll(".player-sim-card").forEach(h=>{h.addEventListener("click",()=>{const x=h.getAttribute("data-sim-id"),T=h.getAttribute("data-sim-title");x&&es({type:"movie",tmdbId:parseInt(x,10),title:T,currentTime:0})})}),de(e)}async function zs(e,a){if(m==="short-drama"||!Q||!r)return;const t=document.getElementById("dizisol-overview");let o=Be.get(e);if((!o||o.length===0)&&(o=await _a(e)),F||e!==z||a!==P)return;const h=o?o.find(x=>x.episode_number===a):null;if(h&&h.overview&&h.overview.trim().length>0){zt=h.overview.trim(),t&&(t.textContent=zt);return}try{const x=await fetch(`https://api.themoviedb.org/3/tv/${r}/season/${e}/episode/${a}?api_key=${na}&language=en-US`);if(x&&x.ok){const T=await x.json();if(T&&T.overview&&T.overview.trim().length>0){const A=await Fr(T.overview.trim());if(F||e!==z||a!==P)return;if(A&&A.trim()){zt=A.trim(),t&&(t.textContent=zt);return}}}}catch{}h&&h.name&&!h.name.toLowerCase().includes("bölüm")?t&&(t.textContent=`${h.name} - Bölüm özeti hazırlanıyor...`):Mt&&t&&(t.textContent=Mt)}function As(){const e=Y[ce];return e?e.displayName||e.name||"Sunucu":et?"Kaynak aranıyor...":"Kaynak Bulunamadı"}function Ue(){const e=document.getElementById("active-source-chip-label");e&&(e.textContent=`Kaynak: ${As()} (Değiştir)`),si&&Fe(),f&&qi(),lt()}let Ht=!1,ui=null,pi=null,ot={percent:0,loaded:0,status:""};function Aa(e=null,a=null){return e!==null&&a!==null&&e!==void 0&&a!==void 0?`${r}_s${e}_e${a}`:String(r)}function zr(e){if(!e)return!1;const a=ht(e);return a?!!(e.isDirectVideo||e.isHls||/\.(?:m3u8|mp4|m4v|webm|mkv)(?:[?#]|$)/i.test(a)||a.includes("/api/hls_proxy")||a.includes("/api/snx")||a.includes("/api/dzs")||a.includes("/api/rtv")||a.includes("/api/czm")||a.includes("/api/jet")):!1}function Ts(){const e=[],a=new Set,t=(o,h=null)=>{if(!o)return;const x=ht(o);!x||a.has(x)||zr(o)&&(a.add(x),e.push({server:o,streamUrl:x,displayName:o.displayName||o.name||"Yayın Hattı",isDirectVideo:!!(o.isDirectVideo||/\.(?:mp4|m4v|webm|mkv)(?:[?#]|$)/i.test(x)),isHls:!!(o.isHls||x.includes(".m3u8")||x.includes("/api/hls_proxy")),category:h||o.category||te}))};t(Y[ce]);for(const o of Y||[])t(o);for(const o of we?.dubbed||[])t(o,"dubbed");for(const o of we?.subtitled||[])t(o,"subtitled");return e}function Ar(){const e=Ts();return e.find(t=>t.isDirectVideo&&!t.isHls)||e[0]||null}async function lt(){const e=w.querySelector("#btn-player-download"),a=await Fa(r,Q?z:null,Q?P:null);if(F)return;if(e){const o=e.querySelector("span"),h=Aa(Q?z:null,Q?P:null);if(Ht&&pi===h)e.dataset.downloading="true",e.classList.add("is-downloading"),e.classList.remove("is-downloaded"),o&&(o.textContent=`%${ot.percent}`),e.title=`İndiriliyor: %${ot.percent}`;else if(a){e.dataset.downloaded="true",e.classList.add("is-downloaded"),e.classList.remove("is-downloading"),e.title="Bu bölüm cihaza indirildi (İndirilenler menüsünden internetsiz izleyebilirsiniz)",o&&(o.textContent="İndirildi");const x=e.querySelector("i");x&&x.setAttribute("data-lucide","check-circle-2")}else{delete e.dataset.downloaded,delete e.dataset.downloading,e.classList.remove("is-downloaded","is-downloading"),e.title="Bölümü indir / çevrimdışı kaydet",o&&(o.textContent="İndir");const x=e.querySelector("i");x&&x.setAttribute("data-lucide","download")}de(e)}const t=w.querySelectorAll(".dizisol-ep-download-btn");for(const o of t){const h=parseInt(o.getAttribute("data-season"),10),x=parseInt(o.getAttribute("data-episode"),10),T=Aa(h,x),A=await Fa(r,h,x);o.isConnected&&(Ht&&pi===T?(o.classList.add("is-downloading"),o.classList.remove("is-downloaded"),o.innerHTML=`<span style="font-size:0.6rem;font-weight:800;color:#38bdf8;">%${ot.percent}</span>`):A?(o.classList.add("is-downloaded"),o.classList.remove("is-downloading"),o.innerHTML='<i data-lucide="check-circle-2" style="width:13px;height:13px;color:#fff;"></i>'):(o.classList.remove("is-downloaded","is-downloading"),o.innerHTML='<i data-lucide="download" style="width:13px;height:13px;"></i>'),de(o))}}async function Ds(e=null,a=null){const t=Q&&(e!==null||a!==null||z!==null),o=t?e!==null?e:z:null,h=t?a!==null?a:P:null,x=Aa(o,h),T=w.querySelector("#player-download-popover"),A=w.querySelector("#download-popover-body");if(!T||!A)return;T.classList.remove("hidden");const k=!t||o===z&&h===P;let H=k?Ts():[];if(!k&&H.length===0){A.innerHTML=`
        <div class="drawer-loading" style="padding: 2.5rem 1rem; text-align: center;">
          <div class="drawer-spinner" style="margin: 0 auto 1rem;"></div>
          <p style="color:#94a3b8; font-size:0.9rem;">${o}. Sezon ${h}. Bölüm için indirme kaynakları taranıyor...</p>
        </div>
      `;try{const M=await ts({titles:[ne,l,u].filter(Boolean),seriesTitle:ne,originalTitle:u,season:o,episode:h,tmdbId:r,isDub:te==="dubbed"});Array.isArray(M)&&M.length>0&&(H=M.map(re=>({server:re,streamUrl:ht(re),displayName:re.displayName||re.name||"DS 1080p",isDirectVideo:!!re.isDirectVideo,isHls:!!re.isHls,category:te})).filter(re=>re.streamUrl))}catch{}}if(H.length===0&&k){const M=Ar();M&&H.push(M)}const X=await Fa(r,o,h),be=t?`${ne} · ${o}. Sezon ${h}. Bölüm`:ne,G=t?`${ne}_S${String(o).padStart(2,"0")}E${String(h).padStart(2,"0")}.mp4`:`${ne}.mp4`;let j=0;const O=()=>{const M=H[j]||H[0],re=Ht&&pi===x;A.innerHTML=`
        <div class="dl-modal-header-card">
          <div class="dl-modal-art">
            ${v||g?`<img src="${v||g}" alt="${be}" />`:'<i data-lucide="film"></i>'}
          </div>
          <div class="dl-modal-meta">
            <h4>${be}</h4>
            <div class="dl-modal-tags">
              <span class="dl-tag-badge dl-badge-res">1080p Full HD</span>
              <span class="dl-tag-badge dl-badge-cat">${te==="dubbed"?"🇹🇷 Türkçe Dublaj":"💬 Türkçe Altyazı"}</span>
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

        ${H.length>1?`
          <div class="dl-stream-selector-group">
            <label class="dl-selector-label"><i data-lucide="server" style="width:13px;height:13px"></i> Yayın / İndirme Hattı:</label>
            <div class="dl-stream-chips">
              ${H.map((J,ye)=>`
                <button type="button" class="dl-stream-chip ${ye===j?"active":""}" data-stream-idx="${ye}">
                  ${J.displayName||`Hat ${ye+1}`}
                  ${J.isDirectVideo?" • MP4":""}
                </button>
              `).join("")}
            </div>
          </div>
        `:""}

        ${!M&&!X?`
          <div class="dl-no-stream-warning">
            <i data-lucide="alert-circle" style="width:20px;height:20px;color:#f59e0b"></i>
            <p>Bu bölüm için şu anda doğrudan indirilebilir hat taranıyor. Lütfen birkaç saniye sonra tekrar deneyin veya oynatıcıdan başka bir hat seçin.</p>
          </div>
        `:""}

        ${M?`
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
                
                ${re?`
                  <div class="dl-progress-box">
                    <div class="dl-progress-info">
                      <span>İndiriliyor: %${ot.percent}</span>
                      <span>${ot.loaded>0?Wn(ot.loaded):""}</span>
                    </div>
                    <div class="dl-progress-track">
                      <div class="dl-progress-bar" style="width: ${ot.percent}%;"></div>
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
      `,de(A),A.querySelectorAll(".dl-stream-chip").forEach(J=>{J.addEventListener("click",()=>{j=parseInt(J.getAttribute("data-stream-idx"),10)||0,O()})}),A.querySelector("#btn-dl-play-offline")?.addEventListener("click",async()=>{T.classList.add("hidden");try{const J=await Gr(r,o,h);if(!J)throw new Error("İndirilen video açılamadı.");es({type:t?"tv":"movie",tmdbId:r,title:be,seriesTitle:ne,season:o||1,episode:h||1,posterPath:g,backdropPath:v,offlinePlaybackUrl:J,offlineMediaKind:"hls"})}catch(J){ee(J?.message||"İndirilen içerik açılamadı.","error")}}),A.querySelector("#btn-dl-delete-offline")?.addEventListener("click",async()=>{window.confirm(`“${be}” cihazdan silinsin mi?`)&&(await Zr(r,o,h),ee("İndirilen içerik silindi.","success"),lt(),O())}),A.querySelector("#btn-dl-native-start")?.addEventListener("click",()=>{M&&(ee("📥 İndirme başlatılıyor... İndirici (1DM, ADM veya Tarayıcı) açılıyor...","info"),Jr(M.streamUrl,G))}),A.querySelector("#btn-dl-copy-link")?.addEventListener("click",async()=>{if(M)try{const J=typeof M.streamUrl=="string"&&M.streamUrl.startsWith("/api/")?apiUrl(M.streamUrl):M.streamUrl;await navigator.clipboard.writeText(J),ee("📋 İndirme bağlantısı kopyalandı! 1DM, ADM veya VLC uygulamasına yapıştırabilirsiniz.","success")}catch{ee("Bağlantı kopyalanamadı.","error")}}),A.querySelector("#btn-dl-offline-start")?.addEventListener("click",async()=>{if(M){if(Ht){ee("Şu anda başka bir indirme devam ediyor.","info");return}Ht=!0,pi=x,ui=new AbortController,ot={percent:1,loaded:0,status:"Başlatılıyor..."},lt(),O(),ee(`🚀 Çevrimdışı indirme başladı: ${be}`,"info");try{await Qr({tmdbId:r,type:t?"tv":"movie",title:be,poster:g,backdrop:v,season:o,episode:h,streamUrl:M.streamUrl},J=>{ot=J;const ye=A.querySelector(".dl-progress-bar"),Se=A.querySelector(".dl-progress-info span:first-child"),W=A.querySelector(".dl-progress-info span:last-child");ye&&(ye.style.width=`${J.percent}%`),Se&&(Se.textContent=`İndiriliyor: %${J.percent}`),W&&J.loaded>0&&(W.textContent=Wn(J.loaded)),lt()},ui.signal),ee(`🎉 “${be}” başarıyla cihaza indirildi! 'İndirilenler' sekmesinden internetsiz izleyebilirsiniz.`,"success")}catch(J){J.message!=="İndirme iptal edildi"?ee(J?.message||"İndirme tamamlanamadı. Başka bir hat deneyin.","error"):ee("İndirme iptal edildi.","info")}finally{Ht=!1,pi=null,ui=null,lt(),O()}}}),A.querySelector("#btn-dl-cancel-download")?.addEventListener("click",()=>{ui&&ui.abort()})};O()}function Tr(){const e=document.getElementById("tab-dubbed-count"),a=document.getElementById("tab-subtitled-count");e&&(e.textContent=String(we.dubbed?.length||0)),a&&(a.textContent=String(we.subtitled?.length||0))}function jt(e){const a=document.getElementById("player-sources-popover");a&&(si=typeof e=="boolean"?e:!si,si?(a.classList.remove("hidden"),Fe()):a.classList.add("hidden"))}function Fe(){const e=document.getElementById("sources-popover-list");if(e){if(!Y||Y.length===0){e.innerHTML='<p class="sources-empty-text">Henüz yayın hattı bulunamadı veya taranıyor...</p>';return}e.innerHTML=Y.map((a,t)=>{const o=t===ce,h=!!a.failed;let x="dot-amber",T='<span class="source-ready-tag">Hazır</span>';return h?(x="dot-red",T=`<span class="source-failed-tag"><i data-lucide="alert-triangle" style="width:12px;height:12px"></i> ${a.failReason||"Yanıt Vermedi"}</span>`):o&&(x="dot-green",T='<span class="source-active-tag">🟢 Oynatılıyor</span>'),`
        <div class="source-list-item ${o?"active":""} ${h?"failed":""}" data-index="${t}">
          <div class="source-item-left">
            <span class="server-status-dot ${x}"></span>
            <span class="source-item-name">${a.displayName||a.name}</span>
            <span class="source-item-badge">${a.quality||"1080p"}</span>
          </div>
          <div class="source-item-right">
            ${T}
          </div>
        </div>
      `}).join(""),e.querySelectorAll(".source-list-item").forEach(a=>{a.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation();const o=parseInt(a.getAttribute("data-index"),10);if(o!==ce&&di()){if(f&&!xa(Y[o])){ee("Birlikte izleme için senkronlanabilir doğrudan bir yayın hattı seçin.","info");return}ce=o,it=0,jt(!1),Ue(),Ce()}})}),de(e)}}let it=0,_s=0;function Ta(e="Yayın yanıt vermedi"){const a=document.getElementById("player-iframe-wrapper");if(!a)return;if(ae){try{ae.destroy()}catch{}ae=null}if(Ye){try{Ye.destroy()}catch{}Ye=null}const t=Y[ce],o=Y.findIndex((T,A)=>A>ce&&!T.failed),h=o!==-1,x=te==="dubbed"&&we.subtitled?.length>0;a.innerHTML=`
      <div class="player-error-view" style="display:flex;align-items:center;justify-content:center;height:100%;text-align:center;padding:2rem;">
        <div class="player-error-card" style="background:rgba(20,24,35,0.92);backdrop-filter:blur(16px);padding:2rem;border-radius:16px;border:1px solid rgba(255,255,255,0.12);max-width:460px;box-shadow:0 20px 40px rgba(0,0,0,0.6);">
          <i data-lucide="alert-circle" style="width:44px;height:44px;color:#f59e0b;margin-bottom:1rem;"></i>
          <h3 style="color:#fff;font-size:1.15rem;margin-bottom:0.5rem;">${t?.displayName||t?.name||"Seçili Kaynak"} Yanıt Vermedi</h3>
          <p style="color:#94a3b8;font-size:0.85rem;line-height:1.5;margin-bottom:1.25rem;">
            ${e}. Alternatif yayın hatlarından birine geçiş yapabilir veya diğer dildeki kaynakları deneyebilirsiniz.
          </p>
          <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;">
            ${h?`<button class="btn-primary" id="btn-err-try-next" style="padding:0.55rem 1.1rem;font-size:0.85rem;display:inline-flex;align-items:center;gap:0.4rem;"><i data-lucide="skip-forward" style="width:14px;height:14px"></i> Sıradaki Kaynağa Geç (${Y[o].displayName||"Alternatif"})</button>`:""}
            <button class="btn-secondary" id="btn-err-open-sources" style="padding:0.55rem 1.1rem;font-size:0.85rem;display:inline-flex;align-items:center;gap:0.4rem;"><i data-lucide="layers" style="width:14px;height:14px"></i> Tüm Kaynaklar (${Y.length})</button>
            ${x?'<button class="btn-secondary" id="btn-err-switch-sub" style="padding:0.55rem 1.1rem;font-size:0.85rem;display:inline-flex;align-items:center;gap:0.4rem;color:#f59e0b;"><i data-lucide="message-square" style="width:14px;height:14px"></i> 💬 Altyazılıya Geç</button>':""}
          </div>
        </div>
      </div>
    `,de(a),document.getElementById("btn-err-try-next")?.addEventListener("click",()=>{h&&(it=0,ce=o,Ue(),Ce())}),document.getElementById("btn-err-open-sources")?.addEventListener("click",()=>{jt(!0)}),document.getElementById("btn-err-switch-sub")?.addEventListener("click",()=>{it=0;const T=document.getElementById("tab-subtitled");T&&T.click()})}function Ze(e="Bağlantı yanıt vermedi"){if(F)return;if(f&&!Ne()){ee("Moderatör alternatif yayına geçiyor…","info");return}const a=Date.now();if(!(e&&/HTTP\s+(403|404|500|502|503)/i.test(e))&&a-_s<2500)return;_s=a;const o=Y[ce];o&&(o.failed=!0,o.failReason=e,ir({category:te,source:o})),it++;const h=Math.max(3,Y.length-1);if(it>h){Ta(e);return}const x=o&&(o.isDirectVideo||o.isHls||o.isMkv||!o.isTorrent);let T=-1;for(let A=1;A<Y.length;A++){const k=(ce+A)%Y.length,H=Y[k];if(!(!H||H.failed)&&!(x&&(H.isTorrent||H.id?.includes("torrent")||H.streamUrl?.startsWith("magnet:")||H.streamUrl?.includes(":4000/torrent/")))){T=k;break}}if(T!==-1){const A=Y[T];ee(`⚠️ ${o?.displayName||o?.name||"Mevcut kaynak"} yanıt vermedi. ${A.displayName||A.name} deneniyor...`,"warning"),ce=T,Ue(),Ce();return}if(Hi){ee("⚠️ Seçili hat yanıt vermedi, alternatif hatlar taranıyor...","info");const A=document.getElementById("player-iframe-wrapper");A&&(A.innerHTML=`
          <div class="player-loading-overlay">
            <div class="player-loader-core">
              <div class="player-loader-spinner"></div>
              <i data-lucide="play" class="player-loader-icon"></i>
            </div>
            <div class="player-loader-text">
              <h3>${ne}</h3>
              <p class="player-loader-sub">Alternatif Yayın Hatları Taranıyor...</p>
              <p class="player-loader-hint">Bir önceki hat yanıt vermedi, yeni kaynak bağlanıyor...</p>
            </div>
          </div>
        `,de(A));return}Ta(e)}function Dr(){return""}function Da(e){const a=[];Array.isArray(e?.subtitles)&&e.subtitles.length>0&&a.push(...e.subtitles);const o=[...Y||[],...we?.subtitled||[],...we?.dubbed||[]].find(A=>Array.isArray(A.subtitles)&&A.subtitles.length>0);o&&Array.isArray(o.subtitles)&&o.subtitles.length>0&&o.subtitles.forEach(A=>{a.some(k=>k.src===A.src||k.label&&k.label===A.label)||a.push(A)});const h=l||n||u||"",x=i==="movie"?`/api/subtitles?tmdbId=${r||""}&imdbId=&title=${encodeURIComponent(h)}&type=movie`:`/api/subtitles?tmdbId=${r||""}&imdbId=&title=${encodeURIComponent(h)}&season=${z}&episode=${P}&type=tv`;return a.some(A=>(A.label||"").toLowerCase().includes("opensubtitles")||A.src?.includes("/api/subtitles"))||a.push({label:"OpenSubtitles (Türkçe)",src:x}),a}function Cs(e,a){if(!e)return;const t=Da(a),o=te==="subtitled"&&t.length>0?0:-1,h=()=>{try{const x=e.textTracks;if(x&&x.length>0)for(let T=0;T<x.length;T++)o>=0&&T===o?x[T].mode="showing":x[T].mode="disabled"}catch{}};e.readyState>=1?h():(e.addEventListener("loadedmetadata",h,{once:!0}),e.addEventListener("canplay",h,{once:!0}))}function _r(){const e=document.getElementById("hls-video-player");if(!e)return;const a=Y[ce];if(!a)return;const t=Da(a);!t||t.length===0||(e.querySelectorAll("track").length===0&&t.forEach((o,h)=>{let x=o.src;x&&x.startsWith("http")&&(x=`/api/proxy?url=${encodeURIComponent(x)}`);const T=document.createElement("track");T.kind="subtitles",T.label=o.label||"Altyazı",T.src=x,T.srclang=(o.label||"").toLowerCase().includes("türk")?"tr":"en",te==="subtitled"&&h===0&&(T.default=!0),e.appendChild(T)}),Cs(e,a))}function Is(){if((et||Hi)&&(!Y||Y.length===0))return`
        <div class="player-loading-overlay">
          <div class="player-loader-core">
            <div class="player-loader-spinner"></div>
            <i data-lucide="play" class="player-loader-icon"></i>
          </div>
          <div class="player-loader-text">
            <h3>${ne}</h3>
            <p class="player-loader-sub">${te==="subtitled"?"💬 Türkçe Altyazılı":"🇹🇷 Türkçe Dublaj"} Yayınlar Aranıyor...</p>
            <p class="player-loader-hint">Türkiye ve küresel CDN hatları taranıyor...</p>
          </div>
        </div>
      `;if(te==="dubbed"&&(!Y||Y.length===0))return`
        <div class="player-not-found-container">
          <div class="not-found-icon-wrap">
            <i data-lucide="volume-x" style="width: 38px; height: 38px; color: #f59e0b;"></i>
          </div>
          <h3>Türkçe Dublaj Henüz Mevcut Değil</h3>
          <p>
            "${ne}" yapımı için resmi veya aktif Türkçe Dublaj akışı bulunamadı. Türkçe Altyazılı yüksek kaliteli (1080p / 4K) kaynaklardan hemen izleyebilirsiniz.
          </p>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center;">
            <button id="btn-switch-subtitled-fallback" class="btn-primary btn-switch-category-fallback">
              <i data-lucide="repeat" style="width: 16px; height: 16px;"></i>
              <span>💬 Türkçe Altyazılı Sunucuları Aç (${we.subtitled?.length||0} Hat Aktif)</span>
            </button>
            <button id="btn-retry-discovery" class="btn-secondary" style="padding: 0.55rem 1.1rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.4rem;">
              <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
              <span>Yeniden Tara</span>
            </button>
          </div>
        </div>
      `;if(!Y||Y.length===0)return`
        <div class="player-not-found-container">
          <div class="not-found-icon-wrap">
            <i data-lucide="video-off" style="width: 38px; height: 38px; color: #ef4444;"></i>
          </div>
          <h3>Aktif Yayın Kaynağı Bulunamadı</h3>
          <p>
            "${ne}" içeriği için seçili sunucularda anlık sinyal alınamadı.
          </p>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center;">
            <button id="btn-retry-discovery" class="btn-primary" style="padding: 0.55rem 1.2rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.4rem;">
              <i data-lucide="refresh-cw" style="width: 15px; height: 15px;"></i>
              <span>Tekrar Tara</span>
            </button>
            <button id="btn-switch-subtitled-fallback" class="btn-secondary" style="padding: 0.55rem 1.1rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.4rem;">
              <i data-lucide="repeat" style="width: 14px; height: 14px;"></i>
              <span>${te==="dubbed"?"💬 Altyazılıya Geç":"🇹🇷 Dublaja Geç"}</span>
            </button>
          </div>
        </div>
      `;const e=Y[ce];if(!e||e.notFound)return`
        <div class="player-not-found-container">
          <div class="not-found-icon-wrap">
            <i data-lucide="video-off" style="width: 38px; height: 38px; color: #ef4444;"></i>
          </div>
          <h3>${te==="dubbed"?"Dublaj Sunucularda Bulunamadı":"Altyazılı Sunucularda Bulunamadı"}</h3>
          <p>
            "${ne}" içeriği seçili kategorideki aktif depolarda yer almamaktadır.
          </p>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center;">
            <button id="btn-switch-subtitled-fallback" class="btn-primary btn-switch-category-fallback">
              <i data-lucide="repeat" style="width: 16px; height: 16px;"></i>
              <span>${te==="dubbed"?"💬 Türkçe Altyazılı VidAPI & VIP Sunuculara Geç":"🇹🇷 Türkçe Dublaj Sunucularına Geç"}</span>
            </button>
            <button id="btn-retry-discovery" class="btn-secondary" style="padding: 0.55rem 1.1rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.4rem;">
              <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
              <span>Yeniden Tara</span>
            </button>
          </div>
        </div>
      `;if(!!(e.isDirectVideo||e.isHls||e.streamUrl&&!e.streamUrl.startsWith("magnet:")&&(e.streamUrl.includes(".m3u8")||e.streamUrl.includes(".mp4")||e.streamUrl.includes(".mkv")||e.streamUrl.includes(":4000/torrent/")))){const h=ht(e),x=e.dubbedAudioUrl&&h===e.dubbedAudioUrl,T=e.dubbedAudioUrl&&e.dubbedAudioUrl.length>5&&!x,A=T?`
        <div class="dual-audio-bar" id="dual-audio-bar">
          <div class="dual-audio-label">
            <i data-lucide="headphones" style="width: 14px; height: 14px; color: #f59e0b;"></i>
            <span>Ses Kaynağı:</span>
          </div>
          <div class="dual-audio-toggle">
            <button id="btn-audio-original" class="dual-audio-btn ${te==="subtitled"?"active":""}" title="Orijinal Ses">
              <span>🇬🇧 Orijinal</span>
            </button>
            <button id="btn-audio-dubbed" class="dual-audio-btn ${te==="dubbed"?"active":""}" title="Türkçe Dublaj Sesi">
              <span>🇹🇷 TR Dublaj</span>
            </button>
          </div>
          <span class="dual-audio-source-name" title="${e.dubbedAudioName||""}">
            Ses: ${e.dubbedAudioName||"TR Dublaj"}
          </span>
        </div>
      `:"",k=Da(e),H=te==="subtitled"&&k.length>0?0:-1,X=k.map((G,j)=>{let O=G.src;O&&O.startsWith("http")&&(O=`/api/proxy?url=${encodeURIComponent(O)}`);const M=(G.label||"").toLowerCase().includes("türk")||(G.label||"").toLowerCase().includes("tr");return`
          <track 
            kind="subtitles" 
            label="${G.label||"Altyazı"}" 
            src="${O}" 
            srclang="${M?"tr":"en"}" 
            ${j===H?"default":""}>
        `}).join("");return`
        <div class="direct-video-wrapper" id="direct-video-wrapper">
          <!-- Cinema Ambient Glow Layer (YouTube Style) -->
          <div class="player-ambient-glow" id="player-ambient-glow">
            <canvas id="player-ambient-canvas" class="player-ambient-canvas"></canvas>
          </div>

          ${A}
          <video 
            id="hls-video-player" 
            autoplay 
            playsinline
            webkit-playsinline
            crossorigin="anonymous"
            preload="auto">
            ${X}
          </video>
          ${T?`
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
              <span class="binge-card-title" id="binge-card-title">${ne} • Bölüm ${P+1}</span>
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

          <!-- Bottom Custom Control Bar -->
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

            <!-- Controls Row -->
            <div class="custom-controls-row">
              <div class="custom-controls-left">
                <button class="custom-ctrl-btn custom-ctrl-btn-skip" id="custom-btn-rewind-10" title="10 Saniye Geri (←)">
                  <i data-lucide="rotate-ccw" style="width: 19px; height: 19px;"></i>
                  <span class="custom-btn-badge-10">10</span>
                </button>
                <button class="custom-ctrl-btn" id="custom-btn-play" title="Oynat / Duraklat (Space)">
                  <i data-lucide="pause" style="width: 20px; height: 20px;"></i>
                </button>
                <button class="custom-ctrl-btn custom-ctrl-btn-skip" id="custom-btn-forward-10" title="10 Saniye İleri (→)">
                  <i data-lucide="rotate-cw" style="width: 19px; height: 19px;"></i>
                  <span class="custom-btn-badge-10">10</span>
                </button>
                <div class="custom-time-display" id="custom-time-display">0:00 / 0:00</div>
              </div>

              <div class="custom-controls-right">
                <!-- Brightness Slider Wrap (Vertical Popover Upwards) -->
                <div class="custom-slider-popup-wrap custom-brightness-wrap" id="custom-brightness-wrap" title="Parlaklık Ayarı">
                  <button class="custom-ctrl-btn" id="custom-btn-brightness" title="Parlaklık Aç / Kıs">
                    <i data-lucide="sun" style="width: 19px; height: 19px; color: #fbbf24;"></i>
                  </button>
                  <div class="custom-vertical-slider-popover" id="custom-brightness-popover">
                    <span class="custom-slider-val-badge" id="custom-brightness-badge">%100</span>
                    <div class="custom-vertical-track-wrap">
                      <input type="range" class="custom-vertical-slider" id="custom-brightness-slider" min="30" max="150" step="5" value="100" />
                    </div>
                  </div>
                </div>

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

                <!-- Sleep Timer Button -->
                <button class="custom-ctrl-btn" id="custom-btn-sleep" title="Uyku Zamanlayıcısı (Sleep Timer)">
                  <i data-lucide="moon" style="width: 19px; height: 19px; color: #c084fc;"></i>
                </button>

                <!-- Fullscreen Button -->
                <button class="custom-ctrl-btn" id="custom-btn-fullscreen" title="Tam Ekran (F)">
                  <i data-lucide="maximize" style="width: 20px; height: 20px;"></i>
                </button>

                <!-- Three-Dots Button (⋮) -->
                <button class="custom-ctrl-btn" id="custom-btn-more" title="Seçenekler">
                  <i data-lucide="more-vertical" style="width: 20px; height: 20px;"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Three-Dots Context Menu -->
          <div class="custom-player-menu hidden" id="custom-player-menu">
            <!-- Main View -->
            <div class="custom-menu-view" id="custom-menu-main">
              <!-- Item 1: Ses Kanalları -->
              <div class="custom-menu-item" id="custom-menu-item-audio">
                <div class="custom-menu-item-icon">
                  <i data-lucide="headphones" style="width: 17px; height: 17px; color: #f59e0b;"></i>
                </div>
                <div class="custom-menu-item-body">
                  <span class="custom-menu-item-title">Ses Kanalları</span>
                  <span class="custom-menu-item-sub" id="custom-menu-active-audio">${te==="dubbed"?"Türkçe Dublaj":"Orijinal Ses"}</span>
                </div>
                <i data-lucide="chevron-right" style="width: 15px; height: 15px; color: #94a3b8;"></i>
              </div>

              <!-- Item 2: Altyazılar -->
              <div class="custom-menu-item" id="custom-menu-item-subs">
                <div class="custom-menu-item-icon">
                  <i data-lucide="subtitles" style="width: 17px; height: 17px; color: #60a5fa;"></i>
                </div>
                <div class="custom-menu-item-body">
                  <span class="custom-menu-item-title">Altyazılar</span>
                  <span class="custom-menu-item-sub" id="custom-menu-active-sub">Kapalı</span>
                </div>
                <i data-lucide="chevron-right" style="width: 15px; height: 15px; color: #94a3b8;"></i>
              </div>

              <!-- Item 2.5: Altyazı Stili & Boyutu -->
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

              <!-- Item 3: Oynatma hızı -->
              <div class="custom-menu-item" id="custom-menu-item-speed">
                <div class="custom-menu-item-icon">
                  <i data-lucide="gauge" style="width: 17px; height: 17px; color: #a78bfa;"></i>
                </div>
                <div class="custom-menu-item-body">
                  <span class="custom-menu-item-title">Oynatma hızı</span>
                  <span class="custom-menu-item-sub" id="custom-menu-active-speed">Normal</span>
                </div>
                <i data-lucide="chevron-right" style="width: 15px; height: 15px; color: #94a3b8;"></i>
              </div>

              <!-- Item 4: Parlaklık -->
              <div class="custom-menu-item" id="custom-menu-item-brightness-menu">
                <div class="custom-menu-item-icon">
                  <i data-lucide="sun" style="width: 17px; height: 17px; color: #fbbf24;"></i>
                </div>
                <div class="custom-menu-item-body">
                  <span class="custom-menu-item-title">Parlaklık</span>
                  <span class="custom-menu-item-sub" id="custom-menu-active-brightness">%100</span>
                </div>
                <i data-lucide="chevron-right" style="width: 15px; height: 15px; color: #94a3b8;"></i>
              </div>

              <!-- Item 5: Pencere içinde pencere -->
              <div class="custom-menu-item" id="custom-menu-item-pip">
                <div class="custom-menu-item-icon">
                  <i data-lucide="picture-in-picture-2" style="width: 17px; height: 17px; color: #34d399;"></i>
                </div>
                <div class="custom-menu-item-body">
                  <span class="custom-menu-item-title">Pencere içinde pencere</span>
                </div>
              </div>

              <!-- Item 6: Uyku Zamanlayıcısı -->
              <div class="custom-menu-item" id="custom-menu-item-sleep-menu">
                <div class="custom-menu-item-icon">
                  <i data-lucide="moon" style="width: 17px; height: 17px; color: #c084fc;"></i>
                </div>
                <div class="custom-menu-item-body">
                  <span class="custom-menu-item-title">Uyku Zamanlayıcısı</span>
                  <span class="custom-menu-item-sub" id="custom-menu-active-sleep">Kapalı</span>
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
        </div>
      `}const t=ht(e);return`
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
    `}function Ls(){if(!Q)return"";const e=ci(z),a=oe.some(h=>h.season_number===z+1);let t="";e>0?P<e?t=`
          <button id="btn-next-episode" class="btn-primary btn-nav-episode btn-nav-next" data-action="next-ep">
            <span>Sonraki Bölüm (B${P+1})</span>
            <i data-lucide="chevron-right" style="width: 15px; height: 15px;"></i>
          </button>
        `:a?t=`
          <button id="btn-next-episode" class="btn-primary btn-nav-episode btn-nav-next-season" data-action="next-season">
            <span>Sonraki Sezon (S${z+1} B1)</span>
            <i data-lucide="fast-forward" style="width: 15px; height: 15px;"></i>
          </button>
        `:t=`
          <span class="badge-series-finished">
            <i data-lucide="check-check" style="width: 14px; height: 14px;"></i>
            <span>Dizi Tamamlandı</span>
          </span>
        `:a?t=`
          <button id="btn-next-episode" class="btn-primary btn-nav-episode btn-nav-next-season" data-action="next-season">
            <span>Sonraki Sezon (S${z+1} B1)</span>
            <i data-lucide="fast-forward" style="width: 15px; height: 15px;"></i>
          </button>
        `:t=`
          <span class="badge-series-finished">
            <i data-lucide="check-check" style="width: 14px; height: 14px;"></i>
            <span>Dizi Tamamlandı</span>
          </span>
        `;let o="";if(P>1)o=`
        <button id="btn-prev-episode" class="btn-secondary btn-nav-episode btn-nav-prev" data-action="prev-ep">
          <i data-lucide="chevron-left" style="width: 15px; height: 15px;"></i>
          <span>Önceki Bölüm (B${P-1})</span>
        </button>
      `;else if(z>1){const h=ci(z-1)||1;o=`
        <button id="btn-prev-episode" class="btn-secondary btn-nav-episode btn-nav-prev-season" data-action="prev-season" data-prev-season="${z-1}" data-prev-ep="${h}">
          <i data-lucide="rewind" style="width: 15px; height: 15px;"></i>
          <span>Önceki Sezon (S${z-1} B${h})</span>
        </button>
      `}return`${o} ${t}`}function Bs(){const e=document.getElementById("player-nav-btn-group");e&&(e.innerHTML=Ls(),Ns(),de(w))}w.innerHTML=`
    <!-- Ambient Backdrop Aura Glow -->
    <div class="player-ambient-backdrop" ${v?`style="background-image: url('${v}');"`:""}></div>
    
    <div class="modal-content player-modal-content" id="cinema-modal-box">
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
                <small id="room-player-episode">${Q?`S${z} · B${P}`:"Film"}</small>
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
          <button id="player-close-btn" class="btn-player-close" title="Kapat (ESC)">
            <i data-lucide="arrow-left" class="icon-mobile-back" style="width: 18px; height: 18px;"></i>
            <i data-lucide="x" class="icon-desktop-close" style="width: 18px; height: 18px;"></i>
          </button>
          
          <div class="player-title-box">
            <span id="player-modal-title" class="player-header-title">${ne}</span>
            ${De>5?`
              <span id="player-resume-time-badge" class="player-resume-badge" title="Kaldığın Süre">
                <i data-lucide="clock" style="width: 11px; height: 11px;"></i>
                <span>${Qi(De)}</span>
              </span>
            `:""}
          </div>
        </div>

        <!-- Center: Dubbed / Subtitled Segmented Toggle -->
        <div class="player-header-toggle">
          <button id="tab-dubbed" class="cinema-tab-btn ${te==="dubbed"?"active":""}">
            <span class="tab-flag">🇹🇷</span>
            <span>Dublaj</span>
            <span class="tab-source-count" id="tab-dubbed-count">0</span>
          </button>
          <button id="tab-subtitled" class="cinema-tab-btn ${te==="subtitled"?"active":""}">
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
          ${Is()}
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

      ${m==="short-drama"&&(D||v||g)?`
      <section class="short-drama-artwork" aria-label="${ne} kapak görseli">
        <img src="${(D||v||g).startsWith("http")?D||v||g:`https://image.tmdb.org/t/p/w1280${D||v||g}`}" alt="${ne}" />
        <div class="short-drama-artwork-shade"></div>
        <div class="short-drama-artwork-copy"><span>KISA DİZİ · MİNİ SERİ · ${P}. BÖLÜM</span><strong>${ne}</strong></div>
      </section>`:""}

      <!-- Dizisol Cinema Body (Title, Genres, Overview & Carousel) -->
      <div class="dizisol-cinema-body">
        <section class="player-editorial-header" aria-label="İçerik bilgisi">
          <div class="player-editorial-copy">
            <div class="player-title-row">
              <h1 class="dizisol-title">${ne}</h1>
            </div>
            <div class="player-meta-pills">
              ${m==="short-drama"?`<span class="dizisol-ep-badge">${P}. Bölüm${U?` · ${U} bölüm`:""}</span>`:`<span class="dizisol-ep-badge">${i==="tv"?`Sezon ${z} · Bölüm ${P}`:"Film"}</span>
                   <span class="player-meta-dot">HD akış</span>
                   <span class="player-meta-dot">Kaldığın yer kaydedilir</span>`}
            </div>
          </div>

          <div class="player-action-cluster" aria-label="Oynatıcı seçenekleri">
            <button id="btn-open-sources-drawer" class="player-primary-action" title="Yayın hatlarını aç">
              <i data-lucide="layers-3"></i><span>Kaynakları gör</span><em id="active-source-chip-label">${As()}</em>
            </button>
            <details class="player-status-menu">
              <summary class="player-status-trigger" title="İzleme durumu"><i data-lucide="bookmark"></i><span id="list-action-label">${_e?"İzlendi":"Listeme ekle"}</span><i data-lucide="chevron-down"></i></summary>
              <div class="player-status-options">
                <button type="button" data-watch-state="toggle"><i data-lucide="check-circle-2"></i>${_e?"İzlenmedi olarak işaretle":"İzlendi olarak işaretle"}</button>
                <button type="button" data-watch-state="later"><i data-lucide="clock-3"></i>Daha sonra izle</button>
              </div>
            </details>
            <div class="player-feedback-group" aria-label="Yayın geri bildirimi">
              <button id="btn-report-issue" class="player-icon-action" type="button" title="Kaynakta sorun bildir"><i data-lucide="flag"></i></button>
            </div>
          <div class="player-utility-group">
            ${C?"":'<button id="btn-player-download" class="player-utility-action player-download-action" type="button" title="Bölümü indir / çevrimdışı kaydet"><i data-lucide="download"></i><span>İndir</span></button>'}
            <button id="btn-player-theater" class="player-utility-action" title="Sinema Modu (Genişlet)"><i data-lucide="scan-line"></i><span>Sinema</span></button>
              <button id="btn-player-share" class="player-icon-action" type="button" title="Paylaş"><i data-lucide="share-2"></i></button>
            </div>
          </div>
        </section>

        <div class="dizisol-genre-chips" id="dizisol-genre-chips">
          ${ai.map(e=>`<span class="dizisol-genre-chip">${e}</span>`).join("")}
        </div>

          <div class="player-story-block ${m==="short-drama"?"short-drama-story":""}">
            ${m==="short-drama"?'<h2 class="short-drama-story-heading">DİZİ HAKKINDA</h2>':""}
            <p class="dizisol-overview" id="dizisol-overview">
            ${m==="short-drama"?$||"Bu kısa dizi için henüz özet girilmedi.":Q?zt||"Bölüm özeti hazırlanıyor...":Mt||"İçerik bilgileri hazırlanıyor..."}
            </p>
          </div>

        <!-- SEZONLAR SECTION (Only for TV Series) -->
        ${Q&&m==="short-drama"?`
          <section class="dizisol-seasons-section short-drama-episodes">
            <div class="dizisol-seasons-header"><h4>BÖLÜMLER</h4><span class="dizisol-episodes-count">${y.length||U} Bölüm</span></div>
            <div class="short-drama-episode-rail">
              ${y.map(e=>`
                <button class="short-drama-episode-card ${Number(e.episode)===Number(P)?"is-current":""}" type="button" data-drama-season="${e.season}" data-drama-episode="${e.episode}">
                  <span class="short-drama-episode-image">${e.thumb?`<img loading="lazy" src="${e.thumb}" alt="${e.title}" />`:`<span>${e.episode}</span>`}<b>${Number(e.episode)===Number(P)?"ŞİMDİ OYNUYOR":`${e.episode}. BÖLÜM`}</b></span>
                  <span class="short-drama-episode-name">${e.title}</span>
                </button>`).join("")}
            </div>
          </section>
        `:Q?`
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
        `:`
          <!-- FILM BILGI, EKIP VE BENZER FILMLER (Only for Movies) -->
          <div class="dizisol-movie-section" id="dizisol-movie-section">
            <div class="drawer-loading" style="display:flex;align-items:center;gap:0.75rem;padding:1.5rem;color:#94a3b8;">
              <div class="drawer-spinner" style="width:20px;height:20px;border:2px solid rgba(255,255,255,0.2);border-top-color:#e50914;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
              <p style="margin:0;font-size:0.85rem;">Film detayları ve benzer öneriler hazırlanıyor...</p>
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
          ${Ls()}
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
          <p class="sources-popover-info">
            Yayınlar güven sıralamasına göre otomatik açılır. Herhangi bir hat yanıt vermezse sistem sıradaki hatta kesintisiz geçiş yapar.
          </p>
          <div class="sources-list" id="sources-popover-list">
            <!-- Rendered sources -->
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Glassmorphism Download Hub Modal -->
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
  `,w.classList.remove("hidden"),document.body.style.overflow="hidden",de(w),gs(),lt();const qi=(e=window.__cinepulseDecisionRoomPresence)=>{if(!f||!e||e.roomCode!==f.roomCode)return;if(Ee=e.syncMode==="strict"?"strict":"smooth",Ee!=="strict"&&ri&&(ri=!1,ga.clear(),w.querySelector("#hls-video-player")?.play?.().catch(()=>{})),Ee!=="smooth"&&Ut){Ut=!1,va.clear();const A=w.querySelector("#hls-video-player");Pt=Date.now()+2500,A?.play?.().catch(()=>{})}if(Ee!=="smooth"&&qt.clear(),Ee!=="smooth"&&oi){oi=!1;const A=w.querySelector("#hls-video-player");Pt=Date.now()+2500,A?.play?.().catch(()=>{})}Array.isArray(e.chatMessages)&&e.chatMessages.filter(A=>A?.senderId!==e.selfId).forEach(A=>Ri(A));const a=w.querySelector("#room-player-status"),t=w.querySelector("#room-player-members"),o=w.querySelector("#room-player-episode"),h=w.querySelector("#room-player-source"),x=w.querySelector("#room-cloud-member-badge"),T=Ee==="strict"?"Herkesle senkron":"Akıcı mod";if(a&&(a.textContent=e.isHost?`${e.participants.length} kişi bağlı · ${T}`:`${e.participants.length} kişi bağlı · ${T}`),x&&(x.textContent=String(e.participants.length||1)),t&&(t.innerHTML=e.participants.slice(0,4).map(A=>`<span title="${A.nickname}">${A.role==="moderator"?"♛":"●"} ${A.nickname}</span>`).join("")),o&&(o.textContent=Q?`S${z} · B${P}`:"Film"),h){const A=Ui();h.textContent=A?.name?`Ortak kaynak: ${A.name}`:"Ortak kaynak aranıyor…"}};function Cr(){const e=w.querySelector("#btn-room-cloud-toggle"),a=w.querySelector("#room-cloud-popover"),t=w.querySelector("#btn-room-cloud-close");if(!e||!a)return;const o=h=>{a.hidden=!h,e.setAttribute("aria-expanded",String(h)),e.classList.toggle("active",h),h&&de(a)};e.addEventListener("click",h=>{h.stopPropagation(),o(a.hidden)}),t?.addEventListener("click",h=>{h.stopPropagation(),o(!1)}),V.on(document,"click",h=>{!a.hidden&&!a.contains(h.target)&&!e.contains(h.target)&&o(!1)}),V.on(document,"keydown",h=>{h.key==="Escape"&&!a.hidden&&(o(!1),h.stopPropagation())})}f&&(qi(),Cr(),w.querySelector("#btn-room-return")?.addEventListener("click",()=>{hi(),window.setTimeout(()=>jr(),0)}),w.querySelector("#btn-room-chat")?.addEventListener("click",()=>{const e=w.querySelector("#room-cloud-popover");e&&!e.hidden&&(e.hidden=!0,w.querySelector("#btn-room-cloud-toggle")?.setAttribute("aria-expanded","false"),w.querySelector("#btn-room-cloud-toggle")?.classList.remove("active")),bs()}),V.on(window,"cinepulse:decision-room-presence",e=>qi(e.detail)));async function _a(e){if(Be.has(e))return Be.get(e);if(!r)return[];try{const a=await fetch(`https://api.themoviedb.org/3/tv/${r}/season/${e}?api_key=${na}&language=tr-TR`);if(a&&a.ok){const o=(await a.json()).episodes||[];return Be.set(e,o),o}}catch{}return[]}async function Dt(){const e=document.getElementById("dizisol-season-tabs"),a=document.getElementById("dizisol-episodes-carousel"),t=document.getElementById("dizisol-episodes-total"),h=(oe.length>0?oe:Array.from({length:5},(G,j)=>({season_number:j+1,name:`${j+1}. Sezon`}))).map(G=>{const j=ne||"Sezon",O=G.name&&!G.name.toLowerCase().includes("sezon")?G.name:G.season_number===1?j:`${j} ${G.season_number}`;return`
        <button class="dizisol-season-tab ${G.season_number===ue?"active":""}" data-season="${G.season_number}">
          ${O}
        </button>
      `}).join("");if(e){e.innerHTML=h,e.querySelectorAll(".dizisol-season-tab").forEach(O=>{O.addEventListener("click",()=>{ue=parseInt(O.getAttribute("data-season"),10),O.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"}),Dt()})});const G=e.querySelector(".dizisol-season-tab.active");G&&ge(()=>{G.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})},120);const j=document.querySelector(".dizisol-season-tabs-rail")||e;if(j&&!j._hasWheel){j._hasWheel=!0,j.addEventListener("wheel",ye=>{ye.deltaY!==0&&j.scrollWidth>j.clientWidth&&(ye.preventDefault(),j.scrollLeft+=ye.deltaY)},{passive:!1});let O=!1,M=0,re=0,J=!1;j.addEventListener("mousedown",ye=>{ye.button===0&&(O=!0,J=!1,M=ye.pageX-j.offsetLeft,re=j.scrollLeft)}),V.on(window,"mousemove",ye=>{if(!O)return;const W=(ye.pageX-j.offsetLeft-M)*1.5;Math.abs(W)>4&&(J=!0),j.scrollLeft=re-W}),V.on(window,"mouseup",()=>{O&&(O=!1,ge(()=>{J=!1},50))}),j.addEventListener("click",ye=>{J&&(ye.preventDefault(),ye.stopPropagation())},!0)}}const x=`
      <div class="drawer-loading" style="display:flex;align-items:center;gap:0.75rem;padding:1.5rem;color:#94a3b8;">
        <div class="drawer-spinner" style="width:20px;height:20px;border:2px solid rgba(255,255,255,0.2);border-top-color:#e50914;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
        <p style="margin:0;font-size:0.85rem;">Bölümler yükleniyor...</p>
      </div>
    `;a&&(a.innerHTML=x);const T=ue,A=await _a(T);if(F||T!==ue)return;const k=A&&A.length>0?A.length:ci(ue)||12;t&&(t.textContent=`${k} Bölüm`);let H="";if(!A||A.length===0?H=Array.from({length:k},(j,O)=>O+1).map(j=>{const O=ue===z&&j===P,M=Zt(r,ue,j);return`
          <div class="dizisol-ep-card ${O?"playing":""} ${M?"is-watched-card":""}" data-season="${ue}" data-episode="${j}">
            <div class="dizisol-ep-thumb-box">
              <div class="ep-thumb-fallback" style="display:flex;align-items:center;justify-content:center;height:100%;color:#475569;"><i data-lucide="film" style="width:24px;height:24px"></i></div>
              <span class="dizisol-ep-badge-num ${O?"active":""}">${j}. Bölüm</span>
              <button class="dizisol-ep-watch-toggle ${M?"is-watched":""}" data-season="${ue}" data-episode="${j}" title="${M?"İzlendi (Kaldırmak için tıkla)":"İzlendi Olarak İşaretle"}">
                <i data-lucide="${M?"check-circle-2":"eye"}" style="width: 13px; height: 13px;"></i>
                <span class="ep-watch-text">${M?"İzlendi":"İşaretle"}</span>
              </button>
              <button class="dizisol-ep-download-btn" data-season="${ue}" data-episode="${j}" title="Bu bölümü indir" type="button">
                <i data-lucide="download" style="width:12px;height:12px"></i>
              </button>
              ${O?`
                <div class="dizisol-ep-play-circle">
                  <i data-lucide="play" style="width:16px;height:16px;fill:#fff;color:#fff;margin-left:2px;"></i>
                </div>
              `:`
                <div class="dizisol-ep-play-overlay">
                  <i data-lucide="play" style="width:28px;height:28px;"></i>
                </div>
              `}
            </div>
            <div class="dizisol-ep-info">
              <h5 class="dizisol-ep-title" data-base-title="${j}. Bölüm" title="${j}. Bölüm">${j}. Bölüm ${M?"✓":""}</h5>
            </div>
          </div>
        `}).join(""):H=A.map(G=>{const j=G.episode_number,O=ue===z&&j===P,M=Zt(r,ue,j),re=G.still_path?`https://image.tmdb.org/t/p/w300${G.still_path}`:"",J=G.runtime?`${G.runtime}dk`:"",ye=G.air_date?G.air_date.substring(0,7):"";return`
          <div class="dizisol-ep-card ${O?"playing":""} ${M?"is-watched-card":""}" data-season="${ue}" data-episode="${j}">
            <div class="dizisol-ep-thumb-box">
              ${re?`<img src="${re}" alt="B${j}" loading="lazy" />`:'<div class="ep-thumb-fallback" style="display:flex;align-items:center;justify-content:center;height:100%;color:#475569;"><i data-lucide="film" style="width:24px;height:24px"></i></div>'}
              <span class="dizisol-ep-badge-num ${O?"active":""}">${j}. Bölüm</span>
              <button class="dizisol-ep-watch-toggle ${M?"is-watched":""}" data-season="${ue}" data-episode="${j}" title="${M?"İzlendi (Kaldırmak için tıkla)":"İzlendi Olarak İşaretle"}">
                <i data-lucide="${M?"check-circle-2":"eye"}" style="width: 13px; height: 13px;"></i>
                <span class="ep-watch-text">${M?"İzlendi":"İşaretle"}</span>
              </button>
              <button class="dizisol-ep-download-btn" data-season="${ue}" data-episode="${j}" title="Bu bölümü indir" type="button">
                <i data-lucide="download" style="width:12px;height:12px"></i>
              </button>
              ${J?`<span class="dizisol-ep-duration">${J}</span>`:""}
              ${O?`
                <div class="dizisol-ep-play-circle">
                  <i data-lucide="play" style="width:16px;height:16px;fill:#fff;color:#fff;margin-left:2px;"></i>
                </div>
              `:`
                <div class="dizisol-ep-play-overlay">
                  <i data-lucide="play" style="width:28px;height:28px;"></i>
                </div>
              `}
            </div>
            <div class="dizisol-ep-info">
              <h5 class="dizisol-ep-title" data-base-title="${G.name||`${j}. Bölüm`}" title="${G.name||`${j}. Bölüm`}">${G.name||`${j}. Bölüm`}${M?" ✓":""}</h5>
              ${ye?`<span class="dizisol-ep-date">${ye}</span>`:""}
            </div>
          </div>
        `}).join(""),a){a.innerHTML=H,a.querySelectorAll(".dizisol-ep-watch-toggle").forEach(O=>{O.addEventListener("click",M=>{M.stopPropagation(),M.preventDefault();const re=parseInt(O.getAttribute("data-season"),10),J=parseInt(O.getAttribute("data-episode"),10),Se=Or(r,re,J,{title:ne,posterPath:g,backdropPath:v,type:Me?"anime":"tv",isAnime:Me,isSeries:!0}).completed;O.classList.toggle("is-watched",Se),O.setAttribute("title",Se?"İzlendi (Kaldırmak için tıkla)":"İzlendi Olarak İşaretle"),O.innerHTML=`
            <i data-lucide="${Se?"check-circle-2":"eye"}" style="width: 13px; height: 13px;"></i>
            <span class="ep-watch-text">${Se?"İzlendi":"İşaretle"}</span>
          `,de(O);const W=O.closest(".dizisol-ep-card");if(W){W.classList.toggle("is-watched-card",Se);const xe=W.querySelector(".dizisol-ep-title");if(xe){const me=xe.getAttribute("data-base-title")||xe.textContent.replace(/\s*✓.*$/,"");xe.textContent=`${me}${Se?" ✓":""}`}}re===z&&J===P&&(_e=Se,ha(Se)),ee(Se?`✓ S${re} B${J} izlendi olarak işaretlendi.`:`S${re} B${J} izlendi işareti kaldırıldı.`,"info")})}),a.querySelectorAll(".dizisol-ep-download-btn").forEach(O=>{O.addEventListener("click",M=>{M.stopPropagation(),M.preventDefault();const re=parseInt(O.getAttribute("data-season"),10),J=parseInt(O.getAttribute("data-episode"),10);Ds(re,J)})}),a.querySelectorAll(".dizisol-ep-card").forEach(O=>{O.addEventListener("click",M=>{if(M.target.closest(".dizisol-ep-watch-toggle")||M.target.closest(".dizisol-ep-download-btn"))return;const re=parseInt(O.getAttribute("data-season"),10),J=parseInt(O.getAttribute("data-episode"),10);re===z&&J===P||_t(re,J)})});const G=a.querySelector(".dizisol-ep-card.playing");G&&ge(()=>{G.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})},150);const j=()=>{const O=a.scrollWidth-a.clientWidth,M=document.getElementById("dizisol-carousel-scroll-thumb");if(M&&O>0){const re=a.scrollLeft/O;M.style.transform=`translateX(${re*150}%)`}};a.removeEventListener("scroll",j),a.onscroll=j}const X=document.getElementById("btn-carousel-left"),be=document.getElementById("btn-carousel-right");X&&a&&(X.onclick=()=>a.scrollBy({left:-360,behavior:"smooth"})),be&&a&&(be.onclick=()=>a.scrollBy({left:360,behavior:"smooth"})),de(w),lt()}Q?(Dt(),zs(z,P)):xs(),m==="short-drama"&&w.querySelectorAll(".short-drama-episode-card").forEach(e=>{e.addEventListener("click",()=>{const a=Number(e.dataset.dramaSeason)||1,t=Number(e.dataset.dramaEpisode)||1;if(t===Number(P)&&a===Number(z))return;const o=y.find(h=>Number(h.season)===a&&Number(h.episode)===t);es({type:"tv",tmdbId:r,title:`${ne} - B${t}`,seriesTitle:ne,season:a,episode:t,posterPath:g,backdropPath:v,playerVariant:m,seriesOverview:$,episodeArtworkPath:o?.thumb||g,shortDramaEpisodes:y,maxEpisodes:U,seasonsList:[{season_number:a,episode_count:U}]})})});async function Ir(){const e=document.getElementById("player-quick-episodes-rail"),a=document.getElementById("quick-ep-count-text");if(!e)return;e.innerHTML=`
      <div class="quick-ep-loading">
        <div class="quick-ep-spinner"></div>
        <span>Bölümler yükleniyor...</span>
      </div>
    `;const t=z,o=await _a(t);if(F||t!==z)return;const h=o&&o.length>0?o.length:ci(z)||12;a&&(a.textContent=`${h} Bölüm`),!o||o.length===0?e.innerHTML=Array.from({length:h},(T,A)=>A+1).map(T=>{const A=T===P,k=Zt(r,z,T);return`
          <div class="quick-ep-card ${A?"active":""}" data-season="${z}" data-episode="${T}">
            <div class="quick-ep-pill">
              <span class="quick-ep-num">B${T}</span>
              ${A?'<span class="quick-ep-now">Oynatılıyor</span>':""}
              ${k&&!A?'<i data-lucide="check" class="quick-ep-watched"></i>':""}
            </div>
          </div>
        `}).join(""):e.innerHTML=o.map(T=>{const A=T.episode_number,k=A===P,H=Zt(r,z,A),X=T.still_path?`https://image.tmdb.org/t/p/w200${T.still_path}`:"";return`
          <div class="quick-ep-card ${k?"active":""}" data-season="${z}" data-episode="${A}">
            ${X?`<div class="quick-ep-thumb"><img src="${X}" alt="B${A}" loading="lazy" /></div>`:""}
            <div class="quick-ep-info">
              <div class="quick-ep-title-row">
                <span class="quick-ep-num">B${A}</span>
                <span class="quick-ep-name">${T.name||`${A}. Bölüm`}</span>
              </div>
              ${k?'<span class="quick-ep-now">Oynatılıyor</span>':H?'<span class="quick-ep-watched-label">İzlendi</span>':""}
            </div>
          </div>
        `}).join(""),e.querySelectorAll(".quick-ep-card").forEach(T=>{T.addEventListener("click",()=>{const A=parseInt(T.getAttribute("data-season"),10),k=parseInt(T.getAttribute("data-episode"),10);A===z&&k===P||_t(A,k)})}),de(w);const x=e.querySelector(".quick-ep-card.active");x&&ge(()=>{x.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})},100)}function mi(e){const a=document.getElementById("player-episode-drawer");a&&(xt=typeof e=="boolean"?e:!xt,xt?(a.classList.remove("hidden"),ue=z,Dt()):a.classList.add("hidden"))}const Ms=document.getElementById("btn-toggle-drawer"),Rs=document.getElementById("btn-close-drawer"),Es=document.getElementById("btn-drawer-trigger-mobile");Ms&&Ms.addEventListener("click",()=>mi()),Rs&&Rs.addEventListener("click",()=>mi(!1)),Es&&Es.addEventListener("click",()=>mi());function Ni(e){const a=document.getElementById("player-shortcuts-popover");a&&(ii=typeof e=="boolean"?e:!ii,ii?a.classList.remove("hidden"):a.classList.add("hidden"))}const Us=document.getElementById("btn-player-shortcuts"),Ps=document.getElementById("btn-close-shortcuts");Us&&Us.addEventListener("click",()=>Ni()),Ps&&Ps.addEventListener("click",()=>Ni(!1));const qs=document.getElementById("btn-player-fullscreen");qs&&qs.addEventListener("click",()=>{vs();const e=document.getElementById("cinema-modal-box")||document.documentElement,a=document.getElementById("video-iframe"),t=document.getElementById("hls-video-player"),h=document.getElementById("direct-video-wrapper")||a||t||e;document.fullscreenElement?document.exitFullscreen?document.exitFullscreen().catch(()=>{}):document.webkitExitFullscreen&&document.webkitExitFullscreen():h&&h.requestFullscreen?h.requestFullscreen().catch(()=>e.requestFullscreen().catch(()=>{})):h&&h.webkitRequestFullscreen?h.webkitRequestFullscreen():e.requestFullscreen&&e.requestFullscreen().catch(()=>{})});function Ns(){const e=document.getElementById("btn-prev-episode");e&&e.addEventListener("click",t=>{t.preventDefault();const o=e.getAttribute("data-action");if(o==="prev-ep"&&P>1)_t(z,P-1);else if(o==="prev-season"){const h=parseInt(e.getAttribute("data-prev-season"),10)||1,x=parseInt(e.getAttribute("data-prev-ep"),10)||1;_t(h,x)}});const a=document.getElementById("btn-next-episode");a&&a.addEventListener("click",t=>{t.preventDefault(),Hn(r,z,P,!0,{title:ne,posterPath:g,backdropPath:v,type:Me?"anime":Q?"tv":"movie",isAnime:Me,duration:Ge}),a.getAttribute("data-action")==="next-season"?_t(z+1,1):_t(z,P+1)})}Ns();const Ca=()=>{_e=!_e,Q?Hn(r,z,P,_e,{title:ne,posterPath:g,backdropPath:v,type:Me?"anime":"tv",isAnime:Me,duration:Ge}):Kr(r,_e,{title:ne,posterPath:g,backdropPath:v,type:Me?"anime":"movie",isAnime:Me,duration:Ge}),[document.getElementById("btn-toggle-watched-player"),document.getElementById("btn-toggle-watched-mobile")].forEach(e=>{if(!e)return;const a=e.querySelector("span"),t=e.querySelector("[data-lucide]");a&&(a.textContent=_e?"İzlendi":"İzlendi Yap"),t&&t.setAttribute("data-lucide",_e?"check-circle-2":"check"),_e?e.classList.add("watched-active"):e.classList.remove("watched-active")}),ee(_e?"✓ İzlendi olarak işaretlendi.":"İzlendi işareti kaldırıldı.","success"),Q&&Dt(),de(w)},Hs=()=>{jn({id:r,title:ne,posterPath:g,backdropPath:v,type:Me?"anime":Q?"tv":"movie",isAnime:Me,isSeries:Q,season:z,episode:P,currentTime:1200,duration:Ge}),ee("⏳ 20. dakikada yarıda bırakıldı olarak kaydedildi.","info")},js=document.getElementById("btn-toggle-watched-player"),Ws=document.getElementById("btn-toggle-watched-mobile");js&&js.addEventListener("click",Ca),Ws&&Ws.addEventListener("click",Ca);const Os=document.getElementById("btn-halfway-player"),Fs=document.getElementById("btn-halfway-mobile");Os&&Os.addEventListener("click",Hs),Fs&&Fs.addEventListener("click",Hs);function Ke(){const e=document.getElementById("player-server-toolbar");if(e){if(e.innerHTML=Dr(),!e.dataset.scrollAttached){e.dataset.scrollAttached="true",e.addEventListener("wheel",h=>{h.deltaY!==0&&(h.preventDefault(),e.scrollLeft+=h.deltaY*1.5)},{passive:!1});let a=!1,t,o;e.addEventListener("mousedown",h=>{a=!0,t=h.pageX-e.offsetLeft,o=e.scrollLeft}),e.addEventListener("mouseleave",()=>{a=!1}),e.addEventListener("mouseup",()=>{a=!1}),e.addEventListener("mousemove",h=>{if(!a)return;h.preventDefault();const T=(h.pageX-e.offsetLeft-t)*2;e.scrollLeft=o-T})}e.querySelectorAll(".server-btn").forEach(a=>{a.addEventListener("click",t=>{t.preventDefault();const o=parseInt(a.getAttribute("data-index"),10);if(o!==ce&&di()){if(f&&!xa(Y[o])){ee("Birlikte izleme için senkronlanabilir doğrudan bir yayın hattı seçin.","info");return}ce=o,e.querySelectorAll(".server-btn").forEach(h=>h.classList.remove("active")),a.classList.add("active"),a.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"}),Ce()}})})}}function Lr(e,a){if(!e)return;const t=document.getElementById("direct-video-wrapper")||e.closest(".direct-video-wrapper");if(!t)return;const{on:o,setTimeout:h,clearTimeout:x,setInterval:T,clearInterval:A}=R,k=t.querySelector("#custom-btn-play"),H=t.querySelector("#custom-time-display"),X=t.querySelector("#custom-timeline-container"),be=t.querySelector("#custom-timeline-played"),G=t.querySelector("#custom-timeline-buffered"),j=t.querySelector("#custom-timeline-thumb"),O=t.querySelector("#custom-timeline-tooltip"),M=t.querySelector("#custom-volume-wrap"),re=t.querySelector("#custom-btn-volume"),J=t.querySelector("#custom-volume-slider"),ye=t.querySelector("#custom-volume-badge"),Se=t.querySelector("#custom-volume-popover"),W=t.querySelector("#custom-btn-fullscreen"),xe=t.querySelector("#custom-btn-more"),me=t.querySelector("#custom-player-menu"),He=t.querySelector("#custom-menu-main"),bt=t.querySelector("#custom-menu-subview"),ke=t.querySelector("#custom-menu-subview-title"),fe=t.querySelector("#custom-menu-options-list"),je=t.querySelector("#custom-menu-back-btn"),$e=t.querySelector("#custom-center-play-indicator"),Te=t.querySelector("#custom-btn-rewind-10"),Ie=t.querySelector("#custom-btn-forward-10"),We=t.querySelector("#custom-brightness-wrap"),tn=t.querySelector("#custom-btn-brightness"),bi=t.querySelector("#custom-brightness-slider"),an=t.querySelector("#custom-brightness-badge"),Ma=t.querySelector("#custom-brightness-popover");if(f&&!Ne()){t.classList.add("room-participant-locked");let b=0;const I=E=>!!E.closest("#custom-volume-wrap, #custom-brightness-wrap, #custom-btn-fullscreen"),_=E=>{I(E.target)||E.target.closest("video")&&E.type==="click"||E.target.closest("button, input, .custom-timeline-container, .custom-player-menu, .custom-binge-card, .dual-audio-bar")&&(E.preventDefault(),E.stopImmediatePropagation(),Date.now()-b>1800&&(b=Date.now(),ee("Oynatma kontrolü moderatörde. Ses, parlaklık ve tam ekran sana açık.","info")))};t.addEventListener("click",_,!0),t.addEventListener("dblclick",_,!0)}const sn=t.querySelector("#custom-btn-screen-lock"),yi=t.querySelector("#custom-btn-screen-unlock"),Wt=t.querySelector("#custom-btn-skip-intro"),Ct=t.querySelector("#custom-binge-card"),Oi=t.querySelector("#binge-sec-num"),nn=t.querySelector("#binge-card-jump-btn"),rn=t.querySelector("#binge-card-close-btn"),Ot=t.querySelector("#custom-btn-sleep"),on=t.querySelector("#custom-menu-item-sleep-menu"),Fi=t.querySelector("#custom-menu-active-sleep"),Ft=t.querySelector("#custom-sleep-curtain"),Ra=t.querySelector("#custom-gesture-hud");t.querySelector("#gesture-hud-icon");const ln=t.querySelector("#gesture-hud-text"),cn=t.querySelector("#gesture-hud-fill"),dn=t.querySelector("#player-ambient-glow"),un=t.querySelector("#player-ambient-canvas");un&&(un.style.display="none"),dn&&(dn.style.background="radial-gradient(circle at center, rgba(245, 158, 11, 0.16) 0%, rgba(20, 184, 166, 0.08) 50%, transparent 75%)");let yt=!1;sn&&(sn.onclick=b=>{b.stopPropagation(),yt=!0,t.classList.add("is-screen-locked"),yi&&yi.classList.remove("hidden"),gt(),t.classList.add("hide-controls"),ee("🔒 Ekran kilitlendi. Dokunmalar korumalı.","info")}),yi&&(yi.onclick=b=>{b.stopPropagation(),yt=!1,t.classList.remove("is-screen-locked"),yi.classList.add("hidden"),Pe(),ee("🔓 Ekran kilidi açıldı.","success")});let pn=!1;Wt&&(Wt.onclick=b=>{b.stopPropagation(),pn=!0,Wt.classList.add("hidden");const I=e.currentTime||0,_=Math.max(I+80,85);e.currentTime=Math.min(e.duration||_,_),ee("⚡ İntro başarıyla atlandı!","success")});let at=null,mn=!1,gi=5;const fn=()=>{at&&(A(at),at=null),Ct&&Ct.classList.add("hidden");const b=document.getElementById("btn-next-episode");b&&(ee("Sonraki bölüme geçiliyor...","info"),b.click())};nn&&(nn.onclick=b=>{b.stopPropagation(),fn()}),rn&&(rn.onclick=b=>{b.stopPropagation(),mn=!0,at&&(A(at),at=null),Ct&&Ct.classList.add("hidden")});const Ki=()=>{const b=e.paused;k&&k.dataset.paused!==String(b)&&(k.dataset.paused=String(b),k.innerHTML=`<i data-lucide="${b?"play":"pause"}" style="width: 20px; height: 20px;"></i>`,de(k)),b&&t.classList.remove("hide-controls")},Ea=()=>{e.paused?(e.play().catch(()=>{}),Ua("play")):(e.pause(),Ua("pause"))},Kt=b=>{const I=e.currentTime||0,_=e.duration||1/0,E=Math.max(0,Math.min(_,I+b));e.currentTime=E,Ve?.("seek",{time:E}),Ua(b>0?"rotate-cw":"rotate-ccw"),ee(b>0?"⏩ +10 saniye":"⏪ -10 saniye","info")};Te&&(Te.onclick=b=>{b.stopPropagation(),Kt(-10)}),Ie&&(Ie.onclick=b=>{b.stopPropagation(),Kt(10)});let ct=Oe.brightness;const Vi=(b,I=!0)=>{ct=Math.max(30,Math.min(150,b)),Oe.brightness=ct,e.style.filter=`brightness(${ct/100})`,bi&&(bi.value=ct),an&&(an.textContent=`%${ct}`);const _=t.querySelector("#custom-menu-active-brightness");_&&(_.textContent=`%${ct}`),I&&typeof Ve=="function"&&Ve("settings")};Ma&&(Ma.onclick=b=>b.stopPropagation(),Ma.ontouchstart=b=>b.stopPropagation()),bi&&(bi.oninput=b=>{b.stopPropagation(),ki(),Vi(parseInt(bi.value,10))}),tn&&(tn.onclick=b=>{if(b.stopPropagation(),We){const I=We.classList.contains("is-open");M&&M.classList.remove("is-open"),I?(We.classList.remove("is-open"),Pe()):(We.classList.add("is-open"),ki())}});const Ua=b=>{$e&&($e.innerHTML=`<i data-lucide="${b}" style="width: 32px; height: 32px;"></i>`,de($e),$e.classList.add("animate"),h(()=>$e.classList.remove("animate"),350))};let hn=0,bn=0,st=null;const yn=()=>{if(!f?.roomCode||Ne()||Ee!=="smooth")return;const b=Date.now();b-bn<5e3||(bn=b,window.dispatchEvent(new CustomEvent("cinepulse:room-playback-progress",{detail:{roomCode:f.roomCode,time:e.currentTime,playing:!e.paused,buffering:!e.paused&&e.readyState<HTMLMediaElement.HAVE_FUTURE_DATA}})))},Yi=b=>{if(!f?.roomCode||Ne()||Ee!=="strict")return;let I=0;try{for(let _=0;_<e.buffered.length;_+=1)if(e.buffered.start(_)<=e.currentTime&&e.buffered.end(_)>=e.currentTime){I=Math.max(0,e.buffered.end(_)-e.currentTime);break}}catch{}window.dispatchEvent(new CustomEvent("cinepulse:room-playback-health",{detail:{roomCode:f.roomCode,status:b,bufferedAhead:I}}))},Ve=(b,I={})=>{!f?.roomCode||Rt||Date.now()<Pt||!Number.isFinite(e.currentTime)||window.dispatchEvent(new CustomEvent("cinepulse:player-sync",{detail:{roomCode:f.roomCode,mediaId:f.mediaId,type:f.type,season:z,episode:P,action:b,source:Ui(),audioTrack:e._currentAudioTrack||null,settings:{...Oe,volume:e.volume,muted:e.muted},time:Number.isFinite(I.time)?I.time:e.currentTime||0,playing:typeof I.playing=="boolean"?I.playing:!e.paused,issuedAt:Date.now()}}))};if(e.playbackRate=Oe.speed,Vi(Oe.brightness,!1),Et){const b=Et;Et=null,window.setTimeout(()=>ka(b),0)}k&&(k.onclick=b=>{b.stopPropagation(),Ea()}),e.onclick=b=>{if(yt||f&&!Ne())return;if(We&&We.classList.contains("is-open")||M&&M.classList.contains("is-open")||me&&!me.classList.contains("hidden")){gt();return}b.pointerType==="touch"||window.matchMedia("(pointer: coarse)").matches||Ea()},o(e,"play",()=>{Ki(),Pe(),Ve("play")}),o(e,"playing",()=>Pe()),o(e,"playing",()=>{st&&x(st),Yi("ready")}),o(e,"canplay",()=>{st&&x(st),Yi("ready")}),o(e,"waiting",()=>{st&&x(st),st=h(()=>Yi("buffering"),900)}),o(e,"stalled",()=>{st&&x(st),st=h(()=>Yi("buffering"),900)}),o(e,"pause",()=>{Ki(),vi(!0),Ve("pause")}),o(e,"ended",()=>{Ki(),ft(e.duration||e.currentTime,e.duration,!0,!0),f?.roomCode&&Ee==="smooth"&&window.dispatchEvent(new CustomEvent("cinepulse:room-playback-finished",{detail:{roomCode:f.roomCode,mediaId:f.mediaId,type:f.type,season:z,episode:P}})),Sr()}),o(e,"seeking",()=>Ve("seek")),o(e,"seeked",()=>{vi(!0),Ve("seek")}),o(e,"ratechange",()=>{Oe.speed=e.playbackRate||1,Ve("settings")}),o(e,"volumechange",()=>Ve("settings")),R.setInterval(yn,5e3);const vi=(b=!1,I=null)=>{if(!e)return;const _=e.currentTime,E=e.duration;if(isNaN(_)||_<0)return;const Z=I!==null?I:e.paused;ft(_,E,null,b,Z)};e._persistProgress=vi,R.on(e,"pause",()=>{vi(!0,!0)}),R.on(e,"play",()=>{vi(!0,!1)});const It=()=>{const b=e.currentTime||0,I=e.duration||0;if(Qe=Math.round(b),H&&(H.textContent=`${Qi(b)} / ${Qi(I)}`),I>0){const _=Math.min(100,Math.max(0,b/I*100));if(be&&(be.style.width=`${_}%`),j&&(j.style.left=`${_}%`),e.buffered&&e.buffered.length>0){for(let E=e.buffered.length-1;E>=0;E--)if(e.buffered.start(E)<=b){const Z=e.buffered.end(E),ie=Math.min(100,Z/I*100);G&&(G.style.width=`${ie}%`);break}}}if(Wt&&(b>=10&&b<=90&&!pn?Wt.classList.remove("hidden"):Wt.classList.add("hidden")),Ct&&Q&&I>70){const _=I-b;_<=40&&_>3&&!mn&&!at&&(Ct.classList.remove("hidden"),de(Ct),gi=5,Oi&&(Oi.textContent=gi),at=T(()=>{gi--,Oi&&(Oi.textContent=gi),gi<=0&&(A(at),at=null,fn())},1e3))}};if(o(e,"timeupdate",It),R.on(e,"timeupdate",()=>{const b=Date.now();b-hn>2e3&&(hn=b,Ve("state")),yn(),f?.roomCode&&Ne()&&Ee==="smooth"&&qt.size&&qt.forEach((I,_)=>{e.currentTime>=I-20&&(qt.delete(_),window.dispatchEvent(new CustomEvent("cinepulse:room-playback-checkpoint",{detail:{roomCode:f.roomCode,targetId:_,action:"resume",mediaId:f.mediaId,type:f.type}})))})}),o(e,"durationchange",It),o(e,"loadedmetadata",It),o(e,"canplay",It),o(e,"progress",It),X){let b=null;const I=_=>{const E=X.getBoundingClientRect();if(!E.width||!Number.isFinite(e.duration)||e.duration<=0)return;const Z=Math.max(0,Math.min(1,(_.clientX-E.left)/E.width));b=Z*e.duration,j&&(j.style.left=`${Z*100}%`),be&&(be.style.width=`${Z*100}%`)};o(X,"pointerdown",_=>{_.button!==0||yt||(_.preventDefault(),X.setPointerCapture(_.pointerId),I(_))}),o(X,"pointermove",_=>{if(X.hasPointerCapture(_.pointerId)&&I(_),!O)return;const E=X.getBoundingClientRect();if(!E.width)return;const Z=Math.max(0,Math.min(1,(_.clientX-E.left)/E.width));O.textContent=Qi(Z*(e.duration||0)),O.style.left=`${Z*100}%`}),o(X,"pointerup",_=>{const E=b;E!==null&&(e.currentTime=E,Ve("seek",{time:E})),b=null,X.hasPointerCapture(_.pointerId)&&X.releasePointerCapture(_.pointerId),Pe()}),o(X,"pointercancel",()=>{b=null,It(),Pe()})}const Lt=()=>{const b=e.muted?0:e.volume;if(J&&(J.value=b),ye&&(ye.textContent=e.muted?"%0":`%${Math.round(b*100)}`),re){let I="volume-2";e.muted||b===0?I="volume-x":b<.5&&(I="volume-1"),re.innerHTML=`<i data-lucide="${I}" style="width: 20px; height: 20px;"></i>`,de(re)}};Se&&(Se.onclick=b=>b.stopPropagation(),Se.ontouchstart=b=>b.stopPropagation()),re&&(re.onclick=b=>{if(b.stopPropagation(),M){const I=M.classList.contains("is-open");We&&We.classList.remove("is-open"),window.matchMedia("(pointer: coarse)").matches?I?(M.classList.remove("is-open"),Pe()):(M.classList.add("is-open"),ki()):(e.muted=!e.muted,Lt())}else e.muted=!e.muted,Lt()}),J&&(J.oninput=b=>{b.stopPropagation(),ki(),e.volume=parseFloat(J.value),e.muted=!1,Lt()});const gn=()=>{document.fullscreenElement?document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen&&document.webkitExitFullscreen():t.requestFullscreen?t.requestFullscreen():t.webkitRequestFullscreen?t.webkitRequestFullscreen():e.requestFullscreen?e.requestFullscreen().catch(()=>{}):t.webkitRequestFullscreen&&t.webkitRequestFullscreen()};W&&(W.onclick=b=>{b.stopPropagation(),vs(),gn()}),e.ondblclick=b=>{b.stopPropagation();const I=e.getBoundingClientRect(),_=b.clientX-I.left;_<I.width*.35?Kt(-10):_>I.width*.65?Kt(10):gn()},o(document,"fullscreenchange",()=>{Pe();const b=!!document.fullscreenElement;W&&(W.innerHTML=`<i data-lucide="${b?"minimize":"maximize"}" style="width: 20px; height: 20px;"></i>`,de(W))});let wi=null,Vt=null;const gt=(b=!0)=>{We&&We.classList.remove("is-open"),M&&M.classList.remove("is-open"),me&&me.classList.add("hidden"),Vt&&(x(Vt),Vt=null),b&&Pe()},ki=()=>{Pe(),wi&&x(wi),Vt&&x(Vt),Vt=h(()=>{gt()},3500)},vt=document.getElementById("cinema-modal-box"),Pe=()=>{if(yt){t.classList.add("hide-controls"),vt&&vt.classList.add("hide-controls");return}t.classList.remove("hide-controls"),vt&&vt.classList.remove("hide-controls"),wi&&x(wi),!e.paused&&!e.ended&&(wi=h(()=>{e.paused||(t.classList.add("hide-controls"),vt&&vt.classList.add("hide-controls"),gt(!1))},3e3))};let vn=0;const wn=()=>{const b=Date.now();b-vn<300||(vn=b,Pe())};o(t,"pointerenter",b=>{b.pointerType==="mouse"&&wn()}),o(t,"pointerdown",wn),o(w,"focusin",Pe),o(t,"mouseleave",()=>{e.paused||(t.classList.add("hide-controls"),vt&&vt.classList.add("hide-controls"),gt(!1))}),xe&&me&&(xe.onclick=b=>{b.stopPropagation(),me.classList.contains("hidden")?(wt(),me.classList.remove("hidden"),t.classList.remove("hide-controls"),ki()):gt()},o(document,"click",b=>{(!t.contains(b.target)||!me.contains(b.target)&&!xe.contains(b.target))&&me.classList.add("hidden"),We&&!We.contains(b.target)&&We.classList.remove("is-open"),M&&!M.contains(b.target)&&M.classList.remove("is-open")}));const wt=()=>{He&&He.classList.remove("hidden"),bt&&bt.classList.add("hidden"),kn()},Yt=(b,I)=>{He&&He.classList.add("hidden"),bt&&bt.classList.remove("hidden"),ke&&(ke.textContent=b),fe&&(fe.innerHTML=I,de(fe)),de(je)};je&&(je.onclick=b=>{b.stopPropagation(),wt()});const kn=()=>{const b=t.querySelector("#custom-menu-active-audio");if(b)if(ae&&ae.audioTracks&&ae.audioTracks.length>1){const ie=ae.audioTracks[ae.audioTrack];let ve=ie?ie.name||ie.lang||`Ses ${ae.audioTrack+1}`:"Otomatik";/tr|turk/i.test(ve)?ve="Türkçe Dublaj":/en|eng|orig/i.test(ve)&&(ve="Orijinal (İngilizce)"),b.textContent=ve}else e._currentAudioTrack?b.textContent=e._currentAudioTrack==="dubbed"?"Türkçe Dublaj":"Orijinal Ses":b.textContent=te==="dubbed"?"Türkçe Dublaj":"Orijinal Ses";const I=t.querySelector("#custom-menu-active-sub");if(I){let ie="Kapalı";const ve=e.textTracks;if(ve&&ve.length>0){for(let ze=0;ze<ve.length;ze++)if(ve[ze].mode==="showing"){ie=ve[ze].label||"Türkçe";break}}I.textContent=ie}const _=t.querySelector("#custom-menu-active-sub-style");if(_){const ie={small:"Küçük",medium:"Normal",large:"Büyük",xlarge:"Çok Büyük"};_.textContent=ie[le?.fontSize]||"Özelleştir"}const E=t.querySelector("#custom-menu-active-speed");if(E){const ie=e.playbackRate||1;E.textContent=ie===1?"Normal":`${ie}x`}const Z=t.querySelector("#custom-menu-active-brightness");Z&&(Z.textContent=`%${ct}`)},$n=t.querySelector("#custom-menu-item-audio");$n&&($n.onclick=b=>{b.stopPropagation(),Mr()});const Mr=()=>{let b="";if(ae&&ae.audioTracks&&ae.audioTracks.length>1)b+='<p style="color:#94a3b8;font-size:10.5px;font-weight:700;text-transform:uppercase;margin:2px 0 6px 6px;">VİDEO SES KANALLARI</p>',ae.audioTracks.forEach((I,_)=>{const E=ae.audioTrack===_;let Z=I.name||I.lang||`Kanal ${_+1}`;/tr|turk/i.test(Z)||/tr|turk/i.test(I.lang||"")?Z="🇹🇷 Türkçe Dublaj":(/en|eng|orig/i.test(Z)||/en|eng/i.test(I.lang||""))&&(Z="🇬🇧 Orijinal (İngilizce)"),b+=`
            <div class="custom-menu-opt-row ${E?"active":""}" data-hls-track="${_}">
              <span>${Z}</span>
              ${E?'<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>':""}
            </div>
          `});else if(e._setAudioTrack){const I=e._currentAudioTrack||"dubbed";b+='<p style="color:#94a3b8;font-size:10.5px;font-weight:700;text-transform:uppercase;margin:2px 0 6px 6px;">VİDEO SES KANALLARI</p>',b+=`
          <div class="custom-menu-opt-row ${I==="dubbed"?"active":""}" data-dual-track="dubbed">
            <span>🇹🇷 Türkçe Dublaj</span>
            ${I==="dubbed"?'<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>':""}
          </div>
          <div class="custom-menu-opt-row ${I==="original"?"active":""}" data-dual-track="original">
            <span>🇬🇧 Orijinal Ses</span>
            ${I==="original"?'<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>':""}
          </div>
        `}else b+='<p style="color:#94a3b8;font-size:10.5px;font-weight:700;text-transform:uppercase;margin:2px 0 6px 6px;">VİDEO SES KANALLARI</p>',b+=`
          <div class="custom-menu-opt-row active" style="cursor:default;">
            <span>${te==="dubbed"?"🇹🇷 Türkçe Dublaj (Tek Kanal)":"🇬🇧 Orijinal Ses (Tek Kanal)"}</span>
            <i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>
          </div>
          <p style="color:#64748b;font-size:11px;margin:10px 6px 4px;line-height:1.4;">
            Bu videoda yalnızca tek bir ses kanalı mevcuttur.
          </p>
        `;Yt("Ses Kanalları",b),fe&&(fe.querySelectorAll("[data-hls-track]").forEach(I=>{I.onclick=_=>{_.stopPropagation();const E=parseInt(I.getAttribute("data-hls-track"),10);if(ae){ae.audioTrack=E;const Z=ae.audioTracks[E],ie=Z?.name||Z?.lang||`Kanal ${E+1}`;ee(`✓ Ses kanalı değiştirildi: ${ie}`,"success")}wt()}}),fe.querySelectorAll("[data-dual-track]").forEach(I=>{I.onclick=_=>{_.stopPropagation();const E=I.getAttribute("data-dual-track");e._setAudioTrack&&e._setAudioTrack(E),wt()}}))},Sn=t.querySelector("#custom-menu-item-subs");Sn&&(Sn.onclick=b=>{b.stopPropagation(),Rr()});const Rr=()=>{const b=e.textTracks;let I=-1;if(b){for(let E=0;E<b.length;E++)if(b[E].mode==="showing"){I=E;break}}let _=`
        <div class="custom-menu-opt-row ${I===-1?"active":""}" data-sub-idx="-1">
          <span>Kapalı</span>
          ${I===-1?'<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>':""}
        </div>
      `;if(b&&b.length>0)for(let E=0;E<b.length;E++){const Z=b[E],ie=I===E;_+=`
            <div class="custom-menu-opt-row ${ie?"active":""}" data-sub-idx="${E}">
              <span>${Z.label||`Altyazı ${E+1}`}</span>
              ${ie?'<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>':""}
            </div>
          `}Yt("Altyazılar",_),fe&&fe.querySelectorAll("[data-sub-idx]").forEach(E=>{E.onclick=Z=>{Z.stopPropagation();const ie=parseInt(E.getAttribute("data-sub-idx"),10);if(b)for(let ze=0;ze<b.length;ze++)b[ze].mode=ze===ie?"showing":"disabled";ee(ie===-1?"Altyazı kapatıldı":`✓ Altyazı: ${b[ie]?.label||"Açık"}`,"info");const ve=t.querySelector("#custom-menu-active-sub");ve&&(ve.textContent=ie===-1?"Kapalı":b[ie]?.label||"Açık"),wt()}})},Pa={fontSize:"medium",color:"#ffffff",fontFamily:"sans",bg:"semi",position:"bottom",bottomOffset:25};let le={...Pa};try{const b=localStorage.getItem("cinepulse_subtitle_style");b&&(le={...Pa,...JSON.parse(b)})}catch{}const Xi=(b=le)=>{let I=document.getElementById("cinepulse-sub-custom-style");I||(I=document.createElement("style"),I.id="cinepulse-sub-custom-style",document.head.appendChild(I));const _={small:"14px",medium:"19px",large:"25px",xlarge:"33px"},E={sans:"Inter, system-ui, -apple-system, sans-serif",serif:"Georgia, Cambria, serif",mono:'"JetBrains Mono", Consolas, monospace'},Z={trans:"transparent",semi:"rgba(0, 0, 0, 0.75)",solid:"rgba(0, 0, 0, 0.95)"},ie=b.bg==="trans"?"0 0 4px #000, 0 0 6px #000, 2px 2px 2px #000, -2px -2px 2px #000":"0 2px 4px rgba(0,0,0,0.85)",ve=typeof b.bottomOffset=="number"?b.bottomOffset:25;if(I.textContent=`
        video::cue {
          font-family: ${E[b.fontFamily]||E.sans} !important;
          font-size: ${_[b.fontSize]||_.medium} !important;
          color: ${b.color||"#ffffff"} !important;
          background-color: ${Z[b.bg]||Z.semi} !important;
          text-shadow: ${ie} !important;
          line-height: 1.35 !important;
          transform: translateY(-${ve}px) !important;
        }
        #custom-html5-video::cue {
          font-family: ${E[b.fontFamily]||E.sans} !important;
          font-size: ${_[b.fontSize]||_.medium} !important;
          color: ${b.color||"#ffffff"} !important;
          background-color: ${Z[b.bg]||Z.semi} !important;
          text-shadow: ${ie} !important;
          line-height: 1.35 !important;
          transform: translateY(-${ve}px) !important;
        }
      `,e&&e.textTracks)try{const ze=b.position==="top"?2:b.position==="middle"?8:-Math.max(1,Math.round(ve/18)+1);for(let he=0;he<e.textTracks.length;he++){const nt=e.textTracks[he];if(nt.cues)for(let Gt=0;Gt<nt.cues.length;Gt++)nt.cues[Gt].line=ze}}catch{}};Xi(le);const xn=t.querySelector("#custom-menu-item-sub-style");xn&&(xn.onclick=b=>{b.stopPropagation(),zn()});const zn=()=>{const b=()=>{const _={sans:"Inter, sans-serif",serif:"Georgia, serif",mono:"monospace"},E={small:"12px",medium:"15px",large:"18px",xlarge:"22px"},Z={trans:"transparent",semi:"rgba(0, 0, 0, 0.75)",solid:"rgba(0, 0, 0, 0.95)"},ie=le.bg==="trans"?"0 0 3px #000, 1px 1px 1px #000":"0 1px 3px rgba(0,0,0,0.8)";return`
          font-family: ${_[le.fontFamily]};
          font-size: ${E[le.fontSize]};
          color: ${le.color};
          background-color: ${Z[le.bg]};
          text-shadow: ${ie};
          padding: 4px 8px;
          border-radius: 4px;
          display: inline-block;
          transition: all 0.15s ease;
        `},I=`
        <div class="custom-sub-settings-panel">
          <!-- Canlı Önizleme -->
          <div class="sub-preview-box">
            <span id="sub-preview-text" style="${b()}">
              Örnek Altyazı Metni
            </span>
          </div>

          <!-- 1. Yazı Boyutu -->
          <div>
            <div class="sub-style-group-label">Yazı Boyutu</div>
            <div class="sub-style-btn-grid">
              <button class="sub-style-btn ${le.fontSize==="small"?"active":""}" data-sub-key="fontSize" data-sub-val="small">Küçük</button>
              <button class="sub-style-btn ${le.fontSize==="medium"?"active":""}" data-sub-key="fontSize" data-sub-val="medium">Normal</button>
              <button class="sub-style-btn ${le.fontSize==="large"?"active":""}" data-sub-key="fontSize" data-sub-val="large">Büyük</button>
              <button class="sub-style-btn ${le.fontSize==="xlarge"?"active":""}" data-sub-key="fontSize" data-sub-val="xlarge">Çok Büyük</button>
            </div>
          </div>

          <!-- 2. Yazı Rengi -->
          <div>
            <div class="sub-style-group-label">Yazı Rengi</div>
            <div class="sub-style-btn-grid">
              <button class="sub-style-btn ${le.color==="#ffffff"?"active":""}" data-sub-key="color" data-sub-val="#ffffff">
                <span style="display:inline-block;width:9px;height:9px;background:#ffffff;border-radius:50%;"></span> Beyaz
              </button>
              <button class="sub-style-btn ${le.color==="#facc15"?"active":""}" data-sub-key="color" data-sub-val="#facc15">
                <span style="display:inline-block;width:9px;height:9px;background:#facc15;border-radius:50%;"></span> Sarı
              </button>
              <button class="sub-style-btn ${le.color==="#4ade80"?"active":""}" data-sub-key="color" data-sub-val="#4ade80">
                <span style="display:inline-block;width:9px;height:9px;background:#4ade80;border-radius:50%;"></span> Yeşil
              </button>
              <button class="sub-style-btn ${le.color==="#38bdf8"?"active":""}" data-sub-key="color" data-sub-val="#38bdf8">
                <span style="display:inline-block;width:9px;height:9px;background:#38bdf8;border-radius:50%;"></span> Mavi
              </button>
            </div>
          </div>

          <!-- 3. Yazı Tipi -->
          <div>
            <div class="sub-style-group-label">Yazı Tipi</div>
            <div class="sub-style-btn-grid" style="grid-template-columns: repeat(3, 1fr);">
              <button class="sub-style-btn ${le.fontFamily==="sans"?"active":""}" data-sub-key="fontFamily" data-sub-val="sans">Sans-Serif</button>
              <button class="sub-style-btn ${le.fontFamily==="serif"?"active":""}" data-sub-key="fontFamily" data-sub-val="serif">Serif</button>
              <button class="sub-style-btn ${le.fontFamily==="mono"?"active":""}" data-sub-key="fontFamily" data-sub-val="mono">Monospace</button>
            </div>
          </div>

          <!-- 4. Arka Plan Opaklığı -->
          <div>
            <div class="sub-style-group-label">Arka Plan Opaklığı</div>
            <div class="sub-style-btn-grid" style="grid-template-columns: repeat(3, 1fr);">
              <button class="sub-style-btn ${le.bg==="trans"?"active":""}" data-sub-key="bg" data-sub-val="trans">Saydam</button>
              <button class="sub-style-btn ${le.bg==="semi"?"active":""}" data-sub-key="bg" data-sub-val="semi">Yarı Saydam</button>
              <button class="sub-style-btn ${le.bg==="solid"?"active":""}" data-sub-key="bg" data-sub-val="solid">Katı Siyah</button>
            </div>
          </div>

          <!-- 5. Dikey Konum -->
          <div>
            <div class="sub-style-group-label">Dikey Konum</div>
            <div class="sub-style-btn-grid" style="grid-template-columns: repeat(3, 1fr);">
              <button class="sub-style-btn ${le.position==="bottom"?"active":""}" data-sub-key="position" data-sub-val="bottom">Alt (Standart)</button>
              <button class="sub-style-btn ${le.position==="middle"?"active":""}" data-sub-key="position" data-sub-val="middle">Orta</button>
              <button class="sub-style-btn ${le.position==="top"?"active":""}" data-sub-key="position" data-sub-val="top">Üst</button>
            </div>
          </div>

          <!-- 6. Manuel Yükseklik / Alt Boşluk (Height Adjustment) -->
          <div>
            <div class="sub-style-group-label" style="display:flex;justify-content:space-between;align-items:center;">
              <span>Altyazı Yüksekliği (Alt Mesafe)</span>
              <span id="sub-bottom-offset-display" style="color:#60a5fa;font-weight:600;font-size:0.85rem;">${le.bottomOffset||25}px</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;margin-top:6px;">
              <button id="btn-sub-offset-dec" class="sub-style-btn" style="padding:4px 10px;font-size:1.1rem;font-weight:bold;line-height:1;min-width:32px;">-</button>
              <input type="range" id="sub-offset-slider" min="0" max="150" step="5" value="${le.bottomOffset||25}" style="flex:1;accent-color:#3b82f6;cursor:pointer;height:6px;border-radius:3px;">
              <button id="btn-sub-offset-inc" class="sub-style-btn" style="padding:4px 10px;font-size:1.1rem;font-weight:bold;line-height:1;min-width:32px;">+</button>
            </div>
          </div>

          <!-- Sıfırla Butonu -->
          <button id="sub-style-reset-btn" class="sub-style-btn" style="width:100%;margin-top:8px;color:#f87171;border-color:rgba(248,113,113,0.3);background:rgba(239,68,68,0.1);">
            <i data-lucide="rotate-ccw" style="width:13px;height:13px;"></i> Varsayılan Ayarlara Sıfırla
          </button>
        </div>
      `;if(Yt("Altyazı Stili & Ayarları",I),fe){fe.querySelectorAll(".sub-style-btn[data-sub-key]").forEach(he=>{he.onclick=nt=>{nt.stopPropagation();const Gt=he.getAttribute("data-sub-key"),Pr=he.getAttribute("data-sub-val");le[Gt]=Pr;try{localStorage.setItem("cinepulse_subtitle_style",JSON.stringify(le))}catch{}Xi(le),he.parentElement.querySelectorAll(".sub-style-btn").forEach(Un=>Un.classList.remove("active")),he.classList.add("active");const En=fe.querySelector("#sub-preview-text");En&&(En.style.cssText=b())}});const _=fe.querySelector("#sub-offset-slider"),E=fe.querySelector("#sub-bottom-offset-display"),Z=fe.querySelector("#btn-sub-offset-dec"),ie=fe.querySelector("#btn-sub-offset-inc"),ve=he=>{const nt=Math.max(0,Math.min(150,parseInt(he,10)||25));le.bottomOffset=nt,_&&(_.value=nt),E&&(E.textContent=`${nt}px`);try{localStorage.setItem("cinepulse_subtitle_style",JSON.stringify(le))}catch{}Xi(le)};_&&(_.oninput=he=>{he.stopPropagation(),ve(he.target.value)}),Z&&(Z.onclick=he=>{he.stopPropagation(),ve((le.bottomOffset||25)-5)}),ie&&(ie.onclick=he=>{he.stopPropagation(),ve((le.bottomOffset||25)+5)});const ze=fe.querySelector("#sub-style-reset-btn");ze&&(ze.onclick=he=>{he.stopPropagation(),le={...Pa};try{localStorage.setItem("cinepulse_subtitle_style",JSON.stringify(le))}catch{}Xi(le),zn(),ee("Altyazı stili varsayılana sıfırlandı","info")})}},An=t.querySelector("#custom-menu-item-speed");An&&(An.onclick=b=>{b.stopPropagation(),Er()});const Er=()=>{const b=[.5,.75,1,1.25,1.5,2],I=e.playbackRate||1;let _="";b.forEach(E=>{const Z=I===E;_+=`
          <div class="custom-menu-opt-row ${Z?"active":""}" data-speed="${E}">
            <span>${E===1?"Normal (1x)":`${E}x`}</span>
            ${Z?'<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>':""}
          </div>
        `}),Yt("Oynatma hızı",_),fe&&fe.querySelectorAll("[data-speed]").forEach(E=>{E.onclick=Z=>{Z.stopPropagation();const ie=parseFloat(E.getAttribute("data-speed"));e.playbackRate=ie,Oe.speed=ie,Ve("settings"),ee(`Oynatma Hızı: ${ie===1?"Normal":`${ie}x`}`,"info"),wt()}})},Tn=t.querySelector("#custom-menu-item-brightness-menu");Tn&&(Tn.onclick=b=>{b.stopPropagation(),Ur()});const Ur=()=>{const b=[{label:"%50 (Gece Modu)",val:50},{label:"%75 (Kısık)",val:75},{label:"%100 (Normal)",val:100},{label:"%125 (Canlı)",val:125},{label:"%150 (Maksimum)",val:150}];let I="";b.forEach(_=>{const E=ct===_.val;I+=`
          <div class="custom-menu-opt-row ${E?"active":""}" data-brightness="${_.val}">
            <span>${_.label}</span>
            ${E?'<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>':""}
          </div>
        `}),Yt("Parlaklık",I),fe&&fe.querySelectorAll("[data-brightness]").forEach(_=>{_.onclick=E=>{E.stopPropagation();const Z=parseInt(_.getAttribute("data-brightness"),10);Vi(Z),ee(`Parlaklık: %${Z}`,"info"),wt()}})},Dn=t.querySelector("#custom-menu-item-pip");Dn&&(Dn.onclick=async b=>{b.stopPropagation(),me.classList.add("hidden");try{document.pictureInPictureElement?await document.exitPictureInPicture():e.requestPictureInPicture&&await e.requestPictureInPicture()}catch{ee("Pencere içinde pencere desteklenmiyor.","error")}});let Gi=null,Zi=null,Xt="Kapalı";const _n=()=>{e.pause(),Ft&&(Ft.classList.remove("hidden"),de(Ft)),ee("🌙 Uyku Modu: Süre doldu, yayın duraklatıldı.","info"),qa()},qa=()=>{Zi&&(e.removeEventListener("ended",Zi),Zi=null),Gi&&(x(Gi),Gi=null),Xt="Kapalı",Fi&&(Fi.textContent=Xt),Ot&&(Ot.style.color="#c084fc")},Cn=(b,I)=>{if(qa(),Xt=I,Fi&&(Fi.textContent=Xt),Ot&&(Ot.style.color="#a855f7"),b==="end-of-episode"){ee("🌙 Uyku Zamanlayıcısı: Bölüm bitince yayın durdurulacak.","info");const E=()=>{e.removeEventListener("ended",E),_n()};Zi=E,o(e,"ended",E);return}const _=b*60;ee(`🌙 Uyku Zamanlayıcısı: ${I} sonra kapatılacak.`,"success"),Gi=h(()=>{_n()},_*1e3)};Ft&&(Ft.onclick=b=>{b.stopPropagation(),Ft.classList.add("hidden"),e.play().catch(()=>{})});const In=()=>{const b=[{label:"Kapalı (İptal Et)",val:0},{label:"15 Dakika",val:15},{label:"30 Dakika",val:30},{label:"45 Dakika",val:45},{label:"60 Dakika (1 Saat)",val:60},{label:"Bölüm Bitince",val:"end-of-episode"}];let I="";b.forEach(_=>{const E=_.val===0&&Xt==="Kapalı"||Xt===_.label;I+=`
          <div class="custom-menu-opt-row ${E?"active":""}" data-sleep-val="${_.val}" data-sleep-label="${_.label}">
            <span>${_.label}</span>
            ${E?'<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>':""}
          </div>
        `}),Yt("Uyku Zamanlayıcısı",I),fe&&fe.querySelectorAll("[data-sleep-val]").forEach(_=>{_.onclick=E=>{E.stopPropagation();const Z=_.getAttribute("data-sleep-val"),ie=_.getAttribute("data-sleep-label");Z==="0"?(qa(),ee("Uyku zamanlayıcısı kapatıldı","info")):Z==="end-of-episode"?Cn("end-of-episode","Bölüm Bitince"):Cn(parseInt(Z,10),ie),wt()}})};on&&(on.onclick=b=>{b.stopPropagation(),In()}),Ot&&(Ot.onclick=b=>{b.stopPropagation(),me.classList.contains("hidden")?(gt(),me.classList.remove("hidden"),In()):gt()});const Na=t.querySelector("#gesture-hud-icon-wrap");let Ln="",Ha=null;const Bn=(b,I,_)=>{Ra&&(Na&&Ln!==b&&(Ln=b,Na.innerHTML=`<i data-lucide="${b}" style="width: 24px; height: 24px;"></i>`,de(Na)),ln&&(ln.textContent=I),cn&&(cn.style.height=`${Math.max(0,Math.min(100,_))}%`),Ra.classList.remove("hidden"),Ha&&x(Ha),Ha=h(()=>{Ra.classList.add("hidden")},700))};let ja=0,Mn=0,dt=null,Ji=0,Wa=0;function Rn(b,I){try{let _=t.querySelector(`.seek-ripple-${b}`);_||(_=document.createElement("div"),_.className=`custom-seek-ripple seek-ripple-${b}`,_.innerHTML=`
            <div class="seek-ripple-content">
              <i data-lucide="${b==="left"?"rotate-ccw":"rotate-cw"}" style="width: 32px; height: 32px;"></i>
              <span>${Math.abs(I)} saniye</span>
            </div>
          `,t.appendChild(_),de(_)),_.classList.remove("animating"),_.offsetWidth,_.classList.add("animating"),h(()=>{_.classList.remove("animating")},650)}catch{}}o(t,"touchstart",b=>{if(yt||b.touches.length!==1)return;const I=b.target;if(I.closest(".custom-player-controls")||I.closest(".custom-player-menu")||I.closest(".custom-skip-intro-btn")||I.closest(".custom-binge-card")||I.closest(".custom-screen-lock-btn")||I.closest(".custom-screen-unlock-badge")||I.closest(".custom-sleep-curtain"))return;const _=b.touches[0],E=t.getBoundingClientRect(),Z=_.clientX-E.left,ie=Date.now();if(ie-Wa<320){Wa=0,b.preventDefault(),Z<E.width*.4?(Kt(-10),Rn("left",-10)):Z>E.width*.6?(Kt(10),Rn("right",10)):Ea(),dt=null,Pe();return}Wa=ie,Pe(),ja=_.clientX,Mn=_.clientY,dt=null},{passive:!1}),o(t,"touchmove",b=>{if(yt||b.touches.length!==1)return;const I=b.target;if(I.closest(".custom-player-controls")||I.closest(".custom-player-menu")||I.closest(".custom-skip-intro-btn")||I.closest(".custom-binge-card")||I.closest(".custom-screen-lock-btn")||I.closest(".custom-screen-unlock-badge"))return;const _=b.touches[0],E=_.clientX-ja,Z=Mn-_.clientY,ie=t.getBoundingClientRect();if(!dt&&Math.abs(Z)>12&&Math.abs(Z)>Math.abs(E)*1.2&&(ja-ie.left<ie.width*.5?(dt="brightness",Ji=ct):(dt="volume",Ji=e.muted?0:e.volume)),dt){b.preventDefault();const ze=Z/(ie.height*.8);if(dt==="brightness"){const he=Math.max(30,Math.min(150,Math.round(Ji+ze*100)));Vi(he),Bn("sun",`%${he}`,(he-30)/120*100)}else if(dt==="volume"){const he=Math.max(0,Math.min(1,Ji+ze));e.volume=he,e.muted=!1,Lt(),Bn(he===0?"volume-x":he<.5?"volume-1":"volume-2",`%${Math.round(he*100)}`,he*100)}}},{passive:!1}),o(t,"touchend",()=>{dt=null},{passive:!0}),o(window,"keydown",b=>{yt||document.activeElement&&(document.activeElement.tagName==="INPUT"||document.activeElement.tagName==="TEXTAREA")||!w||w.classList.contains("hidden")||(b.code==="ArrowUp"?(b.preventDefault(),e.volume=Math.min(1,e.volume+.1),e.muted=!1,Lt()):b.code==="ArrowDown"&&(b.preventDefault(),e.volume=Math.max(0,e.volume-.1),Lt()))}),Ki(),Pe(),Lt(),It(),kn(),de(t)}async function Ce(){if(F)return;S();const e=K,a=document.getElementById("player-iframe-wrapper");if(!a)return;if(ae){try{ae.destroy()}catch{}ae=null}let t=Y[ce];Pi(),a.innerHTML=Is(),de(a),gs(),lt();const o=document.getElementById("player-popout-btn");o&&(o.href=ht(t)||"#");const h=document.getElementById("btn-switch-vip-direct");h&&h.addEventListener("click",()=>{const k=Y.findIndex(H=>H&&(H.isDirectVideo||H.isHls||H.streamUrl&&!H.streamUrl.startsWith("magnet:")&&!H.isTorrent));if(k!==-1&&k!==ce)ce=k,it=0,Ue(),Ce();else{const H=document.getElementById("tab-dubbed");H&&H.click()}});const x=document.getElementById("btn-switch-subtitled-fallback");x&&x.addEventListener("click",()=>{if(te==="dubbed"){const k=document.getElementById("tab-subtitled");k&&k.click()}else{const k=document.getElementById("tab-dubbed");k&&k.click()}});const T=document.getElementById("btn-retry-discovery");if(T&&T.addEventListener("click",()=>{La()}),!!(t?.isDirectVideo||t?.isHls||t?.streamUrl&&!t.streamUrl.startsWith("magnet:")&&(t.streamUrl.includes(".m3u8")||t.streamUrl.includes(".txt")||t.streamUrl.includes(".mp4")||t.streamUrl.includes(".mkv")||t.streamUrl.includes(":4000/torrent/")))){if(ae){try{ae.destroy()}catch{}ae=null}if(Ye){try{Ye.destroy()}catch{}Ye=null}const k=document.getElementById("hls-video-player"),H=ht(t);if(k&&H){const X=H.includes(".m3u8")||H.includes(".txt")||t.isHls,be=t?.source==="DS"&&/filmmakinesi/i.test([t?.id,t?.name,t?.displayName,t?.provider].filter(Boolean).join(" ")),G=t?.source==="DS";if(X&&ut.isSupported()){const W=new ut({enableWorker:!0,lowLatencyMode:!1,startFragPrefetch:!0,progressive:!0,backBufferLength:30,maxBufferLength:30,maxMaxBufferLength:600,maxBufferSize:314572800,maxBufferHole:.5,highBufferWatchdogPeriod:2,nudgeOffset:.2,nudgeMaxRetry:6,abrEwmaDefaultEstimate:5e6,abrEwmaFastVoD:3,abrBandWidthFactor:.92,fragLoadingTimeOut:be?8e3:G?12e3:2e4,manifestLoadingTimeOut:15e3,levelLoadingTimeOut:15e3,fragLoadingMaxRetry:be?1:G?3:6,manifestLoadingMaxRetry:4,levelLoadingMaxRetry:4,xhrSetup:$e=>{try{$e.referrerPolicy="no-referrer"}catch{}}});ae=W;const xe=()=>{if(De>0){const $e=k.duration;if($e&&isFinite($e)&&$e>10&&De>=$e-15){k.currentTime=0;return}k.currentTime=De}};W.loadSource(H),W.attachMedia(k);const me=De>0?De:0;let He=!1,bt=me,ke=Date.now();R.on(k,"timeupdate",()=>{k.currentTime>me+.25&&(He=!0),Math.abs(k.currentTime-bt)>.1&&(bt=k.currentTime,ke=Date.now())}),be?(R.on(k,"seeking",()=>{ke=Date.now()}),R.setInterval(()=>{if(!(F||e!==K||ae!==W)&&!(k.paused||k.ended||Date.now()-ke<8e3)){try{W.destroy()}catch{}ae===W&&(ae=null),Ze("DS FILMMAKİNESİ akışı durdu")}},2e3)):G&&(R.on(k,"seeking",()=>{ke=Date.now()}),R.setInterval(()=>{if(!(F||e!==K||ae!==W)&&!(k.paused||k.ended||Date.now()-ke<15e3)){if(!He&&Date.now()-ke>2e4){try{W.destroy()}catch{}ae===W&&(ae=null),Ze("DS akışı oynatmayı başlatamadı");return}if(He){try{W.destroy()}catch{}ae===W&&(ae=null),Ze("DS akışı durdu")}}},3e3)),t.source==="HDFilmizle"&&R.setTimeout(()=>{if(!(F||e!==K||He)&&k.currentTime<=me+.25){try{W.destroy()}catch{}ae===W&&(ae=null),Ze("HDF akışı oynatmayı başlatamadı")}},18e3),W.on(ut.Events.MANIFEST_PARSED,()=>{if(W.audioTracks&&W.audioTracks.length>1){const Te=W.audioTracks.findIndex(Ie=>/tr|tur|turk/i.test(Ie.name||"")||/tr|tur/i.test(Ie.lang||""));Te!==-1&&W.audioTrack!==Te&&(W.audioTrack=Te)}xe();const $e=k.play();$e!==void 0&&$e.catch(()=>{k.muted=!0,k.play().catch(()=>{})})}),W.on(ut.Events.AUDIO_TRACKS_UPDATED,()=>{const $e=document.querySelector("#custom-menu-active-audio");if($e&&W.audioTracks&&W.audioTracks.length>1){const Te=W.audioTracks[W.audioTrack];let Ie=Te?Te.name||Te.lang||`Ses ${W.audioTrack+1}`:"Otomatik";/tr|turk/i.test(Ie)?Ie="Türkçe Dublaj":/en|eng|orig/i.test(Ie)&&(Ie="Orijinal (İngilizce)"),$e.textContent=Ie}}),R.on(k,"loadedmetadata",xe,{once:!0});let fe=0,je=0;W.on(ut.Events.ERROR,($e,Te)=>{if(!(F||e!==K||ae!==W)&&Te.fatal){if(Te.response&&Te.response.code>=400){try{W.destroy()}catch{}ae=null,Ze(`Sunucu Hatası (HTTP ${Te.response.code})`);return}switch(Te.type){case ut.ErrorTypes.NETWORK_ERROR:if(fe++,fe>2){try{W.destroy()}catch{}ae=null,Ze("Ağ Hatası (Bağlantı koptu)")}else W.startLoad();break;case ut.ErrorTypes.MEDIA_ERROR:if(je++,je<=2)W.recoverMediaError();else if(je<=4){try{W.swapAudioCodec()}catch{}W.recoverMediaError()}else{try{W.destroy()}catch{}ae=null,Ze("Medya Çözümleme Hatası")}break;default:try{W.destroy()}catch{}ae=null,Ze("Oynatma Hatası");break}}})}else if(X&&k.canPlayType("application/vnd.apple.mpegurl")){k.src=H;const W=()=>{if(De>0){const me=k.duration;me&&isFinite(me)&&me>10&&De>=me-15?k.currentTime=0:k.currentTime=De}const xe=k.play();xe!==void 0&&xe.catch(()=>{k.muted=!0,k.play().catch(()=>{})})};R.on(k,"loadedmetadata",W,{once:!0}),R.on(k,"canplay",W,{once:!0}),W(),R.on(k,"error",()=>{F||e!==K||Ze("Yerel HLS oynatıcı hatası")})}else{k.src=H;const W=()=>{if(De>0){const me=k.duration;me&&isFinite(me)&&me>10&&De>=me-15?k.currentTime=0:k.currentTime=De}const xe=k.play();xe!==void 0&&xe.catch(()=>{k.muted=!0,k.play().catch(()=>{})})};R.on(k,"loadedmetadata",W,{once:!0}),R.on(k,"canplay",W,{once:!0}),W(),R.on(k,"error",()=>{F||e!==K||Ze("Video Oynatma Hatası")})}const j=()=>{k&&k.muted&&(k.muted=!1)};R.on(k,"click",j,{once:!0});const O=document.getElementById("custom-player-controls");O&&R.on(O,"click",j,{once:!0});const M=document.getElementById("dubbed-audio-source"),re=document.getElementById("btn-audio-original"),J=document.getElementById("btn-audio-dubbed");if(M&&t.dubbedAudioUrl){let W=te==="dubbed"?"dubbed":"original",xe=!1;const me=()=>{if(xe||!M||!t.dubbedAudioUrl)return;xe=!0;const ke=t.dubbedAudioUrl;if((ke.includes(".m3u8")||t.dubbedAudioIsHls)&&ut.isSupported()){const je=new ut({enableWorker:!0,lowLatencyMode:!1,backBufferLength:30,maxBufferLength:30,maxMaxBufferLength:60,maxBufferSize:3e7,fragLoadingTimeOut:25e3});Ye=je,je.loadSource(ke),je.attachMedia(M)}else M.src=ke},He=(ke,fe=!1)=>{if(W=ke,k._currentAudioTrack=ke,ke==="dubbed"){if(J&&J.classList.add("active"),re&&re.classList.remove("active"),!M||t.streamUrl===t.dubbedAudioUrl){k.muted=!1,fe||(Pi(),ee("🇹🇷 Türkçe Dublaj sesi aktif.","success"));return}if(me(),k.muted=!0,M.muted=!1,M.volume=k.volume,k.currentTime>0&&Math.abs(M.currentTime-k.currentTime)>.3)try{M.currentTime=k.currentTime}catch{}k.paused||M.play().catch(()=>{k.muted=!1}),fe||(Pi(),ee("🇹🇷 Türkçe Dublaj sesi aktif edildi.","success"))}else{if(re&&re.classList.add("active"),J&&J.classList.remove("active"),k.muted=!1,M){M.muted=!0;try{M.pause()}catch{}}fe||(Pi(),ee("🇬🇧 Orijinal ses aktif edildi.","info"))}};k._setAudioTrack=He,k._currentAudioTrack=W,re&&(re.onclick=ke=>{ke.stopPropagation(),He("original")}),J&&(J.onclick=ke=>{ke.stopPropagation(),He("dubbed")}),He(te==="dubbed"?"dubbed":"original",!0),R.on(k,"canplay",()=>{if(W==="dubbed"){if(Math.abs(M.currentTime-k.currentTime)>.3)try{M.currentTime=k.currentTime}catch{}k.paused||M.play().catch(()=>{})}},{once:!0}),R.on(k,"play",()=>{W==="dubbed"&&(M.currentTime=k.currentTime,M.play().catch(()=>{}))}),R.on(k,"pause",()=>{W==="dubbed"&&M.pause()}),R.on(k,"seeking",()=>{W==="dubbed"&&(M.currentTime=k.currentTime)}),R.on(k,"seeked",()=>{W==="dubbed"&&(M.currentTime=k.currentTime,k.paused||M.play().catch(()=>{}))}),R.on(k,"waiting",()=>{W==="dubbed"&&M.pause()}),R.on(k,"playing",()=>{W==="dubbed"&&(Math.abs(M.currentTime-k.currentTime)>.25&&(M.currentTime=k.currentTime),M.play().catch(()=>{}))}),R.on(k,"volumechange",()=>{W==="dubbed"&&(M.volume=k.volume,M.muted=k.muted)}),R.on(k,"timeupdate",()=>{W==="dubbed"&&!k.paused&&Math.abs(M.currentTime-k.currentTime)>.3&&(M.currentTime=k.currentTime)})}let ye=!1;const Se=()=>{ye||F||e!==K||(ye=!0,Xo({contentKey:ya(),category:te,source:t}))};R.on(k,"playing",Se),R.on(k,"timeupdate",Se),R.on(k,"error",()=>{ir({category:te,source:t})}),Cs(k,t),Lr(k),kr(k)}}}function Br(e){if(document.getElementById("dubbed-found-banner"))return;const a=document.getElementById("player-iframe-wrapper");if(!a)return;const t=document.createElement("div");t.id="dubbed-found-banner",t.className="dubbed-found-banner",t.innerHTML=`
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
    `,a.appendChild(t),de(t),document.getElementById("btn-switch-to-new-dubbed")?.addEventListener("click",o=>{o.stopPropagation(),t.remove();const h=document.getElementById("tab-dubbed");h&&h.click()}),document.getElementById("btn-close-dubbed-banner")?.addEventListener("click",o=>{o.stopPropagation(),t.remove()})}let Hi=!1,Ia=!1;function La({isEpisodeSwitch:e=!1}={}){const a=++se,t=Date.now();let o=0;et=!0,Hi=!0,Re=!1,Ia=!1,it=0,we={dubbed:[],subtitled:[]},Y=[],Ke(),Ce();const h=ge(()=>{if(F||a!==se||Re)return;const x=te==="dubbed"?"subtitled":"dubbed";(we[te]||[]).length===0&&(we[x]||[]).length>0&&(te=x,document.getElementById("tab-dubbed")?.classList.toggle("active",te==="dubbed"),document.getElementById("tab-subtitled")?.classList.toggle("active",te==="subtitled"),Re=!0,et=!1,Y=we[te],ce=Nt(Y),Ke(),Ue(),Fe(),Ce())},1800);Ko({type:i,tmdbId:r,title:ne,seriesTitle:ne,originalTitle:u,season:z,episode:P,onUpdate:({dubbed:x=[],subtitled:T=[],isComplete:A=!1,newStream:k=null,isDubbedStream:H=!1})=>{if(F||a!==se)return;if(we={dubbed:tr(x,{contentKey:ya(),category:"dubbed"}),subtitled:tr(T,{contentKey:ya(),category:"subtitled"})},Tr(),Hi=!A,lt(),tt){if(ks())return;if(!$s()){A&&(et=!1,Ke(),Ue(),Ta(`${tt.name||"Moderatörün seçtiği kaynak"} bu cihazda bulunamadı`));return}}if(te==="subtitled"&&H&&k&&!Ia&&Re&&(Ia=!0,Br(k)),!Re){if(we[te]?.length>0){pe(h),Re=!0,et=!1,Y=we[te],ce=Nt(Y),Ke(),Ue(),Fe(),Ce();return}const G=Date.now()-t,j=te==="dubbed"?"subtitled":"dubbed",O=we[j]||[];if((A||G>=1800)&&O.length>0){pe(h),te=j,document.getElementById("tab-dubbed")?.classList.toggle("active",te==="dubbed"),document.getElementById("tab-subtitled")?.classList.toggle("active",te==="subtitled"),Re=!0,et=!1,Y=O,ce=Nt(Y),Ke(),Ue(),Fe(),Ce();return}if(A){pe(h),et=!1,Ke(),Ue(),Fe(),Ce();return}}const X=Y[ce];if(Y=we[te]||[],X&&Re){const G=Y.findIndex(j=>j.id&&j.id===X.id||j.url&&j.url===X.url);G!==-1&&(ce=G)}if(!Re&&Y.length>0){Re=!0,et=!1,ce=Nt(Y),Ke(),Ue(),Fe(),Ce();return}if(!!(document.querySelector(".player-error-view")||document.querySelector(".player-loading-overlay"))&&Y.length>0){const G=Y.findIndex(j=>!j.failed);if(G!==-1&&(G!==ce||Y[ce]?.failed)){ce=G,it=0,Ke(),Ue(),Fe(),Ce();return}}o||(o=requestAnimationFrame(()=>{o=0,!(F||a!==se)&&(Ue(),Fe(),_r())}))}})}C?(we={dubbed:[{source:"OFFLINE",name:"Cihaza indirilen",displayName:"Cihaza indirilen",streamUrl:C,isDirectVideo:N!=="hls",isHls:N==="hls"}],subtitled:[]},Y=we.dubbed,ce=0,et=!1,Re=!0,Ke(),Ce()):La(),i==="tv"&&Dt(),ps();async function _t(e,a){if(fa||f&&!Rt&&!di())return;fa=!0,S(),z=e,P=a,qi(),f?.roomCode&&window.dispatchEvent(new CustomEvent("cinepulse:player-sync",{detail:{roomCode:f.roomCode,mediaId:f.mediaId,type:f.type,season:z,episode:P,action:"episode",source:Ui(),audioTrack:w.querySelector("#hls-video-player")?._currentAudioTrack||null,time:0,playing:!0,issuedAt:Date.now()}}));const t=document.getElementById("player-modal-title");t&&(t.textContent=ws());const o=document.getElementById("player-resume-time-badge");o&&o.remove();const h=document.getElementById("player-iframe-wrapper");h&&(h.innerHTML=`
        <div class="player-loading-overlay">
          <div class="player-loader-core">
            <div class="player-loader-spinner"></div>
            <i data-lucide="play" class="player-loader-icon"></i>
          </div>
          <div class="player-loader-text">
            <h3>${ne}</h3>
            <p class="player-loader-sub">Sezon ${z} • Bölüm ${P} Yükleniyor...</p>
            <p class="player-loader-hint">Yeni bölüm akış hatları taranıyor...</p>
          </div>
        </div>
      `,de(w));const x=Nn(r,z,P);De=x?x.currentTime:0,_e=Zt(r,z,P),Qe=De,ba=0,La({isEpisodeSwitch:!0}),ha(_e),Bs(),Q&&(Ss(),Dt(),zs(e,a),Ir()),ps(),de(w),fa=!1}const ji=document.getElementById("tab-dubbed"),Wi=document.getElementById("tab-subtitled");ji&&ji.addEventListener("click",e=>{if(e.preventDefault(),e.stopPropagation(),te!=="dubbed"&&di()){te="dubbed",it=0;try{localStorage.setItem("cp_preferred_category","dubbed")}catch{}Wi.classList.remove("active"),ji.classList.add("active"),S(),Y=we.dubbed||[],ce=Nt(Y),Re=Y.length>0,Ke(),Ue(),Fe(),Ce(),ee("🇹🇷 Türkçe Dublaj sunucularına geçildi.","info")}}),Wi&&Wi.addEventListener("click",e=>{if(e.preventDefault(),e.stopPropagation(),te!=="subtitled"&&di()){te="subtitled",it=0;try{localStorage.setItem("cp_preferred_category","subtitled")}catch{}ji.classList.remove("active"),Wi.classList.add("active"),S(),Y=we.subtitled||[],ce=Nt(Y),Re=Y.length>0,Ke(),Ue(),Fe(),Ce(),ee("💬 Türkçe Altyazılı VIP sunucularına geçildi.","info")}});const Ks=document.getElementById("btn-open-sources-drawer"),Vs=document.getElementById("btn-close-sources-popover"),Ys=document.getElementById("sources-popover-backdrop");Ks&&Ks.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),jt()}),Vs&&Vs.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),jt(!1)}),Ys&&Ys.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),jt(!1)});const Xs=w.querySelector("#btn-player-download");Xs&&Xs.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),Ds(Q?z:null,Q?P:null)});const Gs=w.querySelector("#btn-close-download-popover"),Zs=w.querySelector("#download-popover-backdrop");Gs&&Gs.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),w.querySelector("#player-download-popover")?.classList.add("hidden")}),Zs&&Zs.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),w.querySelector("#player-download-popover")?.classList.add("hidden")});const fi=document.getElementById("btn-player-theater");fi&&fi.addEventListener("click",()=>{const e=document.getElementById("cinema-modal-box");if(e){e.classList.toggle("theater-mode"),fi.classList.toggle("active");const a=e.classList.contains("theater-mode"),t=fi.querySelector("span"),o=fi.querySelector("[data-lucide]");if(t&&(t.textContent=a?"Genişletildi":"Sinema"),o&&o.setAttribute("data-lucide",a?"minimize-2":"tv"),de(w),a){const h=document.querySelector(".player-stage-wrapper");h&&h.scrollIntoView({behavior:"smooth",block:"start"})}ee(a?"🎥 Sinema Modu (Genişletilmiş Sahne) Aktif Edildi.":"Normal Görünüme Dönüldü.","info")}});const Ba=document.getElementById("dizisol-overview");Ba&&Ba.addEventListener("click",()=>{Ba.classList.toggle("expanded")});const Js=document.getElementById("btn-report-issue");Js&&Js.addEventListener("click",()=>{const e=Y[ce];ee(`✅ Bildirim alındı: ${e?.name||"Yayın"} için sistem hata kaydı oluşturuldu. Sıradaki kaynağa geçiliyor...`,"success"),Ze("Kullanıcı hata bildirdi")}),w.querySelectorAll("[data-watch-state]").forEach(e=>{e.addEventListener("click",()=>{e.getAttribute("data-watch-state")==="toggle"?Ca():(ft(Qe,Ge,!1,!0),ee("Daha sonra izlemek için listenize kaydedildi.","success")),e.closest("details")?.removeAttribute("open")})}),w.querySelector("#btn-player-share")?.addEventListener("click",async()=>{const e={title:ne,text:`${ne} CinePulse'ta izleniyor.`,url:window.location.href};try{navigator.share?await navigator.share(e):(await navigator.clipboard?.writeText(window.location.href),ee("Bağlantı kopyalandı.","success"))}catch{}});const Qs=document.getElementById("player-close-btn"),hi=()=>{if(F)return;if(F=!0,se++,w.querySelector("#hls-video-player")||ft(Qe,Ge,null,!0),S(),V.dispose(),ra=null,document.title=wr,mt(oa),window.removeEventListener("pagehide",Bi),window.removeEventListener("beforeunload",Bi),ae){try{ae.destroy()}catch{}ae=null}if(Ye){try{Ye.destroy()}catch{}Ye=null}Wr(),Qt&&(window.open=Qt,Qt=null);try{w.querySelectorAll("video, audio").forEach(t=>{try{t.pause(),t.removeAttribute("src"),t.load()}catch{}})}catch{}w.querySelectorAll("iframe").forEach(a=>{try{a.src="about:blank",a.remove()}catch{}}),w.classList.add("hidden"),w.innerHTML="",document.body.style.overflow="",document.removeEventListener("keydown",en)};ra=hi,Qs&&Qs.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),hi()}),w.onclick=e=>{e.target===w&&hi()};const en=e=>{if(!(document.activeElement?.isContentEditable||["input","textarea","select"].includes(document.activeElement?.tagName?.toLowerCase()))&&!(document.activeElement?.tagName==="BUTTON"&&(e.code==="Space"||e.key==="Enter"))&&!(w.querySelector(".is-screen-locked")&&e.key!=="Escape")){if(f&&!Ne()&&!["Escape","f","F","m","M"].includes(e.key)){e.preventDefault();return}if(e.key==="Escape")si?jt(!1):ii?Ni(!1):xt?mi(!1):hi();else if(e.key==="f"||e.key==="F"){e.preventDefault();const a=document.getElementById("cinema-modal-box")||document.documentElement;document.fullscreenElement?document.exitFullscreen().catch(()=>{}):a.requestFullscreen().catch(()=>{})}else if(e.key==="e"||e.key==="E"||e.key==="b"||e.key==="B")Q&&(e.preventDefault(),mi());else if(e.key==="?"||e.key==="/")e.preventDefault(),Ni();else if(e.key==="n"||e.key==="N"){const a=document.getElementById("btn-next-episode");a&&a.click()}else if(e.key==="p"||e.key==="P"){const a=document.getElementById("btn-prev-episode");a&&a.click()}else if(e.code==="Space"||e.key==="k"||e.key==="K"){const a=document.getElementById("hls-video-player");a&&(e.preventDefault(),a.paused?a.play().catch(()=>{}):a.pause())}else if(e.key==="ArrowRight"){const a=document.getElementById("hls-video-player");a&&(e.preventDefault(),a.currentTime=Math.min(a.duration||99999,a.currentTime+10))}else if(e.key==="ArrowLeft"){const a=document.getElementById("hls-video-player");a&&(e.preventDefault(),a.currentTime=Math.max(0,a.currentTime-10))}else if(e.key==="m"||e.key==="M"){const a=document.getElementById("hls-video-player");a&&(e.preventDefault(),a.muted=!a.muted,ee(a.muted?"🔇 Ses kapatıldı":"🔊 Ses açıldı","info"))}}};document.addEventListener("keydown",en)}export{es as openPlayerModal};
