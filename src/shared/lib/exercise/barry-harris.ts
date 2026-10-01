import type { Performance } from '@/shared/lib/arrangement'
import {
  INTERVALS,
  MIDDLE_C,
  midi,
  pitchClassOf,
  scaleChordAt,
  spellAbove,
  thumbFingering,
  tonicSpelling,
  type Chord,
  type Hand,
  type IntervalName,
  type Key,
  type SpelledNote,
  type Tone,
} from '@/shared/lib/music'
import {
  BAR,
  EIGHTH,
  fingered,
  inBeats,
  inEighths,
  scaleDegrees,
  shell,
  toneDegrees,
  tonicKey,
  type Played,
} from './line'
import { exercisePerformance, type LineNote } from './performance'

const QUARTER = 2 * EIGHTH
const HALF = 2 * QUARTER

/** Tones above a root by interval name, as a scale lists them. */
const tonesOf = (root: SpelledNote, names: readonly IntervalName[]): Tone[] =>
  names.map((name) => {
    const interval = INTERVALS[name]
    const note = spellAbove(root, interval)
    return {
      note,
      pitchClass: pitchClassOf(note),
      semitones: interval.semitones,
      role: 'root',
      degree: interval.degree,
    }
  })

/**
 * Barry Harris's 6th-diminished scales: the 6th chord's tones (1 3 5 6, or 1 ♭3 5 6) with the
 * diminished 7th a semitone under the root between them (2 4 ♭6 7).
 */
const SIXTH_DIMINISHED: Readonly<Record<'major' | 'minor', readonly IntervalName[]>> = {
  major: ['r', 'M2', 'M3', 'P4', 'P5', 'm6', 'M6', 'M7'],
  minor: ['r', 'M2', 'm3', 'P4', 'P5', 'm6', 'M6', 'M7'],
}

const range = (from: number, to: number): number[] => {
  const step = to >= from ? 1 : -1
  return Array.from({ length: Math.abs(to - from) + 1 }, (_, i) => from + i * step)
}

const keyOf = (root: SpelledNote, minor: boolean): Key => ({
  tonic: tonicSpelling(pitchClassOf(root), minor),
  minor,
})

/** The 6th chord the scale is built on. */
const sixthChord = (root: SpelledNote, minor: boolean): Chord => ({
  root,
  quality: minor ? 'm6' : 'six',
})

/**
 * The major or minor 6th-diminished scale up `octaves` octaves and back in 8ths, both hands an octave
 * apart, fingered from the thumb: eight notes an octave, so the 6th chord's tones fall on the beats.
 */
export function sixthDiminishedScale(choice: {
  readonly root: SpelledNote
  readonly minor: boolean
  readonly octaves: number
}): Performance {
  const { root, minor, octaves } = choice
  const tones = tonesOf(root, SIXTH_DIMINISHED[minor ? 'minor' : 'major'])
  const tonic = tonicKey(root, octaves)
  const hand = (side: Hand): Played[] => {
    const keys = range(0, 8 * octaves).map(
      toneDegrees(tones, side === 'rh' ? tonic : midi(tonic - 12)),
    )
    const up = fingered(
      keys,
      thumbFingering(
        keys.map((key) => key.midi),
        side,
      ),
    )
    return [...up, ...[...up].reverse().slice(1)]
  }
  return exercisePerformance({
    key: keyOf(root, minor),
    notes: inEighths({ rh: hand('rh'), lh: hand('lh') }),
    harmony: [{ chord: sixthChord(root, minor), startTick: 0, durationTicks: 1 }],
  })
}

/**
 * Each note of the 6th-diminished scale up an octave and back, harmonised in quarters: on the 6th
 * chord's tones the 6th chord, on the others the diminished 7th, each in close position under the
 * scale's note (its own tones 2, 4 and 6 steps down the scale). Drop 2 moves the second voice from
 * the top an octave down, into the left hand.
 */
export function sixthDiminishedChords(choice: {
  readonly root: SpelledNote
  readonly minor: boolean
  readonly voicing: 'close' | 'drop2'
}): Performance {
  const { root, minor } = choice
  const tones = tonesOf(root, SIXTH_DIMINISHED[minor ? 'minor' : 'major'])
  const place = toneDegrees(tones, midi(MIDDLE_C + pitchClassOf(root)))
  const leading = tones[7]?.note
  if (!leading) throw new RangeError('A 6th-diminished scale has eight notes')
  const tops = [...range(0, 8), ...range(7, 0)].map((degree) => degree + 8)
  const voiced = tops.map((top) => [top - 6, top - 4, top - 2, top].map(place))
  const rh = voiced.map((keys) =>
    choice.voicing === 'drop2' ? keys.filter((_, i) => i !== 2) : keys,
  )
  const lh = voiced.map((keys) =>
    choice.voicing === 'drop2' && keys[2] ? [{ ...keys[2], midi: midi(keys[2].midi - 12) }] : [],
  )
  const harmony = tops.map((top, i) => ({
    chord: top % 2 === 0 ? sixthChord(root, minor) : ({ root: leading, quality: 'o7' } as const),
    startTick: i * QUARTER,
    durationTicks: QUARTER,
  }))
  return exercisePerformance({
    key: keyOf(root, minor),
    notes: inBeats(choice.voicing === 'drop2' ? { rh, lh } : { rh }, QUARTER),
    harmony,
  })
}

/** Where each of a 7th chord's tones sits in the bebop dominant scale (1 2 3 4 5 6 ♭7 7). */
export const CHORD_TONE_AT = { root: 0, third: 2, fifth: 4, seventh: 6 } as const
export type ChordToneFrom = keyof typeof CHORD_TONE_AT

const BEBOP_DOMINANT: readonly IntervalName[] = ['r', 'M2', 'M3', 'P4', 'P5', 'M6', 'm7', 'M7']

/**
 * The key's V7 down its bebop scale for two octaves in 8ths from one of its tones: the half step
 * between the root and the ♭7 keeps every chord tone on a beat (Barry Harris's half-step rule). The
 * left hand holds the chord's shell.
 */
export function dominantScale(choice: {
  readonly root: SpelledNote
  readonly from: ChordToneFrom
}): Performance {
  const dominantRoot = spellAbove(choice.root, INTERVALS.P5)
  const tones = tonesOf(dominantRoot, BEBOP_DOMINANT)
  // From G5 to F♯6, so two octaves down stay above the left hand's shell.
  const pc = pitchClassOf(dominantRoot)
  const place = toneDegrees(tones, midi(MIDDLE_C + 12 + pc + (pc < 7 ? 12 : 0)))
  const start = CHORD_TONE_AT[choice.from]
  const keys = range(start, start - 16).map(place)
  const chord: Chord = { root: dominantRoot, quality: 'd7' }
  const line = inEighths({ rh: keys })
  const bars = Math.ceil(Math.max(...line.map((n) => n.startTick + n.durationTicks)) / BAR)
  return exercisePerformance({
    key: { tonic: choice.root, minor: false },
    notes: [...line, ...inBeats({ lh: Array.from({ length: bars }, () => shell(chord, 10)) }, BAR)],
    harmony: [{ chord, startTick: 0, durationTicks: 1 }],
  })
}

/** The degrees, in the key's major scale, of ii, V and I. */
const TWO_FIVE_ONE = [1, 4, 0] as const

/** The line's octave nearest the note before it. */
const nearest = (degrees: readonly number[], after: number | undefined): number[] => {
  const [first] = degrees
  if (after === undefined || first === undefined) return [...degrees]
  const shift = Math.round((after - first) / 7) * 7
  return degrees.map((degree) => degree + shift)
}

/**
 * A ii–V–I, a bar a chord: each chord's 3rd, 5th, 7th and 9th up, then the scale down from its
 * root's octave to its 5th, each bar starting in the octave nearest the last; the left hand holds each
 * chord's shell, and the I's root ends it.
 */
export function arpeggiosFromTheThird(choice: { readonly root: SpelledNote }): Performance {
  const { root } = choice
  const place = scaleDegrees(root, 'major', midi(MIDDLE_C + pitchClassOf(root)))
  let last: number | undefined
  const bars = TWO_FIVE_ONE.map((degree) => {
    const line = nearest(
      [2, 4, 6, 8, 7, 6, 5, 4].map((step) => degree + step),
      last,
    )
    last = line.at(-1)
    return line
  })
  const home = nearest([0], last)
  const chords = TWO_FIVE_ONE.map((degree) => scaleChordAt(root, 'major', degree, 5))
  const sevenths = TWO_FIVE_ONE.map((degree) => scaleChordAt(root, 'major', degree, 4))
  const shells = [...sevenths, sevenths[2]].map((chord) =>
    chord ? shell(chord, chord.quality === 'maj7' ? 11 : 10) : [],
  )
  const rh: LineNote[] = [
    ...inEighths({ rh: bars.flat().map(place) }).filter((n) => n.startTick < 3 * BAR),
    ...inEighths({ rh: home.map(place) }, 3 * BAR),
  ]
  return exercisePerformance({
    key: { tonic: root, minor: false },
    notes: [...rh, ...inBeats({ lh: shells }, BAR)],
    harmony: [...chords, chords[2]].flatMap((chord, i) =>
      chord ? [{ chord, startTick: i * BAR, durationTicks: BAR }] : [],
    ),
  })
}

/**
 * The key's 7th chords up the scale to the tonic's octave and back, in halves, each in close position
 * in `inversion` with its second voice from the top dropped an octave into the left hand: drop 2.
 */
export function dropTwoSevenths(choice: {
  readonly root: SpelledNote
  readonly inversion: number
}): Performance {
  const { root } = choice
  const inversion = Math.min(Math.max(choice.inversion, 0), 3)
  const place = scaleDegrees(root, 'major', midi(MIDDLE_C + pitchClassOf(root)))
  const degrees = [...range(0, 7), ...range(6, 0)]
  const voiced = degrees.map((degree) =>
    [0, 1, 2, 3].map((k) => {
      const at = inversion + k
      return place(degree + 2 * (at % 4) + 7 * Math.floor(at / 4))
    }),
  )
  const rh = voiced.map((keys) => keys.filter((_, k) => k !== 2))
  const lh = voiced.map((keys) => (keys[2] ? [{ ...keys[2], midi: midi(keys[2].midi - 12) }] : []))
  return exercisePerformance({
    key: { tonic: root, minor: false },
    notes: inBeats({ rh, lh }, HALF),
    harmony: degrees.map((degree, i) => ({
      chord: scaleChordAt(root, 'major', degree % 7, 4),
      startTick: i * HALF,
      durationTicks: HALF,
    })),
  })
}
