import { useTranslation } from 'react-i18next'
import { barAt } from '../model/bar-at'

const STEPS: Readonly<Record<string, number>> = {
  ArrowLeft: -1,
  ArrowDown: -1,
  ArrowRight: 1,
  ArrowUp: 1,
}

/** One end of the loop: a slider over the bars, dragged or moved by the arrow keys between `min` and `max`. */
export function LoopGrip({
  label,
  x,
  top,
  height,
  bar,
  min,
  max,
  measures,
  onMove,
}: {
  label: string
  x: number
  /** The loop's band, which the grip runs down the edge of. */
  top: number
  height: number
  bar: number
  min: number
  max: number
  measures: readonly { x: number; width: number }[]
  onMove: (bar: number) => void
}) {
  const { t } = useTranslation('music')
  const move = (to: number) => {
    const next = Math.min(max, Math.max(min, to))
    if (next !== bar) onMove(next)
  }
  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={min + 1}
      aria-valuemax={max + 1}
      aria-valuenow={bar + 1}
      aria-valuetext={t('sheet.bar', { n: bar + 1 })}
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
      onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)}
      data-grip
      onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
        const parent = event.currentTarget.parentElement
        const box = parent?.getBoundingClientRect()
        if (!parent || !box) return
        // In the layout's px, however the sheet is zoomed on the screen (a page canvas's zoom).
        const zoom = parent.offsetWidth > 0 && box.width > 0 ? box.width / parent.offsetWidth : 1
        move(barAt(measures, (event.clientX - box.left) / zoom))
      }}
      className="group absolute z-30 flex w-11 -translate-x-1/2 cursor-ew-resize touch-none justify-center rounded-md"
      style={{ left: x, top, height }}
    >
      {/* In the selection colour, down its band’s edge (ADR 0096). */}
      <span
        aria-hidden
        className="h-full w-1 rounded-full bg-ring transition-transform duration-200 ease-out group-hover:scale-x-150"
      />
    </div>
  )
}
