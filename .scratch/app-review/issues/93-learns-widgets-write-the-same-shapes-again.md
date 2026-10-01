# 93. Learn's widgets write the same controls and shapes again

Status: done
Severity: P3
Tier: 7
Rule: Duplicated Code; `vercel-composition-patterns`
Where: the reference and tool widgets, `features/play-example`, `widgets/lesson-view`, the Player's Setups

## What is wrong

- A note pop-up that differs only in its spelling rule, 8 times (`ChordBuilder`, `ScaleChoice`, `IntervalExplorer`, `TensionExplorer`, `ReharmoniseTool`, `WalkSetup`, `PieceSetup`, `ChromaticSetup`), beside the one `KeyDropdown`.
- A chord size and inversion pair with its clamp, 3 times (`ChordExplorer`, `ChordsView`, `KeyChordsSection`).
- A scale-chord grid twice (`KeyChords`, `KeyChordsSection`); a chord's or a scale's key marks 3–4 times; "the keys played, else the default" state 4 times; `keys={shown.keys} marks={shown.marks}` at 5 keyboards.
- A tone chip 3 times, a pressed chord toggle 3 times, a Play → Stop button 7 times, the card and staff wrappers.
- A played row twice (`SuggestionCard` and `ProgressionRow`), a tool's typed field twice (`ChordField`, `ProgressionField`), a lesson quiz's verdict beside the Theory quiz's (`lesson-quiz.ts:37-55`, `quiz-keys.ts:42-56`).
- A key's name in two namespaces (`learn:keys.major/minor`, `music:key.major/minor`).

## The test that shows it

For Tier 7.

## The fix

For Tier 7, with 76.

## Comments

Done in Tier 7, item by item:

1. `NoteDropdown` (kit, with a `name` rule) at eight sites; `qualityRootSpelling` (kernel) for the root rule written
   five times, `chromaticRoot` gone.
2. `fitInversion` and `STACK_SIZES` (kernel), `InversionChoice` and `ChordSizeField` (kit), their words in `music`.
3. `ScaleChordGrid` (play-example; fixed 115), `chordShown` / `scaleShown` / `chordsRange` for six mark builders,
   `useShownKeys` for five "played, else the default" states; `ShownKeys` moves to the kit and `ExplorerKeyboard`
   takes it whole.
4. `ToneChip` and `PlayToggle` (kit; the passing chords row gains its Square), the `card` utility for 19 copies;
   Play → Stop: `toggle` takes its sounds lazily (113). Dropped: a staff wrapper (contextual).
5. `ChordRow` / `RowChords` / `RowPlay` (any row of chords; `ROW_TEMPO` once), `TypedField` (kit), `readChordSymbol`
   (kernel), `checkedKeys` (features/quiz; the Theory quiz's `answerKeys` over it).
6. `useKeyName` (i18n) for seven key names; the kernel's short name is `keySymbol`. Beyond: `writtenSymbol` for four
   hand-written symbols, `toggled` for three list toggles.
