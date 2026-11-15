// Wave flow: starting a wave, spawning enemies, and what happens when a wave ends.
// The numbers (how many, how tough, how fast) live in src/data/waves.js and enemies.js.
import { hd, W2, SQ3 } from './hex.js';
import { MAP_RADIUS, TERRAINS } from './data/terrain.js';
import { STRUCTURES } from './data/structures.js';
import { ENEMIES, DEFAULT_ENEMY } from './data/enemies.js';
import { waveCount, hpMult, easeMult, speedMult, spawnGap, waveGold, RESEARCH_PER_WAVE, FIRST_SPAWN_DELAY,
  SPAWN_RING_MARGIN, SPAWN_ANGLE_STEP, SPAWN_ANGLE_JITTER, BOSS_EVERY, INTRO_RAMP_WAVES, INTRO_MIN, SPECIAL_CAP,
  BOSS_HP_PER_BOSS } from './data/waves.js';
import { st, cells, cellList, view, tech, flt, world } from './state.js';
import { key } from './hex.js';
import { scanReveal } from './map.js';
import { closeMenu, closeTech, showIntro } from './ui.js';

// What wave w contains: { type: slots }. A slot is one enemy, or one pack for pack enemies.
// New types join on their firstWave and grow to their `share` over INTRO_RAMP_WAVES waves.
export function waveComposition(w) {
 const n = waveCount(w), out = {}; let used = 0;
 const specials = Object.values(ENEMIES).filter(T => !T.boss && T.id !== DEFAULT_ENEMY && w >= T.firstWave);
 const want = {}; let sum = 0;
 for (const T of specials) {
  const ramp = Math.min(1, (w - T.firstWave + 1) / INTRO_RAMP_WAVES);
  want[T.id] = Math.max(w === T.firstWave ? INTRO_MIN : 1, n * T.share * ramp); sum += want[T.id];
 }
 const cap = Math.floor(n * SPECIAL_CAP), scale = sum > cap ? cap / sum : 1; // too many specials: shrink them all evenly
 for (const T of specials) { const k = Math.max(1, Math.round(want[T.id] * scale)); out[T.id] = k; used += k; }
 out[DEFAULT_ENEMY] = n - used;
 for (const T of Object.values(ENEMIES)) if (T.boss && w >= T.firstWave && w % BOSS_EVERY === 0) out[T.id] = 1;
 return out;
}
// Enemy types that appear for the first time on wave w.
export const newTypes = w => Object.keys(waveComposition(w)).filter(t => ENEMIES[t].firstWave === w);

export function startWave() {
 if (st.phase !== 'build' || st.over) return;
 const w = st.wave, comp = waveComposition(w); st.queue = []; const bosses = [];
 for (const t in comp) for (let i = 0; i < comp[t]; i++) (ENEMIES[t].boss ? bosses : st.queue).push(t);
 for (let i = st.queue.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [st.queue[i], st.queue[j]] = [st.queue[j], st.queue[i]]; }
 st.queue.push(...bosses);
 st.spawnT = FIRST_SPAWN_DELAY; st.spawnN = 0; st.a0 = Math.random() * Math.PI * 2; st.phase = 'wave'; closeMenu(); closeTech(); view.sel = null;
}

// The ring of hexes enemies spawn on: just beyond the revealed area.
export function spawnRing() {
 let mr = 0; for (const c of cellList) if (c.revealed) { const d = hd(c.q, c.r); if (d > mr) mr = d; }
 const sd = Math.min(MAP_RADIUS, mr + SPAWN_RING_MARGIN);
 return cellList.filter(c => hd(c.q, c.r) === sd);
}
function spawn(t) {
 const all = spawnRing(), open = all.filter(c => world.d1.has(key(c.q, c.r)));
 const ring = open.length ? open : all;
 const ang = st.a0 + st.spawnN * SPAWN_ANGLE_STEP + (Math.random() - .5) * SPAWN_ANGLE_JITTER; st.spawnN++;
 let c = null, bd = 9;
 for (const u of ring) { const p = W2(u.q, u.r); let d = Math.abs(Math.atan2(Math.sin(Math.atan2(p.y, p.x) - ang), Math.cos(Math.atan2(p.y, p.x) - ang))); if (d < bd) { bd = d; c = u; } }
 const p = W2(c.q, c.r), T = ENEMIES[t], w = st.wave;
 let hp = T.hp * hpMult(w) * easeMult(w);
 if (T.boss) hp *= 1 + BOSS_HP_PER_BOSS * (Math.floor(w / BOSS_EVERY) - 1);
 const n = T.pack || 1, jit = n > 1 ? 0.45 : 0.15;
 for (let i = 0; i < n; i++) {
  const jx = (Math.random() - .5) * 2 * jit, jy = (Math.random() - .5) * 2 * jit;
  st.enemies.push({ t, q: c.q, r: c.r, x: p.x + jx, y: p.y + jy, jx, jy, tq: c.q, tr: c.r, fx: p.x + jx, fy: p.y + jy, p: 0, mode: 'idle', tc: null, acd: 0,
   hp, max: hp, flash: 0, slow: 0, slowF: 1, speed: T.speed * speedMult(w), dmg: T.dmg, fly: !!T.flying, armor: T.armor || 0, hcd: T.heal ? T.heal.every : 0 });
 }
 if (T.boss) { st.banner = { txt: T.name + ' approaches!', t: 0 }; st.shake = .4; }
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
 world.pathDirty = true; showIntro();
}
