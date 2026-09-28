'use strict';
const $=id=>document.getElementById(id);
const eyeRestMessages = [
  'Give your eyes a moment to rest.',
  'Pause your screen. Rest your eyes.',
  'A little break for your hardworking eyes.',
  'Look away, blink gently, and relax your eyes.'
];
let eyeRestMessageIndex = 0;
let length=20,frequency=20,phase='focus',running=false,remaining=1200000,deadline=0,sound=true,reminders=false;
function message(text){$('message').textContent=text}
function duration(){return (phase==='rest'?length:frequency*60)*1000}
function render(){const seconds=Math.max(0,Math.ceil(remaining/1000));$('time').textContent=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;document.title=running?`${$('time').textContent} · ${phase==='rest'?'Rest':'Focus'} — Pause and Break`:'Pause and Break — A little space for your eyes';$('phase').textContent=phase==='rest'?'A MOMENT JUST FOR YOU':running?'YOUR NEXT PAUSE FOR TIRED EYES':'READY WHEN YOU ARE';$('guidance').textContent=eyeRestMessages[eyeRestMessageIndex];$('sceneHint').textContent=phase==='rest'?'Look about 20 feet (6 metres) away.':'A quiet place to come back to.';$('start').innerHTML=running?'Pause timer <span>Ⅱ</span>':` ${remaining===duration()?'Start my rhythm':'Resume timer'} <span>→</span>`;$('breakNow').textContent=phase==='rest'?'Finish break':'Take a break now';document.body.classList.toggle('resting',phase==='rest');$('schedule').textContent=`${length===60?'1 minute':length+' seconds'} of rest, every ${frequency} ${frequency===1?'minute':'minutes'}.`}
const scenes = {
  forest: { title:'Forest birds', sound:'Birdsong', alt:'Lush green forest reflected in the calm waters of Brohm Lake', photographer:'Bryce Evans', credit:'https://unsplash.com/photos/choc7LYd98I' },
  ocean: { title:'Ocean waves', sound:'Waves on the shore', alt:'Turquoise waves rolling onto a sandy beach', photographer:'James Park', credit:'https://unsplash.com/photos/mJ2Rsa_Btsw' },
  meadow: { title:'Open meadow', sound:'Meadow birdsong', audio:'forest', alt:'Wildflowers across a green meadow with distant mountains', photographer:'Hero Ding', credit:'https://unsplash.com/photos/HC5pVT_rBno' },
  stream: { title:'Woodland stream', sound:'Flowing creek', alt:'A stream flowing over moss-covered rocks in a green forest', photographer:'Eric Muhr', credit:'https://unsplash.com/photos/qMMpyTwBQBA' },
  rain: { title:'Gentle rainfall', sound:'Natural rainfall', alt:'Raindrops on a window overlooking a green forest', photographer:'Shutter Verse', credit:'https://unsplash.com/photos/AuTZAjMj6Lg' }
};
const natureAudio=$('natureAudio');
let selectedScene='forest',audioRequest=0,audioPlaying=false,priming=false;
natureAudio.volume=.6;
function soundUI(status){
  $('sound').setAttribute('aria-pressed',String(audioPlaying));
  $('sound').textContent=audioPlaying?'Ⅱ  Stop sound':'▶  Play sound';
  $('audioStatus').textContent=status||`${scenes[selectedScene].sound} · ${audioPlaying?(natureAudio.volume===0?'Playing at 0% volume':'Playing'):sound?'Ready for your next break':'Sound off'}`;
}
function stopSound(){audioRequest++;priming=false;natureAudio.pause();natureAudio.muted=false;audioPlaying=false;soundUI()}
async function audioReady(){
  // Start the actual media element during a user gesture to allow a later reminder.
  if(audioPlaying||!sound)return;
  const request=++audioRequest;priming=true;natureAudio.muted=true;
  try{await natureAudio.play();if(request!==audioRequest)return;natureAudio.pause();natureAudio.currentTime=0}
  catch(error){if(request===audioRequest&&error.name!=='AbortError')soundUI('Select Play sound to enable audio in this browser.')}
  finally{if(request===audioRequest){priming=false;natureAudio.muted=false}}
}
async function playSound(){
  if(!sound)return;
  const request=++audioRequest;priming=false;natureAudio.muted=false;
  soundUI(`${scenes[selectedScene].sound} · Loading…`);
  try{await natureAudio.play();if(request!==audioRequest)return;audioPlaying=true;soundUI()}
  catch(error){if(request!==audioRequest)return;audioPlaying=false;soundUI(error.name==='NotAllowedError'?'Select Play sound to allow audio.':'Audio could not play. Select Play sound to retry.')}
}
natureAudio.addEventListener('playing',()=>{if(!priming){audioPlaying=true;soundUI()}});
natureAudio.addEventListener('waiting',()=>{if(!priming)soundUI(`${scenes[selectedScene].sound} · Loading…`)});
natureAudio.addEventListener('error',()=>{audioPlaying=false;soundUI('Audio could not load. Reload the page and try again.')});
function changeScene(scene){
  if(!Object.hasOwn(scenes,scene))return;
  const resume=audioPlaying||(phase==='rest'&&running&&sound);
  stopSound();selectedScene=scene;
  const details=scenes[scene];
  $('natureImage').src=`assets/${scene}.jpg`;$('natureImage').alt=details.alt;
  $('sceneLabel').textContent=details.title;
  $('photoCredit').href=details.credit;$('photoCredit').textContent=`Photo: ${details.photographer} ↗`;
  document.querySelectorAll('[data-scene]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.scene===scene)));
  natureAudio.src=`assets/${details.audio||scene}.mp3`;natureAudio.load();soundUI();
  if(resume)void playSound();
}
document.querySelectorAll('[data-scene]').forEach(button=>button.addEventListener('click',()=>changeScene(button.dataset.scene)));
$('volume').addEventListener('input',()=>{natureAudio.volume=Number($('volume').value)/100;$('volumeValue').textContent=`${$('volume').value}%`;soundUI()});
function notifyBreak(){if(!reminders||!('Notification'in window)||Notification.permission!=='granted')return;try{const n=new Notification('Pause and Break',{body:`Your ${length}-second break is ready. Look away, breathe, and relax.`,tag:'still-break',silent:true});n.onclick=()=>{window.focus();n.close()}}catch{message('Desktop reminders are unavailable here. Your on-page reminder is active.')}}
// A single active timer owns the history writer across tabs.
let lastAccount=0,releaseTimerLock=null,lockPending=false;
const tracker=PauseHistory.create({getItem:key=>localStorage.getItem(key),setItem:(key,value)=>localStorage.setItem(key,value)},()=>{$('storageNote').textContent='History cannot be saved in this browser. Totals last only until this page closes.'});
let summaryMode='day',summaryOffset=0,lastSaved=0;
function timeLabel(ms){const seconds=Math.floor(ms/1000),hours=Math.floor(seconds/3600),minutes=Math.floor(seconds%3600/60),rest=seconds%60;return hours?`${hours}h ${minutes}m ${rest}s`:minutes?`${minutes}m ${rest}s`:`${rest}s`}
function renderHistory(){
  const range=PauseHistory.period(summaryMode,summaryOffset),totals=tracker.totals(range.days);
  $('focusTotal').textContent=timeLabel(totals.focus);$('restTotal').textContent=timeLabel(totals.rest);$('trackedTotal').textContent=timeLabel((Math.floor(totals.focus/1000)+Math.floor(totals.rest/1000))*1000);
  const format={month:'short',day:'numeric',year:'numeric'},last=new Date(range.end);last.setDate(last.getDate()-1);
  $('periodLabel').textContent=summaryMode==='month'?range.start.toLocaleDateString(undefined,{month:'long',year:'numeric'}):summaryMode==='week'?`${range.start.toLocaleDateString(undefined,format)} – ${last.toLocaleDateString(undefined,format)}`:range.start.toLocaleDateString(undefined,{weekday:'long',...format});
  $('nextPeriod').disabled=summaryOffset>=0;$('currentPeriod').hidden=summaryOffset===0;
  $('historyEmpty').hidden=totals.focus+totals.rest>0;$('historyEmpty').textContent=summaryOffset===0?'No time recorded yet. Start your rhythm above to begin.':'No time recorded in this period.';
  $('historyRows').replaceChildren();
  for(const day of range.days){const row=tracker.records[day]||{focus:0,rest:0};if(summaryMode!=='day'&&!row.focus&&!row.rest)continue;const tr=document.createElement('tr');for(const value of [day,timeLabel(row.focus),timeLabel(row.rest)]){const cell=document.createElement('td');cell.textContent=value;tr.append(cell)}$('historyRows').append(tr)}
}
async function acquireTimer(){
  if(releaseTimerLock)return true;if(lockPending)return false;
  if(!navigator.locks){message('Please open this page on localhost or HTTPS in a browser with Web Locks support to run the tracked timer.');return false}
  lockPending=true;
  return new Promise(resolve=>{navigator.locks.request('pause-and-break-active-timer',{ifAvailable:true},async lock=>{
    lockPending=false;if(!lock){message('Your timer is running in another tab. Pause it there before starting here.');resolve(false);return}
    tracker.reload();await new Promise(release=>{releaseTimerLock=release;resolve(true)});
  }).catch(()=>{lockPending=false;message('Could not start tracking. Please try again.');resolve(false)})});
}
function releaseTimer(){if(releaseTimerLock){releaseTimerLock();releaseTimerLock=null}}
function saveHistory(){if(releaseTimerLock)tracker.save();else tracker.reload();lastSaved=Date.now();renderHistory()}
function accountTime(){
  if(!running)return false;const now=Date.now();
  // Do not turn a suspended browser or a large clock jump into hours of screen use.
  if(now-lastAccount>90000||now<lastAccount){remaining=Math.max(0,deadline-lastAccount);running=false;stopSound();saveHistory();releaseTimer();message('Timer paused after a long inactive gap. Unobserved time was not counted. Resume when you are ready.');render();return false}
  tracker.add(lastAccount,Math.min(now,deadline),phase);lastAccount=now;remaining=Math.max(0,deadline-now);return true;
}
async function enterRest(){
  if(running)accountTime();if(!await acquireTimer())return;
  eyeRestMessageIndex=(eyeRestMessageIndex+1)%eyeRestMessages.length;
  phase='rest';running=true;remaining=duration();lastAccount=Date.now();deadline=lastAccount+remaining;
  void playSound();notifyBreak();saveHistory();message('Your break has begun. Look into the distance, away from the screen.');render();
}
async function finishRest(){
  if(running)accountTime();if(!await acquireTimer())return;
  stopSound();phase='focus';running=true;remaining=duration();lastAccount=Date.now();deadline=lastAccount+remaining;
  saveHistory();message('Welcome back. Your next focus interval has started.');render();
}
function tick(){
  if(!running)return;if(!accountTime())return;
  if(Date.now()-lastSaved>=5000)saveHistory();else renderHistory();
  if(remaining===0){if(phase==='focus')void enterRest();else void finishRest()}else render();
}
function reset(){accountTime();running=false;phase='focus';remaining=duration();stopSound();saveHistory();releaseTimer();message('Timer reset. Your recorded time is kept.');render()}
$('start').onclick=async()=>{if(running){accountTime();running=false;stopSound();releaseTimer();saveHistory()}else{if(!await acquireTimer())return;running=true;lastAccount=Date.now();deadline=lastAccount+remaining;if(phase==='rest')void playSound();else void audioReady()}render()};
$('breakNow').onclick=()=>{phase==='rest'?void finishRest():void enterRest()};$('reset').onclick=reset;
document.querySelectorAll('[data-period]').forEach(button=>button.addEventListener('click',()=>{summaryMode=button.dataset.period;summaryOffset=0;document.querySelectorAll('[data-period]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderHistory()}));
$('previousPeriod').onclick=()=>{summaryOffset--;renderHistory()};$('nextPeriod').onclick=()=>{if(summaryOffset<0)summaryOffset++;renderHistory()};$('currentPeriod').onclick=()=>{summaryOffset=0;renderHistory()};
window.addEventListener('storage',event=>{if(event.key===PauseHistory.key&&!running){tracker.reload();renderHistory()}});
window.addEventListener('pagehide',()=>{if(running){accountTime();running=false;stopSound();releaseTimer();saveHistory()}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&running){accountTime();saveHistory()}});
$('use202020').onclick=()=>{reset();length=20;frequency=20;remaining=duration();for(const kind of ['length','frequency']){$(kind+'Custom').hidden=true;$(kind+'Choices').querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.value==='20')))}render();message('20 seconds every 20 minutes is set. Press Start my rhythm when ready.');$('start').focus()};
renderHistory();
$('sound').onclick=()=>{if(audioPlaying){sound=false;stopSound()}else{sound=true;void playSound()}};
function setChoice(kind,value){reset();if(kind==='length')length=value;else frequency=value;remaining=duration();render()}
for(const kind of ['length','frequency']){$(kind+'Choices').addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;const custom=button.dataset.value==='custom';$(kind+'Custom').hidden=!custom;$(kind+'Choices').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));if(custom){$(kind+'Input').focus();if(!$(kind+'Input').reportValidity())return}setChoice(kind,custom?Number($(kind+'Input').value):Number(button.dataset.value))});$(kind+'Input').addEventListener('change',()=>{if($(kind+'Input').reportValidity())setChoice(kind,Number($(kind+'Input').value))})}
$('notifications').onclick=async()=>{if(reminders){reminders=false}else if(!('Notification'in window)||!window.isSecureContext){message('Desktop reminders need a supported browser on localhost or HTTPS.');return}else{try{const permission=await Notification.requestPermission();reminders=permission==='granted';message(reminders?'Desktop reminders are on. Keep this page open.':permission==='denied'?'Notifications are blocked. Allow them in your browser’s site settings to enable reminders.':'Permission was not granted. On-page reminders are still available.')}catch{message('Could not enable notifications. Try your regular desktop browser.')}}$('notifications').setAttribute('aria-pressed',String(reminders));$('notifications').setAttribute('aria-label',reminders?'Disable desktop reminders':'Enable desktop reminders')};
setInterval(tick,1000);document.addEventListener('visibilitychange',tick);render();
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'get_break_timer',description:'Read the current screen-break timer and selected rhythm.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute(input){if(!input||Object.keys(input).length)throw new Error('Expected an empty object');return {phase,running,remainingSeconds:Math.ceil((running?Math.max(0,deadline-Date.now()):remaining)/1000),breakSeconds:length,frequencyMinutes:frequency}}})).catch(()=>{})}catch{}}
