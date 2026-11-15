// HUD, build menu and tech panel. Plain DOM; art comes from render/icons.js.
import { STRUCTURES } from './data/structures.js';
import { RESOURCES } from './data/terrain.js';
import { TECH } from './data/tech.js';
import { $ } from './dom.js';
import { L, cam } from './camera.js';
import { st, view, has, costOf, afford, canPay, refundOf, build, sell, upgrade, isTower, techState, buyTech, newGame } from './state.js';
import { tdmg, rangeHex, slowDur } from './combat.js';
import { startWave, waveComposition, newTypes } from './waves.js';
import { wouldSeal } from './path.js';
import { ENEMIES } from './data/enemies.js';
import { BOSS_EVERY } from './data/waves.js';
import { icoEl, icoHTML } from './render/icons.js';
import { PLATE } from './render/scene.js';

export function closeMenu(){$('menu').style.display='none';view.sel=null;}
export function openTech(){if(st.phase!=='build'||st.over)return false;closeMenu();renderTech();$('tech').style.display='block';return true;}
export function closeTech(){$('tech').style.display='none';}
// Wire the HUD buttons.
export function bindUI(){
 $('tb').onclick=()=>{if($('tech').style.display==='block')closeTech();else openTech();};
 $('go').onclick=startWave;
 $('sp').onclick=()=>{st.speed=st.speed===1?2:1;};
 $('re').onclick=newGame;
 // Restart asks for a second tap (popups can be blocked where the game is embedded)
 let arm=0;const rb=$('rst');
 rb.onclick=()=>{if(arm||st.over){clearTimeout(arm);arm=0;rb.textContent='Restart';rb.classList.remove('arm');newGame();return;}
  rb.textContent='Tap again to restart';rb.classList.add('arm');arm=setTimeout(()=>{arm=0;rb.textContent='Restart';rb.classList.remove('arm');},3000);};
 $('ctr').onclick=()=>{cam.x=0;cam.y=0;};
 $('legend').innerHTML=[['tower','Towers'],['wall','Walls'],['harv','Harvesters'],['scan','Scan towers']].map(([k,n])=>'<span><i style="border-color:'+PLATE[k]+'"></i>'+n+'</span>').join('');
 $('vb').onclick=()=>{view.showBuilt=!view.showBuilt;$('vb').classList.toggle('on',view.showBuilt);$('legend').classList.toggle('on',view.showBuilt);};
}

export function costEl(o,free,nochk){
 const d=document.createElement('span');d.className='cost';
 if(free){d.innerHTML='<span class="fr">FREE</span>';return d;}
 let any=false;
 for(const k of RESOURCES)if(o[k]){any=true;const s=document.createElement('span');if(!nochk&&st[k]<o[k])s.className='no';s.appendChild(icoEl(k,15));s.appendChild(document.createTextNode(o[k]));d.appendChild(s);}
 if(!any)d.textContent='free';
 return d;
}
export function menuBtn(m,icon,name,sub,cost,fn,dis,title){
 const b=document.createElement('button');b.className='mi';b.disabled=!!dis;if(title)b.title=title;
 const ib=document.createElement('span');ib.className='ib';ib.appendChild(icoEl(icon,40));b.appendChild(ib);
 const tx=document.createElement('span');tx.className='tx';const nm=document.createElement('b');nm.textContent=name;tx.appendChild(nm);
 if(sub){const sm=document.createElement('small');sm.textContent=sub[0];if(sub[1])sm.className=sub[1]===2?'gv':'dm';tx.appendChild(sm);}
 b.appendChild(tx);if(cost)b.appendChild(cost);
 b.onclick=()=>{fn();closeMenu();};m.appendChild(b);return b;
}
export function openMenu(c,px,py){
 const m=$('menu');m.innerHTML='';
 const t=document.createElement('div');t.className='t';m.appendChild(t);
 if(!c.b){
  t.textContent='Hex: '+c.terrain;
  const seals=wouldSeal(c);
  if(seals){const d=document.createElement('div');d.className='t warn';d.textContent='Building here would seal the castle off. Enemies always need one open route.';m.appendChild(d);}
  for(const k of Object.keys(STRUCTURES)){
   const T=STRUCTURES[k];
   const free=k==='scan'&&st.freeScan>0;
   const allowed=T.allowedTerrain.includes(c.terrain);
   let dis=!free&&!afford(k);if(!allowed||seals)dis=true;
   let sub=null;
   if(seals)sub=['would seal the castle',1];
   else if(!allowed)sub=[T.blockedHint||'not on this hex',1];
   else if(T.terrainNote&&T.terrainNote[c.terrain])sub=[T.terrainNote[c.terrain]];
   else if(T.terrainBonus&&T.terrainBonus.terrain===c.terrain)sub=['+'+Math.round((T.terrainBonus.damage-1)*100)+'% on this hex'+(T.counters?'; good vs '+T.counters:'')];
   else if(T.counters)sub=['good vs '+T.counters,2];
   const ic='b:'+k+':'+(allowed?c.terrain:T.allowedTerrain[0]);
   menuBtn(m,ic,T.name,sub,costEl(costOf(k),free),()=>build(c,k),dis,T.description);
  }
 }else{
  const b=c.b,T=STRUCTURES[b.type];
  t.textContent=T.name+(b.upg?' (upgraded)':'')+'  HP '+Math.ceil(b.hp)+'/'+b.max+'  on '+c.terrain;
  if(isTower(b)){const d=document.createElement('div');d.className='t';d.textContent='Damage '+tdmg(c).toFixed(1)+'  Range '+rangeHex(b)+(T.slow?'  Slow '+Math.round((1-T.slow.factor)*100)+'% '+slowDur(c).toFixed(1)+'s':'');m.appendChild(d);}
  if(isTower(b)&&!b.upg)menuBtn(m,'star','Upgrade',[T.upgrade.text],costEl(T.upgrade.cost),()=>upgrade(c),!canPay(T.upgrade.cost));
  menuBtn(m,'gold','Sell',null,costEl(refundOf(b.spent),false,true),()=>sell(c));
 }
 const cl=document.createElement('button');cl.textContent='Close';cl.onclick=closeMenu;m.appendChild(cl);
 m.style.display='block';view.sel=c;
 const mw=m.offsetWidth,mh=m.offsetHeight;
 m.style.left=Math.max(4,Math.min(L.w-mw-4,px+12))+'px';
 m.style.top=Math.max(4,Math.min(L.h-mh-4,py-mh/2))+'px';
}
const CHK='<svg viewBox="0 0 12 12"><path d="M2 6.5l2.5 2.5L10 3" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const LCK='<svg viewBox="0 0 12 12"><rect x="2.5" y="5.5" width="7" height="5" rx="1" fill="#fff"/><path d="M4 5.5V4a2 2 0 014 0v1.5" stroke="#fff" stroke-width="1.4" fill="none"/></svg>';
export function renderTech(){
 const el=$('tech');
 let h='<div class="in"><div class="hd"><h2>Research</h2><span class="pts">'+icoHTML('star',20)+'<span>'+st.rp+(st.rp===1?' pt':' pts')+'</span></span><button id="tx">Close</button></div><div class="tree"><div class="root">'+icoHTML('castle',34)+'</div><div class="cols">';
 for(const br of TECH){
  h+='<div class="col '+br.id+'"><div class="bh">'+icoHTML(br.icon,20)+'<span>'+br.name+'</span></div>';
  br.nodes.forEach((n,i)=>{
   const s=techState(n.id);
   const prevOwned=!n.requires||has(n.requires);
   h+='<div class="ln'+(prevOwned?' on':'')+'"></div>';
   const cost=s==='own'?'Owned':s==='lock'?'Locked':n.cost+' pt'+(n.cost>1?'s':'');
   h+='<button class="nd '+s+'" data-id="'+n.id+'"'+(s==='av'?'':' disabled')+'><span class="bd">'+(s==='own'?CHK:LCK)+'</span><span class="ni">'+icoHTML(n.icon,42)+'</span><span class="nn">'+n.name+'</span><span class="nx">'+n.txt+'</span><span class="cs">'+(s==='own'||s==='lock'?'':icoHTML('star',13))+cost+'</span></button>';
  });
  h+='</div>';
 }
 h+='</div></div><div class="nt">Earn 1 point per wave survived. Each node needs the previous one in its branch. Research is only possible between waves.</div></div>';
 el.innerHTML=h;
 $('tx').onclick=closeTech;
 el.querySelectorAll('.nd').forEach(b=>b.onclick=()=>buyTech(b.dataset.id));
}

// ---- "new enemy" cards: shown in the build phase before a wave that introduces a type
export function showIntro(){
 if(st.phase!=='build'||st.over)return;
 const fresh=newTypes(st.wave).filter(t=>!st.seen[t]);
 if(!fresh.length)return;
 fresh.forEach(t=>st.seen[t]=1);
 const el=$('intro');
 let h='<div class="card"><div class="ih">'+(fresh.length>1?'New enemies':'New enemy')+' next wave</div>';
 for(const t of fresh){const T=ENEMIES[t];
  h+='<div class="en"><span class="ei">'+icoHTML('e:'+t,64)+'</span><div><b>'+T.name+'</b><p>'+T.intro+'</p><p class="ct"><span>Counter:</span> '+T.counter+'</p></div></div>';}
 h+='<button id="ix" class="go">Got it</button></div>';
 el.innerHTML=h;el.style.display='flex';
 $('ix').onclick=()=>{el.style.display='none';};
}
// small HTML for "next wave" preview: icon + count per type
function preview(w){
 const comp=waveComposition(w);let h='';
 for(const t of Object.keys(ENEMIES))if(comp[t]){const T=ENEMIES[t];const n=comp[t]*(T.pack||1);
  h+='<span class="pv'+(T.firstWave===w?' nw':'')+'" title="'+T.name+'">'+icoHTML('e:'+t,22)+n+'</span>';}
 return h;
}

// ---- HUD
export function hud(){
 $('rg').textContent=st.gold;$('rw').textContent=st.wood;$('rs').textContent=st.stone;$('rc').textContent=st.crystal;
 $('hp').textContent=st.hp+'/'+st.maxhp;$('wv').textContent=st.wave;
 const g=$('go');g.textContent=st.phase==='build'?'Start Wave '+st.wave:(st.over?'Game over':'Wave '+st.wave+' ('+(st.queue.length+st.enemies.length)+' left)');
 g.disabled=st.phase!=='build';const tb=$('tb');tb.textContent='Tech ('+st.rp+')';tb.disabled=st.phase!=='build';tb.classList.toggle('pulse',st.rp>0&&st.phase==='build');$('sp').textContent='Speed '+st.speed+'x';
 let h;
 if(st.over)h='The castle has fallen.';
 else if(st.phase==='wave')h='Wave in progress: building and selling are only possible in the build phase. Tap a tower to see its range.';
 else{h='Build phase: tap a hex to build. Enemies walk around your buildings, so use cheap walls to make their route long. The dotted lines show their current routes.';
  if(st.freeScan>0)h+=' You have 1 free scan tower.';}
 const hv=view.hover||view.sel;if(hv&&hv.revealed&&!st.over)h+='  ['+hv.terrain+']';
 let html='<span class="ht"></span>';
 if(!st.over&&st.phase==='build')html='<span class="nx">Next wave'+(st.wave%BOSS_EVERY===0?' <b class="bs">BOSS</b>':'')+': '+preview(st.wave)+'</span>'+html;
 const kk=h+'|'+st.wave+st.phase;
 if(hud.k!==kk){hud.k=kk;$('hint').innerHTML=html;$('hint').querySelector('.ht').textContent=h;}
}
