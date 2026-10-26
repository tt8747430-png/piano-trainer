import { cn } from '@/shared/lib'

/** How much of something is done, as a thin bar in the learned paint. */
export function ProgressBar({ done, total }: { done: number; total: number }) {
  return (
    <span aria-hidden className="block h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
      <span
        className="block h-full rounded-full bg-learned transition-[width] duration-300 ease-out"
        style={{ width: `${total === 0 ? 0 : (done / total) * 100}%` }}
      />
    </span>
  )
}

/**
 * How much is done: its bar, the count beside it as its page writes it (`count`: "3 of 8"), and the
 * whole of it said to a screen reader (`said`: "Lessons done: 3 of 8").
 */
export function ProgressMeter({
  done,
  total,
  count,
  said,
  className,
}: {
  done: number
  total: number
  count: string
  said: string
  className?: string
}) {
  return (
    <span className={cn('flex items-center gap-3 text-sm text-muted-foreground', className)}>
      <ProgressBar done={done} total={total} />
      <span aria-hidden className="tabular-nums">
        {count}
      </span>
      <span className="sr-only">{said}</span>
    </span>
  )
}
