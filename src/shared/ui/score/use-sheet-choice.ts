import { useEffect, useRef, type MouseEvent, type PointerEvent } from 'react'

/** How long a finger holds still before it chooses, as a notation app's long press. */
export const HOLD_MS = 450
/** How far a finger may move during the hold and still be holding: past it, it scrolls the sheet. */
const STILL_PX = 8

/** A point on a line's engraving, in its layout's px. */
export interface SheetPoint {
  readonly x: number
  readonly y: number
}

/** What the one selection's gestures say to a sheet (ADR 0096), the editor's and the Player's alike. */
export interface SheetChoice {
  /**
   * A click or tap on bar `bar` at a point (none: the bar's button pressed from the keys), Shift
   * extending what is chosen; a finger held still there, the same without Shift, `held` (a tap may
   * open what is printed there, ADR 0096; a hold only chooses).
   */
  readonly at: (bar: number, point: SheetPoint | null, extend: boolean, held: boolean) => void
  /** The held finger dragged on to another bar, on any line: what is chosen reaches it. */
  readonly reach: (bar: number) => void
}

/** The bar under a point on the screen, or null where no bar is there. */
function barAt(x: number, y: number): number | null {
  const bar = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-choose-at]')
  const at = bar?.dataset.chooseAt
  return at === undefined ? null : Number(at)
}

/**
 * Where a pointer is on the engraving: its place in the bar's button, the button laid out from
 * `origin`; a page canvas zooms the button (ADR 0096), its box on the screen as much larger.
 */
function pointIn(element: HTMLElement, origin: SheetPoint, x: number, y: number): SheetPoint {
  const box = element.getBoundingClientRect()
  const laid = element.offsetWidth
  const zoom = laid > 0 && box.width > 0 ? box.width / laid : 1
  return { x: origin.x + (x - box.left) / zoom, y: origin.y + (y - box.top) / zoom }
}

/** A drag that chooses keeps the sheet from scrolling under it. */
const hold = (event: TouchEvent) => event.preventDefault()

/**
 * The one selection's gestures over a line's bars (ADR 0096), the same in the score editor and
 * the Player in every layout: a click or tap chooses what is under it (`at`, with its point on the
 * engraving), Shift with a click extends what is chosen to it, a finger held still for `HOLD_MS`
 * chooses what is under it and, dragged on, extends it to each bar it reaches (`reach`), on any line;
 * the sheet holds still and the canvas does not pan while it does, and the click it ends with is its
 * own. Returns the props for bar `bar`'s button, laid out from `origin` on the engraving.
 */
export function useSheetChoice(choice: SheetChoice) {
  const press = useRef<{ id: number; x: number; y: number; timer: number } | null>(null)
  const choosing = useRef<number | null>(null)
  /** The bar the drag last reached: it reaches again only as it reaches another. */
  const reached = useRef<number | null>(null)
  const latest = useRef(choice)
  useEffect(() => {
    latest.current = choice
  })

  /** Lets go of the click a drag ended with, while it is still waited for. */
  const unswallow = useRef<(() => void) | null>(null)
  const end = () => {
    if (press.current) window.clearTimeout(press.current.timer)
    press.current = null
    if (choosing.current === null) return
    choosing.current = null
    document.removeEventListener('touchmove', hold)
    // The click the drag ends with chose nothing: it is the drag's.
    const swallow = (click: globalThis.MouseEvent) => {
      click.stopPropagation()
      click.preventDefault()
    }
    window.addEventListener('click', swallow, { capture: true, once: true })
    const release = () => {
      window.removeEventListener('click', swallow, { capture: true })
      unswallow.current = null
    }
    unswallow.current = release
    window.setTimeout(release, 0)
  }
  // Leaving, nothing waits for a click: a sheet gone takes no later click with it.
  useEffect(
    () => () => {
      end()
      unswallow.current?.()
    },
    [],
  )

  return (bar: number, origin: SheetPoint) => ({
    'data-choose-at': bar,
    onClick(event: MouseEvent<HTMLElement>) {
      // Enter or Space on the bar's button: the bar itself.
      const point =
        event.detail === 0
          ? null
          : pointIn(event.currentTarget, origin, event.clientX, event.clientY)
      latest.current.at(bar, point, event.shiftKey, false)
    },
    onPointerDown(event: PointerEvent<HTMLElement>) {
      if (event.pointerType === 'mouse') return
      end()
      const { pointerId: id, clientX: x, clientY: y } = event
      const element = event.currentTarget
      const timer = window.setTimeout(() => {
        press.current = null
        choosing.current = id
        document.addEventListener('touchmove', hold, { passive: false })
        navigator.vibrate?.(10)
        reached.current = bar
        latest.current.at(bar, pointIn(element, origin, x, y), false, true)
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
      const under = barAt(event.clientX, event.clientY)
      if (under === null || under === reached.current) return
      reached.current = under
      latest.current.reach(under)
    },
    onPointerUp: end,
    onPointerCancel: end,
  })
}
