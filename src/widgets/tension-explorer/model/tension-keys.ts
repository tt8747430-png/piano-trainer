import type { ShownKeys } from '@/features/play-example'
import {
  placeChord,
  spellChord,
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

/** A note played over the chord: its degree in its role's colour, an avoid note's plainly. */
export const tensionMark = (tone: TensionTone): KeyMark => ({
  tone: tone.group === 'avoid' ? 'scale' : tone.role,
  label: tone.degree,
})
