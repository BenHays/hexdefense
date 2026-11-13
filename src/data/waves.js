// Wave pacing, economy and start conditions. Tweak the constants or the small formulas.

// ---- start of a new game
export const START_RESOURCES = { gold: 30, wood: 5, stone: 5, crystal: 4 };
export const FREE_SCAN_TOWERS = 1;     // first N scan towers are free

// ---- income
export const RESEARCH_PER_WAVE = 1;    // tech points earned per wave survived
export const WAVE_GOLD_BASE = 10;      // castle income: BASE + wave number (+ tech bonuses)
export const waveGold = w => WAVE_GOLD_BASE + w;

// ---- how many enemies, how tough
export const waveCount = w => w <= 2 ? w + 2 : w === 3 ? 6 : Math.floor(3 + w * 2);
export const HP_PER_WAVE = 0.12;
export const HP_PER_WAVE_SQ = 0.01;
export const HP_LATE_START = 10;       // after this wave extra scaling kicks in
export const HP_LATE_PER_WAVE = 0.07;
export const hpMult = w =>
  (1 + HP_PER_WAVE * (w - 1) + HP_PER_WAVE_SQ * (w - 1) * (w - 1)) *
  (1 + HP_LATE_PER_WAVE * Math.max(0, w - HP_LATE_START));

// Early waves are softened: hp multiplier for waves 1..3, then 1.
export const EASE_IN = { 1: 0.6, 2: 0.8, 3: 0.9 };
export const easeMult = w => EASE_IN[w] === undefined ? 1 : EASE_IN[w];

// Enemy speed grows 1% per wave.
export const SPEED_PER_WAVE = 0.01;
export const speedMult = w => 1 + SPEED_PER_WAVE * w;

// ---- spawning
export const FIRST_SPAWN_DELAY = 0.3;  // seconds before the first enemy
export const SPAWN_GAP_START = 1.1;    // seconds between spawns on wave 0 ...
export const SPAWN_GAP_PER_WAVE = 0.05; // ... shrinking by this per wave
export const SPAWN_GAP_MIN = 0.4;
export const spawnGap = w => Math.max(SPAWN_GAP_MIN, SPAWN_GAP_START - SPAWN_GAP_PER_WAVE * w);
export const SPAWN_RING_MARGIN = 2;    // enemies spawn this many hexes beyond the revealed area
export const SPAWN_ANGLE_STEP = 2.399963; // golden angle: spreads spawns around the castle
export const SPAWN_ANGLE_JITTER = 0.5;
