import type { Performance } from '@/shared/lib/arrangement'
import {
  arpeggioFingering,
  fitInversion,
  midi,
  pitchClassOf,
  spellChord,
  tonicSpelling,
  type ChordQuality,
  type Hand,
  type SpelledNote,
} from '@/shared/lib/music'
import { fingered, inEighths, tonicKey, type Played } from './line'
import { exercisePerformance } from './performance'

/**
 * A chord's tones up `octaves` octaves from the tone its inversion puts at the bottom and back, in
 * 8ths, both hands an octave apart, fingered by the arpeggio rule; written in its root's major or
 * minor key, under its symbol over its bass.
 */
export function arpeggioExercise(choice: {
  readonly root: SpelledNote
  readonly quality: ChordQuality
  readonly inversion: number
  readonly octaves: number
}): Performance {
  const { root, quality, octaves } = choice
  const tones = spellChord(root, quality)
  const count = tones.length
  const inversion = fitInversion(choice.inversion, count)
  const rootKey = tonicKey(root, octaves)
  const handRun = (hand: Hand): Played[] => {
    const keys = Array.from({ length: count * octaves + 1 }, (_, i): Played => {
      const at = inversion + i
      const tone = tones[at % count] ?? tones[0]
      if (!tone) throw new RangeError('A chord has at least its root')
      const key = rootKey + tone.semitones + 12 * Math.floor(at / count) - (hand === 'lh' ? 12 : 0)
      return { midi: midi(key), spelled: tone.note }
    })
    const up = fingered(
      keys,
      arpeggioFingering(
        keys.map((key) => key.midi),
        hand,
      ),
    )
    return [...up, ...[...up].reverse().slice(1)]
  }
  const minor = tones[1]?.degree === '♭3'
  const bass = tones[inversion]?.note
  return exercisePerformance({
    key: { tonic: tonicSpelling(pitchClassOf(root), minor), minor },
    notes: inEighths({ rh: handRun('rh'), lh: handRun('lh') }),
    harmony: [
      {
        chord: { root, quality, ...(inversion > 0 && bass ? { bass } : {}) },
        startTick: 0,
        durationTicks: 1,
      },
    ],
  })
}
