# The score editor: one palette that acts on the selection (after Flat)

Reference: the owner's screenshots of Flat's mobile editor in `piano-data/reference-apps/flat-score-editor/`
(`01-editor-note-toolbar.png`, `02-editor-notation-palette.png`, `03-editor-keyboard-input.png`,
`04-instruments-sheet.png`, `05-playback-options-sheet.png` and the `IMG_44xx`/`IMG_45xx` series).

## Why

The owner could not tell where the palette ends and the + menu begins, why Bar length and Clef change sit in an
"Insert" menu when they change rather than insert, what + means, or why tapping an eighth note while a note is
selected does not make it an eighth. Flat answers all of it with one rule: **there is one palette, and everything
in it acts on the selection.**

## The model

- **Selection or insertion point.** What is chosen is a note, one note of a chord, a chord, a rest, or a range
  (ADR 0082, 0088). With no note chosen, the caret is an insertion point: a thin line where the next note goes.
- **The palette acts on what is chosen.** A duration, dot, rest, tie, triplet, accidental, articulation, dynamic,
  slur, hairpin, octave line, fingering, clef, key or time signature, barline or repeat, text or pedal mark applies
  to the selection. With only an insertion point, a duration (and dot, rest, triplet, accidental) sets what the
  next written note will be; marks that need notes are greyed with a one-line reason.
- **Edit actions have their own row** (Flat's second toolbar), always in sight under the header: the hand or voice
  written in, Delete, Undo, Redo, Copy, Cut, Paste, and Add bar. These act on the selection, never insert marks.
- **No Insert menu, no +.** Its contents become palette categories.

## The palette

A sheet at the foot (a card beside the sheet on a laptop and a phone on its side, as now, ADR 0079, 0081), with:

1. A **quick row** of the note values (the most used tools), always shown.
2. A **category bar** at its foot, one icon each, scrolling sideways when the screen is narrow: Notes · Pitch ·
   Articulations · Dynamics & hairpins · Slurs & lines · Bar · Clef · Key · Time · Barlines & repeats · Text &
   pedal · Fingering · Chords (the chord row's tools). At its end, a stable Keys toggle (the keys shown or not)
   that never appears or disappears.
3. **Expanded** (dragged up, or a category tapped): every category as a titled section, stacked and scrolling; a
   tapped category scrolls to its section. Collapsed: the quick row and the category bar. The sheet never covers
   the selection: the sheet scrolls the selection into the room above it.
4. **Bar** holds what acts on the chosen bars: Add bar before / after, Remove bars, Line break, Section break, Bar
   length (pickup), Write out as notes / Use the pattern again (with its one-line explanation).
5. Every item is a picture with its standard musical name (en and ru) as its label or tooltip, sized ≥44px, and
   fits at 393px wide.

## The header and dock

- Header: Close, the title over the caret's line, then Record, View, MIDI, Song (ADR 0085). Undo and Redo move
  to the edit row.
- Dock: ‹ ▶ › as the Player's transport (no + and no Delete; Delete is the edit row's).

## Out of scope

Comments, voices beyond the existing ones, customising the quick row, the Instruments sheet (the Song sheet's
Parts already holds it).
