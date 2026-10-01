import type { Level } from '@/entities/path'
import type { Entry } from '@/entities/piece'
import { matchesQuery } from '@/shared/lib'
import type { SongsFilter } from './songs-filter'

const searchable = (entry: Entry): string[] => [
  entry.title,
  entry.titleEn ?? '',
  ...(entry.credits ?? []).flatMap((credit) => (credit.role === 'unknown' ? [] : [credit.names])),
]

/** The Songs list: shelves in order, their entries filtered by search, shelf and level. */
export function songsView<
  Shelf extends { readonly id: string; readonly entries: readonly Entry[] },
>(
  shelves: readonly Shelf[],
  filter: SongsFilter,
  levelOfEntry: (entry: Entry) => Level | undefined,
): { shelf: Shelf; entries: Entry[] }[] {
  return shelves
    .filter((shelf) => filter.collection === 'all' || shelf.id === filter.collection)
    .map((shelf) => ({
      shelf,
      entries: shelf.entries.filter(
        (entry) =>
          (filter.level === 'any' || levelOfEntry(entry) === filter.level) &&
          matchesQuery(searchable(entry), filter.q),
      ),
    }))
    .filter((group) => group.entries.length > 0)
}
