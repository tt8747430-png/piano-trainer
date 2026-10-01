# 76. Every Setup passes `PlayerSetup` four mode booleans, and the four Setups share a clump of props

Status: done
Severity: P2
Tier: 7
Rule: `architecture-avoid-boolean-props`; Data Clumps
Where: `WalkSetup.tsx:39-42`, `ChromaticSetup.tsx:51-54`, `ProgressionSetup.tsx:31-34`, `PieceSetup.tsx:51-54`

## What is wrong

`methods={false} melody={false} keyed compound={false}` at each caller; `open, onOpenChange, choice, swing, onChange, onSwing` travel together through all four, with the pages' `setupOpen` state.

## The test that shows it

For Tier 7 (component APIs), which owns `widgets/player-setup`.

## The fix

Tier 7.

## Comments

Done in Tier 7. The four booleans were facts about the music, written again (and differently) by each URL reader:
`resolveChoice` kept a melody pattern on a piece without a tune while the sheet showed it closed.

- `PatternFit` (the pattern entity's `fit.ts`): `figureNeed`, `patternNeed`, `playablePattern`, `playableFigure`; each
  source's fit beside its defaults (`WALK.fit`, `PROGRESSION.fit`, `CHROMATIC.fit`) and `pieceFit` (piece entity).
  The sheet and all four readers use it; `needsMelody`, `needsKey`, `splitsBeat` go. Tests: `fit.test.ts`, the
  readers' "plays the music's own pattern when the URL names one it cannot play".
- `PlayerSetup({ figures, fit, onFigures, children })` owns its button and open state (`SheetTrigger`), placed by
  `PlayerLayout`'s `setup` slot; the pages hold no `setupOpen`. `PatternPage` and `FigurePage` close by `fit`.
- One `onChange` per Setup: the walk's root, the chromatic walk's chords, root and direction, and a progression's key
  fold into its change type.
- `choosableChordSize` and `isOwnKey` (piece entity) replace the conditions written three and two times.
