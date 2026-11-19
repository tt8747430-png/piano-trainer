# Chord player layout (R76 port): plan and progress

Brief: `.scratch/r39/briefs/chord-player-layout.md`. Port canvas R76 (`r58_chordplayer.py`, `r49_settings.py`).

## Plan
1. [x] Layout model, pure, with a test: panels, places, sizes, LAY0 (phone/laptop), what changed.
2. [x] Saved store `pt-page-layouts` keyed by page; feature commands (set panel, reset page, reset all, restore); selectors.
3. [x] Chord player panels from the layout: Keys top/bottom S/M/L, Controls float/top full/play only,
       Genos top/float/bottom/left/right full/compact/min, Chords left/right narrow/wide.
4. [x] Edit layout: outlines, tags (grip + name menu), drag (mouse + held finger), tap tag then tap zone,
       tag menu Place/Size/Hide, tray, bar Reset/Done.
5. [x] Genos head: Compact/Full and Minimize; pill "Genos · Main A".
6. [x] Sheet name = menu of recent sheets, New sheet, All chord sheets; opens last sheet.
7. [x] Settings regrouped: Sound, Playing, Chart, MIDI, Layout.
8. [x] ··· a row menu at its button.
9. [x] Settings › General › Layout › Page layouts.
10. [x] en + ru strings; ADR 0052 Chord player part; typecheck; two passes.

## Progress
- 1–9 built (commits 8ab88bd2, 2534b436, 0919bebd and later, `git log`); typecheck clean.
- Pass 1 (`cpdrive.mjs`; scratchpad `cp/d1`, `cp/d1h`): fixed the compact Genos Main A–D overlapping on a phone, the pill reading "Genos · Genos", 28-tall menu check rows, the Layout rows in ink, the Page layouts row drawn over itself.
- ADRs: 0052 (the screen), 0062 (no Piano button here), 0112 (sheets version 2, recents).
- Pass 2: fresh shots in `cp/d2`.
