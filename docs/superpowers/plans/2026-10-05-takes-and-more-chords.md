# Takes and More Chords Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Record takes from a MIDI keyboard in the score editor (heard back, downloaded as `.mid`, written into the
score on request), and let the Chord finder name voicings with tones left out, 7sus4♭9 and add♯11.

**Architecture:** The MIDI and audio ports gain what timing and the pedal need; a new `entities/take` holds takes
(saved compactly in `pt-takes`) and their pure logic (sounds, quantising, `.mid`); `features/record-take` turns port
events into a take; the score editor writes a take as one undo step; its page holds the Recorder sheet. The finder
change stays in `shared/lib/music` over the builder's chords.

**Tech Stack:** React 19, TypeScript 6 strict, zustand (`createSavedStore`), Vitest 4 + Testing Library, Base UI /
shadcn primitives, i18next.

**Spec:** `docs/superpowers/specs/2026-10-05-takes-and-more-chords-design.md` · **ADR:** 0028

## Global Constraints

- FSD import rules (lint): `shared/lib/music` imports only itself; entities import shared only; features import
  entities and shared; pages import widgets, features, entities, shared.
- Every UI string in `en` and `ru` (`src/shared/i18n/locales/{en,ru}/<namespace>.ts`); counts after a colon.
- Saved stores are `createSavedStore`s with a version and one sanitiser; `pt-settings` goes to version 7.
- Test first; `globals: false`; fakes, never module mocks; prettier on touched files only.
- Verify: `npm run typecheck && npm run lint && npm run test`, then `npm run build` (startup and routing change).
- Commit on main.

## Review Focus

1. A key held across Stop, or the pedal down at Stop: the note ends at Stop, the take keeps it (Task 5 tests).
2. Leaving the editor mid-take keeps the take (Task 9 app test).
3. A take whose notes run past the piece's end: bars are added, nothing dropped (Task 7 test).
4. Saved takes from a damaged store (wrong tuple lengths, notes off the piano, NaN): dropped one by one, the rest kept
   (Task 4 test).
5. A recording stopped during the count-in leaves no take and the editor usable (Task 9 app test).

---

### Task 1: The Chord finder names more chords

**Files:** `src/shared/lib/music/chord-parts.ts` (+test), `chord-finder.ts` (+test), `index.ts`;
`src/widgets/chord-finder/ui/FinderName.tsx`, `use-finding-said.ts`; `src/widgets/chord-explorer/ui/ChordBuilder.tsx`
(added-tone label); locales `learn`, `music`.

**Produces:** `ADDED_TONES` gains `'addS11'` (major triad only, interval `A11`, symbol `add#11`); `alterationsOf`
gives `['b9']` for a sus4 7th chord and up; `FoundChord.leftOut: readonly LeftOut[]`, `LeftOut = '3rd' | '5th' |
'9th' | '11th'` (replaces `no5th`); exported `LEFT_OUT`.

- [ ] Tests (red): `C E B♭ A` → `C13` with `['5th','9th']`; `C E♭ B♭ F` → `Cm11` first; `C E B A` → `CMaj13`; `C E♭ A
  D` → `Cm6/9` `['5th']`; `C F G B♭ D♭` → `C7sus4♭9`; `C G B♭` → `C7` `['3rd']`; `C E G F#` → `C(add#11)`; `E A D G B`
  → `Em11` first; `E G B D` stays `Em7` first; a 6th without its 5th is not taken (`C E A` → `Am/C` first);
  `alterationsOf` for sus4 7 → `['b9']`; the builder's chord count updated; tensions test still holds.
- [ ] Implement: shapes per `CHORD_PARTS` entry with every subset of its omittable tones (≥3 tones left); rank
  `[bass, leftOut.length, quality, tones]`; UI shows each left-out tone after the quality; screen reader says them.
- [ ] Verify and commit "Chord finder: shells with tones left out, 7sus4♭9 and add#11".

### Task 2: The MIDI port stamps time and reads the pedal

**Files:** `src/shared/api/midi/{types,parse-message,web-midi,fake-midi,index}.ts` (+tests).

**Produces:** `NoteEvent { midi, on, velocity, time }` (`time`: ms on `performance.now()`'s clock);
`PedalEvent { down: boolean; time: number }`; `MidiMessage = ({ kind: 'note' } & NoteEvent) | ({ kind: 'pedal' } &
PedalEvent)`; `parseMidiMessage(data, time): MidiMessage | null`; `MidiInput.onPedal(listener)`; fake:
`press(midi, { time?, velocity? })`, `release(midi, { time? })`, `pedal(down, { time? })`.

- [ ] Tests (red): CC 64 ≥ 64 down, < 64 up, other controllers null; web adapter emits `time` from the event's
  `timeStamp`, emits pedal, lets the pedal go when its keyboard is unplugged; fake emits times.
- [ ] Implement; existing consumers keep working. Commit "MIDI: each event's time, and the sustain pedal".

### Task 3: The audio port says what time was heard

**Files:** `src/shared/api/audio/{types,web-audio,fake-audio}.ts` (+tests).

**Produces:** `AudioOutput.audioTimeAt(pageTime: number): number` — web: `heard() + (pageTime − pageNow()) / 1000`
(`heard`: the context's time less its output latency), `pageTime / 1000` before a context exists; fake: `pageTime /
1000` (its clocks start together).

- [ ] Test (red) with a stub context and page clock; implement; commit "Audio: the audio time heard at a
  moment of the page's clock".

### Task 4: Takes are saved (`entities/take`), with `createSavedStore`'s `write`; settings v7

**Files:** `src/shared/lib/saved-store.ts` (+test); `src/entities/take/{index.ts, model/types.ts, model/store.ts,
model/selectors.ts, model/context.ts}` (+tests); `src/entities/settings/model/{types,store,selectors}.ts` (+tests);
`src/features/set-preference/set-recorder-click.ts`; `src/app/{App.tsx, testing/render-app.tsx}`, `src/main.tsx`;
`.dependency-cruiser`/eslint boundaries if a new entity must be registered.

**Produces:**
```ts
type TakeId = `take-${number}`
interface TakeNote { midi: Midi; at: number; held: number; velocity: number } // ms, 1–127
interface PedalPress { down: number; up: number }                             // ms
interface Take { id; pieceId: PieceId; made: number; tempo: number; meter: Meter; length: number;
                 notes: readonly TakeNote[]; pedal: readonly PedalPress[] }
interface TakesState { takes: readonly Take[]; nextTake: number }
TAKES_STORAGE_KEY = 'pt-takes'; TAKES_VERSION = 1; NOTES_ROOM = 60_000; LONGEST_TAKE_MS = 600_000
createTakesStore(saving), TakesStoreProvider, useTakes, useTakesStoreApi
selectTakesOf(state, pieceId): Take[] (newest first); selectRoomLeft(state): number
createSavedStore({ …, write?: (state) => unknown })
settings: recorder: { click: boolean } (default true), SETTINGS_VERSION 7, selectRecorderClick
setRecorderClick(store, on)
```
- [ ] Tests (red): `write` is what is saved and `read` reads it back; takes round-trip compactly; a damaged note,
  press or take is dropped alone; ids never reused; a version-6 settings save gains `recorder.click: true`.
- [ ] Implement and wire the store into `main.tsx`, `App`, `renderApp`. Commit "Takes are saved: pt-takes".

### Task 5: A take from what was played (`features/record-take` pure parts)

**Files:** `src/features/record-take/model/{take-of.ts, recorder-clicks.ts}` (+tests), `index.ts`.

**Produces:**
```ts
type Played = ({ kind: 'note'; midi; on; velocity } | { kind: 'pedal'; down }) & { at: number } // audio s
takeOf(played: readonly Played[], { downbeat: number; stop: number; tempo: number }):
  { notes: TakeNote[]; pedal: PedalPress[]; length: number }
recorderClicks({ barTicks: readonly Tick[]; meter; tempo; click: boolean; longest: number }):
  { sounds: ClickSound[]; countIn: number /* s */; barStarts: number[] /* s after the downbeat */ }
```
- [ ] Tests (red): grace of half a beat before the downbeat; earlier notes dropped; re-strike ends the earlier note;
  held keys and pedal end at Stop; velocities kept; count-in of the meter's beats, accents at the piece's bars, the
  meter's bars past the end, no clicks after the count-in with the click off.
- [ ] Implement; commit "Record take: a take from the keys and pedal played".

### Task 6: A take heard, quantised and written as `.mid` (`entities/take` pure parts)

**Files:** `src/entities/take/model/{sounds.ts, quantise.ts, midi-file.ts}` (+tests); `src/shared/lib/download-file.ts`
(+test).

**Produces:** `takeSounds(take): NoteSound[]`; `TakeGrid` and `takeGrids(meter): readonly TakeGrid[]` (each a
`Duration`), `quantise(take, gridTicks): QuantisedNote[]` (`{ midi, startTick, durationTicks }`, ticks from the
take's start); `takeTicks(take): Tick`; `midiFile(take): Uint8Array`; `downloadFile(bytes, name, type)`.

- [ ] Tests (red) as spec §7; implement; commit "Takes: heard as played, snapped to a grid, written as a MIDI file".

### Task 7: The score editor writes a take

**Files:** `src/features/score-editor/model/{take-edits.ts, state.ts, editor.ts}` (+tests), `index.ts`.

**Produces:** `TakeInto = 'both' | NoteLayer`; `takeParts(notes, into, split: Midi): TakePart[]`
(`{ layer: NoteLayer; notes: QuantisedNote[] }`); action `{ type: 'take'; parts: readonly TakePart[]; ticks: Tick }`
written at the caret's bar over whole bars (`writeTake(draft, from, ticks, parts)`).

- [ ] Tests (red): whole bars replaced from the caret's bar; hand bars written out, silent where nothing was played;
  bars added past the end; melody one line; notes spelled in the key; one undo step; nothing played → no step.
- [ ] Implement; commit "Score editor: write a take into the score".

### Task 8: The recorder hook and the takes commands

**Files:** `src/features/record-take/use-recorder.ts` (+test), `src/features/manage-takes/{save-take,delete-take,
index}.ts` (+tests), `src/features/edit-piece/delete-song.ts` (+test).

**Produces:** `useRecorder({ barTicks, meter, tempo, click, room, onTake }) → { stage: 'idle' | 'counting' |
'recording'; start(): void; stop(): void; progress: { bar: number; seconds: number } }` (`bar`: 0-based bars after
the start); `saveTake(store, { pieceId, take })` → `TakeId`; `deleteTake(store, id)`; `deleteSong(pieces, takes, id)`.

- [ ] Tests (red, `renderHook` with fake audio and MIDI): start schedules count-in clicks; keys before the downbeat
  ignored; Stop builds the take; stop in the count-in gives none; unmount mid-take saves; the room stops it.
- [ ] Implement; commit "Record take: the recorder, saving and deleting takes".

### Task 9: The Recorder in the score editor, and Make and record

**Files:** `src/pages/score-editor/model/{use-score-editor.ts, editor-context.ts, use-recorder-sheet.ts}`;
`src/pages/score-editor/ui/{EditorToolbar.tsx, ScoreEditor.tsx, RecorderSheet.tsx, TakeRow.tsx, WriteTakeForm.tsx,
RecordingStrip.tsx}`; `src/app/routes/player-search.ts` and `router.tsx` (`record` search on `/edit/$pieceId`);
`src/pages/songs/ui/NewSongSheet.tsx`; locales `editor`, `songs`; `ScoreEditorPage.test.tsx`, `SongsPage.test.tsx`.

- [ ] App tests (red): record → count-in → keys → Stop → listed; play; write both hands; undo; download; delete
  (asked once more); no MIDI line; Make and record opens the Recorder; leaving mid-take keeps it; stop in count-in.
- [ ] Implement; commit "Score editor: the Recorder: record, hear, write and download takes".

### Task 10: Docs and verification

**Files:** `CLAUDE.md`, `docs/UBIQUITOUS_LANGUAGE.md`, `docs/superpowers/specs/2026-09-25-next-features-roadmap-design.md`
(§5 built), `DESIGN.md` (the Recorder), `PRODUCT.md` if it lists features.

- [ ] `npm run typecheck && npm run lint && npm run test && npm run build`; commit "Docs: takes and the finder".
