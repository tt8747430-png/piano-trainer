# ADR 0110 — The editor and the Player as one: one bar, one tools row, one transport

- **Status:** accepted · **Date:** 2026-10-26 · **Amends:** ADR 0085 (the bars' look and order), ADR 0089 (the
  palette), ADR 0090 (Practise · Edit), ADR 0094 (the editor's bar, dock and title), ADR 0096 (the recording
  strip), ADR 0104 (Transpose) · **Spec:** [Chordify for piano](../superpowers/specs/2026-10-26-chordify-for-piano.md)

## Context

The owner, on a phone:

- Not every song opened in the editor. A song written in degrees (`isDegreePiece`) had no version to edit, and
  Edit failed without a word.
- Switching Practise · Edit made the controls jump. The editor's bar was Close · mode · eye, the Player's Close ·
  mode · MIDI · Setup · More over its tools row; the editor's transport had five controls and the Player's seven.
- The title, clicked, became a large box with the phone's selection handles over the chord row.
- "Tune" said nothing of what it does.
- In the Pages layout, a tap on the sheet brought the canvas's zoom buttons into sight, and the next tap, meant
  for the music or to close a popover, landed on them.

forScore's palette draws each clef, key, time and barline as a large tile, the sign on a staff with its name under
it. Its Transpose, and another app's Transpose sheet, move a song by semitones, say the key it lands in, choose
whether the key and the chords move, and preview the result.

## Decision

- **Every song is editable.** A song written in degrees opens as its chart in its key, its degrees read to chords
  as the Player plays them (`asChartPiece`); its version is written as any other's. A test opens every catalog
  piece in the editor and writes it back unchanged.
- **One bar.** Close and Practise · Edit stand first in both modes. The slots after them are the same three
  round buttons: the Player's MIDI · Setup · More, the editor's MIDI · Undo · Redo.
- **One tools row,** under the bar, the Player's row (`PlayerTools`, `PlayerTool`) at its height in both modes:
  the Player's View · Transpose · Simplify (and its own tools after), the editor's View · Transpose, then the edit
  row's commands (Delete, Copy, Cut, Paste: `EditCommands`). The editor's View moves there from the eye, named
  Sheet music, its icon alone on a phone held upright.
- **One transport** (`Transport`): the tempo, ‹, Play, ›, then three of the screen's own, each a transport
  button's size. The Player's loop, Sound and hands; the editor's Record, Takes (greyed with its reason until the
  song has one) and the recording settings (the metronome and Play melody). Play stands in the same spot in both
  modes. While a take records, its strip stands in the transport's place.
- **Transpose in the editor:** its sheet moves the draft by semitones (− and +, within `TRANSPOSITION_RANGE`), the
  key it lands in shown as major and relative minor (`E♭ / Cm`) by its simplest signature (`transposedKey`),
  **Apply to key** and **Apply to chords** as switches with their ⓘ, and a preview of the first line
  (`firstLine`) that opens to the whole song full screen. Transpose writes the version in one step; Undo takes it
  back (the draft's `transpose`).
- **The palette's Clef, Key signature, Time signature and Barlines & repeats** are grids of picture tiles: the
  sign drawn on a staff, its name under it (a key by its major, its relative minor in small type, a time with its beat grouping in
  small type, each barline by name). A greyed tile keeps its reason in its tooltip.
- **The title is edited in place,** at its printed size, as wide as what it holds, a line under it and no box, so
  the phone's handles stay on the text and nothing under it is covered. The keyboard's Done (`enterKeyHint`)
  saves it. The bar of ‹ › ✓ over a phone's keyboard is the browser's own form bar, not the app's.
- **Play melody.** The switch that plays the song's top single staff along (the Setup's tune, Settings ›
  Recording and the recording strip) is named **Play melody** («Играть мелодию»), its ⓘ naming the staff it
  plays. In code it stays the tune.
- **No tap is trapped.** The canvas's zoom buttons come into sight only as the pages are moved, pinched or
  wheeled, never at a tap, and a tap on the pages hides them; out of sight they take no pointer. A script in the
  agent's scratchpad taps each thing printed on the sheet after opening and closing each popover of both modes, in
  every layout at three sizes, and fails where anything else stands under the finger.

## Consequences

- **`entities/piece`:** `asChartPiece`; `versionableEntry` reads every catalog piece, one in degrees as its chart.
- **`features/score-editor`:** `transpose` (the notes, the key and the chords as asked); `firstLine`.
- **`widgets/practice-player`:** `Transport`, the pill both modes share; `PlayerTool`'s `brief` (its icon alone on
  a phone held upright).
- **`pages/score-editor`:** `EditorLead`, `EditorActions`, `EditorToolsRow`, `EditCommands`, `TransposeSheet`,
  `RecordingSettings`; the palette's `sign-pictures` and `palette-keys`; the eye and the old edit row are gone.
- **`shared/ui`:** `PageCanvas` shows its zoom buttons as the pages move, never at a tap.
- Every new string is in English and Russian.
