import { describe, expect, it } from 'vitest'
import { nameFrom, OWN_NAME_MAX, ownName } from './own'

const mine = (name: string) => `${name} (mine)`

describe('nameFrom', () => {
  it('names a pattern made from another after it', () => {
    expect(nameFrom('Waltz', mine)).toBe('Waltz (mine)')
  })

  it('shortens a long name so the whole fits, and saves', () => {
    const name = nameFrom('Bass + chords with a broken chord in the right hand', mine)
    expect(name).toBe('Bass + chords with a broken… (mine)')
    expect(name.length).toBeLessThanOrEqual(OWN_NAME_MAX)
    expect(ownName(name)).toBe(name)
  })
})
