// Enemy drawings (code-drawn art). Each ENEMY_ART entry draws one enemy type in unit space;
// ENEMIES[id].art in src/data/enemies.js picks which one is used.
import { W2 } from '../hex.js';
import { L } from '../camera.js';
import { ENEMIES } from '../data/enemies.js';
import { G, NOW, FLASH, FROST, LW, OL, K, fillS, rect, poly, circ, ell, line, glow, setLW, setFLASH, setFROST } from './prims.js';

export const ENEMY_ART = {
 grunt(ph,atk){
  const bob=Math.abs(Math.sin(ph))*.12;
  ell(0,.95,.9,.28,'rgba(0,0,0,.3)',null);
  G.translate(0,-bob);
  circ(-.45+Math.sin(ph)*.25,.8,.28,K('#5a8a34'),OL);circ(.45-Math.sin(ph)*.25,.8,.28,K('#5a8a34'),OL);
  G.save();G.translate(-.8,.1);G.rotate(atk?-.9+Math.sin(ph*2.2)*.9:-.5+Math.sin(ph)*.15);
  line(0,0,0,-1.0,K('#7a4e26'),LW*3);circ(0,-1.05,.3,K('#6d4624'),OL);circ(-.1,-1.12,.06,'#cfc4a8',null);circ(.12,-.98,.06,'#cfc4a8',null);G.restore();
  poly([-.85,-.2,-1.5,-.75,-.75,.2],K('#7bbf4a'),OL);poly([.85,-.2,1.5,-.75,.75,.2],K('#7bbf4a'),OL);
  ell(0,.05,1,.9,K('#7bbf4a'),OL);
  ell(.05,.4,.6,.45,K('#a8da74'),null);
  G.beginPath();G.ellipse(0,.05,1,.9,0,-2.45,-.7);G.closePath();fillS(K('#c0392b'),OL);
  circ(.0,-.1,.27,K('#fff'),OL);circ(.55,-.1,.27,K('#fff'),OL);
  circ(.1,-.08,.12,K('#111'),null);circ(.65,-.08,.12,K('#111'),null);
  line(-.25,-.38,.2,-.25,'#2a1d16',LW*1.3);line(.8,-.38,.35,-.25,'#2a1d16',LW*1.3);
  poly([.1,.4,.5,.4,.45,.58,.35,.48,.25,.58,.15,.48],K('#fff'),OL);
 },
 runner(ph,atk){
  const sw=Math.sin(ph),bob=Math.abs(Math.cos(ph))*.1;
  G.globalAlpha=.55;for(const [y,l] of [[-.5,1.1],[0,1.5],[.5,1.0]]){line(-1.2-l*.6,y+.1,-.9,y+.1,K('#ffe6b0'),LW*1.4);}G.globalAlpha=1;
  ell(0,1.0,.9,.25,'rgba(0,0,0,.3)',null);
  G.translate(0,-bob);
  line(-.1,.5,-.1+sw*.7,1.0,K('#c06a10'),LW*3.6);line(-.1,.5,-.1-sw*.7,1.0,K('#c06a10'),LW*3.6);
  line(.2,-.2,.9-sw*.5,.1,K('#c06a10'),LW*3);
  G.save();G.rotate(.55);ell(0,0,.55,1.0,K('#f0a030'),OL);ell(-.15,.1,.25,.6,'rgba(255,255,255,.2)',null);G.restore();
  poly([.55,-.85,1.5,-1.0,.85,-.55],K('#f0a030'),OL);
  circ(.7,-.65,.46,K('#f4b448'),OL);
  circ(.85,-.72,.18,K('#fff'),OL);circ(.92,-.72,.08,K('#111'),null);
  line(.6,-.98,1.05,-.86,'#2a1d16',LW*1.3);
  line(.3,-.25,1.0,.35+sw*.3,K('#c06a10'),LW*3);
 },
 brute(ph,atk){
  const bob=Math.abs(Math.sin(ph))*.07;
  ell(0,1.0,1.2,.3,'rgba(0,0,0,.35)',null);
  G.translate(0,-bob);
  poly([-.8,.5,-.4,.5,-.45,1.0+Math.sin(ph)*.05,-.9,1.0],K('#4a2f66'),OL);poly([.8,.5,.4,.5,.45,1.0-Math.sin(ph)*.05,.9,1.0],K('#4a2f66'),OL);
  poly([-1.0,-.6,1.0,-.6,1.2,.2,.7,.75,-.7,.75,-1.2,.2],K('#8a4fb0'),OL);
  ell(-.2,-.1,.5,.5,'rgba(255,255,255,.14)',null);
  poly([-.55,-.4,.55,-.4,.45,.35,-.45,.35],K('#6a6f7c'),OL);line(-.4,-.1,.4,-.1,'rgba(0,0,0,.35)',LW);line(0,-.4,0,.35,'rgba(0,0,0,.35)',LW);
  for(const [x,y] of [[-.35,-.28],[.35,-.28],[-.3,.22],[.3,.22]])circ(x,y,.05,'#cfd4da',null);
  rect(-.7,.4,1.4,.2,K('#4a3a22'),OL);rect(-.1,.38,.2,.24,K('#e0b84a'),OL);
  G.save();G.translate(-1.15,-.2);G.rotate(Math.sin(ph)*.12);ell(0,.55,.38,.7,K('#7a3fa0'),OL);circ(0,1.2,.33,K('#8a4fb0'),OL);G.restore();
  G.save();G.translate(1.15,-.2);G.rotate(atk?-1.2+Math.sin(ph*2)*.9:-Math.sin(ph)*.12);ell(0,.55,.38,.7,K('#7a3fa0'),OL);circ(0,1.2,.33,K('#8a4fb0'),OL);G.restore();
  for(const sx of [-1,1]){circ(sx*1.0,-.55,.46,K('#5a606e'),OL);poly([sx*1.0-.12,-.95,sx*1.0,-1.35,sx*1.0+.12,-.95],K('#cfd4da'),OL);}
  circ(0,-.85,.5,K('#8a4fb0'),OL);
  G.beginPath();G.arc(0,-.85,.54,Math.PI*1.04,Math.PI*1.96);G.lineTo(.5,-.98);G.lineTo(-.5,-.98);G.closePath();fillS(K('#7d8594'),OL);
  G.beginPath();G.arc(0,-.85,.54,Math.PI*1.1,Math.PI*1.45);G.lineTo(-.2,-.98);G.closePath();G.fillStyle='rgba(255,255,255,.28)';G.fill();
  rect(-.07,-.98,.14,.4,K('#6a717e'),OL);rect(-.56,-1.0,1.12,.1,K('#5a606e'),OL);
  for(const x of [-.4,-.2,.2,.4])circ(x,-.95,.03,'#cfd4da',null);
  for(const sx of [-1,1])for(const dy of [-.62,-.5])circ(sx*1.0+sx*.1,dy,.035,'#cfd4da',null);
  for(const sx of [-1,1]){G.beginPath();G.moveTo(sx*.35,-1.15);G.quadraticCurveTo(sx*1.05,-1.2,sx*.95,-1.95);G.quadraticCurveTo(sx*.62,-1.45,sx*.18,-1.28);G.closePath();fillS(K('#ece3c8'),OL);}
  poly([-.3,-.62,.3,-.62,.22,-.5,-.22,-.5],K('#2a1d16'),null);
  line(-.35,-1.0,-.08,-.9,'#2a1d16',LW*1.4);line(.35,-1.0,.08,-.9,'#2a1d16',LW*1.4);
  circ(-.2,-.87,.1,'#ff5a3a',null);circ(.2,-.87,.1,'#ff5a3a',null);},
 swarm(ph,atk){
  const w=Math.sin(ph*2),sk=Math.abs(Math.sin(ph*2))*.08;
  ell(0,.95,.85,.22,'rgba(0,0,0,.3)',null);
  G.translate(0,-sk);
  for(let i=0;i<3;i++){const x=-.45+i*.45,a=Math.sin(ph*2+i*2.1)*.35;
   for(const sx of [-1,1]){const ang=a*sx;line(x,.3,x+sx*.2+Math.sin(ang)*.3,.98,K('#3a2a14'),LW*3);}}
  ell(-.15,.2,.95,.55,K('#6b5a2c'),OL);
  G.beginPath();G.ellipse(-.15,.2,.95,.55,0,Math.PI,0);G.closePath();fillS(K('#7fa13a'),OL);
  line(-.15,-.35,-.15,.2,'rgba(0,0,0,.35)',LW);
  ell(-.5,0,.28,.16,'rgba(255,255,255,.3)',null,-.4);
  circ(.78,.15,.42,K('#8fb046'),OL);
  line(.9,-.2,1.15,-.55+w*.1,K('#3a2a14'),LW*1.6);line(.7,-.2,.75,-.6-w*.1,K('#3a2a14'),LW*1.6);
  circ(.9,.08,.2,K('#fff'),OL);circ(.97,.1,.09,'#111',null);
  poly([.75,.42,.95,.42,.9,.55,.8,.55],K('#fff'),OL);
  if(atk)line(.55,.5,1.1,.55,'#2a1d16',LW*1.4);
 },
 bat(ph,atk){
  const f=Math.sin(NOW*14+ph*2),bob=Math.sin(NOW*5+ph)*.12,y0=-.6+bob;
  ell(0,1.1,.75-bob*.5,.2,'rgba(0,0,0,.2)',null);
  G.translate(0,y0);
  for(const sx of [-1,1]){G.save();G.scale(sx,1);G.translate(.2,-.1);G.rotate(-f*.6-.15);
   G.beginPath();G.moveTo(0,0);G.quadraticCurveTo(.5,-1.15,1.45,-.75);G.lineTo(1.15,-.35);G.lineTo(1.3,.1);G.lineTo(.8,.0);G.lineTo(.8,.45);G.lineTo(.35,.15);G.lineTo(0,.4);G.closePath();fillS(K('#5a3a78'),OL);
   G.beginPath();G.moveTo(0,0);G.quadraticCurveTo(.5,-1.15,1.45,-.75);G.strokeStyle=K('#3a2350');G.lineWidth=LW*1.8;G.stroke();
   line(0,0,.8,.0,'rgba(0,0,0,.35)',LW*.8);line(0,0,1.15,-.35,'rgba(0,0,0,.35)',LW*.8);G.restore();}
  ell(0,.15,.45,.55,K('#7a5aa0'),OL);ell(-.1,.2,.2,.3,'rgba(255,255,255,.2)',null);
  for(const sx of [-1,1])poly([sx*.12,-.3,sx*.4,-.85,sx*.4,-.28],K('#7a5aa0'),OL);
  circ(0,-.2,.38,K('#8a6ab0'),OL);
  for(const sx of [-1,1]){circ(sx*.15,-.25,.09,'#ff4a4a',null);}
  poly([-.12,-.02,.12,-.02,.08,.15,.04,.06,0,.15,-.04,.06,-.08,.15],K('#fff'),OL);
 },
 shaman(ph,atk){
  const sw=Math.sin(ph),bob=Math.abs(sw)*.07;
  ell(0,1.0,.8,.24,'rgba(0,0,0,.3)',null);
  G.translate(0,-bob);
  circ(-.28+sw*.15,.92,.2,K('#3b6a3a'),OL);circ(.28-sw*.15,.92,.2,K('#3b6a3a'),OL);
  poly([-.55,.88,-.35,-.35,.35,-.35,.6,.88],K('#2f8f80'),OL);
  poly([.2,-.3,.35,-.35,.6,.88,.35,.88],'rgba(0,0,0,.22)',null);
  line(-.5,.65,.52,.65,K('#e0b84a'),LW*1.3);
  const sy=atk?Math.sin(NOW*10)*.1:0;
  line(.9,1.0,.9,-1.0+sy,K('#7a4e26'),LW*3);
  circ(.9,-1.0+sy,.2,K('#5a381a'),OL);
  G.globalCompositeOperation='lighter';glow(.9,-1.15+sy,.55+.08*Math.sin(NOW*6),'110,255,140',.5);G.globalCompositeOperation='source-over';
  circ(.9,-1.15+sy,.2,K('#7dff8a'),OL);circ(.85,-1.2+sy,.07,'#fff',null);
  line(.35,.0,.75,-.25,K('#3b6a3a'),LW*3);circ(.82,-.28,.1,K('#7bbf4a'),OL);
  line(-.35,.0,-.5,.4,K('#3b6a3a'),LW*3);
  circ(0,-.4,.46,K('#1f6a60'),OL);
  ell(0,-.38,.3,.28,K('#7bbf4a'),OL);
  poly([-.5,-.55,-.1,-1.25,.4,-.5],K('#2f8f80'),OL);poly([-.1,-1.25,.4,-.5,.1,-.5],'rgba(0,0,0,.22)',null);
  for(const sx of [-1,1])poly([sx*.28,-.4,sx*.75,-.55,sx*.3,-.28],K('#7bbf4a'),OL);
  circ(-.1,-.42,.09,'#ffe45a',null);circ(.14,-.42,.09,'#ffe45a',null);circ(-.1,-.42,.035,'#111',null);circ(.14,-.42,.035,'#111',null);
  poly([-.1,-.2,.14,-.2,.04,-.1],K('#fff'),null);
 },
 boss(ph,atk){
  const sw=Math.sin(ph),bob=Math.abs(sw)*.05;
  ell(0,1.0,1.45,.32,'rgba(0,0,0,.4)',null);
  G.translate(0,-bob);
  poly([-.95,.45,-.35,.45,-.4,1.0+sw*.05,-1.0,1.0],K('#3a3f4a'),OL);poly([.95,.45,.35,.45,.4,1.0-sw*.05,1.0,1.0],K('#3a3f4a'),OL);
  rect(-1.05,.9,.7,.14,K('#2a2d33'),OL);rect(.35,.9,.7,.14,K('#2a2d33'),OL);
  // far arm + club
  G.save();G.translate(-1.35,-.35);G.rotate(Math.sin(ph)*.1);ell(0,.55,.42,.75,K('#8a2a22'),OL);circ(0,1.25,.36,K('#6a7080'),OL);G.restore();
  poly([-1.2,-.7,1.2,-.7,1.35,.3,.8,.85,-.8,.85,-1.35,.3],K('#a8321f'),OL);
  ell(-.3,-.2,.6,.55,'rgba(255,255,255,.12)',null);
  poly([-.7,-.5,.7,-.5,.6,.45,-.6,.45],K('#59606e'),OL);
  line(-.6,-.1,.6,-.1,'rgba(0,0,0,.4)',LW);line(-.55,.2,.55,.2,'rgba(0,0,0,.4)',LW);line(0,-.5,0,.45,'rgba(0,0,0,.4)',LW);
  ell(-.3,-.3,.2,.1,'rgba(255,255,255,.25)',null);
  for(const [x,y] of [[-.5,-.4],[.5,-.4],[-.45,.35],[.45,.35],[0,-.35]])circ(x,y,.055,'#cfd4da',null);
  rect(-.85,.4,1.7,.24,K('#2a2218'),OL);rect(-.22,.38,.44,.28,K('#e0b84a'),OL);circ(0,.52,.08,K('#a8321f'),OL);
  for(const sx of [-1,1]){circ(sx*1.15,-.65,.55,K('#59606e'),OL);ell(sx*1.0,-.8,.2,.12,'rgba(255,255,255,.25)',null);
   for(const d of [-.35,0,.35])poly([sx*1.15+sx*d*.6-.1,-1.1+Math.abs(d)*.3,sx*1.15+sx*d*.9,-1.65+Math.abs(d)*.5,sx*1.15+sx*d*.6+.1,-1.1+Math.abs(d)*.3],K('#cfd4da'),OL);}
  // club arm
  G.save();G.translate(1.35,-.35);
  const a=atk?-1.9+(Math.sin(NOW*7)*.5+.5)*2.3:-.35+Math.sin(ph)*.12;G.rotate(a);
  ell(0,.5,.42,.7,K('#8a2a22'),OL);
  G.translate(0,1.1);G.rotate(Math.PI+.3);G.scale(.7,.7);
  line(0,.2,0,1.9,K('#6a4524'),LW*4.2);line(0,.2,0,1.9,'rgba(255,255,255,.15)',LW*1.4);
  poly([-.3,1.7,.3,1.7,.55,2.5,.4,3.0,-.4,3.0,-.55,2.5],K('#59606e'),OL);
  poly([-.3,1.7,-.12,1.7,-.2,3.0,-.4,3.0,-.55,2.5],'rgba(255,255,255,.2)',null);
  for(const [x,y] of [[-.4,2.3],[.4,2.3],[0,2.7],[0,2.0]])poly([x-.09,y+.09,x,y-.2,x+.09,y+.09],K('#cfd4da'),OL);
  circ(0,.15,.36,K('#6a7080'),OL);
  G.restore();
  // head
  circ(0,-.95,.62,K('#a8321f'),OL);ell(-.2,-1.1,.25,.2,'rgba(255,255,255,.16)',null);
  for(const sx of [-1,1]){G.beginPath();G.moveTo(sx*.45,-1.2);G.quadraticCurveTo(sx*1.35,-1.1,sx*1.2,-2.25);G.quadraticCurveTo(sx*.8,-1.6,sx*.25,-1.45);G.closePath();fillS(K('#ece3c8'),OL);}
  G.beginPath();G.arc(0,-.95,.66,Math.PI*1.03,Math.PI*1.97);G.lineTo(.6,-1.15);G.lineTo(-.6,-1.15);G.closePath();fillS(K('#59606e'),OL);
  rect(-.08,-1.2,.16,.5,K('#454b57'),OL);rect(-.68,-1.22,1.36,.12,K('#3a3f4a'),OL);
  poly([-.55,-1.25,-.55,-1.62,-.3,-1.45,-.15,-1.78,0,-1.5,.15,-1.78,.3,-1.45,.55,-1.62,.55,-1.25],K('#ffd84a'),OL);
  circ(0,-1.55,.07,K('#ff4a3a'),OL);
  poly([-.4,-.7,.4,-.7,.3,-.5,-.3,-.5],K('#2a1d16'),null);
  for(const sx of [-1,1])poly([sx*.1,-.5,sx*.14,-.68,sx*.2,-.5],K('#fff'),null);
  line(-.5,-1.0,-.12,-.88,'#2a1d16',LW*1.8);line(.5,-1.0,.12,-.88,'#2a1d16',LW*1.8);
  circ(-.24,-.84,.11,'#ffb02a',null);circ(.24,-.84,.11,'#ffb02a',null);circ(-.24,-.84,.04,'#a00',null);circ(.24,-.84,.04,'#a00',null);
 },
};
export function dEnemy(e,s,S){
 const T=ENEMIES[e.t];setFLASH(e.flash>0);setFROST(e.slow>0&&!FLASH);
 let dx=-e.x;
 if(e.mode==='atk'&&e.tc)dx=W2(e.tc.q,e.tc.r).x-e.x;else if(e.mode==='move')dx=W2(e.tq,e.tr).x-e.fx;
 if(Math.abs(dx)>.01)e.fl=dx<0?-1:1;const fl=e.fl||1;
 const ph=e.ph||0,atk=e.mode==='atk';
 const sc=T.r*S*T.drawScale;
 setLW(Math.max(.07,1.3/sc));
 if(FROST){ell(s.x,s.y+sc*.9,sc*1.2,sc*.45,'rgba(150,210,255,.45)','rgba(210,240,255,.9)');}
 G.save();G.translate(s.x,s.y);G.scale(sc*fl,sc);
  ENEMY_ART[T.art](ph,atk);
 G.restore();setFLASH(false);setFROST(false);
}
export function ebar(x,y,w,f,col){
 const h=Math.max(3,.11*L.S);
 G.fillStyle='rgba(10,10,16,.85)';G.fillRect(x-w/2-1,y-1,w+2,h+2);
 G.fillStyle='#3a1a1a';G.fillRect(x-w/2,y,w,h);
 G.fillStyle=col;G.fillRect(x-w/2,y,w*Math.max(0,f),h);
 G.fillStyle='rgba(255,255,255,.3)';G.fillRect(x-w/2,y,w*Math.max(0,f),Math.max(1,h*.3));
}
