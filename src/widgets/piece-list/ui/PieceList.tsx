import type { Entry } from '@/entities/piece'
import { EntryRow } from './EntryRow'

interface PieceGroup {
  readonly id: string
  /** The collection's name, or null when the list shows one collection its tab already names. */
  readonly heading: string | null
  readonly entries: readonly Entry[]
}

/**
 * Whether a list's rows wear tiles: where a tile tells them apart (a number in a book, a study among
 * songs); a list of plain songs goes without, every row's tile alike.
 */
const rowsNeedTiles = (entries: readonly Entry[]): boolean =>
  entries.some((entry) => entry.source?.number !== undefined || entry.kind !== 'song')

/**
 * Pieces by collection, each under its heading (which names its region) while more than one shows:
 * every piece its own card, in as many columns as the width holds.
 */
export function PieceList({ groups }: { groups: readonly PieceGroup[] }) {
  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <section
          key={group.id}
          aria-labelledby={group.heading === null ? undefined : `pieces-${group.id}`}
          className="flex flex-col gap-3"
        >
          {group.heading === null ? null : (
            <h2 id={`pieces-${group.id}`} className="text-2xl">
              {group.heading}
            </h2>
          )}
          <ul className="grid-cards gap-2 *:card">
            {group.entries.map((entry) => (
              <EntryRow key={entry.id} entry={entry} tile={rowsNeedTiles(group.entries)} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
