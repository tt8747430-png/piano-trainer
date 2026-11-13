import { cn } from '@/shared/lib'

/** How much of something is done, as a thin bar in the learned paint. */
export function ProgressBar({ done, total }: { done: number; total: number }) {
  return (
    <span
      aria-hidden
      className="block h-1.5 min-h-1.5 flex-1 overflow-hidden rounded-pill bg-muted"
    >
      <span
        className="block h-full rounded-pill bg-learned transition-[width] duration-300 ease-out"
        style={{ width: `${total === 0 ? 0 : (done / total) * 100}%` }}
      />
    </span>
  )
}

/**
 * How much is done: its bar, the count beside it as its page writes it (`count`: "3 of 8"), and the
 * whole of it said to a screen reader (`said`: "Lessons done: 3 of 8"). With `above`, the count
 * stands over a bar the width of its column (a level's page, a Continue card), as a heading's line.
 */
export function ProgressMeter({
  done,
  total,
  count,
  said,
  above = false,
  className,
}: {
  done: number
  total: number
  count: string
  said: string
  above?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'flex text-sm text-muted-foreground',
        above ? 'flex-col-reverse gap-2' : 'items-center gap-3',
        className,
      )}
    >
      <ProgressBar done={done} total={total} />
      <span aria-hidden className="tabular-nums">
        {count}
      </span>
      <span className="sr-only">{said}</span>
    </span>
  )
}
