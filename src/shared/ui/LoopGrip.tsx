import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, type CSSProperties } from 'react'
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
  // The latest move, for a drag the window follows: the grip may move to another line of the score
  // (and this element leave) while the finger is still down.
  const moveRef = useRef(move)
  useEffect(() => {
    moveRef.current = move
  })
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
        event.preventDefault()
        const grip = event.currentTarget
        const id = event.pointerId
        const follow = (moved: PointerEvent) => {
          if (moved.pointerId !== id) return
          const under = barAt(moved.clientX, moved.clientY, grip)
          if (under !== null) moveRef.current(under)
        }
        const stop = (ended: PointerEvent) => {
          if (ended.pointerId !== id) return
          // The click a drag ends with lands on whatever is under the finger: it is the drag's, not a tap.
          window.addEventListener('click', (click) => click.stopPropagation(), {
            capture: true,
            once: true,
          })
          window.removeEventListener('pointermove', follow)
          window.removeEventListener('pointerup', stop)
          window.removeEventListener('pointercancel', stop)
        }
        window.addEventListener('pointermove', follow)
        window.addEventListener('pointerup', stop)
        window.addEventListener('pointercancel', stop)
      }}
      onClick={(event) => event.stopPropagation()}
      className={cn(
        'group absolute z-30 flex w-11 -translate-x-1/2 cursor-ew-resize touch-none justify-center rounded-control outline-none',
        className,
      )}
      style={style}
    >
      <span aria-hidden className="h-full w-0.75 bg-honey-ring" />
      <span
        aria-hidden
        className="absolute top-1/2 left-1/2 flex h-13 max-h-full w-6.5 -translate-1/2 items-center justify-center rounded-[8px] bg-card text-honey-ring shadow-[0_1px_3px_rgb(26_22_18/0.28),0_0_0_1px_rgb(26_22_18/0.08)] transition-transform duration-200 ease-out group-hover:scale-110"
      >
        <Chevron className="size-4" strokeWidth={3} />
      </span>
    </div>
  )
}
