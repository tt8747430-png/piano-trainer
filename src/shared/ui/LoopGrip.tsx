import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'

const STEPS: Readonly<Record<string, number>> = {
  ArrowLeft: -1,
  ArrowDown: -1,
  ArrowRight: 1,
  ArrowUp: 1,
}

/**
 * One end of the loop (ADR 0096, R37: Flowkey's grips), the same on every view: a line in the
 * selection colour down the loop's edge and a white tab on it with a chevron, ‹ at its start, › at its
 * end. A slider between `min` and `max`, dragged (the view says which bar is under the pointer,
 * `barAt`) or moved by the arrow keys, Home and End, saying bars as the piece numbers them. On a view
 * that is a picture (`pointerOnly`), it is out of the tab order and hidden from a screen reader: the
 * views with bars are the way through.
 */
export function LoopGrip({
  end,
  bar,
  min,
  max,
  barAt,
  onMove,
  style,
  pointerOnly = false,
  className,
}: {
  end: 'start' | 'end'
  /** The loop's bar at this end, from 0. */
  bar: number
  min: number
  max: number
  /** The bar under a point on the screen, or none; `grip` is this grip, placed in the view. */
  barAt: (x: number, y: number, grip: HTMLElement) => number | null
  onMove: (bar: number) => void
  /** Where it stands: its centre on the loop's edge. */
  style: CSSProperties
  pointerOnly?: boolean
  className?: string
}) {
  const { t } = useTranslation('music')
  const move = (to: number) => {
    const next = Math.min(max, Math.max(min, to))
    if (next !== bar) onMove(next)
  }
  const Chevron = end === 'start' ? ChevronLeft : ChevronRight
  return (
    <div
      role={pointerOnly ? undefined : 'slider'}
      tabIndex={pointerOnly ? -1 : 0}
      aria-hidden={pointerOnly || undefined}
      aria-label={
        pointerOnly ? undefined : t(end === 'start' ? 'sheet.loopStart' : 'sheet.loopEnd')
      }
      aria-valuemin={pointerOnly ? undefined : min + 1}
      aria-valuemax={pointerOnly ? undefined : max + 1}
      aria-valuenow={pointerOnly ? undefined : bar + 1}
      aria-valuetext={pointerOnly ? undefined : t('sheet.bar', { n: bar + 1 })}
      data-grip={end}
      onKeyDown={(event) => {
        const step = STEPS[event.key]
        const to =
          event.key === 'Home'
            ? min
            : event.key === 'End'
              ? max
              : step === undefined
                ? null
                : bar + step
        if (to === null) return
        event.preventDefault()
        move(to)
      }}
      onPointerDown={(event) => {
        event.stopPropagation()
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onClick={(event) => event.stopPropagation()}
      onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
        const under = barAt(event.clientX, event.clientY, event.currentTarget)
        if (under !== null) move(under)
      }}
      className={cn(
        'group absolute z-30 flex w-11 -translate-x-1/2 cursor-ew-resize touch-none justify-center rounded-control outline-none',
        className,
      )}
      style={style}
    >
      <span aria-hidden className="h-full w-1 rounded-pill bg-ring" />
      <span
        aria-hidden
        className="absolute top-1/2 left-1/2 flex h-10 max-h-full w-5 -translate-1/2 items-center justify-center rounded-control bg-card text-ring shadow-sm ring-1 ring-foreground/10 transition-transform duration-200 ease-out group-hover:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-ring"
      >
        <Chevron className="size-4" strokeWidth={3} />
      </span>
    </div>
  )
}
