// Low-level canvas drawing helpers. Everything in the game is drawn in code, in "unit space"
// (hex radius = 1). The current drawing context and style flags are module state; other
// modules change them through the setters below.
import { ctx } from '../dom.js';

export const TAU=Math.PI*2, OL='#2a1d16';
export let G=ctx, NOW=0, FLASH=false, FROST=false, LW=.05;
export const lwu=s=>Math.max(.045,1.4/s);
const mixc=new Map();
export function K(c){
 if(FLASH)return '#fff'; if(!FROST)return c;
 let m=mixc.get(c);
 if(!m){const n=parseInt(c.slice(1),16);m='rgb('+(((n>>16)&255)*.3+80|0)+','+(((n>>8)&255)*.3+130|0)+','+((n&255)*.3+180|0)+')';mixc.set(c,m);}
 return m;
}
export function fillS(f,s){if(f){G.fillStyle=f;G.fill();}if(s){G.strokeStyle=s;G.lineWidth=LW;G.lineJoin='round';G.stroke();}}
export function rect(x,y,w,h,f,s){G.beginPath();G.rect(x,y,w,h);fillS(f,s);}
export function poly(p,f,s){G.beginPath();G.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)G.lineTo(p[i],p[i+1]);G.closePath();fillS(f,s);}
export function circ(x,y,r,f,s){G.beginPath();G.arc(x,y,r,0,TAU);fillS(f,s);}
export function ell(x,y,rx,ry,f,s,rot){G.beginPath();G.ellipse(x,y,rx,ry,rot||0,0,TAU);fillS(f,s);}
export function line(x1,y1,x2,y2,c,w){G.beginPath();G.moveTo(x1,y1);G.lineTo(x2,y2);G.strokeStyle=c;G.lineWidth=w||LW;G.lineCap='round';G.stroke();}
export function shadow(rx,ry,x,y){ell(x,y,rx,ry,'rgba(0,0,0,.3)',null);}
export function block(x,y,w,h,c){
 rect(x,y,w,h,K(c));
 G.fillStyle='rgba(255,255,255,.16)';G.fillRect(x,y,w*.3,h);
 G.fillStyle='rgba(0,0,0,.2)';G.fillRect(x+w*.72,y,w*.28,h);
 G.fillStyle='rgba(255,255,255,.22)';G.fillRect(x,y,w,Math.min(h*.14,.06));
 G.beginPath();G.rect(x,y,w,h);G.strokeStyle=OL;G.lineWidth=LW;G.lineJoin='round';G.stroke();
}
export function bricks(x,y,w,h,rows,cols){
 G.strokeStyle='rgba(30,22,16,.3)';G.lineWidth=LW*.6;G.beginPath();
 for(let i=0;i<rows;i++){const y0=y+h*i/rows,y1=y+h*(i+1)/rows;if(i){G.moveTo(x,y0);G.lineTo(x+w,y0);}
  for(let j=(i%2)?1:.5;j<cols;j++){const xx=x+w*j/cols;G.moveTo(xx,y0);G.lineTo(xx,y1);}}
 G.stroke();
}
export function star(x,y,r,f,s){G.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;const px=x+Math.cos(a)*rr,py=y+Math.sin(a)*rr;i?G.lineTo(px,py):G.moveTo(px,py);}G.closePath();fillS(f,s);}
export function upgMark(){
 G.beginPath();G.ellipse(0,.52,.62,.2,0,0,TAU);G.strokeStyle='rgba(255,214,80,.95)';G.lineWidth=LW*1.6;G.stroke();
 circ(.58,-.5,.25,'#2a1d16','#ffd84a');star(.58,-.5,.2,'#ffd84a','#8a5a00');
}
export function glow(x,y,r,rgb,a){G.fillStyle='rgba('+rgb+','+a+')';for(let i=3;i>=1;i--){G.globalAlpha=.35;G.beginPath();G.arc(x,y,r*i/3,0,TAU);G.fill();}G.globalAlpha=1;}
export function gem(x,y,k,flash){
 const P=(a,b)=>[x+a*k,y+b*k];
 const t=P(0,-.5),ul=P(-.28,-.2),ur=P(.28,-.2),ll=P(-.22,.3),lr=P(.22,.3),bt=P(0,.48),m=P(0,-.04);
 const fc=(pts,c)=>{G.beginPath();G.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)G.lineTo(pts[i][0],pts[i][1]);G.closePath();G.fillStyle=flash?'#fff':c;G.fill();};
 fc([t,ul,m],'#d2bfff');fc([ul,ll,bt,m],'#8a5cf0');fc([t,ur,m],'#7be8f5');fc([ur,lr,bt,m],'#2ba3cc');
 G.beginPath();G.moveTo(t[0],t[1]);G.lineTo(ul[0],ul[1]);G.lineTo(ll[0],ll[1]);G.lineTo(bt[0],bt[1]);G.lineTo(lr[0],lr[1]);G.lineTo(ur[0],ur[1]);G.closePath();
 G.strokeStyle='#1c1238';G.lineWidth=Math.max(LW*.8,.03);G.lineJoin='round';G.stroke();
 G.beginPath();G.moveTo(ul[0],ul[1]);G.lineTo(m[0],m[1]);G.lineTo(ur[0],ur[1]);G.moveTo(m[0],m[1]);G.lineTo(bt[0],bt[1]);G.strokeStyle='rgba(20,10,50,.5)';G.lineWidth=Math.max(LW*.5,.02);G.stroke();
}

export function setG(v){G=v;}
export function setNOW(v){NOW=v;}
export function setFLASH(v){FLASH=v;}
export function setFROST(v){FROST=v;}
export function setLW(v){LW=v;}
