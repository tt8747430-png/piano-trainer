import { midi, pitchClass, type Midi, type PitchClass } from '@/shared/lib/music'
import type { KeyMark, ShownKeys } from '@/shared/ui'

/** A chord with a note on top, as a melody over it: the nearest key above its highest with that note. */
export function noteOnTop(chord: ShownKeys, pc: PitchClass, mark: KeyMark): ShownKeys {
  const above = Math.max(...chord.keys) + 1
  const top = midi(above + pitchClass(pc - above))
  const marks = new Map<Midi, KeyMark>(chord.marks)
  marks.set(top, mark)
  return { keys: [...chord.keys, top], marks }
}
