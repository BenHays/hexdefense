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
- **Enemies:** grunt, runner (from wave 4) and brute (from wave 7). They spawn just outside the fog on all sides.
- **Tech:** you earn 1 point per wave. There are three branches (Economy, Defense, Vision) with three nodes each.

## Decided, not built yet

These were agreed with Ben on 2026-11-13. Check with him before building them.

1. **Mazing.** Enemies walk around every structure, not just walls, taking the shortest open route to the castle. They re-route whenever something is built or destroyed. The game rewards shaping a path with your buildings.
2. **No total blocks.** A build is refused if it would leave no open trail from the map edge to the castle. The rule is at least one trail in total, not one per side, so funneling enemies is allowed. The check is a breadth-first search from the castle, run before each placement.
3. **Start small, unlock through tech.** A run starts with the castle, a scan tower, a harvester and one basic tower. Catapults, mages, walls and upgrades are unlocked in the tech tree, so new options arrive one at a time.

## Open ideas (not decided)

- Monster nests uncovered by scans, which spawn extra enemies until destroyed.
- Adjacency bonuses, for example a tower next to a wall, or harvesters side by side.
- A flying enemy that ignores the maze, so mazing isn't the only strategy.
- A win condition (survive N waves), star ratings and scores.
- Save data and unlocks between runs.

## Where things live

Balance and content are in `src/data/` (structures, enemies, tech, waves, terrain). See `README.md` for how to change them and rebuild `dist/hexkeep.html`, which is the playable single file.
