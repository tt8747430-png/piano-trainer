# Piano Trainer rewrite: design

- **Status:** revised after the two-axis review (document quality + fidelity to the owner's intent), awaiting
  the owner's review · **Date:** 2026-09-24
- **Reference project:** `~/projectsGIT/memory-palaces` (Mindscape). Its `CLAUDE.md` and `docs/CODE_STYLE.md` are
  the model for this repo's standards, and are adapted here rather than copied wholesale.

## 1. Why

Piano Trainer is one 1,882-line `index.html`: vanilla JS in a single global scope, no build, no types, no tests, no
docs. It works, but it cannot grow. The next things it has to do are **gain new features** and **serve other
people**. Both need code that can be changed safely and an interface a newcomer finds calm.

### Success means

1. Every musical capability of today's app exists in the new one (§12 lists them). Nothing is lost silently.
2. The app is organised around **learning songs**, with an **easy-to-hard path** of exercises, chord topics and
   songs, and **theory** that finds and fills the learner's gaps. The interface is uncluttered and never explains
   the obvious.
3. Music logic is typed, pure and covered by tests written first (TDD). A wrong note spelling or a mistimed bar
   fails a test before anyone hears it.
4. It installs as an app and works fully offline, in English and Russian: both the interface and the content's own
   text.
5. A contributor, human or Claude, knows where any new code goes from `CLAUDE.md` and `docs/CODE_STYLE.md`, with
   the linter enforcing the layer rules. Adding a piece takes one file, one line in its collection index and one
   entry in the path.

### Decisions taken during brainstorming and review

| Question                | Decision                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| What it optimises for   | New features + other people using it                                                              |
| Interface language      | i18n from day one; English + Russian, **including content text** (§8)                             |
| Where it runs           | Installable PWA, fully offline                                                                    |
| Hosting                 | Vercel (production from `main`, a preview per PR); GitHub Actions for checks                      |
| Visual design           | Redesign during the move                                                                          |
| Information structure   | **Path first**: bottom nav `Path · Songs · Theory`; the player is a full screen                    |
| Easy-to-hard structure  | Levels 1–4 on every step, progress saved on the device, "Continue" suggestion, nothing locked     |
| Theory                  | Explorers, plus **gap filling**: quiz evidence per skill finds gaps and routes practice to them (§4.6) |
| Migration approach      | **Clean rewrite.** The legacy file is a reading reference only; no golden fixtures                 |
| Existing saved data     | **None to keep.** Nothing is imported from the legacy app; its content is ported as code          |

### Not in scope

Accounts, sync, a backend, sheet-music rendering, audio recording, written theory lessons, new pieces, Playwright
end-to-end tests, and pre-commit hooks. Each can follow as its own effort.

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
- `.gitignore` covers `node_modules`, `dist`, `dev-dist`, `coverage`, `.superpowers/`, `.env*.local`, `.vercel`.
- **CI** (GitHub Actions) runs on every push and PR: `npm ci → typecheck → lint → test:cov → build`. Red blocks
  merging.
- **Vercel** Git integration: a preview deployment per PR, production from `main`. Configuration is **`vercel.ts`**
  (`@vercel/config`, the current recommended form, replacing `vercel.json`). It holds the SPA rewrite
  (`/(.*) → /index.html`) and cache headers: `/assets/*` immutable for a year; `index.html`, `sw.js` and
  `manifest.webmanifest` must revalidate.

## 3. Architecture

Feature-Sliced Design, as in memory-palaces: `app → pages → widgets → features → entities → shared`. A layer
imports from its own layer or the layers below it, never above. This is enforced by `eslint-plugin-boundaries`,
with the same rule set as memory-palaces' `fsdDependencyRules`. **Across slices**, including between two slices of
the same layer (e.g. `entities/path` → `entities/piece`), imports go only through the other slice's `index.ts`.

```
src/
  app/        router, composition-root (createServices), providers (i18n, theme), PWA update prompt,
              route error boundaries
  pages/      path · songs · piece · player · theory-chords · theory-scales · theory-symbols ·
              theory-quiz · settings · not-found
  widgets/    app-nav · path-levels · continue-card · piece-list · chord-chart · piece-skills ·
              player · player-setup · chord-explorer · scale-explorer · quiz-board
  features/   mark-learned · practice · quiz · record-answer · connect-midi · set-preference ·
              reset-progress
  entities/   piece · pattern · path · progress · settings
  shared/
    lib/music/        theory kernel (§4.1). No imports outside itself.
    lib/arrangement/  accompaniment engine (§4.3). Imports only lib/music.
    lib/schedule/     Performance → timed audio notes (§4.4). Pure.
    lib/services/     Services type, ServicesProvider, useServices (context only; no adapters)
    api/audio/        AudioOutput port, WebAudio adapter, fake
    api/midi/         MidiInput port, Web MIDI adapter, fake
    ui/               design system: shadcn primitives, PianoKeyboard, AppScreen, Sheet, …
    i18n/             i18next setup + locales/{en,ru}/<namespace>.json + localText()
    config/  test/
```

- **Entities** (`entities/<x>/`): `model/types.ts` (types and `makeX` constructors that validate and throw on a
  broken invariant, with no IO and no React), `model/selectors.ts` (pure reads), `model/store.ts` where the entity
  is saved state, `content/` where the entity is authored content, and an `index.ts` barrel.
- **Features are commands** (CQRS-lite, as memory-palaces): one use case per file, e.g.
  `features/mark-learned/mark-learned.ts` → `markLearned(progressStore, stepId, now)`. All writes go through
  features, all reads through selectors.
- **Services:** `app/composition-root.ts` exports `createServices(): Services`, i.e.
  `{ audio: AudioOutput, midi: MidiInput | null }`. The `Services` type, `ServicesProvider` and `useServices()`
  live in `shared/lib/services`, so every layer can read them. No component or hook creates an `AudioContext` or
  calls `navigator.requestMIDIAccess` itself. Tests pass fakes.
- **Components render; hooks hold behaviour; pure logic lives in `shared/lib` or `entities/*/model`.** State with
  phases is a pure reducer outside the component (§4.5). This is CODE_STYLE §1–3 of memory-palaces.
- **Routes are split** with `lazyRouteComponent`. The Player and Theory chunks do not load on the Path screen's
  first paint.

## 4. Domain core

### 4.1 `shared/lib/music`: the theory kernel

Small types instead of bare numbers and strings: `PitchClass` (0–11), `Midi`, `Letter`,
`SpelledNote { letter, accidental }` (accidental −2…+2), `Interval`, `ChordQuality` (33 qualities in 5 families:
triads; 6th & add; 7ths; 9ths & more; altered 7ths), `ChordFamily`, `ScaleKind` (major, natural / harmonic /
melodic minor, major and minor pentatonic, blues), `ChordRole` (root, 3rd, 5th, 7th, 9th, 11th, 13th).

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
That is what keeps E♭ harmonic minor's C♭, G♯ harmonic minor's F𝄪 and a diminished 7th's 𝄫7 right. Name tables
are only for display where no key context exists.

### 4.2 Content: pieces, patterns, the path

`LocalText = { en: string; ru: string }` is the type of every piece of content text a learner reads: notes,
collection names, pattern names and descriptions, section details. Credits stay as printed (they are names).

**A Piece** is anything that opens in the player: `kind: 'song' | 'exercise' | 'progression'`. Pieces are code,
one file per piece, under `entities/piece/content/<collection>/<id>.ts`. Each collection has an `index.ts` with its
`name: LocalText` and its entries in order. An entry is a piece, or a **listing**: a songbook entry with no chart
yet (`{ kind: 'listing', title, titleEn, credits, source, note? }`), shown in Songs but not openable in the player.
All 7 chart-less «Боже, спасибо» entries are listings.

Songs and exercises carry a chart:

```ts
export default definePiece({
  id: 'bz5',
  kind: 'song',
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
      kind: 'verse',
      lines: ['G C Em-G/B C@1-C/E@1-Dsus4@1-D/F#@1', 'G C Em-G/B C@1-C/E@1-Dsus4@1-D/F#@1'],
    },
    { kind: 'chorus', lines: ['Em-D/F# G Am-Em C@2-Dsus4@1-D7@1', 'Em-D/F# G Am-Em C-D', 'Em C-D'] },
    { kind: 'ending', lines: ['G'] },
  ],
})
```

**The chart format is today's, kept deliberately:**
- A section is a list of lines. A line is bars separated by spaces.
- A bar is one or more chords joined by `-`. They share the bar's beats equally, unless a chord gives its own
  `@beats`.
- A bar in which every chord gives `@beats` lasts their sum. That is how a shorter bar in mixed meter is written,
  e.g. bz10's 2/4 chorus inside a 4/4 song: `Dm@1-Edim@1 Gm@2`.
- A chord may carry a method code: `:t1`, `:3ch`, `:5.1` and so on, the playing technique for that bar from the
  source book.
- Slash chords (`D/F#`) set the bass.
- `meter` is the piece's main meter: `'2/4' | '3/4' | '4/4' | '6/8' | '12/8'`.

**Sections** are `{ kind, n?, label?, last?, detail?, lines }`:
- `kind` is `'intro' | 'verse' | 'chorus' | 'ending' | 'practice' | 'hymn' | 'part'`.
- `n` numbers a verse.
- `label` names a part (`'A'`, `'B'`).
- `last` marks a last chorus or last ending.
- `detail: LocalText` carries anything else.

i18n assembles the heading. For example, `Verse 4 and ending · 4-й куплет` becomes
`{ kind: 'verse', n: 4, detail: { en: 'and ending', ru: 'и окончание' } }`, and `Last chorus in A minor` becomes
`{ kind: 'chorus', last: true, detail: { en: 'in A minor', ru: 'в ля миноре' } }`.

An optional `melody` keeps the legacy token format: `E4/1 D4/0.5 r/1`, i.e. note plus octave, a slash, then beats
(`.5` is allowed); `r` is a rest; `|` may be written between bars and is ignored.

**Progressions** have no chart. They carry a list of chords written as scale degree + function + beats, because
their chords grow with the chosen voicing:

```ts
export default definePiece({
  id: 'twofive', kind: 'progression', title: 'ii–V–I', key: 'C', meter: '4/4', tempo: 72,
  pattern: 'jazz', voicing: { default: 'sevenths', choosable: true },
  progression: 'ii:min:4 V:dom:4 I:maj:8',
  note: {
    en: 'The basic jazz cadence. With 9ths: m9 → 9 → Maj9.',
    ru: 'Основная джазовая каденция. С нонаккордами: m9 → 9 → Maj9.',
  },
})
```

- **Degree:** a Roman numeral measured from the tonic on the major scale, with `♭` or `#` for chromatic degrees
  (`♭VII`). Case is written conventionally but carries no meaning; the function decides the quality.
- **Function:** decides how the chord grows with the voicing (triads / 7ths / 9ths):
  - `maj` → maj · maj7 · maj9
  - `min` → min · m7 · m9
  - `dom` → maj · 7 · 9
  - `domb9` → maj · 7 · 7♭9
  - `hd` → dim · m7♭5 · m7♭5
  - `=<quality>` is fixed whatever the voicing (`V:=b9:4`).
- **Bass:** a chord may name a chord tone for the bass: `i:min:2/3` means the minor chord over its 3rd.
- **Voicing choice:** `voicing.choosable: false` means the piece has one fixed voicing, as legacy `color: 0` did.

Parsing:
- `entities/piece/model/parse-chart.ts` turns chart text into `Chart`, the type `arrangement` consumes.
- `parse-progression.ts` turns a progression into a `Chart` for the chosen voicing and key.
- Both throw a `ContentError` with piece, section, line and bar position.
- `definePiece` gives authoring-time types. The catalog tests are in §9.

**Patterns.** `entities/pattern/content/` holds the accompaniment patterns: the 39 named styles (the five ways of
lesson 3, right-hand techniques, Боброва's seven accompaniment types, rhythm styles), built from 36 right-hand and
20 left-hand figures. Each style has `name: LocalText` and `description: LocalText`, and is typed with the
`Pattern` contract `arrangement` defines.

**The path is the one source of levels.** `entities/path/content/path.ts` lists, for each level 1–4 (Beginner,
Elementary, Intermediate, Advanced), an ordered list of `PathStep`s:
`{ kind: 'piece', pieceId } | { kind: 'chords', family } | { kind: 'scale', scale }`.
- Steps refer to content and never copy it.
- A step's id is derived: `piece:bz5`, `chords:sev`, `scale:harmonic`.
- Pieces carry no `level`. The Songs level filter reads a piece's level through the path selector
  `levelOf(stepId)`.
- Every piece appears on the path exactly once; listings do not appear.
- Phase 2 writes a first `path.ts` with everything at level 1. Phase 4 orders and levels it for real.

### 4.3 `shared/lib/arrangement`: the accompaniment engine

```ts
arrange(chart: Chart, options: {
  key: SpelledNote                                               // transpose target
  pattern: Pattern | { rh: Pattern; lh: Pattern } | 'from-chart' // 'from-chart' honours per-bar method codes
  melody?: Melody
}) → Performance
```

A `Performance` has:
- `bars`: start tick, beats, section, chord symbols.
- `beats`: note groups sharing an onset, which is what Step mode walks through.
- `notes: { midi, hand: 'rh' | 'lh' | 'melody', finger?, startTick, durationTicks, chord }[]`.

Timing is **12 ticks per beat**, so both 16ths (3 ticks) and triplet 8ths (4 ticks) are whole numbers. Voice
leading (the nearest voicing in range), pattern expansion (including 3/4 and major-key variants), inversion and
automatic fingering are internal; none of them is part of the interface. A pattern that needs a melody
(`r5`–`r7`) falls back to `r4` when the piece has none, as the legacy app does. Voicing is not an option here: a
progression's voicing is applied when it is parsed into a `Chart` (§4.2).

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
- `features/quiz/quiz-machine.ts`: a pure reducer for **Build chord**, **Name chord** and **Build scale**. It takes
  a **scope** `{ skills: SkillId[], roots?: PitchClass[], length?: number }`, so the open-ended Theory quiz, a
  piece's check, a path step's check and "My gaps" are the same machine with different scopes. Question generation
  takes an injected random source, so tests are deterministic. Each answer goes through
  `features/record-answer` into `progress`.

### 4.6 Knowledge gaps

- **Skill:** something a learner can know. There are 40: one per chord quality (`chord:m7`) and one per scale kind
  (`scale:harmonic`).
- **Evidence:** every quiz answer on a skill. The last 5 per skill are saved in `progress` (§6). Mistakes in the
  Player's Your turn are **not** evidence: a wrong note there is as likely rhythm or hand position as theory.
- **Rating:** `entities/progress/model/mastery.ts` exports `rate(answers) → 'known' | 'gap' | 'unknown'`:
  - **known:** at least 4 of the last 5 correct, including the latest.
  - **gap:** answered at least once, but not known.
  - **unknown:** never answered.

  It is pure and exhaustively tested.
- `skillsOfPiece(piece) → SkillId[]` (in `entities/piece`): the chord qualities a piece's chart uses, in any key.

Where gaps are found and filled. No lesson text is written anywhere; the explorer's labelled keys do the
explaining.

1. **Piece screen:** a "Chords in this song" row lists the piece's skills, marking gaps and unknowns. **Check
   these chords** runs a 6-question quiz scoped to them, using the piece's own roots. Afterwards, each gap links to
   the Chords explorer focused on that quality.
2. **Path chord steps:** a step opens the Chords explorer focused on its family (`?step=chords:sev`) with **Check
   yourself**, a quiz scoped to the family. When every quality in the family rates known, the step is marked
   learned automatically. The learner can still mark or unmark it by hand. Scale steps work the same way with
   Build scale.
3. **Theory → Quiz → My gaps:** a scope of gap skills first, then unknown skills used by pieces the learner has
   opened in the Player. If there are none, it offers the whole quiz instead.
4. **Continue card:** when the suggested piece has gaps or unknowns, the card gets one extra line
   ("2 chords to check") that opens that piece's check. Nothing else is added.

## 5. Screens and navigation

**Navigation:** bottom bar `Path · Songs · Theory` on phones; a left rail from 1024px. Settings is a gear in the Path
header. The Player is full-screen with a back control.

| Route                                        | Screen                                                                                                                                                                                   |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                                          | **Path**: the Continue card (§4.6 ④), then levels 1–4 with progress, then step rows with a learned check                                                                                 |
| `/songs`                                     | **Songs**: search; collection and level filters; rows with title (original + translation), key, level, learned check; listings marked "no chart yet"                                      |
| `/songs/$pieceId`                            | **Piece**: title, credits, key, meter, note; "Chords in this song" + Check (§4.6 ①); the chart by section (tap a bar to hear it); **Practise** as the one primary action; Mark as learned; a link to the key's scale |
| `/play/$pieceId`                             | **Player**: a one-line setup summary (key · tempo · hands) that opens the **Setup sheet**; the mode switch `Listen · Step · Your turn`; the keyboard with hand colours; the current-bar note grid; a chart strip to jump; the transport (Play, or Back / Next) as the primary action. The Setup sheet holds key, tempo, hands, pattern, per-hand patterns, voicing (progressions that allow it) and the toggles (finger numbers, melody, metronome, count-in) |
| `/theory/chords` `/theory/scales` `/theory/symbols` `/theory/quiz` | **Theory**, with a segmented switch. Chords: root, family, quality, inversion, hands, keyboard coloured by chord role, play / arpeggio, and Check yourself when opened from a path step. Scales: root, kind, degrees or fingering, rhythm practice, diatonic chords. Symbols: reading chord symbols + the chord dictionary. Quiz: Build chord, Name chord, Build scale, My gaps; chosen families and scales; stats |
| `/settings`                                  | Language, theme, MIDI, reset progress                                                                                                                                                    |

**Progress rules:**

- **Continue** suggests the last-practised piece if it is not learned, else the first unlearned step in path order
  (level 1 first, then each level's list order).
- `lastPractised` is set when the Player opens a piece.
- A step is marked or unmarked as learned from:
  - the check on its Path row (a toggle button);
  - the Piece screen;
  - the Chords or Scales explorer when opened from a path step (the step id travels as `?step=`);
  - automatically, for chord and scale steps, per §4.6 ②.

The legacy Guide tab is dropped. Chord-symbol reading moves to Theory → Symbols, and the song-learning advice is not
carried over (the copy rule of §8).

## 6. State and saved data

- **URL search params hold what you are looking at.** Validated by the router; an invalid value falls back to the
  default. Shareable, and the back button works.
  - explorers: root, family, quality, scale kind, view, rhythm, tempo, `step`
  - player: `key`, `tempo` (default: the piece's), `hands`, `mode`, `pattern`, `rh`, `lh`, `voicing`

  Example: `/theory/chords?root=G&quality=m9`, `/play/bz5?key=A&hands=lh&mode=turn`.
- **Saved stores** (zustand `persist` → `localStorage`, each with a `version` and a `migrate`, so future changes to
  their shape keep learners' progress):
  - `settings` (`pt-settings`): `theme: 'system' | 'light' | 'dark'`, `locale: 'en' | 'ru'` (first run: from
    `navigator.language`), `practice: { fingerNumbers, melody, metronome, countIn }`,
    `quiz: { families: ChordFamily[], scales: ScaleKind[] }`.
  - `progress` (`pt-progress`): `learned: Record<StepId, isoDate>`, `lastPractised: { pieceId, at } | null`,
    `answers: Record<SkillId, { correct: boolean; at: isoDate }[]>` (the last 5 per skill),
    `quiz: { correct, total, streak, best }`.
- **Nothing is imported from the legacy app.** It kept no data worth carrying over.
- **Theme:** an inline boot script sets `data-theme` to `light` or `dark` before first paint. For `system` it
  resolves `prefers-color-scheme` and keeps following changes. A dark-mode user never sees a white flash.

## 7. Errors and edge cases

| Situation                                             | Behaviour                                                                                   |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `localStorage` unavailable (private mode, quota)      | Stores run in memory; the app works; nothing throws                                         |
| Audio suspended until a gesture                       | The first tap anywhere calls `audio.unlock()`; Play buttons also unlock before playing      |
| No Web MIDI                                           | MIDI controls hidden; Settings shows one line saying this browser cannot connect a keyboard |
| MIDI permission denied / no device                    | The Connect control shows that status in one line; taps on the on-screen keyboard still work |
| Unknown `$pieceId`, or a listing's id                 | Not-found screen with a link to Songs                                                       |
| Invalid search param                                  | Replaced by the default; no error shown                                                     |
| A render error                                        | A route-level error boundary with "Something went wrong" + reload; other routes unaffected  |
| Broken content (chart, chord symbol, missing text)    | Cannot ship: the catalog tests fail in CI (§9)                                              |

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
- **Dark mode:** `[data-theme]` remaps the tokens. `@custom-variant dark (&:where([data-theme=dark],
  [data-theme=dark] *))` binds Tailwind's `dark:` to the attribute, so the `dark:` classes shadcn primitives ship
  follow the app's setting, not the OS. App code writes no `dark:` classes of its own.
- 44px minimum touch targets. Visible `focus-visible` rings. `prefers-reduced-motion` honoured. Safe-area insets
  respected. Mobile-first.
- `shared/ui/PianoKeyboard`: one presentational component used by every screen. Props: range, marks (per key: role,
  label, hand), selected and wrong keys, `onKeyPress`. Keys are buttons with note-name labels for screen readers.

**i18n:**
- **Interface strings** are in namespaces `common, path, songs, piece, player, theory, quiz, settings`, one JSON file
  per namespace per locale in `shared/i18n/locales/{en,ru}/`. A test fails if the two locales' key sets differ.
- **Content text** is `LocalText { en, ru }` (§4.2), read through `localText(text, locale)`. A test fails if any
  `LocalText` in content has an empty language. Claude drafts the Russian during Phase 2; the owner reviews it in
  Phase 4.
- **Titles and credits:** English shows `titleEn` with the original `title` beneath, and Russian shows `title`.
  Credits are shown as printed.
- **Note and chord names** are international in both locales (B, not H; `#` and `♭`).

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
   - `parse-chart`: every syntax feature, including mixed-meter bars, plus error positions.
   - `parse-progression`: every function × voicing, fixed qualities, chromatic degrees, chord-tone bass.
   - `arrangement`, on small hand-worked charts: note counts, tick positions, bar lengths in 3/4, 6/8 and 12/8,
     voicings inside range, voice leading moving each voice by at most a stated interval, fingering present when
     asked, and the melody-pattern fallback.
   - `schedule`, `practice-machine`, `quiz-machine` (every scope), `mastery.rate` (every boundary: 3/5, 4/5 with
     the latest wrong, 4/5 with the latest right, fewer than 5 answers), `skillsOfPiece`, and the stores.
2. **Content tests:**
   - every piece parses and arranges in all 12 keys with its own pattern and with every pattern, without throwing;
   - every chord symbol in content is recognised;
   - every `LocalText` has both languages;
   - en/ru interface key parity;
   - every path step resolves;
   - every piece is on the path exactly once, and no listing is;
   - from Phase 4: every level has at least one step.
3. **Component tests** (Testing Library, by role and label, with `FakeAudio` and `FakeMidi`):
   - PianoKeyboard taps
   - Mark as learned, including the automatic marking
   - the Player's mode switching, Setup sheet and Your-turn feedback
   - quiz answering in each scope
   - the Continue card's choice and its gap line
   - the Piece screen's check

**Coverage gate in CI:** at least 90% lines on `src/shared/lib/**` and `src/entities/*/model/**`. There is no
global number.

## 10. Documentation delivered

- `CLAUDE.md`: concise, in the style of memory-palaces. It covers:
  - what the app is, the stack and the commands;
  - the layer rules and where each kind of code goes;
  - the verify command (`npm run typecheck && npm run lint && npm run test`, plus `npm run build` after touching
    startup);
  - the skills to use: `tdd`, `vite-react-best-practices`, `vercel-react-best-practices`,
    `vercel-composition-patterns`, `shadcn`, `impeccable`, and `vercel:knowledge-update` before touching Vercel
    config;
  - "read before you touch" pointers;
  - running Prettier on touched files only.
- `docs/CODE_STYLE.md`: memory-palaces' rules adapted to this app (small components, logic in hooks, machines,
  composition over configuration, Tailwind tokens, TypeScript and imports, performance), with the iOS keyboard,
  drag-and-drop and sync material removed, plus a **music code** section (§4.1's spelling rule, branded types, ticks
  not seconds in domain code).
- `docs/UBIQUITOUS_LANGUAGE.md`: Piece, Listing, Collection, Chart, Progression, Degree, Function, Section, Bar,
  Chord symbol, Chord tone, Role, Voicing, Inversion, Pattern, Method code, Performance, Tick, Level, Path, Step,
  Learned, Skill, Evidence, Known / Gap / Unknown, Check, Listen / Step / Your turn, Quiz modes. Each entry gives
  the words to avoid.
- `docs/CONTENT.md`: how to add a piece, listing, collection, pattern or path step; the full chart, progression,
  section and melody syntax; how to write `LocalText`.
- `docs/adr/`:
  - `0001-clean-rewrite`
  - `0002-content-as-code-one-file-per-piece`
  - `0003-view-state-in-url-saved-state-in-stores`
  - `0004-audio-and-midi-behind-ports`
  - `0005-levels-live-on-the-path`
  - `0006-gaps-from-quiz-evidence-only`
- `docs/agents/issue-tracker.md`, `triage-labels.md`, `domain.md`: issues and specs as local markdown in `.scratch/`,
  as in memory-palaces.
- `README.md`: what it is, how to run it, how to add a piece.

## 11. Phases

Each phase gets its own implementation plan (`writing-plans`) and ends green in CI.

1. **Foundation:**
   - move legacy to `legacy/` and repoint Pages;
   - scaffold Vite + React + TS; ESLint (with boundaries), Prettier, Vitest; Tailwind + shadcn init with the
     `dark` variant bound;
   - TanStack Router with every route from §5 as an empty screen;
   - i18n (en/ru), theme boot script, PWA;
   - CI workflow and `vercel.ts`;
   - `CLAUDE.md`, CODE_STYLE, glossary, ADRs, `docs/agents`, README.
2. **Core:**
   - `music`;
   - `parse-chart` and `parse-progression`, then port all 51 pieces, the 7 listings, the collections and all
     patterns to content files, with the Russian `LocalText` drafted;
   - the first `path.ts`, with everything at level 1;
   - `arrangement`, then `schedule`, the audio and MIDI ports;
   - the practice and quiz machines, `mastery`, and the stores.
3. **Screens:**
   - visual direction (impeccable);
   - Theory: the explorers, Symbols, and the quiz with scopes and My gaps;
   - Songs and Piece, with the chords check;
   - the Player, with the Setup sheet;
   - Path, progress and the Continue card;
   - Settings.
4. **Levels, language and switch-over:**
   - Claude proposes a level and order for every step from what it uses (chord qualities, patterns, meter, tempo,
     melody, source lesson);
   - the owner reviews the levels and the Russian content text;
   - turn on the every-level-has-a-step test;
   - run the §12 parity check;
   - point production at Vercel, and delete `legacy/` and the Pages workflow.

## 12. Parity checklist (verified in Phase 4)

- **Chords:** 12 roots × 33 qualities; inversions; one hand or both; block and arpeggio playback; degree labels
  and role colours.
- **Scales:** 7 kinds × 12 roots; degree / RH / LH fingering views; 5 practice rhythms at 40–160 BPM; RH, LH or
  hands together; diatonic triads and 7ths with Roman numerals; relative major/minor.
- **Songs:** all 51 pieces and 7 listings, with credits and notes; tap a bar to hear it; open in the player; jump to
  the key's scale.
- **Player:** any key; pattern from the chart's method codes or any of the 39; separate RH/LH patterns; triads, 7ths
  or 9ths for the progressions that allow it; both hands, RH or LH; Listen, Step (beat, bar, back, jump) and Your
  turn with MIDI or taps; finger numbers; melody; metronome; count-in; 40–160 BPM; loop.
- **Quiz:** Build chord, Name chord, Build scale; chosen families and scales; correct, total, streak and best.
- **Guide:** the chord-symbol reading notes and the chord dictionary (now in Theory → Symbols).
