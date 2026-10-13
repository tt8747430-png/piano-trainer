import type { Performance } from '@/shared/lib/arrangement'
import {
  MIDDLE_C,
  midi,
  pitchClassOf,
  spellChord,
  tonicSpelling,
  type ChordQuality,
  type Finger,
  type SpelledNote,
} from '@/shared/lib/music'
import type { LineNote } from './performance'
import { exercisePerformance } from './performance'
import { HALF } from './time'

/** The top of the climb: C6. */
const HIGHEST = 84

/** At most a 7th chord's four tones: a bigger chord climbs as its 7th chord. */
const MOST_TONES = 4

/** A triad's fingering by its inversion (root position, 1st, 2nd); a four-note chord's is one. */
const TRIAD_FINGERS: readonly (readonly Finger[])[] = [
  [1, 3, 5],
  [1, 2, 5],
  [1, 3, 5],
]
const FOUR_FINGERS: readonly Finger[] = [1, 2, 3, 5]

/**
 * A chord climbing through its inversions in the right hand, close, a chord each half note: root
 * position, each inversion, root position an octave up, and back down; the left hand holds its root
 * under each. Written in its root's major or minor key, under its symbol.
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
    const fingers = count === 3 ? (TRIAD_FINGERS[inversion % count] ?? FOUR_FINGERS) : FOUR_FINGERS
    const right = Array.from({ length: count }, (_, k): LineNote => {
      const at = inversion + k
      const tone = tones[at % count] ?? tones[0]
      if (!tone) throw new RangeError('A chord has at least its root')
      const finger = fingers[k]
      return {
        midi: midi(rootKey + tone.semitones + 12 * Math.floor(at / count)),
        spelled: tone.note,
        hand: 'rh',
        startTick,
        durationTicks: HALF,
        ...(finger === undefined ? {} : { finger }),
      }
    })
    const bass: LineNote = {
      midi: midi(rootKey - 12),
      spelled: root,
      hand: 'lh',
      startTick,
      durationTicks: HALF,
      finger: 5,
    }
    return [bass, ...right]
  })
  const minor = tones[1]?.degree === '♭3'
  return exercisePerformance({
    key: { tonic: tonicSpelling(pc, minor), minor },
    notes,
    harmony: [{ chord: { root, quality }, startTick: 0 }],
  })
}
