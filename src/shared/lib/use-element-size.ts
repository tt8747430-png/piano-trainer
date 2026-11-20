import { useLayoutEffect, useState, type RefObject } from 'react'
import { flushSync } from 'react-dom'

/**
 * An element's content box as it changes, 0 by 0 until it is laid out. It is watched from before the
 * first paint, and a size reported (after layout, before paint, as a ResizeObserver reports) is drawn
 * in that same frame: what is sized from it (a staff, a cover, a grid) is at its size from the first
 * frame, never 0 wide for a frame and then pushing what is under it down.
 */
export function useElementSize(element: RefObject<HTMLElement | null>): {
  width: number
  height: number
} {
  const [size, setSize] = useState({ width: 0, height: 0 })
  useLayoutEffect(() => {
    const target = element.current
    if (!target) return
    const observer = new ResizeObserver(([entry]) =>
      flushSync(() =>
        setSize({
          width: entry?.contentBoxSize[0]?.inlineSize ?? 0,
          height: entry?.contentBoxSize[0]?.blockSize ?? 0,
        }),
      ),
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [element])
  return size
}
