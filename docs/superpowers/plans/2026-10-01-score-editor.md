# The score editor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The learner writes their own version of any song, study or listing (chords, melody, and any bar of either
hand note by note), and songs of their own from scratch, in a score editor with undo and redo and input from the
mouse, the computer keyboard and MIDI; the Player plays their version; Reset to the original takes it back.

**Architecture:** A version is the piece's music in the content's own text format (one parser for content and saved
music), saved in `pt-pieces` and looked up through the **repertoire** (`entities/piece`), which the router, Songs, a
piece's page and the Player read. The format gains written hands, which `arrange` plays in place of the pattern's
hand. The editor is a pure draft model with a reducer and history (`features/score-editor`), a sheet widget drawing
one `ScoreView` line per chart line (`widgets/score-sheet`), and a full-screen page whose one hook wires keys, MIDI,
shortcuts, Play and saving (`pages/score-editor`).

**Tech Stack:** React 19, TanStack Router 1.170, zustand (`createSavedStore`, a vanilla store per editor visit),
VexFlow 5 via `ScoreView`, Vitest 4 + jsdom, Tailwind 4, Base UI.

**Spec:** `docs/superpowers/specs/2026-10-01-score-editor-design.md`

## Global Constraints

- FSD (lint-enforced): `app → pages → widgets → features → entities → shared`; another slice only through its
  `index.ts`; `shared/lib/arrangement` and `shared/lib/notation` import only `music` and no package.
- Strict TS, no `any`, no casts, no `eslint-disable`, no arbitrary Tailwind values in markup (a named `@utility`).
- Every UI string in `en` and `ru` (`ru` typed against `en`); a new namespace `editor`.
- `pt-pieces` is a `createSavedStore` (version 1) with one sanitiser that follows other tabs.
- Content and saved music share one format (CONTENT.md); a version equal to its original is no version.
- Ids: own songs `my-<n>`, never reused; a title 1–80 characters; tempo 40–160.
- Editor shortcuts never use a typing key (A–', W E T Y U O P, Z X): digits, `.`, arrows, Home, End, Backspace,
  Delete, Enter, Tab, Escape, and Cmd/Ctrl combinations only.
- Tests colocated, `globals: false`; screens through `renderApp`.
- `npx prettier --write <touched files>`; never `npm run format`.
- Each task ends green on `npm run typecheck && npm run lint && npm run test`; Tasks 5, 11 and 13 also
  `npm run build`. Commit on `main` at the end of each task.

## Review Focus

1. **A saved version that no longer reads** (a hand-edited or older save) must not break the app: the sanitiser drops
   it and the piece plays its original — Task 4 test "drops music that does not parse".
2. **Keys struck together across a caret move** must not merge into the wrong chord: a move ends the entry — Task 9
   test "a caret move ends keys struck together".
3. **Entering past the last bar** adds a bar instead of losing the note — Task 7 test "a note past the end adds a bar".
4. **Undoing back to the original** removes the version (the Player plays the catalog again) — Task 11 app test.
5. **A written hand in a walk of keys or another key** plays transposed with the chords — Task 1 test.

---

### Task 1: The arrangement plays written hands; notation can leave a staff blank

**Files:**
- Modify: `src/shared/lib/arrangement/types.ts`, `arrange.ts`, `chart-in-keys.ts`, `index.ts`
- Modify: `src/shared/lib/notation/types.ts`, `notate.ts`
- Test: `src/shared/lib/arrangement/arrange.test.ts`, `chart-in-keys.test.ts`, `src/shared/lib/notation/notate.test.ts`

**Interfaces:**
- Produces (`@/shared/lib/arrangement`):
  ```ts
  /** A note a hand plays as written in its bar: from the bar's start, in the chart's key. */
  export interface HandNote {
    readonly midi: Midi
    readonly spelled: SpelledNote
    readonly startTick: Tick
    readonly durationTicks: Tick
    readonly finger?: Finger
  }
  export interface WrittenHands { readonly rh?: readonly HandNote[]; readonly lh?: readonly HandNote[] }
  // ChartBar gains: readonly hands?: WrittenHands  (a hand present = written, even when empty)
  export function transposeNotes<N extends { midi: Midi; spelled: SpelledNote }>(notes: readonly N[], from: SpelledNote, to: SpelledNote): N[]
  ```
- Produces (`@/shared/lib/notation`): `TimedMusic.bars[i].blank?: readonly StaffId[]` — each staff named is one
  hidden rest for the bar.

- [ ] **Step 1: Failing tests** (arrange): a bar with `hands.lh` written plays exactly those notes in the left hand
  (none of the pattern's) and the pattern's left hand everywhere else; `hands.rh` written in a bar under a melody
  pattern (`r7`) plays the written notes, not the tune, there; a written note is transposed to the chosen tonic (C →
  E♭: E4 → G4, spelled G) and keeps its finger; each written note's `chord` is the chord sounding at its onset; a
  written note held past its bar into a written bar lasts across the barline. (chartInKeys) the written notes of each
  key's section are moved into that key. (notate) a bar whose `blank` names `bass` writes one hidden rest on the bass
  staff.
- [ ] **Step 2: Run** `npx vitest run src/shared/lib/arrangement src/shared/lib/notation` — FAIL.
- [ ] **Step 3: Implement.** Move `transposeMelody`'s body into an exported `transposeNotes` (short way −5…+6,
  `transposeNote` for letters; sorted by `startTick` where the caller needs it). In `layOut`, keep each bar's
  `hands` with its start. In the chord loop, skip `playFigure` / `playTune` for a hand whose bar has it written; after
  the loop, push each bar's written notes (`hand` rh/lh, `velocity` VELOCITY.right/left, `roll` 0, `chord` =
  `sounding(chordStarts, start)`), transposed. `chartInKeys` maps `bar.hands` through `transposeNotes(chart.key.tonic,
  key.tonic)`. `notate`: a staff in `bar.blank` → `[{ events: [hidden whole-bar rest], stem: 'auto' }]`.
- [ ] **Step 4: Run** the same — PASS; then the full suite (the catalog arranges every piece unchanged).
- [ ] **Step 5: Commit** "The arrangement plays a hand written into a bar".

### Task 2: Written hands in the piece format

**Files:**
- Create: `src/entities/piece/model/parse-hands.ts`, `parse-hands.test.ts`, `src/entities/piece/model/note-text.ts`
- Modify: `src/entities/piece/model/types.ts` (`Hands`, `ChartPiece.hands`), `parse-chart.ts` (attach hands),
  `parse-melody.ts` (share the pitch reader), `docs/CONTENT.md` (§ "Written hands")

**Interfaces:**
- Produces: `export interface Hands { readonly rh?: string; readonly lh?: string }`;
  `parseHands(piece: ChartPiece, bars: readonly { beats: number }[]): { rh?: (HandNote[] | null)[]; lh?: … }`
  (`null` = the pattern's bar); `readPitch(text): { midi; spelled } | null` (from `note-text.ts`, shared with the
  melody).
- Grammar: bars split on `|` (trimmed), as many as the chart's bars, else `ContentError` "the right hand has 3 bars
  for a chart of 4"; `-` a pattern bar; tokens split on whitespace: `r/beats` or `pitch[^finger](+pitch[^finger])*/beats[@beat]`;
  `@beat` counted from 1, `beat − 1` beats from the bar's start (`ticksIn` must be whole); a token without `@` starts
  where the one before ended (the first at 0); a note may end past its bar only when every bar it reaches has the
  hand written; a token starting at or past its bar's end is a mistake.

- [ ] **Step 1: Failing tests:** each token form; `@2.5`; a chord with fingers; a held note into a written bar; and
  each mistake named by `ContentError` with `{ section, line, bar }` ("the left hand holds a note into a bar the
  pattern plays", "cannot read the note \"Q4/1\"", "a note starts past its bar's end").
- [ ] **Step 2–4:** implement `parseHands`; `parseChart` reads `piece.hands` and sets `bar.hands` on bars that have
  any hand written. Run `npx vitest run src/entities/piece` — PASS.
- [ ] **Step 5: Commit** "A piece may write a hand out bar by bar".

### Task 3: Writing music back as text

**Files:**
- Create: `src/entities/piece/model/music.ts` (`PieceMusic`, `musicOf`, `withMusic`, `keyText`), `write-chart.ts`,
  `write-melody.ts`, `write-hands.ts`, `write.test.ts`, `round-trip.test.ts` (in `content/`)
- Modify: `src/entities/piece/index.ts`

**Interfaces:**
- Produces:
  ```ts
  export type PieceMusic = Pick<ChartPiece, 'key' | 'meter' | 'tempo' | 'pattern' | 'sections' | 'melody' | 'hands'>
  export const musicOf: (piece: ChartPiece) => PieceMusic          // drops undefined fields
  export const sameMusic: (a: PieceMusic, b: PieceMusic) => boolean // structural equality
  export const keyText: (key: Key) => KeyText
  export function writeBar(bar: ChartBar, meter: Meter): string    // `G-C`, `C@1-G@3`, `Fm@1`
  export function writeMelody(notes: Melody, bars: readonly { startTick: Tick; ticks: Tick }[]): string | undefined
  export function writeHand(bars: readonly (readonly HandNote[] | null)[], ticksOf: readonly Tick[]): string | undefined
  export const pitchText: (n: { midi: Midi; spelled: SpelledNote }) => string // ASCII: `C#5`, `Bbb3`, `F##4`
  ```
- Rules: chord symbols by `chordSymbol`; `@beats` written as the shortest decimal (`.5`, `1.5`, `.25`); a bar's chords
  without `@` only when the bar is the meter's length and the chords share it equally; a method code after the
  bar's first chord when all share it, else after each that has one. A melody of no notes or a hand with no written
  bar writes `undefined`.

- [ ] **Step 1: Failing tests:** each rule above on small charts; and `round-trip.test.ts`: for every `ChartPiece` in
  `PIECES`, `parseChart(withMusic(piece, rewritten))` deep-equals `parseChart(piece)` and `parseMelody` likewise,
  where `rewritten` writes each section's lines from the parsed bars and the melody from the parsed notes.
- [ ] **Step 2–4:** implement; run `npx vitest run src/entities/piece` — PASS.
- [ ] **Step 5: Commit** "Write a piece's chart, melody and hands back as text".

### Task 4: The learner's pieces: `pt-pieces`, the repertoire and the commands

**Files:**
- Create: `src/entities/piece/model/own.ts` (`OwnSongId`, `isOwnSongId`, `ownSongId`, `ownSongNumber`, `songTitle`,
  `TITLE_MAX = 80`, `PIECE_TEMPO = { min: 40, max: 160 }`), `store.ts`, `store.test.ts`, `repertoire.ts`,
  `repertoire.test.ts`, `context.ts`
- Create: `src/features/edit-piece/{index.ts,save-music.ts,reset-version.ts,make-song.ts,rename-song.ts,delete-song.ts,edit-piece.test.ts}`
- Modify: `src/entities/piece/index.ts`

**Interfaces:**
- Produces (`@/entities/piece`):
  ```ts
  export interface OwnSong extends PieceMusic { readonly id: OwnSongId; readonly title: string }
  export interface PiecesState {
    readonly versions: Readonly<Record<PieceId, PieceMusic>>
    readonly songs: readonly OwnSong[]
    readonly nextSong: number
  }
  export type PiecesStore = StoreApi<PiecesState>
  export const PIECES_STORAGE_KEY = 'pt-pieces'
  export function createPiecesStore(saving?: SavingOptions): PiecesStore
  export interface Repertoire {
    entry(id: string): Entry | undefined       // catalog entry in its version, or an own song
    piece(id: string): Piece | undefined
    hasVersion(id: string): boolean
    original(id: string): Entry | undefined    // the catalog's, for Reset and equality
    readonly ownSongs: readonly ChartPiece[]
  }
  export function repertoire(state: PiecesState): Repertoire
  export const PiecesStoreProvider, usePieces, usePiecesStoreApi
  export function useRepertoire(): Repertoire  // memoised on versions and songs
  ```
  A version over a song or study keeps the original's id, kind, titles, credits, source, note; over a listing it is a
  `song`. Its `recording` is the original's only when `sameTimeline` (meter, key and every bar's beats equal).
  An own song is `{ kind: 'song', id, title, ...music }`. `PIECES_SANITISE` drops: a version or song whose music does
  not parse as a chart piece, a pattern not built in, a tempo outside 40–160, a meter not in `METERS`.
- Produces (`@/features/edit-piece`):
  ```ts
  export type MusicTarget = { readonly kind: 'version'; readonly id: PieceId; readonly original: PieceMusic | null } | { readonly kind: 'song'; readonly id: OwnSongId }
  export function saveMusic(store: PiecesStore, target: MusicTarget, music: PieceMusic): void
  export function resetVersion(store: PiecesStore, id: PieceId): void
  export function makeSong(store: PiecesStore, draft: { title: string; key: Key; meter: Meter }): OwnSongId
  export function renameSong(store: PiecesStore, id: OwnSongId, title: string): void
  export function deleteSong(store: PiecesStore, id: OwnSongId): void
  ```
  `saveMusic` for a version whose music `sameMusic` the original removes it; a listing's `original` is `null` (any
  music is a version). `makeSong`: one `verse` section, one line of four bars of the tonic chord (`G`, `Em`),
  tempo 90, pattern `r1`.

- [ ] **Step 1: Failing tests:** store (round trip; drops music that does not parse; drops a duplicate or malformed
  own id; `nextSong` past the highest id; follows another tab); repertoire (a version replaces its song's music and
  keeps its title; a listing's version is a song; an own song; `hasVersion`; the recording kept only on the same
  timeline); commands (each, and `saveMusic` removing a version equal to its original).
- [ ] **Step 2–4:** implement; run `npx vitest run src/entities/piece src/features/edit-piece` — PASS.
- [ ] **Step 5: Commit** "The learner's pieces: versions, own songs and the repertoire".

### Task 5: The app reads the repertoire

**Files:**
- Modify: `src/main.tsx`, `src/app/App.tsx`, `src/app/router.tsx` (`RouterContext.pieces`; `/songs/$pieceId`,
  `/practice/studies/$pieceId`, `/play/$pieceId` ask the repertoire), `src/app/routes/songs-screens.ts`,
  `player-screens.ts` (export `entryIn`, `pieceIn`), `src/app/routes/songs-search.ts` (collection `mine`),
  `src/app/testing/render-app.tsx`, `test-context.ts`
- Modify: `src/pages/player/ui/PlayerPage.tsx` (`useRepertoire().piece`), `src/pages/piece/ui/PiecePage.tsx`
  (`useRepertoire().entry`)
- Test: `src/app/router.test.tsx`, `src/pages/player/ui/PlayerPage.test.tsx`

**Interfaces:**
- Consumes: Task 4's `repertoire`, `createPiecesStore`, `PiecesStoreProvider`.
- Produces: `renderApp` returns `piecesStore`; `RouterContext = { views, patterns, pieces }`.

- [ ] **Step 1: Failing tests:** the Player at `/play/bz1` with a saved version plays the version's chords (its
  first chord symbol on the sheet); `/play/my-1` plays an own song; `/play/bz4` (a listing) is not found until a
  version exists, then plays; `/songs/my-1` shows the own song's page.
- [ ] **Step 2–4:** implement; run the touched tests, then the suite; `npm run build`.
- [ ] **Step 5: Commit** "The Player, a piece's page and the router read the learner's versions and songs".

### Task 6: The editor's draft

**Files:**
- Create: `src/features/score-editor/model/draft.ts`, `draft.test.ts`, `timeline.ts`, `timeline.test.ts`
- Create: `src/features/score-editor/index.ts`

**Interfaces:**
- Produces:
  ```ts
  export type Layer = 'chords' | 'melody' | 'rh' | 'lh'
  export type HandId = 'rh' | 'lh'
  export interface DraftNote { readonly midi: Midi; readonly spelled: SpelledNote; readonly startTick: Tick; readonly durationTicks: Tick; readonly finger?: Finger }
  export interface DraftChord { readonly at: Tick; readonly chord: Chord; readonly method?: MethodCode }  // at: from the bar's start
  export interface DraftBar { readonly ticks: Tick; readonly chords: readonly DraftChord[]; readonly rh: boolean; readonly lh: boolean }
  export interface DraftSection { readonly heading: Omit<Section, 'lines'>; readonly lines: readonly (readonly DraftBar[])[] }
  export interface Draft {
    readonly key: Key; readonly meter: Meter; readonly tempo: number; readonly pattern: PatternId
    readonly sections: readonly DraftSection[]
    readonly melody: readonly DraftNote[]                       // absolute ticks, never overlapping
    readonly hands: Readonly<Record<HandId, readonly DraftNote[]>> // absolute ticks, only in written bars
  }
  export function readDraft(music: PieceMusic): Draft
  export function writeDraft(draft: Draft): PieceMusic
  // timeline.ts
  export interface PlacedBar { readonly index: number; readonly section: number; readonly line: number; readonly start: Tick; readonly bar: DraftBar }
  export function barsOf(draft: Draft): PlacedBar[]
  export function totalTicks(draft: Draft): Tick
  export function barAt(draft: Draft, tick: Tick): PlacedBar     // the bar a tick is in; the end is the last bar's
  export function chordsAt(bar: DraftBar): { at: Tick; ticks: Tick; chord: Chord; method?: MethodCode }[]
  ```
- [ ] **Step 1: Failing tests:** `writeDraft(readDraft(musicOf(p)))` parses to the same chart, melody and hands as
  `p` for every catalog chart piece; a bar's chords become offsets and back; written hands become absolute notes and
  bar flags; `barAt` at a barline is the later bar.
- [ ] **Step 2–4:** implement; PASS. **Step 5: Commit** "The score editor's draft of a piece's music".

### Task 7: Notes: write, rest, delete, move, respell, finger, write out

**Files:**
- Create: `src/features/score-editor/model/notes.ts`, `notes.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export type Voice = 'melody' | HandId
  export interface Written { readonly draft: Draft; readonly end: Tick }   // where the caret goes next
  export function writeNotes(draft: Draft, voice: Voice, at: Tick, keys: readonly Midi[], ticks: Tick): Written
  export function addToChord(draft: Draft, voice: Voice, at: Tick, key: Midi, ticks: Tick): Draft
  export function writeRest(draft: Draft, voice: Voice, at: Tick, ticks: Tick): Written
  export function deleteNotes(draft: Draft, voice: Voice, at: Tick): Draft
  export function shiftNotes(draft: Draft, voice: Voice, at: Tick, semitones: number): Draft
  export function respellNotes(draft: Draft, voice: Voice, at: Tick): Draft
  export function setFinger(draft: Draft, hand: HandId, at: Tick, midi: Midi, finger: Finger | null): Draft
  export function notesAt(draft: Draft, voice: Voice, at: Tick): DraftNote[]
  export function writeOut(draft: Draft, hand: HandId, bar: number, played: readonly DraftNote[]): Draft
  export function backToPattern(draft: Draft, hand: HandId, bar: number): Draft
  ```
  Spelling by `spellInKey(pitchClass(midi), draft.key)`. Melody: one note (the highest key), cuts the note sounding
  into `at` and removes those starting in `[at, at+ticks)`. Hands: removes notes starting in `[at, at+ticks)` (held
  notes stay); writing into a pattern bar writes the bar out (empty) first; a hand's note ends at the first bar after
  it the hand does not write. Past the piece's end a bar is added to the last line (the last chord again, the
  meter's length). Notes stay on the piano.
- [ ] **Step 1: Failing tests** for each function and rule, including "a note past the end adds a bar", "a held
  bass keeps sounding under a chord written over it", "a melody note crossing a barline", "respell C♯ → D♭",
  "shift keeps the key's spelling".
- [ ] **Step 2–4:** implement; PASS. **Step 5: Commit** "The editor writes notes".

### Task 8: Chords, bars, sections and the song's settings

**Files:**
- Create: `src/features/score-editor/model/chords.ts`, `bars.ts`, `sections.ts`, `settings.ts` and their tests

**Interfaces:**
- Produces:
  ```ts
  export function setChord(draft: Draft, bar: number, at: Tick, chord: Chord): Draft
  export function deleteChord(draft: Draft, bar: number, at: Tick): Draft
  export function keyChords(key: Key): Chord[]               // the seven triads and V7
  export interface BarRange { readonly from: number; readonly to: number }  // inclusive bar indexes
  export interface Clip { readonly bars: readonly DraftBar[]; readonly melody: readonly DraftNote[]; readonly hands: Readonly<Record<HandId, readonly DraftNote[]>> } // ticks from the clip's start
  export function insertBar(draft: Draft, after: number): Draft
  export function deleteBars(draft: Draft, range: BarRange): Draft
  export function copyBars(draft: Draft, range: BarRange): Clip
  export function pasteBars(draft: Draft, after: number, clip: Clip): Draft
  export function setBarTicks(draft: Draft, bar: number, ticks: Tick): Draft
  export function barLengths(meter: Meter): Tick[]           // an eighth up to the meter's bar
  export function newLine(draft: Draft, bar: number): Draft
  export function joinLine(draft: Draft, bar: number): Draft
  export function newSection(draft: Draft, bar: number): Draft
  export function joinSection(draft: Draft, section: number): Draft
  export function setSectionKind(draft: Draft, section: number, kind: SectionKind): Draft
  export function setKey(draft: Draft, key: Key): Draft      // transposes by the tonics' interval
  export function setTempo(draft: Draft, tempo: number): Draft
  export function setPattern(draft: Draft, pattern: PatternId): Draft
  ```
- [ ] **Step 1: Failing tests:** a chord set on beat 3 splits the bar; delete gives its beats to the one before (a
  first chord to the one after; a lone chord stays); bars carry their notes when inserted, deleted, copied and
  pasted; a note crossing a deleted bar is cut; a shorter bar drops its chords and notes past its end; lines and
  sections split and join, the piece keeps one bar; a new verse takes the next number, a part the next letter;
  `setKey` C → E♭ moves chords and notes, C → Cm moves nothing.
- [ ] **Step 2–4:** implement; PASS. **Step 5: Commit** "The editor writes chords and the form".

### Task 9: The editor's reducer and store

**Files:**
- Create: `src/features/score-editor/model/editor.ts` (state, actions, `reduce`), `editor.test.ts`, `caret.ts`,
  `caret.test.ts`, `store.ts` (`createEditorStore`)

**Interfaces:**
- Produces:
  ```ts
  export interface NoteValue { readonly value: 1 | 2 | 4 | 8 | 16; readonly dots: 0 | 1; readonly triplet: boolean }
  export interface Snapshot { readonly draft: Draft; readonly caret: Tick; readonly layer: Layer }
  export interface EditorState extends Snapshot {
    readonly value: NoteValue
    readonly chord: boolean                       // Chord: keys join the notes at the caret
    readonly selection: BarRange | null           // Chords: bars chosen with Shift
    readonly entry: { readonly at: Tick; readonly time: number; readonly keys: readonly Midi[] } | null
    readonly clip: Clip | null
    readonly past: readonly Snapshot[]; readonly future: readonly Snapshot[]
  }
  export type EditorAction =
    | { type: 'layer'; layer: Layer } | { type: 'value'; value: NoteValue['value'] } | { type: 'dot' } | { type: 'triplet' } | { type: 'chordMode' }
    | { type: 'move'; by: 'step' | 'bar' | 'end'; direction: -1 | 1; extend?: boolean }
    | { type: 'place'; tick: Tick; layer: Layer }
    | { type: 'key'; key: Midi; time: number }     // a key played
    | { type: 'rest' } | { type: 'delete' } | { type: 'shift'; semitones: number } | { type: 'respell' }
    | { type: 'finger'; midi: Midi; finger: Finger | null }
    | { type: 'chord'; chord: Chord; advance: 'stay' | 'beat' | 'bar' } | { type: 'writeOut'; played: readonly DraftNote[] } | { type: 'backToPattern' }
    | { type: 'bars'; edit: 'insert' | 'delete' | 'copy' | 'cut' | 'paste' | 'newLine' | 'joinLine' | 'newSection' }
    | { type: 'barLength'; ticks: Tick } | { type: 'sectionKind'; section: number; kind: SectionKind } | { type: 'joinSection'; section: number }
    | { type: 'settings'; key?: Key; tempo?: number; pattern?: PatternId }
    | { type: 'undo' } | { type: 'redo' }
  export function initialEditor(draft: Draft): EditorState
  export function reduce(state: EditorState, action: EditorAction): EditorState
  export function valueTicks(value: NoteValue, meter: Meter): Tick
  export function nextCaret(draft: Draft, layer: Layer, caret: Tick, step: Tick, direction: -1 | 1): Tick
  export type EditorStore = StoreApi<EditorState> & { dispatch(action: EditorAction): void }
  export function createEditorStore(draft: Draft, onChange: (draft: Draft) => void): EditorStore
  ```
  A key within 80 ms of the entry's last at the same caret joins it (one undo step); a move, a layer change or any
  other edit ends the entry. In Chords, keys struck together of three or more pitch classes set the chord
  `findChord`'s kernel (`nameChords`) names, and stay. History holds 200 snapshots; a caret move is not a step.
- [ ] **Step 1: Failing tests:** each action; "a caret move ends keys struck together"; undo and redo with the caret;
  Chord mode; "a value longer than a triplet beat leaves Triplet off in x/8"; `createEditorStore` calls `onChange`
  only when the draft changed.
- [ ] **Step 2–4:** implement; PASS. **Step 5: Commit** "The score editor's state, history and caret".

### Task 10: The sheet widget

**Files:**
- Modify: `src/shared/ui/score/ScoreView.tsx`, `engrave.ts` (`timeBefore?: TimeSignature`), `engrave.test.ts`
- Create: `src/widgets/score-sheet/{index.ts,model/line-music.ts,model/line-music.test.ts,model/tick-at-x.ts,model/tick-at-x.test.ts,ui/ScoreSheet.tsx,ui/SheetLine.tsx,ui/LineOverlay.tsx,ui/EditorCaret.tsx,ui/ScoreSheet.test.tsx}`
- Modify: `src/styles/theme.css` (none needed beyond tokens: the caret is `bg-secondary`, selection `bg-muted`)

**Interfaces:**
- Produces:
  ```ts
  export function lineMusic(draft: Draft, line: { section: number; line: number }): TimedMusic  // tune 'melody', hands, chords; blank staves
  export function ScoreSheet(props: {
    draft: Draft; headings: readonly string[]; caret: Tick; layer: Layer; caretTicks: Tick
    selection: BarRange | null
    onPlace: (tick: Tick, layer: Layer, extend: boolean) => void
    sectionMenu: (section: number) => ReactNode   // the heading's pop-up, the page's
  }): JSX.Element
  ```
  A line is memoised on its music; the caret's line scrolls into view (`scrollIntoView({ block: 'nearest' })` when
  the caret's line changes). Each bar is a button (`tabIndex -1`, named "Bar 3: G7") placing the caret at the nearest
  step to the click and the layer by the staff (chord row → chords; bass → lh; treble → rh when the layer is rh, else
  melody). "Pattern" in soft ink on a hand's staff of a bar not written, in that hand's layer.
- [ ] **Step 1: Failing tests:** `lineMusic` (the tune as `melody`, written hands, blank staves, chord symbols at
  their ticks); `tickAtX` nearest step; the widget renders a line per chart line under its heading, names its bars,
  and a click places the caret.
- [ ] **Step 2–4:** implement; PASS. **Step 5: Commit** "The editor's sheet: a line of staff per chart line".

### Task 11: The score editor screen

**Files:**
- Create: `src/pages/score-editor/{index.ts,model/use-score-editor.ts,model/use-score-editor.test.tsx,model/shortcuts.ts,model/shortcuts.test.ts,ui/ScoreEditorPage.tsx,ui/ScoreEditorPage.test.tsx,ui/EditorToolbar.tsx,ui/LayerChoice.tsx,ui/NoteTools.tsx,ui/ChordTools.tsx,ui/BarMenu.tsx,ui/SectionMenu.tsx,ui/SongSettings.tsx,ui/CaretLine.tsx}`
- Create: `src/shared/i18n/locales/{en,ru}/editor.ts`; modify the i18n index for the namespace
- Modify: `src/app/router.tsx` (`/edit/$pieceId` under full screen), `src/app/routes/player-screens.ts` (the editor
  page and `editableIn`), `src/styles/theme.css` (`@utility editor-screen`)

**Interfaces:**
- Consumes: Tasks 4, 6–10.
- Produces: `ScoreEditorPage`; `useScoreEditor(id)` returning `{ state, dispatch, title, isVersion, headings, play, playing, keyMarks }`.
- Shortcut map (`shortcuts.ts`, pure: `KeyboardEvent`-like → `EditorAction | 'play' | null`): Digit1–5 values, Period
  dot, Digit0 rest, Backspace/Delete delete, ArrowLeft/Right (Alt: bar; Shift in Chords: extend), Home/End,
  ArrowUp/Down (Cmd/Ctrl: octave), Cmd/Ctrl Z undo, Shift Cmd/Ctrl Z and Ctrl Y redo, Cmd/Ctrl C X V bars (Chords),
  Enter (Chords) focuses the Chord field. None fires from a text field or an open dialog.

- [ ] **Step 1: Failing tests (app):** New song → editor; Chords: type `Am` in the Chord field + Enter sets bar 1's
  chord and moves to bar 2; tap a key's chord button; Melody: keys typed on the computer keyboard (A S D) write C D E
  quarters, `2` picks halves; a MIDI chord in Chords sets `F`; Undo/Redo by button and Cmd+Z; Play sounds from the
  caret's bar; ✕ returns to the song's page; Practise there plays the melody (the Melody switch available); a
  version of `bz1` saved, played in the Player, and gone after undoing back to the original; a written left hand
  plays in the Player in another key.
- [ ] **Step 2–4:** implement; PASS; `npm run build`.
- [ ] **Step 5: Commit** "The score editor: chords, melody and hands from the keys, MIDI and the computer keyboard".

### Task 12: Songs and a piece's page

**Files:**
- Create: `src/pages/songs/ui/NewSongSheet.tsx`, `src/pages/piece/ui/PieceActions.tsx`, `ConfirmButton` use of the
  existing confirmation pattern (one `stage` value)
- Modify: `src/pages/songs/ui/SongsPage.tsx`, `src/pages/songs/model/songs-view.ts`, `src/pages/piece/ui/PieceView.tsx`,
  `ListingView.tsx`, `PieceFacts.tsx`, `src/shared/i18n/locales/{en,ru}/{songs,piece}.ts`
- Test: `SongsPage.test.tsx`, `PiecePage.test.tsx`

- [ ] **Step 1: Failing tests:** New song (title required) makes `my-1` and opens the editor; Your songs lists it
  first and in the Collection pop-up; a song's page shows Edit; a version shows "Your version" and Reset (asks, then
  the original's chords); an own song's Delete (asks) leaves Songs without it; a listing shows Write the chart.
- [ ] **Step 2–4:** implement; PASS. **Step 5: Commit** "Songs make your own; a piece's page edits and resets".

### Task 13: Records

**Files:**
- Create: `docs/adr/0027-a-version-is-the-pieces-music-in-its-own-format.md`
- Modify: `docs/adr/0013-…md` (Consequences: the editor edits music, ADR 0027), `docs/UBIQUITOUS_LANGUAGE.md`,
  `DESIGN.md`, `docs/CONTENT.md`, `PRODUCT.md`, `CLAUDE.md`, the roadmap's Built line and §5/§12 rows

- [ ] **Step 1:** write them; `npx prettier --write` the touched docs.
- [ ] **Step 2:** `npm run typecheck && npm run lint && npm run test && npm run build`.
- [ ] **Step 3: Commit** "Record the score editor: ADR 0027, glossary, DESIGN, CONTENT, PRODUCT, CLAUDE.md".
