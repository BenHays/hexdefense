// Terrain tiles, painted once into small canvases and cached per terrain / variant / size / pixel ratio.
import { TERRAINS } from '../data/terrain.js';
import { L } from '../camera.js';
import { TAU, G, LW, OL, lwu, rect, poly, ell, line, star, gem, setG, setLW } from './prims.js';

// ---- tiles (cached per terrain / variant / size)
export function rng(seed){let s=(seed*2654435761)>>>0||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return(s>>>0)/4294967296;};}
export const TI=Object.fromEntries(Object.keys(TERRAINS).map((id,i)=>[id,i]));
export function hexG(g,x,y,s){g.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i-30);const px=x+s*Math.cos(a),py=y+s*Math.sin(a);i?g.lineTo(px,py):g.moveTo(px,py);}g.closePath();}
export function tree(x,y,k){
 ell(x+.06*k,y+.2*k,.24*k,.08*k,'rgba(0,0,0,.28)',null);
 rect(x-.045*k,y+.05*k,.09*k,.2*k,'#6b4524',OL);
 for(const [w,yy,h] of [[.27,.12,.3],[.22,-.08,.28],[.16,-.26,.26]]){
  const cy=y+yy*k;
  poly([x,cy-h*k,x-w*k,cy,x,cy],'#58a35a',null);poly([x,cy-h*k,x+w*k,cy,x,cy],'#2f6e3c',null);
  poly([x,cy-h*k,x-w*k,cy,x+w*k,cy],null,OL);}
}
export function rock(x,y,k,r){
 const pts=[];const n=7;for(let i=0;i<n;i++){const a=i/n*TAU+r()*.3,rr=(.7+r()*.3)*k;pts.push(x+Math.cos(a)*rr,y+Math.sin(a)*rr*.75);}
 ell(x+.06*k,y+.55*k,k*.95,k*.28,'rgba(0,0,0,.3)',null);
 poly(pts,'#7b818a',null);
 // facets: light top-left, dark bottom-right
 G.save();G.beginPath();G.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)G.lineTo(pts[i],pts[i+1]);G.closePath();G.clip();
 G.fillStyle='rgba(235,240,250,.45)';G.beginPath();G.ellipse(x-.35*k,y-.4*k,k*.85,k*.55,-.5,0,TAU);G.fill();
 G.fillStyle='rgba(20,24,34,.38)';G.beginPath();G.ellipse(x+.55*k,y+.5*k,k*.9,k*.55,-.5,0,TAU);G.fill();
 G.restore();
 poly(pts,null,'#2f3338');
 line(x-.1*k,y-.1*k,x+.15*k,y+.2*k,'rgba(30,34,44,.5)',LW*.7);
}
export function paintTile(g,terr,v,mode,S,cx,cy){
 const r=S*.965,col=TERRAINS[terr].color,R=rng(v*131+TI[terr]*17+5);
 g.save();g.translate(cx,cy);
 const gr=g.createLinearGradient(0,-r,0,r);gr.addColorStop(0,col[0]);gr.addColorStop(1,col[1]);
 hexG(g,0,0,r);g.fillStyle=gr;g.fill();
 g.save();hexG(g,0,0,r);g.clip();
 if(terr==='fog'){
  for(let i=0;i<46;i++){const a=R()*TAU,d=Math.sqrt(R())*r;g.fillStyle=R()<.5?'rgba(255,255,255,.035)':'rgba(0,0,0,.28)';const sz=1+R()*2.2;g.fillRect(Math.cos(a)*d,Math.sin(a)*d,sz,sz);}
  const vg=g.createRadialGradient(0,0,r*.2,0,0,r);vg.addColorStop(0,'rgba(40,50,80,.10)');vg.addColorStop(1,'rgba(0,0,0,.55)');g.fillStyle=vg;g.fillRect(-r,-r,2*r,2*r);
 }else{
  const hl=g.createRadialGradient(-r*.3,-r*.45,0,-r*.3,-r*.45,r*1.3);hl.addColorStop(0,'rgba(255,255,255,.2)');hl.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=hl;g.fillRect(-r,-r,2*r,2*r);
  if(terr==='crystal'){const cg=g.createRadialGradient(0,0,0,0,0,r*.9);cg.addColorStop(0,'rgba(140,110,255,.45)');cg.addColorStop(1,'rgba(140,110,255,0)');g.fillStyle=cg;g.fillRect(-r,-r,2*r,2*r);}
  if(terr==='plain'){for(let i=0;i<5;i++){g.fillStyle='rgba(90,70,40,.06)';g.beginPath();g.ellipse((R()-.5)*r*1.2,(R()-.5)*r*1.2,r*(.15+R()*.2),r*(.08+R()*.1),R()*3,0,TAU);g.fill();}}
  if(terr==='castle'){g.strokeStyle='rgba(90,70,30,.22)';g.lineWidth=1;for(let i=1;i<5;i++){g.beginPath();g.arc(0,0,r*i/5,0,TAU);g.stroke();}}
 }
 g.restore();
 // bevel
 if(terr!=='fog'){
  g.lineCap='butt';const w=Math.max(1.4,S*.07);
  for(let i=0;i<6;i++){const a=Math.PI/3*i,n=[Math.cos(a),Math.sin(a)],f=-(n[0]+n[1])*.7071;
   const a0=a-Math.PI/6,a1=a+Math.PI/6;
   g.beginPath();g.moveTo(Math.cos(a0)*(r-w/2),Math.sin(a0)*(r-w/2));g.lineTo(Math.cos(a1)*(r-w/2),Math.sin(a1)*(r-w/2));
   g.strokeStyle=f>0?'rgba(255,255,255,'+(.5*f)+')':'rgba(0,0,0,'+(.42*-f)+')';g.lineWidth=w;g.stroke();}
  if(terr==='castle'){hexG(g,0,0,r*.84);g.strokeStyle='rgba(212,170,70,.85)';g.lineWidth=Math.max(1.5,S*.05);g.stroke();}
 }
 hexG(g,0,0,r);g.strokeStyle=terr==='fog'?'rgba(0,0,0,.6)':'rgba(30,24,16,.55)';g.lineWidth=1;g.stroke();
 // terrain art (unit space)
 if(mode&&terr!=='fog'&&terr!=='castle'){
  g.save();if(mode===2){g.globalAlpha=.4;g.scale(.7,.7);}g.scale(S,S);
  const sG=G,sL=LW;setG(g);setLW(lwu(S));
  if(terr==='plain'){
   for(let i=0;i<4;i++){const x=(R()-.5)*1.1,y=(R()-.5)*.9,k=.04+R()*.05;
    ell(x+.015,y+.02,k*1.3,k*.8,'rgba(0,0,0,.22)',null);ell(x,y,k*1.3,k*.9,i%2?'#9a8f79':'#8a7f6a',null);ell(x-k*.3,y-k*.3,k*.55,k*.35,'rgba(255,255,255,.4)',null);}
   for(let i=0;i<3;i++){const x=(R()-.5)*1.1,y=(R()-.5)*.9;line(x,y,x+.06,y+.01,'rgba(90,70,40,.35)',LW*.8);line(x+.02,y+.03,x+.07,y+.04,'rgba(90,70,40,.3)',LW*.8);}
  }else if(terr==='wood'){
   const o=[[-.34,.12,1.0],[.32,.2,1.05],[.0,-.22,.88]];const j=(v%4)*.03;
   o.sort((a,b)=>a[1]-b[1]);for(const t of o)tree(t[0]+(j-.04),t[1],t[2]);
  }else if(terr==='stone'){
   rock(-.3,.2,.3,R);rock(.3,.22,.34,R);rock(0,-.15,.28,R);if(v&1)rock(-.45,-.25,.14,R);else rock(.5,-.2,.13,R);
  }else if(terr==='crystal'){
   gem(-.02,.0,1.1);gem(-.34,.22,.55);gem(.3,.26,.46);
   G.fillStyle='rgba(255,255,255,.9)';star(.22,-.3,.07,'#fff',null);
  }
  setG(sG);setLW(sL);g.restore();
 }
 g.restore();
}
export const TC=new Map();let tcCur=null,tcSq=0,tcDpr=0;
export function tileFor(terr,v,mode,S){
 const sq=Math.max(8,Math.round(S*2)/2),dpr=L.dpr;
 if(sq!==tcSq||dpr!==tcDpr){const k=sq+'|'+dpr;tcCur=TC.get(k);if(!tcCur){if(TC.size>10)TC.clear();tcCur=[];TC.set(k,tcCur);}tcSq=sq;tcDpr=dpr;}
 const idx=TI[terr]*12+v*3+mode;let t=tcCur[idx];if(t)return t;
 const w=Math.ceil(2*sq*dpr)+2,c=document.createElement('canvas');c.width=c.height=w;
 const g=c.getContext('2d');g.scale(dpr,dpr);const half=w/dpr/2;
 paintTile(g,terr,v,mode,sq,half,half);
 t={cv:c,sq,half,w:w/dpr};tcCur[idx]=t;return t;
}
