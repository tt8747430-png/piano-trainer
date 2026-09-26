import { useMemo, useSyncExternalStore, type RefObject } from 'react'
import type { ScrollMetrics } from '@/shared/lib'

const NOT_LAID_OUT: ScrollMetrics = { scrollLeft: 0, clientWidth: 0, scrollWidth: 0 }

const same = (a: ScrollMetrics, b: ScrollMetrics) =>
  a.scrollLeft === b.scrollLeft &&
  a.clientWidth === b.clientWidth &&
  a.scrollWidth === b.scrollWidth

/** Each scroller's metrics as last read: a snapshot stays the same object until they change. */
const lastRead = new WeakMap<Element, ScrollMetrics>()

function metricsOf(element: HTMLElement | null): ScrollMetrics {
  if (!element) return NOT_LAID_OUT
  const next = {
    scrollLeft: element.scrollLeft,
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }
  const last = lastRead.get(element)
  if (last && same(last, next)) return last
  lastRead.set(element, next)
  return next
}

/** The scroller as a store: it changes as it scrolls and as the window resizes. */
function scrollStore(scroller: RefObject<HTMLElement | null>) {
  return {
    subscribe(onChange: () => void) {
      const element = scroller.current
      if (!element) return () => {}
      element.addEventListener('scroll', onChange, { passive: true })
      window.addEventListener('resize', onChange)
      return () => {
        element.removeEventListener('scroll', onChange)
        window.removeEventListener('resize', onChange)
      }
    },
    read: () => metricsOf(scroller.current),
  }
}

/**
 * Where the scroller is and what it holds, followed as it scrolls and as the window resizes. The
 * rail, and the map in it, come before the scroller, so on mount the map renders before the
 * scroller exists; React subscribes after every ref is set, reads the scroller again then, and
 * renders the map anew if the keyboard has scrolled to the keys that matter meanwhile.
 */
export function useScrollView(scroller: RefObject<HTMLElement | null>): ScrollMetrics {
  const store = useMemo(() => scrollStore(scroller), [scroller])
  return useSyncExternalStore(store.subscribe, store.read)
}
