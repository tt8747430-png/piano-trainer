import { REDUCED_MOTION, useMediaQuery } from './use-media-query'

/** How a scroll the app makes moves: smoothly, or at once where the learner reduces motion. */
export function useScrollMotion(): ScrollBehavior {
  return useMediaQuery(REDUCED_MOTION) ? 'instant' : 'smooth'
}
