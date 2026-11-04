import { describe, expect, it } from 'vitest'
import { note, printedNote, type SpelledNote } from '@/shared/lib/music'
import { nextKey } from './next-key'

describe('nextKey', () => {
  it('goes round the circle of fifths, every key once, back to C', () => {
    const keys: SpelledNote[] = [note('C')]
    for (let i = 0; i < 12; i++) keys.push(nextKey(keys.at(-1) ?? note('C'), false))
    expect(keys.map(printedNote)).toEqual([
      'C',
      'G',
      'D',
      'A',
      'E',
      'B',
      'F♯',
      'D♭',
      'A♭',
      'E♭',
      'B♭',
      'F',
      'C',
    ])
  })

  it('spells a minor key’s tonic as minor keys are written', () => {
    expect(printedNote(nextKey(note('B'), true))).toBe('F♯')
    expect(printedNote(nextKey(note('C'), true))).toBe('G')
  })
})
