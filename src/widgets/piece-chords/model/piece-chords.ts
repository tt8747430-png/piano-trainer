import type { Performance } from '@/shared/lib/arrangement'

/** The chords a piece plays, each once, in the order they first come. */
export function chordsOf(performance: Performance): Performance['chords'][number][] {
  const seen = new Set<string>()
  return performance.chords.filter((chord) => {
    if (seen.has(chord.symbol)) return false
    seen.add(chord.symbol)
    return true
  })
}
