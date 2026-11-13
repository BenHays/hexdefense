// Wave flow: starting a wave, spawning enemies, and what happens when a wave ends.
// The numbers (how many, how tough, how fast) live in src/data/waves.js and enemies.js.
import { hd, W2 } from './hex.js';
import { MAP_RADIUS, TERRAINS } from './data/terrain.js';
import { STRUCTURES } from './data/structures.js';
import { ENEMIES, ENEMY_PICK_ORDER, DEFAULT_ENEMY } from './data/enemies.js';
import { waveCount, hpMult, easeMult, speedMult, spawnGap, waveGold, RESEARCH_PER_WAVE, FIRST_SPAWN_DELAY,
  SPAWN_RING_MARGIN, SPAWN_ANGLE_STEP, SPAWN_ANGLE_JITTER } from './data/waves.js';
import { st, cells, cellList, view, tech, flt } from './state.js';
import { scanReveal } from './map.js';
import { closeMenu, closeTech } from './ui.js';

// Which enemy type a roll x in [0,1) produces on wave w (see ENEMY_PICK_ORDER in data/enemies.js).
export function pickEnemy(w, x) {
 for (const id of ENEMY_PICK_ORDER) if (w >= ENEMIES[id].firstWave && x < ENEMIES[id].chance) return id;
 return DEFAULT_ENEMY;
}

export function startWave() {
 if (st.phase !== 'build' || st.over) return;
 const w = st.wave, n = waveCount(w); st.queue = [];
 for (let i = 0; i < n; i++) { const x = Math.random(); st.queue.push(pickEnemy(w, x)); }
 st.spawnT = FIRST_SPAWN_DELAY; st.spawnN = 0; st.a0 = Math.random() * Math.PI * 2; st.phase = 'wave'; closeMenu(); closeTech(); view.sel = null;
}

// The ring of hexes enemies spawn on: just beyond the revealed area.
export function spawnRing() {
 let mr = 0; for (const c of cellList) if (c.revealed) { const d = hd(c.q, c.r); if (d > mr) mr = d; }
 const sd = Math.min(MAP_RADIUS, mr + SPAWN_RING_MARGIN);
 return cellList.filter(c => hd(c.q, c.r) === sd);
}
function spawn(t) {
 const ring = spawnRing();
 const ang = st.a0 + st.spawnN * SPAWN_ANGLE_STEP + (Math.random() - .5) * SPAWN_ANGLE_JITTER; st.spawnN++;
 let c = null, bd = 9;
 for (const u of ring) { const p = W2(u.q, u.r); let d = Math.abs(Math.atan2(Math.sin(Math.atan2(p.y, p.x) - ang), Math.cos(Math.atan2(p.y, p.x) - ang))); if (d < bd) { bd = d; c = u; } }
 const p = W2(c.q, c.r), T = ENEMIES[t], w = st.wave;
 const hp = T.hp * hpMult(w) * easeMult(w);
 st.enemies.push({ t, q: c.q, r: c.r, x: p.x, y: p.y, tq: c.q, tr: c.r, fx: p.x, fy: p.y, p: 0, mode: 'idle', tc: null, acd: 0, hp, max: hp, flash: 0, slow: 0, slowF: 1, speed: T.speed * speedMult(w), dmg: T.dmg });
}
// Called every tick during a wave: releases the next queued enemy when its timer runs out.
export function spawnNext(dt) {
 if (st.queue.length) { st.spawnT -= dt; if (st.spawnT <= 0) { spawn(st.queue.shift()); st.spawnT = spawnGap(st.wave); } }
}

export function endWave() {
 const bonus = waveGold(st.wave) + tech('waveGold', 0); st.rp += RESEARCH_PER_WAVE;
 const hy = tech('harvestBonus', 0);
 st.gold += bonus; flt(cells.get('0,0'), '+' + bonus + ' gold', '#f1c84b');
 for (const c of cellList) {
  const y = c.b && STRUCTURES[c.b.type].yield && STRUCTURES[c.b.type].yield[c.terrain];
  if (y) { st[c.terrain] += y + hy; flt(c, '+' + (y + hy) + ' ' + c.terrain, TERRAINS[c.terrain].floatColor); }
 }
 for (const c of cellList) {
  const n = c.b && STRUCTURES[c.b.type].revealPerWave;
  if (n) for (const u of scanReveal(c, n + tech('scanBonus', 0))) flt(u, 'revealed', '#8cf');
 }
 st.wave++; st.phase = 'build';
}
