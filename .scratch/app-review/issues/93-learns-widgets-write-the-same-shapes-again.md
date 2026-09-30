# 93. Learn's widgets write the same controls and shapes again

Status: ready-for-agent
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
