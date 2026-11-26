# The Player boards' score: Amazing Grace as the app engraves it (#155)

## Source

- `seven-questions` 5, every piece of content real: the boards draw the app's real song.
- Code review, 2026-11-20: the Player boards' score is not the app's. Found while checking the song page's systems.

## Today

- `player/base/PlayerDesk.dc.html` and `PlayerApp.dc.html` hold a Verovio engraving captured long ago:
  - the piano part alone, from a full G bar;
  - no pickup, no Melody staff, no words and no pedal marks;
  - two verses, 32 bars, "1 · Verse 1" and "17 · Verse 2".
- The app (`entities/piece/content/hymns/amazing.ts`) has one verse:
  - a pickup ("A-"), then 16 bars;
  - a Melody staff with John Newton's words, over the Piano's grand staff, with pedal marks;
  - chord names over each bar.
- The app engraves it in four systems at 1710: the pickup and bars 1–4, then 5–8, 9–12 and 13–16.
- The board's layers read fixed tables:
  - `SYS` per staff view (both, r, l): each system's top, height and barlines;
  - `BEATX` and `PANOX`: each beat's x, for the playhead;
  - `SHEET_GEOM`: the crop each staff view takes;
  - the verse logic: `verseNow`, "Both verses".

## Will build

- **Capture.** `player/capture_score.mjs` reads the app's own engraving from the dev server: each system's SVG,
  its place, its bar edges (the bar targets), each beat's x and the chord names. It runs for each staff view:
  - all staves;
  - bass hidden (`staves=l1s0`), the board's Right hand (`r`);
  - treble hidden (`staves=u1s0`), the board's Left hand (`l`).
  The capture is written to `player/score/*.json`.
- **The page view.** `player/r46_score.py` replaces the tiles: four systems per view, each the app's SVG.
  - Above each system: its heading ("1 · Verse · ♩ = 80", then 5, 9, 13) and its chord names, at the app's places and type.
  - `SYS`, `BEATX` and `SHEET_GEOM` are written from the capture.
- **One verse.** Verse 2 and its logic go. The run ends after bar 16, and Done no longer says "Both verses".
- **The pickup.** The playhead starts on the pickup, as the app's cursor does.
- **Then:**
  - the panorama view, from the app's panorama layout;
  - the phone board (`PlayerApp`, 402), from a capture at 402.
