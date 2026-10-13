import { spellChord, type Chord } from './chord'
import { pitchClass } from './pitch'
import type { ChordRole } from './tone'

/** The tones that put a chord in an inversion when lowest in the hand: root position to the 3rd. */
const INVERSION_ROLES: readonly ChordRole[] = ['root', '3rd', '5th', '7th']

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
  const role = roleOf(Math.min(...hand))
  if (!role) return null
  const holdsRoot = hand.some((key) => roleOf(key) === 'root')
  const inversion = INVERSION_ROLES.indexOf(role)
  if (holdsRoot && inversion >= 0) return { inversion }
  return isFromTone(role) ? { from: role } : null
}
