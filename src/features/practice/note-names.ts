import type { Performance, PerformanceNote } from '@/shared/lib/arrangement'
import { noteName, spellInKey, writtenOctave, type PitchClass } from '@/shared/lib/music'

export interface NoteName {
  readonly name: string
  readonly octave: number
}

/** A played note's written name and octave: F♯4, B♯3. */
export const playedNoteName = (played: PerformanceNote): NoteName => ({
  name: noteName(played.spelled),
  octave: writtenOctave(played.midi, played.spelled),
})

export const noteLabel = ({ name, octave }: NoteName): string => `${name}${octave}`

/** A pitch class named as the chord it was played in spells it, else as the key does: Wait mode's "Not C#". */
export function spellPitchClass(performance: Performance, chord: number, pc: PitchClass): string {
  const tone = performance.chords[chord]?.tones.find((t) => t.pitchClass === pc)
  return noteName(tone?.note ?? spellInKey(pc, performance.key))
}
