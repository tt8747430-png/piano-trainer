# The editor as notation software (ADR 0091)

Rounds, each its own commits, merged to main:

1. **Model.** `Draft` without `voices`/`instruments`; `DraftBar` without `rh`/`lh`; `readDraft` writes out the
   pattern for every bar (`arrange` → `playedHands`, as `writeOut` did) so `readDraft` takes the arranged
   performance or `readDraft(music, patterns)` arranges itself; `writeDraft` writes every bar of both hands;
   actions `writeOut`, `backToPattern`, `sectionPattern`, `voiceStaff`, `instrument` removed; `Layer` is
   `'chords' | 'melody' | HandId`. `PieceMusic`/`ChartPiece` lose `voices`, `instruments`; `HiddenRow` is
   `chords | melody | piano`. `ExtraVoice` and `Instrument` removed from `shared/lib`. `pt-pieces` version bump.
   `line-music.ts` loses `played`/`pattern`; `ScoreSheet` draws no soft notes.
2. **Song sheet** (Setup): title · key · time signature · tempo; **Staves**: Melody, Piano, Chord symbols as
   switches with an eye (never all off). Delete `StaffList`, `AddPart`, `InstrumentChoice`. `BarKeys` without
   write out/pattern; `SectionHeading` menu without pattern. Layer names: Melody · Upper staff · Lower staff ·
   Chord symbols.
3. **Accidentals and fingering as Flat's.** ♯ ♭ ♮ toggle; fingering 1–5 keys on the chosen notes (one per
   note, the chord's notes top down when several), Clear; `FingeringPanel` replaced.
4. **Song pages consistency:** the piece page, Songs, Player and editor share rows, headers, menus, icons
   (one `ActionMenu`, one `RoundLink`, one empty state); no duplicated helpers.

## Later rounds

5. **Editing modes and the selection clipboard** (ADR 0092): Replace · Insert · Chord; Copy · Cut · Paste on the notes
   chosen.
6. **Lyrics** (ADR 0093): `ChartPiece.lyrics`, verses of syllables under the tune; MEI `<verse><syl>`; the palette's
   Lyrics field with Flat's keys; the View menu's Lyrics switch.
7. **Code review** of `features/score-editor`, `pages/score-editor`, `widgets/score-sheet`, `shared/ui/score` for
   bugs, duplication and dead code after the rounds above.
