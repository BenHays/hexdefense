// Enemy types. Plain data: edit, rebuild, play.
//
//  hp          base hit points (multiplied by the wave formula in waves.js)
//  speed       hexes per second (also scaled per wave, see waves.js)
//  dmg         damage dealt to a structure every 0.8 s while it is blocked by it
//  castleDmg   castle hit points lost when it reaches the castle
//  bounty      gold dropped when killed
//  firstWave   first wave in which this type can appear
//  chance      pick threshold, see ENEMY_PICK_ORDER
//  r           body size (hit/draw size, hex radius = 1)
//  drawScale   extra multiplier for the drawing
//  barOffset   how high the health bar floats above the enemy (hex radius = 1)
//  color       particle colour when killed
//  art         which drawing to use (see ENEMY_ART in src/render/enemies.js)

export const ENEMIES = {
  grunt:  { id: 'grunt',  name: 'Grunt',  art: 'grunt',  hp: 20, speed: 0.9,  dmg: 4, castleDmg: 1, bounty: 1, firstWave: 1, chance: 1,    r: 0.3,  drawScale: 1.4,  barOffset: 0.62, color: '#d9534f' },
  runner: { id: 'runner', name: 'Runner', art: 'runner', hp: 10, speed: 1.8,  dmg: 3, castleDmg: 1, bounty: 1, firstWave: 4, chance: 0.45, r: 0.22, drawScale: 1.5,  barOffset: 0.5,  color: '#f0a030' },
  brute:  { id: 'brute',  name: 'Brute',  art: 'brute',  hp: 75, speed: 0.55, dmg: 9, castleDmg: 2, bounty: 2, firstWave: 7, chance: 0.18, r: 0.42, drawScale: 1.25, barOffset: 1.05, color: '#8a4fb0' },
};

// Every spawn rolls x in [0,1). Types in ENEMY_PICK_ORDER are tried in order: the first one
// whose firstWave has been reached and whose `chance` is greater than x wins. Anything left
// over is DEFAULT_ENEMY. (So a bigger `chance` means more of that enemy; list rarer types first.)
export const ENEMY_PICK_ORDER = ['brute', 'runner'];
export const DEFAULT_ENEMY = 'grunt';
