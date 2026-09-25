import type { Entry } from '@/entities/piece'
import { EntryRow } from './EntryRow'

export interface PieceGroup {
  readonly id: string
  /** The collection's name, or null when the list shows one collection its chip already names. */
  readonly heading: string | null
  readonly entries: readonly Entry[]
}

/** Songs by collection, each under its heading while more than one collection shows. */
export function PieceList({ groups }: { groups: readonly PieceGroup[] }) {
  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <section key={group.id} className="flex flex-col gap-1">
          {group.heading === null ? null : (
            <h2 className="text-xl font-bold text-primary">{group.heading}</h2>
          )}
          <ul className="flex flex-col">
            {group.entries.map((entry) => (
              <EntryRow key={entry.id} entry={entry} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
