// Enemy pathing. Distance fields are measured from the castle:
//  d1  plain BFS over hexes that are not blocked by walls (what enemies follow normally)
//  d2  Dijkstra where walls are passable but expensive; used only when walls cut the castle off
import { DIRS, key } from './hex.js';
import { STRUCTURES } from './data/structures.js';
import { cells, cellList, world } from './state.js';

export const blocksPath = c => !!(c.b && STRUCTURES[c.b.type].blocksPath);

export function fields() {
 world.d1 = new Map(); const d1 = world.d1, q = [cells.get('0,0')]; d1.set('0,0', 0);
 for (let i = 0; i < q.length; i++) { const c = q[i]; const d = d1.get(key(c.q, c.r));
  for (const dd of DIRS) { const n = cells.get(key(c.q + dd[0], c.r + dd[1]));
   if (!n || d1.has(key(n.q, n.r)) || blocksPath(n)) continue;
   d1.set(key(n.q, n.r), d + 1); q.push(n); } }
 // wall connection mask (which neighbours are walls too), used only for drawing
 for (const c of cellList) if (blocksPath(c)) { let m = 0; for (let i = 0; i < 6; i++) { const n = c.nb[i]; if (n && blocksPath(n)) m |= 1 << i; } c.b.wm = m; }
 world.d2 = null;
}
export function fields2() {
 const d2 = new Map(); world.d2 = d2; cellList.forEach(c => d2.set(key(c.q, c.r), Infinity)); d2.set('0,0', 0);
 const done = new Set();
 for (;;) { let best = null, bd = Infinity;
  for (const c of cellList) { const k = key(c.q, c.r); if (!done.has(k) && d2.get(k) < bd) { bd = d2.get(k); best = c; } }
  if (!best) break; done.add(key(best.q, best.r));
  for (const dd of DIRS) { const n = cells.get(key(best.q + dd[0], best.r + dd[1])); if (!n) continue;
   const cost = blocksPath(n) ? STRUCTURES[n.b.type].pathCost : 1; const k = key(n.q, n.r);
   if (bd + cost < d2.get(k)) d2.set(k, bd + cost); } }
}

// The neighbouring cell an enemy standing on (q, r) should step to next (or null).
export function nextStep(q, r) {
 const map = world.d1.has(key(q, r)) ? world.d1 : (world.d2 || (fields2(), world.d2));
 let best = null, bd = Infinity;
 for (const dd of DIRS) { const n = cells.get(key(q + dd[0], r + dd[1])); if (!n) continue;
  const v = map.get(key(n.q, n.r)); if (v !== undefined && v < bd) { bd = v; best = n; } }
 return best;
}
