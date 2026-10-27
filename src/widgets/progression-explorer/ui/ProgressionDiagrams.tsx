import { chordDiagram } from '@/features/practice'
import { chordSymbol, type Chord, type Key } from '@/shared/lib/music'
import { ChordSummary } from '@/widgets/chord-diagrams'

/**
 * A progression's chords as the Player's diagrams draw them (ADR 0112), each once in the order it
 * first comes, each opening its sheet: the same keys, the same folding, as a song's chord summary.
 */
export function ProgressionDiagrams({
  chords,
  musicKey,
}: {
  chords: readonly Chord[]
  musicKey: Key
}) {
  const seen = new Set<string>()
  const diagrams = chords.flatMap((chord, at) => {
    const symbol = chordSymbol(chord)
    if (seen.has(symbol)) return []
    seen.add(symbol)
    return [chordDiagram(chord, musicKey, at)]
  })
  return <ChordSummary chords={diagrams} />
}
