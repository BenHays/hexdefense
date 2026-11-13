// Code-drawn icons for the HUD, build menu and tech tree. Names are referenced from the data
// tables (tech nodes / branches) and by the UI: add a drawing here to add an icon.
// 'b:<structure id>:<terrain>' renders a structure as an icon.
import { TAU, G, LW, NOW, OL, circ, rect, poly, ell, line, star, gem, fillS, setG, setLW, setNOW } from './prims.js';
import { drawBuilding } from './structures.js';

export const ICONS={
 gold(){circ(0,0,.85,'#f6cf4a','#8a6410');circ(0,0,.62,'#e0a820','#a57a10');G.beginPath();G.arc(0,0,.78,3.6,5.0);G.strokeStyle='rgba(255,255,255,.7)';G.lineWidth=.1;G.stroke();star(0,0,.4,'#fff1a0','#a57a10');},
 wood(){G.save();G.rotate(-.5);rect(-.9,-.34,1.6,.68,'#8b5a2b',OL);line(-.7,-.12,.5,-.12,'rgba(255,255,255,.25)',.07);line(-.7,.14,.4,.14,'rgba(0,0,0,.25)',.07);ell(.7,0,.2,.34,'#e0b070',OL);ell(.7,0,.1,.18,null,'#a8763a');G.restore();},
 stone(){poly([-.85,-.15,0,-.6,.85,-.15,0,.3],'#d3d8e0',OL);poly([-.85,-.15,0,.3,0,.85,-.85,.4],'#9aa1ac',OL);poly([0,.3,.85,-.15,.85,.4,0,.85],'#6c737e',OL);},
 crystal(){gem(0,0,1.7);},
 heart(){G.beginPath();G.moveTo(0,.8);G.bezierCurveTo(-1.2,-.1,-.7,-.9,0,-.4);G.bezierCurveTo(.7,-.9,1.2,-.1,0,.8);fillS('#e8453c','#6a1410');G.beginPath();G.ellipse(-.4,-.3,.2,.12,-.6,0,TAU);G.fillStyle='rgba(255,255,255,.55)';G.fill();},
 flag(){line(-.5,-.85,-.5,.85,'#6a4a28',.12);poly([-.45,-.8,.75,-.45,-.45,.0],'#d83a3a',OL);},
 star(){star(0,0,.9,'#ffd84a','#8a5a00');},
 castle(){poly([-.8,.7,-.8,-.2,-.55,-.2,-.55,-.4,-.3,-.4,-.3,-.2,.3,-.2,.3,-.4,.55,-.4,.55,-.2,.8,-.2,.8,.7],'#c6c0b2',OL);G.beginPath();G.moveTo(-.2,.7);G.lineTo(-.2,.25);G.arc(0,.25,.2,Math.PI,0);G.lineTo(.2,.7);G.closePath();fillS('#3a2614',OL);line(0,-.2,0,-.9,'#3a2a1a',.1);poly([0,-.9,.6,-.7,0,-.5],'#d83a3a',OL);},
 lock(){rect(-.5,-.1,1.0,.8,'#9aa1b4',OL);G.beginPath();G.arc(0,-.1,.32,Math.PI,0);G.strokeStyle='#9aa1b4';G.lineWidth=.16;G.stroke();circ(0,.3,.1,'#2a1d16',null);},
 pick(){G.save();G.rotate(.6);line(0,.9,0,-.7,'#8b5a2b',.16);poly([-.8,-.5,0,-.95,.8,-.5,0,-.65],'#c3cad4',OL);G.restore();},
 coins(){for(const [x,y] of [[-.1,.5],[-.1,.25],[-.1,0]])ell(x,y,.6,.25,'#f6cf4a',OL);ell(-.1,-.25,.6,.25,'#ffe27a',OL);G.fillStyle='#fff';G.font='bold .6px sans-serif';},
 tag(){poly([-.8,-.2,-.2,-.8,.8,-.8,.8,.2,.2,.8],'#f6cf4a',OL);circ(.45,-.45,.1,'#2a1d16',null);G.fillStyle='#8a4a10';G.font='bold .8px sans-serif';G.textAlign='center';G.fillText('%',.0,.28);},
 sword(){G.save();G.rotate(.78);poly([-.12,.4,-.12,-.8,0,-1.0,.12,-.8,.12,.4],'#dfe5ee',OL);rect(-.4,.38,.8,.14,'#c9a030',OL);rect(-.07,.5,.14,.4,'#6a4524',OL);G.restore();},
 aim(){circ(0,0,.8,null,'#f0f0f0');circ(0,0,.5,null,'#e8574f');circ(0,0,.2,'#e8574f',OL);line(.1,-.1,.95,-.95,'#cfd4da',.1);poly([.95,-.95,.55,-.9,.9,-.55],'#8a929e',null);},
 boom(){G.beginPath();for(let i=0;i<16;i++){const a=i*Math.PI/8,r=i%2?.45:.95;i?G.lineTo(Math.cos(a)*r,Math.sin(a)*r):G.moveTo(Math.cos(a)*r,Math.sin(a)*r);}G.closePath();fillS('#ff9a3a','#7a2a00');circ(0,0,.4,'#ffe27a',null);},
 eye(){G.beginPath();G.moveTo(-.95,0);G.quadraticCurveTo(0,-.9,.95,0);G.quadraticCurveTo(0,.9,-.95,0);fillS('#f4f8ff',OL);circ(0,0,.38,'#2f8fe8',OL);circ(0,0,.16,'#0a1a2a',null);circ(-.12,-.12,.07,'#fff',null);},
 beacon(){G.globalCompositeOperation='lighter';for(const a of [-.5,.5])for(const o of [0,Math.PI]){G.beginPath();G.moveTo(0,0);G.arc(0,0,.95,a+o-.2,a+o+.2);G.fillStyle='rgba(255,230,120,.7)';G.fill();}G.globalCompositeOperation='source-over';circ(0,0,.32,'#ffe27a',OL);},
 heartplus(){ICONS.heart();rect(-.12,-.3,.24,.6,'#fff',null);rect(-.3,-.12,.6,.24,'#fff',null);}
};
export const iconCache=new Map();
export function iconURL(name,px){
 const k=name+'|'+px;let u=iconCache.get(k);if(u)return u;
 const c=document.createElement('canvas');c.width=c.height=px*2;const g=c.getContext('2d');
 const sG=G,sL=LW,sN=NOW;setG(g);setLW(.07);g.translate(px,px);
 if(name.startsWith('b:')){const [ty,te]=name.slice(2).split(':');const sc=px*.88;g.translate(0,px*.2);g.scale(sc,sc);setNOW(0);drawBuilding(ty,te,null,40,0);}
 else{g.scale(px*.82,px*.82);ICONS[name]();}
 setG(sG);setLW(sL);setNOW(sN);u=c.toDataURL();iconCache.set(k,u);return u;
}
export const icoEl=(n,px)=>{const i=new Image();i.src=iconURL(n,px);i.width=px;i.height=px;i.draggable=false;return i;};
export const icoHTML=(n,px)=>'<img src="'+iconURL(n,px)+'" width="'+px+'" height="'+px+'" draggable="false" alt="">';