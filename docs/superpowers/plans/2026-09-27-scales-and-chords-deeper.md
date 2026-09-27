# Scales and chords, deeper: implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sub-project 4 of the roadmap: the church modes and major blues, Start on with two fingerings, the scale's run
as sheet music, the scale's chords stacked to 13ths in inversions, Walk the chords (in place and in the Player), the
key's common progressions in the Player, and a Keys reference with the circle of fifths.

**Architecture:** The music kernel grows the kinds, fingerings, stacked chords, borrowed chords and the circle as pure
functions; the schedule writes a run in ticks; the kit gains a chord button and a lazily loaded score view. The Scales
widget splits into a Scale view and a Chords view; a new Keys widget and page; the Player page slice serves a piece or
a walk through one layout and a composed Setup sheet.

**Tech Stack:** React 19, Vite, strict TypeScript 6, TanStack Router, zustand, VexFlow 5, Vitest 4 + Testing Library,
Tailwind v4, i18next.

**Spec:** `docs/superpowers/specs/2026-09-27-scales-and-chords-deeper-design.md` (read it first; this plan argues from
it).

## Global Constraints

- FSD, lint-enforced: `app → pages → widgets → features → entities → shared`; another slice only through its
  `index.ts`; `shared/lib/music`, `notation`, `arrangement` import no package, and `music` imports only itself.
- Strict TS: no `any`, `import type` for types, `noUncheckedIndexedAccess`; no casts but a brand's constructor.
- Tests colocated, `globals: false` (import `describe/it/expect/vi` from `vitest`); a screen's test runs the app
  through `renderApp`.
- Prettier on touched files only (`npx prettier --write <files>`); never `npm run format`.
- Every UI string in `en` and `ru` (`src/shared/i18n/locales/{en,ru}/<namespace>.ts`, Russian typed against English).
- Semantic Tailwind utilities only; runtime values in `style`; one honey (primary) action per screen; 44px targets.
- Spelling by letter steps (CODE_STYLE §8); time in ticks, seconds only in `schedule` and the audio adapter.
- URL: each validator writes every param, an invalid optional one as `undefined`; defaults leave the URL; a control's
  change replaces the history entry.
- Commit each task on `main` (the owner's rule), message ending with
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Verify before claiming a task done: its tests, then `npm run typecheck && npm run lint`; the last task runs the
  whole suite and `npm run build`.

## Review Focus

- **A URL naming a kind without chords in Chords view or the walk** (`/learn/scales?kind=blues&show=chords&chords=6`,
  `/play/walk?kind=pent`): the reference falls back to Scale view with 3-note chords; the walk is not found. Pinned in
  Task 9's search test and Task 12's route test.
- **Changing the chord size past the inversion it had** (7ths in 3rd inversion → triads): the inversion clamps to the
  last one the size has, never a thrown RangeError from `placeScaleChords`. Pinned in Task 9.
- **A kept `fingering` param that the new kind or start no longer allows** (`fingering=scale` on the blues from its
  3rd): the validator drops it, the run is fingered from the thumb. Pinned in Task 8.
- **The walk route shadowing a piece** (`/play/walk` beside `/play/$pieceId`): no piece may take the id `walk`.
  Pinned in Task 10's catalog test.
- **A key param spelled another way** (`/learn/keys?key=D%23m`, `key=Bb`, `key=H`): read as the circle spells it
  (E♭ minor, B♭ major) or the default C. Pinned in Task 14.

---

### Task 1: Intervals labelled by one rule

**Files:**
- Modify: `src/shared/lib/music/interval.ts`
- Test: `src/shared/lib/music/interval.test.ts`

**Interfaces:**
- Produces: `degreeLabel(steps: number, semitones: number): string`, `labelled(steps, semitones): LabelledInterval`,
  `INTERVALS.m2`, `INTERVALS.A2` (all in `interval.ts`, used inside the kernel only).

- [ ] **Step 1: Write the failing test** — append to `interval.test.ts` (and import `degreeLabel, INTERVALS`):

```ts
describe('degreeLabel', () => {
  it.each([
    [0, 0, '1'],
    [1, 1, '♭2'],
    [1, 3, '#2'],
    [2, 3, '♭3'],
    [2, 4, '3'],
    [3, 6, '#4'],
    [4, 6, '♭5'],
    [6, 9, '𝄫7'],
    [1, 13, '♭9'],
    [8, 14, '9'],
    [3, 16, '♭11'],
    [10, 18, '#11'],
    [5, 20, '♭13'],
    [12, 21, '13'],
  ])('writes %i letter steps and %i semitones as %s', (steps, semitones, label) => {
    expect(degreeLabel(steps, semitones)).toBe(label)
  })

  it('refuses a letter three semitones off its interval', () => {
    expect(() => degreeLabel(2, 7)).toThrow(RangeError)
  })

  it('labels the named intervals by the same rule', () => {
    expect(INTERVALS.m2.degree).toBe('♭2')
    expect(INTERVALS.A2.degree).toBe('#2')
    expect(INTERVALS.d7.degree).toBe('𝄫7')
    expect(INTERVALS.A11.degree).toBe('#11')
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run src/shared/lib/music/interval.test.ts`
Expected: FAIL (`degreeLabel` is not exported).

- [ ] **Step 3: Implement** — in `interval.ts` replace the `above` helper and the `INTERVALS` table with:

```ts
/** The semitones of the major or perfect interval over each letter distance: a 2nd 2, a 4th 5, a 7th 11. */
const PLAIN_SEMITONES = [0, 2, 4, 5, 7, 9, 11]
const DEGREE_SIGNS = new Map([
  [-2, '𝄫'],
  [-1, '♭'],
  [0, ''],
  [1, '#'],
  [2, '𝄪'],
])

/**
 * How an interval above a root is written as a degree: its number from the letter steps, past the
 * octave from 12 semitones on (a 9th, an 11th), and its sign from how far it lies from the major or
 * perfect interval of that number: `♭3`, `#11`, `𝄫7`.
 */
export function degreeLabel(steps: number, semitones: number): string {
  const compound = semitones >= 12
  const plain = (PLAIN_SEMITONES[steps % 7] ?? 0) + (compound ? 12 : 0)
  const sign = DEGREE_SIGNS.get(semitones - plain)
  if (sign === undefined) throw new RangeError(`${semitones} semitones is no ${steps}-step degree`)
  return `${sign}${(steps % 7) + 1 + (compound ? 7 : 0)}`
}

/** An interval of `steps` letters and `semitones`, labelled as its degree. */
export const labelled = (steps: number, semitones: number): LabelledInterval => ({
  steps,
  semitones,
  degree: degreeLabel(steps, semitones),
})

/**
 * The intervals chords and scales are built from, named as musicians abbreviate them: r root,
 * M major, m minor, P perfect, d diminished, A augmented.
 */
export const INTERVALS = {
  r: labelled(0, 0),
  m2: labelled(1, 1),
  M2: labelled(1, 2),
  A2: labelled(1, 3),
  m3: labelled(2, 3),
  M3: labelled(2, 4),
  P4: labelled(3, 5),
  A4: labelled(3, 6),
  d5: labelled(4, 6),
  P5: labelled(4, 7),
  A5: labelled(4, 8),
  m6: labelled(5, 8),
  M6: labelled(5, 9),
  d7: labelled(6, 9),
  m7: labelled(6, 10),
  M7: labelled(6, 11),
  m9: labelled(1, 13),
  M9: labelled(1, 14),
  A9: labelled(1, 15),
  P11: labelled(3, 17),
  A11: labelled(3, 18),
  m13: labelled(5, 20),
  M13: labelled(5, 21),
} as const satisfies Record<string, LabelledInterval>
```

- [ ] **Step 4: Run the kernel's tests**

Run: `npx vitest run src/shared/lib/music`
Expected: PASS (every chord's and scale's labels unchanged).

- [ ] **Step 5: Commit**

```bash
npx prettier --write src/shared/lib/music/interval.ts src/shared/lib/music/interval.test.ts
git add src/shared/lib/music/interval.ts src/shared/lib/music/interval.test.ts
git commit -m "Label every interval as its degree by one rule, and add the minor and augmented 2nd

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Thirteen scale kinds in three families

**Files:**
- Modify: `src/shared/lib/music/scale.ts` (rewrite), `src/shared/lib/music/key.ts` (drop `spellInKey`),
  `src/shared/lib/music/index.ts`, `src/shared/lib/music/fingering.ts` (its table map becomes partial)
- Modify: `src/shared/i18n/locales/{en,ru}/music.ts`, `src/shared/i18n/locales/{en,ru}/learn.ts`
- Modify: `src/entities/path/content/path.ts`
- Modify: `src/widgets/scale-explorer/ui/ScaleExplorer.tsx` (the Scale pop-up grouped),
  `src/widgets/scale-explorer/ui/ScaleFacts.tsx` (Relative or Mode of)
- Test: `src/shared/lib/music/scale.test.ts`, `src/shared/lib/music/key.test.ts`, `src/app/routes/search.test.ts`,
  `src/pages/scales/ui/ScalesPage.test.tsx`

**Interfaces:**
- Produces (from `@/shared/lib/music`): `SCALE_KINDS` (13, in family order), `SCALE_FAMILIES`
  (`'keys' | 'modes' | 'blues'`), `scaleFamily(kind)`, `scaleKindsIn(family)`, `isMinorScale`, `scaleIntervals`,
  `scaleHasChords`, `spellScale`, `relatedScale(root, kind): RelatedScale | null` with
  `RelatedScale = { root: SpelledNote; kind: ScaleKind; degree: number; relation: 'relative' | 'parent' }`,
  `scaleKey(root, kind): Key`, `scaleRootSpelling(pc, kind)`, `scaleGaps`, `spellInKey(pc, key)` (moved here),
  `modesOfKey(key): { root: SpelledNote; kind: ScaleKind }[]`.
- Removes: `relativeScale` (use `relatedScale`).

- [ ] **Step 1: Write the failing tests** — in `scale.test.ts`, replace the `relativeScale`, `scaleRootSpelling`
  (its "knows which kinds are minor" case) and `scaleHasChords` blocks, and add the rest:

```ts
describe('the kinds', () => {
  it('are thirteen, in three families', () => {
    expect(SCALE_FAMILIES.map((family) => scaleKindsIn(family))).toEqual([
      ['major', 'natural', 'harmonic', 'melodic'],
      ['dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian'],
      ['pent', 'mpent', 'majorBlues', 'blues'],
    ])
    expect(SCALE_KINDS).toHaveLength(13)
  })

  it('knows which kinds are minor: a minor 3rd above the root', () => {
    expect(SCALE_KINDS.filter(isMinorScale)).toEqual([
      'natural',
      'harmonic',
      'melodic',
      'dorian',
      'phrygian',
      'locrian',
      'mpent',
      'blues',
    ])
  })
})

describe('the modes', () => {
  it.each([
    ['dorian', note('D'), 'D E F G A B C'],
    ['phrygian', note('E'), 'E F G A B C D'],
    ['lydian', note('F'), 'F G A B C D E'],
    ['mixolydian', note('G'), 'G A B C D E F'],
    ['locrian', note('B'), 'B C D E F G A'],
  ] as const)('spell %s on %j with C major’s notes', (kind, root, expected) => {
    expect(names(root, kind).join(' ')).toBe(expected)
  })

  it('label Phrygian’s 2nd and Locrian’s 5th flat', () => {
    expect(spellScale(note('E'), 'phrygian').map((tone) => tone.degree).join(' ')).toBe(
      '1 ♭2 ♭3 4 5 ♭6 ♭7',
    )
    expect(spellScale(note('B'), 'locrian')[4]?.degree).toBe('♭5')
  })

  it('share their parent major’s notes on every root', () => {
    for (const kind of scaleKindsIn('modes')) {
      for (let pc = 0; pc < 12; pc++) {
        const root = scaleRootSpelling(pitchClass(pc), kind)
        const parent = relatedScale(root, kind)
        if (!parent) throw new Error(kind)
        expect(parent.relation).toBe('parent')
        expect(new Set(names(root, kind))).toEqual(new Set(names(parent.root, 'major')))
      }
    }
  })
})

describe('the major blues', () => {
  it.each([
    [note('C'), 'C D E♭ E G A', '♭3'],
    [note('G'), 'G A B♭ B D E', '♭3'],
    [note('E'), 'E F# G G# B C#', '♭3'],
    [note('D', -1), 'D♭ E♭ E F A♭ B♭', '#2'],
  ])('spells %j with its blue note', (root, expected, blueDegree) => {
    expect(names(root, 'majorBlues').join(' ')).toBe(expected)
    expect(spellScale(root, 'majorBlues')[2]?.degree).toBe(blueDegree)
  })

  it('is the relative of the minor blues', () => {
    expect(relatedScale(note('C'), 'majorBlues')).toMatchObject({ root: note('A'), kind: 'blues' })
    expect(relatedScale(note('A'), 'blues')).toMatchObject({ root: note('C'), kind: 'majorBlues' })
  })
})

describe('relatedScale', () => {
  it('pairs a major scale with the natural minor on its 6th', () => {
    expect(relatedScale(note('E', -1), 'major')).toEqual({
      root: note('C'),
      kind: 'natural',
      degree: 5,
      relation: 'relative',
    })
  })

  it('gives the minors their relative major on the 3rd', () => {
    expect(relatedScale(note('A'), 'natural')).toMatchObject({ root: note('C'), kind: 'major' })
    expect(relatedScale(note('G', 1), 'harmonic')).toMatchObject({ root: note('B'), kind: 'major' })
  })

  it('pairs the pentatonics', () => {
    expect(relatedScale(note('C'), 'pent')).toMatchObject({ root: note('A'), kind: 'mpent' })
    expect(relatedScale(note('A'), 'mpent')).toMatchObject({ root: note('C'), kind: 'pent' })
  })

  it('names a mode’s parent major', () => {
    expect(relatedScale(note('D'), 'dorian')).toEqual({
      root: note('C'),
      kind: 'major',
      degree: 6,
      relation: 'parent',
    })
  })
})

describe('scaleKey', () => {
  it('writes a major or minor kind in its own key, a mode in its parent’s', () => {
    expect(scaleKey(note('E', -1), 'harmonic')).toEqual({ tonic: note('E', -1), minor: true })
    expect(scaleKey(note('C'), 'majorBlues')).toEqual({ tonic: note('C'), minor: false })
    expect(scaleKey(note('D'), 'dorian')).toEqual({ tonic: note('C'), minor: false })
  })
})

describe('scaleRootSpelling', () => {
  it('spells every major and minor kind’s root as before: minor kinds leaning sharp', () => {
    expect(scaleRootSpelling(pitchClass(1), 'major')).toEqual(note('D', -1))
    expect(scaleRootSpelling(pitchClass(1), 'natural')).toEqual(note('C', 1))
    for (const kind of ['major', 'natural', 'harmonic', 'melodic', 'pent', 'mpent', 'blues'] as const) {
      for (let pc = 0; pc < 12; pc++) {
        expect(scaleRootSpelling(pitchClass(pc), kind)).toEqual(
          rootSpelling(pitchClass(pc), isMinorScale(kind)),
        )
      }
    }
  })

  it('spells a mode’s root so its signature has the fewest sharps or flats', () => {
    expect(noteName(scaleRootSpelling(pitchClass(3), 'phrygian'))).toBe('D#')
    expect(noteName(scaleRootSpelling(pitchClass(6), 'lydian'))).toBe('G♭')
    expect(noteName(scaleRootSpelling(pitchClass(10), 'locrian'))).toBe('A#')
    expect(noteName(scaleRootSpelling(pitchClass(1), 'dorian'))).toBe('C#')
  })
})

describe('scaleHasChords', () => {
  it('is true for the seven-note scales', () => {
    expect(SCALE_KINDS.filter(scaleHasChords)).toEqual([
      'major',
      'natural',
      'harmonic',
      'melodic',
      'dorian',
      'phrygian',
      'lydian',
      'mixolydian',
      'locrian',
    ])
  })
})

describe('modesOfKey', () => {
  it('names the scales that share a major key’s notes, the key’s own left out', () => {
    expect(
      modesOfKey({ tonic: note('E', -1), minor: false }).map(
        ({ root, kind }) => `${noteName(root)} ${kind}`,
      ),
    ).toEqual(['F dorian', 'G phrygian', 'A♭ lydian', 'B♭ mixolydian', 'C natural', 'D locrian'])
  })

  it('takes a minor key’s from its relative major, the relative major included', () => {
    expect(
      modesOfKey({ tonic: note('A'), minor: true }).map(({ root, kind }) => `${noteName(root)} ${kind}`),
    ).toEqual(['C major', 'D dorian', 'E phrygian', 'F lydian', 'G mixolydian', 'B locrian'])
  })
})
```

  Update the file's imports to `rootSpelling` from `./note`, and from `./scale`: `SCALE_FAMILIES, SCALE_KINDS,
  isMinorScale, modesOfKey, relatedScale, scaleGaps, scaleHasChords, scaleIntervals, scaleKey, scaleKindsIn,
  scaleRootSpelling, spellInKey, spellScale, type ScaleKind`. Move the `spellInKey` describe block from `key.test.ts`
  into `scale.test.ts` unchanged, and drop `spellInKey` from `key.test.ts`'s imports. The existing "leans sharp for
  minor kinds, blues included" case stays.

  In `src/app/routes/search.test.ts`, the stale-URL case `'/learn/scales?kind=dorian&tempo=10&chords=5&step=chords:tri'`
  becomes `'/learn/scales?kind=ionian&tempo=10&chords=9&step=chords:tri'` (Dorian is a kind now).

  In `src/pages/scales/ui/ScalesPage.test.tsx` add:

```ts
  it('says a mode is a mode of its parent major, and links to it', async () => {
    await renderApp('/learn/scales?root=D&kind=dorian')
    expect(await screen.findByRole('heading', { level: 2, name: 'D Dorian' })).toBeInTheDocument()
    expect(screen.getByText('Mode of')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'C major' })).toBeInTheDocument()
  })

  it('groups the scales in the Scale pop-up', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/scales')
    await user.click(await screen.findByRole('combobox', { name: 'Scale' }))
    expect(await screen.findByText('Modes')).toBeInTheDocument()
    await user.click(screen.getByRole('option', { name: 'Major blues' }))
    expect(router.state.location.search).toMatchObject({ kind: 'majorBlues' })
  })
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/shared/lib/music/scale.test.ts`
Expected: FAIL (`SCALE_FAMILIES`, `relatedScale`, `scaleKey`, `modesOfKey` missing).

- [ ] **Step 3: Implement the kernel** — `scale.ts` in full:

```ts
import { INTERVALS, type IntervalName, type Interval } from './interval'
import { keyPrefersSharps, keySignature, type Key } from './key'
import { pitchClassOf, plainSpelling, rootSpelling, type SpelledNote } from './note'
import type { PitchClass } from './pitch'
import { toneAbove, type Tone } from './tone'

/** Major and minor; the church modes; pentatonic and blues: the Scale pop-up's groups. */
export const SCALE_FAMILIES = ['keys', 'modes', 'blues'] as const
export type ScaleFamily = (typeof SCALE_FAMILIES)[number]

export const SCALE_KINDS = [
  'major',
  'natural',
  'harmonic',
  'melodic',
  'dorian',
  'phrygian',
  'lydian',
  'mixolydian',
  'locrian',
  'pent',
  'mpent',
  'majorBlues',
  'blues',
] as const
export type ScaleKind = (typeof SCALE_KINDS)[number]

/** A blue note: of its two spellings, the one with fewer accidentals, the first on a tie. */
interface BlueNote {
  readonly blue: readonly [IntervalName, IntervalName]
}
type ScaleInterval = IntervalName | BlueNote

/** A scale that shares its notes with another: which kind, where its tonic sits in this one, and how. */
export interface Related {
  readonly kind: ScaleKind
  /** Index into this scale's notes. */
  readonly degree: number
  readonly relation: 'relative' | 'parent'
}

interface ScaleEntry {
  readonly family: ScaleFamily
  readonly intervals: readonly ScaleInterval[]
  /** A minor 3rd above the root. */
  readonly minor: boolean
  readonly related: Related
}

const relative = (kind: ScaleKind, degree: number): Related => ({
  kind,
  degree,
  relation: 'relative',
})
/** A mode's parent major scale, its tonic on this degree of the mode. */
const parent = (degree: number): Related => ({ kind: 'major', degree, relation: 'parent' })

const SCALES: Readonly<Record<ScaleKind, ScaleEntry>> = {
  major: {
    family: 'keys',
    intervals: ['r', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'],
    minor: false,
    related: relative('natural', 5),
  },
  natural: {
    family: 'keys',
    intervals: ['r', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'],
    minor: true,
    related: relative('major', 2),
  },
  harmonic: {
    family: 'keys',
    intervals: ['r', 'M2', 'm3', 'P4', 'P5', 'm6', 'M7'],
    minor: true,
    related: relative('major', 2),
  },
  melodic: {
    family: 'keys',
    intervals: ['r', 'M2', 'm3', 'P4', 'P5', 'M6', 'M7'],
    minor: true,
    related: relative('major', 2),
  },
  dorian: {
    family: 'modes',
    intervals: ['r', 'M2', 'm3', 'P4', 'P5', 'M6', 'm7'],
    minor: true,
    related: parent(6),
  },
  phrygian: {
    family: 'modes',
    intervals: ['r', 'm2', 'm3', 'P4', 'P5', 'm6', 'm7'],
    minor: true,
    related: parent(5),
  },
  lydian: {
    family: 'modes',
    intervals: ['r', 'M2', 'M3', 'A4', 'P5', 'M6', 'M7'],
    minor: false,
    related: parent(4),
  },
  mixolydian: {
    family: 'modes',
    intervals: ['r', 'M2', 'M3', 'P4', 'P5', 'M6', 'm7'],
    minor: false,
    related: parent(3),
  },
  locrian: {
    family: 'modes',
    intervals: ['r', 'm2', 'm3', 'P4', 'd5', 'm6', 'm7'],
    minor: true,
    related: parent(1),
  },
  pent: {
    family: 'blues',
    intervals: ['r', 'M2', 'M3', 'P5', 'M6'],
    minor: false,
    related: relative('mpent', 4),
  },
  mpent: {
    family: 'blues',
    intervals: ['r', 'm3', 'P4', 'P5', 'm7'],
    minor: true,
    related: relative('pent', 1),
  },
  majorBlues: {
    family: 'blues',
    intervals: ['r', 'M2', { blue: ['m3', 'A2'] }, 'M3', 'P5', 'M6'],
    minor: false,
    related: relative('blues', 5),
  },
  blues: {
    family: 'blues',
    intervals: ['r', 'm3', 'P4', { blue: ['d5', 'A4'] }, 'P5', 'm7'],
    minor: true,
    related: relative('majorBlues', 1),
  },
}

export const scaleFamily = (kind: ScaleKind): ScaleFamily => SCALES[kind].family

/** A family's kinds, in table order. */
export const scaleKindsIn = (family: ScaleFamily): readonly ScaleKind[] =>
  SCALE_KINDS.filter((kind) => scaleFamily(kind) === family)

/** A minor 3rd above the root: the three minors, Dorian, Phrygian, Locrian, the minor pentatonic and blues. */
export const isMinorScale = (kind: ScaleKind): boolean => SCALES[kind].minor

const plainInterval = (interval: ScaleInterval): IntervalName =>
  typeof interval === 'string' ? interval : interval.blue[0]

/** The scale's intervals above its root, a blue note as its first spelling (♭5, ♭3). */
export const scaleIntervals = (kind: ScaleKind): readonly Interval[] =>
  SCALES[kind].intervals.map((interval) => INTERVALS[plainInterval(interval)])

/** Whether a chord stands on each degree: a scale of seven notes (its numerals run I to VII). */
export const scaleHasChords = (kind: ScaleKind): boolean => scaleIntervals(kind).length === 7

function blueNote(root: SpelledNote, [first, second]: BlueNote['blue']): Tone {
  const a = toneAbove(root, INTERVALS[first])
  const b = toneAbove(root, INTERVALS[second])
  return Math.abs(b.note.accidental) < Math.abs(a.note.accidental) ? b : a
}

/** The scale's notes from the root up, each spelled by letter steps from the root. */
export function spellScale(root: SpelledNote, kind: ScaleKind): Tone[] {
  return SCALES[kind].intervals.map((interval) =>
    typeof interval === 'string'
      ? toneAbove(root, INTERVALS[interval])
      : blueNote(root, interval.blue),
  )
}

/** A scale that shares this one's notes, on its root. */
export interface RelatedScale extends Related {
  readonly root: SpelledNote
}

/**
 * The scale this one shares its notes with, spelled from this one's notes: its relative major or
 * minor (the pentatonics, the blues too), or a mode's parent major.
 */
export function relatedScale(root: SpelledNote, kind: ScaleKind): RelatedScale | null {
  const { related } = SCALES[kind]
  const tone = spellScale(root, kind)[related.degree]
  return tone ? { ...related, root: tone.note } : null
}

/**
 * The key a scale is written in: a major kind's major key, a minor kind's minor key, and a mode its
 * parent major's (D Dorian in C major's signature).
 */
export function scaleKey(root: SpelledNote, kind: ScaleKind): Key {
  const related = relatedScale(root, kind)
  if (related?.relation === 'parent') return { tonic: related.root, minor: false }
  return { tonic: root, minor: isMinorScale(kind) }
}

/**
 * The root a scale on this pitch class is named from: the spelling whose key has fewer sharps or
 * flats (D♯ Phrygian in B major's signature, not E♭ Phrygian in C♭'s), and on a tie the one the
 * major and minor keys already use (minor kinds leaning sharp).
 */
export function scaleRootSpelling(pc: PitchClass, kind: ScaleKind): SpelledNote {
  const accidentals = (root: SpelledNote) => Math.abs(keySignature(scaleKey(root, kind)))
  const sharp = plainSpelling(pc, true)
  const flat = plainSpelling(pc, false)
  const difference = accidentals(sharp) - accidentals(flat)
  if (difference === 0) return rootSpelling(pc, isMinorScale(kind))
  return difference < 0 ? sharp : flat
}

/** The gap between neighbouring notes of a scale: a half step, a whole step, or both (three semitones). */
export type ScaleGap = 'H' | 'W' | 'W+H'
const GAP_BY_SEMITONES: Readonly<Record<number, ScaleGap>> = { 1: 'H', 2: 'W', 3: 'W+H' }

/** The gaps between neighbouring notes up to the octave: W, H, or W+H. */
export function scaleGaps(kind: ScaleKind): ScaleGap[] {
  const semitones = [...scaleIntervals(kind).map((interval) => interval.semitones), 12]
  return semitones.slice(1).map((above, i) => {
    const size = above - (semitones[i] ?? 0)
    const gap = GAP_BY_SEMITONES[size]
    if (!gap) throw new RangeError(`${kind} has a gap of ${size} semitones`)
    return gap
  })
}

/**
 * A pitch class as a key spells it: the note of its scale (a minor key's raised 6th and 7th too),
 * else plainly, sharp in a sharp key and flat otherwise.
 */
export function spellInKey(pc: PitchClass, key: Key): SpelledNote {
  const tones = key.minor
    ? [...spellScale(key.tonic, 'natural'), ...spellScale(key.tonic, 'melodic')]
    : spellScale(key.tonic, 'major')
  return (
    tones.find((tone) => tone.pitchClass === pc)?.note ?? plainSpelling(pc, keyPrefersSharps(key))
  )
}

/** The church modes on the major scale's degrees, in order: Ionian is major, Aeolian natural minor. */
const MODES_OF_MAJOR: readonly ScaleKind[] = [
  'major',
  'dorian',
  'phrygian',
  'lydian',
  'mixolydian',
  'natural',
  'locrian',
]

/** The scales that share a key's notes: its (relative) major's modes, each on its own root, the key's own left out. */
export function modesOfKey(key: Key): { readonly root: SpelledNote; readonly kind: ScaleKind }[] {
  const own: ScaleKind = key.minor ? 'natural' : 'major'
  const major = key.minor ? relatedScale(key.tonic, 'natural')?.root : key.tonic
  if (!major) return []
  const notes = spellScale(major, 'major')
  return MODES_OF_MAJOR.flatMap((kind, degree) => {
    const root = notes[degree]?.note
    return root && kind !== own ? [{ root, kind }] : []
  })
}
```

  `key.ts`: delete `spellInKey` and the `import { spellScale } from './scale'` line (the key module no longer depends
  on scales, so `scale.ts` can read a key's signature without a cycle).

  `index.ts`: from `./key` drop `spellInKey`; the `./scale` export becomes:

```ts
export {
  SCALE_FAMILIES,
  SCALE_KINDS,
  isMinorScale,
  modesOfKey,
  relatedScale,
  scaleFamily,
  scaleGaps,
  scaleHasChords,
  scaleIntervals,
  scaleKey,
  scaleKindsIn,
  scaleRootSpelling,
  spellInKey,
  spellScale,
  type RelatedScale,
  type ScaleFamily,
  type ScaleGap,
  type ScaleKind,
} from './scale'
```

  `fingering.ts`: `TABLE_OF` becomes `Readonly<Partial<Record<ScaleKind, FingeringTable>>>` without the
  `mpent: null` entry, and `scaleFingering` reads `const table = TABLE_OF[kind]` as before (Task 3 replaces this
  module; this keeps it compiling for the new kinds, which have no table yet). Its "has no fingering for the minor
  pentatonic" test stays true.

- [ ] **Step 4: The words** — `en/music.ts`: `scaleKind` and `scaleName` gain the kinds, the blues is named as minor,
  and the families get names:

```ts
  scaleFamily: { keys: 'Major and minor', modes: 'Modes', blues: 'Pentatonic and blues' },
  scaleKind: {
    major: 'Major',
    natural: 'Natural minor',
    harmonic: 'Harmonic minor',
    melodic: 'Melodic minor',
    dorian: 'Dorian',
    phrygian: 'Phrygian',
    lydian: 'Lydian',
    mixolydian: 'Mixolydian',
    locrian: 'Locrian',
    pent: 'Major pentatonic',
    mpent: 'Minor pentatonic',
    majorBlues: 'Major blues',
    blues: 'Minor blues',
  },
  scaleName: {
    major: 'major',
    natural: 'natural minor',
    harmonic: 'harmonic minor',
    melodic: 'melodic minor',
    dorian: 'Dorian',
    phrygian: 'Phrygian',
    lydian: 'Lydian',
    mixolydian: 'Mixolydian',
    locrian: 'Locrian',
    pent: 'major pentatonic',
    mpent: 'minor pentatonic',
    majorBlues: 'major blues',
    blues: 'minor blues',
  },
```

  `ru/music.ts`:

```ts
  scaleFamily: { keys: 'Мажор и минор', modes: 'Лады', blues: 'Пентатоника и блюз' },
  scaleKind: {
    major: 'Мажор',
    natural: 'Натуральный минор',
    harmonic: 'Гармонический минор',
    melodic: 'Мелодический минор',
    dorian: 'Дорийский',
    phrygian: 'Фригийский',
    lydian: 'Лидийский',
    mixolydian: 'Миксолидийский',
    locrian: 'Локрийский',
    pent: 'Мажорная пентатоника',
    mpent: 'Минорная пентатоника',
    majorBlues: 'Мажорный блюз',
    blues: 'Минорный блюз',
  },
  scaleName: {
    major: 'мажор',
    natural: 'натуральный минор',
    harmonic: 'гармонический минор',
    melodic: 'мелодический минор',
    dorian: 'дорийский',
    phrygian: 'фригийский',
    lydian: 'лидийский',
    mixolydian: 'миксолидийский',
    locrian: 'локрийский',
    pent: 'мажорная пентатоника',
    mpent: 'минорная пентатоника',
    majorBlues: 'мажорный блюз',
    blues: 'минорный блюз',
  },
```

  `learn.ts` `about` gains `modeOf`: en `about: { formula: 'Formula', gaps: 'Structure', relative: 'Relative', modeOf:
  'Mode of' }`, ru `about: { formula: 'Формула', gaps: 'Строение', relative: 'Параллельная', modeOf: 'Лад от' }`.

- [ ] **Step 5: The Path** — in `path.ts`, the scale steps follow `SCALE_KINDS`:

```ts
    scale('major'),
    scale('natural'),
    scale('harmonic'),
    scale('melodic'),
    scale('dorian'),
    scale('phrygian'),
    scale('lydian'),
    scale('mixolydian'),
    scale('locrian'),
    scale('pent'),
    scale('mpent'),
    scale('majorBlues'),
    scale('blues'),
```

- [ ] **Step 6: The Scales reference** — `ScaleExplorer.tsx`'s Scale pop-up takes groups (import `SCALE_FAMILIES` and
  `scaleKindsIn` in place of `SCALE_KINDS`):

```tsx
          <Dropdown
            label={t('learn:scaleLabel')}
            value={scale.kind}
            groups={SCALE_FAMILIES.map((family) => ({
              label: t(`music:scaleFamily.${family}`),
              options: scaleKindsIn(family).map((kind) => ({
                value: kind,
                label: t(`music:scaleKind.${kind}`),
              })),
            }))}
            onChange={(kind) => onChange({ kind })}
          />
```

  `ScaleFacts.tsx`: `relativeScale` → `relatedScale`; the fact's term follows the relation:

```tsx
      {related ? (
        <Fact term={t(related.relation === 'parent' ? 'learn:about.modeOf' : 'learn:about.relative')}>
          <ButtonLink
            variant="link"
            className="px-0"
            render={
              <Link
                from="/learn/scales"
                to="/learn/scales"
                search={(prev) => ({ ...prev, root: noteParam(related.root), kind: related.kind })}
                replace
              />
            }
          >
            {scaleName(related.root, related.kind)}
          </ButtonLink>
        </Fact>
      ) : null}
```

  with `const related = relatedScale(root, kind)`.

- [ ] **Step 7: Run the affected tests**

Run: `npx vitest run src/shared/lib/music src/entities/path src/app/routes src/pages/scales src/features/quiz src/entities/settings`
Expected: PASS. Then `npm run typecheck && npm run lint` — PASS.

- [ ] **Step 8: Commit**

```bash
npx prettier --write src/shared/lib/music/scale.ts src/shared/lib/music/scale.test.ts src/shared/lib/music/key.ts src/shared/lib/music/key.test.ts src/shared/lib/music/index.ts src/shared/lib/music/fingering.ts src/shared/i18n/locales/en/music.ts src/shared/i18n/locales/ru/music.ts src/shared/i18n/locales/en/learn.ts src/shared/i18n/locales/ru/learn.ts src/entities/path/content/path.ts src/widgets/scale-explorer/ui/ScaleExplorer.tsx src/widgets/scale-explorer/ui/ScaleFacts.tsx src/app/routes/search.test.ts src/pages/scales/ui/ScalesPage.test.tsx
git add -A src/shared/lib/music src/shared/i18n src/entities/path src/widgets/scale-explorer src/app/routes src/pages/scales
git commit -m "Add the church modes and the major blues as scale kinds, in three families, each spelled in its fewest-accidental key

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Fingering from any note: as the scale, or from the thumb

**Files:**
- Modify: `src/shared/lib/music/fingering.ts` (rewrite), `src/shared/lib/music/place.ts` (`placeScale` from a
  start), `src/shared/lib/music/index.ts`
- Modify: `src/widgets/scale-explorer/ui/ScaleExplorer.tsx`, `src/widgets/scale-explorer/ui/FingeringTable.tsx`,
  `src/shared/i18n/locales/{en,ru}/learn.ts` (drop `fingering.none`)
- Test: `src/shared/lib/music/fingering.test.ts` (rewrite), `src/shared/lib/music/place.test.ts`

**Interfaces:**
- Consumes: `relatedScale`, `scaleHasChords` (Task 2).
- Produces: `FINGERINGS = ['thumb', 'scale']`, `type Fingering`, `scaleFingering(root: SpelledNote, kind, hand,
  start: number): Finger[]`, `thumbFingering(keys: readonly Midi[], hand): Finger[]`, `fingeringsOf(kind, start):
  readonly Fingering[]`, `ownFingering(kind, start): Fingering`, `runFingering(root, kind, start, keys, hand,
  fingering): Finger[]`; `placeScale(root, kind, start = 0): PlacedTone[]`. `start` is 0-based (0 the tonic).

- [ ] **Step 1: Write the failing tests** — `fingering.test.ts` in full:

```ts
import { describe, expect, it } from 'vitest'
import {
  fingeringsOf,
  ownFingering,
  runFingering,
  scaleFingering,
  thumbFingering,
  type Finger,
} from './fingering'
import { LETTERS, note } from './note'
import { pitchClass } from './pitch'
import { placeScale } from './place'
import { SCALE_KINDS, scaleHasChords, scaleRootSpelling } from './scale'

const digits = (fingers: readonly Finger[]) => fingers.join('')

describe('scaleFingering', () => {
  it('keeps the taught one-octave fingering from the tonic', () => {
    expect(digits(scaleFingering(note('C'), 'major', 'rh', 0))).toBe('12312345')
    expect(digits(scaleFingering(note('C'), 'major', 'lh', 0))).toBe('54321321')
    expect(digits(scaleFingering(note('F'), 'major', 'rh', 0))).toBe('12341234')
    expect(digits(scaleFingering(note('B', -1), 'major', 'rh', 0))).toBe('21231234')
    expect(digits(scaleFingering(note('C'), 'blues', 'lh', 0))).toBe('4214321')
  })

  it('fingers harmonic and melodic minor as natural minor', () => {
    for (const hand of ['rh', 'lh'] as const) {
      const natural = scaleFingering(note('A'), 'natural', hand, 0)
      expect(scaleFingering(note('A'), 'harmonic', hand, 0)).toEqual(natural)
      expect(scaleFingering(note('A'), 'melodic', hand, 0)).toEqual(natural)
    }
  })

  it('gives the major pentatonic’s octave a finger', () => {
    expect(digits(scaleFingering(note('C'), 'pent', 'rh', 0))).toBe('123123')
    expect(digits(scaleFingering(note('C'), 'pent', 'lh', 0))).toBe('321213')
  })

  it('keeps each note’s finger in a longer run from any other note (PWJ’s modes)', () => {
    expect(digits(scaleFingering(note('C'), 'major', 'rh', 2))).toBe('31234123')
    expect(digits(scaleFingering(note('C'), 'major', 'lh', 2))).toBe('32132143')
    // B♭ major's thumbs are on C and F, so between octaves B♭ is the 4th finger.
    expect(digits(scaleFingering(note('B', -1), 'major', 'rh', 6))).toBe('34123123')
  })

  it('fingers a mode as its parent major', () => {
    expect(digits(scaleFingering(note('D'), 'dorian', 'rh', 0))).toBe('23123412')
    expect(digits(scaleFingering(note('D'), 'dorian', 'lh', 0))).toBe('43213214')
  })

  it('carries no pentatonic or blues fingering to another note', () => {
    expect(() => scaleFingering(note('C'), 'blues', 'rh', 2)).toThrow(RangeError)
    expect(() => scaleFingering(note('A'), 'mpent', 'rh', 0)).toThrow(RangeError)
  })
})

describe('thumbFingering', () => {
  it('fingers every white-key major scale as it is taught, both hands', () => {
    for (const letter of LETTERS) {
      const keys = placeScale(note(letter), 'major').map((placed) => placed.midi)
      for (const hand of ['rh', 'lh'] as const) {
        expect(thumbFingering(keys, hand)).toEqual(scaleFingering(note(letter), 'major', hand, 0))
      }
    }
  })

  it('keeps the later thumbs off the black keys', () => {
    const bFlat = placeScale(note('B', -1), 'major').map((placed) => placed.midi)
    expect(digits(thumbFingering(bFlat, 'rh'))).toBe('12341234')
    const blues = placeScale(note('C'), 'blues').map((placed) => placed.midi)
    expect(digits(thumbFingering(blues, 'rh'))).toBe('1234123')
  })

  it('puts the left hand’s thumb on the top note, coming down', () => {
    const fromE = placeScale(note('C'), 'major', 2).map((placed) => placed.midi)
    expect(thumbFingering(fromE, 'lh').at(-1)).toBe(1)
  })
})

describe('fingeringsOf and ownFingering', () => {
  it('offers both fingerings for a seven-note scale from any note', () => {
    expect(fingeringsOf('major', 3)).toEqual(['thumb', 'scale'])
    expect(fingeringsOf('dorian', 0)).toEqual(['thumb', 'scale'])
  })

  it('offers a pentatonic or blues scale its taught fingering from its tonic only', () => {
    expect(fingeringsOf('blues', 0)).toEqual(['scale'])
    expect(fingeringsOf('blues', 2)).toEqual(['thumb'])
    expect(fingeringsOf('mpent', 0)).toEqual(['thumb'])
  })

  it('fingers a run as taught from a taught tonic, else from the thumb', () => {
    expect(ownFingering('major', 0)).toBe('scale')
    expect(ownFingering('major', 2)).toBe('thumb')
    expect(ownFingering('dorian', 0)).toBe('thumb')
    expect(ownFingering('majorBlues', 0)).toBe('thumb')
  })
})

describe('runFingering', () => {
  it('uses only fingers 1–5 for every kind, root, start and hand it offers', () => {
    for (const kind of SCALE_KINDS) {
      for (let pc = 0; pc < 12; pc++) {
        const root = scaleRootSpelling(pitchClass(pc), kind)
        const starts = scaleHasChords(kind) ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2]
        for (const start of starts) {
          const keys = placeScale(root, kind, start).map((placed) => placed.midi)
          for (const fingering of fingeringsOf(kind, start)) {
            for (const hand of ['rh', 'lh'] as const) {
              const fingers = runFingering(root, kind, start, keys, hand, fingering)
              expect(fingers).toHaveLength(keys.length)
              for (const finger of fingers) expect([1, 2, 3, 4, 5]).toContain(finger)
            }
          }
        }
      }
    }
  })
})
```

  `place.test.ts`: add to `placeScale`:

```ts
  it('runs from any degree up an octave, each note keeping its degree from the tonic', () => {
    const fromE = placeScale(note('C'), 'major', 2)
    expect(keys(fromE)).toEqual([64, 65, 67, 69, 71, 72, 74, 76])
    expect(fromE.map((placed) => placed.tone.degree)).toEqual(['3', '4', '5', '6', '7', '1', '2', '3'])
  })
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/shared/lib/music/fingering.test.ts src/shared/lib/music/place.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement** — `fingering.ts` in full (the tables are today's, the pentatonic's gaining its octave's
  digit):

```ts
import { isBlackKey } from './keyboard'
import { pitchClassOf, type SpelledNote } from './note'
import type { Midi } from './pitch'
import { relatedScale, scaleHasChords, type ScaleKind } from './scale'

export type Finger = 1 | 2 | 3 | 4 | 5
export type Hand = 'rh' | 'lh'

const FINGERS: readonly Finger[] = [1, 2, 3, 4, 5]

/** How a run is fingered: the thumb on its first note, or each note as the scale fingers it. */
export const FINGERINGS = ['thumb', 'scale'] as const
export type Fingering = (typeof FINGERINGS)[number]

type FingeringTable = 'major' | 'natural' | 'pent' | 'blues'

/** The kinds taught a fingering of their own; harmonic and melodic minor are fingered as natural minor. */
const OWN_TABLE: Readonly<Partial<Record<ScaleKind, FingeringTable>>> = {
  major: 'major',
  natural: 'natural',
  harmonic: 'natural',
  melodic: 'natural',
  pent: 'pent',
  blues: 'blues',
}

/** One octave up from the tonic, a digit a note, the octave's included; the left hand read from the bottom note up. */
type Run = Readonly<Record<Hand, string>>
const fingers = (rh: string, lh: string): Run => ({ rh, lh })
const C_SHAPE = fingers('12312345', '54321321')

/** By the root's pitch class. */
const RUNS: Readonly<Record<FingeringTable, Readonly<Partial<Record<number, Run>>>>> = {
  major: {
    0: C_SHAPE,
    1: fingers('23123412', '32143212'),
    2: C_SHAPE,
    3: fingers('31234123', '32143213'),
    4: C_SHAPE,
    5: fingers('12341234', '54321321'),
    6: fingers('23412312', '43213212'),
    7: C_SHAPE,
    8: fingers('23123123', '32143213'),
    9: C_SHAPE,
    10: fingers('21231234', '32143213'),
    11: fingers('12312345', '43214321'),
  },
  natural: {
    0: C_SHAPE,
    1: fingers('23123123', '32143213'),
    2: C_SHAPE,
    3: fingers('21234123', '21432132'),
    4: C_SHAPE,
    5: fingers('12341234', '54321321'),
    6: fingers('23123123', '43213214'),
    7: C_SHAPE,
    8: fingers('23123123', '32132143'),
    9: C_SHAPE,
    10: fingers('21231234', '21321432'),
    11: fingers('12312345', '43214321'),
  },
  // The octave's finger is the next in the hand's direction; a left hand on its thumb crosses 3 over.
  pent: {
    0: fingers('123123', '321213'),
    1: fingers('231234', '321321'),
    2: fingers('123123', '432121'),
    3: fingers('123123', '432121'),
    4: fingers('123123', '432121'),
    5: fingers('123123', '321213'),
    6: fingers('123123', '432121'),
    7: fingers('123123', '321213'),
    8: fingers('231212', '321321'),
    9: fingers('123123', '432121'),
    10: fingers('212123', '321213'),
    11: fingers('123123', '321321'),
  },
  blues: {
    0: fingers('1234123', '4214321'),
    1: fingers('2123412', '2143212'),
    2: fingers('1234123', '4214321'),
    3: fingers('1231234', '4321321'),
    4: fingers('1234123', '4214321'),
    5: fingers('1231234', '4321321'),
    6: fingers('2123412', '4321214'),
    7: fingers('1234123', '4214321'),
    8: fingers('1231234', '4321432'),
    9: fingers('1234123', '4214321'),
    10: fingers('1231234', '4321321'),
    11: fingers('1231234', '5321321'),
  },
}

function toFinger(n: number): Finger {
  const finger = FINGERS[n - 1]
  if (finger === undefined || finger !== n) throw new RangeError(`${n} is not a finger`)
  return finger
}

/** A table's one-octave run from the tonic. */
function tableRun(table: FingeringTable, root: SpelledNote, hand: Hand): Finger[] {
  const run = RUNS[table][pitchClassOf(root)]
  if (!run) throw new RangeError(`The ${table} table has no fingering on ${pitchClassOf(root)}`)
  return [...run[hand]].map((digit) => toFinger(Number(digit)))
}

/**
 * Each degree's finger in a longer run, from where the run puts the thumb: a right-hand note takes
 * one finger more for each degree it lies above the thumb before it, a left-hand note for each
 * degree below the thumb after it (B♭ major's thumbs are on C and F, so between octaves B♭ is 4).
 */
function continuing(run: readonly Finger[], hand: Hand): Finger[] {
  const degrees = run.length - 1
  const thumbs = new Set(run.flatMap((finger, i) => (finger === 1 ? [i % degrees] : [])))
  return Array.from({ length: degrees }, (_, degree) => {
    for (let steps = 0; steps < degrees; steps++) {
      const at = hand === 'rh' ? degree - steps : degree + steps
      if (thumbs.has((at + degrees) % degrees)) return toFinger(steps + 1)
    }
    throw new RangeError('A fingering puts the thumb on no degree')
  })
}

/** Each degree's continuing finger: the kind's own table, or a mode's parent major's. */
function continuingFingers(root: SpelledNote, kind: ScaleKind, hand: Hand): Finger[] {
  const own = OWN_TABLE[kind]
  if (own) return continuing(tableRun(own, root, hand), hand)
  const parent = relatedScale(root, kind)
  if (parent?.relation !== 'parent') throw new RangeError(`${kind} has no fingering to carry`)
  const source = continuing(tableRun('major', parent.root, hand), hand)
  // This scale's degree d is the parent's degree d − (where the parent's tonic sits in this scale).
  return source.map((_, degree) => source[(degree - parent.degree + 7) % 7] ?? 1)
}

/**
 * A run from degree `start` (0 the tonic) up an octave, fingered as the scale fingers each note, read
 * from the bottom note up: from a taught tonic its taught fingering; from any other note of a
 * seven-note scale each note's finger in a longer run (PWJ: E to E with C major's, 3 1 2 3 4 1 2 3).
 */
export function scaleFingering(
  root: SpelledNote,
  kind: ScaleKind,
  hand: Hand,
  start: number,
): Finger[] {
  const own = OWN_TABLE[kind]
  if (own && start === 0) return tableRun(own, root, hand)
  if (!scaleHasChords(kind)) throw new RangeError(`${kind} is fingered as its scale from its tonic only`)
  const byDegree = continuingFingers(root, kind, hand)
  return Array.from({ length: 8 }, (_, i) => byDegree[(start + i) % 7] ?? 1)
}

/** The ways to finger `count` notes in groups from the thumb (1 2 3 …): every group of 2 to 4, the last of 2 to 5. */
function* groupings(count: number): Generator<number[]> {
  for (let first = 2; first <= Math.min(5, count); first++) {
    if (first === count) yield [first]
    else if (first <= 4 && count - first >= 2) {
      for (const rest of groupings(count - first)) yield [first, ...rest]
    }
  }
}

/** How much a group is preferred, least first: groups of 3, then 4, then 2, then the closing 5. */
const GROUP_RANK: Readonly<Record<number, number>> = { 3: 0, 4: 1, 2: 2, 5: 3 }

/** A grouping's cost: later thumbs on black keys, then the number of groups, then its groups' ranks. */
function cost(keys: readonly Midi[], grouping: readonly number[]): number[] {
  let at = 0
  let blackThumbs = 0
  grouping.forEach((size, i) => {
    const key = keys[at]
    if (i > 0 && key !== undefined && isBlackKey(key)) blackThumbs++
    at += size
  })
  return [blackThumbs, grouping.length, ...grouping.map((size) => GROUP_RANK[size] ?? 4)]
}

function cheaper(a: readonly number[], b: readonly number[]): boolean {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const difference = (a[i] ?? 0) - (b[i] ?? 0)
    if (difference !== 0) return difference < 0
  }
  return false
}

/** Keys in the order played, fingered from the thumb in the grouping that costs least. */
function fromTheThumb(keys: readonly Midi[]): Finger[] {
  let best: number[] = []
  let bestCost: number[] | null = null
  for (const grouping of groupings(keys.length)) {
    const groupingCost = cost(keys, grouping)
    if (!bestCost || cheaper(groupingCost, bestCost)) {
      best = grouping
      bestCost = groupingCost
    }
  }
  return best.flatMap((size) => FINGERS.slice(0, size))
}

/**
 * A run fingered from the thumb (`keys` from the bottom note up): the right hand's thumb on the
 * bottom note going up, the left hand's on the top note coming down, every later thumb kept off the
 * black keys where it can be. Read from the bottom note up.
 */
export function thumbFingering(keys: readonly Midi[], hand: Hand): Finger[] {
  if (hand === 'rh') return fromTheThumb(keys)
  return fromTheThumb([...keys].reverse()).reverse()
}

/** The fingering a run takes when none is chosen: a taught scale's from its tonic, else from the thumb. */
export const ownFingering = (kind: ScaleKind, start: number): Fingering =>
  OWN_TABLE[kind] && start === 0 ? 'scale' : 'thumb'

/** The fingerings a run can take: both for a seven-note scale, else only its own. */
export const fingeringsOf = (kind: ScaleKind, start: number): readonly Fingering[] =>
  scaleHasChords(kind) ? FINGERINGS : [ownFingering(kind, start)]

/** A run's fingers from its bottom note up (`keys` its keys from degree `start`), as the scale fingers it or from the thumb. */
export function runFingering(
  root: SpelledNote,
  kind: ScaleKind,
  start: number,
  keys: readonly Midi[],
  hand: Hand,
  fingering: Fingering,
): Finger[] {
  return fingering === 'scale'
    ? scaleFingering(root, kind, hand, start)
    : thumbFingering(keys, hand)
}
```

  `place.ts` `placeScale`:

```ts
/**
 * A scale as the keyboard shows it: from degree `start` (0 the tonic, at or above middle C) up to
 * that note an octave higher, each tone keeping its degree from the tonic.
 */
export function placeScale(root: SpelledNote, kind: ScaleKind, start = 0): PlacedTone[] {
  const base = MIDDLE_C + pitchClassOf(root)
  const tones = spellScale(root, kind)
  return Array.from({ length: tones.length + 1 }, (_, i) => {
    const index = start + i
    const tone = tones[index % tones.length]
    if (!tone) throw new RangeError(`${kind} has no degree ${start}`)
    return { tone, midi: midi(base + tone.semitones + 12 * Math.floor(index / tones.length)) }
  })
}
```

  `index.ts`: `export { FINGERINGS, fingeringsOf, ownFingering, runFingering, scaleFingering, thumbFingering, type
  Finger, type Fingering, type Hand } from './fingering'`.

- [ ] **Step 4: Keep the Scales reference working** — in `ScaleExplorer.tsx`, the fingering is the tonic's own for
  now (Task 8 adds Start on and the choice):

```tsx
  const fingering = ownFingering(scale.kind, 0)
  const rh = runFingering(root, scale.kind, 0, scaleKeys, 'rh', fingering)
  const lh = runFingering(root, scale.kind, 0, scaleKeys, 'lh', fingering)
  const shown = scale.fingers === 'rh' ? rh : scale.fingers === 'lh' ? lh : null
```

  pass `shown` to `scaleMarks`, always render the Fingers segmented, and `FingeringTable` takes non-null `rh`, `lh`
  (its `none` branch and the `fingering.none` strings go):

```tsx
/** Note, RH and LH fingers for the run's octave. */
export function FingeringTable({
  notes,
  rh,
  lh,
}: {
  notes: readonly string[]
  rh: readonly Finger[]
  lh: readonly Finger[]
}) {
```

  In `ScalesPage.test.tsx` add:

```ts
  it('fingers a scale with no taught fingering from the thumb', async () => {
    await renderApp('/learn/scales?kind=mpent&root=A')
    expect(await screen.findByRole('table')).toHaveTextContent('RH')
  })
```

- [ ] **Step 5: Run the tests**

Run: `npx vitest run src/shared/lib/music src/pages/scales src/widgets/scale-explorer`
Expected: PASS. Then `npm run typecheck && npm run lint`.

- [ ] **Step 6: Commit**

```bash
npx prettier --write src/shared/lib/music/fingering.ts src/shared/lib/music/fingering.test.ts src/shared/lib/music/place.ts src/shared/lib/music/place.test.ts src/shared/lib/music/index.ts src/widgets/scale-explorer/ui/ScaleExplorer.tsx src/widgets/scale-explorer/ui/FingeringTable.tsx src/shared/i18n/locales/en/learn.ts src/shared/i18n/locales/ru/learn.ts src/pages/scales/ui/ScalesPage.test.tsx
git add -A src/shared/lib/music src/widgets/scale-explorer src/shared/i18n src/pages/scales
git commit -m "Finger a run from any note: as the scale keeps its thumbs, or from the thumb off the black keys

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: The scale's chords stacked in thirds, named by rule

**Files:**
- Create: `src/shared/lib/music/scale-chord.ts`, `src/shared/lib/music/scale-chord.test.ts`,
  `src/shared/ui/ChordButton.tsx`, `src/shared/ui/ChordButton.test.tsx`
- Delete: `src/shared/lib/music/diatonic.ts`, `src/shared/lib/music/diatonic.test.ts`
- Modify: `src/shared/lib/music/chord.ts` (three qualities), `src/shared/lib/music/place.ts`,
  `src/shared/lib/music/index.ts`, `src/shared/i18n/locales/{en,ru}/music.ts` (quality names)
- Modify: `src/widgets/scale-explorer/model/scale-keys.ts`, `src/widgets/scale-explorer/ui/KeyChords.tsx`,
  `src/widgets/scale-explorer/ui/ScaleExplorer.tsx`, `src/shared/ui/index.ts`
- Test: `src/shared/lib/music/chord.test.ts`, `src/shared/lib/music/skill.test.ts`,
  `src/shared/lib/music/place.test.ts`, `src/widgets/scale-explorer/model/scale-keys.test.ts`

**Interfaces:**
- Produces: `CHORD_NOTES = [3, 4, 5, 6, 7]`, `type ChordNotes`, `interface ScaleChord { degree; roman; root; tones;
  suffix; quality? }`, `scaleChords(root, kind, notes): ScaleChord[]`, `stackSuffix(tones)`, `scaleChordSymbol(chord,
  bass?)`, `romanFigure(notes, inversion)`, `scaleChordHolds(chord, pc)`, `scaleChordAt(root, kind, degree, notes: 3 |
  4 | 5): Chord`; in `place.ts`: `lastStackInversion(notes)`, `interface PlacedScaleChord { chord: ScaleChord; key:
  Midi; tones: PlacedTone[]; symbol: string; numeral: string }`, `placeScaleChords(root, kind, notes, inversion)`;
  qualities `mM9`, `M9s5`, `hd9`; the kit's `ChordButton({ symbol, numeral, playing, holds?, onClick })`.
- Removes: `diatonicChords`, `DiatonicChord`.

- [ ] **Step 1: Write the failing tests** — `scale-chord.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { qualitySuffix } from './chord'
import { noteName, note } from './note'
import { pitchClass } from './pitch'
import { SCALE_KINDS, scaleHasChords, scaleRootSpelling, spellScale } from './scale'
import {
  CHORD_NOTES,
  romanFigure,
  scaleChordAt,
  scaleChordHolds,
  scaleChords,
  scaleChordSymbol,
} from './scale-chord'
import { chordSymbol } from './chord'

const symbols = (root = note('C'), kind: Parameters<typeof scaleChords>[1] = 'major', notes: 3 | 4 | 5 | 6 | 7 = 3) =>
  scaleChords(root, kind, notes).map((chord) => scaleChordSymbol(chord)).join(' ')

describe('scaleChords', () => {
  it.each([
    [3, 'C Dm Em F G Am B°'],
    [4, 'CMaj7 Dm7 Em7 FMaj7 G7 Am7 Bm7♭5'],
    [5, 'CMaj9 Dm9 Em7♭9 FMaj9 G9 Am9 Bm7♭5♭9'],
    [6, 'CMaj11 Dm11 Em11♭9 FMaj9#11 G11 Am11 Bm11♭5♭9'],
    [7, 'CMaj13 Dm13 Em11♭9♭13 FMaj13#11 G13 Am11♭13 Bm11♭5♭9♭13'],
  ] as const)('stacks C major’s chords of %i notes: %s', (notes, expected) => {
    expect(symbols(note('C'), 'major', notes)).toBe(expected)
  })

  it('stacks A harmonic and melodic minor’s 9ths', () => {
    expect(symbols(note('A'), 'harmonic', 5)).toBe(
      'Am(maj9) Bm7♭5♭9 C+Maj9 Dm9 E7♭9 FMaj7#9 G#°7♭9',
    )
    expect(symbols(note('A'), 'melodic', 5)).toBe('Am(maj9) Bm7♭9 C+Maj9 D9 E9 F#m9♭5 G#m7♭5♭9')
  })

  it('numbers the degrees, marking diminished, half-diminished and augmented', () => {
    expect(scaleChords(note('C'), 'major', 3).map((chord) => chord.roman)).toEqual([
      'I',
      'ii',
      'iii',
      'IV',
      'V',
      'vi',
      'vii°',
    ])
    expect(scaleChords(note('A'), 'harmonic', 4).map((chord) => chord.roman)).toEqual([
      'i',
      'iiø',
      'III+',
      'iv',
      'V',
      'VI',
      'vii°',
    ])
    expect(scaleChords(note('A'), 'harmonic', 7)[1]?.roman).toBe('iiø')
  })

  it('spells every stacked note as the scale does, labelled from the chord’s root', () => {
    const scale = spellScale(note('E', -1), 'harmonic').map((tone) => noteName(tone.note))
    const vii = scaleChords(note('E', -1), 'harmonic', 7)[6]
    expect(vii?.tones.map((tone) => noteName(tone.note))).toEqual(['D', 'F', 'A♭', 'C♭', 'E♭', 'G♭', 'B♭'])
    for (const tone of vii?.tones ?? []) expect(scale).toContain(noteName(tone.note))
    expect(vii?.tones.map((tone) => tone.degree)).toEqual(['1', '♭3', '♭5', '𝄫7', '♭9', '♭11', '♭13'])
  })

  it('names a stack that is a table quality by that quality’s own suffix, on every root of every kind', () => {
    for (const kind of SCALE_KINDS.filter(scaleHasChords)) {
      for (let pc = 0; pc < 12; pc++) {
        const root = scaleRootSpelling(pitchClass(pc), kind)
        for (const notes of CHORD_NOTES) {
          for (const chord of scaleChords(root, kind, notes)) {
            if (notes <= 4) expect(chord.quality).toBeDefined()
            if (chord.quality) expect(chord.suffix).toBe(qualitySuffix(chord.quality))
          }
        }
      }
    }
  })

  it('has none for a scale without seven notes', () => {
    expect(scaleChords(note('C'), 'blues', 3)).toEqual([])
  })
})

describe('romanFigure', () => {
  it('writes a triad’s and a 7th’s inversions in figured bass, and nothing from a 9th up', () => {
    expect([0, 1, 2].map((inversion) => romanFigure(3, inversion))).toEqual(['', '⁶', '⁶₄'])
    expect([0, 1, 2, 3].map((inversion) => romanFigure(4, inversion))).toEqual([
      '⁷',
      '⁶₅',
      '⁴₃',
      '⁴₂',
    ])
    expect(romanFigure(5, 1)).toBe('')
  })
})

describe('scaleChordSymbol', () => {
  it('writes an inversion over its bass', () => {
    const [tonic] = scaleChords(note('C'), 'major', 3)
    if (!tonic) throw new Error('C major has a tonic chord')
    expect(scaleChordSymbol(tonic, note('E'))).toBe('C/E')
  })
})

describe('scaleChordHolds', () => {
  it('holds a note when one of its tones is it, in any octave; a 13th holds the whole scale', () => {
    const [tonic] = scaleChords(note('C'), 'major', 3)
    if (!tonic) throw new Error('C major has a tonic chord')
    expect(scaleChordHolds(tonic, pitchClass(4))).toBe(true)
    expect(scaleChordHolds(tonic, pitchClass(2))).toBe(false)
    const thirteenth = scaleChords(note('C'), 'major', 7)[3]
    if (!thirteenth) throw new Error('C major has an F 13th')
    for (const tone of spellScale(note('C'), 'major')) {
      expect(scaleChordHolds(thirteenth, tone.pitchClass)).toBe(true)
    }
  })
})

describe('scaleChordAt', () => {
  const chart = (kind: Parameters<typeof scaleChordAt>[1], root = note('C')) =>
    [0, 1, 2, 3, 4, 5, 6].map((degree) => chordSymbol(scaleChordAt(root, kind, degree, 5))).join(' ')

  it('adds a 9th only where it is an available tension', () => {
    expect(chart('major')).toBe('CMaj9 Dm9 Em7 FMaj9 G9 Am9 Bm7♭5')
    expect(chart('harmonic', note('A'))).toBe('Am(maj9) Bm7♭5 C+Maj9 Dm9 E7♭9 FMaj7 G#°7')
    expect(chart('melodic', note('C'))).toBe('Cm(maj9) Dm7 E♭+Maj9 F9 G9 Am9♭5 Bm7♭5')
  })

  it('plays a triad or a 7th chord as the scale stacks it', () => {
    expect(scaleChordAt(note('D'), 'dorian', 3, 3)).toEqual({ root: note('G'), quality: 'maj' })
    expect(scaleChordAt(note('D'), 'dorian', 3, 4)).toEqual({ root: note('G'), quality: 'd7' })
  })
})
```

  `chord.test.ts`: the quality count becomes `36` and the families `[6, 5, 9, 8, 8]`; add

```ts
  it('know the 9ths of melodic minor’s tonic, its III and its vi', () => {
    expect(names(note('C'), 'mM9')).toEqual(['C', 'E♭', 'G', 'B', 'D'])
    expect(names(note('C'), 'M9s5')).toEqual(['C', 'E', 'G#', 'B', 'D'])
    expect(names(note('C'), 'hd9')).toEqual(['C', 'E♭', 'G♭', 'B♭', 'D'])
    expect(parseChordSymbol('Cø9')).toEqual({ root: note('C'), quality: 'hd9' })
  })
```

  `skill.test.ts`: "All 40" becomes 49 (36 qualities, 13 kinds) wherever it counts skills.

  `place.test.ts`'s `placeScaleChords` block becomes:

```ts
describe('placeScaleChords', () => {
  it('stands each triad of C major on its degree’s key, with its numeral', () => {
    const chords = placeScaleChords(note('C'), 'major', 3, 0)
    expect(chords.map((c) => c.numeral)).toEqual(['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'])
    expect(chords.map((c) => c.key)).toEqual([60, 62, 64, 65, 67, 69, 71])
    expect(keys(chords[1]?.tones ?? [])).toEqual([62, 65, 69])
  })

  it('stacks a 7th chord from its degree’s key, even past the octave, figured in root position', () => {
    const iii = placeScaleChords(note('A'), 'major', 4, 0)[2]
    expect(iii?.chord.quality).toBe('m7')
    expect(iii?.symbol).toBe('C#m7')
    expect(iii?.numeral).toBe('iii⁷')
    expect(iii?.key).toBe(73)
    expect(keys(iii?.tones ?? [])).toEqual([73, 76, 80, 83])
  })

  it('raises the lowest tones for an inversion, over its bass, with its figure', () => {
    const tonic = placeScaleChords(note('C'), 'major', 3, 1)[0]
    expect(keys(tonic?.tones ?? [])).toEqual([64, 67, 72])
    expect(tonic?.symbol).toBe('C/E')
    expect(tonic?.numeral).toBe('I⁶')
    expect(placeScaleChords(note('C'), 'major', 4, 3)[4]?.numeral).toBe('V⁴₂')
  })

  it('refuses an inversion the chords do not have', () => {
    expect(() => placeScaleChords(note('C'), 'major', 3, 3)).toThrow(RangeError)
  })

  it('has none for a scale without seven notes', () => {
    expect(placeScaleChords(note('C'), 'blues', 3, 0)).toEqual([])
  })
})

describe('lastStackInversion', () => {
  it('offers the 3rd, 5th and 7th in the bass at most', () => {
    expect(CHORD_NOTES.map(lastStackInversion)).toEqual([2, 3, 3, 3, 3])
  })
})
```

  (importing `CHORD_NOTES` from `./scale-chord` and `lastStackInversion` from `./place`.)

  `src/shared/ui/ChordButton.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ChordButton } from './ChordButton'

describe('ChordButton', () => {
  it('shows the chord’s symbol over its numeral, pressed while it plays, ringed when it holds the note', async () => {
    const onClick = vi.fn()
    const { rerender } = render(
      <ChordButton symbol="Dm7" numeral="ii⁷" playing={false} onClick={onClick} />,
    )
    const button = screen.getByRole('button', { name: /^Dm7/ })
    expect(button).toHaveTextContent('ii⁷')
    expect(button).toHaveAttribute('aria-pressed', 'false')
    await userEvent.setup().click(button)
    expect(onClick).toHaveBeenCalledOnce()
    rerender(<ChordButton symbol="Dm7" numeral="ii⁷" playing holds onClick={onClick} />)
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(button).toHaveAttribute('data-holds')
  })
})
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/shared/lib/music/scale-chord.test.ts src/shared/lib/music/place.test.ts src/shared/lib/music/chord.test.ts src/shared/ui/ChordButton.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement** — `chord.ts`: three entries before `m11`:

```ts
  mM9: {
    family: 'nin',
    suffix: 'm(maj9)',
    aliases: ['−Δ9', 'm(+9)'],
    intervals: ['r', 'm3', 'P5', 'M7', 'M9'],
    prefersSharps: true,
  },
  M9s5: {
    family: 'nin',
    suffix: '+Maj9',
    aliases: ['Δ9(+5)', '+maj9'],
    intervals: ['r', 'M3', 'A5', 'M7', 'M9'],
  },
  hd9: {
    family: 'nin',
    suffix: 'm9♭5',
    aliases: ['ø9', 'm9(−5)'],
    intervals: ['r', 'm3', 'd5', 'm7', 'M9'],
    prefersSharps: true,
  },
```

  and its comment `/** All 33 …` becomes `/** All 36, in table order: family by family. */`.

  `scale-chord.ts`:

```ts
import { CHORD_QUALITIES, qualityIntervals, type Chord, type ChordQuality } from './chord'
import { labelled } from './interval'
import { noteName, type SpelledNote } from './note'
import type { PitchClass } from './pitch'
import { spellScale, type ScaleKind } from './scale'
import { toneAbove, type Tone } from './tone'

/** How many notes a chord of a scale stacks: a triad, a 7th, a 9th, an 11th, a 13th. */
export const CHORD_NOTES = [3, 4, 5, 6, 7] as const
export type ChordNotes = (typeof CHORD_NOTES)[number]

/** A chord of a scale: its notes stacked in thirds from one degree. */
export interface ScaleChord {
  /** 0 the tonic … 6. */
  readonly degree: number
  /** Its Roman numeral in root position, without a figure: `ii`, `vii°`, `III+`, `viiø`. */
  readonly roman: string
  readonly root: SpelledNote
  /** Root, 3rd, 5th, 7th, 9th, 11th, 13th: as many as it stacks. */
  readonly tones: readonly Tone[]
  /** Written after the root: `m7`, `Maj9#11`, `m11♭9♭13`. */
  readonly suffix: string
  /** The table's quality with exactly these tones, where there is one. */
  readonly quality?: ChordQuality
}

/** The triads a scale stacks, by their 3rd and 5th: the suffix and the numeral's mark. */
const TRIADS = new Map([
  ['4 7', { suffix: '', mark: '' }],
  ['3 7', { suffix: 'm', mark: '' }],
  ['3 6', { suffix: '°', mark: '°' }],
  ['4 8', { suffix: '+', mark: '+' }],
])

/** The 7th chords, by 3rd, 5th and 7th: what goes before and after the highest number, and the numeral's mark. */
const SEVENTHS = new Map([
  ['4 7 11', { lead: 'Maj', trail: '', mark: '' }],
  ['3 7 10', { lead: 'm', trail: '', mark: '' }],
  ['4 7 10', { lead: '', trail: '', mark: '' }],
  ['3 6 10', { lead: 'm', trail: '♭5', mark: 'ø' }],
  ['3 6 9', { lead: '°', trail: '', mark: '°' }],
  ['3 7 11', { lead: 'm(maj', trail: ')', mark: '' }],
  ['4 8 11', { lead: '+Maj', trail: '', mark: '+' }],
  ['4 8 10', { lead: '', trail: '#5', mark: '+' }],
])

/** An extension's semitones when it is natural: the major 9th, the perfect 11th, the major 13th. */
const NATURAL: Readonly<Record<number, number>> = { 9: 14, 11: 17, 13: 21 }
const ALTERATIONS = new Map([
  [-1, '♭'],
  [1, '#'],
])
const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']

function entryOf<V>(table: ReadonlyMap<string, V>, semitones: readonly number[]): V {
  const entry = table.get(semitones.join(' '))
  if (!entry) throw new RangeError(`No chord of a scale stacks ${semitones.join(' ')}`)
  return entry
}

/**
 * A stack's suffix by one rule: its triad, or its 7th chord carrying the highest natural extension,
 * then each altered extension in order (`m7♭9`, `Maj9#11`, `m11♭9♭13`).
 */
export function stackSuffix(tones: readonly Tone[]): string {
  const semitones = tones.map((tone) => tone.semitones)
  if (tones.length === 3) return entryOf(TRIADS, semitones.slice(1, 3)).suffix
  const seventh = entryOf(SEVENTHS, semitones.slice(1, 4))
  let highest = 7
  const altered: string[] = []
  semitones.slice(4).forEach((above, i) => {
    const extension = 9 + 2 * i
    const alteration = above - (NATURAL[extension] ?? above)
    if (alteration === 0) highest = extension
    else altered.push(`${ALTERATIONS.get(alteration) ?? ''}${extension}`)
  })
  return `${seventh.lead}${highest}${seventh.trail}${altered.join('')}`
}

/** A stack's numeral mark: its triad's, or from a 7th up its 7th chord's. */
function numeralMark(tones: readonly Tone[]): string {
  const semitones = tones.map((tone) => tone.semitones)
  return tones.length === 3
    ? entryOf(TRIADS, semitones.slice(1, 3)).mark
    : entryOf(SEVENTHS, semitones.slice(1, 4)).mark
}

/** The table quality whose intervals are exactly these tones, if one is. */
const qualityOf = (tones: readonly Tone[]): ChordQuality | undefined =>
  CHORD_QUALITIES.find((quality) => {
    const intervals = qualityIntervals(quality)
    return (
      intervals.length === tones.length &&
      intervals.every((interval, i) => interval.semitones === tones[i]?.semitones)
    )
  })

/**
 * The chords of a seven-note scale, one on each degree, `notes` stacked in thirds: every other note
 * of the scale from the degree up, past the octave from the 9th. None for a scale of fewer notes.
 */
export function scaleChords(root: SpelledNote, kind: ScaleKind, notes: ChordNotes): ScaleChord[] {
  const scale = spellScale(root, kind)
  if (scale.length !== 7) return []
  return scale.map((degreeTone, degree) => {
    const tones = Array.from({ length: notes }, (_, third) => {
      const index = degree + 2 * third
      const above = scale[index % 7]?.semitones ?? 0
      const semitones = above + 12 * Math.floor(index / 7) - degreeTone.semitones
      return toneAbove(degreeTone.note, labelled(2 * third, semitones))
    })
    const numeral = NUMERALS[degree] ?? ''
    const quality = qualityOf(tones)
    return {
      degree,
      roman: (tones[1]?.semitones === 3 ? numeral.toLowerCase() : numeral) + numeralMark(tones),
      root: degreeTone.note,
      tones,
      suffix: stackSuffix(tones),
      ...(quality ? { quality } : {}),
    }
  })
}

/** A chord of a scale as a symbol, over its bass when that is not the root: `Dm7`, `C/E`. */
export const scaleChordSymbol = (chord: ScaleChord, bass?: SpelledNote): string =>
  noteName(chord.root) + chord.suffix + (bass ? `/${noteName(bass)}` : '')

/** A triad's and a 7th's figured-bass figures by inversion; the tradition has none from a 9th up. */
const FIGURES: Readonly<Partial<Record<ChordNotes, readonly string[]>>> = {
  3: ['', '⁶', '⁶₄'],
  4: ['⁷', '⁶₅', '⁴₃', '⁴₂'],
}

/** What follows a numeral for its chord's inversion: `I⁶`, `ii⁶₅`, `V⁷`; nothing from a 9th up. */
export const romanFigure = (notes: ChordNotes, inversion: number): string =>
  FIGURES[notes]?.[inversion] ?? ''

/** Whether a chord of a scale holds a note, in any octave. */
export const scaleChordHolds = (chord: ScaleChord, pc: PitchClass): boolean =>
  chord.tones.some((tone) => tone.pitchClass === pc)

/** A 9th a chart may add: a major 9th over any 7th chord, or a ♭9 or ♯9 over a dominant 7th. */
function ninthAvailable(ninth: ScaleChord, seventh: ChordQuality): boolean {
  const above = ninth.tones[4]?.semitones
  return above === 14 || (seventh === 'd7' && (above === 13 || above === 15))
}

/**
 * The chord on a degree as a chart plays it: its triad, its 7th, or its 9th where the scale's 9th is
 * an available tension (else its 7th: C major's iii stays Em7). Always one of the table's qualities.
 */
export function scaleChordAt(
  root: SpelledNote,
  kind: ScaleKind,
  degree: number,
  notes: 3 | 4 | 5,
): Chord {
  const base = scaleChords(root, kind, notes === 3 ? 3 : 4)[degree]
  const ninth = notes === 5 ? scaleChords(root, kind, 5)[degree] : undefined
  const quality =
    ninth?.quality && base?.quality && ninthAvailable(ninth, base.quality)
      ? ninth.quality
      : base?.quality
  if (!base || !quality) throw new RangeError(`${kind} has no chord on degree ${degree}`)
  return { root: base.root, quality }
}
```

  `place.ts`: replace the `diatonic` import and `PlacedScaleChord`/`placeScaleChords` with:

```ts
import {
  romanFigure,
  scaleChords,
  scaleChordSymbol,
  type ChordNotes,
  type ScaleChord,
} from './scale-chord'

/** The last inversion a chord of a scale is shown in: the 3rd, 5th or 7th in the bass, as far as it stacks. */
export const lastStackInversion = (notes: ChordNotes): number =>
  Math.min(notes - 1, MOST_INVERSIONS)

/** A chord of a scale on the keyboard: on its root's key, in an inversion, labelled as the keys show it. */
export interface PlacedScaleChord {
  readonly chord: ScaleChord
  /** Its root's key, where the scale places the degree. */
  readonly key: Midi
  readonly tones: readonly PlacedTone[]
  /** Its symbol, over its bass in an inversion: `Dm7`, `C/E`. */
  readonly symbol: string
  /** Its numeral with the inversion's figure: `ii⁷`, `I⁶`. */
  readonly numeral: string
}

/** A stack from its root's key, its lowest `inversion` tones an octave up. */
export function placeStack(
  chord: ScaleChord,
  notes: ChordNotes,
  key: Midi,
  inversion: number,
): PlacedScaleChord {
  const last = lastStackInversion(notes)
  if (!Number.isInteger(inversion) || inversion < 0 || inversion > last) {
    throw new RangeError(`A chord of ${notes} notes has inversions 0–${last}, not ${inversion}`)
  }
  const tones = chord.tones
    .map((tone, i) => ({ tone, midi: midi(key + tone.semitones + (i < inversion ? 12 : 0)) }))
    .sort((a, b) => a.midi - b.midi)
  const bass = inversion > 0 ? tones[0]?.tone.note : undefined
  return {
    chord,
    key,
    tones,
    symbol: scaleChordSymbol(chord, bass),
    numeral: chord.roman + romanFigure(notes, inversion),
  }
}

/** A seven-note scale's chords of `notes` notes, each on its degree's key as `placeScale` places it, in an inversion. */
export function placeScaleChords(
  root: SpelledNote,
  kind: ScaleKind,
  notes: ChordNotes,
  inversion: number,
): PlacedScaleChord[] {
  const degrees = placeScale(root, kind)
  return scaleChords(root, kind, notes).flatMap((chord) => {
    const degree = degrees[chord.degree]
    return degree ? [placeStack(chord, notes, degree.midi, inversion)] : []
  })
}
```

  (`placeStack` is exported for Task 5's borrowed chords; it stays out of `index.ts`.) Remove `sameNote` and
  `Tone` imports if unused.

  `index.ts`: drop the `./diatonic` export; add

```ts
export {
  CHORD_NOTES,
  romanFigure,
  scaleChordAt,
  scaleChordHolds,
  scaleChords,
  scaleChordSymbol,
  stackSuffix,
  type ChordNotes,
  type ScaleChord,
} from './scale-chord'
```

  and in the `./place` export `lastStackInversion`. Delete `diatonic.ts` and `diatonic.test.ts`.

  `music.ts` quality names — en: `mM9: 'Minor-major 9th', M9s5: 'Augmented major 9th', hd9: 'Half-diminished 9th'`;
  ru: `mM9: 'Минорный нонаккорд с большой септимой', M9s5: 'Увеличенный большой нонаккорд', hd9: 'Полууменьшенный
  нонаккорд'` (after `n9` in both).

- [ ] **Step 4: The Scales reference over the new placement** — `scale-keys.ts`:

```ts
/** Chords view: each degree's key with its numeral over its chord (The Ultimate Piano's Diatonic). */
export function chordMarks(chords: readonly PlacedScaleChord[]): Map<Midi, KeyMark> {
  return new Map(
    chords.map((placed, i) => [
      placed.key,
      { tone: i === 0 ? 'tonic' : 'scale', label: placed.symbol, caption: placed.numeral },
    ]),
  )
}

/** The key's chords that hold a note, in any octave, in the scale's order. */
export const chordsHolding = (
  chords: readonly PlacedScaleChord[],
  note: Midi,
): PlacedScaleChord[] => chords.filter((placed) => scaleChordHolds(placed.chord, pitchClass(note)))
```

  (imports: `scaleChordHolds` in place of `chordHolds`, `chordSymbol` dropped). `ScaleExplorer.tsx` calls
  `placeScaleChords(root, scale.kind, scale.chords, 0)`.

  The kit's `ChordButton.tsx` (the markup `KeyChords` had, for the Keys reference to share), exported from
  `shared/ui/index.ts`:

```tsx
import { Square } from 'lucide-react'
import { Button } from './primitives/button'

/**
 * A chord to tap in a grid of chords: its symbol over its numeral, pressed while it sounds (a square:
 * tap again to stop), ringed when it holds the note heard.
 */
export function ChordButton({
  symbol,
  numeral,
  playing,
  holds = false,
  onClick,
}: {
  symbol: string
  numeral: string
  playing: boolean
  holds?: boolean
  onClick: () => void
}) {
  return (
    <Button
      variant="outline"
      aria-pressed={playing}
      data-holds={holds ? '' : undefined}
      className="relative h-auto min-h-16 flex-col gap-0 px-1 py-2 aria-pressed:bg-secondary aria-pressed:text-secondary-foreground data-holds:ring-3 data-holds:ring-ring data-holds:ring-inset"
      onClick={onClick}
    >
      {playing ? <Square aria-hidden className="absolute top-1.5 right-1.5 size-3" /> : null}
      <span className="max-w-full font-display text-xl leading-tight font-semibold wrap-anywhere">
        {symbol}
      </span>
      <span className="text-sm text-muted-foreground">{numeral}</span>
    </Button>
  )
}
```

  `KeyChords.tsx` over the new placement:

```tsx
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import type { Midi, PlacedScaleChord, Tone } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { ChordButton } from '@/shared/ui'
import { heardName } from '../model/scale-keys'

/**
 * The key's chords: a tap plays one from its degree's key, pressed while it sounds. Listening for a
 * note (Keys play Notes), the chords that hold it are ringed and named.
 */
export function KeyChords({
  chords,
  tones,
  listening,
  note,
  holding,
}: {
  chords: readonly PlacedScaleChord[]
  tones: readonly Tone[]
  listening: boolean
  note: Midi | null
  holding: readonly PlacedScaleChord[]
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const playback = usePlayback<number>()
  const holds = new Set(holding.map((placed) => placed.chord.degree))
  const said =
    note === null
      ? ''
      : holding.length === 0
        ? t('holdsNone', { note: heardName(note, tones) })
        : t('holds', {
            note: heardName(note, tones),
            chords: new Intl.ListFormat(locale, { type: 'conjunction' }).format(
              holding.map((placed) => placed.symbol),
            ),
          })
  return (
    <section aria-label={t('chordsIn')} className="flex flex-col gap-3">
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7 lg:grid-cols-4">
        {chords.map((placed) => (
          <ChordButton
            key={placed.chord.degree}
            symbol={placed.symbol}
            numeral={placed.numeral}
            playing={playback.playing === placed.chord.degree}
            holds={holds.has(placed.chord.degree)}
            onClick={() =>
              playback.toggle(
                placed.chord.degree,
                chordSounds(
                  placed.tones.map((tone) => tone.midi),
                  { arpeggio: false },
                ),
              )
            }
          />
        ))}
      </div>
      {listening ? (
        <p aria-live="polite" className="min-h-7 text-lg">
          {said}
        </p>
      ) : null}
    </section>
  )
}
```

  `scale-keys.test.ts`: `TRIADS = placeScaleChords(C, 'major', 3, 0)`; the 7ths range case uses
  `placeScaleChords(C, 'major', 4, 0)`; `chordsHolding(...).map((c) => c.numeral)` stays `['I', 'iii', 'vi']`.

- [ ] **Step 5: Run the tests**

Run: `npx vitest run src/shared/lib/music src/shared/ui src/widgets/scale-explorer src/pages/scales src/widgets/chord-explorer src/features/quiz`
Expected: PASS. Then `npm run typecheck && npm run lint`.

- [ ] **Step 6: Commit**

```bash
git rm -q src/shared/lib/music/diatonic.ts src/shared/lib/music/diatonic.test.ts
npx prettier --write src/shared/lib/music/scale-chord.ts src/shared/lib/music/scale-chord.test.ts src/shared/lib/music/chord.ts src/shared/lib/music/chord.test.ts src/shared/lib/music/skill.test.ts src/shared/lib/music/place.ts src/shared/lib/music/place.test.ts src/shared/lib/music/index.ts src/shared/i18n/locales/en/music.ts src/shared/i18n/locales/ru/music.ts src/widgets/scale-explorer/model/scale-keys.ts src/widgets/scale-explorer/model/scale-keys.test.ts src/widgets/scale-explorer/ui/KeyChords.tsx src/widgets/scale-explorer/ui/ScaleExplorer.tsx src/shared/ui/ChordButton.tsx src/shared/ui/ChordButton.test.tsx src/shared/ui/index.ts
git add -A src/shared/lib/music src/shared/i18n src/widgets/scale-explorer src/shared/ui
git commit -m "Stack a scale's chords in thirds to the 13th and name each by one rule; add three 9th chords

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Task 5: Keys in the kernel: params, signatures, borrowed chords, the circle

**Files:**
- Create: `src/shared/lib/music/circle.ts`, `src/shared/lib/music/circle.test.ts`
- Modify: `src/shared/lib/music/key.ts`, `src/shared/lib/music/scale.ts`, `src/shared/lib/music/scale-chord.ts`,
  `src/shared/lib/music/place.ts`, `src/shared/lib/music/index.ts`
- Test: `src/shared/lib/music/key.test.ts`, `src/shared/lib/music/scale.test.ts`,
  `src/shared/lib/music/scale-chord.test.ts`, `src/shared/lib/music/place.test.ts`

**Interfaces:**
- Consumes: `scaleChords`, `placeStack`, `lastStackInversion` (Task 4).
- Produces: `type KeyParam`, `keyParam(key): KeyParam`, `keyFromParam(param): Key`, `signatureNotes(key):
  SpelledNote[]`; `relativeKey(key): Key` (in `scale.ts`); `interface BorrowedChord extends ScaleChord { from: ScaleKind }`, `borrowedChords(key, notes)`;
  `placeBorrowedChords(key, notes, inversion): PlacedScaleChord[]`; `CIRCLE_OF_FIFTHS: readonly CirclePlace[]`
  (`{ major: Key; minor: Key }`), `type CircleRing = 'major' | 'minor'`, `circleFunctions(key): CircleFunction[]`
  (`{ place: number; ring: CircleRing; numeral: string }`), `sameKey(a, b)`, `randomKey(random, current): Key`.

- [ ] **Step 1: Write the failing tests** — `key.test.ts` gains (import `keyFromParam, keyParam, signatureNotes`):

```ts
describe('keyParam', () => {
  it('writes a key as a URL does and reads it back', () => {
    expect(keyParam({ tonic: note('E', -1), minor: false })).toBe('Eb')
    expect(keyParam({ tonic: note('C', 1), minor: true })).toBe('C#m')
    expect(keyFromParam(keyParam({ tonic: note('B', -1), minor: true }))).toEqual({
      tonic: note('B', -1),
      minor: true,
    })
  })
})

describe('signatureNotes', () => {
  it('names a signature’s sharps or flats in the order they are written', () => {
    expect(signatureNotes(key('Eb')).map(noteName)).toEqual(['B♭', 'E♭', 'A♭'])
    expect(signatureNotes(key('F#m')).map(noteName)).toEqual(['F#', 'C#', 'G#'])
    expect(signatureNotes(key('Am'))).toEqual([])
  })
})
```

  `scale.test.ts` gains (import `relativeKey`):

```ts
describe('relativeKey', () => {
  it('pairs a major key with the minor on its 6th, and a minor key with the major on its 3rd', () => {
    expect(relativeKey({ tonic: note('E', -1), minor: false })).toEqual({ tonic: note('C'), minor: true })
    expect(relativeKey({ tonic: note('F', 1), minor: true })).toEqual({ tonic: note('A'), minor: false })
  })
})
```

  `circle.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { CIRCLE_OF_FIFTHS, circleFunctions, randomKey } from './circle'
import { keyName } from './key'
import { note } from './note'

describe('CIRCLE_OF_FIFTHS', () => {
  it('goes round by fifths from C, each major over its relative minor, spelled as the app spells tonics', () => {
    expect(CIRCLE_OF_FIFTHS.map((place) => keyName(place.major))).toEqual([
      'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'D♭', 'A♭', 'E♭', 'B♭', 'F',
    ])
    expect(CIRCLE_OF_FIFTHS.map((place) => keyName(place.minor))).toEqual([
      'Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'E♭m', 'B♭m', 'Fm', 'Cm', 'Gm', 'Dm',
    ])
  })
})

describe('circleFunctions', () => {
  it('puts a major key’s seven chords on its place and its neighbours’', () => {
    expect(circleFunctions({ tonic: note('C'), minor: false })).toEqual([
      { place: 0, ring: 'major', numeral: 'I' },
      { place: 11, ring: 'minor', numeral: 'ii' },
      { place: 1, ring: 'minor', numeral: 'iii' },
      { place: 11, ring: 'major', numeral: 'IV' },
      { place: 1, ring: 'major', numeral: 'V' },
      { place: 0, ring: 'minor', numeral: 'vi' },
      { place: 2, ring: 'minor', numeral: 'vii°' },
    ])
  })

  it('does the same for a minor key, its ii° on the place inside its relative’s V', () => {
    expect(circleFunctions({ tonic: note('A'), minor: true }).map((f) => f.numeral)).toEqual([
      'i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII',
    ])
    expect(circleFunctions({ tonic: note('A'), minor: true })[1]).toEqual({
      place: 2,
      ring: 'minor',
      numeral: 'ii°',
    })
  })
})

describe('randomKey', () => {
  it('picks any of the 24 keys but the one shown', () => {
    const c = { tonic: note('C'), minor: false }
    expect(randomKey(() => 0, c)).toEqual({ tonic: note('A'), minor: true })
    expect(randomKey(() => 0.9999, c)).toEqual({ tonic: note('D'), minor: true })
  })
})
```

  `scale-chord.test.ts` gains (import `borrowedChords`):

```ts
describe('borrowedChords', () => {
  const written = (chords: readonly { roman: string }[]) => chords.map((chord) => chord.roman)
  it('borrows ♭III, iv, ♭VI and ♭VII into a major key from its parallel minor', () => {
    const chords = borrowedChords({ tonic: note('C'), minor: false }, 3)
    expect(written(chords)).toEqual(['♭III', 'iv', '♭VI', '♭VII'])
    expect(chords.map((chord) => scaleChordSymbol(chord))).toEqual(['E♭', 'Fm', 'A♭', 'B♭'])
    expect(borrowedChords({ tonic: note('C'), minor: false }, 4).map((c) => scaleChordSymbol(c))).toEqual([
      'E♭Maj7',
      'Fm7',
      'A♭Maj7',
      'B♭7',
    ])
  })

  it('borrows the Picardy I, the Neapolitan ♭II, Dorian’s IV and harmonic minor’s V into a minor key', () => {
    const chords = borrowedChords({ tonic: note('A'), minor: true }, 3)
    expect(written(chords)).toEqual(['I', '♭II', 'IV', 'V'])
    expect(chords.map((chord) => chord.from)).toEqual(['major', 'phrygian', 'melodic', 'harmonic'])
    expect(chords.map((chord) => scaleChordSymbol(chord))).toEqual(['A', 'B♭', 'D', 'E'])
  })
})
```

  `place.test.ts` gains (import `placeBorrowedChords`):

```ts
describe('placeBorrowedChords', () => {
  it('stands each borrowed chord on its root’s key above the tonic', () => {
    const chords = placeBorrowedChords({ tonic: note('C'), minor: false }, 3, 0)
    expect(chords.map((c) => c.key)).toEqual([63, 65, 68, 70])
    expect(keys(chords[1]?.tones ?? [])).toEqual([65, 68, 72])
    expect(chords[3]?.numeral).toBe('♭VII')
  })
})
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/shared/lib/music/key.test.ts src/shared/lib/music/circle.test.ts src/shared/lib/music/scale-chord.test.ts src/shared/lib/music/place.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement** — `key.ts` (imports gain `note`, `noteParam`):

```ts
/** A key as a URL writes it: its tonic's `NoteParam`, then `m` for minor (`Eb`, `C#m`): only keyParam makes one. */
export type KeyParam = string & { readonly __brand: 'KeyParam' }

export const keyParam = (key: Key): KeyParam =>
  (noteParam(key.tonic) + (key.minor ? 'm' : '')) as KeyParam

/** The key keyParam wrote. */
export function keyFromParam(param: KeyParam): Key {
  const key = parseKey(param)
  if (!key) throw new RangeError(`keyParam wrote ${param}, which is not a key`)
  return key
}

const SHARPS_IN_ORDER: readonly Letter[] = ['F', 'C', 'G', 'D', 'A', 'E', 'B']
const FLATS_IN_ORDER: readonly Letter[] = ['B', 'E', 'A', 'D', 'G', 'C', 'F']

/** The sharps or flats of a key's signature, in the order they are written: F♯ C♯ G♯ …, B♭ E♭ A♭ …. */
export function signatureNotes(key: Key): SpelledNote[] {
  const count = keySignature(key)
  const letters = count > 0 ? SHARPS_IN_ORDER : FLATS_IN_ORDER
  return letters.slice(0, Math.abs(count)).map((letter) => note(letter, count > 0 ? 1 : -1))
}
```

  `scale.ts`:

```ts
/** A key's relative: the minor on a major key's 6th, the major on a minor key's 3rd. */
export function relativeKey(key: Key): Key {
  const related = relatedScale(key.tonic, key.minor ? 'natural' : 'major')
  if (!related) throw new RangeError('Every major and minor key has a relative')
  return { tonic: related.root, minor: !key.minor }
}
```

  `scale-chord.ts` (imports gain `pitchClass` and `pitchClassOf`, `type Key`):

```ts
/** A chord a key borrows from a parallel scale, its numeral marked by how its root differs from the key's own. */
export interface BorrowedChord extends ScaleChord {
  readonly from: ScaleKind
}

/**
 * The chords a key borrows most (modal mixture): a major key ♭III, iv, ♭VI and ♭VII from its parallel
 * minor; a minor key the Picardy I from major, the Neapolitan ♭II from Phrygian, IV from melodic minor
 * (Dorian's) and V from harmonic minor.
 */
const BORROWED: Readonly<
  Record<'major' | 'minor', readonly { readonly degree: number; readonly from: ScaleKind }[]>
> = {
  major: [
    { degree: 2, from: 'natural' },
    { degree: 3, from: 'natural' },
    { degree: 5, from: 'natural' },
    { degree: 6, from: 'natural' },
  ],
  minor: [
    { degree: 0, from: 'major' },
    { degree: 1, from: 'phrygian' },
    { degree: 3, from: 'melodic' },
    { degree: 4, from: 'harmonic' },
  ],
}
const SHIFT_SIGNS = new Map([
  [1, '#'],
  [11, '♭'],
])

/** A key's borrowed chords of `notes` notes, in degree order. */
export function borrowedChords(key: Key, notes: ChordNotes): BorrowedChord[] {
  const own = spellScale(key.tonic, key.minor ? 'natural' : 'major')
  return BORROWED[key.minor ? 'minor' : 'major'].flatMap(({ degree, from }) => {
    const chord = scaleChords(key.tonic, from, notes)[degree]
    const ownRoot = own[degree]
    if (!chord || !ownRoot) return []
    const shift = pitchClass(pitchClassOf(chord.root) - pitchClassOf(ownRoot.note))
    return [{ ...chord, roman: (SHIFT_SIGNS.get(shift) ?? '') + chord.roman, from }]
  })
}
```

  `place.ts` (imports gain `type Key`, `pitchClass`, `borrowedChords`):

```ts
/** A key's borrowed chords, each on its root's key above the tonic (at or above middle C), in an inversion. */
export function placeBorrowedChords(
  key: Key,
  notes: ChordNotes,
  inversion: number,
): PlacedScaleChord[] {
  const tonic = MIDDLE_C + pitchClassOf(key.tonic)
  return borrowedChords(key, notes).map((chord) =>
    placeStack(
      chord,
      notes,
      midi(tonic + pitchClass(pitchClassOf(chord.root) - pitchClassOf(key.tonic))),
      inversion,
    ),
  )
}
```

  `circle.ts`:

```ts
import { tonicSpelling, type Key } from './key'
import { pitchClassOf, sameNote } from './note'
import { pitchClass } from './pitch'
import { scaleChords } from './scale-chord'

/** One place on the circle of fifths: a major key outside, its relative minor inside. */
export interface CirclePlace {
  readonly major: Key
  readonly minor: Key
}
export type CircleRing = keyof CirclePlace

/** The twelve places clockwise from C, each a fifth above the one before, tonics spelled as the app spells them. */
export const CIRCLE_OF_FIFTHS: readonly CirclePlace[] = Array.from({ length: 12 }, (_, i) => {
  const major = pitchClass(7 * i)
  return {
    major: { tonic: tonicSpelling(major, false), minor: false },
    minor: { tonic: tonicSpelling(pitchClass(major - 3), true), minor: true },
  }
})

/** Where one of a key's chords sits on the circle, with its numeral. */
export interface CircleFunction {
  readonly place: number
  readonly ring: CircleRing
  readonly numeral: string
}

/**
 * A key's seven triads on the circle, in degree order: a major triad on its major key's place, a
 * minor or diminished one on its minor key's (C's vii°, B°, inside D).
 */
export function circleFunctions(key: Key): CircleFunction[] {
  return scaleChords(key.tonic, key.minor ? 'natural' : 'major', 3).flatMap((chord) => {
    const ring: CircleRing = chord.tones[1]?.semitones === 3 ? 'minor' : 'major'
    const pc = pitchClassOf(chord.root)
    const place = CIRCLE_OF_FIFTHS.findIndex((at) => pitchClassOf(at[ring].tonic) === pc)
    return place < 0 ? [] : [{ place, ring, numeral: chord.roman }]
  })
}

/** Whether two keys are one: the same tonic, spelled alike, and the same mode. */
export const sameKey = (a: Key, b: Key): boolean =>
  a.minor === b.minor && sameNote(a.tonic, b.tonic)

/** One of the circle's 24 keys but `current`, as `random` (0 ≤ r < 1) picks it. */
export function randomKey(random: () => number, current: Key): Key {
  const keys = CIRCLE_OF_FIFTHS.flatMap((place) => [place.major, place.minor]).filter(
    (key) => !sameKey(key, current),
  )
  const picked = keys[Math.min(keys.length - 1, Math.floor(random() * keys.length))]
  if (!picked) throw new RangeError('The circle has no other key')
  return picked
}
```

  `index.ts`: from `./key` add `keyFromParam, keyParam, signatureNotes, type KeyParam`; from `./scale` add
  `relativeKey`; from `./scale-chord` add
  `borrowedChords, type BorrowedChord`; from `./place` add `placeBorrowedChords`; and

```ts
export {
  CIRCLE_OF_FIFTHS,
  circleFunctions,
  randomKey,
  sameKey,
  type CircleFunction,
  type CirclePlace,
  type CircleRing,
} from './circle'
```

- [ ] **Step 4: Run the tests**

Run: `npx vitest run src/shared/lib/music`
Expected: PASS; `npm run typecheck && npm run lint` PASS.

- [ ] **Step 5: Commit**

```bash
npx prettier --write src/shared/lib/music/circle.ts src/shared/lib/music/circle.test.ts src/shared/lib/music/key.ts src/shared/lib/music/key.test.ts src/shared/lib/music/scale.ts src/shared/lib/music/scale.test.ts src/shared/lib/music/scale-chord.ts src/shared/lib/music/scale-chord.test.ts src/shared/lib/music/place.ts src/shared/lib/music/place.test.ts src/shared/lib/music/index.ts
git add -A src/shared/lib/music
git commit -m "Know a key's signature notes, its borrowed chords and its place on the circle of fifths

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: The run in ticks, and the walk's sounds

**Files:**
- Create: `src/shared/lib/schedule/run.ts`, `src/shared/lib/schedule/run.test.ts`
- Modify: `src/shared/lib/schedule/sounds.ts` (drop `scaleRun`, add `walkSounds`), `src/shared/lib/schedule/index.ts`
- Modify: `src/widgets/scale-explorer/ui/ScaleExplorer.tsx`, `src/widgets/scale-explorer/ui/ScalePractice.tsx`
- Test: `src/shared/lib/schedule/sounds.test.ts`

**Interfaces:**
- Consumes: `placeScale` (Task 3), `scaleKey` (Task 2).
- Produces: `scaleRun(notes: readonly PlacedTone[], options: RunOptions): TimedMusic` with `RunOptions = { rhythm;
  hands; key: Key; fingers?: Readonly<Record<Hand, readonly Finger[]>> }`, `runSounds(run: TimedMusic, tempo):
  NoteSound[]`, `walkSounds(chords: readonly (readonly Midi[])[], options: { arpeggio: boolean; tempo: number }):
  NoteSound[]`.

- [ ] **Step 1: Write the failing tests** — `run.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { note, placeScale } from '@/shared/lib/music'
import { runSounds, scaleRun, type RunOptions } from './run'

const C_MAJOR = placeScale(note('C'), 'major')
const C_KEY = { tonic: note('C'), minor: false }

describe('scaleRun', () => {
  it('goes up and back down in even 8ths, written in 4/4', () => {
    const run = scaleRun(C_MAJOR, { rhythm: 'even', hands: 'rh', key: C_KEY })
    expect(run.notes.map((n) => n.midi)).toEqual([
      60, 62, 64, 65, 67, 69, 71, 72, 71, 69, 67, 65, 64, 62, 60,
    ])
    expect(run.notes.map((n) => n.startTick).slice(0, 3)).toEqual([0, 6, 12])
    expect(run.meter).toBe('4/4')
    expect(run.bars).toEqual([
      { startTick: 0, beats: 4 },
      { startTick: 48, beats: 4 },
    ])
  })

  it('repeats the rhythm’s lengths, a triplet 8th four ticks', () => {
    const longShort = scaleRun(C_MAJOR, { rhythm: 'long-short', hands: 'rh', key: C_KEY })
    expect(longShort.notes.slice(0, 3).map((n) => n.startTick)).toEqual([0, 9, 12])
    const triplets = scaleRun(C_MAJOR, { rhythm: 'long-short-short-short', hands: 'rh', key: C_KEY })
    expect(triplets.notes.slice(0, 5).map((n) => n.durationTicks)).toEqual([12, 4, 4, 4, 12])
  })

  it('plays the left hand an octave lower, both hands together, each note with its hand’s finger', () => {
    const fingers: RunOptions['fingers'] = {
      rh: [1, 2, 3, 1, 2, 3, 4, 5],
      lh: [5, 4, 3, 2, 1, 3, 2, 1],
    }
    const both = scaleRun(C_MAJOR, { rhythm: 'even', hands: 'both', key: C_KEY, fingers })
    expect(both.notes.filter((n) => n.startTick === 0)).toMatchObject([
      { midi: 48, hand: 'lh', finger: 5 },
      { midi: 60, hand: 'rh', finger: 1 },
    ])
    // Coming down, a note keeps the finger it went up with.
    expect(both.notes.filter((n) => n.hand === 'rh').at(-2)).toMatchObject({ midi: 62, finger: 2 })
  })
})

describe('runSounds', () => {
  it('sounds each note at its tick, a little longer than written, softer with both hands', () => {
    const sounds = runSounds(scaleRun(C_MAJOR, { rhythm: 'even', hands: 'rh', key: C_KEY }), 60)
    expect(sounds[1]).toMatchObject({ kind: 'note', midi: 62, velocity: 0.2 })
    expect(sounds[1]?.at).toBeCloseTo(0.5)
    expect(sounds[1]?.duration).toBeCloseTo(0.55)
    const both = runSounds(scaleRun(C_MAJOR, { rhythm: 'even', hands: 'both', key: C_KEY }), 60)
    expect(both[0]?.velocity).toBe(0.16)
  })
})
```

  In `sounds.test.ts` replace the `scaleRun` describe with:

```ts
describe('walkSounds', () => {
  const triads = [
    [60, 64, 67],
    [62, 65, 69],
  ].map((chord) => chord.map(midi))

  it('strikes each chord for two beats', () => {
    const sounds = walkSounds(triads, { arpeggio: false, tempo: 60 })
    expect(sounds.map((s) => [s.midi, s.at])).toEqual([
      [60, 0],
      [64, 0],
      [67, 0],
      [62, 2],
      [65, 2],
      [69, 2],
    ])
  })

  it('rolls each chord upwards an 8th a note, giving a big chord the beats it needs', () => {
    const thirteenth = [[60, 64, 67, 71, 74, 77, 81].map(midi), triads[1] ?? []]
    const sounds = walkSounds(thirteenth, { arpeggio: true, tempo: 60 })
    expect(sounds.slice(0, 3).map((s) => s.at)).toEqual([0, 0.5, 1])
    // Seven notes an 8th apart take four beats before the next chord.
    expect(sounds[7]?.at).toBe(4)
  })
})
```

  and drop `scaleRun`, `PRACTICE_RHYTHMS` from its imports (add `walkSounds`, keep `PRACTICE_RHYTHMS` only if still
  used; its `long-short` assertion moves nowhere: `run.test.ts` covers the lengths).

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/shared/lib/schedule`
Expected: FAIL.

- [ ] **Step 3: Implement** — `run.ts`:

```ts
import {
  midi,
  TICKS_PER_BEAT,
  type Finger,
  type Hand,
  type Key,
  type PlacedTone,
} from '@/shared/lib/music'
import type { TimedMusic, TimedNote } from '@/shared/lib/notation'
import type { Hands, NoteSound } from './schedule'
import { PRACTICE_RHYTHMS, type PracticeRhythm } from './sounds'

const TICKS_PER_EIGHTH = TICKS_PER_BEAT / 2
const BAR_TICKS = 4 * TICKS_PER_BEAT
const OCTAVE: Readonly<Record<Hand, number>> = { rh: 0, lh: -12 }
const PLAYING: Readonly<Record<Hands, readonly Hand[]>> = { rh: ['rh'], lh: ['lh'], both: ['lh', 'rh'] }

export interface RunOptions {
  readonly rhythm: PracticeRhythm
  readonly hands: Hands
  /** The key it is written in. */
  readonly key: Key
  /** Each hand's fingers on the notes going up; coming down, each note keeps its finger. */
  readonly fingers?: Readonly<Record<Hand, readonly Finger[]>>
}

/**
 * A scale's notes up and back down in 8ths of a practice rhythm, for one hand or both (the left an
 * octave down), as timed music in 4/4: what the Scales reference plays and writes.
 */
export function scaleRun(notes: readonly PlacedTone[], options: RunOptions): TimedMusic {
  const lengths = PRACTICE_RHYTHMS[options.rhythm]
  const up = notes.map((_, index) => index)
  const upAndDown = [...up, ...up.slice(0, -1).reverse()]
  const played: TimedNote[] = []
  let tick = 0
  upAndDown.forEach((index, i) => {
    const length = Math.round((lengths[i % lengths.length] ?? 1) * TICKS_PER_EIGHTH)
    const placed = notes[index]
    if (placed) {
      for (const hand of PLAYING[options.hands]) {
        const finger = options.fingers?.[hand][index]
        played.push({
          midi: midi(placed.midi + OCTAVE[hand]),
          spelled: placed.tone.note,
          hand,
          startTick: tick,
          durationTicks: length,
          roll: 0,
          ...(finger === undefined ? {} : { finger }),
        })
      }
    }
    tick += length
  })
  return {
    key: options.key,
    meter: '4/4',
    bars: Array.from({ length: Math.ceil(tick / BAR_TICKS) }, (_, bar) => ({
      startTick: bar * BAR_TICKS,
      beats: 4,
    })),
    notes: played,
    chords: [],
  }
}

/** A run as it sounds at a tempo: each note a little longer than written, softer with both hands. */
export function runSounds(run: TimedMusic, tempo: number): NoteSound[] {
  const secondsPerTick = 60 / (tempo * TICKS_PER_BEAT)
  const together = new Set(run.notes.map((n) => n.hand)).size > 1
  return run.notes.map((n) => ({
    kind: 'note',
    midi: n.midi,
    at: n.startTick * secondsPerTick,
    duration: Math.max(0.25, n.durationTicks * secondsPerTick * 1.1),
    velocity: together ? 0.16 : 0.2,
  }))
}
```

  `sounds.ts`: delete `OCTAVES_BY_HANDS` and `scaleRun` (and the `Hands` import if unused); add:

```ts
/** A walk's chords: a struck one softer than a rolled one, each note released a little before the next chord. */
const WALKED = { struck: 0.16, rolled: 0.2, legato: 0.95 } as const

/**
 * Chords one after another, Walk the chords: struck together for two beats each, or rolled upwards
 * an 8th a note, each chord lasting two beats or as many as its notes need.
 */
export function walkSounds(
  chords: readonly (readonly Midi[])[],
  options: { readonly arpeggio: boolean; readonly tempo: number },
): NoteSound[] {
  const beat = 60 / options.tempo
  const sounds: NoteSound[] = []
  let at = 0
  for (const chord of chords) {
    const keys = [...chord].sort((a, b) => a - b)
    const length = (options.arpeggio ? Math.max(2, Math.ceil(keys.length / 2)) : 2) * beat
    keys.forEach((key, i) => {
      const offset = options.arpeggio ? (i * beat) / 2 : 0
      sounds.push({
        kind: 'note',
        midi: key,
        at: at + offset,
        duration: (length - offset) * WALKED.legato,
        velocity: options.arpeggio ? WALKED.rolled : WALKED.struck,
      })
    })
    at += length
  }
  return sounds
}
```

  `index.ts`: from `./sounds` drop `scaleRun`, add `walkSounds`; add
  `export { runSounds, scaleRun, type RunOptions } from './run'`.

- [ ] **Step 4: The Scales reference plays the run from ticks** — in `ScaleExplorer.tsx`:

```tsx
  const run = scaleRun(placed, {
    rhythm: scale.rhythm,
    hands: scale.hands,
    key: scaleKey(root, scale.kind),
    fingers: { rh, lh },
  })
```

  the Scale view's keyboard takes `keys={run.notes.map((n) => n.midi)}`, and `ScalePractice` takes
  `sounds={runSounds(run, scale.tempo)}` in place of `run` (its prop renamed `sounds: readonly NoteSound[]`).

- [ ] **Step 5: Run the tests**

Run: `npx vitest run src/shared/lib/schedule src/pages/scales`
Expected: PASS ("plays up and down, each key going down as it sounds" unchanged). `npm run typecheck && npm run lint`.

- [ ] **Step 6: Commit**

```bash
npx prettier --write src/shared/lib/schedule/run.ts src/shared/lib/schedule/run.test.ts src/shared/lib/schedule/sounds.ts src/shared/lib/schedule/sounds.test.ts src/shared/lib/schedule/index.ts src/widgets/scale-explorer/ui/ScaleExplorer.tsx src/widgets/scale-explorer/ui/ScalePractice.tsx
git add -A src/shared/lib/schedule src/widgets/scale-explorer
git commit -m "Write a scale's run in ticks, fingered, so it can be engraved as well as played; sound a walk of chords

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: The score, loaded when a staff is first shown

**Files:**
- Create: `src/shared/ui/LazyScoreView.tsx`, `src/shared/ui/LazyScoreView.test.tsx`, `src/shared/ui/score/size.ts`,
  `src/shared/ui/score/load.ts`
- Modify: `src/shared/ui/index.ts`, `src/shared/ui/score/engrave.ts`, `src/shared/ui/score/index.ts`,
  `src/shared/ui/score/ScoreView.tsx`, `src/app/testing/render-app.tsx`

**Interfaces:**
- Produces: `LazyScoreView(props of ScoreView)`;
  `loadScoreView(): Promise<typeof import('./score/ScoreView')>`; `SCORE_HEIGHT` from `shared/ui/score/size.ts`.

- [ ] **Step 1: Write the failing test** — `LazyScoreView.test.tsx`:

```tsx
import { render, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { note, placeScale } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { scaleRun } from '@/shared/lib/schedule'
import { LazyScoreView } from './LazyScoreView'

describe('LazyScoreView', () => {
  it('keeps the staff’s space while it loads, then engraves the score', async () => {
    const score = notate(
      scaleRun(placeScale(note('C'), 'major'), {
        rhythm: 'even',
        hands: 'rh',
        key: { tonic: note('C'), minor: false },
      }),
    )
    const { container } = render(<LazyScoreView score={score} scale={1} fingers={false} />)
    await waitFor(() =>
      expect(container.querySelector('[data-slot="score"] svg')).toBeInTheDocument(),
    )
  })
})
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/shared/ui/LazyScoreView.test.tsx`
Expected: FAIL (the module is missing).

- [ ] **Step 3: Implement** — `score/size.ts`:

```ts
/** The engraving's height in VexFlow units: the treble staff at 0 (lines 40–80), the bass at 90 (130–170). */
export const SCORE_HEIGHT = 210
```

  `engrave.ts` imports it (`import { SCORE_HEIGHT } from './size'`) in place of declaring it; `score/index.ts`
  exports `SCORE_HEIGHT` from `./size`; `ScoreView.tsx` imports it from `./size`.

  `score/load.ts`:

```ts
/** The score view's module, with VexFlow: loaded on its own, the first time a staff is shown. */
export const loadScoreView = () => import('./ScoreView')
```

  `LazyScoreView.tsx`:

```tsx
import { lazy, Suspense, type ComponentProps } from 'react'
import { loadScoreView } from './score/load'
import { SCORE_HEIGHT } from './score/size'

const ScoreView = lazy(() => loadScoreView().then((module) => ({ default: module.ScoreView })))

/**
 * A score engraved as the Player's is, its engraver (VexFlow) loaded only when a staff is first on
 * screen, so a page that shows one keeps it out of its own chunk: until then, the staff's space.
 */
export function LazyScoreView(props: ComponentProps<typeof ScoreView>) {
  return (
    <Suspense fallback={<div style={{ height: SCORE_HEIGHT * props.scale }} />}>
      <ScoreView {...props} />
    </Suspense>
  )
}
```

  `shared/ui/index.ts`: `export { LazyScoreView } from './LazyScoreView'`, `export { loadScoreView } from
  './score/load'`.

  `render-app.tsx`: before `render(...)`, `await loadScoreView()` (import from `@/shared/ui`), with its doc comment
  extended: "…and the score's engraver, so a test waits on the app and never on the runner importing a lazy chunk."

- [ ] **Step 4: Run the tests**

Run: `npx vitest run src/shared/ui src/pages/player`
Expected: PASS. `npm run typecheck && npm run lint`.

- [ ] **Step 5: Commit**

```bash
npx prettier --write src/shared/ui/LazyScoreView.tsx src/shared/ui/LazyScoreView.test.tsx src/shared/ui/score/size.ts src/shared/ui/score/load.ts src/shared/ui/score/engrave.ts src/shared/ui/score/index.ts src/shared/ui/score/ScoreView.tsx src/shared/ui/index.ts src/app/testing/render-app.tsx
git add -A src/shared/ui src/app/testing
git commit -m "Load the score's engraver the first time a staff is shown, off every chunk but its own

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Task 8: Scale view: Start on, two fingerings, and the run on a staff

**Files:**
- Create: `src/widgets/scale-explorer/model/scale-run.ts`, `src/widgets/scale-explorer/model/scale-run.test.ts`,
  `src/widgets/scale-explorer/ui/ScaleChoice.tsx`, `src/widgets/scale-explorer/ui/ScaleLayout.tsx`,
  `src/widgets/scale-explorer/ui/RunView.tsx`, `src/widgets/scale-explorer/ui/ChordsView.tsx`,
  `src/widgets/scale-explorer/ui/ScaleSheet.tsx`
- Modify: `src/widgets/scale-explorer/ui/ScaleExplorer.tsx` (now only picks the view),
  `src/widgets/scale-explorer/model/scale-view.ts`, `src/app/routes/search.ts`,
  `src/shared/i18n/locales/{en,ru}/learn.ts`
- Test: `src/app/routes/search.test.ts`, `src/pages/scales/ui/ScalesPage.test.tsx`

**Interfaces:**
- Consumes: `placeScale`, `runFingering`, `fingeringsOf`, `ownFingering`, `FINGERINGS` (Task 3), `scaleKey`
  (Task 2), `scaleRun`, `runSounds` (Task 6), `LazyScoreView` (Task 7).
- Produces: `ScaleView.start: number` (1-based), `ScaleView.fingering?: Fingering`; `scaleRunOf(view): ScaleRun`
  (`{ placed; fingering; own; fingerings; fingers; music }`); `ScaleLayout({ controls, keyboard, children })`,
  `ScaleChoice({ scale, onChange })`, `RunView` and `ChordsView({ scale, onChange, choice, facts })`.

- [ ] **Step 1: Write the failing tests** — `scale-run.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { note, noteParam } from '@/shared/lib/music'
import { scaleRunOf } from './scale-run'

const C = noteParam(note('C'))
const view = { root: C, kind: 'major', start: 1, rhythm: 'even', hands: 'rh' } as const

describe('scaleRunOf', () => {
  it('fingers a taught scale from its tonic as taught', () => {
    const run = scaleRunOf(view)
    expect(run.own).toBe('scale')
    expect(run.fingers.rh.join('')).toBe('12312345')
    expect(run.fingerings).toEqual(['thumb', 'scale'])
  })

  it('starts on any note, fingered from the thumb there unless the scale’s fingering is chosen', () => {
    const fromE = scaleRunOf({ ...view, start: 3 })
    expect(fromE.fingering).toBe('thumb')
    expect(fromE.placed[0]?.midi).toBe(64)
    expect(fromE.music.notes[0]?.midi).toBe(64)
    expect(scaleRunOf({ ...view, start: 3, fingering: 'scale' }).fingers.rh.join('')).toBe('31234123')
  })

  it('writes the run in its scale’s key, a mode in its parent’s', () => {
    expect(scaleRunOf({ ...view, root: noteParam(note('D')), kind: 'dorian' }).music.key).toEqual({
      tonic: note('C'),
      minor: false,
    })
  })
})
```

  `search.test.ts` gains:

```ts
  it('read the Scales start and a chosen fingering, dropping one the run cannot take or takes itself', async () => {
    expect(await searchAt('/learn/scales?start=3&fingering=scale')).toMatchObject({
      start: 3,
      fingering: 'scale',
    })
    expect(await searchAt('/learn/scales?start=9')).toMatchObject({ start: 1 })
    expect((await searchAt('/learn/scales?fingering=scale'))?.fingering).toBeUndefined()
    expect((await searchAt('/learn/scales?kind=blues&start=3&fingering=scale'))?.fingering).toBeUndefined()
  })
```

  `ScalesPage.test.tsx` gains (import `waitFor`):

```ts
  it('starts the run on any note, fingered from the thumb there', async () => {
    const user = userEvent.setup()
    const { router, audio } = await renderApp('/learn/scales?fingers=rh')
    await user.click(await screen.findByRole('combobox', { name: 'Start on' }))
    await user.click(await screen.findByRole('option', { name: /^E/ }))
    expect(router.state.location.search).toMatchObject({ start: 3 })
    const fingering = screen.getByRole('group', { name: 'Fingering' })
    expect(within(fingering).getByRole('button', { name: 'From the thumb' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(document.querySelector('[data-slot="finger-row"]')).toHaveTextContent('12312345')
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'E4' })).toHaveTextContent('3')
    await user.click(screen.getByRole('button', { name: 'Play up and down' }))
    expect(notes(audio.played.at(-1)?.sounds ?? [])[0]).toBe(64)
  })

  it('fingers the run as the scale fingers it', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/scales?start=3&fingers=rh')
    const fingering = await screen.findByRole('group', { name: 'Fingering' })
    await user.click(within(fingering).getByRole('button', { name: 'As the scale' }))
    expect(router.state.location.search).toMatchObject({ start: 3, fingering: 'scale' })
    expect(document.querySelector('[data-slot="finger-row"]')).toHaveTextContent('31234123')
  })

  it('offers the blues no choice of fingering: as taught from its tonic', async () => {
    await renderApp('/learn/scales?kind=blues&fingers=rh')
    await screen.findByRole('group', { name: 'Keyboard' })
    expect(screen.queryByRole('group', { name: 'Fingering' })).not.toBeInTheDocument()
    expect(document.querySelector('[data-slot="finger-row"]')).toHaveTextContent('1234123')
  })

  it('writes the run on a staff, the other hand’s staff muted', async () => {
    await renderApp('/learn/scales')
    const sheet = await screen.findByRole('region', { name: 'Sheet music' })
    await waitFor(() => expect(sheet.querySelector('[data-slot="score"] svg')).toBeInTheDocument())
    expect(sheet.querySelector('[data-slot="score"]')).toHaveAttribute('data-muted', 'bass')
  })
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/widgets/scale-explorer src/app/routes/search.test.ts src/pages/scales`
Expected: FAIL.

- [ ] **Step 3: The view and its URL** — `scale-view.ts` gains, after `show`:

```ts
  /** The degree the run starts on, 1 the tonic (Scale view). */
  readonly start: number
  /** How the run is fingered; absent, as its start is (`ownFingering`). */
  readonly fingering?: Fingering
```

  (import `type Fingering` from `@/shared/lib/music`). `search.ts`: import `FINGERINGS`, `fingeringsOf`,
  `ownFingering`, `scaleIntervals`, `type Fingering`; `SCALES_DEFAULTS` gains `start: 1`; and:

```ts
const isFingering = isOneOf(FINGERINGS)

/** A fingering the run may take and does not take by itself; else none, so the URL leaves it out. */
function chosenFingering(kind: ScaleKind, start: number, raw: unknown): Fingering | undefined {
  return isFingering(raw) && raw !== ownFingering(kind, start) && fingeringsOf(kind, start).includes(raw)
    ? raw
    : undefined
}
```

  and in `validateScalesSearch`:

```ts
  const start = wholeIn(raw.start, 1, scaleIntervals(kind).length, SCALES_DEFAULTS.start)
  return {
    root: root ? noteParam(scaleRootSpelling(pitchClassOf(root), kind)) : SCALES_DEFAULTS.root,
    kind,
    show: scaleHasChords(kind)
      ? valueOr(isScaleShow, raw.show, SCALES_DEFAULTS.show)
      : SCALES_DEFAULTS.show,
    start,
    fingering: chosenFingering(kind, start - 1, raw.fingering),
    fingers: valueOr(isScaleFingers, raw.fingers, SCALES_DEFAULTS.fingers),
    rhythm: valueOr(isOneOf(PRACTICE_RHYTHM_IDS), raw.rhythm, SCALES_DEFAULTS.rhythm),
    tempo: wholeIn(raw.tempo, TEMPO_RANGE.min, TEMPO_RANGE.max, SCALES_DEFAULTS.tempo),
    hands: valueOr(isHands, raw.hands, SCALES_DEFAULTS.hands),
    chords: valueOr(isScaleChords, raw.chords, SCALES_DEFAULTS.chords),
    keysPlay: valueOr(isKeysPlay, raw.keysPlay, SCALES_DEFAULTS.keysPlay),
    step: isScaleStep(raw.step) ? raw.step : undefined,
  }
```

- [ ] **Step 4: The run's model** — `scale-run.ts`:

```ts
import {
  fingeringsOf,
  noteFromParam,
  ownFingering,
  placeScale,
  runFingering,
  scaleKey,
  type Finger,
  type Fingering,
  type Hand,
  type PlacedTone,
} from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import { scaleRun } from '@/shared/lib/schedule'
import type { ScaleView } from './scale-view'

/** Scale view's run: its keys from the start note, how it is fingered, and the run as it plays and is written. */
export interface ScaleRun {
  readonly placed: readonly PlacedTone[]
  /** The fingering it takes, its start's own, and the ones it may take. */
  readonly fingering: Fingering
  readonly own: Fingering
  readonly fingerings: readonly Fingering[]
  readonly fingers: Readonly<Record<Hand, readonly Finger[]>>
  readonly music: TimedMusic
}

/** The run a Scale view shows: from its start note, fingered as chosen or as its start is. */
export function scaleRunOf(
  view: Pick<ScaleView, 'root' | 'kind' | 'start' | 'fingering' | 'rhythm' | 'hands'>,
): ScaleRun {
  const root = noteFromParam(view.root)
  const start = view.start - 1
  const placed = placeScale(root, view.kind, start)
  const keys = placed.map((key) => key.midi)
  const own = ownFingering(view.kind, start)
  const fingering = view.fingering ?? own
  const fingers = {
    rh: runFingering(root, view.kind, start, keys, 'rh', fingering),
    lh: runFingering(root, view.kind, start, keys, 'lh', fingering),
  }
  return {
    placed,
    fingering,
    own,
    fingerings: fingeringsOf(view.kind, start),
    fingers,
    music: scaleRun(placed, {
      rhythm: view.rhythm,
      hands: view.hands,
      key: scaleKey(root, view.kind),
      fingers,
    }),
  }
}
```

- [ ] **Step 5: The widget, split by view** — `ScaleLayout.tsx`:

```tsx
import type { ReactNode } from 'react'

/** The Scales reference's two columns from a laptop's width: the choices, then the content, the keyboard across both on top. */
export function ScaleLayout({
  controls,
  keyboard,
  children,
}: {
  controls: ReactNode
  keyboard: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
      <div className="flex flex-col gap-4">{controls}</div>
      {keyboard}
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  )
}
```

  `ScaleChoice.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { useScaleName } from '@/shared/i18n'
import {
  noteFromParam,
  noteName,
  noteParam,
  PITCH_CLASSES,
  SCALE_FAMILIES,
  scaleHasChords,
  scaleKindsIn,
  scaleRootSpelling,
} from '@/shared/lib/music'
import { Dropdown, Segmented } from '@/shared/ui'
import type { ScaleView } from '../model/scale-view'

const SHOW = ['scale', 'chords'] as const

/** Which scale: its name, its root and kind from pop-up buttons, and Scale · Chords where it has chords. */
export function ScaleChoice({
  scale,
  onChange,
}: {
  scale: ScaleView
  onChange: (change: Partial<ScaleView>) => void
}) {
  const { t } = useTranslation(['learn', 'music'])
  const scaleName = useScaleName()
  return (
    <>
      <h2 className="text-5xl">{scaleName(noteFromParam(scale.root), scale.kind)}</h2>
      <div className="flex flex-wrap gap-2">
        <Dropdown
          label={t('learn:root')}
          value={scale.root}
          options={PITCH_CLASSES.map((pc) => {
            const spelled = scaleRootSpelling(pc, scale.kind)
            return { value: noteParam(spelled), label: noteName(spelled) }
          })}
          onChange={(root) => onChange({ root })}
        />
        <Dropdown
          label={t('learn:scaleLabel')}
          value={scale.kind}
          groups={SCALE_FAMILIES.map((family) => ({
            label: t(`music:scaleFamily.${family}`),
            options: scaleKindsIn(family).map((kind) => ({
              value: kind,
              label: t(`music:scaleKind.${kind}`),
            })),
          }))}
          onChange={(kind) => onChange({ kind })}
        />
      </div>
      {scaleHasChords(scale.kind) ? (
        <Segmented
          label={t('learn:show.label')}
          value={scale.show}
          options={SHOW.map((value) => ({ value, label: t(`learn:show.${value}`) }))}
          onChange={(show) => onChange({ show })}
        />
      ) : null}
    </>
  )
}
```

  `ScaleSheet.tsx`:

```tsx
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { notate, type StaffId, type TimedMusic } from '@/shared/lib/notation'
import type { Hands } from '@/shared/lib/schedule'
import { LazyScoreView } from '@/shared/ui'

/** The staff of the hand not playing, soft as in the Player. */
const MUTED: Readonly<Record<Hands, StaffId | undefined>> = { both: undefined, rh: 'bass', lh: 'treble' }

/** The run on a grand staff as it plays, in its scale's key, with finger numbers while a hand's are shown. */
export function ScaleSheet({
  music,
  hands,
  fingers,
}: {
  music: TimedMusic
  hands: Hands
  fingers: boolean
}) {
  const { t } = useTranslation('music')
  const score = useMemo(() => notate(music), [music])
  return (
    <section
      aria-label={t('sheet.label')}
      className="-mx-4 overflow-x-auto overscroll-x-contain px-4 scrollbar-none lg:mx-0 lg:px-0"
    >
      <LazyScoreView score={score} scale={1} fingers={fingers} muted={MUTED[hands]} />
    </section>
  )
}
```

  `RunView.tsx`:

```tsx
import { useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { noteFromParam, noteName, spellScale } from '@/shared/lib/music'
import { runSounds } from '@/shared/lib/schedule'
import { Dropdown, Segmented } from '@/shared/ui'
import { scaleMarks } from '../model/scale-keys'
import { scaleRunOf } from '../model/scale-run'
import type { ScaleView } from '../model/scale-view'
import { FingeringTable } from './FingeringTable'
import { ScaleLayout } from './ScaleLayout'
import { ScalePractice } from './ScalePractice'
import { ScaleSheet } from './ScaleSheet'

/** The Fingers choice: none, or a hand's, with the name each has on screen. */
const FINGERS = [
  { value: 'none', label: 'learn:fingers.none' },
  { value: 'rh', label: 'common:hands.rh' },
  { value: 'lh', label: 'common:hands.lh' },
] as const

/**
 * Scale view: the run from its start note, its keys marked by degree with a hand's fingers, on the
 * staff, fingered from the thumb or as the scale, and practised.
 */
export function RunView({
  scale,
  onChange,
  choice,
  facts,
}: {
  scale: ScaleView
  onChange: (change: Partial<ScaleView>) => void
  /** Which scale: the reference's own choices, over this view's. */
  choice: ReactNode
  /** What the scale is made of, under this view's content. */
  facts: ReactNode
}) {
  const { t } = useTranslation(['learn', 'common'])
  const { root, kind, start, fingering, rhythm, hands } = scale
  const run = useMemo(
    () => scaleRunOf({ root, kind, start, fingering, rhythm, hands }),
    [root, kind, start, fingering, rhythm, hands],
  )
  const tones = spellScale(noteFromParam(root), kind)
  return (
    <ScaleLayout
      controls={
        <>
          {choice}
          <Dropdown
            label={t('learn:startOn')}
            value={start}
            options={tones.map((tone, i) => ({
              value: i + 1,
              label: noteName(tone.note),
              detail: tone.degree,
            }))}
            onChange={(next) => onChange({ start: next })}
          />
          {run.fingerings.length > 1 ? (
            <Segmented
              label={t('learn:fingering.label')}
              value={run.fingering}
              options={run.fingerings.map((value) => ({
                value,
                label: t(`learn:fingering.${value}`),
              }))}
              onChange={(value) => onChange({ fingering: value === run.own ? undefined : value })}
            />
          ) : null}
          <Segmented
            label={t('learn:fingers.label')}
            value={scale.fingers}
            options={FINGERS.map(({ value, label }) => ({ value, label: t(label) }))}
            onChange={(fingers) => onChange({ fingers })}
          />
        </>
      }
      keyboard={
        <ExplorerKeyboard
          keys={run.music.notes.map((n) => n.midi)}
          marks={scaleMarks(run.placed, scale.fingers === 'none' ? null : run.fingers[scale.fingers])}
          className="lg:order-first lg:col-span-2"
        />
      }
    >
      <ScaleSheet music={run.music} hands={hands} fingers={scale.fingers !== 'none'} />
      <FingeringTable
        notes={run.placed.map((key) => noteName(key.tone.note))}
        rh={run.fingers.rh}
        lh={run.fingers.lh}
      />
      <ScalePractice scale={scale} sounds={runSounds(run.music, scale.tempo)} onChange={onChange} />
      {facts}
    </ScaleLayout>
  )
}
```

  `ChordsView.tsx` takes the chords half of today's `ScaleExplorer` unchanged in behaviour (its controls: Chord size,
  Keys play; its keyboard; `KeyChords`), inside `ScaleLayout`, with the same `choice` and `facts` slots:

```tsx
import { useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { noteFromParam, placeScale, placeScaleChords, spellScale } from '@/shared/lib/music'
import { Segmented } from '@/shared/ui'
import { chordKeyPlays, chordMarks, chordsHolding, chordsRange } from '../model/scale-keys'
import type { ScaleView } from '../model/scale-view'
import { useHeardNote } from '../model/use-heard-note'
import { KeyChords } from './KeyChords'
import { ScaleLayout } from './ScaleLayout'

/** Triads or 7th chords, with the name each has on screen. */
const SIZES = [
  { value: 3, name: 'triads' },
  { value: 4, name: 'sevenths' },
] as const
const KEYS_PLAY = ['chords', 'notes'] as const

/** Chords view: each degree's chord on its key, played by it or lighting the chords that hold a note. */
export function ChordsView({
  scale,
  onChange,
  choice,
  facts,
}: {
  scale: ScaleView
  onChange: (change: Partial<ScaleView>) => void
  choice: ReactNode
  facts: ReactNode
}) {
  const { t } = useTranslation('learn')
  const { root, kind, chords: notes, keysPlay } = scale
  const listening = keysPlay === 'notes'
  const { note, hear } = useHeardNote(listening, [root, kind, notes, keysPlay].join(' '))
  const chords = useMemo(
    () => placeScaleChords(noteFromParam(root), kind, notes, 0),
    [root, kind, notes],
  )
  const keyPlays = useMemo(
    () => (listening ? undefined : chordKeyPlays(chords)),
    [listening, chords],
  )
  const holding = note === null ? [] : chordsHolding(chords, note)
  const tonic = noteFromParam(root)
  return (
    <ScaleLayout
      controls={
        <>
          {choice}
          <Segmented
            label={t('chordSize.label')}
            value={notes}
            options={SIZES.map(({ value, name }) => ({ value, label: t(`chordSize.${name}`) }))}
            onChange={(size) => onChange({ chords: size })}
          />
          {/* Its own label on screen: beside Scale · Chords, a bare "Chords · Notes" would read as the same choice. */}
          <div className="flex items-center gap-3">
            <span aria-hidden className="shrink-0 text-muted-foreground">
              {t('keysPlay.label')}
            </span>
            <Segmented
              label={t('keysPlay.label')}
              value={keysPlay}
              options={KEYS_PLAY.map((value) => ({ value, label: t(`keysPlay.${value}`) }))}
              onChange={(next) => onChange({ keysPlay: next })}
            />
          </div>
        </>
      }
      keyboard={
        <ExplorerKeyboard
          keys={placeScale(tonic, kind).map((key) => key.midi)}
          range={chordsRange(chords)}
          marks={chordMarks(chords)}
          keyPlays={keyPlays}
          outlined={new Set(holding.map((chord) => chord.key))}
          onKeyPress={listening ? hear : undefined}
          className="lg:order-first lg:col-span-2"
        />
      }
    >
      <KeyChords
        chords={chords}
        tones={spellScale(tonic, kind)}
        listening={listening}
        note={note}
        holding={holding}
      />
      {facts}
    </ScaleLayout>
  )
}
```

  `ScaleExplorer.tsx` in full:

```tsx
import { noteFromParam, spellScale } from '@/shared/lib/music'
import type { ScaleView } from '../model/scale-view'
import { ChordsView } from './ChordsView'
import { RunView } from './RunView'
import { ScaleChoice } from './ScaleChoice'
import { ScaleFacts } from './ScaleFacts'

/**
 * Any scale on any root. Scale view: its run from any note, fingered, on the keys and on the staff,
 * and practised. Chords view: each degree's chord on its key, played by it, and the chords that hold
 * a note. Both: what the scale is made of.
 */
export function ScaleExplorer({
  scale,
  onChange,
}: {
  scale: ScaleView
  onChange: (change: Partial<ScaleView>) => void
}) {
  const root = noteFromParam(scale.root)
  const choice = <ScaleChoice scale={scale} onChange={onChange} />
  const facts = <ScaleFacts root={root} kind={scale.kind} tones={spellScale(root, scale.kind)} />
  return scale.show === 'chords' ? (
    <ChordsView scale={scale} onChange={onChange} choice={choice} facts={facts} />
  ) : (
    <RunView scale={scale} onChange={onChange} choice={choice} facts={facts} />
  )
}
```

- [ ] **Step 6: The words** — `learn.ts`: en `startOn: 'Start on'`; `fingers: { label: 'Fingers', none: 'None' }`;
  `fingering: { label: 'Fingering', thumb: 'From the thumb', scale: 'As the scale', note: 'Note', rh: 'RH', lh:
  'LH' }`. ru `startOn: 'Начать с'`; `fingers: { label: 'Пальцы', none: 'Нет' }`; `fingering: { label:
  'Аппликатура', thumb: 'От первого пальца', scale: 'Как в гамме', note: 'Нота', rh: 'ПР', lh: 'ЛР' }`.

- [ ] **Step 7: Run the tests**

Run: `npx vitest run src/widgets/scale-explorer src/app/routes src/pages/scales`
Expected: PASS. `npm run typecheck && npm run lint`.

- [ ] **Step 8: Commit**

```bash
npx prettier --write src/widgets/scale-explorer src/app/routes/search.ts src/app/routes/search.test.ts src/pages/scales/ui/ScalesPage.test.tsx src/shared/i18n/locales/en/learn.ts src/shared/i18n/locales/ru/learn.ts
git add -A src/widgets/scale-explorer src/app/routes src/pages/scales src/shared/i18n
git commit -m "Start a scale on any note, fingered from the thumb or as the scale, and write its run on a staff

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Chords view: sizes to 13ths, inversions, and Walk the chords

**Files:**
- Create: `src/widgets/scale-explorer/ui/WalkCard.tsx`, `src/widgets/scale-explorer/ui/TempoSlider.tsx`,
  `src/widgets/scale-explorer/ui/PlayUpDown.tsx`
- Modify: `src/widgets/scale-explorer/ui/ChordsView.tsx`, `src/widgets/scale-explorer/ui/ScalePractice.tsx`,
  `src/widgets/scale-explorer/model/scale-view.ts`, `src/shared/lib/music/place.ts` (`walkChords`, which the Keys
  reference shares), `src/shared/lib/music/index.ts`, `src/app/routes/search.ts`,
  `src/shared/i18n/locales/{en,ru}/learn.ts`
- Test: `src/shared/lib/music/place.test.ts`, `src/app/routes/search.test.ts`,
  `src/pages/scales/ui/ScalesPage.test.tsx`

**Interfaces:**
- Consumes: `CHORD_NOTES`, `lastStackInversion`, `placeScaleChords` (Task 4), `walkSounds` (Task 6).
- Produces: `ScaleView.chords: ChordNotes`, `ScaleView.inversion: number`, `ScaleView.arpeggio: boolean`;
  `walkChords(chords: readonly PlacedScaleChord[]): PlacedScaleChord[]` (kernel, `place.ts`); `TempoSlider({ tempo, onChange })`,
  `PlayUpDown({ sounds })`.

- [ ] **Step 1: Write the failing tests** — `place.test.ts` gains (import `walkChords`, `rangeOf` from `./keyboard`):

```ts
describe('walkChords', () => {
  it('goes up the seven chords, the tonic’s an octave up, and back down', () => {
    const walk = walkChords(placeScaleChords(note('C'), 'major', 3, 0))
    expect(walk.map((placed) => placed.numeral)).toEqual([
      'I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°', 'I', 'vii°', 'vi', 'V', 'IV', 'iii', 'ii', 'I',
    ])
    expect(walk[7]?.tones.map((tone) => tone.midi)).toEqual([72, 76, 79])
    expect(rangeOf(walk.flatMap((chord) => chord.tones.map((tone) => tone.midi)))).toEqual({
      from: 60,
      to: 79,
    })
  })
})
```

  `search.test.ts` gains:

```ts
  it('read the Chords view’s size, inversion and walk, an inversion kept within the size', async () => {
    expect(
      await searchAt('/learn/scales?show=chords&chords=6&inversion=2&arpeggio=true'),
    ).toMatchObject({ chords: 6, inversion: 2, arpeggio: true })
    expect(await searchAt('/learn/scales?chords=3&inversion=3')).toMatchObject({ inversion: 0 })
    expect(await searchAt('/learn/scales?kind=blues&chords=6')).toMatchObject({ chords: 3 })
  })
```

  `ScalesPage.test.tsx`: in "forgets the note when the chords change", the 7ths are chosen from the pop-up:

```ts
    await user.click(screen.getByRole('combobox', { name: 'Chord size' }))
    await user.click(await screen.findByRole('option', { name: '7ths' }))
```

  and add:

```ts
  it('stacks the scale’s chords up to 13ths', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/scales?show=chords')
    await user.click(await screen.findByRole('combobox', { name: 'Chord size' }))
    await user.click(await screen.findByRole('option', { name: '13ths' }))
    expect(router.state.location.search).toMatchObject({ chords: 7 })
    expect(screen.getByRole('button', { name: /^FMaj13#11/ })).toBeInTheDocument()
  })

  it('shows the chords in an inversion over their bass, each numeral figured', async () => {
    await renderApp('/learn/scales?show=chords&inversion=1')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveTextContent('I⁶C/E')
    expect(screen.getByRole('button', { name: /^Dm\/F/ })).toBeInTheDocument()
  })

  it('keeps an inversion the smaller chords have when the size shrinks', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/scales?show=chords&chords=4&inversion=3')
    await user.click(await screen.findByRole('combobox', { name: 'Chord size' }))
    await user.click(await screen.findByRole('option', { name: 'Triads' }))
    expect(router.state.location.search).toMatchObject({ inversion: 2 })
    expect(router.state.location.search).not.toHaveProperty('chords')
  })

  it('walks the chords to the tonic’s octave and back, each on the keys as it sounds', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/learn/scales?show=chords&tempo=60')
    await user.click(await screen.findByRole('button', { name: 'Play up and down' }))
    const sounds = audio.played.at(-1)?.sounds ?? []
    expect(notes(sounds).slice(0, 3)).toEqual([60, 64, 67])
    expect(notes(sounds).slice(21, 24)).toEqual([72, 76, 79])
    act(() => audio.setNow((audio.played.at(-1)?.at ?? 0) + 2.1))
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'D4' })).toHaveAttribute('data-down')
  })
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/widgets/scale-explorer src/app/routes/search.test.ts src/pages/scales`
Expected: FAIL.

- [ ] **Step 3: The view and its URL** — `scale-view.ts`: `chords` becomes

```ts
  /** How many notes each chord stacks: 3 a triad … 7 a 13th (Chords view). */
  readonly chords: ChordNotes
  /** Root position (0) to the 3rd inversion, as far as the chords stack. */
  readonly inversion: number
```

  (after `chords`), and after `keysPlay`:

```ts
  /** Walk the chords rolled upwards rather than struck together. */
  readonly arpeggio: boolean
```

  `search.ts`: `SCALES_DEFAULTS` gains `inversion: 0, arpeggio: false`; `isScaleChords` becomes
  `const isChordNotes = isOneOf(CHORD_NOTES)`; in the validator:

```ts
  const chords = scaleHasChords(kind)
    ? valueOr(isChordNotes, raw.chords, SCALES_DEFAULTS.chords)
    : SCALES_DEFAULTS.chords
```

  and the returned object's `chords` is `chords`, followed by
  `inversion: wholeIn(raw.inversion, 0, lastStackInversion(chords), SCALES_DEFAULTS.inversion)`, and after `keysPlay`
  `arpeggio: raw.arpeggio === true`.

- [ ] **Step 4: The walk's chords** — in the kernel's `place.ts`, exported from `index.ts`:

```ts
/** Walk the chords: the seven up, the tonic's an octave up, and back down to the tonic. */
export function walkChords(chords: readonly PlacedScaleChord[]): PlacedScaleChord[] {
  const [tonic] = chords
  if (!tonic) return []
  const octave: PlacedScaleChord = {
    ...tonic,
    key: midi(tonic.key + 12),
    tones: tonic.tones.map((tone) => ({ ...tone, midi: midi(tone.midi + 12) })),
  }
  return [...chords, octave, ...[...chords].reverse()]
}
```

- [ ] **Step 5: The cards** — `TempoSlider.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { TEMPO_RANGE } from '@/shared/lib/schedule'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'

/** The practice tempo in BPM, on a slider named by its label. */
export function TempoSlider({
  tempo,
  onChange,
}: {
  tempo: number
  onChange: (tempo: number) => void
}) {
  const { t } = useTranslation('learn')
  return (
    <Slider
      min={TEMPO_RANGE.min}
      max={TEMPO_RANGE.max}
      step={4}
      value={tempo}
      onValueChange={onChange}
      className="flex flex-col gap-3"
    >
      <div className="flex justify-between">
        <SliderLabel>{t('tempo')}</SliderLabel>
        <span className="font-semibold tabular-nums">{t('bpm', { tempo })}</span>
      </div>
    </Slider>
  )
}
```

  `PlayUpDown.tsx`:

```tsx
import { Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Sound } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { Button } from '@/shared/ui/primitives/button'

/** Play up and down, its card's one action, turning into Stop while it sounds. */
export function PlayUpDown({ sounds }: { sounds: readonly Sound[] }) {
  const { t } = useTranslation(['learn', 'common'])
  const playback = usePlayback<'up-down'>()
  return (
    <Button size="pill" onClick={() => playback.toggle('up-down', sounds)}>
      {playback.playing === 'up-down' ? (
        <>
          <Square data-icon="inline-start" />
          {t('common:stop')}
        </>
      ) : (
        t('learn:playUpDown')
      )}
    </Button>
  )
}
```

  `ScalePractice.tsx` keeps its heading, rhythm pop-up and hands segmented, and takes `<TempoSlider
  tempo={scale.tempo} onChange={(tempo) => onChange({ tempo })} />` and `<PlayUpDown sounds={sounds} />` in place of
  its own slider and button (its `usePlayback`, `Button`, `Square`, `Slider` imports go).

  `WalkCard.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import type { PlacedScaleChord } from '@/shared/lib/music'
import { walkSounds } from '@/shared/lib/schedule'
import { Segmented } from '@/shared/ui'
import type { ScaleView } from '../model/scale-view'
import { PlayUpDown } from './PlayUpDown'
import { TempoSlider } from './TempoSlider'

/** Walk the chords: the seven up to the tonic's octave and back, struck or rolled at the tempo, each on the keys as it sounds. */
export function WalkCard({
  scale,
  walk,
  onChange,
}: {
  scale: ScaleView
  walk: readonly PlacedScaleChord[]
  onChange: (change: Partial<ScaleView>) => void
}) {
  const { t } = useTranslation('learn')
  const sounds = walkSounds(
    walk.map((placed) => placed.tones.map((tone) => tone.midi)),
    { arpeggio: scale.arpeggio, tempo: scale.tempo },
  )
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5">
      <h3 className="text-2xl">{t('walk.title')}</h3>
      <Segmented
        label={t('walk.played')}
        value={scale.arpeggio ? 'arpeggio' : 'block'}
        options={[
          { value: 'block', label: t('walk.block') },
          { value: 'arpeggio', label: t('arpeggio') },
        ]}
        onChange={(played) => onChange({ arpeggio: played === 'arpeggio' })}
      />
      <TempoSlider tempo={scale.tempo} onChange={(tempo) => onChange({ tempo })} />
      <PlayUpDown sounds={sounds} />
    </section>
  )
}
```

- [ ] **Step 6: The view** — `ChordsView.tsx` in full:

```tsx
import { useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import {
  CHORD_NOTES,
  lastStackInversion,
  noteFromParam,
  placeScale,
  placeScaleChords,
  spellScale,
  walkChords,
  type ChordNotes,
} from '@/shared/lib/music'
import { Dropdown, Segmented } from '@/shared/ui'
import { chordKeyPlays, chordMarks, chordsHolding, chordsRange } from '../model/scale-keys'
import type { ScaleView } from '../model/scale-view'
import { useHeardNote } from '../model/use-heard-note'
import { KeyChords } from './KeyChords'
import { ScaleLayout } from './ScaleLayout'
import { WalkCard } from './WalkCard'

/** Each size's name on screen, by how many notes it stacks. */
const SIZE_NAMES = {
  3: 'triads',
  4: 'sevenths',
  5: 'ninths',
  6: 'elevenths',
  7: 'thirteenths',
} as const satisfies Record<ChordNotes, string>
const INVERSION_NAMES = ['root', 'first', 'second', 'third'] as const
const KEYS_PLAY = ['chords', 'notes'] as const

/**
 * Chords view: each degree's chord on its key, in a size and an inversion, played by its key or
 * lighting the chords that hold a note; the chords to tap, and walked up and down.
 */
export function ChordsView({
  scale,
  onChange,
  choice,
  facts,
}: {
  scale: ScaleView
  onChange: (change: Partial<ScaleView>) => void
  choice: ReactNode
  facts: ReactNode
}) {
  const { t } = useTranslation(['learn', 'music'])
  const { root, kind, chords: notes, inversion, keysPlay } = scale
  const listening = keysPlay === 'notes'
  const { note, hear } = useHeardNote(listening, [root, kind, notes, inversion, keysPlay].join(' '))
  const chords = useMemo(
    () => placeScaleChords(noteFromParam(root), kind, notes, inversion),
    [root, kind, notes, inversion],
  )
  const walk = useMemo(() => walkChords(chords), [chords])
  const keyPlays = useMemo(
    () => (listening ? undefined : chordKeyPlays(chords)),
    [listening, chords],
  )
  const holding = note === null ? [] : chordsHolding(chords, note)
  const tonic = noteFromParam(root)
  return (
    <ScaleLayout
      controls={
        <>
          {choice}
          <Dropdown
            label={t('learn:chordSize.label')}
            value={notes}
            options={CHORD_NOTES.map((value) => ({
              value,
              label: t(`learn:chordSize.${SIZE_NAMES[value]}`),
            }))}
            onChange={(next) =>
              onChange({ chords: next, inversion: Math.min(inversion, lastStackInversion(next)) })
            }
          />
          <Segmented
            label={t('learn:inversionLabel')}
            value={inversion}
            options={INVERSION_NAMES.slice(0, lastStackInversion(notes) + 1).map((name, value) => ({
              value,
              label: t(`music:inversion.${name}`),
            }))}
            onChange={(next) => onChange({ inversion: next })}
          />
          {/* Its own label on screen: beside Scale · Chords, a bare "Chords · Notes" would read as the same choice. */}
          <div className="flex items-center gap-3">
            <span aria-hidden className="shrink-0 text-muted-foreground">
              {t('learn:keysPlay.label')}
            </span>
            <Segmented
              label={t('learn:keysPlay.label')}
              value={keysPlay}
              options={KEYS_PLAY.map((value) => ({ value, label: t(`learn:keysPlay.${value}`) }))}
              onChange={(next) => onChange({ keysPlay: next })}
            />
          </div>
        </>
      }
      keyboard={
        <ExplorerKeyboard
          keys={placeScale(tonic, kind).map((key) => key.midi)}
          range={chordsRange(walk)}
          marks={chordMarks(chords)}
          keyPlays={keyPlays}
          outlined={new Set(holding.map((chord) => chord.key))}
          onKeyPress={listening ? hear : undefined}
          className="lg:order-first lg:col-span-2"
        />
      }
    >
      <KeyChords
        chords={chords}
        tones={spellScale(tonic, kind)}
        listening={listening}
        note={note}
        holding={holding}
      />
      <WalkCard scale={scale} walk={walk} onChange={onChange} />
      {facts}
    </ScaleLayout>
  )
}
```

- [ ] **Step 7: The words** — `learn.ts` en: `chordSize: { label: 'Chord size', triads: 'Triads', sevenths: '7ths',
  ninths: '9ths', elevenths: '11ths', thirteenths: '13ths' }`, `walk: { title: 'Walk the chords', played: 'Played',
  block: 'Block' }`; ru: `chordSize: { label: 'Размер аккорда', triads: 'Трезвучия', sevenths: 'Септаккорды', ninths:
  'Нонаккорды', elevenths: 'Ундецимаккорды', thirteenths: 'Терцдецимаккорды' }`, `walk: { title: 'Аккорды по
  ступеням', played: 'Как играть', block: 'Аккордом' }`.

- [ ] **Step 8: Run the tests**

Run: `npx vitest run src/widgets/scale-explorer src/app/routes src/pages/scales`
Expected: PASS. `npm run typecheck && npm run lint`.

- [ ] **Step 9: Commit**

```bash
npx prettier --write src/widgets/scale-explorer src/shared/lib/music/place.ts src/shared/lib/music/place.test.ts src/shared/lib/music/index.ts src/app/routes/search.ts src/app/routes/search.test.ts src/pages/scales/ui/ScalesPage.test.tsx src/shared/i18n/locales/en/learn.ts src/shared/i18n/locales/ru/learn.ts
git add -A src/widgets/scale-explorer src/shared/lib/music src/app/routes src/pages/scales src/shared/i18n
git commit -m "Show a scale's chords up to 13ths in any inversion, figured, and walk them up and down

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Task 10: The key's common progressions as content

**Files:**
- Create: `src/entities/piece/content/progressions/cadence.ts`, `.../mcadence.ts`, `.../minorpop.ts`
- Modify: `src/entities/piece/content/progressions/index.ts`, `src/entities/piece/content/index.ts`,
  `src/entities/piece/model/selectors.ts`, `src/entities/piece/index.ts`, `src/entities/path/content/path.ts`
- Test: `src/entities/piece/content/catalog.test.ts`, `src/entities/piece/model/selectors.test.ts` (create if absent)

**Interfaces:**
- Produces: `COMMON_PROGRESSIONS: Readonly<Record<'major' | 'minor', readonly Piece[]>>` and `entriesInKey(key: Key):
  Entry[]` from `@/entities/piece`.

- [ ] **Step 1: Write the failing tests** — `catalog.test.ts`: the counts become 54 pieces, 13 progressions; add

```ts
  it('names the key’s common progressions, each a progression in its mode', () => {
    expect(COMMON_PROGRESSIONS.major.map((piece) => piece.title)).toEqual([
      'I–IV–V–I',
      'I–vi–IV–V',
      'ii–V–I',
      'I–V–vi–IV',
    ])
    expect(COMMON_PROGRESSIONS.minor.map((piece) => piece.title)).toEqual([
      'i–iv–V–i',
      'i–VI–III–VII',
      'iiø–V7♭9–i',
    ])
    for (const [mode, pieces] of Object.entries(COMMON_PROGRESSIONS)) {
      for (const piece of pieces) {
        expect(piece.kind).toBe('progression')
        expect(pieceKey(piece).minor).toBe(mode === 'minor')
      }
    }
  })

  it('leaves the Player’s own words free: no piece is called walk', () => {
    expect(pieceById('walk')).toBeUndefined()
  })
```

  (import `COMMON_PROGRESSIONS`). `selectors.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { entriesInKey } from './selectors'

describe('entriesInKey', () => {
  it('lists the songs, listings and studies written in a key, however their tonic is spelled', () => {
    const inG = entriesInKey({ tonic: note('G'), minor: false }).map((entry) => entry.id)
    expect(inG).toContain('bz5')
    expect(entriesInKey({ tonic: note('G'), minor: false }).every((e) => e.kind !== 'progression')).toBe(
      true,
    )
    expect(entriesInKey({ tonic: note('E', -1), minor: true })).toEqual([])
  })
})
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/entities/piece`
Expected: FAIL.

- [ ] **Step 3: The pieces** — `cadence.ts`:

```ts
import { definePiece } from '../../model/types'

export default definePiece({
  id: 'cadence',
  kind: 'progression',
  title: 'I–IV–V–I',
  key: 'C',
  meter: '4/4',
  tempo: 72,
  pattern: 'block',
  chordSize: { default: 'triads', choosable: true },
  progression: 'I:maj:4 IV:maj:4 V:dom:4 I:maj:4',
  note: {
    en: 'The authentic cadence: home, away to the subdominant and the dominant, and home.',
    ru: 'Полная каденция: тоника, субдоминанта, доминанта и снова тоника.',
  },
})
```

  `mcadence.ts`:

```ts
import { definePiece } from '../../model/types'

export default definePiece({
  id: 'mcadence',
  kind: 'progression',
  title: 'i–iv–V–i',
  key: 'Am',
  meter: '4/4',
  tempo: 72,
  pattern: 'block',
  chordSize: { default: 'triads', choosable: true },
  progression: 'i:min:4 iv:min:4 V:domb9:4 i:min:4',
  note: {
    en: 'The minor cadence: the dominant is major, from harmonic minor, and leads home.',
    ru: 'Минорная каденция: доминанта мажорная, из гармонического минора, и ведёт к тонике.',
  },
})
```

  `minorpop.ts`:

```ts
import { definePiece } from '../../model/types'

export default definePiece({
  id: 'minorpop',
  kind: 'progression',
  title: 'i–VI–III–VII',
  key: 'Am',
  meter: '4/4',
  tempo: 72,
  pattern: 'pop8',
  chordSize: { default: 'triads', choosable: true },
  progression: 'i:min:4 bVI:maj:4 bIII:maj:4 bVII:dom:4',
  note: {
    en: 'The minor-key loop of pop and rock ballads.',
    ru: 'Минорный круг поп- и рок-баллад.',
  },
})
```

  `progressions/index.ts`: import the three; `entries: [flow, pop, twofive, cadence, minor251, mcadence, minorpop,
  res1, res2, res3, blues, stacks, romashki]`, and

```ts
/** The key's common progressions (roadmap §3.8), a major key's and a minor key's, opened in the Player in any key. */
export const COMMON_PROGRESSIONS: Readonly<Record<'major' | 'minor', readonly Piece[]>> = {
  major: [cadence, flow, twofive, pop],
  minor: [mcadence, minorpop, minor251],
}
```

  (`import type { Collection, Piece } from '../../model/types'`). `content/index.ts`:
  `export { COMMON_PROGRESSIONS } from './progressions'`. `selectors.ts`:

```ts
/** The songs, listings and studies written in a key, in catalog order (a progression is practised in any key). */
export function entriesInKey(key: Key): Entry[] {
  const tonic = pitchClassOf(key.tonic)
  return [...ENTRY_BY_ID.values()].filter((entry) => {
    const own = pieceKey(entry)
    return (
      entry.kind !== 'progression' && own.minor === key.minor && pitchClassOf(own.tonic) === tonic
    )
  })
}
```

  (imports: `pitchClassOf, type Key` from `@/shared/lib/music`, `pieceKey` from `./types`). `entities/piece/index.ts`
  exports `entriesInKey` and `COMMON_PROGRESSIONS`. `path.ts`'s progressions group becomes
  `'flow', 'pop', 'twofive', 'cadence', 'minor251', 'mcadence', 'minorpop', 'res1', 'res2', 'res3', 'blues', 'stacks',
  'romashki'`.

- [ ] **Step 4: Run the tests**

Run: `npx vitest run src/entities src/pages/practice`
Expected: PASS (every new piece arranges in 12 keys with every accompaniment). `npm run typecheck && npm run lint`.

- [ ] **Step 5: Commit**

```bash
npx prettier --write src/entities/piece src/entities/path/content/path.ts
git add -A src/entities/piece src/entities/path
git commit -m "Add I–IV–V–I, i–iv–V–i and i–VI–III–VII, and name a key's common progressions

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: One Player screen, and a Setup sheet composed by its page

**Files:**
- Create: `src/pages/player/ui/PlayerLayout.tsx`, `src/pages/player/ui/PieceSetup.tsx`,
  `src/widgets/player-setup/ui/setup-context.ts`, `src/widgets/player-setup/ui/FigureRows.tsx`,
  `src/widgets/player-setup/ui/ChordSizeField.tsx`, `src/widgets/player-setup/ui/MelodySwitch.tsx`
- Delete: `src/widgets/player-setup/ui/SetupMain.tsx`
- Modify: `src/pages/player/ui/PlayerPage.tsx`, `src/widgets/player-setup/ui/PlayerSetup.tsx`,
  `src/widgets/player-setup/model/setup-params.ts`, `src/widgets/player-setup/index.ts`
- Test: `src/widgets/player-setup/ui/PlayerSetup.test.tsx` (rewrite), `src/pages/player/ui/PlayerPage.test.tsx`

**Interfaces:**
- Produces: `PlayerSetup({ open, onOpenChange, figures: FigureChoice, methods: boolean, melody: boolean, onFigures:
  (change: FigureChange) => void, children })`, `FigureRows()`, `ChordSizeField({ value, onChange })`,
  `MelodySwitch()`; `type FigureChoice = { pattern: PatternId | 'chart'; rh: RightFigureId | null; lh: LeftFigureId |
  null }`, `type FigureChange = Pick<SetupChange, 'pattern' | 'rh' | 'lh'>`; in `pages/player`:
  `PlayerLayout({ title, onClose, view, player, performance, headings, onSetup })`.

- [ ] **Step 1: Write the failing tests** — `PlayerSetup.test.tsx` in full:

```tsx
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { PATTERNS } from '@/entities/pattern'
import { FigureRows } from './FigureRows'
import { MelodySwitch } from './MelodySwitch'
import { PlayerSetup } from './PlayerSetup'

function renderSetup({ methods = false, melody = false } = {}) {
  const onFigures = vi.fn()
  const view = renderWithSettings(
    <PlayerSetup
      open
      onOpenChange={() => {}}
      figures={{ pattern: 'block', rh: null, lh: null }}
      methods={methods}
      melody={melody}
      onFigures={onFigures}
    >
      <p>The source’s own choices</p>
      <FigureRows />
      <MelodySwitch />
    </PlayerSetup>,
  )
  return { onFigures, ...view }
}

describe('PlayerSetup', () => {
  it('shows the page’s own choices on its first page, with the figure rows', () => {
    renderSetup()
    expect(screen.getByText('The source’s own choices')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Pattern.*Whole notes/ })).toBeInTheDocument()
  })

  it('chooses a pattern from its group, keeping melody patterns from a source without a tune', async () => {
    const user = userEvent.setup()
    const { onFigures } = renderSetup()
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(screen.getByRole('button', { name: new RegExp(PATTERNS.r5.name.en) })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: new RegExp(PATTERNS.ballad.name.en) }))
    expect(onFigures).toHaveBeenCalledWith({ pattern: 'ballad' })
  })

  it('offers From the chart only where the chart names its methods', async () => {
    const user = userEvent.setup()
    renderSetup({ methods: true })
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(screen.getByRole('button', { name: /From the chart/ })).toBeInTheDocument()
  })

  it('goes back to the pattern’s own figure', async () => {
    const user = userEvent.setup()
    const { onFigures } = renderSetup()
    await user.click(screen.getByRole('button', { name: /^Right hand.*own/ }))
    await user.click(screen.getByRole('button', { name: /The pattern’s own/ }))
    expect(onFigures).toHaveBeenCalledWith({ rh: undefined })
  })

  it('saves the melody switch in settings', async () => {
    const user = userEvent.setup()
    const { settingsStore } = renderSetup({ melody: true })
    await user.click(screen.getByRole('switch', { name: 'Melody' }))
    expect(settingsStore.getState().practice.melody).toBe(true)
  })
})
```

  `PlayerPage.test.tsx` gains (import `melodyOf, PIECES` from `@/entities/piece`):

```ts
  it('names the key on the Setup’s pop-up, and shows Melody only for a piece with a tune', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    expect(await screen.findByRole('combobox', { name: 'Key' })).toHaveTextContent('G major')
    expect(screen.queryByRole('switch', { name: 'Melody' })).not.toBeInTheDocument()
  })

  it('shows Melody in the Setup of a piece with a tune', async () => {
    const withTune = PIECES.find((piece) => melodyOf(piece) !== undefined)
    if (!withTune) throw new Error('no piece has a tune')
    const user = userEvent.setup()
    await renderApp(`/play/${withTune.id}`)
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    expect(await screen.findByRole('switch', { name: 'Melody' })).toBeInTheDocument()
  })
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/widgets/player-setup src/pages/player`
Expected: FAIL (`FigureRows`, `MelodySwitch` missing).

- [ ] **Step 3: The widget** — `setup-params.ts` gains:

```ts
/** A Player's pattern and hands' figures: the choices every source offers. */
export interface FigureChoice {
  readonly pattern: PatternId | 'chart'
  readonly rh: RightFigureId | null
  readonly lh: LeftFigureId | null
}

/** What a figure row changes; a hand's `undefined` goes back to the pattern's own. */
export type FigureChange = Pick<SetupChange, 'pattern' | 'rh' | 'lh'>
```

  `setup-context.ts`:

```ts
import { createContext, use } from 'react'
import type { FigureChoice } from '../model/setup-params'

/** The sheet's lists that open as its pages. */
export type SetupPage = 'pattern' | 'rh' | 'lh'

interface SetupContextValue {
  readonly figures: FigureChoice
  openPage(page: SetupPage): void
}

export const SetupContext = createContext<SetupContextValue | null>(null)

/** The Setup sheet's figures and pages, for a row on its first page. */
export function useSetup(): SetupContextValue {
  const setup = use(SetupContext)
  if (!setup) throw new Error('A Setup row is used inside PlayerSetup')
  return setup
}
```

  `PlayerSetup.tsx`:

```tsx
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LEFT_FIGURE_IDS,
  LEFT_FIGURES,
  needsMelody,
  PATTERN_GROUP_NAMES,
  PATTERN_GROUPS,
  PATTERNS,
  patternsIn,
  RIGHT_FIGURE_IDS,
  RIGHT_FIGURES,
  type PatternId,
} from '@/entities/pattern'
import { localText, useLocale } from '@/shared/i18n'
import { Sheet, SheetContent } from '@/shared/ui'
import type { FigureChange, FigureChoice } from '../model/setup-params'
import { ChoiceList } from './ChoiceList'
import { FigurePage } from './FigurePage'
import { ListPage } from './ListPage'
import { SetupContext, type SetupPage } from './setup-context'

/**
 * The Player's Setup sheet. Its first page is `children`, composed by the page: the source's own
 * choices, `FigureRows`, how it plays. The pattern and figure lists open as the sheet's pages, so a
 * sheet never opens over a sheet.
 */
export function PlayerSetup({
  open,
  onOpenChange,
  figures,
  methods,
  melody,
  onFigures,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  figures: FigureChoice
  /** The chart names its own methods: the pattern list offers "From the chart". */
  methods: boolean
  /** There is a tune for a figure that plays it. */
  melody: boolean
  onFigures: (change: FigureChange) => void
  children: ReactNode
}) {
  const { t } = useTranslation('player')
  const locale = useLocale()
  const [page, setPage] = useState<SetupPage | 'main'>('main')
  const noMelody = melody ? undefined : t('needsMelody')
  const choose = (change: FigureChange) => {
    onFigures(change)
    setPage('main')
  }
  const toMain = () => setPage('main')
  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) setPage('main')
      }}
    >
      <SheetContent title={page === 'main' ? t('setup') : t(page)}>
        {page === 'main' ? (
          <SetupContext value={{ figures, openPage: setPage }}>
            <div className="flex flex-col gap-5">{children}</div>
          </SetupContext>
        ) : null}
        {page === 'pattern' ? (
          <ListPage onBack={toMain}>
            {methods ? (
              <ChoiceList<PatternId | 'chart'>
                items={[
                  { value: 'chart', label: t('fromChart'), description: t('fromChartDescription') },
                ]}
                value={figures.pattern}
                onChoose={() => choose({ pattern: 'chart' })}
              />
            ) : null}
            {PATTERN_GROUPS.map((group) => (
              <section key={group} className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {localText(PATTERN_GROUP_NAMES[group], locale)}
                </h3>
                <ChoiceList<PatternId | 'chart'>
                  items={patternsIn(group).map((id) => {
                    const { name, description } = PATTERNS[id]
                    return {
                      value: id,
                      label: localText(name, locale),
                      ...(description ? { description: localText(description, locale) } : {}),
                      ...(needsMelody(id) && noMelody ? { disabledNote: noMelody } : {}),
                    }
                  })}
                  value={figures.pattern}
                  onChoose={(pattern) => choose({ pattern })}
                />
              </section>
            ))}
          </ListPage>
        ) : null}
        {page === 'rh' ? (
          <FigurePage
            ids={RIGHT_FIGURE_IDS}
            figures={RIGHT_FIGURES}
            value={figures.rh}
            noMelody={noMelody}
            onChoose={(rh) => choose({ rh })}
            onBack={toMain}
          />
        ) : null}
        {page === 'lh' ? (
          <FigurePage
            ids={LEFT_FIGURE_IDS}
            figures={LEFT_FIGURES}
            value={figures.lh}
            noMelody={noMelody}
            onChoose={(lh) => choose({ lh })}
            onBack={toMain}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
```

  `FigureRows.tsx`:

```tsx
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LEFT_FIGURES, PATTERNS, RIGHT_FIGURES } from '@/entities/pattern'
import { localText, useLocale } from '@/shared/i18n'
import { useSetup } from './setup-context'

/** A row on the sheet's first page that opens one of its lists. */
function SetupRow({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-14 w-full items-center gap-3 border-b border-border text-left transition-colors duration-200 ease-out outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset"
    >
      <span className="flex-1 text-lg">{label}</span>
      <span className="truncate text-muted-foreground">{value}</span>
      <ChevronRight aria-hidden className="size-5 text-muted-foreground" />
    </button>
  )
}

/** The pattern and each hand's figure, each opening its list as a page of the Setup sheet. */
export function FigureRows() {
  const { t } = useTranslation('player')
  const locale = useLocale()
  const { figures, openPage } = useSetup()
  return (
    <div>
      <SetupRow
        label={t('pattern')}
        value={
          figures.pattern === 'chart'
            ? t('fromChart')
            : localText(PATTERNS[figures.pattern].name, locale)
        }
        onClick={() => openPage('pattern')}
      />
      <SetupRow
        label={t('rh')}
        value={figures.rh ? localText(RIGHT_FIGURES[figures.rh].name, locale) : t('ownFigure')}
        onClick={() => openPage('rh')}
      />
      <SetupRow
        label={t('lh')}
        value={figures.lh ? localText(LEFT_FIGURES[figures.lh].name, locale) : t('ownFigure')}
        onClick={() => openPage('lh')}
      />
    </div>
  )
}
```

  `ChordSizeField.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { CHORD_SIZES, type ChordSize } from '@/entities/piece'
import { Segmented } from '@/shared/ui'

/** How much of each chord a progression plays: Triads · 7ths · 9ths. */
export function ChordSizeField({
  value,
  onChange,
}: {
  value: ChordSize
  onChange: (size: ChordSize) => void
}) {
  const { t } = useTranslation('player')
  return (
    <Segmented
      label={t('chordSize')}
      value={value}
      options={CHORD_SIZES.map((size) => ({ value: size, label: t(`chordSizes.${size}`) }))}
      onChange={onChange}
    />
  )
}
```

  `MelodySwitch.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { selectPractice, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setPracticeToggle } from '@/features/set-preference'
import { Switch } from '@/shared/ui/primitives/switch'

/** The melody switch: a piece's tune an octave up as well, saved for every piece with one. */
export function MelodySwitch() {
  const { t } = useTranslation('player')
  const settings = useSettingsStoreApi()
  const { melody } = useSettings(selectPractice)
  return (
    <label className="flex min-h-14 items-center justify-between border-b border-border text-lg">
      {t('toggles.melody')}
      <Switch checked={melody} onCheckedChange={(on) => setPracticeToggle(settings, 'melody', on)} />
    </label>
  )
}
```

  `index.ts`:

```ts
export type { FigureChange, FigureChoice, SetupChange, SetupParams } from './model/setup-params'
export { ChordSizeField } from './ui/ChordSizeField'
export { FigureRows } from './ui/FigureRows'
export { MelodySwitch } from './ui/MelodySwitch'
export { PlayerSetup } from './ui/PlayerSetup'
```

  Delete `SetupMain.tsx`.

- [ ] **Step 4: The page** — `PlayerLayout.tsx` (the screen today's `Player` renders, over any source):

```tsx
import { SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MidiButton } from '@/features/connect-midi'
import { LiveKeyboard } from '@/features/live-keyboard'
import type { Performance } from '@/shared/lib/arrangement'
import { RoundButton } from '@/shared/ui'
import {
  HandsButton,
  LoopButton,
  PlayerArea,
  PlayerScreen,
  PlayerTitle,
  PlayerTransport,
  TempoButton,
  WaitLine,
  type PracticePlayer,
  type PracticeView,
} from '@/widgets/practice-player'
import { SheetMusic } from '@/widgets/sheet-music'

/**
 * The Player's screen over any Performance (Flowkey's shape): the toolbar with the tempo, hands, loop,
 * MIDI and Setup, the keys, the sheet music, Wait mode's line and the transport.
 */
export function PlayerLayout({
  title,
  onClose,
  view,
  player,
  performance,
  headings,
  onSetup,
}: {
  title: string
  onClose: () => void
  view: PracticeView
  player: PracticePlayer
  performance: Performance
  /** Each section's name, by section: shown at its first bar. */
  headings: readonly string[]
  onSetup: () => void
}) {
  const { t } = useTranslation('player')
  const { practice } = player
  return (
    <PlayerScreen>
      <PlayerArea area="lead">
        <PlayerTitle title={title} onClose={onClose} />
      </PlayerArea>
      <PlayerArea area="tempo" className="flex items-center">
        <TempoButton
          mode={view.mode}
          tempo={player.tempo}
          shownTempo={player.shownTempo}
          ownTempo={player.ownTempo}
          speedTraining={view.speedTraining}
          onWait={() => player.setMode('wait')}
          onTempo={player.listenAt}
          onSpeedTraining={player.setSpeedTraining}
        />
      </PlayerArea>
      <PlayerArea area="hands" className="flex items-center justify-end">
        <HandsButton hands={view.hands} onChange={player.setHands} />
      </PlayerArea>
      <PlayerArea area="actions" className="flex items-center justify-end gap-2">
        <LoopButton looped={player.loop !== null} onToggle={player.toggleLoop} />
        <MidiButton />
        <RoundButton label={t('setup')} icon={SlidersHorizontal} onClick={onSetup} />
      </PlayerArea>
      <PlayerArea area="keys" className="flex">
        <LiveKeyboard
          range={player.range}
          inView={player.inView}
          marks={player.marks}
          wrong={player.wrong}
          onKeyPress={player.tapKey}
          height="fill"
          className="min-h-0 flex-1"
        />
      </PlayerArea>
      <PlayerArea area="sheet">
        <SheetMusic
          performance={performance}
          headings={headings}
          current={practice.state.beatGroup}
          loop={player.loop}
          fingers={player.fingers}
          muted={player.muted}
          onJump={practice.jumpToBeatGroup}
          onLoopChange={player.setLoop}
        />
      </PlayerArea>
      <PlayerArea area="status" className="landscape-phone:self-end">
        {view.mode === 'wait' ? (
          <WaitLine feedback={player.feedback} onAgain={practice.play} />
        ) : null}
      </PlayerArea>
      <PlayerArea area="transport">
        <PlayerTransport practice={practice} />
      </PlayerArea>
    </PlayerScreen>
  )
}
```

  (`PracticePlayer` and `PracticeView` are exported types of `widgets/practice-player` already.)

  `PieceSetup.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { hasMethodCodes, melodyOf, pieceKey, type Piece } from '@/entities/piece'
import type { PracticeChoice } from '@/features/practice'
import { noteName, noteParam, PITCH_CLASSES, tonicSpelling } from '@/shared/lib/music'
import { Dropdown } from '@/shared/ui'
import {
  ChordSizeField,
  FigureRows,
  MelodySwitch,
  PlayerSetup,
  type SetupChange,
} from '@/widgets/player-setup'
import { PlayingFields } from '@/widgets/practice-player'

/** A piece's Setup: its key, the pattern and figures, its chord size and melody where it has them, and how it plays. */
export function PieceSetup({
  open,
  onOpenChange,
  piece,
  choice,
  swing,
  onChange,
  onSwing,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  piece: Piece
  choice: PracticeChoice
  /** Null where the meter cannot swing. */
  swing: boolean | null
  onChange: (change: SetupChange) => void
  onSwing: (on: boolean) => void
}) {
  const { t } = useTranslation('player')
  const { minor } = pieceKey(piece)
  const hasMelody = melodyOf(piece) !== undefined
  return (
    <PlayerSetup
      open={open}
      onOpenChange={onOpenChange}
      figures={choice}
      methods={hasMethodCodes(piece)}
      melody={hasMelody}
      onFigures={onChange}
    >
      <Dropdown
        label={t('key')}
        value={noteParam(choice.tonic)}
        options={PITCH_CLASSES.map((pc) => {
          const tonic = tonicSpelling(pc, minor)
          return {
            value: noteParam(tonic),
            label: t(minor ? 'keyOf.minor' : 'keyOf.major', { tonic: noteName(tonic) }),
          }
        })}
        onChange={(key) => onChange({ key })}
      />
      <FigureRows />
      {piece.kind === 'progression' && piece.chordSize.choosable ? (
        <ChordSizeField
          value={choice.chordSize ?? piece.chordSize.default}
          onChange={(chordSize) => onChange({ chordSize })}
        />
      ) : null}
      {hasMelody ? <MelodySwitch /> : null}
      <PlayingFields swing={swing} onSwing={onSwing} />
    </PlayerSetup>
  )
}
```

  `PlayerPage.tsx`:

```tsx
import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { entryTitles, pieceById, usePieceHeadings, type Piece } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { isCompound } from '@/shared/lib/music'
import { useClose } from '../model/use-close'
import { usePlayer } from '../model/use-player'
import { PieceSetup } from './PieceSetup'
import { PlayerLayout } from './PlayerLayout'

function PiecePlayer({ piece }: { piece: Piece }) {
  const locale = useLocale()
  const search = useSearch({ from: '/full-screen/play/$pieceId' })
  const navigate = useNavigate({ from: '/play/$pieceId' })
  const [setupOpen, setSetupOpen] = useState(false)
  const close = useClose(piece)
  const headings = usePieceHeadings(piece)
  const { choice, performance, player, changeSetup } = usePlayer(
    piece,
    search,
    (patch) => void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true }),
  )
  return (
    <>
      <PlayerLayout
        title={entryTitles(piece, locale).primary}
        onClose={close}
        view={search}
        player={player}
        performance={performance}
        headings={headings}
        onSetup={() => setSetupOpen(true)}
      />
      <PieceSetup
        open={setupOpen}
        onOpenChange={setSetupOpen}
        piece={piece}
        choice={choice}
        swing={isCompound(piece.meter) ? null : search.swing}
        onChange={changeSetup}
        onSwing={player.setSwing}
      />
    </>
  )
}

/** A piece in the Player: the route's piece, its choices from the URL. */
export function PlayerPage() {
  const { pieceId } = useParams({ from: '/full-screen/play/$pieceId' })
  const piece = pieceById(pieceId)
  return piece ? <PiecePlayer key={piece.id} piece={piece} /> : null
}
```

- [ ] **Step 5: Run the tests**

Run: `npx vitest run src/widgets/player-setup src/pages/player`
Expected: PASS (every earlier Player test too). `npm run typecheck && npm run lint`.

- [ ] **Step 6: Commit**

```bash
git rm -q src/widgets/player-setup/ui/SetupMain.tsx
npx prettier --write src/widgets/player-setup src/pages/player
git add -A src/widgets/player-setup src/pages/player
git commit -m "Compose the Setup sheet from its page's parts, and give the Player one screen over any source

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Walk the chords in the Player

**Files:**
- Create: `src/features/practice/walk.ts`, `src/features/practice/walk.test.ts`,
  `src/pages/player/model/walk-search.ts`, `src/pages/player/model/walk-search.test.ts`,
  `src/pages/player/model/use-walk-player.ts`, `src/pages/player/ui/WalkPlayerPage.tsx`,
  `src/pages/player/ui/WalkSetup.tsx`, `src/pages/player/ui/WalkPlayerPage.test.tsx`
- Modify: `src/features/practice/index.ts`, `src/pages/player/index.ts`, `src/app/routes/search.ts`,
  `src/app/routes/player-screens.ts`, `src/app/router.tsx`, `src/shared/i18n/locales/{en,ru}/player.ts`
- Test: `src/app/router.test.tsx`, `src/app/routes/search.test.ts`

**Interfaces:**
- Consumes: `scaleChordAt`, `scaleKey`, `scaleHasChords`, `scaleRootSpelling` (kernel), `PlayerSetup`,
  `FigureRows`, `ChordSizeField` (Task 11), `PlayerLayout` (Task 11), `usePracticePlayer`.
- Produces: `WALK = { tempo: 72, pattern: 'block', chordSize: 'triads' }`, `walkChart(root, kind, chordSize): Chart`,
  `arrangeWalk(choice: WalkChoice): Performance`, `interface WalkChoice { root; kind; pattern: PatternId; rh; lh;
  chordSize }` from `@/features/practice`; `type WalkSearch`, `walkChoice(search)`, `walkPatch(change)` in
  `pages/player/model/walk-search.ts`; `WALK_DEFAULTS`, `validateWalkSearch` in `app/routes/search.ts`; the route
  `/play/walk` (`/full-screen/play/walk`).

- [ ] **Step 1: Write the failing tests** — `walk.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { chordSymbol, note } from '@/shared/lib/music'
import { arrangeWalk, walkChart, WALK } from './walk'

const symbols = (chart: ReturnType<typeof walkChart>) =>
  chart.sections.flatMap((section) =>
    section.lines.flatMap((line) => line.flatMap((bar) => bar.chords.map(chordSymbol))),
  )

describe('walkChart', () => {
  it('walks a scale’s chords up to the tonic’s octave and back, a bar each, four bars a line', () => {
    const chart = walkChart(note('C'), 'major', 'triads')
    expect(symbols(chart)).toEqual([
      'C', 'Dm', 'Em', 'F', 'G', 'Am', 'B°', 'C', 'B°', 'Am', 'G', 'F', 'Em', 'Dm', 'C',
    ])
    expect(chart.sections[0]?.lines.map((line) => line.length)).toEqual([4, 4, 4, 3])
    expect(chart.meter).toBe('4/4')
  })

  it('grows each chord to its 9th only where the 9th is available', () => {
    expect(symbols(walkChart(note('C'), 'major', 'ninths')).slice(0, 7)).toEqual([
      'CMaj9', 'Dm9', 'Em7', 'FMaj9', 'G9', 'Am9', 'Bm7♭5',
    ])
  })

  it('writes a mode in its parent’s key', () => {
    expect(walkChart(note('D'), 'dorian', 'sevenths').key).toEqual({ tonic: note('C'), minor: false })
  })
})

describe('arrangeWalk', () => {
  it('arranges the walk with the chosen pattern, fifteen bars', () => {
    const performance = arrangeWalk({
      root: note('D'),
      kind: 'dorian',
      pattern: WALK.pattern,
      rh: null,
      lh: null,
      chordSize: 'sevenths',
    })
    expect(performance.bars).toHaveLength(15)
    expect(performance.chords[0]?.symbol).toBe('Dm7')
    expect(performance.chords[3]?.symbol).toBe('G7')
  })
})
```

  `walk-search.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { WALK } from '@/features/practice'
import { note, noteParam } from '@/shared/lib/music'
import { walkChoice, walkPatch } from './walk-search'

const search = { root: noteParam(note('D')), kind: 'dorian' } as const

describe('walkChoice', () => {
  it('takes the walk’s own pattern and chord size where the URL chooses none', () => {
    expect(walkChoice(search)).toEqual({
      root: note('D'),
      kind: 'dorian',
      pattern: WALK.pattern,
      rh: null,
      lh: null,
      chordSize: WALK.chordSize,
    })
  })

  it('reads From the chart as the walk’s own pattern: its chart names no methods', () => {
    expect(walkChoice({ ...search, pattern: 'chart' }).pattern).toBe(WALK.pattern)
  })
})

describe('walkPatch', () => {
  it('writes a choice equal to the walk’s own as absent', () => {
    expect(walkPatch({ pattern: WALK.pattern })).toEqual({ pattern: undefined })
    expect(walkPatch({ chordSize: 'ninths', rh: 't1' })).toEqual({ chordSize: 'ninths', rh: 't1' })
  })
})
```

  `WalkPlayerPage.test.tsx`:

```tsx
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Walk the chords in the Player', () => {
  it('walks a scale’s chords as sheet music, titled by its scale', async () => {
    await renderApp('/play/walk?root=D&kind=dorian')
    expect(
      await screen.findByRole('heading', { name: 'Walk the chords in D Dorian' }),
    ).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Bar 1: Dm' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bar 8: Dm' })).toBeInTheDocument()
  })

  it('plays and stops', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/walk')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.played).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(audio.stops).toBeGreaterThan(0)
  })

  it('changes the root, the chord size and the pattern in the Setup sheet', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/walk?root=D&kind=dorian')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    await user.click(await screen.findByRole('button', { name: '7ths' }))
    expect(router.state.location.search).toMatchObject({ chordSize: 'sevenths' })
    expect(await screen.findByRole('button', { name: 'Bar 1: Dm7' })).toBeInTheDocument()
    await user.click(screen.getByRole('combobox', { name: 'Root' }))
    await user.click(await screen.findByRole('option', { name: 'E' }))
    expect(router.state.location.search).toMatchObject({ root: 'E', kind: 'dorian' })
  })

  it('closes to the scale’s Chords view when opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/walk?root=D&kind=dorian')
    await user.click(await screen.findByRole('button', { name: 'Close' }))
    expect(router.state.location.pathname).toBe('/learn/scales')
    expect(router.state.location.search).toMatchObject({ root: 'D', kind: 'dorian', show: 'chords' })
  })
})
```

  `router.test.tsx`: `ROUTES` gains `['/play/walk', '/play/walk']`; the not-found list gains a case:

```ts
  it('shows not found for a walk of a scale without chords', async () => {
    await renderApp('/play/walk?kind=blues')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
```

  `search.test.ts`: "fill every default" gains `expect(await searchAt('/play/walk')).toEqual(WALK_DEFAULTS)`; add

```ts
  it('read the walk’s scale and the Player’s params, a stale one dropped', async () => {
    expect(
      await searchAt('/play/walk?root=A%23&kind=locrian&chordSize=ninths&pattern=pop8&mode=wait'),
    ).toMatchObject({ root: 'A#', kind: 'locrian', chordSize: 'ninths', pattern: 'pop8', mode: 'wait' })
    expect(await searchAt('/play/walk?root=H&chordSize=elevenths')).toEqual(WALK_DEFAULTS)
  })
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/features/practice/walk.test.ts src/pages/player src/app`
Expected: FAIL.

- [ ] **Step 3: The walk** — `features/practice/walk.ts`:

```ts
import {
  LEFT_FIGURES,
  PATTERNS,
  RIGHT_FIGURES,
  type LeftFigureId,
  type PatternId,
  type RightFigureId,
} from '@/entities/pattern'
import type { ChordSize } from '@/entities/piece'
import { arrange, type Chart, type ChartBar, type Performance } from '@/shared/lib/arrangement'
import { scaleChordAt, scaleKey, type ScaleKind, type SpelledNote } from '@/shared/lib/music'

/** The walk's own tempo, pattern and chord size: what the Player plays when its URL chooses none. */
export const WALK = { tempo: 72, pattern: 'block', chordSize: 'triads' } as const satisfies {
  readonly tempo: number
  readonly pattern: PatternId
  readonly chordSize: ChordSize
}

/** Up from the tonic to its octave and back down, a degree a bar. */
const WALK_DEGREES = [0, 1, 2, 3, 4, 5, 6, 0, 6, 5, 4, 3, 2, 1, 0]
const BARS_PER_LINE = 4
const NOTES: Readonly<Record<ChordSize, 3 | 4 | 5>> = { triads: 3, sevenths: 4, ninths: 5 }

/** What the learner walks a scale's chords with: the Player's URL, read. */
export interface WalkChoice {
  readonly root: SpelledNote
  readonly kind: ScaleKind
  readonly pattern: PatternId
  readonly rh: RightFigureId | null
  readonly lh: LeftFigureId | null
  readonly chordSize: ChordSize
}

/** A seven-note scale's chords up to the tonic's octave and back, a bar each of 4/4, four bars a line, in the scale's key. */
export function walkChart(root: SpelledNote, kind: ScaleKind, chordSize: ChordSize): Chart {
  const bars: ChartBar[] = WALK_DEGREES.map((degree) => ({
    chords: [{ ...scaleChordAt(root, kind, degree, NOTES[chordSize]), beats: 4 }],
    beats: 4,
  }))
  const lines = Array.from({ length: Math.ceil(bars.length / BARS_PER_LINE) }, (_, i) =>
    bars.slice(i * BARS_PER_LINE, (i + 1) * BARS_PER_LINE),
  )
  return { key: scaleKey(root, kind), meter: '4/4', sections: [{ lines }] }
}

/** The walk as the Player plays it: the learner's pattern, hands' figures and chord size. */
export function arrangeWalk(choice: WalkChoice): Performance {
  const chart = walkChart(choice.root, choice.kind, choice.chordSize)
  return arrange(chart, {
    tonic: chart.key.tonic,
    pattern: PATTERNS[choice.pattern].pattern,
    ...(choice.rh ? { rh: RIGHT_FIGURES[choice.rh].figure } : {}),
    ...(choice.lh ? { lh: LEFT_FIGURES[choice.lh].figure } : {}),
  })
}
```

  `features/practice/index.ts`: `export { arrangeWalk, walkChart, WALK, type WalkChoice } from './walk'`.

- [ ] **Step 4: Its URL** — `pages/player/model/walk-search.ts`:

```ts
import { WALK, type WalkChoice } from '@/features/practice'
import { noteFromParam, type NoteParam, type ScaleKind } from '@/shared/lib/music'
import type { FigureChange, SetupChange, SetupParams } from '@/widgets/player-setup'
import type { PracticeView } from '@/widgets/practice-player'

/** The walk's URL: its scale, how the Player goes, and the walk's own choices (absent is its own). */
export type WalkSearch = PracticeView & {
  readonly root: NoteParam
  readonly kind: ScaleKind
} & Omit<SetupParams, 'key'>

/** What the walk's Setup changes: the pattern and figures, and the chord size. */
export type WalkChange = FigureChange & Pick<SetupChange, 'chordSize'>

/** The walk's URL read: what it leaves out is the walk's own; its chart names no methods, so From the chart is its own pattern. */
export function walkChoice(
  search: Pick<WalkSearch, 'root' | 'kind' | 'pattern' | 'rh' | 'lh' | 'chordSize'>,
): WalkChoice {
  return {
    root: noteFromParam(search.root),
    kind: search.kind,
    pattern: search.pattern === undefined || search.pattern === 'chart' ? WALK.pattern : search.pattern,
    rh: search.rh ?? null,
    lh: search.lh ?? null,
    chordSize: search.chordSize ?? WALK.chordSize,
  }
}

/** A Setup change as the walk's URL writes it: its own pattern or chord size left out. */
export function walkPatch(change: WalkChange): Partial<WalkSearch> {
  return {
    ...change,
    ...('pattern' in change
      ? { pattern: change.pattern === WALK.pattern ? undefined : change.pattern }
      : {}),
    ...('chordSize' in change
      ? { chordSize: change.chordSize === WALK.chordSize ? undefined : change.chordSize }
      : {}),
  }
}
```

  `search.ts`: split the Player's view out of `validatePlayerSearch` so both Player routes read it one way:

```ts
/** The Player's own params: how it goes, whatever it plays. */
function practiceView(raw: Raw): PracticeView {
  return {
    mode: valueOr(isOneOf(PRACTICE_MODES), raw.mode, PLAYER_DEFAULTS.mode),
    tempo: wholeIn(raw.tempo, TEMPO_RANGE.min, TEMPO_RANGE.max, undefined),
    speedTraining: raw.speedTraining === true,
    hands: valueOr(isHands, raw.hands, PLAYER_DEFAULTS.hands),
    swing: raw.swing === true,
    loop: isLoopParam(raw.loop) ? raw.loop : undefined,
  }
}

/** The pattern, figures and chord size a Player's Setup chooses: any source's. */
function setupFigures(raw: Raw): Omit<SetupParams, 'key'> {
  return {
    pattern: isPlayerPattern(raw.pattern) ? raw.pattern : undefined,
    rh: isRightFigureId(raw.rh) ? raw.rh : undefined,
    lh: isLeftFigureId(raw.lh) ? raw.lh : undefined,
    chordSize: isChordSize(raw.chordSize) ? raw.chordSize : undefined,
  }
}

export function validatePlayerSearch(input: Input<PlayerSearch>): PlayerSearch {
  const raw: Raw = input
  const key = readNote(raw.key)
  return { ...practiceView(raw), key: key ? noteParam(key) : undefined, ...setupFigures(raw) }
}

// Player → Walk the chords: the scale, then the Player's own params.
export const WALK_DEFAULTS: WalkSearch = {
  root: noteParam(note('C')),
  kind: 'major',
  ...PLAYER_DEFAULTS,
}
export function validateWalkSearch(input: Input<WalkSearch>): WalkSearch {
  const raw: Raw = input
  const kind = valueOr(isScaleKind, raw.kind, WALK_DEFAULTS.kind)
  const root = readNote(raw.root)
  return {
    root: root ? noteParam(scaleRootSpelling(pitchClassOf(root), kind)) : WALK_DEFAULTS.root,
    kind,
    ...practiceView(raw),
    ...setupFigures(raw),
  }
}
```

  (imports: `type PracticeView` from `@/widgets/practice-player`, `type SetupParams` from `@/widgets/player-setup`,
  `type WalkSearch` from `@/pages/player`.) `pages/player/index.ts` exports `type WalkSearch` and `WalkPlayerPage`.

- [ ] **Step 5: The page** — `use-walk-player.ts`:

```ts
import { useMemo } from 'react'
import { arrangeWalk, WALK, type WalkChoice } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { usePracticePlayer, type PracticePlayer } from '@/widgets/practice-player'
import { walkChoice, walkPatch, type WalkChange, type WalkSearch } from './walk-search'

export interface WalkPlayer {
  readonly choice: WalkChoice
  readonly performance: Performance
  readonly player: PracticePlayer
  changeSetup(change: WalkChange): void
}

/** Walk the chords as the Player plays it: the URL's scale and choices arranged, practised from the widget's hook. */
export function useWalkPlayer(
  search: WalkSearch,
  setSearch: (patch: Partial<WalkSearch>) => void,
): WalkPlayer {
  const { root, kind, pattern, rh, lh, chordSize } = search
  const choice = useMemo(
    () => walkChoice({ root, kind, pattern, rh, lh, chordSize }),
    [root, kind, pattern, rh, lh, chordSize],
  )
  const performance = useMemo(() => arrangeWalk(choice), [choice])
  const player = usePracticePlayer(performance, search, setSearch, WALK.tempo)
  return { choice, performance, player, changeSetup: (change) => setSearch(walkPatch(change)) }
}
```

  `WalkSetup.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import type { WalkChoice } from '@/features/practice'
import { noteName, noteParam, PITCH_CLASSES, scaleRootSpelling, type NoteParam } from '@/shared/lib/music'
import { Dropdown } from '@/shared/ui'
import { ChordSizeField, FigureRows, PlayerSetup } from '@/widgets/player-setup'
import { PlayingFields } from '@/widgets/practice-player'
import type { WalkChange } from '../model/walk-search'

/** The walk's Setup: its root, the pattern and figures, its chord size, and how it plays. */
export function WalkSetup({
  open,
  onOpenChange,
  choice,
  swing,
  onRoot,
  onChange,
  onSwing,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  choice: WalkChoice
  swing: boolean
  onRoot: (root: NoteParam) => void
  onChange: (change: WalkChange) => void
  onSwing: (on: boolean) => void
}) {
  const { t } = useTranslation('player')
  return (
    <PlayerSetup
      open={open}
      onOpenChange={onOpenChange}
      figures={choice}
      methods={false}
      melody={false}
      onFigures={onChange}
    >
      <Dropdown
        label={t('root')}
        value={noteParam(choice.root)}
        options={PITCH_CLASSES.map((pc) => {
          const root = scaleRootSpelling(pc, choice.kind)
          return { value: noteParam(root), label: noteName(root) }
        })}
        onChange={onRoot}
      />
      <FigureRows />
      <ChordSizeField value={choice.chordSize} onChange={(chordSize) => onChange({ chordSize })} />
      <PlayingFields swing={swing} onSwing={onSwing} />
    </PlayerSetup>
  )
}
```

  `WalkPlayerPage.tsx`:

```tsx
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useScaleName } from '@/shared/i18n'
import { useGoBack } from '@/shared/lib'
import { useWalkPlayer } from '../model/use-walk-player'
import type { WalkSearch } from '../model/walk-search'
import { PlayerLayout } from './PlayerLayout'
import { WalkSetup } from './WalkSetup'

/** A walk has one section and names none. */
const NO_HEADINGS: readonly string[] = []

/** Walk the chords in the Player: a scale's chords up to the tonic's octave and back, with a song's patterns. */
export function WalkPlayerPage() {
  const { t } = useTranslation('player')
  const scaleName = useScaleName()
  const search = useSearch({ from: '/full-screen/play/walk' })
  const navigate = useNavigate({ from: '/play/walk' })
  const [setupOpen, setSetupOpen] = useState(false)
  const close = useGoBack({
    to: '/learn/scales',
    search: { root: search.root, kind: search.kind, show: 'chords' },
  })
  const setSearch = (patch: Partial<WalkSearch>) =>
    void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })
  const { choice, performance, player, changeSetup } = useWalkPlayer(search, setSearch)
  return (
    <>
      <PlayerLayout
        title={t('walk.title', { scale: scaleName(choice.root, choice.kind) })}
        onClose={close}
        view={search}
        player={player}
        performance={performance}
        headings={NO_HEADINGS}
        onSetup={() => setSetupOpen(true)}
      />
      <WalkSetup
        open={setupOpen}
        onOpenChange={setSetupOpen}
        choice={choice}
        swing={search.swing}
        onRoot={(root) => setSearch({ root })}
        onChange={changeSetup}
        onSwing={player.setSwing}
      />
    </>
  )
}
```

- [ ] **Step 6: The route** — `player-screens.ts`: `export { PlayerPage, WalkPlayerPage } from '@/pages/player'`.
  `router.tsx` (imports `WALK_DEFAULTS`, `validateWalkSearch` from `./routes/search` and `scaleHasChords` from
  `@/shared/lib/music`):

```ts
const walkRoute = createRoute({
  getParentRoute: () => fullScreenRoute,
  path: '/play/walk',
  validateSearch: validateWalkSearch,
  search: { middlewares: [stripSearchParams(WALK_DEFAULTS)] },
  beforeLoad: ({ search }) => {
    if (!scaleHasChords(search.kind)) throw notFound()
  },
  component: lazyRouteComponent(playerScreens, 'WalkPlayerPage'),
})
```

  and `fullScreenRoute.addChildren([playerRoute, walkRoute, checkRoute])` (the static `/play/walk` outranks
  `/play/$pieceId`; Task 10's catalog test keeps the id free).

- [ ] **Step 7: The words** — `player.ts` en: `root: 'Root'`, `walk: { title: 'Walk the chords in {{scale}}' }`; ru:
  `root: 'Основной тон'`, `walk: { title: 'Аккорды по ступеням: {{scale}}' }`.

- [ ] **Step 8: Run the tests**

Run: `npx vitest run src/features/practice src/pages/player src/app`
Expected: PASS. `npm run typecheck && npm run lint`.

- [ ] **Step 9: Commit**

```bash
npx prettier --write src/features/practice src/pages/player src/app/routes/search.ts src/app/routes/search.test.ts src/app/routes/player-screens.ts src/app/router.tsx src/app/router.test.tsx src/shared/i18n/locales/en/player.ts src/shared/i18n/locales/ru/player.ts
git add -A src/features/practice src/pages/player src/app src/shared/i18n
git commit -m "Walk a scale's chords in the Player, with a song's patterns, chord size, hands, tempo and loop

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: Practise a scale's chords in the Player, from the Chords view

**Files:**
- Create: `src/features/practice/ui/PractiseChords.tsx`
- Modify: `src/features/practice/index.ts`, `src/widgets/scale-explorer/ui/ChordsView.tsx`,
  `src/shared/i18n/locales/{en,ru}/practice.ts`
- Test: `src/pages/scales/ui/ScalesPage.test.tsx`

**Interfaces:**
- Consumes: `COMMON_PROGRESSIONS` (Task 10), `WALK` (Task 12), the `/play/walk` route (Task 12).
- Produces: `PractiseChords({ root: SpelledNote, kind: ScaleKind, notes: ChordNotes })` from `@/features/practice`.

- [ ] **Step 1: Write the failing test** — `ScalesPage.test.tsx`:

```ts
  it('opens the walk and the key’s common progressions in the Player, in this key', async () => {
    await renderApp('/learn/scales?root=D&show=chords&chords=4')
    const walk = await screen.findByRole('link', { name: 'Walk the chords' })
    expect(walk.getAttribute('href')).toMatch(/^\/play\/walk\?/)
    expect(walk.getAttribute('href')).toContain('root=D')
    expect(walk.getAttribute('href')).toContain('chordSize=sevenths')
    const cadence = screen.getByRole('link', { name: /^I–IV–V–I/ })
    expect(cadence.getAttribute('href')).toMatch(/^\/play\/cadence\?/)
    expect(cadence.getAttribute('href')).toContain('key=D')
  })

  it('offers a mode the walk alone', async () => {
    await renderApp('/learn/scales?root=D&kind=dorian&show=chords')
    expect(await screen.findByRole('link', { name: 'Walk the chords' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /^I–IV–V–I/ })).not.toBeInTheDocument()
  })
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run src/pages/scales`
Expected: FAIL.

- [ ] **Step 3: Implement** — `PractiseChords.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { Footprints, ListMusic } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { COMMON_PROGRESSIONS, type ChordSize } from '@/entities/piece'
import {
  noteName,
  noteParam,
  scaleHasChords,
  type ChordNotes,
  type ScaleKind,
  type SpelledNote,
} from '@/shared/lib/music'
import { RowGroup, RowLink } from '@/shared/ui'
import { WALK } from '../walk'

/** The Player's chord size nearest a reference's: 9ths for anything larger. */
const CHORD_SIZE: Readonly<Record<ChordNotes, ChordSize>> = {
  3: 'triads',
  4: 'sevenths',
  5: 'ninths',
  6: 'ninths',
  7: 'ninths',
}

/** The kinds that are a key's scale, and so have its common progressions: major, and the three minors. */
const KEY_OF: Readonly<Partial<Record<ScaleKind, 'major' | 'minor'>>> = {
  major: 'major',
  natural: 'minor',
  harmonic: 'minor',
  melodic: 'minor',
}

/**
 * A scale's chords to practise in the Player, each row opening it there in this key: walked up and
 * down, and for a major or minor key its common progressions, with a song's patterns.
 */
export function PractiseChords({
  root,
  kind,
  notes,
}: {
  root: SpelledNote
  kind: ScaleKind
  notes: ChordNotes
}) {
  const { t } = useTranslation(['practice', 'player'])
  if (!scaleHasChords(kind)) return null
  const chordSize = CHORD_SIZE[notes]
  const key = KEY_OF[kind]
  return (
    <RowGroup title={t('practice:inPlayer')}>
      <li>
        <RowLink
          title={t('practice:walk')}
          icon={Footprints}
          paint="lilac"
          render={
            <Link
              to="/play/walk"
              search={{
                root: noteParam(root),
                kind,
                ...(chordSize === WALK.chordSize ? {} : { chordSize }),
              }}
            />
          }
        />
      </li>
      {key
        ? COMMON_PROGRESSIONS[key].map((piece) => (
            <li key={piece.id}>
              <RowLink
                title={piece.title}
                detail={t(`player:keyOf.${key}`, { tonic: noteName(root) })}
                icon={ListMusic}
                paint="lilac"
                render={
                  <Link
                    to="/play/$pieceId"
                    params={{ pieceId: piece.id }}
                    search={{
                      key: noteParam(root),
                      ...(piece.kind === 'progression' && piece.chordSize.choosable
                        ? { chordSize }
                        : {}),
                    }}
                  />
                }
              />
            </li>
          ))
        : null}
    </RowGroup>
  )
}
```

  `features/practice/index.ts`: `export { PractiseChords } from './ui/PractiseChords'`. In `ChordsView.tsx`, after
  `<WalkCard …/>`: `<PractiseChords root={tonic} kind={kind} notes={notes} />` (import from
  `@/features/practice`). `practice.ts` en: `inPlayer: 'Practise in the Player'`, `walk: 'Walk the chords'`; ru:
  `inPlayer: 'Играть в плеере'`, `walk: 'Аккорды по ступеням'`.

- [ ] **Step 4: Run the tests**

Run: `npx vitest run src/pages/scales src/features/practice`
Expected: PASS. `npm run typecheck && npm run lint`.

- [ ] **Step 5: Commit**

```bash
npx prettier --write src/features/practice src/widgets/scale-explorer/ui/ChordsView.tsx src/pages/scales/ui/ScalesPage.test.tsx src/shared/i18n/locales/en/practice.ts src/shared/i18n/locales/ru/practice.ts
git add -A src/features/practice src/widgets/scale-explorer src/pages/scales src/shared/i18n
git commit -m "Open a scale's chords in the Player from Chords view: the walk, and a key's common progressions

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Task 14: Keys: the circle of fifths and a page for each key

**Files:**
- Create: `src/widgets/key-explorer/index.ts`, `src/widgets/key-explorer/model/key-view.ts`,
  `src/widgets/key-explorer/model/circle-layout.ts`, `src/widgets/key-explorer/model/circle-layout.test.ts`,
  `src/widgets/key-explorer/model/key-marks.ts`, `src/widgets/key-explorer/ui/KeyExplorer.tsx`,
  `src/widgets/key-explorer/ui/CircleOfFifths.tsx`, `src/widgets/key-explorer/ui/KeyFacts.tsx`,
  `src/widgets/key-explorer/ui/KeySignature.tsx`, `src/widgets/key-explorer/ui/KeyChordsSection.tsx`,
  `src/pages/keys/index.ts`, `src/pages/keys/ui/KeysPage.tsx`, `src/pages/keys/ui/KeysPage.test.tsx`,
  `src/shared/ui/Fact.tsx`
- Modify: `src/shared/ui/index.ts`, `src/widgets/scale-explorer/ui/ScaleFacts.tsx` (the kit's `Fact`),
  `src/pages/learn/ui/LearnPage.tsx`, `src/app/routes/search.ts`, `src/app/routes/learn-screens.ts`,
  `src/app/router.tsx`, `src/shared/i18n/locales/{en,ru}/learn.ts`
- Test: `src/app/router.test.tsx`, `src/app/routes/search.test.ts`, `src/pages/learn/ui/LearnPage.test.tsx` (if it
  lists the references)

**Interfaces:**
- Consumes: `CIRCLE_OF_FIFTHS`, `circleFunctions`, `sameKey`, `randomKey`, `keyParam`, `keyFromParam`,
  `signatureNotes`, `relativeKey`, `modesOfKey`, `placeScaleChords`, `placeBorrowedChords`, `walkChords` (kernel);
  `scaleRun` (Task 6); `ChordButton`, `LazyScoreView`, `Fact` (kit); `PractiseChords` (Task 13); `entriesInKey`
  (Task 10); `PieceList` (widget).
- Produces: `KeyView { key: KeyParam; chords: 3 | 4; inversion: number }`, `KeyExplorer({ view, onChange })`,
  `KEYS_DEFAULTS`, `validateKeysSearch`, the route `/learn/keys`, `KeysPage`.

- [ ] **Step 1: Write the failing tests** — `circle-layout.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { cellCentre, signatureCount, wedgePath } from './circle-layout'

describe('cellCentre', () => {
  it('puts C at the top and goes clockwise by fifths, the minors inside', () => {
    expect(cellCentre(0, 'major')).toEqual({ x: 50, y: 8.5 })
    expect(cellCentre(3, 'major')).toEqual({ x: 91.5, y: 50 })
    expect(cellCentre(6, 'minor')).toEqual({ x: 50, y: 76 })
  })
})

describe('wedgePath', () => {
  it('draws a place’s thirty degrees of its ring’s band', () => {
    const path = wedgePath(0, 'major')
    expect(path.startsWith('M ')).toBe(true)
    expect(path).toContain('A 49 49 0 0 1')
    expect(path).toContain('A 34 34 0 0 0')
    expect(path.endsWith(' Z')).toBe(true)
  })
})

describe('signatureCount', () => {
  it('writes a signature as its count of sharps or flats, and nothing for none', () => {
    expect(signatureCount({ tonic: note('E', -1), minor: false })).toBe('3♭')
    expect(signatureCount({ tonic: note('A'), minor: false })).toBe('3#')
    expect(signatureCount({ tonic: note('A'), minor: true })).toBe('')
  })
})
```

  `KeysPage.test.tsx`:

```tsx
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { Sound } from '@/shared/lib/schedule'

const notes = (sounds: readonly Sound[]) =>
  sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.midi] : []))

describe('Learn → Keys', () => {
  it('opens on C major, the circle marking its seven chords', async () => {
    await renderApp('/learn/keys')
    expect(await screen.findByRole('heading', { level: 2, name: 'C major' })).toBeInTheDocument()
    const circle = screen.getByRole('navigation', { name: 'Circle of fifths' })
    expect(within(circle).getByRole('link', { name: 'C major' })).toHaveAttribute('aria-current', 'page')
    expect(within(circle).getByRole('link', { name: 'F major' })).toHaveTextContent('IV')
    expect(within(circle).getByRole('link', { name: 'B minor' })).toHaveTextContent('vii°')
    expect(within(circle).getByRole('link', { name: 'E♭ major' })).toHaveTextContent('3♭')
  })

  it('chooses a key on the circle, and shows its signature, notes, relative and modes', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/keys')
    const circle = await screen.findByRole('navigation', { name: 'Circle of fifths' })
    await user.click(within(circle).getByRole('link', { name: 'E♭ major' }))
    expect(router.state.location.search).toEqual({ key: 'Eb' })
    expect(await screen.findByRole('heading', { level: 2, name: 'E♭ major' })).toBeInTheDocument()
    expect(screen.getByText('B♭ E♭ A♭')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'C minor' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'F Dorian' }).getAttribute('href')).toMatch(
      /^\/learn\/scales\?/,
    )
  })

  it('plays its chords and the ones it borrows, and walks its chords', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/learn/keys')
    await user.click(await screen.findByRole('button', { name: /^Fm/ }))
    expect(notes(audio.played.at(-1)?.sounds ?? [])).toEqual([65, 68, 72])
    await user.click(screen.getByRole('button', { name: 'Play the chords' }))
    expect(notes(audio.played.at(-1)?.sounds ?? []).slice(0, 3)).toEqual([60, 64, 67])
  })

  it('lists the songs written in the key', async () => {
    await renderApp('/learn/keys?key=G')
    const songs = await screen.findByRole('region', { name: 'Songs in this key' })
    expect(within(songs).getByRole('link', { name: /Still, my soul, be still/ })).toBeInTheDocument()
  })

  it('says so when no song is in the key', async () => {
    await renderApp('/learn/keys?key=Ebm')
    expect(await screen.findByText('No songs are in this key.')).toBeInTheDocument()
  })

  it('reads a key spelled another way as the circle spells it', async () => {
    const { router } = await renderApp('/learn/keys?key=D%23m')
    expect(await screen.findByRole('heading', { level: 2, name: 'E♭ minor' })).toBeInTheDocument()
    expect(router.state.location.search).toEqual({ key: 'Ebm' })
  })

  it('takes a random key from the header', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/keys')
    await user.click(await screen.findByRole('button', { name: 'A random key' }))
    expect(router.state.location.search).toHaveProperty('key')
  })
})
```

  `router.test.tsx`: `ROUTES` gains `['/learn/keys', '/learn/keys']`. `search.test.ts`: "fill every default" gains
  `expect(await searchAt('/learn/keys')).toEqual(KEYS_DEFAULTS)`, and add

```ts
  it('read a Keys key as the circle spells it, and its chords within their inversions', async () => {
    expect(await searchAt('/learn/keys?key=Bb&chords=4&inversion=3')).toEqual({
      key: 'Bb',
      chords: 4,
      inversion: 3,
    })
    expect(await searchAt('/learn/keys?key=D%23m')).toMatchObject({ key: 'Ebm' })
    expect(await searchAt('/learn/keys?key=H&chords=5&inversion=3')).toEqual(KEYS_DEFAULTS)
  })
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/widgets/key-explorer src/pages/keys src/app`
Expected: FAIL.

- [ ] **Step 3: The kit's fact row** — `shared/ui/Fact.tsx`:

```tsx
import type { ReactNode } from 'react'

/** One fact in a list of facts (`dl`): its term, then what it is. */
export function Fact({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline gap-4">
      <dt className="w-28 shrink-0 text-muted-foreground">{term}</dt>
      <dd className="font-semibold">{children}</dd>
    </div>
  )
}
```

  exported from `shared/ui/index.ts`; `ScaleFacts.tsx` drops its private `Fact` and imports the kit's.

- [ ] **Step 4: The widget's model** — `key-view.ts`:

```ts
import type { KeyParam } from '@/shared/lib/music'

/** What the Keys reference shows: a key, and its chords' size and inversion. */
export interface KeyView {
  readonly key: KeyParam
  /** Triads or 7th chords. */
  readonly chords: 3 | 4
  /** Root position (0) to the 3rd inversion, as far as the chords stack. */
  readonly inversion: number
}
```

  `circle-layout.ts`:

```ts
import { keySignature, type CircleRing, type Key } from '@/shared/lib/music'

/** How far each ring's cells sit from the centre, in percent of the circle's box: majors outside, minors inside. */
const RADIUS: Readonly<Record<CircleRing, number>> = { major: 41.5, minor: 26 }
/** Each ring's band in a 100-unit box: its inner and outer edge. */
const BAND: Readonly<Record<CircleRing, readonly [number, number]>> = {
  major: [34, 49],
  minor: [18, 34],
}

/** A place's angle, C at the top and each fifth a twelfth of the turn clockwise, turned by `degrees`. */
const angleOf = (place: number, degrees = 0) => ((place * 30 - 90 + degrees) * Math.PI) / 180
const round = (n: number) => Math.round(n * 1000) / 1000

/** A place's cell centre on a ring, in percent of the circle's box from its top left. */
export function cellCentre(place: number, ring: CircleRing): { readonly x: number; readonly y: number } {
  const angle = angleOf(place)
  return {
    x: round(50 + RADIUS[ring] * Math.cos(angle)),
    y: round(50 + RADIUS[ring] * Math.sin(angle)),
  }
}

/** A place's wedge of a ring as an SVG path in a 100-unit box: thirty degrees of the ring's band, centred on it. */
export function wedgePath(place: number, ring: CircleRing): string {
  const [inner, outer] = BAND[ring]
  const from = angleOf(place, -15)
  const to = angleOf(place, 15)
  const at = (radius: number, angle: number) =>
    `${round(50 + radius * Math.cos(angle))} ${round(50 + radius * Math.sin(angle))}`
  return `M ${at(outer, from)} A ${outer} ${outer} 0 0 1 ${at(outer, to)} L ${at(inner, to)} A ${inner} ${inner} 0 0 0 ${at(inner, from)} Z`
}

/** A key's signature as the circle writes it: its count of sharps or flats ("3♭"), nothing for none. */
export function signatureCount(key: Key): string {
  const count = keySignature(key)
  if (count === 0) return ''
  return count > 0 ? `${count}#` : `${-count}♭`
}
```

  `key-marks.ts`:

```ts
import type { Midi, PlacedTone } from '@/shared/lib/music'
import type { KeyMark } from '@/shared/ui'

/** The key's scale on the keys: the tonic in its own colour, every note with its degree. */
export const keyMarks = (placed: readonly PlacedTone[]): Map<Midi, KeyMark> =>
  new Map(
    placed.map((key) => [
      key.midi,
      { tone: key.tone.role === 'root' ? 'tonic' : 'scale', label: key.tone.degree },
    ]),
  )
```

- [ ] **Step 5: The widget's parts** — `CircleOfFifths.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import {
  CIRCLE_OF_FIFTHS,
  circleFunctions,
  keyParam,
  noteName,
  sameKey,
  type CircleRing,
  type Key,
} from '@/shared/lib/music'
import { cellCentre, signatureCount, wedgePath } from '../model/circle-layout'

const RINGS: readonly CircleRing[] = ['major', 'minor']
/** A wedge's fill: the key's own place in the tonic's wash, its other chords' in the scale's, the rest plain. */
const WEDGE = {
  tonic: 'fill-key-tonic',
  chord: 'fill-key-scale',
  plain: 'fill-card',
} as const

/**
 * The circle of fifths as the Keys reference's chooser: every key a link to its page, its signature's
 * count under its name; the key shown and the places of its seven chords wear the keys' marks and
 * carry their numerals (I IV V outside and ii iii vi vii° inside for C).
 */
export function CircleOfFifths({ current }: { current: Key }) {
  const { t } = useTranslation('learn')
  const functions = circleFunctions(current)
  const numeral = (place: number, ring: CircleRing) =>
    functions.find((at) => at.place === place && at.ring === ring)?.numeral
  const name = (key: Key) =>
    t(key.minor ? 'keys.minor' : 'keys.major', { tonic: noteName(key.tonic) })
  return (
    <nav aria-label={t('keys.circle')} className="relative mx-auto aspect-square w-full max-w-sm">
      <svg viewBox="0 0 100 100" aria-hidden className="absolute inset-0 size-full">
        {CIRCLE_OF_FIFTHS.flatMap((place, i) =>
          RINGS.map((ring) => (
            <path
              key={`${ring} ${i}`}
              d={wedgePath(i, ring)}
              strokeWidth={0.3}
              className={cn(
                'stroke-border',
                WEDGE[
                  sameKey(place[ring], current) ? 'tonic' : numeral(i, ring) ? 'chord' : 'plain'
                ],
              )}
            />
          )),
        )}
      </svg>
      <p
        aria-hidden
        className="absolute inset-0 grid place-content-center font-display text-lg font-semibold"
      >
        {name(current)}
      </p>
      <ul>
        {CIRCLE_OF_FIFTHS.flatMap((place, i) =>
          RINGS.map((ring) => {
            const key = place[ring]
            const { x, y } = cellCentre(i, ring)
            const mark = numeral(i, ring)
            return (
              <li
                key={`${ring} ${i}`}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <Link
                  from="/learn/keys"
                  to="/learn/keys"
                  search={(prev) => ({ ...prev, key: keyParam(key) })}
                  replace
                  aria-label={name(key)}
                  aria-current={sameKey(key, current) ? 'page' : undefined}
                  className={cn(
                    'grid size-11 place-content-center gap-0.5 rounded-full text-center leading-none transition-colors duration-200 ease-out outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring aria-[current=page]:bg-card aria-[current=page]:ring-1 aria-[current=page]:ring-input',
                    mark ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  <span className="text-sm font-semibold">
                    {noteName(key.tonic) + (key.minor ? 'm' : '')}
                  </span>
                  <span className="text-xs tabular-nums">{mark ?? signatureCount(key)}</span>
                </Link>
              </li>
            )
          }),
        )}
      </ul>
    </nav>
  )
}
```

  `KeySignature.tsx`:

```tsx
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { placeScale, type Key } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { scaleRun } from '@/shared/lib/schedule'
import { LazyScoreView } from '@/shared/ui'

/** The key's signature on a grand staff, with its scale up and down in it. */
export function KeySignature({ value }: { value: Key }) {
  const { t } = useTranslation('music')
  const { tonic, minor } = value
  const score = useMemo(
    () =>
      notate(
        scaleRun(placeScale(tonic, minor ? 'natural' : 'major'), {
          rhythm: 'even',
          hands: 'rh',
          key: { tonic, minor },
        }),
      ),
    [tonic, minor],
  )
  return (
    <section
      aria-label={t('sheet.label')}
      className="-mx-4 overflow-x-auto overscroll-x-contain px-4 scrollbar-none lg:mx-0 lg:px-0"
    >
      <LazyScoreView score={score} scale={1} fingers={false} muted="bass" />
    </section>
  )
}
```

  `KeyFacts.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useScaleName } from '@/shared/i18n'
import {
  keyParam,
  modesOfKey,
  noteName,
  noteParam,
  relativeKey,
  signatureNotes,
  spellScale,
  type Key,
} from '@/shared/lib/music'
import { ButtonLink, Fact } from '@/shared/ui'

/** A key's signature and notes, its relative (a key page) and the modes that share its notes (in Scales). */
export function KeyFacts({ value }: { value: Key }) {
  const { t } = useTranslation('learn')
  const scaleName = useScaleName()
  const signature = signatureNotes(value)
  const relative = relativeKey(value)
  const notes = spellScale(value.tonic, value.minor ? 'natural' : 'major')
  return (
    <dl className="flex flex-col gap-2">
      <Fact term={t('keys.signature')}>
        {signature.length === 0 ? t('keys.noSignature') : signature.map(noteName).join(' ')}
      </Fact>
      <Fact term={t('keys.notes')}>{notes.map((tone) => noteName(tone.note)).join(' ')}</Fact>
      <Fact term={t('about.relative')}>
        <ButtonLink
          variant="link"
          className="px-0"
          render={
            <Link
              from="/learn/keys"
              to="/learn/keys"
              search={(prev) => ({ ...prev, key: keyParam(relative) })}
              replace
            />
          }
        >
          {t(relative.minor ? 'keys.minor' : 'keys.major', { tonic: noteName(relative.tonic) })}
        </ButtonLink>
      </Fact>
      <Fact term={t('keys.modes')}>
        <span className="flex flex-wrap gap-x-4">
          {modesOfKey(value).map(({ root, kind }) => (
            <ButtonLink
              key={kind}
              variant="link"
              className="px-0"
              render={<Link to="/learn/scales" search={{ root: noteParam(root), kind }} />}
            >
              {scaleName(root, kind)}
            </ButtonLink>
          ))}
        </span>
      </Fact>
    </dl>
  )
}
```

  `KeyChordsSection.tsx`:

```tsx
import { Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { lastStackInversion, type PlacedScaleChord } from '@/shared/lib/music'
import { chordSounds, walkSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { ChordButton, Segmented } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { KeyView } from '../model/key-view'

const SIZES = [
  { value: 3, name: 'triads' },
  { value: 4, name: 'sevenths' },
] as const
const INVERSION_NAMES = ['root', 'first', 'second', 'third'] as const
/** Play walks the key's chords at the Scales reference's own tempo. */
const WALK_TEMPO = 80

/** Chords to tap in a grid, each pressed while it sounds. */
function ChordGrid({
  chords,
  id,
  playing,
  onTap,
}: {
  chords: readonly PlacedScaleChord[]
  id: string
  playing: string | null
  onTap: (id: string, chord: PlacedScaleChord) => void
}) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-7 lg:grid-cols-4">
      {chords.map((placed, i) => (
        <ChordButton
          key={`${id}${i}`}
          symbol={placed.symbol}
          numeral={placed.numeral}
          playing={playing === `${id}${i}`}
          onClick={() => onTap(`${id}${i}`, placed)}
        />
      ))}
    </div>
  )
}

/** A key's chords to tap in a size and an inversion, the ones it borrows most, and Play, which walks its seven up and down. */
export function KeyChordsSection({
  view,
  chords,
  borrowed,
  walk,
  onChange,
}: {
  view: KeyView
  chords: readonly PlacedScaleChord[]
  borrowed: readonly PlacedScaleChord[]
  walk: readonly PlacedScaleChord[]
  onChange: (change: Partial<KeyView>) => void
}) {
  const { t } = useTranslation(['learn', 'music', 'common'])
  const playback = usePlayback<string>()
  const tap = (id: string, placed: PlacedScaleChord) =>
    playback.toggle(
      id,
      chordSounds(
        placed.tones.map((tone) => tone.midi),
        { arpeggio: false },
      ),
    )
  const walkThem = () =>
    playback.toggle(
      'walk',
      walkSounds(
        walk.map((placed) => placed.tones.map((tone) => tone.midi)),
        { arpeggio: false, tempo: WALK_TEMPO },
      ),
    )
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <h3 className="text-2xl">{t('learn:keys.chords')}</h3>
        <Segmented
          label={t('learn:chordSize.label')}
          value={view.chords}
          options={SIZES.map(({ value, name }) => ({ value, label: t(`learn:chordSize.${name}`) }))}
          onChange={(chords) =>
            onChange({ chords, inversion: Math.min(view.inversion, lastStackInversion(chords)) })
          }
        />
        <Segmented
          label={t('learn:inversionLabel')}
          value={view.inversion}
          options={INVERSION_NAMES.slice(0, lastStackInversion(view.chords) + 1).map(
            (name, value) => ({ value, label: t(`music:inversion.${name}`) }),
          )}
          onChange={(inversion) => onChange({ inversion })}
        />
        <ChordGrid chords={chords} id="d" playing={playback.playing} onTap={tap} />
      </section>
      <section className="flex flex-col gap-4">
        <h3 className="text-2xl">{t('learn:keys.borrowed')}</h3>
        <ChordGrid chords={borrowed} id="b" playing={playback.playing} onTap={tap} />
      </section>
      <Button size="pill" onClick={walkThem}>
        {playback.playing === 'walk' ? (
          <>
            <Square data-icon="inline-start" />
            {t('common:stop')}
          </>
        ) : (
          t('learn:keys.play')
        )}
      </Button>
    </div>
  )
}
```

  `KeyExplorer.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { ChartNoAxesColumnIncreasing, KeyboardMusic } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { PractiseChords } from '@/features/practice'
import { useScaleName } from '@/shared/i18n'
import {
  keyFromParam,
  noteName,
  noteParam,
  placeBorrowedChords,
  placeScale,
  placeScaleChords,
  rangeOf,
  walkChords,
  type ScaleKind,
} from '@/shared/lib/music'
import { RowGroup, RowLink } from '@/shared/ui'
import { keyMarks } from '../model/key-marks'
import type { KeyView } from '../model/key-view'
import { CircleOfFifths } from './CircleOfFifths'
import { KeyChordsSection } from './KeyChordsSection'
import { KeyFacts } from './KeyFacts'
import { KeySignature } from './KeySignature'

/**
 * A key's page, with the circle of fifths to choose it: its signature on a staff, notes, relative and
 * modes; its chords and the ones it borrows, to tap and to walk; practised in the Player; and in Scales.
 */
export function KeyExplorer({
  view,
  onChange,
}: {
  view: KeyView
  onChange: (change: Partial<KeyView>) => void
}) {
  const { t } = useTranslation('learn')
  const scaleName = useScaleName()
  const key = keyFromParam(view.key)
  const kind: ScaleKind = key.minor ? 'natural' : 'major'
  const chords = useMemo(() => {
    const shown = keyFromParam(view.key)
    return placeScaleChords(shown.tonic, shown.minor ? 'natural' : 'major', view.chords, view.inversion)
  }, [view.key, view.chords, view.inversion])
  const borrowed = useMemo(
    () => placeBorrowedChords(keyFromParam(view.key), view.chords, view.inversion),
    [view.key, view.chords, view.inversion],
  )
  const walk = useMemo(() => walkChords(chords), [chords])
  const placed = placeScale(key.tonic, kind)
  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
      <CircleOfFifths current={key} />
      <div className="flex flex-col gap-4">
        <h2 className="text-5xl">
          {t(key.minor ? 'keys.minor' : 'keys.major', { tonic: noteName(key.tonic) })}
        </h2>
        <KeySignature value={key} />
        <KeyFacts value={key} />
      </div>
      <ExplorerKeyboard
        keys={placed.map((tone) => tone.midi)}
        range={rangeOf(
          [...walk, ...borrowed].flatMap((chord) => chord.tones.map((tone) => tone.midi)),
        )}
        marks={keyMarks(placed)}
        className="lg:col-span-2"
      />
      <KeyChordsSection
        view={view}
        chords={chords}
        borrowed={borrowed}
        walk={walk}
        onChange={onChange}
      />
      <div className="flex flex-col gap-6">
        <PractiseChords root={key.tonic} kind={kind} notes={view.chords} />
        <RowGroup title={t('keys.inScales')}>
          <li>
            <RowLink
              title={scaleName(key.tonic, kind)}
              icon={ChartNoAxesColumnIncreasing}
              paint="sky"
              render={<Link to="/learn/scales" search={{ root: noteParam(key.tonic), kind }} />}
            />
          </li>
          <li>
            <RowLink
              title={t('keys.chordsTo13ths')}
              icon={KeyboardMusic}
              paint="sand"
              render={
                <Link
                  to="/learn/scales"
                  search={{ root: noteParam(key.tonic), kind, show: 'chords' }}
                />
              }
            />
          </li>
        </RowGroup>
      </div>
    </div>
  )
}
```

  `index.ts`: `export type { KeyView } from './model/key-view'` and `export { KeyExplorer } from './ui/KeyExplorer'`.

- [ ] **Step 6: The page and the route** — `pages/keys/ui/KeysPage.tsx`:

```tsx
import { useNavigate, useSearch } from '@tanstack/react-router'
import { ArrowLeft, Dices } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { entriesInKey } from '@/entities/piece'
import { useGoBack } from '@/shared/lib'
import { keyFromParam, keyParam, randomKey } from '@/shared/lib/music'
import { RoundButton, ScreenHeader } from '@/shared/ui'
import { KeyExplorer, type KeyView } from '@/widgets/key-explorer'
import { PieceList } from '@/widgets/piece-list'

/** The Keys reference: a key's page with the circle of fifths to choose it, and the songs written in it. */
export function KeysPage() {
  const { t } = useTranslation(['learn', 'common'])
  const view = useSearch({ from: '/shell/learn/keys' })
  const navigate = useNavigate({ from: '/learn/keys' })
  const back = useGoBack({ to: '/learn' })
  const songsId = useId()
  const key = keyFromParam(view.key)
  const songs = entriesInKey(key)
  const onChange = (change: Partial<KeyView>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('learn:keys.title')}
        back={<RoundButton label={t('common:back')} icon={ArrowLeft} onClick={back} />}
        actions={
          <RoundButton
            label={t('learn:keys.random')}
            icon={Dices}
            onClick={() => onChange({ key: keyParam(randomKey(Math.random, key)) })}
          />
        }
      />
      <KeyExplorer view={view} onChange={onChange} />
      {songs.length > 0 ? (
        <PieceList groups={[{ id: 'in-key', heading: t('learn:keys.songs'), entries: songs }]} />
      ) : (
        <section aria-labelledby={songsId} className="flex flex-col gap-2">
          <h2 id={songsId} className="text-2xl">
            {t('learn:keys.songs')}
          </h2>
          <p className="text-muted-foreground">{t('learn:keys.noSongs')}</p>
        </section>
      )}
    </div>
  )
}
```

  `pages/keys/index.ts`: `export { KeysPage } from './ui/KeysPage'`. `learn-screens.ts` adds
  `export { KeysPage } from '@/pages/keys'`. `search.ts` (imports `keyParam`, `parseKey`, `tonicSpelling`, `type
  KeyView` from `@/widgets/key-explorer`):

```ts
// Learn → Keys
export const KEYS_DEFAULTS: KeyView = {
  key: keyParam({ tonic: note('C'), minor: false }),
  chords: 3,
  inversion: 0,
}
const isKeyChords = isOneOf<KeyView['chords']>([3, 4])
export function validateKeysSearch(input: Input<KeyView>): KeyView {
  const raw: Raw = input
  const key = typeof raw.key === 'string' ? parseKey(raw.key) : null
  const chords = valueOr(isKeyChords, raw.chords, KEYS_DEFAULTS.chords)
  return {
    key: key
      ? keyParam({ tonic: tonicSpelling(pitchClassOf(key.tonic), key.minor), minor: key.minor })
      : KEYS_DEFAULTS.key,
    chords,
    inversion: wholeIn(raw.inversion, 0, lastStackInversion(chords), KEYS_DEFAULTS.inversion),
  }
}
```

  `router.tsx`:

```ts
const keysRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/learn/keys',
  validateSearch: validateKeysSearch,
  search: { middlewares: [stripSearchParams(KEYS_DEFAULTS)] },
  component: lazyRouteComponent(learnScreens, 'KeysPage'),
})
```

  added to the shell's children after `scalesRoute`. `LearnPage.tsx`'s References gain, after Scales:

```tsx
          <li>
            <RowLink
              title={t('learn:keys.title')}
              icon={CircleDot}
              paint="lilac"
              render={<Link to="/learn/keys" />}
            />
          </li>
```

- [ ] **Step 7: The words** — `learn.ts` en:

```ts
  keys: {
    title: 'Keys',
    circle: 'Circle of fifths',
    major: '{{tonic}} major',
    minor: '{{tonic}} minor',
    random: 'A random key',
    signature: 'Signature',
    noSignature: 'No sharps or flats',
    notes: 'Notes',
    modes: 'Modes',
    chords: 'Chords',
    borrowed: 'Borrowed chords',
    play: 'Play the chords',
    inScales: 'In Scales',
    chordsTo13ths: 'Its chords, to 13ths',
    songs: 'Songs in this key',
    noSongs: 'No songs are in this key.',
  },
```

  ru:

```ts
  keys: {
    title: 'Тональности',
    circle: 'Квинтовый круг',
    major: '{{tonic}} мажор',
    minor: '{{tonic}} минор',
    random: 'Случайная тональность',
    signature: 'Знаки',
    noSignature: 'Без знаков',
    notes: 'Ноты',
    modes: 'Лады',
    chords: 'Аккорды',
    borrowed: 'Заимствованные аккорды',
    play: 'Сыграть аккорды',
    inScales: 'В гаммах',
    chordsTo13ths: 'Её аккорды до терцдецимаккордов',
    songs: 'Песни в этой тональности',
    noSongs: 'Песен в этой тональности нет.',
  },
```

- [ ] **Step 8: Run the tests**

Run: `npx vitest run src/widgets/key-explorer src/pages/keys src/pages/learn src/pages/scales src/app`
Expected: PASS. `npm run typecheck && npm run lint`.

- [ ] **Step 9: Commit**

```bash
npx prettier --write src/widgets/key-explorer src/pages/keys src/shared/ui/Fact.tsx src/shared/ui/index.ts src/widgets/scale-explorer/ui/ScaleFacts.tsx src/pages/learn/ui/LearnPage.tsx src/app/routes/search.ts src/app/routes/search.test.ts src/app/routes/learn-screens.ts src/app/router.tsx src/app/router.test.tsx src/shared/i18n/locales/en/learn.ts src/shared/i18n/locales/ru/learn.ts
git add -A src/widgets/key-explorer src/pages/keys src/shared/ui src/widgets/scale-explorer src/pages/learn src/app src/shared/i18n
git commit -m "Add Keys to Learn: a page for each of the 24 keys, chosen on the circle of fifths

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 15: The records, and the whole app verified

**Files:**
- Create: `docs/adr/0014-a-scale-stacks-its-own-chords-and-a-key-is-a-page.md`
- Modify: `DESIGN.md`, `PRODUCT.md`, `CLAUDE.md`, `docs/CODE_STYLE.md`, `docs/UBIQUITOUS_LANGUAGE.md`,
  `docs/superpowers/specs/2026-09-25-next-features-roadmap-design.md`,
  `docs/superpowers/specs/2026-09-24-piano-trainer-rewrite-design.md` (only where it lists screens or scale kinds)

- [ ] **Step 1: ADR 0014** — context (the owner's asks, roadmap §2 row 4); decisions: thirteen kinds in three families
  and `blues` keeping its id; a scale's root spelled by its key's fewest accidentals; Start on with From the thumb and
  As the scale (continuing fingers from the taught thumbs; the choice the seven-note scales'); the run in ticks and on
  a lazily loaded staff; a scale's chords are stacks of thirds named by one rule, not qualities; three 9th qualities
  and "a 9th only where available" for a chart; figures for inversions; the walk as a Performance handed to the
  Player, one layout for any source and a composed Setup sheet; the key's common progressions as content; Keys as one
  page per key with the circle as its chooser, signature counts on the circle, borrowed chords from the parallel
  scales; decided against (Mark other keys, Start on in Chords view, the walk on the reference's staff, generated
  progressions for modes); consequences (sub-project 5's Reharmonise and chord detection name any stack with
  `stackSuffix`; sub-project 7's exercises reuse `scaleRun`, `walkChart` and the Player page's layout).

- [ ] **Step 2: DESIGN.md** — under *The keyboard*: Chords view spans every key the walk plays (C4 to G5 for C
  major's triads); a mark's caption carries a figure in an inversion (`I⁶` over `C/E`). A new *The circle of fifths*
  component: a square up to 24rem, two rings of twelve wedges parted by the soft line, the key shown in the tonic's
  wash and its other six chords' places in the scale's wash (the keys' own marks), 44px round links with the key's
  name over its numeral or its signature's count (soft ink outside the key), the chosen one card paper in the control
  line, the key's name in Literata in the middle. *The sheet*: the Scales reference and the key page engrave a scale
  with `LazyScoreView`, the other hand's staff soft. *Pop-up buttons and segments*: Start on and Chord size are
  pop-ups; Fingering, Inversion and Block · Arpeggio segments. *Layout*: the Keys reference's two columns (the circle
  beside the key's name, signature and facts; the keys across; the chords beside Practise and In Scales).

- [ ] **Step 3: The glossary** — add: **Start on** (the degree a scale's run starts from), **Fingering** (From the
  thumb / As the scale), **Continuing finger** (a note's finger in a longer run), **Scale chord** (a scale's notes
  stacked in thirds from a degree: a triad to a 13th; not a Chord quality), **Figures** (an inversion's figured-bass
  mark: ⁶, ⁶₄, ⁷, ⁶₅, ⁴₃, ⁴₂), **Walk the chords** (a scale's chords up to the tonic's octave and back), **Borrowed
  chord** (a chord of a parallel scale on a key's degree: ♭VI, iv, the Neapolitan), **Parent scale** (the major scale a
  mode is a mode of), **Circle of fifths**, **Keys** (the reference, a page per key); the Scale kind row lists the
  thirteen kinds and their three families; the chord quality count becomes 36; the Places table's Learn row names
  Keys; "Scale view / Chords view" mentions the sizes and inversions.

- [ ] **Step 4: CLAUDE.md, CODE_STYLE, PRODUCT, the roadmap** — CLAUDE.md: the router's routes (Learn → Keys,
  `/play/walk`), `pages/keys`, `pages/player` serving a piece or a walk (`PlayerLayout`, `useWalkPlayer`), widgets
  (`key-explorer`; `scale-explorer`'s two views; `player-setup` composed), features (`practice`'s `walkChart`,
  `arrangeWalk`, `PractiseChords`), the kernel (`scale-chord.ts`, `circle.ts`, fingering, the kinds), `schedule`'s
  `scaleRun` in ticks, the kit (`ChordButton`, `LazyScoreView`, `Fact`), the piece count (54) and progressions.
  CODE_STYLE §8: a scale's chords are `scaleChords` stacks named by `stackSuffix`, and a chart's chords from a scale
  are `scaleChordAt`'s qualities; a run is `scaleRun` in ticks, sounded by `runSounds`; a staff outside the Player is
  `LazyScoreView`. PRODUCT.md: the screens (Learn's Keys; Scales with Start on, fingerings, the staff, chords to 13ths;
  the walk in the Player), 54 pieces. The roadmap's status: sub-project 4 built, its records named.

- [ ] **Step 5: Verify the whole app**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`
Expected: every command passes; the build's chunks show VexFlow in its own chunk, loaded by the Player and by
`LazyScoreView`, not in the Learn screens' chunk (check `dist/assets` names and sizes in the build output).

- [ ] **Step 6: Commit the records**

```bash
npx prettier --write DESIGN.md PRODUCT.md CLAUDE.md docs/CODE_STYLE.md docs/UBIQUITOUS_LANGUAGE.md docs/adr/0014-a-scale-stacks-its-own-chords-and-a-key-is-a-page.md docs/superpowers/specs/2026-09-25-next-features-roadmap-design.md
git add -A DESIGN.md PRODUCT.md CLAUDE.md docs
git commit -m "Record sub-project 4: modes and blues, two fingerings, a scale's chords to 13ths, the walk, Keys; ADR 0014

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 7: Remove the built spec and plan** (the convention since sub-project 1: git log finds them; the ADR,
  DESIGN.md, CODE_STYLE and the glossary keep what they decided)

```bash
git rm -q docs/superpowers/specs/2026-09-27-scales-and-chords-deeper-design.md docs/superpowers/plans/2026-09-27-scales-and-chords-deeper.md
git commit -m "Remove sub-project 4's built spec and plan (git log finds them; ADR 0014, DESIGN.md, CODE_STYLE and the glossary keep what they decided)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
