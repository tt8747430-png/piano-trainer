# Learn's references: Intervals and Available tensions — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Part 5.1 of sub-project 5: two new Learn references, **Intervals** (Clefs' cards, each on a staff and
played up, down and together) and **Available tensions** (the owner's table computed for nine 7th chords on any
root), and a staff that shows one clef.

**Architecture:** The kernel gains `interval-facts.ts` (the reference's intervals and their consonance) and
`tensions.ts` (the one source of available tensions, which `scaleChordAt` now asks). The schedule gains
`intervalSounds`; the engraver can draw one staff of the grand staff. A new feature slice `features/play-example`
holds the interval card, which lessons will reuse in 5.2. Two widgets (`interval-explorer`, `tension-explorer`) own
their URL views; two pages and two routes put them in Learn's References.

**Tech Stack:** React 19, TypeScript 6 (strict), TanStack Router, i18next, VexFlow 5, Vitest 4 + Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-29-learn-lessons-references-tools-design.md` (§1, §3).

## Global Constraints

- FSD layers, lint-enforced: `app → pages → widgets → features → entities → shared`; `shared/lib/music` imports
  only itself and no package.
- Strict TS: `noUncheckedIndexedAccess`, `verbatimModuleSyntax` (`import type`), no `any`, no casts (`as`) outside
  `as const`.
- Every UI string in `en` and `ru` (`src/shared/i18n/locales/{en,ru}/<namespace>.ts`, Russian typed against
  English). A count goes after a colon; never use `{{count}}` as a variable name (i18next's plurals).
- Tests colocated, `globals: false` (import `describe`, `it`, `expect`), Testing Library by role and name, a screen's
  test through `renderApp`.
- Semantic Tailwind utilities only; no arbitrary values; `cn()` for composition; one exported component per file.
- Every Play turns into Stop while it sounds (`usePlayback`); in a grid of items the item is `aria-pressed`.
- Prettier: no semicolons, single quotes, trailing commas, width 100. Run `npx prettier --write <files touched>`,
  never on the whole repo.
- Verify before each commit: `npm run typecheck && npm run lint && npm run test`; after routes change, also
  `npm run build`.
- Commit on `main` (the owner's rule), ending each message with
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- **A root whose interval needs a double accidental** (the minor 2nd over D♭ is E𝄫): the card must spell it by
  letters, not jump to D. Pinned in Task 5's model test.
- **A unison** (both notes one key): one key shown, labelled `1`, and Up/Down still play two strikes. Pinned in
  Task 5's model test and Task 3's sounds test.
- **Changing the chord while a note is shown** in Available tensions: the keys must drop the old chord's top note
  (stale shown state). Pinned in Task 7's page test.
- **A root typed in the URL in the other spelling** (`root=C%23` in Intervals, `root=Db&chord=m7` in tensions): the
  validator respells it by the page's rule, never rejects it. Pinned in Tasks 6 and 7's search tests.
- **The staff re-engraving on every render** (a new score object each render): the card memoises its score from
  the root param and interval name. Pinned by Task 5's props being strings (`NoteParam`), not note objects.

---

### Task 1: The reference's intervals in the kernel

**Files:**
- Modify: `src/shared/lib/music/interval.ts` (add the octave)
- Create: `src/shared/lib/music/interval-facts.ts`
- Create: `src/shared/lib/music/interval-facts.test.ts`
- Modify: `src/shared/lib/music/index.ts`

**Interfaces:**
- Produces: `INTERVALS` (now with `P8`), `type IntervalName`, `type LabelledInterval` exported from
  `@/shared/lib/music`; `INTERVAL_GROUPS`, `INTERVAL_GROUP_IDS`, `type IntervalGroup`, `type ReferenceInterval`,
  `CONSONANCES`, `type Consonance`, `consonanceOf(interval: Interval): Consonance`.

- [ ] **Step 1: Write the failing test**

`src/shared/lib/music/interval-facts.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { INTERVALS } from './interval'
import { consonanceOf, INTERVAL_GROUP_IDS, INTERVAL_GROUPS } from './interval-facts'

describe('the reference’s intervals', () => {
  it('run from the unison to the octave, a semitone at a time but for the one tritone', () => {
    expect(INTERVAL_GROUP_IDS).toEqual(['simple', 'compound'])
    expect(INTERVAL_GROUPS.simple.map((name) => INTERVALS[name].semitones)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ])
  })

  it('go past the octave to the degrees a chord symbol writes', () => {
    expect(INTERVAL_GROUPS.compound.map((name) => INTERVALS[name].degree)).toEqual([
      '♭9',
      '9',
      '#9',
      '11',
      '#11',
      '♭13',
      '13',
    ])
  })

  it('call the octave an 8th, twelve semitones up on the same letter', () => {
    expect(INTERVALS.P8).toEqual({ steps: 0, semitones: 12, degree: '8' })
  })
})

describe('consonanceOf', () => {
  it('hears perfect and imperfect consonances and dissonances as theory classes them', () => {
    expect(INTERVAL_GROUPS.simple.map((name) => consonanceOf(INTERVALS[name]))).toEqual([
      'perfect',
      'dissonance',
      'dissonance',
      'imperfect',
      'imperfect',
      'perfect',
      'dissonance',
      'perfect',
      'imperfect',
      'imperfect',
      'dissonance',
      'dissonance',
      'perfect',
    ])
  })

  it('hears a compound interval as its simple one, an augmented one as a dissonance', () => {
    expect(INTERVAL_GROUPS.compound.map((name) => consonanceOf(INTERVALS[name]))).toEqual([
      'dissonance',
      'dissonance',
      'dissonance',
      'perfect',
      'dissonance',
      'imperfect',
      'imperfect',
    ])
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run src/shared/lib/music/interval-facts.test.ts`
Expected: FAIL (cannot resolve `./interval-facts`).

- [ ] **Step 3: Add the octave and write the module**

In `src/shared/lib/music/interval.ts`, add the octave after `M7` in `INTERVALS` (letter steps stay within the
octave, as the compound intervals' do):

```ts
  M7: labelled(6, 11),
  P8: labelled(0, 12),
  m9: labelled(1, 13),
```

`src/shared/lib/music/interval-facts.ts`:

```ts
import { INTERVALS, type Interval, type IntervalName } from './interval'

/**
 * The Intervals reference's cards: the thirteen within the octave, then the compound intervals a
 * chord symbol names (♭9, 9, #9, 11, #11, ♭13, 13).
 */
export const INTERVAL_GROUPS = {
  simple: ['r', 'm2', 'M2', 'm3', 'M3', 'P4', 'A4', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8'],
  compound: ['m9', 'M9', 'A9', 'P11', 'A11', 'm13', 'M13'],
} as const satisfies Record<string, readonly IntervalName[]>
export type IntervalGroup = keyof typeof INTERVAL_GROUPS
export const INTERVAL_GROUP_IDS = ['simple', 'compound'] as const satisfies readonly IntervalGroup[]
/** An interval the reference writes a card for. */
export type ReferenceInterval = (typeof INTERVAL_GROUPS)[IntervalGroup][number]

export const CONSONANCES = ['perfect', 'imperfect', 'dissonance'] as const
export type Consonance = (typeof CONSONANCES)[number]

/** The semitones of the major or perfect interval over each letter distance. */
const PLAIN = [0, 2, 4, 5, 7, 9, 11]
/** The unison, 4th and 5th: perfect when plain. */
const PERFECT_STEPS = new Set([0, 3, 4])
/** 3rds and 6ths: imperfect consonances when major or minor. */
const IMPERFECT_STEPS = new Set([2, 5])

/**
 * How an interval sounds, as theory classes it by its simple interval: a perfect unison, 4th, 5th or
 * octave is a perfect consonance, a major or minor 3rd or 6th an imperfect one, and every 2nd, 7th,
 * augmented or diminished interval (the tritone among them) a dissonance.
 */
export function consonanceOf({ steps, semitones }: Interval): Consonance {
  const step = steps % 7
  const off = (semitones % 12) - (PLAIN[step] ?? 0)
  if (PERFECT_STEPS.has(step)) return off === 0 ? 'perfect' : 'dissonance'
  if (IMPERFECT_STEPS.has(step) && (off === 0 || off === -1)) return 'imperfect'
  return 'dissonance'
}
```

In `src/shared/lib/music/index.ts`, replace the interval export line with:

```ts
export {
  INTERVALS,
  intervalBetween,
  spellAbove,
  type Interval,
  type IntervalName,
  type LabelledInterval,
} from './interval'
export {
  CONSONANCES,
  consonanceOf,
  INTERVAL_GROUP_IDS,
  INTERVAL_GROUPS,
  type Consonance,
  type IntervalGroup,
  type ReferenceInterval,
} from './interval-facts'
```

- [ ] **Step 4: Run the tests**

Run: `npx vitest run src/shared/lib/music`
Expected: PASS (the octave touches no chord or scale: none lists `P8`).

- [ ] **Step 5: Commit**

```bash
npx prettier --write src/shared/lib/music/interval.ts src/shared/lib/music/interval-facts.ts src/shared/lib/music/interval-facts.test.ts src/shared/lib/music/index.ts
git add src/shared/lib/music/interval.ts src/shared/lib/music/interval-facts.ts src/shared/lib/music/interval-facts.test.ts src/shared/lib/music/index.ts
git commit -m "Name the intervals the reference shows, unison to octave and the chord symbols' 9ths to 13ths, and hear each as a consonance or not"
```

---

### Task 2: Available tensions, one source in the kernel

**Files:**
- Create: `src/shared/lib/music/tensions.ts`
- Create: `src/shared/lib/music/tensions.test.ts`
- Modify: `src/shared/lib/music/scale-chord.ts` (`ninthAvailable` asks `availableTensions`)
- Modify: `src/shared/lib/music/chord-parts.test.ts` (the builder's alterations held to the tensions)
- Modify: `src/shared/lib/music/index.ts`

**Interfaces:**
- Consumes: `INTERVALS`, `type IntervalName`, `type LabelledInterval` (Task 1); `qualityIntervals`, `ChordQuality`
  (`chord.ts`); `toneAbove`, `Tone` (`tone.ts`).
- Produces: `TENSION_CHORDS` (`['maj7','m7','d7','hd','s5','mM7','M7s5','sus7','o7']`), `type TensionChord`,
  `TENSION_GROUPS` (`['weak','strong','tension','avoid']`), `type TensionGroup`, `interface TensionTone extends
  Tone { group }`, `tensionTones(root: SpelledNote, quality: TensionChord): TensionTone[]` (twelve, lowest first),
  `availableTensions(quality: ChordQuality): readonly LabelledInterval[]`.

- [ ] **Step 1: Write the failing test**

`src/shared/lib/music/tensions.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { note, noteName, rootSpelling, type SpelledNote } from './note'
import { PITCH_CLASSES } from './pitch'
import {
  availableTensions,
  TENSION_CHORDS,
  TENSION_GROUPS,
  tensionTones,
  type TensionChord,
  type TensionGroup,
} from './tensions'

const C = note('C')
const inGroup = (quality: TensionChord, group: TensionGroup, root: SpelledNote = C) =>
  tensionTones(root, quality)
    .filter((tone) => tone.group === group)
    .map((tone) => `${tone.degree} ${noteName(tone.note)}`)

describe('tensionTones', () => {
  it('groups the notes over CMaj7 as the owner’s table does', () => {
    expect(inGroup('maj7', 'weak')).toEqual(['1 C', '5 G'])
    expect(inGroup('maj7', 'strong')).toEqual(['3 E', '7 B'])
    expect(inGroup('maj7', 'tension')).toEqual(['9 D', '#11 F#', '13 A'])
    expect(inGroup('maj7', 'avoid')).toEqual(['♭9 D♭', '#9 D#', '11 F', '♭13 A♭', '♭7 B♭'])
  })

  it('groups the notes over Cm7 as the owner’s table does, its E the 3rd a minor chord must not carry', () => {
    expect(inGroup('m7', 'weak')).toEqual(['1 C', '5 G'])
    expect(inGroup('m7', 'strong')).toEqual(['♭3 E♭', '♭7 B♭'])
    expect(inGroup('m7', 'tension')).toEqual(['9 D', '11 F', '13 A'])
    expect(inGroup('m7', 'avoid')).toEqual(['♭9 D♭', '3 E', '#11 F#', '♭13 A♭', '7 B'])
  })

  it('groups the notes over C7 as the owner’s table does', () => {
    expect(inGroup('d7', 'weak')).toEqual(['1 C', '5 G'])
    expect(inGroup('d7', 'strong')).toEqual(['3 E', '♭7 B♭'])
    expect(inGroup('d7', 'tension')).toEqual(['♭9 D♭', '9 D', '#9 D#', '#11 F#', '♭13 A♭', '13 A'])
    expect(inGroup('d7', 'avoid')).toEqual(['11 F', '7 B'])
  })

  it('puts an altered 5th with the tensions, and the suspended 4th with the strong tones', () => {
    expect(inGroup('hd', 'tension')).toEqual(['9 D', '11 F', '♭5 G♭', '♭13 A♭'])
    expect(inGroup('s5', 'tension')).toEqual(['♭9 D♭', '9 D', '#9 D#', '#11 F#', '#5 G#'])
    expect(inGroup('sus7', 'strong')).toEqual(['4 F', '♭7 B♭'])
    expect(inGroup('o7', 'strong')).toEqual(['♭3 E♭', '𝄫7 B𝄫'])
    expect(inGroup('o7', 'tension')).toEqual(['9 D', '11 F', '♭5 G♭', '♭13 A♭', '7 B'])
  })

  it('holds every one of the twelve notes once, for every chord on every root', () => {
    for (const quality of TENSION_CHORDS) {
      for (const pc of PITCH_CLASSES) {
        const tones = tensionTones(rootSpelling(pc, false), quality)
        expect(new Set(tones.map((tone) => tone.pitchClass)).size, quality).toBe(12)
        expect(tones.every((tone) => TENSION_GROUPS.includes(tone.group))).toBe(true)
      }
    }
  })

  it('spells each note by letters from the root', () => {
    expect(inGroup('d7', 'tension', note('E', -1))).toEqual([
      '♭9 F♭',
      '9 F',
      '#9 F#',
      '#11 A',
      '♭13 C♭',
      '13 C',
    ])
  })
})

describe('availableTensions', () => {
  it('gives a chord of the reference its tensions, and any other chord none', () => {
    expect(availableTensions('maj7').map((tension) => tension.degree)).toEqual(['9', '#11', '13'])
    expect(availableTensions('maj')).toEqual([])
    expect(availableTensions('n9')).toEqual([])
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run src/shared/lib/music/tensions.test.ts`
Expected: FAIL (cannot resolve `./tensions`).

- [ ] **Step 3: Write the module**

`src/shared/lib/music/tensions.ts`:

```ts
import { qualityIntervals, type ChordQuality } from './chord'
import { INTERVALS, type IntervalName, type LabelledInterval } from './interval'
import type { SpelledNote } from './note'
import { toneAbove, type Tone } from './tone'

/**
 * The 7th chords the Available tensions reference shows: the owner's table's (Maj7, m7, 7, m7♭5,
 * 7#5, m(maj7), 7sus4) and the two a scale also stacks (+Maj7, °7).
 */
export const TENSION_CHORDS = [
  'maj7',
  'm7',
  'd7',
  'hd',
  's5',
  'mM7',
  'M7s5',
  'sus7',
  'o7',
] as const satisfies readonly ChordQuality[]
export type TensionChord = (typeof TENSION_CHORDS)[number]

/** The owner's table's four columns: weak, strong and jazz harmony, and the unacceptable notes. */
export const TENSION_GROUPS = ['weak', 'strong', 'tension', 'avoid'] as const
export type TensionGroup = (typeof TENSION_GROUPS)[number]

/** One note above a chord's root, in its group. */
export interface TensionTone extends Tone {
  readonly group: TensionGroup
}

/**
 * The notes each chord takes as colour, from chord-scale theory: the owner's table for Maj7, m7 and
 * 7; a whole step over each chord tone for °7.
 */
const AVAILABLE: Readonly<Record<TensionChord, readonly IntervalName[]>> = {
  maj7: ['M9', 'A11', 'M13'],
  m7: ['M9', 'P11', 'M13'],
  d7: ['m9', 'M9', 'A9', 'A11', 'm13', 'M13'],
  hd: ['M9', 'P11', 'm13'],
  s5: ['m9', 'M9', 'A9', 'A11'],
  mM7: ['M9', 'P11', 'M13'],
  M7s5: ['M9', 'A11'],
  sus7: ['m9', 'M9', 'M13'],
  o7: ['M9', 'P11', 'm13', 'M7'],
}

/** Every other note, as the degree its semitones make over the root: the 1st is ♭9, the 4th the 3rd. */
const OTHER: readonly IntervalName[] = [
  'r',
  'm9',
  'M9',
  'A9',
  'M3',
  'P11',
  'A11',
  'P5',
  'm13',
  'M13',
  'm7',
  'M7',
]

const isTensionChord = (quality: ChordQuality): quality is TensionChord =>
  TENSION_CHORDS.some((chord) => chord === quality)

/** The tensions a chord takes; none for a chord the reference does not show (a triad, a 9th). */
export const availableTensions = (quality: ChordQuality): readonly LabelledInterval[] =>
  isTensionChord(quality) ? AVAILABLE[quality].map((name) => INTERVALS[name]) : []

/** A chord tone's group: the root and a perfect 5th weak, an altered 5th a tension, the rest strong. */
function chordToneGroup({ steps, semitones }: LabelledInterval): TensionGroup {
  if (semitones === 0) return 'weak'
  if (steps === 4) return semitones === 7 ? 'weak' : 'tension'
  return 'strong'
}

/**
 * All twelve notes above a chord's root, lowest first within the octave, each in its group: the
 * chord's own tones spelled as the chord spells them, its available tensions, and every other note
 * spelled as the degree its semitones make, to avoid.
 */
export function tensionTones(root: SpelledNote, quality: TensionChord): TensionTone[] {
  const own = qualityIntervals(quality).map(
    (interval): TensionTone => ({ ...toneAbove(root, interval), group: chordToneGroup(interval) }),
  )
  const tensions = AVAILABLE[quality].map(
    (name): TensionTone => ({ ...toneAbove(root, INTERVALS[name]), group: 'tension' }),
  )
  const taken = new Set([...own, ...tensions].map((tone) => tone.pitchClass))
  const avoid = OTHER.map((name) => toneAbove(root, INTERVALS[name]))
    .filter((tone) => !taken.has(tone.pitchClass))
    .map((tone): TensionTone => ({ ...tone, group: 'avoid' }))
  return [...own, ...tensions, ...avoid].sort((a, b) => (a.semitones % 12) - (b.semitones % 12))
}
```

In `src/shared/lib/music/scale-chord.ts`, import `availableTensions` from `'./tensions'` and replace
`ninthAvailable` with:

```ts
/** A 9th a chart may add: one that is an available tension over its 7th chord. */
function ninthAvailable(ninth: ScaleChord, seventh: ChordQuality): boolean {
  const above = ninth.tones[4]?.semitones
  return availableTensions(seventh).some((tension) => tension.semitones === above)
}
```

In `src/shared/lib/music/index.ts`, add:

```ts
export {
  availableTensions,
  TENSION_CHORDS,
  TENSION_GROUPS,
  tensionTones,
  type TensionChord,
  type TensionGroup,
  type TensionTone,
} from './tensions'
```

Append to `src/shared/lib/music/chord-parts.test.ts` (import `availableTensions` from `'./tensions'`;
`alterationsOf`, `buildChord`, `seventhsOf` and `sizesOf` from `'./chord-parts'` and `note` from `'./note'`, where
not yet imported):

```ts
describe('the builder’s alterations', () => {
  /** What each alteration puts in, above the root. */
  const ADDS = { b9: 13, s9: 15, s11: 18, b13: 20 } as const

  it('are the available tensions of the 7th chord they alter, but for the ♭5, which alters the chord', () => {
    for (const triad of ['maj', 'aug'] as const) {
      for (const size of sizesOf(triad)) {
        if (size === 5) continue
        for (const seventh of seventhsOf(triad, size)) {
          const parts = { triad, size, seventh, added: 'none', alterations: [] } as const
          const base = buildChord(note('C'), { ...parts, size: 7 }).quality
          if (!base) throw new Error(`the table has no ${triad} ${seventh} 7th`)
          const tensions = availableTensions(base).map((tension) => tension.semitones)
          for (const alteration of alterationsOf(parts)) {
            if (alteration === 'b5') continue
            expect(tensions, `${triad} ${seventh} ${alteration}`).toContain(ADDS[alteration])
          }
        }
      }
    }
  })
})
```

- [ ] **Step 4: Run the kernel's tests**

Run: `npx vitest run src/shared/lib/music`
Expected: PASS, `scale-chord.test.ts`'s "adds a 9th only where it is an available tension" included (same answers:
every 7th chord a scale stacks takes a major 9th; only the dominant takes ♭9 and #9).

- [ ] **Step 5: Commit**

```bash
npx prettier --write src/shared/lib/music/tensions.ts src/shared/lib/music/tensions.test.ts src/shared/lib/music/scale-chord.ts src/shared/lib/music/chord-parts.test.ts src/shared/lib/music/index.ts
git add src/shared/lib/music/tensions.ts src/shared/lib/music/tensions.test.ts src/shared/lib/music/scale-chord.ts src/shared/lib/music/chord-parts.test.ts src/shared/lib/music/index.ts
git commit -m "Group the twelve notes over a 7th chord as weak, strong, tensions and avoid, the owner's table the oracle, and let a scale's 9th ask it"
```

---

### Task 3: An interval's sounds

**Files:**
- Modify: `src/shared/lib/schedule/sounds.ts`
- Modify: `src/shared/lib/schedule/sounds.test.ts`
- Modify: `src/shared/lib/schedule/index.ts`

**Interfaces:**
- Produces: `INTERVAL_WAYS` (`['up','down','together']`), `type IntervalWay`,
  `intervalSounds(low: Midi, high: Midi, way: IntervalWay): NoteSound[]`.

- [ ] **Step 1: Write the failing test**

Append to `src/shared/lib/schedule/sounds.test.ts` (import `intervalSounds` from `'./sounds'`, `midi` from
`'@/shared/lib/music'` if not yet imported):

```ts
describe('intervalSounds', () => {
  const at = (sounds: readonly { midi: number; at: number }[]) =>
    sounds.map((sound) => [sound.midi, sound.at])

  it('plays the lower note then the upper going up, the upper first going down', () => {
    expect(at(intervalSounds(midi(60), midi(63), 'up'))).toEqual([
      [60, 0],
      [63, 0.6],
    ])
    expect(at(intervalSounds(midi(60), midi(63), 'down'))).toEqual([
      [63, 0],
      [60, 0.6],
    ])
  })

  it('plays both at once together', () => {
    expect(at(intervalSounds(midi(60), midi(67), 'together'))).toEqual([
      [60, 0],
      [67, 0],
    ])
  })

  it('strikes a unison’s one key twice', () => {
    expect(at(intervalSounds(midi(60), midi(60), 'up'))).toEqual([
      [60, 0],
      [60, 0.6],
    ])
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run src/shared/lib/schedule/sounds.test.ts`
Expected: FAIL (`intervalSounds` is not exported).

- [ ] **Step 3: Write it**

In `src/shared/lib/schedule/sounds.ts`, after `keySounds`:

```ts
/** The three ways an interval is heard: the lower note first, the upper first, or both at once. */
export const INTERVAL_WAYS = ['up', 'down', 'together'] as const
export type IntervalWay = (typeof INTERVAL_WAYS)[number]

const MELODIC = { gap: 0.6, duration: 1.2, velocity: 0.2 } as const

/** An interval's two keys, up, down or together: a unison's one key struck twice. */
export function intervalSounds(low: Midi, high: Midi, way: IntervalWay): NoteSound[] {
  const order = way === 'down' ? [high, low] : [low, high]
  return order.map((key, i) => ({
    kind: 'note',
    midi: key,
    at: way === 'together' ? 0 : i * MELODIC.gap,
    duration: MELODIC.duration,
    velocity: way === 'together' ? BLOCK.velocity : MELODIC.velocity,
  }))
}
```

In `src/shared/lib/schedule/index.ts`, extend the `./sounds` export with `INTERVAL_WAYS`, `intervalSounds` and
`type IntervalWay`.

- [ ] **Step 4: Run the tests**

Run: `npx vitest run src/shared/lib/schedule`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
npx prettier --write src/shared/lib/schedule/sounds.ts src/shared/lib/schedule/sounds.test.ts src/shared/lib/schedule/index.ts
git add src/shared/lib/schedule/sounds.ts src/shared/lib/schedule/sounds.test.ts src/shared/lib/schedule/index.ts
git commit -m "Sound an interval up, down or together"
```

---

### Task 4: One staff of the grand staff

**Files:**
- Modify: `src/shared/ui/score/size.ts`
- Modify: `src/shared/ui/score/engrave.ts`
- Modify: `src/shared/ui/score/engrave.test.ts`
- Modify: `src/shared/ui/score/ScoreView.tsx`
- Modify: `src/shared/ui/LazyScoreView.tsx`
- Modify: `src/shared/ui/score/index.ts`

**Interfaces:**
- Produces: `ScoreView` and `LazyScoreView` take `staff?: StaffId | undefined` (only that staff is drawn);
  `engrave(score, host, { scale, fingers, names, staff? })`; `staffHeight(staff: StaffId | undefined): number` and
  `STAFF_HEIGHT` (160) in `size.ts`.

- [ ] **Step 1: Write the failing test**

Append to the `describe('engrave')` block in `src/shared/ui/score/engrave.test.ts` (import `staffHeight` from
`'./size'`):

```ts
  it('draws one staff alone when asked, as tall as one staff', () => {
    const line = notate({
      key: { tonic: note('C'), minor: false },
      meter: '4/4',
      bars: [{ startTick: 0, beats: 4 }],
      notes: [n(60, 'C', 0, 24), n(64, 'E', 24, 24)],
      chords: [],
    })
    const host = document.createElement('div')
    const layout = engrave(line, host, { scale: 1, fingers: false, names: false, staff: 'treble' })
    expect(host.querySelector('.vf-staff-treble')).not.toBeNull()
    expect(host.querySelector('.vf-staff-bass')).toBeNull()
    expect(layout.height).toBe(staffHeight('treble'))
    expect(layout.staffBottom - layout.staffTop).toBe(40)
    expect(layout.onsets.map((onset) => onset.tick)).toEqual([0, 24])
  })

  it('draws the grand staff as tall as the space a lazy staff keeps for it', () => {
    const host = document.createElement('div')
    const layout = engrave(score, host, { scale: 1, fingers: false, names: false })
    expect(layout.height).toBe(staffHeight(undefined))
  })
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run src/shared/ui/score/engrave.test.ts`
Expected: FAIL (`staffHeight` is not exported; `staff` is not an option).

- [ ] **Step 3: Write it**

`src/shared/ui/score/size.ts`:

```ts
import type { StaffId } from '@/shared/lib/notation'

/** The engraving's height in VexFlow units: the treble staff at 0 (lines 40–80), the bass at 90 (130–170). */
export const SCORE_HEIGHT = 210
/** Where one staff alone stands, and its height: its lines at 60–100, room for ledger lines both sides. */
export const ONE_STAFF_Y = 20
export const STAFF_HEIGHT = 160

/** The height a score takes before fingers: one staff's, or the grand staff's. */
export const staffHeight = (staff: StaffId | undefined): number =>
  staff ? STAFF_HEIGHT : SCORE_HEIGHT
```

In `src/shared/ui/score/engrave.ts`:

1. Import `ONE_STAFF_Y` and `STAFF_HEIGHT` from `'./size'` beside `SCORE_HEIGHT`.
2. Add `shown` to `buildMeasure`'s options and use it:

```ts
function buildMeasure(
  score: Score,
  measure: Measure,
  previous: Measure | undefined,
  {
    fingers,
    names,
    scale,
    shown,
  }: { fingers: boolean; names: boolean; scale: number; shown: readonly StaffId[] },
): BuiltMeasure {
  const build = (staff: StaffId) =>
    shown.includes(staff)
      ? measure.staves[staff].map((voice) =>
          buildVoice(voice, { staff, measure, meter: score.meter, fingers, names }),
        )
      : []
  const staves = { treble: build('treble'), bass: build('bass') }
  const formatter = new Formatter()
  for (const staff of shown) formatter.joinVoices(staves[staff].map((built) => built.voice))
  const voices = shown.flatMap((staff) => staves[staff].map((built) => built.voice))
  const least = formatter.preCalculateMinTotalWidth(voices)
  const clefs = previous === undefined
  const time =
    !previous ||
    previous.time.count !== measure.time.count ||
    previous.time.unit !== measure.time.unit
  const probe = { measure, staves, formatter, clefs, time, width: 0 }
  const modifiers = Math.max(
    ...shown.map((staff) => {
      const stave = staveAt(
        staff,
        { x: 0, y: STAFF_Y[staff], width: LEAST_NOTES },
        probe,
        score.key,
      )
      return stave.getNoteStartX() - stave.getX()
    }),
  )
  // The notes get what they need; then the measure widens until its chord symbols fit over them.
  let notes = Math.max(LEAST_NOTES, least * SPACING + NOTE_PADDING)
  for (let pass = 0; pass < WIDEN_PASSES; pass++) {
    const short = chordShortfall(probe, voices, {
      width: modifiers + notes,
      noteStart: modifiers,
      key: score.key,
      scale,
    })
    if (short <= 1) break
    notes = Math.max(notes + 1, Math.ceil(notes * short))
  }
  return { ...probe, width: modifiers + notes }
}
```

3. Give `placesOf` the one staff:

```ts
/**
 * Where the staves stand and how tall the engraving is: one staff at `ONE_STAFF_Y` in
 * `STAFF_HEIGHT`, or the grand staff of `STAFF_Y` and `SCORE_HEIGHT`; moved down where fingers stand
 * over the top staff, apart where they stand between the staves, and taller where they stand under
 * the bottom one.
 */
function placesOf(
  built: readonly BuiltMeasure[],
  staff: StaffId | undefined,
): {
  readonly y: Readonly<Record<StaffId, number>>
  readonly height: number
} {
  const reach = (on: StaffId, side: keyof FingerReach) =>
    built.flatMap((measure) =>
      measure.staves[on].flatMap((voice) => voice.fingerReach[side] ?? []),
    )
  if (staff) {
    const y = Math.max(ONE_STAFF_Y, FINGER_MARGIN - Math.min(...reach(staff, 'above')))
    const height =
      y +
      Math.max(STAFF_HEIGHT - ONE_STAFF_Y, Math.max(...reach(staff, 'below')) + FINGER_MARGIN)
    return { y: { treble: y, bass: y }, height }
  }
  const treble = Math.max(STAFF_Y.treble, FINGER_MARGIN - Math.min(...reach('treble', 'above')))
  const trebleFloor = Math.max(BOTTOM_LINE, ...reach('treble', 'below'))
  const bassCeiling = Math.min(TOP_LINE, ...reach('bass', 'above'))
  const bass =
    treble + Math.max(STAFF_Y.bass - STAFF_Y.treble, trebleFloor + FINGER_MARGIN - bassCeiling)
  const height =
    bass +
    Math.max(SCORE_HEIGHT - STAFF_Y.bass, Math.max(...reach('bass', 'below')) + FINGER_MARGIN)
  return { y: { treble, bass }, height }
}
```

4. `drawTies(context, built, meter, shown)` loops `for (const staff of shown)` instead of `STAVES`.
5. Replace `engrave` with:

```ts
/**
 * Engraves a score into `host` as one system of measures left to right (spec §2.5), on the grand
 * staff or on `staff` alone, and says where everything is, in CSS pixels at `scale`.
 */
export function engrave(
  score: Score,
  host: HTMLDivElement,
  {
    scale,
    fingers,
    names,
    staff,
  }: { scale: number; fingers: boolean; names: boolean; staff?: StaffId | undefined },
): ScoreLayout {
  setUpVexFlow()
  host.replaceChildren()
  const shown: readonly StaffId[] = staff ? [staff] : STAVES
  const built = score.measures.map((measure, index) =>
    buildMeasure(score, measure, score.measures[index - 1], { fingers, names, scale, shown }),
  )
  const width = built.reduce((sum, measure) => sum + measure.width, 0) + END_MARGIN
  const places = placesOf(built, staff)
  const renderer = new Renderer(host, Renderer.Backends.SVG)
  renderer.resize(width * scale, places.height * scale)
  const context = renderer.getContext()
  context.scale(scale, scale)
  context.setFillStyle('currentColor')
  context.setStrokeStyle('currentColor')
  if (context instanceof SVGContext) {
    context.svg.setAttribute('fill', 'currentColor')
    context.svg.setAttribute('stroke', 'currentColor')
  }

  const measures: ScoreLayout['measures'][number][] = []
  const onsets = new Map<Tick, number>()
  let staffTop = 0
  let staffBottom = 0
  let x = 0
  for (const measure of built) {
    const drawn = shown.map((on) => ({
      staff: on,
      stave: staveAt(on, { x, y: places.y[on], width: measure.width }, measure, score.key),
    }))
    const [top] = drawn
    const bottom = drawn.at(-1)
    if (!top || !bottom) throw new RangeError('A score is engraved on at least one staff')
    const start = Math.max(...drawn.map(({ stave }) => stave.getNoteStartX()))
    for (const { stave } of drawn) stave.setNoteStartX(start).setContext(context).draw()
    // The grand staff's two staves are joined; one staff's own barlines close it.
    if (top !== bottom) {
      if (measure.clefs) {
        for (const type of ['brace', 'singleLeft'] as const) {
          new StaveConnector(top.stave, bottom.stave).setType(type).setContext(context).draw()
        }
      }
      new StaveConnector(top.stave, bottom.stave)
        .setType('singleRight')
        .setContext(context)
        .draw()
    }
    measure.formatter.formatToStave(
      shown.flatMap((on) => measure.staves[on].map((voice) => voice.voice)),
      top.stave,
    )
    for (const { staff: on, stave } of drawn) {
      context.openGroup(`staff-${on}`)
      for (const voice of measure.staves[on]) {
        voice.voice.draw(context, stave)
        for (const beam of voice.beams) beam.setContext(context).draw()
        for (const tuplet of voice.tuplets) tuplet.setContext(context).draw()
      }
      context.closeGroup()
    }
    for (const [tick, at] of onsetsIn(measure)) onsets.set(tick, at * scale)
    staffTop = top.stave.getYForLine(0) * scale
    staffBottom = bottom.stave.getYForLine(4) * scale
    measures.push({
      startTick: measure.measure.startTick,
      ticks: measure.measure.ticks,
      x: x * scale,
      width: measure.width * scale,
    })
    x += measure.width
  }
  drawTies(context, built, score.meter, shown)

  return {
    width: width * scale,
    height: places.height * scale,
    staffTop,
    staffBottom,
    measures,
    onsets: [...onsets].map(([tick, at]) => ({ tick, x: at })).sort((a, b) => a.tick - b.tick),
  }
}
```

In `src/shared/ui/score/ScoreView.tsx`: import `staffHeight` from `'./size'` in place of `SCORE_HEIGHT`; add the
prop

```ts
  /** Only this staff of the grand staff: a line in one hand, an interval, a note to read. */
  staff?: StaffId | undefined
```

pass `staff` to `engrave(score, element, { scale, fingers, names, staff })`, add `staff` to the effect's
dependencies, and size the loading state as `{ height: staffHeight(staff) * scale }`.

`src/shared/ui/LazyScoreView.tsx`: import `staffHeight` from `'./score/size'` in place of `SCORE_HEIGHT`, and keep
the space as `style={{ height: staffHeight(props.staff) * props.scale }}`.

`src/shared/ui/score/index.ts`: export `staffHeight` and `STAFF_HEIGHT` beside `SCORE_HEIGHT`.

- [ ] **Step 4: Run the score's tests and the app's staves**

Run: `npx vitest run src/shared/ui src/widgets/sheet-music src/widgets/scale-explorer src/widgets/chord-explorer`
Expected: PASS (the grand staff is drawn as before).

- [ ] **Step 5: Commit**

```bash
npx prettier --write src/shared/ui/score/size.ts src/shared/ui/score/engrave.ts src/shared/ui/score/engrave.test.ts src/shared/ui/score/ScoreView.tsx src/shared/ui/LazyScoreView.tsx src/shared/ui/score/index.ts
git add src/shared/ui/score/size.ts src/shared/ui/score/engrave.ts src/shared/ui/score/engrave.test.ts src/shared/ui/score/ScoreView.tsx src/shared/ui/LazyScoreView.tsx src/shared/ui/score/index.ts
git commit -m "Engrave one staff of the grand staff alone when a line is read on one clef"
```

---

### Task 5: The interval card

**Files:**
- Create: `src/features/play-example/index.ts`
- Create: `src/features/play-example/model/shown.ts`
- Create: `src/features/play-example/model/interval-example.ts`
- Create: `src/features/play-example/model/interval-example.test.ts`
- Create: `src/features/play-example/ui/IntervalCard.tsx`
- Modify: `src/shared/i18n/locales/en/music.ts`, `src/shared/i18n/locales/ru/music.ts`
- Modify: `src/shared/i18n/locales/en/learn.ts`, `src/shared/i18n/locales/ru/learn.ts`

**Interfaces:**
- Consumes: `INTERVALS`, `consonanceOf`, `type ReferenceInterval` (Task 1); `INTERVAL_WAYS`, `intervalSounds`,
  `type IntervalWay` (Task 3); `LazyScoreView`'s `staff` (Task 4).
- Produces (from `@/features/play-example`): `interface ShownKeys { keys: readonly Midi[]; marks: ReadonlyMap<Midi,
  KeyMark> }`; `intervalRoot(root: SpelledNote): ShownKeys`; `IntervalCard({ root: NoteParam, name:
  ReferenceInterval, onShow: (shown: ShownKeys) => void })`. Strings: `music:interval.<name>.name|short`,
  `music:consonance.<c>`, `learn:intervals.*`.

- [ ] **Step 1: Write the failing test**

`src/features/play-example/model/interval-example.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { note, noteName } from '@/shared/lib/music'
import { intervalExample, intervalRoot, tonesText } from './interval-example'

const written = (root: ReturnType<typeof note>, name: Parameters<typeof intervalExample>[1]) =>
  intervalExample(root, name).music.notes.map((n) => [n.midi, noteName(n.spelled), n.startTick])

describe('intervalExample', () => {
  it('puts the lower note on the root in octave 4 and the upper its semitones above', () => {
    const third = intervalExample(note('C'), 'm3')
    expect([third.low, third.high]).toEqual([60, 63])
    expect(third.shown.keys).toEqual([60, 63])
    expect(third.shown.marks.get(60)).toEqual({ tone: 'tonic', label: '1' })
    expect(third.shown.marks.get(63)).toEqual({ tone: 'scale', label: '♭3' })
  })

  it('writes the two notes as half notes in one bar, the upper spelled by letters', () => {
    expect(written(note('C'), 'm3')).toEqual([
      [60, 'C', 0],
      [63, 'E♭', 24],
    ])
    expect(written(note('D', -1), 'm2')).toEqual([
      [61, 'D♭', 0],
      [62, 'E𝄫', 24],
    ])
    expect(written(note('D', -1), 'm3')[1]).toEqual([64, 'F♭', 24])
    expect(written(note('F'), 'A4')[1]).toEqual([71, 'B', 24])
  })

  it('shows a unison’s one key as the tonic', () => {
    const unison = intervalExample(note('C'), 'r')
    expect(unison.shown.keys).toEqual([60])
    expect(unison.shown.marks.get(60)).toEqual({ tone: 'tonic', label: '1' })
  })

  it('reaches past the octave for a compound interval', () => {
    const thirteenth = intervalExample(note('C'), 'M13')
    expect(thirteenth.high).toBe(81)
    expect(thirteenth.shown.marks.get(81)?.label).toBe('13')
  })
})

describe('intervalRoot', () => {
  it('shows the root alone, as the tonic', () => {
    expect(intervalRoot(note('B')).keys).toEqual([71])
  })
})

describe('tonesText', () => {
  it('writes whole tones with a half as ½', () => {
    expect([0, 1, 3, 4, 21].map(tonesText)).toEqual(['0', '½', '1½', '2', '10½'])
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run src/features/play-example`
Expected: FAIL (cannot resolve `./interval-example`).

- [ ] **Step 3: Write the model, the card and its words**

`src/features/play-example/model/shown.ts`:

```ts
import type { Midi } from '@/shared/lib/music'
import type { KeyMark } from '@/shared/ui'

/** What an example puts on the page's keyboard: its keys, and how each is marked. */
export interface ShownKeys {
  readonly keys: readonly Midi[]
  readonly marks: ReadonlyMap<Midi, KeyMark>
}
```

`src/features/play-example/model/interval-example.ts`:

```ts
import {
  INTERVALS,
  midi,
  midiOf,
  note,
  spellAbove,
  TICKS_PER_BEAT,
  type IntervalName,
  type Midi,
  type SpelledNote,
} from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import type { KeyMark } from '@/shared/ui'
import type { ShownKeys } from './shown'

/** The octave an interval's lower note is written in: middle C's. */
const LOWER_OCTAVE = 4
const HALF_NOTE = 2 * TICKS_PER_BEAT

/** An interval over a root: its two keys, as the keys show them, and as a staff writes them. */
export interface IntervalExample {
  readonly low: Midi
  readonly high: Midi
  readonly shown: ShownKeys
  /** The lower note then the upper, a half note each, in a bar of 4/4 with no key signature. */
  readonly music: TimedMusic
}

const TONIC: KeyMark = { tone: 'tonic', label: '1' }

/** The root alone, in octave 4, marked as the tonic: the keys before an interval is played. */
export function intervalRoot(root: SpelledNote): ShownKeys {
  const low = midiOf(root, LOWER_OCTAVE)
  return { keys: [low], marks: new Map([[low, TONIC]]) }
}

/**
 * An interval over a root in octave 4: the upper note spelled by letter steps from the root (the
 * minor 2nd over D♭ is E𝄫, since the letters are what number an interval), the lower key marked as
 * the tonic and the upper labelled with its degree.
 */
export function intervalExample(root: SpelledNote, name: IntervalName): IntervalExample {
  const interval = INTERVALS[name]
  const upper = spellAbove(root, interval)
  const low = midiOf(root, LOWER_OCTAVE)
  const high = midi(low + interval.semitones)
  // The upper first, so a unison's one key keeps the tonic's 1.
  const marks = new Map<Midi, KeyMark>([
    [high, { tone: 'scale', label: interval.degree }],
    [low, TONIC],
  ])
  return {
    low,
    high,
    shown: { keys: high === low ? [low] : [low, high], marks },
    music: {
      key: { tonic: note('C'), minor: false },
      meter: '4/4',
      bars: [{ startTick: 0, beats: 4 }],
      notes: [
        { midi: low, spelled: root, hand: 'rh', startTick: 0, durationTicks: HALF_NOTE, roll: 0 },
        {
          midi: high,
          spelled: upper,
          hand: 'rh',
          startTick: HALF_NOTE,
          durationTicks: HALF_NOTE,
          roll: 0,
        },
      ],
      chords: [],
    },
  }
}

/** Whole tones, a half written ½: 3 semitones are 1½. */
export function tonesText(semitones: number): string {
  const whole = Math.floor(semitones / 2)
  if (semitones % 2 === 0) return String(whole)
  return whole === 0 ? '½' : `${whole}½`
}
```

`src/features/play-example/ui/IntervalCard.tsx`:

```tsx
import { Square } from 'lucide-react'
import { useId, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  consonanceOf,
  INTERVALS,
  noteFromParam,
  type NoteParam,
  type ReferenceInterval,
} from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { INTERVAL_WAYS, intervalSounds, type IntervalWay } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { LazyScoreView } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { intervalExample, tonesText } from '../model/interval-example'
import type { ShownKeys } from '../model/shown'

/** A card's staff, a little smaller than a reference's own. */
const CARD_STAFF = 0.8

/**
 * One interval over a root, as Clefs' reference writes it: its name and short name, its size and how
 * it sounds, the two notes on a staff, and Up, Down and Together, each shown on the page's keys.
 */
export function IntervalCard({
  root,
  name,
  onShow,
}: {
  root: NoteParam
  name: ReferenceInterval
  onShow: (shown: ShownKeys) => void
}) {
  const { t } = useTranslation(['learn', 'music', 'common'])
  const titleId = useId()
  const playback = usePlayback<IntervalWay>()
  const example = useMemo(() => intervalExample(noteFromParam(root), name), [root, name])
  const score = useMemo(() => notate(example.music), [example])
  const interval = INTERVALS[name]
  const facts = [
    t('learn:intervals.semitones', { n: interval.semitones }),
    t('learn:intervals.tones', { n: tonesText(interval.semitones) }),
    ...(interval.semitones > 12 ? [t('learn:intervals.inChords', { degree: interval.degree })] : []),
  ]
  return (
    <article
      aria-labelledby={titleId}
      className="flex h-full flex-col gap-3 rounded-3xl border border-border bg-card p-4"
    >
      <header className="flex items-baseline justify-between gap-3">
        <h3 id={titleId} className="text-xl">
          {t(`music:interval.${name}.name`)}
        </h3>
        <span className="shrink-0 font-semibold text-muted-foreground">
          {t(`music:interval.${name}.short`)}
        </span>
      </header>
      <div className="text-sm text-muted-foreground">
        <p className="tabular-nums">{facts.join(' · ')}</p>
        <p>{t(`music:consonance.${consonanceOf(interval)}`)}</p>
      </div>
      <LazyScoreView score={score} scale={CARD_STAFF} fingers={false} staff="treble" />
      <div className="mt-auto flex gap-2">
        {INTERVAL_WAYS.map((way) => (
          <Button
            key={way}
            variant="soft"
            className="flex-1 px-2"
            onClick={() => {
              onShow(example.shown)
              playback.toggle(way, intervalSounds(example.low, example.high, way))
            }}
          >
            {playback.playing === way ? (
              <>
                <Square data-icon="inline-start" />
                {t('common:stop')}
              </>
            ) : (
              t(`learn:intervals.${way}`)
            )}
          </Button>
        ))}
      </div>
    </article>
  )
}
```

`src/features/play-example/index.ts`:

```ts
export type { ShownKeys } from './model/shown'
export { intervalRoot } from './model/interval-example'
export { IntervalCard } from './ui/IntervalCard'
```

`src/shared/i18n/locales/en/music.ts`, after `gap`:

```ts
  // The Intervals reference's cards: each interval's name and short name.
  interval: {
    r: { name: 'Unison', short: 'P1' },
    m2: { name: 'Minor second', short: 'm2' },
    M2: { name: 'Major second', short: 'M2' },
    m3: { name: 'Minor third', short: 'm3' },
    M3: { name: 'Major third', short: 'M3' },
    P4: { name: 'Perfect fourth', short: 'P4' },
    A4: { name: 'Tritone', short: 'A4 · d5' },
    P5: { name: 'Perfect fifth', short: 'P5' },
    m6: { name: 'Minor sixth', short: 'm6' },
    M6: { name: 'Major sixth', short: 'M6' },
    m7: { name: 'Minor seventh', short: 'm7' },
    M7: { name: 'Major seventh', short: 'M7' },
    P8: { name: 'Octave', short: 'P8' },
    m9: { name: 'Minor ninth', short: 'm9' },
    M9: { name: 'Major ninth', short: 'M9' },
    A9: { name: 'Augmented ninth', short: 'A9' },
    P11: { name: 'Perfect eleventh', short: 'P11' },
    A11: { name: 'Augmented eleventh', short: 'A11' },
    m13: { name: 'Minor thirteenth', short: 'm13' },
    M13: { name: 'Major thirteenth', short: 'M13' },
  },
  consonance: {
    perfect: 'Perfect consonance',
    imperfect: 'Imperfect consonance',
    dissonance: 'Dissonance',
  },
```

`src/shared/i18n/locales/ru/music.ts`, in the same place:

```ts
  interval: {
    r: { name: 'Прима', short: 'ч1' },
    m2: { name: 'Малая секунда', short: 'м2' },
    M2: { name: 'Большая секунда', short: 'б2' },
    m3: { name: 'Малая терция', short: 'м3' },
    M3: { name: 'Большая терция', short: 'б3' },
    P4: { name: 'Чистая кварта', short: 'ч4' },
    A4: { name: 'Тритон', short: 'ув4 · ум5' },
    P5: { name: 'Чистая квинта', short: 'ч5' },
    m6: { name: 'Малая секста', short: 'м6' },
    M6: { name: 'Большая секста', short: 'б6' },
    m7: { name: 'Малая септима', short: 'м7' },
    M7: { name: 'Большая септима', short: 'б7' },
    P8: { name: 'Октава', short: 'ч8' },
    m9: { name: 'Малая нона', short: 'м9' },
    M9: { name: 'Большая нона', short: 'б9' },
    A9: { name: 'Увеличенная нона', short: 'ув9' },
    P11: { name: 'Чистая ундецима', short: 'ч11' },
    A11: { name: 'Увеличенная ундецима', short: 'ув11' },
    m13: { name: 'Малая терцдецима', short: 'м13' },
    M13: { name: 'Большая терцдецима', short: 'б13' },
  },
  consonance: {
    perfect: 'Совершенный консонанс',
    imperfect: 'Несовершенный консонанс',
    dissonance: 'Диссонанс',
  },
```

`src/shared/i18n/locales/en/learn.ts`, after `keys`:

```ts
  intervals: {
    title: 'Intervals',
    simple: 'Within the octave',
    compound: 'Past the octave',
    semitones: 'Semitones: {{n}}',
    tones: 'Tones: {{n}}',
    inChords: 'In chords: {{degree}}',
    up: 'Up',
    down: 'Down',
    together: 'Together',
  },
```

`src/shared/i18n/locales/ru/learn.ts`, in the same place:

```ts
  intervals: {
    title: 'Интервалы',
    simple: 'В пределах октавы',
    compound: 'Шире октавы',
    semitones: 'Полутонов: {{n}}',
    tones: 'Тонов: {{n}}',
    inChords: 'В аккордах: {{degree}}',
    up: 'Вверх',
    down: 'Вниз',
    together: 'Вместе',
  },
```

- [ ] **Step 4: Run the tests and the type check**

Run: `npx vitest run src/features/play-example && npm run typecheck`
Expected: PASS; `tsc` accepts every `music:interval.${name}` key (the i18n types cover each `ReferenceInterval`).

- [ ] **Step 5: Commit**

```bash
npx prettier --write src/features/play-example src/shared/i18n/locales/en/music.ts src/shared/i18n/locales/ru/music.ts src/shared/i18n/locales/en/learn.ts src/shared/i18n/locales/ru/learn.ts
git add src/features/play-example src/shared/i18n/locales/en/music.ts src/shared/i18n/locales/ru/music.ts src/shared/i18n/locales/en/learn.ts src/shared/i18n/locales/ru/learn.ts
git commit -m "Write an interval as Clefs' card: its names, size and consonance, the two notes on a staff, and played up, down or together"
```

---

### Task 6: The Intervals reference

**Files:**
- Create: `src/widgets/interval-explorer/index.ts`
- Create: `src/widgets/interval-explorer/model/interval-view.ts`
- Create: `src/widgets/interval-explorer/ui/IntervalExplorer.tsx`
- Create: `src/pages/intervals/index.ts`
- Create: `src/pages/intervals/ui/IntervalsPage.tsx`
- Create: `src/pages/intervals/ui/IntervalsPage.test.tsx`
- Modify: `src/app/routes/search.ts`, `src/app/routes/search.test.ts`
- Modify: `src/app/router.tsx`, `src/app/routes/learn-screens.ts`
- Modify: `src/pages/learn/ui/LearnPage.tsx`, `src/pages/learn/ui/LearnPage.test.tsx`

**Interfaces:**
- Consumes: `IntervalCard`, `intervalRoot`, `ShownKeys` (Task 5); `INTERVAL_GROUP_IDS`, `INTERVAL_GROUPS` (Task 1).
- Produces: `IntervalView { root: NoteParam }` (from `@/widgets/interval-explorer`); route `/learn/intervals`
  (`INTERVALS_DEFAULTS`, `validateIntervalsSearch`); `IntervalsPage`.

- [ ] **Step 1: Write the failing tests**

`src/pages/intervals/ui/IntervalsPage.test.tsx`:

```tsx
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { Sound } from '@/shared/lib/schedule'

const timed = (sounds: readonly Sound[] = []) =>
  sounds.flatMap((sound) => (sound.kind === 'note' ? [[sound.midi, sound.at]] : []))

describe('Learn → Intervals', () => {
  it('writes a card for every interval, within the octave and past it', async () => {
    await renderApp('/learn/intervals')
    const simple = await screen.findByRole('region', { name: 'Within the octave' })
    expect(
      within(simple)
        .getAllByRole('article')
        .map((card) => within(card).getByRole('heading').textContent),
    ).toEqual([
      'Unison',
      'Minor second',
      'Major second',
      'Minor third',
      'Major third',
      'Perfect fourth',
      'Tritone',
      'Perfect fifth',
      'Minor sixth',
      'Major sixth',
      'Minor seventh',
      'Major seventh',
      'Octave',
    ])
    const third = screen.getByRole('article', { name: 'Minor third' })
    expect(third).toHaveTextContent('m3')
    expect(third).toHaveTextContent('Semitones: 3 · Tones: 1½')
    expect(third).toHaveTextContent('Imperfect consonance')
    expect(screen.getByRole('article', { name: 'Tritone' })).toHaveTextContent('A4 · d5')
    const compound = screen.getByRole('region', { name: 'Past the octave' })
    expect(within(compound).getByRole('article', { name: 'Augmented ninth' })).toHaveTextContent(
      'In chords: #9',
    )
  })

  it('plays an interval up, down and together, and shows it on the keys', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/learn/intervals')
    const third = await screen.findByRole('article', { name: 'Minor third' })
    await user.click(within(third).getByRole('button', { name: 'Up' }))
    expect(timed(audio.played.at(-1)?.sounds)).toEqual([
      [60, 0],
      [63, 0.6],
    ])
    expect(within(third).getByRole('button', { name: 'Stop' })).toBeInTheDocument()
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'D sharp 4' })).toHaveTextContent('♭3')
    await user.click(within(third).getByRole('button', { name: 'Down' }))
    expect(timed(audio.played.at(-1)?.sounds)).toEqual([
      [63, 0],
      [60, 0.6],
    ])
    await user.click(within(third).getByRole('button', { name: 'Together' }))
    expect(timed(audio.played.at(-1)?.sounds)).toEqual([
      [60, 0],
      [63, 0],
    ])
  })

  it('chooses the root, kept in the URL', async () => {
    const user = userEvent.setup()
    const { router, audio } = await renderApp('/learn/intervals')
    await user.click(await screen.findByRole('combobox', { name: 'Root' }))
    await user.click(await screen.findByRole('option', { name: 'D' }))
    expect(router.state.location.search).toEqual({ root: 'D' })
    const fifth = screen.getByRole('article', { name: 'Perfect fifth' })
    await user.click(within(fifth).getByRole('button', { name: 'Together' }))
    expect(timed(audio.played.at(-1)?.sounds)).toEqual([
      [62, 0],
      [69, 0],
    ])
  })

  it('speaks Russian', async () => {
    await renderApp('/learn/intervals', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Интервалы' })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Малая терция' })).toHaveTextContent('м3')
  })
})
```

In `src/app/routes/search.test.ts`, import `INTERVALS_DEFAULTS`; add
`expect(await searchAt('/learn/intervals')).toEqual(INTERVALS_DEFAULTS)` to "fill every default for an empty URL",
and a test:

```ts
  it('respell an interval’s root as the reference spells it', async () => {
    expect(await searchAt('/learn/intervals?root=C%23')).toEqual({ root: 'Db' })
    expect(await searchAt('/learn/intervals?root=H')).toEqual(INTERVALS_DEFAULTS)
  })
```

In `src/pages/learn/ui/LearnPage.test.tsx`'s first test, add:

```ts
    expect(within(references).getByRole('link', { name: 'Intervals' })).toHaveAttribute(
      'href',
      '/learn/intervals',
    )
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/pages/intervals src/pages/learn src/app/routes/search.test.ts`
Expected: FAIL (no route `/learn/intervals`, no `INTERVALS_DEFAULTS`).

- [ ] **Step 3: Write the widget, the page and the route**

`src/widgets/interval-explorer/model/interval-view.ts`:

```ts
import type { NoteParam } from '@/shared/lib/music'

/** What the Intervals reference shows: every interval over a root. */
export interface IntervalView {
  readonly root: NoteParam
}
```

`src/widgets/interval-explorer/ui/IntervalExplorer.tsx`:

```tsx
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { IntervalCard, intervalRoot, type ShownKeys } from '@/features/play-example'
import {
  INTERVAL_GROUP_IDS,
  INTERVAL_GROUPS,
  noteFromParam,
  noteName,
  noteParam,
  PITCH_CLASSES,
  rootSpelling,
  type NoteParam,
} from '@/shared/lib/music'
import { Dropdown } from '@/shared/ui'
import type { IntervalView } from '../model/interval-view'

/**
 * Every interval over a root, Clefs' cards, within the octave and past it: the keys pinned over them
 * show the one played last, or the root.
 */
export function IntervalExplorer({
  view,
  onChange,
}: {
  view: IntervalView
  onChange: (change: Partial<IntervalView>) => void
}) {
  const { t } = useTranslation('learn')
  const id = useId()
  const [played, setPlayed] = useState<{ root: NoteParam; shown: ShownKeys } | null>(null)
  // What was played over another root no longer stands on these keys.
  const shown =
    played?.root === view.root ? played.shown : intervalRoot(noteFromParam(view.root))
  return (
    <div className="flex flex-col gap-6">
      <ExplorerKeyboard keys={shown.keys} marks={shown.marks} />
      <Dropdown
        label={t('root')}
        value={view.root}
        options={PITCH_CLASSES.map((pc) => {
          const spelled = rootSpelling(pc, false)
          return { value: noteParam(spelled), label: noteName(spelled) }
        })}
        onChange={(root) => onChange({ root })}
        className="self-start"
      />
      {INTERVAL_GROUP_IDS.map((group) => (
        <section key={group} aria-labelledby={`${id}-${group}`} className="flex flex-col gap-3">
          <h2 id={`${id}-${group}`} className="text-2xl">
            {t(`intervals.${group}`)}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INTERVAL_GROUPS[group].map((name) => (
              <li key={name}>
                <IntervalCard
                  root={view.root}
                  name={name}
                  onShow={(next) => setPlayed({ root: view.root, shown: next })}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
```

`src/widgets/interval-explorer/index.ts`:

```ts
export type { IntervalView } from './model/interval-view'
export { IntervalExplorer } from './ui/IntervalExplorer'
```

`src/pages/intervals/ui/IntervalsPage.tsx`:

```tsx
import { useNavigate, useSearch } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useGoBack } from '@/shared/lib'
import { RoundButton, ScreenHeader } from '@/shared/ui'
import { IntervalExplorer, type IntervalView } from '@/widgets/interval-explorer'

/** The Intervals reference: every interval over a chosen root, heard and written. */
export function IntervalsPage() {
  const { t } = useTranslation(['learn', 'common'])
  const view = useSearch({ from: '/shell/learn/intervals' })
  const navigate = useNavigate({ from: '/learn/intervals' })
  const back = useGoBack({ to: '/learn' })
  const onChange = (change: Partial<IntervalView>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('learn:intervals.title')}
        back={<RoundButton label={t('common:back')} icon={ArrowLeft} onClick={back} />}
      />
      <IntervalExplorer view={view} onChange={onChange} />
    </div>
  )
}
```

`src/pages/intervals/index.ts`:

```ts
export { IntervalsPage } from './ui/IntervalsPage'
```

In `src/app/routes/search.ts`: import `type IntervalView` from `'@/widgets/interval-explorer'` and `rootSpelling`
from `'@/shared/lib/music'`; after the Keys block:

```ts
// Learn → Intervals: the root in the reference's one spelling for its pitch class.
export const INTERVALS_DEFAULTS: IntervalView = { root: noteParam(note('C')) }
export function validateIntervalsSearch(input: Input<IntervalView>): IntervalView {
  const raw: Raw = input
  const read = readNote(raw.root)
  return {
    root: read ? noteParam(rootSpelling(pitchClassOf(read), false)) : INTERVALS_DEFAULTS.root,
  }
}
```

In `src/app/router.tsx`: import `INTERVALS_DEFAULTS` and `validateIntervalsSearch`; after `keysRoute`:

```ts
const intervalsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/learn/intervals',
  validateSearch: validateIntervalsSearch,
  search: { middlewares: [stripSearchParams(INTERVALS_DEFAULTS)] },
  component: lazyRouteComponent(learnScreens, 'IntervalsPage'),
})
```

and add `intervalsRoute` after `keysRoute` in the shell's children.

In `src/app/routes/learn-screens.ts`, add `export { IntervalsPage } from '@/pages/intervals'`.

In `src/pages/learn/ui/LearnPage.tsx`, import `Ruler` from `lucide-react` and add, after the Keys row:

```tsx
          <li>
            <RowLink
              title={t('learn:intervals.title')}
              icon={Ruler}
              paint="yellow"
              render={<Link to="/learn/intervals" />}
            />
          </li>
```

- [ ] **Step 4: Run the tests, the checks and the build**

Run: `npx vitest run src/pages/intervals src/pages/learn src/app && npm run typecheck && npm run lint`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
npx prettier --write src/widgets/interval-explorer src/pages/intervals src/app/routes/search.ts src/app/routes/search.test.ts src/app/router.tsx src/app/routes/learn-screens.ts src/pages/learn/ui/LearnPage.tsx src/pages/learn/ui/LearnPage.test.tsx
git add src/widgets/interval-explorer src/pages/intervals src/app/routes/search.ts src/app/routes/search.test.ts src/app/router.tsx src/app/routes/learn-screens.ts src/pages/learn/ui/LearnPage.tsx src/pages/learn/ui/LearnPage.test.tsx
git commit -m "Add the Intervals reference to Learn: every interval over a chosen root, on the keys and a staff"
```

---

### Task 7: The Available tensions reference

**Files:**
- Create: `src/widgets/tension-explorer/index.ts`
- Create: `src/widgets/tension-explorer/model/tension-view.ts`
- Create: `src/widgets/tension-explorer/model/tension-keys.ts`
- Create: `src/widgets/tension-explorer/model/tension-keys.test.ts`
- Create: `src/widgets/tension-explorer/ui/TensionExplorer.tsx`
- Create: `src/widgets/tension-explorer/ui/TensionGroupCard.tsx`
- Create: `src/pages/tensions/index.ts`
- Create: `src/pages/tensions/ui/TensionsPage.tsx`
- Create: `src/pages/tensions/ui/TensionsPage.test.tsx`
- Modify: `src/app/routes/search.ts`, `src/app/routes/search.test.ts`, `src/app/router.tsx`,
  `src/app/routes/learn-screens.ts`
- Modify: `src/pages/learn/ui/LearnPage.tsx`, `src/pages/learn/ui/LearnPage.test.tsx`
- Modify: `src/shared/i18n/locales/en/learn.ts`, `src/shared/i18n/locales/ru/learn.ts`

**Interfaces:**
- Consumes: `tensionTones`, `TENSION_CHORDS`, `TENSION_GROUPS`, `type TensionChord`, `type TensionTone` (Task 2);
  `type ShownKeys` (Task 5).
- Produces: `TensionView { root: NoteParam; chord: TensionChord }`; `tensionChord(root, quality): ShownKeys`,
  `withNoteOnTop(chord: ShownKeys, tone: TensionTone): ShownKeys`; route `/learn/tensions`
  (`TENSIONS_DEFAULTS`, `validateTensionsSearch`); `TensionsPage`.

- [ ] **Step 1: Write the failing tests**

`src/widgets/tension-explorer/model/tension-keys.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { note, tensionTones } from '@/shared/lib/music'
import { tensionChord, withNoteOnTop } from './tension-keys'

const C = note('C')
const toneOf = (degree: string) => {
  const tone = tensionTones(C, 'd7').find((each) => each.degree === degree)
  if (!tone) throw new Error(`C7 has no ${degree}`)
  return tone
}

describe('tensionChord', () => {
  it('places the chord from its root at middle C, each key marked by role and degree', () => {
    const chord = tensionChord(C, 'd7')
    expect(chord.keys).toEqual([60, 64, 67, 70])
    expect(chord.marks.get(70)).toEqual({ tone: '7th', label: '♭7' })
  })
})

describe('withNoteOnTop', () => {
  it('puts a note on the nearest key above the chord, marked by its role and degree', () => {
    const chord = tensionChord(C, 'd7')
    const ninth = withNoteOnTop(chord, toneOf('9'))
    expect(ninth.keys).toEqual([60, 64, 67, 70, 74])
    expect(ninth.marks.get(74)).toEqual({ tone: '9th', label: '9' })
    expect(withNoteOnTop(chord, toneOf('♭7')).keys.at(-1)).toBe(82)
    expect(withNoteOnTop(chord, toneOf('1')).keys.at(-1)).toBe(72)
  })
})
```

`src/pages/tensions/ui/TensionsPage.test.tsx`:

```tsx
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { Sound } from '@/shared/lib/schedule'

const notes = (sounds: readonly Sound[] = []) =>
  sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.midi] : []))
const chips = (group: string) =>
  within(screen.getByRole('region', { name: group }))
    .getAllByRole('button')
    .map((chip) => chip.textContent)

describe('Learn → Available tensions', () => {
  it('groups the notes over C7 as the owner’s table does', async () => {
    await renderApp('/learn/tensions')
    await screen.findByRole('region', { name: 'Weak' })
    expect(chips('Weak')).toEqual(['1 C', '5 G'])
    expect(chips('Strong')).toEqual(['3 E', '♭7 B♭'])
    expect(chips('Tensions')).toEqual(['♭9 D♭', '9 D', '#9 D#', '#11 F#', '♭13 A♭', '13 A'])
    expect(chips('Avoid')).toEqual(['11 F', '7 B'])
  })

  it('plays the chord with a note on top and shows it on the keys', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/learn/tensions')
    const ninth = await screen.findByRole('button', { name: '9 D' })
    await user.click(ninth)
    expect(notes(audio.played.at(-1)?.sounds)).toEqual([60, 64, 67, 70, 74])
    expect(ninth).toHaveAttribute('aria-pressed', 'true')
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'D5' })).toHaveTextContent('9')
  })

  it('chooses a chord and a root, kept in the URL, and drops the note shown over the last chord', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/tensions')
    await user.click(await screen.findByRole('button', { name: '9 D' }))
    await user.click(screen.getByRole('combobox', { name: 'Chord' }))
    await user.click(await screen.findByRole('option', { name: 'Cm7 Minor 7th' }))
    expect(router.state.location.search).toEqual({ chord: 'm7' })
    expect(chips('Strong')).toEqual(['♭3 E♭', '♭7 B♭'])
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'D5' })).not.toHaveTextContent('9')
    expect(screen.getByRole('button', { name: '9 D' })).toHaveAttribute('aria-pressed', 'false')
    await user.click(screen.getByRole('combobox', { name: 'Root' }))
    await user.click(await screen.findByRole('option', { name: 'D' }))
    expect(router.state.location.search).toEqual({ chord: 'm7', root: 'D' })
    expect(chips('Strong')).toEqual(['♭3 F', '♭7 C'])
  })

  it('speaks Russian', async () => {
    await renderApp('/learn/tensions', { locale: 'ru' })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Доступные опции' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Избегаемые' })).toBeInTheDocument()
  })
})
```

In `src/app/routes/search.test.ts`, import `TENSIONS_DEFAULTS`; add
`expect(await searchAt('/learn/tensions')).toEqual(TENSIONS_DEFAULTS)` to the defaults test, and:

```ts
  it('respell a tension chord’s root by the chord, and fall back from an unknown chord', async () => {
    expect(await searchAt('/learn/tensions?chord=m7&root=Db')).toEqual({ chord: 'm7', root: 'C#' })
    expect(await searchAt('/learn/tensions?chord=maj7&root=C%23')).toEqual({
      chord: 'maj7',
      root: 'Db',
    })
    expect(await searchAt('/learn/tensions?chord=n9')).toEqual(TENSIONS_DEFAULTS)
  })
```

In `src/pages/learn/ui/LearnPage.test.tsx`'s first test, add:

```ts
    expect(within(references).getByRole('link', { name: 'Available tensions' })).toHaveAttribute(
      'href',
      '/learn/tensions',
    )
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/widgets/tension-explorer src/pages/tensions src/pages/learn src/app/routes/search.test.ts`
Expected: FAIL (no `./tension-keys`, no route `/learn/tensions`).

- [ ] **Step 3: Write the widget, the page, the route and the words**

`src/widgets/tension-explorer/model/tension-view.ts`:

```ts
import type { NoteParam, TensionChord } from '@/shared/lib/music'

/** What the Available tensions reference shows: a 7th chord on a root, and the twelve notes over it. */
export interface TensionView {
  readonly root: NoteParam
  readonly chord: TensionChord
}
```

`src/widgets/tension-explorer/model/tension-keys.ts`:

```ts
import type { ShownKeys } from '@/features/play-example'
import {
  midi,
  pitchClass,
  placeChord,
  spellChord,
  type Midi,
  type SpelledNote,
  type TensionChord,
  type TensionTone,
} from '@/shared/lib/music'
import type { KeyMark } from '@/shared/ui'

/** A chord in root position from its root at or above middle C, each key marked by role and degree. */
export function tensionChord(root: SpelledNote, quality: TensionChord): ShownKeys {
  const { rh } = placeChord(spellChord(root, quality), { inversion: 0, bothHands: false })
  return {
    keys: rh.map((placed) => placed.midi),
    marks: new Map(
      rh.map((placed) => [placed.midi, { tone: placed.tone.role, label: placed.tone.degree }]),
    ),
  }
}

/** The chord with a note on top: the nearest key above its highest with that note, marked by its role and degree. */
export function withNoteOnTop(chord: ShownKeys, tone: TensionTone): ShownKeys {
  const above = Math.max(...chord.keys) + 1
  const top = midi(above + pitchClass(tone.pitchClass - above))
  const marks = new Map<Midi, KeyMark>(chord.marks)
  marks.set(top, { tone: tone.role, label: tone.degree })
  return { keys: [...chord.keys, top], marks }
}
```

`src/widgets/tension-explorer/ui/TensionGroupCard.tsx`:

```tsx
import { Square } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { noteName, type TensionGroup, type TensionTone } from '@/shared/lib/music'
import { ROLE_BG } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** An avoid note's degree stands on the card's own sand: its role's colour would call it a chord tone. */
const AVOID_DEGREE = 'bg-muted text-foreground'

/**
 * One of the table's four groups: its name, what its notes do, and each note as a chip that plays the
 * chord with it on top, pressed while it sounds.
 */
export function TensionGroupCard({
  group,
  tones,
  isPlaying,
  onPlay,
}: {
  group: TensionGroup
  tones: readonly TensionTone[]
  /** Whether this chord's sound with `tone` on top still plays. */
  isPlaying: (tone: TensionTone) => boolean
  onPlay: (tone: TensionTone) => void
}) {
  const { t } = useTranslation('learn')
  const id = useId()
  return (
    <section
      aria-labelledby={id}
      className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4"
    >
      <hgroup>
        <h2 id={id} className="text-xl">
          {t(`tensions.group.${group}.title`)}
        </h2>
        <p className="text-sm text-muted-foreground">{t(`tensions.group.${group}.says`)}</p>
      </hgroup>
      <ul className="flex flex-wrap gap-2">
        {tones.map((tone) => {
          const pressed = isPlaying(tone)
          return (
            <li key={tone.pitchClass}>
              <Button
                variant="outline"
                aria-pressed={pressed}
                className="relative gap-2 pr-3 pl-1 aria-pressed:bg-secondary aria-pressed:text-secondary-foreground"
                onClick={() => onPlay(tone)}
              >
                {pressed ? <Square aria-hidden className="absolute top-1 right-1 size-2.5" /> : null}
                <span
                  className={cn(
                    'grid size-9 place-items-center rounded-lg text-sm font-bold',
                    group === 'avoid' ? AVOID_DEGREE : cn(ROLE_BG[tone.role], 'text-on-role'),
                  )}
                >
                  {tone.degree}
                </span>{' '}
                <span>{noteName(tone.note)}</span>
              </Button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
```

`src/widgets/tension-explorer/ui/TensionExplorer.tsx`:

```tsx
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import type { ShownKeys } from '@/features/play-example'
import {
  chordRootSpelling,
  noteFromParam,
  noteName,
  noteParam,
  PITCH_CLASSES,
  qualityIntervals,
  qualitySuffix,
  TENSION_CHORDS,
  TENSION_GROUPS,
  tensionTones,
  type TensionTone,
} from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { Dropdown } from '@/shared/ui'
import { tensionChord, withNoteOnTop } from '../model/tension-keys'
import type { TensionView } from '../model/tension-view'
import { TensionGroupCard } from './TensionGroupCard'

/**
 * A 7th chord on a root, and the twelve notes over it in the owner's table's four groups: weak,
 * strong, tensions and avoid. A note plays the chord with it on top, on the keys pinned above.
 */
export function TensionExplorer({
  view,
  onChange,
}: {
  view: TensionView
  onChange: (change: Partial<TensionView>) => void
}) {
  const { t } = useTranslation(['learn', 'music'])
  const playback = usePlayback<string>()
  const [played, setPlayed] = useState<{ view: TensionView; shown: ShownKeys } | null>(null)
  const root = noteFromParam(view.root)
  const chord = tensionChord(root, view.chord)
  // A note played over another chord or root no longer stands on these keys.
  const shown =
    played?.view.root === view.root && played.view.chord === view.chord ? played.shown : chord
  const tones = tensionTones(root, view.chord)
  const intervals = qualityIntervals(view.chord)
  // A chip's sound is its chord's and root's: after a change, no chip of the new chord is pressed.
  const idOf = (tone: TensionTone) => `${view.root} ${view.chord} ${tone.pitchClass}`
  return (
    <div className="flex flex-col gap-6">
      <ExplorerKeyboard keys={shown.keys} marks={shown.marks} />
      <div className="flex flex-wrap gap-2">
        <Dropdown
          label={t('learn:tensions.chord')}
          value={view.chord}
          options={TENSION_CHORDS.map((quality) => ({
            value: quality,
            label: noteName(root) + qualitySuffix(quality),
            detail: t(`music:quality.${quality}`),
          }))}
          onChange={(next) => onChange({ chord: next })}
        />
        <Dropdown
          label={t('learn:root')}
          value={view.root}
          options={PITCH_CLASSES.map((pc) => {
            const spelled = chordRootSpelling(pc, intervals)
            return { value: noteParam(spelled), label: noteName(spelled) }
          })}
          onChange={(next) => onChange({ root: next })}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {TENSION_GROUPS.map((group) => (
          <TensionGroupCard
            key={group}
            group={group}
            tones={tones.filter((tone) => tone.group === group)}
            isPlaying={(tone) => playback.playing === idOf(tone)}
            onPlay={(tone) => {
              const next = withNoteOnTop(chord, tone)
              setPlayed({ view, shown: next })
              playback.toggle(idOf(tone), chordSounds(next.keys, { arpeggio: false }))
            }}
          />
        ))}
      </div>
    </div>
  )
}
```

`src/widgets/tension-explorer/index.ts`:

```ts
export type { TensionView } from './model/tension-view'
export { TensionExplorer } from './ui/TensionExplorer'
```

`src/pages/tensions/ui/TensionsPage.tsx`:

```tsx
import { useNavigate, useSearch } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useGoBack } from '@/shared/lib'
import { RoundButton, ScreenHeader } from '@/shared/ui'
import { TensionExplorer, type TensionView } from '@/widgets/tension-explorer'

/** The Available tensions reference: the owner's table, computed for a 7th chord on any root. */
export function TensionsPage() {
  const { t } = useTranslation(['learn', 'common'])
  const view = useSearch({ from: '/shell/learn/tensions' })
  const navigate = useNavigate({ from: '/learn/tensions' })
  const back = useGoBack({ to: '/learn' })
  const onChange = (change: Partial<TensionView>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('learn:tensions.title')}
        back={<RoundButton label={t('common:back')} icon={ArrowLeft} onClick={back} />}
      />
      <TensionExplorer view={view} onChange={onChange} />
    </div>
  )
}
```

`src/pages/tensions/index.ts`:

```ts
export { TensionsPage } from './ui/TensionsPage'
```

In `src/app/routes/search.ts`: import `type TensionView` from `'@/widgets/tension-explorer'`, and `chordRootSpelling`,
`qualityIntervals`, `TENSION_CHORDS` from `'@/shared/lib/music'`; after the Intervals block:

```ts
// Learn → Available tensions: the root spelled by the chord's one rule, as the Chords reference's.
const isTensionChord = isOneOf(TENSION_CHORDS)
export const TENSIONS_DEFAULTS: TensionView = { root: noteParam(note('C')), chord: 'd7' }
export function validateTensionsSearch(input: Input<TensionView>): TensionView {
  const raw: Raw = input
  const chord = valueOr(isTensionChord, raw.chord, TENSIONS_DEFAULTS.chord)
  const read = readNote(raw.root)
  return {
    root: read
      ? noteParam(chordRootSpelling(pitchClassOf(read), qualityIntervals(chord)))
      : TENSIONS_DEFAULTS.root,
    chord,
  }
}
```

In `src/app/router.tsx`: import `TENSIONS_DEFAULTS` and `validateTensionsSearch`; after `intervalsRoute`:

```ts
const tensionsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/learn/tensions',
  validateSearch: validateTensionsSearch,
  search: { middlewares: [stripSearchParams(TENSIONS_DEFAULTS)] },
  component: lazyRouteComponent(learnScreens, 'TensionsPage'),
})
```

and add `tensionsRoute` after `intervalsRoute` in the shell's children.

In `src/app/routes/learn-screens.ts`, add `export { TensionsPage } from '@/pages/tensions'`.

In `src/pages/learn/ui/LearnPage.tsx`, import `Layers` from `lucide-react` and add, after the Intervals row:

```tsx
          <li>
            <RowLink
              title={t('learn:tensions.title')}
              icon={Layers}
              paint="grass"
              render={<Link to="/learn/tensions" />}
            />
          </li>
```

`src/shared/i18n/locales/en/learn.ts`, after `intervals`:

```ts
  tensions: {
    title: 'Available tensions',
    chord: 'Chord',
    group: {
      weak: { title: 'Weak', says: 'They add nothing to its sound.' },
      strong: { title: 'Strong', says: 'They name the chord.' },
      tension: { title: 'Tensions', says: 'They colour it.' },
      avoid: { title: 'Avoid', says: 'They clash with it.' },
    },
  },
```

`src/shared/i18n/locales/ru/learn.ts`, in the same place:

```ts
  tensions: {
    title: 'Доступные опции',
    chord: 'Аккорд',
    group: {
      weak: { title: 'Слабые', says: 'Ничего не добавляют к звучанию.' },
      strong: { title: 'Сильные', says: 'Называют аккорд.' },
      tension: { title: 'Опции', says: 'Окрашивают его.' },
      avoid: { title: 'Избегаемые', says: 'Спорят с ним.' },
    },
  },
```

- [ ] **Step 4: Run the tests, the checks and the build**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`
Expected: all PASS; the build emits the Learn chunk without VexFlow (the cards' staves load `ScoreView` lazily).

- [ ] **Step 5: Commit**

```bash
npx prettier --write src/widgets/tension-explorer src/pages/tensions src/app/routes/search.ts src/app/routes/search.test.ts src/app/router.tsx src/app/routes/learn-screens.ts src/pages/learn/ui/LearnPage.tsx src/pages/learn/ui/LearnPage.test.tsx src/shared/i18n/locales/en/learn.ts src/shared/i18n/locales/ru/learn.ts
git add src/widgets/tension-explorer src/pages/tensions src/app/routes/search.ts src/app/routes/search.test.ts src/app/router.tsx src/app/routes/learn-screens.ts src/pages/learn/ui/LearnPage.tsx src/pages/learn/ui/LearnPage.test.tsx src/shared/i18n/locales/en/learn.ts src/shared/i18n/locales/ru/learn.ts
git commit -m "Add the Available tensions reference to Learn: the owner's table for nine 7th chords on any root, each note played on top"
```

---

### Task 8: Record what 5.1 decided

**Files:**
- Create: `docs/adr/0017-learn-computes-its-references.md`
- Modify: `docs/UBIQUITOUS_LANGUAGE.md`, `DESIGN.md`, `docs/CODE_STYLE.md`, `CLAUDE.md`, `PRODUCT.md`,
  `docs/superpowers/specs/2026-09-25-next-features-roadmap-design.md` (status line)

- [ ] **Step 1: Write ADR 0017**

`docs/adr/0017-learn-computes-its-references.md`:

```markdown
# ADR 0017 — Learn's references compute what they show: intervals and available tensions

- **Status:** accepted · **Date:** 2026-09-29 · **Amends:** ADR 0013 (a staff outside the Player may show one
  clef), ADR 0014 (available tensions have one source)

## Context

Sub-project 5 (spec `2026-09-29-learn-lessons-references-tools-design.md`) begins with Learn's references: Clefs'
Intervals Reference, which the owner sent, and the owner's reharmonisation table of weak, strong, jazz and
unacceptable notes over a chord. The roadmap also listed a Chord symbols reference, written before the Chords
reference became a builder that writes every way a chord is written. Available tensions already lived in two rules:
the builder's alterations and `scaleChordAt`'s 9ths.

## Decision

- **Intervals** (`/learn/intervals?root=D`): a card for each interval from the unison to the octave and for the
  compound intervals a chord symbol names (♭9 to 13), each with its names, size and consonance, written on one staff
  and played up, down and together; the upper note spelled by letters from the root. The 12th is left out (no chord
  names one) and the augmented 9th added (chords write #9).
- **Available tensions** (`/learn/tensions?root=C&chord=d7`): nine 7th chords, the twelve notes over each in the
  table's four groups, the owner's table the test's oracle for Maj7, m7 and 7. A note that is not a chord tone is
  named by the degree its semitones make, so the table's "♭11" and "#13" read as the 3rd and ♭7 they sound as.
- **`tensions.ts` is the one source of available tensions:** `scaleChordAt` asks it for a 9th, and the builder's
  alterations are held to it by a test.
- **A staff outside the Player may show one clef** (`staff="treble"`), drawn at its own height; the Player and the
  references that write both hands keep the grand staff.
- **No Chord symbols reference:** it would repeat the Chords reference, as Symbols once did; the lesson teaches
  reading symbols.
- **The interval card is a feature** (`features/play-example`), so a lesson's example is the reference's own card.

## Consequences

- Reharmonise (5.3) reads the same groups from the note's side; lessons (5.2) embed the interval card and link to
  both references.
- A reading lesson writes its notes on one staff.
```

- [ ] **Step 2: Update the glossary, DESIGN.md, CODE_STYLE, CLAUDE.md, PRODUCT.md and the roadmap**

`docs/UBIQUITOUS_LANGUAGE.md`:
- In **Music**, add rows:
  - `| **Interval** (reference) | A distance between two notes named and heard: its short name (m3), semitones and whole tones, consonance, written on a staff and played Up, Down and Together; the Intervals reference's card | distance, step |`
  - `| **Consonance** | How an interval sounds, by its simple interval: perfect (unison, 4th, 5th, octave), imperfect (3rds, 6ths) or a dissonance (2nds, 7ths, augmented and diminished) | harmony |`
  - `| **Available tension** | A note over a 7th chord that colours it (`tensions.ts`); with the chord tones (Weak: root, perfect 5th; Strong: 3rd or suspension, 7th) and the Avoid notes, the four groups of the owner's table | extension (a built chord's), option (in code) |`
  - `| **Avoid note** | A note over a chord that clashes with one of its tones, named by the degree its semitones make (the 11 over a major 3rd) | wrong note |`
- In **Places and screens**, change **Learn**'s meaning to "The place of lessons and references: Chords, Scales,
  Keys, Intervals, Available tensions (later tools)" and **Reference**'s to "A Learn page to look things up in:
  Chords, Scales, Keys, Intervals, Available tensions".

`DESIGN.md` (the design system part):
- In **Components → Cards and sheets**, add: `- **Interval card** (card paper, 14px, the 1px soft line, 16px inset):
  the interval's name (Literata 600 20px) with its short name at the right in soft ink, its facts and consonance in
  soft ink (14px), its two notes on one staff (0.8), and Up · Down · Together as three soft buttons along its foot,
  each turning into Stop. The Intervals reference grids them one, two or three across.`
- Add: `- **Tension chip** (the 44px outline button of a grid item): its degree on its role's colour (an avoid
  note's on sand, so no chord role is spent on it), then its note; pressed (sky mist, a small square) while the chord
  plays with it on top. The Available tensions reference sets them in four cards, Weak · Strong · Tensions · Avoid,
  each with a line of what its notes do.`
- In **The sheet (the Player)**'s "Outside the Player" item, add: "an interval card writes its two notes on the treble
  staff alone (`staff`), 160 units tall with room for ledger lines both sides".
- In **Layout**'s two-column list, add: "**Intervals and Available tensions:** the keys pinned across the width, the
  cards in three columns (Intervals) or two (the tensions' four groups)."

`docs/CODE_STYLE.md` §8, add two bullets:
- `- **Available tensions are \`tensions.ts\`'s** (\`tensionTones\`, \`availableTensions\`): the Available tensions
  reference, \`scaleChordAt\`'s 9ths and Reharmonise ask it; the builder's alterations are held to it by a test.
  Never write a second table of what a chord takes.`
- `- **A line in one hand is written on one staff:** \`LazyScoreView\`'s \`staff\` draws only that staff of the grand
  staff (an interval, a note to read); music for both hands keeps the grand staff.`

`CLAUDE.md` (Architecture): add to the router's line the references Intervals (`/learn/intervals`) and Available
tensions (`/learn/tensions`) beside Keys; add `pages/intervals` and `pages/tensions` to the pages' line; add
`interval-explorer` (the Intervals reference's cards over a root) and `tension-explorer` (a 7th chord's twelve notes
in four groups, each played on top) to the widgets; add `play-example` (the examples a reference and a lesson share:
`IntervalCard`, `ShownKeys`) to the features; in `music`'s list add "`interval-facts.ts`, the reference's intervals
and `consonanceOf`; `tensions.ts`, the one source of available tensions"; in `ui` note `LazyScoreView`'s `staff`.

`PRODUCT.md` (Capabilities): in Learn's references add "Intervals, every interval over a root on a staff and heard up,
down and together; Available tensions, the twelve notes over a 7th chord as weak, strong, tensions and avoid".

The roadmap's **Built** line: add "Sub-project 5's part 5.1 (the Intervals and Available tensions references): ADR
0017."

- [ ] **Step 3: Check the docs format and the whole app**

Run: `npx prettier --check docs CLAUDE.md DESIGN.md PRODUCT.md && npm run typecheck && npm run lint && npm run test`
Expected: PASS (fix a Prettier complaint with `npx prettier --write` on the file it names).

- [ ] **Step 4: Commit**

```bash
git add docs/adr/0017-learn-computes-its-references.md docs/UBIQUITOUS_LANGUAGE.md DESIGN.md docs/CODE_STYLE.md CLAUDE.md PRODUCT.md docs/superpowers/specs/2026-09-25-next-features-roadmap-design.md
git commit -m "Record Learn's Intervals and Available tensions references: ADR 0017, the glossary, DESIGN, CODE_STYLE, CLAUDE.md and the roadmap"
```
