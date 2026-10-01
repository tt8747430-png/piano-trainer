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
import { tonesInKey } from './scale'

/** The Ultimate Piano's categories of passing chords (roadmap §10.2), in the order they are shown. */
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
  'subdominant',
  'backdoor',
  'plagal',
  'minorPlagal',
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
  subdominant: 'diatonic',
  backdoor: 'cadence',
  plagal: 'cadence',
  minorPlagal: 'cadence',
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

/**
 * The chords that can pass between two, by The Ultimate Piano's rules, each an interval from To's
 * root spelled by letters and then named plainly: the V7 of To and its tritone substitute; To's ii–V
 * (a half-diminished ii before a minor To); a dominant a half step below; the bass walking up or down
 * by half steps when From is two to four semitones away, each dominant's root spelled as the app spells
 * a chord's root; To approached from both half steps, or by the diminished 7th below; To's IV (iv
 * before a minor To); the backdoor ♭VII7; the plagal IVMaj7 before a major To and ivm7 before either.
 * A way whose chords repeat From or To, or repeat an earlier way, is left out.
 */
export function passingChords(from: Chord, to: Chord): PassingChords[] {
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
    subdominant: [on(up('P4'), minor ? 'min' : 'maj')],
    backdoor: [on(up('m7'), 'd7')],
    plagal: minor ? null : [on(up('P4'), 'maj7')],
    minorPlagal: [on(up('P4'), 'm7')],
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
