import type { Performance } from '@/shared/lib/arrangement'
import { midi, type Finger, type SpelledNote } from '@/shared/lib/music'
import {
  fingered,
  inBeats,
  inEighths,
  leftHandBelow,
  scaleDegrees,
  tonicChord,
  tonicKey,
  type Played,
} from './line'
import { exercisePerformance } from './performance'
import { BAR } from './time'

/** Part I of The Virtuoso Pianist: Nos. 1 to 20. */
export const HANON_NUMBERS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
] as const
export type HanonNumber = (typeof HANON_NUMBERS)[number]

/**
 * A run of one figure, carried a degree at a time: its first note's degree above the tonic, how many
 * times it is played (counting down where it is negative), its notes by degree above its first, and
 * each hand's fingers (a digit a note).
 */
interface Run {
  readonly from: number
  readonly times: number
  readonly steps: readonly number[]
  readonly rh: string
  readonly lh: string
}

const run = (from: number, times: number, steps: readonly number[], rh: string, lh: string) => ({
  from,
  times,
  steps,
  rh,
  lh,
})

/** The notes a hand holds at the end, by degree, and its fingers on them. */
interface Held {
  readonly degrees: readonly number[]
  readonly fingers: string
}

/** An exercise: its runs in order, then the last notes each hand holds. */
interface Hanon {
  readonly runs: readonly Run[]
  readonly end?: Readonly<Record<'rh' | 'lh', Held>>
}

/** The tonic held at the end, the right hand's thumb and the left's little finger on it. */
const HOME: Readonly<Record<'rh' | 'lh', Held>> = {
  rh: { degrees: [0], fingers: '1' },
  lh: { degrees: [0], fingers: '5' },
}

/**
 * Nos. 1 to 20 as G. Schirmer's 1900 edition prints them (public domain): each figure up a degree at a
 * time from C, then its mirror (or its own figure for the way down) a degree at a time from the top,
 * home on C; where the book bends a figure's last notes to turn round or to land, that figure stands
 * by itself. The fingers are the book's, its unprinted ones the hand's position carried on. The left
 * hand plays the right's notes, with its own fingers.
 */
const HANON: Readonly<Record<HanonNumber, Hanon>> = {
  1: {
    runs: [
      run(0, 14, [0, 2, 3, 4, 5, 4, 3, 2], '12345432', '54321234'),
      run(18, -15, [0, -2, -3, -4, -5, -4, -3, -2], '54321234', '12345432'),
    ],
  },
  2: {
    runs: [
      run(0, 14, [0, 2, 5, 4, 3, 4, 3, 2], '12543432', '53123234'),
      run(18, -14, [0, -3, -5, -4, -3, -4, -3, -2], '52123234', '13543432'),
    ],
  },
  3: {
    runs: [
      run(0, 14, [0, 2, 5, 4, 3, 2, 3, 4], '12543234', '53123432'),
      run(18, -14, [0, -3, -5, -4, -3, -2, -3, -4], '52123432', '13543234'),
    ],
  },
  4: {
    runs: [
      run(0, 14, [0, 1, 0, 2, 5, 4, 3, 2], '12125432', '54531234'),
      run(18, -14, [0, -1, 0, -3, -5, -4, -3, -2], '54521234', '12135432'),
    ],
  },
  5: {
    runs: [
      run(0, 14, [0, 5, 4, 5, 3, 4, 2, 3], '15453423', '51213243'),
      run(14, -14, [0, 1, 0, 2, 1, 3, 2, 4], '12132435', '54534231'),
    ],
  },
  6: {
    runs: [
      run(0, 13, [0, 5, 4, 5, 3, 5, 2, 5], '15453525', '51213141'),
      run(13, 1, [0, 5, 4, 5, 3, 5, 2, 1], '15453521', '51213145'),
      run(18, -13, [0, -5, -4, -5, -3, -5, -2, -5], '51213141', '15453525'),
      run(5, 1, [0, -5, -4, -5, -3, -5, -2, -3], '51213143', '15453523'),
    ],
  },
  7: {
    runs: [
      run(0, 14, [0, 2, 1, 3, 2, 4, 3, 2], '13243543', '53423134'),
      run(18, -14, [0, -2, -1, -3, -2, -4, -3, -2], '53423134', '13243543'),
    ],
  },
  8: {
    runs: [
      run(0, 14, [0, 2, 4, 5, 3, 4, 2, 3], '12453423', '54213243'),
      run(18, -14, [0, -2, -4, -5, -3, -4, -2, -3], '54213243', '12453423'),
    ],
  },
  9: {
    runs: [
      run(0, 14, [0, 2, 3, 2, 4, 3, 5, 4], '12324354', '54342312'),
      run(18, -13, [0, -2, -3, -2, -4, -3, -5, -4], '54342312', '12324354'),
      run(5, 1, [0, -2, -3, -2, -4, -3, -4, -3], '54342323', '12324343'),
    ],
  },
  10: {
    runs: [
      run(0, 14, [0, 5, 4, 3, 2, 3, 2, 3], '15432323', '51234343'),
      run(18, -14, [0, -5, -4, -3, -2, -3, -2, -3], '51234343', '15432323'),
    ],
  },
  11: {
    runs: [
      run(0, 14, [0, 2, 5, 4, 5, 4, 3, 4], '12545434', '53121232'),
      run(18, -14, [0, -3, -5, -4, -5, -4, -3, -4], '52121232', '13545434'),
    ],
  },
  12: {
    runs: [
      run(4, 1, [0, -4, -2, -3, -4, -3, -2, -4], '51321231', '15345435'),
      run(6, 12, [0, -5, -3, -4, -5, -4, -3, -5], '51321231', '15345435'),
      run(18, 1, [0, -5, -3, -4, -5, -4, -3, -2], '51321234', '15345432'),
      run(13, -14, [0, 5, 3, 4, 5, 4, 3, 5], '15345435', '51321231'),
      run(0, 1, [0, 4, 2, 3, 4, 3, 2, 3], '15345434', '51321232'),
    ],
  },
  13: {
    runs: [
      run(2, 14, [0, -2, 1, -1, 2, 0, 1, 2], '31425345', '35241321'),
      run(16, -14, [0, 2, -1, 1, 0, -2, -1, 0], '35243134', '31423532'),
    ],
  },
  14: {
    runs: [
      run(0, 14, [0, 1, 3, 2, 3, 2, 4, 3], '12434354', '54232313'),
      run(18, -14, [0, -1, -3, -2, -3, -2, -4, -3], '54232313', '12434354'),
    ],
  },
  15: {
    runs: [
      run(0, 13, [0, 2, 1, 3, 2, 4, 3, 5], '12132435', '53423121'),
      run(13, 1, [0, 2, 1, 3, 2, 4, 3, 4], '12132434', '53423121'),
      run(18, -13, [0, -2, -1, -3, -2, -4, -3, -5], '53423121', '12132435'),
      run(5, 1, [0, -2, -1, -3, -2, -4, -3, -4], '53423132', '12132434'),
    ],
  },
  16: {
    runs: [
      run(0, 14, [0, 2, 1, 2, 5, 4, 3, 4], '13235434', '53431232'),
      run(18, -14, [0, -3, -2, -3, -5, -4, -3, -4], '52321232', '13235434'),
    ],
  },
  17: {
    runs: [
      run(0, 13, [0, 2, 5, 4, 6, 5, 4, 5], '12435434', '54231232'),
      run(13, 1, [0, 2, 5, 4, 6, 5, 4, 3], '12435432', '54231234'),
      run(18, -12, [0, -3, -5, -4, -6, -5, -4, -6], '53231231', '12435435'),
      run(6, 1, [0, -3, -5, -4, -6, -5, -4, -5], '53231232', '12435434'),
    ],
  },
  18: {
    runs: [
      run(0, 14, [0, 1, 3, 2, 4, 3, 1, 2], '12435423', '54231243'),
      run(18, -14, [0, -1, -3, -2, -4, -3, -1, -2], '54231243', '12435423'),
    ],
  },
  19: {
    runs: [
      run(0, 14, [0, 5, 3, 4, 5, 3, 2, 4], '15345324', '51321342'),
      run(18, -14, [0, -5, -3, -4, -5, -3, -2, -4], '51321342', '15345324'),
    ],
  },
  20: {
    runs: [
      run(2, 14, [0, 2, 5, 7, 5, 4, 5, 3], '12454342', '54212324'),
      run(16, 1, [0, 2, 5, 7, 5, 4, 5, 2], '12454342', '54212324'),
      run(23, -14, [0, -2, -5, -7, -5, -6, -5, -7], '54213231', '12453435'),
      run(9, 1, [0, -2, -5, -7, -5, -6, -5, -6], '54213232', '12453434'),
    ],
    // It ends on a chord: the right hand's 3rd and tonic, the left hand's octave.
    end: { rh: { degrees: [2, 7], fingers: '15' }, lh: { degrees: [0, 7], fingers: '51' } },
  },
}

const toFingers = (digits: string): Finger[] =>
  [...digits].map((digit) => {
    const n = Number(digit)
    if (n === 1 || n === 2 || n === 3 || n === 4 || n === 5) return n
    throw new RangeError(`${digit} is not a finger`)
  })

/** Each figure's first degree, in the order played. */
const figureStarts = ({ from, times }: Run): number[] =>
  Array.from({ length: Math.abs(times) }, (_, i) => from + i * Math.sign(times))

/** The octaves an exercise's right hand spans from its tonic, rounded up. */
function spanOctaves(hanon: Hanon): number {
  const top = Math.max(
    ...hanon.runs.flatMap((each) =>
      figureStarts(each).flatMap((start) => each.steps.map((step) => start + step)),
    ),
  )
  return Math.ceil((top + 1) / 7)
}

/** An exercise's figures' notes by degree in the order played, before the last notes. */
export function hanonDegrees(number: HanonNumber): number[] {
  return HANON[number].runs.flatMap((each) =>
    figureStarts(each).flatMap((start) => each.steps.map((step) => start + step)),
  )
}

/**
 * Hanon's Nos. 1 to 20 (The Virtuoso Pianist, Part I) in any major key, as the book prints them in
 * C: in 8ths, a figure a bar, both hands on the same notes with their own fingers, the left two
 * octaves below the right so each reads on its own staff; home on the tonic held for a bar (No. 20
 * on a chord).
 */
export function hanon(choice: {
  readonly root: SpelledNote
  readonly number: HanonNumber
}): Performance {
  const exercise = HANON[choice.number]
  const octaves = spanOctaves(exercise)
  const tonic = tonicKey(choice.root, octaves)
  const end = exercise.end ?? HOME
  const placeOf = (side: 'rh' | 'lh') =>
    scaleDegrees(choice.root, 'major', side === 'rh' ? tonic : midi(tonic - leftHandBelow(octaves)))
  const figures = (side: 'rh' | 'lh'): Played[] => {
    const place = placeOf(side)
    return exercise.runs.flatMap((each) => {
      const fingers = toFingers(each[side])
      return figureStarts(each).flatMap((start) =>
        fingered(
          each.steps.map((step) => place(start + step)),
          fingers,
        ),
      )
    })
  }
  const home = (side: 'rh' | 'lh'): Played[] =>
    fingered(end[side].degrees.map(placeOf(side)), toFingers(end[side].fingers))
  const body = inEighths({ rh: figures('rh'), lh: figures('lh') })
  const endTick = Math.max(...body.map((n) => n.startTick + n.durationTicks))
  return exercisePerformance({
    key: { tonic: choice.root, minor: false },
    notes: [...body, ...inBeats({ rh: [home('rh')], lh: [home('lh')] }, BAR, endTick)],
    harmony: [{ chord: tonicChord(choice.root, 'major'), startTick: 0 }],
  })
}
