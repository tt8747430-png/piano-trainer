import { describe, expect, it } from 'vitest'
import { parseChordSymbol } from './chord-symbol'
import { parseKey, type Key } from './key'
import { nashvilleNumber } from './nashville'

const key = (text: string): Key => {
  const read = parseKey(text)
  if (!read) throw new Error(text)
  return read
}
const numbers = (symbols: string, inKey: string) =>
  symbols.split(' ').map((symbol) => nashvilleNumber(parseChordSymbol(symbol), key(inKey)))

describe('a chord as the Nashville number system writes it', () => {
  it('numbers its root from the tonic, a plain number a major chord, m a minor one', () => {
    expect(numbers('C G Am F', 'C')).toEqual(['1', '5', '6m', '4'])
    expect(numbers('D A Bm G', 'D')).toEqual(['1', '5', '6m', '4'])
    expect(numbers('B°', 'C')).toEqual(['7°'])
  })

  it('writes a figure raised, after its quality', () => {
    expect(numbers('Dm7 G7 Cmaj7', 'C')).toEqual(['2m⁷', '5⁷', '1maj⁷'])
    expect(numbers('Gsus4', 'C')).toEqual(['5sus⁴'])
  })

  it('flattens or sharpens a root off the major scale of the tonic, in a minor key too', () => {
    expect(numbers('Bb', 'C')).toEqual(['♭7'])
    expect(numbers('Am C E7 G F', 'Am')).toEqual(['1m', '♭3', '5⁷', '♭7', '♭6'])
    expect(numbers('F#°', 'C')).toEqual(['♯4°'])
  })

  it('writes a bass by its number after a slash', () => {
    expect(numbers('C/E G/B', 'C')).toEqual(['1/3', '5/7'])
  })
})
