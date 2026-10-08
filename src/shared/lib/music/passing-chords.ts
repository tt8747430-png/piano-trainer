import {
  type Chord,
  type ChordQuality,
  qualityIntervals,
  qualityRootSpelling,
  spellChord,
} from './chord'
import { INTERVALS, spellAbove, spellBelow, type IntervalName } from './interval'
import type { Key } from './key'
import { pitchClassOf, plainRoot, type SpelledNote } from './note'
import { pitchClass, type PitchClass } from './pitch'
import { keyScale, spellScale, tonesInKey } from './scale'
import { scaleChordAt } from './scale-chord'

/**
 * The categories of passing chords, in the order they are shown: The Ultimate Piano's (roadmap §10.2),
 * its Diatonic the chords of the key itself.
 */
export const PASSING_CATEGORIES = [
  'dominant',
  'functional',
  'chromatic',
  'diminished',
  'diatonic',
  'cadence',
] as const
export type PassingCategory = (typeof PASSING_CATEGORIES)[number]

/** The ways to get from one chord to another, each a rule from the target's root. */
export const PASSING_KINDS = [
  'secondaryDominant',
  'tritoneSub',
  'secondaryTwoFive',
  'approachBelow',
  'walkUp',
  'walkDown',
  'doubleApproach',
  'diminishedApproach',
  'diatonicWalk',
  'backdoor',
  'backdoorTwoFive',
  'plagal',
  'minorPlagal',
  'gospelWalkUp',
] as const
export type PassingKind = (typeof PASSING_KINDS)[number]

const CATEGORY_OF: Readonly<Record<PassingKind, PassingCategory>> = {
  secondaryDominant: 'dominant',
  tritoneSub: 'dominant',
  secondaryTwoFive: 'functional',
  approachBelow: 'chromatic',
  walkUp: 'chromatic',
  walkDown: 'chromatic',
  doubleApproach: 'chromatic',
  diminishedApproach: 'diminished',
  diatonicWalk: 'diatonic',
  backdoor: 'cadence',
  backdoorTwoFive: 'cadence',
  plagal: 'cadence',
  minorPlagal: 'cadence',
  gospelWalkUp: 'cadence',
}

/** A way between two chords: the chords that go between them. */
export interface PassingChords {
  readonly kind: PassingKind
  readonly category: PassingCategory
  readonly chords: readonly Chord[]
}

/** A chromatic walk moves its bass two to four semitones: one to three chords between. */
const WALK = { least: 2, most: 4 } as const

const isMinor = (chord: Chord): boolean =>
  qualityIntervals(chord.quality).some((interval) => interval.degree === '♭3')

const same = (a: Chord, b: Chord): boolean =>
  pitchClassOf(a.root) === pitchClassOf(b.root) && a.quality === b.quality

const on = (root: SpelledNote, quality: ChordQuality): Chord => ({ root: plainRoot(root), quality })

/** A walk through the key puts one or two of its chords between: its ends a third or a fourth apart. */
const STEPS_BETWEEN = { least: 1, most: 2 } as const

/**
 * The key's own triads on the scale steps between two chords whose roots are the key's, by the shorter
 * way round: C, Dm, Em, F going up, C, B°, Am, G coming down.
 */
function diatonicWalk(from: Chord, to: Chord, key: Key): Chord[] | null {
  const kind = keyScale(key)
  const scale = spellScale(key.tonic, kind)
  const degreeOf = (chord: Chord) =>
    scale.findIndex((tone) => tone.pitchClass === pitchClassOf(chord.root))
  const start = degreeOf(from)
  const end = degreeOf(to)
  if (start < 0 || end < 0) return null
  const up = (end - start + scale.length) % scale.length
  const steps = up <= scale.length / 2 ? up : up - scale.length
  const between = Math.abs(steps) - 1
  if (between < STEPS_BETWEEN.least || between > STEPS_BETWEEN.most) return null
  return Array.from({ length: between }, (_, i) =>
    scaleChordAt(
      key.tonic,
      kind,
      (start + Math.sign(steps) * (i + 1) + scale.length) % scale.length,
      3,
    ),
  )
}

/**
 * The chords that can pass between two in a key, by The Ultimate Piano's rules, each an interval from
 * To's root spelled by letters and then named plainly: the V7 of To and its tritone substitute; To's
 * ii–V (a half-diminished ii before a minor To); a dominant a half step below; the bass walking up or
 * down by half steps when From is two to four semitones away, each dominant's root spelled as the app
 * spells a chord's root; To approached from both half steps, or by the diminished 7th below; the
 * key's own chords on the steps between (`diatonicWalk`); the plagal IV (a minor To's own iv); and
 * what a major To borrows from its minor, the backdoor ♭VII7, alone and after its ivm7 (the backdoor
 * ii–V), the minor plagal iv, and the gospel walk-up ♭VI–♭VII. A way whose chords repeat From or To, or repeat an earlier way, is left out.
 */
export function passingChords(from: Chord, to: Chord, key: Key): PassingChords[] {
  const up = (name: IntervalName) => spellAbove(to.root, INTERVALS[name])
  const down = (name: IntervalName) => spellBelow(to.root, INTERVALS[name])
  const minor = isMinor(to)
  const dominant = on(up('P5'), 'd7')
  const fromPc = pitchClassOf(from.root)
  const rise = pitchClass(pitchClassOf(to.root) - fromPc)
  const fall = pitchClass(fromPc - pitchClassOf(to.root))
  const walkingDominant = (pc: PitchClass): Chord => ({
    root: qualityRootSpelling(pc, 'd7'),
    quality: 'd7',
  })
  const walk = (span: number, step: 1 | -1): Chord[] | null =>
    span >= WALK.least && span <= WALK.most
      ? Array.from({ length: span - 1 }, (_, i) =>
          walkingDominant(pitchClass(fromPc + step * (i + 1))),
        )
      : null
  const ways: Readonly<Record<PassingKind, readonly Chord[] | null>> = {
    secondaryDominant: [dominant],
    tritoneSub: [on(up('m2'), 'd7')],
    secondaryTwoFive: [on(up('M2'), minor ? 'hd' : 'm7'), dominant],
    approachBelow: [on(down('m2'), 'd7')],
    walkUp: walk(rise, 1),
    walkDown: walk(fall, -1),
    doubleApproach: [on(down('m2'), 'd7'), on(up('m2'), 'o7')],
    diminishedApproach: [on(down('m2'), 'o7')],
    diatonicWalk: diatonicWalk(from, to, key),
    backdoor: minor ? null : [on(up('m7'), 'd7')],
    backdoorTwoFive: minor ? null : [on(up('P4'), 'm7'), on(up('m7'), 'd7')],
    plagal: [on(up('P4'), minor ? 'min' : 'maj')],
    minorPlagal: minor ? null : [on(up('P4'), 'min')],
    gospelWalkUp: minor ? null : [on(up('m6'), 'maj'), on(up('m7'), 'maj')],
  }
  const kept: PassingChords[] = []
  for (const kind of PASSING_KINDS) {
    const chords = ways[kind]
    if (!chords || chords.some((chord) => same(chord, from) || same(chord, to))) continue
    const repeats = kept.some(
      (way) =>
        way.chords.length === chords.length &&
        way.chords.every((chord, i) => {
          const other = chords[i]
          return other !== undefined && same(chord, other)
        }),
    )
    if (!repeats) kept.push({ kind, category: CATEGORY_OF[kind], chords })
  }
  return kept
}

/** Whether every tone of a chord is one of the key's notes, spelled as the key spells it. */
export const chordInKey = (chord: Chord, key: Key): boolean =>
  tonesInKey(spellChord(chord.root, chord.quality), key)
