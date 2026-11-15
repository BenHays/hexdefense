// Entry point: boots the game, runs the frame loop and exposes `window.game` for debugging/tests.
import { key, W2 } from './hex.js';
import { cells, world, st, has, costOf, techState, build, upgrade, sell, newGame, buyTech } from './state.js';
import { resize, cam, scr } from './camera.js';
import { cv } from './dom.js';
import { update, tdmg, rangeHex } from './combat.js';
import { startWave, spawnRing, waveComposition } from './waves.js';
import { draw } from './render/scene.js';
import { hud, bindUI, openTech, closeTech } from './ui.js';
import { initInput } from './input.js';
import { icoEl } from './render/icons.js';
import { waveCount, hpMult } from './data/waves.js';
import { TECH } from './data/tech.js';

let last = performance.now();
function frame(t) {
 let dt = Math.min(.1, (t - last) / 1000) * st.speed; last = t;
 try { const n = Math.max(1, Math.ceil(dt / .033)); for (let i = 0; i < n; i++) update(dt / n); draw(); hud(); } catch (e) { console.error(e); }
 requestAnimationFrame(frame);
}

bindUI(); initInput();
newGame(); resize(); document.querySelectorAll('[data-ic]').forEach(e => e.appendChild(icoEl(e.dataset.ic, 20))); requestAnimationFrame(frame);

window.game = { st: () => st, cells: () => cells, cam: () => cam, build: (q, r, t) => build(cells.get(key(q, r)), t), upgrade: (q, r) => upgrade(cells.get(key(q, r))),
 sell: (q, r) => sell(cells.get(key(q, r))), start: startWave,
 step: (sec) => { const n = Math.ceil(sec / .033); for (let i = 0; i < n; i++) update(sec / n); },
 screen: (q, r) => { const p = W2(q, r), s = scr(p.x, p.y), b = cv.getBoundingClientRect(); return { x: b.left + s.x, y: b.top + s.y }; },
 spawnRing, waveCount, hpMult, waveComposition, world: () => world, newGame, buyTech, openTech, closeTech, has, costOf, techState, tdmg: (q, r) => tdmg(cells.get(key(q, r))), rangeHex: (q, r) => rangeHex(cells.get(key(q, r)).b), TECH };
