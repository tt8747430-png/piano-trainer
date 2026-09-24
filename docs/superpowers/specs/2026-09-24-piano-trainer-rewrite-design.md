# Piano Trainer rewrite: design

- **Status:** approved in conversation, awaiting review of this document · **Date:** 2026-09-24
- **Reference project:** `~/projectsGIT/memory-palaces` (Mindscape). Its `CLAUDE.md` and `docs/CODE_STYLE.md` are
  the model for this repo's standards, and are adapted here rather than copied wholesale.

## 1. Why

Piano Trainer is one 1,882-line `index.html`: vanilla JS in a single global scope, no build, no types, no tests, no
docs. It works, but it cannot grow. The next things it has to do are **gain new features** and **serve other
people**: students and church musicians with a phone or tablet on the piano stand, often with bad Wi-Fi. Both
need code that can be changed safely and an interface that a newcomer finds calm.

### Success means

1. Every musical capability of today's app exists in the new one (§12 lists them). Nothing is lost silently.
2. The app is organised around **learning songs**, with an **easy-to-hard path** of exercises, chord topics and
   songs, and **theory** to learn chords. The interface is uncluttered and never explains the obvious.
3. Music logic is typed, pure and covered by tests written first (TDD). A wrong note spelling or a mistimed bar
   fails a test before anyone hears it.
4. It installs as an app and works fully offline, in English and Russian.
5. A contributor, human or Claude, can add a song by adding one file, and knows where any new code goes from
   `CLAUDE.md` and `docs/CODE_STYLE.md`, with the linter enforcing the layer rules.

### Decisions taken during brainstorming

| Question                | Decision                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------- |
| What it optimises for   | New features + other people using it                                                  |
| Interface language      | i18n from day one; English + Russian                                                  |
| Where it runs           | Installable PWA, fully offline                                                        |
| Hosting                 | Vercel (production from `main`, a preview per PR); GitHub Actions for checks          |
| Visual design           | Redesign during the move                                                              |
| Information structure   | **Path first**: bottom nav `Path · Songs · Theory`; the player is a full screen        |
| Easy-to-hard structure  | Levels 1–4 on every step, progress saved on the device, "Continue" suggestion, nothing locked |
| Migration approach      | **Clean rewrite.** The legacy file is a reading reference only; no golden fixtures      |

### Not in scope

Accounts, sync, a backend, sheet-music rendering, audio recording, new lesson content beyond assigning levels to
what exists, Playwright end-to-end tests, and pre-commit hooks. Each can follow as its own effort.

## 2. Stack and tooling

Versions follow memory-palaces so the two repos share habits.

- **App:** React 19, Vite 8, TypeScript 6.
- **Routing:** TanStack Router, with typed routes and typed, validated search params.
- **State:** zustand with `persist` (§6).
- **UI:** Tailwind v4, shadcn on Base UI (`style: base-nova`, as memory-palaces), lucide-react, `motion` only where
  motion carries meaning.
- **i18n:** i18next + react-i18next.
- **PWA:** vite-plugin-pwa (`registerType: 'prompt'`). Fonts are self-hosted through Fontsource, so nothing loads
  from a CDN.
- **Tests:** Vitest 4 + jsdom + Testing Library (`@testing-library/react`, `user-event`, `jest-dom`),
  `globals: false`, setup in `src/shared/test/setup.ts`, `@vitest/coverage-v8`.
- **Lint and format:** ESLint 10 flat config with typescript-eslint, `react-hooks`, `react-refresh`, and
  `eslint-plugin-boundaries` enforcing the layer rules of §3. Prettier: `semi: false`, `singleQuote`,
  `trailingComma: all`, `printWidth: 100`.
- **TypeScript flags:** `strict`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`,
  `noFallthroughCasesInSwitch`, `noImplicitOverride`, `verbatimModuleSyntax`. `@/*` → `src/*`.
- **Scripts:** `dev · build (tsc --noEmit && vite build) · preview · typecheck · lint · test · test:watch ·
  test:cov · format`.
- **Runtime:** Node 24, pinned in `.nvmrc`. npm.

### Repo and delivery

- The new app lives at the repo root. The current `index.html` moves to `legacy/index.html` and stays live on
  GitHub Pages, with the Pages workflow repointed to it, until the switch-over in Phase 4. Then `legacy/` and the
  Pages deploy are deleted.
- `.gitignore` covers `node_modules`, `dist`, `dev-dist`, `coverage`, `.superpowers/`, `.env*.local`.
- **CI** (GitHub Actions) runs on every push and PR: `npm ci → typecheck → lint → test:cov → build`. Red blocks
  merging.
- **Vercel** Git integration: a preview deployment per PR, production from `main`. `vercel.json` holds the SPA
  rewrite (`/(.*) → /index.html`) and cache headers: `/assets/*` immutable for a year; `index.html`, `sw.js` and
  `manifest.webmanifest` must revalidate. `public/_redirects` is not needed (Vercel only).

## 3. Architecture

Feature-Sliced Design, as in memory-palaces: `app → pages → widgets → features → entities → shared`. A layer
imports only from layers below it, enforced by `eslint-plugin-boundaries`. One slice reaches another only through
its `index.ts`.

```
src/
  app/        router, providers (services, i18n, theme), PWA update prompt, error boundaries
  pages/      path · songs · piece · player · theory-chords · theory-scales · theory-symbols ·
              theory-quiz · settings · not-found
  widgets/    app-nav · path-levels · continue-card · piece-list · chord-chart · player ·
              chord-explorer · scale-explorer · quiz-board
  features/   mark-learned · practice · quiz · connect-midi · set-preference · import-legacy-data
  entities/   piece · pattern · path · progress · settings
  shared/
    lib/music/        theory kernel (§4.1). No imports outside itself.
    lib/arrangement/  accompaniment engine (§4.3). Imports only lib/music.
    lib/schedule/     Performance → timed audio notes (§4.4). Pure.
    api/audio/        AudioOutput port, WebAudio adapter, fake
    api/midi/         MidiInput port, Web MIDI adapter, fake
    ui/               design system: shadcn primitives, PianoKeyboard, AppScreen, Sheet, …
    i18n/             i18next setup + locales/{en,ru}/<namespace>.json
    config/  test/
```

- **Entities** (`entities/<x>/`): `model/types.ts` (types and `makeX` constructors that validate and throw on a
  broken invariant, with no IO and no React), `model/selectors.ts` (pure reads), `model/store.ts` where the entity
  is saved state, `content/` where the entity is authored content, and an `index.ts` barrel.
- **Features are commands** (CQRS-lite, as memory-palaces): one use case per file, e.g.
  `features/mark-learned/mark-learned.ts` → `markLearned(progressStore, stepId, now)`. All writes go through
  features, all reads through selectors.
- **Services:** `app/composition-root.ts` builds `{ audio: AudioOutput, midi: MidiInput | null }`. `ServicesProvider`
  hands them down through context. No component or hook creates an `AudioContext` or calls
  `navigator.requestMIDIAccess` itself. Tests pass fakes.
- **Components render; hooks hold behaviour; pure logic lives in `shared/lib` or `entities/*/model`.** State with
  phases is a pure reducer outside the component (§4.5). This is CODE_STYLE §1–3 of memory-palaces.
- **Routes are split** with `lazyRouteComponent`. The Player and Theory chunks do not load on the Path screen's
  first paint.

## 4. Domain core

### 4.1 `shared/lib/music`: the theory kernel

Small types instead of bare numbers and strings: `PitchClass` (0–11), `Midi`, `Letter`,
`SpelledNote { letter, accidental }` (accidental −2…+2), `Interval`, `ChordQuality` (33 qualities in 5 families:
triads; 6th & add; 7ths; 9ths & more; altered 7ths), `ScaleKind` (major, natural / harmonic / melodic minor, major
and minor pentatonic, blues), `ChordRole` (root, 3rd, 5th, 7th, 9th, 11th, 13th).

Public interface:

- `spellChord(root: SpelledNote, quality) → ChordTone[]`, where each tone has its spelled note, pitch class,
  semitones above the root, `role`, and degree label (`1 ♭3 5 ♭7 9`).
- `chordSymbol(root, quality) → string`, and `parseChordSymbol('F#m7b5/C') → { root, quality, bass? }`. It throws a
  `ChordSymbolError` naming the symbol when it does not recognise one.
- `spellScale(root, kind) → ScaleNote[]` (spelled note + degree).
- `scaleFingering(root, kind, hand) → Finger[] | null`, where `null` means no standard fingering is taught.
- `diatonicChords(scale, size: 3 | 4) → { roman, chord }[]`.
- `transpose(note, semitones, preferSharps)` and `keySignaturePrefersSharps(key)`.
- `rootSpelling(pitchClass, preferSharps) → SpelledNote`.

**Rule:** spelling is derived from **letter steps + semitones**, never looked up from a sharp or flat name table.
That is what keeps E♭ harmonic minor's C♭, G♯ minor's F𝄪 and a diminished 7th's 𝄫7 right. Name tables are only
for display where no key context exists.

### 4.2 Content: pieces, patterns, the path

**A Piece** is anything that opens in the player: `kind: 'song' | 'exercise' | 'progression'`. Pieces are code,
one file per piece, under `entities/piece/content/<collection>/<id>.ts`. Each collection has an `index.ts` that
lists its pieces in order. Adding a piece means one new file plus one line in the index.

```ts
export default definePiece({
  id: 'bz5',
  kind: 'song',
  collection: 'bozhe-spasibo',
  level: 2,
  title: 'Мир, душа, храни',
  titleEn: 'Still, my soul, be still',
  credits: 'Keith Getty, Kristyn Getty, Stuart Townend',
  source: { book: 'bozhe-spasibo', number: 5, page: 16 },
  key: 'G',
  meter: '4/4',
  tempo: 72,
  pattern: 'r4',
  sections: [
    {
      name: 'verse',
      lines: ['G C Em-G/B C@1-C/E@1-Dsus4@1-D/F#@1', 'G C Em-G/B C@1-C/E@1-Dsus4@1-D/F#@1'],
    },
    { name: 'chorus', lines: ['Em-D/F# G Am-Em C@2-Dsus4@1-D7@1', 'Em-D/F# G Am-Em C-D', 'Em C-D'] },
    { name: 'ending', lines: ['G'] },
  ],
  note: 'The score prints no chord symbols; these were read from the bass line.',
})
```

**The chart format is today's, kept deliberately.** A section is a list of lines. A line is bars separated by
spaces. A bar is one or more chords joined by `-`, sharing the bar's beats equally unless a chord gives its own
`@beats`. A chord may carry a method code, `:t1`, `:3ch`, `:5.1` and so on (the playing technique for that bar,
from the source book). Slash chords (`D/F#`) set the bass.

Changes from the legacy data:

- `key` is written as a name (`'Bm'`, `'G'`) instead of `key: 11, mode: 'minor'`.
- `meter` is written as a string (`'12/8'`).
- Section names are translation keys (`verse`, `chorus`, `intro`, `ending`, `bridge`, `lastChorus`) instead of
  `'Verse · Куплет'`.
- Every piece has a `level`.

An optional `melody` keeps the legacy token format (`E4/1 D4/0.5 r/1`: note plus octave, slash, beats; `r` is a
rest).

- `entities/piece/model/parse-chart.ts`: chart text → `Chart` (the type `arrangement` consumes). It throws a
  `ChartError` with section, line and bar position.
- `definePiece` gives authoring-time types. A catalog test parses and arranges every piece (§9).
- **Songbook entries without a chart** (7 of the 20 in «Боже, спасибо») stay listed. The Songs screen shows them as
  "no chart yet", and they are not Pieces the player can open. They live in the collection index as
  `{ kind: 'listing', … }`.
- `entities/pattern/content/`: the accompaniment patterns, i.e. the 39 named styles (the five ways of lesson 3,
  right-hand techniques, Боброва's seven accompaniment types, rhythm styles) built from 36 right-hand and 20
  left-hand figures, typed with the `Pattern` contract `arrangement` defines.
- `entities/path/content/path.ts`: for each level 1–4, an ordered list of `PathStep`s:
  `{ kind: 'piece', pieceId } | { kind: 'chords', family } | { kind: 'scale', scale }`. Steps refer to content and
  never copy it. A step's id is derived (`piece:bz5`, `chords:sev`, `scale:harmonic`). Phase 2 writes a first
  `path.ts` holding every piece, every chord family and every scale kind at provisional levels. Phase 4 orders and
  levels it for real.

### 4.3 `shared/lib/arrangement`: the accompaniment engine

```ts
arrange(chart: Chart, options: {
  key: SpelledNote            // transpose target
  pattern: Pattern | { rh: Pattern; lh: Pattern } | 'from-chart' // 'from-chart' honours per-bar method codes
  voicing: 'triads' | 'sevenths' | 'ninths'                     // progressions only
  melody?: Melody
}) → Performance
```

A `Performance` has `bars` (start tick, beats, section, chord symbols), `beats` (note groups sharing an onset,
which is what Step mode walks through), and `notes: { midi, hand: 'rh' | 'lh' | 'melody', finger?, startTick,
durationTicks, chord }[]`. Timing is **12 ticks per beat**, so both 16ths (3 ticks) and triplet 8ths (4 ticks) are
whole numbers. Voice leading (the nearest voicing in range), pattern expansion (including 3/4 and major-key
variants), inversion, and automatic fingering are internal. None of them is part of the interface.

### 4.4 Sound and input

- `shared/lib/schedule`: `schedule(performance, { tempo, fromTick, metronome, countIn, hands, melody })` → the
  audible notes in seconds, plus clicks. Pure and tested; loop passes are computed here, not with `setTimeout`
  arithmetic in a component.
- `shared/api/audio`:
  - **Port:** `AudioOutput { unlock(), play(notes: TimedNote[], at?), stop(), now() }`.
  - **WebAudio adapter:** keeps the legacy synth voice (layered oscillators, a low-pass filter, a gain envelope) and
    schedules with lookahead.
  - **`FakeAudio`:** records calls.
  - `unlock()` runs on the first user gesture, because browsers start audio suspended.
- `shared/api/midi`: port `MidiInput { connect(): Promise<Status>, onNote(cb) }`, a Web MIDI adapter and a
  `FakeMidi`. On browsers without Web MIDI (Safari, iOS) `createServices` returns `midi: null`.

### 4.5 Practice and quiz machines

- `features/practice/practice-machine.ts`: a pure reducer over a Performance. Modes: **Listen** (the app plays),
  **Step** (move beat by beat or bar by bar), **Your turn** (the app waits for the notes of the practised hand from
  MIDI or keyboard taps, and plays the other hand). State includes the position, the expected and received notes,
  and the last outcome (`correct | wrong | waiting`). Events: `play`, `stop`, `next`, `prev`, `nextBar`, `jumpToBar`,
  `noteOn`, `restart`. `usePractice(performance, services)` connects it to `schedule`, audio and MIDI.
- `features/quiz/quiz-machine.ts`: a pure reducer for **Build chord**, **Name chord** and **Build scale**. Question
  generation takes an injected random source, so tests are deterministic. Stats go to `progress`.

## 5. Screens and navigation

**Navigation:** bottom bar `Path · Songs · Theory` on phones; a left rail from 1024px. Settings is a gear in the Path
header. The Player is full-screen with a back control.

| Route                                        | Screen                                                                                                                                                                                   |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                                          | **Path**: a Continue card (the last-practised piece if not learned, else the first unlearned step), then levels 1–4 (Beginner, Elementary, Intermediate, Advanced) with progress, then step rows with a learned check |
| `/songs`                                     | **Songs**: search; collection and level filters; rows with title (original + translation), key, level, learned check                                                                     |
| `/songs/$pieceId`                            | **Piece**: title, credits, key, meter; the chart by section (tap a bar to hear it); **Practise** as the one primary action; Mark as learned; a link to the key's scale                      |
| `/play/$pieceId`                             | **Player**: key, pattern, hands, mode (`Listen · Step · Your turn`), keyboard with hand colours, current-bar note grid, chart strip to jump. Per-hand patterns and the toggles (finger numbers, melody, metronome, count-in) live in a sheet |
| `/theory/chords` `/theory/scales` `/theory/symbols` `/theory/quiz` | **Theory**, with a segmented switch. Chords: root, family, quality, inversion, hands, keyboard coloured by chord role, play / arpeggio. Scales: root, kind, degrees or fingering, rhythm practice, diatonic chords. Symbols: reading chord symbols + the chord dictionary. Quiz: the three modes and stats |
| `/settings`                                  | Language, theme, MIDI, reset progress                                                                                                                                                    |

**Progress rules:**

- "The first unlearned step" means path order: level 1 first, then each level's list order.
- `lastPractised` is set when the Player opens a piece.
- A step is marked or unmarked as learned from:
  - the check on its Path row (a toggle button);
  - the Piece screen;
  - the Chords or Scales explorer when it was opened from a path step. The step id travels as `?step=chords:sev`,
    and the explorer then shows Mark as learned.

**View state is in the URL** (§6): `/theory/chords?root=G&quality=m9`, `/play/bz5?key=A&hands=lh&mode=turn`. The
legacy Guide tab is dropped. Chord-symbol reading moves to Theory → Symbols, and the song-learning advice is not
carried over (the copy rule below).

## 6. State and saved data

- **URL search params hold what you are looking at:** explorer roots and qualities, the player's key, hands, mode
  and pattern. Validated by the router; an invalid value falls back to the default. Shareable, and the back button
  works.
- **Saved stores** (zustand `persist` → `localStorage`, each with a `version` and a `migrate`):
  - `settings` (`pt-settings`): `theme: 'system' | 'light' | 'dark'`, `locale: 'en' | 'ru'` (first run: from
    `navigator.language`), `defaultTempo`, `practice: { fingerNumbers, melody, metronome, countIn }`.
  - `progress` (`pt-progress`): `learned: Record<StepId, isoDate>`, `lastPractised: { pieceId, at } | null`,
    `quiz: { correct, total, streak, best }`.
- **Legacy import** (`features/import-legacy-data`): on first launch, if `piano-v3` exists and
  `pt-progress` does not, copy the quiz stats (`ok/all/streak/best`), the practice toggles and the tempo. Mark it
  done inside the new store. `piano-v3` is read, never written or deleted. Corrupt JSON imports nothing and does not
  throw.
- **Theme:** `data-theme` on `<html>`, set by an inline boot script before first paint from the saved setting, so a
  dark-mode user never sees a white flash.

## 7. Errors and edge cases

| Situation                                             | Behaviour                                                                                   |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `localStorage` unavailable (private mode, quota)      | Stores run in memory; the app works; nothing throws                                         |
| Audio suspended until a gesture                       | The first tap anywhere calls `audio.unlock()`; Play buttons also unlock before playing      |
| No Web MIDI                                           | MIDI controls hidden; Settings shows one line saying this browser cannot connect a keyboard |
| MIDI permission denied / no device                    | The Connect control shows that status in one line; taps on the on-screen keyboard still work |
| Unknown `$pieceId`                                    | Not-found screen with a link to Songs                                                       |
| Invalid search param                                  | Replaced by the default; no error shown                                                     |
| A render error                                        | A route-level error boundary with "Something went wrong" + reload; other routes unaffected  |
| A broken chart or chord symbol in content             | Cannot ship: the catalog test fails in CI (§9)                                              |

## 8. Design system, copy, i18n, offline

**Visual direction is chosen at the start of Phase 3** with the `impeccable` skill's shaping step: 2–3 directions
shown as comps. The owner picks one, and screens are built only after that. This spec fixes the principles every
direction must meet:

- **Calm:** one primary action per screen; secondary controls go in a sheet or behind "More". Chrome never competes
  with the keyboard.
- **Copy rule:** no sentence that repeats what a label, icon or layout already says, and no how-to paragraphs.
  Empty states and errors get one short line. Help that is genuinely needed sits behind an info control.
- **Tokens only:** Tailwind v4 with two layers, primitives → semantic roles (`tokens.css`, exposed through `@theme`).
  Class names come from lookup maps of complete strings, and `cn()` composes them. The chord-role colours are
  semantic tokens (`--role-root`, `--role-3rd`, `--role-5th`, `--role-7th`, `--role-9th`, `--role-11th`,
  `--role-13th`), shared by the keyboard, the legend and the chart. Every coloured key also carries its degree or
  finger label, so colour is never the only cue.
- Dark mode through `[data-theme]` remapping; no scattered `dark:` classes. 44px minimum touch targets. Visible
  `focus-visible` rings. `prefers-reduced-motion` honoured. Safe-area insets respected. Mobile-first.
- `shared/ui/PianoKeyboard`: one presentational component used by every screen. Props: range, marks (per key: role,
  label, hand), selected and wrong keys, `onKeyPress`. Keys are buttons with note-name labels for screen readers.

**i18n:**
- Namespaces `common, path, songs, piece, player, theory, quiz, settings`, one JSON file per namespace per locale in
  `shared/i18n/locales/{en,ru}/`. A test fails if the two locales' key sets differ.
- Piece titles are content, not i18n: English shows `titleEn` with the original `title` beneath, and Russian shows
  `title`.
- Note and chord names are international in both locales (B, not H; `#` and `♭`).

**Offline:** vite-plugin-pwa precaches the app, fonts and icons. The app has no runtime network dependency. An
update prompt appears when a new version is waiting. The manifest defines name, icons (192, 512, maskable),
`display: standalone` and theme colours taken from the chosen visual direction.

## 9. Testing

TDD for every module, red → green → refactor (the `tdd` skill). Tests assert **music-theory facts and specified
behaviour**, written before the code. Tests live beside their code as `*.test.ts(x)`.

1. **Unit tests** (most tests):
   - `music`: every quality × 12 roots spells the expected tones. Named edge cases: E♭ harmonic minor has C♭;
     G♯ harmonic minor has F𝄪; C°7 has B𝄫; chord-symbol parsing for every suffix, slash chords, and a helpful error
     for an unknown symbol.
   - `parse-chart`: every syntax feature, plus error positions.
   - `arrangement`, on small hand-worked charts: note counts, tick positions, bar lengths in 3/4, 6/8 and 12/8,
     voicings inside range, voice leading moving each voice by at most a stated interval, fingering present when
     asked.
   - `schedule`, `practice-machine`, `quiz-machine`, stores, and the legacy import.
2. **Content tests:**
   - every piece parses and arranges in all 12 keys with its own pattern and with every pattern, without throwing;
   - every chord symbol in content is recognised;
   - every path step resolves;
   - every level has at least one step;
   - every piece has a level;
   - en/ru key parity.
3. **Component tests** (Testing Library, by role and label, with `FakeAudio` and `FakeMidi`): PianoKeyboard taps,
   Mark as learned, the player's mode switching and Your-turn feedback, quiz answering, and the Continue card's
   choice.

**Coverage gate in CI:** at least 90% lines on `src/shared/lib/**` and `src/entities/*/model/**`. There is no
global number.

## 10. Documentation delivered

- `CLAUDE.md`: concise, in the style of memory-palaces. What the app is; stack; commands; the layer rules and where
  each kind of code goes; the verify command (`npm run typecheck && npm run lint && npm run test`, plus
  `npm run build` after touching startup); the skills to use (`tdd`, `vite-react-best-practices`,
  `vercel-react-best-practices`, `vercel-composition-patterns`, `shadcn`, `impeccable`); "read before you touch"
  pointers; Prettier on touched files only.
- `docs/CODE_STYLE.md`: memory-palaces' rules adapted to this app (small components, logic in hooks, machines,
  composition over configuration, Tailwind tokens, TypeScript and imports, performance), with the iOS keyboard,
  drag-and-drop and sync material removed, plus a **music code** section (§4.1's spelling rule, branded types, ticks
  not seconds in domain code).
- `docs/UBIQUITOUS_LANGUAGE.md`: Piece, Collection, Chart, Section, Bar, Chord symbol, Chord tone, Role, Degree,
  Voicing, Inversion, Pattern, Method code, Performance, Tick, Level, Path, Step, Learned, Listen / Step / Your turn,
  Quiz modes, each with the words to avoid.
- `docs/CONTENT.md`: how to add a piece, collection, pattern or path step; the full chart and melody syntax.
- `docs/adr/`:
  - `0001-clean-rewrite`
  - `0002-content-as-code-one-file-per-piece`
  - `0003-view-state-in-url-saved-state-in-stores`
  - `0004-audio-and-midi-behind-ports`
- `docs/agents/issue-tracker.md`, `triage-labels.md`, `domain.md`: issues and specs as local markdown in `.scratch/`,
  as in memory-palaces.
- `README.md`: what it is, how to run it, how to add a song.

## 11. Phases

Each phase gets its own implementation plan (`writing-plans`) and ends green in CI.

1. **Foundation:**
   - move legacy to `legacy/` and repoint Pages;
   - scaffold Vite + React + TS; ESLint (with boundaries), Prettier, Vitest; Tailwind + shadcn init;
   - TanStack Router with every route from §5 as an empty screen;
   - i18n (en/ru), theme boot script, PWA;
   - CI workflow and `vercel.json`;
   - `CLAUDE.md`, CODE_STYLE, glossary, ADRs, `docs/agents`, README.
2. **Core:** `music`, then `parse-chart` and porting all 51 pieces, 7 chart-less listings and all patterns to content
   files, then `arrangement`, then `schedule`, the audio and MIDI ports, then the practice and quiz machines. Levels
   are provisionally `1` until Phase 4.
3. **Screens:** visual direction (impeccable), then Theory, then Songs and Piece, then the Player, then Path and
   progress, then Settings, then the legacy import.
4. **Levels and switch-over:** Claude proposes a level for every piece and path step from what it uses (chord
   qualities, patterns, meter, tempo, melody, source lesson). The owner reviews it. Then run the §12 parity check,
   point production at Vercel, and delete `legacy/` and the Pages workflow.

## 12. Parity checklist (verified in Phase 4)

- **Chords:** 12 roots × 33 qualities; inversions; one hand or both; block and arpeggio playback; degree labels
  and role colours.
- **Scales:** 7 kinds × 12 roots; degree / RH / LH fingering views; 5 practice rhythms at 40–160 BPM; RH, LH or
  hands together; diatonic triads and 7ths with Roman numerals; relative major/minor.
- **Songs:** all 51 pieces and 7 listings, with credits and notes; tap a bar to hear it; open in the player; jump to
  the key's scale.
- **Player:** any key; pattern from the chart's method codes or any of the 39; separate RH/LH patterns; triads, 7ths
  or 9ths for progressions; both hands, RH or LH; Listen, Step (beat, bar, back, jump) and Your turn with MIDI or
  taps; finger numbers; melody; metronome; count-in; 40–160 BPM; loop.
- **Quiz:** Build chord, Name chord, Build scale; chosen families and scales; correct, total, streak and best.
- **Guide:** the chord-symbol reading notes and the chord dictionary (now in Theory → Symbols).
