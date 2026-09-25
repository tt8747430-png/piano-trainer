import type { Performance, PerformanceNote } from '@/shared/lib/arrangement'
import {
  keyPrefersSharps,
  noteName,
  pitchClass,
  rootSpelling,
  type PitchClass,
} from '@/shared/lib/music'

export interface NoteName {
  readonly name: string
  readonly octave: number
}

/** A played note named from the chord it was played for; a note outside it from the key. */
export function spellPerformedNote(performance: Performance, played: PerformanceNote): NoteName {
  const pc = pitchClass(played.midi)
  const tone = performance.chords[played.chord]?.tones.find((t) => t.pitchClass === pc)
  const spelled = tone?.note ?? rootSpelling(pc, keyPrefersSharps(performance.key))
  return {
    name: noteName(spelled),
    octave: Math.floor((played.midi - spelled.accidental) / 12) - 1,
  }
}

export const noteLabel = ({ name, octave }: NoteName): string => `${name}${octave}`

/** A pitch class named from the chord it belongs to, else from the key: Your turn's "Play D F# A". */
export function spellPitchClass(performance: Performance, chord: number, pc: PitchClass): string {
  const tone = performance.chords[chord]?.tones.find((t) => t.pitchClass === pc)
  return noteName(tone?.note ?? rootSpelling(pc, keyPrefersSharps(performance.key)))
}
