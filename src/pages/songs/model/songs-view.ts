import { pieceStage } from '@/entities/course'
import type { Entry } from '@/entities/piece'
import { STAGES, type Stage } from '@/entities/step'
import { matchesQuery } from '@/shared/lib'
import type { SongsFilter } from './songs-filter'

const searchable = (entry: Entry): string[] => [
  entry.title,
  entry.titleEn ?? '',
  entry.titleRu ?? '',
  ...(entry.credits ?? []).flatMap((credit) => (credit.role === 'unknown' ? [] : [credit.names])),
]

/** The Songs list: shelves in order, their entries filtered by search, shelf and level, and to those with chords. */
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
          (filter.stage === 'any' || pieceStage(entry.id) === filter.stage) &&
          matchesQuery(searchable(entry), filter.q),
      ),
    }))
    .filter((group) => group.entries.length > 0)
}

/**
 * The stages Songs offers: those the songs of the shelves shown hold, in order, whatever is searched
 * or chosen (so the choice stays put while a search is typed). A stage no song holds is never offered.
 */
export function stagesIn(
  shelves: readonly { readonly id: string; readonly entries: readonly Entry[] }[],
  filter: SongsFilter,
): Stage[] {
  const held = new Set(
    songsView(shelves, { ...filter, q: '', withChords: false, stage: 'any' }).flatMap((group) =>
      group.entries.map((entry) => pieceStage(entry.id)),
    ),
  )
  return STAGES.filter((stage) => held.has(stage))
}
