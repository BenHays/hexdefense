// Enemy pathing and the maze rule. Distance fields are measured from the castle:
//  d1  BFS over open hexes. Every structure blocks it, so enemies walk around your buildings
//      (this is the maze). Enemies follow d1 whenever they stand on an open, connected hex.
//  d2  Dijkstra where structures are passable but expensive (they must break through). Used
//      only by an enemy that is cut off, e.g. one that spawned inside a pocket.
// The maze rule: a build is refused if it would leave no open trail from the map edge to the
// castle (see wouldSeal). One trail in total is enough, so funnelling enemies is allowed.
import { DIRS, key, hd } from './hex.js';
import { STRUCTURES } from './data/structures.js';
import { MAP_RADIUS } from './data/terrain.js';
import { cells, cellList, world } from './state.js';

export const blocksPath = c => !!c.b;
const DEFAULT_BREAK_COST = 4;

// Open-hex BFS from the castle. Returns the distance map.
function bfs() {
 const d = new Map(), q = [cells.get('0,0')]; d.set('0,0', 0);
 for (let i = 0; i < q.length; i++) { const c = q[i], dc = d.get(key(c.q, c.r));
  for (const n of c.nb) { if (!n || blocksPath(n)) continue; const k = key(n.q, n.r);
   if (d.has(k)) continue; d.set(k, dc + 1); q.push(n); } }
 return d;
}
const reachesEdge = d => { for (const c of cellList) if (hd(c.q, c.r) === MAP_RADIUS && d.has(key(c.q, c.r))) return true; return false; };

export function fields() {
 world.d1 = bfs();
 // wall connection mask (which neighbours are walls too), used only for drawing
 for (const c of cellList) if (c.b && STRUCTURES[c.b.type].blocksPath) { let m = 0; for (let i = 0; i < 6; i++) { const n = c.nb[i]; if (n && n.b && STRUCTURES[n.b.type].blocksPath) m |= 1 << i; } c.b.wm = m; }
 world.d2 = null;
}

// Would putting a structure on cell c cut the castle off from the map edge?
export function wouldSeal(c) {
 if (!c || c.b) return false;
 c.b = { type: 'wall' };
 const sealed = !reachesEdge(bfs());
 c.b = null;
 return sealed;
}

export function fields2() {
 const d2 = new Map(); world.d2 = d2; cellList.forEach(c => d2.set(key(c.q, c.r), Infinity)); d2.set('0,0', 0);
 const done = new Set();
 for (;;) { let best = null, bd = Infinity;
  for (const c of cellList) { const k = key(c.q, c.r); if (!done.has(k) && d2.get(k) < bd) { bd = d2.get(k); best = c; } }
  if (!best) break; done.add(key(best.q, best.r));
  for (const n of best.nb) { if (!n) continue;
   const cost = n.b ? (STRUCTURES[n.b.type].pathCost || DEFAULT_BREAK_COST) : 1; const k = key(n.q, n.r);
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

// A few sample routes from the spawn ring to the castle, for drawing the maze in the build phase.
export function sampleRoutes(ring, count) {
 const out = [], d1 = world.d1; if (!ring.length) return out;
 for (let i = 0; i < count; i++) {
  let c = ring[Math.floor(i * ring.length / count)]; if (!d1.has(key(c.q, c.r))) continue;
  const route = [c];
  for (let s = 0; s < 400 && !(c.q === 0 && c.r === 0); s++) { c = nextStep(c.q, c.r); if (!c) break; route.push(c); }
  out.push(route);
 }
 return out;
}
