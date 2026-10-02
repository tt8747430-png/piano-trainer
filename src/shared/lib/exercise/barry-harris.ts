import type { Performance } from '@/shared/lib/arrangement'
import {
  INTERVALS,
  MIDDLE_C,
  midi,
  pitchClassOf,
  scaleChordAt,
  spellAbove,
  tonicSpelling,
  type Chord,
  type Hand,
  type IntervalName,
  type Key,
  type SpelledNote,
  type Tone,
} from '@/shared/lib/music'
import {
  inBeats,
  inEighths,
  leftHandBelow,
  range,
  scaleDegrees,
  shell,
  toneDegrees,
  tonicKey,
  upAndBack,
  type Played,
} from './line'
import { exercisePerformance, type LineNote } from './performance'
import { BAR, HALF, QUARTER } from './time'

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
 * apart (two from two octaves): eight notes an octave, so the 6th chord's tones fall on the beats. No
 * fingers, as Barry Harris's lines carry none.
 */
export function sixthDiminishedScale(choice: {
  readonly root: SpelledNote
  readonly minor: boolean
  readonly octaves: number
}): Performance {
  const { root, minor, octaves } = choice
  const tones = tonesOf(root, SIXTH_DIMINISHED[minor ? 'minor' : 'major'])
  const tonic = tonicKey(root, octaves)
  const hand = (side: Hand): Played[] =>
    upAndBack(
      range(0, 8 * octaves).map(
        toneDegrees(tones, side === 'rh' ? tonic : midi(tonic - leftHandBelow(octaves))),
      ),
    )
  return exercisePerformance({
    key: keyOf(root, minor),
    notes: inEighths({ rh: hand('rh'), lh: hand('lh') }),
    harmony: [{ chord: sixthChord(root, minor), startTick: 0 }],
  })
}

/** The highest a left hand's note goes: A4, so it reads on the bass staff. */
const LEFT_TOP = 69

/**
 * Four-voice chords moved down by octaves until the voice drop 2 puts in the left hand (the second
 * from the top, an octave under) is at most A4; and how far they moved.
 */
function lowered(voiced: readonly (readonly Played[])[]): { voiced: Played[][]; down: number } {
  const dropped = Math.max(...voiced.map((keys) => (keys[2]?.midi ?? 0) - 12))
  const down = Math.max(0, Math.ceil((dropped - LEFT_TOP) / 12)) * 12
  return {
    voiced: voiced.map((keys) => keys.map((key) => ({ ...key, midi: midi(key.midi - down) }))),
    down,
  }
}

/** Drop 2: each chord's second voice from the top an octave down, in the left hand. */
const dropTwo = (voiced: readonly (readonly Played[])[]) => ({
  rh: voiced.map((keys) => keys.filter((_, i) => i !== 2)),
  lh: voiced.map((keys) => (keys[2] ? [{ ...keys[2], midi: midi(keys[2].midi - 12) }] : [])),
})

/**
 * Each note of the 6th-diminished scale up an octave and back, harmonised in quarters: on the 6th
 * chord's tones the 6th chord, on the others the diminished 7th, each in close position under the
 * scale's note (its own tones 2, 4 and 6 steps down the scale), the left hand holding the root a bar
 * at a time. Drop 2 moves the second voice from the top an octave down, into the left hand.
 */
export function sixthDiminishedChords(choice: {
  readonly root: SpelledNote
  readonly minor: boolean
  readonly voicing: 'close' | 'drop2'
}): Performance {
  const { root, minor } = choice
  const tones = tonesOf(root, SIXTH_DIMINISHED[minor ? 'minor' : 'major'])
  const tonic = MIDDLE_C + pitchClassOf(root)
  const place = toneDegrees(tones, midi(tonic))
  const leading = tones[7]?.note
  if (!leading) throw new RangeError('A 6th-diminished scale has eight notes')
  const tops = [...range(0, 8), ...range(7, 0)].map((degree) => degree + 8)
  const { voiced, down } = lowered(tops.map((top) => [top - 6, top - 4, top - 2, top].map(place)))
  const bass: Played = { midi: midi(tonic - down - 12), spelled: root }
  const bars = Math.ceil((tops.length * QUARTER) / BAR)
  const notes =
    choice.voicing === 'drop2'
      ? inBeats(dropTwo(voiced), QUARTER)
      : [
          ...inBeats({ rh: voiced }, QUARTER),
          ...inBeats({ lh: Array.from({ length: bars }, () => [bass]) }, BAR),
        ]
  return exercisePerformance({
    key: keyOf(root, minor),
    notes,
    harmony: tops.map((top, i) => ({
      chord: top % 2 === 0 ? sixthChord(root, minor) : ({ root: leading, quality: 'o7' } as const),
      startTick: i * QUARTER,
    })),
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
    notes: [...line, ...inBeats({ lh: Array.from({ length: bars }, () => shell(chord)) }, BAR)],
    harmony: [{ chord, startTick: 0 }],
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
  const shells = [...sevenths, sevenths[2]].map((chord) => (chord ? shell(chord) : []))
  const rh: LineNote[] = [
    ...inEighths({ rh: bars.flat().map(place) }).filter((n) => n.startTick < 3 * BAR),
    ...inEighths({ rh: home.map(place) }, 3 * BAR),
  ]
  return exercisePerformance({
    key: { tonic: root, minor: false },
    notes: [...rh, ...inBeats({ lh: shells }, BAR)],
    harmony: [...chords, chords[2]].flatMap((chord, i) =>
      chord ? [{ chord, startTick: i * BAR }] : [],
    ),
  })
}

/**
 * The key's 7th chords up the scale to the tonic's octave and back, in halves, each in close position
 * in `inversion` with its second voice from the top dropped an octave into the left hand (drop 2),
 * low enough for the left hand to read on its staff.
 */
export function dropTwoSevenths(choice: {
  readonly root: SpelledNote
  readonly inversion: number
}): Performance {
  const { root } = choice
  const inversion = Math.min(Math.max(choice.inversion, 0), 3)
  const place = scaleDegrees(root, 'major', midi(MIDDLE_C + pitchClassOf(root)))
  const degrees = [...range(0, 7), ...range(6, 0)]
  const { voiced } = lowered(
    degrees.map((degree) =>
      [0, 1, 2, 3].map((k) => {
        const at = inversion + k
        return place(degree + 2 * (at % 4) + 7 * Math.floor(at / 4))
      }),
    ),
  )
  return exercisePerformance({
    key: { tonic: root, minor: false },
    notes: inBeats(dropTwo(voiced), HALF),
    harmony: degrees.map((degree, i) => ({
      chord: scaleChordAt(root, 'major', degree % 7, 4),
      startTick: i * HALF,
    })),
  })
}
