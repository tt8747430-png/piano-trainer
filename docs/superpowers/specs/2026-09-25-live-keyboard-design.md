# The live keyboard, and the Phase 3 review's fixes: design

- **Status:** decided 2026-09-25. The owner asked to fix the Phase 3 two-axis review "with best practices and no legacy
  leftovers or workarounds", to make "the keyboard clickable and scrollable everywhere, not just a static keyboard",
  and that "while an arpeggio plays, and everywhere something is played, the keyboard must show the notes played".
  Everything below is Claude's decision, argued where it is not obvious.
- **Builds on:** the Phase 3 screens design (`2026-09-25-phase-3-screens-design.md`, "the screens spec"). This
  document changes it where §6 says so; everything else there stands.

## 1. The live keyboard

### 1.1 What the learner sees

- **Every keyboard is a piano.** It holds all 88 keys (A0–C8) and scrolls sideways. Its `range` is the stretch that
  fills the width: white keys are as wide as the range needs to fill it, no narrower than 28px and no wider than 48px,
  so a small screen scrolls and a wide one shows the neighbouring keys. The keyboard opens centred on its range, and
  centres it again when the range changes (a chord that needs more room). The Player's keyboard also keeps the
  current notes in view (`inView`), scrolling only when one of them is out of sight.
- **Every key plays.** A tapped key sounds its note on every screen, on top of whatever sounds (it never cuts off a
  chord, a run or Listen's transport). Where a tap also means something, it does both: Build chord and Build scale
  select the key, Your turn takes it as an answer.
- **A key that sounds goes down**, whoever plays it: the app (a chord, an arpeggio, a scale run, a bar, Listen,
  Your turn's other hand, a tap) or a MIDI keyboard held down. A plain key turns `--key-down` (a soft teal, light and
  dark), a coloured key (a role, a hand, a quiz's teal) keeps its colour and takes `--key-shade`, a shade laid over
  it, so the meaning of the colour survives. The label stays on top. So an arpeggio goes down key by key and rings
  out, a scale run walks the keys, the Player's marked keys pulse as they sound and a held bass stays down after the
  marks have moved on.
- **One tab stop.** The keyboard is a group with one key in the tab order; the arrow keys move along the keys,
  Home and End jump to the ends. Each key is still a button named by its note.

### 1.2 Where keyboards are

| Screen          | Keyboard                                                                                              |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| Chords, Scales  | Pinned under the page's top while it scrolls, so Play, Arpeggio, Play up and down and the scale's chords are seen on the keys from anywhere on the page |
| Symbols         | New, pinned above the dictionary: every **Hear** shows its chord on C going down                       |
| Piece           | New, pinned at the top of the chart: a tapped bar is heard and seen on the piece's range              |
| Quiz board      | As now, under the prompt                                                                              |
| Player          | As now, the hero                                                                                      |

`Pinned` (kit) holds a pinned keyboard: `sticky top-0` on the page's own background, clear of the notch.

### 1.3 How it is built

- **What sounds** is the audio port's to know, because every sound goes through it: `AudioOutput` gains
  `sounding(): ReadonlySet<Midi>` and `onSounding(onChange): () => void` (the shape `MidiInput` already has for its
  status). Both adapters keep a `createSoundingKeys` log: every note played becomes a window on the audio clock,
  `stop()` empties it. The WebAudio adapter looks at the clock every animation frame while a window is open and tells
  its listeners when the set changes; the fake looks when a test moves its clock (`setNow`), so tests stay
  synchronous. The pure part, `keyWindows` and `keysSoundingAt`, lives in `shared/lib/schedule`.
- **Services hooks:** `useSoundingKeys()` (`useSyncExternalStore` over the port) and `useSoundKey()`, which unlocks
  audio and sounds one key (`keySound`) without stopping anything. `usePlay()` keeps cutting off what sounds, for
  a chord, a bar or a run started from a button.
- **`PianoKeyboard`** (`shared/ui`, presentational) takes `range`, `inView`, `marks`, `lit` (Name chord's chord),
  `selected`, `outlined`, `wrong`, `down` and a **required** `onKeyPress`: a key that does nothing cannot be drawn.
  A pure `keyLook` decides each key's face (fill, shade, outline, band) from those sets, with its own test, so the key
  takes one look instead of six flags; its geometry comes from `keyboardLayout(PIANO)`, worked out once.
- **`LiveKeyboard`** (new feature slice `features/live-keyboard`) is the keyboard every screen uses: it adds `down`
  (sounding keys and keys held on MIDI) and sounds a tapped key before the caller's own `onKeyPress`. The Player no
  longer reads held keys itself.
- `useLitKey` and the scale run's cues go: the sounding keys replace them. `scaleRun` returns its sounds.

## 2. Standards findings

| Finding                                                        | Decision                                                                                   |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Casts in screen tests (`services.audio as FakeAudio`)          | `renderApp` builds the fakes and returns them typed as fakes                               |
| `search as never` in the validators' test                      | Hand-edited URLs are tested through the real router (`createAppRouter` over a memory history); valid input is typed input |
| CheckPage reads `learned[…]` by hand                           | `selectIsLearned`                                                                          |
| Chart grouping in `ChordChart`, beat arithmetic in `NowPanel`  | `chartSections` (`widgets/chord-chart/model`) and `beatInBar` (`features/practice`, which `beatLabel` shares), tested |
| Content on the first paint                                      | §4                                                                                        |
| `root: string`, `key?: string`                                 | `NoteParam`, a branded string only `noteParam` makes, so `noteFromParam` always reads it   |
| Six booleans on `Key`, `building && !result` three times       | `keyLook` (§1.3); `choosing` in the quiz board                                             |
| Reading notes keyed `a`…`g`                                    | Keys named for what each note says (`triad`, `numbers`, …)                                  |
| `selectAllAnswers` feeds lists of ratings                      | Kept. It returns `state.answers`, one reference that changes only when an answer is saved, so it is already narrow; a rating per row would need a hook per row |
| Scale name built four times                                    | `useScaleName()` (`shared/i18n`)                                                           |
| `PITCH_CLASSES` three times, tempo 40–160 four times           | `PITCH_CLASSES` (music), `TEMPO_RANGE` (schedule)                                          |
| `` `piece:${id}` `` five times, `pathSteps().find` four times  | `pieceStepId(id)` and `stepById(id)` (path)                                                |
| `NO_FILTER` equals the Songs defaults                          | Clear navigates to no search; the route's defaults fill it                                 |
| The piece's section headings in two places                     | `usePieceHeadings(piece)` beside `useSectionHeading`                                       |
| Duplicated spelling in `note-names.ts`                         | `spellingOf(performance, chord, pc)`                                                       |
| "Connected" worked out twice                                   | `isMidiConnected(connection)`                                                              |
| Three `skill.kind` tests in one Check row                      | One branch per row picks the name, link and label                                          |
| `SetupMain`'s `open`                                           | `onOpenPage`; the Right and Left hand pages share one `FigurePage`                         |
| `Sheet` has no trigger                                         | The kit's `SheetTrigger` and `SheetClose`; nothing imports `primitives/drawer` but the kit |

## 3. Spec findings

| Finding                                            | Decision                                                                                           |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Your turn marks keys not asked for                 | Marks follow the hands: Your turn marks the practised hands' notes; Listen and Step mark the hands heard. What else sounds shows as down (§1.1) |
| `DESIGN.md` missing                                | Written from the shipped build (screens spec §10)                                                  |
| Practise not in the footer                         | Kept above the chart, beside the learned toggle: the one primary action must not sit under a long chart. Recorded in the screens spec §11 |
| Keys that do nothing                               | §1: every key plays                                                                                |
| Note grid tells hands by colour only               | A pinned first column names the rows (RH, LH, Tune); rows line up across beats on a subgrid        |
| `item`, `separator`, `textarea` unused             | `item` and `separator` (used only by `item`) deleted: the rows are the kit's own. `textarea` stays: `input-group` (Songs search), recorded in §2.4, is built on it |
| The scale band is not in the spec                  | Recorded in §2.1 and §2.4                                                                          |
| Beat pips fill up to the beat                      | Only the current beat is filled                                                                    |
| Player close goes back in history                  | Kept (the router test holds it) and recorded: back where the learner came from, else the Piece     |
| Setup lists open as pages, not nested sheets       | Kept and recorded: one sheet with pages never stacks a sheet on a sheet on a phone                 |
| Two "Done" buttons at the end of a Check           | The board's last action is **Next**, which opens the result; the result's **Done** leaves          |
| Piece Back always goes to Songs                    | Back goes where the learner came from (Path, Songs), else Songs (`useGoBack`)                      |

## 4. First paint

The router checked piece ids, listings and check plans with content it imported, and `search.ts` read the collection
ids from the content, so every piece shipped in the first chunk. Now:

- The Piece, Player and Check routes' `beforeLoad` awaits its screens module (the chunk the screen needs anyway) and
  asks it (`entryById`, `pieceById`, `checkPlan`), so no second chunk waits on the first.
- `COLLECTION_IDS` names the collections in `entities/piece/model`; a content test holds `COLLECTIONS` to it.
- `package.json` declares `sideEffects` (the CSS, `main.tsx` and the i18n set-up), so a slice's `index.ts` costs only
  what is imported from it.

## 5. Testing

Unit tests first for `keyWindows`/`keysSoundingAt`, `createSoundingKeys`, `keyLook`, `chartSections`, `beatInBar`,
`spellingOf`, `NoteParam`, `pieceStepId`/`stepById`, `COLLECTION_IDS`. Component tests: the keyboard (piano, one tab
stop and arrows, a required action, looks), `LiveKeyboard` (a tap sounds without stopping, sounding and held keys go
down). Screen tests through `renderApp`: an arpeggio's keys go down in turn on Chords; a scale run walks the keys;
Symbols' Hear and the Piece's bar show on their keyboards; the Player's marks follow the hands; the Check ends with
one Next then Done; Piece Back returns to the Path.

## 6. Changes to the screens spec

§2.1 (`--key-down` replaces `--key-pressed`; `--key-shade`; the scale band `--key-mark*`), §2.4 (`PianoKeyboard`'s
props; `Pinned`; `SheetTrigger`/`SheetClose`; `input-group`; no `item`, `separator`), §4.3 (the pinned keyboard;
Practise's place; Back), §4.4 (marks by hands; down keys; close; Setup pages; pips), §4.5 (pinned keyboards; Symbols'
keyboard), §4.6 (Next opens the result), §8 (one tab stop), and §11 gains the refinements above.
