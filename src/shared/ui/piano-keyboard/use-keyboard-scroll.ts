import { useEffect, useEffectEvent, useLayoutEffect, useRef, type RefObject } from 'react'
import { spanOf, useMediaQuery, type KeyGeometry, type KeySpan } from '@/shared/lib'
import type { KeyRange } from '@/shared/lib/music'

/** Scrolls so `span` sits in the middle of the keyboard. */
function centre(element: HTMLElement, span: KeySpan, behavior: ScrollBehavior) {
  const width = element.scrollWidth
  if (width <= element.clientWidth) return
  const middle = ((span.left + span.right) / 2 / 100) * width
  element.scrollTo({ left: middle - element.clientWidth / 2, behavior })
}

/** Whether all of `span` is in the keyboard's visible part. */
function inSight(element: HTMLElement, span: KeySpan): boolean {
  const width = element.scrollWidth
  const shown = element.scrollLeft
  return (
    (span.left / 100) * width >= shown && (span.right / 100) * width <= shown + element.clientWidth
  )
}

/**
 * The keyboard's scrolling: it opens centred on `inView` (else on `span`, where the range that fills
 * its width sits), and centres again when the range changes; `inView` is scrolled to whenever part
 * of it is out of sight.
 */
export function useKeyboardScroll(
  scroller: RefObject<HTMLElement | null>,
  keys: readonly KeyGeometry[],
  span: KeySpan,
  inView: KeyRange | undefined,
) {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const opened = useRef(false)
  // The keys in view as they are when the range changes: following them is the next effect's.
  const centreOnRange = useEffectEvent((element: HTMLElement) => {
    const target = inView ? spanOf(keys, inView) : span
    centre(element, target, opened.current && !reduceMotion ? 'smooth' : 'instant')
    opened.current = true
  })

  useLayoutEffect(() => {
    const element = scroller.current
    if (element) centreOnRange(element)
  }, [scroller, span])

  const viewFrom = inView?.from
  const viewTo = inView?.to
  useEffect(() => {
    const element = scroller.current
    if (!element || viewFrom === undefined || viewTo === undefined) return
    const view = spanOf(keys, { from: viewFrom, to: viewTo })
    if (!inSight(element, view)) centre(element, view, reduceMotion ? 'instant' : 'smooth')
  }, [scroller, keys, viewFrom, viewTo, reduceMotion])
}
