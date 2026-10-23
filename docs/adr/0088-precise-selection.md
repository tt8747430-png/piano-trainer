# ADR 0088 — The one selection, precisely: heads hugged, one note of a chord, ranges by the keys

- **Status:** accepted · **Date:** 2026-10-23 · Refines [0082](0082-one-selection.md)

## Context

After 0082 the owner, on a Mac and an iPhone, found the selection still not one: the Player chose by its own
code (a tap jumped to the nearest beat group, so empty staff still chose something), the editor's click went
through its own; a click between notes, after the last note or in a margin still drew a box; a chord could
only be chosen whole; the boxes were fixed columns as wide as a note's room, a staff space past the staves,
so they took in the neighbours; the editor's range was bars, so Shift and an arrow jumped by bars; the Player
had no keys for its range at all, and the caret stayed drawn inside a range.

## Decision

- **The engraving's heads are read** (`verovio/svg-heads.ts`): each notehead's box from its glyph's place and
  Bravura's box for it, with its accidental and dots, its id (`n-<staff>-<tick>-<i>`) and key (`withKeys`,
  from the score); each chord's column, its heads and stem; each rest. In `ScoreLayout` as `heads`,
  `columns`, `rests`; read the same in any DOM, a test's too.
- **Marks hug what they choose** (`noteMark`, `rangeMark`): a box `HUG.pad` (0.3 staff space, 3 px at full
  size) round the heads (and rests) chosen, and nothing else; where nothing is drawn (the chord row), from the
  first place to where the last ends. Both sheets, every layout, the Pages canvas at any zoom (the layout's
  px; a click's point is read back through the canvas's zoom).
- **One gesture path** (`useSheetChoice`, both sheets' bar buttons): a click or tap is `pickAt`: the head
  under it (one note of a chord), else the chord whose column (its stem) it is on, else nothing — empty staff
  is never chosen; Shift with a click extends; a finger held 450 ms chooses what it holds, dragged on it
  reaches each bar. In the editor a click on empty staff where a note can go (a rest, the room after the last
  note, a bar the pattern plays) puts the caret there as a line; between notes it lets go of what is chosen.
  The pattern's soft notes are empty staff in the editor.
- **The editor's range is notes** (`Selection` of two tick spans, `itemAt`): Shift ← → a note more or less,
  Shift Alt ← → to the bar's end or start, Shift Home / End (or Cmd) to an end; edits of notes act on the
  span, bar edits on the bars it touches. Alt ↑ ↓ steps through a chord's notes (from the whole chord to its
  top or foot), then to the staff over or under. A chord's one note (`chordNote`) is what Delete, ↑ ↓, a
  drag, Respell and the marks change. Escape lets go. The arrows never stop inside a note.
- **The Player's range is the loop, in bars** (its machine loops bars): a click on a note jumps there, lets
  go of the loop, and marks that note (one of a chord's) until the cursor moves; Shift with a click or a
  held finger dragged sets the loop; Shift ← → move its far end a bar, Shift Home / End to the first or last
  bar (`reachLoop`); Escape lets go of it, then closes.
- **No caret inside a range**: the editor draws none while notes are chosen; the Player none while the loop
  stands chosen, stopped, with the cursor at its start.

## Consequences

The editor and the Player choose by the same code, drawn by the same marks; the shortcuts' sheet lists the
keys of each. The Player's range stays bars: a loop of notes would need the practice machine to loop ticks.
