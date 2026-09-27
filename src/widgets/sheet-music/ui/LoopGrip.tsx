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
  bar,
  min,
  max,
  measures,
  onMove,
}: {
  label: string
  x: number
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
      onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
        const box = event.currentTarget.parentElement?.getBoundingClientRect()
        if (box) move(barAt(measures, event.clientX - box.left))
      }}
      className="group absolute inset-y-0 z-30 flex w-11 -translate-x-1/2 cursor-ew-resize touch-none justify-center rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring"
      style={{ left: x }}
    >
      <span
        aria-hidden
        className="h-full w-1 rounded-full bg-selected transition-transform duration-200 ease-out group-hover:scale-x-150"
      />
    </div>
  )
}
