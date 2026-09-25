import type { Level } from '@/entities/path'
import type { Collection, Entry } from '@/entities/piece'
import { matchesQuery } from '@/shared/lib'
import type { SongsFilter } from './songs-filter'

const searchable = (entry: Entry): string[] => [
  entry.title,
  entry.titleEn ?? '',
  ...(entry.credits ?? []).flatMap((credit) => (credit.role === 'unknown' ? [] : [credit.names])),
]

/** The Songs list: collections in order, their entries filtered by search, collection and level. */
export function songsView(
  collections: readonly Collection[],
  filter: SongsFilter,
  levelOfEntry: (entry: Entry) => Level | undefined,
): { collection: Collection; entries: Entry[] }[] {
  return collections
    .filter((collection) => filter.collection === 'all' || collection.id === filter.collection)
    .map((collection) => ({
      collection,
      entries: collection.entries.filter(
        (entry) =>
          (filter.level === 'any' || levelOfEntry(entry) === filter.level) &&
          matchesQuery(searchable(entry), filter.q),
      ),
    }))
    .filter((group) => group.entries.length > 0)
}
