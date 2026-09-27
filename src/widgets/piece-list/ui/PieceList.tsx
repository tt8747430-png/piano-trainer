import type { Entry } from '@/entities/piece'
import { EntryRow } from './EntryRow'

export interface PieceGroup {
  readonly id: string
  /** The collection's name, or null when the list shows one collection its pop-up already names. */
  readonly heading: string | null
  readonly entries: readonly Entry[]
}

/** Pieces by collection, each under its heading (which names its region) while more than one shows. */
export function PieceList({ groups }: { groups: readonly PieceGroup[] }) {
  return (
    <div className="flex flex-col gap-8 lg:pt-4">
      {groups.map((group) => (
        <section
          key={group.id}
          aria-labelledby={group.heading === null ? undefined : `pieces-${group.id}`}
          className="flex flex-col gap-2"
        >
          {group.heading === null ? null : (
            <h2 id={`pieces-${group.id}`} className="text-2xl">
              {group.heading}
            </h2>
          )}
          <ul className="flex flex-col divide-y divide-hairline rounded-3xl border border-border bg-card px-2">
            {group.entries.map((entry) => (
              <EntryRow key={entry.id} entry={entry} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
