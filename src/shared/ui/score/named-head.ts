import { VexFlow } from 'vexflow/core'
import type { SpelledNote } from '@/shared/lib/music'
import type { Duration } from '@/shared/lib/notation'

const SIGN_NAME = { [-1]: 'Flat', 0: '', 1: 'Sharp' } as const
const FORM = { 1: 'Whole', 2: 'Half' } as const

/**
 * A notehead with its note's name in it (SMuFL's note name noteheads, in Bravura): the letter cut out
 * of a filled head, inside a half note's or a whole note's hollow one. None names a double sharp or
 * flat, so such a note keeps its plain head.
 */
export function namedHead(spelled: SpelledNote, value: Duration['value']): string | null {
  if (spelled.accidental === 2 || spelled.accidental === -2) return null
  const form = value === 1 || value === 2 ? FORM[value] : 'Black'
  return VexFlow.Glyphs[`note${spelled.letter}${SIGN_NAME[spelled.accidental]}${form}`]
}
