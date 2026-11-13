// Structure and castle drawings (code-drawn art, unit space).
import { ANG } from '../hex.js';
import { STRUCTURES } from '../data/structures.js';
import { G, NOW, FLASH, LW, OL, lwu, K, fillS, rect, poly, circ, ell, line, shadow, block, bricks,
  star, upgMark, glow, gem, setLW, setFLASH } from './prims.js';

// ---- structures
export function dCastle(S){
 setLW(lwu(S));setFLASH(false);
 shadow(.9,.26,.06,.52);
 block(-.4,-.5,.8,1.0,'#c6c0b2');bricks(-.4,-.5,.8,1.0,6,5);
 for(const x0 of [-.78,.38]){block(x0,-.3,.4,.8,'#b3ada0');bricks(x0,-.3,.4,.8,5,3);
  for(let i=0;i<3;i++)block(x0+i*.15,-.42,.1,.12,'#b3ada0');
  rect(x0+.15,-.1,.1,.2,'#2a2630',OL);}
 for(let i=0;i<4;i++)block(-.4+i*.2,-.62,.16,.12,'#c6c0b2');
 // roofs on side towers
 for(const x0 of [-.78,.38]){poly([x0+.2-.0,-.82,x0-.02,-.42,x0+.42,-.42],'#b44a38',OL);poly([x0+.2,-.82,x0+.2,-.42,x0+.42,-.42],'rgba(0,0,0,.2)',null);}
 // gate
 G.beginPath();G.moveTo(-.17,.5);G.lineTo(-.17,.18);G.arc(0,.18,.17,Math.PI,0);G.lineTo(.17,.5);G.closePath();fillS('#3a2614',OL);
 line(0,.0,0,.5,'#6a4a28',LW*.9);line(-.09,.02,-.09,.5,'#6a4a28',LW*.7);line(.09,.02,.09,.5,'#6a4a28',LW*.7);
 // keep window
 G.beginPath();G.moveTo(-.07,-.12);G.lineTo(-.07,-.28);G.arc(0,-.28,.07,Math.PI,0);G.lineTo(.07,-.12);G.closePath();fillS('#ffd36a',OL);
 // flag
 line(0,-.6,0,-1.08,'#3a2a1a',LW*1.4);circ(0,-1.1,.05,'#ffd84a',OL);
 G.beginPath();G.moveTo(.02,-1.04);
 for(let i=0;i<=8;i++){const u=i/8;G.lineTo(.02+u*.46,-1.04+Math.sin(NOW*6-u*5)*.06*u);}
 for(let i=8;i>=0;i--){const u=i/8;G.lineTo(.02+u*.46,-.8+Math.sin(NOW*6-u*5)*.06*u);}
 G.closePath();fillS('#d83a3a',OL);
 star(.17,-.93,.07,'#ffd84a',null);
}
export function dArcher(b){
 const fk=(b&&b.fk)||0,aim=(b&&b.aim!=null)?b.aim:-.5;
 shadow(.62,.2,.1,.56);
 G.save();G.translate(0,.06);G.scale(.94,.94);
 poly([-.46,.5,-.34,.1,.34,.1,.46,.5],K('#9a978f'),OL);bricks(-.33,.14,.66,.36,3,5);
 G.fillStyle='rgba(0,0,0,.2)';G.fillRect(.18,.1,.2,.4);
 block(-.3,-.32,.6,.42,'#a1713f');
 line(-.1,-.32,-.1,.1,'rgba(40,24,10,.4)',LW*.7);line(.1,-.32,.1,.1,'rgba(40,24,10,.4)',LW*.7);
 line(-.3,.1,.3,-.3,'#5a381a',LW*1.4);
 rect(-.44,-.4,.88,.1,K('#6f4a28'),OL);
 rect(-.38,-.74,.07,.36,K('#6f4a28'),OL);rect(.31,-.74,.07,.36,K('#6f4a28'),OL);
 // archer
 rect(-.07,-.55,.14,.15,K('#3b6fbf'),OL);circ(0,-.63,.085,K('#f0c9a0'),OL);
 poly([-.09,-.66,0,-.76,.09,-.66],K('#2e5a2e'),OL);
 G.save();G.translate(0,-.5);G.rotate(aim);
 const ba=1.1,bx=Math.cos(ba)*.27,by=Math.sin(ba)*.27,pull=(1-fk)*.1;
 G.beginPath();G.arc(0,0,.27,-ba,ba);G.strokeStyle='#7a4a22';G.lineWidth=LW*2.6;G.lineCap='round';G.stroke();
 G.beginPath();G.moveTo(bx,-by);G.lineTo(bx-pull-.02,0);G.lineTo(bx,by);G.strokeStyle='rgba(255,255,255,.85)';G.lineWidth=LW*.6;G.stroke();
 if(fk<.5){line(bx-pull-.02,0,.34,0,'#e8e0d0',LW*.8);poly([.34,-.04,.42,0,.34,.04],'#cfd4da',null);}
 G.restore();
 poly([-.56,-.7,0,-1.06,.56,-.7],K('#b8442e'),OL);poly([0,-1.06,.56,-.7,0,-.7],'rgba(0,0,0,.22)',null);poly([-.56,-.7,0,-1.06,-.2,-.7],'rgba(255,255,255,.16)',null);
 line(-.56,-.7,.56,-.7,b&&b.upg?'#ffd84a':'#7a2a1a',LW*(b&&b.upg?1.8:1));
 G.restore();
 if(b&&b.upg)upgMark();
}
export function dCat(b){
 const fk=(b&&b.fk)||0,dir=(b&&b.dx)||1;
 shadow(.7,.2,.05,.54);
 G.save();G.scale(dir,1);
 rect(-.62,.34,1.24,.13,K('#6f4a28'),OL);
 for(const x of [-.4,.4]){circ(x,.42,.17,K('#4a2f18'),OL);circ(x,.42,.07,K('#c19a5c'),OL);for(let i=0;i<4;i++){const a=i*Math.PI/4;line(x-Math.cos(a)*.16,.42-Math.sin(a)*.16,x+Math.cos(a)*.16,.42+Math.sin(a)*.16,'#2a1a0a',LW*.7);}}
 for(const sx of [-1,1]){poly([sx*.36,.36,sx*.18,.36,sx*.04,-.14,sx*.14,-.14],K('#a1713f'),OL);}
 line(-.3,.24,.3,.24,'#5a381a',LW*1.4);
 const cocked=2.5,fwd=5.4;let ang;
 if(fk>.7){const p=Math.min(1,(1-fk)/.3);ang=cocked+(fwd-cocked)*p;}else{ang=cocked+(fwd-cocked)*(fk/.7);}
 G.save();G.translate(0,-.14);G.rotate(ang);
 rect(-.26,-.055,.9,.11,K('#c08a4a'),OL);
 rect(-.34,-.1,.15,.2,K('#555c66'),OL);
 poly([.5,-.1,.7,-.12,.66,.1,.5,.08],K('#6f4a28'),OL);
 if(fk<.3)circ(.6,-.14,.11,K('#8a8f98'),OL);
 G.restore();
 circ(0,-.14,.07,K('#3a2614'),OL);
 G.restore();
 if(b&&b.upg){upgMark();}
}
export function dMage(b){
 const fk=(b&&b.fk)||0,t=NOW,ph=b?(b.q0||0):0,gl=.55+.2*Math.sin(t*3+ph)+fk*.8;
 shadow(.45,.17,.08,.55);
 poly([-.34,.52,-.2,-.3,.2,-.3,.34,.52],K('#8a85a0'),OL);bricks(-.28,-.26,.56,.76,5,4);
 G.fillStyle='rgba(0,0,0,.22)';G.beginPath();G.moveTo(.2,-.3);G.lineTo(.34,.52);G.lineTo(.12,.52);G.lineTo(.1,-.3);G.fill();
 G.fillStyle='rgba(255,255,255,.12)';G.beginPath();G.moveTo(-.2,-.3);G.lineTo(-.34,.52);G.lineTo(-.2,.52);G.lineTo(-.12,-.3);G.fill();
 rect(-.3,.0,.6,.06,K('#7a4fd0'),OL);
 G.fillStyle=FLASH?'#fff':'rgba(120,230,255,'+Math.min(1,.5+gl*.5)+')';G.beginPath();G.rect(-.04,-.18,.08,.2);G.fill();
 // spire
 poly([-.3,-.28,.3,-.28,.2,-.38,-.2,-.38],K('#6a3fb8'),OL);
 poly([-.2,-.36,.2,-.36,0,-.86],K('#7d4fd0'),OL);poly([0,-.86,.2,-.36,0,-.36],'rgba(0,0,0,.25)',null);poly([-.2,-.36,0,-.86,-.07,-.36],'rgba(255,255,255,.18)',null);
 star(0,-.5,.06,'#ffd84a',null);
 // orb
 const oy=-.97;
 G.globalCompositeOperation='lighter';glow(0,oy,.2+.18*gl,'190,120,255',.5);G.globalCompositeOperation='source-over';
 circ(0,oy,.12+.02*gl,K('#b97bff'),'#32105e');circ(-.03,oy-.03,.05,'rgba(255,255,255,'+Math.min(1,.5+gl*.5)+')',null);
 if(b&&b.upg){rect(-.3,-.31,.6,.07,'#ffd84a','#8a5a00');upgMark();}
}
export function dScan(b){
 const hw=y=>.27+.1625*(y+.28),ph=b?(b.q0||0):0;
 shadow(.5,.18,.08,.55);
 poly([-.4,.52,-.27,-.28,.27,-.28,.4,.52],K('#ece7dc'),OL);
 for(const [y0,y1] of [[.12,.3],[-.2,-.04]])poly([-hw(y0),y0,hw(y0),y0,hw(y1),y1,-hw(y1),y1],K('#c8402e'),null);
 G.fillStyle='rgba(0,0,0,.2)';G.beginPath();G.moveTo(.1,-.28);G.lineTo(.27,-.28);G.lineTo(.4,.52);G.lineTo(.14,.52);G.fill();
 G.beginPath();G.moveTo(-.4,.52);G.lineTo(-.27,-.28);G.lineTo(.27,-.28);G.lineTo(.4,.52);G.closePath();G.strokeStyle=OL;G.lineWidth=LW;G.stroke();
 rect(-.12,.32,.24,.2,K('#3a2614'),OL);
 rect(-.36,-.34,.72,.07,K('#3d4452'),OL);
 const lit=.7+.3*Math.sin(NOW*4+ph);
 rect(-.2,-.62,.4,.28,FLASH?'#fff':'rgba(255,226,120,'+lit+')',OL);
 line(0,-.62,0,-.34,'#3d4452',LW);
 poly([-.3,-.62,0,-.86,.3,-.62],K('#c0392b'),OL);circ(0,-.89,.04,K('#ddd'),OL);
 const ang=NOW*1.7+ph*3;
 G.globalCompositeOperation='lighter';
 for(const o of [0,Math.PI]){
  G.beginPath();G.moveTo(0,-.48);G.arc(0,-.48,1.25,ang+o-.16,ang+o+.16);G.closePath();G.fillStyle='rgba(255,236,150,.2)';G.fill();
  G.beginPath();G.moveTo(0,-.48);G.arc(0,-.48,.85,ang+o-.07,ang+o+.07);G.closePath();G.fillStyle='rgba(255,246,200,.3)';G.fill();}
 glow(0,-.48,.28,'255,230,120',.35);
 G.globalCompositeOperation='source-over';
 if(b&&b.upg)upgMark();
}
export function dHarv(b,terr){
 const t=NOW;
 shadow(.72,.2,.02,.52);
 if(terr==='wood'){
  block(-.32,-.34,.64,.38,'#a77a45');line(-.2,-.34,-.2,.04,'rgba(40,24,10,.35)',LW*.7);line(0,-.34,0,.04,'rgba(40,24,10,.35)',LW*.7);line(.2,-.34,.2,.04,'rgba(40,24,10,.35)',LW*.7);
  poly([-.44,-.32,0,-.74,.44,-.32],K('#7a4a2a'),OL);poly([0,-.74,.44,-.32,0,-.32],'rgba(0,0,0,.25)',null);
  rect(-.07,-.14,.14,.18,K('#3a2614'),OL);
  // logs pile
  for(const [x,y,l] of [[.0,.42,.6],[.04,.26,.52],[.12,.1,.42]]){
   rect(x,y-.07,l,.14,K('#8b5a2b'),OL);ell(x+l,y,.045,.07,K('#e0b070'),OL);line(x+.06,y-.02,x+l-.08,y-.02,'rgba(255,255,255,.2)',LW*.7);}
  // stump + axe
  rect(-.58,.28,.32,.18,K('#7a4e26'),OL);ell(-.42,.28,.16,.07,K('#e0b070'),OL);
  G.save();G.translate(-.42,.26);G.rotate(-.7+Math.sin(t*3.2)*.22);
  line(0,0,0,-.5,K('#6a4524'),LW*2);poly([0,-.5,.2,-.48,.22,-.34,0,-.32],K('#c3cad4'),OL);G.restore();
 }else if(terr==='stone'){
  poly([-.7,.45,-.55,-.05,-.2,-.2,.0,.1,-.05,.45],K('#757c86'),OL);poly([-.55,-.05,-.2,-.2,-.3,.0],'rgba(255,255,255,.3)',null);
  ell(-.3,.4,.3,.08,'rgba(0,0,0,.35)',null);
  block(.02,.2,.32,.26,'#b4bac2');block(.34,.2,.32,.26,'#a8aeb7');block(.18,-.06,.32,.26,'#c3c8d0');
  G.save();G.translate(-.38,.4);G.rotate(-.9+Math.sin(t*3)*.35);
  line(0,0,0,-.62,K('#6a4524'),LW*2);poly([-.24,-.56,0,-.7,.24,-.56,0,-.6],K('#aab3be'),OL);G.restore();
 }else{
  ell(0,.42,.55,.14,K('#4a505c'),OL);
  G.globalCompositeOperation='lighter';glow(0,.3,.5,'120,220,255',.18+.08*Math.sin(t*4));G.globalCompositeOperation='source-over';
  for(const sx of [-1,1]){poly([sx*.5,.42,sx*.38,.42,sx*.05,-.52,sx*.17,-.52],K('#6d7684'),OL);}
  line(-.3,.0,.3,.0,'#4a505c',LW*1.4);line(-.4,.26,.4,.26,'#4a505c',LW*1.4);
  rect(-.2,-.62,.4,.12,K('#59606d'),OL);circ(0,-.56,.07,K('#c3cad4'),OL);
  const dy=Math.sin(t*5)*.04;line(0,-.5,0,-.05+dy,'#aab3be',LW*1.6);
  gem(0,.12,.55+.05*Math.sin(t*4),FLASH);
  gem(-.5,.36,.28,FLASH);
  G.save();G.translate(.52,-.1);G.rotate(t*2);G.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4;G.lineTo(Math.cos(a-.15)*.17,Math.sin(a-.15)*.17);G.lineTo(Math.cos(a+.15)*.17,Math.sin(a+.15)*.17);G.lineTo(Math.cos(a+.25)*.12,Math.sin(a+.25)*.12);G.lineTo(Math.cos(a+.45)*.12,Math.sin(a+.45)*.12);}G.closePath();fillS(K('#8a929e'),OL);circ(0,0,.04,'#2a1d16',null);G.restore();
 }
}
export function dWall(b,wm){
 const arms=[];for(let i=0;i<6;i++)if(wm&(1<<i))arms.push(ANG[i]);
 if(!arms.length)arms.push(0,Math.PI);
 shadow(.85,.24,.04,.46);
 for(let pass=0;pass<2;pass++){
  G.save();if(!pass)G.translate(0,.15);
  const top=pass?K('#aaa192'):K('#6f685c');
  for(const a of arms){G.save();G.rotate(a);rect(0,-.17,.95,.34,top,OL);if(pass){bricks(0,-.17,.95,.34,2,4);G.fillStyle='rgba(255,255,255,.15)';G.fillRect(0,-.17,.95,.07);}G.restore();}
  rect(-.27,-.27,.54,.54,top,OL);
  if(pass){bricks(-.27,-.27,.54,.54,3,3);G.fillStyle='rgba(255,255,255,.18)';G.fillRect(-.27,-.27,.54,.08);
   for(const [x,y] of [[-.27,-.27],[.15,-.27],[-.27,.15],[.15,.15]])rect(x,y,.12,.12,K('#b8af9f'),OL);}
  G.restore();
 }
 if(b&&b.upg)upgMark();
}
// Which drawing each structure uses (STRUCTURES[id].icon in src/data/structures.js).
// Each drawer is called in unit space with the context already translated and scaled.
const STRUCTURE_ART = {
  archer: (b, terr, wm) => dArcher(b),
  cat:    (b, terr, wm) => dCat(b),
  mage:   (b, terr, wm) => dMage(b),
  scan:   (b, terr, wm) => dScan(b),
  harv:   (b, terr, wm) => dHarv(b, terr),
  wall:   (b, terr, wm) => dWall(b, wm || 0),
};
export function drawBuilding(type,terr,b,S,wm){
 setLW(lwu(S));setFLASH(!!(b&&b.flash>0));
 STRUCTURE_ART[STRUCTURES[type].icon](b,terr,wm);
 setFLASH(false);
}
