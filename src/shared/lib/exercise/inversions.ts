import type { Performance } from '@/shared/lib/arrangement'
import {
  handFingers,
  MIDDLE_C,
  midi,
  pitchClassOf,
  spellChord,
  tonicSpelling,
  type ChordQuality,
  type SpelledNote,
} from '@/shared/lib/music'
import type { LineNote } from './performance'
import { exercisePerformance } from './performance'
import { HALF } from './time'

/** The top of the climb: C6. */
const HIGHEST = 84

/** At most a 7th chord's four tones: a bigger chord climbs as its 7th chord. */
const MOST_TONES = 4

/**
 * A chord climbing through its inversions in both hands, close, a chord each half note: root
 * position, each inversion, root position an octave up, and back down; the left hand an octave under
 * the right. Each hand fingers each chord as a block (`handFingers`: the right hand's 1-3-5, 1-2-5,
 * 1-3-5 and the left's 5-3-1, 5-3-1, 5-2-1 for a triad). Written in its root's major or minor key,
 * under its symbol.
 */
export function inversionsExercise(choice: {
  readonly root: SpelledNote
  readonly quality: ChordQuality
}): Performance {
  const { root, quality } = choice
  const tones = spellChord(root, quality).slice(0, MOST_TONES)
  const count = tones.length
  const pc = pitchClassOf(root)
  // From middle C, or an octave below where the top chord (root position an octave up) would pass C6.
  const top = 12 + Math.max(...tones.map((tone) => tone.semitones))
  const rootKey = MIDDLE_C + pc + top > HIGHEST ? MIDDLE_C + pc - 12 : MIDDLE_C + pc
  const steps = [
    ...Array.from({ length: count + 1 }, (_, i) => i),
    ...Array.from({ length: count }, (_, i) => count - 1 - i),
  ]
  const notes: LineNote[] = steps.flatMap((inversion, i) => {
    const startTick = i * HALF
    const keys = Array.from({ length: count }, (_, k) => {
      const at = inversion + k
      const tone = tones[at % count] ?? tones[0]
      if (!tone) throw new RangeError('A chord has at least its root')
      return { tone, midi: midi(rootKey + tone.semitones + 12 * Math.floor(at / count)) }
    }).sort((a, b) => a.midi - b.midi)
    const hand = (side: 'rh' | 'lh', below: number): LineNote[] => {
      const fingers = handFingers(
        keys.map((key) => key.midi),
        side,
      )
      return keys.map(({ tone, midi: key }, k) => {
        const finger = fingers[k]
        return {
          midi: midi(key - below),
          spelled: tone.note,
          hand: side,
          startTick,
          durationTicks: HALF,
          ...(finger === undefined ? {} : { finger }),
        }
      })
    }
    return [...hand('lh', 12), ...hand('rh', 0)]
  })
  const minor = tones[1]?.degree === '♭3'
  return exercisePerformance({
    key: { tonic: tonicSpelling(pc, minor), minor },
    notes,
    harmony: [{ chord: { root, quality }, startTick: 0 }],
  })
}
