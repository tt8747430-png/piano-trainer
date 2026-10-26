import { PieceLink, type Entry } from '@/entities/piece'
import { RowLink } from '@/shared/ui'
import { useEntryFace } from './use-entry-face'

/**
 * A piece or listing in a list, linking to its page on its shelf: its face (`useEntryFace`), its
 * number in its book on its tile, else its kind's icon; no `tile` where every row of its list would
 * wear the same one. A `status` (Archived, in Search) leads its detail line.
 */
export function EntryRow({
  entry,
  tile = true,
  status,
}: {
  entry: Entry
  tile?: boolean
  status?: string | undefined
}) {
  const { face, kind } = useEntryFace(entry)
  const number = entry.source?.number
  const detail = [status, face.detail].filter((part) => part !== undefined).join(' · ')
  return (
    <li>
      <RowLink
        {...face}
        detail={detail || undefined}
        {...(!tile ? {} : number === undefined ? kind : { numeral: number, paint: kind.paint })}
        render={<PieceLink entry={entry} />}
      />
    </li>
  )
}
