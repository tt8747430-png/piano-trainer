import { describe, expect, it } from 'vitest'
import { nameFrom } from './name-from'

const mine = (name: string) => `${name} (mine)`

describe('nameFrom', () => {
  it('names a thing made from another after it', () => {
    expect(nameFrom('Waltz', mine, 40)).toBe('Waltz (mine)')
  })

  it('shortens a long name at a word, so the whole fits', () => {
    const name = nameFrom('Bass + chords with a broken chord in the right hand', mine, 40)
    expect(name).toBe('Bass + chords with a broken… (mine)')
    expect(name.length).toBeLessThanOrEqual(40)
  })

  it('cuts a name of one long word where it must', () => {
    const name = nameFrom('x'.repeat(50), mine, 20)
    expect(name).toBe(`${'x'.repeat(12)}… (mine)`)
    expect(name.length).toBeLessThanOrEqual(20)
  })
})
