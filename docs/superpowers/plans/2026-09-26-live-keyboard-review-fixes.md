# The live keyboard's review fixes: plan

The two-axis review of `95d291d...fc9cc6e` (the live keyboard and the Phase 3 review's fixes) found seven standards
findings, five spec findings and flaky screen tests. The owner asked to fix all of it with "no backwards compatibility
or legacy leftovers or workarounds", refactoring where a good solution needs it. Executed inline on `main`, test first
(`tdd`). Each task ends green on `npm run typecheck && npm run lint && npm run test`.

## 1. Screen tests wait for the app, not for the runner

Under load the first screen of a test file stayed on `RoutePending` past Testing Library's one second, because the
runner was still importing the screen's lazy chunk (eleven different screen tests failed across six runs).
`renderApp` becomes async: it loads every route's chunk through the router (`router.loadRouteChunk`) before it renders,
so a test's waits measure the app. Every call site awaits it. No timeout is raised.

## 2. Back never returns into a screen opened directly

The Player opened directly closed to its Piece with a plain `navigate`, so the Piece's Back found the Player in the
history and went back into it. `useGoBack(fallback)` takes the fallback's navigation options and navigates with
`replace: true`, so the screen that was opened directly leaves the history as the learner leaves it. The Player,
the Piece and the Check all use it. Test first: the Player opened directly, closed, then Back on the Piece reaches
Songs.

## 3. The words the glossary settled, in the code

The glossary (2026-09-25 grilling) is the code's vocabulary, so the code takes its words now rather than the glossary
marking them pending:

| Glossary                     | Code before                                    | Code after                                           | Interface (en / ru)                        |
| ---------------------------- | ---------------------------------------------- | ---------------------------------------------------- | ------------------------------------------ |
| **Study**                    | kind `'exercise'`, collection `exercises`      | kind `'study'`, collection `studies`                 | Study / Этюд; Studies / Этюды              |
| **Wait mode**                | mode `'turn'`, `TurnFeedback`                  | mode `'wait'`, `WaitFeedback`                        | Wait / Ожидание                            |
| **Chord size**               | `Voicing`, `VOICINGS`, `voicing` (piece, URL)  | `ChordSize`, `CHORD_SIZES`, `chordSize` (piece, URL) | Chord size / Аккорды                       |
| **Key** (major or minor)     | `Key.mode: Mode`                               | `Key.minor: boolean`; `Mode` goes                    | unchanged                                  |

- Piece ids (`ex3`, `exm1`…) stay: saved progress names them (`piece:ex3`).
- A Study's `practice` section is headed **Practice** / «Практика»: "Exercise" is Practice's word now.
- URLs change with the words (`mode=wait`, `chordSize=ninths`, `collection=studies`); an old value falls back to the
  default like any other unknown value. Nothing saved changes shape.
- "Voicing" stays where it means a layout of notes (`voice-leading.ts`).
- Living docs follow (CLAUDE.md, PRODUCT.md, CONTENT.md, the glossary, the screens spec, the roadmap); dated specs,
  plans and ADRs stay as the record of their day.

## 4. Review refactors

- **`FigurePage`:** the Right and Left hand pages are one component over a hand's figures.
- **`PITCH_CLASSES`** replaces the quiz machine's own list of roots.
- **`HANDS`** (schedule) is the one list of hand choices (the Player's validator, the Setup); `practisedHands` is
  `audibleHands` without the tune, and the Player's hook memoises the hands it marks.
- **`KeySpan`** names `spanOf`'s result; `useKeyboardScroll` takes a span, and reads the keys in view on a range
  change through `useEffectEvent` instead of a ref copied in a layout effect.
- **The keyboard names itself:** `PianoKeyboard`'s group is "Keyboard" from `common:keyboard`; no screen passes it.
- **`ExplorerKeyboard`** (`features/live-keyboard`): the pinned keyboard both explorers show, at least the middle
  octaves, grown to hold the keys and kept on them.
- **`CheckResult`:** `openLabel` and `explorerLink` say what they hold.

## 5. Docs

- CODE_STYLE §5 names `--key-down` and `--key-down-tint`.
- The live-keyboard spec says the keyboard opens on the keys in view, else on its range; its plan names
  `--key-down-tint`.
