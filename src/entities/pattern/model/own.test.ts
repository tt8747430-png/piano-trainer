import { describe, expect, it } from 'vitest'
import { OWN_NAME_MAX, ownName, readSharedPattern } from './own'

describe('ownName', () => {
  it('keeps a name trimmed, of 1 to 40 characters', () => {
    expect(ownName('  Waltz (mine) ')).toBe('Waltz (mine)')
    expect(ownName('x'.repeat(OWN_NAME_MAX))).toBe('x'.repeat(OWN_NAME_MAX))
    expect(ownName('x'.repeat(OWN_NAME_MAX + 1))).toBeNull()
    expect(ownName('   ')).toBeNull()
  })
})

describe('a pattern from the Public library', () => {
  it('reads as a name and a catalog figure for each hand', () => {
    expect(readSharedPattern({ name: '  Waltz  ', rh: 'b1', lh: 'r' })).toEqual({
      name: 'Waltz',
      rh: 'b1',
      lh: 'r',
    })
  })

  it('reads as nothing without a name, or with a figure the catalog has not', () => {
    expect(readSharedPattern({ name: '', rh: 'b1', lh: 'r' })).toBeNull()
    expect(readSharedPattern({ name: 'Mine', rh: 'nothing', lh: 'root' })).toBeNull()
    expect(readSharedPattern(null)).toBeNull()
  })
})
