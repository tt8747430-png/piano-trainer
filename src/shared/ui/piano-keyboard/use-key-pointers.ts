import { useCallback, useRef, useState, type PointerEvent, type RefObject } from 'react'
import { keyAt, PIANO_LAYOUT, type Swipe } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'

const NONE: ReadonlySet<Midi> = new Set()

/**
 * A key plays the instant a pointer touches it. Scroll: that key only; the browser takes a swipe
 * and cancels the press. Glissando: every key a pointer enters plays, once per entry, each pointer
 * on its own. No capture is needed: a touch or pen is captured by the key it went down on, so its
 * moves and its lift reach the group; a mouse released outside is forgotten at its next move. A
 * pointer's own click never plays again; any other click (Enter, Space, a screen reader) plays once.
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
  const [pressed, setPressed] = useState<ReadonlySet<Midi>>(NONE)
  /** The key a pointer went down on: the click that follows belongs to that press. */
  const pointerKey = useRef<Midi | null>(null)

  const show = useCallback(() => {
    const down = [...pointers.current.values()].filter((key) => key !== null)
    setPressed(down.length === 0 ? NONE : new Set(down))
  }, [])

  const forget = (pointerId: number) => {
    if (pointers.current.delete(pointerId)) show()
  }

  const pointerDown = useCallback(
    (key: Midi, event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      pointerKey.current = key
      pointers.current.set(event.pointerId, key)
      show()
      onPress(key)
    },
    [onPress, show],
  )

  const click = useCallback(
    (key: Midi) => {
      if (pointerKey.current !== key) onPress(key)
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
      pointers.current.set(event.pointerId, key)
      show()
      if (key !== null) onPress(key)
    },
    onPointerLeave(event: PointerEvent<HTMLElement>) {
      if (!pointers.current.has(event.pointerId)) return
      if (swipe === 'scroll') {
        forget(event.pointerId)
        return
      }
      // A mouse between the keys and the page: coming back, the key it enters plays.
      pointers.current.set(event.pointerId, null)
      show()
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
  }

  return { pressed, pointerDown, click, group }
}
