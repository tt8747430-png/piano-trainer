import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react'
import { spanOf, useMediaQuery, type KeyGeometry } from '@/shared/lib'
import type { KeyRange } from '@/shared/lib/music'

/** Scrolls so the stretch from `left` to `right` (percent of the keyboard) sits in the middle. */
function centre(element: HTMLElement, left: number, right: number, behavior: ScrollBehavior) {
  const width = element.scrollWidth
  if (width <= element.clientWidth) return
  const middle = ((left + right) / 2 / 100) * width
  element.scrollTo({ left: middle - element.clientWidth / 2, behavior })
}

/**
 * The keyboard's scrolling: its range opens in the middle and moves there again when it changes;
 * `inView` is scrolled to whenever part of it is out of sight.
 */
export function useKeyboardScroll(
  scroller: RefObject<HTMLElement | null>,
  keys: readonly KeyGeometry[],
  range: { readonly left: number; readonly right: number },
  inView: KeyRange | undefined,
) {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const opened = useRef(false)
  const { left, right } = range

  useLayoutEffect(() => {
    const element = scroller.current
    if (!element) return
    centre(element, left, right, opened.current && !reduceMotion ? 'smooth' : 'instant')
    opened.current = true
  }, [scroller, left, right, reduceMotion])

  const viewFrom = inView?.from
  const viewTo = inView?.to
  useEffect(() => {
    const element = scroller.current
    if (!element || viewFrom === undefined || viewTo === undefined) return
    const view = spanOf(keys, { from: viewFrom, to: viewTo })
    const width = element.scrollWidth
    const shown = element.scrollLeft
    const seen =
      (view.left / 100) * width >= shown &&
      (view.right / 100) * width <= shown + element.clientWidth
    if (!seen) centre(element, view.left, view.right, reduceMotion ? 'instant' : 'smooth')
  }, [scroller, keys, viewFrom, viewTo, reduceMotion])
}
