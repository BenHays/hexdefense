# Hexkeep

A small hex-grid castle defense game that runs in the browser (canvas, no frameworks, no dependencies).
Explore the fog around your castle, build towers and harvesters, survive waves of enemies, and spend
research points on tech.

## How to play

- Open `dist/hexkeep.html` in a browser (double-click it; it works from `file://`).
- **Build phase:** tap/click a revealed hex to open the build menu (build, upgrade, sell). Drag to pan,
  wheel or pinch to zoom, "Center" recentres the camera. Your first Scan tower is free.
- Press **Start Wave**. Enemies arrive from all sides and walk to the castle around your buildings
  (every structure blocks them, so walls build a maze; a build that would seal the castle is refused).
  Bats fly over the maze. Towers shoot them. Building and selling are only possible between waves.
- After each wave you get gold, harvester resources and 1 research point for the **Tech** panel.
- Towers get +50% on their matching terrain (archer on wood, catapult on stone, mage on crystal).
  Harvesters only work on wood, stone and crystal hexes. The game ends when the castle HP hits 0.

## Run (development)

ES modules do not load over `file://`, so the dev `index.html` needs a local web server:

```
python3 -m http.server 8000     # or: npx serve
# then open http://localhost:8000/
```

`window.game` is available in the browser console for debugging (`game.st()`, `game.build(q, r, 'archer')`,
`game.step(5)`, `game.start()`, `game.buyTech('e1')`, ...).

## Build the single-file version

```
node tools/build.mjs
```

This writes `dist/hexkeep.html`, one self-contained file (CSS and all modules inlined) that works from
`file://` and is what gets published. `dist/hexkeep.html` is committed so the game is always playable;
rebuild and commit it after changing anything in `src/`. The bundler has no dependencies; it concatenates
modules in dependency order, so two modules must not declare the same top-level name (the build tells you).
Use plain named imports (`import { a, b } from './x.js'`; no `as`, no `import *`).

## Editing the game without touching engine code

All balance numbers live in `src/data/`. Edit, run `node tools/build.mjs` (or just reload the dev server), play.

### Change or add a structure (`src/data/structures.js`)
- **Change a number:** edit the entry, e.g. `archer.damage`, `archer.cost`, `cat.splash.radius`,
  `mage.slow.duration`. Field meanings are documented at the top of the file.
- **Add a structure:** add a new entry (copy a similar one: a tower, harvester or wall) with a unique `id`.
  It appears in the build menu automatically. Set `icon` to an existing art id (`archer`, `cat`, `mage`,
  `scan`, `harv`, `wall`) to reuse that drawing. A brand-new look needs a drawer in
  `src/render/structures.js` (add it to `STRUCTURE_ART`). A structure with `damage` behaves as a tower;
  `yield` makes it a harvester; `blocksPath` makes it a wall.
- Starting castle HP/sight and the sell refund are exported from the same file.

### Enemies (`src/data/enemies.js`)
`hp`, `speed`, `armor`, `flying`, `heal`, `pack`, `boss`, `dmg` (vs structures), `castleDmg`, `bounty`,
`firstWave`, `share` (how much of a wave it takes), `intro`/`counter` (the new-enemy card), size and colours.
Wave make-up is `waveComposition` in `src/waves.js`, tuned by the constants at the end of `src/data/waves.js`.
New look = new drawer in `ENEMY_ART` (`src/render/enemies.js`); otherwise reuse an existing `art` id.

### Tech (`src/data/tech.js`)
Nodes have `cost`, `requires`, `txt` and an `effect` object (`damageMult`, `rangeBonus`, `costMult`, ...;
the full list is in the file header). Re-assigning or tuning existing effect keys needs no code.

### Waves and economy (`src/data/waves.js`)
Start resources, income per wave, `waveCount(w)`, `hpMult(w)`, spawn gap and other named constants.
Map size, terrain colours and generation rules (e.g. crystal needs distance >= 6) are in `src/data/terrain.js`.

## Code map

```
index.html            page shell (loads src/main.js as a module)
src/style.css         all CSS
src/data/             structures.js enemies.js tech.js waves.js terrain.js   (plain data tables)
src/hex.js            hex grid maths (distance, world <-> hex)
src/map.js            map generation, fog / vision reveal, scan-tower revealing
src/path.js           enemy pathing (BFS distance fields, wall fallback)
src/state.js          game state `st`, costs, build / sell / upgrade, tech purchase
src/combat.js         tower targeting, projectiles, enemy movement and attacks, per-tick update
src/waves.js          starting a wave, spawning, end-of-wave income
src/camera.js         camera, zoom, screen <-> world
src/input.js          pointer / wheel / pinch handling, tap
src/ui.js             HUD, build menu, tech panel
src/render/           prims (drawing helpers) tiles (cached terrain) structures enemies effects icons scene (draw loop)
src/main.js           boot, frame loop, window.game
tools/build.mjs      bundler -> dist/hexkeep.html
```
