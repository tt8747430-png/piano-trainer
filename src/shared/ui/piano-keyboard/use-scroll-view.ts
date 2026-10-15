import { useMemo, useSyncExternalStore, type RefObject } from 'react'
import type { ScrollMetrics } from '@/shared/lib'

const NOT_LAID_OUT: ScrollMetrics = { scrollLeft: 0, clientWidth: 0, scrollWidth: 0 }

const metricsOf = (element: HTMLElement): ScrollMetrics => ({
  scrollLeft: element.scrollLeft,
  clientWidth: element.clientWidth,
  scrollWidth: element.scrollWidth,
})

const same = (a: ScrollMetrics, b: ScrollMetrics) =>
  a.scrollLeft === b.scrollLeft &&
  a.clientWidth === b.clientWidth &&
  a.scrollWidth === b.scrollWidth

interface ScrollStore {
  readonly subscribe: (onChange: () => void) => () => void
  readonly read: () => ScrollMetrics
}

/** One store a scroller, however many follow it: it is measured once for all of them. */
const stores = new WeakMap<HTMLElement, ScrollStore>()

/**
 * A scroller as a store. While anything follows it, a scroll moves only where it is scrolled to, so
 * that is all it reads; the widths are measured again only as it or its keys change size. Its metrics
 * are kept, and read without making the browser lay the page out again after what it just wrote (a
 * key going down, each beat). A snapshot stays the same object until they change.
 */
function storeOf(element: HTMLElement): ScrollStore {
  const known = stores.get(element)
  if (known) return known
  const listeners = new Set<() => void>()
  let kept: ScrollMetrics = metricsOf(element)
  let followed = false
  const keep = (next: ScrollMetrics) => {
    if (same(kept, next)) return
    kept = next
    for (const listener of listeners) listener()
  }
  const scrolled = () => keep({ ...kept, scrollLeft: element.scrollLeft })
  const resized = () => keep(metricsOf(element))
  const observer = new ResizeObserver(resized)
  const store: ScrollStore = {
    subscribe(onChange) {
      if (!followed) {
        followed = true
        keep(metricsOf(element))
        element.addEventListener('scroll', scrolled, { passive: true })
        window.addEventListener('resize', resized)
        observer.observe(element)
        if (element.firstElementChild) observer.observe(element.firstElementChild)
      }
      listeners.add(onChange)
      return () => {
        listeners.delete(onChange)
        if (listeners.size > 0) return
        followed = false
        element.removeEventListener('scroll', scrolled)
        window.removeEventListener('resize', resized)
        observer.disconnect()
      }
    },
    // Unfollowed, it is measured as it is read.
    read: () => {
      if (!followed) {
        const next = metricsOf(element)
        if (!same(kept, next)) kept = next
      }
      return kept
    },
  }
  stores.set(element, store)
  return store
}

/** The scroller's store, through its ref: before the scroller exists, it is not laid out. */
export function scrollStore(scroller: RefObject<HTMLElement | null>): ScrollStore {
  return {
    subscribe: (onChange) => {
      const element = scroller.current
      return element ? storeOf(element).subscribe(onChange) : () => {}
    },
    read: () => {
      const element = scroller.current
      return element ? storeOf(element).read() : NOT_LAID_OUT
    },
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
