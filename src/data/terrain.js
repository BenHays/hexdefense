// Terrain types, map size and map-generation rules.
// Everything here is plain data: edit the numbers, rebuild, play.

export const RESOURCES = ['gold', 'wood', 'stone', 'crystal'];

// Hex radius of the whole map (distance from the castle to the edge).
export const MAP_RADIUS = 17;

// Order matters: it is used to seed the cached tile art (keep new terrains at the end,
// before 'fog' if you do not want existing tiles to change look).
//   color: [top, bottom] gradient of the tile
//   floatColor: colour of the "+4 wood" floating text when a harvester pays out here
export const TERRAINS = {
  plain:   { color: ['#c7bba1', '#a79b82'] },
  wood:    { color: ['#5d8c55', '#3f6a41'], floatColor: '#7fcf6a' },
  stone:   { color: ['#a4a8ae', '#80858d'], floatColor: '#b4bcc8' },
  crystal: { color: ['#3a2c6c', '#241a4a'], floatColor: '#c78bff' },
  castle:  { color: ['#d2c7a4', '#b0a27a'] },
  fog:     { color: ['#141822', '#0b0e15'] },
};

// Map generation. Every hex gets a random roll x in [0,1):
//   1. crystal, if it is at least `minDistance` hexes from the castle, with probability `chance`
//   2. otherwise the first entry of `rolls` whose `below` is greater than x
//   3. otherwise plain
export const MAP_GEN = {
  crystal: { minDistance: 6, chance: 0.05 },
  rolls: [
    { terrain: 'wood',  below: 0.15 },
    { terrain: 'stone', below: 0.30 },
  ],
  // Within `radius` hexes of the castle at least one hex of each terrain is guaranteed
  // (a plain hex is converted if none exists).
  guaranteedNearCastle: { radius: 2, terrains: ['wood', 'stone'] },
};
