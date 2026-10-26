import { pieceStage } from '@/entities/course'
import { entryWords, type Entry } from '@/entities/piece'
import { STAGES, type Stage } from '@/entities/step'
import { matchesQuery, readChordList } from '@/shared/lib'
import { usesOnly } from './known-chords'
import type { SongsFilter } from './songs-filter'

/**
 * The Songs list: shelves in order, their entries filtered by search, shelf and level, to those with
 * chords and to those that use only the chords known. All shows every shelf but the favourites, whose
 * songs stand on their own shelves too.
 */
export function songsView<
  Shelf extends { readonly id: string; readonly entries: readonly Entry[] },
>(shelves: readonly Shelf[], filter: SongsFilter): { shelf: Shelf; entries: Entry[] }[] {
  const known = new Set(readChordList(filter.known))
  return shelves
    .filter((shelf) =>
      filter.collection === 'all' ? shelf.id !== 'favourites' : shelf.id === filter.collection,
    )
    .map((shelf) => ({
      shelf,
      entries: shelf.entries.filter(
        (entry) =>
          (!filter.withChords || entry.kind !== 'listing') &&
          (filter.stage === 'any' || pieceStage(entry.id) === filter.stage) &&
          (known.size === 0 || usesOnly(entry, known)) &&
          matchesQuery(entryWords(entry), filter.q),
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
    songsView(shelves, { ...filter, q: '', withChords: false, stage: 'any', known: '' }).flatMap(
      (group) => group.entries.map((entry) => pieceStage(entry.id)),
    ),
  )
  return STAGES.filter((stage) => held.has(stage))
}
