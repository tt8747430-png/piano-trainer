import { describe, expect, it } from 'vitest'
import { midi, TICKS_PER_BEAT } from '@/shared/lib/music'
import { draftOf, oneStaff, shape, staffNotes } from '../testing/test-draft'
import { addNoteKey } from './add-note'
import { writeNotes } from './notes'

const B = TICKS_PER_BEAT

describe('Add note (R31-E, Flat’s)', () => {
  it('writes the middle line’s note on a staff with nothing before the caret', () => {
    expect(addNoteKey(oneStaff(), 'staff0', 0)).toBe(midi(71))
    expect(addNoteKey(draftOf(), 'lh', 0)).toBe(midi(50))
    expect(addNoteKey(oneStaff({ staves: [{ notes: 'r/1', clef: 'alto' }] }), 'staff0', 0)).toBe(
      midi(60),
    )
  })

  it('goes on at the last note’s pitch, a chord’s highest', () => {
    const written = writeNotes(oneStaff(), 'staff0', 0, [midi(64)], B).draft
    expect(shape(staffNotes(written))).toEqual(['E4@0/1'])
    expect(addNoteKey(written, 'staff0', B)).toBe(midi(64))
    const chord = writeNotes(draftOf(), 'rh', 0, [midi(60), midi(67)], B).draft
    expect(addNoteKey(chord, 'rh', 2 * B)).toBe(midi(67))
  })
})
