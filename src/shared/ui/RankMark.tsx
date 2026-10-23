import { cn } from '@/shared/lib'

/** Four pips rising in height, 6 to 12px. */
const PIPS = [
  { pip: 1, height: 'h-1.5' },
  { pip: 2, height: 'h-2' },
  { pip: 3, height: 'h-2.5' },
  { pip: 4, height: 'h-3' },
] as const

/** A rank of four as rising pips, the first `rank` filled, named for a screen reader by `label`. */
export function RankMark({ rank, label }: { rank: 1 | 2 | 3 | 4; label: string }) {
  return (
    <span role="img" aria-label={label} title={label} className="inline-flex items-end gap-0.5">
      {PIPS.map(({ pip, height }) => (
        <span
          key={pip}
          className={cn(
            'w-1 rounded-full',
            height,
            pip <= rank ? 'bg-muted-foreground' : 'bg-hairline',
          )}
        />
      ))}
    </span>
  )
}
