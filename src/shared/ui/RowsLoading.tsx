import { Skeleton } from './Skeleton'

/**
 * A list of rows being read, drawn as their outlines (one 64 card a row, 8 apart), pulsing where
 * motion is allowed and named once for a screen reader. The one loading state of a list of rows:
 * groups, members, a shared folder, the Administration's tabs, the groups a folder is shared with.
 */
export function RowsLoading({ label, rows = 3 }: { label: string; rows?: number }) {
  return (
    <div role="status" aria-label={label} className="flex flex-col gap-2">
      {Array.from({ length: rows }, (_, row) => (
        <Skeleton key={row} className="h-16 rounded-card" />
      ))}
    </div>
  )
}
