// Hex grid maths. Axial coordinates (q, r); pointy-top hexes with radius 1 in world space.
export const SQ3 = Math.sqrt(3);
export const DIRS = [[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
// Screen-space angle of each of the six neighbour directions (matches DIRS order).
export const ANG = [0,-Math.PI/3,-2*Math.PI/3,Math.PI,2*Math.PI/3,Math.PI/3];
export const key = (q, r) => q + ',' + r;
// axial -> world position
export const W2 = (q, r) => ({ x: SQ3 * (q + r / 2), y: 1.5 * r });
// hex distance from the origin (the castle)
export const hd = (q, r) => Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r));
// world position -> nearest hex [q, r]
export function worldToHex(wx, wy) {
  const fq = SQ3 / 3 * wx - wy / 3, fr = 2 / 3 * wy;
  let x = fq, z = fr, y = -x - z;
  let rx = Math.round(x), ry = Math.round(y), rz = Math.round(z);
  const dx = Math.abs(rx - x), dy = Math.abs(ry - y), dz = Math.abs(rz - z);
  if (dx > dy && dx > dz) rx = -ry - rz; else if (dy > dz) ry = -rx - rz; else rz = -rx - ry;
  return [rx, rz];
}
