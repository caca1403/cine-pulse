import test from 'node:test';
import assert from 'node:assert/strict';
import { disposeLiveMedia } from '../src/services/livePlayback.js';

test('a failed stopLoad still detaches and destroys the previous player', () => {
 const calls=[];
 disposeLiveMedia({hls:{stopLoad(){throw new Error('already stopped')},detachMedia(){calls.push('detach')},destroy(){calls.push('destroy')}},video:{pause(){calls.push('pause')},removeAttribute(x){calls.push(x)},load(){calls.push('load')}},frames:[{remove(){calls.push('iframe removed')}}]});
 assert.deepEqual(calls,['detach','destroy','pause','src','load','iframe removed']);
});
test('every embedded player and TS engine is removed on a channel switch', () => {
 let activeFrames=2;let destroyed=false;
 disposeLiveMedia({mpegts:{destroy(){destroyed=true}},frames:[{remove(){activeFrames--}},{remove(){activeFrames--}}]});
 assert.equal(activeFrames,0);assert.equal(destroyed,true);
});
