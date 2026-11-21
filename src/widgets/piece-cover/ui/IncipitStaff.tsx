import { useMemo } from 'react'
import { isPiece, type Entry } from '@/entities/piece'
import { cn } from '@/shared/lib'
import { incipitSteps } from '../model/incipit'

/** The little staff's lines, top down, in the 44-unit square: 4.5 apart round its middle at 22. */
const LINES = [13, 17.5, 22, 26.5, 31]
/** A step of the staff, a line to the next space. */
const STEP = 2.25

/**
 * A song's first notes' heads on a printed staff, a page in both themes (the boards' INCIPIT): the
 * picture of a song's row and of the songs in a playlist's cover. Hidden from a screen reader.
 */
export function IncipitStaff({
  entry,
  className,
  slot,
}: {
  entry: Entry
  className?: string
  /** The row's tile slot, which a row sizes (`SongRow`). */
  slot?: string
}) {
  const steps = useMemo(() => (isPiece(entry) ? incipitSteps(entry) : []), [entry])
  const gap = steps.length > 1 ? 24 / (steps.length - 1) : 0
  return (
    <svg
      data-slot={slot}
      aria-hidden
      viewBox="0 0 44 44"
      className={cn(
        'bg-(--print-paper) text-(--print-ink) shadow-[0_0_0_1px_--alpha(var(--color-foreground)/10%)]',
        className,
      )}
    >
      {LINES.map((y) => (
        <path key={y} d={`M5 ${y}H39`} stroke="currentColor" strokeWidth={0.7} opacity={0.55} />
      ))}
      {steps.map((step, i) => {
        const x = 10 + i * gap
        const y = 22 - step * STEP
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx={2.6}
            ry={2}
            fill="currentColor"
            transform={`rotate(-20 ${x} ${y})`}
          />
        )
      })}
    </svg>
  )
}
