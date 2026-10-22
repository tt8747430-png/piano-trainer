import {
  useCallback,
  useRef,
  useState,
  type PointerEvent,
  type TouchEvent,
  type WheelEvent,
} from 'react'

/** How far a finger, a mouse or the wheel moves the music before it is read, not tapped, in CSS px. */
export const READ_DISTANCE = 24

/** A grip (a note's, the loop's) drags what it holds: that is work, not reading. */
const onGrip = (target: EventTarget) =>
  target instanceof Element && target.closest('[data-grip]') !== null

/**
 * What floats over the music (a transport, a palette), in sight until the music is read: dragged,
 * scrolled by a finger or the wheel, or pinched, as a reading app's bars step aside (forScore,
 * Apple Books). `reading` goes on the music's area; `show` and `setShown` are for taps, which bring
 * it back. Only what the learner moves counts: the music scrolled to follow a play hides nothing.
 */
export function useHiddenWhileReading() {
  const [shown, setShown] = useState(true)
  const from = useRef<{ x: number; y: number } | null>(null)
  const wheeled = useRef(0)
  const read = useCallback((x: number, y: number) => {
    const start = from.current
    if (start && Math.hypot(x - start.x, y - start.y) > READ_DISTANCE) {
      from.current = null
      setShown(false)
    }
  }, [])
  const show = useCallback(() => {
    wheeled.current = 0
    setShown(true)
  }, [])
  const reading = {
    // A touch's own pointer stops as the page takes over its scroll: its touches say how far it went.
    onPointerDown: (event: PointerEvent) => {
      from.current =
        event.pointerType === 'touch' || onGrip(event.target)
          ? null
          : { x: event.clientX, y: event.clientY }
    },
    onPointerMove: (event: PointerEvent) => {
      // A move what it is over claimed (bars chosen by a held finger) is work, not reading.
      if (event.buttons !== 0 && !event.defaultPrevented) read(event.clientX, event.clientY)
    },
    onTouchStart: (event: TouchEvent) => {
      const touch = event.touches[0]
      if (event.touches.length > 1) setShown(false)
      from.current = touch && !onGrip(event.target) ? { x: touch.clientX, y: touch.clientY } : null
    },
    onTouchMove: (event: TouchEvent) => {
      const touch = event.touches[0]
      if (touch && !event.defaultPrevented) read(touch.clientX, touch.clientY)
    },
    onWheel: (event: WheelEvent) => {
      wheeled.current += Math.abs(event.deltaX) + Math.abs(event.deltaY)
      if (wheeled.current > READ_DISTANCE) setShown(false)
    },
  }
  return { shown, setShown, show, reading }
}
