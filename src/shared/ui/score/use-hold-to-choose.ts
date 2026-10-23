import { useEffect, useRef, type PointerEvent } from 'react'

/** How long a finger holds a bar still before it chooses it, as a notation app's long press. */
export const HOLD_MS = 450
/** How far a finger may move during the hold and still be holding: past it, it scrolls the sheet. */
const STILL_PX = 8

/** The bar under a point, or null where no bar is there. */
function barAt(x: number, y: number): number | null {
  const bar = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-choose-at]')
  const at = bar?.dataset.chooseAt
  return at === undefined ? null : Number(at)
}

/** A drag that chooses bars keeps the sheet from scrolling under it. */
const hold = (event: TouchEvent) => event.preventDefault()

/**
 * Bars chosen by touch, as Sibelius chooses them on a phone (ADR 0076, 0082), in the score editor and
 * the Player alike: a finger held still on a bar for `HOLD_MS` chooses it, and dragged on chooses
 * every bar from it to the one under the finger, on any line; the sheet holds still and the canvas
 * does not pan while it does (its moves are claimed with `preventDefault`), and the click it ends with
 * is its own. A mouse chooses with Shift. Returns the handlers for the bar a value names (its start
 * tick, or its index).
 */
export function useHoldToChoose(choose: (at: number, extend: boolean) => void) {
  const press = useRef<{ id: number; x: number; y: number; timer: number } | null>(null)
  const choosing = useRef<number | null>(null)
  /** The bar the drag last reached: it chooses again only as it reaches another. */
  const reached = useRef<number | null>(null)

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

  return (at: number) => ({
    'data-choose-at': at,
    onPointerDown(event: PointerEvent<HTMLElement>) {
      if (event.pointerType === 'mouse') return
      end()
      const { pointerId: id, clientX: x, clientY: y } = event
      const timer = window.setTimeout(() => {
        press.current = null
        choosing.current = id
        document.addEventListener('touchmove', hold, { passive: false })
        navigator.vibrate?.(10)
        reached.current = at
        choose(at, false)
        choose(at, true)
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
      const bar = barAt(event.clientX, event.clientY)
      if (bar === null || bar === reached.current) return
      reached.current = bar
      choose(bar, true)
    },
    onPointerUp: end,
    onPointerCancel: end,
  })
}
