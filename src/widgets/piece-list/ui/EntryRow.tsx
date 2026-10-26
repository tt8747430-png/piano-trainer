import { PieceLink, type Entry } from '@/entities/piece'
import { RowLink } from '@/shared/ui'
import { useEntryFace } from './use-entry-face'

/**
 * A piece or listing in a list, linking to its page on its shelf: its face (`useEntryFace`), its
 * number in its book on its tile, else its kind's icon; no `tile` where every row of its list would
 * wear the same one.
 */
export function EntryRow({ entry, tile = true }: { entry: Entry; tile?: boolean }) {
  const { face, kind } = useEntryFace(entry)
  const number = entry.source?.number
  return (
    <li>
      <RowLink
        {...face}
        {...(!tile ? {} : number === undefined ? kind : { numeral: number, paint: kind.paint })}
        render={<PieceLink entry={entry} />}
      />
    </li>
  )
}
