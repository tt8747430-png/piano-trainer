import { useEffect, type RefObject } from 'react'
import { useScrollMotion } from '@/shared/lib'
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
  const motion = useScrollMotion()
  useEffect(() => {
    const view = scroller.current
    const box = cursor.current?.offsetParent
    if (!view || x === null || view.scrollWidth <= view.clientWidth) return
    const origin = box instanceof HTMLElement ? box.offsetLeft : 0
    const left = followScroll(origin + x, { left: view.scrollLeft, width: view.clientWidth })
    if (left !== null) view.scrollTo({ left, behavior: motion })
  }, [scroller, cursor, x, motion])
}
