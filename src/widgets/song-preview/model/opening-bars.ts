import { chartOf, readSharedSong } from '@/entities/piece'
import type { PublicEntry } from '@/shared/api/public-library'
import { chordSymbol } from '@/shared/lib/music'

/** The most bars a card draws: its first line's start. */
const CARD_BARS = 4

/**
 * A published song's first bars, each its chords' symbols, as its card draws them small: read from
 * the first line of its chart as any song is (in its key and time); null where there is no line, or
 * it does not read.
 */
export function openingBars(entry: Pick<PublicEntry, 'opening' | 'meta'>): string[][] | null {
  if (!entry.opening) return null
  const song = readSharedSong({
    title: 'Opening',
    key: entry.meta.key ?? 'C',
    meter: entry.meta.meter ?? '4/4',
    // What the chart needs to read but a card draws not: a tempo and a pattern.
    tempo: 90,
    pattern: 'r2',
    sections: [{ kind: 'verse', lines: [entry.opening] }],
  })
  if (!song) return null
  try {
    const [line] =
      chartOf({ id: 'opening', kind: 'song', ...song.music, title: song.title }).sections[0]
        ?.lines ?? []
    const bars = (line ?? []).slice(0, CARD_BARS).map((bar) => bar.chords.map(chordSymbol))
    return bars.length > 0 ? bars : null
  } catch {
    return null
  }
}
