// Enemy types. Plain data: edit, rebuild, play.
// Every enemy is a question, and some tower is its answer (see `counter`).
//
//  hp          base hit points (multiplied by the wave formula in waves.js)
//  speed       hexes per second (also scaled per wave, see waves.js)
//  armor       flat damage removed from every hit (min 1 damage). Towers with `pierce` ignore it.
//  flying      ignores the maze and walls, flies straight at the castle. Towers with
//              `hitsAir: false` (the catapult) cannot target it.
//  heal        { every: seconds, radius: hexes, frac: share of max hp } heals nearby enemies
//  pack        spawns as a group of this many (one wave "slot" = one pack)
//  priority    towers with targeting 'priority' shoot the highest value first
//  boss        appears alone at the end of every BOSS_EVERY-th wave (see waves.js)
//  dmg         damage dealt to a structure every 0.8 s when it has to break through
//  castleDmg   castle hit points lost when it reaches the castle
//  bounty      gold dropped when killed
//  firstWave   first wave in which this type appears
//  share       fraction of a wave's slots it takes once fully introduced (ramps up over 3 waves)
//  r           body size (hit/draw size, hex radius = 1)
//  drawScale   extra multiplier for the drawing
//  barOffset   how high the health bar floats above the enemy (hex radius = 1)
//  color       particle colour when killed
//  art         which drawing to use (see ENEMY_ART in src/render/enemies.js)
//  intro       one line shown on the "new enemy" card
//  counter     the answer, shown on the card

export const ENEMIES = {
  grunt:  { id: 'grunt',  name: 'Grunt', art: 'grunt', hp: 20, speed: 0.9, dmg: 4, castleDmg: 1, bounty: 1,
            firstWave: 1, r: 0.3, drawScale: 1.4, barOffset: 0.62, color: '#d9534f',
            intro: 'Walks the shortest open route to your castle.', counter: 'Any tower. Make the route long with walls.' },
  runner: { id: 'runner', name: 'Runner', art: 'runner', hp: 10, speed: 1.9, dmg: 3, castleDmg: 1, bounty: 1,
            firstWave: 3, share: 0.3, r: 0.22, drawScale: 1.5, barOffset: 0.5, color: '#f0a030',
            intro: 'Very fast and fragile. Slips past slow towers.', counter: 'Archers fire fast enough to catch it. Mages slow it down.' },
  swarm:  { id: 'swarm',  name: 'Swarmlings', art: 'swarm', hp: 5, speed: 1.15, dmg: 2, castleDmg: 1, bounty: 1,
            firstWave: 5, share: 0.12, pack: 4, r: 0.17, drawScale: 1.5, barOffset: 0.4, color: '#9bbf3a',
            intro: 'Come in packs of four. One arrow each wastes your archers.', counter: 'Catapult splash hits the whole pack at once.' },
  brute:  { id: 'brute',  name: 'Armored Brute', art: 'brute', hp: 60, speed: 0.55, armor: 4, dmg: 9, castleDmg: 2, bounty: 3,
            firstWave: 7, share: 0.15, r: 0.42, drawScale: 1.25, barOffset: 1.05, color: '#8a4fb0',
            intro: 'Armor 4: arrows barely scratch it.', counter: 'Mage bolts and Ballista spears pierce armor. Catapults hit hard enough.' },
  bat:    { id: 'bat',    name: 'Bat', art: 'bat', hp: 14, speed: 1.1, flying: true, dmg: 0, castleDmg: 1, bounty: 1,
            firstWave: 9, share: 0.2, r: 0.26, drawScale: 1.4, barOffset: 1.0, color: '#6b5a8a',
            intro: 'Flies straight over your maze and walls.', counter: 'Archers (and mages, ballistas) shoot it down. Catapults cannot hit flyers.' },
  shaman: { id: 'shaman', name: 'Shaman', art: 'shaman', hp: 30, speed: 0.75, dmg: 3, castleDmg: 1, bounty: 3,
            firstWave: 11, share: 0.1, heal: { every: 2.5, radius: 2, frac: 0.12 }, priority: 10,
            r: 0.3, drawScale: 1.45, barOffset: 0.8, color: '#3fbf8f',
            intro: 'Heals every enemy around it. Kill it first.', counter: 'The Ballista outranges everything and shoots shamans first.' },
  boss:   { id: 'boss',   name: 'Warlord', art: 'boss', hp: 150, speed: 0.4, armor: 2, dmg: 25, castleDmg: 4, bounty: 15,
            firstWave: 5, boss: true, priority: 5, r: 0.55, drawScale: 1.3, barOffset: 1.4, color: '#c0392b',
            intro: 'A boss arrives every 5th wave. Huge health, light armor.', counter: 'Everything you have. Ballistas and upgraded towers.' },
};

export const DEFAULT_ENEMY = 'grunt';
