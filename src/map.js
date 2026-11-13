// Map generation, vision / fog of war and scan-tower revealing.
import { DIRS, key, hd } from './hex.js';
import { MAP_RADIUS, MAP_GEN } from './data/terrain.js';
import { cells, cellList } from './state.js';

export const rnd = a => a[Math.floor(Math.random() * a.length)];

// Reveal every hex within `rad` of (q0, r0). `flash` is how long the new hex glows.
export function reveal(q0, r0, rad, flash) {
 for (let dq = -rad; dq <= rad; dq++) for (let dr = Math.max(-rad, -dq - rad); dr <= Math.min(rad, -dq + rad); dr++) {
  const c = cells.get(key(q0 + dq, r0 + dr)); if (c && !c.revealed) { c.revealed = true; c.newT = flash || 1.5; }
 }
}

function rollTerrain(x) {
 for (const rule of MAP_GEN.rolls) if (x < rule.below) return rule.terrain;
 return 'plain';
}

// Fill `cells` / `cellList` with a fresh random map (nothing revealed yet).
export function generateMap() {
 cells.clear(); cellList.length = 0;
 const R = MAP_RADIUS, cry = MAP_GEN.crystal;
 for (let q = -R; q <= R; q++) for (let r = Math.max(-R, -q - R); r <= Math.min(R, -q + R); r++) {
  const x = Math.random();
  const c = { q, r, terrain: (hd(q, r) >= cry.minDistance && Math.random() < cry.chance) ? 'crystal' : rollTerrain(x), revealed: false, b: null, newT: 0 };
  cells.set(key(q, r), c); cellList.push(c);
 }
 // v: tile art variant, nb: the six neighbours (null off the map)
 for (const c of cellList) { c.v = ((c.q * 73 + c.r * 151 + c.q * c.r * 17) & 255) % 4; c.nb = DIRS.map(d => cells.get(key(c.q + d[0], c.r + d[1])) || null); }
 const cc = cells.get('0,0'); cc.terrain = 'castle';
 const g = MAP_GEN.guaranteedNearCastle;
 const near = cellList.filter(c => c !== cc && hd(c.q, c.r) <= g.radius);
 const ensure = t => { if (!near.some(c => c.terrain === t)) { rnd(near.filter(c => c.terrain === 'plain')).terrain = t; } };
 for (const t of g.terrains) ensure(t);
}

// Reveal the `count` nearest hidden hexes around a scan tower's cell (ties broken randomly).
export function scanReveal(c, count) {
 const out = [];
 for (let k = 0; k < count; k++) {
  let best = [], bd = 1e9;
  for (const u of cellList) { if (u.revealed) continue; const d = hd(u.q - c.q, u.r - c.r); if (d < bd) { bd = d; best = [u]; } else if (d === bd) best.push(u); }
  if (best.length) { const u = rnd(best); u.revealed = true; u.newT = 2.5; out.push(u); }
 }
 return out;
}
