import { useMediaQuery } from '@/shared/lib'

/** A phone on its side, as the `landscape-phone` variant says it: where the transport stands upright. */
const UPRIGHT = '(orientation: landscape) and (max-height: 500px) and (max-width: 1023px)'

/** Where the transport's pop-ups open: over it along the foot, left of it standing upright. */
export function useDockSide(): 'top' | 'left' {
  return useMediaQuery(UPRIGHT) ? 'left' : 'top'
}
