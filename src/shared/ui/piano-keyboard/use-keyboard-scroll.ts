import { useEffect, useEffectEvent, useLayoutEffect, useMemo, useRef, type RefObject } from 'react'
import {
  keepCentre,
  scrollToCentre,
  scrollToReveal,
  scrollToShow,
  spanOf,
  useScrollMotion,
  type KeyGeometry,
  type KeySize,
  type KeySpan,
} from '@/shared/lib'
import type { KeyRange } from '@/shared/lib/music'
import { scrollStore } from './use-scroll-view'

/**
 * The keyboard's scrolling: it opens centred on `inView` (its top where wider than the view; else on `span`, where the range that fills
 * its width sits), and centres again when the key size changes. When the range changes the keys
 * keep the same point in the middle, and `inView` is brought into sight moving no further than that
 * (`scrollToReveal`; of a stretch wider than the view, its top): the keys never swing from one
 * hand's notes to the other's.
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
    // Measured now: the key size may have just changed the keyboard's width.
    const now = {
      scrollLeft: 0,
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }
    const behavior = opened.current ? motion : 'instant'
    opened.current = true
    if (now.scrollWidth <= now.clientWidth) return
    const left = inView
      ? scrollToShow(now, spanOf(keys, inView))
      : scrollToCentre(now, (span.left + span.right) / 200)
    element.scrollTo({ left, behavior })
  })

  useLayoutEffect(() => {
    const element = scroller.current
    if (element) centreOnRange(element)
  }, [scroller, keySize])

  // The range grown or shrunk: the point in the middle stays there, measured before and after.
  const spanLeft = span.left
  const spanRight = span.right
  const keptSpan = useRef({ left: spanLeft, right: spanRight })
  useLayoutEffect(() => {
    const element = scroller.current
    const kept = keptSpan.current
    if (!element || (kept.left === spanLeft && kept.right === spanRight)) return
    keptSpan.current = { left: spanLeft, right: spanRight }
    const before = metrics.read()
    if (before.scrollWidth > 0)
      element.scrollTo({ left: keepCentre(before, element.scrollWidth), behavior: 'instant' })
  }, [scroller, metrics, spanLeft, spanRight])

  const viewFrom = inView?.from
  const viewTo = inView?.to
  useEffect(() => {
    const element = scroller.current
    if (!element || viewFrom === undefined || viewTo === undefined) return
    const left = scrollToReveal(metrics.read(), spanOf(keys, { from: viewFrom, to: viewTo }))
    if (left !== null) element.scrollTo({ left, behavior: motion })
  }, [scroller, metrics, keys, viewFrom, viewTo, motion])
}
