import {
  CHORD_QUALITIES,
  chordBass,
  qualitySpellings,
  type Chord,
  type ChordQuality,
} from './chord'
import { parseNoteName } from './note'

export class ChordSymbolError extends Error {
  override readonly name = 'ChordSymbolError'
  readonly symbol: string

  constructor(symbol: string) {
    super(`Unknown chord symbol "${symbol}"`)
    this.symbol = symbol
  }
}

/** ASCII and typographic forms compare equal: `m7b5` is `m7♭5`, `m7(-5)` is `m7(−5)`. */
const normalise = (suffix: string): string =>
  suffix.replaceAll('♭', 'b').replaceAll('♯', '#').replaceAll('−', '-')

const QUALITY_BY_SUFFIX = new Map<string, ChordQuality>(
  CHORD_QUALITIES.flatMap((quality) =>
    qualitySpellings(quality).map((spelling) => [normalise(spelling), quality] as const),
  ),
)

/** Root lengths tried, longest first: `F##`, `Bbb` and `F𝄪` take three code units. */
const ROOT_LENGTHS = [3, 2, 1]

/**
 * Reads `F#m7b5/C`: a root, a quality suffix in any of its spellings, and an optional bass after the
 * last slash. A bass that is a chord tone is spelled as that tone (`D#/G` → `D#/F𝄪`).
 */
export function parseChordSymbol(symbol: string): Chord {
  const slash = symbol.lastIndexOf('/')
  const bass = slash > 0 ? parseNoteName(symbol.slice(slash + 1)) : null
  // `6/9` and `7(−9/+5)` keep their slash: only a note name after it makes a bass.
  const head = bass ? symbol.slice(0, slash) : symbol
  for (const length of ROOT_LENGTHS) {
    const root = parseNoteName(head.slice(0, length))
    const quality = QUALITY_BY_SUFFIX.get(normalise(head.slice(length)))
    if (!root || !quality) continue
    return bass ? { root, quality, bass: chordBass(root, quality, bass) } : { root, quality }
  }
  throw new ChordSymbolError(symbol)
}
