import { scaleChordAt, type Chord, type Key } from '@/shared/lib/music'

/** The key's chords in scale order, I to vii, then V7: the laptop's tiles to drag into a bar. */
export function keyChords(key: Key): Chord[] {
  const kind = key.minor ? 'harmonic' : 'major'
  const triad = (degree: number) => scaleChordAt(key.tonic, kind, degree, 3)
  return [0, 1, 2, 3, 4, 5, 6].map(triad).concat(scaleChordAt(key.tonic, kind, 4, 4))
}

/** The same chords likeliest first, as a chord's sheet suggests them: I, IV, V, vi, ii, V7, iii. */
export const likeliestChords = (key: Key): Chord[] => {
  const chords = keyChords(key)
  return [0, 3, 4, 5, 1, 7, 2].flatMap((at) => chords[at] ?? [])
}
