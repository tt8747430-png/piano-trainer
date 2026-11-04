import type { ProgressionNames } from '@/entities/settings'
import {
  chordSymbol,
  nashvilleNumber,
  numeralOf,
  numeralText,
  printedSymbol,
  type Chord,
  type Key,
} from '@/shared/lib/music'

/** What a box shows of its chord, large: its symbol, numeral or Nashville number (Settings' Written as). */
export function boxName(chord: Chord, key: Key, names: ProgressionNames): string {
  if (names === 'chords') return printedSymbol(chordSymbol(chord))
  if (names === 'nashville') return nashvilleNumber(chord, key)
  const numeral = numeralOf(chord, key)
  return numeral ? numeralText(numeral) : printedSymbol(chordSymbol(chord))
}
