import { useMediaQuery } from './use-media-query'

/** How a scroll the app makes moves: smoothly, or at once where the learner reduces motion. */
export function useScrollMotion(): ScrollBehavior {
  return useMediaQuery('(prefers-reduced-motion: reduce)') ? 'instant' : 'smooth'
}
