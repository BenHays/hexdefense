// The tech tree. Three branches of three nodes, each node requires the previous one.
//
// Node fields:
//   id        unique id
//   branch    id of the branch it belongs to
//   name      shown on the tree
//   cost      research points
//   requires  id of the node that must be owned first (or null)
//   txt       effect description shown to the player
//   icon      icon id (see ICONS in src/render/icons.js)
//   effect    parameters read by the engine through tech('key', default). The keys are:
//     harvestBonus   +N to every harvester yield
//     waveGold       +N castle gold per wave
//     costMult       multiplier on all building costs
//     damageMult     multiplier on all tower damage
//     rangeBonus     +N hexes of tower range
//     splashMult     multiplier on splash radius
//     fireRate       { towerId: multiplier } faster fire for those towers
//     sightBonus     +N sight on every building and the castle
//     scanBonus      +N extra hexes revealed by scan towers per wave
//     bountyBonus    +N gold per kill
//     maxHp / heal   castle max HP increase, and immediate healing
// Adding a new effect key needs a line in the engine that reads it; the existing ones
// can be re-assigned to any node freely.

export const TECH_BRANCHES = [
  { id: 'eco', name: 'Economy', icon: 'gold' },
  { id: 'def', name: 'Defense', icon: 'sword' },
  { id: 'vis', name: 'Vision',  icon: 'eye' },
];

export const TECH_NODES = [
  { id: 'e1', branch: 'eco', name: 'Deep Veins',       cost: 1, requires: null, icon: 'pick',      txt: 'Harvesters +1 yield',                               effect: { harvestBonus: 1 } },
  { id: 'e2', branch: 'eco', name: 'Royal Tax',        cost: 2, requires: 'e1', icon: 'coins',     txt: 'Castle +5 gold per wave',                           effect: { waveGold: 5 } },
  { id: 'e3', branch: 'eco', name: 'Master Builders',  cost: 3, requires: 'e2', icon: 'tag',       txt: 'Buildings cost 15% less',                           effect: { costMult: 0.85 } },
  { id: 'd1', branch: 'def', name: 'Sharp Edges',      cost: 1, requires: null, icon: 'sword',     txt: 'All towers +20% damage',                            effect: { damageMult: 1.2 } },
  { id: 'd2', branch: 'def', name: 'Long Reach',       cost: 2, requires: 'd1', icon: 'aim',       txt: 'All tower range +1 hex',                            effect: { rangeBonus: 1 } },
  { id: 'd3', branch: 'def', name: 'Siege Craft',      cost: 3, requires: 'd2', icon: 'boom',      txt: 'Catapult splash +50%, archer fire rate +25%',       effect: { splashMult: 1.5, fireRate: { archer: 1.25 } } },
  { id: 'v1', branch: 'vis', name: 'Wide Eyes',        cost: 1, requires: null, icon: 'eye',       txt: 'All building sight +1',                             effect: { sightBonus: 1 } },
  { id: 'v2', branch: 'vis', name: 'Beacon Light',     cost: 2, requires: 'v1', icon: 'beacon',    txt: 'Scan towers reveal +1 hex per wave',                effect: { scanBonus: 1 } },
  { id: 'v3', branch: 'vis', name: 'Bounty & Bulwark', cost: 3, requires: 'v2', icon: 'heartplus', txt: 'Enemies drop +1 gold; castle +5 max HP (heal 5)',   effect: { bountyBonus: 1, maxHp: 5, heal: 5 } },
];

// Branches with their nodes attached, in tree order (this is what the UI and window.game.TECH use).
export const TECH = TECH_BRANCHES.map(b => ({ ...b, nodes: TECH_NODES.filter(n => n.branch === b.id) }));
