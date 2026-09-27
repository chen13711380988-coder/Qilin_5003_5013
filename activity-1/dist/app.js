'use strict';
const $=id=>document.getElementById(id);
let length=20,frequency=20,phase='focus',running=false,remaining=1200000,deadline=0,sound=true,reminders=false;
function message(text){$('message').textContent=text}
function duration(){return (phase==='rest'?length:frequency*60)*1000}
function render(){const seconds=Math.max(0,Math.ceil(remaining/1000));$('time').textContent=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;document.title=running?`${$('time').textContent} · ${phase==='rest'?'Rest':'Focus'} — Pause and Break`:'Pause and Break — A little space for your eyes';$('phase').textContent=phase==='rest'?'A MOMENT JUST FOR YOU':running?'YOUR NEXT MOMENT OF STILLNESS':'READY WHEN YOU ARE';$('guidance').textContent=phase==='rest'?'Relax your gaze. Look away and listen.':'A small pause can fit into a busy day.';$('start').innerHTML=running?'Pause timer <span>Ⅱ</span>':` ${remaining===duration()?'Start my rhythm':'Resume timer'} <span>→</span>`;$('breakNow').textContent=phase==='rest'?'Finish break':'Take a break now';document.body.classList.toggle('resting',phase==='rest');$('schedule').textContent=`${length===60?'1 minute':length+' seconds'} of rest, every ${frequency} ${frequency===1?'minute':'minutes'}.`}
const scenes = {
  forest: { title:'Forest birds', sound:'Birdsong', alt:'Lush green forest reflected in the calm waters of Brohm Lake', photographer:'Bryce Evans', credit:'https://unsplash.com/photos/choc7LYd98I' },
  ocean: { title:'Ocean waves', sound:'Waves on the shore', alt:'Turquoise waves rolling onto a sandy beach', photographer:'James Park', credit:'https://unsplash.com/photos/mJ2Rsa_Btsw' },
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
  natureAudio.src=`assets/${scene}.mp3`;natureAudio.load();soundUI();
  if(resume)void playSound();
}
document.querySelectorAll('[data-scene]').forEach(button=>button.addEventListener('click',()=>changeScene(button.dataset.scene)));
$('volume').addEventListener('input',()=>{natureAudio.volume=Number($('volume').value)/100;$('volumeValue').textContent=`${$('volume').value}%`;soundUI()});
function notifyBreak(){if(!reminders||!('Notification'in window)||Notification.permission!=='granted')return;try{const n=new Notification('Pause and Break',{body:`Your ${length}-second break is ready. Look away, breathe, and relax.`,tag:'still-break',silent:true});n.onclick=()=>{window.focus();n.close()}}catch{message('Desktop reminders are unavailable here. Your on-page reminder is active.')}}
function enterRest(){phase='rest';running=true;remaining=duration();deadline=Date.now()+remaining;playSound();notifyBreak();message('Your break has begun. Let your eyes rest away from the screen.');render()}
function finishRest(){stopSound();phase='focus';running=true;remaining=duration();deadline=Date.now()+remaining;message('Welcome back. Your next focus interval has started.');render()}
function tick(){if(!running)return;remaining=Math.max(0,deadline-Date.now());if(remaining===0){if(phase==='focus')enterRest();else finishRest()}else render()}
function reset(){running=false;phase='focus';remaining=duration();stopSound();message('Timer reset. Your selected rhythm is ready.');render()}
$('start').onclick=()=>{if(running){remaining=Math.max(0,deadline-Date.now());running=false;stopSound()}else{running=true;deadline=Date.now()+remaining;if(phase==='rest')void playSound();else void audioReady()}render()};
$('breakNow').onclick=()=>{phase==='rest'?finishRest():enterRest()};$('reset').onclick=reset;
$('sound').onclick=()=>{if(audioPlaying){sound=false;stopSound()}else{sound=true;void playSound()}};
function setChoice(kind,value){if(kind==='length')length=value;else frequency=value;reset()}
for(const kind of ['length','frequency']){$(kind+'Choices').addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;const custom=button.dataset.value==='custom';$(kind+'Custom').hidden=!custom;$(kind+'Choices').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));if(custom){$(kind+'Input').focus();if(!$(kind+'Input').reportValidity())return}setChoice(kind,custom?Number($(kind+'Input').value):Number(button.dataset.value))});$(kind+'Input').addEventListener('change',()=>{if($(kind+'Input').reportValidity())setChoice(kind,Number($(kind+'Input').value))})}
$('notifications').onclick=async()=>{if(reminders){reminders=false}else if(!('Notification'in window)||!window.isSecureContext){message('Desktop reminders need a supported browser on localhost or HTTPS.');return}else{try{const permission=await Notification.requestPermission();reminders=permission==='granted';message(reminders?'Desktop reminders are on. Keep this page open.':permission==='denied'?'Notifications are blocked. Allow them in your browser’s site settings to enable reminders.':'Permission was not granted. On-page reminders are still available.')}catch{message('Could not enable notifications. Try your regular desktop browser.')}}$('notifications').setAttribute('aria-pressed',String(reminders));$('notifications').setAttribute('aria-label',reminders?'Disable desktop reminders':'Enable desktop reminders')};
setInterval(tick,250);document.addEventListener('visibilitychange',tick);render();
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'get_break_timer',description:'Read the current screen-break timer and selected rhythm.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute(input){if(!input||Object.keys(input).length)throw new Error('Expected an empty object');return {phase,running,remainingSeconds:Math.ceil((running?Math.max(0,deadline-Date.now()):remaining)/1000),breakSeconds:length,frequencyMinutes:frequency}}})).catch(()=>{})}catch{}}
