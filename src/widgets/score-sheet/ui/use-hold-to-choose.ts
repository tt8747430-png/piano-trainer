import { useEffect, useRef, type PointerEvent } from 'react'
import type { Tick } from '@/shared/lib/music'

/** How long a finger holds a bar still before it chooses it, as a notation app's long press. */
export const HOLD_MS = 450
/** How far a finger may move during the hold and still be holding: past it, it scrolls the sheet. */
const STILL_PX = 8

/** Where the bar under a point starts, or null where no bar is there. */
function barStartAt(x: number, y: number): Tick | null {
  const bar = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-bar-start]')
  const start = bar?.dataset.barStart
  return start === undefined ? null : Number(start)
}

/** A drag that chooses bars keeps the sheet from scrolling under it. */
const hold = (event: TouchEvent) => event.preventDefault()

/**
 * Bars chosen by touch, as Sibelius chooses them on a phone (ADR 0076): a finger held still on a bar
 * for `HOLD_MS` chooses it, and dragged on chooses every bar from it to the one under the finger,
 * on any line; the sheet holds still and the canvas does not pan while it does (its moves are
 * claimed with `preventDefault`), and the click it ends with is its own. A mouse chooses with Shift.
 * Returns the handlers for a bar that starts at a tick.
 */
export function useHoldToChoose(choose: (tick: Tick, extend: boolean) => void) {
  const press = useRef<{ id: number; x: number; y: number; timer: number } | null>(null)
  const choosing = useRef<number | null>(null)
  /** The bar the drag last reached: it chooses again only as it reaches another. */
  const reached = useRef<Tick | null>(null)

  const end = () => {
    if (press.current) window.clearTimeout(press.current.timer)
    press.current = null
    if (choosing.current === null) return
    choosing.current = null
    document.removeEventListener('touchmove', hold)
    // The click the drag ends with chose nothing: it is the drag's.
    const swallow = (click: MouseEvent) => {
      click.stopPropagation()
      click.preventDefault()
    }
    window.addEventListener('click', swallow, { capture: true, once: true })
    window.setTimeout(() => window.removeEventListener('click', swallow, { capture: true }), 0)
  }
  useEffect(() => end, [])

  return (start: Tick) => ({
    'data-bar-start': start,
    onPointerDown(event: PointerEvent<HTMLElement>) {
      if (event.pointerType === 'mouse') return
      end()
      const { pointerId: id, clientX: x, clientY: y } = event
      const timer = window.setTimeout(() => {
        press.current = null
        choosing.current = id
        document.addEventListener('touchmove', hold, { passive: false })
        navigator.vibrate?.(10)
        reached.current = start
        choose(start, false)
        choose(start, true)
      }, HOLD_MS)
      press.current = { id, x, y, timer }
    },
    onPointerMove(event: PointerEvent<HTMLElement>) {
      const held = press.current
      if (held?.id === event.pointerId) {
        if (Math.hypot(event.clientX - held.x, event.clientY - held.y) > STILL_PX) end()
        return
      }
      if (choosing.current !== event.pointerId) return
      event.preventDefault()
      const tick = barStartAt(event.clientX, event.clientY)
      if (tick === null || tick === reached.current) return
      reached.current = tick
      choose(tick, true)
    },
    onPointerUp: end,
    onPointerCancel: end,
  })
}
