# A34/A40 report (the score editor against Flat)

## Built (one commit each, `R29-A34:` / `R29-A40:`)
- **A34.1 Palette glyphs**: `shared/ui/smufl` holds Bravura outlines (OFL) for clefs (their own 8/15 glyphs),
  time figures, accidentals, tuplet figures, octave marks, grace notes, arpeggio arrows. `PaletteGlyph`,
  `TupletGlyph`, `OctaveLineGlyph` in `palette-glyph.tsx`. All drawn at one scale. Key groups are 44px cells in
  centred rows.
- **A34.2 Key grid**: 15 cells (C/Am first), each on a short staff named "E♭ / Cm", Major · Minor above. Switch
  to natural is gone. The Practice pages share it.
- **A34.3 `TimeSignatureField`**: the tiles, Other (Beats stepper + Beat unit menu), Pickup, and Apply to (From
  this bar · Whole song, `TimeChoice.whole`). Used in the palette, the printed sign, Settings and New song. Each
  choice applies at once as one undo step.
- **A34.4 Tempo**: `TempoField` has Beat, BPM (typed, ↑↓ ±1, ⇧ ±10, − + repeat while held), Tempo text (saved as
  `tempoText`, printed bold before the mark) and ▶ Hear. The popover adds Save. Text › Tempo change sets a mark
  at the caret, with Save and Delete. The drag and the typed tempo field are gone.
- **A34.5 New song**: the steps are named Title · Instruments · Time and key. Step 3 has Time signature, Key
  signature, Tempo, Pickup bar and Number of bars (`chartStart` pickup). Instruments already worked one way (+,
  then − 1 +).
- **A34.6**: the gap list is in `.scratch/r29/editor-gaps.md`. Built: arpeggio up/down (kernel, MEI, MusicXML,
  roll order, palette).
- **A34.7**: `clefFor` (70% rule); a hand the pattern plays whole opens in the clef its notes read in. The clef
  palette asks This bar only · To the end · Whole staff.
- **A34.10**: the toolbar's tooltips open below it on a laptop, above the phone's quick row.
- **A34.11**: `ScoreSkeleton` (staves at final size, "Bar 12 of 48") stands in for every engraving.
- **A40.1**: `EditorPanel` has Notation · Instruments · Layout, saved as `?panel=` (replace). The phone's sheet
  shows the same three segments.
- **A40.2**: the groups have Flat's names and order (`modes`, `measures`). Replace/Insert was already built as an
  editing mode.

## Rulings (cost if wrong)
- The glyph em is 22px, not 24, so the tallest clef fits its 44px cell. Cost: one constant.
- Major · Minor keeps the tonic (C → Cm), as the Practice pages expect. Cost: one line.
- Time: beats 1–12 over 2/4/8 (the kernel's `Meter`), not 1–32. Cost: a kernel change.
- Mid-song tempo marks have no beat unit or words; the model holds a number only. Cost: a `NoteMarks` change.
- Instruments and Layout tabs reuse the Settings pages' lists, so both places show the same controls.
- Respell stays ⇧J, because a bare letter plays the piano.

## Left
- A34: cross-staff notes and custom n:m tuplets (kernel note model). A34.8/9 (transport room, one gutter) look
  right in the screenshots and were not changed.
- A40.3: solo/eye/drag/New instrument/sort. Solo and eye need A35's `staves=` model (the Player agent). Note
  that "Move up/down" in a menu breaks the owner's drag rule.
- A40.4: Layout groups, `PieceLayout` growth and the `pt-pieces` bump.
- A40.5: MIDI recording review.
- A40.6: the bar's tools.
- The bar's title is clipped at 402px (ScoreBar, shared with the Player).
- `composition-root.test.ts` fails in this worktree because there are no Supabase env vars.

No migrations.
