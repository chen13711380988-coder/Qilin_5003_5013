import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const historySource=fs.readFileSync(new URL('../dist/history.js',import.meta.url),'utf8');
const appSource=fs.readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
let now=new Date(2026,8,28,10).getTime();
class Clock extends Date {constructor(...args){super(...(args.length?args:[now]))}static now(){return now}}
const memory=new Map();const storage={getItem:key=>memory.get(key)||null,setItem:(key,value)=>memory.set(key,value)};
let locked=false;
const locks={async request(name,options,callback){if(locked)return callback(null);locked=true;try{return await callback({name})}finally{locked=false}}};
function app(){
 const elements=new Map();function element(id){if(!elements.has(id))elements.set(id,{id,value:'60',textContent:'',innerHTML:'',attrs:{},listeners:{},children:[],dataset:{},addEventListener(n,fn){this.listeners[n]=fn},setAttribute(n,v){this.attrs[n]=v},querySelectorAll(){return []},focus(){},reportValidity(){return true},replaceChildren(){this.children=[]},append(c){this.children.push(c)},play(){this.paused=false;return Promise.resolve()},pause(){this.paused=true},load(){},paused:true});return elements.get(id)}
 const ctx=vm.createContext({Date:Clock,document:{getElementById:element,querySelectorAll:()=>[],body:{classList:{toggle(){}}},createElement:()=>({append(){},textContent:''}),addEventListener(){}},window:{addEventListener(){}},navigator:{locks},localStorage:storage,setInterval(){},console});
 vm.runInContext(historySource,ctx);vm.runInContext(appSource,ctx);return {run:s=>vm.runInContext(s,ctx),element};
}
const flush=()=>new Promise(setImmediate);
const a=app();
a.run('frequency=.1;length=2;reset()');await a.element('start').onclick();await flush();
now+=4000;a.run('tick()');assert.equal(a.run('tracker.totals(Object.keys(tracker.records)).focus'),4000);
const b=app();await b.element('start').onclick();assert.equal(b.run('running'),false,'Second tab must not run');
now+=2000;a.run('tick()');await flush();assert.equal(a.run('phase'),'rest');assert.equal(a.element('natureAudio').paused,false);
now+=1000;a.run('tick()');assert.equal(a.run('tracker.totals(Object.keys(tracker.records)).rest'),1000);
a.run("changeScene('meadow')");await flush();assert.equal(a.element('natureAudio').src,'assets/forest.mp3');
a.run("changeScene('stream')");await flush();assert.equal(a.element('natureAudio').src,'assets/stream.mp3');
now+=1000;a.run('tick()');await flush();assert.equal(a.run('phase'),'focus');assert.equal(a.element('natureAudio').paused,true);
a.run('reset()');await flush();assert.equal(a.run('tracker.totals(Object.keys(tracker.records)).focus'),6000);assert.equal(a.run('tracker.totals(Object.keys(tracker.records)).rest'),2000);
now+=50000;a.run('tick()');assert.equal(a.run('tracker.totals(Object.keys(tracker.records)).focus'),6000,'Paused time excluded');
const c=app();assert.equal(c.run('tracker.totals(Object.keys(tracker.records)).rest'),2000,'Reload keeps history');
await c.element('start').onclick();now+=100000;c.run('tick()');assert.equal(c.run('running'),false);assert.equal(c.run('tracker.totals(Object.keys(tracker.records)).focus'),6000,'Suspended gap excluded');await flush();
const lib=a.run('PauseHistory');const chunks=[];lib.splitInterval(new Date(2026,8,28,23,59,50).getTime(),new Date(2026,8,29,0,0,10).getTime(),(day,ms)=>chunks.push([day,ms]));assert.equal(chunks.length,2);assert.equal(chunks[0][1],10000);assert.equal(chunks[1][1],10000);
assert.equal(lib.period('week',0,new Date(2026,8,30)).days[0],'2026-09-28');assert.equal(lib.period('month',0,new Date(2024,1,15)).days.length,29);assert.equal(lib.period('month',-1,new Date(2026,0,15)).days[0],'2025-12-01');
const dst=[];lib.splitInterval(new Date(2026,2,8).getTime(),new Date(2026,2,9).getTime(),(day,ms)=>dst.push(ms));assert.equal(dst[0],23*3600000,'Local DST day');
let failure=false;lib.create({getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}},()=>failure=true);assert.equal(failure,true);
assert.equal(Object.keys(lib.create({getItem:()=>'{"2026-09-28":{"focus":-1,"rest":0}}',setItem(){}}).records).length,0);
console.log('PASS: timing, pause/reset, reload persistence, cross-tab lock, scene audio, inactive gaps, midnight, week/month boundaries, leap year, DST, unavailable storage, and invalid data.');
