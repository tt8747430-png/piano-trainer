import type { Performance } from '@/shared/lib/arrangement'
import { midi, scaleKey, type Finger, type SpelledNote } from '@/shared/lib/music'
import { fingered, inEighths, scaleDegrees, tonicChord, tonicKey } from './line'
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
