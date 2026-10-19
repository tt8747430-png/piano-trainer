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

/**
 * A key plays the instant a pointer touches it, and the keys never scroll under it (they take the
 * finger from the page). Scroll: that key only, down until the finger lifts. Glissando: every key a
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
  onPress,
  onRelease,
}: {
  swipe: Swipe
  /** The keys' group, whose box a pointer's position is read against. */
  keys: RefObject<HTMLElement | null>
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

  const group = {
    onPointerMove(event: PointerEvent<HTMLElement>) {
      if (!pointers.current.has(event.pointerId)) return
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
      if (!pointers.current.has(event.pointerId)) return
      if (swipe === 'scroll') {
        forget(event.pointerId)
        return
      }
      // A mouse between the keys and the page: coming back, the key it enters plays.
      moveTo(event.pointerId, null)
    },
    onPointerUp: (event: PointerEvent<HTMLElement>) => forget(event.pointerId),
    onPointerCancel(event: PointerEvent<HTMLElement>) {
      awaitingClick.current.delete(event.pointerId)
      forget(event.pointerId)
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
