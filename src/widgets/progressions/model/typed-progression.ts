import {
  ChordSymbolError,
  numeralOf,
  parseChordSymbol,
  parseNumerals,
  type Key,
  type Numeral,
} from '@/shared/lib/music'

/**
 * What a learner typed, as numerals: numerals as written, or chords (`Am F C G`) as their numerals in
 * the key; null while any part cannot be read or written as a numeral.
 */
export function readProgression(text: string, key: Key): Numeral[] | null {
  const numerals = parseNumerals(text)
  if (numerals) return numerals
  const tokens = text.split(/[\s,–—]+/).filter((token) => token !== '' && token !== '-')
  if (tokens.length === 0) return null
  const read: Numeral[] = []
  for (const token of tokens) {
    try {
      const numeral = numeralOf(parseChordSymbol(token), key)
      if (!numeral) return null
      read.push(numeral)
    } catch (error) {
      if (error instanceof ChordSymbolError) return null
      throw error
    }
  }
  return read
}
