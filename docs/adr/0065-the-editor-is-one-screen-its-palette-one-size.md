# ADR 0065 — The editor is one screen, its palette one size, what is added in a + menu

- **Status:** accepted · **Date:** 2026-10-20 · **Amends:** ADR 0064 (the palette), ADR 0061 (the editor's tools)

## Context

The owner compared the score editor with Sibelius for iPhone. Ours went past the screen's edge on a phone (a chart
line drawn wider than the screen scrolled sideways), its parts were all different widths (a laptop's ribbon, a notes
column, the sheet and the keys), and its palette changed height with every tab, so the sheet jumped. The keys stood
over the palette when open and folded to a place under it.

## Decision

- **One screen.** The editor never scrolls as a whole: the sheet is its one scroller. A line down the screen is
  justified to the sheet's width; a line wider than that is drawn smaller to fit (the engraver's `fill` shrinks as
  well as spreads), and a chart line of more bars than a narrow sheet holds is cut into even parts (`linesOf`'s
  `most`: two bars on a phone, three on a tablet). The Player's lines fit the same way.
- **The palette, one size.** One palette everywhere (no ribbon, no notes column), its height fixed by the layout and
  never by its tab: at the foot over the keys on a phone held upright and a tablet (three rows of keys, more scrolling
  inside), or a column beside the sheet on a laptop and a phone on its side (the column's height). It folds into a
  button floating over the sheet's lower right corner.
- **The keys** dock where the keyboard settings dock every screen's: at the foot under the palette, or under the
  bar. Folded, the Keys button floats over the sheet's lower left corner, as on every screen (ADR 0055, 0062).
- **The palette is the notes'.** Its tabs are what is done to the notes at the caret: their values and rhythm,
  their pitch (♯ ♭ a semitone, 8 an octave, a note on lines a step of the key, each with its arrow), their marks,
  their dynamics and a hand's fingering. In the chord names' row the palette is theirs, without tabs.
- **The + menu adds to the score**, as Sibelius's does: bars, lines and sections; lines over the notes (slurs,
  hairpins, octave lines); the key signature (the fifteen of each mode); the time signature (the song's, of its
  kind, and the caret's bar's own length); and the staves (the tune's, the chord names' row). Each kind a tab of
  tiles, the signatures and lines engraved by VexFlow as the score will show them, a name under each; a tile
  chosen does its work and closes the menu, which keeps one height whatever its tab. Only what the model writes
  is offered: no clefs, barline styles or text, which it does not.
- **Chord names, three ways** (the palette in their row): tapped from the key's triads and sevenths; built from
  a root (its letter, ♯ ♭), a quality (every one the app knows, by family) and a bass; or typed in a field over the
  chord keypad (the letters, ♯ ♭, the qualities, the slash and the numbers a symbol is made of). On a touch screen
  the keypad types and the phone's own keyboard stays down, so nothing covers the chord row; on a computer the
  keyboard types too, and Enter in the chord row opens the field. ← → and Delete stay in the palette's top row.
- **A pattern for each section.** A section may play a pattern of its own (`Section.pattern`), chosen in its
  heading's menu and named beside it; its chords play it unless a chord's method code says otherwise, and the
  Player's From the chart follows it. A bar written out by hand still plays its notes. Choosing one pattern in the
  Player's Setup plays it everywhere, as before.
- **Settings, behind the gear**, in one sheet: the song (title, key, tempo, meter), the view (layout, the tune's
  staff, the chord names) and the MIDI keyboard. Each setting wears a picture of what it does, the Player's View
  too (`SheetViewIcon` for the layouts, `SwitchRow`'s `icon`), never one eye for all.
- **Moving.** ← → a note, Alt ← → a bar, Enter a line on (Shift back: the line's start, then the line before),
  Alt ↑ ↓ the staff, Home and End the ends. Tab stays the browser's, moving between the controls.

## Consequences

A saved section reads its `pattern` (a built-in id) field by field, as ADR 0038 has it: no version changes. The palette's Lines and Bars tabs are gone into the + menu. A phone sees two bars a line where the chart writes four; the chart's lines are still the
lines of A4 pages and of the Player.
