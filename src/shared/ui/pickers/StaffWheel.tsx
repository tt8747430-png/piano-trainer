import { useRef, type KeyboardEvent, type PointerEvent, type WheelEvent } from 'react'
import { cn } from '@/shared/lib'

/** How far a finger drags for one step of a wheel, in CSS px. */
const STEP = 28
/** A trackpad's wheel delta for one step. */
const WHEEL_STEP = 40

/** One figure of a time signature as a wheel: its name, its values in order, the one chosen. */
export interface WheelFigure {
  readonly label: string
  readonly values: readonly number[]
  readonly value: number
  readonly onChange: (value: number) => void
  /** What a value reads as, to the eye and to a screen reader (0 beats of a pickup: none). */
  readonly text?: (value: number) => string
}

/** The staff's five lines, 16px apart, from 54px down: the figures stand over two spaces each. */
const LINES = [54, 70, 86, 102, 118] as const

/**
 * A figure's wheel (R31-E, the owner's ruling): a spin button over its half of the staff, the value
 * chosen large over two of its spaces, the next one outside the staff, faded (`neighbour`: above the
 * top figure, under the bottom one). ↑ and ↓, a drag, a wheel or a tap on the faded one turn it.
 */
function Figure({ figure, place }: { figure: WheelFigure; place: 'top' | 'bottom' }) {
  const { label, values, value, onChange, text = String } = figure
  const at = Math.max(0, values.indexOf(value))
  const turn = (by: number) => {
    const next = values[Math.min(values.length - 1, Math.max(0, at + by))]
    if (next !== undefined && next !== value) onChange(next)
  }
  // The neighbour shown: the one before above the top figure, the one after under the bottom one.
  const neighbour = values[place === 'top' ? at - 1 : at + 1]
  const drag = useRef<{ y: number; moved: number } | null>(null)
  const onKeyDown = (event: KeyboardEvent) => {
    const by = { ArrowUp: 1, ArrowDown: -1, PageUp: 3, PageDown: -3 }[event.key]
    if (by !== undefined) turn(by)
    else if (event.key === 'Home') turn(-values.length)
    else if (event.key === 'End') turn(values.length)
    else return
    event.preventDefault()
  }
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = { y: event.clientY, moved: 0 }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }
  const onPointerMove = (event: PointerEvent) => {
    const start = drag.current
    if (!start) return
    // Dragged down, the faded one above comes down into place: the value before.
    const steps = Math.trunc((event.clientY - start.y) / STEP)
    if (steps === 0) return
    turn(-steps)
    drag.current = { y: start.y + steps * STEP, moved: start.moved + Math.abs(steps) }
  }
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = drag.current
    drag.current = null
    if (!start || start.moved > 0) return
    // A tap on the faded neighbour chooses it.
    const box = event.currentTarget.getBoundingClientRect()
    const y = event.clientY - box.top
    if (place === 'top' && y < box.height / 3) turn(-1)
    if (place === 'bottom' && y > (box.height * 2) / 3) turn(1)
  }
  const onWheel = (event: WheelEvent) => {
    if (Math.abs(event.deltaY) < WHEEL_STEP / 2) return
    turn(event.deltaY > 0 ? -1 : 1)
  }
  const centre = place === 'top' ? (LINES[0] + LINES[2]) / 2 : (LINES[2] + LINES[4]) / 2
  return (
    <div
      role="spinbutton"
      tabIndex={0}
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={values[0]}
      aria-valuemax={values.at(-1)}
      aria-valuetext={text(value)}
      title={label}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (drag.current = null)}
      onWheel={onWheel}
      className={cn(
        'absolute inset-x-0 cursor-ns-resize touch-none select-none focus-visible:z-10 focus-visible:-outline-offset-3',
        place === 'top' ? 'top-0 h-[86px]' : 'top-[86px] h-[86px]',
      )}
    >
      {neighbour === undefined ? null : (
        <span
          aria-hidden
          style={{ top: place === 'top' ? 10 : 130 - 86 }}
          className="absolute inset-x-0 grid h-8 place-items-center font-serif text-2xl leading-none font-bold text-foreground/30"
        >
          {text(neighbour)}
        </span>
      )}
      <span
        aria-hidden
        style={{ top: centre - (place === 'top' ? 0 : 86) - 18 }}
        className="absolute inset-x-0 grid h-9 place-items-center font-serif text-[2.5rem] leading-none font-extrabold tabular-nums"
      >
        {text(value)}
      </span>
    </div>
  )
}

/**
 * A time signature's figures as wheels on a staff (R31-E, the owner's ruling: Current and Pickup,
 * the numbers stacked large on staff lines): the top figure over lines 1 to 3, the bottom over 3 to
 * 5, each turned on its own; the neighbours only outside the staff, fading. A figure that does not
 * turn (`bottom` a number) is printed alone.
 */
export function StaffWheel({
  label,
  top,
  bottom,
}: {
  label: string
  top: WheelFigure
  bottom: WheelFigure | number
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-col items-center gap-1.5">
      <span aria-hidden className="text-sm font-semibold text-muted-foreground">
        {label}
      </span>
      <div className="relative h-43 w-28 overflow-hidden rounded-control border border-hairline bg-background mask-y-from-85%">
        {LINES.map((y) => (
          <i
            key={y}
            aria-hidden
            style={{ top: y }}
            className="absolute inset-x-2 h-px bg-foreground/50"
          />
        ))}
        <Figure figure={top} place="top" />
        {typeof bottom === 'number' ? (
          <span
            aria-hidden
            style={{ top: (LINES[2] + LINES[4]) / 2 - 18 }}
            className="absolute inset-x-0 grid h-9 place-items-center font-serif text-[2.5rem] leading-none font-extrabold text-foreground/60"
          >
            {bottom}
          </span>
        ) : (
          <Figure figure={bottom} place="bottom" />
        )}
      </div>
    </div>
  )
}
