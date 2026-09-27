import { useEffect, type RefObject } from 'react'
import { useMediaQuery } from '@/shared/lib'
import { followScroll } from '../model/follow'

/**
 * Keeps the cursor in sight in the sheet's scroller. The cursor's x counts from the engraving's
 * box, which sits `offsetLeft` into the scroller.
 */
export function useFollow(
  scroller: RefObject<HTMLElement | null>,
  cursor: RefObject<HTMLElement | null>,
  x: number | null,
) {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  useEffect(() => {
    const view = scroller.current
    const box = cursor.current?.offsetParent
    if (!view || x === null || view.scrollWidth <= view.clientWidth) return
    const origin = box instanceof HTMLElement ? box.offsetLeft : 0
    const left = followScroll(origin + x, { left: view.scrollLeft, width: view.clientWidth })
    if (left !== null) view.scrollTo({ left, behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [scroller, cursor, x, reduceMotion])
}
