import { useEffect, useEffectEvent, useLayoutEffect, useMemo, useRef, type RefObject } from 'react'
import {
  spanOf,
  useScrollMotion,
  type KeyGeometry,
  type KeySize,
  type KeySpan,
  type ScrollMetrics,
} from '@/shared/lib'
import type { KeyRange } from '@/shared/lib/music'
import { scrollStore } from './use-scroll-view'

/** Scrolls so `span` sits in the middle of the keyboard, measured as `metrics`. */
function centre(
  element: HTMLElement,
  { clientWidth, scrollWidth }: ScrollMetrics,
  span: KeySpan,
  behavior: ScrollBehavior,
) {
  if (scrollWidth <= clientWidth) return
  const middle = ((span.left + span.right) / 2 / 100) * scrollWidth
  element.scrollTo({ left: middle - clientWidth / 2, behavior })
}

/** Whether all of `span` is in the keyboard's visible part. */
function inSight({ scrollLeft, clientWidth, scrollWidth }: ScrollMetrics, span: KeySpan): boolean {
  return (
    (span.left / 100) * scrollWidth >= scrollLeft &&
    (span.right / 100) * scrollWidth <= scrollLeft + clientWidth
  )
}

/**
 * The keyboard's scrolling: it opens centred on `inView` (else on `span`, where the range that fills
 * its width sits), and centres again when the range or the key size changes; `inView` is scrolled
 * to whenever part of it is out of sight.
 */
export function useKeyboardScroll(
  scroller: RefObject<HTMLElement | null>,
  keys: readonly KeyGeometry[],
  span: KeySpan,
  inView: KeyRange | undefined,
  keySize: KeySize,
) {
  const motion = useScrollMotion()
  const opened = useRef(false)
  // Where the keyboard is scrolled, kept as it scrolls and resizes: the keys in view change with
  // every beat, and asking the page then would make it lay out again after each key went down.
  const metrics = useMemo(() => scrollStore(scroller), [scroller])
  useEffect(() => metrics.subscribe(() => undefined), [metrics])
  // The keys in view as they are when the range changes: following them is the next effect's.
  const centreOnRange = useEffectEvent((element: HTMLElement) => {
    const target = inView ? spanOf(keys, inView) : span
    // Measured now: the key size may have just changed the keyboard's width.
    const now = {
      scrollLeft: 0,
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }
    centre(element, now, target, opened.current ? motion : 'instant')
    opened.current = true
  })

  useLayoutEffect(() => {
    const element = scroller.current
    if (element) centreOnRange(element)
  }, [scroller, span, keySize])

  const viewFrom = inView?.from
  const viewTo = inView?.to
  useEffect(() => {
    const element = scroller.current
    if (!element || viewFrom === undefined || viewTo === undefined) return
    const view = spanOf(keys, { from: viewFrom, to: viewTo })
    const seen = metrics.read()
    if (!inSight(seen, view)) centre(element, seen, view, motion)
  }, [scroller, metrics, keys, viewFrom, viewTo, motion])
}
