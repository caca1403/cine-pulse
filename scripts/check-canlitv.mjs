import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execFileAsync = promisify(execFile);
import fs from 'node:fs';
import { resolveCanliChannel } from '../api/_canlitv.js';
const list = JSON.parse(fs.readFileSync(process.argv[2] || '/tmp/cp-live-list.json','utf8')).channels;
const output = 'reports/canlitv-check.json';
fs.mkdirSync('reports/canlitv-players',{recursive:true});
const results=[];
const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
async function get(url,ref='',binary=false) {
 const args=['-4','-fsSL','--connect-timeout','2','--max-time','6','-A',UA,'-w','\nCP_META:%{content_type}|%{url_effective}'];
 if(ref)args.push('-e',ref,'-H',`Origin: ${new URL(ref).origin}`);
 if(binary)args.push('--range','0-1023');
 args.push(url);
 const {stdout}=await execFileAsync('curl',args,{encoding:'buffer',maxBuffer:12*1024*1024,timeout:7000});
 const at=stdout.lastIndexOf(Buffer.from('\nCP_META:'));const body=stdout.subarray(0,at);const [type,finalUrl]=stdout.subarray(at+9).toString().split('|');
 if(binary){if(!body.length)throw new Error('Empty media');return {bytes:body.length,type}}
 return {text:body.toString(),url:finalUrl};
}
async function check(c){
 const start=Date.now();const out={name:c.name,slug:c.slug,logo:c.logo,playerId:c.playerId||c.logo.match(/\/(\d+)\.jpg/)?.[1]};
 try{const source=await resolveCanliChannel(c.slug,out.playerId);out.kind=source.kind;out.streamUrl=source.url;out.referer=source.referer;out.resolveMs=Date.now()-start;
 if(source.kind==='external'){await get(source.externalUrl);out.playback='external-link';}else if(source.kind==='embed'){await get(source.embedUrl);out.playback='embed-page-available';}else if(source.kind==='youtube'){await get(`https://www.youtube.com/oembed?url=${encodeURIComponent('https://www.youtube.com/watch?v='+source.videoId)}&format=json`);out.playback='embed-available';}else {
 let url=source.url;let media='';
 for(let depth=0;depth<4;depth++){const p=await get(url,source.referer);if(!p.text.trimStart().startsWith('#EXTM3U'))throw new Error('Not an HLS playlist');const lines=p.text.split(/\r?\n/);const next=lines.find(x=>x.trim()&&!x.startsWith('#'));if(!next)throw new Error('Empty playlist');const child=new URL(next.trim(),p.url).href;
 if(p.text.includes('#EXTINF:')){media=child;break}url=child}
 if(!media)throw new Error('No media playlist');out.media=await get(media,source.referer,true);out.playback='ok';}
 }catch(e){out.playback='error';out.error=e.code === 28 ? 'Timeout' : e.code === 22 ? 'Upstream HTTP error' : e.message.split('\n')[0];if(e.playerHtml)fs.writeFileSync(`reports/canlitv-players/${c.slug}.html`,e.playerHtml)}
 try{out.logoStatus=await get(c.logo,'https://www.canlitv.you/',true);if(!out.logoStatus.type?.startsWith('image/'))out.logoError='Not an image'}catch(e){out.logoError=e.message}
 out.totalMs=Date.now()-start;results.push(out);fs.writeFileSync(output,JSON.stringify({checkedAt:new Date().toISOString(),total:list.length,checked:results.length,results},null,2));
 console.log(`${results.length}/${list.length} ${c.name}: ${out.playback}${out.error?' '+out.error:''}${out.logoError?' logo='+out.logoError:''}`);
}
let index=0;async function worker(){while(index<list.length){const c=list[index++];await check(c)}}
await Promise.all(Array.from({length:4},worker));
console.log(JSON.stringify({total:results.length,playable:results.filter(x=>x.playback==='ok').length,failed:results.filter(x=>x.playback==='error').length,logoErrors:results.filter(x=>x.logoError).length}));
