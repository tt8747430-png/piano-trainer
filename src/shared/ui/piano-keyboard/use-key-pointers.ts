import { useCallback, useRef, type PointerEvent, type RefObject } from 'react'
import { keyAt, PIANO_LAYOUT, usePresses, type Swipe } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'

/**
 * A key plays the instant a pointer touches it, and the keys never scroll under it (they take the
 * finger from the page). Scroll: that key only, down until the finger lifts. Glissando: every key a
 * pointer enters plays, once per entry, each pointer on its own. A key is down at least the
 * shortest press, so a tap as light as a trackpad's shows. No capture is needed: a touch or pen is
 * captured by the key it went down on, so its moves and its lift reach the group; a mouse released
 * outside is forgotten at its next move. A pointer's own click never plays again; any other click
 * (Enter, Space, a screen reader) plays once.
 */
export function useKeyPointers({
  swipe,
  keys,
  onPress,
}: {
  swipe: Swipe
  /** The keys' group, whose box a pointer's position is read against. */
  keys: RefObject<HTMLElement | null>
  onPress: (key: Midi) => void
}) {
  /** Each pointer down on the keys, and the key it is on (null between keys, in Glissando). */
  const pointers = useRef(new Map<number, Midi | null>())
  const presses = usePresses<number>()
  const { press, release } = presses
  /** The key a pointer went down on: the pointer's click that follows belongs to that press. */
  const pointerKey = useRef<Midi | null>(null)

  /** The pointer is on `key` (or between keys): its press moves there. */
  const moveTo = useCallback(
    (pointerId: number, key: Midi | null) => {
      pointers.current.set(pointerId, key)
      if (key === null) release(pointerId)
      else press(pointerId, key)
    },
    [press, release],
  )

  const forget = (pointerId: number) => {
    if (!pointers.current.delete(pointerId)) return
    release(pointerId)
  }

  const pointerDown = useCallback(
    (key: Midi, event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      pointerKey.current = key
      moveTo(event.pointerId, key)
      onPress(key)
    },
    [onPress, moveTo],
  )

  // A click no pointer made (Enter, Space, a screen reader) has no click count: it always plays.
  const click = useCallback(
    (key: Midi, clickCount: number) => {
      if (clickCount === 0 || pointerKey.current !== key) onPress(key)
    },
    [onPress],
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
      pointerKey.current = null
      forget(event.pointerId)
    },
    // After a key's own click handler: the next click on a key is a new press.
    onClick() {
      pointerKey.current = null
    },
    onKeyDownCapture() {
      pointerKey.current = null
    },
    // A long press opens the context menu instead of clicking: its press is over.
    onContextMenu() {
      pointerKey.current = null
    },
  }

  return { pressed: presses.keys, pointerDown, click, group }
}
