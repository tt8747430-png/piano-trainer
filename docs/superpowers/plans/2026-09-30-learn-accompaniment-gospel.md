# Accompaniment and Gospel lessons (5.4) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Learn's Accompaniment and Gospel modules: twelve lessons whose patterns play in place over the pieces their
sources teach them on, whose progressions play as the Progressions tool's row, and whose links open the tools and
the Player.

**Architecture:** The lesson entity gains two blocks (`pattern`, `progression`) and four link places (`progressions`,
`passing-chords`, `reharmonise`, `piece`), each read by the catalog test. `lesson-view` renders a pattern over a
piece's first line (`patternOpening`, from `arrangePiece` and `schedule`) and a progression through `ProgressionRow`,
which moves to `features/play-example` so the tool and a lesson share it. The lessons are content.

**Tech Stack:** React 19, TanStack Router, i18next, Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-29-learn-lessons-references-tools-design.md` §4.1, §6 (6.1, 6.2).

## Global Constraints

- FSD: a widget imports features, entities and shared through their `index.ts`; the kernel imports nothing.
- Every text in English and Russian; Russian typed against English.
- No casts, no `any`, no eslint-disable; Prettier on touched files only.
- A lesson's link is data (`LessonLink`); `lesson-view` makes it a route.
- Gate: `npm run typecheck && npm run lint && npm run test`; `npm run build` after touching routes.

## Review Focus

- A melody pattern (r5, r6, r7) over a piece with no melody would play the fallback: the content test must refuse it.
- A pattern block's Play on a piece in 3/4 or with a pickup: the opening is the chart's first line, whatever its bars.
- The Player opened from a lesson closes back to the lesson (history), not to Songs.
- A progression block in a minor key reads its numerals from natural minor (`numeralChord`), as the tool does.
- Learn's filters (level, category) over three modules: a module with nothing left under the filter is not shown.

---

### Task 1: The progression row is an example a lesson shares

**Files:** Move `src/widgets/progressions/ui/ProgressionRow.tsx` → `src/features/play-example/ui/ProgressionRow.tsx`;
modify `src/features/play-example/index.ts`, `src/widgets/progressions/ui/ProgressionsTool.tsx`,
`src/widgets/progressions/ui/ProgressionLibrary.tsx` (if it uses the row).

**Interfaces:** Produces `ProgressionRow({ numerals, musicKey, size, onShow: (shown: ShownKeys) => void })` from
`@/features/play-example`.

- [ ] Move the file; `onShow` takes `ShownKeys` (`{ keys, marks: new Map() }`) as every example does; the tool keeps
  `ShownKeys` in its state and passes `keys` and `marks` to its keyboard.
- [ ] Run `npx vitest run src/widgets/progressions src/pages/progressions src/features/play-example` — PASS (a move:
  the tool's tests hold it).
- [ ] Commit "Share the progression row: a lesson plays a progression as the tool does".

### Task 2: A lesson names patterns, progressions, tools and pieces

**Files:** Modify `src/entities/lesson/model/types.ts`, `src/entities/lesson/content/catalog.test.ts`.

**Interfaces:** Produces the blocks
`{ kind: 'pattern'; pattern: PatternId; piece: PieceId }` and
`{ kind: 'progression'; numerals: string; key: Key; size?: NumeralSize }`, and the links
`{ place: 'progressions'; numerals: string; key: Key; size?: NumeralSize }`,
`{ place: 'passing-chords'; key: Key; from: string; to: string }`,
`{ place: 'reharmonise'; key: Key; note: SpelledNote }`,
`{ place: 'piece'; piece: PieceId; pattern?: PatternId }`.

- [ ] **Failing test:** in "catch a symbol, a note line, an answer or a link they cannot read", add:
  a `pattern` block over `'nowhere'` → `['nowhere']`; `{ pattern: 'r5', piece: 'ex3' }` → `['r5 over ex3']` (a tune
  pattern over a piece with no melody); a `progression` `'I V x'` → `['I V x']`; a `piece` link to `'nowhere'` →
  `['nowhere']`; a `passing-chords` link from `'C'` to `'Hq'` → `['Hq']`; a `progressions` link `'I Q'` → `['I Q']`.
- [ ] Run `npx vitest run src/entities/lesson` — FAIL (the kinds are unknown to the types).
- [ ] Add the types; `problemsOf` reads each: `pieceById`, `needsMelody` with `melodyOf`, `parseNumerals`,
  `parseChordSymbol`.
- [ ] Run — PASS. Commit "Let a lesson name a pattern over a piece, a progression, the tools and the Player".

### Task 3: The lesson plays them

**Files:** Create `src/widgets/lesson-view/model/pattern-example.ts` (+ test), `src/widgets/lesson-view/ui/PatternExample.tsx`;
modify `LessonBlock.tsx`, `LessonLinkRow.tsx` (takes a `title: string`), `LessonView.test.tsx`, `learn` locales.

**Interfaces:** `patternOpening(piece: Piece, pattern: PatternId): { sounds: readonly Sound[]; shown: ShownKeys }` —
the piece's first line arranged with the pattern (both hands, the piece's key and tempo), cut where its second line
begins.

- [ ] **Failing tests:** `pattern-example.test.ts`: over `ex3` with `M1`, every sound is before the first line's end
  (4 bars of 4/4 at 76 bpm: `< 4 * 4 * 60 / 76`), both hands sound (notes below and above middle C), and `shown.keys`
  are the sounds' keys, lowest first, each once. Over `otche` with `r5`, the tune's first note (C4) sounds.
  `LessonView.test.tsx`: a lesson with a pattern block shows the pattern's name and description, **Play** plays
  (the fake audio's sounds) and turns into **Stop**; **Open in the Player** links to `/play/ex3?pattern=M2`; a
  progression block shows its row (Dm G C for `ii V I` in C) and links to `/learn/progressions?…`; the new link rows
  lead to `/learn/passing-chords?key=C&from=C&to=F`, `/learn/reharmonise?key=C&note=E`, `/play/otche?pattern=r4`.
- [ ] Run `npx vitest run src/widgets/lesson-view` — FAIL.
- [ ] Implement: `patternOpening`; `PatternExample` (a card: the pattern's name, its description, "Over «…»",
  Play/Stop, Open in the Player); `LessonBlock`'s `pattern` and `progression` cases (the row, then a link row "Open
  in Progressions"); `LessonLinkRow`'s four places (Progressions `ListMusic` grass, Passing chords `Waypoints` yellow,
  Reharmonise `Blend` lilac, the Player `CirclePlay` sand, as Learn's tools show them). Strings:
  `learn.example.{over, openInPlayer, inProgressions}` in both languages.
- [ ] Run — PASS; the gate. Commit "Play a lesson's pattern over its piece, and its progression as the tool's row".

### Task 4: Accompaniment, part one

**Files:** Create `src/entities/lesson/content/{bass-and-chords, broken-chords, five-ways, right-hand-techniques,
seven-types}.ts`; modify `content/index.ts`, `model/types.ts` (`LESSON_MODULES` adds `accompaniment`), the `learn`
locales (`module.accompaniment`), `catalog.test.ts` (the order test per module; the level test per module).

Outlines (each section's prose written in the file, both languages):

**`bass-and-chords`** — "Bass and chords" / «Бас и аккорды»; the two hands' jobs, and the first ways to play a
chord chart. Level 1, `accompaniment`.
1. *Two jobs* — the left hand plays the bass (the chord's root, low), the right hand the chord (near the middle).
   `chords` `C`, `F`, `G`.
2. *The nearest chord* — the right hand moves to the nearest inversion (C → F/C → G/B → C): the hand barely moves.
   `chords` `C`, `F/C`, `G/B`, `C`.
3. *Bass and chords* — way 1: `pattern` `M1` over `ex3`.
4. *A dotted bass* — way 5: `pattern` `M5` over `ex3`.
5. *Bass and chord in turn* — Боброва's 2nd type: `pattern` `r2` over `otche`; *The chord's pulse* — the 3rd:
   `pattern` `r3` over `otche`.
6. *Try it* — `quiz` "Play F major's bass and chord together: F in the bass, the chord above." `{ notes: ['F', 'A',
   'C'] }`; `link` "Lesson 3 in the Player" → `{ place: 'piece', piece: 'ex3' }`.

**`broken-chords`** — "Broken chords and arpeggios" / «Ломаные аккорды и арпеджио»; a chord's notes one at a time.
Level 2, `accompaniment`.
1. *Broken, not struck* — `pattern` `M2` over `ex3`.
2. *Arpeggios through both hands* — `pattern` `M3`, `pattern` `M4` over `ex3`.
3. *Harmonic figuration* — Боброва's 4th type, the most used in church: `pattern` `r4` over `otche`; `pattern`
   `r4b` over `otche`.
4. *Two octaves up* — `pattern` `t2` over `ex5`.
5. *Try it* — `quiz` "Play A minor's notes one at a time, then together." `{ chord: 'Am' }`.

**`five-ways`** — "The five ways" / «Пять способов»; Called to Play's lesson 3: one progression, five ways to play it.
Level 1, `accompaniment`.
1. *One progression* — `chords` `C`, `Dm`, `G`, `C`, `F`, `C`, `G`, `C`.
2. *The five ways* — `pattern` `M1` … `M5` over `ex3`.
3. *A new way on every chord* — the method studies write a way over each chord; `link` → `{ place: 'piece', piece:
   'exm1' }`.
4. *Where they come from* — `link` "Bass and chords" → lesson `bass-and-chords`; `link` "Broken chords and arpeggios"
   → lesson `broken-chords`.

**`right-hand-techniques`** — "Right-hand techniques" / «Техники правой руки»; Called to Play's techniques, each on
its lesson's study. Level 2, `accompaniment`.
1. *Octave jumps* — `pattern` `t1` over `ex5`. 2. *Runs down* — `pattern` `t3` over `ex6`. 3. *Dotted chords* —
`pattern` `t5` over `ex7`. 4. *Moving voices* — `pattern` `p51`, `p52`, `p53` over `ex8`. 5. *Sixths* — `pattern`
`s6u`, `s6d` over `ex9`. 6. *Try it* — `quiz` "Play a 6th above E: E and C." `{ notes: ['E', 'C'] }`.

**`seven-types`** — "The seven types of accompaniment" / «Семь видов аккомпанемента»; Боброва's seven on her hymn,
and what each is for. Level 2, `accompaniment`.
1. *One hymn, seven ways* — `r1` … `r7` over `otche`, a `pattern` block each, grouped: *Chords* (`r1`, `r2`, `r3`),
   *Figuration* (`r4`, `r4b`), *With the melody* (`r5`, `r6`, `r7`).
2. *Mixing them* — figuration in the verse, the chord's pulse in the chorus; the harmonic basis to start and end.
   `note`; `link` "The hymn in the Player" → `{ place: 'piece', piece: 'otche' }`.

- [ ] Add `accompaniment` to `LESSON_MODULES` (after `fundamentals`) and its name; the tests: the order of each module,
  and the fundamentals' levels only 1–2.
- [ ] Run `npx vitest run src/entities/lesson src/pages/learn` — the order test FAILS until the five files are in the
  index; then PASS. Commit "Write the first Accompaniment lessons: bass and chords, broken chords, the five ways,
  right-hand techniques, the seven types".

### Task 5: Accompaniment, part two

**Files:** Create `accompanying-a-hymn.ts`, `common-progressions.ts`, `passing-chords.ts`, `reharmonising-a-melody.ts`;
modify `content/index.ts`, `catalog.test.ts` (the order).

**`accompanying-a-hymn`** — "Accompanying a hymn" / «Аккомпанемент гимна»; from the chart to the service. Level 2.
1. *Before you play* — `steps`: find the key and the meter; play the chords in blocks until they are easy; sing or hum
   the tune over them. 2. *An introduction* — the hymn's last line, or its I–IV–V–I; `pattern` `r1` over `amazing`.
3. *Verse and chorus* — one type for the verse, a fuller one for the chorus; `pattern` `r4` over `amazing`;
`pattern` `r3` over `amazing`. 4. *Breathing with the singers* — `note`: hold the last chord of a line while they
breathe, keep the tempo steady. 5. *Try it* — `link` "Amazing Grace in the Player" → piece `amazing`; `link` "Silent
Night in the Player" → piece `silent`.

**`common-progressions`** — "Common progressions" / «Распространённые последовательности»; the progressions that carry
most songs and hymns, in any key. Level 2.
1. *I–IV–V–I* — `progression` `I IV V I` in C. 2. *I–V–vi–IV* — in G. 3. *I–vi–IV–V* — in F. 4. *ii–V–I* — in C,
`size: 'sevenths'`. 5. *In a minor key* — `i iv V i`, `i VI III VII`, `i VII VI V` in A minor. 6. *Try it* — `quiz`
"Play the IV chord of D major." `{ chord: 'G' }`; `link` "Every style in Progressions" → `progressions` `I IV V I`
in C.

**`passing-chords`** — "Passing chords" / «Проходящие аккорды»; a chord between two of a hymn's chords. Level 3.
1. *Between two chords* — C → F with C7 between. `chords` `C`, `C7`, `F`; `link` → `passing-chords` C → F.
2. *The diminished 7th* — F → G with F♯°7 between. `chords` `F`, `F#°7`, `G`; `link` → `passing-chords` F → G.
3. *A secondary dominant* — C → Dm with A7 between. `chords` `C`, `A7`, `Dm`; `link` → `passing-chords` C → Dm.
4. *The bass walks* — C → Am through C/B. `chords` `C`, `C/B`, `Am`. 5. *Try it* — `quiz` "Play the chord that leads
into F: C7." `{ chord: 'C7' }`.

**`reharmonising-a-melody`** — "Reharmonising a melody note" / «Новая гармония для ноты мелодии»; a melody note
held by other chords. Level 3.
1. *One note, many chords* — E in C major: C, Am, Em. `chords` `C`, `Am`, `Em`; `link` → `reharmonise` C, E.
2. *7th chords* — E as the 7th of FMaj7, the 9th of Dm9, the 5th of A7. `chords` `FMaj7`, `Dm9`, `A7`.
3. *Choosing* — the bass should move well, the new chord should lead to the next one. `note`.
4. *Try it* — `quiz` "G is in the melody: play the minor chord of C major that holds it." `{ chord: 'Em' }`;
   `link` → `reharmonise` C, G.

- [ ] Run `npx vitest run src/entities/lesson` — PASS. Commit "Write the Accompaniment lessons on hymns, common
  progressions, passing chords and reharmonising".

### Task 6: Gospel

**Files:** Create `gospel-progressions.ts`, `gospel-passing-chords.ts`, `gospel-reharmonisation.ts`; modify
`content/index.ts`, `model/types.ts` (`gospel` module), locales, `catalog.test.ts`.

**`gospel-progressions`** — "Gospel progressions" / «Госпел-последовательности». Level 3, `gospel`.
1. *The gospel sound* — 7ths on every chord. 2. *The lift* — `progression` `IV V iii vi` in C, sevenths. 3. *The
standard* — `I iii IV V` in F, sevenths. 4. *The hymn* — `I IV I V` in G. 5. *The walk-up* — `♭VI ♭VII I` in C.
6. *In the rhythm* — `pattern` `gospel` over `pop`. 7. `link` → `progressions` `IV V iii vi` in C, sevenths.

**`gospel-passing-chords`** — "Gospel passing chords" / «Проходящие аккорды в госпел». Level 3, `gospel`.
1. *The 1 to the 4* — `chords` `C`, `C7`, `F`; link → passing C → F. 2. *The ♯iv diminished* — `chords` `F`,
`F#°7`, `C/G`. 3. *The walk-up* — `chords` `A♭`, `B♭`, `C`. 4. *A ii–V into any chord* — `chords` `C`, `Em7`, `A7`,
`Dm7`; link → passing C → Dm.

**`gospel-reharmonisation`** — "Gospel reharmonisation" / «Госпел-реармонизация». Level 3, `gospel`.
1. *Plain chords made rich* — `chords` `C`, `F`, `G` → `CMaj9`, `FMaj9`, `G9`. 2. *Sus to dominant* — `chords`
`G7sus4`, `G7`. 3. *IV over V* — `chords` `F/G`, `C`. 4. *The minor iv* — `chords` `F`, `Fm`, `C`. 5. *Tensions* —
`link` → `tensions` `d7`. 6. `link` → `reharmonise` C, C.

- [ ] Run — PASS. Commit "Write the Gospel lessons: progressions, passing chords, reharmonisation".

### Task 7: See it, and record it

- [ ] Screenshots (phone 390px, laptop 1280px): `/learn` (three modules), `/learn/lessons/seven-types`,
  `/learn/lessons/common-progressions`.
- [ ] ADR 0021 (a pattern is heard over a piece; the row shared); CONTENT.md (the new blocks and links); CLAUDE.md;
  PRODUCT.md; the roadmap's Built line (sub-project 5 complete).
- [ ] The gate with `npm run build`; commit "Record the Accompaniment and Gospel lessons: ADR 0021, …".
