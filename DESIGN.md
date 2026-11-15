# Hexkeep design

Hexkeep is an original hex-board castle defense game. You explore outward from a castle, give each hex one job, and survive waves of enemies that come from every side.

## Pillars

- Easy to learn and hard to master, with the moment-to-moment fun of a classic tower defense.
- **One hex, one job.** A hex holds a harvester, a tower, a wall or a scan tower, never two of these.
- **Exploration costs something.** Fog covers the map. Scan towers and building sight push it back, and every hex you spend on scanning is a hex you aren't spending on income or defense.
- Everything is drawn with code, with no art assets.

## Current rules (built)

- **Loop:** an untimed build phase, then a real-time wave, then end-of-wave payouts, research points and scans.
- **Resources:**
  - Gold comes from the castle each wave and from kills.
  - Wood and stone come from harvesters on wood and stone hexes.
  - Crystal comes from harvesters on crystal hexes, which only appear 6 or more hexes from the castle.
- **Structures:** scan tower, harvester, archer, catapult, mage (slows), wall, and one upgrade per tower. A tower built on its matching resource hex is 50% stronger, but that hex never pays out.
- **Vision:** the castle and scan towers see 2 hexes out, and other buildings see 1. Each scan tower also reveals its 2 nearest hidden hexes after each wave.
- **Enemies are questions, towers are answers.** A new type joins every wave or two, with a card that says what it does and what counters it. Enemies spawn just outside the fog on all sides.

  | Enemy | From wave | What it does | Counter |
  |---|---|---|---|
  | Grunt | 1 | Walks the shortest open route | Anything; make the route long |
  | Runner | 3 | Very fast, fragile | Archer (fast fire), Mage (slow) |
  | Swarmlings | 5 | Packs of four tiny enemies | Catapult splash |
  | Warlord (boss) | 5, 10, 15... | Huge HP, armor 2, 4 castle damage | Everything, Ballista |
  | Armored Brute | 7 | Armor 4: each hit loses 4 damage (min 1) | Mage and Ballista pierce armor; Catapult hits hard |
  | Bat | 9 | Flies straight over the maze | Archer, Mage, Ballista (Catapult can't hit air) |
  | Shaman | 11 | Heals enemies near it | Ballista (range 8, shoots shamans and bosses first) |

- **Towers:** Archer (fast, hits air), Catapult (splash, ground only), Mage (slows, pierces armor), Ballista (huge range, pierces armor, priority targeting), Wall (2 gold).
- **Mazing (built 2026-11-15):** every structure blocks enemies on foot, so they walk around your buildings and re-route when something is built or destroyed. During the build phase dotted lines show the current routes. A build that would leave no open trail from the map edge to the castle is refused, and the build menu says so. An enemy that is somehow cut off (for example spawned in a pocket) breaks through the cheapest structures.
- **Built hexes** get a dark plate with a rim coloured by kind (towers orange, walls stone, harvesters green, scan towers blue). The "Show built" button dims every empty hex and shows a legend.
- **Wave preview:** the bottom bar shows the next wave's enemies; new types glow.
- **Tech:** you earn 1 point per wave. There are three branches (Economy, Defense, Vision) with three nodes each.

## Decided, not built yet

These were agreed with Ben on 2026-11-13. Check with him before building them.

1. **Start small, unlock through tech.** A run starts with the castle, a scan tower, a harvester and one basic tower. Catapults, mages, walls and upgrades are unlocked in the tech tree, so new options arrive one at a time.

## Open ideas (not decided)

- Monster nests uncovered by scans, which spawn extra enemies until destroyed.
- Adjacency bonuses, for example a tower next to a wall, or harvesters side by side.
- Tower upgrade paths with a choice (Bloons style), coin drops, early-call bonus, more juice.
- A win condition (survive N waves), star ratings and scores.
- Save data and unlocks between runs.

## Where things live

Balance and content are in `src/data/` (structures, enemies, tech, waves, terrain). See `README.md` for how to change them and rebuild `dist/hexkeep.html`, which is the playable single file.
