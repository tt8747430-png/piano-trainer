import { Meter } from '@base-ui/react/meter'
import { cn } from '@/shared/lib'

/** A bar's paint: the learned green, the one action's honey, ink, or soft ink. */
const TONES = {
  learned: 'bg-learned',
  primary: 'bg-primary',
  ink: 'bg-foreground',
  soft: 'bg-muted-foreground',
} as const

/**
 * How much of something is: a thin bar filled in its paint, on the kit's meter. Named (`label`, and
 * `said` for its value in words: "40% of your time"), a screen reader hears it as a meter; unnamed,
 * it is a picture of a count its row says already. It changes at once: a bar's width never animates.
 */
export function ProgressBar({
  done,
  total,
  label,
  said,
  tone = 'learned',
  className,
}: {
  done: number
  total: number
  label?: string
  said?: string
  tone?: keyof typeof TONES
  /** Its height and width where the row sets them (`h-2 max-w-40`). */
  className?: string
}) {
  return (
    <Meter.Root
      value={done}
      max={Math.max(total, 1)}
      aria-label={label}
      aria-hidden={label === undefined ? true : undefined}
      {...(said === undefined ? {} : { getAriaValueText: () => said })}
      render={<span />}
      className={cn('block h-1.5 min-h-1.5 flex-1', className)}
    >
      <Meter.Track
        render={<span />}
        className="block size-full overflow-hidden rounded-pill bg-muted"
      >
        <Meter.Indicator
          render={<span />}
          className={cn('block h-full rounded-pill', TONES[tone])}
        />
      </Meter.Track>
    </Meter.Root>
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
        'flex text-[0.8125rem] text-muted-foreground',
        above ? 'flex-col-reverse gap-2' : 'items-center gap-3',
        className,
      )}
    >
      <ProgressBar done={done} total={total} />
      <span aria-hidden>{count}</span>
      <span className="sr-only">{said}</span>
    </span>
  )
}
