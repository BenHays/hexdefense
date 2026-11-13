// Camera and screen layout: world <-> screen conversion, zoom, canvas sizing.
import { SQ3, key, worldToHex } from './hex.js';
import { MAP_RADIUS } from './data/terrain.js';
import { cv, $ } from './dom.js';
import { cells } from './state.js';

export const BASE = 30; // pixels per hex radius at zoom 1
export const L = { S: BASE, w: 0, h: 0, dpr: 1 }; // S = current pixels per hex radius
export const cam = { x: 0, y: 0, z: 1 };

export function updS() { L.S = BASE * cam.z; }
export function clampCam() { const m = MAP_RADIUS * SQ3, d = Math.hypot(cam.x, cam.y); if (d > m) { cam.x *= m / d; cam.y *= m / d; } }
export function resize() {
 const w = $('wrap'), dpr = window.devicePixelRatio || 1;
 L.w = w.clientWidth; L.h = w.clientHeight; cv.width = L.w * dpr; cv.height = L.h * dpr; L.dpr = dpr; updS();
}
export const scr = (x, y) => ({ x: L.w / 2 + (x - cam.x) * L.S, y: L.h / 2 + (y - cam.y) * L.S });
export function zoomAt(px, py, f) {
 const wx = cam.x + (px - L.w / 2) / L.S, wy = cam.y + (py - L.h / 2) / L.S;
 cam.z = Math.max(.5, Math.min(2, cam.z * f)); updS();
 cam.x = wx - (px - L.w / 2) / L.S; cam.y = wy - (py - L.h / 2) / L.S; clampCam();
}
// screen pixel -> cell (or null)
export function pick(px, py) {
 const wx = cam.x + (px - L.w / 2) / L.S, wy = cam.y + (py - L.h / 2) / L.S;
 const [q, r] = worldToHex(wx, wy);
 return cells.get(key(q, r)) || null;
}
