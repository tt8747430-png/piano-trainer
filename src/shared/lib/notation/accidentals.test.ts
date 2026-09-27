import { describe, expect, it } from 'vitest'
import { note, type Key } from '@/shared/lib/music'
import { keyAccidentals, printedAccidentals } from './accidentals'

const G: Key = { tonic: note('G'), minor: false }
const at = (letter: 'F' | 'C', accidental: -1 | 0 | 1, continued = false) => ({
  spelled: note(letter, accidental),
  octave: 4,
  continued,
})

describe('keyAccidentals', () => {
  it('reads a key’s signature from its scale', () => {
    expect(keyAccidentals(G).get('F')).toBe(1)
    expect(keyAccidentals({ tonic: note('C'), minor: true }).get('E')).toBe(-1)
  })
})

describe('printedAccidentals', () => {
  it('prints what the signature and the bar do not say, a natural as 0', () => {
    expect(
      printedAccidentals([at('F', 1), at('F', 0), at('F', 0), at('F', 1), at('C', 1)], G),
    ).toEqual([null, 0, null, 1, 1])
  })

  it('prints nothing on a tied continuation, and lets it change nothing', () => {
    expect(printedAccidentals([at('F', 0, true), at('F', 0)], G)).toEqual([null, 0])
  })

  it('keeps each octave apart', () => {
    expect(
      printedAccidentals([at('C', 1), { spelled: note('C', 1), octave: 5, continued: false }], G),
    ).toEqual([1, 1])
  })
})
