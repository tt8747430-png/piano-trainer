import type { DiagramChord } from '@/features/practice'
import { pitchClass, type Midi } from '@/shared/lib/music'

/**
 * Whether keys held together are the chord (ADR 0100): every note its diagram marks, its bass among
 * them, in any octave or inversion, and no note the chord has not.
 */
export function holdsChord(
  keys: Iterable<Midi>,
  chord: Pick<DiagramChord, 'keys' | 'pitchClasses'>,
): boolean {
  const held = new Set([...keys].map((key) => pitchClass(key)))
  return (
    held.size > 0 &&
    chord.keys.every((key) => held.has(pitchClass(key))) &&
    [...held].every((pc) => chord.pitchClasses.includes(pc))
  )
}
