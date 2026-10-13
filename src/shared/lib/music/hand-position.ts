import { spellChord, type Chord } from './chord'
import { pitchClass } from './pitch'
import type { ChordRole } from './tone'

/** Root position and at most the first three inversions. */
const MOST_INVERSIONS = 3

/** The tones a rootless hand may start from. */
export type FromTone = Exclude<ChordRole, 'root'>

/** How a hand plays a chord: in an inversion, or rootless from one of its tones. */
export type HandPosition = { readonly inversion: number } | { readonly from: FromTone }

const isFromTone = (role: ChordRole): role is FromTone => role !== 'root'

/**
 * Where a row voices a chord's hand: its inversion (0 root position, to 3) when the hand holds the
 * root; a rootless hand, the tone it starts from (the 3rd, the 9th…).
 */
export function handPosition(chord: Chord, hand: readonly number[]): HandPosition | null {
  if (hand.length === 0) return null
  const tones = spellChord(chord.root, chord.quality)
  const roleOf = (key: number) => tones.find((tone) => tone.pitchClass === pitchClass(key))?.role
  const lowest = pitchClass(Math.min(...hand))
  const at = tones.findIndex((tone) => tone.pitchClass === lowest)
  const role = tones[at]?.role
  if (!role) return null
  // A hand that holds the root is in an inversion: its lowest tone's place in the chord, at most the
  // 3rd (a sus4 from its 4th is in its 1st, a 6 chord from its 6th in its 3rd).
  if (hand.some((key) => roleOf(key) === 'root'))
    return { inversion: Math.min(at, MOST_INVERSIONS) }
  return isFromTone(role) ? { from: role } : null
}
