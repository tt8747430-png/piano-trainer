import { ChordSymbolError, parseChordSymbol, type Chord } from '@/shared/lib/music'

/** A chord as typed, or null while it cannot be read (a learner mid-word, a symbol the kernel lacks). */
export function readChord(typed: string): Chord | null {
  try {
    return parseChordSymbol(typed.trim())
  } catch (error) {
    if (error instanceof ChordSymbolError) return null
    throw error
  }
}
