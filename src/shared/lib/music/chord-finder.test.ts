import { describe, expect, it } from 'vitest'
import { nameChords } from './chord-finder'
import { midi } from './pitch'

const named = (...keys: number[]) =>
  nameChords(keys.map((key) => midi(key))).map((found) => found.symbol)

describe('nameChords', () => {
  it('names a chord in root position, then what else the notes can be', () => {
    expect(named(60, 64, 67)).toEqual(['C'])
    expect(named(60, 64, 67, 69)).toEqual(['C6', 'Am7/C'])
    expect(named(52, 55, 59, 62)[0]).toBe('Em7')
  })

  it('names an inversion as a slash chord, the bass spelled as its chord tone', () => {
    expect(named(64, 67, 72)[0]).toBe('C/E')
    expect(nameChords([midi(64), midi(67), midi(72)])[0]?.inversion).toBe(1)
  })

  it('takes a chord without its 5th, after the chords whose every tone is there', () => {
    const found = nameChords([midi(48), midi(52), midi(58)])
    expect(found[0]?.symbol).toBe('C7')
    expect(found[0]?.no5th).toBe(true)
  })

  it('names nothing from fewer than three notes, or notes no chord holds', () => {
    expect(named(60, 64)).toEqual([])
    expect(named(60, 61, 62)).toEqual([])
  })

  it('spells a root by the builder’s one rule', () => {
    expect(named(61, 64, 68)[0]).toBe('C#m')
    expect(named(61, 65, 68)[0]).toBe('D♭')
  })
})
