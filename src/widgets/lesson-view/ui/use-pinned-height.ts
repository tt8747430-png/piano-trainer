import { useEffect, useState, type RefObject } from 'react'

/** How tall the keys pinned in `root` stand, the notch and the rail with them; 0 until laid out. */
export function usePinnedHeight(root: RefObject<HTMLElement | null>): number {
  const [height, setHeight] = useState(0)
  useEffect(() => {
    const pinned = root.current?.querySelector('[data-slot="pinned"]')
    if (!pinned) return
    const observer = new ResizeObserver(([entry]) =>
      setHeight(entry?.borderBoxSize[0]?.blockSize ?? 0),
    )
    observer.observe(pinned)
    return () => observer.disconnect()
  }, [root])
  return height
}
