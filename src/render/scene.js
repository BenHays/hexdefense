// Draws one frame: tiles and fog, structures, range rings, enemies, then the effect layers.
import { W2, ANG } from '../hex.js';
import { ctx } from '../dom.js';
import { st, cellList, view, isTower, world } from '../state.js';
import { L, scr } from '../camera.js';
import { trange } from '../combat.js';
import { ENEMIES } from '../data/enemies.js';
import { TAU, NOW, lwu, setG, setNOW, setLW } from './prims.js';
import { dCastle, drawBuilding } from './structures.js';
import { ebar, dEnemy } from './enemies.js';
import { tileFor } from './tiles.js';
import { drawProjectiles, drawFx, drawCoins, drawFloats } from './effects.js';

function hexPath(x,y,s){ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i-30);const px=x+s*Math.cos(a),py=y+s*Math.sin(a);i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();}
function bar(x,y,w,f,col){
 const h=Math.max(3,.1*L.S);
 ctx.fillStyle='rgba(10,10,16,.88)';ctx.fillRect(x-w/2-1,y-1,w+2,h+2);
 ctx.fillStyle='#3a1a1a';ctx.fillRect(x-w/2,y,w,h);
 f=Math.max(0,f);ctx.fillStyle=f>.6?'#5fd35f':f>.3?'#e8c840':'#e85a4a';ctx.fillRect(x-w/2,y,w*f,h);
 ctx.fillStyle='rgba(255,255,255,.3)';ctx.fillRect(x-w/2,y,w*f,Math.max(1,h*.3));
}
const edges=[],blist=[];
export function draw(){
 const S=L.S;ctx.setTransform(L.dpr,0,0,L.dpr,0,0);setG(ctx);setNOW(performance.now()/1000);setLW(lwu(S));
 ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
 ctx.fillStyle='#0b0e14';ctx.fillRect(0,0,L.w,L.h);
 if(st.shake>0){const m=Math.min(6,st.shake*20);ctx.translate((Math.random()-.5)*2*m,(Math.random()-.5)*2*m);}
 const mg=S*1.2;
 const vis=(s)=>s.x>-mg&&s.x<L.w+mg&&s.y>-mg&&s.y<L.h+mg;
 edges.length=0;blist.length=0;
 const hot=[];
 for(const c of cellList){
  const p=W2(c.q,c.r),s=scr(p.x,p.y);
  if(!vis(s))continue;
  let t;
  if(!c.revealed)t=tileFor('fog',c.v,0,S);
  else{t=tileFor(c.terrain,c.v,c.terrain==='castle'?0:c.b?2:1,S);
   for(let i=0;i<6;i++){const n=c.nb[i];if(n&&!n.revealed)edges.push(s.x,s.y,i);}
   if(c.newT>0)hot.push(s.x,s.y,c.newT);
   if(c.b||c.terrain==='castle')blist.push(c);
   else if(c.terrain==='crystal'){const gl=.1+.07*Math.sin(NOW*2.5+c.q+c.r*2);ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(150,110,255,'+gl+')';ctx.beginPath();ctx.arc(s.x,s.y,S*.55,0,TAU);ctx.fill();
    const tw=Math.max(0,Math.sin(NOW*3+c.q*2.1+c.r));ctx.fillStyle='rgba(255,255,255,'+tw*.9+')';const sx=s.x+S*.22,sy=s.y-S*.3,r=S*.09*tw;ctx.fillRect(sx-r,sy-.8,r*2,1.6);ctx.fillRect(sx-.8,sy-r,1.6,r*2);ctx.globalCompositeOperation='source-over';}
  }
  const dp=L.dpr;ctx.drawImage(t.cv,Math.round((s.x-t.half)*dp)/dp,Math.round((s.y-t.half)*dp)/dp,t.w,t.w);
 }
 // soft fog edge
 if(edges.length){
  for(const [lw,al] of [[.34,.12],[.16,.22]]){
   ctx.beginPath();
   for(let j=0;j<edges.length;j+=3){const a=ANG[edges[j+2]],a0=a-Math.PI/6,a1=a+Math.PI/6,r=S*.94;
    ctx.moveTo(edges[j]+Math.cos(a0)*r,edges[j+1]+Math.sin(a0)*r);ctx.lineTo(edges[j]+Math.cos(a1)*r,edges[j+1]+Math.sin(a1)*r);}
   ctx.strokeStyle='rgba(4,6,12,'+al*2+')';ctx.lineWidth=S*lw;ctx.lineCap='butt';ctx.stroke();}
 }
 for(let j=0;j<hot.length;j+=3){hexPath(hot[j],hot[j+1],S*.94);ctx.strokeStyle='rgba(255,255,255,'+Math.min(1,hot[j+2])+')';ctx.lineWidth=3;ctx.stroke();}
 // enemy routes (the maze) during the build phase: dotted lines from the spawn ring to the castle
 if(st.phase==='build'&&world.routes){
  ctx.save();ctx.setLineDash([S*.12,S*.22]);ctx.lineDashOffset=-NOW*S*.6;ctx.lineCap='round';ctx.lineJoin='round';
  for(const [w,col] of [[S*.16,'rgba(0,0,0,.35)'],[S*.07,'rgba(255,120,90,.75)']]){ctx.lineWidth=w;ctx.strokeStyle=col;
   for(const rt of world.routes){ctx.beginPath();rt.forEach((c,i)=>{const p=W2(c.q,c.r),s=scr(p.x,p.y);i?ctx.lineTo(s.x,s.y):ctx.moveTo(s.x,s.y);});ctx.stroke();}}
  ctx.restore();
 }
 // buildings (back to front)
 blist.sort((a,b)=>a.r-b.r);
 for(const c of blist){const b=c.b,p=W2(c.q,c.r),s=scr(p.x,p.y);
  ctx.save();ctx.translate(s.x,s.y);ctx.scale(S,S);
  if(!b)dCastle(S);else drawBuilding(b.type,c.terrain,b,S,b.wm||0);
  ctx.restore();
  if(b&&b.hp<b.max)bar(s.x,s.y+.62*S,.9*S,b.hp/b.max);
 }
 // range
 const rc=view.sel||view.hover;
 if(rc&&isTower(rc.b)){const p=W2(rc.q,rc.r),s=scr(p.x,p.y);
  ctx.beginPath();ctx.arc(s.x,s.y,trange(rc.b)*S,0,7);ctx.fillStyle='rgba(255,255,255,.08)';ctx.fill();ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=2;ctx.stroke();}
 if(rc){const p=W2(rc.q,rc.r),s=scr(p.x,p.y);hexPath(s.x,s.y,S*.95);ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();}
 // enemies
 const es=st.enemies.slice().sort((a,b)=>a.y-b.y);
 for(const e of es){const T=ENEMIES[e.t],s=scr(e.x,e.y);
  if(!vis(s))continue;
  dEnemy(e,s,S);
  if(e.hp<e.max)ebar(s.x,s.y-T.barOffset*S-.14*S,.6*S,e.hp/e.max,'#e55');}
 drawProjectiles(S);
 // castle hit flash
 if(st.flash>0){const s=scr(0,0);hexPath(s.x,s.y,S*.95);ctx.fillStyle='rgba(255,50,50,'+Math.min(.6,st.flash*2)+')';ctx.fill();}
 drawFx(S);
 drawCoins(S);
 drawFloats(S);
 if(st.banner){const b=st.banner,a=Math.min(1,b.t*3,(2.5-b.t)*2);ctx.globalAlpha=Math.max(0,a);ctx.textAlign='center';ctx.font='900 '+Math.max(22,Math.min(44,L.w*.06))+'px system-ui';
  ctx.lineWidth=6;ctx.strokeStyle='#000';ctx.strokeText(b.txt,L.w/2,L.h*.2);ctx.fillStyle='#ff6a4a';ctx.fillText(b.txt,L.w/2,L.h*.2);ctx.globalAlpha=1;}
}
