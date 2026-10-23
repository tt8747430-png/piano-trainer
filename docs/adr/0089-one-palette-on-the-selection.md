# ADR 0089 — The editor's one palette acts on what is chosen

- **Status:** accepted · **Date:** 2026-10-23 · **Supersedes:** ADR 0080's Insert (the + menu and its six
  tabs) · **Amends:** ADR 0065 (the palette's tabs; removed by ADR 0091), ADR 0079 and 0081 (what floats over the sheet), ADR 0085
  (Undo and Redo in the bar) · Spec:
  [2026-10-23-editor-one-palette-like-flat](../superpowers/specs/2026-10-23-editor-one-palette-like-flat.md) ·
  **Amended** the same day after [2026-10-flat-and-dorico](../research/2026-10-flat-and-dorico.md) (below)

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
  (`setAccidental`; since ADR 0091 toggles, `toggleAccidental`).
- **The palette** (`EditorTools`): a quick row of the values and Dotted (the key's triads in the chord row),
  always in sight; under it the category bar, a picture each, scrolling sideways, ending in the palette's fold
  and a Keys toggle that never comes and goes; opened, every category's section stacked over them, scrolling, a
  category tapped scrolling to its own. Categories (`PALETTE_CATEGORIES`): Notes · Pitch · Articulations ·
  Dynamics & hairpins · Slurs & lines · Bar · Clef · Key signature · Time signature · Barlines & repeats · Text &
  pedal · Fingering · Chords. It opens folded at the foot and open beside the sheet (see the amendment),
  and opening it scrolls the caret into the room above it.
- **Bar** holds what acts on the bars chosen: Add bar before (`insertBarBefore`) and after, Delete bars, Line
  break, Join lines, New section, Bar length (each bar chosen), and on a hand's staff Write out as notes or Use
  the pattern again, each saying what it does. **Clef** changes from the first bar chosen.
- **Key and Time signature:** a key change from a section on (see the amendment); the song's own key and its
  one meter are named and changed in the Song sheet ("Change for the whole song"). A change of time inside the
  song is future work.
- **The edit row** (`EditRow`): Delete, Undo, Redo, Copy, Cut, Paste (the bars chosen, else the caret's) and Add
  bar, icons with tooltips, under the bar on a phone and in its row where there is room. Undo and Redo leave the
  bar's middle; the dock is the tempo then ‹ Play › (see the amendment). The staff written is chosen by a click
  on the sheet, Alt ↑ ↓, and the layer chip at the edit row's head (see the amendment).
- **Nothing cut:** a key that is not plainly a picture says its name under it, wrapping inside its box (Russian
  too); a caret line too long for its row wraps.

## Consequences

The + menu, its tiles engraved by Verovio (`InsertTiles`), `add-menu.ts` and the `add.*` words are gone; the
palette's keys are drawn in SVG or set in the music font, so opening the palette engraves nothing. The shared
`ToolPalette` shrinks to `ToolKey`. ADR 0080's Song and View menus stand as they were.

## Amendment — after Flat and Dorico (2026-10-23)

The research [2026-10-flat-and-dorico](../research/2026-10-flat-and-dorico.md) set us against Flat and Dorico.
Its changes 1 and 2 (Practise · Edit, one layout) are ADR 0090; the rest amend this one.

- **Key change from a section** (`setSectionKey`, the `sectionKey` action): the Key signature section changes
  key from the first bar chosen's section (else the caret's) on, up to the next change of key, as Flat changes
  key from a bar; a section back in the song's key writes none. It is the section's `heading.key`, which the
  arrangement, `line-music.ts` and the engraving already read, with a courtesy signature at the line before's
  end (ADR 0087). Notes stay where they are; a note written or stepped there is spelled and stepped in that key
  (`keyAt`), and the song's key changed in the Song sheet moves each section's key with the music. Keys change
  at a section only, never mid-bar; Time signature says in a line that a change of time is for later.
- **↑ ↓ a step in the key** (`step`), as Flat and Dorico move a note; with Shift a semitone, with Cmd or Ctrl an
  octave; Alt ↑ ↓ still go through a chord's notes (ADR 0088). The Pitch section and the shortcuts' sheet list
  them in that order.
- **The palette's fold by place** (`paletteFolded: { beside, foot }`, unset until the learner folds or opens it
  there): open by default beside the sheet (a laptop, a phone on its side), where it covers no music; folded at
  the foot of an upright phone. `pt-settings` version 5 (ADR 0038).
- **A grab handle** along the palette's top edge, Flat's sign of a sheet: dragged away from the edge the palette
  stands on it opens, dragged back it folds, a tap toggles (`gripRelease`). It is a pointer's alone; the bar's
  fold button stays for the keyboard and a screen reader.
- **Pitch wears ♭•↕** (a note with its accidental and an arrow up and down), Flat's: a sharp alone read as the
  accidentals, which are the Notes'.
- **Words that say what they do:** the dock is "Play and move", ‹ › "Previous note" and "Next note"; the edit
  row copies, cuts and pastes "bars".
- **The tempo in the dock:** the Player's `TempoButton` without Wait mode and speed training, setting how fast
  the editor's Play plays (a share of the song's tempo, for the visit), never the song's tempo, so what was
  written is checked at the learner's speed.
- **The layer chip** (`LayerChip`) heads the edit row, Flat's voice badge: the staff the next note goes in, its
  sign (the chord names' letter, a tune's note, a hand's clef) in the caret's colour, its name beside it on a
  wide screen; tapped, the staves in sight top down (`shownRows`), to write in another. This reverses "no row
  chooses the staff": choosing it there is the same act as a click on its staff or Alt ↑ ↓.
- Later, each with its own ADR: Insert mode (Melody · Insert · Chord) and a first-visit walkthrough.
