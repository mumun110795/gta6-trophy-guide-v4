# gta6-trophy-guide-v4

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/mumun110795/gta6-trophy-guide-v4/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/mumun110795/gta6-trophy-guide-v4/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

**Leonida Platinum Atlas** — an offline trophy guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI, styled in a Leonida neon-noir look (no Rockstar logos or artwork). Open `app/index.html` in a browser and it runs entirely from its own files: no build step, no network, nothing to install.

Every trophy shows its official name, description and grade exactly as PlayStation publishes them, plus a guide written for this entry that adds what the description leaves out — when it unlocks, what to prepare, and where it can go wrong — with a visible **Sources:** line on each trophy (PSNProfiles, PlayStationTrophies.org, PowerPyx).

## What's inside

- **Tracker** — all 55 trophies as cards (1 platinum, 2 gold, 6 silver, 46 bronze). Click to open the full guide; mark trophies earned; progress persists in `localStorage`. Filters by state (earned/missing), kind (story, missable, collectibles, activities, online), grade, and free-text search. Trophies with an official count (250 stunts, 42 shooting-range challenges, 100 WAiNK spots…) get a per-trophy counter with +/− steppers.
- **Roadmap to Platinum** — five stages built from the official descriptions: story → side content → collectibles → activities → cleanup, each with its trophies and live progress. (This list has no online trophies, so the final stage is a solo cleanup.)
- **Missables board** — the 7 missable trophies (Road to Rehabilitation, This Was No Boat Accident, The Lone Rider, Supply & Demand, Spin On This!, Positive Mental Attitude, Fair Game), each with a warning and its point of no return.
- **Spoiler shield** — the 28 hidden trophies (12 story, 16 side) stay blurred until you reveal them one by one, mark them earned, or switch the shield off in the header.
- **Export / Import** — download your progress as a JSON file and import it back on any machine.
- **Fast first load** — the HTML + CSS + JS that boot the app total about 8.7 KB gzipped; the trophy data loads alongside as a single JSON file.

## Run it

Serve the `app/` folder with the kit's tiny static server and open it in desktop Chrome:

```
node serve.ts
```

then visit http://localhost:8080 (use `node serve.ts --port <n>` for another port). Any other static file server with `app/` at its root works just as well, and the app keeps working with the network off.

## Handing it in

`node main.ts` (with `MAKEFUN_OUTPUT_DIR` set outside the grader) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library in `vendor/makefun-frontend.ts`, which is left byte-identical to the kit's copy.

---
<sub>Entered on [make.fun](https://make.fun/?ref=vdsf53gd&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
