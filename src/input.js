// Pointer input: tap to select / build, drag to pan, wheel and pinch to zoom.
import { cv } from './dom.js';
import { L, cam, clampCam, zoomAt, pick, resize } from './camera.js';
import { st, view } from './state.js';
import { openMenu, closeMenu } from './ui.js';

function ptr(ev){const r=cv.getBoundingClientRect();return {x:ev.clientX-r.left,y:ev.clientY-r.top};}
const ptrs=new Map(); let moved=false, lastPinch=0;
const TAP_PX=8;
function endPtr(ev,cancel){
 const e=ptrs.get(ev.pointerId);if(!e)return;
 const p=ptr(ev);const wasSingle=ptrs.size===1;
 ptrs.delete(ev.pointerId);
 for(const o of ptrs.values()){o.sx=o.x;o.sy=o.y;}
 if(wasSingle&&!moved&&!cancel)tap(p.x,p.y,e.type);
}
function tap(px,py,type){
 if(st.over)return;const c=pick(px,py);
 view.hover=type==='mouse'?c:null;
 if(!c||!c.revealed||c.terrain==='castle'){view.sel=null;closeMenu();return;}
 if(st.phase!=='build'){closeMenu();view.sel=c;return;} // wave: only show range
 view.sel=c;openMenu(c,px,py);
}

// Attach the pointer / wheel / resize listeners (called once from main.js).
export function initInput(){
cv.addEventListener('pointerdown',ev=>{
 ev.preventDefault();const p=ptr(ev);
 try{cv.setPointerCapture(ev.pointerId);}catch(e){}
 ptrs.set(ev.pointerId,{x:p.x,y:p.y,sx:p.x,sy:p.y,type:ev.pointerType});
 if(ptrs.size===1)moved=false;
 else{moved=true;closeMenu();const a=[...ptrs.values()];lastPinch=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)||1;}
});
cv.addEventListener('pointermove',ev=>{
 const p=ptr(ev);const e=ptrs.get(ev.pointerId);
 if(ev.pointerType==='mouse'&&!e)view.hover=pick(p.x,p.y);
 if(!e)return;
 if(ptrs.size===1){
  if(!moved&&Math.hypot(p.x-e.sx,p.y-e.sy)>TAP_PX){moved=true;closeMenu();e.x=e.sx;e.y=e.sy;}
  if(moved){cam.x-=(p.x-e.x)/L.S;cam.y-=(p.y-e.y)/L.S;clampCam();view.hover=null;}
  e.x=p.x;e.y=p.y;
 }else if(ptrs.size===2){
  const a=[...ptrs.values()];const o=a[0]===e?a[1]:a[0];
  const mx0=(e.x+o.x)/2,my0=(e.y+o.y)/2;
  e.x=p.x;e.y=p.y;
  const mx=(e.x+o.x)/2,my=(e.y+o.y)/2,dist=Math.hypot(e.x-o.x,e.y-o.y)||1;
  cam.x-=(mx-mx0)/L.S;cam.y-=(my-my0)/L.S;
  zoomAt(mx,my,dist/lastPinch);lastPinch=dist;
 }
});
cv.addEventListener('pointerup',ev=>endPtr(ev,false));
cv.addEventListener('pointercancel',ev=>endPtr(ev,true));
cv.addEventListener('pointerleave',ev=>{if(ev.pointerType==='mouse')view.hover=null;});
cv.addEventListener('wheel',ev=>{ev.preventDefault();const p=ptr(ev);zoomAt(p.x,p.y,Math.exp(-ev.deltaY*.0015));},{passive:false});
window.addEventListener('resize',resize);
}
