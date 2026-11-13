// Towers, projectiles, enemy movement / attacks, and the per-tick world update.
import { SQ3, W2 } from './hex.js';
import { STRUCTURES } from './data/structures.js';
import { ENEMIES } from './data/enemies.js';
import { st, cellList, world, flt, tech, isTower, gameOver } from './state.js';
import { fields, nextStep } from './path.js';
import { endWave, spawnNext } from './waves.js';

const NONE = {};

// ---- tower numbers (all base values come from src/data/structures.js)
export function tdmg(c) { const b = c.b, T = STRUCTURES[b.type]; let d = T.damage;
 if (T.terrainBonus && c.terrain === T.terrainBonus.terrain) d *= T.terrainBonus.damage;
 if (b.upg) d *= T.upgrade.damageMult; d *= tech('damageMult', 1); return d; }
export const slowDur = c => { const T = STRUCTURES[c.b.type], tb = T.terrainBonus;
 return T.slow.duration * (tb && tb.slowDuration && c.terrain === tb.terrain ? tb.slowDuration : 1) * (c.b.upg ? (T.upgrade.slowDurationMult || 1) : 1); };
export const rangeHex = b => STRUCTURES[b.type].range + tech('rangeBonus', 0);
export const trange = b => rangeHex(b) * SQ3;
// splash radius of a tower type (or of the first splash tower if none is given)
export const splashR = (type) => { const T = type ? STRUCTURES[type] : Object.values(STRUCTURES).find(s => s.splash);
 return T.splash.radius * tech('splashMult', 1); };

// ---- enemies
function decide(e) {
 const best = nextStep(e.q, e.r);
 if (!best) return;
 if (best.b) { e.mode = 'atk'; e.tc = best; e.acd = .3; return; } // only a building on the next step blocks/gets attacked
 e.tq = best.q; e.tr = best.r; e.fx = e.x; e.fy = e.y; e.p = 0; e.mode = 'move';
}
function updEnemy(e, dt) {
 if (e.flash > 0) e.flash -= dt; if (e.slow > 0) e.slow -= dt;
 const sf = e.slow > 0 ? e.slowF : 1;
 e.ph = (e.ph || 0) + dt * (e.mode === 'move' ? e.speed * sf * 6 : 4);
 if (e.mode === 'atk') {
  const c = e.tc;
  if (!c || !c.b) e.mode = 'idle';
  else { e.acd -= dt; if (e.acd <= 0) { e.acd = .8; c.b.hp -= e.dmg; c.b.flash = .12;
   if (c.b.hp <= 0) { flt(c, 'destroyed', '#f66'); c.b = null; world.pathDirty = true; e.mode = 'idle'; } } }
 }
 if (e.mode === 'idle') decide(e);
 if (e.mode === 'move') {
  const to = W2(e.tq, e.tr); e.p += e.speed * sf * dt;
  const k = Math.min(1, e.p); e.x = e.fx + (to.x - e.fx) * k; e.y = e.fy + (to.y - e.fy) * k;
  if (e.p >= 1) { e.q = e.tq; e.r = e.tr; e.x = to.x; e.y = to.y;
   if (e.q === 0 && e.r === 0) { st.hp -= ENEMIES[e.t].castleDmg; st.flash = .3; st.shake = .3; e.dead = true;
    if (st.hp <= 0) { st.hp = 0; gameOver(); } }
   else e.mode = 'idle'; }
 }
}
export function dmgEnemy(e, d) { e.hp -= d; e.flash = .1; if (e.hp <= 0 && !e.dead) { e.dead = true; const b = ENEMIES[e.t].bounty + tech('bountyBonus', 0); st.gold += b; st.floats.push({ x: e.x, y: e.y, txt: '+' + b, col: '#f1c84b', t: 0 });
 const col = ENEMIES[e.t].color; st.fx.push({ k: 'pop', x: e.x, y: e.y, t: 0, life: .4, col });
 if (st.fx.length < 120) for (let i = 0; i < 5; i++) { const a = Math.random() * 6.28, v = .8 + Math.random() * 1.4; st.fx.push({ k: 'p', x: e.x, y: e.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: 0, life: .45, col }); }
 if (st.coins.length < 30) st.coins.push({ x: e.x, y: e.y, t: 0, life: .7 }); } }

// ---- one simulation tick
export function update(dt) {
 st.time += dt; if (st.flash > 0) st.flash -= dt; if (st.shake > 0) st.shake -= dt;
 for (const f of st.fx) f.t += dt; st.fx = st.fx.filter(f => f.t < f.life);
 for (const f of st.coins) f.t += dt; st.coins = st.coins.filter(f => f.t < f.life);
 for (const c of cellList) { if (c.newT > 0) c.newT -= dt; if (c.b && c.b.flash > 0) c.b.flash -= dt; if (c.b && c.b.fk > 0) c.b.fk = Math.max(0, c.b.fk - dt * STRUCTURES[c.b.type].recoilDecay); }
 if (st.over) return;
 if (world.pathDirty) { fields(); world.pathDirty = false; }
 if (st.phase === 'wave') {
  spawnNext(dt);
  for (const e of st.enemies) if (!e.dead) updEnemy(e, dt);
  for (const c of cellList) { const b = c.b; if (!isTower(b)) continue;
   const T = STRUCTURES[b.type];
   b.cd -= dt; if (b.cd > 0) continue;
   const p = W2(c.q, c.r), rg = trange(b); let tg = null, bd = 1e9;
   for (const e of st.enemies) { if (e.dead) continue; const d = Math.hypot(e.x - p.x, e.y - p.y);
    if (d <= rg) { const cd = Math.hypot(e.x, e.y) + (T.slow && e.slow > 0 ? 100 : 0); if (cd < bd) { bd = cd; tg = e; } } }
   if (!tg) continue;
   const pj = T.projectile;
   b.cd = T.cooldown / (tech('fireRate', NONE)[b.type] || 1);
   st.projs.push({ x0: p.x, y0: p.y, x1: tg.x, y1: tg.y, t: 0, dur: pj.flight, dmg: tdmg(c), splash: !!T.splash, splashR: T.splash ? splashR(b.type) : 0, kind: pj.kind, tg,
    slow: T.slow ? slowDur(c) : 0, slowF: T.slow ? T.slow.factor : 1 });
   b.aim = Math.atan2(tg.y - p.y, tg.x - p.x); b.dx = Math.cos(b.aim) < 0 ? -1 : 1; b.fk = 1;
  }
 }
 for (const pr of st.projs) { pr.t += dt;
  if (pr.kind !== 'shell' && !pr.tg.dead) { pr.x1 = pr.tg.x; pr.y1 = pr.tg.y; }
  if (pr.t >= pr.dur && !pr.done) { pr.done = true;
   if (pr.splash) { for (const e of st.enemies) if (!e.dead && Math.hypot(e.x - pr.x1, e.y - pr.y1) <= pr.splashR) dmgEnemy(e, pr.dmg);
    st.floats.push({ x: pr.x1, y: pr.y1, txt: '', ring: 1, col: '#fa6', t: 0, rad: pr.splashR }); st.fx.push({ k: 'dust', x: pr.x1, y: pr.y1, t: 0, life: .55 }); }
   else if (!pr.tg.dead) { if (pr.slow) { pr.tg.slow = Math.max(pr.tg.slow, pr.slow); pr.tg.slowF = pr.slowF; } dmgEnemy(pr.tg, pr.dmg); } }
 }
 st.projs = st.projs.filter(p => !p.done);
 st.enemies = st.enemies.filter(e => !e.dead);
 st.floats.forEach(f => f.t += dt); st.floats = st.floats.filter(f => f.t < (f.ring ? .35 : 1.4));
 if (st.phase === 'wave' && !st.queue.length && !st.enemies.length) endWave();
}
