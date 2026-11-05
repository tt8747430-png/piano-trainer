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

## Today (map, 2026-11-05)

- **Bar:** Close, title (from 40rem), Done | Piano keys, MIDI (from sm), Tools (grid, a pill), Undo, Redo, Score
  settings (sliders), then an original's draft: the cloud mark and More (Publish, Versions, Discard).
- **Tools row:** View (Sheet music ⌄) and Transpose. On a phone it floats as a capsule over the music's head, and the
  page view's zoom pill (− % + Fit) sits under it.
- **Transport:** floats at the sheet's foot: Tempo %, ‹ ▶ ›, Record, Takes.
- **Palette** (`EditorPalette.tsx`):
  - Below 48rem, a sheet docked under the music (not floating). Folded: the note row and the category strip with
    "Show every tool". Unfolded: Notation · Instruments · Layout tabs, sections in a fixed `h-[min(38dvh,22rem)]` box
    with a hidden spacer after the last section (the empty band).
  - From 48rem, a panel left or right with the same three tabs.
  - Categories: Modes, Pitch, Articulations, Ornaments, Dynamics, Measures, Clef, Key, Time, Barlines and repeats,
    Text.
- **Duplicates:**
  - Measures › Bar length against the Time signature category.
  - The palette's Instruments and Layout tabs against Settings › Staves and › Layout.
  - The palette's Modes against Settings › Note input › Input mode on opening.
  - Tempo in the transport, in Text › Tempo change and in Settings › Tempo.
  - Two settings buttons in the bar (Tools and Score settings).
- **Time signature** (`TimeSignatureField`): 13 tiles, then Other (a Beats stepper 1–12, a Beat unit menu 2/4/8) and a
  Pickup stepper. `Meter` is `${1–12}/${2|4|8}`: no 16ths, nothing over 12.
  - The owner's ruling (feedback-log): "Current and Pickup columns, numbers stacked large on staff lines as wheels; a
    cut or common switch; ✗ ✓ at the bottom right. Every meter, such as 2/2, 3/2, 5/4, 6/4, 7/4, 3/8, 9/8."

## Will build

### 1. One bar, Flat's

- **Phone:** Close · Done | ▶ (Play or Stop) · Undo · Redo · ⚙ · ⋯.
- **From 40rem:** the title after Close, Piano keys and MIDI before ▶.
- **⚙** is the score's Settings, one gear, the gear icon.
- **⋯ More**, acts in parts:
  - View › (Sheet music · Chords · …);
  - Transpose…;
  - Record a take, Takes;
  - for an original: Publish…, Versions, Discard changes.
- The draft's state is a line in More's head ("Saved", "Saving…", "Offline"), never a mark beside Done.
- **What goes:**
  - the Tools button;
  - the floating tools capsule;
  - the floating transport: Play is the bar's; ‹ › are the caret's arrows and the palette's; Tempo is Settings ›
    Tempo; Record and Takes are More's.
- **Every bar button:** 44px, the bar's own round fill, nothing poking past the bar, no two overlapping, at 320px too.

### 2. The palette, floating as Flat's

- **Phone:** a sheet floating above the screen's foot (8px from the edges, rounded on all corners, its shadow), never a
  docked band.
  - Folded: the chosen category's tools in one row, then the category strip, its last cell Show every tool (never under
    it; the strip scrolls in its own box).
  - Unfolded: the chosen category's sections as grids of equal cells, as tall as they need up to 50% of the screen; no
    spacer after the last.
- **From 48rem:** the panel at its side, notation only.
- **Categories and their tools:** each section is a grid of cells, each cell an icon with its name as tooltip and
  aria-label.
  - **Note:** add note, the values whole to 64th, dot, double dot, tie, tuplet ⌄, rest, then ♮ ♯ ♭ and respell.
  - **Pitch:** step up/down, half step up/down, octave up/down, grace notes, cue notes, 8va, 8vb, 15ma.
  - **Articulations:** as today, plus Fingering.
  - **Ornaments:** as today.
  - **Dynamics:** as today, plus Pedal.
  - **Measures:** add bar before or after, delete bars, line break, join lines, new section, page break, bar repeats and
    rests. *Bar length goes:* a bar's length is its time signature.
  - **Clef**, **Key**, **Time**, **Barlines and repeats**, **Text:** as today.
- **What goes from the palette:**
  - the Modes dropdown: the input mode is a choice in the Note category's first cell, and Settings › Note input loses
    "Input mode on opening" (the editor opens as it was left);
  - the Instruments and Layout tabs (they are Settings › Staves and › Layout).

### 3. The time signature, as ruled

The Time category, and Settings › Time signature, are one control:
- the common tiles in a row;
- below them two wheels, **Current** (beats 1–16 over the unit 1, 2, 4, 8, 16, numbers stacked large on staff lines) and
  **Pickup** (beats before the first bar's line, 0 to the bar's length);
- a switch to write it as Common (𝄴) or Cut (𝄵) where the meter is 4/4 or 2/2;
- ✗ and ✓ at the bottom right.

`Meter` reaches `${1–16}/${1|2|4|8|16}` in the kernel, with its counting (`compound`, beats) for each.

### 4. Settings

Title and credits is its own page (done). Note input keeps "Play notes while editing" and Palette side. Every row of
Music and How the editor works is a page, with a chevron.

## Left for the owner (drawn)

1. Play in the bar (A, recommended, Flat's) or the transport floating at the foot (B).
