import { midi, pitchClass, type Midi, type PitchClass, type Tone } from '@/shared/lib/music'
import { toneMark, type KeyMark, type ShownKeys } from '@/shared/ui'

/** The melody is played from G4 up to F#5, the chord close beneath it. */
const MELODY_FROM = 67
/** At most this many of the chord's other tones go under the melody. */
const UNDER = 3

/**
 * A chord as a pianist voices it under a melody note: the melody on top (G4 to F#5), the chord's
 * other tones packed close beneath it, each the nearest of its name below the one above (C under E
 * is G C E). A chord of five notes or more leaves out its 5th, then its root (the bass has it), so
 * three tones go under the melody. The melody wears `mark`; each other key its role and degree.
 */
export function voicedUnder(tones: readonly Tone[], melody: PitchClass, mark: KeyMark): ShownKeys {
  const top = midi(MELODY_FROM + pitchClass(melody - MELODY_FROM))
  const others = tones.filter((each) => each.pitchClass !== melody)
  const thinned =
    tones.length >= 5
      ? others.filter((each) => each.role !== '5th' && each.role !== 'root')
      : others
  const under = (thinned.length >= UNDER ? thinned : others).slice(-UNDER)
  const below = under
    .map((each) => ({ each, key: midi(top - (pitchClass(melody - each.pitchClass) || 12)) }))
    .toSorted((a, b) => a.key - b.key)
  const marks = new Map<Midi, KeyMark>([[top, mark]])
  for (const { each, key } of below) marks.set(key, toneMark(each))
  return { keys: [...below.map(({ key }) => key), top], marks }
}
