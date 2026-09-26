import type { Performance, PerformanceNote } from '@/shared/lib/arrangement'
import {
  keyPrefersSharps,
  noteName,
  pitchClass,
  rootSpelling,
  type PitchClass,
  type SpelledNote,
} from '@/shared/lib/music'

export interface NoteName {
  readonly name: string
  readonly octave: number
}

/** A pitch class spelled as the chord it belongs to spells it, else as the key would. */
function spellingOf(performance: Performance, chord: number, pc: PitchClass): SpelledNote {
  const tone = performance.chords[chord]?.tones.find((t) => t.pitchClass === pc)
  return tone?.note ?? rootSpelling(pc, keyPrefersSharps(performance.key))
}

/** A played note named from the chord it was played for; a note outside it from the key. */
export function spellPerformedNote(performance: Performance, played: PerformanceNote): NoteName {
  const spelled = spellingOf(performance, played.chord, pitchClass(played.midi))
  return {
    name: noteName(spelled),
    octave: Math.floor((played.midi - spelled.accidental) / 12) - 1,
  }
}

export const noteLabel = ({ name, octave }: NoteName): string => `${name}${octave}`

/** A pitch class named from the chord it belongs to, else from the key: Wait mode's "Play D F# A". */
export const spellPitchClass = (performance: Performance, chord: number, pc: PitchClass): string =>
  noteName(spellingOf(performance, chord, pc))
