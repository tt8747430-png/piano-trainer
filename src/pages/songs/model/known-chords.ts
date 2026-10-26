import { pieceChords, type Entry } from '@/entities/piece'

/** Every chord a song uses, each once over any bass, as its row counts them. */
const chordsOf = (entry: Entry) => pieceChords(entry, Number.POSITIVE_INFINITY)

/**
 * The chords Chords I know offers (ADR 0103): every chord the shelves' songs use, each once over any
 * bass, the one most songs use first, those used as often by name; a song on two shelves counted once.
 */
export function chordChoices(shelves: readonly { readonly entries: readonly Entry[] }[]): string[] {
  const songs = new Map(shelves.flatMap((shelf) => shelf.entries.map((e) => [e.id, e] as const)))
  const uses = new Map<string, number>()
  for (const entry of songs.values())
    for (const chord of chordsOf(entry)) uses.set(chord, (uses.get(chord) ?? 0) + 1)
  return [...uses]
    .sort(([a, aUses], [b, bUses]) => bUses - aUses || a.localeCompare(b, 'en'))
    .map(([chord]) => chord)
}

/** Whether a song uses only chords the learner knows: none of no chord (a listing) stays. */
export function usesOnly(entry: Entry, known: ReadonlySet<string>): boolean {
  const chords = chordsOf(entry)
  return chords.length > 0 && chords.every((chord) => known.has(chord))
}
