import type { Entry } from '@/entities/piece'
import { matchesQuery } from '@/shared/lib'
import type { SongsFilter } from './songs-filter'

const searchable = (entry: Entry): string[] => [
  entry.title,
  entry.titleEn ?? '',
  entry.titleRu ?? '',
  ...(entry.credits ?? []).flatMap((credit) => (credit.role === 'unknown' ? [] : [credit.names])),
]

/** The Songs list: shelves in order, their entries filtered by search and shelf, and to those with chords. */
export function songsView<
  Shelf extends { readonly id: string; readonly entries: readonly Entry[] },
>(shelves: readonly Shelf[], filter: SongsFilter): { shelf: Shelf; entries: Entry[] }[] {
  return shelves
    .filter((shelf) => filter.collection === 'all' || shelf.id === filter.collection)
    .map((shelf) => ({
      shelf,
      entries: shelf.entries.filter(
        (entry) =>
          (!filter.withChords || entry.kind !== 'listing') &&
          matchesQuery(searchable(entry), filter.q),
      ),
    }))
    .filter((group) => group.entries.length > 0)
}
