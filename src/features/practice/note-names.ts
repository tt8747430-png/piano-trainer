import type { Performance } from '@/shared/lib/arrangement'
import { noteName, spellInKey, type PitchClass } from '@/shared/lib/music'

/** A pitch class named as the chord it was played in spells it, else as the key does: Wait mode's "Not C#". */
export function spellPitchClass(performance: Performance, chord: number, pc: PitchClass): string {
  const tone = performance.chords[chord]?.tones.find((t) => t.pitchClass === pc)
  return noteName(tone?.note ?? spellInKey(pc, performance.key))
}
