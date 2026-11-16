const canvas = document.querySelector('#world');
const ctx = canvas.getContext('2d');
const sceneLabel = document.querySelector('#scene-label');
const caption = document.querySelector('#scene-caption');
const progressLabel = document.querySelector('#progress-label');
const progressFill = document.querySelector('#progress-fill');
const toast = document.querySelector('#arrival-toast');
const wishLink = document.querySelector('#wish-link');
const ending = document.querySelector('#ending');
const player = { x: 240, y: 0, step: 0, moving: false, facing: 1 };
const visited = new Set();
let scene = 'crossroads';
let lastFrame = 0;
let toastTimer;
let soundOn = false;
const scenes = {
  crossroads: { label: 'THE CROSSROADS', caption: 'A new chapter is waiting just over the horizon.', sky: '#7898d0', ground: '#758456' },
  band: { label: 'UNDERGROUND BAND VENUE', caption: 'One loud little night. Stay for one more song.', sky: '#392445', ground: '#392b4a' },
  chicago: { label: 'UCHICAGO', caption: 'Big ideas, old stone, and a future all your own.', sky: '#82a8dc', ground: '#b88e71' },
  beijing: { label: 'BEIJING', caption: 'A city of old stories and new adventures.', sky: '#df9b86', ground: '#97705d' }
};

function rect(x, y, w, h, color) { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
function circle(x, y, r, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
function line(x1, y1, x2, y2, color, width=1) { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
function cloud(x,y,s,color) { rect(x,y+3*s,20*s,6*s,color);rect(x+5*s,y,15*s,10*s,color);rect(x+12*s,y-3*s,12*s,12*s,color);rect(x+20*s,y+2*s,14*s,7*s,color); }
function tree(x,y,s,leaf='#718b65') { rect(x+5*s,y+13*s,4*s,15*s,'#68544b');rect(x,y+5*s,14*s,12*s,leaf);rect(x+3*s,y,9*s,13*s,leaf);rect(x+1*s,y+8*s,12*s,4*s,'#93a76e'); }
function drawSky(t, shift) {
  const def = scenes[scene]; rect(0,0,480,270,def.sky);
  if(scene==='band') { rect(0,0,480,170,'#33243f'); for(let i=0;i<15;i++){let x=(i*41-shift*.22+500)%500;circle(x,47+(i%3)*20,2+(i%2),i%2?'#e792bb':'#8c78d8');} }
  else {
    const sunColor=scene==='beijing'?'#ffd19a':'#ffe6b1';circle(scene==='beijing'?367:82,scene==='beijing'?56:51,scene==='beijing'?25:20,sunColor);
    for(let i=0;i<6;i++){let x=((i*106-shift*.16+530)%560)-35;cloud(x,25+(i%3)*22,0.7+(i%2)*.22,scene==='beijing'?'#f4c2b0':'#d3def0');}
    for(let i=0;i<13;i++){let x=((i*51-shift*.34+600)%600)-50;let h=28+(i*19%65);rect(x,120-h,25+(i%3)*13,h,scene==='beijing'?'#9c8298':'#697c9d');for(let wy=130-h;wy<115;wy+=12)for(let wx=x+5;wx<x+22;wx+=9)rect(wx,wy,3,4,'#e5c4a0');}
  }
}
function drawBand(t, shift){
  rect(0,70,480,139,'#34223e');rect(0,78,480,8,'#51334e');
  for(let i=0;i<7;i++){const x=((i*82-shift*.38+500)%520)-20;rect(x,92,29,53,i%2?'#482b4c':'#3e2a49');rect(x+4,98,21,39,'#221f37');rect(x+7,105,4,4,'#ee79b4');}
  rect(303,83,98,37,'#d94c81');rect(308,88,88,27,'#f77ea0');ctx.fillStyle='#643347';ctx.font='bold 11px monospace';ctx.fillText('LIVE',330,101);ctx.fillText('MUSIC',325,112);
  rect(25,160,20,45,'#1c1c31');rect(29,165,12,30,'#50415e');rect(414,148,28,57,'#202032');rect(419,153,18,40,'#4e4259');
  // stage and band silhouettes
  rect(0,179,480,30,'#49324f');rect(70,170,340,4,'#d5a5a8');rect(76,174,3,15,'#af818f');rect(404,174,3,15,'#af818f');
  // drum kit
  circle(245,165,14,'#dc7898');circle(245,165,10,'#70476e');rect(238,153,14,2,'#d2a4b1');circle(222,157,7,'#e393ad');circle(268,157,7,'#e393ad');line(222,164,217,178,'#d3a9ae',2);line(268,164,273,178,'#d3a9ae',2);
  // spotlights
  ctx.globalAlpha=.13;ctx.fillStyle='#f6a8c6';ctx.beginPath();ctx.moveTo(56,74);ctx.lineTo(120,74);ctx.lineTo(177,196);ctx.lineTo(0,196);ctx.fill();ctx.beginPath();ctx.moveTo(370,73);ctx.lineTo(420,73);ctx.lineTo(480,195);ctx.lineTo(318,195);ctx.fill();ctx.globalAlpha=1;
  for(let i=0;i<12;i++){circle(i*43+((t/60)%40),205+(i%3)*7,3+(i%2)*2,'#201e31');}
}
function drawChicago(t,shift){
  // distant campus and autumn trees
  for(let i=0;i<9;i++)tree(((i*67-shift*.42+550)%560)-35,131+(i%2)*7,.9+(i%3)*.1,i%2?'#718e69':'#a48c63');
  rect(0,179,480,91,'#b99579');rect(0,183,480,8,'#dec1a0');
  // main gothic hall
  rect(156,91,168,79,'#d4b28d');rect(147,105,15,67,'#b58d71');rect(317,104,16,68,'#b58d71');
  for(let i=0;i<5;i++){let x=168+i*31;rect(x,80,17,91,'#d8b696');rect(x+3,68+(i%2)*-3,11,18,'#c29b7e');rect(x+7,54+(i%2)*-3,3,15,'#8e6e66');rect(x+5,88,7,17,'#5e596a');rect(x+4,116,9,20,'#686073');}
  rect(179,139,120,31,'#c19c7d');rect(225,126,31,44,'#695a66');
  // fountain and steps
  for(let i=0;i<5;i++)rect(85-i*12,181+i*9,310+i*24,5,i%2?'#dbbea0':'#9e7d6a');
  circle(242,218,40,'#92846f');circle(242,215,35,'#c4ad8e');circle(242,214,29,'#80a9bc');rect(239,185,6,24,'#92c4d2');circle(242,183,5,'#c0e0e1');
  for(let i=0;i<7;i++)circle(228+i*5,211+(i%3)*5,1,'#e2f1e8');
}
function drawBeijing(t,shift){
  // sunset and city
  for(let i=0;i<10;i++){let x=((i*57-shift*.35+550)%560)-30;let h=22+(i*17%44);rect(x,140-h,22,h,'#b17f83');rect(x+6,150-h,3,4,'#f9d09e');}
  rect(0,179,480,91,'#8f6958');rect(0,186,480,8,'#c49b77');
  // temple courtyard and lanterns
  rect(46,114,97,65,'#bd8b61');rect(54,128,81,48,'#eed0a2');rect(68,136,18,40,'#765249');rect(105,136,18,40,'#765249');
  // pagoda tiers
  for(let i=0;i<4;i++){const y=152-i*24,w=158-i*27,x=240-w/2;rect(x+12,y,w-24,20,'#d8ac78');rect(x+19,y+5,w-38,16,'#784a4c');rect(x+5,y-4,w-10,6,'#543b48');rect(x,y-8,w,5,'#e3b274');rect(240-2,y-15,4,8,'#674450');}
  rect(237,46,6,18,'#65505b');circle(240,44,4,'#f3c878');
  // red lanterns
  for(const x of [165,190,405]){line(x,105,x,125,'#583b43',1);circle(x,135,8,'#f28a58');rect(x-6,132,12,8,'#e55f4f');line(x,142,x,150,'#efc477',1);}
  for(let i=0;i<5;i++)rect(40+i*18,195+i*5,400-i*36,4,i%2?'#c29778':'#75584c');
}
function drawCrossroads(t,shift){
  // island in the sky: the three places in miniature
  for(let i=0;i<10;i++)tree(((i*58-shift*.35+550)%550)-30,128+(i%2)*4,.78+(i%3)*.13,i%2?'#8a9c62':'#6d8e6b');
  rect(0,158,480,112,'#59624f');rect(0,166,480,12,'#858362');
  // tiny club
  rect(75,117,65,41,'#6d4b55');rect(70,113,75,7,'#a87768');rect(93,126,28,23,'#302b42');rect(101,132,12,8,'#dc7ca4');
  // university towers
  rect(205,105,73,53,'#bf9f82');for(const x of [210,255]){rect(x,87,12,37,'#c9a688');rect(x+4,76,4,13,'#665363');rect(x+3,98,5,12,'#655767');}rect(231,92,15,65,'#cfad8e');rect(236,82,5,15,'#695765');
  // temple hint
  for(let i=0;i<3;i++){let y=116+i*13,w=69-i*14;rect(352+(69-w)/2,y,w,8,'#b8604f');rect(356+(69-w)/2,y-3,w-8,4,'#e5aa6f');}rect(379,100,6,18,'#dcac76');
  // connecting paths
  rect(0,207,480,63,'#7a7657');rect(38,210,405,5,'#b09a72');rect(99,216,265,54,'#b19a79');for(let i=0;i<8;i++)rect(110+i*34,220,2,43,'#927d69');
}
function drawGround(t){
  if(scene==='band'){rect(0,204,480,66,'#352640');for(let i=0;i<20;i++)rect(i*27,211+(i%3)*13,18,3,i%2?'#59415f':'#48344f');}
  else if(scene==='chicago'){rect(0,239,480,31,'#b58b70');for(let i=0;i<8;i++)rect(i*67,239,1,31,'#d1aa8a');}
  else if(scene==='beijing'){rect(0,236,480,34,'#805e50');for(let i=0;i<9;i++)rect(i*59,236,2,34,'#b08365');}
  else {rect(0,240,480,30,'#59634e');for(let i=0;i<15;i++){rect(i*37,240+(i%3)*7,18,2,'#85865c');}}
  rect(0,237,480,3,scene==='band'?'#886b7c':scene==='chicago'?'#d8b595':scene==='beijing'?'#c39a7a':'#aaa077');
}
function drawCharacter(x,y,t,isJoy=false){
  const bob=player.moving?Math.floor(Math.sin(t/75)*2):0;
  ctx.save();ctx.translate(Math.round(x),Math.round(y+bob));if(player.facing<0&&!isJoy){ctx.scale(-1,1);}
  // shadow
  ctx.fillStyle='#19162677';ctx.fillRect(-10,1,20,3);
  // legs and shoes
  rect(-6,-18,5,8,'#353444');rect(2,-18,5,8,'#353444');if(player.moving&&Math.floor(t/110)%2){rect(-7,-12,7,3,'#201f31');rect(2,-11,6,2,'#201f31');}else{rect(-7,-12,7,3,'#201f31');rect(1,-12,7,3,'#201f31');}
  // outfit
  rect(-8,-32,16,15,isJoy?'#51465c':'#444454');rect(-10,-30,3,12,isJoy?'#51465c':'#444454');rect(7,-30,3,12,isJoy?'#51465c':'#444454');rect(-3,-29,7,8,isJoy?'#b88582':'#86736a');
  // hair back, head and fringe
  rect(-9,-47,18,17,isJoy?'#171621':'#5a3b38');rect(-11,-43,4,17,isJoy?'#171621':'#684643');rect(7,-41,5,16,isJoy?'#171621':'#684643');rect(-8,-46,16,14,'#e3b398');
  if(isJoy){rect(-10,-49,20,11,'#171621');rect(-11,-44,5,16,'#171621');rect(7,-45,5,19,'#171621');rect(-5,-36,2,2,'#352738');rect(3,-36,2,2,'#352738');}
  else {rect(-10,-49,20,10,'#5a3b38');rect(-10,-43,5,7,'#684643');rect(-7,-45,6,4,'#70504a');rect(1,-46,7,5,'#4b3435');rect(7,-41,4,13,'#70443c');rect(-5,-36,2,2,'#382a35');rect(3,-36,2,2,'#382a35');rect(0,-32,3,1,'#bd7373');}
  // tiny hair glint
  rect(-5,-45,5,2,isJoy?'#473c4e':'#a77b68');
  ctx.restore();
}
function drawScene(t){
  const shift=player.x-240;
  drawSky(t,shift);
  if(scene==='band')drawBand(t,shift);else if(scene==='chicago')drawChicago(t,shift);else if(scene==='beijing')drawBeijing(t,shift);else drawCrossroads(t,shift);
  drawGround(t);
  if(scene==='crossroads'){
    // destination markers with tiny labels
    const markers=[{x:105,s:'BAND',c:'#f0a2c2'},{x:240,s:'UCHI',c:'#d4c0ff'},{x:374,s:'BEIJING',c:'#ffd18a'}];
    markers.forEach((m,i)=>{rect(m.x-25,144,50,12,'#242337cc');ctx.fillStyle=m.c;ctx.font='7px monospace';ctx.textAlign='center';ctx.fillText(m.s,m.x,153);ctx.textAlign='left';if(i===0)rect(m.x-2,137,4,5,'#f2cd84');});
  } else if(scene==='band'){
    rect(355,177,71,29,'#252137');rect(361,181,59,2,'#b78a9c');rect(366,183,3,22,'#ac8a9c');rect(409,183,3,22,'#ac8a9c');
  }
  if(scene==='chicago'){circle(397,194,5,'#453a40');rect(394,198,7,21,'#373749');rect(390,205,4,10,'#373749');rect(401,205,4,10,'#373749');}
  if(scene==='beijing'){rect(430,180,4,33,'#62484a');circle(432,184,8,'#ed7758');}
  player.y=scene==='crossroads'?232:232;
  drawCharacter(player.x,player.y,t);
}
function render(time){
  const elapsed=time-lastFrame;lastFrame=time;
  if(player.moving){player.x+=player.facing*(elapsed/16)*1.5;if(player.x<18){player.x=18;}if(player.x>462){player.x=462;}}
  ctx.clearRect(0,0,480,270);drawScene(time);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2100);}
function updateProgress(){const count=visited.size;progressLabel.textContent=`${count} / 3 PLACES FOUND`;progressFill.style.width=`${count/3*100}%`;document.querySelectorAll('.destination[data-scene]').forEach(button=>button.classList.toggle('visited',visited.has(button.dataset.scene)));wishLink.disabled=count<3;wishLink.querySelector('.lock-label').textContent=count<3?`${3-count} ${3-count===1?'place':'places'} to unlock`:'all paths found · make a wish';}
function goTo(next){
  if(!scenes[next])return;
  scene=next;player.x=next==='crossroads'?240:34;player.moving=false;
  document.querySelectorAll('.destination').forEach(button=>button.classList.toggle('active',button.dataset.scene===next));
  sceneLabel.textContent=scenes[next].label;caption.textContent=scenes[next].caption;
  if(next!=='crossroads'){
    const wasVisited=visited.has(next);visited.add(next);updateProgress();
    showToast(wasVisited?`BACK AGAIN · ${scenes[next].label}`:`NEW MEMORY FOUND · ${scenes[next].label}`);
  }
}
document.querySelectorAll('.destination').forEach(button=>button.addEventListener('click',()=>goTo(button.dataset.scene)));
function setMove(direction,active){if(active){player.facing=direction;player.moving=true;}else player.moving=false;}
window.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','a','A','d','D'].includes(event.key)){event.preventDefault();setMove(event.key==='ArrowLeft'||event.key.toLowerCase()==='a'?-1:1,true);}});
window.addEventListener('keyup',event=>{if(['ArrowLeft','ArrowRight','a','A','d','D'].includes(event.key))player.moving=false;});
window.addEventListener('blur',()=>player.moving=false);
document.querySelectorAll('[data-move]').forEach(button=>{const direction=Number(button.dataset.move);button.addEventListener('pointerdown',event=>{event.preventDefault();setMove(direction,true);});['pointerup','pointercancel','pointerleave'].forEach(type=>button.addEventListener(type,()=>player.moving=false));});
canvas.addEventListener('pointerdown',event=>{const bounds=canvas.getBoundingClientRect();const targetX=(event.clientX-bounds.left)/bounds.width*480;player.facing=targetX<player.x?-1:1;player.x=Math.max(18,Math.min(462,targetX));player.moving=false;});
wishLink.addEventListener('click',()=>{if(visited.size===3){ending.classList.add('active');ending.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}});
document.querySelector('#replay').addEventListener('click',()=>{ending.classList.remove('active');ending.setAttribute('aria-hidden','true');document.body.style.overflow='';goTo('crossroads');});
document.querySelector('#sound-toggle').addEventListener('click',event=>{soundOn=!soundOn;event.currentTarget.setAttribute('aria-pressed',String(soundOn));event.currentTarget.querySelector('.sound-label').textContent=soundOn?'SOUND ON':'SOUND OFF';showToast(soundOn?'SOUND IS READY FOR YOUR OWN PLAYLIST':'QUIET MODE · JUST THE PIXELS');});
updateProgress();
