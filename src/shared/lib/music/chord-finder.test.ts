import { describe, expect, it } from 'vitest'
import { nameChords } from './chord-finder'
import { note } from './note'
import { midi } from './pitch'

const found = (...keys: number[]) => nameChords(keys.map((key) => midi(key)))
const named = (...keys: number[]) => found(...keys).map((each) => each.symbol)

describe('nameChords', () => {
  it('spells a chord in a key as the key writes it, unless that writes more of it outside the key', () => {
    const C = { tonic: note('C'), minor: false }
    const E = { tonic: note('E'), minor: false }
    const inKey = (key: typeof C, ...keys: number[]) => nameChords(keys.map(midi), key)[0]?.symbol
    expect(inKey(C, 61, 64, 68)).toBe('C#m')
    expect(inKey(E, 68, 72, 75)).toBe('G#')
    expect(inKey(E, 70, 74, 77)).toBe('B♭')
    expect(inKey({ tonic: note('G', -1), minor: false }, 66, 70, 73)).toBe('G♭')
  })

  it('names a 9th chord over its 7th before a 6/9 that leaves its 5th out and adds a tone', () => {
    expect(named(48, 50, 52, 53, 57)[0]).not.toMatch(/6\/9/)
  })

  it('opens a chord of five notes or more in the explorer with no inversion', () => {
    expect(found(47, 48, 52, 55, 62)[0]?.inversion).toBeUndefined()
    expect(found(52, 55, 60)[0]?.inversion).toBe(1)
  })

  it('names an added tone once, a 2nd within the octave and a 9th past it', () => {
    expect(named(60, 62, 64, 67).filter((symbol) => symbol.startsWith('C'))).toEqual(['Cadd2'])
    expect(named(60, 64, 67, 74)).toContain('Cadd9')
    expect(named(60, 64, 67, 74)).not.toContain('Cadd2')
  })

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

  it('names an inversion only whole: a slash chord leaves no tone out but the 5th over its 3rd or 7th', () => {
    expect(named(48, 50, 52)).toEqual([])
    expect(named(48, 53, 55)).toEqual(['Csus4', 'Fsus2/C'])
    expect(named(48, 50, 55)).toEqual(['Csus2'])
    expect(named(48, 52, 54, 58)).toEqual(['C7♭5', 'F#7♭5/C'])
    expect(named(52, 58, 60)).toEqual(['C7/E'])
    expect(named(48, 52, 53, 55)).toEqual(['Cadd4'])
  })

  it('names a slash chord with no added tone but its 6th', () => {
    expect(named(48, 52, 55, 58, 62)).toEqual(['C9'])
    expect(named(48, 52, 55, 62)).toEqual(['Cadd9'])
    expect(named(48, 52, 55, 69)).toEqual(['C6', 'Am7/C'])
    expect(named(48, 52, 55, 59, 62)).toEqual(['CMaj9'])
  })

  it('leaves the 5th out of a suspended chord only as a 7sus4', () => {
    expect(named(48, 53, 58)[0]).toBe('C7sus4')
    expect(named(48, 53, 58, 62)[0]).toBe('C9sus4')
    expect(named(48, 50, 58)).toEqual([])
    expect(named(48, 50, 59)).toEqual([])
    expect(named(48, 53, 59)).toEqual([])
    expect(named(48, 50, 53, 59)).toEqual([])
    expect(named(48, 53, 57, 59)).toEqual([])
  })

  it('leaves the 3rd out of a plain 7th chord alone, never one that adds a tone', () => {
    expect(named(51, 58, 60, 62)).toEqual(['Cm9/E♭'])
    expect(named(49, 56, 58, 60)).toEqual(['B♭m9/D♭'])
    expect(named(51, 58, 60, 62)).not.toContain('E♭7(add13)')
  })

  it('keeps the 9th of an 11th chord over a major 3rd, where the 11th clashes with it', () => {
    expect(named(48, 52, 53, 58)).not.toContain('C11')
    expect(named(48, 52, 53, 59)).not.toContain('CMaj11')
    expect(named(48, 52, 55, 58, 62, 65)[0]).toBe('C11')
  })

  it('leaves the 5th out of a slash chord only under a minor 7th', () => {
    expect(named(60, 61, 64)).toEqual([])
    expect(named(59, 60, 64)).toEqual([])
    expect(named(48, 55, 56)).toEqual([])
    expect(named(47, 48, 50, 52)).toEqual([])
    expect(named(46, 52, 60)).toEqual(['C7/B♭'])
    expect(named(48, 50, 54)).toEqual(['D7/C'])
  })

  it('names a slash chord over its 3rd, 5th, 7th or added 6th, never over a tension or a suspended tone', () => {
    expect(named(48, 51, 55, 58, 62, 65)).toEqual(['Cm11'])
    expect(named(48, 50, 55)).toEqual(['Csus2'])
    expect(named(53, 55, 60)).toEqual(['Fsus2'])
    expect(named(43, 48, 50)).toEqual(['Gsus4', 'Csus2/G'])
    expect(named(57, 60, 64, 67)).toEqual(['Am7', 'C6/A'])
  })

  it('names a 6/9 as one, however close its 9th', () => {
    expect(named(60, 62, 64, 67, 69)[0]).toBe('C6/9')
    expect(named(60, 62, 63, 67, 69)[0]).toBe('Cm6/9')
  })

  it('spells the bass of a slash chord as the key writes it, never with a double accidental or B# for C', () => {
    const C = { tonic: note('C'), minor: false }
    const inKey = (...keys: number[]) => nameChords(keys.map(midi), C).map((each) => each.symbol)
    expect(inKey(48, 52, 56)).toEqual(['C+', 'E+/C', 'A♭+/C'])
    expect(inKey(48, 51, 54, 57)).toEqual(['C°7', 'E♭°7/C', 'F#°7/C', 'A°7/C'])
  })
})
