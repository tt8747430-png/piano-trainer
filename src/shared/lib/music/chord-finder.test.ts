import { describe, expect, it } from 'vitest'
import { nameChords } from './chord-finder'
import { midi } from './pitch'

const found = (...keys: number[]) => nameChords(keys.map((key) => midi(key)))
const named = (...keys: number[]) => found(...keys).map((each) => each.symbol)

describe('nameChords', () => {
  it('names a chord in root position, then what else the notes can be', () => {
    expect(named(60, 64, 67)).toEqual(['C'])
    expect(named(60, 64, 67, 69)).toEqual(['C6', 'Am7/C'])
    expect(named(52, 55, 59, 62)[0]).toBe('Em7')
  })

  it('names an inversion as a slash chord, the bass spelled as its chord tone', () => {
    expect(named(64, 67, 72)[0]).toBe('C/E')
    expect(found(64, 67, 72)[0]?.inversion).toBe(1)
  })

  it('takes a chord without its 5th, after the chords whose every tone is there', () => {
    const [best] = found(48, 52, 58)
    expect(best?.symbol).toBe('C7')
    expect(best?.leftOut).toEqual(['5th'])
    expect(found(60, 64, 67)[0]?.leftOut).toEqual([])
  })

  it('takes a 6/9 without its 5th, but never a 6th or an added tone', () => {
    const [sixNine] = found(48, 63, 69, 74)
    expect(sixNine?.symbol).toBe('Cm6/9')
    expect(sixNine?.leftOut).toEqual(['5th'])
    expect(named(48, 64, 69)[0]).toBe('Am/C')
  })

  it('takes a shell: the 9th and 11th left out under the chord’s highest number', () => {
    const [thirteenth] = found(48, 64, 70, 81)
    expect(thirteenth?.symbol).toBe('C13')
    expect(thirteenth?.leftOut).toEqual(['5th', '9th'])
    const [minorEleventh] = found(48, 63, 70, 77)
    expect(minorEleventh?.symbol).toBe('Cm11')
    expect(minorEleventh?.leftOut).toEqual(['5th', '9th'])
    expect(named(48, 64, 71, 81)[0]).toBe('CMaj13')
    expect(named(40, 45, 50, 55, 59)[0]).toBe('Em11')
    expect(named(48, 64, 70, 78, 81)[0]).toBe('C13#11')
  })

  it('names a stacked chord before the 7th chord that adds its top tone', () => {
    expect(named(48, 64, 70, 81).slice(0, 2)).toEqual(['C13', 'C7(add13)'])
    expect(named(48, 63, 67, 70, 77).slice(0, 2)).toEqual(['Cm11', 'Cm7(add11)'])
    expect(named(60, 62, 64, 65, 67)[0]).toBe('C(add2,add4)')
  })

  it('takes a 7th chord over a major triad without its 3rd where its 5th is played', () => {
    const [seventh] = found(48, 55, 58)
    expect(seventh?.symbol).toBe('C7')
    expect(seventh?.leftOut).toEqual(['3rd'])
    expect(named(48, 55, 59)[0]).toBe('CMaj7')
  })

  it('reads the key a tritone over the root as the #11 from a 9th up, and as the ♭5 of a 7th chord', () => {
    expect(named(48, 64, 70, 74, 78)[0]).toBe('C9#11')
    expect(named(48, 64, 66, 70)[0]).toBe('C7♭5')
  })

  it('never leaves out the root, an alteration or the highest number', () => {
    expect(named(52, 55, 59, 62)[0]).toBe('Em7')
    expect(named(48, 64, 70, 73)[0]).toBe('C7♭9')
    expect(named(48, 64, 70)).not.toContain('C13')
  })

  it('names a 7sus4 with its ♭9, and the Lydian triad', () => {
    expect(named(48, 65, 67, 70, 73)[0]).toBe('C7sus4♭9')
    expect(named(48, 64, 67, 78)[0]).toBe('Cadd#11')
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
