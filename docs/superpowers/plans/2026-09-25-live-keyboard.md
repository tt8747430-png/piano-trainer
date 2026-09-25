# The live keyboard and the Phase 3 review fixes: plan

Design: [`2026-09-25-live-keyboard-design.md`](../specs/2026-09-25-live-keyboard-design.md). Executed inline on `main`,
test first (`tdd`). Each task ends green on `npm run typecheck && npm run lint && npm run test`; tasks 8 and 11 also run
`npm run build`. One commit per task.

## 1. Kernel and schedule

- [ ] `music/pitch.ts`: `PITCH_CLASSES` (0–11). Replace the three local copies.
- [ ] `music/keyboard.ts`: `PIANO` (A0–C8) and `MIDDLE_OCTAVES` (C4–B5, the explorers' least range).
- [ ] `music/note.ts`: `NoteParam` (branded string); `noteParam` returns it; `noteFromParam` takes it.
      `ChordView.root`, `ScaleView.root`, `SetupParams.key` and the Player's `key` become `NoteParam`.
- [ ] `schedule`: `TEMPO_RANGE`; `keySound(key)`; `scaleRun` returns its sounds (cues and `KeyCue` go);
      `sounding.ts`: `keyWindows(sounds, at)`, `keysSoundingAt(windows, time)`.
- Tests: pitch classes, piano ends, `NoteParam` round trip, `keySound`, windows (a note sounds from its start until
  its end, clicks never sound, overlapping notes on one key).

## 2. Audio port

- [ ] `shared/api/audio/sounding.ts`: `createSoundingKeys({ now, frame })` → `add`, `clear`, `current`, `subscribe`,
      `update`. With `frame`, it looks again every frame while a window is open.
- [ ] `AudioOutput`: `sounding()`, `onSounding()`. The WebAudio adapter (animation frames) and the fake (`setNow`,
      `play`, `stop` look again) implement them.
- Tests: the log (notifies only on change, `clear` silences, frames stop when nothing is open); the fake; the adapter
  with a fake context and manual frames.

## 3. Services hooks

- [ ] `useSoundingKeys()`, `useSoundKey()`.
- Tests: the keys follow the fake's clock; a key sounds without `stop`.

## 4. The keyboard

- [ ] Tokens: `--key-down` (replaces `--key-pressed`), `--key-shade`.
- [ ] `piano-keyboard/key-look.ts`: `keyLook(state)` with a test of every precedence.
- [ ] `PianoKeyboard`: the whole piano; `range` fills the width (28–48px white keys, container units); centres the
      range on mount and on change; `inView`; roving tab stop with arrows, Home, End; `down`; `onKeyPress` required.
- [ ] Kit: `Pinned`; `SheetTrigger`, `SheetClose`.
- Tests: names and 88 keys; a tap; one tab stop, arrows move and a focused key becomes the stop; looks.

## 5. `features/live-keyboard`

- [ ] `LiveKeyboard`: `down` = sounding ∪ held; a tap sounds, then the caller's `onKeyPress`.
- Tests: a tap sounds without stopping what plays and calls the caller; sounding and held keys go down.

## 6. Screens on the live keyboard

- [ ] Chords: pinned `LiveKeyboard`.
- [ ] Scales: pinned `LiveKeyboard` over the run's keys too; `useLitKey` deleted.
- [ ] Quiz board: `LiveKeyboard`; `choosing`; one action, **Next**, which calls `onFinish` after the last question.
- [ ] Player: `practiceMarks` by hands (Your turn: practised; Listen, Step: heard); `inView`; `LiveKeyboard`;
      `usePlayer` drops `held`, `tapKey` only answers in Your turn; pips show the current beat; note grid labels.
- [ ] Piece: pinned keyboard in the chart section; Back via `useGoBack`.
- [ ] Symbols: pinned keyboard above the dictionary.
- Screen tests: arpeggio keys go down in turn; a run walks the keys; Hear on Symbols; a bar on the Piece; marks by
  hands; Check's single Next then Done; Piece Back to Path.

## 7. Review refactors

- [ ] Path: `pieceStepId`, `stepById`; callers.
- [ ] `CheckPage` via `selectIsLearned`; `CheckResult` one branch per row.
- [ ] `chartSections` (chord-chart model); `beatInBar`; `spellingOf`.
- [ ] `usePieceHeadings`; `useScaleName`; `isMidiConnected`; `SetupMain` `onOpenPage`, `FigurePage`.
- [ ] Reading-note keys are words (en, ru).
- [ ] Songs Clear → no search.
- [ ] `renderApp` returns typed fakes; the screen tests lose their casts; the validators' test goes through the
      router for raw URLs.

## 8. First paint

- [ ] `COLLECTION_IDS`, `isCollectionId`; content test.
- [ ] Routes' `beforeLoad` ask their screens module.
- [ ] `package.json` `sideEffects`.
- [ ] Build: no piece content in a chunk `index.html` preloads.

## 9. Leftovers

- [ ] Delete `primitives/item.tsx`, `separator.tsx`, `textarea.tsx`.

## 10. Records

- [ ] Screens spec §2.1, §2.4, §4.3–4.6, §8, §11.
- [ ] CLAUDE.md, CODE_STYLE (kit, keyboard, `setup.ts` note), glossary (Live keyboard, Down, Pinned), `DESIGN.md`.

## 11. Verify

- [ ] `npm run typecheck && npm run lint && npm run test && npm run build`.
- [ ] Screens in a browser, phone and desktop, light and dark: the keyboards scroll, keys play, an arpeggio and a run
      show on the keys.
