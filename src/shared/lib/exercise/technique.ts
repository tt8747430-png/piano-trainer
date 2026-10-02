import type { Performance } from '@/shared/lib/arrangement'
import { midi, scaleKey, type Finger, type SpelledNote } from '@/shared/lib/music'
import { fingered, inEighths, leftHandBelow, scaleDegrees, tonicChord, tonicKey } from './line'
import { exercisePerformance } from './performance'

const finger = (n: number): Finger => {
  if (n === 1 || n === 2 || n === 3 || n === 4 || n === 5) return n
  throw new RangeError(`${n} is not a finger`)
}

/**
 * The five-finger position on a major or minor tonic: 1-2-3-4-5-4-3-2 twice and home, a finger a
 * key, the left hand an octave below with its fingers mirrored.
 */
export function fiveFinger(choice: {
  readonly root: SpelledNote
  readonly minor: boolean
}): Performance {
  const kind = choice.minor ? 'natural' : 'major'
  const degrees = [0, 1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 3, 4, 3, 2, 1, 0]
  const tonic = tonicKey(choice.root)
  const hand = (offset: number, fingerOf: (degree: number) => Finger) =>
    fingered(
      degrees.map(scaleDegrees(choice.root, kind, midi(tonic - offset))),
      degrees.map(fingerOf),
    )
  return exercisePerformance({
    key: scaleKey(choice.root, kind),
    notes: inEighths({
      rh: hand(0, (degree) => finger(degree + 1)),
      lh: hand(12, (degree) => finger(5 - degree)),
    }),
    harmony: [{ chord: tonicChord(choice.root, kind), startTick: 0 }],
  })
}

/** The octaves Hanon's line spans, rounded up: its figure climbs 13 degrees and reaches 5 above. */
const HANON_OCTAVES = 3

/** Hanon's first figure, by degree above its first note, with each hand's fingers. */
const HANON = {
  up: {
    steps: [0, 2, 3, 4, 5, 4, 3, 2],
    rh: [1, 2, 3, 4, 5, 4, 3, 2],
    lh: [5, 4, 3, 2, 1, 2, 3, 4],
  },
  down: {
    steps: [0, -2, -3, -4, -5, -4, -3, -2],
    rh: [5, 4, 3, 2, 1, 2, 3, 4],
    lh: [1, 2, 3, 4, 5, 4, 3, 2],
  },
} as const

/**
 * Hanon's No. 1 (The Virtuoso Pianist, public domain) in any major key: its figure a degree higher
 * each time for two octaves, then mirrored a degree lower each time from the top, home on the
 * tonic; in 8ths, a figure a bar, the left hand two octaves below.
 */
export function hanon(choice: { readonly root: SpelledNote }): Performance {
  // Two octaves and a 6th: the left hand two octaves below, so each hand stays on its own staff.
  const tonic = tonicKey(choice.root, HANON_OCTAVES)
  const figures = [
    ...Array.from({ length: 14 }, (_, d) => ({ from: d, figure: HANON.up })),
    ...Array.from({ length: 15 }, (_, i) => ({ from: 18 - i, figure: HANON.down })),
  ]
  const hand = (side: 'rh' | 'lh') => {
    const place = scaleDegrees(
      choice.root,
      'major',
      side === 'rh' ? tonic : midi(tonic - leftHandBelow(HANON_OCTAVES)),
    )
    return [
      ...figures.flatMap(({ from, figure }) =>
        fingered(
          figure.steps.map((step) => place(from + step)),
          figure[side].map(finger),
        ),
      ),
      ...fingered([place(0)], [side === 'rh' ? 1 : 5]),
    ]
  }
  return exercisePerformance({
    key: { tonic: choice.root, minor: false },
    notes: inEighths({ rh: hand('rh'), lh: hand('lh') }),
    harmony: [{ chord: tonicChord(choice.root, 'major'), startTick: 0 }],
  })
}
