# A40 items 3–5 report (Instruments, Layout, Recording)

## Built
- **3 Instruments** (`InstrumentsPanel`, `widgets/instrument-list` `StaffList`): All switch, rows with drag
  handle (single staves; the piano stays under them), name, S (solo), eye, ⋯ (Rename in place, Change
  instrument, Delete… via `ConfirmDialog`), New instrument menu, Sort › Score order. S/eye/All write the
  Player's `staves=` (added to `editSearch`, replace); the editor's Play mutes (`heardSounds`), its sheet
  hides, and the caret skips hidden staves. Choices follow their staff on move/delete. Reducer:
  `moveStaff`, `orderStaves`, `staffInstrument`. Settings › Staves shows the same panel; New song keeps
  `InstrumentList`.
- **4 Layout** (`LayoutPanel`): first page live (`ScorePage`, Verovio page mode via `pageOptions`), folds
  Pages (orientation, size, four margins cm), Staves (staff mm 5–9, space between staves/systems),
  Hide empty staves, Measures (note spacing, measures per system/Auto via `<sb/>`), Measure numbers,
  Music font (Bravura/Petaluma/Leland); Reset asked first. `PieceLayout` rewritten
  (`entities/piece/model/piece-layout.ts`), `pt-pieces` 10→11. MusicXML export writes `<defaults>`.
- **5 Recording**: recording bar (`RecordingBar`: Metronome switch + tempo, Start countdown Off/1/2 bars,
  device name, "Play to start recording…", Stop). Countdown Off waits for the first note (recorder
  `waiting` stage); `recorder.countIn` in pt-settings (home: score Settings › Recording). A take kept
  opens **Review your recording** (`RecordReview`, replaces `WriteTakePage`): engraved result over the
  piano roll (raw faint, snapped in accent), Quantize 1/4·1/8·1/16·1/4t·1/8t, Hide raw notes, draggable
  split point ("Split point: C4", arrows too), Into, Discard (asked), Save to score.

## Commit
One commit `R29-A40: …` for items 3–5 (they share files: panel, Settings pages, i18n, tests).

## Rulings (cost if wrong)
- Sort has Score order only: the draft keeps no order of addition, so "As added" has nothing to sort by
  (needs a per-staff stamp in saved music).
- Preview sits above the folds, small and not sticky: a sticky page left no room for the groups on a
  phone or beside the on-screen piano (one class).
- Countdown 1/2 bars counts in at once on Record (as before); the bar's countdown is changeable while a
  take waits for its first note.
- Layout saves are the page/print/export's; the editor's own lines still follow staff size and measures
  per system only.

## Left, with why
- Layout: Templates, note-head colours/shapes (Boomwhackers, solfège), chord-symbol style, text styles,
  start page/measure numbering, count the pickup: no engine for them in Verovio options or our MEI.
  Font samples per choice (needs an engraving per font). PrintedScore (Print) does not yet read page
  size/margins.
- Recording: the bar's MIDI popover (input/output menus, Write while playing, Record live MIDI) and
  "select and Split" — the bar's tools are item 6.
- Pre-existing failures, not from this work: `PiecePage.test.tsx` (2, Settings groups), 
  `composition-root.test.ts` (no Supabase env in a worktree).

No migrations. Screenshots: `.scratch/r29/shots/after/a40-{instruments,layout,review}-*.png`, no overflow.
