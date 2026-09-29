# Learn's tools: Chord finder, Reharmonise, Passing chords — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Part 5.3's first half: three Learn tools that work something out from what the learner gives them — the
**Chord finder** names the keys played, **Reharmonise** lists the chords that hold a melody note, **Passing chords**
suggests chords between two chords — and a Tools group on Learn. Progressions and its Player source are the next
plan's (`2026-09-29-learn-progressions.md`).

**Architecture:** The kernel gains `spellBelow` and `plainRoot` (a root spelled by letters, then its plain name when
it would be F♭, C♭, E♯, B♯ or a double), `keyPitchClasses`, `spanInterval`, and three modules: `chord-finder.ts`
(every chord the builder makes, matched by pitch classes), `reharmonise.ts` (the owner's second table as roles per
chord) and `passing-chords.ts` (each rule an interval from the target's root), with `voice-lead.ts` for playing a row
smoothly. `features/play-example` gains `noteOnTop` (moved from the tension explorer). Three widgets own their URL
views; three pages and routes join Learn under Tools.

**Tech Stack:** React 19, TypeScript 6, TanStack Router, i18next, Vitest 4.

**Spec:** `docs/superpowers/specs/2026-09-29-learn-lessons-references-tools-design.md` (§5.1–§5.3), roadmap §10.2,
§10.3.

## Global Constraints

- FSD layers lint-enforced; the kernel imports nothing outside itself; no `any`, no casts beyond `as const` (the one
  in `spellAbove` goes: a note is spelled on its letter by one helper both directions share).
- Every string in `en` and `ru`; a count after a colon; no `{{count}}`.
- Tests first; a screen's test through `renderApp`; `Midi` built with `midi(n)` in tests.
- `npx prettier --write <files>`; `npm run typecheck && npm run lint && npm run test`; `npm run build` after routes.
- Commit on `main` with the co-author line.

## Review Focus

- **The same notes read as two chords** (C E G A: C6 or Am7/C): the root position first, the other as "Also".
- **A hand leaving out the 5th** (C E B♭): named C7, marked as without its 5th.
- **A root the letters would spell F♭ or B𝄫** (a tension below A♭): the plain name (E, A).
- **A passing chord equal to the From or To chord** (From already the V7): left out, never a row that repeats.
- **An unreadable typed chord** in Passing chords: a line under the field, no suggestions, no crash.

---

### Task 1: Spelling below, plain roots, a key's notes, an interval by its span

**Files:** `src/shared/lib/music/{interval,note,scale,interval-facts,index}.ts` and their tests.

**Produces:** `spellBelow(from, interval): SpelledNote`; `plainRoot(note): SpelledNote`;
`keyPitchClasses(key): ReadonlySet<PitchClass>`; `spanInterval(semitones: number): ReferenceInterval`.

- [ ] **Step 1: Failing tests**

`interval.test.ts`:

```ts
describe('spellBelow', () => {
  it('spells the note an interval below by letters, as spellAbove does above', () => {
    expect(noteName(spellBelow(note('G'), INTERVALS.M3))).toBe('E♭')
    expect(noteName(spellBelow(note('G'), INTERVALS.m9))).toBe('F#')
    expect(noteName(spellBelow(note('G'), INTERVALS.A11))).toBe('D♭')
    expect(noteName(spellBelow(note('A', -1), INTERVALS.M3))).toBe('F♭')
  })
})
```

`note.test.ts`:

```ts
describe('plainRoot', () => {
  it('names a root plainly where letters would give F♭, C♭, E♯, B♯ or a double', () => {
    expect(plainRoot(note('F', -1))).toEqual(note('E'))
    expect(plainRoot(note('B', 1))).toEqual(note('C'))
    expect(plainRoot(note('B', -2))).toEqual(note('A'))
    expect(plainRoot(note('E', -1))).toEqual(note('E', -1))
    expect(plainRoot(note('F', 1))).toEqual(note('F', 1))
  })
})
```

`scale.test.ts`:

```ts
describe('keyPitchClasses', () => {
  it('holds a major key’s scale, and a minor key’s with its raised 6th and 7th', () => {
    expect([...keyPitchClasses({ tonic: note('C'), minor: false })].sort((a, b) => a - b)).toEqual([
      0, 2, 4, 5, 7, 9, 11,
    ])
    expect([...keyPitchClasses({ tonic: note('A'), minor: true })].sort((a, b) => a - b)).toEqual([
      0, 2, 4, 5, 6, 7, 8, 9, 11,
    ])
  })
})
```

`interval-facts.test.ts`:

```ts
describe('spanInterval', () => {
  it('names two keys’ distance, a compound one as its simple interval', () => {
    expect([0, 3, 6, 12, 16, 19].map(spanInterval)).toEqual(['r', 'm3', 'A4', 'P8', 'M3', 'P5'])
  })
})
```

- [ ] **Step 2: Run** `npx vitest run src/shared/lib/music` — FAIL (not exported).
- [ ] **Step 3: Implement.** In `interval.ts`, a private `spelledOn(letter: Letter, pc: PitchClass): SpelledNote`
  (the accidental that takes `letter` to `pc`, or the plain spelling past a double, narrowed by a type guard over
  `ACCIDENTALS` in `note.ts`, no cast) used by `spellAbove` and the new `spellBelow` (letter `steps` down, pitch
  class `semitones` down). In `note.ts`: `ACCIDENTALS = [-2, -1, 0, 1, 2] as const` with `isAccidental`, and
  `plainRoot`. In `scale.ts`: `keyPitchClasses` (major scale; a minor key's natural and melodic minor together, as
  `spellInKey` reads them). In `interval-facts.ts`: `spanInterval` over the simple group by `semitones % 12`, 12 and
  its multiples the octave. Export all four.
- [ ] **Step 4: Run** — PASS. **Commit:** "Spell a note below by letters, name a root plainly, gather a key's notes,
  and name two keys' distance".

### Task 2: Naming the keys played

**Files:** `src/shared/lib/music/chord-finder.ts`, `chord-finder.test.ts`, `index.ts`.

**Produces:** `interface FoundChord { chord: BuiltChord; parts: ChordParts; bass?: SpelledNote; symbol: string;
no5th: boolean; inversion?: number }`, `nameChords(keys: readonly Midi[]): FoundChord[]` (best first).

- [ ] **Step 1: Failing test**

```ts
const named = (...keys: number[]) => nameChords(keys.map((k) => midi(k))).map((found) => found.symbol)

describe('nameChords', () => {
  it('names a chord in root position, then what else the notes can be', () => {
    expect(named(60, 64, 67)).toEqual(['C'])
    expect(named(60, 64, 67, 69)).toEqual(['C6', 'Am7/C'])
    expect(named(52, 55, 59, 62)[0]).toBe('Em7')
  })

  it('names an inversion as a slash chord, the bass spelled as its chord tone', () => {
    expect(named(64, 67, 72)[0]).toBe('C/E')
    const found = nameChords([midi(64), midi(67), midi(72)])[0]
    expect(found?.inversion).toBe(1)
  })

  it('takes a chord without its 5th, after the chords whose every tone is there', () => {
    const found = nameChords([midi(48), midi(52), midi(58)])
    expect(found[0]?.symbol).toBe('C7')
    expect(found[0]?.no5th).toBe(true)
  })

  it('names nothing from fewer than three notes, or notes no chord holds', () => {
    expect(named(60, 64)).toEqual([])
    expect(named(60, 61, 62)).toEqual([])
  })

  it('spells a root by the builder’s one rule', () => {
    expect(named(61, 64, 68)[0]).toBe('C#m')
    expect(named(61, 65, 68)[0]).toBe('D♭')
  })
})
```

- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Implement** — the builder's `CHORD_PARTS`, each built on C once at module load into its pitch-class
  shape (and, for a chord of four notes or more with a perfect 5th, its shape without it). For each pitch class
  played as a root: the others' distances from it matched to a shape; the root spelled by `builtRootSpelling`, the
  chord built; the bass, when not the root, is the chord tone on the lowest key's pitch class; the inversion is that
  tone's place in the chord's tones when it is 3 or less. Ranked: root position, then every tone there, then a table
  quality, then fewer tones; each symbol once.
- [ ] **Step 4: Run** — PASS. **Commit:** "Name the keys played as every chord the builder makes, the root position
  first".

### Task 3: The chords that hold a note

**Files:** `src/shared/lib/music/reharmonise.ts`, `reharmonise.test.ts`, `index.ts`.

**Produces:** `HOLDING_GROUPS` (`['triads','major','minor','dominant']`), `type HoldingGroup`,
`interface HoldingChord { chord: BuiltChord; parts: ChordParts; degree: string; inKey: boolean }`,
`chordsHolding(melody: SpelledNote, key: Key): Readonly<Record<HoldingGroup, readonly HoldingChord[]>>`.

- [ ] **Step 1: Failing test** — the owner's table for G, exactly:

```ts
const C_MAJOR = { tonic: note('C'), minor: false }
const symbols = (group: HoldingGroup) =>
  chordsHolding(note('G'), C_MAJOR)[group].map(
    (each) => `${noteName(each.chord.root)}${each.chord.suffix} ${each.degree}`,
  )

describe('chordsHolding', () => {
  it('lists the triads that hold a note as root, 3rd or 5th', () => {
    expect(symbols('triads')).toEqual(['G 1', 'E♭ 3', 'C 5', 'Gm 1', 'Em ♭3', 'Cm 5'])
  })

  it('gives the owner’s table for a melody G', () => {
    expect(symbols('major')).toEqual(['E♭Maj7 3', 'A♭Maj7 7', 'FMaj9 9', 'D♭Maj7#11 #11', 'B♭Maj13 13'])
    expect(symbols('minor')).toEqual(['Em7 ♭3', 'Am7 ♭7', 'Fm9 9', 'Dm11 11', 'B♭m13 13'])
    expect(symbols('dominant')).toEqual([
      'E♭7 3',
      'A7 ♭7',
      'F#7♭9 ♭9',
      'F9 9',
      'E7#9 #9',
      'D♭7#11 #11',
      'B7♭13 ♭13',
      'B♭13 13',
    ])
  })

  it('names a root plainly where letters would not (A♭ as the 3rd of E, not F♭)', () => {
    const major = chordsHolding(note('A', -1), C_MAJOR).major
    expect(noteName(major[0]?.chord.root ?? note('C'))).toBe('E')
  })

  it('marks the chords made of the key’s notes', () => {
    const inKey = chordsHolding(note('E'), C_MAJOR).triads.filter((each) => each.inKey)
    expect(inKey.map((each) => noteName(each.chord.root) + each.chord.suffix)).toEqual(['C', 'Em', 'Am'])
  })
})
```

- [ ] **Step 2: Run** — FAIL. **Step 3: Implement** — each group a list of parts (`partsOf` for the table's qualities;
  `Maj13` and `m13` as their parts) with the intervals the note may be over the root; the root `plainRoot(spellBelow(
  melody, interval))`; the chord `buildChord(root, parts)`; `inKey` when every tone's pitch class is in
  `keyPitchClasses(key)`. Triads list major then minor, each as the note's 1, 3, 5. **Step 4: Run** — PASS.
  **Commit:** "List the chords that hold a melody note, the owner's table for every note".

### Task 4: Passing chords, and a row played smoothly

**Files:** `src/shared/lib/music/passing-chords.ts`, `voice-lead.ts`, their tests, `index.ts`.

**Produces:** `PASSING_CATEGORIES`, `PASSING_KINDS` (`secondaryDominant`, `tritoneSub`, `secondaryTwoFive`,
`approachBelow`, `walkUp`, `walkDown`, `doubleApproach`, `diminishedApproach`, `subdominant`, `backdoor`, `plagal`,
`minorPlagal`), `interface PassingChords { kind; category; chords: readonly Chord[] }`,
`passingChords(from: Chord, to: Chord): PassingChords[]`, `chordInKey(chord, key): boolean`;
`voiceLead(chords: readonly Chord[]): Midi[][]` (each chord its bass, then the right hand's keys).

- [ ] **Step 1: Failing tests** — The Ultimate Piano's C → E♭ (roadmap §10.2), spelled by the kernel:

```ts
const C = parseChordSymbol('C')
const E_FLAT = parseChordSymbol('Eb')
const rows = (from: Chord, to: Chord) =>
  passingChords(from, to).map((each) => [each.kind, each.chords.map(chordSymbol).join(' ')])

describe('passingChords', () => {
  it('suggests The Ultimate Piano’s chords from C to E♭', () => {
    expect(rows(C, E_FLAT)).toEqual([
      ['secondaryDominant', 'B♭7'],
      ['tritoneSub', 'E7'],
      ['secondaryTwoFive', 'Fm7 B♭7'],
      ['approachBelow', 'D7'],
      ['walkUp', 'C#7 D7'],
      ['doubleApproach', 'D7 E°7'],
      ['diminishedApproach', 'D°7'],
      ['subdominant', 'A♭'],
      ['backdoor', 'D♭7'],
      ['plagal', 'A♭Maj7'],
      ['minorPlagal', 'A♭m7'],
    ])
  })

  it('leaves out a chord that is the From or the To, and walks down when the target is below', () => {
    const fromG7 = rows(parseChordSymbol('G7'), C).map(([kind]) => kind)
    expect(fromG7).not.toContain('secondaryDominant')
    expect(rows(E_FLAT, C)).toContainEqual(['walkDown', 'D7 D♭7'])
  })

  it('makes a minor target’s ii half-diminished and its IV minor', () => {
    const toAm = rows(C, parseChordSymbol('Am'))
    expect(toAm).toContainEqual(['secondaryTwoFive', 'Bm7♭5 E7'])
    expect(toAm).toContainEqual(['subdominant', 'Dm'])
  })
})

describe('chordInKey', () => {
  it('holds a chord whose every tone is the key’s', () => {
    const key = { tonic: note('C'), minor: false }
    expect(chordInKey(parseChordSymbol('Dm7'), key)).toBe(true)
    expect(chordInKey(parseChordSymbol('B♭7'), key)).toBe(false)
  })
})

describe('voiceLead', () => {
  it('puts each chord over its root and moves the right hand as little as it can', () => {
    const [first, second] = voiceLead([C, parseChordSymbol('G7')])
    expect(first).toEqual([48, 60, 64, 67])
    expect(second).toEqual([55, 59, 62, 65, 67])
  })
})
```

- [ ] **Step 2: Run** — FAIL. **Step 3: Implement** — each kind a rule from To's root (`t`) and To's 3rd (a minor
  target when it is minor): secondary dominant `d7` a 5th above; tritone sub `d7` a minor 2nd above; secondary ii–V
  (`m7`, or `hd` for a minor target, a major 2nd above) then the dominant; approach `d7` a minor 2nd below; walk up
  and down when From's root is two to four semitones below or above (each step's root `plainSpelling`, sharps up and
  flats down); double approach below then `o7` above; diminished `o7` below; subdominant (`maj` or `min`) a 4th
  above; backdoor `d7` a minor 7th above; plagal `maj7` and minor plagal `m7` a 4th above; every root `plainRoot`.
  A row with a chord equal to From or To (same pitch class, same quality), or equal to an earlier row, goes.
  `voiceLead`: the bass the root at C3–B3; the right hand root position first, then each chord's inversions in their
  own octave and an octave down, the one whose middle is nearest the last one's. **Step 4: Run** — PASS.
  **Commit:** "Suggest passing chords between two chords by twelve rules from the target's root, and voice a row of
  chords smoothly".

### Task 5: A note on top, shared

**Files:** move `withNoteOnTop` from `src/widgets/tension-explorer/model/tension-keys.ts` to
`src/features/play-example/model/note-on-top.ts` as `noteOnTop(chord: ShownKeys, pc: PitchClass, mark: KeyMark):
ShownKeys`; its test moves too; `tension-keys.ts` keeps `tensionChord`; the explorer calls
`noteOnTop(chord, tone.pitchClass, { tone: tone.role, label: tone.degree })`.

- [ ] Move the test first (it imports from the feature and fails), move the function, rerun
  `npx vitest run src/features/play-example src/widgets/tension-explorer src/pages/tensions` — PASS. **Commit:** "Put
  a note on top of a chord in one place, for the tensions and Reharmonise".

### Task 6: The Chord finder

**Files:** widget `src/widgets/chord-finder/` (`model/finder-view.ts`: `FinderView { keys: string }`, the keys as
`60-64-67`; `ui/ChordFinder.tsx`), page `src/pages/chord-finder/` (+ test), route `/learn/chord-finder`
(`FINDER_DEFAULTS`, `validateFinderSearch`: whole numbers on the piano, each once, sorted), `learn-screens.ts`,
Learn's Tools group, strings `learn:finder.*`.

**The screen:** the keys pinned; a tap toggles a key (`selected`), a MIDI keyboard's held keys are the chord while
any is held; the name in the chord display (72px) with its quality's name or, without the 5th, "No 5th"; its notes
from the bass up as degree chips; "Also: …" the other names; two notes their interval's name, one note its name,
none "Choose the keys of a chord."; notes no chord names "No chord is named by these notes."; Play (Stop), Clear,
and Open in Chords (a `ButtonLink` to the Chords reference on the named chord's root, parts and inversion).

- [ ] **Failing page test** (`ChordFinderPage.test.tsx`): C E G tapped → "C" named, URL `keys=60-64-67`; C E G A →
  "C6" and "Also: Am7/C"; E G C → "C/E"; two keys → "Major third"; a MIDI keyboard holding D F♯ A → "D" named while
  held (the fake MIDI's `press`); Clear empties; Open in Chords links `/learn/chords?root=C…`; Russian title.
- [ ] Implement, run, **commit:** "Add the Chord finder to Learn's tools: tap or play keys, the app names the chord".

### Task 7: Reharmonise

**Files:** widget `src/widgets/reharmonise/` (`ReharmoniseView { key: KeyParam; note: NoteParam }`,
`ui/ReharmoniseTool.tsx`, `ui/HoldingGroupCard.tsx`), page, route `/learn/reharmonise` (defaults C major, E;
`note` spelled in the key by `spellInKey`), Tools row, strings `learn:reharmonise.*`.

**The screen:** Key and Note pop-ups (the 24 keys from the circle, grouped major and minor; the twelve notes spelled
in the key); a tap or a MIDI key sets the note; four cards (Triads, Major 7ths, Minor 7ths, Dominant 7ths), each
chord a `ChordButton` (its symbol over "as 3" and, when in the key, "· in the key"); a tap plays the chord with the
note on top and shows both.

- [ ] **Failing page test:** default E in C lists "C" in Triads with "as 3 · in the key"; choosing G gives the owner's
  dominant row's first chord `E♭7`; tapping `FMaj9` plays F A C E G on top; URL keeps `key` and `note`; Russian.
- [ ] Implement, run, **commit:** "Add Reharmonise to Learn's tools: the chords that hold a melody note, in the key or
  not, each played under it".

### Task 8: Passing chords

**Files:** widget `src/widgets/passing-chords/` (`PassingView { key; from: string; to: string }`,
`ui/PassingChordsTool.tsx`, `ui/SuggestionCard.tsx`), page, route `/learn/passing-chords` (defaults C major, `C`,
`F`; the typed symbols kept as typed), Tools row, strings `learn:passing.*`.

**The screen:** From and To fields (an unread symbol: "This chord can't be read." under it, `aria-invalid`), the Key
pop-up; suggestions by category, each a card: its name, its chords From → … → To as buttons that play and show,
"In the key" or "Chromatic", its reason, and Play (the row voice-led, Stop while it plays).

- [ ] **Failing page test:** from C to E♭ lists "Secondary dominant" with B♭7, "Chromatic" on it, its reason naming
  B♭7 and E♭; Play plays four chords; typing `Qx` in To says it can't be read and lists nothing; URL keeps the typed
  symbols; Russian.
- [ ] Implement, run the whole gate and the build, **commit:** "Add Passing chords to Learn's tools: chords between
  two chords by category, in the key or chromatic, each row played smoothly".

### Task 9: Record the tools

- [ ] ADR 0019 ("Learn's tools work out what the learner gives them"); glossary rows **Tool**, **Chord finder**,
  **Reharmonise**, **Passing chord**; DESIGN.md (the Tools group; the finder's display; a suggestion card); CODE_STYLE
  §8 (roots spelled by letters then `plainRoot`; `nameChords` over the builder); CLAUDE.md; PRODUCT.md. Commit.
