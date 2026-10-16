import { describe, expect, it } from 'vitest'
import { nameChords } from './chord-finder'
import { midi, type Midi } from './pitch'
import { alteredSymbol, voicingKind } from './voicing-kind'

const keys = (...numbers: number[]): Midi[] => numbers.map((n) => midi(n))
const kindOf = (...numbers: number[]) => {
  const played = keys(...numbers)
  const [best] = nameChords(played)
  return best ? voicingKind(played, best) : voicingKind(played)
}

describe('voicingKind', () => {
  it('calls a chord within an octave close, and one spread past it open', () => {
    expect(kindOf(60, 64, 67, 71)).toBe('close')
    expect(kindOf(48, 64, 67)).toBe('open')
  })

  it('finds drop 2 and drop 3: a close voicing with its second or third voice from the top an octave down', () => {
    // CMaj7 close G B C E: drop the C (second from the top) to C3 → C3 G3 B3 E4.
    expect(kindOf(48, 55, 59, 64)).toBe('drop2')
    // Drop the B (third from the top) instead → B2 G3 C4 E4.
    expect(kindOf(47, 55, 60, 64)).toBe('drop3')
  })

  it('finds a shell: root, 3rd and 7th alone, the root in the bass', () => {
    expect(kindOf(48, 64, 70)).toBe('shell')
    expect(kindOf(48, 63, 70)).toBe('shell')
  })

  it('finds a stack of 4ths, and the So What voicing: three 4ths and a 3rd on top', () => {
    expect(kindOf(50, 55, 60)).toBe('quartal')
    expect(kindOf(50, 55, 60, 65)).toBe('quartal')
    expect(kindOf(52, 57, 62, 67, 71)).toBe('soWhat')
  })

  it('says nothing of fewer than three keys', () => {
    expect(voicingKind(keys(60, 64))).toBeUndefined()
  })
})

describe('alteredSymbol', () => {
  const symbolOf = (...numbers: number[]) => {
    const [best] = nameChords(keys(...numbers))
    return best ? alteredSymbol(best) : undefined
  }

  it('names a dominant 7th with two altered tensions or more, and no natural one, as alt', () => {
    expect(symbolOf(48, 64, 70, 73, 75, 80)).toBe('C7alt')
    expect(symbolOf(48, 64, 70, 73, 75)).toBe('C7alt')
  })

  it('leaves a chord with one alteration, or a natural 9th or 13th, as it is', () => {
    expect(symbolOf(48, 64, 67, 70, 73)).toBeUndefined()
    expect(symbolOf(48, 64, 70, 73, 81)).toBeUndefined()
    expect(symbolOf(48, 64, 70, 74, 78)).toBeUndefined()
    expect(symbolOf(48, 64, 67, 71)).toBeUndefined()
  })
})
