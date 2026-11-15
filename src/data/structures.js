// Every structure the player can build, one entry per structure.
// This file is plain data: change a number, rebuild (`node tools/build.mjs`), play.
//
//  id             key used in code (must match the object key)
//  name           shown in menus
//  description    tooltip text
//  icon           which drawing to use (see STRUCTURE_ART in src/render/structures.js)
//  cost           { gold, wood, stone, crystal } - omitted resources cost 0
//  hp             structure hit points
//  sight          hexes revealed around it when built
//  allowedTerrain terrains it can be built on
//  --- towers only (a structure with `damage` is a tower) ---
//  range          hexes
//  damage         damage per shot
//  cooldown       seconds between shots (the "fire rate")
//  projectile     { kind: 'arrow' | 'bolt' | 'shell', flight: seconds }; arrows and bolts home in
//  recoilDecay    speed of the firing animation (visual only)
//  splash         { radius } area damage around the impact (radius in world units, hex centres are ~1.73 apart)
//  slow           { duration: seconds, factor: speed multiplier while slowed }
//  terrainBonus   { terrain, damage: multiplier, slowDuration: multiplier } when built on that terrain
//  upgrade        { cost, damageMult, slowDurationMult, text } one upgrade level
//  pierce         true: ignores enemy armor
//  hitsAir        false: cannot target flying enemies (default true)
//  targeting      'first' (closest to the castle, default) or 'priority' (shamans/bosses first,
//                 then the toughest enemy in range)
//  counters       short "good against" line for the build menu
//  --- other ---
//  yield          harvester income per wave, per terrain
//  revealPerWave  scan tower: hexes revealed after every wave
//  blocksPath     drawn as a wall segment (every structure blocks enemies, see src/path.js)
//  pathCost       how reluctant a cut-off enemy is to break through it (default 4)

const ANY = ['plain', 'wood', 'stone', 'crystal'];

export const STRUCTURES = {
  scan: {
    id: 'scan', name: 'Scan tower', icon: 'scan',
    description: 'sight 2; reveals 2 hexes each wave',
    cost: { gold: 15 }, hp: 30, sight: 2,
    allowedTerrain: ANY,
    revealPerWave: 2,
  },
  harv: {
    id: 'harv', name: 'Harvester', icon: 'harv',
    description: 'resource hex only, +4/wave (+2 crystal)',
    cost: { gold: 10 }, hp: 35, sight: 1,
    allowedTerrain: ['wood', 'stone', 'crystal'],
    blockedHint: 'wood/stone only',
    yield: { wood: 4, stone: 4, crystal: 2 },
    terrainNote: { crystal: '+2 crystal' },
  },
  archer: {
    id: 'archer', name: 'Archer tower', icon: 'archer',
    description: 'fast, range 5, hits flyers; wood hex +50%',
    counters: 'runners, bats',
    cost: { gold: 10, wood: 5 }, hp: 40, sight: 1,
    allowedTerrain: ANY,
    range: 5, damage: 5, cooldown: 0.45,
    projectile: { kind: 'arrow', flight: 0.18 },
    recoilDecay: 4,
    terrainBonus: { terrain: 'wood', damage: 1.5 },
    upgrade: { cost: { gold: 10, stone: 5 }, damageMult: 1.6, text: '+60% dmg' },
  },
  cat: {
    id: 'cat', name: 'Catapult', icon: 'cat',
    description: 'splash, range 6, ground only; stone hex +50%',
    counters: 'swarms, armor',
    hitsAir: false,
    cost: { gold: 15, stone: 5 }, hp: 40, sight: 1,
    allowedTerrain: ANY,
    range: 6, damage: 14, cooldown: 2.0,
    projectile: { kind: 'shell', flight: 0.7 },
    recoilDecay: 1.5,
    splash: { radius: 1.1 },
    terrainBonus: { terrain: 'stone', damage: 1.5 },
    upgrade: { cost: { gold: 10, stone: 5 }, damageMult: 1.6, text: '+60% dmg' },
  },
  mage: {
    id: 'mage', name: 'Mage tower', icon: 'mage',
    description: 'slows, pierces armor, range 4; crystal hex +50%',
    counters: 'brutes, runners',
    pierce: true,
    cost: { gold: 15, crystal: 4 }, hp: 35, sight: 1,
    allowedTerrain: ANY,
    range: 4, damage: 3, cooldown: 1.1,
    projectile: { kind: 'bolt', flight: 0.3 },
    recoilDecay: 4,
    slow: { duration: 2, factor: 0.5 },
    terrainBonus: { terrain: 'crystal', damage: 1.5, slowDuration: 1.5 },
    upgrade: { cost: { gold: 10, crystal: 3 }, damageMult: 1.6, slowDurationMult: 1.5, text: '+60% dmg, +50% slow' },
  },
  ballista: {
    id: 'ballista', name: 'Ballista', icon: 'ballista',
    description: 'huge range 8, pierces armor, shoots shamans and bosses first',
    counters: 'shamans, bosses',
    cost: { gold: 25, wood: 5, stone: 5 }, hp: 45, sight: 1,
    allowedTerrain: ANY,
    range: 8, damage: 28, cooldown: 2.6, pierce: true, targeting: 'priority',
    projectile: { kind: 'spear', flight: 0.35 },
    recoilDecay: 1.2,
    terrainBonus: { terrain: 'stone', damage: 1.3 },
    upgrade: { cost: { gold: 20, stone: 5 }, damageMult: 1.6, text: '+60% dmg' },
  },
  wall: {
    id: 'wall', name: 'Wall', icon: 'wall',
    description: 'cheap; enemies walk around it. Build a maze!',
    counters: 'all walkers (longer route, more shots)',
    cost: { gold: 2 }, hp: 60, sight: 1,
    allowedTerrain: ANY,
    blocksPath: true, pathCost: 6,
  },
};

// The castle is not buildable, but its numbers live here too.
export const CASTLE = { sight: 2, maxHp: 20 };

// Fraction of the paid cost refunded (rounded down per resource) when selling.
export const SELL_REFUND = 0.5;
