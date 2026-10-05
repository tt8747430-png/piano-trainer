import { describe, expect, it } from 'vitest'
import { chordTypes } from './chord-types'

describe('chordTypes', () => {
  it('asks the table’s chords of the sizes chosen, plain', () => {
    expect(chordTypes({ sizes: ['triads'], suspended: [], added: [], altered: false })).toEqual([
      'maj',
      'min',
      'dim',
      'aug',
    ])
  })

  it('takes a suspended or added chord only where its suspension or tone is on', () => {
    expect(
      chordTypes({ sizes: ['triads'], suspended: ['sus4'], added: ['six'], altered: false }),
    ).toEqual(['maj', 'min', 'dim', 'aug', 'sus4', 'six', 'm6'])
    expect(
      chordTypes({ sizes: ['sevenths'], suspended: ['sus4'], added: [], altered: false }),
    ).toContain('sus7')
    expect(
      chordTypes({ sizes: ['triads'], suspended: [], added: ['sixNine'], altered: false }),
    ).toEqual(['maj', 'min', 'dim', 'aug', 's69', 'm69'])
  })

  it('takes an altered chord only when Altered is on', () => {
    const plain = chordTypes({ sizes: ['sevenths'], suspended: [], added: [], altered: false })
    expect(plain).not.toContain('b9')
    expect(plain).toContain('d7')
    const altered = chordTypes({ sizes: ['sevenths'], suspended: [], added: [], altered: true })
    expect(altered).toEqual(expect.arrayContaining(['b9', 's9', 'b5', 'alt', 'M7s11']))
  })
})
