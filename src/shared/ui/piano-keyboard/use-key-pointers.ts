import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  type PointerEvent,
  type RefObject,
} from 'react'
import { keyAt, PIANO_LAYOUT, usePresses, type Swipe } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'

/** The press of a click no pointer made: no pointer has this id. */
const NO_POINTER = -1
/** How far a finger moves sideways on the keys, in Scroll, before it drags them and lets its key go. */
const SWIPE_START = 10
/** A swipe's glide once its finger lifts: its speed kept each frame, and the speed it stops under. */
const GLIDE = { kept: 0.94, least: 0.05 } as const

/**
 * A key plays the instant a pointer touches it, and the keys never scroll under it by themselves
 * (they take the finger from the page). Scroll: that key only, down until the finger lifts; a finger
 * moved sideways past `SWIPE_START` lets its key go and drags the keys (`scroller`), gliding on as
 * it lifts, while other fingers hold their keys. Glissando: every key a
 * pointer enters plays, once per entry, each pointer on its own. A key is down at least the
 * shortest press, so a tap as light as a trackpad's shows. No capture is needed: a touch or pen is
 * captured by the key it went down on, so its moves and its lift reach the group; a mouse released
 * outside is forgotten at its next move, and every pointer as the window loses focus or hides. A pointer's own click never plays again; any other click
 * (Enter, Space, a screen reader) plays once. A key a pointer leaves or lifts from is let go
 * (`onRelease`), before the next it enters plays; a click no pointer made plays, then lets go.
 */
export function useKeyPointers({
  swipe,
  keys,
  scroller,
  onPress,
  onRelease,
}: {
  swipe: Swipe
  /** The keys' group, whose box a pointer's position is read against. */
  keys: RefObject<HTMLElement | null>
  /** What a swipe in Scroll drags sideways. */
  scroller: RefObject<HTMLElement | null>
  onPress: (key: Midi) => void
  onRelease: (key: Midi) => void
}) {
  /** Each pointer down on the keys, and the key it is on (null between keys, in Glissando). */
  const pointers = useRef(new Map<number, Midi | null>())
  const presses = usePresses<number>()
  const { press, release } = presses
  /**
   * The key each pointer went down on, until its click: the click that follows belongs to that
   * press. One for each pointer, so two fingers' late clicks are each their own press's.
   */
  const awaitingClick = useRef(new Map<number, Midi>())
  /** Where each finger went down and last was, and how fast it moved (px a ms): a swipe's. */
  const tracks = useRef(new Map<number, { startX: number; x: number; at: number; speed: number }>())
  /** The fingers dragging the keys. */
  const swiping = useRef(new Set<number>())
  const glide = useRef(0)
  const stopGlide = () => cancelAnimationFrame(glide.current)
  useEffect(() => stopGlide, [])

  /** The pointer is on `key` (or between keys): its press moves there, letting go of the key it left. */
  const moveTo = useCallback(
    (pointerId: number, key: Midi | null) => {
      const left = pointers.current.get(pointerId)
      pointers.current.set(pointerId, key)
      if (left != null && left !== key) onRelease(left)
      if (key === null) release(pointerId)
      else press(pointerId, key)
    },
    [press, release, onRelease],
  )

  const forget = (pointerId: number) => {
    const left = pointers.current.get(pointerId)
    if (!pointers.current.delete(pointerId)) return
    release(pointerId)
    if (left != null) onRelease(left)
  }

  // The window losing focus or the page hidden takes the pointers' lifts away: let go of every key
  // they hold, or a mouse held down would sound on.
  const forgetAll = useEffectEvent(() => {
    for (const pointerId of [...pointers.current.keys()]) forget(pointerId)
  })
  useEffect(() => {
    const hidden = () => {
      if (document.visibilityState === 'hidden') forgetAll()
    }
    window.addEventListener('blur', forgetAll)
    document.addEventListener('visibilitychange', hidden)
    return () => {
      window.removeEventListener('blur', forgetAll)
      document.removeEventListener('visibilitychange', hidden)
    }
  }, [])

  const pointerDown = useCallback(
    (key: Midi, event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      stopGlide()
      tracks.current.set(event.pointerId, {
        startX: event.clientX,
        x: event.clientX,
        at: event.timeStamp,
        speed: 0,
      })
      awaitingClick.current.set(event.pointerId, key)
      moveTo(event.pointerId, key)
      onPress(key)
    },
    [onPress, moveTo],
  )

  // A click no pointer made (Enter, Space, a screen reader) has no click count: it always plays,
  // and its key goes down for the shortest press, as a tap's does.
  const click = useCallback(
    (key: Midi, clickCount: number) => {
      if (clickCount !== 0) {
        for (const [pointerId, pressed] of awaitingClick.current) {
          if (pressed !== key) continue
          awaitingClick.current.delete(pointerId)
          return
        }
      }
      press(NO_POINTER, key)
      release(NO_POINTER)
      onPress(key)
      onRelease(key)
    },
    [onPress, onRelease, press, release],
  )

  /** A finger's swipe: the keys dragged by how far it moved since it was last seen. */
  const drag = (event: PointerEvent<HTMLElement>) => {
    const track = tracks.current.get(event.pointerId)
    const element = scroller.current
    if (!track || !element) return
    const moved = event.clientX - track.x
    const elapsed = Math.max(1, event.timeStamp - track.at)
    tracks.current.set(event.pointerId, {
      ...track,
      x: event.clientX,
      at: event.timeStamp,
      speed: moved / elapsed,
    })
    element.scrollTo({ left: element.scrollLeft - moved, behavior: 'instant' })
  }

  /** A swipe's finger lifted: the keys glide on at its speed, slowing each frame. */
  const glideFrom = (pointerId: number) => {
    const element = scroller.current
    let speed = tracks.current.get(pointerId)?.speed ?? 0
    if (!element || Math.abs(speed) < GLIDE.least) return
    let last = performance.now()
    const step = (now: number) => {
      element.scrollTo({ left: element.scrollLeft - speed * (now - last), behavior: 'instant' })
      last = now
      speed *= GLIDE.kept
      if (Math.abs(speed) >= GLIDE.least) glide.current = requestAnimationFrame(step)
    }
    glide.current = requestAnimationFrame(step)
  }

  const lift = (pointerId: number) => {
    if (swiping.current.delete(pointerId)) glideFrom(pointerId)
    tracks.current.delete(pointerId)
    forget(pointerId)
  }

  const group = {
    onPointerMove(event: PointerEvent<HTMLElement>) {
      if (swiping.current.has(event.pointerId)) {
        drag(event)
        return
      }
      if (!pointers.current.has(event.pointerId)) return
      const track = tracks.current.get(event.pointerId)
      if (
        swipe === 'scroll' &&
        event.pointerType !== 'mouse' &&
        track &&
        Math.abs(event.clientX - track.startX) >= SWIPE_START
      ) {
        // A swipe, not a press: its key is let go (its click still swallowed) and the keys follow it.
        swiping.current.add(event.pointerId)
        forget(event.pointerId)
        drag(event)
        return
      }
      if (event.pointerType === 'mouse' && event.buttons === 0) {
        forget(event.pointerId)
        return
      }
      const box = keys.current?.getBoundingClientRect()
      if (swipe === 'scroll' || !box) return
      const key = keyAt(
        PIANO_LAYOUT.keys,
        (event.clientX - box.left) / box.width,
        (event.clientY - box.top) / box.height,
      )
      if (key === pointers.current.get(event.pointerId)) return
      moveTo(event.pointerId, key)
      if (key !== null) onPress(key)
    },
    onPointerLeave(event: PointerEvent<HTMLElement>) {
      if (swiping.current.has(event.pointerId) || !pointers.current.has(event.pointerId)) return
      if (swipe === 'scroll') {
        forget(event.pointerId)
        return
      }
      // A mouse between the keys and the page: coming back, the key it enters plays.
      moveTo(event.pointerId, null)
    },
    onPointerUp: (event: PointerEvent<HTMLElement>) => lift(event.pointerId),
    onPointerCancel(event: PointerEvent<HTMLElement>) {
      awaitingClick.current.delete(event.pointerId)
      lift(event.pointerId)
    },
    // After a key's own click handler: with no pointer down, no click is still to come (a press
    // whose click went elsewhere is over), so the next click on a key is a new press.
    onClick() {
      if (pointers.current.size === 0) awaitingClick.current.clear()
    },
    // A long press opens the context menu instead of clicking: its press is over.
    onContextMenu() {
      awaitingClick.current.clear()
    },
  }

  return { pressed: presses.keys, pointerDown, click, group }
}
