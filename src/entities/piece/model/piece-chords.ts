import { chordSymbol } from '@/shared/lib/music'
import { chartOf, chordsOf } from './chart'
import { isPiece, type Entry } from './types'

/** Each piece's chord symbols, read once per object: a list reads a row's again as it renders. */
const symbols = new WeakMap<Entry, readonly string[]>()

/**
 * A piece's chord symbols as its chart writes them, in the order they first come, each once (a slash
 * chord its own), the first `count`: what a song's row lists. A song written in degrees is read in
 * its key; a listing or a song of no chord symbol (ADR 0094) has none.
 */
export function pieceChords(entry: Entry, count = 4): readonly string[] {
  let known = symbols.get(entry)
  if (!known) {
    known = isPiece(entry) ? [...new Set(chordsOf(chartOf(entry)).map(chordSymbol))] : []
    symbols.set(entry, known)
  }
  return known.slice(0, count)
}
