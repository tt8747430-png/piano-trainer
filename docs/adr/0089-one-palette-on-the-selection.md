# ADR 0089 — The editor's one palette acts on what is chosen

- **Status:** accepted · **Date:** 2026-10-23 · **Supersedes:** ADR 0080's Insert (the + menu and its six
  tabs) · **Amends:** ADR 0065 (the palette's tabs), ADR 0079 and 0081 (what floats over the sheet), ADR 0085
  (Undo and Redo in the bar) · Spec:
  [2026-10-23-editor-one-palette-like-flat](../superpowers/specs/2026-10-23-editor-one-palette-like-flat.md)

## Context

The owner could not tell where the palette ended and the + menu began; Bar length and Clef change sat in an
"Insert" menu though they change rather than insert; the + in the dock said nothing; and an eighth tapped with a
note chosen changed only the next note, not the one chosen. Flat (the owner's screenshots of its phone editor)
and Dorico (its tutorials "The caret and the grid", "Editing notes") answer it the same way: the caret is an
insertion point, notes chosen are edited by the same tools that write them, and there is one palette.

## Decision

- **One rule:** every palette tool acts on what is chosen (a note, one note of a chord, a chord, a range, or
  the bars they are in: `chosenNotes`, `chosenSpan`, `chosenBars`). With only an insertion point, a value, dot
  or triplet sets the next note's value; the marks that need notes are greyed, their section saying why in a
  line (`reason.*`).
- **Values change notes** (`setDuration`): the notes chosen made that long, each onset's notes together (a
  chord's one note takes its chord), shorter leaving a rest, longer taking the notes under it as writing does,
  stopping where the hand stops being written or the piece ends. The quick row shows the chosen note's own value
  pressed (`shownValue`). A rest makes a range's notes rests. ♯ ♭ ♮ write the chosen notes' letter so
  (`setAccidental`).
- **The palette** (`EditorTools`): a quick row of the values and Dotted (the key's triads in the chord row),
  always in sight; under it the category bar, a picture each, scrolling sideways, ending in the palette's fold
  and a Keys toggle that never comes and goes; opened, every category's section stacked over them, scrolling, a
  category tapped scrolling to its own. Categories (`PALETTE_CATEGORIES`): Notes · Pitch · Articulations ·
  Dynamics & hairpins · Slurs & lines · Bar · Clef · Key signature · Time signature · Barlines & repeats · Text &
  pedal · Fingering · Chords. It opens folded (`paletteFolded` defaults to true), at the foot or beside the
  sheet as before, and opening it scrolls the caret into the room above it.
- **Bar** holds what acts on the bars chosen: Add bar before (`insertBarBefore`) and after, Delete bars, Line
  break, Join lines, New section, Bar length (each bar chosen), and on a hand's staff Write out as notes or Use
  the pattern again, each saying what it does. **Clef** changes from the first bar chosen.
- **Key and Time signature are the song's**: the draft holds one key and one meter, so these sections name the
  song's and open the Song sheet to change it ("Change for the whole song"). A change of key or time inside the
  song is future work.
- **The edit row** (`EditRow`): Delete, Undo, Redo, Copy, Cut, Paste (the bars chosen, else the caret's) and Add
  bar, icons with tooltips, under the bar on a phone and in its row where there is room. Undo and Redo leave the
  bar's middle; the dock is ‹ Play › alone. No row chooses the staff written: a click on the sheet and Alt ↑ ↓
  do, as before.
- **Nothing cut:** a key that is not plainly a picture says its name under it, wrapping inside its box (Russian
  too); a caret line too long for its row wraps.

## Consequences

The + menu, its tiles engraved by Verovio (`InsertTiles`), `add-menu.ts` and the `add.*` words are gone; the
palette's keys are drawn in SVG or set in the music font, so opening the palette engraves nothing. The shared
`ToolPalette` shrinks to `ToolKey`. ADR 0080's Song and View menus stand as they were.
