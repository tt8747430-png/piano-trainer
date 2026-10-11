import { useEffect, useState, type RefObject } from 'react'

/** An element's content box as it changes: 0 by 0 until it is laid out. */
export function useElementSize(element: RefObject<HTMLElement | null>): {
  width: number
  height: number
} {
  const [size, setSize] = useState({ width: 0, height: 0 })
  useEffect(() => {
    const target = element.current
    if (!target) return
    const observer = new ResizeObserver(([entry]) =>
      setSize({
        width: entry?.contentBoxSize[0]?.inlineSize ?? 0,
        height: entry?.contentBoxSize[0]?.blockSize ?? 0,
      }),
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [element])
  return size
}
