// Enemy drawings (code-drawn art). Each ENEMY_ART entry draws one enemy type in unit space;
// ENEMIES[id].art in src/data/enemies.js picks which one is used.
import { W2 } from '../hex.js';
import { L } from '../camera.js';
import { ENEMIES } from '../data/enemies.js';
import { G, FLASH, FROST, LW, OL, K, fillS, rect, poly, circ, ell, line, setLW, setFLASH, setFROST } from './prims.js';

const ENEMY_ART = {
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
  for(const sx of [-1,1]){G.beginPath();G.moveTo(sx*.35,-1.15);G.quadraticCurveTo(sx*1.05,-1.2,sx*.95,-1.95);G.quadraticCurveTo(sx*.62,-1.45,sx*.18,-1.28);G.closePath();fillS(K('#ece3c8'),OL);}
  poly([-.3,-.62,.3,-.62,.22,-.5,-.22,-.5],K('#2a1d16'),null);
  line(-.35,-1.0,-.08,-.9,'#2a1d16',LW*1.4);line(.35,-1.0,.08,-.9,'#2a1d16',LW*1.4);
  circ(-.2,-.87,.1,'#ff5a3a',null);circ(.2,-.87,.1,'#ff5a3a',null);},
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
