import { useLayoutEffect } from 'react'

/** The custom properties an element's size is published as, and how each length is written. */
export interface RootSizeNames {
  /** Its height, e.g. `--docked`. */
  readonly block?: string
  /** Its width, e.g. `--floating-inline`. */
  readonly inline?: string
  /** A length as the property holds it: `${px}px` unless said. */
  readonly write?: (px: number) => string
}

const pixels = (px: number) => `${px}px`

/**
 * An element's border box published on the page's root as custom properties while it is shown, so
 * what pads or floats clear of it (the docked keys, the floating actions) reads its size from CSS.
 * Measured before the first paint, so nothing starts in the wrong place and jumps (A31); taken off
 * as it goes.
 */
export function useRootSize(
  element: HTMLElement | null,
  { block, inline, write = pixels }: RootSizeNames,
) {
  useLayoutEffect(() => {
    if (!element) return
    const root = document.documentElement.style
    const publish = (height: number, width: number) => {
      if (block) root.setProperty(block, write(height))
      if (inline) root.setProperty(inline, write(width))
    }
    const box = element.getBoundingClientRect()
    publish(box.height, box.width)
    const observer = new ResizeObserver(([entry]) => {
      const size = entry?.borderBoxSize[0]
      publish(size?.blockSize ?? 0, size?.inlineSize ?? 0)
    })
    observer.observe(element)
    return () => {
      observer.disconnect()
      if (block) root.removeProperty(block)
      if (inline) root.removeProperty(inline)
    }
  }, [element, block, inline, write])
}
