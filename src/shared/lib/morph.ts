import { flushSync } from 'react-dom'

/**
 * Makes a change to the screen inside a view transition, so an element named alike before and after
 * (`view-transition-name`) morphs from its old place and shape into its new one: the folded keys'
 * button into the keys. At once where the browser has none, or the learner asks for less motion.
 */
export function morph(change: () => void): void {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!('startViewTransition' in document) || still) {
    change()
    return
  }
  document.startViewTransition(() => flushSync(change))
}
