# Chord player layout (R76 port): plan and progress

Brief: `.scratch/r39/briefs/chord-player-layout.md`. Port canvas R76 (`r58_chordplayer.py`, `r49_settings.py`).

## Plan
1. [ ] Layout model, pure, with a test: panels, places, sizes, LAY0 (phone/laptop), what changed.
2. [ ] Saved store `pt-page-layouts` keyed by page; feature commands (set panel, reset page, reset all, restore); selectors.
3. [ ] Chord player panels from the layout: Keys top/bottom S/M/L, Controls float/top full/play only,
       Genos top/float/bottom/left/right full/compact/min, Chords left/right narrow/wide.
4. [ ] Edit layout: outlines, tags (grip + name menu), drag (mouse + held finger), tap tag then tap zone,
       tag menu Place/Size/Hide, tray, bar Reset/Done.
5. [ ] Genos head: Compact/Full and Minimize; pill "Genos · Main A".
6. [ ] Sheet name = menu of recent sheets, New sheet, All chord sheets; opens last sheet.
7. [ ] Settings regrouped: Sound, Playing, Chart, MIDI, Layout.
8. [ ] ··· a row menu at its button.
9. [ ] Settings › General › Layout › Page layouts.
10. [ ] en + ru strings; ADR 0052 Chord player part; typecheck; two passes.

## Progress
