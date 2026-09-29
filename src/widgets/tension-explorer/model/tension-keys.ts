import type { ShownKeys } from '@/features/play-example'
import {
  midi,
  pitchClass,
  placeChord,
  spellChord,
  type Midi,
  type SpelledNote,
  type TensionChord,
  type TensionTone,
} from '@/shared/lib/music'
import type { KeyMark } from '@/shared/ui'

/** A chord in root position from its root at or above middle C, each key marked by role and degree. */
export function tensionChord(root: SpelledNote, quality: TensionChord): ShownKeys {
  const { rh } = placeChord(spellChord(root, quality), { inversion: 0, bothHands: false })
  return {
    keys: rh.map((placed) => placed.midi),
    marks: new Map(
      rh.map((placed) => [placed.midi, { tone: placed.tone.role, label: placed.tone.degree }]),
    ),
  }
}

/** The chord with a note on top: the nearest key above its highest with that note, marked by its role and degree. */
export function withNoteOnTop(chord: ShownKeys, tone: TensionTone): ShownKeys {
  const above = Math.max(...chord.keys) + 1
  const top = midi(above + pitchClass(tone.pitchClass - above))
  const marks = new Map<Midi, KeyMark>(chord.marks)
  marks.set(top, { tone: tone.role, label: tone.degree })
  return { keys: [...chord.keys, top], marks }
}
