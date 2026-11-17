# F8 · Voice 2 on a staff, and F9 · Cross-staff notes

## Source

- Research F8 and F9 (`research-editor.md`): Flat's V and ⇧V, Dorico's ⇧V Create Voice; Dorico's cross-staff,
  "piano music needs it constantly" (`PIANO_TRAINER_VS_DORICO.md` §5 M1, M2).
- Loop round 61 (2026-11-17): the research's last two editor items.

## Today

- A draft note (`features/score-editor/model/draft.ts`, `DraftNote`) has no voice. Notes on one staff that overlap
  in time are split into one or two voices at engraving, by onset and mean pitch (`shared/lib/notation/voices.ts`,
  `separateVoices`, called from `notate.ts:243`). The higher voice gets stems up.
- The caret writes a note at its tick on its staff. A note written where one sounds joins it as a chord, or replaces
  it; there is no way to write a held note under a moving tune on one staff.
- A Performance note (`shared/lib/arrangement/types.ts`, `PerformanceNote`) has `hand` and `staff`, no voice.
- No cross-staff: a note is drawn on its hand's staff.

## Will build

### F8, Voice 2

1. **Model.** `DraftNote.voice?: 2` (absent is voice 1). `PerformanceNote.voice?: 2`, carried by `arrangeDraft`.
   The song's saved music keeps it (bump the store's version, no migration: CLAUDE.md "Saved stores read one
   version").
2. **Engraving.** `separateVoices` takes the written voice where a note has one: voice 2's chords go to the
   second voice, stems down; notes with none are placed as today. A voice-2 gap is the invisible rest the type
   already has (`types.ts:146`).
3. **Writing.** Editor state `voice: 1 | 2`. With voice 2 on, a note written at the caret replaces only voice 2's
   notes it overlaps, never voice 1's. Delete in voice 2 removes voice-2 notes alone.
4. **Control.** In Note's Input mode group, after Chord: "Voice 2", a toggle key (pressed while on), ⇧V (V alone
   is the piano's). Its tooltip "Voice 2 · ⇧V". Greyed with "Choose a note on a staff" in the chord row (F1's
   rule).
5. **Words.** The strip's line: "Bar 4 · beat 1 · Lower staff · voice 2". en and ru (`голос 2`).
6. **Canvas first.** The Voice 2 key in the Editor boards' Input mode group, its on state, and a bar with a held
   half note under two quarters on the lower staff, drawn on Editor and EditorLaptop before the port.

### F9, Cross-staff

1. **Model.** `DraftNote.cross?: 'up' | 'down'`: drawn on the other piano staff, still its hand's (heard, fingered
   and scored as written). `BarNote.crossing` exists already (`voices.ts:18`) and is the engraving's hook.
2. **Keys.** ⌘⇧↑ "Cross to upper staff", ⌘⇧↓ "Cross to lower staff" on the notes chosen of the piano's two
   staves; ⌘⇧ with the arrows no longer repeats the octave move.
3. **Palette.** Two keys in Pitch after the octave pair, greyed off the piano's staves with "Available on the
   piano staves only. Select a note on the upper or lower staff." (the Fingering field's `reason.hand`).
4. **Canvas first,** as F8.

## Order

F8 canvas → F8 model and engraving → writing and the key → words; then F9 the same way. One commit each.
