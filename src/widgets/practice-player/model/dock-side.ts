import { LANDSCAPE_PHONE, useMediaQuery } from '@/shared/lib'

/** Where the transport's pop-ups open: over it along the foot, left of it upright on a phone on its side. */
export function useDockSide(): 'top' | 'left' {
  return useMediaQuery(LANDSCAPE_PHONE) ? 'left' : 'top'
}
