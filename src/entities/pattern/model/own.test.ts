import { describe, expect, it } from 'vitest'
import { OWN_NAME_MAX, ownName } from './own'

describe('ownName', () => {
  it('keeps a name trimmed, of 1 to 40 characters', () => {
    expect(ownName('  Waltz (mine) ')).toBe('Waltz (mine)')
    expect(ownName('x'.repeat(OWN_NAME_MAX))).toBe('x'.repeat(OWN_NAME_MAX))
    expect(ownName('x'.repeat(OWN_NAME_MAX + 1))).toBeNull()
    expect(ownName('   ')).toBeNull()
  })
})
