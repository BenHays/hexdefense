// Projectiles, particles, flying coins and floating text. Each function draws one layer
// on top of the scene (all take the current hex size in pixels).
import { TAU } from './prims.js';
import { st } from '../state.js';
import { cv, ctx, $ } from '../dom.js';
import { scr } from '../camera.js';

export function drawProjectiles(S){
 for(const p of st.projs){const k=Math.min(1,p.t/p.dur),x=p.x0+(p.x1-p.x0)*k,y=p.y0+(p.y1-p.y0)*k;
  const s=scr(x,y);
  if(p.kind==='bolt'){
   ctx.globalCompositeOperation='lighter';
   for(let j=4;j>=1;j--){const kk=Math.max(0,k-.06*j),q=scr(p.x0+(p.x1-p.x0)*kk,p.y0+(p.y1-p.y0)*kk);ctx.fillStyle='rgba(170,100,255,'+(.4-j*.07)+')';ctx.beginPath();ctx.arc(q.x,q.y,S*(.16-j*.02),0,TAU);ctx.fill();}
   ctx.fillStyle='rgba(180,110,255,.35)';ctx.beginPath();ctx.arc(s.x,s.y,S*.3,0,TAU);ctx.fill();
   ctx.globalCompositeOperation='source-over';
   ctx.fillStyle='#b266ff';ctx.beginPath();ctx.arc(s.x,s.y,S*.15,0,TAU);ctx.fill();ctx.fillStyle='#f2e0ff';ctx.beginPath();ctx.arc(s.x,s.y,S*.07,0,TAU);ctx.fill();}
  else if(p.kind==='arrow'){
   const ang=Math.atan2(p.y1-p.y0,p.x1-p.x0),L2=S*.5;
   ctx.save();ctx.translate(s.x,s.y);ctx.rotate(ang);
   ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-L2*1.6,0);ctx.lineTo(-L2*.5,0);ctx.stroke();
   ctx.strokeStyle='#e8dcc0';ctx.lineWidth=Math.max(1.5,S*.06);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-L2*.5,0);ctx.lineTo(L2*.4,0);ctx.stroke();
   ctx.fillStyle='#d4dae2';ctx.strokeStyle='#2a1d16';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(L2*.65,0);ctx.lineTo(L2*.35,-S*.08);ctx.lineTo(L2*.35,S*.08);ctx.closePath();ctx.fill();ctx.stroke();
   ctx.fillStyle='#d44';ctx.beginPath();ctx.moveTo(-L2*.5,0);ctx.lineTo(-L2*.72,-S*.07);ctx.lineTo(-L2*.6,0);ctx.lineTo(-L2*.72,S*.07);ctx.closePath();ctx.fill();
   ctx.restore();}
  else{
   const h=Math.sin(k*Math.PI),rr=S*(.12+.05*h);
   ctx.fillStyle='rgba(0,0,0,'+(.3-.15*h)+')';ctx.beginPath();ctx.ellipse(s.x,s.y+S*.05,rr*(1.1-.3*h),rr*.5,0,0,TAU);ctx.fill();
   const by=s.y-h*.9*S;
   ctx.fillStyle='#8a8f98';ctx.strokeStyle='#2a2d33';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(s.x,by,rr,0,TAU);ctx.fill();ctx.stroke();
   ctx.fillStyle='rgba(255,255,255,.45)';ctx.beginPath();ctx.arc(s.x-rr*.3,by-rr*.3,rr*.35,0,TAU);ctx.fill();
   ctx.strokeStyle='rgba(30,30,36,.6)';ctx.beginPath();ctx.moveTo(s.x-rr*.2+Math.cos(p.t*9)*rr*.5,by);ctx.lineTo(s.x+rr*.4,by+rr*.5);ctx.stroke();}}
}
export function drawFx(S){
 for(const f of st.fx){const s=scr(f.x,f.y),k=f.t/f.life;
  if(f.k==='pop'){ctx.strokeStyle=f.col;ctx.globalAlpha=1-k;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(s.x,s.y,S*(.15+.5*k),0,7);ctx.stroke();ctx.globalAlpha=1;}
  else if(f.k==='dust'){
   for(let i=0;i<8;i++){const a=i*.785+.3,d=(.2+.65*Math.sqrt(k))*(i%2?1:.7),r=S*(.1+.17*k);
    ctx.globalAlpha=(1-k)*.6;ctx.fillStyle=i%3?'#b9a88c':'#8f8068';ctx.beginPath();ctx.arc(s.x+Math.cos(a)*d*S,s.y+Math.sin(a)*d*S*.6-k*.25*S,r,0,TAU);ctx.fill();}
   ctx.globalAlpha=1;}
  else{const q=scr(f.x+f.vx*f.t,f.y+f.vy*f.t);ctx.globalAlpha=1-k;ctx.fillStyle=f.col;ctx.fillRect(q.x-2,q.y-2,4,4);ctx.globalAlpha=1;}}
}
export function drawCoins(S){
 if(st.coins.length){const r=cv.getBoundingClientRect(),g=$('rg').getBoundingClientRect(),tx=g.left-r.left+g.width/2,ty=g.top-r.top+g.height/2;
  for(const f of st.coins){const s=scr(f.x,f.y),k=Math.min(1,f.t/f.life),e=k*k;const x=s.x+(tx-s.x)*e,y=s.y+(ty-s.y)*e-Math.sin(k*Math.PI)*20;
   ctx.fillStyle='#f1c84b';ctx.strokeStyle='#8a6d10';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,4,0,7);ctx.fill();ctx.stroke();}}
}
export function drawFloats(S){
 ctx.textAlign='center';ctx.font='bold '+Math.max(11,S*.4)+'px system-ui';
 for(const f of st.floats){const s=scr(f.x,f.y);
  if(f.ring){ctx.strokeStyle='rgba(255,170,100,'+(1-f.t/.35)+')';ctx.lineWidth=3;ctx.beginPath();ctx.arc(s.x,s.y,f.rad*S*(f.t/.35+.2),0,7);ctx.stroke();continue;}
  ctx.globalAlpha=Math.max(0,1-f.t/1.4);ctx.fillStyle='#000';ctx.fillText(f.txt,s.x+1,s.y-f.t*S*.6+1);ctx.fillStyle=f.col;ctx.fillText(f.txt,s.x,s.y-f.t*S*.6);ctx.globalAlpha=1;}
}
