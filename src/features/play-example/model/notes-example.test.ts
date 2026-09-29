import { describe, expect, it } from 'vitest'
import { midi, note } from '@/shared/lib/music'
import { noteLine } from '@/shared/lib/schedule'
import { notesShown } from './notes-example'

describe('notesShown', () => {
  it('marks each key a line plays with its note’s name, once', () => {
    const line = noteLine('E4 G4 E4 B♭4', {
      hand: 'rh',
      meter: '4/4',
      key: { tonic: note('C'), minor: false },
    })
    const shown = notesShown(line)
    expect(shown.keys).toEqual([64, 67, 70])
    expect(shown.marks.get(midi(70))).toEqual({ tone: 'scale', label: 'B♭' })
  })
})
