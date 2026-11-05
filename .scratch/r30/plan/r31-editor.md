# R31-E: the score editor

## Source

The owner, 2026-11-05 (`songs-player-editor-brief.md` › Score editor), with shots 9 and 11:
- "its palette at the bottom and this weird placeholders at the bottom, why isn't the palette floating";
- "refactor the palette ui and its options because some of them are duplicate like the bar length and the time
  signature … you didn't follow the instructions how the customize time signature should be … make it as close to the
  flat editor palette as possible and no duplicates or workarounds; if something's missing implement it … no regressions
  … all other views or tabs in the palette should also be refactored";
- "the roundness of the buttons in the top toolbar … corners go out of the toolbar and the toolbar buttons overlap each
  other in the editor" (shot 9: Done over the save cloud);
- "we still have these two settings and why not the gear icon only one, and there are all the settings that now are in
  two buttons; refactor them properly and also all their popups";
- "the title and credits why don't have their own subpage in the score settings like the others do, and it is still not
  understandable how the other music settings work or that they are subpages, and we have duplicate settings in how the
  editor works and also in the palette".

Flat's palette (`piano-data/reference-apps/flat-score-editor/01-…`, `02-…`): a bottom sheet with a grabber. Folded, it
is one row of the chosen tab's tools over a strip of tab icons (Note, Pitch, Articulation, Ornament, Dynamics, Measure,
Clef, Key, Time), with an expand button at the strip's end. Unfolded, every tool of the tab is in titled sections
(Notation, Pitch and Representation…) as a grid of equal cells.

## Reproduced (2026-11-05, the harness)

- The palette's tab strip runs under its "Show every tool" button (Key signature and Time signature are covered).
- On Score settings, the first card (Title…) starts under the bar, with no heading.
- The View pill and the zoom pill overlap at the head of the music (shot 11).
