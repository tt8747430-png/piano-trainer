import type { Performance } from '@/shared/lib/arrangement'
import { noteName, spellInKey, type PitchClass } from '@/shared/lib/music'

/**
 * A pitch class named as the chord it was played in spells it, else (a bar of no chord too) as the
 * key does: Wait mode's "Not C#".
 */
export function spellPitchClass(
  performance: Performance,
  chord: number | undefined,
  pc: PitchClass,
): string {
  const played = chord === undefined ? undefined : performance.chords[chord]
  const tone = played?.tones.find((t) => t.pitchClass === pc)
  return noteName(tone?.note ?? spellInKey(pc, performance.key))
}
