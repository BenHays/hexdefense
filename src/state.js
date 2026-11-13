// Game state and the economy: resources, building / selling / upgrading, tech purchase.
// `st` is the single mutable game-state object (reset in place by newGame, never replaced).
import { W2 } from './hex.js';
import { STRUCTURES, CASTLE, SELL_REFUND } from './data/structures.js';
import { RESOURCES } from './data/terrain.js';
import { TECH_NODES } from './data/tech.js';
import { START_RESOURCES, FREE_SCAN_TOWERS } from './data/waves.js';
import { $ } from './dom.js';
import { reveal, generateMap } from './map.js';
import { cam, updS } from './camera.js';
import { closeMenu, closeTech, renderTech } from './ui.js';

export const st = {};                 // game state (see newGame for the fields)
export const cells = new Map();       // 'q,r' -> cell
export const cellList = [];           // every cell, in generation order
export const world = { d1: new Map(), d2: null, pathDirty: true }; // path fields, see path.js
export const view = { sel: null, hover: null };                     // selected / hovered cell

// ---- tech helpers
export const has = id => !!(st && st.tech && st.tech[id]);
// Value of an effect parameter from the first owned tech node that defines it, else `def`.
export function tech(effectKey, def) {
 for (const n of TECH_NODES) if (has(n.id) && n.effect && effectKey in n.effect) return n.effect[effectKey];
 return def;
}
export const sightOf = t => (t === 'castle' ? CASTLE.sight : STRUCTURES[t].sight) + tech('sightBonus', 0);
export const isTower = b => !!(b && STRUCTURES[b.type].damage > 0);

export function newGame() {
 generateMap();
 reveal(0, 0, CASTLE.sight, 0);
 for (const k of Object.keys(st)) delete st[k];
 Object.assign(st, { gold: START_RESOURCES.gold, wood: START_RESOURCES.wood, stone: START_RESOURCES.stone, crystal: START_RESOURCES.crystal,
  rp: 0, tech: {}, maxhp: CASTLE.maxHp, shake: 0, fx: [], coins: [], hp: CASTLE.maxHp, wave: 1, phase: 'build', freeScan: FREE_SCAN_TOWERS,
  enemies: [], projs: [], floats: [], queue: [], spawnT: 0, a0: 0, spawnN: 0, speed: 1, over: false, flash: 0, time: 0 });
 view.sel = null; view.hover = null; closeMenu(); closeTech(); $('over').style.display = 'none';
 cam.x = 0; cam.y = 0; cam.z = 1; world.pathDirty = true; updS();
}

// ---- costs
export function costOf(t) { const T = STRUCTURES[t], k = tech('costMult', 1), o = {};
 for (const r of RESOURCES) o[r] = T.cost[r] ? Math.max(1, Math.round(T.cost[r] * k)) : 0; return o; }
export function canPay(o) { return st.gold >= (o.gold || 0) && st.wood >= (o.wood || 0) && st.stone >= (o.stone || 0) && st.crystal >= (o.crystal || 0); }
export function pay(o) { st.gold -= o.gold || 0; st.wood -= o.wood || 0; st.stone -= o.stone || 0; st.crystal -= o.crystal || 0; }
export function afford(t) { return canPay(costOf(t)); }
export function fmt(o) { const a = []; if (o.gold) a.push(o.gold + 'g'); if (o.wood) a.push(o.wood + 'w'); if (o.stone) a.push(o.stone + 's'); if (o.crystal) a.push(o.crystal + 'c'); return a.join(' ') || 'free'; }
export function costStr(t) { return fmt(costOf(t)); }
export function refundOf(s) {
 return { gold: Math.floor(s.gold * SELL_REFUND), wood: Math.floor(s.wood * SELL_REFUND), stone: Math.floor(s.stone * SELL_REFUND), crystal: Math.floor((s.crystal || 0) * SELL_REFUND) };
}

export function flt(c, txt, col) { const p = W2(c.q, c.r); st.floats.push({ x: p.x, y: p.y, txt, col, t: 0 }); }

// ---- actions
export function build(c, t) {
 if (st.phase !== 'build' || st.over) return false;
 if (!c || !c.revealed || c.b || c.terrain === 'castle') return false;
 const T = STRUCTURES[t];
 if (!T.allowedTerrain.includes(c.terrain)) return false;
 let free = false;
 if (t === 'scan' && st.freeScan > 0) free = true; else if (!afford(t)) return false;
 const sp = { gold: 0, wood: 0, stone: 0, crystal: 0 };
 if (!free) { const co = costOf(t); pay(co); Object.assign(sp, co); }
 else st.freeScan--;
 c.b = { type: t, hp: T.hp, max: T.hp, upg: 0, cd: .3, flash: 0, spent: sp, q0: c.q * 1.7 + c.r * .9 };
 reveal(c.q, c.r, sightOf(t), 1.5);
 world.pathDirty = true;
 return true;
}
export function sell(c) {
 if (st.phase !== 'build' || !c.b) return;
 const { gold: g, wood: w, stone: sn, crystal: cr } = refundOf(c.b.spent);
 st.gold += g; st.wood += w; st.stone += sn; st.crystal += cr;
 flt(c, 'sold +' + g + 'g' + (w ? ' +' + w + 'w' : '') + (sn ? ' +' + sn + 's' : '') + (cr ? ' +' + cr + 'c' : ''), '#fff'); c.b = null; world.pathDirty = true; }
export function upgrade(c) { const b = c.b;
 if (st.phase !== 'build' || !b || b.upg || !isTower(b) || !canPay(STRUCTURES[b.type].upgrade.cost)) return false;
 const u = STRUCTURES[b.type].upgrade.cost; pay(u); for (const k in u) b.spent[k] = (b.spent[k] || 0) + u[k]; b.upg = 1; return true; }

export function gameOver() { st.over = true; st.phase = 'over'; $('overt').textContent = 'Waves survived: ' + (st.wave - 1); $('over').style.display = 'flex'; closeMenu(); }

// ---- tech tree
export const techNode = id => TECH_NODES.find(n => n.id === id) || null;
export function techState(id) { const n = techNode(id); if (has(id)) return 'own'; if (n.requires && !has(n.requires)) return 'lock'; return st.rp >= n.cost ? 'av' : 'poor'; }
export function buyTech(id) {
 if (st.phase !== 'build' || st.over) return false; const n = techNode(id); if (!n) return false;
 const s = techState(id); if (s !== 'av') return false;
 st.rp -= n.cost; st.tech[id] = 1;
 const ef = n.effect || {};
 if (ef.sightBonus) { reveal(0, 0, sightOf('castle'), 1.5); for (const c of cellList) if (c.b) reveal(c.q, c.r, sightOf(c.b.type), 1.5); }
 if (ef.maxHp) { st.maxhp += ef.maxHp; st.hp = Math.min(st.maxhp, st.hp + (ef.heal || 0)); }
 renderTech(); return true;
}
